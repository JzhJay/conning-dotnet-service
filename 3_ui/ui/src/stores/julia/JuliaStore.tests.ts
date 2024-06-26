import {testScheduler, ITestable, expect, JULIA_TAG} from "test"
import {api} from 'stores';
import {queryStore as queryStore} from 'stores/query';
import {simulationStore as simulationStore} from 'stores/simulation';
const {julia: store} = api;

class JuliaStoreTests implements ITestable {
	describeTests = () => {
		describe(`Julia Store (${store.url})`, async function () {
			it(`can be reset`, function () {
				this.timeout(5000);
				store.reset();
				expect(store.connected).to.be.true;
			});

			it(`and is running ${JULIA_TAG}`, function () {
				this.timeout(5000)
				const version = store.loadAbout();
				expect(version).to.not.be.null;

				console.info(`     Julia REST API version: ${JSON.stringify(version)}`);
			});

			// Only run this on test systems
			if (BUILD_PLATFORM !== 'darwin') {
				describe.skip(`local advise tables can be reset ${JULIA_TAG}`, async function () {
					this.timeout(10000);
					store.clearLocalTables();
					it("no queries", async function () {
						const queryDescriptors = await queryStore.loadDescriptors();
						expect(queryDescriptors.length).to.equal(0);
					})
					it("no simulations", async function () {
						const simulationDescriptors = await simulationStore.loadDescriptors();
						expect(simulationDescriptors.length).to.equal(0);
					})
				});
			}

			describe("Dev-Only", function () {
				describe("Console Functions", function () {
					const line = 'This is a test\n';
					it(`console.println("${line}) ${JULIA_TAG}`, async function () {
						await store.print(line);
					})

					it(`should support colorized output`);
				})
			})
		});
	}
}

testScheduler.register(new JuliaStoreTests());