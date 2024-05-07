import {get as _get} from 'lodash';
import {
    observable,
    action,
    reaction,
    computed,
    runInAction,
    makeObservable,
} from 'mobx';
import {api, i18n} from 'stores';
import type {SiteHeader} from './models';
import {routing} from 'stores/routing';
import {Intent, IToaster} from "@blueprintjs/core";
import {MockToaster} from './MockToaster';
import {SiteActions} from "./SiteActions";
import {logException} from "utility";

export interface ConfirmationOptions {
	message: string;
	type: 'info' | 'delete';
}

export const SystemTool = {
	queryTool: {name: 'Query Tool', icon: 'search'}
}

export enum ActiveTool {
	query,
	preferences,
	simulation,
	ioRun,
	io,
	userFile,
	climateRiskAnalysis,
	report,
	user,
	billing,
	notifications
}

export interface ApplicationPageGlobals {
	tool?: ActiveTool,
	tag?: () => any,
	headerContextMenuProps?: () => any,
	activeItem?: any,
	applicationButtonText?: () => string,
	breadcrumbs?: () => React.ReactNode[],
	afterBreadcrumbs?: () => React.ReactNode[] | React.ReactNode,
	breadcrumbsRight?: () => React.ReactNode[] | React.ReactNode,
	title?: () => string,  // Title in chrome tab
	renderTitle?: () => React.ReactNode[] | React.ReactNode | string,
	renderApplicationMenuItems?: () => React.ReactNode[] | React.ReactNode,
	renderExtraSettingsMenuItems?: () => React.ReactNode[] | React.ReactNode,
	renderMenuItems?: () => React.ReactNode[] | React.ReactNode,
	renderHeaderToolbarItems?: () => React.ReactNode[] | React.ReactNode,
	renderHeaderToolbarItemsRight?: () => React.ReactNode[] | React.ReactNode,
	renderToolbar?: () => React.ReactNode[] | React.ReactNode,
	renderFooter?: () => React.ReactNode[] | React.ReactNode,
	loadingMessage?: string;
}

export const defaultAppGlobals = {
	title:                         () => { try { return site.productName } catch { return "" } },
	tool:                          null,
	tag:                           null,
	headerContextMenuProps:        null,
	activeItem:                    null,
	applicationButtonText:         null,
	breadcrumbs:                   null,
	afterBreadcrumbs:              null,
	breadcrumbsRight:              null,
	renderTitle:                   null,
	renderApplicationMenuItems:    null,
	renderExtraSettingsMenuItems:  null,
	renderMenuItems:               null,
	renderHeaderToolbarItems:      null,
	renderHeaderToolbarItemsRight: null,
	renderToolbar:                 null,
	renderFooter:                  null
};

export class SiteStore {

	readonly versionClient = VERSION;
	toaster: IToaster      = new MockToaster();

	actions                         = new SiteActions();
	@observable overrideErrorDialog = false;
	@observable inGlobalDragOver    = false;
	@observable searchText: string  = "";  // Global searchers

	get productName() {
		return window.conning.globals.product;
	}

	@computed get searchTextRegex(): RegExp {
		const {searchText} = this;
		if (!searchText || searchText == '') return undefined;

		return new RegExp(api.utility.escapeRegExp(searchText), 'i');
	}

	@computed get searchWords(): string[] {
		const {searchText} = this;

		return searchText ? this.searchText.split(' ') : [];
	}

	@computed get copyrightNotice(): string {
		const { BUILD_UTC_TIME = Date.now() } = this.CompileTimeInformation;
		const date = new Date(typeof BUILD_UTC_TIME !== 'number' ? parseFloat(BUILD_UTC_TIME) : BUILD_UTC_TIME);
		const year = date.getFullYear();

		return `© ${year} by Conning, Inc.`;
	}

	searchTextMatch = (text: string) => {
		const {searchText, searchTextRegex} = this;

		return searchTextRegex == undefined ? undefined : _.some(text.split(' '), w => searchTextRegex.exec(w) != null)
	}

	@action setPageHeader = (label: string, isEditable = false) => {
		this.activeTool.renderTitle = this.activeTool.title = action(() => label);
	}

	@observable.deep activeTool: ApplicationPageGlobals = defaultAppGlobals;

	@observable.ref dialogFn?: () => React.ReactNode;

	get features() {
		return {...window.conning.globals.features};
	}

