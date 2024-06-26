import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import {i18n} from 'stores';

/* Note that we MUST use inline styles here as the chart won't format correctly otherwise when it measures before loading .css */
// See http://api.highcharts.com/highcharts/tooltip.formatter for more details
interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	getPrecisionFromAxis: (value, axis) => number
}

export class LineTooltip extends React.Component<MyProps, {}> {
	render() {
		const {point, chart, getPrecisionFromAxis} = this.props;

		return <ChartTooltipBox>
			{chart.legend.title && <>
				<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.seriesIdentification}</ChartTooltipTitle>
				<ChartTooltipValueSet label={chart.legend.title.text.textStr} value={point.series.name} />
			</>}

			<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointIdentication}</ChartTooltipTitle>
			{chart.xAxis[0].userOptions.title.text.split(", ").map((t, i) => <ChartTooltipValueSet
				key={`${i}`}
				label={t}
				value={point.point.series.xAxis.categories[point.point.x].split(", ")[i]}
			/>)}

			<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointValue}</ChartTooltipTitle>
			<ChartTooltipValueSet value={getPrecisionFromAxis(point.point.y, chart.yAxis[0])} />

		</ChartTooltipBox>;
	}
}
