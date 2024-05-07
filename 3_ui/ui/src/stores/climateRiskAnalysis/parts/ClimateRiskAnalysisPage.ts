import {BookPage} from '../../book/BookPage';
import {climateRiskAnalysisStore} from '../ClimateRiskAnalysisStore';

export class ClimateRiskAnalysisPage extends BookPage {
	viewHasData(id) {
		const userOptions = this.getViewUserOptions(id);
		const view = this.getView(id);
		let hasData = false;

		if (climateRiskAnalysisStore.views[view.name].isInput) {
			hasData = true;
		}
		else {
			//TODO
		}

		return true;
	}
}
