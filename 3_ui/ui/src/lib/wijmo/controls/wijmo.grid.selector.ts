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


    module wijmo.grid.selector {
    



const _CLS_CB_ITEM = 'wj-column-selector';
const _CLS_CB_GROUP = 'wj-column-selector-group';

/**
 * Class that modifies a {@link FlexGrid} {@link Column} by adding checkboxes
 * that can be used to select or de-select rows and groups.
 * 
 * The {@link FlexGrid} has a {@link FlexGrid.selectionMode} property that
 * allows users to select multiple rows or row ranges using the mouse or the
 * keyboard.
 * 
 * But in some cases you may prefer to provide this functionality by adding 
 * a column with checkboxes instead. This will allow users to select rows
 * easily on mobile devices and may provide a more intuitive interface on 
 * desktop systems as well.
 * 
 * The {@link Selector} class allows you to do this by creating an instance 
 * of the {@link Selector} class and setting its {@link column} property to
 * the column where you want the checkboxes to appear. For example:
 * 
 * ```typescript
 * // add a SelectorColumn to the first row header column
 * let selector = new SelectorColumn(theGrid, {
 *     itemChecked: () => showCheckedCount()
 * });
 * ```
 * 
 * This will add checkboxes to cells in the first row header column.
 * The checkboxes are bound to each row's {@link Row.isSelected} property,
 * so toggling the checkbox toggles the row's selected state.
 * 
 * By default, the {@link Selector} also adds checkboxes to the top
 * header cell and to cells in group rows. These cells can be used to
 * select or de-select all rows on the grid and on each group.
 * 
 * You may use the {@link showCheckAll} property to turn off the checkbox
 * at the top header cell.
 * 
 * The {@link Selector} can also be added to non header columns. 
 * For example:
 * 
 * ```typescript
 * // add a SelectorColumn to the first row data column
 * let selector = new SelectorColumn(theGrid.columns[0], {
 *     itemChecked: () => showCheckedCount()
 * });
 * ```
 * 
 * In this case, the {@link Selector} will add the selection checkboxes
 * to regular grid cells preserving their original data content.
 * 
 * ** Note **: When you attach a {@link Selector} to a {@link FlexGrid},
 * it will automatically set the grid's {@link FlexGrid.selectionMode}
 * property to {@link SelectionMode.Cell}, since that is the selection
 * mode that makes most sense for the type of selection provided by
 * the {@link Selector}. (The {@link SelectionMode.ListBox} mode
 * would cause the grid to interfere with the selector's behavior.)
 */
export class Selector {
    protected _col: wijmo.grid.Column = null;
    protected _grid: wijmo.grid.FlexGrid = null;
    protected _isFixedCol = false;
    protected _isBound = false;
    protected _showCheckAll = true;
    protected _clickBnd = this._click.bind(this);
    protected _mousedownBnd = this._mousedown.bind(this)

    /**
     * Initializes a new instance of the {@link Selector} class.
     *
     * @param column The {@link Column} that this {@link Selector} should customize,
     * or a reference to a {@link FlexGrid} whose first column will be customized.
     * @param options An object containing initialization data for the object.
     */
    constructor(column?: wijmo.grid.Column | wijmo.grid.FlexGrid, options?: any) {
        this._initialize();
        this.column = this._getColumn(column);
        wijmo.copy(this, options);
    }

    // ** object model

    /**
     * Gets or sets the {@link Column} to be used by this {@link Selector}.
     */
    get column(): wijmo.grid.Column | null {
        return this._col;
    }
    set column(value: wijmo.grid.Column | null) {
        value = this._getColumn(value);
        if (value != this._col && this.onColumnChanging(new wijmo.CancelEventArgs())) {

            // disconnect old value
            let grid = this._grid;
            if (grid) {
                let host = grid.hostElement;
                grid.formatItem.removeHandler(this._formatItem, this);
                grid.removeEventListener(host, 'click', this._clickBnd);
                grid.removeEventListener(host, 'mousedown', this._mousedownBnd);
            }

            // save new value
            let col = this._col = wijmo.asType(value, wijmo.grid.Column, true);
            this._grid = grid = col ? col.grid : null;
            this._isFixedCol = grid ? grid.columns.indexOf(col) < 0 : false;

            // don't merge selector cells in our column (boolean cells are OK: TFS 420408, 429975)
            if (col && !this._isBound) {
                col.allowMerging = false;
            }

            // if this is a Selector (not a BooleanChecker), 
            // set the grid's selectionMode to a value that works well for us
            if (grid && !this._isBound) {
                grid.selectionMode = wijmo.grid.SelectionMode.Cell;
            }

            // connect new value
            if (grid) {
                let host = grid.hostElement;
                grid.formatItem.addHandler(this._formatItem, this);
                grid.addEventListener(host, 'click', this._clickBnd, true); // TFS 418211
                grid.addEventListener(host, 'mousedown', this._mousedownBnd, true);
            }

            // raise event
            this.onColumnChanged();
        }
    }
    /**
     * Gets or sets a value that determines whether to show a 
     * 'Check All' items checkbox on the column header.
     * 
     * The default value for this property is **true**.
     */
    get showCheckAll(): boolean {
        return this._showCheckAll;
    }
    set showCheckAll(value: boolean) {
        if (value != this._showCheckAll) {
            this._showCheckAll = wijmo.asBoolean(value);
            if (this._grid) {
                this._grid.invalidate();
            }
        }
    }

    /**
     * Occurs before the value of the {@link column} property changes.
     */
    readonly columnChanging = new wijmo.Event<Selector, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link columnChanging} event.
     * 
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onColumnChanging(e: wijmo.CancelEventArgs): boolean {
        this.columnChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the value of the {@link column} property changes.
     */
    readonly columnChanged = new wijmo.Event<Selector, wijmo.EventArgs>();
    /**
     * Raises the {@link columnChanged} event.
     */
    onColumnChanged(e?: wijmo.EventArgs): void {
        this.columnChanged.raise(this, e);
    }
    /**
     * Occurs when the user checks an item on this column.
     */
    readonly itemChecked = new wijmo.Event<Selector, wijmo.EventArgs>();
    /**
     * Raises the {@link itemChecked} event.
     */
    onItemChecked(e?: wijmo.EventArgs) {
        this.itemChecked.raise(this, e);
    }

    // ** implementation

    // for use by derived classes
    protected _initialize() {
    }

    // handle our checkboxes
    private _click(e: MouseEvent) {
        if (!e.defaultPrevented && e.target instanceof HTMLElement) {
            let g = this._grid,
                col = this._col,
                target = e.target,
                ht = g.hitTest(target); // REVIEW: g.hitTest(e) here causes problems!!

            // check this is our column
            if (col && ht && ht.getColumn() == col) {

                // clicked on our checkboxes
                if (target instanceof HTMLInputElement && wijmo.hasClass(target, _CLS_CB_ITEM)) {

                    // calculate range of rows to check/un-check
                    let rng: wijmo.grid.CellRange,
                        rows = ht.panel.rows,
                        row = rows[ht.range.topRow]; // TFS 418355
                    if (rows == g.columnHeaders.rows) { // all items
                        rng = new wijmo.grid.CellRange(0, 0, g.rows.length - 1, 0);
                        if (this._isBound) { // select the range before setting boolean values (TFS 429871)
                            let sel = g.selection;
                            sel.col = sel.col2 = col.index;
                            g.select(sel);
                        }
                    } else if (this._isGroupRow(row)) { // groups
                        rng = (row as wijmo.grid.GroupRow).getCellRange();
                    } else { // single item
                        rng = ht.range; // TFS 418211
                    }

                    // apply new checked state if the range is valid
                    if (rng.isValid) {
                        this._setRangeChecked(target.checked, rng);
                        this.onItemChecked();
                    }

                    // always invalidate (TFS 418559)
                    g.invalidate();

                    // done with this event (TFS 418747)
                    e.preventDefault();
                    return;
                }

                // clicked on empty area of header cell, defer to checkbox
                if (wijmo.hasClass(target, 'wj-cell') && g.bigCheckboxes && this._isBound) {
                    if (this._isFixedCol || this._isGroupRow(ht.getRow())) {
                        let cb = target.querySelector('input.' + _CLS_CB_ITEM);
                        if (cb instanceof HTMLInputElement) {
                            cb.click();

                            // done with this event (TFS 418747, 425619)
                            e.preventDefault();
                        }
                    }
                }
            }
        }
    }

    // commit edits when the user presses the mouse on a group header checkbox
    // REVIEW: kludgy, needed to work with groups in bound boolean columns while editing
    private _mousedown(e: MouseEvent) {
        let g = this._grid,
            col = this._col,
            ecv = g.editableCollectionView;
        if (this._isBound && col && ecv && ecv.currentEditItem) {
            let ht = g.hitTest(e);
            if (ht.getColumn() == col) { // our column?
                if (this._isGroupRow(ht.getRow())) { // group row?
                    let cb = wijmo.closestClass(e.target, _CLS_CB_GROUP); // clicked a checkbox?
                    if (cb instanceof HTMLInputElement) {
                        //ecv.commitEdit(); // commit edits (causes refresh)
                        cb.click(); // click the checkbox
                    }
                }
            }
        }
    }

    // checks whether a row should be handled as a GroupRow 
    // taking into account tree grids (childItemsPath property)
    private _isGroupRow(row: wijmo.grid.Row): boolean {
        if (row instanceof wijmo.grid.GroupRow) { // if it's a group row
            if (!this._grid.childItemsPath || row.getCellRange().rowSpan > 1) { // and not a node
                return true; // then handle as a group row
            }
        }
        return false; // handle as a data row (select/delete/etc TFS 421638)
    }

    // get the checked state for range of data rows 
    // (true for all selected, false for none selected, null for mixed state)
    private _getRowChecked(start: number, end = start): boolean {
        let cTrue = 0,
            cFalse = 0,
            bnd = this._col._binding;
        for (let i = start; i <= end && (!cTrue || !cFalse); i++) {
            let row = this._grid.rows[i],
                dataItem = row.dataItem;
            if (dataItem && !this._isGroupRow(row)) {
                let checked = this._isBound
                    ? bnd.getValue(dataItem)
                    : row.isSelected;
                if (checked) {
                    cTrue++;
                } else {
                    cFalse++;
                }
            }
        }
        return cTrue && !cFalse ? true : cFalse && !cTrue ? false : null;
    }

    // check/select a range of data rows
    private _setRangeChecked(select: boolean, rng: wijmo.grid.CellRange) {
        let g = this._grid,
            rows = g.rows,
            col = this._col,
            bnd = col ? col._binding : null,
            sel = g.selection,
            ecv = this._isBound ? g.editableCollectionView : null;

        // can't change bound values if grid or column are readonly (TFS 419120)
        if (this._isBound) {
            if (g.isReadOnly || !ecv || !bnd) {
                return;
            }
        }

        // defer updates when checking boolean values (TFS 424127)
        // unless CollectionView.refreshOnEdit == false (TFS 466092)
        let updating = false;
        if (ecv) {
            let refreshOnEdit = true;
            if (ecv instanceof wijmo.collections.CollectionView && !ecv.refreshOnEdit) {
                refreshOnEdit = false;
            }
            if (refreshOnEdit) {
                updating = true;
                ecv.beginUpdate();
            }
        }

        // set selection or bound values
        g.deferUpdate(() => { // TFS 456518 (major optmization!)
            for (let i = rng.bottomRow; i >= rng.topRow; i--) {
                let row = rows[i],
                    item = row.dataItem;
                if (item) {
                    if (!this._isGroupRow(row)) { // ignore group rows
                        if (this._isBound) {
                            if (item[col.binding] != select) {
                                if (ecv) { // track changes (TFS 424885)
                                    ecv.editItem(item);
                                }
                                let rng = new wijmo.grid.CellRange(i, col.index),
                                    e = new wijmo.grid.CellEditEndingEventArgs(g.cells, rng, item[col.binding]);
                                if (g.onCellEditEnding(e)) { // raise editing events (TFS 472372)
                                    bnd.setValue(item, select);
                                    g.onCellEditEnded(e);
                                }
                            }
                        } else {
                            row.isSelected = select;
                        }
                    } else if (g.childItemsPath && !this._isBound) { // but do select tree nodes
                        row.isSelected = select;
                    }
                }
            }
        });

        // restore selection and finish updating (TFS 424127)
        if (ecv) {
            ecv.commitEdit();
            if (updating) {
                ecv.endUpdate();
            }
            g.selection = sel;        
        }
    }

    // add the checkboxes to this column
    private _formatItem(grid: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) {
        let col = e.getColumn(),
            edtRange = grid.editRange;
        if (col && col == this._col && // our column
            (!edtRange || !edtRange.contains(e.row, e.col)) && // not editing this cell
            e.panel.rows != grid.columnFooters.rows) { // not a footer cell: TFS 418259
            let row = e.getRow(),
                cell = e.cell,
                cbClass = '',
                checked: boolean;

            // get checked state for the checkbox we're about to add
            if (e.panel.rows == grid.columnHeaders.rows) { // checkAll box
                if (this._showCheckAll && e.range.bottomRow == e.panel.rows.length - 1) { // TFS 418723
                    checked = this._getRowChecked(0, grid.rows.length - 1);
                    cbClass = _CLS_CB_ITEM + ' ' + _CLS_CB_GROUP;
                }
            } else if (this._isGroupRow(row)) { // group checkbox
                let rng = (row as wijmo.grid.GroupRow).getCellRange();
                checked = this._getRowChecked(rng.row, rng.row2);
                cbClass = _CLS_CB_ITEM + ' ' + _CLS_CB_GROUP;
            } else if (row.dataItem && !this._isBound) { // data row checkbox, not boolean data
                checked = this._getRowChecked(e.row);
                cbClass = _CLS_CB_ITEM;
            }

            // add selector checkbox to the cell
            if (cbClass) {

                // clear cell text from fixed cells and from boolean aggregates (TFS 421420, 462202)
                if (this._isFixedCol || (this._isBound && this._isGroupRow(row) && col.aggregate && col.index > grid.columns.firstVisibleIndex)) {
                    let btn = cell.querySelector('.' + wijmo.grid.CellFactory._WJC_COLLAPSE);
                    cell.textContent = '';
                    if (btn) {
                        cell.appendChild(btn);
                    }
                }

                // create checkbox
                let lbl = wijmo.createElement('<label>' +
                    '<input type="checkbox" class="' + cbClass + '" tabindex="-1">' +
                    '<span></span>' +
                    '</label>');
                let cb = lbl.querySelector('input') as HTMLInputElement;
                wijmo.setChecked(cb, checked);

                // handle read-only/un-selectable checkboxes (TFS 421496)
                if (this._isBound) { // can still select, but cannot change bound values
                    if (col.isReadOnly || grid.selectionMode == wijmo.grid.SelectionMode.None) {
                        cb.disabled = true;
                        cb.style.cursor = 'default';
                    }
                }

                // prepend checkbox to cell content
                cell.insertBefore(lbl, cell.firstChild);
            }
        }
    }

    // method used to get a column from a grid, panel, column, name, or index.
    private _getColumn(column: wijmo.grid.FlexGrid | wijmo.grid.Column | string | number): wijmo.grid.Column {

        // from grid: get the first available column
        if (column instanceof wijmo.grid.FlexGrid) {
            let grid = column as wijmo.grid.FlexGrid,
                hdrCols = grid.rowHeaders.columns;
            column = ((grid.headersVisibility & wijmo.grid.HeadersVisibility.Row) && hdrCols.length)
                ? hdrCols[0]
                : grid.columns[0];
        }

        // from string or number: use grid's getColumn method
        if (this._grid) {
            if (wijmo.isString(column) || wijmo.isNumber(column)) {
                column = this._grid.getColumn(column as any);
            }
        }

        // done
        return column instanceof wijmo.grid.Column ? column : null;
    }
}

/**
 * Class that adds extra checkboxes to header and group cells of 
 * {@link FlexGrid} boolean columns to allow setting the values for
 * all items or groups.
 * 
 * ** Note **: When you attach a {@link BooleanChecker} to a
 * {@link Column}, you may also want to set the column's 
 * {@link Column.aggregate} property to {@link Aggregate.First},
 * so the grid will create cells on group header rows to hold
 * the checkboxes used to set the boolean values for the groups.
 */
export class BooleanChecker extends Selector {

    /**
     * Initializes a new instance of the {@link BooleanChecker} class.
     *
     * @param column The {@link Column} that this {@link BooleanChecker} should customize.
     * @param options An object containing initialization data for the object.
     */
    constructor(column?: wijmo.grid.Column, options?: any) {
        super(column, options);
    }

    // sanity
    onColumnChanged(e?: wijmo.EventArgs) {
        let col = this.column,
            dt = col ? col.dataType : null; // TFS 442042
        wijmo.assert(!col || dt == null || dt == wijmo.DataType.Boolean, 'BooleanChecker should be bound to boolean columns');
        super.onColumnChanged(e);
    }

    // set _isBound so the Selector does not override data cell content and
    // uses their bound values to create the "select all" and group checkboxes.
    protected _initialize() {
        this._isBound = true;
    }
}
    }
    


    module wijmo.grid.selector {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.selector', wijmo.grid.selector);



    }
    