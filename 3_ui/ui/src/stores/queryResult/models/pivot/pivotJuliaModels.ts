import {DataWindow} from 'common';
import type {QuerySave, QueryViewName, SelectOperation, QueryViewAvailability} from 'stores/query';
import type {UserId, SimulationGuid, QueryGuid} from 'stores';
import type {ChartUserOptions} from "../../../charting/chartComponentModels";

export {DataWindow}
export type {QueryViewName, SelectOperation}

export interface QueryResultDescriptor {
	ready?: boolean;

    /**
     * Total number of cells
     */
    cells: number;

    /**
     * Example:  Path, Time, Economy
     */
    axes: string[];

    periods: number;

    shape: number[];  // Scenarios, Periods, Variables - s*p*v === cells

    variables: number;

    id: QueryGuid;

    name: string; //Query result name

    /**
     * URL to the query
     */
    href: string;

    /**
     * Long description like:  "(20_000,21,4,1) 20000 scenarios, 21 years, 4 economies, Module=Economies,Projection=Core,Economic_Variable=Price_Indices,Measure=Level,Price_Index=Consumer_Prices,Component=Value,Method=Normalized,Time_Frame=Current,Frequency=Simulation,Simulation=Economy_and_Financial_4E20Y20000P"
     * Not terribly useful to us...ƒƒ
     */
    description: string;

    scenarios: number;

    default_arrangement: {
        rows: number,
        rowAxes: number[],
        columnAxes: number[],
        columns: number
    }

    /**
     * Useless - deprecated
     */
    //file: string;

    /**
     * annual, quarterly, monthly
     */
    frequency: string;

    /**
     *
     */
    short_description: string;

    createdTime?:string;
    modifiedTime?: string;

    simulation_id?: SimulationGuid;
    query: {id: string, json: QuerySave}

	createdBy?: UserId;

    availableViews?: Array<QueryViewAvailability>;
	singularAxisCoordinate?: [{axis:string, coordinate:string}];
	userOptions?: ChartUserOptions;
}

export interface SelectRangeResponse {
    operation: SelectOperation;
    availableViews: Array<QueryViewAvailability>;
    allSelected?: boolean;
    selectionUID: number;
}
export interface ReconfigurePivotResponse {
    rows: number;
    columns: number;
    availableViews: Array<QueryViewAvailability>;
    arrangementUID: string;
}

export class AxisType {
    static scenario = "Scenario"
    static time     = "Time";
    static generic  = "Generic";
}

export interface Axis {
    id: number;
    groupType: "Scenario" | "Time" | "Generic",
    groupName: { label: string, description?: string },
    groupMembers: string[] | number[] | Array<GroupMember>;
}

export interface GroupMember {
    label: string,
    description?: string
}

export interface PivotArrangement {
    rowAxes?: number[];
    columnAxes?: number[];
}

export const pivotQueryViewAvailability : QueryViewAvailability = {
	name: 'pivot',
	available: true
}

//export type QueryViewName = "Line" | "Box" | "Cone" | "CDF" | "PDF" | "Histogram" | "Correlation" | "Bootstrap" | "Sensitivity";

export interface PivotMetadata extends PivotArrangement {
    axes: Array<Axis>
    rows: number;
    columns: number;

    availableViews: Array<QueryViewAvailability>;
    formats: Array<string>;
    allSelected?: boolean;

	/**
	 *
	 */
	arrangementUID?: number;

	/**
	 *
	 */
	selectionUID?: number;
}

export interface PivotDetailCell {
    data: any;
    format: DataFormat;
    selected: boolean;
}

export interface PivotCoordinateCell {
    coordinate: number;
    anySelected: boolean;
    allSelected: boolean;
    exists: boolean;
}

export interface PivotData {
    detailCells: Array<Array<PivotDetailCell>>;
    colCoords: Array<Array<PivotCoordinateCell>>;
    rowCoords: Array<Array<PivotCoordinateCell>>;
}

export interface CompactPivotData{
	detailCells: Array<Array<string | number>>;
	colCoords: Array<Array<number>>;
	rowCoords: Array<Array<number>>;
}

export interface PivotTooltips {
    rowTooltips: Array<CoordinateTooltip>,
    columnTooltips: Array<CoordinateTooltip>
}

export interface Bootstrap {
	bootstrapOptions: BootstrapOptions;
	bootstrapStatistics: BootstrapStatistic[];
	bootstrapExtrema: BootstrapExtrema;
	bootstrapRan: boolean;
}

export interface BootstrapOptions {
	numberResamples: number;
	resampleSize: number;
	seed: number;
	statistic: number;
}

export interface BootstrapStatistic {
	label: string;
	description: string;
}

export interface BootstrapExtrema {
	maximumNumberResamples: number;
	maximumResampleSize: number;
}

export interface StatisticsOptions {
	statistic: "sum" | "count" | "mean" | "varp" | "vars" | "stdp" | "stds" | "coeffvar" | "skew" | "kurtosis" | "min" | "max" | "percentile" | "cte";
	percentiles?: number[];
	ctes?: CTEOptions[];
	enabled: boolean;
}

