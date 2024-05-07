import {HighchartDataTemplate, getHighchartsSeriesObject, getAxisNames, mergeWithUserOptions, rgbColors} from './highchartDataTemplate'
import type {HistogramData, PivotMetadata, ChartUserOptions, HistogramSeries, HistogramRange} from 'stores/queryResult'

export function getHighchartsHistogramObject(chartData: HistogramData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions) {

    let granularityChoice = getGranularityFromIndex(userOptions.degreeOfSmoothingIndex);
    let granularity = chartData.granularity[granularityChoice] ;
    let series = getHighchartsSeriesObject(granularity.series, pivotMetadata, false) as any;

    let start = .05;
    let end = .5;
    series.forEach((s, i) => {
        // Assuming width of first (widest) series is 1, let the last series be sqrt(1/N) and size other series proportionally.
        // For example, with two series, if the first is 1.0 the second is .707.  If there are three series and the first is 1.0 the third
        // is .577 and the second is halfway between the first and second, or .789.
        if (series.length > 1)
            s.pointPadding = start + (end - start) * (i / (series.length - 1)) * (1 - Math.sqrt(1 / series.length));
        s.color = "rgba(" + rgbColors[i % rgbColors.length] + ",.6)";
        s.borderColor = s.color;

        s.data = getHistogramSeriesData(s, granularity.range);
    })

    let axisNames = getAxisNames(pivotMetadata);
    let legendTitle = axisNames.join(", ");

    let result = {
        statistics: series.length === 1 ? series[0].moments : null,
        axisNames: axisNames,
        granularity: chartData.granularity,
        chart: {
            type: "column",
	        inverted: userOptions.isInverted
        },
        plotOptions: {
            series: {
	            groupPadding: .05,
                borderWidth: 1,
                grouping: false,
            }
        },
        xAxis: [{
            title: {text: "Value"},
            startOnTick: true,
	        min: granularity.range.start,
	        max: granularity.range.start + granularity.range.step * granularity.range.length
        }],
        yAxis: [{
            title: {text: "Count"}
        }],
        legend: {
            title: {
                text: legendTitle
            },
            enabled: series.length > 1
        },
        series: series,
        tooltip: {
            enabled:false
            //shape: "square", //prevent callout on tooltip
        },
        responsive: {
	        rules: [
		        {
			        condition: {
				        minWidth: 1001,
			        },
				    chartOptions:{ plotOptions: {
					        series: {
						        groupPadding: .05,
					        }
				    }}
		        },
		        {
			        condition: {
				        maxWidth: 1000,
			        },
			        chartOptions:{ plotOptions: {
				        series: {
					        groupPadding: .1,
				        }
			        }}
	            },
		        {
			        condition: {
				        maxWidth: 500,
			        },
			        chartOptions:{ plotOptions: {
				        series: {
					        groupPadding: .2,
				        }
			        }}
		    }]
        }
    }

    return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}

export function getHistogramSeriesData(series: HistogramSeries, range: HistogramRange)
{
    return series.data.map((d, j) => {
        let startX = range.start + range.step * j;
        return {x:startX + range.step/2, y:d, name:`${startX.toFixed(2)}:${(startX + range.step).toFixed(2)}`};
    })
}

export function getGranularityFromIndex(index)
{
    const granularityLevels = ["fine", "medium", "coarse"];
    return granularityLevels[index];
}

