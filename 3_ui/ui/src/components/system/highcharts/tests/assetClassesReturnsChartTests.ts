import {get$Container, simulateMouseEvent} from 'test';
import {sleep, waitCondition} from 'utility';

export function runAssetClassesReturnsChartTests(expect){

    it("should have content selector", function () {
	    expect(get$Container().find('.bp3-align-left .bp3-button').length).to.eq(1);
    });

    it("verify popup menu content and switch return", async function () {
		simulateMouseEvent(get$Container().find('.bp3-align-left .bp3-button')[0], 'click');

	    await waitCondition(() => $('.bp3-menu').length == 1 )

	    // verify contents
	    expect($('.bp3-switch').length).to.eq(4);
	    expect($('.bp3-switch').last().is('.bp3-disabled')).to.eq(true);

	    expect(($('.bp3-switch input')[0] as any).checked).to.eq(false);
	    expect(($('.bp3-switch input')[1] as any).checked).to.eq(true);

		// switch and rollback
	    simulateMouseEvent($('.bp3-switch')[0], 'click');
		await sleep(500);

	    expect(($('.bp3-switch input')[0] as any).checked).to.eq(true);
	    expect(($('.bp3-switch input')[1] as any).checked).to.eq(false);

	    simulateMouseEvent($('.bp3-switch')[1], 'click');
	    await sleep(500);
	    expect(($('.bp3-switch input')[0] as any).checked).to.eq(false);
	    expect(($('.bp3-switch input')[1] as any).checked).to.eq(true);

    });

    it("can close menu", async function () {
		this.timeout(1000);
	    simulateMouseEvent(get$Container().find('.bp3-align-left .bp3-button')[0], 'click');

	    await waitCondition(() => $('.bp3-menu').length == 0 )
    });

}