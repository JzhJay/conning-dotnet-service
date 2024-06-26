import {CatalogSidebarTags} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs';
import {OmdbCardBuilder} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/UiLayout/CardBuilder';
import {OmdbTableBuilder} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/UiLayout/TableBuilder';
import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import { action, computed, observable, makeObservable, runInAction } from 'mobx';
import {bp, dialogs, OmdbAdminPageContext} from 'components';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import type {OmdbUserTagValue, OmdbCardTag, IObjectTypeDescriptor} from 'stores';
import {omdb, OmdbTag, utility, apolloStore, fragments, site, ObjectNameChecker, i18n} from 'stores';
import {Observer, observer} from 'mobx-react';
import {Alignment, AnchorButton, Button, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, Tooltip, Checkbox, MenuItem, Menu} from '@blueprintjs/core';
import {formatLabelText} from 'utility';
import * as css from './OmdbTagsEditor.css'
import {ColumnHeaderCell, Table2, Column, Cell, SelectionModes, RenderMode, EditableCell} from '@blueprintjs/table';
import {AutoSizer} from 'react-virtualized';
import {EditTagValuesDialog} from './TagValuesEditor';
import gql from 'graphql-tag';


const readonlyTagFields = ['required', 'reserved', 'mutates', 'multiple', 'name'];

interface MyColumn {
	header?: string;
	align?: 'left' | 'center' | 'right';
	readonly?: boolean;
	render?: React.ReactNode;
	binding?: string;
	datamap?: any;

}

export interface SortDescriptor {
	by: string;
	order: 'asc' | 'desc';
}

@observer
export class OmdbTagsEditor extends React.Component<{ context: OmdbAdminPageContext }, {}> {
    table: Table2;
    @observable editTagValuesTag: OmdbTag;

    @observable sort: SortDescriptor = observable<SortDescriptor>({by: 'name', order: 'asc'});

    constructor(props: { context: OmdbAdminPageContext }) {
        super(props);
        makeObservable(this);
    }

    @computed get tags() {
		let {sort, props: {context: {tags, preferences}}} = this;

		//var tags = schema ? schema.tags.slice() : [];
		if (!preferences.showSystemTags) {
			tags = tags.filter(t => !t.reserved)
		} else {
			tags = tags.filter(t => !t.reserved || t.name != "userTagValues")
		}
		tags = _.sortBy(tags, t => t[sort.by]), t => t.reserved;

		if (sort.order == 'desc') {
			tags = tags.reverse();
		}

		return tags;
	}

