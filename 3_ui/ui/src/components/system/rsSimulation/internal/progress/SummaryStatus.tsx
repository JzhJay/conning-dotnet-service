import {displayUnit} from 'utility';
import {HighchartsPie} from './HighchartsPie';
import {HighchartsProgress} from './HighchartsProgress';
import {CountdownClock} from './CountdownClock'
import {SolidGaugeMonitor} from '../../../Progress/SolidGaugeMonitor';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n} from 'stores';
import { bp, ResizeSensorComponent } from 'components';

import * as progressCss from './RSSimulationRunningProgress.css';
import * as css from './SummaryStatus.css';

const RWD_THRESHOLD = {
	largetWidth: 1400,
	smallWidth: 1050
};

const i18nMessages = {
	computed: i18n.intl.formatMessage({
		defaultMessage: 'Computed',
		description: '[RSSimulation] Scenarios process category in simulation progress - Computed'
	}),
	nonComputed: i18n.intl.formatMessage({
		defaultMessage: 'Non Computed',
		description: '[RSSimulation] Scenarios process category in simulation progress - Non Computed'
	}),
	csvFiles: i18n.intl.formatMessage({
		defaultMessage: 'CSV Files',
		description: '[RSSimulation] Category for chart Number Scenarios Processed - CSV Files'
	}),
	compiler: i18n.intl.formatMessage({
		defaultMessage: 'Compiler',
		description: '[RSSimulation] Category for chart Number Scenarios Processed - Compiler'
	}),
	databaseSaved: i18n.intl.formatMessage({
		defaultMessage: 'Database saved',
		description: '[RSSimulation] Category for chart Number Scenarios Processed - Database saved'
	}),
	scenario: i18n.intl.formatMessage({
		defaultMessage: 'Scenario',
		description: '[RSSimulation] Scenario unit name'
	}),
	scenarios: i18n.intl.formatMessage({
		defaultMessage: 'Scenarios',
		description: '[RSSimulation] Scenario unit name (plural)'
	})
};

@observer
export class SummaryStatus extends React.Component<{rsSimulation: RSSimulation}, null> {

	_dispose = [];
	_rootRef = React.createRef<HTMLDivElement>();
	@observable showScenariosDetail = false;
	@observable rootWidth;

	constructor(props) {
		super(props);

		makeObservable(this);

		const timeoutID = setInterval(() => $('#_RSSimulationSummaryStatus_message_box').each( (i,elem) => $(elem).scrollTop(elem.scrollHeight)), 500);
		this._dispose.push(
			() => clearInterval(timeoutID),
			this.onResizeDebounce.cancel
		);
	}

	componentWillUnmount() {
		this._dispose.forEach( d => d() );
	}

	scenariosDetailConfig: {name: string, color: string, keys: string[]}[] = [
		{ name: i18n.intl.formatMessage({defaultMessage: 'Inputs saved', description: '[RSSimulation] Message for Simulation Running Status Summary - Inputs saved'}), color: bp.Colors.CERULEAN5, keys:["numberScenariosInputsWrittenWaiting", "numberScenariosInputsReading"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Computation inputs read', description: '[RSSimulation] Message for Simulation Running Status Summary - Computation inputs read'}), color: bp.Colors.ORANGE5, keys:["numberScenariosInputsReadWaiting"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Computation initiated', description: '[RSSimulation] Message for Simulation Running Status Summary - Computation initiated'}), color: bp.Colors.VERMILION5, keys:["numberScenariosComputing"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Computation completed', description: '[RSSimulation] Message for Simulation Running Status Summary - Computation completed'}), color: bp.Colors.RED2, keys:["numberScenariosOutputsWriting"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Computation output saved', description: '[RSSimulation] Message for Simulation Running Status Summary - Computation output saved'}), color: bp.Colors.RED1, keys:["numberScenariosOutputsAssignedWaiting", "numberScenariosOutputsWrittenWaiting", "numberScenariosOutputsReading"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Output read by database', description: '[RSSimulation] Message for Simulation Running Status Summary - Output read by database'}), color: bp.Colors.LIME5, keys:["numberScenariosOutputsReadNotLoaded"]},
		{ name: i18n.intl.formatMessage({defaultMessage: 'Output loaded into database', description: '[RSSimulation] Message for Simulation Running Status Summary - Output loaded into database'}), color: bp.Colors.LIME3, keys:["numberScenariosOutputsLoaded"]}
	];

	@computed get scenariosDetails(): number[] {
		const progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		let rtnAry = _.map(this.scenariosDetailConfig, (c) :number => {
			let s = 0;
			_.forEach(c.keys, k => {
				const v = _.get(progressMessage, k);
				if(_.isFinite(v)) {
					s += v;
				}
			})
			return s;
		});

		if (!this.showScenariosDetail) {
			return rtnAry;
		}

		let sum = 0;
		return _.map( rtnAry.reverse(), (v) => {
			v += sum;
			sum = v;
			return v;
		}).reverse();
	}

