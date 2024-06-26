import { BlueprintDialog, bp, sem, SimulationCard } from 'components'
import {OmdbTagForm} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/ManageTags/OmdbTagEditDialog';
import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {BlueprintFileInput} from 'components/widgets/BlueprintFileInput';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import type {QuerySave, SimulationGuid, ObjectNameCheckerResult} from 'stores';
import {
	queryStore, utility, routing, site, constants, simulationStore, settings, QueryDescriptor,
	Simulation, mobx, appIcons, Query, i18n
} from 'stores';
import { observer } from 'mobx-react'
import {
	observable,
	computed,
	autorun,
	action,
	IReactionDisposer,
	makeObservable, reaction,
} from 'mobx';
import { MultiSelect } from "@blueprintjs/select";
import {ObjectChooser} from '../ObjectChooser/ObjectChooser';

import * as dialogCss from '../../site/dialogs.css';
import * as css from './QueryPropertiesDialog.css';

interface MyProps {
	query?: QueryDescriptor;
	defaultName?: string;
	simulationIds?: SimulationGuid[];
	focusTarget?: 'name' | 'simulations' | 'querySpecification';
	onClosing?: () => void;
}

const SimulationMultiSelect = MultiSelect.ofType<Simulation>();


@observer
export class QueryPropertiesDialog extends React.Component<MyProps, {}> {
    static defaultProps = {
		focusTarget: 'name'
	}
    _disposers: IReactionDisposer[] = [];

    @observable simulationIds: SimulationGuid[] = [];
    @observable updating = false;
    @observable errorMessage = null;

	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;

    omdbTagFormRef;
	@observable allRequiredTagSelected = !!this.props.query;

	@observable queryObject: Query;

    constructor(props: MyProps) {
        super(props);

	    const { simulationIds, query } = props;
		this.simulationIds = query ? query.simulationIds : simulationIds ? simulationIds : [];

		query && queryStore.getQuery(query.id).then(action(q => this.queryObject = q));

		makeObservable(this);

	    this._disposers.push(
		    autorun(() => {
			    simulationStore.bulkLoadDescriptors(this.simulationIds);
		    })
	    );
    }

	get queryAlreadyExist() {
		return this.props.query != null;
	}

	@computed get name() {
		return this.nameInputFieldResult?.input;
	}

	@computed get queryIsLoading() {
		return this.props.query ? this.queryObject?.isLoading !== false : false;
	}

	@computed get actionsDisabled() {
		return this.updating;
	}

	@computed get okDisabled() {
		return this.actionsDisabled || _.isEmpty(this.simulationIds) || this.hasValidName !== true || this.allRequiredTagSelected !== true || this.queryIsLoading;
	}

	@computed get hasError() {
		return this.errorMessage != null;
	}

    @computed
	get simulationOptions() {
		return mobx.values(simulationStore.simulations).filter(sim => sim.status.toString() === 'Complete').map(sim => ({ value: sim.id, label: sim.displayPath }))
	}

    @computed
	get simulationSelectedOptions() {
		return this.simulationIds && this.simulationIds.length > 0 ? this.simulationOptions.filter(opt => this.simulationIds.indexOf(opt.value) >= 0 ) : null;
	}

	@computed
	get dialogMessage(): string {
		if (this.queryIsLoading) {
			return i18n.common.MESSAGE.WITH_VARIABLES.WAITING_READY(Query.OBJECT_NAME_SINGLE)
		}

		if (this.actionsDisabled) {
			return this.queryAlreadyExist ?
			       i18n.common.MESSAGE.WITH_VARIABLES.MODIFYING(Query.OBJECT_NAME_SINGLE):
			       i18n.common.MESSAGE.WITH_VARIABLES.CREATING(Query.OBJECT_NAME_SINGLE)
		}

		return this.hasError ? this.errorMessage : null;
	}

    get queryInNewTab() {
		return settings.query.newQueryInNewTab
	}

