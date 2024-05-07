import {rsSimulationKarmaTool} from 'components/system/rsSimulation/tests/RSSimulationKarmaTool';
import {toJS, when} from 'mobx';
import * as React from 'react';
import { CombinatorialAddRows } from '../CombinatorialAddRows';
import * as css from '../CombinatorialAddRows.css';
import {testScheduler, ITestable, expect, enzyme, simulateEnterKeyEvent, simulateMouseEvent, enzymeMount, get$Container, enzymeUnmount} from 'test';
import { waitCondition } from '../../../../../utility';
import { RWRecalibration } from '../../../../../stores/rsSimulation/rwRecalibration/RWRecalibration';

const timeouts = {
	load: 60 * 1000,
	render: 100 * 1000,
	test: 30 * 1000
};

class RecalibrationCombinatorialAddRowsTests implements ITestable {
	describeTests = () => {
		let recalibration: RWRecalibration;
		let container;
		let result;
		let tableDataSet;

		describe('RWRecalibration Combinatorial Add Rows Tests', async function () {

			function get$ElementByContent(selector, content) {
				return $(selector).filter((i, elem) => $(elem).text() == `${content}`);
			}

			function getColumnInput(columnName) {
				return get$ElementByContent(`.${css.inputLabel}`, columnName).next(`.${css.inputElement}`).find('input');
			}

			function getColumnLabel(columnName) {
				return get$ElementByContent(`.${css.inputLabel}`, columnName).next(`.${css.inputElement}`).find('span');
			}

			function getRecentlyUsedButton(columnName) {
				return get$ElementByContent(`.${css.inputLabel}`, columnName).next(`.${css.inputElement}`).find('span.bp3-icon-caret-down');
			}

			function getColumnTags(columnName) {
				return get$ElementByContent(`.${css.inputLabel}`, columnName).next(`.${css.inputElement}`).find('.bp3-tag');
			}

			async function removeAllTags() {
				await waitCondition(() => $('.bp3-menu').length > 0);
				_.forEach($('.bp3-menu').last().find('.bp3-icon-tick').closest('.bp3-menu-item'), elem => simulateMouseEvent(elem, 'click'));
			}

			async function clickTag(tagName) {
				let selector = `.bp3-menu .bp3-menu-item .bp3-fill`
				await waitCondition(() => get$ElementByContent(selector, tagName).length === 1);
				simulateMouseEvent(get$ElementByContent(selector, tagName)[0], 'click');
			}

			function simulateKeyInputAndEnterKey($element, value) {
				$element.val(value)
				simulateEnterKeyEvent($element[0]);
			}

			async function checkTagContainsText($elements, length, text) {
				await waitCondition(() => $elements.length === length);
				expect($elements).to.have.lengthOf(length);
				expect($elements.filter(function(index, element) {
					return $(element).text().toLowerCase().indexOf(text.toLowerCase()) >= 0;
				})).to.have.lengthOf(1);
			}

			before('', async function () {
				this.timeout(rsSimulationKarmaTool.loadTimeout);
				recalibration = await rsSimulationKarmaTool.getRecalibration();
			})

			after(() => enzymeUnmount(result));

			it("Data prepared", async function() {
				this.timeout(timeouts.load);
				await rsSimulationKarmaTool.resetRecalibrationAxisOrganization(recalibration, { economy: 'us', model: 'nominal_term_structure'});

				expect(recalibration.datasets?.length).to.eq(1);
				tableDataSet = recalibration.datasets[0];
				const rows = tableDataSet.table || [];
				if (rows.length > 0) {
					await recalibration.removeRows(rows.map((row) => row.id));
				}

				await waitCondition(() => _.isEmpty(recalibration.getCombinatorialAddRowsSettings(tableDataSet.name)), 1000, timeouts.load); // to make sure user_medata is reset (the function is debounced)

			});

			it("can render", async function() {

				this.timeout(timeouts.render);
				const tableName = tableDataSet.name;
				const metadata = recalibration.metadata[tableName];

				result = enzymeMount(<CombinatorialAddRows tableName={tableName} metadata={metadata} recalibration={recalibration} />);
				container = get$Container();

				await waitCondition(() => $('.bp3-button-text:contains("Add 0 Row")').length === 1);
				expect($('.bp3-button-text:contains("Add 0 Row")')).to.have.lengthOf(1, 'Execution button text is not correct');
			});

			it("can add 16 rows", async function() {
				this.timeout(timeouts.test);

				const $weightInput = getColumnInput('Weight');
				const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
				setValue.call($weightInput[0], '0.2');
				const e = new Event('input', { bubbles: true });
				$weightInput[0].dispatchEvent(e);

				const $tenorInput = getColumnInput('Tenor').first();
				simulateKeyInputAndEnterKey($tenorInput, '1');
				const $tenorTags = getColumnTags('Tenor');
				await checkTagContainsText($tenorTags, 2, '1y');

				const $horizonInput = getColumnInput('Horizon');
				simulateKeyInputAndEnterKey($horizonInput, '1');
				simulateKeyInputAndEnterKey($horizonInput, '24m');
				$horizonInput.blur();

				const $horizonTags = getColumnTags('Horizon');
				await checkTagContainsText($horizonTags, 2, '1y');
				await checkTagContainsText($horizonTags, 2, '2y');

				const $stateLabel = getColumnLabel('State');
				expect($stateLabel.text()).to.equal('Future Dynamics');

				const $measureInput = getColumnInput('Measure');
				simulateMouseEvent($measureInput[0], 'click');
				await removeAllTags();
				await clickTag('Nominal Yield');
				await clickTag('Total Return');
				$measureInput.blur();
				const $measureTags = getColumnTags('Measure');
				await checkTagContainsText($measureTags, 2, 'Nominal Yield');
				await checkTagContainsText($measureTags, 2, 'Total Return');

				const $statisticInput = getColumnInput('Statistic');
				simulateMouseEvent($statisticInput[0], 'click');
				await removeAllTags();
				await clickTag('Mean');
				await clickTag('Skewness');
				$statisticInput.blur();
				const $statisticTags = getColumnTags('Statistic');
				await checkTagContainsText($statisticTags, 2, 'Mean');
				await checkTagContainsText($statisticTags, 2, 'Skewness');

				const $percentileInput = getColumnInput('Percentile');
				simulateMouseEvent($percentileInput[0], 'click');
				await removeAllTags();
				await clickTag('0.5%');
				$percentileInput.blur();
				const $percentileTags = getColumnTags('Percentile');
				await checkTagContainsText($percentileTags, 1, '0.5%');

				let $addRowsBtn;
				await waitCondition(() => {
					$addRowsBtn = $('.bp3-button-text:contains("Add 16 Rows")');
					return $addRowsBtn.length === 1;
				});
				expect($addRowsBtn).to.have.lengthOf(1, 'Execution button text is not correct');
				const beforeAddCount = recalibration.datasets[0].table.length;
				// execute add rows button
				$addRowsBtn.click();
				await waitCondition(() => (recalibration.datasets[0].table.length - beforeAddCount) === 16);
				expect(recalibration.datasets[0].table.length - beforeAddCount).to.equal(16);

				let tableData = recalibration.datasets[0].table;
				tableData = tableData.slice(tableData.length - 16);

				expect(tableData.filter((row) => row.state === 'futureDynamics')).to.have.lengthOf(16)
				expect(tableData.filter((row) => row.tenor === 1)).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.tenor === 12)).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.horizon === 12)).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.horizon === 24)).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.measure === 'nominalYield')).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.measure === 'totalReturn')).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.statistic === 'mean')).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.statistic === 'skewness')).to.have.lengthOf(8);
				expect(tableData.filter((row) => row.weight === 0.2)).to.have.lengthOf(16);
			});

			it("State's value is corresponding to horizon value", async function() {
				this.timeout(timeouts.test);

				const $horizonInput = getColumnInput('Horizon');
				simulateKeyInputAndEnterKey($horizonInput, '0');

				let $horizonTags = getColumnTags('Horizon');
				await checkTagContainsText($horizonTags, 1, '0');

				let $stateLabel = getColumnLabel('State');
				expect($stateLabel.text()).to.equal('Initial Condition');

				simulateKeyInputAndEnterKey($horizonInput, '1');
				simulateKeyInputAndEnterKey($horizonInput, '2');

				$horizonTags = getColumnTags('Horizon');
				await checkTagContainsText($horizonTags, 2, '1y');
				await checkTagContainsText($horizonTags, 2, '2y');
				$stateLabel = getColumnLabel('State');
				expect($stateLabel.text()).to.equal('Future Dynamics');
			});

			it("User's last input values are saved as recently used items", async function() {
				this.timeout(timeouts.test);

				const $tenorRecentlyUsedButton = getRecentlyUsedButton('Tenor');
				$tenorRecentlyUsedButton.click();
				let $popoverContainer = $(`.${css.recentlyUsedItemsPopover}`);
				let $list = $popoverContainer.find('li');
				expect($list).to.have.lengthOf(4);
				let tags = $list.eq(0).find('.bp3-tag');
				expect(tags.eq(0).text()).to.equal('1m');
				expect(tags.eq(1).text()).to.equal('1y');
				$tenorRecentlyUsedButton.click(); 	// close menu

				const $horizonRecentlyUsedButton = getRecentlyUsedButton('Horizon');
				$horizonRecentlyUsedButton.click();
				await waitCondition(() => {
					$popoverContainer = $(`.${css.recentlyUsedItemsPopover}`);
					$list = $popoverContainer.find('li');
					return $list.length === 5;
				});
				expect($list).to.have.lengthOf(5);
				tags = $list.eq(0).find('.bp3-tag');
				expect(tags.eq(0).text()).to.equal('1y');
				expect(tags.eq(1).text()).to.equal('2y');
				$horizonRecentlyUsedButton.click(); 	// close menu

				const $measureRecentlyUsedButton = getRecentlyUsedButton('Measure');
				$measureRecentlyUsedButton.click();
				await waitCondition(() => {
					$popoverContainer = $(`.${css.recentlyUsedItemsPopover}`);
					$list = $popoverContainer.find('li');
					return $list.length === 2;
				});
				expect($list).to.have.lengthOf(2);
				tags = $list.eq(0).find('.bp3-tag');
				expect(tags.eq(0).text()).to.equal('Nominal Yield');
				expect(tags.eq(1).text()).to.equal('Total Return');
				$measureRecentlyUsedButton.click(); 	// close menu

				const $statisticRecentlyUsedButton = getRecentlyUsedButton('Statistic');
				$statisticRecentlyUsedButton.click();
				await waitCondition(() => {
					$popoverContainer = $(`.${css.recentlyUsedItemsPopover}`);
					$list = $popoverContainer.find('li');
					return $list.length === 2;
				});
				expect($list).to.have.lengthOf(2);
				tags = $list.eq(0).find('.bp3-tag');
				expect(tags.eq(0).text()).to.equal('Mean');
				expect(tags.eq(1).text()).to.equal('Skewness');
				$statisticRecentlyUsedButton.click(); 	// close menu

			});
		});
	}
}

testScheduler.register(new RecalibrationCombinatorialAddRowsTests());
