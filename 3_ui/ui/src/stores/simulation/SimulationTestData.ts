import {Simulation} from './Simulation';
import { simulationStore } from "./SimulationStore";
import { computed, makeObservable } from "mobx";
import * as mobx from 'mobx'

export class SimulationTestData {
    testSimulations = [
		{name: '387_variable_test', path: 's3://conning-karma-test-data/5b3538484108f11c95b06f95'},
		{name: 'Multisim_test', path: 's3://conning-karma-test-data/aa02b812-5ce2-4208-bff0-5e824684dac7'},
		// {name: 'Karma - 4 economy, 1000 scenarios, 21 time periods', path: 's3://conning-simulation-data/9D99C744'}
	]

    constructor() {
        makeObservable(this);
    }

    @computed get simulations() {
		return this.testSimulations.map(s => simulationStore.simulationByName[s.name]);
	}

    deleteTestSimulations = async() => {
		const sims = await simulationStore.loadDescriptors();

		for (const sim of sims.filter(s => s.name.startsWith(`Karma Test - `))) {
			console.log(`Deleting simulation '${sim.name}' - ${sim.id}`)
			await Simulation.delete(sim, true);
		}
	}

    registerTestSimulations = async() => {
		await simulationStore.loadDescriptors();
		for (var testData of this.testSimulations) {
			// Use simulation if it has already been imported
			const existingSim = mobx.values(simulationStore.simulations).find(s => s.path == testData.path || s.name == testData.name);
			if (existingSim) {
				testData.name = existingSim.name;
			}
			else {
				await simulationStore.importSimulation(testData);
			}
		}

		// for (var i = 0; i < this.testSimulations.length; i++) {
		// 	console.trace(this.testSimulations[i].name, this.simulations[i])
		// }
	}
}

export const simulationTestData = new SimulationTestData();
