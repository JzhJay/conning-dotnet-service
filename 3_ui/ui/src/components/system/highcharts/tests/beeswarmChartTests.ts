import {sendNativeEventToElement, sleep, JULIA_TAG} from 'test'
import { runBoostHoverPointTests } from "./pointChartTests";
import { HighchartsComponent } from "../highchartsComponent";
import { reactionToPromise, waitAction } from "../../../../utility/utility";

export function runBeeswarmTests(getTestContainer, getEnzymeContainer, canStack, isPhantomJS, expect)
{
	if (isPhantomJS) {
	}
	else {

		runBoostHoverPointTests(getTestContainer, getEnzymeContainer, isPhantomJS, expect, "beeswarm")

		it('should remove all tooltips with remove all button', function () {
			let $testContainer = $(getTestContainer());
			const $removeTooltip = $testContainer.find('.remove-tooltips');

			sendNativeEventToElement($removeTooltip.get(0), 'click');

			expect($testContainer.find('.highcharts-tooltip').length).to.equal(1);
		})

		if (canStack) {
			it(`should be able to switch stacking mode ${JULIA_TAG}`, async function () {
				this.timeout(20 * 1000)
				let $testContainer = $(getTestContainer());
				const $stackColumn = $testContainer.find('.stack-column .toggle-stack');

				const chart = Highcharts.charts[Highcharts.charts.length - 1];
				const getRadius = () => chart.series[0].userOptions.marker.radius;
				const radiusBefore = getRadius();

				let chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
				await waitAction(() => sendNativeEventToElement($stackColumn.get(0), 'click'), reactionToPromise(() => chartComponent.busy, false))

				// Stacking should always produce a much smaller radius?
				expect(radiusBefore).to.be.greaterThan(getRadius() * 2)
			})
		}

		// TODO: Test resizing

	}
}