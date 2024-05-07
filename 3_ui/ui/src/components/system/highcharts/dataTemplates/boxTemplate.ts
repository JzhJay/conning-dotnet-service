import {getBasePercentileHighchartsObject} from './percentileTemplate'
import {mergeWithUserOptions} from './highchartDataTemplate'
import {api} from 'stores';
import type {PivotMetadata, ChartUserOptions, PercentileChartData, ChartData} from 'stores/queryResult'


export function getHighchartsBoxObject(chartData: PercentileChartData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions): ChartData {
    let basePercentileObject = getBasePercentileHighchartsObject(chartData, pivotMetadata, userOptions);

    let multipleGroupings = basePercentileObject.series[0].stack != "";

    //let columnCoordinateNames = basePercentileObject.xAxis[0].categories;
    //let categories = columnCoordinateNames;

    let result = {
        multipleGroupings: multipleGroupings,
        chart: {
            type: "columnrange",
	        inverted: userOptions.isInverted,
	        showMeanValues: userOptions.showMeanValues,
        },
        plotOptions: {
            series: {
                groupPadding: .05,
                borderWidth: 1,
                lineColor: "rgb(255,255,255)",
                grouping: multipleGroupings,
                stacking: multipleGroupings ? "normal" : null,
                fillOpacity: 1,
	            boostThreshold: 0,
            }
        },
        legend: {
            //symbolHeight: 15,
            //itemHiddenStyle: {color: "#E6E6E6"},
	        squareSymbol:false
        },
        tooltip: {
            shared: false,
            followPointer: multipleGroupings,
            crosshairs: {color: 'rgba(255, 255, 255, .1'},
        }
    }

    return mergeWithUserOptions(_.merge({}, basePercentileObject, result), userOptions.highchartsOptions);
}
