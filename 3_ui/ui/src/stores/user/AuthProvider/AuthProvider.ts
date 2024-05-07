import { Auth0AuthProvider } from 'stores/user/AuthProvider/Auth0AuthProvider';
import { KeycloakAuthProvider } from 'stores/user/AuthProvider/KeycloakAuthProvider';

export function createProvider(options: {providerType: 'auth0' | 'keycloak', productName: string, callbacks: Callbacks})
{
	const {providerType, productName, callbacks} = options;
	switch (providerType) {
		case "auth0":
			return new Auth0AuthProvider(productName, callbacks);
		case "keycloak":
			return new KeycloakAuthProvider(productName, callbacks);
		default:
			throw Error("Unknown provider type");
	}
}

export interface AuthProvider {
	loginWithPassword: (username: string, password: string, audience: string) => void; // Used in Karma tests
	login: () => Promise<void>;
	logout: () => void;
	isLoggedIn: boolean;
	isLoggingIn: boolean;
	isLoginCancelled: boolean;
	accessTokenObservable: string; // An observable that can be used to detect and react to changes on an access token, e.g. re-establish a websocket connection when token changes.
	accessToken: string;
}

export interface Callbacks {
	onLoggedIn: () => void;
	onLoggedOut: () => void;
}

// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
export interface UserStandardProfile {
	name: string;
	nickname: string;
	picture: string;
	given_name?: string;
	family_name?: string;
	email?: string;
	email_verified?: boolean;
	gender?: string;
	locale?: string;
	updated_at: string;
	sub: string;

	userMetadata?: any;
	appMetadata?: any;
}

export interface AppMetadata {
	authorization?: {
		groups: string[],
		roles: string[],
		permissions: string[]
	}
}

export interface License {
	product: string;
	customer: string;
	start: string;
	exp: string;
	startMilliseconds: number;
	expMilliseconds: number;
}