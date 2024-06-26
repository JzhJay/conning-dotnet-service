import { testScheduler, ITestable, expect, JULIA_TAG } from "test"
import {
	reportStore, queryStore, Query, simulationTestData, Simulation, simulationStore,
	queryResultStore, QueryResult, user, Report, ReportQuery
} from 'stores';
import * as utility from 'utility';

const timeouts = {
	loadDescriptors: 10000,
	registerSims: 10000,
	createReport: 5000,
	duplicateReport: 30000,
}

class QueryStoreTests implements ITestable {
	describeTests = () => {
		describe.skip(`Reports (WEB-150)`, function () {
			before('We need to have a list of available simulations', async function () {
				this.timeout(timeouts.registerSims);
				await simulationTestData.registerTestSimulations();
				expect(simulationStore.simulations.size).to.be.greaterThan(0);
			});

			it(`should be able to list available reports ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.loadDescriptors);
				const descriptors = await reportStore.loadDescriptors();

				expect(descriptors.length).to.equal(reportStore.descriptors.size);
			});

			let report: Report;

			it(`Should create a new report within ${timeouts.createReport}ms ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.createReport)

				const name = 'Test Report';
				report = await reportStore.createReport(name);

				it('Should have a createdBy field after being created', function () {
					expect(report.createdBy).to.equal(user.profile.sub);
				})

				expect(report.name).to.equal(name);
			})

			it(`should contain our newly created report descriptor (without reloading from the server)`, async function () {
				expect(reportStore.descriptors.has(report.id)).to.be.true;
			})

			it(`should allow us to retrieve a single report by ID ${JULIA_TAG}`, async function () {
				this.timeout(2 * 1000)
				let descriptor = await reportStore.loadReport(report.id);
				expect(descriptor).to.exist;
				expect(descriptor.id).to.equal(report.id);
			})

			it(`should be renameable ${JULIA_TAG}`, async function () {
				this.timeout(2 * 1000)
				const newName = 'Test Report (Renamed)';
				report.name = newName;  // This will cause a PUT to happen

				await report.serializationPromise;
				const renamed = await reportStore.loadReport(report.id);
				expect(renamed.name).to.equal(newName);
			})

			it(`should allow simulation slots to be created`, function () {
				let initialPageCount = report.simulationSlots.length;

				const slot = report.addSimulationSlot();

				expect(report.simulationSlots.length).to.equal(initialPageCount + 1);

				expect(slot.simulation).to.be.null;
				expect(slot.id).to.exist;
			})

			it(`should allow simulations to be bound to slots`, function () {
				const sim1 = simulationTestData.simulations[0];
				const slot = report.simulationSlots[0];

				slot.simulationId = sim1.id;
				expect(slot.simulation).to.equal(sim1);

				const sim2 = simulationTestData.simulations[1];
				const slot2 = report.addSimulationSlot()
				slot2.simulationId = sim2.id;
				expect(slot2.simulation).to.equal(sim2);

				expect(report.findSimulationSlot(slot2.id)).to.equal(slot2);

				const slot3 = report.addSimulationSlot();
				slot3.delete();
				expect(report.findSimulationSlot(slot3.id)).to.not.exist;
			})

			it(`should allow pages to be created`, function () {
				let initialPageCount = report.pages.length;

				report.addPage();

				expect(report.pages.length).to.equal(initialPageCount + 1);

				initialPageCount = report.pages.length;

				report.addPage();

				expect(report.pages.length).to.equal(initialPageCount + 1);
			})

			it(`should allow pages to be deleted`, function () {
				let initialPageCount = report.pages.length;

				const page = report.addPage();

				expect(report.pages.length).to.equal(initialPageCount + 1);

				page.delete();

				expect(report.pages.length).to.equal(initialPageCount);
			})

			it(`should allow pages to be reordered`, async function () {
				expect(report.pages.length).to.equal(2);
				const p1 = report.pages[0];
				const p2 = report.pages[1];

				expect(p1.index).to.equal(0);
				expect(p2.index).to.equal(1);

				// Move the first page to the end
				report.movePage(p1.index, p2.index);
				expect(p1.index).to.equal(1);
				expect(p2.index).to.equal(0);
			})

			let rq : ReportQuery;

			it(`should support creating a report query ${JULIA_TAG}`, async function () {
				this.timeout(120 * 1000);
				const page1 = report.pages[0];
				rq = page1.addReportQuery([report.simulationSlots[0].id]);
				await utility.waitUntil(() => rq.query, 30000);
				expect(rq.query).to.exist;
			})

			it(`should recreate the underlying query and restore state after switching the simulation bound to a slot ${JULIA_TAG}`, async function() {
				this.timeout(30 * 1000);
				const newSim = _.last(simulationTestData.simulations);

				console.info(`Switching slot 1 to simulation ${newSim.id}`)
				report.simulationSlots[0].simulationId = newSim.id;
				await utility.waitUntil(() => _.isEqual(rq.query.simulationIds.slice(), [newSim.id]), 20000);

				expect(rq.query.simulationIds[0]).to.equal(newSim.id);
			})


			it.skip(`Reports can be duplicated ${JULIA_TAG}`, async function () {
				this.timeout(timeouts.duplicateReport)
				const duplicatedReport = await report.duplicate(false);
				expect(duplicatedReport.id).to.not.equal(report.id);
				expect(duplicatedReport.pages.length).to.equal(report.pages.length);

				expect(duplicatedReport.simulationSlots.length).to.equal(report.simulationSlots.length);

				await duplicatedReport.delete();
			})

			after('should delete the test report', async function () {
				report && await report.delete();
				expect(reportStore.loadedReports.has(report.id)).to.be.false;

				it('should clean up any queries it created', function () {
					for (let page of report.pages) {
						for (let rq of page.reportQueries) {
							if (rq.queryId) {
								expect(queryStore.descriptors.has(rq.id)).to.be.false
							}
						}
					}
				})
			});
		});
	}
}

testScheduler.register(new QueryStoreTests());