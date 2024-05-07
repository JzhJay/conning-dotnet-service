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


    module wijmo.grid.transposed {
    

'use strict';

/**
 * Provides custom merging for {@link TransposedGrid} controls.
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
        let g = p.grid;

        if (p == g.rowHeaders && g._hasColumnGroups()) {

            // sanity (TFS 441236)
            if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
                return null;
            }
        
            // merge cells in row group headers
            let grp = g._getColumnGroup(r, c);
            if (grp) {

                // get the range from the group
                let rng = grp._rng,
                    rows = p.rows;

                // account for frozen rows
                if (rows.isFrozen(rng.row) != rows.isFrozen(rng.row2)) {
                    rng = rng.clone();
                    if (rows.isFrozen(r)) {
                        rng.row2 = rows.frozen - 1;
                    } else {
                        rng.row = rows.frozen;
                    }
                }

                // done
                return rng;
            } else {

                // no merging
                return null;
            }
        }
            
        // allow base class
        return super.getMergedRange(p, r, c, clip);
    }
}
    }
    


    module wijmo.grid.transposed {
    






/**
 * Extends the {@link FlexGrid} control to display data using a transposed
 * layout, where columns represent data items and rows represent item
 * properties.
 * 
 * Features based on regular (non-transposed) data sources only apply to the
 * original data source, so you can sort, filter, group, or paginate items before 
 * assigning them to the {@link TransposedGrid}, but if you later change those
 * parameters, the grid will not be automatically updated.
 * 
 * Also, some regular {@link FlexGrid} features are not available in the
 * {@link TransposedGrid} because they don't make sense with transposed data 
 * sources.
 * 
 * For example, adding or removing rows in a transposed grid would mean adding
 * or removing properties to the data items. For this reason, the {@link allowAddNew}
 * and {@link allowDelete} properties are disabled.
 * 
 * Also, the {@link autoGenerateColumns} property has no effect on the
 * {@link TransposedGrid}, which has an {@link autoGenerateRows} property instead.
 * 
 * The list of disabled properties includes the following:
 * {@link FlexGrid.allowAddNew}, {@link FlexGrid.allowDelete},
 * {@link FlexGrid.allowSorting}, {@link FlexGridFilter},
 * {@link Selector}.
 */
export class TransposedGrid extends wijmo.grid.FlexGrid {
    protected _sourceItems: any;
    protected _keyPrefix = 'item';
    protected _autoGenRows = true;
    protected _toRowInfo: any;
    /*protected*/ _rowInfo: wijmo.grid.ColumnCollection;

    /**
     * Initializes a new instance of the {@link TransposedGrid} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);

        // add class to host element
        wijmo.addClass(this.hostElement, 'wj-transposed-grid');

        // change some defaults
        this.allowSorting = wijmo.grid.AllowSorting.None;
        this.headersVisibility = wijmo.grid.HeadersVisibility.Row;

        // initialize rowInfo array
        this._rowInfo = new wijmo.grid.ColumnCollection(this, this.columns.defaultSize);

        // custom ColumnGroupHandler
        this._grpHdl = new _RowGroupHandler(this);

        // custom MergeManager
        this.mergeManager = new _MergeManager();

        // apply options after grid has been initialized
        this.initialize(options);

        // listen for changes in _rowInfo array after applying options
        this._rowInfo.collectionChanged.addHandler(this._rowInfoChanged, this);

        // configure grid for showing transposed data
        this.deferUpdate(() => {
            let rhCols = this.rowHeaders.columns;
            if (rhCols.length) {
                let col = rhCols[rhCols.length - 1];
                col.width = this.columns.defaultSize;
            }
        });
    };

    /**
     * Gets or sets a value that determines whether the grid should generate
     * rows automatically based on the {@link itemsSource}.
     * 
     * The default value for this property is <b>true</b>.
     */
    get autoGenerateRows(): boolean {
        return this._autoGenRows;
    }
    set autoGenerateRows(value: boolean) {
        this._autoGenRows = wijmo.asBoolean(value);
    }

    /**
     * Gets or sets an array used to define hierarchical row groups.
     * 
     * The items in the array should be JSON objects with properties of
     * {@link Column} objects, plus three optional members:
     * 
     * * 'rows' array containing an array of child rows,
     * * 'collapseTo' string containing the binding of the child row
     *   that should remain visible when the group is collapsed.
     * * 'isCollapsed' boolean that determines if the group should be
     *   initially collapsed.
     * 
     * Please note that 'width' property defines row header width.
     * If width is defined in more than one group/row header that corresponds the same header column,
     * the maximal width will be used.
     * 
     * Moreover, it is possible to define row height using 'height' property.
     * This property should be used for empty rows which don't contain child rows.
     * Using this property for rows which contain child ones will have no effect.
     * 
     * For example, the code below generates a grid with two row groups,
     * both initially collapsed:
     * 
     * ```typescript
     * new TransposedGrid('#trnGrid', {
     *     autoGenerateRows: false,
     *     rowGroups: [
     *         { header: 'Group 1', width: 100, align: 'center', collapseTo: 'country', isCollapsed: true, rows: [
     *             { binding: 'id', header: 'ID', width: 20, height: 50 },
     *             { binding: 'date', header: 'Date', width: 60, dataType: 'Date' },
     *             { binding: 'country', header: 'Country', width: 80, dataType: 'String' },
     *             { binding: 'active', header: 'Active', width: 20, dataType: 'Boolean' },
     *         ]},
     *         { header: 'Group 2', width: 100, align: 'center', collapseTo: 'sales', isCollapsed: true, rows: [
     *             { binding: 'sales', header: 'Sales', width: 60, dataType: 'Number' },
     *             { binding: 'expenses', header: 'Expenses', width: 60, dataType: 'Number' },
     *         ]}
     *     ],
     *     itemsSource: getData(20)
     * });
     * ```
     * 
     * Note that these row groups will be represented by row header with two columns,
     * 100 and 80 pixels wide, respectively.
     */
    get rowGroups(): any[] {
        return this._grpHdl.getGroupDefinitions();
    }
    set rowGroups(value: any[]) {
        this._rowInfo.deferUpdate(() => {
            this.autoGenerateRows = false; // TFS 400256
            this._rowInfo.clear();
            this._grpHdl.createColumnGroups(wijmo.asArray(value));
        });
    }

    // ** overrides

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

    // can't add new
    get allowAddNew(): boolean {
        return false;
    }
    set allowAddNew(value: boolean) {
        // can't all new
    }

    // can't delete
    get allowDelete(): boolean {
        return false;
    }
    set allowDelete(value: boolean) {
        // can't delete
    }

    // does not support sorting
    get allowSorting(): wijmo.grid.AllowSorting {
        return wijmo.grid.AllowSorting.None;
    }
    set allowSorting(value: wijmo.grid.AllowSorting) {
        wijmo.assert(value === wijmo.grid.AllowSorting.None, 'TransposedGrid does not support sorting.');
        this._alSorting = value;
    }
    
    /**
     * Not supported. Use {@link rowGroups} instead.
     */
    get columnGroups(): any[] {
        return null;
    }
    set columnGroups(value: any[]) {
        throw 'TransposedGrid does not support columnGroups, use rowGroups instead.';
    }

    // update source CollectionView after editing
    onRowEditEnded(e: wijmo.grid.CellRangeEventArgs) {
        let sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView') as wijmo.collections.ICollectionView;
        if (sourceView) {
            let args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change);
            sourceView.collectionChanged.raise(sourceView, args);
        }
        super.onRowEditEnded(e)
    }

    // overridden to transpose incoming data
    protected _getCollectionView(value: any): wijmo.collections.ICollectionView {

        // remove CollectionView event handler
        let sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView') as wijmo.collections.ICollectionView;
        if (sourceView) {
            sourceView.collectionChanged.removeHandler(this._sourceViewChanged);
        }

        // update source view from value 
        sourceView = wijmo.tryCast(value, 'ICollectionView') as wijmo.collections.ICollectionView;

        // transpose the source data, add CollectionView event handler
        let transposedValue = value;
        if (wijmo.isArray(value)) {
            transposedValue = this._transposeItemsSource(value);
        } else if (sourceView) {

            // listen to changes in the ICollectionView
            sourceView.collectionChanged.addHandler(this._sourceViewChanged, this);

            // create new ObservableArray from original CollectionView's items
            transposedValue = this._transposeItemsSource(sourceView.items);
        }
        this.autoGenerateColumns = true;

        // let base class handle this
        let retVal = super._getCollectionView(transposedValue);

        // original CollectionView's getError function
        let getError: wijmo.collections.IGetError = null;

        // honor source CollectionView's getError
        if (sourceView instanceof wijmo.collections.CollectionView) {
            getError = sourceView.getError;
        }

        // honor original CollectionView's getError handler (TFS 412376)
        if (getError && retVal instanceof wijmo.collections.CollectionView) {
            if (this._supportsProxies()) {
                retVal.getError = (item, prop) => {
                    if (prop == null) { // TFS 469223
                        return null;
                    }
                    let index = item._keys.indexOf(prop);
                    return getError(item._arr[index], item._bnd.path);
                }
            } else {
                retVal.getError = (item, prop) => {
                    if (prop == null) { // TFS 469223
                        return null;
                    }
                    let index = parseInt(prop.substr(this._keyPrefix.length));
                    return getError(item._arr[index], item._rowInfo.binding);
                }
            }
        }

        // remember source value
        this._sourceItems = value;

        // done
        return retVal;
    }

    // get column names and types based on data
    _getColumnTypes(arr: any[]): wijmo.IBindingInfo[] {
        let columnTypes: wijmo.IBindingInfo[];

        // set source array
        let sourceArr: any[];
        if (this._sourceItems) {
            if (wijmo.isArray(this._sourceItems)) {
                sourceArr = this._sourceItems;
            } else {
                let sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView') as wijmo.collections.ICollectionView;
                if (sourceView) {
                    sourceArr = sourceView.items;
                }
            }
        }

        // if possible set column types from source array
        // otherwise suppose that array passed in argument is already transposed,
        // and set column types right from this array itself
        if (sourceArr) {
            columnTypes = sourceArr.map((item: any, index: number) => { 
                return {
                    binding: this._keyPrefix + index,
                    dataType: wijmo.DataType.Object
                } as wijmo.IBindingInfo;
            });
        } else {
            columnTypes = wijmo.getTypes(arr);
        }

        // done
        return columnTypes;
    }

    // keep info used to initialize 'rows/columns' properties
    _copy(key: string, value: any): boolean {
        if (/rows|columns/.test(key)) {
            wijmo.assert(wijmo.isArray(value), 'Array Expected.');
            let arr = wijmo.asArray(value);
            let hasGroups = arr.some(grp => grp.columns != null);
            if (hasGroups) { // handle row groups
                this.rowGroups = arr;
            } else { // regular columns
                this._rowInfo.deferUpdate(() => {
                    this.autoGenerateRows = false; // TFS 400256
                    this._rowInfo.clear();
                    value.forEach(rowInfo => {
                        let row = new TransposedGridRow(rowInfo);
                        this._rowInfo.push(row);
                    });
                });
            }
            return true;
        }
        return super._copy(key, value);
    }

    // update grid when rows are loaded
    onLoadedRows(e?: wijmo.EventArgs) {

        // remove column alignment, data types
        let cols = this.columns;
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i];
            col.align = null; // not '', that means 'left'
            col.dataType = 0; // 'Any' (not null, or the grid will auto-set it)
        }

        // initialize row headers
        let rhCols = this.rowHeaders.columns;
        for (let i = 0; i < rhCols.length; i++) {
            rhCols[i].align = 'left';
            rhCols[i].width = 0; // initial value that supposed to be updated
        }

        // apply row properties and headers
        let props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Row);
        this.rows.forEach(row => {
            let info = row.dataItem._rowInfo;
            if (info) {
                // copy props
                this._copyProps(info, row, props, ['showDropDown', 'width', 'size']);

                // update row header cells
                if (this._hasColumnGroups()) { // from row/column groups
                    for (let c = 0; c < rhCols.length; c++) {
                        let grp = this._grpHdl.getColumnGroup(row.index, c);
                        if (grp) {
                            this._updateRowHeaders(row.index, c, grp);
                        }
                    }
                } else if (rhCols.length) { // from row info
                    this._updateRowHeaders(row.index, rhCols.length - 1, info);
                }
            }
        });

        // set default width if not yet updated
        for (let i = 0; i < rhCols.length; i++) {
            if (rhCols[i].width === 0) {
                rhCols[i].width = this.columns.defaultSize;
            }
        }

        // go raise the event
        super.onLoadedRows(e);
    }

    // get the binding column
    /*protected*/ _getBindingColumn(p: wijmo.grid.GridPanel, r: number, c: wijmo.grid.Column): wijmo.grid.Column {
        let bCol = c;
        
        // support cell types only
        if (p != this.cells) {
            return bCol;
        }

        // preliminary checks
        let row = p.rows[r];
        let info = row.dataItem._rowInfo;
        if (wijmo.isUndefined(info)) {
            return bCol;
        }

        // initialize binding column
        // TODO: perhaps should be cached
        bCol = new wijmo.grid.Column();

        // copy props
        let props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Column);
        this._copyProps(info, bCol, props);

        // set effective binding and header
        bCol.binding = c.binding;
        bCol.header = info.header || wijmo.toHeaderCase(info.binding);

        // done
        return bCol;
    }

    // get value that indicates whether layout is transposed or not
    // Note: transposed layout is when rows represent properties and
    // columns represent items
    /*protected*/ _isTransposed(): boolean {
        return true;
    }

    // ** implementation

    private _copyProps(src: any, dst: any, dstProps: string[], excludeProps: string[] = []) {
        for (let prop in src) { // properties
            if (dstProps.indexOf(prop) > -1 && excludeProps.indexOf(prop) === -1) {
                let val = src[prop];
                if (!wijmo.isUndefined(val)) {
                    try {
                        dst[prop] = val;
                    } catch (x) {}
                }
            }
        }
    }

    // updates row header from 'src' object
    // usually represented by row group or row info objects
    private _updateRowHeaders(r: number, c: number, src: any) {
        // update cell content
        let hdr = src.header || wijmo.toHeaderCase(src.binding);
        this.rowHeaders.setCellData(r, c, hdr);

        // update column width
        let rhCols = this.rowHeaders.columns;
        let width = src.width;
        if (wijmo.isNumber(width) && width > 0) {
            let rng = src._rng;
            if (rng && rng instanceof wijmo.grid.CellRange && rng.isValid) {
                let colSpan = rng.columnSpan;
                wijmo.assert(colSpan > 0, 'Column span is negative or equal to 0'); // sanity
                width = width / colSpan;
            }
            rhCols[c].width = Math.max(rhCols[c].width, width);
        }
    }

    // rows added/removed/changed, re-bind the whole grid
    _rowInfoChanged() {
        if (this._toRowInfo) {
            clearTimeout(this._toRowInfo);
        }
        this._toRowInfo = setTimeout(() => { // de-bounce this
            let sel = this.selection;
            let items = this.itemsSource;
            this.itemsSource = null;
            this.itemsSource = items;
            this.selection = sel;
        }, wijmo.Control._REFRESH_INTERVAL);
    }   

    // update transposed view when source CollectionView changes
    _sourceViewChanged(sender: wijmo.collections.ICollectionView, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (!this.activeEditor) { // TFS 412376
            this.invalidate();
        }
    }

    // transpose itemsSource array
    _transposeItemsSource(arr: any[]): wijmo.collections.ObservableArray {

        // create transposed array
        let transposed = new wijmo.collections.ObservableArray();

        // get data types for each property
        let propTypes = wijmo.getTypes(arr);

        // create keys (property names) used by all proxy objects
        let proxyKeys = arr.map((item: any, index: number) => { return this._keyPrefix + index });

        // auto-generate rowInfo array if necessary
        let rowInfo = this.autoGenerateRows 
            ? this._getRowInfo(arr)
            : this._rowInfo;

        // generate a proxy item for each rowInfo object
        // each proxy item represents one property (e.g. name, id, etc) of
        // the original data items and has one property for each original
        // data item (e.g. item0, item1, etc.)
        rowInfo.forEach((rowInfo, index: number) => {
            let bnd = new wijmo.Binding(rowInfo.binding); // support deep binding

            // fill missing data types
            if (rowInfo.dataType == null && arr.length) { // TFS 431582
                let val = bnd.getValue(arr[0]);
                rowInfo.dataType = val != null ? wijmo.getType(val) : propTypes[index].dataType;
            }

            // add proxy object if possible, more expensive transposed object otherwise
            if (this._supportsProxies()) {
                let proxy = this._createProxy(arr, rowInfo, proxyKeys);
                transposed.push(proxy);
            } else {
                let obj = this._createTransposedObject(arr, rowInfo, this._keyPrefix);
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
                    let eventArgs = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Reset);
                    transposed.onCollectionChanged(eventArgs);
                    this._rowInfoChanged(); // re-generate columns 
                }
            });
        }

        // all done
        return transposed;
    }

    // check whether the browser supports proxies
    _supportsProxies(): boolean {
        return window['Proxy'] != null;
    }

    // create proxy that reads/writes data from the original array
    _createProxy(arr: any[], rowInfo: any, proxyKeys: string[]): any {
        let target = {
            _arr: arr,
            _rowInfo: rowInfo,
            _bnd: new wijmo.Binding(rowInfo.binding), // supports deep binding
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
                return index > -1
                    ? obj._bnd.getValue(obj._arr[index])
                    : obj[prop];
            },
            set: (obj: any, prop: string, value: any) => {
                let index = obj._keys.indexOf(prop);
                if (index > -1) {
                    let arr = obj._arr,
                        item = arr[index];
                    obj._bnd.setValue(item, value);
                    if (arr instanceof wijmo.collections.ObservableArray) {
                        let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, index);
                        arr.onCollectionChanged(e);
                    }
                    return true;
                }
                return false;
            }
        };
        return new Proxy(target, handler);
    }

    // create proxy-like object when real proxies are not available
    _createTransposedObject(arr: any[], rowInfo: any, keyPrefix: string) {
        let obj = {
            _arr: arr,
            _rowInfo: rowInfo
        }
        let bnd = new wijmo.Binding(rowInfo.binding); // supports deep binding
        for (let index = 0; index < arr.length; index++) {
            let item = arr[index];
            Object.defineProperty(obj, keyPrefix + index, {
                enumerable: true,
                get: () => {
                    return bnd.getValue(item);
                },
                set: value => {
                    bnd.setValue(item, value);
                    if (arr instanceof wijmo.collections.ObservableArray) {
                        let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, index);
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
    _getRowInfo(arr: any[]): any[] {
        let rowInfo = [];
        wijmo.getTypes(arr).forEach(prop => {
            let binding = prop.binding;
            let type = prop.dataType;
            if (type != wijmo.DataType.Object && type != wijmo.DataType.Array) {

                // create the column
                let col: any = {
                    binding: binding,
                    header: wijmo.toHeaderCase(binding),
                    dataType: type
                };

                // set the column's width (depends on dataType)
                let width = wijmo.grid.FlexGrid._defTypeWidth[type];
                if (width != null) {
                    if (wijmo.isString(width)) {
                        let val = Math.round(parseFloat(width));
                        width = width.indexOf('*') < 0 ? val : val * this.columns.defaultSize;
                    }
                    if (wijmo.isNumber(width) && width > 0) {
                        col.width = width;
                    }
                }

                // done
                rowInfo.push(col);
            }
        });
        return rowInfo;
    }

}

/**
 * This class is for internal use only.
 */
export class TransposedGridRow extends wijmo.grid.Column {
    private _height: number | null;

    /**
     * Gets or sets the height of the row.
     * Setting this property to null or negative values causes the element to use the 
     * parent collection's default size.
     */
    get height(): number | null {
        return this._height;
    }
    set height(value: number | null) {
        this._height = value;
    }
}

    }
    


    module wijmo.grid.transposed {
    



/**
 * Provides custom handling of row groups for {@link TransposedGrid} controls.
 */
export class _RowGroupHandler implements wijmo.grid._IColumnGroupHandler {
    private _grid: TransposedGrid;
    private _colGroups: _RowGroup[];
    private _groupDefs: any[];

    /**
     * Initializes a new instance of the {@link _RowGroupHandler} class.
     *
     * @param g {@link TransposedGrid} that owns this {@link _RowGroupHandler}.
     */
    constructor(grid: TransposedGrid) {
        this._grid = grid;
    }

    // ** _IColumnGroupHandler members

    /**
     * Gets the collection of column groups.
     * Currently does not support and returns null;
     */
    get columnGroups(): wijmo.grid.ColumnGroupCollection {
        return null;
    }

    /**
     * Initializes the column groups based on an array of 
     * column definition objects.
     * 
     * @param arr Array of column definition objects that defines the groups.
     */
    createColumnGroups(arr: any[]): void {
        // actually creates row groups
        this._createRowGroups(arr);
    }

    /**
     * Gets a value that determines whether the grid has any
     * column groups.
     */
    hasColumnGroups(): boolean {
        return this._colGroups != null && this._colGroups.length > 0;
    }

    /**
     * Gets the original array used to define the column groups.
     */
    getGroupDefinitions(): any[] {
        return this._groupDefs;
    }

    /**
     * Gets the column group that contains a given row and column.
     * 
     * @param r Index of the row containted in the group.
     * @param c Index of the column containted in the group.
     */
    getColumnGroup(r: number, c: number): wijmo.grid.Column & wijmo.grid._ColumnGroupProperties {
        let g = this._grid as TransposedGrid;
        if (c < g.rowHeaders.columns.length && r < g._rowInfo.length) { // sanity
            for (let groups = this._colGroups; groups;) { // start scanning at the top level
                let startGroups = groups;
                for (let i = 0; i < groups.length; i++) {
                    let grp = groups[i],
                        rng = grp._rng;
                    if (rng.containsRow(r)) { // found row
                        if (rng.containsColumn(c) || grp.columns.length == 0) {
                            return grp; // found column
                        }
                        groups = grp.columns; // wrong column, move on to the next level
                        break;
                    }
                }
                if (groups == startGroups) { // not found, break out
                    break;
                }
            }
        }

        // no group for these coordinates
        return null;
    }

    /**
     * Checks whether the column group can be moved from one position to another.
     * 
     * @param srcRow The row index of the column group to move.
     * @param srcCol The column index of the column group to move.
     * @param dstRow The row position to which to move the column group.
     * @param dstCol The column position to which to move the column group.
     * @returns Returns true if the move is valid, false otherwise.
     */
    canMoveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number): boolean {
        // TODO: provide proper implementation
        return this._grid.columns.canMoveElement(srcCol, dstCol);
    }

    /**
     * Moves the column group from one position to another.
     * 
     * Note: it is allowed to move the column group to child groups (child == true) 
     * only if the parent group is empty. Otherwise returns false.
     * 
     * @param srcRow The row index of the column group to move.
     * @param srcCol The column index of the column group to move.
     * @param dstRow The row position to which to move the column group.
     * @param dstCol The column position to which to move the column group.
     * @param child Whether to move the column group to child groups or to sibling groups.
     * @returns Returns true if the element was moved, false otherwise.
     */
     moveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number, child: boolean): boolean {
        // TODO: provide proper implementation
        return this._grid.columns.moveElement(srcCol, dstCol);
    }

    // ** implementation

    // initializes the row groups from an array of group definition objects.
    // remark: in fact, the '_colGroups' field represents rows
    private _createRowGroups(arr: any[]) {
        let g = this._grid as TransposedGrid;
        this._groupDefs = wijmo.asArray(arr);

        // some preliminary actions
        g.autoGenerateRows = false; // don't mess with the layout
        g._rowInfo.clear(); // clear rows

        // parse header rows
        this._colGroups = [];
        arr.forEach(colDef => {
            this._colGroups.push(new _RowGroup(colDef, null));
        });

        // set group ranges and add bound rows (no children) to row collection
        let maxLevel = 1;
        this._colGroups.forEach((grp: _RowGroup) => {
            this._addRowGroup(grp);
            maxLevel = Math.max(maxLevel, grp._getMaxLevel());
        });

        // expand groups that don't have enough columns
        this._colGroups.forEach(grp => {
            grp._expandRange(maxLevel);
        });

        // add new header columns to the grid
        let columns = g.rowHeaders.columns;
        columns.clear();
        for (let c = 0; c <= maxLevel; c++) {
            let col = new wijmo.grid.Column();
            columns.splice(c, 0, col);
            if (c < maxLevel) { // center-align headers for all columns but the last
                col.cssClassAll = 'wj-colgroup';
            }
        }
    }

    private _addRowGroup(grp: _RowGroup) {
        let g = this._grid as TransposedGrid;

        // save reference to parent grid
        grp._grid = g;

        // initialize group row range
        grp._rng.row = g._rowInfo.length;

        // add row or group
        if (grp.columns.length == 0) {
            g._rowInfo.push(grp);
        } else {
            grp.columns.forEach((child: _RowGroup) => {
                this._addRowGroup(child);
            });
        }

        // close group row range
        grp._rng.row2 = g._rowInfo.length - 1;
    }
}

/**
 * Extends the {@link Column} class to provide custom row groups
 * for {@link TransposedGrid} controls.
 */
export class _RowGroup extends wijmo.grid.Column {
    private _height: number | null;
    /*private*/ _rng = new wijmo.grid.CellRange(-1, 0);
    /*private*/ _grid: TransposedGrid;
    protected _pGrp: _RowGroup;
    protected _cols: _RowGroup[] = [];
    protected _lvl = 0;
    protected _collTo: string;
    protected _collapsed = false;

    /**
     * Initializes a new instance of the {@link _RowGroup} class.
     *
     * @param options JavaScript object containing initialization data for the instance.
     * @param parent Parent group, or null for top-level groups.
     */
    constructor(options: any, parent: _RowGroup) {
        super(); // don't pass options until we are initialized

        // store/update group level
        this._pGrp = parent;
        this._lvl = 0;
        for (let p = parent; p; p = p._pGrp) {
            this._lvl++;
        }

        // add this group to the parent group's columns collection
        if (parent && parent.columns.indexOf(this) < 0) {
            parent.columns.push(this);
        }

        // initialize group column range
        this._rng.col = this._rng.col2 = this._lvl;

        // no dragging group rows
        this.allowDragging = false;

        // parse options (including child columns)
        wijmo.copy(this, options);
    }

    // object model

    /**
     * Gets or sets the collection of child {@link _RowGroup} columns.
     */
    get columns(): _RowGroup[] {
        return this._cols;
    }
    set columns(value: _RowGroup[]) {
        let cols = this._cols = [];
        value.forEach(colDef => {
            let grp = new _RowGroup(colDef, this);
            if (cols.indexOf(grp) < 0) {
                cols.push(grp);
            }
        });
    }

    // required for JSON-style initialization
    get rows(): _RowGroup[] {
        return this._cols;
    }

    /**
     * Gets the value that indicates whether the group contains child columns or not.
     */
     get isEmpty(): boolean {
        return this._cols.length === 0;
    }

    /**
     * Gets or sets the height of the row.
     * Setting this property to null or negative values causes the element to use the 
     * parent collection's default size.
     */
    get height(): number | null {
        return this._height;
    }
    set height(value: number | null) {
        this._height = value;
    }

    /**
     * Gets this {@link _RowGroup}'s level (the number of parent groups it has).
     * 
     * Top level groups have level zero. Their children have level 1, and so on.
     */
     get level(): number {
        let grp: _RowGroup = this,
            level = 0;
        while (grp._pGrp) {
            grp = grp._pGrp;
            level++;
        }
        return level;
    }

    /**
     * Gets or sets the binding of the column that should remain 
     * visible when this {@link _RowGroup} is collapsed.
     */
    get collapseTo(): string {
        return this._collTo;
    }
    set collapseTo(value: string) {
        this._collTo = wijmo.asString(value);
    }

    /**
     * Gets or sets a value that determines whether this {@link _RowGroup}
     * is collapsed.
     */
    get isCollapsed(): boolean {
        return this._collapsed;
    }
    set isCollapsed(value: boolean) {

        // change the collapsed value
        if (value != this._collapsed) {
            let g = this._grid;
            if (g) {
                let e = new wijmo.grid.CellRangeEventArgs(g.rowHeaders, this._rng, this);
                if (g.onColumnGroupCollapsedChanging(e)) {
                    this._collapsed = wijmo.asBoolean(value);
                    g.onColumnGroupCollapsedChanged(e);
                }
            } else { // grid not set yet, so no events
                this._collapsed = wijmo.asBoolean(value);
            }
        }

        // update the collapse state (always)
        setTimeout(() => {
            this._updateCollapsedState();
        });
    }

    // method used in JSON-style initialization
    // keep info used to initialize 'rows/columns' properties
    _copy(key: string, value: any): boolean {
        if (/rows|columns/.test(key)) {
            let arr = wijmo.asArray(value);
            this.columns = arr;
            return true;
        }
        return false;
    }

    // expand or collapse the group based on the value of the _collapsed member
    // remark: notice that variables/fields herein referred as columns ('cols', '_cols')
    // actually represent rows
    _updateCollapsedState() {
        let g = this._grid as TransposedGrid,
            cols = g._rowInfo,
            rng = this._rng,
            collapsed = this._collapsed;

        // apply collapsed state to all child columns
        this._cols.forEach(col => {
            if (col instanceof _RowGroup) {
                col._collapsed = collapsed;
                col._updateCollapsedState();
            }
        });

        // get the index of the column to keep visible when the group is collapsed
        let collapseToIndex = rng.bottomRow;
        if (this.collapseTo) {
            switch (this.collapseTo) {
                case '$first':
                    collapseToIndex = rng.topRow;
                    break;
                case '$last':
                    collapseToIndex = rng.bottomRow;
                    break;
                default:
                    let index = cols.indexOf(this.collapseTo);
                    if (index > -1) {
                        collapseToIndex = index;
                    }
                    break;
            }
        }

        // show/hide columns
        for (let c = rng.topRow; c <= rng.bottomRow; c++) {
            cols[c].visible = collapsed
                ? c == collapseToIndex // show collapseTo column
                : true; // show all
        }
    }

    // get the max level of the groups within this group
    _getMaxLevel(): number {
        let maxLevel = this._lvl;
        this.columns.forEach(grp => {
            maxLevel = Math.max(maxLevel, grp._getMaxLevel());
        });
        return maxLevel;
    }

    // expand the row's horizontal range to fill the required number of rows
    _expandRange(maxLevel: number) {

        // expand group
        let delta = maxLevel - this._getMaxLevel();
        if (delta > 0) {
            this._rng.col2 += delta; // expand this
            this._cols.forEach(grp => { // and shift children
                grp._shiftRange(delta);
            });
        }

        // make sure last column extends to the right to the max level
        let g = this._grid as TransposedGrid,
            rows = g._rowInfo,
            rng = this._rng;
        for (let r = rng.row; r <= rng.row2; r++) {
            let grp = rows[r] as _RowGroup;
            grp._rng.col2 = maxLevel;
        }
    }

    // shift expand the row's horizontal range to line up at the right
    _shiftRange(delta: number) {
        this._rng.col += delta;
        this._rng.col2 += delta;
        this._cols.forEach(grp => {
            grp._shiftRange(delta);
        });
    }
}

    }
    


    module wijmo.grid.transposed {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.transposed', wijmo.grid.transposed);




    }
    