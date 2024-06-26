import {getHighchartsRSSimulationReportObject} from 'components/system/highcharts/dataTemplates/rsSimulationReportTemplate';
import {ModelChartingResult} from 'components/system/rsSimulation/rwRecalibration/ModelChart';
import {getHighchartsAssetClassesReturnObject} from 'components/system/highcharts/dataTemplates/assetClassesReturnTemplate';
import {getHighchartsRecalibrationObject} from 'components/system/highcharts/dataTemplates/recalibrationTemplate';
import {getHighchartsLineChartWithHorizonObject} from 'components/system/highcharts/dataTemplates/lineWithHorizonTemplate';
import {getHighchartsThroughTimeStatisticsObject} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {getAssetAllocationHighchartsObject} from '../../components/system/highcharts/dataTemplates/assetAllocationTemplate';
import {getHighchartsBarChartObject} from "../../components/system/highcharts/dataTemplates/barTemplate";

const stringify = require('json-stable-stringify') as any;
import { observable, action, computed, toJS, makeObservable } from 'mobx';
import {xhr} from 'stores/xhr';
import {IChartingResult, IQueryResult, QueryResult, queryResultStore as queryResultStore} from 'stores/queryResult';
import {getCRABoxHighchartsObject} from '../../components/system/highcharts/dataTemplates/craBoxTemplate';
import {getHighchartsDistributionsAtHorizonObject} from '../../components/system/highcharts/dataTemplates/distributionsAtHorizonTemplate';
import {EfficientFrontierChartExtender} from '../../components/system/highcharts/extenders';
import {ClimateRiskAnalysis} from '../climateRiskAnalysis';
import {IO} from '../io';
import {queryStore} from '../query';
import {user} from '../user';
import type { PdfData, CdfData, PercentileChartData, HistogramData, ChartType, BeeswarmData } from './chartJuliaModels';
import type {ChartUserOptions, ChartData, ChartDataMap} from './chartComponentModels';
import {julia} from 'stores/julia/JuliaStore';

import { buildURL, mapHexColorsToRgb } from 'utility/utility'
import {getHighchartsPDFObject} from "components/system/highcharts/dataTemplates/pdfTemplate"
import {getHighchartsCDFObject} from "components/system/highcharts/dataTemplates/cdfTemplate";
import {getHighchartsConeObject} from "components/system/highcharts/dataTemplates/coneTemplate";
import {getHighchartsBoxObject} from "components/system/highcharts/dataTemplates/boxTemplate";
import {getFullPercentileValues} from "components/system/highcharts/chartUtils";
import {getHighchartsScatterObject} from "components/system/highcharts/dataTemplates/scatterTemplate";
import {getHighchartsHistogramObject} from "components/system/highcharts/dataTemplates/histogramTemplate";
import {getHighchartsLineChartObject} from "components/system/highcharts/dataTemplates/lineTemplate";
import { getHighchartsBeeswarmObject } from "../../components/system/highcharts/dataTemplates/beeswarmTemplate";
import {getHighchartsEfficientFrontierObject} from "components/system/highcharts/dataTemplates/efficientFrontierTemplate";
import {getIOBoxHighchartsObject} from "components/system/highcharts/dataTemplates/ioBoxTemplate";
import {getStatusHighchartsObject} from "components/system/highcharts/dataTemplates/statusTemplate";
import { CompactPivotData } from "../queryResult";

class ChartDataRef {
	refCount: number;
	chartData:ChartData;
}

export interface IHighchartsHelper {
	getPdfData(smoothingIndex: number, percentiles: number[]): Promise<PdfData>;
	getCdfData(min_x?:number, max_x?:number, min_y?:number, max_y?:number) : Promise<CdfData>;
	getPercentileChartData(percentiles: number[], noUnderlyingData) : Promise<PercentileChartData>;
	getHistogramData() : Promise<HistogramData>;
	getPrebuiltDataTemplate?(chartType: ChartType, userOptions: ChartUserOptions): Promise<ChartDataMap>;
	updateChartData?(key: string, chartData: ChartData) : void;
	chartDataMap?: any;
	updateChartDataRefCount?(key: string, increase: boolean): void;
	getChartDataKey?(chartType, userOptions): string;
}

