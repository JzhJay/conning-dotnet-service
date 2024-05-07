import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {site} from 'stores/site';
import type {IOViewName, ChartUserOptions, ChartType} from 'stores';
import {
	routing,
	omdb,
	IO,
	IOViews,
	IOGuid, JuliaIO, GridlinesType, ChartAxisMaximumType, Simulation
} from 'stores';
import {observable, action, computed, makeObservable} from 'mobx';

import * as hightchartComponentCSS from 'components/system/highcharts/highchartsComponent.css';
import * as evaluationComparisonViewCSS from '../../components/system/IO/internal/evaluationComparison/EvaluationComparisonView.css';
import * as strategySummaryViewCSS from '../../components/system/IO/internal/StrategySummaryView.css';
import * as directionalConstraintViewCSS from '../../components/system/IO/internal/DirectionalConstraintView.css';
import * as dominanceViewCSS from '../../components/system/IO/internal/DominanceView.css';
import * as assetClassesReturnsTableViewCSS from '../../components/system/IO/internal/AssetClassesReturnsTableView.css';

export class IOStore {
	constructor() {
        makeObservable(this);
    }

	@observable ios = observable.map<string, IO>({}, {deep: false});
	@observable pendingSessions = [];

	getRelatedSimulationFilter = (includeRepositories: boolean = true, includeSimulations: boolean = true) => {
		const sourceType = [];
		includeRepositories && sourceType.push(Simulation.SOURCE_TYPE.REPOSITORY);
		if (includeSimulations) {
			sourceType.push(Simulation.SOURCE_TYPE.CLASSIC);
			sourceType.push(Simulation.SOURCE_TYPE.FIRM);
		}
		return {status: ["Complete"], sourceType: sourceType }
	};

	// TODO: factor with query result.
	charting = {
		defaultUserOptions:         (chartType: ChartType) => ({
			panOrZoom:              'zoom',
			fontSize:               14,
			fontSizes:              [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96],
			canResetZoom:           false,
			isInverted:             false,
			percentiles:            [0, 1, 5, 25, 50],
			colorSet:               ["0,98,37", "138,32,3"],
			gridLine:               chartType === 'efficientFrontier' ? GridlinesType.Both : GridlinesType.Horizontal,
			showMeanValues:         true,
			verticalAxisDirection:  'top',
			horizontalAxisDirection:chartType === 'efficientFrontier' ? null : 'left',
			plotWidth:              0,
			plotHeight:             0,
			highchartsOptions:      null,
			...this.baseOutputUserOptions(chartType as IOViewName),

			donutSize:              1,
			assetGroupLevel:        2,
			showFullFrontier:           true,
			showFrontierLine:           true,
			showIterationLines:         false,
			showIterationPoints:        false,
			showDirectionPoints:        false,
			showDistancePoints:         false,
			showHistoricalPoints:       false,
			showRandomPoints:           true,
			fullFrontierPointStyle:     {color: '0,0,0', opacity: 1, radius: 5, symbol: 'circle'},
			iterationPointStyle:        {color: '102,161,72', opacity: .5, radius: 5, symbol: 'circle'},
			directionPointStyle:        {color: '124,181,236', opacity: .25, radius: 5, symbol: 'circle'},
			distancePointStyle:         {color: '124,181,236', opacity: .5, radius: 5, symbol: 'circle'},
			historicalPointStyle:       {color: '186,21,21', opacity: .25, radius: 5, symbol: 'circle'},
			randomPointStyle:           {color: '186,21,21', opacity: .25, radius: 5, symbol: 'circle'},
		} as ChartUserOptions)
	}

	inputUserOptions = (viewType: IOViewName) => ({
		verboseMode: false
	})

	baseOutputUserOptions = (viewType: IOViewName) => ({
		shouldInheritData:      viewType != "status",
		showEfficientFrontier:  viewType != "status",
		showAdditionalPoints:   viewType != "status",
		showGroupAdditionalPoints: viewType != "status",
		showLambdaPoints:       viewType == "status"
	})

	tabularUserOptions = (viewType: IOViewName) => ({
		showDuration              : true,
		showAssetClass            : true,
		showTotal                 : true,
		showMetrics               : true,
		showMean                  : false,
		showMin                   : false,
		showMax                   : false,
		showPercentiles           : false,
		showCtes                  : false,
		showStandardDeviation     : false,
		enabledAssetGroupLevels:[true, true, true],
		percentiles:            [0, 1, 5, 25, 50],
		ctes:                   [{area: 'under', percentile: 1}, {area: 'under', percentile: 5}],
		rowsOrder:              ['showDuration','showAssetClass','showTotal','showMetrics','showMean','showMin','showMax','showPercentiles','showCtes','showStandardDeviation'],
	})

	dominanceUserOptions = (viewType: IOViewName) => ({
		...this.evaluationComparisonUserOptions(viewType),
		showDominanceFractions: false,
		zoomToFit: false
	})

	strategySummaryUserOptions = (viewType: IOViewName) => ({
		...this.baseOutputUserOptions(viewType),
		...this.tabularUserOptions(viewType),
		collapsedAssetGroupByLevel: [[], []],
	})

