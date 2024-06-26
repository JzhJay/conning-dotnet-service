import {isPhantomJS, testScheduler, ITestable, expect, JULIA_TAG} from "test"
import {QueryResult, queryResultStore as queryResultStore} from 'stores/queryResult';
import {queryStore as store, Query} from 'stores/query';
import {api, user, simulationTestData, simulationStore, mobx} from 'stores';
import {runQueryFromOptions} from '../../test/core/queryHelper';
import {sampleQueries, testQueries} from '../../test'
import {toJS} from 'mobx';
import type { ChartUserOptions } from "../charting/chartComponentModels";
import { QueryResultStore } from "./QueryResultStore";

class QueryResultStoreTests implements ITestable {
	describeTests = () => {
		describe(`Query Result Store`, async function () {
			let descriptors;
			let testGuid;

			it('can be reset', async function () {
				queryResultStore.resetStore();

				expect(queryResultStore.loadedResults.size).to.equal(0);
			});

			it(`can be populated by running queries ${JULIA_TAG}`, async function() {
				this.timeout(120000)

				testGuid = (await runQueryFromOptions(sampleQueries[0])).id;
			});

			it(`can load available query results ${JULIA_TAG}`, async function () {
				this.timeout(5 * 1000)
				descriptors = await queryResultStore.loadResultDescriptors();
				// let descriptor = descriptors.filter(function(value){
				// 	return value.descriptor.axes.length == 14;
				// })[0];
				expect(descriptors.length).to.be.greaterThan(0);
				expect(descriptors.length).to.equal(queryResultStore.loadedResults.size);
			});

			it('should have the same name as query name', async function () {
				this.timeout(5000)
				const queryResult = await queryResultStore.loadResult(testGuid);
				expect(queryResult.name).to.equal('Test Query');
				const newName = 'New Query Result Name';
				await queryResult.rename(newName)
				expect(queryResult.name).to.equal(newName);
			});

			// it(`should be owned/created by me ${JULIA_TAG}`, async function () {
			// 	this.timeout(5 * 1000)
			// 	const queryResult = await queryResultStore.loadResult(testGuid);
			// 	expect(queryResult.createdBy).to.equal(user.profile.user_id);
			// });

			it('should guard against null inputs', async function () {
				QueryResultStoreTests.testInvalidId(null);
			});

			it('should guard against invalid guids', async function () {
				QueryResultStoreTests.testInvalidId('not-a-guid');
				QueryResultStoreTests.testInvalidId('thisguid-does-no0t-have-gooddata1234');
			});

			describe.skip(`Query Run Results Test`, function () {
				this.timeout(50000)
				let query:Query;
				let name = `TestQuery`;
				let location = `${BUILD_DIRECTORY}/julia-repos/Pivot.jl-test`
				it('should run the test', async function () {
					let queryId = await store.createQuerySessionDescriptor(name, [_.first(mobx.keys(simulationStore.simulations))]);
					query = await store.startQuerySession(queryId);
					let resultId = await query.run();
					let result: QueryResult = await queryResultStore.loadResult(resultId);
					console.log(`${result.dataByUrl}`)
				});
			});

			describe(`Pivot Tables ${JULIA_TAG}`, function () {
				this.timeout(15000);

				let result: QueryResult;

				it(`should load and reset pivot metadata ${JULIA_TAG}`, async function () {
					result = await queryResultStore.loadResult(testGuid);

					expect(result.pivotMetadata).to.be.undefined;

					const {default_arrangement} = result.descriptor;

					let pivotMetadata = await result.loadMetadata({arrangement: default_arrangement});

					expect(toJS(result.pivotMetadata)).to.deep.equal(pivotMetadata);

					expect(pivotMetadata.rowAxes).to.deep.equal(toJS(default_arrangement.rowAxes));
					expect(pivotMetadata.columnAxes).to.deep.equal(toJS(default_arrangement.columnAxes));
				});

				it(`should be able to select cells ${JULIA_TAG}`, async function () {
					const selectionUIDBefore = result.pivotMetadata.selectionUID;
					const window = {x: 0, rows: 5, y: 0, columns: 5};
					await result.pivot.selectRange('details', "Only", window);

					expect(selectionUIDBefore).to.not.equal(result.pivotMetadata.selectionUID, "selection UID should be different");
					const data = await result.pivot.getData({...window, subpivot:true});

					for (let r = 0; r < 5; r++) {
						for (let c = 0; c < 5; c++)
						{
							expect(data.detailCells[r][c].selected).to.equal(true, "should be selected");
						}
					}
				})

				it(`should swap rows and columns when flipped back and forth ${JULIA_TAG}`, async function () {
					const oldMetadata = { ...result.pivotMetadata };

					expect(oldMetadata).to.not.be.undefined;
					await result.arrangement.flip();

					expect(oldMetadata.columnAxes).to.deep.equal(result.pivotMetadata.rowAxes);
					expect(oldMetadata.rowAxes).to.deep.equal(result.pivotMetadata.columnAxes);

					await result.arrangement.flip();

					expect(oldMetadata.columnAxes).to.deep.equal(result.pivotMetadata.columnAxes);
					expect(oldMetadata.rowAxes).to.deep.equal(result.pivotMetadata.rowAxes);
				});

				it(`should be able to move all to row and move all to column ${JULIA_TAG}`, async function () {
					await result.arrangement.allToRows();

					expect(result.pivotMetadata.columnAxes).to.have.length(0);
					expect(result.pivotMetadata.rowAxes).to.have.length.greaterThan(0);

					await result.arrangement.allToColumns();

					expect(result.pivotMetadata.rowAxes).to.have.length(0);
					expect(result.pivotMetadata.columnAxes).to.have.length.greaterThan(1);
				});

				it(`should be able to perform custom arrangement ${JULIA_TAG}`, async function () {
					const columnAxes = [10, 11];
					const rowAxes = [12, 13];

					await result.arrangement.rearrange({columnAxes, rowAxes});

					expect(toJS(result.pivotMetadata.rowAxes)).to.deep.equal(rowAxes);
					expect(toJS(result.pivotMetadata.columnAxes)).to.deep.equal(columnAxes);
				});
			});

			describe.skip(`Charts`, function () {
				this.timeout(60000);

				let testGuid = '6a1388c1-07bc-429c-8429-85efa893d8ff';

				let result: QueryResult;
				let lastChartType;
				let lastChartKey;

				before(async function() {
					result = await queryResultStore.loadResult(testGuid);
					expect(result).to.exist;
					await result.loadMetadata({arrangement: result.descriptor.default_arrangement});
				});


				["box",	"cdf",	"cone", "histogram", "pdf", "scatter"].forEach((chartType) => {
					it(`should load ${chartType} chart results`, async function () {
						let chartResult = await result.highcharts.getPrebuiltDataTemplate(chartType, queryResultStore.charting.defaultUserOptions(chartType));
						let chartDataKey = Object.keys(chartResult)[0];

						expect(chartResult[chartDataKey].chartData.series.length).to.be.greaterThan(0);

						lastChartType = chartType;
						lastChartKey = chartDataKey;
					});
				})

				it(`refetching chart data should be very fast and result in a cache hit`, async function () {
					this.timeout(100);

					let chartResult = await result.highcharts.getPrebuiltDataTemplate(lastChartType, queryResultStore.charting.defaultUserOptions(lastChartType));
					expect(chartResult[Object.keys(chartResult)[0]].chartData.series.length).to.be.greaterThan(0);
				});

				it(`should be able to update chart data`, async function () {
					this.timeout(100);

					const testChartData:any = {chart:{type:"Test"}};
					result.highcharts.updateChartData(lastChartKey, testChartData);
					let chartResult = await result.highcharts.getPrebuiltDataTemplate(lastChartType, queryResultStore.charting.defaultUserOptions(lastChartType));

					expect(chartResult[lastChartKey].chartData).to.equal(testChartData);
				});


				it(`should be able to update chart data ref counts`, async function () {
					this.timeout(100);

					result.highcharts.updateChartDataRefCount(lastChartKey, true);
					let chartResult = await result.highcharts.getPrebuiltDataTemplate(lastChartType, queryResultStore.charting.defaultUserOptions(lastChartType));

					expect(chartResult[lastChartKey].refCount).to.be.greaterThan(0);
				});
			});

			it(`Can persist chart changes ${JULIA_TAG}`, async function () {
				this.timeout(10000)

				const queryResult = await queryResultStore.loadResult(testGuid);
				let userOptions:ChartUserOptions = Object.assign({}, queryResult.userOptions);
				userOptions.isInverted = true;
				await queryResult.updateUserOptions("box", userOptions);

				// Reload the query result from the backend and verify that the user options were correctly applied.
				let resultStore = new QueryResultStore();
				let qr = await resultStore.loadResult(queryResult.id);
				await qr.loadMetadata();

				expect(qr.userOptions["box"].isInverted).to.be.equal(userOptions.isInverted , "chart should match persisted inversion");
			})


			describe(`WEB-1095`, function () {
				it(`should be possible to load a query result descriptor directly by its GUID ${JULIA_TAG}`, async function () {
					queryResultStore.resetStore();

					let result = await queryResultStore.loadResult(testGuid);

					expect(queryResultStore.loadedResults.size).to.equal(1);

					expect(result.id).to.equal(testGuid);
				});
			});

			// describe('query results deletion', function () {
			// 	it(`query results should be able to be deleted ${JULIA_TAG}`, async function () {
			// 		this.timeout(5000)
			// 		queryResultStore.deleteAll();
			// 		let descriptorsPromise = queryResultStore.loadResultDescriptors();
			// 		descriptorsPromise.then(function (des) {
			// 			expect(des.length).to.equal(0);
			// 		});
			// 	});
			// });

			describe(`Test Queries should run and produce correct result ${JULIA_TAG}`, () => {
				let query: Query;
				it(`Test Queries ${JULIA_TAG}`, async function(){
					this.timeout(10 * 60 * 1000)
					let name = 'Test Query12344';
					let simulation = _.first(simulationTestData.simulations);
					let queryId = await store.createQuerySessionDescriptor(name, [simulation.id]);
					query = await store.startQuerySession(queryId);
					let testQuery
					for (testQuery of testQueries){
						// console.warn(testQuery.benchMarkNum);
						let testQueryGuid = (await runQueryFromOptions(testQuery, queryId)).id;
						let result: QueryResult = await queryResultStore.loadResult(testQueryGuid);

						let resultData        = await result.pivot.getData({});
							let dataMatrix        = resultData.detailCells.map(function (arr) {
								return arr.map(function (obj) {
									return obj.data;
								});
							});
						let benchmark   = await api.xhr.get<number[][]>(`${query.apiUrl}/result/benchmarks/${testQuery.benchMarkNum}`);
							let arr1 = _.flatMap(benchmark, a => _.flatMap(a));
							let arr2 = _.flatMap(dataMatrix, a => _.flatMap(a));
							// console.warn(arr2)
							// console.warn(arr1)
							expect(_.isEqual(arr1, arr2)).to.be.true;

							await query.reset();
					}
				});
				after('Delete the query', async function () {
					this.timeout(5000)
					query && await query.delete(true);
				})
			});

			after('Delete the query', async function () {
				this.timeout(5000);
				let q = await store.querySessions.get(testGuid);
				await q.delete(true);
			})
		});
	}

	static testInvalidId(id: string) {
		it(`should guard against the input '${id}'`, async function () {
			expect(queryResultStore.loadedResults.get(id)).to.be.null;
			expect(queryResultStore.loadResult(id)).to.be.null;
		})
	}


}

testScheduler.register(new QueryResultStoreTests());