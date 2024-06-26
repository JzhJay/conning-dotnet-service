import { action, autorun, computed, observable, runInAction, makeObservable } from 'mobx';
import {CloudWatchStreamEvent, settings, mobx} from 'stores'
import {CloudWatchGroupTreeNode, CloudWatchStreamNode} from './CloudWatchTree';
import {LegacyAlertLogMessage, LegacyProcessLogMessage, SimulationStep} from '../../../stores/aws/legacy/LegacySimulationMonitor';
import {sem} from 'components'
import type {SimulationGuid} from '../../../stores/simulation';
import {CloudWatchGroup, CloudWatchStream} from '../../../stores/aws';

export class ISimulationEventType {
	type?: 'parser' | 'compiler' | 'tasker' | 'finalizer' | string;
}

export interface ISimulationStepDescriptor {
	step: SimulationStep;
	icon: sem.SemanticICONS;
	title: string;
}

export const simulationSteps: { [step: string]: ISimulationStepDescriptor } = {
	parse:    {step: 'parse', icon: 'filter', title: 'Parse'},
	compile:  {step: 'compile', icon: 'code', title: 'Compile'},
	simulate: {step: 'simulate', icon: 'lightning', title: 'Simulate'},
	finalize: {step: 'finalize', icon: 'wizard', title: 'Finalize'},
};

export interface ISimulationLogStartDescriptor {
	simulationId?: SimulationGuid;
	jobId?: string;
	minTime: number;
	maxTime: number;
	blocks: number;
	dfs: string;
	steps: Array<'parse' | 'compile' | 'simulate' | 'finalize'>;
}

export interface IStorageBlock {
	block?: number;
	progress?: { min?: number, max?: number };
}

export class CloudWatchPageContext {
	constructor() {
        makeObservable(this);
        this._toDispose.push(
			autorun(() => {
				const {streamInstance, groupInstance} = this;
				runInAction(() => {
					this.eventsIndex = null;
				})
			}));

        this._toDispose.push(
			autorun(() => {
					const {descriptor: sim, eventsParsed} = this;

					if (sim.blocks != null && eventsParsed) {
						const {overall} = eventsParsed;

						// runInAction: Update Storage Blocks rollup
						runInAction(() => {
							const {storageBlocks} = this;
							storageBlocks.clear();

							for (var lm of overall.logMessages) {
								if (lm.legacyEvent instanceof LegacyAlertLogMessage) {
									const {block, time, logLevel, logMessage} = lm.legacyEvent;

									const blockKey = block.toString();

									if (!storageBlocks.has(blockKey)) {
										storageBlocks.set(blockKey, {
											block:    block,
											progress: {min: 0, max: 0}
										});
									}

									var entry = storageBlocks.get(blockKey);

									const {progress} = entry;

									var percent = (time - sim.minTime) / (sim.maxTime - sim.minTime) * 100;

									progress.min = Math.max(progress.min, Math.max(0, percent == 100 ? 100 : percent - 10)); // Subtract 10% for demo purposes.
									progress.max = Math.max(progress.max, percent);
								}
							}

//							console.log(this.storageBlocks.values())
						});
					}
				}
			));
    }

	@computed get storageBlocksSorted(): Array<IStorageBlock> {
		return _.orderBy(mobx.values(this.storageBlocks), b => b.block);
	}

	_toDispose = [];
	dispose    = () => {
		this._toDispose.forEach(f => f())
	}

	/* SHOULD be the first element in the log but faking until implemented on back end */
	@computed get descriptor(): ISimulationLogStartDescriptor {
		const {eventsRaw, jobId, dfs} = this;

		var minTime = null, maxTime = null, blocks = null;
		var map     = new Map();

		eventsRaw && eventsRaw.forEach(e => {
			if (e.legacyEvent instanceof LegacyAlertLogMessage) {
				var {time, block} = e.legacyEvent;

				minTime = minTime == null ? time : Math.min(minTime, time);
				maxTime = maxTime == null ? time : Math.max(maxTime, time);
				map.set(block, true);
			}
		})

		return {
			simulationId: null,
			jobId,
			minTime,
			maxTime,
			blocks:       map.size,
			dfs,
			steps:        ['parse', 'compile', 'simulate', 'finalize']
		}
	}

	@observable storageBlocks         = observable.map<string, IStorageBlock>();
	@observable searchText            = ''
	@observable group ?: string       = '';
	@observable stream ?: string      = '';
	@observable view: 'table' | 'raw' = 'table'

	@observable groupInstance?: CloudWatchGroup;
	@observable streamInstance?: CloudWatchStream;

	@observable selectedEventTypes = observable.map<string, boolean>([]);

	simulationEventTypes = [
		{type: 'parser'},
		{type: 'compiler'},
		{type: 'tasker'},
		{type: 'finalizer'}
	]

	@computed get settings() {
		return settings.pages.cloudWatchDemo;
	}

	@observable selectedSteps = observable.map<string, boolean>();

	@action step_onClick = (step: SimulationStep) => {
		const {selectedSteps} = this;

		if (selectedSteps.has(step)) {
			selectedSteps.delete(step);
		}
		else {
			selectedSteps.set(step, true);
		}
	}

	@observable eventsIndex = null;

