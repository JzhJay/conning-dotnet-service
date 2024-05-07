import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {computed, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {site, xhr, Query, RSSimulation, i18n, Reports} from 'stores';

import {BreadcrumbComponent} from 'components/system/rsSimulation/StepNavigator';
import {ApplicationBarErrorMessage, bp, RunButton, SingularAxisCoordinates} from '../../index';

import * as appBarCss from '../../../styles/ApplicationBarItems.css';
import * as css from './RSSimulationApplicationBarItems.css';

@observer
export class RSSimulationApplicationBarItems extends React.Component<{rsSimulation: RSSimulation; location: HistoryModule.LocationDescriptorObject;}, {}> {

	renderRunButton() {
		const {rsSimulation} = this.props;
		const activeItem = _.get(rsSimulation, ['stepNavigationController', 'activeItem']);
		const pageId = activeItem?.pageId;
		const canAcceptCalibration = rsSimulation.rnRecalibration.isLoaded && rsSimulation.rnRecalibration.userInterface?.hasCalibrationChanges;

		switch (pageId) {
			case "targets":
			case "calibrationInputs":
				return <>
					<RunButton
						isDisabled={rsSimulation.inputsLocked || !rsSimulation.canCalibrate}
						isComplete={!rsSimulation.isCalibrating}
						buttonText={rsSimulation.isCalibrating ? i18n.common.DIALOG.CANCEL : i18n.common.DIALOG.CALIBRATE}
						tooltipContent={""}
						runCallback={pageId === "targets" ? rsSimulation.calibrate : rsSimulation.runRNCalibration}
						cancelCallback={pageId === "targets" ? rsSimulation.cancelCalibration : rsSimulation.cancelRNCalibration}
					/>
					{pageId === "calibrationInputs" && <bp.Tooltip disabled={!canAcceptCalibration}
																   content={i18n.intl.formatMessage({defaultMessage: "Accept the calibration changes by saving the updated simulation parameters", description: "[RSSimulationApplicationBarItems] tooltip for button that saves the calibration changes"})}>
						<bp.AnchorButton
							icon="confirm"
							className={css.optimize}
							disabled={!canAcceptCalibration}
							minimal={true}
							text={i18n.intl.formatMessage({defaultMessage: "Accept Calibration", description: "[RSSimulationApplicationBarItems] Button that accepts the changes from running a calibration"})}
							onClick={rsSimulation.rnRecalibration.acceptChanges} />
					</bp.Tooltip>}
				</>;
			case Reports.FIRST_PATH_NAME:
				const { reports } = rsSimulation;
				if (reports) {
					const itemPath = reports.getReportRootPath(activeItem.itemPath);
					const reportStatus = itemPath ? reports.getReportOutputsData(itemPath)?.status : null;
					const isRunning = itemPath && reports.isReportRunning(reportStatus);
					return <RunButton
						isDisabled={!itemPath || reports.isReportCompleted(reportStatus)}
						isComplete={!isRunning}
						buttonText={isRunning ?
						            i18n.common.DIALOG.CANCEL :
						            i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Reports.RN_OBJECT_NAME_SINGLE
			            )}
						tooltipContent={""}
						runCallback={() => reports.run(activeItem.itemPath)}
						cancelCallback={() => {}}
					/>;
				}
				break;

		}
		return <RunButton
			isDisabled={rsSimulation.inputsLocked || !rsSimulation.canRun}
			isComplete={!rsSimulation.isRunning}
			isCancelling={rsSimulation.isCanceling}
			buttonText={rsSimulation.isRunning ? i18n.common.DIALOG.CANCEL : i18n.common.DIALOG.SIMULATE}
			tooltipContent={rsSimulation.blockedRunMessage}
			runCallback={getSimulateRunFunc(rsSimulation)}
			cancelCallback={rsSimulation.cancel}
		/>
	}

	renderAdditionalButtons () {
		const { rsSimulation } = this.props;
		const activeItem = _.get(rsSimulation, ['stepNavigationController', 'activeItem']);
		if (activeItem) {
			switch(activeItem.pageId) {
				case 'query':
					const { query } = rsSimulation;
					if (rsSimulation.isComplete && query) {
						return (
							<>
								<RunButton
									isDisabled={!(query as Query).canRunQuery || query.hasResult && !query.isRunning}
									isComplete={!query.isRunning}
									buttonText={query.isRunning ? i18n.common.DIALOG.CANCEL : i18n.common.OBJECT_CTRL.WITH_VARIABLES.RUN(Query.OBJECT_NAME_SINGLE)}
									tooltipContent=""
									runCallback={action(() => {
										query.run();
									})}
									cancelCallback={query.cancel} />
								{query.hasResult && <SingularAxisCoordinates query={query}/>}
								<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.OBJECT_CTRL.WITH_VARIABLES.RESET(Query.OBJECT_NAME_SINGLE)}>
									<bp.AnchorButton icon="history" text={i18n.common.OBJECT_CTRL.RESET} minimal className={css.queryResetButton}
										onClick={() => query.reset()} disabled={query.busy || query.isRunning}/>
								</bp.Tooltip>
							</>
						);
					}
					break;
			}
		}
		return null;
	}

	render() {
		const {rsSimulation, location} = this.props;
		const pageId = this.props.rsSimulation.stepNavigationController?.activeItem?.pageId;

		return <div className={appBarCss.applicationBarItems}>
			{/*<Tabs className={css.tabs} onChange={(tabID) => {rsSimulation.navigateToPage(tabID)}} selectedTabId={location.query.page}>*/}
				{/*<Tab id="setup" title="Setup" />*/}
				{/*<Tab id="recalibration" title="Recalibration" />*/}
				{/*<Tab id="results" title="Results" />*/}
				{/*<Tabs.Expander />*/}
			{/*</Tabs>*/}
			<UndoRedoButtons rsSimulation={rsSimulation} />
			{rsSimulation.stepNavigationController?.displayType == 'breadcrumb' && <BreadcrumbComponent controller={rsSimulation.stepNavigationController} />}

			<div className={css.run}>
				{this.renderRunButton()}
			</div>
			<div className={css.additionalButtons}>
				{this.renderAdditionalButtons()}
			</div>
			<ApplicationBarErrorMessage errorMessages={rsSimulation.errorMessages} toasterWhenUpdate={true} />
			<ApplicationBarErrorMessage errorMessages={[rsSimulation.query?.errorMessage]} />
		</div>
	}
}

