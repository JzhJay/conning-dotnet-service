export interface Validation {
	path: string;
	errorType: "Error" | "Warning" | "Info";
	description: string;
}

export interface InputSpecificationUserOptions {
	verboseMode?: boolean;
	indentMargin?: number;
	lineSpacing?: number;
	displayMode?: "verbose" | "compact" | "classic";
}

export interface IDynamicStructureRowPath {
	dynamicNodePath: string[];
	innerPath: string[];
}