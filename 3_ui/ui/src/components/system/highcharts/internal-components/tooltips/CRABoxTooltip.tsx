import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import {i18n} from 'stores';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
	pointFormat?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class CRABoxTooltip extends React.Component<MyProps, {}> {
    render() {

	    const {pointFormat, chart, chartComponent, getPrecisionFromAxis} = this.props;

	    let points = [];

	    chart.series.forEach((series) => {
		    if (series.points && series.points[pointFormat.point.index] && series.options.stack === pointFormat.point.series.options.stack)
			    points.push(series.points[pointFormat.point.index]);
	    })

	    return (<ChartTooltipBox>
		    <ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.distributionInformation}
			</ChartTooltipTitle>
		    <ChartTooltipValueSet
			    label={i18n.highcharts.tooltipValueSet.name}
			    value={points[0].series.options.stack}
		    />

		    <ChartTooltipValueSet
			    label={i18n.highcharts.tooltipValueSet.horizon}
			    value={points[0].category}
		    />

		    <ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.distributionPercentiles}
			</ChartTooltipTitle>

		    {points.length && <ChartTooltipValueSet
			    label={points[0].series.name.split(" ")[2]}
			    value={getPrecisionFromAxis(points[0].high, chart.yAxis[0])}
		    />}

		    {points.map((point, index) => {
			    point = point.point ? point.point : point;

			    return point.series.name.indexOf("%") > -1 && <ChartTooltipValueSet
						key={`CRABoxTooltip_point_${index}`}
					    label={point.series.name.split(" ")[0]}
					    value={getPrecisionFromAxis(point.low, chart.yAxis[0])}
				    />;
		    })}
	    </ChartTooltipBox>)
    }
}