	directionalConstraintUserOptions = (viewType: IOViewName) => ({
		...this.baseOutputUserOptions(viewType),
		collapsedAssetGroupByLevel: [[], []]
	})

	evaluationComparisonUserOptions = (viewType: IOViewName) => ({
		...this.baseOutputUserOptions(viewType),
		...this.tabularUserOptions(viewType),
		evaluationComparisonOptions: {
			evaluation1: null,
			evaluation2: null,
			showTabular: true,
			showAllocationChart: true,
			showAllocationDiffChart: true,
			allocationChartAxisMaximum: ChartAxisMaximumType.Dynamic,
			allocationDiffChartAxisMaximum: ChartAxisMaximumType.Dynamic,
			showScenarioDominance: true,
			showStatisticDominance: true
		}
	})

	assetTableUserOptions = (viewType: IOViewName) => ({
		hiddenSections: [],
		showGroups: true,
	})

	assetClassesReturnsChartOptions = (viewType: IOViewName) => ({
		...this.charting.defaultUserOptions(viewType),
		annualizedReturns: true,
		adjustmentReturns: true
	})

	assetClassesReturnsTableOptions = (viewType: IOViewName) => ({
		showEfficientFrontier: true,
		enabledAssetGroupLevels:[true, true, true],
		collapsedAssetGroupByLevel: [[], []]
	})


	defaultUserOptions = (viewType: IOViewName) => {
		switch(viewType) {
			case "pathWiseDominance":
			case "statisticalDominance":
				return this.dominanceUserOptions(viewType);
			case "strategySummary" :
				return this.strategySummaryUserOptions(viewType);
			case "directionalConstraint":
				return this.directionalConstraintUserOptions(viewType);
			case "evaluationComparison":
				return this.evaluationComparisonUserOptions(viewType);
			case "assetClasses" :
				return this.assetTableUserOptions(viewType);
			case "assetClassesReturnsChart":
				return this.assetClassesReturnsChartOptions(viewType);
			case "assetClassesReturnsTable":
				return this.assetClassesReturnsTableOptions(viewType);
			default:
				return this.views[viewType].isInput ? this.inputUserOptions(viewType) : this.charting.defaultUserOptions(viewType);
		}
	}

	getPageURLForID = (id) => `${this.browserUrl}/${id}`;

	get browserUrl() { return routing.urls.ioBrowser }

	navigateToBrowser = () => routing.push(this.browserUrl)

	@observable loading              = false;

	get apiRoute() {
		return `${julia.url}/v1/investment-optimization-runs`;
	}

	get juliaRoute() {
		return `${julia.url}/v1/investment-optimization-runs`;
	}

	get clientRoute() {
		return routing.urls.ioBrowser;
	}

	@computed get isActivePage() { return routing.isActive(routing.urls.ioBrowser)}

	@action loadDescriptor = async (id: IOGuid, useStoreResult = true): Promise<IO> => {
		var iOResult = await omdb.findSingle<JuliaIO>('InvestmentOptimization', id);

		if (!iOResult) {
			throw new Error(`Unable to locate IO result with id: '${id}'`);
		}

		// Note that the constructor will save to store if needed or merge with existing.
		const result = new IO(iOResult);

		return useStoreResult ? this.ios.get(id) : result;
	}

