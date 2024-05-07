import type {ChartUserOptions} from '../charting';
import type {ConningUser} from '../graphQL';
import type {IOViewName} from '../io';
import type {ExportPdfOptions} from 'ui/src/stores/book/model';

export type ClimateRiskAnalysisGuid = string;

export interface JuliaClimateRiskAnalysis {
	_id: string;
	name: string;
	archived?: boolean;
	status?: string;

	createdBy: ConningUser;
	modifiedBy: ConningUser;

	comments?: string;
	locked?: boolean;
}

export type ClimateRiskAnalysisViewUserOptions = ChartUserOptions | MarketValueStatisticsOptions | DistributionsAtHorizonOptions | FinancialDamageAndVolatilityShockOptions | DescriptionUserOptions;

export interface CraBaseUserOptions {
	horizon?: number;
	viewCaption?: string;
}

export interface DescriptionUserOptions {
	baseCurrency?: string;
}

export interface MarketValueStatisticsOptions extends CraBaseUserOptions {
	showMean?: boolean;
	showPercentiles?: boolean;
	showStandardDeviation?: boolean;
	percentiles?: number[];
	rowsOrder?: string[];
}

export interface DistributionsAtHorizonOptions {
	viewCount: number;
	views: ChartUserOptions[];
	viewCaption?: string;
}

export interface FinancialDamageAndVolatilityShockOptions {
	viewType: number;
	views: {[viewType:string]: ChartUserOptions};
	viewCaption?: string;
}

export interface ClimateRiskAnalysisInputState {
	assetClasses: AssetClass[];
	title: string;
	description: string;
	simulationObjectId: string;
	startingMarketValue: number;
	stressMetadata: Stress[];
	transformationMetadata: Transformation[];
	transformationSets: TransformationSet[];
}

export interface AssetClass {
	name: string;
	weight: number;
	startingMarketValue: number;
	damage: {[stressId:string]: number}
}

export interface Stress {
	stressId: string;
	name: string;
	transformationId: string;
}

export interface Transformation {
	transformationId: string;
	name: string;
}

export interface TransformationSet {
	[transactionId:string]: {damageFunction: number, volatilityFactor: number}
}

export interface DistributionsAtHorizonOutput {
	pdfs: Array<{basecase: PDFPoints, adjusted: PDFPoints}>;
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
}

export type PDFPoints = Array<{x: number, y: number}>

export interface MarketValueStatisticsOutput {
	columnNames: Array<{type: string, value: string}>
	rowNames: Array<{type: string, value: string}>
	tablesByTime: Array<Array<Array<number>>>; // [time/horizon][row][col]
}

export interface ThroughTimeStatisticsOutput {
	basecase: {[statistic:string]: number[]};
	adjusted: {[statistic:string]: number[]};
}

export interface FinancialDamageAndVolatilityShockOutput {
	stressId: {
		type: string;
		value: string;
	};
	returnDeltas: number[];
	volatilityFactors: number[];
}

interface ApiView {
	view: IOViewName;
	title: string;
	controls: string;
	index?: number;
	newIndex?: number;
}

interface ApiPage {
	title: string;
	index?: number;
	newIndex?: number;
	views: ApiView[];
	additionalControls: string;
}

export type ClimateRiskAnalysisViewName = "simulation" | "assetClass" | "riskDefinition" | "description" | "marketValueStatistics" | "distributionsAtHorizon" | "throughTimeStatistics" | "craBox" | "financialDamageAndVolatilityShock";

export type ClimateRiskAnalysisViewTemplate = {
	name: ClimateRiskAnalysisViewName,
	label: string,
	height?: number,
	isInput?: boolean,
	viewType?: 'table' | 'figure',
	exportPDF?: ExportPdfOptions,
}
export type ClimateRiskAnalysisViews = {[name:string]:ClimateRiskAnalysisViewTemplate}