	render() {
		let {tags, editTagValuesTag, sort, props: {context, context: {preferences}}} = this;

		return <div className={css.tagsPanel}>
			<Navbar className={css.tabButtonBar}>
				<NavbarGroup align={Alignment.RIGHT}>
					<Checkbox
						label={i18n.intl.formatMessage({defaultMessage:`Show Reserved Tags?`, description:"[OmdbTagsEditor] Indicates is Reserved Tags display on the tag mange table"})}
						checked={!context.isMultiTypeSelected && preferences.showSystemTags}
						onClick={action(() => preferences.showSystemTags = !preferences.showSystemTags)}
						disabled={context.isMultiTypeSelected}
					/>

					<NavbarDivider/>

					<ButtonGroup>
						<Tooltip content={i18n.intl.formatMessage({defaultMessage: `Add Tag`, description: "[OmdbTagsEditor] add a new user tag that to be used to tag/identify system objects"})} position={bp.Position.BOTTOM}>
							<Button onClick={this.addTag} icon="plus"/>
						</Tooltip>
					</ButtonGroup>

					<NavbarDivider/>

					{/*<ButtonGroup>*/}
						{/*<AnchorButton disabled={!isDirty} onClick={context.reset} text="Reset"/>*/}
						{/*<AnchorButton disabled={!isDirty} onClick={context.saveToDatabase} text="Save Changes"/>*/}
					{/*</ButtonGroup>*/}
				</NavbarGroup>
			</Navbar>

			<div style={{flexGrow: 1}}>
				<AutoSizer>
					{({width, height}) => <div key="dynamic-panel" style={{width, height}}>
						<Table2
							ref={ref => this.table = ref}
							key={tags.length /*Fix for https://github.com/palantir/blueprint/issues/3757*/}
							numFrozenColumns={2}
							numRows={tags.length}
							renderMode={RenderMode.NONE}
							enableRowHeader={false}
							enableMultipleSelection={false}
							selectionModes={SelectionModes.ROWS_AND_CELLS}
							defaultRowHeight={30}
							bodyContextMenuRenderer={(context: any) => {
								const tag = this.tags[context.target.rows[0]];
								return this.renderBodyContextMenu(
									tag,
									i18n.intl.formatMessage({defaultMessage:`Object Type(s) for Tag '{tagName}'`, description:"[OmdbTagsEditor] Indicates context menu's top, show current tag name"}, {tagName: context.translateTagName(tag)})
								)
							}}
						>
							<Column name="Name"
						        columnHeaderCellRenderer={(c) => SortColumnHeaderCell.render({
							        col: c,
							        name: 'name',
							        header: i18n.common.WORDS.NAME,
							        canSort: true,
							        sort: sort,
							        onSort: sort => this.sort = sort
						        })}
						        cellRenderer={row => <EditableCell
							        style={{lineHeight: '30px'}}
							        value={tags[row].reserved ? context.translateTagName(tags[row]) : tags[row].name}
							        onConfirm={ async (value) => await this.saveName(tags[row], value) }
						        />}
							/>

							<Column name="Actions"
						        className='center'
						        columnHeaderCellRenderer={(c) => SortColumnHeaderCell.render({
							        col:       c,
							        align:     'center',
							        name:      'actions',
							        header:    i18n.common.WORDS.ACTION,
							        sortField: 'reserved',
							        canSort:   true,
							        sort:      sort,
							        onSort:    sort => this.sort = sort
						        })}
						        cellRenderer={(r, c) =>
							        <Cell>
								        <ButtonGroup minimal>
									        {!tags[r].reserved && <Tooltip content={i18n.intl.formatMessage({defaultMessage:`Delete Tag`, description:"[OmdbTagsEditor] remove user tag that to be used to tag/identify system objects"})}>
										        <AnchorButton icon="trash" onClick={() => this.deleteTag(tags[r])}/>
									        </Tooltip>}
                                            {!tags[r].reserved && <Tooltip content={i18n.intl.formatMessage({defaultMessage:`Edit Tag Values`, description:"[OmdbTagsEditor] open a dialog which can mange the user tag's sub-options' detail"})}>
                                                <AnchorButton icon="properties" onClick={() => this.editTagValues(tags[r])}/>
                                            </Tooltip>}
								        </ButtonGroup>
							        </Cell>}
							/>

							<Column name='objectTypes'
						        columnHeaderCellRenderer={(c) => SortColumnHeaderCell.render({
							        col: c,
							        name: 'objectTypes',
							        header: i18n.intl.formatMessage({defaultMessage:"Object Type(s)", description:"[OmdbTagsEditor] table column - show which object type(s) related to the tag"}),
							        canSort: true,
							        sort: sort,
							        onSort: sort => this.sort = sort
						        })}
							    cellRenderer={row => {
							        let tag = tags[row];
							        if (!tag._id) {
								        return <Cell><bp.Tag>{context.firstSelectedObjectTypeText}</bp.Tag></Cell>
							        } else {
								        return <Cell truncated={false} className={css.objectTypeCell}>
									        <div className={css.tags}>
										        <Observer>{() => <>{_.map(
													_.filter(Array.from(context.availableObjectTypes), aot => _.some(tag.objectTypes, tot => aot == tot)),
											        (ot) => <bp.Tag key={`${tag._id}_${ot}`} className={bp.Classes.INTENT_PRIMARY}>{i18n.translateObjectName(ot)}</bp.Tag>
									            )}</>}</Observer>
									        </div>
									        <bp.Popover position={bp.Position.BOTTOM_RIGHT} >
										        <bp.Icon style={{flexGrow: 0, flexBasis: 0}} icon={'caret-down'} />
										        <div><Observer>{() =>this.renderBodyContextMenu(tag)}</Observer></div>
									        </bp.Popover>
								        </Cell>
							        }
						        }}
							/>
							{CheckboxColumn.render({rows: tags, name: 'unique',
								header: i18n.intl.formatMessage({defaultMessage:`Unique`, description:"[OmdbTagsEditor] table column - set this tag value can duplicate or not"}),
								isDisabled: r => !tags[r].reserved || tags[r].name != 'name',
								isChecked: r => tags[r].reserved && tags[r].name == 'name' && this.isUniqueName(),
								onClick: (row, name, checked) => this.toggleUniqueName(tags[row], !checked)
							})}

							{CheckboxColumn.render({rows: tags, name: 'reserved',
								header: i18n.intl.formatMessage({defaultMessage:`Reserved`, description:"[OmdbTagsEditor] table column - set this tag is system reserved tag or not"}),
								isDisabled: r => true
							})}
							{CheckboxColumn.render({rows: tags, name: 'required',
								header: i18n.intl.formatMessage({defaultMessage:`Required`, description:"[OmdbTagsEditor] table column - set this user tag must be set on the object"}),
								isDisabled: r => tags[r].reserved,
								onClick: this.toggleRequired
							})}
							{CheckboxColumn.render({rows: tags, name: 'mutates',
								header: i18n.intl.formatMessage({defaultMessage:`Mutates`, description:"[OmdbTagsEditor] table column - set this user tag can modify"}),
								isDisabled: r => tags[r].reserved,
								isChecked: r => tags[r].mutates !== false,
								onClick: this.toggleAttribute
							})}
							{CheckboxColumn.render({rows: tags, name: 'multiple',
								header: i18n.intl.formatMessage({defaultMessage:`Multiple`, description:"[OmdbTagsEditor] table column - set this user tag can choose multi-value or not"}),
								isDisabled: r => tags[r].reserved,
								onClick: this.toggleRequired
							})}
							{CheckboxColumn.render({rows: tags, name: 'canSearch',
								header: i18n.intl.formatMessage({defaultMessage:`Can Search`, description:"[OmdbTagsEditor] table column - set this tag can become a index of search dictionary"}),
								isDisabled: r => tags[r].reserved,
								isChecked: r => tags[r].canSearch !== false,
								onClick: this.toggleAttribute
							})}
							{CheckboxColumn.render({rows: tags, name: 'canSort',
								header: i18n.intl.formatMessage({defaultMessage:`Can Sort`, description:"[OmdbTagsEditor] table column - set this tag can become a sort index on object browser"}),
								isDisabled: r => tags[r].reserved,
								isChecked: r => tags[r].type != "ConningUser" && tags[r].canSort !== false,
								onClick: this.toggleAttribute
							})}
							{CheckboxColumn.render({rows: tags, name: 'Catalog',
								header: i18n.intl.formatMessage({defaultMessage:`Catalog`, description:"[OmdbTagsEditor] table column - set this tag can show on the object browser sidebar"}),
								isDisabled: r => tags[r].reserved !== false && _.some(CatalogSidebarTags.EXCLUDE_TAG, n => n == tags[r].name),
								isChecked: r => this.isCatalogEnable(tags[r]),
								onClick: (row, name, checked) => this.toggleCatalog(tags[row], !checked)
							})}
							{CheckboxColumn.render({rows: tags, name: 'Card',
								header: i18n.intl.formatMessage({defaultMessage:`Card`, description:"[OmdbTagsEditor] table column - set this tag can show on the object browser cards view"}),
								isDisabled: r => tags[r].reserved !== false && _.some(OmdbCardBuilder.EXCLUDE_TAG, n => n == tags[r].name),
								isChecked: r => this.isCardEnable(tags[r]),
								onClick: (row, name, checked) => this.toggleCard(tags[row], !checked)
							})}
							{CheckboxColumn.render({rows: tags, name: 'Table',
								header: i18n.intl.formatMessage({defaultMessage:`Table`, description:"[OmdbTagsEditor] table column - set this tag can show on the object browser table view"}),
								isDisabled: r => tags[r].reserved !== false && _.some([...OmdbTableBuilder.EXCLUDE_COLUMN, ...OmdbTableBuilder.CAN_NOT_DELETE_COLUMN], n => n == tags[r].name),
								isChecked: r => this.isTableEnable(tags[r]),
								onClick: (row, name, checked) => this.toggleTable(tags[row], !checked)
							})}
						</Table2>
					</div>
					}
				</AutoSizer>
			</div>

			<EditTagValuesDialog tag={editTagValuesTag} onClose={() => this.editTagValuesTag = null} context={context}/>
		</div>
	}

