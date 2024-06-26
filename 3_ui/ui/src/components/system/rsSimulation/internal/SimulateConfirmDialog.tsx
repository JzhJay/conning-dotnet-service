import {BlueprintDialog, bp, LoadingIndicator, SortableCardsPanel} from 'components';
import {action, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {RSSimulation, i18n, omdb, Simulation, simulationStore, site} from 'stores';
import {formatLabelText} from 'utility';
import * as css from './SimulateConfirmDialog.css'

export const getSimulateRunFunc = (rsSimulation: RSSimulation) :(() => Promise<void>) => {
	if (rsSimulation.isFIRM && rsSimulation.useCase == null) {
		return async () => site.setDialogFn(() => <SimulateConfirmDialog rsSimulation={rsSimulation} />);
	} else {
		return rsSimulation.run;
	}
}

@observer export class SimulateConfirmDialog extends React.Component<{rsSimulation: RSSimulation}, any>{

	simulation: Simulation;
	@observable message = null;

	constructor(props) {
		super(props);

		makeObservable(this);
		this.simulation = simulationStore.simulations.get(props.rsSimulation._id);
	}

	inputRef;

	setInputRef = (ref) => {
		this.inputRef = ref;
		if (ref) {
			$(ref.inputElement).on('keydown', e => {
				if (e.keyCode == 13) {
					e.stopPropagation();
				}
			});
		}
	}

	onOK = async () => {
		await this.checkCommentsUpdate();
		await this.props.rsSimulation.run();
		return 'ok';
	}

	checkCommentsUpdate = async () => {
		if (!this.inputRef?.inputElement) {
			return; // not been into edit mode before.
		}

		let value = _.escape(this.inputRef.inputElement.value) || "";
		value = value.replace(/(^[\n\r]*)|([\n\r\s]*$)/g, "");
		if (value == _.get(this.simulation, SortableCardsPanel.COMMENTS_FIELD, "")) {
			return;
		}
		const sim = this.simulation;
		this.message = i18n.common.MESSAGE.WITH_VARIABLES.SAVING(i18n.databaseLookups.tags[SortableCardsPanel.COMMENTS_FIELD]);
		await omdb.updatePartial(Simulation.ObjectType, sim._id, {[SortableCardsPanel.COMMENTS_FIELD]: value})
			.then(action(updates => { _.assign(sim, updates);}))
			.finally(action(() => {
				this.message = null;
			}));
	}

	render() {
		if (!this.simulation) {
			return <LoadingIndicator/>
		}

		return <BlueprintDialog
			className={css.root}
			title={i18n.intl.formatMessage({defaultMessage: "Run Simulation", description: "[SimulateConfirmDialog] dialog title"})}
			message={this.message}
			okDisabled={this.message != null}
			okText={(<>
				<bp.Icon icon={"play"} size={16} />
				<FormattedMessage defaultMessage={"Start Scenario Generation"} description={"[SimulateConfirmDialog] dialog run button text - start simulate"}/>
			</>) as any}
			ok={this.onOK}
		>
			<div>{formatLabelText(SortableCardsPanel.COMMENTS_FIELD)}</div>
			<bp.Callout>
				<bp.EditableText
					defaultValue={_.get(this.simulation, SortableCardsPanel.COMMENTS_FIELD, "") || ""}
					disabled={this.message != null}
					selectAllOnFocus={true}
					multiline={true}
					minLines={3}
					ref={this.setInputRef}
				/>
			</bp.Callout>

		</BlueprintDialog>;
	}

}