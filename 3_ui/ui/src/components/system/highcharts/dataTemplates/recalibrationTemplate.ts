import {ModelChartingResult} from 'components/system/rsSimulation/rwRecalibration/ModelChart';
import {HighchartDataTemplate, rgbColors} from "./highchartDataTemplate";
import type {ChartUserOptions} from 'stores/queryResult';
import {Option} from 'components';
import {IModelDefinition} from 'stores/rsSimulation/rwRecalibration/models';
import {IModelChartingResult} from 'components/system/rsSimulation/internal/RecalibrationChartingModels';

export function getHighchartsRecalibrationObject(modelChartingResult: IModelChartingResult, userOptions: ChartUserOptions) {

	const hasGroupedSeries = modelChartingResult.hasGroupedSeries;
	const series1: object[] = [];
	const series2: object[] = [];
	const series3: object[] = [];
	const legends = [];
	const xAxisTitle = modelChartingResult.xAxisDefinition.title;
	let seriesTitle = hasGroupedSeries ?
	                    _.map(modelChartingResult.seriesGroupDefinitions, (def: Option | IModelDefinition) => def.title).join(', ') :
	                    "";
	const renderYsAsSeries = modelChartingResult.yMap && modelChartingResult.yMap.length > 1;

	if (modelChartingResult.yMap) {
		legends.push({type: 'line', name: `Market`, color: '#000', dashStyle: 'dash'});
		legends.push({type: 'line', name: `Computed`, color: '#000', dashStyle: 'solid', connDividerAfter: true});

		_.forEach(modelChartingResult.yMap, (marketComputedPair, yIndex) => {
			modelChartingResult.data.map((chartData, seriesIndex) => {
				let title     = hasGroupedSeries ? `${chartData.title}` : marketComputedPair.targetTitle;
				const seriesKey = hasGroupedSeries ? title.replace(`${seriesTitle} `, "") : "";
				const colorIndex = modelChartingResult.yMap.length == 1 ? seriesIndex : yIndex;
				const color     = colorIndex < rgbColors.length ? `rgb(${rgbColors[colorIndex]})` : `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
				const shouldStack = hasGroupedSeries || renderYsAsSeries;

				series2.push({
					type:      'line',
					name:       shouldStack ? `${seriesTitle},${seriesKey},Market` : "Market",
					dashStyle: 'dash',
					color:     color,
					data:      chartData[marketComputedPair.target],
					stack:     shouldStack ? `${title},Market` : "Market"
				});

				if (chartData[marketComputedPair.computed] && marketComputedPair.computedTitle) {
					series1.push({
						type:      'line',
						name:      shouldStack ? `${seriesTitle},${seriesKey},Computed` : "Computed",
						dashStyle: 'Solid',
						color:     color,
						data:     chartData[marketComputedPair.computed].map((value, i) => chartData[marketComputedPair.target][i][1] == null ? [] : value), // Remove computed if target is missing
						stack:    shouldStack ? `${title},Computed` : "Computed"
					});
				}

				legends.push({type: 'area', name: title, color: color});
			})
		})
	}
	else {
		legends.push({type: 'scatter', name: `Target`, color: '#000'});
		legends.push({type: 'line', name: `Previous`, color: '#000', dashStyle: 'dash'});
		legends.push({type: 'line', name: `Current`, color: '#000', dashStyle: 'solid', connDividerAfter: true});

		_.forEach(modelChartingResult.data, (resultData, i) => {
			const title     = `${resultData.title}`;
			const seriesKey = hasGroupedSeries ? title.replace(`${seriesTitle} `, "") : "";
			const color     = i < rgbColors.length ? `rgb(${rgbColors[i]})` : `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
			series1.push({
				type:  'scatter',
				name:  hasGroupedSeries ? `${seriesTitle},${seriesKey},Target` : 'Target',
				color: color,
				data:  resultData.targetValue,
				stack: `${title},Target`
			});
			series2.push({
				type:      'line',
				name:      hasGroupedSeries ? `${seriesTitle},${seriesKey},Previous` : 'Previous',
				dashStyle: 'dash',
				color:     color,
				data:      resultData.valueBasedOnPreviousParameters,
				stack:     `${title},Previous`
			});
			series3.push({
				type:      'line',
				name:      hasGroupedSeries ? `${seriesTitle},${seriesKey},Current` : 'Current',
				dashStyle: 'Solid',
				color:     color,
				data:      resultData.valueBasedOnCurrentParameters,
				stack:     `${title},Current`
			});

			legends.push({type: 'area', name: `${title}`, color: color});
		});
	}

	const series = [...series2, ...series3, ...series1];

	let result = {
		chart: {
			inverted: userOptions.isInverted
		},
		xAxis: [{
			title: {text: xAxisTitle},
			categories: modelChartingResult.categories
		}],
		yAxis: [{
			title: {text: modelChartingResult.yAxisTitle || 'Yield'}
		}],
		plotOptions: {
			series: {
				boostThreshold: Number.MAX_VALUE,
				states: {
					hover: {
						enabled: false,
						marker:	{ enabled: false }
					},
					select: {
						enabled: false,
						marker:	{ enabled: false }
					},
					inactive: { enabled: false }
				}
			},
			line: {
				marker: { enabled: false }
			},
			scatter: {
				marker: { symbol: "circle" }
			}
		},
		series: series,
		iconningLegend: hasGroupedSeries || renderYsAsSeries ? legends : null
	};

	return _.merge({}, new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);

}
