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


    module wijmo.grid.multirow {
    



'use strict';

/**
 * Extends the {@link Row} class to provide additional information for multi-row records.
 */
export class _MultiRow extends wijmo.grid.Row {
    _idxRecord: number;

    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item this row is bound to.
     * @param dataIndex The index of the record within the items source.
     * @param recordIndex The index of this row within the record (data item).
     */
    constructor(dataItem: any, dataIndex: number, recordIndex: number) {
        super(dataItem);
        this._idxData = dataIndex;
        this._idxRecord = recordIndex;
    }
    /**
     * Gets the index of this row within the record (data item) it represents.
     */
    get recordIndex(): number {
        return this._idxRecord;
    }
}

/**
 * Extends the {@link GroupRow} class to provide additional information for multi-row records.
 */
export class _MultiGroupRow extends wijmo.grid.GroupRow {
    _idxRecord: number;

    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item this row is bound to.
     * @param recordIndex The index of this row within the record (group header).
     */
    constructor(dataItem: any, recordIndex: number) {
        super(dataItem);
        this._idxRecord = recordIndex;
    }
    /**
     * Gets the index of this row within the record (data item) it represents.
     */
    get recordIndex(): number {
        return this._idxRecord;
    }
    /**
     * _MultiGroupRow rows always have children...
     */
    get hasChildren(): boolean {
        return true;
    }
    /**
     * Get cell range taking into account multi-row header rows.
     */
    getCellRange(): wijmo.grid.CellRange {
        let row = this._getLastRowInHeader();
        return row != this
            ? row.getCellRange()
            : super.getCellRange();
    }
    /**
     * Gets or sets a value that indicates whether this _MultiGroupRow is
     * collapsed (child rows are hidden) or expanded (child rows are visible).
     */
    get isCollapsed(): boolean {
        let row = this._getLastRowInHeader();
        return row._getFlag(wijmo.grid.RowColFlags.Collapsed);
    }
    set isCollapsed(value: boolean) {
        let row = this._getLastRowInHeader();
        if (value != row.isCollapsed && row._list != null) {
            row._setCollapsed(wijmo.asBoolean(value));
        }
    }

    // sets the collapsed/expanded state of a (possibly multi-row) group row
    _setCollapsed(collapsed: boolean) {
        let g = this.grid as MultiRow,
            rows = g.rows,
            rng = this.getCellRange();

        // TODO: finish editing?

        // fire GroupCollapsedChanging
        let e = new wijmo.grid.CellRangeEventArgs(g.cells, new wijmo.grid.CellRange(this.index, -1));
        if (!g.onGroupCollapsedChanging(e)) {
            return;
        }

        // apply new value
        g.deferUpdate(() => {
            rows.deferUpdate(() => {

                // collapse/expand this group
                this._setFlag(wijmo.grid.RowColFlags.Collapsed, collapsed, true);
                for (let r = rng.topRow + 1; r <= rng.bottomRow && r > -1 && r < rows.length; r++) {

                    // apply state to this row
                    rows[r]._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, collapsed, true);

                    // apply state to all rows in multi-row headers as well
                    let gr = rows[r];
                    if (gr instanceof _MultiGroupRow) {
                        let lastRow = gr._getLastRowInHeader();
                        for (r = r + 1; r <= lastRow.index; r++) {
                            gr = rows[r];
                            gr._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, collapsed, true);
                        }
                        r--;
                    }

                    // if this is a group, skip range to preserve the original state
                    if (gr instanceof wijmo.grid.GroupRow && gr.isCollapsed) {
                        r = gr.getCellRange().bottomRow;
                    }
                }
            });
        });

        // fire GroupCollapsedChanged
        g.onGroupCollapsedChanged(e);
    }


    // gets the last row in a multi-row group header
    private _getLastRowInHeader(): _MultiGroupRow {
        let grid = this.grid as MultiRow,
            row = this as _MultiGroupRow;
        if (grid && grid.multiRowGroupHeaders) {
            let rows = grid.rows,
                group = this.dataItem;
            for (let r = this.index + 1; r < rows.length && rows[r].dataItem == group; r++) {
                row = rows[r] as _MultiGroupRow;
            }
        }
        wijmo.assert(row instanceof _MultiGroupRow, 'last row in header should be a _MultiRowGroup');
        return row;
    }

}
    }
    


    module wijmo.grid.multirow {
    



'use strict';

/**
 * Extends the {@link ObservableArray} class to track layout changes.
 */
export class MultiRowCellCollection<T extends MultiRowCell> extends wijmo.collections.ObservableArray<T> {
    private _layout: _MultiRowLayout;

    /*internal*/ _setLayout(layout: _MultiRowLayout) {
        this._layout = layout;
        this.forEach(cell => cell._setLayout(layout))
    }

    /**
     * Tracks layout changes.
     */
    onCollectionChanged(e = wijmo.collections.NotifyCollectionChangedEventArgs.reset) {
        const layout = this._layout;
        if (layout) {
            layout._onLayoutChanged();
        }
        super.onCollectionChanged(e);
    }
}
    }
    


    module wijmo.grid.multirow {
    






'use strict';

/**
 * Class that parses {@link MultiRow} layout definitions.
 */
export class _MultiRowLayout {
    // indicates whether layout calculation is complete and
    // layout is ready for tracking changes
    private _initialized = false;
    private _disposed = false;
    private _multiRowGroupHeaderRange: wijmo.grid.CellRange;

    _grid: MultiRow;
    _rowsPerItem = 1;
    _bindingGroups: MultiRowCellCollection<MultiRowCellGroup>;
    _groupsByColumn: any = {};
    _changeCallback: () => void;

    /**
     * Initializes a new instance of the {@link _LayoutDef} class.
     *
     * @param grid {@link MultiRow} that owns this layout.
     * @param layoutDef Array that contains the layout definition.
     * @param changeCallback Callback invoked when layout changes.
     */
    constructor(grid: MultiRow, layoutDef: any[], changeCallback: () => void) {
        this._grid = grid;
        this._changeCallback = changeCallback;
        this._bindingGroups = this._parseCellGroups(layoutDef);
        this._initialized = true;
    }

    // implementation

    /*internal*/ _dispose() {
        if (this._disposed) {
            return;
        }

        // mark layout as disposed
        this._disposed = true;

        // release this layout
        const columns = this._bindingGroups;
        columns.forEach((g: MultiRowCellGroup) => {
            g.cells._setLayout(null);
        })
        columns._setLayout(null);

        // reseale resources
        this._bindingGroups = null;
    }

    /*internal*/ _onLayoutChanged() {
        if (!this._initialized || this._disposed) {
            return;
        }

        if (this._changeCallback) {
            this._changeCallback();
        }
    }

    // parse an array of JavaScript objects into an array of MultiRowCellGroup objects
    private _parseCellGroups(groups: any[]): MultiRowCellCollection<MultiRowCellGroup> {
        let g = this._grid,
            columns: MultiRowCellCollection<MultiRowCellGroup> = null,
            rowsPerItem = 1;
        if (groups) {

            if (groups instanceof MultiRowCellCollection) {
                // ensure that array items are all of the MultiRowCellGroup type
                groups.forEach(item => {
                    wijmo.assert(item instanceof MultiRowCellGroup, 'groups contain items of invalid type');
                });
                columns = groups;
            } else {
                columns = new MultiRowCellCollection<MultiRowCellGroup>();
                for (let i = 0; i < groups.length; i++) {
                    let group: MultiRowCellGroup = null;
                    if (groups[i] instanceof MultiRowCellGroup) {
                        group = groups[i];
                    } else {
                        group = new MultiRowCellGroup(groups[i]);
                    }
                    columns.push(group);
                }
            }

            // open binding groups (basic calculations)
            columns.forEach((group: MultiRowCellGroup) => {
                group.openGroup();
            });

            // calculate groups's colstart and layout's rowsPerItem
            for (let i = 0, colStart = 0; i < columns.length; i++) {
                let group = columns[i] as MultiRowCellGroup;
                group._colstart = colStart;
                colStart += group._colspanEff;
                rowsPerItem = Math.max(rowsPerItem, group._rowspanEff);
            }

            // close binding groups (calculate group's rowspan, ranges, and bindings)
            columns.forEach((group: MultiRowCellGroup) => {
                group.closeGroup(g, rowsPerItem);
            });

            this._rowsPerItem = rowsPerItem;

        } else {
            columns = new MultiRowCellCollection<MultiRowCellGroup>();
        }
        this._multiRowGroupHeaderRange = this._getMultiRowGroupHeaderRange(columns);

        // set this layout after calculations complete
        columns.forEach((g: MultiRowCellGroup) => {
            g.cells._setLayout(this);
        })
        columns._setLayout(this);

        // all done
        return columns;
    }


    // calculate a merged range for multirow group headers
    private _getMultiRowGroupHeaderRange(groups: MultiRowCellCollection<MultiRowCellGroup>): wijmo.grid.CellRange {
        const rpi = this._rowsPerItem;
        const rng = new wijmo.grid.CellRange(0, 0, rpi - 1, 0);

        // expand right to aggregates and equal cell edges
        for (let gi = 0; gi < groups.length; gi++) {
            const group = groups[gi];

            // if no aggregates, expand to current group
            if (!group._hasAggregates) {                
                rng.col2 = group._colstart + group._colspanEff - 1;
                continue;
            }

            // there are aggregates
            
            // expand to the aggregate for the 1st group
            if (gi === 0) {
                this._expandMultiRowGroupHeaderToAggregate(rng, group);
            }

            // expanded to the aggregate
            return rng;
        }

        // expanded to all groups
        return rng;
    }

    // expand right in the given group to the 1st aggregate
    // starting from aggregates, expand to the 1st column with equal edge
    private _expandMultiRowGroupHeaderToAggregate(rng: wijmo.grid.CellRange, group: MultiRowCellGroup): void {
        const rpi = this._rowsPerItem;

        // find 1st column with aggregate cell
        const colstop = group._colspanEff;
        const colstart = group.cells
            .filter(c => c.col > 0 && c.aggregate != 0) // columns with aggregates except the 1st one
            .map(c => c.col)
            .reduce((p, c) => (c < p) ? c : p, colstop);

        // expand to the aggregate
        rng.col2 = Math.max(group._colstart + colstart - 1, rng.col2);

        // find column with equal edges over rows
        for (let c = colstart; c < colstop; c++) {
            let hasEqualEdge = true;
            for (let r = 0; r < rpi; r++) {
                const cellrng = group._getCellRange(r, c);
                hasEqualEdge = hasEqualEdge && (cellrng.col === c);
            }
            if (hasEqualEdge) { // equal edge found
                rng.col2 = Math.max(group._colstart + c - 1, rng.col2);
                return;
            }
        }

        // don't not expand anymore
    }

    // calculate a merged range for conventional single-row group headers
    private _getSingleRowGroupHeaderRange(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.CellRange {
        const groups = this._bindingGroups;
        if (groups.length === 0) {
            return null;
        }

        // set range from current cell
        let gr = this._getGroupByColumn(c) as MultiRowCellGroup;
        wijmo.assert(gr != null, 'Failed to get the group!');

        const rs = 0; // use 1st row in single-row group headers
        let cellrng = gr._getCellRange(rs, c - gr._colstart);
        const rng = new wijmo.grid.CellRange(r, gr._colstart + cellrng.col, r, gr._colstart + cellrng.col2);

        let bCol = gr.getBindingColumn(p, r, c);
        if (bCol.aggregate != 0) {
            return rng;
        }

        // expand left to aggregates
        const grmin = groups[0];
        const colmin = grmin._colstart;
        for (let i = c - 1; i >= colmin; i--) {
            const gr = this._getGroupByColumn(i) as MultiRowCellGroup;
            wijmo.assert(gr != null, 'Failed to get the group!');

            const bCol = gr.getBindingColumn(p, r, i);
            if (bCol.aggregate != 0) {
                break;
            }

            cellrng = gr._getCellRange(rs, i - gr._colstart);
            rng.col = gr._colstart + cellrng.col;
        }

        // expand right to aggregates
        const grmax = groups[groups.length - 1];
        const colmax = grmax._colstart + grmax._colspanEff;
        for (let i = c + 1; i < colmax; i++) {
            const gr = this._getGroupByColumn(i) as MultiRowCellGroup;
            wijmo.assert(gr != null, 'Failed to get the group!');

            const bCol = gr.getBindingColumn(p, r, i);
            if (bCol.aggregate != 0) {
                break;
            }

            cellrng = gr._getCellRange(rs, i - gr._colstart);
            rng.col2 = gr._colstart + cellrng.col2;
        }

        return rng;
    }

    // gets a merged range for group headers
    _getGroupHeaderMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, multiRowGroupHeaders: boolean): wijmo.grid.CellRange {
        if (multiRowGroupHeaders) {
            const rng = this._multiRowGroupHeaderRange;
            if (rng.containsColumn(c)) {
                const rpi = this._rowsPerItem,
                    rs = Math.floor(r / rpi) * rpi; // TFS 404267
                return new wijmo.grid.CellRange(rs + rng.row, rng.col, rs + rng.row2, rng.col2); 
            }
            
            const group = this._getGroupByColumn(c);
            wijmo.assert(group instanceof MultiRowCellGroup, 'Failed to get the group!');

            return group.getMergedRange(p, r, c);
        } else {
            return this._getSingleRowGroupHeaderRange(p, r, c);
        }
    }

    // get the group that owns a given column
    _getGroupByColumn(c: number) {

        // get from cache
        let group = this._groupsByColumn[c];

        // not in cache yet, find it now
        if (!group) {
            let groups = this._bindingGroups;
            for (let i = 0; i < groups.length; i++) {
                group = groups[i];
                if (c >= group._colstart && c <= group._colstart + group._colspanEff - 1) {
                    this._groupsByColumn[c] = group; // found it!
                    break;
                }
            }
        }
        return group;
    }

    // update missing cell types to match data
    _updateCellTypes(item: any) {
        this._bindingGroups.forEach((group: MultiRowCellGroup) => {
            group._cols.forEach(col => {
                if (col.dataType == null && col._binding) {
                    col.dataType = wijmo.getType(col._binding.getValue(item));
                }
                if (!col.isReadOnly) {
                    let pd = wijmo.isIE() ? null : Object.getOwnPropertyDescriptor(item, col.binding);
                    col.isReadOnly = pd && !pd.writable && !pd.set;
                }
            });
        });
    }

}
    }
    


    module wijmo.grid.multirow {
    



'use strict';

/**
 * Extends the {@link Column} class with <b>colspan</b> property to
 * describe a cell in a {@link MultiRowCellGroup}.
 */
export class MultiRowCell extends wijmo.grid.Column {
    private _layout: _MultiRowLayout; // keep reference on owner layout
    
    private _row: number;
    private _col: number;
    // initial desired colspan value used to calculate final layout
    // may differ from effective colspan
    private _colspan: number;
    // initial desired rowspan value used to calculate final layout
    // may differ from effective rowspan
    private _rowspan: number;

    // current effective colspan value calculated during layout
    // interpretation, and used in final layout
    _colspanEff: number;

    // current effective rowspan value calculated during layout
    // interpretation, and used in final layout
    _rowspanEff: number;

    /**
     * Initializes a new instance of the {@link MultiRowCell} class.
     *
     * @param options JavaScript object containing initialization data for the {@link MultiRowCell}.
     */
    constructor(options?: any) {
        super();
        this._row = this._col = 0;
        this._rowspan = this._colspan = 1;
        wijmo.copy(this, options);
    }
    /**
     * Gets or sets the row index of this {@link MultiRowCell} within the cell group.
     */
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        const row = wijmo.asInt(value, false, true);

        if (this._row != row) {
            this._row = row;
            this._onLayoutPropertyChanged();
        }
    }
    /**
     * Gets or sets the column index of this {@link MultiRowCell} within the cell group.
     */
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        const col = wijmo.asInt(value, false, true);

        if (this._col != col) {
            this._col = col;
            this._onLayoutPropertyChanged();
        }
    }
    /**
     * Gets or sets the number of physical columns spanned by the {@link MultiRowCell}.
     */
    get colspan(): number {
        return this._colspan;
    }
    set colspan(value: number) {
        const colspan = wijmo.asInt(value, false, true);
        wijmo.assert(colspan > 0, 'colspan must be >= 1');

        if (this._colspan != colspan) {
            this._colspan = colspan;
            this._onLayoutPropertyChanged();
        }
    }
    /**
     * Gets or sets the number of physical rows spanned by the {@link MultiRowCell}.
     */
    get rowspan(): number {
        return this._rowspan;
    }
    set rowspan(value: number) {
        const rowspan = wijmo.asInt(value, false, true);
        wijmo.assert(rowspan > 0, 'rowspan must be >= 1');

        if (this._rowspan != rowspan) {
            this._rowspan = rowspan;
            this._onLayoutPropertyChanged();
        }
    }

    /*internal*/ _setLayout(layout: _MultiRowLayout) {
        this._layout = layout;
    }

    protected _onLayoutPropertyChanged() {
        const layout = this._layout;
        if (layout) {
            layout._onLayoutChanged();
        }
    }
}
    }
    


    module wijmo.grid.multirow {
    







'use strict';

/**
 * Describes a group of cells that may span multiple rows and columns.
 */
export class MultiRowCellGroup extends MultiRowCell {
    private _isRowHeader = false;       // whether this group should be treated as a row header group (TFS 403496)
    _colstart = 0;                      // index of the column where this group starts
    private _cellsDef: any;             // cells definitions which is applied when openning the group
    private _cells: MultiRowCellCollection<MultiRowCell>;    // list of binding columns in this group
    _cols: wijmo.grid.ColumnCollection;            // array of columns to use for binding cells in this group
    _hasAggregates: boolean;    // whether the group contains at least one aggregate column
    private _rng: wijmo.grid.CellRange[];          // array of ranges with merge range offsets for cells in this group
    private _isParsed: boolean;

    /**
     * Initializes a new instance of the {@link MultiRowCellGroup} class.
     *
     * @param options JavaScript object containing initialization data for the new {@link MultiRowCellGroup}.
     */
    constructor(options?: any) {
        super();
        this._cells = new MultiRowCellCollection<MultiRowCell>();
        wijmo.copy(this, options);
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        if (key == 'cells') {
            // here only perform basic checks and remember this value
            // the parsing of this value is performed when openning the group
            if (wijmo.isArray(value)) {
                this._cellsDef = value;
            }
            return true;
        }
        return false;
    }

    // ** implementation

    // required for JSON-style initialization
    get cells(): MultiRowCellCollection<MultiRowCell> {
        return this._cells;
    }

    // gets or sets a value that determines whether this is a row header group (TFS 403496)
    get isRowHeader(): boolean {
        return this._isRowHeader;
    }
    set isRowHeader(value: boolean) {
        const isRowHeader = wijmo.asBoolean(value);

        if (this._isRowHeader != isRowHeader) {
            this._isRowHeader = isRowHeader;
            this._onLayoutPropertyChanged();
        }
    }

    // parse cells and perform calculations
    // must only be called after adding to the collection
    openGroup() {
        // parse cells
        if (!this._isParsed) {
            this._cells = this._parseCells(this._cellsDef);
            this._isParsed = true;
        }

        // perform calculations
        this._calculate();
    }

    // calculate merged ranges
    // must only be called after openning the group
    closeGroup(g: MultiRow, rowsPerItem: number) {
        // adjust rowspan to match longest group in the grid
        if (rowsPerItem > this._rowspanEff) {
            this._cells.forEach((cell: MultiRowCell) => {
                if (cell.row == this._rowspanEff - 1) {
                    cell._rowspanEff = rowsPerItem - cell.row;
                }
            });
            this._rowspanEff = rowsPerItem;
        }

        // make sure cells fill the group
        this._cells.forEach((cell: MultiRowCell) => {
            while (cell.col + cell._colspanEff < this._colspanEff &&
                !this._slotTaken(cell.row, cell.col + cell._colspanEff)) {
                cell._colspanEff++;
            }
        });
        this._cells.forEach((cell: MultiRowCell) => {
            while (cell.row + cell._rowspanEff < this._rowspanEff &&
                !this._slotTaken(cell.row + cell._rowspanEff, cell.col)) {
                cell._rowspanEff++;
            }
        });

        // if group is not empty,
        // make sure there are no empty slots (pathological cases)
        if (this._cells.length > 0) {
            for (let r = 0; r < this._rowspanEff; r++) {
                for (let c = 0; c < this._colspanEff; c++) {
                    wijmo.assert(this._slotTaken(r, c), 'Invalid layout (empty cells).');
                }
            }
        }

        // create arrays with binding columns and merge ranges for each cell
        this._cols = new wijmo.grid.ColumnCollection(g, g.columns.defaultSize);
        this._rng = new Array(rowsPerItem * this._colspanEff);
        this._cells.forEach((cell: MultiRowCell) => {
            for (let r = 0; r < cell._rowspanEff; r++) {
                for (let c = 0; c < cell._colspanEff; c++) {
                    let index = (cell.row + r) * this._colspanEff + cell.col + c;

                    // save binding column for this cell offset
                    this._cols.setAt(index, cell); // 'setAt' handles list ownership
                    //console.log('binding[' + index + '] = ' + cell.binding);

                    // save merge range for this cell offset
                    let rng = new wijmo.grid.CellRange(0 - r, 0 - c, 0 - r + cell._rowspanEff - 1, 0 - c + cell._colspanEff - 1);
                    if (!rng.isSingleCell) {
                        //console.log('rng[' + index + '] = ' + format('({row},{col})-({row2},{col2})', rng));
                        this._rng[index] = rng;
                    }
                }
            }
        });

        // add extra range for collapsed group headers
        let start = this._colstart;
        this._rng[-1] = new wijmo.grid.CellRange(0, start, 0, start + this._colspanEff - 1);

        // remember if the group has aggregates (so we can merge group header cells)
        this._hasAggregates = false;
        for (let i = 0; i < this._cells.length && !this._hasAggregates; i++) {
            this._hasAggregates = this._cells[i].aggregate != 0;
        }
    }

    // get the preferred column width for a column in the group
    getColumnWidth(c: number): any {
        for (let i = 0; i < this._cells.length; i++) {
            let cell = this._cells[i] as MultiRowCell;
            if (cell.col == c && cell._colspanEff == 1) {
                return cell.width;
            }
        }
        return null;
    }

    // get merged range for a cell in this group
    getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.CellRange {

        // column header, group
        if (r < 0) {
            return this._rng[-1];
        }

        // regular cell range
        let row = p.rows[r] as _MultiRow,
            rs = row.recordIndex != null ? row.recordIndex : r % this._rowspanEff,
            cs = c - this._colstart,
            rng = this._rng[rs * this._colspanEff + cs];

        // column header, non-group
        if (p.cellType == wijmo.grid.CellType.ColumnHeader) {
            r++;
        }

        // done
        return rng
            ? new wijmo.grid.CellRange(r + rng.row, c + rng.col, r + rng.row2, c + rng.col2)
            : null;
    }

    // get the binding column for a cell in this group
    getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.Column {

        // merged column header binding
        // return 'this' to render the collapsed column header
        if (r < 0) {
            return this;
        }

        // regular cells
        let row = p.rows[r] as _MultiRow,
            rs = (row && row.recordIndex != null) ? row.recordIndex : r % this._rowspanEff,
            cs = c - this._colstart;
        return this._cols[rs * this._colspanEff + cs];
    }

    // get the binding column by name/binding
    getColumn(name: string): wijmo.grid.Column {
        return this._cols.getColumn(name);
    }

    _getCellRange(r: number, c: number) {
        let rng = this._rng[r * this._colspanEff + c];
        return rng ? new wijmo.grid.CellRange(r + rng.row, c + rng.col, r + rng.row2, c + rng.col2) : new wijmo.grid.CellRange(r, c);
    }

    // parse an array of JavaScript objects into an array of MultiRowCell objects
    private _parseCells(cells: any): MultiRowCellCollection<MultiRowCell> {   
        let columns: MultiRowCellCollection<MultiRowCell> = this._cells;

        if (cells) {
            if (cells instanceof MultiRowCellCollection) {
                // ensure that array items are all of the MultiRowCell type
                cells.forEach(item => {
                    wijmo.assert(item instanceof MultiRowCell, 'cells contain items of invalid type');
                });
                columns = cells;
            } else {
                cells.forEach(item => {
                    let cell: MultiRowCell = null;
                    if (item instanceof MultiRowCell) {
                        cell = item;
                    } else {
                        cell = new MultiRowCell(item);
                    }
                    columns.push(cell);
                });
            }

            columns.forEach((cell: MultiRowCell) => {
                if (cell.binding && !cell.header) {
                    cell.header = wijmo.toHeaderCase(cell.binding);
                }
            });
        }

        // all done
        return columns;
    }

    // resets calculated properties to default values
    private _clearCalculations() {
        this._colstart = 0;
        this._cols = null;
        this._hasAggregates = false;
        this._rng = null;
        this.row = 0;
        this.col = 0;
        this._colspanEff = 0;
        this._rowspanEff = 0;
        this._cells.forEach((cell: MultiRowCell) => {
            cell.row = 0;
            cell.col = 0;
            cell._colspanEff = 0;
            cell._rowspanEff = 0;
        });   
    }

    private _calculate() {
        // clear existing calculations
        this._clearCalculations();

        // initialize calculated properties
        this._colspanEff = this.colspan;
        this._rowspanEff = this.rowspan;
        this._cells.forEach((cell: MultiRowCell) => {
            this._colspanEff = Math.max(this._colspanEff, cell.colspan);
            cell._colspanEff = cell.colspan;
            cell._rowspanEff = cell.rowspan;
        });

        // position cells within the group
        let r = 0,
            c = 0;
        this._cells.forEach((cell: MultiRowCell, index: number) => {
            while (!this._cellFits(cell, index, r, c)) { // find a free slot
                c = (c + 1) % this._colspanEff;
                if (c == 0) r++;
            }
            cell.row = r;
            cell.col = c;
        });

        // set group's row/col span
        let rs = 1,
            cs = 1;
        this._cells.forEach((cell: MultiRowCell) => {
            rs = Math.max(rs, cell.row + cell._rowspanEff);
            cs = Math.max(cs, cell.col + cell._colspanEff);
        });
        this._rowspanEff = rs;
        this._colspanEff = cs;
    }

    // checks whether a cell fits in a given slot (adjusts colspan if needed)
    private _cellFits(cell: MultiRowCell, index: number, r: number, c: number): boolean {

        // too wide?
        if (c > 0 && c + cell._colspanEff > this._colspanEff) {
            return false;
        }

        // slot taken?
        for (let i = 0; i < cell._colspanEff; i++) {
            if (this._slotTaken(r, c + i, index)) {
                return false;
            }
        }

        // adjust group colspan
        this._colspanEff = Math.max(this._colspanEff, c + cell._colspanEff - 1);

        // seems to fit
        return true;
    }

    // checks whether a given row/col slot within the panel is currently in use
    private _slotTaken(r: number, c: number, index = this._cells.length): boolean {
        for (let i = 0; i < index; i++) {
            let cell = this._cells[i] as MultiRowCell;
            if (r >= cell.row && r <= cell.row + cell._rowspanEff - 1) {
                if (c >= cell.col && c <= cell.col + cell._colspanEff - 1) {
                    return true;
                }
            }
        }
        return false;
    }
}

    }
    


    module wijmo.grid.multirow {
    











'use strict';

/**
 * Extends the {@link FlexGrid} control to provide multiple rows per item.
 *
 * Use the {@link layoutDefinition} property to define the layout of the 
 * rows used to display each data item.
 *
 * A few {@link FlexGrid} properties are disabled in the {@link MultiRow} 
 * control because they would interfere with the custom multi-row layouts.
 * The list of disabled properties includes the following:
 * 
 * {@link FlexGrid.allowMerging}, {@link FlexGrid.mergeManager},
 * {@link FlexGrid.autoGenerateColumns}, {@link FlexGrid.columnGroups},
 * {@link FlexGrid.allowDragging}, {@link FlexGrid.allowPinning},
 * {@link FlexGrid.childItemsPath}, {@link FlexGridDetailProvider}, and
 * {@link Column.visible}.
 * 
 * Note also that cells in the {@link FlexGrid.columnFooters} panel
 * do not follow the multi-row layout. That is because those cells
 * belong to rows that are not created by the grid itself, but by
 * custom code.
 */
export class MultiRow extends wijmo.grid.FlexGrid {
    _layoutDef: any[];
    _layout: _MultiRowLayout;
    _hdrLayoutDef: any[] = null;
    _hdrLayout: _MultiRowLayout;
    _centerVert = true;
    _collapsedHeaders = false;
    _multiRowGroupHeaders = false;
    _collapsedHeadersWasNull: boolean;
    _btnCollapse: HTMLElement;
    _rowHdrCnt = 0; // TFS 441883

    /**
     * Initializes a new instance of the {@link MultiRow} class.
     * 
     * In most cases, the **options** parameter will include the value for the
     * {@link layoutDefinition} property.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // start with empty layout
        this._layoutDef = new MultiRowCellCollection<MultiRowCellGroup>();
        this._layout = new _MultiRowLayout(this, this._layoutDef, () => this._onLayoutChanged());

        // add class name to enable styling
        wijmo.addClass(this.hostElement, 'wj-multirow');

        // add header collapse/expand button
        let hdr = this.columnHeaders.hostElement.parentElement,
            btn = wijmo.createElement('<div class="wj-hdr-collapse"><span></span></div>');
        btn.style.display = 'none';
        hdr.appendChild(btn);
        this._btnCollapse = btn;
        this._updateButtonGlyph();

        // handle mousedown on collapse/expand button (not click: TFS 190572)
        this.addEventListener(btn, 'mousedown', (e: MouseEvent) => {

            // simple toggle is not enough: TFS 301796
            //this.collapsedHeaders = !this.collapsedHeaders;

            // false: toggles between true and false; 
            // null: toggles between true and null
            switch (this.collapsedHeaders) {
                case null:
                case false:
                    this._collapsedHeadersWasNull = this.collapsedHeaders == null;
                    this.collapsedHeaders = true;
                    break;
                case true:
                    this.collapsedHeaders = this._collapsedHeadersWasNull ? null : false;
                    break;
            }
            e.preventDefault();
            this.focus();
        }, true);

        // click on top-left row headers to select the whole grid
        let host = this.hostElement;
        this.addEventListener(host, 'mousedown', (e) => {
            if (!this._mouseHdl._szRowCol) { // allow resizing
                let groups = this._layout ? this._layout._bindingGroups : null;
                let group = groups && groups.length ? groups[0] as MultiRowCellGroup : null;
                if (group && group.isRowHeader) {
                    let ht = this.hitTest(e);
                    if (ht.panel == this.columnHeaders && ht.col < this.frozenColumns) {
                        e.preventDefault();
                        this.selectAll();
                    }
                }
            }
        }, true);

        // can't drag/drop rows/columns on MultiRow
        // but can drag columns into GroupPanel
        ['dragover', 'dragleave', 'dragdrop'].forEach(evt => {
            this.removeEventListener(host, evt);
        });

        // custom AddNewHandler
        this._addHdl = new _MultiRowAddNewHandler(this);

        // custom cell rendering
        this.formatItem.addHandler(this._formatItem, this);

        // change some defaults
        this.autoGenerateColumns = false;
        this.allowDragging = wijmo.grid.AllowDragging.None;
        this.mergeManager = new _MergeManager();

        // apply options after everything else is ready
        this.initialize(options);
    }
    _getProductInfo(): string {
        return 'H87K,MultiRow';
    }

    /**
     * Gets or sets an array that defines the layout of the rows used to display each data item.
     *
     * The array contains a list of cell group objects which have the following properties:
     *
     * <ul>
     * <li><b>header</b>: Group header (shown when the headers are collapsed).</li>
     * <li><b>isRowHeader</b>: Whether cells in this group should be displayed and
     * treated as row header cells.</li>
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
     * When all groups are ready, the grid calculates the number of rows per record to the maximum 
     * **rowspan** of all groups, and adds rows to each group to pad their height as needed.
     *
     * This scheme is simple and flexible. For example:
     * ```
     * { header: 'Group 1', cells: [{ binding: 'c1' }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * The group has **colspan** 1, so there will be one cell per column. The result is:
     * ```
     * | C1 |
     * | C2 |
     * | C3 |
     * ```
     *
     * To create a group with two columns, set the **colspan** property of the group:
     * ```
     * { header: 'Group 1', colspan: 2, cells:[{ binding: 'c1' }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * The cells will wrap as follows:
     * ```
     * | C1 | C2 |
     * | C3      |
     * ```
     *
     * Note that the last cell spans two columns (to fill the group).
     *
     * You can also specify the **colspan** on individual cells rather than on the group:
     * ```
     * { header: 'Group 1', cells: [{binding: 'c1', colspan: 2 }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * Now the first cell has **colspan** 2, so the result is:
     * ```
     * | C1      |
     * | C2 | C3 |
     * ```
     * 
     * You can also make cells extend vertically using the cell's **rowspan** property:
     * ```
     * { header: 'Group 1', cells: [{binding: 'c1', rowspan: 2 }, { binding: 'c2'}, { binding: 'c3' }]}
     * ```
     *
     * Now the first cell has **rowspan** 2, so the result is:
     * ```
     * | C1 | C2 |
     * |    | C3 |
     * ```
     * 
     * Because cells extend the {@link Column} class, you can add all the usual {@link Column} 
     * properties to any cells:
     * ```
     * { header: 'Group 1', cells: [
     *    { binding: 'c1', colspan: 2 },
     *    { binding: 'c2'},
     *    { binding: 'c3', format: 'n0', required: false, etc... } 
     * ]}
     * ```
     * 
     * The **isRowHeader** property of the cell groups allows you to create groups 
     * to be displayed as row header cells. This is done using frozen columns, so even
     * though the row headers are regular cells, they look and behave like header cells.
     * 
     * Setting the **isRowHeader** property to true automatically sets the cell's
     * **isReadOnly** property to true (headers cannot be edited), adds a 'wj-header'
     * style to the cell's **cssClass** property (so the cells are styled as headers), 
     * and sets the cell's **cellTemplate** property to its **header** value
     * (so the cell shows the header as an unbound string). You may choose to set the
     * cell's **binding** property instead of **header** if you want to show
     * bound values in the row header cells.
     */
    get layoutDefinition(): any[] {
        return this._layoutDef;
    }
    set layoutDefinition(value: any[]) {

        // finish editing first (TFS 467612)
        if (!this.finishEditing()) { // finish and commit edits
            this.finishEditing(true); // failed? finish and cancel edits
        }

        // store original value so user can get it back
        this._layoutDef = wijmo.asArray(value);

        // dispose existing layout
        if (this._layout) {
            this._layout._dispose();
            this._layout = null;
        }

        // parse cell layout
        this._layout = new _MultiRowLayout(this, value, () => this._onLayoutChanged());
        this._rowHdrCnt = 0;

        // update number of frozen columns and their styles 
        // to account for row header groups (TFS 403496)
        if (this._layout) {
            let groups = this._layout._bindingGroups;
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i] as MultiRowCellGroup;

                // allow one or more continuous row header groups
                if (!group.isRowHeader) {
                    break;
                }

                // update number of frozen columns
                this._rowHdrCnt = group._colstart + group._colspanEff;

                // configure row header cells
                group.cells.forEach(cell => {
                    let hdrClass = 'wj-header';

                    // header cells are read-only
                    cell.isReadOnly = true;

                    // use cellTemplate to show header
                    if (cell.header && !cell.binding && !cell.cellTemplate) {
                        cell.cellTemplate = cell.header;
                    }

                    // header cells have header style
                    if (!cell.cssClass) {
                        cell.cssClass = hdrClass;
                    } else if (cell.cssClass.indexOf(hdrClass) < 0) {
                        cell.cssClass += ' ' + hdrClass;
                    }
                });
            }
        }

        // freeze row header columns if required
        if (this._rowHdrCnt) { // TFS 465085
            this.frozenColumns = this._rowHdrCnt;
        }

        // bind/re-bind grid
        this._bindGrid(true);

        // exclude row header cells from selection
        if (this._rowHdrCnt && this.selectionMode) {
            this.select(this.selection.row, this._rowHdrCnt);
        }
    }
    /**
     * Gets or sets an array that defines the layout of the rows used to display
     * the grid's column headers.
     *
     * The array contains a list of cell group objects similar to those used with
     * the {@link layoutDefinition} property.
     * 
     * The default value for this property is **null**, which causes the grid to
     * use the {@link layoutDefinition} property to create the column headers.
     */
    get headerLayoutDefinition(): any[] | null {
        return this._hdrLayoutDef;
    }
    set headerLayoutDefinition(value: any[] | null) {

        // store original value so user can get it back
        this._hdrLayoutDef = wijmo.asArray(value);

        // dispose existing layout
        if (this._hdrLayout) {
            this._hdrLayout._dispose();
            this._hdrLayout = null;
        }

        // parse cell bindings
        let layout: _MultiRowLayout = null;
        if (value) {
            layout = new _MultiRowLayout(this, value, () => this._onHeaderLayoutChanged());
        }
        this._hdrLayout = layout;

        // go bind/rebind the grid
        this._bindGrid(true);
    }
    /**
     * Gets the number of rows used to display each item.
     *
     * This value is calculated automatically based on the value
     * of the **layoutDefinition** property.
     */
    get rowsPerItem(): number {
        return this._layout._rowsPerItem;
    }
    /**
     * Gets the {@link Column} object used to bind a data item to a grid cell.
     *
     * @param p {@link GridPanel} that contains the cell.
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     */
    getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.Column {
        return this._getBindingColumn(p, r, p.columns[c]);
    }
    /**
     * Gets a column by name or by binding.
     *
     * The method searches the column by name. If a column with the given name 
     * is not found, it searches by binding. The searches are case-sensitive.
     *
     * @param name The name or binding to find.
     * @param header Whether to search column defined for header.
     * @return The column with the specified name or binding, or null if not found.
     */
    getColumn(name: string, header?: boolean): wijmo.grid.Column {
        if (wijmo.isString(name)) { // search by name/binding (TFS 362720)
            let isHeaderLayout = header && this._hdrLayout,
                layout = isHeaderLayout ? this._hdrLayout : this._layout,
                groups: any[] = layout._bindingGroups,
                col = null;
            for (let i = 0; i < groups.length && !col; i++) {
                col = groups[i].getColumn(name);
            }
            // use "_layout" if no column found
            // (similar to "_getGroupByColumn" method)
            if (!col && isHeaderLayout) {
                return this.getColumn(name, false);
            }
            return col;
        }
        return super.getColumn(name); // search by index (bad idea...)
    }
    /**
     * Gets or sets a value that determines whether the content of cells
     * that span multiple rows should be vertically centered.
     * 
     * The default value for this property is **true**.
     */
    get centerHeadersVertically(): boolean {
        return this._centerVert;
    }
    set centerHeadersVertically(value: boolean) {
        if (value != this._centerVert) {
            this._centerVert = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether column headers
     * should be collapsed and displayed as a single row containing 
     * the group headers.
     *
     * If you set the {@link collapsedHeaders} property to **true**,
     * remember to set the **header** property of every group in
     * order to avoid empty header cells.
     *
     * Setting the {@link collapsedHeaders} property to **null** causes
     * the grid to show all header information (groups and columns).
     * In this case, the first row will show the group headers and the
     * remaining rows will show the individual column headers.
     * 
     * The default value for this property is **false**.
     */
    get collapsedHeaders(): boolean | null {
        return this._collapsedHeaders;
    }
    set collapsedHeaders(value: boolean | null) {
        if (value != this._collapsedHeaders) {
            let e = new wijmo.CancelEventArgs();
            if (this.onCollapsedHeadersChanging(e)) {
                this._collapsedHeaders = wijmo.asBoolean(value, true); // null means 'expand all'
                this._updateCollapsedHeaders();
                this._updateButtonGlyph();
                this.onCollapsedHeadersChanged(e);
            }
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should display
     * a button in the column header panel to allow users to collapse and
     * expand the column headers.
     *
     * If the button is visible, clicking on it will cause the grid to 
     * toggle the value of the **collapsedHeaders** property.
     * 
     * The default value for this property is **false**.
     */
    get showHeaderCollapseButton(): boolean {
        return this._btnCollapse.style.display == '';
    }
    set showHeaderCollapseButton(value: boolean) {
        if (value != this.showHeaderCollapseButton) {
            this._btnCollapse.style.display = wijmo.asBoolean(value) ? '' : 'none';
        }
    }
    /**
     * Gets or sets a value that determines whether group headers should
     * have multiple rows instead of a single header row.
     * 
     * This property is useful when you want to display aggregate values
     * in the group headers (see the {@link Column.aggregate} property).
     * 
     * The default value for this property is **false**.
     */
    get multiRowGroupHeaders(): boolean {
        return this._multiRowGroupHeaders;
    }
    set multiRowGroupHeaders(value: boolean) {
        if (value != this._multiRowGroupHeaders) {
            this._multiRowGroupHeaders = wijmo.asBoolean(value);
            this._bindGrid(true);
        }
    }

    /**
     * Occurs after the value of the {@link collapsedHeaders} property changes.
     */
    readonly collapsedHeadersChanging = new wijmo.Event<MultiRow, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link collapsedHeadersChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onCollapsedHeadersChanging(e: wijmo.CancelEventArgs): boolean {
        this.collapsedHeadersChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the value of the {@link collapsedHeaders} property has changed.
     */
    readonly collapsedHeadersChanged = new wijmo.Event<MultiRow, wijmo.EventArgs>();
    /**
     * Raises the {@link collapsedHeadersChanged} event.
     */
    onCollapsedHeadersChanged(e?: wijmo.EventArgs): void {
        this.collapsedHeadersChanged.raise(this, e);
    }

    // ** overrides

    // MultiRow does not support pinning
    get allowPinning(): boolean {
        return false;
    }
    set allowPinning(value: boolean) {
        wijmo.assert(!value, 'MultiRow does not support pinning.');
    }

    // select multi-row items when clicking the row headers
    onSelectionChanging(e: wijmo.grid.CellRangeEventArgs): boolean {
        let sel = e._rng; // not cloning
        if (sel && sel.isValid && this.selectionMode) {
            let ht = this._mouseHdl._htDown,
                rows = this.rows,
                cols = this.columns,
                rowHdrCnt = this._rowHdrCnt;

            // do not select frozen cells
            if (rowHdrCnt) {
                sel.col = Math.max(sel.col, rowHdrCnt);
                sel.col2 = Math.max(sel.col2, rowHdrCnt);
            }
            
            // handle row header selection
            if (ht) {
                if (ht.panel == this.rowHeaders || (ht.panel == this.cells && ht.col < rowHdrCnt)) {
                    let topRow = rows[sel.topRow] as _MultiRow,
                        botRow = rows[sel.bottomRow] as _MultiRow;
                    if (topRow && topRow.recordIndex != null) {
                        let top = topRow.index - topRow.recordIndex,
                            rpi = (botRow instanceof _MultiGroupRow && !this._multiRowGroupHeaders) ? 1 : this.rowsPerItem,
                            bot = botRow.index - botRow.recordIndex + rpi - 1, // TFS 413335
                            cnt = cols.length - 1;
                        let rng = sel.row != sel.topRow
                            ? new wijmo.grid.CellRange(bot, 0, top, cnt)
                            : new wijmo.grid.CellRange(top, 0, bot, cnt);
                        sel.row = rng.row;
                        sel.row2 = rng.row2;
                        sel.col2 = cnt;
                        switch (this.selectionMode) {
                            case wijmo.grid.SelectionMode.Cell:
                                sel.row2 = rng.row;
                                sel.col2 = rng.col;
                                break;
                            case wijmo.grid.SelectionMode.Row:
                                sel.row2 = rng.row;
                                break;
                        }
                    }
                }
            }
        }

        // allow base class
        return super.onSelectionChanging(e);
    }

    // handle row header groups when deleting rows (TFS 431802)
    /*protected*/ _getDeleteColumnIndex(): number {
        return this._rowHdrCnt;
    }

    // use quick auto size if there aren't any external item formatters
    /*protected*/ _getQuickAutoSize() {
        return wijmo.isBoolean(this.quickAutoSize)
            ? this.quickAutoSize
            : this.formatItem.handlerCount <= 1 && this.itemFormatter == null;
    }

    // bind rows
    /*protected*/ _addBoundRow(items: any[], index: number) {
        let item = items[index];
        for (let i = 0; i < this.rowsPerItem; i++) {
            this.rows.push(new _MultiRow(item, index, i));
        }
    }
    /*protected*/ _addNode(items: any[], index: number, level: number) {
        this._addBoundRow(items, index); // childItemsPath not supported
    }
    /*protected*/ _addGroupRow(group: wijmo.collections.CollectionViewGroup) {
        let cnt = this._multiRowGroupHeaders ? this.rowsPerItem : 1;
        for (let i = 0; i < cnt; i++) {
            this.rows.push(new _MultiGroupRow(group, i));
        }
    }

    // bind columns
    /*protected*/ _bindColumns() {

        // update column header row count
        let rows = this.columnHeaders.rows,
            layout = this._layout,
            hdrLayout = this._hdrLayout,
            rowsPerItem = hdrLayout ? hdrLayout._rowsPerItem : this.rowsPerItem,
            cnt = rowsPerItem + 1;
        while (rows.length > cnt) {
            rows.removeAt(rows.length - 1);
        }
        while (rows.length < cnt) {
            rows.push(new wijmo.grid.Row());
        }

        // update column header visibility
        this._updateCollapsedHeaders();

        // remove old columns
        this.columns.clear();

        // generate columns
        if (layout) {

            // column properties to copy from binding column to real column
            let colProps = 'width,minWidth,maxWidth,binding,header,format,dataMap,name,aggregate,cellTemplate'.split(',');

            // scan all binding groups
            layout._bindingGroups.forEach((group: MultiRowCellGroup) => {
                for (let c = 0; c < group._colspanEff; c++) {
                    if (group.cells.length === 0) {
                        continue;
                    }

                    // create a real column for this group
                    let col = new wijmo.grid.Column();

                    // set real column's width, binding, etc based on first cell (binding column)
                    // that has the same column index and has those properties set
                    // also set minWidth and maxWidth (TFS 373681)
                    for (let cellIndex = 0; cellIndex < group.cells.length; cellIndex++) {
                        let cell = group.cells[cellIndex] as MultiRowCell;
                        if (cell.col == c) {
                            colProps.forEach(prop => {
                                if (cell[prop] != null && cell[prop] != col[prop]) { // TFS 379860, 470132
                                    col[prop] = cell[prop];
                                }
                            });
                        }
                    }

                    // add column to grid
                    this.columns.push(col);
                }
            });
        }
    }

    // set row visibility to match headerCollapsed
    _updateCollapsedHeaders() {
        let rows = this.columnHeaders.rows,
            ch = this.collapsedHeaders;
        rows[0].visible = ch != false; // first row: true or null
        for (let i = 1; i < rows.length; i++) {
            rows[i].visible = ch != true; // other rows: false or null
        }
    }

    // update missing column types to match data
    /*protected*/ _updateColumnTypes() {

        // allow base class
        super._updateColumnTypes();

        // update missing column types in all binding groups
        let view = this.collectionView;
        if (wijmo.hasItems(view)) {
            let item = view.items[0];
            if (this._layout) {
                this._layout._updateCellTypes(item);
            }
            if (this._hdrLayout) {
                this._hdrLayout._updateCellTypes(item);
            }
        }
    }

    // get the binding column 
    // (in the MultiRow grid, each physical column may contain several binding columns)
    /*protected*/ _getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: wijmo.grid.Column): wijmo.grid.Column {
       
        // convert column to binding column (cell)
        if (c && (p == this.cells || p == this.columnHeaders)) { // WJM-20646
            let hdr = p.cellType == wijmo.grid.CellType.ColumnHeader,
                group = this._getGroupByColumn(c.index, hdr);
            if (hdr) {
                r--; // discount group header row (always the first)
            }
            c = group.getBindingColumn(p, r, c.index);
        }

        // done
        return c;
    }

    // get all the binding columns (used for searching)
    /*protected*/_getBindingColumns(): wijmo.grid.Column[] {
        let cols = [];
        this._layout._bindingGroups.forEach((group: MultiRowCellGroup) => {
            group._cols.forEach(col => {
                if (cols.indexOf(col) < 0) {
                    cols.push(col);
                }
            });
        });
        return cols;
    }

    // get the number of rows used to display each item
    /*protected*/ _getRowsPerItem(): number {
        return this.rowsPerItem;
    }

    // update grid rows to sync with data source
    /*protected*/ _cvCollectionChanged(sender, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (this.autoGenerateColumns && this.columns.length == 0) {
            this._bindGrid(true);
        } else {
            let action = wijmo.collections.NotifyCollectionChangedAction;
            switch (e.action) {

                // item changes don't require re-binding
                case action.Change:
                    this.invalidate();
                    break;

                // always add at the bottom (TFS 193086)
                case action.Add:
                    if (e.index == this.collectionView.items.length - 1) {
                        let index = this.rows.length;
                        while (index > 0 && this.rows[index - 1] instanceof wijmo.grid._NewRowTemplate) {
                            index--;
                        }
                        for (let i = 0; i < this.rowsPerItem; i++) {
                            this.rows.insert(index + i, new _MultiRow(e.item, e.index, i));
                        }
                        return;
                    }
                    wijmo.assert(false, 'added item should be the last one.');
                    break;

                // remove/refresh require re-binding
                default:
                    this._bindGrid(false);
                    break;
            }
        }
    }

    // ** implementation

    // get the MultiRowCellGroup (cell or column header) for a given column index
    /*internal*/ _getGroupByColumn(c: number, hdr: boolean): MultiRowCellGroup {
        let group: MultiRowCellGroup = null;
        if (hdr && this._hdrLayout && !this.collapsedHeaders) {
            group = this._hdrLayout._getGroupByColumn(c);
        }
        if (!group) {
            group = this._layout._getGroupByColumn(c);
        }
        wijmo.assert(group instanceof MultiRowCellGroup, 'Failed to get the group!');
        return group;
    }

    private _onLayoutChanged() {
        // re-apply layout
        this.layoutDefinition = this._layoutDef;
    }

    private _onHeaderLayoutChanged() {
        // re-apply layout
        this.headerLayoutDefinition = this._hdrLayoutDef;
    }

    // customize cells
    private _formatItem(s: MultiRow, e: wijmo.grid.FormatItemEventArgs) {
        let rpi = this.rowsPerItem,
            p = e.panel,
            ct = p.cellType,
            row = p.rows[e.range.row] as _MultiRow,
            row2 = p.rows[e.range.row2] as _MultiRow,
            cell = e.cell,
            CT = wijmo.grid.CellType;

        // toggle group header style
        if (ct == CT.ColumnHeader) {
            wijmo.toggleClass(cell, 'wj-group-header', e.range.row == 0);
        }

        // add group start/end class markers
        if (ct == CT.Cell || ct == CT.ColumnHeader) {
            let group = this._getGroupByColumn(e.col, ct == CT.ColumnHeader);
            wijmo.toggleClass(cell, 'wj-group-start', group._colstart == e.range.col);
            wijmo.toggleClass(cell, 'wj-group-end', group._colstart + group._colspanEff - 1 == e.range.col2);
        }

        // add record start/end class markers
        if (rpi > 1) {
            if (ct == CT.Cell || ct == CT.RowHeader) {
                let mr1 = (row as any) instanceof _MultiRow || (row as any) instanceof _MultiRowNewRowTemplate;
                let mr2 = (row2 as any) instanceof _MultiRow || (row2 as any) instanceof _MultiRowNewRowTemplate;
                wijmo.toggleClass(cell, 'wj-record-start', mr1 ? row.recordIndex == 0 : false);
                wijmo.toggleClass(cell, 'wj-record-end', mr2 ? row2.recordIndex == rpi - 1 : false);
            }
        }

        // handle alternating rows
        let altStep = this.alternatingRowStep;
        if (altStep) {
            let altRow = false;
            if (row instanceof _MultiRow) {
                altRow = row.dataIndex % (altStep + 1) == 0;
                if (altStep == 1) altRow = !altRow; // compatibility
            }
            wijmo.toggleClass(cell, 'wj-alt', altRow);
        }

        // center-align cells vertically if they span multiple rows
        // (and if this is not a measuring cell)
        if (this._centerVert && !cell.getAttribute('wj-state-measuring')) {
            let center = /*cell.innerHTML &&*/ e.range.rowSpan > 1;
            if (center && e.updateContent) { // center empty cells as well (TFS 466758)
                if (cell.childElementCount == 0) { // no children: easy/fast! (TFS 355589)
                    cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
                } else { // has children: surround with a div (TFS 358232)
                    let div = document.createElement('div'),
                        rng = document.createRange();
                    rng.selectNodeContents(cell);
                    rng.surroundContents(div);
                }
            }
            wijmo.toggleClass(cell, 'wj-center-vert', center);
        }
    }

    // update glyph in collapse/expand headers button
    _updateButtonGlyph() {
        let span = this._btnCollapse.querySelector('span') as HTMLElement;
        if (span instanceof HTMLElement) {
            span.className = this.collapsedHeaders ? 'wj-glyph-left' : 'wj-glyph-down-left';
        }
    }

    // gets an error message for a cell
    _getError(p: wijmo.grid.GridPanel, r: number, c: number, parsing?: boolean): string | null {
        if (wijmo.isFunction(this.itemValidator) && p == this.rowHeaders) {
            for (let rowIndex = 0; rowIndex < this.rowsPerItem; rowIndex++) {
                for (c = 0; c < this.columns.length; c++) {
                    let error = this.itemValidator(r + rowIndex, c, parsing);
                    if (error) {
                        return error;
                    }
                }
            }
        }
        return super._getError(p, r, c, parsing);
    }
}

    }
    


    module wijmo.grid.multirow {
    





'use strict';

/**
 * Provides custom merging for {@link MultiRow} controls.
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
        let grid = p.grid as MultiRow;

        // sanity (TFS 441236)
        if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
            return null;
        }

        // handle group rows
        switch (p.cellType) {
            case wijmo.grid.CellType.Cell:
            case wijmo.grid.CellType.RowHeader:
                if (p.rows[r] instanceof wijmo.grid.GroupRow) {
                    if (!grid.multiRowGroupHeaders) {
                        return this._getGroupRowMergedRange(p, r, c, clip, false);
                    }
                }
                break;
        }

        // other cells
        switch (p.cellType) {

            // merge cells in cells and column headers panels
            case wijmo.grid.CellType.Cell:
                // handle group rows
                if (p.rows[r] instanceof wijmo.grid.GroupRow) {
                    return this._getGroupRowMergedRange(p, r, c, clip, grid.multiRowGroupHeaders);
                }
            case wijmo.grid.CellType.ColumnHeader:
                // get the group range
                let hdr = p.cellType == wijmo.grid.CellType.ColumnHeader,
                    group = grid._getGroupByColumn(c, hdr);
                wijmo.assert(group instanceof MultiRowCellGroup, 'Failed to get the group!');
                let rng = hdr
                    ? group.getMergedRange(p, r - 1, c) // discount column header row (always the first)
                    : group.getMergedRange(p, r, c);

                // prevent merging across frozen column boundary (TFS 192385)
                let fzCols = p.columns.frozen;
                if (fzCols && rng && rng.columnSpan > 1) {
                    if (rng.col < fzCols && rng.col2 >= fzCols) { // TFS 400180
                        rng = rng.clone(); // do not change the original range (TFS 337352)
                        if (c < fzCols) {
                            rng.col2 = fzCols - 1;
                        } else {
                            rng.col = fzCols;
                        }
                    }
                }

                // prevent merging across frozen row boundary (TFS 192385)
                let fzRows = p.rows.frozen;
                if (fzRows && rng && rng.rowSpan > 1 && p.cellType == wijmo.grid.CellType.Cell) {
                    if (rng.row < fzRows && rng.row2 >= fzRows) {
                        rng = rng.clone(); // do not change the original range (TFS 337352)
                        if (r < fzRows) {
                            rng.row2 = fzRows - 1;
                        } else {
                            rng.row = fzRows;
                        }
                    }
                }

                // sanity
                wijmo.assert(!rng || rng.contains(r, c), 'Merged range must contain source cell');

                // return the range
                return rng;

            // merge cells in row headers panel
            case wijmo.grid.CellType.RowHeader:
                let rpi = grid.rowsPerItem,
                    row = p.rows[r] as _MultiRow,
                    top = r - row.recordIndex,
                    bot = Math.min(top + rpi - 1, p.rows.length - 1);
                return new wijmo.grid.CellRange(top, 0, bot, p.columns.length - 1);

            // merge cells in top/left cell
            case wijmo.grid.CellType.TopLeft:
                // take into account that the 1st row is used for collapsed headers (WJM-20582)
                const ch = grid.collapsedHeaders,
                    cnt = p.rows.length - 1, // number of rows except collapsed one
                    offset = cnt > 0 ? 1 : 0, // the 1st row right after collapsed one
                    tpTop = (ch != false) ? 0 : offset,
                    tpBot = (ch != true) ? cnt : offset;                
                return new wijmo.grid.CellRange(tpTop, 0, tpBot, p.columns.length - 1);
        }

        // no merging
        return null;
    }

    // gets a merged range for group rows
    private _getGroupRowMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, clip = true, 
        multiRowGroupHeaders: boolean): wijmo.grid.CellRange {
        let g = p.grid as MultiRow,
            ct = p.cellType,
            rows = p.rows,
            row = rows[r];

        if (g.showGroups && !g.childItemsPath) {
            if (row instanceof _MultiGroupRow && 
                row.dataItem instanceof wijmo.collections.CollectionViewGroup &&
                ct == wijmo.grid.CellType.Cell) {
                const layout = g._layout;
                return layout._getGroupHeaderMergedRange(p, r, c, multiRowGroupHeaders);
            }
        }

        return super.getMergedRange(p, r, c, clip);
    }
}
    }
    


    module wijmo.grid.multirow {
    




'use strict';

/**
 * Manages the new row template used to add rows to the grid.
 */
export class _MultiRowAddNewHandler extends wijmo.grid._AddNewHandler {

    /**
     * Initializes a new instance of the {@link _AddNewHandler} class.
     *
     * @param grid {@link FlexGrid} that owns this {@link _AddNewHandler}.
     */
    constructor(grid: wijmo.grid.FlexGrid) {

        // detach old handler
        let old = grid._addHdl;
        old._detach();

        // attach this handler instead
        super(grid);
    }

    /**
     * Updates the new row template to ensure that it is visible only when the grid is
     * bound to a data source that supports adding new items, and that it is 
     * in the right position.
     */
    updateNewRowTemplate() {

        // get variables
        let ecv = this._g.editableCollectionView,
            g = this._g as MultiRow,
            rows = g.rows;

        // see if we need a new row template
        let needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;

        // see if we have new row template
        let index = -1;
        for (let i = 0; i < rows.length; i += g.rowsPerItem) {
            if (rows[i] instanceof _MultiRowNewRowTemplate) {
                index = i;
                break;
            }
        }

        // if we need a template and have one, make sure it's in the right position
        if (needTemplate && index > -1) {
            if ((this._top && index > 0) || (!this._top && index == 0)) {
                index = -1;
                this._removeNewRowTemplate();
            }
        }

        // add template
        if (needTemplate && index < 0) {
            for (let i = 0; i < g.rowsPerItem; i++) {
                let nrt = new _MultiRowNewRowTemplate(i);
                if (this._top) {
                    rows.insert(i, nrt);
                } else {
                    rows.push(nrt);
                }
            }
        }

        // remove template
        if (!needTemplate && index > -1) {
            this._removeNewRowTemplate();
        }
    }

    /*protected*/ _keydown(e: KeyboardEvent) {
        super._keydown(e);
        if (!e.defaultPrevented && e.keyCode == wijmo.Key.Escape) {
            this._copyNewDataItem(); // clearing new data item
        }
    }

    /*protected*/ _rowEditEnded(s: MultiRow, e: wijmo.grid.CellRangeEventArgs) {
        super._rowEditEnded(s, e);
        this._copyNewDataItem(); // clearing new data item
    }

    // beginning edit, save item in new row template
    /*protected*/ _beginningEdit(s: MultiRow, e: wijmo.grid.CellRangeEventArgs) {
        super._beginningEdit(s, e);
        if (this._top && !s.rows[0].dataItem) { // saving new data item
            this._copyNewDataItem();
        }
    }

    // copy new data item to template rows
    _copyNewDataItem() {
        if (this._top) {
            let g = this._g as MultiRow,
                rows = g.rows;
            for (let i = 0; i < g.rowsPerItem; i++) {
                if (rows[i] instanceof wijmo.grid._NewRowTemplate) {
                    rows[i].dataItem = this._nrt.dataItem;
                }
            }
        }
    }

    // remove all _NewRowTemplate rows from the grid
    _removeNewRowTemplate() {
        for (let i = 0, rows = this._g.rows; i < rows.length; i++) {
            if (rows[i] instanceof wijmo.grid._NewRowTemplate) {
                rows.removeAt(i);
                i--;
            }
        }
    }
}

/**
 * Represents a row template used to add items to the source collection.
 */
export class _MultiRowNewRowTemplate extends wijmo.grid._NewRowTemplate {
    _idxRecord: number;

    constructor(indexInRecord: number) {
        super();
        this._idxRecord = indexInRecord;
    }
    get recordIndex(): number {
        return this._idxRecord;
    }
}
    }
    


    module wijmo.grid.multirow {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.multirow', wijmo.grid.multirow);










    }
    