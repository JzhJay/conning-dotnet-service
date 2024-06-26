import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import {observer} from "mobx-react";
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';

interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis) => number
}

@observer
export class BarTooltip extends React.Component<MyProps, {}> {
	render() {
		let {point, chart, chartComponent:{userOptions:{columnMode}}, getPrecisionFromAxis} = this.props;

		if (point.points)
			point = point.points[0];

		let columnModeIsPercent = columnMode === 'percent';
		let columnModeIsNormal = columnMode === 'normal';

		return (
			<ChartTooltipBox>
				<ChartTooltipTitle>
					<FormattedMessage defaultMessage="Group Identification" description="[highcharts] Tooltip title in bar chart - Group Identification" />
				</ChartTooltipTitle>
				{chart.xAxis[0].userOptions.title.text.split(", ").map((t, i) => <ChartTooltipValueSet key={`${i}`} label={t} value={point.point.series.xAxis.categories[point.point.x].split(", ")[i]} />)}

				{columnMode === '' && <>
					<ChartTooltipTitle>
						{i18n.highcharts.tooltipTitle.seriesIdentification}
					</ChartTooltipTitle>
					<ChartTooltipValueSet label={chart.legend.title.text.textStr} value={point.series.name} />

					<ChartTooltipTitle>
						{i18n.highcharts.tooltipTitle.pointValue}
					</ChartTooltipTitle>
					<ChartTooltipValueSet label={chart.yAxis[0].userOptions.title.text} value={getPrecisionFromAxis(point.point.y, chart.yAxis[0])} />
				</>}

				{(columnModeIsNormal || columnModeIsPercent) && <>
					<ChartTooltipTitle>
						<FormattedMessage defaultMessage="Series Identification / Value" description="[highcharts] Tooltip title in bar chart - Series Identification / Value" />
					</ChartTooltipTitle>
					{chart.series.map((s, i) =>
						s.visible ?
						<ChartTooltipValueSet
							key={`${i}`}
							label={s.name}
							value={`${getPrecisionFromAxis(s.data[point.point.x][columnModeIsNormal ? "y" : "percentage"], chart.yAxis[0])}${columnModeIsPercent ? '%' : ''}`} /> :
						null
					)}
				</>}
			</ChartTooltipBox>
		);
	}
}
