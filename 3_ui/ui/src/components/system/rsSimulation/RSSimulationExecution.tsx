import {RunningMessageBox} from 'components/system/rsSimulation/internal/progress/RunningMessageBox';
import {getSimulateRunFunc} from 'components/system/rsSimulation/internal/SimulateConfirmDialog';
import {action, computed, makeObservable, observable} from 'mobx';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {RSSimulationRunning} from './RSSimulationRunning';
import { observer } from 'mobx-react';
import { bp, RunButton } from 'components';
import {RSSimulation, i18n} from 'stores';
import FlipMove from 'react-flip-move';

import * as css from './RSSimulationExecution.css';

interface MyProps {
	rsSimulation: RSSimulation;
	renderOptions: () => JSX.Element;
}

@observer
export class RSSimulationExecution extends React.Component<MyProps, {}> {
	@observable showLogs = false;

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	get calloutsByStatus() {
		return {
			"Complete": {
				title: i18n.intl.formatMessage({defaultMessage: "Simulation Complete", description: "[RSSimulation] message box title for the gems based object simulated"}),
				description: this.props.rsSimulation.isGEMS ?
				             i18n.intl.formatMessage({defaultMessage: "Please proceed to download the results or perform a query.", description: "[RSSimulation] message box title for the gems object simulated"}) :
				             i18n.intl.formatMessage({defaultMessage: "Please proceed to results.", description: "[RSSimulation] message box description for the firm object simulated"}),
				intent: bp.Intent.SUCCESS
			},
			"Failed": {
				title: i18n.intl.formatMessage({defaultMessage: "Simulation Failed", description: "[RSSimulation] message box title for the gems based object run simulation but failed"}),
				description: i18n.intl.formatMessage({defaultMessage: "A fatal error has occurred while simulating.", description: "[RSSimulation] message box description for the gems based object run simulation but failed"}),
				intent: bp.Intent.DANGER
			},
			"Canceled": {
				title: i18n.intl.formatMessage({defaultMessage: "Simulation Canceled", description: "[RSSimulation] message box title for the gems based object simulate cancelled before complete"}),
				description: i18n.intl.formatMessage({defaultMessage: "The simulation has been canceled.", description: "[RSSimulation] message box description for the gems based object simulate cancelled before complete"}),
				intent: bp.Intent.WARNING
			}
		}
	}

	render() {
		const { rsSimulation } = this.props;
		const { isRunning, isCanceling } =rsSimulation;

		if (isRunning || isCanceling) {
			return <RSSimulationRunning rsSimulation={rsSimulation} />;
		}

		const callout = this.calloutsByStatus[rsSimulation.status];
		const allowLogs = rsSimulation?.runningMessage?.textMessages != null;

		return(
			<div className={css.root}>
				{this.props.renderOptions()}
				{!rsSimulation.isComplete && <RunButton
					 className={css.run}
					 isDisabled={!rsSimulation.canRun}
					 isComplete={!rsSimulation.isRunning}
					 buttonText={i18n.intl.formatMessage({defaultMessage: "Start Scenario Generation", description: "[SimulateConfirmDialog] dialog run button text - start simulate"})}
					 tooltipContent={""}
					 runCallback={getSimulateRunFunc(rsSimulation)}
					 cancelCallback={rsSimulation.cancel}
				 />}
				{callout &&
					<bp.Callout title={callout.title} intent={callout.intent}>
						<div className={css.simulationStatusCalloutContent}>
							<span>{callout.description}</span>
							{allowLogs && <bp.Button
								active={this.showLogs} minimal large
								onClick={action(() => this.showLogs = !this.showLogs)}>
								<FormattedMessage defaultMessage={"Show Log"} description={"[RSSimulation] the simulate history log box display switcher"}/>
							</bp.Button>}
						</div>
					</bp.Callout>}
				<FlipMove>
					{allowLogs && this.showLogs && callout && <RunningMessageBox rsSimulation={this.props.rsSimulation} />}
				</FlipMove>
			</div>
		);
	}
}