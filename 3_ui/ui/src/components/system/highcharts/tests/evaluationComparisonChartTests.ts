import {get$Container, simulateEnterKeyEvent} from 'test';
import { sleep, waitCondition } from 'utility';

import * as css from '../../IO/internal/evaluationComparison/EvaluationComparisonView.css';
import * as evaluationSelectorCSS from '../../IO/internal/evaluationComparison/EvaluationSelector.css';

export function runEvaluationComparisonChartTests(getEnzymeContainer, getIo, expect) {
	function findElements(cssSelector) {
		return get$Container().find(cssSelector);
	}

	function enableInheritMode() {
		const inheritButton = getEnzymeContainer(true).find('button#inheritButton').first();

		if(!inheritButton.hasClass('bp3-active')) {
			inheritButton.simulate('click');
		}
	}

	async function openSelectContentMenu() {
		const specifyButton = getEnzymeContainer(true).find('button#specifyButton').first();
		if(!specifyButton.hasClass('bp3-active')) {
			specifyButton.simulate('click');
		}

		const selectContentButton = getEnzymeContainer(true).find('span.bp3-popover-target a.bp3-button').at(0);
		if(!selectContentButton.hasClass('bp3-active')) {
			selectContentButton.simulate('click');
			await waitCondition(() => $('input#toggleFrontier').length === 1, 200, 1000); // wait for hover to show menu
		}
	}

	async function closeAllPopupMenu() {
		// simulate onclick outside of menu
		simulateMouseEvent(get$Container()[0], 'mousedown');
		await sleep(300);
	}

	function simulateMouseEvent(element, eventType) {
		const mouseEvent = document.createEvent('MouseEvents');
		mouseEvent.initEvent (eventType, true, true);
		element.focus();
		element.dispatchEvent(mouseEvent);
	}

	function simulateBlurEvent(element) {
		const e = document.createEvent('Event');
		e.initEvent("blur", true, true);
		element.dispatchEvent(e);
	}

	function getFirstEvaluationSelector() {
		return getEnzymeContainer(true).find(`.${css.quickSwitchTools} .${evaluationSelectorCSS.root}`).first();
	}

	function getSecondEvaluationSelector() {
		return getEnzymeContainer(true).find(`.${css.quickSwitchTools} .${evaluationSelectorCSS.root}`).last();
	}

	async function expectEvaluationsChange(evaluation1Name, evaluation1AdditionalName, evaluation2Name, evaluation2AdditionalName) {
		// wait charts are rerendered completely (it may take quite long time for getting data for dominance charts)
		await waitCondition(() => findElements(`.${css.scenarioDominanceChart} .highcharts-legend-item`).first().text() === `${evaluation2Name} > ${evaluation1Name}`, 500, 20000);

		expect(getFirstEvaluationSelector().find('.bp3-popover-target').text()).to.equal(evaluation1Name);
		expect(getSecondEvaluationSelector().find('.bp3-popover-target').text()).to.equal(evaluation2Name);
		const evaluation1TableTitle = evaluation1AdditionalName ? `${evaluation1AdditionalName}${evaluation1Name}` : evaluation1Name;
		const evaluation2TableTitle = evaluation2AdditionalName ? `${evaluation2AdditionalName}${evaluation2Name}` : evaluation2Name;

		const tableThs = findElements(`.${css.assetClassTable} table thead th`);
		expect(tableThs.eq(1).text()).to.equal(evaluation1TableTitle);
		expect(tableThs.eq(2).text()).to.equal(evaluation2TableTitle);
		expect(tableThs.eq(3).text()).to.equal(`${evaluation1Name} - ${evaluation2Name}`);

		const scenarioDominanceChartLegends = findElements(`.${css.scenarioDominanceChart} .highcharts-legend-item`);
		expect(scenarioDominanceChartLegends.first().text()).to.equal(`${evaluation2Name} > ${evaluation1Name}`);
		expect(scenarioDominanceChartLegends.last().text()).to.equal(`${evaluation1Name} > ${evaluation2Name}`);

		const statisticalDominanceChartLegends = findElements(`.${css.statisticalDominanceChart} .highcharts-legend-item`);
		expect(statisticalDominanceChartLegends.first().text()).to.equal(evaluation2Name);
		expect(statisticalDominanceChartLegends.last().text()).to.equal(evaluation1Name);

		const assetAllocationChartLegends = findElements(`.${css.assetAllocationChart} .highcharts-legend-item`);
		expect(assetAllocationChartLegends.first().text()).to.equal(evaluation1Name);
		expect(assetAllocationChartLegends.last().text()).to.equal(evaluation2Name);

		const assetDiffChartLegends = findElements(`.${css.assetDiffChart} .highcharts-legend-item`);
		expect(assetDiffChartLegends.first().text()).to.equal(`${evaluation1Name} > ${evaluation2Name}`);
		expect(assetDiffChartLegends.last().text()).to.equal(`${evaluation1Name} < ${evaluation2Name}`);
	}

	async function resetOriginalEvalutions() { // reset mode and selected evalutions
		enableInheritMode();

		if (getFirstEvaluationSelector().find('.bp3-popover-target').text() !== '1') {
			getFirstEvaluationSelector().find('.bp3-popover-target').first().find('div').simulate('click');	// set 1st evaluation to additonal point 1
			await waitCondition(() => $('.bp3-portal').first().find('.bp3-menu .bp3-menu-item').first().find('div:contains(1)').length > 0);
			$('.bp3-portal').first().find('.bp3-menu .bp3-menu-item').first().find('div').trigger('click');
		}

		if (getSecondEvaluationSelector().find('.bp3-popover-target').text() !== 'a') {
			getSecondEvaluationSelector().find('.bp3-popover-target').first().find('div').simulate('click'); // set 2nd evaluation to lambda point a
			await waitCondition(() => $('.bp3-portal').last().find('.bp3-menu .bp3-menu-item').eq(1).find('div:contains(a)').length > 0);
			$('.bp3-portal').last().find('.bp3-menu .bp3-menu-item').eq(1).find('div').trigger('click');
		}

		await expectEvaluationsChange('1', 'Untitled', 'a', null);
	}

	describe('Basic render result', function () {
		it('Should be able to render 5 sub-views', async function () {
			expect(findElements(`.${css.assetClassTable}`).length).to.equal(1);
			expect(findElements(`.${css.assetAllocationChart} .highcharts-container`).length).to.equal(1);
			expect(findElements(`.${css.assetDiffChart} .highcharts-container`).length).to.equal(1);
			expect(findElements(`.${css.scenarioDominanceChart} .highcharts-container`).length).to.equal(1);
			expect(findElements(`.${css.statisticalDominanceChart} .highcharts-container`).length).to.equal(1);
        });
    });

	describe('Toggle points', function () {
		before(function() {
			enableInheritMode(); // reset mode
		});

		after(async function() {
			await closeAllPopupMenu();
		});

		it('should toggle efficient frontier points', async function () {
			await openSelectContentMenu();
			$('input#toggleFrontier').parent().click();	// enable efficient frontier
			await closeAllPopupMenu();
			await waitCondition(() => getSecondEvaluationSelector().find('.bp3-popover-target').first().text() === 'A');

			let dropdownButton = getFirstEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			let $menuItem = $('.bp3-portal').eq(1).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.equal('A');

			dropdownButton = getSecondEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			$menuItem = $('.bp3-portal').eq(2).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.equal('A');
		});

		it('should toggle lambda points', async function () {
			await openSelectContentMenu();
			$('input#toggleLambda').parent().click();
			await closeAllPopupMenu();
			await waitCondition(() => getSecondEvaluationSelector().find('.bp3-popover-target').first().text() === 'a');

			let dropdownButton = getFirstEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			let $menuItem = $('.bp3-portal').eq(1).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.equal('a');

			dropdownButton = getSecondEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			$menuItem = $('.bp3-portal').eq(2).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.equal('a');
		});

		it('should toggle additional points', async function () {
			await openSelectContentMenu();
			$('input#toggleAdditionalPoints').parent().click();
			await closeAllPopupMenu();

			let dropdownButton = getFirstEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			let $menuItem = $('.bp3-portal').eq(1).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.not.equal('1 - Untitled');

			dropdownButton = getSecondEvaluationSelector().find('.bp3-popover-target').first();
			dropdownButton.simulate('click');
			$menuItem = $('.bp3-portal').eq(2).find('.bp3-menu .bp3-menu-item').eq(1);
			expect($menuItem.text()).to.not.equal('1 - Untitled');
		});
	});

	describe('Quick switch', function () {
		before(async function() {
			await resetOriginalEvalutions(); // set 1st evaluation to additonal point 1, set 2nd evaluation to lambda point a
		});

		it('Control 1st evaluation', async function () {
			const nextButton = getFirstEvaluationSelector().find('button').last();
			nextButton.simulate('click'); // set 1st evaluation to a
			await expectEvaluationsChange('a', null, 'a', null);

			getFirstEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').first().find('.bp3-menu .bp3-menu-item').first().find('div').trigger('click'); // set 1st evaluation to 1 by dropdown list
			await expectEvaluationsChange('1', 'Untitled', 'a', null);

			const prevButton = getFirstEvaluationSelector().find('button').first();
			prevButton.simulate('click'); // set 1 st evaluation to 1
			await expectEvaluationsChange('ae', null, 'a', null);
		});

		it('Control 2nd evaluation', async function () {
			const nextButton = getSecondEvaluationSelector().find('button').last();
			nextButton.simulate('click'); // set 2nd evaluation to b
			await expectEvaluationsChange('ae', null, 'b', null);

			getSecondEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').last().find('.bp3-menu .bp3-menu-item').eq(1).find('div').trigger('click'); // set 2nd evaluation to a by dropdown list
			await expectEvaluationsChange('ae', null, 'a', null);

			const prevButton = getSecondEvaluationSelector().find('button').first();
			prevButton.simulate('click'); // set 2nd evaluation to 1
			await expectEvaluationsChange('ae', null, '1', 'Untitled');
        });

		it('Assign 1st evalution to 2nd evalution', async function () {
			getFirstEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').first().find('.bp3-menu .bp3-menu-item').eq(3).find('div').trigger('click'); // set 1st evaluation to c by dropdown list

			findElements(`.${css.evaluationSwitchButtonGroup} button`).last().trigger('click');
			await expectEvaluationsChange('c', null, 'c', null);
        });

		it('Assign 2nd evalution to 1st evalution', async function () {
			getSecondEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').last().find('.bp3-menu .bp3-menu-item').eq(1).find('div').trigger('click'); // set 2nd evaluation to a by dropdown list

			findElements(`.${css.evaluationSwitchButtonGroup} button`).first().trigger('click');
			await expectEvaluationsChange('a', null, 'a', null);
        });

		it('Swap evalutions', async function () {
			getFirstEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').first().find('.bp3-menu .bp3-menu-item').first().find('div').trigger('click'); // set 1st evaluation to 1 by dropdown list

			getSecondEvaluationSelector().find('.bp3-popover-target').first().simulate('click');
			$('.bp3-portal').last().find('.bp3-menu .bp3-menu-item').eq(1).find('div').trigger('click'); // set 2nd evaluation to a by dropdown list

			findElements(`.${css.evaluationSwitchButtonGroup} button`).eq(1).trigger('click');
			await expectEvaluationsChange('a', null, '1', 'Untitled');
        });
	});

	describe('Toggling views', function () {
		it('Should be able to toggle asset class table view', async function () {
			await openSelectContentMenu();

			$('input[name="toggleAssetClassTableBtn"]').parent().click()
			// hide view
			await waitCondition(() => findElements(`.${css.assetClassTable}`).length === 0, 100, 1000);
			expect(findElements(`.${css.assetClassTable}`).length).to.equal(0);
			// show view
			$('input[name="toggleAssetClassTableBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.assetClassTable}`).length === 1, 100, 1000);
			expect(findElements(`.${css.assetClassTable}`).length).to.equal(1);
		});

		it('Should be able to toggle allocation comparision chart', async function () {
			await openSelectContentMenu();

			// hide view
			$('input[name="toggleAllocationComparisonChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.assetAllocationChart}`).length === 0, 100, 1000);
			expect(findElements(`.${css.assetAllocationChart}`).length).to.equal(0);
			// show view
			$('input[name="toggleAllocationComparisonChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.assetAllocationChart}`).length === 1, 100, 1000);
			expect(findElements(`.${css.assetAllocationChart} .highcharts-container`).length).to.equal(1);
		});

		it('Should be able to toggle allocation diff chart', async function () {
			await openSelectContentMenu();

			// hide view
			$('input[name="toggleAllocationDiffChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.assetDiffChart}`).length === 0, 100, 1000);
			expect(findElements(`.${css.assetDiffChart}`).length).to.equal(0);
			// show view
			$('input[name="toggleAllocationDiffChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.assetDiffChart}`).length === 1, 100, 1000);
			expect(findElements(`.${css.assetDiffChart} .highcharts-container`).length).to.equal(1);
		});

		it('Should be able to toggle scenario dominance chart', async function () {
			await openSelectContentMenu();

			// hide view
			$('input[name="toggleScenarioDominanceChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.scenarioDominanceChart}`).length === 0, 100, 1000);
			expect(findElements(`.${css.scenarioDominanceChart}`).length).to.equal(0);
			// show view
			$('input[name="toggleScenarioDominanceChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.scenarioDominanceChart}`).length === 1, 100, 1000);
			expect(findElements(`.${css.scenarioDominanceChart} .highcharts-container`).length).to.equal(1);
		});

		it('Should be able to toggle statistical dominance chart', async function () {
			await openSelectContentMenu();

			// hide view
			$('input[name="toggleStatisticalDominanceChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.statisticalDominanceChart}`).length === 0, 100, 1000);
			expect(findElements(`.${css.statisticalDominanceChart}`).length).to.equal(0);
			// show view
			$('input[name="toggleStatisticalDominanceChartBtn"]').parent().click()
			await waitCondition(() => findElements(`.${css.statisticalDominanceChart}`).length === 1, 100, 1000);
			expect(findElements(`.${css.statisticalDominanceChart} .highcharts-container`).length).to.equal(1);
		});

		after(async function() {
			await closeAllPopupMenu();
		});
	});

	describe('Switch asset allocation chart axis maximum', function () {
		before(async function() {
			await resetOriginalEvalutions(); // set 1st evaluation to additonal point 1, set 2nd evaluation to lambda point a
			await openSelectContentMenu();
			simulateMouseEvent($('input[name="toggleAllocationComparisonChartBtn"]')[0].parentElement, 'mouseover');
			await waitCondition(() => $('input[name="axisFixedAcrossBtn"]').length === 1, 200, 1000);
		});

		it('switch axis maximum to fixed across allocations', function () {
			$('input[name="axisFixedAcrossBtn"]').parent().click();
			const texts = findElements(`.${css.assetAllocationChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.last().text()).to.equal('60%');
		});

		it('switch axis maximum to fixed 100%', function () {
			$('input[name="axisFixed100Btn"]').parent().click();
			const texts = findElements(`.${css.assetAllocationChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.last().text()).to.equal('100%');
		});

		it('switch axis maximum to dynamic', function () {
			$('input[name="axisDynamicBtn"]').parent().click();
			const texts = findElements(`.${css.assetAllocationChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.last().text()).to.equal('60%');
		});

		after(async function() {
			await closeAllPopupMenu();
		});
	});

	describe('Switch asset diff chart axis maximum', function () {
		before(async function() {
			await resetOriginalEvalutions(); // set 1st evaluation to additonal point 1, set 2nd evaluation to lambda point a
			await openSelectContentMenu();
			simulateMouseEvent($('input[name="toggleAllocationDiffChartBtn"]')[0].parentElement, 'mouseover');
			await waitCondition(() => $('input[name="axisFixedAcrossBtn"]').length === 1, 200, 1000);
		});

		it('switch axis maximum to fixed across allocations', function () {
			$('input[name="axisFixedAcrossBtn"]').parent().click();
			const texts = findElements(`.${css.assetDiffChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.first().text()).to.equal('-50%');
			expect(texts.last().text()).to.equal('50%');
		});

		it('switch axis maximum to fixed 100%', function () {
			$('input[name="axisFixed100Btn"]').parent().click();
			const texts = findElements(`.${css.assetDiffChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.first().text()).to.equal('-100%');
			expect(texts.last().text()).to.equal('100%');
		});

		it('switch axis maximum to dynamic', function () {
			$('input[name="axisDynamicBtn"]').parent().click();
			const texts = findElements(`.${css.assetDiffChart} .highcharts-container .highcharts-yaxis-labels text`);
			expect(texts.first().text()).to.equal('-50%');
			expect(texts.last().text()).to.equal('75%' );
		});

		after(async function() {
			await closeAllPopupMenu();
		});
	});

	describe('Toggle fields of asset class table', function () {
		before(async function() {
			await openSelectContentMenu();
			simulateMouseEvent($('input[name="toggleAssetClassTableBtn"]')[0].parentElement, 'mouseover');
			await waitCondition(() => $('input[name="Duration"]').length === 1, 200, 1000);
		});

		const getFirst$Cells = (containsText?: string): JQuery => {
			if (containsText)
				return $(`.${css.assetClassTable} .${css.firstCell}:contains("${containsText}")`);

			return $(`.${css.assetClassTable} .${css.firstCell}`);
		}

		const testTrigger = async (triggerClass: string, testFunc: (expectResult: boolean) => Promise<void>) => {
			const getTest$Element = () => {
				let _$elem = $(triggerClass);
				if (_$elem.length != 1) {
					expect(triggerClass).to.eq('not exist');
				}
				return _$elem;
			}

			let test$elem = getTest$Element();
			const initChecked = (test$elem[0] as HTMLInputElement).checked;
			simulateMouseEvent(test$elem.parent()[0], 'click');
			await testFunc(!initChecked);

			test$elem = getTest$Element();
			simulateMouseEvent(test$elem.parent()[0], 'click');
			await testFunc(initChecked);
		}

		['Duration', 'Total', 'Mean', 'Minimum', 'Maximum'].forEach((field)=> {
			it(`Toggle field ${field}`, async function () {
				const initChecked = ($(`input[name="${field}"]`)[0] as HTMLInputElement).checked;
				const firstExpectedValue = initChecked ? 0 : 1;
				const secondExpectedValue = initChecked ? 1 : 0;

				$(`input[name="${field}"]`).parent().click(); // toggle on/off
				await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("${field}")`).length === firstExpectedValue, 200, 1000);
				expect($(`.${css.assetClassTable} .${css.firstCell}:contains("${field}")`).length).to.equal(firstExpectedValue);
				$(`input[name="${field}"]`).parent().click(); // toggle on/off
				await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("${field}")`).length === secondExpectedValue, 200, 1000);
				expect($(`.${css.assetClassTable} .${css.firstCell}:contains("${field}")`).length).to.equal(secondExpectedValue);
			});
		});

		it('Toggle field Asset Class', async function () {
			this.timeout(5 * 1000);
			const initChecked = ($('input[name="Asset Class"]')[0] as HTMLInputElement).checked;
			const firstExpectedValue = initChecked ? 0 : 1;
			const secondExpectedValue = initChecked ? 1 : 0;

			$('input[name="Asset Class"]').parent().click(); // toggle off
			await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("US_TIPS_0_to_1")`).length === firstExpectedValue, 200, 1000);
			expect($(`.${css.assetClassTable} .${css.firstCell}:contains("US_TIPS_0_to_1")`).length).to.equal(firstExpectedValue);
			$('input[name="Asset Class"]').parent().click(); // toggle on/off
			await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("US_TIPS_0_to_1")`).length === secondExpectedValue, 200, 1000);
			expect($(`.${css.assetClassTable} .${css.firstCell}:contains("US_TIPS_0_to_1")`).length).to.equal(secondExpectedValue);
		});

		it('Toggle field Risk and Reward', async function () {
			async function executeExpect(checked) {
				if (!checked) {
					await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("Risk")`).length === 0, 200, 1000);
					expect($(`.${css.assetClassTable} .${css.firstCell}:contains("Risk")`).length + $(`.${css.assetClassTable} .${css.firstCell}:contains("Reward")`).length).to.equal(0);
				} else {
					await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("Risk")`).length === 1, 200, 1000);
					expect($(`.${css.assetClassTable} .${css.firstCell}:contains("Risk")`).length + $(`.${css.assetClassTable} .${css.firstCell}:contains("Reward")`).length).to.equal(2);
				}
			}

			const initChecked = ($('input[name="Risk and Reward"]')[0] as HTMLInputElement).checked;
			$('input[name="Risk and Reward"]').parent().click(); // toggle on/off
			await executeExpect(!initChecked);

			$('input[name="Risk and Reward"]').parent().click(); // toggle on/off
			await executeExpect(initChecked);
		});

		it('Toggle field Standard Deviation', async function () {
			const initChecked = ($('input[name="Standard Deviation"]')[0] as HTMLInputElement).checked;
			const firstExpectedValue = initChecked ? 0 : 1;
			const secondExpectedValue = initChecked ? 1 : 0;

			$('input[name="Standard Deviation"]').parent().click(); // toggle on/off
			await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("Deviation")`).length === firstExpectedValue, 200, 1000);
			expect($(`.${css.assetClassTable} .${css.firstCell}:contains("Deviation")`).length).to.equal(firstExpectedValue);
			$('input[name="Standard Deviation"]').parent().click(); // toggle on/off
			await waitCondition(() => $(`.${css.assetClassTable} .${css.firstCell}:contains("Deviation")`).length === secondExpectedValue, 200, 1000);
			expect($(`.${css.assetClassTable} .${css.firstCell}:contains("Deviation")`).length).to.equal(secondExpectedValue);
		});

		it('Toggle field Percentiles', async function () {
			this.timeout(10 * 1000);
			async function executeExpect(checked) {
				if (!checked) {
					await waitCondition(() => getFirst$Cells("50%").length === 0, 200, 1000);
					expect(getFirst$Cells("50%").length).to.equal(0);
					expect(get$Container().find('.toolbar .percentiles div:contains("Percentiles")').length).to.equal(0);
				} else {
					await waitCondition(() => getFirst$Cells("50%").length === 1, 200, 1000);
					expect(getFirst$Cells("50%").length).to.equal(1);
					let rows = getFirst$Cells().length;

					const $input = get$Container().find('.toolbar .percentiles div:contains("Percentiles:")').next();
					expect($input.length).to.equal(1);
					simulateMouseEvent($input[0], 'click');
					$input.val('0,1,5,25,50,70');
					$input.trigger('blur');
					$input.trigger('change');
					simulateEnterKeyEvent($input[0])

					await waitCondition(() => rows != getFirst$Cells().length, 100, 5000);
					expect($input.val()).to.equal('0, 1, 5, 25, 50, 70');
					expect(getFirst$Cells("70%").length).to.equal(1);
				}
			}

			await testTrigger('input[name="Percentiles"]', executeExpect);

		});

		it('Toggle field CTEs', async function () {
			this.timeout(10 * 1000);
			async function executeExpect(checked) {
				if (!checked) {
					await waitCondition(() => getFirst$Cells("Under 5%").length === 0, 200, 1000);
					expect(getFirst$Cells("Under 5%").length).to.equal(0);
					expect(get$Container().find('.toolbar .percentiles div:contains("CTEs")').length).to.equal(0);
				} else {
					await waitCondition(() => getFirst$Cells("Under 5%").length === 1, 200, 1000);
					expect(getFirst$Cells("Under 5%").length).to.equal(1);
					let rows = getFirst$Cells().length;

					const $input = get$Container().find('.toolbar .percentiles div:contains("CTEs:")').next();
					expect($input.length).to.equal(1);
					simulateMouseEvent($input[0], 'click');
					$input.val('<1,<5,<7');
					$input.trigger('blur');
					$input.trigger('change');
					simulateEnterKeyEvent($input[0])

					await waitCondition(() => rows != getFirst$Cells().length, 100, 5000);
					expect($input.val()).to.equal('<1, <5, <7');
					expect(getFirst$Cells("Under 7%").length).to.equal(1);
				}
			}

			await testTrigger('input[name="CTEs"]', executeExpect);
		});
	});
}
