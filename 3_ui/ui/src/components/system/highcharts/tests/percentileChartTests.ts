import {sendNativeEventToElement, JULIA_TAG, sleep, get$Container} from 'test'
import {testPercentileColor} from './commonTests'
import {reactionToPromise} from "../../../../utility/utility";
import { HighchartsComponent } from "../highchartsComponent";
import * as highchartsToolbarCss from './../../highcharts/toolbar/highchartsToolbar.css';


export function runPercentileChartTests(getEnzymeContainer, chartType, hasMultipleColumnAxes, doesSupportIndividualScenario, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		if (hasMultipleColumnAxes){
			it('should display legend in groups', function () {
				this.timeout(10000);
				// Verify that there is a percentiles section in the legend and one that shows the axes coordinates.

				const legendItems = get$Container().find('.highcharts-legend-item');
				//const legendItemsWithBlackRects = get$Container().find('.highcharts-legend-item > rect[fill*="0, 0, 0"]');

				const legendItemsWithBlackRectsAndPercentiles = [].slice.call(legendItems).filter((legendItem) => {
					return $(legendItem).find('text').get(0).innerHTML.includes("%") && $(legendItem).find('rect[fill*="0, 0, 0"]').length > 0;
				});

				const percentileTextBox = getEnzymeContainer().find('.percentiles > input');
				const percentileValues = percentileTextBox.getDOMNode().value.split(",");

				// Test that there are enough percentile legend items for every percentile value
				expect(legendItemsWithBlackRectsAndPercentiles).to.have.length.of.at.least(percentileValues.length);

				// Test that are more legend items than percentile legend items. The difference is the axes coordinates.
				expect(legendItems.length).to.be.greaterThan(legendItemsWithBlackRectsAndPercentiles.length);

			})

		} else{
			if (doesSupportIndividualScenario) {
				it('should display scenario on hover and sticky on click', async function () {
					this.timeout(50000);

					if (getEnzymeContainer(true).find(`.${highchartsToolbarCss.highchartsToolbar} .input.paths input`).props()["disabled"]) {
						let chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
						await reactionToPromise(() => chartComponent.chartData)
					}

					// let chart finish animation
					await sleep(2 * 1000);
					const $series = get$Container().find('.highcharts-series');
					if ($series.length > 2) {
						sendNativeEventToElement($series.get(0), 'mousemove');
						const hoverScenario = get$Container().find('.highcharts-series.highcharts-line-series:not(.mean-line)' );
						expect(hoverScenario.length).to.equal(1);

						// sticky the hover scenario
						const trackerSeries = get$Container().find('.highcharts-line-series.highcharts-tracker').get(0);
						sendNativeEventToElement(trackerSeries, 'click');
						expect(get$Container().find('.highcharts-series.highcharts-line-series:not(.mean-line)').length).to.equal(1);

						// Show a second hover scenario along with the previously stickied path. If the previous path wasn't stickied it will vanish
						sendNativeEventToElement($series.get(2), 'mousemove');
						expect(get$Container().find('.highcharts-series.highcharts-line-series:not(.mean-line)').length).to.equal(2);
					}

				})

				it('should update chart to match show scenarios list', function () {
					this.timeout(50000);

					const scenarioTextBox = getEnzymeContainer(true).find(`.${highchartsToolbarCss.highchartsToolbar} .input.paths input`);

					scenarioTextBox.getDOMNode().value = "0, 1, 2, 4";
					// https://facebook.github.io/react/docs/test-utils.html
					scenarioTextBox.simulate('change');
					scenarioTextBox.simulate('keyDown', {
						"key":      "Enter",
						"keyCode":  13,
						"which":    13,
						"code":     "Enter"
					});

					// Test that there are 4 scenario series visible.
					expect(get$Container().find('.highcharts-series.highcharts-line-series:not(.mean-line)').length).to.equal(4);
				})

				it('should show and hide the mean points when the toggle is clicked', function(done) {
					this.timeout(50000);

					// before click
					expect(get$Container().find('.highcharts-series.highcharts-line-series.mean-line path').length).not.to.equal(0);
					const toggleButton = get$Container().find(`.${highchartsToolbarCss.highchartsToolbar} button.meanValues`).get(0);

					// click
					sendNativeEventToElement(toggleButton, 'click');

					// after click
					expect(get$Container().find('.highcharts-series.highcharts-line-series.mean-line:not([visibility="hidden"]) path').length).to.equal(0);

					// clean up
					sendNativeEventToElement(toggleButton, 'click');

					done();
				})
			}


			it('should match selected percentile colors', function () {
				this.timeout(10000);

				if (chartType === "box")
					testPercentileColor('.highcharts-columnrange-series>rect', expect);
				else
					testPercentileColor('.highcharts-arearange-series>path', expect);
			})

		}

		it(`should match percentile ranges ${JULIA_TAG}`, function (done) {
			this.timeout(10000);

			let percentileTextBox        = getEnzymeContainer(true).find('.percentiles input');
			percentileTextBox.instance().value = "0,25,40";
			// https://facebook.github.io/react/docs/test-utils.html
			percentileTextBox.simulate('change');
			percentileTextBox.simulate('keyDown', {key: "Enter", keyCode: 13, which: 13});

			//TODO: currently don't have a good way to know when the percentiles have been updated. Maybe add a spinner and busy wait?
			window.setTimeout(() => {
				let legendItems = get$Container().find('.highcharts-legend-item > text');

				let legendItemNames = [].slice.call(legendItems).map((legendItem) => {
					return parseInt(legendItem.innerHTML.split("%")[0]);
				});

				let expected = [];
				if (chartType == "throughTimeStatistics") {
					expected= [0, 25, 40, 50, 60];
				} else {
					expected= [0, 25, 40, 50, 60, 75];
				}
				expect(_.sortBy(legendItemNames).slice(0, expected.length)).to.deep.equal(expected)
				done();
			}, 2000)
		})
	}
}