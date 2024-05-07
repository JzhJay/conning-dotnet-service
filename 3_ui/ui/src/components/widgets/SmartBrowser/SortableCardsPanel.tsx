import {Fragment} from 'react';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {FormattedMessage} from 'react-intl';
import {IOmdbTag} from '../../../stores/objectMetadata/OmdbTag';
import {ClimateRiskAnalysisCard} from '../../system/ClimateRiskAnalysis/ClimateRiskAnalysisCard';
import {UserFileCard} from '../../system/UserFile/UserFileCard';
import {SmartTable_Blueprint} from "./SmartTable_blueprint";
import {
	computed,
	observable,
	action,
	autorun,
	isObservableArray,
	makeObservable, runInAction,
} from 'mobx';
import {GridPanel, AppIcon, bp, sem, Splitter, LoadingEllipsis, ErrorMessage, FolderCard, ErrorBoundary} from 'components';
import {ObjectCatalogSearcher} from '../../system/ObjectCatalog/internal/ObjectCatalogSearcher';
import * as stores from 'stores';
import type {OmdbUiCardDefinition, OmdbUiTableDefinition} from 'stores';
import {
	Simulation,
	routing,
	site,
	appIcons,
	utility,
	settings,
	OmdbTag,
	OmdbCardTag,
	IO,
	api, omdb, ObjectTypeQuery, fragments, UserFile, ClimateRiskAnalysis, i18n
} from 'stores';
import {Observer, observer} from 'mobx-react';
import {SmartCard} from "./SmartCard";
import {KeyCode} from "utility";
import {IconButton} from "../../blueprintjs/IconButton";
import {NavbarDivider, Tooltip, Button, NavbarHeading, Card} from "@blueprintjs/core";
import {AutoSizer} from "react-virtualized";
import {ObjectCatalogSidebar} from '../../system/ObjectCatalog/internal';
import {ObjectCatalogContext} from '../../../stores/objectMetadata';
import type {IconName} from '@blueprintjs/core';
import ReactPaginate from 'react-paginate';
import {Select} from '@blueprintjs/select';
import {LoadingUntil} from '../LoadingUntil';
import {SimulationCard} from '../../system/simulation';
import {QueryCard} from '../../system/query-tool';
import {IOCard} from '../../system/IO';

import FlipMove from 'react-flip-move';
import * as css from './SortableCardsPanel.css';

const ItemsPerPage = Select.ofType<number>()

type View = 'card' | 'table';
const HIDE_STATUS_LABEL_MS = 5000;

export interface CardFilter<T> {
	key: string;
	icon?: IconName;
	text?: string;
	type?: 'checkbox' | 'radio';
	applyFilter?: (cards: Array<T>) => Array<T>;
}

interface QueryString {
	filter?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
	userFilter?: string | number;
	defaultSelect?: string;
	searchText?: string;
	page?: string;
	path?: string;
	itemsPerPage?: string;
}

export interface ObjectBrowserProps<T> {
	objectType?: string;
	view?: View;
	onSelect?: (objects: T[] | T) => void;
	multiselect?: boolean;
	queryParams?: HistoryModule.Query;
	showObjectToolbar?: boolean;
	hideSidebar?: boolean;
	updateUrl?: boolean;
}

interface MyProps<T> extends ObjectBrowserProps<T> {
	cards?: T[] | boolean;
	loadingMessage?: string;

	uiDefinition?: {table?: OmdbUiTableDefinition , card?: OmdbUiCardDefinition};
	tableColumns?: Array<any | wijmo.grid.Column>;

	tags?: OmdbTag[];

	renderCard?: (result: T, panel: SortableCardsPanel, key: string, style: React.CSSProperties) => React.ReactNode;
	className?: string;
	catalogContext?: ObjectCatalogContext;
	loaded?: boolean;


	createItemLink?: React.ReactNode;

	fullTextSearch?: boolean;

	onSetView?: (view: View) => void;




	renderEmptyPanel?: () => React.ReactNode;



	hideToolbar?: boolean;
	showUserFilter?: boolean;


	selectable?: boolean;


	toolbarChildrenLeft?: (panel: SortableCardsPanel) => React.ReactNode | React.ReactNode[];
	toolbarChildrenRight?: (panel: SortableCardsPanel) => React.ReactNode | React.ReactNode[];

	extraHotkeys?: Array<bp.HotkeyConfig>;
	onContextMenu?: React.MouseEventHandler<HTMLDivElement>;



	filters?: Array<CardFilter<T>>;

	onColumnWidthChanged?: (index: number, width: number) => void;
}

export const UiTagAttributeOverride = {
	[stores.Simulation.ObjectType] : {
		userFile: { label: "File", type: stores.UserFile.ObjectType}
	},
	[stores.Query.ObjectType] : {
		appIconsimulations: { type: stores.Simulation.ObjectType}
	},
	[stores.IO.ObjectType] : {
		assetReturnsSimulation: { type: stores.Simulation.ObjectType },
		companyDataSimulation: { type: stores.Simulation.ObjectType },
		companyDataRepository: { type: stores.Simulation.ObjectType }
	}
}

@observer
export class SortableCardsPanel extends React.Component<MyProps<any>, {}> {
	static NAME_FIELD = "name";
	static ACTIONS_FIELD = "actions";
	static COMMENTS_FIELD = "comments"

	static defaultProps = {
		hideToolbar:    false,
		fullTextSearch: true,
		selectable:     false,
		showObjectToolbar: true,
		fields:         []
	}

	splitter;
	public catalogSidebar: ObjectCatalogSidebar;