    private renderBodyContextMenu = (tag: OmdbTag, title?: string) => {
		const pageContext = this.props.context;
		const isUserTag = !!tag._id;
		const objectTypes = isUserTag ? tag.objectTypes : [pageContext.selectedObjectTypes[0]];

		return <bp.Menu>
			{title && <bp.MenuDivider title={title}/>}
			{ _.map(Array.from(pageContext.availableObjectTypes) , (ot, i) => {
				const isInclude = _.some(objectTypes, eot => eot == ot);
				return <MenuItem key={`contextMenu${i}`} icon={isInclude ? 'tick': 'blank'} text={i18n.translateObjectName(`${ot}`)} disabled={!isUserTag} onClick={(e) => this.modifyObjectTypes(tag, `${ot}`)}/>
			})}
		</bp.Menu>;
	};

    @action modifyObjectTypes = async (tag: OmdbTag, toggleType: string) => {

		const context = this.props.context;
		const existObjectTypes = tag.objectTypes;
		const isInsert =  !_.some(existObjectTypes, eot => eot == toggleType);

		const targetDescriptors = [this.props.context.getDescriptorByObjectType(toggleType)];
		const checkStatusDescriptors = isInsert ? this.props.context.selectedObjectTypeDescriptors : targetDescriptors;
		const isCatalogEnable = this.isCatalogEnable(tag, checkStatusDescriptors);
		const isCardEnable = this.isCardEnable(tag, checkStatusDescriptors);
		const isTableEnable = this.isTableEnable(tag, checkStatusDescriptors);

		const typeDisplay = i18n.translateObjectName(toggleType);
	    const tagDisplay = context.translateTagName(tag);

		let updateObjectTypes;
		if(isInsert) {
			// check user tag names not duplicate for database, because it might changed.
			const r = (await omdb.runQuery({objectTypes: ["UserTag"], where: {name: tag.label||tag.name, objectTypes: [toggleType]}})).result;
			if (r.total != 0) {
				site.messageBox(i18n.intl.formatMessage({defaultMessage: "Object Type Update Failed.", description: "[OmdbTagsEditor] Indicates error message dialog title when updating the object type"}),
					<FormattedMessage
						defaultMessage={`<div>"<b>{tagName}</b>" already exists in type "<b>{objectType}</b>"</div>`}
						description={"[OmdbTagsEditor] Indicates error message when updating the object type"}
						values={{tagName: tagDisplay, objectType: typeDisplay}}
					/>,
					<bp.Icon icon={"warning-sign"} size={36} />
				);
				return;
			}
			updateObjectTypes = [ ...existObjectTypes ,toggleType];
		} else if (existObjectTypes.length > 1){
			if (tag.values && tag.values.length) {
				const userTagValues = tag.values.map(v => v._id);
				const r = await omdb.runQuery({objectTypes: [toggleType], where: {userTagValues: userTagValues}});
				if (r.result.total > 0 && !(await site.confirm(
					i18n.intl.formatMessage(
						{
							defaultMessage: `"{tagName}" is referenced by {total} objects. Deleting will remove all references.`,
							description: "[OmdbTagsEditor] Indicates warning message before deleting a user tag, but it still related some object"
						},
						{tagName: tagDisplay, total: r.result.total}
					)
				))) {
					return;
				}
				_.forEach(r.result.results, data => {
					_.pull(data.userTagValues, userTagValues);
					this.props.context.updateObjectUserTagValue(toggleType, data._id, data.userTagValues);
				});
			}
			updateObjectTypes = _.filter(existObjectTypes, eot => eot != toggleType);
		} else {
			await  this.deleteTag(tag);
			return;
		}
		await this.saveUpdate(tag, "objectTypes", updateObjectTypes, _.map(updateObjectTypes, type => this.props.context.getDescriptorByObjectType(type)));

		if(isInsert) {
			if (tag.required) {
				apolloStore.client.mutate({
					mutation:  gql`mutation updateTagDefault($tagId: String!) { omdb { userTagDefault { set(tagId: $tagId) } } }`,
					variables: {tagId: tag._id}
				});
			}
			_.forEach(targetDescriptors, desc => desc.userTags.push(tag));
			isCatalogEnable && this.toggleCatalog(tag, true, targetDescriptors);
			isCardEnable && this.toggleCard(tag, true, targetDescriptors);
			isTableEnable && this.toggleTable(tag, true, targetDescriptors);
		} else {
			isCatalogEnable && this.toggleCatalog(tag, false, targetDescriptors);
			isCardEnable && this.toggleCard(tag, false, targetDescriptors);
			isTableEnable && this.toggleTable(tag, false, targetDescriptors);
			_.forEach(targetDescriptors, desc => {
				_.pull(desc.userTags, _.find(desc.userTags, ut => ut._id == tag._id));
			});
		}
	}

