import {get$Container} from 'test';
import {reactionToPromise, sleep, waitCondition} from 'utility';
import { IO } from 'stores/io';
import {waitChartFrontierData} from './ioTestUtils';

export function runEfficientFrontierTests(getEnzymeContainer, getIo, expect) {
    describe(`Should be able to show lambda points`, function () {
        before(async function() {
            let io: IO = getIo();
            let updateCount = io.updateCount;
            let specifyButton = getEnzymeContainer(true).find('button#specifyButton').first();
            if(!specifyButton.hasClass("bp3-active"))
                specifyButton.simulate('click');
            let allocationsButton = getEnzymeContainer(true).find('span.bp3-popover-target').at(0);
            allocationsButton.simulate('click');
            await waitCondition(() => { // wait for hover to show menu
                return true;
            }, 500);
	        $('input#toggleLambda').parent().click();
	        $('input#toggleAdditionalPoints:checked').parent().click();
	        allocationsButton.simulate('click');

	        await waitChartFrontierData(io, "efficientFrontier", updateCount, false);
        });

        it ("should have legend entries", function () {
			let io:IO = getIo();
			expect(get$Container().find(".highcharts-legend-item").length).to.equal(24);
		})

        it("should have donuts and labels for lambdas", function () {
            let io:IO = getIo();
            expect(get$Container().find(".highcharts-pie-series.highcharts-tracker").length).to.equal(io.lambda.length);
            expect(get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").length).to.equal(io.lambda.length);
        })

    });

    describe("Should be able to show frontier points", function () {

        before(async function() {
            let io: IO = getIo();
            let updateCount = io.updateCount;
            let specifyButton = getEnzymeContainer(true).find('button#specifyButton').first();
            if(!specifyButton.hasClass("bp3-active"))
                specifyButton.simulate('click');
            let allocationsButton = getEnzymeContainer(true).find('span.bp3-popover-target').at(0);
            allocationsButton.simulate('click');
            await waitCondition(() => { // wait for hover to show menu
                return true;
            }, 500);
            $('input#toggleFrontier').parent().click()
            allocationsButton.simulate('click');

            //TODO: Needs to be factored with code to show lambda points
	        await waitChartFrontierData(io, "efficientFrontier", updateCount, true);

            await waitCondition(() => { // Wait another second for legends to update
                return true;
            }, 1000);

        });

        it("should have donuts for frontier points", function () {
            let io:IO = getIo();
            expect(get$Container().find(".highcharts-pie-series.highcharts-tracker").length).to.equal(io.frontierPoints.length);
            expect(get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").length).to.equal(io.frontierPoints.length);
        })
        it ("should have legend entries", function () {
			let io:IO = getIo();
			expect(get$Container().find(".highcharts-legend-item").length).to.equal(21);
        })
    })

    describe("Should be able to display tooltips", function () {
        it("should display tooltip on hover", function () {
            let donut = get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").get(0);
            $(donut).mouseover();
            expect(get$Container().find('.highcharts-tooltip').attr('visibility')).to.equal("visible");
            expect(get$Container().find('.highcharts-tooltip').attr('opacity')).to.equal("1");
        })

        it("should toggle tooltip on click", function () {
            let donut = get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").get(0);
            $(donut).mouseover();
            $(donut).click();
            expect(get$Container().find('.highcharts-tooltip').length).to.equal(2);

            let donut2 = get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").get(1);
            $(donut2).mouseover();
            $(donut2).click();
            expect(get$Container().find('.highcharts-tooltip').length).to.equal(3);

            $(donut).mouseover();
            $(donut).click();
            expect(get$Container().find('.highcharts-tooltip').length).to.equal(2);

            $(donut2).mouseover();
            $(donut2).click();
            expect(get$Container().find('.highcharts-tooltip').length).to.equal(1);
        })

        it("should be able to clear tooltips", function () {
            let donut = get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").get(0);
            let donut2 = get$Container().find(".highcharts-label.highcharts-data-label.highcharts-data-label-color-undefined").get(1);
            $(donut).mouseover();
            $(donut).click();
            $(donut2).mouseover();
            $(donut2).click();

            expect(get$Container().find('.highcharts-tooltip').length).to.equal(3);

            let clearTooltipsButton = getEnzymeContainer(true).find('a.remove-tooltips.bp3-button');
            clearTooltipsButton.simulate('click');

            expect(get$Container().find('.highcharts-tooltip').length).to.equal(1);
        })
    })

    describe("Should be able to change donut size", function () {
        it("should be able to adjust donut size", async function () {
            let donutSlider = getEnzymeContainer(true).find('.donut-size > input');
    		donutSlider.getDOMNode().value = "3";
    		donutSlider.simulate('change');

    		const current = () => get$Container().find(".highcharts-series.highcharts-series-81.highcharts-pie-series.highcharts-tracker > path").attr('d');
    		await waitCondition(() => current().includes("75 75 0 0"), 100);
            expect(current()).to.have.string("75 75 0 0");

    		donutSlider.getDOMNode().value = "1";
    		donutSlider.simulate('change');
	        await waitCondition(() => current().includes("25 25 0 0"), 100);
            expect(current()).to.have.string("25 25 0 0");
        })
    })

    describe("Should be able to change asset groupings", function () {
        it("should be able to cycle through asset groupings", async function () {
            let io:IO = getIo();
            let assetButton = $("div.ui.label:contains('Asset Class:')").siblings().find('button.bp3-button');

            const waitPathLengthChange = async () => {
	            const pathLength = get$Container().find('g.highcharts-series path').length;
            	await waitCondition(() => {
	                return pathLength != get$Container().find('g.highcharts-series path').length
            }, 1000);
            }

            assetButton.click();
            await waitPathLengthChange();
            const baseLength = 1; // Frontier line
            expect(get$Container().find('g.highcharts-series path').length).to.equal(io.frontierPoints.length * 2 + baseLength);
            expect(get$Container().find(".highcharts-legend-item").length).to.equal(2);

            assetButton.click();
	        await waitPathLengthChange();
			expect(get$Container().find('g.highcharts-series path').length).to.equal(45 + baseLength);
			expect(get$Container().find(".highcharts-legend-item").length).to.equal(7);

            assetButton.click();
	        await waitPathLengthChange();
			expect(get$Container().find('g.highcharts-series path').length).to.equal(52 + baseLength);
			expect(get$Container().find(".highcharts-legend-item").length).to.equal(21);
        })
    })
}
