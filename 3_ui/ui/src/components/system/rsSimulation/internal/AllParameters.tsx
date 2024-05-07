import {TreeNodeInfo} from '@blueprintjs/core';
import {TreePreviewCardGrid} from 'components/system/rsSimulation/internal/TreePreviewCardGrid';
import {FlexibleAxesEditorDialog} from 'components/system/rsSimulation/rwRecalibration/FlexibleAxesEditor';
import {StepNavigationItem} from 'components/system/rsSimulation/StepNavigator';
import {computed, observable, makeObservable, action, reaction, flow, when} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {i18n, RSSimulation, site} from 'stores';
import type {TreeNodeResponse} from 'stores/rsSimulation/models';
import {createBusyAction, formatLabelText} from 'utility';
import type {InputSpecification} from '../../inputSpecification';
import type {IDynamicStructureRowPath, Validation, InputSpecificationUserOptions} from '../../inputSpecification/models';
import {inputSpecification, InputSpecificationComponent, LoadingUntil, Option, bp} from '../../../index';
import {findOption} from '../../IO/internal/inputs/utility';
import * as css from './AllParameters.css';
import type { IAxes } from 'ui/src/stores/rsSimulation/rwRecalibration/models';

interface AllParametersProps<T>{
	rsSimulation: RSSimulation;
	activeItem: T;
	getPath:(item: T) => string[];
	transformTreeInfo:(item: T) => TreeNodeInfo<T>;
	onNodeClick: bp.TreeEventHandler<T>;
	userOptions?: InputSpecificationUserOptions;
	updateUserOptions?: (userOptions: InputSpecificationUserOptions, allParametersComponent: AllParameters<any>) => void;
	allowScrolling?: boolean;
	applicableChildrenTitles?: string[];
}

interface TreeNodeContent {
	axes: IAxes<string>;
	specification: InputSpecification;
	userInputs: {[key: string]: any};
	isSummaryNode?: boolean;
	notes: Array<{content: string; path: string[]}>
	generateSpecification: () => InputSpecification;
}
@observer
export class AllParametersWithRSSimulationNavCtrl extends React.Component<{rsSimulation: RSSimulation}, {}> {

	allParametersRef;

	transformTreeInfo = (item: StepNavigationItem): TreeNodeInfo<StepNavigationItem> => {
		const subItems = _.filter(item.items, (stepItem) => stepItem.applicable && stepItem.navigatorOnly !== true);
		const childNodes = _.map(subItems, this.transformTreeInfo);
		return {
			id: item.itemPathString,
			label: item.title,
			nodeData: item,
			childNodes: childNodes?.length > 0 ? childNodes : null
		}
	};

	updateUserOptions = (userOptions, ref) => {
		const displayModeUpdated = ref.userOptions.displayMode != userOptions.displayMode;
		if (displayModeUpdated) {
			ref.treeNodeContent.specification = ref.treeNodeContent.generateSpecification();
		}
	}

	render() {
		return <AllParameters<StepNavigationItem>
			ref={ref => this.allParametersRef = ref}
			rsSimulation={this.props.rsSimulation}
			activeItem={this.props.rsSimulation.stepNavigationController.activeItem}
			getPath={(item) => item.itemPath}
			onNodeClick={(item) => this.props.rsSimulation.stepNavigationController.setActiveByItem(item.nodeData)}
			transformTreeInfo={this.transformTreeInfo}
			updateUserOptions={this.updateUserOptions}
		/>
	}
}

@observer
export class AllParameters<T> extends React.Component<AllParametersProps<T>, {}> {

	static FIRST_PATH_NAME = "allParameters";

	_cacheTreeNodeContent: {[path: string]: TreeNodeContent} = {};
	_dispose: Function[]                                     = [];

	@observable userOptions: InputSpecificationUserOptions = {};
	@observable treeNodeContent: TreeNodeContent;
	@observable currentInputSpecificationPath: string[] = null;

	dynamicStructureRowPaths: Array<IDynamicStructureRowPath> = [];

	constructor(props) {
        super(props);

        makeObservable(this);

		_.assign(this.userOptions, this.props.userOptions, {verboseMode: false});

		this.updateSpecification(this.activePath);
		this._dispose.push(reaction(() => this.activePath, this.updateSpecification));

		// remove cache and reload page content after import.
		this._dispose.push(reaction(() => this.props.rsSimulation.batchImportResults, (results) => {
			if (results && !_.includes(_.map(_.get(results, "messages"), m=>m.level), "Error")) {
				this.invalidateAndRefetch();
			}
		}));

		this._dispose.push(reaction(() => this.props.rsSimulation.parametersKey, () => {
			this.invalidateAndRefetch();
		}));

		if (!this.parametersUserInterface) {
			this.props.rsSimulation.getParametersUserInterface();
		}
    }

	componentWillUnmount() {
		_.each(this._dispose, d => d());
	}

