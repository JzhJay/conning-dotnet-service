import {get$Container} from 'test';
import { waitCondition } from 'utility';

export function runAssetAllocationChartTests(expect){
    describe(`Should have correct legend`, function () {
        it("should populate legend entries", function () {
            expect(get$Container().find(".highcharts-legend-item").length).to.be.above(0);
        })
        describe('should be able to hover over legend', function () {
            before(async function() {
                let legend = get$Container().find(".highcharts-legend-item").get(0);
                $(legend).mouseover();
                await waitCondition(() => true, 1000);
            })
            after(async function() {
                let legend = get$Container().find(".highcharts-legend-item").get(0);
                $(legend).mouseout();
                await waitCondition(() => true, 1000);
            })
            it("unselected legend item should be grey", async function () {
                let unselectedLegend = get$Container().find(".highcharts-legend-item").get(1);
                let styleArray = unselectedLegend.firstElementChild.getAttribute('style').split(";")
                let styleMap = styleArray.reduce(function (map, obj) {
                    let temp = obj.split(":");
                    map[temp[0]] = temp[1];
                    return map;
                }, {});
                expect(styleMap["color"]).to.equal("#cccccc");
            })
            it("bar chart should only contain bars that has the same color as the legend that being hovered on", function () {
                let bars = get$Container().find(".highcharts-series-1");
                let colors = [];
                for(let i = 0; i < bars.get(0).children.length; ++i){
                    colors.push(bars.get(0).children.item(i).getAttribute("fill"));
                }
                expect(_.uniq(colors).length).to.equal(1);
                let legendColor = get$Container().find(".highcharts-legend-item")[0].children.item(1).getAttribute("fill");
                expect(colors[0]).to.equal(legendColor);
            })
        })
    });
    describe('Should have correct bars', function () {
        it("should populate bars", function () {
            expect(get$Container().find(".highcharts-series-group").get(0).children.item(4).children.length).to.be.above(0);
        })
        it("should display tooltip on hover", function () {
            expect(get$Container().find('.highcharts-tooltip').length).to.equal(0);
            //let bar = get$Container().find(".highcharts-series-group").get(0).children.item(4).children.item(3);
            // $(bar).mouseover();
	        const chart = Highcharts.charts[Highcharts.charts.length - 1];
	        const point = chart.series[0].points[4];
	        point.onMouseOver();
            expect(get$Container().find('.highcharts-tooltip').attr('visibility')).to.equal("visible");
            expect(get$Container().find('.highcharts-tooltip').attr('opacity')).to.equal("1");
        })
    })
}