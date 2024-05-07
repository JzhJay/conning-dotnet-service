import {getBasePercentileHighchartsObject} from './percentileTemplate'
import type {PercentileChartData, PivotMetadata, ChartUserOptions} from 'stores/queryResult'

export function getHighchartsConeObject(chartData: PercentileChartData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions):HighchartsSeriesChart {
    const basePercentileObject = getBasePercentileHighchartsObject(chartData, pivotMetadata, userOptions);

    const result = {
        chart: {
            type: "arearange",
	        inverted: userOptions.isInverted,
	        showMeanValues: userOptions.showMeanValues,
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                lineColor: "rgb(255,255,255)",
                states: {
                    hover: {
                        enabled: false,
                        //lineWidthPlus: 0
                    }
                },
                fillOpacity: 1,
	            marker: {
		            enabled: false
	            },
            }
        },
        legend: {
            //symbolHeight: 18
	        squareSymbol: false
        },
        tooltip: {
            shared: false,
            crosshairs: {color: 'rgba(255, 255, 255, .1'},
        }
    }

    return _.merge({}, basePercentileObject, result, userOptions.highchartsOptions);
}