    @action toggleAttribute = async (rowIndex: number, name: string, checked: boolean) => {
		let tag = this.tags[rowIndex];
		await this.saveUpdate(tag, name, !checked);
	}

    @action toggleRequired = async (rowIndex: number, name: string, checked: boolean) => {
		let tag = this.tags[rowIndex];
		await this.saveUpdate(tag, name, !checked);
		const {required, multiple} = tag;
		if ( required ) {
			if( name == 'multiple' && tag.values?.length) {
				if (!multiple) {
					tag.values.forEach( v => v.isDefault = false );
				} else {
					if (_.some(tag.values, v => v.isDefault)) {
						return;
					}
				}
			}
			this.editTagValuesTag = tag;
		} else {
			tag.values?.forEach( v => v.isDefault = false );
			this.props.context.catalogContext.refresh();
		}
	}

	get defaultTagName() { return i18n.intl.formatMessage({
		defaultMessage: `New Tag`,
		description: "[OmdbTagsEditor] default new tag name, which used to tag/identify system objects"
	}); }

    getAvailableTagName = async (name?: string, tag?: OmdbTag): Promise<string> => {
		return new ObjectNameChecker({
			defaultName: this.defaultTagName,
			type: "numeric",
			customizeCompareList: () => {
				return this.props.context.tags.filter(t => !tag || t.name != tag.name).map(t => t.name);
			}
		}).getAvailableName('UserTag', name, tag?._id);
	};

