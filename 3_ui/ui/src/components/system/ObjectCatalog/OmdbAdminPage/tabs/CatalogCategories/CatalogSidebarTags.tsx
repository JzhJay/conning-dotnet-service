import { action, computed, makeObservable } from 'mobx';
import type {IObjectTypeDescriptor} from 'stores';
import {i18n, OmdbTag} from 'stores';
import {observer} from 'mobx-react';
import {sem, bp} from 'components';
import {Alignment, AnchorButton, Navbar, NavbarGroup, Button, Tooltip, NavbarDivider, Popover, ContextMenuTarget, Menu, MenuItem, MenuDivider} from '@blueprintjs/core';
import * as css from './CatalogSidebarTags.css'
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {OmdbAdminPageContext} from 'components';
import {Select} from '@blueprintjs/select';

const DragHandle = SortableHandle(() => <bp.Icon icon='drag-handle-vertical' className={classNames(css.dragHandle, 'draggable')}/>)

@observer
@ContextMenuTarget
class TagComponent extends React.Component<{ tag: OmdbTag, disableAnimation?: boolean, component: CatalogSidebarTags}, {}> {

	render() {
		const {props: {component, tag, component: {props: {context: {catalogContext, translateTagName}}}}} = this;
		let distinct    = catalogContext.distinctTagValues.get(catalogContext.objectTypes[0].id);
		let distinctKey = tag.reserved ? tag.name : tag._id;
		let tagDistinct = distinct && distinct.has(distinctKey) ? distinct.get(distinctKey) : null;

		const removeBtnText = i18n.intl.formatMessage({defaultMessage: `Remove Tag`, description: "[CatalogSidebarTags] remove a user tag that to be used to tag/identify system objects"});

		return <div className={css.tag}>
			<DragHandle/>
			<span className={css.tagName}>{translateTagName(tag)}</span>

			<Popover interactionKind={bp.PopoverInteractionKind.HOVER} content={
				<div className={css.distinctValues}>
					{tagDistinct && tag.reserved ?
						tagDistinct.distinct.map(d => <span key={d.value} className={css.distinctValue}> {d.value} </span>):
                        tag.values && tag.values
						   .filter(tv => _.some(tagDistinct && tagDistinct.distinct, d => d.value == tv._id))
						   .map(tv => <span key={tv._id} className={css.distinctValue}> {tv.label || tv.value} </span>)
					}
				</div>}>
				<sem.Label content={tagDistinct ? tagDistinct.distinct.length : '...'}/>
			</Popover>

			<Tooltip content={removeBtnText}>
				<Button icon="trash" onClick={() => component.removeTag(tag)}/>
			</Tooltip>
		</div>;
	}

	renderContextMenu() {
		const {props: {tag, component}} = this;
		const context = component.props.context;

		const removeOptText = i18n.intl.formatMessage({defaultMessage: `Remove "{tagName}"`, description: "[CatalogSidebarTags] context menu - remove a user tag that to be used to tag/identify system objects"}, {tagName: context.translateTagName(tag)});
		const addOptText = i18n.intl.formatMessage({defaultMessage: `Add tag...`, description: "[CatalogSidebarTags] context menu  - add a new user tag that to be used to tag/identify system objects"});

		return <Menu>
			<MenuItem icon='trash' text={removeOptText} onClick={() => component.removeTag(tag)} />
			<MenuDivider title={addOptText} />
			{component.remainingTags.map((tag, index) => <MenuItem key={`${tag.name}_${tag._id}`} text={context.translateTagName(tag)} onClick={() => this.addTagToCatalog(tag)}/>)}
			{component.remainingTags.length == 0 && <MenuItem key='none' text={<i>No Tags Remain</i>}/>}
		</Menu>
	}

	private addTagToCatalog = (tag: OmdbTag) => {
		const index = _.findIndex<OmdbTag>(this.props.component.ui.catalog.tags, t => {
			let tag = this.props.tag;
			if (typeof t == 'string') {
				return t == tag.name;
			} else if (tag.reserved !== false){
				return t.name == tag.name;
			} else {
				return t._id == tag._id;
			}
		});
		this.props.component.addTag(tag, index+1);
	}
}

const _SortableTag = SortableElement(TagComponent);
export const SortableTag = _SortableTag;

//const DragHandle = SortableHandle(() => <sem.Icon className='draggable' size='large' name="ellipsis vertical"/>)

@observer
class SortableFields extends React.Component<{ className?: string, disableAnimation?: boolean, component: CatalogSidebarTags }, {}> {
	render() {
		const {props: {className}} = this;

		return <div className={className}>
			{this.props.component.displayTags.map((f, i) => <SortableTag key={`CatalogSidebarTag_${i}`} tag={f} index={i} {...this.props}/>)}
		</div>
	}
}

const SortableFieldsContainer = SortableContainer(SortableFields);
const AddTagDropdown          = Select.ofType<OmdbTag>()

@observer
export class CatalogSidebarTags extends React.Component<{ context: OmdbAdminPageContext, objectTypeDescriptor: IObjectTypeDescriptor}, {}> {

	static EXCLUDE_TAG = ["_id", "userTagValues", "billingInformation", "comments"];

	dirtyDisplayTags = _.clone(this.props.objectTypeDescriptor.ui.catalog.tags);

