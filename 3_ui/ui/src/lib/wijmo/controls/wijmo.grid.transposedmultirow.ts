/*!
    *
    * Wijmo Library 5.20212.812
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */


    module wijmo.grid.transposedmultirow {
    


'use strict';

/**
 * Extends the {@link Row} class to provide additional API for multi-row records.
 */
export class _MultiRow extends wijmo.grid.Row {
    _idxData: number;

    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item this row is bound to.
     * @param dataIndex The index of the record within the items source.
     */
    constructor(dataItem: any, dataIndex: number) {
        super(dataItem);
        this._idxData = dataIndex;
    }
}

    }
    


    module wijmo.grid.transposedmultirow {
    


'use strict';

/**
 * Extends the {@link Column} class with <b>colspan</b> property to
 * describe a cell in a {@link _CellGroup}.
 */
export class _Cell extends wijmo.grid.Column {
    _row: number;
    _col: number;
    _colspan: number;
    _rowspan: number;

    /**
     * Initializes a new instance of the {@link _Cell} class.
     *
     * @param options JavaScript object containing initialization data for the {@link _Cell}.
     */
    constructor(options?: any) {
        super();
        this._row = this._col = 0;
        this._rowspan = this._colspan = 1;
        wijmo.copy(this, options);
    }
    /**
     * Gets or sets the row index of this {@link _Cell} within the cell group.
     */
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        this._row = wijmo.asInt(value, false, true);
    }
    /**
     * Gets or sets the column index of this {@link _Cell} within the cell group.
     */
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        this._col = wijmo.asInt(value, false, true);
    }
    /**
     * Gets or sets the number of physical columns spanned by the {@link _Cell}.
     */
    get colspan(): number {
        return this._colspan;
    }
    set colspan(value: number) {
        this._colspan = wijmo.asInt(value, false, true);
        wijmo.assert(this._colspan > 0, 'colspan must be >= 1');
    }
    /**
     * Gets or sets the number of physical rows spanned by the {@link _Cell}.
     */
    get rowspan(): number {
        return this._rowspan;
    }
    set rowspan(value: number) {
        this._rowspan = wijmo.asInt(value, false, true);
        wijmo.assert(this._rowspan > 0, 'colspan must be >= 1');
    }
}
    }
    


    module wijmo.grid.transposedmultirow {
    





'use strict';

/**
 * Describes a group of cells that may span multiple rows and columns.
 */
export class _CellGroup extends _Cell {
    _g: TransposedMultiRow;     // owner grid
    _layout: _MultiRowLayout;   // owner layout
    _colstart = 0;              // index of the column where this group starts
    _rowstart = 0;              // index of the row where this group starts
    _cells: _Cell[];            // list of binding columns in this group
    _cols: wijmo.grid.ColumnCollection;    // array of columns to use for binding cells in this group
    _rng: wijmo.grid.CellRange[];          // array of ranges with merge range offsets for cells in this group

    /**
     * Initializes a new instance of the {@link _CellGroup} class.
     *
     * @param layout {@link _Layout} that owns the {@link _CellGroup}.
     * @param options JavaScript object containing initialization data for the new {@link _CellGroup}.
     */
    constructor(layout: _MultiRowLayout, options?: any) {
        super();

        // save reference to owner layout
        this._layout = layout;
        this._g = layout._grid;

        // parse options
        wijmo.copy(this, options);
        if (!this._cells) {
            throw 'Cell group with no cells?';
        }

        // position cells within the group
        let r = 0,
            c = 0;
        this._cells.forEach((cell, index) => {
            while (!this._cellFits(cell, index, r, c)) { // find a free slot
                c = (c + 1) % this.colspan;
                if (c == 0) r++;
            }
            cell.row = r;
            cell.col = c;
        });

        // set group's row/col span
        let rs = 1,
            cs = 1;
        this._cells.forEach(cell => {
            rs = Math.max(rs, cell.row + cell.rowspan);
            cs = Math.max(cs, cell.col + cell.colspan);
        });
        this.rowspan = rs;
        this.colspan = cs;
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        if (key == 'cells') {
            this._cells = [];
            if (wijmo.isArray(value)) {
                value.forEach(item => {
                    let cell = new _Cell(item);
                    if (cell.binding && !cell.header) {
                        cell.header = wijmo.toHeaderCase(cell.binding);
                    }
                    this._cells.push(cell);
                    this.colspan = Math.max(this.colspan, cell.colspan);
                });
            }
            return true;
        }
        return false;
    }

    // required for JSON-style initialization
    get cells(): _Cell[] {
        return this._cells;
    }

    // calculate merged ranges
    closeGroup(columnsPerItem: number) {

        // adjust colspan to match longest group in the grid
        if (columnsPerItem > this.colspan) {
            this._cells.forEach(cell => {
                if (cell.col == this.colspan - 1) {
                    cell.colspan = columnsPerItem - cell.col;
                }
            });
            this.colspan = columnsPerItem;
        }

        // make sure cells fill the group
        this._cells.forEach(cell => {
            while (cell.col + cell.colspan < this.colspan &&
                !this._slotTaken(cell.row, cell.col + cell.colspan)) {
                cell.colspan++;
            }
        });
        this._cells.forEach(cell => {
            while (cell.row + cell.rowspan < this.rowspan &&
                !this._slotTaken(cell.row + cell.rowspan, cell.col)) {
                cell.rowspan++;
            }
        });

        // make sure there are no empty slots (pathological cases)
        for (let r = 0; r < this.rowspan; r++) {
            for (let c = 0; c < this.colspan; c++) {
                wijmo.assert(this._slotTaken(r, c), 'Invalid layout (empty cells).');
            }
        }

        // create arrays with binding columns and create merge ranges for each cell
        this._cols = new wijmo.grid.ColumnCollection(this._g, this._g.columns.defaultSize);
        this._rng = new Array(columnsPerItem * this.rowspan);
        //console.log('grp[' + this._rowstart + ',' + this._colstart + ']');
        this._cells.forEach(cell => {
            for (let r = 0; r < cell.rowspan; r++) {
                for (let c = 0; c < cell.colspan; c++) {
                    let index = (cell.row + r) * this.colspan + (cell.col + c);

                    // save binding column for this cell offset
                    this._cols.setAt(index, cell);

                    // save merge range for this cell offset
                    let rng = new wijmo.grid.CellRange(cell.row, cell.col, cell.row + cell.rowspan - 1, cell.col + cell.colspan - 1);
                    if (!rng.isSingleCell) {
                        //console.log('rng[' + index + '] = ' + format('({row},{col})-({row2},{col2})', rng));
                        this._rng[index] = rng;
                    }
                }
            }
        });

        // add extra range for collapsed group headers
        this._rng[-1] = new wijmo.grid.CellRange(
            this._rowstart, this._colstart,
            this._rowstart + this._rowspan -1, this._colstart);
    }

    // get merged range for a cell in this group
    getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.CellRange {

        // row header, group
        if (c < 0) {
            return this._rng[-1];
        }

        // regular cell range
        let rs = r - this._rowstart,
            cs = c % this.colspan,
            rng = this._rng[rs * this.colspan + cs];

        // row header, non-group
        if (p.cellType == wijmo.grid.CellType.RowHeader) {
            c++;
        }

        // done
        let r0 = r - rs,
            c0 = c - cs;
        return rng
            ? new wijmo.grid.CellRange(r0 + rng.row, c0 + rng.col, r0 + rng.row2, c0 + rng.col2)
            : null;
    }

    // get the binding column for a cell in this group
    getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.Column {

        // merged row header binding
        // return 'this' to render the collapsed group header
        if (c < 0) {
            return this;
        }

        // regular cells
        let rs = r - this._rowstart,
            cs = c % this.colspan;
        let col = this._cols[rs * this.colspan + cs];

        // done
        return col;
    }

    // checks whether a cell fits in a given slot (adjusts colspan if needed)
    _cellFits(cell: _Cell, index: number, r: number, c: number): boolean {

        // too wide?
        if (c > 0 && c + cell.colspan > this.colspan) {
            return false;
        }

        // slot taken?
        for (let i = 0; i < cell.colspan; i++) {
            if (this._slotTaken(r, c + i, index)) {
                return false;
            }
        }

        // adjust group colspan
        this.colspan = Math.max(this.colspan, c + cell.colspan - 1);

        // seems to fit
        return true;
    }

    // checks whether a given row/col slot within the panel is currently in use
    _slotTaken(r: number, c: number, index = this._cells.length): boolean {
        for (let i = 0; i < index; i++) {
            let cell = this._cells[i];
            if (r >= cell.row && r <= cell.row + cell.rowspan - 1) {
                if (c >= cell.col && c <= cell.col + cell.colspan - 1) {
                    return true;
                }
            }
        }
        return false;
    }

    // update missing cell types to match data
    _updateCellTypes(item: any) {
        this._cols.forEach(col => {
            let cell = col as _Cell;
            if (cell.dataType == null && cell._binding) {
                cell.dataType = wijmo.getType(cell._binding.getValue(item));
            }
        });
    }
}

    }
    


    module wijmo.grid.transposedmultirow {
    





'use strict';

/**
 * Provides custom merging for {@link TransposedMultiRow} controls.
 */
export class _MergeManager extends wijmo.grid.MergeManager {

    /**
     * Gets a {@link CellRange} that specifies the merged extent of a cell
     * in a {@link GridPanel}.
     *
     * @param p The {@link GridPanel} that contains the range.
     * @param r The index of the row that contains the cell.
     * @param c The index of the column that contains the cell.
     * @param clip Specifies whether to clip the merged range to the grid's current view range.
     * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
     */
    getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, clip = true): wijmo.grid.CellRange {
        let grid = p.grid as TransposedMultiRow;

        if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
            return null;
        }

        // merge cells
        switch (p.cellType) {

            // merge cells in cells and row headers panels
            case wijmo.grid.CellType.Cell:
            case wijmo.grid.CellType.RowHeader:

                // get the group range
                let row = p.rows[r],
                    info = row.dataItem._rowInfo;
                let r_effective = info.index;
                let c_corrected = c; 
                if (p.cellType == wijmo.grid.CellType.RowHeader) {
                    c_corrected--; // discount group header column (always the first)
                }
                let group = grid._getGroupByRow(r);
                wijmo.assert(group instanceof _CellGroup, 'Failed to get the group!');
                let rng = group.getMergedRange(p, r_effective, c_corrected);

                // normalize
                if (rng) {
                    let r_eff_prev = r_effective;
                    let r_prev = r;
                    if (r > 0) {
                        r_eff_prev = p.rows[r - 1].dataItem._rowInfo.index;
                        r_prev = r - 1;
                    }
                    if (rng.row <= r_eff_prev) {
                        rng.row = r_prev;
                    } else {
                        rng.row = r;
                    }

                    let r_eff_next = r_effective;
                    let r_next = r;
                    if (r < p.rows.length - 1) {
                        r_eff_next = p.rows[r + 1].dataItem._rowInfo.index;
                        r_next = r + 1;
                    }
                    if (rng.row2 >= r_eff_next) {
                        rng.row2 = r_next;
                    } else {
                        rng.row2 = r;
                    }
                }

                // sanity
                wijmo.assert(!rng || rng.contains(r, c), 'Merged range must contain source cell');

                // return the range
                return rng;

            // merge cells in column headers panel
            case wijmo.grid.CellType.ColumnHeader:
                let cpi = grid.columnsPerItem,
                    c0 = c - c % cpi,
                    c1 = Math.min(c0 + cpi - 1, p.columns.length - 1);
                return new wijmo.grid.CellRange(0, c0, p.rows.length - 1, c1);

            // merge cells in top/left cell
            case wijmo.grid.CellType.TopLeft:
                return new wijmo.grid.CellRange(0, 0, p.rows.length - 1, p.columns.length - 1);
        }

        // no merging
        return null;
    }
}

    }
    


    module wijmo.grid.transposedmultirow {
    



'use strict';

/**
 * Class that parses {@link TransposedMultiRow} layout definitions.
 */
export class _MultiRowLayout {
    _grid: TransposedMultiRow;
    _columnsPerItem = 1;
    _bindingGroups: _CellGroup[] = [];
    _groupsByRow: any = {};

    /**
     * Initializes a new instance of the {@link _LayoutDef} class.
     *
     * @param grid {@link TransposedMultiRow} that owns this layout.
     * @param layoutDef Array that contains the layout definition.
     */
    constructor(grid: TransposedMultiRow, layoutDef: any[]) {
        this._grid = grid;
        this._bindingGroups = this._parseCellGroups(layoutDef);
    }

    // gets total number of rows in all groups
    get totalRowSpan(): number {
        let groups = this._bindingGroups;
        if (groups && groups.length) {
            let group = groups[groups.length - 1];
            return group._rowstart + group.rowspan;
        } else {
            return 0;
        }
    }

    // implementation

    // parse an array of JavaScript objects into an array of _BindingGroup objects
    private _parseCellGroups(groups: any[]): _CellGroup[] {
        let arr: _CellGroup[] = [],
            columnsPerItem = 1;
        if (groups) {

            // parse binding groups
            for (let i = 0, rowStart = 0; i < groups.length; i++) {
                let group = new _CellGroup(this, groups[i]);
                group._rowstart = rowStart;
                rowStart += group._rowspan;
                columnsPerItem = Math.max(columnsPerItem, group._colspan);
                arr.push(group);
            }

            // close binding groups (calculate merged ranges)
            arr.forEach(group => {
                group.closeGroup(columnsPerItem);
            });
            this._columnsPerItem = columnsPerItem;
        }

        // all done
        return arr;
    }
    
    // get the group that owns a given row
    _getGroupByRow(r: number) {
        let groupIndex = this._getGroupIndexByRow(r);
        return (groupIndex > -1) ? this._bindingGroups[groupIndex] : null;
    }

    // get the group index that owns a given row
    _getGroupIndexByRow(r: number) {
        // get from cache
        let groupIndex = this._groupsByRow[r];
        if (groupIndex) {
            return groupIndex;
        }

        // not in cache yet, find it now
        let groups = this._bindingGroups;
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if (r >= group._rowstart && r <= group._rowstart + group._rowspan - 1) {
                this._groupsByRow[r] = i; // found it!
                return i;
            }
        }

        // not found
        return -1;
    }

    // update missing cell types to match data
    _updateCellTypes(item: any) {
        this._bindingGroups.forEach(group => {
            group._updateCellTypes(item);
        });
    }
}

    }
    


    module wijmo.grid.transposedmultirow {
    










'use strict';

/**
 * Extends the {@link FlexGrid} control to display data using a transposed
 * layout, where columns represent data items and rows represent item
 * properties. Also this control allows to display each item in multiple columns.
 * 
 * Use the {@link layoutDefinition} property to define the layout of the 
 * rows used to display each data item.
 * 
 * Please note that the {@link TransposedMultiRow} control does not support
 * some {@link FlexGrid} properties. These properties are disabled, so changing 
 * these properties will have no effect. The list of disabled properties 
 * includes the following:
 * 
 * {@link FlexGrid.allowAddNew}, {@link FlexGrid.allowDelete},
 * {@link FlexGrid.allowDragging}, {@link FlexGrid.allowPinning},
 * {@link FlexGrid.allowSorting}, {@link FlexGrid.columnLayout},
 * {@link Column.width}, {@link FlexGridFilter}, {@link Selector}.
 */
export class TransposedMultiRow extends wijmo.grid.FlexGrid {
    // ordinal position of the current item in the view
    // actually used for preservation when rebinding grid (TFS 467517)
    private _currentPos = -1;

    _layoutDef: any[];
    _layout: _MultiRowLayout;
    _bindingColumns: any = {};

    protected _view: wijmo.collections.ICollectionView;
    protected _keyPrefix = 'item';
    /*protected*/ _rowInfo: wijmo.grid.ColumnCollection;

    /**
     * Initializes a new instance of the {@link TransposedMultiRow} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // add class name to enable styling
        wijmo.addClass(this.hostElement, 'wj-transposed-multirow');

        // start with empty layout
        this._layout = new _MultiRowLayout(this, null);

        // change some defaults
        this.allowDragging = wijmo.grid.AllowDragging.None;
        this.allowSorting = wijmo.grid.AllowSorting.None;
        this.mergeManager = new _MergeManager();

        // custom cell rendering
        // listen to event "formatItem"
        // instead overriding method "onFormatItem"
        // because the latter is not called if there are no event listeners
        this.formatItem.addHandler(this._formatItem, this);

        // initialize rowInfo array
        this._rowInfo = new wijmo.grid.ColumnCollection(this, this.columns.defaultSize);

        // apply options after everything else is ready
        this.initialize(options);

        // listen for changes in _rowInfo array after applying options
        this._rowInfo.collectionChanged.addHandler(this._rowInfoChanged, this);
    };

    /**
     * Gets or sets an array that defines the layout of each data item.
     *
     * The array contains a list of cell group objects which have the following properties:
     *
     * <ul>
     * <li><b>header</b>: Group header (shown when the headers are collapsed).</li>
     * <li><b>colspan</b>: Number of grid columns spanned by the group.</li>
     * <li><b>cells</b>: Array of cell objects, which extend {@link Column} with a 
     * <b>colspan</b> property.</li>
     * </ul>
     *
     * When the {@link layoutDefinition} property is set, the grid scans the cells in each
     * group as follows:
     *
     * <ol>
     * <li>The grid calculates the <b>colspan</b> of the group either as group's own <b>colspan</b>
     * or as span of the widest cell in the group, whichever is wider.</li>
     * <li>If the cell fits the current row within the group, it is added to the current row.</li>
     * <li>If it doesn't fit, it is added to a new row.</li>
     * </ol>
     *
     * When all groups are ready, the grid calculates the number of columns per record to the maximum 
     * <b>colspan</b> of all groups, and adds columns to each group to pad their width as needed.
     * 
     * Please note that the cells support all the usual {@link Column} properties except
     * the <b>width</b> property. This property can be specified in the {@link layoutDefinition} object
     * but the grid will ignore it because it is supposed that the cells in each rows should have 
     * the same width.
     */
    get layoutDefinition(): any[] {
        return this._layoutDef;
    }
    set layoutDefinition(value: any[]) {

        // store original value so user can get it back
        this._layoutDef = wijmo.asArray(value);

        // parse cell layout
        this._layout = new _MultiRowLayout(this, value);

        // re-generate rows
        this._rowInfoChanged();
    }

    /**
     * Gets the {@link Column} object used to bind a data item to a grid cell.
     *
     * @param p {@link GridPanel} that contains the cell.
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     */
    getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.Column {
        // support cell types only
        if (p.cellType != wijmo.grid.CellType.Cell) {
            return null;
        }

        let row = p.rows[r],
            info = row.dataItem._rowInfo;
        let r_effective = info.index;

        // get from the cache
        let key = r_effective + '_' + c;
        let bCol = this._bindingColumns[key];
        if (bCol) {
            return bCol;
        }

        // not in the cache yet, get from the group
        let group = this._getGroupByRow(r);
        let cell = group.getBindingColumn(p, r_effective, c) as _Cell;
        if (cell) {
            bCol = new wijmo.grid.Column();

            // copy props
            let props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Column);
            props.forEach(prop => {
                if (cell[prop] != null) {
                    bCol[prop] = cell[prop];
                }
            });

            // set effective binding
            let index = Math.floor(c / this.columnsPerItem);
            let record = c % this.columnsPerItem;
            bCol.binding = this._keyPrefix + index + '_' + record;

            // set to the cache
            this._bindingColumns[key] = bCol;
        }

        // done
        return bCol;
    }

    /**
     * Gets the number of columns used to display each item.
     *
     * This value is calculated automatically based on the value
     * of the <b>layoutDefinition</b> property.
     */
    get columnsPerItem(): number {
        return this._layout._columnsPerItem;
    }

    // ** overrides

    // TransposedMultiRow does not support items addition
    get allowAddNew(): boolean {
        return false;
    }
    set allowAddNew(value: boolean) {
        wijmo.assert(!value, 'TransposedMultiRow does not support items addition.');
    }

    // TransposedMultiRow does not support items deletion
    get allowDelete(): boolean {
        return false;
    }
    set allowDelete(value: boolean) {
        wijmo.assert(!value, 'TransposedMultiRow does not support items deletion.');
    }

    // TransposedMultiRow does not support dragging
    get allowDragging(): wijmo.grid.AllowDragging {
        return wijmo.grid.AllowDragging.None;
    }
    set allowDragging(value: wijmo.grid.AllowDragging) {
        wijmo.assert(value === wijmo.grid.AllowDragging.None, 'TransposedMultiRow does not support dragging.');
        if (value !== this._alDragging) {
            this._alDragging = value;
            this.invalidate(); // to re-create row/col headers
        }
    }

    // TransposedMultiRow does not support pinning
    get allowPinning(): boolean {
        return false;
    }
    set allowPinning(value: boolean) {
        wijmo.assert(!value, 'TransposedMultiRow does not support pinning.');
    }

    // TransposedMultiRow does not support sorting
    get allowSorting(): wijmo.grid.AllowSorting {
        return wijmo.grid.AllowSorting.None;
    }
    set allowSorting(value: wijmo.grid.AllowSorting) {
        wijmo.assert(value === wijmo.grid.AllowSorting.None, 'TransposedMultiRow does not support sorting.');
        this._alSorting = value;
    }

    // TransposedMultiRow does not support column layout
    get columnLayout(): string {
        throw 'TransposedMultiRow does not support column layout.';
    }
    set columnLayout(value: string) {
        throw 'TransposedMultiRow does not support column layout.';
    }

    // re-generate rows when the _rowInfo changes
    refresh(fullUpdate?: boolean) {
        let rowInfo = this._rowInfo;
        if (rowInfo._dirty) {
            rowInfo._dirty = false;
            this._rowInfoChanged();
        } else {
            super.refresh(fullUpdate)
        }
    }

    // update grid when rows are loaded
    onLoadedRows(e?: wijmo.EventArgs) {

        // update column header cells
        let chCols = this.columnHeaders.columns;
        for (let i = 0; i < chCols.length; i++) {
            this.columnHeaders.setCellData(0, i, '');
        }

        // update columns
        let cols = this.columns;
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i];
            col.align = null; // not '', that means 'left'
            col.dataType = 0; // 'Any' (not null, or the grid will auto-set it)
        }

        // update row header cells
        let rhCols = this.rowHeaders.columns;
        this.rows.forEach(row => {
            let info = row.dataItem._rowInfo;
            if (info) {
                for (let c = rhCols.length - 2; c >= 0; c--) {
                    let hdr = info.headers[c] || wijmo.toHeaderCase(info.bindings[c]);
                    //console.log('(' + row.index + ',' + c + '): ' + hdr);
                    this.rowHeaders.setCellData(row.index, c + 1, hdr);
                }
            }
        });

        // update row header columns
        rhCols[0].visible = false; // hide the first column
        for (let i = 1; i < rhCols.length; i++) {
            rhCols[i].align = 'left';
            rhCols[i].visible = true; // show the rest of the columns
            rhCols[i].width = this.columns.defaultSize;
        }

        // go raise the event
        super.onLoadedRows(e);
    }

    /*protected*/ _getGroupByRow(r: number): _CellGroup {
        let p = this.cells,
            row = p.rows[r],
            info = row.dataItem._rowInfo;
        let r_effective = info.index;
        let group: _CellGroup = this._layout._getGroupByRow(r_effective);
        wijmo.assert(group instanceof _CellGroup, 'Failed to get the group!');
        return group;
    }

    // bind rows
    /*protected*/ _addBoundRow(items: any[], index: number) {
        let item = items[index];
        this.rows.push(new _MultiRow(item, index));
    }

    // update missing column types to match data
    /*protected*/ _updateColumnTypes() {

        // allow base class
        super._updateColumnTypes();

        // update missing column types in all binding groups
        let view = this.collectionView;
        if (wijmo.hasItems(view) && this._layout) {
            let transposedItem = view.items[0];
            let items = transposedItem._arr;
            if (items && items.length > 0) {
                this._layout._updateCellTypes(items[0]);
            }
        }
    }

    // get the binding column 
    // (in the MultiRow grid, each physical column may contain several binding columns)
    /*protected*/ _getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: wijmo.grid.Column): wijmo.grid.Column {
        if (this._layout) {
            if (p == this.cells) {
                c =  this.getBindingColumn(p, r, c.index);
            }
            return c;
        }
        return super._getBindingColumn(p, r, c);
    }

    // get value that indicates whether layout is transposed or not
    // Note: transposed layout is when rows represent properties and
    // columns represent items
    /*protected*/ _isTransposed(): boolean {
        return true;
    }

    // update source CollectionView after editing
    onRowEditEnded(e: wijmo.grid.CellRangeEventArgs) {
        if (this._view != null) {
            let args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change);
            this._view.collectionChanged.raise(this._view, args);
        }
        super.onRowEditEnded(e)
    }

    // overridden to transpose incoming data
    protected _getCollectionView(value: any): wijmo.collections.ICollectionView {

        // original CollectionView's getError function
        let getError: wijmo.collections.IGetError = null;

        // remove CollectionView event handler
        if (this._view != null) {
            this._view.collectionChanged.removeHandler(this._sourceViewChanged);
        }

        // transpose the source data, add CollectionView event handler
        if (wijmo.isArray(value)) {
            value = this._transposeItemsSource(value);
        } else if (value) {
            if (this._view) {
                this._view.collectionChanged.removeHandler(this._sourceViewChanged);
            }
            this._view = wijmo.tryCast(value, 'ICollectionView') as wijmo.collections.ICollectionView;
            if (this._view) {

                // listen to changes in the ICollectionView
                this._view.collectionChanged.addHandler(this._sourceViewChanged, this);

                // honor source CollectionView's getError
                if (value instanceof wijmo.collections.CollectionView) {
                    getError = value.getError;
                }

                // create new ObservableArray from original CollectionView's items
                value = this._transposeItemsSource(this._view.items);
            }
        }
        this.autoGenerateColumns = true;

        // let base class handle this
        let retVal = super._getCollectionView(value);

        // restore preserved position (TFS 467517)
        if (retVal && this._currentPos >= 0) {
            retVal.currentPosition = Math.min(retVal.items.length - 1, this._currentPos);
        }

        // honor original CollectionView's getError handler (TFS 412376)
        if (getError && retVal instanceof wijmo.collections.CollectionView) {
            retVal.getError = (item, prop) => {
                if (prop == null) { // WJM-20019
                    return null;
                }
                let index = item._keys.indexOf(prop);
                let recIndex = index % item._bnd.length;
                let itemIndex = Math.floor(index / item._bnd.length)
                return getError(item._arr[itemIndex], item._bnd[recIndex].path);
            };
        }

        // done
        return retVal;
    }

    // ** implementation

    // rows added/removed/changed, re-bind the whole grid
    private _rowInfoChanged() {
        try {
            // preserve current position before rebinding grid
            let cv = this.collectionView;
            this._currentPos = cv ? cv.currentPosition : -1;

            // preserve selection
            // because itemsSource setter internally resets selection
            let sel = this.selection;

            // re-bind grid
            this._bindingColumns = {};
            let items = this.itemsSource;        
            this.itemsSource = null;
            this.itemsSource = items;

            // restore preserved selection
            if (sel && sel.isValid) {
                this.selection = sel;
            }
        } finally {
            // reset preserved position after rebinding grid
            this._currentPos = - 1;
        }
    }

    // customize cells
    private _formatItem(s: TransposedMultiRow, e: wijmo.grid.FormatItemEventArgs) {
        let cpi = this.columnsPerItem,
            p = e.panel,
            ct = p.cellType,
            row = p.rows[e.range.row] as _MultiRow,
            row2 = p.rows[e.range.row2] as _MultiRow,
            cell = e.cell;

        // toggle group header style
        if (ct == wijmo.grid.CellType.RowHeader) {
            wijmo.toggleClass(cell, 'wj-group-header', e.range.row == 0);
        }

        // add group start/end class markers
        if (ct == wijmo.grid.CellType.Cell || ct == wijmo.grid.CellType.RowHeader) {
            let group = this._getGroupByRow(e.row);
            wijmo.toggleClass(cell, 'wj-group-start', group._rowstart == e.range.row);
            wijmo.toggleClass(cell, 'wj-group-end', group._rowstart + group._rowspan - 1 == e.range.row2);
        }

        // add record start/end class markers
        if (cpi > 1) {
            if (ct == wijmo.grid.CellType.Cell || ct == wijmo.grid.CellType.ColumnHeader) {
                wijmo.toggleClass(cell, 'wj-record-start', (e.range.col % cpi === 0));
                wijmo.toggleClass(cell, 'wj-record-end', (e.range.col2 % cpi === cpi - 1));
            }
        }

        // handle alternating rows
        let altStep = this.alternatingRowStep;
        if (altStep && ct == wijmo.grid.CellType.Cell) {
            let totalRows = this._layout.totalRowSpan;
            let totalGroups = this._layout._bindingGroups.length;
            let groups = Math.floor(row.dataIndex / totalRows) * totalGroups;
            let rowIndex = row.dataIndex % totalRows;
            groups += this._layout._getGroupIndexByRow(rowIndex) + 1;
            let altRow = groups % (altStep + 1) == 0;
            wijmo.toggleClass(cell, 'wj-alt', altRow);
        }
    }

    // update transposed view when source CollectionView changes
    private _sourceViewChanged(sender: wijmo.collections.ICollectionView, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (!this.activeEditor) { // TFS 412376
            this.invalidate();
        }
    }

    // transpose itemsSource array
    private _transposeItemsSource(arr: any[]): wijmo.collections.ObservableArray {

        // create transposed array
        let transposed = new wijmo.collections.ObservableArray();

        if (this._layout && this._layout._bindingGroups.length) {

            // auto-generate rowInfo array
            let rowInfo = this._getRowInfo(arr);

            // generate a proxy item for each rowInfo object
            // each proxy item represents one property (e.g. name, id, etc) of
            // the original data items and has one property for each original
            // data item (e.g. item0, item1, etc.)
            rowInfo.forEach((rowInfo, index: number) => {
                // add proxy object if possible, more expensive transposed object otherwise
                let keys = this._createKeys(arr);
                if (this._supportsProxies()) {
                    let proxy = this._createProxy(arr, rowInfo, keys);
                    transposed.push(proxy);
                } else {
                    let obj = this._createTransposedObject(arr, rowInfo, keys);
                    transposed.push(obj);
                }
            });

            // listen to changes in source array
            if (arr instanceof wijmo.collections.ObservableArray) {
                arr.collectionChanged.addHandler((s: wijmo.collections.ObservableArray, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
                    // just invalidate grid if item was changed (TFS 467052)
                    if (e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
                        if (!this.activeEditor) {
                            this.invalidate();
                        }
                    } else {
                        let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Reset);
                        transposed.onCollectionChanged(e);
                        this._rowInfoChanged(); // re-generate rows
                    }
                });
            }
        }

        // all done
        return transposed;
    }

    // create keys (property names) used by all proxy objects
    private _createKeys(arr: any[]): string[] {
        let columns = Array.apply(null, { length: this.columnsPerItem });
        let keys = arr.map((item: any, index: number) => {
            return columns.map((val: any, record: number) => this._keyPrefix + index + '_' + record)
        });
        return [].concat.apply([], keys);
    }

    // check whether the browser supports proxies
    private _supportsProxies(): boolean {
        return window['Proxy'] != null;
    }

    // create proxy that reads/writes data from the original array
    private _createProxy(arr: any[], rowInfo: any, proxyKeys: string[]): any {
        let target = {
            _arr: arr,
            _rowInfo: rowInfo,
            // row info holds multiple bindings for different cells
            _bnd: rowInfo.bindings.map(b => new wijmo.Binding(b)), // supports deep binding
            _keys: proxyKeys
        };
        let handler = {
            ownKeys: (target: any) => {
                return target._keys;
            },
            getOwnPropertyDescriptor: () => {
                return {
                    enumerable: true,
                    configurable: true,
                    writable: true
                };
            },
            get: (obj: any, prop: string) => {
                let index = obj._keys.indexOf(prop);
                if (index > -1) {
                    let bnd = obj._bnd,
                        arr = obj._arr,
                        len = bnd.length,
                        rec = index % len,
                        item = Math.floor(index / len);
                    return bnd[rec].getValue(arr[item]);
                } else {
                    //console.log('proxy get: prop=' + prop + ', keys=' + obj._keys);
                    return obj[prop];
                }
            },
            set: (obj: any, prop: string, value: any) => {
                let index = obj._keys.indexOf(prop);
                if (index > -1) {
                    let bnd = obj._bnd,
                        arr = obj._arr,
                        len = bnd.length,
                        rec = index % len,
                        item = Math.floor(index / len);
                    bnd[rec].setValue(arr[item], value);
                    if (arr instanceof wijmo.collections.ObservableArray || arr instanceof wijmo.collections.CollectionView) {
                        let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, arr[item], item);
                        arr.onCollectionChanged(e);
                    }
                    return true;
                }
                //console.log('proxy set: prop=' + prop + ', keys=' + obj._keys);
                return false;
            }
        };
        return new Proxy(target, handler);
    }

    // create proxy-like object when real proxies are not available
    private _createTransposedObject(arr: any[], rowInfo: any, props: string[]) {
        let obj = {
            _arr: arr,
            _rowInfo: rowInfo,
            // row info holds multiple bindings for different cells
            _bnd: rowInfo.bindings.map(b => new wijmo.Binding(b)), // supports deep binding
            _keys: props
        }
        for (let index = 0; index < props.length; index++) {
            let prop = props[index];
            Object.defineProperty(obj, prop, {
                enumerable: true,
                get: () => {
                    let bnd = obj._bnd,
                        len = bnd.length,
                        rec = index % len,
                        item = Math.floor(index / len);
                    return bnd[rec].getValue(arr[item]);
                },
                set: value => {
                    let bnd = obj._bnd,
                        len = bnd.length,
                        rec = index % len,
                        item = Math.floor(index / len);
                    bnd[rec].setValue(arr[item], value);
                    if (arr instanceof wijmo.collections.ObservableArray) {
                        let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, arr[item], item);
                        arr.onCollectionChanged(e);
                    }
                    return true;
                }
            });
        }
        return obj;
    }

    // auto-generates an array with rowInfo objects based on a data array
    // (similar to the FlexGrid's autoGenerateColumns logic)
    private _getRowInfo(arr: any[]): any[] {
        let rowInfo = [];
        if (this._layout) {

            // update row header columns count
            let columns = this.rowHeaders.columns,
                columnsPerItem = this.columnsPerItem,
                cnt = columnsPerItem + 1;
            while (columns.length > cnt) {
                columns.removeAt(columns.length - 1);
            }
            while (columns.length < cnt) {
                columns.push(new wijmo.grid.Column());
            }

            this._layout._bindingGroups.forEach(group => {
                //console.log('grp:' + group._rowstart);
                for (let r = 0; r < group.rowspan; r++) {
                    // create the row
                    let row: any = {
                        index: group._rowstart + r,
                        bindings: [],
                        headers: []
                    };

                    // set column bindings for every column in the group
                    for (let c = 0; c < group.colspan; c++) {
                        for (let cellIndex = 0; cellIndex < group.cells.length; cellIndex++) {
                            let cell = group.cells[cellIndex] as _Cell;
                            if (r >= cell.row && r < cell.row + cell.rowspan && 
                                c >= cell.col && c < cell.col + cell.colspan) {
                                row.bindings.push(cell['binding']);
                                row.headers.push(cell['header']);
                                break;
                            }
                        }
                    }
                    //console.log('bindings:' + row.bindings.join());

                    // done
                    rowInfo.push(row);
                }
            });
        }
        return rowInfo;
    }
}

    }
    


    module wijmo.grid.transposedmultirow {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.transposedmultirow', wijmo.grid.transposedmultirow);








    }
    