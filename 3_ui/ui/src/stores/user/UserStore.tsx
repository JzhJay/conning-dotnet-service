import gql from 'graphql-tag';
import {apolloStore} from '../index';
import type { UserSettings } from './UserSettings';
import { DEFAULT_USER_SETTINGS } from './UserSettings';
import {
    observable,
    toJS,
    autorun,
    action,
    runInAction,
    computed,
    reaction,
    makeObservable,
} from 'mobx';
import {localStorageKeys, site} from '../site';
import type { JuliaUser, License } from './User';
import { xhr } from 'stores/xhr';
import {julia} from 'stores/julia'
import {routing} from 'stores/routing'
import * as React from "react";
import * as utility from 'utility';

export type Role = "admin" | "user" | "manager";

import type {AppMetadata, AuthProvider, UserStandardProfile} from './AuthProvider/AuthProvider';
import { createProvider} from './AuthProvider/AuthProvider';
import { ErrorTracking } from 'client/tracking';

export enum UserPdfLogoOptions {
	none = 'none',
	conning = 'conning',
	custom = 'custom'
};

export class UserStore {
	@observable.ref profileJSON;
	@observable.deep settings?: UserSettings    = {};
	@observable appMetadata: AppMetadata       = {};
	authProvider: AuthProvider                  = null;
	@observable loading: Promise<JuliaUser[]>   = null;
	@observable loadError                       = false;
	@observable users                           = observable.map<string, JuliaUser>({}, {deep: false});
	@observable hasLoadedUsers                  = false;
	@observable license: License                = null;

	constructor() {
		makeObservable(this);
		const authProvider = _.get(window, ['conning', 'globals', 'authProvider'], 'auth0') as 'auth0' | 'keycloak';
		this.authProvider = createProvider({
			providerType: authProvider,
			productName: site.productName,
			callbacks: {
				onLoggedOut: this.onLoggedOut,
				onLoggedIn: this.onLoggedIn,
			}
		});
		this.settings = this.loadPreferencesFromLocalStorage();

        if (this.accessToken) {
			// UserStore and xhr depends on each other, need to defer the request of loading profile
			_.defer(()=> {
				this.loadProfile();
			});
		}
	}

	set profile(value: UserStandardProfile) {
		const json = JSON.stringify(value);
		localStorage.setItem('profile', json);
		this.profileJSON = json;
	}

	@computed get profile() : UserStandardProfile {
		const { profileJSON } = this; // Trigger update if current user is updated.

		if (!this.isLoggedIn) {
			return null;
		}
		else {
			// Retrieves the profile data from localStorage
			const profileJSON = localStorage.getItem('profile')
			const profile     = profileJSON ? JSON.parse(profileJSON) as UserStandardProfile : null

			return profile;
		}
	}

	onPreferencesChanged = (updateDatabase = true) => {
		const {settings} = this;
		const jsSettings = toJS(settings);

		if (updateDatabase) {
			this.updateUserMetadata();
			console.debug('Updated settings', jsSettings);
		}
		localStorage[localStorageKeys.userPreferences] = JSON.stringify(jsSettings);
	};

	private loadPreferencesFromLocalStorage(): UserSettings {
		// Load user preferences from local storage
		let savedPreferences = null;
		try {
			savedPreferences = JSON.parse(localStorage[localStorageKeys.userPreferences]);
		}
		catch (error) {
			localStorage[localStorageKeys.userPreferences] = JSON.stringify(DEFAULT_USER_SETTINGS)
		}
		return _.merge({}, DEFAULT_USER_SETTINGS, savedPreferences)
	}

	get dotNetUserRoute() {
		const host = location.host;
		return`${location.protocol}//${host}/api/user`;
	}

	get dotNetLicenseRoute() {
		const host = location.host;
		return`${location.protocol}//${host}/api/license`;
	}

	@action reset() {
		this.users.clear();
		this.loadError      = false;
		this.hasLoadedUsers = false;
	}

	// TODO Move license to class
	@computed get customerName() {
		return this.license ? this.license.features.Product : window.conning.globals["customerName"];
	}

	@computed get isLicenseLoaded() {
		return this.license != null;
	}

	@computed get isIOLicensed() {
		return this.license && _.some(this.license.features.Options, option => option === "Investment_Optimizer" || option === "Allocation_Optimizer");
	}

	@computed get isCRALicensed() {
		return this.isFeatureEnabled("cra");
	}

	@computed get isRSSimulationLicensed() {
		/* 2.4, 2.5 without GEMS only mode, if add auth on user, the E2E test will fail.*/
		if (this.isE2ETesting) {
			return true;
		}
		return this.isFeatureEnabled("grw") || this.isFeatureEnabled("simulation:gems");
	}

	@computed get isFIRMLicensed() {
		return this.isFeatureEnabled("simulation:firm");
	}

