import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import * as React from 'react';
import {Label} from '@blueprintjs/core';
import {AppIcon, BlueprintDialog, bp} from 'components';
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import type {ObjectNameCheckerResult} from 'stores'
import {Simulation, ioStore, routing, site, constants, appIcons, IO, simulationStore, i18n} from 'stores';
import { observer } from 'mobx-react'
import {observable, computed, action, makeObservable, toJS} from 'mobx';
import {formatLabelText} from 'utility';
import {ObjectChooser} from '../ObjectChooser/ObjectChooser';

import * as dialogCss from '../../site/dialogs.css';
import * as css from './IOPropertiesDialog.css';

interface MyProps {
	defaultName?: string;
	focusTarget?: 'name' | 'ioSpecification';
	onClosing?: () => void;
	assetReturnsSimulationId?: string;
}

@observer
export class IOPropertiesDialog extends React.Component<MyProps, {}> {
    static defaultProps = {
		focusTarget: 'name'
	}

	dialogRef: BlueprintDialog;
    @observable updating = false;
    @observable errorMessage = null;

	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;

	omdbTagFormRef;
	@observable allRequiredTagSelected;
	@observable missingSimulations = [];

	@observable assetReturnsSimulationId: string;
	assetReturnsSimulationPath = ["data", "Data Sources", "Asset Returns", "Simulation"];

    constructor(props: MyProps) {
        super(props);
        makeObservable(this);

		this.assetReturnsSimulationId = props.assetReturnsSimulationId;
    }

	@computed get name() {
		return this.nameInputFieldResult?.input;
	}

	@computed get actionsDisabled() {
		return this.updating;
	}

	@computed get okDisabled() {
		const { missingSimulations } = this;
		let isReplaceAllMissionSimulations = true;
		if (missingSimulations && missingSimulations.length > 0) {
			isReplaceAllMissionSimulations = missingSimulations.every((s) => !!s.replacedSimulation);
		}

		return this.actionsDisabled || this.hasValidName !== true || this.allRequiredTagSelected !== true || !isReplaceAllMissionSimulations;
	}

	@computed get showAssetReturnsSimulation(): boolean {
		return !_.find(this.missingSimulations, missingSimulation => {
			return _.eq(JSON.stringify(missingSimulation.path), JSON.stringify(this.assetReturnsSimulationPath));
		})
	}

    render() {
		const { errorMessage, updating, actionsDisabled, okDisabled,
			props: {focusTarget, defaultName} } = this;

		return (
			<BlueprintDialog
				className={classNames(css.root, dialogCss.newObjectDialog)}
				icon={<AppIcon icon={appIcons.cards.ios.cardIcon} />}
				canCancel={!actionsDisabled}
				title={i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW_SESSION(IO.OBJECT_NAME_SINGLE)}
				ok={this.ok}
				message={updating ? i18n.common.MESSAGE.WITH_VARIABLES.CREATING(IO.OBJECT_NAME_SINGLE): errorMessage}
				error={errorMessage != null}
				okDisabled={okDisabled}
				ref={r => this.dialogRef = r}
			>
				<Label tabIndex={0}>
					<span className={classNames(dialogCss.fieldLabelAlignTop, dialogCss.requiredField)}>{i18n.common.WORDS.NAME}</span>
					<NameInputField
						objectType={IO.ObjectType}
						autoFocus={focusTarget == 'name'}
						disabled={actionsDisabled}
						objectNameCheckerConfig={defaultName ? {defaultName} : null}
						onChange={action((e, component) => this.hasValidName = component.hasValidName)}
						onUpdateResult={action((result, component) => {
							this.hasValidName = component.hasValidName;
							this.nameInputFieldResult = result;
						})}
					/>
				</Label>

				{this.showAssetReturnsSimulation && <bp.Label tabIndex={1}>
					<span>Asset Returns - Simulation</span>
					<div>
						<ObjectChooser<Simulation>
							objectType={Simulation}
							launcherClassName={classNames(bp.Classes.INPUT, {[bp.Classes.DISABLED]: actionsDisabled})}
							chooseItemFilters={ioStore.getRelatedSimulationFilter()}
							selections={this.assetReturnsSimulationId ? [simulationStore.simulations.get(this.assetReturnsSimulationId)] : []}
							onSave={action((simulations: Simulation[]) => {
								this.assetReturnsSimulationId = _.get(simulations, "0._id");
							})}
							disabled={actionsDisabled}
						/>
					</div>
				</bp.Label>}

				<Label tabIndex={2} className={dialogCss.definitionFileField}>
					<span>{i18n.common.FILE_CTRL.SPECIFICATION}</span>
					<label className={classNames("bp3-file-upload", bp.Classes.FILL)}>
						<input ref={r => this.fileOpenInput = r} id="fileOpenInput" type="file"
						       autoFocus={focusTarget == 'ioSpecification'}
						       disabled={actionsDisabled}
						       accept="application/json"
						       onChange={this.onFileOpenInput_Change}/>
						<span className={bp.Classes.FILE_UPLOAD_INPUT}>{<bp.Tag minimal>{(this.files?.length && this.files[0].name) || i18n.common.MESSAGE.CHOOSE_A_FILE}</bp.Tag>}</span>
					</label>
				</Label>

				{this.renderMissingSimulations()}

				<OmdbTagForm
					objectType={"InvestmentOptimization"}
					ref={ r => this.omdbTagFormRef = r}
					selectionStatusUpdate={action((status) => this.allRequiredTagSelected = status)}
					disabled={actionsDisabled}
				>{(tag, selector,index) => {
					return <bp.Label tabIndex={3+index} key={`${tag.name}_index`}>
						<div className={dialogCss.requiredField}>{tag.name}</div>
						{selector}
					</bp.Label>
				}}</OmdbTagForm>

			</BlueprintDialog>);
	}

