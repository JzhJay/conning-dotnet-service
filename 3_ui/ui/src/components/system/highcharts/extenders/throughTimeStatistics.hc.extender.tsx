import {setThroughTimeStatisticsObjectSeriesExtremes} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {HighchartsExtender} from "./highchartsExtender";
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {ThroughTimeStatisticsTooltip} from "components/system/highcharts/internal-components/tooltips/ThroughTimeStatisticsTooltip";
import {makeOpaque} from 'utility';
import {i18n} from 'stores';
import {RawIntlProvider} from 'react-intl';

//import {BoxTooltip} from '../internal-components/ChartTooltips';

export class ThroughTimeStatisticsChartHighchartsExtender extends HighchartsExtender{
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, true);

		this.automaticDisplayUnitsEnabled = true;
	}

	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit);

		const _class = this;
		super.wrap("chart", Highcharts.seriesTypes.line.prototype, 'drawLegendSymbol', function (p, legend, item) {
			_class.drawLegendLine(p, this, legend, item)
		});
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

		if (!this.isForExport(chart)) {
			setTimeout(()=>setThroughTimeStatisticsObjectSeriesExtremes(chart), 1);
		}
	}

	toolTipFormatter(pointFormat): any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}>
			<ThroughTimeStatisticsTooltip
			pointFormat={pointFormat}
			chart={this.chart}
			chartComponent={this.chartComponent}
			getPrecisionFromAxis={this.getPrecisionFromAxis}/>
		</RawIntlProvider>
		);
	}

	shouldSeriesBeVisible(series) : boolean
	{
		const invisible = this.legendItems.filter( lt => !lt.visible).map(lt => lt.options.name);
		if(!invisible.length) { return true; }

		const stacks = series.options.stack.split(',');
		return !_.some( stacks , stack => _.some(invisible, inv => inv == stack));
	}

	drawLegendSymbol(originalFunction, series, legend, item) {

		if (item.options.connSizeSymbolToHeight) {
			legend.symbolHeight = legend.fontMetrics.h;
			item.name = '';

			// If no legend item height was already set, force the height to match the symbol height to make sure there are no overlaps or spaces between percentiles
			if (!item.legendItemHeight)
				item.legendItemHeight = legend.symbolHeight;
		}

		originalFunction.apply(series, [].slice.call(arguments, 2));
	}

	drawLegendLine(originalFunction, series, legend, item) {

		const connShowLineOnly = item.options.connShowLineOnly === true;
		const fontHeight = legend.fontMetrics.h;
		if (connShowLineOnly) {
			item.legendItemHeight = item.options.connLastPercentile ? fontHeight * 1.5 : Math.ceil(fontHeight/3);
			item.name = `${item.name}%`
		}
		item.options.lineWidth = Math.floor(fontHeight/10) + 1;

		originalFunction.apply(series, [].slice.call(arguments, 2));
		if (connShowLineOnly) {
			item.legendLine.element.setAttribute('d', `M ${-4 + Math.ceil(fontHeight/10)} 4 L ${fontHeight*3} 4`);
			item.legendItem.element.setAttribute('x', `${fontHeight*3 + 5}`);
			item.legendItem.element.setAttribute('y', `${Math.ceil(fontHeight/2)}`);
		}
	}
}
