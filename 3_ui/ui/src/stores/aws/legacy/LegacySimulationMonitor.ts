import {ICloudWatchStreamEvent} from '../CloudWatchStore';

export type LegacyMonitorTarget = 'compiler' | 'parser' | 'intertasker' | string;

const STRIP_REDUNDENT = false;

interface ILegacyCloudWatchEvent extends ICloudWatchStreamEvent {
	message?: {
		target?: LegacyMonitorTarget;
		json?: any;
		job_id?: string;
		extra?: any;
		binary?: string;
	}
}

export type SimulationStep = 'parse' | 'compile' | 'simulate' | 'finalize' | 'overall';

export interface IParsedLegacyCloudWatchSimulationLogEvent {
	step: SimulationStep;
}

export class LegacySimulationMonitor {
	static parseLegacyEvent(legacyEvent: ILegacyCloudWatchEvent) : IParsedLegacyCloudWatchSimulationLogEvent {
		const {message} = legacyEvent;
		if (!message || !message.target) {
			throw new Error("Legacy CloudWatch Log Messages are expected to contain a field 'message' containing a JSON document with 'target'")
		}

		const {target} = message;

		delete message.binary;

		if (STRIP_REDUNDENT) {
			delete message.json.ID;
			delete message.json.DFS;
			//delete message.job_id;
			delete message.json.job_id;
			delete message.extra['job_id'];
		}

		const targetToStep = (target: string) => {
			switch (target) {
				case 'alert_1':
					return 'overall';

				case 'alert_compiler1':
				case 'compiler':
					return 'compile';

				case 'tasker':
				case 'intertasker':
				case 'posttasker':
					return 'simulate';

				case 'alert_finalize':
				case 'finalize':
					return 'finalize';

				case 'parser':
					return 'parse';
			}
		}

		const step = targetToStep(target);
		if (step == null) {
			console.error(`Unable to map ${target} to step`, legacyEvent);
		}


		switch (target) {
			case 'tasker':
			case 'compiler':
			case 'intertasker':
			case 'posttasker':
			case 'finalize':
			case 'parser': {
				return new LegacyProcessLogMessage(step, legacyEvent)
			}

			case 'alert':
			case 'alert_compiler1':
			case 'alert_finalize':
			case 'alert_1': {
				return new LegacyAlertLogMessage(step, legacyEvent)
			}

			default: {
				console.warn(`Unknown target for legacy simulation monitor event:  ${target}`, legacyEvent);
			}
		}
	}
}

/*
	parser job_id, dfs, start / end      x/monitor.k
	compiler id, dfs, start / end        x/monitor.k

 */
export class LegacyProcessLogMessage implements IParsedLegacyCloudWatchSimulationLogEvent {
	constructor(public step: SimulationStep, event: ILegacyCloudWatchEvent) {
		/*{
					  "target": "parser",
					  "json": [
					    "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46",
					    "\\\\ip-172-31-2-245.ec2.internal\\sims\\\\test\\GEMS_20180227_2.dfs",
					    0
					  ],
					  "binary": "AQAAAMAAAAAAAAAAAgAAAAQAAABwYXJzZXIAAAAAAAAAAAAAAwAAAAQAAABTaW11bGF0aW9uX3Myc2Fqc19oYXc3bDA2MDVfaW50ZXJuYWxfY25uZ2FkX2NvbV80MDAwN18yMDE4XzAyXzI3XzEwXzA1XzQ2AAAA/f///z0AAABcXGlwLTE3Mi0zMS0yLTI0NS5lYzIuaW50ZXJuYWxcc2ltc1xcdGVzdFxHRU1TXzIwMTgwMjI3XzIuZGZzAAAAAQAAAAAAAAA=",
					  "job_id": "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46",
					  "extra": {
					    "job_id": "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46"
					  }
				}*/

		const {target, json, job_id, extra} = event.message;

		if (_.isArray(json)) {
			if (json.length >= 3) {
				//this.jobId = json[0] as string;
				this.path  = json[1] as string;
				this.n     = json[2] as number;
			}

			if (json.length >= 4) {
				// Todo what is the 4th number in post tasker?
				//console.warn(`Unhandled bonus data:`, json)
			}

		}
		else {
			debugger;
		}

		//console.log(`[${target}] - ${this.jobId} | ${this.path} | ${this.n}`);
	}

	//jobId: string;
	path: string;
	n: number;
}

const logLevels = { 0: 'Info', 1: 'Warning', 2: 'Error'}

