import {ObjectNameCheckerDialog} from 'components/system/ObjectNameChecker/ObjectNameCheckerDialog';
import {SmartBrowserContextMenu} from 'components/widgets/SmartBrowser/SmartBrowserContextMenu';
import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import {visibleTagUtil} from 'stores/objectMetadata/VisibleTags';
import type {IObjectTypeDescriptor, IOmdbTag, OmdbUserTag} from '../../../../stores/objectMetadata/OmdbTag';
import * as css from './SmartCard.css';
import {computed, observable, makeObservable, action, reaction} from 'mobx';
import {AppIcon, SortableCardsPanel, bp, sem, FavoriteIndicator, UiTagAttributeOverride} from 'components';
import type {IOmdbQueryGraph, IApplicationIcon, OmdbCardSection, OmdbCardTag} from 'stores';
import {apolloStore, omdb, utility, site, user, i18n} from 'stores';
import {observer} from 'mobx-react';
import {SmartCardSection} from './SmartCardSection';
import {SmartCardTagLabel} from './SmartCardTagLabel';
import {ButtonGroup, ContextMenu } from '@blueprintjs/core';

export interface SmartCardProps {
	loading?: boolean;
	style?: React.CSSProperties;
	appIcon?: IApplicationIcon;
	appIconTooltip?: string; // | React.ReactNode;
	readonly?: boolean;
	icon?: React.ReactNode;
	className?: string;
	isTooltip?: boolean;
	panel?: SortableCardsPanel;
	onRename?: (value: string) => void;
	titleIcons?: React.ReactNode | React.ReactNode[];
	footer?: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: sem.CardProps) => void;
	onDoubleClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
	children?: React.ReactNode;
	title?: string | OmdbCardTag;
	showHeader?: boolean;
	showFavoriteIcon?: boolean;
	showToolbar?: boolean;
	to?: ReactRouter.RoutePattern;
	sections?: Array<OmdbCardSection | null>;
	availableTags?: Array<IOmdbTag>;
	addSecuritySection?: boolean;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
	userTags?: OmdbUserTag[];
	propagateClick?: boolean;
	includeNameInBody?: boolean;
	enabledDnD?: boolean;
	connectDragSource?: (Element) => React.ReactElement;
	connectDropTarget?: (Element) => React.ReactElement;
	isDropOver?: boolean;
	canDrop?: boolean;

	onDelete?: (id:string) => void;
	onDuplicate?: (id:string) => void;

	onSectionsLoad?: (sections: OmdbCardSection[]) => OmdbCardSection[];
}

interface RegularSmartCardProps extends SmartCardProps {
	model?: any;
}

interface RegularCardSection extends OmdbCardSection {
	flex?: boolean;
}

const dragSource = {
	events: {
		canDrag(props, monitor) {
			const { objectKey, panel } = props;
			const { sourceId, internalMonitor: {registry: {dragSources}}} = monitor;
			const component = dragSources.get(sourceId).ref.current;
			const isHierarchicalViewActive = panel.isHierarchicalViewActive;
			const notHierarchyGroup = objectKey !== 'card:HierarchyGroup';
			const notEditing = component.isEditing !== true;
			return isHierarchicalViewActive && notHierarchyGroup && notEditing;
		},
		beginDrag(props, monitor, component) {
		  if (component.rootRef && !props.panel.selectedItems.has(props.model._id)) {
		  	component.onClick({ target: component.rootRef });
		  }
		  return { component };
		}
	},
	connect(connect) {
		return {
			connectDragSource: connect.dragSource()
		}
	}
};

const dropTarget = {
	events: {
		canDrop(props, monitor) {
			const { objectKey } = props;
			return objectKey === 'card:HierarchyGroup';
		},
		drop(props, monitor, component) {
			if (monitor.didDrop()) {
			  // If you want, you can check whether some nested
			  // target already handled drop
			  return;
			}

			if (component.props.objectKey === 'card:HierarchyGroup') {
				// Obtain the dragged item
				const dragItem = monitor.getItem();
				const folderName = component.props.title.value;
				const originalTitle = dragItem.component.title;
				dragItem.component.rename(`${folderName}/${originalTitle}`);
			}
		}
	},
	connect(connect, monitor) {
		return {
			connectDropTarget: connect.dropTarget(),
			canDrop: monitor.canDrop(),
			isDropOver: monitor.isOver()
		};
	}
};

