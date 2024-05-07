//import {IMoments} from "./highchartsApi";
//import {ISeries} from "./highchartsApi"; - Produces a bunch of errors, why?

interface HighchartsStatic {
    // Added by NVS to deal with issues in highchartsExtender
    Pointer: any;
    Point: any;
    Legend: any;
    Tooltip:any;
    Series: any;
    Axis: any;
    labelGroup: any;
	SVGRenderer: any;

    wrap(prototype: any, name: string, Function): any;
    stop(el:HTMLElement): void;
    fireEvent(el:HTMLElement, type:string, Function);

}

interface HighchartsChartObject {
    selections: any;
    extenderObj: any;

    update(options:HighchartsOptions, redraw?:boolean, oneTone?:boolean);
    hoverPoints?: Array<any>;
    forcedHovers?: Array<any>;
    tooltip?: any;
    inverted?: boolean;
    hoverPoint?: any;
    isInsidePlot?: (x: number, y: number) => boolean;
    plotLeft?: number;
    plotTop?: number;
	plotHeight?: number;
	plotWidth?: number;
    userOptions?: any;
    legend?: any;
	chartWidth?: number;
	chartHeight?: number;
	hasLoaded: boolean;
	getSVGForExport(options?: HighchartsExportingOptions, chartOptions?: Partial<Options>): string;
}

interface HighchartsPointer {
    normalize?: (e) => void;
}

interface HighchartsChartOptions {
    customTooltips?: any;
    boostThreshold?: number;
	plotOptions?: HighchartsPlotOptions;
}

interface HighchartsAxisObject {
    min?: number;
    max?: number;
    dataMin?: number;
    dataMax?: number;
    isXAxis?: boolean;
    horiz?: boolean;
    tickInterval?: number;
    reversed?: boolean;
    chart: HighchartsChartObject;
    userOptions?: HighchartsAxisOptions;
	hideCrosshair?: () => {};
	width?: number;
	axisGroup?: any;
	categories?: string;
}

interface HighchartsAxisOptions {

    connInitialMin?: number;
    connInitialMax?: number;

    visible?: boolean;
}

interface HighchartsSeriesObject {
    points?: any;
    connFakeHoverSeriesIndex?: any;
	connDataLookup?: Array<any>;
    color?: any;
}

interface HighchartsSeriesChart {
    columnCoordinates?: string[];
    stack?: string;
	boostThreshold?: number;
}

interface HighchartsSeriesOptions {
    isRegressionLine?: boolean
    connFakeHoverSeriesIndex?: number;
	connForceShowInLegend?: boolean;
    center?: Array<number>;
	size?: number;
	fillColor?: string;
	pointRange?: number;
	innerSize?: number;
}

interface HighchartsDataPoint {
	connAssetAllocation?: {name:string, color:string};
	connIsAdditionalPoint?: boolean;

	low?: number;
	high?: number;
}

interface HighchartsIndividualSeriesOptions {
	columnCoordinates?: [String];
	connIsAdditionalPointSeries?: boolean;
	connIsGroupedAdditionalPointLineSeries?: boolean;
	connIsAdditionalPointLegend?: boolean;
	connDataLookup?: Array<any>;
	showInLegend?: boolean;
	color?: string;
}

interface HighchartsOptions {
    percentilesData?: any;
    statistics?: any;// IMoments,
    axisNames?: string[],
	originalSeriesData?: any;//CdfSeries[],
}

interface HighchartsExportingOptions {
    allowHTML?: boolean;
    buttons?: ExportingButtonsOptions;
    chartOptions?: Options;
    enabled?: boolean;
    error?: Exporting.ErrorCallbackFunction;
    fallbackToExportServer?: boolean;
    filename?: string;
    formAttributes?: HTMLAttributes;
    libURL?: string;
    menuItemDefinitions?: Record<string, Exporting.MenuObject>;
    printMaxWidth?: number;
    scale?: number;
    sourceHeight?: number;
    sourceWidth?: number;
    type?: string;
    url?: string;
    useMultiLevelHeaders?: boolean;
    useRowspanHeaders?: boolean;
    width?: number;
}
