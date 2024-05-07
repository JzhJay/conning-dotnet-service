/// <reference path="../highcharts-extensions.d.ts" />
import {IO} from '../../../../stores/io';
import {getFullPercentileValues} from '../chartUtils';
import {HighchartDataTemplate, getHighchartsSeriesObject, getAxisNames, getRowAxisNames, getRowCoordinateNames, getPercentileColorAndOpacity, rgbColors, getSeriesGroups} from './highchartDataTemplate'
import type {ChartUserOptions} from 'stores/queryResult';

export function getStatusHighchartsObject(io: IO, userOptions: ChartUserOptions,) {
	let categories = io.lambdaEvaluations.map(l => l.name);

	if (io.currentPage.canShowHoverPoint) {
		categories.push("")
	}

    let result = {
        chart: {
            type: "column",
        },
	    title: {text: "Status"},
	    plotOptions: {
		    series: {
			    lineColor: "rgb(255,255,255)",
			    grouping: false,
			    stacking: null,
			    fillOpacity: 1,
			    boostThreshold: 0,
			    pointPadding: 0,
			    groupPadding: io.columnPadding,
			    borderWidth: 0
		    }
	    },
        xAxis: [{
            categories: categories,
	        max: categories.length - 1,
            //tickPositions: categories.map((c, i) => i)
        }],
        yAxis: [{
	        gridLineWidth: 0,
	        title: {text: "Evaluations"},
	        min: 0,
	        max: null,
	        minRange: 1,
	        minTickInterval: 1,
	        visible: true
        }],
        legend: {
            enabled: true
        },
        series: [{
        	    name: "Waiting",
		        data: getStatusPoints(io,"Waiting"),
	            minPointLength: 2,
		        color: "rgb(255, 0, 0)",
	        },{
        	    name: "Optimizing",
		        data: getStatusPoints(io,"Optimizing"),
	            minPointLength: 2,
		        color: "rgb(0, 255, 0)",
	        },{
        	    name: "Done",
		        data: getStatusPoints(io,"Done"),
		        color: "rgb(0, 0, 255)",
	        }
        ]
    }

	result.yAxis[0].max = getYMaximum(io, result.series);

    return _.merge(new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);
}

export function getStatusPoints(io, status) {
	return io.lambda.map((l, i) => (l.status == status ? {x: i, y: l.numberEvaluations, name: io.getFrontierName(i)} : null)).filter(l => l != null);
}

export function getYMaximum(io, series) {
	const max: number = _.max(series.map(s => _.max(s.data.map(d => d.y))));
	const multiple = max > 0 ? Math.ceil(max / io.optimizationControls.maximumNumberOfIterations) : 1;

	// Clip at a multiple of maxNumberOfIterations or a "power of 10" ( 1 -> 10, 20 -> 100, 300 -> 1000, etc)
	return Math.min(io.optimizationControls.maximumNumberOfIterations * multiple * 1.1, Math.pow(10, Math.floor(max).toString().length));
}