export class HighchartsHelper implements IHighchartsHelper {
	constructor(public chartingResult: IChartingResult) {
        makeObservable(this);
    }

	chartDataMap = {}; // Intentionally being left as a plain map since it doesn't need to be observed. If this is ever converted to being a mobX map, all usage should be examined and updated.

	get queryResult() {
		if (this.chartingResult instanceof QueryResult) {
			return this.chartingResult as QueryResult
		}
		else {
			//console.warn("Object is not a QueryResult");
			return null;
		}
	}

	getChartDataKey = (chartType, userOptions) => {
		if (this.chartingResult instanceof QueryResult) {
			const {pivotMetadata, bootstrapEnabled, bootstrap, sensitivityEnabled, sensitivity } = this.queryResult;
			const bootstrapOptions                             = bootstrap && bootstrap.bootstrapOptions;
			return `${this.queryResult.id}-${chartType}-${pivotMetadata.arrangementUID}-${pivotMetadata.selectionUID}-${stringify(userOptions)}-${bootstrapEnabled}-${bootstrapEnabled ? stringify(bootstrapOptions) : ""}-${sensitivityEnabled}-${sensitivityEnabled ? stringify(sensitivity) : ''}`;
		}
		else {
			return `${this.chartingResult.id}-${chartType}-${stringify(userOptions)}`;
		}
	}

	@computed get url() { return this.queryResult.apiUrl}

	@action getPdfData = (smoothingIndex: number, percentiles: number[]) => {
		const { bootstrapEnabled, sensitivityEnabled } = this.queryResult;
		return this.queryResult.loadFromJulia<PdfData>(buildURL(this.url + "/pdf", {degreeOfSmoothing: queryResultStore.charting.degreeOfSmoothingAPIValues[smoothingIndex]},
																						  {percentiles: JSON.stringify(percentiles)}, {bootstrapped: null, enabled: bootstrapEnabled},
																						  {sensitivity: true, enabled: sensitivityEnabled }));
	}

	@action getCdfData = (min_x?:number, max_x?:number, min_y?:number, max_y?:number) => {
		const { bootstrapEnabled, sensitivityEnabled } = this.queryResult;
		return this.queryResult.loadFromJulia<CdfData>(buildURL(queryStore.apiUrlFor(this.queryResult.id)  + "/result/cdfCompressed", {min_x, enabled: min_x}, {max_x, enabled: max_x},
		                                                                                            {min_y, enabled: min_y}, {max_y, enabled: max_y},
																									{bootstrapped: null, enabled: bootstrapEnabled},
																									{sensitivity: true, enabled: sensitivityEnabled }));
	}

	@action getPercentileChartData = (percentiles: number[], noUnderlyingData) => {
		let {bootstrapEnabled} = this.queryResult;
		return this.queryResult.loadFromJulia<PercentileChartData>(buildURL(this.url + "/percentileChart", {percentiles: JSON.stringify(percentiles)},
		                                                                                                   {noUnderlyingData: null, enabled: noUnderlyingData},
		                                                                                                   {bootstrapped: null, enabled: bootstrapEnabled}));
	}

	@action getHistogramData = () => {
		const { bootstrapEnabled, sensitivityEnabled } = this.queryResult;
		return this.queryResult.loadFromJulia<HistogramData>(buildURL(this.url + "/histogram", {bootstrapped: null, enabled: bootstrapEnabled}, {sensitivity: true, enabled: sensitivityEnabled}));
	}

	@action getBeeswarmData = (height:number, width:number, superimpose: boolean = false, percentiles?: number[]) => {
		return this.queryResult.loadFromJulia<BeeswarmData>(buildURL(this.url + "/beeswarm", {height: height.toFixed(1), enabled:height}, {width: width.toFixed(1), enabled:width}, {percentiles: JSON.stringify(percentiles)}, {rangeOnly: true, enabled: width == 0 || height == 0}, {superimpose: superimpose, enabled:superimpose}));
	}

