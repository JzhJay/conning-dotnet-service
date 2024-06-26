import {IconName, Intent, MaybeElement} from '@blueprintjs/core';
import {action, observable, makeObservable, computed, runInAction, when, flow} from 'mobx';

import {xhr} from '../../xhr';
import {RSSimulation} from '../RSSimulation';
import { BatchExportResultStatus } from 'components/system/BatchExport/BatchExportTypes';
import type {BatchExportMessage, BatchExportResult} from 'components/system/BatchExport/BatchExportTypes';
import { BatchImportMessageTypes } from 'components/system/BatchImport/Types';
import type {BatchImportMessage } from 'components/system/BatchImport/Types';
import type {ProgressMessage} from 'components/system/Progress/model';
import type {LoadingStatusMessage} from 'components';
import type {IModelDefinition, IModelOptimizers, IModelWebLocalDataset} from './models';
import {ChartUserOptions, i18n} from 'stores';
import {user, utility, site, GridlinesType, simulationStore, userFileStore} from 'stores';
import {ChangeMessage} from 'stores/rsSimulation/models';

export interface RNRecalibrationDialogConfig {
	icon?: IconName | MaybeElement,
	title: string,
	component: (rnRecalibration: RNRecalibration) => JSX.Element,
	dialogWidth?: number,
	onClose?: (rnRecalibration: RNRecalibration) => void
}

export class RNRecalibration {
	constructor(private id: string, public rsSimulation: RSSimulation) {
        makeObservable(this);
    }
	@observable private _isInitialized: boolean = false;
	@computed get isInitialized() { return this._isInitialized; }
	set isInitialized(status) { runInAction(() => this._isInitialized = status); }

	@observable private _isLoaded: boolean = false;
	@computed get isLoaded() { return this._isLoaded; }
	set isLoaded(status) { runInAction(() => this._isLoaded = status); }

	@observable showTree: boolean = false;
	@observable showAdvancedSettings: boolean = true;

	@observable metadata: {[key:string]: {}};
	@observable settings: {[key:string]: string[]}[];
	@observable userInputs: {[key:string]: {}};

	@observable axisOrganization = null;

	@observable isUserInterfaceLoading: boolean = false;
	@observable _userInterface: IModelOptimizers = null;
	@computed get userInterface() { return this._userInterface; }
	set userInterface(updates) { action(() => this._userInterface = updates)(); }

	@observable chartSettings = {};
	@observable webLocalDatasets: { [tableName: string]: IModelWebLocalDataset } = {};
	@observable actionDialog:RNRecalibrationDialogConfig                         = null
	@observable batchExportMessage: {[fileID: number]: BatchExportMessage} = {};
	@observable batchExportUserFiles = {};
	@observable batchExportResult: BatchExportResult = {};
	@observable recentBatchExportUserFile = null;
	@observable batchImportProgressData: BatchImportMessage[] = [];
	@observable batchExportViewsLabels = {};
	@observable loadingStatusMessages: LoadingStatusMessage[] = []
	@observable.ref batchImportResults = null;
	batchExportRecentFileHandle: FileSystemFileHandle = null;
	batchExportSseType = 'rnBatchExport';
	batchImportSseType = 'rnBatchImport';

	get apiUrl() {
		return `${RSSimulation.apiUrlFor(this.id)}/rn-recalibrate`;
	}

	@flow.bound
	*getRecalibration(forceUpdate = false) {
		this.isInitialized = false;
		this.rsSimulation.rnRecalibrationProgress = {
			progress: {denominator: 1, numerator: 0},
			subtype: "progress",
			type: "rn_recalibration",
			currentMessage: "Starting Risk Neutral Recalibration ..."
		} as any;

		if (yield xhr.get(this.apiUrl)) {
			yield this.getUserInterface(forceUpdate);
			this.rsSimulation.rnRecalibrationProgress = null;
			this.isInitialized = true;
			return;
		}

		when(() =>
				this.rsSimulation.rnRecalibrationProgress?.progress.denominator > 0 &&
				this.rsSimulation.rnRecalibrationProgress?.progress.numerator == this.rsSimulation.rnRecalibrationProgress?.progress.denominator,
			action(() => {
				this.isInitialized = true;
				this.getUserInterface(forceUpdate);
			})
		);
	}

	@flow.bound
	*calibrate() {
		this.userInterface.actionFlag = "none";
		yield xhr.post(`${this.apiUrl}/run`);
		this.userInterface.hasCalibrationChanges = true;
	}

	@flow.bound
	*cancel() {
		yield xhr.post(`${this.apiUrl}/cancel`);
	}

