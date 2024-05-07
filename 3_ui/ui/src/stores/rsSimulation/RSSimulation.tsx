import type {LoadingStatusMessage, Option} from 'components';
import {action, flow, computed, observable, when, makeObservable, runInAction, toJS} from 'mobx';
import type {ProgressMessage} from 'components/system/Progress/model';
import {Reports} from 'stores/rsSimulation/reports/Reports';
import {buildURL, BaseEventSource, reactionToPromise, createBusyAction} from 'utility';
import type {QueryEventSourceData, ValidationMessage} from 'stores';
import {site, user, utility, queryStore, Query, QueryDescriptor, routing, rsSimulationStore, omdb, Simulation, userFileStore, api, i18n} from 'stores';
import {xhr} from '../xhr';
import {ServerStatus} from 'components/system/ExpireDialog/ExpireDialog';
import type {ITemplateFilter, TreeNodeResponse} from './models';
import type {UserInterfaceResponse, ChangeMessage, Action, AdditionalControls} from './models';
import { RWRecalibration } from './rwRecalibration/RWRecalibration';
import { RNRecalibration } from './rnRecalibration/RNRecalibration';
import {BatchExportResultStatus} from '../../components/system/BatchExport/BatchExportTypes';
import type {BatchExportMessage, BatchExportResult} from '../../components/system/BatchExport/BatchExportTypes';
import {BatchImportMessageTypes} from '../../components/system/BatchImport/Types';
import type {BatchImportMessage} from '../../components/system/BatchImport/Types';
import type {IAxes, IModelDefinition} from 'stores/rsSimulation/rwRecalibration/models';
import type {IDynamicStructureRowPath} from 'components/system/inputSpecification/models';
import { UseCaseViewer } from './useCaseViewer/UseCaseViewer';
import { Intent } from '@blueprintjs/core';

export enum RSSimulationStatus {
	WAITING = "Waiting",
	RUNNING = "Running",
	STORING = "Storing",
	FAILED = "Failed",
	COMPLETE = "Complete",
	CALIBRATING = "Calibrating",
	CANCELING = "Canceling"
}

export interface RSSimulationRunningProgressMessage {
	writtenPartiallyCompressedSize: number;
	databaseProcessesReady: number;
	numberScenariosOutputsReadNotLoaded: number;
	databaseProcessesTotal: number;
	numberScenarios: number;
	computationProcessesTotal: number;
	numberDataElements: number;
	maximumComputerMemory: number;
	maximumManagerMemory: number;
	maximumWorkerMemory: number;
	maximumResidentSetSize: number;
	numberScenariosInputsWrittenWaiting: number;
	computerStatus: [
		{
			computerStatus: {
				numberScenariosWriting: number;
				numberScenariosReading: number;
				maximumResidentSetSize: number;
				numberScenariosWaiting: number;
				numberScenariosComputing: number;
			},
			computerIndex: number;
		}
	],
	csvNumberScenariosProcessed: number;
	numberScenariosInputsReading: number;
	numberScenariosOutputsWrittenWaiting: number;
	numberScenariosOutputsReading: number;
	numberScenariosOutputsLoaded: number;
	numberScenariosOutputsWriting: number;
	estimatedTimeToQuery: number;
	estimatedTimeToSaved: number;
	workerStatus: [{
		workerStatus: {
			numberScenariosReadNotLoaded: number;
			numberScenariosReading: number;
			maximumResidentSetSize: number;
			numberScenariosAssignedWaiting: number;
			numberScenarios: number;
			numberScenariosLoaded: number;
		},
		workerIndex: number;
	}],
	numberScenariosInputsReadWaiting: number;
	numberScenariosComputing: number;
	numberScenariosOutputsAssignedWaiting: number;
	computationProcessesReady: number;
	compilerProgress: number;
	partiallyCompressedSize: number;

	numberFirstScenariosComputed: number;
	numberOtherScenariosComputed: number;
	otherComputationTime: number;
	otherNonComputationTime: number;
	firstComputationTime: number;
	firstNonComputationTime: number;

	numberCsvFiles: number;
	numberCsvFilesComplete: number;
}

export interface RSSimulationRunningTextMessage {
	"severity": "debug" | "info" | "warn" | "error";
	"text":  string;
	"timestamp": string;
}

interface FileInformation {
	id?: number;
	bytes: number;
	title: string;
	description: string;
}

export interface FlexibleAxis {
	axis: string;
	prototype: string;
	caseInsensitive: boolean;
	reserved: string[];
	exclusive: string[];
	coordinates: FlexibleAxisCoordinate[];
}

export interface FlexibleAxisCoordinate {
	coordinate: string,
	active: number
}

export interface FlexibleAxisChanges {
	add?: string[];
	delete?: string[];
	rename?: {[oldName: string]: string };
	reorder?: string[];
	active?: boolean[];
}

export interface ManualValidationMessage {
	refreshEnabled: boolean;
	refreshLocked: boolean;
	messages: ValidationMessage[];
}

interface IParametersUserInterface {
	inputOptions: {
		allParameters: IModelDefinition
	};
	globalLists: {};
	axes: IAxes<string>;
	userInputs: { allParameters: any };
	notes: Array<{content: string; path: string[]}>
}

interface IRNRecalibrationUserInterface {
	inputOptions: {
		calibrationInputs: IModelDefinition
	};
	globalLists: {};
	axes: IAxes<string>;
	userInputs: { calibrationInputs: any };
	notes: Array<{content: string; path: string[]}>
}

export class RSSimulation {

