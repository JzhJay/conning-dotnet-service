import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';
/* Note that we MUST use inline styles here as the chart won't format correctly otherwise when it measures before loading .css */
// See http://api.highcharts.com/highcharts/tooltip.formatter for more details
interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	getPrecisionFromAxis: (value, axis) => number
}

export class LineWithHorizonTooltip extends React.Component<MyProps, {}> {
	render() {
		const {point, chart, getPrecisionFromAxis} = this.props;

		return (
			<ChartTooltipBox>
				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.horizon}
				</ChartTooltipTitle>
				<ChartTooltipValueSet
					label={i18n.highcharts.tooltipValueSet.year}
					value={point.x} />
				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.pointValue}
				</ChartTooltipTitle>
						{point.points.map((p, i) =>
							<ChartTooltipValueSet
								key={i}
								label={p.series.options.name}
								value={getPrecisionFromAxis(p.y, p.series.yAxis)}
							/>
						)}
			</ChartTooltipBox>
		);
	}
}
