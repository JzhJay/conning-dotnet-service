import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import {i18n} from 'stores';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
	pointFormat?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class RSSimulationReportsTooltip extends React.Component<MyProps, {}> {

    render() {
	    const {pointFormat, chart, chartComponent, getPrecisionFromAxis} = this.props;
	    return (<ChartTooltipBox>
		    <ChartTooltipValueSet
			    label={chart.xAxis[0].userOptions.title.text}
			    value={pointFormat.x}
		    />
		    <br/>
		    {chart.yAxis[0].userOptions.title?.text && <ChartTooltipTitle text={chart.yAxis[0].userOptions.title.text} />}
		    {chart.series.map((series) => {
				const value = _.get(
					_.find(series.data, d => d.category == pointFormat.x ),
					"y",
					"--"
				)
			    return <ChartTooltipValueSet
				    key={`RSSimulationReportsTooltip_value_${series.name}`}
				    label={series.name}
				    value={getPrecisionFromAxis(value, chart.yAxis[0])}
			    />
		    })}
	    </ChartTooltipBox>)
    }
}
