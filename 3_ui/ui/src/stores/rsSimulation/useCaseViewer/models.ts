import {ApiPage} from 'stores/book/model';

export interface IAPIUseCase {
	viewDefinitions: IViewDefinitions;
	pages: Array<ApiPage>;
}

export interface IViewDefinitions {
	inputs?: Array<IInputViewDefinition>;
	outputs?: Array<IOutputViewDefinition>;
}

export interface IInputViewDefinition {
	title: string;
	nodes: Array<string>;
}

export interface IOutputViewDefinition {
	title: string;
	queryView: string;
	queryID: string;
	querySpecificationFile: string;
}