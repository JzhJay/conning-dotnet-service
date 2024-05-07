import {testScheduler, ITestable, JULIA_TAG, verifyDownloadFile, enzymeMount, enzymeUnmount} from "test"
import {cg, omdb, apolloStore, user, utility, IOmdbChangedEvent, IOmdbQueryGraph, fragments, OmdbUserTag, OmdbUserTagValue, OmdbFolder, billingGraph} from 'stores';
import {runQueryFromOptions, sendNativeEventToElement} from '../../../test';
import {reactionToPromise, waitAction, waitCondition} from '../../../utility/utility';
import {BillingReportPage, BillingReportContext} from './index';
import {autorun} from 'mobx';

const enzyme: any = require('enzyme');
const expect: any = chai.expect;

const {client} = apolloStore;

class BillingReportTests implements ITestable {
	describeTests = () => {
		let result = null;

		const timeouts = {
			load: 3 * 60 * 1000,
			run: 30 * 1000
		}

		describe('Billing Report Context', function () {
			it(`Don't sepecify start date and end date`, function () {
				const context = new BillingReportContext();
				const today = new Date();
				var oneWeekAgo = new Date(today);
				oneWeekAgo.setDate(today.getDate() - 6);

				expect(context.startDate.toDateString()).to.equal(oneWeekAgo.toDateString());
				expect(context.endDate.toDateString()).to.equal(today.toDateString());
			});

			it(`Specify end date`, function () {
				const yesterday = new Date(new Date().getTime() - 86400000);
				var oneWeekAgo = new Date(yesterday);
				oneWeekAgo.setDate(yesterday.getDate() - 6);
				const context = new BillingReportContext({ initEndDate: yesterday });

				expect(context.startDate.toDateString()).to.equal(oneWeekAgo.toDateString());
				expect(context.endDate).to.equal(yesterday);
			});

			it(`Specify start date and end date`, function () {
				const yesterday = new Date(new Date().getTime() - 86400000);
				const beforeYesterday = new Date(yesterday.getTime() - 86400000);
				const context = new BillingReportContext({ initStartDate: beforeYesterday, initEndDate: yesterday });

				expect(context.startDate).to.equal(beforeYesterday);
				expect(context.endDate).to.equal(yesterday);
			});
		});

		describe(`Billing Reports`, function () {
			before(async function () {
				this.timeout(timeouts.load);

				return new Promise((accept, reject) => {
					// set end date to yesterday since default end date (today) will query some mock data created by IO test cases and cause error
					const initEndDate = new Date(new Date().getTime() - 86400000);
					result = enzymeMount(<BillingReportPage initEndDate={initEndDate}></BillingReportPage>)

					autorun(() => {
						if (result.instance().loading == false) {
							setTimeout(accept, 5000);
						}
					})
				});
			});

			after(() => enzymeUnmount(result));

			const getEnzymeContainer = (update:boolean=true) => {
				if (update)
					result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
				return result
			};

			it(`should render with correct cells`, async function () {
				const total: any = $(result.getDOMNode()).find('.BillingReportPage__total').get(0).children[0];
				expect(total.innerText.trim()).to.equal("6,727.64", "Total entry should match");

				// Verify that charges have 2 decimal places while rates have 4.
				const simulationTotal: any = $(result.getDOMNode()).find('.BillingReportPage__simulationTotal').get(0);
				expect(simulationTotal.children[0].innerText.trim()).to.equal("0.89", "Simulation total entry should match");
				expect(simulationTotal.children[simulationTotal.children.length - 1].innerText.trim()).to.equal("0.1271", "Simulation data storage charge per day entry should match");
			});

			it(`should be able to toggle expand of simulation rows`, async function () {
				const toggleExpand = () => {
					const button = getEnzymeContainer().find('.BillingReportPage__action').first();
					button.simulate('click');
				}

				const detailsRowCount = () => $(result.getDOMNode()).find("tbody tr:not(.BillingReportPage__simulationTotal)tr:not(.BillingReportPage__total)").length;

				toggleExpand();
				expect(detailsRowCount()).to.equal(1);

				toggleExpand();
				expect(detailsRowCount()).to.equal(0);
			});

			it(`should be able to expand/collapse all`, async function () {
				getEnzymeContainer().find('.bp3-align-right .bp3-button').at(1).simulate('click');
				expect($("tr").length).to.equal(11);

				getEnzymeContainer().find('.bp3-align-right .bp3-button').first().simulate('click');
				expect($("tr").length).to.equal(6);
			});

			it(`should be able to sort fields`, async function () {
				getEnzymeContainer().find('th').first().simulate('click');
				console.log(Array.from($("tr td:first-child")).map((r) => r.innerText.trim()));
				expect(Array.from($("tr td:first-child")).map((r) => r.innerText.trim())).to.deep.equal(["6,727.64", "0.15", "0.89", "0.89", "6,725.71"]);
			});

			it(`should be able to run a query`, async function () {
				this.timeout(timeouts.run);

				const inputs = result.find('.BillingReportPage__toolbar input');
				const startDate = inputs.at(0);
				const endDate = inputs.at(1);

				startDate.getDOMNode().value = "4/1/2018";
				startDate.simulate('change');

				endDate.getDOMNode().value = "4/2/2018";
				endDate.simulate('change');

				const runReport = result.find('.BillingReportPage__toolbar .bp3-button').at(0);
				runReport.simulate('click');

				await reactionToPromise(() => result.instance().loading, false);

				const total: any = $(result.getDOMNode()).find('.BillingReportPage__total td').get(0);

				expect(total.innerText.trim()).to.equal("1,322.02", "Total entry should match");
			});

			it('should be able export csv file', async function () {
				this.timeout(timeouts.run);
				result.update();
				result.find('.bp3-button').last().simulate('click');

				await waitCondition(() => $('.bp3-popover').length == 1);

				let downloadTrigger = $('.bp3-popover .bp3-menu-item').filter((i,elem) => $(elem).text() == 'Download CSV');

				sendNativeEventToElement(downloadTrigger[0], 'click');

				await verifyDownloadFile(expect, {
					fileName: `"04/01/2018 00:00:00_04/02/2018 23:59:59_bill.csv"; filename*=UTF-8\'\'04%2F01%2F2018%2000%3A00%3A00_04%2F02%2F2018%2023%3A59%3A59_bill.csv`
				});
			});

			it('should be able export xlsx file', async function () {
				this.timeout(timeouts.run);
				result.update();
				result.find('.bp3-button').last().simulate('click');

				await waitCondition(() => $('.bp3-popover').length == 1);

				let downloadTrigger = $('.bp3-popover .bp3-menu-item').filter((i,elem) => $(elem).text() == 'Download XLSX');

				sendNativeEventToElement(downloadTrigger[0], 'click');

				await verifyDownloadFile(expect, {
					fileName: `"04/01/2018 00:00:00_04/02/2018 23:59:59_bill.xlsx"; filename*=UTF-8\'\'04%2F01%2F2018%2000%3A00%3A00_04%2F02%2F2018%2023%3A59%3A59_bill.xlsx`
				});
			});

		})
	}
}

testScheduler.register(new BillingReportTests());
