import type {ProgressMessage} from 'components/system/Progress/model';

export interface BatchExportObject {
	batchExportResult: {
		[fileid: number]: BatchExportResultStatus
	}
	batchExportMessage: {
		[fileid: number]: BatchExportMessage
	};
	batchExportUserFiles: {
		[fileid: number] : any
	};
}

export interface BatchExportMessage extends ProgressMessage {
	file_id: number;
}

export enum BatchExportResultStatus {
	complete = 'complete',
	error  = 'error'
}

export interface BatchExportResult {
	[file_id: number]: BatchExportResultStatus;
}
