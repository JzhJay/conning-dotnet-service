import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import {IO} from '../../../../../stores/io';
import {i18n} from 'stores';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
    group?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class PercentileTooltip extends React.Component<MyProps, {}> {
    render() {
	    const {group, chart, chartComponent, getPrecisionFromAxis} = this.props;

	    let meanSeries = chart.series.find((s) => s.name == "mean");
	    let groupIndex = (chart.xAxis[0].categories as any).findIndex((c) => c == group.points[0].key);
	    let mean = meanSeries.yData[groupIndex];

	    return(<ChartTooltipBox>
		    {chart.xAxis[0].userOptions.categories.length != 1 && <ChartTooltipTitle>{i18n.highcharts.tooltipTitle.distributionInformation}</ChartTooltipTitle>}
			{chartComponent.props.chartingResult instanceof IO ?
			    <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.point} value={group.points[0].x} /> :
			    group.points[0].x.map((c, i) => <ChartTooltipValueSet key={`${i}`} label={chartComponent.chartData.axisNames[i]} value={c} />)
			}

		    <ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.distributionPercentiles}
			</ChartTooltipTitle>
		    {group.points.length > 0 && <ChartTooltipValueSet label={group.points[0].series.name.split(" ")[2]} value={getPrecisionFromAxis(group.points[0].point.high, chart.yAxis[0])} />}
		    {group.points.map((point, index) => {
		    	if (point.series.name.indexOf("%") < 0 ) {
		    		return null;
		    	}
		    	return <ChartTooltipValueSet key={`${index}`} label={point.series.name.split(" ")[0]} value={getPrecisionFromAxis(point.point.low, chart.yAxis[0])} />;
		    })}

		    <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.mean} value={getPrecisionFromAxis(mean, chart.yAxis[0])} />
		</ChartTooltipBox>)}
}
