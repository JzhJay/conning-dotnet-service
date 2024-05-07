import {OmdbUiLayoutTab} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs';
import type {IObjectTypeDescriptor, OmdbUiCardDefinition} from 'stores';
import {i18n} from 'stores';
import {observer} from 'mobx-react';
import * as css from './CardBuilder.css';
import {bp, sem, AppIcon, OmdbAdminPageContext} from 'components'
import {Select} from '@blueprintjs/select';
import {Button, ButtonGroup, Tooltip, EditableText, ContextMenuTarget, Menu, MenuItem, MenuDivider} from '@blueprintjs/core';
import {OmdbCardSection, OmdbCardTag, appIcons, OmdbTag} from 'stores';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import { observable, computed, action, makeObservable } from 'mobx';

const {Card} = sem;
const AddTagDropdown = Select.ofType<OmdbTag>();
const TagDragHandle = SortableHandle(() => <bp.Icon icon='drag-handle-vertical' title='Move this tag' className={classNames(css.dragHandle, 'draggable')}/>)
const SectionDragHandle = SortableHandle(() => <div className={css.dragContainer}><bp.Icon icon='drag-handle-vertical' title='Move this Section' className={classNames(css.dragHandle, 'draggable')}/></div>)

@observer
@ContextMenuTarget
class CardTag extends React.Component<{ index: number, section: OmdbCardSection, tag: OmdbCardTag, context: OmdbAdminPageContext, builder: OmdbCardBuilder, cardSection:CardSection}, {}> {

	omdbTag: OmdbTag;
	constructor(props) {
		super(props);
		const cardTag = this.props.tag;
		this.omdbTag = _.find(this.props.context.tags, omdbTag => cardTag.reserved !== false ? cardTag.name == omdbTag.name : cardTag._id == omdbTag._id);
	}

	removeBtnText = i18n.intl.formatMessage({defaultMessage: `Remove Tag`, description: "[OmdbCardBuilder] button text - remove the tag from the card section group"});
	get removeOptTextWithName() {
		return i18n.intl.formatMessage(
			{
				defaultMessage: `Remove {tagName} Tag`,
				description: "[OmdbCardBuilder] context menu option - remove the tag from the card section group"
			},
			{tagName: `'${this.props.builder.formatDisplayLabel(this.omdbTag)}'`}
		);
	}

	render() {
		const {builder, section, tag } = this.props;
		const dataTag = this.omdbTag || tag as OmdbTag;
		const displayName = builder.formatDisplayLabel(dataTag);
		const isHidden = tag.hide === true;

		return <div className={css.tag}>
			<TagDragHandle />
			<div className={css.tagContent}>
				<span className={css.tagLabel}>
					{displayName}&nbsp;&nbsp;
					{isHidden && <Tooltip content={i18n.intl.formatMessage({defaultMessage: "Set Visible", description: "[OmdbCardBuilder] a tooltip of a icon which means this tag will not be shown on the card. click the icon to set visible"})}>
						<bp.Icon icon={"eye-off"} onClick={() => builder.setTagVisible(section, dataTag)}/>
					</Tooltip>}
				</span>
			</div>
			<Tooltip content={this.removeBtnText}>
				<Button icon="trash" onClick={() => builder.removeTag(section, dataTag)}/>
			</Tooltip>
		</div>
	}

