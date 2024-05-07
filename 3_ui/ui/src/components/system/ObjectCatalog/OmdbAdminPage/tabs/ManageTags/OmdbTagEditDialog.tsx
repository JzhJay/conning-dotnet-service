import {NameInputField} from 'components/system/ObjectNameChecker/NameInputField';
import {computed, observable, ObservableMap, ObservableSet, makeObservable, action, reaction} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {bp, BlueprintDialog} from 'components';
import {Label, Popover, Menu, MenuItem, Tag, Icon, MaybeElement} from '@blueprintjs/core';
import type {IOmdbQueryGraph, OmdbUserTag, ObjectNameCheckerResult} from 'stores'
import {
	apolloStore,
	omdb,
	saveTagValues,
	Simulation,
	site,
	utility
} from 'stores';

import * as dialogCss from '../../../../../site/dialogs.css';
import * as css from './OmdbTagEditDialog.css';

export interface OmdbTagEditDialogProps {
	objectType: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis";
	requiredTagsOnly?: boolean;
	defaultName?: string;
	defaultSelected?: string[];
	onCreate: (name: string, tagValues: string[]) => Promise<string>;
	saveTagOnCreate?: boolean;
	appIcon?: MaybeElement;
}

@observer
export class OmdbTagEditDialog extends React.Component<OmdbTagEditDialogProps, {}> {
    @observable updating = false;
    @observable message = '';
    @observable loading = true;
    @observable hasError = false;

	@observable hasValidName: boolean;
	@observable nameInputFieldResult: ObjectNameCheckerResult;

	omdbTagFormRef;
	@observable allRequiredTagSelected;


    constructor(props: OmdbTagEditDialogProps) {
        super(props);
        makeObservable(this);
    }

	@computed get name() {
		return this.nameInputFieldResult?.input;
	}

	@computed get actionsDisabled() {
		return this.updating;
	}

	@computed get OkDisabled() {
		return this.loading || this.actionsDisabled || this.hasValidName !== true || this.allRequiredTagSelected !== true;
	}

    render() {
		const { message, props: {objectType, requiredTagsOnly, defaultSelected, appIcon} } = this;

		const typeObjectDisplay = utility.formatLabelText(objectType);

		return (
			<BlueprintDialog
				className={classNames(css.root, dialogCss.newObjectDialog)}
				icon={ appIcon || "add" }
				title={`New ${typeObjectDisplay} Session`}
				message={message}
				isCloseButtonShown={!this.actionsDisabled}
				canCancel={!this.actionsDisabled}
				okDisabled={this.OkDisabled}
				okText={this.hasError ? 'Retry' : 'OK'}
				ok={this.ok}
				canEscapeKeyClose={!this.actionsDisabled}
				canOutsideClickClose={!this.actionsDisabled}
				onOpened={action(() => this.loading = false)}
			>
				<Label tabIndex={0}>
					<span className={classNames(dialogCss.fieldLabelAlignTop, dialogCss.requiredField)}>Name</span>
					<NameInputField
						objectType={objectType}
					    autoFocus={true}
						disabled={this.updating}
						onChange={action((e, component) => this.hasValidName = component.hasValidName)}
						onUpdateResult={action((result, component) => {
							this.hasValidName = component.hasValidName;
							this.nameInputFieldResult = result;
						})}
					/>
				</Label>

				<OmdbTagForm
					objectType={objectType}
					requiredTagsOnly={requiredTagsOnly}
					defaultSelected={defaultSelected}
					ref={ r => this.omdbTagFormRef = r }
					selectionStatusUpdate={action((status) => this.allRequiredTagSelected = status)}
					disabled={this.actionsDisabled}
				>{(tag, selector,index) => {
					return <bp.Label tabIndex={index+1} key={`${tag.name}_index`}>
						<div className={dialogCss.requiredField}>{tag.name}</div>
						{selector}
					</bp.Label>
				}}</OmdbTagForm>

			</BlueprintDialog>);
	}