	@computed get firstScenarioAverageTimes() {
		const progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		const computed = progressMessage?.numberFirstScenariosComputed;
		if (!computed) {
			return [0,0];
		}
		return [
			parseFloat((progressMessage.firstComputationTime / computed).toFixed(1)),
			parseFloat((progressMessage.firstNonComputationTime / computed).toFixed(1))
		];
	}

	@computed get subsequentScenarioAverageTimes() {
		const progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		const computed = progressMessage?.numberOtherScenariosComputed;
		if (!computed) {
			return [0,0];
		}
		return [
			parseFloat((progressMessage.otherComputationTime / computed).toFixed(1)),
			parseFloat((progressMessage.otherNonComputationTime / computed).toFixed(1))
		];
	}

	@computed get rootCSS() {
		const { rootWidth = 1000 } = this;
		let cssByRootWidth = css.root;
		if (rootWidth >= RWD_THRESHOLD.largetWidth) {
			cssByRootWidth += ` ${css.largeWidth}`;
		} else if (rootWidth <= RWD_THRESHOLD.smallWidth) {
			cssByRootWidth += ` ${css.smallWidth}`;
		}

		return cssByRootWidth;
	}

	formatDataElements = (n: number) => {
		return n ?  n / displayUnit(n).scale : 0;
	}

	formatStringByNumber(v: number, singleUnit:string, multiUnit:string) {
		return _.isFinite(v) ? `${v} ${v > 1 ? multiUnit : singleUnit}` : '';
	}

	onResize = action(() => {
		if (this._rootRef.current) {
			this.rootWidth = $(this._rootRef.current).width();
		}
	})

	onResizeDebounce = _.debounce(this.onResize, 400)

	componentDidMount() {
		this.onResize();
	}

