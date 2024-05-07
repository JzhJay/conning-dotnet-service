/// <reference path="../highcharts-extensions.d.ts" />
import {ClimateRiskAnalysis} from '../../../../stores/climateRiskAnalysis';
import {CRA_COLORS_RAW} from '../chartConstants';
import {getFullPercentileValues} from '../chartUtils';
import {
	HighchartDataTemplate,
	getPercentileColorAndOpacity,
	mergeWithUserOptions, getMeanMarker
} from './highchartDataTemplate'
import type {ChartUserOptions} from 'stores/queryResult';

export function getCRABoxHighchartsObject(climateRiskAnalysis: ClimateRiskAnalysis, userOptions: ChartUserOptions) {
	let percentileSeries = [];
	const percentiles = getFullPercentileValues(userOptions.percentiles);

	let {basecase, adjusted} = climateRiskAnalysis.output.throughTimeStatistics;
	const stackKeys = ["basecase", "adjusted"];
	const stackNames = ['Base Case', 'Adjusted'];

	const percentileKey = (p) => `=${p}%`;
	let categories = _.range(0, basecase["Mean"].length);

	stackKeys.forEach((key, stackIndex) => {
		let stack = climateRiskAnalysis.output.throughTimeStatistics[key];
		const stackName = stackNames[stackIndex];

		let means = [];
		for (let i = percentiles.length - 2; i >= 0; i--) {
			let colorAndOpacity     = getPercentileColorAndOpacity(userOptions.percentiles, i + 1, percentiles.length, [CRA_COLORS_RAW[stackIndex], CRA_COLORS_RAW[stackIndex]]);
			let data                = [];
			let percentileIndex     = i;
			let nextPercentileIndex = i + 1;

			// Create data ranges for each point.
			categories.forEach((_, categoryIndex) => {
				const high = stack[percentileKey(percentiles[nextPercentileIndex])][categoryIndex];
				const low  = stack[percentileKey(percentiles[percentileIndex])][categoryIndex];
				data.push({x: categoryIndex, low: low, high: high});
				if (i == 0) {
					means.push({x: categoryIndex, y: stack["Mean"][categoryIndex]});
				}
			})

			// Build the percentile series
			percentileSeries.push({
				name:        `${percentiles[i]}% to ${percentiles[i + 1]}%`,
				hover:       {enabled: true, lineWidth: 20},
				color:       `rgba(${colorAndOpacity.color}, ${colorAndOpacity.opacity})`,
				fillOpacity: colorAndOpacity.opacity,
				stackCoordinateNames: [stackName],
				stack:   stackName,
				data:        data,
			});
		}

		percentileSeries.push(getMeanMarker(means, stackName, userOptions));
	})

	const xMax = userOptions.horizon;
	let yMax = null, yMin = null;
	_.forEach( [...Object.values(basecase), ...Object.values(adjusted)], arr => {
		const data = arr.slice(0,xMax+1);
		yMax = yMax ? Math.max(yMax, ...data) : Math.max(...data);
		yMin = Math.min(yMin || yMax, ...data);
	});
	yMin = yMin - Math.min(yMin * 0.1, 1000);
	yMax = yMax + Math.min(yMax * 0.1, 1000);

	let result = {
		multipleGroupings: true,
		axisNames: ["Names", "Names"],
		chart: {
			type: "columnrange",
			showMeanValues: userOptions.showMeanValues
		},
		plotOptions: {
			series: {
				groupPadding: .05,
				borderWidth: 1,
				lineColor: "rgb(255,255,255)",
				grouping: true,
				stacking: "normal",
				fillOpacity: 1,
				boostThreshold: 0,
			}
		},
		xAxis: [{
			title: {text: "Horizon (Years)"},
			categories: categories,
			max: xMax
		}],
		yAxis: [{
			title: {text: "Market Value"},
			max: yMax
		}],
		legend: {
			squareSymbol: false
		},
		series: percentileSeries,
		tooltip: {
			shared: false,
			crosshairs: {color: 'rgba(255, 255, 255, .1'},
			followPointer: true
		}
	}

	return mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);
}
