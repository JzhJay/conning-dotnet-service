import {ContextMenu, Intent, Menu, MenuItem} from '@blueprintjs/core';
import {action, computed, makeObservable, observable, reaction, runInAction, when, flow } from 'mobx';
import * as React from "react";
import type {ChartUserOptions, ConningUser, IChartingResult} from 'stores';
import {HighchartsHelper, ioStore, ObjectNameChecker, omdb, routing, settings, Simulation, site, user, utility, xhr, userFileStore, i18n} from 'stores';
import type {InvestmentOptimization, UserTagValue} from 'ui/src/codegen/types';
import type {LoadingStatusMessage} from 'ui/src/components';
import {ServerStatus} from '../../components/system/ExpireDialog/ExpireDialog';
import {getFullPercentileValues} from '../../components/system/highcharts/chartUtils';
import {getSeriesColor} from '../../components/system/highcharts/dataTemplates/highchartDataTemplate';
import type {Validation} from '../../components/system/inputSpecification/models';
import {BatchExportResultStatus} from '../../components/system/BatchExport/BatchExportTypes';
import type {BatchExportMessage, BatchExportResult} from '../../components/system/BatchExport/BatchExportTypes';
import {BaseEventSource, buildURL, busyAction, reactionToPromise} from '../../utility';
import {BookView} from '../book/BookView';
import type {AdditionalPoints, EvaluationDifference, IOGuid, IOViewTemplate, JuliaIO, JuliaIOState, Lambda, OptimizationControls, OutputControls, TabularUserOptions} from './'
import type {InputOption} from './InputOptionsMock';
import type {AdditionalAllocationGroup, ChangeMessage, OptimizationInputs} from './models';
import {IOBook} from './parts/IOBook';
import {IOPage} from './parts/IOPage';
import {BatchImportMessageTypes} from '../../components/system/BatchImport/Types';
import type {BatchImportMessage} from '../../components/system/BatchImport/Types';

export const groupPresetColors : string[] = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000'];

export const defaultTableRowOrders = ['showDuration', 'showAssetClass', 'showTotal', 'showMetrics'];

export interface Evaluation {
	risk?: number;
	reward?: number;
	evaluationNumber?: number;
	assetAllocation?: number[];
	mean?: number;
	percentiles?: number[];
	ctes?: {area: string, percentile: number};
	duration?: number;
	source?: string;
	min?: number;
	max?: number;
	standardDeviation?: number;
	name?: string;
	constraintIndicators?: ConstraintIndicators;
}

export interface EvaluationDetail extends Evaluation {
	name?: string;
	allocations?: number[];
	displayName?: string;
	groupName?: string;
	groupColor?: string;
}

export interface ConstraintIndicators {
	durationConstraintIndicator: string;
	durationConstraintValue: number;
	hhiConstraintIndicator: string;
	hhiConstraintValue: number;
	multiclassConstraintIndicators: Array<string>;
	multiclassConstraintMaximums: Array<number>;
	multiclassConstraintMinimums: Array<number>;
	multiclassConstraintNames: Array<string>;
	multiclassConstraintValues: Array<number>;
	realizedGainsConstraintIndicator: string;
	realizedGainsConstraintValue: number;
}

export enum IOStatus {
	waiting = "Waiting",
	running = "Running",
	complete = "Complete",
	failed = "Failed",
	cancelled = "Cancelled",
	serverCreated = "ServerCreated",
	finalizable = "Finalizable",
	finalizing = "Finalizing",
	restarting = "Restarting"
}

export interface EvaluationComparisonResult {
	minuendIndex: number,
	subtrahendIndex: number,
	scenarioDominancePdf: [number, number][],
	statisticalDominanceCdfMinuend: [number, number][],
	statisticalDominanceCdfSubtrahend: [number, number][],
	scenarioDominanceFraction: number,
	statisticalDominanceFraction: number
}

export class IO implements JuliaIO, IChartingResult {
	static ObjectType = 'InvestmentOptimization';
	static get OBJECT_NAME_SINGLE() { return i18n.intl.formatMessage({defaultMessage: "Allocation Optimization", description: "objectName - IO (single)"}) };
	static get OBJECT_NAME_MULTI() { return i18n.intl.formatMessage({defaultMessage: "Allocation Optimizations", description: "objectName - IO (multi)"}) };

	constructor(io: JuliaIO) {
        makeObservable(this);
        Object.assign(this, io);
        this.book = new IOBook(this, this.defaultUserOptions, this.availableViews, this.sendPageUpdate.bind(this), () => this.isLoaded, this.clientUrl);

        //console.log("CreateIO");
        const cachedIO = ioStore.ios.get(this.id);
        if (cachedIO) {
			Object.assign(cachedIO, io); // Update partial data to prevent some IO pages are re-rendered because all statuses of IO are reseted
		} else {
			ioStore.ios.set(this.id, this);
		}
    }

	_id: IOGuid;
	get id() { return this._id }
	connectionID: string;

	@observable _status: string = "";

	@observable serverStatus: ServerStatus  = ServerStatus.notInitialized;
	@observable _userInputLastSavedTime: Date = null;
	@observable _userInputLastUpdateTime: Date = null;
	@observable isReconnecting;
	@observable isRestarting;

	@observable name: string;
	@observable description: string;
	@observable userTagValues: UserTagValue[];
	@observable comments: string;

	@observable createdTime: string;
	@observable modifiedTime: string;
	createdBy: ConningUser;
	@observable modifiedBy: ConningUser;
	@observable currentPageID: string;
	@observable hoverEvalIndex: number;
	@observable viewAnimationInProgress: boolean;
	@observable hasData: boolean                = false;
	@observable updateCount: number             = 0;
	@observable relativeEvaluationIndex: number = null;
	@observable showValidationSetting: boolean = null;
	@observable enableCache: boolean = true;

	//pages: IOPage[] = [];
	book: IOBook;

	evaluations: {[key:number]: Evaluation} = null;
	frontierPoints: number[] = [];
	fullFrontierPoints: number[] = [];
	returnOutputs: {[key:string]: number[]};
	lambda: Lambda[] = [];
	evaluationDifferences:  {[key:string]: EvaluationDifference} = null;
	additionalPoints: AdditionalPoints[] = [];
	columnPadding = .02;
	@observable.ref multiclassConstraintNames = [];
	@observable optimizationControls: OptimizationControls;
	@observable optimizationInputs: any;
	outputControls: OutputControls;
	@observable inputOptions: { [key: string]: InputOption };
	@observable validationMessages;
	@observable axes;
	@observable globalLists: {[key: string]: Array<{title: string, name: string}>};
	@observable requiredOptimization: "full" | "partial" | "none" = null;

	@observable statusMessages: {type: string, label: string, currentMessage: string, progress: {numerator: number, denominator: number}}[] = []; /*[
		{
			type: "queryPreFetch", label: "Query Pre-fetch", currentMessage: "Loading Asset Class", progress: {numerator: 20, denominator: 20}
		},
		{
			type: "launchSupervisor", label: "Supervisor", currentMessage: "Launching Supervisor", progress: {numerator: 0, denominator: 1}
		},
		{
			type: "launchMonitor", label: "Monitor", currentMessage: "Launching Monitor", progress: {numerator: 0, denominator: 1}
		},
		{
			type: "assetData", label: "Asset Data", currentMessage: "Getting Asset Data", progress: {numerator: 0, denominator: 1}
		},
		{
			type: "launchOptimizer", label: "Optimizer", currentMessage: null, progress: {numerator: 0, denominator: 10}
		},
		{
			type: "randomAllocations", label: "Random Allocations", currentMessage: null, progress: {numerator: 0, denominator: 500}
		}
	]*/
	@observable errorMessages: string[];//["Fatal error encountered during Optimization", "Grid error - be sure grid is turned on"];
	@observable silentLock = false;

