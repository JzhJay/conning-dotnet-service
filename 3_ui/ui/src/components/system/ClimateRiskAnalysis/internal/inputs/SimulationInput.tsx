import {CopyLocationContextMenuWrapper, LoadingUntil} from 'components';
import {ObjectChooser} from 'components/system/ObjectChooser/ObjectChooser';
import {computed, observable, makeObservable, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {appIcons, ClimateRiskAnalysis, climateRiskAnalysisStore, Repository, Simulation, simulationStore, site, xhr} from 'stores';

import * as layoutCss from '../../../inputSpecification/InputSpecificationComponent.css';
import * as css from './SimulationInput.css';

interface SimulationInputProps {
	climateRiskAnalysis: ClimateRiskAnalysis
}

@observer
export class SimulationInput extends React.Component<SimulationInputProps, any> {

	@observable _loading = true;

	constructor(props) {
        super(props);
        makeObservable(this);
        if (!simulationStore.hasLoadedDescriptors) {
			simulationStore.loadDescriptors().then(action(()=> this._loading = false));
		} else {
			this._loading = false;
		}
    }

	@computed get selection() {
		const simulationObjectId = this.props.climateRiskAnalysis.inputState.simulationObjectId;
		if (!simulationObjectId) {
			return [];
		}
		const simulation = simulationStore.simulations.get(simulationObjectId);
		return simulation ? [simulation] : [];
	}

	render() {
		return <LoadingUntil loaded={!this._loading} style={{minHeight: "10px"}}>
			<CopyLocationContextMenuWrapper locationPath={["Simulation"]} nodeAttrs={{"className":layoutCss.root, "data-component-name": "SimulationInput"}}>
				<div className={classNames(layoutCss.inline, css.inline)}>
					<div className={layoutCss.title}>Simulation:</div>
					<div className={layoutCss.control}>
						<ObjectChooser<Simulation>
							objectType={Simulation}
							chooseItemFilters={climateRiskAnalysisStore.relatedSimulationFilter}
							selections={this.selection}
							onSave={this.onSave}
						/>
					</div>
				</div>
			</CopyLocationContextMenuWrapper>
		</LoadingUntil>;
	}

	onSave = async (selections: (Simulation|Repository)[]) => {
		const newId = (selections?.length == 1 ? selections[0]?.id : null ) || null;

		try {
			site.busy = true;
			const rtn: { runRequired: boolean }        = await xhr.post(`${this.props.climateRiskAnalysis.apiUrl}/edit/simulation`, {simulationId: newId});
			this.props.climateRiskAnalysis.runRequired = rtn.runRequired;
			this.props.climateRiskAnalysis.loadInputState();
		} finally {
			site.busy = false;
		}
	}
}