@observer
class RegularSmartCard extends React.Component<RegularSmartCardProps, {}> {
	static defaultProps = {
		showFavoriteIcon:   true,
		showToolbar:        true,
		showHeader:         true,
		addSecuritySection: false,
		appIcon:            {type: 'blueprint', name: 'blank'},
	};

	static COLUMNS_ALIGN_BOTTOM = ["createdBy", "createdTime", "modifiedBy", "modifiedTime", "comments", "version"];

	@observable.ref visibleTags: Map<string, boolean>;
	@observable isEditing;
	@observable private _objectTypeObj: IObjectTypeDescriptor;
	@observable private _loading = false;
	private hierarchicalPath;
	rootRef= null;

	constructor(props) {
        super(props);

		makeObservable(this);
		this.hierarchicalPath = `${this.props.panel?.props.catalogContext?.path || ""}`

		const objectType = this.props.model?.__typename;
		if (!objectType) {
			return;
		}

		this.visibleTags = visibleTagUtil.getVisibleTagsSetting(visibleTagUtil.getVisibilityKey_card(objectType));

        if (!this.props.panel) {
			this._loading = true;
			apolloStore.client.query<IOmdbQueryGraph>({
				query:     omdb.graph.objectType,
				variables: {objectType: this.props.model.__typename}
			}).then(action(r => {
				this._objectTypeObj = r.data?.omdb.objectType;
				this.setInitVisibleTags();
				this._loading = false;
			}))
		} else {
	        this._objectTypeObj = this.props.panel.props.catalogContext.getObjectType(objectType);
		    this.setInitVisibleTags();
		}
    }

	@action setInitVisibleTags = () => {
		if (!this._objectTypeObj) {
			return;
		}
		this.visibleTags = visibleTagUtil.getVisibleTagsSetting_card(this._objectTypeObj);
	}

	get objectKey() {
		const {model} = this.props;
		return model?.__typename ? visibleTagUtil.getVisibilityKey_card(model.__typename) : null;
	}

	@computed get titleWithPath() {
		const {model, title} = this.props;
		return !title || typeof (title) === 'string' ? title : title.value != null ? title.value : model[title.name];
	}

	@computed get title() {
		const title_string = this.titleWithPath
		const { panel } = this.props;
		const catalogContext = panel && panel.props.catalogContext;
		return catalogContext && catalogContext.isHierarchicalViewEnabled ? catalogContext.nestedObjectName(title_string, this.hierarchicalPath) : title_string;
	}

