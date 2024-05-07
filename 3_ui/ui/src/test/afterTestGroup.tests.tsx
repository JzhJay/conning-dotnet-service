import {julia, xhr} from 'stores';
import {ITestable, JULIA_TAG, testScheduler} from 'test';

class AfterTestGroupTests implements ITestable {
	describeTests = () => {
		describe(`After test group`, function () {
			it(`remove all not default process ${JULIA_TAG} after all test in group finish`, async function() {
				this.timeout(2 * 60 * 1000);
				await xhr.get<any>(`${julia.url}/v1/workers`).then((data) => {
					_.forEach(data?.apps?.inUse, async (app) => {
						console.log(`julia app in use: ${app.name}/${app.guid}, works: ${app.workers}`);
					});
					_.forEach(data?.apps?.inUse, async (app) => {
						if (app.guid != "default") {
							xhr.delete(`${julia.url}/v1/workers/apps/${app.name}/${app.guid}`).catch((any) => console.log(any));
						}
					});
				});
			})
		});
	}
}

testScheduler.register(new AfterTestGroupTests());