import { Intent } from '@blueprintjs/core';
import Keycloak from 'keycloak-js';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {action, computed, makeObservable, observable, runInAction } from 'mobx';
import {julia, routing, xhr, slugs, site} from 'stores';
import type { AuthProvider, Callbacks, License } from 'stores/user/AuthProvider/AuthProvider';
import { LicenseUpdateMessage } from '../../../components/system/License/LicenseUpdateMessage';

const ID_TOKEN        = 'Keycloak_idToken';
const ACCESS_TOKEN    = 'Keycloak_accessToken';
const REFRESH_TOKEN        = "Keycloak_refreshToken";
const LAST_LICENSE_NOTIFY_TIME_LS_KEY = 'Conning_license_notify_last_check_time';
const LICENSE_EXPIRED_CHECK_TIME = 60 * 24 * 60 * 60 * 1000; // within 2 months
const LICENSE_EXPIRED_NOTIFY_INTERVAL = 7 * 24 * 60 * 60 * 1000; // every 7 days

export class KeycloakAuthProvider implements AuthProvider {
	keycloakClient: Keycloak;
	@observable isLoggingIn      = false;
	@observable isLoginCancelled = false;
	@observable isRenewingToken  = false;
	@observable _idToken = localStorage.getItem(ID_TOKEN);
	@observable _accessToken;
	@observable _refreshToken = localStorage.getItem(REFRESH_TOKEN);
	
	set idToken(idToken) {
		// Saves user token to localStorage
		if (idToken) {
			localStorage.setItem(ID_TOKEN, idToken)
		}
		else {
			localStorage.removeItem(ID_TOKEN)
		}

		this._idToken = idToken;
	}

	@computed
	get idToken() {
		// Retrieves the user token from localStorage
		return this._idToken
	}

	set refreshToken(refreshToken) {
		// Saves user token to localStorage
		if (refreshToken) {
			localStorage.setItem(REFRESH_TOKEN, refreshToken)
		}
		else {
			localStorage.removeItem(REFRESH_TOKEN)
		}
		this._refreshToken = refreshToken;
	}

	@computed
	get refreshToken() {
		// Retrieves the user token from localStorage
		return this._refreshToken;
	}

	@computed
	get isLoggedIn() {
		return this.idToken != null && this.accessToken != null;
	}

	/**
	 * Returns a computed that can be used to react to access token changes. Should NOT be used to retrieve the underlying access token value.
	 */
	@computed get accessTokenObservable() {
		return this._accessToken
	}

	// Do not make this a computable. expiration needs to be computed on every request.
	get accessToken() {
		if (this._accessToken && this._accessToken.expiration < Date.now()) {
			// Remove the token since its no longer valid and attempt a silent renewal
			runInAction(() => {
				this._accessToken = null;
				this.renewAuth();
			});
		}

		return this._accessToken ? this._accessToken.token : null
	}

    get url() {
		const hostname = window && window.location ? window.location.hostname : 'advise.test';
		return `${window.location.protocol}//${hostname}`;
	}

	get licenseRoute() {
		return`${this.url}/api/license`;
	}

	constructor(private productName: string, private callbacks: Callbacks) {
		makeObservable(this);

		try {
			this._accessToken =
				localStorage.getItem(ACCESS_TOKEN) ? JSON.parse(localStorage.getItem(ACCESS_TOKEN)) : null;
		}
		catch (err) {
			//console.error(err);
			console.error(`There was an error reading the access token '${ACCESS_TOKEN}`, err);
			this.clearKeycloakToken();
		}

		const hostname = window && window.location ? window.location.hostname : 'advise.test';
		const clientId = _.get(window, ['conning', 'globals', 'authClientId'], 'advise-spa');
		// Configure Auth0
		this.keycloakClient = new Keycloak({
			url: `${this.url}/keycloak`,
			realm: 'master',
			clientId
		});

		runInAction(() => {
			this.isLoggingIn = true;
		});

		this.setReturnToCurrentUrl();
		this.keycloakClient.init({
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: `${window.location.protocol}//${hostname}/ui/lib/keycloak-js/dist/silent-check-sso.html`,
			pkceMethod: 'S256',
			messageReceiveTimeout: 30000,
			token: this.accessToken,
			refreshToken: this.refreshToken
		}).then(async (auth) => {
			if (auth) {
				console.log('Keycloak authentication succeeds.');
				this.callbacks.onLoggedIn();
			} else {
				console.log('Keycloak authentication fails.');
				if (this.keycloakClient.tokenParsed && this.keycloakClient.isTokenExpired()) {
					console.log('Found token is expired in initialization');
					await this.renewAuth();
				} else {
					this.clearKeycloakToken();; // for router to logout
				}
			}
		}, (error) => {
			console.warn('Keycloak initialization fails: ', error)
		})
		.catch((error)=> {
			console.warn('Keycloak initialization catches unknown error: ', error);
		})
		.finally(() => {
			runInAction(() => {
				if (!this.isRenewingToken) {
					this.isLoggingIn = false;
				}
			});
		});
		
		this.keycloakClient.onAuthSuccess = () => {
			console.log('Keycloak onAuthSuccess fired');
			runInAction(() => {
				this.isLoginCancelled = false;
				this.updateKeycloakToken();
	
				let returnTo = this.getReturnUrl();
				console.log("Return to", returnTo);
				routing.push(returnTo != null ? returnTo : "/");
			});

			this.checkLicenseExpireDate();
		};

		this.keycloakClient.onAuthError = (error) => {
			console.error('Keycloak onAuthError fired', error);
			runInAction(() => {
				this.isLoginCancelled = true;
			});
		};

		this.keycloakClient.onTokenExpired = () => {
			console.log('keycloak onTokenExpired fired');
			this.renewAuth();
		};
	}

