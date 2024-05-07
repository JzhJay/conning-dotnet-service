/// <reference path="../../../../../typings/browser.d.ts" />
import {getReturnOutputsData} from 'components/system/highcharts/mockData/io.mock';
import {runAssetClassesReturnsChartTests} from 'components/system/highcharts/tests/assetClassesReturnsChartTests';
import {runAssetClassesReturnsTableTests} from 'components/system/highcharts/tests/assetClassesReturnsTableTests';
import {runDirectionalConstraintTests} from 'components/system/highcharts/tests/directionalConstraintChartTests';

import {AssetClassesReturnsTableView} from 'components/system/IO/internal/AssetClassesReturnsTableView';
import {DirectionalConstraintView} from 'components/system/IO/internal/DirectionalConstraintView';
import {HighchartsComponent} from "../highchartsComponent";
import {DominanceView} from '../../IO/internal/DominanceView';
import {StrategySummaryView} from '../../IO/internal/StrategySummaryView';
import EvaluationComparisonView from '../../IO/internal/evaluationComparison/EvaluationComparisonView';
import {runCommonChartTests} from "./index"
import * as css from '../../IO/IOComponent.css';
import {testScheduler, ITestable, enzymeMount, enzymeUnmount, get$Container} from 'test'
import {IO, ioStore, ioTestData} from 'stores/io';
import {runStatusTests} from './statusChartTests';
import {runAssetAllocationChartTests} from './assetAllocationChartTests';
import {runEfficientFrontierTests} from './efficientFrontierChartTests';
import {runPathWiseDominanceTests} from './pathWiseDominanceChartTests';
import {runStatisticalDominanceTests} from './statisticalDominanceChartTests';
import {runStrategySummaryChartTests} from './strategySummaryChartTests';
import {runEvaluationComparisonChartTests} from './evaluationComparisonChartTests';
import {reactionToPromise} from "utility";
import {observer} from 'mobx-react';

require("lib/semantic/dist/semantic.min.js");
require("lib/Iconic/js/iconic.min.js");

//require("lib/semantic/dist/semantic.css");
//require("ui/fonts/font-awesome/css/font-awesome.min.css");;

const enzyme: any = require('enzyme');
const expect: any = chai.expect;

const isPhantomJS = (window as any).top.callPhantom != null;

@observer
class ChartWrapper extends React.Component<any, { metadata: any }> {
	userOptions;

	onUserOptionsUpdated = (newUserOptions) => {
		this.userOptions = newUserOptions;
		this.forceUpdate();
	}

	render() {
		const { guid, chartType, onChartLoaded, chartingResult, key} = this.props;
		const page = chartingResult.currentPage;
		const view = page.selectedViews.find(v => v.name == chartType);

		switch (chartType){
			case "efficientFrontier":
			case "ioBox":
			case "status":
			case "assetAllocation":
			case "assetClassesReturnsChart":
				return (
					<HighchartsComponent chartingResult={chartingResult}
					                     page={page}
										 guid={guid}
										 className={css.viewComponent}
										 chartType={chartType}
										 key = {key}
					                     id={view.id}
										 userOptions={page.getViewUserOptions(view.id)}
					                     inlineToolbar={true}
					                     onLoaded={onChartLoaded}
															 onUserOptionsUpdated={userOptions => {page.updateUserOptions(view.id, userOptions); this.onUserOptionsUpdated}}>
															 </HighchartsComponent>
				);

			// case "input":
			// 	viewComponent = <IOInput io={chartingResult}/>
			// 	break;
			case "pathWiseDominance":
			case "statisticalDominance":
				onChartLoaded(); // TODO: No idea how to properly hook this up
				return (<DominanceView io={chartingResult} view={view} page={page} viewLabel={ioStore.views[chartType].label} userOptions={page.getViewUserOptions(view.id)}/>);
			case "strategySummary":
				onChartLoaded();
				return (<StrategySummaryView io={chartingResult} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>);
			case "evaluationComparison":
				onChartLoaded();
				return (<EvaluationComparisonView io={chartingResult} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>);
			case 'assetClassesReturnsTable':
				onChartLoaded();
				return (<AssetClassesReturnsTableView io={chartingResult} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>);
			case 'directionalConstraint':
				onChartLoaded();
				return (<DirectionalConstraintView io={chartingResult} view={view} page={page} userOptions={page.getViewUserOptions(view.id)}/>);

			default:
				return (<span>{chartType}</span>);
		}
	}
};

