import {Auth0Identity} from 'auth0-js';

export type UserId = string;

export interface JuliaUser {
	email: string;
	fullName: string;
	picture: string;
	_id: string;
	created_at: string;
	last_login: string;
	/** Represents one or more Identities that may be associated with the User. */
	identities: Auth0Identity[];
	app_metadata?: {
		authorization: { groups: Array<any>, permissions: Array<any>, roles: Array<any> },
		roles: string[]
	};
	externalID: string;
}

export interface License {
	customer: string;
	dates: string[];
	features: {
		Product: string;
		Economies: string[];
		Options: string[];
		Calibration_Measure: string[]
	}
}