	renderContextMenu() {
		const {section, context, builder, builder:{remainingTags}, cardSection} = this.props;
		const omdbTag = this.omdbTag;
		const ui = builder.props.objectTypeDescriptor.ui;
		const removeSectionTitle = cardSection.removeOptTextWithName;
		const removeTagTitle = this.removeOptTextWithName;

		const moveOptText = i18n.intl.formatMessage({defaultMessage: `Move Tag to Section...`, description: "[OmdbCardBuilder] Indicates a context menu catalog title choose which section to move."});
		const addOptText = cardSection.addOptText;

		return <Menu>
			<MenuItem icon='trash' text={removeSectionTitle} onClick={() => builder.removeSection(section)} />
			<MenuDivider />
			<MenuItem icon='trash' text={removeTagTitle} onClick={() => builder.removeTag(section, omdbTag)} />
			{ui.card.sections.length > 1 && <MenuItem text={moveOptText}>{
				ui.card.sections.map((s,i) => {
					const sectionLabel = i18n.intl.formatMessage({defaultMessage: `Section {sectionName}`, description: "[OmdbCardBuilder] Indicates move current tag to select section"}, {sectionName: s.label ? `'${s.label}'` : (i+1)});
					return <MenuItem key={`menuSection_${i}`} text={sectionLabel} disabled={s == section} onClick={() => builder.moveTag(section, s, omdbTag)} />;
				})
			}</MenuItem>}
			{remainingTags && remainingTags.length > 0 && <>
				<MenuDivider title={addOptText} />
				{remainingTags.map((tag:OmdbTag, i) => {
					const label = builder.formatDisplayLabel(tag);
					const index = _.findIndex(section.tags, cardTag => typeof cardTag != 'boolean' && ( cardTag.reserved !== false ? cardTag.name == omdbTag.name : cardTag._id == omdbTag._id))
					return <MenuItem key={`menuItem_${i}`} text={label} onClick={() => builder.addTag(section, tag, index+1)} />
				})}
			</>}
		</Menu>
	}

}
const CardTagWrapper = SortableElement(CardTag);

@observer
class SectionTags extends React.Component<{section: OmdbCardSection, context: OmdbAdminPageContext, builder: OmdbCardBuilder, cardSection:CardSection}, {}> {
	render() {
		const { section, section: {tags: cardTags}, context, builder, cardSection } = this.props;
		let renderPreKey = Math.random();
		return <div className={classNames(css.sectionTags)}>
			{cardTags.map((tag: OmdbCardTag, i) => <CardTagWrapper
				index={i}
				key={`${renderPreKey}_${i}`}
				tag={tag}
				section={section}
				context={context}
				builder={builder}
				cardSection={cardSection}
			/>)}
		</div>
	}
}
const SectionTagsWrapper = SortableContainer(SectionTags);

@observer
@ContextMenuTarget
class CardSection extends React.Component<{index: number, section: OmdbCardSection, context: OmdbAdminPageContext, builder: OmdbCardBuilder}, {}> {

	removeBtnText = i18n.intl.formatMessage({defaultMessage: `Remove Section`, description: "[OmdbCardBuilder] remove a section group button"});
	addOptText = i18n.intl.formatMessage({defaultMessage: `Add Tag...`, description: "[OmdbCardBuilder] a note message - add a tag to the card section group"});

	get removeOptTextWithName() {
		return i18n.intl.formatMessage(
			{
				defaultMessage: `Remove {sectionName} Section`,
				description: "[OmdbCardBuilder] remove this section group content menu item, which is empty or contains one/many tags"
			},
			{sectionName: this.props.section.label ?
			              `'${this.props.section.label}'` :
			              i18n.intl.formatMessage( { defaultMessage: `this`, description: "[OmdbCardBuilder] display 'this' if user not set the section name"})
			}
		);
	}

	render() {
		const {section, context, builder, builder:{remainingTags}} = this.props;

		const defaultSectionName = i18n.intl.formatMessage({defaultMessage: `Empty Section Name`, description: "[OmdbCardBuilder] Indicates default message if user not set the section group name"});
		return (<div  className={css.section}>
			<SectionDragHandle/>
			<Card.Content extra className={css.sectionBody}>
				<div className={css.title}>
					<EditableText
						value={section.label}
						selectAllOnFocus
						placeholder={defaultSectionName}
						onChange={v => builder.updateSectionLabel( section, v, false)}
						onConfirm={v => builder.updateSectionLabel( section, v, true)}
					/>
					<AddTagDropdown
						items={remainingTags}
						filterable={false}
						onItemSelect={tag => builder.addTag(section, tag)}
						itemRenderer={(item: OmdbTag, {handleClick, modifiers}) => {
			                return <a className={classNames(bp.Classes.MENU_ITEM)}
			                          key={`${item.name}_${item._id}`}
			                          onClick={handleClick}>
				                {builder.formatDisplayLabel(item)}
			                </a>
		                }}
						className={css.addTagDropdown}
					>
						<Button disabled={remainingTags.length == 0} text={this.addOptText} rightIcon='caret-down'/>
					</AddTagDropdown>
					<Tooltip content={this.removeBtnText}>
						<Button icon="trash" onClick={() => builder.removeSection(section)}/>
					</Tooltip>
				</div>
				<SectionTagsWrapper
					section={section}
					context={context}
					builder={builder}
					cardSection={this}
					axis="y"
					useDragHandle
					onSortEnd={(sort) => {
						const {newIndex, oldIndex, collection} = sort;
						if (newIndex < 0 || oldIndex < 0 || newIndex == oldIndex ) {
							return;
						}
						let item = section.tags.splice(oldIndex, 1);
						section.tags.splice(newIndex, 0, ...item);
						this.props.builder.saveUiCardToDatabase();
					}}
				/>
			</Card.Content>
		</div>);
	}

