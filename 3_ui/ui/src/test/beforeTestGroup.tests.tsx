import {julia, user, xhr} from 'stores';
import {expect, ITestable, JULIA_TAG, sleep, testScheduler} from 'test';

class BeforeTestGroupTests implements ITestable {
	describeTests = () => {
		describe(`Before Test Group`, function () {
			it( 'user should can login', async function () {
				// Run in before block so our per test julia login doesn't get denied before the test user is signed in
				this.timeout(2 * 60 * 1000);

				if (user.isLoggedIn) {
					if (user.profile.name == "WebVISE Tester") {
						return;
					}
					await user.logout();
				}
				await testScheduler.loginTestUser();

				await julia.print(`login user as ${user.profile.name}`);
				expect(user.isLoggedIn).to.equal(true);
			})

			it(`remove all not default process ${JULIA_TAG} before all test in group start`, async function () {
				this.timeout(2 * 60 * 1000);

				let hasDelete = false;
				const data = await xhr.get<any>(`${julia.url}/v1/workers`)
				console.log('===========================================');
				_.forEach(Object.keys(data.procs), (procsKey) => {
					if (procsKey != "identify") {
						console.log(`${procsKey} = ${data.procs[procsKey]}`);
					}
				})
				_.forEach(data?.apps?.inUse, async (app) => {
					console.log(`julia app in use: ${app.name}/${app.guid}, works: ${app.workers}`);
				});
				_.forEach(data?.apps?.inUse, async (app) => {
					if (app.guid != "default") {
						hasDelete = true;
						xhr.delete(`${julia.url}/v1/workers/apps/${app.name}/${app.guid}`).catch((any) => console.log(any));
					}
				});

				//wait all worker deleted.
				let checkStatusTimes = 0;
				while (hasDelete) {
					await sleep(10 * 1000);
					checkStatusTimes++;
					const data = await xhr.get<any>(`${julia.url}/v1/workers`)
					const inUseNotDefaultApp = _.filter(data?.apps?.inUse, app => app.guid != "default");
					hasDelete = inUseNotDefaultApp.length != 0;

					if (hasDelete) {
						console.log('===========================================');
						_.forEach(inUseNotDefaultApp, async (app) => {
							console.log(`waiting julia app delete: ${app.name}/${app.guid}, works: ${app.workers}`);
							if (checkStatusTimes % 10 == 0) {
								xhr.delete(`${julia.url}/v1/workers/apps/${app.name}/${app.guid}`).catch((any) => console.log(any));
							}
						});
					}
				}
			});
		});
	}

}

testScheduler.register(new BeforeTestGroupTests());