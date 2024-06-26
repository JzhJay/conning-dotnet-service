import type {ConningUser} from '../graphQL';
export type RepositoryGuid = string;

export interface JuliaRepository {
	_id: string;
	name: string;
	archived?: boolean;
	status?: string;

	createdBy: ConningUser;
	modifiedBy: ConningUser;
}

export interface RepositoryTransform {
	startYear: number;
	startPeriod: number;
	inputFrequency: number;
	outputFrequency: number;
	firstScenarioNumber: number;
	fields: Array<RepositoryFieldTransform>;
	singleAxisCoordinate: boolean;
	singleAxisCoordinateName: string;
	fileId: string;
	fileType: string;
}

export interface RepositoryFieldTransform {
	userField: boolean;
	hide: boolean;
	include: boolean;
	name: string;
	axisCoordinates: string;
	timeAggregator: string;
	timeEqZeroFormula: string;
	timeGtZeroFormula: string;
}

export interface UserOptions {
	disableInputFrequency?: boolean;
	hideHiddenFields?: boolean;
	originalNames?: string[];
}