    fileOpenInput: HTMLInputElement;

    @observable files: FileList;

	@action onFileOpenInput_Change = (e: React.FormEvent<HTMLInputElement>) => {
		this.files = this.fileOpenInput.files;
		this.errorMessage =
			this.files.length === 1 && !this.files[0].name.toLowerCase().endsWith('.json')
				? i18n.common.MESSAGE.WITH_VARIABLES.FILE_TYPE_MUST_BE(i18n.common.FILE_CTRL.JSON)
				: null;
		this.missingSimulations.length && setTimeout(() => this.dialogRef?.calInputsAlign(), 0);
		this.missingSimulations = [];
	}

	renderMissingSimulations = () => {
		const { missingSimulations } = this;
		if (missingSimulations.length > 0) {
			return (
				<>
				<br/>
				<bp.Callout intent={bp.Intent.PRIMARY} title={"Missing Simulation(s)"} icon={"warning-sign"}>
					The input specification file references missing simulations. Please choose new simulations to update references
				</bp.Callout>
				{missingSimulations.map((s, index) => {
					const { updating } = this;
					const { path, sims, replacedSimulation } = s;
					const pathLength = path.length;
					const selections = replacedSimulation ? [replacedSimulation] : [];
					const label = `${path[pathLength - 2]} - ${path[pathLength - 1]}`;
					const selectedTagValues= { status: ["Complete"] };
					if (path[pathLength - 1] === 'Repository') {
						selectedTagValues['sourceType'] = [Simulation.SOURCE_TYPE.REPOSITORY];
					}

					if (sims && sims.length > 0) {
						selectedTagValues['_id'] = sims.map((s) => s.id);
					}

					return (
						<Label tabIndex={1} key={label}>
							<span className={dialogCss.requiredField}>{label}</span>
							<div>
								<input style={{display: "none"}}/>
								<ObjectChooser<Simulation>
									objectType={Simulation}
									launcherClassName={classNames(bp.Classes.INPUT, {[bp.Classes.DISABLED]: updating}, {[css.missingSimulationWarnInput]: !replacedSimulation})}
									selections={selections}
									chooseItemFilters={selectedTagValues}
									onSave={(simulations: Simulation[]) => {
										s.replacedSimulation = simulations.length > 0 ? simulations[0] : null;
									}}
								/>
							</div>
						</Label>
					);
				})}
				</>
			);
		}

		return null;
	}

	ok = async () => {
		const {okDisabled, name} = this;
		if (okDisabled) {
			throw new Error("Cannot call ok() when disabled")
		}

		try {
			site.busy = true;

			this.updating = true;

			let ioId: string;
			let tagValues = this.omdbTagFormRef ? this.omdbTagFormRef.getSelectedTagValues() : null;

			if (this.files && this.files.length === 1) {
				const promise = new Promise<string>((res, rej) => {
					const reader     = new FileReader();
					reader.onloadend = async loaded => {
						try {
							const definitionJson = JSON.parse(loaded.target['result'] as string);

							if (this.assetReturnsSimulationId) {
								_.set(definitionJson, ['data', 'user_interface', ...this.assetReturnsSimulationPath], this.assetReturnsSimulationId);
							}

							// Load the io definition
							const { missingSimulations } = this;
							let replacedMissingSimulationIds = null;
							if (missingSimulations && missingSimulations.length > 0) {
								replacedMissingSimulationIds = missingSimulations.map((s) => {
									return { path: s.path, simulation: s.replacedSimulation._id }
								});
							}

							const id = await ioStore.createNewIOWithSpecFile(name, definitionJson, replacedMissingSimulationIds, tagValues);
							if (_.isArray(id)) {
								this.missingSimulations = observable.array(id);
							} else {
								res(id)
							}
						} catch (err) {
							this.errorMessage = err.message;
							rej(err);
						} finally {
							this.updating = false;
							if (this.missingSimulations.length) {
								this.dialogRef?.calInputsAlign();
							}
						}
					}

					reader.onerror = (error: any) => {
						this.errorMessage = error.message;
						site.raiseError(error.error);
					}

					reader.readAsText(this.fileOpenInput.files[0]);
				});

				ioId = await promise;
			} else {
				ioId = await ioStore.createNewIOWithSimulation(name, this.assetReturnsSimulationId, tagValues);
			}

			const url = IO.urlFor(ioId)

			if (ioId) {
				site.toaster.show({intent: bp.Intent.SUCCESS, message: i18n.common.MESSAGE.WITH_VARIABLES.CREATED(IO.OBJECT_NAME_SINGLE, name)})

				routing.push(url, constants.dialogAnimationMs);
			}

			return ioId;
		}
		finally {
			site.busy = false;
			this.updating = false;
		}
	}
}
