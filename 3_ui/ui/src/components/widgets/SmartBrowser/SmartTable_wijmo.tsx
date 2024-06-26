import {
    computed,
    runInAction,
    action,
    toJS,
    isObservable,
    isObservableArray,
    makeObservable,
} from 'mobx';
import {Highlighter, TimeAgo} from 'components';

import {api, omdb, OmdbTag, utility} from 'stores';
import {Observer, observer} from 'mobx-react';
import * as css from './SmartTable_wijmo.css'
import {SmartTableProps, SortableCardsPanel} from './SortableCardsPanel'
import AllowResizing = wijmo.grid.AllowResizing;

class MyCellFactory extends wijmo.grid.CellFactory {
	public disposeCell(cell: HTMLElement) {
		if (cell['react'] || utility.findReactInstance(cell)) {
			delete cell['react']
			ReactDOM.unmountComponentAtNode(cell);
		}
	}

	updateCell(p: wijmo.grid.GridPanel, r: number, c: number, cell: HTMLElement, rng?: wijmo.grid.CellRange, updateContent?: boolean) {
		const component                               = p.grid['_component'];
		var {cellsWithReact, columns, props: {panel}} = component;

		cell['_component']   = component;
		if (cell['react'] || utility.findReactInstance(cell)) {
			//ReactDOM.unmountComponentAtNode(cell);
			updateContent = false;
		}

		super.updateCell(p, r, c, cell, rng, updateContent);

		if (updateContent != false) {
			var col = columns[c];
			if (!col) {
			}
			else if (p.cellType == wijmo.grid.CellType.ColumnHeader) {
				var $cell                           = $(cell);
				let {sortBy, sortOrder, searchText} = panel;

				if (col.binding == sortBy) {
					sortOrder = _.isEmpty(sortOrder) ? 'asc' : sortOrder;

					$cell.addClass(`wj-sort-${sortOrder}`);
					ReactDOM.render(<Observer>{() => {
						let {sortBy, sortOrder, searchText} = panel;
						return <div className={css.sortHeader}>{col.header} <span className={`wj-glyph-${sortOrder == 'asc' ? 'up' : 'down'}`}/></div>;
					}}
					</Observer>, cell)
				}
				else {
					$cell.removeClass('.wj-sort-*');
				}

				if (col.allowSorting != false) {
					$cell.addClass(css.canSort)
				}
			}
			else if (p.cellType == wijmo.grid.CellType.Cell) {
				if (!panel.sortedAndFiltered[r]) {
					return;
				}

				ReactDOM.render(
					<Observer>
						{() => {
							var item         = panel.sortedAndFiltered[r];
							if (!item) { return null; }
							let {searchText} = panel;

							if (col.renderCell) {
								return col.renderCell(r, c, item);
							}
							else {
								if (c >= columns.length) {
									throw new Error("You must specify a renderCell method for columns included with your sortable card panel table view.")
								}

								let {searchText} = panel;
								const col        = columns[c];
								if (col.value) {
									return <Highlighter searchWords={searchText ? searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
									                    textToHighlight={col.value.toString()}/>;
								}
								else if (col.renderValue) {
									const result = col.renderValue(item);
									if (typeof(result) == 'object') {
										return result as React.ReactElement<any>;
									}
									else {
										return <Highlighter searchWords={searchText ? searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
										                    textToHighlight={result.toString()}/>
									}
								}
								else {
									var value = toJS(item[col.binding]);

									if (col.type == 'date') {
										// Todo - need to wrap a time ago's output with highlighter
										return <TimeAgo title={value} datetime={value}/>;
									}
									else if (!_.isEmpty(searchText)) {
										if (_.isArray(value)) {
											value = value.join(', ');
											return value;
										}

										if (value && value.toString().toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
											//ReactDOM.unmountComponentAtNode(cell);
											return <Highlighter searchWords={searchText ? searchText.split(' ').map( s => api.utility.escapeRegExp(s)) : []}
											                    textToHighlight={value ? value.toString() : ''}/>
										}
									}
								}
							}

							return value;
						}}
					</Observer>, cell);
			}
		}
	}
}

@observer
export class SmartTable_Wijmo extends React.Component<SmartTableProps, {}> {
    grid: wijmo.grid.FlexGrid;
    cellFactory = new MyCellFactory();

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    // @computed get tags() {
    // 	return this.props.tableColumns.filter(f => f && _.isObject(f) && !f.hide);
    // }

    @computed get columns() {
		let {props: {tableColumns, uiDefinition}} = this;

		tableColumns = tableColumns ? tableColumns : _.get(uiDefinition, 'table.columns', []);

		return tableColumns.map((tag: OmdbTag) => {
			return {
				binding:      tag.name,
				minWidth:     120,
				wordWrap:     tag && tag.multiple,
				allowSorting: tag && tag.canSort != false && tag.name != SortableCardsPanel.ACTIONS_FIELD,
				header:       tag ? tag.displayName : utility.camelToRegular(tag.name),
				...tag
			};
		});

		//
		// const { tags, props: { tableColumns } } = this;
		// return tags.map((f, i) => ({
		// 	binding : f.name,
		// 	header  : f.label ? f.label : f.name ? f.name.capitalize() : '',
		// 	align   : f.align,
		// 	minWidth: 120, // So that the sort indicator has room
		// 	//maxWidth: window.innerWidth / fields.length, //`${1 / fields.length}%`
		// 	//currentSort: f.field == sortBy ? sortOrder == 'asc' ? '+' : '-' : null
		// 	//type: f.isDate ? 'Date' : undefined
		// })).concat(tableColumns);
	}

    initialLoad = true;

    render() {
		const {columns, initialLoad, props: {tableColumns, onSelect, multiselect, panel}}                         = this;
		const {sorted, sortedAndFiltered, filtered, sortBy, sortOrder, selectedItems, props: {uiDefinition, catalogContext}} = panel;

		// console.log(columns)
		return (<div className={css.tableView}>
			<Wj.FlexGrid
				initialized={(g: wijmo.grid.FlexGrid) => {
					this.grid       = g
					g['_component'] = this;
					g.autoSizeColumns();
					g.autoSizeRows();
					//this.updateGridSortOrder();
					// var lastColumn   = g.columns[g.columns.length - 1] as wijmo.grid.Column;
					// lastColumn.width = '*';
				}}

				loadedRows={(grid: wijmo.grid.FlexGrid) => {
					if (!grid || !grid.itemsSource) return;

					for (var r = 0; r < filtered.length; r++) {
						var row = filtered[r];
						for (var c = 0; c < columns.length; c++) {
							var col = columns[c];
							if (!col.renderValue) {
								var value = grid.getCellData(r, c, false);

								if (isObservableArray(value)) {
									value = value.slice();
								}

								if (_.isArray(value)) {
									grid.setCellData(r, c, value.join(', '), false, false);
								}
								else if (isObservable(value)) {
									grid.setCellData(r, c, value.value, false, false);
								}
							}
						}
					}

					!initialLoad && grid.autoSizeColumns();

					tableColumns.forEach((tc, i) => {
						if (tc.width) {
							columns[i].width = tc.width;
						}
					});
					grid.autoSizeRows();
					this.initialLoad = false;
				}}

				resizedColumn={() => { this.grid && this.grid.autoSizeRows()}}
				allowResizing={AllowResizing.Columns}
				autoGenerateColumns={false}
				columns={columns.map(c => _.omit(c, ['renderValue', 'type', 'tag']))}
				showSort
				itemsSource={filtered}
				autoSizeMode={wijmo.grid.AutoSizeMode.Both}
				allowDragging={wijmo.grid.AllowDragging.None}
				cellFactory={this.cellFactory}
				frozenColumns={uiDefinition?.table ? uiDefinition.table.frozenColumns : 0}
				selectionMode={wijmo.grid.SelectionMode.None}
				scrollPositionChanged={(s:wijmo.grid.FlexGrid, e) => {
					// if we're close to the bottom
					if (s.viewRange.bottomRow >= s.rows.length - 1) {

						s.collectionView.refresh();
					}
				}}

				sortingColumn={(grid, e: wijmo.grid.CellRangeEventArgs) => {
					var col             = e.panel.columns[e.col];
					const {currentSort} = col;
					e.cancel            = true;

					runInAction(() => {
						// The grid sends us two sorts in a row with +, if we see the 2nd plus, treat it as a -
						if (panel.sortBy == col.binding && panel.sortOrder == 'asc') {
							panel.sortOrder = 'desc';
							//this.updateGridSortOrder();
						}
						else {
							panel.sortBy    = col.binding;
							panel.sortOrder = 'asc';
						}
					})
				}}
			/>
		</div>);

		// selectionMode={!onSelect ? wijmo.grid.SelectionMode.None : multiselect ? wijmo.grid.SelectionMode.ListBox : wijmo.grid.SelectionMode.Row}
		// selectionChanged={this.grid_selectedChanged}
		// selectedRows={this.grid ? panel.selectedItems.values().map(v => this.grid.rows[sortedAndFiltered.indexOf(v)]) : []}
	}

	componentDidUpdate(prevProps: Readonly<SmartTableProps>, prevState: Readonly<{}>, snapshot?: any) {
		if (prevProps.searchText != this.props.searchText) {
			this.grid && this.grid.refresh();
		}
	}

    @action
	private grid_selectedChanged = (grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
		const {selectedItems, sortedAndFiltered, props: {onSelect}} = this.props.panel;

		selectedItems.clear();

		for (var row of grid.selectedRows) {
			var item = sortedAndFiltered[row.index];
			selectedItems.set(item.id, item);
		}

		onSelect && onSelect(selectedItems.values());
	}

    /* Client-side grid sort */
    private updateGridSortOrder() {
		const {grid, grid: {columns}, props: {panel, panel: {sortOrder, sortBy}}} = this;

		const sortColIndex = columns.indexOf(sortBy);
		if (sortColIndex != -1) {
			const sortColumn              = columns[sortColIndex];
			const {sortDescriptions: sds} = grid.collectionView;
			grid.finishEditing()
			sds.beginUpdate();
			sds.clear();
			sds.push(new wijmo.collections.SortDescription(sortBy, panel.sortOrder == 'asc'));
			sds.endUpdate();
			//grid.refresh(true);
		}

		// this.sortBy = col.binding;
		// this.sortOrder = currentSort == '+' ? 'asc' : 'desc';
	}
}