    @action ok = async () => {
		const {OkDisabled, name, props: { onCreate, objectType, saveTagOnCreate } } = this;
		if (OkDisabled) {
			throw new Error("Cannot call ok() when disabled")
		}

		this.updating = true;
		site.busy = true;
		try {
			const tagValueIds = this.omdbTagFormRef.getSelectedTagValues();
			const typeObjectDisplay = utility.formatLabelText(objectType);

			this.message = `Creating ${typeObjectDisplay}...`;
			const objectId = await onCreate(name, tagValueIds);

			if (saveTagOnCreate === true) {
				this.message = `Saving tags...`;
				await saveTagValues(objectType, objectId, tagValueIds);
			}

			this.message = `Created ${typeObjectDisplay} '${name}'`;
			site.toaster.show({intent: bp.Intent.SUCCESS, message: this.message});

			this.hasError = false;
			return "ok";
		}
		catch (e) {
			this.hasError = true;
			this.message = `Error: ${e.message}`;
		}
		finally {
			this.updating = false;
			site.busy = false;
		}
	}
}

interface OmdbTagFormProps {
	objectType: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis";
	requiredTagsOnly?: boolean;
	defaultSelected?: string[];
	disabled?: boolean;
	children: (tag: OmdbUserTag, tagValueSelect: React.ReactNode, index: number) => React.ReactNode;
	selectionStatusUpdate: (allRequiredTagSelected: boolean ) => void;
}

@observer
export class OmdbTagForm extends React.Component<OmdbTagFormProps, {}> {

	static async getUserTagsByObjectType(objectType: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis"): Promise<Array<OmdbUserTag>> {
		let r = await apolloStore.client.query<IOmdbQueryGraph>({
			query:     omdb.graph.objectType,
			variables: {objectType: objectType}
		});
		return r.data?.omdb.objectType.userTags || [];
	}

	static async hasRequiredUserTagsByObjectType(objectType: "UserFile" | "Simulation" | "Query" | "InvestmentOptimization" | "ClimateRiskAnalysis"): Promise<boolean> {
		let requiredUserTags = (await OmdbTagForm.getUserTagsByObjectType(objectType)).filter(ut => ut.required);
		return requiredUserTags.length > 0;
	}

	@observable selectedTagValues: ObservableMap<string, ObservableSet<string>> = null;

	@observable userTags: OmdbUserTag[];

	@observable loading = true;

	private _dispose = [];

	constructor(props) {
        super(props);
        makeObservable(this);
        OmdbTagForm.getUserTagsByObjectType(this.props.objectType).then( action( tags => {
			this.userTags = tags;

			const defaultSelected = this.props.defaultSelected;
			this.selectedTagValues = observable.map<string, ObservableSet<string>>({});
			if (defaultSelected && defaultSelected.length) {
				this.userTags.forEach( ut => ut.values && ut.values.forEach( utv => {
					if (defaultSelected.indexOf(utv._id) >= 0) {
						if (this.selectedTagValues.has(ut._id)) {
							this.selectedTagValues.get(ut._id).add(utv._id);
						} else {
							this.selectedTagValues.set(ut._id, observable.set<string>([utv._id]));
						}
					}
				}));
			} else {
				this.userTags.forEach( ut => ut.values && ut.values.forEach( utv => {
					if (utv.isDefault) {
						if (this.selectedTagValues.has(ut._id)) {
							this.selectedTagValues.get(ut._id).add(utv._id);
						} else {
							this.selectedTagValues.set(ut._id, observable.set<string>([utv._id]));
						}
					}
				}));
			}

			this.loading = false;
		}));

		const selectionStatusUpdateFunc = this.props.selectionStatusUpdate;
		selectionStatusUpdateFunc && this._dispose.push(reaction(() => this.allRequiredTagSelected, selectionStatusUpdateFunc));
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	@computed get requiredUserTags() {
		return this.userTags ? this.userTags.filter(ut => ut.required) : [];
	}

	@computed get displayUserTags() {
		return this.props.requiredTagsOnly !== false ? this.requiredUserTags : ( this.userTags || [] );
	}

	@computed get allRequiredTagSelected() :boolean {
		if (this.loading ) {
			return false;
		}
		let selected = true;
		this.requiredUserTags.forEach( ut => {
			selected = selected && this.selectedTagValues.has(ut._id) && this.selectedTagValues.get(ut._id).size > 0;
		});
		return selected;
	}

	getSelectedTagValues() {
		let values = [];
		this.selectedTagValues?.forEach( v => v.forEach( id => values.push(id)));
		return values;
	}

	saveToDataBase = async (objectId) => {
		let values = this.getSelectedTagValues();
		await saveTagValues(this.props.objectType, objectId, values);
	}

	render() {
		const disabled = this.props.disabled;
		return this.loading ? null : <> {
			this.displayUserTags.filter(tag => tag?.values?.length > 0).map((tag, i) => {
				return this.props.children( tag, <TagValueSelect tag={tag} selectedTagValues={this.selectedTagValues} disabled={disabled}/>, i);
			})
		}</>
	}
}

interface TagValueSelectProps {
	tag: OmdbUserTag,
	selectedTagValues: ObservableMap<string, ObservableSet<string>>,
	disabled?: boolean;
}

@observer
class TagValueSelect extends React.Component<TagValueSelectProps, {}> {
    constructor(props: TagValueSelectProps) {
        super(props);
        makeObservable(this);
    }