	setDialogFn = (fn: () => React.ReactNode) => {
		if (this.dialogFn !== fn) {
			setTimeout(action(() => this.dialogFn = fn), 30);
		}
	}

	@observable.struct header: SiteHeader = {
		editable: false,
		editing:  false,
		loading:  false,
		type:     null,
		status:   null,
		id:       null
	}

	@observable errorPageMessage?: string = "";

	// Extra classes to apply to the root application tag
	@observable applicationClasses        = observable.array<string>();
	@observable verticalScrollbarWidth    = 0;
	@observable horizontalScrollbarHeight = 0;
	@observable mouseButtons              = 0;
	@observable _busy:boolean             = false;
	@observable errors                    = observable.array<Error>();

	@computed get busy() { return this._busy; }
	set busy(status:boolean) {
		const _this = this;
		action(() => _this._busy = status)();
	}

	loadingText = (objectTypeName: string) => i18n.intl.formatMessage({defaultMessage: "Your {objectTypeName} is loading...", description: "[SiteStore] application message when item is loading"}, {objectTypeName});
	errorText = (objectTypeName: string) => i18n.intl.formatMessage({defaultMessage: "An error occurred while trying to load {objectTypeName} data.", description: "[SiteStore] application message when item is failed to load"}, {objectTypeName});

	closeConfirm          = () => Promise.resolve(true);
	confirm: (
		message: string | React.ReactNode,
		description?: string | React.ReactNode,
		icon?: React.ReactNode,
		okLabel?: string,
		cancelLabel?: string
	) => Promise<boolean> = () => Promise.resolve(true);

	messageBox: (
		message: string | React.ReactNode,
		description?: string | React.ReactNode,
		icon?: React.ReactNode,
		okLabel?: string,
	) => Promise<void> = () => Promise.resolve();

	// @action confirm = (message: string | ConfirmationOptions) => {
	// 	if (typeof message === 'string') {
	// 		return window.confirm(message);
	// 	} else {
	// 		const {preferences} = userStore;
	//
	// 		if (message.type === 'delete' && !preferences.confirmDeleteActions) {
	// 			console.log(message);
	// 			return true;
	// 		}
	//
	// 		return window.confirm(message.message);
	// 	}
	// }

	constructor() {
        makeObservable(this);
        reaction(() => this.busy, this.onBusy, {name: 'Update busy cursor'})
	}

	onBusy = (busy) => {
		if (document) {
			let $body = $(document.body);

			if (busy) {
				$body.addClass('busy')
				$body.css('cursor', 'busy')
			} else {
				$body.removeClass('busy');
				$body.css('cursor', '')
			}
		}
	}

	@action routeToErrorPage = (message: string, err?: Error) => {
		err && site.raiseError(err);
		this.errorPageMessage = message;
		routing.push(routing.urls.errorPage);
	}

	// @observable _systemInformation: SystemInformation;
	// @computed get systemInformation(): SystemInformation {
	// 	if (this._systemInformation) {
	// 		return this._systemInformation;
	// 	}
	// 	else {
	// 		xhr.get(`${window.location.protocol}//${window.location.host}/api/system-information`).then((systemInfo: SystemInformation) => {
	// 			this._systemInformation = systemInfo;
	// 			if (systemInfo.rethinkDb.serverError) {
	// 				routing.push({pathname: this.auth.isInRole('admin') ? routing.urls.preferences : routing.urls.home});
	//
	// 				const message = `${PRODUCT} is misconfigured.<br/>The database '${systemInfo.rethinkDb.database}' does not exist or the server is down.<br/>Please contact your administrator.`;
	//
	// 				this.toaster.show({message: message, intent: this.Intent.WARNING})
	// 			}
	// 			else if (systemInfo.dbVersion !== systemInfo.serverVersion) {
	// 				if (this.auth.isInRole('admin')) {
	// 					if (NODE_ENV === Environments.Production) {
	// 						routing.push({pathname: routing.urls.preferences});
	// 						this.toaster.show({
	// 							message: `You ${PRODUCT} requires an update.<br/>Database version ${systemInfo.dbVersion} does not match server version ${systemInfo.serverVersion}).`,
	// 							intent:  this.Intent.WARNING
	// 						})
	// 					}
	// 				}
	// 			}
	// 		});
	//
	// 		return null;
	// 	}
	// }

