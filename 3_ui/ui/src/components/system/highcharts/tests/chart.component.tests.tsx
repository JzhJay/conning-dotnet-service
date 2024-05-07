/// <reference path="../../../../../typings/browser.d.ts" />

import {IO} from 'stores';
import {waitCondition} from 'utility';
import {HighchartsComponent} from "../highchartsComponent";
import {enzymeMount, enzymeUnmount, get$Container, runQueryFromOptions, sampleQueries, sleep} from 'test'
import {runCDFTests, runPDFTests, runPercentileChartTests, runCommonChartTests, runSensitivityTests, runHistogramTests, runScatterTests} from "./index"

import {queryResultStore as queryResultStore} from 'stores/queryResult';
import {queryStore as store, Query} from 'stores/query';
import {runLineTests} from "./lineChartTests";
import {runBarTests} from "./barChartTests";
import {runPointTests} from "./pointChartTests";
import { testPersistence } from "./commonTests";
import { runBeeswarmTests } from "./beeswarmChartTests";

require("lib/semantic/dist/semantic.min.js");
require("lib/Iconic/js/iconic.min.js");

//require("lib/semantic/dist/semantic.css");
//require("ui/fonts/font-awesome/css/font-awesome.min.css");;

const enzyme: any = require('enzyme');
const expect: any = chai.expect;

const isPhantomJS = (window as any).top.callPhantom != null;

startTests();

class ChartWrapper extends React.Component<any, { metadata: any }> {
	userOptions;

	onUserOptionsUpdated = (newUserOptions) => {
		this.userOptions = newUserOptions;
		this.forceUpdate();
	}

	render() {
		const {guid, chartType, onChartLoaded, queryResult} = this.props;

		let userOptions = null;
		if (chartType == "beeswarm")
		{
			userOptions = queryResult.userOptions && queryResult.userOptions["beeswarm"] ? queryResult.userOptions["beeswarm"] : queryResultStore.charting.defaultUserOptions(chartType)
			userOptions.highchartsOptions = _.merge({}, userOptions.highchartsOptions, {yAxis:[{labels: {enabled: true}}]});
			//userOptions = {[chartType]:userOptions};
		}

		return (
			<HighchartsComponent chartingResult={queryResult}
			                     guid={queryResult.id}
			                     chartType={chartType}
			                     inlineToolbar={true}
			                     onLoaded={onChartLoaded}
			                     userOptions={userOptions}
			                     onUserOptionsUpdated={this.onUserOptionsUpdated}
			/>
		);
	}
};

let queriesCache = {};
function startTests() {

	describe('Chart', function() {
		after(function () {
			this.timeout(10 * 1000);
			//Delete queries

			for (let key in queriesCache) {
				let result = queryResultStore.loadedResults.get(queriesCache[key].id);
				if (result){
					store.getQuery(result.descriptor.id).then(
						(query:Query) => query.delete(true)
					);
				};
				queryResultStore.delete(result.id);
			}
		})

		for (let q of sampleQueries) {
			if (q.disabled === true)
				continue;

			["cdf", "cone", "box", "pdf", "histogram", "scatter", "line", "bar", "beeswarm"].forEach((chartType) => {
				if (_.includes(q.availableViews, chartType)) {
					registerTests(q, chartType);
				}
				else {
					//console.log(results[i].id + " does not support cdf chart");
				}
			})
		}
	})
}

function registerTests(queryOptions, chartType) {
	describe(`${chartType} chart (query: ${queryOptions.id})`, function () {
		let result = null;

		function cleanChart() {
			enzymeUnmount(result);
		}

		before(async function () {
			this.timeout(10 * 60 * 1000);

			console.log(`${chartType} chart (query: ${queryOptions.id}): starting...`);
			console.time(`${chartType} chart (query: ${queryOptions.id})`);

			try {
				let queryResult;

				if (queriesCache[queryOptions.id]) {
					queryResult = queriesCache[queryOptions.id];
					console.log(`(query: ${queryOptions.id}): Query load from cache`);
				} else {
					let tryTimes = 0;
					while (!queryResult) {
						try {
							queryResult = await runQueryFromOptions(queryOptions);
							console.log(`(query: ${queryOptions.id}): created`);

							await queryResult.loadMetadata(); // Must load explictly to allow rearranging.
							console.log(`(query: ${queryOptions.id}): metadata loaded`);

							queriesCache[queryOptions.id] = queryResult;
						} catch (e) {
							console.log(e);
							if( ++tryTimes >= 5) {
								throw new Error(`(query: ${queryOptions.id}): can not create Query.`)
							}
							await sleep(15 * 1000);
						}
					}
					console.log(`(query: ${queryOptions.id}): Query created, times: ${tryTimes}`);
				}

				await queryResult.arrangement.rearrange(queryOptions.arrangement);
				console.log(`${chartType} chart (query: ${queryOptions.id}): queryResult rearranged`);

				await renderChart(queryResult, chartType);

			} finally {
				console.timeEnd(`${chartType} chart (query: ${queryOptions.id})`);
			}
		});

		after(function () {
			cleanChart();
		})

		const renderChart = (qr, chartType) => {
			cleanChart();

			return new Promise((accept, reject) => {
				let onChartLoaded = () => {
					// Chart isn't fully loaded till all the post load operations are complete. These post load operations should ideally be applied
					// to the chart during template creation.
					// Note: Might be safer to busy check for spinners?
					window.setTimeout(() => {
						console.log("chart loaded");
						accept(result);
					}, 5000)
				}

				//console.log("mounting chart");
				result = enzymeMount(<ChartWrapper
					queryResult={qr}
					chartType={chartType}
					onChartLoaded={onChartLoaded} />)
			})
		}

		const getEnzymeContainer = (update:boolean=false) => {
			if (update)
				result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
			return result
		};
		const getTestContainer   = () => get$Container().get(0);

		// Only run for first query to speed up test time
		if (!isPhantomJS && queryOptions.id == 0) {
			runCommonChartTests(getEnzymeContainer, expect, chartType != "beeswarm", chartType);
		}

		switch (chartType) {
			case "cdf":
				runCDFTests(getEnzymeContainer, isPhantomJS, expect);
				break;
			case "cone":
			case "box":
				runPercentileChartTests(getEnzymeContainer, chartType, queryOptions.arrangement.columnAxes.length > 1, queryOptions.arrangement.rowAxes.length == 1, isPhantomJS, expect);
				break;
			case "pdf":
				runPDFTests(getEnzymeContainer, queryOptions.arrangement.columnAxes.length == 0, isPhantomJS, expect);
				break;
			case "histogram" :
				runHistogramTests(getEnzymeContainer, queryOptions.arrangement.columnAxes.length == 0, isPhantomJS, expect);
				break;
			case "scatter":
				runScatterTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect);
				runPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect);
				break;
			case "line":
				runLineTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect);
				runPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect);
				break;
			case "bar":
				runBarTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect);
				break;
			case "beeswarm":
				runBeeswarmTests(getTestContainer, getEnzymeContainer, queryOptions.arrangement.columnAxes.length > 1, isPhantomJS, expect);
				break;
		}

		// Test last since it requires the chart to be reloaded.
		// Only test the first query to avoid needlessly slowing down test runs
		if (queryOptions.id == 0) {
			runSensitivityTests(getEnzymeContainer, expect, chartType);
			if (chartType == "scatter" || chartType == "pdf") {
				testPersistence(getEnzymeContainer, expect, renderChart, chartType);
			}
		}
	});
}