class IOChartComponentTest implements ITestable {
	describeTests = () => {
		describe('IOChart', function () {
			this.timeout(100 * 1000);

			after(function (done) {
				this.timeout(10 * 1000);
				done();
			})

			// [/*"status", */"assetAllocation"].forEach((chartType) => {
			registerTests("status");
			registerTests("assetAllocation");
			//registerTests("efficientFrontier");
			//registerTests("pathWiseDominance");
			//registerTests("statisticalDominance");
			registerTests("strategySummary");
			registerTests('evaluationComparison');
			registerTests('assetClassesReturnsChart');
			registerTests('assetClassesReturnsTable');
			registerTests('directionalConstraint');
			// })
		})
	}
}

function registerTests(chartType) {
	describe(`${chartType} chart`, function () {
		let io:IO = null;
		let result = null;

		before(async function() {
			this.timeout(10 * 60 * 1000);
			io = await ioTestData.loadTestData(ioTestData.testIo.chartId, {
				optimizationInputs: {
					additionalAllocations: [{
						name: 'Untitled',
						group: '',
						color: ''
					}]
				},
				returnOutputs: getReturnOutputsData()
			});

			let originalControlFlag = Object.assign({}, io.controlFlags);
			if(io.currentPage.selectedViews.findIndex(v => v.name == chartType) == -1){
				let targetUpdateCount = io.updateCount;
				console.log("registerTests: before toggleViewSelection");
				await io.currentPage.toggleViewSelection(chartType);
				console.log("registerTests: after toggleViewSelection");
				let newControlFlag = io.controlFlags;
				if(JSON.stringify(originalControlFlag) != JSON.stringify(newControlFlag)){
					targetUpdateCount += 1;
				}

				if (io.updateCount < targetUpdateCount) {
					console.log(`Before reactionToPromise in loadChartData ${io.updateCount} ${targetUpdateCount}`)
					await reactionToPromise(() => io.updateCount >= targetUpdateCount, true)
				}
			}
			console.log("Before return renderChart");
			await renderChart(io, chartType);
		});

		after(() => enzymeUnmount(result));

		const renderChart = (io:IO, chartType:string) => {

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
				result = enzymeMount(<ChartWrapper chartingResult={io}
													chartType={chartType}
													guid = {io.id}
													key = {chartType}
				                                    onChartLoaded={onChartLoaded} />)
			})
		}

		const getEnzymeContainer = (update:boolean=false) => {
			if (update)
				result.update(); // Enzyme 3 doesn't correctly update the render tree after certain operation, so lets force it to update.
			return result
		};
		const getTestContainer   = () => get$Container().get(0);

		const getIo = () => io;
		// Only run for first query to speed up test time
		if (!_.includes(["pathWiseDominance", "statisticalDominance", "strategySummary", "evaluationComparison", "assetClassesReturnsTable", "directionalConstraint"], chartType)) {
			runCommonChartTests(getEnzymeContainer, expect, true, chartType);
		}

		switch (chartType) {
			case "status":
				runStatusTests(io, expect);
				break;
			case "assetAllocation":
				runAssetAllocationChartTests(expect);
				break;
			case "efficientFrontier":
				runEfficientFrontierTests(getEnzymeContainer, getIo, expect);
				break;
			case "pathWiseDominance":
				runPathWiseDominanceTests(getEnzymeContainer, getIo, expect);
				break;
			case "statisticalDominance":
				runStatisticalDominanceTests(getEnzymeContainer, getIo, expect);
				break;
			case "strategySummary":
				runStrategySummaryChartTests(expect, getIo);
				break;
			case 'evaluationComparison':
				runEvaluationComparisonChartTests(getEnzymeContainer, getIo, expect);
				break;
			case "assetClassesReturnsChart":
				runAssetClassesReturnsChartTests(expect);
				break;
			case "assetClassesReturnsTable":
				runAssetClassesReturnsTableTests(expect);
				break;

			case "directionalConstraint":
				runDirectionalConstraintTests(expect);
				break;
		}

		// Test last since it requires the chart to be reloaded.
		// Only test the first query to avoid needlessly slowing down test runs
		// if (queryOptions.id == 0 && (chartType == "scatter" || chartType == "pdf"))
		// 	testPersistence(getEnzymeContainer, expect, renderChart, chartType);
	})


}



testScheduler.register(new IOChartComponentTest());
