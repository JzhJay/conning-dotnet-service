import auth0 from 'auth0-js';
import {Auth0Client} from '@auth0/auth0-spa-js';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';
import {julia, routing, site, slugs, user, xhr} from 'stores';
import type {AppMetadata, AuthProvider, Callbacks, UserStandardProfile} from 'stores/user/AuthProvider/AuthProvider';
import auth0Lock from 'auth0-lock';

const SCOPES = 'openid profile email offline_access read:current_user create:current_user_metadata update:current_user_metadata';

const ID_TOKEN        = "Auth0_idToken";
const ACCESS_TOKEN    = "Auth0_accessToken";

export class Auth0AuthProvider implements AuthProvider {
	auth0?: auth0.WebAuth;
	auth0Client: Auth0Client;
	lock: Auth0LockStatic;
	hasUnrecoverableError      = false;
	@observable isLoggingIn      = false;
	@observable isLoginCancelled = false;

	constructor(private productName: string, private callbacks: Callbacks) {
		makeObservable(this);

		try {
			this._accessToken =
				localStorage.getItem(ACCESS_TOKEN) ? JSON.parse(localStorage.getItem(ACCESS_TOKEN)) : null;
		}
		catch (err) {
			//console.error(err);
			console.error(`There was an error reading the access token '${ACCESS_TOKEN}`, err);
			this.clearAccessToken();
		}

		// Configure Auth0
		this.auth0Client = new Auth0Client(
			{
				client_id:        window.conning.globals.authClientId,
				domain:           window.conning.globals.authDomain,
				audience:         "https://kui/api",
				useRefreshTokens: true,
				cacheLocation:    'localstorage',
				redirect_uri:     `${window.location.protocol}//${window.location.host}/${slugs.authCallback}`
			})

		this.lock = new auth0Lock(window.conning.globals.authClientId, window.conning.globals.authDomain, {
			closable:           true,
			autoclose:          true,
			languageBaseUrl: '/ui/lib/auth0',
			languageDictionary: {
				title: this.productName
			},
			theme:              {
				logo: `${window.location.protocol}//${window.location.host}/images/advise/conning-logo-no-text.svg`
			},

			//allowedConnections: AUTH0_ALLOWED_CONNECTIONS,

			auth:              {
				responseType: 'code',
				redirect:     true,
				redirectUrl:  `${window.location.protocol}//${window.location.host}/authCallback`,
				params:       {/*prompt: 'select_account',*/ scope: SCOPES},
				audience:     "https://kui/api"
			},
			oidcConformant:    true,
			rememberLastLogin: false // Disable remember last login, which does not resend the initial scope as it should WEB-1998
		})

		// Exchange authorization code for token if we are on the authCallback page
		if (this.shouldProcessAuthorizationToken)
			setTimeout(this.exchangeCodeForToken, 0);

		this.lock.on('show', () => {
			this.isLoggingIn = true;
			//this._clearProfile();
			site.setPageHeader('Login');
			//this.addExternalLoginOptions();
		});

		this.lock.on('hide', () => {
			if (!this.isLoggedIn) {
				this.isLoginCancelled = true;
				this.isLoggingIn      = false;
			}
			this.getAuthorizationParams.cache.clear();

			// Refresh to the logout page if auth0 is in a bad state.
			if (this.hasUnrecoverableError)
				window.location.href = slugs.logout;
		})

		this.lock.on('unrecoverable_error', () => {
			// This error happens when connection is broken during authentication which leaves auth0 in a bad state.
			this.hasUnrecoverableError = true;
		})

		this.lock.on('authorization_error', (error) => runInAction( action(() => {
			this.idToken = null;
			this.clearAccessToken();
			this.isLoginCancelled = true;
			this.isLoggingIn      = false;

			this.lock.show({
				flashMessage: {
					type: 'error',
					text: error.errorDescription
				}
			});
		})));

	}

	get shouldProcessAuthorizationToken() {
		const urlParams = new URL(window.location.href).searchParams;

		if (window.location.pathname == "/authCallback") {
			if (window.location.search.indexOf("error=") != -1) {
				this.login({
					flashMessage: {
						type: 'error',
						text: urlParams.get("error_description")
					}
				}, false);
			}

			return window.location.search.indexOf("code=") != -1;
		}

		return false;
	}

