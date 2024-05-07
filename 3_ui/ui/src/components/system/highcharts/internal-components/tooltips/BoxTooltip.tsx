import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import { FormattedMessage } from 'react-intl';
import { i18n } from 'stores';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
	pointFormat?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class BoxTooltip extends React.Component<MyProps, {}> {
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
		    {points[0].series.options.stackCoordinateNames.map((cn, i) => <ChartTooltipValueSet
		        key={`A${i}`}
		        label={points[0].series.chart.options.axisNames[i]}
			    value={cn}
	        />)}

		    {points[0].category.map((c, i) => <ChartTooltipValueSet
			    key={`B${i}`}
			    label={points[0].series.chart.options.xAxisTitleNames[i]}
			    value={c}
		    />)}

		    <ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.distributionPercentiles}
			</ChartTooltipTitle>
		    {/*TODO: look into sharing more code with cone chart.*/}
		    {points.length && <ChartTooltipValueSet
			    label={(points[0].point ? points[0].point : points[0]).series.name.split(" ")[2]}
			    value={getPrecisionFromAxis((points[0].point ? points[0].point : points[0]).high, chart.yAxis[0])}
		    />}
		    {points.map((point, index) => {
			    point = point.point ? point.point : point;

			    return point.series.name.indexOf("%") > -1 && <ChartTooltipValueSet
				    key={`C${index}`}
				    label={point.series.name.split(" ")[0]}
				    value={getPrecisionFromAxis(point.low, chart.yAxis[0])}
			    />;
		    })}
	    </ChartTooltipBox>)
    }
}
