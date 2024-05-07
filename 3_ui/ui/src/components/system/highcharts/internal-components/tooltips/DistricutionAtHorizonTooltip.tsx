import * as React from 'react';
import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import {i18n} from 'stores';

interface MyProps {
	chart: HighchartsChartObject;
	getPrecisionFromAxis: (value, axis) => number
	point?: any;
	group?: any;
}

export class DistributionAtHorizonTooltip extends React.Component<MyProps, {}> {
	render() {
		const {chart, point, getPrecisionFromAxis} = this.props;

		return (<ChartTooltipBox>
			<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.seriesIdentification}</ChartTooltipTitle>
			<ChartTooltipValueSet
				label={i18n.highcharts.tooltipValueSet.name}
				value={point.series.name}
			/>

			<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointIdentication}</ChartTooltipTitle>
			<ChartTooltipValueSet
				label={i18n.highcharts.tooltipValueSet.value}
				value={getPrecisionFromAxis(point.x, chart.xAxis[0])}
			/>

			<ChartTooltipValueSet
				label={i18n.highcharts.tooltipValueSet.probabilityDensity}
				value={getPrecisionFromAxis(point.y, chart.yAxis[0])}
			/>
		</ChartTooltipBox>)
	}
}
