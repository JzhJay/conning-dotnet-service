import type {ConningUser} from '../graphQL';
export type SimulationGuid = string;

export enum SimulationStatus {
	WAITING = "Waiting",
	RUNNING = "Running",
	FAILED = "Failed",
	NOT_COMPLETE = "Not Complete",
	COMPLETE = "Complete",
	PARSE_AND_COMPLETE = "Parse&Complete",
	CANCELING = "Canceling",

	// for GEMS base Object
	STORING = "Storing",
	CALIBRATING = "Calibrating",
}

export interface JuliaSimulation {
	_id: string;
	name: string;
	jobIds?: string[];
	archived?: boolean;
	sourceType?: string;
	parameterizationMeasure?: string;

	variables: number;
	scenarios: number;
	status: SimulationStatus;
	model: string;
	modules: string[],
	economies: Economy[];
	version: string;  // "6.5.99.99 (64546)"
	path: string;
	frequencies: string[];
	periods: SimulationPeriods;
	createdTime: string;
	modifiedTime: string;
	createdBy: ConningUser;
	modifiedBy: ConningUser;
	userFile?: string;
	comments?: string;
	locked?: boolean;
}

export interface SimulationPeriods {
	year?: number;
	quarter?: number;
	month?: number;
}
/*
export interface JuliaSimulation {
    _id: string;
    name: string;
    status: SimulationStatus;
    subPaths: number;
    variables: number;
	scenarios: number;
	description?: string;
    model: string;
    path: string;
    modules: string[],
    economies: Economy[];
    timestamp: string; // "2015-10-29T20:01:18.396"
    version: string;  // "6.5.99.99 (64546)"
	frequencies: string[];
	timePeriod: string;
	createdTime: string;
    modifiedTime: string;
    createdBy: UserId;
	createdBy_external: string;
}*/

export type Economy = "US" | "DE" | "GB" | "CH" | "AU" | "CA" | "JP" | "DK" | "NO" | "SE" | "BR";
