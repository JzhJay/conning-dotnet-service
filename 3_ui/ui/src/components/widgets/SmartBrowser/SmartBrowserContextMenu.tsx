import {bp, OmdbAdminPage, SortableCardsPanel} from 'components';
import {CommentsEditDialog} from 'components/widgets/SmartBrowser/GenericCommentsEditor';
import {formatLabelText} from 'utility';
import {TagVisibilitySubMenu} from './TagVisibilitySubMenu';
import {action, computed, makeObservable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {
	ClimateRiskAnalysis, i18n,
	IO,
	IOmdbTag,
	ObjectCatalogContext,
	OmdbUserTag,
	OmdbUserTagValue,
	Query,
	queryStore,
	routing, saveTagValues,
	Simulation, site, UserFile,
	utility
} from 'stores';

interface Model {
	__typename: string;
	_id: string;
	name: string;
	userTagValues: OmdbUserTagValue[];
	sourceType?: string;
	clientUrl?: string;
}

interface MyProps {
	availableTags: IOmdbTag[];
	visibleTags: Map<string, boolean>;
	panel: SortableCardsPanel;
	model: Model;
}

@observer
export class SmartBrowserContextMenu extends React.Component<MyProps, {}> {

	get models(): Model[] {
		let models = this.props.panel && Array.from(this.props.panel.selectedItems.values());
		models = models?.length ? models : this.props.model ? [this.props.model] : [];
		return models.filter(m => m.__typename !== "HierarchyGroup");
	}

	getEditUrl(model: Model){
		const id = model._id;
		switch (model.__typename) {
			case Simulation.ObjectType:
				let isEditable = false;
				if (model instanceof Simulation) {
					isEditable = Simulation.editable(model);
				} else {
					isEditable = _.some([Simulation.SOURCE_TYPE.REPOSITORY, Simulation.SOURCE_TYPE.GEMS], s => s == model.sourceType);
				}
				return isEditable ? `${Simulation.urlFor(id)}?edit` : null;

			case Query.ObjectType:
				return queryStore.clientUrlFor(id);

			case IO.ObjectType:
				return IO.urlFor(id);

			case ClimateRiskAnalysis.ObjectType:
				return ClimateRiskAnalysis.urlFor(id);
		}
		return model.clientUrl;
	}

	translate_objectTypeName = (objectType) => {
		switch (objectType) {
			case UserFile.ObjectType:   return UserFile.OBJECT_NAME_SINGLE;
			case Simulation.ObjectType: return Simulation.OBJECT_NAME_SINGLE;
			case Query.ObjectType:      return Query.OBJECT_NAME_SINGLE;
			case IO.ObjectType:         return IO.OBJECT_NAME_SINGLE;
			case ClimateRiskAnalysis.ObjectType: return ClimateRiskAnalysis.OBJECT_NAME_SINGLE;
			default: objectType ? formatLabelText(objectType) : "object";
		}
	}


	render() {
		const models = this.models;
		if (!models.length) { return null; }

		const typenameAry = _.uniq(_.map(models, m => m.__typename))
		const editableModels = models.filter(model => !!this.getEditUrl(model));
		const enableOpenInNewTabModels = editableModels.filter( model => _.some([Query.ObjectType, IO.ObjectType], t => t == model.__typename));

		const panel = this.props.panel;
		const catalogContext = this.props.panel?.props.catalogContext;
		const visibleTags = this.props.visibleTags;

		console.log(models);

		return <bp.Menu>
			{models.length == 1 && models[0]["_id"] && <>
				<bp.MenuItem icon={"blank"}
				          text={i18n.intl.formatMessage(
					          {defaultMessage: "Copy {typeName} Object {idField} to Clipboard", description: "[SmartBrowserContextMenu] copy select object id to the clipboard"},
					          {
								  typeName: this.translate_objectTypeName(models[0].__typename),
						          idField: _.get(i18n.databaseLookups.tags, ['_id'], "ID")
							  }
				          )}
				          onClick={() => {
					          navigator.clipboard.writeText(models[0]["_id"]);
					          site.toaster.show({ intent: bp.Intent.PRIMARY, message: i18n.intl.formatMessage(
						          {defaultMessage: `{typeName} Object {idField} "{id}" copied to clipboard.`, description: "[SmartBrowserContextMenu] message after copied a object id to the clipboard"},
						          {
							          typeName: this.translate_objectTypeName(models[0].__typename),
							          idField: _.get(i18n.databaseLookups.tags, ['_id'], "ID"),
							          id: models[0]["_id"]
						          }
					          )})
				          }} />
				<bp.MenuDivider/>
			</>}
			{editableModels.length == 1 && <>
				<bp.MenuItem icon="edit"
				          text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.EDIT(this.translate_objectTypeName(editableModels[0].__typename))}
				          onClick={() => routing.push(this.getEditUrl(editableModels[0]))} />
				{enableOpenInNewTabModels.length > 0 && <bp.MenuItem
					icon="blank"
					text={i18n.intl.formatMessage(
						{defaultMessage: `Edit {typeName} in New Tab`, description: "[SmartBrowserContextMenu] edit a select object on the browser"},
						{typeName: this.translate_objectTypeName(enableOpenInNewTabModels[0].__typename)}
					)}
					onClick={() => window.open(this.getEditUrl(enableOpenInNewTabModels[0]), '_blank').focus()} />}
				<bp.MenuItem icon="blank"
				          text={i18n.common.OBJECT_CTRL.WITH_VARIABLES.EDIT(i18n.databaseLookups.tags[SortableCardsPanel.COMMENTS_FIELD])}
				          onClick={() => site.setDialogFn(() => <CommentsEditDialog model={editableModels[0] as any} />)} />
				{catalogContext && <bp.MenuDivider/>}
			</>}

			{(enableOpenInNewTabModels.length > 1) && <>
				<bp.MenuItem
					icon="blank"
					text={i18n.intl.formatMessage(
						{defaultMessage: `Edit {l} Objects in New Tabs`, description: "[SmartBrowserContextMenu] open multiple objects to different browser window."},
						{l: enableOpenInNewTabModels.length}
					)}
					onClick={() => _.forEach(enableOpenInNewTabModels, model => window.open(this.getEditUrl(model), '_blank') )}
				/>
				{catalogContext && <bp.MenuDivider/>}
			</>}

			{catalogContext && panel && <>
				{(typenameAry.length == 1) && <TagVisibilitySubMenu objectType={typenameAry[0]} catalogContext={catalogContext} visibleTags={visibleTags} view={panel.props.view}/>}
				<UserTagManageSubMenu catalogContext={catalogContext} models={models}/>
			</>}


		</bp.Menu>
	}
}

