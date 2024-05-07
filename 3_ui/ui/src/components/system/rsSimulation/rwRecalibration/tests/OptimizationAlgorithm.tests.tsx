import {OptimizationAlgorithm} from 'components/system/rsSimulation/rwRecalibration/OptimizationAlgorithm';
import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import * as React from 'react';
import {site} from 'stores';

import {testScheduler, ITestable, sleep, expect, simulateMouseEvent, enzymeUnmount, enzymeMount, get$Container} from 'test';
import { waitCondition } from '../../../../../utility';
import { rsSimulationStore } from '../../../../../stores/rsSimulation';
import { RWRecalibration } from '../../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

const timeouts = {
	load: 60 * 1000,
	render: 100 * 1000,
	test: 30 * 1000,
};

class RecalibrationOptimizationAlgorithmTests implements ITestable {
	describeTests = () => {
		let recalibration: RWRecalibration;
		// let container;
		let result;

		describe('RWRecalibration Optimization Algorithm Tests', async function () {

			let testName;

			before('can render', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				recalibration = await rsSimulationKarmaTool.getRecalibration();

				result = enzymeMount(<OptimizationAlgorithm recalibration={recalibration} />);

				testName = `OA_${Math.round(Math.random()*100000)}`
			});

			after(() => enzymeUnmount(result));

			let add_button;

			it("can render", async function() {
				this.timeout(timeouts.render);

				await waitCondition( () => {
					add_button = result.find(`.OptimizationAlgorithm__dialog-ctrls button`);
					return add_button.length > 0;
				} , null , timeouts.render);

				expect(add_button.first().find('.bp3-button-text').text()).to.eq('Add Optimization Algorithm');

			});

			it("can add items", async function() {
				this.timeout(timeouts.test);
				const beforeItems = result.find(`.OptimizationAlgorithm__item-root`).length;
				add_button.simulate('click');
				await waitCondition( () => !site.busy , null , timeouts.render);
				result.update();
				expect(result.find(`.OptimizationAlgorithm__item-root`).length).to.eq(beforeItems+1);

				add_button.simulate('click');
				await waitCondition( () => !site.busy , null , timeouts.render);
				result.update();
				expect(result.find(`.OptimizationAlgorithm__item-root`).length).to.eq(beforeItems+2);
			});

			async function renameLastItem() {
				this.timeout(timeouts.test);

				const renameButton = result.find(`.OptimizationAlgorithm__item-root .OptimizationAlgorithm__display button`);
				expect(renameButton.length).to.gt(0);
				renameButton.last().simulate('click');
				await sleep(100);

				result.update();
				const renameInput = result.find(`.OptimizationAlgorithm__item-root .OptimizationAlgorithm__item-title-editor input`);
				expect(renameInput.length).to.eq(1);
				renameInput.getDOMNode().value = testName;
				renameInput.simulate('blur');

				await waitCondition( () => !site.busy , null , timeouts.render);
				result.update();
				expect(result.find(`.OptimizationAlgorithm__item-root .OptimizationAlgorithm__item-title input`).length).to.eq(0);
				expect(result.find(`.OptimizationAlgorithm__item-root .OptimizationAlgorithm__display`).last().text().indexOf(testName)).to.eq(0);
			}

			it("can rename when folder", renameLastItem);

			it("can delete when folder", async function() {
				this.timeout(timeouts.test);

				const beforeItems = result.find(`.OptimizationAlgorithm__item-root`).length;
				const removeButton = result.find(`.OptimizationAlgorithm__item-root`).last().find(`.bp3-icon-trash`);
				expect(removeButton.length).to.eq(1);
				removeButton.last().simulate('click');

				await waitCondition( () => !site.busy , null , timeouts.render);
				result.update();
				expect(result.find(`.OptimizationAlgorithm__item-root`).length).to.eq(beforeItems-1);
			});

			it("can open folder", async function() {
				this.timeout(timeouts.test);

				let toggle = result.find(`.OptimizationAlgorithm__item-root`).last().find(`.bp3-icon-chevron-right`);

				expect(toggle.length).to.eq(1);
				toggle.simulate('click');

				result.update();
				toggle = result.find(`.OptimizationAlgorithm__item-root`).last().find(`.bp3-icon-chevron-down`);
				expect(toggle.length).to.eq(1);
			})

			it("can rename", renameLastItem);

			it("can add row", async function() {
				this.timeout(timeouts.test);

				let $testItem = get$Container().find(`.OptimizationAlgorithm__item-root`).last();
				expect($testItem.find('.wj-row').length).to.eq(3);

				let addBtn = result.find('.bp3-navbar-group.bp3-align-right button').first();
				expect(addBtn.length).to.eq(1);
				addBtn.simulate('click');

				await waitCondition( () => !site.busy , null , timeouts.render);
				await sleep(20);
				expect($testItem.find('.wj-row').length).to.eq(4);

			});

			it("can delete", async function() {
				this.timeout(timeouts.test);
				const beforeItems = result.find(`.OptimizationAlgorithm__item-root`).length;
				let menuBtn = result.find('.bp3-navbar-group.bp3-align-right button').last();
				expect(menuBtn.length).to.eq(1);
				menuBtn.simulate('click');

				await sleep(20);
				let menuItem = $('.bp3-portal .bp3-menu-item');
				expect(menuItem.length).to.eq(1);
				expect(menuItem.find('.bp3-fill').text()).to.eq(`Delete Optimization Algorithm '${testName}'`);
				simulateMouseEvent(menuItem[0], 'click');

				await waitCondition( () => !site.busy , null , timeouts.render);
				result.update();
				expect(result.find(`.OptimizationAlgorithm__item-root`).length).to.eq(beforeItems-1);
			});
		});
	}
}

testScheduler.register(new RecalibrationOptimizationAlgorithmTests());