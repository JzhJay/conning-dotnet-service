import type {InputSpecificationUserOptions} from '../../components/system/inputSpecification/models';
import type {ChartUserOptions} from '../charting';
import {ChartAxisMaximumType} from '../charting';
import type {ConningUser} from '../graphQL';
import type {ExportPdfOptions } from 'ui/src/stores/book/model';

export type IOGuid = string;

export interface JuliaIO {
	_id: string;
	name: string;
	archived?: boolean;
	status?: string;

	createdBy: ConningUser;
	modifiedBy: ConningUser;

	comments?: string;
	locked?: boolean;
}

interface EvaluationSummary {
	risk: number;
	reward: number;
	lambda: number;
	previousSameLambda: 0;
	source: string;
	evaluationIndex: number;
}

interface EvaluationDetail {
	percentileValues: number[];
	mean: number;
	allocations: number[];
	evaluationIndex: number;
	duration?: number;
}

export interface EvaluationDifference {
	statisticalDominanceSvg: string;
	scenarioDominanceSvg: string;
	statisticalDominanceFraction: number;
	subtrahend: number;
	minuend: number;
	scenarioDominanceFraction: number;
}

export interface Lambda {
	lambda: number;
	status: string;
	numberEvaluations: number;
	numberIterations: number;
	bestEvaluationIndex?: number;
	reasonForStopping?: string;
	previousIterationIndices?: number[];
}

export interface AdditionalPoints {
	name: string;
	marker: string;
	evaluationIndex: number;
	color: string;
	allocations: number[],
}

export interface JuliaIOState {
	evaluationSummaries: EvaluationSummary[];
	evaluationDetails: EvaluationDetail[];
	frontierIndices: number[];
	lambdaState: Lambda[];
	evaluationDifferences: EvaluationDifference[];
	//additionalPoints?: number[];
	connectionId?: string;
}

export interface OptimizationTarget {
	scope: "assetValue" | "economicValue" | "presentValueOfDistributableEarnings" | "presentValueOfProfitsAfterRiskCapital" | "bookValue" | "bookReturn";
	accountingStandard: string;
	rewardMeasure: {
		statistic: string;
		area: "over" | "under";
		percentile: number;
	},
	riskMeasure: RiskMeasure
}

export interface RiskMeasure {
	statistic: string;
	area: "over" | "under";
	percentile: number;
	function: "standardDeviation" | "coefficientOfVariation" | "percentile" | "semiStandardDeviation" | "conditionalStandardDeviation";
	thresholdType: "average" | "percentile" | "fixed";
	fixedThreshold: number;
}

export interface OptimizationControls {
	maximumNumberOfIterations: number;
	effectiveMinimumSurplus:  "immediately" | "minimumSurplusReached" | "targetSurplusReached";
	estimatedRBCBasis: "startOfPeriod" | "afterPriceReturns" | "afterTurnover" | "afterMigration" | "endOfPeriod";
	surplusRBC: {minimum: number, target: number, maximum: number};
	optimizationTarget: OptimizationTarget
	randomAllocations: {perAssetClass: number, total: number}
}

export interface OutputControls {
	percentiles?: number[];
	additionalControls?: string;
	ctes?: Array<{area: string, percentile: number}>;
}


export type IOViewName = "status" | "efficientFrontier" | "assetAllocation" | "ioBox" | "cdf" | "pdf" | "beeswarm" | "pathWiseDominance" | "statisticalDominance" | "strategySummary" |
	"accounting" | "assetClasses" | "surplusManagement" | "optimizationTarget" | "dataSources" | "optimizationControls" | "optimizationConstraints" | "optimizationResources" | "efficientFrontierSampling" |
	"nonAssetFlowsAndValues" | "interestRates" | "assetValuesAndTrading" | "taxes" | "riskBasedCapital" | "interestMaintenanceReserve" | "evaluationComparison" | "directionalConstraint" | "assetClassesReturnsChart" | "assetClassesReturnsTable";

export type IOViewTemplate = {
	name: IOViewName,
	label: string,
	height?: number,
	isInput?: boolean
	exportPDF?: ExportPdfOptions
}

export type IOViews = {[name:string]:IOViewTemplate}

export enum IOContextMenuAction {
	AddEfficientPoint,
	RemoveEfficientPoint,
	AddAdditionalPoint,
	RemoveAddtitionalPoint
}

export type IOInputControlName = "effectiveMinimumSurplus" | "estimatedRBCBasis";

export type AdditionalAllocationGroup = {
	name: string;
	group: string;
	color: string;
};

export interface OptimizationInputs {
	optimizationTarget: OptimizationTarget,
	additionalAllocations: AdditionalAllocationGroup[]
};

export interface ValidationMessage {
	messageText: string;
	messageType: string;
	paths: string[][];
	titles?: string[][];
}

export interface ChangeMessage {
	messageType: string;
	sourcePath: string[];
	targetPath: string[];
	targetValue: any;
}

export type IOViewUserOptions = ChartUserOptions | DominanceUserOptions | StrategySummaryUserOptions | EvaluationComparisonUserOptions | AssetTableUserOptions | InputSpecificationUserOptions;

export interface BaseOutputUserOptions {
	shouldInheritData?: boolean
	showEfficientFrontier?: boolean
	showAdditionalPoints?: boolean
	showGroupAdditionalPoints?: boolean
	showLambdaPoints?: boolean;
}

export interface TabularUserOptions extends BaseOutputUserOptions {
	showDuration?: boolean;
	showAssetClass?: boolean;
	showTotal?: boolean;
	showMetrics?: boolean;
	showMean?: boolean;
	showMin?: boolean;
	showMax?: boolean;
	showPercentiles?: boolean;
	showCtes?: boolean;
	showStandardDeviation?: boolean;
	enabledAssetGroupLevels?: boolean[];
	percentiles?: number[];
	ctes?: Array<{area: string, percentile: number}>;
	rowsOrder?: string[];
}

export interface DominanceUserOptions extends EvaluationComparisonUserOptions {
	showDominanceFractions: false;
	zoomToFit?: boolean;
}

export interface StrategySummaryUserOptions extends TabularUserOptions {
	assetGroupLevel?:               number;
	collapsedAssetGroupByLevel?:    Array<string[]>;
}

export interface DirectionalConstraintUserOptions extends BaseOutputUserOptions {
	collapsedAssetGroupByLevel?:    Array<string[]>;
}

export interface EvaluationComparisonUserOptions extends TabularUserOptions {
	evaluationComparisonOptions?: {//TODO: remove top level
		evaluation1?: { evaluationNumber: number, name?: string }, // name is mainly for comparing lambda points
		evaluation2?: { evaluationNumber: number, name?: string },
		showTabular?: boolean;
		showAllocationChart?: boolean;
		showAllocationDiffChart?: boolean;
		allocationChartAxisMaximum?: ChartAxisMaximumType;
		allocationDiffChartAxisMaximum?: ChartAxisMaximumType;
		showScenarioDominance?: boolean;
		showStatisticDominance?: boolean;
	}
}

export interface AssetTableUserOptions {
	hiddenSections?: string[];
	showGroups?: boolean;
}