import {JuliaSimulation} from './models';
import {Simulation} from './Simulation';
import {julia} from 'stores/julia';
import {xhr} from 'stores/xhr';
import {routing, omdb} from 'stores';
import {observable, action, computed, runInAction, makeObservable, values} from 'mobx';
import type {SimulationGuid} from './';
import type {IOmdbQueryResult} from '../objectMetadata';

export class SimulationStore {
	constructor() {
        makeObservable(this);
    }

	get browserUrl() { return routing.urls.simulationBrowser }

	navigateToBrowser = () => routing.push(this.browserUrl)

	@observable simulations          = observable.map<string, Simulation>({}, {deep: false});
	@observable loadError            = false;
	@observable hasLoadedDescriptors = false;
	@observable loading              = false;

	@computed get simulationByName() {
		return _.keyBy(values(this.simulations), s => s.name);
	}

	get apiRoute() {
		return `${julia.url}/v1/simulations`;
	}

	get juliaRoute() {
		return `${julia.url}/v1/simulations`;
	}

	get clientRoute() {
		return routing.urls.simulationBrowser;
	}

	@action reset = () => {
		this.simulations.clear();
		this.hasLoadedDescriptors = false;
	}

	@observable.ref allSimsQueryResult: IOmdbQueryResult;

	@action loadDescriptors = async (): Promise<Simulation[]> => {
		//store.simulations.db.migrateSimulationsFromDynamo();

		const {apiRoute} = this;

		this.reset();
		this.loadError = false;

		try {
			this.loading            = true;
			var qr                  = await omdb.runQuery({objectTypes: ['Simulation'], where:{}});
			var sims                = qr.result.results;
			this.allSimsQueryResult = qr.result;

			// runInAction: Simulation Descriptors were Loaded
			return runInAction(() => {
				const simulations = sims.map(s => new Simulation(s));

				this.hasLoadedDescriptors = true;

				simulations.forEach(s => this.simulations.set(s.id, s));

				return simulations;
			})
		}
		catch (error) {
			this.loadError = true;
			throw error;
		}
		finally {
			this.loading = false;
		}
	}

	@action loadDescriptor = async (id: SimulationGuid): Promise<Simulation> => {
		var juliaSim: JuliaSimulation;
		juliaSim = await omdb.findSingle<JuliaSimulation>('Simulation', id, true);

		if (!juliaSim) {
			throw new SimulationNotFound(`Unable to locate simulation with id: '${id}'`);
		}

		// Note that the constructor will save to store if needed or merge with existing.
		new Simulation(juliaSim);

		return this.simulations.get(id);
	}

	@action bulkLoadDescriptors = async (simIds: SimulationGuid[]): Promise<Simulation[]> => {
		this.loadError = false;

		const missingSims = simIds.filter(s => !this.simulations.has(s));
		if (missingSims.length > 0) {
			const qr   = await omdb.runQuery({objectTypes: ['Simulation'], where: {_id: missingSims}});
			const sims = qr.result.results;

			// runInAction: Simulation Descriptors were Loaded
			return runInAction(() => {
				const simulations = sims.map(s => new Simulation(s));
				simulations.forEach(s => this.simulations.set(s.id, s));
				return simulations;
			})
		}
	}

	@computed get simulationOptions() {
		return values(this.simulations).map(sim => ({label: sim.name, value: sim.id}));
	}

	@action importSimulation = (options: { path: string, name: string }): Promise<Simulation> => {
		// Does the simulation already exist in our loaded descriptors?

		const {name} = options;

		if (this.simulationByName[name]) {
			throw new Error(this.errors.simulationWithNameAlreadyExists(name))
		}

		return xhr.post<SimulationGuid>(this.juliaRoute, options).then(id => {
			return this.loadDescriptor(id);
		});
	}

	@action deleteAll = () => {
		this.simulations.forEach(sim => {
			console.warn(`Deleting simulation '${sim.id}'`)
			Simulation.delete(sim);
		})
	}

	@action rename = async (id: SimulationGuid, name: string) => {
		const resp = await xhr.post<JuliaSimulation>(`${Simulation.apiUrlFor(id)}/rename`, {name: name});
		delete resp['id']; // omdb temp bridging (todo)
		let desc = this.simulations.get(id);
		Object.assign(desc, resp);
	}

	errors = {
		simulationWithNameAlreadyExists: function (name: string) {
			return `A simulation with the name '${name}' already exists.`;
		}
	}

	@computed get isActivePage() { return routing.isActive(routing.urls.simulationBrowser)}

}

export class SimulationNotFound extends Error {
	constructor(message) {
		super(message);
		this.name = "SimulationNotFound";
	}
}

export const simulationStore = new SimulationStore();

