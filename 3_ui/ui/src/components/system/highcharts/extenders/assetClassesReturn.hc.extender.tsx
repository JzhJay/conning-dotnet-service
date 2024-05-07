import {HighchartsExtender} from 'components/system/highcharts/extenders/highchartsExtender';
import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {HighchartsComponent} from '../highchartsComponent';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class AssetClassesReturnChartHighchartsExtender extends HighchartsExtender{
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions);
	}

	toolTipFormatter(point): any {
		return <RawIntlProvider value={i18n.intl}>ReactDOMServer.renderToStaticMarkup(<ChartTooltipBox>
				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.identification}
				</ChartTooltipTitle>
				<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.assetClass} value={point.series.name} />
				<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.metrics}</ChartTooltipTitle>
				<ChartTooltipValueSet
					label={point.series.chart.xAxis[0].options.title.text}
					value={this.getPrecisionFromAxis(point.x, point.series.chart.xAxis[0])}
				/>
				<ChartTooltipValueSet
					label={point.series.chart.yAxis[0].options.title.text}
					value={this.getPrecisionFromAxis(point.y, point.series.chart.yAxis[0])}
				/>
			</ChartTooltipBox>)
		</RawIntlProvider>;
	}

	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit);

		const _class = this;
		super.wrap("chart", Highcharts.seriesTypes.scatter.prototype, 'drawLegendSymbol', function (p, legend, item) {
			_class.drawLegendSymbol(p, this, legend, item)
		});
	}

	drawLegendSymbol(originalFunction, series, legend, item) {

		legend.symbolHeight = legend.fontMetrics.h;

		// Force the height to match the symbol height to make sure there are no overlaps or spaces between legend items
		item.legendItemHeight = legend.symbolHeight;

		originalFunction.apply(series, [].slice.call(arguments, 2));

		item.legendSymbol.element.setAttribute('d', `M0 0 H ${legend.symbolHeight} V ${legend.symbolHeight} H 0 L 0 0`);
	}


}