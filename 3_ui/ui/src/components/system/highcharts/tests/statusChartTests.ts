import { IO } from 'stores/io';
import {get$Container} from 'test';
import { waitCondition } from 'utility';


export function runStatusTests(io:IO, expect) {

    describe(`Should have correct legend`, function () {
        it ("should have 3 legend entries", function () {
            expect(get$Container().find(".highcharts-legend-item").length).to.equal(3);
        })
        it ("each legend item should have correct content", function () {
            expect(get$Container().find(".highcharts-legend-item").get(0).firstChild.firstChild.textContent).to.equal("Waiting");
            expect(get$Container().find(".highcharts-legend-item").get(1).firstChild.firstChild.textContent).to.equal("Optimizing");
            expect(get$Container().find(".highcharts-legend-item").get(2).firstChild.firstChild.textContent).to.equal("Done");
        })
        it("each legend item should have correct color", function () {
            expect(get$Container().find(".highcharts-legend-item").get(0).children[1].getAttribute("fill")).to.equal("rgb(255, 0, 0)");
            expect(get$Container().find(".highcharts-legend-item").get(1).children[1].getAttribute("fill")).to.equal("rgb(0, 255, 0)");
            expect(get$Container().find(".highcharts-legend-item").get(2).children[1].getAttribute("fill")).to.equal("rgb(0, 0, 255)");
        });
    });

    describe("Should have correct bars", function () {
        it("should have 31 bars", function () {
            expect(get$Container().find(".highcharts-series-group").get(0).children.item(4).children.length).to.equal(31);
        })
        it("should display tooltip on hover", function () {
	        const chart = Highcharts.charts[Highcharts.charts.length - 1];
	        const point = chart.series[2].points[0];
	        point.onMouseOver();
            expect(get$Container().find('.highcharts-tooltip').attr('visibility')).to.equal("visible");
            expect(get$Container().find('.highcharts-tooltip').attr('opacity')).to.equal("1");
        })
    })

    describe("Should have correct hover behavior", function () {
        before(async function() {
	        const chart = Highcharts.charts[Highcharts.charts.length - 1];
	        const point = chart.series[2].points[0];
	        point.onMouseOver();
            await waitCondition(() => true, 1000);
        })
        it("Should have tooltip displayed", function () {
            let tooltip = $('.highcharts-tooltip').get(0);
            expect(tooltip).to.not.be.null;
        })
        it("tooltip should have correct content", function () {
            let tooltip = $('.highcharts-tooltip').get(0).children[4];
            expect(tooltip.childElementCount).to.equal(14);
	        expect(tooltip.children[0].innerHTML).to.equal("Lambda Value");
            expect(tooltip.children[4].innerHTML).to.equal("Evaluations");
	        expect(tooltip.children[8].innerHTML).to.equal("Iterations");
	    })
    })

    describe("Should have correct interaction between legend and chart", function () {
    	before(async function() {
		    // $(get$Container().find(".highcharts-legend-item").get(2).children[1]).click();
		    const chart = Highcharts.charts[Highcharts.charts.length - 1];
    		chart.legend.allItems.forEach( item => item.setVisible(false));

            await waitCondition(() => true, 1000);
        })
        it("legend item should be grey after clicking", function () {
            expect(get$Container().find(".highcharts-legend-item").get(2).children[1].getAttribute("fill")).to.equal("#cccccc");
        })
        it("All bars in status chart should be hidden after clicking", function () {
            let firstBarlegend = $('.highcharts-series-group').find('rect').get(0);
            expect(firstBarlegend.parentElement.getAttribute("visibility")).to.equal("hidden");
        })
    })
}
