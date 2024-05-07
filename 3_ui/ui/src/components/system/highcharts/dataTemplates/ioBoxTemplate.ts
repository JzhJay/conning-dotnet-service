/// <reference path="../highcharts-extensions.d.ts" />
import {IO} from '../../../../stores/io';
import {user} from '../../../../stores/user';
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
	mergeWithUserOptions, getMeanMarker
} from './highchartDataTemplate'
import { i18n } from 'stores';
import type {ChartUserOptions} from 'stores/queryResult';

export function getIOBoxHighchartsObject(io: IO, userOptions: ChartUserOptions,) {
    let percentileSeries = [];
    const percentiles = getFullPercentileValues(userOptions.percentiles);

	let evaluations = io.datasetEvaluations(userOptions);
	let categories = evaluations.map((e) => e.name);

	// TODO: Combine with PercentileTemplate::getBasePercentileHighchartsObject
    let means = [];
    for (let i = percentiles.length - 2; i >= 0; i--) {
        let colors = _.clone(userOptions.colorSet).reverse();
        let colorAndOpacity = getPercentileColorAndOpacity(userOptions.percentiles, i + 1, percentiles.length, colors);
        let data = [];
		let percentileIndex = io.outputControls.percentiles.indexOf(percentiles[i]);
	    let nextPercentileIndex = io.outputControls.percentiles.indexOf(percentiles[i + 1]);

        // Create data ranges for each point.
        evaluations.forEach((point, categoryIndex) => {
	        //const categoryIndex = _.findIndex(categories, (o) => _.isEqual(point.name, o));
        	if (point.percentiles != null) {
	            data.push({x: categoryIndex, low: point.percentiles[percentileIndex], high: point.percentiles[nextPercentileIndex]});
	            if (i == 0) {
		            means.push({x: categoryIndex, y: point.mean});
	            }
        	}
        	else {
		        data.push({x: categoryIndex, low: 0, high: 0});
	        }

        })

        // Build the percentile series from the data that specifies series as categories.
        percentileSeries.push({
            name: `${percentiles[i]}% to ${percentiles[i + 1]}%`,
            hover: {enabled: true, lineWidth: 20},
            color: `rgba(${colorAndOpacity.color}, ${colorAndOpacity.opacity})`,
            fillOpacity: colorAndOpacity.opacity,
            data: data,
	        ...(i == 0 ? {dataLabels: {allowOverlap: true}} : null) // smallest label should always show.
        });
    }

	if (io.currentPage.canShowHoverPoint) {
	    categories.push("Hover")
    }

	percentileSeries.push(getMeanMarker(means, null, userOptions));

    let result = {
        chart: {
            type: "columnrange",
	        showMeanValues: userOptions.showMeanValues
        },
	    title: {text: i18n.intl.formatMessage({
			defaultMessage: 'Distribution of Outcomes',
			description: '[highcharts] Box chart title - Distribution of Outcomes'
		})},
	    plotOptions: {
		    series: {
			    lineColor: "rgb(255,255,255)",
			    grouping: false,
			    stacking: null,
			    fillOpacity: 1,
			    boostThreshold: 0,
			    pointPadding: 0,
			    groupPadding: io.columnPadding,
			    borderWidth: 1,
			    dataLabels: { padding: 0 }
		    },
		    columnrange: {
			    grouping: false
		    }
	    },
        xAxis: [{
            categories: categories,
	        max: categories.length - 1,
            //tickPositions: categories.map((c, i) => i)
        }],
        yAxis: [{
	        title: {text: i18n.intl.formatMessage({
				defaultMessage: 'Reward',
				description: '[highcharts] Box chart y-axis title - Reward'
			})}
        }],
        legend: {
	        squareSymbol:false,
            title: {
                text: i18n.intl.formatMessage({
					defaultMessage: 'Percentile Ranges',
					description: '[highcharts] Box chart legend title - Percentile Ranges'
				}) 
            },
            //symbolHeight: 18
        },
        series: percentileSeries,
        tooltip: {
            shared: true,
            crosshairs: {color: 'rgba(255, 255, 255, .1'},
	        followPointer: true
        }
    }

	return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}
