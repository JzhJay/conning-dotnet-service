export type {GroupMember, PivotMetadata, PivotData, PivotStateID} from '../queryResult/models/pivot';
export type {QueryViewName} from 'stores/query';
import type {IApplicationIcon} from 'stores/site';

export type ChartType = "box" | "cone" | "cdf" |"scatter" |"pdf" | "histogram" | "bar" | "line" | "beeswarm" | "efficientFrontier" | string;

export interface SystemPreferences {
	animations ?: boolean;
}

export type ChartDescriptors = {[chartType: string]: ChartDescriptor};

export interface ChartDescriptor {
	name: string;
	chartType: ChartType;
	icon?: IApplicationIcon;
}


export interface FontSize {
	fontSizes: number[],
	value: number,
	increase();
	decrease();
	update(value);
	show: boolean;
	//get current(): number;
}

export interface Statistics {
	mean:number;
	standardDeviation:number;
	skewness:number;
	kurtosis:number;
}

export interface Titles {
	chartTitle: string;
	chartSubtitle: string;
	xAxisTitle: string;
	yAxisTitle: string;
}

export interface Moments{
	mean: number;
	standardDeviation: number;
	skewness?: number;
	kurtosis?: number;
}

export interface PercentileData{
	percentile: number;
	densityFraction: number;
	CTEGreater: number;
	CTELess: number;
	xValue: number;
}

export interface Series{
	name: string;
	columnCoordinates?: number[];
}

export interface PdfSeries extends Series{
	moments: Moments;
	data: [{x:number, y:number}];
	percentiles: PercentileData[];
}

export interface BeeswarmSeries extends Series{
	moments: Moments;
	data: [{x:number, y:number}];
	percentiles: PercentileData[];
}

export interface CdfSeries extends Series{
	xValues: number[];
	xIndices: number[];
	uncompressedLength: number;
	moments: Moments;
}

export interface PercentileSeries extends Series{
	data: number[];
	moments: Moments;
}

export interface HistogramSeries extends Series{
	data: number[];
	moments: Moments;
}

export interface LineSeries extends Series {
	rowCoordinates: number[];
	name: string;
	data: any;
	color?: any;
	regression?: boolean;
	regressionSettings?: any;
}
export interface HistogramRange{
	length:number;
	step:number;
	start:number;
}

export interface Granularity {
	range: HistogramRange;
	series: [HistogramSeries];
}

export interface JuliaChartData{
	titles: Titles;
	credits: string;
}

export interface PdfData extends JuliaChartData{
	series: [PdfSeries]
}

export interface CdfData extends JuliaChartData{
	series: [CdfSeries]
}

export interface BeeswarmData extends JuliaChartData{
	x_min: number
	x_max: number
	radius: number
	rowCoordinates: Array<number[]>
	series: [BeeswarmSeries]
}

export interface PercentileChartData extends JuliaChartData{
	series: [PercentileSeries]
	params: {percentiles:number[]}
	underlyingData: Array<number[]>
	underlyingDataPermutation: number[]
	rowCoordinates: Array<number[]>
}

export interface HistogramData extends JuliaChartData{
	granularity: {coarse:Granularity, medium:Granularity, fine:Granularity}
}
