import type {ProgressMessage} from 'components/system/Progress/model';

export interface BatchImportMessage extends ProgressMessage {
	subtype: string;
	data?: string;
	additionalData?: string;
};

export enum BatchImportMessageTypes {
	main = 'batchImport',
	progress = 'progress',
	exception = 'exception',
	results = 'results'
};

export enum FileImportStatus {
	preparing = 'preparing',
	loadFile = 'loadFile',
	importing = 'importing',
	failed = "failed",
	done = 'done'
}

export enum FileImportType {
	userFile = 'userFile',
	upload = 'upload'
}

export interface BatchImportProgress {
	status: FileImportStatus | null;
	importMessage?: ProgressMessage | null;
	importResults?: any;
}

export interface Block {
	block_type: string;
	header: object;
	data: string[][];
	original_lines: number[];
	new_lines: string[];
	version: number[];
	status: string;
	messages: [];

	_index?: number;
}

export type MessageLevel = "Error" | "Warning" | "Information";

export interface Message {
	line: number;
	level: MessageLevel;
	message: string;
	details?: string[];
	locations: {column: number, row: number}[];
}

export type NavigationMode = "Blocks" | "Messages" | "Errors";

export type MessageOrder = "SR" | "SM" | "R" | "M";