import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';

interface MyProps {
	chart: HighchartsChartObject;
	getPrecisionFromAxis: (value, axis) => number
	point?: any;
	group?: any;
	chartData: any;
}

export class BeeswarmTooltip extends React.Component<MyProps, {}> {
	render() {
		const {chart, point, getPrecisionFromAxis, chartData:{rowNames, rowAxisNames}} = this.props;

		let axisNames = (chart as any).options.axisNames;

		if (point.percentile != null) {
			return (<ChartTooltipBox>
				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.percentileDetails}
				</ChartTooltipTitle>
				<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.value} value={getPrecisionFromAxis(point.xValue, chart.xAxis[0])} />
				<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.percentile} value={`${point.percentile}%`} />
				{/*
				<ChartTooltipValueSet label={"CTE >"} value={`${point.CTEGreater}`} />
				<ChartTooltipValueSet label={"CTE <"} value={`${point.CTELess}`} />
				<ChartTooltipValueSet label={"Density/Highest Density"} value={`${point.densityFraction}`} />
				*/}
			</ChartTooltipBox>)
		}
		else {
			const hasMultipleSeries = axisNames.length > 1;
			return (<ChartTooltipBox>
				{hasMultipleSeries ? <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.seriesIdentification}</ChartTooltipTitle> : null }
				{point.series.options.columnCoordinates.map((c, i) => <ChartTooltipValueSet key={`${i}`} label={axisNames[i]} value={c} />)}

				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.pointIdentication}
				</ChartTooltipTitle>
				{typeof point.point.name === 'number' && rowNames.length > 0 ?
					 rowNames[point.point.name].map((coordText, index) => <ChartTooltipValueSet key={`${index}`} label={rowAxisNames[index]} value={coordText} /> ) :
                    <ChartTooltipValueSet value={point.point.name} />
                }

				<ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.pointValue}
				</ChartTooltipTitle>
				<ChartTooltipValueSet value={getPrecisionFromAxis(point.point.x, chart.xAxis[0])}/>
			</ChartTooltipBox>)
		}
	}
}
