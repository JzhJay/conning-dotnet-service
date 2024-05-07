import type {ChartUserOptions} from 'stores';

export interface IModelDefinition {
	name: string;
	title: string;
	description: string;
	applicable: boolean;
	inputType?: string;
	defaultValue?: any;
	hints?: any;
	minimum?: number;
	maximum?: number;
	allowNull?: boolean;
	options?: IModelDefinition[];
	locationPath?: string[];
	isSummaryNode?: boolean;

	applicableChildrenTitles?: string[]; // Child nodes that should be visible. Used for UseCaseViewer
}

export interface IModelMetadata {
	[name: string]: IModelDefinition;
}

export interface ITableRow {
	id: string;
	economy?: string;
	model?: string;
	rating?: string;
	index?: string;
	state?: string;
	tenor?: number;
	horizon?: number;
	measure?: string;
	statistic?: string;
	weight?: number;
	valueBasedOnPreviousParameters?: number;
	valueBasedOnCurrentParameters?: number;
	targetValue?: number;
	simulatedValue?: number;
}

export interface IResultWithValidation<T> {
	result: T;
	validationMessages: any[];
}

export interface IModelDataset {
	name: string;
	table: ITableRow[];
	settings: any;
}

export interface IModelCoordinate {
	axis: string;
	value: string;
}

export interface IModelTreeNode {
	childNodes?: IModelTreeNode[];
	coordinate: IModelCoordinate;
	id: string;
	label: string;
	isExpanded: boolean;
	isSelected: boolean;
	parentNode?: IModelTreeNode;
}

export interface IAxis<T> {
	orderIndices: number[],
	values: {[index: string]: T},
	paths: string[][]
}

export interface IAxes<T> {
	[axis: string] : IAxis<T>
}

export interface IModelOptimizers {
	inputOptions: {
		optimizers: IModelDefinition,
		allParameters: IModelDefinition,
		targets: IModelDefinition
	};
	globalLists: {};
	axes: IAxes<string>;
	userInputs: {optimizers: any[][], allParameters: any, targets: any };
	actionFlag: string;
	validationMessages: any[];
}

export interface IModelWebLocalDataset {
	showChart: boolean,
	chartUserOptions: ChartUserOptions,
	heights: {
		table: {
			main: number,
			options: number
		},
		chart: {
			main: number,
			options: number
		}
	},

}

export const yearMonthInputFields = new Set<string>([
	'tenor',
	'horizon',
	'secondTenor'
]);