	constructor(props, state) {
        super(props, state);

        makeObservable(this);

        const {props: {tableColumns, queryParams, cards, catalogContext}} = this;

        this._toDispose.push(autorun(() => {
			const {queryParams, filters} = this.props;
			if (queryParams && !utility.deepEqJSON(this.lastQueryParams, queryParams)) {
				this.lastQueryParams = queryParams;

				this.updateFromQueryParams();
			}
		}));

        if (catalogContext) {
			this._toDispose.push(autorun(() => {
				catalogContext.view = this.props.view;
			}));

			if (queryParams) {
				catalogContext.onDistinctTagsLoaded = () => {
					if (!this.hasProcessedQueryParams) {
						this.updateSelectedTagsFromQueryParams();
						this.hasProcessedQueryParams = true;
					}
				}
				// this._toDispose.push(autorun(() => {
				// 	const {distinctTagValues} = catalogContext;
				// 	if (distinctTagValues.size > 0) {
				// 		this.updateSelectedTagsFromQueryParams();
				// 		this.hasProcessedQueryParams = true;
				// 	}
				// }));

				this._toDispose.push(autorun(() => {
					const {searchText, sortBy, userFilter, sortOrder, selectedTagValues, isLoadingDistinct, itemsPerPage, page, path} = catalogContext;
					const {activeFilters, hasProcessedQueryParams} = this;

					if (hasProcessedQueryParams) {
						this.updateQueryParams();
					}
				}));
			}

			const defaultField = this.tableColumns.find(f => f.default);
			if (!queryParams || _.isEmpty(queryParams.sortBy)) {
				catalogContext.sortBy = defaultField ? defaultField.name : '';

				if (this.defaultSelect && !this.processedDefaultSelect) {
					catalogContext.sortBy = "modifiedTime";
				}
			}

			if (!queryParams || _.isEmpty(queryParams.sortOrder)) {
				catalogContext.sortOrder = defaultField ? defaultField.reverse ? 'desc' : 'asc' : 'asc';
			}

			if (!catalogContext.sortBy) {
				catalogContext.sortBy = "modifiedTime";
				catalogContext.sortOrder = "desc";
			}

			if (!catalogContext.initialized) {
				catalogContext.initialize();
			}

			const rId = omdb.registerQueryRefreshers({
				objectTypes: _.map(catalogContext.objectTypes, iocc => iocc.id),
				refresher: () => catalogContext.refresh()
			});
			this._toDispose.push(() => omdb.removeSavedQueryRefreshers(rId));

		}
    }

	get isHierarchicalViewActive():boolean {
		return this.props.catalogContext.path != null;
	}

	@computed get searchText() {
		const {catalogContext} = this.props;
		return catalogContext ? catalogContext.searchText : null;
	}

	set searchText(text: string) {
		runInAction(() => this.props.catalogContext.searchText = text );
	}

	availableTags = (tags, objectTypes: string[], isTable) => {
		let excludeTags = ["_id", "userTagValues"];
		let allowedTags = [];

		// The input tags is the list of all tags/keys in the schema, but we can/should only show the tags actually requested
		// and those are specified in the object type fragments.
		objectTypes.forEach(ot => {
			let fragment = fragments[ot.toLowerCase()];
			fragment && fragment.definitions.forEach(d => {
				d.selectionSet.selections.forEach(s => {
					if (s.kind == "Field")
						allowedTags.push(s.name.value);
				})
			})
		})

		!isTable && excludeTags.push(SortableCardsPanel.NAME_FIELD);
		return tags.filter(t => t && !_.includes(excludeTags, t.name) && _.includes(allowedTags, t.name));
	}

	@computed get sortableTags() {
		const {objectTypes, distinctTagValues} = this.props.catalogContext;

		let rtnTags: OmdbTag[] = [];
		objectTypes.forEach(ot => {
			if (!ot.ui) {
				return;
			}
			let omdbCardTags: OmdbCardTag[] = _.flatten(ot.ui.card.sections.map(s => s.tags));
			let nameTag = _.find(ot.tags, t=> t.name == "name");
			if (nameTag) {
				rtnTags.push(nameTag);
			}

			omdbCardTags.forEach(oct => {
				if (oct.hide) {
					return;
				}
				if (oct.reserved !== false) {
					let tag = _.find(ot.tags, t=> !t._id && t.name == oct.name);
					if (tag && tag.canSort !== false && tag.type != "ConningUser") {
						rtnTags.push(tag);
					}
				} else {
					let tag = _.find(ot.userTags, t=> t._id == oct._id);
					if (tag && tag.canSort !== false) {
						rtnTags.push(tag as OmdbTag);
					}
				}
			})
		})

		return _.unionBy(rtnTags, tag => tag.name);
	}

	render() {
		let {
			    renderToolbar, selectedItems, detailsLabel, showLabel, searchText,
			    props: {hideSidebar, renderCard, catalogContext, renderEmptyPanel, hideToolbar, className, loadingMessage, view, selectable, onSelect, onContextMenu, tags}, cards
		    } = this;

		const touch = selectedItems.size; // To force rerender of toolbars after selection
		const allTags = tags ? tags : catalogContext ? _.uniqWith(_.flatten(catalogContext.objectTypes.map((ot) => ot.tags)), (a, b) => a.name == b.name): null;

		//console.log(cards);

		if (!cards && catalogContext) {
			cards = catalogContext.pageResults;
		}

		var detailsContent = <div className={css.rightSplitPanel}>
			<LoadingUntil className='is-running-query' loaded={this.props.loaded != false}
			              message={i18n.intl.formatMessage({defaultMessage: "Fetching data...", description: "[SortableCardsPanel] notification message - waiting data came from backend"})}>
				<DndProvider backend={HTML5Backend}>
					{catalogContext && <div className={classNames(css.catalogLoadingOverlay, {[css.loading]: catalogContext.isRunningQuery})} />}
					{catalogContext && catalogContext.error
					? <ErrorMessage error={catalogContext.error}/>
					: view == 'card'
					? this._renderCardView()
					:
						<SmartTable_Blueprint panel={this} searchText={searchText}
						{...this.props}
						availableTags={this.availableTags(allTags, catalogContext.objectTypes.map(ot => ot.id), true)}
						/>
					}
				</DndProvider>
			</LoadingUntil>

			{catalogContext && <PaginationFooter showPageCount={view == 'card'} panel={this}/>}
		</div>;

		var minimizeSplit = !settings.catalog.sidebar || !catalogContext /*|| catalogContext.noDistinctValues*/ || hideSidebar;

		return (
			<GridPanel className={classNames(className, css.root, view, {[css.selectable]: selectable || onSelect != null})}
			           loaded={true}
			           onContextMenu={onContextMenu}
			           loadingMessage={loadingMessage}>
				{this.renderHotkeys}

				{!hideToolbar && renderToolbar()}

				{catalogContext ? <div className={css.sidebarAndPanel}>
					 <LoadingUntil className={css.rightSplitPanel}
					                     loaded={(!catalogContext || catalogContext.hasRunInitialQuery)}
					                     message={i18n.intl.formatMessage({defaultMessage: "Loading catalog...", description: "[SortableCardsPanel] notification message - waiting page ready"})}>
						<AutoSizer>
							{({width, height}) => <div key="dynamic-panel" style={{width, height}}>
								<Observer>
									{() => <Splitter
										className={classNames(css.splitter, {'hide-splitter': minimizeSplit})}
										key="splitter"
										position="vertical"
										ref={s => this.splitter = s}
										primaryPaneMaxWidth="50%"
										primaryPaneMinWidth="250px"
										primaryPaneWidth={settings.catalog.splitLocation}
										dispatchResize={true}
										minimalizedPrimaryPane={minimizeSplit}
										onDragFinished={(e) => {
											settings.catalog.splitLocation = Math.max(0, this.splitter.state.primaryPane);
										}}
										postPoned={false}>

										<ObjectCatalogSidebar context={this.props.catalogContext} panel={this} ref={r => this.catalogSidebar = r}/>

										{detailsContent}
									</Splitter>}
								</Observer>
							</div>}
						</AutoSizer>
					</LoadingUntil>
				</div> : detailsContent}
			</GridPanel>
		);
	}