export class LegacyAlertLogMessage implements IParsedLegacyCloudWatchSimulationLogEvent {
	/* From K Docs:
	/  i: id
	/  s: sim
	/  p: process
	/  b: block
	/  t: time
	/  e: not used
	/  m: (level;message)
	/  n: _s[0 1 3] (memory used, allocated, mapped)*/

	event: ILegacyCloudWatchEvent;
	//id?: string;
	//dfs?: string;
	process?: string;
	block?: number;
	time?: number;
	e_ignored?: null;
	logLevel?: number;
	logMessage?: string;
	memUsed?: number;
	memAllocated?: number;
	memMapped?: number;

	currentTime?: number;
	host?: string;

	constructor(public step: SimulationStep, event: ILegacyCloudWatchEvent) {
		/*{
				  "target": "alert_1",
				  "json": {
					"ID": "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46",
					"DFS": "\\\\ip-172-31-2-245.ec2.internal\\sims\\\\test\\GEMS_20180227_2.dfs",
					"p": "Parser",
					"b": null,
					"t": null,
					"s": 0,
					"m": [
					  0,
					  "Started"
					],
					"n": [
					  10815536,
					  15851760,
					  0,
					  -6151.370636066574,
					  "ip-172-31-2-245.ec2.internal"
					]
				  },
				  "binary": "AQAAADACAAAAAAAAAgAAAAQAAABhbGVydF8xAG1FbmcFAAAACAAAAAAAAAADAAAABAAAAElEAAAEAAAAU2ltdWxhdGlvbl9zMnNhanNfaGF3N2wwNjA1X2ludGVybmFsX2NubmdhZF9jb21fNDAwMDdfMjAxOF8wMl8yN18xMF8wNV80NgBoYQYAAAAAAAAAAAAAAAMAAAAEAAAAREZTAP3///89AAAAXFxpcC0xNzItMzEtMi0yNDUuZWMyLmludGVybmFsXHNpbXNcXHRlc3RcR0VNU18yMDE4MDIyN18yLmRmcwA3MgYAAAAAAAAAAAAAAAMAAAAEAAAAcAAAAAQAAABQYXJzZXIARU1TXzIGAAAAAAAAAAAAAAADAAAABAAAAGIAAAABAAAAAAAAgAYAAAAAAAAAAAAAAAMAAAAEAAAAdAAAAAEAAAAAAACABgAAAAAAAAAAAAAAAwAAAAQAAABzAAAAAQAAAAAAAAAGAAAAAAAAAAAAAAADAAAABAAAAG0AAAAAAAAAAgAAAAEAAAAAAAAABAAAAFN0YXJ0ZWQAAAAAAAYAAAAAAAAAAAAAAAMAAAAEAAAAbgAAAAAAAAAFAAAAAgAAAAEAAAAAAAAABqFkQQIAAAABAAAAAAAAAB48bkECAAAAAQAAAAAAAAAAAAAAAgAAAAEAAACnWAHiXge4wAQAAABpcC0xNzItMzEtMi0yNDUuZWMyLmludGVybmFsAAAAAAAAAAAGAAAAAAAAAA==",
				  "job_id": "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46",
				  "extra": {
					"job_id": "Simulation_s2sajs_haw7l0605_internal_cnngad_com_40007_2018_02_27_10_05_46"
				  }
				}
				*/

		this.event = event;

		const {target, json, extra} = event.message;
		let {
			      p: process, b: block, t: time, e: e_ignored,
			      m:   [level, message],
			      n, n:   [memUsed, memAllocated, memMapped]
		      } = json;

		// Always the same as the originating process - ignore and remove from caller
		//this.id = id;
		//this.dfs = dfs;

		this.process = process;
		if (process == 'Parser') {
			this.step = 'parse';
		}

		this.block = block;
		this.time = time;
		this.e_ignored = e_ignored;
		this.logLevel = logLevels[level];
		if (_.isArray(message)) {
			var strings = message as string[];

			var parsed = strings[0];
			for (var i = 1; i < strings.length; i++) {
				var match = new RegExp(`\\&${i - 1}`);
				parsed = parsed.replace(match, strings[i]);
			}

			message = parsed;
		}

		this.logMessage = message;
		this.memUsed = memUsed;
		this.memAllocated = memAllocated;
		this.memMapped = memMapped;

		if (n.length >= 4) {
			this.currentTime = n[3];
		}

		if (n.length >= 5) {
			this.host = n[4];
		}


		//console.log(`[alert - ${target}] - ${this.id} | ${this.dfs} | ${this.process} | ${this.block} | ${this.initialTime} | ${this.logLevel} | ${this.logMessage} | ${this.memUsed}`);
	}
}