    set queryInNewTab(v) {
		settings.query.newQueryInNewTab = v
	}

    componentWillUnmount(): void {
		this._disposers.forEach(f => f());
	}

    render() {
		const { queryAlreadyExist, dialogMessage, hasError,okDisabled, actionsDisabled,
			props: {focusTarget, simulationIds: ignore, query, children, ...props } } = this;

		/*
		// Removed until we have a page that can create the query during load
		 additionalFooter={() => <Checkbox className={classNames(css.openInNewTab)}
		 tabIndex={3}
		 checked={queryInNewTab}
		 onChange={() => this.queryInNewTab = !queryInNewTab}
		 label="Open in New Tab?"/>}

		*/

	    const dialogTitle :string = !queryAlreadyExist ?
	                        i18n.common.OBJECT_CTRL.WITH_VARIABLES.NEW_SESSION(Query.OBJECT_NAME_SINGLE) :
	                        i18n.intl.formatMessage({defaultMessage: 'Modify Query', description: "[QueryPropertiesDialog]  Dialog title - show when modify a Query session's properties"});

		const okBtnTooltip :string = okDisabled && !actionsDisabled ?
		                             i18n.intl.formatMessage({defaultMessage: "You must name the query and select a simulation", description: "[QueryPropertiesDialog] ok button tooltip - the required field must be filled"}) :
		                             null;

		return (
			<BlueprintDialog
				className={classNames(css.root, dialogCss.newObjectDialog)}
				icon="search"
				{...props}
				canCancel={!actionsDisabled}
				title={dialogTitle}
				ok={this.ok}
				message={dialogMessage}
				error={hasError}
				okDisabled={okDisabled}
				okTitle={okBtnTooltip}
			>
				<bp.Label tabIndex={0}>
					<span className={classNames(dialogCss.fieldLabelAlignTop, dialogCss.requiredField)}>{i18n.common.WORDS.NAME}</span>
					<NameInputField
						value={queryAlreadyExist ? query.name : this.props.defaultName}
						excludeCheckObjectId={queryAlreadyExist ? query.id : null}
						objectType={Query.ObjectType}
						autoFocus={focusTarget == 'name'}
						disabled={actionsDisabled}
						onChange={action((e, component) => this.hasValidName = component.hasValidName)}
						onUpdateResult={action((result, component) => {
							this.hasValidName = component.hasValidName;
							this.nameInputFieldResult = result;
						})}
					/>
				</bp.Label>

				<bp.Label tabIndex={1}>
					<span className={dialogCss.requiredField}>{Simulation.OBJECT_NAME_MULTI}</span>
					<div>
						<input style={{display: "none"}}/>
						<ObjectChooser<Simulation>
							objectType={Simulation}
							launcherClassName={classNames(bp.Classes.INPUT, {[bp.Classes.DISABLED]: actionsDisabled})}
							canMultiSelect={true}
							selections={this.simulationIds.map(id => simulationStore.simulations.get(id)).filter(s => s != null)}
							chooseItemFilters={{status: ["Complete"]}}
							onSave={action((simulations: Simulation[]) => {
								this.simulationIds = simulations && simulations.map(s => s._id);
							})}
						/>
					</div>
				</bp.Label>

				{/* , inputProps: { placeholder: 'Choose Simulation(s)...'}  */}

				<bp.Label tabIndex={2} className={dialogCss.definitionFileField}>
					<span><FormattedMessage defaultMessage={"Query Specification"} description={"[QueryPropertiesDialog] field name - Specification file upload input"}/></span>
					<BlueprintFileInput
						autoFocus={focusTarget == 'querySpecification'}
						disabled={actionsDisabled}
						accept={"application/json"}
						onfileListChange={this.onFileOpenInput_Change}
					/>
				</bp.Label>

				<bp.Label tabIndex={2} className={dialogCss.definitionFileField}>

				</bp.Label>

				{!query && <OmdbTagForm
					objectType={"Query"}
					ref={ r => this.omdbTagFormRef = r}
					selectionStatusUpdate={action((status) => this.allRequiredTagSelected = status)}
					disabled={actionsDisabled}
				>{(tag, selector,index) => {
					return <bp.Label tabIndex={3+index} key={`${tag.name}_index`}>
						<div className={dialogCss.requiredField}>{tag.name}</div>
						{selector}
					</bp.Label>
				}}</OmdbTagForm>}

				{/*<label className={classNames(css.queryName, "pt-label")} tabIndex={2}>*/}
				{/*<span>Create where?</span>*/}
				{/*<ReactSelect*/}
				{/*className="pt-input-group"*/}
				{/*value={createWhere} clearable={false}*/}
				{/*options={createWhereOptions}*/}
				{/*onChange={(option: __ReactSelect.Option<CreateWhere>) => this.createWhere = option.value}*/}
				{/*/>*/}
				{/*</label>*/}
			</BlueprintDialog>);
	}