	renderToolbar = () => {
		const {props: {cards, filters, catalogContext, toolbarChildrenLeft, toolbarChildrenRight, view, fullTextSearch, tableColumns, onSetView, showUserFilter}, sortBy, sortOrder, sorted, sortedAndFiltered, activeFilters, sortableTags} = this;
		const icons = appIcons.widgets.sortableCardsPanel;
		const {catalog: {sidebar}} = settings;

		return (
			<nav className={classNames(css.navbar, 'wrap', bp.Classes.NAVBAR)}>
				{toolbarChildrenLeft && toolbarChildrenLeft(this)}

				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_LEFT)}>
					<Tooltip content={i18n.intl.formatMessage({defaultMessage: "Toggle Filter Sidebar", description: "[SortableCardsPanel] toggle button text - show/hide the sidebar"})}>
						<bp.Button icon='filter' active={sidebar} onClick={() => settings.catalog.sidebar = !sidebar}/>
					</Tooltip>

					<bp.Button icon={"folder-close"} text={i18n.intl.formatMessage({defaultMessage: "Hierarchical View", description: "[SortableCardsPanel] button to toggle hierarchical view which nests folders into an hierarchical folder structure"})} active={this.isHierarchicalViewActive} onClick={() => catalogContext.enableFolder(catalogContext.path == null)}/>

					{onSetView && <>
						<NavbarDivider/>
						<div className={bp.Classes.BUTTON_GROUP}>
							<bp.Button icon={icons.cardView.name as IconName} text={i18n.common.WORDS.BROWSER_CARDS_VIEW} active={view == 'card'} onClick={() => onSetView('card')}/>
							<bp.Button icon={icons.tableView.name as IconName} text={i18n.common.WORDS.BROWSER_TABLE_VIEW} active={view == 'table'} onClick={() => onSetView('table')}/>
						</div>
					</>}

					{showUserFilter &&
					(<div>
						<div className={bp.Classes.NAVBAR_DIVIDER}/>

						<div className={bp.Classes.BUTTON_GROUP}>
							<IconButton icon={icons.me}
							            text={i18n.intl.formatMessage({defaultMessage: "Me", description: "[SortableCardsPanel] navbar filter - the objects related with me"})}
							            active={catalogContext.userFilter} disabled={!catalogContext.canFilterByMe} onClick={() => catalogContext.filterByUser(true)}/>
							<IconButton icon={icons.everyone}
							            text={i18n.intl.formatMessage({defaultMessage: "Everyone", description: "[SortableCardsPanel] navbar filter - cancel the filter related with me"})}
							            active={!catalogContext.userFilter} onClick={() => catalogContext.filterByUser(false)}/>
						</div>

					</div>).props.children}

					<div className={bp.Classes.NAVBAR_DIVIDER}/>

					{/* Custom filters */}

					{filters && <>
						{/*<span className={bp.Classes.NAVBAR_HEADING}>Filters:</span>*/}
						<div className={bp.Classes.BUTTON_GROUP}>
							{filters.filter(f => !f.type || f.type == 'radio').map(
								(f) =>
									<bp.Button key={f.key}
									           icon={f.icon}
									           text={f.text}
									           active={activeFilters.has(f.key)}
									           onClick={() => {
										           if (activeFilters.has(f.key)) {
											           activeFilters.delete(f.key);
										           }
										           else {
											           // Remove any other radio filters
											           activeFilters.forEach(v => {
												           if (v.type == 'radio' || !v.type) {
													           activeFilters.delete(v.key);
												           }
											           })

											           activeFilters.set(f.key, f);
										           }
									           }}/>
							)}
						</div>

						{filters.filter(f => f.type == 'checkbox').map(
							f =>
								<bp.Checkbox checked={activeFilters.has(f.key)}
								             key={f.key}
								             label={f.text}
								             onChange={() => {
									             if (activeFilters.has(f.key)) {
										             activeFilters.delete(f.key);
									             }
									             else {
										             activeFilters.set(f.key, f);
									             }
								             }}/>
						)}
					</>}
				</div>

				<div className={classNames(bp.Classes.NAVBAR_GROUP, bp.Classes.ALIGN_RIGHT)}>
					{(view == 'card' && sortableTags.length > 0) && <div className={bp.Classes.BUTTON_GROUP}>
						{sortableTags.map(f => {
							const {label, name} = f;
							let text = null;
							if (!f._id) {
								text = utility.formatLabelText(_.first(f.name.split('.')));
								text = _.get(i18n.databaseLookups.tags,[text], text);
							} else {
								text = f.name;
							}
							return <bp.Button
								key={name}
								text={text}
								active={sortBy == name}
								rightIcon={sortBy != name ? 'double-caret-vertical' : sortOrder == 'asc' ? 'caret-up' : 'caret-down'}
								onClick={() => this.onSortClick(f as OmdbTag)}/>
						})}
					</div>}


					{fullTextSearch && <div className={bp.Classes.NAVBAR_DIVIDER}/>}

					{fullTextSearch && catalogContext && <ObjectCatalogSearcher catalogContext={catalogContext}/>}
				</div>

