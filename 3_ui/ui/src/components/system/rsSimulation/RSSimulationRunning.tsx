import {MemoryUtilization} from './internal/progress/MemoryUtilization';
import {PageWithMessageBox} from './internal/progress/RunningMessageBox';
import {ScenarioProcessing} from './internal/progress/ScenarioProcessing';
import {SummaryStatus} from './internal/progress/SummaryStatus';
import {Progress} from 'components/system/Progress/Progress';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {RSSimulation, i18n} from 'stores';
import { LoadingIndicator } from "components";

import * as css from './RSSimulationRunning.css';

@observer
export class RSSimulationRunning extends Component<{rsSimulation: RSSimulation}, null> {
	title = i18n.intl.formatMessage({
		defaultMessage: 'Simulation Monitor',
		description: '[RSSimulation] Main title of Simulation Running Progress'
	});

	@observable statusGridMargins: {scenarioProcessing: number[], memoryUtilization: number[]};

	constructor(props) {
		super(props);
		this.statusGridMargins = {scenarioProcessing: [0,0,0], memoryUtilization: [0,0,0]};

		makeObservable(this);
	}

	@computed get isHidden(): boolean {
		const { rsSimulation: {isRunning, isCanceling, useCaseViewer} } = this.props;
		const areQueriesRunning = useCaseViewer ? useCaseViewer.areQueriesRunning : false;
		return !isRunning && !isCanceling && !areQueriesRunning;
	}
	
	@computed get launchSimulationProgressMessage() {
		return _.filter(this.props.rsSimulation.progressMessage, (pm) => pm.type == "launch_simulation");
	}

	@computed get isPreparing(): boolean {
		const hasRunningMessage = !!this.props.rsSimulation.runningMessage?.progressMessage;
			// || !!this.props.rsSimulation.runningMessage?.textMessages;
		if (hasRunningMessage) {
			return false;
		}
		const progressMessage = this.launchSimulationProgressMessage;
		if (!progressMessage?.length) {
			return true;
		}
		let allReady = true;
		_.forEach(progressMessage, (pm) => {
			allReady = allReady && pm.progress?.numerator == pm.progress?.denominator
		})
		return !(allReady && hasRunningMessage);
	}

	@computed get preparingStatus() {
		let progressMessage = this.launchSimulationProgressMessage;
		if (!progressMessage?.length) {
			progressMessage = [{
				type: "launch_simulation",
				label: i18n.intl.formatMessage({
					defaultMessage: 'Starting...',
					description: '[RSSimulation] Progress message while starting simulation'
				}),
				currentMessage: "",
				progress: { numerator: 0, denominator: 1 }
			}];
		}
		return <Progress title={this.title} progressMessages={progressMessage}/>;
	}

	@computed get runningQueryStatus() {
		const { useCaseViewer } = this.props.rsSimulation;
		const { queriesProgress, lastQueriesProgressUpdate } = useCaseViewer;

		const progressMessages = _.values(queriesProgress).map((queryProgress) => {
			const { title: label, numerator, message: currentMessage }  = queryProgress;
			return {
				type: 'running_use_case_queries',
				label,
				currentMessage,
				progress: { numerator, denominator: 100 }
			};
		});

		if (progressMessages.length > 0) {
			return <Progress title={i18n.intl.formatMessage({
				defaultMessage: 'Running  {queryTitle} Queries',
				description: '[RSSimulation] Progress message while running a query after simulation is completed'
			}, {queryTitle: useCaseViewer.title})} progressMessages={progressMessages} />;
		}

		return <LoadingIndicator inline={true} text={i18n.intl.formatMessage({
			defaultMessage: 'Preparing to initialize Queries ...',
			description: '[RSSimulation] Loading message while initializing queries after simulation is completed'
		})} />;
	}

	@action setStatusGridMargin(key: "scenarioProcessing" | "memoryUtilization", index: number, chart: HighchartsChartObject) {
		const plotBoxLeft = chart.plotLeft;
		_.set(this.statusGridMargins, `${key}.${index}`, plotBoxLeft);
	}

	getStatusGridMargin(key: "scenarioProcessing" | "memoryUtilization", index: number) {
		const plotBoxLeft = _.get(this.statusGridMargins, `${key}.${index}`);

		return Math.max(0, (Math.max(...(_.map(Object.values(this.statusGridMargins), v => v[index]))) - plotBoxLeft));
	}

	render() {
		if (this.isHidden) {
			return null;
		}

		if (this.props.rsSimulation.useCaseViewer?.areQueriesRunning) {
			return (
				<div className={css.root}>
					{this.runningQueryStatus}
				</div>
			);
		}

		if (this.isPreparing ) {
			return <div className={css.root}>
				{this.preparingStatus}
			</div>;
		}

		return <PageWithMessageBox rsSimulation={this.props.rsSimulation} title={this.title}>
			{!!this.props.rsSimulation.runningMessage?.progressMessage && (<div className={css.root}>
				<SummaryStatus rsSimulation={this.props.rsSimulation}/>
				<ScenarioProcessing rsSimulation={this.props.rsSimulation} chartHeight={210} rsSimulationRunningComponent={this} />
				<MemoryUtilization rsSimulation={this.props.rsSimulation} chartHeight={210} rsSimulationRunningComponent={this} />
			</div>)}
		</PageWithMessageBox>
	}
}