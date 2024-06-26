import {AppIcon, bp, NewSimulationDialog, simulationFileControl} from 'components';
import {DefinitionHistoryDialog} from 'components/system/rsSimulation/internal/DefinitionHistoryDialog';
import {ModuleSelectionDialog} from 'components/system/rsSimulation/internal/ModuleSelectionDialog';
import {ManualValidationProgressDialog} from 'components/system/rsSimulation/internal/progress/ManualValidationProgressDialog';
import {RollForwardDialog} from 'components/system/rsSimulation/internal/RollForwardDialog';
import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {FlexibleAxesEditorDialog} from 'components/system/rsSimulation/rwRecalibration/FlexibleAxesEditor';
import {LockMenuItem} from 'components/system/LockMenuItem/LockMenuItem';
import {computed, makeObservable, action} from 'mobx';
import * as React from 'react';
import {appIcons, RSSimulation, i18n, Query, Simulation, site, user} from 'stores';
import {observer} from 'mobx-react';
import {Menu, MenuDivider, MenuItem, Switch} from '@blueprintjs/core';
import {queryMessages} from 'stores/i18n/queryMessages';

import css from './RSSimulationContextMenu.css';

import {QueryPropertiesDialog} from 'components/system/query-tool/QueryPropertiesDialog';
import {queryFileControl} from 'components/system/query-tool/query-builder/QueryContextMenu';
import { BatchImportDialog } from '../BatchImport/BatchImportDialog';
import { GetTemplateDialog, ICON as GetTemplateDialogICON, TITLE as GetTemplateDialogTITLE } from './GetTemplateDialog';

interface MyProps {
	simulation?: Simulation;
}

