import {testScheduler, ITestable, expect, JULIA_TAG} from "test"
import {api, apolloStore, julia, omdb, user} from 'stores'

interface IOmdbConfigQuery {
	omdb: { config: { db?: string, server?: string } }
};

class UserStoreTenantTests implements ITestable {
	describeTests = () => {
		describe(`Tenant Users`, async function () {

			const waitGraphQL_timeout = 60 * 1000; // maximum successful run time is 1min 13sec

			before(async function () {
				// Run in before block so our per test julia login doesn't get denied before the test user is signed in
				this.timeout(waitGraphQL_timeout)
				if(user.isLoggedIn){
					user.logout();
				}
				await testScheduler.loginTestUser(true);
				await julia.print(`Use route to force JWT generation`); //Make initial Julia request to get things primed (e.g. generate JWT, precompiled, etc)
			})

			const testUserName = "tenant.tester@conning.com";

			it(`should be signed in as test user`, async function () {
				expect(user.profile.name).to.equal(testUserName);
			})

			it(`should support logging out from within a unit test`, function () {
				user.logout();
				expect(user.isLoggedIn).to.be.false;
			})

			it(`should allow for relogging in again`, async function () {
				this.timeout(waitGraphQL_timeout);
				await testScheduler.loginTestUser(true);
				expect(user.isLoggedIn).to.be.true;
			})

			it(`can retrieve a list of users with valid profile data ${JULIA_TAG}`, async function () {
				this.timeout(waitGraphQL_timeout);
				await user.loadDescriptors()

				expect(user.users.size).to.be.at.least(1);
				expect(user.users.get(user.profile.sub).fullName).to.equal(testUserName);
			});

			it(`config - requires a user be logged in to retrieve`, async function () {
				this.timeout(waitGraphQL_timeout);

				await testScheduler.loginTestUser(true);
				let client = apolloStore.client; // Update reference to client with new auth token;
				let q = await client.query<IOmdbConfigQuery>({query: omdb.graph.config});

				const {db, server} = q.data.omdb.config;

				expect(db).to.not.eq(null, `"db" in config should not be null`);
				expect(server).to.not.eq(null, `"server" in config should not be null`);

				console.info(`OMDB config - Server: ${server}\n\tDatabase: ${db}`);
			});

		});
	}

}

testScheduler.register(new UserStoreTenantTests());