	@computed get eventsRaw(): Array<CloudWatchStreamEvent> {
		const {streamInstance, eventsIndex} = this;
		return streamInstance ? streamInstance.events : null;
	}

	@computed get events(): Array<CloudWatchStreamEvent> {
		const {eventsRaw, eventsIndex} = this;
		if (eventsRaw) {
			if (this.eventsIndex == null) {
				return eventsRaw;
			}
			else {
				return _.take(eventsRaw, eventsIndex + 1);
			}
		}
		return null;
	}

	@computed get jobId() {
		const {eventsRaw} = this;
		if (!eventsRaw || eventsRaw.length == 0 || !eventsRaw[0].legacyEvent) return null;

		return eventsRaw[0].message.job_id;

	}

	@computed get dfs() {
		const {eventsRaw} = this;
		if (!eventsRaw || eventsRaw.length == 0 || !eventsRaw[0].legacyEvent) return null;

		let processMessage = eventsRaw.find(e => e.legacyEvent && e.legacyEvent instanceof LegacyProcessLogMessage);
		return processMessage ? (processMessage.legacyEvent as LegacyProcessLogMessage).path : null;
	}

	@computed get percentComplete() {
		const {eventsParsed} = this;
		if (!eventsParsed) { return 0; }

		const {parse, compile, simulate, finalize} = eventsParsed;

		let result = 0;

		if (parse)
			result += Math.trunc(25 * (
				Math.min(1, parse.percent == null ? 0 : parse.percent != 0 ? parse.percent : parse.logMessages.length > 0 ? .1 : 0)
				+ Math.min(1, compile.percent == null ? 0 : compile.percent != 0 ? compile.percent : compile.logMessages.length > 0 ? .1 : 0)
				+ Math.min(1, simulate.percent == null ? 0 : simulate.percent != 0 ? simulate.percent : simulate.logMessages.length > 0 ? .1 : 0)
				+ Math.min(1, finalize.percent == null ? 0 : finalize.percent != 0 ? finalize.percent : finalize.logMessages.length > 0 ? .1 : 0)));

		return result;
	}

	@observable isPlaying      = false;
	            playbackInterval;
	            replayInterval = 300;

	debug_stop = () => {
		this.isPlaying = false;
		if (this.playbackInterval != null) {
			clearInterval(this.playbackInterval);
			this.playbackInterval = null;
		}
	}

	debug_play = () => {
		this.isPlaying = !this.isPlaying;

		const {isPlaying, replayInterval} = this;

		if (!isPlaying) {
			this.debug_stop();
		}
		else if (this.playbackInterval == null) {
			this.playbackInterval = setInterval(this.debug_stepForward, replayInterval)
		}
	}

	debug_stepBackward = () => {
		this.debug_stop();

		const {eventsIndex, eventsRaw} = this;
		this.eventsIndex               = Math.max(0, eventsIndex == null ? eventsRaw.length - 2 : eventsIndex - 1)

		this.debug_logCurrentEvent();
	}

	debug_stepForward = () => {
		if (this.eventsIndex + 1 == this.eventsRaw.length) {
			this.debug_stop();
		}
		else {
			this.eventsIndex++;
			this.debug_logCurrentEvent();
		}
	}

	@computed get sortedAndFiltered(): Array<CloudWatchStreamEvent> {
		return _.orderBy(this.filtered, i => new Date(i.timestamp));
	}

	@computed get filtered(): Array<CloudWatchStreamEvent> {
		const {selectedSteps, eventsParsed, settings: {hideNonLogEvents}} = this;

		let result = [];

		for (var key of _.keys(eventsParsed)) {
			if (selectedSteps.size == 0 || selectedSteps.has(key)) {
				result.push(...eventsParsed[key].logMessages)
			}
		}

		if (_.isEmpty(result)) {
			result.push(...eventsParsed.overall.logMessages)
		}

		if (hideNonLogEvents) {
			result = result.filter(e => e.legacyEvent instanceof LegacyAlertLogMessage);
		}

		return result;
	}

	@computed get eventsParsed(): { [key: string]: { percent: number, logMessages: Array<CloudWatchStreamEvent> } } {
		const {events} = this;
		if (events) {
			let result = {
				overall:  {percent: null, logMessages: []},
				parse:    {percent: null, logMessages: []},
				compile:  {percent: null, logMessages: []},
				simulate: {percent: null, logMessages: []},
				finalize: {percent: null, logMessages: []},
			};

			for (var e of events.filter(e => e.legacyEvent)) {
				const {legacyEvent, legacyEvent: {step}, message: {target}} = e;

				const entry = result[step];
				if (!entry) {
					debugger;
				}

				if (legacyEvent instanceof LegacyProcessLogMessage) {
					entry.percent = legacyEvent.n;
					entry.logMessages.push(e);
				}
				else if (legacyEvent instanceof LegacyAlertLogMessage) {
					entry.logMessages.push(e);
				}
			}

			if (result.finalize.percent != null || result.simulate.percent != null) {
				if (result.parse.percent == null) {
					result.parse.percent = 1;
				}
				if (result.compile.percent == null) {
					result.compile.percent = 1;
				}
			}
			//console.table(result);
			return result;
		}

		return null;
	}

	private debug_logCurrentEvent = () => {
		const {eventsRaw, eventsIndex} = this;
		//console.table(this.eventsRaw[eventsIndex].message);
	}
}
