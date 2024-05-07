import {ModelChartingResult} from 'components/system/rsSimulation/rwRecalibration/ModelChart';
import {ModelSettings} from 'components/system/rsSimulation/rwRecalibration/ModelSettings';
import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import {runCommonChartTests} from 'components/system/highcharts/tests';
import * as React from 'react';
import {RWRecalibration} from 'stores/rsSimulation/rwRecalibration/RWRecalibration';
import {testScheduler, ITestable, expect, enzyme, sendNativeEventToElement, sleep, enzymeUnmount, enzymeMount, get$Container} from "test"
import {formatLabelText, waitCondition} from 'utility';

const timeouts = {
	load: 180 * 1000,
	render: 10 * 1000,
	delete: 10 * 1000,
	test: 30 * 1000,
}

class RecalibrationModelChart implements ITestable {

	describeTests = () => {

		const SWITCH_X_AXIS_TO = "Tenor";
		const CHANGE_AXIS_WAIT = 1000;

		let recalibration: RWRecalibration;
		let result;

		const getChartWrapper= (update:boolean=false) => {
			if (update)
				result.update();
			return result.find('.highchartsComponent__highchartsComponent.rsSimulationRecalibration');
		};

		const getChartOptionWrapper= (update:boolean=false) => {
			if (update)
				result.update();
			return result.find('.InputSpecificationComponent__control');
		};

		describe(`RSSimulation RWRecalibration chart Component Tests`, async function () {

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				recalibration = await rsSimulationKarmaTool.getRecalibration();
				await rsSimulationKarmaTool.resetRecalibrationAxisOrganization(recalibration, { economy: 'us', model: 'nominal_term_structure'});
				setDummyData();

				result = enzymeMount(<ModelSettings recalibration={recalibration} />);
			})

			after(() => enzymeUnmount(result));

			it("can load chart", async function() {
				this.timeout(timeouts.load);
				await waitCondition( () => {
					return getChartWrapper(true).length > 0;
				})
				expect(getChartWrapper().length).to.gte(1);
			})

			it("can load chart advance options", async function() {
				this.timeout(timeouts.load);
				result.update();
				let btns = result.find('.ModelSettings__header .bp3-button');
				expect(btns.length).to.eq(2);
				// btns.last().simulate('click'); //update:2023-12 the advance options opened by default

				await waitCondition( () => {
					return getChartOptionWrapper(true).length > 0;
				});
				expect(getChartOptionWrapper().length).to.gte(2);
			})

			const getOptionControl = (expectTitle) => {
				const optionWrapper = getChartOptionWrapper(true).filterWhere(wrapper => {
					let $titleNode = $(wrapper.getDOMNode()).prevAll('.InputSpecificationComponent__title');
					if (!$titleNode.length) {
						return false;
					}
					let title = $titleNode.text().replace(/:$/, '');
					return title == expectTitle;
				});
				expect(optionWrapper.length).to.eq(1);
				return optionWrapper;
			}

			const verifyOptions = (wrapper, text, status) => {
				const $node = $(wrapper.getDOMNode())
				expect($node.find('.InputSpecificationComponent__checkbox-label').text()).to.eq(text, `option "${text}" should exist`);
				expect(($node.find('input')[0] as any).checked).to.eq(status, `the status of option "${text}" should be ${status}`);
			}

			const verifyLegends = (expectList) => {
				let chartLegendList = [];
				get$Container().find('.highcharts-legend-item text').each((i,elem) => chartLegendList.push($(elem).text()));
				console.log(chartLegendList);
				expect(chartLegendList).to.deep.eq(expectList, `${JSON.stringify(chartLegendList)} =/= ${JSON.stringify(expectList)}`);
			}

			it("verify x axis information", async function(){
				const optionControl = getOptionControl(formatLabelText(ModelChartingResult.USER_INPUT_X_AXIS_KEY));
				let option_axis = optionControl.text();
				const chart_axis = $('.highcharts-xaxis .highcharts-axis-title').text();
				expect(option_axis.indexOf(chart_axis) > 0).to.eq(true);
			});

			it("verify series grouping", async function(){
				const optionControl = getOptionControl(formatLabelText(ModelChartingResult.USER_INPUT_SERIES_KEY));
				let option_axes = optionControl.find('.InputSpecificationComponent__input-wrapper');
				expect(option_axes.length).to.eq(3);

				verifyOptions(option_axes.at(0), "None", false);
				verifyOptions(option_axes.at(1), "State", true);
				verifyOptions(option_axes.at(2), "Horizon", true);
				verifyLegends([
					"Target",
					"Previous",
					"Current",
					"State: FutureDynamics, Horizon: 1m",
					"State: FutureDynamics, Horizon: 2m",
					"State: InitialCondition, Horizon: 1m",
					"State: InitialCondition, Horizon: 2m"
				]);
			})

			it(`can switch x axis to ${SWITCH_X_AXIS_TO}`, async function(){
				this.timeout(this.timeout() + CHANGE_AXIS_WAIT);

				const optionControl = getOptionControl(formatLabelText(ModelChartingResult.USER_INPUT_X_AXIS_KEY));

				optionControl.find('.bp3-popover-target').first().simulate('click');
				let bp3_select_popover;
				await waitCondition(() => {
					bp3_select_popover = $('.bp3-portal .bp3-select-popover');
					return bp3_select_popover.length > 0;
				})

				const item = bp3_select_popover.find('.bp3-menu-item').filter((i,elem) => {
					return $(elem).text() == SWITCH_X_AXIS_TO;
				});

				await waitCondition(() => {
					sendNativeEventToElement(item.get(0), 'click');
					return $('.bp3-portal .bp3-select-popover').length == 0;
				});

				let option_axis, chart_axis;

				await waitCondition(() => {
					option_axis = optionControl.text();
					return option_axis.indexOf(SWITCH_X_AXIS_TO) > 0;
				});
				expect(option_axis.indexOf(SWITCH_X_AXIS_TO) > 0).to.eq(true);

				await waitCondition(() => {
					chart_axis = $('.highcharts-xaxis .highcharts-axis-title').text();
					return !!chart_axis;
				});
				expect(chart_axis).to.eq(SWITCH_X_AXIS_TO);

				await sleep(CHANGE_AXIS_WAIT);
			});

			const clickOption = (wrapper) => {
				const $toggleButton = $(wrapper.getDOMNode()).find('.bp3-control-indicator');
				console.log($toggleButton);
				sendNativeEventToElement($toggleButton.get(0), 'click');
			}

			it("can switch series grouping", async function(){
				this.timeout(this.timeout() + (CHANGE_AXIS_WAIT * 3));

				const optionControl = getOptionControl(formatLabelText(ModelChartingResult.USER_INPUT_SERIES_KEY));
				let option_axes = optionControl.find('.InputSpecificationComponent__input-wrapper');
				expect(option_axes.length).to.eq(3);

				// verify values after x axis changed.
				verifyOptions(option_axes.at(0), "None", false);
				verifyOptions(option_axes.at(1), "State", true);
				verifyOptions(option_axes.at(2), "Horizon", true);
				verifyLegends([
					"Target",
					"Previous",
					"Current",
					"State: FutureDynamics, Horizon: 1m",
					"State: FutureDynamics, Horizon: 2m",
					"State: InitialCondition, Horizon: 1m",
					"State: InitialCondition, Horizon: 2m"
				]);


				clickOption(option_axes.at(1));
				await sleep(CHANGE_AXIS_WAIT);
				verifyOptions(option_axes.at(0), "None", false);
				verifyOptions(option_axes.at(1), "State", false);
				verifyOptions(option_axes.at(2), "Horizon", true);
				verifyLegends([
					"Target",
					"Previous",
					"Current",
					"Horizon: 1m",
					"Horizon: 2m"
				]);

				clickOption(option_axes.at(2));
				await sleep(CHANGE_AXIS_WAIT);
				verifyOptions(option_axes.at(0), "None", true);
				verifyOptions(option_axes.at(1), "State", false);
				verifyOptions(option_axes.at(2), "Horizon", false);
				verifyLegends([
					'Previous',
					'Current',
					'Target'
				]);

				clickOption(option_axes.at(0));
				await sleep(CHANGE_AXIS_WAIT);
				verifyOptions(option_axes.at(0), "None", false);
				verifyOptions(option_axes.at(1), "State", true);
				verifyOptions(option_axes.at(2), "Horizon", true);
				verifyLegends([
					"Target",
					"Previous",
					"Current",
					"State: FutureDynamics, Horizon: 1m",
					"State: FutureDynamics, Horizon: 2m",
					"State: InitialCondition, Horizon: 1m",
					"State: InitialCondition, Horizon: 2m"
				]);
			});
			runCommonChartTests(getChartWrapper, expect, true, 'Recalibration');
		})

		function setDummyData() {
			if (!recalibration) { return; }
			const dataset = Object.values(recalibration.datasets)[0];
			dataset?.table?.splice(0, dataset.table.length, ...[
				{
					"id": "5c5d6847-8e65-4889-883d-7799283bdf33",
					"economy": "US",
					"model": "Real_Term_Structure_And_Inflation",
					"state": "FutureDynamics",
					"rating": "Risk_Free",
					"index": "3",
					"tenor": 2,
					"horizon": 1,
					"measure": "Real_Yield",
					"statistic": "Starting_Value",
					"weight": 0.0,
					"valueBasedOnPreviousParameters": 1.55,
					"valueBasedOnCurrentParameters": 0.35,
					"targetValue": 6.5,
					"simulatedValue": 0.0
				},
				{
					"id": "616ca964-f3c5-43c4-8a3b-a5fb016d01b3",
					"economy": "US",
					"model": "Real_Term_Structure_And_Inflation",
					"state": "FutureDynamics",
					"rating": "Risk_Free",
					"index": "4",
					"tenor": 2,
					"horizon": 2,
					"measure": "Real_Yield",
					"statistic": "Starting_Value",
					"weight": 0.0,
					"valueBasedOnPreviousParameters": 1.66,
					"valueBasedOnCurrentParameters": 0.75,
					"targetValue": 7.1,
					"simulatedValue": 0.0
				},
				{
					"id": "877f2032-74b6-48df-9908-02801e37e68f",
					"economy": "US",
					"model": "Real_Term_Structure_And_Inflation",
					"state": "InitialCondition",
					"rating": "Risk_Free",
					"index": "1",
					"tenor": 1,
					"horizon": 1,
					"measure": "Real_Yield",
					"statistic": "Starting_Value",
					"weight": 0.0,
					"valueBasedOnPreviousParameters": 0.44,
					"valueBasedOnCurrentParameters": 0.66,
					"targetValue": 5.8,
					"simulatedValue": 0.0
				},
				{
					"id": "7a3e6689-baa4-4b76-a8e4-c7c76ce54e41",
					"economy": "US",
					"model": "Real_Term_Structure_And_Inflation",
					"state": "InitialCondition",
					"rating": "Risk_Free",
					"index": "2",
					"tenor": 1,
					"horizon": 2,
					"measure": "Real_Yield",
					"statistic": "Starting_Value",
					"weight": 0.0,
					"valueBasedOnPreviousParameters": 0.33,
					"valueBasedOnCurrentParameters": 0.56,
					"targetValue": 8.7,
					"simulatedValue": 0.0
				}
			]);
		}
	}
}

testScheduler.register(new RecalibrationModelChart());
