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


    module wijmo.grid {
    

'use strict';

/**
 * Specifies constants that define the type of editor used with data-mapped columns.
 */
export enum DataMapEditor {
    /** Use an input element with auto-complete and validation. */
    AutoComplete,
    /** Use an input element with auto-complete, validation, and a drop-down list. */
    DropDownList,
    /** Use radio buttons with mouse and keyboard support. */
    RadioButtons
}

/**
 * Represents a data map for use with a column's {@link Column.dataMap} property.
 *
 * Data maps provide the grid with automatic look up capabilities. For example, 
 * you may want to display a customer name instead of his ID, or a color name 
 * instead of its RGB value.
 *
 * The code below binds a grid to a collection of products, then assigns a
 * {@link DataMap} to the grid's 'CategoryID' column so the grid displays the
 * category names rather than the raw IDs.
 *
 * The grid takes advantage of data maps also for editing. If the <b>wijmo.input</b>
 * module is loaded, then when editing data-mapped columns the grid will show
 * a drop-down list containing the values on the map.
 *
 * ```typescript
 * import { FlexGrid, Column } from '@grapecity/wijmo.grid';
 * 
 * // bind grid to products
 * let flex = new FlexGrid({
 *     itemsSource: products
 * });
 * 
 * // map CategoryID column to show category name instead of ID
 * let col = flex.getColumn('CategoryID');
 * col.dataMap = new DataMap(categories, 'CategoryID', 'CategoryName');
 * ```
 *
 * In general, data maps apply to whole columns. However, there are situations
 * where you may want to restrict the options available for a cell based on a
 * value on a different column. For example, if you have "Country" and "City"
 * columns, you will probably want to restrict the cities based on the current
 * country.
 *
 * There are two ways you can implement these "dynamic" data maps:
 *
 * <ol>
 *   <li>
 *     If the {@link DataMap} is just a list of strings, you can change it before
 *     the grid enters edit mode. In this case, the cells contain the string
 *     being displayed, and changing the map won't affect other cells in the
 *     same column.
 *     This fiddle demonstrates:
 *     <a href="https://jsfiddle.net/Wijmo5/8brL80r8/">show me</a>.
 *   </li>
 *   <li>
 *     If the {@link DataMap} is a real map (stores key values in the cells, shows
 *     a corresponding string), then you can apply a filter to restrict the
 *     values shown in the drop-down. The {@link DataMap} will still contain the
 *     same keys and values, so other cells in the same column won't be disturbed
 *     by the filter.
 *     This fiddle demonstrates:
 *     <a href="https://jsfiddle.net/Wijmo5/xborLd4t/">show me</a>.
 *   </li>
 * </ol>
 *
 * In some cases, you may want to create a {@link DataMap} to represent an enumeration.
 * This can be done with the following code:
 *
 * ```typescript
 * // build a DataMap for a given enum
 * function getDataMap(enumClass) {
 *     let pairs = [];
 *     for (let key in enumClass) {
 *         var val = parseInt(key);
 *         if (!isNaN(val)) {
 *             pairs.push({ key: val, name: enumClass[val] });
 *         }
 *     }
 *     return new DataMap(pairs, 'key', 'name');
 * }
 * ```
 * DataMap can treat keys in two different ways, this functionality is controlled by the 
 * {@link serializeKeys} property. By default, key values are converted to strings before
 * processing, that is different values will produce the same key value if their string 
 * representations are equal. This is usually the preferred behavior. You maw need to change
 * this mode if your keys are complex objects or arrays of complex objects. See the 
 * {@link serializeKeys} property documentation for more details.
 */
export class DataMap<K = any, V = any> {
    _cv: wijmo.collections.ICollectionView;
    _keyPath = '';
    _displayPath = '';
    _sortByVal = true;
    _editable = false;
    private _map: wijmo._Map<K,V>;
    private _serK = true;

    /**
     * Initializes a new instance of the {@link DataMap} class.
     *
     * @param itemsSource An array or {@link ICollectionView} that contains the items to map.
     * @param selectedValuePath The name of the property that contains the keys (data values).
     * @param displayMemberPath The name of the property to use as the visual representation of the items.
     */
    constructor(itemsSource: any, selectedValuePath?: string, displayMemberPath?: string) {

        // turn arrays into real maps
        if (wijmo.isArray(itemsSource) && !selectedValuePath && !displayMemberPath) {
            itemsSource = itemsSource.map(item => {
                return { value: item };
            });
            selectedValuePath = displayMemberPath = 'value';
        }

        // initialize map
        this._cv = wijmo.asCollectionView(itemsSource);
        this._keyPath = wijmo.asString(selectedValuePath, false);
        this._displayPath = wijmo.asString(displayMemberPath, false);

        // notify listeners when the map changes
        this._cv.collectionChanged.addHandler(this.onMapChanged, this);
    }
    /**
     * Gets or sets a value that determines whether grid controls should
     * use mapped (display) or raw (key) values when sorting data in columns
     * that use this {@link DataMap}.
     * 
     * The default value for this property is <b>true</b>.
     */
    get sortByDisplayValues(): boolean {
        return this._sortByVal;
    }
    set sortByDisplayValues(value: boolean) {
        this._sortByVal = wijmo.asBoolean(value);
    }
    /**
    * Gets or sets a value indicating whether key values are converted to strings before use.
    * 
    * The default value is true.
    *
    * This property is set to true by default, which means that for example the keys 123 (number) and 
    * ‘123’ (string), two Date objects defining the same date/time, and two different arrays of 
    * primitive values (like [1,2,3]), are treated as the equal key pairs and mapped to the same value.
    * 
    * If to set this property to false, the keys equality will be determined as in the native Map class, 
    * that is using the triple-equality (===) operator. This mode is useful if your keys are objects 
    * or arrays of objects.
    * Note that in this case DataMap uses the native browser’s Map implementation. Some old mobile 
    * browsers, as well as IE9/10, don’t implement the Map interface. In this case DataMap will use 
    * its own array based implementation, which can bring serious performance penalties in case 
    * of big data arrays.
    */
    get serializeKeys(): boolean {
        return this._serK;
    }
    set serializeKeys(value: boolean) {
        value = wijmo.asBoolean(value);
        if (value !== this._serK) {
            let m = this._map,
                hadMap = m && m.size;
            this._map = null;
            this._serK = value;
            if (hadMap) {
                this.onMapChanged(wijmo.EventArgs.empty);
            }
        }
    }

    /**
     * Gets the {@link ICollectionView} object that contains the map data.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._cv;
    }
    /**
     * Gets the name of the property to use as a key for the item (data value).
     */
    get selectedValuePath(): string {
        return this._keyPath;
    }
    /**
     * Gets the name of the property to use as the visual representation of the item.
     */
    get displayMemberPath(): string {
        return this._displayPath;
    }
    /**
     * Gets the item that corresponds to a given key.
     * 
     * @param key The key of the item to retrieve.
     */
    getDataItem(key: K): V {
        if (!this._map) {
            let arr = this._cv.sourceCollection,
                map = new wijmo._Map(this.serializeKeys);
            if (wijmo.isArray(arr) && this._keyPath) {
                arr.forEach(item => {
                    let k = item[this._keyPath];
                    //assert(hash[k] == null, 'Found duplicate key: ' + k); // TFS 409355
                    if (!map.has(k)) {
                        map.set(k, item);
                    }

                });
            }
            this._map = map;
        }
        return this._map.get(key); // TFS 400029
    }
    /**
     * Gets the display value that corresponds to a given key.
     *
     * @param key The key of the item to retrieve.
     */
    getDisplayValue(key: K): string {
        let path = this._displayPath,
            item = this.getDataItem(key);
        return path && item ? item[path] : key;
    }
    /**
     * Gets the key that corresponds to a given display value.
     *
     * @param displayValue The display value of the item to retrieve.
     * @param html Whether to convert the lookup values from HTML to plain text.
     */
    getKeyValue(displayValue: string, html?: boolean): K {
        let displayPath = this._displayPath,
            index = this._indexOf(displayValue, displayPath, html, true); // case-sensitive first
        if (index < 0) {
            index = this._indexOf(displayValue, displayPath, html, false); // try insensitive
        }
        return index > -1 ? this._cv.sourceCollection[index][this._keyPath] : null;
    }
    /**
     * Gets an array with all of the display values on the map.
     *
     * @param dataItem Data item for which to get the display items.
     * This parameter is optional. If not provided, all possible display
     * values should be returned.
     */
    getDisplayValues(dataItem?: V): string[] {
        return this._cv && this._displayPath
            ? this._cv.items.map(item => item[this._displayPath]) // filtered/sorted values
            : [];
    }
    /**
     * Gets an array with all of the keys on the map.
     */
    getKeyValues(): K[] {
        return this._cv && this._keyPath
            ? this._cv.items.map(item => item[this._keyPath]) // filtered/sorted values
            : [];
    }
    /**
     * Gets or sets a value that indicates whether users should be allowed to enter
     * values that are not present on the {@link DataMap}.
     *
     * In order for a {@link DataMap} to be editable, the {@link selectedValuePath} and
     * {@link displayMemberPath} must be set to the same value.
     */
    get isEditable(): boolean {
        return this._editable;
    }
    set isEditable(value: boolean) {
        this._editable = wijmo.asBoolean(value);
    }
    /**
     * Occurs when the map data changes.
     */
    readonly mapChanged = new wijmo.Event<DataMap, wijmo.EventArgs>();
    /**
     * Raises the {@link mapChanged} event.
     */
    onMapChanged(e?: wijmo.EventArgs) {
        this._map = null;
        this.mapChanged.raise(this, e);
    }

    // implementation

    // gets the index of a value in the sourceCollection (not the view)
    // if the value appears multiple times, returns the first that is not
    // filtered out of view
    private _indexOf(value: any, path: string, html: boolean, caseSensitive: boolean) {
        let index = -1,
            firstMatch = -1;
        if (this._cv && path) {

            // get string to look for
            let strVal = value != null ? value.toString() : '';
            if (strVal && html) { // convert HTML to plain text (TFS 439073)
                value = wijmo.toPlainText(strVal);
            }
            let lcVal = caseSensitive ? strVal : strVal.toLowerCase();

            // look for items
            let items = this._cv.sourceCollection;
            for (let i = 0; i < items.length; i++) {
                let item = items[i],
                    val = item[path];

                // convert HTML to plain text (TFS 276472)
                if (html && wijmo.isString(val)) {
                    val = wijmo.toPlainText(val);
                }

                // straight comparison
                if (val == value) {
                    index = i;
                } else if (!caseSensitive && val.length == lcVal.length && val.toLowerCase() == lcVal) { // case-insensitive
                    index = i;
                } else if (val != null && val.toString() == strVal) { // string-based comparison (like JS objects) 140577
                    index = i;
                }

                // if this is a match and the item passes the filter, we're done
                if (index == i) {
                    if (!this._cv.filter || this._cv.filter(item)) {
                        return index;
                    } else if (firstMatch < 0) {
                        firstMatch = index;
                    }
                }
            }
        }

        // return the first match we found (in sourceCollection but filtered out of view)
        return firstMatch;
    }
}
    }
    


    module wijmo.grid {
    



'use strict';

/**
 * Represents a rectangular group of cells defined by two row indices and
 * two column indices.
 */
export class CellRange {
    _row: number;
    _col: number;
    _row2: number;
    _col2: number;

    /**
     * Initializes a new instance of the {@link CellRange} class.
     *
     * @param r The index of the first row in the range (defaults to -1).
     * @param c The index of the first column in the range (defaults to -1).
     * @param r2 The index of the last row in the range (defaults to <b>r</b>).
     * @param c2 The index of the last column in the range (defaults to <b>c</b>).
     */
    constructor(r = -1, c = -1, r2 = r, c2 = c) {
        this.setRange(r, c, r2, c2);
    }
    /**
     * Initializes an existing {@link CellRange}.
     *
     * @param r The index of the first row in the range (defaults to -1).
     * @param c The index of the first column in the range (defaults to -1).
     * @param r2 The index of the last row in the range (defaults to <b>r</b>).
     * @param c2 The index of the last column in the range (defaults to <b>c</b>).
     */
    setRange(r = -1, c = -1, r2 = r, c2 = c) {
        this._row = wijmo.asInt(r);
        this._col = wijmo.asInt(c);
        this._row2 = wijmo.asInt(r2);
        this._col2 = wijmo.asInt(c2);
    }
    /**
     * Gets or sets the index of the first row in this range.
     */
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        this._row = wijmo.asInt(value);
    }
    /**
     * Gets or sets the index of the first column in this range.
     */
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        this._col = wijmo.asInt(value);
    }
    /**
     * Gets or sets the index of the second row in this range.
     */
    get row2(): number {
        return this._row2;
    }
    set row2(value: number) {
        this._row2 = wijmo.asInt(value);
    }
    /**
     * Gets or sets the index of the second column in this range.
     */
    get col2(): number {
        return this._col2;
    }
    set col2(value: number) {
        this._col2 = wijmo.asInt(value);
    }
    /**
     * Creates a copy of this range.
     */
    clone(): CellRange {
        return new CellRange(this._row, this._col, this._row2, this._col2);
    }
    /**
     * Copies an existing cell range into this one.
     * 
     * @param rng {@link CellRange} to copy into this one.
     */
    copy(rng: CellRange) {
        this.setRange(rng._row, rng._col, rng._row2, rng._col2);
    }
    /**
     * Gets the number of rows in this range.
     */
    get rowSpan(): number {
        return Math.abs(this._row2 - this._row) + 1;
    }
    /**
     * Gets the number of columns in this range.
     */
    get columnSpan(): number {
        return Math.abs(this._col2 - this._col) + 1;
    }
    /**
     * Gets the index of the top row in this range.
     */
    get topRow(): number {
        return Math.min(this._row, this._row2);
    }
    /**
     * Gets the index of the bottom row in this range.
     */
    get bottomRow(): number {
        return Math.max(this._row, this._row2);
    }
    /**
     * Gets the index of the leftmost column in this range.
     */
    get leftCol(): number {
        return Math.min(this._col, this._col2);
    }
    /**
     * Gets the index of the rightmost column in this range.
     */
    get rightCol(): number {
        return Math.max(this._col, this._col2);
    }
    /**
     * Checks whether this range contains valid row and column indices 
     * (row and column values are zero or greater).
     */
    get isValid(): boolean {
        return this._row > -1 && this._col > -1 && this._row2 > -1 && this._col2 > -1;
    }
    /**
     * Checks whether this range corresponds to a single cell.
     */
    get isSingleCell(): boolean {
        return this._row == this._row2 && this._col == this._col2;
    }
    /**
     * Checks whether this range contains another range or a specific cell.
     *
     * @param r The {@link CellRange} or row index to find.
     * @param c The column index (required if the r parameter is not a {@link CellRange} object).
     */
    contains(r: any, c?: number): boolean {

        // first parameter may be a cell range
        let rng = wijmo.tryCast(r, CellRange) as CellRange;
        if (rng) {
            return rng.topRow >= this.topRow && rng.bottomRow <= this.bottomRow &&
                rng.leftCol >= this.leftCol && rng.rightCol <= this.rightCol;
        }

        // check specific cell
        if (wijmo.isInt(r) && wijmo.isInt(c)) {
            return r >= this.topRow && r <= this.bottomRow &&
                c >= this.leftCol && c <= this.rightCol;
        }

        // anything else is an error
        throw 'contains expects a CellRange or row/column indices.';
    }
    /**
     * Checks whether this range contains a given row.
     *
     * @param r The index of the row to find.
     */
    containsRow(r: number): boolean {
        return wijmo.asInt(r) >= this.topRow && r <= this.bottomRow;
    }
    /**
     * Checks whether this range contains a given column.
     *
     * @param c The index of the column to find.
     */
    containsColumn(c: number): boolean {
        return wijmo.asInt(c) >= this.leftCol && c <= this.rightCol;
    }
    /**
     * Checks whether this range intersects another range.
     *
     * @param rng The {@link CellRange} object to check.
     */
    intersects(rng: CellRange): boolean {
        return this.intersectsRow(rng) && this.intersectsColumn(rng);
    }
    /**
     * Checks whether this range intersects the rows in another range.
     *
     * @param rng The {@link CellRange} object to check.
     */
    intersectsRow(rng: CellRange): boolean {
        return rng && !(this.bottomRow < rng.topRow || this.topRow > rng.bottomRow);
    }
    /**
     * Checks whether this range intersects the columns in another range.
     *
     * @param rng The {@link CellRange} object to check.
     */
    intersectsColumn(rng: CellRange): boolean {
        return rng && !(this.rightCol < rng.leftCol || this.leftCol > rng.rightCol);
    }
    /**
     * Gets the rendered size of this range.
     *
     * @param p The {@link GridPanel} object that contains this range.
     * @return A {@link Size} object that represents the sum of row heights and column widths in this range.
     */
    getRenderSize(p: GridPanel): wijmo.Size {
        let sz = new wijmo.Size(0, 0);
        if (this.isValid) {
            for (let r = this.topRow; r <= this.bottomRow; r++) {
                sz.height += p.rows[r].renderSize;
            }
            for (let c = this.leftCol; c <= this.rightCol; c++) {
                sz.width += p.columns[c].renderSize;
            }
        }
        return sz;
    }
    /**
     * Checks whether this range equals another range.
     *
     * @param rng The {@link CellRange} object to compare to this range.
     */
    equals(rng: CellRange): boolean {
        return (rng instanceof CellRange) &&
            this._row == rng._row && this._col == rng._col &&
            this._row2 == rng._row2 && this._col2 == rng._col2;
    }
    /**
     * Returns a new {@link CellRange} that represents the union of
     * this range and another given range.
     * 
     * @param rng {@link CellRange} to combine with this range.
     * @return A {@link CellRange} object that represents the union of 
     * this range and the given range, or this range if the range to 
     * combine with is null.
     */
    combine(rng: CellRange): CellRange {
        if (rng) { // combine
            return new CellRange(
                Math.min(this.topRow, rng.topRow),
                Math.min(this.leftCol, rng.leftCol),
                Math.max(this.bottomRow, rng.bottomRow),
                Math.max(this.rightCol, rng.rightCol)
            );
        }
        return this; // nothing to combine with, return this range
    }
    /**
     * Returns a string representing this {@link CellRange}.
     */
    toString(): string {
        return wijmo.format('({row}, {col})-({row2}, {col2})', this);
    }
}
    }
    


    module wijmo.grid {
    






'use strict';

/**
 * Specifies constants that define the type of cell in a {@link GridPanel}.
 */
export enum CellType {
    /** Unknown or invalid cell type. */
    None,
    /** Regular data cell. */
    Cell,
    /** Column header cell. */
    ColumnHeader,
    /** Row header cell. */
    RowHeader,
    /** Top-left cell (intersection between row headers and column headers). */
    TopLeft,
    /** Column footer cell. */
    ColumnFooter,
    /** Bottom left cell (intersection between row headers and column footers). **/
    BottomLeft
}

/**
 * Represents a logical part of the grid, such as the column headers, row headers,
 * and scrollable data part.
 */
export class GridPanel {
    private _g: FlexGrid;
    private _ct: CellType;
    private _e: HTMLElement;
    private _rows: RowCollection;
    private _cols: ColumnCollection;
    private _offsetY = 0;
    private _activeCell: HTMLElement;
    private _docRange: Range;
    private _rng = new CellRange();
    private _recycle: boolean;
    /*private*/ _vrb: CellRange; // buffered view range, visible to MergeManager
    /*private*/ _vru: CellRange; // unbuffered view range

    // attach index information to cell elements
    // cell[_INDEX_KEY] = { row: r, col: c, panel: this }
    static readonly _INDEX_KEY = 'wj-cell-index';

    // template for createElement
    static readonly _HTML_CELL = '<div class="wj-cell" tabindex="-1"></div>';

    /**
     * Initializes a new instance of the {@link GridPanel} class.
     *
     * @param g The {@link FlexGrid} object that owns the panel.
     * @param cellType The type of cell in the panel.
     * @param rows The rows displayed in the panel.
     * @param cols The columns displayed in the panel.
     * @param host The HTMLElement that hosts the cells in the control.
     */
    constructor(g: FlexGrid, cellType: CellType, rows: RowCollection, cols: ColumnCollection, host: HTMLElement) {
        this._g = wijmo.asType(g, FlexGrid);
        this._ct = wijmo.asInt(cellType);
        this._rows = wijmo.asType(rows, RowCollection);
        this._cols = wijmo.asType(cols, ColumnCollection);
        this._e = wijmo.asType(host, HTMLElement);
        this._vrb = new CellRange();
    }
    /**
     * Gets the grid that owns the panel.
     */
    get grid(): FlexGrid {
        return this._g;
    }
    /**
     * Gets the type of cell contained in the panel.
     */
    get cellType(): CellType {
        return this._ct;
    }
    /**
     * Gets a {@link CellRange} that indicates the range of cells currently visible on the panel.
     */
    get viewRange(): CellRange {
        return this._getViewRange();
    }
    /**
     * Gets the total width of the content in the panel.
     */
    get width(): number {
        return this._cols.getTotalSize();
    }
    /**
     * Gets the total height of the content in this panel.
     */
    get height(): number {
        return this._rows.getTotalSize();
    }
    /**
     * Gets the panel's row collection.
     */
    get rows(): RowCollection {
        return this._rows;
    }
    /**
     * Gets the panel's column collection.
     */
    get columns(): ColumnCollection {
        return this._cols;
    }
    /**
     * Gets the value stored in a cell in the panel.
     *
     * @param r The row index of the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param formatted Whether to format the value for display.
     */
    getCellData(r: number, c: number | string, formatted: boolean): any {
        let g = this._g,
            row = this._rows[wijmo.asNumber(r, false, true)] as Row,
            col: Column,
            value = null;

        // sanity (TFS 457604)
        if (!row) {
            return null;
        }

        // get column index by name or binding
        c = this._toIndex(c);

        // get column and binding column
        col = this._cols[wijmo.asNumber(c as number, false, true)] as Column;
        let bCol = g ? g._getBindingColumn(this, r, col) : col;

        // get CollectionViewGroup
        let group: wijmo.collections.CollectionViewGroup = null;
        if (row instanceof GroupRow && row.dataItem instanceof wijmo.collections.CollectionViewGroup && !g.childItemsPath) {
            group = row.dataItem as wijmo.collections.CollectionViewGroup;
        }

        // get bound value from data item using binding
        if (bCol.binding && row.dataItem && !group) { // TFS 108841
            value = bCol._binding.getValue(row.dataItem);
        } else if (row._ubv) { // get unbound value
            value = row._ubv[col._hash];
        }

        // special values for row and column headers, aggregates
        if (value == null) {
            let CT = CellType;
            switch (this._ct) {
                case CT.TopLeft:
                case CT.ColumnHeader:
                        if (r == this._rows.length - 1 || bCol != col) {
                        value = bCol.header;
                    }
                    break;
                case CT.ColumnFooter:
                    if (row instanceof GroupRow && bCol.aggregate != wijmo.Aggregate.None) {
                        let view = this._g.collectionView;
                        if (view) {
                            let cv = wijmo.tryCast(view, wijmo.collections.CollectionView) as wijmo.collections.CollectionView;
                            value = cv
                                ? cv.getAggregate(bCol.aggregate, bCol.binding)
                                : wijmo.getAggregate(bCol.aggregate, view.items, bCol.binding);
                        }
                    }
                    break;
                case CT.Cell:
                    if (row instanceof GroupRow) {
                        if (c == this._cols.firstVisibleIndex) {
                            value = row.getGroupHeader(); // WJM-19455
                        } else if (group && bCol.aggregate != wijmo.Aggregate.None) {
                            value = group.getAggregate(bCol.aggregate, bCol.binding, this._g.collectionView);
                        }
                    }
                    break;
            }
        }

        // format value if requested, never return null
        if (formatted) {
            let map = bCol.dataMap || row.dataMap; // TFS 431712
            if (this.cellType == CellType.Cell && map) {
                value = map.getDisplayValue(value);
            }
            value = value != null
                ? wijmo.Globalize.format(value, bCol.format || row.format)
                : '';
        }

        // done
        return value;
    }
    /**
     * Sets the content of a cell in the panel.
     *
     * @param r The index of the row that contains the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param value The value to store in the cell.
     * @param coerce Whether to change the value automatically to match the column's data type.
     * @param invalidate Whether to invalidate the grid to show the change.
     * @return Returns true if the value is stored successfully, false otherwise (failed cast).
     */
    setCellData(r: number, c: number | string, value: any, coerce = true, invalidate = true): boolean {
        let g = this._g,
            row = this._rows[wijmo.asNumber(r, false, true)],
            col = this._cols[wijmo.asNumber(this._toIndex(c), false, true)],
            DT = wijmo.DataType;

        // sanity (TFS 457604)
        if (!row) {
            return false;
        }
        
        // get binding column (MultiRow grid may have multiple display columns for each physical column)
        let bCol = g ? g._getBindingColumn(this, r, col) : col,
            map = bCol.dataMap || row.dataMap; // TFS 431712;

        // handle dataMap, coercion, type-checking
        if (this._ct == CellType.Cell) {

            // honor dataMap
            let isRequired = bCol.getIsRequired(row),
                isHtml = bCol.isContentHtml || row.isContentHtml;
            if (map && value != null) {
                let key = map.getKeyValue(value, isHtml); // TFS 276472
                if (key == null && map.getDisplayValue(null) == null) { // bad key
                    if (map.getDisplayValue(value) != value) {
                        // the value looks like a valid key, so keep it (TFS 313308, 316627)
                    } else if (!map.isEditable || map.displayMemberPath != map.selectedValuePath) {
                        if (value == '' && !isRequired) {
                            value = null; // not required, null is OK (TFS 107058, 252638, 426321)
                        } else {
                            return false; // bad key, not editable: cancel edit
                        }
                    }
                } else {
                    value = key; // got the key, use it instead of the value
                }
            }

            // get target type
            let targetType = DT.Object,
                dataType = bCol.dataType || row.dataType,
                originalValue = this.getCellData(r, c, false);
            if (dataType) {
                targetType = dataType;
            } else {
                targetType = wijmo.getType(originalValue);
            }

            // honor 'isRequired' property
            let isNull = value == null || // null and undefined (TFS 367317)
                         (value === '' && !map); // empty strings without dataMaps (TFS 444060)
            if (!isRequired && isNull) {
                if (targetType != DT.String) { // preserve empty strings (TFS 373187)
                    value = null;
                }
                coerce = false;
            } else if (isRequired && isNull && coerce) {
                return false; // value is required
            }

            // coerce type if required
            if (coerce) {
                let format = bCol.format || row.format;
                if (!format && targetType == DT.Date) { // strict format (TFS 408437)
                    format = 'd';
                }
                if (bCol.mask && wijmo.isString(value) && targetType != DT.String) {
                    value = value.replace(/_/g, ''); // remove mask placeholders (TFS 456697)
                }
                value = wijmo.changeType(value, targetType, format, originalValue);
                if (targetType != DT.Object && wijmo.getType(value) != targetType) {
                    return false; // wrong data type
                }
            }
        }

        // store value
        if (row.dataItem && bCol.binding) {
            let binding = bCol._binding,
                item = row.dataItem,
                oldValue = binding.getValue(item);
            if (value !== oldValue && ((map && !map.serializeKeys) || !wijmo.DateTime.equals(value, oldValue))) { // WJM-20497, WJM-20498

                // track changes in CollectionView if this is not the current edit item (e.g. when pasting: WJM-19085)
                let view = g.collectionView as wijmo.collections.CollectionView,
                    trackChange = view instanceof wijmo.collections.CollectionView && item != view.currentEditItem && view.trackChanges,
                    clone = null;
                if (trackChange) { // WJM-19085
                    clone = view._extend({}, item);
                }

                // set the value
                binding.setValue(item, value);

                // track changes in CollectionView
                if (trackChange) {
                    let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, view.items.indexOf(item));
                    view.onCollectionChanged(e);
                    view._trackItemChanged(item, clone); // WJM-19085
                }
            }
        } else {
            if (!row._ubv) {
                row._ubv = {};
            }
            row._ubv[col._hash] = value;
        }

        // invalidate
        if (invalidate && g) {
            g.invalidate();
        }

        // done
        return true;
    }
    /**
     * Gets a cell's bounds in viewport coordinates.
     *
     * The returned value is a {@link Rect} object which contains the position and dimensions 
     * of the cell in viewport coordinates.
     * The viewport coordinates are the same as those used by the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect"
     * target="_blank">getBoundingClientRect</a> method.
     *
     * @param r The index of the row that contains the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param raw Whether to return the rectangle in raw panel coordinates as opposed to viewport coordinates.
     */
    getCellBoundingRect(r: number, c: number | string, raw?: boolean): wijmo.Rect {

        // get rect in panel coordinates
        let g = this._g,
            row = this.rows[r],
            col = this.columns[this._toIndex(c)], // get column index by name or binding (TFS 469765)
            rc = new wijmo.Rect(col.pos, row.pos, col.renderSize, row.renderSize);
        
        // adjust for rtl
        if (g.rightToLeft) {
            rc.left = this.hostElement.clientWidth - rc.right;

            // account for scrollbars (in Chrome and also in Firefox: TFS 240091, 356039)
            if (!wijmo.isIE()) {
                rc.left -= g._root.offsetWidth - g._root.clientWidth;
            }
        }

        // adjust for panel position
        if (!raw) {
            let rcp = this.hostElement.getBoundingClientRect();
            rc.left += rcp.left;
            rc.top += rcp.top - this._offsetY;
        }

        // account for frozen rows/columns (TFS 105593)
        if (r < this.rows.frozen) {
            rc.top -= g.scrollPosition.y;
        }
        if (c < this.columns.frozen) {
            rc.left -= g.scrollPosition.x * (g.rightToLeft ? -1 : +1);
        }

        // done
        return rc;
    }
    /**
     * Gets the element that represents a cell within this {@link GridPanel}.
     *
     * If the cell is not currently in view, this method returns null.
     *
     * @param r The index of the row that contains the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     */
    getCellElement(r: number, c: number | string): HTMLElement {
        let rows = this.hostElement.children,
            nrows = Math.min(r + 2, rows.length);
        
        // get column index by name or binding
        c = this._toIndex(c);

        // scan the elements to find r/c
        for (let i = 0; i < nrows; i++) {
            let row = rows[i].children,
                ncols = Math.min(c + 2, row.length);
            for (let j = 0; j < ncols; j++) {
                let cell = row[j],
                    index = cell[GridPanel._INDEX_KEY];
                if (index) {
                    if ((index.row == r && index.col == c) ||
                        (index.rng && index.rng.contains(r, c))) {
                        return cell as HTMLElement;
                    }
                }
            }
        }
        return null;
    }
    /**
     * Gets a {@link SelectedState} value that indicates the selected state of a cell.
     *
     * @param r Row index of the cell to inspect.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param rng {@link CellRange} that contains the cell to inspect.
     */
    getSelectedState(r: number, c: number | string, rng?: CellRange): SelectedState {
        let g = this._g,
            mode = g.selectionMode,
            sel = g._selHdl.selection,
            SM = SelectionMode,
            SS = SelectedState;

        // special case: no selection
        if (mode == SM.None) {
            return SS.None;
        }

        // get column index by name or binding
        c = this._toIndex(c);

        // selection depends on panel type
        switch (this._ct) {

            // regular cells
            case CellType.Cell:
                if (!rng) { // handle merged ranges
                    rng = g.getMergedRange(this, r, c);
                }
                if (rng) {
                    if (rng.contains(sel.row, sel.col)) {
                        return g.showMarquee ? SS.Active : SS.Cursor; // TFS 362719
                    }
                    if (rng.intersects(sel) && mode != SM.ListBox) { // TFS 429784, 457641
                        return SS.Selected;
                    }
                    for (let mc = rng.leftCol; mc <= rng.rightCol; mc++) {
                        if (g.columns[mc].isSelected) {
                            return SS.Selected;
                        }
                    }
                    for (let mr = rng.topRow; mr <= rng.bottomRow; mr++) {
                        if (g.rows[mr].isSelected) {
                            return SS.Selected;
                        }
                    }
                }

                // cursor
                if (sel.row == r && sel.col == c) {
                    return g.showMarquee ? SS.Active : SS.Cursor;
                }

                // special case: row/col selected property
                if (g.rows[r].isSelected || g.columns[c].isSelected) {
                    return SS.Selected;
                }

                // special case: extended selection
                if (mode == SM.MultiRange) {
                    let xSel = g._selHdl.extendedSelection;
                    for (let i = 0; i < xSel.length; i++) {
                        if (xSel[i].contains(r, c) || (rng && rng.intersects(xSel[i]))) {
                            return SS.Selected;
                        }
                    }
                }

                // special case for merged cells with row-style selection (TFS 294209, 415697)
                if (rng) {
                    switch (mode) {
                        case SM.Row:
                        case SM.RowRange:
                        //case SM.ListBox: // TFS 457641
                            if (rng.containsRow(sel.row)) {
                                return SS.Selected;
                            }
                    }
                }

                // ListBox mode (already checked for selected rows/cols) // TFS 369493
                // this is important so users can de-select rows in ListBox mode // TFS 371855
                if (mode == SM.ListBox) {
                    return SS.None;
                }

                // adjust for selection mode
                sel = this._getAdjustedSelection(sel);

                // regular ranges
                return sel.containsRow(r) && sel.containsColumn(c)
                    ? SS.Selected
                    : SS.None;

            // column headers
            case CellType.ColumnHeader:
                if (g.showSelectedHeaders & HeadersVisibility.Column) {
                    if (g.columns[c].isSelected || sel.containsColumn(c) || sel.intersectsColumn(rng)) {
                        if (rng) r = rng.bottomRow;
                        if (r == this.rows.length - 1) {
                            return SS.Selected;
                        }
                    }
                }
                break;

            // row headers
            case CellType.RowHeader:
                if (g.showSelectedHeaders & HeadersVisibility.Row) {
                    if (g.rows[r].isSelected || sel.containsRow(r) || sel.intersectsRow(rng)) {
                        if (rng) c = rng.rightCol;
                        if (c == this.columns.length - 1) {
                            return SS.Selected;
                        }
                    }
                }
                break;
        }

        // not selected
        return SS.None;
    }
    /**
     * Gets the host element for the panel.
     */
    get hostElement(): HTMLElement {
        return this._e;
    }

    // ** implementation

    // converts a column name/binding into an index
    _toIndex(c: number | string): number {
        if (wijmo.isString(c)) {
            c = this._cols.indexOf(c);
            if (c < 0) {
                throw 'Invalid column name or binding.';
            }
        }
        return c;
    }

    // get selection adjusted for selectionMode
    _getAdjustedSelection(sel: CellRange): CellRange {
        let g = this._g,
            rng = this._rng,
            SM = SelectionMode;
        switch (g.selectionMode) {
            case SM.Cell:
                rng.setRange(sel.row, sel.col, sel.row, sel.col);
                break;
            case SM.Row:
                rng.setRange(sel.row, 0, sel.row, g.columns.length - 1);
                break;
            case SM.RowRange:
            case SM.ListBox:
                rng.setRange(sel.row, 0, sel.row2, g.columns.length - 1);
                break;
            default:
                rng.copy(sel);
        }

        // done
        return rng;
    }

    // gets the Y offset for cells in the panel.
    _getOffsetY(): number {
        return this._offsetY;
    }

    // updates the cell elements in the panel.
    // recycle Whether to recycle existing elements or start from scratch.
    // state Whether to keep existing elements and update their state.
    // offsetY Scroll position to use when updating the panel.
    _updateContent(recycle: boolean, state: boolean, offsetY: number): HTMLElement {
        let g = this._g,
            host = this._e,
            rows = this._rows,
            cols = this._cols,
            ct = this._ct;

        // scroll headers into position
        if (ct == CellType.ColumnHeader || ct == CellType.ColumnFooter || ct == CellType.RowHeader) {
            let sp = g._ptScrl,
                s = host.style;
            if (ct == CellType.RowHeader) { // scroll row headers vertically
                s.top = sp.y + 'px';
            } else { // scroll column headers/footers horizontally
                if (g.rightToLeft) {
                    s.right = sp.x + 'px';
                } else {
                    s.left = sp.x + 'px';
                }
            }
        }

        // update offset (and don't recycle if it changed!)
        if (this._offsetY != offsetY) {
            recycle = false;
            this._offsetY = offsetY;
        }

        // calculate new un-buffered view range
        let vru = this._getViewRange();

        // calculate new buffered view range
        let vrb = vru;
        if (vrb.isValid) {
            let xRows = (rows.length <= g._vtRows) ? rows.length : 0,
                xCols = (cols.length <= g._vtCols) ? cols.length : 0;
            vrb = new CellRange(
                Math.max(vru.row - xRows, rows.frozen),
                Math.max(vru.col - xCols, cols.frozen),
                Math.min(vru.row2 + xRows, rows.length - 1),
                Math.min(vru.col2 + xCols, cols.length - 1)
            );
        }

        // done if recycling, not updating state, and old range contains new (unbuffered)
        // this happens a lot while scrolling by small amounts (< 1 cell)
        if (recycle && !state && this._vrb.contains(vru) && !rows.frozen && !cols.frozen) {
            return this._activeCell;
        }

        // if not recycling or if the range changed, can't just update state
        if (!recycle || !vrb.equals(this._vrb)) {
            state = false;
        }

        // reorder cells to optimize scrolling (headers too)
        if (recycle && !state && this._ct != CellType.TopLeft) {
            this._reorderCells(vrb, this._vrb);
        }

        // reset active cell
        this._activeCell = null;

        // save new ranges
        this._vru = vru;
        this._vrb = vrb;

        // save recycle state
        this._recycle = recycle;

        // add dummy column header row to cells panel
        // (for accessibility only)
        let ctr = 0;
        if (this._ct == CellType.Cell) {
            ctr = this._renderColHdrRow(vrb, state);
        }

        // go create/update the cells
        for (let r = 0; r < rows.frozen && r < rows.length; r++) {
            ctr = this._renderRow(r, vrb, state, ctr);
        }
        for (let r = vrb.topRow; r <= vrb.bottomRow && r > -1; r++) {
            ctr = this._renderRow(r, vrb, state, ctr);
        }

        // remove extra rows
        while (host.childElementCount > ctr) {
            let row = host.lastElementChild as HTMLElement;
            wijmo.removeChild(row); // TFS 472384
            this._removeExtraCells(row, 0);
        }

        // done
        return this._activeCell;
    }

    // clear all cell elements
    _clearCells() {
        let host = this.hostElement,
            cf = this._g.cellFactory;
        for (let i = host.childElementCount - 1; i >= 0; i--) {
            let row = host.children[i];
            wijmo.removeChild(row); // TFS 472384
            for (let j = row.childElementCount - 1; j >= 0; j--) {
                cf.disposeCell(row.children[j] as HTMLElement);
            }
        }
    }

    // reorder cells within the panel to optimize scrolling performance
    // NOTE: the elements being re-ordered (rows/cells) must be absolutely positioned,
    // or Chrome may change the scrollPosition and cause flicker (TFS 261344)
    //
    // We pursue the following goals here:
    // - Row elements representing rows from the intersection of the new and old ranges (i.e. the ones
    //   that stay visible after scrolling) should render the same grid items as in the previous rendering.
    //   This will prevent framework cell templates and row details from redrawing for different data context 
    //   until they leave the viewport.
    //   For this, we add (scroll up) or remove (scroll down) rows above the first row in the ranges intersection.
    // - When we add or remove rows, we try to move existing "unnecessary" rows (which left the viewport) to fill the gap,
    //   and only if there are not enough "unnecessary" rows, we create additional new ones. This is necessary to 
    //   keep cell templates already instantiated in the cells for the new render cycle, instead of creating new ones, 
    //   to re-use them and improve scrolling performance this way.
    // - The same symmetrical logic is applied to the cell elements inside row elements in case of horizontal scrolling.
    _reorderCells(rngNew: CellRange, rngOld: CellRange) {

        // check whether we really have to do this
        if (!this._g._reorderCells ||
            !rngOld.isValid || !rngNew.isValid || !rngNew.intersects(rngOld)) {
            return;
        }

        // Pads first child element (row or cell) in the new viewport with another elements in case of 
        // scroll up/left, trying to use as many existing unnecessary elements for this, and adding
        // new ones only if number of existing elements is not enough.
        const relocateForScrollToBeginning = (parentElement: Element, firstChild: number, scrollDelta: number,
                rngNewBottom: number, rngOldTop: number, className: string) => {
            wijmo.assert(scrollDelta < 0, "Scroll delta must be a negative number");
            let absDelta = -scrollDelta,
                // number of row elements in viewports intersection which should be kept
                keepCount = rngNewBottom - rngOldTop + 1,
                // index of the first row element which must be relocated
                firstMove = firstChild + keepCount,
                // number of existing row elements available for relocation
                availableCount = parentElement.childElementCount - firstMove,
                // number of existing row elements that should be relocated
                moveCount: number,
                // number of new row elements that must be additionally created, if there
                // are not enough existing rows to pad at the top
                newCount: number;
            if (availableCount < absDelta) {
                moveCount = availableCount;
                newCount = absDelta - availableCount;
            } else {
                moveCount = absDelta;
                newCount = 0;
            }
            //console.log(`relocation ${className}: moveCount = ${moveCount}, newCount = ${newCount}, elements = ${parentElement.childElementCount}`)
            // relocate existing row elements
            if (moveCount > 0) {
                let rng = this._createRange(parentElement, firstMove, firstMove + moveCount);
                if (rng) {
                    parentElement.insertBefore(rng.extractContents(), parentElement.children[firstChild]);
                }
            }
            // add new row elements
            if (newCount > 0) {
                let ref = parentElement.children[firstChild];
                for (let i = 0; i < newCount; i++) {
                    let newEl = document.createElement('div');
                    newEl.className = className;
                    parentElement.insertBefore(newEl, ref);                            
                }
            }
        }

        // vertical scrolling
        if (rngNew.row != rngOld.row) {
            let host = this._e,
                delta = rngNew.row - rngOld.row;
                //limit = Math.max(1, rngNew.rowSpan - 1);
            if (delta != 0 /*&& Math.abs(delta) < limit*/) {

                // keep fake column header row in view
                let first = this._ct == CellType.Cell ? 1 : 0,
                    cnt = host.childElementCount;

                // account for frozen rows
                first += this.rows.frozen;

                // down: remove rows from the top and append to bottom
                if (delta > 0) {
                    let start = first,
                        end = Math.min(first + delta, cnt/* - 1*/), // TFS 378202
                        rng = this._createRange(host, start, end);
                    if (rng) {
                        host.appendChild(rng.extractContents());
                    }
                }
                // up: remove rows from the bottom and insert at the top
                else { // delta < 0
                    relocateForScrollToBeginning(host, first, delta, rngNew.row2, rngOld.row, 'wj-row');
                }
            }
        }

        // horizontal scrolling
        if (rngNew.col != rngOld.col) {
            let host = this._e,
                delta = rngNew.col - rngOld.col;
                //limit = Math.max(1, rngNew.columnSpan - 1);
            if (delta != 0 /*&& Math.abs(delta) < limit*/) {

                // keep fake row header cell in view
                let first = this._ct == CellType.Cell && this._g.rowHeaderPath ? 1 : 0;

                // account for frozen columns
                first += this.columns.frozen;

                // loop through the row elements
                for (let i = 0; i < host.children.length; i++) {
                    let row = host.children[i],
                        cnt = row.children.length;
                    if (wijmo.hasClass(row, 'wj-row')) {
                        // right: remove cells from start and append to row
                        if (delta > 0) {
                            let start = first,
                                end = Math.min(first + delta, cnt/*- 1*/), // TFS 378202
                                rng = this._createRange(row, start, end);
                            if (rng) {
                                row.appendChild(rng.extractContents());
                            }
                        }
                        // left: remove cells from end and insert at row start
                        else { // delta < 0
                            relocateForScrollToBeginning(row, first, delta, rngNew.col2, rngOld.col, 'wj-cell');
                        }
                    }
                }
            }
        }
    }

    // creates a range of cells that can be moved to optimize rendering
    _createRange(host: Element, start: number, end: number): Range {
        if (end > start && end <= host.children.length && start > -1) {
            if (!this._docRange) {
                this._docRange = document.createRange();
            }
            let rng = this._docRange;
            rng.setStart(host, start);
            rng.setEnd(host, end);
            return rng;
        }
        return null;
    }

    // renders a hidden header row that keeps accessibility tools happy
    _renderColHdrRow(rng: CellRange, state: boolean): number {

        // no need to update this when rendering state
        if (state) {
            return 1;
        }

        // create row element, add to panel 
        let row = this._e.children[0] as HTMLElement;
        if (!row) {
            row = wijmo.createElement('<div class="wj-row" role="row"></div>', this._e);
        }

        // apply aria attributes
        let g = this._g,
            ariaLabel = g ? g.columnHeaders.rows.ariaLabel : null;
        wijmo.setAttribute(row, 'aria-label', ariaLabel);
        wijmo.setAttribute(row, 'aria-selected', null);

        // add row header cell
        let ctc = 0,
            rhBinding = this._g._getRowHeaderPath();
        if (rhBinding) {
            ctc = this._renderRowHdrCell(row, -1, rhBinding.path);
        }

        // add cells to visible columns
        for (let c = 0; c < this.columns.frozen && c < this.columns.length; c++) {
            ctc = this._renderColHdrCell(row, c, rng, state, ctc);
        }
        for (let c = rng.leftCol; c <= rng.rightCol && c > -1; c++) {
            ctc = this._renderColHdrCell(row, c, rng, state, ctc);
        }

        // remove extra cells from header row (TFS 260932)
        this._removeExtraCells(row, ctc);

        // created a row
        return 1;
    }

    // renders a cell in the hidden header row that keeps accessibility tools happy
    _renderColHdrCell(row: HTMLElement, c: number, rng: CellRange, state: boolean, ctr: number): number {
        let g = this.grid;

        // skip hidden columns
        let col = this.columns[c] as Column;
        if (col.renderSize <= 0) {
            return ctr;
        }

        // state doesn't affect column header cells (they can't be selected)
        if (state) {
            return ctr + 1;
        }

        // recycle or create the cell
        let cell = row.children[ctr] as HTMLElement;
        if (!cell) {
            cell = wijmo.createElement(GridPanel._HTML_CELL, row);
        }
        wijmo.setAttribute(cell, 'role', 'columnheader');

        // lazy render mode: skip existing cells that have the right coordinates
        if (cell && this._recycle && g._lazyRender) {
            let index = cell[GridPanel._INDEX_KEY];
            if (index && index.row == -1 && index.col == c) {
                if (c >= this.columns.frozen) {
                    return ctr + 1;
                }
            }
        }

        // set cell content and style
        cell.textContent = this.columns[c].header;
        wijmo.setCss(cell, {
            position: 'fixed',
            left: col.pos,
            top: -32000,
            width: col.renderSize,
            height: .1,
            overflow: 'hidden',
            opacity: '0',
            pointerEvents: 'none'
        });

        // add aria-describedby attribute to column header cell
        if (col.describedById || this.columns.describedById) {
            let descBy = [col.describedById, this.columns.describedById].join(' ').trim();
            wijmo.setAttribute(cell, 'aria-describedby', descBy ? descBy : null);
        }

        // more column header accessibility 
        // https://www.w3.org/WAI/PF/aria/roles#columnheader
        if (g.allowSorting) { // https://www.w3.org/TR/wai-aria-1.1/#aria-sort
            let attVal = 'none',
                bCol = g._getBindingColumn(this, 0, col);
            switch (bCol.currentSort) {
                case '+':
                    attVal = 'ascending';
                    break;
                case '-':
                    attVal = 'descending';
                    break;
            }
            wijmo.setAttribute(cell, 'aria-sort', attVal);
        }
        if (!g.isReadOnly) {
            wijmo.setAttribute(cell, 'aria-readonly', col.isReadOnly);
            wijmo.setAttribute(cell, 'aria-required', col.getIsRequired());
        }

        // save cell coordinates
        cell[GridPanel._INDEX_KEY] = { row: -1, col: c, panel: this };

        // done
        return ctr + 1;
    }

    // renders a row header cell
    _renderRowHdrCell(row: HTMLElement, r: number, value: any): number {

        // create or recycle cell
        let cell = row.children[0] as HTMLElement;
        if (!cell) {
            cell = wijmo.createElement(GridPanel._HTML_CELL, row);
        }

        // set cell content and style
        cell.setAttribute('role', r < 0 ? 'columnheader' : 'rowheader');
        cell.textContent = value ? value.toString() : '';
        wijmo.setCss(cell, {
            position: 'fixed',
            left: -32000,
            top: -32000,
            width: .1,
            height: .1,
            overflow: 'hidden',
            opacity: '0'
        });

        // save cell coordinates
        cell[GridPanel._INDEX_KEY] = { row: r, col: -1, panel: this };

        // done
        return 1;
    }

    // renders a row
    _renderRow(r: number, rng: CellRange, state: boolean, ctr: number): number {

        // skip invisible rows
        let g = this._g,
            gr = this.rows[r] as Row,
            sz = gr.renderSize;
        if (sz <= 0) {
            return ctr;
        }

        // create row element, add to panel
        let row = this._e.children[ctr] as HTMLElement;
        if (!row) {
            row = wijmo.createElement('<div class="wj-row"></div>', this._e);
        }

        // accessibility
        // (MS request: tag selected rows in ListBox mode)
        if (this._ct == CellType.Cell) {
            row.setAttribute('role', 'row');
            let SM = SelectionMode,
                selected = gr.isSelected;
            switch (g.selectionMode) {
                case SM.Row:
                case SM.RowRange:
                //case SM.ListBox: // TFS 456518
                    selected = selected || this._g._selHdl.selection.containsRow(r);
            }
            wijmo.setAttribute(row, 'aria-selected', selected ? true : null);
            wijmo.setAttribute(row, 'aria-level', gr instanceof GroupRow ? gr.level + 1 : null);
            wijmo.setAttribute(row, 'aria-expanded', gr instanceof GroupRow ? !gr.isCollapsed : null);
            if (this.rows.ariaLabel) {
                wijmo.setAttribute(row, 'aria-label', this.rows.ariaLabel);
            }
        }

        // add row header cell
        let ctc = 0;
        if (this._ct == CellType.Cell) {
            let rhBinding = this._g._getRowHeaderPath();
            if (rhBinding) {
                ctc = this._renderRowHdrCell(row, r, rhBinding.getValue(gr.dataItem));
            }
        }

        // add cells to visible columns
        for (let c = 0; c < this.columns.frozen && c < this.columns.length; c++) {
            ctc = this._renderCell(row, r, c, rng, state, ctc);
        }
        for (let c = rng.leftCol; c <= rng.rightCol && c > -1; c++) {
            ctc = this._renderCell(row, r, c, rng, state, ctc);
        }

        // remove extra cells from this row
        this._removeExtraCells(row, ctc);

        // done
        return ctr + 1;
    }

    // renders a cell
    _renderCell(row: HTMLElement, r: number, c: number, rng: CellRange, state: boolean, ctr: number): number {

        // skip over cells that have been merged over
        let g = this._g,
            mRng = g.getMergedRange(this, r, c);
        if (mRng) {
            for (let over = Math.max(rng.row, mRng.row); over < r; over++) { // TFS 409208
                if (this.rows[over].renderSize) { // TFS 408798
                    return ctr;
                }
            }
            for (let over = Math.max(rng.col, mRng.col); over < c; over++) { // TFS 409208
                if (this.columns[over].renderSize) { // TFS 408798
                    return ctr;
                }
            }

            // merged columns spanning over frozen boundary
            // (rare case, should only happen in row detail cells, TFS 334758)
            var fCols = this.columns.frozen;
            if (fCols && mRng.col < fCols && mRng.col2 >= fCols && c > mRng.col) {
                return ctr;
            }
        }

        // skip hidden and non-merged columns
        let col = this.columns[c] as Column;
        if (col.renderSize <= 0) {
            if (!mRng || mRng.getRenderSize(this).width <= 0) {
                return ctr;
            }
        }

        // try recycling a cell
        let cell = row.children[ctr] as HTMLElement;

        // lazy render mode: skip existing cells that have the right coordinates
        if (cell && !state && this._recycle && g._lazyRender && !g.activeEditor) {
            let index = cell[GridPanel._INDEX_KEY];
            if (index && index.row == r && index.col == c && index.rng == mRng) {
                if (r >= this.rows.frozen && c >= this.columns.frozen) {
                    state = true;
                }
            }
        }

        // update selected state
        let ss = SelectedState,
            selState = this.getSelectedState(r, c, mRng),
            activeCell = selState == ss.Cursor || selState == ss.Active;
        if (cell && state) {
            wijmo.toggleClass(cell, 'wj-state-active', activeCell);
            wijmo.toggleClass(cell, 'wj-state-selected', selState == ss.Cursor);
            wijmo.toggleClass(cell, 'wj-state-multi-selected', selState == ss.Selected);
            wijmo.setAttribute(cell, 'aria-selected', (activeCell || selState != ss.None) ? true : null);
            if (activeCell) {
                this._activeCell = cell;
            }
            return ctr + 1;
        }

        // create or recycle cell
        if (!cell) {
            cell = wijmo.createElement(GridPanel._HTML_CELL, row);
        }

        // remember the active cell in this panel
        if (activeCell) {
            this._activeCell = cell;
        }

        // accessibility
        if (this._ct == CellType.Cell) {
            wijmo.setAttribute(cell, 'role', 'gridcell');
            wijmo.setAttribute(cell, 'aria-selected', (selState != ss.None || activeCell) ? true : null);
            wijmo.setAttribute(cell, 'aria-readonly', !g.canEditCell(r, c) ? true : null);
            wijmo.setAttribute(cell, 'aria-required', col.getIsRequired());
            //setAttribute(cell, 'aria-colindex', col.visibleIndex + 1);
            //setAttribute(cell, 'aria-rowspan', mrng && mrng.rowSpan > 1 ? mrng.rowSpan : null);
            //setAttribute(cell, 'aria-colspan', mrng && mrng.columnSpan > 1 ? mrng.columnSpan : null);
        }

        // set/update cell content/style (after setting all attributes)
        g.cellFactory.updateCell(this, r, c, cell, mRng);

        // save cell coordinates
        cell[GridPanel._INDEX_KEY] = { row: r, col: c, rng: mRng, panel: this };

        // done
        return ctr + 1;
    }

    // remove extra cells from a row element
    _removeExtraCells(row: HTMLElement, count: number) {
        let cf = this._g.cellFactory;
        while (row.childElementCount > count) {
            let cell = row.lastElementChild as HTMLElement;
            wijmo.removeChild(cell); // TFS 472384
            cf.disposeCell(cell);
        }
    }

    // gets the range of cells currently visible
    _getViewRange(): CellRange {
        let g = this._g,
            sp = g._ptScrl,
            sz = g._szClientSB, // TFS 457368
            rows = this._rows,
            cols = this._cols,
            rng = new CellRange(0, 0, rows.length - 1, cols.length - 1);

        // calculate row range
        if (this._ct == CellType.Cell || this._ct == CellType.RowHeader) {
            let y = -sp.y + this._offsetY,
                h = sz.height,
                fz = Math.min(rows.frozen, rows.length - 1);

            // account for frozen rows
            if (fz > 0) {
                let fzs = rows[fz - 1].pos;
                y += fzs;
                h -= fzs;
            }

            // set row range
            if (fz > 0 && rows[fz].pos > sz.height) {
                rng.row = rng.row2 = -1; // frozen rows fill the viewport (TFS 444259)
            } else {
                rng.row = Math.min(rows.length - 1, Math.max(fz, rows.getItemAt(y)));
                rng.row2 = Math.max(rng.row, rows.getItemAt(y + h)); // TFS 273979, 316887
            }

            // clip to screen (in case user didn't limit the grid height)
            let host = g.hostElement;
            if (g._clipToScreen && host) {
                let rc = host.getBoundingClientRect(),
                    top = -rc.top - g.cells._e.offsetTop; // TFS 401015
                if (rc.top < 0) {
                    rng.row = Math.max(rng.row, rows.getItemAt(top) - 1);
                    //console.log('clipped top row => ' + rng.row);
                }
                if (rc.bottom > innerHeight) {
                    rng.row2 = Math.min(rng.row2, rows.getItemAt(top + innerHeight) + 1);
                    //console.log('clipped bot row => ' + rng.row2);
                }
            }
        }

        // calculate column range
        if (this._ct == CellType.Cell || this._ct == CellType.ColumnHeader) {
            let x = -sp.x,
                w = sz.width,
                fz = Math.min(cols.frozen, cols.length - 1);

            // account for frozen columns
            if (fz > 0) {
                let fzs = cols[fz - 1].pos;
                x += fzs;
                w -= fzs;
            }

            // set column range
            if (fz > 0 && cols[fz].pos > sz.width) {
                rng.col = rng.col2 = -1; // frozen columns fill the viewport (TFS 444259)
            } else {
                rng.col = Math.min(cols.length - 1, Math.max(fz, cols.getItemAt(x))); // TFS 438008
                rng.col2 = Math.max(rng.col, cols.getItemAt(x + w)); // TFS 273979, 316887
            }
        }

        // handle case where all rows/cols are frozen
        if (rows.length <= rows.frozen) {
            rng.row = rng.row2 = -1;
        }
        if (cols.length <= cols.frozen) {
            rng.col = rng.col2 = -1;
        }

        // return the viewRange
        return rng;
    }

    // gets the point where the frozen area ends
    _getFrozenPos(): wijmo.Point {
        let fzr = this._rows.frozen,
            fzc = this._cols.frozen,
            fzRow = fzr > 0 ? this._rows[fzr - 1] : null,
            fzCol = fzc > 0 ? this._cols[fzc - 1] : null,
            fzy = fzRow ? fzRow.pos + fzRow.renderSize : 0,
            fzx = fzCol ? fzCol.pos + fzCol.renderSize : 0;
        return new wijmo.Point(fzx, fzy);
    }
}
    }
    


    module wijmo.grid {
    





'use strict';

/**
 * Provides arguments for {@link CellRange} events.
 */
export class CellRangeEventArgs extends wijmo.CancelEventArgs {
    _p: GridPanel;
    _rng: CellRange;
    _data: any;

    /**
     * Initializes a new instance of the {@link CellRangeEventArgs} class.
     *
     * @param p {@link GridPanel} that contains the range.
     * @param rng Range of cells affected by the event.
     * @param data Data related to the event.
     */
    constructor(p: GridPanel, rng: CellRange, data?: any) {
        super();
        this._p = wijmo.asType(p, GridPanel, true);
        this._rng = wijmo.asType(rng, CellRange, true);
        this._data = data;
    }
    /**
     * Gets the {@link GridPanel} affected by this event.
     */
    get panel(): GridPanel {
        return this._p;
    }
    /**
     * Gets the {@link CellRange} affected by this event.
     */
    get range(): CellRange {
        return this._rng.clone();
    }
    /**
     * Gets the index of the row affected by this event.
     * 
     * To get the {@link Row} object, use the {@link getRow} method.
     */
    get row(): number {
        return this._rng.row;
    }
    /**
     * Gets the index of the column affected by this event.
     * 
     * To get the {@link Column} object, use the {@link getColumn} method.
     */
    get col(): number {
        return this._rng.col;
    }
    /**
     * Gets or sets the data associated with the event.
     */
    get data(): any {
        return this._data;
    }
    set data(value: any) {
        this._data = value;
    }
    /**
     * Gets the {@link Row} affected by this event.
     * 
     * To get the row index, use the {@link row} property.
     */
    getRow(): Row {
        return this._p && this.row > -1
            ? this._p.rows[this.row]
            : null;
    }
    /**
     * Gets the {@link Column} affected by this event.
     * 
     * To get the column index, use the {@link col} property.
     * 
     * @param binding Whether to get the column by index or by binding.
     * This parameter only makes a difference in grids that have multiple 
     * rows per data item (like the {@link MultiRow} grid).
     */
    getColumn(binding?: boolean): Column {
        let p = this._p,
            col = p && this.col > -1 ? p.columns[this.col] : null;
        if (col && binding) {
            // get column group for column header, and binding column otherwise
            let g = p.grid;
            if (p.cellType === CellType.ColumnHeader && g._hasColumnGroups()) {
                col = g._getColumnGroup(this.row, this.col);
            } else {
                col = p.grid._getBindingColumn(p, this.row, col)
            }
        }
        return col;
    }
}

/**
 * Provides arguments for the {@link FlexGrid.formatItem} event.
 */
export class FormatItemEventArgs extends CellRangeEventArgs {
    _cell: HTMLElement;
    _updateContent = true;

    /**
    * Initializes a new instance of the {@link FormatItemEventArgs} class.
    *
    * @param p {@link GridPanel} that contains the range.
    * @param rng Range of cells affected by the event.
    * @param cell Element that represents the grid cell to be formatted.
    * @param updateContent Whether to set the cell content in addition to its dimensions and styles.
    */
    constructor(p: GridPanel, rng: CellRange, cell: HTMLElement, updateContent = true) {
        super(p, rng);
        this._cell = wijmo.asType(cell, HTMLElement);
    }
    /**
     * Gets a reference to the element that represents the grid cell to be formatted.
     */
    get cell(): HTMLElement {
        return this._cell;
    }
    /**
     * Gets a value that determines whether the handler should set the cell content
     * in addition to its dimensions and styles.
     */
    get updateContent(): boolean {
        return this._updateContent;
    }
}

/**
 * Provides arguments for the {@link FlexGrid.cellEditEnding} event.
 */
export class CellEditEndingEventArgs extends CellRangeEventArgs {
    _stayInEditMode = false;
    _refresh = true;

    /**
     * Gets or sets whether the cell should remain in edit mode 
     * instead of finishing the edits.
     */
    get stayInEditMode(): boolean {
        return this._stayInEditMode;
    }
    set stayInEditMode(value: boolean) {
        this._stayInEditMode = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should 
     * refresh all its contents after the edits are done.
     */
    get refresh(): boolean {
        return this._refresh;
    }
    set refresh(value: boolean) {
        this._refresh = wijmo.asBoolean(value);
    }
}
    }
    


    module wijmo.grid {
    





'use strict';

/**
 * Specifies constants that define the selection behavior.
 */
export enum SelectionMode {
    /** The user cannot select cells using the mouse or keyboard. */
    None,
    /** The user can select only a single cell at a time. */
    Cell,
    /** The user can select contiguous blocks of cells. */
    CellRange,
    /** The user can select a single row at a time. */
    Row,
    /** The user can select contiguous rows. */
    RowRange,
    /** The user can select non-contiguous rows by ctrl+clicking. */
    ListBox,
    /** The user can select multiple ranges by ctrl+clicking and dragging the mouse. */
    MultiRange
}

/**
 * Specifies constants that represent the selected state of a cell.
 */
export enum SelectedState {
    /** The cell is not selected. */
    None,
    /** The cell is selected but is not the active cell. */
    Selected,
    /** The cell is selected and is the active cell. */
    Cursor,
    /** The cell is active cell but not in a selected state. */
    Active
}

/**
 * Specifies constants that represent a type of movement for the selection.
 */
export enum SelMove {
    /** Do not change the selection. */
    None,
    /** Select the next visible cell. */
    Next,
    /** Select the previous visible cell. */
    Prev,
    /** Select the first visible cell in the next page. */
    NextPage,
    /** Select the first visible cell in the previous page. */
    PrevPage,
    /** Select the first visible cell. */
    Home,
    /** Select the last visible cell. */
    End,
    /** Select the next visible cell skipping columns and rows if necessary. */
    NextCell,
    /** Select the previous visible cell skipping columns and rows if necessary. */
    PrevCell,
    /** Select the next visible and editable cell skipping columns and rows if necessary. */
    NextEditableCell,
    /** Select the previous visible cell skipping columns and rows if necessary. */
    PrevEditableCell,
}

/**
 * Handles the grid's selection.
 */
export class _SelectionHandler {
    private _g: FlexGrid;
    private _sel = new CellRange(0, 0);
    private _xSel = new wijmo.collections.ObservableArray<CellRange>();
    private _e: CellRangeEventArgs;
    private _mode = SelectionMode.CellRange;

    /**
     * Initializes a new instance of the {@link _SelectionHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _SelectionHandler}.
     */
    constructor(g: FlexGrid) {
        this._g = g;
        this._e = new CellRangeEventArgs(g.cells, new CellRange(0, 0));
        this._xSel.collectionChanged.addHandler(() => {
            g.invalidate();
        });
    }

    /**
     * Gets or sets the current selection mode.
     */
    get selectionMode(): SelectionMode {
        return this._mode;
    }
    set selectionMode(value: SelectionMode) {
        if (value != this._mode) {
            this._setSelectionMode(value);
        }
    }
    /**
     * Gets or sets the current selection.
     */
    get selection(): CellRange {
        return this._sel;
    }
    set selection(value: CellRange) {
        this.select(value);
    }
    /**
     * Gets an array with {@link CellRange} objects that are part of
     * the grid's extended selection.
     */
    get extendedSelection(): wijmo.collections.ObservableArray<CellRange> {
        return this._xSel;
    }
    /**
     * Selects a cell range and optionally scrolls it into view.
     *
     * @param rng Range to select (or index of the row to select).
     * @param show Whether to scroll the new selection into view (or index/name of the column to select).
     * @param force Whether to update the selection even if the {@link selectionChanging} 
     * event cancels the change.
     */
    select(rng: CellRange | number, show: boolean | number | string = true, force = false): boolean {
        let g = this._g,
            eRng = this._e.range,
            oldSel = this._sel,
            newSel = eRng,
            lbMode = false,
            SM = SelectionMode;

        // copy the new range into this._rng (no cloning)
        if (wijmo.isNumber(rng) && wijmo.isString(show)) {
            let c = g.columns.indexOf(show);
            if (c < 0) {
                throw 'Invalid column name or binding.';
            }
            eRng.setRange(rng as number, c);
            show = true;
        } else if (wijmo.isNumber(rng) && wijmo.isNumber(show)) {
            eRng.setRange(rng as number, show as number);
            show = true;
        } else if (rng instanceof CellRange) {
            eRng.copy(rng);
        } else {
            wijmo.assert(false, 'CellRange expected');
        }

        // adjust for selection mode
        switch (g.selectionMode) {

            // Cell mode: collapse range into single cell
            case SM.Cell:
                newSel.row2 = newSel.row;
                newSel.col2 = newSel.col;
                break;

            // Row mode: collapse range into single row
            case SM.Row:
                newSel.row2 = newSel.row;
                break;

            // ListBox mode: remember because handling is quite different
            case SM.ListBox:
                lbMode = true;
                break;
            
            /* bad idea: C1WEB-27680
            // None mode (no selection): TFS 439514
            case SM.None:
                newSel.setRange(-1, -1);
                break;
            */
        }

        // check if the selection really is changing
        // (special handling for ListBox mode when re-selecting items)
        let noChange = newSel.equals(oldSel);
        if (noChange && lbMode) { // TFS 388047
            for (let i = 0; i < g.rows.length; i++) {
                if (g.rows[i].isSelected !== newSel.containsRow(i)) {
                    noChange = false;
                    break;
                }
            }
        }

        // no change? done
        if (noChange && g.isRangeValid(newSel)) {
            if (show) {
                this._showSelection();
            }
            return true;
        }

        // don't change selection if editing an invalid cell (TFS 470130)
        let ag = wijmo.Control.getControl(wijmo.closest(wijmo.getActiveElement(), '.wj-flexgrid')) as FlexGrid;
        if (ag && ag.activeEditor && !ag.finishEditing()) { // could be a nested grid
            return false;
        }

        // re-use event parameters
        let e = this._e;
        e._rng = newSel;
        e.cancel = false;

        // raise selectionChanging event
        if (!g.onSelectionChanging(e) && !force) {
            return false;
        }

        // ListBox mode: update Selected flag and refresh to show changes
        // don't check for different row/range: TFS 297765, 301515, 469096
        if (lbMode) {
            g.rows.forEach((row, index) => {
                row._setFlag(RowColFlags.Selected, newSel.containsRow(index), true);
            });
        }

        // validate selection after the change
        newSel.row = Math.min(newSel.row, g.rows.length - 1);
        newSel.row2 = Math.min(newSel.row2, g.rows.length - 1);

        // update selection
        this._sel.copy(newSel);

        // show the new selection
        g.refreshCells(false, true, true);
        if (show) {
            this._showSelection();
        }

        // update collectionView cursor
        let view = g.collectionView;
        if (view) {
            let index = g._getCvIndex(newSel.row);
            view.moveCurrentToPosition(index);
        }

        // raise selectionChanged event
        g.onSelectionChanged(e);

        // done
        return true;
    }
    /**
     * Moves the selection by a specified amount in the vertical and horizontal directions.
     * @param rowMove How to move the row selection.
     * @param colMove How to move the column selection.
     * @param extend Whether to extend the current selection or start a new one.
     */
    moveSelection(rowMove: SelMove, colMove: SelMove, extend: boolean) {

        // get reference cell
        let g = this._g,
            sel = this._sel,
            ref = extend && g.anchorCursor
                ? new CellRange(sel.row2, sel.col2)
                : new CellRange(sel.row, sel.col);

        // adjust reference cell for merging
        this._adjustReferenceCell(ref, rowMove, colMove);

        // move reference cell
        let row = ref.row,
            col = ref.col,
            rows = g.rows,
            cols = g.columns,
            pageSize = Math.max(0, g._szClient.height - g.columnHeaders.height),
            SM = SelMove;
        switch (colMove) {

            // next cell (move cursor with wrapping, no extension)
            case SM.NextCell:
            case SM.NextEditableCell:
                col = cols.getNextCell(col, colMove);
                if (col == ref.col) { // reached last column, wrap to next row
                    row = rows.getNextCell(row, colMove);
                    if (row > ref.row) { // move to last cell, next, and back
                        col = cols.getNextCell(0, colMove);
                        col = cols.getNextCell(col, colMove == SM.NextCell ? SM.PrevCell: SM.PrevEditableCell);
                    }
                }
                g.select(row, col);
                break;

            // previous cell (move cursor with wrapping, no extension)
            case SM.PrevCell:
            case SM.PrevEditableCell:
                col = cols.getNextCell(ref.col, colMove);
                if (col == ref.col) { // reached first column, wrap to previous row
                    row = rows.getNextCell(row, colMove);
                    if (row < ref.row) { // move to last cell, back, and next
                        col = cols.getNextCell(cols.length - 1, colMove);
                        col = cols.getNextCell(col, colMove == SM.PrevCell ? SM.NextCell : SM.NextEditableCell);
                    }
                }
                g.select(row, col);
                break;

            // move/extend selection
            default:
                row = rows.getNextCell(row, rowMove, pageSize);
                col = cols.getNextCell(col, colMove, pageSize);
                if (extend) {
                    g.selection = g.anchorCursor
                        ? new CellRange(sel.row, sel.col, row, col)     // update range end, keep cursor
                        : new CellRange(row, col, sel.row2, sel.col2);  // update cursor, keep range end
                } else {
                    g.select(row, col);
                }
                break;
        }
    }

    // set the selection mode and clear the current selection
    _setSelectionMode(value: SelectionMode) {
        let g = this._g,
            rows = g.rows;
        
        // update ListBox selection when switching modes
        let SM = SelectionMode;
        if (value == SM.ListBox || this._mode == SM.ListBox) {
            for (let i = 0; i < rows.length; i++) {
                let sel = (value == SM.ListBox) ? this._sel.containsRow(i) : false;
                rows[i]._setFlag(RowColFlags.Selected, sel, true);
            }
        }

        // apply new mode
        this._mode = value;

        // clear extended selection
        this._xSel.clear();

        // if we have any rows, collapse the selection and update
        if (rows.length) { // TFS 435304, 435288
            let sel = this._sel;
            sel = value != SM.None
                ? new CellRange(sel.row, sel.col) // collapsed selection
                : new CellRange(); // no selection
            this.select(sel, false, true);
            g.invalidate();
        }
    }

    // expand selection to account for merged cells before copying/pasting (TFS 403490, 419086)
    _expandSelection() {
        let g = this._g,
            selMode = g.selectionMode;
        if (g.expandSelectionOnCopyPaste && selMode) {

            let sel = this.selection,
                SM = SelectionMode;

            // different expand strategies (WJM-19597)
            switch (selMode) {

                // Cell/Row modes: should not be expanded
                case SM.Cell:
                case SM.Row:
                    break;

                // ListBox mode: special handling
                case SM.ListBox:
                    this._expandSelectedRows();
                    break;

                // RowRange mode: adjustment required (expand range into rows)
                case SM.RowRange:
                    sel = new CellRange(sel.topRow, 0, sel.bottomRow, g.columns.length - 1);

                // default expand strategy
                default:
                    // account for merged cells and update selection if changed
                    let rng = this._expandSelectionRange(sel);
                    if (rng) {
                        this.select(rng, false);
                    }
                    break;
            }
        }
    }
    
    // removes a given range from the extended selection
    /*private*/ _deselectRange(rng: CellRange): boolean {
        let sel = this.selection,
            xSel = this.extendedSelection;

        // contained by selection? remove selection range
        if (sel.contains(rng)) { 
            let len = xSel.length;
            this._sel = len ? xSel[len - 1] : new CellRange();
            if (len) {
                xSel.removeAt(len - 1);
            }
            return true;
        }

        // contained by a range in the extended selection list? remove that
        // NOTE: can't use xSel.find() because IE doesn't have it...
        for (let i = 0; i < xSel.length; i++) {
            if (xSel[i].contains(rng)) {
                xSel.removeAt(i);
                return true;
            }
        }

        // not contained by anyone
        return false;
    }

    // expand selected rows to account for merged cells
    // Note: intended to be used only for ListBox mode
    private _expandSelectedRows(): void {
        wijmo.assert(this.selectionMode == SelectionMode.ListBox, 'ListBox mode expected');
        
        let g = this._g,
            oldIndices = g.selectedRows.map(r => r.index);
        
        // collect all merged rows
        let newIndices = [];
        for (let i = 0; i < oldIndices.length; i++) {
            let sel = new CellRange(oldIndices[i], 0, oldIndices[i], g.columns.length - 1);
            let rng = this._expandSelectionRange(sel) || sel;
            for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                if (newIndices.indexOf(r) === -1) {
                    newIndices.push(r);
                }
            }
        }

        // sort rows by index
        newIndices.sort();

        // update selected rows
        this._selectRows(newIndices);
    }

    // expand selection to account for merged cells before copying/pasting (TFS 403490, 419086)
    // NOTE: do not rely on allowMerging, derived classes may override the
    // mergeManager (e.g. MultiRow, PivotGrid).
    private _expandSelectionRange(sel: CellRange): CellRange {
        let g = this._g;

        let cells = g.cells,
            tl = g.getMergedRange(cells, sel.topRow, sel.leftCol, false),
            bl = g.getMergedRange(cells, sel.bottomRow, sel.leftCol, false),
            tr = g.getMergedRange(cells, sel.topRow, sel.rightCol, false),
            br = g.getMergedRange(cells, sel.bottomRow, sel.rightCol, false);
        if (tl || bl || tr || br) { // if any selection corner is a merged cell

            // get all corners as CellRanges
            tl = tl || new CellRange(sel.topRow, sel.leftCol);
            bl = bl || new CellRange(sel.bottomRow, sel.leftCol);
            tr = tr || new CellRange(sel.topRow, sel.rightCol);
            br = br || new CellRange(sel.bottomRow, sel.rightCol);

            // get the range that merges them all
            return new CellRange(
                Math.min(tl.topRow, bl.topRow, tr.topRow, br.topRow),
                Math.min(tl.leftCol, bl.leftCol, tr.leftCol, br.leftCol),
                Math.max(tl.bottomRow, bl.bottomRow, tr.bottomRow, br.bottomRow),
                Math.max(tl.rightCol, bl.rightCol, tr.rightCol, br.rightCol)
            );
        }

        // not expanded
        return null;
    }

    // updates selected rows
    // Note: intended to be used only for ListBox mode
    private _selectRows(indices: number[]): void {
        wijmo.assert(this.selectionMode == SelectionMode.ListBox, 'ListBox mode expected');

        // REVIEW: somehow reuse g.selectedRows property setter
        let g = this._g;
        for (let i = 0, first = true; i < g.rows.length; i++) {
            let row = g.rows[i] as Row,
                sel = indices && indices.indexOf(row.index) > -1;
            if (sel && first) {
                first = false;
                this.select(i, this.selection.col);
            }
            row.isSelected = sel;
        }
    }

    // scroll a range into view taking the anchorCursor mode into account
    private _showSelection() {
        let g = this._g,
            rng = this._sel;
        if (g.anchorCursor) {
            g.scrollIntoView(rng.row2, rng.col2);
        } else {
            g.scrollIntoView(rng.row, rng.col);
        }
    }

    // adjust selection change reference cell for merging
    private _adjustReferenceCell(ref: CellRange, rowMove: SelMove, colMove: SelMove) {
        let g = this._g,
            rng = g.getMergedRange(g.cells, ref.row, ref.col);
        if (rng && !rng.isSingleCell) {
            let SM = SelMove;
            switch (rowMove) {
                case SM.Next:
                case SM.NextCell:
                case SM.NextEditableCell:
                    ref.row = rng.bottomRow;
                    break;
                case SM.Prev:
                case SM.PrevCell:
                case SM.PrevEditableCell:
                    ref.row = rng.topRow;
                    break;
            }
            switch (colMove) {
                case SM.Next:
                case SM.NextCell:
                case SM.NextEditableCell:
                    ref.col = rng.rightCol;
                    break;
                case SM.Prev:
                case SM.PrevCell:
                case SM.PrevEditableCell:
                    ref.col = rng.leftCol;
                    break;
            }
        }
    }
}
    }
    


    module wijmo.grid {
    









'use strict';

/**
 * Specifies flags that represent the state of a grid row or column.
 */
export enum RowColFlags {
    /** The row or column is visible. */
    Visible = 1,
    /** The row or column can be resized. */
    AllowResizing = 2,
    /** The row or column can be dragged to a new position with the mouse. */
    AllowDragging = 4,
    /** The row or column can contain merged cells. */
    AllowMerging = 8,
    /** The column can be sorted by clicking its header with the mouse. */
    AllowSorting = 16,
    /** The column was generated automatically. */
    AutoGenerated = 32,
    /** The group row is collapsed. */
    Collapsed = 64,
    /** The row has a parent group that is collapsed. */
    ParentCollapsed = 128,
    /** The row or column is selected. */
    Selected = 256,
    /** The row or column is read-only (cannot be edited). */
    ReadOnly = 512,
    /** Cells in this row or column contain HTML text. */
    HtmlContent = 1024,
    /** Cells in this row or column may contain wrapped text. */
    WordWrap = 2048,
    /** Cells in this row or column may contain wrapped text. */
    MultiLine = 4096,
    /** Cells in this column have templates. */
    HasTemplate = 8192,
    /** Default settings for new rows. */
    RowDefault = Visible | AllowResizing,
    /** Default settings for new columns. */
    ColumnDefault = Visible | AllowDragging | AllowResizing | AllowSorting
}

/**
 * An abstract class that serves as a base for the {@link Row} and {@link Column} classes.
 */
export class RowCol {
    protected _type: wijmo.DataType = null;
    protected _align: string = null;
    protected _inpType: string = null;
    protected _mask: string = null;
    protected _maxLen: number = null;
    protected _required: boolean = null;
    protected _fmt: string = null;
    protected _map: DataMap = null;
    protected _mapEditor: DataMapEditor;
    protected _ddCssClass: string = null;
    protected _cssClass: string = null;
    protected _cssClassAll: string = null;
    protected _szMin: number = null;
    protected _szMax: number = null;
    protected _f: RowColFlags;
    /*protected*/ _sz: number = null; // null or < 0 means use default
    /*protected*/ _list: RowColCollection;
    /*protected*/ _pos = 0;
    /*protected*/ _idx = -1;
    /*protected*/ _idxVis = -1;
    /*protected*/ _idxData = -1;
    /*private*/ _binding: wijmo.Binding;
    /*private*/ _bindingSort: wijmo.Binding;

    /**
     * Gets or sets the name of the property the column is bound to.
     * 
     * The default value for this property is **null**, which means
     * the column is not bound to any data fields.
     * 
     * This property is set automatically for auto-generated columns
     * (see {@link FlexGrid.autoGenerateColumns}).
     */
    get binding(): string | null {
        return this._binding ? this._binding.path : null;
    }
    set binding(value: string | null) {
        if (value != this.binding) {
            let path = wijmo.asString(value);
            this._binding = path ? new wijmo.Binding(path) : null;
            if (!this._type && this.grid && this._binding) {
                let view = this.grid.collectionView;
                if (view && view.sourceCollection && view.sourceCollection.length) {
                    let item = view.sourceCollection[0];
                    this._type = wijmo.getType(this._binding.getValue(item));
                }
            }
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the name of the property to use when sorting this column.
     *
     * Use this property in cases where you want the sorting to be performed
     * based on values other than the ones specified by the {@link binding} property.
     *
     * The default value for this property is **null**, which causes the grid to
     * use the value of the {@link binding} property to sort the column.
     */
    get sortMemberPath(): string | null {
        return this._bindingSort ? this._bindingSort.path : null;
    }
    set sortMemberPath(value: string | null ) {
        if (value != this.sortMemberPath) {
            let path = wijmo.asString(value);
            this._bindingSort = path ? new wijmo.Binding(path) : null;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the type of value stored in the column or row.
     *
     * Values are coerced into the proper type when editing the grid.
     * 
     * The default value for this property is **null**, which causes
     * the grid not to perform any data type coercion.
     * 
     * This property is set automatically for auto-generated columns
     * (see {@link FlexGrid.autoGenerateColumns}).
     */
    get dataType(): wijmo.DataType | null  {
        return this._type;
    }
    set dataType(value: wijmo.DataType | null ) {
        value = wijmo.asEnum(value, wijmo.DataType, true);
        if (this._type != value) {
            this._type = value;
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /**
     * Gets or sets the "type" attribute of the HTML input element used to 
     * edit values in this column or row.
     *
     * The default value for this property is **null**, which causes the
     * grid to use the type "tel" for numeric columns, and "text" for all
     * other non-boolean column types.
     * 
     * The "tel" input type causes mobile devices to show a numeric keyboard
     * that includes a negative sign and a decimal separator.
     *
     * Use this property to change the default setting if the default does not
     * work well for the current culture, device, or application.
     * In these cases, try setting the property to "number" or simply "text."
     */
    get inputType(): string  | null {
        return this._inpType;
    }
    set inputType(value: string | null) {
        this._inpType = wijmo.asString(value, true);
    }
    /**
     * Gets or sets a mask to use while editing values in this column or row.
     *
     * The format used to define the mask is the same used by the 
     * {@link wijmo.input.InputMask} control.
     *
     * If specified, the mask must be compatible with the value of the 
     * {@link format} property. For example, the mask '99/99/9999' can be used
     * for entering dates formatted as 'MM/dd/yyyy'.
     * 
     * The default value for this property is **null**, which means any 
     * character is accepted at any position.
     */
    get mask(): string | null {
        return this._mask;
    }
    set mask(value: string | null) {
        this._mask = wijmo.asString(value, true);
    }
    /**
     * Gets or sets the maximum number of characters that the can
     * be entered into cells in this column or row.
     *
     * The default value for this property is **null**, which
     * allows entries with any number of characters.
     */
    get maxLength(): number | null {
        return this._maxLen;
    }
    set maxLength(value: number | null) {
        this._maxLen = wijmo.asNumber(value, true, true);
    }
    /**
     * Gets or sets the horizontal alignment of cells in the column or row.
     *
     * The default value for this property is **null**, which causes the grid
     * to select the alignment automatically based on the column's {@link dataType}
     * (numbers are right-aligned, Boolean values are centered, and other types 
     * are left-aligned).
     *
     * If you want to override the default alignment, set this property
     * to 'left', 'right', 'center', or 'justify'.
     */
    get align(): string | null {
        return this._align;
    }
    set align(value: string | null) {
        if (this._align != value) {
            this._align = value;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the format string used to convert raw values into 
     * display values for the column or row (see {@link Globalize}).
     * 
     * The default value for this property is **null**, which causes
     * the grid to use default formats that depend on the data type.
     */
    get format(): string | null {
        return this._fmt;
    }
    set format(value: string | null) {
        if (this._fmt != value) {
            this._fmt = value;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the {@link DataMap} used to convert raw values into display
     * values for the column or row.
     *
     * By default, data-mapped cells have drop-down lists that can be used for
     * quick editing. You can change the type of editor by setting the 
     * column's {@link dataMapEditor} property.
     * 
     * The default value for this property is **null**.
     */
    get dataMap(): DataMap | null {
        return this._map;
    }
    set dataMap(value: DataMap | null) {
        if (this._map != value) {

            // disconnect old map
            if (this._map) {
                this._map.mapChanged.removeHandler(this.onPropertyChanged, this);
            }

            // convert arrays into DataMaps
            if (wijmo.isArray(value)) {
                value = new DataMap(value, null, null);
            }

            // set new map
            this._map = wijmo.asType(value, DataMap, true);

            // connect new map
            if (this._map) {
                this._map.mapChanged.addHandler(this.onPropertyChanged, this);
            }
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets a value that indicates the type of editor to use when
     * editing data-mapped cells in this column or row.
     *
     * The default value for this property is {@link DataMapEditor.DropDownList},
     * which adds drop-down buttons to cells to columns that have a {@link dataMap}
     * and are not read-only.
     * 
     * Clicking on the drop-down buttons causes the grid to show a list where
     * users can select the value for the cell.
     * 
     * The {@link DataMapEditor.RadioButtons} setting causes the grid to 
     * show radio buttons for each option. The buttons can be clicked with
     * the mouse or keyboard (by pressing each option's initial letter or
     * the space key to cycle through the options.)
     * 
     * Note that drop-down lists are available only if the **wijmo.input.ListBox**
     * class is loaded/imported by the application.
     */
    get dataMapEditor(): DataMapEditor {
        return this._mapEditor != null ? this._mapEditor : DataMapEditor.DropDownList;
    }
    set dataMapEditor(value: DataMapEditor) {
        if (value != this._mapEditor) {
            this._mapEditor = wijmo.asEnum(value, DataMapEditor);
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /* deprecated */
    get showDropDown(): boolean {
        return this.dataMapEditor == DataMapEditor.DropDownList; // TFS 434211
    }
    set showDropDown(value: boolean) {
        wijmo._deprecated('showDropDown', 'dataMapEditor');
        this.dataMapEditor = value ? DataMapEditor.DropDownList : DataMapEditor.AutoComplete;
    }
    /**
     * Gets or sets a CSS class name to add to drop-downs in this column or row.
     *
     * The drop-down buttons are shown only if the column has a {@link dataMap}
     * set and is editable. Clicking on the drop-down buttons causes the grid
     * to show a list where users can select the value for the cell.
     * 
     * Note that drop-down lists are available only if the **wijmo.input.ListBox**
     * class is loaded/imported by the application.
     * 
     * The default value for this property is **null**.
     */
    get dropDownCssClass(): string | null {
        return this._ddCssClass;
    }
    set dropDownCssClass(value: string | null) {
        this._ddCssClass = wijmo.asString(value);
    }
    /**
     * Gets or sets a value that indicates whether the column or row 
     * is visible.
     * 
     * The default value for this property is **true**.
     */
    get visible(): boolean {
        return this._getFlag(RowColFlags.Visible);
    }
    set visible(value: boolean) {
        this._setFlag(RowColFlags.Visible, value);
    }
    /**
     * Gets a value that indicates whether the column or row is 
     * visible and not collapsed.
     *
     * This property is read-only. To change the visibility of a
     * column or row, use the {@link visible} property instead.
     */
    get isVisible(): boolean {

        // if visible is false, we're not visible
        if (!this._getFlag(RowColFlags.Visible)) {
            return false;
        }

        // if the parent node is collapsed and this is not a new row, we're not visible
        if (this._getFlag(RowColFlags.ParentCollapsed) && !(this instanceof _NewRowTemplate)) {
            return false;
        }

        // looks like we're visible
        return true;
    }
    /**
     * Gets the position of the column or row in pixels.
     */
    get pos(): number {
        if (this._list && this._list._dirty) {
            this._list._update();
        }
        return this._pos;
    }
    /**
     * Gets the index of the column or row in the parent collection.
     */
    get index(): number {
        if (this._list && this._list._dirty) {
            this._list._update();
        }
        return this._idx;
    }
    /**
     * Gets the index of the column or row in the parent collection
     * ignoring invisible elements ({@link isVisible}).
     */
    get visibleIndex(): number {
        if (this._list && this._list._dirty) {
            this._list._update();
        }
        return this.isVisible ? this._idxVis : -1;
    }
    /**
     * Gets or sets the size of the column or row.
     * 
     * Setting this property to null or negative values causes
     * the element to use the parent collection's default size.
     */
    get size(): number | null {
        return this._sz;
    }
    set size(value: number | null) {
        if (value != this._sz) {
            this._sz = wijmo.asNumber(value, true);
            this.onPropertyChanged();
        }
    }
    /**
     * Gets the render size of the column or row.
     * 
     * This property accounts for visibility, default size, 
     * and min and max sizes.
     */
    get renderSize(): number {
        let sz = 0,
            list = this._list;
        if (this.isVisible) {
            sz = this._sz;

            // honor list default/min/max (TFS 242535)
            if (sz == null || sz < 0) {
                sz = list ? list.defaultSize : 0;
            }
            if (list && list.minSize != null && sz < list.minSize) {
                sz = list.minSize;
            }
            if (list && list.maxSize != null && sz > list.maxSize) {
                sz = list.maxSize;
            }

            // honor row/col min/max
            if (this._szMin != null && sz < this._szMin) {
                sz = this._szMin;
            }
            if (this._szMax != null && sz > this._szMax) {
                sz = this._szMax;
            }
        }
        return sz; //Math.round(sz);
    }
    /**
     * Gets or sets a value that indicates whether the user can resize 
     * the column or row with the mouse.
     * 
     * The default value for this property is **true**.
     */
    get allowResizing(): boolean {
        return this._getFlag(RowColFlags.AllowResizing);
    }
    set allowResizing(value: boolean) {
        this._setFlag(RowColFlags.AllowResizing, value);
    }
    /**
     * Gets or sets a value that indicates whether the user can move 
     * the column or row to a new position with the mouse.
     *
     * The default value for this property is **true**.
     */
    get allowDragging(): boolean {
        return this._getFlag(RowColFlags.AllowDragging);
    }
    set allowDragging(value: boolean) {
        this._setFlag(RowColFlags.AllowDragging, value);
    }
    /**
     * Gets or sets a value that indicates whether cells in the
     * column or row can be merged.
     *
     * The default value for this property is **false**.
     */
    get allowMerging(): boolean {
        return this._getFlag(RowColFlags.AllowMerging);
    }
    set allowMerging(value: boolean) {
        this._setFlag(RowColFlags.AllowMerging, value);
    }
    /**
     * Gets or sets a value that indicates whether the column or row
     * is selected.
     * 
     * The default value for this property is **false**.
     */
    get isSelected(): boolean {
        return this._getFlag(RowColFlags.Selected);
    }
    set isSelected(value: boolean) {
        if (!!value != this.isSelected) { // TFS 454780
            let g = this.grid;
            if (!g) { // no grid? just make the change
                this._setFlag(RowColFlags.Selected, value);
            } else { // raise events and make the change
                let rng = this instanceof Row ? new CellRange(this.index, -1) : new CellRange(-1, this.index),
                    e = new CellRangeEventArgs(g ? g.cells : null, rng);
                if (g.onSelectionChanging(e)) {
                    if (this._setFlag(RowColFlags.Selected, value, true)) {
                        g.refreshCells(false, true, true); // show the new selection
                        g.onSelectionChanged(e);
                    }
                }
            }
        }
    }
    /**
     * Gets or sets a value that indicates whether cells in the 
     * column or row can be edited.
     * 
     * The default value for this property is **false**.
     */
    get isReadOnly(): boolean {
        return this._getFlag(RowColFlags.ReadOnly);
    }
    set isReadOnly(value: boolean) {
        this._setFlag(RowColFlags.ReadOnly, value);
    }
    /**
     * Gets or sets a value that determines whether values in this 
     * column or row are required.
     *
     * The default value for this property is to **null**, which
     * means dates, booleans, and numeric values are required,
     * but non-masked string columns may contain empty strings.
     *
     * When set to true, values are required and empty strings are 
     * not allowed.
     *
     * When set to false, null values and empty strings are allowed.
     */
    get isRequired(): boolean | null {
        return this._required;
    }
    set isRequired(value: boolean | null) {
        this._required = wijmo.asBoolean(value, true);
    }
    /**
     * Gets or sets a value that indicates whether cells in this column or row 
     * contain HTML content rather than plain text.
     * 
     * This property only applies to regular cells. Row and column header cells
     * contain plain text by default. If you want to display HTML in column or
     * row headers, you must use the {@link FlexGrid.formatItem} event and set
     * the cell's innerHTML content in code.
     * 
     * Unless the column's {@link isReadOnly} property is set to true, cells
     * that show HTML can be edited. By default, the editor will show HTML 
     * markup and users will be able to change it. If the column has a
     * {@link dataMap}, however, the drop-down list will show formatted 
     * items and the editor will show plain text instead of HTML markup.
     *
     * The default value for this property is **false**.
     */
    get isContentHtml(): boolean {
        return this._getFlag(RowColFlags.HtmlContent);
    }
    set isContentHtml(value: boolean) {
        if (this.isContentHtml != value) {
            this._setFlag(RowColFlags.HtmlContent, value);
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /**
     * Gets or sets a value that indicates whether the content of cells in 
     * this column or row should wrap to fit the available column width.
     *
     * The default value for this property is **false**.
     */
    get wordWrap(): boolean {
        return this._getFlag(RowColFlags.WordWrap);
    }
    set wordWrap(value: boolean) {
        this._setFlag(RowColFlags.WordWrap, value);
    }
    /**
     * Gets or sets a value that indicates whether the content of cells in
     * this column or row should wrap at new line characters (\n).
     *
     * The default value for this property is **false**.
     */
    get multiLine(): boolean {
        return this._getFlag(RowColFlags.MultiLine);
    }
    set multiLine(value: boolean) {
        this._setFlag(RowColFlags.MultiLine, value);
    }
    /**
     * Gets or sets a CSS class name to use when rendering 
     * data (non-header) cells in the column or row.
     * 
     * The default value for this property is **null**.
     */
    get cssClass(): string | null {
        return this._cssClass;
    }
    set cssClass(value: string | null) {
        if (value != this._cssClass) {
            this._cssClass = wijmo.asString(value);
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /**
     * Gets or sets a CSS class name to use when rendering 
     * all cells (data and headers) in the column or row.
     * 
     * The default value for this property is **null**.
     */
    get cssClassAll(): string | null {
        return this._cssClassAll;
    }
    set cssClassAll(value: string | null) {
        if (value != this._cssClassAll) {
            this._cssClassAll = wijmo.asString(value);
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /**
     * Gets the {@link FlexGrid} that owns this column or row.
     */
    get grid(): FlexGrid {
        return this._list ? this._list._g : null;
    }
    /**
     * Gets the {@link ICollectionView} bound to this column or row.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this.grid ? this.grid.collectionView : null;
    }
    /**
     * Marks the owner list as dirty and refreshes the owner grid.
     */
    onPropertyChanged() {
        if (this._list) {
            this._list._dirty = true;
            this.grid.invalidate();
        }
    }

    // ** events

    /**
     * Occurs when the value of the {@link grid} property changes.
     */
    readonly gridChanged = new wijmo.Event<RowCol, wijmo.EventArgs>();
    /**
     * Raises the {@link gridChanged} event.
     */
    onGridChanged(e?: wijmo.EventArgs) {
        this.gridChanged.raise(this, e);
    }

    // ** implementation

    // sets the element's owner list
    _setList(list: RowColCollection) {
        if (list != this._list) {
            this._list = list;
            this.onGridChanged();
        }
    }

    // gets a flag's value
    _getFlag(flag: RowColFlags): boolean {
        return (this._f & flag) != 0;
    }

    // sets a flag's value with optional notification
    _setFlag(flag: RowColFlags, value: boolean, quiet?: boolean): boolean {
        if (!!value != this._getFlag(flag)) {
            this._f = value ? (this._f | flag) : (this._f & ~flag);
            if (!quiet) {
                this.onPropertyChanged();
            }
            return true;
        }
        return false;
    }
}

/**
 * Represents a function that takes an {@link ICellTemplateContext} 
 * object and returns an HTML string to be used as content for a 
 * cell.
 * 
 * Alternatively, the function may modify the content of the cell element
 * directly and return null to indicate the cell element should not be
 * modified.
 * 
 * @param: ctx {@link ICellTemplateContext} object that contains information about the cell.
 * @param: cell **HTMLElement** that represents the cell.
 * @returns A template string built using the context, or null to indicate the function
 * updated the cell element and it should not be modified by the grid.
 */
export type ICellTemplateFunction =
    /**
     * @param: ctx {@link ICellTemplateContext} object that contains information about the cell.
     * @param: cell **HTMLElement** that represents the cell.
     * @returns A template string built using the context, or null to indicate the function
     * updated the cell element and it should not be modified by the grid.
     */
    (ctx: ICellTemplateContext, cell?: HTMLElement) => string | null;

/**
 * Represents a context used for generating HTML strings to 
 * be used as content for a cell.
 */
export interface ICellTemplateContext {
    /** {@link Row} that contains the cell. */
    row: Row;
    /** {@link Column} that contains the cell. */
    col: Column;
    /** Data item bound to the cell. */
    item: any;
    /** Raw value of the property bound to the cell. */
    value: any;
    /** Formatted/mapped value of the property bound to the cell. */
    text: string
}

/**
 * Represents a column on the grid.
 */
export class Column extends RowCol {
    private static _ctr = 0;
    private _hdr: string = null;
    private _name: string = null;
    private _agg: wijmo.Aggregate = null;
    private _quickSize: boolean = null;
    private _descById: string = null;
    private _edt: _CustomEditor;
    /*private*/ _tpl: string | ICellTemplateFunction = null;
    /*private*/ _szStar: string;
    /*private*/ _hash: string; // unique column id

    /**
     * Initializes a new instance of the {@link Column} class.
     *
     * @param options Initialization options for the column.
     */
    constructor(options?: any) {
        super();
        this._f = RowColFlags.ColumnDefault;
        this._hash = Column._ctr.toString(36); // unique column key (used for unbound rows)
        Column._ctr++;
        wijmo.copy(this, options);
    }
    /**
     * Gets or sets the name of the column.
     *
     * The column name can be used to retrieve the column using the
     * {@link FlexGrid.getColumn} method.
     * 
     * This property is especially useful when dealing with unbound
     * columns or multiple columns with the same {@link binding}
     * value.
     * 
     * The default value for this property is **null**.
     */
    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }
    /**
     * Gets or sets the width of the column.
     *
     * Column widths may be positive numbers (sets the column width in pixels), 
     * null or negative numbers (uses the collection's default column width), or
     * strings in the format '{number}*' (star sizing).
     *
     * The star-sizing option performs a XAML-style dynamic sizing where column 
     * widths are proportional to the number before the star. For example, if
     * a grid has three columns with widths "100", "*", and "3*", the first column
     * will be 100 pixels wide, the second will take up 1/4th of the remaining
     * space, and the last will take up the remaining 3/4ths of the remaining space.
     *
     * Star-sizing allows you to define columns that automatically stretch to fill
     * the width available. For example, set the width of the last column to "*"
     * and it will automatically extend to fill the entire grid width so there's
     * no empty space. You may also want to set the column's {@link minWidth} 
     * property to prevent the column from getting too narrow.
     * 
     * You can use the {@link renderWidth} property to retrieve the actual width
     * of the column, taking into account visibility, star sizing, min/max limits,
     * and default width settings.
     * 
     * The default value for this property is **null**, which causes the grid to
     * use the default column width defined by the grid's {@link FlexGrid.columns}
     * collection.
     */
    get width(): any | null {
        if (this._szStar != null) {
            return this._szStar;
        } else {
            return this.size;
        }
    }
    set width(value: any | null) {
        if (Column._parseStarSize(value) != null) {
            this._szStar = value;
            this.onPropertyChanged();
        } else {
            this._szStar = null;
            this.size = wijmo.asNumber(value, true);
        }
    }
    /**
     * Gets or sets the minimum width of the column.
     *
     * The default value for this property is **null**, which means 
     * there is no lower limit to the column width.
     */
    get minWidth(): number | null {
        return this._szMin;
    }
    set minWidth(value: number | null) {
        if (value != this._szMin) {
            this._szMin = wijmo.asNumber(value, true, true);
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the maximum width (in pixels) of the column.
     * 
     * The default value for this property is **null**, which means 
     * there is no upper limit to the column width.
     */
    get maxWidth(): number | null {
        return this._szMax;
    }
    set maxWidth(value: number | null) {
        if (value != this._szMax) {
            this._szMax = wijmo.asNumber(value, true, true);
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should optimize
     * performance over precision when auto-sizing this column.
     *
     * Setting this property to false disables quick auto-sizing for this column.
     * 
     * Setting it to true enables the feature, subject to the value of the grid's
     * {@link wijmo.grid.FlexGrid.quickAutoSize} property.
     * 
     * The default value for this property is **null**, which enables the feature
     * for columns that display plain text and don't have templates.
     */
    get quickAutoSize(): boolean | null {
        return this._quickSize;
    }
    set quickAutoSize(value: boolean | null) {
        this._quickSize = wijmo.asBoolean(value, true);
    }
    /*private*/ _getQuickAutoSize() {
        if (!this.grid._getQuickAutoSize()) {
            return false;
        }
        return wijmo.isBoolean(this._quickSize)
            ? this._quickSize
            : !this.isContentHtml && !this.wordWrap && !this.multiLine && !this._getFlag(RowColFlags.HasTemplate);
    }
    /**
     * Gets the render width of the column.
     *
     * The value returned takes into account the column's visibility, default size, and min and max sizes.
     */
    get renderWidth(): number {
        return this.renderSize;
    }
    /**
     * Gets or sets the text displayed in the column header.
     * 
     * The default value for this property is **null**, which causes
     * the grid to use the {@link binding} string as a header.
     */
    get header(): string | null {
        return this._hdr ? this._hdr : this.binding;
    }
    set header(value: string | null) {
        if (this._hdr != value) {
            this._hdr = value;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets an {@link ICellTemplateFunction} or a template string
     * to be used for generating the HTML content of data cells in this
     * {@link Column}.
     * 
     * Cell template strings use template literal syntax. The content string
     * is generated using a scope of type {@link ICellTemplateContext}.
     * 
     * {@link ICellTemplateFunction} functions take an argument of type
     * {@link ICellTemplateContext} and return the HTML content to be
     * displayed in the cell.
     * 
     * For example:
     * 
     * ``` typescript
     * // simple/default rendering with a cellTemplate string
     * col.cellTemplate = '${value}:${col.format}';
     * 
     * // simple/default rendering with a cellTemplate function
     * col.cellTemplate = (ctx: ICellTemplateContext) => glbz`${ctx.value}:${ctx.col.format}`;
     * 
     * // conditional formatting with cellTemplate string
     * col.cellTemplate = '<span class=${value > 40000 ? "big-val" : "small-val"}>${text}</span>';
     * 
     * // conditional formatting with a cellTemplate function
     * col.cellTemplate = (ctx: ICellTemplateContext) => `
     *     <span class="${ctx.value > 4000 ? 'big-val' : 'small-val'}">${ctx.text}</span>
     * `;
     * ```
     * Notice that string-based cell templates are regular strings, not actual JavaScript
     * template literals. Therefore, they are defined using regular quotes (single or
     * double) as oppsed to the back-quotes used by JavaScript template strings.
     * 
     * **Function-based cell templates** are usually a better choice than string-based 
     * templates because:
     * 
     * 1) They provide design-time error checking and command completion,
     * 2) They run faster, and
     * 3) They do not have any issues with content-security policy (CSP).
     * 
     * **String-based cell templates** also have advantages that may be important in 
     * some scenarios:
     * 
     * 1) They are slightly more concise, and
     * 2) They can be stored as data and easily changed at run-time.
     * 
     * The {@link cellTemplate} property provides a simpler alternative to the
     * {@link formatItem} event or the cell templates available in the Wijmo interop 
     * modules.
     * 
     * When using cell templates, you should still set the column's {@link binding} and 
     * {@link format} properties.
     * They will be used in edit mode and to support copy/paste/export operations.
     * 
     * Cell templates are used only to render cell data, and have no effect on editing.
     * If you want to customize the cell editors, use the {@link editor} property.
     * 
     * Cell templates can also be used to render row header cells. The most common
     * scenario for this would be to add numbers to the row header cells.
     * The example below shows how you can do this:
     * ```typescript
     * // get row header column
     * let col = theGrid.rowHeaders.columns[0];
     * 
     * // assign template that adds the row index to the header
     * // (but preserves glyphs such as edit and new row template)
     * col.cellTemplate = ctx => ctx.text || (ctx.row.index + 1).toString();
     * ```
     * 
     * The default value for this property is **null**, which means the column has no
     * template.
     */
    get cellTemplate(): string | ICellTemplateFunction | null {
        return this._tpl;
    }
    set cellTemplate(value: string | ICellTemplateFunction | null) {
        if (value != this._tpl) {
            wijmo.assert(value == null || wijmo.isString(value) || wijmo.isFunction(value), 'cellTemplate should be a string or an ICellTemplateFunction.');
            this._tpl = value;
            this._setFlag(RowColFlags.HasTemplate, value != null && value != '');
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets a reference to an input control to be used as a 
     * custom cell editor for this {@link Column}.
     * 
     * The input control is typically one of the Wijmo input controls.
     * It should be compatible with the column's data type.
     * 
     * For example, this code replaces the built-in editor for all
     * date columns on a grid with a single **InputDate** control:
     * 
     * ```typescript
     * import { InputDate } from '@grapecity/wijmo.input';
     * let inputDate = new InputDate(document.createElement('div'));
     * theGrid.columns.forEach(col => {
     *     if (col.DataType == DateType.Date) {
     *         col.editor = inputDate;
     *     }
     * })
     * ```
     * And this code replaces the built-in editor for all data-mapped
     * columns on a grid with **AutoComplete** controls:
     * 
     * ```typescript
     * import { AutoComplete } from '@grapecity/wijmo.input';
     * theGrid.columns.forEach(col => {
     *     let map = col.dataMap;
     *     if (map) {
     *         col.editor = new AutoComplete(document.createElement('div'), {
     *             itemsSource: map.collectionView,
     *             displayMemberPath: map.displayMemberPath,
     *             selectedValuePath: map.selectedValuePath
     *         });
     *     }
     * });
     * ```
     * Notice how the example above uses the column's {@link dataMap} property
     * to initialize the **AutoComplete**.
     * 
     * In many cases you may also want to use column properties such as
     * {@link format} and {@link isRequired} to initialize the custom editors.
     * This is important since the custom editors do not inherit **any**
     * properties from the column being edited.
     * 
     * The example below shows how you can use the {@link editor} property 
     * to edit grid items with various Wijmo input controls:
     * 
     * {@sample Grid/Editing/CustomEditors Example}
     * 
     * The default value for this property is **null**, which causes the grid
     * to use the grid's own built-in editors.
     */
    get editor(): wijmo.Control | null {
        let edt = this._edt;
        return edt ? edt.control : null;
    }
    set editor(value: wijmo.Control | null) {
        if (value != this.editor) {
            if (this._edt) {
                this._edt.dispose();
                this._edt = null;
            }
            if (value != null) {
                value = wijmo.asType(value, wijmo.Control);
                this._edt = new _CustomEditor(this, value)
            }
        }
    }
    /**
     * Gets or sets a value that indicates whether the user can sort the column by clicking its header.
     * 
     * The default value for this property is **true**.
     */
    get allowSorting(): boolean {
        return this._getFlag(RowColFlags.AllowSorting);
    }
    set allowSorting(value: boolean) {
        this._setFlag(RowColFlags.AllowSorting, value);
    }
    /**
     * Gets a string that describes the current sorting applied to the column.
     * Possible values are '+' for ascending order, '-' for descending order, or 
     * null for unsorted columns.
     */
    get currentSort(): string {
        let index = this.currentSortIndex;
        if (index > -1) {
            let sds = this.grid.collectionView.sortDescriptions;
            return sds[index].ascending ? '+' : '-';
        }
        return null;
    }
    /**
     * Gets the index of this column in the sort descriptions array for the
     * grid's collection view.
     */
    get currentSortIndex(): number {
        let view = this.grid ? this.grid.collectionView : null,
            sds = view ? view.sortDescriptions : null,
            binding = (sds && sds.length) ? this._getBindingSort() : null;
        if (binding) {
            for (let i = 0; i < sds.length; i++) {
                if (sds[i].property == binding) {
                    return i;
                }
            }
        }
        return -1;
    }
    /**
     * Gets or sets the {@link Aggregate} to display in the group header rows 
     * for the column.
     * 
     * The default value for this property is **Aggregate.None**, which causes
     * the grid to show no aggregate values for this column.
     */
    get aggregate(): wijmo.Aggregate {
        return this._agg != null ? this._agg : wijmo.Aggregate.None;
    }
    set aggregate(value: wijmo.Aggregate) {
        value = wijmo.asEnum(value, wijmo.Aggregate);
        if (value != this._agg) {
            this._agg = value;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets or sets the ID of an element that contains a description
     * of the column.
     * 
     * The ID is used as the value of the **aria-describedby**
     * attribute for the column header element.
     * 
     * THe default value for this property is **null**.
     */
    get describedById(): string | null {
        return this._descById;
    }
    set describedById(value: string | null) {
        if (value != this._descById) {
            this._descById = wijmo.asString(value);
            if (this.grid) {
                this.grid.invalidate();
            }
        }
    }
    /**
     * Gets a value that determines whether values in the column/row are required.
     *
     * Returns the value of the {@link isRequired} property if it is not null, or
     * determines the required status based on the column's {@link dataType}.
     *
     * By default, string columns are not required unless they have an associated
     * {@link dataMap} or {@link mask}; all other data types are required.
     * 
     * @param row Row that contains the cell being checked.
     * @return True if the value is required, false otherwise.
     */
    getIsRequired(row?: Row): boolean {

        // honor explicit settings
        if (this._required != null) {
            return this._required;
        }
        if (row && row.isRequired != null) {
            return row.isRequired;
        }

        // if not explicitly set, only strings are optional
        if (this.dataType == wijmo.DataType.String) {
            return (this.dataMap != null) || (this._mask != null && this._mask.length > 0);
        }
        if (row && row.dataType == wijmo.DataType.String) {
            return (row.dataMap != null) || (row.mask != null && row.mask.length > 0);
        }

        // required by default
        return true;
    }
    /**
     * Gets the actual alignment if items in the column or row.
     *
     * Returns the value of the {@link align} property if it is not null, or
     * selects the alignment based on the column's {@link dataType}.
     * 
     * @param row Row that contains the cell being checked.
     * @return A string representing the cell alignment.
     */
    getAlignment(row?: Row): string {

        // honor explicit settings (empty means 'left')
        if (this._align != null) {
            return this._align;
        }
        if (row && row.align != null) {
            return row.align;
        }

        // if not explicitly set, align based on dataType
        if (!this._map) {
            switch (this.dataType) {
                case wijmo.DataType.Boolean:
                    return 'center';
                case wijmo.DataType.Number:
                    return 'right';
            }
        }
        if (row && !row.dataMap) {
            switch (row.dataType) {
                case wijmo.DataType.Boolean:
                    return 'center';
                case wijmo.DataType.Number:
                    return 'right';
            }
        }

        // align left by default
        return '';
    }

    // gets the binding used for sorting this column
    // (sortMemberPath if specified, binding otherwise)
    /*protected*/ _getBindingSort(): string {
        return this.sortMemberPath ? this.sortMemberPath :
            this.binding ? this.binding :
                null;
    }

    // parses a string in the format '<number>*' and returns the number (or null if the parsing fails).
    static _parseStarSize(value: any) {
        if (wijmo.isString(value)) {
            let len = value.length;
            if (len > 0 && value[len - 1] == '*') {
                let sz = len == 1 ? 1 : parseFloat(value);
                if (sz > 0 && !isNaN(sz)) {
                    return sz;
                }
            }
        }
        return null;
    }
}

/**
 * Represents a row in the grid.
 */
export class Row extends RowCol {
    private _data: any;
    /*private*/ _ubv: any; // unbound value storage

    /**
     * Initializes a new instance of the {@link Row} class.
     *
     * @param dataItem The data item that this row is bound to.
     */
    constructor(dataItem?: any) {
        super();
        this._f = RowColFlags.ColumnDefault;
        this._data = dataItem || null;
    }
    /**
     * Gets or sets the item in the data collection that the item is bound to.
     * 
     * The grid sets this property automatically when binding to data sources
     * defined by the {@link FlexGrid.itemsSource} property.
     * 
     * The {@link dataItem} property of group header rows is automatically set
     * to a {@link wijmo.CollectionViewGroup} object that contains information 
     * about the group.
     */
    get dataItem(): any {
        return this._data;
    }
    set dataItem(value: any) {
        this._data = value;
    }
    /**
     * Gets the index of this row's data item within the current data view.
     * 
     * This may be different from the row's {@link index} property if there
     * are group rows (which do not correspond to any data items) or in
     * classes that bind multiple rows to individual data items.
     */
    get dataIndex(): number {
        if (this._list && this._list._dirty) {
            this._list._update();
        }
        return this._idxData;
    }
    /**
     * Gets or sets the height of the row.
     * 
     * You can use the {@link renderHeight} property to retrieve the actual height
     * of the row, taking into account visibility, min/max limits, and default
     * height settings.
     * 
     * The default value for this property is **null**, which causes the
     * grid to use the default row height defined by the {@link FlexGrid.rows}
     * collection.
     */
    get height(): number | null {
        return this.size;
    }
    set height(value: number | null) {
        this.size = value;
    }
    /**
     * Gets the render height of the row.
     *
     * The value returned takes into account the row's visibility, default size,
     * and min and max sizes.
     */
    get renderHeight(): number {
        return this.renderSize;
    }
}

/**
 * Represents a row that serves as a header for a group of rows.
 */
export class GroupRow extends Row {
    _level = -1;

    /**
     * Initializes a new instance of the {@link GroupRow} class.
     */
    constructor(dataItem?: any) {
        super(dataItem);
        this.level = dataItem instanceof wijmo.collections.CollectionViewGroup ? dataItem.level : -1;
        this.isReadOnly = true; // group rows are read-only by default
    }
    /**
     * Gets or sets the hierarchical level of the group associated with this {@link GroupRow}.
     */
    get level(): number {
        return this._level;
    }
    set level(value: number) {
        wijmo.asInt(value);
        if (value != this._level) {
            this._level = value;
            this.onPropertyChanged();
        }
    }
    /**
     * Gets a value that indicates whether this {@link GroupRow} has child rows.
     */
    get hasChildren(): boolean {
        if (this.grid != null && this._list != null) {

            // get the next row
            this._list._update();
            let rNext = this.index < this._list.length - 1
                ? this._list[this.index + 1]
                : null;

            // check if it's a group row or a new row template
            let gr = wijmo.tryCast(rNext, GroupRow),
                nr = wijmo.tryCast(rNext, _NewRowTemplate);

            // return true if there is a next row and 
            // it's a data row or a deeper group row
            return rNext != null && nr == null && (gr == null || gr.level > this.level);
        }
        return true;
    }
    /**
     * Gets or sets a value that indicates whether this {@link GroupRow} is 
     * collapsed (child rows are hidden) or expanded (child rows are visible).
     */
    get isCollapsed(): boolean {
        return this._getFlag(RowColFlags.Collapsed);
    }
    set isCollapsed(value: boolean) {
        if (!!value != this.isCollapsed && this._list != null) {
            this._setCollapsed(wijmo.asBoolean(value));
        }
    }
    /**
     * Gets the header text for this {@link GroupRow}.
     */
    getGroupHeader(): string {
        let g = this.grid,
            fmt = g.groupHeaderFormat || wijmo.culture.FlexGrid.groupHeaderFormat,
            group = this.dataItem;
        if (group instanceof wijmo.collections.CollectionViewGroup && fmt && g.showGroups && !g.childItemsPath) {

            // get group info
            let propName = group.groupDescription['propertyName'],
                value = group.name,
                col = g.getColumn(propName);

            // customize with column info if possible
            let isHtml = this.isContentHtml; // TFS 114902
            if (col) {
                isHtml = isHtml || col.isContentHtml;

                // apply column header
                if (col.header) {
                    propName = col.header;
                }

                // apply column dataMap and format
                let map = col.dataMap;
                if (map) {
                    value = map.getDisplayValue(value);
                }

                // apply column format (TFS 236101, 412818)
                if (col.dataType == wijmo.getType(value)) {
                    value = wijmo.Globalize.format(value, col.format);
                }
            } else {
                propName = wijmo.toHeaderCase(propName); // no column info, do the best we can...
            }

            // get count including all items (including items not on the current page,
            // as calculated when setting Column.Aggregate TFS 195467)
            let count = group.getAggregate(wijmo.Aggregate.CntAll, null, g.collectionView);
            //let count = group.items.length;

            // build header text
            return wijmo.format(fmt, {
                name: wijmo.escapeHtml(propName),
                value: isHtml ? value : wijmo.escapeHtml(value),
                level: group.level,
                count: count
            });
        }
        return '';
    }

    // sets the collapsed/expanded state of a group row
    _setCollapsed(collapsed: boolean) {
        let g = this.grid,
            rows = g.rows,
            rng = this.getCellRange();

        // TODO: finish editing?

        // fire GroupCollapsedChanging
        let e = new CellRangeEventArgs(g.cells, new CellRange(this.index, -1));
        if (!g.onGroupCollapsedChanging(e)) {
            return;
        }

        // apply new value
        g.deferUpdate(() => {
            rows.deferUpdate(() => {

                // collapse/expand this group
                this._setFlag(RowColFlags.Collapsed, collapsed, true);
                for (let r = rng.topRow + 1; r <= rng.bottomRow && r > -1 && r < rows.length; r++) {

                    // apply state to this row
                    rows[r]._setFlag(RowColFlags.ParentCollapsed, collapsed, true);

                    // if this is a group, skip range to preserve the original state
                    let gr = rows[r];
                    if (gr instanceof GroupRow && gr.isCollapsed) {
                        r = gr.getCellRange().bottomRow;
                    }
                }
            });
        });

        // fire GroupCollapsedChanged
        g.onGroupCollapsedChanged(e);
    }

    /**
     * Gets a {@link CellRange} object that contains all of the rows in the group represented 
     * by this {@link GroupRow} and all of the columns in the grid.
     */
    getCellRange(): CellRange {
        let rows = this._list,
            top = this.index,
            bottom = rows.length - 1;
        for (let r = top + 1; r <= bottom; r++) {
            let gr = rows[r];
            if (gr instanceof GroupRow && gr.level <= this.level) {
                bottom = r - 1;
                break;
            }
        }
        return new CellRange(top, 0, bottom, this.grid.columns.length - 1);
    }
}

/**
 * Abstract class that serves as a base for row and column collections.
 */
export class RowColCollection<T extends RowCol = RowCol> extends wijmo.collections.ObservableArray<T> {
    _g: FlexGrid;
    _frozen = 0;
    _lastFrozen = -1;
    _firstVisible = -1;
    _vlen = 0;
    _szDef = 28;
    _szTot = 0;
    _szCustom = false;
    _dirty = false;
    _szMin: number;
    _szMax: number;

    /**
     * Initializes a new instance of the {@link RowColCollection} class.
     *
     * @param g The {@link FlexGrid} that owns the collection.
     * @param defaultSize The default size of the elements in the collection.
     */
    constructor(g: FlexGrid, defaultSize: number) {
        super();
        this._g = wijmo.asType(g, FlexGrid);
        this._szDef = wijmo.asNumber(defaultSize, false, true);
    }
    /**
     * Gets the {@link FlexGrid} that owns this collection.
     */
    get grid(): FlexGrid {
        return this._g;
    }
    /**
     * Gets or sets the default size of elements in the collection.
     */
    get defaultSize(): number {
        return this._szDef;
    }
    set defaultSize(value: number) {
        this._szCustom = true;
        if (this._szDef != value) {
            this._szDef = wijmo.asNumber(value, false, true);
            this._dirty = true;
            this._g.invalidate();
        }
    }
    /**
     * Gets or sets the number of frozen rows or columns in the collection.
     *
     * Frozen rows and columns do not scroll, and instead remain at the top or left of
     * the grid, next to the fixed cells. Unlike fixed cells, however, frozen
     * cells may be selected and edited like regular cells.
     */
    get frozen(): number {
        return this._frozen;
    }
    set frozen(value: number) {
        if (value != this._frozen) {
            this._frozen = wijmo.asNumber(value, false, true);
            this._dirty = true;
            this._g.invalidate();
        }
    }
    /**
     * Checks whether a column or row is frozen.
     *
     * @param index The index of the column or row to check.
     */
    isFrozen(index: number): boolean {
        return index < this.frozen;
    }
    /**
     * Gets or sets the minimum size of elements in the collection.
     */
    get minSize(): number {
        return this._szMin;
    }
    set minSize(value: number) {
        if (value != this._szMin) {
            this._szMin = wijmo.asNumber(value, true, true);
            this._dirty = true;
            this._g.invalidate();
        }
    }
    /**
     * Gets or sets the maximum size of elements in the collection.
     */
    get maxSize(): number {
        return this._szMax;
    }
    set maxSize(value: number) {
        if (value != this._szMax) {
            this._szMax = wijmo.asNumber(value, true, true);
            this._dirty = true;
            this._g.invalidate();
        }
    }
    /**
     * Gets the total size of the elements in the collection.
     */
    getTotalSize(): number {
        if (this._dirty) {
            this._update();
        }
        return this._szTot;
    }
    /**
     * Gets the number of visible elements in the collection ({@link Row.isVisible}).
     */
    get visibleLength(): number {
        if (this._dirty) {
            this._update();
        }
        return this._vlen;
    }
    /**
     * Gets the index of the element at a given physical position.
     * @param position Position of the item in the collection, in pixels.
     */
    getItemAt(position: number): number {

        // update if necessary
        if (this._dirty) {
            this._update();
        }

        // shortcut for common case
        if (position <= 0 && this.length > 0 && this[0].renderSize) {
            return 0;
        }

        // round to improve precision when pinch-zooming
        // REVIEW: doesn't seem necessary, causes a little issue with frozen cells (TFS 382265)
        //if (this._g && this._g.isTouching) {
        //    position = Math.round(position);
        //}

        // binary search
        // REVIEW: is this worth it? might be better to use a simpler method?
        // could assume constant height and use a for/loop after that...
        let len = this.length,
            min = 0,
            max = len - 1,
            cur: number,
            item: RowCol;
        while (min <= max) {
            cur = (min + max) >>> 1;
            item = this[cur] as RowCol;
            if (item._pos >= position && cur > 0) { // TFS 469099
                max = cur - 1;
            } else if (item._pos + item.renderSize <= position && cur < len - 1) {
                min = cur + 1;
            } else {

                // skip invisible elements
                while (cur > 0 && !this[cur].renderSize) {
                    cur--;
                }
                while (cur < len - 1 && !this[cur].renderSize) {
                    cur++;
                }

                // done
                return cur;
            }
        }

        // not found, return max
        return max;
    }
    /**
     * Finds the next visible cell for a selection change.
     * @param index Starting index for the search.
     * @param move Type of move (size and direction).
     * @param pageSize Size of a page (in case the move is a page up/down).
     */
    getNextCell(index: number, move: SelMove, pageSize = 0) {
        let i: number,
            SM = SelMove;
        switch (move) {
            case SM.Next:
            case SM.NextCell:
                for (i = index + 1; i < this.length; i++) {
                    if (this[i].renderSize > 0) return i;
                }
                break;
            case SM.NextEditableCell:
                for (i = index + 1; i < this.length; i++) {
                    if (this[i].renderSize > 0 && !this[i].isReadOnly) return i;
                }
                break;
            case SM.Prev:
            case SM.PrevCell:
                for (i = index - 1; i >= 0; i--) {
                    if (this[i].renderSize > 0) return i;
                }
                break;
            case SM.PrevEditableCell:
                for (i = index - 1; i >= 0; i--) {
                    if (this[i].renderSize > 0 && !this[i].isReadOnly) return i;
                }
                break;
            case SM.End:
                for (i = this.length - 1; i >= 0; i--) {
                    if (this[i].renderSize > 0) return i;
                }
                break;
            case SM.Home:
                for (i = 0; i < this.length; i++) {
                    if (this[i].renderSize > 0) return i;
                }
                break;
            case SM.NextPage:
                i = this.getItemAt(this[index].pos + this[index].renderSize + pageSize); // TFS 366564
                return i < 0 ? this.getNextCell(index, SelMove.End, pageSize) :// bad index, go to last item
                    i == index && i < this.length - 1 && this[i + 1].renderSize ? i + 1 : // page too small, go to next item
                        i;
            case SM.PrevPage:
                i = this.getItemAt(this[index].pos - pageSize);
                return i < 0 ? this.getNextCell(index, SelMove.Home, pageSize) : // bad index, go to first item
                    i == index && i > 0 && this[i - 1].renderSize ? i - 1 : // page too small, go to previous item
                        i;
        }
        return index;
    }
    /**
     * Checks whether an element can be moved from one position to another.
     *
     * @param src The index of the element to move.
     * @param dst The position to which to move the element, or specify -1 to append the element.
     * @param adjustFrozenCount Whether to adjust the frozen element count when
     * the movement is into or out of the frozen area.
     * @return Returns true if the move is valid, false otherwise.
     */
    canMoveElement(src: number, dst: number, adjustFrozenCount = true): boolean {

        // no move?
        if (dst == src) {
            return false;
        }

        // invalid move?
        if (src < 0 || src >= this.length || dst >= this.length) {
            return false;
        }

        // illegal move?
        if (adjustFrozenCount) {
            if (dst < 0) dst = this.length - 1;
            let start = Math.min(src, dst),
                end = Math.max(src, dst);
            for (let i = start; i <= end; i++) {
                if (!this[i].allowDragging) {
                    return false;
                }
            }
        }

        // can't move anything past the new row template (TFS 109012)
        if (this[dst] instanceof _NewRowTemplate) {
            return false;
        }

        // all seems OK
        return true;
    }
    /**
     * Moves an element from one position to another.
     * @param src Index of the element to move.
     * @param dst Position where the element should be moved to (-1 to append).
     * @param adjustFrozenCount Whether to adjust the frozen element count when
     * the movement is into or out of the frozen area.
     * @return Returns true if the element was moved, false otherwise.
     */
    moveElement(src: number, dst: number, adjustFrozenCount = true): boolean {
        if (this.canMoveElement(src, dst, adjustFrozenCount)) { // TFS 415539

            // move the row or column
            let e = this[src];
            this.removeAt(src);
            if (dst < 0) {
                dst = this.length;
            }
            this.insert(dst, e);

            // adjust frozen boundary (TFS 399875)
            if (adjustFrozenCount) {
                let frz = this.frozen;
                if (src < frz && dst >= frz) {
                    this.frozen--;
                } else if (src >= frz && dst < frz) {
                    this.frozen++;
                }
            }

            // moved
            return true;
        }

        // did not move
        return false;
    }
    /**
     * Keeps track of dirty state and invalidate grid on changes.
     */
    onCollectionChanged(e = wijmo.collections.NotifyCollectionChangedEventArgs.reset) {
        this._dirty = true;
        this._g.invalidate();
        super.onCollectionChanged(e);
        // NOTE: do not update the _list member here since this method
        // is not called while the list is updating (TFS 372937)
    }
    /**
     * Appends an item to the array.
     *
     * @param item Item to add to the array.
     * @return The new length of the array.
     */
    push(item: T): number {
        item._setList(this);
        return super.push(item);
    }
    /**
     * Removes or adds items to the array.
     *
     * @param index Position where items are to be added or removed.
     * @param count Number of items to remove from the array.
     * @param ...item One or mode items to add to the array.
     * @return An array containing the removed elements.
     */
    splice(index: number, count: number, ...item: T[]): T[] {

        // clear list reference from items being removed
        for (let i = index; i < index + count && i < this.length; i++) {
            let item = this[i];
            if (item instanceof RowCol) { // could be null (TFS 419415)
                item._setList(null);
            }
        }

        // set list reference to items being added
        item.forEach(i => i._setList(this));

        // let base class do the actual work
        return super.splice(index, count, ...item);
    }
    /**
     * Suspends notifications until the next call to {@link endUpdate}.
     */
    beginUpdate() {

        // make sure we're up-to-date before suspending the updates
        this._update();

        // OK to suspend things now
        super.beginUpdate();
    }

    // apply a new default size if it hasn't been set explicitly
    _setDefaultSize(value: number) {
        if (!this._szCustom) {
            this.defaultSize = value;
            this._szCustom = false;
        }
    }

    // updates the index, size and position of the elements in the array.
    _update(): boolean {

        // update only if we're dirty *and* if the collection is not updating.
        // this improves performance, e.g. when expanding/collapsing nodes.
        if (this._dirty && !this.isUpdating) {
            this._dirty = false;
            this._lastFrozen = -1; // TFS 367631
            this._firstVisible = -1;
            let vlen = 0,
                pos = 0,
                sz: number,
                rc: RowCol;
            for (let i = 0; i < this.length; i++) {
                rc = this[i];
                rc._idx = i;
                rc._idxVis = vlen;
                rc._pos = pos;
                rc._setList(this);
                sz = rc.renderSize;
                if (sz > 0) {
                    pos += sz;
                    vlen++;
                    if (i < this._frozen) {
                        this._lastFrozen = i;
                    }
                }
                if (this._firstVisible < 0 && rc.visible) {
                    this._firstVisible = i;
                }
            }
            this._vlen = vlen;
            this._szTot = pos;
            return true;
        }
        return false;
    }
}

/**
 * Represents a collection of {@link Column} objects in a {@link FlexGrid} control.
 */
export class ColumnCollection extends RowColCollection<Column> {
    _descById: string;

    /**
     * Gets a column by name, binding, or index.
     *
     * The method searches the column by name. If a column with the given name 
     * is not found, it searches by binding. The searches are case-sensitive.
     *
     * @param name The name, binding, or index to find.
     * @return The column with the specified name or binding, or null if not found.
     */
    getColumn(name: string | number): Column {
        let index = wijmo.isNumber(name) ? name : this.indexOf(name);
        return index > -1 ? this[index] : null;
    }
    /**
     * Gets the index of a column by name or binding.
     *
     * The method searches the column by name. If a column with the given name 
     * is not found, it searches by binding. The searches are case-sensitive.
     *
     * @param name The name or binding to find.
     * @return The index of column with the specified name or binding, or -1 if not found.
     */
    indexOf(name: any): number {

        // direct lookup
        if (name instanceof Column) {
            return super.indexOf(name);
        }

        // by name
        for (let i = 0; i < this.length; i++) {
            if (this[i].name == name) {
                return i;
            }
        }

        // by binding
        for (let i = 0; i < this.length; i++) {
            if (this[i].binding == name) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Gets or sets the ID of an element that contains a description
     * of the column headers.
     * 
     * The ID is used as the value of the **aria-describedby**
     * attribute for all column header elements. For column-specific 
     * descriptions, use the column's {@link Column.describedById} instead.
     */
    get describedById(): string {
        return this._descById;
    }
    set describedById(value: string) {
        if (value != this._descById) {
            this._descById = wijmo.asString(value);
            if (this._g) {
                this._g.invalidate();
            }
        }
    }
    /**
     * Gets the index of the first visible column (where the outline tree is displayed).
     */
    get firstVisibleIndex() {
        if (this._dirty) {
            this._update();
        }
        return this._firstVisible;
    }

    // update the width of the columns with star sizes
    _updateStarSizes(szAvailable: number): boolean {
        let resized = false,
            starCount = 0,
            lastStarCol: Column;

        // avoid occasional unnecessary horizontal scrollbar
        szAvailable -= 0.5;

        // count stars, remove fixed size columns from available size
        for (let i = 0; i < this.length; i++) {
            let col = this[i];
            if (col.isVisible) {
                if (col._szStar) {
                    starCount += Column._parseStarSize(col._szStar);
                    lastStarCol = col;
                } else {
                    szAvailable -= col.renderWidth;
                }
            }
        }

        // update width of star columns
        if (lastStarCol) {
            let lastWidth = szAvailable;
            for (let i = 0; i < this.length; i++) {
                let col = this[i];
                if (col.isVisible) {
                    if (col._szStar) {
                        let sz = col._sz;
                        if (col == lastStarCol && lastWidth > 0) { // TFS 142608
                            sz = lastWidth; // to avoid round-off errors...
                        } else {
                            sz = Math.max(0, Math.round(Column._parseStarSize(col._szStar) / starCount * szAvailable));
                            lastWidth -= sz; // col.renderWidth; // TFS 396680
                        }
                        if (sz != col._sz) {
                            col._sz = sz;
                            resized = true;
                        }
                    }
                }
            }

            // update if resized
            if (resized) {
                this._dirty = true;
                this._update();
            }

            // all done
            return resized;
        }

        // no star sizes...
        return false;
    }
}

/**
 * Represents a collection of {@link Row} objects in a {@link FlexGrid} control.
 */
export class RowCollection extends RowColCollection<Row> {
    _maxLevel = -1;
    _ariaLabel: string;

    /**
     * Gets or sets a string used as an ARIA label for all rows in this
     * collection.
     * 
     * For example, the code below adds ARIA labels to the header and
     * data rows:
     * 
     * <pre>
     * grid.rows.ariaLabel = 'data row';
     * grid.columnHeaders.rows.ariaLabel = 'header row';
     * </pre>
     */
    get ariaLabel(): string {
        return this._ariaLabel;
    }
    set ariaLabel(value: string) {
        if (value != this.ariaLabel) {
            this._ariaLabel = wijmo.asString(value);
            if (this._g) {
                this._g.refresh();
            }
        }
    }
    /**
     * Gets the maximum group level in the grid.
     *
     * @return The maximum group level or -1 if the grid has no group rows.
     */
    get maxGroupLevel(): number {
        if (this._dirty) {
            this._update();
        }
        return this._maxLevel;
    }

    // override to keep track of maximum group level and dataIndex (TFS 425327)
    _update(): boolean {
        if (super._update()) {
            let view = this.grid ? this.grid.collectionView : null,
                items = view ? view.items : null,
                idxData = 0;
            this._maxLevel = -1;
            this.forEach(row => {
                if (row instanceof GroupRow && row.level > this._maxLevel) {
                    this._maxLevel = row.level;
                }
                row._idxData = -1;
                let item = row.dataItem;
                if (item && items) {
                    row._idxData = (item === items[idxData]) ? idxData // same as last item (e.g. first item, multirow)
                        : (item === items[idxData + 1]) ? ++idxData // next (most common scenario)
                            : -1; // none (GroupRow/childItemsPath)
                }

                /* sanity */
                //assert(row._idxData > -1 || item == null || items.indexOf(item) < 0, 'failed to get data index!');
            });
            return true;
        }
        return false;
    }
}
    }
    


    module wijmo.grid {
    





/**
 * Provides additional to {@link Column} class properties exposed in {@link ColumnGroup} class.
 */
export type _ColumnGroupProperties = {
    _rng: CellRange;

    level: number;

    collapseTo: string;

    isCollapsed: boolean;

    isEmpty: boolean;
};

/**
 * Intended for handling column groups changes.
 */
export interface _IColumnGroupChangeHandler {
    handleCollectionChange(): void;

    handlePropertyChange(grp: ColumnGroup): void;
}

/**
 * Handles the grid's collection of column groups.
 */
export interface _IColumnGroupHandler {
    columnGroups: ColumnGroupCollection;

    createColumnGroups(arr: any[]): void;
    
    hasColumnGroups(): boolean;

    getGroupDefinitions(): any[];

    getColumnGroup(r: number, c: number): Column & _ColumnGroupProperties;

    canMoveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number): boolean;

    moveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number, child: boolean): boolean;
}

/**
 * Handles the grid's collection of column groups.
 */
export class _ColumnGroupHandler implements _IColumnGroupHandler, _IColumnGroupChangeHandler {
    private _grid: FlexGrid;
    private _colGroups: ColumnGroupCollection;
    private _groupDefs: any[];
    private _updatingCollection = 0; // indicates whether handling of collection changes is currently suspended
    private _initialized = false;

    /**
     * Initializes a new instance of the {@link _ColumnGroupHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _ColumnGroupHandler}.
     */
    constructor(grid: FlexGrid) {
        this._grid = grid;

        // initialize the column groups
        this._initializeColumnGroups();

        // mark as initialized
        this._initialized = true;
    }

    // ** _IColumnGroupHandler

    /**
     * Gets the collection of column groups.
     */
    get columnGroups(): ColumnGroupCollection {
        return this._colGroups;
    }

    /**
     * Initializes the column groups based on an array of 
     * column definition objects.
     * 
     * @param arr Array of column definition objects that defines the groups.
     */
    createColumnGroups(arr: any[]): void {
        // reset initialized flag
        this._initialized = false;

        // actually creates column groups
        this._createColumnGroups(arr);

        // mark as initialized
        this._initialized = true;
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
     * @param r Index of the row containted in the the group.
     * @param c Index of the column containted in the group.
     */
    getColumnGroup(r: number, c: number): Column & _ColumnGroupProperties {
        return this._getColumnGroup(r, c);
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
        // no move?
        if (srcRow == dstRow && srcCol == dstCol) {
            return false;
        }

        // invalid move?
        let g = this._grid,
            rows = g.columnHeaders.rows,
            cols = g.columns;
        if (srcRow < 0 || srcRow >= rows.length || srcCol < 0 || srcCol >= cols.length ||
            dstRow < 0 || dstRow >= rows.length || dstCol < 0 || dstCol >= cols.length) {
            return false;
        }

        // get groups
        let src = this._getColumnGroup(srcRow, srcCol),
            dst = this._getColumnGroup(dstRow, dstCol);

        // sanity
        if (!src || !dst || src == dst) {
            return false;
        }

        // prevent moving parent to child group
        if (src.level < dst.level) {
            if (src._containsGroup(dst)) {
                return false;
            }
        }

        // prevent removing collapseTo column
        let srcParent = src.parentGroup,
            dstParent = dst.parentGroup;
        if (srcParent && srcParent !== dstParent && srcParent._isCollapseTo(src)) {
            return false;
        }

        // all seems OK
        return true;
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
        if(this.canMoveColumnGroup(srcRow, srcCol, dstRow, dstCol)) {
            // get groups
            let src = this._getColumnGroup(srcRow, srcCol),
                dst = this._getColumnGroup(dstRow, dstCol);

            // sanity
            if (!src || !dst || src == dst) {
                return false;
            }

            // check that the parent is empty when moving the child
            if (child && !dst.isEmpty) {
                return false;
            }

            // get collections
            let srcLst = this._getCollection(src),
                dstLst = child ? dst.columns : this._getCollection(dst);
            if (!srcLst || !dstLst) { // sanity
                return false;
            }

            // get dest index
            let dstIdx = child ? 0 : dstLst.indexOf(dst);
            if (dstIdx < 0) { // sanity
                return false;
            }
            
            // move to the right from another collection?
            if (!child && srcLst != dstLst && dstCol > srcCol) {
                dstIdx++;
            }

            // move group
            this._deferCollectionUpdate(() => {
                if (!srcLst.remove(src)) {
                    return false;
                }
                dstLst.insert(dstIdx, src);
            });

            // moved
            return true;
        }

        // did not move
        return false;
    }

    // ** _IColumnGroupChangeHandler

    /**
     * Handles column groups collection changes: adding and removing items.
     */
    handleCollectionChange(): void {
        // rebuild column groups only if column groups fully initialized to avoid reentrant issues
        // and handling of collection changes is not currently suspended
        if (this._initialized && !this._updatingCollection) {
            // reset initialized flag
            this._initialized = false;

            // rebuild existing column groups for the changes to take effect
            this._buildColumnGroups();

            // mark as initialized
            this._initialized = true;
        }
    }

    /**
     * Handles column group property changes.
     * 
     * @param grp Column group affected
     */
    handlePropertyChange(grp: ColumnGroup): void {
        // apply changes only if column groups fully initialized to avoid reentrant issues
        if (grp && this._initialized) {
            let g = this._grid;

            // update column header content if changed
            // Note: handles this change separately because header updated in unbound mode
            let rng = grp._rng,
                header = grp.header;
            if (header != grp._curr_header) {
                for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                    for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                        g.columnHeaders.setCellData(r, c, header);
                        grp._curr_header = header; // remember currently applied header
                    }
                }
            }

            // apply changes for unbound columns (groups with children)
            if (grp.columns.length > 0) {
                g.invalidate();
            }
        }
    }

    // ** implementation

    // Initializes the column groups with empty collection
    private _initializeColumnGroups(): void {
        // initialize with empty collection
        let g = this._grid;
        const colGroups = new ColumnGroupCollection();
        this._groupDefs = colGroups;
        this._colGroups = colGroups; 

        // set owner and change handler
        this._colGroups._setOwner(g);
        this._colGroups._setChangeHandler(this);
    }

    // Initializes and builds the column groups based on an array of column definition objects.
    private _createColumnGroups(arr: any[]): void {
        let g = this._grid;
        this._groupDefs = wijmo.asArray(arr);

        // remove owner of column groups
        if (this._colGroups) {
            this._colGroups._setOwner(null);
        }

        // parse header columns
        this._colGroups = ColumnGroupCollection._parse(arr);

        // buiild parsed column groups
        this._buildColumnGroups();
    }

    // Builds the column groups
    private _buildColumnGroups(): void {
        let g = this._grid;

        // remove change handler if any
        this._colGroups._removeChangeHandler();

        // ensure that groups are all of correct type
        this._assertColumnGroups(this._colGroups);

        // don't mess with the layout
        g.autoGenerateColumns = false;

        // clear columns collection
        g.columns.clear();

        // begin build for each group
        this._colGroups._setOwner(g);
        this._colGroups.forEach(grp => {
            grp._beginBuild();
        });

        // set group ranges and add bound columns (no children) to columns collection
        let maxLevel = 0;
        this._colGroups.forEach(grp => {
            this._addColumnGroup(grp);
            maxLevel = Math.max(maxLevel, grp._getMaxLevel());
        });

        // expand groups that don't have enough rows
        this._colGroups.forEach(grp => {
            grp._expandRange(maxLevel);
        });

        // add new header rows to the grid
        let rows = g.columnHeaders.rows;
        rows.clear();
        for (let r = 0; r <= maxLevel; r++) {
            let row = new Row();
            rows.splice(r, 0, row);
            if (r < maxLevel) { // center-align headers for all rows but the last
                row.cssClassAll = 'wj-colgroup';
            }
        }

        // set column header content
        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < g.columns.length; c++) {
                let grp = this._getColumnGroup(r, c);
                if (grp) {
                    let header = grp.header || wijmo.toHeaderCase(grp.binding);
                    g.columnHeaders.setCellData(r, c, header);
                    grp._curr_header = grp.header; // remember currently applied header
                }
            }
        }

        // set change handler
        this._colGroups._setChangeHandler(this);

        // check if collapsed for all columns
        this._colGroups.forEach(grp => {
            grp._checkIfCollapsed();
        });
    }

    // Gets the column group that contains a given row and column.
    private _getColumnGroup(r: number, c: number): ColumnGroup {
        let g = this._grid;
        if (r < g.columnHeaders.rows.length && c < g.columns.length) { // sanity
            for (let groups = this._colGroups; groups;) { // start scanning at the top level
                let startGroups = groups;
                for (let i = 0; i < groups.length; i++) {
                    let grp = groups[i],
                        rng = grp._rng;
                    if (rng.containsColumn(c)) { // found column
                        if (rng.containsRow(r) || grp.columns.length == 0) {
                            return grp; // found row
                        }
                        groups = grp.columns; // wrong row, move on to the next level
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

    // Gets the column collection that contains a given column.
    private _getCollection(grp: ColumnGroup): ColumnGroupCollection {
        const parent = grp.parentGroup;
        return parent ? parent.columns : this._colGroups;
    }

    // ensure that group collections are all of the ColumnGroupCollection type
    // and groups are all of the ColumnGroup type
    private _assertColumnGroups(lst: ColumnGroupCollection): void {
        // ensure for collection
        wijmo.assert(lst instanceof ColumnGroupCollection, 'column groups contain items of invalid collection type');

        // ensure for columns
        lst.forEach(col => {
            wijmo.assert(col instanceof ColumnGroup, 'column groups contain items of invalid type');

            this._assertColumnGroups(col.columns);
        });
    }

    // add grid's columns from column groups
    private _addColumnGroup(grp: ColumnGroup): void {
        let g = this._grid;

        // initialize group column range
        grp._rng.col = g.columns.length;

        // add column or group
        if (grp.columns.length == 0) {
            g.columns.push(grp);
        } else {
            grp.columns.forEach(child => {
                this._addColumnGroup(child);
            });
        }

        // close group column range
        grp._rng.col2 = g.columns.length - 1;
    }

    // Suspends handling of collection changes until the next call to _endCollectionUpdate.
    private _beginCollectionUpdate(): void {
        this._updatingCollection++;
    }

    // Resumes handling of collection changes suspended by a call to _beginCollectionUpdate.
    private _endCollectionUpdate(): void {
        this._updatingCollection--;
        if (this._updatingCollection <= 0) {
            this.handleCollectionChange();
        }
    }

    // Executes a function within a _beginCollectionUpdate/_endCollectionUpdate block.
    private _deferCollectionUpdate(fn: Function): void {
        try {
            this._beginCollectionUpdate();
            fn();
        } finally {
            this._endCollectionUpdate();
        }
    }
}

/**
 * Extends the {@link Column} class to provide column groups.
 * 
 * This class adds a {@link columns} property so any group column
 * may have any number of child columns.
 * 
 * It also adds {@link isCollapsed} and {@link collapseTo}
 * properties that control the expand/collapse behavior of the
 * group.
 * 
 * Since it extends the {@link Column} class, you can create
 * and use {@link ColumnGroup} columns as you normal columns.
 * 
 * For example, the code below creates a grid with two collapsible
 * column groups, each with a few child columns:
 * 
 * ```typescript
 * let theGrid = new FlexGrid('#theGrid', {
 *     selectionMode: 'MultiRange',
 *     autoGenerateColumns: false,
 *     columns: [
 *         { header: 'Transaction', collapseTo: 'id', align: 'left', columns: [
 *              { binding: 'id', header: 'ID' },
 *              { binding: 'date', header: 'Date' },
 *              { binding: 'time', header: 'Time', format: 'HH:mm:ss' }
 *         ]},
 *         { header: 'Details', collapseTo: 'sales', align: 'left', columns: [
 *              { binding: 'country', header: 'Country' },
 *              { binding: 'sales', header: 'Sales' },
 *              { binding: 'expenses', header: 'Expenses' }
 *         ]}
 *     ],
 *     itemsSource: getData()
 * });
 * ```
 */
export class ColumnGroup extends Column {
    private _ownerList: ColumnGroupCollection;
    private _changeHdl: _IColumnGroupChangeHandler;
    /*private*/ _rng = new CellRange(0, -1);
    /*private*/ _curr_header: string | null; // currently applied header
    protected _cols: ColumnGroupCollection;
    protected _lvl = 0;
    protected _collTo: string;
    protected _collapsed = false;

    /**
     * Initializes a new instance of the {@link ColumnGroup} class.
     *
     * @param options JavaScript object containing initialization data for the instance.
     * @param parent Parent group, or null for top-level groups.
     */
    constructor(options?: any, parent?: ColumnGroup | null) {
        super(); // don't pass options until we are initialized

        // initialize child column groups
        this._cols = new ColumnGroupCollection();

        // parse options (including child columns)
        wijmo.copy(this, options);

        // add this group to the parent group's columns collection
        const pCols = parent && parent.columns;
        if (pCols && pCols.indexOf(this) < 0) {
            pCols.push(this);
        }
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        if (key == 'columns') {
            const arr = wijmo.asArray(value);
            this._cols = ColumnGroupCollection._parse(arr);
            return true;
        }
        return false;
    }

    // object model

    /**
     * Gets or sets the collection of child {@link ColumnGroup} columns.
     */
    get columns(): ColumnGroupCollection {
        return this._cols;
    }
    // this is an unofficial alias for the 'columns' property, needed to support interops
    get columnGroups(): ColumnGroupCollection {
        return this._cols;
    }

    /**
     * Gets the value that indicates whether the group contains child columns or not.
     */
    get isEmpty(): boolean {
        return this._cols.length === 0;
    }

    /**
     * Gets this {@link ColumnGroup}'s parent column group.
     * 
     * You can use this property to restrict column dragging
     * so users can only drag within groups. For example:
     * 
     * ```typescript
     * let theDragColumn: ColumnGroup;
     * new FlexGrid(host, {
     *     columnGroups: [
     *         { binding: 'id', allowDragging: true },
     *         { binding: 'name', allowDragging: true },
     *         ...
     *     ],
     *     allowDragging: AllowDragging.Columns,
     *     draggingColumn: (s, e) => { // keep track of group being dragged
     *         theDragColumn = e.getColumn(true) as ColumnGroup;
     *     },
     *     draggingColumnOver: (s, e) => { // allow dropping only within groups
     *         let col = e.getColumn(true) as ColumnGroup;
     *         e.cancel = col.parentGroup != theDragColumn.parentGroup;
     *     },
     *     itemsSource: getData(),
     * });
     * ```
     */
    get parentGroup(): ColumnGroup { // TFS 442304
        const list = this._ownerList,
            owner = list && list.owner;
        if (owner instanceof ColumnGroup) {
            return owner;
        }
        return null;
    }
    /**
     * Gets this {@link ColumnGroup}'s level (the number of parent groups it has).
     * 
     * Top level groups have level zero. Their children have level 1, and so on.
     */
    get level(): number {
        let grp: ColumnGroup = this,
            level = 0;
        while (grp.parentGroup) {
            grp = grp.parentGroup;
            level++;
        }
        return level;
    }
    /**
     * Gets or sets the binding of the column that should remain 
     * visible when this {@link ColumnGroup} is collapsed.
     */
    get collapseTo(): string {
        return this._collTo;
    }
    set collapseTo(value: string) {
        const collTo = wijmo.asString(value);

        if (this._collTo != collTo) {
            this._collTo = collTo;

            // update the collapse state
            this._updateCollapsedState();
        }
    }
    /**
     * Gets or sets a value that determines whether this {@link ColumnGroup}
     * is collapsed.
     */
    get isCollapsed(): boolean {
        return this._collapsed;
    }
    set isCollapsed(value: boolean) {

        // change the collapsed value
        let g = this.grid,
            e: CellRangeEventArgs = null;
        if (value != this._collapsed) {
            if (g) { // raise changing event
                e = new CellRangeEventArgs(g.columnHeaders, this._rng, this);
                if (g.onColumnGroupCollapsedChanging(e)) {
                    this._collapsed = wijmo.asBoolean(value);
                } else {
                    e = null;
                }
            } else { // grid not set yet, so no events
                this._collapsed = wijmo.asBoolean(value);
            }
        }

        // update the collapse state (always)
        this._updateCollapsedState();

        // raise changed event
        if (g && e) {
            g.onColumnGroupCollapsedChanged(e);
        }
    }

    // ** overrides

    /**
     * Overridden to return the parent grid.
     * 
     * This is needed since not all {@link ColumnGroup} columns are added
     * to the grid's columns collection.
     */
    get grid(): FlexGrid {
        const list = this._ownerList,
            owner = list && list.owner;
        if (owner instanceof ColumnGroup) {
            return owner.grid;
        }
        if (owner instanceof FlexGrid) {
            return owner;
        }
        return null;
    }

    // ** implementation

    // begin build and update group level and row range
    /*internal*/ _beginBuild(): void {
        // store/update group level
        this._lvl = 0;
        for (let p = this.parentGroup; p; p = p.parentGroup) {
            this._lvl++;
        }

        // initialize group row range
        this._rng = new CellRange(0, -1);
        this._rng.row = this._rng.row2 = this._lvl;

        // begin build for child columns
        this._cols.forEach(col => {
            col._beginBuild();
        });
    }

    // set change handler
    /*internal*/ _setChangeHandler(handler: _IColumnGroupChangeHandler): void {
        this._changeHdl = handler;
        this._cols._setChangeHandler(handler);
    }

    // set change handler
    /*internal*/ _removeChangeHandler(): void {
        this._changeHdl = null;
        this._cols._removeChangeHandler();
    }

    // sets the owner list of this column group
    /*internal*/ _setOwnerList(ownerList: ColumnGroupCollection) {
        if (ownerList != this._ownerList) {
            this._ownerList = ownerList;
        }
    }

    // if collapsed, update collapsed state
    // otherwise check if collapsed for all child columns
    /*internal*/ _checkIfCollapsed(): void {
        let g = this.grid,
            cols = g ? g.columns : null;

        // sanity
        if (!cols) {
            return;
        }

        if (this._collapsed) {
            this._updateCollapsedState();
        } else {
            this._cols.forEach(col => {
                col._checkIfCollapsed();
            });
        }
    }

    // expand or collapse the group based on the value of the _collapsed member
    /*internal*/ _updateCollapsedState(): void {
        let g = this.grid,
            cols = g ? g.columns : null,
            rng = this._rng,
            collapsed = this._collapsed;

        // sanity
        if (!cols) {
            return;
        }
        
        // apply collapsed state to all child columns
        this._cols.forEach(col => {
            if (col instanceof ColumnGroup) {
                col._collapsed = collapsed;
                col._updateCollapsedState();
            }
        });

        // get the index of the column to keep visible when the group is collapsed
        let collapseToIndex = rng.rightCol;
        if (this.collapseTo) {
            switch (this.collapseTo) {
                case '$first':
                    collapseToIndex = rng.leftCol;
                    break;
                case '$last':
                    collapseToIndex = rng.rightCol;
                    break;
                default:
                    let col = cols.getColumn(this.collapseTo),
                        index = cols.indexOf(col);
                    if (col && rng.containsColumn(index)) {
                        collapseToIndex = index;
                    }
                    break;
            }
        }

        // show/hide columns
        for (let c = rng.leftCol; c <= rng.rightCol; c++) {
            const visible = collapsed
                ? c == collapseToIndex // show collapseTo column
                : true; // show all

            // set ParentCollapsed flag to update isVisible property
            // note that visible property should not be changed 
            // because otherwise it can make the hidden column visible
            cols[c]._setFlag(RowColFlags.ParentCollapsed, !visible);
        }
    }

    // get the max level of the groups within this group
    /*internal*/ _getMaxLevel(): number {
        let maxLevel = this._lvl;
        this.columns.forEach(grp => {
            maxLevel = Math.max(maxLevel, grp._getMaxLevel());
        });
        return maxLevel;
    }

    // expand the column's vertical range to fill the required number of columns
    /*internal*/ _expandRange(maxLevel: number): void {

        // expand group
        let delta = maxLevel - this._getMaxLevel();
        if (delta > 0) {
            this._rng.row2 += delta; // expand this
            this._cols.forEach(grp => { // and shift children
                grp._shiftRange(delta);
            });
        }

        // make sure last row extends down to the max level
        let cols = this.grid.columns,
            rng = this._rng;
        for (let c = rng.col; c <= rng.col2; c++) {
            let grp = cols[c] as ColumnGroup;
            grp._rng.row2 = maxLevel;
        }
    }

    // shift expand the column's vertical range to line up at the bottom
    /*internal*/ _shiftRange(delta: number): void {
        this._rng.row += delta;
        this._rng.row2 += delta;
        this._cols.forEach(grp => {
            grp._shiftRange(delta);
        });
    }

    // check whether the column contains a given column at any level of hierarchy
    /*internal*/ _containsGroup(grp: ColumnGroup): boolean {
        for (let i = 0; i < this._cols.length; i++) {
            let col = this._cols[i];
            if (col == grp || col._containsGroup(grp)) {
                return true;
            }
        }
        return false;
    }

    // check whether the column is collapseTo column
    /*internal*/ _isCollapseTo(grp: ColumnGroup): boolean {
        let g = this.grid,
            cols = g ? g.columns : null;

        // sanity
        if (!grp || !cols) {
            return false;
        }

        if (this.collapseTo) {
            switch (this.collapseTo) {
                case '$first':
                case '$last':
                    return false;

                default:
                    return grp === cols.getColumn(this.collapseTo);
            }
        }

        // have no collapseTo
        return false;
    }

    // redirect change event to handler
    onPropertyChanged(): void {
        const hdl = this._changeHdl;
        if (hdl) {
            hdl.handlePropertyChange(this);
        }
        super.onPropertyChanged();
    }

    // for debugging only
    /*
    _dump(level: number, msg?: string) {
        if (msg) console.log(msg);
        let rng = this._rng;
        console.log(`${Array(level * 4).join(' ')}grp ${this.header} rng: (${rng.row}, ${rng.col})-(${rng.row2}, ${rng.col2})`);
        this.columns.forEach(grp => {
            grp._dump(level + 1);
        });
    }    
    */
}

/**
 * Extends the {@link ObservableArray} class to track column group changes.
 */
export class ColumnGroupCollection extends wijmo.collections.ObservableArray<ColumnGroup> {
    private _owner: FlexGrid | ColumnGroup | null;
    private _changeHdl: _IColumnGroupChangeHandler;

    /**
     * Gets a column group by name, binding, or index.
     *
     * If name parameter is of number type, the method returns 
     * the child column group by index.
     * If name parameter is of string type, the method searches the column group by name.
     * If a column with the given name is not found, it searches by binding.
     * The searches are case-sensitive.
     *
     * @param name The name, binding, or index to find.
     * @return The column group with the specified name, binding or index, or null if not found.
     */
    getColumn(name: string | number): ColumnGroup {
        // search by index
        if (wijmo.isNumber(name)) {
            return this._getColByIdx(name);
        }
        
        // search by name or by binding
        return this._findColByProp('name', name) || this._findColByProp('binding', name);
    }

    /**
     * Gets the {@link FlexGrid} or {@link ColumnGroup} that owns this collection.
     */
    get owner(): FlexGrid | ColumnGroup | null {
        return this._owner;
    }

    // ** overrides

    /**
     * Appends an item to the array.
     *
     * @param item Item to add to the array.
     * @return The new length of the array.
     */
    push(item: ColumnGroup): number {
        item._setOwnerList(this);
        return super.push(item);
    }

    /**
     * Removes or adds items to the array.
     *
     * @param index Position where items are to be added or removed.
     * @param count Number of items to remove from the array.
     * @param ...item One or mode items to add to the array.
     * @return An array containing the removed elements.
     */
    splice(index: number, count: number, ...item: ColumnGroup[]): ColumnGroup[] {

        // clear list reference from items being removed
        for (let i = index; i < index + count && i < this.length; i++) {
            let item = this[i];
            if (item instanceof ColumnGroup) { // could be null (TFS 419415)
                item._setOwnerList(null);
            }
        }

        // set list reference to items being added
        item.forEach(i => i._setOwnerList(this));

        // let base class do the actual work
        return super.splice(index, count, ...item);
    }

    // ** implementation

    // parse an array of JavaScript objects into ColumnGroupCollection object
    /*internal*/ static _parse(arr: any[]): ColumnGroupCollection {
        let groups: ColumnGroupCollection = null;
        if (arr) {
            if (arr instanceof ColumnGroupCollection) {
                groups = arr;
            } else {
                groups = new ColumnGroupCollection();
                arr.forEach(colDef => {
                    let grp = colDef instanceof ColumnGroup
                        ? colDef // accept ColumnGroup objects
                        : new ColumnGroup(colDef); // and JSON objects
                    if (groups.indexOf(grp) < 0) {
                        groups.push(grp);
                    }
                });
            }
        } else {
            groups = new ColumnGroupCollection();
        }

        // done
        return groups;
    }

    // set change handler
    /*internal*/ _setChangeHandler(handler: _IColumnGroupChangeHandler): void {
        this._changeHdl = handler;
        this.forEach(col => col._setChangeHandler(handler));
    }

    // remove change handler
    /*internal*/ _removeChangeHandler(): void {
        this._changeHdl = null;
        this.forEach(col => col._removeChangeHandler());
    }

    // set owner of this collection
    /*internal*/ _setOwner(owner: FlexGrid | ColumnGroup | null): void {
        this._owner = owner;
        this.forEach(col => col.columns._setOwner(col));
    }

    // get a column group by index
    /*internal*/ _getColByIdx(index: number): ColumnGroup {
        return (index > -1 && index < this.length) ? this[index] : null;
    }

    // find a column group by property
    /*internal*/ _findColByProp(property: string, value: string): ColumnGroup {
        for (let i = 0; i < this.length; i++) {
            let group = this[i];
            if (group[property] === value) {
                return group;
            }

            const groups = group.columns;
            group = groups._findColByProp(property, value);
            if (group !== null) {
                return group;
            }
        }

        // no group found
        return null;
    }

    // redirect change event to handler
    onCollectionChanged(e = wijmo.collections.NotifyCollectionChangedEventArgs.reset): void {
        const hdl = this._changeHdl;
        if (hdl) {
            hdl.handleCollectionChange();
        }
        super.onCollectionChanged(e);
    }
}

    }
    


    module wijmo.grid {
    ///<wijmo-soft-import from="wijmo.input"/>




















// enable use of EcmaScript6 maps
//declare var Map: any;

'use strict';

// initialize groupHeaderFormat
wijmo._addCultureInfo('FlexGrid', {
    groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} items)',
    ariaLabels: {
        toggleDropDown: 'Toggle Dropdown',
        toggleGroup: 'Toggle Group'
    }
});

/**
 * Specifies constants that define the grid's sorting capabilities.
 */
export enum AllowSorting {
    /**
     * Users cannot sort the grid by clicking the column headers. 
     */
    None,
    /** 
     * Users may sort the grid by a single column at a time.
     * 
     * Clicking the column header sorts the column or flips the sort direction.
     * 
     * Ctrl+Clicking removes the sort. 
     */
    SingleColumn,
    /**
     * Users may sort the grid by multiple columns at a time.
     * 
     * Clicking the column header sorts the column or flips the sort direction.
     * 
     * Ctrl+Clicking removes the sort for the clicked column.
     * 
     * Ctrl+Shift+Clicking removes all sorts.
     */
    MultiColumn
}

/**
 * Specifies constants that define the grid's column pinning capabilities.
 */
export enum AllowPinning {
    /** Users cannot pin columns. */
    None,
    /** Users can pin and unpin one column at a time (possibly moving them in the process). */
    SingleColumn,
    /** Users can pin and unpin column ranges (columns do not move when being pinned or unpinned). */
    ColumnRange,
    /** Users can pin and unpin single columns or column ranges (using the shift key). */
    Both
}

/**
 * Specifies constants that define the visibility of row and column headers.
 */
export enum HeadersVisibility {
    /** No header cells are displayed. */
    None = 0,
    /** Only column header cells are displayed. */
    Column = 1,
    /** Only row header cells are displayed. */
    Row = 2,
    /** Both column and row header cells are displayed. */
    All = 3,
}

/**
 * Specifies options to be used with the {@link getClipString} method.
 */
export enum ClipStringOptions {
    /** Use default options (tabs as cell separators, formatted/visible/unquoted cells). */
    Default = 0,
    /** Use commas as cell separators (CSV format). */
    CSV = 1,
    /** Quote all cells. */
    QuoteAll = 2,
    /** Skip cells that have been merged over (like Excel). */
    SkipMerged = 4,
    /** Export unformatted values. */
    Unformatted = 8,
    /** Include invisible rows. */
    InvisibleRows = 16,
    /** Include invisible columns. */
    InvisibleColumns = 32,
    /** Include invisible rows and columns. */
    InvisibleCells = InvisibleRows | InvisibleColumns
}

/**
 * Represents a method that can be used to customize the 
 * representation of grid cell elements.
 */
export interface IItemFormatter {
    /**
     * @param panel {@link GridPanel} that contains the cell.
     * @param row Index of the row that contains the cell.
     * @param col Index of the column that contains the cell.
     * @param cell HTMLElement that represents the cell.
     */
    (panel: GridPanel, row: number, col: number, cell: HTMLElement): void;
}
/**
 * Represents a method returns error strings associated with grid cells.
 */
export interface IItemValidator {
    /**
     * @param row Row index of the cell being tested.
     * @param col Column index of the cell being tested.
     * @param parsing Whether the value is being edited and could not be parsed into the right data type.
     * @returns A string describing the error, or null to indicate the cell contains no errors.
     */
    (row: number, col: number, parsing?: boolean): string | null; // TFS 408943
}

/**
 * The {@link FlexGrid} control provides a powerful and flexible way to
 * display and edit data in a tabular format.
 *
 * The {@link FlexGrid} control is a full-featured grid, providing all the
 * features you are used to including several selection modes, sorting,
 * column reordering, grouping, filtering, editing, custom cells,
 * XAML-style star-sizing columns, row and column virtualization, etc.
 *
 * The {@link FlexGrid} control supports the following keyboard commands:
 *
 * <table>
 *   <thead>
 *     <tr><th>Key Combination</th><th>Action</th></tr>
 *   </thead>
 *   <tbody>
 *     <tr><td>Shift + Space</td><td>Select row</td></tr>
 *     <tr><td>Control + Space</td><td>Select column</td></tr>
 *     <tr><td>F2</td><td>Start editing the current cell</td></tr>
 *     <tr><td>F4</td><td>Open or close the current cell's editor (if available)</td></tr>
 *     <tr><td>Space</td><td>Start editing or toggle checkbox</td></tr>
 *     <tr><td>Control + A</td><td>Select the entire grid contents</td></tr>
 *     <tr><td>Left/Right</td><td>Select the cell to the left/right of the selection, collapse/expand group rows</td></tr>
 *     <tr><td>Shift + Left/Right</td><td>Extend the selection to include the next cell to the left/right of the selection</td></tr>
 *     <tr><td>Up/Down</td><td>Select the next cell above or below the selection</td></tr>
 *     <tr><td>Shift + Up/Down</td><td>Extend the selection to include the cell above or below the selection</td></tr>
 *     <tr><td>Alt + Up/Down</td><td>Open or close the current cell's editor (if available)</td></tr>
 *     <tr><td>PageUp/Down</td><td>Select the cell one page above or below the selection</td></tr>
 *     <tr><td>Shift + PageUp/Down</td><td>Extend the selection to include the cell one page above or below the selection</td></tr>
 *     <tr><td>Alt + PageUp/Down</td><td>Move the selection to the first or last row</td></tr>
 *     <tr><td>Shift + Alt + PageUp/Down</td><td>Extend the selection to include the first or last row</td></tr>
 *     <tr><td>Home/End</td><td>Move the selection to the first or last column</td></tr>
 *     <tr><td>Shift + Home/End</td><td>Extend the selection to include the first or last column</td></tr>
 *     <tr><td>Ctrl + Home/End</td><td>Move the selection to the first/last row and column</td></tr>
 *     <tr><td>Shift + Ctrl + Home/End</td><td>Extend the selection to include the first/last row and column</td></tr>
 *     <tr><td>Escape</td><td>Cancel current cell or row editing operation</td></tr>
 *     <tr><td>Tab</td><td>Move the selection to the next focusable element on the page (by default, can be overridden using the {@link keyActionTab} property)</td></tr>
 *     <tr><td>Enter</td><td>Exit editing mode and move the selection to the cell below the current one (by default, can be overridden using the {@link keyActionEnter} property)</td></tr>
 *     <tr><td>Delete, Backspace</td><td>Delete the currently selected rows (if the {@link allowDelete} property is set to true), or clear the content of the selected cells (if the values are not required).</td></tr>
 *     <tr><td>Control + C or Control + Insert</td><td>Copy the selection to the clipboard (if the {@link autoClipboard} property is set to true)</td></tr>
 *     <tr><td>Control + V or Shift + Insert</td><td>Paste the content of the clipboard into the selected area (if the {@link autoClipboard} property is set to true)</td></tr>
 *   </tbody>
 * </table>
 *
 * {@sample Grid/Overview/purejs Example}
 */
export class FlexGrid extends wijmo.Control {

    // constants
    static _WJS_STICKY = 'wj-state-sticky';
    static _WJS_MEASURE = 'wj-state-measuring';
    static _WJS_UPDATING = 'wj-state-updating';
    static _WJS_WSPRE = 'wj-whitespace-pre';
    static _MIN_VIRT_ROWS = 200; // min rows required for window virtualization

    // default column widths
    static _defTypeWidth = {
        [wijmo.DataType.Number]: '0.714285714*' // 80 pixels
    };

    // child elements
    /*private*/ _root: HTMLDivElement; // scrollable div that contains the grid cells
    /*private*/ _eTL: HTMLDivElement; // top left grid panel parent
    /*private*/ _eTLCt: HTMLDivElement; // top left panel host
    /*private*/ _eCHdr: HTMLDivElement; // column header panel parent
    /*private*/ _eCHdrCt: HTMLDivElement; // column header panel host
    /*private*/ _eRHdr: HTMLDivElement; // row header panel parent
    /*private*/ _eRHdrCt: HTMLDivElement; // row header panel host
    /*private*/ _eCt: HTMLDivElement; // data cells panel host
    /*private*/ _eBL: HTMLDivElement; // bottom left grid panel parent
    /*private*/ _eBLCt: HTMLDivElement; // bottom left panel host
    /*private*/ _eCFtr: HTMLDivElement; // column footer panel parent
    /*private*/ _eCFtrCt: HTMLDivElement; // column footer panel host
    /*private*/ _fCt: HTMLDivElement; // cloned frozen cell container
    /*private*/ _eFocus: HTMLDivElement; // focus holder (to avoid scrolling the whole grid into view)
    /*private*/ _eSz: HTMLDivElement; // size-to-content element
    /*private*/ _eMarquee: HTMLDivElement; // marquee element
    /*private*/ _activeCell: HTMLElement = null; // active cell element

    // child panels
    private _gpTL: GridPanel;
    private _gpCHdr: GridPanel;
    private _gpRHdr: GridPanel;
    private _gpCells: GridPanel;
    private _gpBL: GridPanel;
    private _gpCFtr: GridPanel;

    // private stuff
    private _maxOffsetY: number;
    private _heightBrowser: number;
    private _heightReal: number;
    /*private*/ _szClient = new wijmo.Size(0, 0); // excluding scrollbars
    /*private*/ _szClientSB = new wijmo.Size(0, 0); // including scrollbars
    /*private*/ _offsetY = 0;
    /*private*/ _cssPage = 0;
    /*private*/ _lastCount: number;
    /*private*/ _rcBounds: wijmo.Rect; // accessible to MouseHandler
    /*private*/ _ptScrl = new wijmo.Point(0, 0); // accessible to GridPanel
    /*private*/ _cellPadLeft = 3; // accessible to CellFactory
    /*private*/ _cellPadHorz = 3;
    /*private*/ _cellPadVert = 0;
    /*private*/ _clipToScreen = false;

    // selection/key/mouse handlers
    _mouseHdl: _MouseHandler;       // accessible to keyboard handler
    _edtHdl: _EditHandler;          // accessible to keyboard handler
    _selHdl: _SelectionHandler;     // accessible to keyboard handler
    _addHdl: _AddNewHandler;        // accessible to derived classes (e.g. MultiRow)
    _keyHdl: _KeyboardHandler;      // accessible to IME handler
    _grpHdl: _IColumnGroupHandler;
    _imeHdl: _ImeHandler;
    _mrgMgr: MergeManager;

    // property storage
    protected _autoGenCols = true;
    protected _autoClipboard = true;
    protected _xOnCopyPaste = true;
    protected _autoScroll = true;
    protected _autoSearch = false;
    protected _caseSensitive = false;
    protected _readOnly = false;
    protected _indent = 14;
    protected _autoSizeMode = AutoSizeMode.Both;
    protected _autoHeights = false;
    protected _quickSize: boolean = null;
    protected _hdrVis = HeadersVisibility.All;
    protected _alSorting = AllowSorting.SingleColumn;
    protected _alPinning = AllowPinning.None;
    protected _alAddNew = false;
    protected _alDelete = false;
    protected _alResizing = AllowResizing.Columns;
    protected _alDragging = AllowDragging.Columns;
    protected _alMerging = AllowMerging.None;
    protected _ssHdr = HeadersVisibility.None;
    protected _shSort = true;
    protected _shGroups = true;
    protected _shMarquee = false;
    protected _shPlcHld = false;
    protected _altStep = 1;
    protected _shErr = true;
    protected _hasValidation: boolean;
    protected _shDropDown = true;
    protected _tglDropDown;
    protected _valEdt = true;
    protected _gHdrFmt: string = null;
    protected _rows: RowCollection;
    protected _cols: ColumnCollection;
    protected _hdrRows: RowCollection;
    protected _ftrRows: RowCollection;
    protected _hdrCols: ColumnCollection;
    protected _cf: CellFactory;
    protected _itemFormatter: IItemFormatter;
    protected _items: any; // itemsSource: any[] or ICollectionView
    protected _cv: wijmo.collections.ICollectionView;
    protected _childItemsPath: any = null;
    protected _rowHdrPath: wijmo.Binding;
    protected _sortRowIndex: number = null;
    protected _editColIndex: number = null;
    protected _deferResizing = false;
    protected _errorTip: wijmo.Tooltip;
    protected _pSel = true;             // preserve selection state
    protected _pOutline = true;         // preserve outline state
    protected _stickyHdr = false;       // sticky headers
    protected _anchorCursor = false;    // Excel-style extended selections
    protected _copyHeaders = HeadersVisibility.None;
    protected _bigChecks = false;       // big checkboxes (TFS 378198)

    // work members
    private _bndSortConverter: wijmo.collections.ISortConverter;
    private _afClip: any;               // scroll clipping animation frame
    private _afSticky: any;             // sticky headers animation frame
    private _toErrorTips: any;          // clean up error tooltips
    private _toAutoHeights: any;        // autoSizeRows timer
    private _forceScrollUpdate: boolean;
    private _scrollHandlerAttached: boolean;
    private _itemValidator: IItemValidator;
    private _fzClone: boolean = null;
    private _vt: any = 0;               // virtualization threshold
    /*private*/ _vtRows = 0;            // row virtualization threshold
    /*private*/ _vtCols = 0;            // column virtualization threshold

    // optimizations
    /*private*/ _lazyRender = true;     // skip recycled cells when scrolling
    /*private*/ _refreshOnEdit = true;  // full refresh on cell edit end
    /*private*/ _reorderCells = true;   // reorder cells when scrolling

    /**
     * Gets or sets the template used to instantiate {@link FlexGrid} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div wj-part="root">' + // cell container
                '<div wj-part="cells" class="wj-cells"></div>' + // cells
                '<div wj-part="marquee" class="wj-marquee">' +  // marquee
                    '<div></div>' +
                '</div>' +
            '</div>' +
            '<div wj-part="fcells" aria-hidden="true" class="wj-cells wj-frozen-clone"></div>' + // frozen cells
            '<div wj-part="rh">' + // row header container, cells
                '<div wj-part="rhcells" class="wj-rowheaders"></div>' +
            '</div>' +
            '<div wj-part="cf">' + // col footer container, cells
                '<div wj-part="cfcells" class="wj-colfooters"></div>' +
            '</div>' +
            '<div wj-part="ch">' + // col header container, cells
                '<div wj-part="chcells" class="wj-colheaders"></div>' +
            '</div>' +
            '<div wj-part="bl">' + // bottom-left container, cells
                '<div wj-part="blcells" class="wj-bottomleft"></div>' +
            '</div>' +
            '<div wj-part="tl">' + // top-left container, cells
                '<div wj-part="tlcells" class="wj-topleft"></div>' +
            '</div>' +
            '<div wj-part="focus" class="wj-cell">0</div>' + // moved after the grid to keep Narrator happy
            '<div wj-part="sz"></div>' + // auto size element
        '</div>';

    /**
     * Initializes a new instance of the {@link FlexGrid} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true);
        let host = this.hostElement;

        // make sure we have no border radius if the browser is IE/Edge
        // (rounded borders **kill** scrolling perf!!!!)
        if (wijmo.isIE()) {
            host.style.borderRadius = '0';
        }

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-flexgrid', tpl, {
            _root: 'root',
            _eSz: 'sz',
            _eCt: 'cells',
            _fCt: 'fcells',
            _eTL: 'tl',
            _eBL: 'bl',
            _eCHdr: 'ch',
            _eRHdr: 'rh',
            _eCFtr: 'cf',
            _eTLCt: 'tlcells',
            _eBLCt: 'blcells',
            _eCHdrCt: 'chcells',
            _eCFtrCt: 'cfcells',
            _eRHdrCt: 'rhcells',
            _eMarquee: 'marquee',
            _eFocus: 'focus'
        });

        // set styles in code (to avoid CSP issues)
        wijmo.setCss(this._root.parentElement, {
            position: 'relative',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            minWidth: 'inherit',
            minHeight: 'inherit', // TFS 465370
            maxWidth: 'inherit',
            maxHeight: 'inherit',
        });
        wijmo.setCss(this._root, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            minWidth: 'inherit',
            minHeight: 'inherit', // TFS 465370
            maxWidth: 'inherit',
            maxHeight: 'inherit',
            overflow: 'auto',
            webkitOverflowScrolling: 'touch'
        });
        wijmo.setCss(this._eCt, {
            position: 'absolute'    
        });
        wijmo.setCss(this._eMarquee, {
            display: 'none'
        });
        wijmo.setCss(this._eMarquee.firstChild, {
            width: '100%',
            height: '100%',
        });
        wijmo.setCss(this._fCt, {
            position: 'absolute',
            left: '0',
            top: '0',
            overflow: 'hidden',
            pointerEvents: 'none'
        });
        wijmo.setCss(this._eFocus, {
            position: 'fixed',
            left: '-32000px'
        });
        wijmo.setCss(this._eSz, {
            position: 'relative',
            visibility: 'hidden'
        });

        // initialize cell panels (shorter than in the template)
        let ariaHidden = 'aria-hidden';
        [this._eRHdr, this._eCFtr, this._eCHdr, this._eBL, this._eTL].forEach(el => {
            wijmo.setAttribute(el, ariaHidden, true);
            wijmo.setCss(el, {
                position: 'absolute',
                overflow: 'hidden',
                outline: 'none'
            });
            wijmo.setCss(el.firstElementChild, {
                position: 'relative'
            });
        });

        // apply aria-hidden to additional elements
        [this._eFocus, this._eMarquee, this._fCt, this._eSz].forEach(el => {
            wijmo.setAttribute(el, ariaHidden, true);
        });

        // workaround for marquee's pointerEvents: none (TFS 466790)
        if (wijmo.isIE9() || wijmo.isIE10()) {
            let marquee = this._eMarquee,
                mouseEvents = ['click', 'dblclick', 'mousedown', 'mouseup'];
            mouseEvents.forEach(event => {
                this.addEventListener(marquee, event, e => {

                    // peek at the element below
                    let display = marquee.style.display;
                    marquee.style.display = 'none';
                    let eUnder = document.elementFromPoint(e.clientX, e.clientY);
                    marquee.style.display = display;

                    // fire the mouse event on the element below
                    let evt = document.createEvent('Event') as any;
                    evt.initEvent(event, true, true);
                    for (let key in e) {
                        try {
                            evt[key] = e[key];
                        } catch (x) { }
                    }
                    eUnder.dispatchEvent(evt);
                });
            });
        }

        // make host non-focusable
        host.tabIndex = -1;

        // build the control
        this.deferUpdate(() => {

            // create row and column collections
            let defRowHei = this._getDefaultRowHeight();
            this._rows = new RowCollection(this, defRowHei);
            this._cols = new ColumnCollection(this, defRowHei * 4);
            this._hdrRows = new RowCollection(this, defRowHei);
            this._hdrCols = new ColumnCollection(this, Math.round(defRowHei * 1.25));
            this._ftrRows = new RowCollection(this, defRowHei);

            // create grid panels
            let ct = CellType;
            this._gpTL = new GridPanel(this, ct.TopLeft, this._hdrRows, this._hdrCols, this._eTLCt);
            this._gpCHdr = new GridPanel(this, ct.ColumnHeader, this._hdrRows, this._cols, this._eCHdrCt);
            this._gpRHdr = new GridPanel(this, ct.RowHeader, this._rows, this._hdrCols, this._eRHdrCt);
            this._gpCells = new GridPanel(this, ct.Cell, this._rows, this._cols, this._eCt);
            this._gpBL = new GridPanel(this, ct.BottomLeft, this._ftrRows, this._hdrCols, this._eBLCt);
            this._gpCFtr = new GridPanel(this, ct.ColumnFooter, this._ftrRows, this._cols, this._eCFtrCt);

            // add row and column headers
            this._hdrRows.push(new Row());
            this._hdrCols.push(new Column({ align: 'center' }));

            // initialize control
            this._cf = new CellFactory();
            this._keyHdl = new _KeyboardHandler(this);
            this._mouseHdl = new _MouseHandler(this);
            this._edtHdl = new _EditHandler(this);
            this._selHdl = new _SelectionHandler(this);
            this._addHdl = new _AddNewHandler(this);
            this._grpHdl = new _ColumnGroupHandler(this);
            this._mrgMgr = new MergeManager();
            this._bndSortConverter = this._sortConverter.bind(this);
            this._errorTip = new wijmo.Tooltip({
                isContentHtml: false,
                showDelay: 0,
                cssClass: 'wj-error-tip'
            });

            // apply grid role to host element
            wijmo.setAttribute(this.cells.hostElement, 'role', 'grid');

            // initialize SelectionMode
            this.selectionMode = SelectionMode.CellRange;

            // the root should not get the focus (TFS 404817)
            this._root.tabIndex = -1;

            // apply options after grid has been initialized
            this.initialize(options);
        });

        // update content when user scrolls the control
        this.addEventListener(this._root, 'scroll', (e) => {
            if (this._updateScrollPosition() || this._forceScrollUpdate) { // TFS 150650

                // save editor state (TFS 288870, 455280, 467060)
                let edt = this.activeEditor,
                    cell = this.activeCell,
                    cls = cell ? cell.className : null;
                    
                // finish editing (unless this is a forced update: TFS 288870)
                if (!this._forceScrollUpdate) {
                    this.finishEditing(); // TFS 466828
                }
                this._forceScrollUpdate = false;

                // update the grid content
                this._updateContent(true);

                // restore editor state (TFS 455280, 467060)
                let edtNew = this.activeEditor,
                    cellNew = this.activeCell;
                if (edtNew && cellNew && edt && cls) { // update editor
                    edtNew.value = edt.value;
                    cellNew.className = cls;
                    this._setFocusNoScroll(edtNew);
                } else if (edtNew && !cellNew) {
                    this.finishEditing(true); // no active cell? no editor!
                }

                // fix strange/rare issue where cells and column headers
                // get mis-aligned on slow machines (TFS 379982)
                if (this.frozenColumns) {
                    setTimeout(() => {
                        let style = this.columnHeaders.hostElement.style,
                            hdrX = parseInt(style.left),
                            cellX = this._ptScrl.x;
                        if (Math.abs(hdrX - cellX) > 1) {
                            this.invalidate();
                        }
                    });
                }
            }
        });

        // when you click an element with tabIndex < 0, Chrome and Firefox
        // move the focus to the body, which seems like the right thing to do.
        // IE gives the focus to the element even with tabIndex < 0, 
        // so let's fix that inconsistency here! // TFS 270776
        this.addEventListener(host, 'focus', (e) => {
            if (host.tabIndex > -1) {
                let target = e.target as HTMLElement;
                if (target instanceof HTMLElement && target.tabIndex < 0) {
                    this._setFocus(true); // force focus into valid element
                }
            }
        }, true);
    }

    // reset rcBounds when window is resized
    // (even if the control size didn't change, because it may have moved: TFS 112961)
    _handleResize() {
        this._rcBounds = null;

        // handle the case where the screen size changes because the editor was 
        // activated and invoked the soft keyboard (TFS 458686)
        let touchEdit = this.activeEditor && this.isTouching;
        if (!touchEdit && !this._touchEdit) {
            super._handleResize();
        } else {

            // handle the case where the editor was behind the soft keyboard
            // and the grid scrolled to show it
            setTimeout(() => {
                if (!this.activeEditor) {
                    this._touchEdit = true;
                    this.startEditing(true);
                }
            }, 50);
        }
        this._touchEdit = false;        
    }
    _touchEdit = false;

    //--------------------------------------------------------------------------
    //#region ** object model

    /** 
     * Gets or sets a value that determines whether the row and column headers
     * are visible.
     * 
     * The default value for this property is **HeadersVisibility.All**.
     */
    get headersVisibility(): HeadersVisibility {
        return this._hdrVis;
    }
    set headersVisibility(value: HeadersVisibility) {
        value = wijmo.asEnum(value, HeadersVisibility);
        if (value != this._hdrVis) {
            this._hdrVis = value;
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether column headers should remain
     * visible when the user scrolls the document.
     * 
     * The default value for this property is **false**.
     */
    get stickyHeaders(): boolean {
        return this._stickyHdr;
    }
    set stickyHeaders(value: boolean) {
        if (value != this._stickyHdr) {
            this._stickyHdr = wijmo.asBoolean(value);
            this._updateStickyHeaders();
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should preserve
     * the selected state of rows when the data is refreshed.
     * 
     * The default value for this property is **true**.
     */
    get preserveSelectedState(): boolean {
        return this._pSel;
    }
    set preserveSelectedState(value: boolean) {
        this._pSel = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should preserve
     * the expanded/collapsed state of nodes when the data is refreshed.
     *
     * The {@link preserveOutlineState} property implementation is based on
     * JavaScript's 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" target="_blank">Map</a> 
     * object, which is not available in IE 9 or 10.
     * 
     * The default value for this property is **true**.
     */
    get preserveOutlineState(): boolean {
        return this._pOutline;
    }
    set preserveOutlineState(value: boolean) {
        this._pOutline = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether extending selections
     * with the mouse or keyboard should change the start (cursor) or the
     * end of the current selection.
     *
     * The default value for this property is **false**, which causes
     * the grid to move the cursor and keep the selection end anchored.
     *
     * Setting this property to **true** causes the grid to move the
     * selection end and keep the cursor anchored. This is Excel's behavior.
    */
    get anchorCursor(): boolean {
        return this._anchorCursor;
    }
    set anchorCursor(value: boolean) {
        this._anchorCursor = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should 
     * include the content of header cells when copying data to the
     * clipboard.
     * 
     * This property is especially useful in read-only grids, because
     * the header information typically should not be included when
     * pasting data into the grid.
     * 
     * The default value for this property is **HeadersVisibility.None** 
     * for the {@link FlexGrid} control and **HeadersVisibility.All** 
     * for the **PivotGrid** control.
     */
    get copyHeaders(): HeadersVisibility {
        return this._copyHeaders;
    }
    set copyHeaders(value: HeadersVisibility) {
        this._copyHeaders = wijmo.asEnum(value, HeadersVisibility);
    }
    /**
     * Gets or sets a value that determines whether the grid should skip
     * rendering cells that were updated in the last render cycle.
     * 
     * The default value for this property is **true**.
     */
    get lazyRender(): boolean {
        return this._lazyRender;
    }
    set lazyRender(value: boolean) {
        this._lazyRender = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should 
     * refresh all cells after a cell is edited.
     * 
     * The default value for this property is **true**.
     */
    get refreshOnEdit(): boolean {
        return this._refreshOnEdit;
    }
    set refreshOnEdit(value: boolean) {
        this._refreshOnEdit = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the minimum number of rows and/or columns required to enable 
     * virtualization.
     *
     * This property is set to zero by default, meaning virtualization is always
     * enabled. This improves binding performance and memory requirements, at the
     * expense of a small performance decrease while scrolling.
     *
     * If your grid has a small number of rows (about 50 to 100), you may be able to
     * improve scrolling performance by setting this property to a slightly higher
     * value (like 150). This will disable virtualization and will slow down binding,
     * but may improve perceived scroll performance. For example, the code below sets
     * causes the grid to virtualize cells when the data source has more than 150 items:
     * 
     * ```typescript
     * // virtualize grid when there are more than 150 items
     * theGrid.virtualizationThreshold = 150;
     * ```
     *
     * Setting this property to values higher than 200 is not recommended. Loading
     * times will become too long; the grid will freeze for a few seconds while
     * creating cells for all rows, and the browser will become slow because of
     * the large number of elements on the page.
     * 
     * If you want to set separate virtualization thresholds for rows and columns,
     * you may set the {@link virtualizationThreshold} property to an array with two
     * numbers. In this case, the first number will be used as the row threshold 
     * and the second as the column threshold. For example, the code below sets
     * causes the grid to virtualize rows but not columns:
     * 
     * ```typescript
     * // virtualize rows (threshold 0) but not columns (threshold 10,000)
     * theGrid.virtualizationThreshold = [0, 10000];
     * ```
     * 
     * The default value for this property is **0**, which causes the grid to
     * virtualize all rows and columns.
     */
    get virtualizationThreshold(): number | number[] {
        return this._vt;
    }
    set virtualizationThreshold(value: number | number[]) {
        this._vt = value;
        if (wijmo.isNumber(value)) {
            this._vtRows = this._vtCols = wijmo.asNumber(value as number);
        } else if (!value) {
            this._vtRows = this._vtCols = 0;
        } else if (wijmo.isArray(value) && (value as number[]).length == 2) {
            this._vtRows = wijmo.asNumber(value[0]);
            this._vtCols = wijmo.asNumber(value[1]);
        } else {
            wijmo.assert(false, 'virtualizationThreshold should be a number or an array with two numbers.');
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should generate 
     * columns automatically based on the {@link itemsSource}.
     *
     * The column generation depends on the {@link itemsSource} property containing
     * at least one item. This data item is inspected and a column is created and
     * bound to each property that contains a primitive value (number, string,
     * Boolean, or Date).
     *
     * Properties set to null do not generate columns, because the grid would
     * have no way of guessing the appropriate type. In this type of scenario,
     * you should set the {@link autoGenerateColumns} property to false and create
     * the columns explicitly. For example:
     *
     * ```typescript
     * import { FlexGrid } from '@grapecity/wijmo.grid';
     * let grid = new FlexGrid('#theGrid', {
     *   autoGenerateColumns: false, // data items may contain null values
     *   columns: [                  // so define columns explicitly
     *     { binding: 'name', header: 'Name', dataType: 'String' },
     *     { binding: 'amount', header: 'Amount', dataType: 'Number' },
     *     { binding: 'date', header: 'Date', dataType: 'Date' },
     *     { binding: 'active', header: 'Active', dataType: 'Boolean' }
     *   ],
     *   itemsSource: customers
     * });
     * ```
     * 
     * The default value for this property is **true** for the {@link FlexGrid} 
     * control and **false** for the **PivotGrid** control.
     */
    get autoGenerateColumns(): boolean {
        return this._autoGenCols;
    }
    set autoGenerateColumns(value: boolean) {
        this._autoGenCols = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should handle 
     * clipboard shortcuts.
     *
     * The clipboard shortcuts are as follows:
     *
     * <dl class="dl-horizontal">
     *   <dt>ctrl+C, ctrl+Ins</dt>    <dd>Copy grid selection to clipboard.</dd>
     *   <dt>ctrl+V, shift+Ins</dt>   <dd>Paste clipboard text to grid selection.</dd>
     * </dl>
     *
     * Only visible rows and columns are included in clipboard operations.
     *
     * Read-only cells are not affected by paste operations.
     * 
     * The default value for this property is **true**.
     */
    get autoClipboard(): boolean {
        return this._autoClipboard;
    }
    set autoClipboard(value: boolean) {
        this._autoClipboard = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should automatically
     * expand the selection to include cells in merged ranges when copying or pasting
     * content to/from the clipboard.
     * 
     * The default value for this property is **true**.
     */
    get expandSelectionOnCopyPaste(): boolean {
        return this._xOnCopyPaste;
    }
    set expandSelectionOnCopyPaste(value: boolean) {
        this._xOnCopyPaste = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should automatically
     * scroll its contents while users drag rows or columns into new positions.
     * 
     * Row and column dragging are controlled by the {@link allowDragging} property.
     * 
     * The default value for this property is **true**.
     */
    get autoScroll(): boolean {
        return this._autoScroll;
    }
    set autoScroll(value: boolean) {
        this._autoScroll = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should search for 
     * cells as the users types into read-only cells.
     * 
     * The search happens on the column that is currently selected, if it is
     * not editable. The search starts at the currently selected row and is
     * case-insensitive.
     * 
     * See also the {@link caseSensitiveSearch} property.
     * 
     * The default value for this property is **false**.
     */
    get autoSearch(): boolean {
        return this._autoSearch;
    }
    set autoSearch(value: boolean) {
        this._autoSearch = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether searches performed
     * while the user types should case-sensitive.
     * 
     * The searches include searching for regular text 
     * (see the {@link autoSearch} property)
     * as well as searching for items while editing data-mapped cells
     * (see the {@link Column.dataMap} property).
     * 
     * The default value for this property is **false**
     * (searches are not case-sensitive by default).
     */
    get caseSensitiveSearch(): boolean {
        return this._caseSensitive;
    }
    set caseSensitiveSearch(value: boolean) {
        this._caseSensitive = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a JSON string that defines the current column layout.
     *
     * The column layout string represents an array with the columns and their
     * properties. It can be used to persist column layouts defined by users so 
     * they are preserved across sessions, and can also be used to implement 
     * undo/redo functionality in applications that allow users to modify the 
     * column layout.
     *
     * The column layout string does not include properties that cannot be
     * converted to JSON, such as {@link dataMap} and {@link editor}.
     * 
     * If you want to save and restore column layouts and don't require
     * the layouts to be serializable, you can clone the content of the
     * {@link columns} property and restore it later using array methods.
     * This is not as convenient as using the {@link columnLayout} property,
     * but it does allow you to save and restore data maps and editors.
     */
    get columnLayout(): string {
        let hasColGroups = this._hasColumnGroups(),
            colClass = hasColGroups ? ColumnGroup : Column,
            collectionName = hasColGroups ? 'columnGroups' : 'columns',
            props = FlexGrid._getSerializableProperties(colClass),
            defs = new colClass(),
            columns = hasColGroups ? this.getColumnGroups() : this.columns;

        const serializeColumns = (columnsArr: Column[]): any[] => {
            let ret = [];
            // populate array with proxy columns
            // save only primitive value and non-default settings
            // don't save 'size', we are already saving 'width'
            columnsArr.forEach(col => {
                let proxy = {};
                props.forEach(prop => {
                    let value = col[prop];
                    if (value != defs[prop] && wijmo.isPrimitive(value) && prop != 'size') {
                        proxy[prop] = value;
                    }
                });
                if (hasColGroups) {
                    let childColumns = (<ColumnGroup>col).columns;
                    if (childColumns.length) {
                        proxy['columns'] = serializeColumns(childColumns);
                    }
                }
                ret.push(proxy)
            });
            return ret;
        }

        let proxyCols = serializeColumns(columns);
        // return JSON string with proxy columns
        return JSON.stringify({ [collectionName]: proxyCols });
    }
    set columnLayout(value: string) {
        let colOptions = JSON.parse(wijmo.asString(value));
        wijmo.assert(colOptions, 'Invalid columnLayout data.');
        this.columns.deferUpdate(() => { // TFS 457358
            this.columns.clear();
            if (this._hasColumnGroups()) { // WJM-20648
                this.columnGroups = new ColumnGroupCollection();
            }
            this.initialize(colOptions);
        });
    }
    /**
     * Gets or sets an array used to define hierarchical column groups.
     * 
     * The items in the array should be JSON objects with properties of
     * {@link Column} objects, plus three optional members:
     * 
     * * 'columns' array containing an array of child columns,
     * * 'collapseTo' string containing the binding of the child column
     *   that should remain visible when the group is collapsed.
     * * 'isCollapsed' boolean that determines if the group should be
     *   initially collapsed.
     * 
     * For example, the code below generates a grid with two column groups,
     * both initially collapsed:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columnGroups: [
     *         { header: 'Group 1', align: 'center', collapseTo: 'country', isCollapsed: true, columns: [
     *             { binding: 'id', header: 'ID' },
     *             { binding: 'date', header: 'Date', dataType: 'Date' },
     *             { binding: 'country', header: 'Country', dataType: 'String' },
     *             { binding: 'active', header: 'Active', dataType: 'Boolean' },
     *         ]},
     *         { header: 'Group 2', align: 'center', collapseTo: 'sales', isCollapsed: true, columns: [
     *             { binding: 'sales', header: 'Sales', dataType: 'Number' },
     *             { binding: 'expenses', header: 'Expenses', dataType: 'Number' },
     *         ]}
     *     ],
     *     itemsSource: getData(20)
     * });
     * ```
     */
    get columnGroups(): any[] {
        return this._grpHdl.getGroupDefinitions();
    }
    set columnGroups(value: any[]) {
        this.columns.clear();
        this._grpHdl.createColumnGroups(wijmo.asArray(value));
    }
    /**
     * Get the collection of column groups.
     */
    getColumnGroups(): ColumnGroupCollection {
        return this._grpHdl.columnGroups;
    }
    /**
     * Gets or sets a value that determines whether the user can modify
     * cell values using the mouse and keyboard.
     * 
     * The default value for this property is **false** for the {@link FlexGrid} 
     * control and **true** for the **PivotGrid** control.
     */
    get isReadOnly(): boolean {
        return this._readOnly;
    }
    set isReadOnly(value: boolean) {
        if (value != this._readOnly) {
            this._readOnly = wijmo.asBoolean(value);
            this.finishEditing();
            this.invalidate(true); // TFS 79965
            this._addHdl.updateNewRowTemplate(); // TFS 97544
            wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
            this._setAria('readonly', this.isReadOnly ? 'true' : null);
        }
    }
    /**
     * Gets or sets a value that determines whether the checkboxes used to edit 
     * boolean columns should extend to cover the whole cell width.
     * 
     * Big checkboxes are easier to toggle with the mouse, since the user may
     * click anywhere in the cell to toggle them.
     * 
     * The default value for this property is **false**.
     */
    get bigCheckboxes(): boolean {
        return this._bigChecks;
    }
    set bigCheckboxes(value: boolean) {
        this._bigChecks = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the control is disabled.
     *
     * Disabled controls cannot get mouse or keyboard events.
     */
    get isDisabled(): boolean {
        return this._e && this._e.getAttribute('disabled') != null;
    }
    set isDisabled(value: boolean) {
        value = wijmo.asBoolean(value, true);
        if (value != this.isDisabled) {
            let host = this._e;
            if (host) {
                wijmo.enable(host, !value);

                // ** overridden to prevent messing with the tabIndex (TFS 391135)
                // since it prevents drag/drop in Chrome after disable/re-enable
                // this looks like a bug in Chrome, because there's no issue in FF or IE.
                //host.tabIndex = this.isDisabled || host.querySelector('input')
                //    ? -1
                //    : this._orgTabIndex;

                // invalidate the control to update the tabindex of the active cell.
                this.invalidate();
            }
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should support
     * Input Method Editors (IME) while not in edit mode.
     * 
     * This property is relevant only for sites/applications in Japanese,
     * Chinese, Korean, and other languages that require IME support.
     * 
     * The default value for this property is **false**.
     */
    get imeEnabled(): boolean {
        return this._imeHdl != null;
    }
    set imeEnabled(value: boolean) {
        if (wijmo.asBoolean(value) != this.imeEnabled) {
            if (this.finishEditing()) { // TFS 312148
                let focus = this.containsFocus(); // TFS 345971
                if (this._imeHdl) {
                    this._imeHdl.dispose();
                    this._imeHdl = null;
                }
                if (value) {
                    this._imeHdl = new _ImeHandler(this);
                }
                if (focus) { // TFS 345971
                    this.focus();
                }
            }
        }
    }
    /**
     * Gets or sets a value that determines whether users may resize 
     * rows and/or columns with the mouse.
     *
     * If resizing is enabled, users can resize columns by dragging
     * the right edge of column header cells, or rows by dragging the
     * bottom edge of row header cells.
     *
     * Users may also double-click the edge of the header cells to 
     * automatically resize rows and columns to fit their content.
     * The auto-size behavior can be customized using the {@link autoSizeMode}
     * property.
     * 
     * The default value for this property is **AllowResizing.Columns**.
     */
    get allowResizing(): AllowResizing {
        return this._alResizing;
    }
    set allowResizing(value: AllowResizing) {
        this._alResizing = wijmo.asEnum(value, AllowResizing);
    }
    /**
     * Gets or sets a value that determines whether row and column resizing 
     * should be deferred until the user releases the mouse button.
     *
     * By default, {@link deferResizing} is set to false, causing rows and columns
     * to be resized as the user drags the mouse. Setting this property to true
     * causes the grid to show a resizing marker and to resize the row or column
     * only when the user releases the mouse button.
     * 
     * The default value for this property is **false** for the {@link FlexGrid} control
     * and **true** for the **PivotGrid** control.
     */
    get deferResizing(): boolean {
        return this._deferResizing;
    }
    set deferResizing(value: boolean) {
        this._deferResizing = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets which cells should be taken into account when auto-sizing a
     * row or column.
     *
     * This property controls what happens when users double-click the edge of
     * a column header.
     *
     * By default, the grid will automatically set the column width based on the
     * content of the header and data cells in the column. This property allows 
     * you to change that to include only the headers or only the data.
     *
     * The default value for this property is **AutoSizeMode.Both**.
     */
    get autoSizeMode(): AutoSizeMode {
        return this._autoSizeMode;
    }
    set autoSizeMode(value: AutoSizeMode) {
        this._autoSizeMode = wijmo.asEnum(value, AutoSizeMode);
    }
    /**
     * Gets or sets a value that determines whether the grid should automatically
     * resize the rows when the data or grid layout change.
     *
     * This property is especially useful when the grid has columns configured
     * to word-wrap their content (see {@link Column.wordWrap}), and when the grid
     * has a relatively small number of rows (auto-sizing is an expensive operation).
     * 
     * The default value for this property is **false**.
     */
    get autoRowHeights(): boolean {
        return this._autoHeights;
    }
    set autoRowHeights(value: boolean) {
        this._autoHeights = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should optimize
     * performance over precision when auto-sizing columns.
     *
     * Setting this property to **false** disables quick auto-sizing. 
     * Setting it to **true** enables the feature, subject to the value of each 
     * column's {@link wijmo.grid.Column.quickAutoSize} property.
     * 
     * The default value for this property is **null**, which enables quick
     * auto-sizing for grids that don't have a custom {@link itemFormatter}
     * or handlers attached to the {@link formatItem} event.
     * 
     * Quick auto-sizing uses different strategies when auto-sizing rows or
     * columns.
     * 
     * When auto-sizing columns, it uses a temporary canvas element to locate
     * the row with the widest entry for a column. When the row is located, its
     * contents are measured precisely. The limitation with this approach is
     * that the canvas only renders plain text, so if cells contain HTML the
     * auto-sizing may miss the widest column.
     * 
     * When auto-sizing rows, it uses a cache to store the row heights based
     * on the cell content, and skips measuring numeric cells. The limitation
     * with this approach is that it only improves performance if many cells
     * have the same content, or if many columns are numeric.
     * 
     * If you find that auto-sizing is slowing down your application, it is
     * probably worth setting {@link quickAutoSize} to true and checking the
     * results to see if it works correctly and improves performance for your
     * app.
     */
    get quickAutoSize(): boolean | null {
        return this._quickSize;
    }
    set quickAutoSize(value: boolean | null) {
        this._quickSize = wijmo.asBoolean(value, true);
    }
    _getQuickAutoSize(): boolean {
        return wijmo.isBoolean(this._quickSize)
            ? this._quickSize
            : !this.formatItem.hasHandlers && this.itemFormatter == null;
    }
    /**
     * Gets or sets a value that determines whether users are allowed to sort columns 
     * by clicking the column header cells.
     *
     * The default value for this property is **AllowSorting.SingleColumn**.
     */
    get allowSorting(): AllowSorting {
        return this._alSorting;
    }
    set allowSorting(value: AllowSorting) {
        if (wijmo.isBoolean(value)) { // to avoid breaking code (this used to be a boolean)
            value = value ? AllowSorting.SingleColumn : AllowSorting.None;
        }
        this._alSorting = wijmo.asEnum(value, AllowSorting);
    }
    /**
     * Gets or sets a value that determines whether the grid should add pin
     * buttons to the column headers and how the pin buttons behave.
     * 
     * The pin buttons allow users to pin (freeze) columns so they remain
     * in view as the user scrolls the grid horizontally.
     * 
     * The default value for this property is **AllowPinning.None**.
     */
    get allowPinning(): AllowPinning | boolean {
        return this._alPinning;
    }
    set allowPinning(value: AllowPinning | boolean) {
        if (value != this._alPinning) {
            if (wijmo.isBoolean(value)) {
                value = value ? AllowPinning.SingleColumn : AllowPinning.None;
            }
            this._alPinning = wijmo.asEnum(value as AllowPinning, AllowPinning);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the grid should provide a new row
     * template so users can add items to the source collection.
     *
     * The new row template will not be displayed if the {@link isReadOnly} property
     * is set to true.
     *
     * The default value for this property is **false**.
     */
    get allowAddNew(): boolean {
        return this._alAddNew;
    }
    set allowAddNew(value: boolean) {
        if (value != this._alAddNew) {
            this._alAddNew = wijmo.asBoolean(value);
            this._addHdl.updateNewRowTemplate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the new row template should be
     * located at the top of the grid or at the bottom.
     *
     * If you set the {@link newRowAtTop} property to true, and you want the new
     * row template to remain visible at all times, set the {@link frozenRows}
     * property to one. This will freeze the new row template at the top so
     * it won't scroll off the view.
     *
     * The new row template will be displayed only if the {@link allowAddNew} property
     * is set to true and if the {@link itemsSource} object supports adding new items.
     *
     * The default value for this property is **false**.
     */
    get newRowAtTop(): boolean {
        return this._addHdl.newRowAtTop;
    }
    set newRowAtTop(value: boolean) {
        this._addHdl.newRowAtTop = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that indicates whether the grid should delete 
     * selected rows when the user presses the Delete key.
     *
     * Selected rows will not be deleted if the {@link isReadOnly} property
     * is set to true.
     * 
     * The default value for this property is **false**.
     */
    get allowDelete(): boolean {
        return this._alDelete;
    }
    set allowDelete(value: boolean) {
        if (value != this._alDelete) {
            this._alDelete = wijmo.asBoolean(value);
        }
    }
    /**
     * Gets or sets which parts of the grid provide cell merging.
     * 
     * The default value for this property is **AllowMerging.None**
     * for the {@link FlexGrid} control and **AllowMerging.All** 
     * for the **PivotGrid** control.
     * 
     * This property does not apply to the **MultiRow** control.
     */
    get allowMerging(): AllowMerging {
        return this._alMerging;
    }
    set allowMerging(value: AllowMerging) {
        value = wijmo.asEnum(value, AllowMerging);
        if (value != this._alMerging) {
            this._alMerging = value;
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the grid should
     * add class names to indicate selected header cells.
     * 
     * The default value for this property is **HeadersVisibility.None**.
     */
    get showSelectedHeaders(): HeadersVisibility {
        return this._ssHdr;
    }
    set showSelectedHeaders(value: HeadersVisibility) {
        value = wijmo.asEnum(value, HeadersVisibility);
        if (value != this._ssHdr) {
            this._ssHdr = value;
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the grid should
     * display an Excel-style marquee around the current selection.
     * 
     * The default value for this property is **false**.
     * 
     * If you choose to show the marquee, you may want to improve
     * accessibility by using some simple CSS to make the marquee
     * fully opaque only when the grid has the focus:
     * 
     * ```css
     * .wj-flexgrid:not(.wj-state-focused) .wj-marquee {
     *     opacity: 0.2;
     * }
     * ```
     */
    get showMarquee(): boolean {
        return this._shMarquee;
    }
    set showMarquee(value: boolean) {
        if (value != this._shMarquee) {
            this._shMarquee = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should 
     * use the column headers as placeholders when editing cells.
     * 
     * The default value for this property is **false**.
     * 
     * This property is especially useful in grids that have multiple 
     * rows per data item (like the {@link MultiRow} grid) and in
     * grids that allow adding new items (see the {@link allowAddNew}
     * property).
     * 
     * This property only works with the grid's built-in editor.
     * If you are using custom editors (see the {@link Column.editor} 
     * property), then you are responsible for setting the placeholder
     * property on those.
     * 
     * The Internet Explorer browser does not show input placeholders
     * on focused input elements, so this property is not useful in 
     * IE.
     */
    get showPlaceholders(): boolean {
        return this._shPlcHld;
    }
    set showPlaceholders(value: boolean) {
        this._shPlcHld = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should display 
     * sort indicators in the column headers.
     *
     * Sorting is controlled by the {@link ICollectionView.sortDescriptions}
     * property of the {@link ICollectionView} object used as a the grid's
     * {@link itemsSource}.
     * 
     * The default value for this property is **true**.
     */
    get showSort(): boolean {
        return this._shSort;
    }
    set showSort(value: boolean) {
        if (value != this._shSort) {
            this._shSort = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the {@link FlexGrid} should insert 
     * group rows to delimit data groups.
     *
     * Data groups are created by modifying the {@link ICollectionView.groupDescriptions}
     * property of the {@link ICollectionView} object used as an {@link itemsSource}.
     * 
     * The default value for this property is **true**.
     */
    get showGroups(): boolean {
        return this._shGroups;
    }
    set showGroups(value: boolean) {
        if (value != this._shGroups) {
            this._shGroups = wijmo.asBoolean(value);
            this._bindGrid(false);
        }
    }
    /**
     * Gets or sets a value that determines the number of regular rows
     * between 'alternating' rows.
     * 
     * The default value for this property is **1** for the {@link FlexGrid}.
     * Set it to zero to disable alternating rows, or to a number greater than 
     * one to insert multiple regular rows between alternating rows.
     * 
     * The default value for this property is **1** for the {@link FlexGrid} 
     * control and **0** for the **PivotGrid** control.
     */
    get alternatingRowStep(): number {
        return this._altStep;
    }
    set alternatingRowStep(value: number) {
        if (value != this._altStep) {
            this._altStep = wijmo.asInt(value, false, true);
            this.invalidate();
        }
    }
    /*
     * Gets or sets a value that determines whether the grid should add the 'wj-alt' 
     * class to cells in alternating rows.
     * 
     * Setting this property to false disables alternate row styles without any
     * changes to the CSS.
     * 
     * The default value for this property is **true**.
     */
    get showAlternatingRows(): boolean {
        return this._altStep > 0;
    }
    set showAlternatingRows(value: boolean) {
        wijmo._deprecated('showAlternatingRows', 'alternatingRowStep');
        this.alternatingRowStep = value ? 1 : 0;
    }
    /**
     * Gets or sets a value that determines whether the grid should add the
     * 'wj-state-invalid' class to cells that contain validation errors and
     * tooltips with error descriptions.
     *
     * The grid detects validation errors using the {@link itemValidator} 
     * property and the {@link CollectionView.getError} property on the grid's
     * {@link itemsSource}.
     * 
     * The default value for this property is **true**.
     */
    get showErrors(): boolean {
        return this._shErr;
    }
    set showErrors(value: boolean) {
        if (value != this._shErr) {
            this._clearCells();
            this._shErr = wijmo.asBoolean(value);
        }
    }
    /**
     * Gets or sets the {@link Tooltip} object used to show validation 
     * errors detected by the grid when the {@link showErrors} property 
     * is set to true.
     *
     * By default, this property is set to a tooltip with zero show delay
     * (so it appears immediately when hovering over invalid cells),
     * no HTML content, and a "wj-error-tip" class which can be used to
     * customize the tooltip's appearance.
     *
     * Setting this property to **null** causes the control to use the cell's
     * "title" attribute to show validation errors.
     */
    get errorTip(): wijmo.Tooltip | null {
        return this._errorTip;
    }
    set errorTip(value: wijmo.Tooltip | null) {
        if (value != this._errorTip) {
            this._clearCells();
            this._errorTip = wijmo.asType(value, wijmo.Tooltip, true);
        }
    }
    /**
     * Gets or sets a validator function to determine whether cells contain
     * valid data.
     *
     * If specified, the validator function should take parameters containing
     * the cell's row and column indices and a parsing parameter that describes 
     * whether the data has already been parsed and applied to the data item 
     * (parsing == false), or whether the user was trying to edit the value and
     * entered a value that could not be parsed into the data type expected
     * (parsing == true).
     * 
     * The method returns a string containing an error message, or null if no
     * errors were detected.
     * 
     * For example, 
     * 
     * ```typescript
     * grid.itemValidator = (row: number, col: number, parsing: boolean) => {
     *     let item = grid.rows[row].dataItem,
     *         prop = grid.columns[col].binding;
     * 
     *     // parsing failed, show message
     *     if (parsing) {
     *         if (prop == 'date') {
     *             return 'Please enter a valid date in the format "MM/dd/yyyy"';
     *         } else if (prop == 'id') {
     *             return 'Please enter a positive number';
     *         }
     *     }
     * 
     *     // check that stored (parsed) data is valid
     *     if (prop == 'date' && item.date < minDate) {
     *         return 'Please enter a date after ' + Globalize.formatDate(minDate, 'd');
     *     } else if (prop == 'id' && item.id < 0) {
     *         return 'Please enter a positive number';
     *     }
     * });
     * ```
     * 
     * See also the {@link CollectionView.getError} method.
     */
    get itemValidator(): IItemValidator {
        return this._itemValidator;
    }
    set itemValidator(value: IItemValidator) {
        if (value != this.itemValidator) {
            this._itemValidator = wijmo.asFunction(value) as IItemValidator;
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should remain
     * in edit mode when the user tries to commit edits that fail validation.
     *
     * The grid detects validation errors by calling the {@link CollectionView.getError}
     * method on the grid's {@link itemsSource}.
     * 
     * The default value for this property is **true**.
     */
    get validateEdits(): boolean {
        return this._valEdt;
    }
    set validateEdits(value: boolean) {
        this._valEdt = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the format string used to create the group header content.
     *
     * The string may contain any text, plus the following replacement strings:
     * <ul>
     *   <li><b>{name}</b>: The name of the property being grouped on.</li>
     *   <li><b>{value}</b>: The value of the property being grouped on.</li>
     *   <li><b>{level}</b>: The group level.</li>
     *   <li><b>{count}</b>: The total number of items in this group.</li>
     * </ul>
     *
     * If a column is bound to the grouping property, the column header is used 
     * to replace the <code>{name}</code> parameter, and the column's format and
     * data maps are used to calculate the <code>{value}</code> parameter.
     * If no column is available, the group information is used instead.
     *
     * You may add invisible columns bound to the group properties in order to 
     * customize the formatting of the group header cells.
     *
     * The default value for this property is **null**, which causes the grid
     * to use a culture-specific version of the string
     * ```typescript
     * '{name}: &lt;b&gt;{value}&lt;/b&gt;({count:n0} items)'
     * ```
     * 
     * This default format string creates group headers similar to
     * 
     * ```typescript
     * 'Country: &lt;b&gt;UK&lt;/b&gt; (12 items)'
     * 'Country: &lt;b&gt;Japan&lt;/b&gt; (8 items)'
     * ```
     */
    get groupHeaderFormat(): string | null {
        return this._gHdrFmt;
    }
    set groupHeaderFormat(value: string | null) {
        if (value != this._gHdrFmt) {
            this._gHdrFmt = wijmo.asString(value)
            this._bindGrid(false);
        }
    }
    /**
     * Gets or sets a value that determines whether users are allowed to drag 
     * rows and/or columns with the mouse.
     * 
     * If the {@link autoScroll} property is set to true, the grid will automatically
     * scroll its contents while the user drags rows or columns into new positions.
     * 
     * The grid allows dragging columns by default.
     * 
     * Dragging rows requires special considerations in bound scenarios.
     * 
     * When you drag rows on bound grids, the rows will get out of sync with the 
     * data source (row 4 may refer to item 6 for example).
     * To avoid this, you should handle the {@link draggedRow} event and 
     * synchronize the data with the new row positions.
     * 
     * Also, remember to set the {@link allowSorting} property to false or you 
     * the row order will be determined by the data, and dragging rows will be
     * pointless.
     * 
     * This fiddle demonstrates row dragging with a bound grid:
     * <a href="https://jsfiddle.net/Wijmo5/kyg0qsda/" target="_blank">Bound Row Dragging</a>.
     * 
     * The default value for this property is **AllowDragging.Columns**
     * for the {@link FlexGrid} control and **AllowDragging.None**
     * for the **PivotGrid** control.
     * 
     * This property does not apply to the **MultiRow** control.
     */
    get allowDragging(): AllowDragging {
        return this._alDragging;
    }
    set allowDragging(value: AllowDragging) {
        value = wijmo.asEnum(value, AllowDragging);
        if (value != this._alDragging) {
            this._alDragging = value;
            this.invalidate(); // to re-create row/col headers
        }
    }
    /**
     * Gets or sets the array or {@link ICollectionView} that contains items 
     * shown on the grid.
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        if (value != this._items) {
            let e = new wijmo.CancelEventArgs();
            if (this.onItemsSourceChanging(e)) {

                // unbind current collection view
                if (this._cv) {
                    let view = this._cv;
                    
                    // remove arrow function handlers (this may be replaced by Proxy in vue3)
                    view.currentChanged.removeHandler(null, this);
                    view.collectionChanged.removeHandler(null, this);
                    //view.currentChanged.removeHandler(this._cvCurrentChanged, this);
                    //view.collectionChanged.removeHandler(this._cvCollectionChanged, this);

                    // remove custom sort converter, if any
                    if (view instanceof wijmo.collections.CollectionView && view.sortConverter == this._bndSortConverter) {
                        view.sortConverter = null;
                    }

                    this._cv = null;
                }

                // save new data source and collection view
                this._items = value;
                this._cv = this._getCollectionView(value);
                this._lastCount = 0;

                // bind new collection view
                if (this._cv) {
                    let view = this._cv;

                    // use arrow function to bind dynamically (this may be replaced by Proxy in vue3)
                    view.currentChanged.addHandler((s, e) => this._cvCurrentChanged(s, e), this);
                    view.collectionChanged.addHandler((s, e) => this._cvCollectionChanged(s, e), this);
                    //view.currentChanged.addHandler(this._cvCurrentChanged, this);
                    //view.collectionChanged.addHandler(this._cvCollectionChanged, this);

                    // apply custom sort converter, if any
                    if (view instanceof wijmo.collections.CollectionView && !view.sortConverter) {
                        view.sortConverter = this._bndSortConverter;
                    }
                }

                // bind grid
                this._bindGrid(true);

                // reset the selection (consistently, TFS 434783)
                this._selHdl._setSelectionMode(this.selectionMode);

                // raise itemsSourceChanged
                this.onItemsSourceChanged(e);
            }
        }
    }
    /**
     * Gets the {@link ICollectionView} that contains the grid data.
     * 
     * If the {@link itemsSource} property was set to an {@link ICollectionView},
     * this property returns that value.
     * 
     * If the {@link itemsSource} property was set to an array of data items,
     * this property returns the internal {@link CollectionView} created
     * by the grid to support currency, editing, and sorting.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._cv;
    }
    /**
     * Gets the {@link IEditableCollectionView} that contains the grid data.
     */
    get editableCollectionView(): wijmo.collections.IEditableCollectionView {
        return wijmo.tryCast(this._cv, 'IEditableCollectionView');
    }
    /**
     * Gets or sets the name of the property (or properties) used to generate 
     * child rows in hierarchical grids.
     *
     * Set this property to a string to specify the name of the property that
     * contains an item's child items
     * (e.g. <code>childItemsPath = 'items';</code>).
     * 
     * If items at different levels have child items with different names,
     * set this property to an array containing the names of the properties
     * that contain child items et each level
     * (e.g. <code>childItemsPath = ['checks','earnings'];</code>).
     * 
     * {@sample Grid/TreeGrid/ChildItems/purejs Example}
     * 
     * The default value for this property is **null**.
     * 
     * This property does not apply to the **MultiRow** control.
     */
    get childItemsPath(): string | string[] | null {
        return this._childItemsPath;
    }
    set childItemsPath(value: string | string[] | null) {
        if (value != this._childItemsPath) {
            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'childItemsPath should be an array or a string.');
            this._childItemsPath = value;
            this._bindGrid(true);
        }
    }
    /**
     * Gets or sets the name of the property used to create row header
     * cells.
     *
     * Row header cells are not visible or selectable. They are meant
     * for use with accessibility tools.
     */
    get rowHeaderPath(): string {
        return this._rowHdrPath ? this._rowHdrPath.path : null;
    }
    set rowHeaderPath(value: string) {
        if (value != this.rowHeaderPath) {
            value = wijmo.asString(value);
            this._rowHdrPath = value ? new wijmo.Binding(value) : null;
            this.invalidate();
        }
    }
    /**
     * Gets the {@link GridPanel} that contains the data cells.
     */
    get cells(): GridPanel {
        return this._gpCells;
    }
    /**
     * Gets the {@link GridPanel} that contains the column header cells.
     */
    get columnHeaders(): GridPanel {
        return this._gpCHdr;
    }
    /**
     * Gets the {@link GridPanel} that contains the column footer cells.
     *
     * The {@link columnFooters} panel appears below the grid cells, to the
     * right of the {@link bottomLeftCells} panel. It can be used to display
     * summary information below the grid data.
     *
     * The example below shows how you can add a row to the {@link columnFooters}
     * panel to display summary data for columns that have the
     * {@link Column.aggregate} property set:
     *
     * ```typescript
     * function addFooterRow(flex) {
     * 
     *   // create a GroupRow to show aggregates
     *   let row = new wijmo.grid.GroupRow();
     *
     *   // add the row to the column footer panel
     *   flex.columnFooters.rows.push(row);
     *
     *   // show a sigma on the header
     *   flex.bottomLeftCells.setCellData(0, 0, '\u03A3');
     * }
     * ```
     */
    get columnFooters(): GridPanel {
        return this._gpCFtr;
    }
    /**
     * Gets the {@link GridPanel} that contains the row header cells.
     */
    get rowHeaders(): GridPanel {
        return this._gpRHdr;
    }
    /**
     * Gets the {@link GridPanel} that contains the top left cells
     * (to the left of the column headers).
     */
    get topLeftCells(): GridPanel {
        return this._gpTL;
    }
    /**
     * Gets the {@link GridPanel} that contains the bottom left cells.
     *
     * The {@link bottomLeftCells} panel appears below the row headers, to the
     * left of the {@link columnFooters} panel.
     */
    get bottomLeftCells(): GridPanel {
        return this._gpBL;
    }
    /**
     * Gets the grid's row collection.
     */
    get rows(): RowCollection {
        return this._rows;
    }
    /**
     * Gets the grid's column collection.
     */
    get columns(): ColumnCollection {
        return this._cols;
    }
    /**
     * Gets a column by name or by binding.
     *
     * The method searches the column by name. If a column with the given name 
     * is not found, it searches by binding. The searches are case-sensitive.
     *
     * @param name The column name, binding, or index.
     * @param header Whether to include column groups in search.
     * @return The column with the specified name or binding, or null if not found.
     */
    getColumn(name: string | number, header?: boolean): Column {
        if (this._hasColumnGroups() && header) {
            const groups = this.getColumnGroups();
            return (groups !== null) ? groups.getColumn(name) : null;
        }
        return this.columns.getColumn(name);
    }
    /**
     * Gets or sets the number of frozen rows.
     *
     * Frozen rows do not scroll vertically, but the cells they contain 
     * may be selected and edited.
     *
     * The default value for this property is **0**.
     */
    get frozenRows(): number {
        return this.rows.frozen;
    }
    set frozenRows(value: number) {
        this.rows.frozen = value;
    }
    /**
     * Gets or sets the number of frozen columns.
     *
     * Frozen columns do not scroll horizontally, but the cells they contain 
     * may be selected and edited.
     * 
     * The default value for this property is **0**.
     */
    get frozenColumns(): number {
        return this.columns.frozen;
    }
    set frozenColumns(value: number) {
        this.columns.frozen = value;
    }
    /**
     * Gets or sets a value that determines whether the FlexGrid should
     * clone frozen cells and show then in a separate element to reduce
     * flicker while scrolling.
     *
     * The default value for this property is **null**, which causes 
     * the grid to select the best setting depending on the browser.
     */
    get cloneFrozenCells(): boolean | null{
        return this._fzClone;
    }
    set cloneFrozenCells(value: boolean | null) {
        if (value != this._fzClone) {
            wijmo.setText(this._fCt, null);
            this._fzClone = wijmo.asBoolean(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the index of row in the column header panel that
     * shows and changes the current sort.
     *
     * The default value for this property is **null**,
     * which causes the bottom row in the {@link columnHeaders}
     * panel to act as the sort row.
     */
    get sortRowIndex(): number | null  {
        return this._sortRowIndex;
    }
    set sortRowIndex(value: number | null) {
        if (value != this._sortRowIndex) {
            this._sortRowIndex = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the index of column in the row header panel that
     * shows whether items are being edited.
     *
     * The default value for this property is **null**, which causes
     * the grid to show the edit glyph on the last column of the
     * {@link rowHeaders} panel.
     */
    get editColumnIndex(): number | null {
        return this._editColIndex;
    }
    set editColumnIndex(value: number | null) {
        if (value != this._editColIndex) {
            this._editColIndex = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a {@link Point} that represents the value of the grid's scrollbars.
     */
    get scrollPosition(): wijmo.Point {
        return this._ptScrl.clone();
    }
    set scrollPosition(pt: wijmo.Point) {
        let root = this._root,
            left = -pt.x;

        // IE/Chrome/FF handle scrollLeft differently under RTL:
        // Chrome reverses direction, FF uses negative values, IE does the right thing (nothing)
        if (this.rightToLeft) {
            switch (FlexGrid._getRtlMode()) {
                case 'rev':
                    left = (root.scrollWidth - root.clientWidth) + pt.x;
                    break;
                case 'neg':
                    left = pt.x;
                    break;
                default:
                    left = -pt.x;
                    break;
            }
        }
        root.scrollLeft = left;
        root.scrollTop = -pt.y;
        if (this._updateScrollPosition()) { // TFS 436786
            this._forceScrollUpdate = true;
        }
    }
    /**
     * Gets the client size of the control (control size minus headers and scrollbars).
     */
    get clientSize(): wijmo.Size {
        return this._szClient;
    }
    /**
     * Gets the bounding rectangle of the control in page coordinates.
     */
    get controlRect(): wijmo.Rect {
        if (!this._rcBounds) {
            this._rcBounds = wijmo.getElementRect(this._root);
        }
        return this._rcBounds;
    }
    /**
     * Gets the size of the grid content in pixels.
     */
    get scrollSize(): wijmo.Size {
        return new wijmo.Size(this._gpCells.width, this._heightBrowser);
    }
    /**
     * Gets the range of cells currently in view.
     */
    get viewRange(): CellRange {
        return this._gpCells.viewRange;
    }
    /**
     * Gets or sets the {@link CellFactory} that creates and updates cells for this grid.
     */
    get cellFactory(): CellFactory {
        return this._cf;
    }
    set cellFactory(value: CellFactory) {
        if (value != this._cf) {
            this._clearCells(); // TFS 280538
            this._cf = wijmo.asType(value, CellFactory, false);
        }
    }
    /**
     * Gets or sets a formatter function used to customize cells on this grid.
     *
     * The formatter function can add any content to any cell. It provides 
     * complete flexibility over the appearance and behavior of grid cells.
     *
     * If specified, the function should take four parameters: the {@link GridPanel}
     * that contains the cell, the row and column indices of the cell, and the
     * HTML element that represents the cell. The function will typically change
     * the **innerHTML** property of the cell element.
     *
     * For example:
     * ```typescript
     * flex.itemFormatter = (panel, r, c, cell) => {
     *   if (panel.cellType == CellType.Cell) {
     * 
     *     // draw sparklines in the cell
     *     let col = panel.columns[c];
     *     if (col.name == 'sparklines') {
     *       cell.innerHTML = getSparkline(panel, r, c);
     *     }
     *   }
     * }
     * ```
     *
     * Note that the FlexGrid recycles cells, so if your {@link itemFormatter} 
     * modifies the cell's style attributes, you must make sure that it resets 
     * these attributes for cells that should not have them. For example:
     * ```typescript
     * flex.itemFormatter = (panel, r, c, cell) => {
     * 
     *   // reset attributes we are about to customize
     *   let s = cell.style;
     *   s.color = '';
     *   s.backgroundColor = '';
     *   // customize color and backgroundColor attributes for this cell
     *   ...
     * }
     * ```
     *
     * If you have a scenario where multiple clients may want to customize the
     * grid rendering (for example when creating directives or re-usable libraries),
     * consider using the {@link formatItem} event instead. The event allows multiple
     * clients to attach their own handlers.
     */
    get itemFormatter(): IItemFormatter {
        return this._itemFormatter;
    }
    set itemFormatter(value: IItemFormatter) {
        if (value != this._itemFormatter) {
            this._clearCells(); // TFS 280538
            this._itemFormatter = wijmo.asFunction(value) as IItemFormatter;
        }
    }
    /**
     * Gets a value that indicates whether a given cell can be edited.
     *
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     */
    canEditCell(r: number, c: number): boolean {
        return this._edtHdl._allowEdit(r, c);
    }
    /**
     * Gets the value stored in a cell in the scrollable area of the grid.
     *
     * @param r Index of the row that contains the cell.
     * @param c Index, name, or binding of the column that contains the cell.
     * @param formatted Whether to format the value for display.
     */
    getCellData(r: number, c: number | string, formatted: boolean): any {
        return this.cells.getCellData(r, c, formatted);
    }
    /**
     * Gets a the bounds of a cell element in viewport coordinates.
     *
     * This method returns the bounds of cells in the {@link cells} 
     * panel (scrollable data cells). To get the bounds of cells
     * in other panels, use the {@link getCellBoundingRect} method
     * in the appropriate {@link GridPanel} object.
     *
     * The returned value is a {@link Rect} object which contains the
     * position and dimensions of the cell in viewport coordinates.
     * The viewport coordinates are the same used by the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect">getBoundingClientRect</a>
     * method.
     *
     * @param r Index of the row that contains the cell.
     * @param c Index, name, or binding of the column that contains the cell.
     * @param raw Whether to return the rectangle in raw panel coordinates
     * as opposed to viewport coordinates.
     */
    getCellBoundingRect(r: number, c: number | string, raw?: boolean): wijmo.Rect {
        return this.cells.getCellBoundingRect(r, c, raw);
    }
    /**
     * Sets the value of a cell in the scrollable area of the grid.
     *
     * @param r Index of the row that contains the cell.
     * @param c Index, name, or binding of the column that contains the cell.
     * @param value Value to store in the cell.
     * @param coerce Whether to change the value automatically to match the column's data type.
     * @param invalidate Whether to invalidate the grid to show the change.
     * @return True if the value was stored successfully, false otherwise.
     */
    setCellData(r: number, c: string | number, value: any, coerce = true, invalidate = true): boolean {
        return this.cells.setCellData(r, c, value, coerce, invalidate);
    }
    /**
     * Gets a {@link wijmo.grid.HitTestInfo} object with information about a given point.
     *
     * For example:
     *
     * ```typescript
     * // hit test a point when the user clicks on the grid
     * flex.hostElement.addEventListener('click', (e) => {
     *   let ht = flex.hitTest(e.pageX, e.pageY);
     *   console.log('you clicked a cell of type "' +
     *     wijmo.grid.CellType[ht.cellType] + '".');
     * });
     * ```
     *
     * @param pt {@link Point} to investigate, in page coordinates, or a MouseEvent object, or x coordinate of the point.
     * @param y Y coordinate of the point in page coordinates (if the first parameter is a number).
     * @return A {@link wijmo.grid.HitTestInfo} object with information about the point.
     */
    hitTest(pt: number | wijmo.Point | MouseEvent | HTMLElement, y?: number | boolean): HitTestInfo {
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y) as well
            pt = new wijmo.Point(pt as number, y as number);
        }
        if (wijmo.isBoolean(y) && y) { // reset control bounds before hit-testing
            this._rcBounds = null;
        }
        return new HitTestInfo(this, pt);
    }
    /**
     * Gets the content of a {@link CellRange} as a string suitable for 
     * copying to the clipboard or exporting to CSV (comma-separated values) 
     * files.
     *
     * Hidden rows and columns are not included in the clip string.
     * 
     * Invalid (with negative indexes) row or column ranges can be specified in CellRange,
     * which indicates that data rows or columns are not included in the result.
     * In conjunction with **colHeaders** or **rowHeaders** parameters set to true, this makes
     * it possible to export colum or row headers only, without the corresponding data cells.
     *
     * @param rng {@link CellRange} to copy. If omitted, the current selection is used.
     * @param options A boolean value that specifies the clip string should be a CSV string
     * or a {@link ClipStringOptions} value that specifies options for the clip string.
     * @param colHeaders Whether to include the column headers.
     * @param rowHeaders Whether to include the row headers.
     * 
     * To export the current selection, set the **rng** parameter to null.
     * This will include not only the primary selection but also extended
     * selections such as selected rows (in {@link SelectionMode.ListBox} mode)
     * and multiple selected ranges (in {@link SelectionMode.MultiRange} mode).
     * 
     * Note that multiple selected ranges are included only if all selected ranges 
     * refer to the same column range or row range.
     */
    getClipString(rng?: CellRange | null, options?: boolean | ClipStringOptions, colHeaders?: boolean, rowHeaders?: boolean): string {
        let opt: ClipStringOptions;
        if (options == null || wijmo.isBoolean(options)) {
            opt = options ? ClipStringOptions.CSV : ClipStringOptions.Default;
        } else {
            opt = options as ClipStringOptions;
        }
        wijmo.assert(wijmo.isNumber(opt), 'Unexpected value for ClipStringOptions parameter.');
        return this._edtHdl.getClipString(rng, opt, colHeaders, rowHeaders);
    }
    /**
     * Parses a string into rows and columns and applies the content to a given range.
     *
     * Hidden rows and columns are skipped.
     *
     * @param text Tab and newline delimited text to parse into the grid.
     * @param rng {@link CellRange} to copy. If omitted, the current selection is used.
     */
    setClipString(text: string, rng?: CellRange): void {
        this._edtHdl.setClipString(text, rng);
    }
    /**
     * Overridden to set the focus to the grid without scrolling the  whole grid
     * into view.
     * 
     * @param force Whether to perform the focus operation even if the grid
     * already contains the focus.
     */
    focus(force?: boolean): void {
        this._setFocus(force);
    }
    /**
     * Disposes of the control by removing its association with the host element.
     */
    dispose(): void {

        // cancel any pending edits, close drop-down list
        this.finishEditing(true);

        // remove itemsSource so it doesn't have references to our
        // change event handlers that would prevent the grid from being
        // garbage-collected.
        this.itemsSource = null;

        // allow base class
        super.dispose();
    }
    /**
     * Refreshes the grid display.
     *
     * @param fullUpdate Whether to update the grid layout and content, or just the content.
     */
    refresh(fullUpdate = true): void {

        // always call base class to handle begin/endUpdate logic
        super.refresh(fullUpdate);

        // close any open drop-downs
        this.finishEditing();

        // on full updates, get missing column types based on bindings and
        // update scroll position in case the control just became visible
        // and IE wrongly reset the element's scroll position to the origin
        // http://wijmo.com/topic/flexgrid-refresh-issue-when-hidden/
        if (fullUpdate) {
            this._updateColumnTypes();
            this.scrollPosition = this._ptScrl; // update element to match grid

            // accessibility: expose visible row and column counts since we're virtualizing things
            //this._setAria('rowcount', this._getFixedRowCount() + this.rows.visibleLength);
            //this._setAria('colcount', this.columns.visibleLength);

            // update default row/column sizes if they changed (e.g. new theme, font, paddings)
            this._updateDefaultSizes();

            // clear any pending invalidations (TFS 361613)
            clearTimeout(this._toInv);
            this._toInv = null;
        }

        // refresh the cells
        this.refreshCells(fullUpdate);

        // update control size (TFS 369693)
        let host = this._e;
        if (host) {
            this._szCtl = new wijmo.Size(host.offsetWidth, host.offsetHeight);
        }
    }
    /**
     * Refreshes the grid display.
     *
     * @param fullUpdate Whether to update the grid layout and content, or just the content.
     * @param recycle Whether to recycle existing elements.
     * @param state Whether to keep existing elements and update their state.
     */
    refreshCells(fullUpdate: boolean, recycle?: boolean, state?: boolean): void {
        if (!this.isUpdating) {
            if (fullUpdate) {
                this._updateLayout();
            } else {
                this._updateContent(recycle, state);
            }
        }
    }
    /**
     * Refreshes the cells in a range, updating their content and styles.
     * 
     * Unlike the {@link refreshCells} method, which updates all the cells,
     * {@link refreshRange} allows you to specify which cells should be 
     * refreshed, which in some cases can improve performance.
     * 
     * @param rng {@link CellRange} to be refreshed.
     */
    refreshRange(rng: CellRange): void {
        for (let r = rng.topRow; r <= rng.bottomRow; r++) {
            for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                let cell = this.cells.getCellElement(r, c);
                if (cell) {
                    let cellInfo = cell[GridPanel._INDEX_KEY];
                    this.cellFactory.updateCell(this.cells, r, c, cell, cellInfo.rng);
                }
            }
        }
    }
    /**
     * Resizes a column to fit its content.
     *
     * This method only works if the grid is visible. If its host element
     * has not been added to the DOM, or if any of the grid's ancestor
     * elements is hidden, the grid will not be able to measure the cells
     * and therefore will not be able to auto-size the columns.
     *
     * @param c Index of the column to resize.
     * @param header Whether the column index refers to a regular or a header row.
     * @param extra Extra spacing, in pixels.
     */
    autoSizeColumn(c: number, header = false, extra = 4): void {
        this.autoSizeColumns(c, c, header, extra);
    }
    /**
     * Resizes a range of columns to fit their content.
     *
     * The grid will always measure all rows in the current view range, plus up 
     * to 2,000 rows not currently in view. If the grid contains a large amount 
     * of data (say 50,000 rows),  then not all rows will be measured since that
     * could take a long time.
     *
     * This method only works if the grid is visible. If its host element has not 
     * been added to the DOM, or if any of the grid's ancestor elements is hidden,
     * the grid will not be able to measure the cells and therefore will not be 
     * able to auto-size the columns.
     *
     * @param firstColumn Index of the first column to resize (defaults to the first column).
     * @param lastColumn Index of the last column to resize (defaults to the last column).
     * @param header Whether the column indices refer to regular or header columns.
     * @param extra Extra spacing, in pixels.
     */
    autoSizeColumns(firstColumn?: number, lastColumn?: number, header = false, extra = 4): void {
        let max = 0,
            pHdr = header ? this.topLeftCells : this.columnHeaders,
            pFtr = header ? this.bottomLeftCells : this.columnFooters,
            pCells = header ? this.rowHeaders : this.cells,
            rowRange = this.viewRange;

        // initialize parameters
        firstColumn = firstColumn == null ? 0 : wijmo.asInt(firstColumn);
        lastColumn = lastColumn == null ? pCells.columns.length - 1 : wijmo.asInt(lastColumn);

        // choose row range to measure
        // (viewRange by default, everything if we have only a few items)
        rowRange.row = Math.max(0, rowRange.row - 1000);
        rowRange.row2 = Math.min(rowRange.row2 + 1000, this.rows.length - 1);

        // finish editing and perform auto-sizing
        if (this.finishEditing()) {
            this.columns.deferUpdate(() => {

                // make sure content element width is set
                wijmo.setCss(this._eCt, { width: this._gpCells.width });

                // create element to measure column widths
                let eMeasure = wijmo.createElement('<div ' + FlexGrid._WJS_MEASURE + '="true"/>', 
                    pCells.hostElement,
                    { visibility: 'hidden' }
                );
    
                // create 2d context for quick measuring
                let ctx = this._getCanvasContext();

                // measure cells in the range
                for (let c = firstColumn; c <= lastColumn && c > -1 && c < pCells.columns.length; c++) {
                    let col = pCells.columns[c];
                    if (col.isVisible) {

                        // get max width
                        max = 0;

                        // headers/footers
                        if (this.autoSizeMode & AutoSizeMode.Headers) {
                            for (let r = 0; r < pHdr.rows.length; r++) {
                                if (pHdr.rows[r].isVisible) {
                                    max = Math.max(this._getDesiredWidth(pHdr, r, c, eMeasure), max);
                                }
                            }
                            for (let r = 0; r < pFtr.rows.length; r++) {
                                if (pFtr.rows[r].isVisible) {
                                    max = Math.max(this._getDesiredWidth(pFtr, r, c, eMeasure), max);
                                }
                            }
                        }

                        // cells
                        if (this.autoSizeMode & AutoSizeMode.Cells) {
                            if (rowRange.row > -1 && rowRange.row2 > -1) { // TFS 297764, 467065, 470054
                                if (col._getQuickAutoSize()) {
                                    let r = this._getWidestRow(pCells, rowRange, c, ctx);
                                    max = Math.max(this._getDesiredWidth(pCells, r, c, eMeasure), max);
                                } else {
                                    for (let r = rowRange.row; r <= rowRange.row2 && r < pCells.rows.length; r++) {
                                        if (pCells.rows[r].isVisible) {
                                            max = Math.max(this._getDesiredWidth(pCells, r, c, eMeasure), max);
                                        }
                                    }
                                }
                            }
                        }

                        // set size
                        if (max > 0) {
                            col.width = max + extra + 2;
                        }
                    }
                }

                // done with measuring element
                this.cellFactory.disposeCell(eMeasure);
                wijmo.removeChild(eMeasure);
            });
        }
    }
    /**
     * Resizes a row to fit its content.
     * 
     * This method only works if the grid is visible. If its host element
     * has not been added to the DOM, or if any of the grid's ancestor
     * elements are hidden, the grid will not be able to measure the cells
     * and therefore will not be able to auto-size the rows.
     *
     * @param r Index of the row to resize.
     * @param header True to indicate the row index refers to a header row,
     * false to indicate it refers to a regular data row, or null to indicate
     * it refers to a footer row.
     * @param extra Extra spacing, in pixels.
     */
    autoSizeRow(r: number, header = false, extra = 0): void {
        this.autoSizeRows(r, r, header, extra);
    }
    /**
     * Resizes a range of rows to fit their content.
     *
     * This method only works if the grid is visible. If its host element
     * has not been added to the DOM, or if any of the grid's ancestor
     * elements is hidden, the grid will not be able to measure the cells
     * and therefore will not be able to auto-size the rows.
     * 
     * @param firstRow Index of the first row to resize.
     * @param lastRow Index of the last row to resize.
     * @param header Whether the row indices refer to regular or header rows.
     * @param extra Extra spacing, in pixels.
     */
    autoSizeRows(firstRow?: number, lastRow?: number, header = false, extra = 0): void {
        let max = 0,
            pHdr = header == true ? this.topLeftCells :
                header == null ? this.bottomLeftCells :
                this.rowHeaders,
            pCells = header == true ? this.columnHeaders :
                header == null ? this.columnFooters :
                this.cells;

        // initialize parameters
        extra = wijmo.asNumber(extra);
        firstRow = firstRow == null ? 0 : wijmo.asInt(firstRow);
        lastRow = lastRow == null ? pCells.rows.length - 1 : wijmo.asInt(lastRow);

        // finish editing and perform auto-sizing
        if (lastRow >= firstRow && this.finishEditing()) {

            // make sure content element width is set
            wijmo.setCss(this._eCt, { width: this._gpCells.width });

            // create element to measure row heights
            let eMeasure = wijmo.createElement('<div ' + FlexGrid._WJS_MEASURE + '="true"/>', 
                pCells.hostElement,
                { visibility: 'hidden' });

            // measure cells in the range
            this.rows.deferUpdate(() => {
                let cache = {},
                    asm = this._autoSizeMode,
                    ASM = AutoSizeMode;
                for (let r = firstRow; r <= lastRow && r > -1 && r < pCells.rows.length; r++) {
                    let row = pCells.rows[r];
                    if (row.isVisible) {

                        // get max height
                        max = 0;

                        // headers
                        if (asm & ASM.Headers) {
                            max = this._getDesiredRowHeight(pHdr, r, eMeasure, cache);
                        }

                        // cells
                        if (asm & ASM.Cells) {
                            max = Math.max(this._getDesiredRowHeight(pCells, r, eMeasure, cache), max);
                        }

                        // update size
                        if (max > 0) {
                            pCells.rows[r].height = max + extra;
                        }
                    }
                }
            });

            // done with measuring element
            this.cellFactory.disposeCell(eMeasure);
            wijmo.removeChild(eMeasure);
        }
    }
    /**
     * Gets or sets the indent used to offset row groups of different levels.
     * 
     * The default value for this property is **14** pixels for the
     * {@link FlexGrid} control, and **32** pixels for the **PivotGrid**.
     */
    get treeIndent(): number {
        return this._indent;
    }
    set treeIndent(value: number) {
        if (value != this._indent) {
            this._indent = wijmo.asNumber(value, false, true);
            this.columns.onCollectionChanged();
        }
    }
    /**
     * Collapses all the group rows to a given level.
     *
     * @param level Maximum group level to show.
     */
    collapseGroupsToLevel(level: number): void {

        // finish editing first (this may change the collection)
        if (this.finishEditing()) {

            // set collapsed state for all rows in the grid
            this.deferUpdate(() => { // TFS 312828
                let rows = this.rows;
                rows.deferUpdate(() => {
                    for (let r = 0; r < rows.length; r++) {
                        let gr = rows[r];
                        if (gr instanceof GroupRow) {
                            gr.isCollapsed = gr.level >= level;
                        }
                    }
                });
            });
        }
    }
    /**
     * Gets or sets the current selection mode.
     */
    get selectionMode(): SelectionMode {
        return this._selHdl.selectionMode;
    }
    set selectionMode(value: SelectionMode) {
        value = wijmo.asEnum(value, SelectionMode);
        if (value != this.selectionMode) {
            this._selHdl.selectionMode = value;
        }
    }
    /**
     * Gets or sets the current selection.
     */
    get selection(): CellRange {
        return this._selHdl.selection.clone();
    }
    set selection(value: CellRange) {
        this._selHdl.selection = value;
    }
    /**
     * Selects a cell range and optionally scrolls it into view.
     * 
     * The {@link select} method can be called by passing a {@link CellRange} and
     * an optional boolean parameter that indicates whether the new selection
     * should be scrolled into view. For example:
     * 
     * ```typescript
     * // select cell 1,1 and scroll it into view
     * grid.select(new CellRange(1, 1), true);
     * 
     * // select range (1,1)-(2,4) and do not scroll it into view
     * grid.select(new CellRange(1, 1, 2, 4), false);
     * ```
     * 
     * You can also call the {@link select} method passing the index or the
     * row and column you want to select. In this case, the new selection
     * always scrolls into view. For example:
     * 
     * ```typescript
     * // select cell 1,1 and scroll it into view
     * grid.select(1, 1);
     * ```
     *
     * @param rng Range to select (or index of the row to select).
     * @param show Whether to scroll the new selection into view 
     * (or index, name, or binding of the column to select).
     * @return True if the new selection was applied.
     */
    select(rng: (CellRange | number), show: (boolean | number | string) = true): boolean {
        return this._selHdl.select(rng, show);
    }
    /**
     * Selects all the cells on the grid.
     */
    selectAll() {
        let rows = this.rows.length,
            cols = this.columns.length;
        return rows && cols
            ? this.select(new CellRange(0, 0, rows - 1, cols - 1), false)
            : false;
    }
    /**
     * Gets a {@link SelectedState} value that indicates the selected state of a cell.
     *
     * @param r Row index of the cell to inspect.
     * @param c Column index of the cell to inspect.
     */
    getSelectedState(r: number, c: number): SelectedState {
        return this.cells.getSelectedState(r, c);
    }
    /**
     * Gets or sets an array containing the rows that are currently selected.
     *
     * Note: this property can be read in all selection modes, but it can be
     * set only when {@link selectionMode} is set to **SelectionMode.ListBox**.
     */
    get selectedRows(): Row[] {
        let sm = this.selectionMode,
            rows = this.rows.filter(row => row.isSelected);
        if (rows.length == 0 && sm != SelectionMode.None) { // TFS 429868 } && sm != SelectionMode.Cell) {
            let indices = [];
            this.selectedRanges.forEach(rng => { // support multi-range selection: TFS 440642
                for (let i = rng.topRow; i <= rng.bottomRow && i > -1 && i < this.rows.length; i++) {
                    if (indices.indexOf(i) < 0) {
                        indices.push(i);
                    }
                }
            });
            indices.sort(); // sort rows by index
            rows = indices.map(index => this.rows[index]);
        }
        return rows;
    }
    set selectedRows(value: Row[]) {
        wijmo.assert(this.selectionMode == SelectionMode.ListBox, 'This property can be set only in ListBox mode.');
        value = wijmo.asArray(value);
        this.deferUpdate(() => {
            for (let i = 0, first = true; i < this.rows.length; i++) {
                let row = this.rows[i] as Row,
                    sel = value && value.indexOf(row) > -1;
                if (sel && first) {
                    first = false;
                    this.select(i, this.selection.col);
                }
                row.isSelected = sel;
            }
        });
    }
    /**
     * Gets or sets an array containing the data items that are currently selected.
     *
     * Note: this property can be read in all selection modes, but it can be
     * set only when {@link selectionMode} is set to **SelectionMode.ListBox**.
     */
    get selectedItems(): any[] {
        let items = [];
        this.selectedRows.forEach(row => {
            let item = row ? row.dataItem : null;
            //if (item && !(item instanceof CollectionViewGroup) && items.indexOf(item) < 0) {
            if (item && items.indexOf(item) < 0) {
                items.push(item);
            }
        });
        return items;
    }
    set selectedItems(value: any[]) {
        wijmo.assert(this.selectionMode == SelectionMode.ListBox, 'This property can be set only in ListBox mode.');
        value = wijmo.asArray(value);
        this.deferUpdate(() => {
            for (let i = 0, first = true; i < this.rows.length; i++) {
                let row = this.rows[i] as Row,
                    sel = value && value.indexOf(row.dataItem) > -1;
                if (sel && first) {
                    first = false;
                    this.select(i, this.selection.col);
                }
                row.isSelected = sel;
            }
        });
    }
    /**
     * Gets or sets an array with {@link CellRange} objects that represent
     * the current selection.
     * 
     * The first element in the array is the current {@link selection}.
     * If the grid's {@link selectionMode} property is set to
     * {@link SelectionMode.MultiRange}, the array may contain additional
     * ranges that represent the extended selection.
     * 
     * Note that ranges in the {@link selectedRanges} array may contain
     * overlapping areas, which may be important when performing actions
     * like aggregating over the extended selection.
     */
    get selectedRanges(): CellRange[] {
        let arr = [this.selection];
        this._selHdl.extendedSelection.forEach(rng => {
            arr.push(rng);
        });
        return arr;
    }
    set selectedRanges(value: CellRange[]) {
        value = wijmo.asArray(value);
        if (value && value.length > 0) {
            this.select(value[0]); // selection
            if (this.selectionMode == SelectionMode.MultiRange) {
                let xSel = this._selHdl.extendedSelection;
                xSel.deferUpdate(() => { // extended selection
                    xSel.clear();
                    for (let i = 1; i < value.length; i++) {
                        xSel.push(value[i]);
                    }
                });
            }
        }
    }
    /**
     * Scrolls the grid to bring a specific cell into view.
     *
     * Negative row and column indices are ignored, so if you call
     *
     * ```typescript
     * grid.scrollIntoView(200, -1);
     * ```
     *
     * The grid will scroll vertically to show row 200, and will not
     * scroll horizontally.
     *
     * @param r Index of the row to scroll into view.
     * @param c Index, name, or binding of the column to scroll into view.
     * @param refresh Optional parameter that determines whether the grid
     * should refresh to show the new scroll position immediately.
     * @return True if the grid scrolled.
     */
    scrollIntoView(r: number, c: number | string, refresh?: boolean): boolean {

        // make sure our dimensions are set and up-to-date (TFS 288444)
        if (this._maxOffsetY == null || this._rows._dirty || this._cols._dirty) {
            this._updateLayout();
        }

        // and go to work
        let sp = this.scrollPosition,
            sz = this._szClient,
            wid = sz.width,
            hei = sz.height - this._gpCFtr.rows.getTotalSize(),
            ptFrz = this.cells._getFrozenPos();

        // calculate vertical scroll position
        r = wijmo.asInt(r);
        if (r > -1 && r < this._rows.length && r >= this._rows.frozen) {

            // switch CSS pages if necessary (start black magic..., TFS 401989)
            let row = this._rows[r] as Row,
                cssPage = this._getCssPage(row.pos);
            if (cssPage != this._cssPage) {
                let maxOffsetY = this._maxOffsetY,
                    offsetY = Math.round(maxOffsetY * cssPage);
                for (; offsetY > row.pos; cssPage -= .1) {
                    offsetY = Math.round(maxOffsetY * cssPage);
                }
                this._offsetY = offsetY;
            }

            // calculate new position
            let rPos = row.pos - this._offsetY,
                rBot = rPos + row.renderSize;// - 1; // TFS 352184, 273979, 316887
            if (rBot > hei - sp.y) {
                sp.y = Math.max(-rPos, hei - rBot);
            }
            if (rPos - ptFrz.y < -sp.y) {
                sp.y = -(rPos - ptFrz.y);
            }

            // finish black magic: save cssPage to keep the offsetY value (TFS 401989)
            if (cssPage != this._cssPage) {
                this._cssPage = this._getCssPage(-sp.y);
            }
        }

        // calculate horizontal scroll position
        if (wijmo.isString(c)) { // allow column indexing by binding/name
            c = this.columns.indexOf(c);
        }
        c = wijmo.asInt(c);
        if (c > -1 && c < this._cols.length && c >= this._cols.frozen) {
            let col = this._cols[c] as Column,
                rgt = col.pos + col.renderSize;// - 1; // TFS 352184, 273979, 316887
            if (rgt > -sp.x + wid) {
                sp.x = Math.max(-col.pos, wid - rgt);
            }
            if (col.pos - ptFrz.x < -sp.x) {
                sp.x = -(col.pos - ptFrz.x);
            }
        }

        // apply new scroll position
        if (!sp.equals(this._ptScrl)) {
            this.scrollPosition = sp;
            if (refresh) {
                this._updateScrollPosition();
                this._forceScrollUpdate = false; // TFS 467402
                this.refresh();
            }
            return true;
        }

        // no scrollbars, scroll parent/window to keep active cell visible: TFS 419094
        if (/*this._focus &&*/this._activeCell) { // TFS 472828 (didn't require focus before, don't require it now)
            if (r > -1 && c > -1) { // TFS 436270
                let root = this._root,
                    noSBH = root.scrollWidth == root.clientWidth,
                    noSBV = root.scrollHeight == root.clientHeight;
                if (noSBH || noSBV) {
                    let rc = this._activeCell.getBoundingClientRect(),
                        wid = innerWidth,
                        hei = innerHeight,
                        offH = rc.right < 0 || rc.left > wid, // true if cell is off the window by X axis.
                        offV = rc.bottom < 0 || rc.top > hei; // true if cell if off the window by Y axis
                    sp.x = pageXOffset + (rc.left < 0 ? rc.left : rc.right > wid ? rc.right - wid : 0);
                    sp.y = pageYOffset + (rc.top < 0 ? rc.top : rc.bottom > hei ? rc.bottom - hei : 0);
                    if (offH && noSBH && offV && noSBV) {
                        scrollTo(sp.x, sp.y);
                    } else if (offH && noSBH) {
                        scrollTo(sp.x, document.documentElement.scrollLeft);
                    } else if (offV && noSBV) {
                        scrollTo(document.documentElement.scrollTop, sp.y);
                    }
                }
            }
        }

        // no change
        return false;
    }
    /**
     * Checks whether a given CellRange is valid for this grid's row and column collections.
     *
     * @param rng Range to check.
     */
    isRangeValid(rng: CellRange): boolean {
        return rng &&
            rng.isValid &&
            rng.bottomRow < this.rows.length &&
            rng.rightCol < this.columns.length;
    }
    /**
     * Starts editing a given cell.
     *
     * Editing in the {@link FlexGrid} is similar to editing in Excel:
     * Pressing F2 or double-clicking a cell puts the grid in **full-edit** mode. 
     * In this mode, the cell editor remains active until the user presses Enter, Tab, 
     * or Escape, or until he moves the selection with the mouse. In full-edit mode, 
     * pressing the cursor keys does not cause the grid to exit edit mode.
     *
     * Typing text directly into a cell puts the grid in **quick-edit mode**.
     * In this mode, the cell editor remains active until the user presses Enter, 
     * Tab, or Escape, or any arrow keys.
     *
     * Full-edit mode is normally used to make changes to existing values. 
     * Quick-edit mode is normally used for entering new data quickly.
     *
     * While editing, the user can toggle between full and quick modes by 
     * pressing the F2 key.
     *
     * @param fullEdit Whether to stay in edit mode when the user presses the cursor keys. Defaults to true.
     * @param r Index of the row to be edited. Defaults to the currently selected row.
     * @param c Index, name, or binding of the column to be edited. Defaults to the currently selected column.
     * @param focus Whether to give the editor the focus when editing starts. Defaults to true.
     * @param evt Event that triggered this action (usually a keypress or keydown).
     * @return True if the edit operation started successfully.
     */
    startEditing(fullEdit = true, r?: number, c?: number | string, focus?: boolean, evt?: any): boolean {
        return this._edtHdl.startEditing(fullEdit, r, c, focus, evt);
    }
    /**
     * Commits any pending edits and exits edit mode.
     *
     * @param cancel Whether pending edits should be canceled or committed.
     * @return True if the edit operation finished successfully.
     */
    finishEditing(cancel?: boolean): boolean {
        return this._edtHdl.finishEditing(cancel);
    }
    /**
     * Gets the **HTMLElement** that represents the currently active cell element.
     *
     * If no cell is currently selected, or if the selected cell is not currently 
     * within view, this property returns null.
     */
    get activeCell(): HTMLElement {
        return this._activeCell;
    }
    /**
     * Gets the **HTMLInputElement** that represents the currently active cell editor.
     * 
     * If no cell is currently being edited, this property returns null.
     */
    get activeEditor(): HTMLInputElement {
        let edtHdl = this._edtHdl;
        return edtHdl ? edtHdl.activeEditor : null;
    }
    /**
     * Gets a {@link CellRange} that identifies the cell currently being edited.
     */
    get editRange(): CellRange {
        let rng = this._edtHdl.editRange
        return rng ? rng.clone() : null;
    }
    /**
     * Gets or sets the {@link MergeManager} object responsible for determining how cells
     * should be merged.
     */
    get mergeManager(): MergeManager {
        return this._mrgMgr;
    }
    set mergeManager(value: MergeManager) {
        if (value != this._mrgMgr) {
            this._mrgMgr = wijmo.asType(value, MergeManager, true);
            this.invalidate();
        }
    }
    /**
     * Gets a {@link CellRange} that specifies the merged extent of a cell
     * in a {@link GridPanel}.
     *
     * @param p The {@link GridPanel} that contains the range.
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     * @param clip Whether to clip the merged range to the grid's current view range.
     * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
     */
    getMergedRange(p: GridPanel, r: number, c: number, clip = true): CellRange {
        return this._mrgMgr ? this._mrgMgr.getMergedRange(p, r, c, clip) : null;
    }
    /**
     * Gets or sets the action to perform when the TAB key is pressed.
     *
     * The default setting for this property is {@link KeyAction.None},
     * which causes the browser to select the next or previous controls
     * on the page when the TAB key is pressed. This is the recommended
     * setting to improve page accessibility.
     *
     * In previous versions, the default was set to {@link KeyAction.Cycle},
     * which caused the control to move the selection across and down
     * the grid. This is the standard Excel behavior, but is not good
     * for accessibility.
     *
     * There is also a {@link KeyAction.CycleOut} setting that causes the
     * selection to move through the cells (as {@link KeyAction.Cycle}),
     * and then on to the next/previous control on the page when the
     * last or first cells are selected.
     */
    get keyActionTab(): KeyAction {
        return this._keyHdl._kaTab;
    }
    set keyActionTab(value: KeyAction) {
        this._keyHdl._kaTab = wijmo.asEnum(value, KeyAction);
    }
    /**
     * Gets or sets the action to perform when the ENTER key is pressed.
     *
     * The default setting for this property is {@link KeyAction.MoveDown},
     * which causes the control to move the selection to the next row.
     * This is the standard Excel behavior.
     */
    get keyActionEnter(): KeyAction {
        return this._keyHdl._kaEnter;
    }
    set keyActionEnter(value: KeyAction) {
        this._keyHdl._kaEnter = wijmo.asEnum(value, KeyAction);
    }
    /**
     * Gets or sets a value that determines whether the grid should keep
     * whitespace in cells as they appear in the data 
     * <code>(white-space: pre)</code> or whether it should collapse the
     * whitespace into a single space character
     * <code>(white-space: normal)</code>.
     * 
     * This property allows you to specify how the grid should handle
     * white space without changing any CSS rules. You choose to use
     * CSS rules instead, however, since they provide better control
     * over scope.
     * 
     * For example, you could create CSS rules that apply to all grids 
     * in the application, to specific grids, or to specific columns.
     * 
     * Be aware that setting this property to **true** may have 
     * undesired effects in applications that use interop cell templates
     * (Vue templates especially).
     * 
     * The default value for this property is **false**.
     */
    get preserveWhiteSpace(): boolean {
        return wijmo.hasClass(this.hostElement, FlexGrid._WJS_WSPRE);
    }
    set preserveWhiteSpace(value: boolean) {
        wijmo.toggleClass(this.hostElement, FlexGrid._WJS_WSPRE, wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value that indicates whether the grid should add
     * drop-down buttons to data-mapped cells.
     * 
     * The drop-down buttons are shown on columns that have a {@link Column.dataMap}
     * and are editable.
     * 
     * Clicking on the drop-down buttons causes the grid to show a 
     * drop-down list from which users can select the cell value.
     * 
     * This setting may be overridden on specific columns using the
     * column's {@link Column.dataMapEditor} property.
     *
     * Cell drop-downs require the **wijmo.input module** to be loaded.
     */
    get showDropDown(): boolean {
        return this._shDropDown;
    }
    set showDropDown(value: boolean) {
        if (value != this._shDropDown) {
            this._shDropDown = wijmo.asBoolean(value, true);
            this.invalidate();
        }
    }
    /**
     * Toggles the visibility of the drop-down list box associated with
     * the currently selected cell.
     *
     * The drop-down list is created automatically based on the column's
     * {@link Column.dataMap} property.
     * 
     * This method can be used to show the drop-down list automatically
     * when the cell enters edit mode, or when the user presses certain
     * keys.
     *
     * For example, this code causes the grid to show the drop-down list
     * whenever the grid enters edit mode:
     * 
     * ```typescript
     * // show the drop-down list when the grid enters edit mode
     * theGrid.beginningEdit.addHandler(() => {
     *   theGrid.toggleDropDownList();
     * });
     * ```
     *
     * This code causes the grid to show the drop-down list when the grid
     * enters edit mode after the user presses the space bar:
     * 
     * ```typescript
     * // show the drop-down list when the user presses the space bar
     * theGrid.hostElement.addEventListener('keydown', (e) => {
     *   if (e.keyCode == 32) {
     *     e.preventDefault();
     *     theGrid.toggleDropDownList();
     *   }
     * }, true);
     * ```
     */
    toggleDropDownList(): boolean {
        if (!this._tglDropDown) {
            this._tglDropDown = true;
            this._edtHdl._toggleListBox(null);
            this._tglDropDown = false;
        }
        return this._edtHdl._lbx != null;
    }
    /**
     * Gets a reference to a static object that defines the default width for
     * auto-generated grid columns based on their types.
     * 
     * The object keys are {@link DataType} values. The object values are either
     * numbers (widths in pixels) or star-size strings (multiples of the default
     * width defined by the columns defaultSize property).
     * 
     * For example:
     * 
     * ```typescript
     * import { FlexGrid } from '@grapecity/wijmo.grid';
     * import { DataType } from '@grapecity/wijmo';
     * 
     * // make boolean columns on all grids 100px wide by default
     * FlexGrid.defaultTypeWidth[DataType.Boolean] = 100;
     * 
     * // make numeric columns on all grids 75% as wide as the columns defaultSize
     * FlexGrid.defaultTypeWidth[DataType.Number] = '0.75*';
     * ```
     */
    static get defaultTypeWidth(): object {
        return FlexGrid._defTypeWidth;
    }

    //#endregion

    //--------------------------------------------------------------------------
    //#region ** events

    /**
     * Occurs before the grid is bound to a new items source.
     */
    readonly itemsSourceChanging = new wijmo.Event<FlexGrid, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link itemsSourceChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onItemsSourceChanging(e: wijmo.CancelEventArgs): boolean {
        this.itemsSourceChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the grid has been bound to a new items source.
     */
    readonly itemsSourceChanged = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e?: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }
    /**
     * Occurs after the control has scrolled.
     */
    readonly scrollPositionChanged = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link scrollPositionChanged} event.
     */
    onScrollPositionChanged(e?: wijmo.EventArgs) {
        this.scrollPositionChanged.raise(this, e);
    }
    /**
     * Occurs before selection changes.
     */
    readonly selectionChanging = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link selectionChanging} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onSelectionChanging(e: CellRangeEventArgs): boolean {
        this.selectionChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after selection changes.
     */
    readonly selectionChanged = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link selectionChanged} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onSelectionChanged(e: CellRangeEventArgs) {
        this.selectionChanged.raise(this, e);
    }
    /**
     * Occurs before the grid rows are bound to items in the data source.
     */
    readonly loadingRows = new wijmo.Event<FlexGrid, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link loadingRows} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onLoadingRows(e: wijmo.CancelEventArgs): boolean {
        this.loadingRows.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the grid rows have been bound to items in the data source.
     */
    readonly loadedRows = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link loadedRows} event.
     */
    onLoadedRows(e?: wijmo.EventArgs) {
        this.loadedRows.raise(this, e);
        this._autoRowHeights();
    }
    /**
     * Occurs before the grid updates its internal layout.
     */
    readonly updatingLayout = new wijmo.Event<FlexGrid, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link updatingLayout} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onUpdatingLayout(e: wijmo.CancelEventArgs): boolean {
        this.updatingLayout.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the grid has updated its internal layout.
     */
    readonly updatedLayout = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link updatedLayout} event.
     */
    onUpdatedLayout(e?: wijmo.EventArgs) {
        this.updatedLayout.raise(this, e);
    }
    /**
     * Occurs as columns are resized.
     */
    readonly resizingColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link resizingColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onResizingColumn(e: CellRangeEventArgs): boolean {
        this.resizingColumn.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user finishes resizing a column.
     */
    readonly resizedColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link resizedColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onResizedColumn(e: CellRangeEventArgs) {
        this.resizedColumn.raise(this, e);
        this._autoRowHeights();
    }
    /**
     * Occurs before the user auto-sizes a column by double-clicking the 
     * right edge of a column header cell.
     */
    readonly autoSizingColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link autoSizingColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onAutoSizingColumn(e: CellRangeEventArgs): boolean {
        this.autoSizingColumn.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user auto-sizes a column by double-clicking the 
     * right edge of a column header cell.
     */
    readonly autoSizedColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link autoSizedColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onAutoSizedColumn(e: CellRangeEventArgs): void {
        this.autoSizedColumn.raise(this, e);
    }
    /**
     * When one or more columns have been resized due to star-sizing.
     */
    readonly starSizedColumns = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link starSizedColumns} event.
     */
    onStarSizedColumns(e?: wijmo.EventArgs): void {
        this.starSizedColumns.raise(this, e);
        this._autoRowHeights();
    }
    /**
     * Occurs when the user starts dragging a column.
     */
    readonly draggingColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggingColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDraggingColumn(e: CellRangeEventArgs): boolean {
        this.draggingColumn.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs as the user drags a column to a new position.
     *
     * The handler may cancel the event to prevent users from
     * dropping columns at certain positions. For example:
     *
     * ```typescript
     * // remember column being dragged
     * flex.draggingColumn.addHandler((s, e) => {
     *     theColumn = s.columns[e.col].binding;
     * });
     *
     * // prevent 'sales' column from being dragged to index 0
     * s.draggingColumnOver.addHandler((s, e) => {
     *     if (theColumn == 'sales' && e.col == 0) {
     *         e.cancel = true;
     *     }
     * });
     * ```
     */
    readonly draggingColumnOver = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggingColumnOver} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDraggingColumnOver(e: CellRangeEventArgs): boolean {
        this.draggingColumnOver.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user finishes dragging a column.
     */
    readonly draggedColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggedColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onDraggedColumn(e: CellRangeEventArgs): void {
        this.draggedColumn.raise(this, e);
    }
    /**
     * Occurs before one or more columns are pinned (or unpinned).
     */
    readonly pinningColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pinningColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onPinningColumn(e: CellRangeEventArgs): boolean {
        this.pinningColumn.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after one or more columns are pinned (or unpinned).
     */
    readonly pinnedColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pinnedColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onPinnedColumn(e: CellRangeEventArgs): void {
        this.pinnedColumn.raise(this, e);
    }
    /**
     * Occurs as rows are resized.
     */
    readonly resizingRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link resizingRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onResizingRow(e: CellRangeEventArgs): boolean {
        this.resizingRow.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user finishes resizing rows.
     */
    readonly resizedRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link resizedRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onResizedRow(e: CellRangeEventArgs): void {
        this.resizedRow.raise(this, e);
    }
    /**
     * Occurs before the user auto-sizes a row by double-clicking the 
     * bottom edge of a row header cell.
     */
    readonly autoSizingRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link autoSizingRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onAutoSizingRow(e: CellRangeEventArgs): boolean {
        this.autoSizingRow.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user auto-sizes a row by double-clicking the 
     * bottom edge of a row header cell.
     */
    readonly autoSizedRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link autoSizedRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onAutoSizedRow(e: CellRangeEventArgs): void {
        this.autoSizedRow.raise(this, e);
    }
    /**
     * Occurs when the user starts dragging a row.
     */
    readonly draggingRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggingRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDraggingRow(e: CellRangeEventArgs): boolean {
        this.draggingRow.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs as the user drags a row to a new position.
     */
    readonly draggingRowOver = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggingRowOver} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDraggingRowOver(e: CellRangeEventArgs): boolean {
        this.draggingRowOver.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user finishes dragging a row.
     */
    readonly draggedRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link draggedRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onDraggedRow(e: CellRangeEventArgs): void {
        this.draggedRow.raise(this, e);
    }
    /**
     * Occurs when a group is about to be expanded or collapsed.
     */
    readonly groupCollapsedChanging = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link groupCollapsedChanging} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onGroupCollapsedChanging(e: CellRangeEventArgs): boolean {
        this.groupCollapsedChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a group has been expanded or collapsed.
     */
    readonly groupCollapsedChanged = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link groupCollapsedChanged} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onGroupCollapsedChanged(e: CellRangeEventArgs): void {
        this.groupCollapsedChanged.raise(this, e);
        //let gr = e.getRow();
        //if (gr instanceof GroupRow && !gr.isCollapsed) {
        //    this._autoRowHeights();
        //}
    }
    /**
     * Occurs when a column group is about to be expanded or collapsed.
     * 
     * The 'data' property of the handler parameters contains a reference
     * to the {@link ColumnGroup} that is about to change.
     */
    readonly columnGroupCollapsedChanging = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link columnGroupCollapsedChanging} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onColumnGroupCollapsedChanging(e: CellRangeEventArgs): boolean {
        this.columnGroupCollapsedChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a column group has been expanded or collapsed.
     * 
     * The 'data' property of the handler parameters contains a reference
     * to the {@link ColumnGroup} that is about to change.
     */
    readonly columnGroupCollapsedChanged = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link columnGroupCollapsedChanged} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onColumnGroupCollapsedChanged(e: CellRangeEventArgs): void {
        this.columnGroupCollapsedChanged.raise(this, e);
    }
    /**
     * Occurs before the user applies a sort by clicking on a column header.
     * 
     * The 'data' property of the handler parameters contains a reference
     * to the DOM event that caused the sort.
     * 
     * The event handler may cancel the sort action.
     */
    readonly sortingColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link sortingColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onSortingColumn(e: CellRangeEventArgs): boolean {
        this.sortingColumn.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user applies a sort by clicking on a column header.
     */
    readonly sortedColumn = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link sortedColumn} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onSortedColumn(e: CellRangeEventArgs): void {
        this.sortedColumn.raise(this, e);
    }
    /**
     * Occurs before a cell enters edit mode.
     * 
     * The 'data' property of the handler parameters contains a reference
     * to the DOM event that caused the grid to enter edit mode.
     * 
     * The event handler may cancel the edit operation.
     */
    readonly beginningEdit = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link beginningEdit} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onBeginningEdit(e: CellRangeEventArgs): boolean {
        this.beginningEdit.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when an editor cell is created and before it becomes active.
     * 
     * The event handler can access the editor element using the grid's
     * {@link activeEditor} property.
     */
    readonly prepareCellForEdit = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link prepareCellForEdit} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onPrepareCellForEdit(e: CellRangeEventArgs): void {
        this.prepareCellForEdit.raise(this, e);
    }
    /**
     * Occurs when a cell edit is ending.
     *
     * You can use this event to perform validation and prevent invalid edits.
     * For example, the code below prevents users from entering values that
     * do not contain the letter 'a'. The code demonstrates how you can obtain
     * the old and new values before the edits are applied.
     *
     * ```typescript
     * function cellEditEnding(flex, e) {
     * 
     *   // get old and new values
     *   let oldVal = flex.getCellData(e.row, e.col),
     *       newVal = flex.activeEditor.value;
     * 
     *   // cancel edits if newVal doesn't contain 'a'
     *   e.cancel = newVal.indexOf('a') < 0;
     * }
     * ```
     *
     * Setting the {@link CellEditEndingEventArgs.cancel} parameter to
     * true causes the grid to discard the edited value and keep the
     * cell's original value.
     *
     * If you also set the {@link CellEditEndingEventArgs.stayInEditMode}
     * parameter to true, the grid will remain in edit mode so the user
     * can correct invalid entries before committing the edits.
     */
    readonly cellEditEnding = new wijmo.Event<FlexGrid, CellEditEndingEventArgs>();
    /**
     * Raises the {@link cellEditEnding} event.
     *
     * @param e {@link CellEditEndingEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onCellEditEnding(e: CellEditEndingEventArgs): boolean {
        this.cellEditEnding.raise(this, e);
        return !e.cancel && !e.stayInEditMode;
    }
    /**
     * Occurs when a cell edit has been committed or canceled.
     */
    readonly cellEditEnded = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link cellEditEnded} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onCellEditEnded(e: CellRangeEventArgs): void {
        this.cellEditEnded.raise(this, e);
        this._autoRowHeights();
    }
    /**
     * Occurs before a row enters edit mode.
     */
    readonly rowEditStarting = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link rowEditStarting} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onRowEditStarting(e: CellRangeEventArgs) {
        this.rowEditStarting.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a row enters edit mode.
     */
    readonly rowEditStarted = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link rowEditStarted} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onRowEditStarted(e: CellRangeEventArgs): void {
        this.rowEditStarted.raise(this, e);
    }
    /**
     * Occurs when a row edit is ending, before the changes are committed or canceled.
     *
     * This event can be used in conjunction with the {@link rowEditStarted} event to
     * implement deep-binding edit undos. For example:
     *
     * ```typescript
     * // save deep bound values when editing starts
     * let itemData = {};
     * s.rowEditStarted.addHandler((s, e) => {
     *   let item = s.collectionView.currentEditItem;
     *   itemData = {};
     *   s.columns.forEach(function (col) {
     *     if (col.binding.indexOf('.') &gt; -1) { // deep binding
     *       let binding = new wijmo.Binding(col.binding);
     *       itemData[col.binding] = binding.getValue(item);
     *     }
     *   })
     * });
     *
     * // restore deep bound values when edits are canceled
     * s.rowEditEnded.addHandler((s, e) => {
     *   if (e.cancel) { // edits were canceled by the user
     *     let item = s.collectionView.currentEditItem;
     *     for (let k in itemData) {
     *       let binding = new wijmo.Binding(k);
     *       binding.setValue(item, itemData[k]);
     *     }
     *   }
     *   itemData = {};
     * });
     * ```
     */
    readonly rowEditEnding = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link rowEditEnding} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onRowEditEnding(e: CellRangeEventArgs): void {
        this.rowEditEnding.raise(this, e);
    }
    /**
     * Occurs when a row edit has been committed or canceled.
     */
    readonly rowEditEnded = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link rowEditEnded} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onRowEditEnded(e: CellRangeEventArgs): void {
        this.rowEditEnded.raise(this, e);
        this._autoRowHeights();
    }
    /**
     * Occurs when the user creates a new item by editing the new row template
     * (see the {@link allowAddNew} property).
     *
     * The event handler may customize the content of the new item or cancel
     * the new item creation.
     */
    readonly rowAdded = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link rowAdded} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled and the new row should be kept.
     */
    onRowAdded(e: CellRangeEventArgs): boolean {
        this.rowAdded.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user is deleting a selected row by pressing the Delete 
     * key (see the {@link allowDelete} property).
     *
     * The event handler may cancel the row deletion.
     */
    readonly deletingRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link deletingRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDeletingRow(e: CellRangeEventArgs): boolean {
        this.deletingRow.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user has deleted a row by pressing the Delete 
     * key (see the {@link allowDelete} property).
     */
    readonly deletedRow = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link deletedRow} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onDeletedRow(e: CellRangeEventArgs): void {
        this.deletedRow.raise(this, e);
    }
    /**
     * Occurs when the user is copying the selection content to the 
     * clipboard by pressing one of the clipboard shortcut keys
     * (see the {@link autoClipboard} property).
     *
     * The event handler may cancel the copy operation.
     */
    readonly copying = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link copying} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onCopying(e: CellRangeEventArgs): boolean {
        this.copying.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user has copied the selection content to the 
     * clipboard by pressing one of the clipboard shortcut keys
     * (see the {@link autoClipboard} property).
     */
    readonly copied = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link copied} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onCopied(e: CellRangeEventArgs): void {
        this.copied.raise(this, e);
    }
    /**
     * Occurs when the user is pasting content from the clipboard by 
     * pressing one of the clipboard shortcut keys
     * (see the {@link autoClipboard} property).
     *
     * The 'data' property of the handler parameters contains a copy
     * of the text being pasted into the grid.
     * 
     * The event handler may cancel the paste operation.
     */
    readonly pasting = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pasting} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onPasting(e: CellRangeEventArgs): boolean {
        this.pasting.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user has pasted content from the 
     * clipboard by pressing one of the clipboard shortcut keys
     * (see the {@link autoClipboard} property).
     */
    readonly pasted = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pasted} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onPasted(e: CellRangeEventArgs): void {
        this.pasted.raise(this, e);
    }
    /**
     * Occurs when the user is pasting content from the clipboard 
     * into a cell (see the {@link autoClipboard} property).
     *
     * The 'data' property of the handler parameters contains the
     * text being pasted into the cell.
     * 
     * The event handler may cancel the paste operation.
     */
    readonly pastingCell = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pastingCell} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onPastingCell(e: CellRangeEventArgs): boolean {
        this.pastingCell.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the user has pasted content from the 
     * clipboard into a cell (see the {@link autoClipboard} property).
     * 
     * The 'data' property of the handler parameters contains the
     * cell's original value (before the new value was pasted).
     */
    readonly pastedCell = new wijmo.Event<FlexGrid, CellRangeEventArgs>();
    /**
     * Raises the {@link pastedCell} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     */
    onPastedCell(e: CellRangeEventArgs): void {
        this.pastedCell.raise(this, e);
    }
    /**
     * Occurs when an element representing a cell has been created.
     *
     * This event can be used to format cells for display. It is similar 
     * in purpose to the {@link itemFormatter} property, but has the advantage 
     * of allowing multiple independent handlers.
     *
     * For example, this code removes the 'wj-wrap' class from cells in 
     * group rows:
     *
     * ```typescript
     * flex.formatItem.addHandler((flex, e) => {
     *   if (flex.rows[e.row] instanceof GroupRow) {
     *     wijmo.removeClass(e.cell, 'wj-wrap');
     *   }
     * });
     * ```
     */
    readonly formatItem = new wijmo.Event<FlexGrid, FormatItemEventArgs>(() => {
        this._clearCells();
    });
    /**
     * Raises the {@link formatItem} event.
     *
     * @param e {@link FormatItemEventArgs} that contains the event data.
     */
    onFormatItem(e: FormatItemEventArgs): void {
        this.formatItem.raise(this, e);
    }
    /**
     * Occurs when the grid starts creating/updating the elements that
     * make up the current view.
     */
    readonly updatingView = new wijmo.Event<FlexGrid, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link updatingView} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onUpdatingView(e: wijmo.CancelEventArgs): boolean {
        this.updatingView.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the grid finishes creating/updating the elements that 
     * make up the current view.
     *
     * The grid updates the view in response to several actions, including:
     *
     * <ul>
     * <li>Refreshing the grid or its data source,</li>
     * <li>Adding, removing, or changing rows or columns,</li>
     * <li>Resizing or scrolling the grid,</li>
     * <li>Changing the selection.</li>
     * </ul>
     */
    readonly updatedView = new wijmo.Event<FlexGrid, wijmo.EventArgs>();
    /**
     * Raises the {@link updatedView} event.
     */
    onUpdatedView(e?: wijmo.EventArgs): void {
        this.updatedView.raise(this, e);
    }

    //#endregion

    //--------------------------------------------------------------------------
    //#region ** implementation

    // gets the control's tabindex
    _getTabIndex(): number {
        return this._orgTabIndex;
    }
    
    // auto-size rows after changes to data/layout
    _autoRowHeights(): void {
        if (this._autoHeights) {
            if (this.rows.length > 100) { // show headers at once (TFS 457108)
                [this.columnHeaders, this.rowHeaders].forEach(p => {
                    p._updateContent(true, false, p._getOffsetY());
                })
            }
            clearTimeout(this._toAutoHeights);
            this._toAutoHeights = setTimeout(() => {
                this._toAutoHeights = null;
                if (!this.editRange) { // TFS 402537
                    let asm = this.autoSizeMode,
                        ASM = AutoSizeMode;
                    if (asm & ASM.Headers) { // header rows
                        this._autoSizeMode = ASM.Both; // TFS 472780
                        this.autoSizeRows(0, this.columnHeaders.rows.length - 1, true);
                        this._autoSizeMode = asm;
                    }
                    if (asm & ASM.Cells) { // data cells
                        this.autoSizeRows();
                    }
                }
            }, wijmo.Control._REFRESH_INTERVAL);
        }
    }

    // gets a value that determines whether the grid should display validation errors
    _getShowErrors(): boolean {
        return this.showErrors && this._hasValidation;
    }

    // gets a value that determines whether the grid can detect validation errors
    _getHasValidation(): boolean {
        return this._hasValidation;
    }

    // gets an error message for a cell
    _getError(p: GridPanel, r: number, c: number, parsing?: boolean): string | null {

        // get errors from grid's itemValidator
        if (wijmo.isFunction(this.itemValidator)) {
            if (p == this.cells) {
                return this.itemValidator(r, c, parsing);
            } else if (p == this.rowHeaders) {
                for (c = 0; c < this.columns.length; c++) {
                    let error = this.itemValidator(r, c, parsing);
                    if (error) {
                        return error;
                    }
                }
            }
        }

        // get errors from CollectionView
        let view = this._cv,
            getError: wijmo.collections.IGetError = view ? view['getError'] : null;
        if (wijmo.isFunction(getError)) {
            let rows = p.rows,
                cols = this.columns,
                item = rows[r].dataItem;
            if (item && !(item instanceof wijmo.collections.CollectionViewGroup)) { // TFS 301887
                if (p == this.cells) {
                    for (; r < rows.length && rows[r].dataItem == item; r++) { // TFS 268198
                        let bCol = this._getBindingColumn(this.cells, r, cols[c]);
                        return getError(item, bCol.binding, parsing);
                    }
                } else if (p == this.rowHeaders) {
                    let error = getError(item, null, false); // get errors for the whole item
                    if (!error) { // or concatenate errors for all columns
                        let errors = []; // TFS 466771
                        for (; r < rows.length && rows[r].dataItem == item; r++) { // TFS 268198
                            for (c = 0; c < cols.length; c++) {
                                let bCol = this._getBindingColumn(this.cells, r, cols[c]);
                                error = getError(item, bCol.binding, false);
                                if (error && errors.indexOf(error) < 0) { // TFS 470138
                                    errors.push(error);
                                }
                            }
                        }
                        if (errors.length) {
                            let tip = this.errorTip,
                                html = tip ? tip.isContentHtml : false; // TFS 466763
                            error = errors.join(html ? '<br/>' : '\n');
                        }
                    }
                    return error;
                }
            }
        }

        // no errors...
        return null;
    }

    // set the value of an ARIA attribute on the element playing grid role
    private _setAria(name: string, value: any): void {
        wijmo.setAttribute(this.cells.hostElement, 'aria-' + name, value);
    }

    // move focus to the proper grid element (TFS 264268, 261336, 265198)
    private _setFocus(force: boolean): void {
        if (this.hostElement) {
            if (force || !this.containsFocus()) { // TFS 265789
                let ae = wijmo.getActiveElement(),
                    aEdt = this.activeEditor,
                    aCell = this._activeCell,
                    eFocus = this._eFocus,
                    root = this._root,
                    tabIndex = this._getTabIndex();
                if (aEdt) {
                    if (!wijmo.contains(aEdt, ae)) {
                        aEdt.focus(); // TFS 299364
                        eFocus.tabIndex = -1;
                    }
                } else if (aCell) {
                    if (!wijmo.contains(aCell, ae)) {
                        if (ae != this._root) { // TFS 303352
                            if (wijmo.isIE() && wijmo.hasClass(aCell, 'wj-group')) { // focus on the button, not on the cell (TFS 397635)
                                aCell = aCell.querySelector('.' + CellFactory._WJC_COLLAPSE) || aCell;
                            }
                            aCell.tabIndex = tabIndex;
                            this._setFocusNoScroll(aCell); // TFS 299364, 404878, 430610
                            eFocus.tabIndex = -1;
                        }
                    }
                } else {
                    if (!wijmo.contains(eFocus, ae) && ae != root) { // TFS 315479
                        eFocus.tabIndex = tabIndex;
                        this._setFocusNoScroll(eFocus);
                    }
                }

                // make sure we got the focus
                if (!this.containsFocus()) {
                    eFocus.tabIndex = tabIndex;
                    this._setFocusNoScroll(eFocus);
                }
            }
        }
    }

    // set the focus to an element without scrolling
    _setFocusNoScroll(e: HTMLElement): void {
        if (wijmo.getActiveElement() != e) {
            // set the tabIndex (or not: TFS 379305)
            //e.tabIndex = this._orgTabIndex;

            // focus options supported only in Chrome
            if (wijmo.supportsFocusOptions()) {
                (e as any).focus({ preventScroll: true }); // to build with TS 2.9.2
            } else {

                // save state to restore later
                let sp = this.scrollPosition,
                    style = e.style,
                    pos = style.position;

                // set position and focus on the element (TFS 293739, 404878)
                style.position = 'fixed';
                e.focus();

                // restore position after setting the focus
                style.position = pos;
                this.scrollPosition = sp;
            }

            // make sure the grid didn't scroll out of whack in ios
            this._fixScroll();
        }
    }

    // Update default row/column sizes if they changed (e.g. new theme, font, paddings),
    // returns a default row height.
    // This method can be overridden in the derived classes to make grid specific adjustments
    // of row/column collections' defaultSize(s).
    protected _updateDefaultSizes(): number {
        let defRowHei = this._getDefaultRowHeight();
        this._rows._setDefaultSize(defRowHei);
        this._cols._setDefaultSize(defRowHei * 4);
        this._hdrRows._setDefaultSize(defRowHei);
        this._hdrCols._setDefaultSize(Math.round(defRowHei * 1.25));
        this._ftrRows._setDefaultSize(defRowHei);
        return defRowHei;
    }

    // measure the control's default row height based on current styles
    private _getDefaultRowHeight(): number {

        // if this grid is not attached/visible, create a temporary
        // element for measuring the cell height (TFS 305275)
        let host = this.hostElement,
            eMeasure = this._eFocus,
            eTmp = null;
        if (!eMeasure.offsetHeight) { // (offsetHeight > scrollHeight!)
            eTmp = wijmo.createElement(
                '<div><div class="wj-cell">0</div></div>',
                document.body // TFS 438988
            ) as HTMLDivElement;
            if (host) {
                eTmp.setAttribute('class', host.getAttribute('class')); // TFS 336922
            }
            eMeasure = eTmp.children[0];
        }

        // get row height taking styles into account (font size, padding, border)
        let defRowHei = eMeasure.offsetHeight;
        if (isNaN(defRowHei) || defRowHei <= 6) { // sanity
            defRowHei = 28;
        }

        // remove temporary element
        wijmo.removeChild(eTmp);

        // done
        return defRowHei;
    }

    // gets the collection view associated with an itemsSource object
    protected _getCollectionView(value: any): wijmo.collections.ICollectionView {
        return wijmo.asCollectionView(value);
    }

    // gets a 2d canvas context to measure strings
    private _getCanvasContext(): CanvasRenderingContext2D {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            cs = getComputedStyle(this.hostElement);
        ctx.font = cs.fontSize + ' ' + cs.fontFamily.split(',')[0];
        return ctx;
    }

    // gets the row with widest content for a given column
    private _getWidestRow(p: GridPanel, rowRange: CellRange, col: number, ctx: CanvasRenderingContext2D): number {
        let row = 0,
            maxWid = 0,
            rpi = this._getRowsPerItem(),
            isBoolean = rpi === 1 && p.columns[col].dataType == wijmo.DataType.Boolean; // WJM-19990
        for (let r = rowRange.row; r <= rowRange.row2; r++) {
            if (p.rows[r].isVisible) {
                let str = p.getCellData(r, col, true),
                    wid = ctx.measureText(str).width,
                    rng = this.getMergedRange(p, r, col, false);
                if (rng && rng.columnSpan > 1) { // TFS 371464
                    wid /= rng.columnSpan;
                }
                if (wid > maxWid) {
                    maxWid = wid;
                    row = r;
                }

                // boolean cells on the same column have the same width
                if (isBoolean) {
                    break;
                }

                // skip merged rows
                r += rng ? rng.rowSpan - 1 : 0;
            }
        }
        return row;
    }

    // measures the desired width of a cell
    private _getDesiredWidth(p: GridPanel, r: number, c: number, e: HTMLElement): number {
        let rng = this.getMergedRange(p, r, c, false),
            s = e.style;
        this.cellFactory.updateCell(p, r, c, e, rng);
        s.width = s.top = s.left = ''; // TFS 278942
        return e.offsetWidth / ((rng && rng.columnSpan > 1) ? rng.columnSpan : 1);
    }

    // measures the desired height of a cell
    private _getDesiredHeight(p: GridPanel, r: number, c: number, e: HTMLElement): number {
        let style = e.style,
            rng = this.getMergedRange(p, r, c, false),
            rowSpan = rng ? rng.rowSpan : 1;
        this.cellFactory.updateCell(p, r, c, e, rng);
        if (!e.innerHTML.trim()) { // TFS 354382
            e.innerHTML = '&nbsp;';
        }
        style.height = style.top = style.left = ''; // TFS 278942
        return e.offsetHeight / rowSpan;
    }

    // gets the desired row height for a panel
    _getDesiredRowHeight(panel: GridPanel, r: number, eMeasure: HTMLElement, cache: any): number {
        let max = 0,
            row = panel.rows[r],
            quickAutoSize = this._getQuickAutoSize();
        for (let c = 0; c < panel.columns.length; c++) {
            let col = panel.columns[c];
            if (col.isVisible) {
                let rng = this.getMergedRange(panel, r, c, false),
                    height: number;
                if (quickAutoSize) { // TFS 335500
                    let key = {
                        ct: panel.cellType,
                        col: c,
                        spr: rng && rng.rowSpan > 1 ? rng.rowSpan : 1,
                        spc: rng && rng.columnSpan > 1 ? rng.columnSpan : 1,
                        data: panel.getCellData(r, c, true) || '1'
                    };
                    let strKey = JSON.stringify(key);
                    height = cache[strKey];
                    if (height == null) {
                        height = this._getDesiredHeight(panel, r, c, eMeasure);
                        cache[strKey] = height;
                    }
                } else {
                    height = this._getDesiredHeight(panel, r, c, eMeasure);
                }

                // keep track of max height
                max = Math.max(height, max);

                // skip merged columns
                c += rng ? rng.columnSpan - 1 : 0;
            }
        }
        return max;
    }

    // gets the index of the sort row, with special handling for nulls
    _getSortRowIndex(): number {
        return this._sortRowIndex != null
            ? this._sortRowIndex
            : this.columnHeaders.rows.length - 1;
    }

    // gets the index of the first column to consider when getting selected
    // rows for deletion (the MultiRow overrides this, TFS 431802)
    _getDeleteColumnIndex(): number {
        return 0;
    }

    // gets the index of the sort row, with special handling for nulls
    _getEditColumnIndex(): number {
        return this._editColIndex != null
            ? this._editColIndex
            : this.rowHeaders.columns.length - 1;
    }

    // sort converter used to sort mapped columns by display value
    _mappedColumns = null;
    private _sortConverter(sd: wijmo.collections.SortDescription, item: any, value: any, init: boolean): any {
        let col: Column;

        // initialize mapped column dictionary
        if (init) {
            this._mappedColumns = null;
            if (this._cv) {
                this._cv.sortDescriptions.forEach(sd => {
                    col = this.getColumn(sd.property);
                    if (col && col.dataMap) {
                        if (!this._mappedColumns) {
                            this._mappedColumns = {};
                        }
                        this._mappedColumns[col.binding] = col.dataMap;
                    }
                });
            }

            // prioritize the column that was clicked
            // (in case multiple columns map the same property)
            if (this._mouseHdl._htDown && this._mouseHdl._htDown.col > -1) {
                col = this.columns[this._mouseHdl._htDown.col];
                if (this._mappedColumns && col.dataMap) { // TFS 118453
                    this._mappedColumns[col.binding] = col.dataMap;
                }
            }
        }

        // convert value if we have a map
        if (this._mappedColumns) {
            let map = this._mappedColumns[sd.property] as DataMap;
            if (map && map.sortByDisplayValues) {
                value = map.getDisplayValue(value);
            }
        }

        // return the value to use for sorting
        return value;
    }

    // binds the grid to the current data source.
    protected _bindGrid(full: boolean): void {

        // finish any pending edits before binding
        this.finishEditing();

        this.deferUpdate(() => {

            // do a full binding if auto-generating columns and no data was loaded before (TFS 366437)
            if (this.autoGenerateColumns && this._lastCount == 0 && wijmo.hasItems(this._cv)) {
                full = true;
            }

            // save selected state
            let selItems: any;
            if (this.preserveSelectedState) { // TFS 280208, 269612
                selItems = this._getMap();
                if (selItems) {
                    this.rows.forEach(row => {
                        if (row.isSelected && row.dataItem) {
                            selItems.set(row.dataItem, true);
                        }
                    });
                }
            }

            // save collapsed state
            let collapsedMap: any;
            if (this.preserveOutlineState && this.rows.maxGroupLevel > -1) {
                collapsedMap = this._getMap();
                if (collapsedMap) {
                    for (let i = 0; i < this.rows.length; i++) {
                        let gr = this.rows[i] as GroupRow;
                        if (gr instanceof GroupRow && gr.isCollapsed && gr.dataItem) {
                            let key = gr.dataItem;
                            if (key instanceof wijmo.collections.CollectionViewGroup) {
                                key = key._path;
                            }
                            collapsedMap.set(key, true);
                        }
                    }
                }
            }

            // update columns
            if (full) {
                this.columns.deferUpdate(() => {
                    this._bindColumns(); // may be overridden
                });
            }

            // update rows
            let e = new wijmo.CancelEventArgs();
            if (this.onLoadingRows(e)) {
                this.rows.deferUpdate(() => {
                    this._bindRows(); // may be overridden
                });
                this.onLoadedRows(e);
            }

            // reset MultiRange selection
            this._selHdl.extendedSelection.clear();

            // restore ListBox selection
            let cnt = 0;
            if (selItems && selItems.size) {
                this.rows.forEach(row => {
                    let item = row.dataItem;
                    if (item && selItems.has(item)) {
                        row.isSelected = true;
                        cnt++;
                    }
                });
            }

            // failed to restore ListBox selection by object, update by index
            if (cnt == 0 && this._lastCount > 0 && this.selectionMode == SelectionMode.ListBox) {
                let sel = this.selection;
                for (let i = sel.topRow; i <= sel.bottomRow && i > -1 && i < this.rows.length; i++) {
                    this.rows[i].isSelected = true;
                }
            }

            // restore collapsed state
            if (collapsedMap && collapsedMap.size) {
                this.rows.deferUpdate(() => {
                    this.rows.forEach(row => {
                        if (row instanceof GroupRow) {
                            let key = row.dataItem;
                            if (key instanceof wijmo.collections.CollectionViewGroup) {
                                key = key._path;
                            }
                            if (collapsedMap.has(key)) {
                                row.isCollapsed = true;
                            }
                        }
                    });
                });
            }

            // save item count for next time
            if (!this._lastCount) {
                let view = this._cv;
                if (view && view.items) {
                    this._lastCount = view.items.length;
                }
            }
        });

        // synchronize grid selection to match source view selection
        if (this._cv) {
            let force = full && !this._toInv; // full update and no sheduled refresh (TFS 392181)
            this._syncSelection(force);
        }
    }

    // get a Map object used to preserve and restore selection and outline state
    // (Map objects are not supported in IE9)
    private _getMap(): any {
        return window['Map']
            ? new Map<any, boolean>()
            : null;
    }

    // update grid rows to sync with data source
    /*protected*/ _cvCollectionChanged(sender, e: wijmo.collections.NotifyCollectionChangedEventArgs): void {

        // auto-generate if necessary
        if (this.autoGenerateColumns && this.columns.length == 0) {
            this._bindGrid(true);
            return;
        }

        // hierarchical binding: re-create all rows
        let action = wijmo.collections.NotifyCollectionChangedAction;
        if (this.childItemsPath && e.action != action.Change) {
            this._bindGrid(false);
            return;
        }

        // synchronize grid with updated CollectionView
        switch (e.action) {

            // an item has changed, invalidate the whole grid to show the changes
            // this also updates aggregates and edit/validation indicators
            case action.Change:
                this.invalidate();
                return;

            // an item has been added, insert a row
            case action.Add:
                if (e.index == this._cv.items.length - 1) {
                    let index = this.rows.length;
                    if (this.rows[index - 1] instanceof _NewRowTemplate) {
                        index--;
                    }
                    this.rows.insert(index, new Row(e.item));
                    return;
                }
                wijmo.assert(false, 'added item should be the last one.');
                break;

            // an item has been removed, delete the row
            case action.Remove:
                let index = this._findRow(e.item);
                if (index > -1) {
                    this.rows.removeAt(index);
                    this._syncSelection();
                    return;
                }
                wijmo.assert(false, 'removed item not found on grid.');
                break;
        }

        // reset (sort, filter, new source, etc): re-create all rows
        this._bindGrid(false);
    }

    // update selection to sync with data source
    private _cvCurrentChanged(s: any, e: wijmo.EventArgs): void {
        this._syncSelection();
    }

    // synchronize grid selection with collection view
    private _syncSelection(force?: boolean): void {
        if (this._cv && this.selectionMode != SelectionMode.None) {

            // get grid's current item
            let sel = this._selHdl.selection,
                row = sel.row > -1 && sel.row < this.rows.length ? this.rows[sel.row] : null,
                item = row ? row.dataItem : null,
                cv = this._cv;

            // not while updating the collection view (TFS 400093)
            if (cv instanceof wijmo.collections.CollectionView && cv.isUpdating) {
                return;
            }

            // not while adding rows at the top (TFS 334675, 372097)
            if (this.newRowAtTop && row instanceof _NewRowTemplate) {
                return;
            }

            // groups are not regular data items (TFS 142470)
            if (item instanceof wijmo.collections.CollectionViewGroup) {
                item = null;
            }

            // if it doesn't match the view's, move the selection to match
            if (force || item != cv.currentItem || sel.row >= this.rows.length) { // TFS 465775

                // but not while adding items to a tree (TFS 269678)
                let ecv = this.editableCollectionView;
                if (!this.childItemsPath || !ecv || !ecv.currentAddItem) {
                    let index = this._getRowIndex(cv.currentPosition);
                    if (index != sel.row || !this.childItemsPath) {
                        sel = new CellRange(index, sel.col, index, sel.col2); // TFS 359420
                        this.select(sel, false);
                        if (this.selectionMode && !this._updating) { // != SelectionMode.None) {
                            this.scrollIntoView(sel.row, -1);
                        }
                    }
                }
            }
        }
    }

    // convert CollectionView index to row index
    private _getRowIndex(index: number): number {
        if (this._cv) {
            let rows = this.rows;

            // look up item, then scan rows to find it
            if (index > -1) {
                let item = this._cv.items[index];
                for (; index < rows.length; index++) {
                    if (rows[index].dataItem === item) {
                        return index;
                    }
                }
                return -1; // item not found, shouldn't happen!
            } else {

                // empty grid except for new row template? select that
                if (rows.length == 1 && rows[0] instanceof _NewRowTemplate) {
                    return 0;
                }

                // no item to look up, so return current unbound row (group header)
                // or -1 (no selection)
                let index = this.selection.row,
                    row = index > -1 ? rows[index] : null;
                return row && (row instanceof GroupRow || row.dataItem == null)
                    ? index
                    : -1;
            }
        }

        // not bound
        return this.selection.row;
    }

    // convert row index to CollectionView index
    _getCvIndex(index: number): number {
        return index > -1 && index < this.rows.length
            ? this.rows[index].dataIndex
            : -1;
    }

    // gets the index of the row that represents a given data item
    private _findRow(data: any): number {
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].dataItem == data) {
                return i;
            }
        }
        return -1;
    }

    // re-arranges the child HTMLElements within this grid.
    private _updateLayout(): void {

        // raise updatingLayout event
        let e = new wijmo.CancelEventArgs();
        if (!this.onUpdatingLayout(e)) {
            return;
        }

        // compute content height, max height supported by browser,
        // and max offset so things match up when you scroll all the way down.
        let tlw = (this._hdrVis & HeadersVisibility.Row) ? this._hdrCols.getTotalSize() : 0,
            tlh = (this._hdrVis & HeadersVisibility.Column) ? this._hdrRows.getTotalSize() : 0,
            blh = this._ftrRows.getTotalSize(),
            heightReal = this._rows.getTotalSize() + blh;

        // make sure scrollbars are functional even if we have no rows (TFS 110441)
        if (heightReal < 1) {
            heightReal = 1;
        }

        // keep track of relevant variables
        this._heightReal = heightReal;
        this._heightBrowser = Math.min(heightReal, FlexGrid._getMaxSupportedCssHeight());
        this._maxOffsetY = Math.max(0, heightReal - this._heightBrowser);

        // compute default cell paddings
        let cs = getComputedStyle(this._eFocus);
        this._cellPadVert = parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
        this._cellPadHorz = parseInt(cs.paddingLeft) + parseInt(cs.paddingRight);
        this._cellPadLeft = parseInt(this.rightToLeft ? cs.paddingRight : cs.paddingLeft);

        // top of the footer divs
        let ftrTop = this._heightBrowser + tlh - blh;

        // cell panel size (dimensions should not be zero or scrollbars won't work)
        // this can happen in grids that have header cells but no scrollable cells
        let cellWid = this._gpCells.width,
            cellHei = this._heightBrowser;
        if (!cellWid && this.rows.length) cellWid = 0.1;
        if (!cellHei && this.columns.length) cellHei = 0.1;

        // set sizes that do *not* depend on scrollbars being visible
        if (this.rightToLeft) {
            wijmo.setCss(this._eTL, { right: 0, top: 0, width: tlw, height: tlh });
            wijmo.setCss(this._eCHdr, { right: tlw, top: 0, height: tlh });
            wijmo.setCss(this._eRHdr, { right: 0, top: tlh, width: tlw });
            wijmo.setCss(this._eCt, { right: tlw, top: tlh, width: cellWid, height: cellHei });
            wijmo.setCss(this._fCt, { right: tlw, top: tlh });
            wijmo.setCss(this._eBL, { right: 0, top: ftrTop, width: tlw, height: blh });
            wijmo.setCss(this._eCFtr, { right: tlw, top: ftrTop, height: blh });
        } else {
            wijmo.setCss(this._eTL, { left: 0, top: 0, width: tlw, height: tlh });
            wijmo.setCss(this._eCHdr, { left: tlw, top: 0, height: tlh });
            wijmo.setCss(this._eRHdr, { left: 0, top: tlh, width: tlw });
            wijmo.setCss(this._eCt, { left: tlw, top: tlh, width: cellWid, height: cellHei });
            wijmo.setCss(this._fCt, { left: tlw, top: tlh });
            wijmo.setCss(this._eBL, { left: 0, top: ftrTop, width: tlw, height: blh });
            wijmo.setCss(this._eCFtr, { left: tlw, top: ftrTop, height: blh });
        }

        // update sticky headers
        if (this._stickyHdr) {
            this._updateStickyHeaders();
        }

        // adjust header z-index when using frozen cells (TFS 263911, 395079)
        // REVIEW: TFS 395079
        let zIndex = (this.frozenRows || this.frozenColumns) ? '3' : '';
        wijmo.setCss([this._eTL, this._eBL, this._eCHdr, this._eCFtr, this._eRHdr, this._eMarquee], {
            zIndex: zIndex
        });

        // in IE, also set the zIndex of the cloned cell container
        // this should not be necessary, but apparently is: TFS 472131
        if (wijmo.isIE()) {
            this._fCt.style.zIndex = zIndex ? '2' : '';
        }

        // update auto-sizer element
        let root = this._root,
            sbW = root.offsetWidth - root.clientWidth,
            sbH = root.offsetHeight - root.clientHeight;
        wijmo.setCss(this._eSz, {
            width: tlw + sbW + this._gpCells.width, // TSF 330724
            height: tlh + sbH + this._heightBrowser
        });

        // update star sizes and re-adjust content width to handle round-offs
        let clientWidth = null;
        if (this.columns._updateStarSizes(root.clientWidth - tlw)) {
            clientWidth = root.clientWidth;
            wijmo.setCss(this._eCt, { width: this._gpCells.width });
            this.onStarSizedColumns();
        }

        // store control size
        this._szClient = new wijmo.Size(root.clientWidth - tlw, root.clientHeight - tlh);
        this._szClientSB = new wijmo.Size(root.offsetWidth - tlw, root.offsetHeight - tlh);
        this._rcBounds = null;

        // update window scroll handler (sticky headers, window clipping)
        this._updateScrollHandler();

        // update content
        this._updateContent(false);

        // update auto-sizer element after refreshing content
        sbW = root.offsetWidth - root.clientWidth;
        sbH = root.offsetHeight - root.clientHeight;
        wijmo.setCss(this._eSz, {
            width: tlw + sbW + this._gpCells.width,
            height: tlh + sbH + this._heightBrowser
        });

        // update client size after refreshing content
        this._szClient = new wijmo.Size(root.clientWidth - tlw, root.clientHeight - tlh);

        // adjust star sizes to account for vertical scrollbars
        if (clientWidth && clientWidth != root.clientWidth) {
            if (this.columns._updateStarSizes(root.clientWidth - tlw)) {
                wijmo.setCss(this._eCt, { width: this._gpCells.width });
                this._updateContent(false);
            }
        }

        // set sizes that *do* depend on scrollbars being visible
        wijmo.setCss([this._eCHdr, this._eCFtr, this._fCt], { width: this._szClient.width });
        wijmo.setCss([this._eRHdr, this._fCt], { height: this._szClient.height });

        // adjust top of footer panel
        if (blh) {
            ftrTop = Math.min(ftrTop, this._szClient.height + tlh - blh);
            wijmo.setCss([this._eBL, this._eCFtr], { top: ftrTop });
        }

        // raise the event
        this.onUpdatedLayout(e);
    }

    // update the top of the header elements to remain visible 
    // when the user scrolls the window
    private _updateStickyHeaders(): void {
        let stuck = false,
            offset = 0;

        // calculate offset
        if (this._stickyHdr) {
            let maxTop = 0,
                thisTop = null;
            for (let el = this.hostElement; el; el = el.parentElement) {
                if (getComputedStyle(el).display != 'inline') { // TFS 406092
                    let rc = el.getBoundingClientRect();
                    if (thisTop == null) {
                        thisTop = rc.top;
                    }
                    maxTop = Math.max(maxTop, rc.top);
                }
            }
            thisTop = Math.max(0, maxTop - thisTop - 1);
            offset = -thisTop;
            stuck = thisTop > 0;
            this._rcBounds = null; // TFS 285201
        }

        // apply offset
        this._eTL.style.top = this._eCHdr.style.top = stuck ? (-offset + 'px') : '';
        wijmo.toggleClass(this._eTL, FlexGrid._WJS_STICKY, stuck);
        wijmo.toggleClass(this._eCHdr, FlexGrid._WJS_STICKY, stuck);
    }

    // attaches/removes handler for window scroll event depending
    // on whether we have sticky headers or doc-level virtual DOM (clip to screen)
    private _updateScrollHandler(): void {
        this._clipToScreen = this._getClipToScreen();
        let needScrollHandler = this._stickyHdr || this._clipToScreen;
        if (needScrollHandler != this._scrollHandlerAttached) {
            this._scrollHandlerAttached = needScrollHandler;
            if (needScrollHandler) {
                this.addEventListener(window, 'scroll', this._scroll.bind(this), true);
            } else {
                this.removeEventListener(window, 'scroll');
            }
        }
    }

    // gets a value that determines whether the viewRange should be clipped
    // to the browser window (in addition to the control rect)
    /*private*/ _getClipToScreen(): boolean {

        // check that we have enough rows
        if (this.rows.length <= FlexGrid._MIN_VIRT_ROWS) {
            return false;
        }

        // check that we don't have scrollbars
        if (this._root.scrollHeight > this._root.clientHeight) {
            return false;
        }

        // check that we are not in a scrollable container
        for (let host = this.hostElement; host && host != document.documentElement; host = host.parentElement) {
            let cs = getComputedStyle(host);
            if (cs.overflow == 'auto') {
                return false;
            }
        }

        // clip cells to screen
        return true;

        //return this.rows.length > FlexGrid._MIN_VIRT_ROWS &&
        //    this.hostElement && this.hostElement.parentElement == document.body &&
        //    this._root.clientHeight == this._root.scrollHeight; // TFS 281413
    }

    // handle window scroll events to update sticky headers and window clipping
    private _scroll(e: UIEvent): void {
        if (wijmo.contains(e.target, this.hostElement)) {

            // window-level virtualization
            if (this._clipToScreen) {
                if (this._afClip) {
                    cancelAnimationFrame(this._afClip);
                }
                this._afClip = requestAnimationFrame(() => {
                    this._afClip = null;
                    this.finishEditing();
                    this._updateContent(true);
                });
            }

            // sticky headers
            if (this._stickyHdr) {
                if (this._afSticky) {
                    cancelAnimationFrame(this._afSticky);
                }
                this._afSticky = requestAnimationFrame(() => {
                    this._afSticky = null;
                    let e = new wijmo.CancelEventArgs();
                    if (this.onUpdatingLayout(e)) {
                        this._updateStickyHeaders();
                        this.onUpdatedLayout(e);
                    }
                });
            }
        }
    }

    // calculate css page (0, .1, .2, ..1) used to calculate
    // Y offset and work around CSS limits (TFS 401989)
    private _getCssPage(scrollTop: number): number {
        if (this._heightReal > this._heightBrowser) {
            let clientHeight = this._szClient.height - this._gpCFtr.rows.getTotalSize();
            if (this._heightBrowser > clientHeight) {
                return wijmo.clamp(Math.round(scrollTop / (this._heightBrowser - clientHeight) * 10) / 10, 0, 1);
            }
        }
        return 0;
    }

    // updates the scrollPosition property based on the element's scroll position
    // note that IE/Chrome/FF handle scrollLeft differently under RTL:
    // - Chrome reverses direction,
    // - FF uses negative values, 
    // - IE does the right thing (nothing)
    private _updateScrollPosition(): boolean {
        let root = this._root,
            top = root.scrollTop,
            left = root.scrollLeft;
        if (this.rightToLeft && FlexGrid._getRtlMode() == 'rev') {
            left = (root.scrollWidth - root.clientWidth) - left;
        }
        let pt = new wijmo.Point(-Math.abs(left), -top);

        // save new value and raise event
        if (!this._ptScrl.equals(pt)) {
            this._ptScrl = pt;
            this.onScrollPositionChanged();
            return true;
        }

        // no change...
        return false;
    }

    // updates the cell elements within this grid.
    private _updateContent(recycle: boolean, state?: boolean): void {
        let root = this._root,
            host = this.hostElement,
            cellHost = this.cells.hostElement,
            oldActiveCell = this._activeCell,
            ae = wijmo.getActiveElement(),
            hadFocus = wijmo.contains(host, ae),
            elFocus = wijmo.closest(ae, '.wj-flexgrid') == host ? ae : null; // TFS 386248

        // raise updatingView event
        let e = new wijmo.CancelEventArgs();
        if (!this.onUpdatingView(e)) {
            return;
        }

        // update control role (grid or treegrid)
        wijmo.setAttribute(cellHost, 'role', this.rows.maxGroupLevel < 0 ? 'grid' : 'treegrid');

        // remember whether this grid can validate its contents (TFS 299026)
        this._hasValidation =
            wijmo.isFunction(this._itemValidator) ||
            (this._cv && wijmo.isFunction(this._cv['getError']));

        // remove old error tooltips
        let cleanErrorTips = !state && this._errorTip && this._errorTip._tips.length;

        // calculate Y offset to work around CSS limits (TFS 401989)
        let cssPage = this._getCssPage(-this._ptScrl.y);
        if (cssPage != this._cssPage) {
            this._cssPage = cssPage;
            this._offsetY = Math.round(this._maxOffsetY * cssPage);
        }

        // update scroll position before content (TFS 144263, 152757)
        this._updateScrollPosition();

        // update marquee first (less flicker while scrolling)
        this._updateMarquee();

        // update data cells
        let newActiveCell = this._gpCells._updateContent(recycle, state, this._offsetY);

        // update visible headers
        let hdrVis = this._hdrVis;
        if (hdrVis & HeadersVisibility.Column) {
            if (!state || (this._ssHdr & hdrVis)) {
                this._gpCHdr._updateContent(recycle, state, 0);
                if (!this.rightToLeft) {
                    this._eCHdr.scrollLeft = 0; // TFS 413410
                }
            }
        }
        if (hdrVis & HeadersVisibility.Row) {
            if (!state || (this._ssHdr & hdrVis)) {
                this._gpRHdr._updateContent(recycle, state, this._offsetY);
                this._eRHdr.scrollTop = 0; // TFS 378202
            }
        }
        if (hdrVis && !state) {
            this._gpTL._updateContent(recycle, state, 0);
        }

        // update column footers
        if (this._gpCFtr.rows.length) {
            this._gpBL._updateContent(recycle, state, 0);
            this._gpCFtr._updateContent(recycle, state, 0)
        }

        // clean error tooltips
        if (cleanErrorTips && this._errorTip && this._errorTip._tips.length) {
            clearTimeout(this._toErrorTips);
            this._toErrorTips = setTimeout(() => {
                let tip = this._errorTip;
                if (tip) {
                    tip.hide();
                    let tips = tip._tips;
                    for (let i = 0; i < tips.length; i++) {
                        let cell = tips[i].element;
                        if (!cell.offsetHeight || !wijmo.hasClass(cell, 'wj-state-invalid')) {
                            tip.setTooltip(cell, null);
                            i--;
                        }
                    }
                }
            }, 250);
        }

        // update frozen cell div used in non-Chrome browsers
        if (this._useFrozenDiv()) {

            // copy frozen cells into their own container
            this._updateFrozenCells(state);

            // make sure frozen cells are not tabbable (doesn't work well)
            if (newActiveCell && wijmo.hasClass(newActiveCell, 'wj-frozen')) {
                newActiveCell = null;
            }
        }

        // show/hide frozen cell div
        this._fCt.style.display = this._fCt.childElementCount ? '' : 'none';

        // save new active cell
        this._activeCell = newActiveCell;

        // restore/update focus
        if (elFocus) {
            if (elFocus != root && elFocus != this._eFocus &&
                wijmo.contains(host, elFocus) && !wijmo.contains(cellHost, elFocus)) {

                // set the focus (if necessary, TFS 300233)
                if (wijmo.getActiveElement() !== elFocus) {
                    elFocus.focus();
                }

                // refresh input element selection (needed only in IE, TFS 261680)
                if (wijmo.isIE() &&
                    elFocus instanceof HTMLInputElement &&
                    !elFocus.type.match(/checkbox|radio|range/i)) {
                    let ss = elFocus.selectionStart,
                        se = elFocus.selectionEnd;
                    elFocus.setSelectionRange(ss, se);
                }

            } else {
                let force = newActiveCell !== oldActiveCell; // TFS 278868
                this._setFocus(force);
            }
        }

        // update tabIndex attribute on old and new active cells
        if (!elFocus && newActiveCell) { // TFS 265282, 391135
            newActiveCell.tabIndex = !this.isDisabled
                ? this._orgTabIndex
                : -1;
        }
        if (oldActiveCell && oldActiveCell != newActiveCell) {
            oldActiveCell.tabIndex = -1;
        }

        // and also on our focus cell (TFS 424912)
        this._eFocus.tabIndex = newActiveCell == null && !this.isDisabled
            ? this._orgTabIndex
            : -1;

        // if we had focus before, make sure we still do
        if (hadFocus) {
            this.focus();
        }

        // make sure the grid didn't scroll out of whack in ios
        this._fixScroll();

        // make sure hit-testing works
        this._rcBounds = null;

        // done updating the view
        this.onUpdatedView(e);
    }

    // make sure non-scrollable elements didn't scroll
    // this can happen in iOS: TFS 265197, 310092, 357273, 433426
    private _fixScroll() {
        let root = this._root;
        if (!this._updating) { // TFS 285639
            let host = this.hostElement,
                tpl = root ? root.parentElement : null,
                rtl = this.rightToLeft;
            if (host) {
                if (host.scrollTop) host.scrollTop = 0;
                if (host.scrollLeft && !rtl) host.scrollLeft = 0;  
            }
            if (tpl) {
                if (tpl.scrollTop) tpl.scrollTop = 0;
                if (tpl.scrollLeft && !rtl) tpl.scrollLeft = 0;
            }
        }

        // workaround for Safari 14.1 repaint bug (WJM-20030)
        // the scrolling issue first appeared in Safari 14.1 is that while horizontal or vertical 
        // scrolling the cells are misaligned or disappear at all
        // this fix applies CSS transform that doesn't visually change anything, but does cause a repaint
        if (wijmo.isSafari() && root) {
            //removes previous tranform
            root.style.transform = '';
            //this is the "fake" transform that forces Safari to repaint the grid area
            root.style.transform = 'translateZ(0)';
        }
    }

    // removes all cells from this grid (true/hard recycle, TFS 280538)
    private _clearCells(): void {
        for (let k in this) {
            if (k[0] == '_') {
                let p = this[k];
                if (p instanceof GridPanel) {
                    p._clearCells();
                }
            }
        }
        this.invalidate();
    }

    // use a separate div for frozen cells in IE/Firefox/Mobile browsers
    // this improves perceived performance by reducing flicker 
    // when scrolling with frozen cells.
    /*private*/ _useFrozenDiv(): boolean {
        return wijmo.isBoolean(this._fzClone)
            ? this._fzClone
            : wijmo.isIE() || wijmo.isFirefox() || wijmo.isSafari() || wijmo.isMobile();
    }

    // copy frozen cells into their own container
    private _updateFrozenCells(state: boolean): void {
        let eFrozen = this._fCt;
        if (!this.frozenRows && !this.frozenColumns) {

            // clear frozen cells (TFS 237203)
            wijmo.setText(eFrozen, null);

        } else {

            // copy state without re-creating cells (TFS 221355)
            let frozen = this._eCt.querySelectorAll('.wj-frozen');
            if (state && eFrozen.children.length == frozen.length) {
                for (let i = 0; i < frozen.length; i++) {
                    eFrozen.children[i].className = (frozen[i] as HTMLElement).className;
                }
                return;
            }

            // clone frozen cells
            wijmo.setText(eFrozen, null);
            if (!this.activeEditor) {
                let errorTip = this._errorTip,
                    isIEOld = navigator.userAgent.indexOf('MSIE') >= 0;
                for (let i = 0; i < frozen.length; i++) {
                    let cell = frozen[i] as HTMLElement;
                    if (wijmo.closest(cell, '.wj-flexgrid') == this.hostElement) { // direct children only...

                        // save cell index (TFS 432844)
                        let index = cell[GridPanel._INDEX_KEY];

                        // nice idea, but screws up vertical scrolling... TFS 441996
                        // don't clone if any parts of the cell are not frozen
                        // row details span across frozen and non-frozen areas (TFS 323964, 435227, 433415)
                        //let rng = index.rng;
                        //if (rng) {
                        //    if (rng.row2 >= this.frozenRows && rng.col2 >= this.frozenColumns) {
                        //        continue;
                        //    }
                        //}

                        // workaround for IE10 bug: node.clone does not copy checkbox state (TFS 376664)
                        // https://stackoverflow.com/questions/35940635/clonenode-seems-broken-in-ie10
                        if (isIEOld) {
                            let qry = 'input[type=checkbox]',
                                cb = cell.querySelector(qry) as HTMLInputElement;
                            cell = cell.cloneNode(true) as HTMLElement;
                            if (cb) {
                                let cbClone = cell.querySelector(qry) as HTMLInputElement;
                                cbClone.checked = cb.checked;
                            }
                        } else {
                            cell = cell.cloneNode(true) as HTMLElement;
                        }

                        // apply cell index (TFS 432844)
                        cell[GridPanel._INDEX_KEY] = index;

                        // copy error tip to clone
                        if (errorTip) {
                            let tip = errorTip.getTooltip(frozen[i]);
                            if (tip) {
                                errorTip.setTooltip(cell, tip);
                            }
                        }

                        // add clone to frozen div
                        eFrozen.appendChild(cell);
                    }
                }
            }
        }
    }

    // update marquee position/visibility
    _updateMarquee() {
        let m = this._eMarquee,
            rc = this._getMarqueeRect();
        if (!rc || !rc.width || !rc.height) {
            m.style.display = 'none';
        } else {
            let mc = m.firstChild as HTMLElement,
                dx = m.offsetWidth - mc.offsetWidth,
                dy = m.offsetHeight - mc.offsetHeight,
                host = this.cells.hostElement;
            wijmo.setCss(m, {
                left: rc.left + host.offsetLeft - dx / 2,
                top: rc.top + host.offsetTop - dy / 2,
                width: rc.width + dx,
                height: rc.height + dy,
                display: ''
            });
        }
    }

    // get marquee rectangle (accounting for merging, freezing, RTL)
    private _getMarqueeRect(): wijmo.Rect {
        
        // make sure we're showing it
        if (!this._shMarquee || !this.selectionMode) { // TFS 439514, C1WEB-27680
            return null;
        }

        // get valid selection
        let rng = this._selHdl.selection;
        if (!this.isRangeValid(rng)) { // TFS 418602
            return null;
        }

        // adjust for selection mode (TFS 438452)
        rng = this.cells._getAdjustedSelection(rng);

        // adjust for merging (no clipping: TFS 465926)
        rng = rng.combine(this.getMergedRange(this.cells, rng.topRow, rng.leftCol, false));
        rng = rng.combine(this.getMergedRange(this.cells, rng.bottomRow, rng.rightCol, false));

        // get cell client rectangles for the corners
        let rc1 = this.cells.getCellBoundingRect(rng.topRow, rng.leftCol, true),
            rc2 = this.cells.getCellBoundingRect(rng.bottomRow, rng.rightCol, true);

        // adjust for frozen rows
        if (this.rows.frozen) {
            let fzr = Math.min(this.rows.length, this.rows.frozen),
                rcf = this.cells.getCellBoundingRect(fzr - 1, 0, true);
            if (rng.topRow >= fzr && rc1.top < rcf.bottom) {
                rc1.top = rcf.bottom;
            }
            if (rng.bottomRow >= fzr && rc2.bottom < rcf.bottom) {
                rc2.height = rcf.bottom - rc2.top;
            }
        }

        // adjust for frozen columns
        if (this.columns.frozen) {
            let fzc = Math.min(this.columns.length, this.columns.frozen),
                rcf = this.cells.getCellBoundingRect(0, fzc - 1, true);
            if (this.rightToLeft) {
                if (rng.leftCol >= fzc && rc1.right > rcf.left) {
                    rc1.left = rcf.left - rc1.width;
                }
                if (rng.rightCol >= fzc && rc2.left > rcf.left) {
                    rc2.left = rcf.left;
                }
            } else {
                if (rng.leftCol >= fzc && rc1.left < rcf.right) {
                    rc1.left = rcf.right;
                }
                if (rng.rightCol >= fzc && rc2.right < rcf.right) {
                    rc2.width = rcf.right - rc2.left;
                }
            }
        }

        // return marquee rect
        return this.rightToLeft
            ? new wijmo.Rect(rc2.left, rc1.top, rc1.right - rc2.left, rc2.bottom - rc1.top)
            : new wijmo.Rect(rc1.left, rc1.top, rc2.right - rc1.left, rc2.bottom - rc1.top);
    }

    // bind columns
    /*protected*/ _bindColumns(): void {
        let cols = this.columns;

        // remove old auto-generated columns
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i];
            if (col._getFlag(RowColFlags.AutoGenerated)) {
                cols.removeAt(i);
                i--;
            }
        }

        // get source collection to infer data types
        let view = this._cv,
            arr = view ? view.items : null; // using items to get calculated fields

        // auto-generate new columns
        // (skipping unwanted types: array and object)
        if (arr && arr.length && this.autoGenerateColumns) {
            this._getColumnTypes(arr).forEach(typeInfo => {

                // create column
                let col = new Column(typeInfo); // sets binding, dataType, and isReadOnly
                col._setFlag(RowColFlags.AutoGenerated, true);
                col.name = col.binding;
                col.header = wijmo.toHeaderCase(col.binding);

                // set the column's width (depends on dataType)
                let width = FlexGrid._defTypeWidth[col.dataType];
                if (width != null) {
                    if (wijmo.isString(width)) {
                        let val = Math.round(parseFloat(width));
                        width = width.indexOf('*') > -1
                            ? val * cols.defaultSize
                            : val;
                    }
                    if (wijmo.isNumber(width) && width > 0) {
                        col.width = width;
                    }
                }

                // add new column to collection
                cols.push(col);
            });
        }

        // update missing column types
        this._updateColumnTypes();
    }

    // get column names and types based on data
    /*protected*/ _getColumnTypes(arr: any[]): wijmo.IBindingInfo[] {
        return wijmo.getTypes(arr);
    }

    // update missing column types and isReadOnly to match data
    /*protected*/ _updateColumnTypes(): void {
        let view = this._cv;
        if (wijmo.hasItems(view)) {
            let item = view.items[0];
            this.columns.forEach(col => {
                if (col.dataType == null && col._binding) {
                    col.dataType = wijmo.getType(col._binding.getValue(item));
                }
            });
        }
    }

    // gets the DataMapEditor type for a given row/column
    _getMapEditor(row: Row, col: Column): DataMapEditor {

        // show drop-down button if the cell has a drop-down editor
        // and if the column's dataMapEditor allows it (TFS 456454)
        if (col.editor) {
            return col.editor['isDroppedDown'] != null ? col.dataMapEditor : null;
        }

        // honor row data maps
        if (row.dataMap && !(row instanceof GroupRow)) {
            return row.dataMapEditor;
        }

        // honor column datamap
        return col.dataMap ? col.dataMapEditor : null;
    }

    // get the binding column 
    // (in the MultiRow grid, each physical column may contain several binding columns)
    /*protected*/ _getBindingColumn(p: GridPanel, r: Number, c: Column): Column {
        return c;
    }

    // get all the binding columns
    // (in the MultiRow grid, each physical column may contain several binding columns: TFS 408828)
    /*protected*/ _getBindingColumns(): Column[] {
        return this.columns;
    }

    // get the number of rows used to display each item
    // (the MultiRow grid has multiple rows per data item)
    /*protected*/ _getRowsPerItem(): number {
        return 1;
    }

    // get value that indicates whether layout is transposed or not
    // Note: transposed layout is when rows represent properties and
    // columns represent items
    // (the TransposedGrid control has transposed layout)
    /*protected*/ _isTransposed(): boolean {
        return false;
    }

    // get the row header path
    /*protected*/ _getRowHeaderPath(): wijmo.Binding {
        return this._rowHdrPath;
    }

    // bind rows
    /*protected*/ _bindRows(): void {

        // clear rows
        this.rows.clear();

        // re-populate
        let view = this._cv;
        if (view && view.items) {
            let items = view.items,
                groups = view.groups;
            if (this.childItemsPath) { // hierarchical sources (childItemsPath)
                for (let i = 0; i < items.length; i++) {
                    this._addNode(items, i, 0);
                }
            } else if (groups != null && groups.length > 0 && this.showGroups) { // grouped sources
                for (let i = 0; i < groups.length; i++) {
                    this._addGroup(groups[i]);
                }
            } else { // regular sources
                for (let i = 0; i < items.length; i++) {
                    this._addBoundRow(items, i);
                }
            }
        }
    }
    /*protected*/ _addBoundRow(items: any[], index: number): void {
        let row = new Row(items[index]),
            rows = this.rows;
        row._list = rows; // TFS 403473
        rows[rows.length++] = row; // about 2x faster
        //this.rows.push(new Row(items[index])); // about 2x slower
    }
    /*protected*/ _addGroupRow(group: wijmo.collections.CollectionViewGroup): void {
        this.rows.push(new GroupRow(group));
    }
    /*protected*/ _addNode(items: any[], index: number, level: number): void {
        let item = items[index],
            path = this.childItemsPath,
            prop = wijmo.isArray(path) ? path[level] : path as string,
            children = item[prop],
            gr = new GroupRow(item);

        // add main node
        gr.level = level;
        this.rows.push(gr);

        // add child nodes
        if (wijmo.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                this._addNode(children, i, level + 1);
            }
        }
    }
    private _addGroup(group: wijmo.collections.CollectionViewGroup): void {

        // add group row
        this._addGroupRow(group);

        // add child rows
        if (group.isBottomLevel) {
            let items = group.items;
            for (let i = 0; i < items.length; i++) {
                this._addBoundRow(items, i);
            }
        } else {
            for (let i = 0; i < group.groups.length; i++) {
                this._addGroup(group.groups[i]);
            }
        }
    }

    // gets a list of the properties defined by a class and its ancestors
    // that have getters, setters, and whose names don't start with '_'.
    // (used by the FlexGrid, TransposedGrid and TransposedMultiRow)
    protected static _getSerializableProperties(obj: any): string[] {
        let arr = [];

        // travel up class hierarchy saving public properties that can be get/set.
        // NOTE: use getPrototypeOf instead of __proto__ for IE9 compatibility.
        for (obj = obj.prototype; obj != Object.prototype; obj = Object.getPrototypeOf(obj)) {
            let names = Object.getOwnPropertyNames(obj);
            for (let i = 0; i < names.length; i++) {
                let name = names[i],
                    pd = Object.getOwnPropertyDescriptor(obj, name); // TFS 457615
                if (pd && pd.set && pd.get && name[0] != '_' &&
                    !name.match(/^(disabled|required|showDropDown)$/)) { // deprecated properties
                    arr.push(name);
                }
            }
        }

        // done
        return arr;
    }

    // expose column groups
    /*protected*/ _hasColumnGroups(): boolean {
        return this._grpHdl.hasColumnGroups();
    }
    /*protected*/ _getColumnGroup(r: number, c: number): Column & _ColumnGroupProperties {
        return this._grpHdl.getColumnGroup(r, c);
    }
    /*protected*/ _canMoveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number): boolean {
        return this._grpHdl.canMoveColumnGroup(srcRow, srcCol, dstRow, dstCol);
    }
    /*protected*/ _moveColumnGroup(srcRow: number, srcCol: number, dstRow: number, dstCol: number, child: boolean): boolean {
        return this._grpHdl.moveColumnGroup(srcRow, srcCol, dstRow, dstCol, child);
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        if (key == 'columns') {
            let arr = wijmo.asArray(value);
            let hasGroups = arr.some(grp => grp.columns != null);
            if (hasGroups) { // handle column groups
                this.columnGroups = arr;
            } else { // regular columns
                this.columns.clear();
                arr.forEach(colInfo => {
                    let c = new Column(colInfo);
                    this.columns.push(c);
                });
            }
            return true;
        }
        return false;
    }

    // check whether an object is an input element
    _isInputElement(e: any): boolean {
        if (e instanceof HTMLElement && !wijmo.hasClass(e, 'wj-btn-glyph')) {
            return e.contentEditable == 'true' ||
                e.tagName.match(/^(INPUT|TEXTAREA|BUTTON|A|SELECT|OPTION)$/i) != null; // TFS 441203
                //e.tagName.match(/^(INPUT|TEXTAREA|BUTTON|A|SELECT|OPTION|LABEL)$/i) != null;
        }
        return false;
    }

    // check whether an input element is our native checkbox editor
    /*private*/ _isNativeCheckbox(edt: any): boolean {
        return edt instanceof HTMLInputElement &&                   // input element
            edt.type == 'checkbox' &&                               // checkbox
            !edt.disabled && !edt.readOnly &&                       // editable (TFS 257521)
            wijmo.hasClass(edt, CellFactory._WJC_CHECKBOX) &&             // default check editor (TFS 221442)
            wijmo.closest(edt, '.wj-flexgrid') == this.hostElement;       // this grid (TFS 223806)
    }

    // checks whether an element should receive input without being bothered by the grid
    _wantsInput(e: any): boolean {
        return this._isInputElement(e) &&
            !this.activeEditor &&
            !this._isNativeCheckbox(e) && // TFS 284014
            !wijmo.hasClass(e, 'wj-grid-ime') && // IME element
            wijmo.contains(document.body, e); // not a disposed editor
    }

    // get max supported element height (see TFS 383659 history)
    // IE limits it to about 1.5Mpx, FF to 6Mpx, Chrome to 27Mpx, Safari to 60Mpx
    private static _maxCssHeight: number;
    private static _getMaxSupportedCssHeight(): number {
        if (!FlexGrid._maxCssHeight) {

            // set limit based on browser (most efficient)
            let maxHeight = 26500000; // Chrome 77, 2e6 fixes blurry borders (but screws up scrolling!)
            if (wijmo.isIE()) {
                maxHeight = 1500000; // IE 11
            } else if (wijmo.isFirefox()) {
                maxHeight = 17500000; // Firefox 71
            }
            FlexGrid._maxCssHeight = maxHeight;

            // actual test, causes some layout thrashing
            /*
            let maxHeight = 1e6,
                testUpTo = 60e6,
                div = document.createElement('div');
            div.style.visibility = 'hidden';
            document.body.appendChild(div);
            for (let test = maxHeight; test <= testUpTo; test += 500000) {
                div.style.height = test + 'px';
                if (div.offsetHeight != test) break;
                maxHeight = test;
            }
            removeChild(div);
            FlexGrid._maxCssHeight = maxHeight;
            */
        }
        return FlexGrid._maxCssHeight;
    }

    // IE/Chrome/Safari/Firefox handle RTL differently; 
    // this function returns a value that indicates the RTL mode:
    // - 'rev': reverse direction so origin is +max, end is zero (Chrome/Safari)
    // - 'neg': switches signs, so origin is -max, end is zero (Firefox)
    // - 'std': standard, origin is zero, end is +max (IE)
    static _rtlMode: string;
    private static _getRtlMode(): string {
        if (!FlexGrid._rtlMode) {

            // create div with scrollable content
            let el = wijmo.createElement('<div dir="rtl"><div></div></div>');
            wijmo.setCss(el, {
                visibility: 'hidden',
                width: 100,
                height: 100,
                overflow: 'auto'
            });
            wijmo.setCss(el.firstChild, {
                width: 2000,
                height: 2000
            });

            // make it scroll, record result
            document.body.appendChild(el);
            let sl = el.scrollLeft;
            el.scrollLeft = -1000;
            let sln = el.scrollLeft;
            wijmo.removeChild(el);

            // store the result
            FlexGrid._rtlMode = sln < 0 ? 'neg' : sl > 0 ? 'rev' : 'std';
        }
        return FlexGrid._rtlMode;
    }
    //#endregion
}
    }
    


    module wijmo.grid {
    




'use strict';

/**
 * Implements a hidden input element so users can choose IME modes when 
 * the FlexGrid has the focus.
 */
export class _ImeHandler {
    _g: FlexGrid;
    _tbx: HTMLInputElement;
    _updateImeFocusAsyncBnd = this._updateImeFocusAsync.bind(this);
    _cmpstartBnd = this._compositionstart.bind(this); // TFS 312148
    _keypressBnd = this._keypress.bind(this);
    _maskProvider: wijmo._MaskProvider; // C1WEB-27592
    _toFocus: any;

    static _cssHidden = {
        position: 'fixed', // TFS 236834
        width: '1px', // not zero, that prevents focus on iPads...
        left: -32000, // really hide this (TFS 402677)
        top: -32000,
        overflow: 'hidden'
    };

    //--------------------------------------------------------------------------
    //#region ** ctor

    /**
     * Initializes a new instance of the {@link _ImeHandler} class 
     * and attaches it to a {@link FlexGrid}.
     * 
     * @param g {@link FlexGrid} that this {@link _ImeHandler} will be attached to.
     */
    constructor(g: FlexGrid) {
        this._g = g;

        // create hidden input focus element
        // using a textarea to support multiLine input
        let tbx = wijmo.createElement('<textarea class="wj-grid-editor wj-form-control wj-grid-ime" aria-hidden="true"/>') as HTMLInputElement;
        wijmo.setCss(tbx, _ImeHandler._cssHidden);
        wijmo.disableAutoComplete(tbx); // TFS 311214
        tbx.tabIndex = -1; // TFS 407938
        this._tbx = tbx;

        // create mask provider for the hidden input focus element
        this._maskProvider = new wijmo._MaskProvider(tbx);

        // add IME input to the grid, update the focus
        g._root.appendChild(tbx);
        this._updateImeFocus();

        // attach event handlers
        let host = g.hostElement,
            add = g.addEventListener.bind(g),
            ufb = this._updateImeFocusAsyncBnd;
        add(host, 'blur', ufb, true);
        add(host, 'focus', ufb);
        add(tbx, 'compositionstart', this._cmpstartBnd);
        if (wijmo.isiOS()) { // keypress needed with iOS Romaji keyboard (TFS 340214)
            add(host, 'keypress', this._keypressBnd);//, true);
        }
        g.selectionChanged.addHandler(ufb, this);
        g.cellEditEnded.addHandler(this._cellEditEnded, this);
        g.cellEditEnding.addHandler(this._cellEditEnding, this);
    }

    //#endregion
    //--------------------------------------------------------------------------
    //#region ** object model

    /**
     * Disposes of this {@link _ImeHandler}.
     */
    dispose() {
        let g = this._g,
            host = g.hostElement,
            tbx = this._tbx,
            rmv = g.removeEventListener.bind(g),
            ufb = this._updateImeFocusAsyncBnd;

        // remove event listeners
        rmv(host, 'blur', ufb);
        rmv(host, 'focus', ufb);
        rmv(host, 'keypress', this._keypressBnd);
        rmv(tbx, 'compositionstart', this._cmpstartBnd);
        g.selectionChanged.removeHandler(ufb);
        g.cellEditEnded.removeHandler(this._cellEditEnded);
        g.cellEditEnding.removeHandler(this._cellEditEnding);

        // remove IME input from grid
        wijmo.removeChild(tbx);
    }

    //#endregion
    //--------------------------------------------------------------------------
    //#region ** implementation

    // show IME input as current editor when composition starts
    _compositionstart(evt: any) {
        let g = this._g;
        if (!g.activeEditor) {

            // start editing
            let sel = g._selHdl.selection;
            if (g.startEditing(false, sel.row, sel.col, false, evt) && g.activeEditor) { // TFS 421653
                if (g.activeEditor.type != 'checkbox') { // no IME over checkboxes

                    // adjust for merged cells (TFS 270497)
                    sel = g.editRange;

                    // get editor position
                    let edt = g.activeEditor,
                        tbx = this._tbx,
                        host = g.cells.hostElement,
                        left = g.columns[sel.col].pos + host.offsetLeft,
                        top = g.rows[sel.row].pos + host.offsetTop,
                        rc = g.getCellBoundingRect(sel.row, sel.col),
                        cell = wijmo.closest(edt, '.wj-cell') as HTMLElement;

                    // adjust for merged cells
                    rc.width = cell.offsetWidth;
                    rc.height = cell.offsetHeight;

                    // account for frozen cells (TFS 239266, 272145)
                    if (sel.row < g.frozenRows) {
                        top += g._root.scrollTop;
                    }
                    if (sel.col < g.frozenColumns) {
                        left += g._root.scrollLeft;
                    }

                    // account for drop-down buttons
                    let btn = cell.querySelector('.wj-btn.wj-right') as HTMLElement;
                    if (btn) {
                        rc.width -= btn.offsetWidth;
                    }

                    // copy validation attributes (including maxLength, TFS 276818)
                    'minLength,maxLength,pattern'.split(',').forEach(att => {
                        wijmo.setAttribute(tbx, att, edt.getAttribute(att));
                    });

                    // allow wrapping if the editor is a textarea
                    let isTextArea = edt instanceof HTMLTextAreaElement;
                    wijmo.setAttribute(tbx, 'wrap', isTextArea ? 'soft' : 'off');

                    // center-align if the native editor is an input element (TFS 358232)
                    // NOTE: don't use line-height since it may return 'normal'
                    let csCell = getComputedStyle(cell),
                        paddingTop = csCell.paddingTop;
                    if (sel.rowSpan > 1 && !isTextArea) {
                        let lineHeight = parseFloat(csCell.lineHeight);
                        if (isNaN(lineHeight)) lineHeight = parseFloat(csCell.fontSize) * 1.2;
                        paddingTop = Math.max(0, (rc.height - lineHeight) / 2) + 'px';
                    }

                    // position the new editor
                    let css: any = {
                        position: 'absolute',
                        left: left,
                        top: top,
                        width: rc.width - 1,
                        height: rc.height - 1,
                        paddingTop: paddingTop,
                        paddingLeft: csCell.paddingLeft,
                        paddingRight: csCell.paddingRight,
                        textAlign: csCell.textAlign,
                        zIndex: cell.style.zIndex
                    };
                    if (g.rightToLeft) { // TFS 414988
                        css.right = parseInt(cell.style.right) + parseInt(g.cells.hostElement.style.right);
                        css.left = '';
                    }
                    wijmo.setCss(tbx, css);

                    // make it the active editor (it already has the focus)
                    g._edtHdl._edt = tbx;

                    // focus might no be enough for IE (TFS 403004)
                    tbx.select();
                    //tbx.focus();

                    // treat Unicode spaces as regular spaces (TFS 358903)
                    let oldValue = edt.value;
                    setTimeout(() => { // wait for the key to be handled
                        if (tbx.value == '\u3000' || tbx.value == ' ') { // check whether it's a space
                            tbx.value = oldValue; // restore original editor value
                        }
                        wijmo.setSelectionRange(tbx, tbx.value.length); // move selection to end (TFS 467448)
                    }, 20); // important for Firefox

                    // grab and clear placeholder (TFS 472509)
                    tbx.placeholder = edt.placeholder;
                    edt.placeholder = '';

                    // empty the old/default editor content (TFS 332598)
                    edt.value = '';
                }
            }
        }
    }

    // validate mask when edit is ending (C1WEB-27592)
    _cellEditEnding() {
        let mp = this._maskProvider;
        if (mp && mp.mask) {
            mp._valueChanged();
        }
    }

    // hide and clear IME input after editing
    _cellEditEnded() {
        let tbx = this._tbx;
        tbx.value = ''; // hide suggestions now (no timeOut)
        wijmo.setCss(tbx, _ImeHandler._cssHidden);
        this._updateImeFocus(); // TFS 466707
    }

    // start editing in case the user types into the IME editor
    // without starting a composition (Romaji IOS kbd, TFS 340214)
    _keypress(e: KeyboardEvent) {
        if (!e.defaultPrevented && e.target == this._tbx) { // TFS 235852
            if (!e.ctrlKey && !e.altKey && !e.metaKey && e.keyCode != 27) { // TFS 409415, 431978
                if (!this._g.activeEditor) {
                    this._tbx.value = ''; // TFS 340214
                    this._compositionstart(e);
                    e.stopPropagation();
                }
            }
        }
    }
    
    // transfer focus from grid to IME input
    _updateImeFocus() {
        let g = this._g,
            tbx = this._tbx,
            ae = wijmo.getActiveElement(),
            tabIndex = g._getTabIndex(); // TFS 469249
        if (!g.activeEditor && //!this._isMouseDown && !g.isTouching && 
            wijmo.closest(ae, '.wj-flexgrid') == g.hostElement) { // rather than containsFocus: TFS 238106
            if (this._enableIme()) {
                if (ae != tbx) {
                    if (g.activeCell) { // TFS 469249
                        g.activeCell.tabIndex = -1;
                    }
                    tbx.tabIndex = tabIndex;
                    tbx.disabled = false;
                    tbx.value = '';
                    wijmo.setSelectionRange(tbx, 0); // WJM-19938
                    tbx.focus();
                }

                // apply column mask to IME handler (C1WEB-27592)
                let sel = g._selHdl.selection;
                let col = sel.isValid
                    ? g._getBindingColumn(g.cells, sel.row, g.columns[sel.col])
                    : null;
                this._maskProvider.mask = col ? col.mask : null;

            } else {
                tbx.tabIndex = -1;
                tbx.disabled = true;
                tbx.value = '';

                // transfer focus to the active cell/grid only if tbx contains the focus (WJM-20179)
                if (ae == tbx) { 
                    tbx.blur(); // remove focus from disabled tbx (important in Firefox: TFS 456690)

                    // make sure the active cell/grid still have the focus (TFS 400841, 469249)
                    let ac = g.activeCell;
                    if (ac) {
                        ac.tabIndex = tabIndex;
                        ac.focus();
                    } else {
                        g.focus();
                    }
                }
            }
        }
    }

    // transfer focus from grid to IME input debounced
    _updateImeFocusAsync() {
        if (this._toFocus) {
            clearTimeout(this._toFocus);
        }
        this._toFocus = setTimeout(() => {
            this._toFocus = null;
            this._updateImeFocus();
        }, 100);
    }

    // checks whether IME should be enabled for the current selection
    _enableIme(): boolean {
        let g = this._g,
            sel = g._selHdl.selection;

        // can't edit? can't use IME
        if (!g.canEditCell(sel.row, sel.col)) {
            return false;
        }

        // disable IME for boolean cells (with checkboxes), 
        // cells with editors, and cells with radio maps
        let col = sel.isValid
            ? g._getBindingColumn(g.cells, sel.row, g.columns[sel.col])
            : null;
        if (!col || col.editor || col.dataType == wijmo.DataType.Boolean) {
            return false;
        }
        if (col && col.dataMap && col.dataMapEditor == DataMapEditor.RadioButtons) { // TFS 469405
            return false;
        }

        // seems OK to use IME
        return true;
    }
    //#endregion
}
    }
    


    module wijmo.grid {
    





'use strict';

/**
 * Manages the new row template used to add rows to the grid.
 */
export class _AddNewHandler {
    protected _g: FlexGrid;
    protected _nrt = new _NewRowTemplate();
    protected _top = false;
    protected _keydownBnd = this._keydown.bind(this);
    protected _committing = false;

    /**
     * Initializes a new instance of the {@link _AddNewHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _AddNewHandler}.
     */
    constructor(g: FlexGrid) {
        this._g = g;
        this._attach();
    }

    /**
     * Gets or sets a value that indicates whether the new row template 
     * should be located at the top of the grid or at the bottom.
     */
    get newRowAtTop(): boolean {
        return this._top;
    }
    set newRowAtTop(value: boolean) {
        if (value != this.newRowAtTop) {
            this._top = wijmo.asBoolean(value);
            this.updateNewRowTemplate();

            // make sure the selection makes sense (TFS 402714)
            let g = this._g;
            if (this._top && g.selectionMode == SelectionMode.ListBox) {
                g.rows.forEach((row, index) => {
                    row._setFlag(RowColFlags.Selected, index == 0, true);
                });
                g.select(0, g.selection.col);
            }
        }
    }
    /**
     * Updates the new row template to ensure it's visible only if the 
     * grid is bound to a data source that supports adding new items, 
     * and that it is in the right position.
     */
    updateNewRowTemplate() {

        // get variables
        let g = this._g,
            ecv = g.editableCollectionView,
            rows = g.rows,
            nrt = this._nrt;

        // see if we need a new row template
        let needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;

        // get current template index
        let index = rows.indexOf(nrt),
            newRowPos = this._top ? 0 : rows.length - 1,
            insert = false;

        // add/remove template
        if (!needTemplate && index > -1) { // not needed but present, remove it
            let sel = g.selection; // move selection away from the row being deleted
            if (sel.row == index) {
                g.select(sel.row - 1, sel.col);
            }
            rows.removeAt(index);
        } else if (needTemplate) {
            if (index < 0) { // needed but not present, add it now
                insert = true;
            } else if (index != newRowPos) { // needed but in wrong position, remove and re-insert
                rows.removeAt(index);
                insert = true;
            }

            // add the new row template at the proper position
            if (insert) {
                if (this._top) {
                    rows.insert(0, nrt);
                } else {
                    rows.push(nrt);
                }
            }

            // make sure the new row template is not collapsed or selected
            if (nrt) {
                nrt._ubv = null; // clear unbound values just in case
                nrt._setFlag(RowColFlags.ParentCollapsed, false);
                if (!this._top || g.selectionMode != SelectionMode.ListBox) { // TFS 369493
                    nrt._setFlag(RowColFlags.Selected, false);
                }
            }
        }
    }

    // ** implementation

    // add/remove handlers to manage the new row template
    /*protected*/ _attach() {
        let g = this._g;
        if (g) {
            g.beginningEdit.addHandler(this._beginningEdit, this);
            g.pastingCell.addHandler(this._beginningEdit, this);
            g.rowEditEnded.addHandler(this._rowEditEnded, this);
            g.loadedRows.addHandler(this.updateNewRowTemplate, this);
            g.hostElement.addEventListener('keydown', this._keydownBnd, true);
        }
    }
    /*protected*/ _detach() {
        let g = this._g;
        if (g) {
            g.beginningEdit.removeHandler(this._beginningEdit);
            g.pastingCell.removeHandler(this._beginningEdit);
            g.rowEditEnded.removeHandler(this._rowEditEnded);
            g.loadedRows.removeHandler(this.updateNewRowTemplate);
            g.hostElement.removeEventListener('keydown', this._keydownBnd, true);
        }
    }

    // cancel new row at top addition on Escape (same as new row at bottom)
    /*protected*/ _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented && e.keyCode == wijmo.Key.Escape) {
            if (this._g.activeEditor == null && this._top && this._nrt.dataItem) {
                this._nrt.dataItem = null;
                this._g.invalidate();
            }
        }
    }

    // beginning edit, add new item if necessary
    /*protected*/ _beginningEdit(s: FlexGrid, e: CellRangeEventArgs) {
        if (!e.cancel) {
            let row = s.rows[e.row];
            if (row instanceof _NewRowTemplate) {
                let ecv = s.editableCollectionView;
                if (ecv && ecv.canAddNew) {

                    // add new row at the top
                    if (this._top) {
                        if (this._nrt.dataItem == null) {

                            // create new item
                            let newItem = null,
                                src = ecv.sourceCollection,
                                creator = ecv['newItemCreator'];
                            if (wijmo.isFunction(creator)) {
                                newItem = creator();
                            } else if (src && src.length) {
                                newItem = new src[0].constructor();
                            } else {
                                newItem = {};
                            }

                            // assign new item to new row template
                            this._nrt.dataItem = newItem;
                        }

                        // add new row at the bottom (TFS 145498)
                    } else {
                        let newItem = (ecv.currentAddItem && ecv.currentAddItem == row.dataItem)
                            ? ecv.currentAddItem
                            : ecv.addNew();
                        ecv.moveCurrentTo(newItem);

                        // update template
                        let wasSelected = this._nrt.isSelected;
                        this.updateNewRowTemplate();

                        // keep the new row selected
                        if (wasSelected && e.row > -1) {
                            s.rows[e.row].isSelected = true;
                        }

                        // update now to ensure the editor will get a fresh layout (TFS 96705, 467664)
                        if (!s.isUpdating) {
                            s.refresh(true);
                        }

                        // fire row added event (user can customize the new row or cancel)
                        if (!s.onRowAdded(e)) {
                            ecv.cancelNew();
                        }
                    }
                }
            }
        }
    }

    // row has been edited, commit if this is the new row
    /*protected*/ _rowEditEnded(s: FlexGrid, e: CellRangeEventArgs) {
        let ecv = s.editableCollectionView,
            item = this._nrt.dataItem;
        if (ecv && !this._committing) { // TFS 334675 (committing)

            // adding at the bottom
            if (ecv.isAddingNew) {
                ecv.commitNew();

            // adding at the top
            } else if (item && !e.cancel) {
                this._committing = true;

                // clear row template data
                this._nrt.dataItem = null;

                // add new item to collection view
                let newItem = ecv.addNew();
                for (let k in item) {
                    newItem[k] = item[k];
                }

                // fire row added event (user can customize the new row or cancel)
                if (s.onRowAdded(e)) {
                    ecv.commitNew();
                } else {
                    ecv.cancelNew();
                }

                // move selection back to new row template
                setTimeout(() => {
                    s.select(0, s.columns.firstVisibleIndex);
                    this.updateNewRowTemplate(); // needed when adding the first row
                }, 20);
                this._committing = false;
            }
        }
    }
}

/**
 * Represents a row template used to add items to the source collection.
 */
export class _NewRowTemplate extends Row {
}
    }
    


    module wijmo.grid {
    






'use strict';

/**
 * Specifies constants that define which areas of the grid support cell merging.
 */
export enum AllowMerging {
    /** No merging. */
    None = 0,
    /** Merge scrollable cells. */
    Cells = 1,
    /** Merge column headers. */
    ColumnHeaders = 2,
    /** Merge row headers. */
    RowHeaders = 4,
    /** Merge column and row headers. */
    AllHeaders = ColumnHeaders | RowHeaders,
    /** Merge all areas. */
    All = Cells | AllHeaders
}

/**
 * Defines the {@link FlexGrid}'s cell merging behavior.
 *
 * An instance of this class is automatically created and assigned to 
 * the grid's {@link FlexGrid.mergeManager} property to implement the
 * grid's default merging behavior. 
 *
 * If you want to customize the default merging behavior, create a class 
 * that derives from {@link MergeManager} and override the {@link getMergedRange}
 * method.
 */
export class MergeManager {

    /**
     * Initializes a new instance of the {@link MergeManager} class.
     * 
     * @param grid FlexGrid that owns this {@link MergeManager}.
     * This parameter is optional and deprecated. Please don't use it.
     */
    constructor(grid?: FlexGrid) {
        if (grid != null) {
            console.error('** WARNING: the "grid" parameter has been deprecated. Please remove it.');
        }
    }

    /**
     * Gets a {@link CellRange} that specifies the merged extent of a cell
     * in a {@link GridPanel}.
     *
     * @param p The {@link GridPanel} that contains the range.
     * @param r The index of the row that contains the cell.
     * @param c The index of the column that contains the cell.
     * @param clip Whether to clip the merged range to the grid's current view range.
     * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
     */
    getMergedRange(p: GridPanel, r: number, c: number, clip = true): CellRange | null {
        let g = p.grid,
            ct = p.cellType,
            cols = p.columns,
            rows = p.rows,
            row = rows[r],
            col = cols[c];

        // no merging in new row template (TFS 82235)
        if (row instanceof _NewRowTemplate) {
            return null;
        }

        // sanity (TFS 441236)
        if (!(row instanceof Row) || !(col instanceof Column)) {
            return null;
        }

        // merge cells in column group headers
        if (p == g.columnHeaders) {
            let grp = g._getColumnGroup(r, c);
            if (grp) {

                // get the range from the group
                let rng = grp._rng,
                    cols = p.columns;

                // account for frozen columns
                if (cols.isFrozen(rng.col) != cols.isFrozen(rng.col2)) {
                    rng = rng.clone();
                    if (cols.isFrozen(c)) {
                        rng.col2 = cols.frozen - 1;
                    } else {
                        rng.col = cols.frozen;
                    }
                }

                // done
                return rng;
            }
        }

        // merge cells in group rows
        if (g.showGroups && !g.childItemsPath) {
            if (row instanceof GroupRow &&
                row.dataItem instanceof wijmo.collections.CollectionViewGroup &&
                ct == CellType.Cell) {
                let rng = new CellRange(r, c);

                // expand left and right preserving aggregates
                if (col.aggregate == wijmo.Aggregate.None) {
                    while (rng.col > 0 &&
                        cols[rng.col - 1].aggregate == wijmo.Aggregate.None &&
                        rng.col != cols.frozen) {
                        rng.col--;
                    }
                    while (rng.col2 < cols.length - 1 &&
                        cols[rng.col2 + 1].aggregate == wijmo.Aggregate.None &&
                        rng.col2 + 1 != cols.frozen) {
                        rng.col2++;
                    }
                }

                // don't start range with invisible columns
                while (rng.col < c && !cols[rng.col].visible) {
                    rng.col++;
                }

                // return merged range
                return rng.isSingleCell ? null : rng;
            }
        }

        // honor grid's allowMerging setting
        let done = false,
            allowMerging = AllowMerging,
            CT = CellType;
        switch (g.allowMerging) {
            case allowMerging.None:
                done = true;
                break;
            case allowMerging.Cells:
                done = ct != CT.Cell;
                break;
            case allowMerging.ColumnHeaders:
                done = ct != CT.ColumnHeader && ct != CT.TopLeft;
                break;
            case allowMerging.RowHeaders:
                done = ct != CT.RowHeader && ct != CT.TopLeft;
                break;
            case allowMerging.AllHeaders:
                done = ct == CT.Cell;
                break;
        }
        if (done) {
            return null;
        }

        // no merging on items being added (TFS 455440)
        if (ct == CT.Cell) {
            let ecv = g.editableCollectionView,
                addItem = ecv ? ecv.currentAddItem : null;
            if (addItem && row.dataItem == addItem) {
                return null;
            }
        }

        // merge up and down columns
        if (cols[c].allowMerging) {

            // clip to current (buffered) viewRange
            let rng = new CellRange(r, c),
                vrng = p._vrb, // panel's buffered view range
                rMin = 0,
                rMax = rows.length - 1;
            if (r >= rows.frozen) {
                if (clip && (ct == CellType.Cell || ct == CellType.RowHeader)) {
                    if (g._vtRows < rows.length && vrng) { // TFS 394806
                        rMin = vrng.topRow;
                        rMax = vrng.bottomRow;
                    }
                }
            } else if (rows.length > rows.frozen) { // TFS 396562
                rMax = rows.frozen - 1;
            }

            // expand up and down
            for (let tr = r - 1; tr >= rMin && this._mergeCell(p, tr, c, r, c); tr--) {
                rng.row = tr;
            }
            for (let br = r + 1; br <= rMax && this._mergeCell(p, r, c, br, c); br++) {
                rng.row2 = br;
            }

            // don't start range with invisible rows
            while (rng.row < r && !rows[rng.row].visible) {
                rng.row++;
            }

            // done
            if (!rng.isSingleCell) {
                return rng;
            }
        }

        // merge left and right along rows
        if (rows[r].allowMerging) {

            // clip to current (buffered) viewRange
            let rng = new CellRange(r, c),
                vrng = p._vrb, // panel's buffered view range
                cMin = 0,
                cMax = cols.length - 1;
            if (c >= cols.frozen) {
                if (clip && (ct == CellType.Cell || ct == CellType.ColumnHeader)) {
                    if (g._vtCols < cols.length && vrng) { // TFS 394806
                        cMin = vrng.leftCol;
                        cMax = vrng.rightCol;
                    }
                }
            } else {
                cMax = cols.frozen - 1;
            }

            // expand left and right
            for (let cl = c - 1; cl >= cMin && this._mergeCell(p, r, cl, r, c); cl--) {
                rng.col = cl;
            }
            for (let cr = c + 1; cr <= cMax && this._mergeCell(p, r, c, r, cr); cr++) {
                rng.col2 = cr;
            }

            // don't start range with invisible columns
            while (rng.col < c && !cols[rng.col].visible) {
                rng.col++;
            }

            // done
            if (!rng.isSingleCell) {
                return rng;
            }
        }

        // no merging...
        return null;
    }

    // check whether two cells should be merged
    private _mergeCell(p: GridPanel, r1: number, c1: number, r2: number, c2: number) {

        // make sure the rows are still there (TFS 454562)
        let row1 = p.rows[r1],
            row2 = p.rows[r2];
        if (!row1 || !row2) {
            return false;
        }

        // group rows and new row templates are handled separately
        if (row1 instanceof GroupRow || row1 instanceof _NewRowTemplate ||
            row2 instanceof GroupRow || row2 instanceof _NewRowTemplate) {
            return false;
        }

        // no merging on items being added (TFS 455440)
        let ecv = p.grid.editableCollectionView,
            newItem = ecv ? ecv.currentAddItem : null;
        if (newItem) {
            if (row1.dataItem == newItem || row2.dataItem == newItem) {
                return false;
            }
        }
        
        // no merging across frozen boundaries
        if (r1 != r2 && p.rows.isFrozen(r1) != p.rows.isFrozen(r2)) {
            return false;
        }
        if (c1 != c2 && p.columns.isFrozen(c1) != p.columns.isFrozen(c2)) {
            return false;
        }

        // no vertical merging if the range is already merged horizontally
        if (r1 != r2) {
            if (c1 > 0) {
                if ((row1.allowMerging && this._mergeCell(p, r1, c1 - 1, r1, c1)) ||
                    (row2.allowMerging && this._mergeCell(p, r2, c1 - 1, r2, c1))) {
                    return false;
                }
            }
            if (c2 < p.columns.length - 1) {
                if ((row1.allowMerging && this._mergeCell(p, r1, c2, r1, c2 + 1)) ||
                    (row2.allowMerging && this._mergeCell(p, r2, c2, r2, c2 + 1))) {
                    return false;
                }
            }
        }

        // no merging if the data is different
        if (p.getCellData(r1, c1, true) != p.getCellData(r2, c2, true)) {
            return false;
        }

        // OK to merge
        return true;
    }
}
    }
    


    module wijmo.grid {
    






'use strict';

/**
 * Contains information about the part of a {@link FlexGrid} control
 * at a given position on the page.
 */
export class HitTestInfo {
    _g: FlexGrid;
    _p: GridPanel;
    _pt: wijmo.Point;
    _target: Element;
    _row = -1;
    _col = -1;
    _rng: CellRange;
    _edge = 0; // left, top, right, bottom, far-right, far-bottom: 1, 2, 4, 8, 16, 32
    static _SZEDGE = [6, 30]; // distance to cell border (mouse, touch)

    /**
     * Initializes a new instance of the {@link wijmo.grid.HitTestInfo} class.
     *
     * @param grid The {@link FlexGrid} control, {@link GridPanel}, or cell element
     * to investigate.
     * @param pt The {@link Point} object in page coordinates to investigate.
     */
    constructor(grid: any, pt: any) {
        let g: FlexGrid;

        // get cell info from cell element in pt parameter (e.g. hitTest(grid, cell))
        if (pt instanceof Element) {
            if (wijmo.closest(pt, '.wj-flexgrid') == grid.hostElement) {
                grid = pt;
                this._target = pt;
            } else {
                return; // unknown/disposed element, return and don't throw (TFS 323666)
            }
        }

        // get cell info from cell element in grid parameter (e.g. hitTest(cell, null))
        //if (grid instanceof Element) { // TFS 261310
        // AlexI: in WebComponents grid is FlexGrid and Element at the same time, so 
        // an additional check is needed
        if (grid instanceof Element && !(grid instanceof FlexGrid)) { // TFS 261310
            let cell = wijmo.closest(grid, '.wj-cell'),
                index = cell ? cell[GridPanel._INDEX_KEY] : null;
            if (index) {
                this._target = grid;
                this._row = index.row;
                this._col = index.col;
                this._rng = index.rng;
                this._p = index.panel;
                this._g = index.panel.grid;
            }
            return;
        }

        // get owner grid
        if (grid instanceof FlexGrid) {
            this._target = grid.hostElement;
            g = this._g = grid;
        } else if (grid instanceof GridPanel) {
            this._target = grid.hostElement;
            this._p = grid;
            g = this._g = this._p.grid;
        } else {
            throw 'First parameter should be a FlexGrid or GridPanel.';
        }

        // save target when creating from mouse event
        if (pt instanceof MouseEvent) {
            this._target = pt.target as Element;
            if (pt.type == 'mousedown') { // reset control bounds on mousedown just to be sure
                g._rcBounds = null;
            }
        }

        // get the hit-test point in page coordinates
        pt = wijmo.mouseToPage(pt);
        this._pt = pt.clone();

        // get the variables we need
        let rc = g.controlRect,
            sz = g._szClient,
            tlp = g.topLeftCells,
            etl = g._eTL,
            hdrVis = g.headersVisibility,
            hve = HeadersVisibility,
            tlWid = (hdrVis & hve.Row) ? tlp.columns.getTotalSize() : 0,
            tlHei = (hdrVis & hve.Column) ? tlp.rows.getTotalSize() : 0,
            tlHeiSticky = (hdrVis & hve.Column) ? tlHei + etl.offsetTop : 0,
            ebl = g._eBL,
            blHei = ebl.offsetHeight;

        // convert page to control coordinates (TFS 229880)
        pt.x -= rc.left;
        pt.y -= rc.top;

        // account for right to left
        if (g.rightToLeft) {
            pt.x = rc.width - pt.x;
        }

        // find out which panel was clicked
        if (!this._p) {
            if (pt.x >= 0 && pt.y >= etl.offsetTop) {
                if (sz && pt.x <= sz.width + tlWid && pt.y <= sz.height + tlHei) { // TFS 396185
                    if (pt.y < tlHeiSticky) { // TFS 269954
                        this._p = pt.x < tlWid ? g.topLeftCells : g.columnHeaders;
                    } else if (pt.y < ebl.offsetTop) {
                        this._p = pt.x < tlWid ? g.rowHeaders : g.cells;
                    } else {
                        this._p = pt.x < tlWid ? g.bottomLeftCells : g.columnFooters;
                    }
                }
            }
        }

        // if we have a panel, get the coordinates
        if (this._p != null) {

            // account for frozen rows/cols
            let rows = this._p.rows,
                cols = this._p.columns,
                ct = this._p.cellType,
                cte = CellType,
                ptFrz = this._p._getFrozenPos(),
                totHei = (ct == cte.TopLeft || ct == cte.ColumnHeader) ? tlHei :
                    (ct == cte.BottomLeft || ct == cte.ColumnFooter) ? blHei :
                    rows.getTotalSize(),
                totWid = (ct == cte.TopLeft || ct == cte.BottomLeft || ct == cte.RowHeader)
                    ? tlWid
                    : cols.getTotalSize();

            // adjust y for scrolling/freezing
            if (ct == cte.RowHeader || ct == cte.Cell) {
                pt.y -= tlHei; // discount header height without 'stickiness'
                if (pt.y > ptFrz.y || ptFrz.y <= 0) {
                    pt.y -= g._ptScrl.y;
                    pt.y += this._p._getOffsetY(); // account for IE's CSS limitations...
                }
            } else if (ct == cte.BottomLeft || ct == cte.ColumnFooter) {
                pt.y -= ebl.offsetTop;
            }

            // adjust x for scrolling/freezing
            if (ct == cte.ColumnHeader || ct == cte.Cell || ct == cte.ColumnFooter) {
                pt.x -= tlWid;
                if (pt.x > ptFrz.x || ptFrz.x <= 0) {
                    pt.x -= g._ptScrl.x;
                }
            }

            // enable mouse operations while in "sticky" mode
            if (ct == cte.ColumnHeader || ct == cte.TopLeft) {
                pt.y -= (tlHeiSticky - tlHei);
            }

            // get edge size (larger if touching)
            this._edge = 0;
            let szEdge = HitTestInfo._SZEDGE[this._g.isTouching ? 1 : 0];
            if (this._g.isTouching) {
                szEdge = HitTestInfo._SZEDGE[1];
                pt.x -= szEdge / 2;
            }

            // get row and column
            this._row = pt.y > totHei ? -1 : rows.getItemAt(pt.y);
            this._col = pt.x > totWid ? -1 : cols.getItemAt(pt.x);
            if (this._row < 0 || this._col < 0) {
                this._p = null;
                return;
            }

            // get edges
            if (this._col > -1) {
                let col = cols[this._col];
                if (pt.x - col.pos <= szEdge) {
                    this._edge |= 1; // left
                }
                let offRight = col.pos + col.renderSize - pt.x;
                if (offRight <= szEdge) {
                    this._edge |= 4; // right
                    if (offRight <= szEdge / 2) {
                        this._edge |= 16; // far right
                    }
                }
            }
            if (this._row > -1) {
                let row = rows[this._row];
                if (pt.y - row.pos <= szEdge) {
                    this._edge |= 2; // top
                }
                let offBottom = row.pos + row.renderSize - pt.y;
                if (offBottom <= szEdge) {
                    this._edge |= 8; // bottom
                    if (offBottom <= szEdge / 2) {
                        this._edge |= 32; // far bottom
                    }
                }
            }
        }

        // check coordinates since calculations aren't 100% accurate when pinch-zooming...
        // REVIEW: does this make sense? maybe we should fix this in the mouseToPage method instead?
        // BAD IDEA: TFS 355590
        //if (!(this._edge & 8) && mouseEvent instanceof MouseEvent) {
        //    let cell = closest(mouseEvent.target, '.wj-cell'),
        //        index = cell ? cell[GridPanel._INDEX_KEY] : null;
        //    if (index && !index.rng && index.panel == this._p && this._row != index.row) {
        //        this._row = index.row;
        //    }
        //}
    }
    /**
     * Gets the point in control coordinates that this {@link wijmo.grid.HitTestInfo} refers to.
     */
    get point(): wijmo.Point {
        return this._pt;
    }
    /**
     * Gets the type of cell found at the specified position.
     */
    get cellType(): CellType {
        return this._p ? this._p.cellType : CellType.None;
    }
    /**
     * Gets the {@link GridPanel} that this {@link HitTestInfo} refers to.
     */
    get panel(): GridPanel {
        return this._p;
    }
    /**
     * Gets the {@link FlexGrid} that this {@link HitTestInfo} refers to.
     */
    get grid(): FlexGrid {
        return this._p ? this._p.grid : null;
    }
    /**
     * Gets the index of the row at the specified position.
     * 
     * To get the {@link Row} object, use the {@link getRow} method.
     */
    get row(): number {
        return this._row;
    }
    /**
     * Gets the {@link Row} object object at the specified position.
     * 
     * To get the row index, use the {@link row} property.
     */
    getRow(): Row {
        return this._p && this._row > -1
            ? this._p.rows[this._row]
            : null;
    }
    /**
     * Gets the index of the column at the specified position.
     * 
     * To get the {@link Column} object, use the {@link getColumn} method.
     */
    get col(): number {
        return this._col;
    }
    /**
     * Gets the {@link Column} object at the specified position.
     * 
     * To get the column index, use the {@link col} property.
     * 
     * @param binding Whether to get the column by index or by binding.
     * This parameter only makes a difference in grids that have multiple 
     * rows per data item (like the {@link MultiRow} grid).
     */
    getColumn(binding?: boolean): Column {
        let p = this._p,
            col = p && this._col > -1 ? p.columns[this._col] : null;
        if (col && binding) {
            // get column group for column header, and binding column otherwise
            let g = p.grid;
            if (p.cellType === CellType.ColumnHeader && g._hasColumnGroups()) {
                col = g._getColumnGroup(this._row, this._col);
            } else {
                col = g._getBindingColumn(p, this._row, col);
            }
        }
        return col;
    }
    /**
     * Gets the cell range at the specified position.
     */
    get range(): CellRange {
        if (!this._rng) {
            this._rng = new CellRange(this._row, this._col); // no merging
            //this._rng = this._g.getMergedRange(this._p, this._row, this._col, false); // more correct?
        }
        return this._rng;
    }
    /**
     * Gets a value that indicates whether the mouse is near the left edge of the cell.
     */
    get edgeLeft(): boolean {
        return (this._edge & 1) != 0;
    }
    /**
     * Gets a value that indicates whether the mouse is near the top edge of the cell.
     */
    get edgeTop(): boolean {
        return (this._edge & 2) != 0;
    }
    /**
     * Gets a value that indicates whether the mouse is near the right edge of the cell.
     */
    get edgeRight(): boolean {
        return (this._edge & 4) != 0;
    }
    /**
     * Gets a value that indicates whether the mouse is very near the right edge of the cell.
     */
    get edgeFarRight(): boolean {
        return (this._edge & 16) != 0;
    }
    /**
     * Gets a value that indicates whether the mouse is near the bottom edge of the cell.
     */
    get edgeBottom(): boolean {
        return (this._edge & 8) != 0;
    }
    /**
     * Gets a value that indicates whether the mouse is very near the bottom edge of the cell.
     */
    get edgeFarBottom(): boolean {
        return (this._edge & 32) != 0;
    }
    /**
     * Gets the target element used to create this {@link HitTestInfo}.
     */
    get target(): Element {
        return this._target;
    }
}
    }
    


    module wijmo.grid {
    


export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}

    }
    


    module wijmo.grid {
    

// Soft reference to common-input











'use strict';

// key used to store the active editor's mask provider (C1WEB-27592)
const _MASK_PROVIDER = '$WJ-MSKP';

/**
 * Creates HTML elements that represent cells within a {@link FlexGrid} control.
 */
export class CellFactory {
    static _WJC_RADIOMAP = 'wj-radio-map'; // internal/default radio buttons
    static _WJC_CHECKBOX = 'wj-cell-check'; // internal/default checkbox
    static _WJC_COLLAPSE = 'wj-elem-collapse';
    static _WJC_DROPDOWN = 'wj-elem-dropdown';
    static _WJC_PIN = 'wj-elem-pin';
    static _ddBtn: HTMLElement;
    static _tplDdBtn = _getButton(CellFactory._WJC_DROPDOWN, 'down');
    static _tplCtx: ICellTemplateContext = {
        row: null,      // Row object
        col: null,      // Column object
        value: null,    // raw data value
        text: null,     // formatted/mapped display value
        item: null,     // data item
    };
    static _fmtItemArgs: FormatItemEventArgs;
        
    /**
     * Creates or updates a cell in the grid.
     *
     * @param p The {@link GridPanel} that contains the cell.
     * @param r The index of the row that contains the cell.
     * @param c The index of the column that contains the cell.
     * @param cell The element that represents the cell.
     * @param rng The {@link CellRange} object that contains the cell's 
     * merged range, or null if the cell is not merged.
     * @param updateContent Whether to update the cell's content as
     * well as its position and style.
     */
    public updateCell(p: GridPanel, r: number, c: number, cell: HTMLElement, rng?: CellRange, updateContent?: boolean) {
        let g = p.grid,
            rtl = g.rightToLeft,
            rows = p.rows,
            cols = p.columns,
            row = rows[r],
            col = cols[c],
            r2 = r,
            c2 = c,
            gr = (row instanceof GroupRow ? row : null) as GroupRow,
            nr = (row instanceof _NewRowTemplate ? row : null) as _NewRowTemplate,
            cellWidth = col.renderWidth,
            cellHeight = row.renderHeight,
            cellType = p.cellType,
            cl = 'wj-cell',
            clAlign = '',
            css: any = { display: '' },
            CT = CellType;

        // clear cells that have child elements before re-using them
        // this is a workaround for a bug in IE that affects templates
        // strangely, setting the cell's innerHTML to '' doesn't help...
        if (updateContent != false && cell.firstElementChild) {
            if (cell.childNodes.length != 1 || (cell.firstElementChild as HTMLInputElement).type != 'checkbox') {
                cell.textContent = '';
            }
        }

        // adjust for merged ranges
        if (rng && !rng.isSingleCell) {
            r = rng.row;
            c = rng.col;
            r2 = rng.row2;
            c2 = rng.col2;
            row = rows[r];
            col = cols[c];
            gr = row instanceof GroupRow ? row : null;
            let sz = rng.getRenderSize(p);
            cellHeight = sz.height;
            cellWidth = sz.width;
        }

        // get column to use for binding (usually the same as col, but not on MultiRow)
        let bCol = g._getBindingColumn(p, r, col);

        // get cell data type, data map
        let dataType = bCol.dataType || row.dataType,
            cellMap = bCol.dataMap || row.dataMap, // TFS 371431
            cellMapEditor = cellType == CT.Cell // TFS 421449
                ? g._getMapEditor(row, bCol)
                : null,
            tplOK = cellType == CT.RowHeader ||
                (cellType == CT.Cell && (!gr || g.childItemsPath)), // cellTemplate OK in tree grids (TFS 433631)
            isRadio = tplOK && cellMapEditor == DataMapEditor.RadioButtons,
            isCheckBox = dataType == wijmo.DataType.Boolean && !cellMap,
            isHtml = bCol.isContentHtml || row.isContentHtml;

        // get cell position accounting for frozen rows/columns
        // cloned frozen cells are hosted in a fixed div, so adjust the position for that
        // other cells are hosted remain in the cells div, so adjust for that instead
        // NOTE: using r2/c2 to detect cells that *end* in the scrollable area (see row details, TFS 334758)
        let cPos = col.pos,
            rPos = row.pos,
            ptScrl = g._ptScrl;
        if (g._useFrozenDiv() && cellType == CT.Cell && !g.editRange) {
            if (c < cols.frozen && r2 >= rows.frozen) { // col frozen, row not frozen
                rPos += ptScrl.y;
            } else if (r < rows.frozen && c2 >= cols.frozen) { // row frozen, col not frozen
                cPos += ptScrl.x;
            }
        } else { // frozen/non-cloned cells: remove the scroll position
            let sz = g._szClient;
            if (r2 < rows.frozen) {
                rPos = Math.min(rPos, sz.height); // frozen rows fill viewport: TFS 444259
                cellHeight = Math.min(cellHeight, Math.max(0, sz.height - rPos));
                rPos -= ptScrl.y;
            }
            if (c2 < cols.frozen) {
                cPos = Math.min(cPos, sz.width); // frozen cols fill viewport: TFS 444259
                cellWidth = Math.min(cellWidth, Math.max(0, sz.width - cPos));
                cPos -= ptScrl.x;
            }
        }

        // size and position
        if (rtl) {
            css.right = cPos + 'px';
        } else {
            css.left = cPos + 'px';
        }
        if (r2 >= rows.frozen) { // TFS 401989
            rPos -= p._getOffsetY();
        }
        css.top = rPos + 'px'; 
        css.width = cellWidth + 'px';
        css.height = cellHeight + 'px';

        // set z-index for frozen cells in all panels
        // (we're rendering in natural order for accessibility)
        css.zIndex = '';
        if (r < rows.frozen || c < cols.frozen) {
            css.zIndex = (r < rows.frozen && c < cols.frozen) ? 2 : 1;
        }

        // alternating rows
        let altRow = false,
            altStep = g.alternatingRowStep;
        if (altStep) {
            if (!rng || (rng.row == rng.row2)) { // TFS 247024
                altRow = row.visibleIndex % (altStep + 1) == 0;
                if (altStep == 1) altRow = !altRow; // compatibility
            }
        }

        // selector classes that only apply to regular cells
        if (cellType == CT.Cell) {
            if (gr) {
                cl += ' wj-group';
            }
            if (altRow) {
                cl += ' wj-alt';
            }
            if (r < rows.frozen || c < cols.frozen) {
                cl += ' wj-frozen';
            }
            if (nr) {
                cl += ' wj-new';
            }
            if (row.cssClass) {
                cl += ' ' + row.cssClass;
            }
            if (bCol.cssClass) { // also apply to group rows (TFS 372776)
                cl += ' ' + bCol.cssClass;
            }
        } else {

            // header cells
            cl += ' wj-header';
            if (altRow) {
                cl += ' wj-header-alt';
            }

            // apply row's cssClass to column headers (not to row headers)
            if (row.cssClass && cellType == CT.ColumnHeader) {
                cl += ' ' + row.cssClass;
            }

            // apply column's cssClass to row headers (not to column headers)
            if (bCol.cssClass && cellType == CT.RowHeader) {
                cl += ' ' + bCol.cssClass;
            }

            // add big header style to indicate next row/column has zero size (TFS 408939)
            let bigHeader = false;
            if (cellType == CT.ColumnHeader || cellType == CT.TopLeft) {
                if (g.allowResizing & AllowResizing.Columns) {
                    bigHeader = g._mouseHdl._getResizeCol(p, c2) != null;
                }
            }
            if (!bigHeader && (cellType == CT.RowHeader)) {// || cellType == CT.TopLeft)) {
                if (g.allowResizing & AllowResizing.Rows) {
                    bigHeader = g._mouseHdl._getResizeRow(p, r2) != null;
                }
            }
            if (bigHeader) {
                cl += ' wj-big-header';
            }
        }

        // selector classes that apply to all cells
        if (row.cssClassAll) {
            cl += ' ' + row.cssClassAll;
        }
        if (bCol.cssClassAll) { // also apply to group rows (TFS 372776)
            cl += ' ' + bCol.cssClassAll;
        }

        // selected state
        let ss = SelectedState,
            selState = p.getSelectedState(r, c, rng);
        if (selState != ss.None &&                          // selected states don't apply to
            cellType == CT.Cell && !isCheckBox &&           // scrollable cells without checkboxes
            g.editRange && g.editRange.contains(r, c)) {    // in edit mode
            selState = ss.None;
        }
        switch (selState) {
            case ss.Active:
                cl += ' wj-state-active';
                break;
            case ss.Cursor:
                cl += ' wj-state-selected wj-state-active';
                break;
            case ss.Selected:
                cl += ' wj-state-multi-selected';
                break;
        }

        // frozen area boundary (TFS 367631)
        if (r2 == rows._lastFrozen) {
            cl += ' wj-frozen-row';
        }
        if (c2 == cols._lastFrozen) {
            cl += ' wj-frozen-col';
        }

        // word-wrapping
        if (bCol.wordWrap || row.wordWrap) {
            cl += ' wj-wrap';
        }

        // multi-line
        if (bCol.multiLine || row.multiLine) {
            cl += ' wj-multiline';
        }

        // alignment (in CSS)
        let align = bCol.getAlignment(row);
        if (align) {
            clAlign = ' wj-align-' + align;
        }

        // override to honor column group header alignment

        let ct = cellType,
            isTrn = g._isTransposed(),
            checkColGroup = ct == CT.ColumnHeader && !isTrn || ct == CT.RowHeader && isTrn,
            colGroup = checkColGroup && g._hasColumnGroups() ? g._getColumnGroup(r, c) : null;
        if (colGroup && colGroup.align) {
            clAlign = ' wj-align-' + colGroup.align;
        }

        // padding (TFS 229194)
        css.paddingLeft = css.paddingRight = css.paddingTop = css.paddingBottom = '';

        // group row indentation
        if (cellType == CT.Cell) {
            if (g.rows.maxGroupLevel > -1) {
                if (c == cols.firstVisibleIndex && g.treeIndent) {
                    let level = gr ? Math.max(0, gr.level) : (rows.maxGroupLevel + 1),
                        indent = Math.min(
                            g.treeIndent * level + g._cellPadLeft, // regular indent
                            cellWidth - g._cellPadHorz // not wider than the cell (TFS 406820, 404275)
                        ) + 'px';
                    if (rtl) {
                        css.paddingRight = indent;
                    } else {
                        css.paddingLeft = indent;
                    }
                }
            }
        }

        // remove padding from skinny cells
        // (unless we're measuring the cell: TFS 462542)
        if (cellWidth <= g._cellPadHorz) {
            if (cell.getAttribute(FlexGrid._WJS_MEASURE) == null) {
                css.paddingLeft = css.paddingRight = 0;
            }
        }

        // group header cells align to the left
        let isGroupHeader = cellType == CT.Cell && c == cols.firstVisibleIndex &&
                gr && gr.hasChildren && !_isEditingCell(g, r, c);
        if (isGroupHeader) {
            clAlign = '';
        }

        // cell content
        if (updateContent != false) {
            let data = p.getCellData(r, c, false),
                content = p.getCellData(r, c, true) as string;

            if (isGroupHeader) {

                // collapse/expand outline
                let btn = _getTreeBtn(gr);
                content = gr.getGroupHeader() || wijmo.escapeHtml(content); // TFS 462202, 466716
                cell.innerHTML = btn.outerHTML + ' ' + content;

            } else if (cellType == CT.ColumnHeader && (r2 == g._getSortRowIndex() || bCol != col)) {

                // add text content
                cell.innerHTML = wijmo.escapeHtml(content);

                // add sort class, icon
                let currentSort = bCol.currentSort;
                if (currentSort && g.showSort) {
                    cl += ' wj-sort-' + (currentSort == '+' ? 'asc' : 'desc');
                    cell.innerHTML += '&nbsp;' + _getSortGlyph(bCol);
                }

                // add pin icon (if cell is hosted by the grid: TFS 399517)
                if (g.allowPinning && wijmo.contains(g.hostElement, cell)) {
                    _addPinButton(cell, c < g.frozenColumns);
                }

            //} else if (cellType == CT.RowHeader && !content) {
            // We use immediately called inline function here to determine
            // if the cell content has been really changed. If not, its content
            // will be updated using the default "else" logic of this "if". (WJM-20049)
            } else if (cellType == CT.RowHeader && !content && (() => {
                let changed = false;

                // edit/new item template indicators (TFS 470241)
                if (c == g._getEditColumnIndex()) {
                    let ecv = g.editableCollectionView,
                        editItem = ecv ? ecv.currentEditItem : null;
                    content = cell.innerHTML = // TFS 470241
                        (editItem && row.dataItem == editItem) ? _getGlyph('pencil') : // item being edited
                        (row instanceof _NewRowTemplate) ? _getGlyph('asterisk') : // new row template
                        ''; // nothing... // TFS 436311
                    changed = true;
                }

                // render cellTemplates in row headers
                let tpl = bCol._tpl;
                if (tpl) {
                    _renderTemplate(tpl, cell, data, content, row, bCol);
                    changed = true;
                }
                return changed;
            })()) {

            } else if (cellType == CT.Cell && dataType == wijmo.DataType.Boolean && !cellMap &&
                (!gr || wijmo.isBoolean(data))) { // TFS 122709

                // re-use/create checkbox
                let cb = cell.firstChild as HTMLInputElement;
                if (!g._isNativeCheckbox(cb)) {
                    cell.innerHTML = '<label>' +
                        '<input type="checkbox" class="' + CellFactory._WJC_CHECKBOX + '" tabindex="-1"/>' +
                        '<span></span>' + 
                        '</label>'; // TFS 430282, 431787
                    cb = cell.querySelector('input');
                }

                // initialize/update checkbox value
                wijmo.setChecked(cb, data);

                // disable checkbox if it is not editable (so user can't click it)
                cb.disabled = !g.canEditCell(r, c);
                if (cb.disabled) {
                    cb.style.cursor = 'default';
                }

                // assign editor to grid
                if (g.editRange && g.editRange.contains(r, c)) {
                    g._edtHdl._edt = cb;
                }

            } else if (cellType == CT.Cell && !isRadio && _isEditingCell(g, r, c)) { // TFS 424941

                // select input type (important for mobile devices)
                let inputType = bCol.inputType || row.inputType;
                if (!inputType) {
                    inputType = dataType == wijmo.DataType.Number && !cellMap ? 'tel' : 'text';
                }

                // get editor value (use full precision when editing floating point values)
                // this is pretty tricky: TFS 123276, 134218, 135336, 250306, 456234
                if (!cellMap && !bCol.mask && !row.mask) {
                    let val = p.getCellData(r, c, false) as number;
                    if (wijmo.isNumber(val)) {
                        content = _getEditString(val, bCol.format || row.format);
                    }
                }

                // create/initialize editor
                cell.innerHTML = (bCol.multiLine || row.multiLine) && inputType != 'checkbox'
                    ? '<textarea wrap="soft"></textarea>'
                    : '<input type="' + inputType + '"/>';
                let edt = cell.children[0] as HTMLInputElement;
                wijmo.addClass(edt, 'wj-grid-editor wj-form-control');
                wijmo.disableAutoComplete(edt);

                // if editing data-mapped entries with HTML content, 
                // show plain text in the editor (TFS 276472)
                if (isHtml && cellMap && !cellMap.isEditable) {
                    content = wijmo.toPlainText(content);
                }

                edt.value = content; // TFS 467110
                edt.tabIndex = -1;
                edt.required = bCol.getIsRequired(row);
                wijmo.setAttribute(edt, 'aria-required', edt.required);
                let maxLength = bCol.maxLength || row.maxLength;
                if (maxLength) {
                    edt.maxLength = maxLength;
                }
                edt.style.textAlign = bCol.getAlignment(row); // right-align numbers when editing

                // apply mask, if any
                let mask = bCol.mask || row.mask;
                if (mask) {
                    edt[_MASK_PROVIDER] = new wijmo._MaskProvider(edt, mask);
                }

                // add placeholder if required
                if (g.showPlaceholders) {
                    edt.placeholder = bCol.header;
                }

                // assign editor to grid
                g._edtHdl._edt = edt;

            } else {
                
                // render radio buttons (in data cells)
                if (isRadio) {
                    let options = [],
                        cellValue = p.getCellData(r, c, false);
                    cellMap.getDisplayValues(row.dataItem).forEach((val) => {
                        let checked = cellMap.getKeyValue(val) == cellValue ? ' checked' : '',
                            disabled = (g.isReadOnly || row.isReadOnly || col.isReadOnly) ? ' disabled' : '',
                            value = wijmo.escapeHtml(val);
                        options.push('<label>' +
                            '<input type="radio" tabindex="-1"' + checked + disabled + 
                                ' value="' + value + '">' + // save button value: WJM-19439
                            '<span>' + value + '</span>' + // TFS 430282
                            '</label>');
                    });
                    cell.innerHTML = options.join(' ');
                    cl += ' ' + CellFactory._WJC_RADIOMAP;
                }

                // render template and regular content
                let tpl = tplOK ? bCol._tpl : null;
                if (tpl) { // cell template
                    _renderTemplate(tpl, cell, data, content, row, bCol);
                } else if (!isRadio) { // no template (TFS 469873)
                    if (cellType == CT.Cell && isHtml) {
                        cell.innerHTML = content; // HTML content
                    } else {
                        cell.textContent = content || ''; // regular text
                    }
                }

                // add collapse/expand icons to collapsible group headers
                if (colGroup && colGroup.collapseTo) {
                    let rng = colGroup._rng;
                    if (rng) {
                        if ((cellType == CT.ColumnHeader && rng.columnSpan > 1) ||
                            (cellType == CT.RowHeader && rng.rowSpan > 1)) { // make sure we have columns/rows to collapse
                            let collapsed = colGroup.isCollapsed;
                            cell.innerHTML = '<div role="button" class="' + CellFactory._WJC_COLLAPSE + '">' +
                                    _getGlyph(collapsed ? 'plus' : 'minus') +
                                '</div>&nbsp;' + cell.innerHTML;
                            if (collapsed) {
                                wijmo.addClass(cell, 'wj-state-collapsed');
                            }
                        }
                    }
                }
            }

            // show map editor drop-down button
            if (cellMapEditor == DataMapEditor.DropDownList) {
                if (g.showDropDown && g.canEditCell(r, c) && softInput()) {

                    // append to cell (last child, TFS 323622, 323934, 325997)
                    let dd = _getDropDownBtn();
                    cell.insertBefore(dd, cell.firstChild); // first child, float right
                    //cell.appendChild(dd);

                    // if the editor is active, mark the cell so we can remove the ellipses
                    if (_isEditingCell(g, r, c)) {
                        cl += ' wj-hasdropdown';
                    }
                }
            }
        }

        // make row/col headers draggable
        if (cellType == CT.RowHeader || cellType == CT.ColumnHeader) {
            let draggable = cellType == CT.RowHeader
                ? !gr && !nr && row.allowDragging && (g.allowDragging & AllowDragging.Rows) != 0
                : (colGroup || col).allowDragging && (g.allowDragging & AllowDragging.Columns) != 0;

            // override to honor column group allowDragging
            // if (colGroup) {
            //     draggable = colGroup.allowDragging;
            // }

            wijmo.setAttribute(cell, 'draggable', draggable ? 'true' : null);
        }

        // apply class list to cell
        cl += clAlign;
        if (cell.className != cl) {
            cell.className = cl;
        }

        // apply style to cell
        // setCss(cell, css); // ** in-lining for performance **
        let style = cell.style;
        for (let k in css) {
            if (style[k] !== css[k]) { // optimization: important in IE/Edge
                style[k] = css[k];
            }
        }

        // clip editor to client area (TFS 279553, 245830)
        if (g._edtHdl._edt && g._edtHdl._edt.parentElement == cell) {
            let root = g._root,
                rcRoot = root.getBoundingClientRect(),
                rcCell = cell.getBoundingClientRect(),
                maxHei = rcRoot.top + root.clientHeight - rcCell.top,
                maxWid = rcRoot.left + root.clientWidth - rcCell.left;
            if (rcCell.height > maxHei) {
                cell.style.height = maxHei + 'px';
            }
            if (rcCell.width > maxWid) {
                cell.style.width = maxWid + 'px';
            }
        }

        // validation
        if (cellType == CT.Cell || cellType == CT.RowHeader) {
            if (g._getShowErrors()) {
                let error = g._getError(p, r, c, false);
                g._edtHdl._setCellError(cell, error);
            }
        }

        // customize the cell
        if (g.itemFormatter) {
            g.itemFormatter(p, r, c, cell);
        }
        if (g.formatItem.hasHandlers) {
            let e = CellFactory._fmtItemArgs; // avoid creating a FormatItemEventArgs each time
            if (!e) {
                e = CellFactory._fmtItemArgs = new FormatItemEventArgs(p, new CellRange(r, c, r2, c2), cell);
            } else {
                e._p = p;
                e._rng.setRange(r, c, r2, c2);
                e._cell = cell;
            }
            e._updateContent = (updateContent !== false);
            g.onFormatItem(e);
        }
    }
    /**
     * Disposes of a cell element and releases all resources associated with it.
     *
     * @param cell The element that represents the cell.
     */
    public disposeCell(cell: HTMLElement) {
        // no action needed for standard cells...
    }
    /**
     * Gets the value of the editor currently being used.
     *
     * @param g {@link FlexGrid} that owns the editor.
     */
    public getEditorValue(g: FlexGrid): any {
        let hdl = g._edtHdl,
            edt = hdl._edt as any;
        
        // handle checkboxes and radio buttons
        if (edt instanceof HTMLInputElement) {
            switch (edt.type) {
                case 'checkbox':
                    return edt.checked;
                case 'radio':
                    return edt.value;
            }
        }

        // handle text
        if (edt instanceof HTMLInputElement || edt instanceof HTMLTextAreaElement) {
            let maskProvider = edt[_MASK_PROVIDER] as wijmo._MaskProvider,
                value = maskProvider ? maskProvider._applyMask() : edt.value, // IME masked input: C1WEB-27592
                maxLen = edt.maxLength; // needed when editing IME: TFS 291896
            if (wijmo.isNumber(maxLen) && maxLen > -1 && value.length > maxLen) {
                let pct = wijmo.culture.Globalize.numberFormat['%'] || '%',
                    hadPct = value.length && value[value.length - 1] == pct; // TFS 467208
                value = value.substr(0, maxLen);
                if (hadPct && value.indexOf(pct) < 0) {
                    value += pct;
                }
            }
            return value;
        }

        // nothing...
        return null;
    }
}

// ** helper functions

function _renderTemplate(tpl: string | ICellTemplateFunction, cell: HTMLElement, data: any, content: string, row: Row, col: Column) {
    let ctx = CellFactory._tplCtx; // re-using template scope
    ctx.value = data;
    ctx.text = content;
    ctx.item = row.dataItem;
    ctx.row = row;
    ctx.col = col;
    let html = wijmo.isString(tpl)
        ? wijmo.evalTemplate(tpl as string, ctx)
        : (tpl as ICellTemplateFunction)(ctx, cell);
    if (html != null) { // TFS 421954
        cell.innerHTML = html;
    }
}

// gets an edit string for a number (preserve some formatting, full precision)
function _getEditString(val: number, fmt: string): string {
    fmt = fmt || 'n'; // make sure there's a format
    let fmtInfo = wijmo.Globalize._parseNumericFormat(fmt)
    switch (fmtInfo.spec) {

        // decimal, hex: no changes
        case 'd':
        case 'x':
            break;
        
        // scientific notation: full precision
        case 'e':
            fmt = fmt.replace(/[0-9]/g, '');
            break;
        
        // other formats: full precision
        default:

            // format the value using precentage or round-trip formats
            fmt = fmtInfo.spec == 'p'
                ? 'P15' // percentage, no thousand separators
                : 'r'; // roundtrip

            // preserve scaling
            if (fmtInfo.scale) {
                fmt += Array(fmtInfo.scale / 3 + 1).join(',');
            }
    }
    return wijmo.Globalize.formatNumber(val, fmt, true);
}

// determines whether the grid is currently editing a cell
function _isEditingCell(g: FlexGrid, r: number, c: number): boolean {
    return g.editRange && g.editRange.contains(r, c);
}

// gets the drop-down list button
function _getDropDownBtn(): HTMLButtonElement {
    let btn = CellFactory._ddBtn;
    if (!btn) { // create a single icon, clone it later
        btn = CellFactory._ddBtn = wijmo.createElement(CellFactory._tplDdBtn);
        wijmo.setAriaLabel(btn, wijmo.culture.FlexGrid.ariaLabels.toggleDropDown);
        wijmo.setAttribute(btn, 'aria-expanded', false);
    }
    return btn.cloneNode(true) as HTMLButtonElement;
}

// add pin button to column header cells
function _addPinButton(cell: HTMLElement, pinned: boolean) {
    let tpl = _getButton(CellFactory._WJC_PIN, 'pin'),
        btn = wijmo.createElement(tpl);
    wijmo.toggleClass(btn, 'wj-state-pinned', pinned);
    wijmo.setAttribute(btn, 'aria-pressed', pinned);
    cell.insertBefore(btn, cell.firstChild); // first child, float right
    //cell.appendChild(btn);
}

// get an element to create a sort up/down icon
function _getSortGlyph(col: Column): string {
    let glyph = _getGlyph(col.currentSort == '+' ? 'up' : 'down'),
        view = col.grid.collectionView;
    if (view && view.sortDescriptions.length > 1) { // add numbers only if we have more than one sort
        let index = col.currentSortIndex;
        if (index > -1) {
            glyph += '<span class="wj-sort-index">' + (index + 1) + '</span>';
        }
    }
    return glyph;
}

// gets the group row collapse/expand button
function _getTreeBtn(gr: GroupRow): HTMLButtonElement {
    let cls = CellFactory._WJC_COLLAPSE,
        glyph = (gr.isCollapsed ? '' : 'down-') + (gr.grid.rightToLeft ? 'left' : 'right'),
        btn = wijmo.createElement(
            '<button class="wj-btn wj-btn-glyph ' + cls + '" type="button" tabindex="-1">' +
            _getGlyph(glyph) +
            '</button>') as HTMLButtonElement;
    wijmo.setAriaLabel(btn, wijmo.culture.FlexGrid.ariaLabels.toggleGroup);
    wijmo.setAttribute(btn, 'aria-expanded', !gr.isCollapsed);
    return btn;
}

// gets a string that represents a span glyph
function _getGlyph(glyphName: string) : string {
    return '<span class="wj-glyph-' + glyphName + '"></span>'
}

// gets a string that represents a right-aligned button with a class and a glyph
function _getButton(cls: string, glyph: string): string {
    return '<button class="wj-btn wj-btn-glyph wj-right {cls}" type="button" tabindex="-1">{glyph}</button>'
        .replace('{cls}', cls)
        .replace('{glyph}', _getGlyph(glyph));
}

    }
    


    module wijmo.grid {
    

// Soft reference to common-input














'use strict';

const _LB_PAGE_SIZE = 4; // items per page on drop-down listbox

/**
 * Handles the grid's editing.
 */
export class _EditHandler {
    _g: FlexGrid; // owner grid
    _rng: CellRange = null; // range being edited
    _edt: HTMLInputElement = null; // editor element
    _edtValue: string; // to raise input events (set in keyboard handler)
    _edItem: any = null; // item being edited
    _edtCanceled = false; // remember if the last edit was canceled (WJM-19439)
    _lbx: wijmo.input.ListBox; // drop-down list editor
    _list = null; // drop-down list items
    _fullEdit = false; // full edit mode
    _evtInput: any = null;
    _evtChange: any = null;
    _cstEdtValue: any = null;
    _validating = false;

    // browser-localized error messages
    static _msgRequired = '';
    static _msgBadInput = '';

    /**
     * Initializes a new instance of the {@link _EditHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _EditHandler}.
     */
    constructor(g: FlexGrid) {
        this._g = g;

        // to raise input event when selecting from ListBox
        this._evtInput = document.createEvent('HTMLEvents');
        this._evtInput.initEvent('input', true, false);

        // to raise change event when starting quick edit
        this._evtChange = document.createEvent('HTMLEvents');
        this._evtChange.initEvent('change', true, false);

        // finish editing when selection changes (commit row edits if row changed)
        g.selectionChanging.addHandler((s, e: CellRangeEventArgs) => {
            if (this.finishEditing()) {
                let oldRow = g._selHdl.selection.row;
                if (oldRow != e.row) {
                    let len = g.rows.length,
                        oldItem = oldRow > -1 && oldRow < len ? g.rows[oldRow].dataItem : null,
                        newItem = e.row > -1 && e.row < len ? g.rows[e.row].dataItem : null;
                    if (oldItem != newItem) {
                        this._commitRowEdits();
                    }
                }
            } else {
                e.cancel = true; // staying in edit mode, keep selection
            }
        });

        // commit row edits when losing focus
        g.lostFocus.addHandler(() => {
            let ae = wijmo.getActiveElement(); // TFS 121877, 122033 Bootstrap modal issue
            if (!ae || getComputedStyle(ae).position != 'fixed') {
                this._commitRowEdits();
            } else {
                this.finishEditing();
            }
        });

        // commit edits when clicking non-cells (e.g. sort, drag, resize),
        // start editing when clicking on checkboxes
        let host = g.hostElement;
        g.addEventListener(host, 'mousedown', (e) => {

            // start actions on left button only: TFS 114623
            if (e.defaultPrevented || e.button != 0) {
                return;
            }

            // not while resizing...
            if (g._mouseHdl._szRowCol) {
                return;
            }

            // finish editing when clicking on headers (to select/sort/drag)
            let ht = g.hitTest(e);
            if (ht.cellType != CellType.Cell && ht.cellType != CellType.None) {
                if (!this.finishEditing()) { // finish and commit edits
                    this.finishEditing(true); // failed? finish and cancel edits
                }
            }
        }, true);

        // support auto-complete on compositionend (IME enabled)
        g.addEventListener(host, 'compositionend', this._keypress.bind(this));
    }

    /**
     * Starts editing a given cell.
     *
     * @param fullEdit Whether to stay in edit mode when the user presses the cursor keys. Defaults to false.
     * @param r Index of the row to be edited. Defaults to the currently selected row.
     * @param c Index, name, or binding of the column to be edited. Defaults to the currently selected column.
     * @param focus Whether to give the editor the focus. Defaults to true.
     * @param evt Event that triggered this action (usually a keypress or keydown).
     * @return True if the edit operation started successfully.
     */
    startEditing(fullEdit = true, r?: number, c?: number | string, focus?: boolean, evt?: any): boolean {

        // default row/col to current selection
        let g = this._g,
            sel = g._selHdl.selection;
        r = wijmo.asNumber(r, true, true);
        c = wijmo.isString(c) ? g.columns.indexOf(c) : wijmo.asNumber(c, true, true);
        if (r == null) {
            r = sel.row;
        }
        if (c == null) {
            c = sel.col;
        }

        // default focus to true
        if (focus == null) {
            focus = true;
        }

        // check that the cell is editable
        if (!this._allowEdit(r, c)) {
            return false;
        }

        // get edit range
        let rng = g.getMergedRange(g.cells, r, c, false);
        if (!rng) {
            rng = new CellRange(r, c);
        }

        // get item to be edited
        let item = g.rows[r].dataItem;

        // update scroll position now (TFS 335910)
        g.scrollIntoView(rng.row, rng.col, true);

        // make sure cell is selected
        if (!g.select(rng, true)) {
            return false;
        }

        // check that we still have the same item after moving the selection (TFS 110143)
        if (!g.rows[r] || item != g.rows[r].dataItem) {
            return false;
        }

        // already editing?
        if (this.activeEditor) {
            if (rng.equals(this._rng)) { // same cell, no work
                return true;
            }
            if (!this.finishEditing()) { // different cell, finish if possible
                return false;
            }
        }

        // start editing cell
        let e = new CellRangeEventArgs(g.cells, rng, evt);
        if (!g.onBeginningEdit(e)) {
            return false;
        }

        // start editing item
        let ecv = g.editableCollectionView,
            itemEditStarting = false;
        if (ecv) {
            item = g.rows[r].dataItem;
            itemEditStarting = item != ecv.currentEditItem;
            if (itemEditStarting) {
                g.onRowEditStarting(e);
            }
            ecv.editItem(item);
            if (itemEditStarting) {
                g.onRowEditStarted(e);
                this._edItem = item;
            }
        }

        // start editing data-mapped radio row/columns without an editor
        let row = g.rows[r],
            bCol = g._getBindingColumn(g.cells, r, g.columns[c]), // TFS 317434
            map = bCol.dataMap || row.dataMap,
            radioBtns = DataMapEditor.RadioButtons,
            radioMap = (row.dataMap && row.dataMapEditor == radioBtns) ||
                (bCol.dataMap && bCol.dataMapEditor == radioBtns);

        // save editing parameters
        this._fullEdit = wijmo.asBoolean(fullEdit);
        this._rng = rng;
        this._list = null;
        if (map && !radioMap && !bCol.editor) { // TFS 456025
            let list = map.getDisplayValues(item);
            if (bCol.isContentHtml || row.isContentHtml) { // TFS 276472
                list = list.map(item => wijmo.toPlainText(item));
            }
            this._list = list;
        }

        // create (or get) editor
        if (radioMap) {
            let edtCell = g._activeCell || g.hostElement.querySelector('.wj-cell.wj-state-active');
            if (edtCell) {
                let target = evt ? evt.target : null;
                if (target instanceof HTMLSpanElement) {
                    target = wijmo.closest(target, 'label');
                }
                if (target instanceof HTMLLabelElement) {
                    target = target.querySelector('input');
                }
                this._edt = target instanceof HTMLInputElement
                    ? target // editor is the input that was clicked: WJM-19439
                    : edtCell.querySelector('input') as HTMLInputElement; // fall back on first input in the map
                this._updateRowHeaderCell(r); // TFS 419702
            }
        } else if (rng.isSingleCell) {
            this._updateEditorCell(r, c, itemEditStarting);
        } else {
            g.refresh(false);
        }

        // initialize editor
        let edt = this._edt;
        if (edt) {

            // prepare cell for edit
            if (edt.type == 'checkbox' || edt.type == 'radio') {
                this._fullEdit = false; // no full edit on checkboxes or radio buttons...
            } else if (focus) {

                // handle percentages consistently (TFS 273043)
                let selStart = 0,
                    selEnd = edt.value.length,
                    isPct = false,
                    pct = wijmo.culture.Globalize.numberFormat['%'] || '%',
                    cellValue = g.getCellData(r, c, false);

                // add percent sign to null/new cells
                if (wijmo.isNumber(cellValue)) {
                    isPct = edt.value.indexOf(pct) > -1;
                } else if (cellValue == null) { // TFS 284522
                    isPct = /^p/i.test(bCol.format);
                    if (isPct && edt.value.indexOf(pct) < 0) {
                        edt.value += pct;
                    }
                }

                // validate selection of percentage values
                if (isPct) {
                    let val = edt.value;
                    selStart = 0;
                    selEnd = val.length;
                    while (selEnd > 0 && (val[selEnd - 1] == pct || val[selEnd - 1] == ' ')) {
                        selEnd--;
                    }
                    while (selStart < selEnd && val[selStart] == pct) {
                        selStart++;
                    }
                }

                // move cursor to end when starting edit with the space bar
                if (evt && evt.type == 'keydown' && evt.keyCode == wijmo.Key.Space) {
                    selStart = selEnd;
                }

                // apply selection to editor
                wijmo.setSelectionRange(edt, selStart, selEnd);

                // keep cursor visible in right-aligned editors/IE (TFS 362955, 334675)
                if (wijmo.isIE() && edt.style.textAlign == 'right') {
                    edt.style.paddingRight = '1px';
                }
            }

            // prepare cell for edit
            g.onPrepareCellForEdit(e);
        }

        // make sure grid has the focus even if the editor is disabled (TFS 467564)
        if (focus && !g.containsFocus()) {
            g.focus();
        }

        // done
        return edt != null && !edt.disabled && !edt.readOnly;
    }
    /**
     * Commits any pending edits and exits edit mode.
     *
     * @param cancel Whether pending edits should be canceled or committed.
     * @return True if the edit operation finished successfully.
     */
    finishEditing(cancel?: boolean): boolean {

        // make sure we're editing
        let edt = this._edt;
        if (!edt) {
            this._removeListBox();
            return true;
        }

        // get parameters
        let g = this._g,
            rng = this._rng,
            e = new CellEditEndingEventArgs(g.cells, rng),
            focus = g.containsFocus();

        // commit changes to focused custom editors TFS 229139, 203106
        if (!cancel) {
            let cstEdtHost = g.hostElement.querySelector('.wj-control.wj-state-focused');
            if (cstEdtHost) {
                let cstEdt = wijmo.Control.getControl(cstEdtHost);
                if (cstEdt && cstEdt.containsFocus()) {
                    cstEdt.onLostFocus(e);
                }
            }
        }

        // validate edits
        e.cancel = cancel;
        if (!cancel && g.validateEdits) {
            let error = this._getValidationError();
            if (error) {
                e.cancel = true;
                let cell = g.cells.getCellElement(rng.row, rng.col); // to work with IME editor (TFS 467435)
                //let cell = closest(edt, '.wj-cell') as HTMLElement;
                if (cell) {
                    this._setCellError(cell, error);
                    e.stayInEditMode = true;
                }
            }
        }

        // clear custom editor value
        // (it will be set in the cellEditEnding event handler)
        this._cstEdtValue = null;

        // save original value so user can check it in the cellEditEnding/Ended events
        e.data = g.cells.getCellData(rng.topRow, rng.leftCol, false);

        // stay in edit mode if validation fails and stayInEditMode is true
        if (!g.onCellEditEnding(e) && e.stayInEditMode) {
            if (focus) { // grid has focus, let it finish before focusing on editor
                setTimeout(() => {
                    edt.select();
                });
            } else { // grid lost focus, get it back right away
                edt.select();
            }
            this._fullEdit = true;
            return false; // continue editing (in full-edit mode)
        }

        // apply edits
        if (!e.cancel) {

            // get editor value
            let cev = this._cstEdtValue,
                value = cev && !wijmo.isUndefined(cev.value)
                    ? cev.value
                    : g.cellFactory.getEditorValue(g);
            
            // apply value to the range
            for (let r = rng.topRow; r <= rng.bottomRow && r < g.rows.length; r++) {
                for (let c = rng.leftCol; c <= rng.rightCol && c < g.columns.length; c++) {
                    let bCol = g._getBindingColumn(g.cells, r, g.columns[c]),
                        row = g.rows[r],
                        map = bCol && bCol.dataMap || row && row.dataMap,
                        coerce = !map || map.serializeKeys, // WJM-20497, WJM-20498
                        parsed = g.cells.setCellData(r, c, value, coerce, false);
                    if (!parsed && g.validateEdits) {
                        let error = this._getValidationError(true);
                        if (error) {
                            e.cancel = true;
                            let cell = g.cells.getCellElement(rng.row, rng.col); // to work with IME editor (TFS 467435)
                            //let cell = closest(edt, '.wj-cell') as HTMLElement;
                            if (cell) {
                                this._setCellError(cell, error);
                                e.stayInEditMode = true;
                            }
                            return false; // continue editing (in full-edit mode)                        
                        }
                    }
                }
            }

            // to raise form change event even without user input (TFS 348666)
            if (edt.value == this._edtValue) {
                edt.dispatchEvent(this._evtChange);
            }
        }

        // dispose of editor
        this._edt = null;
        this._rng = null;
        this._list = null;
        this._edtValue = null;
        this._edtCanceled = e.cancel;
        this._removeListBox();

        // move focus from editor to cell if needed (265366)
        let cell = wijmo.closest(edt, '.wj-cell') as HTMLElement;
        if (wijmo.contains(cell, wijmo.getActiveElement())) {
            //cell.focus(); // TFS 434734
            g._setFocusNoScroll(cell);
        }

        // refresh to replace the editor with regular content
        if (e.cancel || !e.refresh || !g._refreshOnEdit) {
            this._updateEditorCell(rng.row, rng.col, false);
        } else {
            g.refresh(false);
        }

        // restore focus
        if (focus) {
            g.focus();
        }

        // edit ended
        g.onCellEditEnded(e);

        // done
        return true;
    }

    // set custom editor value
    _setCustomEditorValue(value: any) {
        this._cstEdtValue = {
            value: value
        }
    }

    // set cell error state and tooltip/title
    _setCellError(cell: HTMLElement, error: string) {
        let g = this._g;

        // empty string means no error
        if (error == '') {
            error = null;
        }

        // update cell's invalid style
        wijmo.toggleClass(cell, 'wj-state-invalid', error != null);

        // add tooltip to cell
        let tip = g.errorTip,
            edt = g.activeEditor;
        if (tip) {
            tip.setTooltip(cell, error);
            if (edt && wijmo.contains(cell, edt)) { // hide editor's HTML error msg (TFS 458063)
                wijmo.setAttribute(edt, 'title', '');
            }
        } else {
            wijmo.setAttribute(cell, 'title', error); // no tip, use cell title
        }

        // add tooltip to IME editor as well (TFS 467435)
        if (edt && cell == g.activeCell && !wijmo.contains(cell, edt) && tip) {
            tip.setTooltip(edt, error);
        }
    }

    /**
     * Gets the **HTMLInputElement** that represents the cell editor currently active.
     */
    get activeEditor(): HTMLInputElement {
        return this._edt;
    }
    /**
     * Gets a {@link CellRange} that identifies the cell currently being edited.
     */
    get editRange(): CellRange {
        return this._rng;
    }
    /**
     * Gets the content of a {@link CellRange} as a string suitable for 
     * copying to the clipboard.
     *
     * Hidden rows and columns are not included in the clip string.
     *
     * @param rng {@link CellRange} to copy. If omitted, the current selection is used.
     * @param options {@link ClipStringOptions} that specifies options for the clip string
     * to be generated.
     * @param colHdrs Whether to include the column headers.
     * @param rowHdrs Whether to include the row headers.
     */
    getClipString(rng: CellRange, options: ClipStringOptions, colHdrs?: boolean, rowHdrs?: boolean): string {
        let g = this._g,
            selMode = g.selectionMode,
            clipRows = [],
            panel: GridPanel,
            csv = (options & ClipStringOptions.CSV) != 0,
            rowSep = csv ? '\r\n' : '\n',
            cellSep = csv ? ',' : '\t',
            allRows = (options & ClipStringOptions.InvisibleRows) != 0,
            SM = SelectionMode,
            customRange = rng != null; // TFS 465783

        // if no range was provided and some rows are selected, use ListBox mode
        if (!rng && selMode != SM.ListBox) {
            let rows = g.rows;
            for (let r = 0; r < rows.length; r++) {
                if (rows[r].isSelected) {
                    selMode = SM.ListBox;
                    break;
                }
            }
        }

        // get copy range
        if (!rng) {
            g._selHdl._expandSelection(); // account for merged cells (TFS 403490, 419086)
            rng = g.selection;
            switch (selMode) {
                case SM.Row:
                case SM.RowRange:
                case SM.ListBox:
                    rng.col = 0;
                    rng.col2 = g.columns.length - 1;
                    break;
                case SM.MultiRange:
                    let ranges = g.selectedRanges;
                    if (ranges.length > 1) {

                        // copy if selected rows or columns are all the same
                        let sameCols = this._sameCols(ranges),
                            sameRows = this._sameRows(ranges);
                        if (sameCols || sameRows) {

                            // sort ranges to copy
                            ranges = ranges.slice();
                            ranges.sort((rng1: CellRange, rng2: CellRange) => {
                                let cmp = rng1.topRow - rng2.topRow;
                                return cmp ? cmp : rng1.leftCol - rng2.leftCol;
                            });

                            // remove duplicate/contained ranges (TFS 422816)
                            for (let i = 0; i < ranges.length; i++) {
                                let rng = ranges[i];
                                for (let j = i + 1; j < ranges.length; j++) {
                                    if (rng.contains(ranges[j])) {
                                        ranges.splice(j, 1);
                                        j--;
                                    }
                                }
                            }

                            // same columns: stack clip strings
                            if (sameCols) {
                                let clipRanges = [];
                                ranges.forEach(rng => {
                                    clipRanges.push(this.getClipString(rng, options, colHdrs, rowHdrs));
                                    colHdrs = false;
                                });
                                return clipRanges.join(rowSep);
                            }

                            // same rows: parse rows into cells and append
                            if (sameRows) {
                                let rows: string[];
                                ranges.forEach(rng => {
                                    let rngRows = this.getClipString(rng, options, colHdrs, rowHdrs).split(rowSep); // store cells
                                    if (rows == null) {
                                        rows = rngRows;
                                        rowHdrs = false;
                                    } else {
                                        rngRows.forEach((cells, rowIndex) => {
                                            rows[rowIndex] += cellSep + cells;
                                        });
                                    }
                                });
                                return rows.join(rowSep);
                            }
                        }
                    }
                    break;
            }
        }

        // render column headers
        const isValidColRng = rng.col > -1 && rng.col2 > -1;
        if (colHdrs && isValidColRng) {
            panel = g.columnHeaders;
            panel.rows.forEach((row, i) => {
                if (allRows || row.isVisible) {
                    let rowString = this._getRowClipString(panel, i, rng, options, rowHdrs);
                    clipRows.push(rowString);
                }
            });
        }

        // render data cells
        const isValidRowRng = rng.row > -1 && rng.row2 > -1;
        if (isValidRowRng) {
            panel = g.cells;
            if (selMode == SM.ListBox && !customRange) { // TFS 465783
                panel.rows.forEach((row, i) => {
                    if (row.isSelected) {
                        if (allRows || row.isVisible) {
                            let rowString = this._getRowClipString(panel, i, rng, options, rowHdrs);
                            clipRows.push(rowString);
                        }
                    }
                });
            } else {
                wijmo.assert(rng.bottomRow < panel.rows.length, 'Row index must be less than the number of rows.');
                for (let i = rng.topRow; i <= rng.bottomRow; i++) {
                    if (allRows || panel.rows[i].isVisible) {
                        let rowString = this._getRowClipString(panel, i, rng, options, rowHdrs);
                        clipRows.push(rowString);
                    }
                }
            }
        }

        // done
        return clipRows.join(rowSep);
    }

    // get the clip string for a row
    _getRowClipString(p: GridPanel, r: number, rng: CellRange, options: ClipStringOptions, rh: boolean): string {
        let cells = [],
            row = p.rows[r],
            cso = ClipStringOptions,
            csv = (options & cso.CSV) != 0,
            allColumns = (options & cso.InvisibleColumns) != 0,
            formatted = (options & cso.Unformatted) == 0,
            skipMerged = (options & cso.SkipMerged) != 0;
        if (row.isVisible) {

            // render row header cells
            if (rh) {
                let ph = p.cellType == CellType.ColumnHeader
                    ? p.grid.topLeftCells // top left panel for column headers
                    : p.grid.rowHeaders; // row headers for cell panel
                for (let c = 0; c < ph.columns.length; c++) {
                    if (allColumns || ph.columns[c].isVisible) {
                        let data = ph.getCellData(r, c, true);
                        if (skipMerged && this._skipMergedCell(p, null, r, c)) {
                            data = '';
                        }
                        cells.push(this._getCellClipString(data, options));
                    }
                }
            }

            // render non-header row cells
            const isValidColRng = rng.col > -1 && rng.col2 > -1;
            if (isValidColRng) {
                wijmo.assert(rng.rightCol < p.columns.length, 'Column index must be less than the number of columns.');
                for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                    if (allColumns || p.columns[c].isVisible) {
                        let data = p.getCellData(r, c, formatted);
                        if (!data && row instanceof GroupRow && c == p.columns.firstVisibleIndex) {
                            data = wijmo.toPlainText(row.getGroupHeader()); // group row headers TFS 215405
                        }
                        if (skipMerged && this._skipMergedCell(p, null, r, c)) {
                            data = '';
                        }
                        cells.push(this._getCellClipString(data, options));
                    }
                }
            }
        }

        // all done
        return cells.join(csv ? ',' : '\t'); // TFS 386423
    }

    // check whether a cell has been merged over
    protected _skipMergedCell(p: GridPanel, rng: CellRange, r: number, c: number): boolean {
        let mrng = p.grid.getMergedRange(p, r, c, false);
        if (mrng) {
            if (rng) {
                mrng.row = Math.max(rng.topRow, mrng.row);
                mrng.col = Math.max(rng.leftCol, mrng.col);
            }
            if (mrng.row != r || mrng.col != c) {
                return true;
            }
        }
        return false;
    }

    // clean up cell content (tabs, new lines, double quotes TFS 243258, 394185)
    protected _getCellClipString(cell: any, options: ClipStringOptions): string {

        // convert cell parameter into string if necessary
        if (!wijmo.isString(cell)) {
            cell = wijmo.isDate(cell) ? cell.toJSON() : cell != null ? cell.toString() : '';
        }

        // no tabs
        cell = cell.replace(/\t/g, ' ');

        // add quotes if the user requested them
        let needQuote = (options & ClipStringOptions.QuoteAll) != 0;

        // or if the cell contains line breaks or starts or ends with a quote
        needQuote = needQuote || /\n|^"|"$/.test(cell);

        // or if the format is CSV and the cells contains a comma
        if (!needQuote && (options & ClipStringOptions.CSV) != 0) {
            needQuote = cell.indexOf(',') > -1; // contains comma in CSV
        }

        // if quotes are needed, double them and enclose
        if (needQuote) {
            cell = cell.replace(/"/g, '""');
            cell = '"' + cell + '"';
        }

        // all done
        return cell;
    }

    // checks whether a list of ranges all refer to the same rows
    _sameRows(ranges: CellRange[]): boolean {
        let rng = ranges[0];
        for (let i = 1; i < ranges.length; i++) {
            if (ranges[i].topRow != rng.topRow || ranges[i].bottomRow != rng.bottomRow) {
                return false;
            }
        }
        return true;
    }

    // checks whether a list of ranges all refer to the same columns
    _sameCols(ranges: CellRange[]): boolean {
        let rng = ranges[0];
        for (let i = 1; i < ranges.length; i++) {
            if (ranges[i].leftCol != rng.leftCol || ranges[i].rightCol != rng.rightCol) {
                return false;
            }
        }
        return true;
    }

    /**
     * Parses a string into rows and columns and applies the content to a given range.
     *
     * Hidden rows and columns are skipped.
     *
     * @param text Tab and newline delimited text to parse into the grid.
     * @param rng {@link CellRange} to use when pasting the data. If omitted, the current selection is used.
     */
    setClipString(text: string, rng?: CellRange) {
        let g = this._g,
            ecv = g.editableCollectionView;

        // get the paste range (taking selection mode into account)
        let autoRange = rng == null,
            SM = SelectionMode;
        if (autoRange) {
            g._selHdl._expandSelection(); // account for merged cells (TFS 429464)
            rng = g.selection;
            switch (g.selectionMode) {
                case SM.Row:
                case SM.RowRange:
                case SM.ListBox:
                    rng.col = 0;
                    rng.col2 = g.columns.length - 1;
                    break;
                case SM.MultiRange: // pasting into multiple ranges (TFS 418122)
                    let ranges = g.selectedRanges;
                    if (ranges.length > 1) {
                        if (ecv) ecv.beginUpdate();
                        ranges.forEach(rng => {
                            g.setClipString(text, rng);
                        });
                        if (ecv) ecv.endUpdate();
                        g.selectedRanges = ranges;
                        return;
                    }
                    break;
            }
        }
        rng = wijmo.asType(rng, CellRange);

        // parse clip string into cells
        let clipRows = this._parseClipString(wijmo.asString(text));
        if (!autoRange && clipRows.length > rng.rowSpan) {
            clipRows = clipRows.slice(0, rng.rowSpan);
        }

        // expand paste range (TFS 418122)
        this._expandClipRows(clipRows, rng);

        // compute paste range and raise pasting event
        let rngPaste = autoRange
            ? new CellRange(rng.topRow, rng.leftCol, rng.topRow + clipRows.length - 1, rng.leftCol + clipRows[0].length - 1)
            : rng;
        let e = new CellRangeEventArgs(g.cells, rngPaste, text);
        if (!g.onPasting(e)) {
            return false;
        }

        // shrink paste range back and expand as we paste
        rngPaste = new CellRange(rng.topRow, rng.leftCol);

        // initialize arguments for row edit events (TFS 467869)
        let rowArgs = new CellRangeEventArgs(g.cells, new CellRange(rng.topRow, -1));

        // copy lines to rows
        let pasted = false,
            addedRows = 0,
            r = rng.topRow,
            rows = g.rows,
            cols = g.columns,
            defer = this._deferPaste(rng, clipRows.length);
        g.deferUpdate(() => {

            // if pasting multiple rows, don't sort/filter until done
            let currPos = -1;
            if (ecv && defer) {
                currPos = ecv.currentPosition;
                ecv.beginUpdate();
            }
            
            // scan clip rows and copy the data to the grid cells
            for (let i = 0; i < clipRows.length && r < rows.length; i++, r++) {
                let row = rows[r];

                // skip invisible row, keep clip line
                if (!row.isVisible) {
                    i--;
                    continue;
                }

                // raise row edit start/end events (TFS 436396, 467869)
                let item = row.dataItem,
                    currItem = ecv ? ecv.currentEditItem : null;
                if (currItem && item != currItem) {
                    g.onRowEditEnding(rowArgs);
                    g.onRowEditEnded(rowArgs);
                }
                if (item != currItem) {
                    rowArgs._rng.setRange(r, -1); // TFS 467869
                    g.onRowEditStarting(rowArgs);
                    g.onRowEditStarted(rowArgs);
                }

                // add new items with deferred update (TFS 442466)
                if (row instanceof _NewRowTemplate && ecv) {
                    if (defer) {
                        row.dataItem = ecv.addNew();
                    }
                    rowArgs._rng.setRange(g.newRowAtTop ? 0 : r + addedRows, -1); // WJM-19443
                    g.onRowEditStarting(rowArgs);
                    g.onRowEditStarted(rowArgs);
                }

                // copy cells on this row
                let cells = clipRows[i],
                    colIndex = rng.leftCol;
                for (let j = 0; j < cells.length && colIndex < cols.length; j++, colIndex++) {

                    // skip invisible column, keep clip cell
                    let col = cols[colIndex] as Column;
                    if (!col.isVisible) {
                        j--;
                        continue;
                    }

                    // assign cell
                    if (this._allowEdit(r, colIndex)) {

                        // unquote multi-line cells (TFS 436396)
                        let cell = cells[j],
                            len = cell.length;
                        if (len > 1 && cell[0] == '"' && cell[len - 1] == '"' && cell.indexOf('\n') > -1) {
                            cell = cell.substr(1, len - 2);
                        }

                        // honor maxLength (TFS 318980)
                        let maxLen = col.maxLength || row.maxLength;
                        if (maxLen) {
                            cell = cell.substr(0, maxLen);
                        }

                        // raise events so user can cancel the paste
                        let eCell = new CellRangeEventArgs(g.cells, new CellRange(r + addedRows, colIndex), cell); // WJM-19443
                        if (g.onPastingCell(eCell)) {
                            if (ecv) {
                                ecv.editItem(item);
                                this._edItem = ecv.currentEditItem; // TFS 267863
                            }
                            let originalValue = g.getCellData(r, colIndex, false); // TFS 467554
                            if (g.setCellData(r, colIndex, eCell.data)) {
                                eCell.data = originalValue; // TFS 467554
                                g.onPastedCell(eCell);
                                pasted = true;
                            }
                        }

                        // update paste range
                        rngPaste.row2 = Math.max(rngPaste.row2, r + addedRows);
                        rngPaste.col2 = Math.max(rngPaste.col2, colIndex);
                    }
                }

                // notify (in case there are calculated properties that need updating, TFS 351087)
                if (this._edItem && ecv instanceof wijmo.collections.CollectionView) {
                    let e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, this._edItem, r);
                    ecv.onCollectionChanged(e);
                }

                // finish adding new items with deferred update (TFS 442466)
                if (row instanceof _NewRowTemplate && ecv && defer) {
                    row.dataItem = null;
                    if (pasted) { // TFS 456617
                        rowArgs._rng.setRange(g.newRowAtTop ? 0 : r + addedRows, -1); // WJM-19443
                        g.onRowEditEnding(rowArgs);
                        g.onRowEditEnded(rowArgs);
                        r--;
                        addedRows++;
                        ecv.commitNew();
                    } else {
                        ecv.cancelNew();
                    }
                }
            }

            // finish updating view
            if (ecv) {
                if (defer) {
                    if (ecv.currentEditItem) { // raise any missing RowEditEnd* events 
                        ecv.commitEdit();
                        g.onRowEditEnding(rowArgs);
                        g.onRowEditEnded(rowArgs);
                    }
                    ecv.moveCurrentToPosition(currPos); // restore cursor position (TFS 444887)
                    ecv.endUpdate(true); // restore sort/filter (forced: TFS 445196)
                } else {
                    let addItem = ecv.currentAddItem;
                    if (!addItem && rng.row == 0 && g.newRowAtTop) { // at top (not a cv item)
                        if (rows[0] instanceof _NewRowTemplate) {
                            addItem = rows[0].dataItem; // TFS 443892
                        }
                    }
                    if (addItem) { // start editing the new item
                        ecv.editItem(addItem);
                        this._edItem = addItem;
                    }
                }
            }

            // collapse range when pasting into new row at the top
            if (rngPaste.rowSpan > 1 && rngPaste.topRow == 0 && rows[0] instanceof _NewRowTemplate) {
                rngPaste.row = rngPaste.row2 = 0;
            }

            // select paste range
            g.select(rngPaste); //false); // TFS 472828
        });

        // raise pasted event
        g.onPasted(e);

        // raise 'change' event (in case the grid is hosted in a form, TFS 343377)
        // this is consistent with regular cell editing, which also raises 'change'
        if (pasted && wijmo.closest(g.hostElement, 'form')) {
            let evt = document.createEvent('HTMLEvents'),
                el = wijmo.createElement('<input>', g.hostElement) as HTMLInputElement;
            evt.initEvent('change', true, false);
            el.dispatchEvent(evt);
            wijmo.removeChild(el);
        }
    }

    // ** implementation

    // determine whether to defer cv updates while pasting
    _deferPaste(rng: CellRange, cnt: number): boolean {
        let rows = this._g.rows,
            len = rows.length;
        if (cnt > 1) { // multiple rows to paste
            if (len > 1 && rows[0].dataItem != rows[1].dataItem) {
                return true; // not a MultiRow, defer (TFS 444017)
            }
            if (len == 1 && rows[0] instanceof _NewRowTemplate) {
                return true; // adding at top, defer (TFS 457533)
            }
        }
        return false; // no need to defer
    }

    // break a string into rows and cells accounting for quoted breaks
    /*private*/ _parseClipString(text: string): string[][] {

        // replace \r\n with \n and \r with \n
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // trim trailing \n at the end of the string (TFS 348655)
        text = text.replace(/\n$/, '');

        // parse string into rows and cells
        let start = 0,
            end = 0,
            rows = [];
        for (start = 0; start < text.length; start++) {
            let quoted = text[start] == '"', // && text[start + 1] >= ' ', TFS 407514
                quoting = false,
                done = false;
            for (end = start; end < text.length && !done; end++) {
                let char = text[end];
                switch (char) {
                    case '"':
                        if (quoted) {
                            quoting = !quoting;
                        }
                        break;
                    case '\t':
                    case '\n':
                        if (!quoting) {
                            this._parseClipCell(rows, text, start, end, char == '\n');
                            start = end;
                            if (end == text.length - 1) {
                                start = end + 1; // empty cells at the end of the clip string (TFS 413110)
                            }
                            done = true;
                        }
                        break;
                }
            }

            // handle last cell
            if (end == text.length) {
                this._parseClipCell(rows, text, start, end, false);
                break;
            }
        }

        // handle empty strings (TFS 268282)
        if (rows.length == 0) {
            rows.push(['']);
        }

        // return parse results
        return rows;
    }
    private _parseClipCell(rows: string[][], text: string, start: number, end: number, newRow: boolean): void {

        // add first row if necessary
        if (!rows.length) {
            rows.push([]);
        }

        // get cell content
        let cell = text.substr(start, end - start),
            len = cell.length;
        if (len > 2 && cell[0] == '"' && cell[len - 1] == '"' && cell.indexOf('""') > -1) {
            cell = cell.substr(1, len - 2); // unquote
            cell = cell.replace(/""/g, '"'); // un-double
        } else if (cell == '\t') { // TFS 340737
            cell = '';
        }

        // append cell to last row
        rows[rows.length - 1].push(cell);

        // add new row
        if (newRow) {
            rows.push([]);
        }
    }

    // expand clip string to get Excel-like paste behavior
    /*private*/ _expandClipRows(rows: string[][], rng: CellRange) {

        // get clip string dimensions and cells
        let srcRows = rows.length,
            srcCols = 0;
        for (let i = 0; i < srcRows; i++) {
            srcCols = Math.max(srcCols, rows[i].length);;
        }

        // get destination size (visible rows/cols only, TFS 238478, 238479)
        let g = this._g,
            dstRows = 0,
            dstCols = 0;
        for (let r = rng.topRow; r <= rng.bottomRow; r++) {
            if (g.rows[r].isVisible) {
                dstRows++;
            }
        }
        for (let c = rng.leftCol; c <= rng.rightCol; c++) {
            if (g.columns[c].isVisible) {
                dstCols++;
            }
        }

        // expand if destination size is a multiple of source size (like Excel)
        if (dstRows > 1 || dstCols > 1) {
            if (dstRows == 1) dstRows = srcRows;
            if (dstCols == 1) dstCols = srcCols;
            if (dstCols % srcCols == 0 && dstRows % srcRows == 0) {

                // append columns
                for (let c = srcCols; c < dstCols; c++) {
                    for (let r = 0; r < srcRows; r++) {
                        rows[r].push(rows[r % srcRows][c % srcCols]);
                    }
                }

                // append rows
                for (let r = srcRows; r < dstRows; r++) {
                    rows.push(rows[r % srcRows]);
                }
            }
        }
    }

    // update the editor cell (when starting/finishing edits)
    private _updateEditorCell(r: number, c: number, updateHdr: boolean) {
        let g = this._g,
            edt = g.cells.getCellElement(r, c) as HTMLInputElement,
            frozen = g._useFrozenDiv() && (r < g.frozenRows || c < g.frozenColumns);
        if (edt && !frozen && !g._hasPendingUpdates()) { // without full refresh
            if (g.onUpdatingView(new wijmo.CancelEventArgs())) {
                this._updateCell(edt);
                if (updateHdr || g._getHasValidation()) {
                    this._updateRowHeaderCell(r);
                }
                g.onUpdatedView();
            }
        } else { // with full refresh
            g.refresh(false);
        }
    }

    // update the row header cell for the item being edited
    private _updateRowHeaderCell(r: number) {
        let g = this._g;
        if (g.headersVisibility & HeadersVisibility.Row) {
            let p = g.rowHeaders,
                hdrIndex = g._getEditColumnIndex(), // TFS 372929
                hdrCell = p.getCellElement(r, hdrIndex);
            if (hdrCell) {
                this._updateCell(hdrCell);
            }
        }
    }

    // updates a cell on the grid
    private _updateCell(cell: HTMLElement) {
        let ht = new HitTestInfo(cell, null),
            clsUpdating = FlexGrid._WJS_UPDATING;
        if (ht.panel) {
            wijmo.addClass(cell, clsUpdating); // force update (REVIEW: is this needed???)
            ht.grid.cellFactory.updateCell(ht.panel, ht.row, ht.col, cell, ht.range);
            wijmo.removeClass(cell, clsUpdating);
        }
    }

    // gets a validation error for the cell currently being edited
    private _getValidationError(parsing?: boolean): string {
        let g = this._g,
            error = '';
        if (g && this._rng && !this._validating) {
            let r = this._rng.row,
                c = this._rng.col,
                edt = g.activeEditor,
                newVal = g.cellFactory.getEditorValue(g),
                oldVal = g.getCellData(r, c, false);
        
            // parsing errors
            if (parsing) {
                error = g._getError(g.cells, r, c, true);
            }

            // data errors
            if (!error && g._getHasValidation()) {

                // HTML validation errors
                if (edt) {
                    error = edt.validationMessage;
                }

                // isRequired errors (TFS 469967)
                if (!error) {
                    let col = g.columns[c],
                        row = g.rows[r],
                        bCol = g._getBindingColumn(g.cells, r, col);
                    if (bCol.getIsRequired(row) && (newVal == null || newVal === '')) {
                        error = this._getRequiredMsg();
                    }
                }

                // CollectionView validation errors
                if (!error && g.setCellData(r, c, newVal, true, false)) { // data error
                    error = g._getError(g.cells, r, c, false);
                    g.setCellData(r, c, oldVal, false, false); // TFS 367317
                }
            }

            // invalidInput errors (on custom editors: TFS 473036)
            if (!error) {

                // get custom editor
                let ctl = wijmo.Control.getControl(wijmo.closest(edt, '.wj-control'));
                if (ctl && ctl != g && ctl.invalidInput.hasHandlers) {

                    // handle invalidInput errors
                    let invInputHandler = (s, e) => {
                        if (e.cancel) {
                            error = g._getError(g.cells, r, c, true) || this._getBadInputMsg();
                            e.cancel = false;
                        }
                    }

                    // raise invalidInput event
                    this._validating = true; // prevent reentrant calls
                    let text = edt.value;
                    ctl.invalidInput.addHandler(invInputHandler);
                    // WJM-20597
                    // Since build 808, input controls should not trigger invalidInput
                    // while focus is within the control, so just calling ctl.onLostFocus()
                    // might not has any effect. To get it functional, we move focus out of 
                    // the control to the owner cell element, if focus is still within the control,
                    // before we call ctl.onLostFocus().
                    if (ctl._containsFocus()) { // WJM-20597
                        let cell = <HTMLElement>wijmo.closest(ctl.hostElement, '.wj-cell');
                        if (cell) {
                            cell.focus();
                        }
                    }
                    ctl.onLostFocus();
                    ctl.invalidInput.removeHandler(invInputHandler);
                    edt.value = text;
                    edt.select();
                    this._validating = false;
                }
            }
        }
        return error;
    }

    // get browser's error message for missing required values (TFS 469967)
    // REVIEW: localize this ourselves?
    _getRequiredMsg(): string {
        if (!_EditHandler._msgRequired) {
            let input = document.createElement('input');
            input.required = true;
            _EditHandler._msgRequired = input.validationMessage;
        }
        return _EditHandler._msgRequired;
    };

    // get browser's error message for bad input (TFS 473036)
    // REVIEW: localize this ourselves?
    _getBadInputMsg(): string {
        if (!_EditHandler._msgBadInput) {
            let input = document.createElement('input');
            input.pattern = 'x';
            input.value = 'a'
            _EditHandler._msgBadInput = input.validationMessage || 'Bad Input';
        }
        return _EditHandler._msgBadInput;
    };

    // checks whether a cell can be edited
    /*private*/ _allowEdit(r?: number, c?: number): boolean {
        let g = this._g;

        // read only grid?
        if (g.isReadOnly || g.selectionMode == SelectionMode.None) {
            return false;
        }

        // read-only data source?
        if (g.collectionView && !g.editableCollectionView) {
            return false;
        }

        // invalid/read-only row?
        if (r != null) {
            if (r < 0 || r >= g.rows.length) {
                return false;
            }
            let row = g.rows[r];
            if (!row || row.isReadOnly || !row.isVisible) {
                return false;
            }
        }

        // invalid/read-only column?
        if (c != null) {
            if (c < 0 || c >= g.columns.length) {
                return false;
            }
            let bCol = g._getBindingColumn(g.cells, r, g.columns[c]);
            if (!bCol || bCol.isReadOnly || !bCol.isVisible) {
                return false;
            }
        }

        // all good
        return true;
    }

    // finish editing the current item
    /*private*/ _commitRowEdits() {
        let g = this._g;
        if (this.finishEditing() && this._edItem) { // TFS 253082
            let ecv = g.editableCollectionView;
            if (ecv) {
                if (ecv.currentEditItem || ecv.currentAddItem) { // TFS: 206038
                    let e = new CellRangeEventArgs(g.cells, g.selection);
                    g.onRowEditEnding(e);
                    ecv.commitEdit();
                    g.onRowEditEnded(e);
                }
            }
            this._edItem = null;
        }
    }

    // handles keydown events while editing
    // returns true if the key was handled, false if the grid should handle it
    /*private*/ _keydown(e: KeyboardEvent): boolean {
        let edt = this._edt;
        switch (e.keyCode) {

            // F2 toggles edit mode
            case wijmo.Key.F2:
                this._fullEdit = !this._fullEdit;
                e.preventDefault();
                return true;

            // F4 toggles ListBox
            case wijmo.Key.F4:
                this._toggleListBox(e);
                e.preventDefault();
                return true;

            // space toggles checkboxes
            case wijmo.Key.Space:
                if (edt && edt.type == 'checkbox' && !edt.disabled && !edt.readOnly) { // TFS 257521
                    wijmo.setChecked(edt, edt.indeterminate || !edt.checked); // TFS 457250
                    this.finishEditing();
                    e.preventDefault();
                }
                return true;

            // enter, tab, escape finish editing
            case wijmo.Key.Enter:
                e.preventDefault();

                // alt-enter on textArea inserts new line (as in Excel)
                if (edt && e.altKey) {
                    let edt = e.target as HTMLTextAreaElement; // not necessarily our activeEditor...
                    if (edt instanceof HTMLTextAreaElement && edt.wrap == 'soft') { // not necessarily multi-line (IME)

                        // keep the IME mode in IE (TFS 459154)
                        edt.style.setProperty('ime-mode', 'auto', 'important');

                        // insert the break
                        let text = edt.value,
                            start = edt.selectionStart,
                            end = edt.selectionEnd;
                        edt.value = text.substr(0, start) + '\n' + text.substr(end);
                        wijmo.setSelectionRange(edt, start + 1);

                        // restore IME mode
                        edt.style['imeMode'] = '';
                    }
                    return true;
                }

                // enter closes any open drop-downs (TFS 457216)
                if (edt && this._lbx) {
                    this._toggleListBox(e);
                    return true;
                }

                return !this.finishEditing(); // let grid handle key if editing finished
            case wijmo.Key.Tab:
                e.preventDefault();
                return !this.finishEditing(); // let grid handle key if editing finished
            case wijmo.Key.Escape:
                e.preventDefault();
                this.finishEditing(true);
                return true;

            // cursor keys: ListBox selection/finish editing if not in full edit mode
            case wijmo.Key.Up:
            case wijmo.Key.Down:
            case wijmo.Key.Left:
            case wijmo.Key.Right:
            case wijmo.Key.PageUp:
            case wijmo.Key.PageDown:
            case wijmo.Key.Home:
            case wijmo.Key.End:

                // if the ListBox is active, let it handle the key
                if (this._lbx) {
                    return this._keydownListBox(e);
                }

                // open ListBox on alt up/down
                if (e.altKey) {
                    switch (e.keyCode) {
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            this._toggleListBox(e);
                            e.preventDefault();
                            return true;
                    }
                }

                // finish editing if not in full-edit mode
                if (!this._fullEdit) {
                    if (this.finishEditing()) {
                        return false;
                    }
                } else {
                    switch (e.keyCode) {
                        case wijmo.Key.PageUp:
                        case wijmo.Key.PageDown:
                            e.preventDefault(); // prevent pageup/down in full edit mode (TFS 360204)
                            break;
                    }
                }
        }

        // key has been handled, the grid should ignore it
        return true;
    }

    // handles keydown events when ListBox is visible
    private _keydownListBox(e: KeyboardEvent) {
        let handled = true;
        if (this._lbx) {
            switch (e.keyCode) {
                case wijmo.Key.Up:
                    if (e.altKey) {
                        this._toggleListBox(e);
                    } else if (this._lbx.selectedIndex > 0) {
                        this._lbx.selectedIndex--;
                    }
                    break;
                case wijmo.Key.Down:
                    if (e.altKey) {
                        this._toggleListBox(e);
                    } else {
                        this._lbx.selectedIndex++;
                    }
                    break;
                case wijmo.Key.Home:
                case wijmo.Key.PageUp:
                    this._lbx.selectedIndex = 0;
                    break;
                case wijmo.Key.End:
                case wijmo.Key.PageDown:
                    this._lbx.selectedIndex = this._lbx.collectionView.items.length - 1;
                    break;
                default:
                    handled = false;
                    break;
            }
        }

        // if handled, we're done
        if (handled) {
            e.preventDefault();
            return true;
        }

        // return false to let the grid handle the key
        return false;
    }

    // handles keyPress events while editing
    /*private*/ _keypress(e: KeyboardEvent) {

        // ignore smiley characters that appear on Alt-Up
        if (e.code == 'AltLeft' || e.code == 'AltRight') {
            e.preventDefault();
            return;
        }

        // auto-complete based on dataMap
        let edt = this._edt,
            charCode = e.charCode || 32,
            list = this._list;
        if (edt && edt.type != 'checkbox' && wijmo.getActiveElement() == edt && // TFS 313308
            list && list.length > 0 && charCode >= 32) {

            // get text up to selection start
            let start = edt.selectionStart,
                text = edt.value.substr(0, start);

            // add the new char (TFS 315824)
            if (e.target == edt && e.charCode) {
                text += String.fromCharCode(e.charCode);
                start++;
            }

            // find string (case-sensitive first, case-insensitive if allowed: TFS 311184)
            let index = this._findString(list, text, true); // case sensitive
            if (index < 0 && !this._g.caseSensitiveSearch) {
                index = this._findString(list, text, false); // case insensitive
            }
            if (index > -1) {
                let lbx = this._lbx;
                if (lbx) { // select item on drop-down list
                    lbx.selectedIndex = index;
                }
                edt.value = list[index];
                wijmo.setSelectionRange(edt, start, edt.value.length);
                edt.dispatchEvent(this._evtInput);
                if (e.preventDefault) {
                    e.preventDefault();
                }
            }
        }
    }

    // find a partial string in a list, case-sensitive or not
    /*private*/ _findString(items: string[], text: string, caseSensitive: boolean): number {

        // convert to lower-case for matching
        if (!caseSensitive) {
            text = text.toLowerCase();
        }

        // look for a match
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item != null) {
                item = item.toString(); // TFS 397497
                if (!caseSensitive) {
                    item = item.toLowerCase();
                }
                if (item.indexOf(text) == 0) {
                    return i;
                }
            }
        }

        // not found
        return -1;
    }

    // shows the drop-down element for a cell (if it is not already visible)
    /*private*/ _toggleListBox(evt: any, rng?: CellRange): boolean {
        let g = this._g,
            sel = g._selHdl.selection,
            touching = g.isTouching;

        // if a range was not specified, use current selection
        if (!rng) {
            rng = sel;
        }

        // close select element if any; if this is the same cell, we're done
        if (this._lbx) {
            this._removeListBox();
            if (sel.intersects(rng)) {
                if (g.activeEditor) {
                    g.activeEditor.focus();
                } else if (!g.containsFocus()) {
                    g.focus();
                }
                return true;
            }
        }

        // sanity (TFS 466864)
        if (!rng.isValid) {
            return false;
        }

        // check that we have a drop-down
        let row = g.rows[rng.row],
            bCol = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]),
            dataMap = row.dataMap || bCol.dataMap,
            cellMapEditor = g._getMapEditor(row, bCol);
        if (!dataMap || cellMapEditor != DataMapEditor.DropDownList || !softInput()) {
            return false;
        }
        if (bCol.editor != null) { // TFS 466705
            return false;
        }

        // start editing so we can position the select element
        if (!rng.intersects(g.editRange)) { // unless we're already editing this range: TFS 465857
            if (!this.startEditing(true, rng.row, rng.col, !touching, evt)) {
                return false;
            }
        }

        // create and initialize the ListBox
        let lbx = this._lbx = this._createListBox();
        requestAnimationFrame(() => lbx.showSelection()); // popup uses raf in Firefox: TFS 443540
        if (touching) {
            lbx.focus();
        }

        // done
        return true;
    }

    // create the ListBox and add it to the document
    private _createListBox(): wijmo.input.ListBox {
        let g = this._g,
            edt = g.activeEditor,
            rng = this._rng,
            row = g.rows[rng.row],
            bCol = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]),
            html = bCol.isContentHtml || row.isContentHtml,
            dataMap = bCol.dataMap || row.dataMap,
            cssMap = bCol.dropDownCssClass || row.dropDownCssClass,
            lbxHost = document.createElement('div');

        // just in case
        this._removeListBox();

        // create ListBox
        wijmo.addClass(lbxHost, 'wj-dropdown-panel wj-grid-listbox');
        wijmo.addClass(lbxHost, cssMap);
        let lbVal = edt ? edt.value : g.getCellData(rng.row, rng.col, true);
        let lbx = new wijmo.input.ListBox(lbxHost, {
            maxHeight: row.renderHeight * _LB_PAGE_SIZE,
            isContentHtml: html,
            itemsSource: dataMap.getDisplayValues(row.dataItem),
            selectedValue: lbVal
        });
        
        // close ListBox on Enter/Esc (TFS 454636)
        lbx.addEventListener(lbxHost, 'keydown', e => {
            switch (e.keyCode) {
                case wijmo.Key.Enter:
                case wijmo.Key.Escape:
                    this._removeListBox();
                    g.focus();
                    break;
            }
        });

        // close ListBox on click
        lbx.addEventListener(lbxHost, 'click', () => {
            this._removeListBox();
            g.focus(); // TFS 222950
            this.finishEditing();
        });

        // send focus back to editor after using scrollbars (TFS 454636)
        lbx.gotFocus.addHandler(() => {
            if (lbx.containsFocus() && edt) {
                edt.focus();
            }
        });
        // close ListBox on blur
        //lbx.lostFocus.addHandler(() => {
        //    this._removeListBox();
        //});

        // update editor when the selected index changes
        lbx.selectedIndexChanged.addHandler(() => {
            let edt = g.activeEditor;
            if (edt) {
                edt.value = this._list[lbx.selectedIndex]; // TFS 276472
                edt.dispatchEvent(this._evtInput);
                wijmo.setSelectionRange(edt, 0, edt.value.length);
            }
        });

        // show the popup
        let cell = g.cells.getCellElement(rng.row, rng.col);
        if (cell) {
            wijmo.showPopup(lbxHost, cell, false, false, false);
            let dd = cell.querySelector('.' + CellFactory._WJC_DROPDOWN);
            wijmo.setAttribute(dd, 'aria-expanded', true);
        } else {
            wijmo.showPopup(lbxHost, g.getCellBoundingRect(rng.row, rng.col));
            lbxHost[wijmo.Control._OWNR_KEY] = g.hostElement; // remember who owns the listbox
        }

        // done
        return lbx;
    }

    // remove the ListBox element from the DOM and disconnect its event handlers
    private _removeListBox() {
        let lbx = this._lbx;
        if (lbx) {
            this._lbx = null;
            wijmo.hidePopup(lbx.hostElement, () => {
                lbx.dispose();
            });
        }
    }
}
    }
    


    module wijmo.grid {
    





// Soft reference to common-input



/**
 * Class used to implement custom grid editors.
 */
export class _CustomEditor {
    _g: FlexGrid;
    _col: Column;
    _ctl: wijmo.Control;
    _tbx: HTMLInputElement;
    _prop: string;
    _isDropDown: boolean;
    _isComboBox: boolean;
    _isAutoComplete: boolean;
    _isInputDateTime: boolean;
    _isInputMask: boolean;
    _updateFocusBnd: any;
    _keypressBnd: any;
    _keydownBnd: any;
    _cmpstartBnd: any;
    _mousedownBnd: any;

    static _cssHidden = {
        position: 'fixed',
        left: -32000,
        top: -32000,
        width: '1px', // zero prevents focus on iPads...
        height: '1px',
        overflow: 'hidden',
        border: 'none'
    };
    static _cssVisible = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    };

    /**
     * Initializes a new instance of a {@link _CustomEditor}.
     * 
     * @param col {@link Column} that owns this {@link _CustomEditor}.
     * @param control {@link Control} to be used as an editor for the specified column.
     */
    constructor(col: Column, control: wijmo.Control) {
        this._col = wijmo.asType(col, Column);
        this._ctl = control;
        this._tbx = control.hostElement.querySelector('input');

        // sanity
        wijmo.assert(this._col instanceof Column, 'Invalid Column');
        wijmo.assert(this._ctl instanceof wijmo.Control, 'Invalid edit control');
        wijmo.assert(this._tbx instanceof HTMLInputElement, 'Input element not found in editor');

        // property to use when exchanging data with the grid
        let ctl = this._ctl as any;
        this._prop =
            !wijmo.isUndefined(ctl.value) ? 'value' : // numbers, dates, times, colors, masks
            !wijmo.isUndefined(ctl.checkedItems) ? 'checkedItems' : // MultiSelect
            !wijmo.isUndefined(ctl.text) ? 'text' : // ComboBox, AutoComplete
            null;
        wijmo.assert(this._prop != null, 'value, text properties not found in editor');

        // initialize
        let si = softInput();
        if (si) {
            this._isDropDown = ctl instanceof si.DropDown;
            this._isComboBox = ctl instanceof si.ComboBox;
            this._isAutoComplete = ctl instanceof si.AutoComplete;
            this._isInputDateTime = ctl instanceof si.InputDateTime;
            this._isInputMask = ctl instanceof si.InputMask;
        }
        this._updateFocusBnd = this._updateFocus.bind(this);
        this._keypressBnd = this._keypress.bind(this);
        this._keydownBnd = this._keydown.bind(this);
        this._cmpstartBnd = this._cmpstart.bind(this);
        this._mousedownBnd = this._mousedown.bind(this);

        // attach event handlers (after the grid has been created)
        this._connect();
        this._col.gridChanged.addHandler(this._connect, this);

        // hide the control and move it into the grid
        this._hideEditor();
        this._updateFocus();
    }

    /**
     * Gets a reference to the {@link FlexGrid} that owns this {@link _CustomEditor}.
     */
    get grid(): FlexGrid {
        return this._g;
    }
    /**
     * Gets a reference to the {@link Column} this {@link _CustomEditor} is connected to.
     */
    get column(): Column {
        return this._col;
    }
    /**
     * Gets a reference to the {@link Control} used as a custom editor by this {@link _CustomEditor}.
     */
    get control(): wijmo.Control {
        return this._ctl;
    }
    /**
     * Disposes of this {@link _CustomEditor}, disconnecting it from the original column.
     */
    dispose() {

        // remove event handlers
        this._disconnect();

        // clear variables
        if (this._isDropDown) {
            this._isDropDown = false;
        }
        this._g = this._col = this._ctl = this._tbx = null;
    }

    // ** implementation

    // connects this editor to a parent FlexGrid
    _connect() {
        let g = this._col ? this._col.grid : null;
        if (g != this._g) {

            // disconnect from old grid
            this._disconnect();

            // connect to new one
            if (g) {
                let host = g.hostElement,
                    add = g.addEventListener.bind(g),
                    ufb = this._updateFocusBnd;

                // remember parent grid
                this._g = g;

                // add DOM events
                add(host, 'keydown', this._keydownBnd, true); // TFS 442667
                add(host, 'keypress', this._keypressBnd, true);
                add(host, 'mousedown', this._mousedownBnd, true);
                add(host, 'mouseup', ufb, true);
                add(host, 'blur', ufb, true);
                add(host, 'focus', ufb);
                add(this._tbx, 'compositionstart', this._cmpstartBnd);

                // add Wijmo events
                g.selectionChanged.addHandler(ufb, this);
                g.prepareCellForEdit.addHandler(this._prepareCellForEdit, this);
                g.cellEditEnding.addHandler(this._cellEditEnding, this);
                g.cellEditEnded.addHandler(this._cellEditEnded, this);
            }
        }
    }

    // disconnects this editor from a parent FlexGrid
    _disconnect() {
        let g = this._g;
        if (g) {
            let host = g.hostElement,
                rmv = g.removeEventListener.bind(g),
                ufb = this._updateFocusBnd;

            // remove DOM events
            rmv(host, 'keydown', this._keydownBnd);
            rmv(host, 'keypress', this._keypressBnd);
            rmv(host, 'mousedown', this._mousedownBnd);
            rmv(host, 'mouseup', ufb);
            rmv(host, 'blur', ufb);
            rmv(host, 'focus', ufb);
            rmv(this._tbx, 'compositionstart', this._cmpstartBnd);

            // remove Wijmo events (use self parameter to remove only our handler)
            g.selectionChanged.removeHandler(ufb, this);
            g.prepareCellForEdit.removeHandler(this._prepareCellForEdit, this);
            g.cellEditEnding.removeHandler(this._cellEditEnding, this);
            g.cellEditEnded.removeHandler(this._cellEditEnded, this);

            // clear grid reference (TFS 443326)
            this._g = null;
        }
    }

    // show our editor when editing
    _prepareCellForEdit(s: FlexGrid, e: CellRangeEventArgs) {
        if (!e.cancel && e.getColumn(true) == this._col) {

            // initialize editor
            let g = this.grid,
                ctl = this._ctl as any,
                tbx = this._tbx,
                prop = this._prop,
                rng = e.range,
                evt = e.data,
                evtType = evt ? evt.type : '',
                value = g.getCellData(rng.row, rng.col, prop == 'text' || this._isInputMask), // TFS 467150
                openDropDown = false;

            // ** REVIEW: ComboBox pre-initialization
            if (this._isComboBox) {
                if (this._isAutoComplete) { // clearing _oldText breaks ComboBox (WJM-20141)
                    ctl._oldText = ''; 
                }
                if (!ctl.isRequired) { // TFS 467157
                    ctl.selectedIndex = -1;
                    tbx.value = '';
                }
                if (this._isInputDateTime) { // InputDateTime always starts with the calendar (OutSystems request)
                    ctl._setDropdown(ctl._ddDate);
                }
            }

            // MultiSelect initialization
            if (prop == 'checkedItems') {

                // reset filter input (TFS 438972)
                if (ctl.showFilterInput) {
                    ctl.showFilterInput = false;
                    ctl.showFilterInput = true;
                }

                // initialize checkedItems for null/empty values (TFS 467555)
                if (value == null || value.length == 0) {
                    ctl[prop] = [];
                    ctl.selectedIndex = 0;
                }
            }

            // initialize editor value with grid data (TFS 461245)
            if (value != null || !ctl.isRequired) {
                ctl[prop] = value;

                // don't open AutoComplete when starting
                if (this._isAutoComplete) { 
                    clearTimeout(ctl._toSearch);
                    if (value) { // select the current item, if any
                        ctl.selectedIndex = ctl._findNext(value, 1, -1); // TFS 467919
                    }
                }
            }

            // open dropDown controls when activating with mouse or F4/alt+down
            switch (evtType) {
                case 'keydown':
                case 'mousedown':
                    if (wijmo.isUndefined(evt.keyCode) || evt.keyCode == wijmo.Key.F4 || evt.altKey) {
                        openDropDown = this._isDropDown; // TFS 442667

                        // special handling required for AutoComplete
                        if (this._isAutoComplete) {
                            if (value == null || wijmo.isString(value)) {
                                let cv = ctl.collectionView;
                                if (cv) {
                                    if (cv.filter || ctl._rxHighlight) { // clear filter
                                        ctl._rxHighlight = null;
                                        cv.filter = null; // causes a refresh
                                    }
                                    ctl.selectedIndex = value
                                        ? ctl._findNext(value, 1, -1) // TFS 467919
                                        : -1;
                                }
                            }
                        }
                    }
                    break;
            }

            // honor showPlaceholders in custom editors
            if (g.showPlaceholders && !ctl.placeholder) {
                tbx.placeholder = this._col.header;
            }

            // show the editor (always start in full edit mode)
            this._showEditor();
            g._edtHdl._fullEdit = true;

            // move selection to the end if we started with a space
            if (evtType.indexOf('key') == 0 && evt.keyCode == 32) {
                wijmo.setSelectionRange(tbx, tbx.value.length);
                evt.preventDefault();
            }

            // special handling for IE
            if (wijmo.isIE()) {
                if (evtType == 'keypress' && evt.key) { // quick-editing (TFS 458047)
                    setTimeout(() => {
                        tbx.value = evt.key;
                        wijmo.setSelectionRange(tbx, 1);
                        let evtInput = document.createEvent('HTMLEvents');
                        evtInput.initEvent('input', true, false);
                        tbx.dispatchEvent(evtInput);
                    }); // no delay to prevent key loss
                    evt.preventDefault();
                } else if (evtType == 'compositionstart') { // IME (TFS 458047)
                    let len = tbx.value.length;
                    wijmo.setSelectionRange(tbx, len);
                }
            }

            // apply isDroppedDown state
            if (this._isDropDown) {
                ctl.isDroppedDown = openDropDown;
            }
        }
    }

    // save editor value on edit ending
    _cellEditEnding(s: FlexGrid, e: CellEditEndingEventArgs) {
        if (!e.cancel && e.getColumn(true) == this._col) {

            // copy value into cell
            let g = this.grid,
                ctl = this._ctl as any,
                prop = this._prop;

            // check that we have something selected (AutoComplete)
            if (this._isAutoComplete) {
                let index = ctl.selectedIndex;
                if (wijmo.isNumber(index) && index < 0) { // no selection?
                    let view = ctl.collectionView;
                    if (view && view.items.length == 1) { // only one item on the list? 
                        ctl.selectedIndex = 0; // yes, select it
                    } else { // still no selection?
                        if (this._col.isRequired) { // column is required? (TFS 469233)
                            e.cancel = true; // no selection, discard the edits
                        }
                    }
                }
            }

            // save editor value to apply later (TFS 455796)
            if (!e.cancel && prop) {
                g._edtHdl._setCustomEditorValue(ctl[prop]);
            }
        }
    }

    // hide editor and update focus on edit ended (TFS 442667)
    _cellEditEnded(s: FlexGrid, e: CellRangeEventArgs) {
        this._hideEditor();
        this._updateFocus();
    }

    // start editing when composition starts
    _cmpstart(e: any) {
        if (wijmo.isIE()) { // IE needs extra time for this
            setTimeout(() => {
                this._activateEditor(e);
            });
        } else { // the extra time is bad for Chrome
            this._activateEditor(e);
        }
    }

    // start editing when the user types into the editor
    _keypress(e: KeyboardEvent) {
        if (!e.defaultPrevented && !this.grid.activeEditor && this._checkColumn(e.target)) { // make sure it's ours (TFS 469228)
            if (!e.ctrlKey && !e.altKey && !e.metaKey && e.keyCode != 27) {
                this._activateEditor(e);
            }
        }
    }

    // start editing with F4, alt+up/down, close drop-downs on enter if editing
    _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented && this._checkColumn(e.target)) { // make sure it's ours (TFS 469228)
            if (this.grid.activeEditor) { // close drop-downs but stay in edit mode (TFS 457216)
                if (e.keyCode == wijmo.Key.Enter && this._isDropDown) {
                    let ctl = this._ctl as any;
                    if (ctl.isDroppedDown) {
                        ctl.isDroppedDown = false;
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            } else { // start editing with F4, alt+up/down
                if (this._isDropDown) {
                    let code = e.keyCode;
                    switch (code) {
                        case wijmo.Key.F4:
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            if (code == wijmo.Key.F4 || e.altKey) {
                                this._activateEditor(e);
                                e.preventDefault(); // TFS 442667
                            }
                            break;
                    }
                }
            }
        }
    }

    // check whether our column is selected (TFS 469228)
    _checkColumn(target: EventTarget): boolean {
        if (wijmo.contains(target, this._tbx)) {
            let g = this._g,
                sel = g._selHdl.selection,
                col = g._getBindingColumn(g.cells, sel.row, g.columns[sel.col]); // TFS 466804
            return col == this._col;
        }
        return false;
    }

    // handle clicks on drop-down elements
    _mousedown(e: MouseEvent) {
        if (!e.defaultPrevented && e.button == 0) {
            if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                if (this._isDropDown && wijmo.closestClass(e.target, CellFactory._WJC_DROPDOWN)) {
                    let g = this.grid,
                        ht = g.hitTest(e);
                    if (ht.getColumn(true) == this._col) {
                        g.select(ht.range);
                        g.refresh(); // WJM-19542
                        this._activateEditor(e);
                        e.preventDefault();
                    }
                }
            }
        }
    }

    // activates the custom editor for this column
    _activateEditor(e: any): boolean {
        let g = this.grid;
        if (!g.activeEditor) {
            let sel = g._selHdl.selection;
            if (sel.isValid) {
                return g.startEditing(true, sel.row, sel.col, true, e);
            }
        }
        return false;
    }

    // show the custom editor while editing a cell
    _showEditor() {
        let g = this.grid,
            edt = g.activeEditor,
            cell = wijmo.closest(edt, '.wj-cell') as HTMLElement;
        if (cell) {
            let tbx = this._tbx,
                ctl = this._ctl,
                host = ctl.hostElement;

            // apply style
            wijmo.setCss(host, _CustomEditor._cssVisible);
            wijmo.toggleClass(tbx, 'wj-grid-ime', false);

            // replace cell content with custom editor
            cell.innerHTML = '';
            cell.appendChild(host);

            // activate the custom editor and clear the native one
            g._edtHdl._edt = tbx;
            tbx.select();
            tbx.focus();
            edt.value = '';
        }
    }

    // hide the custom editor when not in use
    _hideEditor() {
        let g = this.grid,
            host = this._ctl.hostElement,
            tbx = this._tbx;
        
        // close the dropdown
        if (this._isDropDown) {
            (this._ctl as any).isDroppedDown = false;
        }

        // reset validity, close IME window
        tbx.setCustomValidity('');
        //tbx.blur(); // close floating IME window (?)
        let val = tbx.value; // change text but keep original content (TFS 467157)
        tbx.value = val + ' ';
        tbx.value = val;

        // hide editor, add custom grid-editor class
        wijmo.setCss(host, _CustomEditor._cssHidden);
        wijmo.toggleClass(tbx, 'wj-grid-ime', true);
        if (g && host.parentElement != g._root) {
            g._root.appendChild(host);
        }
    }

    // transfer focus from grid to editor
    _updateFocus() {
        let g = this.grid;
        if (g && !g.activeEditor) {
            let host = g.hostElement,
                cls = '.wj-flexgrid',
                tbx = this._tbx,
                ae = wijmo.getActiveElement(),
                tabIndex = g._getTabIndex();
            if (wijmo.closest(ae, cls) == host) {
                if (wijmo.closest(tbx, cls) != host) { // make sure our grid owns this editor
                    this._hideEditor();
                } else {
                    let sel = g._selHdl.selection,
                        col = g._getBindingColumn(g.cells, sel.row, g.columns[sel.col]); // TFS 466804
                    if (col && col == this._col && g.canEditCell(sel.row, sel.col)) { // TFS 444836, 465909
                        tbx.tabIndex = tabIndex;
                        tbx.select();
                        tbx.focus();
                    } else if (tbx.tabIndex > -1) {
                        tbx.tabIndex = -1;
                        if (ae == tbx) { // transfer focus back to the grid (TFS 469324)
                            g.focus(true);
                        }
                    }
                }
            }
        }
    }
}

    }
    


    module wijmo.grid {
    









'use strict';

/**
 * Specifies constants that define the action to perform when special
 * keys such as ENTER and TAB are pressed.
 */
export enum KeyAction {
    /** No special action (let the browser handle the key). */
    None,
    /** Move the selection to the next row. */
    MoveDown,
    /** Move the selection to the next column. */
    MoveAcross,
    /** Move the selection to the next column, then wrap to the next row. */
    Cycle,
    /** Move the selection to the next column, then wrap to the next row, then out of the control. */
    CycleOut,
    /** Move the selection to the next editable column, then wrap to the next row. */
    CycleEditable
}

/**
 * Handles the grid's keyboard commands.
 */
export class _KeyboardHandler {
    _g: FlexGrid;
    _kaTab = KeyAction.None;
    _kaEnter = KeyAction.MoveDown;
    _search: string;
    _toSearch: any;

    /**
     * Initializes a new instance of the {@link _KeyboardHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _KeyboardHandler}.
     */
    constructor(g: FlexGrid) {
        this._g = g;
        let host = g.hostElement;
        g.addEventListener(host, 'keypress', this._keypress.bind(this));
        g.addEventListener(host, 'keydown', this._keydown.bind(this));
    }

    // handles the key down event (selection)
    /*private*/ _keydown(e: KeyboardEvent) {
        let g = this._g,
            edtHdl = g._edtHdl,
            sel = g.selection,
            ctrl = e.ctrlKey || e.metaKey,
            shift = e.shiftKey,
            alt = e.altKey,
            target = e.target as HTMLElement,
            key = e.char || e.key, // IE has 'char' but no 'key'
            handled = true;

        // handle dataMap radio buttons
        // test 'key' since custom editors may dispatch funky events (TFS 421510)
        if (!ctrl && !alt && key && key.length == 1 && wijmo.closest(target, '.wj-cell') && target.firstElementChild) { // TFS 469405
            if (key != ' ' || !shift) { // shift space selects the row (TFS 419702)
                let buttons = target.querySelectorAll('.' + CellFactory._WJC_RADIOMAP + ' label input');
                if (buttons && buttons.length) {
                    let index = -1; // find button that is currently checked
                    for (let i = 0; i < buttons.length; i++) {
                        if ((buttons[i] as HTMLInputElement).checked) {
                            index = i;
                            break;
                        }
                    }
                    key = key.toLowerCase(); // look for the button to check
                    for (let i = 0; i < buttons.length; i++) {
                        let btn = buttons[(index + i + 1) % buttons.length] as HTMLInputElement;
                        if (key == ' ' || btn.value.toLowerCase()[0] == key) {
                            btn.click();
                            e.preventDefault();
                            return; // done with radio
                        }
                    }
                }
            }
        }

        // allow input elements that don't belong to us to handle keys (TFS 131138, 191989)
        if (g._wantsInput(target)) {
            return;
        }

        // get the variables we need
        let gr = wijmo.tryCast(g.rows[sel.row], GroupRow) as GroupRow,
            ecv = g.editableCollectionView,
            keyCode = g._getKeyCode(e),
            SMV = SelMove,
            SM = SelectionMode;

        // ignore defaultPrevented if the target is an HTMLInputElement (TFS 202913, 272449)
        let defaultPrevented = e.defaultPrevented && !(target instanceof HTMLInputElement);

        // sanity (before pre-processing: TFS 272449)
        if (!g.isRangeValid(sel) || defaultPrevented) {
            if (!ctrl || keyCode != 65) { // allow ctrl+A to select all cells
                return;
            }
        }

        // pre-process keys while editor is active
        if (g.activeEditor && edtHdl._keydown(e)) {
            if (!g._isNativeCheckbox(g.activeEditor)) { // TFS 418469
                return;
            }
        }

        // handle clipboard
        if (g.autoClipboard) {

            // copy: ctrl+c or ctrl+Insert
            if (ctrl && (keyCode == 67 || keyCode == 45)) {
                let args = new CellRangeEventArgs(g.cells, sel);
                if (g.onCopying(args)) {
                    let hv = HeadersVisibility,
                        colHeaders = (g.copyHeaders & hv.Column) != 0,
                        rowHeaders = (g.copyHeaders & hv.Row) != 0,
                        text = g.getClipString(null, false, colHeaders, rowHeaders) + '\r\n'; // TFS 228046
                    g._eFocus.focus(); // TFS 434734 (IE)
                    wijmo.Clipboard.copy(text);
                    g.onCopied(args);
                }
                e.stopPropagation();
                return;
            }

            // paste: ctrl+v or shift+Insert
            if ((ctrl && keyCode == 86) || (shift && keyCode == 45)) {
                if (!g.isReadOnly) {
                    wijmo.Clipboard.paste((text: string) => {
                        g.setClipString(text);
                    });
                }
                e.stopPropagation();
                return;
            }
        }

        // honor shift+space in IME (required in Chrome, TFS 358903)
        if ((shift || ctrl) && e.code == 'Space') {
            keyCode = wijmo.Key.Space;
        }

        // default key handling 
        // https://www.w3.org/TR/wai-aria-practices-1.1/#grid
        switch (keyCode) {

            // shift-space: select row
            // ctrl-space: select column
            // else start editing, toggle checkboxes
            case wijmo.Key.Space:
                if (shift && sel.isValid) {
                    switch (g.selectionMode) {
                        case SM.CellRange:
                        case SM.MultiRange:
                        case SM.Row:
                        case SM.RowRange:
                        case SM.ListBox:
                            g.select(new CellRange(sel.row, 0, sel.row, g.columns.length - 1), false);
                            break;
                    }
                } else if (ctrl && sel.isValid) {
                    switch (g.selectionMode) {
                        case SM.CellRange:
                        case SM.MultiRange:
                            g.select(new CellRange(0, sel.col, g.rows.length - 1, sel.col), false);
                            break;
                    }
                } else {
                    handled = this._startEditing(true, e);
                    if (handled) {
                        setTimeout(() => {
                            let edt = g.activeEditor;
                            if (edt) {
                                if (edt.disabled || (edt.readOnly && !wijmo.closest(edt, '.wj-control'))) { // to work with MultiSelect
                                    g.finishEditing();
                                } else if (edt.type == 'checkbox') {
                                    wijmo.setChecked(edt, edt.indeterminate || !edt.checked); // TFS 457250
                                    g.finishEditing();
                                }
                            }
                        });
                    }
                    handled = true; // TFS 469405
                }
                break;

            // ctrl+A: select all
            case 65:
                if (ctrl) {
                    switch (g.selectionMode) { // TFS 384983
                        case SM.None:
                        case SM.Cell:
                            break;
                        default:
                            g.selectAll();
                            break;
                    }
                } else {
                    handled = false;
                }
                break;

            // left/right
            case wijmo.Key.Left:
                if (ctrl || alt) { // ctrl reserved for accessibility
                    handled = false;
                } else {
                    if (sel.isValid && sel.leftCol == 0 && gr && !gr.isCollapsed && gr.hasChildren) {
                        gr.isCollapsed = true;
                    } else {
                        this._moveSel(SMV.None, ctrl ? SMV.Home : SMV.Prev, shift);
                    }
                }
                break;
            case wijmo.Key.Right:
                if (ctrl || e.altKey) { // ctrl reserved for accessibility
                    handled = false;
                } else {
                    if (sel.isValid && sel.leftCol == 0 && gr && gr.isCollapsed) {
                        gr.isCollapsed = false;
                    } else {
                        this._moveSel(SMV.None, ctrl ? SMV.End : SMV.Next, shift);
                    }
                }
                break;

            // up/down move selection, alt-up/down toggles the listbox
            case wijmo.Key.Up:
                if (ctrl) { // ctrl reserved for accessibility
                    handled = false;
                } else {
                    if (e.altKey && edtHdl._toggleListBox(e)) {
                        handled = true;
                    } else {
                        this._moveSel(SMV.Prev, SMV.None, shift);
                    }
                }
                break;
            case wijmo.Key.Down:
                if (ctrl) { // ctrl reserved for accessibility
                    handled = false;
                } else {
                    if (e.altKey && edtHdl._toggleListBox(e)) {
                        handled = true;
                    } else {
                        this._moveSel(SMV.Next, SMV.None, shift);
                    }
                }
                break;

            // page up/down
            // +alt for top/bottom (+ctrl is used to switch tabs in Chrome)
            case wijmo.Key.PageUp:
                this._moveSel(e.altKey ? SMV.Home : SMV.PrevPage, SMV.None, shift);

                // if we scrolled into the frozen area, scroll all the way up
                if (g.rows.frozen && g.selection.row < g.rows.frozen) {
                    let sp = g.scrollPosition;
                    if (sp.y) {
                        g.scrollPosition = new wijmo.Point(sp.x, 0);
                    }
                }
                break;
            case wijmo.Key.PageDown:
                this._moveSel(e.altKey ? SMV.End : SMV.NextPage, SMV.None, shift);
                break;

            // home/end
            case wijmo.Key.Home:
                this._moveSel(ctrl ? SMV.Home : SMV.None, SMV.Home, shift);
                break;
            case wijmo.Key.End:
                this._moveSel(ctrl ? SMV.End : SMV.None, SMV.End, shift);
                break;

            // tab
            case wijmo.Key.Tab:
                handled = this._performKeyAction(g.keyActionTab, shift);
                break;

            // Enter
            case wijmo.Key.Enter:
                handled = this._performKeyAction(g.keyActionEnter, shift);
                if (!shift && ecv && ecv.currentEditItem != null) {
                    edtHdl._commitRowEdits();
                }
                break;

            // Escape: cancel edits/row addition
            case wijmo.Key.Escape:
                handled = false;
                if (ecv) {
                    if (ecv.currentAddItem || ecv.currentEditItem) {
                        // fire rowEditEnding/Ended events with cancel set to true
                        // the event handlers can use this to restore deep bindings
                        let ee = new CellRangeEventArgs(g.cells, g.selection);
                        ee.cancel = true;
                        g.onRowEditEnding(ee);
                        if (ecv.currentAddItem) {
                            ecv.cancelNew();
                        }
                        if (ecv.currentEditItem) {
                            ecv.cancelEdit();
                        }
                        g.onRowEditEnded(ee);
                        handled = true; // TFS 261795
                    }
                }
                g._mouseHdl.resetMouseState();
                break;

            // Delete selection
            // Mac keyboards don't have a Delete key, so honor Back here as well
            case wijmo.Key.Delete:
            case wijmo.Key.Back:
                handled = this._deleteSel(e);
                break;

            // F2/F4: editing
            case wijmo.Key.F2:
                handled = this._startEditing(true, e);
                break;
            case wijmo.Key.F4:
                handled = edtHdl._toggleListBox(e);
                break;

            // everything else
            default:
                handled = false;
                break;
        }
        if (handled) {
            if (!g.containsFocus()) {
                g.focus(); // http://wijmo.com/topic/angular-2-focus-issue-with-wj-input-number-as-rendering-cell-of-flexgrid/
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // handle a special key according to a KeyAction value
    _performKeyAction(action: KeyAction, shift: boolean): boolean {
        let KA = KeyAction,
            SM = SelMove;
        switch (action) {
            case KA.MoveDown:
                this._moveSel(shift ? SM.Prev : SM.Next, SM.None, false);
                return true;
            case KA.MoveAcross:
                this._moveSel(SM.None, shift ? SM.Prev : SM.Next, false);
                return true;
            case KA.Cycle:
                this._moveSel(SM.None, shift ? SM.PrevCell : SM.NextCell, false);
                return true;
            case KA.CycleEditable:
                this._moveSel(SM.None, shift ? SM.PrevEditableCell : SM.NextEditableCell, false);
                return true;
            case KA.CycleOut:
                let sel = this._g.selection;
                this._moveSel(SM.None, shift ? SM.PrevCell : SM.NextCell, false);
                return !sel.equals(this._g.selection);
        }
        return false;
    }

    // handles the key press event (start editing or try auto-complete)
    private _keypress(e: KeyboardEvent) {
        let g = this._g;

        // allow input elements that don't belong to us to handle keys
        // (TFS 131138, 191989)
        if (g._wantsInput(e.target) || e.defaultPrevented) {
            return;
        }

        // forward key to editor (auto-complete) or handle ourselves
        let edtHdl = g._edtHdl;
        if (g.activeEditor) {
            edtHdl._keypress(e);
        } else if (e.charCode > wijmo.Key.Space && // no ctrl chars
            e.code != 'AltLeft' && e.code != 'AltRight') { // no smiley

            // start editing
            if (this._startEditing(false, e) && g.activeEditor) {
                let edt = wijmo.getActiveElement() as HTMLInputElement, // any editor (TFS 296961/Firefox)
                    edtText = (edt instanceof HTMLInputElement && edt.type != 'checkbox') ||
                        (edt instanceof HTMLTextAreaElement);
                if (edtText) {
                    let sel = g._selHdl.selection,
                        txt = g.getCellData(sel.row, sel.col, true),
                        val = g.getCellData(sel.row, sel.col, false),
                        pct = wijmo.culture.Globalize.numberFormat['%'] || '%',
                        chr = String.fromCharCode(e.charCode),
                        isPct = (wijmo.isNumber(val) && txt.indexOf(pct) > -1) ||
                            (txt == '' && edt.value == pct); // TFS 284522

                    // initialize editor with char typed, preserve percent sign
                    // no extra space before the pct matters in RTL grids (TFS 456788)
                    edt.value = isPct ? (chr + pct) : chr;

                    // start editing
                    wijmo.setSelectionRange(edt, 1);
                    edt.dispatchEvent(edtHdl._evtInput); // to apply mask (TFS 131232)
                    edtHdl._keypress(e); // to start auto-complete
                    edtHdl._edtValue = edt.value != txt // to raise change event without user input (TFS 348666)
                        ? edt.value
                        : null;

                    // we're done with this event
                    e.preventDefault();
                }
            } else if (g.autoSearch) {
                let searched = false,
                    sel = g._selHdl.selection;
                if (e.charCode > 32 || (e.charCode == 32 && this._search)) {
                    e.preventDefault();

                    // update search string
                    this._search += String.fromCharCode(e.charCode);
                    if (this._toSearch) {
                        clearTimeout(this._toSearch);
                    }
                    this._toSearch = setTimeout(() => {
                        this._toSearch = null;
                        this._search = '';
                    }, wijmo.Control._SEARCH_DELAY);

                    // perform search
                    let index = this._findNext(sel.row, sel.col); // multi-char search
                    if (index < 0 && this._search.length > 1) {
                        this._search = this._search[this._search.length - 1];
                        index = this._findNext(sel.row, sel.col); // single-char search
                    }
                    if (index > -1) {
                        searched = true;
                        g.select(index, sel.col);
                    }
                }
                if (!searched) {
                    this._search = '';
                }
            }
        }
    }

    // look for the '_search' string from the given row at the given column
    private _findNext(row: number, col: number): number {
        let g = this._g,
            cnt = g.rows.length;

        // start searching from current or next item
        if (row < 0 || this._search.length == 1) {
            row++;
        }

        // string to search for
        let search = this._search,
            caseSensitive = g.caseSensitiveSearch;
        if (!caseSensitive) {
            search = search.toLowerCase();
        }

        // convert HTML to plain text when searching (TFS 440389)
        let isContentHtml = g.columns[col].isContentHtml;

        // search through the items (with wrapping)
        for (let off = 0; off < cnt; off++) {
            let index = (row + off) % cnt,
                txt = g.getCellData(index, col, true).trim();
            if (isContentHtml) { // TFS 440389
                txt = wijmo.toPlainText(txt);
            }
            if (!caseSensitive) {
                txt = txt.toLowerCase();
            }
            if (txt.indexOf(search) == 0) { // TFS 458107
                return index;
            }
        }

        // not found
        return -1;
    }

    // move the selection
    private _moveSel(rowMove: SelMove, colMove: SelMove, extend: boolean) {
        let g = this._g;
        if (g.selectionMode != SelectionMode.None) {
            g._selHdl.moveSelection(rowMove, colMove, extend);
        }
    }

    // delete the selected rows
    private _deleteSel(evt: KeyboardEvent): boolean {
        let g = this._g,
            rows = g.rows,
            ecv = g.editableCollectionView,
            sel = g.selection,
            selRows: Row[] = [], // TFS 418979
            rng = new CellRange(),
            e = new CellEditEndingEventArgs(g.cells, rng, evt),
            SM = SelectionMode;

        // can't delete if can't edit...
        // (not readOnly and not bound to a non-editable CollectionView)
        if (!g._edtHdl._allowEdit()) {
            return false;
        }

        // if g.allowDelete and ecv.canRemove, and not editing/adding, (TFS 87718)
        // and the grid allows deleting items, then delete selected rows
        if (g.allowDelete && (ecv == null || (ecv.canRemove && !ecv.isAddingNew && !ecv.isEditingItem))) {

            // get selected rows (ListBox or Selector)
            selRows = rows.filter(row => row.isSelected);

            // no selected rows, select by range
            if (selRows.length == 0) {
                switch (g.selectionMode) {
                    case SM.CellRange:
                    case SM.MultiRange:
                        let firstCol = g._getDeleteColumnIndex();
                        g.selectedRanges.forEach(rng => {
                            if (rng.leftCol == firstCol && rng.rightCol == g.columns.length - 1) {
                                for (let i = rng.topRow; i > -1 && i <= rng.bottomRow; i++) {
                                    let row = rows[i];
                                    if (selRows.indexOf(row) < 0) {
                                        selRows.push(row);
                                    }
                                }
                            }
                        });
                        break;
                    case SM.Row:
                        if (sel.topRow > -1) {
                            selRows.push(rows[sel.topRow]);
                        }
                        break;
                    case SM.RowRange:
                        for (let i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                            selRows.push(rows[i]);
                        }
                        break;
                }
            }
        }

        // finish with row deletion
        if (selRows.length > 0) {

            // track the number of removed rows
            let removedRowsCount = 0;

            // delete selected rows (no ecv defer updates: TFS 400093)            
            g.deferUpdate(() => {

                // don't sort/filter until done (TFS 430771)
                if (ecv) {
                    ecv.beginUpdate();
                }

                // loop through selected rows from the bottom
                for (let i = selRows.length - 1; i >= 0; i--) {
                    let r = selRows[i];

                    // can't delete _NewRowTemplate (TFS 391604)
                    // but group rows are OK (TFS 402766)
                    if (r instanceof _NewRowTemplate) {
                        continue;
                    }

                    // delete regular rows
                    rng.setRange(r.index, -1);
                    if (g.onDeletingRow(e)) {
                        if (ecv && r.dataItem) {
                            ecv.remove(r.dataItem);
                        } else {
                            g.rows.removeAt(r.index);
                        }
                        removedRowsCount++;
                        g.onDeletedRow(e);
                    }
                }

                // restore sort/filter
                if (ecv) {
                    ecv.endUpdate(false);
                }
            });

            // keep selection if nothing removed
            if (removedRowsCount > 0) { // WJM-19630
                // keep selection visible and out of new row template if possible
                let selRow = sel.topRow;
                selRow = Math.min(selRow, g.rows.length - 1); // TFS 402714
                while (selRow > 0 && g.rows[selRow] instanceof _NewRowTemplate) { // TFS 403947, 434892
                    selRow--;
                }

                // collapse row selection (TFS 409373, 424312)
                sel.row = sel.row2 = selRow;
                g.select(sel, false);

                // handle childItemsPath (TFS 87577)
                if (g.childItemsPath && ecv) {
                    ecv.refresh();
                }
            }

            // all done
            return true;
        }

        // delete cell content (if there is any) (TFS 94178, 228047)
        if (selRows.length == 0) {

            // delete selected cells
            g.deferUpdate(() => {
                let sp = g.scrollPosition,
                    lastRow = -1;
                
                // get selected rows (ListBox or Selector)
                selRows = rows.filter(row => row.isSelected);

                // defer the edits if the selection contains multiple data items (TFS 467713)
                let defer = g.selectedRanges.length > 1 || selRows.length > 1 ||
                    (sel.isValid && rows[sel.row].dataItem != rows[sel.row2].dataItem);

                // begin updates (TFS 436806)
                if (ecv) {
                    ecv.beginUpdate();
                }

                if (selRows.length) {

                    // delete the content of the selected rows (TFS 439180)
                    let rng = new CellRange(0, 0, 0, g.columns.length - 1);
                    selRows.forEach(row => {
                        rng.row = rng.row2 = row.index;
                        this._deleteRange(evt, rng);
                        lastRow = rng.bottomRow;
                    });

                } else {

                    // delete the content of the current and extended selections
                    this._deleteRange(evt, sel);
                    lastRow = sel.bottomRow;

                    if (g.selectionMode == SM.MultiRange) {
                        g._selHdl.extendedSelection.forEach(rng => {
                            this._deleteRange(evt, rng);
                            lastRow = rng.bottomRow;
                        });
                    }
                }

                // restore selection/scroll position
                g.select(sel, false);
                g.scrollPosition = sp;

                // end updates (update only if needed: TFS 439322)
                if (ecv) {
                    if (defer && ecv.currentEditItem) { // commit edits and raise any missing RowEditEnd* events 
                        ecv.commitEdit();
                        let e = new CellRangeEventArgs(g.cells, new CellRange(lastRow, -1)); // TFS 467869
                        g.onRowEditEnding(e);
                        g.onRowEditEnded(e);
                    }
                    ecv.endUpdate(false);
                }
            });

            // all done
            return true;
        }

        // no deletion
        return false;
    }

    // delete the content of cells in a range
    private _deleteRange(evt: KeyboardEvent, rng: CellRange) {
        let g = this._g,
            ecv = g.editableCollectionView,
            rngCell = new CellRange(),
            e = new CellEditEndingEventArgs(g.cells, rngCell, evt),
            rowArgs = new CellRangeEventArgs(g.cells, new CellRange(rng.topRow, -1));

        // looping through rows
        for (let sr = rng.topRow; sr <= rng.bottomRow; sr++) {
            let row = g.rows[sr];
            if (!row.isReadOnly) {

                // looping through columns
                for (let sc = rng.leftCol; sc <= rng.rightCol; sc++) {
                    let bCol = g._getBindingColumn(g.cells, sr, g.columns[sc]);
                    if (!bCol.getIsRequired(row) && !bCol.isReadOnly) { // delete collapsed cells (TFS 465074)
                    //if (!bCol.getIsRequired(row) && g.canEditCell(row.index, sc)) { // don't delete collapsed cells
                        if (g.getCellData(sr, sc, true)) {
                            rngCell.setRange(sr, sc);
                            e.cancel = false;
                            if (g.onBeginningEdit(e)) { // TFS 250022
                                let item = row.dataItem,
                                    currItem = ecv ? ecv.currentEditItem : null;

                                // raise row edit start/end events (TFS 436396)
                                if (currItem && item != currItem) {
                                    g.onRowEditEnding(rowArgs);
                                    g.onRowEditEnded(rowArgs);
                                }
                                if (item != currItem) {
                                    rowArgs._rng.setRange(sr, -1);
                                    g.onRowEditStarting(rowArgs);
                                    g.onRowEditStarted(rowArgs);
                                }

                                if (ecv) { // TFS 255424, 260954, 267220
                                    ecv.editItem(item);
                                    g._edtHdl._edItem = item;
                                }
                                g.setCellData(sr, sc, '', true, false); // TFS 118470
                                g.onCellEditEnding(e);
                                g.onCellEditEnded(e);
                            }
                        }
                    }
                }
            }
        }
    }

    // start editing and pass the event that caused the edit to start
    private _startEditing(fullEdit: boolean, evt: any, r?: number, c?: number): boolean {
        return this._g._edtHdl.startEditing(fullEdit, r, c, true, evt);
    }
}
    }
    


    module wijmo.grid {
    












'use strict';

// allow resizing by dragging regular cells as well as headers
const _AR_ALLCELLS = 4;
const _WJC_DRAGSRC = 'wj-state-dragsrc';
const _WJC_FLEXGRID = 'wj-flexgrid';

/**
 * Specifies constants that define the row/column sizing behavior.
 */
export enum AllowResizing {
    /** The user may not resize rows or columns. */
    None = 0,
    /** The user may resize columns by dragging the edge of the column headers. */
    Columns = 1,
    /** The user may resize rows by dragging the edge of the row headers. */
    Rows = 2,
    /** The user may resize rows and columns by dragging the edge of the headers. */
    Both = Rows | Columns, // 3
    /** The user may resize columns by dragging the edge of any cell. */
    ColumnsAllCells = Columns | _AR_ALLCELLS, // 5
    /** The user may resize rows by dragging the edge of any cell. */
    RowsAllCells = Rows | _AR_ALLCELLS, // 6
    /** The user may resize rows and columns by dragging the edge of any cell. */
    BothAllCells = Both | _AR_ALLCELLS // 7
}

/**
 * Specifies constants that define the row/column auto-sizing behavior.
 */
export enum AutoSizeMode {
    /** Autosizing is disabled. */
    None = 0,
    /** Autosizing accounts for header cells. */
    Headers = 1,
    /** Autosizing accounts for data cells. */
    Cells = 2,
    /** Autosizing accounts for header and data cells. */
    Both = Headers | Cells
}

/**
 * Specifies constants that define the row/column dragging behavior.
 */
export enum AllowDragging {
    /** The user may not drag rows or columns. */
    None = 0,
    /** The user may drag columns. */
    Columns = 1,
    /** The user may drag rows. */
    Rows = 2,
    /** The user may drag rows and columns. */
    Both = Rows | Columns
}

/**
 * Handles the grid's mouse commands.
 */
export class _MouseHandler {
    _g: FlexGrid;
    _htDown: HitTestInfo;           // hit test on mouse down
    _htDrag: HitTestInfo;           // hit test on mouse move
    _selDown: CellRange;            // selection on mouse down
    _isDown: boolean;               // mouse is currenty down
    _eMouse: MouseEvent;            // last mouse event
    _lbSelState: boolean;           // listbox selected state on mouse down
    _szRowCol: RowCol;              // row/col being resized
    _szStart: number;               // row/col starting size
    _szArgs: CellRangeEventArgs;    // row/col resize args
    _dragSrc: any;                  // element being dragged
    _dvMarker: HTMLElement;         // drag marker element
    _rngTarget: CellRange;          // drag target range
    _updating: boolean;             // suspend events while dragging
    _ignoreClick: boolean;          // whether to ignore the next click event
    _chldColGrpMarker: boolean;     // whether the drag marker associated with child column group

    static _SZ_MIN = 0; // minimum size allowed when resizing rows/cols
    static _SZ_MAX_COLGRP_EDGE = 50; // maximum edge size for dragged column groups

    /**
     * Initializes a new instance of the {@link _MouseHandler} class.
     *
     * @param g {@link FlexGrid} that owns this {@link _MouseHandler}.
     */
    constructor(g: FlexGrid) {
        let host = g.hostElement,
            addListener = g.addEventListener.bind(g),
            removeListener = g.removeEventListener.bind(g);
        this._g = g;

        // create target indicator element
        this._dvMarker = wijmo.createElement('<div class="wj-marker">&nbsp;</div>');

        // mouse events:

        // when the user presses the mouse on the control, hook up handlers to 
        // mouse move/up on the *document*, and unhook on mouse up.
        // this simulates a mouse capture.
        // note: use 'document' since 'window' doesn't work on Android.
        addListener(host, 'mousedown', (e: MouseEvent) => {

            // to make sure hit testing has up-to-date info
            g._rcBounds = null;

            // start actions on left button only: TFS 114623
            if (!e.defaultPrevented && e.button == 0) {

                // get the focus now, without scrolling
                // (TFS 261336, 275042, 275694, 271845, 289442)
                let target = e.target as HTMLElement;
                if (!g.containsFocus()) {
                    let eFocus = target instanceof HTMLElement && target.tabIndex > -1 ? target : g._eFocus;
                    g._setFocusNoScroll(eFocus);
                }

                // and make sure the grid gets the focus at some point
                // (in case the target element is not focusable, happens in Chrome)
                // (TFS 81949, 102177, 120430, 265730, 265207, 267167)
                setTimeout(() => {
                    if (!e.defaultPrevented) {
                        g.focus();
                    }
                });

                // check whether the target belongs to another nested grid: TFS 200695
                // NOTE: could be null if target is an SVGElementInstance
                let pGrid = wijmo.closestClass(target, _WJC_FLEXGRID);

                // allow input elements that don't belong to us to handle the mouse
                // but select the cell anyway, or scroll it into view if it's a header
                if ((pGrid && pGrid != g.hostElement) || // not our grid
                    (
                        !g.activeEditor && g._isInputElement(target) &&
                        !this._hasRadioMap(e) && !g._isNativeCheckbox(target)
                    )) { // not our editor

                    // select/scroll to show the focused element
                    let ht = g.hitTest(e),
                        CT = CellType;
                    switch (ht.cellType) {

                        // scroll target into view, not the whole cell
                        // better option when tall cells have buttons (TFS 311286)
                        case CT.Cell:
                            g.select(ht.range, false);
                            if (target instanceof HTMLElement && // extra safety against SVG
                                target.getAttribute('wj-part') != 'root') { // no focus on root (TFS 372631)
                                target.focus();
                            }
                            break;

                        // scroll column into view
                        case CT.ColumnHeader:
                        case CT.ColumnFooter:
                            g.scrollIntoView(-1, ht.col);
                            break;

                        // scroll row into view
                        case CT.RowHeader:
                            g.scrollIntoView(ht.row, -1);
                            break;
                    }

                    // make sure input elements have the focus in IE (TFS 434847)
                    if (wijmo.isIE() && ht.cellType != CT.Cell && g._isInputElement(target)) {
                        target.focus();
                    }

                    // let the target handle the event
                    return;
                }

                // the event belongs to us, let's handle it
                //if (!this._isDown) { // IE11/Win7 may not fire mouseup on scrollbars (TFS 299308)

                // sanity
                let doc = document;
                removeListener(doc, 'mousemove');
                removeListener(doc, 'mouseup');

                // connect
                addListener(doc, 'mousemove', mouseMove);
                addListener(doc, 'mouseup', mouseUp);

                // mouse is down
                this._isDown = true;
                this._mousedown(e);
            }
        });
        let mouseMove = (e: MouseEvent) => {
            this._mousemove(e);
        };
        let mouseUp = (e: MouseEvent) => {
            this._isDown = false;
            removeListener(document, 'mousemove');
            removeListener(document, 'mouseup');
            this._mouseup(e);
        };

        // make sure hit testing has up-to-date info (TFS 293738)
        addListener(host, 'mouseenter', (e: MouseEvent) => {
            g._rcBounds = null;
        });

        // offer to resize on mousemove (pressing the button not required)
        addListener(host, 'mousemove', this._hover.bind(this));

        // handle double-click to auto-size rows/columns
        addListener(host, 'dblclick', this._dblclick.bind(this));

        // handle click events (in an accessible way)
        addListener(host, 'click', this._click.bind(this));

        // prevent user from selecting grid content (as text)
        addListener(host, 'selectstart', (e) => {
            if (!g._isInputElement(e.target)) {
                e.preventDefault();
            }
        });

        // custom handling for wheel events (TFS 250507, 440376)
        addListener(host, 'wheel', (e: WheelEvent) => {
            if (!e.defaultPrevented && e.deltaY && !e.ctrlKey && !e.metaKey) {
                let root = g._root,
                    delta = e.deltaY,
                    canScroll = e.shiftKey // TFS 440376
                        ? root.scrollWidth > root.clientWidth
                        : root.scrollHeight > root.clientHeight;

                // make sure this grid is scrollable
                if (canScroll) {

                    // make sure this is not a nested grid
                    if (wijmo.closestClass(e.target, _WJC_FLEXGRID) == g.hostElement) {

                        // calculate delta y
                        switch (e.deltaMode) {
                            case 1: // by line
                                delta = g.rows.defaultSize * (delta < 0 ? -1 : +1);
                                break;
                            case 2: // by page
                                let pageSize = e.shiftKey
                                    ? root.clientWidth
                                    : root.clientHeight;
                                delta = pageSize * (delta < 0 ? -1 : +1);
                                break;
                            case 0: // by pixel
                            default:
                                if (wijmo.isSafari()) {
                                    delta = wijmo.clamp(delta, -150, 150); // limit delta on Mac/Safari
                                }
                                break;
                        }

                        // get focus, but don't scroll: TFS 354832, 392727
                        if (!g.containsFocus()) { // TFS 467957
                            g._eFocus.focus(); // close IME composition if any
                        }

                        // apply delta and be done with the event
                        if (g.finishEditing(false)) { // TFS 455280
                            if (e.shiftKey) { // scroll horizontally
                                root.scrollLeft += delta;
                            } else { // scroll vertically
                                root.scrollTop += delta;
                            }
                        }

                        // done with this event
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
        }); // no capture: TFS 466639

        // row and column dragging
        addListener(host, 'dragstart', this._dragstart.bind(this));
        addListener(host, 'dragover', this._dragover.bind(this));
        addListener(host, 'dragleave', this._dragover.bind(this));
        addListener(host, 'drop', this._drop.bind(this));
        addListener(host, 'dragend', this._dragend.bind(this));
    }

    /**
     * Resets the mouse state.
     */
    resetMouseState() {
        let g = this._g,
            host = g.hostElement;

        // restore updates after dragging (TFS 350597: safer here than in dragend)
        if (this._updating) {
            this._updating = false;
            g.endUpdate();
        }

        // because dragend fires too late in Firefox...
        if (this._dragSrc) {
            wijmo.removeClass(this._dragSrc, _WJC_DRAGSRC);
        }
        this._showDragMarker(null);

        // reset cursor state (if the grid hasn't been disposed)
        if (host) {
            host.style.cursor = '';
        }

        // restore draggable attribute on header cells
        if (wijmo.isSafari() && this._szRowCol) { // TFS 444822
            g.invalidate();
        }

        // remove event listeners just in case
        g.removeEventListener(document, 'mousemove');
        g.removeEventListener(document, 'mouseup');

        // reset everything else
        this._eMouse = null;
        this._isDown = null;
        this._htDown = null;
        this._lbSelState = null;
        this._szRowCol = null;
        this._szArgs = null;
        g._rcBounds = null;
    }

    // handles the mouse down event
    private _mousedown(e: MouseEvent) {
        let g = this._g,
            target = e.target as HTMLElement,
            ht = g.hitTest(e),
            ct = ht.cellType,
            CT = CellType,
            ctrlKey = e.ctrlKey || e.metaKey;

        // remember selection when mouse went down
        this._selDown = g.selection;

        // assume we want the click event
        this._ignoreClick = false;

        // clicking on the cells panel
        if (ht.panel == g.cells) {

            // handle drop-down items (even on editors, TFS 266120)
            if (wijmo.closestClass(target, CellFactory._WJC_DROPDOWN)) {
                let htCell = g.hitTest(target); // account for merging: TFS 441767                
                g._edtHdl._toggleListBox(e, htCell.range);
                e.preventDefault();
                this._ignoreClick = true;
                return;
            }

            // if the user clicked an active editor, let the editor handle things
            let rngEdit = g.editRange;
            if (rngEdit && rngEdit.contains(ht.range)) {
                return;
            }
        }

        // ignore clicks on focused input elements (TFS 135271)
        let ae = wijmo.getActiveElement();
        if (target == ae && g._isInputElement(target)) {
            return;
        }

        // ignore clicks on unknown areas
        if (ct == CT.None) {
            g.finishEditing(); // finish editing (TFS 311360)
            if (target != g._root && // commit row edits (TFS 305568, 229996)
                target != g._fCt) { // IE<11 does not support pointer-events (TFS 316370)
                g._edtHdl._commitRowEdits();
            }
            return;
        }

        // check where the mouse is
        this._htDown = ht;
        this._eMouse = e;

        // handle resizing
        if (this._szRowCol != null) {
            let eFocus = g._eFocus;
            if (ae != eFocus) {
                eFocus.tabIndex = 0; // TFS 284222
                eFocus.focus();
            }
            this._ignoreClick = true;
            this._handleResizing(e);
            return;
        }

        // prevent row/col/all selection if auto-sizing
        let ar = g.allowResizing,
            AR = AllowResizing;
        if (ct == CT.RowHeader || ct == CT.TopLeft) {
            if (ht.edgeBottom && (ar & AR.Rows)) {
                if (this._getResizeRowHt(ht)) {
                    this._ignoreClick = true;
                    return;
                }
            }
        }
        if (ct == CT.ColumnHeader || ct == CT.TopLeft) {
            if (ht.edgeRight && (ar & AR.Columns)) {
                if (this._getResizeColHt(ht)) {
                    this._ignoreClick = true;
                    return;
                }
            }
        }

        // starting cell selection? special handling for ListBox mode
        let ad = g.allowDragging,
            AD = AllowDragging;
        switch (ct) {
            case CT.Cell: // selecting cells
            case CT.RowHeader: // selecting rows
                if (ctrlKey && g.selectionMode == SelectionMode.ListBox) { // ctrl+key toggles ListBox selection
                    this._lbSelState = g.rows[ht.row].isSelected;

                    // always select when ctrl+clicking the collapse element (TFS 457641)
                    if (wijmo.closest(target, '.wj-elem-collapse')) {
                        this._lbSelState = false;
                    }
                }
                this._mouseSelect(e, e.shiftKey);

                // if this is a non-draggable row header, prevent default and get the focus
                if (ct == CT.RowHeader && !(ad & AD.Rows)) {
                    e.preventDefault(); // TFS 311164
                    g.focus(); // TFS 311709
                }
                break;
            case CT.ColumnHeader: // selecting columns
                if (!g.allowSorting && !(ad & AD.Columns)) {
                    if (!wijmo.closest(target, 'button')) { // ignore clicks on filter buttons: TFS 474789
                        this._mouseSelect(e, e.shiftKey);
                    }
                }
                break;
        }
    }

    // handles the mouse move event
    private _mousemove(e: MouseEvent) {
        if (this._htDown && !e.defaultPrevented) {

            // in case we lost the focus or the button (TFS 145149)
            // note that e.buttons is not supported in Safari, and
            // e.which only works correctly (like e.buttons) in Chrome.
            if (e.buttons == 0) {
                //console.log('lost the mouse?');
                if (this._eMouse && (e.timeStamp - this._eMouse.timeStamp > 600)) { // TFS 242655
                    //console.log('yes, resetting...: ' + (e.timeStamp - this._eMouse.timeStamp));
                    this.resetMouseState();
                    return;
                }
            }

            // handle the event as usual
            this._eMouse = e;
            if (this._szRowCol) {
                this._handleResizing(e);
            } else {
                let g = this._g,
                    ad = g.allowDragging,
                    AD = AllowDragging,
                    CT = CellType;
                switch (this._htDown.cellType) {
                    case CT.Cell:
                        this._mouseSelect(e, true);
                        break;
                    case CT.RowHeader:
                        if (!(ad & AD.Rows)) {
                            this._mouseSelect(e, true);
                        }
                        break;
                    case CT.ColumnHeader:
                        if (!(ad & AD.Columns) && !g.allowSorting) {
                            this._mouseSelect(e, true);
                        }
                        break;
                }
            }
        }
    }

    // handles the mouse up event
    private _mouseup(e: MouseEvent) {
        let g = this._g;

        // IE raises mouseup while touch-dragging...???
        if (g.isTouching) {
            if (this._dragSrc || e.target instanceof HTMLHtmlElement) {
                return;
            }
        }

        // finish resizing, pin columns, collapse/expand column groups
        let ht = g.hitTest(e),
            htd = this._htDown;
        if (htd && !e.defaultPrevented) {

            // finish resizing
            // (the mouse may go up anywhere, so this may not translate into a click)
            if (this._szArgs) {
                this._finishResizing(e);
            }

            // handle clicks on recycled cells (same cell, different target element)
            // e.g. a row is in edit mode, you click a checkbox on a different row
            // mousedown (old cell) => refresh => mouseup (refreshed cell) => no click..
            if (!this._szArgs && ht.panel == htd.panel && ht.row == htd.row && ht.col == htd.col) {
                let col = ht.getColumn();
                if (col) {
                    let interopTemplate = col._getFlag(RowColFlags.HasTemplate) && !col.cellTemplate;
                    if (!interopTemplate) { // don't do this on interop-templated cells (TFS 441423, 435251)

                        // get the target
                        let target = ht.target as HTMLElement;
                        if (target != htd.target && target instanceof HTMLElement) {
                            if (htd.target instanceof HTMLInputElement) {
                                let p1 = ht.point,
                                    p2 = htd.point;
                                if (Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) < 10) { // TFS 435132
                                    target = target.querySelector('input') || target;
                                }
                            }

                            // dispatch the click
                            ////target.click(); // simpler, but we need event parameters
                            let evt = document.createEvent('Event') as any;
                            evt.initEvent('click', true, true);
                            for (let k in e) { // copy key/mouse parameters (TFS 442201, 453992)
                                if (/Key$|X$|Y$|^button|^(x|y|which)$/.test(k)) {
                                    evt[k] = e[k]
                                }
                            }
                            target.dispatchEvent(evt);
                        }
                    }
                }
            }
        }

        // done with the mouse
        this.resetMouseState();
    }

    // handle clicks
    private _click(e: MouseEvent) {

        // ignore clicks if we just resized a row/column or toggled a drop-down (TFS 434567, 441450)
        if (this._ignoreClick) {
            this._ignoreClick = false;
            e.preventDefault();
        }

        // handle the event as usual
        if (!e.defaultPrevented) {
            let g = this._g,
                target = e.target as HTMLElement,
                ht = g.hitTest(target);

            // get native checkbox from target
            let edt = wijmo.tryCast(target, HTMLInputElement) as HTMLInputElement,
                cbSelector = 'input.' + CellFactory._WJC_CHECKBOX;
            if (!edt) { // handle spans within labels (TFS 467744)
                let label = wijmo.closest(target, 'label');
                if (label) {
                    edt = label.querySelector(cbSelector) as HTMLInputElement;
                }
            }

            // translate big into native checkboxes (TFS 378198, 424111)
            if (!edt && g.bigCheckboxes) { // TFS 378198
                edt = target.querySelector(cbSelector) as HTMLInputElement;
            }

            // handle native checkboxes
            if (edt != g.activeEditor && g._isNativeCheckbox(edt)) {
                if (ht.panel == g.cells) { // TFS 424111
                    let chk = g.getCellData(ht.row, ht.col, false) as boolean;
                    if (g.startEditing(false, ht.row, ht.col, false, e)) {
                        g.activeEditor.checked = !chk; // toggle checkbox (TFS 424962)
                        g.finishEditing();
                        g.focus(); // to work with checkbox + span (TFS 430282, 431787)
                    } else {
                        edt.checked = chk; // canceled, restore original state
                    }
                }
                return;
            }

            // radio maps
            if (this._hasRadioMap(e)) {
                this._handleClick(e);
                return;
            }

            // handle collapse/expand groups (after selecting the cell)
            let ctrlKey = e.ctrlKey || e.metaKey;
            if (g.rows.maxGroupLevel > -1 && wijmo.closestClass(target, CellFactory._WJC_COLLAPSE)) {
                let gr = g.rows[ht.row] as GroupRow;
                if (ht.panel == g.cells && gr instanceof GroupRow) {
                    if (ctrlKey) { // ctrl+click: collapse/expand entire outline to this level
                        g.collapseGroupsToLevel(gr.isCollapsed ? gr.level + 1 : gr.level);
                    } else { // simple click: toggle this group
                        gr.isCollapsed = !gr.isCollapsed;
                    }
                    return;
                }
            }

            // click on selected cell to start editing
            if (!ctrlKey && !e.shiftKey && !g.activeEditor) { // TFS 432817
                if (ht.panel == g.cells) {
                    let sel = g._selHdl.selection;
                    if (sel.equals(this._selDown) && ht.range.contains(sel)) { // TFS 438509
                        g.startEditing(true, null, null, true, e); // like pressing F2: TFS 434908
                        return;
                    }
                }
            }

            // more click handling
            // REVIEW: move _handleClick in here
            this._handleClick(e);
        }
    }

    private _handleClick(e: MouseEvent) {
        let g = this._g,
            target = e.target as HTMLElement,
            ht = g.hitTest(target), // don't rely on click event coordinates: TFS 435251
            ctrlKey = e.ctrlKey || e.metaKey,
            panel = ht.panel;
        if (!e.defaultPrevented && ht.grid == g) {

            // handle data map radio buttons
            if (panel == g.cells && this._hasRadioMap(e)) {
                let label = wijmo.closest(target, 'label'), // TFS 469494
                    btn = label && label.querySelector('input');
                if (btn && !btn.disabled) {
                    if (g.startEditing(false, ht.row, ht.col, false, e)) { // pass event reference: WJM-19439
                        if (g.finishEditing()) { // raise cellEditEnding/Ended events (before setting the data: WJM-19439)
                            if (g._edtHdl._edtCanceled) {
                                e.preventDefault(); // cancel click event
                            } else {
                                g.setCellData(ht.row, ht.col, // commit the change
                                    label.textContent, // value
                                    true, // coerce
                                    g.refreshOnEdit); // invalidate (TFS 469494)
                            }
                        }
                    }
                }
                return;
            }

            // handle everything else
            if (!g._isInputElement(target)) {

                // clicking on top-left panel to select the whole grid
                if (panel == g.topLeftCells) {
                    let SM = SelectionMode;
                    switch (g.selectionMode) {
                        case SM.None:
                        case SM.Cell:
                            break;
                        default:
                            g.selectAll(); // TFS 433455
                    }
                    return;
                }

                // clicking on column header to pin, group, and sort columns
                if (panel == g.columnHeaders) {
                    if (g.allowPinning && wijmo.closestClass(target, CellFactory._WJC_PIN)) { // pin
                        this._clickPin(e, ht);
                    } else if (!g._isTransposed() && wijmo.closestClass(e.target, CellFactory._WJC_COLLAPSE)) { // toggle column group
                        let grp = g._getColumnGroup(ht.row, ht.col);
                        if (grp) {
                            if (ctrlKey) { // collapse/expand all groups at this level
                                let isCollapsed = grp.isCollapsed,
                                level = grp.level,
                                groups = [];
                                for (let c = 0; c < g.columns.length; c++) {
                                    grp = g._getColumnGroup(ht.row, c);
                                    if (grp && grp.collapseTo && grp.level == level && groups.indexOf(grp) < 0) {
                                        groups.push(grp);
                                        grp.isCollapsed = !isCollapsed;
                                    }
                                }
                            } else {
                                grp.isCollapsed = !grp.isCollapsed;
                            }
                        }
                    } else { // sort (unless the click was on an input element)
                        if (target instanceof HTMLSpanElement && target.parentElement instanceof HTMLLabelElement) {
                            target = target.parentElement.querySelector('input');
                        }
                        if (!(target instanceof HTMLInputElement)) {
                            this._clickSort(e, ht);
                        }
                        g.focus();
                    }
                    return;
                }

                // clicking on row header to group rows
                if (panel == g.rowHeaders) {
                    if (g._isTransposed() && wijmo.closestClass(e.target, CellFactory._WJC_COLLAPSE)) { // toggle row group
                        let grp = g._getColumnGroup(ht.row, ht.col);
                        if (grp) {
                            if (ctrlKey) { // collapse/expand all groups at this level
                                let isCollapsed = grp.isCollapsed,
                                level = grp.level,
                                groups = [];
                                for (let r = 0; r < g.rows.length; r++) {
                                    grp = g._getColumnGroup(r, ht.col);
                                    if (grp && grp.collapseTo && grp.level == level && groups.indexOf(grp) < 0) {
                                        groups.push(grp);
                                        grp.isCollapsed = !isCollapsed;
                                    }
                                }
                            } else {
                                grp.isCollapsed = !grp.isCollapsed;
                            }
                        }
                    }
                    return;
                }

                //// clicking on row header to select a row  (already handled on mousedown)
                ////else if (panel == g.rowHeaders) {
                ////    switch (g.selectionMode) {
                ////        case SM.None:
                ////        case SM.Cell:
                ////            break;
                ////        default:
                ////            if (g.rows.length && g.columns.length) { // TFS 296943
                ////                g.select(new CellRange(ht.row, 0, ht.row, g.columns.length - 1));
                ////            }
                ////            break;
                ////    }
                ////}

                // clicking on the cells panel (collapse/drop-down/select)
                if (panel == g.cells) {

                    // sort by clicking hidden header row
                    if (ht.row < 0) {
                        this._clickSort(e, ht);
                        return;
                    }

                    // toggle group collapsed state
                    if (wijmo.closestClass(target, CellFactory._WJC_COLLAPSE)) {
                        let gr = g.rows[ht.row];
                        if (gr instanceof GroupRow) {
                            if (ctrlKey) {
                                g.collapseGroupsToLevel(gr.isCollapsed ? gr.level + 1 : gr.level);
                            } else {
                                gr.isCollapsed = !gr.isCollapsed;
                            }
                        }
                        return;
                    }

                    // toggle drop-down list (mousedown OR click: TFS 441450)
                    if (wijmo.closestClass(target, CellFactory._WJC_DROPDOWN)) {
                        g._edtHdl._toggleListBox(e, ht.range);
                    }
                }
            }
        }
    }

    // checks whether an element belongs to a non-empty radio map (TFS 419981, 420420, 469494)
    private _hasRadioMap(e: MouseEvent): boolean {
        let target = e.target;
        if (wijmo.closest(target, 'label')) { // target is in a label element
            let map = wijmo.closestClass(target, CellFactory._WJC_RADIOMAP) as HTMLElement; // in a radio-map cell
            return wijmo.closestClass(map, _WJC_FLEXGRID) == this._g.hostElement; // in our grid
        }
        return false;
    }

    // flips the sort order when a column header is clicked
    private _clickSort(e: MouseEvent, ht: HitTestInfo) {
        let g = this._g,
            allowSorting = g.allowSorting,
            cv = g.collectionView,
            sds = cv ? cv.sortDescriptions : null,
            ctrlKey = e.ctrlKey || e.metaKey,
            shiftKey = e.shiftKey;

        // check that the grid and collectionView support sorting
        if (!cv || !cv.canSort || allowSorting == AllowSorting.None) {
            return;
        }

        // get row and column to sort
        // row < 0 indicates the hidden column header cells
        let col = ht.panel.columns[ht.col],
            bCol = g._getBindingColumn(ht.panel, ht.row, col),
            bindingSort = bCol ? bCol._getBindingSort() : null;

        // check that the column can be sorted
        if (!bCol.allowSorting || !bindingSort) {
            return;
        }

        // don't sort if this is a horizontally merged column header
        if (col == bCol) {
            let rng = g.getMergedRange(ht.panel, ht.row, ht.col, false);
            if (rng && rng.columnSpan > 1) {
                return;
            }
        }

        // sort the column
        let args = new CellRangeEventArgs(ht.panel, ht.range, e);
        if (g.onSortingColumn(args)) {

            // commit pending edits or the sort won't work...
            g._edtHdl._commitRowEdits();

            // find current sort for this column
            let index = -1,
                currSort: wijmo.collections.SortDescription = null;
            for (let i = 0; i < sds.length; i++) {
                if (sds[i].property == bindingSort) {
                    index = i;
                    currSort = sds[i];
                    break;
                }
            }

            // apply new sort
            sds.deferUpdate(() => {
                if (ctrlKey && shiftKey) {
                    
                    // shift-control+click clears all sorts
                    sds.clear();

                } else if (!currSort) {

                    // clear any existing sorts
                    if (allowSorting != AllowSorting.MultiColumn) {
                        sds.clear();
                    }

                    // add new sort
                    let sd = new wijmo.collections.SortDescription(bindingSort, true);
                    sds.push(sd);

                } else {

                    // check whether we're removing the current sort
                    let remove = ctrlKey;
                    if (!remove && g.isTouching) {
                        remove = currSort.ascending == false;
                    }

                    // remove or flip the sort
                    if (remove) {
                        sds.removeAt(index);
                    } else {
                        sds[index] = new wijmo.collections.SortDescription(bindingSort, !currSort.ascending);
                    }
                }
            });

            // all done!
            g.onSortedColumn(args);
        }
    }

    // pin/unpin a column when the pin button is clicked
    private _clickPin(e: MouseEvent, ht: HitTestInfo) {
        let g = this._g,
            cols = g.columns,
            fCols = cols.frozen,
            pin = g.allowPinning as AllowPinning;

        // pin column or column range
        if (pin == AllowPinning.Both) {
            pin = e.shiftKey ? AllowPinning.ColumnRange : AllowPinning.SingleColumn;
        }

        // about to pin/unpin column(s)
        let args = new CellRangeEventArgs(g.cells, ht.range);
        if (g.onPinningColumn(args)) {

            // pin/unpin a single column
            if (pin == AllowPinning.SingleColumn) {
                if (ht.col >= fCols) { // pinning
                    cols.moveElement(ht.col, fCols, false);
                    cols.frozen++;
                } else { // unpinning
                    cols.moveElement(ht.col, fCols - 1, false);
                    cols.frozen--;
                }
            }

            // pin/unpin a column range
            if (pin == AllowPinning.ColumnRange) {
                if (ht.col + 1 != fCols) { // pinning
                    cols.frozen = ht.col + 1;
                } else { // unpinning
                    cols.frozen = 0;
                }
            }

            // done pinning column(s)
            g.onPinnedColumn(args);
        }
    }

    // handles double-clicks
    private _dblclick(e: MouseEvent) {

        // ignore if already handled
        if (e.defaultPrevented) {
            return;
        }

        // prepare to auto-size
        let g = this._g,
            ht = g.hitTest(e),
            ctrlKey = e.ctrlKey || e.metaKey,
            rng = ht.range,
            ct = ht.cellType,
            CT = CellType,
            sel = g.selection,
            ar = g.allowResizing,
            AR = AllowResizing,
            args: CellRangeEventArgs;

        // auto-size columns
        if (ht.edgeRight && (ar & AR.Columns)) {
            if (ct == CT.TopLeft) {
                if (ht.panel.columns[ht.col].allowResizing) {
                    args = new CellRangeEventArgs(ht.panel, new CellRange(-1, ht.col));
                    if (g.onAutoSizingColumn(args) && g.onResizingColumn(args)) {
                        this._ignoreClick = true;
                        g.autoSizeColumn(ht.col, true);
                        g.onAutoSizedColumn(args);
                        g.onResizedColumn(args);
                        e.preventDefault();
                    }
                }
            } else if (ct == CT.ColumnHeader || (ar & _AR_ALLCELLS)) { // TFS 152259
                if (ct == CT.ColumnHeader && ctrlKey && sel.containsColumn(ht.col)) {
                    rng = sel;
                }
                let isHeader = (ct == CT.RowHeader || ct == CT.BottomLeft);
                for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                    if (ht.panel.columns[c].allowResizing) {
                        args = new CellRangeEventArgs(ht.panel, new CellRange(-1, c));
                        if (g.onAutoSizingColumn(args) && g.onResizingColumn(args)) {
                            this._ignoreClick = true;
                            g.autoSizeColumn(c, isHeader); // TFS 469604
                            g.onResizedColumn(args);
                            g.onAutoSizedColumn(args);
                            e.preventDefault();
                        }
                    }
                }
            }
            this.resetMouseState();
            return;
        }

        // auto-size rows
        if (ht.edgeBottom && (ar & AR.Rows)) {
            if (ct == CT.TopLeft || ct == CT.BottomLeft) { // TFS 469604
                if (ht.getRow().allowResizing) {
                    let isHeader = ct == CT.TopLeft ? true : null; // true for headers, null for footers
                    args = new CellRangeEventArgs(ht.panel, new CellRange(ht.row, -1));
                    if (g.onAutoSizingRow(args) && g.onResizingRow(args)) {
                        this._ignoreClick = true;
                        g.autoSizeRow(ht.row, isHeader);
                        g.onResizedRow(args);
                        g.onAutoSizedRow(args);
                        e.preventDefault();
                    }
                }
            } else if (ct == CT.RowHeader || (ar & _AR_ALLCELLS)) { // TFS 152259
                let panel = ht.panel,
                    isHeader = panel == g.columnHeaders ? true
                        : panel == g.columnFooters ? null
                        : false; // cells
                if (ctrlKey && sel.containsRow(ht.row) && panel == g.cells) {
                    rng = sel;
                }
                for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                    if (panel.rows[r].allowResizing) {
                        args = new CellRangeEventArgs(panel, new CellRange(r, -1));
                        if (g.onAutoSizingRow(args) && g.onResizingRow(args)) {
                            this._ignoreClick = true;
                            g.autoSizeRow(r, isHeader);
                            g.onResizedRow(args);
                            g.onAutoSizedRow(args);
                            e.preventDefault();
                        }
                    }
                }
            }
            this.resetMouseState();
            return;
        }
    }

    // offer to resize rows/columns
    private _hover(e: MouseEvent): HitTestInfo {

        // make sure we're hovering
        if (!this._isDown) {
            let g = this._g,
                ht = g.hitTest(e),
                cursor = '';

            // find which row/column is being resized
            this._szRowCol = this._getResizeColHt(ht) || this._getResizeRowHt(ht);

            // keep track of element to resize and original size
            if (this._szRowCol instanceof Column) {
                cursor = 'col-resize';
            } else if (this._szRowCol instanceof Row) {
                cursor = 'row-resize';
            }
            this._szStart = this._szRowCol ? this._szRowCol.renderSize : 0;

            // update the cursor to provide user feedback
            g.hostElement.style.cursor = cursor;

            // done
            return ht;
        }

        // no hit-test
        return null;
    }

    // get the column about to be resized based on a HitTestInfo
    private _getResizeColHt(ht: HitTestInfo): Column {
        let g = this._g,
            ar = g.allowResizing,
            ct = ht.cellType,
            CT = CellType,
            AR = AllowResizing,
            col: Column;
        if (ar & AR.Columns) {
            if (ct == CT.ColumnHeader || ct == CT.TopLeft || (ar & _AR_ALLCELLS)) { // TFS 430309, 152259
                if (ht.edgeRight) { // this
                    col = ht.getColumn();
                }
                if (ht.edgeFarRight) { // this or next
                    col = this._getResizeCol(ht.panel, ht.col) || ht.getColumn();
                }
                if (ht.edgeLeft) { // previous
                    col = this._getResizeCol(ht.panel, ht.col, true) || col; // WJM-19553
                }
            }
        }
        return col && col.allowResizing ? col : null; // TFS 420897
    }

    // get the row about to be resized based on a HitTestInfo
    private _getResizeRowHt(ht: HitTestInfo): Row {
        let g = this._g,
            ar = g.allowResizing,
            AR = AllowResizing,
            ct = ht.cellType,
            CT = CellType,
            row: Row;
        if (ar & AR.Rows) {
            if (ct == CT.RowHeader || ct == CT.TopLeft || (ar & _AR_ALLCELLS)) { // TFS 430309, 152259
                if (ht.edgeBottom) { // this
                    row = ht.getRow();
                }
                if (ht.edgeFarBottom) { // this or next
                    row = this._getResizeRow(ht.panel, ht.row) || ht.getRow();
                }
                if (ht.edgeTop) { // previous
                    row = this._getResizeRow(ht.panel, ht.row, true) || row; // WJM-19553
                }
            }
        }
        return row && row.allowResizing ? row : null; // TFS 420897
    }

    // get the next/previous visible/resizable column with zero size
    /* private */ _getResizeCol(panel: GridPanel, index: number, previous = false): Column {
        let g = this._g,
            cols = panel.columns;

        // get the previous visible column with zero size
        if (previous) {

            // look in this panel
            for (let c = index - 1; c >= 0; c--) {
                let col = cols[c];
                if (col.isVisible) { // found a visible column
                    return this._asResizable(col) as Column;
                }
            }

            // look in the previous panel
            if (cols == g.columns && (g.headersVisibility & HeadersVisibility.Row) != 0) {
                cols = g.rowHeaders.columns;
                for (let c = cols.length - 1; c >= 0; c--) {
                    let col = cols[c];
                    if (col.isVisible) { // found a visible column
                        return this._asResizable(col) as Column;
                    }
                }
            }

            // not found
            return null;
        }

        // if the next column in the panel is visible but has zero size, switch
        for (let c = index + 1; c < cols.length; c++) {
            let col = cols[c];
            if (col.isVisible) { // found a visible column
                return this._asResizable(col) as Column;
            }
        }

        // if this is the last column on a header panel, and the first
        // column on the cells panel is visible but has zero size, switch
        if (index == cols.length - 1) {
            if (cols == g.rowHeaders.columns) {
                cols = g.columns;
                for (let c = 0; c < cols.length; c++) {
                    let col = cols[c];
                    if (col.isVisible) {
                        return this._asResizable(col) as Column;
                    }
                }
            }
        }

        // not found
        return null;
    }

    // get the next/previous visible/resizable row with zero size
    /*private*/ _getResizeRow(panel: GridPanel, index: number, previous = false): Row {
        let g = this._g,
            rows = panel.rows;

        // get the previous visible row with zero size
        if (previous) {

            // look in this panel
            for (let r = index - 1; r >= 0; r--) {
                let row = rows[r];
                if (row.isVisible) { // found a visible row
                    return this._asResizable(row) as Row;
                }
            }

            // look in the previous panel
            if (rows == g.rows && (g.headersVisibility & HeadersVisibility.Column) != 0) {
                rows = g.columnHeaders.rows;
                for (let r = rows.length - 1; r >= 0; r--) {
                    let row = rows[r];
                    if (row.isVisible) { // found a visible row
                        return this._asResizable(row) as Row;
                    }
                }
            }

            // not found
            return null;
        }

        // if the next row in the panel is visible but has zero size, switch
        for (let r = index + 1; r < rows.length; r++) {
            let row = rows[r];
            if (row.isVisible) { // found a visible row
                return this._asResizable(row) as Row;
            }
        }

        // if this is the last row on a header panel, and the first
        // row on the cells panel is visible but has zero size, switch
        if (index == rows.length - 1) {
            if (rows == g.columnHeaders.rows) {
                rows = g.rows;
                for (let r = 0; r < rows.length; r++) {
                    let row = rows[r];
                    if (row.isVisible) { // found a visible row
                        return this._asResizable(row) as Row;
                    }
                }
            }
        }

        // nothing...
        return null;
    }

    // checks that a row/column is resizable and has zero size
    private _asResizable(rc: RowCol): RowCol {
        return rc.renderSize == 0 && rc.allowResizing
            ? rc // zero size and resizable
            : null; // not found
    }

    // handles mouse moves while the button is pressed on the cell area
    private _mouseSelect(e: MouseEvent, extend: boolean) {
        let g = this._g;
        if (e && this._htDown && this._htDown.panel && g.selectionMode != SelectionMode.None) {

            // handle the selection
            let ht = new HitTestInfo(this._htDown.panel, e);
            this._handleSelection(ht, extend);

            // keep calling this if the user keeps the mouse outside the control without moving it
            // but don't do this in IE9, it can keep scrolling forever... TFS 110374
            // NOTE: doesn't seem to be an issue anymore, but keep the check just in case.
            if (!wijmo.isIE9() && e.button >= 0 && e.target != g._root) { // TFS 279213
                ht = new HitTestInfo(g, e);
                if (!ht.panel) {
                    setTimeout(() => {
                        if (this._isDown && this._eMouse) {
                            this._mouseSelect(this._eMouse, extend);
                        }
                    }, 100);
                }
            }
        }
    }

    // handles row and column resizing
    private _handleResizing(e: MouseEvent) {

        // no dragging when resizing
        if (e.type == 'mousedown') {
            if (wijmo.isSafari()) { // work around what looks like a Safari bug (TFS 444822)
                wijmo.setAttribute(e.target as HTMLElement, 'draggable', null);
            } else {
                e.preventDefault();
            }
        }

        // resizing column
        let col = this._szRowCol;
        if (col instanceof Column) {
            let g = this._g,
                pageX = wijmo.mouseToPage(e).x, // to support touch
                sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageX - this._htDown.point.x) * (g.rightToLeft ? -1 : 1)));
            if (col.renderSize != sz) {
                if (this._szArgs == null) {
                    let panel = g.rowHeaders.columns.indexOf(col) > -1 ? g.rowHeaders : g.cells;
                    this._szArgs = new CellRangeEventArgs(panel, new CellRange(-1, col.index));
                }
                this._szArgs.cancel = false;
                if (g.onResizingColumn(this._szArgs)) { // TFS 144204
                    if (g.deferResizing) {
                        this._showResizeMarker(sz);
                    } else {
                        col.width = sz;
                    }
                }
            }
        }

        // resizing row
        let row = this._szRowCol;
        if (row instanceof Row) {
            let g = this._g,
                pageY = wijmo.mouseToPage(e).y, // to support touch
                sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageY - this._htDown.point.y)));
            if (row.renderSize != sz) {
                if (this._szArgs == null) {
                    let panel = g.columnHeaders.rows.indexOf(row) > -1 ? g.columnHeaders :
                        g.columnFooters.rows.indexOf(row) > -1 ? g.columnFooters : // TFS 469604
                        g.cells;
                    this._szArgs = new CellRangeEventArgs(panel, new CellRange(row.index, -1));
                }
                this._szArgs.cancel = false;
                if (g.onResizingRow(this._szArgs)) { // TFS 144204
                    if (g.deferResizing) {
                        this._showResizeMarker(sz);
                    } else {
                        row.height = sz;
                    }
                }
            }
        }

        // to work with wijmo.touch (TFS 469283)
        if (this._szArgs) {
            e.preventDefault();
        }
    }

    // handles row and column dragging
    private _dragstart(e: DragEvent) {
        let g = this._g,
            ht = this._htDown,
            AD = AllowDragging,
            CT = CellType;

        // make sure this is event is ours
        if (!ht) {
            return;
        }

        // get drag source element (if we're not resizing)
        this._dragSrc = null;
        this._htDrag = null;
        this._chldColGrpMarker = false;
        if (!this._szRowCol) {
            let args = new CellRangeEventArgs(ht.panel, ht.range),
                ad = g.allowDragging,
                ct = ht.cellType,
                rows = ht.panel.rows,
                //cols = ht.panel.columns,
                col = ht.getColumn(true);
            
            // dragging columns
            //if (ht.col > -1 && cols[ht.col].allowDragging) {
            if (col && col.allowDragging) {
                if ((ct == CT.ColumnHeader || ct == CT.TopLeft) && (ad & AD.Columns)) {
                    if (g.onDraggingColumn(args)) {
                        this._dragSrc = e.target;
                    } else {
                        e.preventDefault(); // TFS 472145
                    }
                }
            }

            // dragging rows
            if (!this._dragSrc && ht.row > -1 && rows[ht.row].allowDragging) {
                let row = rows[ht.row];
                if (!(row instanceof GroupRow) && !(row instanceof _NewRowTemplate)) {
                    if (ct == CT.RowHeader && (ad & AD.Rows)) {
                        if (g.onDraggingRow(args)) {
                            this._dragSrc = e.target;
                        } else {
                            e.preventDefault(); // TFS 472145
                        }
                    }
                }
            }
        }

        // if we have a valid source, start dragging and stop propagation
        if (this._dragSrc && e.dataTransfer && !e.defaultPrevented) {

            // save HitTestInfo
            this._htDrag = ht;

            // start dragging and stop propagation (TFS 120810)
            wijmo._startDrag(e.dataTransfer, 'move');
            e.stopPropagation();

            // style source element
            wijmo.addClass(this._dragSrc, _WJC_DRAGSRC);

            // suspend updates while dragging
            g.beginUpdate();
            this._updating = true;
        }
    }
    private _dragend(e: DragEvent) {

        // reset dragging members
        this._dragSrc = null;
        this._htDrag = null;

        // always reset the mouse state
        this.resetMouseState();
    }
    private _dragover(e: DragEvent) {
        let g = this._g,
            ht = this._hitTest(e),
            htDown = this._dragSrc ? this._htDrag : null, // TFS 332066
            CT = CellType,
            valid = false;

        // check whether the move is valid
        if (htDown && ht.cellType == htDown.cellType) {
            let args = new CellRangeEventArgs(ht.panel, ht.range, htDown);
            if (ht.cellType == CT.ColumnHeader && g._hasColumnGroups()) {
                args.cancel = !g._canMoveColumnGroup(htDown.row, htDown.col, ht.row, ht.col);
                valid = g.onDraggingColumnOver(args);
            } else if (ht.cellType == CT.ColumnHeader) {
                args.cancel = !g.columns.canMoveElement(htDown.col, ht.col);
                valid = g.onDraggingColumnOver(args);
            } else if (ht.cellType == CT.RowHeader) {
                args.cancel = !g.rows.canMoveElement(htDown.row, ht.row);
                valid = g.onDraggingRowOver(args);
            } else if (ht.cellType == CT.TopLeft) {
                args.cancel = !g.topLeftCells.columns.canMoveElement(htDown.col, ht.col);
                valid = g.onDraggingColumnOver(args);
            }
        }

        // if valid, prevent default to allow drop
        if (valid) {
            e.dataTransfer.dropEffect = 'move';
            e.preventDefault();
            e.stopPropagation(); // prevent scrolling on Android
            this._showDragMarker(ht);
        } else {
            this._showDragMarker(null);
        }

        // autoscroll
        if (htDown && g.autoScroll) {
            let rc = g.controlRect,
                sp = g.scrollPosition,
                edge = wijmo.Control._DRAG_SCROLL_EDGE,
                step = wijmo.Control._DRAG_SCROLL_STEP;
            if (htDown.panel == g.columnHeaders) {
                if (e.pageX - rc.left < edge) sp.x += step;
                if (rc.right - e.pageX < edge) sp.x -= step;
            } else if (htDown.panel == g.rowHeaders) {
                if (e.pageY - rc.top < edge) sp.y += step;
                if (rc.bottom - e.pageY < edge) sp.y -= step;
            }
            if (!sp.equals(g._ptScrl)) {
                g.scrollPosition = sp;
                g._rcBounds = null;
            }
        }
    }
    private _drop(e: DragEvent) {
        let g = this._g,
            ht = this._hitTest(e),
            htDown = this._dragSrc ? this._htDrag : null, // TFS 332066
            CT = CellType;

        // move the row/col to a new position
        if (htDown && ht.cellType == htDown.cellType) {
            let sel = g.selection,
                args = new CellRangeEventArgs(ht.panel, ht.range, htDown);
            if (ht.cellType == CT.ColumnHeader && g._hasColumnGroups()) {
                g._moveColumnGroup(htDown.row, htDown.col, ht.row, ht.col, this._chldColGrpMarker);
                g.select(sel.row, ht.col);
                g.onDraggedColumn(args);
            } else if (ht.cellType == CT.ColumnHeader) {
                g.columns.moveElement(htDown.col, ht.col);
                g.select(sel.row, ht.col);
                g.onDraggedColumn(args);
            } else if (ht.cellType == CT.RowHeader) {
                g.rows.moveElement(htDown.row, ht.row);
                g.select(ht.row, sel.col);
                g.onDraggedRow(args);
            } else if (ht.cellType == CT.TopLeft) {
                g.topLeftCells.columns.moveElement(htDown.col, ht.col);
                g.onDraggedColumn(args);
            }
        }
        this.resetMouseState();
    }

    // reset grid bounds and perform a hitTest
    private _hitTest(e: MouseEvent) {
        let g = this._g;
        g._rcBounds = null;
        return g.hitTest(e);
    }

    // updates the marker to show the new size of the row/col being resized
    private _showResizeMarker(sz: number) {
        let g = this._g,
            sp = g._ptScrl,
            ct = this._szArgs.panel.cellType,
            CT = CellType,
            css: any;

        // add marker element to panel
        let t = this._dvMarker,
            host = g.cells.hostElement;
        if (t.parentElement != host) {
            host.appendChild(t);
        }

        // update marker position
        if (this._szRowCol instanceof Column) {
            css = {
                left: this._szRowCol.pos + sz - 1,
                top: -1000,
                right: '',
                bottom: 0,
                width: 3,
                height: ''
            }
            if (ct == CT.TopLeft || ct == CT.RowHeader) {
                css.left -= (g._eTL.offsetWidth + sp.x); // TFS 398858
            }
            if (ct == CT.Cell && this._szRowCol.index < g.frozenColumns) {
                css.left -= sp.x; // TFS 208824
            }
            if (g.rightToLeft) {
                css.left = host.clientWidth - css.left - css.width;
            }
        } else {
            css = {
                left: -1000,
                top: this._szRowCol.pos + sz - 1,
                right: 0,
                bottom: '',
                width: '',
                height: 3,
            }
            if (ct == CT.TopLeft || ct == CT.ColumnHeader) {
                css.top -= (g._eTL.offsetHeight + sp.y); // TFS 344192, 398858
            }
            if (ct == CT.Cell && this._szRowCol.index < g.frozenRows) {
                css.top -= sp.y; // TFS 208824
            }
        }

        // apply new position
        wijmo.setCss(t, css);
    }

    // updates the marker to show the position where the row/col will be inserted
    private _showDragMarker(ht: HitTestInfo) {

        // remove target indicator if no HitTestInfo
        let marker = this._dvMarker;
        if (!ht || !ht.panel) {
            wijmo.removeChild(marker);
            this._rngTarget = null;
            return;
        }

        // avoid work/flicker
        if (ht.range.equals(this._rngTarget)) {
            return;
        }
        this._rngTarget = ht.range;

        // add marker element to panel
        let host = ht.panel.hostElement;
        if (marker.parentElement != host) {
            host.appendChild(marker);
        }

        // update marker position
        let g = this._g,
            sp = g._ptScrl,
            CT = CellType,
            css: any = {
                left: 0,
                top: 0,
                width: 6,
                height: 6,
                right: '',
                bottom: ''
            };
        switch (ht.cellType) {

            // column groups
            case CT.ColumnHeader:
                let grp = g._getColumnGroup(ht.row, ht.col);
                if (grp) {

                    // get the range
                    let rng = grp._rng,
                        rows = ht.panel.rows,
                        cols = ht.panel.columns;

                    // move back to the empty group?
                    // handle the case when user removes all child columns from the group
                    // and tries to add some columns back to the group
                    if (grp.isEmpty && grp.binding === null) {
                        
                        // update only if the mouse is not near the left or the right
                        let row = rows[rng.bottomRow],
                            col = cols[rng.leftCol],
                            rtl = g.rightToLeft,
                            px = rtl ? marker.parentElement.clientWidth - ht.point.x : ht.point.x,
                            edgeSize = Math.max(col.renderWidth / 5, _MouseHandler._SZ_MAX_COLGRP_EDGE),
                            leftEdge = col.pos + edgeSize,
                            rightEdge = col.pos + col.renderWidth - edgeSize,
                            rightMove = this._htDown && ht.col > this._htDown.col;

                        if ((!rightMove && px > leftEdge) || (rightMove && px < rightEdge)) {
                            css.top = row.pos - css.height / 2 + row.renderHeight;
                            css.left = rtl ? marker.parentElement.clientWidth - col.pos - col.renderWidth : col.pos;
                            css.width = col.renderWidth;
                            this._chldColGrpMarker = true; // marker associated with child columns
                            break;
                        }
                    }
                    this._chldColGrpMarker = false; // marker associated with sibling columns

                    // vertical position
                    css.top = 0;
                    css.height = 0;
                    for (let r = 0; r < rng.topRow; r++) {
                        css.top += rows[r].renderHeight;
                    }
                    for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                        css.height += rows[r].renderHeight;
                    }

                    // horizontal position
                    css.left = 0;
                    if (this._htDown && ht.col > this._htDown.col) {
                        let col = cols[rng.rightCol];
                        css.left = col.pos - css.width / 2 + col.renderWidth;
                    } else {
                        let col = cols[rng.leftCol];
                        css.left = col.pos - css.width / 2;
                    }

                    // RTL
                    if (g.rightToLeft) {
                        css.left = marker.parentElement.clientWidth - css.left - css.width;
                    }

                    // updated
                    break;
                }

            case CT.TopLeft:
            case CT.ColumnHeader:
                let col = ht.panel.columns[ht.col];
                css.left = col.pos - css.width / 2;
                css.height = ht.panel.height;
                if (this._htDown && ht.col > this._htDown.col) {
                    css.left += col.renderWidth;
                }
                if (ht.cellType == CT.ColumnHeader && ht.col < g.frozenColumns) {
                    css.left -= sp.x; // TFS 208824
                }
                if (g.rightToLeft) {
                    css.left = marker.parentElement.clientWidth - css.left - css.width;
                }
                break;

            case CT.RowHeader:
                let row = ht.getRow();
                css.top = row.pos - css.height / 2;
                css.width = ht.panel.width;
                if (ht.row > this._htDown.row) {
                    css.top += row.renderHeight;
                }
                if (ht.row < g.frozenRows) {
                    css.top -= sp.y; // TFS 208824
                }
                break;
        }

        // update marker
        wijmo.setCss(marker, css);
    }

    // raises the ResizedRow/Column events and 
    // applies the new size to the selection if the control key is pressed
    private _finishResizing(e: MouseEvent) {
        let g = this._g,
            sel = g.selection,
            args = this._szArgs,
            eMouse = this._eMouse,
            ctrl = eMouse && (eMouse.ctrlKey || eMouse.metaKey), // TFS 290725
            CT = CellType;
        if (args && !args.cancel) {

            // finish column sizing
            if (args.col > -1) { // TFS 144204

                // apply new size, fire event
                let rc = args.col,
                    pageX = wijmo.mouseToPage(e).x,
                    sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageX - this._htDown.point.x) * (this._g.rightToLeft ? -1 : 1)));
                args.panel.columns[rc].width = Math.round(sz);
                g.onResizedColumn(args);

                // apply new size to selection if the control key is pressed
                if (ctrl && this._htDown.cellType == CT.ColumnHeader && sel.containsColumn(rc)) {
                    for (let c = sel.leftCol; c <= sel.rightCol; c++) {
                        if (g.columns[c].allowResizing && c != rc) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(-1, c));
                            if (g.onResizingColumn(args)) {
                                g.columns[c].size = g.columns[rc].size;
                                g.onResizedColumn(args);
                            }
                        }
                    }
                }

                // done with this event
                e.preventDefault();
            }

            // finish row sizing
            if (args.row > -1) { // TFS 144204

                // apply new size, fire event
                let rowIndex = args.row,
                    pageY = wijmo.mouseToPage(e).y,
                    sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageY - this._htDown.point.y)));
                args.getRow().height = Math.round(sz);
                g.onResizedRow(args);

                // apply new size to selection if the control key is pressed
                if (ctrl && this._htDown.cellType == CT.RowHeader && sel.containsRow(rowIndex)) {
                    for (let r = sel.topRow; r <= sel.bottomRow; r++) {
                        if (g.rows[r].allowResizing && r != rowIndex) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(r, -1));
                            if (g.onResizingRow(args)) { // TFS 144204
                                g.rows[r].size = g.rows[rowIndex].size;
                                g.onResizedRow(args);
                            }
                        }
                    }
                }

                // done with this event
                e.preventDefault();
            }
        }
    }

    // handles mouse selection
    private _handleSelection(ht: HitTestInfo, extend: boolean) {
        let g = this._g,
            sel = g._selHdl.selection,
            rng = new CellRange(ht.row, ht.col),
            CT = CellType,
            SM = SelectionMode;

        // sanity on the hit-test range
        if (!rng.isValid) {
            return;
        }

        // handle ctrl+click/drag ListBox-style selection (isSelected property)
        if (this._lbSelState != null) {
            g.rows[ht.row].isSelected = !this._lbSelState;
            g.scrollIntoView(ht.row, ht.col);
            return;
        }

        // expand range when selecting rows or columns
        switch (ht.cellType) {
            case CT.RowHeader:
                rng.col = 0;
                rng.col2 = g.columns.length - 1;
                break;
            case CT.ColumnHeader:
                switch (g.selectionMode) {
                    case SM.Row: // TFS 443954
                    case SM.Cell:
                        rng.row = rng.row2 = sel.row;
                        extend = false;
                        break;
                    default:
                        rng.row = 0;
                        rng.row2 = g.rows.length - 1;
                }
                break;
        }

        // extend rng (and honor anchorCursor when doing it)
        if (extend) {
            if (g.anchorCursor) { // keep anchored cursor
                rng.row = sel.row;
                rng.col = sel.col;
            } else { // move cursor and keep selection end
                rng.row2 = sel.row2;
                rng.col2 = sel.col2;
            }
            if (!rng.isValid) { // invalid range, use mouse down coordinates (TFS 422315)
                let ht = this._htDown;
                if (ht) {
                    rng = new CellRange(ht.row, ht.col);
                }
            }
        }

        // handle MultiRange selection (if not collapsing/expanding)
        if (g.selectionMode == SelectionMode.MultiRange) {
            let eMouse = g._mouseHdl._eMouse,
                ctlKey = eMouse && (eMouse.ctrlKey || eMouse.metaKey),
                selHdl = g._selHdl,
                sel = selHdl.selection,
                xSel = selHdl.extendedSelection,
                hdrSel = ht.panel != g.cells;
            
            // ctrl+collapse is for group collapse/expand, not selection (TFS 467045)
            if (wijmo.closest(eMouse.target, '.wj-elem-collapse')) {
                ctlKey = false;
            }

            // ctrl+click toggles the range from the extended selection (TFS 422315)
            if (ctlKey) {
                if (!extend && selHdl._deselectRange(rng)) { // if it was selected, de-select;
                    if (selHdl.selection.isValid) { // if we still have a valid selection,
                        rng = null; // then don't add anything
                    }
                } else if (sel.isValid && (hdrSel || !sel.intersects(rng))) { // if it doesn't intersect the selection (TFS 466927)
                    let ranges = hdrSel // selecting whole rows/columns? (TFS 454525)
                        ? this._splitRange(sel) // split range so user can de-select each part
                        : [ sel.clone() ]; // regular cell selection
                    ranges.forEach(rng => { // commit extended selection
                        let contains = false; // no duplicates
                        for (let i = 0; i < xSel.length && !contains; i++) {
                            if (xSel[i].equals(rng)) {
                                contains = true;
                            }
                        }
                        if (!contains) {
                            xSel.push(rng);
                        }
                    });
                }
            } else { // no ctrl key, clear the extended selection
                xSel.clear();
            }
        }

        // select the new range and scroll it into view
        if (rng) {
            g.select(rng, false);
            switch (ht.cellType) {
                case CT.RowHeader:
                    g.scrollIntoView(ht.row, -1);
                    break;
                case CT.ColumnHeader:
                    g.scrollIntoView(-1, ht.col);
                    break;
                default:
                    g.scrollIntoView(ht.row, ht.col);
            }
        } else { // raise events after removing a selected range
            let e = new CellRangeEventArgs(g.cells, new CellRange(ht.row, ht.col));
            g.onSelectionChanging(e);
            g.onSelectionChanged(e);
            g.invalidate();
        }
    }

    // split a range into an array of row or column ranges
    private _splitRange(rng: CellRange): CellRange[] {
        let g = this._g,
            cols = g.columns.length,
            rows = g.rows.length,
            ranges: CellRange[] = [];
        if (rng.columnSpan == cols) { // split into row ranges
            for (let r = rng.topRow; r <= rng.bottomRow; r++) {
                ranges.push(new CellRange(r, 0, r, cols - 1));
            }
        } else if (rng.rowSpan == rows) { // split into column ranges
            for (let c = rng.leftCol; c <= rng.rightCol; c++) {
                ranges.push(new CellRange(0, c, rows - 1, c));
            }
        } else {
            ranges.push(rng.clone());
        }
        return ranges;
    }
}
    }
    


    module wijmo.grid {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid', wijmo.grid);



















    }
    