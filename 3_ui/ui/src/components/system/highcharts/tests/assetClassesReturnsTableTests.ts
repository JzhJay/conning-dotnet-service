import {get$Container} from 'test';

export function runAssetClassesReturnsTableTests(expect){
	it("can render and verify contents", function () {
		// display data only no any data switch
		expect(get$Container().find('.bp3-html-table').length).to.eq(1);
		expect($('.AssetClassesReturnsTableView__asset-class').length).to.eq(46);
	});
}