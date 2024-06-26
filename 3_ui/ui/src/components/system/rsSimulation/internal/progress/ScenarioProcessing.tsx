import {RSSimulationRunning} from 'components/system/rsSimulation/RSSimulationRunning';
import {HighchartsLegend} from 'components/system/rsSimulation/internal/progress/HighchartsLegend';
import * as React from 'react';
import {HighChartsStatusGrid} from './HighchartsStatusGrid';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n} from 'stores';
import { bp } from 'components';

import * as progressCss from './RSSimulationRunningProgress.css'

interface myProps {rsSimulation: RSSimulation, chartHeight?: number, rsSimulationRunningComponent?: RSSimulationRunning}

const LEGENDS = {
	'waiting':              { color: bp.Colors.LIGHT_GRAY3, name: i18n.intl.formatMessage({defaultMessage: 'Waiting', description: '[RSSimulation] Computation status legend name - Waiting'}) },
	'inputsSaved':          { color: bp.Colors.CERULEAN5, name: i18n.intl.formatMessage({defaultMessage: 'Inputs saved', description: '[RSSimulation] Computation status legend name - Inputs saved'}) },
	'inputsRead':           { color: bp.Colors.ORANGE5, name: i18n.intl.formatMessage({defaultMessage: 'Inputs read', description: '[RSSimulation] Computation status legend name - Inputs read'}) },
	'computing':            { color: bp.Colors.VERMILION5, name: i18n.intl.formatMessage({defaultMessage: 'Computing', description: '[RSSimulation] Computation status legend name - Computing'}) },
	'computed':             { color: bp.Colors.RED2, name: i18n.intl.formatMessage({defaultMessage: 'Computed', description: '[RSSimulation] Computation status legend name - Computed'}) },
	'outputSendToDatabase': { color: bp.Colors.RED1, name: i18n.intl.formatMessage({defaultMessage: 'Output saved', description: '[RSSimulation] Computation status legend name - Output saved'}) },
	'outputReadByDatabase': { color: bp.Colors.LIME5, name: i18n.intl.formatMessage({defaultMessage: 'Output read', description: '[RSSimulation] Computation status legend name - Output read'}) },
	'loadedIntoDatabase':   { color: bp.Colors.LIME3, name: i18n.intl.formatMessage({defaultMessage: 'Output loaded', description: '[RSSimulation] Computation status legend name - Output loaded'}) }
}

export class ScenarioProcessing extends React.Component<myProps, any> {

	render() {
		return <div className={classNames(progressCss.root)}>
			<div className={classNames(progressCss.summarySection, progressCss.header)}>
				<FormattedMessage defaultMessage="Scenario Processing" description="[RSSimulation] Title for Scenario Progressing in Simulation Running Progress" />
			</div>
			<div className={progressCss.summarySection} style={{display:'grid', gridTemplateColumns: '4fr 150px 2fr 180px'}}>
				<div style={{overflowX: 'auto'}}>
					<ComputationStatusGrid {...this.props} />
				</div>
				<div style={{overflowX: 'visible'}}>
					<ManagerStatusGrid {...this.props} />
				</div>
				<div style={{overflowX: 'auto'}}>
					<DatabaseStatusGrid {...this.props} />
				</div>
				<div style={{overflowX: 'visible'}}>
					<Legend chartHeight={210} />
				</div>
			</div>
		</div>;
	}
}

@observer
export class ComputationStatusGrid extends React.Component<myProps, any> {

	detailConfig :{name: string, color: string, key: string, opposite?: boolean}[] = [
		{...LEGENDS.inputsSaved, key: 'computerStatus.numberScenariosReading'},
		{...LEGENDS.inputsRead,  key: 'computerStatus.numberScenariosWaiting'},
		{...LEGENDS.computing,   key: 'computerStatus.numberScenariosComputing'},
		{name: LEGENDS.computing.name, color: "transparent",   key: 'computerStatus.numberScenariosComputing'},
		{...LEGENDS.computed,    key: 'computerStatus.numberScenariosWriting', opposite: true}
	]

