import {sendNativeEventToElement, sleep} from 'test'

export function runLineTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		it('should dim other series on hover', function (done) {
			this.timeout(50000);

			let $testContainer = $(getTestContainer());
			const series = Highcharts.charts[Highcharts.charts.length - 1].series;

			//don't let highcharts build the kdTree asynchronously
			(series[0] as any).options.kdNow = true;
			let hoverPoint = series[0].points[0];

			hoverPoint.onMouseOver();

			// There should be 1 matching halo for a hover over a single point.
			expect($testContainer.find('.highcharts-halo').length).to.equal(1);
			expect($testContainer.find('.highcharts-series.highcharts-series-hover').length).to.equal(1);
			done();
		})

		it('should display tooltip on hover and sticky on point click', function (done) {
			this.timeout(50000);

			let $testContainer = $(getTestContainer());
			const chart = Highcharts.charts[Highcharts.charts.length - 1];
			const points = chart.series[0].points.slice(0).sort((a, b) => a.plotY - b.plotY);

			[0, points.length - 2].forEach((value, index) => {
				const point = points[value];

				// Hover over the point to generate the tracker
				point.onMouseOver();

				// Verify tooltip is visible on hover
				let tooltipBox = $testContainer.find('.highcharts-tooltip');
				expect(tooltipBox.attr('visibility')).to.equal("visible");
				expect(tooltipBox.attr('opacity')).to.equal("1");

				// Find and click the tracker
				point.firePointEvent('click');

				// Note the highcharts default tooltip is always present just hidden, so stickying the first tooltip actually causes 1 additional tooltip to be present
				// in the DOM
				expect($testContainer.find('.highcharts-tooltip').length).to.equal(index + 2);
			})

			done();
		})

		it('should be able to adjust marker/line modes', function () {
			this.timeout(10000);

			let $testContainer = $(getTestContainer());
			let seriesCount = Highcharts.charts[Highcharts.charts.length - 1].series.length / 2; // /2 to account for regression lines

			sendNativeEventToElement($testContainer.find('.marker-line-style .line').get(0), 'click');
			for (let s of ($testContainer as any).find('.highcharts-markers')){
				expect(s.children.length).to.equal(0)
			};
			sendNativeEventToElement($testContainer.find('.marker-line-style .marker').get(0), 'click');
			for (let s of ($testContainer as any).find('.highcharts-markers')){
				expect(s.children.length).to.be.above(0)
			};
		})
	}
}