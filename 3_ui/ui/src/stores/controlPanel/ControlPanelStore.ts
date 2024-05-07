import {Intent} from '@blueprintjs/core';
import { action, observable, makeObservable } from 'mobx';
import {julia} from '../julia';
import {site} from '../site';
import {xhr} from '../xhr';

interface GridJob {
	id: string;
	jobType: string;
	user: string;
	version: string;
	started: string;
	status: string;
}

interface Workers {
	apps: {
		inUse: Process[]
	}
}

interface Process {
	name: string;
	guid: string;
	checkin: string;
	workers: number[];
	timeoutMins: number;
}

export class ControlPanelStore {
	constructor() {
        makeObservable(this);
    }

	@observable processes: Process[] = [];
	@observable gridJobs: GridJob[] = [];
	@observable grids: string[] = [];
	@observable selectedGrid: string = null;

	@action async loadProcesses() {
		try {
			site.busy = true;
			this.processes = (await xhr.get<Workers>(`${julia.url}/v1/workers`)).apps.inUse;
		}
		finally {
			site.busy = false;
		}
	}

	@action async loadGridJobs() {
		if (this.selectedGrid == null)
			return;

		try {
			site.busy = true;
			const jobsPath = `${julia.url}/v1/grids/${this.selectedGrid}/jobs`;
			const jobIDs = await xhr.get<string[]>(jobsPath);

			this.gridJobs = (await Promise.all(jobIDs.map(async jobID => {
				const jobPath = `${jobsPath}/${jobID}`;

				return {
					id: jobID,
					jobType: await xhr.get<string>(`${jobPath}/jobstype`),
					user : await xhr.get<string>(`${jobPath}/user`),
					version: await xhr.get<string>(`${jobPath}/version`),
					started: await xhr.get<string>(`${jobPath}/time/started`),
					status: await xhr.get<string>(`${jobPath}/status`)
				}}) as Array<Promise<GridJob>>));

		}
		catch(e) {
			site.toaster.show({message: "Error: " + e.message + ". Grid may be offline. Please retry refresh in a few minutes.", intent: Intent.DANGER})
		}
		finally {
			site.busy = false;
		}
	}

	async cancelJob(jobID: string) {
		const statusPath = `${julia.url}/v1/grids/${this.selectedGrid}/jobs/${jobID}/status`;
		await xhr.put<any>(`${statusPath}?value=cancel`, null);
		this.gridJobs.filter(job => job.id == jobID)[0].status = await xhr.get<any>(statusPath);
	}

	@action async loadGrids() {
		try {
			site.busy = true;
			this.grids = (await xhr.get<any>(`${julia.url}/v1/grids`));

			if (this.selectedGrid == null) {
				this.selectedGrid = this.grids.indexOf("default") > -1 ? "default" : this.grids[0];
				this.loadGridJobs();
			}
		}
		finally {
			site.busy = false;
		}
	}

	@action async delete(name:string, id:string) {
		try {
			site.busy = true;
			await xhr.delete(`${julia.url}/v1/workers/apps/${name}/${id}`);
			await this.loadProcesses();
		}
		finally {
			site.busy = false;
		}
	}
}

export const controlPanelStore = new ControlPanelStore();