				{toolbarChildrenRight && toolbarChildrenRight(this)}
			</nav>)
	}

	@observable showLabel = false;

	renderCard = (card: any, key: string, style: React.CSSProperties) => {
		const {props: {renderCard, catalogContext, showObjectToolbar}} = this;

		if (!key) {
			key = card._id;
		}

		return <ErrorBoundary key={key}>
			<ObjectTypeQuery key={key} query={omdb.graph.objectType} variables={{objectType: card.__typename}}>
				{({loading, error, data}) => {
					if (loading || error) {
						return null
					}

					const {omdb: {objectType: {ui, tags}}} = data;

					return <Observer>
						{() => {

							const cardProps = {
								key:           key,
								style:         style,
								panel:         this,
								availableTags: this.availableTags(tags, [card.__typename], false),
								onDelete:      catalogContext.delete,
								onDuplicate:   catalogContext.insert,
								showToolbar:   showObjectToolbar,
								enabledDnD:    true,
								className:     classNames({[css.backgroundHighlight]: catalogContext?.highlightItem == card._id})
							}

							let returnCard;
							if (card.__typename == "HierarchyGroup") {
								returnCard = <FolderCard folder={card} {...cardProps}/>
							}
							else if (renderCard) {
								returnCard = renderCard(card, this, key, style);
							}
							else if (card instanceof Simulation) {
								returnCard = <SimulationCard sim={card} {...cardProps} />
							}
							else if (card instanceof IO) {
								returnCard = <IOCard investmentOptimization={card} {...cardProps}/>
							}
							else if (card instanceof UserFile) {
								returnCard = <UserFileCard userFile={card} {...cardProps}/>
							}
							else if (card instanceof ClimateRiskAnalysis) {
								returnCard = <ClimateRiskAnalysisCard climateRiskAnalysis={card} {...cardProps}/>
							}
							else if (card instanceof api.Query || card instanceof api.QueryDescriptor) {
								returnCard = <QueryCard query={card} {...cardProps}/>
							}
							else {
								returnCard = <SmartCard {...cardProps}
												  model={card}
								                  title={{value: `${card.__typename}:${card.name ? card.name : card._id}`}}
								                  appIcon={{type: "blueprint", name: "blank"}}
								                  sections={[
									                  {
										                  tags: [
											                  card.__typename && {name: 'Typename', label: 'Object Type'},
											                  // Todo ->
										                  ]
									                  },
									                  ...(ui && ui.card ? ui.card.sections : {tags: tags})
								                  ]}/>

								//return <div key={key}>No default card specified nor renderCard prop supplied for ${typeof card} {JSON.stringify(card)}</div>
							}
							return <>{returnCard}</>
						}}
					</Observer>
				}}
			</ObjectTypeQuery>
		</ErrorBoundary>
	}

	private _renderCardView = () => {
		const {
			      sortedAndFiltered, renderCard,
			      props: {catalogContext}
		      } = this;

		const pageResults = !catalogContext ? sortedAndFiltered : catalogContext.isRunningQuery ? catalogContext.previousPageResults : catalogContext.pageResults;

		return (
			<Card className={classNames("fluid", css.cards)}
			     onClick={this.cardPanel_onClick}>
				<div className={css.cardContainer}>
					<FlipMove disableAllAnimations enterAnimation="fade" leaveAnimation="fade" className="ui cards fluid">
						{pageResults &&
						pageResults.map((c, i) => c ? renderCard(c, c.id ? c.id : c._id ? c._id : `${typeof(c)}_${i}`, {}) : null)}
						{_.isEmpty(pageResults) && this.renderEmptyPanel()}
					</FlipMove>
				</div>
			</Card>)

		//
		// <div className={classNames("pt-card fluid", css.cards)} onClick={this.cardPanel_onClick}>
		// 	<sem.Card.Group className={classNames("fluid")}
		// 	                as={ReactFlipMove}>
		// 		{sortedAndFiltered.map(c => renderCard(c, this))}
		//
		// 		<ItemsFilteredCard key='filtered items' panel={this}/>
		// 		{/*{!_.isEmpty(cards) && _.isEmpty(sorted) && <SmartCard panel={this} title='No search results found'/>}*/}
		// 		{/*{cards && cards.length == 0 && <SortableCard panel={this} fields={[{isTitle: true, value: `Nothing to Display`}]}/> }*/}
		// 	</sem.Card.Group>
		// </div>)
	}

	@computed get detailsLabel() {
		const {catalogContext} = this.props;

		if (!catalogContext) {
			return null;
		}

		const {hasRunInitialQuery, queryResults, lastQueryResult, pagedIndex, pageResults, view, tableViewRange} = catalogContext;
		if (lastQueryResult) {
			const {skipped, total, results} = lastQueryResult;
			if (pageResults.length == 0 || (view == 'table' && tableViewRange == null)) {
				return null;
			}

			let startIdx: number, endIdx: number;

			if (view == 'card') {
				startIdx = pagedIndex + 1;
				endIdx = pagedIndex + pageResults.length;
			}
			else {
				startIdx = tableViewRange.rowIndexStart + 1;
				endIdx = tableViewRange.rowIndexEnd + 1;
			}

			return i18n.intl.formatMessage(
				{defaultMessage: `Items {start} to {end} of {total}`, description: "[SortableCardsPanel] the paginate information details"},
				{
					start: startIdx.toLocaleString(),
					end: endIdx.toLocaleString(),
					total: total.toLocaleString()
				}
			)
		}
		else {
			return i18n.common.MESSAGE.LOADING;
		}
	}

	@observable hasProcessedQueryParams = false;

	@observable processedDefaultSelect = false;

	get sortBy() {
		const {catalogContext} = this.props;
		return catalogContext ? catalogContext.sortBy : null;
	}

	set sortBy(value) {
		this.props.catalogContext.sortBy = value;
	}

	get sortOrder() {
		const {catalogContext} = this.props;
		return catalogContext ? catalogContext.sortOrder : null;
	}

	set sortOrder(value) {
		if (_.isArray(value)) {
			debugger;
		}
		this.props.catalogContext.sortOrder = value;
	}

	highlightItemMessageSent;

	componentDidUpdate() {
		const {defaultSelect, processedDefaultSelect, props: {cards}} = this;
		if (cards instanceof Array && defaultSelect && !processedDefaultSelect) {
			const item = cards.filter((c) => c.id == defaultSelect);
			if (item) {
				this.selectedItems.set(defaultSelect, item);
				this.sortBy = "modifiedTime"
				this.processedDefaultSelect = true;
			}
		}

		const catalogContext = this.props.catalogContext;
		if (
			catalogContext.highlightItem &&
			catalogContext.highlightItem != this.highlightItemMessageSent &&
			$(`.${css.backgroundHighlight}`).length)
		{

			catalogContext.queryResults.forEach(item => {
				if (item._id == catalogContext.highlightItem) {
					site.toaster.show({
						intent:  bp.Intent.SUCCESS,
						timeout: 10 * 1000,
						message: <div><b>{item.name}</b> created.</div>,
						action:  {
							text: "View",
							onClick: () => {
								switch (item.__typename) {
									case Simulation.ObjectType:
										routing.push(`${Simulation.urlFor(item._id)}?edit&page=1`);
										break;
									case api.Query.ObjectType:
										routing.routeFor.query(item._id);
										break;
									case IO.ObjectType:
										routing.push(IO.urlFor(item._id));
										break;
									case ClimateRiskAnalysis.ObjectType:
										routing.push(ClimateRiskAnalysis.urlFor(item._id));
										break;
									case UserFile.ObjectType:
										routing.push(UserFile.urlFor(item._id));
										break;
								}
							}
						}
					});
					this.highlightItemMessageSent = item._id;
				}
			});

			setTimeout(() => {
				this.highlightItemMessageSent = "";
				catalogContext.highlightItem = "";
				$(`.${css.backgroundHighlight}`).removeClass(css.backgroundHighlight); //for remove table highlight status.
			}, 3000);
		}
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());

		// Bug in Splitter library that adds resize listener but doesn't remove it on unmount
		// https://github.com/martinnov92/React-Splitters/issues/9
		if (this.splitter) {
			window.removeEventListener('resize', this.splitter.getSize);
			document.removeEventListener('mouseup', this.splitter.handleMouseUp);
			document.removeEventListener('touchend', this.splitter.handleMouseUp);
			document.removeEventListener('mousemove', this.splitter.handleMouseMove);
			document.removeEventListener('touchmove', this.splitter.handleMouseMove);
		}
	}

	_toDispose = [];

	urlFor = (overrides?: any) => {
		const {activeFilters, defaultSelect, props: {queryParams, catalogContext: {userFilter, unfilteredSelectedTagValues, selectedTagValuesObject, distinctTagValues, searchText, sortBy, sortOrder, itemsPerPage, page, path}}} = this;

		let url = `${window.location.pathname}?`;

		let newQueryParams: any = {
			searchText, sortBy, sortOrder, page, itemsPerPage, path,
			filter:        activeFilters.size > 0 ? `filter=${Array.from(activeFilters.keys()).sort().join(',')}` : null,
			defaultSelect: defaultSelect
		}

		if (distinctTagValues.size != 0) {
			// Append any category selections
			const allSelectedTagValues = _.merge({}, unfilteredSelectedTagValues, selectedTagValuesObject);
			for (var tag of _.keys(allSelectedTagValues).sort()) {
				var value: any = allSelectedTagValues[tag];
				if (_.isArray(value)) {
					value = _.filter(value, v => v != null && v !== '');
					if (value?.length) {
						newQueryParams[tag] = _.join(value, ',');
					}
				} else if (_.isString(value)) {
					newQueryParams[tag] = value;
				} else if (value != null) {
					newQueryParams[tag] = JSON.stringify(value);
				}
			}
		}

		Object.assign(newQueryParams, overrides);

		return `${window.location.pathname}?` + _.keys(newQueryParams)
			.filter(k => newQueryParams[k] != null)
			.map(k => `${encodeURI(k)}=${encodeURIComponent(newQueryParams[k])}`)
			.join('&');
	}

	@action updateQueryParams = () => {
		if (this.props.updateUrl === false) {
			return;
		}
		// Update the query string to reflect current state
		var url = this.urlFor();

		if (url && !window.location.href.endsWith(url)) {
			//routing.replace(url);
			routing.push(url);
		}
	}

	lastQueryParams = {};
	@action updateFromQueryParams = () => {
		const {queryParams, filters} = this.props;
		const {filter, sortBy, sortOrder, userFilter, defaultSelect, searchText, itemsPerPage, page, path} = queryParams;
		if (filter) {
			filter.split(',').forEach(f => this.activeFilters.set(f, filters.find(filter => filter.key == f)));
		}

		const {catalogContext} = this.props;

		catalogContext.sortOrder = sortOrder ? sortOrder : this.sortOrder;
		catalogContext.sortBy = sortBy ? sortBy : this.sortBy;
		catalogContext.searchText = searchText ? searchText : this.searchText;
		catalogContext.path = path;
		if (itemsPerPage) {
			catalogContext.itemsPerPage = parseInt(itemsPerPage);
		}

		if (page != null) {
			catalogContext.page = parseInt(page);
		}

		this.updateSelectedTagsFromQueryParams();

		this.defaultSelect = defaultSelect ? defaultSelect : this.defaultSelect;
	}

	@action updateSelectedTagsFromQueryParams = () => {
		const {queryParams, catalogContext, catalogContext: {distinctTagValues}} = this.props;

		var selectedTagValues = {};

		const parseQueryParam = (param) => {
			try {
				return JSON.parse(param);
			}
			catch(e) {
				return param;
			}
		}

		for (var k of _.keys(queryParams)) {
			if (!_.isEmpty(k) && k != 'filter' && k != 'searchText' && k != 'sortBy' && k != 'sortOrder' && k != 'userFilter' && k != 'defaultSelect' && k != 'itemsPerPage' && k != 'page' && k != 'path') {
				if ((k.startsWith('_') && k.endsWith('_'))) {
					selectedTagValues[k] = parseQueryParam(queryParams[k]);
					continue;
				}

				// Extra query parameters, ie the where clause
				selectedTagValues[k] = queryParams[k].split(',').map(parseQueryParam);

				//queryParams[k].split(',').forEach(v => selectedTagValues[k] = v);
				//
				//
				// selectedTagValues1.set(k, )
				// var selected
				// for (var distinct of allFields.filter(f => f.tagName == k)) {
				// 	var checkedValues = queryParams[k].split(',');
				//
				// 	if (!distinct) {
				// 		console.error(`Unknown query parameter '${k}' in card panel - values are: ${JSON.stringify(checkedValues)}`);
				// 	}
				// 	else {
				// 		var lookup = _.keyBy(checkedValues);
				//
				// 		distinct.distinct.forEach(v => v.checked = lookup[v.value] != null)
				// 	}
				// }
			}
		}
		catalogContext.selectedTagValues.replace(selectedTagValues)

		if (queryParams) {
			if (queryParams.itemsPerPage) {
				catalogContext.itemsPerPage = parseInt(queryParams.itemsPerPage);
			}

			if (queryParams.page != null) {
				catalogContext.page = parseInt(queryParams.page);
			}
		}


		if (distinctTagValues && distinctTagValues.size > 0) {
			// Uncheck all distinct values

			/*var allFields: Array<DistinctTagValue> = _.flatMap(Array.from(distinctTagValues.values()), v => Array.from(v.values()));

			allFields.forEach(v => v.distinct.forEach(v => v.checked = false));
			for (var k of _.keys(queryParams)) {
				if (!_.isEmpty(k) && k != 'filter' && k != 'searchText' && k != 'sortBy' && k != 'sortOrder' && k != 'userFilter' && k != 'defaultSelect' && k != 'itemsPerPage' && k != 'page') {
					// Extra query parameters

					for (var distinct of allFields.filter(f => f.tagName == k)) {
						var checkedValues = queryParams[k].split(',');

						if (!distinct) {
							console.error(`Unknown query parameter '${k}' in card panel - values are: ${JSON.stringify(checkedValues)}`);
						}
						else {
							var lookup = _.keyBy(checkedValues);

							distinct.distinct.forEach(v => v.checked = lookup[v.value] != null)
						}
					}
				}
			}
*/
			if (queryParams) {
				if (queryParams.itemsPerPage) {
					catalogContext.itemsPerPage = parseInt(queryParams.itemsPerPage);
				}

				if (queryParams.page != null) {
					catalogContext.page = parseInt(queryParams.page);
				}
			}

			//catalogContext.initialized = true;
		}
	}

	renderEmptyPanel = () => {
		let {renderEmptyPanel, createItemLink} = this.props;
		if (renderEmptyPanel) { return this.props.renderEmptyPanel()}

		return <sem.Message className={css.noCards} warning>
			<sem.Message.Header><FormattedMessage defaultMessage="Your search returned no results." description="[SortableCardsPanel] Text to indicate that there are no search results"/></sem.Message.Header>
			{/*<sem.Message.Content>
				<sem.Message.List>
					{createItemLink && <sem.Message.Item>
						{createItemLink}
					</sem.Message.Item>}
				</sem.Message.List>
			</sem.Message.Content>*/}
		</sem.Message>
	}

	@observable defaultSelect = null;

	@computed
	get cards() {
		const {props: {cards, catalogContext}} = this;
		return cards ? cards : catalogContext.queryResults;
		//return userFilter && cards instanceof Array ? cards.filter((c) => user.profile.user_id == c["createdBy"]) : cards;
	}

	@computed
	get sorted(): any[] {
		const {cards, props: {catalogContext, view}, sortBy, sortOrder } = this;

		if (cards instanceof Array) {
			const order = sortOrder || 'asc';
			let sortedCards = _.orderBy(cards, [sortBy], view == 'card' ? ['desc', order] : [order]);

			return sortedCards.filter(c => c != null);
		}
		else if (catalogContext && catalogContext.pageResults) {
			return catalogContext.pageResults.slice();
		}

		return [];
	}

	@computed
	get sortedAndFiltered(): any[] {
		return this.filter(this.sorted);
	}

	@computed get tableColumns(): any[] {
		return this.props.tableColumns?.length ? this.props.tableColumns : _.get(this.props.uiDefinition, "table.columns", []);
	}

	filter = (items: any[]) => {
		let {activeFilters, searchText, tableColumns} = this;

		let result = items;

		activeFilters.forEach(f => {
			if (f && f.applyFilter) {
				result = f.applyFilter(result);
			}
		});

		if (searchText && searchText.length > 0) {
			tableColumns = tableColumns.filter(f => f.canSearch != false && !f.hide && f.type != 'date');
			const searchTerms = searchText.split(' ');

			result = result.filter(model => {
				// We must match every search term, but across all searchable fields
				return _.every(searchTerms,
					search => {
						const regexp = new RegExp(api.utility.escapeRegExp(search), "i")
						return _.some(tableColumns, f => {
							let value = f.renderValue ? f.renderValue(model) : null;
							if (!value || typeof value == 'object') {
								value = f.value ? f.value : model ? model[f.name] : null;
							}

							if (value && (isObservableArray(value) || value instanceof Array)) {
								value = value.join(' ')
							}

							if (typeof value == 'number') {
								value = value.toString();
							}

							let result = false;
							if (value != null && typeof value == 'string') {
								result = result || regexp.exec(value) != null;
							}

							return result;
						})
					}
				);
			});
		}

		return result;
	}

	@computed
	get filtered(): any[] {
		let {cards, activeFilters, searchText, props: {catalogContext, filters, tableColumns}} = this;

		let result = [];

		if (cards instanceof Array) {
			result = cards.filter(c => c != null);
			return this.filter(result);
		}
		else if (catalogContext) {
			return catalogContext.pageResults.slice();
		}
	}

	@observable activeFilters = observable.map<string, CardFilter<any>>();

	@action onSortClick = (f: OmdbTag) => {
		const {name, type} = f;
		this.sortOrder = type != 'date' ? (this.sortBy != name ? 'asc' : this.sortOrder == 'asc' ? 'desc' : 'asc')
		                                : (this.sortBy != name ? 'desc' : this.sortOrder == 'desc' ? 'asc' : 'desc');
		this.sortBy = name;
	}

	@computed get renderHotkeys() {
		const {multiselect, selectable, extraHotkeys} = this.props;

		const hotkeys: bp.HotkeyConfig[] = [
			{
				label: "Select All",
				group: "Selection",
				combo: "mod + a",
				disabled: !multiselect,
				global: true,
				preventDefault: true,
				onKeyDown: () => this.selectAll(),
			},
			{
				label: "Clear Selection",
				group: "Selection",
				combo: "esc",
				disabled: !selectable,
				global: true,
				onKeyDown: () => this.selectedItems.clear(),
			},
			{
				label: "Delete Selection",
				group: "Selection",
				combo: "del",
				disabled: !selectable,
				global: true,
				onKeyDown: () => this.deleteSelectedItems(),
			},
			...(extraHotkeys?.length ? extraHotkeys : [])
		];

		return <bp.HotkeysTarget2 hotkeys={hotkeys}>{({ handleKeyDown, handleKeyUp }) => <Fragment />}</bp.HotkeysTarget2>
	}

	@action deleteSelectedItems = async () => {
		const {selectedItems} = this;
		if (await site.confirm(`Are you sure you want to delete ${selectedItems.size == 1 ? 'this item' : `these ${selectedItems.size} items`}?`, 'This action cannot be undone.', <sem.Icon
			name='trash'/>)) {
			selectedItems.forEach(async (value: any, key) => {
				value.delete && (await value.delete(true));
				this.props.catalogContext.delete(value.id);
			})
			selectedItems.clear();
		}
	}
	@action selectAll = () => {
		const {sorted, selectedItems} = this;

		sorted.forEach(item => {
			selectedItems.set(item.id, item)
		});
	}

	@observable selectedItems = observable.map<any>({});

	@action handleSelect = (item: any, e: React.MouseEvent<any>, isContextMenu?: boolean) => {
		const {selectedItems, props: {onSelect, selectable, multiselect}} = this;

		if (selectable || onSelect) {
			const {_id: id} = item;

			if (multiselect && (e.ctrlKey || e.metaKey)) {
				// Add or remove the item clicked
				if (selectedItems.has(id)) {
					selectedItems.delete(id);
				}
				else {
					selectedItems.set(id, item);
				}
			}
			else {
				if (selectedItems.has(id)) {
					if (!isContextMenu) {
						selectedItems.delete(id);
					}
				}
				else {
					selectedItems.clear();
					selectedItems.set(id, item);
				}
			}
		}

		onSelect && onSelect(selectedItems.values());
	}

	cardPanel_onClick = (e) => {
		const $target = $(e.target);

		if ($target.hasClass('cards') || $target.hasClass(bp.Classes.CARD)) {
			this.selectedItems.clear()
		}
	}

	@action card_onClick = (card: SmartCard, e: React.MouseEvent<any>) => {
		const $target = $(e.target);
		if (!$target.is('a,button')
			&& $target.parents('a,button').length == 0) {

			this.handleSelect(card.props.model, e)
		}
	}

	@action card_onContextMenu = (card: SmartCard, e: React.MouseEvent<any>) => {
		this.handleSelect(card.props.model, e, true)
	}

	addToBreadcrumbs(breadcrumbs: Array<any>, catalogContext = this.props.catalogContext) {
		const {path} = catalogContext;
		const pathArray = path.split("/");
		breadcrumbs.push(<bp.Button key={"root"} minimal onClick={() => catalogContext.setPath("")} >Root</bp.Button>);
		pathArray.forEach((folder, i) => {
			const path = pathArray.slice(0, i + 1).join("/");
			breadcrumbs.push(<bp.Button key={`${path}/${folder}`} minimal onClick={() => catalogContext.setPath(path)}>{folder || "Untitled Folder"}</bp.Button>)
		});
	}
}

