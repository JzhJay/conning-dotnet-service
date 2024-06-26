import {sendJQueryEventToElement, get$Container} from 'test'
import {testPercentileColor, testMean, testMoments} from './commonTests'

export function runCDFTests(getEnzymeContainer, isPhantomJS, expect)
{
	if (isPhantomJS) {
		it('should match step pattern baseline image', function (done) {
			this.timeout(10000);
			let $stepPatternButton = get$Container().find('.step-pattern');
			;
			sendJQueryEventToElement($stepPatternButton, 'click');

			//generateAndCompareScreenshot(`charts/cdf_step_${guid}.png`, done);

			sendJQueryEventToElement($stepPatternButton, 'click');
			done();
		})
	}
	else {
		it('should display tooltip on hover', function () {
			this.timeout(50000);

			const $chartContainer = get$Container().find('.highcharts-container');
			const bounds = $chartContainer.get(0).getBoundingClientRect();

			// create a jQuery event
			let e = $.Event('mousemove');

			// set coordinates
			e.pageX = bounds.left + bounds.width / 2;
			e.pageY = bounds.top + bounds.height / 2;

			get$Container().find('.highcharts-container').trigger(e);

			expect(get$Container().find('.highcharts-tooltip').attr('visibility')).to.equal("visible");

		})

		testMean(expect);
		testMoments(expect);

		it('should match selected percentile colors', function () {
			this.timeout(10000);

			testPercentileColor('.highcharts-plot-band', expect);
		})

		it('should match percentile ranges', function () {
			this.timeout(10000);

			let percentileTextBox = getEnzymeContainer(true).find('.percentiles > input');
			//$percentileTextBox.get(0).focus();
			percentileTextBox.instance().value = "0,25,40";
			// https://facebook.github.io/react/docs/test-utils.html
			percentileTextBox.simulate('change');
			percentileTextBox.simulate('keyDown', {key: "Enter", keyCode: 13, which: 13});
			//$percentileTextBox.blur();

			let yAxis = get$Container().find('.highcharts-yaxis-labels').get(1);

			let yAxisLabels = [].slice.call(yAxis.children).map((child) => {
				return parseInt(child.innerHTML);
			});

			expect(_.sortBy(yAxisLabels)).to.deep.equal([0, 25, 40, 50, 60, 75, 100])
		})

	}
}