	renderContextMenu() {
		const {section, builder, builder:{remainingTags}} = this.props;
		return <Menu>
			<MenuItem icon='trash' text={this.removeOptTextWithName} onClick={() => builder.removeSection(section)} />
			{remainingTags && remainingTags.length && <>
				<MenuDivider title={this.addOptText} />
				{remainingTags.map((tag:OmdbTag, i) => {
					const label = builder.formatDisplayLabel(tag);
					return <MenuItem key={`menuItem_${i}`} text={label} onClick={() => () => builder.addTag(section, tag)} />
				})}
			</>}
		</Menu>
	}
}
const CardSectionWrapper = SortableElement(CardSection);

@observer
class CardSections extends React.Component<{context: OmdbAdminPageContext, sections: OmdbCardSection[], builder: OmdbCardBuilder }, {}> {
	render() {
		return <div className={classNames(css.sections)}>
			{this.props.sections.map((section, i) => {
				return <CardSectionWrapper index={i} key={`CardSections_${i}`} section={section} context={this.props.context} builder={this.props.builder}/>
			})}
		</div>
	}
}

const CardSectionsWrapper = SortableContainer(CardSections);

@observer
export class OmdbCardBuilder extends React.Component<{ context: OmdbAdminPageContext, objectTypeDescriptor: IObjectTypeDescriptor, tab: OmdbUiLayoutTab }, {}> {
	static EXCLUDE_TAG = ["name", "userTagValues"];

	_originalSetting;

	constructor(props) {
        super(props);
        makeObservable(this);
        const objectTypeDescriptor = this.props.objectTypeDescriptor;
        const cardDef = objectTypeDescriptor.ui.card;

        //clear dirty data
        const userTags = this.props.context.userTags;
        let isUpdate = false;
        // remove userTag from section which included removed userTag
        _.forEach(cardDef.sections, section => {
			isUpdate = isUpdate || !!(_.remove<any>(section.tags, tag => {
				if (typeof tag == 'boolean') {
					return true;
				}
				if (!tag._id) {
					return false;
				}
				return !_.some(userTags, userTag => userTag._id == tag._id);
			})?.length)
		})
        // remove empty section.
        isUpdate = !!(_.remove<any>(cardDef.sections, section => !section.label && (!section.tags || !section.tags.length))?.length);
        if (isUpdate) {
			this.props.context.saveUiCardToDatabase(objectTypeDescriptor);
		}
        this._originalSetting = JSON.stringify(cardDef);
        this.props.tab.isDirty = false;
    }

	@action reset() {
		const objectTypeDescriptor = this.props.objectTypeDescriptor;
		objectTypeDescriptor.ui.card = JSON.parse(this._originalSetting);
		this.props.context.saveUiCardToDatabase(objectTypeDescriptor);
		this.props.tab.isDirty = false;
	}

	@computed get setting(): OmdbUiCardDefinition{
		return this.props.objectTypeDescriptor.ui.card;
	}

	@computed get remainingTags() {
		const allTags = this.props.context.tags;
		if (!allTags || !allTags.length) {
			return [];
		}
		const usedTags = _.flatten(this.setting.sections.map( section => section.tags.filter(tag => typeof tag != 'boolean'))) as (OmdbCardTag[]);
		let rtn = allTags.filter((tag) => {
			if (_.some(OmdbCardBuilder.EXCLUDE_TAG, n => n == tag.name)) {
				return false;
			}
			if (!tag._id) {
				return !_.some(usedTags, t => !t._id && t.name == tag.name);
			} else {
				return !_.some(usedTags, t => t._id == tag._id);
			}
		});
		return rtn as (OmdbTag[]);
	}

