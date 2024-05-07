import {sendNativeEventToElement, sleep} from 'test'

export function runPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {
		it('should remove all tooltips with remove all button', function () {
			let $testContainer = $(getTestContainer());
			const $removeTooltip = $testContainer.find('.remove-tooltips');

			sendNativeEventToElement($removeTooltip.get(0), 'click');

			expect($testContainer.find('.highcharts-tooltip').length).to.equal(1);
		})

		it('should adjust marker sizes', function () {
			this.timeout(10000);

			let $testContainer = $(getTestContainer());

			// Normally we prefer to compare against the DOM, however scatter chart series are rendered as an image which makes it hard to compare marker size changes.
			let firstSeries = Highcharts.charts[Highcharts.charts.length - 1].series[0];
			const initialMarkerSize = firstSeries.options.marker.radius;

			sendNativeEventToElement($testContainer.find('.increase-marker-size').get(0), 'click');
			expect(firstSeries.options.marker.radius).to.be.greaterThan(initialMarkerSize);

			sendNativeEventToElement($testContainer.find('.reduce-marker-size').get(0), 'click');
			expect(firstSeries.options.marker.radius).to.equal(initialMarkerSize);
		})

		it('should adjust line width', function () {
			this.timeout(10000);
			
			let $testContainer = $(getTestContainer());
			const lineWidth = () => $testContainer.find('.highcharts-series-group .highcharts-line-series .highcharts-graph').attr("stroke-width")
			const lineStyleButton = $testContainer.find('.marker-line-style .line').get(0);

			if (lineStyleButton) {
				// Ensure we are in line mode
				sendNativeEventToElement(lineStyleButton, 'click');

				const initialLineWidth = lineWidth();

				sendNativeEventToElement($testContainer.find('.increase-marker-size').get(0), 'click');
				expect(parseFloat(lineWidth())).to.be.greaterThan(parseFloat(initialLineWidth));

				sendNativeEventToElement($testContainer.find('.reduce-marker-size').get(0), 'click');
				expect(parseFloat(lineWidth())).to.equal(parseFloat(initialLineWidth));
			}
		})
	}
}

export function runBoostHoverPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect, chartType){

	const visibleSeries = (series) => series.filter((s) => s.visible)

	const hoverFirstPoint = (function () {
		let $testContainer = $(getTestContainer());
		const chart = Highcharts.charts[Highcharts.charts.length - 1];
		const series = visibleSeries(chart.series)[0] as any;
		let hoverPoint = series.points[0];

		if (chart.inverted){
			const pointObj = (new series.pointClass()).init(series, series.options.data[hoverPoint.i]);
			hoverPoint.plotY = chart.xAxis[0].toPixels(pointObj.x, true)
			hoverPoint.plotX = chart.yAxis[0].toPixels(pointObj.y, true)
		}

		const $seriesGroup = $testContainer.find('.highcharts-series-group');
		//const bounds = $seriesGroup.get(0).getBoundingClientRect();

		// Calculate the bounds from the plot background because the WebGL updates has the series group left position starting outside of the plot area.
		//const bounds = $seriesGroup.get(0).getBoundingClientRect();
		const bounds = $testContainer.find('.highcharts-plot-background').get(0).getBoundingClientRect();

		// Hover over the point to generate the tracker
		let e = $.Event('mousemove');

		// set coordinates
		e.pageX = bounds.left + hoverPoint.plotX;
		e.pageY = bounds.top + hoverPoint.plotY;

		$seriesGroup.trigger(e);

		return e;
	})


	it('should highlight matching points on hover', async function () {
		this.timeout(50000);

		let $testContainer = $(getTestContainer());
		const series = Highcharts.charts[Highcharts.charts.length - 1].series;
		let numHoverAttempts = 0, numHoverPoints = 0, numVisibleSeries = visibleSeries(series).length;

		// Once in a while (maybe 1/20 runs) the first hover attempt fails in the Beeswarm chart and needs to be retried.
		// My current theory is that it is trying to hover in the middle of a chart refresh that is triggered from the font size increase test.
		do {
			if (numHoverAttempts > 0) {
				console.warn("Retrying failed hover highlight attempt");
				await sleep(1000);
			}
			hoverFirstPoint();
			numHoverPoints = $testContainer.find('.highcharts-tracker:not([d="M 0 0"])').length;
			numHoverAttempts++;
		}
		while (numHoverAttempts < 5 && numHoverPoints != numVisibleSeries);

		// There should be 1 matching point for every series. Trackers are added for each highlighted point so we can use them to note the existence of hover points.
		expect(numHoverPoints).to.equal(numVisibleSeries);
	})

	if (chartType == "scatter") {
		it('WEB-1416 marker should be correctly placed after inversion', async function () {
			this.timeout(5000);

			let $testContainer = $(getTestContainer());
			const toggleInversionButton = $('.invert').get(0);
			sendNativeEventToElement(toggleInversionButton, 'click');
			await sleep(1)

			let event = hoverFirstPoint();
			let foundClosePoint = false;
			$testContainer.find('.highcharts-tracker:not([d="M 0 0"])').each(function (index) {
				const rect = this.getBoundingClientRect();
				if (Math.abs(rect.left - event.pageX) < 10 && Math.abs(rect.top - event.pageY) < 10) {
					foundClosePoint = true;
					return false;
				}
			})

			expect(foundClosePoint).to.equal(true);

			// reset
			sendNativeEventToElement(toggleInversionButton, 'click');
			await sleep(1);
		})
	}

	it.skip('should display tooltip on hover and sticky on point click', function (done) {
		this.timeout(50000);

		let $testContainer = $(getTestContainer());
		const chart = Highcharts.charts[Highcharts.charts.length - 1];
		const points = visibleSeries(chart.series)[0].points.slice(0).sort((a, b) => a.plotY - b.plotY);

		//chart.redraw(false);

		const series:any = chart.series[0];

		[0 /*,points.length - 1*/].forEach((value, index) => {
			const point = points[value];

			const $seriesGroup = $testContainer.find('.highcharts-series-group');

			// Calculate the bounds from the plot background because the WebGL updates has the series group left position starting outside of the plot area.
			//const bounds = $seriesGroup.get(0).getBoundingClientRect();
			const bounds = $testContainer.find('.highcharts-plot-background').get(0).getBoundingClientRect();

			// Hover over the point to generate the tracker
			let e = $.Event('mousemove');

			// set coordinates
			e.pageX = bounds.left + point.plotX;
			e.pageY = bounds.top + point.plotY;// + (chartType == "beeswarm" ? 5 : 0); // Beeswarm plot is off for some weird reason.

			// Verify tooltip is visible on hover
			$seriesGroup.trigger(e);
			expect($testContainer.find('.highcharts-tooltip').attr('visibility')).to.equal("visible");
			expect($testContainer.find('.highcharts-tooltip').attr('opacity')).to.equal("1");

			// Find and click the tracker
			chart.hoverPoint = (new series.pointClass()).init(series, point);
			const tracker = $testContainer.find('.highcharts-series-group .highcharts-tracker:not([fill="none"])').get(0);
			sendNativeEventToElement(tracker, "click")

			// Note the highcharts default tooltip is always present just hidden, so stickying the first tooltip actually causes 1 additional tooltip to be present
			// in the DOM

			// This code throws an exception in testing - suggest using an attribute on the tooltip to identify the specific one we want instead of trying to guess behavior
			expect($testContainer.find('.highcharts-tooltip').length).to.equal(index + 2);
		})

		done();
	})
}