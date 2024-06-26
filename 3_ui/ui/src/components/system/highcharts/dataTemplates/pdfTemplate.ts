import {HighchartDataTemplate, getHighchartsSeriesObject, getAxisNames, mergeWithUserOptions} from './highchartDataTemplate'
import type {PdfData, PivotMetadata, ChartUserOptions} from 'stores/queryResult';
import { i18n } from 'stores';

export function getHighchartsPDFObject(chartData: PdfData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions) {
    let series = getHighchartsSeriesObject(chartData.series, pivotMetadata, true) as any;

    let axisNames = getAxisNames(pivotMetadata);
	let legendTitle = axisNames.length == 1 ? axisNames[0] : "";

    let result = {
        statistics: series.length === 1 ? series[0].moments : null,
        axisNames: axisNames,
        percentilesData: series.length === 1 ? series[0].percentiles : null,
        chart: {
            type: "area",
	        inverted: userOptions.isInverted
        },
        plotOptions: {
            series: {
                // boostThreshold: 1000000,
                marker: {enabled: false}
            }
        },
        xAxis: [{
        }],
        yAxis: [{
            title: {text: i18n.intl.formatMessage({
				defaultMessage: 'Probability Density',
				description: '[highcharts] PDF y-axis title - Probability Density'
			})}
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
            shape: "square", //prevent callout on tooltip
        }
    }

    if (userOptions.percentiles.length > 0 && result.percentilesData)
        result.xAxis.push(getPercentileSecondaryXAxis() as any);

    return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}

export function getPercentileSecondaryXAxis():HighchartsAxisOptions {
    return {
        title: {
            text: i18n.intl.formatMessage({
				defaultMessage: 'Percentile %',
				description: '[highcharts] PDF percentile secondary x-axis title - Percentile %'
			})
        },
        gridLineWidth: 0,
        tickWidth: 0,
        lineWidth: 0,
        opposite: true,
    }
}
