import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import * as React from 'react';
import {Label} from '@blueprintjs/core';
import {AppIcon, BlueprintDialog, bp} from 'components';
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import type {ObjectNameCheckerResult} from 'stores'
import {Simulation, site, appIcons, simulationStore, ClimateRiskAnalysis, climateRiskAnalysisStore, i18n} from 'stores';
import { observer } from 'mobx-react'
import {observable, computed, action, makeObservable, toJS} from 'mobx';
import {ObjectChooser} from '../ObjectChooser/ObjectChooser';

import * as dialogCss from '../../site/dialogs.css';


interface MyProps {
	defaultName?: string;
	onClosing?: () => void;
	simulationId?: string;
}

@observer
export class CRAPropertiesDialog extends React.Component<MyProps, {}> {

	@observable updating = false;
	@observable isError: boolean = false;
	@observable message: string = null;

	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;

	omdbTagFormRef;
	@observable allRequiredTagSelected;

	@observable simulationId: string;

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);
		this.simulationId = props.simulationId;
    }

	@computed get name() {
		return this.nameInputFieldResult?.input;
	}

	@computed get actionsDisabled() {
		return this.updating;
	}

	@computed get okDisabled() {
		return this.actionsDisabled || this.hasValidName !== true || this.allRequiredTagSelected !== true;
	}

    render() {
		const { isError, message, updating, actionsDisabled, okDisabled,
			props: {defaultName} } = this;

		return (
			<BlueprintDialog
				className={classNames(dialogCss.newObjectDialog)}
				icon={<AppIcon icon={appIcons.cards.climateRiskAnalysis.cardIcon} style={{margin: 0}} large={true} />}
				title={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW_SESSION(ClimateRiskAnalysis.OBJECT_NAME_SINGLE)}
				ok={this.onOk}
				okDisabled={okDisabled}
				canCancel={!actionsDisabled}
				isCloseButtonShown={!actionsDisabled}
				error={isError}
				message={message}
			>
				<Label tabIndex={0}>
					<span className={classNames(dialogCss.fieldLabelAlignTop, dialogCss.requiredField)}>Name</span>
					<NameInputField
						objectType={ClimateRiskAnalysis.ObjectType}
						disabled={actionsDisabled}
						objectNameCheckerConfig={defaultName ? {defaultName} : null}
						onChange={action((e, component) => this.hasValidName = component.hasValidName)}
						onUpdateResult={action((result, component) => {
							this.hasValidName = component.hasValidName;
							this.nameInputFieldResult = result;
						})}
					/>
				</Label>

				<bp.Label tabIndex={1}>
					<span>Simulation</span>
					<div>
						<ObjectChooser<Simulation>
							objectType={Simulation}
							launcherClassName={classNames(bp.Classes.INPUT, {[bp.Classes.DISABLED]: actionsDisabled})}
							disabled={actionsDisabled}
							chooseItemFilters={climateRiskAnalysisStore.relatedSimulationFilter}
							selections={this.simulationId ? [simulationStore.simulations.get(this.simulationId)] : []}
							onSave={action((simulations: Simulation[]) => {
								this.simulationId = _.get(simulations, "0._id");
							})}
						/>
					</div>
				</bp.Label>

				<OmdbTagForm
					objectType={"ClimateRiskAnalysis"}
					ref={ r => this.omdbTagFormRef = r}
					selectionStatusUpdate={action((status) => this.allRequiredTagSelected = status)}
					disabled={actionsDisabled}
				>{(tag, selector,index) => {
					return <bp.Label tabIndex={2+index} key={`${tag.name}_index`}>
						<div className={dialogCss.requiredField}>{tag.name}</div>
						{selector}
					</bp.Label>
				}}</OmdbTagForm>

			</BlueprintDialog>);
	}

	onOk = action(async () => {
		const {okDisabled, name} = this;
		if (okDisabled) {
			throw new Error("Cannot call ok() when disabled")
		}

		this.isError = false;
		this.message = null;

		try {
			site.busy = true;
			this.updating = true;

			this.message = i18n.common.MESSAGE.WITH_VARIABLES.CREATING(ClimateRiskAnalysis.OBJECT_NAME_SINGLE);

			let tagValues = this.omdbTagFormRef ? this.omdbTagFormRef.getSelectedTagValues() : null;

			await climateRiskAnalysisStore.createNewClimateRiskAnalysis(name, this.simulationId, tagValues)

			this.message = i18n.common.MESSAGE.WITH_VARIABLES.CREATED(ClimateRiskAnalysis.OBJECT_NAME_SINGLE, name);
			site.toaster.show({intent: bp.Intent.SUCCESS, message: this.message});

			return 'ok';
		}
		finally {
			site.busy = false;
			this.updating = false;
		}
	})
}