	saveName = async (tag: OmdbTag, value) => {
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			model:   (tag as any),
			newName: value,
			onRename: async (newName) => await this.saveUpdate(tag, 'name', newName)
		}, {
			defaultName: this.defaultTagName,
			type: "numeric",
			customizeCompareList: () => {
				return this.props.context.tags.filter(t => t.name != tag.name).map(t => t.name);
			}
		})
	}

    saveUpdate = async (tag: OmdbTag, name, value, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors) => {

		if(_.isEqual(tag[name], value)){
			site.busy = false;
			return;
		}

		descriptors.forEach( desc => {
			const updateTag = !tag._id ?
			                  _.find(desc.tags, t => t.name == tag.name ) :
			                  _.find(desc.userTags, ut => ut._id == tag._id );
			updateTag && runInAction(() => updateTag[name] = value);
		});

		site.busy = true;
		let updateTagValue;
		try {
			var m = await apolloStore.client.mutate({
				mutation:  gql`
				mutation updateUserTag($id: ID!, $value: omdb_UserTag_update!) {
					omdb {
						typed {
							userTag {
								update(id: $id, value: $value)
							}
						}
					}
				}
			`,
				variables: {id: tag._id, value: {[name]: value}}
			});

			updateTagValue = m.data?.omdb.typed.userTag.update;
			if (updateTagValue && tag._id == updateTagValue._id) {
				descriptors.forEach(desc => {
					const updateTag = !tag._id ?
					                  _.find(desc.tags, t => t.name == tag.name) :
					                  _.find(desc.userTags, ut => ut._id == tag._id);

					updateTag && runInAction(() => Object.assign(updateTag, updateTagValue));
				});
			}
		} finally {
			site.busy = false;
		}
		return updateTagValue;
	}

    @action toggleCatalog = async (tag: OmdbTag, updateStatus:boolean, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors) => {
		const {context} = this.props;
		_.forEach( descriptors, desc => {
			const ui = desc.ui;
			if (!updateStatus) {
				let index;
				if (tag.reserved) {
					index = ui.catalog.tags.map( t => (typeof t == 'string') ? t : t.name).indexOf(tag.name);
				} else {
					index = ui.catalog.tags.map( t => (typeof t == 'string') ? null : t._id).indexOf(tag._id);
				}
				if (index >= 0) {
					ui.catalog.tags.splice(index, 1);
					context.saveUiCatalogToDatabase(desc);
				}
			}
			else {
				ui.catalog.tags.push({name: tag.name, _id: tag._id, reserved: !!tag.reserved});
				context.saveUiCatalogToDatabase(desc);
			}
		});
	}

    @action toggleCard = async (tag: OmdbTag, updateStatus:boolean, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors) => {
		const {context} = this.props;
		_.forEach( descriptors, desc => {
			const ui = desc.ui;
			if (!updateStatus) {
				let updated = false;
				ui.card.sections.forEach(section => {
					let index = _.findIndex(section.tags, t => {
						if (typeof section == "boolean") {
							return false;
						}
						let _t = t as OmdbCardTag
						return tag.reserved ? _t.name == tag.name : _t._id == tag._id
					});
					if (index >= 0) {
						if (tag.reserved) {
							(section.tags[index] as OmdbCardTag).hide = true;
						} else {
							section.tags.splice(index, 1);
						}
						updated = true;
					}
				})
				if (updated) {
					for (let i = ui.card.sections.length - 1; i >= 0; i--) {
						if (!ui.card.sections[i].tags.length) {
							ui.card.sections.splice(i, 1);
						}
					}
					context.saveUiCardToDatabase(desc);
				}
			} else {
				if (tag.reserved) {
					let updated = false;
					ui.card.sections.forEach(section => {
						let index = _.findIndex(section.tags, t => {
							if (typeof section == "boolean") {
								return false;
							}
							let _t = t as OmdbCardTag
							return _t.reserved !== false && _t.name == tag.name;
						});
						if (index >= 0) {
							(section.tags[index] as OmdbCardTag).hide = false;
							updated = true;
						}
					})
					if (!updated) {
						const specialTag = ["createdBy", "createdTime", "modifiedBy", "modifiedTime"]
						const newTag = {name: tag.name};
						if (_.some(specialTag, s => s == tag.name)) {
							const insertSection = _.find(ui.card.sections, section => {
								return _.some(section.tags, t => typeof (t) != 'boolean' && _.some(specialTag, s => s == t.name));
							});
							if (insertSection) {
								insertSection.tags.push(newTag)
							} else {
								ui.card.sections.push({tags: [newTag]})
							}
						} else {
							const insertSection = _.find(ui.card.sections, section => {
								return !_.some(section.tags, t => typeof (t) != 'boolean' && (t.reserved === false || _.some(specialTag, s => s == t.name)));
							});

							if (insertSection) {
								insertSection.tags.push(newTag)
							} else {
								const insertIndex = _.findIndex<any>(ui.card.sections, section => {
									return _.some(section.tags, t => typeof (t) != 'boolean' && _.some(specialTag, s => s == t.name));
								});
								if (insertIndex >= 0) {
									ui.card.sections.splice(insertIndex, 0, {tags: [newTag]});
								} else {
									ui.card.sections.push({tags: [newTag]})
								}
							}
						}
					}
				} else {
					const newTag = {name: tag.name, _id: tag._id, reserved: false};
					let firstSection = ui.card.sections[0];
					if (firstSection.tags.length && (typeof firstSection.tags[0] == 'boolean' || (firstSection.tags[0] as OmdbCardTag).reserved !== false)) {
						ui.card.sections.splice(0, 0, {tags: [newTag]});
					} else {
						firstSection.tags.push(newTag);
					}
				}
				context.saveUiCardToDatabase(desc);
			}
		});
	}

    @action toggleTable = async (tag: OmdbTag, updateStatus:boolean, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors) => {
		const {context} = this.props;
		_.forEach(descriptors, desc => {
			const ui = desc.ui;
			if (!updateStatus) {
				let index = _.findIndex<any>(ui.table.columns, t => {
					return tag.reserved ? t.name == tag.name : t._id == tag._id
				});
				if (index >= 0) {
					ui.table.columns.splice(index, 1);
					context.saveUiTableToDatabase(desc);
				}
			} else {
				if (tag.reserved) {
					ui.table.columns.push({name: tag.name});
				} else {
					let index = Math.max(ui.table.frozenColumns, _.findLastIndex<any>(ui.table.columns, c => c.reserved === false) + 1)
					ui.table.columns.splice(index, 0, {name: tag.name, _id: tag._id, reserved: false})
				}
				context.saveUiTableToDatabase(desc);
			}
		});
	}

	@action toggleUniqueName = async (tag: OmdbTag, updateStatus:boolean, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors) => {
		const {context} = this.props;
		_.forEach( descriptors, desc => {
			if (desc.ui.uniqueName != updateStatus) {
				desc.ui.uniqueName = updateStatus;
				context.saveUiUniqueNameToDatabase(desc);
			}
		});
	}

    isCatalogEnable = (tag: OmdbTag, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors): boolean => {
		let returnValue = true;
		_.forEach( descriptors, descriptor => {
			if (!tag._id) {
				returnValue = returnValue && _.some(descriptor.ui.catalog.tags.map( t => (typeof t == 'string') ? t : t.name), t => t == tag.name);
			} else {
				returnValue = returnValue && _.some(descriptor.ui.catalog.tags.map( t => (typeof t == 'string') ? null : t._id), t => t == tag._id);
			}
		})
		return returnValue;
	}

    isCardEnable = (tag: OmdbTag, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors): boolean => {
		let returnValue = true;
		_.forEach(descriptors, descriptor => {
			const selected = _.flatten<OmdbCardTag>(descriptor.ui.card.sections.map(t => t.tags)).filter(t => typeof t != 'boolean' && !t.hide);
			if (!tag._id) {
				returnValue = returnValue && _.some(selected, c => c.name == tag.name);
			} else {
				returnValue = returnValue && _.some(selected, c => c._id == tag._id);
			}
		})
		return returnValue;

	}

    isTableEnable = (tag: OmdbTag, descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors ): boolean => {
		let returnValue = true;
		_.forEach(descriptors, descriptor => {
			if (!tag._id) {
				returnValue = returnValue && _.some(descriptor.ui.table.columns, c => c.name == tag.name);
			} else {
				returnValue = returnValue && _.some(descriptor.ui.table.columns, c => c._id == tag._id);
			}
		})
		return returnValue;
	}

	isUniqueName = (descriptors: IObjectTypeDescriptor[] = this.props.context.selectedObjectTypeDescriptors ): boolean => {
		return _.some(descriptors, descriptor => descriptor.ui.uniqueName !== false );
	}

    @action addTag = async () => {
		const {context, context: {selectedObjectTypes, selectedObjectTypeDescriptors}} = this.props;

		site.busy = true;
		try {
			const newTag = new OmdbTag({name: await this.getAvailableTagName()});

			var m = await apolloStore.client.mutate({
				mutation:  gql`
				${fragments.userTag}
				mutation addUserTag($name: String!, $objectTypes: [String!]) {
					omdb {
						typed {
							userTag {
								insert(values: [{ name: $name, objectTypes: $objectTypes, canSort: true, canSearch:true, mutates: true }]) {
									...userTag
								}
							}
						}
					}
				}
			`,
				variables: {name: newTag.name, objectTypes: selectedObjectTypes}
			});
			Object.assign(newTag, m.data.omdb.typed.userTag.insert[0]);

			selectedObjectTypeDescriptors.forEach(action(desc => {
				if (!desc.userTags) {
					desc.userTags = [newTag];
				} else {
					desc.userTags.push(newTag);
				}
				;
			}));

			await this.toggleCatalog(newTag, true);
			await this.toggleCard(newTag, true);
			await this.toggleTable(newTag, true);
		} finally {
			site.busy = false;
		}
	}

    @action editTagValues = (tag: OmdbTag) => {
		this.editTagValuesTag = tag;
	}

    // @action moveTagUp = (tag: OmdbTag) => {
    // 	this.dirty    = true;
    // 	var fromIndex = this.tags.indexOf(tag);
    //
    // 	this.tags.move(fromIndex, fromIndex - 1);
    // }
    //
    // @action moveTagDown = (tag: OmdbTag) => {
    // 	this.dirty    = true;
    // 	var fromIndex = this.tags.indexOf(tag);
    //
    // 	this.tags.move(fromIndex, fromIndex + 1);
    // }

    @action deleteTag = async (tag: OmdbTag) => {
		const {context} = this.props;

		if (tag.values && tag.values.length) {
			let r = await omdb.runQuery({objectTypes: tag.objectTypes, where: {userTagValues: tag.values.map(v => v._id)}});
			if (r.result.total > 0 && !(await site.confirm(
				i18n.intl.formatMessage(
					{
						defaultMessage: `"{tagName}" is referenced by {total} objects. Deleting will remove all references.`,
						description: "[OmdbTagsEditor] Indicates warning message before deleting a user tag, but it still related some object"
					},
					{tagName: context.translateTagName(tag), total: r.result.total}
				)
			))) {
				return;
			}
		}

		_.forEach( tag.objectTypes, type => {
			const desc = context.getDescriptorByObjectType(type);
			desc && _.pull(desc.userTags, _.find(desc.userTags, t => tag._id == t._id))}
		);
		site.busy = true;
		await apolloStore.client.mutate<any>({
			mutation:  gql`
				mutation delete($id: ObjectId!) {
					omdb {
						typed {
							userTag {
								delete(id: $id)
						}
					}
				}
				}`,
			variables: {id: tag._id}
		}).then( () => {
			context.catalogContext.refresh();
		}).finally(() => {
			site.busy = false;
		});
	}
}

