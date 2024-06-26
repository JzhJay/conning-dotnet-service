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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var detail;
        (function (detail) {
            'use strict';
            /**
             * Row that contains a single detail cell spanning all grid columns.
             */
            var DetailRow = /** @class */ (function (_super) {
                __extends(DetailRow, _super);
                /**
                 * Initializes a new instance of the {@link DetailRow} class.
                 *
                 * @param parentRow {@link Row} that this {@link DetailRow} provides details for.
                 */
                function DetailRow(parentRow) {
                    var _this = _super.call(this) || this;
                    _this.isReadOnly = true;
                    return _this;
                }
                Object.defineProperty(DetailRow.prototype, "detail", {
                    /**
                     * Gets or sets the HTML element that represents the detail cell in this {@link DetailRow}.
                     */
                    get: function () {
                        return this._detail;
                    },
                    set: function (value) {
                        this._detail = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return DetailRow;
            }(wijmo.grid.Row));
            detail.DetailRow = DetailRow;
        })(detail = grid.detail || (grid.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var detail;
        (function (detail) {
            'use strict';
            /**
             * Merge manager class used by the {@link FlexGridDetailProvider} class.
             *
             * The {@link DetailMergeManager} merges detail cells (cells in a {@link DetailRow})
             * into a single detail cell that spans all grid columns.
             */
            var DetailMergeManager = /** @class */ (function (_super) {
                __extends(DetailMergeManager, _super);
                /**
                 * Initializes a new instance of a {@link DetailMergeManager} class.
                 *
                 * @param grid Grid that owns this merge manager.
                 */
                function DetailMergeManager(grid) {
                    var _this = _super.call(this) || this;
                    _this._originalMergeManager = grid.mergeManager;
                    return _this;
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
                DetailMergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                    if (clip === void 0) { clip = true; }
                    switch (p.cellType) {
                        // merge detail cells all the way across
                        case wijmo.grid.CellType.Cell:
                            if (p.rows[r] instanceof detail.DetailRow) {
                                // do not merge across frozen boundaries (TFS 323964)
                                //let cols = p.columns,
                                //    frozen = Math.min(cols.length, cols.frozen);
                                //return c < frozen
                                //    ? new CellRange(r, 0, r, frozen - 1)
                                //    : new CellRange(r, frozen, r, cols.length - 1);
                                // disable frozen cell cloning (TFS 433415, 441996)
                                var cols = p.columns;
                                if (cols.frozen > 0 && p.grid) {
                                    p.grid.cloneFrozenCells = false; // TFS 323964
                                }
                                // merge across frozen column boundaries (TFS 334758, NSSOL request)
                                return new wijmo.grid.CellRange(r, 0, r, p.columns.length - 1);
                            }
                            break;
                        // merge row headers for main and detail rows
                        case wijmo.grid.CellType.RowHeader:
                            var isFrozen = _isFrozen(p, r), // not across frozen boundary: TFS 323964
                            isNew = _isNew(p, r), // not across new row template boundary: TFS 470088
                            dataItem = p.rows[r].dataItem;
                            // detail row doesn't have a dataItem (TFS 469943)
                            if (!dataItem && r > 0 && p.rows[r] instanceof detail.DetailRow) {
                                dataItem = p.rows[r - 1].dataItem;
                            }
                            // expand up, accounting for MultiRow grids (rows with same data item, TFS 428939)
                            var r1 = r;
                            while (r1 > 0 && p.rows[r1 - 1].dataItem == dataItem &&
                                _isFrozen(p, r1 - 1) == isFrozen &&
                                _isNew(p, r1 - 1) == isNew) {
                                r1--;
                            }
                            // expand down, accounting for MultiRow grids (TFS 428939)
                            var r2 = r;
                            while (r2 < p.rows.length - 1 && p.rows[r2 + 1].dataItem == dataItem &&
                                _isFrozen(p, r2 + 1) == isFrozen &&
                                _isNew(p, r2 + 1) == isNew) {
                                r2++;
                            }
                            // expand to include the DetailRow if it's there
                            if (r2 < p.rows.length - 1 && p.rows[r2 + 1] instanceof detail.DetailRow &&
                                _isFrozen(p, r2 + 1) == isFrozen &&
                                _isNew(p, r2 + 1) == isNew) {
                                r2++;
                            }
                            // done
                            return r1 != r2 ? new wijmo.grid.CellRange(r1, c, r2, c) : null;
                    }
                    // allow original manager
                    return this._originalMergeManager.getMergedRange(p, r, c, clip);
                };
                return DetailMergeManager;
            }(wijmo.grid.MergeManager));
            detail.DetailMergeManager = DetailMergeManager;
            function _isFrozen(p, r) {
                return r < p.rows.frozen;
            }
            function _isNew(p, r) {
                return p.rows[r] instanceof wijmo.grid._NewRowTemplate;
            }
        })(detail = grid_1.detail || (grid_1.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_2) {
        var detail;
        (function (detail) {
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
            var KeyAction;
            (function (KeyAction) {
                /** No special action (let the grid handle the key). */
                KeyAction[KeyAction["None"] = 0] = "None";
                /** Toggle the detail display. */
                KeyAction[KeyAction["ToggleDetail"] = 1] = "ToggleDetail";
            })(KeyAction = detail.KeyAction || (detail.KeyAction = {}));
            /**
             * Specifies when and how the row details are displayed.
             */
            var DetailVisibilityMode;
            (function (DetailVisibilityMode) {
                /**
                 * Details are shown or hidden in code, using the
                 * {@link FlexGridDetailProvider.showDetail} and
                 * {@link FlexGridDetailProvider.hideDetail} methods.
                 */
                DetailVisibilityMode[DetailVisibilityMode["Code"] = 0] = "Code";
                /**
                 * Details are shown for the row that is currently selected.
                 */
                DetailVisibilityMode[DetailVisibilityMode["Selection"] = 1] = "Selection";
                /**
                 * Details are shown or hidden using buttons added to the row headers.
                 * Only one row may be expanded at a time.
                 */
                DetailVisibilityMode[DetailVisibilityMode["ExpandSingle"] = 2] = "ExpandSingle";
                /**
                 * Details are shown or hidden using buttons added to the row headers.
                 * Multiple rows may be expanded at a time.
                 */
                DetailVisibilityMode[DetailVisibilityMode["ExpandMulti"] = 3] = "ExpandMulti";
            })(DetailVisibilityMode = detail.DetailVisibilityMode || (detail.DetailVisibilityMode = {}));
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
            var FlexGridDetailProvider = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link FlexGridDetailProvider} class.
                 *
                 * @param grid {@link FlexGrid} that will receive detail rows.
                 * @param options Initialization options for the new {@link FlexGridDetailProvider}.
                 */
                function FlexGridDetailProvider(grid, options) {
                    var _this = this;
                    this._maxHeight = null;
                    this._mode = DetailVisibilityMode.ExpandSingle;
                    this._animated = false;
                    this._keyActionEnter = KeyAction.None;
                    this._g = grid;
                    // custom merging for cells and row headers
                    grid.mergeManager = new detail.DetailMergeManager(grid);
                    // expand/collapse detail on click
                    grid.rowHeaders.hostElement.addEventListener('click', this._hdrClick.bind(this));
                    // expand/collapse detail on mousedown if editing (TFS 319419)
                    // because mousedown will finish/commit edits and refresh the grid
                    grid.rowHeaders.hostElement.addEventListener('mousedown', function (e) {
                        var ecv = grid.editableCollectionView;
                        if (grid.activeEditor || (ecv && ecv.currentEditItem)) {
                            _this._hdrClick(e);
                            e.preventDefault();
                        }
                    });
                    // show details, collapse/expand icons
                    // **REVIEW: using a timeout so this works with FlexGridSearch (C1WEB-26954)
                    // this works, but it's dirty; there should be a better solution
                    setTimeout(function () {
                        grid.formatItem.addHandler(_this._formatItem, _this);
                    }, 100);
                    // show details for selected cell
                    grid.selectionChanged.addHandler(this._selectionChanged, this);
                    // refresh controls to update layout when detail rows are resized
                    grid.resizedRow.addHandler(this._resizedRow, this);
                    // hide all details when grid is populated
                    grid.loadingRows.addHandler(function () { return _this.hideDetail(); });
                    // hide the detail for a row about to be removed
                    grid.deletingRow.addHandler(function (s, e) {
                        _this.hideDetail(e.row);
                    });
                    // handle fixed cell z-order when the parent grid has frozen cells
                    // and the detail cells contain grids with frozen cells (TFS 334760)
                    grid.updatedView.addHandler(this._handleFrozenCells, this);
                    // details don't work well with frozen cells (TFS 469949)
                    grid.cloneFrozenCells = false;
                    // hide detail when dragging row (TFS 241962)
                    grid.draggingRow.addHandler(function (s, e) {
                        if (e.row < s.rows.length - 1 && s.rows[e.row + 1] instanceof detail.DetailRow) {
                            e.cancel = true;
                            _this.hideDetail(e.row);
                        }
                    });
                    // handle the Enter key
                    grid.hostElement.addEventListener('keydown', function (e) {
                        if (e.keyCode == wijmo.Key.Enter && _this._keyActionEnter == KeyAction.ToggleDetail) {
                            var row = _this._g.selection.row;
                            if (_this._toggleRowDetail(row)) {
                                e.preventDefault();
                            }
                        }
                    }, true);
                    // refresh detail controls when the parent grid scrolls (TFS 372631)
                    grid._root.addEventListener('scroll', function () {
                        wijmo.Control.refreshAll(grid._root);
                    });
                    // apply initialization options if any
                    wijmo.copy(this, options);
                }
                Object.defineProperty(FlexGridDetailProvider.prototype, "grid", {
                    // ** object model
                    /**
                     * Gets the {@link FlexGrid} that owns this {@link FlexGridDetailProvider}.
                     */
                    get: function () {
                        return this._g;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "detailVisibilityMode", {
                    /**
                     * Gets or sets a value that determines when row details are displayed.
                     *
                     * The default value for this property is **DetailVisibilityMode.ExpandSingle**.
                     */
                    get: function () {
                        return this._mode;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, DetailVisibilityMode);
                        if (value != this._mode) {
                            this._mode = value;
                            this.hideDetail();
                            this._g.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "maxHeight", {
                    /**
                     * Gets or sets the maximum height of the detail rows, in pixels.
                     *
                     * The default value for this property is **null**, which means
                     * there's no upper limit to the detail row height.
                     */
                    get: function () {
                        return this._maxHeight;
                    },
                    set: function (value) {
                        value = wijmo.asNumber(value, true);
                        if (value != this._maxHeight) {
                            this._maxHeight = value;
                            this.hideDetail();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "isAnimated", {
                    /**
                     * Gets or sets a value that indicates whether to use animation when
                     * showing row details.
                     *
                     * The default value for this property is **false**.
                     */
                    get: function () {
                        return this._animated;
                    },
                    set: function (value) {
                        if (value != this._animated) {
                            this._animated = wijmo.asBoolean(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "keyActionEnter", {
                    /**
                     * Gets or sets the action to perform when the ENTER key is pressed.
                     *
                     * The default setting for this property is {@link KeyAction.None},
                     * which lets the grid handle the key.
                     * The other option is {@link KeyAction.ToggleDetail}, which handles
                     * the Enter key to toggle the display of the row details.
                     */
                    get: function () {
                        return this._keyActionEnter;
                    },
                    set: function (value) {
                        this._keyActionEnter = wijmo.asEnum(value, KeyAction);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "createDetailCell", {
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
                    get: function () {
                        return this._createDetailCellFn;
                    },
                    set: function (value) {
                        this._createDetailCellFn = wijmo.asFunction(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "disposeDetailCell", {
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
                    get: function () {
                        return this._disposeDetailCellFn;
                    },
                    set: function (value) {
                        this._disposeDetailCellFn = wijmo.asFunction(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "rowHasDetail", {
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
                    get: function () {
                        return this._rowHasDetailFn;
                    },
                    set: function (value) {
                        value = wijmo.asFunction(value, true);
                        if (value != this._rowHasDetailFn) {
                            this._rowHasDetailFn = value;
                            this.hideDetail();
                            this._g.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets the detail row associated with a given grid row.
                 *
                 * @param row Row or index of the row to investigate.
                 */
                FlexGridDetailProvider.prototype.getDetailRow = function (row) {
                    var rows = this._g.rows, index = this._toIndex(row), item = rows[index].dataItem;
                    for (; index < rows.length; index++) {
                        var row_1 = rows[index];
                        if (row_1 instanceof detail.DetailRow) {
                            return row_1;
                        }
                        if (row_1.dataItem != item) { // TFS 469932
                            return null;
                        }
                    }
                    return null;
                };
                /**
                 * Gets a value that determines if a row's details are visible.
                 *
                 * @param row Row or index of the row to investigate.
                 */
                FlexGridDetailProvider.prototype.isDetailVisible = function (row) {
                    return this.getDetailRow(row) != null;
                };
                /**
                 * Gets a value that determines if a row has details to show.
                 *
                 * @param row Row or index of the row to investigate.
                 */
                FlexGridDetailProvider.prototype.isDetailAvailable = function (row) {
                    row = this._toIndex(row);
                    return this._hasDetail(row);
                };
                /**
                 * Hides the detail row for a given row.
                 *
                 * @param row {@link Row} or index of the row that will have its details hidden.
                 * This parameter is optional. If not provided, all detail rows are hidden.
                 */
                FlexGridDetailProvider.prototype.hideDetail = function (row) {
                    var g = this._g, rows = g.rows;
                    // if 'row' is not provided, hide all details
                    if (row == null) {
                        for (var r = 0; r < rows.length; r++) {
                            if (rows[r] instanceof detail.DetailRow) {
                                this.hideDetail(r);
                            }
                        }
                        return;
                    }
                    // remove detail for a given row
                    var rowIndex = this._toIndex(row);
                    // skip to the next DetailRow (TFS 442485, 428939)
                    while (!(rows[rowIndex] instanceof detail.DetailRow) && rowIndex < rows.length - 1) {
                        rowIndex++;
                    }
                    // if we have a detail row, dispose of any child controls and remove the row
                    var detailRow = rows[rowIndex];
                    if (detailRow instanceof detail.DetailRow) {
                        // make sure any popups/drop-downs that belong to the detail are closed
                        // (e.g. FlexGridFilter editors, ComboBox drop-downs, etc)
                        var parent_1 = detailRow.detail.parentElement;
                        if (parent_1) { // TFS 470069
                            var ctls = parent_1.querySelectorAll('.wj-control');
                            for (var i = 0; i < ctls.length; i++) {
                                var ctl = wijmo.Control.getControl(ctls[i]);
                                if (ctl && ctl.containsFocus()) {
                                    g.focus(true);
                                }
                            }
                        }
                        // The disposeDetailCell method implementation may ask us to not
                        // perform disposal, due to performance or side effects considerations.
                        // For example, React destroys its content asynchronously, and calling
                        // Control.disposeAll here will lead to an exception in React.
                        var ddc = this.disposeDetailCell, noDispose = ddc ? ddc(detailRow) : false;
                        if (!noDispose) {
                            wijmo.Control.disposeAll(detailRow.detail);
                        }
                        // ready to remove the row
                        rows.removeAt(rowIndex);
                    }
                };
                /**
                 * Shows the detail row for a given row.
                 *
                 * @param row {@link Row} or index of the row that will have its details shown.
                 * @param hideOthers Whether to hide details for all other rows.
                 */
                FlexGridDetailProvider.prototype.showDetail = function (row, hideOthers) {
                    if (hideOthers === void 0) { hideOthers = false; }
                    var g = this._g, rows = g.rows;
                    // convert rows into indices
                    var rowIndex = this._toIndex(row);
                    // get main row if given row was a detail
                    if (rowIndex > 0 && rows[rowIndex] instanceof detail.DetailRow) {
                        rowIndex--;
                    }
                    // get the last row that has the same data item (MultiRow, TFS 428939)
                    var dataItem = rows[rowIndex].dataItem;
                    while (rowIndex < rows.length - 1 && rows[rowIndex + 1].dataItem == dataItem) {
                        rowIndex++;
                    }
                    // hide others before showing this
                    if (hideOthers) {
                        var sel = g.selection, updateSelection = false;
                        for (var r = 0; r < rows.length - 1; r++) {
                            if (r != rowIndex && rows[r + 1] instanceof detail.DetailRow) {
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
                        var detailRow = new detail.DetailRow(rows[rowIndex]), cell_1 = this._createDetailCell(rows[rowIndex]);
                        detailRow.detail = cell_1;
                        // insert new detail row below the current row and show it
                        if (cell_1) {
                            // insert the detail row
                            rows.insert(rowIndex + 1, detailRow);
                            // show the detail row
                            var focus_1 = g.containsFocus();
                            if (this._animated) {
                                var style_1 = cell_1.style;
                                style_1.transform = 'translateY(-100%)';
                                style_1.opacity = '0';
                                wijmo.animate(function (pct) {
                                    if (pct < 1) {
                                        style_1.transform = 'translateY(' + (-(1 - pct) * 100).toFixed(0) + '%)';
                                        style_1.opacity = (pct * pct).toString();
                                    }
                                    else {
                                        style_1.transform = style_1.opacity = '';
                                        wijmo.Control.invalidateAll(cell_1);
                                        if (focus_1) {
                                            g.scrollIntoView(rowIndex + 1, -1);
                                        }
                                    }
                                });
                            }
                            else {
                                if (focus_1) { // TFS 363004
                                    g.scrollIntoView(rowIndex + 1, -1, true);
                                }
                            }
                        }
                    }
                };
                // ** implementation
                // initialize the size of the detail row (TFS 363004)
                FlexGridDetailProvider.prototype._sizeDetailRow = function (row) {
                    var g = this._g, cell = row.detail;
                    // refresh inner controls before measuring
                    wijmo.Control.refreshAll(cell);
                    // calculate height needed for the detail cell + vertical padding + border
                    var rowHeight = cell.offsetHeight + g._cellPadVert + 1, maxHeight = this._maxHeight;
                    if (wijmo.isNumber(maxHeight) && maxHeight > 0 && rowHeight > maxHeight) {
                        rowHeight = maxHeight;
                    }
                    row.height = rowHeight;
                    // make the cell element fill the row
                    if (!cell.style.height) {
                        cell.style.height = '100%';
                    }
                    // make inner FlexGrid controls fill the row
                    var innerGrid = cell.querySelector('.wj-flexgrid');
                    if (innerGrid && !innerGrid.style.height) {
                        innerGrid.style.height = '100%';
                    }
                };
                // fix z-index when parent grid and detail grid have frozen cells
                // this is ugly, but the scenario should be pretty rare.
                // this is also required when only the detail grid has frozen cells
                // (TFS 323964, 334760, 381606)
                FlexGridDetailProvider.prototype._handleFrozenCells = function () {
                    var g = this._g, host = g.hostElement, gridSelector = '.wj-flexgrid', detailGrid = wijmo.Control.getControl(host.querySelector(gridSelector));
                    if (detailGrid instanceof wijmo.grid.FlexGrid) {
                        if (detailGrid.frozenRows || detailGrid.frozenColumns) {
                            wijmo.setCss([g._eTL, g._eBL, g._eCHdr, g._eCFtr, g._eRHdr, g._eMarquee], {
                                zIndex: '13'
                            });
                            var frozenCells = host.querySelectorAll('.wj-frozen');
                            for (var i = 0; i < frozenCells.length; i++) {
                                var cell = frozenCells[i];
                                if (wijmo.closest(cell, gridSelector) == host) {
                                    var zIndex = parseInt(cell.style.zIndex);
                                    cell.style.zIndex = ((zIndex % 10) + 10).toString();
                                }
                            }
                        }
                    }
                };
                // convert Row objects into row indices
                FlexGridDetailProvider.prototype._toIndex = function (row) {
                    return row instanceof wijmo.grid.Row
                        ? row.index
                        : wijmo.asNumber(row);
                };
                // expand/collapse detail row
                FlexGridDetailProvider.prototype._hdrClick = function (e) {
                    if (!e.defaultPrevented && e.button == 0) {
                        if (wijmo.closestClass(e.target, FlexGridDetailProvider._WJC_DETAIL)) {
                            var DVM = DetailVisibilityMode;
                            switch (this._mode) {
                                case DVM.ExpandMulti:
                                case DVM.ExpandSingle:
                                    var g = this._g, ht = g.hitTest(e.target);
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
                };
                // toggle the detail for a given row
                FlexGridDetailProvider.prototype._toggleRowDetail = function (row) {
                    if (row > -1) { // TFS 342189
                        if (this.isDetailVisible(row)) {
                            this.hideDetail(row);
                            return true;
                        }
                        else if (this._hasDetail(row)) {
                            var g = this._g;
                            g.select(new wijmo.grid.CellRange(row, 0, row, g.columns.length - 1));
                            this.showDetail(row, this._mode == DetailVisibilityMode.ExpandSingle);
                            return true;
                        }
                    }
                    return false;
                };
                // expand selected row (but not too often)
                FlexGridDetailProvider.prototype._selectionChanged = function (s, e) {
                    var _this = this;
                    if (this._mode == DetailVisibilityMode.Selection) {
                        if (this._toSel) {
                            clearTimeout(this._toSel);
                        }
                        this._toSel = setTimeout(function () {
                            var row = s._selHdl.selection.row;
                            if (row > -1) { // TFS 121667
                                _this.showDetail(row, true);
                            }
                            else {
                                _this.hideDetail();
                            }
                        }, 300);
                    }
                };
                // show details, collapse/expand icons
                FlexGridDetailProvider.prototype._formatItem = function (s, e) {
                    var g = this._g, cell = e.cell, row = e.getRow(), DVM = DetailVisibilityMode;
                    // add detail to the first cell in the detail row (TFS 334758, NSSOL adamant request)
                    if (e.panel == g.cells && row instanceof detail.DetailRow && row.detail != null) {
                        if (!wijmo.hasClass(cell, 'wj-detail')) { // TFS 412828
                            // add detail to cell
                            wijmo.addClass(cell, 'wj-detail');
                            cell.textContent = '';
                            cell.style.textAlign = cell.style.zIndex = ''; // TFS 130035, 323964
                            cell.className = cell.className.replace(/wj\-align\-[\S]+/g, ''); // TFS 130035
                            cell.appendChild(row.detail);
                            // set row height (once, and on-demand: TFS 363004)
                            if (row.height == null) {
                                this._sizeDetailRow(row);
                            }
                            else {
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
                                var expanded = this.isDetailVisible(e.row), glyph = expanded ? 'minus' : 'plus', cls = FlexGridDetailProvider._WJC_DETAIL;
                                // add toggle button with collapse/expand icon
                                // NOTE: using div instead of button to allow dragging in IE/Firefox (TFS 351412)
                                cell.innerHTML =
                                    '<div class="wj-btn wj-btn-glyph ' + cls + '" role="button" tabindex="-1">' +
                                        '<span class="wj-glyph-' + glyph + '"></span>' +
                                        '</div>';
                                // add ARIA attributes to the button
                                var btn = cell.children[0], label = wijmo.culture.FlexGridDetailProvider.ariaLabels.toggleDetail;
                                wijmo.setAriaLabel(btn, label);
                                wijmo.setAttribute(btn, 'aria-expanded', expanded);
                        }
                    }
                };
                // refresh controls to update layout when detail rows are resized
                FlexGridDetailProvider.prototype._resizedRow = function (s, e) {
                    var row = e.getRow();
                    if (row instanceof detail.DetailRow && row.detail) {
                        wijmo.Control.refreshAll(row.detail);
                    }
                };
                // check if a row has details to show
                FlexGridDetailProvider.prototype._hasDetail = function (row) {
                    var r = this._g.rows[row];
                    return wijmo.isFunction(this._rowHasDetailFn)
                        ? this._rowHasDetailFn(r)
                        : this._isRegularRow(r);
                };
                // check if a row is a regular data row
                FlexGridDetailProvider.prototype._isRegularRow = function (row) {
                    if (row instanceof wijmo.grid._NewRowTemplate || row instanceof detail.DetailRow) {
                        return false;
                    }
                    if (row instanceof wijmo.grid.GroupRow && !this._g.childItemsPath) { // TFS 424963
                        return false;
                    }
                    return true;
                };
                // creates the cell element that will show details for a given row
                FlexGridDetailProvider.prototype._createDetailCell = function (row) {
                    return this.createDetailCell
                        ? this.createDetailCell(row)
                        : null;
                };
                FlexGridDetailProvider._WJC_DETAIL = 'wj-elem-detail';
                return FlexGridDetailProvider;
            }());
            detail.FlexGridDetailProvider = FlexGridDetailProvider;
        })(detail = grid_2.detail || (grid_2.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var detail;
        (function (detail) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.detail', wijmo.grid.detail);
        })(detail = grid.detail || (grid.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.detail.js.map