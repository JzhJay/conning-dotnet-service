import type {Validation} from '../../components/system/inputSpecification/models';
import {buildURL, BaseEventSource, add, multiple} from '../../utility';
import {Book} from '../book/Book';
import {BookView} from '../book/BookView';
import {BookPage} from '../book/BookPage';
import {ApiPage} from '../book/model';
import type { FinancialDamageAndVolatilityShockOutput, ClimateRiskAnalysisInputState,
	JuliaClimateRiskAnalysis,
	ClimateRiskAnalysisGuid,
	DistributionsAtHorizonOutput,
	MarketValueStatisticsOutput,
	ThroughTimeStatisticsOutput, Transformation
} from './'
import { action, computed, observable, runInAction, when, makeObservable, flow } from 'mobx';
import type { IChartingResult, ConningUser, ValidationMessage, OmdbUserTagValue } from 'stores';
import {
	xhr,
	site,
	utility,
	routing,
	settings,
	user,
	climateRiskAnalysisStore,
	HighchartsHelper,
	ObjectNameChecker, omdb, ioStore, i18n
} from 'stores';
import {ContextMenu, Menu, MenuItem} from '@blueprintjs/core';
import type {LoadingStatusMessage} from 'ui/src/components';
import {ServerStatus} from '../../components/system/ExpireDialog/ExpireDialog';
import * as React from "react";
import {ErrorMessageHandler} from 'common/ErrorMessageHandler';

export enum ClimateRiskAnalysisStatus {
	waiting = "Waiting",
	running = "Running",
	complete = "Complete",
	failed = "Failed",
	cancelled = "Cancelled",
	serverCreated = "ServerCreated"
}