    @observable files: FileList;

    @action onFileOpenInput_Change = (fileList: FileList) => {
		this.files = fileList;

		this.errorMessage =
			this.files.length === 1 && !this.files[0].name.toLowerCase().endsWith('.json')
				? i18n.common.MESSAGE.WITH_VARIABLES.FILE_TYPE_MUST_BE(i18n.common.FILE_CTRL.JSON)
				: null;
	}

	@action ok = async () => {
		const {okDisabled, name, simulationIds, queryInNewTab, props: {query: existingQuery}} = this;

		if (okDisabled) {
			throw new Error("Cannot call ok() when disabled")
		}

		try {
			site.busy = true;

			this.updating = true;
			let tagValues = this.omdbTagFormRef ? this.omdbTagFormRef.getSelectedTagValues() : null;
			let queryId: string;

			if (existingQuery) {
				queryId = existingQuery.id;
				if (name != existingQuery.name) {
					await existingQuery.rename(name);
				}
				await existingQuery.switchSimulations(simulationIds, true);


				if (this.files && this.files.length === 1) {
					const reader     = new FileReader();
					reader.onloadend = async loaded => {
						const definitionJson = JSON.parse(loaded.target['result'] as string) as QuerySave;
						await (existingQuery as Query).reset(definitionJson);

					}
					reader.readAsText(this.files[0]);
				}

			} else {
				if (this.files && this.files.length === 1) {
					const promise = new Promise<string>((res, rej) => {
						const reader     = new FileReader();
						reader.onloadend = async loaded => {
							try {
								const definitionJson = JSON.parse(loaded.target['result'] as string) as QuerySave;

								// Load the query definition
								const id = await queryStore.createQuerySessionDescriptor(name, simulationIds, definitionJson, !(false && queryInNewTab), tagValues);
								res(id)
							} catch (err) {
								this.errorMessage = err.message;
								rej(err);
							}
						}

						reader.onerror = (error: any) => {
							this.errorMessage = error.message;
							site.raiseError(error.error);
						}

						reader.readAsText(this.files[0]);
					});

					queryId = await promise;
				} else {
					queryId = await queryStore.createQuerySessionDescriptor(name, simulationIds, null, !(false && queryInNewTab), tagValues);
				}
			}

			this.updating = false;

			const url = routing.routeFor.query(queryId);

			site.toaster.show({
				intent: bp.Intent.SUCCESS,
				message: existingQuery ?
				         i18n.common.MESSAGE.WITH_VARIABLES.MODIFIED(Query.OBJECT_NAME_SINGLE, name):
				         i18n.common.MESSAGE.WITH_VARIABLES.CREATED(Query.OBJECT_NAME_SINGLE, name)
			})

			if (false && queryInNewTab) {
				utility.openInNewTab(url);
			} else if (queryId && existingQuery instanceof Query && existingQuery.updateURLFromNavigation) {
				routing.push(url, constants.dialogAnimationMs);
			}

			return queryId;
		}
		finally {
			site.busy = false;
		}
	}
}