export interface CTEOptions {
	percentile: number
	area: string
}

export interface Sensitivity {
	columnIndex: number;
	coordinateIndices: Array<number[]>;
	shiftedMean: number;
	shiftedStandardDeviation: number;
	unshiftedMean: number;
	unshiftedStandardDeviation: number;
}

export interface CoordinateTooltip {
    begin: Array<number>;
    end: Array<number>;
}

export enum DataFormat {
    Currency,
    Return,
    Rate,
    Margin,
    Fraction,
    Factor,
    Ratio,
    Draw,
    Integer,
    Integer_Small,
    Exposure,
    Currency_PUE,
    Frequency,
    Frequency_PUE,
    Mean_Frequency,
    Price, Price_2, Price_Short,
    Years, Years_Short, Years_Squared,
    Boolean,
    Transgressions,
    Shares,
    Area,
    User_Value,
    ID,
    ID_Short,
    Error,
    SID,
    User_ID,
    Security,
    CMO_User_ID,
    Economy,
    Symbol,
    Accounting_Treatment,
    Property,
    Quality,
    Portfolio,
    Entity,
    Common_Stock,
    Market_Index,
    Instrument,
    Credit_Rating,
    Rating,
    Special_Category,
    OID_Flag,
    Class,
    Class_Short,
    Pool,
    Prepayment_Model,
    CMO_Rating,
    PAC,
    Group,
    Level,
    Jump, Spread,
    Rating_M,
    Forward_Object,
    Strategy,
    f9_6,
    f10_2,
    f4_0,
    GDP
}

export const DataFormatNameMapping: {[formatName: string]: DataFormat} = {
	"Currency": DataFormat.Currency,
	"Return": DataFormat.Return,
	"Rate": DataFormat.Rate,
	"Margin": DataFormat.Margin,
	"Fraction": DataFormat.Fraction,
	"Factor": DataFormat.Factor,
	"Ratio": DataFormat.Ratio,
	"Draw": DataFormat.Draw,
	"Integer": DataFormat.Integer,
	"Integer_Small": DataFormat.Integer_Small,
	"Exposure": DataFormat.Exposure,
	"Currency_PUE": DataFormat.Currency_PUE,
	"Frequency": DataFormat.Frequency,
	"Frequency_PUE": DataFormat.Frequency_PUE,
	"Mean_Frequency": DataFormat.Mean_Frequency,
	"Price": DataFormat.Price,
	"Price_2": DataFormat.Price_2,
	"Price_Short": DataFormat.Price_Short,
	"Years": DataFormat.Years,
	"Years_Short": DataFormat.Years_Short,
	"Years_Squared": DataFormat.Years_Squared,
	"Boolean": DataFormat.Boolean,
	"Transgressions": DataFormat.Transgressions,
	"Shares": DataFormat.Shares,
	"Area": DataFormat.Area,
	"User_Value": DataFormat.User_Value,
	"ID": DataFormat.ID,
	"ID_Short": DataFormat.ID_Short,
	"Error": DataFormat.Error,
	"SID": DataFormat.SID,
	"User_ID": DataFormat.User_ID,
	"Security": DataFormat.Security,
	"CMO_User_ID": DataFormat.CMO_User_ID,
	"Economy": DataFormat.Economy,
	"Symbol": DataFormat.Symbol,
	"Accounting_Treatment": DataFormat.Accounting_Treatment,
	"Property": DataFormat.Property,
	"Quality": DataFormat.Quality,
	"Portfolio": DataFormat.Portfolio,
	"Entity": DataFormat.Entity,
	"Common_Stock": DataFormat.Common_Stock,
	"Market_Index": DataFormat.Market_Index,
	"Instrument": DataFormat.Instrument,
	"Credit_Rating": DataFormat.Credit_Rating,
	"Rating": DataFormat.Rating,
	"Special_Category": DataFormat.Special_Category,
	"OID_Flag": DataFormat.OID_Flag,
	"Class": DataFormat.Class,
	"Class_Short": DataFormat.Class_Short,
	"Pool": DataFormat.Pool,
	"Prepayment_Model": DataFormat.Prepayment_Model,
	"CMO_Rating": DataFormat.CMO_Rating,
	"PAC": DataFormat.PAC,
	"Group": DataFormat.Group,
	"Level": DataFormat.Level,
	"Jump": DataFormat.Jump,
	"Spread": DataFormat.Spread,
	"Rating_M": DataFormat.Rating_M,
	"Forward_Object": DataFormat.Forward_Object,
	"Strategy": DataFormat.Strategy,
	"f9_6": DataFormat.f9_6,
	"f10_2": DataFormat.f10_2,
	"f4_0": DataFormat.f4_0,
	"GDP": DataFormat.GDP
}

export interface PivotFormat {
    paddedLength: number,
    precision?: number,
    scale?: number
}

export interface PivotStateID {
    selection: string;
    arrangement: string;
}

export interface CorrelationTableData {
	axes: Axis[];
	coordinates: {[coordinate: string]: string[] };
	correlations: number[][];
}


export type PivotPart = 'rows' | 'columns' | 'details' | 'toolbar' | 'corner' | 'other' | 'none';

