import {Intent} from '@blueprintjs/core';
import type {IconName, MaybeElement} from '@blueprintjs/core';
import {IDynamicStructureRowPath} from 'components/system/inputSpecification/models';
import {action, observable, toJS, makeObservable, computed, runInAction, when} from 'mobx';
import {findOption} from '../../../components/system/IO/internal/inputs/utility';
import {formatLabelText} from '../../../utility';
import {xhr} from '../../xhr';
import {RSSimulation} from '../RSSimulation';
import type {IModelTreeNode, IModelDataset, ITableRow, IModelMetadata, IModelDefinition, IModelOptimizers, IModelWebLocalDataset} from './models';
import type {ChartUserOptions} from 'stores';
import {user, site, asyncSiteLoading, GridlinesType, i18n} from 'stores';
import {IResultWithValidation} from './models';

/**
 * Transform original data to Blueprintjs Tree's format
 * @param node
 */
function transformModelTreeDataFormat (node) {
	if (Reflect.has(node, 'selected')) {
		node.isSelected = node.selected;
		Reflect.deleteProperty(node, 'selected');
	}

	if (Reflect.has(node, 'open')) {
		node.isExpanded = node.open;
		Reflect.deleteProperty(node, 'open');
	}

	node.id = `${node.parentNode?.coordinate?.value || ''}-${node.coordinate.axis}-${node.coordinate.value}`;
	node.label = `${node.coordinate.label}`;

	if (node.children) {
		const children = node.children;
		Reflect.deleteProperty(node, 'children');
		if (children.length > 0) {
			node.childNodes = children;
			if (node.coordinate.value !== 'root') {
				node.childNodes.forEach((childNode)=> {
					childNode.parentNode = node;
				});
			}
			node.childNodes.forEach(transformModelTreeDataFormat);
		}
	}
}

export interface RecalibrationDialogConfig {
	icon?: IconName | MaybeElement,
	title: string,
	component: (recalibration: RWRecalibration) => JSX.Element,
	dialogWidth?: number,
	onClose?: (recalibration: RWRecalibration) => void
}

export class RWRecalibration {

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

	@observable.ref tree: any;
	@observable metadata: IModelMetadata;
	@observable datasets: IModelDataset[];
	@observable settings: {[key:string]: string[]}[];

	@observable axisOrganization = null;

	@observable isUserInterfaceLoading: boolean = false;
	@observable _userInterface: IModelOptimizers = null;
	@computed get userInterface() { return this._userInterface; }
	set userInterface(updates) { action(() => this._userInterface = updates)(); }

	@observable webLocalDatasets: { [tableName: string]: IModelWebLocalDataset } = {};
	@observable actionDialog:RecalibrationDialogConfig = null

	get apiUrl() {
		return `${RSSimulation.apiUrlFor(this.id)}/recalibrate`;
	}

	@action getRecalibration = async (forceUpdate = false) => {
		this.isInitialized = false;
		this.rsSimulation.recalibrationProgress = {
			progress: {denominator: 1, numerator: 0},
			subtype: "progress",
			type: "recalibration",
			currentMessage: i18n.intl.formatMessage({defaultMessage: "Starting Custom Recalibration...", description: "[Recalibration] the default message for loading recalibration"})
		} as any;

		if (await xhr.get(this.apiUrl)) {
			await this.getPage(forceUpdate);
			this.rsSimulation.recalibrationProgress = null;
			this.isInitialized = true;
			return;
		}
		when(() =>
				this.rsSimulation.recalibrationProgress?.progress.denominator > 0 &&
				this.rsSimulation.recalibrationProgress?.progress.numerator == this.rsSimulation.recalibrationProgress?.progress.denominator ,
			() => {
				this.isInitialized = true;
				this.getPage(forceUpdate);
			}
		);
	}

	@action getPage = async (forceUpdate) => {
		let resp : any = await xhr.get(`${this.apiUrl}/page`);
		this.responseHandler(resp);
		this._lastRequestTreeNode = null;
		await this.getUserInterface(forceUpdate);
		this.isLoaded = true;
	}

	@action calibrate = async () => {
		this.userInterface.actionFlag = "none";
		await xhr.post(`${this.apiUrl}/run`);
	}