	private previousData: number[][];
	@computed get data(): number[][] {
		const total = this.props.rsSimulation.runningMessage?.progressMessage?.computationProcessesTotal;
		const dataAry = this.props.rsSimulation.runningMessage?.progressMessage?.computerStatus;
		if (total == 0) {
			return [];
		}
		let rtn = this.previousData ? this.previousData.slice(0, total) : [];
		_.forEach(dataAry, computerStatus => {
			const index = computerStatus.computerIndex;
			rtn[index] = _.map(this.detailConfig, c => {
				const v = _.get(computerStatus, c.key) * (c.opposite === true ? -1 : 1) || 0;
				if (c.color == "transparent") {
					return (v === 0) ? 1 : 0;
				}
				return v;
			});
		});

		for (let i = 0; i < total; i++){
			(!rtn[i]) && ( rtn[i] = _.map(this.detailConfig, () => 0));
		}

		this.previousData = rtn;
		return rtn;
	}

	onRedraw = (chart: HighchartsChartObject) => {
		if (this.props.rsSimulationRunningComponent) {
			this.props.rsSimulationRunningComponent.setStatusGridMargin("scenarioProcessing", 0, chart);
		}
	}

	@computed get paddingLeft() {
		return this.props.rsSimulationRunningComponent?.getStatusGridMargin("scenarioProcessing", 0) || 0;
	}

	render() {
		return <div>
			<div className={progressCss.sectionTitle}>
				<FormattedMessage defaultMessage="Computation" description="[RSSimulation] Title for Computation in Simulation Running Progress" />
			</div>
			<div style={{paddingLeft: this.paddingLeft}}>
				<HighChartsStatusGrid
					max={5} min={-4} data={this.data}
					categories={_.map(this.detailConfig, c => c.name)}
					colors={_.map(this.detailConfig, c => c.color)}
					chartHeight={this.props.chartHeight}
					columnWidth={(plotWidth, plotHeight, axisDiff) => {
						return Math.min(70, Math.floor( plotWidth / this.data.length ));
					}}
					minorTickInterval={() => 1}
					axisLabelEnabled={false}
					redraw={this.onRedraw}
				/>
			</div>

		</div>;
	}

}

@observer
export class ManagerStatusGrid extends React.Component<myProps, any> {

	detailConfig :{name: string, color: string, keys: string[]}[] = [
		{name: i18n.intl.formatMessage({defaultMessage: 'Waiting', description: '[RSSimulation] Manager status detail name - Waiting'}), color: bp.Colors.GRAY5, keys: []},
		{name: i18n.intl.formatMessage({defaultMessage: 'Waiting', description: '[RSSimulation] Manager status detail name - Waiting'}), color: LEGENDS.inputsSaved.color, keys: ['numberScenariosInputsWrittenWaiting']},
		{name: i18n.intl.formatMessage({defaultMessage: 'Inputs saved', description: '[RSSimulation] Manager status detail name - Inputs saved'}), color: 'transparent',  keys: ['numberScenariosInputsReading','numberScenariosInputsReadWaiting','numberScenariosComputing','numberScenariosOutputsWriting']},
		{name: i18n.intl.formatMessage({defaultMessage: 'inputs', description: '[RSSimulation] Manager status detail name - inputs'}), color: LEGENDS.outputSendToDatabase.color,        keys: ['numberScenariosOutputsWrittenWaiting']},
		{name: i18n.intl.formatMessage({defaultMessage: 'Output saved', description: '[RSSimulation] Manager status detail name - Output saved'}), color: 'transparent', keys: ['numberScenariosOutputsReading', 'numberScenariosOutputsReadNotLoaded', 'numberScenariosOutputsLoaded']},
	]

	@computed get data(): number[][] {
		const progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		if (!progressMessage) {
			return [];
		}
		let waiting = progressMessage.numberScenarios;
		const d = [_.map(this.detailConfig, c => {
			const v = _.sum(_.map(c.keys, k => _.get(progressMessage, k))) || 0;
			waiting -= v;
			return v
		})];
		d[0][0] = waiting;
		return d;
	}

