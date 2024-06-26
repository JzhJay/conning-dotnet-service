import {testScheduler, ITestable, expect} from "test"
import {CachedMatrix} from 'components/system/pivot/cache/cachedMatrix';
import {queryResultStore as queryResultStore, QueryResult} from 'stores/queryResult';
import {QueryResultMock} from 'test/mocks/QueryResultMock'
import {reaction} from 'mobx'

class PivotCacheTests implements ITestable {
	describeTests = () => {
		describe.skip(`Pivot Cache`, function () {
			let testGuid = '65eaeb5b-f488-4295-97e9-ad1ed15fd095';

			describe(`For query result '${testGuid}'`, function () {
				let queryResult:QueryResult = new QueryResultMock() as any;

				let resumeFunction;
				const getBlockedCell = (r, c):Promise<any>  => {
					return new Promise((accept)=> {
						resumeFunction = () => {
							accept(cache.getCell(r, c))
						}
					})
				}

				let cache: CachedMatrix;
				it('can construct a pivot cache and load initial data', async function () {
					const {pivotMetadata} = queryResult;
					cache = new CachedMatrix(queryResult.pivot.getData, pivotMetadata.rows, pivotMetadata.columns, 6, 6, 6, 4);

					reaction(() => cache.isCachedBlocked, (isCacheBlocked) => {
						if (!isCacheBlocked) {
							resumeFunction();
						}
					})

					cache.getCell(0, 0);

					const cell = await getBlockedCell(0, 0);
					expect(cell.detailCell.data).to.equal(`0 0`);
				});

				const verifyCells = async () => {
					const {pivotMetadata} = queryResult;

					let startTime = Date.now();
					for (let r = 0; r < pivotMetadata.rows; r++){
						for (let c = 0; c < pivotMetadata.columns; c++) {
							let cell = cache.getCell(r, c);

							if (cell == undefined) {
								await new Promise<void>((accept) => {
									resumeFunction = () => {
										cell = cache.getCell(r, c);
										accept()
									}
								})
							}

							expect(cell.detailCell.data).to.equal(`${r} ${c}`)
							expect(cell.rowCoords[0]).to.equal(`${r}`)
							expect(cell.colCoords[0]).to.equal(`${c}`)
						}
					}

					return Date.now() - startTime;
				}

				let initialFetchTime = 0;
				it('can fetch every cell', async function () {
					this.timeout(60 *1000)
					initialFetchTime = await verifyCells();
				})

				it('should be able to fetch cells from cache more quickly than before', async function () {
					this.timeout(30 * 1000)

					// Hitting cache will be alot faster with bigger latency but we have our latency set to 50ms
					expect(await verifyCells()).to.be.lessThan(initialFetchTime/1.5)
				})
			})
		});
	}
}

testScheduler.register(new PivotCacheTests());