export class ClimateRiskAnalysis implements JuliaClimateRiskAnalysis, IChartingResult {
	static ObjectType = 'ClimateRiskAnalysis';
	static get OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "Climate Risk Analysis", description: "objectName - ClimateRiskAnalysis (single)"}) };
	static get OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "Climate Risk Analyses", description: "objectName - ClimateRiskAnalysis (multi)"}) };

	constructor(climateRiskAnalysis: JuliaClimateRiskAnalysis) {
		makeObservable(this);
        Object.assign(this, climateRiskAnalysis);
        this.book = new Book(this.defaultUserOptions, this.availableViews, this.sendPageUpdate.bind(this), () => this.isLoaded, this.clientUrl);

        const cachedClimateRiskAnalyses = climateRiskAnalysisStore.climateRiskAnalyses.get(this.id);
        if (cachedClimateRiskAnalyses) {
			Object.assign(cachedClimateRiskAnalyses, climateRiskAnalysis); // Update partial data to prevent some ClimateRiskAnalysis pages are re-rendered because all statuses of ClimateRiskAnalysis are reseted
		} else {
			climateRiskAnalysisStore.climateRiskAnalyses.set(this.id, this);
		}
    }

	_id: ClimateRiskAnalysisGuid;
	get id() { return this._id }
	connectionID: string;

	@observable _status: ClimateRiskAnalysisStatus = null;
	@observable serverStatus: ServerStatus  = ServerStatus.notInitialized;
	@observable _userInputLastSavedTime: Date = null;
	@observable _userInputLastUpdateTime: Date = null;
	@observable isReconnecting;

	@observable name: string;
	@observable description: string;
	@observable userTagValues: OmdbUserTagValue[];
	@observable comments: string;

	@observable createdTime: string;
	@observable modifiedTime: string;
	createdBy: ConningUser;
	@observable modifiedBy: ConningUser;
	@observable silentLock = false; // Set when changing simulations.

	//pages = []; //IOPage[] = [];
	book: Book;

	@observable inputState: ClimateRiskAnalysisInputState = null;

	@observable output: {
		distributionsAtHorizon?: DistributionsAtHorizonOutput;
		marketValueStatistics?: { [viewId: string]: MarketValueStatisticsOutput };
		throughTimeStatistics?: ThroughTimeStatisticsOutput;
		financialDamageAndVolatilityShock?: FinancialDamageAndVolatilityShockOutput[];
	} = {
	};


	@observable runRequired: boolean;
	@observable statusMessages: {type: string, label: string, currentMessage: string, progress: {numerator: number, denominator: number}}[] = [];

	@observable errorMessageHandler = new ErrorMessageHandler();//["Fatal error encountered during Optimization", "Grid error - be sure grid is turned on"];
	//@observable silentLock = false;

	@observable isLoading = false;
	@observable isLoaded = false;
	@observable isDuplicating = false;
	@observable isReady = false;
	@observable isLoadFailed = false;
	sessionID: string = null;


	highcharts = new HighchartsHelper(this);

	_toDispose = [];
	eventSource = null;

	static apiUrlFor(id: ClimateRiskAnalysisGuid) {
		return `${climateRiskAnalysisStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return ClimateRiskAnalysis.apiUrlFor(this.id);
	}

	static get browserUrl() { return routing.urls.climateRiskAnalysisBrowser; }

	static urlFor(id: ClimateRiskAnalysisGuid) {
		return `${ClimateRiskAnalysis.browserUrl}/${id ? id : ''}`;
	}

	get clientUrl() {
		return ClimateRiskAnalysis.urlFor(this.id)
	}

	get eventSourceUrl() {
		return buildURL(`${this.apiUrl}/status`,
			{sessionId: this.sessionID},
			{[user.VALIDATION_ID]: user.validationId},
			{['accessToken']: user.accessToken});
	}

	get icon() {
		return 'target'
	}

	get defaultUserOptions() {
		return climateRiskAnalysisStore.defaultUserOptions;
	}

	get availableViews() {
		return climateRiskAnalysisStore.views;
	}

	navigateTo = () => { routing.push(this.clientUrl)}

	static delete     = async (climateRiskAnalysis: JuliaClimateRiskAnalysis, force = false, soft = false, callback = null) => {
		const {name, _id} = climateRiskAnalysis;
		if (force || KARMA || (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(ClimateRiskAnalysis.OBJECT_NAME_SINGLE, name)))) {
			// runInAction: Deleting ClimateRiskAnalysis
			return runInAction(async () => {
				try {
					site.busy = true;
					await xhr.delete(ClimateRiskAnalysis.apiUrlFor(climateRiskAnalysis._id) + (soft ? "?soft" : ""));
					if (callback) {
						callback(true);
					}

					if (climateRiskAnalysisStore.climateRiskAnalyses.has(_id)) {
						climateRiskAnalysisStore.climateRiskAnalyses.get(_id).cleanup();
						climateRiskAnalysisStore.climateRiskAnalyses.delete(_id); // only delete entry after server deletes
					}
					return true;
				}
				catch (err) {
					if (callback) {
						callback(false);
					}
					throw err
				}
				finally {
					site.busy = false;
				}
				return  false;
			})
		}
	}

	static duplicate = async (climateRiskAnalysis: JuliaClimateRiskAnalysis) => {
		const newName = await new ObjectNameChecker({nameForCopyObject: true}).getAvailableName(ClimateRiskAnalysis.ObjectType, climateRiskAnalysis.name);
		return xhr.get(`${ClimateRiskAnalysis.apiUrlFor(climateRiskAnalysis._id)}/clone?name=${encodeURIComponent(newName)}`);
	}

	static exportReturns = async (climateRiskAnalysis: JuliaClimateRiskAnalysis) => {
		try {
			site.busy = true;

			await user.waitToken(); // await valid token
			let separators: any = utility.getCsvSeparators(user.region);
			separators = separators ? JSON.stringify(separators) : null;
			await utility.downloadFile(`${ClimateRiskAnalysis.apiUrlFor(climateRiskAnalysis._id)}/export-returns` + `?separators=${separators}`);

		}
		finally {
			site.busy = false;
		}
	}

	@action rename = async (name: string) => {
		this.name = name;
		const updates = await omdb.updatePartial(ClimateRiskAnalysis.ObjectType, this._id, {name});
		const model = ioStore.ios.get(this.id);
		if (this.name == model?.name && updates?.name == model?.name) {
			_.assign(model, updates);
		}
	}

	@observable renamingFrom: 'sidebar' | 'header' | null = null;
	@action cancelRename                                  = () => this.renamingFrom = null;
	@action confirmRename = async (value: string) => {
		alert("NYI")
	}

	static rename = async (climateRiskAnalysis: JuliaClimateRiskAnalysis, name: string) => {
		alert("NYI");
	}

	@observable locked:boolean;
	@computed get inputsLocked() {
		return this.locked === true;
	}
	set inputsLocked(locked) {
		runInAction(() => this.locked = locked === true);
		omdb.updatePartial(ClimateRiskAnalysis.ObjectType, this._id, {locked})
	}

	_loadTimer = null;
	@action async loadExistingClimateRiskAnalysis() {
		this.isLoading = true;
		this.isLoadFailed = false;

		try {
			this.initEventSource();
			this.sessionID = await xhr.get(this.apiUrl + '/startup');
			await when(() => this.serverStatus == ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout
			runInAction(() => {
				this.isReady = true;
				this.runRequired = this.status == ClimateRiskAnalysisStatus.waiting;
			});
			//await this.sessionExtend();

			//this.setupListeners();
			await this.loadInputState();

			if (this.book.pages != null && this.book.pages.length > 0)
				this.book.currentPageNumber = routing.query.page ? parseInt(routing.query.page as string) - 1 : 0;

		} catch(e) {
			runInAction(() => {
				this.isLoadFailed = true;
			});
			throw e;
		} finally {
			runInAction(() => {
				this.isLoaded = true;
				this.isLoading = false;
			});
			clearTimeout(this._loadTimer);
		}
	}

	@observable loadingStatusMessages: LoadingStatusMessage[] = [];

	initEventSource = () => {
		this.loadingStatusMessages = [];
		if (!this.eventSource) {
			this.eventSource = new BaseEventSource({
				url: this.eventSourceUrl,
				onMessage: this.onRecieveEventSourceMessage,
				onError: () => {
					this.eventSource.setEventSourceUrl(this.eventSourceUrl);
				}
			});
		}
	}

	@action onRecieveEventSourceMessage = async (event) => {
		const climateRiskAnalysis = this;
		const data = JSON.parse(event.data);
		climateRiskAnalysis.loadingStatusMessages.push(data);

		if (data.type == "status") {
			if(data.subtype == "Server") {
				climateRiskAnalysis.serverStatus = data.data as ServerStatus;
				if (climateRiskAnalysis.serverStatus === ServerStatus.closed) {
					this.eventSource.dispose();
				}
			}
			else{
				climateRiskAnalysis.status = data.data;
				if (data.additionalData) {
					const additionalData = JSON.parse(data.additionalData);
					const locked = _.get(additionalData, "locked");
					if (_.isBoolean(locked)) {
						this.locked = locked;
					}
				}
			}

		} else if (data.type == "statusMessages") {
			if (data.messages.errorMessages)
				climateRiskAnalysis.errorMessageHandler.updateErrorMessage(data.messages.errorMessages);

			climateRiskAnalysis.statusMessages = data.messages.statusMessages;
		}
	}

	setupListeners() {
	}

	@action run = async (shouldUpdateViews = true, mock = false) => {
		try {
			site.busy = true;
			this.errorMessageHandler.updateErrorMessage([]);
			await xhr.post(this.apiUrl, null, {allowRetry: true});
			await when(this.isRunning);

			runInAction(() => {
				this.invalidatePageCache();

				if (!this.book.currentPage.hasOuputView) {
					const firstPageWithOutputView = this.book.pages.findIndex(p => p.hasOuputView);
					firstPageWithOutputView && this.book.navigateToPage(firstPageWithOutputView);
				}

				this.runRequired = false;
				this.output = {};
			})
		}
		finally {
			site.busy = false;
		}
	}

	@action cancel = async () => {
		try {
			site.busy = true;
			await xhr.post(this.apiUrl + '/cancel?connection-id=' + this.connectionID, {});
		}
		finally {
			site.busy = false;
		}
	}

	@computed get status(): ClimateRiskAnalysisStatus {
		return this._status;
	}
	set status(newStatus: ClimateRiskAnalysisStatus) {
		runInAction(() => {
			this._status = newStatus;
		})
	}

	@computed get userInputLastSavedTime():Date {
		return this._userInputLastSavedTime;
	}


	get blockedRunMessage() {
		if (_.some(this.validations, v => v.errorType == "Error")) {
			return "Validation errors must be resolved before running";
		}
		return this.status == ClimateRiskAnalysisStatus.running ? "Cannot re-run while run is in progress" :
		       this.status == ClimateRiskAnalysisStatus.complete && !this.runRequired ? "There are no new changes to apply" :
		                      !this.book.hasPages ? "No pages available" : null;
	}

	@action invalidatePageCache() {
		this.book.pages.forEach(page => page.invalidateCache());
	}


	onContextMenu = (e: React.MouseEvent<HTMLElement>, location: "sidebar" | "header" = "sidebar") => {
		const {name} = this;

		ContextMenu.show(
			<Menu>
				<MenuItem text={`IO Context NYI`} icon="document-open"/>
			</Menu>, {left: e.clientX - 8, top: e.clientY - 8});

		e.preventDefault();
	}

	async sendPageUpdate(pages) {
		//var payload = this.createUpdateUserInputPayload({ outputPages: pages });
		//this._userInputLastUpdateTime = payload.timeStamp;
		const res = await xhr.post(this.apiUrl + '/pages', pages);
		this.book.currentPage && runInAction(() => Object.assign(this.book.currentPage, (res as any)[this.book.currentPageNumber]));
		return res;
	}

	async loadInputState() {
		const inputState =await xhr.get(this.apiUrl);
		runInAction(() => this.inputState = inputState as any);
		const pages = await xhr.get<Array<ApiPage>>(`${this.apiUrl}/pages`);
		//this.inputOptions = state.inputOptions;
		//this.userInputs = state.userInputs;
		//this.actionFlag = state.actionFlag;

		if (this.book.pages.length == 0)
			pages.forEach(page => this.book.pages.push(new BookPage(this.book, page)));

		if (this.book.pages.length == 0) {
			await this.addTemplatePages();
		}
	}

	static GRID_DEFS = {
		ASSET_CLASS: {
			TABLE: "stresses",
			COLUMN: { ASSET_CLASS: "assetClass", WEIGHT: "weight", MARKET_VALUE: "startingMarketValue" }
		},
		RISK_DEFINITION: {
			TABLE: "transformations",
			COLUMN :{ TIME: "time", DAMAGE_SHARE: "damageShare", VOLATILITY_FACTOR: "volatilityFactor" },
			DEFAULTS :{ DAMAGE_SHARE: 0, VOLATILITY_FACTOR: 1 },
			PAGE_SIZE :20
		}
	}

	@computed get assetClassInput() {
		if (!this.inputState) {
			this.loadInputState();
			return [];
		}

		const GRID_DEFS = ClimateRiskAnalysis.GRID_DEFS.ASSET_CLASS;

		return _.map(this.inputState.assetClasses, ac => {
			return {
				[GRID_DEFS.COLUMN.ASSET_CLASS]: ac.name,
				[GRID_DEFS.COLUMN.WEIGHT]: ac.weight,
				[GRID_DEFS.COLUMN.MARKET_VALUE]: ac.startingMarketValue,
				...ac.damage
			};
		});
	}

	@observable riskDefinitionRows: number = 0;
	@computed get riskDefinitionInputs () {
		const transformations = this.inputState.transformationMetadata;
		const transformationsSet = this.inputState.transformationSets;
		const dataArray = [];

		const GRID_DEFS = ClimateRiskAnalysis.GRID_DEFS.RISK_DEFINITION;

		const defaultRowSize = GRID_DEFS.PAGE_SIZE * ( this.book.currentPage.scrollMode ? 1 : 2);
		const totalRows = Math.max(transformationsSet?.length , this.riskDefinitionRows, defaultRowSize );
		if (totalRows != this.riskDefinitionRows) {
			this.riskDefinitionRows = totalRows;
		}

		const getTransformationColumnKey = (trans: Transformation, column: string) => {
			return trans ? `${trans.transformationId}_${column}` : null;
		}

		for(let i = 0; i<=totalRows; i++) {
			const data = {time:`${i}`};
			_.forEach(transformations, trans => {
				const damageFunctionKey = getTransformationColumnKey(trans, GRID_DEFS.COLUMN.DAMAGE_SHARE);
				const volatilityFactorKey = getTransformationColumnKey(trans, GRID_DEFS.COLUMN.VOLATILITY_FACTOR);
				const damageFunction = (transformationsSet?.length || 0) > i && transformationsSet[i]? transformationsSet[i][trans.transformationId]?.damageFunction : null;
				const volatilityFactor = (transformationsSet?.length || 0) > i && transformationsSet[i]? transformationsSet[i][trans.transformationId]?.volatilityFactor : null;
				data[damageFunctionKey] = _.isNumber(damageFunction) ? damageFunction : GRID_DEFS.DEFAULTS.DAMAGE_SHARE;
				data[`has_${damageFunctionKey}`] = data[damageFunctionKey] != GRID_DEFS.DEFAULTS.DAMAGE_SHARE;
				data[volatilityFactorKey] = _.isNumber(volatilityFactor) ? volatilityFactor : GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR;
				data[`has_${volatilityFactorKey}`] = data[volatilityFactorKey] != GRID_DEFS.DEFAULTS.VOLATILITY_FACTOR;
			})
			dataArray.push(data)
		}

		return dataArray;
	}

	async addTemplatePages() {
		const template = {
			outputPages: [
				{
					title:              "Inputs",
					views:              [{view: "description"}, {view: "simulation"}, {view: "assetClass"}, {view: "riskDefinition"}],
					additionalControls: {scrollMode: true}
				},
				{
					title: "Outputs",
					views: [{view: "description"}, {view: "distributionsAtHorizon"}, {view: "throughTimeStatistics"}, {view: "financialDamageAndVolatilityShock"}, {view: "marketValueStatistics"}],
					additionalControls: {scrollMode: true}
				}
			]
		}
		await this.book.addTemplatePages(template, null);
	}

	isRunComplete = () => {
		return this.status == ClimateRiskAnalysisStatus.complete;
	}

	isRunning = () => {
		return this.status == ClimateRiskAnalysisStatus.running;
	}

	createUpdateUserInputPayload(data: Object) {
		return {
			timeStamp: new Date(),
			userInput: JSON.stringify(data)
		}
	}

	@action updateUserInputLastSavedTime (lastSavedTime: Date) {
		if( !this._userInputLastUpdateTime || lastSavedTime.getTime() == this._userInputLastUpdateTime.getTime()){
			this._userInputLastSavedTime = lastSavedTime;
		}
	}

	cleanup() {
		this._toDispose.forEach(f => f());
		this.eventSource && this.eventSource.dispose();
	}

	/* GUI Only */
	@observable isSelected = false;


	async sessionExtend() {
		try {
			site.busy = true;
			this.sessionID = await xhr.post(this.apiUrl + `/extend-session?sessionId=${this.sessionID}`, {}, {allowRetry: true});
		}
		finally {
			site.busy = false;
		}
	}

	async sessionReconnect() {
		try {
			site.busy = true;
			this.isReconnecting = true;

			this.eventSource.dispose();
			this.eventSource = null;
			this.initEventSource();
			await xhr.get(this.apiUrl + '/startup', {});
			await when(() => this.serverStatus == ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout
			await this.sessionExtend();
			this.isReconnecting = false;
		}
		finally {
			site.busy = false;
		}
	}

	async getDistributionsAtHorizonData() {
		if (this.output.distributionsAtHorizon == null)
			this.output.distributionsAtHorizon = await xhr.get<DistributionsAtHorizonOutput>(`${this.apiUrl}/pdf/market-value`);

		return this.output.distributionsAtHorizon;
	}

	getMarketValueStatisticsData = flow(function* (viewId: string, userOptions) {
		const { showMean, showPercentiles, showStandardDeviation, percentiles, rowsOrder } = userOptions;
		const statistics = rowsOrder.reduce((accu, field)=> {
			if (field === 'showMean' && showMean) {
				accu.push('Mean');
			} else if (field === 'showStandardDeviation' && showStandardDeviation ) {
				accu.push('StDev.S');
			} else if (field === 'showPercentiles' && showPercentiles) {
				percentiles.forEach(p => {
					if (p >= 0 && p <= 100) {
						accu.push(`=${p}%`);
					}
				});
			}

			return accu;
		}, []);

		_.set(
			this.output,
			["marketValueStatistics", viewId],
			yield xhr.get<MarketValueStatisticsOutput>(`${this.apiUrl}/statistics/market-value?statistics=${encodeURIComponent(JSON.stringify(statistics))}`)
		);
		return this.output.marketValueStatistics;
	}.bind(this))

	async getThroughTimeStatisticsData(percentiles) {
		let statistics = ["Mean"];
		_.forEach(percentiles, p => {
			if (p >= 0 && p <= 100) {
				statistics.push(`=${p}%`);
			}
		});
		let reload = this.output.throughTimeStatistics == null;
		if (!reload) {
			const existKeys = Object.keys(this.output.throughTimeStatistics);
			_.forEach(statistics, s => reload = reload || !(existKeys.indexOf( s == "Mean" ? s : `=${s}%`) >= 0));
		}
		if (reload) {
			this.output.throughTimeStatistics = await xhr.get<ThroughTimeStatisticsOutput>(`${this.apiUrl}/time-series/market-value?statistics=${encodeURIComponent(JSON.stringify(statistics))}`,);
		}

		return this.output.throughTimeStatistics;
	}

	async getFinancialDamageAndVolatilityShock() {
		if (this.output.financialDamageAndVolatilityShock == null)
			this.output.financialDamageAndVolatilityShock = await xhr.get<FinancialDamageAndVolatilityShockOutput[]>(`${this.apiUrl}/adjustments`);

		return this.output.financialDamageAndVolatilityShock;
	}


	// @computed get userInputSavedStatus(){
	// 	let result: string = "";
	// 	if(this._userInputLastUpdateTime){
	// 		result = this._userInputLastSavedTime && this._userInputLastUpdateTime.getTime() == this._userInputLastSavedTime.getTime() ?
	// 			`Input Saved at ${this._userInputLastUpdateTime.toString()}` :
	// 			"Saving Input ...";
	// 	}
	// 	return result;
	// }

	get isFavorite() {
		return _.get(settings, ['favorites', 'climateRiskAnalysis'], []).indexOf(this.id) !== -1
	}

	set isFavorite(value: boolean) {
		const favorites = _.get(settings, ['favorites', 'climateRiskAnalysis'], []);
		if (!value) {
			settings.favorites.climateRiskAnalysis = favorites.filter(id => id !== this.id)
		}
		else {
			settings.favorites.climateRiskAnalysis = favorites.concat([this.id]);
		}
	}

	@computed get validationMessages() :ValidationMessage[] {
		const rtnAry:ValidationMessage[] = [];
		if (this.inputState?.transformationMetadata?.length) {
			_.forEach(this.inputState.transformationMetadata, metadata => {
				const transformationId = metadata.transformationId;

				if (!_.some(this.inputState.stressMetadata, stress => stress.transformationId == transformationId)) {
					return;
				}
				let damageShareSum = 0;
				if (this.inputState.transformationSets?.length) {
					_.forEach( this.inputState.transformationSets, ts => {
						if (ts && ts[transformationId]) { damageShareSum = add(damageShareSum, ts[transformationId].damageFunction); }
					})
				}
				// Verify equality with a Number.EPSILON tolerance to discard machine precision issues.
				if (!utility.equal(damageShareSum, 1, 10 * Number.EPSILON)) {
					rtnAry.push({
						paths: [['riskDefinition',transformationId]],
						messageType: "Error",
						messageText: `Transformation "${metadata.name}". Sum of damage share should be 100% but the current sum is ${multiple(damageShareSum,100)}%.`
					})
				}
			})
		}
		return rtnAry;
	}

	@computed get validations() : Array<Validation> {
		let messages = this.validationMessages;
		const validations = messages && _.flatMap(messages, validation => validation.paths.map(path =>({path: path.join("."), errorType: validation.messageType, description: validation.messageText})));
		return _.keyBy(validations, 'path') as any;
	}

	getViewSerialNumberByViewType(id) {
		const { book } = this;
		const views = _.get(book, ['currentPage', 'selectedViews'], []);

		let count = 0;
		if (views.length > 0 ) {
			const viewIndex = book.currentPage.getViewIndex(id);
			if (viewIndex !== -1) {
				const { availableViews } = this;
				const viewName = views[viewIndex].name;
				const viewType = _.get(availableViews, [viewName, 'viewType'], '');
				for(let i=0; i <= viewIndex; i++) {
					const viewSetting = views[i];
					const view = availableViews[viewSetting.name];
					if (view.viewType === viewType) {
						count = count + 1;
					}
				}
			}
		}
		return count > 0 ? count : 1;
	}

	@computed
	get supportPdfViewsInCurrentPage() {
		const { availableViews } = this;
		const views: BookView[] = _.get(this.book, ['currentPage', 'selectedViews'], []);
		return views.reduce((accu, viewSetting, index) => {
			const view = availableViews[viewSetting.name];
			if (view?.exportPDF) {
				accu.push({
					index,
					view,
				});
			}
			return accu;
		}, []);
	}
}