	get views() : IOViews {
		return {
			status:      {
				name: "status",
				label: "Lambda Status",
				height: .2,
				isInput: false,
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.chart}`
				}
			},
			efficientFrontier:   {
				name: "efficientFrontier",
				label: "Risk Reward Efficient Frontier",
				height: .5,
				isInput: false,
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.chart}`
				}
			},
			assetAllocation:      {
				name: "assetAllocation",
				label: "Asset Allocation",
				height: .3,
				isInput: false,
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.chart}`
				}
			},
			ioBox:                {
				name: "ioBox",
				label: "Distribution of Outcomes",
				height: .3,
				isInput: false,
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.chart}`
				}
			},
			/*cdf:                  {
				name: "cdf",
				label: "CDF"
			}
			,
			pdf:                  {
				name: "pdf",
				label: "PDF"
			}
			,
			beeswarm:             {
				name: "beeswarm",
				label: "Beeswarm"
			},*/
			pathWiseDominance:    {
				name: "pathWiseDominance",
				label: "Scenario Dominance",
				isInput: false,
				exportPDF: {
					targetSelector: `.${dominanceViewCSS.root}`,
					customFonts: ['LucidaGrande']
				}
			},
			statisticalDominance: {
				name: "statisticalDominance",
				label: "Statistical Dominance",
				isInput: false,
				exportPDF: {
					targetSelector: `.${dominanceViewCSS.root}`,
					customFonts: ['LucidaGrande']
				}
			},
			evaluationComparison: {
				name: "evaluationComparison",
				label: "Evaluation Comparison",
				isInput: false,
				exportPDF: {
					targetSelector: `.${evaluationComparisonViewCSS.main}`,
					customFonts: ['LucidaGrande']
				}
			},
			assetClassesReturnsChart: {
				name: "assetClassesReturnsChart",
				label: "Asset Class Returns Scatter",
				height: .5,
				isInput: false,
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.chart}`
				}
			},
			strategySummary: {
				name: "strategySummary",
				label: "Strategy Summary Table",
				isInput: false,
				exportPDF: {
					targetSelector: `.${strategySummaryViewCSS.root}`,
					customFonts: ['LucidaGrande']
				}
			},
			directionalConstraint: {
				name: "directionalConstraint",
				label: "Constraint Table",
				isInput: false,
				exportPDF: {
					targetSelector: `.${directionalConstraintViewCSS.root}`,
					customFonts: ['LucidaGrande']
				}
			},
			assetClassesReturnsTable: {
				name: "assetClassesReturnsTable",
				label: "Asset Class Returns Table",
				isInput: false,
				exportPDF: {
					targetSelector: `.${assetClassesReturnsTableViewCSS.root}`
				}
			},
			optimizationTarget: {
				name: "optimizationTarget",
				label: "Optimization Target",
				isInput: true
			},
			dataSources: {
				name: "dataSources",
				label: "Data Sources",
				isInput: true
			},
			efficientFrontierSampling: {
				name: "efficientFrontierSampling",
				label: "Efficient Frontier Sampling",
				isInput: true
			},
			nonAssetFlowsAndValues: {
				name: "nonAssetFlowsAndValues",
				label: "Non-Investment Cash Flows",
				isInput: true
			},
			interestRates: {
				name: "interestRates",
				label: "Interest Rates",
				isInput: true
			},
			assetValuesAndTrading: {
				name: "assetValuesAndTrading",
				label: "Assets and Trading",
				isInput: true
			},
			taxes: {
				name: "taxes",
				label: "Taxes",
				isInput: true
			},
			surplusManagement: {
				name: "surplusManagement",
				label: "Surplus Management",
				isInput: true
			},
			assetClasses: {
				name: "assetClasses",
				label: "Asset Class",
				isInput: true
			},
			riskBasedCapital: {
				name: "riskBasedCapital",
				label: "Risk Based Capital",
				isInput: true
			},
			interestMaintenanceReserve: {
				name: "interestMaintenanceReserve",
				label: "Interest Maintenance Reserve",
				isInput: true
			},
			accounting: {
				name: "accounting",
				label: "Accounting",
				isInput: true
			},
			optimizationControls: {
				name: "optimizationControls",
				label: "Optimization Controls",
				isInput: true
			},
			optimizationConstraints: {
				name: "optimizationConstraints",
				label: "Optimization Constraints",
				isInput: true
			},
			optimizationResources: {
				name: "optimizationResources",
				label: "Optimization Resources",
				isInput: true
			}
		}
	}

	createNewIOWithSimulation = async (name?: string, simulationId?:string, tagValues?: string[]) => {
		const data = {data: {name: name, assetReturnsSimulation: simulationId, userTagValues: tagValues}};
		return this.createNewIO(data);
	}

	createNewIOWithSpecFile = async (name?: string, file?: string, replacedSimulationIds?: string[], tagValues?: string[]) => {
		const data = {data: {name: name, importFile: (file || null), userTagValues: tagValues}};
		if (replacedSimulationIds && replacedSimulationIds.length > 0) {
			data['replacedSimulations'] = replacedSimulationIds;
		}
		return this.createNewIO(data);
	}

	private createNewIO = async (data) => {
		//TODO: Remove pending session logic and rely on IOs ability to extend session to show the appropriate loader when extend session is updated to work on non-optimized IOs

		// If IO sessions is unavailable the back-end returns a 202 and we attempt a retry until there is a 200.
		// While IO is being created, lets transition to the new page and show a loader until session is ready.
		try {
			site.busy = true;
			let pageURL = null;
			_.set(data, ["data", "name"], _.get(data, ["data", "name"]) || "Untitled")
			_.set(data, ["data", "dfioPath"], "test")
			// await xhr.putUntilSuccess<{ ioId: string, connectionId: string }>(this.apiRoute + "?mock=true", {data: {name: "Untitled", "dfioPath": "test"}},
			let result = await xhr.putUntilSuccess<{ ioId: string, connectionId: string }>(this.apiRoute, data,
				"io_id",
				(response, willRetry) => {
					const id = willRetry ? response as string : response.ioId;
					if (willRetry && this.pendingSessions.indexOf(id) == -1) {
						this.pendingSessions.push(id);
					}
					pageURL = this.getPageURLForID(id);
					routing.push(pageURL);
				},
				() => pageURL && pageURL !== routing.pathname
				);

			// Result is null if user navigates away while loading
			if (result == null)
				return;

			let pendingIndex = this.pendingSessions.indexOf(result.ioId);

			if (pendingIndex != -1)
				this.pendingSessions.splice(pendingIndex, 1);

			return result.ioId;
		} catch (error) {
			if (error.status === 406) {
				const { body } = error.response;
				return body;
			}
			throw error;
		}
		finally {
			site.busy = false;
		}
	}

	@action reset = () => {
		this.ios.clear();
	}
}

export const ioStore = new IOStore();