	onRedraw = (chart: HighchartsChartObject) => {
		if (this.props.rsSimulationRunningComponent) {
			this.props.rsSimulationRunningComponent.setStatusGridMargin("scenarioProcessing", 1, chart);
		}
	}

	@computed get paddingLeft() {
		return this.props.rsSimulationRunningComponent?.getStatusGridMargin("scenarioProcessing", 1) || 0;
	}

	render() {
		const progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		return <div>
			<div className={progressCss.sectionTitle}>
				<FormattedMessage defaultMessage="Manager" description="[RSSimulation] Title for Manager in Simulation Running Progress" />
			</div>
			<div style={{paddingLeft: this.paddingLeft}}>
				<HighChartsStatusGrid
					max={progressMessage?.numberScenarios} min={0} data={this.data}
					categories={_.map(this.detailConfig, c => c.name)}
					colors={_.map(this.detailConfig, c => c.color)}
					chartHeight={this.props.chartHeight}
					// minorTickInterval={(extremes) => (extremes.max - extremes.min) / 10}
					tooltipEnabled={false}
					redraw={this.onRedraw}
				/>
			</div>

		</div>;
	}

}

@observer
export class DatabaseStatusGrid extends React.Component<myProps, any> {

	detailConfig :{name: string, color: string, key: string, opposite?: boolean}[] = [
		{...LEGENDS.outputSendToDatabase, key: 'workerStatus.numberScenariosReading'},
		{...LEGENDS.outputReadByDatabase, key: 'workerStatus.numberScenariosReadNotLoaded'},
		{...LEGENDS.loadedIntoDatabase,   key: 'workerStatus.numberScenariosLoaded'}
	]

	private previousData: number[][];
	@computed get data(): number[][] {
		const total = this.props.rsSimulation.runningMessage?.progressMessage?.databaseProcessesTotal;
		const dataAry = this.props.rsSimulation.runningMessage?.progressMessage?.workerStatus;
		if (total == 0) {
			return [];
		}
		let rtn = this.previousData ? this.previousData.slice(0, total) : [];

		_.forEach(dataAry, computerStatus => {
			const index = computerStatus.workerIndex;
			rtn[index] = _.map(this.detailConfig, c =>_.get(computerStatus, c.key) || 0);
		});

		for (let i = 0; i < total; i++){
			(!rtn[i]) && ( rtn[i] = _.map(this.detailConfig, () => 0));
		}

		this.previousData = rtn;
		return rtn;
	}

	lastMax = 0;
	@computed get max(): number {
		this.lastMax = _.max([this.lastMax, ...(_.map(this.props.rsSimulation.runningMessage?.progressMessage?.workerStatus, ws => _.get(ws, 'workerStatus.numberScenarios')) as number[])])
		return this.lastMax;
	}

	onRedraw = (chart: HighchartsChartObject) => {
		if (this.props.rsSimulationRunningComponent) {
			this.props.rsSimulationRunningComponent.setStatusGridMargin("scenarioProcessing", 2, chart);
		}
	}

	@computed get paddingLeft() {
		return this.props.rsSimulationRunningComponent?.getStatusGridMargin("scenarioProcessing", 2) || 0;
	}

	render() {
		return <div>
			<div className={progressCss.sectionTitle}>
				<FormattedMessage defaultMessage="Database" description="[RSSimulation] Title for Database in Simulation Running Progress" />
			</div>
			<div style={{paddingLeft: this.paddingLeft}}>
				<HighChartsStatusGrid
					max={this.max} min={0} data={this.data}
					categories={_.map(this.detailConfig, c => c.name)}
					colors={_.map(this.detailConfig, c => c.color)}
					chartHeight={this.props.chartHeight}
					columnWidth={(plotWidth, plotHeight, axisDiff) => {
						return Math.min(70, Math.floor( plotWidth / this.data.length ));
					}}
					redraw={this.onRedraw}
				/>
			</div>
		</div>;
	}

}

export class Legend extends React.Component<{chartHeight?: number}, any> {
	render() {
		return <HighchartsLegend series={Object.values(LEGENDS)} chartHeight={this.props.chartHeight} />;
	}
}