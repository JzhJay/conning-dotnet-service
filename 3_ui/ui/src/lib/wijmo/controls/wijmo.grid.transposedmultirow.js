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
        var transposedmultirow;
        (function (transposedmultirow) {
            'use strict';
            /**
             * Extends the {@link Row} class to provide additional API for multi-row records.
             */
            var _MultiRow = /** @class */ (function (_super) {
                __extends(_MultiRow, _super);
                /**
                 * Initializes a new instance of the {@link Row} class.
                 *
                 * @param dataItem The data item this row is bound to.
                 * @param dataIndex The index of the record within the items source.
                 */
                function _MultiRow(dataItem, dataIndex) {
                    var _this = _super.call(this, dataItem) || this;
                    _this._idxData = dataIndex;
                    return _this;
                }
                return _MultiRow;
            }(wijmo.grid.Row));
            transposedmultirow._MultiRow = _MultiRow;
        })(transposedmultirow = grid.transposedmultirow || (grid.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposedmultirow;
        (function (transposedmultirow) {
            'use strict';
            /**
             * Extends the {@link Column} class with <b>colspan</b> property to
             * describe a cell in a {@link _CellGroup}.
             */
            var _Cell = /** @class */ (function (_super) {
                __extends(_Cell, _super);
                /**
                 * Initializes a new instance of the {@link _Cell} class.
                 *
                 * @param options JavaScript object containing initialization data for the {@link _Cell}.
                 */
                function _Cell(options) {
                    var _this = _super.call(this) || this;
                    _this._row = _this._col = 0;
                    _this._rowspan = _this._colspan = 1;
                    wijmo.copy(_this, options);
                    return _this;
                }
                Object.defineProperty(_Cell.prototype, "row", {
                    /**
                     * Gets or sets the row index of this {@link _Cell} within the cell group.
                     */
                    get: function () {
                        return this._row;
                    },
                    set: function (value) {
                        this._row = wijmo.asInt(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_Cell.prototype, "col", {
                    /**
                     * Gets or sets the column index of this {@link _Cell} within the cell group.
                     */
                    get: function () {
                        return this._col;
                    },
                    set: function (value) {
                        this._col = wijmo.asInt(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_Cell.prototype, "colspan", {
                    /**
                     * Gets or sets the number of physical columns spanned by the {@link _Cell}.
                     */
                    get: function () {
                        return this._colspan;
                    },
                    set: function (value) {
                        this._colspan = wijmo.asInt(value, false, true);
                        wijmo.assert(this._colspan > 0, 'colspan must be >= 1');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_Cell.prototype, "rowspan", {
                    /**
                     * Gets or sets the number of physical rows spanned by the {@link _Cell}.
                     */
                    get: function () {
                        return this._rowspan;
                    },
                    set: function (value) {
                        this._rowspan = wijmo.asInt(value, false, true);
                        wijmo.assert(this._rowspan > 0, 'colspan must be >= 1');
                    },
                    enumerable: true,
                    configurable: true
                });
                return _Cell;
            }(wijmo.grid.Column));
            transposedmultirow._Cell = _Cell;
        })(transposedmultirow = grid.transposedmultirow || (grid.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposedmultirow;
        (function (transposedmultirow) {
            'use strict';
            /**
             * Describes a group of cells that may span multiple rows and columns.
             */
            var _CellGroup = /** @class */ (function (_super) {
                __extends(_CellGroup, _super);
                /**
                 * Initializes a new instance of the {@link _CellGroup} class.
                 *
                 * @param layout {@link _Layout} that owns the {@link _CellGroup}.
                 * @param options JavaScript object containing initialization data for the new {@link _CellGroup}.
                 */
                function _CellGroup(layout, options) {
                    var _this = _super.call(this) || this;
                    _this._colstart = 0; // index of the column where this group starts
                    _this._rowstart = 0; // index of the row where this group starts
                    // save reference to owner layout
                    _this._layout = layout;
                    _this._g = layout._grid;
                    // parse options
                    wijmo.copy(_this, options);
                    if (!_this._cells) {
                        throw 'Cell group with no cells?';
                    }
                    // position cells within the group
                    var r = 0, c = 0;
                    _this._cells.forEach(function (cell, index) {
                        while (!_this._cellFits(cell, index, r, c)) { // find a free slot
                            c = (c + 1) % _this.colspan;
                            if (c == 0)
                                r++;
                        }
                        cell.row = r;
                        cell.col = c;
                    });
                    // set group's row/col span
                    var rs = 1, cs = 1;
                    _this._cells.forEach(function (cell) {
                        rs = Math.max(rs, cell.row + cell.rowspan);
                        cs = Math.max(cs, cell.col + cell.colspan);
                    });
                    _this.rowspan = rs;
                    _this.colspan = cs;
                    return _this;
                }
                // method used in JSON-style initialization
                _CellGroup.prototype._copy = function (key, value) {
                    var _this = this;
                    if (key == 'cells') {
                        this._cells = [];
                        if (wijmo.isArray(value)) {
                            value.forEach(function (item) {
                                var cell = new transposedmultirow._Cell(item);
                                if (cell.binding && !cell.header) {
                                    cell.header = wijmo.toHeaderCase(cell.binding);
                                }
                                _this._cells.push(cell);
                                _this.colspan = Math.max(_this.colspan, cell.colspan);
                            });
                        }
                        return true;
                    }
                    return false;
                };
                Object.defineProperty(_CellGroup.prototype, "cells", {
                    // required for JSON-style initialization
                    get: function () {
                        return this._cells;
                    },
                    enumerable: true,
                    configurable: true
                });
                // calculate merged ranges
                _CellGroup.prototype.closeGroup = function (columnsPerItem) {
                    var _this = this;
                    // adjust colspan to match longest group in the grid
                    if (columnsPerItem > this.colspan) {
                        this._cells.forEach(function (cell) {
                            if (cell.col == _this.colspan - 1) {
                                cell.colspan = columnsPerItem - cell.col;
                            }
                        });
                        this.colspan = columnsPerItem;
                    }
                    // make sure cells fill the group
                    this._cells.forEach(function (cell) {
                        while (cell.col + cell.colspan < _this.colspan &&
                            !_this._slotTaken(cell.row, cell.col + cell.colspan)) {
                            cell.colspan++;
                        }
                    });
                    this._cells.forEach(function (cell) {
                        while (cell.row + cell.rowspan < _this.rowspan &&
                            !_this._slotTaken(cell.row + cell.rowspan, cell.col)) {
                            cell.rowspan++;
                        }
                    });
                    // make sure there are no empty slots (pathological cases)
                    for (var r = 0; r < this.rowspan; r++) {
                        for (var c = 0; c < this.colspan; c++) {
                            wijmo.assert(this._slotTaken(r, c), 'Invalid layout (empty cells).');
                        }
                    }
                    // create arrays with binding columns and create merge ranges for each cell
                    this._cols = new wijmo.grid.ColumnCollection(this._g, this._g.columns.defaultSize);
                    this._rng = new Array(columnsPerItem * this.rowspan);
                    //console.log('grp[' + this._rowstart + ',' + this._colstart + ']');
                    this._cells.forEach(function (cell) {
                        for (var r = 0; r < cell.rowspan; r++) {
                            for (var c = 0; c < cell.colspan; c++) {
                                var index = (cell.row + r) * _this.colspan + (cell.col + c);
                                // save binding column for this cell offset
                                _this._cols.setAt(index, cell);
                                // save merge range for this cell offset
                                var rng = new wijmo.grid.CellRange(cell.row, cell.col, cell.row + cell.rowspan - 1, cell.col + cell.colspan - 1);
                                if (!rng.isSingleCell) {
                                    //console.log('rng[' + index + '] = ' + format('({row},{col})-({row2},{col2})', rng));
                                    _this._rng[index] = rng;
                                }
                            }
                        }
                    });
                    // add extra range for collapsed group headers
                    this._rng[-1] = new wijmo.grid.CellRange(this._rowstart, this._colstart, this._rowstart + this._rowspan - 1, this._colstart);
                };
                // get merged range for a cell in this group
                _CellGroup.prototype.getMergedRange = function (p, r, c) {
                    // row header, group
                    if (c < 0) {
                        return this._rng[-1];
                    }
                    // regular cell range
                    var rs = r - this._rowstart, cs = c % this.colspan, rng = this._rng[rs * this.colspan + cs];
                    // row header, non-group
                    if (p.cellType == wijmo.grid.CellType.RowHeader) {
                        c++;
                    }
                    // done
                    var r0 = r - rs, c0 = c - cs;
                    return rng
                        ? new wijmo.grid.CellRange(r0 + rng.row, c0 + rng.col, r0 + rng.row2, c0 + rng.col2)
                        : null;
                };
                // get the binding column for a cell in this group
                _CellGroup.prototype.getBindingColumn = function (p, r, c) {
                    // merged row header binding
                    // return 'this' to render the collapsed group header
                    if (c < 0) {
                        return this;
                    }
                    // regular cells
                    var rs = r - this._rowstart, cs = c % this.colspan;
                    var col = this._cols[rs * this.colspan + cs];
                    // done
                    return col;
                };
                // checks whether a cell fits in a given slot (adjusts colspan if needed)
                _CellGroup.prototype._cellFits = function (cell, index, r, c) {
                    // too wide?
                    if (c > 0 && c + cell.colspan > this.colspan) {
                        return false;
                    }
                    // slot taken?
                    for (var i = 0; i < cell.colspan; i++) {
                        if (this._slotTaken(r, c + i, index)) {
                            return false;
                        }
                    }
                    // adjust group colspan
                    this.colspan = Math.max(this.colspan, c + cell.colspan - 1);
                    // seems to fit
                    return true;
                };
                // checks whether a given row/col slot within the panel is currently in use
                _CellGroup.prototype._slotTaken = function (r, c, index) {
                    if (index === void 0) { index = this._cells.length; }
                    for (var i = 0; i < index; i++) {
                        var cell = this._cells[i];
                        if (r >= cell.row && r <= cell.row + cell.rowspan - 1) {
                            if (c >= cell.col && c <= cell.col + cell.colspan - 1) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                // update missing cell types to match data
                _CellGroup.prototype._updateCellTypes = function (item) {
                    this._cols.forEach(function (col) {
                        var cell = col;
                        if (cell.dataType == null && cell._binding) {
                            cell.dataType = wijmo.getType(cell._binding.getValue(item));
                        }
                    });
                };
                return _CellGroup;
            }(transposedmultirow._Cell));
            transposedmultirow._CellGroup = _CellGroup;
        })(transposedmultirow = grid.transposedmultirow || (grid.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var transposedmultirow;
        (function (transposedmultirow) {
            'use strict';
            /**
             * Provides custom merging for {@link TransposedMultiRow} controls.
             */
            var _MergeManager = /** @class */ (function (_super) {
                __extends(_MergeManager, _super);
                function _MergeManager() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
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
                _MergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                    if (clip === void 0) { clip = true; }
                    var grid = p.grid;
                    if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
                        return null;
                    }
                    // merge cells
                    switch (p.cellType) {
                        // merge cells in cells and row headers panels
                        case wijmo.grid.CellType.Cell:
                        case wijmo.grid.CellType.RowHeader:
                            // get the group range
                            var row = p.rows[r], info = row.dataItem._rowInfo;
                            var r_effective = info.index;
                            var c_corrected = c;
                            if (p.cellType == wijmo.grid.CellType.RowHeader) {
                                c_corrected--; // discount group header column (always the first)
                            }
                            var group = grid._getGroupByRow(r);
                            wijmo.assert(group instanceof transposedmultirow._CellGroup, 'Failed to get the group!');
                            var rng = group.getMergedRange(p, r_effective, c_corrected);
                            // normalize
                            if (rng) {
                                var r_eff_prev = r_effective;
                                var r_prev = r;
                                if (r > 0) {
                                    r_eff_prev = p.rows[r - 1].dataItem._rowInfo.index;
                                    r_prev = r - 1;
                                }
                                if (rng.row <= r_eff_prev) {
                                    rng.row = r_prev;
                                }
                                else {
                                    rng.row = r;
                                }
                                var r_eff_next = r_effective;
                                var r_next = r;
                                if (r < p.rows.length - 1) {
                                    r_eff_next = p.rows[r + 1].dataItem._rowInfo.index;
                                    r_next = r + 1;
                                }
                                if (rng.row2 >= r_eff_next) {
                                    rng.row2 = r_next;
                                }
                                else {
                                    rng.row2 = r;
                                }
                            }
                            // sanity
                            wijmo.assert(!rng || rng.contains(r, c), 'Merged range must contain source cell');
                            // return the range
                            return rng;
                        // merge cells in column headers panel
                        case wijmo.grid.CellType.ColumnHeader:
                            var cpi = grid.columnsPerItem, c0 = c - c % cpi, c1 = Math.min(c0 + cpi - 1, p.columns.length - 1);
                            return new wijmo.grid.CellRange(0, c0, p.rows.length - 1, c1);
                        // merge cells in top/left cell
                        case wijmo.grid.CellType.TopLeft:
                            return new wijmo.grid.CellRange(0, 0, p.rows.length - 1, p.columns.length - 1);
                    }
                    // no merging
                    return null;
                };
                return _MergeManager;
            }(wijmo.grid.MergeManager));
            transposedmultirow._MergeManager = _MergeManager;
        })(transposedmultirow = grid_1.transposedmultirow || (grid_1.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_2) {
        var transposedmultirow;
        (function (transposedmultirow) {
            'use strict';
            /**
             * Class that parses {@link TransposedMultiRow} layout definitions.
             */
            var _MultiRowLayout = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link _LayoutDef} class.
                 *
                 * @param grid {@link TransposedMultiRow} that owns this layout.
                 * @param layoutDef Array that contains the layout definition.
                 */
                function _MultiRowLayout(grid, layoutDef) {
                    this._columnsPerItem = 1;
                    this._bindingGroups = [];
                    this._groupsByRow = {};
                    this._grid = grid;
                    this._bindingGroups = this._parseCellGroups(layoutDef);
                }
                Object.defineProperty(_MultiRowLayout.prototype, "totalRowSpan", {
                    // gets total number of rows in all groups
                    get: function () {
                        var groups = this._bindingGroups;
                        if (groups && groups.length) {
                            var group = groups[groups.length - 1];
                            return group._rowstart + group.rowspan;
                        }
                        else {
                            return 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // implementation
                // parse an array of JavaScript objects into an array of _BindingGroup objects
                _MultiRowLayout.prototype._parseCellGroups = function (groups) {
                    var arr = [], columnsPerItem = 1;
                    if (groups) {
                        // parse binding groups
                        for (var i = 0, rowStart = 0; i < groups.length; i++) {
                            var group = new transposedmultirow._CellGroup(this, groups[i]);
                            group._rowstart = rowStart;
                            rowStart += group._rowspan;
                            columnsPerItem = Math.max(columnsPerItem, group._colspan);
                            arr.push(group);
                        }
                        // close binding groups (calculate merged ranges)
                        arr.forEach(function (group) {
                            group.closeGroup(columnsPerItem);
                        });
                        this._columnsPerItem = columnsPerItem;
                    }
                    // all done
                    return arr;
                };
                // get the group that owns a given row
                _MultiRowLayout.prototype._getGroupByRow = function (r) {
                    var groupIndex = this._getGroupIndexByRow(r);
                    return (groupIndex > -1) ? this._bindingGroups[groupIndex] : null;
                };
                // get the group index that owns a given row
                _MultiRowLayout.prototype._getGroupIndexByRow = function (r) {
                    // get from cache
                    var groupIndex = this._groupsByRow[r];
                    if (groupIndex) {
                        return groupIndex;
                    }
                    // not in cache yet, find it now
                    var groups = this._bindingGroups;
                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        if (r >= group._rowstart && r <= group._rowstart + group._rowspan - 1) {
                            this._groupsByRow[r] = i; // found it!
                            return i;
                        }
                    }
                    // not found
                    return -1;
                };
                // update missing cell types to match data
                _MultiRowLayout.prototype._updateCellTypes = function (item) {
                    this._bindingGroups.forEach(function (group) {
                        group._updateCellTypes(item);
                    });
                };
                return _MultiRowLayout;
            }());
            transposedmultirow._MultiRowLayout = _MultiRowLayout;
        })(transposedmultirow = grid_2.transposedmultirow || (grid_2.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposedmultirow;
        (function (transposedmultirow) {
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
            var TransposedMultiRow = /** @class */ (function (_super) {
                __extends(TransposedMultiRow, _super);
                /**
                 * Initializes a new instance of the {@link TransposedMultiRow} class.
                 *
                 * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function TransposedMultiRow(element, options) {
                    var _this = _super.call(this, element) || this;
                    // ordinal position of the current item in the view
                    // actually used for preservation when rebinding grid (TFS 467517)
                    _this._currentPos = -1;
                    _this._bindingColumns = {};
                    _this._keyPrefix = 'item';
                    // add class name to enable styling
                    wijmo.addClass(_this.hostElement, 'wj-transposed-multirow');
                    // start with empty layout
                    _this._layout = new transposedmultirow._MultiRowLayout(_this, null);
                    // change some defaults
                    _this.allowDragging = wijmo.grid.AllowDragging.None;
                    _this.allowSorting = wijmo.grid.AllowSorting.None;
                    _this.mergeManager = new transposedmultirow._MergeManager();
                    // custom cell rendering
                    // listen to event "formatItem"
                    // instead overriding method "onFormatItem"
                    // because the latter is not called if there are no event listeners
                    _this.formatItem.addHandler(_this._formatItem, _this);
                    // initialize rowInfo array
                    _this._rowInfo = new wijmo.grid.ColumnCollection(_this, _this.columns.defaultSize);
                    // apply options after everything else is ready
                    _this.initialize(options);
                    // listen for changes in _rowInfo array after applying options
                    _this._rowInfo.collectionChanged.addHandler(_this._rowInfoChanged, _this);
                    return _this;
                }
                ;
                Object.defineProperty(TransposedMultiRow.prototype, "layoutDefinition", {
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
                    get: function () {
                        return this._layoutDef;
                    },
                    set: function (value) {
                        // store original value so user can get it back
                        this._layoutDef = wijmo.asArray(value);
                        // parse cell layout
                        this._layout = new transposedmultirow._MultiRowLayout(this, value);
                        // re-generate rows
                        this._rowInfoChanged();
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets the {@link Column} object used to bind a data item to a grid cell.
                 *
                 * @param p {@link GridPanel} that contains the cell.
                 * @param r Index of the row that contains the cell.
                 * @param c Index of the column that contains the cell.
                 */
                TransposedMultiRow.prototype.getBindingColumn = function (p, r, c) {
                    // support cell types only
                    if (p.cellType != wijmo.grid.CellType.Cell) {
                        return null;
                    }
                    var row = p.rows[r], info = row.dataItem._rowInfo;
                    var r_effective = info.index;
                    // get from the cache
                    var key = r_effective + '_' + c;
                    var bCol = this._bindingColumns[key];
                    if (bCol) {
                        return bCol;
                    }
                    // not in the cache yet, get from the group
                    var group = this._getGroupByRow(r);
                    var cell = group.getBindingColumn(p, r_effective, c);
                    if (cell) {
                        bCol = new wijmo.grid.Column();
                        // copy props
                        var props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Column);
                        props.forEach(function (prop) {
                            if (cell[prop] != null) {
                                bCol[prop] = cell[prop];
                            }
                        });
                        // set effective binding
                        var index = Math.floor(c / this.columnsPerItem);
                        var record = c % this.columnsPerItem;
                        bCol.binding = this._keyPrefix + index + '_' + record;
                        // set to the cache
                        this._bindingColumns[key] = bCol;
                    }
                    // done
                    return bCol;
                };
                Object.defineProperty(TransposedMultiRow.prototype, "columnsPerItem", {
                    /**
                     * Gets the number of columns used to display each item.
                     *
                     * This value is calculated automatically based on the value
                     * of the <b>layoutDefinition</b> property.
                     */
                    get: function () {
                        return this._layout._columnsPerItem;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "allowAddNew", {
                    // ** overrides
                    // TransposedMultiRow does not support items addition
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        wijmo.assert(!value, 'TransposedMultiRow does not support items addition.');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "allowDelete", {
                    // TransposedMultiRow does not support items deletion
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        wijmo.assert(!value, 'TransposedMultiRow does not support items deletion.');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "allowDragging", {
                    // TransposedMultiRow does not support dragging
                    get: function () {
                        return wijmo.grid.AllowDragging.None;
                    },
                    set: function (value) {
                        wijmo.assert(value === wijmo.grid.AllowDragging.None, 'TransposedMultiRow does not support dragging.');
                        if (value !== this._alDragging) {
                            this._alDragging = value;
                            this.invalidate(); // to re-create row/col headers
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "allowPinning", {
                    // TransposedMultiRow does not support pinning
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        wijmo.assert(!value, 'TransposedMultiRow does not support pinning.');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "allowSorting", {
                    // TransposedMultiRow does not support sorting
                    get: function () {
                        return wijmo.grid.AllowSorting.None;
                    },
                    set: function (value) {
                        wijmo.assert(value === wijmo.grid.AllowSorting.None, 'TransposedMultiRow does not support sorting.');
                        this._alSorting = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedMultiRow.prototype, "columnLayout", {
                    // TransposedMultiRow does not support column layout
                    get: function () {
                        throw 'TransposedMultiRow does not support column layout.';
                    },
                    set: function (value) {
                        throw 'TransposedMultiRow does not support column layout.';
                    },
                    enumerable: true,
                    configurable: true
                });
                // re-generate rows when the _rowInfo changes
                TransposedMultiRow.prototype.refresh = function (fullUpdate) {
                    var rowInfo = this._rowInfo;
                    if (rowInfo._dirty) {
                        rowInfo._dirty = false;
                        this._rowInfoChanged();
                    }
                    else {
                        _super.prototype.refresh.call(this, fullUpdate);
                    }
                };
                // update grid when rows are loaded
                TransposedMultiRow.prototype.onLoadedRows = function (e) {
                    var _this = this;
                    // update column header cells
                    var chCols = this.columnHeaders.columns;
                    for (var i = 0; i < chCols.length; i++) {
                        this.columnHeaders.setCellData(0, i, '');
                    }
                    // update columns
                    var cols = this.columns;
                    for (var i = 0; i < cols.length; i++) {
                        var col = cols[i];
                        col.align = null; // not '', that means 'left'
                        col.dataType = 0; // 'Any' (not null, or the grid will auto-set it)
                    }
                    // update row header cells
                    var rhCols = this.rowHeaders.columns;
                    this.rows.forEach(function (row) {
                        var info = row.dataItem._rowInfo;
                        if (info) {
                            for (var c = rhCols.length - 2; c >= 0; c--) {
                                var hdr = info.headers[c] || wijmo.toHeaderCase(info.bindings[c]);
                                //console.log('(' + row.index + ',' + c + '): ' + hdr);
                                _this.rowHeaders.setCellData(row.index, c + 1, hdr);
                            }
                        }
                    });
                    // update row header columns
                    rhCols[0].visible = false; // hide the first column
                    for (var i = 1; i < rhCols.length; i++) {
                        rhCols[i].align = 'left';
                        rhCols[i].visible = true; // show the rest of the columns
                        rhCols[i].width = this.columns.defaultSize;
                    }
                    // go raise the event
                    _super.prototype.onLoadedRows.call(this, e);
                };
                /*protected*/ TransposedMultiRow.prototype._getGroupByRow = function (r) {
                    var p = this.cells, row = p.rows[r], info = row.dataItem._rowInfo;
                    var r_effective = info.index;
                    var group = this._layout._getGroupByRow(r_effective);
                    wijmo.assert(group instanceof transposedmultirow._CellGroup, 'Failed to get the group!');
                    return group;
                };
                // bind rows
                /*protected*/ TransposedMultiRow.prototype._addBoundRow = function (items, index) {
                    var item = items[index];
                    this.rows.push(new transposedmultirow._MultiRow(item, index));
                };
                // update missing column types to match data
                /*protected*/ TransposedMultiRow.prototype._updateColumnTypes = function () {
                    // allow base class
                    _super.prototype._updateColumnTypes.call(this);
                    // update missing column types in all binding groups
                    var view = this.collectionView;
                    if (wijmo.hasItems(view) && this._layout) {
                        var transposedItem = view.items[0];
                        var items = transposedItem._arr;
                        if (items && items.length > 0) {
                            this._layout._updateCellTypes(items[0]);
                        }
                    }
                };
                // get the binding column 
                // (in the MultiRow grid, each physical column may contain several binding columns)
                /*protected*/ TransposedMultiRow.prototype._getBindingColumn = function (p, r, c) {
                    if (this._layout) {
                        if (p == this.cells) {
                            c = this.getBindingColumn(p, r, c.index);
                        }
                        return c;
                    }
                    return _super.prototype._getBindingColumn.call(this, p, r, c);
                };
                // get value that indicates whether layout is transposed or not
                // Note: transposed layout is when rows represent properties and
                // columns represent items
                /*protected*/ TransposedMultiRow.prototype._isTransposed = function () {
                    return true;
                };
                // update source CollectionView after editing
                TransposedMultiRow.prototype.onRowEditEnded = function (e) {
                    if (this._view != null) {
                        var args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change);
                        this._view.collectionChanged.raise(this._view, args);
                    }
                    _super.prototype.onRowEditEnded.call(this, e);
                };
                // overridden to transpose incoming data
                TransposedMultiRow.prototype._getCollectionView = function (value) {
                    // original CollectionView's getError function
                    var getError = null;
                    // remove CollectionView event handler
                    if (this._view != null) {
                        this._view.collectionChanged.removeHandler(this._sourceViewChanged);
                    }
                    // transpose the source data, add CollectionView event handler
                    if (wijmo.isArray(value)) {
                        value = this._transposeItemsSource(value);
                    }
                    else if (value) {
                        if (this._view) {
                            this._view.collectionChanged.removeHandler(this._sourceViewChanged);
                        }
                        this._view = wijmo.tryCast(value, 'ICollectionView');
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
                    var retVal = _super.prototype._getCollectionView.call(this, value);
                    // restore preserved position (TFS 467517)
                    if (retVal && this._currentPos >= 0) {
                        retVal.currentPosition = Math.min(retVal.items.length - 1, this._currentPos);
                    }
                    // honor original CollectionView's getError handler (TFS 412376)
                    if (getError && retVal instanceof wijmo.collections.CollectionView) {
                        retVal.getError = function (item, prop) {
                            if (prop == null) { // WJM-20019
                                return null;
                            }
                            var index = item._keys.indexOf(prop);
                            var recIndex = index % item._bnd.length;
                            var itemIndex = Math.floor(index / item._bnd.length);
                            return getError(item._arr[itemIndex], item._bnd[recIndex].path);
                        };
                    }
                    // done
                    return retVal;
                };
                // ** implementation
                // rows added/removed/changed, re-bind the whole grid
                TransposedMultiRow.prototype._rowInfoChanged = function () {
                    try {
                        // preserve current position before rebinding grid
                        var cv = this.collectionView;
                        this._currentPos = cv ? cv.currentPosition : -1;
                        // preserve selection
                        // because itemsSource setter internally resets selection
                        var sel = this.selection;
                        // re-bind grid
                        this._bindingColumns = {};
                        var items = this.itemsSource;
                        this.itemsSource = null;
                        this.itemsSource = items;
                        // restore preserved selection
                        if (sel && sel.isValid) {
                            this.selection = sel;
                        }
                    }
                    finally {
                        // reset preserved position after rebinding grid
                        this._currentPos = -1;
                    }
                };
                // customize cells
                TransposedMultiRow.prototype._formatItem = function (s, e) {
                    var cpi = this.columnsPerItem, p = e.panel, ct = p.cellType, row = p.rows[e.range.row], row2 = p.rows[e.range.row2], cell = e.cell;
                    // toggle group header style
                    if (ct == wijmo.grid.CellType.RowHeader) {
                        wijmo.toggleClass(cell, 'wj-group-header', e.range.row == 0);
                    }
                    // add group start/end class markers
                    if (ct == wijmo.grid.CellType.Cell || ct == wijmo.grid.CellType.RowHeader) {
                        var group = this._getGroupByRow(e.row);
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
                    var altStep = this.alternatingRowStep;
                    if (altStep && ct == wijmo.grid.CellType.Cell) {
                        var totalRows = this._layout.totalRowSpan;
                        var totalGroups = this._layout._bindingGroups.length;
                        var groups = Math.floor(row.dataIndex / totalRows) * totalGroups;
                        var rowIndex = row.dataIndex % totalRows;
                        groups += this._layout._getGroupIndexByRow(rowIndex) + 1;
                        var altRow = groups % (altStep + 1) == 0;
                        wijmo.toggleClass(cell, 'wj-alt', altRow);
                    }
                };
                // update transposed view when source CollectionView changes
                TransposedMultiRow.prototype._sourceViewChanged = function (sender, e) {
                    if (!this.activeEditor) { // TFS 412376
                        this.invalidate();
                    }
                };
                // transpose itemsSource array
                TransposedMultiRow.prototype._transposeItemsSource = function (arr) {
                    var _this = this;
                    // create transposed array
                    var transposed = new wijmo.collections.ObservableArray();
                    if (this._layout && this._layout._bindingGroups.length) {
                        // auto-generate rowInfo array
                        var rowInfo = this._getRowInfo(arr);
                        // generate a proxy item for each rowInfo object
                        // each proxy item represents one property (e.g. name, id, etc) of
                        // the original data items and has one property for each original
                        // data item (e.g. item0, item1, etc.)
                        rowInfo.forEach(function (rowInfo, index) {
                            // add proxy object if possible, more expensive transposed object otherwise
                            var keys = _this._createKeys(arr);
                            if (_this._supportsProxies()) {
                                var proxy = _this._createProxy(arr, rowInfo, keys);
                                transposed.push(proxy);
                            }
                            else {
                                var obj = _this._createTransposedObject(arr, rowInfo, keys);
                                transposed.push(obj);
                            }
                        });
                        // listen to changes in source array
                        if (arr instanceof wijmo.collections.ObservableArray) {
                            arr.collectionChanged.addHandler(function (s, e) {
                                // just invalidate grid if item was changed (TFS 467052)
                                if (e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
                                    if (!_this.activeEditor) {
                                        _this.invalidate();
                                    }
                                }
                                else {
                                    var e_1 = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Reset);
                                    transposed.onCollectionChanged(e_1);
                                    _this._rowInfoChanged(); // re-generate rows
                                }
                            });
                        }
                    }
                    // all done
                    return transposed;
                };
                // create keys (property names) used by all proxy objects
                TransposedMultiRow.prototype._createKeys = function (arr) {
                    var _this = this;
                    var columns = Array.apply(null, { length: this.columnsPerItem });
                    var keys = arr.map(function (item, index) {
                        return columns.map(function (val, record) { return _this._keyPrefix + index + '_' + record; });
                    });
                    return [].concat.apply([], keys);
                };
                // check whether the browser supports proxies
                TransposedMultiRow.prototype._supportsProxies = function () {
                    return window['Proxy'] != null;
                };
                // create proxy that reads/writes data from the original array
                TransposedMultiRow.prototype._createProxy = function (arr, rowInfo, proxyKeys) {
                    var target = {
                        _arr: arr,
                        _rowInfo: rowInfo,
                        // row info holds multiple bindings for different cells
                        _bnd: rowInfo.bindings.map(function (b) { return new wijmo.Binding(b); }),
                        _keys: proxyKeys
                    };
                    var handler = {
                        ownKeys: function (target) {
                            return target._keys;
                        },
                        getOwnPropertyDescriptor: function () {
                            return {
                                enumerable: true,
                                configurable: true,
                                writable: true
                            };
                        },
                        get: function (obj, prop) {
                            var index = obj._keys.indexOf(prop);
                            if (index > -1) {
                                var bnd = obj._bnd, arr_1 = obj._arr, len = bnd.length, rec = index % len, item = Math.floor(index / len);
                                return bnd[rec].getValue(arr_1[item]);
                            }
                            else {
                                //console.log('proxy get: prop=' + prop + ', keys=' + obj._keys);
                                return obj[prop];
                            }
                        },
                        set: function (obj, prop, value) {
                            var index = obj._keys.indexOf(prop);
                            if (index > -1) {
                                var bnd = obj._bnd, arr_2 = obj._arr, len = bnd.length, rec = index % len, item = Math.floor(index / len);
                                bnd[rec].setValue(arr_2[item], value);
                                if (arr_2 instanceof wijmo.collections.ObservableArray || arr_2 instanceof wijmo.collections.CollectionView) {
                                    var e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, arr_2[item], item);
                                    arr_2.onCollectionChanged(e);
                                }
                                return true;
                            }
                            //console.log('proxy set: prop=' + prop + ', keys=' + obj._keys);
                            return false;
                        }
                    };
                    return new Proxy(target, handler);
                };
                // create proxy-like object when real proxies are not available
                TransposedMultiRow.prototype._createTransposedObject = function (arr, rowInfo, props) {
                    var obj = {
                        _arr: arr,
                        _rowInfo: rowInfo,
                        // row info holds multiple bindings for different cells
                        _bnd: rowInfo.bindings.map(function (b) { return new wijmo.Binding(b); }),
                        _keys: props
                    };
                    var _loop_1 = function (index) {
                        var prop = props[index];
                        Object.defineProperty(obj, prop, {
                            enumerable: true,
                            get: function () {
                                var bnd = obj._bnd, len = bnd.length, rec = index % len, item = Math.floor(index / len);
                                return bnd[rec].getValue(arr[item]);
                            },
                            set: function (value) {
                                var bnd = obj._bnd, len = bnd.length, rec = index % len, item = Math.floor(index / len);
                                bnd[rec].setValue(arr[item], value);
                                if (arr instanceof wijmo.collections.ObservableArray) {
                                    var e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, arr[item], item);
                                    arr.onCollectionChanged(e);
                                }
                                return true;
                            }
                        });
                    };
                    for (var index = 0; index < props.length; index++) {
                        _loop_1(index);
                    }
                    return obj;
                };
                // auto-generates an array with rowInfo objects based on a data array
                // (similar to the FlexGrid's autoGenerateColumns logic)
                TransposedMultiRow.prototype._getRowInfo = function (arr) {
                    var rowInfo = [];
                    if (this._layout) {
                        // update row header columns count
                        var columns = this.rowHeaders.columns, columnsPerItem = this.columnsPerItem, cnt = columnsPerItem + 1;
                        while (columns.length > cnt) {
                            columns.removeAt(columns.length - 1);
                        }
                        while (columns.length < cnt) {
                            columns.push(new wijmo.grid.Column());
                        }
                        this._layout._bindingGroups.forEach(function (group) {
                            //console.log('grp:' + group._rowstart);
                            for (var r = 0; r < group.rowspan; r++) {
                                // create the row
                                var row = {
                                    index: group._rowstart + r,
                                    bindings: [],
                                    headers: []
                                };
                                // set column bindings for every column in the group
                                for (var c = 0; c < group.colspan; c++) {
                                    for (var cellIndex = 0; cellIndex < group.cells.length; cellIndex++) {
                                        var cell = group.cells[cellIndex];
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
                };
                return TransposedMultiRow;
            }(wijmo.grid.FlexGrid));
            transposedmultirow.TransposedMultiRow = TransposedMultiRow;
        })(transposedmultirow = grid.transposedmultirow || (grid.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposedmultirow;
        (function (transposedmultirow) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.transposedmultirow', wijmo.grid.transposedmultirow);
        })(transposedmultirow = grid.transposedmultirow || (grid.transposedmultirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.transposedmultirow.js.map