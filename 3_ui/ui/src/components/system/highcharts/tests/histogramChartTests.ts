import {get$Container, sendNativeEventToElement} from 'test'
import { sleep } from '../../../../utility';
import {testAreaOpacity} from "./index"

export function runHistogramTests(getEnzymeContainer, hasSingleColumn:boolean, isPhantomJS:boolean, expect)
{
	if (isPhantomJS) {
	}
	else {

		testAreaOpacity(getEnzymeContainer, '.highcharts-series > rect', expect)

		it(`should be able to adjust degree of smoothing`, function () {

			let $smoothingButton = get$Container().find('.smoothing');

			const seriesRectHeights = () => {
				return [].slice.call(get$Container().find('.highcharts-series > rect')).map((rect) => $(rect).attr("height"));
			}

			for (let i = 0; i < 3; i++)
			{
				let previousHeights = seriesRectHeights();
				sendNativeEventToElement($smoothingButton.get(0), 'click');
				expect(seriesRectHeights()).to.not.equal(previousHeights);
			}
		})

		if (!hasSingleColumn) {
			it('should highlight series on series hover', async function () {
				let hoverRect = get$Container().find('.highcharts-series-0 > rect').get(0);
				sendNativeEventToElement(hoverRect, 'mouseover');

				await sleep(200); // await animation

				// Verify that all series except the selected series were dimmed.
				expect(get$Container().find('.highcharts-series:not(.highcharts-series-0)').attr("opacity")).to.equal("0.2")
			})

			it('should highlight series on legend hover', async function () {
				let hoverRect = get$Container().find('.highcharts-legend-item.highcharts-series-0').get(0);
				sendNativeEventToElement(hoverRect, 'mouseover');

				await sleep(200); // await animation

				// Verify that all series except the selected series were dimmed.
				expect(get$Container().find('.highcharts-series:not(.highcharts-series-0)').attr("opacity")).to.equal("0.2")
			})
		}

	}
}