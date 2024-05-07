import {setThroughTimeStatisticsObjectSeriesExtremes} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {RecalibrationTooltip} from 'components/system/highcharts/internal-components/tooltips/RecalibrationTooltip';
import {HighchartsExtender} from "./highchartsExtender";
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {ThroughTimeStatisticsTooltip} from "components/system/highcharts/internal-components/tooltips/ThroughTimeStatisticsTooltip";
import {makeOpaque} from 'utility';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

//import {BoxTooltip} from '../internal-components/ChartTooltips';

export class RecalibrationChartHighchartsExtender extends HighchartsExtender{
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, highchartsOptions.iconningLegend != null);

		this.automaticDisplayUnitsEnabled = true;
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

	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit);

		const _class = this;
		super.wrap("chart", Highcharts.seriesTypes.line.prototype, 'drawLegendSymbol', function (p, legend, item) {
			_class.drawLegendSymbol(p, this, legend, item)
		});
	}

	shouldSeriesBeVisible(series) : boolean
	{
		const invisible = this.legendItems.filter( lt => !lt.visible).map(lt => lt.options.name);
		if(!invisible.length) { return true; }

		const stacks = series.options.stack.split(',');
		return !_.some( stacks , stack => _.some(invisible, inv => inv == stack));
	}

	toolTipFormatter(pointFormat): any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><RecalibrationTooltip
			pointFormat={pointFormat}
			chart={this.chart}
			chartComponent={this.chartComponent}
			getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>
		);
	}

	drawLegendSymbol(originalFunction, series, legend, item) {
		if (item.options.connDividerAfter) {
			const fontHeight = legend.fontMetrics.h;
			item.legendItemHeight = fontHeight * 1.5;
		}

		originalFunction.apply(series, [].slice.call(arguments, 2));
	}
}
