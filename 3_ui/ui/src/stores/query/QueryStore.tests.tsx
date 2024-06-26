import { testScheduler, ITestable, expect, JULIA_TAG } from "test"
import {
	queryStore as store, Query, simulationTestData, Simulation, simulationStore,
	queryResultStore, QueryResult, api, user
} from 'stores';
import {sleep} from '../../utility';
import {mobx} from '../index';

const timeouts = {
	registerSims: 80000,
	switchSims: 20000,
	loadDescriptors: 5000,
	createQuery:     160000,
	invalidQuery:    5000,
	statistics:      10000,
	arrangement:     10000,
	loadSaveQuery:   5000,
	resetQuery:      10000,
	runQuery: 180000
}

class QueryStoreTests implements ITestable {
	describeTests = () => {
		describe(`Query Store`, function () {
			before(`We need to have a list of available simulations ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.registerSims);
				await simulationTestData.registerTestSimulations();
				expect(simulationStore.simulations.size).to.be.greaterThan(0);
			});

			it('can be reset', function () {
				store.resetStore();

				expect(store.descriptors.size).to.equal(0);
				expect(store._loadingByUrl.size).to.equal(0);
				expect(store.querySessions.size).to.equal(0);
			});

			it.skip(`should be able to list available queries within ${timeouts.loadDescriptors}ms ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.loadDescriptors);
				const descriptors = await store.loadDescriptors();

				expect(descriptors.length).to.equal(store.descriptors.size);
				console.log(`System contains ${store.descriptors.size} existing queries`)
			});

			describe('General Query Operations', function () {
				let query: Query;
				let queryFromLoad: Query;
				it(`Should create a new query within ${timeouts.createQuery}ms ${JULIA_TAG}`, async function () {
					this.timeout(timeouts.createQuery)

					const name = 'Test Query';
					const queryId = await store.createQuerySessionDescriptor(name, [simulationTestData.simulations[0].id]);
					query = await store.startQuerySession(queryId);

					it('Should have a createdBy field after being created', function () {
						expect(query.createdBy).to.equal(user.profile.sub);
					})

					expect(query.name).to.equal(name);
				})

				it.skip('Should set expanded property of first axis to true', async function () {
					// expect(query.variables[1].)
				})

				describe('Query Descriptors', function () {
					describe('The store', function () {
						it(`should contain our just created Query's descriptor (without reloading from the server)`, async function () {
							expect(store.descriptors.has(query.id)).to.be.true;
						})

						it(`should empty the list upon a reset`, async function () {
							store.resetStore();
							expect(store.descriptors.has(query.id)).to.be.false;
						});

						it(`should allow us to retrieve a single query by ID ${JULIA_TAG}`, async function () {
							this.timeout(5 * 1000)
							let descriptor = await store.startQuerySession(query.id);
							expect(descriptor).to.exist;
							expect(descriptor.id).to.equal(query.id);
							expect(store.descriptors.size).to.equal(1);
						})
					})

				})

				describe('Queries', function () {
					let descriptor;

					before(`Get the descriptor ${JULIA_TAG}`, async function () {
						this.timeout(timeouts.createQuery)
						descriptor = await store.startQuerySession(query.id);
					});

					it('should have a creation time', async function () {
						expect(descriptor.createdTime).to.exist;
					})

					it('should have a modified time', async function () {
						expect(descriptor.modifiedTime).to.exist;
					})

					it(`should be renameable ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						const newName = 'Renamed Query';

						await query.rename(newName)
						expect(query.name).to.equal(newName);
					});

					it(`should have updated the raw descriptor's name ${JULIA_TAG}`, async function () {
						const q = await store.getQuery(query.id, true);
						expect(query.name).to.equal(q.name);
					});

					it(`should change their modified time if the query is renamed ${JULIA_TAG}`, async function () {
						const previousTime = new Date(query.modifiedTime);
						this.timeout(5000)
						await sleep(1000); //TODO: Bad! remove and await promise/reaction
						await query.rename('Test Query')
						// Expect the descriptor in the store to have updated both time and name
						const modifiedTime = new Date(query.modifiedTime)
						expect(modifiedTime.getTime()).to.not.equal(previousTime.getTime());
					})

					describe('Variable Selection', function () {
						it(`will have 50 variables available after selecting Module=Securities ${JULIA_TAG}`, async function () {
							this.timeout(5 * 1000)
							let moduleAxis = query.axisByLabel('Module'), clause = query._variables.zeroClause;

							await clause.selectCoordinates('Only', moduleAxis, [moduleAxis.coordinateByLabel('Securities')]);
							expect(query._variables.selected).to.equal(44);
						});

						describe.skip('Query Save and Load', function () {
							let location = `${BUILD_DIRECTORY}/julia-repos/Pivot.jl-test`
							let queryDefName = 'TestQuery.json'
							it(`should be able to save the current query and load it back ${JULIA_TAG}`, async function () {
								this.timeout(timeouts.loadSaveQuery);
								const definition = await query.getQuerySave();
								let name = 'Test Query';
								let queryId = await store.createQuerySessionDescriptor(name, query.simulationIds, definition);
								queryFromLoad = await store.startQuerySession(queryId);

								expect(queryFromLoad.name).to.equal(name);
								expect(queryFromLoad._variables.selected).to.equal(query._variables.selected)
							})
						});

						describe('Multiple Variable Clauses', function () {
							it(`should be able to add a variables clause ${JULIA_TAG}`, async function () {
								this.timeout(5 * 1000)
								expect(query._variables.selected).to.not.equal(query._variables.total);
								const formerLength = query._variables.clauses.size;
								await query._variables.addClause();
								expect(query._variables.clauses.size).to.equal(formerLength + 1)
								expect(query._variables.selected).to.equal(query._variables.total);
							});

							it(`should be able to delete a variables clause ${JULIA_TAG}`, async function () {
								this.timeout(10 *1000)
								const formerLength = query._variables.clauses.size;
								const clauseNumber = 1
								const newClause = query._variables.clauses.get(clauseNumber.toString())
								await query._variables.deleteClause(newClause.id);
								expect(query._variables.clauses.size).to.equal(formerLength - 1)
							});

							// it('should be able to reorder variable clauses', async function () {
							// 	//query.addClause('variables')
							// });
						})
					});

					it(`should be resettable ${JULIA_TAG}`, async function () {
						this.timeout(10000)

						it('will have 50 variables available after selecting Module=Securities', async function () {
							const moduleAxis = query.axisByLabel('Module'), clause = query._variables.clauses[0];

							await clause.selectCoordinates('Only', clause.id, moduleAxis, [moduleAxis.coordinateByLabel('Securities')]);
							expect(query._variables.selected).to.equal(44);
						});

						await query.reset();

						expect(query._variables.selected).to.equal(query._variables.total);
					});

					describe('Statistics Selection', function () {
						this.timeout(timeouts.statistics)

						it(`should be able to add a statistics clause ${JULIA_TAG}`, async function () {
							const { statistics } = query;
							const axisId = _.first(statistics.axesAvailable);
							const lastLength = statistics.clauses.length;

							//console.log(`Adding statistics clause for axisId ${axisId}`)
							await statistics.addClause(axisId);

							// Verify that the new state has our clause in it
							expect(statistics.clauses.length).to.equal(lastLength + 1, 'We should have one more clause than we did beforehand');
							expect(_.last(statistics.clauses).axis).to.equal(axisId, 'The last statistics clause should have our axis id');
						})

						it(`should be able to delete statistics clause ${JULIA_TAG}`, async function () {
							const { statistics } = query;
							const clauseAxisToRemove = statistics.clauses[0].axis;
							const lastLength = statistics.clauses.length;

							expect(lastLength).to.be.greaterThan(0, "We should have a clause to delete");

							await statistics.removeClause(clauseAxisToRemove);

							expect(statistics.clauses.length).to.equal(lastLength - 1, 'We should have one less clause than we did');
						})
					});

					describe(`Set Arrangement ${JULIA_TAG}`, function () {
						this.timeout(timeouts.arrangement)

						let arrangementState;

						const updateArrangement = async (...args) => {
							await (query.arrangement as any).updateArrangement(...args);
							arrangementState = query.arrangement;
						}

						before(`Save off arrangement`,function() {
							arrangementState = query.arrangement;
						})

						it(`should be able to rearrange all to row ${JULIA_TAG}`, async function () {
							await updateArrangement("Rows");

							expect(arrangementState.rows.length).to.be.at.least(1);
							expect(arrangementState.columns.length).to.equal(0);
						})

						it(`should be able to rearrange all to columns ${JULIA_TAG}`, async function () {
							await updateArrangement("Columns");

							expect(arrangementState.columns.length).to.be.at.least(1);
							expect(arrangementState.rows.length).to.equal(0);
						})

						it(`should be able to transpose ${JULIA_TAG}`, async function () {
							const initialRowLength = arrangementState.rows.length;
							const initialColumnLength = arrangementState.columns.length;

							await updateArrangement("Transpose");

							expect(initialRowLength).to.equal(arrangementState.columns.length);
							expect(initialColumnLength).to.equal(arrangementState.rows.length);
						})

						it(`should be able to move axis to first row column or row ${JULIA_TAG}`, async function () {
							const testAxisId = mobx.values(query.axes)[0].id;

							if (_.includes(arrangementState.rows, testAxisId)) {
								await updateArrangement("FirstColumn", testAxisId);
								expect(testAxisId).to.equal(arrangementState.columns[0]);
							}
							else {
								await updateArrangement("FirstRow", testAxisId);
								expect(testAxisId).to.equal(arrangementState.rows[0]);
							}

						})

						it(`should be able to move axis to being AFTER another axis ${JULIA_TAG}`, async function () {
							const testAxisId = mobx.values(query.axes)[0].id;
							const targetAxisId = mobx.values(query.axes)[1].id;
							const targetAxisLocation = _.includes(arrangementState.rows, targetAxisId) ? "rows" : "columns";

							await updateArrangement("MoveAfter", testAxisId, targetAxisId);

							// Should be placed after the target axis.
							const targetAxisIndex = arrangementState[targetAxisLocation].indexOf(targetAxisId);
							expect(testAxisId).to.equal(arrangementState[targetAxisLocation][targetAxisIndex + 1]);

						})
					});

					describe('Regressions', () => {
						describe('WEB-1125', async function () {
							it(`should add a statistics clause ${JULIA_TAG}`, async function () {
								this.timeout(5 * 1000)
								const { statistics } = query;
								const axisId = _.first(statistics.axesAvailable);
								const priorClauseLength = statistics.clauses.length;

								await statistics.addClause(axisId);

								// Verify that the new state has our clause in it
								expect(statistics.clauses.length).to.equal(priorClauseLength + 1);
								expect(_.last(statistics.clauses).axis).to.equal(axisId, 'the last statistics clause should now have the same axis ID we specified');
							})

							it('and still have available axis data', async function () {
								expect(query.axes.size).to.be.greaterThan(0);
							});

							it(`even after refreshing the query state from the server ${JULIA_TAG}`, async function () {
								this.timeout(10 * 1000);
								query = await store.startQuerySession(query.id);
								expect(query.axes.size).to.be.greaterThan(0);
							});
						});
					})
				})

				after('Delete the test query', async function () {
					this.timeout(5000)
					if (query) {
						await query.delete(true);
					}
					expect(store.querySessions.has(query.id)).to.be.false;
					// this.timeout(timeouts.invalidQuery)
					// let expectedError = false;
					// try {
					// 	query = await store.startQuerySession(query.id);
					// }
					// catch (err) {
					// 	expectedError = true;
					// }
					//
					// expect(expectedError).to.be.true;
				});
			})