	render() {
		const { rootWidth } = this;
		const {rsSimulation} = this.props;
		let progressMessage = this.props.rsSimulation.runningMessage?.progressMessage;
		let numberDataElements = this.formatDataElements(progressMessage?.numberDataElements);
		let enableDownload = _.get(this.props.rsSimulation, ['userInputs', 'filesToProduceNodes', 'createFilesForDownload'], true);
		let contentStyle = {};
		const categorySpace = 180;

		if (rootWidth >= RWD_THRESHOLD.largetWidth) {
			contentStyle = {  // 1fr 390px doesn't work perfectly, need to calc width manually
				'gridTemplateColumns': `${rootWidth - 435}px 390px`
			};
		}

		return (
			<div className={this.rootCSS} ref={this._rootRef}>
				<ResizeSensorComponent onResize={this.onResizeDebounce} />
				<div className={classNames(progressCss.root, css.content)} style={contentStyle}>
					<div className={classNames(progressCss.summarySection, progressCss.header, css.header)}>
						<FormattedMessage defaultMessage="Simulation Summary Status" description="[RSSimulation] Title for Simulation Summary Status in simulation running progress" values={{br: <br/>}} />
					</div>
					<div className={classNames(progressCss.summarySection, css.progress, css.compilerBar)}>
						<HighchartsProgress
							className={css.barChart}
							max={1}
							data={[progressMessage?.compilerProgress]}
							colors={[bp.Colors.GREEN5]}
							categories={[i18nMessages.compiler]}
							categoryPlace={'right'}
							categorySpace={categorySpace}
							axisTickEnable={false}
							tickAmount={5}
							tooltip={(point)=> `${(point.y*100).toFixed(1)}%`}
						/>
					</div>
					<div className={classNames(progressCss.summarySection, css.progress, css.scenarioBar)}>
						<bp.Icon icon={this.showScenariosDetail ? 'caret-down' : 'caret-right'} onClick={action(() => this.showScenariosDetail = !this.showScenariosDetail)} size={20} style={{position: 'absolute', top:10 , left: -23, cursor: 'pointer'}} />
						<HighchartsProgress
							className={css.barChart}
							axisTitle={i18n.intl.formatMessage({defaultMessage: 'Scenarios', description: '[RSSimulation] Axis title for chart Scenarios Detail'})}
							max={progressMessage?.numberScenarios}
							data={this.scenariosDetails}
							colors={this.scenariosDetailConfig.map(c => c.color)}
							categories={this.scenariosDetailConfig.map(c => c.name)}
							stackCategory={this.showScenariosDetail ? null : i18n.intl.formatMessage({ defaultMessage: 'Scenario generation', description: '[RSSimulation] Scenarios stack category in simulation progress - Scenario generation'})}
							categoryPlace={'right'}
							categorySpace={categorySpace}
							tickAmount={5}
							tooltip={(point, isStacked)=> isStacked ?
														`${point.series.name} - ${this.formatStringByNumber(point.point.stackY, i18nMessages.scenario, i18nMessages.scenarios)}` :
														this.formatStringByNumber(point.y, i18nMessages.scenario, i18nMessages.scenarios)}
						/>
					</div>
					<div className={classNames(progressCss.summarySection, css.progress, css.dataBar)}>
						<HighchartsProgress
							className={css.barChart}
							axisTitle={i18n.intl.formatMessage({
								defaultMessage: '{unit} Data Elements',
								description: '[RSSimulation] Axis title in Data Elements Chart in Simulation Running Progress'
							}, { unit: displayUnit(progressMessage?.numberDataElements || 1_000_000_000).unit})}
							max={numberDataElements || 1}
							data={[numberDataElements * (progressMessage?.writtenPartiallyCompressedSize / progressMessage?.partiallyCompressedSize)]}
							colors={[bp.Colors.INDIGO4]}
							categories={[i18nMessages.databaseSaved]}
							categoryPlace={'right'}
							categorySpace={categorySpace}
							tickAmount={5}
							tooltip={(point)=> i18n.intl.formatMessage({
								defaultMessage: '{size}MB',
								description: '[RSSimulation] Data size processed in Data Elements Chart in Simulation Running Progress'
							}, { size: point.y})}
						/>
					</div>
					{enableDownload && !rsSimulation.isFIRM && <div className={classNames(progressCss.summarySection, css.progress, css.fileBar)}>
						<HighchartsProgress
							className={css.barChart}
							axisTitle={i18n.intl.formatMessage({defaultMessage: 'Number Scenarios Processed', description: '[RSSimulation] Axis title for chart Number Scenarios Processed'})}
							max={progressMessage?.numberScenarios || 0}
							data={[progressMessage?.csvNumberScenariosProcessed || 0]}
							colors={[bp.Colors.TURQUOISE4]}
							categories={[i18nMessages.csvFiles]}
							categoryPlace={'right'}
							categorySpace={categorySpace}
							tickAmount={5}
							tooltip={(point)=> this.formatStringByNumber(point.y, i18nMessages.scenario, i18nMessages.scenarios)}
						/>
					</div>
					}
					<div className={classNames(progressCss.summarySection, css.additionalInfos)}>
						<div className={css.computationEnginesMonitor}>
							<SolidGaugeMonitor
								progressMessage={{
									type: "Progress",
									label: "",
									currentMessage: "",
									progress: {
										numerator: progressMessage?.computationProcessesReady,
										denominator: progressMessage?.computationProcessesTotal || 1
									}
								}}
								progressDescription={i18n.intl.formatMessage({defaultMessage: 'Computation{br}Engines', description: '[RSSimulation] Description for Computation Engines in simulation running progress'}, {br: '<br>'})}
								displayFormat={'{point.y:.0f}'}
								uncompletedColor={'#EEE'}
								noStepBoarder={true}
							/>
						</div>
						<div className={css.databasePartitionsMonitor}>
							<SolidGaugeMonitor
								progressMessage={{
									type: "Progress",
									label: "",
									currentMessage: "",
									progress: {
										numerator: progressMessage?.databaseProcessesReady,
										denominator: progressMessage?.databaseProcessesTotal || 1
									}
								}}
								progressDescription={i18n.intl.formatMessage({defaultMessage: 'Database{br}Partitions', description: '[RSSimulation] Description for Database partitions in simulation running progress'}, { br: '<br/>' })}
								displayFormat={'{point.y:.0f}'}
								uncompletedColor={'#EEE'}
								noStepBoarder={true}
							/>
						</div>
						<div className={css.firstScenarioAverageTimes}>
							<HighchartsPie
								title={<FormattedMessage defaultMessage="First Scenario{br}Average Times" description="[RSSimulation] Chart title for First Scenario Average Times" values={{br: <br/>}} />}
								data={this.firstScenarioAverageTimes}
								colors={[bp.Colors.LIME3, bp.Colors.VERMILION3]}
								categories={[i18nMessages.computed, i18nMessages.nonComputed]} 
								heightWidth={130}
								tooltip={(point) => `${point.key} - ${point.y.toFixed(1)}s`}
								className={css.pieChart}
							/>
						</div>
						<div className={css.subsequentScenarioAverageTimes}>
							<HighchartsPie
								title={<FormattedMessage defaultMessage="Subsequent Scenario{br}Average Times" description="[RSSimulation] Chart title for Subsequent Scenario Average Times" values={{br: <br/>}} />}
								data={this.subsequentScenarioAverageTimes}
								colors={[bp.Colors.LIME3, bp.Colors.VERMILION3]}
								categories={[i18nMessages.computed, i18nMessages.nonComputed]}
								heightWidth={130}
								tooltip={(point) => `${point.key} - ${point.y.toFixed(1)}s`}
								className={css.pieChart}
							/>
						</div>
						<div className={css.queryEstimatedTime}>
							<CountdownClock title={<FormattedMessage defaultMessage="Estimated Time to {br} Ready for Query" description="[RSSimulation] Message for Estimated Time to Ready for Query" values={{br: <br/>}} />} seconds={progressMessage?.estimatedTimeToQuery > 0 || rsSimulation.status == "Storing" ? progressMessage?.estimatedTimeToQuery : null}/>
						</div>
						<div className={css.databaseEstimatedTime}>
							<CountdownClock title={<FormattedMessage defaultMessage="Estimated Time to {br} Database Saved" description="[RSSimulation] Message for Estimated Time to Database Saved" values={{br: <br/>}} />} seconds={progressMessage.writtenPartiallyCompressedSize > 0 ? progressMessage?.estimatedTimeToSaved : null}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

