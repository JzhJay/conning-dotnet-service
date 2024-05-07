import {HighchartsExtender} from "./highchartsExtender";
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {BoxTooltip} from "components/system/highcharts/internal-components/tooltips/BoxTooltip";
import {makeOpaque} from 'utility';
import {i18n} from 'stores';
import { RawIntlProvider } from "react-intl";

//import {BoxTooltip} from '../internal-components/ChartTooltips';

export class BoxChartHighchartsExtender extends HighchartsExtender{
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, true)
	}

	/**
	 * Load Callback. Fires when the chart is finished loading.
	 * @returns {undefined}
	 */
	load(chart) {
		super.load(chart);

		// Fixing a highcharts bug, written up at https://github.com/highslide-software/highcharts.com/issues/4559
		if (chart.tooltip.label){
			chart.tooltip.label.element.onmouseout = function (e) {
				if (chart.hoverPoint) {
					chart.hoverPoint.onMouseOut();
					chart.tooltip.hide();
				}
			}
		}
	}

	wrapHighchart() {
		super.wrapHighchart();

		let _thisClass = this;
		_thisClass.wrap("", Highcharts.Chart.prototype, "redraw", function (orgFunc, ...args) {
			_thisClass.calculatePositionAndWidth.call(_thisClass, orgFunc, this, args);
		});

	}

	_savedCompareData;
	calculatePositionAndWidth(orgFunc, chart, args) {
		// const chart = this.chartComponent.chart;

		const xAxis = chart.xAxis[0];
		const inverted = chart.inverted;
		const xReversed = xAxis.reversed;
		const compareData = {
			plotWidth: chart.plotWidth,
			inverted: inverted,
			reversed: xReversed,
			legends: _.map(chart.legend.allItems, (legend: any) => legend.name),
			...xAxis.getExtremes()
		};

		// console.log(`calculatePositionAndWidth isEqual: ${_.isEqual(compareData, this._savedCompareData)}`);
		if (!chart.options.chart.forExport && _.isEqual(compareData, this._savedCompareData)) {
			orgFunc.call(chart, ...args);
			return;
		}
		this._savedCompareData = compareData;

		// remove dirty setting
		chart.series.forEach(series => {
			series.update({pointWidth: null} as any, false);
		});
		orgFunc.call(chart, false);

		const columnRanges:Array<HighchartsSeriesObject> = _.filter(chart.series, ({name}) => name !== 'mean');
		let columnStacks = _.map<HighchartsSeriesObject, string>(columnRanges, s => `${s.userOptions.stack}`);
		columnStacks = _.filter(columnStacks, (ss, i) => i == _.indexOf(columnStacks, ss));
		const pointXOffsets : {[stackName: string]: number} = {};

		let categoryWidth, groupPadding, pointPadding, pointOffsetWidth, pointWidth;
		{
			const series = columnRanges[0],
				options = series.options,
				xAxis = (series.xAxis as any);

			categoryWidth = Math.min(
					Math.abs(xAxis.transA) * (
						(xAxis.ordinal && xAxis.ordinal.slope) ||
						options.pointRange ||
						xAxis.closestPointRange ||
						xAxis.tickInterval ||
						1
					),
					xAxis.len
				);
			groupPadding = categoryWidth * ((options as any).groupPadding as any);
			let groupWidth = categoryWidth - 2 * groupPadding;
			pointOffsetWidth = groupWidth / columnStacks.length;
			pointWidth = pointOffsetWidth * ( 1 - 2 * ((options as any).pointPadding as any));
			pointPadding = (pointOffsetWidth - pointWidth) / 2;
		}

		columnStacks.forEach((stack, colIndex) => {
			pointXOffsets[stack] = pointPadding +
				(
					groupPadding +
					(colIndex + (xReversed ? 1 : 0)) * pointOffsetWidth -
					(categoryWidth / 2)
				) * (xReversed ? -1 : 1);
		});

		// console.log(`update box column width : ${pointWidth}`);
		// console.log(pointXOffsets);

		chart.series.forEach(series => {
			const stack = series.userOptions.stack;
			const pointXOffset = pointXOffsets[stack];

			if (series.name !== 'mean') {
				if (series.name !== 'mean') {
					const superGetColumnMetrics = _.get(series,"Iconn_super_getColumnMetrics", (series as any).getColumnMetrics);
					_.set(series,"Iconn_super_getColumnMetrics", superGetColumnMetrics);
					(series as any).getColumnMetrics = () => {
						let result = superGetColumnMetrics.call(series);
						result.offset = pointXOffset;
						result.width = pointWidth;
						return result;
					}
				}
			} else {
				let center = (pointXOffset  + ( pointWidth / 2)) * (xReversed ? -1 : 1);
				const position = xAxis.toValue(center  + xAxis.toPixels(0));
				series.update({zIndex:10, pointPlacement: position, pointRange: 1} as any, false)
			}
		});

		orgFunc.call(chart, ...args);
	}

	renderNewLegend() {
		super.renderNewLegend();
		this.chartComponent.chart.redraw();
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @param pointFormat An object holding the point that the tooltip is being generated for
	 * @returns The formatted tooltip string, or false to dismiss.
	 */
	toolTipFormatter(pointFormat): any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><BoxTooltip pointFormat={pointFormat} chart={this.chart} chartComponent={this.chartComponent} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>)
	}

	drawLegendSymbol(originalFunction, series, legend, item) {
		if (item.options.connSizeSymbolToHeight) {
			legend.symbolHeight = legend.fontMetrics.h;

			// If no legend item height was already set, force the height to match the symbol height to make sure there are no overlaps or spaces between percentiles
			if (!item.legendItemHeight)
				item.legendItemHeight = legend.symbolHeight;
		}

		originalFunction.apply(series, [].slice.call(arguments, 2));
	}


	getFormattedLegendItem(item, inStack) {
		const options = inStack
			? {name: item.options.stack, color: makeOpaque(item.color), dashStyle: item.options.dashStyle}
			: item.name == "mean"
				  ? {name: item.name, type: 'line', lineWidth: 0, marker: {symbol: "cross", enabled: true, lineColor: 'rgba(255, 192, 0, 1)', lineWidth: 2}}
				  : {name: item.name, color: "rgba(0, 0, 0," + item.color.split(",")[3], connSizeSymbolToHeight: true};

		return this.createLegendItem(item.chart, options);
	}

}
