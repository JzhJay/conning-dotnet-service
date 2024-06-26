import {Option} from 'components';
import type {ValidationMessage} from 'stores';
import {IAxes} from 'stores/rsSimulation/rwRecalibration/models';
import type {ConningUser} from '../graphQL';
import type {IConningApplicationIcon} from 'stores';

export interface JuliaRSSimulation {
	_id: string;
	name: string;
	archived?: boolean;
	status?: string;

	createdBy: ConningUser;
	modifiedBy: ConningUser;

	comments?: string;
}

export interface UserInterfaceResponse {
	changeMessages: ChangeMessage[];
	requiredOptimization: string;
	additionalControls: string;
	actionFlag: Action;
	validationMessages: ValidationMessage[];
	inputOptions: any;
	userInputs: any;
}

export interface ChangeMessage {
	messageType: string;
	sourcePath: string[];
	targetPath: string[];
	targetValue: any;
}

export type Action = "full" | "none";

export interface AdditionalControls {
	navigatorType?: 'step-by-step' | 'breadcrumb' | 'tree-navigator';
	showValidationSetting?: boolean;
	showAddressPath?: boolean;
	showNoteEditor?: boolean;
	noteEditorReadonly?: boolean;
}

export interface TreeNodeResponse {
	axes: IAxes<string>;
	inputOptions: Option;
	userInputs: {[key: string]: any};
	isSummaryNode?: boolean;
	notes: Array<{content: string; path: string[]}>
}

export interface IExportSettings {
	path: string[];
	filename: string;
	exportRegional: string;
	exportVersion: boolean;
	append: boolean;
	exportFlexibleAxes: boolean;
	appendFlexibleAxes: boolean;
	exportModules: boolean;
	appendModules: boolean;
	allModules: boolean;
	allModelChoices: boolean;
	inactiveAxes: boolean;
}

export type TemplateOptions = Array<ITemplateFilter>;

export interface ITemplateFilter {
	date: string;
	parameterization: string;
	version: string;
	periodicity: string;
	economies: string[];
	components: string[];
}
export interface ISimulationUseCase {
	name: string;
	title: string;
	icon: IConningApplicationIcon;
}