			describe(`WEB-1150 - David's Query Test Case`, function () {
				let query: Query;
				const simulationName = simulationTestData.testSimulations[0].name;
				let simulation: Simulation;

				it(`has access to the simulation '${simulationName}'`, function () {
					simulation = simulationStore.simulationByName[simulationName];
					expect(simulation).to.exist;
				})

				it(`can start an interactive query session against the simulation ${JULIA_TAG}`, async function () {
					this.timeout(timeouts.createQuery)
					const queryId = await store.createQuerySessionDescriptor('WEB-1150', [simulation.id]);
					query = await store.startQuerySession(queryId);

					expect(query).to.exist;
					expect(query.id).to.equal(queryId);
				})

				describe(`handles variable selection correctly`, async function () {
					it(`it should start with ${389} variables available`, async function () {
						expect(query._variables.selected).to.equal(389);
						expect(query._variables.selected).to.equal(query._variables.total);
					});

					it(`will have 322 variables available after selecting Module=Economies ${JULIA_TAG}`, async function () {
						this.timeout(10 * 1000)
						const moduleAxis = query.axisByLabel('Module'), clause = query._variables.zeroClause;

						await clause.selectCoordinates('Only', moduleAxis, [moduleAxis.coordinateByLabel('Economies')]);
						expect(query._variables.selected).to.equal(322);
						await clause.selectCoordinates('All', moduleAxis);
					})

					it(`will have 44 variables available after selecting Module=Securities ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						const moduleAxis = query.axisByLabel('Module'), clause = query._variables.zeroClause;

						await clause.selectCoordinates('Only', moduleAxis, [moduleAxis.coordinateByLabel('Securities')]);
						expect(query._variables.selected).to.equal(44);
					})

					it(`will have 44 variables available after selecting Module=Securities,Timing=Final ${JULIA_TAG}`, async function () {
						this.timeout(10 * 1000)
						const timingAxis = query.axisByLabel('Timing');
						await query._variables.zeroClause.selectCoordinates('Only', timingAxis, [timingAxis.coordinateByLabel('Final')]);
						expect(query._variables.selected).to.equal(44, 'module=Securities, ');
					})

					it(`will have 2 variables available after selecting Module=Securities,Timing=Final,market=Market Indices ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						const marketAxis = query.axisByLabel('Market');
						await query._variables.zeroClause.selectCoordinates('Only', marketAxis, [marketAxis.coordinateByLabel('Market Indices')]);
						expect(query._variables.selected).to.equal(2);
					})

					it(`will have 2 variables available after selecting Module=Securities,Timing=Final,market=Market_Indices,Market Index=All ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						const marketIndexAxis = query.axisByLabel('Market Index');
						await query._variables.zeroClause.selectCoordinates('Only', marketIndexAxis, [marketIndexAxis.coordinateByLabel('All')]);
						expect(query._variables.selected).to.equal(2);
					});

					it(`will have 1 variable available after selecting Module=Securities,Timing=Final,market=Market Indices,Market Index=All, Measure=Price ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						const measureAxis = query.axisByLabel('Measure');
						await query._variables.zeroClause.selectCoordinates('Only', measureAxis, [measureAxis.coordinateByLabel('Price')]);
						expect(query._variables.selected).to.equal(1);
					})

					let result: QueryResult;
					it(`should be able to run a query within ${timeouts.runQuery}ms ${JULIA_TAG}`, async function () {
						this.timeout(timeouts.runQuery)
						result = await query.run();
						expect(result).to.exist;
					})

					let queryResult: QueryResult;

					it(`should produce a valid query result ${JULIA_TAG}`, async function () {
						this.timeout(5 * 1000)
						queryResult = await queryResultStore.loadResult(result.id, true);
						expect(queryResult).to.exist;

						//console.info(`queryResult - ${queryResult.id}`)
					})

					it.skip('should delete the query result after a selection is made in the builder', async function () {

					})

					it.skip('should be able to rerun the query and produce a NEW query result', async function () {

					})

					it.skip('should support query duplication', async function () {
						// After duplicate we should no longer have a result
					})

					// it('should have the same arrangement as we described earlier', async function () {
					// 	debugger;
					// 	expect(_.eq(queryResult.arrangement.rowAxes, a => query.state.arrangement.rows));
					// 	expect(_.eq(queryResult.arrangement.columnAxes, a => query.state.arrangement.columns));
					// })

					it(`will return to the total variables after calling reset - WEB-1192 ${JULIA_TAG}`, async function() {
						this.timeout(timeouts.resetQuery)
						expect(query._variables.selected).to.not.equal(query._variables.total);
						await query.reset();
						expect(query._variables.selected).to.equal(query._variables.total);
					})

					it.skip(`will have 31 variables available after selecting Measure=Price ${JULIA_TAG}`, async function () {
						const measureAxis = query.axisByLabel('Measure');
						await query._variables.zeroClause.selectCoordinates('Only', measureAxis, [measureAxis.coordinateByLabel('Price')]);
						expect(query._variables.selected).to.equal(31);
					})
				})

