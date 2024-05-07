import {RunningMessageBox, RunningMessageDialog} from 'components/system/rsSimulation/internal/progress/RunningMessageBox';
import {observer} from 'mobx-react';
import * as React from 'react';
import {appIcons, Simulation, site, rsSimulationStore, RSSimulation, api} from 'stores';
import {makeObservable} from 'mobx';
import {AppIcon, bp, NewSimulationDialog, simulationFileControl} from 'components';
import * as css from './SimulationUseCaseContextMenu.css';
import {SortableBookMenu} from 'components/system/Book/SortableBookMenu';
import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {MenuItem} from '@blueprintjs/core';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {formatLabelText} from 'utility';
import {BatchImportDialog} from 'components/system/BatchImport/BatchImportDialog';
import {LockMenuItem} from 'components/system/LockMenuItem/LockMenuItem';

// TODO: Refactor to remove duplicate code

interface MyProps {
	simulation?: Simulation;
}

@observer
export class SimulationUseCaseContextMenu extends React.Component<MyProps, {}> {
	constructor(props: MyProps) {
		super(props);
	}

	render() {
		let { simulation, simulation: {rsSimulation}} = this.props;
		let {useCaseViewer} = rsSimulation;
		const hasPages = useCaseViewer.book.pages.length != 0;
		const canUnlock = !rsSimulation.isRunning;

		return <bp.Menu className={css.root}>
			<bp.MenuItem disabled={true} text="">
				<bp.MenuItem text="" />
			</bp.MenuItem>
			<bp.MenuItem text="Book" icon={<AppIcon icon={appIcons.book.pages}/>} disabled={!hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.pages}}>
				<SortableBookMenu book={useCaseViewer.book} isPagesItem={true}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuItem text="Page" icon={<AppIcon icon={appIcons.book.page}/>} disabled={!hasPages} popoverProps={{usePortal:true, hoverCloseDelay:100, className:css.page}}>
				<SortableBookMenu book={useCaseViewer.book} isPagesItem={false}  enableInsert={true}/>
			</bp.MenuItem>
			<bp.MenuDivider />

			<MenuItem icon="play" text="Simulate" disabled={!rsSimulation.canRun} onClick={getSimulateRunFunc(rsSimulation)}/>
			<bp.MenuItem text={RunningMessageDialog.TITLE} icon={RunningMessageDialog.ICON} disabled={RunningMessageDialog.isDisabled(rsSimulation)} onClick={() => site.setDialogFn(() => <RunningMessageDialog rsSimulation={rsSimulation} /> )} />
			<bp.MenuDivider />

			<LockMenuItem text='Batch Import Parameters...' icon={<AppIcon icon={{type: 'iconic', name: 'cloud-upload'}} style={{width:16, height:16}} />} disabled={!simulation} onClick={() => site.setDialogFn(() => <BatchImportDialog title={BatchImportDialog.PARAMETERS_TITLE} progressData={rsSimulation.batchImportProgressData} batchImport={rsSimulation.batchImport} /> )} isLocked={rsSimulation.inputsLocked} objectType={Simulation.ObjectType} clickUnlockFn={rsSimulation.unlockInputs} canUnlock={canUnlock} />
			<bp.MenuDivider />

			<MenuItem text={`New`} icon='document' onClick={() =>
				rsSimulationStore.createNewObject("FIRM", "Untitled", null, null, null, null, rsSimulation.useCase)
			}/>
			<MenuItem text={`Rename`} icon='edit' onClick={() => simulationFileControl.promptRename(simulation)}/>
			<bp.MenuItem text='Duplicate' icon={<AppIcon icon={appIcons.file.copy} />} disabled={!simulation} onClick={() => simulationFileControl.copy(simulation)}/>
			<bp.MenuItem text='Delete' icon={<AppIcon icon={appIcons.file.delete} />} disabled={!simulation} onClick={() => simulationFileControl.delete(simulation)}/>

		</bp.Menu>
	}
}

export class SimulationUseCaseViewerFileControl {
	public pagePromptRename(rsSimulation: RSSimulation) {
		api.site.setDialogFn(() => <ObjectNameCheckerDialog
			model={null}
			canDuplicate={true}
			newName={rsSimulation.useCaseViewer.book.currentPage.title}
			onRename={async (newName) => rsSimulation.useCaseViewer.book.currentPage.updatePageTitle(newName)}
			dialogTitle={`Rename ${formatLabelText(Simulation.ObjectType)} Page`}
		/>);
	}

	public createPage(rsSimulation: RSSimulation) {
		rsSimulation.useCaseViewer.book.addPage();
	}

	public  deletePage(rsSimulation: RSSimulation) {
		rsSimulation.useCaseViewer.book.deletePage()
	}

	public copyPage(rsSimulation: RSSimulation) {
		const currentPage = rsSimulation.useCaseViewer.book.currentPage;
		const newIndex = rsSimulation.useCaseViewer.book.pages.length;
		let newPageSetting = {
			newIndex:           newIndex,
			title:              `Duplicate of ${currentPage.title.replace(/^\s*/,'')}`,
			additionalControls: currentPage.additionalControls,
			views:              currentPage.views.map((view,i) => {
				return {
					newIndex: i,
					view:     view.view,
					controls: view.controls
				}
			})
		}
		rsSimulation.useCaseViewer.book.addPage(newPageSetting);
	}
}

export const simulationUseCaseViewerFileControl = new SimulationUseCaseViewerFileControl();