	@action cancel = async () => {
		await xhr.post(`${this.apiUrl}/cancel`);
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

	@action updateRecalibrationRow = async (rowID, column, value) => {
		const columnName = this.convertJuliaName(column);

		const resp = await xhr.post(`${this.apiUrl}/edit-row`, {
			id: rowID,
			column: columnName,
			value: value
		}) as any;
		const res = resp.result;
		const editedRow = res.row;
		_.forEach(this.datasets, ms => {
			_.forEach(ms.table, (row: any) => {
				if(row.id == editedRow.id) {
					runInAction(() => Object.assign(row, editedRow));
					if(res.percentileApplicable != null) {
						this.metadata[ms.name].options[0].options.find(e => e.name == "percentile").applicable = res.percentileApplicable;
					}
					if(res.secondTenorApplicable != null) {
						this.metadata[ms.name].options[0].options.find(e => e.name == "secondTenor").applicable = res.secondTenorApplicable;
					}
					if(res.secondRatingApplicable != null) {
						this.metadata[ms.name].options[0].options.find(e => e.name == "secondRating").applicable = res.secondRatingApplicable;
					}
				}
			})
		})
		this.setActionFlagAndValidation(resp.validationMessages);
	}

	getTableInterface(tableName): IModelDefinition {
		return toJS(_.find(_.get<IModelDefinition>(this.metadata, tableName)?.options, d => d.name == "table"));
	}

	getSettingInterface(tableName): IModelDefinition {
		let path = _.get(this.settings, `${tableName}.0`, []);
		if (path.length <= 1) {
			return {
				name: tableName,
				title: tableName,
				description: null,
				applicable: true,
				options: []
			};
		}
		return findOption(this.userInterface.inputOptions.targets, path.slice(1))
	}

	getDataSet(tableName): IModelDataset {
		return _.find(this.datasets, d => d.name == tableName);
	}

	setActionFlag() {
		this.userInterface.actionFlag = "full";
	}

	@action setActionFlagAndValidation(validationMessages) {
		this.setActionFlag();
		this.userInterface.validationMessages = validationMessages;
	}

	@action addRow = async (tableName) => {
		const resp = await xhr.post<IResultWithValidation<ITableRow>>(`${this.apiUrl}/add-row`, {tableName: tableName});
		this.getDataSet(tableName).table.push(resp.result);
		this.setActionFlagAndValidation(resp.validationMessages);

	}

	@action addRows = async (tableName, numberRows) => {
		const resp = await xhr.post<IResultWithValidation<ITableRow[]>>(`${this.apiUrl}/add-rows`, {tableName: tableName, numberRows: numberRows});
		_.forEach(resp.result, row => this.getDataSet(tableName).table.push(row));
		this.setActionFlagAndValidation(resp.validationMessages);
	}

	@action removeRows = async (rowIds: string[]) => {
		const resp = await xhr.post<IResultWithValidation<String[]>>(`${this.apiUrl}/delete-rows`, {rows: rowIds});
		_.forEach(this.datasets, ms => {
			_.remove(ms.table, (row: any) => _.some(resp.result, id => id == row.id));
		})
		this.setActionFlagAndValidation(resp.validationMessages);
	}

	selectTreeNode = (async (node: IModelTreeNode, isMultiSelect: boolean = false) => {

		const paramCoordinates = {
			[node.coordinate.axis]: node.coordinate.value
		};

		let parentNode = node.parentNode;
		while (parentNode) {
			paramCoordinates[parentNode.coordinate.axis] = parentNode.coordinate.value;
			parentNode = parentNode.parentNode;
		}

		this.updateTreeNode(paramCoordinates, isMultiSelect);
	})

	expandTreeNode = asyncSiteLoading(async (node: IModelTreeNode, isOpen) => {
		const paramCoordinates = {
			[node.coordinate.axis]: node.coordinate.value
		};

		let parentNode = node.parentNode;
		while (parentNode) {
			paramCoordinates[parentNode.coordinate.axis] = parentNode.coordinate.value;
			parentNode = parentNode.parentNode;
		}

		site.busy = true;
		const resp : any = await xhr.post(`${this.apiUrl}/expand-tree-node`, {
			coordinates: paramCoordinates,
			open: isOpen
		});
		transformModelTreeDataFormat(resp.tree);
		runInAction(() => this.tree = resp.tree);
	})

	getAxisOrganization = asyncSiteLoading(async () => {
		const axisOrganization = await xhr.get(`${this.apiUrl}/axis-organization`);
		this.axisOrganization = axisOrganization;
	})

	reorderAxis = asyncSiteLoading(async (data) => {
		this.axisOrganization = await xhr.post(`${this.apiUrl}/reorder-axis`, data);
	})

	updateAxisCategory = asyncSiteLoading(async (data) => {
		this.axisOrganization = await xhr.post(`${this.apiUrl}/update-axis-category`, data);
	})


	_lastRequestTreeNode = null;
	updateTreeNode = asyncSiteLoading(async (data: any, isMultiSelect:boolean = false) => {
		if (!KARMA && _.isEqual(data, this._lastRequestTreeNode)) {
			return;
		}

		this._lastRequestTreeNode = _.clone(data);
		const resp : any = await xhr.post(`${this.apiUrl}/select-tree-node`, {
			coordinates: data,
			only: !isMultiSelect
		});

		if (_.isEqual(data, this._lastRequestTreeNode)) {
			this.responseHandler(resp);
		}
	})

	@action responseHandler = (response) => {
		transformModelTreeDataFormat(response.tree);
		this.tree = response.tree;
		this.metadata = response.metadata;
		this.datasets = response.data as IModelDataset[];
		this.settings = response.settings;
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

	combinatorialAddRows = asyncSiteLoading(async (tableName, metadataName, optionData, extraData) => {
		const resp: IResultWithValidation<ITableRow[]> = await xhr.post(`${this.apiUrl}/combinatorial-add-rows`, {
			tableName: metadataName,
			options: optionData,
			...extraData
		});

		this.getDataSet(tableName).table.push(...resp.result);
		this.setActionFlagAndValidation(resp.validationMessages);
	});

	updateChartUserOptions = (tableName: string, updateObj: any) => {
		let cuo = this.getChartUserOptions(tableName);
		_.assign(cuo, updateObj);
	}

	formatCoordinateTitle(title) {
		return title.split("/").map( s => {
			if (s.match(/^[A-Z0-9]*$/)) {
				return s;
			} else {
				return formatLabelText(s);
			}
		}).join(" / ");
	}

	getCombinatorialAddRowsSettings(tableName) {
		return _.get(user.profile, `userMetadata.ui.rsSimulation.combinatorialAddRows.${tableName}`, {});
	}

	saveCombinatorialAddRowsSettings = asyncSiteLoading(async (tableName, newSettings) => {
		const { profile } = user;
		const newUserMetadata = _.merge({}, profile.userMetadata );
		_.set(newUserMetadata, `ui.rsSimulation.combinatorialAddRows.${tableName}`, newSettings);

		await user.updateUserMetadata(newUserMetadata);
	})

	@action getUserInterface = async (forceUpdate: boolean = false) => {
		if (!this.userInterface || forceUpdate) {
			this.isUserInterfaceLoading = true;
			this.userInterface          = await xhr.get(`${this.apiUrl}/user-interface`);
			this.isUserInterfaceLoading = false;
		}
		return this.userInterface;
	}

	updateUserInterface = async <T>(update: Object, treeNodePath?: string[], dynamicStructureRowPaths?: Array<IDynamicStructureRowPath>) => {
		site.busy = true;
		return await xhr.post<{
			requiredOptimization?: string;
			validationMessages?: any[];
			axes?: any;
			inputOptions?: any;
			userInputs?: any;
			treeInputOptions?: any;
			changeMessages: Array<{ messageType: string; sourcePath: any[]; targetPath: any[]; targetValue: T; }>;
			resetValidation?: boolean;
		}>(`${this.apiUrl}/user-interface`,{
			userInput: JSON.stringify(update),
			treeNodePath: treeNodePath,
			dynamicStructureRowPaths: dynamicStructureRowPaths,
			timeStamp: new Date()
		}).then(action(response => {
			if (response?.requiredOptimization)
				this.userInterface.actionFlag = response.requiredOptimization;

			if (response?.validationMessages)
				this.userInterface.validationMessages = response.validationMessages;

			if (treeNodePath) {
				if (response?.treeInputOptions?.allParameters) {
					// Replace the parameter tree wholesale to reflect nodes being added or deleted.
					this.userInterface.inputOptions.allParameters = response.treeInputOptions.allParameters;
				}
			}
			else { // Ignore returned options for parameter tree updates
				if (response?.axes)
					this.userInterface.axes = response.axes;

				if (response?.inputOptions) {
					// Merge new settings into input options
					this.updateInputOption(this.userInterface?.inputOptions, response?.inputOptions);
				}

				if (response?.userInputs) {
					this.userInterface.userInputs = response.userInputs;
				}
			}

			if (response?.changeMessages)
				_.forEach(response.changeMessages, cm => {
					if (cm.targetPath[0] != "datasets"){
						_.set(this.userInterface.userInputs, cm.targetPath, cm.targetValue)
					} else {
						let id = cm.targetPath[1]
						_.forEach(this.datasets, ms => {
							_.forEach(ms.table, (row: any) => {
								if(row.id == id) {
									_.set(row, cm.targetPath[2], cm.targetValue);
								}
							})
						})
					}
				});

			if (response.resetValidation === true &&
				this.rsSimulation.manualValidationMessage?.refreshLocked === false
			) {
				this.rsSimulation.manualValidationMessage.refreshEnabled = true;
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

	async updateAxisCoordinate<T>(action: string, sourcePath: any, params?: {}) {
		return await this.updateUserInterface<T>({
			axes: {
				action: action,
				sourcePath: sourcePath,
				...(params ? params : {})
			}
		})
	}

	@action insertAxisCoordinate = async (axis: string, insertIndex?: number) => {
		await this.updateAxisCoordinate<any[]>(
			"add",
			axis,
			insertIndex!=null ? {index: insertIndex} : null
		).then(this.updateAxisInfo);
	}

	@action deleteAxisCoordinate = async (axis: string, index: number) => {
		const itemName = this.userInterface?.axes.optimizerAxis.values[`${index}`];
		if (!itemName) {
			site.toaster.show({intent: Intent.DANGER, message: `Cannot delete Axis '${index}', no match data.`});
			return;
		}

		await this.updateAxisCoordinate<any[]>(
			"delete",
			axis,
			{name: itemName}
		).then(this.updateAxisInfo);
	}

	@action renameAxisCoordinate = async (axis: string, currentIndex: number, newName:string) => {
		const itemName = this.userInterface?.axes[axis].values[`${currentIndex}`];
		if (!itemName) {
			site.toaster.show({intent: Intent.DANGER, message: `Cannot rename Axis '${currentIndex}', no match data.`});
			return;
		}
		if (itemName == newName) {
			return;
		}
		if (_.some(Object.values(this.userInterface?.axes[axis].values), v => v == newName)) {
			site.toaster.show({intent: Intent.DANGER, message: `Cannot update Axis name to '${newName}', it is duplicate.`});
			return;
		}

		await this.updateAxisCoordinate(
			"rename",
			axis,
			{
				name: itemName,
				newName: newName
			}
		).then(this.updateAxisInfo);
	}

	@action setAxisCoordinateIndex = async (axis: string, currentIndex: number, updateIndex:number) => {
		if (currentIndex === updateIndex) {
			return;
		}
		const itemName = this.userInterface?.axes.optimizerAxis.values[`${currentIndex}`];
		if (!itemName) {
			site.toaster.show({intent: Intent.DANGER, message: `Cannot set new axis index '${currentIndex}', no match data.`});
			return;
		}
		await this.updateAxisCoordinate<any[]>(
			"reorder",
			axis,
			{
				name: itemName,
				index: updateIndex
			}
		).then(this.updateAxisInfo);
	}

	@action updateAxisInfo = (result) => {
		Object.keys(result.axes).forEach(action((axisKey) => {
			if(this.userInterface.axes[axisKey]) {
				_.assign(this.userInterface.axes[axisKey], result.axes[axisKey]);
			} else {
				this.userInterface.axes[axisKey] = result.axes[axisKey];
			}
		}));
	}

	@action insertOptimizersRow = async (tableIndexString: string, insertIndex?: number, numberRows: number = 1) => {
		const tableIndex = parseInt(tableIndexString);
		if (this.userInterface?.axes.optimizerAxis.values[tableIndex] == null) {
			return;
		}
		await this.updateAxisCoordinate<any[]>(
			"add",
			["optimizers", tableIndex],
			{numberRows: numberRows, ...(insertIndex!=null ? {index: insertIndex} : {})}
		).then(changeMessages => {
			_.forEach(changeMessages, cm => _.set(this.userInterface.userInputs, cm.targetPath, cm.targetValue));
		});
	}

	@action deleteOptimizersRow = async (tableIndexString: string, deleteRow: number, numberRows: number = 1) => {
		const tableIndex = parseInt(tableIndexString);
		if (this.userInterface?.axes.optimizerAxis.values[tableIndex] == null) {
			return;
		}
		await this.updateAxisCoordinate<any[]>(
			"delete",
			["optimizers", tableIndex, deleteRow],
			{numberRows: numberRows}
		).then(changeMessages => {
			_.forEach(changeMessages, cm => _.set(this.userInterface.userInputs, cm.targetPath, cm.targetValue));
		});
	}

	@action editOptimizersRow = async (tableIndexString: string, datas: any ) => {
		const tableIndex = parseInt(tableIndexString);
		if (this.userInterface?.axes.optimizerAxis.values[tableIndex] == null) {
			return;
		}
		await this.updateUserInterface<any>({
			optimizers: { [tableIndexString]: datas }
		});
	}

	changeAxisCategoryByTreeNode = asyncSiteLoading(async (mode) => {
		const resp = await xhr.post(`${this.apiUrl}/update-selection-mode`, {
			mode
		});
		this.responseHandler(resp);
	})

	openDialog(config: RecalibrationDialogConfig) {
		if (config) {
			this.actionDialog = config;
		}
	}

	closeDialog() {
		this.actionDialog = null;
	}
}
