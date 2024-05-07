import {testScheduler, ITestable, expect, JULIA_TAG, sleep} from "test"
import {simulationStore as store, Simulation} from 'stores/simulation';
import {queryStore, api, user, mobx} from 'stores';
import {HTTP_STATUS_CODES} from '../xhr';
import {simulationTestData} from './SimulationTestData';

const timeouts = {
	loadDescriptors:  5000,
	importSimulation: 30000
}

/*
 Unit Tests for Simulations
 WEB-1132
 */
class SimulationStoreTests implements ITestable {
	describeTests = () => {
		describe(`Simulation Store`, function () {
			it('can be reset', function () {
				store.reset();

				expect(store.simulations.size).to.equal(0);
			});

			it('Can load descriptors', async function () {
				this.timeout(timeouts.loadDescriptors)
				const descriptors = await store.loadDescriptors();
			});

			// WEB-1131
			describe('Importing legacy K simluations', function () {
				this.timeout(timeouts.importSimulation)
				let simulation: Simulation;

				it(`We can import test simulations ${JULIA_TAG}`, async function () {
					this.timeout(60000)
					await simulationTestData.registerTestSimulations();

					const simulation = _.first(simulationTestData.simulations);
					expect(simulation).to.not.be.null;
					//expect(simulation.createdBy).to.equal(user.profile.user_id);
					expect(simulation.name).to.equal(simulationTestData.testSimulations[0].name)
				})

				it(`We cannot import simulation which has already been imported ${JULIA_TAG}`, async function () {
					this.timeout(30000)
					let errorMessage = "";

					try {
						simulation = await store.importSimulation(simulationTestData.testSimulations[0]);
					}
					catch (err) {
						errorMessage = err.message;
					}

					//console.log(errorMessage);

					expect(errorMessage == store.errors.simulationWithNameAlreadyExists(simulationTestData.testSimulations[0].name) || errorMessage == 'Forbidden').to.be.true;
				});

				// We can't delete simulations as any old queries that use them will become invalid
				/*it(`We can delete any existing test simulations`, async function () {
					await simulationTestData.deleteTestSimulations();
				})*/

				it(`The store should contain our newly imported simulation`, async function () {
					expect(mobx.values(store.simulations).find(v => v.name === simulationTestData.testSimulations[0].name)).to.not.be.null;
				})

				it(`The store should be able to list our available simulations within ${timeouts.loadDescriptors}ms ${JULIA_TAG}`, async function () {
					this.timeout(timeouts.loadDescriptors);
					store.reset();
					let simulations = await store.loadDescriptors();

					expect(simulations.length).to.equal(store.simulations.size);
					expect(simulations.length).to.be.greaterThan(0);
				});

				it(`Julia should guard against invalid paths when importing ${JULIA_TAG}`, async function () {
					this.timeout(5 * 1000)
					let exception = false;
					try {
						simulation = await store.importSimulation({
							name:            'Invalid Test Simulation',
							path: `${BUILD_DIRECTORY}/invalid.dfs`
						});
					}
					catch (error) {
						expect(error.status).to.equal(api.HTTP_STATUS_CODES.notAcceptable, error.toString())
						exception = true;
					}
					expect(exception).to.be.true;
				});

				it.skip('Julia should guard against name collisions / duplicates', async function () {
					store.reset();

					let exception = false;
					try {
						simulation = await store.importSimulation(simulationTestData[0]);
					}
					catch (error) {
						expect(error.status).to.equal(api.HTTP_STATUS_CODES.notAcceptable, error.toString())
						exception = true;
					}
					expect(exception).to.be.true(`Julia should have rejected the duplicate name/path pair: ${JSON.stringify(simulationTestData)}`);
				});

				it(`Julia should protect against deleting a simulation linked to a query`, async function () {
					this.timeout(10 * 15000)
					simulation = _.first(simulationTestData.simulations);
					const queryId = await queryStore.createQuerySessionDescriptor("test for simulation deletion", [simulation.id]);
					var query = await queryStore.startQuerySession(queryId);
					let exception = false;
					try{
						await Simulation.delete(simulation, true, true);
					}
					catch (err) {
						expect(err.status).to.equal(api.HTTP_STATUS_CODES.notAcceptable);
						exception = true;
					}
					expect(exception).to.be.true;
					await queryStore.killQuerySession(queryId);
				});

				async function deleteSimulationUntilSuccess(simulation, retryTimes) {
					// the simulation information in the database will update until all related objects have been deleted.
					// retry delete action until HTTP.NOT_FOUND return because we will add a simulation with the same _id.
					let i = 0;
					try {
						while (i++ < retryTimes) {
							await Simulation.delete({...simulation}, true, true);
							await sleep(500);
						}
						expect(false).to.eq(true,`the delete simulation action should return HTTP.NOT_FOUND in ${retryTimes} retries.`)
					} catch (err) {
						if (err.status == HTTP_STATUS_CODES.notFound) {
							console.log(`Simulation Deleted after ${i} tries`)
							return;
						}
						throw err;
					}
				}

				// Don't delete right now as it breaks any queries that use this
				it(`The store should support deletion ${JULIA_TAG}`, async function () {
					this.timeout(13 * 1000)
					simulation = _.first(simulationTestData.simulations);
					try {
						await deleteSimulationUntilSuccess(simulation, 5);
						expect(store.simulations.has(simulation.id)).to.eq(false, `the simulation ${simulation.id} should not exist after delete action.`);

						let exception = false;
						console.log("start XHR request");
						console.time("XHR request");
						try {
							simulation = await store.loadDescriptor(simulation.id);
						} catch (err) {
							console.log(err.name);
							expect(err.name).to.equal("SimulationNotFound");
							exception = true;
						} finally {
							console.timeEnd("XHR request");
						}

						expect(exception).to.eq(true, "the simulation should not be found in the database after deleting");
					} finally {
						// Reimport the simulation
						await store.importSimulation(simulationTestData.testSimulations[0]);
						console.log(`Reimport the simulation: ${JSON.stringify(simulationTestData.testSimulations[0])}`);
					}
				});

				it('Deleting simulation should remove its id from query descriptor which has it', async function () {
					this.timeout(30 * 1000)
					simulation = _.first(simulationTestData.simulations);
					const queryId = await queryStore.createQuerySessionDescriptor("test for simulation deletion", [simulation.id]);
					var query = await queryStore.startQuerySession(queryId);
					await queryStore.killQuerySession(queryId);

					try {
						await deleteSimulationUntilSuccess(simulation, 5);
						var updatedQuery = await queryStore.getQuery(queryId);
						expect(updatedQuery.simulationIds.length).to.equal(0);
					} finally {
						// Reimport the simulation
						await store.importSimulation(simulationTestData.testSimulations[0]);
						console.log(`Reimport the simulation: ${JSON.stringify(simulationTestData.testSimulations[0])}`);
					}
				});
			});
		})
	}
}

testScheduler.register(new SimulationStoreTests());
