import {ContextMenu} from '@blueprintjs/core';
import {HighchartsComponent} from "components";
import {action, reaction} from 'mobx';
import * as ReactDOMServer from 'react-dom/server';
import {ChartData, ChartDataRef} from '../../../../stores/charting';
import {IO} from '../../../../stores/io';
import {getFullPercentileValues} from '../chartUtils';
import { transferShowAdditionalPointsGroup } from '../dataTemplates/efficientFrontierTemplate';
import {getStatusPoints} from '../dataTemplates/statusTemplate';
import {EfficientFrontierTooltip} from "../internal-components/tooltips/EfficientFrontierTooltip"
import {ScatterChartExtender} from './scatter.hc.extender';
import { hexToRgb, isDarkColor } from 'utility';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

const DONUT_SHIFT_OFFSET = 21; // Observed offset, not tied to size nor innersize

export class EfficientFrontierChartExtender extends ScatterChartExtender {

	constructor(protected chartComponent: HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions);

		this.automaticDisplayUnitsEnabled = true;

		// Process push updates
		const io = this.chartComponent.props.chartingResult as IO;
		this._toDispose.push(reaction(() => io.updateCount, io.sequencedUpdate(async () => {
			if (this.chartComponent.isUnmounting)
				return;

			console.time("frontier")
			console.time("fetch")
			let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate("efficientFrontier", chartComponent.userOptions);
			let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;
			let needsRedraw = false;

			console.timeEnd("fetch")

			// Update colors to reflect asset class changes, Note: This block does not rely on the new chartData but it is triggered here
			// since updating the relevant asset table properties will trigger a push update
			this.underlyingPiePoints.forEach((p) => {
				const pie = this.pieSeries.find(pie => pie.name == p.name);
				if (pie && pie.data && !_.isEqual(pie.data.map((d: any) => d.color),  this.donutData(p).map(d => d.color))) {
					pie.setData(this.donutData(p), false);
					needsRedraw = true;
				}
			})

			console.time("seriesUpdate")
			this.chart.series.forEach((s, i) => {
				if (i < chartData.series.length) {
					if (s.type == "columnrange" || s.type === 'line') {
						if (this.syncLegendSeries(chartData.series[i], s))
							needsRedraw = true;
					}
					else {
						const newSeries = chartData.series[i];

						if (!s.userOptions.connDataLookup || !_.isEqual((s.userOptions.connDataLookup as any).sort((a: any, b: any) => a.name - b.name), newSeries.data)) {
							s.setData(newSeries.data, false, false, false);
							needsRedraw = true;
						}
					}

					console.assert(chartData.series[i].name == s.name, "series name mismatch in EF update");
				}
				else if (s.type == "columnrange" && s.userOptions["connIsAdditionalPointLegend"]) {
					(this.chart.series.find( p => p.type == 'pie' && p.userOptions.connIsAdditionalPointSeries && s.options["connPieName"] == p.name ) == null) &&  s.remove(false);
				}
			})
			console.timeEnd("seriesUpdate");

			console.log('needsRedraw', needsRedraw);
			if (needsRedraw) {
				this.flushDonuts = true;

				this.resetToDefaultAxisLimits();
				this.chart.redraw();
			}

			//this.reportPlotExtremes(true);
			//this.reportPlotExtremes();
			console.timeEnd("frontier")
		})))