export interface SmartTableProps extends MyProps<any> {
	searchText?: string;
	panel?: SortableCardsPanel;
	onColumnWidthChanged?: (index: number, width: number) => void;
	availableTags?: Array<IOmdbTag>;
	connectDragSource?: (Element) => React.ReactElement;
	connectDropTarget?: (Element) => React.ReactElement;
	isDropOver?: boolean;
	canDrop?: boolean;
	showFavoriteIcon?: boolean;
}

export class MissingRowCard extends React.Component<{}, {}> {
	render() {
		return <sem.Card as='div'>Missing...</sem.Card>
	}
}

@observer
class PaginationFooter extends React.Component<{
	showPageCount: boolean,
	panel: SortableCardsPanel
}, {}> {
	renderItemsPerPage = (item, {handleClick, modifiers}) => {
		return <a className={classNames(bp.Classes.MENU_ITEM,
			{[bp.Classes.ACTIVE]: modifiers.active}
		)}
		          key={item}
		          onClick={handleClick}>
			{item}
		</a>
	}

	render() {
		const {
			      props: {showPageCount, panel, panel: {detailsLabel, props: {view, catalogContext, catalogContext: {page, isRunningQuery, searchText, pageCount, itemsPerPage, lastQueryResult}}}}
		      } = this;

		const pageResults = catalogContext.isRunningQuery ? catalogContext.previousPageResults : catalogContext.pageResults;

		return <div className={css.paginateNavbar}>
			<div className={classNames(css.statusLabel, bp.Classes.NAVBAR_HEADING)}>
				{detailsLabel}
			</div>

			<div>
				{showPageCount &&
				<>
					<NavbarHeading>
						<FormattedMessage defaultMessage={"Items Per Page:"} description={"[SortableCardsPanel] paginate controls' title"}/>
					</NavbarHeading>
					<ItemsPerPage items={[25, 50, 100, 250]}
					              filterable={false}
					              onItemSelect={item => catalogContext.itemsPerPage = item}
					              itemRenderer={this.renderItemsPerPage}>
						<Button text={itemsPerPage} rightIcon='caret-down'/>
					</ItemsPerPage>

					{pageCount > 1 && <ReactPaginate className={css.reactPaginate}
					                                 containerClassName={classNames('pagination', css.paginate)}
					                                 pageCount={catalogContext.pageCount}
					                                 forcePage={page}
					                                 breakClassName="page-item"
					                                 hrefBuilder={(index) => panel.urlFor({page: index})}
					                                 breakLabel="..."
					                                 pageClassName="page-item"
					                                 previousClassName="page-item"
					                                 nextClassName="page-item"
					                                 pageLinkClassName="page-link"
					                                 previousLinkClassName="page-link"
					                                 nextLinkClassName="page-link"
					                                 activeClassName={"active"}
					                                 onPageChange={({selected}) => {
						                                 catalogContext.page = selected
					                                 }}
					                                 previousLabel={i18n.common.OBJECT_CTRL.PREVIOUS}
					                                 nextLabel={i18n.common.OBJECT_CTRL.NEXT}
					/>}
				</>}

				{view == 'table' && isRunningQuery && <LoadingEllipsis/>}
			</div>
		</div>
	}
}

