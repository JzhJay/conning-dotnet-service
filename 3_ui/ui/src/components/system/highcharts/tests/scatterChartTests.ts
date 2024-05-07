import {sendNativeEventToElement, sleep} from 'test'
import { runBoostHoverPointTests } from "./pointChartTests";

export function runScatterTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		runBoostHoverPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect, "scatter")

		it('should be able to toggle regression lines', function () {
			this.timeout(5000)
			let $testContainer = $(getTestContainer());
			const $regressionLine = $('.regression-line');

			sendNativeEventToElement($regressionLine.get(0), 'click');

			// Must have 1 regression line for ever series and it should be visible with associated legend
			expect($testContainer.find('.highcharts-series-group .highcharts-scatter-series').length).to.equal($testContainer.find('.highcharts-series-group .highcharts-line-series').length);
			expect($testContainer.find('.highcharts-legend .highcharts-scatter-series').length).to.equal($testContainer.find('.highcharts-legend .highcharts-line-series').length);
			// As of Highcharts 6.1 the regression is rendered boosted in an image so no easy way to tell if its present in the graph.
			//expect($testContainer.find('.highcharts-series-group .highcharts-line-series').attr('visibility')).to.equal(true);

			sendNativeEventToElement($regressionLine.get(0), 'click');
			//expect($testContainer.find('.highcharts-line-series').attr('visibility')).to.equal("hidden");
		})

		it('should be able to adjust marker/line modes', function () {
			this.timeout(5000)
			let $testContainer = $(getTestContainer());
			const chart = Highcharts.charts[Highcharts.charts.length - 1];
			let seriesCount = chart.series.length / 2; // /2 to account for regression lines

			sendNativeEventToElement($testContainer.find('.marker-line-style .line').get(0), 'click');
			expect($testContainer.find('.highcharts-series-group .highcharts-line-series:not([visibility="hidden"]) .highcharts-graph').length).to.equal(seriesCount, "should match line count");
			//expect(chart.series.filter((s) => s.type == "line" && !s.userOptions.isRegressionLine).length).to.equal(seriesCount, "should match line count");


			sendNativeEventToElement($testContainer.find('.marker-line-style .marker').get(0), 'click');
			expect(chart.series.filter(s => s.type == "scatter").length).to.equal(seriesCount, "should match marker count"); // Note: boost renders all series in a single image so can't check the DOM
		})
	}
}