	static INPUT_DEFAULT_SUGGESTIONS = {
		tenor: [
			['1y', '2y', '3y', '5y', '7y', '10y', '15y', '30y'],
			['3m', '6m', '1y', '2y', '3y', '5y', '7y', '10y', '15y', '30y'],
			['1y', '5y', '10y', '30y']
		],
		horizon: [
			[0],
			['1y', '5y', '10y', '20y', '30y'],
			['1y', '10y'],
			['1y', '20y'],
			['1y', '30y']
		],
		measure: [
			['InflationRate']
		],
		statistic: [
			['Mean', 'StandardDeviation']
		]
	}

	constructor(id: string, status, sourceType: string, useCase: string, locked?, public onUpdateStatus?: (status: string) => void) {
        makeObservable(this);
        this._id = id;
        this.status = status;
        this.sourceType = sourceType;
		this.useCase = useCase;
		this.locked = locked;
        this.recalibration = new RWRecalibration(id, this);
		this.rnRecalibration = new RNRecalibration(id, this);
    }

	_id;
	sourceType;
	useCase;

	//@observable userOptions: InputSpecificationUserOptions;
	@observable private _userInputs: {
		scenarioContentNodes: any,
		outputOptions: any,
		calibrationNodes: {
			calibration: string,
			enableCustomCalibration: boolean,
			calibrationMeasure: "realWorld" | "riskNeutral"
			enableDirectParameterViewingAndEditing: boolean
		},
		filesToProduceNodes: {
			saveToStorageBlocks: boolean,
			createFilesForDownload: boolean
		}
	};
	@computed get userInputs() { return this._userInputs; }
	set userInputs(updates) { action(() => this._userInputs = updates)(); }

	@observable inputOptions: {scenarioContentNodes: Option, filesToProduceNodes: Option, calibrationNodes: Option};
	@observable validationMessages: ValidationMessage[];
	axes: {[axis: string]: any};

	@observable private _actionFlag: Action = null;
	@computed get actionFlag() { return this._actionFlag; }
	set actionFlag(updates) { action(() => this._actionFlag = updates)(); }

	@observable private _additionalControls: AdditionalControls = null;
	@computed get additionalControls() { return this._additionalControls; }
	set additionalControls(updates) { action(() => this._additionalControls = updates)(); }

	@observable loadingStatusMessages: LoadingStatusMessage[] = []
	@observable outputFiles: FileInformation[] = [];
	@observable progressMessage: ProgressMessage[] = [];
	@observable errorMessages: string[];
	@observable runningMessage: {
		isLoading?: boolean;
		progressMessage?: RSSimulationRunningProgressMessage;
		textMessages: RSSimulationRunningTextMessage[];
	} = { textMessages: []};

	@observable batchExportMessage: {[fileID: number]: BatchExportMessage} = {};
	@observable batchExportUserFiles = {};
	@observable batchExportResult: BatchExportResult = {};
	batchExportRecentFileHandle: FileSystemFileHandle = null;
	@observable batchImportProgressData: BatchImportMessage[] = [];
	@observable.ref batchImportResults = null;

	@observable manualValidationProgress: ProgressMessage = null;
	@observable manualValidationMessage: ManualValidationMessage = null;

	@observable templateProgress: ProgressMessage = null;
	@observable rollForwardProgress: ProgressMessage = null;

	@observable recalibrationProgress: ProgressMessage = null;
	@observable rnRecalibrationProgress: ProgressMessage = null;

	@observable private _status: RSSimulationStatus = RSSimulationStatus.WAITING;
	@observable serverStatus: ServerStatus = ServerStatus.notInitialized;
	@observable isReconnecting;

	@observable parametersKey:string = null; // Used to determine when an update requires invalidating the previous parameters

	@observable private _queryId: string;
	@computed get queryId() { return this._queryId; }
	set queryId(id) { action(() => this._queryId = id)(); }

	sessionID: string = null;
	eventSource = null;

	@observable private _isLoaded = false;
	@computed get isLoaded() { return this._isLoaded; }
	set isLoaded(status) { action(() => this._isLoaded = status)(); }

	@observable isLoadFailed = false;
	@observable.ref recalibration: RWRecalibration       = null;
	@observable.ref rnRecalibration: RNRecalibration = null;

	@observable stepNavigationController = null;
	@observable recentBatchExportUserFile = null;

	@observable parametersUserInterface: IParametersUserInterface = null;
	@observable parametersStepHistory = null;
	@observable.ref useCaseViewer: UseCaseViewer = null;
	@observable.ref reports: Reports = null;


	get id() { return this._id }

	@computed
	get query(): Query | QueryDescriptor {
		return queryStore.querySessions.has(this.queryId) ? queryStore.querySessions.get(this.queryId) : queryStore.descriptors.get(this.queryId);
	}

	get isGEMS() {
		return this.sourceType == "GEMS";
	}

	get isFIRM() {
		return this.sourceType == "FIRM";
	}

	static byteToMegabyte = ( byte: number): number => {
		return byte ? Math.ceil( byte / 104857.6) / 10 : 0;
	}

	static isZipFile(f: FileInformation) {
		return f.title.match(/\.zip$/i);
	}

	static apiUrlFor(id) {
		return `${rsSimulationStore.apiRoute}/${id}`;
	}

	get apiUrl() {
		return RSSimulation.apiUrlFor(this.id);
	}

	static urlFor(id, useCase?) {
		return `${rsSimulationStore.browserUrl}/${id}?${useCase ? `useCase&` : ''}edit`;
	}

