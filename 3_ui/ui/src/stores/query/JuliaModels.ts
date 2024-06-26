import type {SortOrder} from '../site/models';
import type {UserId} from '../user';
export type QueryViewName = "query" | "pivot" | "correlation" | "box" | 'cone' | 'cdf' | 'scatter' | 'pdf' | 'histogram' | 'bootstrap' | 'sensitivity' | 'line' | 'line2' | 'bar' | string;
export type SelectOperation = 'All' | 'None' | 'Only' | 'Except' | 'With' | 'Without' | 'In';
export type QueryPart = "variables" | "time-steps" | "scenarios" | "statistics" | "arrangement" | "views";

export * from '../simulation/models'
export type {SortOrder} from '../site';

export interface QueryOptions {

}

export interface RestLinks {
	method: "GET" | "DELETE" | "PUT" | "POST";
	rel: string;
	href: string;
}

export interface CreateQueryPOST {
	simulationIds: string[],
	name: string
}


export interface QuerySave {
	arrangement: { rows: string[], columns: string[]}
	special_selections: any[];
	statistics_clauses: StatisticsClause[];
	variable_clauses: {axis: string, opcode: SelectOperation, source: 'Implicit' | 'Explicit', coordinates: string[]}[][]
}

export interface JuliaQueryDescriptor {
	name?: string;
	_id?: string;
	simulations?: Array<{_id: string, name: string}>
	links?: RestLinks;
	createdTime?: string;
	modifiedTime?: string;
	createdBy?: UserId;
	isRunning?: boolean;
	hasResult?: boolean;
	hasSession?: boolean;
	variables ?: number;
	simulationInputsVersions?: Array<{id: string, version: number}>

	querySave?: QuerySave;

	resultWarning?: string;
}

export interface SavedQueryDescriptor extends JuliaQueryDescriptor {

}


export interface QueryViewAvailability {
	name: string;
	description?: string;
	available?: boolean;
	requirements?: Array<{met: boolean, description: string}>;
	bootstrappable?: boolean;
	sensitivity?: boolean;
}


export interface QueryState {
	axes?: QueryAxis[];
	variables?: Variables;
	statistics?: StatisticsState;
	arrangement?: Arrangement;

	availableViews?: QueryViewAvailability[];
}

export interface StatisticsState {
	metadata: StatisticsMetadata[];
	clauses: StatisticsClause[];
	axesAvailable: number[]
}

export type AxisCode = 'Standard' | 'Dynamic' | 'Time' | 'Scenario';

export interface QueryAxis {
	id: number;
	label: string;
	description: string;
	code: AxisCode;
	coordinates: AxisCoordinate[];
	sortIndex?: number;
}

export interface AxisCoordinate {
	id: number;
	label: string;
	description: string;
}

export interface Variables {
	collapsed: boolean;
	clauses: VariableClause[];
	selected: number;
	total: number;
}

export interface VariableStatus {
	axis: number;
	selected: number[];
	available: number[];
}

export interface StatisticsMetadata {
	id: number;
	label: string;
	description: string;
	name: string;
	parameters: any[];
}

export interface QueryStatistics {
	statisticsClauses: StatisticsClause[];
	axesAvailable: number[];
}

export interface Arrangement {
	rows: number[];
	columns: number[];
}

export interface AvailableChange {
	axis: number;
	coordinates: Array<number>
}

export interface SelectAxisCoordinatesPayload {
	operation: SelectOperation,
	coordinates: number[]
}

export interface AddVariableClauseResponse {
	id: number;
	variableCount: number;
}

export interface AddStatisticsClauseResponse {
	id: number;
}

export interface JuliaQuery extends JuliaQueryDescriptor {
	state: QueryState;
}

export interface StatisticsMetadata {
	id: number;
	label: string;
	description: string;
	name: string;
	parameters: any[];
}

export interface StatisticsClause {
	statistics: number[];
	axis: number;
	axes_available: number[];
}

export interface VariableClause {
	id: number;
	axes: ClauseAxis[];
	selected: number;
	showImpliedAxes: boolean;
}

export interface ClauseAxis {
	id: number;  // Axis ID
	selected: number[];
	available: number[];
	selectedAndAvailable: number;

	// Client-side only fields
	expanded: boolean;
	sortOrder: SortOrder;
}

export interface Arrangement {
	rows: number[];
	columns: number[];
}

export type ArrangementOperation = "Columns" | "Rows" | "Transpose" | "FirstRow"| "FirstColumn" | "MoveAfter";

// Done to prevent babel error
let x;


