import {sendJQueryEventToElement, sendNativeEventToElement, generateAndCompareScreenshot, get$Container} from 'test'
import {testMean, testMoments, testAreaOpacity} from "./index"
import { HighchartsComponent } from "../highchartsComponent";
import { reactionToPromise, waitAction } from "../../../../utility/utility";

export function runPDFTests(getEnzymeContainer, hasSingleColumn, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		testAreaOpacity(getEnzymeContainer, '.highcharts-series > path', expect)

		it('should be able to adjust degree of smoothing', function (done) {
			this.timeout(15 * 1000);

			const pathDescriptions = () => $(get$Container().find('.highcharts-series > path')[1]).attr('d');

			const setNewSmoothingAndCompare = (times) => {
				const $smoothingButton = get$Container().find('.smoothing .bp3-button');
				const previousPathDescription = pathDescriptions();
				sendNativeEventToElement($smoothingButton.get(0), 'click');
				window.setTimeout(() => {
					expect(pathDescriptions()).to.not.equal(previousPathDescription);

					if (--times == 0)
						done();
					else
						setNewSmoothingAndCompare(times);

				},1000)
			}

			setNewSmoothingAndCompare(5);
		})

		if (hasSingleColumn) {

			testMean(expect);
			testMoments(expect);

			it('should match percentile ranges', async function () {
				this.timeout(10000);

				let chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
				let percentileTextBox        = getEnzymeContainer().find('.percentiles > input');
				//$percentileTextBox.get(0).focus();
				percentileTextBox.getDOMNode().value = "0,25,40";
				// https://facebook.github.io/react/docs/test-utils.html
				percentileTextBox.simulate('change');
				//percentileTextBox.simulate('keyDown', {key: "Enter", keyCode: 13, which: 13});
				//$percentileTextBox.blur();

				await waitAction(() => percentileTextBox.simulate('keyDown', {key: "Enter", keyCode: 13, which: 13}), reactionToPromise(() => chartComponent.busy, false))

				let xAxis = get$Container().find('.highcharts-xaxis-labels').get(1);

				let xAxisLabels = [].slice.call(xAxis.children).filter((child) => child.firstChild != null && child.innerHTML != "").map((child) => {
					return parseInt(child.innerHTML);
				});
				console.log(_.sortBy(xAxisLabels));
				expect(_.sortBy(xAxisLabels)).to.deep.equal([0, 25, 40, 50, 60, 75, 100])
			})

			it('should show percentile tooltip', function () {
				this.timeout(10000);

				let xAxisLabel = get$Container().find('.highcharts-xaxis-labels').get(1).children[1];
				sendNativeEventToElement(xAxisLabel, 'mouseover');

				expect(get$Container().find('.highcharts-tooltip').attr('visibility')).to.equal("visible");
				expect(get$Container().find('.highcharts-tooltip').attr('opacity')).to.equal("1");
			})
		}

	}
}