@observer
class UndoRedoButtons extends React.Component<{rsSimulation: RSSimulation}, any> {

	@computed get undoList() {
		return _.sortBy(_.get(this.props.rsSimulation.parametersStepHistory, [0], []).slice(), ['stepsFromFlag']);
	}

	@computed get redoList() {
		return _.sortBy(_.get(this.props.rsSimulation.parametersStepHistory, [1], []).slice(), ['stepsFromFlag']);
	}

	postAction = (action, stepsFromFlag) => {
		const rsSimulation = this.props.rsSimulation;
		site.busy = true;
		xhr.post(`${rsSimulation.apiUrl}/parameters/${action}`, {steps: stepsFromFlag}).then(async () => {
			await rsSimulation.getParametersUserInterface(true);
		}).catch((e) => {
			console.error(e);
		}).finally(() => {
			site.busy = false;
		});
	}

	renderDropdownItem = (type, item, index) => {
		return <bp.MenuItem
			key={`DropdownItem-${type}-${index}`}
			text={<React.Fragment>
				<div>{item.action.replace(/_/g, " ")}</div>
				<div style={{color: "#5c7080", fontSize: 12}}>{item.ulocation.join('/')}</div>
			</React.Fragment>}
			onClick={() => this.postAction(type, item.stepsFromFlag)}
		/>;
	}

	renderButtonGroup = (type: 'undo'|'redo') => {
		let list, icon;
		switch (type) {
			case 'undo':
				list = this.undoList;
				icon = 'undo';
				break;
			case 'redo':
				list = this.redoList;
				icon = 'redo';
				break;
			default:
				return null;
		}
		return <bp.ButtonGroup className={css.navGroup}>
			<bp.Button icon={icon} disabled={!list.length} minimal={true} className={css.navGroupMainBtn} onClick={() => this.postAction(type, 1)}/>
			{(list.length > 0) && <bp.Popover
				position={bp.Position.BOTTOM_LEFT}
				content={<bp.Menu>{_.map(list, (item, i) => this.renderDropdownItem(type, item, i))}</bp.Menu>}
			>
				<bp.Button icon={"caret-down"} minimal={true} className={css.navGroupDropdownBtn} />
			</bp.Popover>}
		</bp.ButtonGroup>
	}


	render() {
		const rsSimulation = this.props.rsSimulation;
		if (!rsSimulation.isFIRM) {
			return null;
		}
		if (rsSimulation.stepNavigationController?.activeItem?.itemPath[0] != "allParameters") {
			return null;
		}
		return <React.Fragment>
			{this.renderButtonGroup('undo')}
			{this.renderButtonGroup('redo')}
		</React.Fragment>;
	}
}