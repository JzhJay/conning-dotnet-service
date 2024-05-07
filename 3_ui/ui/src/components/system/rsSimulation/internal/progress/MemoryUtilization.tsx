import {RSSimulationRunning} from 'components/system/rsSimulation/RSSimulationRunning';
import * as React from 'react';
import {HighChartsStatusGrid} from './HighchartsStatusGrid';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n} from 'stores';
import { bp } from 'components';

import * as progressCss from './RSSimulationRunningProgress.css'

interface myProps {rsSimulation: RSSimulation, chartHeight?: number, rsSimulationRunningComponent?: RSSimulationRunning}

export class MemoryUtilization extends React.Component<myProps, any> {

	render() {
		return <div className={classNames(progressCss.root)}>
			<div className={classNames(progressCss.summarySection, progressCss.header)}>
				<FormattedMessage defaultMessage="Memory Utilization" description="[RSSimulation] Memory utilization status in simulation running progress" />
			</div>
			<div className={progressCss.summarySection} style={{display:'grid', gridTemplateColumns: '4fr 150px 2fr 180px'}}>
				<div style={{overflowX: 'auto'}}>
					<ComputationStatusGrid {...this.props} />
				</div>
				<div>
					<ManagerStatusGrid {...this.props} />
				</div>
				<div style={{overflowX: 'auto'}}>
					<DatabaseStatusGrid {...this.props} />
				</div>
				<div>

				</div>
			</div>
		</div>;
	}
}


@observer
class InternalClass extends React.Component<myProps, any> {

	columnConfigs = {
		'alert':    { color: bp.Colors.RED2, name: 'Alert' },
		'warning':  { color: bp.Colors.GOLD4, name: 'Warning' },
		'normal':   { color: bp.Colors.LIME3, name: 'Normal' }
	}

	index = -1;
	title = '';
	tickAmount = 0;
	maxColumnWidth: number|null = null;

	convertResident = (n: number) => n ? Math.round( n / Math.pow(2, 30) * 10 ) / 10 : 0;

	fitBlock = (n: number) => {
		if (!this.tickAmount) {
			return n;
		}
		const singleBlock = this.chartMax / this.tickAmount;
		return singleBlock ? Math.round(n / singleBlock) * singleBlock : n;
	}

	get max() {
		return 0;
	}

	protected residentToSeries = (n: number) => {
		const max = this.max;
		const maximumAlertLimit = this.fitBlock(this.convertResident(max * 0.85));
		const maximumWarningLimit = this.fitBlock(this.convertResident(max * 0.7));
		n = this.fitBlock(this.convertResident(n));
		return [
			n > maximumAlertLimit ? n - maximumAlertLimit : 0,
			n > maximumWarningLimit ? Math.min(n - maximumWarningLimit ,maximumAlertLimit) : 0,
			Math.min(n ,maximumWarningLimit)
		]
	}

	get data(): number[][] {
		return [];
	}

	onRedraw = (chart: HighchartsChartObject) => {
		if (this.props.rsSimulationRunningComponent) {
			this.props.rsSimulationRunningComponent.setStatusGridMargin("memoryUtilization", this.index, chart);
		}
	}

	@computed private get chartMax() {
		return this.convertResident(this.max);
	}

	@computed get paddingLeft() {
		return this.props.rsSimulationRunningComponent?.getStatusGridMargin("memoryUtilization", this.index) || 0;
	}

	render() {
		return <div>
			<div className={progressCss.sectionTitle}>{this.title}</div>
			<div style={{paddingLeft: this.paddingLeft}}>
				<HighChartsStatusGrid
					max={this.chartMax} min={0} data={this.data}
					categories={_.map(this.columnConfigs, c => c.name)}
					colors={_.map(this.columnConfigs, c => c.color)}
					chartHeight={this.props.chartHeight}
					columnWidth={(plotWidth, plotHeight, axisDiff) => {
						if (!this.maxColumnWidth) {
							return null;
						}
						return Math.min(this.maxColumnWidth, Math.floor( plotWidth / this.data.length ));
					}}
					minorTickInterval={this.tickAmount ? (extremes) => (extremes.max - extremes.min) / this.tickAmount : null}
					tooltipEnabled={false}
					redraw={this.onRedraw}
				/>
			</div>

		</div>;
	}

}


@observer
export class ComputationStatusGrid extends InternalClass {

	constructor(props, status) {
		super(props, status);

		this.index = 0;
		this.title = i18n.intl.formatMessage({ defaultMessage: 'Computation', description: '[RSSimulation] Computation status in simulation running progress'});
		this.maxColumnWidth = 70;
	}

	@computed get max() {
		return this.props.rsSimulation.runningMessage?.progressMessage?.maximumComputerMemory || 0;
	}

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
			rtn[index] = this.residentToSeries(computerStatus.computerStatus.maximumResidentSetSize);
		});

		for (let i = 0; i < total; i++){
			(!rtn[i]) && ( rtn[i] = _.map(Object.keys(this.columnConfigs), () => 0));
		}

		this.previousData = rtn;
		return rtn;
	}

	render() { return super.render(); }
}

@observer
export class ManagerStatusGrid extends InternalClass {

	constructor(props, status) {
		super(props, status);

		this.index = 1;
		this.title = i18n.intl.formatMessage({ defaultMessage: 'Manager', description: '[RSSimulation] Manager status in simulation running progress'});
	}

	@computed get max() {
		return this.props.rsSimulation.runningMessage?.progressMessage?.maximumManagerMemory || 0;
	}

	@computed get data(): number[][] {
		return [this.residentToSeries(this.props.rsSimulation.runningMessage?.progressMessage?.maximumResidentSetSize)];
	}

	render() { return super.render(); }
}

@observer
export class DatabaseStatusGrid extends InternalClass {

	constructor(props, status) {
		super(props, status);

		this.index = 2;
		this.title = i18n.intl.formatMessage({ defaultMessage: 'Database', description: '[RSSimulation] Database status in simulation running progress'});
		this.maxColumnWidth = 70;
	}

	@computed get max() {
		return this.props.rsSimulation.runningMessage?.progressMessage?.maximumWorkerMemory || 0;
	}

	private previousData: number[][];
	@computed get data(): number[][] {
		const total = this.props.rsSimulation.runningMessage?.progressMessage?.databaseProcessesTotal;
		const dataAry = this.props.rsSimulation.runningMessage?.progressMessage?.workerStatus;
		if (total == 0) {
			return [];
		}
		let rtn = this.previousData ? this.previousData.slice(0, total) : [];

		_.forEach(dataAry, workerStatus => {
			const index = workerStatus.workerIndex;
			rtn[index] = this.residentToSeries(workerStatus.workerStatus.maximumResidentSetSize);
		});

		for (let i = 0; i < total; i++){
			(!rtn[i]) && ( rtn[i] = _.map(Object.keys(this.columnConfigs), () => 0));
		}

		this.previousData = rtn;
		return rtn;
	}

	render() { return super.render(); }
}

