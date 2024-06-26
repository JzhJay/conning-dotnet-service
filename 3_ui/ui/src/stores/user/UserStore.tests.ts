import {testScheduler, ITestable, expect, JULIA_TAG} from "test"
import {api, julia, user} from 'stores'
import {xhr} from 'stores/xhr';

class UserStoreTests implements ITestable {
	describeTests = () => {
		describe(`Users`, function () {
			before(async function () {
				// Run in before block so our per test julia login doesn't get denied before the test user is signed in
				this.timeout(20000)
				await testScheduler.loginTestUser();
				await julia.print(`Use route to force JWT generation`); //Make initial Julia request to get things primed (e.g. generate JWT, precompiled, etc)
			})

			const testUserName = "WebVISE Tester";

			it(`should be signed in as test user`, async function () {
				expect(user.profile.name).to.equal(testUserName);
			})

			it(`should support logging out from within a unit test`, function () {
				user.logout();
				expect(user.isLoggedIn).to.be.false;
			})

			it(`should allow for relogging in again`, async function () {
				this.timeout(5000)
				await testScheduler.loginTestUser();
				expect(user.isLoggedIn).to.be.true;
			})

			it(`can retrieve a list of users with valid profile data ${JULIA_TAG}`, async function () {
				this.timeout(10 * 1000);
				await user.loadDescriptors()

				expect(user.users.size).to.be.at.least(1);
				expect(user.users.get(user.profile.sub).fullName).to.equal(testUserName);
			});
		});
	}

}

testScheduler.register(new UserStoreTests());