	@computed get sections(): RegularCardSection[] {
		const model = this.props.model;
		const objectType = model?.__typename;
		const visibleTags = this.visibleTags;
		const sections = this.props.sections || this._objectTypeObj?.ui.card.sections;
		const includeNameInBody = this.props.includeNameInBody;
		if (!sections) {
			return [];
		}
		let overrideSections: RegularCardSection[] = [];
		const uiTagAttributeOverride = UiTagAttributeOverride[objectType];
		const uiTagAttributeOverrideKeys = uiTagAttributeOverride && Object.keys(uiTagAttributeOverride);

		if (includeNameInBody) {
			const tags = _.flatten(sections.map(t => t.tags)).filter(t => typeof t != 'boolean') as OmdbCardTag[];
			if (_.some(tags, t => t.reserved !== false && t.name == SortableCardsPanel.NAME_FIELD)) {
				overrideSections.push({tags: [{name: SortableCardsPanel.NAME_FIELD, label: "Name", value: this.title}]});
			}
		}

		if (!uiTagAttributeOverrideKeys || uiTagAttributeOverrideKeys.length == 0 ){
			overrideSections = [...overrideSections, ...sections];
		} else {
			sections.forEach( (section: OmdbCardSection) => {
				if (!_.some(section.tags, (cardTag) => {
					return typeof cardTag != 'boolean' && !cardTag._id && uiTagAttributeOverrideKeys.indexOf(cardTag.name) >= 0
				})) {
					overrideSections.push(section);
				} else {
					overrideSections.push({
						...section,
						tags: section.tags.map( cardTag => {
							if (typeof cardTag == 'boolean' || cardTag._id ||  uiTagAttributeOverrideKeys.indexOf(cardTag.name) < 0) {
								return cardTag;
							} else {
								return {
									...cardTag,
									...uiTagAttributeOverride[cardTag.name]
								}
							}
						})
					});
				}
			})
		}

		if (this.props.addSecuritySection) {
			overrideSections.push({
				tags: [
					model.createdBy && {label: 'Created By', value: model.createdBy.fullName, canSearch: true},
					model.createdTime && {label: 'Created', value: new Date(model.createdTime).toLocaleString()},
					model.modifiedBy && {label: 'Modified By', value: model.modifiedBy.fullName, canSearch: true},
					model.modifiedTime && {label: 'Last Modified', value: new Date(model.modifiedTime).toLocaleString()},
				]
			});
		}

		overrideSections = overrideSections.map<OmdbCardSection>( section => {
			return {
				...section,
				tags: section.tags?.filter( tag => {
					if (visibleTags?.get((tag as OmdbCardTag)._id || (tag as OmdbCardTag).name) === false) {
						return false;
					}
					if (!includeNameInBody && !tag.reserved && tag.name == SortableCardsPanel.NAME_FIELD) {
						return false;
					}
					return true;
				})
			}
		}).filter(section => section.tags.length > 0);

		if (this.props.onSectionsLoad) {
			overrideSections = this.props.onSectionsLoad(overrideSections);
		}

		const flexSection = _.findLast(overrideSections, section => {
			const tagNames = section.tags.map( tag => tag._id || tag.name);
			return _.difference(tagNames, RegularSmartCard.COLUMNS_ALIGN_BOTTOM).length > 0;
		});
		flexSection && (flexSection.flex = true);

		return overrideSections;
	}

	@action rename = async (val): Promise<boolean> => {
		if (!this._objectTypeObj) {
			try {
				return this.props.onRename(val) as any;
			} finally {
				this.isEditing = null;
			}
		}
		return await ObjectNameCheckerDialog.saveUniqueNameOrDialog({
			newName: val,
			model: this.props.model,
			onRename: async (updateName: string) => {
				try {
					site.busy = true;
					await this.props.onRename(updateName);
					const {panel} = this.props;
					const catalogContext = panel && panel.props.catalogContext;
					if (catalogContext && catalogContext.isHierarchicalViewEnabled) {
						await catalogContext.refresh();
					}
				} finally {
					this.isEditing = null;
					site.busy =  false;
				}
			},
			canDuplicate: this._objectTypeObj.ui.uniqueName === false
		}).then(action((isDuplicated) => {
			if (isDuplicated !== true) {
				this.isEditing = null;
			}
			return !isDuplicated;
		}));
	}

	@computed get canEdit() {
		return this.props.onRename != null && this.props.isTooltip !== true && this.props.readonly !== true;
	}

