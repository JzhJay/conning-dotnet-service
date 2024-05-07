import {OptionHints} from 'components';

export interface ColumnHeaderEntry {
	name: string;
	label?: string;
	applicable?: boolean;
	menuLabel?: string;
	children?: Array<ColumnHeaderEntry>;
	groupEditable?: boolean;
	editable?: boolean;
	isColor?: boolean; // Used to mark color column
	total?: AsssetClassTotal;
	supportsExtreme?: boolean;
	isListColumn?: boolean;
	autoPercentFormat?: boolean;
	autoGenerateChildrenCount?: number;
	showDropDown?: boolean;
	//dataMap?: string[]; // Used to populate dropdowns
	pathStop?: number; // Indicates level where path stops
	isPercentage?: boolean;
	minimum?: number;
	maximum?: number;
	allowNull?: boolean;
	axis?: string;
	inputType?: string;
	options?: {name: string, title: string} [],
	allowMerging?: boolean;
	allowGroupTotal?: boolean;
	hints?: OptionHints;
}

export type AsssetClassTotal = "fixed" | "auto";

export type ColumnHeader = Array<ColumnHeaderEntry>;

export const input = (inputOptions) : {children: Array<ColumnHeaderEntry>} => {
	let inputOption = inputOptions.options["assetClasses"];

	const applyOverride = (node, path: string[]) => {
		if (node.options) {
			if (node.inputType == "exclusive") {
				node.showDropDown = true;
			}
			else
				node.children = node.options.map(n => applyOverride(n, [...path, n.name]));
		}
		else if (node.globalListId) {
			node.options = inputOptions.globalLists[node.globalListId].map(o => ({...o, applicable: true}));
			node.showDropDown = true;
		}


		if (node?.hints?.allowGroupTotal) {
			node.allowGroupTotal = true;
			node.total = "auto";
		}

		// Look up possible overrides and apply them.
		let override = overrides;
		path.forEach(p => {
			if (override == null || override.children == null) {
				override = null;
				return;
			}

			override = override.children.find(o => o.name == p);
		})

		if (override && (override.children == null || override.children.length == 0)) {
			node = {...node, ...override};
		}

		const isPercentage = node.hints && node.hints.percent;
		return {...node, label: node.title + (isPercentage ? " (%)" : ""), isPercentage};
	}

	return applyOverride(_.cloneDeep(inputOption), []);
}

let overrides:{children?: Array<ColumnHeaderEntry>} = {
	children: [
		{
			name: "color",
			isColor: true,
			children: []
		},
		{
			name: "returnSource",
			showDropDown: true,
			children: []
		},
		{
			name: "constraintsAndDuration",
			children: [
				{
					name: "classConstraints",
					children: [
						{
							name: "minimum",
							groupEditable: true,
							total: "fixed",
							isPercentage: true,
						},
						{
							name: "maximum",
							groupEditable: true,
							total: "fixed",
							isPercentage: true
						}
					]
				},
				{
					name: "duration",
					supportsExtreme: true
				},
				{
					name: "multiClassConstraints",
					supportsExtreme: true,
					isListColumn: true,
					autoPercentFormat: true
				},
				{
					name: "proportionalConstraints",
					supportsExtreme: false,
					isListColumn: true,
					autoPercentFormat: true
				}
			]
		},
		{
			name: "values",
			children: [
				{
					name: "marketValue",
					total: "auto"
				}
			]
		},
		{
			name: "additionalAllocations",
			menuLabel: "Additional Allocations",
			supportsExtreme: false,
			isListColumn: true,
			isPercentage: true
		}
	]
}