	get parametersUserInterface() {
		return this.props.rsSimulation.parametersUserInterface;
	}

	@computed get isLoading() {
		return !this.parametersUserInterface || !this.currentInputSpecificationPath?.length || !this.treeNodeContent;
	}

	@computed get activePath() {
		const {getPath, activeItem} = this.props;
		return getPath(activeItem);
	}

	@computed get path() {
		let path = this.currentInputSpecificationPath ? [...this.currentInputSpecificationPath] : [];
		if (_.first(path) == AllParameters.FIRST_PATH_NAME) {
			path.shift();
		}
		return path;
	}

	@computed get inputsDataPath() {
		// Full path, excluding the selected node;
		return [AllParameters.FIRST_PATH_NAME, ...this.path.slice(0, -1)];
	}

	@computed get inputs() {
		if (this.isLoading) {
			return {};
		}
		return this.treeNodeContent.userInputs;
	}

	@action _setSpecification(treeNodeResponse: TreeNodeResponse, allowCaching = true) {

		const generateSpecification = () => {
			const isFIRM = this.props.rsSimulation.isFIRM;
			const specification = inputSpecification("parameters", {options: {parameters: treeNodeResponse.inputOptions}}, this.userOptions.displayMode == "verbose", null, null, false);

			let preLocationPath = [...this.path];
			preLocationPath.pop();
			preLocationPath = preLocationPath.map(p => formatLabelText(p));

			const fmtLocationPathAndIndent = (option) => {
				option.locationPath?.length && (option.locationPath = ["Parameters", ...preLocationPath, ...option.locationPath]);
				(!option.title) && (option.indent = false);
				if (isFIRM) {
					(option.inputType == "string") && (option.hints = _.assign(option.hints || {}, {multiLineInput: true}));
					option.hints?.dimension && option.hints?.rowDetailView == null && (option.hints = _.assign(option.hints || {}, {rowDetailView: "auto"}));
				}

				const newItemTemplate = _.get(option, "hints.newItemTemplate");
				if (_.get(newItemTemplate, "type") == "flexible_axis") {
					newItemTemplate.onSelect = (r, c, headerEntry, inputTable) => {
						const axis = _.get(headerEntry, 'hints.newItemTemplate.value');
						site.setDialogFn(() => <FlexibleAxesEditorDialog
							rsSimulation={this.props.rsSimulation}
							isSingleAxis={true}
							defaultSelectedAxis={axis}
							title={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW(headerEntry.label)}
							onOK={(changes) => {
								if (_.has(changes, [axis,"add"])) {
									const firstItem = _.first(_.get(changes, [axis,"add"])).replace(/\s/g,"_");
									inputTable.saveEdit(r, c, firstItem);
								}
							}}
						/>);
					}
				}

				_.forEach(option.options, fmtLocationPathAndIndent)
			};
			fmtLocationPathAndIndent(specification);

			if (!_.isEmpty(this.props.applicableChildrenTitles)) {
				for (let option of specification.options) {
					if (!_.includes(this.props.applicableChildrenTitles, option.title))
						option.applicable = false;
				}
			}
			return specification
		}

		this.treeNodeContent = {axes: treeNodeResponse.axes, specification: generateSpecification(), isSummaryNode: treeNodeResponse.isSummaryNode, userInputs: treeNodeResponse.userInputs, notes: treeNodeResponse.notes, generateSpecification: generateSpecification};

		if (allowCaching)
			this._cacheTreeNodeContent[this.currentInputSpecificationPath.join(".")] = this.treeNodeContent;
	}

	updateSpecification = (newPath: string[]) => {
		// console.log(`updateSpecification: ${newPath}`);

		if (!newPath || (this.currentInputSpecificationPath && _.isEqual(this.currentInputSpecificationPath, newPath)) || newPath[0] != "allParameters") {
			return;
		}

		this.currentInputSpecificationPath = newPath;
		this.treeNodeContent = this.getInputSpecificationFromCache();
		this.dynamicStructureRowPaths = [];

		if (this.treeNodeContent) {
			return;
		}

		if (this.props.rsSimulation.isFIRM)
			this.selectTreeNode();
		else {
			this.setRSSimulationSpecification();
		}
	};

	async setRSSimulationSpecification() {
		await when(() => this.parametersUserInterface != null);
		let inputOptions = this.parametersUserInterface.inputOptions.allParameters;

		if (this.path) {
			_.map(this.path, itemName => {
				inputOptions = _.find(inputOptions.options, o => o.name == itemName)
			})
		}

		const treeNodeResponse: TreeNodeResponse = {inputOptions: inputOptions as Option, userInputs:  _.get(this.parametersUserInterface.userInputs, this.inputsDataPath), axes: this.parametersUserInterface.axes, notes: null};
		this._setSpecification(treeNodeResponse, false);
	}

