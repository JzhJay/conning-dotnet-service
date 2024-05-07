/// <reference path="../../../../typings/browser.d.ts" />

import {downloadFile, waitCondition} from 'utility';
import {getBaselineCorrelationHeaderRanges, getBaselineCorrelationRotations} from "./correlationTestBaselines";

import {CorrelationTable} from "./correlationTable";
import {api, xhr} from "stores";
import {
	loadValidQueryResults,
	generateAndCompareScreenshot,
	compareComplexObject,
	testScheduler,
	sampleQueries,
	runQueryFromOptions,
	expect,
	enzyme,
	JULIA_TAG,
	verifyDownloadFile,
	sleep,
	enzymeMount, enzymeUnmount
} from "test"

import {QueryResult, queryResultStore, queryStore} from 'stores'


let isPhantomJS = (window as any).top.callPhantom != null;

startTests();

function startTests() {
	for (let q of sampleQueries) {
		if (_.includes(q.availableViews, "correlation")) {
			registerTests(q);
		}
	}
}

function registerTests(queryOptions) {
	describe(`Correlation table(query: ${queryOptions.id})`, function () {
		let result  = null;
		let gridDiv = null;
		let queryResult = null;

		before(async function () {
			this.timeout(5 * 60 * 1000);
			// runs before all tests in this block

			queryResult = await runQueryFromOptions(queryOptions)
			await queryResult.loadMetadata(); // Must load explictly to allow rearranging.
			console.log("Correlation table: metadata loaded");

			await queryResult.arrangement.rearrange(queryOptions.arrangement);
			console.log("Correlation table: queryResult rearranged");

			return new Promise((accept) => {
				let onLoaded = () => {
					gridDiv = result.getDOMNode(0);
					window.setTimeout(() => {
						console.log("loaded");
						accept(result);
					}, 5000)
				}
				result = enzymeMount(<CorrelationTable queryResult={queryResult} onLoaded={onLoaded} />)
			});
		});

		after(async function () {
			this.timeout(10 * 1000);
			await queryStore.deleteQueryDescriptor(queryResult.id);
			enzymeUnmount(result);
		})

		if (isPhantomJS) {
			/*
			it('should match baseline image', function (done) {
				this.timeout(30000);
				generateAndCompareScreenshot(`correlation/${guid}.png`, done)
			})*/
		}
		else {

			/*
			if (getBaselineCorrelationHeaderRanges(guid)) {
				it('should match header ranges', function() {
					compareComplexObject(result.node.headersRanges, getBaselineCorrelationHeaderRanges(guid));
				})
			}

			if (getBaselineCorrelationRotations(guid)) {
				it('should match header rotations', function() {
					compareComplexObject(result.node.rotations, getBaselineCorrelationRotations(guid));
				})
			}*/

			// Verify the golden rules.

			// #1 all grid content (actual correlations) cells are square
			it('should have square cells', function () {
				this.timeout(5000);

				let cells = $(gridDiv).find('div[wj-part=cells]>.wj-cell>div');

				cells.each(function () {
					expect($(this).width()).to.equal($(this).height());
				})
			})

			// #2 No clipping text
			it('should not have any clipped text', function () {
				this.timeout(5000);
				let truncated_count = 0;
				if ($(gridDiv).find('.wj-cell').length < 500) {
					$(gridDiv).find('.wj-cell:not(.rotate-container)>span, .wj-cell:not(.rotate-container)>div').each((i, elem) => {
						if (elem.scrollWidth > elem.clientWidth) {
							truncated_count++;
						}
					});
				}
				expect(truncated_count).to.equal(0);
			})

			// #3 Headers are symmetrical
			// TODO: take this a step further and test that the cells/coordinates have symmetrical width/heights

			it('should have symmetrical headers', function () {

				let rh = $(gridDiv).find('div[wj-part=rh]');
				let ch = $(gridDiv).find('div[wj-part=ch]');

				expect(rh.width() - ch.height()).to.be.at.most(2);

				// Instead of comparing the height of the row headers and the width of the column headers
				// which might be cut due to virtualization, compare the cells part, which has the same
				// real width/height as the row and column headers.
				let cells = $(gridDiv).find('div[wj-part=cells]');
				expect(cells.width() - cells.height()).to.be.at.most(0);
			})

			// #4 Axis labels are horizontal
			it('should have horizontal axis labels', function () {
				let cells = $(result).find('div[wj-part=tl]>.wj-cell>div');

				cells.each(function () {
					expect(this).to.not.have.style('transform', 'rotate(-90deg)')
				})
			})

			// # 5 Correlation cells are right aligned, except for -1 and 1 which is centered.
			it('should have proper cell alignments', function () {

				// Note: Enzyme cannot handle complex CSS selectors, so use jquery
				let cells = $(gridDiv).find('div[wj-part=cells]>.wj-cell>div');

				cells.each(function () {
					if (this.innerHTML === "1" || this.innerHTML === "-1") {
						expect($(this)).to.have.css('justify-content', 'center');
					}
					else
						expect($(this)).to.have.css('justify-content', 'flex-end');
				})
			})

			describe(`correlations file export ${JULIA_TAG}`, function () {
				it(`should be able export csv`, async function(){
					this.timeout(5*1000);
					await downloadFile(xhr.createAuthUrl(queryResult.query.correlationCSVDownloadLinkUrl));
					await verifyDownloadFile(expect, {
						type: 'text/csv',
						fileName: 'Test Query_correlations.csv'
					});
				});

				it(`should be able export xlsx`, async function(){
					this.timeout(5*1000);
					await downloadFile(xhr.createAuthUrl(queryResult.query.correlationXLSXDownloadLinkUrl));
					await verifyDownloadFile(expect, {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						fileName: 'Test Query_correlations.xlsx'
					});
				});
			});
		}
	});
}