/* Attempts at infinite loaders...

// 	{false && <InfiniteScroll className="ui cards fluid"
// 				                          pageStart={0}
// 				                          hasMore={catalogContext.hasMore}
// 				                          threshold={600}
// 				                          useWindow={false}
// 				                          initialLoad={false}
// 				                          loadMore={async page => {
// 					                          const {queryResults, pageSize} = catalogContext;
//
// 					                          const skip  = queryResults.length;
// 					                          const limit = page * catalogContext.pageSize - skip;
//
// 					                          console.log(`loadMore(${page}) - pageSize = ${pageSize} - we have ${skip} - { skip: ${skip}, limit: ${limit} }`)
//
// 					                          await catalogContext.runQuery(false, {skip: skip, limit: limit});
// 				                          }}>
//
// 					{/*{sortedAndFiltered.map(c => renderCard(c, this))}*/
// }
// {catalogContext.queryResults.slice().map(c => renderCard(c, this, c.id, {}))}
//
// <ItemsFilteredCard key='filtered items' panel={this}/>
// {/*{!_.isEmpty(cards) && _.isEmpty(sorted) && <SmartCard panel={this} title='No search results found'/>}*/}
// {/*{cards && cards.length == 0 && <SortableCard panel={this} fields={[{isTitle: true, value: `Nothing to Display`}]}/> }*/}
// </InfiniteScroll>}
// {false && <AutoSizer>
// 	{({width, height}) =>
// 		<InfiniteLoader className="ui cards fluid"
// 		                rowCount={catalogContext.lastQueryResult.total}
// 		                isRowLoaded={({index}) => {
// 			                return catalogContext.queryResults.length > index;
// 		                }}
// 		                threshold={catalogContext.pageSize}
// 		                loadMoreRows={async ({startIndex, stopIndex}) => {
// 			                const {queryResults, pageSize} = catalogContext;
//
// 			                // const skip  = queryResults.length;
// 			                // const limit = page * catalogContext.pageSize - skip;
// 			                //
// 			                // console.log(`loadMore(${page}) - pageSize = ${pageSize} - we have ${skip} - { skip: ${skip}, limit: ${limit} }`)
//
// 			                return await catalogContext.runQuery(false, {skip: startIndex, limit: stopIndex - startIndex});
// 		                }}>
// 			{({onRowsRendered, registerChild}) => (
// 				<List
// 					height={height}
// 					onRowsRendered={onRowsRendered}
// 					ref={registerChild}
// 					rowCount={catalogContext.lastQueryResult.total}
// 					rowHeight={({index}) => {
// 						return 355 + 14;
// 					}}
// 					rowRenderer={({index, key, style, isScrolling}) => {
// 						if (index < catalogContext.queryResults.length) {
// 							return renderCard(catalogContext.queryResults[index], this, key, style);
// 						}
// 						else {
// 							return <div key={key}> Loading...</div>
// 						}
// 					}}
// 					width={width}
// 				/>
// 			)}
// 		</InfiniteLoader>
// 	}
// </AutoSizer>}
// {false && <AutoSizer>
// 	{({width, height}) =>
// 		<InfiniteScrollComponent
// 			height={height}
// 			style={{width: width}}
// 			className="ui cards fluid"
// 			onScroll={() => {
// 				this.showLabel = true;
// 				this.debouncedHideLabel();
// 			}}
// 			next={() => {
// 				debugger;
// 				console.log('next()')
// 				return catalogContext.queryResults.slice();
// 			}}
// 			hasMore={catalogContext.hasMore}
// 			loader={<h4>Loading...</h4>}
// 			endMessage={
// 				<p style={{textAlign: 'center'}}>
// 					<b>Yay! You have seen it all</b>
// 				</p>
// 			}>
// 			{catalogContext.queryResults.slice().map(c => renderCard(c, this, c.id, {}))}
// 		</InfiniteScrollComponent>}
// </AutoSizer>}*/