	render() {
		const {setting, props: {context}} = this;

		const appIcon= appIcons.cards.simulation.cardIcon;

		const addOptText = i18n.intl.formatMessage({defaultMessage: `Add New Section`, description: "[OmdbCardBuilder] Add New Section group, which is empty or contains one/many tags"});

		return (
			<div className={css.root}>
				<Card className={css.card}>
					<Card.Content className={css.headerContent}>
						<Card.Header style={{display: 'flex'}}>
							{appIcon && <AppIcon className={css.cardIcon} large fitted icon={appIcon}/>}
							&nbsp;
							<span className={css.title}>{context.firstSelectedObjectTypeText}</span>
							&nbsp;
							<ButtonGroup className={classNames(css.buttonBar, bp.Classes.POPOVER_DISMISS, "right floated")}>
								<Tooltip content={addOptText}>
									<Button icon='plus' onClick={this.addSection} text={addOptText}/>
								</Tooltip>
							</ButtonGroup>
						</Card.Header>
					</Card.Content>

					<CardSectionsWrapper context={context}
					              sections={setting.sections}
					              builder={this}
					              axis="y"
					              useDragHandle
			                      onSortStart={() => { }}
			                      onSortEnd={(sort) => {
				                      const {newIndex, oldIndex} = sort;
				                      if (newIndex < 0 || oldIndex < 0 || newIndex == oldIndex ) {
				                      	return;
				                      }
				                      const setting = this.setting;
				                      let item = setting.sections.splice(oldIndex, 1);
				                      setting.sections.splice( newIndex, 0, ...item);
				                      this.saveUiCardToDatabase();
			                      }}

					/>
				</Card>
			</div>)
	}

	@action addSection = () => {
		this.props.objectTypeDescriptor.ui.card.sections.unshift(observable({
			tags:  observable.array([])
		}))
	}

	@action removeSection = (section: OmdbCardSection) => {
		const {context} = this.props;
		const sections = this.props.objectTypeDescriptor.ui.card.sections;
		const removeItems = _.remove(sections, s => s == section);
		if ( removeItems?.length) {
			this.saveUiCardToDatabase();
		}
	}

	@action updateSectionLabel = (section: OmdbCardSection, value: string, isConfirm: boolean) => {
		if (value == null || value === "" ) {
			delete section.label;
		} else {
			section.label = value;
		}
		if (isConfirm) {
			this.saveUiCardToDatabase();
		}
	}

	@action addTag = (section: OmdbCardSection, tag: OmdbTag, index?: number) => {
		const insertTag = {
			_id: tag._id,
			name: tag.name,
			reserved: !tag._id
		};
		if (index == null) {
			section.tags.push(insertTag)
		} else {
			section.tags.splice(index, 0, insertTag);
		}
		this.saveUiCardToDatabase();
	}

	@action removeTag = (section: OmdbCardSection, tag: OmdbTag) => {
		const removeItems = _.remove(section.tags, t => (typeof t == 'boolean') || (tag._id ? t._id == tag._id : t.name == tag.name));
		if (removeItems?.length) {
			this.saveUiCardToDatabase();
		}
	}

	@action moveTag = (oldSection: OmdbCardSection, newSection: OmdbCardSection, tag: OmdbTag) => {
		_.remove(oldSection.tags, t => (typeof t == 'boolean'));
		_.remove(newSection.tags, t => (typeof t == 'boolean'));
		const removeItems = _.remove(oldSection.tags as OmdbCardTag[], t => (tag._id ? t._id == tag._id : t.name == tag.name));
		if (removeItems?.length) {
			newSection.tags.push(...removeItems);
			this.saveUiCardToDatabase();
		}
	}

	@action setTagVisible = (section: OmdbCardSection, tag: OmdbTag) => {
		const tags = section.tags.filter( t => typeof t != 'boolean') as OmdbCardTag[];
		const item = _.find(tags, t => tag._id ? t._id == tag._id : t.name == tag.name);
		if (item && item.hide) {
			delete item.hide;
			this.saveUiCardToDatabase();
		}
	}

	saveUiCardToDatabase() {
		this.props.context.saveUiCardToDatabase(this.props.objectTypeDescriptor);
		this.props.tab.isDirty = true;
	}

	formatDisplayLabel( tag: {name: string, _id?:string, label?:string, displayName?: string}) {
		tag = _.assign(tag, {reserved: !tag._id});
		return this.props.context.translateTagName(tag as any);
	}
}