	@action getPrebuiltDataTemplate(chartType: ChartType, userOptions: ChartUserOptions)
	{
		if (!userOptions) {
			debugger;
		}

		let {chartDataMap} = this;

		const dataKey = this.getChartDataKey(chartType, userOptions);
		let result: Promise<ChartDataMap>;

		if (chartDataMap && chartDataMap[dataKey] && !userOptions.shouldInheritData && !(this.chartingResult instanceof IO) && !(this.chartingResult instanceof ClimateRiskAnalysis)) {
			result = new Promise<ChartDataMap>((resolve, reject) => resolve({[dataKey]: chartDataMap[dataKey]}));
		}
		else {
			result = this._getChartTemplate(chartType, toJS(userOptions)).then((data) => {
				//let chartData = {[dataKey]: {chartData: data, refCount: 0}};
				let chartData = {chartData: data, refCount: 0};
				this.chartDataMap[dataKey] = chartData;
				//dispatch(updateStore({chartDataMap: Object.assign({}, getState().highcharts.chartDataMap, chartData)}))
				return {[dataKey]:chartData};
			});
		}

		return result;
	}


	private async _getChartTemplate(chartType, userOptions): Promise<ChartData> {
		const qr = this.queryResult;
		let pivotMetadata = qr ? await qr.subPivotMetadata : null;

		switch (chartType) {
			case 'pdf': {
				const {percentiles, degreeOfSmoothingIndex} = userOptions;

				if (!percentiles || degreeOfSmoothingIndex == null) {
					throw new Error(`Invalid input options:  ${userOptions}`)
				}

				let fullPercentiles = getFullPercentileValues(percentiles);
				return this.getPdfData(degreeOfSmoothingIndex, fullPercentiles).then(data => {
					return getHighchartsPDFObject(data, pivotMetadata, userOptions);
				})
			}
			case 'cdf': {
				return this.getCdfData().then(data => {
					return getHighchartsCDFObject(data, pivotMetadata, userOptions);
				})
			}
			case 'cone':
			case 'box': {
				const {percentiles} = userOptions;

				if (!percentiles) {
					throw new Error(`Invalid input options:  ${userOptions}`)
				}

				let fullPercentiles = getFullPercentileValues(percentiles);
				return this.getPercentileChartData(fullPercentiles, true).then(data => {
					if (chartType === 'cone')
						return getHighchartsConeObject(data, pivotMetadata, userOptions);
					else
						return getHighchartsBoxObject(data, pivotMetadata, userOptions);
				})
			}
			case 'histogram': {
				return this.getHistogramData().then(data => {
					return getHighchartsHistogramObject(data, pivotMetadata, userOptions);
				})
			}
			case 'scatter': {
				return qr.pivot.getDataCompact()
					.then(data => {
						console.log('Converting data to scatter...');

						// Construct a scatter chart with the data
						return getHighchartsScatterObject(data, pivotMetadata, userOptions);
					});
			}
			case 'line': {
				return qr.pivot.getData({subpivot: true})
					.then(data => {
						console.log('Converting data to linechart...');

						// Construct a line chart with the data
						return getHighchartsLineChartObject(data, pivotMetadata, userOptions);
					});
			}
			case 'bar': {
				return qr.pivot.getData({subpivot: true})
					.then(data => {
						console.log('Converting data to barchart...');

						// Construct a bar chart with the data
						return getHighchartsBarChartObject(data, pivotMetadata, userOptions);
					});
			}
			case 'beeswarm': {
				//TODO pull from user options
				const {percentiles, degreeOfSmoothingIndex} = userOptions;

				if (!percentiles) {
					throw new Error(`Invalid input options:  ${userOptions}`)
				}

				let fullPercentiles = getFullPercentileValues(percentiles);
				return this.getBeeswarmData(userOptions.plotHeight, userOptions.plotWidth, userOptions.columnMode == "", fullPercentiles).then(data => {
					return getHighchartsBeeswarmObject(data, pivotMetadata, userOptions);
				})
			}
			case 'efficientFrontier': {
				await this.fetchTooltipEvals(userOptions, this.chartingResult as IO);
				return getHighchartsEfficientFrontierObject(this.chartingResult as IO, userOptions);
			}
			case 'ioBox': {
				return getIOBoxHighchartsObject(this.chartingResult as IO, userOptions);
			}
			case 'status': {
				return getStatusHighchartsObject(this.chartingResult as IO, userOptions);
			}
			case 'assetAllocation': {
				return getAssetAllocationHighchartsObject(this.chartingResult as IO, userOptions);
			}
			case 'assetClassesReturnsChart': {
				return getHighchartsAssetClassesReturnObject(this.chartingResult as IO, userOptions);
			}
			case 'distributionsAtHorizon': {
				const climateRiskAnalysis = this.chartingResult as ClimateRiskAnalysis;
				//await climateRiskAnalysis.getDistributionsAtHorizonData();
				return getHighchartsDistributionsAtHorizonObject(climateRiskAnalysis, userOptions);
			}
			case 'craBox':
			case 'throughTimeStatistics': {
				const {percentiles} = userOptions;
				let fullPercentiles = getFullPercentileValues(percentiles);

				const climateRiskAnalysis = this.chartingResult as ClimateRiskAnalysis;
				await climateRiskAnalysis.getThroughTimeStatisticsData(fullPercentiles);

				if (chartType == "craBox")
					return getCRABoxHighchartsObject(climateRiskAnalysis, userOptions);
				else
					return getHighchartsThroughTimeStatisticsObject(climateRiskAnalysis, userOptions);
			}

			case 'financialDamage':
			case 'volatilityShock': {
				const climateRiskAnalysis = this.chartingResult as ClimateRiskAnalysis;
				await climateRiskAnalysis.getFinancialDamageAndVolatilityShock();

				return getHighchartsLineChartWithHorizonObject(chartType, climateRiskAnalysis, userOptions);
			}

			case 'rsSimulationRecalibration': {
				const result = this.chartingResult as ModelChartingResult;

				return getHighchartsRecalibrationObject(result, userOptions);
			}

			case 'rsSimulationReport': {
				return getHighchartsRSSimulationReportObject(this.chartingResult as any, userOptions);
			}
		}
	}

