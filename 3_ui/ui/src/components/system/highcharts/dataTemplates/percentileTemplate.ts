/// <reference path="../highcharts-extensions.d.ts" />
import {
	HighchartDataTemplate,
	getHighchartsSeriesObject,
	getAxisNames,
	getRowAxisNames,
	getRowCoordinateNames,
	getPercentileColorAndOpacity,
	rgbColors,
	getSeriesGroups,
	getMeanMarker
} from './highchartDataTemplate'
import type {PercentileChartData, PivotMetadata, ChartUserOptions} from 'stores/queryResult';

export function getBasePercentileHighchartsObject(chartData: PercentileChartData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions) {
	let series = getHighchartsSeriesObject(chartData.series, pivotMetadata, false);

	let columnCoordinateNames = series.map((series)=>series.columnCoordinates);

	let percentileSeries = [];
	let percentiles = chartData.params.percentiles;

	let multipleGroupings = false;

	let categories = columnCoordinateNames;
	let stacks = [[""]];

	let stackColors = _.cloneDeep(rgbColors);
	let axisNames = getAxisNames(pivotMetadata);
	let xAxisTitleNames;

	// Add a few "preferred" colors to the front of the array
	stackColors.unshift("0,82,136", "138,32,3", "0,98,37");

	// Get the unique category and stack names
	let seriesGroups = getSeriesGroups(series, false);
	if (seriesGroups) {

		// Sort the category coordintes by the inner axis so those coordinates appear in the same order as the pivot when columns are removed. e.g. with coordinates of US/2016, US/2017, US/2018, DE/2016, DE/2017, DE/2018
		// and the inner acis being used for the category, removing US/2017(without) should yield a category of 2016, 2017, 2018 and not 2016, 2018, 2017 which would occur after uniqBy
		// Note we need to sort the coordinate indices and not the name so we can't use the already created columnCoordinateNames here
		let categoryCoordinates = _.uniqBy(chartData.series.map((series)=>series.columnCoordinates).map((c, index) => {return {index, value: _.at(c, seriesGroups.bottomIndices)} }), (c) => c.value.join(", "))
		categoryCoordinates = _.sortBy(categoryCoordinates, (c) => c.value[c.value.length - 1])
		categories = _.at(columnCoordinateNames, categoryCoordinates.map((c) => c.index)).map((c) => _.at(c, seriesGroups.bottomIndices));
		//categories = _.uniqBy(columnCoordinateNames.map((c) => _.at(c, seriesGroups.bottomIndices)), (c) => c.join(", "))

		stacks = _.uniqBy(columnCoordinateNames.map((c) => _.at(c, seriesGroups.topIndices)), (c) => c.join(", "))
		multipleGroupings = true;
		xAxisTitleNames = _.at(axisNames, seriesGroups.bottomIndices)
	}
	else {
		xAxisTitleNames = axisNames;
	}

	const getCategoryIndex = (series) => {
		const category = multipleGroupings ? _.at(series.columnCoordinates, seriesGroups.bottomIndices) : series.columnCoordinates;
		return _.findIndex(categories, (o) => _.isEqual(category, o))
	}


	stacks.forEach((stack, stackIndex) =>
	{
		let stackName = getStackName(stack)
		let means = [];
		for (let i = percentiles.length - 2; i >= 0; i--) {
			let color = stackColors[stackIndex % stackColors.length];
			let colors = multipleGroupings ? [color, color] : _.clone(userOptions.colorSet).reverse();
			let colorAndOpacity = getPercentileColorAndOpacity(userOptions.percentiles, i + 1, percentiles.length, colors);
			let data = [];

			// Create data ranges for each point.
			(series as any).forEach((series) => {
				if (!multipleGroupings || getStackName(_.at(series.columnCoordinates, seriesGroups.topIndices)) === stackName) {
					data.push({x: getCategoryIndex(series), low: series.data[i], high: series.data[i + 1]});
					if (i == 0) {
						means.push({x: getCategoryIndex(series), y: series.moments.mean})
					}
				}
			})


			// Build the percentile series from the data that specifies series as categories.
			percentileSeries.push({
				name: `${percentiles[i]}% to ${percentiles[i + 1]}%`,
				hover: {enabled: true, lineWidth: 20},
				color: `rgba(${colorAndOpacity.color}, ${colorAndOpacity.opacity})`,
				fillOpacity: colorAndOpacity.opacity,
				data: data,
				stack: stackName,
				stackCoordinateNames: stack
			});
		}
		percentileSeries.push(getMeanMarker(means, stackName, userOptions));
	})

	if (categories == null || (categories[0] && categories[0].length === 0)) {
		categories = [["Distribution"]];
	}

	let result = {
		individualScenarios:chartData.underlyingData,
		individualScenariosSortedPerm:chartData.underlyingDataPermutation,
		axisNames: axisNames,
		rowAxisNames: getRowAxisNames(pivotMetadata),
		rowNames: chartData.rowCoordinates ? getRowCoordinateNames(pivotMetadata, chartData.rowCoordinates) : undefined,
		xAxisTitleNames: xAxisTitleNames,
		chart: {
			type: "arearange",
			showMeanValues: userOptions.showMeanValues,
		},
		xAxis: [{
			categories: categories,
			title: {text: xAxisTitleNames.join(", ")},
			tickPositions: categories.map((c, i) => i)
		}],
		yAxis: [{
		}],
		legend: {
			title: {
				text: multipleGroupings ? "" : "Percentile Ranges"
			},
			//symbolHeight: 18
		},
		series: percentileSeries,
		tooltip: {
			shared: false,
			crosshairs: {color: 'rgba(255, 255, 255, .1'},
		}
	}

	return _.merge(new HighchartDataTemplate(userOptions), result);
}

export function getUnderylingDataUpdateObject(chartData:PercentileChartData, pivotMetadata:PivotMetadata, highchartsOptions){
	let newOptions = {individualScenarios:chartData.underlyingData,
		individualScenariosSortedPerm:chartData.underlyingDataPermutation,
		rowNames: chartData.rowCoordinates ? getRowCoordinateNames(pivotMetadata, chartData.rowCoordinates) : ""}

	return newOptions;
}

function getStackName(stackNames)
{
	return stackNames.join(", ");
}
