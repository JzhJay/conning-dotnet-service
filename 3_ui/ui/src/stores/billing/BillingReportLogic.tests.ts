import {when} from 'mobx';
import {testScheduler, ITestable, expect} from "test"
import {cg, apolloStore, user, billingGraph} from 'stores';
import { ApolloQueryResult } from "@apollo/client";

const {client} = apolloStore;

class BillingReportLogicTests implements ITestable {
	describeTests = () => {
		describe(`BillingCalculationLogic`, function () {
			this.timeout(60 * 1000);

			const sendBillingRequest = async (startDate: String, endDate: String, userIds = [], applications = ["Simulation"]): Promise<ApolloQueryResult<cg.RunBillingReportQuery>> => {
				if (!userIds?.length) {
					await when(() => !!user.currentUser);
					userIds = [user.currentUser.sub];
				}

				let result = await client.query<cg.RunBillingReportQuery>({
					query: billingGraph.runBillingReport,
					variables: { startDate, endDate, userIds, applications}
				});
				console.log(`sendBillingRequest: ${startDate}~${endDate} / ${userIds} / ${applications} = ${result?.data?.billing?.report?.simulationSummary?.billingJobRows?.length} record`);

				return result;
			};
			
			describe('Basic execute', function () {
				it(`can be run`, async function () {
					if (!user.isLoggedIn) {
						await testScheduler.loginTestUser();
					}
					var q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59");
					expect(q).to.exist;
				});
			});

			describe('should filter simulations being calculated by start date and end date', function () {
				it('should return empty if end date is earlier than simulation start time of any simulations', async function () {
					var q = await sendBillingRequest("2018-03-01T00:00:00", "2018-03-01T23:59:59");
					expect(q.data.billing.report.simulationSummary.billingJobRows.length).to.equal(0);
				});
				it('should return 3 entries if start date is later than simulation start time or deletion time of any simulations', async function () {
					var q = await sendBillingRequest("2018-05-01T00:00:00", "2018-05-01T23:59:59");
					expect(q.data.billing.report.simulationSummary.billingJobRows.length).to.equal(3);
				});
				it('should return 4 entries if start date is later than simulation start time but before deletion time', async function () {
					var q = await sendBillingRequest("2018-04-01T00:00:00", "2018-05-01T23:59:59");
					expect(q.data.billing.report.simulationSummary.billingJobRows.length).to.equal(4);
				});
			});

			describe('should have correct calculation logic', async function () {

				let q;
				it(`should have result`, async function () {
					q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59");
					expect(q).to.exist;
				});
				it(`should have correct value of computation charge`, async function () {
					expect(Math.round(q.data.billing.report.simulationSummary.total.computationCharge * 100) / 100).to.equal(2985.82);
				});
				it(`should have correct value of data serving charge`, async function () {
					expect(Math.round(q.data.billing.report.simulationSummary.total.dataServingCharge * 100) / 100).to.equal(276.23);
				});
				it(`should have correct value of data storage charge`, async function () {
					expect(Math.round(q.data.billing.report.simulationSummary.total.dataStorageCharge * 100) / 100).to.equal(4.31);
				});
				it(`should have correct value of total charge`, async function () {
					expect(Math.round(q.data.billing.report.simulationSummary.total.totalCharge * 100) / 100).to.equal(3266.35)
				})
			});

			describe('should have correct logic of rounding to nearest hour and apply to the correct report', function () {
				it('should round duration up to nearest hour even if it passes report end time', async function(){
					var p1 = sendBillingRequest("2018-03-01T00:00:00", "2018-03-31T23:59:59");
					expect((await p1).data.billing.report.simulationSummary.billingJobRows[0].details[0].totalCPUTime).to.equal(50600);
				})
				it('should not include the interval covered by previous report', async function () {
					var p2 = sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59");
					expect((await p2).data.billing.report.simulationSummary.billingJobRows[0].details[0].totalCPUTime).to.equal(17000);
				})
				it('should have correct value of total CPU time', async function(){
					var p3 = sendBillingRequest("2018-03-01T00:00:00", "2018-04-30T23:59:59");
					expect((await p3).data.billing.report.simulationSummary.billingJobRows[0].details[0].totalCPUTime).to.equal(67600);
				})
			})

			describe(`should also include deleted simulation`, function () {
				it(`deleted simulation should have 0 in ongoingDataStorageCharge`, async function () {
					var p = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59");
					var detailRows = [].concat(...p.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var nonNullDetail = detailRows.filter(x => x.ongoingDataStorageChargePerDay != null);
					expect(nonNullDetail.length).to.equal(3);
					expect(nonNullDetail.filter(x => x.ongoingDataStorageChargePerDay == 0).length).to.equal(1);
				});
			});

			describe('should include query session data serving charge', function () {
				it('should have 4 query session charges if createdTime is earlier than queried end time and endTime is later than queried start time', async function () {
					var q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59");
					var detailRows = [].concat(...q.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var rowsWithQuerySession = detailRows.filter(x => x.chargeType == "Query Data Serving");
					expect(rowsWithQuerySession.length).to.equal(4);
				});
				it('should have 0 query session charges if createdTime is later than queried end time or endTime is earlier than queried start time', async function () {
					var q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-01T23:59:59");
					var detailRows = [].concat(...q.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var rowsWithQuerySession = detailRows.filter(x => x.chargeType == "Query Data Serving");
					expect(rowsWithQuerySession.length).to.equal(0);
				});
				it('should have 2 query sessions charge if createdTime is later than queried end time or endTime is earlier than queried start time', async function () {
					var q = await sendBillingRequest("2018-04-10T00:00:00", "2018-04-10T23:59:59");
					var detailRows = [].concat(...q.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var rowsWithQuerySession = detailRows.filter(x => x.chargeType == "Query Data Serving");
					expect(rowsWithQuerySession.length).to.equal(2);
				});
				it(`should correctly set query session end time if simulation is deleted before scheduled query session end time`, async function () {
					var q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59", ["auth0|5bc4f33847655345115b8b94"]);
					var detailRows = [].concat(...q.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var rowsWithQuerySession = detailRows.filter(x => x.chargeType == "Query Data Serving");
					expect(rowsWithQuerySession.length).to.equal(2);
					var duration = new Date(rowsWithQuerySession[0].finishDateTime).getMinutes() - new Date(rowsWithQuerySession[0].startDateTime).getMinutes();
					expect(new Date(rowsWithQuerySession[0].finishDateTime).getMinutes() - new Date(rowsWithQuerySession[0].startDateTime).getMinutes()).to.equal(5);
					expect(new Date(rowsWithQuerySession[1].finishDateTime).getMinutes() - new Date(rowsWithQuerySession[1].startDateTime).getMinutes()).to.equal(1);
				});
			})

			describe('should include simulation entry even though the user is not being queried when there is a query session for it', function() {
				let q = null;
				it(`should have result`, async function () {
					q = await sendBillingRequest("2018-04-01T00:00:00", "2018-04-30T23:59:59", ["auth0|5bc4f33847655345115b8b94"]);
					expect(q).to.exist;
				});
				it('should have 1 simulation session even though required user does not contain the user of simulation user', async function () {
					expect(q.data.billing.report.simulationSummary.billingJobRows.length).to.equal(1);
				});
				it('should have 0 computation charge and 0 data storage charge in total charge section', async function(){
					expect(q.data.billing.report.simulationSummary.total.computationCharge).to.equal(0);
					expect(q.data.billing.report.simulationSummary.total.dataStorageCharge).to.equal(0);
				})
				it('should have null value for computation charge and data storage charge in detail section', async function(){
					expect(q.data.billing.report.simulationSummary.billingJobRows[0].total.computationCharge).to.be.null;
					expect(q.data.billing.report.simulationSummary.billingJobRows[0].total.dataStorageCharge).to.be.null;
				})
			})

			describe('should filter investment optimization entries', async function() {
				let q = null;
				it(`should have result`, async function () {
					q = await sendBillingRequest("2018-06-01T00:00:00", "2018-06-30T23:59:59", null, ["InvestmentOptimization"]);
					expect(q).to.exist;
				});
				it('should return entries for existing and deleted investment optimizations', async function () {
					expect(q.data.billing.report.simulationSummary.billingJobRows.length).to.equal(2);
				});
				it('should have 3 user session charges', async function () {
					var detailRows = [].concat(...q.data.billing.report.simulationSummary.billingJobRows.map(x => x.details));
					var rowsWithUserSession = detailRows.filter(x => x.chargeType.startsWith("User Session"));
					expect(rowsWithUserSession.length).to.equal(3);
				});
			})

		});
	}
}

testScheduler.register(new BillingReportLogicTests());