	get clientUrl() {
		return RSSimulation.urlFor(this.id, this.useCase);
	}

	get eventSourceUrl() {
		return buildURL(`${this.apiUrl}/status`,
			{sessionId: this.sessionID},
			{[user.VALIDATION_ID]: user.validationId},
			{['accessToken']: user.accessToken});
	}

	@computed get canRun() {
		if (this.isRunning || this.isCanceling)
			return false;
		return this.actionFlag == "full" && !this.isComplete && this.blockedRunMessage == null;
	}

	@computed get canCalibrate() {
		if (this.isCalibrating)
			return true;
		return this?.recalibration?.userInterface?.actionFlag === "full" || this?.rnRecalibration?.userInterface?.actionFlag === "full";
	}

	get blockedRunMessage() {
		return this.status === "Canceling" ? i18n.intl.formatMessage({ defaultMessage: 'Cannot re-run while simulation is being canceled', description: '[RSSimulation] Block run message while simulation is being canceled'}) :
		       this.actionFlag != "full" ? i18n.intl.formatMessage({ defaultMessage: 'No changes since last run', description: '[RSSimulation] Block run message while no changes since last run'}) :
		       _.some(this.validationMessages, v => v.messageType == "Error") ? i18n.intl.formatMessage({ defaultMessage: 'Validation errors must be resolved before simulating', description: '[RSSimulation] Block run message while there are validation errors'}) : null;
	}

	@computed get useRiskNeutralCalibration() {
		return this.userInputs.calibrationNodes.calibrationMeasure == "riskNeutral";
	}

	get activeRecalibration() {
		// TODO rename rw recalibration tool and make this getter for just recalibration;
		return this.useRiskNeutralCalibration ? this.rnRecalibration : this.recalibration;
	}

	@computed get isCalibrating() {
		return this._status == "Calibrating";
	}

	@computed get isRunning() {
		// We might want to split running and storing in the future but storing (AKA queryable) for our purposes is just another phase of running
		return this._status == "Running" || this._status == "Storing";
	}

	@computed get isCanceling() {
		return this._status === "Canceling";
	}

	@computed get isComplete() {
		return this._status == "Complete";
	}

	@computed get isFailed() {
		return this._status == "Failed";
	}

	@computed get status() {
		return this._status;
	}

	set status(newStatus: RSSimulationStatus) {
		runInAction(() => {
			this._status = newStatus
			this.onUpdateStatus && this.onUpdateStatus(newStatus);
		});
	}

	@computed get hadZipFile() {
		return this.outputFiles.filter(f=>RSSimulation.isZipFile(f)).length > 0
	}

	get isTreeNavigator() {
		return _.get(this.stepNavigationController, 'displayType', '') === 'tree-navigator';
	}

