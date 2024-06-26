import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {site} from 'stores/site';
import type {ChartUserOptions, ChartType} from 'stores';
import {
	routing,
	omdb,
	ClimateRiskAnalysis,
	ClimateRiskAnalysisGuid, JuliaClimateRiskAnalysis, GridlinesType, ChartAxisMaximumType, ClimateRiskAnalysisViewName, Simulation
} from 'stores';
import {observable, action, computed, makeObservable} from 'mobx';
import {ClimateRiskAnalysisViews} from './models';

import * as hightchartComponentCSS from 'components/system/highcharts/highchartsComponent.css';
import * as distributionsAtHorizonCSS from 'components/system/ClimateRiskAnalysis/internal/outputs/DistributionsAtHorizon.css';
import * as marketValueStatisticsCSS from 'components/system/ClimateRiskAnalysis/internal/outputs/MarketValueStatistics.css';
import * as layoutCss from 'components/system/inputSpecification/InputSpecificationComponent.css';

export class ClimateRiskAnalysisStore {
	constructor() {
        makeObservable(this);
    }

	get relatedSimulationFilter(){ return {status: ["Complete"], sourceType: [Simulation.SOURCE_TYPE.REPOSITORY, Simulation.SOURCE_TYPE.CLASSIC, Simulation.SOURCE_TYPE.FIRM]}};

