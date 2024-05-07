import {isPhantomJS, testScheduler, ITestable, expect} from "test"
import {IQueryResult, queryResultStore as queryResultStore} from 'stores/queryResult';
import {QueryResultMock} from 'test/mocks';

class PivotTests {
	/*

	 */
	registerPivotTest(guid?: string) {
		describe(`Pivot Tables (${guid ? guid : 'MOCK'}`, function () {
			this.timeout(10000);

			let result: IQueryResult;

			it(`should load and reset pivot metadata`, async function () {
				result = guid ? await queryResultStore.loadResult(guid) : new QueryResultMock();

				expect(result.pivotMetadata).to.be.undefined;

				const {default_arrangement} = result.descriptor;

				let pivotMetadata = await result.loadMetadata({arrangement: default_arrangement});

				expect(result.pivotMetadata).to.equal(pivotMetadata);

				expect(pivotMetadata.rowAxes).to.deep.equal(default_arrangement.rowAxes);
				expect(pivotMetadata.columnAxes).to.deep.equal(default_arrangement.columnAxes);
			});

			it(`should swap rows and columns when flipped back and forth`, async function () {
				const oldMetadata = { ...result.pivotMetadata };

				expect(oldMetadata).to.not.be.undefined;
				let newMetadata = await result.arrangement.rearrange({columnAxes: oldMetadata.rowAxes, rowAxes: oldMetadata.columnAxes});

				expect(oldMetadata.columns).to.equal(newMetadata.rows);
				expect(oldMetadata.rows).to.equal(newMetadata.columns);

				let resetMetadata = await result.arrangement.reset();
				//console.table(oldMetadata);

				//console.table(resetMetadata);

				//expect(oldMetadata).to.deep.equal(resetMetadata);
			});
		});
	}
}
