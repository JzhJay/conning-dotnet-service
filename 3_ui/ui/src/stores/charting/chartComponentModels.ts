import {observable, ObservableMap} from 'mobx';
import {HighchartsHelper, IHighchartsHelper} from './ChartingResultHelper';
import {PercentileData, CdfSeries} from './chartJuliaModels'

export interface IChartingResult {
	id: string;
	highcharts?: IHighchartsHelper;
	userOptions?: ChartUserOptions;
	getViewUserOptions?: (view:string) => ChartUserOptions;
	bootstrapEnabled?: boolean;
}

export interface MomentsBox {
	moment?: number;
	x?: number;
	y?: number;
	fontSize?:number
}

export interface PointStyle {
	color?: string;
	opacity?: number;
	radius?: number;
	symbol?:string;
}

export enum GridlinesType {None, Horizontal, Vertical, Both}
export enum ChartTargetType {ChartTitle, ChartSubtitle, AxisTitle, AxisLabels, ChartLegend, StatisticsBox}


export enum StatisticsType {None, MeanOnly, MeanAnd1SD, MeanAnd2SD, MeanAnd3SD}

export enum StepPattern { Horizontal, Vertical }

export enum AxisAlignmentType {Left, Right, Top, Bottom}

export enum SmoothingType {NegOne, NegTwo, Zero, One, Two}

export type VerticalAxisDirection = 'top' | 'bottom';

export type HorizontalAxisDirection = 'left' | 'right';

export interface ChartAxisDisplayUnit {
	opposite: boolean,
	scale: number,
	unit: string,
	title?: string,
	showUnit?: boolean
}

export interface ChartUserOptions {
	markerSize?: number;
	lineWidth?: number;
	fontSize?: number;
	fontSizes?: number[];
	showFontSizes?: boolean;
	panOrZoom?: 'pan' | 'zoom';


	gridLine?:GridlinesType;
	//paths?:IPaths;
	isInverted?:boolean;

	percentiles?: number[];
	showMeanValues?: boolean;
	degreeOfSmoothingIndex?: number;
	showLines?: boolean;
	showMarkers?: boolean;
	columnMode?: string;
	colorSet?: Array<any>;
	moments?: MomentsBox;
	statistics?: StatisticsType;
	areaOpacity?: number;
	stepPattern?: StepPattern;
	paths?: number[];
	verticalAxisDirection?: VerticalAxisDirection;
	horizontalAxisDirection?: HorizontalAxisDirection;
	showRegressionLine?: boolean;
	dataLabels?: boolean;

	// IO properties
	shouldInheritData?: boolean
	showEfficientFrontier?: boolean
	showAdditionalPoints?: boolean
	showGroupAdditionalPoints?: boolean
	showLambdaPoints?: boolean;

	donutSize?:                     number;
	assetGroupLevel?:               number;
	showFullFrontier?:              boolean;
	showFrontierLine?:				boolean;
	showIterationLines?:			boolean;
	showIterationPoints?:			boolean;
	showDirectionPoints?:			boolean;
	showDistancePoints?:			boolean;
	showHistoricalPoints?:          boolean;
	showRandomPoints?:				boolean;
	fullFrontierPointStyle?:		PointStyle;
	iterationPointStyle?:			PointStyle;
	directionPointStyle?:			PointStyle;
	distancePointStyle?:			PointStyle;
	historicalPointStyle?:			PointStyle;
	randomPointStyle?:				PointStyle;


	// CRA properties
	horizon?: number;
	fillOpacity?: number;
	lineOpacity?: number;
	seriesSwitch?: number;


	// Internal highcharts options
	highchartsOptions?: HighchartsOptions;

	xAxis?: {min: number, max: number, dataMin: number, dataMax:number, arranagementKey:string, displayUnits?: ChartAxisDisplayUnit[]};
	yAxis?: {min: number, max: number, dataMin: number, dataMax:number, arranagementKey:string, displayUnits?: ChartAxisDisplayUnit[]};

	// Items that don't need to be persisted
	plotWidth?: number;
	plotHeight?: number;

	viewCaption?: string;
}

export interface ChartData extends HighchartsOptions{
	//chartType: ChartType,
	//id: number;
	statistics ?: any;
	percentilesData?: PercentileData[];
	multipleGroupings?:boolean;
	individualScenarios?:any;
	names?: string[];
	rowAxisNames?: string[];
	rowNames?: Array<string[]>;
	originalSeriesData?: Array<CdfSeries>; // series data from API per series
	bootstrapped?: boolean;
};

export type ChartDataRef = {refCount:number, chartData:ChartData}
export type ChartDataMap = { [key: string]: ChartDataRef}

export interface EvaluationComparisonOptions {
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

export enum ChartAxisMaximumType { Dynamic, FixedAcross, Fixed100 }