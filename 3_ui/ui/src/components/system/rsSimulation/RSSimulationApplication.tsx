import {RSSimulationInputSpecificationComponent} from 'components/system/rsSimulation/internal/RSSimulationInputSpecificationComponent';
import {RSSimulationValidationSidebar} from 'components/system/rsSimulation/internal/RSSimulationValidationSidebar';
import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {ReportsPage} from 'components/system/rsSimulation/reports/ReportsPage';
import {RelatedObjectPage} from 'components/system/userInterfaceComponents/RelatedObject/RelatedObjectPage';
import Splitter from 'm-react-splitters';
import {ApplicationFailed} from 'components/site/ApplicationFailed';
import {AllParametersWithRSSimulationNavCtrl} from 'components/system/rsSimulation/internal/AllParameters';
import type {StepNavigationItemProps} from 'components/system/rsSimulation/StepNavigator';
import {NavButtonsBar, StepItemListComponent, StepNavigationController, StepNavigationItem} from 'components/system/rsSimulation/StepNavigator';
import {AddressPath} from 'components/system/rsSimulation/AddressPath';
import {NavigationTree} from 'components/system/rsSimulation/NavigationTree';
import {LockCover} from 'components/widgets/LockCover';
import type {IReactionDisposer} from 'mobx';
import {action, autorun, computed, observable, reaction, when, makeObservable} from 'mobx';
import {observer, Observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {LoadingIndicatorWithStatus, Option } from 'components';
import type {InputSpecificationUserOptions} from '../inputSpecification/models';
import {RSSimulationOutput} from './RSSimulationOutput';
import {RSSimulationExecution} from './RSSimulationExecution';
import {RSSimulationQueryTool} from './RSSimulationQueryTool';
import {ExpireDialogComponent } from '../ExpireDialog/ExpireDialog';
import {RWRecalibrationTool} from './rwRecalibration/RWRecalibrationTool';
import {RNRecalibrationTool} from './rnRecalibration/RNRecalibrationTool';
import {Query, Simulation, RSSimulation, userFileStore, UserFile, i18n, Reports, user} from "stores";
import {ObjectChooser} from "components/system/ObjectChooser/ObjectChooser";
import { NoteEditor } from './NoteEditor';

import * as css from "./RSSimulationApplication.css"
import FlipMove from 'react-flip-move';

interface MyProps {
	location: HistoryModule.LocationDescriptorObject;
	rsSimulation: RSSimulation;
}

@observer
export class RSSimulationApplication extends React.Component<MyProps, {}> {
	_initActivePath;
	_isRebuildingSteps = false;

	constructor(props) {
        super(props);

        makeObservable(this);

		this._initActivePath = this.props.location?.query?.page;

        this._dispose.push(when(()=> this.props.rsSimulation.isLoaded, () => {
			const {rsSimulation} = this.props;

			this.props.rsSimulation.stepNavigationController = new StepNavigationController({
				displayType: rsSimulation?.additionalControls?.navigatorType,
				showAddressPath: rsSimulation?.additionalControls?.showAddressPath,
				steps:       this.getStepNavigationSettings(),
				pages:       this.getStepNavigationPages(),
				activePath:  this.props.location?.query?.page,
				onChange:    this.onPageChange,
				//listStyleTypes: ['upper-alpha', 'decimal', 'lower-alpha']
			});
		}));

		this._dispose.push(reaction(()=> this.props.location?.query?.page, () => {
			this.props.rsSimulation.stepNavigationController.setActiveByPathString(this.props.location?.query?.page)
		}))
    }

	_dispose = [];

	componentDidMount(): void {
		const rsSimulation = this.props.rsSimulation;

		rsSimulation.loadExistingRSSimulation();

		this._dispose.push( reaction(
			() => [
				rsSimulation.userInputs?.calibrationNodes?.enableCustomCalibration,
				rsSimulation.userInputs?.calibrationNodes?.calibrationMeasure,
				rsSimulation.userInputs?.filesToProduceNodes?.saveToStorageBlocks,
				rsSimulation.userInputs?.filesToProduceNodes?.createFilesForDownload,
				rsSimulation.userInputs?.calibrationNodes?.enableDirectParameterViewingAndEditing,
				rsSimulation.recalibration?.tree,
				rsSimulation.recalibration?.showTree,
				rsSimulation.canRun,
				rsSimulation.isComplete,
				rsSimulation.recalibration?.isLoaded, // Show additional subtags in targets and/or parameters
				rsSimulation.reports?.isLoaded,
				this.hasSimulationRunStep,
				this.hasQueryRunStep,
				this.allParametersNavigationOptions,
				this.rnRecalibrationOptions,
				this.reportsOptions,
				rsSimulation.hasQueryResult()
			],
			(result) => {
				if (rsSimulation.stepNavigationController) {
					this._isRebuildingSteps = true;
					rsSimulation.stepNavigationController.setStepItems( this.getStepNavigationSettings() );

					// avoid the wrong sub-page display if the page index is created after the first navigation structure generate.
					const currentActivePath = rsSimulation.stepNavigationController.activeItem.itemPathString;
					if (this._initActivePath) {
						if (this._initActivePath != currentActivePath && this._initActivePath.indexOf(rsSimulation.stepNavigationController.activeItem.itemPath[0]) == 0) {
							const item = rsSimulation.stepNavigationController.getExecutableItemByPathStringAry(this._initActivePath.split('.'));
							if (item && item.itemPathString == this._initActivePath) {
								rsSimulation.stepNavigationController.setActiveByItem(item);
								this._initActivePath = null;
							}
						} else {
							this._initActivePath = null;
						}
					}

					this.onPageChange(rsSimulation.stepNavigationController.activeItem, null);
					this._isRebuildingSteps = false;
				}
			}
		));

		// Sync the query tool with the active item when the query is fully ready (query sub tabs are populated)
		this._dispose.push(when(() =>
			rsSimulation.query &&
			rsSimulation.stepNavigationController?.activeItem?.itemPath[0] == "query" &&
			rsSimulation.stepNavigationController?.activeItem?.itemPath.length > 1, () => {
				this.setQueryCurrentPageId(rsSimulation.stepNavigationController.activeItem);
			})
		)

		this._dispose.push(reaction(() => rsSimulation.isCalibrating, () => {
			// Reload userInferface when calibration completes
			if (!rsSimulation.isCalibrating) {
				rsSimulation.activeRecalibration.getRecalibration(true);
			}
		}))
	}

	componentWillUnmount() {
		this.props.rsSimulation.stepNavigationController = null;
		this._dispose.forEach( d => d());
	}

	@observable userOptions: {[key: string]: InputSpecificationUserOptions} = {
		scenarioContentNodes: {verboseMode: true},
		filesToProduceNodes: {verboseMode: true},
		calibrationNodes: {verboseMode: true},
		simulationNodes: {verboseMode: true},
		ui1: {verboseMode: false}, ui2: {verboseMode: false}, ui3: {verboseMode: false}, ui4: {verboseMode: false}, ui5: {verboseMode: false}, ui6: {verboseMode: false}, ui7: {verboseMode: false}
	};

	selectRecalibrationTreeNode(ids: string[], checkItemSwitch: boolean) {

		const recalibration = this.props.rsSimulation.recalibration;
		// await waitCondition(() => recalibration.isLoaded);

		ids = [...ids].reverse();
		let childNodes = recalibration?.tree?.childNodes;
		let node;
		while (ids.length && childNodes?.length) {
			const id = ids.pop();
			node = _.find(childNodes, n => n.id == id);
			childNodes = node?.childNodes;
		}

		let selectedCounter = (nodes) => {
			let selected = 0;
			_.forEach(nodes, node => {
				if (node.isSelected)
					selected++;

				selected += selectedCounter(node.childNodes);
			})
			return selected;
		}

		node && (!checkItemSwitch || !(selectedCounter(recalibration?.tree?.childNodes) == 1 && node.isSelected)) && this.props.rsSimulation.recalibration.selectTreeNode(node);
	}

	onPageChange =  (item: StepNavigationItem, prevItem: StepNavigationItem, isValidationNavigation= false) => {
		const { rsSimulation } = this.props;
		if (item.name == "simulationRun") {
			rsSimulation.stepNavigationController.setActiveByPathString('simulation');
			if (this.hasSimulationRunStep) {
				getSimulateRunFunc(rsSimulation)();
			}
			return;

		} else if (item.name == "queryRun") {
			rsSimulation.stepNavigationController.setActiveByPathString('query');
			if (this.hasQueryRunStep) {
				rsSimulation.query.run();
			}
			return;
		}

		// if (item.itemPath[0] == 'allParameters')
		//	rsSimulation.selectTreeNode(item.itemPath, true);

		rsSimulation.navigateToPage(item.itemPathString);

		// Ignore updates that come through while the steps are being rebuilt.
		if (item.itemPath[0] == "query" && (!prevItem || item.name != prevItem.name) && rsSimulation.query instanceof Query && !this._isRebuildingSteps) {
			// Keep the query's internal page in sync
			this.setQueryCurrentPageId(item);
		}

		const itemPath = item.itemPath;
		const isTargets = itemPath[0] == 'targets';

		if (isTargets) {
			if (rsSimulation.isTreeNavigator && !isValidationNavigation && (prevItem && prevItem.itemPath[0] === 'targets')) {
				return; // component NavigationTree already handles select tree node
			}

			if (itemPath.length > 1) {
				this.selectRecalibrationTreeNode(itemPath.slice(1), prevItem != null);
			}
		}
	}

	@computed get rsSimulation() {
		// this computed wrapper avoids recomputing allParametersNavigationOptions on every render.
		return this.props.rsSimulation;
	}

	setQueryCurrentPageId(item: StepNavigationItem) {
		const {rsSimulation} = this.props;
		const pageId = item.name.replace(/_/g, '.');
		if (rsSimulation.query instanceof Query && pageId != rsSimulation.query.currentPage.id)
			rsSimulation.query._currentPageId = pageId;
	}

	@computed get allParametersNavigationOptions() {
		return this.covertInputOptionsToStepNavigationOption(_.get(this.rsSimulation.parametersUserInterface, "inputOptions.allParameters"), 'allParameters');
	}

	@computed get rnRecalibrationOptions() {
		return this.covertInputOptionsToStepNavigationOption(_.get(this.rsSimulation.rnRecalibration.userInterface, "inputOptions.calibrationInputs"), 'calibrationInputs');
	}

	@computed get reportsOptions() {
		return this.covertInputOptionsToStepNavigationOption(_.get(this.rsSimulation.reports?.userInterface, `inputOptions.${Reports.FIRST_PATH_NAME}`), Reports.FIRST_PATH_NAME);
	}

	@computed get hasSimulationRunStep() {
		const rsSimulation = this.props.rsSimulation;
		return !rsSimulation.isRunning && !rsSimulation.isComplete && !rsSimulation.isCanceling;
	}

	@computed get hasQueryRunStep() {
		const rsSimulation = this.props.rsSimulation;
		const query = rsSimulation.query as Query;
		return query && !(!query.canRunQuery || query.hasResult && !query.isRunning);
	}

	covertTreeOptionToStepNavigationOption(treeOptions: Array<any>): Array<StepNavigationItemProps> {
		return _.map<any, StepNavigationItemProps>( treeOptions, o => {
			const hasChildNodes = o.childNodes?.length;
			return {
				name: o.id,
				title: o.label,
				options: hasChildNodes ? this.covertTreeOptionToStepNavigationOption(o.childNodes) : null,
				pageId: 'targets'
			}
		});
	}

	covertInputOptionsToStepNavigationOption(inputOption: Option, pageId): Array<StepNavigationItemProps> {
		if (!_.get(inputOption, "hints.tab")) {
			return null;
		}
		inputOption.suppressTab = true;

		return _.map<any, StepNavigationItemProps>( inputOption.options, (o) => {
			let options = this.covertInputOptionsToStepNavigationOption(o, pageId);
			return {
				name: o.name,
				title: o.title,
				options: options,
				applicable: o.applicable,
				flexibleAxis: o.flexibleAxis,
				pageId
			}
		});
	}

	getStepNavigationSettings() {
		const {rsSimulation, rsSimulation: { userInputs, query }} = this.props;
		const recalibration = rsSimulation.recalibration;
		const enableDownload = !rsSimulation.isFIRM && _.get(rsSimulation, ['userInputs', 'filesToProduceNodes', 'createFilesForDownload'], true) && !rsSimulation.useDefinitionFile;
		const enableQuery = !rsSimulation.isFIRM && _.get(rsSimulation, ['userInputs', 'filesToProduceNodes', 'saveToStorageBlocks'], true);
		const enableReport = rsSimulation.isFIRM && rsSimulation.isComplete;
		const {enableCustomCalibration} = userInputs.calibrationNodes;
		const targetTabAttrs = enableCustomCalibration && !rsSimulation.useRiskNeutralCalibration ? { options: this.covertTreeOptionToStepNavigationOption(recalibration?.tree?.childNodes)} : { applicable: false };
		const calibrationInputsAttrs = enableCustomCalibration && rsSimulation.useRiskNeutralCalibration ? { options: this.rnRecalibrationOptions, pageId: 'calibrationInputs' } : { applicable: false };
		const reportsAttrs = enableReport ? { options: this.reportsOptions, pageId: Reports.FIRST_PATH_NAME } : { applicable: false };

		let queryOptions = null;
		if (rsSimulation.isComplete && query && !query.isLoading && query instanceof Query) {
			queryOptions = (query as Query).pages.map( queryPage => {
				return {
					name: queryPage.id.replace(/\./g, '_'),
					title: queryPage.title.replace(/^\d*\.\s/, ''),
					pageId: 'query',
					applicable: queryPage.enabled
				}
			});

			if (this.hasQueryRunStep) {
				// remove result index and add a navigatorOnly index for run Query
				queryOptions.splice(queryOptions.length - 1, 1, {
					name:          "queryRun",
					navigatorOnly: true,
					navigatorText: () => "Run Query"
				});
			}
		}

		let allParameterAttrs = !userInputs.calibrationNodes.enableDirectParameterViewingAndEditing && !rsSimulation.isFIRM ?
		                        { applicable: false } :
		                        { options: this.allParametersNavigationOptions, pageId: rsSimulation.isFIRM ? "allParameters" : null };

		return [
			{ name: "dataSelection", applicable: !rsSimulation.useDefinitionFile && !rsSimulation.isFIRM, isInputItem: true},
			{ name: "dataFormat", applicable: !rsSimulation.useDefinitionFile && !rsSimulation.isFIRM, isInputItem: true},
			{ name: "calibrationNodes", title: "Calibration", applicable: !rsSimulation.useDefinitionFile, isInputItem: true},
			{ name: "calibrationInputs", title: "Calibration Inputs", ...calibrationInputsAttrs, isInputItem: true},
			{ name: "targets", title: "Targets", ...targetTabAttrs},
			{ name: "allParameters", title: "Parameters", ...allParameterAttrs, isInputItem: true},
			{ name: "simulation", title: "Execution"},
			{ name: "simulationRun", applicable: this.hasSimulationRunStep, disabled: !rsSimulation.canRun, navigatorOnly: true, navigatorText: () => "Simulate"},
			{ name: "download", applicable: enableDownload  }, // ...[ rsSimulation.useDefinitionFile ? {} : { name: "download"} ],
			{ name: "query", pageId: !!queryOptions ? null : 'query', applicable: enableQuery, options: queryOptions },
			{ name: "results", applicable: rsSimulation.isFIRM},
			{ name: Reports.FIRST_PATH_NAME, ...reportsAttrs}
		];
	}

	getStepNavigationPages() {
		if (KARMA)
			return {};

		const rsSimulation = this.props.rsSimulation;

		return {
			dataSelection: <Observer>{() => this.getInputSpecificationComponent('scenarioContentNodes', 'dataSelection')}</Observer>,
			dataFormat: this.getObserverInputSpecificationComponent('filesToProduceNodes', 'dataFormat'),
			calibrationNodes: this.getObserverInputSpecificationComponent('calibrationNodes', 'calibration'),
			targets: <RWRecalibrationTool rsSimulation={rsSimulation} />,
			simulation: <RSSimulationExecution rsSimulation={rsSimulation} renderOptions={() => this.getSimulationInputNode()}/>,
			download: <RSSimulationOutput rsSimulation={rsSimulation} />,
			query: <RSSimulationQueryTool rsSimulation={rsSimulation} />,
			allParameters: <AllParametersWithRSSimulationNavCtrl rsSimulation={rsSimulation} />,
			calibrationInputs: <RNRecalibrationTool rsSimulation={rsSimulation} />,
			results: <RelatedObjectPage objectType={Simulation.ObjectType} modelId={rsSimulation._id} showHeader={false} />,
			[Reports.FIRST_PATH_NAME]: <ReportsPage rsSimulation={rsSimulation} />
		}
	}

	getSimulationInputNode() {
		const rsSimulation = this.props.rsSimulation;

		return <div>
			{this.getInputSpecificationComponent('simulationNodes', 'simulation')}
			<RSSimulationLockCover rsSimulation={rsSimulation} />
		</div>
	}

	getObserverInputSpecificationComponent(viewName, locationName) {
		return <Observer>{() => this.getInputSpecificationComponent(viewName, locationName)}</Observer>
	}


	getInputSpecificationComponent(viewName:string, locationName:string) {
		return <RSSimulationInputSpecificationComponent
			rsSimulation={this.props.rsSimulation}
			viewName={viewName}
			locationName={locationName}
			userOptions={this.userOptions[viewName]}
			updateUserOptions={action((updates) => { this.userOptions[viewName] = updates; })}
		/>
	}

	renderContentBody = (showNoteEditor: boolean) => {
		const { rsSimulation } = this.props;
		const allowNotes = rsSimulation.stepNavigationController.activeItem.pageId == "allParameters";

		return (
			<div className={css.contentBodyAndNotes}>
				<div className={css.contentBody}>
					{rsSimulation.stepNavigationController.displayPage}
					{rsSimulation.stepNavigationController.activeItem.isInputItem && <RSSimulationLockCover rsSimulation={rsSimulation} />}
				</div>
				{ showNoteEditor && allowNotes && <NoteEditor rsSimulation={rsSimulation} /> }
			</div>
		);
	}

	render() {
		const {rsSimulation, rsSimulation: {stepNavigationController, additionalControls}} = this.props;
		const showAddressPath = rsSimulation?.stepNavigationController?.showAddressPath;

		if (!rsSimulation.isLoaded || !stepNavigationController) {
			return <LoadingIndicatorWithStatus model={rsSimulation}>
				<FormattedMessage
					defaultMessage={"Initializing {simulationName} Simulation Session"}
					description={"[RSSimulationApplication] "}
					values={{simulationName: rsSimulation.useCase ? "" : rsSimulation.sourceType}}
				/>
			</LoadingIndicatorWithStatus> ;
		}

		const activeItem = rsSimulation.stepNavigationController.activeItem;

		if(rsSimulation.isLoadFailed) {
			return <ApplicationFailed
				failureMessage={i18n.intl.formatMessage({
					defaultMessage: "Loading Economic Scenario Generator Session Failed",
					description: "[RSSimulationApplication] Application Failed Message - load object failed."
				})}
				reloadBtnClick={() => {
					rsSimulation.loadExistingRSSimulation();
				}}
			/>;
		}

		const {showNoteEditor} = additionalControls;

		return <>
			<AddressPath rsSimulationApplication={this} visible={showAddressPath} />
			{rsSimulation.stepNavigationController?.displayType == 'step-by-step' && <StepItemListComponent controller={rsSimulation.stepNavigationController} /> }
			<FlipMove duration={500 /*Animates the validation sidebar*/}
		                      style={{display: "flex", height: "100%", overflow: "hidden", flexDirection: "row"}}
		                      appearAnimation="none"
		                      enterAnimation={{from: { transform: 'scaleX(0)', transformOrigin: 'right center' },
			                      to: { transform: '', transformOrigin: 'right center' }}}
		                      leaveAnimation={{from: { transform: 'scaleX(1)', transformOrigin: 'right center' },
			                      to: { transform: 'scaleX(0)', transformOrigin: 'right center' }}}>
				<div className={css.root}>
					{rsSimulation.stepNavigationController.displayType === 'tree-navigator' ?
					<Splitter
						position="vertical"
						primaryPaneMaxWidth="fit-content"
						primaryPaneMinWidth="0"
						primaryPaneWidth="fit-content"
						postPoned={false}>
							<div className={css.navigationTreeContainer}>
								<NavigationTree rsSimulation={rsSimulation} />
							</div>
							{this.renderContentBody(showNoteEditor)}
						</Splitter> :
						this.renderContentBody(showNoteEditor)
					}
					<NavButtonsBar
						controller={rsSimulation.stepNavigationController}
					/>
					<ExpireDialogComponent app={rsSimulation} />
				</div>
				<RSSimulationValidationSidebar rsSimulation={rsSimulation} />
			</FlipMove>
		</>;
	}
}


@observer
export class DefinitionFileInput extends React.Component<{rsSimulation: RSSimulation}, {}> {
	_disposers: IReactionDisposer[] = [];

	constructor(props) {
		super(props);

		this._disposers.push(
			autorun(() => {
				this.definitionFileId && userFileStore.loadDescriptor(this.definitionFileId);
			})
		);
	}

	get path() {
		return "definitionFileOptions.definitionFile";
	}

	get definitionFileId(): string {
		return _.get(this.props.rsSimulation.userInputs, "definitionFileOptions.definitionFile");
	}

	setOptionChoice = async (name, value: string | number) => {
		try {
			// this.props.io.silentLock = true;
			await this.props.rsSimulation.sendInputsUpdate({definitionFileOptions: {definitionFile: value}});
		}
		finally {
			// this.props.io.silentLock = false;
		}
	}

	componentWillUnmount(): void {
		this._disposers.forEach(f => f());
		this.props.rsSimulation.cleanup();
	}

	render() {
		const {definitionFileId, path} = this;
		const selectedDefinition = userFileStore.userFiles.get(definitionFileId);

		return <ObjectChooser<UserFile>
				rootClassName={css.objectChooser}
				objectType={UserFile}
				launcherPlaceholder={i18n.intl.formatMessage({
					defaultMessage: "Choose Definition File...",
					description: "[RSSimulationApplication][DefinitionFileInput] placeholder for the file input"})
				}
				selections={selectedDefinition && [selectedDefinition]}
				chooseItemFilters={{status:["Complete"], type:["DFA"] }}
				onSave={(selections) => this.setOptionChoice(path, selections.length > 0 ? selections[0]._id : null)}
				isConfirmBeforeChange={true}
			/>
	}
}

@observer
export class RSSimulationLockCover extends React.Component<{rsSimulation: RSSimulation}, any>{
	render() {
		const rsSimulation = this.props.rsSimulation;
		return <LockCover
			isLocked={rsSimulation.isShowLockCover}
			tooltipContent={
				rsSimulation.isRunning ?
				i18n.intl.formatMessage({defaultMessage: "Inputs locked while simulating." , description: "[RSSimulationApplication][RSSimulationLockCover] inputs on the page are locked message"}) :
				i18n.intl.formatMessage({defaultMessage: "The simulation inputs have been locked. Please unlock to edit.", description: "[RSSimulationApplication][RSSimulationLockCover] operate tooltip for unlock inputs"})
			}
			objectType={Simulation.ObjectType}
			canUnlock={!rsSimulation.isRunning}
			unlockInputs={rsSimulation.unlockInputs}
		/>
	}
}