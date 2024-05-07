import * as React from 'react';

export interface InputSpecification {
	name: string;
	title: string;
	options: Array<Option>;
}

export interface Option {
	name: string;
	title?: string;
	description?: string;
	applicable?: boolean;
	options?: Array<Option>;
	inputType?: "float" | "integer" | "boolean" | "string" | "exclusive" | "expandable";
	defaultValue?: number | string | boolean;
	minimum?: number;
	maximum?: number;
	allowNull?: boolean;
	readOnly?: boolean;
	dataType?: string;
	axis?: string;

	// UI overrides
	component?: any;
	rightComponent?: any;
	compactOverride?: boolean; // Indicates that the compact version of control should always be used.
	interpolate?: string;
	showDescription?: boolean;
	inline?: boolean; // Forces a component that would otherwise be inlined into a new line.
	indent?: boolean; // Applies indent to an option.
	indentControlTitle?: boolean; // Applies indent to an option title. - This is only needed because of the alternate control flow, we should be able to remove when control is unified with the option flow.
	disableApplicable?: boolean;
	showInitialBreak?: boolean; // Hide first line break.
	hints?: OptionHints;
	customRenderer?: (option: Option, data: any, path: string, verboseMode: boolean) => React.ReactElement;
	renderExclusiveAsRadio?: boolean;

	//Transient properties
	locationPath?: string[];
	gridLayout?: "grid" | "grid-row" | "row";
	suppressTab?: boolean; // Indicates that this tab should not be rendered internally in the InputSpecificationComponent. Useful when navigation is being handled externally, such as in the simulation parameters tree
	dynamicContentPath?: string[]; // if defined, this node is associated with a dynamic structure at the location (dynamicContentPath) and should be cleared when selection changes
}

export interface OptionHints {
	showTitle?: boolean;
	date?: boolean | string;
	decimalPlaces?: number;
	dimension?: number;
	hideHeaders?: boolean;
	rowDetailView?: boolean | "auto"; // if dimension=2, can have a detail table popup.
	tab?: "horizontal" | "vertical"; // display children nodes as a tab structure.
	percent?: boolean;
	renderAsButtons?: boolean;
	maturity?: boolean;
	recentlyUsedList?: string[][];
	multiLineInput?: boolean;
	gridLayoutDimension?: false | 1 | 2;
	dynamicStructure?: boolean; // Indicates that this node is a dynamic structure and selections should be communicated to the back-end
	frozenColumns?: number;
	newItemTemplate?: {type: string, value: string};
}

export const inputSpecification = (name, inputOptions, verboseMode: boolean = false, preProcessHook?: (option) => void, getCustomComponent?: (name) => typeof React.Component, isView: boolean = true) : InputSpecification => {
	let inputOption = inputOptions.options[name];

	const createUISpec = (inputOption) => {

		const preProccess = (option, parentOption?) => {
			let newOptions = null;

			if (preProcessHook)
				newOptions = preProcessHook(option);

			// Process common fields
			if (option.globalListId) {
				newOptions = inputOptions.globalLists[option.globalListId].map(o => ({...o, applicable: true}));
			}

			// Inline leaf nodes
			if (option.inputType == "exclusive" || !option.options || (option.inputType == "expandable" && !option.hints?.dimension))
				option.inline = true;

			if (option.inputType == "exclusive" && (verboseMode || option.renderExclusiveAsRadio) && !option.compactOverride) {
				const options = newOptions ? newOptions : option.options;
				if (options.length > 10 || option.globalListId != null) {
					option.compactOverride = true;
				}
				else {
					option.indent = true;
					option.inline = false;
				}
			}

			// Show titles and descriptions
			if (option.hints?.showTitle == null)
				option.hints = _.assign( option.hints || {}, {showTitle: true});
			option.showDescription = true;

			option.readOnly = _.isBoolean(option.readOnly) ? option.readOnly : !!parentOption?.readOnly ;

			option.locationPath = parentOption ? [...parentOption.locationPath, option.title || option.name] : [option.title || option.name];

			// gridLayout
			if (parentOption?.gridLayout == "grid" &&  option.hints?.gridLayoutDimension !== false) {
				// if the parent is a gridLayout, turn to a row of the grid.
				option.gridLayout = "grid-row";
				option.inline = true;
			} else if (option.hints?.gridLayoutDimension) {
				if (option.hints?.gridLayoutDimension != 1) {
					option.gridLayout = "grid";
				} else {
					option.gridLayout = "row";
				}
			}

			if (newOptions) {
				option.inputType = "exclusive";
				option.options = newOptions;
			}
			else if (option.options)
				option.options.forEach(o => preProccess(o, option));

		}

		preProccess(inputOption);

		return isView ? {
			name: inputOption.name,
			title: inputOption.title,
			options: inputOption.options.map(option => ({
				...option,
				options: option.options && option.options.map(control => ({
					...control,
					value: control.name
				})),
				component: getCustomComponent ? getCustomComponent(option.name) : null
			})),
			hints: inputOption.hints
		} : inputOption;
	}

	let uiSpec = createUISpec(_.cloneDeep(inputOption));

	return uiSpec;
}