	@observable storageLimit  = 10;

	@action updateChartData = (key: string, chartData: ChartData) => {
		const {chartDataMap} = this;

		let entry = chartDataMap[key];
		if (!entry) {
			entry = new ChartDataRef();
			chartDataMap[key] = entry;
		}

		entry.chartData = chartData;
	}

	/**
	 * Increases or decrease a chart data ref count
	 * @param key
	 * @param increase
	 */
	@action updateChartDataRefCount(key: string, increase: boolean) {
		const {chartDataMap, storageLimit} = this;
		const ref                        = chartDataMap[key];
		ref.refCount += increase ? 1 : -1;

		// Cleanup chartData that aren't being used if we are beyond our desired storage threshold

		let toRemove = Object.keys(chartDataMap).length - storageLimit;
		if (toRemove > 0) {
				Object.keys(chartDataMap)
				.filter(k => k !== key && chartDataMap[k].refCount === 0)
			}
		}

	async fetchTooltipEvals(userOption, chartingResult: IO) {
		if (userOption.highchartsOptions && userOption.highchartsOptions.customTooltips) {
			for (let key in userOption.highchartsOptions.customTooltips) {
				let point = userOption.highchartsOptions.customTooltips[key];
				if (point.hasCustomTooltip && chartingResult.evaluations[point.connEvalIndex] != null && !chartingResult.evaluationHasDetails(point.connEvalIndex)) {
					await chartingResult.loadEvaluation(point.evalIndex);
				}
			}
		}
	}
}