	constructor(props) {
        super(props);
        makeObservable(this);
        const userTagIds = this.props.context.userTags.map( ut => ut._id);
        const catalogTags = this.props.objectTypeDescriptor.ui.catalog.tags;
        let update = false;
        for (let i = catalogTags.length-1; i >= 0; i--) {
			if(catalogTags[i]._id && userTagIds.indexOf(catalogTags[i]._id) < 0) {
				catalogTags.splice(i,1);
				update = true;
			}
		}
        if (update) {
			this.saveUiCatalogToDatabase();
		}
        this.dirtyDisplayTags = _.clone(catalogTags);
    }

	@computed get ui() {
		return this.props.objectTypeDescriptor.ui;
	}

	@computed get availableTags() {
		//TODO: Might be best to filter everything besides _id on the server?
		return _.filter(this.props.context.tags, t => CatalogSidebarTags.EXCLUDE_TAG.indexOf(t.name) == -1);
	}

	@computed get displayTags() {
		const tags = this.props.context.tags;
		const tags_order = this.ui.catalog.tags;

		if (tags_order && tags_order.length) {
			return tags_order.map((uiTag) => {
				if (typeof uiTag == "string") {
					return tags.filter( omdbTag => omdbTag.reserved && omdbTag.name == uiTag)[0];
				} else if (uiTag._id) {
					return tags.filter( omdbTag => !omdbTag.reserved && omdbTag._id == uiTag._id)[0];
				} else {
					return tags.filter( omdbTag => omdbTag.reserved && omdbTag.name == uiTag.name)[0];
				}
			}).filter(tag => !!tag);
		}
		return tags;
	}

	@computed get remainingTags() {
		const tags = this.availableTags;
		const tags_order = this.ui.catalog.tags;

		if (!tags_order || !tags_order.length) {
			return [];
		}

		let rtn = tags.filter((tag) => {
			if (tag.reserved) {
				return !_.some(tags_order.map( t => (typeof t == 'string') ? t : t.name), t => t == tag.name);
			} else {
				return !_.some(tags_order.map( t => (typeof t == 'string') ? null : t._id), t => t == tag._id);
			}
		});
		return rtn;
	}

	@computed get isDirty() {

		const dbTag = this.ui.catalog.tags;
		if (dbTag.length != this.dirtyDisplayTags.length) {
			return true;
		}

		let dirty = false;
		this.dirtyDisplayTags.forEach((v,i) => { dirty = dirty || v != dbTag[i] });
		return dirty;
	}

	@action reset = () => {
		const tags_order = this.ui.catalog.tags;
		tags_order.splice(0, tags_order.length, ...this.dirtyDisplayTags);
		this.saveUiCatalogToDatabase();
	}

	@action addTag = (tag: OmdbTag, index=-1) => {
		const tags_order = this.ui.catalog.tags;
		const uiTag = {_id: tag._id, name: tag.name};
		if (index >= 0) {
			tags_order.splice(index, 0, uiTag);
		} else {
			tags_order.push(uiTag);
		}
		this.saveUiCatalogToDatabase();
	}

	@action removeTag = (tag: OmdbTag) => {
		const tags_order = this.ui.catalog.tags;
		let index;
		if (tag.reserved) {
			index = tags_order.map( t => (typeof t == 'string') ? t : t.name).indexOf(tag.name);
		} else {
			index = tags_order.map( t => (typeof t == 'string') ? null : t._id).indexOf(tag._id);
		}

		if (index >= 0) {
			tags_order.splice(index, 1);
			this.saveUiCatalogToDatabase();
		}
	}

	@action switchTag = (switchFrom: number, switchTo:number) => {
		const tags_order = this.ui.catalog.tags;
		tags_order.move(switchFrom, switchTo);
		this.saveUiCatalogToDatabase();
	}

	@action saveUiCatalogToDatabase() {
		this.props.context.saveUiCatalogToDatabase(this.props.objectTypeDescriptor);
	}

	render() {
		const {props, isDirty, reset} = this;

		const dropdownDefaultText = i18n.intl.formatMessage({defaultMessage: `Add a catalog field...`, description: "[CatalogSidebarTags] a note message - add a tag as catalog on object browser sidebar"});
		const resetBtnText = i18n.intl.formatMessage({defaultMessage: `Reset`, description: "[CatalogSidebarTags] Reset the catalog setting changes since switch to the page"});

		return <div className={css.root}>
			<Navbar>
				<NavbarGroup align={Alignment.RIGHT}>
					<AddTagDropdown items={this.remainingTags}
					                filterable={false}
					                onItemSelect={item => this.addTag(item)}
					                itemRenderer={(item, {handleClick, modifiers}) => {
						                return <a className={classNames(bp.Classes.MENU_ITEM)}
						                          key={`${item.name}_${item._id}`}
						                          onClick={handleClick}>
							                {props.context.translateTagName(item)}
						                </a>
					                }}>
						<Button disabled={this.remainingTags.length == 0} text={dropdownDefaultText} rightIcon='caret-down'/>
					</AddTagDropdown>

					<NavbarDivider/>

					<AnchorButton disabled={!isDirty} onClick={reset} text={resetBtnText}/>

				</NavbarGroup>
			</Navbar>

			<SortableFieldsContainer
				className={css.catalogFields}
				useDragHandle
				axis="y"
				component={this}
				helperClass={css.sortableDrag}
				onSortEnd={(e: { oldIndex: number, newIndex: number }) => {
					const {newIndex, oldIndex} = e;
					this.switchTag(oldIndex, newIndex);
				}}
				{...props}/>
		</div>
	}
}