interface UserTagManageSubMenuProps {
	catalogContext: ObjectCatalogContext;
	models: Model[];
}

@observer
class UserTagManageSubMenu extends React.Component<UserTagManageSubMenuProps, {}>{
    constructor(props: UserTagManageSubMenuProps) {
        super(props);
        makeObservable(this);
    }

	@computed get types() {
		return _.uniq(_.map(this.props.models, m => m.__typename));
	}

	getUserTagValueStatus = (userTagValueId: string): "none" | "all" | "partial" => {
		const models = this.props.models;
		let count = 0;
		_.forEach(models, model => {
			if (_.find(model.userTagValues, utv => utv._id == userTagValueId)) {
				count++;
			}
		});

		if(count == 0) {
			return "none";
		} else if (count == models.length) {
			return "all";
		}
		return "partial";
	}

    @computed get userTags(){
		const {types, props: {catalogContext}} = this;
		let uts = catalogContext.getObjectType(this.types[0])?.userTags || [];
		return uts
			.filter(t => t.values?.length)
			.filter(t => _.difference(types, t.objectTypes).length == 0);
	}

	getTagLabel(userTag: OmdbUserTag) {
		return userTag.label ? userTag.label : utility.camelToRegular(userTag.name)
	}

    render() {
		return <>
			{!_.isEmpty(this.userTags) && <bp.MenuItem
				text={i18n.intl.formatMessage({defaultMessage: "Apply User Tag", description: "[SmartBrowserContextMenu] add/remove user tag values to a object"})}
				icon={"blank"}
			>
				{this.userTags.map(tag => {
					const mutates = tag.mutates !== false;
					return <bp.MenuItem
						key={tag._id}
						text={this.getTagLabel(tag)}
						icon={mutates ? null : 'lock'}
					>
						{tag.values.map(tv => {
							let icon;
							switch (this.getUserTagValueStatus(tv._id)) {
								case 'all':
									icon = 'tick';
									break;
								case 'partial':
									icon = 'minus';
									break;
								default:
									icon = 'blank';
							}

							return <bp.MenuItem
								key={tv._id}
								disabled={!mutates}
								text={ <bp.Tag style={{color: tv.color, background: tv.background}}>
									{tv.label ? tv.label : tv.value}
								</bp.Tag>}
								icon={icon}
								onClick={() => mutates && this.onClickUserTagValue(tag, tv)}
							/>})}
					</bp.MenuItem>
				})}
			</bp.MenuItem>}
			<bp.MenuItem
				text={OmdbAdminPage.APPLICATION_TITLE_LONG}
				onClick={() => routing.push(`${routing.urls.objectSchemasPage}/${this.types[0]}`)} icon={'database'}/>
		</>;
	}

    private onClickUserTagValue = async (userTag: OmdbUserTag, userTagValue: OmdbUserTagValue) => {
		if(userTag.mutates === false) {
			return;
		}
		const status = this.getUserTagValueStatus(userTagValue._id);
		const isAdd = status != 'all';
		const groupIds = _.map(userTag.values, v => v._id);
		const removeTags = isAdd ? userTag.multiple ? [] : _.difference(groupIds, [userTagValue._id]) : [userTagValue._id];

		let updatesData: {
			model: Model,
			tagValueIds: string[]
		}[] = [];
		_.forEach(this.props.models, model => {
			let modelUserTagValueIds = model.userTagValues?.map(utv => utv._id) || [];
			removeTags.length && (modelUserTagValueIds = _.difference(modelUserTagValueIds, removeTags));
			if (isAdd && !_.includes(modelUserTagValueIds, userTagValue._id)) {
				modelUserTagValueIds.push(userTagValue._id);
			}
			if (!_.isEqual(model.userTagValues?.map(utv => utv._id), modelUserTagValueIds)) {
				updatesData.push({
					model:       model,
					tagValueIds: modelUserTagValueIds
				});
			}
		});

		if(userTag.required) {
			let pass = true;
			_.forEach(updatesData, data => pass = pass && (_.difference(groupIds, data.tagValueIds).length < groupIds.length));
			if (!pass) {
				site.toaster.show({intent: bp.Intent.DANGER, timeout: 30000, message: `Can not remove "${this.getTagLabel(userTag)}" tag, because it is a required tag.`});
				return;
			}
		}

		let updateCount = updatesData.length;
		_.forEach(updatesData, data => {
			if (!data.model.userTagValues) {
				data.model.userTagValues = [];
			}
			saveTagValues(data.model.__typename, data.model._id, data.tagValueIds).then(action((r) => {
				if (r?._id == data.model._id) {
					data.model.userTagValues = r.userTagValues;
				}
				updateCount--;

				//when all models have been done, get the newest distinct information.
				if (updateCount === 0) {
					this.props.catalogContext.reloadDistinct();
				}
			}))
		})
	}
}