		this._toDispose.push(reaction(() => io.relativeEvaluationIndex, async () => {
			if (io.currentPage == this.chartComponent.props.page) {
				let xAxisExtremes = this.chart.xAxis[0].getExtremes();
				let yAxisExtremes = this.chart.yAxis[0].getExtremes();
				let visibleSeriesIndex = this.chart.series.findIndex(series => series.visible && series.xData[0] != null);

				if (visibleSeriesIndex === -1) {
					console.error("No Visible series found on relative evaluation processing")
					return;
				}

				let oldX = this.chart.series[visibleSeriesIndex].xData[0];
				let oldY = this.chart.series[visibleSeriesIndex].yData[0];

				await this.chartComponent.refetchData(false);

				let shiftX = this.chart.series[visibleSeriesIndex].xData[0] - oldX;
				let shiftY = this.chart.series[visibleSeriesIndex].yData[0] - oldY;
				this.chart.xAxis[0].setExtremes(xAxisExtremes.min + shiftX, xAxisExtremes.max + shiftX, false);
				this.chart.yAxis[0].setExtremes(yAxisExtremes.min + shiftY, yAxisExtremes.max + shiftY, false);

				this.setRelativePoint();
			}
			else {
				this.chartComponent.props.page.renderedTime = null; // Invalidate page instead of performing possible expensive update.
			}
		}))
	}

	syncLegendSeries(chartDataSeries, series) {
		let needsRedraw = false;

		if (chartDataSeries.showInLegend != series.userOptions.showInLegend || chartDataSeries.color != series.userOptions.color || chartDataSeries.name != series.userOptions.name) {
			series.update({showInLegend: chartDataSeries.showInLegend, visible: chartDataSeries.showInLegend, color: chartDataSeries.color, name: chartDataSeries.name}, false);
			needsRedraw = true;
		}

		return needsRedraw;
	}

	flushDonuts = false;

	/**
	 * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
	 * @param {type} chartInit    The object that will be passed to highchart to create chart
	 * @returns {undefined}
	 */
	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit);

		chartInit.plotOptions.series.events.legendItemClick = (event) => {
			const { target: series } = event;
			const visible = series.visible;
			const newVisible = !visible;

			if (series.userOptions.connIsAdditionalPointLegend) {
				// hide donut
				this.chart.series.find((s) => {
					return s.userOptions.type === 'pie' && s.userOptions.connIsAdditionalPointSeries && s.userOptions.name === series.userOptions.connPieName
				})?.setVisible(newVisible, false);

				// hide data label (single point)
				const additionalPointSeries = this.additionalAllocationsScatterSeries;
				additionalPointSeries.points.find((point)=> point.legendName === series.userOptions.name)?.update({ visible: newVisible }, false);

				return this.chart.redraw();
			} else if (series.userOptions.connIsGroupedAdditionalPointLineSeries) {
				const groupColor = series.color;

				// hide data labels (multiple points)
				const additionalPointsSeries = this.additionalAllocationsScatterSeries;
				additionalPointsSeries.points.filter((point)=> point.groupColor === groupColor).forEach((p)=> p.update({ visible: newVisible }, false));

				this.pieSeries.filter(s => s.userOptions.connIsAdditionalPointSeries && s.userOptions.fillColor === groupColor).forEach((s)=> s.setVisible(newVisible, false));

				return this.chart.redraw();
			}

			event.preventDefault();
		};

		chartInit.tooltip.positioner = function(labelWidth, labelHeight, point) {
			const seriesName = this.chart?.hoverPoint?.series?.name || '';
			const underlyingDonutSeries = this.chart?.hoverPoint?.series?.userOptions?.underlyingDonutSeries || false;
			const isAdditionalPoint = this.chart?.hoverPoint?.series?.userOptions?.connIsAdditionalPointSeries || false;
			const isEfficient = seriesName === 'fullFrontierSeries' || (seriesName === 'underlyingDonutSeries' && !underlyingDonutSeries);

			if (isAdditionalPoint || !isEfficient) { // show tooltips below points if points are additional points or inefficient points
				point.ttBelow = true;
			}

			return this.getPosition(labelWidth, labelHeight, point);
		};
	}

	load(chart) {
		super.load(chart);
		//this.addDonuts(true); // why did we need this? already triggers on redraw and doing it twice slows things down.
		this.setRelativePoint();
		//chart.redraw(false);
	}

	setRelativePoint() {
		const {chart} = this;
		const io = this.chartComponent.props.chartingResult as IO;
		if (io.relativeEvaluationIndex != null) {
			const xAxis           = chart.xAxis[0];
			const yAxis           = chart.yAxis[0];
			const lineConfig: any = {plotLines: [{color: "green", width: 1, value: 0, zIndex: 1}]};
			xAxis.update(lineConfig);
			yAxis.update(lineConfig);
			//this.reportPlotExtremes();
		}
	}

	addDonuts(fullUpdate) {
		// Remove existing donuts
		this.pieSeries.forEach(s => {
			if (fullUpdate || this.underlyingPiePoints.find(u => u.name == s.name) == null) {
				if (s.userOptions.connIsAdditionalPointSeries) {
					let removeLegend = this.chart.series.find( legendSeries => legendSeries.type == 'columnrange' && legendSeries.userOptions["connIsAdditionalPointLegend"] && legendSeries.options['connPieName'] == s.name);
					removeLegend && removeLegend.remove(false);
				}
				s.remove(false);
			}
		});

		this.underlyingPiePoints.forEach((p) => {
			const pie = this.pieSeries.find(pie => pie.name == p.name);
			if (fullUpdate || pie == null)
				this.addDonut(p);
			else if (pie && pie.data && !_.isEqual(pie.data.map(d => d.y),  p.options.connAssetAllocation)) {
				pie.setData(this.donutData(p), false);
			}
		})

		this.renderedWithEfficientFrontier = this.chartComponent.userOptions.showEfficientFrontier;
	}

	get assets() {
		return (this.chartComponent.props.chartingResult as IO).assetGroups(this.chartComponent.userOptions.assetGroupLevel);
	}

	donutData(point, groupColor?) {
		const assets = this.assets;
		const groupOptions = groupColor ? {
			name: '',
			fillColor: groupColor
		} : {};

		return point.options.connAssetAllocation?.map((a, i) => ({ name: assets[i].name, y: a, color: assets[i].color, ...groupOptions })).filter(p => p.y != 0);
	}

	addDonut(point) {
		const showGroupAdditionalPoints = this.chartComponent.userOptions.showGroupAdditionalPoints;
		const groupColor = showGroupAdditionalPoints && point.options.groupColor ? point.options.groupColor : ''

		this.chart.addSeries({
			type:       'pie',
			name:       point.name,
			minSize:    this.defaultDonutSize,
			innerSize:  this.donutInnerSize,
			size:       this.defaultDonutSize * this.chartComponent.userOptions.donutSize,
			animation:  false,
			dataLabels: {enabled: false},
			data:       this.donutData(point, groupColor),
			center:     [point.plotX - DONUT_SHIFT_OFFSET, point.plotY - DONUT_SHIFT_OFFSET],
			visible:    point.isInside,
			boostThreshold: 0,
			fillColor: groupColor || '',
			connIsAdditionalPointSeries: point.series.userOptions.connIsAdditionalPointSeries,
			zIndex: point.series.userOptions.connIsAdditionalPointSeries ? 2 : 3
		}, false);

		point.series.userOptions.connIsAdditionalPointSeries
		&& this.chart.addSeries({
			type:       'columnrange',
			name:       this.additionalPointName( point.options.name , point.options.connEvalIndex ),
			animation:  false,
			dataLabels: {enabled: false},
			data:       [],
			visible:    true,
			showInLegend: groupColor ? false : true,
			color: '#dddddd',
			connIsAdditionalPointLegend: true,
			connPieName: point.options.name
		}, false);
	}

	additionalPointName(pointName , evaluationIndex) {
		const chartingResult = this.chartComponent.props.chartingResult as IO;
		if (chartingResult.isAdditionalPoint(evaluationIndex)) {
			return chartingResult.additionalPoints.filter(a => a.evaluationIndex == evaluationIndex)[0].name;
		} else {
			return `Point ${pointName}`;
		}
	}

	enableAdditionalPoints(additionalPointsSeries) {
		if (additionalPointsSeries.data.length > 0) {
			const series = this.additionalAllocationsScatterSeries;
			series.setData(additionalPointsSeries.data, false);
			series.data.forEach(this.addDonut);
		} else {
			_.forEachRight(this.chart.series, (s) => {
				if (s.userOptions.connIsAdditionalPointSeries) {
					if (s.userOptions.type === 'pie') { // remove additional points donuts
						s.remove(false);
					} else {
						s.setData([], false);
					}
				} else if (s.userOptions.connIsAdditionalPointLegend) { // remove additional points legends
					s.remove(false);
				}
			});
		}

		if (this.chart.hasLoaded) { // chart is not initialized when additional point option is off in the beginning
			this.resetToDefaultAxisLimits();
			this.chart.redraw();
		}
	}

	toggleGroupedAdditionalPoints = (enabled, isUpdateDonuts?) => {
		if (this.chart.hasLoaded) { // chart is not initialized when additional point option is off in the beginning
			this.chart.series.filter((s) => s.userOptions.connIsGroupedAdditionalPointLineSeries).forEach((s) => {
				s.update({ showInLegend: enabled, visible: enabled }, false);
			});

			const additionalAllocationsScatterSeries = this.additionalAllocationsScatterSeries;
			if (additionalAllocationsScatterSeries) {
				additionalAllocationsScatterSeries.setData(transferShowAdditionalPointsGroup(additionalAllocationsScatterSeries.data, enabled), false);
			}

			if (isUpdateDonuts) {
				this.addDonuts(true);
			};
			this.chart.redraw();
		}
	}

	fetchHoverDetail = _.debounce((chartingResult, point) => {
		const evalIndex = point.options.connEvalIndex;
		chartingResult.loadEvaluation(evalIndex).then(evaluation => {
			const allocation = chartingResult.allocationsAtLevel(this.chartComponent.userOptions.assetGroupLevel, evaluation.assetAllocation);
			if (point.series.userOptions.connDataLookup) {
				point.series.userOptions.connDataLookup[point.index].connAssetAllocation = allocation
			}
			point.update({connAssetAllocation: allocation});

			if (this.lastHoverEval == evalIndex) {
				this.setHoverEval(evalIndex);
				//TODO: Update tooltip to pull allocation from io.evaluation to avoid point update.
				this.chart.tooltip.refresh(point);

				//this.displayHoverAssets(point);

				// Must force hover again to enable stickying tooltip with 1 click.
				this.forceHover(point);
			}
		})
	}, 100, {leading: false, trailing: true})

	displayHoverAssets = (point) => {
		const allocation = point.options.connAssetAllocation;
		this.chart.series.filter(s => s.type == "columnrange").forEach((s, i) => {
			if (s.userOptions.showInLegend == false && allocation[i] > 0)
				s.update({showInLegend: true, visible: true, connForceShowInLegend: true}, false);
		})
		this.chart.redraw();
	}

	forceHover(point) {
		let hoverPoint = point.series.points.filter(p => (p.index == point.index || p.i == point.index) )[0];

		// Fallback to current hover point if available
		// Point is sometimes missing in series.points when processing an async force hover. e.g. force hover is issued after making back-end request for evaluation detail.
		if (hoverPoint == null && this.chart.forcedHovers)
			hoverPoint = this.chart.forcedHovers[0][0];

		this.setState(hoverPoint, point.series, 'hover', false);
		point.series.halo.toFront();
		point.series.chart.forcedHovers = [[hoverPoint, point.series]];
	}

	lastHoverEval = -1;
	pointMouseOver(point) {
		if (point.series.options.boostThreshold > 0) {
			this.forceHover(point);
		}
		else {
			// Needed to prevent inefficient point from being hovered when interacting with donut center point.
			point.series.directTouch = true;
		}

		const chartingResult:IO = this.chartComponent.props.chartingResult as IO;
		this.lastHoverEval = point.options.connEvalIndex;
		if (!this.lastHoverEval && point.series.options.boostThreshold >= 1 ) {
			point = point.series.getPoint(point);
			this.lastHoverEval = point.options.connEvalIndex;
		}
		if (point.options.connEvalIndex && !chartingResult.evaluationHasDetails(point.options.connEvalIndex)) {
			this.fetchHoverDetail(chartingResult, point);
		}
		else if (point.options.connEvalIndex != null) {
			// Run in timeout to give hover actions (e.g. showing tooltip) render priority
			const hoverEvalIndex = point.options.connEvalIndex;
			setTimeout(() => this.setHoverEval(hoverEvalIndex), 1);
			//this.displayHoverAssets(point);
		}
	}

	setHoverEval(index) {
		const chartingResult:IO = this.chartComponent.props.chartingResult as IO;
		this.chartComponent.props.page.hoverViewId = this.chartComponent.props.id;
		chartingResult.hoverEvalIndex = index;
	}

	pointMouseOut(point) {
		if (ContextMenu.isOpen() && point.series.options.boostThreshold > 0) {
			// Preserve hover halo
			setTimeout(() => {
				this.forceHover(point);
			}, 0);
		}

		super.pointMouseOut(point);
		this.lastHoverEval = -1;
		this.chartComponent && ((this.chartComponent.props.chartingResult as IO).hoverEvalIndex = null);

		/*let shouldRedraw = false;
		this.chart.series.filter(s => s.type == "columnrange").forEach((s, i) => {
			if (s.userOptions.connForceShowInLegend) {
				s.update({showInLegend: false, visible: true, connForceShowInLegend: null}, false);
				shouldRedraw = true;
			}
		})
		shouldRedraw && this.chart.redraw();*/
	}

	invalidateTracking = () => {
		this.pieMouseOver = null;
		clearTimeout(this.mouseOverTimer);
		this.mouseOverTimer = null;
	}

	pieMouseOver = null;
	mouseOverTimer = null;
	runPointActions(originalFunction, pointer, e, point) {
		if (e.target == this.pieMouseOver) {
			return;
		} else {
			try {
				if (this.mouseOverTimer != null) {
					this.invalidateTracking();
				}

				if (point && point.series && point.series.type == "pie" && e.type == "mouseover") {
					this.pieMouseOver   = e.target;
					this.mouseOverTimer = setTimeout(() => {
						if (e.target == this.pieMouseOver) {
							this.invalidateTracking();
							super.runPointActions(originalFunction, pointer, e, point);
						}
					}, 300)
				} else {
					super.runPointActions(originalFunction, pointer, e, point);
				}
			} catch(e) {
				this.invalidateTracking();
				throw e;
			}
		}
	}

	pointClick(point) {
		// Point sticking only works with real points, e.g. no donut slices
		if (point.series.isCartesian)
			super.pointClick(point);
	}


	setFontSize(chart, fontSizes, increase, fontSize) {
		super.setFontSize(chart, fontSizes, increase, fontSize);

		// Adjust donut size after data label font size update.
		this.pieSeries.forEach(pie => {
			pie.update({innerSize: this.donutInnerSize, size: this.defaultDonutSize * this.chartComponent.userOptions.donutSize, marker: {radius: parseFloat(fontSize)}}, false);
		})

		fontSize = _.get(chart.options, "plotOptions.series.dataLabels.style.fontSize");
		this.underlyingPiePoints.forEach(point => {
			point.update({marker: {radius: parseFloat(fontSize)}}, false);
		})

		this.chart.redraw();
	}

	get defaultDonutSize() {
		return 2.5 * this.donutInnerSize;
	}

	get donutInnerSize() {
		let currentDataLabelFontSize = parseFloat(this.chart.options.plotOptions.series?.dataLabels?.style?.fontSize);

		// Scale default size (based on font size of 11) based on current font size
		return (20/11) * (isNaN(currentDataLabelFontSize) ? 11 : currentDataLabelFontSize);
	}

	afterSetExtremes(axis, e) {
		super.afterSetExtremes(axis, e);

		//if (!axis.isXAxis)
		//	this.positionDonuts();
	}

	resize() {
		super.resize();

		//this.chart.redraw();
		//this.positionDonuts();
	}

	redraw(chart, e) {
		super.redraw(chart, e);

		this.positionDonuts();

		// Trailing update to correct any location issues caused by chart not being fully updated on above position sync.
		// E.g. there are certain font size changes which cause the x axis labels to intermittently render diagonally, causing the donut to the
		// placed in the wrong location. Weirdly there isn't a second redraw with the corrected positions.
		setTimeout(() => chart.series && this.positionDonuts(), 100);
	}

	get pieSeries() {
		return this.chart.series.filter(s => s.type == "pie");
	}

	get underlyingPiePoints() {
		return _.flatten(this.chart.series.filter(s => s.name == "underlyingDonutSeries").map(s => s.points));
	}

	get additionalAllocationsScatterSeries() {
		return this.chart.series.find(s => s.name === 'underlyingDonutSeries' && s.userOptions.connIsAdditionalPointSeries);
	}

	runningDonutPositioning = false;
	lastEFLocations = "";
	renderedWithEfficientFrontier;

	positionDonuts() {
		const {chart, chartComponent} = this;

		if (this.runningDonutPositioning)
			return;

		if (chart.series.length > 0) {
			const underlyingPoints  = this.underlyingPiePoints;

			if (this.underlyingPiePointsKey(underlyingPoints) == this.lastEFLocations) {
				this.flushDonuts = false;
				return;
			}

			console.time("positionDonuts")

			try {
				this.runningDonutPositioning = true;

				if (this.renderedWithEfficientFrontier != this.chartComponent.userOptions.showEfficientFrontier ||
					this.underlyingPiePoints.length != this.pieSeries.length ||
					this.flushDonuts) {
					this.addDonuts(!this.flushDonuts || this.pieSeries.length > this.underlyingPiePoints.length);
					this.flushDonuts = false;
				}

				this.pieSeries.forEach((s) => {
					let underlyingEFPoint = underlyingPoints.find(u => u.name == s.name);
					const efPlot = chart.inverted ? {x:chart.yAxis[0].toPixels(underlyingEFPoint.y, true), y:chart.xAxis[0].toPixels(underlyingEFPoint.x, true)} : {x: underlyingEFPoint.plotX, y: underlyingEFPoint.plotY}
					const x = efPlot.x - DONUT_SHIFT_OFFSET;
					const y = efPlot.y - DONUT_SHIFT_OFFSET;
					const userOptions = s.userOptions;

					if (x != userOptions.center[0] || y != userOptions.center[1] || underlyingEFPoint.isInside != userOptions.visible) {
						s.update({center: [x, y], visible: underlyingEFPoint.isInside}, false);
					}
				})

				this.lastEFLocations = this.underlyingPiePointsKey(underlyingPoints);
				this.isFullyLoaded && chart.redraw(false);

				// need to run async to correctly refresh after box zoom. Otherwise tooltips are rendered offscreen for some reason.
				window.setTimeout(() => {chart.series && this.refreshCustomTooltips(chart)}, 1);
			}
			finally {
				this.runningDonutPositioning = false;
			}
		}
		console.timeEnd("positionDonuts")
	}

	underlyingPiePointsKey(underlyingPoints) {
		return JSON.stringify(underlyingPoints.map(p => ({x:p.plotX, y:p.plotY}))) + this.chartComponent.userOptions.assetGroupLevel;
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		const {chart} = this;

		if (p.series.type != "pie" && p.point.options.connAssetAllocation == null)
			return false;

		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><EfficientFrontierTooltip point={p} chart={chart} assets={this.assets} getPrecisionFromAxis={this.getPrecisionFromAxis} chartingResult={this.chartComponent.props.chartingResult as IO} userOptions={this.chartComponent.userOptions}/></RawIntlProvider>);
	}

	drawLegendSymbol(originalFunction, series, legend, item) {
		legend.symbolHeight = legend.fontMetrics.h;

		if (series.options?.connIsAdditionalPointLegend) {
			// adjust additional points' legend item height to make them align with other types' legend items
			item.legendItemHeight = legend.symbolHeight + 2;

			const rgb = hexToRgb(series.options.color);
			const symbolTextColor = isDarkColor(rgb.r, rgb.g, rgb.b) ? '#ffffff': '#000';
			const circleRadius = legend.symbolHeight / 2;
			const x = circleRadius + (legend.symbolWidth - legend.symbolHeight) / 2;
			const y = circleRadius+(legend.baseline - legend.symbolHeight + 3);
			const fontSize = Math.max((parseInt(legend.itemStyle.fontSize)||12)-2,6)
			item.legendSymbol = this.chart.renderer.circle(x,y,circleRadius ).add(item.legendGroup);
			series.chart.renderer.text(series.options.connPieName,x,y+((legend.symbolHeight-fontSize)) - 1)
				.attr({
					fill: symbolTextColor,
					'text-anchor':'middle',
					'font-size': fontSize + 'px',
					'font-weight':'bold'
				}).add(item.legendGroup)
		} else {
			originalFunction.apply(series, [].slice.call(arguments, 2));
		}
	}

	/*
	* Key to uniquely identify a tooltip and determine if a tooltip is still pointing to its original location. E.g. a rerun of the IO yielded a point that the tooltip can reasonable be reapplied to.
	* */
	tooltipKey = (point) => `${point.name}-${point.x}-${point.y}`;

	cleanup() {
		super.cleanup();
		this._toDispose.forEach(f => f());
	}
}