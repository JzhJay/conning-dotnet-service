import {HighchartDataTemplate, getHighchartsSeriesObject, getAxisNames, mergeWithUserOptions} from './highchartDataTemplate'
//import {api, models} from 'stores';
import type {CdfData, PivotMetadata, ChartUserOptions} from 'stores/queryResult';
import {StepPattern} from 'stores/queryResult';
import { i18n } from 'stores';

export function getHighchartsCDFObject(chartData:CdfData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions) {
    let series = getHighchartsSeriesObject(chartData.series, pivotMetadata, true) as any;

    series.forEach((s) => {
        s.data = getSeriesData(s, userOptions.stepPattern === StepPattern.Vertical);

        if (series.length === 1) {
	        s.color = "rgba(255, 192, 0, 1)";
	        s.lineWidth = 4;
        }
    })

    let axisNames = getAxisNames(pivotMetadata);
    let legendTitle = axisNames.length == 1 ? axisNames[0] : "";

    let result:HighchartsOptions = {
        statistics: series.length === 1 ? series[0].moments : null,
        axisNames: axisNames,
	    originalSeriesData: chartData.series,
        chart: {
            type: "line",
	        animation:false, // Disable animation on box zooming which is too slow for big cdfs
            inverted: userOptions.isInverted
        },
        plotOptions: {
            series: {
                // boostThreshold: 1000000,
                marker: {enabled: false}
            }
        },
        xAxis: [{
            title: {text: "Value"},
        }],
        yAxis: [{
            title: {text: "Cumulative Density"},
            min: 0,
            max: 1
        }],
        legend: {
            title: {
                text: legendTitle
            },
	        symbolWidth:30, // use a bigger symbol width ine line charts to allow dashed legend symbols to show a more complete period
            enabled: series.length > 1
        },
        series: series,
        tooltip: {
            crosshairs: [{width: 2}, {width: 2}],
            shape: "square", //prevent callout on tooltip
        }
    }

    if (userOptions.percentiles.length > 0)
        (result.yAxis as HighchartsAxisOptions[]).push(getPercentileSecondaryYAxis());

    return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}

export function getSeriesData(series, withStepPattern)
{
    let newData;
    const compressHeight = 2000; // Hardcoded plot height since height isn't available before first render.

    if (withStepPattern) {
        newData = [[series.xValues[0], 0], [series.xValues[0], 0]];
        for (let i = 1; i < series.xValues.length; i++) {

	        const y0 = series.yValues[i - 1];
        	const y = series.yValues[i];

        	// Ideal length is the number of points being skipped, however with a max length of available y distance pixels so each point is given at least 1 pixel
           	const length = Math.min(series.xIndices[i] - series.xIndices[i - 1], Math.floor((y - y0) * compressHeight));

        	if (length > 1) {
        		// Add additional points so step progression remains smooth when optimization throws out points causing large steps.
		        const yPerStepDistance = (y - y0) / length;
		        const xPerStepDistance = (series.xValues[i] - series.xValues[i - 1]) / length;

		        for (let s = 0; s <= length; s++) {
			        const xStart = series.xValues[i - 1] + s * xPerStepDistance;
			        const nextY = y0 + s * yPerStepDistance;
			        newData.push([xStart, nextY]);
			        newData.push([xStart + xPerStepDistance, nextY]);
		        }
	        }
        	else {
		        newData.push([series.xValues[i - 1], y]);
		        newData.push([series.xValues[i], y]);
	        }
        }
    }
    else {
        newData = [[series.xValues[0], 0]];
        for (let i = 1; i < series.xValues.length; i++) {
            newData.push([series.xValues[i], series.yValues[i]]);
        }
    }
    return newData;
}

export function getPercentileSecondaryYAxis():HighchartsAxisOptions {
    return {
        title: {text: i18n.intl.formatMessage({
			defaultMessage: 'Percentile',
			description: '[highcharts] CDF percentile secondary axis title - Percentile'
		})},
        min: 0,
        max: 100,
        gridLineWidth: 0,
        opposite: true
    }
}
