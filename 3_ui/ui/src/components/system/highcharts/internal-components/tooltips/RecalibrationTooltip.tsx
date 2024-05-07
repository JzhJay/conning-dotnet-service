import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from './ChartTooltips.base';
import {i18n} from 'stores';

interface MyProps {
    chart: HighchartsChartObject;

    point?: any;
	pointFormat?: any;
	chartComponent: any;
	getPrecisionFromAxis: (value, axis, extendDecimal?) => {};
}

export class RecalibrationTooltip extends React.Component<MyProps, {}> {

    render() {

	    const {pointFormat, chart, chartComponent, getPrecisionFromAxis} = this.props;
		const selectIndex = pointFormat.x;
		const pointStack = `${pointFormat.series.options.stack}`.split(',');
	    pointStack.pop();
		const stackLength = pointStack.length;

	    const yAxis = chart.yAxis[0];
		let points = {};

	    chart.series.forEach((series) => {
			const stack = `${series.options.stack}`.split(',');
			if (_.isEqual(pointStack, stack.slice(0, stackLength))) {
				const point = _.find(series.points, point => point.category == selectIndex);
				points[_.last(stack)] = point?.y;
			}
	    })

	    return (<ChartTooltipBox>
		    <ChartTooltipValueSet
			    label={chart.xAxis[0].userOptions.title.text}
			    value={selectIndex}
		    />
		    {_.map(pointStack, (stack,i) => {
			    if (stack == '') {
				    return null;
			    }
				const stackSplit = stack.split(":");

				if (stackSplit.length == 1)
					stackSplit.unshift(i18n.highcharts.tooltipValueSet.series)

			    return <ChartTooltipValueSet
				    key={`${stack}_${i}`}
				    label={`${stackSplit[0]}`.trim()}
				    value={`${stackSplit[1]}`.trim()}
			    />
		    })}
		    <br/>
		    <ChartTooltipTitle>{yAxis.userOptions.title.text}:</ChartTooltipTitle>
		    {
			    points["Target"] ?
			    <>
				    <ChartTooltipValueSet
					    label={i18n.highcharts.tooltipValueSet.target}
					    value={getPrecisionFromAxis(points["Target"], yAxis)}
				    />
				    <ChartTooltipValueSet
					    label={i18n.highcharts.tooltipValueSet.previous}
					    value={getPrecisionFromAxis(points["Previous"], yAxis)}
				    />
				    <ChartTooltipValueSet
					    label={i18n.highcharts.tooltipValueSet.current}
					    value={getPrecisionFromAxis(points["Current"], yAxis)}
				    />
			    </> :
			    Object.keys(points).map(key => <ChartTooltipValueSet
				    label={key}
				    value={getPrecisionFromAxis(points[key], yAxis)}
			    />)
		    }
	    </ChartTooltipBox>)
    }
}
