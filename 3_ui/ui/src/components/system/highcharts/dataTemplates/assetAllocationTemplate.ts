/// <reference path="../highcharts-extensions.d.ts" />
import {IO} from '../../../../stores/io';
import {getFullPercentileValues} from '../chartUtils';
import {
	HighchartDataTemplate,
	getHighchartsSeriesObject,
	getAxisNames,
	getRowAxisNames,
	getRowCoordinateNames,
	getPercentileColorAndOpacity,
	rgbColors,
	getSeriesGroups,
	mergeWithUserOptions
} from './highchartDataTemplate'
import type {ChartUserOptions} from 'stores/queryResult';

export function getAssetAllocationHighchartsObject(io: IO, userOptions: ChartUserOptions) {
	let evaluations = io.datasetEvaluations(userOptions);
	let categories = evaluations.map((e) => e.name);

    if (io.currentPage.canShowHoverPoint) {
	    categories.push("Hover")
    }

    const hasLambdaPoint = evaluations.find(e => e.assetAllocation != null) != null;
    const level = userOptions.assetGroupLevel;
    let series = io.assetGroups(level).map((a, i) => {
    	const data = evaluations.map((e, j) => ({x: j, y: e.assetAllocation ? io.allocationsAtLevel(level, e.assetAllocation)[i] * 100 : 0}));

    	// Remove assets not in play when we have at least 1 lambda point. Subsequent to that render all assets so legend can be correctly positioned.
	    const showInLegend = !hasLambdaPoint || data.find((d) => d.y != 0) != null;

	    return {data, name: a.name, color: a.color, showInLegend};
    })

    let result = {
        chart: {
            type: "column",
	        ignoreHiddenSeries: true,
        },
	    title: {text: "Asset Allocation"},
	    plotOptions: {
		    series: {
			    stacking: 'normal',
			    fillOpacity: .9,
			    boostThreshold: 0,
			    pointPadding: 0,
			    groupPadding: io.columnPadding,
			    borderWidth: 0,
			    animationLimit: 10000,
			    states: {
			    	inactive: {
					    opacity: 1
				    }
			    }
		    }
	    },
        xAxis: [{
            categories: categories,
	        max: categories.length - 1,
        }],
        yAxis: [{
	        title: {text: "Allocation"},
	        min: 0,
	        max: 100,
        }],
	    legend: {
		    squareSymbol: false,
		    //symbolHeight: 18
	    },
        series: series,
        tooltip: {
	        crosshairs: {color: 'rgba(255, 255, 255, .1'},
	        followPointer: true
        }
    }

    return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}