	setAccessToken(token) {
		const decoded = jwt_decode<JwtPayload>(token);
		if (decoded.exp) {
			const wrappedToken = { token, expiration: decoded.exp * 1000};
			localStorage.setItem(ACCESS_TOKEN, JSON.stringify(wrappedToken));

			this._accessToken = wrappedToken;
		}
		else {
			throw new Error(`Access Token is missing expiration`);
		}
	}

	clearAccessToken() {
		// Bug in chrome 61 that brings back deleted keys on refresh. Workaround is to set to null instead of actually deleting
		// https://bugs.chromium.org/p/chromium/issues/detail?id=765524
		// https://stackoverflow.com/questions/46131249/localstorage-cannot-be-removed-in-chrome
		localStorage.setItem(ACCESS_TOKEN, null)
		//localStorage.removeItem(ACCESS_TOKEN)

		this._accessToken = null;
	}

	login = action(async (setReturnLocation = true) => {
		console.log('Keycloak login method called');
		// Call the show method to display the widget.
		if (window.location.pathname != `/${slugs.logout}` && setReturnLocation)
			this.setReturnToCurrentUrl();

		this.isLoggingIn      = true;
		this.isLoginCancelled = false;
		await this.keycloakClient.login();
	})

	outstandingRenew: Promise<void>;
	@action renewAuth = () => {
		if (this.outstandingRenew)
			return this.outstandingRenew;

		runInAction(() => { 	
			this.isRenewingToken = true;
			this.isLoggingIn = true;
		});

		this.outstandingRenew = this.keycloakClient.updateToken(5)
			.then(action((refreshed) => {
				if (refreshed) {
					console.log('Token was successfully refreshed');
					this.updateKeycloakToken();
					this.callbacks.onLoggedIn();
					console.log("Renewed token")
				} else {
					console.warn('Token is still valid');
				}
				this.isLoggingIn = false;
			})).catch(action((err) => {
				console.warn("Failed to renew auth token", err);
				console.trace();
				this.setReturnToCurrentUrl();
				this.clearKeycloakToken();

				// We might try to renew the token in a Karma run before the test user has been signed in if we had an expired token. If so there will be a failure.
				if (!KARMA)
					this.login(); // Show login prompt if renew failed so user can manually log in.
			})).finally(action(() => {
				this.outstandingRenew = null;
				this.isRenewingToken = false;
			}));

		return this.outstandingRenew;
	}

	@action logout = (returnToCurrentPage = true) => {
		if (returnToCurrentPage)
			this.setReturnToCurrentUrl();

		//TODO: Can we move this to UserStore?
		// Trigger logout before clearing token
		xhr.post(`${julia.url}/v1/logout`).then( () => {
			if (!KARMA) {
				this.keycloakClient.logout({
					redirectUri: `${this.url}${(this.getReturnUrl() || '')}`
				}).catch((error) => {
					console.error('Logout fails: ', error);
				});
			}
		});

		// Clear user token and profile data from localStorage
		this.clearKeycloakToken();

		this.callbacks.onLoggedOut();
	}

	setReturnToCurrentUrl = () => {
		localStorage.setItem(this.returnUrlKey(), window.location.pathname + window.location.search);
	}

	returnUrlKey = () => {
		return `${window.location.host}-webvise-returnUrl`
	}

	getReturnUrl = () => {
		const result = localStorage[this.returnUrlKey()];
		delete localStorage[this.returnUrlKey()];
		return result;
	}

	async loginWithPassword(username: string, password: string) {
		// TODO for karma test, not test yet
		const hostname = window && window.location ? window.location.hostname : 'advise.test';
		const authResult: any = await xhr.post(`${window.location.protocol}//${hostname}/keycloak/realms/master/protocol/openid-connect/token`, {
			client_id: 'advise-cli',
			client_secret: 'jGgcp6t4EQ6fllWyG1lVRntg17yWjfkc',
			grant_type: 'password',
			username: username,
			password: password
		});

		this.setAccessToken(authResult.access_token);
		this.idToken = authResult.id_token;
	}

	@action updateKeycloakToken = () => {
		if (this.keycloakClient.idToken) { // idToken is null while session is valid and onAuthSuccess fired 
			this.idToken = this.keycloakClient.idToken;
		}
		this.setAccessToken(this.keycloakClient.token);
		this.refreshToken = this.keycloakClient.refreshToken;
	}

	@action clearKeycloakToken = () => {
		localStorage.setItem(ID_TOKEN, null);
		localStorage.setItem(REFRESH_TOKEN, null);
		this.idToken = null;
		this.clearAccessToken();
		this.refreshToken = null;
	}

	checkLicenseExpireDate = () => {
		const licenseExpireTime = _.get(window, ['conning', 'globals', 'licenseExpireTime'], 0);
		const now = Date.now();

		// if expired time is within 2 months  
		if ((licenseExpireTime - now) <= LICENSE_EXPIRED_CHECK_TIME) {
			const lastNotifyTime = parseInt(localStorage.getItem(LAST_LICENSE_NOTIFY_TIME_LS_KEY) || "0");
			// last notify date is 7 days ago
			if ((now - lastNotifyTime) >= LICENSE_EXPIRED_NOTIFY_INTERVAL) {
				site.toaster.show({
					icon: 'outdated',
					message: <LicenseUpdateMessage licenseExpireTime={licenseExpireTime} isExpired={now >= licenseExpireTime} />, 
					intent: Intent.WARNING, 
					timeout: 60000,
					action: { onClick: () => routing.push('/license'), text: 'Update' }});
				localStorage.setItem(LAST_LICENSE_NOTIFY_TIME_LS_KEY, now.toString());
			}
		} 
	}
}