export type SortOrder = 'asc' | 'desc';

export interface SortColumnHeaderCellProps {
	col: number,
	name: string,
	sortField?: string,
	align?: 'left' | 'center' | 'right',
	canSort?: boolean,
	sort: SortDescriptor;
	onSort?: (sort: SortDescriptor) => void;
	header?: string;
}

class SortColumnHeaderCell {
	static render(props: SortColumnHeaderCellProps) {
		const {col, name, header, canSort, sort, align, onSort} = props;

		var sortField = props.sortField ? props.sortField : name;

		return <ColumnHeaderCell index={col}
		                         className={classNames(align, {[css.sortable]: canSort})}
		                         name={header ? header : utility.camelToRegular(name)}
		                         nameRenderer={!sort ? undefined : (name, index) => {
			                         return <Observer>{() => <div key={index.toString()}
			                                                      className={css.columnCell}
			                                                      onClick={canSort ? action(() => {
				                                                      onSort && onSort({by: name, order: sort.order == 'asc' ? 'desc' : 'asc'});
			                                                      }) : undefined}>
				                         {name}
				                         {sort.by != sortField
				                          ? null
				                          : <span className={`wj-glyph-${sort.order == 'asc' ? 'up' : 'down'}`}/>}
			                         </div>}
			                         </Observer>
		                         }}
		                         menuRenderer={sort && canSort ? (index) => <Menu>
			                         <MenuItem icon="sort-asc"
			                                   className={classNames({[bp.Classes.ACTIVE]: sort.by == sortField && sort.order == 'asc'})}
			                                   onClick={() => {
				                                   onSort && onSort({by: sortField, order: 'asc'})
			                                   }} text="Sort Ascending"/>
			                         <MenuItem icon="sort-desc"
			                                   className={classNames({[bp.Classes.ACTIVE]: sort.by == sortField && sort.order == 'desc'})}
			                                   onClick={() => {
				                                   onSort && onSort({by: sortField, order: 'desc'})
			                                   }}
			                                   text="Sort Descending"/>
		                         </Menu> : undefined}
		/>
	}
}

class CheckboxColumn {
	static render(props: { name: string, header:string, isChecked?: (row: number) => boolean, isIndeterminate?: (row: number) => boolean, isDisabled?: (row: number) => boolean, rows: Array<any>, onClick?: (row, name, checked) => void }) {
		const {name, header, rows, isDisabled, isIndeterminate, isChecked, onClick} = props;
		return <Column name={header} className='center'
		               cellRenderer={row => <Cell>
			               <Observer>{() => {
				               var checked = isChecked ? isChecked(row) : !!rows[row][name];
				               return <Checkbox disabled={isDisabled ? isDisabled(row) : false}
				                                checked={!!checked}
				                                indeterminate={isIndeterminate ? isIndeterminate(row) : undefined}
				                                onClick={onClick ? () => onClick(row, name, checked) : () => {rows[row][name] = !checked}}/>
			               }}
			               </Observer>
		               </Cell>}/>

	}
}

export class TagValueComponent extends React.Component<{tag: OmdbTag, value: OmdbUserTagValue}, {}> {
	render() {
		const {tag, value: tagValue, value: {_id, value, align, background, color}} = this.props;
		return <span className={css.tagValue} style={{background, color}}>{value}</span>
	}
}
