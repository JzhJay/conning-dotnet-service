import {UserTagList} from 'components/system/common/userTag/UserTagList';
import {GenericNameEditor} from 'components/system/ObjectNameChecker/GenericNameEditor';
import {ReportObjectLink} from 'components/system/report/ReportObjectLink';
import {SimulationObjectLink} from 'components/system/simulation/SimulationObjectLink';
import {UserFileObjectLink} from 'components/system/UserFile/UserFileObjectLink';
import {CopyableText} from 'components/widgets/SmartBrowser/CopyableText';
import { DragSource, DropTarget } from 'react-dnd';
import {Column, Cell, ColumnHeaderCell, SelectionModes, IRegion, Regions, RenderMode, Table2} from '@blueprintjs/table';
import {OmdbTableBuilder} from 'components/system/ObjectCatalog/OmdbAdminPage/tabs/UiLayout/TableBuilder';
import {SmartBrowserContextMenu} from 'components/widgets/SmartBrowser/SmartBrowserContextMenu';
import {observer, Observer} from "mobx-react";
import {
    computed,
    action,
    isObservable,
    isObservableArray,
    observable,
    reaction,
    makeObservable,
} from 'mobx';
import * as React from 'react';
import type {IOmdbTag, OmdbUserTag} from 'stores';
import {Simulation, UserFile, Report, site, api, apolloStore, GetUserQuery, omdb, i18n} from 'stores';
import {visibleTagUtil} from 'stores/objectMetadata/VisibleTags';
import {dateToFormattedStringWithTimezone, dateToStringWithTimezone} from 'utility';
import type {SmartTableProps} from 'components';
import {TimeAgo, bp, Highlighter, LoadingIndicator,FavoriteIndicator, SortableCardsPanel} from 'components';
import {utility, Link, settings} from 'stores';
import type {IRowIndices} from '@blueprintjs/table/lib/esm/common/grid';
import {TableLoadingOption} from '@blueprintjs/table/lib/esm/regions';
import {Menu, MenuItem} from '@blueprintjs/core';
import {debounce} from 'lodash';

import * as css from './SmartTable_blueprint.css';
import * as sortableCardsPanelCss from './SortableCardsPanel.css';

export interface DnDCellProps {
	className: string;
	item: any;
	panel: SortableCardsPanel;
	loading: boolean;
	colName: string;
	table: SmartTable_Blueprint;
	isDropOver?: boolean;
	canDrop?: boolean;
	connectDragSource?: (Element) => React.ReactElement;
	connectDropTarget?: (Element) => React.ReactElement;
}

const ROW_HEIGHT = 55;
const dragSource = {
	events: {
		canDrag(props) {
			const { colName, panel, item } = props;
			const isDnDColumn = colName === SortableCardsPanel.NAME_FIELD || colName === SortableCardsPanel.ACTIONS_FIELD;
			const isEditing = item && $(`.bp3-table-cell-row-${props.row} .${sortableCardsPanelCss.editableTextEditor}`).length > 0;
			return item && panel.isHierarchicalViewActive && isDnDColumn && item.__typename !== 'HierarchyGroup' && !isEditing;
		},
		beginDrag(props, monitor, component) {
		    // Return the data describing the dragged item
			return { component };
		},
		endDrag(props, monitor, component) {
			props.table.lastDragCellTime = new Date().getTime();

			if (component.cellRef) {
				const mouseEvent = document.createEvent('MouseEvents');
				mouseEvent.initEvent ('mouseup', true, true);
				component.cellRef.dispatchEvent(mouseEvent);
			}
		}
	},
	connect(connect, monitor) {
		return {
			canDrag: monitor.canDrag(),
			connectDragSource: connect.dragSource()
		}
	}
};

