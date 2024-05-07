import {sendNativeEventToElement, sleep} from 'test'
import { testAreaOpacity } from "./commonTests";

export function runBarTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		testAreaOpacity(getEnzymeContainer, '.highcharts-series > rect', expect)

		it('should display tooltip on hover', function (done) {
			this.timeout(50000);

			let $testContainer = $(getTestContainer());
			const chart = Highcharts.charts[Highcharts.charts.length - 1];
			const points = chart.series[0].points.slice(0).sort((a, b) => a.plotY - b.plotY);

			[0, points.length - 1].forEach((value, index) => {
				const point = points[value];
				point.onMouseOver();
				let tooltipBox = $testContainer.find('.highcharts-tooltip');
				expect(tooltipBox.length).to.equal(1);
				expect(tooltipBox.attr('visibility')).to.equal("visible");
				expect(tooltipBox.attr('opacity')).to.equal("1");
			})

			done();
		})

		it('should be able to switch column mode', function () {
			this.timeout(10000);

			let $testContainer = $(getTestContainer());

			sendNativeEventToElement($testContainer.find('.toggle-percent').get(0), 'click');
			const chart = Highcharts.charts[Highcharts.charts.length - 1];

			let yaxislabels = $.map($testContainer.find(".highcharts-yaxis-labels").children(), c => c.textContent);

			// 0 and 100 are not always the first and last element in the yaxis labels,
			// so just check that they are present instead
			expect(yaxislabels.indexOf("0")).to.be.above(-1);
			expect(yaxislabels.indexOf("100")).to.be.above(-1);
		})

	}
}