    @computed get selectedItems() {
		const {tag, selectedTagValues} = this.props;
		return selectedTagValues.has(tag._id) ? tag.values.filter( tv => selectedTagValues.get(tag._id).has(tv._id)) : [];
	}

    @computed get hasSelectedItems() {
		const {tag, selectedTagValues} = this.props;
		return selectedTagValues.has(tag._id) && selectedTagValues.get(tag._id).size > 0;
	}

    switchTagValue = (tagValueId: string) => {
		const {tag, selectedTagValues, disabled} = this.props;

		if (disabled) {
			return;
		}

		if (!selectedTagValues.has(tag._id)) {
			selectedTagValues.set(tag._id, observable.set<string>([tagValueId]));
			return;
		}

		const tagValueSet = selectedTagValues.get(tag._id);
		if (tagValueSet.has(tagValueId)) {
			tagValueSet.delete(tagValueId);
			return;
		}

		if (!tag.multiple) {
			tagValueSet.clear();
		}
		tagValueSet.add(tagValueId);

	}

    removeTagValue = (tagId: string) => {
		const {tag, selectedTagValues, disabled} = this.props;
		if (disabled) {
			return;
		}
		selectedTagValues.get(tag._id)?.delete(tagId);
	}

    getTagValueName = (tagValue) => {
		return tagValue.label ? tagValue.label : tagValue.value;
	}

    getTagValueStyle = (tagValue) => { return {
		background: tagValue.background,
		color: tagValue.color,
		margin: "2px 5px 2px 0 !important"
	}}


    render() {

		const {tag, disabled} = this.props;
		const hasSelectedItems = this.hasSelectedItems;

		return <Popover position={bp.Position.BOTTOM_LEFT} disabled={disabled} portalClassName={css.dropdown}
            content={<Menu>
				{tag.values.map( v => <MenuItem
					key={`menuItem_${v._id}`}
					onClick={() => this.switchTagValue(v._id)}
					text={<Tag style={this.getTagValueStyle(v)} large={true}>{this.getTagValueName(v)}</Tag>}
					icon={this.selectedItems.indexOf(v) >= 0 ? "tick" : "blank"}
				/>)}
			</Menu>}>
			<div className={classNames([css.tagValueSelect, "bp3-input", {["bp3-disabled"]: disabled}])}>
				<div className={classNames([css.tagValueSelectItems, {[css.empty]: !hasSelectedItems}])}>
					{ !hasSelectedItems ?
					  `Choose tag value${tag.multiple?'s':''}...` :
					  this.selectedItems.map( (v) => <Tag key={`menuItem_${v._id}`} className={css.tagValueSelectItem} style={this.getTagValueStyle(v)}>
						  <span>{this.getTagValueName(v)}</span>
						  <Icon icon={"small-cross"} onClick={ e => { e.stopPropagation(); this.removeTagValue(v._id)}} />
					  </Tag>)
					}
				</div>
				<Icon icon={"chevron-down"}/>
			</div>
		</Popover>;
	}
}