	render() {
		const { isEditing, title, titleWithPath, canEdit } = this;
		const { connectDragSource, connectDropTarget, isDropOver, canDrop, loading, style, title: propTitle, showHeader, showToolbar, showFavoriteIcon, footer, model, panel, isTooltip, className, titleIcons, icon, appIcon, appIconTooltip, children } = this.props;

		if ((isTooltip || !showHeader ) && this._loading === true) {
			return <sem.Card className={css.smartCard}>
				<div style={{display: 'flex', alignItems: 'center', margin: 10}}>
					<bp.Spinner size={14} />
					<span style={{marginLeft:5}}>{
						i18n.common.MESSAGE.WITH_VARIABLES.LOADING(i18n.intl.formatMessage({defaultMessage: "Card Settings", description: "[SmartCard] the smart card layout configuration data"}))
					}</span>
				</div>
			</sem.Card>
		}

		const catalogContext = panel && panel.props.catalogContext;
		const objectTypeDesc = this._objectTypeObj;
		const to = showToolbar ? (this.props.to ? this.props.to : model && model.clientUrl ? model.clientUrl : null) : null;
		const isShowDropEffect = isDropOver && canDrop;

		return (
			<sem.Ref innerRef={(ref) => {
				if (ref && connectDragSource) {	// check if D&D is enabled
					connectDragSource(ref);
					connectDropTarget(ref);
					this.rootRef = ref;
				}
			}}>
				<sem.Card key={model && model.id} style={style} as='div'
						className={classNames(css.smartCard, className, {
							fluid:           isTooltip,
							[css.isTooltip]: isTooltip,
							'selected':      panel && model && !isTooltip && panel.selectedItems.has(model._id),
							[css.showDropHighlight]: isShowDropEffect
						})}
						onContextMenu={this.onContextMenu}
						onClick={this.onClick} onDoubleClick={this.onDoubleClick}>

					{showHeader && <sem.Card.Content className={css.headerContent}>
						<sem.Card.Header>
							{(appIcon || icon) && <div className={css.headerIcon}><div>
								{appIcon && <AppIcon className={css.cardIcon} title={appIconTooltip} large fitted icon={appIcon}/>}
								{icon}
							</div></div>}
							{isEditing !== true
							? <>
								 <span className={css.title} key='title'>
									<SmartCardTagLabel
										panel={panel}
										tag={null}
										value={title}
										isTitle
										to={to}
									/>
									{canEdit && <bp.Tooltip className={css.rename} position={"bottom"} content={i18n.common.OBJECT_CTRL.RENAME}>
										<bp.Button icon='edit' onClick={action((e) => {
											e.preventDefault();
											e.stopPropagation();
											this.isEditing = true;
										})}/>
									</bp.Tooltip>}
								 </span>
								 <div className={css.emptyHeaderSpace} />

								 {showFavoriteIcon && model && model.isFavorite != null && <FavoriteIndicator hasTooltip model={model}/>}

								 {showToolbar && titleIcons && <div className={classNames(css.buttonBar, "right floated", bp.Classes.POPOVER_DISMISS)}>
									 {/*{to && !routing.isActive(to) &&*/}
									 {/*<bp.Tooltip  content="Navigate To">*/}
									 {/*<Link className="pt-button pt-icon-link" to={to}/>*/}
									 {/*</bp.Tooltip>}*/}

									 {titleIcons}
								 </div>}
							 </>
							: <bp.EditableText
								 className={css.editableName}
								 isEditing={true}
								 defaultValue={titleWithPath}
								 key='editable-title'
								 selectAllOnFocus
								 onCancel={action(() => this.isEditing = false)}
								 onConfirm={this.rename}
							 />}


						</sem.Card.Header>
						{/*<Card.Description>*/}
						{/*<bp.EditableText className={css.editableDescription} disabled={isTooltip} defaultValue={description} placeholder='Description' onConfirm={onRename}/>*/}
						{/*</Card.Description>*/}
					</sem.Card.Content>}

					{propTitle && typeof (propTitle) == 'string' && <sem.Card.Content className={css.headerContent} style={{minHeight: 0}}>
						<sem.Card.Header style={{display: 'block', textAlign: 'center', fontSize: 22, padding: 3, minHeight: 0}}>
							{propTitle}

							{showToolbar && <ButtonGroup className={classNames(css.buttonBar, "right floated", bp.Classes.POPOVER_DISMISS)}>
								{/*{to && !routing.isActive(to) &&*/}
								{/*<bp.Tooltip  content="Navigate To">*/}
								{/*<Link className="pt-button pt-icon-link" to={to}/>*/}
								{/*</bp.Tooltip>}*/}

								{titleIcons}
							</ButtonGroup>}
						</sem.Card.Header>
					</sem.Card.Content>}

					{/* model && _.some(model.userTagValues) && <SmartCardSection key={"user-tag-values"}
																	panel={panel}
																	model={model}>
						{model.userTagValues.map((utv: OmdbUserTagValue) =>
							<div key={utv._id} className={classNames(className, css.tag)}>
								{/* tag Label * /}
								<SmartCardTagLabel tag={utv.tag} panel={panel}/>

								<div className={css.tagValueContainer}>
									{/*{utv.tag.multiple || isObservableArray(renderValue) || _.isArray(renderValue)* /}
									{/*? !renderValue ? null : renderValue.slice().map((v, i) => <SmartCardTagValue value={v} tag={f} panel={panel} key={i.toString()} objectType={objectType}/>)* /}
									<SmartCardTagValue style={{color: utv.color, background: utv.background}}
													value={utv.label ? utv.label : utv.value}
													tag={utv.tag} panel={panel}
													className={css.userTagValue}
													objectType={model.__type ? model.__type : typeof(model)}/>
								</div>
							</div>)}
					</SmartCardSection> */}
					{this.sections.map((s, i) =>
						<SmartCardSection
							key={i.toString()}
							objectTypeDesc={objectTypeDesc}
							label={s.label}
							flex={s.flex}
							tags={s.tags}
							card={this}
							model={model}
							panel={panel}
						/>
					)}

					{loading && <>
						{_.range(2).map(i =>
							<div key={i} className={classNames(css.section)}>
								{_.range(5).map(i => <div key={i} className={classNames(css.tag)}>
									{/* tag Label */}
									<span className={classNames(css['tag-label'])}>
									<span className={bp.Classes.SKELETON}>
										{utility.randomString(6, 12)}:
									</span>
								</span>
									<div className={css.tagValueContainer}>
										<div className={css['tag-value-wrapper']}>
										<span className={bp.Classes.SKELETON}>
											{utility.randomString(5, 20)}
										</span>
										</div>
									</div>
								</div>)}
							</div>)}
					</>}

					{children}

					{footer}
				</sem.Card>
			</sem.Ref>
		);
	}