				after('Delete the query', async function () {
					this.timeout(5000)
					query && await query.delete(true);
				})
			})

			QueryStoreTests.describeMultiSimTests();

			describe.skip('Security', () => {
				it(`Should require being logged in in order to retrieve queries`, async function () {
					const descriptors = await store.loadDescriptors();
				});

				it(`Should disallow listing queries the user doesn't have access to`)
				it(`Should disallow loading queries the user doesn't have access to`)
				it(`Should disallow deleting queries the user doesn't have access to`)
				it(`Should disallow creating queries if user doesn't have sufficient rights`)
			});
		});
	}

	static describeMultiSimTests() {
		describe(`WEB-1530 - Multisim`, function () {
			let query: Query;

			let sim1: Simulation, sim2: Simulation;

			it(`can start an interactive query session with two simulations ${JULIA_TAG}`, async function () {
				sim1 = simulationTestData.simulations[0];
				sim2 = simulationTestData.simulations[1];
				this.timeout(timeouts.createQuery)
				const queryId = await store.createQuerySessionDescriptor('WEB-1530 - Multisim', [sim1.id, sim2.id]);
				query = await store.startQuerySession(queryId);

				expect(query).to.exist;
				expect(query.id).to.equal(queryId);
				expect(query.simulations.length).to.equal(2);
			})

			it(`has a simulation axis with two values matching our IDs`, function () {
				const simulationCoordinates = query.axisByLabel('Simulation').coordinates;
				expect(simulationCoordinates.length).to.equal(2);
				expect(simulationCoordinates[0].label).to.equal(sim1.name)
				expect(simulationCoordinates[1].label).to.equal(sim2.name)
			})

			it(`should allow removing a simulation ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.switchSims);
				await query.switchSimulations([sim1.id]);
				const simulationCoordinates = query.axisByLabel('Simulation').coordinates;
				expect(simulationCoordinates.length).to.equal(1);
				expect(simulationCoordinates[0].label).to.equal(sim1.name)
				expect(query._variables.total).to.equal(sim1.variables);
			})

			it(`should allow adding a simulation ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.switchSims);
				await query.switchSimulations([sim1.id, sim2.id]);
				const simulationCoordinates = query.axisByLabel('Simulation').coordinates;
				expect(simulationCoordinates.length).to.equal(2);
				expect(simulationCoordinates[0].label).to.equal(sim1.name)
				expect(simulationCoordinates[1].label).to.equal(sim2.name)
			})

			it(`will have the simulation # of variables available after selecting only the first simulation ${JULIA_TAG}`, async function () {
				this.timeout(5 * 1000)
				const axis = query.axisByLabel('Simulation');
				await query._variables.zeroClause.selectCoordinates('Only', axis, [axis.coordinateByLabel(sim1.name)]);
				expect(query._variables.selected).to.equal(sim1.variables);
			})

			it(`will have the simulation # of variables available after selecting only the second simulation ${JULIA_TAG}`, async function () {
				this.timeout(5 * 1000)
				const axis = query.axisByLabel('Simulation');
				await query._variables.zeroClause.selectCoordinates('Only', axis, [axis.coordinateByLabel(sim2.name)]);
				expect(query._variables.selected).to.equal(sim2.variables);
			})

			it(`can have both simulations selected ${JULIA_TAG}`, async function () {
				this.timeout(5 * 1000)
				const axis = query.axisByLabel('Simulation');
				await query._variables.zeroClause.selectCoordinates('All', axis);
			})

			it(`can be pared down to a single variable for selection ${JULIA_TAG}`, async function () {
				this.timeout(15000);  // We do a bunch of selections here

				const fTime = query.axisByLabel('FTime');
				await query._variables.zeroClause.selectCoordinates('Only', fTime, [fTime.coordinateByLabel('+0 Periods')]);

				const compounding = query.axisByLabel('Compounding');
				await query._variables.zeroClause.selectCoordinates('Only', compounding, [compounding.coordinateByLabel('Annual')]);

				// const coupon = query.axisByLabel('Coupon');
				// await query.variables.zeroClause.selectCoordinates('Only', coupon, [coupon.coordinateByLabel('Zero')]);

				const economy = query.axisByLabel('Economy');
				await query._variables.zeroClause.selectCoordinates('Only', economy, [economy.coordinateByLabel('US')]);

				// const rating = query.axisByLabel('Rating');
				// await query.variables.zeroClause.selectCoordinates('Only', rating, [rating.coordinateByLabel('AAA')]);

				expect(query._variables.selected).to.equal(1);
			})

			let result: QueryResult;
			it(`should be able to run a query within ${timeouts.runQuery}ms ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.runQuery)
				result = await query.run();
				expect(result).to.exist;
			})

			let queryResult: QueryResult;

			it('should produce a valid query result', async function () {
				this.timeout(5 * 1000)
				queryResult = await queryResultStore.loadResult(result.id, true);
				expect(queryResult).to.exist;

				//console.info(`queryResult - ${queryResult.id}`)
			})

			after(`Delete the query`,async function () {
				this.timeout(5 * 1000)
				query && await query.delete(true);
			})
		});
	}
}

testScheduler.register(new QueryStoreTests());
