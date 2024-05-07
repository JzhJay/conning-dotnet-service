import {julia, site, xhr} from '../index';
import { action, computed, observable, runInAction, makeObservable } from 'mobx';
import {IParsedLegacyCloudWatchSimulationLogEvent, LegacySimulationMonitor} from './legacy/LegacySimulationMonitor';

export interface ICloudWatchGroup {
	logGroupName: string;
	arn:string;
	creationTime: Date;
	storedBytes: number;
	metricFilterCount: number;
	links?: {
		streams?: string;
	}
}

export class CloudWatchGroup implements ICloudWatchGroup {
	logGroupName: string;
	arn: string;
	creationTime: Date;
	storedBytes: number;
	metricFilterCount: number;
	links?: {
		streams?: string;
	}

	constructor(group : ICloudWatchGroup) {
        makeObservable(this);
        Object.assign(this, group);
    }

	@observable nextStreamsToken = null;

	@action loadInitialStreams = async () => {
		const {logGroupName: group} = this;

		try {
			this.loadingStreams = true;
			var response        = await cloudwatch.loadStreams(group);

			this.streams.replace(response.streams.map(s => new CloudWatchStream(s)));
			this.nextStreamsToken = response.nextToken;
			this.hasLoadedStreams = true;
		}
		finally {
			this.loadingStreams = false;
		}
		return this.streams;
	}

	@action loadMoreStreams = async () => {
		const {logGroupName: group, nextStreamsToken} = this;

		if (nextStreamsToken) {
			try {
				this.loadingStreams = true;
				var response        = await cloudwatch.loadStreams(group, nextStreamsToken);

				var newStreams = response.streams.map(s => new CloudWatchStream(s))
				this.streams.push(...newStreams);
				this.nextStreamsToken = response.nextToken;
				return newStreams;
			}
			finally {
				this.loadingStreams = false;
			}
		}
	}

	@observable loadingStreams = false;
	@observable streams = observable.array<CloudWatchStream>();
	@observable hasLoadedStreams: boolean;

}

export interface ICloudWatchStream {
	group?: string;
	arn?: string;
	creationTime?: Date;
	firstEventTimestamp?: Date;
	lastEventTimestamp?: Date;
	logStreamName?: string;
	storedBytes?: number;
	uploadSequenceToken?: string;

	links?: {
		events?: string;
	}
}

export class CloudWatchStream implements ICloudWatchStream {
	group: string;
	arn: string;
	creationTime: Date;
	firstEventTimestamp: Date;
	lastEventTimestamp: Date;
	logStreamName: string;
	storedBytes: number;
	uploadSequenceToken: string;

	links: {
		events: string;
	}

	constructor(stream: ICloudWatchStream) {
        makeObservable(this);
        Object.assign(this, stream);
    }

	@observable events = observable.array<CloudWatchStreamEvent>()
	@observable hasLoadedEvents = false;

	@action loadEvents = async () => {
		const {group, logStreamName} = this;

		this.events.replace(await cloudwatch.loadEvents(group, logStreamName));
		this.hasLoadedEvents = true;
	}
}

export interface LoadCloudWatchStreamResponse {
	nextToken?: string;
	streams?: ICloudWatchStream[];
}

export interface ICloudWatchStreamEvent {
	ingestionTime?: Date;
	message?: string | any; // JSON Data generally - will be parsed in concrete class
	timestamp?: string;
}

export interface ICloudWatchEvent_ {
	target: string;
	json: string;  // More json to parse.
}

export interface ICloudWatchEvent__ {
}

export class CloudWatchStreamEvent {
	constructor(public group: string, public stream: string, event: ICloudWatchStreamEvent) {
		this.ingestionTime = event.ingestionTime;
		this.timestamp = event.timestamp;
		try {
			var json = JSON.parse(event.message);

			// Replace the string with the json
			event.message = json;

			// Convert the K call into something we understand
			// At this time (3/2/18) the data being sent corresponds to calls in common/grid/manager/monitor.k
			if (stream.startsWith('job/Simulation_')) {
				this.legacyEvent = LegacySimulationMonitor.parseLegacyEvent(event);
			}

			this.message = json;
		}
		catch (err) {
			console.error(err);
			this.message = event.message;
		}
	}

	legacyEvent?: IParsedLegacyCloudWatchSimulationLogEvent;
	ingestionTime?: Date;
	message?: any; // JSON Data generally - will be parsed in concrete class
	timestamp?: string;
}

export class CloudWatchStore {
    @observable groups = observable.map<string, CloudWatchGroup>();
    @observable hasLoadedGroups = false;

    constructor() {
        makeObservable(this);
    }

    @computed get apiRoute() {
		let protocol = julia.https ? "https" : "http";
		return `${protocol}://${julia.hostname}/api/cloudwatch`;
	}

    @action loadGroups = async () => {
		const {apiRoute} = this;
		try {
			let response = await xhr.get<ICloudWatchGroup[]>(`${apiRoute}/groups`);
			// runInAction: Replace list of cloudwatch groups
			runInAction(() => {
				const {groups} = this;

				groups.clear();
				response.forEach(g => {
					groups.set(g.logGroupName, new CloudWatchGroup(g));
				})
			});
		}
		catch (err) {
			site.raiseError(err);
			throw err;
		}
		finally {
			this.hasLoadedGroups = true;
		}
	}

    @action loadStreams = async (group : string, nextToken?: string) : Promise<LoadCloudWatchStreamResponse> => {
		const {apiRoute} = this;
		try {
			 return await xhr.get<LoadCloudWatchStreamResponse>(`${apiRoute}/streams?group=${encodeURI(group)}${nextToken ? `&token=${nextToken}` : ''}`);
		}
		catch (err) {
			site.raiseError(err);
			throw err;
		}
	}

    @action loadEvents = async (group: string, stream: string) : Promise<CloudWatchStreamEvent[]>=> {
		const {apiRoute} = this;
		try {
			let rawEvents = await xhr.get<ICloudWatchStreamEvent[]>(`${apiRoute}/events?group=${encodeURI(group)}&stream=${encodeURI(stream)}`);
			return rawEvents.map(e => new CloudWatchStreamEvent(group, stream, e));
		}
		catch (err) {
			site.raiseError(err);
			throw err;
		}
	}
}

export const cloudwatch = new CloudWatchStore();