	onClick = (e, data) => {
		const $target = $(e.target);

		//
		if (!$target.is('button')
			&& !$target.is('input')
			&& !$target.hasClass(bp.Classes.EDITABLE_TEXT)
			&& (!$target.is('a[href]')
				&& $target.parents('a[href],.SmartCard__tag-value').length == 0)) {

			const { props: { onClick, panel }} = this;

			onClick && onClick(e, data);

			this.props.propagateClick != false && panel && panel.card_onClick(this, e);
		}
	}

	onDoubleClick = (e) => {
		const $target = $(e.target);

		//
		if (!$target.is('button')
			&& !$target.is('input')
			&& !$target.hasClass(bp.Classes.EDITABLE_TEXT)
			&& (!$target.is('a[href]')
				&& $target.parents('a[href],.SmartCard__tag-value').length == 0)) {

			const {props: {model, onDoubleClick}} = this;

			onDoubleClick && onDoubleClick(e);
			model && model.navigateTo && model.navigateTo();
		}
	}

	onContextMenu = (e, data) => {
		const {availableTags, model, panel} = this.props;
		panel?.card_onContextMenu && panel.card_onContextMenu(this, e);
		ContextMenu.show(
			<SmartBrowserContextMenu availableTags={availableTags} visibleTags={this.visibleTags} model={model} panel={panel} />,
			{left: e.clientX - 8, top: e.clientY - 8}
		);

		e.preventDefault();
		this.props.onContextMenu && this.props.onContextMenu(e);
	}
}

const DndSmartCard = _.flow(
	DragSource('SmartCard', dragSource.events, dragSource.connect),
    DropTarget('SmartCard', dropTarget.events, dropTarget.connect)
)(RegularSmartCard);

export class SmartCard extends React.Component<RegularSmartCardProps, {}> {
	render() {
		const { enabledDnD = false, children, ...restProps } = this.props;
		if (enabledDnD) {
			return <DndSmartCard {...restProps}>{children}</DndSmartCard>;
		}

		return <RegularSmartCard {...restProps}>{children}</RegularSmartCard>;
	}
}