	@observable climateRiskAnalyses = observable.map<string, ClimateRiskAnalysis>({}, {deep: false});
	@observable pendingSessions = [];

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
			gridLine:               chartType === "distributionsAtHorizon" ? GridlinesType.None : GridlinesType.Horizontal,
			showMeanValues:         true,
			verticalAxisDirection:  'top',
			horizontalAxisDirection: 'left',
			plotWidth:              0,
			plotHeight:             0,
			highchartsOptions:      null,
			viewCaption:            chartType === "craBox" || chartType === "throughTimeStatistics" ? `${chartType === "craBox" ? "Box" : "Cone"} plot showing the simulated distribution of market value through time for the base (blue) and stressed (green) simulations.` : "",
			...this.baseOutputUserOptions(),
		} as ChartUserOptions)
	}

	descriptionUserOptions = () => ({
		baseCurrency: "USD"
	})

	baseOutputUserOptions = () => ({
		horizon: 1
	})

	distributionsAtHorizonOptions = (viewType) => ({
		viewCount: 2,
		views: [this.charting.defaultUserOptions(viewType), this.charting.defaultUserOptions(viewType)],
		viewCaption: "Probability Distribution Functions (PDFs) of portfolio market value at different horizons for the base (blue) and stressed (green) simulations."
	})

	financialDamageAndVolatilityShockOptions = () => ({
		viewType: null,
		views: {},
		viewCaption: "Financial damage function (left, blue), cumulative stress (left, green) and time varying volatility stress factors (right)"
	})


	marketValueStatisticsOptions = () => ({
		...this.baseOutputUserOptions(),
		showMean                  : true,
		showPercentiles           : true,
		showStandardDeviation     : true,
		percentiles:            [0, 1, 5, 25, 50],
		rowsOrder:              ['showMean', 'showStandardDeviation', 'showPercentiles'],
		viewCaption:            "Market Value statistics and risk attribution at three different time horizons. Excess climate risk is defined as the difference between the statistic show in the base scenario set and the scenario set stressed conditional on the given climate scenario and gives an indication of how much risk might increase if the scenario were to play out in reality."
	})


	get browserUrl() { return routing.urls.climateRiskAnalysisBrowser }

	navigateToBrowser = () => routing.push(this.browserUrl)

	@observable loading              = false;

	get apiRoute() {
		return `${julia.url}/v1/climate-risk-analyses`;
	}

	get juliaRoute() {
		return `${julia.url}/v1/climate-risk-analyses`;
	}

	get clientRoute() {
		return routing.urls.climateRiskAnalysisBrowser;
	}

	@computed get isActivePage() { return routing.isActive(routing.urls.climateRiskAnalysisBrowser)}

	@action loadDescriptor = async (id: ClimateRiskAnalysisGuid): Promise<ClimateRiskAnalysis> => {
		let climateRiskAnalysisResult = await omdb.findSingle<JuliaClimateRiskAnalysis>('ClimateRiskAnalysis', id);

		if (!climateRiskAnalysisResult) {
			throw new Error(`Unable to locate Climate Risk Analysis result with id: '${id}'`);
		}

		// Note that the constructor will save to store if needed or merge with existing.
		new ClimateRiskAnalysis(climateRiskAnalysisResult);

		return this.climateRiskAnalyses.get(id);
	}

	get views() : ClimateRiskAnalysisViews {
		return {
			simulation: {
				name: "simulation",
				label: "Simulation",
				isInput: true
			},
			assetClass: {
				name: "assetClass",
				label: "Asset Classes",
				isInput: true
			},
			riskDefinition: {
				name: "riskDefinition",
				label: "Transformations",
				isInput: true
			},
			description: {
				name: "description",
				label: "Description",
				isInput: true,
				exportPDF: {
					targetSelector: `.${layoutCss.root}`,
					customFonts: ['OpenSans']
				}
			},
			distributionsAtHorizon:      {
				name: "distributionsAtHorizon",
				label: "Market Value Distribution At Horizon",
				height: .3,
				isInput: false,
				viewType: 'figure',
				exportPDF: {
					targetSelector: `.${distributionsAtHorizonCSS.root}`,
					customFonts: ['OpenSans']
				}
			},
			throughTimeStatistics:      {
				name: "throughTimeStatistics",
				label: "Market Value Through Time Statistics (Cone)",
				height: .3,
				isInput: false,
				viewType: 'figure',
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.highchartsComponent}`,
					customFonts: ['OpenSans']
				}
			},
			craBox:      {
				name: "craBox",
				label: "Market Value Through Time Statistics (Box)",
				height: .3,
				isInput: false,
				viewType: 'figure',
				exportPDF: {
					targetSelector: `.${hightchartComponentCSS.highchartsComponent}`,
					customFonts: ['OpenSans']
				}
			},
			financialDamageAndVolatilityShock: {
				name: "financialDamageAndVolatilityShock",
				label: "Financial Damage and Volatility Shock",
				height: .3,
				isInput: false,
				viewType: 'figure',
				exportPDF: {
					targetSelector: `.${distributionsAtHorizonCSS.root}`,
					customFonts: ['OpenSans']
				}
			},
			marketValueStatistics: {
				name: "marketValueStatistics",
				label: "Market Value Statistics",
				isInput: false,
				viewType: 'table',
				exportPDF: {
					targetSelector: `.${marketValueStatisticsCSS.root}`,
					customFonts: ['OpenSans', 'LucidaGrande', 'Lato'],
					ignoreCSS: [marketValueStatisticsCSS.toolbar]
				}
			},
		}
	}

	createNewClimateRiskAnalysis = async ( name?: string, simulationId?: string, tagValues?: string[]) => {
		// If ClimateRiskAnalysis sessions is unavailable the back-end returns a 202 and we attempt a retry until there is a 200.
		// While ClimateRiskAnalysis is being created, lets transition to the new page and show a loader until session is ready.
		try {
			site.busy = true;
			let result = await xhr.postUntilSuccess<{ id: string }>(this.apiRoute, {name: (name || "Untitled"), simulation: simulationId, userTagValues: tagValues},
				"id",
				(response, willRetry) => {
					const id = willRetry ? response as string : response.id;
					if (willRetry && this.pendingSessions.indexOf(id) == -1) {
						this.pendingSessions.push(id);
					}
					routing.push(`${this.browserUrl}/${id}`);
				});

			let pendingIndex = this.pendingSessions.indexOf(result.id);

			if (pendingIndex != -1)
				this.pendingSessions.splice(pendingIndex, 1);

			return result.id;
		}
		finally {
			site.busy = false;
		}
	}

	@action reset = () => {
		this.climateRiskAnalyses.clear();
	}

	defaultUserOptions = (viewType: ClimateRiskAnalysisViewName) => {
		switch(viewType) {
			case "marketValueStatistics":
				return this.marketValueStatisticsOptions();
			case "distributionsAtHorizon":
				return this.distributionsAtHorizonOptions(viewType);
			case "financialDamageAndVolatilityShock":
				return this.financialDamageAndVolatilityShockOptions();
			case "description":
				return this.descriptionUserOptions();
			default:
				return this.views[viewType].isInput ? {} : this.charting.defaultUserOptions(viewType);
		}
	}
}

export const climateRiskAnalysisStore = new ClimateRiskAnalysisStore();
