

import {get$Container, simulateMouseEvent} from 'test';
import {waitCondition} from 'utility';

export function runDirectionalConstraintTests(expect){
	it("can render and verify contents", function () {
		// display data only no any data switch
		expect(get$Container().find('.bp3-html-table').length).to.eq(1);
		expect($('tbody th:contains("Asset Class")').length).to.eq(46);
	});

	it("can customize display content", async function () {
		// display data only no any data switch
		expect($('#inheritButton').length).to.eq(1);
		expect($('#specifyButton').length).to.eq(1);

		expect($('#inheritButton').is('.bp3-active')).to.eq(true);

		simulateMouseEvent($('#specifyButton')[0], 'click');
		await waitCondition(() => !$('#inheritButton').is('.bp3-active'));
		expect($('#specifyButton').is('.bp3-active')).to.eq(true);

		expect($('.bp3-button:contains("Select Content")').length).to.eq(1);
		simulateMouseEvent($('.bp3-button:contains("Select Content")')[0], 'click');

		await waitCondition(() => $('.bp3-menu').length == 1 )

		// verify contents
		expect($('.bp3-switch').length).to.eq(3);

		expect(($('.bp3-switch input')[0] as any).checked).to.eq(false);
		expect(($('.bp3-switch input')[1] as any).checked).to.eq(true);
		expect(($('.bp3-switch input')[2] as any).checked).to.eq(true);

		//switch content
		simulateMouseEvent($('.bp3-switch')[0], 'click');
		await waitCondition(() => ($('.bp3-switch input')[0] as any).checked );

		expect(($('.bp3-switch input')[1] as any).checked).to.eq(false);

		simulateMouseEvent($('.bp3-switch')[2], 'click');
		await waitCondition(() => !($('.bp3-switch input')[2] as any).checked );
		expect(($('.bp3-switch input')[0] as any).checked).to.eq(true);
		expect(($('.bp3-switch input')[1] as any).checked).to.eq(false);
		expect(($('.bp3-switch input')[2] as any).checked).to.eq(false);

	});

	it("can close menu", async function () {
		this.timeout(1000);
		simulateMouseEvent($('.bp3-button:contains("Select Content")')[0], 'click');

		await waitCondition(() => $('.bp3-menu').length == 0 )
	});
}