import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import {i18n} from 'stores';
/* Note that we MUST use inline styles here as the chart won't format correctly otherwise when it measures before loading .css */
// See http://api.highcharts.com/highcharts/tooltip.formatter for more details
interface MyProps {
    chart: HighchartsChartObject;
    point: any;
    chartData: any; // Todo -make an interface for the various chart data templates
	getPrecisionFromAxis: (value, axis) => number;
}

export class ScatterTooltip extends React.Component<MyProps, {}> {
    render() {
        const {point, chart, chartData:{rowNames, rowAxisNames}, getPrecisionFromAxis} = this.props;

        return <ChartTooltipBox>
            {chart.series.filter(s => !s.userOptions.isRegressionLine).length > 1 ?
             <>
                 <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.seriesIdentification}</ChartTooltipTitle>
                 <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.name} value={point.series.name} />
             </>: null}

            <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointIdentication}</ChartTooltipTitle>
            {typeof point.point.name === 'number' && rowNames.length > 0 ?
                 rowNames[point.point.name].map((coordText, index) => <ChartTooltipValueSet
	                 key={index}
	                 label={rowAxisNames[index]}
	                 value={coordText}
                 />) :
                <ChartTooltipValueSet value={point.point.name} />
            }

            <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.pointValues}</ChartTooltipTitle>
            <ChartTooltipValueSet label={chart.xAxis[0].userOptions.title.text} value={getPrecisionFromAxis(point.point.x, chart.xAxis[0])} />
            <ChartTooltipValueSet label={chart.yAxis[0].userOptions.title.text} value={getPrecisionFromAxis(point.point.y, chart.yAxis[0])} />

        </ChartTooltipBox>;
    }
}