	@computed get isESGLicensed() {
		return this.isRSSimulationLicensed || this.isFIRMLicensed;
	}

	get enableGEMSOnlyMode() {
		if (this.isE2ETesting) {
			return false;
		}
		return this.isRSSimulationLicensed && site.isMultiTenant &&
			_.every(this.features, feature => feature.indexOf("feature:simulation:gems") == 0 || feature.indexOf("feature:grw") == 0);
	}

	get isE2ETesting() {
		const customerName = _.get(window, ['conning', 'globals', 'customerName']);
		return customerName === 'End-to-End Testing';
	}

	get tenantName() {
		const groups = _.get(this.profile, ['appMetadata', 'authorization', 'groups'], []);
		const tenantName = groups.find((groupName) => groupName.indexOf('tenant:') === 0) || '';
		return tenantName ? tenantName.replace('tenant:', '') : 'conning';
	}

	get features(): string[] {
		return this.profile?.appMetadata?.authorization?.permissions ? this.profile.appMetadata?.authorization?.permissions.filter(p => p.indexOf(`feature:`) == 0) : [];
	}

	isFeatureEnabled(feature): boolean {
		return this.features.indexOf(`feature:${feature}`) >= 0;
	}

	get isDeveloper(): boolean {
		return this.profile?.appMetadata?.authorization?.permissions ? this.profile.appMetadata?.authorization?.permissions.indexOf("developer") != -1 : false;
	}

	loadLicense = async () => {
		try {
			const license = await xhr.get<License>(`${julia.url}/v1/license/json`);
			action( () => this.license = license)();
		}
		finally {
			// Wrap in finally to ensure that alert can still be shown even if there is an error above. e.g. From a MobX reaction being triggered from license update.
			if (this.license == null || this.license.customer == "unknown")
				alert('Invalid or missing license.');
		}
	};

	loadDescriptors = action((): Promise<JuliaUser[]> => {
		if (!this.loading) {
			this.reset();
			this.loadError = false;

			return apolloStore.client.query<UserGraph>({
				query:        gql`
					query loadUsers {
						user {
							find {
								users {
									email
									fullName
									_id
								}
							}
						}
					}
				`,
				fetchPolicy:  'network-only'
			}).then((res) => {
				const users = res.data.user.find.users;
				// runInAction: User Descriptors were Loaded
				return runInAction(() => {

					this.loading = null;
					users.forEach(u => this.users.set(u._id, u));
					this.hasLoadedUsers = true;
					return users;
				})
			})
		}

		return this.loading;
	});

	@action('Load a specific user by ID') loadDescriptor = (id: string): Promise<JuliaUser> => {
		return apolloStore.client.query<UserGraph>({
			query: gql`
					query loadUsers($id: ID!) {
						user {
							find(id: $id) {
								users {
									email
									fullName
									_id
								}
							}
						}
					}
				`,
			variables: {id: id},
			fetchPolicy:  'network-only'
		}).then((res) => {
			const result_users = res.data.user.find.users?.filter( u => u._id == id);
			if (!result_users?.length) {
				throw new Error(`user ${id} not found`);
			} else {
				this.users.set(id, result_users[0]);
				return result_users[0];
			}
		});
	}

	ACCESS_TOKEN = "accessToken";
	// Do not make this a computable. expiration needs to be computed on every request.
	get accessToken() {
		return this.authProvider.accessToken;
	}

	/**
	 * Returns a computed that can be used to react to access token changes. Should NOT be used to retrieve the underlying access token value.
	 */
	@computed get accessTokenObservable() {
		return this.authProvider.accessTokenObservable;
	}

	async waitToken() {
		if (this.accessToken == null) {
			await new Promise<void>((accept, reject) => {
				reaction(() => this.accessTokenObservable, () => {
					// Trigger/resume when we have a valid access token.
					if (this.accessToken) {
						accept();
					}
				})
			})
		}
	}

	VALIDATION_ID = "x-conning-validation-id";
	LOCALE = "x-conning-locale";
	LANGUAGE = "x-conning-language";

	get validationId() { return localStorage.getItem(this.VALIDATION_ID) }

	set validationId(value) {
		localStorage.setItem(this.VALIDATION_ID, value)
	}

	@action('User Profile loaded') profileLoaded = (profile: UserStandardProfile) => {
		this.profile                        = profile;
		const {userMetadata, appMetadata} = profile;

		let newSettings = toJS(this.settings) as any;
		userMetadata && _.assign(newSettings, userMetadata.ui); // need to discuss change merge to assign

		if (!utility.deepEqJSON(this.settings, newSettings)) {
			Object.assign(this.settings, newSettings);

			// I think this update is meant to push new defaults up to the profile???
			this.updateUserMetadata();
		}

		if (appMetadata) {
			Object.assign(this.appMetadata, appMetadata);
		}

		ErrorTracking.setUserContext({
			email:    profile.email,
			username: profile.name
		})

		let firstRun = true;
		!KARMA && autorun(() => {
			// Ignore the initial autorun trigger and only update database on actual changes.
			this.onPreferencesChanged(!firstRun);
			firstRun = false;
		}, {name: 'Watch for changes to user preferences'});
	}