const dropTarget = {
	events: {
		canDrop(props) {
			const { panel, colName, item } = props;
			const isDnDColumn = colName === SortableCardsPanel.NAME_FIELD || colName === SortableCardsPanel.ACTIONS_FIELD;
			return item && panel.isHierarchicalViewActive && isDnDColumn && item.__typename === 'HierarchyGroup';
		},
		drop(props, monitor, component) {
			if (component?.props?.item && monitor.didDrop()) {
			  // If you want, you can check whether some nested
			  // target already handled drop
			  return;
			}

			if (component.props.item.__typename === 'HierarchyGroup') {
				// Obtain the dragged item
				const dragItem = monitor.getItem();
				const folderName = component.props.item.name;
				dragItem.component.dropToFolder(folderName);
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

class DnDCellClass extends React.Component<DnDCellProps, {}> {
    cellRef = null;

	@action dropToFolder = async(folderName) => {
		const { item } = this.props;
		if (!item) {
			return;
		}
		try {
			site.busy = true;
			const newName = `${folderName}/${item.name}`;
			if (item.__typename === 'Simulation') {
				await Simulation.rename(item, newName);
			} else {
				await item.rename(newName);
			}
			await this.refreshCatalogContext();
		} finally {
			site.busy = false;
		}
	}

    refreshCatalogContext = async () => {
		const { panel } = this.props;
		const catalogContext = panel && panel.props.catalogContext;
		if (catalogContext && catalogContext.isHierarchicalViewEnabled) {
			await catalogContext.refresh();
		}
	}

    constructor(props: DnDCellProps) {
        super(props);
        makeObservable(this);
    }

    render() {
		const { children, canDrop, isDropOver, connectDragSource, connectDropTarget, className, ...restProps } = this.props;

		return (
			<Cell className={classNames(className, {[css.showDropHighlight]: canDrop && isDropOver})}
				cellRef={(ref)=> {
					if (ref) {
						connectDragSource(ref);
						connectDropTarget(ref);
						this.cellRef = ref;
					}
				}}
				{...restProps}
			>
				{children}
			</Cell>
		);
	}
}

const DnDCell = _.flow(
	DragSource('SmartTableCell', dragSource.events, dragSource.connect),
	DropTarget('SmartTableCell', dropTarget.events, dropTarget.connect)
)(DnDCellClass);

@observer
export class SmartTable_Blueprint extends React.Component<SmartTableProps, {}> {
	_toDispose = [];
	table: Table2;
	lastDragCellTime: number = null;

	@observable _tableKey = `${new Date().getTime()}_${Math.random()}`;
	@observable autosizing = false;
	@observable autosizeOnRender = true;
	@observable renderCompleted = false;
	@observable _columnWidths = {};

	@observable.ref visibleTags: Map<string, boolean>;

	constructor(props) {
        super(props);

        makeObservable(this);

        // add visibleTags if there has nothing in auth0 data
		this.visibleTags = visibleTagUtil.getVisibleTagsSetting_table(this.props.catalogContext.objectTypes);
    }

	@computed get tableColumns(): any[] {
		return this.props.tableColumns?.length ? this.props.tableColumns : _.get(this.props.uiDefinition, "table.columns", []);
	}

	componentDidMount() {
		this._toDispose.push(
			reaction(() => [
					this.props.catalogContext.isRunningQuery,
					this.props.catalogContext.lastQueryResult?.total
			], (effect) => {
				if (!this.props.catalogContext.isRunningQuery) {
					setTimeout(() => this._autosizeRows(), 0);
				}
			})
		);

		this._toDispose.push(
			reaction(() => this.columns.length, () => {
				this._tableKey = `${new Date().getTime()}_${Math.random()}`;
			})
		);

		const objectType = this.props.objectType;
		if (objectType) {
			const overrideColumnWidth = settings.searchers[objectType]?.columnWidths;
			const columns = this.columns;
			if (overrideColumnWidth && overrideColumnWidth.length && overrideColumnWidth.length == columns.length) {
				columns.forEach((c,i) => {
					const key = c._id || c.name;
					overrideColumnWidth[i] && ( this._columnWidths[key] = overrideColumnWidth[i]);
				})
			}
		}
	}

	componentWillUnmount() {
		this._toDispose.forEach(f => f());
		this._autosizeRows.cancel();
		this._updatePageRange.cancel();
	}

	@computed get userTags() {
		const {objectType} = this.props;
		let returnTags: OmdbUserTag[];
		if (objectType) {
			returnTags = this.props.catalogContext.getObjectType(objectType)?.userTags;
		}
		if (!returnTags || !returnTags.length) {
			returnTags = _.uniqBy(_.flatten(this.props.catalogContext.objectTypes.map(ot => ot.userTags)) , ut => ut._id);
		}
		return returnTags;
	}

	get tags() {
		const {objectType} = this.props;
		let returnTags: OmdbUserTag[];
		if (objectType) {
			returnTags = this.props.catalogContext.getObjectType(objectType)?.tags;
		}
		if (!returnTags || !returnTags.length) {
			returnTags = _.uniqBy(_.flatten(this.props.catalogContext.objectTypes.map(ot => ot.tags)) , ut => ut.name);
		}
		return returnTags;
	}

	@computed get columns() {
		let {props: {uiDefinition, catalogContext, showObjectToolbar}, tags, userTags, tableColumns, visibleTags} = this;

		if (!tableColumns || !tableColumns.length) {
			tableColumns = [...tags, ...userTags];
		}

		// user tag in setting should be exist.
		tableColumns = tableColumns.filter(c => c.reserved !== false || _.some(userTags, userTag => userTag._id == c._id));

		// tags should not be shown.
		tableColumns = tableColumns.filter(c => c.reserved === false || !_.some(OmdbTableBuilder.EXCLUDE_COLUMN, columnName => columnName == c.name));

		if (visibleTags && visibleTags.size) {
			tableColumns = tableColumns.filter(c => {
				if (c.reserved === false) {
					return visibleTags.get(c._id) !== false;
				} else if (_.some(OmdbTableBuilder.CAN_NOT_DELETE_COLUMN, columnName => columnName == c.name)) {
					return true;
				} else {
					return visibleTags.get(c.name) !== false;
				}
			});
		}

		if (!showObjectToolbar) {
			tableColumns = tableColumns.filter(c => !(c.reserved !== false && c.name == SortableCardsPanel.ACTIONS_FIELD));
		}

		return tableColumns.map((tag: IOmdbTag & any, i) => {
			let omdbTag, header, additionalAttrs = {};

			if (tag.reserved === false) {
				omdbTag = _.find(userTags, ut => ut._id == tag._id);
				if( !omdbTag ) { return null; }
				header = omdbTag.name;
				additionalAttrs["name"] = omdbTag.name;
			} else {
				omdbTag = _.find(tags, ut => ut.name == tag.name);
				if ( tag.name == SortableCardsPanel.ACTIONS_FIELD ){
					header = i18n.intl.formatMessage({defaultMessage: "Actions", description: "table header that says indicates that the column represents actions (rename, delete, etc) against an object"});
				} else if( omdbTag ) {
					header = utility.formatLabelText(omdbTag.name);
					header = _.get(i18n.databaseLookups.tags, [header], header);
				} else if (OmdbTableBuilder.CAN_NOT_DELETE_COLUMN.indexOf(tag.name) >= 0) {
					header = utility.formatLabelText(tag.name);
					header = _.get(i18n.databaseLookups.tags, [header], header);
				} else {
					return null;
				}
				if (omdbTag?.type == "ID") {
					additionalAttrs["defaultWidth"] = 195;
				}
			}

			return {
				index:                  i,
				header:                 header,
				minWidth:               120,
				wrapText:               tag.wrapText != false,
				enableColumnReordering: omdbTag && omdbTag.canSort != false && omdbTag.type != "ConningUser" && omdbTag.name != SortableCardsPanel.ACTIONS_FIELD,
				...omdbTag,
				...tag,
				...additionalAttrs
			};
		}).filter((col) => !!col);
	}

	@computed get columnsByName() {
		return _.zipObject(this.columns.map(c => c.name), this.columns);
	}

	@computed get selectedRegions(): IRegion[] {
		const {panel: {selectedItems}, catalogContext: {queryResults}} = this.props;

		const result = [];
		let rowStart = null;
		queryResults.forEach((item, r) => {
			if (item) {
				r = parseInt(r);
				if (selectedItems.has(item["id"])) {
					if (rowStart == null && !isNaN(r)) {
						rowStart = r;
					}
				} else if (rowStart != null && !isNaN(r)) {
					result.push(Regions.row(rowStart, r - 1))
					rowStart = null;
				}
			}
		});
		if (rowStart != null) {
			result.push(Regions.row(rowStart, queryResults.size - 1));
		}
		return result;
	}

	_updatePageRange = debounce((rowIndices: IRowIndices) => {
		const {catalogContext, catalogContext: {tableViewRange: r}} = this.props;
		let newRowIndices = rowIndices;
		try {
			const rect          = this.table.state.viewportRect;
			const rows          = this.table.grid['rowHeights'];
			const ghostHeight   = this.table.grid['ghostHeight'] || 0;

			const displayAreaTop = rect.top + ghostHeight;
			const displayAreaBottom = rect.top + rect.height;

			let heightCounter = ghostHeight, startIndex = null, endIndex = null;

			rows.map( function( currentValue , index ){
				heightCounter += currentValue;
				if ( startIndex !== null && endIndex !== null ) {
					return;
				} else if (startIndex === null && heightCounter >= displayAreaTop) {
					startIndex = index;
				} else if (endIndex === null && heightCounter >= displayAreaBottom ) {
					endIndex = index;
				}
			});

			newRowIndices = {
				rowIndexStart: startIndex,
				rowIndexEnd:  endIndex !== null ? endIndex : (rows.length - 1)
			}
		} catch(e) {
			// nothing to do.  This can get called with the wrong `this` object.
		}

		if (!r || r.rowIndexStart != newRowIndices.rowIndexStart || r.rowIndexEnd != newRowIndices.rowIndexEnd) {
			setTimeout(action(() => catalogContext.tableViewRange = newRowIndices), 10);
		}
	}, 50)

	@computed get columnWidths() {
		let columnWidths = this.columns.map((c,i) => {
			const key = c._id || c.name;
			return this._columnWidths[key] || c.defaultWidth || OmdbTableBuilder.DEFAULT_COL_WIDTH;
		})
		return columnWidths;
	}

	@action autosizeRows = () => {
		if (this.table && !this.autosizing) {
			this.autosizing = true;
			this.table.resizeRowsByApproximateHeight((r, c) => {
				let cellText = this.getCellText(r, c);
				if (cellText && this.columns[c].name == 'comments') {
					cellText = cellText.replace(/[^\n]*/g, "x").replace(/x{1,}/g, "x");
				}
				return cellText;
			}, {
				getApproximateLineHeight: (r) => this.props.catalogContext.queryResults.get(`${r}`) ? 18 : ROW_HEIGHT-1,
				getApproximateCharWidth:(r, c) => this.columns[c].name == 'comments' ? (this.columnWidths[c]/2) : 7.6,
				getCellHorizontalPadding: 16,
				getNumBufferLines: 1});
			this.autosizing = false;
		}
	}

	get numFrozenColumns() {
		let frozenCol = _.get(this.props.uiDefinition, 'table.frozenColumns', 0);
		if (!frozenCol) {
			return 0;
		}
		let propsCol = this.tableColumns.slice(0, frozenCol);
		let displayCol = this.columns.slice(0, frozenCol);
		frozenCol = 0;
		propsCol.forEach( pc => {
			if(_.some(displayCol, dc => {
				if ((!pc._id) != (!dc._id)) {
					return false;
				} else if ( pc._id ) {
					return  pc._id == dc._id;
				} else {
					return  pc.name == dc.name;
				}
			})){
				frozenCol++;
			}
		})
		return frozenCol;
	}

	_autosizeRows = _.debounce(action(() => {
		this.autosizeRows();

		// Workaround a bug in blueprint where table doesn't fully render when switching between cards/table
		let frozenCol = this.numFrozenColumns;

		if (this.table.grid?.numCols > frozenCol) {
			this.table.scrollToRegion({cols: [frozenCol + 1, frozenCol + 1]});
			this.table.scrollToRegion({cols: [0, 0]});
		}

		this.autosizeOnRender = false;
	}), 30, {leading: true, trailing: true});

	setOverrideColumnWidths = (index, size) => {
		const column = this.columns[index];
		const key = column._id || column.name;
		this._columnWidths[key] = size;
		this._autosizeRows();

		const columnWidths = this.columns.map((c) => {
			const k = c._id || c.name;
			return this._columnWidths[k] || null;
		});
		const {objectType} = this.props;
		if (objectType) {
			var searchSettings = settings.searchers[objectType];
			if (searchSettings) {
				searchSettings.columnWidths = columnWidths;
			}
		}
	}

	highlightResult = (v:string) => {
		const searchText = this.props.catalogContext.searchText;
		return <Highlighter searchWords={searchText ? searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []} textToHighlight={v}/>;
	}

	render() {
		const {_columnWidths, columnWidths, columns, renderCompleted ,highlightResult, getCellText, autosizeOnRender, selectedRegions} = this;
		const {uiDefinition, panel, searchText, multiselect, catalogContext, showFavoriteIcon } = this.props;
		const {lastQueryResult, queryResults} = catalogContext;
		const {sortBy, sortOrder, selectedItems} = panel;

		var loadingOptions = [];
		if (this.autosizing) {
			loadingOptions.push(TableLoadingOption.CELLS);
		}

		// if (catalogContext.runningQuery || !catalogContext.hasRunInitialQuery) {
		// 	loadingOptions.push(TableLoadingOption.CELLS);
		// }



		return (<div className={classNames(css.root)}>
			{/*<Query query={gql`*/}
			{/*query tableColumns($objectTypes: [String!]!) {*/}
			{/*omdb {*/}
			{/*objectTypes(ids: $objectTypes) {*/}
			{/*id*/}
			{/*ui {*/}
			{/*table {*/}
			{/*frozenColumns,*/}
			{/*columns*/}
			{/*}*/}
			{/*}*/}
			{/*}*/}
			{/*}*/}
			{/*}`} variables={{objectTypes: _.uniq(Array.from(catalogContext.queryResults.values()).map(qr => qr.__typename))}}>*/}
			{/*{({loading, data}) => <Observer>{() => {*/}
			{/*if (loading) { return <LoadingIndicator/> }*/}
			{/*else {*/}
			{/*let {getCellText, autosizeOnRender, columnWidths, columnsModified, selectedRegions, columns, props: {itemTypeName, tableUiDefinition, panel, searchText, catalogContext: {lastQueryResult, queryResults}}} = this;*/}
			{/*const {sortBy, sortOrder, selectedItems} = panel;*/}
			{/*const {omdb: {objectTypes}} = data;*/}

			{/*// objectTypes.forEach(ot => {*/}
			{/*// 	const {id, ui: {table: {frozenColumns, columns}}} = ot;*/}
			{/*// 	console.log(id, frozenColumns, columns);*/}
			{/*// })*/}

			{/*var maxFrozenColumns = _.maxBy(objectTypes, (ot: any) => ot.ui.table.frozenColumns);*/}

			{/*renderMode={RenderMode.NONE}*/}

			<LoadingIndicator active={!this.renderCompleted}>
				Loading Table
			</LoadingIndicator>
			<Table2 key={this._tableKey} numRows={lastQueryResult ? lastQueryResult.total : 0}
			       className={classNames(css.table, {[css.loading]:!this.renderCompleted})}
			       numFrozenColumns={this.numFrozenColumns}
			       columnWidths={columnWidths}
			       ref={r => {
				        // ref sometimes gets cleared while rendering causing onCompleteRender()
				        r  && (this.table = r);
			       }}
			       onColumnWidthChanged={this.setOverrideColumnWidths}
			       onCompleteRender={() => {
				       const {table} = this;
				       if (table && autosizeOnRender) {
					       const {state: {viewportRect}} = table;
					       if ((viewportRect.width > 0 && viewportRect.height > 0) || document.hidden) {
						       setTimeout(action(() => {
								   this._autosizeRows();
								   this.renderCompleted = true
						       }), 5);
					       }
				       }
			       }}
			       onColumnsReordered={(oldIndex, newIndex, length) => {
				       uiDefinition?.table && uiDefinition.table.columns.move(oldIndex, newIndex);
			       }}
			       loadingOptions={loadingOptions}
			       selectionModes={SelectionModes.ROWS_AND_CELLS}
			       selectedRegions={selectedRegions}
			       onSelection={this.onSelection}
			       renderMode={RenderMode.NONE}
			       enableRowHeader={false}
			       defaultRowHeight={ROW_HEIGHT}
			       enableMultipleSelection={multiselect ? multiselect : false}
			       onVisibleCellsChange={(rowIndices, colIndices) => {
				       this._updatePageRange(rowIndices);
			       }}
			       bodyContextMenuRenderer={this.renderBodyContextMenu}
			>
				{columns.map(
					(col, cIndex) => {
						const allowSorting = col.enableColumnReordering;

						return <Column key={cIndex.toString()}
						               {...col}
						               columnHeaderCellRenderer={(c) =>
							               <ColumnHeaderCell index={c}
							                                 className={classNames(col.align, {[css.sortable]: allowSorting})}
							                                 name={col.header}
							                                 nameRenderer={(headerText, index) =>
								                                 <Observer>{() => <div key={index.toString()}
								                                                       className={css.columnCell}
								                                                       onClick={allowSorting ? action(() => {
									                                                       panel.sortBy = col.name;
									                                                       panel.sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
								                                                       }) : undefined}>
									                                 {headerText}
									                                 {sortBy != col.name
									                                  ? null
									                                  : <span className={`wj-glyph-${sortOrder == 'asc' ? 'up' : 'down'}`}/>}
								                                 </div>}
								                                 </Observer>}
							                                 menuRenderer={(index) => <Observer>{() => allowSorting ? <Menu>
								                                 <MenuItem icon="sort-asc"
								                                           className={classNames({[bp.Classes.ACTIVE]: panel.sortBy == col.name && panel.sortOrder == 'asc'})}
								                                           onClick={() => {
									                                           catalogContext.sort(col.name, 'asc');
								                                           }} text="Sort Ascending"/>
								                                 <MenuItem icon="sort-desc"
								                                           className={classNames({[bp.Classes.ACTIVE]: panel.sortBy == col.name && panel.sortOrder == 'desc'})}
								                                           onClick={() => {
									                                           catalogContext.sort(col.name, 'desc');
								                                           }}
								                                           text="Sort Descending"/>
							                                 </Menu>: <div/> }</Observer> }
							               />}

						               cellRenderer={
							               (r, c) => {
								               const item = queryResults.get(r.toString());
								               let internalComponent = null;
								               if (item) {
									               if (col.renderCell) {
										               internalComponent = col.renderCell(r, c, item);
									               }
												   else if (item.__typename === 'HierarchyGroup') {
														if (col.name === SortableCardsPanel.NAME_FIELD)  {
															// internalComponent = <a href="#" onClick={this.onOpenFolder(r)}>{item.name}</a>;
															// const name = this.props.catalogContext.nestedObjectName(item.name);
															internalComponent = <GenericNameEditor model={item} valueUpdater={async (newName) => {
																const oldName = item.name;
																if (newName == oldName) {
																	return;
																}
																const objectTypes = catalogContext.objectTypes;
																site.busy = true;
																try {
																	for (let i = 0; i < objectTypes.length; i++) {
																		await omdb.updateFolderName(objectTypes[i].id, oldName, newName);
																	}
																	await catalogContext.refresh();
																} finally {
																	site.busy = false;
																}
															}} onTextClick={this.onOpenFolder(r)}/>
														} else if (col.name === SortableCardsPanel.ACTIONS_FIELD) {
															internalComponent = <bp.Button icon="folder-close" minimal onClick={this.onOpenFolder(r)} />
														}
												   }
									               else if (col.reserved === false) {
									               	   internalComponent = <UserTagList objectTypeDesc={catalogContext.getObjectType(item.__typename)} model={item} displayTagId={col._id} tagClassName={css.userTag} />
									               }
									               else {
									               	   if (col.value || col.renderValue) {
											               const v: any = col.value || col.renderValue(item);

														   internalComponent = typeof(v) == 'object'
											                                   ? v
											                                   : highlightResult(v.toLocaleString());
										               } else {
															let type = col.type;
											               let modelValue = item[col.name];
											               let valueIsArray = _.isArray(modelValue);

														   if ( type == "ID") {
															   internalComponent = <CopyableText text={modelValue} />
														   } else if (modelValue && modelValue.__typename) {
												               if (modelValue.__typename == "ConningUser") {
													               if (modelValue.fullName) {
														               internalComponent = highlightResult(modelValue.fullName);
													               }
													               else {
														               internalComponent =
															               <GetUserQuery query={apolloStore.graph.user.get} variables={{id: _.isString(modelValue) ? modelValue : modelValue._id}}>
																               {({data, loading, error}) => {
																	               if (loading) { return '...' }
																	               else if (error) return error.message
																	               else { return highlightResult(data.user.get ? data.user.get.fullName : 'Not Found'); }
																               }}
															               </GetUserQuery>
													               }
												               }
											               } else if (type == Simulation.ObjectType && modelValue) {
												               internalComponent = <>{(valueIsArray ? modelValue : [modelValue]).map((value , i) => <SimulationObjectLink
													               key={`${item._id}_SimulationObjectLink_${i}`}
													               id={value}
													               linkTo={model => Simulation.urlForRelatedObjectPage(model._id, item.__typename, col.name)}
													               linkContent={model => this.highlightResult(model.name)}
												               />)}</>;

											               } else if (type == UserFile.ObjectType && modelValue) {
												               internalComponent = <>{(valueIsArray ? modelValue : [modelValue]).map((value , i) => <UserFileObjectLink
													               key={`${item._id}_UserFileObjectLink_${i}`}
													               id={value}
													               linkContent={model => this.highlightResult(model.name)}
												               />)}</>;

											               } else if (type == Report.ObjectType && modelValue) {
												               internalComponent = <>{(valueIsArray ? modelValue : [modelValue]).map((value , i) => <ReportObjectLink
													               key={`${item._id}_UserFileObjectLink_${i}`}
													               id={value}
													               linkContent={model => this.highlightResult(model.name)}
												               />)}</>;
											               }

											               if (!internalComponent) {
												               var value = getCellText(r, c);

												               if (type == 'DateTime' && value) {
													               const dateValue = value instanceof Date ? value : new Date(`${value}`);

													               // Todo - need to wrap a time ago's output with highlighter
													               internalComponent = <bp.Tooltip
														               position={bp.Position.BOTTOM}
														               content={<div>
															               <TimeAgo datetime={dateValue}/>
															               <hr/>
															               <div>{dateToFormattedStringWithTimezone(dateValue)}</div>
														               </div>}
													               >
														               <span>{dateToStringWithTimezone(dateValue)}</span>
													               </bp.Tooltip>;
												               } else {
													               let modelValue = item[col.name];
													               value = (_.isArray(modelValue) ? modelValue : [value]).map(v => i18n.databaseLookups.tagValues[v] || v);
													               internalComponent = highlightResult(`${value||''}`);
												               }
											               }
										               }

										               if (col.urlField) {
											               internalComponent = <Link to={item[col.urlField]} title={value}>{internalComponent}</Link>;
										               } else if (showFavoriteIcon !== false && col.name === SortableCardsPanel.NAME_FIELD && item.__typename !== 'HierarchyGroup' && item?.isFavorite != null) {
											               internalComponent = <>
												               <div className={css.nameOuter}>{internalComponent}</div>
												               <FavoriteIndicator hasTooltip model={item}/>
											               </>;
										               }
									               }
								               }
								               const cellProps = {
									               "data-align": col.align,
									               loading: item == null,
									               key: `${c}.${r}`,
									               className: classNames(
										               col.align,
										               `cell-${col.name}`,
										               {[`${item?.__typename}-${col.name}`]: !!item},
										               {[css.showFavoriteIcon]: showFavoriteIcon !== false},
										               {[bp.Classes.ACTIVE]: item && selectedItems.has(item.id)},
										               {[css.oddRow]: r % 2 == 1},
										               {[css.userTagsCell]: col.reserved === false},
										               {[sortableCardsPanelCss.backgroundHighlight]: item && (item._id == catalogContext.highlightItem)}
									               ),
									               colName: col.name,
									               item: item,
									               panel: panel,
									               table: this,
									               row: r,
									               column: c,
									               children: internalComponent,
									               truncated: col.truncated
								               };

								               if (col.name === SortableCardsPanel.NAME_FIELD || col.name === SortableCardsPanel.ACTIONS_FIELD) {
									               return <DnDCell {...cellProps} />;
								               }
								               return <Cell {...cellProps} />;
										   }
						               }/>
					})}
			</Table2>
			{/*}*/}
			{/*}}</Observer>}*/}
			{/*</Query>*/}
		</div>);
	}

	getCellText = (r: number, c: number) => {
		const {columns, props: {catalogContext, catalogContext: {lastQueryResult, queryResults}}} = this;

		var qr = queryResults.get(r.toString());
		if (qr) {
			var col = columns[c];
			var value = qr[col.name];

			if (isObservableArray(value)) {
				value = value.slice();
			}

			if (isObservable(value)) {
				value = value.value;
			}

			if (_.isArray(value)) {
				value = value.map((v:any) => v.name || v).join(', ');
			}

			if (value != null && typeof value === 'object') {
				value = _.keys(value).filter(k => k != "__typename" && value[k]).map(k => `${k.capitalize()}: ${value[k].toLocaleString()}`).join(', ');
			}

			if (col.name == "name") {
				value = catalogContext.isHierarchicalViewEnabled ? catalogContext.nestedObjectName(value) : value;
			}

			return value;
		}

		return ""
	}

	@action onOpenFolder = (row) => {
		return (e) => {
			const { catalogContext, catalogContext: {queryResults}} = this.props;
			const item = queryResults.get(row.toString());

			catalogContext.setPath(item.name);
		};
	}

	@action onSelection = (selectedRegions) => {
		// react-dnd conflicts with blueprint table's selection event, need a tricky way to handle it.
		if (this.lastDragCellTime && ((new Date().getTime() - this.lastDragCellTime) < 10)) {
			return;
		}

		const {panel: {selectedItems}, catalogContext, catalogContext: { queryResults } } = this.props;
		//this.selectedRegions = selectedRegions;

		selectedItems.clear();
		selectedRegions.forEach(region => {
			const [from, to] = region.rows;
			for (var r = from; r <= to; r++) {
				var item = queryResults.get(r.toString());

				if (item?.__typename == "HierarchyGroup") {
					// catalogContext.setPath(item.name);
				} else {
					item && selectedItems.set(item.id, item);
				}
			}
		})
	}

	private renderBodyContextMenu = (context) => {

		const model = this.props.catalogContext.queryResults.get(`${context.target.rows[0]}`);
		if (!model) {
			return;
		}
		const {availableTags, panel} = this.props;
		return <SmartBrowserContextMenu availableTags={availableTags} visibleTags={this.visibleTags} model={model} panel={panel} />
	};
}

/** Slows down rendering something awful **/
export class ObserverCell extends React.Component<{ key?: string, children: () => React.ReactNode } | any, {}> {
	render() {
		return <Cell {...this.props}>
			{/*<Observer key={this.props.key}>*/}
			{(this.props.children as () => React.ReactNode)()}
			{/*</Observer>*/}
		</Cell>;
	}
}