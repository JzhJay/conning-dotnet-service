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
    (function (grid_1) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Extends the {@link Row} class to provide additional information for multi-row records.
             */
            var _MultiRow = /** @class */ (function (_super) {
                __extends(_MultiRow, _super);
                /**
                 * Initializes a new instance of the {@link Row} class.
                 *
                 * @param dataItem The data item this row is bound to.
                 * @param dataIndex The index of the record within the items source.
                 * @param recordIndex The index of this row within the record (data item).
                 */
                function _MultiRow(dataItem, dataIndex, recordIndex) {
                    var _this = _super.call(this, dataItem) || this;
                    _this._idxData = dataIndex;
                    _this._idxRecord = recordIndex;
                    return _this;
                }
                Object.defineProperty(_MultiRow.prototype, "recordIndex", {
                    /**
                     * Gets the index of this row within the record (data item) it represents.
                     */
                    get: function () {
                        return this._idxRecord;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _MultiRow;
            }(wijmo.grid.Row));
            multirow._MultiRow = _MultiRow;
            /**
             * Extends the {@link GroupRow} class to provide additional information for multi-row records.
             */
            var _MultiGroupRow = /** @class */ (function (_super) {
                __extends(_MultiGroupRow, _super);
                /**
                 * Initializes a new instance of the {@link Row} class.
                 *
                 * @param dataItem The data item this row is bound to.
                 * @param recordIndex The index of this row within the record (group header).
                 */
                function _MultiGroupRow(dataItem, recordIndex) {
                    var _this = _super.call(this, dataItem) || this;
                    _this._idxRecord = recordIndex;
                    return _this;
                }
                Object.defineProperty(_MultiGroupRow.prototype, "recordIndex", {
                    /**
                     * Gets the index of this row within the record (data item) it represents.
                     */
                    get: function () {
                        return this._idxRecord;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_MultiGroupRow.prototype, "hasChildren", {
                    /**
                     * _MultiGroupRow rows always have children...
                     */
                    get: function () {
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Get cell range taking into account multi-row header rows.
                 */
                _MultiGroupRow.prototype.getCellRange = function () {
                    var row = this._getLastRowInHeader();
                    return row != this
                        ? row.getCellRange()
                        : _super.prototype.getCellRange.call(this);
                };
                Object.defineProperty(_MultiGroupRow.prototype, "isCollapsed", {
                    /**
                     * Gets or sets a value that indicates whether this _MultiGroupRow is
                     * collapsed (child rows are hidden) or expanded (child rows are visible).
                     */
                    get: function () {
                        var row = this._getLastRowInHeader();
                        return row._getFlag(wijmo.grid.RowColFlags.Collapsed);
                    },
                    set: function (value) {
                        var row = this._getLastRowInHeader();
                        if (value != row.isCollapsed && row._list != null) {
                            row._setCollapsed(wijmo.asBoolean(value));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // sets the collapsed/expanded state of a (possibly multi-row) group row
                _MultiGroupRow.prototype._setCollapsed = function (collapsed) {
                    var _this = this;
                    var g = this.grid, rows = g.rows, rng = this.getCellRange();
                    // TODO: finish editing?
                    // fire GroupCollapsedChanging
                    var e = new wijmo.grid.CellRangeEventArgs(g.cells, new wijmo.grid.CellRange(this.index, -1));
                    if (!g.onGroupCollapsedChanging(e)) {
                        return;
                    }
                    // apply new value
                    g.deferUpdate(function () {
                        rows.deferUpdate(function () {
                            // collapse/expand this group
                            _this._setFlag(wijmo.grid.RowColFlags.Collapsed, collapsed, true);
                            for (var r = rng.topRow + 1; r <= rng.bottomRow && r > -1 && r < rows.length; r++) {
                                // apply state to this row
                                rows[r]._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, collapsed, true);
                                // apply state to all rows in multi-row headers as well
                                var gr = rows[r];
                                if (gr instanceof _MultiGroupRow) {
                                    var lastRow = gr._getLastRowInHeader();
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
                };
                // gets the last row in a multi-row group header
                _MultiGroupRow.prototype._getLastRowInHeader = function () {
                    var grid = this.grid, row = this;
                    if (grid && grid.multiRowGroupHeaders) {
                        var rows = grid.rows, group = this.dataItem;
                        for (var r = this.index + 1; r < rows.length && rows[r].dataItem == group; r++) {
                            row = rows[r];
                        }
                    }
                    wijmo.assert(row instanceof _MultiGroupRow, 'last row in header should be a _MultiRowGroup');
                    return row;
                };
                return _MultiGroupRow;
            }(wijmo.grid.GroupRow));
            multirow._MultiGroupRow = _MultiGroupRow;
        })(multirow = grid_1.multirow || (grid_1.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Extends the {@link ObservableArray} class to track layout changes.
             */
            var MultiRowCellCollection = /** @class */ (function (_super) {
                __extends(MultiRowCellCollection, _super);
                function MultiRowCellCollection() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /*internal*/ MultiRowCellCollection.prototype._setLayout = function (layout) {
                    this._layout = layout;
                    this.forEach(function (cell) { return cell._setLayout(layout); });
                };
                /**
                 * Tracks layout changes.
                 */
                MultiRowCellCollection.prototype.onCollectionChanged = function (e) {
                    if (e === void 0) { e = wijmo.collections.NotifyCollectionChangedEventArgs.reset; }
                    var layout = this._layout;
                    if (layout) {
                        layout._onLayoutChanged();
                    }
                    _super.prototype.onCollectionChanged.call(this, e);
                };
                return MultiRowCellCollection;
            }(wijmo.collections.ObservableArray));
            multirow.MultiRowCellCollection = MultiRowCellCollection;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_2) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Class that parses {@link MultiRow} layout definitions.
             */
            var _MultiRowLayout = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link _LayoutDef} class.
                 *
                 * @param grid {@link MultiRow} that owns this layout.
                 * @param layoutDef Array that contains the layout definition.
                 * @param changeCallback Callback invoked when layout changes.
                 */
                function _MultiRowLayout(grid, layoutDef, changeCallback) {
                    // indicates whether layout calculation is complete and
                    // layout is ready for tracking changes
                    this._initialized = false;
                    this._disposed = false;
                    this._rowsPerItem = 1;
                    this._groupsByColumn = {};
                    this._grid = grid;
                    this._changeCallback = changeCallback;
                    this._bindingGroups = this._parseCellGroups(layoutDef);
                    this._initialized = true;
                }
                // implementation
                /*internal*/ _MultiRowLayout.prototype._dispose = function () {
                    if (this._disposed) {
                        return;
                    }
                    // mark layout as disposed
                    this._disposed = true;
                    // release this layout
                    var columns = this._bindingGroups;
                    columns.forEach(function (g) {
                        g.cells._setLayout(null);
                    });
                    columns._setLayout(null);
                    // reseale resources
                    this._bindingGroups = null;
                };
                /*internal*/ _MultiRowLayout.prototype._onLayoutChanged = function () {
                    if (!this._initialized || this._disposed) {
                        return;
                    }
                    if (this._changeCallback) {
                        this._changeCallback();
                    }
                };
                // parse an array of JavaScript objects into an array of MultiRowCellGroup objects
                _MultiRowLayout.prototype._parseCellGroups = function (groups) {
                    var _this = this;
                    var g = this._grid, columns = null, rowsPerItem = 1;
                    if (groups) {
                        if (groups instanceof multirow.MultiRowCellCollection) {
                            // ensure that array items are all of the MultiRowCellGroup type
                            groups.forEach(function (item) {
                                wijmo.assert(item instanceof multirow.MultiRowCellGroup, 'groups contain items of invalid type');
                            });
                            columns = groups;
                        }
                        else {
                            columns = new multirow.MultiRowCellCollection();
                            for (var i = 0; i < groups.length; i++) {
                                var group = null;
                                if (groups[i] instanceof multirow.MultiRowCellGroup) {
                                    group = groups[i];
                                }
                                else {
                                    group = new multirow.MultiRowCellGroup(groups[i]);
                                }
                                columns.push(group);
                            }
                        }
                        // open binding groups (basic calculations)
                        columns.forEach(function (group) {
                            group.openGroup();
                        });
                        // calculate groups's colstart and layout's rowsPerItem
                        for (var i = 0, colStart = 0; i < columns.length; i++) {
                            var group = columns[i];
                            group._colstart = colStart;
                            colStart += group._colspanEff;
                            rowsPerItem = Math.max(rowsPerItem, group._rowspanEff);
                        }
                        // close binding groups (calculate group's rowspan, ranges, and bindings)
                        columns.forEach(function (group) {
                            group.closeGroup(g, rowsPerItem);
                        });
                        this._rowsPerItem = rowsPerItem;
                    }
                    else {
                        columns = new multirow.MultiRowCellCollection();
                    }
                    this._multiRowGroupHeaderRange = this._getMultiRowGroupHeaderRange(columns);
                    // set this layout after calculations complete
                    columns.forEach(function (g) {
                        g.cells._setLayout(_this);
                    });
                    columns._setLayout(this);
                    // all done
                    return columns;
                };
                // calculate a merged range for multirow group headers
                _MultiRowLayout.prototype._getMultiRowGroupHeaderRange = function (groups) {
                    var rpi = this._rowsPerItem;
                    var rng = new wijmo.grid.CellRange(0, 0, rpi - 1, 0);
                    // expand right to aggregates and equal cell edges
                    for (var gi = 0; gi < groups.length; gi++) {
                        var group = groups[gi];
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
                };
                // expand right in the given group to the 1st aggregate
                // starting from aggregates, expand to the 1st column with equal edge
                _MultiRowLayout.prototype._expandMultiRowGroupHeaderToAggregate = function (rng, group) {
                    var rpi = this._rowsPerItem;
                    // find 1st column with aggregate cell
                    var colstop = group._colspanEff;
                    var colstart = group.cells
                        .filter(function (c) { return c.col > 0 && c.aggregate != 0; }) // columns with aggregates except the 1st one
                        .map(function (c) { return c.col; })
                        .reduce(function (p, c) { return (c < p) ? c : p; }, colstop);
                    // expand to the aggregate
                    rng.col2 = Math.max(group._colstart + colstart - 1, rng.col2);
                    // find column with equal edges over rows
                    for (var c = colstart; c < colstop; c++) {
                        var hasEqualEdge = true;
                        for (var r = 0; r < rpi; r++) {
                            var cellrng = group._getCellRange(r, c);
                            hasEqualEdge = hasEqualEdge && (cellrng.col === c);
                        }
                        if (hasEqualEdge) { // equal edge found
                            rng.col2 = Math.max(group._colstart + c - 1, rng.col2);
                            return;
                        }
                    }
                    // don't not expand anymore
                };
                // calculate a merged range for conventional single-row group headers
                _MultiRowLayout.prototype._getSingleRowGroupHeaderRange = function (p, r, c) {
                    var groups = this._bindingGroups;
                    if (groups.length === 0) {
                        return null;
                    }
                    // set range from current cell
                    var gr = this._getGroupByColumn(c);
                    wijmo.assert(gr != null, 'Failed to get the group!');
                    var rs = 0; // use 1st row in single-row group headers
                    var cellrng = gr._getCellRange(rs, c - gr._colstart);
                    var rng = new wijmo.grid.CellRange(r, gr._colstart + cellrng.col, r, gr._colstart + cellrng.col2);
                    var bCol = gr.getBindingColumn(p, r, c);
                    if (bCol.aggregate != 0) {
                        return rng;
                    }
                    // expand left to aggregates
                    var grmin = groups[0];
                    var colmin = grmin._colstart;
                    for (var i = c - 1; i >= colmin; i--) {
                        var gr_1 = this._getGroupByColumn(i);
                        wijmo.assert(gr_1 != null, 'Failed to get the group!');
                        var bCol_1 = gr_1.getBindingColumn(p, r, i);
                        if (bCol_1.aggregate != 0) {
                            break;
                        }
                        cellrng = gr_1._getCellRange(rs, i - gr_1._colstart);
                        rng.col = gr_1._colstart + cellrng.col;
                    }
                    // expand right to aggregates
                    var grmax = groups[groups.length - 1];
                    var colmax = grmax._colstart + grmax._colspanEff;
                    for (var i = c + 1; i < colmax; i++) {
                        var gr_2 = this._getGroupByColumn(i);
                        wijmo.assert(gr_2 != null, 'Failed to get the group!');
                        var bCol_2 = gr_2.getBindingColumn(p, r, i);
                        if (bCol_2.aggregate != 0) {
                            break;
                        }
                        cellrng = gr_2._getCellRange(rs, i - gr_2._colstart);
                        rng.col2 = gr_2._colstart + cellrng.col2;
                    }
                    return rng;
                };
                // gets a merged range for group headers
                _MultiRowLayout.prototype._getGroupHeaderMergedRange = function (p, r, c, multiRowGroupHeaders) {
                    if (multiRowGroupHeaders) {
                        var rng = this._multiRowGroupHeaderRange;
                        if (rng.containsColumn(c)) {
                            var rpi = this._rowsPerItem, rs = Math.floor(r / rpi) * rpi; // TFS 404267
                            return new wijmo.grid.CellRange(rs + rng.row, rng.col, rs + rng.row2, rng.col2);
                        }
                        var group = this._getGroupByColumn(c);
                        wijmo.assert(group instanceof multirow.MultiRowCellGroup, 'Failed to get the group!');
                        return group.getMergedRange(p, r, c);
                    }
                    else {
                        return this._getSingleRowGroupHeaderRange(p, r, c);
                    }
                };
                // get the group that owns a given column
                _MultiRowLayout.prototype._getGroupByColumn = function (c) {
                    // get from cache
                    var group = this._groupsByColumn[c];
                    // not in cache yet, find it now
                    if (!group) {
                        var groups = this._bindingGroups;
                        for (var i = 0; i < groups.length; i++) {
                            group = groups[i];
                            if (c >= group._colstart && c <= group._colstart + group._colspanEff - 1) {
                                this._groupsByColumn[c] = group; // found it!
                                break;
                            }
                        }
                    }
                    return group;
                };
                // update missing cell types to match data
                _MultiRowLayout.prototype._updateCellTypes = function (item) {
                    this._bindingGroups.forEach(function (group) {
                        group._cols.forEach(function (col) {
                            if (col.dataType == null && col._binding) {
                                col.dataType = wijmo.getType(col._binding.getValue(item));
                            }
                            if (!col.isReadOnly) {
                                var pd = wijmo.isIE() ? null : Object.getOwnPropertyDescriptor(item, col.binding);
                                col.isReadOnly = pd && !pd.writable && !pd.set;
                            }
                        });
                    });
                };
                return _MultiRowLayout;
            }());
            multirow._MultiRowLayout = _MultiRowLayout;
        })(multirow = grid_2.multirow || (grid_2.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Extends the {@link Column} class with <b>colspan</b> property to
             * describe a cell in a {@link MultiRowCellGroup}.
             */
            var MultiRowCell = /** @class */ (function (_super) {
                __extends(MultiRowCell, _super);
                /**
                 * Initializes a new instance of the {@link MultiRowCell} class.
                 *
                 * @param options JavaScript object containing initialization data for the {@link MultiRowCell}.
                 */
                function MultiRowCell(options) {
                    var _this = _super.call(this) || this;
                    _this._row = _this._col = 0;
                    _this._rowspan = _this._colspan = 1;
                    wijmo.copy(_this, options);
                    return _this;
                }
                Object.defineProperty(MultiRowCell.prototype, "row", {
                    /**
                     * Gets or sets the row index of this {@link MultiRowCell} within the cell group.
                     */
                    get: function () {
                        return this._row;
                    },
                    set: function (value) {
                        var row = wijmo.asInt(value, false, true);
                        if (this._row != row) {
                            this._row = row;
                            this._onLayoutPropertyChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRowCell.prototype, "col", {
                    /**
                     * Gets or sets the column index of this {@link MultiRowCell} within the cell group.
                     */
                    get: function () {
                        return this._col;
                    },
                    set: function (value) {
                        var col = wijmo.asInt(value, false, true);
                        if (this._col != col) {
                            this._col = col;
                            this._onLayoutPropertyChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRowCell.prototype, "colspan", {
                    /**
                     * Gets or sets the number of physical columns spanned by the {@link MultiRowCell}.
                     */
                    get: function () {
                        return this._colspan;
                    },
                    set: function (value) {
                        var colspan = wijmo.asInt(value, false, true);
                        wijmo.assert(colspan > 0, 'colspan must be >= 1');
                        if (this._colspan != colspan) {
                            this._colspan = colspan;
                            this._onLayoutPropertyChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRowCell.prototype, "rowspan", {
                    /**
                     * Gets or sets the number of physical rows spanned by the {@link MultiRowCell}.
                     */
                    get: function () {
                        return this._rowspan;
                    },
                    set: function (value) {
                        var rowspan = wijmo.asInt(value, false, true);
                        wijmo.assert(rowspan > 0, 'rowspan must be >= 1');
                        if (this._rowspan != rowspan) {
                            this._rowspan = rowspan;
                            this._onLayoutPropertyChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /*internal*/ MultiRowCell.prototype._setLayout = function (layout) {
                    this._layout = layout;
                };
                MultiRowCell.prototype._onLayoutPropertyChanged = function () {
                    var layout = this._layout;
                    if (layout) {
                        layout._onLayoutChanged();
                    }
                };
                return MultiRowCell;
            }(wijmo.grid.Column));
            multirow.MultiRowCell = MultiRowCell;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Describes a group of cells that may span multiple rows and columns.
             */
            var MultiRowCellGroup = /** @class */ (function (_super) {
                __extends(MultiRowCellGroup, _super);
                /**
                 * Initializes a new instance of the {@link MultiRowCellGroup} class.
                 *
                 * @param options JavaScript object containing initialization data for the new {@link MultiRowCellGroup}.
                 */
                function MultiRowCellGroup(options) {
                    var _this = _super.call(this) || this;
                    _this._isRowHeader = false; // whether this group should be treated as a row header group (TFS 403496)
                    _this._colstart = 0; // index of the column where this group starts
                    _this._cells = new multirow.MultiRowCellCollection();
                    wijmo.copy(_this, options);
                    return _this;
                }
                // method used in JSON-style initialization
                MultiRowCellGroup.prototype._copy = function (key, value) {
                    if (key == 'cells') {
                        // here only perform basic checks and remember this value
                        // the parsing of this value is performed when openning the group
                        if (wijmo.isArray(value)) {
                            this._cellsDef = value;
                        }
                        return true;
                    }
                    return false;
                };
                Object.defineProperty(MultiRowCellGroup.prototype, "cells", {
                    // ** implementation
                    // required for JSON-style initialization
                    get: function () {
                        return this._cells;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRowCellGroup.prototype, "isRowHeader", {
                    // gets or sets a value that determines whether this is a row header group (TFS 403496)
                    get: function () {
                        return this._isRowHeader;
                    },
                    set: function (value) {
                        var isRowHeader = wijmo.asBoolean(value);
                        if (this._isRowHeader != isRowHeader) {
                            this._isRowHeader = isRowHeader;
                            this._onLayoutPropertyChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // parse cells and perform calculations
                // must only be called after adding to the collection
                MultiRowCellGroup.prototype.openGroup = function () {
                    // parse cells
                    if (!this._isParsed) {
                        this._cells = this._parseCells(this._cellsDef);
                        this._isParsed = true;
                    }
                    // perform calculations
                    this._calculate();
                };
                // calculate merged ranges
                // must only be called after openning the group
                MultiRowCellGroup.prototype.closeGroup = function (g, rowsPerItem) {
                    var _this = this;
                    // adjust rowspan to match longest group in the grid
                    if (rowsPerItem > this._rowspanEff) {
                        this._cells.forEach(function (cell) {
                            if (cell.row == _this._rowspanEff - 1) {
                                cell._rowspanEff = rowsPerItem - cell.row;
                            }
                        });
                        this._rowspanEff = rowsPerItem;
                    }
                    // make sure cells fill the group
                    this._cells.forEach(function (cell) {
                        while (cell.col + cell._colspanEff < _this._colspanEff &&
                            !_this._slotTaken(cell.row, cell.col + cell._colspanEff)) {
                            cell._colspanEff++;
                        }
                    });
                    this._cells.forEach(function (cell) {
                        while (cell.row + cell._rowspanEff < _this._rowspanEff &&
                            !_this._slotTaken(cell.row + cell._rowspanEff, cell.col)) {
                            cell._rowspanEff++;
                        }
                    });
                    // if group is not empty,
                    // make sure there are no empty slots (pathological cases)
                    if (this._cells.length > 0) {
                        for (var r = 0; r < this._rowspanEff; r++) {
                            for (var c = 0; c < this._colspanEff; c++) {
                                wijmo.assert(this._slotTaken(r, c), 'Invalid layout (empty cells).');
                            }
                        }
                    }
                    // create arrays with binding columns and merge ranges for each cell
                    this._cols = new wijmo.grid.ColumnCollection(g, g.columns.defaultSize);
                    this._rng = new Array(rowsPerItem * this._colspanEff);
                    this._cells.forEach(function (cell) {
                        for (var r = 0; r < cell._rowspanEff; r++) {
                            for (var c = 0; c < cell._colspanEff; c++) {
                                var index = (cell.row + r) * _this._colspanEff + cell.col + c;
                                // save binding column for this cell offset
                                _this._cols.setAt(index, cell); // 'setAt' handles list ownership
                                //console.log('binding[' + index + '] = ' + cell.binding);
                                // save merge range for this cell offset
                                var rng = new wijmo.grid.CellRange(0 - r, 0 - c, 0 - r + cell._rowspanEff - 1, 0 - c + cell._colspanEff - 1);
                                if (!rng.isSingleCell) {
                                    //console.log('rng[' + index + '] = ' + format('({row},{col})-({row2},{col2})', rng));
                                    _this._rng[index] = rng;
                                }
                            }
                        }
                    });
                    // add extra range for collapsed group headers
                    var start = this._colstart;
                    this._rng[-1] = new wijmo.grid.CellRange(0, start, 0, start + this._colspanEff - 1);
                    // remember if the group has aggregates (so we can merge group header cells)
                    this._hasAggregates = false;
                    for (var i = 0; i < this._cells.length && !this._hasAggregates; i++) {
                        this._hasAggregates = this._cells[i].aggregate != 0;
                    }
                };
                // get the preferred column width for a column in the group
                MultiRowCellGroup.prototype.getColumnWidth = function (c) {
                    for (var i = 0; i < this._cells.length; i++) {
                        var cell = this._cells[i];
                        if (cell.col == c && cell._colspanEff == 1) {
                            return cell.width;
                        }
                    }
                    return null;
                };
                // get merged range for a cell in this group
                MultiRowCellGroup.prototype.getMergedRange = function (p, r, c) {
                    // column header, group
                    if (r < 0) {
                        return this._rng[-1];
                    }
                    // regular cell range
                    var row = p.rows[r], rs = row.recordIndex != null ? row.recordIndex : r % this._rowspanEff, cs = c - this._colstart, rng = this._rng[rs * this._colspanEff + cs];
                    // column header, non-group
                    if (p.cellType == wijmo.grid.CellType.ColumnHeader) {
                        r++;
                    }
                    // done
                    return rng
                        ? new wijmo.grid.CellRange(r + rng.row, c + rng.col, r + rng.row2, c + rng.col2)
                        : null;
                };
                // get the binding column for a cell in this group
                MultiRowCellGroup.prototype.getBindingColumn = function (p, r, c) {
                    // merged column header binding
                    // return 'this' to render the collapsed column header
                    if (r < 0) {
                        return this;
                    }
                    // regular cells
                    var row = p.rows[r], rs = (row && row.recordIndex != null) ? row.recordIndex : r % this._rowspanEff, cs = c - this._colstart;
                    return this._cols[rs * this._colspanEff + cs];
                };
                // get the binding column by name/binding
                MultiRowCellGroup.prototype.getColumn = function (name) {
                    return this._cols.getColumn(name);
                };
                MultiRowCellGroup.prototype._getCellRange = function (r, c) {
                    var rng = this._rng[r * this._colspanEff + c];
                    return rng ? new wijmo.grid.CellRange(r + rng.row, c + rng.col, r + rng.row2, c + rng.col2) : new wijmo.grid.CellRange(r, c);
                };
                // parse an array of JavaScript objects into an array of MultiRowCell objects
                MultiRowCellGroup.prototype._parseCells = function (cells) {
                    var columns = this._cells;
                    if (cells) {
                        if (cells instanceof multirow.MultiRowCellCollection) {
                            // ensure that array items are all of the MultiRowCell type
                            cells.forEach(function (item) {
                                wijmo.assert(item instanceof multirow.MultiRowCell, 'cells contain items of invalid type');
                            });
                            columns = cells;
                        }
                        else {
                            cells.forEach(function (item) {
                                var cell = null;
                                if (item instanceof multirow.MultiRowCell) {
                                    cell = item;
                                }
                                else {
                                    cell = new multirow.MultiRowCell(item);
                                }
                                columns.push(cell);
                            });
                        }
                        columns.forEach(function (cell) {
                            if (cell.binding && !cell.header) {
                                cell.header = wijmo.toHeaderCase(cell.binding);
                            }
                        });
                    }
                    // all done
                    return columns;
                };
                // resets calculated properties to default values
                MultiRowCellGroup.prototype._clearCalculations = function () {
                    this._colstart = 0;
                    this._cols = null;
                    this._hasAggregates = false;
                    this._rng = null;
                    this.row = 0;
                    this.col = 0;
                    this._colspanEff = 0;
                    this._rowspanEff = 0;
                    this._cells.forEach(function (cell) {
                        cell.row = 0;
                        cell.col = 0;
                        cell._colspanEff = 0;
                        cell._rowspanEff = 0;
                    });
                };
                MultiRowCellGroup.prototype._calculate = function () {
                    var _this = this;
                    // clear existing calculations
                    this._clearCalculations();
                    // initialize calculated properties
                    this._colspanEff = this.colspan;
                    this._rowspanEff = this.rowspan;
                    this._cells.forEach(function (cell) {
                        _this._colspanEff = Math.max(_this._colspanEff, cell.colspan);
                        cell._colspanEff = cell.colspan;
                        cell._rowspanEff = cell.rowspan;
                    });
                    // position cells within the group
                    var r = 0, c = 0;
                    this._cells.forEach(function (cell, index) {
                        while (!_this._cellFits(cell, index, r, c)) { // find a free slot
                            c = (c + 1) % _this._colspanEff;
                            if (c == 0)
                                r++;
                        }
                        cell.row = r;
                        cell.col = c;
                    });
                    // set group's row/col span
                    var rs = 1, cs = 1;
                    this._cells.forEach(function (cell) {
                        rs = Math.max(rs, cell.row + cell._rowspanEff);
                        cs = Math.max(cs, cell.col + cell._colspanEff);
                    });
                    this._rowspanEff = rs;
                    this._colspanEff = cs;
                };
                // checks whether a cell fits in a given slot (adjusts colspan if needed)
                MultiRowCellGroup.prototype._cellFits = function (cell, index, r, c) {
                    // too wide?
                    if (c > 0 && c + cell._colspanEff > this._colspanEff) {
                        return false;
                    }
                    // slot taken?
                    for (var i = 0; i < cell._colspanEff; i++) {
                        if (this._slotTaken(r, c + i, index)) {
                            return false;
                        }
                    }
                    // adjust group colspan
                    this._colspanEff = Math.max(this._colspanEff, c + cell._colspanEff - 1);
                    // seems to fit
                    return true;
                };
                // checks whether a given row/col slot within the panel is currently in use
                MultiRowCellGroup.prototype._slotTaken = function (r, c, index) {
                    if (index === void 0) { index = this._cells.length; }
                    for (var i = 0; i < index; i++) {
                        var cell = this._cells[i];
                        if (r >= cell.row && r <= cell.row + cell._rowspanEff - 1) {
                            if (c >= cell.col && c <= cell.col + cell._colspanEff - 1) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                return MultiRowCellGroup;
            }(multirow.MultiRowCell));
            multirow.MultiRowCellGroup = MultiRowCellGroup;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
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
            var MultiRow = /** @class */ (function (_super) {
                __extends(MultiRow, _super);
                /**
                 * Initializes a new instance of the {@link MultiRow} class.
                 *
                 * In most cases, the **options** parameter will include the value for the
                 * {@link layoutDefinition} property.
                 *
                 * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function MultiRow(element, options) {
                    var _this = _super.call(this, element) || this;
                    _this._hdrLayoutDef = null;
                    _this._centerVert = true;
                    _this._collapsedHeaders = false;
                    _this._multiRowGroupHeaders = false;
                    _this._rowHdrCnt = 0; // TFS 441883
                    /**
                     * Occurs after the value of the {@link collapsedHeaders} property changes.
                     */
                    _this.collapsedHeadersChanging = new wijmo.Event();
                    /**
                     * Occurs after the value of the {@link collapsedHeaders} property has changed.
                     */
                    _this.collapsedHeadersChanged = new wijmo.Event();
                    // start with empty layout
                    _this._layoutDef = new multirow.MultiRowCellCollection();
                    _this._layout = new multirow._MultiRowLayout(_this, _this._layoutDef, function () { return _this._onLayoutChanged(); });
                    // add class name to enable styling
                    wijmo.addClass(_this.hostElement, 'wj-multirow');
                    // add header collapse/expand button
                    var hdr = _this.columnHeaders.hostElement.parentElement, btn = wijmo.createElement('<div class="wj-hdr-collapse"><span></span></div>');
                    btn.style.display = 'none';
                    hdr.appendChild(btn);
                    _this._btnCollapse = btn;
                    _this._updateButtonGlyph();
                    // handle mousedown on collapse/expand button (not click: TFS 190572)
                    _this.addEventListener(btn, 'mousedown', function (e) {
                        // simple toggle is not enough: TFS 301796
                        //this.collapsedHeaders = !this.collapsedHeaders;
                        // false: toggles between true and false; 
                        // null: toggles between true and null
                        switch (_this.collapsedHeaders) {
                            case null:
                            case false:
                                _this._collapsedHeadersWasNull = _this.collapsedHeaders == null;
                                _this.collapsedHeaders = true;
                                break;
                            case true:
                                _this.collapsedHeaders = _this._collapsedHeadersWasNull ? null : false;
                                break;
                        }
                        e.preventDefault();
                        _this.focus();
                    }, true);
                    // click on top-left row headers to select the whole grid
                    var host = _this.hostElement;
                    _this.addEventListener(host, 'mousedown', function (e) {
                        if (!_this._mouseHdl._szRowCol) { // allow resizing
                            var groups = _this._layout ? _this._layout._bindingGroups : null;
                            var group = groups && groups.length ? groups[0] : null;
                            if (group && group.isRowHeader) {
                                var ht = _this.hitTest(e);
                                if (ht.panel == _this.columnHeaders && ht.col < _this.frozenColumns) {
                                    e.preventDefault();
                                    _this.selectAll();
                                }
                            }
                        }
                    }, true);
                    // can't drag/drop rows/columns on MultiRow
                    // but can drag columns into GroupPanel
                    ['dragover', 'dragleave', 'dragdrop'].forEach(function (evt) {
                        _this.removeEventListener(host, evt);
                    });
                    // custom AddNewHandler
                    _this._addHdl = new multirow._MultiRowAddNewHandler(_this);
                    // custom cell rendering
                    _this.formatItem.addHandler(_this._formatItem, _this);
                    // change some defaults
                    _this.autoGenerateColumns = false;
                    _this.allowDragging = wijmo.grid.AllowDragging.None;
                    _this.mergeManager = new multirow._MergeManager();
                    // apply options after everything else is ready
                    _this.initialize(options);
                    return _this;
                }
                MultiRow.prototype._getProductInfo = function () {
                    return 'H87K,MultiRow';
                };
                Object.defineProperty(MultiRow.prototype, "layoutDefinition", {
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
                    get: function () {
                        return this._layoutDef;
                    },
                    set: function (value) {
                        var _this = this;
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
                        this._layout = new multirow._MultiRowLayout(this, value, function () { return _this._onLayoutChanged(); });
                        this._rowHdrCnt = 0;
                        // update number of frozen columns and their styles 
                        // to account for row header groups (TFS 403496)
                        if (this._layout) {
                            var groups = this._layout._bindingGroups;
                            for (var i = 0; i < groups.length; i++) {
                                var group = groups[i];
                                // allow one or more continuous row header groups
                                if (!group.isRowHeader) {
                                    break;
                                }
                                // update number of frozen columns
                                this._rowHdrCnt = group._colstart + group._colspanEff;
                                // configure row header cells
                                group.cells.forEach(function (cell) {
                                    var hdrClass = 'wj-header';
                                    // header cells are read-only
                                    cell.isReadOnly = true;
                                    // use cellTemplate to show header
                                    if (cell.header && !cell.binding && !cell.cellTemplate) {
                                        cell.cellTemplate = cell.header;
                                    }
                                    // header cells have header style
                                    if (!cell.cssClass) {
                                        cell.cssClass = hdrClass;
                                    }
                                    else if (cell.cssClass.indexOf(hdrClass) < 0) {
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
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRow.prototype, "headerLayoutDefinition", {
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
                    get: function () {
                        return this._hdrLayoutDef;
                    },
                    set: function (value) {
                        var _this = this;
                        // store original value so user can get it back
                        this._hdrLayoutDef = wijmo.asArray(value);
                        // dispose existing layout
                        if (this._hdrLayout) {
                            this._hdrLayout._dispose();
                            this._hdrLayout = null;
                        }
                        // parse cell bindings
                        var layout = null;
                        if (value) {
                            layout = new multirow._MultiRowLayout(this, value, function () { return _this._onHeaderLayoutChanged(); });
                        }
                        this._hdrLayout = layout;
                        // go bind/rebind the grid
                        this._bindGrid(true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRow.prototype, "rowsPerItem", {
                    /**
                     * Gets the number of rows used to display each item.
                     *
                     * This value is calculated automatically based on the value
                     * of the **layoutDefinition** property.
                     */
                    get: function () {
                        return this._layout._rowsPerItem;
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
                MultiRow.prototype.getBindingColumn = function (p, r, c) {
                    return this._getBindingColumn(p, r, p.columns[c]);
                };
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
                MultiRow.prototype.getColumn = function (name, header) {
                    if (wijmo.isString(name)) { // search by name/binding (TFS 362720)
                        var isHeaderLayout = header && this._hdrLayout, layout = isHeaderLayout ? this._hdrLayout : this._layout, groups = layout._bindingGroups, col = null;
                        for (var i = 0; i < groups.length && !col; i++) {
                            col = groups[i].getColumn(name);
                        }
                        // use "_layout" if no column found
                        // (similar to "_getGroupByColumn" method)
                        if (!col && isHeaderLayout) {
                            return this.getColumn(name, false);
                        }
                        return col;
                    }
                    return _super.prototype.getColumn.call(this, name); // search by index (bad idea...)
                };
                Object.defineProperty(MultiRow.prototype, "centerHeadersVertically", {
                    /**
                     * Gets or sets a value that determines whether the content of cells
                     * that span multiple rows should be vertically centered.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._centerVert;
                    },
                    set: function (value) {
                        if (value != this._centerVert) {
                            this._centerVert = wijmo.asBoolean(value);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRow.prototype, "collapsedHeaders", {
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
                    get: function () {
                        return this._collapsedHeaders;
                    },
                    set: function (value) {
                        if (value != this._collapsedHeaders) {
                            var e = new wijmo.CancelEventArgs();
                            if (this.onCollapsedHeadersChanging(e)) {
                                this._collapsedHeaders = wijmo.asBoolean(value, true); // null means 'expand all'
                                this._updateCollapsedHeaders();
                                this._updateButtonGlyph();
                                this.onCollapsedHeadersChanged(e);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRow.prototype, "showHeaderCollapseButton", {
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
                    get: function () {
                        return this._btnCollapse.style.display == '';
                    },
                    set: function (value) {
                        if (value != this.showHeaderCollapseButton) {
                            this._btnCollapse.style.display = wijmo.asBoolean(value) ? '' : 'none';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiRow.prototype, "multiRowGroupHeaders", {
                    /**
                     * Gets or sets a value that determines whether group headers should
                     * have multiple rows instead of a single header row.
                     *
                     * This property is useful when you want to display aggregate values
                     * in the group headers (see the {@link Column.aggregate} property).
                     *
                     * The default value for this property is **false**.
                     */
                    get: function () {
                        return this._multiRowGroupHeaders;
                    },
                    set: function (value) {
                        if (value != this._multiRowGroupHeaders) {
                            this._multiRowGroupHeaders = wijmo.asBoolean(value);
                            this._bindGrid(true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the {@link collapsedHeadersChanging} event.
                 *
                 * @param e {@link CancelEventArgs} that contains the event data.
                 * @return True if the event was not canceled.
                 */
                MultiRow.prototype.onCollapsedHeadersChanging = function (e) {
                    this.collapsedHeadersChanging.raise(this, e);
                    return !e.cancel;
                };
                /**
                 * Raises the {@link collapsedHeadersChanged} event.
                 */
                MultiRow.prototype.onCollapsedHeadersChanged = function (e) {
                    this.collapsedHeadersChanged.raise(this, e);
                };
                Object.defineProperty(MultiRow.prototype, "allowPinning", {
                    // ** overrides
                    // MultiRow does not support pinning
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        wijmo.assert(!value, 'MultiRow does not support pinning.');
                    },
                    enumerable: true,
                    configurable: true
                });
                // select multi-row items when clicking the row headers
                MultiRow.prototype.onSelectionChanging = function (e) {
                    var sel = e._rng; // not cloning
                    if (sel && sel.isValid && this.selectionMode) {
                        var ht = this._mouseHdl._htDown, rows = this.rows, cols = this.columns, rowHdrCnt = this._rowHdrCnt;
                        // do not select frozen cells
                        if (rowHdrCnt) {
                            sel.col = Math.max(sel.col, rowHdrCnt);
                            sel.col2 = Math.max(sel.col2, rowHdrCnt);
                        }
                        // handle row header selection
                        if (ht) {
                            if (ht.panel == this.rowHeaders || (ht.panel == this.cells && ht.col < rowHdrCnt)) {
                                var topRow = rows[sel.topRow], botRow = rows[sel.bottomRow];
                                if (topRow && topRow.recordIndex != null) {
                                    var top_1 = topRow.index - topRow.recordIndex, rpi = (botRow instanceof multirow._MultiGroupRow && !this._multiRowGroupHeaders) ? 1 : this.rowsPerItem, bot = botRow.index - botRow.recordIndex + rpi - 1, // TFS 413335
                                    cnt = cols.length - 1;
                                    var rng = sel.row != sel.topRow
                                        ? new wijmo.grid.CellRange(bot, 0, top_1, cnt)
                                        : new wijmo.grid.CellRange(top_1, 0, bot, cnt);
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
                    return _super.prototype.onSelectionChanging.call(this, e);
                };
                // handle row header groups when deleting rows (TFS 431802)
                /*protected*/ MultiRow.prototype._getDeleteColumnIndex = function () {
                    return this._rowHdrCnt;
                };
                // use quick auto size if there aren't any external item formatters
                /*protected*/ MultiRow.prototype._getQuickAutoSize = function () {
                    return wijmo.isBoolean(this.quickAutoSize)
                        ? this.quickAutoSize
                        : this.formatItem.handlerCount <= 1 && this.itemFormatter == null;
                };
                // bind rows
                /*protected*/ MultiRow.prototype._addBoundRow = function (items, index) {
                    var item = items[index];
                    for (var i = 0; i < this.rowsPerItem; i++) {
                        this.rows.push(new multirow._MultiRow(item, index, i));
                    }
                };
                /*protected*/ MultiRow.prototype._addNode = function (items, index, level) {
                    this._addBoundRow(items, index); // childItemsPath not supported
                };
                /*protected*/ MultiRow.prototype._addGroupRow = function (group) {
                    var cnt = this._multiRowGroupHeaders ? this.rowsPerItem : 1;
                    for (var i = 0; i < cnt; i++) {
                        this.rows.push(new multirow._MultiGroupRow(group, i));
                    }
                };
                // bind columns
                /*protected*/ MultiRow.prototype._bindColumns = function () {
                    var _this = this;
                    // update column header row count
                    var rows = this.columnHeaders.rows, layout = this._layout, hdrLayout = this._hdrLayout, rowsPerItem = hdrLayout ? hdrLayout._rowsPerItem : this.rowsPerItem, cnt = rowsPerItem + 1;
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
                        var colProps_1 = 'width,minWidth,maxWidth,binding,header,format,dataMap,name,aggregate,cellTemplate'.split(',');
                        // scan all binding groups
                        layout._bindingGroups.forEach(function (group) {
                            var _loop_1 = function (c) {
                                if (group.cells.length === 0) {
                                    return "continue";
                                }
                                // create a real column for this group
                                var col = new wijmo.grid.Column();
                                var _loop_2 = function (cellIndex) {
                                    var cell = group.cells[cellIndex];
                                    if (cell.col == c) {
                                        colProps_1.forEach(function (prop) {
                                            if (cell[prop] != null && cell[prop] != col[prop]) { // TFS 379860, 470132
                                                col[prop] = cell[prop];
                                            }
                                        });
                                    }
                                };
                                // set real column's width, binding, etc based on first cell (binding column)
                                // that has the same column index and has those properties set
                                // also set minWidth and maxWidth (TFS 373681)
                                for (var cellIndex = 0; cellIndex < group.cells.length; cellIndex++) {
                                    _loop_2(cellIndex);
                                }
                                // add column to grid
                                _this.columns.push(col);
                            };
                            for (var c = 0; c < group._colspanEff; c++) {
                                _loop_1(c);
                            }
                        });
                    }
                };
                // set row visibility to match headerCollapsed
                MultiRow.prototype._updateCollapsedHeaders = function () {
                    var rows = this.columnHeaders.rows, ch = this.collapsedHeaders;
                    rows[0].visible = ch != false; // first row: true or null
                    for (var i = 1; i < rows.length; i++) {
                        rows[i].visible = ch != true; // other rows: false or null
                    }
                };
                // update missing column types to match data
                /*protected*/ MultiRow.prototype._updateColumnTypes = function () {
                    // allow base class
                    _super.prototype._updateColumnTypes.call(this);
                    // update missing column types in all binding groups
                    var view = this.collectionView;
                    if (wijmo.hasItems(view)) {
                        var item = view.items[0];
                        if (this._layout) {
                            this._layout._updateCellTypes(item);
                        }
                        if (this._hdrLayout) {
                            this._hdrLayout._updateCellTypes(item);
                        }
                    }
                };
                // get the binding column 
                // (in the MultiRow grid, each physical column may contain several binding columns)
                /*protected*/ MultiRow.prototype._getBindingColumn = function (p, r, c) {
                    // convert column to binding column (cell)
                    if (c && (p == this.cells || p == this.columnHeaders)) { // WJM-20646
                        var hdr = p.cellType == wijmo.grid.CellType.ColumnHeader, group = this._getGroupByColumn(c.index, hdr);
                        if (hdr) {
                            r--; // discount group header row (always the first)
                        }
                        c = group.getBindingColumn(p, r, c.index);
                    }
                    // done
                    return c;
                };
                // get all the binding columns (used for searching)
                /*protected*/ MultiRow.prototype._getBindingColumns = function () {
                    var cols = [];
                    this._layout._bindingGroups.forEach(function (group) {
                        group._cols.forEach(function (col) {
                            if (cols.indexOf(col) < 0) {
                                cols.push(col);
                            }
                        });
                    });
                    return cols;
                };
                // get the number of rows used to display each item
                /*protected*/ MultiRow.prototype._getRowsPerItem = function () {
                    return this.rowsPerItem;
                };
                // update grid rows to sync with data source
                /*protected*/ MultiRow.prototype._cvCollectionChanged = function (sender, e) {
                    if (this.autoGenerateColumns && this.columns.length == 0) {
                        this._bindGrid(true);
                    }
                    else {
                        var action = wijmo.collections.NotifyCollectionChangedAction;
                        switch (e.action) {
                            // item changes don't require re-binding
                            case action.Change:
                                this.invalidate();
                                break;
                            // always add at the bottom (TFS 193086)
                            case action.Add:
                                if (e.index == this.collectionView.items.length - 1) {
                                    var index = this.rows.length;
                                    while (index > 0 && this.rows[index - 1] instanceof wijmo.grid._NewRowTemplate) {
                                        index--;
                                    }
                                    for (var i = 0; i < this.rowsPerItem; i++) {
                                        this.rows.insert(index + i, new multirow._MultiRow(e.item, e.index, i));
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
                };
                // ** implementation
                // get the MultiRowCellGroup (cell or column header) for a given column index
                /*internal*/ MultiRow.prototype._getGroupByColumn = function (c, hdr) {
                    var group = null;
                    if (hdr && this._hdrLayout && !this.collapsedHeaders) {
                        group = this._hdrLayout._getGroupByColumn(c);
                    }
                    if (!group) {
                        group = this._layout._getGroupByColumn(c);
                    }
                    wijmo.assert(group instanceof multirow.MultiRowCellGroup, 'Failed to get the group!');
                    return group;
                };
                MultiRow.prototype._onLayoutChanged = function () {
                    // re-apply layout
                    this.layoutDefinition = this._layoutDef;
                };
                MultiRow.prototype._onHeaderLayoutChanged = function () {
                    // re-apply layout
                    this.headerLayoutDefinition = this._hdrLayoutDef;
                };
                // customize cells
                MultiRow.prototype._formatItem = function (s, e) {
                    var rpi = this.rowsPerItem, p = e.panel, ct = p.cellType, row = p.rows[e.range.row], row2 = p.rows[e.range.row2], cell = e.cell, CT = wijmo.grid.CellType;
                    // toggle group header style
                    if (ct == CT.ColumnHeader) {
                        wijmo.toggleClass(cell, 'wj-group-header', e.range.row == 0);
                    }
                    // add group start/end class markers
                    if (ct == CT.Cell || ct == CT.ColumnHeader) {
                        var group = this._getGroupByColumn(e.col, ct == CT.ColumnHeader);
                        wijmo.toggleClass(cell, 'wj-group-start', group._colstart == e.range.col);
                        wijmo.toggleClass(cell, 'wj-group-end', group._colstart + group._colspanEff - 1 == e.range.col2);
                    }
                    // add record start/end class markers
                    if (rpi > 1) {
                        if (ct == CT.Cell || ct == CT.RowHeader) {
                            var mr1 = row instanceof multirow._MultiRow || row instanceof multirow._MultiRowNewRowTemplate;
                            var mr2 = row2 instanceof multirow._MultiRow || row2 instanceof multirow._MultiRowNewRowTemplate;
                            wijmo.toggleClass(cell, 'wj-record-start', mr1 ? row.recordIndex == 0 : false);
                            wijmo.toggleClass(cell, 'wj-record-end', mr2 ? row2.recordIndex == rpi - 1 : false);
                        }
                    }
                    // handle alternating rows
                    var altStep = this.alternatingRowStep;
                    if (altStep) {
                        var altRow = false;
                        if (row instanceof multirow._MultiRow) {
                            altRow = row.dataIndex % (altStep + 1) == 0;
                            if (altStep == 1)
                                altRow = !altRow; // compatibility
                        }
                        wijmo.toggleClass(cell, 'wj-alt', altRow);
                    }
                    // center-align cells vertically if they span multiple rows
                    // (and if this is not a measuring cell)
                    if (this._centerVert && !cell.getAttribute('wj-state-measuring')) {
                        var center = /*cell.innerHTML &&*/ e.range.rowSpan > 1;
                        if (center && e.updateContent) { // center empty cells as well (TFS 466758)
                            if (cell.childElementCount == 0) { // no children: easy/fast! (TFS 355589)
                                cell.innerHTML = '<div>' + cell.innerHTML + '</div>';
                            }
                            else { // has children: surround with a div (TFS 358232)
                                var div = document.createElement('div'), rng = document.createRange();
                                rng.selectNodeContents(cell);
                                rng.surroundContents(div);
                            }
                        }
                        wijmo.toggleClass(cell, 'wj-center-vert', center);
                    }
                };
                // update glyph in collapse/expand headers button
                MultiRow.prototype._updateButtonGlyph = function () {
                    var span = this._btnCollapse.querySelector('span');
                    if (span instanceof HTMLElement) {
                        span.className = this.collapsedHeaders ? 'wj-glyph-left' : 'wj-glyph-down-left';
                    }
                };
                // gets an error message for a cell
                MultiRow.prototype._getError = function (p, r, c, parsing) {
                    if (wijmo.isFunction(this.itemValidator) && p == this.rowHeaders) {
                        for (var rowIndex = 0; rowIndex < this.rowsPerItem; rowIndex++) {
                            for (c = 0; c < this.columns.length; c++) {
                                var error = this.itemValidator(r + rowIndex, c, parsing);
                                if (error) {
                                    return error;
                                }
                            }
                        }
                    }
                    return _super.prototype._getError.call(this, p, r, c, parsing);
                };
                return MultiRow;
            }(wijmo.grid.FlexGrid));
            multirow.MultiRow = MultiRow;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_3) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Provides custom merging for {@link MultiRow} controls.
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
                            var hdr = p.cellType == wijmo.grid.CellType.ColumnHeader, group = grid._getGroupByColumn(c, hdr);
                            wijmo.assert(group instanceof multirow.MultiRowCellGroup, 'Failed to get the group!');
                            var rng = hdr
                                ? group.getMergedRange(p, r - 1, c) // discount column header row (always the first)
                                : group.getMergedRange(p, r, c);
                            // prevent merging across frozen column boundary (TFS 192385)
                            var fzCols = p.columns.frozen;
                            if (fzCols && rng && rng.columnSpan > 1) {
                                if (rng.col < fzCols && rng.col2 >= fzCols) { // TFS 400180
                                    rng = rng.clone(); // do not change the original range (TFS 337352)
                                    if (c < fzCols) {
                                        rng.col2 = fzCols - 1;
                                    }
                                    else {
                                        rng.col = fzCols;
                                    }
                                }
                            }
                            // prevent merging across frozen row boundary (TFS 192385)
                            var fzRows = p.rows.frozen;
                            if (fzRows && rng && rng.rowSpan > 1 && p.cellType == wijmo.grid.CellType.Cell) {
                                if (rng.row < fzRows && rng.row2 >= fzRows) {
                                    rng = rng.clone(); // do not change the original range (TFS 337352)
                                    if (r < fzRows) {
                                        rng.row2 = fzRows - 1;
                                    }
                                    else {
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
                            var rpi = grid.rowsPerItem, row = p.rows[r], top_2 = r - row.recordIndex, bot = Math.min(top_2 + rpi - 1, p.rows.length - 1);
                            return new wijmo.grid.CellRange(top_2, 0, bot, p.columns.length - 1);
                        // merge cells in top/left cell
                        case wijmo.grid.CellType.TopLeft:
                            // take into account that the 1st row is used for collapsed headers (WJM-20582)
                            var ch = grid.collapsedHeaders, cnt = p.rows.length - 1, // number of rows except collapsed one
                            offset = cnt > 0 ? 1 : 0, // the 1st row right after collapsed one
                            tpTop = (ch != false) ? 0 : offset, tpBot = (ch != true) ? cnt : offset;
                            return new wijmo.grid.CellRange(tpTop, 0, tpBot, p.columns.length - 1);
                    }
                    // no merging
                    return null;
                };
                // gets a merged range for group rows
                _MergeManager.prototype._getGroupRowMergedRange = function (p, r, c, clip, multiRowGroupHeaders) {
                    if (clip === void 0) { clip = true; }
                    var g = p.grid, ct = p.cellType, rows = p.rows, row = rows[r];
                    if (g.showGroups && !g.childItemsPath) {
                        if (row instanceof multirow._MultiGroupRow &&
                            row.dataItem instanceof wijmo.collections.CollectionViewGroup &&
                            ct == wijmo.grid.CellType.Cell) {
                            var layout = g._layout;
                            return layout._getGroupHeaderMergedRange(p, r, c, multiRowGroupHeaders);
                        }
                    }
                    return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                };
                return _MergeManager;
            }(wijmo.grid.MergeManager));
            multirow._MergeManager = _MergeManager;
        })(multirow = grid_3.multirow || (grid_3.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_4) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Manages the new row template used to add rows to the grid.
             */
            var _MultiRowAddNewHandler = /** @class */ (function (_super) {
                __extends(_MultiRowAddNewHandler, _super);
                /**
                 * Initializes a new instance of the {@link _AddNewHandler} class.
                 *
                 * @param grid {@link FlexGrid} that owns this {@link _AddNewHandler}.
                 */
                function _MultiRowAddNewHandler(grid) {
                    var _this = this;
                    // detach old handler
                    var old = grid._addHdl;
                    old._detach();
                    // attach this handler instead
                    _this = _super.call(this, grid) || this;
                    return _this;
                }
                /**
                 * Updates the new row template to ensure that it is visible only when the grid is
                 * bound to a data source that supports adding new items, and that it is
                 * in the right position.
                 */
                _MultiRowAddNewHandler.prototype.updateNewRowTemplate = function () {
                    // get variables
                    var ecv = this._g.editableCollectionView, g = this._g, rows = g.rows;
                    // see if we need a new row template
                    var needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;
                    // see if we have new row template
                    var index = -1;
                    for (var i = 0; i < rows.length; i += g.rowsPerItem) {
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
                        for (var i = 0; i < g.rowsPerItem; i++) {
                            var nrt = new _MultiRowNewRowTemplate(i);
                            if (this._top) {
                                rows.insert(i, nrt);
                            }
                            else {
                                rows.push(nrt);
                            }
                        }
                    }
                    // remove template
                    if (!needTemplate && index > -1) {
                        this._removeNewRowTemplate();
                    }
                };
                /*protected*/ _MultiRowAddNewHandler.prototype._keydown = function (e) {
                    _super.prototype._keydown.call(this, e);
                    if (!e.defaultPrevented && e.keyCode == wijmo.Key.Escape) {
                        this._copyNewDataItem(); // clearing new data item
                    }
                };
                /*protected*/ _MultiRowAddNewHandler.prototype._rowEditEnded = function (s, e) {
                    _super.prototype._rowEditEnded.call(this, s, e);
                    this._copyNewDataItem(); // clearing new data item
                };
                // beginning edit, save item in new row template
                /*protected*/ _MultiRowAddNewHandler.prototype._beginningEdit = function (s, e) {
                    _super.prototype._beginningEdit.call(this, s, e);
                    if (this._top && !s.rows[0].dataItem) { // saving new data item
                        this._copyNewDataItem();
                    }
                };
                // copy new data item to template rows
                _MultiRowAddNewHandler.prototype._copyNewDataItem = function () {
                    if (this._top) {
                        var g = this._g, rows = g.rows;
                        for (var i = 0; i < g.rowsPerItem; i++) {
                            if (rows[i] instanceof wijmo.grid._NewRowTemplate) {
                                rows[i].dataItem = this._nrt.dataItem;
                            }
                        }
                    }
                };
                // remove all _NewRowTemplate rows from the grid
                _MultiRowAddNewHandler.prototype._removeNewRowTemplate = function () {
                    for (var i = 0, rows = this._g.rows; i < rows.length; i++) {
                        if (rows[i] instanceof wijmo.grid._NewRowTemplate) {
                            rows.removeAt(i);
                            i--;
                        }
                    }
                };
                return _MultiRowAddNewHandler;
            }(wijmo.grid._AddNewHandler));
            multirow._MultiRowAddNewHandler = _MultiRowAddNewHandler;
            /**
             * Represents a row template used to add items to the source collection.
             */
            var _MultiRowNewRowTemplate = /** @class */ (function (_super) {
                __extends(_MultiRowNewRowTemplate, _super);
                function _MultiRowNewRowTemplate(indexInRecord) {
                    var _this = _super.call(this) || this;
                    _this._idxRecord = indexInRecord;
                    return _this;
                }
                Object.defineProperty(_MultiRowNewRowTemplate.prototype, "recordIndex", {
                    get: function () {
                        return this._idxRecord;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _MultiRowNewRowTemplate;
            }(wijmo.grid._NewRowTemplate));
            multirow._MultiRowNewRowTemplate = _MultiRowNewRowTemplate;
        })(multirow = grid_4.multirow || (grid_4.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.multirow', wijmo.grid.multirow);
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.multirow.js.map