	@action
	async loadExistingRSSimulation() {
		this.isLoaded = false;
		this.isLoadFailed = false;
		try {
			this.initEventSource(); // Init event source before startup so we can receive startup progress updates
			this.sessionID = await xhr.get(this.apiUrl + '/startup');
			await when(() => this.serverStatus == ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout

			if (this.isLoadFailed)
				return;

			await this.loadInputState();
			if (this.isComplete)
				await this.loadFileInformation();

			if (this.isFIRM)
				await this.getParametersUserInterface();

			if (this.useCase != null) {
				await this.loadUseCase();
			}

		} catch (e) {
			console.log(e);
			this.isLoadFailed = true;
			throw e;
		} finally {
			this.isLoaded = true;
		}
	}

	@action initEventSource = () => {
		this.loadingStatusMessages = [];
		if (!this.eventSource) {
			this.eventSource = new BaseEventSource({
				url: this.eventSourceUrl,
				onMessage: this.onRecieveEventSourceMessage,
				onError: (e) => {
					if (KARMA) {
						console.log(`eventSource error: ${e.message}`);
					}
					this.eventSource.setEventSourceUrl(this.eventSourceUrl);
				}
			});
		}
	}

	@action onRecieveEventSourceMessage = async (event) => {
		const rsSimulation = this;
		const data = JSON.parse(event.data);
		if (KARMA) {
			console.log(`onRecieveEventSourceMessage = ${data.type}`);
			console.log(JSON.stringify(data));
		}

		if (data.type == "connect") {
			rsSimulation.loadingStatusMessages.push(data);
		}
		else if (data.type == "status") {
			rsSimulation.loadingStatusMessages.push(data);
			if(data.subtype == "Server") {
				rsSimulation.serverStatus = data.data as ServerStatus;
				if (rsSimulation.serverStatus === ServerStatus.closed) {
					this.eventSource.dispose();
				}
			}
			else {
				const newStatus = data.data;
				if (this.isRunning && newStatus === 'Complete' && rsSimulation.query) { // simulation is changed but there is an existing query
					await rsSimulation.query.switchSimulations([rsSimulation._id]);
				}

				if (data.additionalData) {
					const additionalData = JSON.parse(data.additionalData);
					const locked = _.get(additionalData, "locked");
					if (_.isBoolean(locked)) {
						this.locked = locked;
					}
				}

				rsSimulation.status = newStatus;
				if (rsSimulation.isComplete) {
					await rsSimulation.loadFileInformation();
				}
			}
		} else if (data.type == "load") {
			if (data.subtype != "progress") {
				return;
			}
			data.label = i18n.intl.formatMessage({ defaultMessage: 'Preparing model parameter data...', description: '[RSSimulation] Progress message for preparing model parameter data'});
			data.showCurrentMessage = true;
			rsSimulation.loadingStatusMessages.push(data);

		} else if (data.type == "statusMessages") {
			if (data.messages.statusMessages)
				rsSimulation.progressMessage = data.messages.statusMessages;
			if (data.messages.errorMessages) {
				rsSimulation.errorMessages = data.messages.errorMessages;

				if (!this.isLoaded) {
					this.isLoadFailed = true;
					site.toaster.show({message: i18n.intl.formatMessage({ defaultMessage: 'Loading failed with error: {lastErrorMessage}', description: '[RSSimulation] Last error message for loading simulation'}, { lastErrorMessage: _.last(rsSimulation.errorMessages)}), intent: Intent.DANGER, timeout: 0});
					routing.push(api.routing.urls.home);
				}
			}
		} else if (data.type == "progressMessage") {
			let d = data.data;
			_.isString(d) && (d = JSON.parse(d));
			// console.log(d);
			rsSimulation.runningMessage.progressMessage = d;
		} else if (data.type == "batchExport") {
			if (data.subtype == "progress") {
				rsSimulation.batchExportMessage[data.fileID] = data;
			} else if (data.subtype == "exception") {
				let params = JSON.parse(data.data);
				const fileId = params.fileID;
				const message = rsSimulation.batchExportMessage[fileId]
				rsSimulation.batchExportMessage[fileId] = {
					type: data.subtype,
					file_id: fileId,
					label: params.message,
					currentMessage: params.message,
					progress: _.assign({denominator: 1, numerator: 1}, message ? message.progress : null)
				};
				rsSimulation.batchExportResult[fileId] = BatchExportResultStatus.error;
			} else if (data.subtype == "fileInfo") {
				let params = JSON.parse(data.data)
				userFileStore.loadDescriptor(params.userFileID).then(action(file => {
					rsSimulation.recentBatchExportUserFile = file;
					rsSimulation.batchExportRecentFileHandle = null;
					rsSimulation.batchExportUserFiles[params.fileID] = file;
				}));
			} else if (data.subtype == "complete") {
				let params = JSON.parse(data.data);
				rsSimulation.batchExportResult[params.fileID] = BatchExportResultStatus.complete;
			}
		} else if (data.type == rsSimulation.rnRecalibration?.batchExportSseType) {
			rsSimulation.rnRecalibration.handleBatchExportSseEvent(data);
		} else if (data.type == rsSimulation.rnRecalibration?.batchImportSseType) {
			rsSimulation.rnRecalibration.handleBatchImportSseEvent(data);
		} else if (data.type == BatchImportMessageTypes.main) {
			let progress: ProgressMessage = data;

			if (this._isLoaded) {
				rsSimulation.batchImportProgressData.push(data);
			} else {
				progress.label = i18n.intl.formatMessage({ defaultMessage: 'Loading Default Settings...', description: '[RSSimulation] Loading message for loading batch import default settings'});
				rsSimulation.loadingStatusMessages.push(progress);
			}

			if (data.subtype == BatchImportMessageTypes.results) {
				rsSimulation.batchImportResults = data; // For AllParameters to detect changes and resfresh page
				this.getParametersUserInterface(true);
			}
		} else if (data.type == "manualValidation") {
			if (data.subtype == "progress") {
				rsSimulation.manualValidationProgress = data;
			} else if (data.subtype == "messages") {
				this.setManualValidationMessages(JSON.parse(data.data));
			}
		} else if (data.type == "rollForward") {
			if (data.subtype == "progress") {
				rsSimulation.rollForwardProgress = data;
				if (_.isFinite(data.progress?.denominator) && data.progress?.numerator == data.progress?.denominator) {
					this.getParametersUserInterface(true);
				}
			} else if (data.subtype == "exception") {
				rsSimulation.rollForwardProgress = {
					type: data.subtype,
					label: data.data,
					currentMessage: data.data,
					progress: {denominator: 1, numerator: 1}
				};
			}
		} else if (data.type == "template") {
			let progress: ProgressMessage;
			if (data.subtype == "progress") {
				progress = data;
			} else if (data.subtype == "exception") {
				progress = {
					type: data.subtype,
					label: data.data,
					currentMessage: data.data,
					progress: {denominator: 1, numerator: 1}
				};
			}
			if (this._isLoaded) {
				this.templateProgress = progress;
			} else {
				progress.label = i18n.intl.formatMessage({ defaultMessage: 'Loading Template...', description: '[RSSimulation] Loading message for Loading template'});
				rsSimulation.loadingStatusMessages.push(progress);
			}
		} else if (data.type == "recalibration") {
			if (data.subtype == "progress") {
				rsSimulation.recalibrationProgress = data;
			}
		} else if (data.type == "rn_recalibration") {
			if (data.subtype == "progress") {
				rsSimulation.rnRecalibrationProgress = data;
			}
		} else if (data.type == "reports") {
			if (data.subtype == "progress") {
				this.reports?.handleProgressMessage(data);
			}
		} else if (data.type == "textMessage") {
			let d = data.data;
			_.isString(d) && (d = JSON.parse(d));
			rsSimulation.runningMessage.textMessages.push(d);
		} else if (data.type == "zipMessage") {
			rsSimulation.addZipFileInformation(data.data);
		}
		else if (data.type === 'useCaseQuerying') {
			await when(() => this.useCaseViewer && this.useCaseViewer.isLoaded);

			if (data.subtype === 'forward') {
				if (data.data) {
					const queryEvent = JSON.parse(data.data);
					const { queryId } = queryEvent;

					if (this.useCaseViewer && this.useCaseViewer.queriesProgress[queryId]) {
						if (queryEvent.progress) {
							const progress = Object.values((queryEvent as QueryEventSourceData).progress)[0];
							if (progress.log && progress.log[0])
								this.useCaseViewer.queriesProgress[queryId].lastQueryProgressLogMessage = progress.log[0];
						}

						if (queryEvent.hasResult)
							this.useCaseViewer.queriesProgress[queryId].isComplete = true;
					}
				}
			} else if(data.subtype === 'readyToRun') {
				if (data.data) {
					const querySpecificationToQueryId = JSON.parse(data.data);
					_.forOwn(querySpecificationToQueryId, async (queryId, querySpecificationFileName) => {
						await this.useCaseViewer.initializeQuery(queryId, querySpecificationFileName);
					});
				}
			} else if(data.subtype === 'complete') {
				if (this.useCaseViewer) {
					this.useCaseViewer.closeQueryProgress();
					this.useCaseViewer.areQueriesComplete = true;
				}
			} else {
				const useCaseQueries = data.data ? JSON.parse(data.data) : null;
				this.useCaseViewer.areQueriesRunning = true;
				this.useCaseViewer.areQueriesComplete = false;
				if (useCaseQueries && !_.isEmpty(useCaseQueries)) {
					await this.useCaseViewer.setQueries(useCaseQueries);
				}
			}
		} else if (data.type == "queryViewer") {
			if (data.subtype == "progress") {
				data.label = data.currentMessage;
				rsSimulation.loadingStatusMessages.push(data);
			}
		} else {
			console.warn("Unexpected message type encountered in RSSimulation::onRecieveEventSourceMessage()")
		}
	}

	@action async loadInputState() {
		const state: any = await xhr.get(this.apiUrl + '/user-interface');
		runInAction(() => {
			this.inputOptions       = state.inputOptions;
			this.axes               = state.axes;
			this.userInputs         = state.userInputs;
			this.actionFlag         = state.actionFlag;
			this.validationMessages = state.validationMessages;

			if (state.additionalControls != null) {
				const additionalControlsDefault: AdditionalControls = {
					navigatorType: this.isFIRM ? 'tree-navigator': 'step-by-step',
					showValidationSetting: null,
					showAddressPath: this.isFIRM,
					showNoteEditor: false,
					noteEditorReadonly: true
				};
				this.additionalControls = Object.assign({}, additionalControlsDefault, JSON.parse(`${state.additionalControls || "{}"}`));
			}
		})
	}

	@action sendInputsUpdate = async (update: Object) => {
		try {
			site.busy = true;
			this.userInputs = _.merge(this.userInputs, update);
			const state = await xhr.post<UserInterfaceResponse>(this.apiUrl + '/user-interface', {userInput: JSON.stringify(update), timeStamp: new Date()});
			this.processState(state);
			if (_.has(update, 'calibrationNodes.startingDate')) {
				if (await site.confirm(i18n.intl.formatMessage({ defaultMessage: 'Overwrite existing recalibration parameters with data from template?', description: '[RSSimulation] Confirm message for overwrite existing recalibration parameters with data from template'}))){
					try {
						await xhr.post(this.recalibration.apiUrl + '/load-template', {},{allowRetry: true});
						await this.loadInputState();
						this.recalibration.getRecalibration(true);
						this.getParametersUserInterface();
						site.busy = true;
					} finally {
						site.busy = false;
					}
				}
			}
		}
		finally {
			site.busy = false;
		}
	}

	@computed get useDefinitionFile() {
		return _.get(this.userInputs, ["definitionFileOptions", "definitionFile"]) != null;
	}

	@action importDFA = async (fileID: string) => {
		try {
			await xhr.post(this.recalibration.apiUrl + '/import-dfa', { 'fileId': fileID });
			this.recalibration.getRecalibration(true);
			this.getParametersUserInterface();
			site.busy = true;
		} finally {
			site.busy = false;
		}
	}

	@action updateAdditionalControls = async (update: AdditionalControls) => {
		this.additionalControls = _.assign({}, this.additionalControls, update);
		try {
			site.busy = true;
			this.userInputs = _.merge(this.userInputs, update);
			const state = await xhr.post<UserInterfaceResponse>(this.apiUrl + '/user-interface', {userInput: "{}", additionalControls: JSON.stringify(this.additionalControls), timeStamp: new Date()});
			this.processState(state);
		}
		finally {
			site.busy = false;
		}
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

	@action processState(state: UserInterfaceResponse) {
		if (state.changeMessages) {
			state.changeMessages.forEach((m: ChangeMessage) => {
				_.set(this.userInputs, m.targetPath, m.targetValue);
			})
		}

		if (state.actionFlag != null)
			this.actionFlag = state.actionFlag;

		if(state.validationMessages)
			this.validationMessages = state.validationMessages;

		if (state.additionalControls != null)
			this.additionalControls = JSON.parse(`${state.additionalControls || "{}"}`);

		if (state.inputOptions) {
			let flattenedResult = this.flatten(state.inputOptions);
			Object.keys(flattenedResult).forEach(k => {
				let keys = k.split(".");
				let currentNode = this.inputOptions[keys[0]]
				keys.slice(1, -1).forEach(element => {
					currentNode = currentNode.options.find((c) => c.name == element)
				})
				currentNode[keys[keys.length - 1]] = flattenedResult[k]
			})
		}
	}

	@action navigateToPage = (page) => {
		routing.push(this.clientUrl + "&page=" + page);
	}

	@flow.bound
	selectTreeNode = function* (path: string[], isParameters: boolean, forceUpdate: boolean = false) {
		if (isParameters) {
			if (_.first(path) != "allParameters") {
				throw Error("Path not supported in RSSimulation.selectTreeNode()");
			}
		}

		const response: TreeNodeResponse = yield xhr.post(this.apiUrl + "/user-interface/select-tree-node", {path});
		const { notes } = response;
		if (notes && notes.length > 0) {
			this.replaceOrAddParameterNote(notes[0])
		}
		return response;
	}

	@flow.bound
	selectCalibrationInputsTreeNode = function* (path: string[]) {
		return yield xhr.post(this.apiUrl + "/rn-recalibrate/select-tree-node", {path});
	}

	getNote(path: string[]) {
		return this.parametersUserInterface.notes.find(note => _.isEqual(note.path, path))?.content || "";
	}

	editNote = createBusyAction(
		flow(
			function* (parameters: { path: string[], note: string }) {
				const { path, note } = parameters;
				yield xhr.post(this.apiUrl + "/user-interface/edit-note", {path, note});
				this.replaceOrAddParameterNote({ path, content: note });
			}.bind(this)
		)
	)

	@action
	replaceOrAddParameterNote = (newNote) => {
		const { notes } = this.parametersUserInterface;
		const noteIndex = notes.findIndex(note => _.isEqual(note.path, newNote.path));
		if (noteIndex >= 0) {
			notes.splice(noteIndex, 1, newNote);
		} else {
			notes.push(newNote);
		}
	}

	@flow.bound
	*getParametersUserInterface(invalidateParameters: boolean = false) {
		const response = yield xhr.get<IParametersUserInterface>(this.apiUrl + "/parameters/user-interface");
		if (_.has(response, "undoRedo")) {
			this.parametersStepHistory = response["undoRedo"];
			delete response["undoRedo"];
		}

		if (!_.has(response, "notes")) {
			response.notes = [];
		}

		this.parametersUserInterface = response;

		invalidateParameters && this.invalidateParameters();
	}

	updateParametersUserInterface = async (update: Object, treeNodePath?: string[], dynamicStructureRowPaths?: Array<IDynamicStructureRowPath>) => {
		site.busy = true;
		return await xhr.post<{
			axes?: any;
			inputOptions?: any;
			userInputs?: any;
			notes?: any;
			treeInputOptions?: any;
			resetValidation?: boolean;
		}>(`${this.apiUrl}/parameters/user-interface`,{
			userInput: JSON.stringify(update),
			treeNodePath: treeNodePath,
			dynamicStructureRowPaths: dynamicStructureRowPaths,
			timeStamp: new Date()
		}).then(action(response => {
			if (_.has(response, "undoRedo")) {
				this.parametersStepHistory = response["undoRedo"];
				delete response["undoRedo"];
			}

			if (response?.treeInputOptions?.allParameters) {
				// Replace the parameter tree wholesale to reflect nodes being added or deleted.
				this.parametersUserInterface.inputOptions.allParameters = response.treeInputOptions.allParameters;
			}

			if (response.resetValidation === true &&
				this.manualValidationMessage?.refreshLocked === false
			) {
				this.manualValidationMessage.refreshEnabled = true;
			}

			return response;
		})).finally(action (() => {
			site.busy = false;
		}));
	}

	@action getDynamicStructureContent = async (selectedTreeNodePath: string[], dynamicNodePath: string[], innerPath: string[], isParameters: boolean) => {
		if (isParameters) {
			return xhr.get<TreeNodeResponse>(this.apiUrl + `/user-interface/dynamic-structure-content/${selectedTreeNodePath.join(".")}/${dynamicNodePath.join(".")}/${innerPath.join(".")}`);
		}
		else {
			throw Error("RSSimulation.getDynamicStructureContent currently only supports the parameters user interface")
		}
	}

	@observable private locked:boolean;
	@computed get inputsLocked() {
		return this.locked === true;
	}
	set inputsLocked(locked) {
		runInAction(() => this.locked = locked === true);
		omdb.updatePartial(Simulation.ObjectType, this._id, {locked})
	}

	@computed get isShowLockCover() {
		return this.inputsLocked || (this.isRunning && this.stepNavigationController.activeItem.name != "simulation");
	}

	@action
	unlockInputs = () => {
		this.inputsLocked = false ;
	}

	@action run = async () => {
		if (!site.busy) { // await site.confirm(`Start Simulation?`))

			this.progressMessage = [];
			this.errorMessages = [];
			this.runningMessage = { textMessages: []};
			this.status = RSSimulationStatus.RUNNING;
			try {
				site.busy = true;
				if (this.useCase) {
					const firstOutputPageIndex = this.useCaseViewer.book.pages.findIndex(page => _.some(page.views, view => !this.useCaseViewer.views[view.view].isInput))
					if (firstOutputPageIndex != -1)
						this.useCaseViewer.book.navigateToPage(firstOutputPageIndex);
				} else {
					this.stepNavigationController?.setActiveByPathString("simulation");
					this.navigateToPage("simulation");
				}
				await xhr.post(this.apiUrl, {});
			} finally {
				site.busy = false;
			}
		}
	}

	@action cancel = async () => {
		await xhr.post(this.apiUrl + "/cancel", {});
	}

	@action calibrate = createBusyAction(async () => {
		this.errorMessages = [];
		await this.recalibration.calibrate();

		// let currentPath = this?.stepNavigationController?.activeItem?.itemPath;
		// if (currentPath && currentPath[0] != "calibration")
		// 	this.navigateToPage("calibration");
	});

	@flow.bound
	*runRNCalibration() {
		this.errorMessages = [];
		try {
			site.busy = true;
			yield this.rnRecalibration.calibrate();
		} finally {
			site.busy = false;
		}
	}

	@action cancelCalibration = async () => {
		await this.recalibration.cancel();
	}

	@flow.bound
	*cancelRNCalibration() {
		yield this.rnRecalibration.cancel();
	}

	@action async loadFileInformation() {
		this.outputFiles = await xhr.get(this.apiUrl + "/file-information");
	}

	@action addZipFileInformation(f: FileInformation) {
		let newFileAry = this.outputFiles.filter(f=>!RSSimulation.isZipFile(f));
		newFileAry.push(f);
		this.outputFiles = newFileAry;
	}

	async downloadFile(f: FileInformation) {
		try {
			site.busy = true;

			await user.waitToken(); // await valid token
			await utility.downloadFile(xhr.createAuthUrl(`${this.apiUrl}/download/${f.id}`, true), false);

		}
		finally {
			site.busy = false;
		}
	}

	async sessionExtend() {
		try {
			site.busy = true;
			this.sessionID = await xhr.post(this.apiUrl + '/extend-session', { sessionId: this.sessionID }, { allowRetry: true });
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*sessionReconnect() {
		try {
			site.busy = true;
			this.isReconnecting = true;

			this.eventSource.dispose();
			this.eventSource = null;
			yield xhr.get(this.apiUrl + '/startup', {});
			this.initEventSource();
			yield reactionToPromise(() => this.serverStatus, ServerStatus.created); // Proceed after server is started so that subsequent request is less likely to timeout
			yield this.sessionExtend();
			this.isReconnecting = false;

			// Reinitialize the recalibration tool after reconnect since the back-end only loads the recalibration tool when requested.
			// We're doing the recalibration tool initialization on the front-end instead of in /startup on the back-end to not force the user to wait on the targets tab while initializing.
			const itemPath = _.get(this.stepNavigationController, "activeItem.itemPath.0", "");
			if (itemPath == "targets" || itemPath == "calibrationInputs" ) {
				const recalibration = itemPath == "targets" ? this.recalibration : this.rnRecalibration;

				const activeItem = this.stepNavigationController.activeItem;
				recalibration.isLoaded = false;
				yield recalibration.getRecalibration(true)
				!recalibration.isInitialized && (yield reactionToPromise(() => recalibration.isInitialized, true));
				this.stepNavigationController.setActiveByItem(activeItem);
			}
		}
		finally {
			site.busy = false;
		}
	}

	hasQueryResult() : boolean {
		return !!(this.query && this.query.hasResult);
	}

	async exportInputs() {
		try {
			site.busy = true;

			await user.waitToken(); // await valid token
			await utility.downloadFile(`${this.apiUrl}/export-inputs`);

		}
		finally {
			site.busy = false;
		}
	}

	async batchExport(path: string[], append = false, filename = "") {
		try {
			site.busy = true;

			if (!append)
				this.recentBatchExportUserFile = null;

			const id: number = await xhr.post(`${this.apiUrl}/generate-batch-export`, {path, append, filename: filename || ""});
			return id;
		}
		finally {
			site.busy = false;
		}
	}

	async appendToRecentFile(path: string[]) {
		if (!this.batchExportRecentFileHandle && this.recentBatchExportUserFile == null) {
			const [fileHandle] = await window.showOpenFilePicker({
				types: [
					{
						description: "CSV",
						accept:      {
							"text/csv": [".csv"],
						},
					}
				]
			});

			this.batchExportRecentFileHandle = fileHandle;
			this.recentBatchExportUserFile = null;
		}

		return this.batchExport(path, true, this.recentBatchExportUserFile?._id);
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
	*downloadAndAppendToExportFile(fileID) {
		let actionUrl = `${this.apiUrl}/download-batch-export-file/${fileID}`

		try {
			site.busy = true;
			const newExportResult: any = yield xhr.get(actionUrl, null, null, true);
			let file = yield this.batchExportRecentFileHandle.getFile();

			const writableStream = yield (this.batchExportRecentFileHandle as any).createWritable({keepExistingData:true});
			let offset = (yield this.batchExportRecentFileHandle.getFile()).size;
			writableStream.seek(offset)
			yield writableStream.write("\n" + newExportResult.text);
			yield writableStream.close();

			return file.name;
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*batchImport(importFileId: string, importFileString: string): Generator<Promise<void>> {
		try {
			site.busy = true;
			yield xhr.post(`${this.apiUrl}/batch-import`, importFileId ? {importFileId} : {importFileString});
		}
		finally {
			site.busy = false;
		}
	}

	@action async loadLogMessages(logLevel = "debug") {
		try {
			site.busy = true;
			this.runningMessage.isLoading = true;
			this.runningMessage.textMessages = [];
			const rawLog: string = await xhr.get(`${this.apiUrl}/log?level=${logLevel}`);
			this.runningMessage.textMessages = rawLog.split("\n").map(logEntry => {
				const parsedEntry = JSON.parse(logEntry);
				return {severity: parsedEntry.level, text: parsedEntry.message, timestamp: parsedEntry.timestamp };
			});
		}
		finally {
			this.runningMessage.isLoading = false;
			site.busy = false;
		}
	}



	async getFlexibleAxes(axis?:string): Promise<FlexibleAxis[]> {
		site.busy = true;
		return xhr.get<FlexibleAxis[]>(`${this.apiUrl}/flexible_axes${axis?`?axis=${axis}`:''}`).finally(()=>{
			site.busy = false;
		});
	}

	async saveFlexibleAxes(changes: {[axisName: string]: FlexibleAxisChanges}): Promise<any> {
		site.busy = true;
		return xhr.post(`${this.apiUrl}/flexible_axes`, changes).then(async (result) => {
			await this.getParametersUserInterface(true);
			return result;
		}).finally(()=>{
			site.busy = false;
		});
	}

	async updateExistFlexibleAxisCoordinate(axis: string, updates: {
		coordinate: string,
		newName?: string,
		deleted?: boolean,
		active?: boolean
	}[]) {
		if (!updates?.length) { return; }

		const axes = await this.getFlexibleAxes(axis);
		const coordinates :{coordinate: string, active: number}[] =
			_.find(axes, a => a.axis == axis)?.coordinates;

		if (!coordinates?.length) { return; }

		const deleteCoordinates = _.remove(
			coordinates,
			(c) => _.some(updates, u => u.coordinate == c.coordinate && u.deleted === true)
		);

		const renameCoordinates = {};
		_.forEach(updates, update => {
			const coordinateName = update.coordinate;
			const target = _.find(coordinates, c => c.coordinate == coordinateName);
			if (update.deleted === true || !target) {
				return;
			}
			if (update.newName) {
				const updateName = update.newName;
				target.coordinate = updateName;
				renameCoordinates[coordinateName] = updateName;
			}
			if (update.active != null) {
				target.active = update.active ? 1 : 0;
			}
		});

		const updateMap: FlexibleAxisChanges = {
			reorder: _.map(coordinates, c => c.coordinate),
			active: _.map(coordinates, c => c.active == 1)
		}

		if (deleteCoordinates.length) {
			updateMap.delete = _.map(deleteCoordinates, c=> c.coordinate);
		}

		if (Object.keys(renameCoordinates).length) {
			updateMap.rename = renameCoordinates;
		}

		return this.saveFlexibleAxes({[axis]: updateMap})

	}

	@action startCheckValidationMessages() {
		if (!this.isFIRM)
			return;

		this.manualValidationProgress = null;
		this.manualValidationMessage = null;
		xhr.post(`${this.apiUrl}/validate`);
	}

	async getManualValidationMessages() {
		if (!this.isFIRM)
			return;

		if (this.additionalControls.showValidationSetting === false)
			this.updateAdditionalControls({showValidationSetting: null});

		this.setManualValidationMessages(await xhr.get<any>(this.apiUrl + '/validation-messages'));
	}

	@action setManualValidationMessages = (result) => {
		this.manualValidationMessage = null;

		if (!(result?.messages?.length)) {
			return;
		}
		if (!_.isArray(result.messages)) {
			if (result.messages.messageText) {
				result.messages = [result.messages];
			} else {
				return;
			}
		}

		const messages = _.map<{
			"messageType": string;
			"messageText": string;
			"paths": {
				name: string;
				title: string;
			}[][];
		}, ValidationMessage>(result.messages, r => {
			let names = [];
			let titles = [];

			_.forEach(r.paths, path => {
				names.push(["allParameters", ...path.map(p => p.name)]);
				titles.push(["All Parameters", ...path.map(p => p.title)]);
			});
			return {
				messageType: r.messageType,
				messageText: r.messageText,
				paths : names,
				titles: titles
			}
		});

		this.manualValidationMessage = {
			refreshEnabled: result.refreshEnabled,
			refreshLocked: result.refreshLocked,
			messages: messages
		}
	}

	@action sendRollForward = (params: {year: number, month: number, updateTemplate:boolean}) => {
		this.rollForwardProgress = {type: '', label: null, currentMessage: "Starting...", progress: {denominator: 1, numerator: 0}};
		xhr.post(`${this.apiUrl}/roll-forward`, params);
	}

	invalidateParameters() {
		this.parametersKey = uuid.v4();
	}

	async setTemplate(templateFilter?: ITemplateFilter) {
		return xhr.post<boolean>(`${this.apiUrl}/template`, templateFilter);
	}

	@flow.bound
	*loadUseCase() {
		//const useCaseState = await xhr.get<IAPIUseCase>(`${this.apiUrl}/use-case`);

		/* MOCK
		const useCaseState: IAPIUseCase = {
			"viewDefinitions":         {
				"inputs":  [
					{
						"title": "Economies to Run",
						"nodes": ["Company Inputs/Economic Variables and Financial Markets/Economies to Run"]
					}
				],
				"outputs": [
					{
						"title":                  "Table of Market Value",
						"queryView":              "Pivot",
						"queryID":                "6477f14b9b49c4123beb14b0"
					}
				]
			},
			pages: [{
				title: "Test Page Input",
				views: [{title: "Economies to Run", view: "Economies to Run"}]
			},
			{
				title: "Test Page Output",
				views: [{title: "Table of Market Value", view: "Table of Market Value"}]
			}]
		}*/

		if (!this.useCaseViewer) {
			this.useCaseViewer = new UseCaseViewer(this);
		}

		yield this.useCaseViewer.loadPages();
	}

	/*
	 only for testing
	*/
	@flow.bound
	*createLayoutTemplate() {
		try {
			site.busy = true;
			yield xhr.post(`${this.apiUrl}/new-query`);
		}
		finally {
			site.busy = false;
		}
	}

	cleanup() {
		this.eventSource && this.eventSource.dispose();
		this.eventSource = null;
	}
}
