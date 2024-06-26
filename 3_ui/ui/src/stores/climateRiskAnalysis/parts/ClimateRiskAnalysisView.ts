import { observable, makeObservable } from 'mobx';
import {ClimateRiskAnalysis, ClimateRiskAnalysisViewName, ClimateRiskAnalysisViewUserOptions} from 'stores';
import {climateRiskAnalysisStore} from '../ClimateRiskAnalysisStore';

export class ClimateRiskAnalysisView {
	constructor(public name: ClimateRiskAnalysisViewName, userOptions?: ClimateRiskAnalysisViewUserOptions) {
        makeObservable(this);
        this.id = uuid.v4();
        this.label = climateRiskAnalysisStore.views[this.name].label;
        this.userOptions = userOptions;
        const defaultOptions = climateRiskAnalysisStore.defaultUserOptions(this.name);

        if (this.userOptions == null)
			this.userOptions = defaultOptions;
		else // Pick up new defaults and merge in.
			this.userOptions = Object.assign({}, defaultOptions, userOptions);
    }

	id: string;
	@observable userOptions?: ClimateRiskAnalysisViewUserOptions;
	label: string;
	oldIndex: number; // transient property used during re-order
}