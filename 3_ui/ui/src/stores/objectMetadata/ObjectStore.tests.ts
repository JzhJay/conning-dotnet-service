import {ClimateRiskAnalysis, climateRiskAnalysisStore, rsSimulationStore, julia, queryStore, repositoryStore, Simulation, simulationStore, simulationTestData, xhr} from 'stores';
import {expect, ITestable, sleep, testScheduler} from 'test';
import {reactionToPromise} from 'utility';

class ObjectStoreTests implements ITestable {
	describeTests = () => {

		const randomCode = `${Math.round(Math.random() * 100000)}`;

		const objectActions: {[type: string] : {
				create: () => Promise<string>,
				load: (runSession: boolean, objectId: string) => Promise<any>,
				delete?: (obj: any) => Promise<void>,
		}} = {
			Simulation: {
				create: () => {
					return repositoryStore.createNewRespository(null, `Simulation${randomCode}`, null, false );
				},
				load: async (runSession, id ) => {
					let sim = await simulationStore.loadDescriptor(id);

					if (runSession && sim) {
						await sim.repository.loadExistingRepository();
						console.log(`${sim._id} - start up`);
						!sim.repository.isLoaded && await reactionToPromise( () => sim.repository.isLoaded, true);
						console.log(`${sim._id} - loaded`);
						sim.repository.eventSource?.dispose();
					}
					return sim;
				},
				delete: async (sim: Simulation) => {
					await Simulation.delete(sim);
				}
			},
			Query: {
				create: async () => {
					await simulationTestData.registerTestSimulations();
					return await queryStore.createQuerySessionDescriptor(`query${randomCode}`, [simulationTestData.simulations[0].id]);
				},
				load: async (runSession , id) => {
					const query = await queryStore.getQuery(id).catch((e) => {
						if (!(e.message == "Not Found" || e.message == "Internal Server Error")) {
							throw e;
						}
						return null;
					});

					if (runSession && query) {
						await query.initializeQuerySession();
						console.log(`${query._id} - start up`);
						query.isLoading && await reactionToPromise( () => query.isLoading, false);
						console.log(`${query._id} - loaded`);
						query.eventSource?.dispose();
					}
					return query;

				},
				delete: async (query) => {
					await query.delete(true);
				}
			},
			ClimateRiskAnalysis: {
				create: () => {
					return climateRiskAnalysisStore.createNewClimateRiskAnalysis();
				},
				load: async (runSession , id) => {
					const craDesc = await climateRiskAnalysisStore.loadDescriptor(id).catch((e) => {
						if (!(e.message == "Not Found" || e.message == "Internal Server Error")) {
							throw e;
						}
						return null;
					});
					if (runSession && craDesc) {
						await craDesc?.loadExistingClimateRiskAnalysis();
						console.log(`${craDesc._id} - start up`);
						!craDesc.isLoaded && await reactionToPromise( () => craDesc.isLoaded, true);
						console.log(`${craDesc._id} - loaded`);
						craDesc.eventSource?.dispose();
					}
					return craDesc

				},
				delete: async (craDesc) => {
					await ClimateRiskAnalysis.delete(craDesc);
				}
			},
			RSSimulation: {
				create: () => {
					return rsSimulationStore.createNewObject("GEMS", `RSSimulation${randomCode}`);
				},
				load: async (runSession, id) => {
					let sim = await simulationStore.loadDescriptor(id);
					if (runSession && sim) {
						await sim.rsSimulation.loadExistingRSSimulation();
						console.log(`${sim._id} - start up`);
						!sim.rsSimulation.isLoaded && await reactionToPromise( () => sim.rsSimulation.isLoaded, true);
						console.log(`${sim._id} - RSSimulation loaded`);
						sim.rsSimulation.eventSource?.dispose();
					}
					return sim;
				},
				delete: async (sim: Simulation) => {
					await Simulation.delete(sim);
				}
			}

		}

		const removeWorkers = async () => {
			// remove workers
			let hasDelete = false;
			const data = await xhr.get<any>(`${julia.url}/v1/workers`)
			_.forEach(data?.apps?.inUse, async (app) => {
				if (app.guid != "default") {
					hasDelete = true;
					xhr.delete(`${julia.url}/v1/workers/apps/${app.name}/${app.guid}`).catch((any) => console.log(any));
				}
			});

			//wait all worker deleted.
			let checkStatusTimes = 0;
			while (hasDelete && checkStatusTimes < 10) {
				await sleep(10 * 1000);
				checkStatusTimes++;
				const data = await xhr.get<any>(`${julia.url}/v1/workers`)
				const inUseNotDefaultApp = _.filter(data?.apps?.inUse, app => app.guid != "default");
				hasDelete = inUseNotDefaultApp.length != 0;

				if (hasDelete) {
					// console.log(`=========================================== (${checkStatusTimes})`);
					_.forEach(inUseNotDefaultApp, async (app) => {
						console.log(`waiting julia app delete: ${app.name}/${app.guid}, works: ${app.workers}`);
						if (checkStatusTimes % 3 == 0) {
							xhr.delete(`${julia.url}/v1/workers/apps/${app.name}/${app.guid}`).catch((any) => console.log(any));
						}
					});
				}
			}
			console.log("Finish delete workers");
		}

		describe(`Object Store`, function () {
			const keepUrl = document.location.href;
			Object.keys(objectActions).forEach((type) => {

				const actions = objectActions[type];

				describe(type, function () {
					let testObjectId = null;
					after( () => {
						window.history.pushState(null, null, keepUrl);
					})

					it(`can create`, async function () {
						this.timeout(60 * 1000);
						testObjectId = await actions.create();
						expect(testObjectId).to.not.eq(null);
						console.log(`test ${type} object created: ${testObjectId}`);
					});

					it(`can load`, async function () {
						this.timeout(3 * 60 * 1000);
						expect(testObjectId).to.not.eq(null);
						await actions.load(true, testObjectId);
					});

					it(`can load again after clear works`, async function () {
						this.timeout(5 * 60 * 1000);
						expect(testObjectId).to.not.eq(null);

						await removeWorkers();
						await actions.load(true, testObjectId);
					});

					it(`can delete`, async function () {
						this.timeout(5 * 60 * 1000);
						expect(testObjectId).to.not.eq(null);

						await removeWorkers();

						const obj = await actions.load(false, testObjectId);
						await actions.delete(obj);
					});

				});
			})

		});
	}
}

testScheduler.register(new ObjectStoreTests());