	@flow.bound
	*acceptChanges() {
		yield xhr.post(`${this.apiUrl}/accept-calibration`);
		this.userInterface.hasCalibrationChanges = false;
		site.toaster.show({intent: Intent.SUCCESS, message: "Calibration changes have been saved."});
	}

	//TODO: REMOVE?
	convertJuliaName(name) {
		return name.replace(/[a-z][A-Z]/g, (match)=> {
			return `${match.substr(0,1)}_${match.substr(1,1)}`;
		}).toLowerCase();
	}

	@action toggleTree() {
		this.showTree = !this.showTree ;
	}

	toggleAdvancedSettings() {
		this.showAdvancedSettings = !this.showAdvancedSettings;
	}

	isChartDisplay(tableName) {
		const key = `${tableName}.showChart`;
		return _.get<boolean>(this.webLocalDatasets as any, key, true) !== false;
	}

	@action toggleChartDisplay(tableName, isShow?: boolean) {
		const key = `${tableName}.showChart`;
		if (isShow == null) {
			isShow = this.isChartDisplay(tableName) === false;
		}
		_.set(this.webLocalDatasets, key, isShow);
	}

	getDataSet(tableName) {
		return [];
	}

	setActionFlag() {
		this.userInterface.actionFlag = "full";
	}

	@action setActionFlagAndValidation(validationMessages) {
		this.setActionFlag();
		this.userInterface.validationMessages = validationMessages;
	}

	@action getChartUserOptions = (tableName: string): ChartUserOptions => {
		const key = `${tableName}.chartUserOptions`;
		let cuo = _.get<ChartUserOptions>(this.webLocalDatasets as any, key, null);
		if (!cuo) {
			cuo = {
				// ChartUserOptions
				panOrZoom:               'zoom',
				fontSize:                14,
				fontSizes:               [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96],
				isInverted:              false,
				percentiles:             [0, 1, 5, 25, 50],
				colorSet:                ["0,98,37", "138,32,3"],
				gridLine:                GridlinesType.Horizontal,
				showMeanValues:          true,
				verticalAxisDirection:   'top',
				horizontalAxisDirection: 'left',
				plotWidth:               0,
				plotHeight:              0,
				highchartsOptions:       null
			};
			_.set(this.webLocalDatasets, key, cuo);
		}

		return cuo;
	}

	updateChartUserOptions = (tableName: string, updateObj: any) => {
		let cuo = this.getChartUserOptions(tableName);
		_.assign(cuo, updateObj);
	}

	@action getUserInterface = async (forceUpdate: boolean = false) => {
		if (!this.userInterface || forceUpdate) {
			this.isUserInterfaceLoading = true;
			this.userInterface          = await xhr.get(`${this.apiUrl}/user-interface`);
			this.isUserInterfaceLoading = false;
			this.isLoaded = true;
		}
		return this.userInterface;
	}

	updateUserInterface = async <T>(update: Object) => {
		site.busy = true;
		return await xhr.post<{
			actionFlag?: string;
			hasCalibrationChanges?: boolean;
			validationMessages?: any[];
			axes?: any;
			inputOptions?: any;
			userInputs?: any;
			changeMessages: Array<{ messageType: string; sourcePath: any[]; targetPath: any[]; targetValue: T; }>;
		}>(`${this.apiUrl}/user-interface`,{
			userInput: JSON.stringify(update),
			timeStamp: new Date()
		}).then(action(response => {
			if (response.changeMessages) {
				response.changeMessages.forEach((m: ChangeMessage) => {
					_.set(this.userInterface.userInputs, m.targetPath, m.targetValue);
				})
			}

			if (response.actionFlag != null)
				this.userInterface.actionFlag = response.actionFlag;

			if (response.hasCalibrationChanges != null)
				this.userInterface.hasCalibrationChanges = response.hasCalibrationChanges;

			if (response.validationMessages)
				this.userInterface.validationMessages = response.validationMessages;

			if (response.inputOptions) {
				// Merge new settings into input options
				this.updateInputOption(this.userInterface?.inputOptions, response?.inputOptions);
			}

			if (response.axes) {
				this.userInterface.axes = response.axes;
			}

			return response;
		})).finally(action (() => {
			site.busy = false;
		}));
	}

	updateInputOption = (inputOptions: {[name: string]: IModelDefinition}, updates: any):void => {

		const flatten = (obj) => {
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
		};

		let flattenedResult = flatten(updates);
		Object.keys(flattenedResult).forEach(k => {
			let keys = k.split(".");
			let currentNode = inputOptions[keys[0]]
			keys.slice(1, -1).forEach(element => {
				currentNode = currentNode.options.find((c) => c.name == element)
			})
			currentNode[keys[keys.length - 1]] = flattenedResult[k]
		});
	}