	get isMultiTenant() {
		return _get(window, ['conning', 'globals', 'multiTenant'], false);
	}

	get isOnPrem() {
		return _get(window, ['conning', 'globals', 'isOnPrem'], false);
	}
	get isInElectron() {
		return window && window.process && window.process.type
	}

	raiseError = (
		error: Error,
		part?: undefined | 'rethink' | 'auth' | 'julia' | 'query' | 'report' | 'simulation' | 'userFile',
		extraInfo?: string | any,
		showToast = true,
		toastTimeout = 10000
	) => {
		logException(error, extraInfo);

		// runInAction: raiseError
		runInAction(() => {
			this.overrideErrorDialog = false;

			//console.error(error);
			if (extraInfo) {
				if (KARMA)
					console.error('    ' + JSON.stringify(extraInfo));
			}

			if (error.stack) {
				//	console.log(error.stack);
			}

			// if (part === "rethink") {
			// 	db.connected = false;
			// }

			if (PLATFORM === 'client' && showToast) {
				if (this.toaster) {
					const respBody = (error as any)?.response?.body;
					const toaster = this.toaster;

					if (respBody instanceof Blob) {
						const blobReader = new FileReader();
						blobReader.onload = () => {
							toaster.show({
								icon:    "warning-sign",
								timeout: toastTimeout,
								message: blobReader.result,
								intent:  Intent.DANGER
							});
						}
						blobReader.readAsText(respBody);
					} else {
						toaster.show({
							icon:    "warning-sign",
							timeout: toastTimeout,
							message: respBody || error.message,
							intent:  Intent.DANGER
						});
					}
				}
				else {
					console.warn('No toaster available to write to')
					console.error(error.message);
				}
			}

			this.errors.push(error);
		});
	}

	uploadInput: HTMLInputElement;
	openFileChooser = () => {
		const {uploadInput} = this;
		uploadInput && uploadInput.click();
	}

	CompileTimeInformation = {
		VERSION:                  VERSION,
		NODE_ENV:                 NODE_ENV,
		SPRINT:                   SPRINT,
		IS_PROD:                  IS_PROD,
		BUILD_USER:               BUILD_USER,
		GIT_BRANCH:               GIT_BRANCH,
		PLATFORM:                 PLATFORM,
		SHOW_ERROR_NOTIFICATIONS: SHOW_ERROR_NOTIFICATIONS,
		KARMA:                    KARMA,
		ADVISE_JULIA_SERVER:      ADVISE_JULIA_SERVER,
		CONSOLE_NOTIFY:           CONSOLE_NOTIFY,
		BUILD_PLATFORM:           BUILD_PLATFORM,
		DEV_BUILD:                DEV_BUILD,
		BUILD_DIRECTORY:          BUILD_DIRECTORY,
		BUILD_UTC_TIME:           BUILD_UTC_TIME
	}

	titles = {
		preferencesPage: 'User Preferences'
	}
	// overrideConsoleToShowToasts = () => {
	// 	if (CONSOLE_NOTIFY && window.console) {
	// 		const {defaultNotificationOptions} = this;
	//
	// 		if (console.log) {
	// 			const logFn = console.log;
	// 			console.log = function () {
	// 				toastr.info(_.join(arguments, '\n'), "", defaultNotificationOptions);
	// 				logFn.apply(this, arguments)
	// 			}
	// 		}
	//
	// 		if (console.warn) {
	// 			const warningFn = console.warn;
	// 			console.warn    = function () {
	// 				toastr.warning(_.join(arguments, '\n'), "", defaultNotificationOptions);
	// 				warningFn.apply(this, arguments)
	// 			}
	// 		}
	//
	// 		if (console.error) {
	// 			const errorFn = console.error;
	// 			console.error = function () {
	// 				toastr.error(_.join(arguments, '\n'), "", defaultNotificationOptions);
	// 				errorFn.apply(this, arguments)
	// 			}
	// 		}
	// 	}
	// }
}

export const site = new SiteStore();

export type SiteLocation = 'header' | 'tab' | 'sidebar' | 'builder' | 'card' | 'browser';

export const asyncSiteLoading = function asyncSiteLoading(wrappedFunc): any {
	return async function(...args) {
		try {
			site.busy = true;
			return await wrappedFunc.apply(this, args);
		} finally {
			site.busy = false;
		}
	};
};