	updateUserMetadata = _.debounce(async (updateUserMetadata?) => {
		const { settings: prefs, profile} = this;
		if (profile) {
			const newPrefs = updateUserMetadata || Object.assign({}, profile.userMetadata, { ui: prefs });

			try {
				await xhr.post<any>(`${this.dotNetUserRoute}/userMetadata`, newPrefs);
				this.profile = Object.assign({}, this.profile, {userMetadata: newPrefs});
			} catch(error) {
				if (error.error) {
					site.raiseError(error.error);
				}
			}
		}
	}, 500, {leading: false, trailing: true});

	loadProfile = async () => {
		if (!this.isLoggedIn) {
			return;
		}

		try {
			const profile = await xhr.get<any>(`${this.dotNetUserRoute}/profile`);

			if (profile) {
				if (profile.userMetadata && profile.userMetadata.name != null) {
					profile.name = profile.userMetadata.name;
				}

				this.profileLoaded(profile);
			}
		} catch(error) {
			if (site && error) {
				site.raiseError(new Error(error.error || error), 'auth');
			}
		}
	}

	clientUrlFor = (user: JuliaUser) => {
		return `${routing.urls.userBrowser}${user.email}`;
	}

	login() {
		return this.authProvider.login();
	}

	logout() {
		return this.authProvider.logout();
	}

	onLoggedIn = () => {
		this.loadProfile();
	}

	onLoggedOut = () => {
		localStorage.removeItem(this.VALIDATION_ID);

		julia && julia.resetStores(false);

		localStorage.removeItem('profile');
		ErrorTracking.setUserContext(null)
	}

	@computed get currentUser() {
		return this.profile;
	}

	@computed get isLoggingIn() {
		return this.authProvider.isLoggingIn;
	}

	@computed get cancelledLogin() {
		return this.authProvider.isLoginCancelled;
	}

	@computed get isLoggedIn() {
		return this.authProvider.isLoggedIn;
	}

	private _clearProfile = () => {
		localStorage.removeItem('profile');
	}

	isInRole = (role: Role) => {
		return this.isLoggedIn
			&& (role === 'admin' ? !IS_PROD : true);
	}

	get forceMFA() {
		const forceMFA = _.get(this.profile, 'appMetadata.forceMFA', false);
		if (forceMFA) {
			return JSON.parse(forceMFA);
		}
		return false;
	}

	get enableMFA() {
		return this.forceMFA || this.settings.enableMFA;
	}

	get region() {
		if (this.settings.region) {
			return this.settings.region;
		}
		// https://stackoverflow.com/questions/39213855/getting-the-users-region-with-navigator-language
		const re = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
		const browserLanguage = window.navigator["userLanguage"] || window.navigator.language;
		return re.exec(browserLanguage)[5];
	}

	get language() {
		if (this.settings.language) {
			return this.settings.language;
		}

		return "en-US";
	}

	getPdfReportLogoStyle = (): UserPdfLogoOptions => {
		return _.get(this.profile.userMetadata, ['ui', 'report', 'logoStyle'], UserPdfLogoOptions.none);
	}

	getPdfReportCustomLogo = () => {
		return localStorage.getItem('pdfReportLogoImgUrl') || '';
	}

	setPdfReportCustomLogo = (imgUrl) => {
		localStorage.setItem('pdfReportLogoImgUrl', imgUrl);
	}

	getLicense = async(): Promise<License> => {
		try {
			return await xhr.get<License>(this.dotNetLicenseRoute, { shouldAddToken : false });
		} catch(error) {
			if (site && error) {
				console.error(error)
				site.raiseError(new Error('Cannot get license information.'), 'auth');
			}
		}
	}

	updateLicense = async(fileInput): Promise<License> => {
		try {
			const formData = new FormData();
			formData.append('file', fileInput.files[0]);
			return await xhr.post<License>(`${julia.url}/v1/license/lic`, formData, { shouldAddToken : false });
		} catch(error) {
			if (site && error) {
				console.error(error)
				site.raiseError(new Error('Cannot update license.'), 'auth');
			}
			throw error;
		}
	}
}

export interface IUserResult {
	users?: Array<JuliaUser & any>;
	page?: number;
	perPage: number;
	sortBy: string;
}

interface UserGraph {
	user: {
		find?: IUserResult
	}
}

export const user = new UserStore();