@observer
export class RSSimulationContextMenu extends React.Component<MyProps, {}> {
    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
    }

    @computed get gemsDefinitionFile() {
		return user.isFeatureEnabled("gemsDefinitionFile");
	}

    getChangeDisplayCallback = (newDisplayType) => {
		return () => {
			const { simulation: { rsSimulation }} = this.props;
			rsSimulation.stepNavigationController.displayType = newDisplayType;
			rsSimulation.updateAdditionalControls({navigatorType: newDisplayType});
		};
	}

    toggleAddressPath = action(() => {
		const { simulation: { rsSimulation }} = this.props;
		const newAddressPathVisibility = !rsSimulation.stepNavigationController.showAddressPath;
		rsSimulation.stepNavigationController.showAddressPath = newAddressPathVisibility;
		rsSimulation.updateAdditionalControls({showAddressPath: newAddressPathVisibility});
	})

    toggleNoteEditor = action(() => {
		const { simulation: { rsSimulation }} = this.props;
		const newNoteEditorVisibility = !rsSimulation.additionalControls.showNoteEditor;
		rsSimulation.updateAdditionalControls({showNoteEditor: newNoteEditorVisibility});
	})

	renameQuery = () => queryFileControl.promptRename(this.props.simulation.rsSimulation.query);

	importQuerySpecification = () => {
		const query = this.props.simulation.rsSimulation.query;
		site.setDialogFn(() => <QueryPropertiesDialog query={query} focusTarget='querySpecification'/>);
	}

	renderQueryMenuItems = () => {
		const {simulation: {rsSimulation}} = this.props;

		if (_.get(rsSimulation, ['stepNavigationController', 'activeItem', 'pageId'], '') === 'query') {
			const { query } = rsSimulation;
			if (rsSimulation.isComplete && query) {
				const iconSize = { width: 16, height: 16 };
				const disabled = query.busy || query.isRunning;
				return (
					<>
						<MenuDivider/>
						<bp.MenuItem text={Query.OBJECT_NAME_SINGLE} icon={<AppIcon icon={appIcons.tools.queries} iconningSize={20} style={iconSize} />}>
							<bp.MenuItem
								text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RENAME(Query.OBJECT_NAME_SINGLE)}
								disabled={disabled}  icon={<AppIcon icon={appIcons.file.rename} />} onClick={this.renameQuery} />
							<bp.MenuItem
								text={i18n.intl.formatMessage({defaultMessage: "Reset Query Specification", description: "[QueryContextMenu] item title - reset all inputs configuration"})}
								disabled={disabled} icon="history" onClick={() => query.reset()} />
							<bp.MenuItem
								text={i18n.common.FILE_CTRL.WITH_VARIABLES.EXPORT(Query.OBJECT_NAME_SINGLE)}
								icon={<AppIcon icon={appIcons.queryTool.download} style={iconSize}/>}
							>
								<bp.MenuItem
									text={i18n.intl.formatMessage({defaultMessage: "Query Specification", description: "[QueryContextMenu] export sub-item title - a inputs Specification JSON file"})}
									onClick={() => query.downloadQueryDefinition()}/>
								<bp.MenuItem
									text={i18n.intl.formatMessage({defaultMessage: "Variables List", description: "[QueryContextMenu] export sub-item title - a currently variables list file"})}
									onClick={() => query.exportVariableList(false)}/>
								<bp.MenuItem
									text={i18n.intl.formatMessage({defaultMessage: "Variables List (with ampersands)", description: "[QueryContextMenu] export sub-item title - a currently variables list file (with ampersands)"})}
									onClick={() => query.exportVariableList(true)}/>
								<bp.MenuItem
									text={i18n.intl.formatMessage({defaultMessage: "Batch Import Files", description: "export sub-item title - a csv file include all data in this Query object"})}
									onClick={() => query.batchExportVariables()}/>
							</bp.MenuItem>
							<bp.MenuItem text={i18n.intl.formatMessage(queryMessages.importQuerySpecification)} disabled={disabled}
					            icon={<AppIcon icon={appIcons.queryTool.upload} iconicDataAttribute={{"data-transfer-direction": "upload"}} iconningSize={20} style={iconSize} />}
					            onClick={this.importQuerySpecification}/>
						</bp.MenuItem>
					</>
				);
			}
		}

		return null;
	}

	render() {
		let {simulation: {rsSimulation, rsSimulation: {additionalControls}}, simulation} = this.props;
		const displayType = rsSimulation.stepNavigationController?.displayType;
		const { showAddressPath } = rsSimulation.stepNavigationController;
		const {showNoteEditor} = additionalControls;
		const canUnlock = !rsSimulation.isRunning;

		return <Menu>
			<MenuItem text={i18n.intl.formatMessage({defaultMessage: "Simulate", description: "[RSSimulationContextMenu] execute progress for get result"})}
			          icon={appIcons.action.run.name as any} disabled={!rsSimulation.canRun} onClick={getSimulateRunFunc(rsSimulation)}/>
			{rsSimulation.isFIRM && <>
				<bp.MenuItem
					text={ManualValidationProgressDialog.TITLE}
					icon={ManualValidationProgressDialog.ICON}
					disabled={!simulation} onClick={() => site.setDialogFn(() => <ManualValidationProgressDialog rsSimulation={rsSimulation} /> )}
				/>
				<MenuDivider/>
				<LockMenuItem text={`${RollForwardDialog.TITLE}...`}
				              icon={RollForwardDialog.ICON}
				              disabled={!simulation} onClick={() => site.setDialogFn(() => <RollForwardDialog rsSimulation={rsSimulation} /> )}
				              isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
				<LockMenuItem text={`${FlexibleAxesEditorDialog.TITLE}...`}
				              icon={FlexibleAxesEditorDialog.ICON}
				              disabled={!simulation} onClick={() => site.setDialogFn(() => <FlexibleAxesEditorDialog rsSimulation={rsSimulation} /> )} isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
				<LockMenuItem text={`${ModuleSelectionDialog.TITLE}...`}
				              icon={ModuleSelectionDialog.ICON}
				              disabled={!simulation} onClick={() => site.setDialogFn(() => <ModuleSelectionDialog rsSimulation={rsSimulation} /> )} isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
				<LockMenuItem text={GetTemplateDialogTITLE.PROGRESS}
				              icon={GetTemplateDialogICON}
				              disabled={!simulation} onClick={() => site.setDialogFn(() => <GetTemplateDialog rsSimulation={rsSimulation} /> )}
				              isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
				<bp.MenuItem text={`${DefinitionHistoryDialog.TITLE}...`}
				             icon={DefinitionHistoryDialog.ICON}
				             disabled={!simulation} onClick={() => site.setDialogFn(() => <DefinitionHistoryDialog rsSimulation={rsSimulation} /> )}/>
			</>}
			<bp.Divider />
			<bp.MenuItem text={i18n.common.OBJECT_CTRL.VALIDATION_SIDEBAR} icon="tick-circle">
				<bp.MenuItem active={additionalControls?.showValidationSetting === true}  text={i18n.common.WORDS.SHOW} onClick={() => rsSimulation.updateAdditionalControls({showValidationSetting: true})}/>
				<bp.MenuItem active={additionalControls?.showValidationSetting === false} text={i18n.common.WORDS.HIDE} onClick={() => rsSimulation.updateAdditionalControls({showValidationSetting: false})}/>
				<bp.MenuItem active={additionalControls?.showValidationSetting == null}   text={i18n.common.WORDS.AUTO} onClick={() => rsSimulation.updateAdditionalControls({showValidationSetting: null})}/>
			</bp.MenuItem>
			<bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Navigation Mode", description: "[RSSimulationContextMenu] set the display mode of the navigation items"})}
				icon={"diagram-tree"}
			>
				<bp.MenuItem className={css.switchInMenuItem} shouldDismissPopover={false}
				             text={<Switch
					             label={i18n.intl.formatMessage({defaultMessage: "Address Path", description: "[RSSimulationContextMenu] switch for show/hide the address path bar."})}
					             checked={showAddressPath} onChange={this.toggleAddressPath}
				             />}
				/>
				<bp.MenuDivider />
				<bp.MenuItem text={i18n.intl.formatMessage({defaultMessage: "Breadcrumb", description: "[RSSimulationContextMenu] a mode about how the simulation navigated page"})}
				             active={displayType === 'breadcrumb'} onClick={this.getChangeDisplayCallback('breadcrumb')}/>
				<bp.MenuItem text={i18n.intl.formatMessage({defaultMessage: "Step by Step", description: "[RSSimulationContextMenu] a mode about how the simulation navigated page"})}
				             active={displayType === 'step-by-step'} onClick={this.getChangeDisplayCallback('step-by-step')}/>
				<bp.MenuItem text={i18n.intl.formatMessage({defaultMessage: "Tree", description: "[RSSimulationContextMenu] a mode about how the simulation navigated page"})}
				             active={displayType === 'tree-navigator'} onClick={this.getChangeDisplayCallback('tree-navigator')}/>
			</bp.MenuItem>
			{rsSimulation.isFIRM && <bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Note", description: "[RSSimulationContextMenu] the note editor switcher"})}
				icon={"annotation"}
			>
				<bp.MenuItem className={css.switchInMenuItem} shouldDismissPopover={false}
				             text={<Switch checked={showNoteEditor} label={i18n.common.WORDS.SHOW} onChange={this.toggleNoteEditor} />} />
			</bp.MenuItem>}
			<MenuDivider/>
			<bp.MenuItem
				text={i18n.common.FILE_CTRL.WITH_VARIABLES.EXPORT(rsSimulation.isFIRM ? "DFA" : i18n.common.FILE_CTRL.SPECIFICATION)}
				icon={<AppIcon icon={appIcons.investmentOptimizationTool.download} style={{width:16, height:16}} />} disabled={!simulation} onClick={() => rsSimulation.exportInputs()}/>
			<bp.MenuItem icon={<AppIcon icon={{type: 'iconic', name: 'cloud-upload'}} style={{width:16, height:16}} />} text={i18n.common.FILE_CTRL.BATCH_IMPORT}>
				<LockMenuItem
					text={i18n.intl.formatMessage({ defaultMessage: 'Calibration Inputs', description: '[RSSimulationContextMenu] Menu text for batch export calibration inputs'})}
					icon={<AppIcon icon={{type: 'iconic', name: 'cloud-upload'}} style={{width:16, height:16}} />} disabled={!simulation} onClick={() => site.setDialogFn(() => <BatchImportDialog title={BatchImportDialog.CALIBRATION_INPUTS_TITLE} progressData={rsSimulation.rnRecalibration.batchImportProgressData} batchImport={rsSimulation.rnRecalibration.batchImport} /> )} isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
				<LockMenuItem
					text={i18n.intl.formatMessage({ defaultMessage: 'Parameters', description: '[RSSimulationContextMenu] Menu text for batch export parameters'})}
					icon={<AppIcon icon={{type: 'iconic', name: 'cloud-upload'}} style={{width:16, height:16}} />} disabled={!simulation} onClick={() => site.setDialogFn(() => <BatchImportDialog title={BatchImportDialog.PARAMETERS_TITLE} progressData={rsSimulation.batchImportProgressData} batchImport={rsSimulation.batchImport} /> )} isLocked={rsSimulation.isShowLockCover} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
			</bp.MenuItem>
			{this.renderQueryMenuItems()}
			<MenuDivider/>
			<MenuItem text={i18n.common.OBJECT_CTRL.NEW} icon='document' onClick={() =>
				site.setDialogFn(() => <NewSimulationDialog type={rsSimulation.sourceType} /> )
			}/>
			<MenuItem text={i18n.common.OBJECT_CTRL.RENAME} icon='edit' onClick={() => simulationFileControl.promptRename(simulation)}/>
			<bp.MenuItem text={i18n.common.OBJECT_CTRL.DUPLICATE} icon={<AppIcon icon={appIcons.file.copy} />} disabled={!simulation} onClick={() => simulationFileControl.copy(simulation)}/>
			<bp.MenuItem text={i18n.common.OBJECT_CTRL.DELETE} icon={<AppIcon icon={appIcons.file.delete} />} disabled={!simulation} onClick={() => simulationFileControl.delete(simulation)}/>
		</Menu>
	}
}


@observer
export class RSSimulationBookMenu extends React.Component<{rsSimulation: RSSimulation}, {}> {
	render() {
		const {rsSimulation} = this.props;

		return <Menu>
			<MenuItem text="1. Setup" onClick={() => rsSimulation.navigateToPage(1)}/>
			<MenuItem text="2. Result" onClick={() => rsSimulation.navigateToPage(2)}/>
		</Menu>
	}
}
