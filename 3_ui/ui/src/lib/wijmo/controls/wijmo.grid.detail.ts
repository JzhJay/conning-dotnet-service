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


    module wijmo.grid.detail {
    


'use strict';

/**
 * Row that contains a single detail cell spanning all grid columns.
 */
export class DetailRow extends wijmo.grid.Row {
    _detail: HTMLElement;

    /**
     * Initializes a new instance of the {@link DetailRow} class.
     * 
     * @param parentRow {@link Row} that this {@link DetailRow} provides details for.
     */
    constructor(parentRow: wijmo.grid.Row) {
        super();
        this.isReadOnly = true;
    }

    /**
     * Gets or sets the HTML element that represents the detail cell in this {@link DetailRow}.
     */
    get detail() : HTMLElement {
        return this._detail;
    }
    set detail(value: HTMLElement) {
        this._detail = value;
    }
}
    }
    


    module wijmo.grid.detail {
    



'use strict';

/**
 * Merge manager class used by the {@link FlexGridDetailProvider} class.
 *
 * The {@link DetailMergeManager} merges detail cells (cells in a {@link DetailRow})
 * into a single detail cell that spans all grid columns.
 */
export class DetailMergeManager extends wijmo.grid.MergeManager {
    _originalMergeManager: wijmo.grid.MergeManager;

    /**
     * Initializes a new instance of a {@link DetailMergeManager} class.
     * 
     * @param grid Grid that owns this merge manager.
     */
    constructor(grid: wijmo.grid.FlexGrid) {
        super();
        this._originalMergeManager = grid.mergeManager;
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
    getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, clip = true): wijmo.grid.CellRange {
        switch (p.cellType) {

            // merge detail cells all the way across
            case wijmo.grid.CellType.Cell:
                if (p.rows[r] instanceof DetailRow) {

                    // do not merge across frozen boundaries (TFS 323964)
                    //let cols = p.columns,
                    //    frozen = Math.min(cols.length, cols.frozen);
                    //return c < frozen
                    //    ? new CellRange(r, 0, r, frozen - 1)
                    //    : new CellRange(r, frozen, r, cols.length - 1);

                    // disable frozen cell cloning (TFS 433415, 441996)
                    let cols = p.columns;
                    if (cols.frozen > 0 && p.grid) {
                        p.grid.cloneFrozenCells = false; // TFS 323964
                    }

                    // merge across frozen column boundaries (TFS 334758, NSSOL request)
                    return new wijmo.grid.CellRange(r, 0, r, p.columns.length - 1);
                }
                break;

            // merge row headers for main and detail rows
            case wijmo.grid.CellType.RowHeader:
                let isFrozen = _isFrozen(p, r), // not across frozen boundary: TFS 323964
                    isNew = _isNew(p, r), // not across new row template boundary: TFS 470088
                    dataItem = p.rows[r].dataItem;
                
                // detail row doesn't have a dataItem (TFS 469943)
                if (!dataItem && r > 0 && p.rows[r] instanceof DetailRow) {
                    dataItem = p.rows[r - 1].dataItem;
                }

                // expand up, accounting for MultiRow grids (rows with same data item, TFS 428939)
                let r1 = r;
                while (r1 > 0 && p.rows[r1 - 1].dataItem == dataItem &&
                    _isFrozen(p, r1 - 1) == isFrozen &&
                    _isNew(p, r1 - 1) == isNew) {
                    r1--;
                }

                // expand down, accounting for MultiRow grids (TFS 428939)
                let r2 = r;
                while (r2 < p.rows.length - 1 && p.rows[r2 + 1].dataItem == dataItem &&
                    _isFrozen(p, r2 + 1) == isFrozen &&
                    _isNew(p, r2 + 1) == isNew) {
                    r2++;
                }

                // expand to include the DetailRow if it's there
                if (r2 < p.rows.length - 1 && p.rows[r2 + 1] instanceof DetailRow &&
                    _isFrozen(p, r2 + 1) == isFrozen &&
                    _isNew(p, r2 + 1) == isNew) {
                    r2++;
                }

                // done
                return r1 != r2 ? new wijmo.grid.CellRange(r1, c, r2, c) : null;
        }

        // allow original manager
        return this._originalMergeManager.getMergedRange(p, r, c, clip);
    }
}

function _isFrozen(p: wijmo.grid.GridPanel, r: number): boolean {
    return r < p.rows.frozen;
}

function _isNew(p: wijmo.grid.GridPanel, r: number): boolean {
    return p.rows[r] instanceof wijmo.grid._NewRowTemplate;
}


    }
    


    module wijmo.grid.detail {
    







'use strict';

// globalization info
wijmo._addCultureInfo('FlexGridDetailProvider', {
    ariaLabels: {
        toggleDetail: 'Toggle Row Detail'
    }
});

/**
 * Specifies constants that define the action to perform when the
 * ENTER key is pressed.
 */
export enum KeyAction {
    /** No special action (let the grid handle the key). */
    None,
    /** Toggle the detail display. */
    ToggleDetail
}

/**
 * Specifies when and how the row details are displayed.
 */
export enum DetailVisibilityMode {
    /**
     * Details are shown or hidden in code, using the 
     * {@link FlexGridDetailProvider.showDetail} and
     * {@link FlexGridDetailProvider.hideDetail} methods.
     */
    Code,
    /**
     * Details are shown for the row that is currently selected.
     */
    Selection,
    /**
     * Details are shown or hidden using buttons added to the row headers.
     * Only one row may be expanded at a time.
     */
    ExpandSingle,
    /**
     * Details are shown or hidden using buttons added to the row headers.
     * Multiple rows may be expanded at a time.
     */
    ExpandMulti,
}

/**
 * Represents a method that takes a {@link Row} and returns an HTMLElement
 * containing details about the row.
 */
export interface ICreateDetailCell {
    /**
     * @param row {@link Row} that contains the details.
     * @param col {@link Column} that contains the details.
     * @returns Element with details about the row.
     */
    (row: wijmo.grid.Row, col?: wijmo.grid.Column): HTMLElement;
}
/**
 * Represents a method that takes a {@link Row} and disposes of detail
 * elements associated with the row.
 */
export interface IDisposeDetailCell {
    /**
     * @param row {@link Row} that contains details that were just removed from view.
     * @returns Returning true will prevent {@link FlexGridDetailProvider} from
     * disposing controls in details. Can be used if all the disposing logic is
     * fulfilled by the method.
     */
    (row: wijmo.grid.Row): boolean | void;
}
/**
 * Represents a method that takes a {@link Row} and returns true if
 * the row has details that can be displayed.
 */
export interface IRowHasDetail {
    /**
     * @param row {@link Row} on the main grid.
     * @returns true if the row has details that can be shown.
     */
    (row: wijmo.grid.Row): boolean;
}

/**
 * Implements detail rows for {@link FlexGrid} controls.
 *
 * To add detail rows to a {@link FlexGrid} control, create an instance of a
 * {@link FlexGridDetailProvider} and set the {@link createDetailCell} property
 * to a function that creates elements to be displayed in the detail cells.
 *
 * For example:
 *
 * ```typescript
 * import { FlexGrid } from '@grapecity/wijmo.grid';
 * import { FlexGridDetailProvider } from '@grapecity/wijmo.grid.detail';
 * 
 * // create FlexGrid to show categories
 * let gridCat = new FlexGrid('#gridCat', {
 *     itemsSource: getCategories();
 * });
 * 
 * // add detail rows showing products in each category
 * let detailProvider = new FlexGridDetailProvider(gridCat, {
 *     createDetailCell: (row) => {
 *         let cell = document.createElement('div');
 *         new FlexGrid(cell, {
 *             itemsSource: getProducts(row.dataItem.CategoryID)
 *         });
 *         return cell;
 *     }
 * });
 * ```
 *
 * The {@link FlexGridDetailProvider} provides a {@link detailVisibilityMode} property
 * that determines when the detail rows should be displayed.
 * 
 * The default value for this property is **ExpandSingle**, which adds collapse/expand 
 * icons to the row headers.
 * 
 * The example below shows how you can use a {@link FlexGridDetailProvider} to add
 * different types of detail to the rows in a {@link FlexGrid}:
 * 
 * {@sample Grid/Rows/RowDetail/Overview/purejs Example}
 */
export class FlexGridDetailProvider {
    static _WJC_DETAIL = 'wj-elem-detail';

    // members
    _g: wijmo.grid.FlexGrid;
    _maxHeight: number | null = null;
    _mode = DetailVisibilityMode.ExpandSingle;
    _animated = false;
    _toSel: any;
    _createDetailCellFn: ICreateDetailCell;
    _disposeDetailCellFn: IDisposeDetailCell;
    _rowHasDetailFn: IRowHasDetail;
    _keyActionEnter = KeyAction.None;

    /**
     * Initializes a new instance of the {@link FlexGridDetailProvider} class.
     *
     * @param grid {@link FlexGrid} that will receive detail rows.
     * @param options Initialization options for the new {@link FlexGridDetailProvider}.
     */
    constructor(grid: wijmo.grid.FlexGrid, options?: any) {
        this._g = grid;

        // custom merging for cells and row headers
        grid.mergeManager = new DetailMergeManager(grid);

        // expand/collapse detail on click
        grid.rowHeaders.hostElement.addEventListener('click', this._hdrClick.bind(this));

        // expand/collapse detail on mousedown if editing (TFS 319419)
        // because mousedown will finish/commit edits and refresh the grid
        grid.rowHeaders.hostElement.addEventListener('mousedown', (e) => {
            let ecv = grid.editableCollectionView;
            if (grid.activeEditor || (ecv && ecv.currentEditItem)) {
                this._hdrClick(e);
                e.preventDefault();
            }
        });

        // show details, collapse/expand icons
        // **REVIEW: using a timeout so this works with FlexGridSearch (C1WEB-26954)
        // this works, but it's dirty; there should be a better solution
        setTimeout(() => {
            grid.formatItem.addHandler(this._formatItem, this);
        }, 100);

        // show details for selected cell
        grid.selectionChanged.addHandler(this._selectionChanged, this);

        // refresh controls to update layout when detail rows are resized
        grid.resizedRow.addHandler(this._resizedRow, this);

        // hide all details when grid is populated
        grid.loadingRows.addHandler(() => this.hideDetail());

        // hide the detail for a row about to be removed
        grid.deletingRow.addHandler((s, e) => {
            this.hideDetail(e.row);
        });

        // handle fixed cell z-order when the parent grid has frozen cells
        // and the detail cells contain grids with frozen cells (TFS 334760)
        grid.updatedView.addHandler(this._handleFrozenCells, this);

        // details don't work well with frozen cells (TFS 469949)
        grid.cloneFrozenCells = false;

        // hide detail when dragging row (TFS 241962)
        grid.draggingRow.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (e.row < s.rows.length - 1 && s.rows[e.row + 1] instanceof DetailRow) {
                e.cancel = true;
                this.hideDetail(e.row);
            }
        });

        // handle the Enter key
        grid.hostElement.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.keyCode == wijmo.Key.Enter && this._keyActionEnter == KeyAction.ToggleDetail) {
                let row = this._g.selection.row;
                if (this._toggleRowDetail(row)) {
                    e.preventDefault();
                }
            }
        }, true);

        // refresh detail controls when the parent grid scrolls (TFS 372631)
        grid._root.addEventListener('scroll', () => {
            wijmo.Control.refreshAll(grid._root);
        });

        // apply initialization options if any
        wijmo.copy(this, options);
    }

    // ** object model

    /**
     * Gets the {@link FlexGrid} that owns this {@link FlexGridDetailProvider}.
     */
    get grid(): wijmo.grid.FlexGrid {
        return this._g;
    }
    /**
     * Gets or sets a value that determines when row details are displayed.
     *
     * The default value for this property is **DetailVisibilityMode.ExpandSingle**.
     */
    get detailVisibilityMode(): DetailVisibilityMode {
        return this._mode;
    }
    set detailVisibilityMode(value: DetailVisibilityMode) {
        value = wijmo.asEnum(value, DetailVisibilityMode);
        if (value != this._mode) {
            this._mode = value;
            this.hideDetail();
            this._g.invalidate();
        }
    }
    /**
     * Gets or sets the maximum height of the detail rows, in pixels.
     * 
     * The default value for this property is **null**, which means
     * there's no upper limit to the detail row height.
     */
    get maxHeight(): number | null{
        return this._maxHeight;
    }
    set maxHeight(value: number | null) {
        value = wijmo.asNumber(value, true);
        if (value != this._maxHeight) {
            this._maxHeight = value;
            this.hideDetail();
        }
    }
    /**
     * Gets or sets a value that indicates whether to use animation when
     * showing row details.
     * 
     * The default value for this property is **false**.
     */
    get isAnimated(): boolean {
        return this._animated;
    }
    set isAnimated(value: boolean) {
        if (value != this._animated) {
            this._animated = wijmo.asBoolean(value);
        }
    }
    /**
     * Gets or sets the action to perform when the ENTER key is pressed.
     *
     * The default setting for this property is {@link KeyAction.None},
     * which lets the grid handle the key.
     * The other option is {@link KeyAction.ToggleDetail}, which handles 
     * the Enter key to toggle the display of the row details.
     */
    get keyActionEnter(): KeyAction {
        return this._keyActionEnter;
    }
    set keyActionEnter(value: KeyAction) {
        this._keyActionEnter = wijmo.asEnum(value, KeyAction);
    }
    /**
     * Gets or sets the callback function that creates detail cells.
     *
     * The callback function takes a {@link Row} as a parameter and
     * returns an HTML element representing the row details.
     * For example:
     *
     * ```typescript
     * // create detail cells for a given row
     * dp.createDetailCell = (row) => {
     *     let cell = document.createElement('div');
     *     new FlexGrid(cell, {
     *         itemsSource: getProducts(row.dataItem.CategoryID),
     *         headersVisibility: 'Column'
     *     });
     *     return cell;
     * };
     * ```
     */
    get createDetailCell(): ICreateDetailCell {
        return this._createDetailCellFn;
    }
    set createDetailCell(value: ICreateDetailCell) {
        this._createDetailCellFn = wijmo.asFunction(value, true) as ICreateDetailCell;
    }
    /**
     * Gets or sets the callback function that disposes of detail cells.
     *
     * The callback function takes a {@link Row} as a parameter and
     * disposes of any resources associated with the detail cell.
     *
     * This function is optional. Use it in cases where the 
     * {@link createDetailCell} function allocates resources that are not
     * automatically garbage-collected.
     */
    get disposeDetailCell(): IDisposeDetailCell {
        return this._disposeDetailCellFn;
    }
    set disposeDetailCell(value: IDisposeDetailCell) {
        this._disposeDetailCellFn = wijmo.asFunction(value, true) as IDisposeDetailCell;
    }
    /**
     * Gets or sets the callback function that determines whether a row 
     * has details.
     *
     * The callback function takes a {@link Row} as a parameter and
     * returns a boolean value that indicates whether the row has
     * details. For example:
     *
     * ```typescript
     * // remove details from items with odd CategoryID
     * dp.rowHasDetail = (row) => {
     *     return row.dataItem.CategoryID % 2 == 0;
     * };
     * ```
     *
     * Setting this property to null means all regular data
     * rows (not group rows or new item templates) have details.
     */
    get rowHasDetail(): IRowHasDetail {
        return this._rowHasDetailFn;
    }
    set rowHasDetail(value: IRowHasDetail) {
        value = wijmo.asFunction(value, true) as IRowHasDetail;
        if (value != this._rowHasDetailFn) {
            this._rowHasDetailFn = value;
            this.hideDetail();
            this._g.invalidate();
        }
    }
    /**
     * Gets the detail row associated with a given grid row.
     *
     * @param row Row or index of the row to investigate.
     */
    getDetailRow(row: any): DetailRow | null {
        let rows = this._g.rows,
            index = this._toIndex(row),
            item = rows[index].dataItem;
        for (; index < rows.length; index++) {
            let row = rows[index];
            if (row instanceof DetailRow) {
                return row;
            }
            if (row.dataItem != item) { // TFS 469932
                return null;
            }
        }
        return null;
    }
    /**
     * Gets a value that determines if a row's details are visible.
     *
     * @param row Row or index of the row to investigate.
     */
    isDetailVisible(row: any): boolean {
        return this.getDetailRow(row) != null;
    }
    /**
     * Gets a value that determines if a row has details to show.
     *
     * @param row Row or index of the row to investigate.
     */
    isDetailAvailable(row: any): boolean {
        row = this._toIndex(row);
        return this._hasDetail(row);
    }
    /**
     * Hides the detail row for a given row.
     *
     * @param row {@link Row} or index of the row that will have its details hidden.
     * This parameter is optional. If not provided, all detail rows are hidden.
     */
    hideDetail(row?: wijmo.grid.Row | number) {
        let g = this._g,
            rows = g.rows;

        // if 'row' is not provided, hide all details
        if (row == null) {
            for (let r = 0; r < rows.length; r++) {
                if (rows[r] instanceof DetailRow) {
                    this.hideDetail(r);
                }
            }
            return;
        }

        // remove detail for a given row
        let rowIndex = this._toIndex(row);

        // skip to the next DetailRow (TFS 442485, 428939)
        while (!(rows[rowIndex] instanceof DetailRow) && rowIndex < rows.length - 1) {
            rowIndex++;
        }

        // if we have a detail row, dispose of any child controls and remove the row
        let detailRow = rows[rowIndex];
        if (detailRow instanceof DetailRow) {

            // make sure any popups/drop-downs that belong to the detail are closed
            // (e.g. FlexGridFilter editors, ComboBox drop-downs, etc)
            let parent = detailRow.detail.parentElement;
            if (parent) { // TFS 470069
                let ctls = parent.querySelectorAll('.wj-control');
                for (let i = 0; i < ctls.length; i++) {
                    let ctl = wijmo.Control.getControl(ctls[i]);
                    if (ctl && ctl.containsFocus()) {
                        g.focus(true);
                    }
                }
            }

            // The disposeDetailCell method implementation may ask us to not
            // perform disposal, due to performance or side effects considerations.
            // For example, React destroys its content asynchronously, and calling
            // Control.disposeAll here will lead to an exception in React.
            let ddc = this.disposeDetailCell,
                noDispose = ddc ? ddc(detailRow) : false;
            if (!noDispose) {
                wijmo.Control.disposeAll(detailRow.detail);
            }

            // ready to remove the row
            rows.removeAt(rowIndex);
        }
    }
    /**
     * Shows the detail row for a given row.
     *
     * @param row {@link Row} or index of the row that will have its details shown.
     * @param hideOthers Whether to hide details for all other rows.
     */
    showDetail(row: wijmo.grid.Row | number, hideOthers = false) {
        let g = this._g,
            rows = g.rows;

        // convert rows into indices
        let rowIndex = this._toIndex(row);

        // get main row if given row was a detail
        if (rowIndex > 0 && rows[rowIndex] instanceof DetailRow) {
            rowIndex--;
        }

        // get the last row that has the same data item (MultiRow, TFS 428939)
        let dataItem = rows[rowIndex].dataItem;
        while (rowIndex < rows.length - 1 && rows[rowIndex + 1].dataItem == dataItem) {
            rowIndex++;
        }

        // hide others before showing this
        if (hideOthers) {
            let sel = g.selection,
                updateSelection = false;
            for (let r = 0; r < rows.length - 1; r++) {
                if (r != rowIndex && rows[r + 1] instanceof DetailRow) {
                    this.hideDetail(r);
                    if (r < rowIndex) {
                        rowIndex--;
                    }
                    if (r < sel.row) {
                        sel.row--;
                        sel.row2--;
                        updateSelection = true;
                    }
                }
            }
            if (updateSelection) {
                g.select(sel, false);
            }
        }

        // show this after hiding the others (TFS 203017)
        if (!this.isDetailVisible(rowIndex) && this._hasDetail(rowIndex)) {

            // create detail row and cell element
            let detailRow = new DetailRow(rows[rowIndex]),
                cell = this._createDetailCell(rows[rowIndex]);
            detailRow.detail = cell;

            // insert new detail row below the current row and show it
            if (cell) {

                // insert the detail row
                rows.insert(rowIndex + 1, detailRow);

                // show the detail row
                let focus = g.containsFocus();
                if (this._animated) {
                    let style = cell.style;
                    style.transform = 'translateY(-100%)';
                    style.opacity = '0';
                    wijmo.animate((pct) => {
                        if (pct < 1) {
                            style.transform = 'translateY(' + (-(1 - pct) * 100).toFixed(0) + '%)';
                            style.opacity = (pct * pct).toString();
                        } else {
                            style.transform = style.opacity = '';
                            wijmo.Control.invalidateAll(cell);
                            if (focus) {
                                g.scrollIntoView(rowIndex + 1, -1);
                            }
                        }
                    });
                } else {
                    if (focus) { // TFS 363004
                        g.scrollIntoView(rowIndex + 1, -1, true);
                    }
                }
            }
        }
    }

    // ** implementation

    // initialize the size of the detail row (TFS 363004)
    _sizeDetailRow(row: DetailRow) {
        let g = this._g,
            cell = row.detail;

        // refresh inner controls before measuring
        wijmo.Control.refreshAll(cell);

        // calculate height needed for the detail cell + vertical padding + border
        let rowHeight = cell.offsetHeight + g._cellPadVert + 1,
            maxHeight = this._maxHeight;
        if (wijmo.isNumber(maxHeight) && maxHeight > 0 && rowHeight > maxHeight) {
            rowHeight = maxHeight;
        }
        row.height = rowHeight;

        // make the cell element fill the row
        if (!cell.style.height) {
            cell.style.height = '100%';
        }

        // make inner FlexGrid controls fill the row
        let innerGrid = cell.querySelector('.wj-flexgrid') as HTMLElement;
        if (innerGrid && !innerGrid.style.height) {
            innerGrid.style.height = '100%';
        }
    }

    // fix z-index when parent grid and detail grid have frozen cells
    // this is ugly, but the scenario should be pretty rare.
    // this is also required when only the detail grid has frozen cells
    // (TFS 323964, 334760, 381606)
    _handleFrozenCells() {
        let g = this._g,
            host = g.hostElement,
            gridSelector = '.wj-flexgrid',
            detailGrid = wijmo.Control.getControl(host.querySelector(gridSelector));
        if (detailGrid instanceof wijmo.grid.FlexGrid) {
            if (detailGrid.frozenRows || detailGrid.frozenColumns) {
                wijmo.setCss([g._eTL, g._eBL, g._eCHdr, g._eCFtr, g._eRHdr, g._eMarquee], {
                    zIndex: '13'
                });
                let frozenCells = host.querySelectorAll('.wj-frozen');
                for (let i = 0; i < frozenCells.length; i++) {
                    let cell = frozenCells[i] as HTMLElement;
                    if (wijmo.closest(cell, gridSelector) == host) {
                        let zIndex = parseInt(cell.style.zIndex);
                        cell.style.zIndex = ((zIndex % 10) + 10).toString();
                    }
                }
            }
        }
    }

    // convert Row objects into row indices
    _toIndex(row: any): number {
        return row instanceof wijmo.grid.Row
            ? row.index
            : wijmo.asNumber(row);
    }

    // expand/collapse detail row
    _hdrClick(e: MouseEvent) {
        if (!e.defaultPrevented && e.button == 0) {
            if (wijmo.closestClass(e.target, FlexGridDetailProvider._WJC_DETAIL)) {
                let DVM = DetailVisibilityMode;
                switch (this._mode) {
                    case DVM.ExpandMulti:
                    case DVM.ExpandSingle:
                        let g = this._g,
                            ht = g.hitTest(e.target as HTMLElement);
                        if (!ht.panel) {
                            ht = g.hitTest(e);
                        }
                        if (ht.panel) {
                            if (this._toggleRowDetail(ht.row)) {
                                e.preventDefault();
                            }
                        }
                        break;
                }
            }
        }
    }

    // toggle the detail for a given row
    _toggleRowDetail(row: number): boolean {
        if (row > -1) { // TFS 342189
            if (this.isDetailVisible(row)) {
                this.hideDetail(row);
                return true;
            } else if (this._hasDetail(row)) {
                let g = this._g;
                g.select(new wijmo.grid.CellRange(row, 0, row, g.columns.length - 1));
                this.showDetail(row, this._mode == DetailVisibilityMode.ExpandSingle);
                return true;
            }
        }
        return false;
    }

    // expand selected row (but not too often)
    _selectionChanged(s: wijmo.grid.FlexGrid, e: wijmo.EventArgs) {
        if (this._mode == DetailVisibilityMode.Selection) {
            if (this._toSel) {
                clearTimeout(this._toSel);
            }
            this._toSel = setTimeout(() => {
                let row = s._selHdl.selection.row;
                if (row > -1) { // TFS 121667
                    this.showDetail(row, true);
                } else {
                    this.hideDetail();
                }
            }, 300);
        }
    }

    // show details, collapse/expand icons
    _formatItem(s, e: wijmo.grid.FormatItemEventArgs) {
        let g = this._g,
            cell = e.cell,
            row = e.getRow(),
            DVM = DetailVisibilityMode;

        // add detail to the first cell in the detail row (TFS 334758, NSSOL adamant request)
        if (e.panel == g.cells && row instanceof DetailRow && row.detail != null) {
            if (!wijmo.hasClass(cell, 'wj-detail')) { // TFS 412828

                // add detail to cell
                wijmo.addClass(cell, 'wj-detail');
                cell.textContent = '';
                cell.style.textAlign = cell.style.zIndex = ''; // TFS 130035, 323964
                cell.className = cell.className.replace(/wj\-align\-[\S]+/g, ''); // TFS 130035
                cell.appendChild(row.detail);

                // set row height (once, and on-demand: TFS 363004)
                if (row.height == null) {
                    this._sizeDetailRow(row as DetailRow);
                } else {
                    wijmo.Control.refreshAll(row.detail); // TFS 435227, 441426
                }
            }
        }

        // if this row has details, add collapse/expand icons
        if (e.panel == g.rowHeaders && e.col == 0 && this._hasDetail(e.row)) {
            cell.style.cursor = '';
            switch (this._mode) {
                case DVM.ExpandMulti:
                case DVM.ExpandSingle:

                    // expanded if the next row is a detail row (TFS 428939)
                    let expanded = this.isDetailVisible(e.row),
                        glyph = expanded ? 'minus' : 'plus',
                        cls = FlexGridDetailProvider._WJC_DETAIL;

                    // add toggle button with collapse/expand icon
                    // NOTE: using div instead of button to allow dragging in IE/Firefox (TFS 351412)
                    cell.innerHTML =
                        '<div class="wj-btn wj-btn-glyph ' + cls + '" role="button" tabindex="-1">' +
                        '<span class="wj-glyph-' + glyph + '"></span>' +
                        '</div>';

                    // add ARIA attributes to the button
                    let btn = cell.children[0] as HTMLElement,
                        label = wijmo.culture.FlexGridDetailProvider.ariaLabels.toggleDetail;
                    wijmo.setAriaLabel(btn, label);
                    wijmo.setAttribute(btn, 'aria-expanded', expanded);
            }
        }
    }

    // refresh controls to update layout when detail rows are resized
    _resizedRow(s, e: wijmo.grid.CellRangeEventArgs) {
        let row = e.getRow();
        if (row instanceof DetailRow && row.detail) {
            wijmo.Control.refreshAll(row.detail);
        }
    }

    // check if a row has details to show
    _hasDetail(row: number): boolean {
        let r = this._g.rows[row];
        return wijmo.isFunction(this._rowHasDetailFn)
            ? this._rowHasDetailFn(r)
            : this._isRegularRow(r);
    }

    // check if a row is a regular data row
    _isRegularRow(row: wijmo.grid.Row): boolean {
        if (row instanceof wijmo.grid._NewRowTemplate || row instanceof DetailRow) {
            return false;
        }
        if (row instanceof wijmo.grid.GroupRow && !this._g.childItemsPath) { // TFS 424963
            return false;
        }
        return true;
    }

    // creates the cell element that will show details for a given row
    _createDetailCell(row: wijmo.grid.Row): HTMLElement {
        return this.createDetailCell
            ? this.createDetailCell(row)
            : null;
    }
}

    }
    


    module wijmo.grid.detail {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.detail', wijmo.grid.detail);





    }
    