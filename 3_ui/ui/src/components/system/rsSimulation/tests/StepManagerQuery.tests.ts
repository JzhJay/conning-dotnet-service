import {testScheduler, ITestable, expect, JULIA_TAG, runQueryFromOptions, sampleQueries} from "test"
import {api, julia, user} from 'stores'
import {xhr} from 'stores/xhr';

const timeouts = {
	loadMetadata: 150000,
	runQuery: 120000,
}

class StepManagerQueryTests implements ITestable {
	describeTests = () => {
		let queryResult = null
		describe(`StepManagerQueryTests`, function () {
			before(async function () {
				this.timeout(timeouts.runQuery);
				const sampleQuery = sampleQueries[0]; // modify this structure to reflect Anthony's stuff
				queryResult = await runQueryFromOptions(sampleQuery) // pass in a sim id instead
			})

			it(`should query this dfa file without crashing`, async function () {
				// add more things here
				expect(queryResult).to.not.equal(null);
				// get shape of metadata for the query
			})
		});
	}
}

testScheduler.register(new StepManagerQueryTests());