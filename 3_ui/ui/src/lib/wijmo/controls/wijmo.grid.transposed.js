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
        var transposed;
        (function (transposed) {
            'use strict';
            /**
             * Provides custom merging for {@link TransposedGrid} controls.
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
                    var g = p.grid;
                    if (p == g.rowHeaders && g._hasColumnGroups()) {
                        // sanity (TFS 441236)
                        if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
                            return null;
                        }
                        // merge cells in row group headers
                        var grp = g._getColumnGroup(r, c);
                        if (grp) {
                            // get the range from the group
                            var rng = grp._rng, rows = p.rows;
                            // account for frozen rows
                            if (rows.isFrozen(rng.row) != rows.isFrozen(rng.row2)) {
                                rng = rng.clone();
                                if (rows.isFrozen(r)) {
                                    rng.row2 = rows.frozen - 1;
                                }
                                else {
                                    rng.row = rows.frozen;
                                }
                            }
                            // done
                            return rng;
                        }
                        else {
                            // no merging
                            return null;
                        }
                    }
                    // allow base class
                    return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                };
                return _MergeManager;
            }(wijmo.grid.MergeManager));
            transposed._MergeManager = _MergeManager;
        })(transposed = grid.transposed || (grid.transposed = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposed;
        (function (transposed_1) {
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
            var TransposedGrid = /** @class */ (function (_super) {
                __extends(TransposedGrid, _super);
                /**
                 * Initializes a new instance of the {@link TransposedGrid} class.
                 *
                 * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function TransposedGrid(element, options) {
                    var _this = _super.call(this, element, null) || this;
                    _this._keyPrefix = 'item';
                    _this._autoGenRows = true;
                    // add class to host element
                    wijmo.addClass(_this.hostElement, 'wj-transposed-grid');
                    // change some defaults
                    _this.allowSorting = wijmo.grid.AllowSorting.None;
                    _this.headersVisibility = wijmo.grid.HeadersVisibility.Row;
                    // initialize rowInfo array
                    _this._rowInfo = new wijmo.grid.ColumnCollection(_this, _this.columns.defaultSize);
                    // custom ColumnGroupHandler
                    _this._grpHdl = new transposed_1._RowGroupHandler(_this);
                    // custom MergeManager
                    _this.mergeManager = new transposed_1._MergeManager();
                    // apply options after grid has been initialized
                    _this.initialize(options);
                    // listen for changes in _rowInfo array after applying options
                    _this._rowInfo.collectionChanged.addHandler(_this._rowInfoChanged, _this);
                    // configure grid for showing transposed data
                    _this.deferUpdate(function () {
                        var rhCols = _this.rowHeaders.columns;
                        if (rhCols.length) {
                            var col = rhCols[rhCols.length - 1];
                            col.width = _this.columns.defaultSize;
                        }
                    });
                    return _this;
                }
                ;
                Object.defineProperty(TransposedGrid.prototype, "autoGenerateRows", {
                    /**
                     * Gets or sets a value that determines whether the grid should generate
                     * rows automatically based on the {@link itemsSource}.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._autoGenRows;
                    },
                    set: function (value) {
                        this._autoGenRows = wijmo.asBoolean(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedGrid.prototype, "rowGroups", {
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
                    get: function () {
                        return this._grpHdl.getGroupDefinitions();
                    },
                    set: function (value) {
                        var _this = this;
                        this._rowInfo.deferUpdate(function () {
                            _this.autoGenerateRows = false; // TFS 400256
                            _this._rowInfo.clear();
                            _this._grpHdl.createColumnGroups(wijmo.asArray(value));
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                // ** overrides
                // re-generate rows when the _rowInfo changes
                TransposedGrid.prototype.refresh = function (fullUpdate) {
                    var rowInfo = this._rowInfo;
                    if (rowInfo._dirty) {
                        rowInfo._dirty = false;
                        this._rowInfoChanged();
                    }
                    else {
                        _super.prototype.refresh.call(this, fullUpdate);
                    }
                };
                Object.defineProperty(TransposedGrid.prototype, "allowAddNew", {
                    // can't add new
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        // can't all new
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedGrid.prototype, "allowDelete", {
                    // can't delete
                    get: function () {
                        return false;
                    },
                    set: function (value) {
                        // can't delete
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedGrid.prototype, "allowSorting", {
                    // does not support sorting
                    get: function () {
                        return wijmo.grid.AllowSorting.None;
                    },
                    set: function (value) {
                        wijmo.assert(value === wijmo.grid.AllowSorting.None, 'TransposedGrid does not support sorting.');
                        this._alSorting = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TransposedGrid.prototype, "columnGroups", {
                    /**
                     * Not supported. Use {@link rowGroups} instead.
                     */
                    get: function () {
                        return null;
                    },
                    set: function (value) {
                        throw 'TransposedGrid does not support columnGroups, use rowGroups instead.';
                    },
                    enumerable: true,
                    configurable: true
                });
                // update source CollectionView after editing
                TransposedGrid.prototype.onRowEditEnded = function (e) {
                    var sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView');
                    if (sourceView) {
                        var args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change);
                        sourceView.collectionChanged.raise(sourceView, args);
                    }
                    _super.prototype.onRowEditEnded.call(this, e);
                };
                // overridden to transpose incoming data
                TransposedGrid.prototype._getCollectionView = function (value) {
                    var _this = this;
                    // remove CollectionView event handler
                    var sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView');
                    if (sourceView) {
                        sourceView.collectionChanged.removeHandler(this._sourceViewChanged);
                    }
                    // update source view from value 
                    sourceView = wijmo.tryCast(value, 'ICollectionView');
                    // transpose the source data, add CollectionView event handler
                    var transposedValue = value;
                    if (wijmo.isArray(value)) {
                        transposedValue = this._transposeItemsSource(value);
                    }
                    else if (sourceView) {
                        // listen to changes in the ICollectionView
                        sourceView.collectionChanged.addHandler(this._sourceViewChanged, this);
                        // create new ObservableArray from original CollectionView's items
                        transposedValue = this._transposeItemsSource(sourceView.items);
                    }
                    this.autoGenerateColumns = true;
                    // let base class handle this
                    var retVal = _super.prototype._getCollectionView.call(this, transposedValue);
                    // original CollectionView's getError function
                    var getError = null;
                    // honor source CollectionView's getError
                    if (sourceView instanceof wijmo.collections.CollectionView) {
                        getError = sourceView.getError;
                    }
                    // honor original CollectionView's getError handler (TFS 412376)
                    if (getError && retVal instanceof wijmo.collections.CollectionView) {
                        if (this._supportsProxies()) {
                            retVal.getError = function (item, prop) {
                                if (prop == null) { // TFS 469223
                                    return null;
                                }
                                var index = item._keys.indexOf(prop);
                                return getError(item._arr[index], item._bnd.path);
                            };
                        }
                        else {
                            retVal.getError = function (item, prop) {
                                if (prop == null) { // TFS 469223
                                    return null;
                                }
                                var index = parseInt(prop.substr(_this._keyPrefix.length));
                                return getError(item._arr[index], item._rowInfo.binding);
                            };
                        }
                    }
                    // remember source value
                    this._sourceItems = value;
                    // done
                    return retVal;
                };
                // get column names and types based on data
                TransposedGrid.prototype._getColumnTypes = function (arr) {
                    var _this = this;
                    var columnTypes;
                    // set source array
                    var sourceArr;
                    if (this._sourceItems) {
                        if (wijmo.isArray(this._sourceItems)) {
                            sourceArr = this._sourceItems;
                        }
                        else {
                            var sourceView = wijmo.tryCast(this._sourceItems, 'ICollectionView');
                            if (sourceView) {
                                sourceArr = sourceView.items;
                            }
                        }
                    }
                    // if possible set column types from source array
                    // otherwise suppose that array passed in argument is already transposed,
                    // and set column types right from this array itself
                    if (sourceArr) {
                        columnTypes = sourceArr.map(function (item, index) {
                            return {
                                binding: _this._keyPrefix + index,
                                dataType: wijmo.DataType.Object
                            };
                        });
                    }
                    else {
                        columnTypes = wijmo.getTypes(arr);
                    }
                    // done
                    return columnTypes;
                };
                // keep info used to initialize 'rows/columns' properties
                TransposedGrid.prototype._copy = function (key, value) {
                    var _this = this;
                    if (/rows|columns/.test(key)) {
                        wijmo.assert(wijmo.isArray(value), 'Array Expected.');
                        var arr = wijmo.asArray(value);
                        var hasGroups = arr.some(function (grp) { return grp.columns != null; });
                        if (hasGroups) { // handle row groups
                            this.rowGroups = arr;
                        }
                        else { // regular columns
                            this._rowInfo.deferUpdate(function () {
                                _this.autoGenerateRows = false; // TFS 400256
                                _this._rowInfo.clear();
                                value.forEach(function (rowInfo) {
                                    var row = new TransposedGridRow(rowInfo);
                                    _this._rowInfo.push(row);
                                });
                            });
                        }
                        return true;
                    }
                    return _super.prototype._copy.call(this, key, value);
                };
                // update grid when rows are loaded
                TransposedGrid.prototype.onLoadedRows = function (e) {
                    var _this = this;
                    // remove column alignment, data types
                    var cols = this.columns;
                    for (var i = 0; i < cols.length; i++) {
                        var col = cols[i];
                        col.align = null; // not '', that means 'left'
                        col.dataType = 0; // 'Any' (not null, or the grid will auto-set it)
                    }
                    // initialize row headers
                    var rhCols = this.rowHeaders.columns;
                    for (var i = 0; i < rhCols.length; i++) {
                        rhCols[i].align = 'left';
                        rhCols[i].width = 0; // initial value that supposed to be updated
                    }
                    // apply row properties and headers
                    var props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Row);
                    this.rows.forEach(function (row) {
                        var info = row.dataItem._rowInfo;
                        if (info) {
                            // copy props
                            _this._copyProps(info, row, props, ['showDropDown', 'width', 'size']);
                            // update row header cells
                            if (_this._hasColumnGroups()) { // from row/column groups
                                for (var c = 0; c < rhCols.length; c++) {
                                    var grp = _this._grpHdl.getColumnGroup(row.index, c);
                                    if (grp) {
                                        _this._updateRowHeaders(row.index, c, grp);
                                    }
                                }
                            }
                            else if (rhCols.length) { // from row info
                                _this._updateRowHeaders(row.index, rhCols.length - 1, info);
                            }
                        }
                    });
                    // set default width if not yet updated
                    for (var i = 0; i < rhCols.length; i++) {
                        if (rhCols[i].width === 0) {
                            rhCols[i].width = this.columns.defaultSize;
                        }
                    }
                    // go raise the event
                    _super.prototype.onLoadedRows.call(this, e);
                };
                // get the binding column
                /*protected*/ TransposedGrid.prototype._getBindingColumn = function (p, r, c) {
                    var bCol = c;
                    // support cell types only
                    if (p != this.cells) {
                        return bCol;
                    }
                    // preliminary checks
                    var row = p.rows[r];
                    var info = row.dataItem._rowInfo;
                    if (wijmo.isUndefined(info)) {
                        return bCol;
                    }
                    // initialize binding column
                    // TODO: perhaps should be cached
                    bCol = new wijmo.grid.Column();
                    // copy props
                    var props = wijmo.grid.FlexGrid._getSerializableProperties(wijmo.grid.Column);
                    this._copyProps(info, bCol, props);
                    // set effective binding and header
                    bCol.binding = c.binding;
                    bCol.header = info.header || wijmo.toHeaderCase(info.binding);
                    // done
                    return bCol;
                };
                // get value that indicates whether layout is transposed or not
                // Note: transposed layout is when rows represent properties and
                // columns represent items
                /*protected*/ TransposedGrid.prototype._isTransposed = function () {
                    return true;
                };
                // ** implementation
                TransposedGrid.prototype._copyProps = function (src, dst, dstProps, excludeProps) {
                    if (excludeProps === void 0) { excludeProps = []; }
                    for (var prop in src) { // properties
                        if (dstProps.indexOf(prop) > -1 && excludeProps.indexOf(prop) === -1) {
                            var val = src[prop];
                            if (!wijmo.isUndefined(val)) {
                                try {
                                    dst[prop] = val;
                                }
                                catch (x) { }
                            }
                        }
                    }
                };
                // updates row header from 'src' object
                // usually represented by row group or row info objects
                TransposedGrid.prototype._updateRowHeaders = function (r, c, src) {
                    // update cell content
                    var hdr = src.header || wijmo.toHeaderCase(src.binding);
                    this.rowHeaders.setCellData(r, c, hdr);
                    // update column width
                    var rhCols = this.rowHeaders.columns;
                    var width = src.width;
                    if (wijmo.isNumber(width) && width > 0) {
                        var rng = src._rng;
                        if (rng && rng instanceof wijmo.grid.CellRange && rng.isValid) {
                            var colSpan = rng.columnSpan;
                            wijmo.assert(colSpan > 0, 'Column span is negative or equal to 0'); // sanity
                            width = width / colSpan;
                        }
                        rhCols[c].width = Math.max(rhCols[c].width, width);
                    }
                };
                // rows added/removed/changed, re-bind the whole grid
                TransposedGrid.prototype._rowInfoChanged = function () {
                    var _this = this;
                    if (this._toRowInfo) {
                        clearTimeout(this._toRowInfo);
                    }
                    this._toRowInfo = setTimeout(function () {
                        var sel = _this.selection;
                        var items = _this.itemsSource;
                        _this.itemsSource = null;
                        _this.itemsSource = items;
                        _this.selection = sel;
                    }, wijmo.Control._REFRESH_INTERVAL);
                };
                // update transposed view when source CollectionView changes
                TransposedGrid.prototype._sourceViewChanged = function (sender, e) {
                    if (!this.activeEditor) { // TFS 412376
                        this.invalidate();
                    }
                };
                // transpose itemsSource array
                TransposedGrid.prototype._transposeItemsSource = function (arr) {
                    var _this = this;
                    // create transposed array
                    var transposed = new wijmo.collections.ObservableArray();
                    // get data types for each property
                    var propTypes = wijmo.getTypes(arr);
                    // create keys (property names) used by all proxy objects
                    var proxyKeys = arr.map(function (item, index) { return _this._keyPrefix + index; });
                    // auto-generate rowInfo array if necessary
                    var rowInfo = this.autoGenerateRows
                        ? this._getRowInfo(arr)
                        : this._rowInfo;
                    // generate a proxy item for each rowInfo object
                    // each proxy item represents one property (e.g. name, id, etc) of
                    // the original data items and has one property for each original
                    // data item (e.g. item0, item1, etc.)
                    rowInfo.forEach(function (rowInfo, index) {
                        var bnd = new wijmo.Binding(rowInfo.binding); // support deep binding
                        // fill missing data types
                        if (rowInfo.dataType == null && arr.length) { // TFS 431582
                            var val = bnd.getValue(arr[0]);
                            rowInfo.dataType = val != null ? wijmo.getType(val) : propTypes[index].dataType;
                        }
                        // add proxy object if possible, more expensive transposed object otherwise
                        if (_this._supportsProxies()) {
                            var proxy = _this._createProxy(arr, rowInfo, proxyKeys);
                            transposed.push(proxy);
                        }
                        else {
                            var obj = _this._createTransposedObject(arr, rowInfo, _this._keyPrefix);
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
                                var eventArgs = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Reset);
                                transposed.onCollectionChanged(eventArgs);
                                _this._rowInfoChanged(); // re-generate columns 
                            }
                        });
                    }
                    // all done
                    return transposed;
                };
                // check whether the browser supports proxies
                TransposedGrid.prototype._supportsProxies = function () {
                    return window['Proxy'] != null;
                };
                // create proxy that reads/writes data from the original array
                TransposedGrid.prototype._createProxy = function (arr, rowInfo, proxyKeys) {
                    var target = {
                        _arr: arr,
                        _rowInfo: rowInfo,
                        _bnd: new wijmo.Binding(rowInfo.binding),
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
                            return index > -1
                                ? obj._bnd.getValue(obj._arr[index])
                                : obj[prop];
                        },
                        set: function (obj, prop, value) {
                            var index = obj._keys.indexOf(prop);
                            if (index > -1) {
                                var arr_1 = obj._arr, item = arr_1[index];
                                obj._bnd.setValue(item, value);
                                if (arr_1 instanceof wijmo.collections.ObservableArray) {
                                    var e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, index);
                                    arr_1.onCollectionChanged(e);
                                }
                                return true;
                            }
                            return false;
                        }
                    };
                    return new Proxy(target, handler);
                };
                // create proxy-like object when real proxies are not available
                TransposedGrid.prototype._createTransposedObject = function (arr, rowInfo, keyPrefix) {
                    var obj = {
                        _arr: arr,
                        _rowInfo: rowInfo
                    };
                    var bnd = new wijmo.Binding(rowInfo.binding); // supports deep binding
                    var _loop_1 = function (index) {
                        var item = arr[index];
                        Object.defineProperty(obj, keyPrefix + index, {
                            enumerable: true,
                            get: function () {
                                return bnd.getValue(item);
                            },
                            set: function (value) {
                                bnd.setValue(item, value);
                                if (arr instanceof wijmo.collections.ObservableArray) {
                                    var e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, index);
                                    arr.onCollectionChanged(e);
                                }
                                return true;
                            }
                        });
                    };
                    for (var index = 0; index < arr.length; index++) {
                        _loop_1(index);
                    }
                    return obj;
                };
                // auto-generates an array with rowInfo objects based on a data array
                // (similar to the FlexGrid's autoGenerateColumns logic)
                TransposedGrid.prototype._getRowInfo = function (arr) {
                    var _this = this;
                    var rowInfo = [];
                    wijmo.getTypes(arr).forEach(function (prop) {
                        var binding = prop.binding;
                        var type = prop.dataType;
                        if (type != wijmo.DataType.Object && type != wijmo.DataType.Array) {
                            // create the column
                            var col = {
                                binding: binding,
                                header: wijmo.toHeaderCase(binding),
                                dataType: type
                            };
                            // set the column's width (depends on dataType)
                            var width = wijmo.grid.FlexGrid._defTypeWidth[type];
                            if (width != null) {
                                if (wijmo.isString(width)) {
                                    var val = Math.round(parseFloat(width));
                                    width = width.indexOf('*') < 0 ? val : val * _this.columns.defaultSize;
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
                };
                return TransposedGrid;
            }(wijmo.grid.FlexGrid));
            transposed_1.TransposedGrid = TransposedGrid;
            /**
             * This class is for internal use only.
             */
            var TransposedGridRow = /** @class */ (function (_super) {
                __extends(TransposedGridRow, _super);
                function TransposedGridRow() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(TransposedGridRow.prototype, "height", {
                    /**
                     * Gets or sets the height of the row.
                     * Setting this property to null or negative values causes the element to use the
                     * parent collection's default size.
                     */
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        this._height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return TransposedGridRow;
            }(wijmo.grid.Column));
            transposed_1.TransposedGridRow = TransposedGridRow;
        })(transposed = grid.transposed || (grid.transposed = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var transposed;
        (function (transposed) {
            /**
             * Provides custom handling of row groups for {@link TransposedGrid} controls.
             */
            var _RowGroupHandler = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link _RowGroupHandler} class.
                 *
                 * @param g {@link TransposedGrid} that owns this {@link _RowGroupHandler}.
                 */
                function _RowGroupHandler(grid) {
                    this._grid = grid;
                }
                Object.defineProperty(_RowGroupHandler.prototype, "columnGroups", {
                    // ** _IColumnGroupHandler members
                    /**
                     * Gets the collection of column groups.
                     * Currently does not support and returns null;
                     */
                    get: function () {
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initializes the column groups based on an array of
                 * column definition objects.
                 *
                 * @param arr Array of column definition objects that defines the groups.
                 */
                _RowGroupHandler.prototype.createColumnGroups = function (arr) {
                    // actually creates row groups
                    this._createRowGroups(arr);
                };
                /**
                 * Gets a value that determines whether the grid has any
                 * column groups.
                 */
                _RowGroupHandler.prototype.hasColumnGroups = function () {
                    return this._colGroups != null && this._colGroups.length > 0;
                };
                /**
                 * Gets the original array used to define the column groups.
                 */
                _RowGroupHandler.prototype.getGroupDefinitions = function () {
                    return this._groupDefs;
                };
                /**
                 * Gets the column group that contains a given row and column.
                 *
                 * @param r Index of the row containted in the group.
                 * @param c Index of the column containted in the group.
                 */
                _RowGroupHandler.prototype.getColumnGroup = function (r, c) {
                    var g = this._grid;
                    if (c < g.rowHeaders.columns.length && r < g._rowInfo.length) { // sanity
                        for (var groups = this._colGroups; groups;) { // start scanning at the top level
                            var startGroups = groups;
                            for (var i = 0; i < groups.length; i++) {
                                var grp = groups[i], rng = grp._rng;
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
                };
                /**
                 * Checks whether the column group can be moved from one position to another.
                 *
                 * @param srcRow The row index of the column group to move.
                 * @param srcCol The column index of the column group to move.
                 * @param dstRow The row position to which to move the column group.
                 * @param dstCol The column position to which to move the column group.
                 * @returns Returns true if the move is valid, false otherwise.
                 */
                _RowGroupHandler.prototype.canMoveColumnGroup = function (srcRow, srcCol, dstRow, dstCol) {
                    // TODO: provide proper implementation
                    return this._grid.columns.canMoveElement(srcCol, dstCol);
                };
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
                _RowGroupHandler.prototype.moveColumnGroup = function (srcRow, srcCol, dstRow, dstCol, child) {
                    // TODO: provide proper implementation
                    return this._grid.columns.moveElement(srcCol, dstCol);
                };
                // ** implementation
                // initializes the row groups from an array of group definition objects.
                // remark: in fact, the '_colGroups' field represents rows
                _RowGroupHandler.prototype._createRowGroups = function (arr) {
                    var _this = this;
                    var g = this._grid;
                    this._groupDefs = wijmo.asArray(arr);
                    // some preliminary actions
                    g.autoGenerateRows = false; // don't mess with the layout
                    g._rowInfo.clear(); // clear rows
                    // parse header rows
                    this._colGroups = [];
                    arr.forEach(function (colDef) {
                        _this._colGroups.push(new _RowGroup(colDef, null));
                    });
                    // set group ranges and add bound rows (no children) to row collection
                    var maxLevel = 1;
                    this._colGroups.forEach(function (grp) {
                        _this._addRowGroup(grp);
                        maxLevel = Math.max(maxLevel, grp._getMaxLevel());
                    });
                    // expand groups that don't have enough columns
                    this._colGroups.forEach(function (grp) {
                        grp._expandRange(maxLevel);
                    });
                    // add new header columns to the grid
                    var columns = g.rowHeaders.columns;
                    columns.clear();
                    for (var c = 0; c <= maxLevel; c++) {
                        var col = new wijmo.grid.Column();
                        columns.splice(c, 0, col);
                        if (c < maxLevel) { // center-align headers for all columns but the last
                            col.cssClassAll = 'wj-colgroup';
                        }
                    }
                };
                _RowGroupHandler.prototype._addRowGroup = function (grp) {
                    var _this = this;
                    var g = this._grid;
                    // save reference to parent grid
                    grp._grid = g;
                    // initialize group row range
                    grp._rng.row = g._rowInfo.length;
                    // add row or group
                    if (grp.columns.length == 0) {
                        g._rowInfo.push(grp);
                    }
                    else {
                        grp.columns.forEach(function (child) {
                            _this._addRowGroup(child);
                        });
                    }
                    // close group row range
                    grp._rng.row2 = g._rowInfo.length - 1;
                };
                return _RowGroupHandler;
            }());
            transposed._RowGroupHandler = _RowGroupHandler;
            /**
             * Extends the {@link Column} class to provide custom row groups
             * for {@link TransposedGrid} controls.
             */
            var _RowGroup = /** @class */ (function (_super) {
                __extends(_RowGroup, _super);
                /**
                 * Initializes a new instance of the {@link _RowGroup} class.
                 *
                 * @param options JavaScript object containing initialization data for the instance.
                 * @param parent Parent group, or null for top-level groups.
                 */
                function _RowGroup(options, parent) {
                    var _this = _super.call(this) || this;
                    /*private*/ _this._rng = new wijmo.grid.CellRange(-1, 0);
                    _this._cols = [];
                    _this._lvl = 0;
                    _this._collapsed = false;
                    // store/update group level
                    _this._pGrp = parent;
                    _this._lvl = 0;
                    for (var p = parent; p; p = p._pGrp) {
                        _this._lvl++;
                    }
                    // add this group to the parent group's columns collection
                    if (parent && parent.columns.indexOf(_this) < 0) {
                        parent.columns.push(_this);
                    }
                    // initialize group column range
                    _this._rng.col = _this._rng.col2 = _this._lvl;
                    // no dragging group rows
                    _this.allowDragging = false;
                    // parse options (including child columns)
                    wijmo.copy(_this, options);
                    return _this;
                }
                Object.defineProperty(_RowGroup.prototype, "columns", {
                    // object model
                    /**
                     * Gets or sets the collection of child {@link _RowGroup} columns.
                     */
                    get: function () {
                        return this._cols;
                    },
                    set: function (value) {
                        var _this = this;
                        var cols = this._cols = [];
                        value.forEach(function (colDef) {
                            var grp = new _RowGroup(colDef, _this);
                            if (cols.indexOf(grp) < 0) {
                                cols.push(grp);
                            }
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "rows", {
                    // required for JSON-style initialization
                    get: function () {
                        return this._cols;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "isEmpty", {
                    /**
                     * Gets the value that indicates whether the group contains child columns or not.
                     */
                    get: function () {
                        return this._cols.length === 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "height", {
                    /**
                     * Gets or sets the height of the row.
                     * Setting this property to null or negative values causes the element to use the
                     * parent collection's default size.
                     */
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        this._height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "level", {
                    /**
                     * Gets this {@link _RowGroup}'s level (the number of parent groups it has).
                     *
                     * Top level groups have level zero. Their children have level 1, and so on.
                     */
                    get: function () {
                        var grp = this, level = 0;
                        while (grp._pGrp) {
                            grp = grp._pGrp;
                            level++;
                        }
                        return level;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "collapseTo", {
                    /**
                     * Gets or sets the binding of the column that should remain
                     * visible when this {@link _RowGroup} is collapsed.
                     */
                    get: function () {
                        return this._collTo;
                    },
                    set: function (value) {
                        this._collTo = wijmo.asString(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RowGroup.prototype, "isCollapsed", {
                    /**
                     * Gets or sets a value that determines whether this {@link _RowGroup}
                     * is collapsed.
                     */
                    get: function () {
                        return this._collapsed;
                    },
                    set: function (value) {
                        var _this = this;
                        // change the collapsed value
                        if (value != this._collapsed) {
                            var g = this._grid;
                            if (g) {
                                var e = new wijmo.grid.CellRangeEventArgs(g.rowHeaders, this._rng, this);
                                if (g.onColumnGroupCollapsedChanging(e)) {
                                    this._collapsed = wijmo.asBoolean(value);
                                    g.onColumnGroupCollapsedChanged(e);
                                }
                            }
                            else { // grid not set yet, so no events
                                this._collapsed = wijmo.asBoolean(value);
                            }
                        }
                        // update the collapse state (always)
                        setTimeout(function () {
                            _this._updateCollapsedState();
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                // method used in JSON-style initialization
                // keep info used to initialize 'rows/columns' properties
                _RowGroup.prototype._copy = function (key, value) {
                    if (/rows|columns/.test(key)) {
                        var arr = wijmo.asArray(value);
                        this.columns = arr;
                        return true;
                    }
                    return false;
                };
                // expand or collapse the group based on the value of the _collapsed member
                // remark: notice that variables/fields herein referred as columns ('cols', '_cols')
                // actually represent rows
                _RowGroup.prototype._updateCollapsedState = function () {
                    var g = this._grid, cols = g._rowInfo, rng = this._rng, collapsed = this._collapsed;
                    // apply collapsed state to all child columns
                    this._cols.forEach(function (col) {
                        if (col instanceof _RowGroup) {
                            col._collapsed = collapsed;
                            col._updateCollapsedState();
                        }
                    });
                    // get the index of the column to keep visible when the group is collapsed
                    var collapseToIndex = rng.bottomRow;
                    if (this.collapseTo) {
                        switch (this.collapseTo) {
                            case '$first':
                                collapseToIndex = rng.topRow;
                                break;
                            case '$last':
                                collapseToIndex = rng.bottomRow;
                                break;
                            default:
                                var index = cols.indexOf(this.collapseTo);
                                if (index > -1) {
                                    collapseToIndex = index;
                                }
                                break;
                        }
                    }
                    // show/hide columns
                    for (var c = rng.topRow; c <= rng.bottomRow; c++) {
                        cols[c].visible = collapsed
                            ? c == collapseToIndex // show collapseTo column
                            : true; // show all
                    }
                };
                // get the max level of the groups within this group
                _RowGroup.prototype._getMaxLevel = function () {
                    var maxLevel = this._lvl;
                    this.columns.forEach(function (grp) {
                        maxLevel = Math.max(maxLevel, grp._getMaxLevel());
                    });
                    return maxLevel;
                };
                // expand the row's horizontal range to fill the required number of rows
                _RowGroup.prototype._expandRange = function (maxLevel) {
                    // expand group
                    var delta = maxLevel - this._getMaxLevel();
                    if (delta > 0) {
                        this._rng.col2 += delta; // expand this
                        this._cols.forEach(function (grp) {
                            grp._shiftRange(delta);
                        });
                    }
                    // make sure last column extends to the right to the max level
                    var g = this._grid, rows = g._rowInfo, rng = this._rng;
                    for (var r = rng.row; r <= rng.row2; r++) {
                        var grp = rows[r];
                        grp._rng.col2 = maxLevel;
                    }
                };
                // shift expand the row's horizontal range to line up at the right
                _RowGroup.prototype._shiftRange = function (delta) {
                    this._rng.col += delta;
                    this._rng.col2 += delta;
                    this._cols.forEach(function (grp) {
                        grp._shiftRange(delta);
                    });
                };
                return _RowGroup;
            }(wijmo.grid.Column));
            transposed._RowGroup = _RowGroup;
        })(transposed = grid_1.transposed || (grid_1.transposed = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var transposed;
        (function (transposed) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.transposed', wijmo.grid.transposed);
        })(transposed = grid.transposed || (grid.transposed = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.transposed.js.map