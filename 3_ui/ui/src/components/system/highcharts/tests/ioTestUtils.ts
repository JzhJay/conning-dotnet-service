import {reactionToPromise, waitCondition} from '../../../../utility';

export const waitChartFrontierData = async (io, viewName, updateCount, showFrontier) => {
	const page = io.pages[0];
	const view = page.selectedViews.find(v => v.name == viewName);

	if (page.viewHasData(view.id)) {
		await reactionToPromise(() => view.userOptions.showEfficientFrontier, showFrontier);
	}
	else {
		await waitCondition(() => {
			return io.updateCount > updateCount;
		}, 1000);
	}
}