	@observable isLoading = false;
	@observable isLoaded = false;
	@observable isDuplicating = false;
	@observable isReady = false;
	@observable isLoadFailed = false;
	@observable batchExportMessage: {[fileID: number]: BatchExportMessage} = {};
	@observable batchExportUserFiles = {};
	@observable batchExportResult: BatchExportResult = {};
	@observable recentBatchExportUserFile = null;
	@observable batchImportProgressData: BatchImportMessage[] = [];
	batchExportRecentFileHandle: FileSystemFileHandle = null;

	highcharts = new HighchartsHelper(this);

	_toDispose = [];
	eventSource = null;

	static apiUrlFor(id: IOGuid) {
		return `${ioStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return IO.apiUrlFor(this.id);
	}

	static get browserUrl() { return routing.urls.ioBrowser; }

	static urlFor(id: IOGuid) {
		return `${IO.browserUrl}/${id ? id : ''}`;
	}

	get clientUrl() {
		return IO.urlFor(this.id)
	}

	get eventSourceUrl() {
		return buildURL(`${this.apiUrl}/status`,
			{['connection-id']: this.connectionID, enabled: this.connectionID},
			{[user.VALIDATION_ID]: user.validationId, enabled: true},
			{['accessToken']: user.accessToken, enabled: true});
	}

	get icon() {
		return 'target'
	}

	get currentPage() {
		return this.book.currentPage as IOPage;
	}

	get pages() {
		return this.book.pages;
	}

	get hasPages() {
		return this.book.hasPages;
	}

	@computed get plotExtremes() {
		return (this.book.currentPage as IOPage).plotExtremes;
	}

	get defaultUserOptions() {
		return ioStore.defaultUserOptions;
	}

	get availableViews() {
		return ioStore.views;
	}

	navigateTo = () => { routing.push(this.clientUrl)}

	static delete     = async (io: JuliaIO, force = false, soft = false) => {
		const {name, _id} = io;
		if (force || KARMA || (await site.confirm(i18n.common.MESSAGE.WITH_VARIABLES.DELETE_CONFIRMATION(IO.OBJECT_NAME_SINGLE, name)))) {
			// runInAction: Deleting IO
			return runInAction(async () => {
				try {
					site.busy = true;
					await xhr.delete(IO.apiUrlFor(io._id) + (soft ? "?soft" : ""));
					if (ioStore.ios.has(_id)) {
						ioStore.ios.get(_id).cleanup();
						ioStore.ios.delete(_id); // only delete entry after server deletes
					}
					return true;
				}
				catch (err) {
					throw err
				}
				finally {
					site.busy = false;
				}
			})
		}
	}

	static duplicate = async (io: JuliaIO) => {
		try {
			site.busy = true;
			const newName = await new ObjectNameChecker({nameForCopyObject: true}).getAvailableName(IO.ObjectType, io.name);
			let result = await xhr.putUntilSuccess<string>(`${IO.apiUrlFor(io._id)}/clone?name=${encodeURIComponent(newName)}`, {},
				"dest_io_id",
				(response, willRetry) => {
				});

			return result;
		}
		finally {
			site.busy = false;
		}
	}

	@action restartSession = async (isTriggerByUser:boolean, waitForServerCreated: boolean = false) => {
		this.isRestarting = true;
		this.eventSource.dispose();
		this.eventSource = null;
		this.serverStatus = ServerStatus.closed;

		this.connectionID = await xhr.post(`${IO.apiUrlFor(this._id)}/restart-io?execute=${isTriggerByUser}&wait=${waitForServerCreated}`)
		this.initEventSource();
		await when(() => this.serverStatus == ServerStatus.ready); // Proceed after server is started so that subsequent request is less likely to timeout
		this.isRestarting = false;
	}

	static exportInputs = async (io: JuliaIO) => {
		try {
			site.busy = true;

			await user.waitToken(); // await valid token
			await utility.downloadFile(`${IO.apiUrlFor(io._id)}/export-inputs`);

		}
		finally {
			site.busy = false;
		}
	}

	static exportEvaluations = async (io: JuliaIO, userOptions: ChartUserOptions) => {
		try {
			site.busy = true;

			let separators: any = utility.getCsvSeparators(user.region);
			separators = separators ? JSON.stringify(separators) : null;
			const url = xhr.createAuthUrl(utility.buildURL(`${IO.apiUrlFor(io._id)}/export-evaluations`,
				{separators: separators},
				{sampledFrontier: userOptions.showEfficientFrontier},
				{fullFrontier: userOptions.showFullFrontier},
				{lambdaPoints: userOptions.showLambdaPoints},
				{additionalPoints: userOptions.showAdditionalPoints},
				{historicalPoints: userOptions.showHistoricalPoints},
				{randomPoints: userOptions.showRandomPoints},
				{directionPoints: userOptions.showDirectionPoints},
				{distancePoints: userOptions.showDistancePoints},
				{iterationPoints: userOptions.showIterationPoints}
			));

			await user.waitToken(); // await valid token
			await utility.downloadFile(url);

		}
		finally {
			site.busy = false;
		}
	}

	@action rename = async (name: string) => {
		this.name = name;
		const updates = await omdb.updatePartial(IO.ObjectType, this._id, {name});
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

	static rename = async (io: JuliaIO, name: string) => {
		alert("NYI");
	}

	@observable locked:boolean;
	@computed get inputsLocked() {
		return this.locked === true;
	}
	set inputsLocked(locked) {
		runInAction(() => this.locked = locked === true);
		omdb.updatePartial(IO.ObjectType, this._id, {locked})
	}

	@action
	unlockInputs = () => {
		this.inputsLocked = false ;
	}

	@computed get controlFlags() {
		const selectedViews = this.currentPage ? this.currentPage.selectedViews : [];
		const selectedViewsNames = selectedViews.map(v => v.name);
		const userOptions = selectedViews.map(v => this.currentPage.getViewUserOptions(v.id));
		const hasDominanceView = selectedViewsNames.indexOf("pathWiseDominance") != -1 || selectedViewsNames.indexOf("statisticalDominance") != -1;
		const showLambda = _.some(userOptions, u => u.showLambdaPoints);
		const showAdditional = _.some(userOptions, u => u.showAdditionalPoints);
		const hasEvaluationComparisonView = selectedViewsNames.indexOf("evaluationComparison") !== -1;

		return {
			includeEvaluationSummaries: selectedViewsNames.indexOf("efficientFrontier") != -1 || selectedViewsNames.indexOf("strategySummary") != -1 || hasEvaluationComparisonView || selectedViewsNames.indexOf("directionalConstraint") !== -1,
			includeLambdaTable: selectedViewsNames.indexOf("status") != -1 || this.lambda.length == 0,
			includeBestLambdaDetails: showLambda || this.lambda.length == 0,
			includeFrontierDetails: _.some(userOptions, u => u.showEfficientFrontier) || hasDominanceView || hasEvaluationComparisonView,
			includeAdditionalDetails: showAdditional,
			includeBestLambdaDifferences: (hasDominanceView || hasEvaluationComparisonView) && showLambda, //TODO: Check just the dominance userOptions
			includeFrontierDifferences: hasDominanceView || hasEvaluationComparisonView,
			includeAdditionalDifferences: (hasDominanceView || hasEvaluationComparisonView ) && showAdditional
		}
	}

	@computed get controlFlagsKey() {
		return JSON.stringify(this.controlFlags);
	}

	setControlFlags_debounced = _.debounce(async () => {
		const result = await this.setControlFlags();
		this.processState(result);
	}, 500, { leading: false });

	setControlFlags = () => {
		return xhr.post(this.apiUrl + '/update-control-flags?connection-id=' + this.connectionID, this.controlFlags);
	}

	@computed get IOOptions() {
		return {
			relativeEvaluationIndex: this.relativeEvaluationIndex,
			enableCache: this.enableCache
		};
	}

	_loadTimer = null;
	@action loadExistingIO = async () => {
		this.isLoading = true;
		this.isLoadFailed = false;

		try {
			this.setLoadingTimerMessage();
			await this.newConnection();
			this.initEventSource();
			await reactionToPromise(() => this.serverStatus, ServerStatus.ready); // Proceed after server is started so that subsequent request is less likely to timeout
			action(() => this.isReady = true)();
			await this.sessionExtend();

			this.setupListeners();
			await this.loadInputState();
			this.setControlFlags_debounced();
			await (this.setControlFlags_debounced as any).flush(); // Process immediately and await.

			if (this.pages == null || this.pages.length == 0) {
				/*await this.addPage({title: "Monitor", views: [{view: "status", newIndex: 0}, {view: "efficientFrontier", newIndex: 1}]}, false);
				await this.addPage({title: "Overview", views: [{view: "efficientFrontier", newIndex: 0}]});
				await this.addPage({title: "Tabular", views: [{view: "strategySummary", newIndex: 0}]}, false);*/
			}

			if (this.pages != null && this.pages.length > 0) {
				this.book.currentPageNumber = routing.query.page ? Math.min(parseInt(routing.query.page as string), this.pages.length) - 1 : 0;
			}

			/*
			if (this.currentPage.selectedViews.length == 0 && this.status == IOStatus.running) {
				await this.currentPage.insertView("status");
				await this.currentPage.insertView("efficientFrontier");
			}*/
		} catch(e) {
			action(() => this.isLoadFailed = true)();
			throw e;
		} finally {
			action(() => {
				this.isLoaded = true;
				this.isLoading = false;
			})();
			clearTimeout(this._loadTimer);
		}
	}

	@observable loadingStatusMessages: LoadingStatusMessage[] = [];

	@action initEventSource = () => {
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
		const io = this;
		const data = JSON.parse(event.data);

		if (io.serverStatus === ServerStatus.notInitialized)
			io.loadingStatusMessages.push(data);

		if (data.type == "status") {
			if(data.subtype == "Server") {
				io.serverStatus = data.data as ServerStatus;
				if (io.serverStatus === ServerStatus.closed) {
					this.eventSource.dispose();
				}
				io.loadingStatusMessages.splice(0, io.loadingStatusMessages.length);
			} else if (data.data == IOStatus.restarting) {
				!this.isRestarting && this.restartSession(false);
			} else {
				io.status = data.data;
				if (data.additionalData) {
					const additionalData = JSON.parse(data.additionalData);
					const locked = _.get(additionalData, "locked");
					if (_.isBoolean(locked)) {
						this.locked = locked;
					}
				}
			}
		}
		else if (data.type == "update") {
			const updateData:JuliaIOState = data.data;
			// runInAction: Process SSE message
			updateData && runInAction(async () => {
				try {
					io.processState(updateData);
				}
				catch (err) {
					site.raiseError(err);
				}
			});
		}
		else if (data.type == "s3upload") {
			console.log(`S3 upload done ${data.data}`);
			let lastSavedTime = new Date(data.data);
			io.updateUserInputLastSavedTime(lastSavedTime);
		}
		else if (data.type == "statusMessages"){
			io.statusMessages = data.messages.statusMessages;
			if (data.messages.errorMessages)
				io.errorMessages = data.messages.errorMessages;
		}
		else if (data.type == "intermediateResult") {
			let status = data.data;
			if (status == "started")
				site.toaster.show({ message: "Intermediate result started.", intent:Intent.WARNING})
			else
				site.toaster.show({ message: "Intermediate result is ready.", action: { text: "View result", onClick: () => routing.push(Simulation.urlForRelatedObjectPage(status))}, timeout: 0, intent:Intent.SUCCESS});
		}
		else if (data.type == "warning") {
			site.toaster.show({ message: data.data, timeout: 0, intent:Intent.WARNING});
		}
		else if (data.type == "batchExport") {
			if (data.subtype == "progress") {
				io.batchExportMessage[data.fileID] = data;
			} else if (data.subtype == "exception") {
				let params = JSON.parse(data.data);
				const fileId = params.fileID;
				const message = io.batchExportMessage[fileId]
				io.batchExportMessage[fileId] = {
					type: data.subtype,
					file_id: fileId,
					label: params.message,
					currentMessage: params.message,
					progress: _.assign({denominator: 1, numerator: 1}, message ? message.progress : null)
				};
				io.batchExportResult[fileId] = BatchExportResultStatus.error;
			} else if (data.subtype == "fileInfo") {
				let params = JSON.parse(data.data)
				userFileStore.loadDescriptor(params.userFileID).then(action(file => {
					io.recentBatchExportUserFile = file;
					io.batchExportRecentFileHandle = null;
					io.batchExportUserFiles[params.fileID] = file;
				}));
			} else if (data.subtype == "complete") {
				let params = JSON.parse(data.data);
				io.batchExportResult[params.fileID] = BatchExportResultStatus.complete;
			}
		} else if (data.type == BatchImportMessageTypes.main) {
			runInAction(() => {
				io.batchImportProgressData.push(data)

				if (data.subtype == BatchImportMessageTypes.results) {
					const additionalData = JSON.parse(data.additionalData);
					if (additionalData.isChange) {
						this.refreshInputStateAfterBatchImport();
					}
				}
			});
		}
	};

	setLoadingTimerMessage() {
		this._loadTimer = setTimeout(() => {
			this.status == "Complete" && site.toaster.show({ message: 'Not yet loaded. \n\nLoading is taking longer than expected. Please try refreshing your browser in a couple of minutes. If the problem persists, consider disregarding the results and re-optimizing.',
				intent: Intent.WARNING,
				action:  {
					text:    'Disregard Results',
					onClick: () => {
						this.resetStatus();
					}
				},
				timeout: 0})
		}, 10 * 60 * 1000)
	}

	async createPagesFromTemplate(isVerbose: boolean) {
		try {
			site.busy = true;

			if (isVerbose == null) {
				await this.book.addPage();
			} else {
				let template = null;

				if (isVerbose) {
					template = {
						outputPages: [
							{
								title: "Scope, Measures and Data Source(s)",
								views: [
									{
										view: "optimizationTarget",
										controls: '{"verboseMode": true}'
									},
									{
										view: "dataSources",
										controls: '{"verboseMode": true}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Asset Classes, Constraints and Additional Allocations",
								views: [
									{
										view: "assetClasses",
										controls: '{"hiddenSections":["taxes","tradingAndTurnover","riskBasedCapital","bondCreditRisk"]}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Asset Values and Trading",
								views: [
									{
										view: "assetValuesAndTrading",
										controls: '{"verboseMode": true}'
									},
									{
										view: "assetClasses",
										controls: '{"hiddenSections":["color","returnSource","constraintsAndDuration","additionalAllocations","riskBasedCapital","taxes","returnAdjustments"]}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Accounting and Taxes",
								views: [
									{
										view: "accounting",
										controls: '{"verboseMode": true}'
									},
									{
										view: "nonAssetFlowsAndValues",
										controls: '{"verboseMode": true}'
									},
									{
										view: "taxes",
										controls: '{"verboseMode": true}'
									},
									{
										view: "assetClasses",
										controls: '{"hiddenSections":["color","returnSource","constraintsAndDuration","additionalAllocations","tradingAndTurnover","bondCreditRisk","riskBasedCapital","returnAdjustments"]}'
									},
									{
										view: "interestMaintenanceReserve",
										controls: '{"verboseMode": true}'
									},
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Interest Rates",
								views: [
									{
										"view": "interestRates",
										controls: '{"verboseMode": true}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Surplus Management",
								views: [
									{
										view: "surplusManagement",
										controls: '{"verboseMode": true}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Risk Based Capital",
								views: [
									{
										view: "riskBasedCapital",
										controls: '{"verboseMode": true}'
									},
									{
										view: "assetClasses",
										controls: '{"hiddenSections":["tradingAndTurnover","bondCreditRisk","taxes","values","additionalAllocations","returnSource","constraintsAndDuration","color","returnAdjustments"]}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Optimization Settings",
								views: [
									{
										view: "optimizationControls",
										controls: '{"verboseMode": true}'
									},
									{
										view: "optimizationConstraints",
										controls: '{"verboseMode": true}'
									},
									{
										view: "optimizationResources",
										controls: '{"verboseMode": true}'
									},
									{
										view: "efficientFrontierSampling",
										controls: '{"verboseMode": true}'
									}
								],
								additionalControls: {
									hoverPoint: false,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Monitor",
								views: [
									{
										view: "status"
									},
									{
										view: "efficientFrontier"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  true
								}
							},
							{
								title: "Efficient Frontier and Strategy Summary",
								views: [
									{
										view: "efficientFrontier"
									},
									{
										view: "strategySummary"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Asset Allocation and Distribution of Outcomes",
								views: [
									{
										view: "assetAllocation"
									},
									{
										view: "ioBox"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Evaluation Comparison",
								views: [
									{
										view: "evaluationComparison"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Statistical Dominance",
								views: [
									{
										view: "statisticalDominance"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Scenario Dominance",
								views: [
									{
										view: "pathWiseDominance"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Asset Class Returns Table and Chart",
								views: [
									{
										view: "assetClassesReturnsChart"
									},
									{
										view: "assetClassesReturnsTable"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
							{
								title: "Constraint Table",
								views: [
									{
										view: "directionalConstraint"
									}
								],
								additionalControls: {
									hoverPoint: true,
									showViewToolbars: true,
									showPageTitle: false,
									scrollMode: true,
									isMonitorPage:  false
								}
							},
						]
					};
				}
				else {
					template = {
						outputPages: [
							{
								title:              "Inputs",
								views:              (_.values(ioStore.views) as IOViewTemplate[]).filter(v => v.isInput && v.name != "assetClasses").map(v => ({view: v.name})) as any,
								additionalControls: {
									showHoverPoint:   false,
									showViewToolbars: false,
									scrollMode:       true,
								}
							},
							{
								title:              "By Asset Class Inputs",
								views:              [
									{view: "assetClasses"}
								],
								additionalControls: {
									showHoverPoint: false
								}
							},
							{
								title:              "Monitor",
								views:              [
									{view: "status"},
									{view: "efficientFrontier"}
								],
								additionalControls: {
									showHoverPoint: false,
									isMonitorPage:  true,
								}
							},
							{
								title: "Overview",
								views: [
									{view: "efficientFrontier"}
								]
							},
							{
								title: "Results Detail",
								views: [
									{view: "strategySummary"},
									{view: "directionalConstraint"},
									{view: "assetClassesReturnsChart"},
									{view: "assetClassesReturnsTable"}
								],
								additionalControls: {
									scrollMode: true
								}
							},
							{
								title: "Portfolio Comparison",
								views: [
									{view: "evaluationComparison"},
									{view: "pathWiseDominance"},
									{view: "statisticalDominance"}
								],
								additionalControls: {
									scrollMode: true
								}
							}
						]
					}
				}

				await this.book.addTemplatePages(template, "userInput.outputPages");
			}
		}
		finally {
			site.busy = false;
		}

		//state.outputPages.forEach(page => this.pages.push(new IOPage(this, page)));
	}

	@action setMonitorPage(page: IOPage) {
		this.pages.forEach(p => p == page ? (p.isMonitorPage = !p.isMonitorPage) : (p.isMonitorPage = false));
	}

	setupListeners() {
		this._toDispose.push(reaction(() => this.controlFlagsKey, this.setControlFlags_debounced));
		//this._toDispose.push(reaction(() => this.controlFlags, this.setControlFlags_debounced));

		// Process sequence callbacks
		this.sequeunceInterval = setInterval(async () => {
			const callback = this.sequenceCallbacks.shift();
			callback && !this.book.isPageAnimating() && (await callback());
		}, 10)
	}

	//TODO: the order of function calls inside this function needs to be adjusted to match the change in the backend
	@action optimize = async (shouldUpdateViews = true, mock = false) => {
		try {
			const requiredOptimization = this.requiredOptimization; // Store a local copy since this will be updated from the api request.

			if (requiredOptimization == "partial" || (mock || (await site.confirm(`Start Optimization?`)))) {
				if (requiredOptimization == "full") {
					this.resetEvaluationState();
				}
				this.errorMessages = [];
				this.invalidatePageCache();
				site.busy    = true;
				const url    = mock ? this.apiUrl + '?mock=true' : this.apiUrl;
				const result = await xhr.post<{ connectionId: string }>(url + `?connection-id=${this.connectionID}`, {});
				await this.loadInputState();
				this.connectionID = result.connectionId;
				if (this.pages == null || this.pages.length == 0)
					await this.book.addPage();

				if (requiredOptimization == "full") {
					const monitorPageIndex = this.pages.findIndex(page => page.isMonitorPage);
					if (monitorPageIndex != -1 && this.book.currentPageNumber != monitorPageIndex) {
						this.book.navigateToPage(monitorPageIndex);
					}
				}

				this.setControlFlags_debounced();

				this.initEventSource();
			}
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

	@action resetStatus = async () => {
		if (await site.confirm('Disregard output results and reset state to waiting?')) {
			await busyAction(async () => {
				await xhr.post(this.apiUrl + '/reset-status?connection-id=' + this.connectionID, {});
			});
		}
	}

	@computed get status():string {
		return this._status;
	}
	set status(newStatus:string) {
		runInAction(() => {
			this._status = newStatus;
		});
	}

	@computed get userInputLastSavedTime():Date {
		return this._userInputLastSavedTime;
	}

	@action processState(ioState, signalUpdate = true, isInputUpdate = false) {
		//console.time("updateState");
		if (this.evaluations == null)
			this.evaluations = {};

		ioState.evaluationSummaries && ioState.evaluationSummaries.forEach((summary) => {
			// TODO: Store separetely the way it comes in
			let evaluation = this.evaluations[summary.evaluationIndex] != null ? this.evaluations[summary.evaluationIndex] : {};
			this.evaluations[summary.evaluationIndex] = {...evaluation, risk: summary.risk, reward: summary.reward, evaluationNumber: summary.evaluationIndex, source: summary.source}
		})

		ioState.evaluationDetails && ioState.evaluationDetails.forEach((detail) => {
			let evaluation = this.evaluations[detail.evaluationIndex] != null ? this.evaluations[detail.evaluationIndex] : {evaluationNumber: detail.evaluationIndex};
			this.evaluations[detail.evaluationIndex] = {...evaluation, ...detail, assetAllocation: detail.allocations, percentiles: detail.percentileValues, ctes: detail.cteValues}
		})

		// If the frontierIndices, lambdas, fullFrontierIndices has not change and there are no other keys (besides always present connectionID) then bail to avoid needless re-renders.
		// TODO: Figure out why the back-end is sending these when they have not changed.
		if (ioState.frontierIndices || ioState.lambdaState || ioState.fullFrontierIndices) {
			if (Object.keys(_.omit(ioState, ["connectionId", "frontierIndices", "lambdaState", "fullFrontierIndices"])).length == 0 &&
				(!ioState.frontierIndices || _.isEqual(ioState.frontierIndices, this.frontierPoints)) &&
				(!ioState.fullFrontierIndices || _.isEqual(ioState.fullFrontierIndices, this.fullFrontierPoints)) &&
				(!ioState.lambdaState || _.isEqual(ioState.lambdaState.sort((a, b) => a.lambda - b.lambda), this.lambda)))
				return;
		}

		if (ioState.frontierIndices) {
			this.frontierPoints = ioState.frontierIndices;
			if (ioState.frontierIndices.length > 0 && this.status === IOStatus.running) {
				this.status = IOStatus.finalizable;
			}
		}

		if (ioState.fullFrontierIndices)
			this.fullFrontierPoints = ioState.fullFrontierIndices;

		if (ioState.lambdaState)
			this.lambda = ioState.lambdaState.sort((a, b) => a.lambda - b.lambda);

		if(ioState.returnOutputs)
			this.returnOutputs = ioState.returnOutputs;

		if (this.evaluationDifferences == null)
			this.evaluationDifferences = {};

		ioState.evaluationDifferences && ioState.evaluationDifferences.forEach((differences) => {
			this.evaluationDifferences[this.evaluationDifferencesKey(differences.minuendIndex, differences.subtrahendIndex)] = differences;
		})

		let userInputUpdated = false;
		if (ioState.userInput) {
			if (!_.isEqual(this.additionalPoints, ioState.userInput.additionalPoints)) {
				this.additionalPoints = ioState.userInput.additionalPoints;
				userInputUpdated = true;
			}

			if (!_.isEqual(this.outputControls, ioState.userInput.outputControls)) {
				this.outputControls = ioState.userInput.outputControls;
				this.loadIOOptions();
				userInputUpdated = true;
			}
		}

		if (ioState.changeMessages) {
			ioState.changeMessages.forEach((m:ChangeMessage) => {
				_.set(this.optimizationInputs, m.targetPath, m.targetValue);
			})
			userInputUpdated = true;
		}

		if (ioState.requiredOptimization)
			this.requiredOptimization = ioState.requiredOptimization;

		// Validation messages are only provided though direct input update. e.g. not from updating control flags.
		if (isInputUpdate && ioState.validationMessages)
			this.validationMessages = ioState.validationMessages;

		if (ioState.statusMessages)
			this.statusMessages = ioState.statusMessages;

		if (ioState.errorMessages)
			this.errorMessages = ioState.errorMessages;

		if (ioState.inputOptions) {
			let flattenedResult = this.flatten(ioState.inputOptions);
			Object.keys(flattenedResult).forEach(k => {
				let keys = k.split(".");
				let currentNode = this.inputOptions[keys[0]]
				keys.slice(1, -1).forEach(element => {
					currentNode = currentNode.options.find((c) => c.name == element)
				})
				currentNode[keys[keys.length - 1]] = flattenedResult[k]
			})
			userInputUpdated = true;
		}

		if (ioState.axes){
			this.axes = ioState.axes;
		}

		if (ioState.globalLists) {
			this.globalLists = {...this.globalLists, ...ioState.globalLists};
		}


		// If the ioState contains more than just the userInput we have output data.
		const isDataUpdate = (Object.keys(_.omit(ioState, ["connectionId", "userInput", "assets"])).length > 0);
		if (signalUpdate) {
			if (isDataUpdate)
				this.hasData = true;

			if (isDataUpdate || (this.hasData && userInputUpdated))
				this.updateCount++;
		}
	}

	get showValidation() {
		return this.showValidationSetting || (this.showValidationSetting == null && _.size(this.validations) > 0);
	}

	@computed get optimizeControlText() {
		return this.requiredOptimization == "partial" ? "Apply" : "Run";
	}

	get blockedOptimizationMessage() {
		return this.status == IOStatus.running ? "Cannot re-optimize while optimization is in progress" :
		                      this.requiredOptimization == "none" ? "No changes to Optimize" :
		                      !this.hasPages ? "No pages available" :
		                      _.some(this.validations, v => v.errorType == "Error") ? "Validation errors must be resolved before optimizing" : null
	}

	get assets() : [{name: string, color: string}] {
		if (KARMA) {
			return this.getAssetClassInputWithoutGroups();
		}

		return this.optimizationInputs.assetClasses.map((asset, i) => ({name: asset.name, color: (asset.color === "" ? `rgb(${getSeriesColor(i)})` : asset.color)}));
	}

	get isAdditionalAllocationsOnly() {
		return this.optimizationInputs?.optimizationControls?.mode == "additionalPointsOnly";
	}

	@computed get assetGroupsWithAllocations() {
		let index = -1;
		let assetGroups = _.cloneDeep(this.getAssetClassInput());

		let dive = (group) => {
			if (group.assetClasses.length == 0)
				group.allocationIndex = ++index;
			else
				group.assetClasses.forEach(child => dive(child));
		}

		dive({assetClasses: assetGroups});

		return assetGroups;
	}


	assetGroups(level, includeLeafs:boolean = true) {
		let assetGroups = [];
		let assetGroupChildren:any = [];
		for (let l = 0; l <= level; l++) {
			assetGroupChildren = l == 0 ? this.assetGroupsWithAllocations : _.flatten(assetGroupChildren.map(c => c.assetClasses));

			// Add assets at the correct level. If there are no assets at that level add parent.
			assetGroupChildren.forEach(a => ((l == level || (includeLeafs && a.assetClasses.length == 0)) && assetGroups.push({
				name: a.name, color: a.color, assetClasses: a.assetClasses, allocationIndex: a.allocationIndex, duration: a.constraintsAndDuration.duration})
			));
		}

		return assetGroups;
	}

	allocationsAtLevel(level, allocations, includeLeafs:boolean = true) {
		let assetGroups = this.assetGroups(level, includeLeafs);
		let runningAllocations = [...allocations];

		const total = (group) => {
			if (group.assetClasses.length == 0) {
				return runningAllocations[group.allocationIndex];
			}
			else {
				return _.sum(group.assetClasses.map(g => total(g)));
			}
		}

		return assetGroups.map(a => total(a));
	}

	getGroupDepth(group) {
		if (group.assetClasses == null || group.assetClasses.length == 0)
			return 0;

		return _.max(group.assetClasses.map(g => this.getGroupDepth(g))) as number + 1;
	}

	evaluationDifferencesKey(minuendIndex, subtrahendIndex) {
		return `${minuendIndex}-${subtrahendIndex}`;
	}

	@action resetEvaluationState() {
		this.evaluations = null;
		this.frontierPoints = [];
		this.fullFrontierPoints = [];
		this.lambda = [];
		this.evaluationDifferences = null;
		this.hasData = false;
	}

	@action invalidatePageCache() {
		this.pages.forEach(page => page.invalidateCache());
	}

	convertJuliaEvaluationDetail(detail) {
		return {...this.evaluations[detail.evaluationIndex], assetAllocation: detail.allocations, mean: detail.mean, percentiles: detail.percentileValues, ctes: detail.cteValues}
	}

	@action loadEvaluation(evaluationIndex: number) {
		if (evaluationIndex != null) {
			return xhr.get<any>(`${this.apiUrl}/${evaluationIndex}?connection-id=` + this.connectionID).then(evaluation => {

				//this.evaluations[evaluationIndex] = this.convertJuliaEvaluationDetail(evaluation.evaluationDetails);
				//this.evaluationDifferences[this.evaulationDifferencesKey(evaluation.evaluationDifferences.minuendIndex, evaluation.evaluationDifferences.subtrahendIndex)] = evaluation.evaluationDifferences;
				this.processState({evaluationDetails: [evaluation.evaluationDetails], evaluationDifferences: evaluation.evaluationDifferences}, false);
				return this.evaluations[evaluationIndex];
			})
		}
		else {
			console.warn("Null evaluation index in IO:loadEvaluation");
		}
	}

	onContextMenu = (e: React.MouseEvent<HTMLElement>, location: "sidebar" | "header" = "sidebar") => {
		const {name} = this;

		ContextMenu.show(
			<Menu>
				<MenuItem text={`IO Context NYI`} icon="document-open"/>
			</Menu>, {left: e.clientX - 8, top: e.clientY - 8});

		e.preventDefault();
	}

	getFrontierName(index) {
		return this.indexToLetter(index);
	}

	indexToLetter(index) {
		if (index < 26)
			return String.fromCharCode(65 + index % 26);
		else
			return this.indexToLetter(Math.floor(index / 26) - 1) + this.indexToLetter(index % 26);
	}

	isFrontierPoint(evaluationIndex) {
		return this.frontierPoints.indexOf(evaluationIndex) != -1;
	}

	isAdditionalPoint(evaluationIndex) {
		return this.additionalPoints.find((a) => a.evaluationIndex == evaluationIndex) != null;
	}

	get additionalPointEvaluations() : EvaluationDetail[] {
		// Will this actually be in the evaluations list?
		const { additionalAllocations } = this.getOptimizationInputs();

		return this.additionalPoints.map((a, i) => {
			const groupInfo: AdditionalAllocationGroup = _.get(additionalAllocations, i, { name: '', group: '', color: ''});
			const groupAttrs  = { displayName: groupInfo.name, groupName: groupInfo.group, groupColor: groupInfo.color };

			return {...this.evaluations[a.evaluationIndex], name: (i + 1).toString(), ...groupAttrs };
		})
		.filter((e) => this.evaluationHasDetails(e.evaluationNumber));
	}

	get frontierPointEvaluations() {
		return this.frontierPoints.map(f => this.evaluations[f]).sort((a, b) => a.reward - b.reward).map((e, i) => ({...e, name: this.getFrontierName(i)}))
			.filter((e) => this.evaluationHasDetails(e.evaluationNumber));
	}

	get allPointEvaluations() {
		return this.additionalPointEvaluations.concat(this.frontierPointEvaluations);
	}

	get lambdaEvaluations() {
		return this.lambda.map((l, i) => ({...this.evaluations[l.bestEvaluationIndex], name: this.getFrontierName(i).toLowerCase()}));
	}

	get inefficientEvaluations() {
		return _.values(this.evaluations) as Evaluation[];
	}

	get fullFrontierEvaluations() {
		return this.fullFrontierPoints.map(f => this.evaluations[f]).filter(e => e != null);
	}

	get iterationEvaluations() {
		return this.lambda.map(l => l.previousIterationIndices.map(i => this.evaluations[i]));
	}

	get assetClassSources() {
		return this.assetGroups(2).map(a => a.name);
	}

	computeDuration(evaluation: Evaluation) {
		if (evaluation.assetAllocation) {
			const assetClassWithDuration = this.assetGroups(2, true).map((a, i) => ({...a, index: i})).filter(a => a.duration != null);
			const weights                = _.at(this.allocationsAtLevel(2, evaluation.assetAllocation), assetClassWithDuration.map(a => a.index));
			const durationWeight         = _.sum(assetClassWithDuration.map(((a, i) => a.duration * weights[i])));
			const totalWeight            = _.sum(weights);

			return totalWeight == 0 ? 0 : durationWeight / totalWeight;
		}
		else {
			return 0;
		}
	}

	async saveIOOptions(IOOption?: any) {
		const IOOptions = this.IOOptions;
		if (IOOption) {
			Object.assign(IOOptions, IOOption);
		}
		let payload = this.createUpdateUserInputPayload({ outputControls: {additionalControls: JSON.stringify(IOOptions)}});
		this._userInputLastUpdateTime = payload.timeStamp;
		await xhr.post(this.apiUrl + '/user-input?connection-id=' + this.connectionID, payload);
	}

	pendingUpdate = false;
	@action async setRelativePoint(evaluationIndex: number) {
		try {
			site.busy = true;
			this.pendingUpdate = true;
			await utility.sleep(100); // Give busy cursor a chance to update.
			this.relativeEvaluationIndex = evaluationIndex;
			this.saveIOOptions();
		}
		finally {
			site.busy = false;
			this.pendingUpdate = false;
		}
	}

	async addEfficientFrontier(evaluationIndex) {
		return this.updateFrontierPoint(evaluationIndex, true);
	}

	async updateFrontierPoint(evaluationIndex, isAdd) {
		try {
			site.busy = true;
			await xhr.post(`${this.apiUrl}/frontier/${evaluationIndex}?direction=${isAdd ? "add" : "remove"}`)
		}
		finally {
			site.busy = false;
		}
	}

	async updateAdditionalPoint(evaluationIndex, isAdd) {
		try {
			await xhr.post(`${this.apiUrl}/additional/${evaluationIndex}?direction=${isAdd ? "add" : "remove"}`)
		}
		finally {
			site.busy = false;
		}
	}

	_postAnimationCallback;
	postAnimationCallback() {
		if (this._postAnimationCallback) {
			runInAction(this._postAnimationCallback);
			this._postAnimationCallback = null;
			return true;
		}
		else
			return false;
	};

	async sendPageUpdate(pages) {
		var payload = this.createUpdateUserInputPayload({ outputPages: pages });
		this._userInputLastUpdateTime = payload.timeStamp;
		const res = await xhr.post(this.apiUrl + '/user-input?connection-id=' + this.connectionID, payload);
		this.currentPage && Object.assign(this.currentPage, (res as any).userInput.outputPages[this.book.currentPageNumber]);
		this.processState(res);
		return res;
	}

	getAssetClassInput(fallbackToMock = true) {
		return fallbackToMock && KARMA ? (this.outputControls as any).assetClasses : this.optimizationInputs.assetClasses;
	}

	getAssetClassInputWithoutGroups() {
		const assets = this.getAssetClassInput();
		const traverseAssets = (_assets, result) => {
			_assets.forEach((_asset)=> {
				if (_asset.assetClasses.length > 0) {
					traverseAssets(_asset.assetClasses, result);
				} else {
					result.push(_asset);
				}
			});
			return result;
		};

		return traverseAssets(assets, []);
	}

	async sendAssetClassInputUpdate(assetClasses) {
		const res = await this.sendOptimizationInputsUpdate({assetClasses});
		//this.assetClasses = res.userInput.outputControls.assetClasses;
	}

	getOptimizationInputs() : OptimizationInputs {
		// const savedOptimizationControls = localStorage.getItem("optimizationControls");
		// this.optimizationControls =  savedOptimizationControls ? JSON.parse(savedOptimizationControls) : {};
		return this.optimizationInputs;
	}

	async sendOptimizationInputsUpdate(optimizationInputs) {
		try {
			site.busy = true;

			runInAction(() => {
				this.optimizationInputs = _.merge(this.optimizationInputs, optimizationInputs);
				this._pendingOptimizationInputUpdate = _.merge(this._pendingOptimizationInputUpdate, optimizationInputs);
			});

			// Debounce updates to combine batch updates such as copy/paste operations in asset class table.
			// Create a promise if there is no outstanding request and return it. It will be resolved when the request is complete.
			if (this._pendingOptimizationInput == null) {
				this._pendingOptimizationInput = new Promise((resolve) => {
					this._pendingPromiseResolver = resolve;
				});
			}

			this._sendOptimizationInputsUpdate();

			// DataSources tests generates a back-end error when setting simulation. If this is batched the change message for other update is lost
			// So for now don't batch updates.
			//if (KARMA)
			//	(this._sendOptimizationInputsUpdate as any).flush();

			// Await here so busy indicator is still active.
			return await this._pendingOptimizationInput;
		}
		finally {
			try {
				// Wrap in try to handle promise rejection
				await this.requestSequencer.pendingSequencePromise; // Stay busy if there are requests in the queue
			}
			finally {
				site.busy = false;
			}
		}
	}

	_pendingOptimizationInput = null;
	_pendingPromiseResolver = null;
	_pendingOptimizationInputUpdate = {};
	_sendOptimizationInputsUpdate = _.debounce(async () => {
		let res = null;
		const resolver = this._pendingPromiseResolver; // Back up resolver since a new one might be created before this request is complete.

		try {
			this._pendingOptimizationInput       = null;
			this._pendingPromiseResolver  = null;

			const payload                 = this.createUpdateUserInputPayload({optimizationInputs: this._pendingOptimizationInputUpdate });
			this._pendingOptimizationInputUpdate = {};
			this._userInputLastUpdateTime = payload.timeStamp;
			res                           = await this.requestSequencer.run(() => xhr.post(this.apiUrl + '/user-input?connection-id=' + this.connectionID, payload));
			this.processState(res, true, true);
		}
		finally {
			resolver(res);
		}
	}, 1)

	requestSequencer = utility.requestSequencer();

	getInputOptions() {
		// Mock
		return {
			options: this.inputOptions,
			globalLists: this.globalLists,
			common: {
				userValues: [{name: "uv1", title: "User Value 1"}, {name: "uv2", title: "User Value 2"}],
				repositoryValues: [{name: "rv1", title: "Repository Value 1"}, {name: "rv2", title: "Repository Value 2"}],
				assetClasses: ["Asset 1", "Asset 2"]
			}
		};
	}

	@computed get validations() : {[key: string]: Validation} {
		let messages = this.validationMessages;

		/*
		// Combine additionalAllocation messages that are the same across all paths into a single error path that will be rendered in total row
		let additionalAllocationTargetsAll = messages.filter(message => _.every(message.paths, (path: any) => path.slice(-2)[0] == "additionalAllocations" && _.isEqual(path.slice(-2), message.paths[0].slice(-2))));
		if (additionalAllocationTargetsAll.length > 0)
			additionalAllocationTargetsAll.forEach(target => target.paths = [["assetClasses", ...target.paths[0].slice(-2)]]);*/

		const validations = messages && _.flatMap(messages, validation => validation.paths.map(path =>({path: path.join("."), errorType: validation.messageType, description: validation.messageText})));
		return _.keyBy(validations, 'path') as any;
	}


	clearLocalStorage() {
		localStorage.removeItem("assetClassColumnInput");
		localStorage.removeItem("assetClasses");
	}


	get percentileUnion() {
		return _.sortBy(_.union(..._.flatten(this.pages.map(page =>
			page.selectedViews.filter(view => view.name == "ioBox" || view.name == 'strategySummary').map(
				view => view.name == "ioBox" ? getFullPercentileValues((view.userOptions as ChartUserOptions).percentiles) : (view.userOptions as TabularUserOptions).percentiles)))));
	}

	async updatePercentiles() {
		await this._updatePercentiles(this.percentileUnion);
	}

	async _updatePercentiles(percentiles: number[]) {
		for (let percentile of percentiles) {
			if (this.outputControls.percentiles.findIndex(op => _.isEqual(op, percentile)) < 0 ) {
				await this.updateOutputControls({percentiles: percentiles});
				break;
			};
		}
	}

	async updateOutputControls (outputControls: OutputControls) {
		const payload = this.createUpdateUserInputPayload({ outputControls })
		this._userInputLastUpdateTime = payload.timeStamp;
		const res: any = await xhr.post(this.apiUrl + '/user-input?connection-id=' + this.connectionID, payload);

		if (this.connectionID == null) {
			this.connectionID = res.connectionId;
		}

		this.processState({evaluationDetails: res.evaluationDetails});
	}

	@computed get cteUnion() {
		let unionCtes = [];
		this.pages.forEach(page => page.selectedViews.filter(view => view.name == 'strategySummary').forEach(view => {
			(view.userOptions as TabularUserOptions).ctes.forEach( c => {
				if (unionCtes.findIndex(uc => _.isEqual(uc, c)) == -1) {
					unionCtes.push(c);
				}
			});
		}));
		return unionCtes;
	}

	async updateCtes() {
		for (let cte of this.cteUnion) {
			if (this.outputControls.ctes.findIndex(oc => _.isEqual(oc, cte)) < 0) {
				await this.updateOutputControls({ctes: this.cteUnion});
				break;
			};
		}
	}

	get horizontalAxisDirectionDefault() {
		const {statistic} = this.optimizationInputs.optimizationTarget.riskMeasure;
		return (statistic == 'cte' || statistic == 'percentile') ? 'right' : 'left';
	}

	@action async loadInputState() {
		const state:any = await xhr.get(buildURL( this.apiUrl + '/user-input', {['connection-id']: this.connectionID, enabled: this.connectionID}) );

		if (this.connectionID == null) {
			this.connectionID = state.connectionId;
		}

		if (this.pages.length == 0)
			state.outputPages.forEach(page => this.pages.push(new IOPage(this.book, this, page)));

		action(() => {
			this.additionalPoints = state.additionalPoints;
			this.optimizationControls = state.optimizationControls;
			this.outputControls = state.outputControls;
			this.inputOptions = state.inputOptions;
			this.optimizationInputs = state.optimizationInputs;
			this.validationMessages = state.validationMessages;
			this.statusMessages = state.statusMessages;
			this.errorMessages = state.errorMessages;
			this.requiredOptimization = state.requiredOptimization;
			this.axes = state.axes;
			this.globalLists = state.globalLists;
		})();
		this.loadIOOptions();

	}

	@action loadIOOptions = () => {
		if (this.outputControls.additionalControls != "") {
			const state = JSON.parse(this.outputControls.additionalControls);
			this.relativeEvaluationIndex = state.relativeEvaluationIndex;
			this.enableCache = state.enableCache;
		}
	}

	dominanceKeys = (userOptions) => {
		const datasetEvaluations = 	this.datasetEvaluations(userOptions);
		return _.flatten(datasetEvaluations.map((r, ri) => datasetEvaluations.filter((c, ci) => ci != ri).map(c => this.evaluationDifferencesKey(r.evaluationNumber, c.evaluationNumber))));
	}

	datasetEvaluations(userOptions) {
		let returnData = [];

		userOptions.showAdditionalPoints && ( returnData = returnData.concat(this.additionalPointEvaluations) )
		userOptions.showEfficientFrontier && ( returnData = returnData.concat(this.frontierPointEvaluations) )
		userOptions.showLambdaPoints && ( returnData = returnData.concat(this.lambdaEvaluations) )

		return returnData;
	}

	evaluationHasDetails = (evalIndex) => {
		return this.evaluations[evalIndex] && this.evaluations[evalIndex].assetAllocation != null;
	}

	isOptimizationComplete = () => {
		return this.status !== IOStatus.running && this.status !== IOStatus.finalizable && this.status !== IOStatus.finalizing;
	}

	isFinalizable = () => {
		return this.status === IOStatus.finalizable && !this.isPreOptimizing;
	}

	isFinalizing = () => {
		return this.status === IOStatus.finalizing;
	}

	get isPreOptimizing () {
		return this.statusMessages && this.statusMessages.find(s => s.progress.numerator != s.progress.denominator) != null;
	}

	sequenceCallbacks = [];
	sequeunceInterval = null;
	sequencedUpdate(f: () => void) {
		// Optimization to process updates in sequence while allowing interaction events to be processed in between larger updates.
		// E.g. if 5 updates each taking 100ms are scheduled on the event loop back to back then a UI interaction would have to wait 500ms.
		// If updates are instead queued outside of the event loop then the UI interaction can run after the first update(100 ms)

		return () => {this.sequenceCallbacks.push(f)};
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
		this.eventSource = null;
		clearInterval(this.sequeunceInterval);
		clearTimeout(this._loadTimer);
	}

	async saveIntermediateResult() {
		await xhr.post(this.apiUrl + '/intermediate-result?connection-id=' + this.connectionID, {});
	}

	/* GUI Only */
	@observable isSelected = false;

	/* Karma Test Only, disable saving user input */
	async disableSaveUserInput() {
		await xhr.post(this.apiUrl + '/disable-save-user-input?connection-id=' + this.connectionID, {});
	}

	/* Karma Test Only, reload user input from s3*/
	async reloadUserInput() {
		await xhr.post(this.apiUrl + '/s3-user-input?connection-id=' + this.connectionID, {});
	}

	async newConnection(waitForServerCreated: boolean = false) {
		this.connectionID = await xhr.post<string>(this.apiUrl + `/connections?wait=${waitForServerCreated}`);
	}

	async sessionExtend() {
		try {
			site.busy = true;
			await xhr.post(this.apiUrl + '/extend-session?connection-id=' + this.connectionID, {});
		}
		finally {
			site.busy = false;
		}
	}

	finalizeFrontier = async () => {
		try {
			site.busy = true;
			site.toaster.show({ message: 'The optimization is being finalized.', intent: Intent.SUCCESS, timeout: 10000 });
			await xhr.post(this.apiUrl + '/finalize_frontier?connection-id=' + this.connectionID, {});
		}
		finally {
			site.busy = false;
		}
	}

	async resetLoadedIO() {
		try {
			site.busy = true;
			await xhr.post(this.apiUrl + '/reset-io', {});
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
			await this.newConnection();
			this.initEventSource();
			await when(() => this.serverStatus == ServerStatus.ready); // Proceed after server is started so that subsequent request is less likely to timeout
			await this.sessionExtend();
			this.isReconnecting = false;
		}
		finally {
			site.busy = false;
		}
	}

	@computed get userInputSavedStatus(){
		let result: string = "";
		if(this._userInputLastUpdateTime){
			result = this._userInputLastSavedTime && this._userInputLastUpdateTime.getTime() == this._userInputLastSavedTime.getTime() ?
				`Input Saved at ${this._userInputLastUpdateTime.toString()}` :
				"Saving Input ...";
		}
		return result;
	}

	flatten = (obj) => {
		let result = {};
		let inner = (obj, prefix = "") => {
			_.forEach(obj, (value, key) => {
				if (_.isObject(value)) {
					inner(value, `${ prefix }${ key }.`)
				} else {
					result[`${ prefix }${ key }`] = value
				}
			})
		}
		inner(obj);
		return result;
	}

	get isFavorite() { return settings.favorites.investmentOptimization.indexOf(this.id) !== -1 }

	set isFavorite(value: boolean) {
		if (!value) {
			settings.favorites.investmentOptimization = settings.favorites.investmentOptimization.filter(id => id !== this.id)
		}
		else {
			settings.favorites.investmentOptimization = settings.favorites.investmentOptimization.concat([this.id]);
		}
	}

	@action groupAdditionalAllocation = async (additionalAllocationIndex: number, updateInput: { name?:string, group?:string, color?: string}) => {
		await this.sendOptimizationInputsUpdate({additionalAllocations: { [additionalAllocationIndex]: updateInput }});
	}

	@action getNextGroupColor = () : string => {
		const usedGroupColors = this.optimizationInputs.additionalAllocations.reduce((accu, point)=> {
			const { color: groupColor } = point;
			accu.add(groupColor);
			return accu;
		}, new Set());

		const nextGroupColor = groupPresetColors.find((color) => !usedGroupColors.has(color));
		if (!nextGroupColor) {
			this.errorMessages = ['You\'ve ran out of all groups. Please ungroup one group first.'];
		}

		return nextGroupColor;
	}

	@action importAdditionalAllocations = async (io: InvestmentOptimization, nextGroupColor: string) => {
		try {
			site.busy = true;
			this.pendingUpdate = true;

			const flatAssets = (assets, accu, pathIndex?) => {
				assets.forEach((asset, i) => {
					let newPathIndex;
					if (pathIndex) {
						newPathIndex = [...pathIndex, `${i}`];
					} else {
						newPathIndex = [`${i}`];
					}

					if (asset.assetClasses.length > 0) {
						flatAssets(asset.assetClasses, accu, newPathIndex);
					} else {
						accu.push({ name: asset.returnSource, pathIndex: newPathIndex });
					}
				});
				return accu;
			}
			const assets = flatAssets(this.optimizationInputs.assetClasses, []);

			await xhr.post(`${IO.apiUrlFor(this._id)}/import-sampled-efficient-allocations?connection-id=${this.connectionID}`, {
				importIO: io._id,
				name: io.name,
				assets,
				groupColor: nextGroupColor,
				additionalPointsCount: Object.keys(this.axes.additionalAllocation.values).length,
				timeStamp: new Date()
			});
		} catch(e) {
			if (e.status === 406) {
				this.errorMessages = [`The selected ${utility.formatLabelText(IO.ObjectType).toLowerCase()} is not compatible with current asset class.`];
			}
		}
		finally {
			site.busy = false;
			this.pendingUpdate = false;
		}
	}

	@action getCompareEvalutionsResult = async (minuend, subtrahend) : Promise<EvaluationComparisonResult> => {
		try {
			site.busy = true;
			return await xhr.get(`${this.apiUrl}/compare-evaluations?minuend=${minuend}&subtrahend=${subtrahend}`);
		}
		finally {
			runInAction(()=> {
				site.busy = false;
			});
		}
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

	formatNumberByAllocationIncrement(number: number, isPercentile: boolean = false) : string {
		if (!_.isFinite(number)) {
			return `${number}`;
		}

		const allocationIncrement: number = _.get(this?.optimizationInputs, "optimizationControls.allocationIncrement");
		if (!_.isFinite(allocationIncrement) || allocationIncrement < 0) {
			return isPercentile ? `${number * 100}%` : `${number}`;
		}
		const testAllocationIncrement = `${allocationIncrement}`.match(/(\d*)(\.\d+)?/);
		const fractionDigits = testAllocationIncrement && testAllocationIncrement[2] ? testAllocationIncrement[2].length - 1 : 0;
		const fdPow = fractionDigits > 0 ? Math.pow(10, fractionDigits) : 1;
		const aiPow = allocationIncrement * fdPow;

		let rtnNumber = number;
		if (aiPow != 1) {
			rtnNumber = rtnNumber * fdPow / aiPow;
			rtnNumber = Math.round(rtnNumber) * aiPow;
			rtnNumber = rtnNumber / fdPow;
		}

		return isPercentile ? `${(rtnNumber*100).toFixed(Math.max(fractionDigits-2, 0))}%` : rtnNumber.toFixed(fractionDigits);
	}

	@flow.bound
	*batchExportToCSV(params) {
		try {
			site.busy = true;
			const id: number = yield xhr.post(`${this.apiUrl}/generate-batch-export?connection-id=${this.connectionID}`, params);
			return id;
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*downloadBatchExportFile(fileID, fileName?) {
		let actionUrl = `${this.apiUrl}/download-batch-export-file/${fileID}`;
		if (fileName) {
			if (!fileName.match(/\.csv$/i)) {
				fileName = `${fileName}.csv`;
			}
			actionUrl = `${actionUrl}?fileName=${encodeURIComponent(fileName)}`
		}

		try {
			site.busy = true;
			yield user.waitToken(); // await valid token
			yield utility.downloadFile(xhr.createAuthUrl(actionUrl, true), false);
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*getEligibleBatchExportViews() {
		try {
			site.busy = true;
			const eligibleExportViews = yield xhr.get<string[]>(`${this.apiUrl}/batch-export`);
			return eligibleExportViews.filter((viewName) => this.inputOptions[viewName] && this.inputOptions[viewName]["applicable"]);
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*batchImport(importFileId: string, importFileString: string): Generator<Promise<void>> {
		try {
			site.busy = true;
			yield xhr.post(`${this.apiUrl}/batch-import?connection-id=${this.connectionID}`, importFileId ? {importFileId} : {importFileString});
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*refreshInputStateAfterBatchImport() {
		yield this.loadInputState()
		if (!this.pages || this.pages.length === 0) {
			yield this.createPagesFromTemplate(false);
		}
	}
}
