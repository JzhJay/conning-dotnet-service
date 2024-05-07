import {OptionHints} from '../../inputSpecification';

export interface HeaderEntry {
	name: string;
	label?: string;
	applicable?: boolean;
	menuLabel?: string;
	children?: Array<HeaderEntry>;
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
	parentAxis?: string;
	inputType?: string;
	options?: {name: string, title: string} [],
	allowMerging?: boolean;
	isExpandableOnAlternate?: boolean;
	template?: HeaderEntry;
	hints?: OptionHints;
}

export type AsssetClassTotal = "fixed" | "auto";

export type Header = Array<HeaderEntry>;

export const input = (inputOption, globalLists, axes) : {children: Array<Header>} => {

	const applyOverride = (node, path: string[], currentDimension) => {

		if (node.inputType === "expandable") {
			node.isExpandableOnAlternate = isExpandableOnAlternate(currentDimension, node);

			if (path.length == 0) {
				// Handle expansion on the outer layer, e.g. Julia Vector{Dicts}.
				// In this case we are always expanding on the alternate, e.g. in the table the headers are on the columns and the expansion is across the rows.
				node.isExpandableOnAlternate = true;
				node.options = [{name: null, options: node.options}]; // Julia strips out the template node, let's re-add it. TODO: Update Julia to avoid stripping it out.
			}

			if (node.isExpandableOnAlternate) {
				node.template = applyOverride(node.options[0], [], null);
				node.hints = {...node.hints, ...node.template.hints};
				node.options = null;
			}
		}

		const isExpandableNode = node.inputType === "expandable" && !node.isExpandableOnAlternate;

		if (isExpandableNode && node.axis != null) {
			let axis     = axes && axes[node.axis];
			let templateNode = node.options && node.options.length == 1 ? node.options[0] : null;
			const templateIsExpandableOnAlternate = (templateNode && isExpandableOnAlternate(node?.hints?.dimension || currentDimension, templateNode));

			let nodeDimension = templateIsExpandableOnAlternate ? null : node?.hints?.dimension;

			// Move dimension to children so they are correctly included in split
			if (nodeDimension != null)
				node.hints.dimension = null;

			// Expand
			node.options = Object.keys(axis.values).map((key, index) => ({
				name: index,
				title: axis.values[index],
				editable: true,
				parentAxis: node.axis,
				axis: templateNode?.axis,
				hints: {dimension: nodeDimension},
				isExpandableOnAlternate: templateIsExpandableOnAlternate || false, // Copy from template node
				options: templateIsExpandableOnAlternate ? null : _.cloneDeep(node.options)})
			);
		}


		if (node.options) {

			if (isExpandableNode) {
				// Handle nested templates. If parent and child are both templates we can merge into a single node
				if (node.name == null && node.options[0].name == null) {
					Object.assign(node, node.options[0]);
					node.options = null;
				}
			}

			if (node.inputType == "exclusive") {
				node.showDropDown = true;
			}
			else
				node.children = node.options.map(n => applyOverride(n, [...path, n.name], node?.hints?.dimension || currentDimension));
		}
		else if (node.globalListId) {
			node.options = globalLists[node.globalListId].map(o => ({...o, applicable: true}));
			node.showDropDown = true;
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
		return {...node, label: (node.title || node.name) + (isPercentage ? " (%)" : ""), isPercentage};
	}

	return applyOverride(_.cloneDeep(inputOption), [], null);
}

export const isExpandableOnAlternate = (currentDimension, node) => {
	// Expandables with template(name == null) children on a different dimension should not be expanded.
	// This essentially signifies that the expansion is on the alternate/opposite dimension
	if (node.inputType === "expandable") {
		let templateNode = node.options && node.options.length == 1 ? node.options[0] : null;
		return templateNode && templateNode.name == null && (templateNode.options == null || templateNode.inputType == "exclusive") && node?.hints?.dimension != null && node?.hints?.dimension != currentDimension;
	}

	return false;
}

let overrides:{children?: Array<HeaderEntry>} = {
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