@observer
class SearchText extends React.Component<{catalogContext: ObjectCatalogContext}, {}> {
    constructor(props: {catalogContext: ObjectCatalogContext}) {
        super(props);
        makeObservable(this);
    }

    render() {
		const {catalogContext} = this.props;

		return <sem.Input
			className={classNames(css.fullTextSearch, {error: !catalogContext.isRunningQuery && catalogContext.lastQueryResult && catalogContext.lastQueryResult.results.length == 0})}
			placeholder={i18n.common.MESSAGE.SEARCHING}
			icon={<AppIcon icon={catalogContext.isRunningQuery ? {type: "semantic", name: "spinner"} : appIcons.queryTool.search}
			               className={classNames("iconic-sm", {rotate: catalogContext.isRunningQuery})}/>}
			value={this._searchText}
			onKeyDown={e => {
				if (e.keyCode == KeyCode.Escape) {
					runInAction(() => catalogContext.searchText = '' );
				}
			}}
			onChange={(e: any) => {this._searchText = e.target.value; this.onSearchTextChange(e.target.value)}}
		/>}

    @observable _searchText = this.props.catalogContext.searchText;
    onSearchTextChange = _.debounce(action((search) => {
		this.props.catalogContext.searchText = search;
	}), 500)
}

interface EditableTextProps {
	getValue: () => string;
	defaultValue?: string;
	editable?: boolean;
	isEditing?: boolean;
	setValue?: Function;
}
@observer
export class EditableText extends React.Component<EditableTextProps, {}> {
    @observable isEditing: boolean = !!this.props.isEditing;

