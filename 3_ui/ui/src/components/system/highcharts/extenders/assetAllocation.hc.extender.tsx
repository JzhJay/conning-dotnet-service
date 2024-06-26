import {reaction} from 'mobx';
import {ChartData, ChartDataRef} from '../../../../stores/charting';
import {IO} from '../../../../stores/io';
import {getStatusPoints} from '../dataTemplates/statusTemplate';
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {AssetAllocationTooltip, EfficientFrontierTooltip} from '../internal-components/tooltips';
import {HoverColumn} from './helper/HoverColumn';
import {HighchartsExtender} from './highchartsExtender';
import {AxisAlignmentType} from 'stores/queryResult';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class AssetAllocationChartHighchartsExtender extends HighchartsExtender{
    constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
        super(chartComponent, highchartsOptions, false);

	    this.hoverColumn = new HoverColumn(chartComponent);

	    let _thisClass = this;
	    highchartsOptions.plotOptions.series.dataLabels.formatter = function () {
		    return this.y == 0 ? null : _thisClass.dataFormatter(this.y);
	    };

	    const io = this.chartComponent.props.chartingResult as IO;
	    this._toDispose.push(reaction(() => io.updateCount, io.sequencedUpdate(async () => {
		    if (this.chartComponent.isUnmounting)
			    return;

		    console.time("assetAllocation")
	    	let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate("assetAllocation", chartComponent.userOptions);
		    let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

		    //chartComponent.updateChartData(chartData);

		    this.chart.series.forEach((s, i) => {
			    const series = chartData.series[i];
			    // Update full series including legend where series visibility in legend may change.
			    // Optimization: Only update series that are currently visible in the legend or will be visible.
			    if (s.options.showInLegend || series.showInLegend)
			        s.update(series, false);
		    })

		    this.chart.xAxis[0].update({categories: chartData.xAxis[0].categories, max: chartData.xAxis[0].categories.length - 1}, false);
		    this.resetToDefaultAxisLimits();

		    this.chart.redraw();
		    console.timeEnd("assetAllocation")
	    })))
    }

    hoverColumn;

	/**
	 * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
	 * @param {type} chartInit    The object that will be passed to highchart to create chart
	 * @returns {undefined}
	 */
	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit);

		chartInit.plotOptions.series.events.legendItemClick = function (event) {
			event.preventDefault();
		};

		chartInit.tooltip.positioner = (labelWidth, labelHeight, point) => {
			const {tooltip} = this.chart;
			return tooltip.shared ? {x: point.plotX, y: this.chart.yAxis[0].toPixels(0) - labelHeight} : tooltip.getPosition(labelWidth, labelHeight, point);
		}
	}

	dataFormatter(i: number) {
		return _.isFinite(i) ? `${i.toFixed(2)}%` : '';
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><AssetAllocationTooltip point={p} chart={this.chart} assets={this.chart.userOptions.assets} chartingResult={this.chartComponent.props.chartingResult as IO} userOptions={this.chartComponent.props.userOptions} dataFormatter={this.dataFormatter}/></RawIntlProvider>);
	}

	drawLegendSymbol(originalFunction, series, legend, item) {
		legend.symbolHeight = legend.fontMetrics.h;

		// Force the height to match the symbol height to make sure there are no overlaps or spaces between legend items
		item.legendItemHeight = legend.symbolHeight;

		originalFunction.apply(series, [].slice.call(arguments, 2));
	}

	wrapHighchart() {
		let _thisClass = this;
		super.wrapHighchart();

		_thisClass.wrap("chart", Highcharts.Legend.prototype, "renderItem", function (p, item) {
			return _thisClass.renderItem(p, this, item);
		})
	}

	updateSeriesVisibilities(chart, hoverSeries, isVisible) {
		chart.series.forEach((seriesItem) => {
			seriesItem.setVisible(isVisible || seriesItem === hoverSeries, false);
		});

		chart.redraw();
	}

	inHoverMode = false;
	seriesTimer = null;
	axisTimer = null;
	lastHoverSeries = null;

	renderItem(originalFunction, legend, item) {
		originalFunction.call(legend, item);

		const chart = item.chart,
		      series = chart.series,
		      element = item.legendGroup.element,
		      yAxis = chart.yAxis[0];

		element.onmouseover = () => {
			series.forEach((seriesItem) => {
				if (seriesItem !== item) {
					seriesItem.group.animate({
						opacity: 0.25
					}, {
						duration: 150
					});
				}
			});

			const setYMax = () => {
				yAxis.setExtremes(0, _.max(_.flatten(chart.series.map(s => s.userOptions.data.map(d => d.y)))));
			}

			clearTimeout(this.seriesTimer);

			if (this.inHoverMode) {
				this.lastHoverSeries.setVisible(false);
				item.setVisible(true, false);
				chart.redraw(false);
				//setYMax(); // Why was this ever needed? Max established when hover mode was entered should remain valid and this slows down interaction.
			} else {
				this.seriesTimer = setTimeout(() => {
					this.updateSeriesVisibilities(chart, item, false);
					this.inHoverMode = true;

					this.axisTimer = setTimeout(() => {
						setYMax();
					}, 500);

				}, 1000);
			}
		}

		element.onmouseout = () => {

			if (this.seriesTimer) {
				this.lastHoverSeries = item;
				clearTimeout(this.seriesTimer);
				clearTimeout(this.axisTimer);

				this.seriesTimer = setTimeout(() => {
					this.updateSeriesVisibilities(chart, item, true);
					this.inHoverMode = false;
					yAxis.setExtremes(0, 100);
				}, 1000)
			}

			series.forEach((seriesItem) => {
				if (seriesItem !== item) {
					seriesItem.group.animate({
						opacity: 1
					}, {
						duration: 50
					});
				}
			});
		}
	}

	/**
	 * Point mouse out callback. Fired when the mouse leaves the areas close to the point.
	 * @param point   The target point
	 * @returns {undefined}
	 */
	pointMouseOut(point) {
		this.chart.tooltip.hide();
	}

	cleanup() {
		super.cleanup();
		this.hoverColumn.cleanup();
	}

	enableAxisLabelAction() {
		return this.chartComponent.userOptions.columnMode !== '';
	}

	/**
	 * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
	 * @params axis         The target axis
	 * @params axisLabel    The target label
	 * @params e            The associated event
	 * @returns {undefined}
	 */
	axisLabelOnMouseOver(axis, axisLabel, e) {

		if (axis.coll === "yAxis" || !this.enableAxisLabelAction())
			return;
		this.showSharedTooltip(axisLabel.chart, e, axisLabel.textContent)

		axisLabel.style["font-weight"] = "bold";
	}

	/**
	 * Axis label on mouse out callback. Fired when the mouse leaves the areas close to the axis label.
	 * @params axis         The target axis
	 * @params axisLabel    The target label
	 * @params e            The associated event
	 * @returns {undefined}
	 */
	axisLabelOnMouseOut(axis, axisLabel, e) {
		if (axis.coll === "yAxis" || !this.enableAxisLabelAction())
			return;

		axisLabel.chart.tooltip.hide();
		axisLabel.style["font-weight"] = "";
	}

	/**
	 * Shows a shared tooltip. Similiar to highchart's base implementation in runPointActions.
	 * @param chart
	 * @param e
	 */
	showSharedTooltip(chart, e, category) {
		// temporarily enable shared tooltips to enable highchart calls to work as though we were
		// really in the sharedTooltips mode
		chart.tooltip.shared = true;

		let kdpoints = this.findMatchingCategoryPoints(chart, category);
		if (kdpoints.length > 0) {
			chart.tooltip.refresh(kdpoints, e);
		}

		// Disable shared tooltips to allow for more discrete series interactions
		chart.tooltip.shared = false;
	}

}
