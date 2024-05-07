import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import {IO, i18n} from 'stores';
import {HighchartsComponent} from '../../highchartsComponent';
import { FormattedMessage } from 'react-intl';

interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	chartComponent: HighchartsComponent;
}

export class StatusTooltip extends React.Component<MyProps, {}> {

	assetRenderObject(assets, allocation, index) {
		return {name: assets[index].name, value: allocation, color:assets[index].color};
	}

	render() {
		const {point, chart, chartComponent} = this.props;

		const lambda = (chartComponent.props.chartingResult as IO).lambda[point.point.x];

		return <ChartTooltipBox>
			<ChartTooltipValueSet label={i18n.intl.formatMessage({ defaultMessage: 'Lambda Value', description: '[highcharts] Value set label in Status - Lambda Value' })} value={lambda.lambda.toFixed(4)} />
			<ChartTooltipValueSet label={chart.yAxis[0].userOptions.title.text} value={point.point.y} />

			<ChartTooltipTitle>
				<FormattedMessage defaultMessage="Iterations" description="[highcharts] Tooltip title in Status - Iterations" />	
			</ChartTooltipTitle>
			<ChartTooltipValueSet value={lambda.numberIterations} />

			{lambda.reasonForStopping && <ChartTooltipValueSet label={i18n.intl.formatMessage({ defaultMessage: 'Reason for Stopping', description: '[highcharts] Value set label in Status - Reason for Stopping' })} value={lambda.reasonForStopping} />}
		</ChartTooltipBox>
	}
}