	@flow.bound
	selectTreeNode = function* () {
		const resp = yield this.props.rsSimulation.selectTreeNode(this.currentInputSpecificationPath, true);
		this._setSpecification(resp, !resp.isSummaryNode);
	}

	getInputSpecificationFromCache() {
		let itemPath = [...this.currentInputSpecificationPath];

		let resultSpec = null;
		let extraPath = [];

		while (resultSpec == null && itemPath.length) {
			let testPathString = itemPath.join(".");
			if (this._cacheTreeNodeContent[testPathString]) {
				resultSpec = this._cacheTreeNodeContent[testPathString];
			}
			extraPath.push(itemPath.pop());
		}

		extraPath.pop(); // remove last, because it is current node.
		while (resultSpec && extraPath.length) {
			const testItem = extraPath.pop();
			resultSpec = _.find(resultSpec.options, option => option.name == testItem);
		}

		return resultSpec;
	}

	applyUpdate = action(async (updateValues) => {
		let isAxisUpdate = updateValues["axes"] != null;
		const response = await this.props.rsSimulation.updateParametersUserInterface(isAxisUpdate ? updateValues : _.set({}, this.inputsDataPath, updateValues), this.currentInputSpecificationPath, this.dynamicStructureRowPaths);

		if (this.props.rsSimulation.isFIRM)
			this._setSpecification(response as TreeNodeResponse, true);
	})

	onSelect = createBusyAction(async (dynamicNodePath: string[], innerPath: string[], isDefaultSelection: boolean) => {
		const inputOption = dynamicNodePath.length == 1 ? this.treeNodeContent.specification : findOption(this.treeNodeContent.specification, dynamicNodePath.slice(1));
		if (_.get(inputOption, "hints.dynamicStructure", false)) {

			if (!isDefaultSelection) {
				let response = await this.props.rsSimulation.getDynamicStructureContent(this.currentInputSpecificationPath, dynamicNodePath, innerPath, true);
				this._setSpecification(response, false);
			}
			this.dynamicStructureRowPaths = [{dynamicNodePath, innerPath}];
		}
	})

	invalidateAndRefetch() {
		const currentPath = this.currentInputSpecificationPath;
		this.currentInputSpecificationPath = [];
		this._cacheTreeNodeContent = {}; // clear cache
		this.updateSpecification(currentPath);
	}

	updateUserOptions = action((userOptions) => {
		if (this.props.updateUserOptions) {
			this.props.updateUserOptions(userOptions, this);
		}
		_.assign(this.userOptions, userOptions);
	})

	@computed get validationMessages(): {[path:string]: Validation} {
		const rsSimulation = this.props.rsSimulation;
		const validationPath = [AllParameters.FIRST_PATH_NAME, ...this.path];
		validationPath.pop();
		const allValidations = [
			...rsSimulation?.validationMessages,
			...(rsSimulation?.recalibration?.userInterface?.validationMessages || []),
			...(rsSimulation?.manualValidationMessage?.messages || [])
		];
		const rtnValidations = {};
		_.forEach(allValidations, v => {
			_.forEach(v.paths, path => {
				if (_.isEqual(path.slice(0,validationPath.length), validationPath)) {
					const p = path.slice(validationPath.length).join('.')
					rtnValidations[p] = {
						description: v.messageText,
						errorType: v.messageType,
						path: p
					}
				}
			})
		})
		return rtnValidations;
	}

	@computed get transformedTreeInfo() {
		const tree = this.props.transformTreeInfo(this.props.activeItem);
		const updateAttrs = (item: TreeNodeInfo) => {
			item.isSelected = false;
			item.isExpanded = true;
			_.forEach(item.childNodes, updateAttrs)
		};
		updateAttrs(tree);
		return tree;
	}

	render() {
		const { isLoading, treeNodeContent } = this;
		const { rsSimulation } = this.props;

		if (isLoading) {
			return <div className={css.root}>
				<LoadingUntil loaded={false} />
			</div>
		}

		if (treeNodeContent?.isSummaryNode) {
			return <div className={css.root}>
				<TreePreviewCardGrid<T> activeItem={this.transformedTreeInfo} onNodeClick={this.props.onNodeClick} />
			</div>
		}

		return <div className={css.root}>
			    <InputSpecificationComponent
					className={css.inputSpecificationComponent}
					inputs={this.inputs}
					applyUpdate={this.applyUpdate}
					validations={this.validationMessages as any}
					globalLists={null}
					axes={treeNodeContent.axes}
					userOptions={this.userOptions}
					updateUserOptions={this.updateUserOptions}
					allowClassicRenderMode={true}
					allowScrolling={this.props.allowScrolling}
					showViewTitle={false}
					renderSpecificationAsControl={true}
					dynamicStructureRowPaths={this.dynamicStructureRowPaths}
					onSelect={this.onSelect}
					specification={treeNodeContent.specification} />
		</div>
	}
}