	openDialog(config: RNRecalibrationDialogConfig) {
		if (config) {
			this.actionDialog = config;
		}
	}

	closeDialog() {
		this.actionDialog = null;
	}

	@action
	getBatchExportViews(nodePathNames) {
		const executableItem = this.rsSimulation.stepNavigationController.getExecutableItemByPathStringAry(nodePathNames);
		return executableItem.executableItems.filter(item => !item.hasItems).map(item => item.itemPath).map((path) => {
			let node = this.rsSimulation.rnRecalibration.userInterface.inputOptions.calibrationInputs;
			let namePath = [];
			const displayPath = [];

			for (const p of path.slice(1)) {
				node = node.options.find(o => o.name == p);
				namePath.push(node.name);
				displayPath.push(node.title);
			}

			const finalPath = namePath.join(".");
			this.batchExportViewsLabels[finalPath] = displayPath.join("/");
			return finalPath;
		});
	}

	getDefaultBatchExportFileName() {
		const simulation = simulationStore.simulations.get(this.rsSimulation.id);
		return `${_.last(simulation.name.split("/"))}_batch_export`;
	}

	@flow.bound
	*batchExportByPath(path: string[]) {
		return yield this.batchExport({
			filename: this.getDefaultBatchExportFileName(),
			append: false,
			export_views: this.getBatchExportViews(path),
			save_user_file: false
		});
	}

	@flow.bound
	*batchExport(exportSettings) {
		try {
			site.busy = true;

			if (!exportSettings.append) {
				this.recentBatchExportUserFile = null;
			}

			return yield xhr.post(`${this.apiUrl}/batch-export`, exportSettings);
		}
		finally {
			site.busy = false;
		}
	}

	@flow.bound
	*appendToRecentFile(path: string[]) {
		if (!this.batchExportRecentFileHandle && this.recentBatchExportUserFile == null) {
			const [fileHandle] = yield window.showOpenFilePicker({
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

		return yield this.batchExport({
			export_views: this.getBatchExportViews(path),
			filename: this.recentBatchExportUserFile?._id
		});
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
		try {
			site.busy = true;
			const actionUrl = `${this.apiUrl}/download-batch-export-file/${fileID}`
			const newExportResult: any = yield xhr.get(actionUrl, null, null, true);
			const fileOperationOptions = { mode: 'readwrite' as FileSystemPermissionMode };
			// Check if permission was already granted.
			const isAllowed = (yield this.batchExportRecentFileHandle.queryPermission(fileOperationOptions)) === 'granted';
			if (isAllowed || (yield this.batchExportRecentFileHandle.requestPermission({ mode: 'readwrite'})) === 'granted') {
				const file = yield this.batchExportRecentFileHandle.getFile();
				const writableStream = yield (this.batchExportRecentFileHandle as any).createWritable({keepExistingData:true});
				let offset = file.size;
				writableStream.seek(offset)
				yield writableStream.write("\n" + newExportResult.text);
				yield writableStream.close();
				return file.name;
			}
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

	@action
	handleBatchExportSseEvent(data) {
		if (data.subtype == "progress") {
			this.batchExportMessage[data.fileID] = data;
		} else if (data.subtype == "exception") {
			let params = JSON.parse(data.data);
			const fileId = params.fileID;
			const message = this.batchExportMessage[fileId]
			this.batchExportMessage[fileId] = {
				type: data.subtype,
				file_id: fileId,
				label: params.message,
				currentMessage: params.message,
				progress: _.assign({denominator: 1, numerator: 1}, message ? message.progress : null)
			};
			this.batchExportResult[fileId] = BatchExportResultStatus.error;
		} else if (data.subtype == "fileInfo") {
			let params = JSON.parse(data.data)
			userFileStore.loadDescriptor(params.userFileID).then(action(file => {
				this.recentBatchExportUserFile = file;
				this.batchExportRecentFileHandle = null;
				this.batchExportUserFiles[params.fileID] = file;
			}));
		} else if (data.subtype == "complete") {
			let params = JSON.parse(data.data);
			this.batchExportResult[params.fileID] = BatchExportResultStatus.complete;
		}
	}

	@action
	handleBatchImportSseEvent(data) {
		let progress: ProgressMessage = data;
		if (this._isLoaded) {
			this.batchImportProgressData.push(data);
		} else {
			progress.label = i18n.intl.formatMessage({ defaultMessage: 'Loading Default Settings...', description: '[RSSimulation] Loading message for loading batch import default settings'});
			this.loadingStatusMessages.push(progress);
		}

		if (data.subtype == BatchImportMessageTypes.results) {
			this.batchImportResults = data; // For AllParameters to detect changes and resfresh page
			this.getUserInterface(true);
		}
	}
}