    constructor(props: EditableTextProps) {
        super(props);
        makeObservable(this);
    }

    @computed get displayValue(){
		return this.props.getValue() || this.props.defaultValue || "";
	}

    render(){
		const { getValue, editable, setValue } = this.props;

		const value = getValue();

		if ( editable === false || !setValue ) {
			return <span className={css.editableText}>
				<span className={css.editableTextDisplay} title={this.displayValue}>{this.displayValue}</span>
			</span>;
		}

		return this.isEditing !== true ?
		       <span className={css.editableText}>
			       <span className={css.editableTextDisplay} onDoubleClick={() => this.isEditing = true} title={this.displayValue} >{this.displayValue}</span>
			       <bp.Tooltip className={css.editableTextRenameBtn} position={bp.Position.BOTTOM} content='Rename'>
				       <bp.Button icon='edit' onClick={() => { this.isEditing = true; }}/>
			       </bp.Tooltip>
		       </span> :
		       <bp.EditableText className={css.editableTextEditor}
                    isEditing
                    selectAllOnFocus
                    defaultValue={value}
                    onCancel={() => {
                    	this.isEditing = false;
                    }}
                    onConfirm={(newValue) => {
                        if (newValue != value) {
                        	setValue(newValue);
                        }
                        this.isEditing = false;
                    }}
		       />
	}
}