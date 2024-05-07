import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import { FormattedMessage } from 'react-intl';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
	pointFormat?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class ThroughTimeStatisticsTooltip extends React.Component<MyProps, {}> {

    render() {

	    const {pointFormat, chart, chartComponent, getPrecisionFromAxis} = this.props;
		const selectIndex = pointFormat.x;
		const yAxis = chart.yAxis[0]
		let baseCasePoints = {};
	    let adjustedPoints = {};
	    chart.series.filter(series => series.userOptions.type == "line").forEach((series) => {
		    const name = series.name;
		    if(name.indexOf("Base Case") == 0) {
		    	const newName = name.replace(/^Base\sCase\s/, "");
			    baseCasePoints[newName] = series.yData[selectIndex];
		    } else if(name.indexOf("Adjusted") == 0) {
			    const newName = name.replace(/^Adjusted\s/, "");
			    adjustedPoints[newName] = series.yData[selectIndex];
		    }
	    })

	    return (<ChartTooltipBox>
		    <ChartTooltipTitle>
				<FormattedMessage defaultMessage="Horizon" description="[highcharts] Tooltip title in Through Time Statistics chart - Horizon" />	
			</ChartTooltipTitle>
		    <ChartTooltipValueSet
			    label={"Year"}
			    value={selectIndex}
		    />

		    <ChartTooltipTitle>
				<FormattedMessage defaultMessage="Base Case" description="[highcharts] Tooltip title in Through Time Statistics chart - Base Case" />	
			</ChartTooltipTitle>
		    <ChartTooltipValueSet
			    label={"Mean"}
			    value={getPrecisionFromAxis(baseCasePoints["Mean"], yAxis)}
		    />

		    {Object.keys(baseCasePoints).filter(k => k != "Mean").sort((a,b) => Number(a) < Number(b) ? 1 : -1).map((key, index) => {
			    let value = baseCasePoints[key];

			    return <ChartTooltipValueSet
					    key={`tb${index}`}
					    label={`${key}%`}
					    value={getPrecisionFromAxis(value, yAxis)}
				    />
		    })}

		    <ChartTooltipTitle>
				<FormattedMessage defaultMessage="Adjusted" description="[highcharts] Tooltip title in Through Time Statistics chart - Adjusted" />	
			</ChartTooltipTitle>
		    <ChartTooltipValueSet
			    label={"Mean"}
			    value={getPrecisionFromAxis(adjustedPoints["Mean"], yAxis)}
		    />

		    {Object.keys(adjustedPoints).filter(k => k != "Mean").sort((a,b) => Number(a) < Number(b) ? 1 : -1).map((key, index) => {
			    let value = adjustedPoints[key];

			    return <ChartTooltipValueSet
				    key={`ta${index}`}
				    label={`${key}%`}
				    value={getPrecisionFromAxis(value, yAxis)}
			    />
		    })}
	    </ChartTooltipBox>)
    }
}
