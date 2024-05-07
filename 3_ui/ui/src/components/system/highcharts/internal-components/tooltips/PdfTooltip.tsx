import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';

interface MyProps {
    chart: HighchartsChartObject;
	getPrecisionFromAxis: (value, axis) => number
    point?: any;
    group?: any;
}

export class PdfTooltip extends React.Component<MyProps, {}> {
    render() {
        const {chart, point, getPrecisionFromAxis} = this.props;

        let axisNames = (chart as any).options.axisNames;

        if (point.percentile != null) {
            //console.log(p)
            return (<ChartTooltipBox>
                <ChartTooltipTitle>
					{i18n.highcharts.tooltipTitle.percentileDetails}
				</ChartTooltipTitle>
	            <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.value} value={getPrecisionFromAxis(point.xValue, chart.xAxis[0])} />
	            <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.percentile} value={`${point.percentile}%`} />

	            {/*
					<ChartTooltipValueSet label={'CTE >'} value={point.CTEGreater} />
		            <ChartTooltipValueSet label={'CTE <'} value={point.CTELess} />
		            <ChartTooltipValueSet label={'Density'} value={point.density} />
		            <ChartTooltipValueSet label={'Density/Highest Density'} value={point.densityFraction} />
	            */}
            </ChartTooltipBox>)
        }
        else {
            const hasMultipleSeries = axisNames.length > 1;

            return (<ChartTooltipBox>
                {hasMultipleSeries ? <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.seriesIdentification}</ChartTooltipTitle> : null }
                {point.series.options.columnCoordinates.map((c, i) => <ChartTooltipValueSet
	                key={`${i}`}
	                label={axisNames[i]}
	                value={c}
                />)}

                <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointIdentication}</ChartTooltipTitle>
				<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.value} value={getPrecisionFromAxis(point.x, chart.xAxis[0])} />
	            {chart.userOptions.chart.type != "scatter" && <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.probabilityDensity} value={getPrecisionFromAxis(point.y, chart.yAxis[0])} />}
            </ChartTooltipBox>)
        }
    }
}