	exchangeCodeForToken = async () => {
		try {
			await this.auth0Client.handleRedirectCallback();
			let authResult = this.auth0ClientTokenResponse;

			// Wrap in transaction to reduce reactions
			runInAction(() => {
				this.idToken = authResult.id_token;
				this.setAccessToken(authResult.access_token);
				this.isLoginCancelled = false;

				this.callbacks.onLoggedIn();
				this.isLoggingIn = false;

				//window.location.replace(this.getReturnUrl());

				let returnTo = this.getReturnUrl();
				console.log("Return to", returnTo);
				routing.push(returnTo != null ? returnTo : "/");
			})
		}
		catch (e) {
			this.login({
				flashMessage: {
					type: 'error',
					text: e.message
				}
			}, false);
			throw(e);
		}
	}

	get auth0ClientTokenResponse() {
		// No public API is available to determine the token expiration so pull this data from cache
		const cache = (this.auth0Client as any).cacheManager.cache;
		return cache.get(cache.allKeys()[0]).body;
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


	@observable _accessToken;

	// Do not make this a computable. expiration needs to be computed on every request.
	get accessToken() {
		if (this._accessToken && this._accessToken.expiration < Date.now()) {

			// Remove the token since its no longer valid and attempt a silent renewal
			runInAction( () => {
				this._accessToken = null;
				this.renewAuth();
			});
		}

		return this._accessToken ? this._accessToken.token : null
	}
	
	getAuthorizationParams = _.memoize(async () => {
		// Auth0 client doesn't directly expose a method for generating the PKCE keys but we can extract
		// them from the authorize url Auth0 generates
		const authorizeURL = await this.auth0Client.buildAuthorizeUrl();
		return new URL(authorizeURL).searchParams;
	})

	login = async (options: Auth0LockShowOptions = null, setReturnLocation = true) => {
		// Call the show method to display the widget.
		if (window.location.pathname != `/${slugs.logout}` && setReturnLocation)
			this.setReturnToCurrentUrl();

		this.isLoggingIn      = true;
		this.isLoginCancelled = false;

		const urlParams = await this.getAuthorizationParams();

		console.log(urlParams.get("state"));

		this.lock.show({
			auth: {
				params: {
					        state: urlParams.get("state"),
					        nonce: urlParams.get("nonce"),
					        code_challenge: urlParams.get("code_challenge"),
					        code_challenge_method: urlParams.get("code_challenge_method")
				        } as any
			},
			...options
		});
	}

	@observable _idToken = localStorage.getItem(ID_TOKEN);

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

	outstandingRenew: Promise<boolean>;
	@action renewAuth = () => {
		if (this.outstandingRenew)
			return this.outstandingRenew;

		this.isLoggingIn = true;

		this.outstandingRenew = new Promise((accept, reject) => {

			this.auth0Client.getTokenSilently().then(token => {
				const authResult = this.auth0ClientTokenResponse;

				this.idToken = authResult.id_token;
				this.setAccessToken(token);
				this.callbacks.onLoggedIn();

				console.log("Renewed token")
				this.isLoggingIn = false;
			}).catch(err => {
				//site.raiseError(err, "auth", "Failed to renew auth token");
				console.warn("Failed to renew auth token", err);
				this.setReturnToCurrentUrl();
				this.idToken = null;
				this.clearAccessToken();

				// We might try to renew the token in a Karma run before the test user has been signed in if we had an expired token. If so there will be a failure.
				if (!KARMA)
					this.login(); // Show login prompt if renew failed so user can manually log in.
			}).finally(() => {
				accept(this._accessToken != null);
				this.outstandingRenew = null;
			})
		})

		return this.outstandingRenew;
	}

	@action logout = (returnToCurrentPage = false) => {
		let returnToUrl = `${window.location.protocol}//${window.location.host}/${slugs.logout}`;

		if (returnToCurrentPage)
			this.setReturnToCurrentUrl();

		//TODO: Can we move this to UserStore?
		// Trigger logout before clearing token
		xhr.post(`${julia.url}/v1/logout`).then( () => {
			// Todo - what should we do here?  We don't want lock to navigate us away from the KARMA test runner...
			//!KARMA && this.lock.logout({returnTo: returnToUrl})
			!KARMA && this.auth0Client.logout({returnTo: returnToUrl});
		});

		// Clear user token and profile data from localStorage
		this.idToken = null;
		this.clearAccessToken();

		this.callbacks.onLoggedOut();

		//!KARMA && routing && routing.push(`/${slugs.logout}`);
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

	async loginWithPassword(username: string, password: string, audience: string) {
		const authResult: any = await xhr.post(`https://${window.conning.globals.authDomain}/oauth/token`, {
			client_id:  window.conning.globals.authClientId,
			realm:      'Username-Password-Authentication',
			grant_type: "http://auth0.com/oauth/grant-type/password-realm",
			username:   username,
			password:   password,
			scope:      SCOPES,
			audience:   audience
		});

		this.setAccessToken(authResult.access_token);
		this.idToken = authResult.id_token;
	}
}