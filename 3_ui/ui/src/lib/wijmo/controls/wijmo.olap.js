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
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Generates MDX queries for the {@link _SqlServerConnection} class.
         */
        var _TextBuilder = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link _TextBuilder} class.
             */
            function _TextBuilder() {
                this._text = "";
            }
            Object.defineProperty(_TextBuilder.prototype, "length", {
                /**
                 * Returns the text length.
                 */
                get: function () {
                    return this._text.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Returns the text.
             */
            _TextBuilder.prototype.toString = function () {
                return this._text;
            };
            /**
             * Appends a concatenation of strings.
             *
             * @param ...items Array of strings to be appended.
             */
            _TextBuilder.prototype.append = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                var _a;
                this._text = (_a = this._text).concat.apply(_a, items);
            };
            /**
             * Appends a separator followed by a concatenation of strings.
             *
             * @param separator Separator string.
             * @param ...parts Array of strings to be appended.
             */
            _TextBuilder.prototype.joinToList = function (separator) {
                var parts = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    parts[_i - 1] = arguments[_i];
                }
                var _a;
                var tmp = parts.join();
                if (this.length > 0 && tmp.length > 0) {
                    this._text = (_a = this._text).concat.apply(_a, [separator].concat(parts));
                }
                else if (tmp.length > 0) {
                    this._text = tmp;
                }
            };
            /**
             * Appends a comma separator followed by an individual string.
             *
             * @param item String to be appended.
             */
            _TextBuilder.prototype.joinItemToList = function (item) {
                this.joinToList(",", item);
            };
            /**
             * Wraps a non-empty string with the specified prefix and suffix.
             *
             * @param prefix Prefix string.
             * @param suffix Suffix string.
             */
            _TextBuilder.prototype.wrap = function (prefix, suffix) {
                if (this.length > 0) {
                    this._text = prefix.concat(this._text, suffix);
                }
            };
            /**
             * Wraps a non-empty string with the specified prefix and suffix.
             *
             * @param prefix Prefix string.
             * @param text Text to be wrapped.
             * @param suffix Suffix string.
             */
            _TextBuilder.wrap = function (prefix, text, suffix) {
                if (text.length > 0) {
                    return prefix.concat(text, suffix);
                }
                else {
                    return "";
                }
            };
            return _TextBuilder;
        }());
        olap._TextBuilder = _TextBuilder;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Accumulates observations and returns aggregate statistics.
         */
        var _Tally = /** @class */ (function () {
            function _Tally() {
                this._cntAll = 0;
                this._cnt = 0;
                this._cntn = 0;
                this._sum = 0;
                this._sum2 = 0;
                this._min = null;
                this._max = null;
                this._first = null;
                this._last = null;
            }
            /**
             * Adds a value to the tally.
             *
             * @param value Value to be added to the tally.
             * @param weight Weight to be attributed to the value.
             */
            _Tally.prototype.add = function (value, weight) {
                if (value instanceof _Tally) {
                    // add a tally
                    this._sum += value._sum;
                    this._sum2 += value._sum2;
                    this._max = this._max && value._max ? Math.max(this._max, value._max) : (this._max || value._max);
                    this._min = this._min && value._min ? Math.min(this._min, value._min) : (this._min || value._min);
                    this._cnt += value._cnt;
                    this._cntn += value._cntn;
                    this._cntAll += value._cntAll;
                }
                else {
                    this._cntAll++; // count all, even nulls
                    if (value != null) {
                        // add a value
                        this._cnt++;
                        if (wijmo.isBoolean(value)) { // Booleans aggregate like 1/0
                            value = value ? 1 : 0;
                        }
                        if (this._min == null || value < this._min) {
                            this._min = value;
                        }
                        if (this._max == null || value > this._max) {
                            this._max = value;
                        }
                        if (this._first == null) {
                            this._first = value;
                        }
                        this._last = value;
                        if (wijmo.isNumber(value) && !isNaN(value)) {
                            if (wijmo.isNumber(weight)) {
                                value *= weight;
                            }
                            this._cntn++;
                            this._sum += value;
                            this._sum2 += value * value;
                        }
                    }
                }
            };
            /**
             * Gets an aggregate statistic from the tally.
             *
             * @param aggregate Type of aggregate statistic to get.
             */
            _Tally.prototype.getAggregate = function (aggregate) {
                // for compatibility with Excel PivotTables
                if (this._cnt == 0) {
                    return null;
                }
                var avg = this._cntn == 0 ? 0 : this._sum / this._cntn;
                var ae = wijmo.Aggregate;
                switch (aggregate) {
                    case ae.None:
                        return null;
                    case ae.CntAll:
                        return this._cntAll;
                    case ae.Avg:
                        return avg;
                    case ae.Cnt:
                        return this._cnt;
                    case ae.Max:
                        return this._max;
                    case ae.Min:
                        return this._min;
                    case ae.Rng:
                        return this._max - this._min;
                    case ae.Sum:
                        return this._sum;
                    case ae.VarPop:
                        return this._cntn <= 1 ? 0 : this._sum2 / this._cntn - avg * avg;
                    case ae.StdPop:
                        return this._cntn <= 1 ? 0 : Math.sqrt(this._sum2 / this._cntn - avg * avg);
                    case ae.Var:
                        return this._cntn <= 1 ? 0 : (this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1);
                    case ae.Std:
                        return this._cntn <= 1 ? 0 : Math.sqrt((this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1));
                    case ae.First:
                        return this._first;
                    case ae.Last:
                        return this._last;
                }
                // should never get here...
                throw 'Invalid aggregate type.';
            };
            return _Tally;
        }());
        olap._Tally = _Tally;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a combination of {@link PivotField} objects and their values.
         *
         * Each row and column on the output view is defined by a unique {@link PivotKey}.
         * The values in the output cells represent an aggregation of the value field
         * for all items that match the row and column keys.
         *
         * For example, if a column key is set to 'Country:UK;Customer:Joe' and
         * the row key is set to 'Category:Desserts;Product:Pie', then the corresponding
         * cell contains the aggregate for all items with the following properties:
         *
         * <pre>{ Country: 'UK', Customer: 'Joe', Category: 'Desserts', Product: 'Pie' };</pre>
         */
        var _PivotKey = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link PivotKey} class.
             *
             * @param fields {@link PivotFieldCollection} that owns this key.
             * @param fieldCount Number of fields to take into account for this key.
             * @param valueFields {@link PivotFieldCollection} that contains the values for this key.
             * @param valueFieldIndex Index of the value to take into account for this key.
             * @param item First data item represented by this key.
             */
            function _PivotKey(fields, fieldCount, valueFields, valueFieldIndex, item) {
                this._fields = fields;
                this._fieldCount = fieldCount;
                this._valueFields = valueFields;
                this._valueFieldIndex = valueFieldIndex;
                this._item = item;
            }
            Object.defineProperty(_PivotKey.prototype, "fields", {
                /**
                 * Gets the {@link PivotFieldCollection} that owns this key.
                 */
                get: function () {
                    return this._fields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "valueFields", {
                /**
                 * Gets the {@link PivotFieldCollection} that contains the values for this key.
                 */
                get: function () {
                    return this._valueFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "valueField", {
                /**
                 * Gets the {@link PivotField} that contains the main value for this key.
                 */
                get: function () {
                    return this._valueFields[this._valueFieldIndex];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "values", {
                /**
                 * Gets an array with the values used to create this key.
                 */
                get: function () {
                    if (this._vals == null) {
                        this._vals = new Array(this._fieldCount);
                        for (var i = 0; i < this._fieldCount; i++) {
                            var fld = this._fields[i];
                            this._vals[i] = fld._getValue(this._item, false);
                        }
                    }
                    return this._vals;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "fieldNames", {
                /**
                 * Gets an array with the names of the fields in this key.
                 */
                get: function () {
                    if (!this._names) {
                        this._names = [];
                        for (var i = 0; i < this.fields.length; i++) {
                            var pf = this._fields[i];
                            this._names.push(pf._getName());
                        }
                    }
                    return this._names;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "aggregate", {
                /**
                 * Gets the type of aggregate represented by this key.
                 */
                get: function () {
                    var vf = this._valueFields, idx = this._valueFieldIndex;
                    wijmo.assert(vf && idx > -1 && idx < vf.length, 'aggregate not available for this key');
                    return vf[idx].aggregate;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the value for this key at a given index.
             *
             * @param index Index of the field to be retrieved.
             * @param formatted Whether to return a formatted string or the raw value.
             */
            _PivotKey.prototype.getValue = function (index, formatted) {
                if (this.values.length == 0) {
                    return wijmo.culture.olap.PivotEngine.grandTotal;
                }
                if (index > this.values.length - 1) {
                    return wijmo.culture.olap.PivotEngine.subTotal;
                }
                var val = this.values[index];
                if (formatted && !wijmo.isString(val)) {
                    var fld = this.fields[index], fmt = fld ? fld.format : ''; // TFS 258996
                    val = wijmo.Globalize.format(this.values[index], fmt);
                }
                return val;
            };
            Object.defineProperty(_PivotKey.prototype, "level", {
                /**
                 * Gets the subtotal level that this key represents.
                 *
                 * The value -1 indicates the key does not represent a subtotal.
                 * Zero indicates a grand total.
                 * Values greater than zero indicate the subtotal level.
                 */
                get: function () {
                    return this._fieldCount == this._fields.length
                        ? -1 // not a subtotal
                        : this._fieldCount;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Comparer function used to sort arrays of {@link _PivotKey} objects.
             *
             * @param key {@link _PivotKey} to compare to this one.
             */
            _PivotKey.prototype.compareTo = function (key) {
                var cmp = 0;
                if (key != null && key._fields == this._fields) {
                    // compare values
                    var vals = this.values, kvals = key.values, count = Math.min(vals.length, kvals.length);
                    for (var i = 0; i < count; i++) {
                        // get types and value to compare
                        var type = vals[i] != null ? wijmo.getType(vals[i]) : null, ic1 = vals[i], ic2 = kvals[i];
                        // let the field compare the values
                        var fld = this._fields[i];
                        if (fld.sortComparer) {
                            cmp = fld.sortComparer(ic1, ic2);
                            if (wijmo.isNumber(cmp)) {
                                if (cmp != 0) {
                                    return fld.descending ? -cmp : cmp;
                                }
                                continue;
                            }
                        }
                        // Dates are hard because the format used may affect the sort order:
                        // for example, 'MMMM' shows only months, so the year should not be 
                        // taken into account when sorting.
                        if (type == wijmo.DataType.Date) {
                            var fmt = fld.format;
                            if (fmt && fmt != 'd' && fmt != 'D') {
                                var s1 = fld._getValue(this._item, true), s2 = fld._getValue(key._item, true), d1 = wijmo.Globalize.parseDate(s1, fmt), d2 = wijmo.Globalize.parseDate(s2, fmt);
                                if (d1 && d2) { // parsed OK, compare parsed dates
                                    ic1 = d1;
                                    ic2 = d2;
                                }
                                else { // parsing failed, compare as strings (e.g. "ddd")
                                    ic1 = s1;
                                    ic2 = s2;
                                }
                            }
                        }
                        // different values? we're done! (careful when comparing dates: TFS 190950)
                        var equal = (ic1 == ic2) || wijmo.DateTime.equals(ic1, ic2);
                        if (!equal) {
                            if (ic1 == null)
                                return +1; // can't compare nulls to non-nulls
                            if (ic2 == null)
                                return -1; // show nulls at the bottom
                            cmp = ic1 < ic2 ? -1 : +1;
                            return fld.descending ? -cmp : cmp;
                        }
                    }
                    // compare value fields by index
                    // for example, if this view has two value fields "Sales" and "Downloads",
                    // then order the value fields by their position in the Values list.
                    if (vals.length == kvals.length) {
                        cmp = this._valueFieldIndex - key._valueFieldIndex;
                        if (cmp != 0) {
                            return cmp;
                        }
                    }
                    // all values match, compare key length 
                    // (so subtotals come at the bottom)
                    cmp = kvals.length - vals.length;
                    if (cmp != 0) {
                        return cmp * (this.fields.engine.totalsBeforeData ? -1 : +1);
                    }
                }
                // keys are the same
                return 0;
            };
            /**
             * Gets a value that determines whether a given data object matches
             * this {@link _PivotKey}.
             *
             * The match is determined by comparing the formatted values for each
             * {@link PivotField} in the key to the formatted values in the given item.
             * Therefore, matches may occur even if the raw values are different.
             *
             * @param item Item to check for a match.
             */
            _PivotKey.prototype.matchesItem = function (item) {
                for (var i = 0; i < this._vals.length; i++) {
                    var s1 = this.getValue(i, true), s2 = this._fields[i]._getValue(item, true);
                    if (s1 != s2) {
                        return false;
                    }
                }
                return true;
            };
            // overridden to return a unique string for the key
            _PivotKey.prototype.toString = function (uniqueId) {
                if (!this._key || uniqueId) {
                    var key = '';
                    // save pivot fields
                    for (var i = 0; i < this._fieldCount; i++) {
                        var pf = this._fields[i];
                        key += pf._getName() + ':' + pf._getValue(this._item, true) + ';';
                    }
                    // save value field
                    if (this._valueFields) {
                        var vf = this._valueFields[this._valueFieldIndex];
                        key += vf._getName() + ':0;';
                    }
                    else {
                        key += '{total}';
                    }
                    // save the key
                    if (uniqueId) {
                        return key + uniqueId.toString();
                    }
                    else {
                        this._key = key;
                    }
                }
                return this._key;
            };
            // name of the output field that contains the row's pivot key
            _PivotKey._ROW_KEY_NAME = '$rowKey';
            return _PivotKey;
        }());
        olap._PivotKey = _PivotKey;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        var _NOT_EDITABLE = 'This collection is not editable.';
        /**
         * Extends the {@link CollectionView} class to preserve the position of subtotal rows
         * when sorting.
         */
        var PivotCollectionView = /** @class */ (function (_super) {
            __extends(PivotCollectionView, _super);
            /**
             * Initializes a new instance of the {@link PivotCollectionView} class.
             *
             * @param engine {@link PivotEngine} that owns this collection.
             */
            function PivotCollectionView(engine) {
                var _this = _super.call(this) || this;
                _this.canAddNew = _this.canRemove = false;
                _this._ng = wijmo.asType(engine, olap.PivotEngine, false);
                return _this;
            }
            Object.defineProperty(PivotCollectionView.prototype, "engine", {
                //** object model
                /**
                 * Gets a reference to the {@link PivotEngine} that owns this view.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            // ** overrides
            // this collection is not supposed to be edited! (TFS 496696 and many others)
            PivotCollectionView.prototype.implementsInterface = function (interfaceName) {
                return interfaceName == 'IEditableCollectionView'
                    ? false
                    : _super.prototype.implementsInterface.call(this, interfaceName);
            };
            PivotCollectionView.prototype.editItem = function (item) {
                wijmo.assert(false, _NOT_EDITABLE);
            };
            PivotCollectionView.prototype.addNew = function () {
                wijmo.assert(false, _NOT_EDITABLE);
            };
            // perform sort keeping groups together
            PivotCollectionView.prototype._performSort = function (items) {
                //// debugging
                //let copy = items.slice();
                var ng = this._ng;
                if (ng.sortableGroups && ng._getShowRowTotals() == olap.ShowTotals.Subtotals) {
                    var start = 0, end = items.length - 1;
                    if (this._getItemLevel(items[start]) == 0)
                        start++;
                    if (this._getItemLevel(items[end]) == 0)
                        end--;
                    this._sortGroups(items, 1, start, end);
                }
                else {
                    this._sortData(items);
                }
                //// checking
                //assert(items.length == copy.length, 'length should be the same');
                //for (let i = 0; i < items.length; i++) {
                //    assert(items.indexOf(copy[i]) > -1, 'missing item');
                //    assert(copy.indexOf(items[i]) > -1, 'extra item');
                //}
            };
            // show rows only if there are value or row fields
            PivotCollectionView.prototype._performFilter = function (items) {
                // no value/row fields? no items
                if (this._ng) {
                    if (this._ng.valueFields.length == 0 && this._ng.rowFields.length == 0) {
                        return [];
                    }
                }
                // default handling
                return this.canFilter && this._filter
                    ? items.filter(this._filter, this)
                    : items;
            };
            // ** implementation
            // gets the range of items in a group
            PivotCollectionView.prototype._getGroupRange = function (items, item) {
                var ng = this._ng, start = items.indexOf(item), end = start, level = this._getItemLevel(items[start]);
                if (ng.totalsBeforeData) {
                    for (end = start; end < items.length - 1; end++) {
                        var lvl = this._getItemLevel(items[end + 1]);
                        if (lvl > -1 && lvl <= level) {
                            break;
                        }
                    }
                }
                else {
                    for (start = end; start; start--) {
                        var lvl = this._getItemLevel(items[start - 1]);
                        if (lvl > -1 && lvl <= level) {
                            break;
                        }
                    }
                }
                return [start, end];
            };
            // sorts the groups in an array segment
            PivotCollectionView.prototype._sortGroups = function (items, level, start, end) {
                // look for groups within the range
                var groups = [];
                for (var i = start; i <= end; i++) {
                    if (this._getItemLevel(items[i]) == level) {
                        groups.push(items[i]);
                    }
                }
                // no groups? regular data sort
                if (!groups.length) {
                    this._sortData(items);
                    return;
                }
                // sort group rows by total
                _super.prototype._performSort.call(this, groups);
                // build array with sorted groups
                var arr = [];
                for (var i = 0; i < groups.length; i++) {
                    // copy group to output
                    var rng = this._getGroupRange(items, groups[i]), len = arr.length;
                    for (var j = rng[0]; j <= rng[1]; j++) {
                        arr.push(items[j]);
                    }
                    // sort subgroups
                    if (level < this._ng.rowFields.length - 1) {
                        this._sortGroups(arr, level + 1, start + len, arr.length - 1);
                    }
                    else {
                        this._sortSegment(arr, start + len, arr.length - 1);
                    }
                }
                // copy sorted result back into original array
                for (var i = 0; i < arr.length; i++) {
                    items[start + i] = arr[i];
                }
            };
            // sorts the data in an array segment (no groups)
            PivotCollectionView.prototype._sortSegment = function (items, start, end) {
                var arr = items.slice(start, end);
                _super.prototype._performSort.call(this, arr);
                for (var i = 0; i < arr.length; i++) {
                    items[start + i] = arr[i];
                }
            };
            // sorts the data items between subtotals (old approach)
            PivotCollectionView.prototype._sortData = function (items) {
                for (var start = 0; start < items.length; start++) {
                    // skip totals
                    if (this._getItemLevel(items[start]) > -1) {
                        continue;
                    }
                    // find last item that is not a total
                    var end = start;
                    for (; end < items.length - 1; end++) {
                        if (this._getItemLevel(items[end + 1]) > -1) {
                            break;
                        }
                    }
                    // sort items between start and end
                    if (end > start) {
                        var arr = items.slice(start, end + 1);
                        _super.prototype._performSort.call(this, arr);
                        for (var i = 0; i < arr.length; i++) {
                            items[start + i] = arr[i];
                        }
                    }
                    // move on to next item
                    start = end;
                }
            };
            // gets the outline level for a data item
            PivotCollectionView.prototype._getItemLevel = function (item) {
                var key = item[olap._PivotKey._ROW_KEY_NAME];
                return key.level;
            };
            return PivotCollectionView;
        }(wijmo.collections.CollectionView));
        olap.PivotCollectionView = PivotCollectionView;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a property of the items in the wijmo.olap data source.
         */
        var PivotField = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link PivotField} class.
             *
             * @param engine {@link PivotEngine} that owns this field.
             * @param binding Property that this field is bound to.
             * @param header Header shown to identify this field (defaults to the binding).
             * @param options JavaScript object containing initialization data for the field.
             */
            function PivotField(engine, binding, header, options) {
                // ** events
                /**
                 * Occurs when the value of a property in this {@link Range} changes.
                 */
                this.propertyChanged = new wijmo.Event();
                this._ng = engine;
                this._binding = new wijmo.Binding(binding);
                this._header = header ? header : wijmo.toHeaderCase(binding);
                this._showAs = olap.ShowAs.NoCalculation;
                this._isContentHtml = false;
                this._visible = true;
                this._format = '';
                this._filter = new olap.PivotFilter(this);
                wijmo.copy(this, options);
                // update dataType and aggregate props if they are not assigned explicitly
                if (this._dataType == null) {
                    this._updateDataType();
                }
                if (this._aggregate == null) {
                    this._aggregate = (this.dataType == wijmo.DataType.Number) // as in engine._createField (TFS 466847)
                        ? wijmo.Aggregate.Sum // this works for numbers
                        : wijmo.Aggregate.Cnt; // this works for all data types
                }
            }
            Object.defineProperty(PivotField.prototype, "binding", {
                // ** object model
                /**
                 * Gets or sets the name of the property the field is bound to.
                 */
                get: function () {
                    return this._binding ? this._binding.path : null;
                },
                set: function (value) {
                    if (value != this.binding) {
                        var oldValue = this.binding, path = wijmo.asString(value);
                        this._binding = path ? new wijmo.Binding(path) : null;
                        this._updateDataType();
                        var e = new wijmo.PropertyChangedEventArgs('binding', oldValue, value);
                        this.onPropertyChanged(e);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "getValue", {
                /**
                 * Gets or sets a function to be used for retrieving the field value
                 * for a given data item.
                 *
                 * This property is set to null by default, causing the engine to
                 * use the field's {@link binding} property to retrieve the value.
                 *
                 * If specified, the function should take a single parameter that
                 * represents the data item being evaluated and should return
                 * the calculated value for the item.
                 *
                 * Notice the difference between the {@link getValue} property
                 * (a function that takes a raw data item and returns a raw value), and
                 * the {@link getAggregateValue} (a function that takes a summary object
                 * and returns an aggregate value):
                 *
                 * ```typescript
                 * fields: [
                 *     {
                 *         header: 'Conversion (per summary row)',
                 *         dataType: 'Number',
                 *         format: 'p0',
                 *
                 *         // getAggregateValue computes an aggregate from a summary row (Downloads, Sales)
                 *         getAggregateValue: row => row.Downloads ? row.Sales / row.Downloads : 0
                 *     },
                 *     {
                 *         header: 'Conversion (per raw data item)',
                 *         dataType: 'Number',
                 *         aggregate: 'Avg',
                 *         format: 'p0',
                 *
                 *         // getValue computes a raw value from a data item (downloads, sales)
                 *         getValue: item => item.downloads ? item.sales / item.downloads : 0
                 * },
                 * ```
                 *
                 * {@sample OLAP/PivotPanel/Fields/Customize/FieldSettingsDialog/Calculated Example}
                 */
                get: function () {
                    return this._getValueFn;
                },
                set: function (value) {
                    this._getValueFn = wijmo.asFunction(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "getAggregateValue", {
                /**
                 * Gets or sets a function to be used for retrieving the field's
                 * **aggregate** value for a given summary object.
                 *
                 * The default value for this property is **null**, causing the engine to
                 * use the field's {@link aggregate} and {@link showAs} properties to
                 * calculate the aggregate.
                 *
                 * If specified, the function should take a single parameter that
                 * represents the summary object generated by the engine and should return
                 * the aggregate value for the item.
                 *
                 * Notice the difference between the {@link getValue} property
                 * (a function that takes a raw data item and returns a raw value), and
                 * the {@link getAggregateValue} (a function that takes a summary object
                 * and returns an aggregate value):
                 *
                 * ```typescript
                 * fields: [
                 *     {
                 *         header: 'Conversion (per summary row)',
                 *         dataType: 'Number',
                 *         format: 'p0',
                 *
                 *         // getAggregateValue computes an aggregate from a summary row (Downloads, Sales)
                 *         // **NOTE**: for this formula to work, the "Downloads" and "Sales" fields must be
                 *         // present in the PivotEngine's valueFields array.
                 *         getAggregateValue: row => row.Downloads ? row.Sales / row.Downloads : 0
                 *     },
                 *     {
                 *         header: 'Conversion (per raw data item)',
                 *         dataType: 'Number',
                 *         aggregate: 'Avg',
                 *         format: 'p0',
                 *
                 *         // getValue computes a raw value from a data item (downloads, sales)
                 *         getValue: item => item.downloads ? item.sales / item.downloads : 0
                 * },
                 * ```
                 *
                 * {@sample OLAP/PivotPanel/Fields/Customize/FieldSettingsDialog/Calculated Example}
                 */
                get: function () {
                    return this._getAggValueFn;
                },
                set: function (value) {
                    this._getAggValueFn = wijmo.asFunction(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "header", {
                /**
                 * Gets or sets a string used to represent this field in the user
                 * interface.
                 *
                 * The default value for this property is a capitalized version of the
                 * {@link binding} value.
                 */
                get: function () {
                    return this._header;
                },
                set: function (value) {
                    value = wijmo.asString(value, false);
                    var fld = this._ng.fields.getField(value);
                    if (!value || (fld && fld != this)) {
                        wijmo.assert(false, 'field headers must be unique and non-empty.');
                    }
                    else {
                        this._setProp('_header', wijmo.asString(value));
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "filter", {
                /**
                 * Gets a reference to the {@link PivotFilter} used to filter values for this field.
                 *
                 * For measure fields in cube data sources, the filter is applied to aggregated
                 * cell values. For measure fields in non-cube data sources, the filter is
                 * applied to the raw data.
                 */
                get: function () {
                    return this._filter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "aggregate", {
                /**
                 * Gets or sets how the field should be summarized.
                 *
                 * The default value for this property is **Aggregate.Sum**
                 * for numeric fields, and **Aggregate.Count** for other
                 * field types.
                 */
                get: function () {
                    return this._aggregate;
                },
                set: function (value) {
                    this._setProp('_aggregate', wijmo.asEnum(value, wijmo.Aggregate));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "showAs", {
                /**
                 * Gets or sets a value that specifies how to display the aggregate
                 * value.
                 *
                 * Options for this property are defined by the {@link ShowAs} enumeration
                 * and include differences between the value and the one in the previous
                 * row or column, percentages over the row, column, or grand total, and
                 * running totals.
                 *
                 * This property is similar to the
                 * <a href="https://support.microsoft.com/en-us/office/show-different-calculations-in-pivottable-value-fields-014d2777-baaf-480b-a32b-98431f48bfec" target="_blank">Show Values As</a>
                 * feature in Excel.
                 *
                 * The default value for this property is **ShowAs.NoCalculation**.
                 */
                get: function () {
                    return this._showAs;
                },
                set: function (value) {
                    this._setProp('_showAs', wijmo.asEnum(value, olap.ShowAs));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "weightField", {
                /**
                 * Gets or sets the {@link PivotField} used as a weight for calculating
                 * aggregates on this field.
                 *
                 * If this property is set to null, all values are assumed to have weight one.
                 *
                 * This property allows you to calculate weighted averages and totals.
                 * For example, if the data contains a 'Quantity' field and a 'Price' field,
                 * you could use the 'Price' field as a value field and the 'Quantity' field as
                 * a weight. The output would contain a weighted average of the data.
                 */
                get: function () {
                    return this._weightField;
                },
                set: function (value) {
                    this._setProp('_weightField', wijmo.asType(value, PivotField, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "dataType", {
                /**
                 * Gets or sets the data type of the field.
                 */
                get: function () {
                    return this._dataType;
                },
                set: function (value) {
                    this._setProp('_dataType', wijmo.asEnum(value, wijmo.DataType));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "isMeasure", {
                /**
                 * Gets a value that indicates whether the field is a measure or
                 * a dimension.
                 *
                 * Measures are also known as 'facts'. They are typically numeric
                 * values that can be aggregated into summary statistics that convey
                 * information about the field.
                 *
                 * Dimensions are typically strings, dates, or boolean values that
                 * can be used to divide measures into categories.
                 */
                get: function () {
                    return this._dataType == wijmo.DataType.Number;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "subFields", {
                /**
                 * Gets this field's child fields.
                 */
                get: function () {
                    return this._subFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "format", {
                /**
                 * Gets or sets the format to use when displaying field values.
                 *
                 * The default value for this property is
                 * **"d"** for date fields, **"n0"** for numeric fields,
                 * and the empty string for other field types.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    this._setProp('_format', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "align", {
                /**
                 * Gets or sets the horizontal alignment of this field's cells.
                 *
                 * The default value for this property is null, which causes the grid to select
                 * the alignment automatically based on the fields's {@link dataType} (numbers are
                 * right-aligned, Boolean values are centered, and other types are left-aligned).
                 *
                 * If you want to override the default alignment, set this property
                 * to 'left', 'right', 'center', or 'justify'.
                 */
                get: function () {
                    return this._align;
                },
                set: function (value) {
                    this._setProp('_align', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "width", {
                /**
                 * Gets or sets the preferred width to be used for showing this
                 * field in user interface controls such as the {@link PivotGrid}.
                 */
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    this._setProp('_width', wijmo.asNumber(value, true, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "wordWrap", {
                /**
                 * Gets or sets a value that indicates whether the content of this
                 * field should be allowed to wrap within cells.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._wordWrap;
                },
                set: function (value) {
                    this._setProp('_wordWrap', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "descending", {
                /**
                 * Gets or sets a value that determines whether keys should be sorted
                 * in descending order for this field.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._descending ? true : false;
                },
                set: function (value) {
                    this._setProp('_descending', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether items in this field
                 * contain HTML content rather than plain text.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._isContentHtml;
                },
                set: function (value) {
                    this._setProp('_isContentHtml', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "visible", {
                /**
                 * Gets or sets a value indicating whether this field should be
                 * displayed in instances of the {@link PivotPanel} control.
                 *
                 * The default value for this property is **true**.
                 *
                 * Setting this property to false hides the field any {@link PivotPanel}
                 * controls, preventing users from adding, removing, or changing the
                 * the field position in the engine's view definition.
                 */
                get: function () {
                    return this._visible;
                },
                set: function (value) {
                    this._setProp('_visible', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "sortComparer", {
                /**
                 * Gets or sets a function used to compare values when sorting.
                 *
                 * If provided, the sort comparer function should take as parameters
                 * two values of any type, and should return -1, 0, or +1 to indicate
                 * whether the first value is smaller than, equal to, or greater than
                 * the second. If the sort comparer returns null, the standard built-in
                 * comparer is used.
                 *
                 * This {@link sortComparer} property allows you to use custom comparison
                 * algorithms that in some cases result in sorting sequences that are
                 * more consistent with user's expectations than plain string comparisons.
                 *
                 * The example below shows a typical use for the {@link sortComparer} property:
                 * <pre>// define list of products
                 * app.products = 'Wijmo,Aoba,Olap,Xuni'.split(',');
                 *
                 * // sort products by position in the 'app.products' array
                 * ng.viewDefinitionChanged.addHandler(function () {
                 *   var fld = ng.fields.getField('Product');
                 *   if (fld) {
                 *     fld.sortComparer = function (val1, val2) {
                 *       return app.products.indexOf(val1) - app.products.indexOf(val2);
                 *     }
                 *   }
                 * });</pre>
                 */
                get: function () {
                    return this._srtCmp;
                },
                set: function (value) {
                    if (value != this.sortComparer) {
                        this._srtCmp = wijmo.asFunction(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "engine", {
                /**
                 * Gets a reference to the {@link PivotEngine} that owns this {@link PivotField}.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} bound to this field.
                 */
                get: function () {
                    return this.engine ? this.engine.collectionView : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "isActive", {
                /**
                 * Gets or sets a value that determines whether this field is
                 * currently being used in the view.
                 *
                 * Setting this property to true causes the field to be added to the
                 * view's {@link PivotEngine.rowFields} or {@link PivotEngine.valueFields},
                 * depending on the field's data type.
                 */
                get: function () {
                    return this._getIsActive();
                },
                set: function (value) {
                    this._setIsActive(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "parentField", {
                /**
                 * Gets this field's parent field.
                 *
                 * When you drag the same field into the Values list multiple
                 * times, copies of the field are created so you can use the
                 * same binding with different parameters. The copies keep a
                 * reference to their parent fields.
                 */
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "key", {
                /**
                 * Gets the key for this {@link PivotField}.
                 *
                 * For regular fields, the key is the field's {@link header};
                 * for {@link CubePivotField} instances, the key is the
                 * field's {@link binding}.
                 */
                get: function () {
                    return this.header;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link propertyChanged} event.
             *
             * @param e {@link PropertyChangedEventArgs} that contains the property
             * name, old, and new values.
             */
            PivotField.prototype.onPropertyChanged = function (e) {
                this.propertyChanged.raise(this, e);
                this._ng._fieldPropertyChanged(this, e);
            };
            // ** implementation
            // update data type after initialization
            PivotField.prototype._updateDataType = function () {
                if (!this._dataType && this._ng && this._binding) {
                    var cv = this._ng.collectionView;
                    if (cv && cv.items.length) {
                        var item = cv.items[0];
                        this._dataType = wijmo.getType(this._binding.getValue(item));
                    }
                }
            };
            // extend _copy to handle subFields and filters
            PivotField.prototype._copy = function (key, value) {
                var _this = this;
                if (key == 'subFields') {
                    if (!this._subFields) {
                        this._subFields = [];
                    }
                    else {
                        this._subFields.splice(0, this._subFields.length);
                    }
                    if (value && value.length) {
                        value.forEach(function (subField) {
                            var fld = _this.engine._createField(subField, _this._autoGenerated);
                            _this._subFields.push(fld);
                        });
                    }
                    return true;
                }
                if (key == 'filter') { // TFS 455787
                    this._setFilterProxy(value);
                    return true;
                }
                return false;
            };
            // persist field filters
            PivotField.prototype._getFilterProxy = function () {
                var flt = this.filter;
                // condition filter (without inactive conditions)
                if (flt.conditionFilter.isActive) {
                    var cf = flt.conditionFilter, proxy = {
                        //filterType: 'condition',
                        condition1: { operator: cf.condition1.operator, value: cf.condition1.value },
                        and: cf.and,
                        condition2: { operator: cf.condition2.operator, value: cf.condition2.value }
                    };
                    if (!cf.condition1.isActive) {
                        delete proxy.condition1;
                    }
                    if (!cf.condition2.isActive) {
                        delete proxy.condition2;
                    }
                    return proxy;
                }
                // value filter
                if (flt.valueFilter.isActive) {
                    var vf = flt.valueFilter;
                    return {
                        //filterType: 'value',
                        filterText: vf.filterText,
                        showValues: vf.showValues
                    };
                }
                // no filter!
                wijmo.assert(false, 'inactive filters shouldn\'t be persisted.');
                return null;
            };
            PivotField.prototype._setFilterProxy = function (proxy) {
                var flt = this.filter, cf = flt.conditionFilter, vf = flt.valueFilter;
                // clear original filter
                flt.clear();
                // honor deprecated explicit filters (TFS 455787)
                if (proxy.conditionFilter) {
                    proxy = proxy.conditionFilter;
                }
                else if (proxy.valueFilter) {
                    proxy = proxy.valueFilter;
                }
                // apply proxy condition filter
                if (proxy.condition1) {
                    var pc1 = proxy.condition1;
                    var val = wijmo.changeType(pc1.value, this.dataType); //, this.format); // C1WEB-22625
                    cf.condition1.value = val ? val : pc1.value;
                    cf.condition1.operator = pc1.operator;
                    var pc2 = proxy.condition2;
                    if (pc2) {
                        var val_1 = wijmo.changeType(pc2.value, this.dataType); //, this.format); // C1WEB-22625
                        cf.condition2.value = val_1 ? val_1 : pc2.value;
                        cf.condition2.operator = pc2.operator;
                    }
                    if (wijmo.isBoolean(proxy.and)) {
                        cf.and = proxy.and;
                    }
                }
                // apply proxy value filter
                if (proxy.showValues) {
                    vf.filterText = proxy.filterText;
                    vf.showValues = proxy.showValues;
                }
            };
            // checks whether the field is currently in any view lists
            PivotField.prototype._getIsActive = function () {
                if (this._ng && !this._hasSubFields()) { // fields with child fields cannot be active
                    var lists = this._ng._viewLists;
                    for (var i = 0; i < lists.length; i++) {
                        if (lists[i].indexOf(this) > -1) { // TFS 214723
                            return true;
                        }
                    }
                }
                return false;
            };
            // adds or removes the field to a view list
            PivotField.prototype._setIsActive = function (value) {
                if (this._ng && !this._hasSubFields()) { // fields with child fields cannot be active
                    var isActive = this.isActive;
                    value = wijmo.asBoolean(value);
                    if (value != isActive) {
                        // add measures to value fields list, others to row fields list
                        if (value) {
                            if (this.isMeasure) {
                                this._ng.valueFields.push(this);
                            }
                            else {
                                this._ng.rowFields.push(this);
                            }
                        }
                        else {
                            // remove from view lists
                            var lists = this._ng._viewLists;
                            for (var i = 0; i < lists.length; i++) {
                                var list_1 = lists[i];
                                for (var f = 0; f < list_1.length; f++) {
                                    var fld = list_1[f];
                                    if (fld == this || fld.parentField == this) {
                                        list_1.removeAt(f);
                                        f--;
                                    }
                                }
                            }
                            // remove any copies from main list
                            var list = this._ng.fields;
                            for (var f = list.length - 1; f >= 0; f--) {
                                var fld = list[f];
                                if (fld.parentField == this) {
                                    list.removeAt(f);
                                    f--;
                                }
                            }
                        }
                    }
                }
            };
            // check whether this field has subfields
            PivotField.prototype._hasSubFields = function () {
                return this._subFields != null && this._subFields.length > 0;
            };
            // creates a clone with the same binding/properties and a unique header
            PivotField.prototype._clone = function () {
                // create clone
                var clone = new PivotField(this._ng, this.binding);
                this._ng._copyProps(clone, this, PivotField._props);
                clone._autoGenerated = true;
                clone._parent = this;
                // give it a unique header
                var hdr = this.header.replace(/\d+$/, '');
                for (var i = 2;; i++) {
                    var hdrn = hdr + i.toString();
                    if (this._ng.fields.getField(hdrn) == null) {
                        clone._header = hdrn;
                        break;
                    }
                }
                // done
                return clone;
            };
            // sets property value and notifies about the change
            PivotField.prototype._setProp = function (name, value, member) {
                var oldValue = this[name];
                if (value != oldValue) {
                    this[name] = value;
                    var e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
                    this.onPropertyChanged(e);
                }
            };
            // get field name (used for display)
            PivotField.prototype._getName = function () {
                return this.header || this.binding;
            };
            // get field value
            PivotField.prototype._getValue = function (item, formatted) {
                var bnd = this._binding, value = null;
                if (item) {
                    if (wijmo.isFunction(this._getValueFn)) {
                        value = this._getValueFn.call(this, item); // custom function
                    }
                    else if (this._ng.isServer) {
                        value = item[this.key]; // server value
                    }
                    else {
                        value = bnd._key ? item[bnd._key] : bnd.getValue(item); // binding
                    }
                }
                return !formatted || typeof (value) == 'string'
                    ? value // raw value
                    : wijmo.Globalize.format(value, this._format); // formatted value
            };
            // get field weight
            PivotField.prototype._getWeight = function (item) {
                var value = this._weightField
                    ? this._weightField._getValue(item, false)
                    : null;
                return wijmo.isNumber(value) ? value : null;
            };
            // serializable properties
            PivotField._props = [
                'dataType',
                'format',
                'width',
                'wordWrap',
                'aggregate',
                'showAs',
                'descending',
                'isContentHtml',
                'visible'
            ];
            return PivotField;
        }());
        olap.PivotField = PivotField;
        /**
         * Extends the {@link PivotField} class to represent a field in a server-based
         * cube data source.
         */
        var CubePivotField = /** @class */ (function (_super) {
            __extends(CubePivotField, _super);
            /**
             * Initializes a new instance of the {@link CubePivotField} class.
             *
             * @param engine {@link PivotEngine} that owns this field.
             * @param binding Property that this field is bound to.
             * @param header Header shown to identify this field (defaults to the binding).
             * @param options JavaScript object containing initialization data for the field.
             */
            function CubePivotField(engine, binding, header, options) {
                var _this = _super.call(this, engine, binding, header, options) || this;
                wijmo.assert(_this.dimensionType != null, 'CubePivotField objects must specify the field\'s dimensionType');
                return _this;
            }
            Object.defineProperty(CubePivotField.prototype, "header", {
                /**
                 * Gets or sets a string used to represent this field in the user interface.
                 */
                get: function () {
                    return this._header;
                },
                set: function (value) {
                    this._setProp('_header', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CubePivotField.prototype, "dimensionType", {
                /**
                 * Gets or sets the dimension type of the field.
                 */
                get: function () {
                    return this._dimensionType;
                },
                set: function (value) {
                    this._setProp('_dimensionType', wijmo.asEnum(value, DimensionType, false));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CubePivotField.prototype, "isMeasure", {
                /**
                 * Overridden to account for the dimension type.
                 */
                get: function () {
                    switch (this._dimensionType) {
                        case 1: // Measure
                        case 2: // Kpi
                        case 8: // Currency
                            return true;
                    }
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CubePivotField.prototype, "key", {
                /**
                 * Gets the key for this {@link CubePivotField}.
                 *
                 * For this type of field, the key is the field's {@link binding}.
                 */
                get: function () {
                    return this.binding;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // cube fields cannot be cloned
            CubePivotField.prototype._clone = function () {
                throw 'CubePivotField objects cannot be cloned';
            };
            return CubePivotField;
        }(PivotField));
        olap.CubePivotField = CubePivotField;
        /**
         * Defines the dimension type of a {@link CubePivotField}.
         */
        var DimensionType;
        (function (DimensionType) {
            /** Fields that contain categories used to summarize data. */
            DimensionType[DimensionType["Dimension"] = 0] = "Dimension";
            /** Fields that contain quantitative, numerical information. */
            DimensionType[DimensionType["Measure"] = 1] = "Measure";
            /** Calculations associated with a measure group used to evaluate business performance. */
            DimensionType[DimensionType["Kpi"] = 2] = "Kpi";
            /** Multidimensional Expression (MDX) that returns a set of dimension members. */
            DimensionType[DimensionType["NameSet"] = 3] = "NameSet";
            /** Provide supplementary information about dimension members. */
            DimensionType[DimensionType["Attribute"] = 4] = "Attribute";
            /** Used to categorize measures and improve the user browsing experience. */
            DimensionType[DimensionType["Folder"] = 5] = "Folder";
            /** Metadata that define relationships between two or more columns in a table. */
            DimensionType[DimensionType["Hierarchy"] = 6] = "Hierarchy";
            /** Dimension with time-based levels of granularity for analysis and reporting. */
            DimensionType[DimensionType["Date"] = 7] = "Date";
            /** Dimension whose attributes represent a list of currencies for financial reporting purposes. */
            DimensionType[DimensionType["Currency"] = 8] = "Currency";
        })(DimensionType = olap.DimensionType || (olap.DimensionType = {}));
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * The {@link Slicer} control provides a quick way to edit filters
         * applied to {@link PivotField} objects.
         *
         * It provides buttons the user can click to filter data based on
         * values and indicates the current filtering state, which makes
         * it easy to understand what is shown in filtered {@link PivotGrid}
         * and {@link PivotChart} controls.
         *
         * For example, when the user selects 'Smith' in a 'Salespersons'
         * field, only data that includes 'Smith' in that field will be
         * included in the output summary.
         *
         * {@link Slicer} controls are based on value filters.
         * To use them with server-based pivot engines, you must set the
         * {@link uniqueValues} property of the fields you want to filter on.
         * For example:
         *
         * ```typescript
         * // set Country field's unique values so we can use a slicer
         * // this is necessary only when using server-based pivot engines
         * var fld = ngCube.fields.getField('Country');
         * fld.filter.valueFilter.uniqueValues = 'Japan,Portugal,Russia,UK,US'.split(',');
         *
         * // show slicer
         * var slicer = new wijmo.olap.Slicer('#slicer', {
         *   field: fld,
         *   multiSelect: true
         * });
         * ```
         *
         * <a href="https://jsfiddle.net/Wijmo5/gh14feox/" target="_blank">Example</a>
         */
        var Slicer = /** @class */ (function (_super) {
            __extends(Slicer, _super);
            /**
             * Initializes a new instance of the {@link Slicer} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Slicer(element, options) {
                var _this = _super.call(this, element, null, wijmo.isIE() && !wijmo.isEdge()) || this;
                _this._hdr = null;
                _this._mSel = false;
                // work variables
                _this._updatingFilter = false;
                _this._propChanged = false;
                _this._fldPropChangeBnd = _this._fldPropChange.bind(_this);
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-slicer wj-nocheck wj-control wj-content', tpl, {
                    _root: 'root',
                    _divHdr: 'div-hdr',
                    _divHdrText: 'div-hdr-text',
                    _btnMSel: 'btn-msel',
                    _btnClear: 'btn-clear'
                });
                // globalization
                var ci = wijmo.culture.olap.Slicer, tt = new wijmo.Tooltip();
                wijmo.setAttribute(_this._btnMSel, 'aria-label', ci.multiSelect);
                wijmo.setAttribute(_this._btnClear, 'aria-label', ci.clearFilter);
                tt.setTooltip(_this._btnMSel, ci.multiSelect);
                tt.setTooltip(_this._btnClear, ci.clearFilter);
                // handle the clear button
                _this.addEventListener(_this._btnClear, 'click', function (e) {
                    _this._clear();
                });
                // handle the multi-select button
                _this.addEventListener(_this._btnMSel, 'click', function (e) {
                    _this.multiSelect = !_this.multiSelect;
                });
                // apply options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(Slicer.prototype, "field", {
                /**
                 * Gets or sets the {@link PivotField} being filtered by this {@link Slicer}.
                 *
                 * If the {@link PivotField} is not included in the current view definition,
                 * the {@link Slicer} will automatically add the field to the engine's
                 * {@link PivotEngine.filterFields} collection.
                 *
                 * If you want to remove the field from any {@link PivotPanel} controls so
                 * users cannot remove the field from the view definition, set the
                 * fields {@link PivotField.visible} property to false. The field will
                 * remain active, but will not be shown in any {@link PivotPanel} controls.
                 */
                get: function () {
                    return this._fld;
                },
                set: function (value) {
                    var _this = this;
                    if (value != this._fld) {
                        // dispose of old ListBox
                        if (this._divListBox) {
                            wijmo.removeChild(this._divListBox);
                            this._divListBox = null;
                            this._lbx.dispose();
                            this._lbx = null;
                        }
                        // dispose of old editor
                        if (this._edt) {
                            this._clear();
                            this._edt.dispose();
                        }
                        // dispose of old field
                        var fld_1 = this._fld;
                        if (fld_1) {
                            fld_1.filter.filterType = this._originalFilterType;
                            fld_1.filter.valueFilter.uniqueValues = this._uniqueValues;
                            fld_1.propertyChanged.removeHandler(this._fldPropChangeBnd);
                        }
                        // update the field
                        fld_1 = this._fld = wijmo.asType(value, olap.PivotField, true);
                        if (fld_1) {
                            // update filter type
                            this._originalFilterType = fld_1.filter.filterType;
                            fld_1.filter.filterType = wijmo.grid.filter.FilterType.Value;
                            // update unique values
                            var ng = fld_1.engine;
                            this._uniqueValues = fld_1.filter.valueFilter.uniqueValues;
                            if (ng.isServer && !this._uniqueValues) {
                                var arr = ng._getUniqueValues(fld_1);
                                fld_1.filter.valueFilter.uniqueValues = arr;
                            }
                            fld_1.propertyChanged.addHandler(this._fldPropChangeBnd);
                            // make sure the field is active
                            if (!fld_1.isActive) {
                                fld_1.engine.filterFields.push(fld_1);
                            }
                            // create the new value filter editor
                            var div = document.createElement('div');
                            this._edt = new wijmo.grid.filter.ValueFilterEditor(div, fld_1.filter.valueFilter);
                        }
                        // create the ListBox used to show the filter values
                        if (this._edt) {
                            this._divListBox = this._edt.hostElement.querySelector('.wj-listbox');
                            this._root.appendChild(this._divListBox);
                            this._lbx = wijmo.Control.getControl(this._divListBox);
                            this._lbx.checkedItemsChanged.addHandler(function (s, e) {
                                // honor multi-select setting: TFS 419926, 422508
                                if (!_this._propChanged) {
                                    var selectedItem = _this._lbx.selectedItem;
                                    if (!_this.multiSelect && selectedItem) {
                                        _this._mSel = true; // avoid infinite loop
                                        _this._lbx.checkedItems = [selectedItem];
                                        _this._mSel = false;
                                    }
                                }
                                // update the filter
                                if (_this._edt && fld_1) {
                                    _this._updateFilter();
                                    fld_1.engine.invalidate();
                                }
                            });
                        }
                        // done
                        this._updateHeader();
                        if (wijmo.isIE() && !wijmo.isEdge()) {
                            this.refresh();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slicer.prototype, "header", {
                /**
                 * Gets or sets the header string shown at the top of the {@link Slicer}.
                 *
                 * The default value for this property is **null**, which causes the
                 * {@link Slicer} to display the {@link field} header at the top of the
                 * {@link Slicer}.
                 */
                get: function () {
                    return this._hdr;
                },
                set: function (value) {
                    if (value != this._hdr) {
                        this._hdr = wijmo.asString(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slicer.prototype, "showHeader", {
                /**
                 * Gets or sets a value indicating whether the control displays the
                 * header area with the header string and multi-select/clear buttons.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._divHdr.style.display != 'none';
                },
                set: function (value) {
                    this._divHdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slicer.prototype, "showCheckboxes", {
                /**
                 * Gets or sets a value indicating whether the control displays
                 * checkboxes next to each item.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return !wijmo.hasClass(this.hostElement, 'wj-nocheck');
                },
                set: function (value) {
                    wijmo.toggleClass(this.hostElement, 'wj-nocheck', !wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slicer.prototype, "multiSelect", {
                /**
                 * Gets or sets a value that determines whether users should be allowed to
                 * select multiple values from the list.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._mSel;
                },
                set: function (value) {
                    this._mSel = wijmo.asBoolean(value);
                    wijmo.toggleClass(this._btnMSel, 'wj-state-active', this._mSel);
                },
                enumerable: true,
                configurable: true
            });
            // ** overrides
            // because IE doesn't support flexbox very well...
            Slicer.prototype.refresh = function (fullUpdate) {
                var _this = this;
                if (fullUpdate === void 0) { fullUpdate = true; }
                if (wijmo.isIE() && !wijmo.isEdge() && this.hostElement) {
                    setTimeout(function () {
                        wijmo.setCss(_this._lbx.hostElement, {
                            height: _this.hostElement.clientHeight - _this._divHdr.offsetHeight
                        });
                    });
                }
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // ** implementation
            // handle field property changes
            Slicer.prototype._fldPropChange = function (s, e) {
                this._propChanged = true;
                switch (e.propertyName) {
                    case 'header':
                        this._updateHeader();
                        break;
                    case 'format':
                    case 'binding':
                        s.filter.clear();
                        this._edt.updateEditor();
                        break;
                    case 'filter':
                        if (!this._updatingFilter) {
                            this._edt.updateEditor();
                        }
                        break;
                }
                this._propChanged = false;
            };
            // update the header text based on the header property and on the field
            Slicer.prototype._updateHeader = function () {
                var hdr = this._hdr;
                if (!hdr && this._fld != null) {
                    hdr = this._fld.header;
                }
                this._divHdrText.textContent = hdr;
            };
            // clear the filter and update the view
            Slicer.prototype._clear = function () {
                if (this._edt) {
                    this._edt.clearEditor(false); // TFS 368709
                    this._updateFilter();
                    this._fld.engine.invalidate();
                }
            };
            // update the filter and remember it's the Slicer updating it
            Slicer.prototype._updateFilter = function () {
                this._updatingFilter = true;
                this._edt.updateFilter();
                this._updatingFilter = false;
            };
            /**
             * Gets or sets the template used to instantiate {@link Slicer} controls.
             */
            Slicer.controlTemplate = '<div wj-part="root">' +
                '<div wj-part="div-hdr" class="wj-header">' +
                '<div wj-part="div-hdr-text"></div>' +
                '<button wj-part="btn-msel" class="wj-btn btn-msel" tabindex="-1">' +
                '<span class="wj-glyph">&#8801;</span>' +
                '</button>' +
                '<button wj-part="btn-clear" class="wj-btn btn-clear" tabindex="-1">' +
                '<span class="wj-glyph">&times;</span>' +
                '</button>' +
                '</div>' +
                '</div>';
            return Slicer;
        }(wijmo.Control));
        olap.Slicer = Slicer;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Context Menu for {@link PivotGrid} controls.
         */
        var _GridContextMenu = /** @class */ (function (_super) {
            __extends(_GridContextMenu, _super);
            /**
             * Initializes a new instance of the {@link _GridContextMenu} class.
             */
            function _GridContextMenu() {
                var _this = 
                // initialize the menu
                _super.call(this, document.createElement('div'), {
                    header: 'PivotGrid Context Menu',
                    displayMemberPath: 'text',
                    commandParameterPath: 'parm',
                    command: {
                        executeCommand: function (parm) {
                            _this._execute(parm);
                        },
                        canExecuteCommand: function (parm) {
                            return _this._canExecute(parm);
                        }
                    }
                }) || this;
                // finish initializing (after call to super)
                _this.itemsSource = _this._getMenuItems();
                // add a class to allow CSS customization
                wijmo.addClass(_this.dropDown, 'context-menu wj-olap-context-menu');
                return _this;
            }
            // refresh menu items in case culture changed
            _GridContextMenu.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this.itemsSource = this._getMenuItems();
                _super.prototype.refresh.call(this, fullUpdate);
            };
            /**
             * Attaches this context menu to a {@link PivotGrid} control.
             *
             * @param grid {@link PivotGrid} to attach this menu to.
             */
            _GridContextMenu.prototype.attach = function (grid) {
                var _this = this;
                wijmo.assert(grid instanceof olap.PivotGrid, 'Expecting a PivotGrid control...');
                var owner = grid.hostElement;
                owner.addEventListener('contextmenu', function (e) {
                    if (grid.customContextMenu) {
                        // prevent default context menu
                        e.preventDefault();
                        // select the item that was clicked
                        _this.owner = owner;
                        if (_this._selectField(e)) {
                            // show the context menu
                            var dropDown = _this.dropDown;
                            _this.selectedIndex = -1;
                            if (_this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                                wijmo.showPopup(dropDown, e);
                                _this.onIsDroppedDownChanged();
                                dropDown.focus();
                            }
                        }
                    }
                });
            };
            // ** implementation
            // select the item that was clicked before showing the context menu
            _GridContextMenu.prototype._selectField = function (e) {
                // assume we have no target field
                this._targetField = null;
                this._htDown = null;
                // find target field based on hit-testing
                var g = wijmo.Control.getControl(this.owner), ng = g.engine, valFields = ng.valueFields, colFields = ng.columnFields, ht = g.hitTest(e), ct = wijmo.grid.CellType;
                switch (ht.cellType) {
                    case ct.Cell:
                        g.select(ht.range);
                        this._targetField = valFields[ht.col % valFields.length];
                        this._htDown = ht;
                        break;
                    case ct.ColumnHeader:
                        this._targetField = ht.row < colFields.length
                            ? colFields[ht.row]
                            : valFields[ht.col % valFields.length];
                        break;
                    case ct.RowHeader:
                        this._targetField = g._colRowFields.get(ht.getColumn());
                        break;
                    case ct.TopLeft:
                        if (ht.row == ht.panel.rows.length - 1) {
                            this._targetField = g._colRowFields.get(ht.getColumn());
                        }
                        break;
                }
                // show the menu if we have a field
                return this._targetField != null;
            };
            // get the items used to populate the menu
            _GridContextMenu.prototype._getMenuItems = function () {
                // get items
                var items = [
                    { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field', parm: 'remove' },
                    { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' },
                    { text: '<div class="wj-separator"></div>' },
                    { text: '<div class="menu-icon">&#8981;</div>Show Detail...', parm: 'detail' }
                ];
                // localize items
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.parm) {
                        var text = wijmo.culture.olap._ListContextMenu[item.parm];
                        wijmo.assert(text, 'missing localized text for item ' + item.parm);
                        item.text = item.text.replace(/([^>]+$)/, text);
                    }
                }
                // return localized items
                return items;
            };
            // execute the menu commands
            _GridContextMenu.prototype._execute = function (parm) {
                var fld = this._targetField, g = wijmo.Control.getControl(this.owner), ng = g ? g.engine : null, ht = this._htDown;
                switch (parm) {
                    case 'remove':
                        ng.removeField(fld);
                        break;
                    case 'edit':
                        ng.editField(fld);
                        break;
                    case 'detail':
                        g.showDetail(ht.row, ht.col);
                        break;
                }
            };
            _GridContextMenu.prototype._canExecute = function (parm) {
                var fld = this._targetField, g = wijmo.Control.getControl(this.owner), ng = g ? g.engine : null, ht = this._htDown;
                // all commands need a field and and engine (TFS 466719)
                if (fld == null || ng == null) {
                    return false;
                }
                // check whether the command can be executed in the current context
                switch (parm) {
                    case 'remove':
                        return true;
                    case 'edit':
                        return ng.allowFieldEditing;
                    case 'detail':
                        return ht != null && !(fld instanceof olap.CubePivotField) && ng.valueFields.length > 0;
                }
                // all else is OK
                return true;
            };
            return _GridContextMenu;
        }(wijmo.input.Menu));
        olap._GridContextMenu = _GridContextMenu;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a collection of {@link PivotField} objects.
         */
        var PivotFieldCollection = /** @class */ (function (_super) {
            __extends(PivotFieldCollection, _super);
            /**
             * Initializes a new instance of the {@link PivotFieldCollection} class.
             *
             * @param engine {@link PivotEngine} that owns this {@link PivotFieldCollection}.
             */
            function PivotFieldCollection(engine) {
                var _this = _super.call(this) || this;
                _this._ng = engine;
                return _this;
            }
            Object.defineProperty(PivotFieldCollection.prototype, "maxItems", {
                //** object model
                /**
                 * Gets or sets the maximum number of fields allowed in this collection.
                 *
                 * This property is set to null by default, which means any number of items is allowed.
                 */
                get: function () {
                    return this._maxItems;
                },
                set: function (value) {
                    this._maxItems = wijmo.asInt(value, true, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFieldCollection.prototype, "engine", {
                /**
                 * Gets a reference to the {@link PivotEngine} that owns this {@link PivotFieldCollection}.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a field by key.
             *
             * @param key {@link PivotField.key} to look for.
             */
            PivotFieldCollection.prototype.getField = function (key) {
                return this._getField(this, key);
            };
            PivotFieldCollection.prototype._getField = function (fields, key) {
                for (var i = 0; i < fields.length; i++) {
                    // looking in main fields
                    var field = fields[i];
                    if (field.key == key) {
                        return field;
                    }
                    // and in subfields if present
                    if (field._hasSubFields()) {
                        field = this._getField(field.subFields, key);
                        if (field) {
                            return field;
                        }
                    }
                }
                // not found
                return null;
            };
            /**
             * Overridden to allow pushing fields by header.
             *
             * @param ...item One or more {@link PivotField} objects to add to the array.
             * @return The new length of the array.
             */
            PivotFieldCollection.prototype.push = function () {
                var item = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    item[_i] = arguments[_i];
                }
                var ng = this._ng;
                // loop through items adding them one by one
                for (var i = 0; item && i < item.length; i++) {
                    var fld = item[i];
                    // add fields by binding
                    if (wijmo.isString(fld)) {
                        fld = this == ng.fields
                            ? new olap.PivotField(ng, fld)
                            : ng.fields.getField(fld);
                    }
                    // should be a field now...
                    wijmo.assert(fld instanceof olap.PivotField, 'This collection must contain PivotField objects only.');
                    // field keys must be unique
                    // REVIEW: cube fields with children have no key...
                    if (fld.key && this.getField(fld.key)) {
                        wijmo.assert(false, 'PivotField keys must be unique.');
                        return -1;
                    }
                    // honor maxItems
                    if (this._maxItems != null && this.length >= this._maxItems) {
                        break;
                    }
                    // add to collection
                    _super.prototype.push.call(this, fld);
                }
                // done
                return this.length;
            };
            return PivotFieldCollection;
        }(wijmo.collections.ObservableArray));
        olap.PivotFieldCollection = PivotFieldCollection;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a tree of {@link _PivotField} objects.
         *
         * This class is used only for optimization. It reduces the number of
         * {@link _PivotKey} objects that have to be created while aggregating the
         * data.
         *
         * The optimization cuts the time required to summarize the data
         * to about half.
         */
        var _PivotNode = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link PivotNode} class.
             *
             * @param fields {@link PivotFieldCollection} that owns this node.
             * @param fieldCount Number of fields to take into account for this node.
             * @param valueFields {@link PivotFieldCollection} that contains the values for this node.
             * @param valueFieldIndex Index of the value to take into account for this node.
             * @param item First data item represented by this node.
             * @param parent Parent {@link _PivotField}.
             */
            function _PivotNode(fields, fieldCount, valueFields, valueFieldIndex, item, parent) {
                this._key = new olap._PivotKey(fields, fieldCount, valueFields, valueFieldIndex, item);
                this._nodes = {};
                this._parent = parent;
            }
            /**
             * Gets a child node from a parent node.
             *
             * @param fields {@link PivotFieldCollection} that owns this node.
             * @param fieldCount Number of fields to take into account for this node.
             * @param valueFields {@link PivotFieldCollection} that contains the values for this node.
             * @param valueFieldIndex Index of the value to take into account for this node.
             * @param item First data item represented by this node.
             */
            _PivotNode.prototype.getNode = function (fields, fieldCount, valueFields, valueFieldIndex, item) {
                var nd = this;
                for (var i = 0; i < fieldCount; i++) {
                    var key = fields[i]._getValue(item, true), child = nd._nodes[key];
                    if (!child) {
                        child = new _PivotNode(fields, i + 1, valueFields, valueFieldIndex, item, nd);
                        nd._nodes[key] = child;
                    }
                    nd = child;
                }
                if (valueFields && valueFieldIndex > -1) {
                    var key = valueFields[valueFieldIndex].header, child = nd._nodes[key];
                    if (!child) {
                        child = new _PivotNode(fields, fieldCount, valueFields, valueFieldIndex, item, nd);
                        nd._nodes[key] = child;
                    }
                    nd = child;
                }
                return nd;
            };
            Object.defineProperty(_PivotNode.prototype, "key", {
                /**
                 * Gets the {@link _PivotKey} represented by this {@link _PivotNode}.
                 */
                get: function () {
                    return this._key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotNode.prototype, "parent", {
                /**
                 * Gets the parent node of this node.
                 */
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotNode.prototype, "tree", {
                /**
                 * Gets the child items of this node.
                 */
                get: function () {
                    if (!this._tree) {
                        this._tree = new _PivotNode(null, 0, null, -1, null);
                    }
                    return this._tree;
                },
                enumerable: true,
                configurable: true
            });
            return _PivotNode;
        }());
        olap._PivotNode = _PivotNode;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a connection to a Pivot service.
         */
        var _ServerConnection = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link _ServerConnection} class.
             *
             * @param engine {@link PivotEngine} that owns this field.
             * @param url Url used to communicate with the server.
             */
            function _ServerConnection(engine, url) {
                this._ng = wijmo.asType(engine, olap.PivotEngine);
                wijmo.assert(this._isValidUrl(url), 'Invalid service Url: ' + url + ')');
            }
            /**
             * Gets a list of fields available on the server.
             */
            _ServerConnection.prototype.getFields = function () {
                var _this = this;
                var result = null;
                wijmo.httpRequest(this._getUrl('Fields'), {
                    async: false,
                    success: function (xhr) {
                        result = JSON.parse(xhr.responseText);
                        if (!wijmo.isArray(result)) {
                            console.error('Failed to get fields from server: ' + xhr.responseText);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError('Getting Fields', xhr);
                    }
                });
                return result;
            };
            /**
             * Gets an array with unique values for a given field.
             *
             * @param field The field for which to retrieve unique values.
             */
            _ServerConnection.prototype.getUniqueValues = function (field) {
                var _this = this;
                var result = null; // get unique values for a given field
                wijmo.httpRequest(this._getUrl('UniqueValues', null, field.header), {
                    method: 'POST',
                    async: false,
                    data: {
                        view: this._ng.viewDefinition
                    },
                    success: function (xhr) {
                        result = JSON.parse(xhr.responseText);
                        if (!wijmo.isArray(result)) {
                            console.error('Failed to get unique field values from server: ' + xhr.responseText);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError('Getting Unique Field Values', xhr);
                    }
                });
                return result;
            };
            /**
             * Gets the output view for the current view definition.
             *
             * @param callBack function invoked to handle the results.
             */
            _ServerConnection.prototype.getOutputView = function (callBack) {
                var _this = this;
                this.clearPendingRequests();
                this._sendHttpRequest('Analyses', {
                    method: 'POST',
                    data: {
                        view: this._ng.viewDefinition
                    },
                    success: function (xhr) {
                        var result = JSON.parse(xhr.responseText);
                        _this._token = result.token;
                        _this._start = Date.now();
                        _this._handleResult(result.status, callBack);
                    },
                    error: function (xhr) {
                        _this._handleError('Analyses', xhr);
                    }
                });
            };
            /**
             * Gets an array containing the data items that were used to calculate
             * an aggregated cell.
             *
             * @param rowKey Identifies the row that contains the aggregated cell.
             * @param colKey Identifies the column that contains the aggregated cell.
             */
            _ServerConnection.prototype.getDetail = function (rowKey, colKey) {
                var arr, keys = [], count = this._ng.rowFields.length, valueCount = rowKey ? rowKey.values.length : 0;
                // prepare the keys for rowFields.
                for (var i = 0; i < count; i++) {
                    if (i < valueCount) {
                        keys.push(_ServerConnection._getRequestedValue(rowKey.values[i]));
                    }
                    else {
                        keys.push(null);
                    }
                }
                // prepare the keys for columnFields.
                count = this._ng.columnFields.length;
                valueCount = colKey ? colKey.values.length : 0;
                for (var i = 0; i < count; i++) {
                    if (i < valueCount) {
                        keys.push(_ServerConnection._getRequestedValue(colKey.values[i]));
                    }
                    else {
                        keys.push(null);
                    }
                }
                // get details from server
                arr = new wijmo.collections.ObservableArray();
                this._loadArray('Detail', arr, {
                    method: 'POST',
                    view: this._ng.viewDefinition,
                    keys: keys,
                    max: this._ng.serverMaxDetail
                });
                // return ObservableArray (will be filled when the request returns)
                return arr;
            };
            /**
             * Returns a sorted array of PivotKey ids (if sortOnServer is true, the assumption is
             * that subtotal keys are returned by the server as if totalsBeforeData is also true).
             */
            _ServerConnection.prototype.getSortedKeys = function (obj, isRow) {
                var _this = this;
                var keys = Object.keys(obj);
                if (!this._ng.sortOnServer) {
                    keys.sort(function (id1, id2) {
                        return _this._ng._keys[id1].compareTo(_this._ng._keys[id2]);
                    });
                }
                else if (keys.length > 1) {
                    var hierarchy_1 = {}, result = [], sorted = [];
                    keys.forEach(function (key) {
                        _this._insertKey(hierarchy_1, key, isRow);
                    });
                    this._reorderKeys(hierarchy_1, null, null, result, isRow);
                    if (!isRow && this._ng.valueFields.length > 1) {
                        var skip = result.length / this._ng.valueFields.length;
                        var count = result.length / skip;
                        for (var i = 0; i < skip; i++) {
                            for (var j = 0; j < count; j++) {
                                sorted.push(result[i + (j * skip)]);
                            }
                        }
                        return sorted;
                    }
                    return result;
                }
                return keys;
            };
            // convert the value to a requested one.
            _ServerConnection._getRequestedValue = function (value) {
                // as the client always has the time zone format for a date value 
                // and the server doesn't consider the time zone,
                // we need to remove the time zone information before sending it to the server.
                if (wijmo.isDate(value)) {
                    var date = value;
                    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
                }
                return value;
            };
            /**
             * Cancels any pending requests.
             */
            _ServerConnection.prototype.clearPendingRequests = function () {
                this._clearRequest();
                this._clearTimeout();
                this._clearToken(); // must be last to avoid aborting the clear command
            };
            /**
             * Creates fake tallies based on aggregated data returned from the server
             *
             * @param aggregatedData Array containing the data aggregates returned
             * by the server.
             */
            _ServerConnection.prototype.updateTallies = function (aggregatedData) {
                var _this = this;
                var ng = this._ng, rfCount = ng.rowFields.length, cfCount = ng.columnFields.length, vfCount = ng.valueFields.length, rowNodes = new olap._PivotNode(ng.rowFields, 0, null, -1, null);
                aggregatedData.forEach(function (item, index, arr) {
                    var count = _this._getAggregatedFieldCount(item, ng.rowFields), nd = rowNodes.getNode(ng.rowFields, rfCount - count, null, -1, item), rowKey = nd.key, rowKeyId = rowKey.toString(null), rowTallies = ng._tallies[rowKeyId];
                    if (!rowTallies) {
                        ng._keys[rowKeyId] = rowKey;
                        ng._tallies[rowKeyId] = rowTallies = {};
                    }
                    count = _this._getAggregatedFieldCount(item, ng.columnFields);
                    for (var k = 0; k < vfCount; k++) {
                        var colNodes = nd.tree.getNode(ng.columnFields, cfCount - count, ng.valueFields, k, item), colKey = colNodes.key, colKeyId = colKey.toString(), vf = ng.valueFields[k];
                        // because the response data is already aggregated,
                        // the tally must be unique, and the cell values
                        // must be retrieved from the header rather than 
                        // from the binding.
                        var tally = rowTallies[colKeyId];
                        if (!tally) {
                            ng._keys[colKeyId] = colKey;
                            tally = rowTallies[colKeyId] = new _ServerTally();
                            tally.add(_this._getFieldValue(vf, item, false));
                        }
                    }
                });
            };
            // get value based on header rather than value
            _ServerConnection.prototype._getFieldValue = function (vf, item, formatted) {
                var value = item[vf.key];
                return !formatted || typeof (value) == 'string' // optimization
                    ? value
                    : wijmo.Globalize.format(value, vf.format);
            };
            // ** implementation
            // gets the length of a PivotKey
            _ServerConnection.prototype._getKeyLength = function (key, isRow) {
                return key.split(";").length - (isRow ? 1 : 2);
            };
            // insert PivotKey into the object hierarchy
            _ServerConnection.prototype._insertKey = function (root, key, isRow) {
                var parts = key.split(";");
                if (!isRow) {
                    parts.pop();
                }
                if (parts.length == 1) {
                    root[parts.pop()] = {};
                }
                else {
                    var last = parts.pop();
                    var level = root[last];
                    if (!level) {
                        root[last] = level = {};
                    }
                    while (parts.length > 0) {
                        var first = parts.shift();
                        if (!level[first]) {
                            level[first] = {};
                        }
                        level = level[first];
                    }
                }
            };
            // construct composite key name
            _ServerConnection.prototype._joinKeys = function (key, prefix, suffix) {
                if (prefix && suffix) {
                    return [prefix, key, suffix].join(";");
                }
                else if (suffix) {
                    return [key, suffix].join(";");
                }
                else {
                    return key;
                }
            };
            // reorder PivotKeys based on value of totalsBeforeData
            _ServerConnection.prototype._reorderKeys = function (root, prefix, suffix, keys, isRow) {
                var _this = this;
                Object.keys(root).forEach(function (key) {
                    var total = _this._joinKeys(key, prefix, suffix);
                    var subs = isRow ? _this._ng.showRowTotals : _this._ng.showColumnTotals;
                    var length = Object.keys(root[key]).length;
                    var include = (!prefix && !suffix && subs !== olap.ShowTotals.None) || (!prefix && !length) || prefix || subs === olap.ShowTotals.Subtotals;
                    if (!isRow) {
                        total = total + ";";
                    }
                    if (_this._ng.totalsBeforeData && include) {
                        keys.push(total);
                    }
                    if (!suffix) {
                        _this._reorderKeys(root[key], null, key, keys, isRow);
                    }
                    else if (!prefix) {
                        _this._reorderKeys(root[key], key, suffix, keys, isRow);
                    }
                    else {
                        _this._reorderKeys(root[key], [prefix, key].join(";"), suffix, keys, isRow);
                    }
                    if (!_this._ng.totalsBeforeData && include) {
                        keys.push(total);
                    }
                });
            };
            // gets the parent of a PivotKey
            _ServerConnection.prototype._getParentKey = function (key, isRow) {
                var parts = key.split(";");
                if (isRow) {
                    parts.splice(parts.length - 2, 1);
                }
                else {
                    parts.splice(0, parts.length - 2);
                }
                return parts.join(";");
            };
            // count null properties in an item (to determine subtotal level)
            _ServerConnection.prototype._getAggregatedFieldCount = function (item, fields) {
                var fieldCount = fields.length, count = 0;
                for (var i = 0; i < fieldCount; i++) {
                    var field = fields[i];
                    if (this._getFieldValue(field, item, false) == null) {
                        count++;
                    }
                }
                return count;
            };
            // load an array in chunks
            _ServerConnection.prototype._loadArray = function (command, arr, data) {
                var _this = this;
                // load the first 100 items by default
                if (!data) {
                    data = {};
                }
                if (data.skip == null) {
                    data.skip = 0;
                }
                if (data.top == null) {
                    data.top = 100;
                }
                var max = wijmo.isNumber(data.max) ? data.max : 1000000;
                // make the request
                this._request = wijmo.httpRequest(this._getUrl(command), {
                    data: data,
                    method: data.method || 'GET',
                    success: function (xhr) {
                        var result = JSON.parse(xhr.responseText);
                        // add results to the array
                        arr.deferUpdate(function () {
                            result.value.forEach(function (item) {
                                arr.push(item);
                            });
                        });
                        // continue loading
                        if (result.value.length == data.top && arr.length < max) {
                            data.skip += data.top;
                            _this._loadArray(command, arr, data);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError(command, xhr);
                    }
                });
            };
            // gets a URL with a FlexPivotEngine command request
            _ServerConnection.prototype._getUrl = function (command, token, fieldName) {
                if (token === void 0) { token = this._token; }
                var url = this._ng.itemsSource.toString(), pos = url.lastIndexOf('/'), urlStart = url.substr(0, pos);
                command = command.toLowerCase();
                switch (command) {
                    case 'rawdata':
                    case 'detail':
                        return url;
                    case 'fields':
                    case 'analyses':
                        return url + '/' + command;
                    case 'clear':
                        return url + '/analyses/' + token + '/';
                    case 'result':
                    case 'status':
                        return url + '/analyses/' + token + '/' + command;
                    case 'uniquevalues':
                        return url + '/fields/' + fieldName + '/' + command;
                }
                wijmo.assert(false, 'Unrecognized command');
            };
            // tests whether a string looks like a valid itemsSource url
            _ServerConnection.prototype._isValidUrl = function (url) {
                var a = document.createElement('a');
                a.href = wijmo.asString(url);
                a.href = a.href; // resolve protocol if using partial URLs in IE11
                return a.protocol && a.hostname && a.pathname && // need these
                    url[url.length - 1] != '/'; // should end with table name
            };
            // handle result of analysis status
            _ServerConnection.prototype._handleResult = function (result, callBack) {
                var _this = this;
                switch (result.executingStatus.toLowerCase()) {
                    // executing? wait and try again
                    case 'executing':
                    case 'notset':
                        // enforce timeout
                        if (Date.now() - this._start > this._ng.serverTimeout) {
                            this._handleError('Analyses', {
                                status: 500,
                                statusText: 'Analysis timed out',
                            });
                            return;
                        }
                        // progress report
                        this._progress = result.progress;
                        this._ng.onUpdatingView(new olap.ProgressEventArgs(this._progress));
                        // repeat...
                        this._clearTimeout();
                        this._toGetStatus = setTimeout(function () {
                            _this._waitUntilComplete(callBack);
                        }, this._ng.serverPollInterval);
                        break;
                    // completed? get the data
                    case 'completed':
                        this._progress = 100;
                        this._ng.onUpdatingView(new olap.ProgressEventArgs(this._progress));
                        this._getResults(callBack);
                        break;
                    // exception? get the exception from Result command
                    case 'exception':
                        this._getResults(callBack);
                        break;
                    // anything else is an error...
                    default:
                        this._handleError('Analyses', {
                            status: 500,
                            statusText: 'Unexpected result...',
                        });
                        break;
                }
            };
            // keep calling the server until the current task is complete,
            // then invoke the given callBack
            _ServerConnection.prototype._waitUntilComplete = function (callBack) {
                var _this = this;
                this._sendHttpRequest('Status', {
                    success: function (xhr) {
                        var result = JSON.parse(xhr.responseText);
                        _this._handleResult(result, callBack);
                    },
                    error: function (xhr) {
                        _this._handleError('Status', xhr);
                    }
                });
            };
            // get results when server is ready
            _ServerConnection.prototype._getResults = function (callBack) {
                var _this = this;
                this._sendHttpRequest('Result', {
                    success: function (xhr) {
                        // once the aggregated result is returned,
                        // the analysis is removed as it is useless.
                        _this._clearToken();
                        var result = JSON.parse(xhr.responseText);
                        wijmo.assert(wijmo.isArray(result), 'Result array Expected.');
                        // parse date/time strings returned from the service
                        var dateFields = [];
                        _this._ng._viewLists.forEach(function (item) {
                            dateFields = dateFields.concat(item.filter(function (field) {
                                return field.dataType == wijmo.DataType.Date;
                            }));
                        });
                        if (dateFields.length > 0) {
                            result.forEach(function (dataItem) {
                                dateFields.forEach(function (dateField) {
                                    var bnd = dateField._binding, value = bnd.getValue(dataItem);
                                    if (wijmo.isString(value)) {
                                        bnd.setValue(dataItem, new Date(value));
                                    }
                                });
                            });
                        }
                        // go handle the results
                        wijmo.asFunction(callBack)(result);
                    },
                    error: function (xhr) {
                        _this._handleError('Result', xhr);
                    }
                });
            };
            // raise error event and throw if not handled
            _ServerConnection.prototype._handleError = function (msg, xhr) {
                this.clearPendingRequests();
                msg = '** HttpRequest error on command "' + msg + '"';
                if (this._ng.onError(new wijmo.RequestErrorEventArgs(xhr, msg))) {
                    this._throwResponseError(msg, xhr);
                }
            };
            // make httpRequest and save the request object so we can cancel it
            _ServerConnection.prototype._sendHttpRequest = function (command, settings) {
                var url = this._getUrl(command);
                this._request = wijmo.httpRequest(url, settings);
            };
            // throw the error information if it is not processed.
            _ServerConnection.prototype._throwResponseError = function (msg, xhr) {
                msg = msg + '\r\n' +
                    xhr.status + '\r\n';
                var errText = xhr.responseText || '';
                if (xhr.status == 500) {
                    // show the meaningful exception message
                    if (xhr.responseText) {
                        var oRes = JSON.parse(xhr.responseText);
                        errText = oRes['ExceptionMessage'];
                    }
                }
                // if no responseText, use statusText instead.
                msg += errText || xhr.statusText;
                throw msg;
            };
            // clear the analysis token
            _ServerConnection.prototype._clearToken = function () {
                if (this._token) {
                    this._clearRequest();
                    this._clearTimeout();
                    this._sendHttpRequest('Clear', {
                        method: 'DELETE'
                    });
                    this._token = null;
                }
            };
            // abort and clear the http request
            _ServerConnection.prototype._clearRequest = function () {
                if (this._request && this._request.readyState != 4) {
                    this._request.abort();
                    this._request = null;
                }
            };
            // clear the timer object
            _ServerConnection.prototype._clearTimeout = function () {
                if (this._toGetStatus) {
                    clearTimeout(this._toGetStatus);
                    this._toGetStatus = null;
                }
            };
            _ServerConnection._TIMEOUT = 1000 * 60; // quit after 60 seconds (server hung?)
            _ServerConnection._POLL_INTERVAL = 500; // poll state every 500ms
            _ServerConnection._MAXDETAIL = 1000; // show up to 1k detail records
            return _ServerConnection;
        }());
        olap._ServerConnection = _ServerConnection;
        // fake tally to report server aggregates
        var _ServerTally = /** @class */ (function (_super) {
            __extends(_ServerTally, _super);
            function _ServerTally() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _ServerTally.prototype.add = function (value, weight) {
                wijmo.assert(this._cnt == 0, 'Server tallies have a single value.');
                this._aggregatedValue = value;
            };
            _ServerTally.prototype.getAggregate = function (aggregate) {
                return this._aggregatedValue; // server tallies have a single value
            };
            return _ServerTally;
        }(olap._Tally));
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        // globalization
        wijmo._addCultureInfo('olap', {
            PivotEngine: {
                grandTotal: 'Grand Total',
                subTotal: 'Subtotal'
            },
            PivotPanel: {
                fields: 'Choose fields to add to report:',
                drag: 'Drag fields between areas below:',
                filters: 'Filters',
                cols: 'Columns',
                rows: 'Rows',
                vals: 'Values',
                defer: 'Defer Updates',
                update: 'Update'
            },
            PivotFieldEditor: {
                dialogHeader: 'Field settings:',
                header: 'Header:',
                summary: 'Summary:',
                showAs: 'Show As:',
                weighBy: 'Weigh by:',
                sort: 'Sort:',
                filter: 'Filter:',
                format: 'Format:',
                sample: 'Sample:',
                edit: 'Edit...',
                clear: 'Clear',
                ok: 'OK',
                cancel: 'Cancel',
                none: '(none)',
                sorts: {
                    asc: 'Ascending',
                    desc: 'Descending'
                },
                aggs: {
                    sum: 'Sum',
                    cnt: 'Count',
                    avg: 'Average',
                    max: 'Max',
                    min: 'Min',
                    rng: 'Range',
                    std: 'StdDev',
                    var: 'Var',
                    stdp: 'StdDevPop',
                    varp: 'VarPop',
                    first: 'First',
                    last: 'Last'
                },
                calcs: {
                    noCalc: 'No calculation',
                    dRow: 'Difference from previous row',
                    dRowPct: '% Difference from previous row',
                    dCol: 'Difference from previous column',
                    dColPct: '% Difference from previous column',
                    dPctGrand: '% of grand total',
                    dPctRow: '% of row total',
                    dPrevRow: '% of value in the previous row',
                    dPctCol: '% of column total',
                    dPrevCol: '% of value in the previous column',
                    dRunTot: 'Running total',
                    dRunTotPct: '% running total'
                },
                formats: {
                    n0: 'Integer (n0)',
                    n2: 'Float (n2)',
                    c: 'Currency (c)',
                    p0: 'Percentage (p0)',
                    p2: 'Percentage (p2)',
                    n2c: 'Thousands (n2,)',
                    n2cc: 'Millions (n2,,)',
                    n2ccc: 'Billions (n2,,,)',
                    d: 'Date (d)',
                    MMMMddyyyy: 'Month Day Year (MMMM dd, yyyy)',
                    dMyy: 'Day Month Year (d/M/yy)',
                    ddMyy: 'Day Month Year (dd/M/yy)',
                    dMyyyy: 'Day Month Year (dd/M/yyyy)',
                    MMMyyyy: 'Month Year (MMM yyyy)',
                    MMMMyyyy: 'Month Year (MMMM yyyy)',
                    yyyy: 'Year (yyyy)',
                    yyyyQq: 'Year Quarter (yyyy "Q"q)',
                    FYEEEEQU: 'Fiscal Year Quarter ("FY"EEEE "Q"U)'
                }
            },
            _ListContextMenu: {
                up: 'Move Up',
                down: 'Move Down',
                first: 'Move to Beginning',
                last: 'Move to End',
                filter: 'Move to Report Filter',
                rows: 'Move to Row Labels',
                cols: 'Move to Column Labels',
                vals: 'Move to Values',
                remove: 'Remove Field',
                edit: 'Field Settings...',
                detail: 'Show Detail...'
            },
            DetailDialog: {
                header: 'Detail View:',
                ok: 'OK',
                items: '{cnt:n0} items',
                item: '{cnt} item',
                row: 'Row',
                col: 'Column'
            },
            PivotChart: {
                by: 'by',
                and: 'and'
            },
            Slicer: {
                multiSelect: 'Multi-Select',
                clearFilter: 'Clear Filter'
            }
        });
        /**
         * Specifies constants that define whether to include totals in the output table.
         */
        var ShowTotals;
        (function (ShowTotals) {
            /**
             * Do not show any totals.
             */
            ShowTotals[ShowTotals["None"] = 0] = "None";
            /**
             * Show grand totals.
             */
            ShowTotals[ShowTotals["GrandTotals"] = 1] = "GrandTotals";
            /**
             * Show subtotals and grand totals.
             */
            ShowTotals[ShowTotals["Subtotals"] = 2] = "Subtotals";
        })(ShowTotals = olap.ShowTotals || (olap.ShowTotals = {}));
        /**
         * Specifies constants that define calculations to be applied to cells in the output view.
         */
        var ShowAs;
        (function (ShowAs) {
            /**
             * Show plain aggregated values.
             */
            ShowAs[ShowAs["NoCalculation"] = 0] = "NoCalculation";
            /**
             * Show differences between each item and the item in the previous row.
             */
            ShowAs[ShowAs["DiffRow"] = 1] = "DiffRow";
            /**
             * Show differences between each item and the item in the previous row as a percentage.
             */
            ShowAs[ShowAs["DiffRowPct"] = 2] = "DiffRowPct";
            /**
             * Show differences between each item and the item in the previous column.
             */
            ShowAs[ShowAs["DiffCol"] = 3] = "DiffCol";
            /**
             * Show differences between each item and the item in the previous column as a percentage.
             */
            ShowAs[ShowAs["DiffColPct"] = 4] = "DiffColPct";
            /**
             * Show values as a percentage of the grand totals for the field.
             */
            ShowAs[ShowAs["PctGrand"] = 5] = "PctGrand";
            /**
             * Show values as a percentage of the row totals for the field.
             */
            ShowAs[ShowAs["PctRow"] = 6] = "PctRow";
            /**
             * Show values as a percentage of the column totals for the field.
             */
            ShowAs[ShowAs["PctCol"] = 7] = "PctCol";
            /**
             * Show values as running totals.
             */
            ShowAs[ShowAs["RunTot"] = 8] = "RunTot";
            /**
             * Show values as percentage running totals.
             */
            ShowAs[ShowAs["RunTotPct"] = 9] = "RunTotPct";
            /**
             * Show values for each item as a percentage of the value in the previous row.
             */
            ShowAs[ShowAs["PctPrevRow"] = 10] = "PctPrevRow";
            /**
             * Show values for each item as a percentage of the value in the previous column.
             */
            ShowAs[ShowAs["PctPrevCol"] = 11] = "PctPrevCol";
        })(ShowAs = olap.ShowAs || (olap.ShowAs = {}));
        /**
         * Provides a user interface for interactively transforming regular data tables into Olap
         * pivot tables.
         *
         * Tabulates data in the {@link itemsSource} collection according to lists of fields and
         * creates the {@link pivotView} collection containing the aggregated data.
         *
         * Pivot tables group data into one or more dimensions. The dimensions are represented
         * by rows and columns on a grid, and the data is stored in the grid cells.
         */
        var PivotEngine = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link PivotEngine} class.
             *
             * @param options JavaScript object containing initialization data for the field.
             */
            function PivotEngine(options) {
                this._autoGenFields = true;
                this._allowFieldEditing = true;
                this._showRowTotals = ShowTotals.GrandTotals;
                this._showColTotals = ShowTotals.GrandTotals;
                this._totalsBefore = false;
                this._sortableGroups = true;
                this._showZeros = false;
                this._updating = 0;
                this._xValueSearch = true;
                this._async = true;
                this._sortOnServer = false;
                this._cntTotal = 0;
                this._cntFiltered = 0;
                this._serverParms = {
                    timeout: olap._ServerConnection._TIMEOUT,
                    pollInterval: olap._ServerConnection._POLL_INTERVAL,
                    maxDetail: olap._ServerConnection._MAXDETAIL,
                };
                /**
                 * Occurs after the value of the {@link itemsSource} property changes.
                 */
                this.itemsSourceChanged = new wijmo.Event();
                /**
                 * Occurs after the view definition changes.
                 */
                this.viewDefinitionChanged = new wijmo.Event();
                /**
                 * Occurs when the engine starts updating the {@link pivotView} list.
                 */
                this.updatingView = new wijmo.Event();
                /**
                 * Occurs after the engine has finished updating the {@link pivotView} list.
                 */
                this.updatedView = new wijmo.Event();
                /**
                 * Occurs when there is an error getting data from the server.
                 */
                this.error = new wijmo.Event();
                this._isUpdatingChanged = new wijmo.Event();
                // create output view
                this._pivotView = new olap.PivotCollectionView(this);
                // create main field list
                this._fields = new olap.PivotFieldCollection(this);
                // create pivot field lists
                this._rowFields = new olap.PivotFieldCollection(this);
                this._columnFields = new olap.PivotFieldCollection(this);
                this._valueFields = new olap.PivotFieldCollection(this);
                this._filterFields = new olap.PivotFieldCollection(this);
                // create array of pivot field lists
                this._viewLists = [
                    this._rowFields, this._columnFields, this._valueFields, this._filterFields
                ];
                // listen to changes in the field lists
                var handler = this._fieldListChanged.bind(this);
                this._fields.collectionChanged.addHandler(handler);
                this._viewLists.forEach(function (list) {
                    list.collectionChanged.addHandler(handler);
                });
                // let the component choose the filter type automatically
                this._defaultFilterType = null;
                // apply initialization options
                wijmo.copy(this, options);
            }
            Object.defineProperty(PivotEngine.prototype, "itemsSource", {
                // ** object model
                /**
                 * Gets or sets the array or {@link ICollectionView} that contains the
                 * raw data to be analyzed, an object describing an SSAS cube service,
                 * or a string containing the URL for a ComponentOne DataEngine
                 * service.
                 *
                 * The first option (using an array or {@link ICollectionView}) is the
                 * simplest, but it limits the amount of raw data you can handle.
                 * Loading the raw data into an array can take a long time if the
                 * data set contains more than about 50,000 items or so.
                 *
                 * To use this option, simply set the {@link itemsSource} property to
                 * any JavaScript array containing the raw data to be analyzed.
                 * For example:
                 *
                 * ```typescript
                 * import { PivotEngine } from '@grapecity/wijmo.olap';
                 * let ng = PivotEngine({
                 *     itemsSource = getDataArray(1000);
                 * });
                 * ```
                 *
                 * The second option (direct connection to OLAP SSAS cubes) allows
                 * the {@link PivotEngine} to connect directly to OLAP cubes provided
                 * by SSAS servers. This option removes the size limitations mentioned
                 * above and allows you to analyze data sets with millions or billions
                 * of records.
                 *
                 * To use this option, set the {@link itemsSource} property to an object
                 * that specifies how the component should access the service. For example:
                 *
                 * ```typescript
                 * import { PivotEngine } from '@grapecity/wijmo.olap';
                 * let ng = PivotEngine({
                 *     itemsSource: {
                 *         url: 'http://ssrs.componentone.com/OLAP/msmdpump.dll',
                 *         cube: 'Adventure Works',
                 *         catalog: 'AdventureWorksDW2012Multidimensional'
                 *     }
                 * });
                 * ```
                 *
                 * The **catalog** property is optional, but **url** and **cube** are required.
                 *
                 * The preceding example works with SSAS servers that allow anonymous
                 * access. For servers that require Basic Authentication, you should
                 * also include the appropriate **user** and **password** members
                 * as part of the {@link itemsSource} object.
                 *
                 * When connecting directly to OLAP SSAS cubes, users will not be able
                 * to filter fields by value. They will still be able to filter by
                 * condition.
                 *
                 * The third option, ComponentOne data engine services, allows you to
                 * analyze large datasets on a server without downloading the raw data
                 * to the client. You can use our high-performance FlexPivot services
                 * or interface with Microsoft's SQL Server Analysis Services
                 * OLAP Cubes.
                 *
                 * To use ComponentOne data engine services, set the {@link itemsSource}
                 * property to a string containing the URL of the data service.
                 * For example:
                 *
                 * ```typescript
                 * import { PivotEngine } from '@grapecity/wijmo.olap';
                 * let ng = new wijmo.olap.PivotEngine({
                 *     itemsSource: 'http://demos.componentone.com/ASPNET/c1webapi/4.5.20193.222/api/dataengine/cube'
                 * });
                 * ```
                 *
                 * The {@link PivotEngine} sends view definitions to the server,
                 * where summaries are calculated and returned to the client.
                 *
                 * When connecting ComponentOne DataEngine data sources, users
                 * will not be able to filter fields by value. They will still
                 * be able to filter by condition.
                 *
                 * For more information about the ComponentOne DataEngine
                 * services please refer to the
                 * <a href="http://helpcentral.componentone.com/nethelp/C1WebAPI/APIDataEngine.html" target="_blank">online documentation</a>.
                 *
                 * Our <a href="https://demos.wijmo.com/5/SampleExplorer/SampleExplorer/Sample/OlapServerIntro" target="_blank">OlapServerIntro</a>
                 * sample shows all options working with a single {@link PivotEngine}.
                 */
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var _this = this;
                    if (this._items != value) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }
                        // dispose of server
                        if (this._server) {
                            this._server.clearPendingRequests();
                            this._server = null;
                        }
                        // save new data source and collection view (or server url)
                        this._items = value;
                        if (wijmo.isString(value)) {
                            this._server = new olap._ServerConnection(this, value);
                        }
                        else if (wijmo.isObject(value) && !wijmo.tryCast(value, 'ICollectionView')) {
                            this._server = new olap._SqlServerConnection(this, value);
                        }
                        else {
                            this._cv = wijmo.asCollectionView(value);
                        }
                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }
                        // auto-generate fields and refresh
                        this.deferUpdate(function () {
                            if (_this.autoGenerateFields) {
                                _this._generateFields();
                            }
                            _this._updateFieldTypes();
                        });
                        // raise itemsSourceChanged
                        this.onItemsSourceChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "isServer", {
                /**
                 * Gets a value that determines whether the engine is bound to a server
                 * {@link itemsSource} or is using local data.
                 */
                get: function () {
                    return this._server != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} that contains the raw data.
                 */
                get: function () {
                    return this._cv;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "pivotView", {
                /**
                 * Gets the {@link ICollectionView} containing the output pivot view.
                 */
                get: function () {
                    return this._pivotView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "showRowTotals", {
                /**
                 * Gets or sets a value that determines whether the output {@link pivotView}
                 * should include rows containing subtotals or grand totals.
                 *
                 * The default value for this property is **ShowTotals.GrandTotals**.
                 */
                get: function () {
                    return this._showRowTotals;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, ShowTotals);
                    if (value != this.showRowTotals) {
                        this._showRowTotals = value;
                        this.onViewDefinitionChanged();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "showColumnTotals", {
                /**
                 * Gets or sets a value that determines whether the output {@link pivotView}
                 * should include columns containing subtotals or grand totals.
                 *
                 * The default value for this property is **ShowTotals.GrandTotals**.
                 */
                get: function () {
                    return this._showColTotals;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, ShowTotals);
                    if (value != this.showColumnTotals) {
                        this._showColTotals = value;
                        this.onViewDefinitionChanged();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "totalsBeforeData", {
                /**
                 * Gets or sets a value that determines whether row and column totals
                 * should be displayed before or after regular data rows and columns.
                 *
                 * If this value is set to true, total rows appear above data rows
                 * and total columns appear on the left of regular data columns.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._totalsBefore;
                },
                set: function (value) {
                    if (value != this._totalsBefore) {
                        this._totalsBefore = wijmo.asBoolean(value);
                        this.onViewDefinitionChanged();
                        this._updatePivotView();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "sortableGroups", {
                /**
                 * Gets or sets a value that determines whether the engine should
                 * sort groups when sorting the value fields (measures) or whether
                 * it should keep the group order and the data only within each
                 * group.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._sortableGroups;
                },
                set: function (value) {
                    if (value != this._sortableGroups) {
                        this._sortableGroups = wijmo.asBoolean(value);
                        this.onViewDefinitionChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "sortOnServer", {
                /**
                 * Gets or sets a value that indicates whether the summary data received
                 * from the server is already sorted.
                 *
                 * If this property is set to true, the {@link PivotEngine} will not sort
                 * the data it receives from the server.
                 *
                 * This property should be used only in conjunction with custom servers
                 * that return the aggregated data properly sorted, typically using
                 * custom logic not available in the standard {@link PivotEngine}.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._sortOnServer;
                },
                set: function (value) {
                    this._sortOnServer = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "showZeros", {
                /**
                 * Gets or sets a value that determines whether the Olap output table
                 * should use zeros to indicate missing values.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._showZeros;
                },
                set: function (value) {
                    if (value != this._showZeros) {
                        this._showZeros = wijmo.asBoolean(value);
                        this.onViewDefinitionChanged();
                        this._updatePivotView();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "defaultFilterType", {
                /**
                 * Gets or sets the default filter type (by value or by condition).
                 *
                 * The default value for this property is **null**, which causes
                 * the engine to use **FilterType.Both** on the client or
                 * **FilterType.Condition** on the server.
                 */
                get: function () {
                    // honor explicitly set defaultFilterType
                    if (this._defaultFilterType != null) {
                        return this._defaultFilterType;
                    }
                    // REVIEW
                    // limitation: FlexPivotEngine supports only Condition filters
                    return this._server ? wijmo.grid.filter.FilterType.Condition : wijmo.grid.filter.FilterType.Both;
                },
                set: function (value) {
                    this._defaultFilterType = wijmo.asEnum(value, wijmo.grid.filter.FilterType, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "exclusiveValueSearch", {
                /**
                 * Gets or sets a value that determines whether the filter should
                 * include only values selected by the
                 * {@link wijmo.grid.filter.ValueFilter.filterText} property.
                 *
                 * The default value for this property is **true**, which matches
                 * Excel's behavior.
                 *
                 * Set it to **false** to disable this behavior, so searching only
                 * affects which items are displayed on the list and not which items
                 * are included in the filter.
                 */
                get: function () {
                    return this._xValueSearch;
                },
                set: function (value) {
                    this._xValueSearch = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "autoGenerateFields", {
                /**
                 * Gets or sets a value that determines whether the engine should generate fields
                 * automatically based on the {@link itemsSource}.
                 *
                 * If you set this property to true, the engine will generate fields for each
                 * property of the items in the {@link itemsSource}. The {@link PivotField.binding}
                 * property of the auto-generated fields is set to the property name, and their
                 * {@link PivotField.header} property is set to a string obtained by capitalizing
                 * the first letter of the binding and adding spaces before each capital letter.
                 *
                 * For example, a 'customerName' property will cause the engine create a field
                 * with {@link PivotField.binding} set to 'customerName' and {@link PivotField.header}
                 * set to 'Customer Name'.
                 *
                 * When adding fields to one of the view lists using strings, you must specify
                 * the {@link PivotField.header}, not the {@link PivotField.binding} (unlike bindings,
                 * field headers must be unique).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._autoGenFields;
                },
                set: function (value) {
                    this._autoGenFields = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "allowFieldEditing", {
                /**
                 * Gets or sets a value that determines whether users should be allowed to edit
                 * the properties of the {@link PivotField} objects owned by this {@link PivotEngine}.
                 *
                 * If you set this property to false, the context menus shown by controls
                 * such as the **PivotGrid** and **PivotPanel** will not include an
                 * option for changing the field settings.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._allowFieldEditing;
                },
                set: function (value) {
                    this._allowFieldEditing = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "fields", {
                /**
                 * Gets the list of {@link PivotField} objects exposed by the data source.
                 *
                 * This list is created automatically whenever the {@link itemsSource} property is set.
                 *
                 * Pivot views are defined by copying fields from this list to the lists that define
                 * the view: {@link valueFields}, {@link rowFields}, {@link columnFields}, and {@link filterFields}.
                 *
                 * For example, the code below assigns a data source to the {@link PivotEngine} and
                 * then defines a view by adding fields to the {@link rowFields}, {@link columnFields}, and
                 * {@link valueFields} lists.
                 *
                 * ```typescript
                 * import { PivotEngine } from '@grapecity/wijmo.olap';
            
                 * // create pivot engine
                 * let pe = new PivotEngine();
                 *
                 * // set data source (populates fields list)
                 * pe.itemsSource = this.getRawData();
                 *
                 * // prevent updates while building Olap view
                 * pe.beginUpdate();
                 *
                 * // show countries in rows
                 * pe.rowFields.push('Country');
                 *
                 * // show categories and products in columns
                 * pe.columnFields.push('Category');
                 * pe.columnFields.push('Product');
                 *
                 * // show total sales in cells
                 * pe.valueFields.push('Sales');
                 *
                 * // done defining the view
                 * pe.endUpdate();
                 * ```
                 */
                get: function () {
                    return this._fields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "rowFields", {
                /**
                 * Gets the list of {@link PivotField} objects that define the fields shown as
                 * rows in the output table.
                 */
                get: function () {
                    return this._rowFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "columnFields", {
                /**
                 * Gets the list of {@link PivotField} objects that define the fields shown as
                 * columns in the output table.
                 */
                get: function () {
                    return this._columnFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "filterFields", {
                /**
                 * Gets the list of {@link PivotField} objects that define the fields
                 * used as filters.
                 *
                 * Fields on this list do not appear in the output table,
                 * but are still used for filtering the input data.
                 */
                get: function () {
                    return this._filterFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "valueFields", {
                /**
                 * Gets the list of {@link PivotField} objects that define the fields
                 * summarized in the output table.
                 */
                get: function () {
                    return this._valueFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "viewDefinition", {
                /**
                 * Gets or sets the current pivot view definition as a JSON string.
                 *
                 * This property is typically used to persist the current view as
                 * an application setting.
                 *
                 * For example, the code below implements two functions that save
                 * and load view definitions using local storage:
                 *
                 * ```typescript
                 * // save/load views
                 * function saveView() {
                 *   localStorage.viewDefinition = pivotEngine.viewDefinition;
                 * }
                 * function loadView() {
                 *   pivotEngine.viewDefinition = localStorage.viewDefinition;
                 * }
                 * ```
                 */
                get: function () {
                    var _this = this;
                    // save options and view
                    var viewDef = {
                        showZeros: this.showZeros,
                        showColumnTotals: this.showColumnTotals,
                        showRowTotals: this.showRowTotals,
                        defaultFilterType: this.defaultFilterType,
                        totalsBeforeData: this.totalsBeforeData,
                        sortableGroups: this.sortableGroups,
                        fields: [],
                        rowFields: this._getFieldCollectionProxy(this.rowFields),
                        columnFields: this._getFieldCollectionProxy(this.columnFields),
                        filterFields: this._getFieldCollectionProxy(this.filterFields),
                        valueFields: this._getFieldCollectionProxy(this.valueFields)
                    };
                    // save field definitions
                    this.fields.forEach(function (fld) {
                        var fldDef = _this._getFieldDefinition(fld);
                        viewDef.fields.push(fldDef);
                    });
                    // done
                    return JSON.stringify(viewDef);
                },
                set: function (value) {
                    var _this = this;
                    var viewDef = JSON.parse(value);
                    if (viewDef) {
                        this.deferUpdate(function () {
                            // load options
                            _this._copyProps(_this, viewDef, PivotEngine._props);
                            // load fields
                            _this.fields.clear();
                            viewDef.fields.forEach(function (fldDef) {
                                var fld = _this._getFieldFromDefinition(fldDef);
                                _this.fields.push(fld);
                            });
                            // load field weights
                            viewDef.fields.forEach(function (fldDef, index) {
                                if (wijmo.isString(fldDef.weightField)) {
                                    _this.fields[index].weightField = _this.fields.getField(fldDef.weightField);
                                }
                            });
                            // load view fields
                            _this._setFieldCollectionProxy(_this.rowFields, viewDef.rowFields);
                            _this._setFieldCollectionProxy(_this.columnFields, viewDef.columnFields);
                            _this._setFieldCollectionProxy(_this.filterFields, viewDef.filterFields);
                            _this._setFieldCollectionProxy(_this.valueFields, viewDef.valueFields);
                        });
                        //this.onViewDefinitionChanged(); // already done by endUpdate: TFS 439515
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "isViewDefined", {
                /**
                 * Gets a value that determines whether a pivot view is currently defined.
                 *
                 * A pivot view is defined if any of the {@link valueFields}, {@link rowFields},
                 * or {@link columnFields} lists are not empty.
                 */
                get: function () {
                    var vf = this._valueFields.length, rf = this._rowFields.length, cf = this._columnFields.length;
                    return this._server
                        ? vf > 0 && (rf > 0 || cf > 0)
                        : vf > 0 || rf > 0 || cf > 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Suspends the refresh processes until next call to the {@link endUpdate}.
             */
            PivotEngine.prototype.beginUpdate = function () {
                this.cancelPendingUpdates();
                this._updating++;
                if (this._updating === 1) {
                    this._onIsUpdatingChanged();
                }
            };
            /**
             * Resumes refresh processes suspended by calls to {@link beginUpdate}.
             */
            PivotEngine.prototype.endUpdate = function () {
                this._updating--;
                if (this._updating <= 0) {
                    if (this._viewDefinitionChanged) { // TFS 441269
                        this._viewDefinitionChanged = false;
                        this.onViewDefinitionChanged();
                    }
                    this._onIsUpdatingChanged();
                    this.refresh();
                }
            };
            Object.defineProperty(PivotEngine.prototype, "isUpdating", {
                /**
                 * Gets a value that indicates whether the engine is currently being updated.
                 */
                get: function () {
                    return this._updating > 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Executes a function within a {@link beginUpdate}/{@link endUpdate} block.
             *
             * The control will not be updated until the function has been executed.
             * This method ensures {@link endUpdate} is called even if the function throws
             * an exception.
             *
             * @param fn Function to be executed.
             */
            PivotEngine.prototype.deferUpdate = function (fn) {
                try {
                    this.beginUpdate();
                    fn();
                }
                finally {
                    this.endUpdate();
                }
            };
            /**
             * Summarizes the data and updates the output {@link pivotView}.
             *
             * @param force Refresh even while updating (see {@link beginUpdate}).
             */
            PivotEngine.prototype.refresh = function (force) {
                if (force === void 0) { force = false; }
                this._updateView(force);
            };
            /**
             * Invalidates the view causing an asynchronous refresh.
             */
            PivotEngine.prototype.invalidate = function () {
                var _this = this;
                if (this._toInv) {
                    this._toInv = clearTimeout(this._toInv);
                }
                if (!this.isUpdating) {
                    this._toInv = setTimeout(function () {
                        _this.refresh();
                    }, wijmo.Control._REFRESH_INTERVAL);
                }
            };
            Object.defineProperty(PivotEngine.prototype, "async", {
                /**
                 * Gets or sets a value that determines whether view updates
                 * should be generated asynchronously.
                 *
                 * This property is set to true by default, so summaries over
                 * large data sets are performed asynchronously to prevent
                 * stopping the UI thread.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._async;
                },
                set: function (value) {
                    if (value != this._async) {
                        this.cancelPendingUpdates();
                        this._async = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "serverTimeout", {
                /**
                 * Gets or sets the maximum amount of time, in milliseconds, that
                 * the engine should wait for the results to come back from the
                 * server.
                 *
                 * The default value for this property is **60,000** milliseconds,
                 * or one minute. If you expect server operations  to take longer
                 * than that, set the property to a higher value.
                 */
                get: function () {
                    return this._serverParms.timeout;
                },
                set: function (value) {
                    this._serverParms.timeout = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "serverPollInterval", {
                /**
                 * Gets or sets the amount of time, in milliseconds, that the
                 * engine should wait before polling the server for progress
                 * status while retrieving results.
                 *
                 * The default value for this property is **500** milliseconds,
                 * which causes the engine to poll the server for a status update
                 * every half second.
                 */
                get: function () {
                    return this._serverParms.pollInterval;
                },
                set: function (value) {
                    this._serverParms.pollInterval = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotEngine.prototype, "serverMaxDetail", {
                /**
                 * Gets or sets the maximum number of records the {@link getDetail}
                 * method should retrieve from the server.
                 *
                 * The default value for this property is **1,000**, which
                 * is a reasonable amount of detail in many scenarios.
                 * If you want to allow more detail records to be retrieved,
                 * increase the value of this property.
                 */
                get: function () {
                    return this._serverParms.maxDetail;
                },
                set: function (value) {
                    this._serverParms.maxDetail = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Cancels any pending asynchronous view updates.
             */
            PivotEngine.prototype.cancelPendingUpdates = function () {
                if (this._toUpdateTallies) {
                    clearTimeout(this._toUpdateTallies);
                    this._toUpdateTallies = null;
                }
            };
            /**
             * Gets an array containing the records summarized by a property in the
             * {@link pivotView} list.
             *
             * If the engine is connected to a PivotEngine server, the value returned
             * is an {@link ObservableArray} that is populated asynchronously.
             *
             * @param item Data item in the {@link pivotView} list.
             * @param binding Name of the property being summarized.
             */
            PivotEngine.prototype.getDetail = function (item, binding) {
                var _this = this;
                var rowKey = item ? item[olap._PivotKey._ROW_KEY_NAME] : null, colKey = this._getKey(binding);
                // get detail items on server
                if (this._server) {
                    return this._server.getDetail(rowKey, colKey);
                }
                // get detail items on client
                var items = this.collectionView.items, arr = [];
                items.forEach(function (item) {
                    if (_this._applyFilter(item) &&
                        (rowKey == null || rowKey.matchesItem(item)) &&
                        (colKey == null || colKey.matchesItem(item))) {
                        arr.push(item);
                    }
                });
                return arr;
            };
            /**
             * Gets an {@link collections.ICollectionView} containing the records summarized
             * by a property in the {@link pivotView} list.
             *
             * @param item Data item in the {@link pivotView} list.
             * @param binding Name of the property being summarized.
             */
            PivotEngine.prototype.getDetailView = function (item, binding) {
                var arr = this.getDetail(item, binding);
                return new wijmo.collections.CollectionView(arr);
            };
            /**
             * Gets an object with information about a property in the {@link pivotView} list.
             *
             * The object returned has two properties, 'rowKey' and 'colKey'. Each of
             * these contains two arrays, 'fields' and 'values'. Together, this information
             * uniquely identifies a value summarized by the {@link PivotEngine}.
             *
             * For example, calling {@link getKeys} against a pivot view with two row fields
             * 'Product' and 'Country', and a single column field 'Active' would return an
             * object such as this one:
             *
             * ```
             * {
             *     rowKey: {
             *         fields: [ 'Product', 'Country'],
             *         values: [ 'Aoba', 'Japan' ]
             *     },
             *     colKey: {
             *         fields: [ 'Active' ],
             *         values: [ true ]
             *     }
             * }
             * ```
             *
             * The object identifies the subset of data used to obtain one summary value.
             * In this case, this value represents all data items for product 'Aoba' sold
             * in Japan with Active state set to true.
             *
             * @param item Data item in the {@link pivotView} list.
             * @param binding Name of the property being summarized.
             */
            PivotEngine.prototype.getKeys = function (item, binding) {
                var rk = item ? item[olap._PivotKey._ROW_KEY_NAME] : null, ck = this._getKey(binding);
                return {
                    rowKey: {
                        fields: rk ? rk.fieldNames : [],
                        values: rk ? rk.values : []
                    },
                    colKey: {
                        fields: ck ? ck.fieldNames : [],
                        values: ck ? ck.values : []
                    }
                };
            };
            /**
             * Shows a settings dialog where users can edit a field's settings.
             *
             * @param field {@link PivotField} to be edited.
             */
            PivotEngine.prototype.editField = function (field) {
                if (this.allowFieldEditing) {
                    var edt = new olap.PivotFieldEditor(document.createElement('div'), {
                        field: field
                    });
                    var dlg = new wijmo.input.Popup(document.createElement('div'), {
                        content: edt.hostElement
                    });
                    dlg.show(true);
                }
            };
            /**
             * Removes a field from the current view.
             *
             * @param field {@link PivotField} to be removed.
             */
            PivotEngine.prototype.removeField = function (field) {
                for (var i = 0; i < this._viewLists.length; i++) {
                    var list = this._viewLists[i], index = list.indexOf(field);
                    if (index > -1) {
                        list.removeAt(index);
                        return;
                    }
                }
            };
            /**
             * Raises the {@link itemsSourceChanged} event.
             */
            PivotEngine.prototype.onItemsSourceChanged = function (e) {
                this.itemsSourceChanged.raise(this, e);
            };
            /**
             * Raises the {@link viewDefinitionChanged} event.
             */
            PivotEngine.prototype.onViewDefinitionChanged = function (e) {
                if (this._updating <= 0) { // TFS 439515
                    this.viewDefinitionChanged.raise(this, e);
                    this._viewDefinitionChanged = false;
                }
                else {
                    this._viewDefinitionChanged = true;
                }
            };
            /**
             * Raises the {@link updatingView} event.
             *
             * @param e {@link ProgressEventArgs} that provides the event data.
             */
            PivotEngine.prototype.onUpdatingView = function (e) {
                this.updatingView.raise(this, e);
            };
            /**
             * Raises the {@link updatedView} event.
             */
            PivotEngine.prototype.onUpdatedView = function (e) {
                this.updatedView.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             *
             * @param e {@link RequestErrorEventArgs} that contains information about the error.
             */
            PivotEngine.prototype.onError = function (e) {
                this.error.raise(this, e);
                return !e.cancel;
            };
            PivotEngine.prototype._onIsUpdatingChanged = function (e) {
                this._isUpdatingChanged.raise(this, e);
            };
            // ** implementation
            // method used in JSON-style initialization
            PivotEngine.prototype._copy = function (key, value) {
                var _this = this;
                var arr;
                switch (key) {
                    case 'fields':
                        this.fields.clear();
                        this._viewLists.forEach(function (list) {
                            list.clear();
                        });
                        arr = wijmo.asArray(value);
                        arr.forEach(function (fldDef) {
                            var fld = _this._createField(fldDef, false);
                            _this.fields.push(fld);
                        });
                        this._updateFieldTypes(); // TFS 304424
                        return true;
                    case 'rowFields':
                    case 'columnFields':
                    case 'valueFields':
                    case 'filterFields':
                        this[key].clear();
                        // handle objects with maxItems/items
                        if (!wijmo.isArray(value)) {
                            this[key].maxItems = value.maxItems;
                            value = value.items;
                        }
                        // handle regular arrays
                        arr = wijmo.asArray(value);
                        arr.forEach(function (fldDef) {
                            var fld = _this.fields.getField(fldDef);
                            _this[key].push(fld);
                        });
                        return true;
                }
                return false;
            };
            // get a pivot key object from its string representation
            PivotEngine.prototype._getKey = function (keyString) {
                return this._keys[keyString];
            };
            // gets a row key based on its index or data item (TFS 385259)
            PivotEngine.prototype._getRowKey = function (row) {
                var item = row;
                if (wijmo.isNumber(row)) {
                    var view = this._pivotView, arr = view.items.length ? view.items : view.sourceCollection; // TFS 457252
                    item = arr[row];
                }
                return item ? item[olap._PivotKey._ROW_KEY_NAME] : null;
            };
            // get the subtotal level of a row based on its index
            PivotEngine.prototype._getRowLevel = function (row) {
                var key = this._getRowKey(row);
                return key ? key.level : -1;
            };
            // gets a column key based on its key, binding, or index
            PivotEngine.prototype._getColKey = function (key) {
                if (wijmo.isNumber(key)) { // convert column index into key string
                    key = this._colBindings[key];
                }
                if (wijmo.isString(key)) { // convert string key in to actual key
                    return this._getKey(key);
                }
                wijmo.assert(key == null || key instanceof olap._PivotKey, 'invalid parameter in call to _getColLevel');
                return key;
            };
            // get the subtotal level of a column based on its key, binding, or column index
            PivotEngine.prototype._getColLevel = function (key) {
                key = this._getColKey(key);
                return key ? key.level : -1;
            };
            // apply filter to a given object
            PivotEngine.prototype._applyFilter = function (item) {
                // scan all fields that have active filters
                var fields = this._activeFilterFields;
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i].filter;
                    if (!f.apply(item)) {
                        return false;
                    }
                }
                // value passed all filters
                return true;
            };
            // refresh _tallies object used to build the output pivotView
            PivotEngine.prototype._updateView = function (force) {
                var _this = this;
                if (force === void 0) { force = false; }
                if (!this.isUpdating || force) { // TFS 275158, 414365
                    // benchmark
                    //console.time('view update');
                    // clear any on-going updates
                    this.cancelPendingUpdates();
                    // count items and filtered items
                    this._cntTotal = this._cntFiltered = 0;
                    // clear tallies and active filter fields
                    this._tallies = {};
                    this._keys = {};
                    this._activeFilterFields = [];
                    // update view from server
                    if (this._server) {
                        if (this.isViewDefined) {
                            this._server.getOutputView(function (result) {
                                if (_this.isViewDefined) { // the view might be gone by now: TFS 250028
                                    _this._server.updateTallies(result);
                                    _this._updatePivotView(force);
                                }
                            });
                            return;
                        }
                    }
                    // keep track of active filter fields (optimization)
                    var lists = this._viewLists;
                    lists.forEach(function (list) {
                        list.forEach(function (fld) {
                            if (fld.filter.isActive) {
                                _this._activeFilterFields.push(fld);
                            }
                        });
                    });
                    // tally all objects in data source
                    if (this.isViewDefined && wijmo.hasItems(this._cv)) {
                        this._batchStart = Date.now();
                        this._updateTallies(this._cv.items, 0, force); // TFS 415147
                    }
                    else {
                        this._updatePivotView(force);
                    }
                }
            };
            // async tally update
            PivotEngine.prototype._updateTallies = function (arr, startIndex, force) {
                var _this = this;
                if (force === void 0) { force = false; }
                var arrLen = arr.length, rowNodes = new olap._PivotNode(this._rowFields, 0, null, -1, null);
                // if we have column but no value fields,
                // add a dummy value field to get a view with the column values
                var valFields = this.valueFields;
                if (valFields.length == 0 && this.columnFields.length > 0) {
                    valFields = new olap.PivotFieldCollection(this);
                    valFields.push(new olap.PivotField(this, '', '', {
                        // use Sum instead of Cnt
                        // to show 0 instead of 1(backward compatibility: TFS 469833)
                        aggregate: wijmo.Aggregate.Sum
                    }));
                }
                // set loop start and step variables to control key size and subtotal creation
                var st = ShowTotals, rkLen = this._rowFields.length, srTot = this._getShowRowTotals(), rkStart = srTot == st.None ? rkLen : 0, rkStep = srTot == st.GrandTotals ? Math.max(1, rkLen) : 1, ckLen = this._columnFields.length, scTot = this._getShowColTotals(), ckStart = scTot == st.None ? ckLen : 0, ckStep = scTot == st.GrandTotals ? Math.max(1, ckLen) : 1, vfLen = valFields.length;
                var _loop_1 = function (index) {
                    // let go of the thread for a while
                    if (this_1._async &&
                        index - startIndex >= PivotEngine._BATCH_SIZE &&
                        Date.now() - this_1._batchStart > PivotEngine._BATCH_DELAY) {
                        this_1._toUpdateTallies = setTimeout(function () {
                            _this.onUpdatingView(new ProgressEventArgs(Math.round(index / arr.length * 100)));
                            _this._batchStart = Date.now();
                            _this._updateTallies(arr, index, force); // TFS 415147
                        }, PivotEngine._BATCH_TIMEOUT);
                        return { value: void 0 };
                    }
                    // count elements
                    this_1._cntTotal++;
                    // apply filter
                    var item = arr[index];
                    if (!this_1._activeFilterFields.length || this_1._applyFilter(item)) {
                        // count filtered items from raw data source
                        this_1._cntFiltered++;
                        // get/create row tallies
                        for (var i = rkStart; i <= rkLen; i += rkStep) {
                            // get/create row tally
                            var nd = rowNodes.getNode(this_1._rowFields, i, null, -1, item), rowKey = nd.key, 
                            //rowKey = new _PivotKey(this._rowFields, i, null, -1, item),
                            rowKeyId = rowKey.toString(), rowTallies = this_1._tallies[rowKeyId];
                            if (!rowTallies) {
                                this_1._keys[rowKeyId] = rowKey;
                                this_1._tallies[rowKeyId] = rowTallies = {};
                            }
                            // get/create column tallies for this row
                            for (var j = ckStart; j <= ckLen; j += ckStep) {
                                for (var k = 0; k < vfLen; k++) {
                                    // get/create tally
                                    var colNodes = nd.tree.getNode(this_1._columnFields, j, valFields, k, item), colKey = colNodes.key, 
                                    //colKey = new _PivotKey(this._columnFields, j, this._valueFields, k, item),
                                    colKeyId = colKey.toString(), tally = rowTallies[colKeyId];
                                    if (!tally) {
                                        this_1._keys[colKeyId] = colKey;
                                        tally = rowTallies[colKeyId] = new olap._Tally();
                                    }
                                    // get value
                                    var vf = valFields[k], value = vf._getValue(item, false), weight = vf.weightField ? vf._getWeight(item) : null;
                                    // update tally
                                    tally.add(value, weight);
                                }
                            }
                        }
                    }
                };
                var this_1 = this;
                // scan through the items
                for (var index = startIndex; index < arrLen; index++) {
                    var state_1 = _loop_1(index);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                // done with tallies, update view
                this._toUpdateTallies = null;
                this._updatePivotView(force); // TFS 415147
            };
            // refresh the output pivotView from the tallies
            PivotEngine.prototype._updatePivotView = function (force) {
                var _this = this;
                if (force === void 0) { force = false; }
                if (!this.isUpdating || force) { // TFS 275158, 414365
                    var view_1 = this._pivotView;
                    view_1.deferUpdate(function () {
                        // start updating the view
                        _this.onUpdatingView(new ProgressEventArgs(100));
                        // cancel any pending (invalid) edit/addNew operations (TFS 466905)
                        view_1.cancelEdit();
                        view_1.cancelNew();
                        // clear table and sort
                        var arr = view_1.sourceCollection;
                        arr.length = 0;
                        // get row keys
                        var rowKeys = {};
                        for (var rk in _this._tallies) {
                            rowKeys[rk] = true;
                        }
                        // get column keys
                        var colKeys = {};
                        for (var rk in _this._tallies) {
                            var row = _this._tallies[rk];
                            for (var ck in row) {
                                colKeys[ck] = true;
                            }
                        }
                        // sort keys
                        var sortedRowKeys = [], sortedColKeys = [];
                        if (_this._server) {
                            sortedRowKeys = _this._server.getSortedKeys(rowKeys, true),
                                sortedColKeys = _this._server.getSortedKeys(colKeys, false);
                        }
                        else {
                            sortedRowKeys = _this._getSortedKeys(rowKeys);
                            sortedColKeys = _this._getSortedKeys(colKeys);
                        }
                        // build output items
                        for (var r = 0; r < sortedRowKeys.length; r++) {
                            var rowKey = sortedRowKeys[r], row = _this._tallies[rowKey], item = {};
                            item[olap._PivotKey._ROW_KEY_NAME] = _this._getKey(rowKey);
                            for (var c = 0; c < sortedColKeys.length; c++) {
                                // get the value
                                var colKey = sortedColKeys[c], tally = row[colKey], pk = _this._getKey(colKey), value = tally ? tally.getAggregate(pk.aggregate) : null;
                                // use zeros to indicate missing values (TFS 399859)
                                if (value == null && _this._showZeros) {
                                    value = 0;
                                }
                                // store the value
                                item[colKey] = value;
                            }
                            arr.push(item);
                        }
                        // save column keys so we can access them by index
                        _this._colBindings = sortedColKeys;
                        // honor 'showAs' settings
                        _this._updateFieldValues(arr);
                        // remove any sorts
                        view_1.sortDescriptions.clear();
                        // force CollectionView refresh (TFS 404441)
                        view_1.refresh();
                    });
                    // done updating the view
                    this.onUpdatedView();
                    // benchmark
                    //console.timeEnd('view update');
                }
            };
            // return a sorted array of PivotKey ids
            PivotEngine.prototype._getSortedKeys = function (obj) {
                var _this = this;
                var keys = Object.keys(obj);
                keys.sort(function (id1, id2) {
                    return _this._keys[id1].compareTo(_this._keys[id2]);
                });
                return keys;
            };
            // update field values to honor showAs property
            PivotEngine.prototype._updateFieldValues = function (arr) {
                var vfl = this.valueFields.length;
                // honor getAggregateValue
                for (var vf = 0; vf < vfl; vf++) {
                    var fld = this.valueFields[vf];
                    // honor custom aggregate function
                    if (wijmo.isFunction(fld.getAggregateValue)) {
                        for (var col = vf; col < this._colBindings.length; col += vfl) {
                            for (var row = 0; row < arr.length; row++) {
                                var item = arr[row], binding = this._colBindings[col], aggItem = this._getAggregateObject(item, binding);
                                item[binding] = fld.getAggregateValue.call(this, aggItem); // custom function
                            }
                        }
                    }
                }
                var _loop_2 = function (vf) {
                    var fld = this_2.valueFields[vf];
                    switch (fld.showAs) {
                        // running totals
                        case ShowAs.RunTot:
                        case ShowAs.RunTotPct:
                            for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                // calculate running totals
                                for (var row = 0; row < arr.length; row++) {
                                    var item = arr[row], binding = this_2._colBindings[col];
                                    item[binding] = this_2._getRunningTotal(arr, row, col);
                                }
                                // convert running totals to percentages
                                if (fld.showAs == ShowAs.RunTotPct) {
                                    for (var row = 0; row < arr.length; row++) {
                                        var item = arr[row], binding = this_2._colBindings[col], val = item[binding];
                                        if (wijmo.isNumber(val)) {
                                            var max = this_2._getLastValueInRowGroup(arr, row, col);
                                            if (max != 0) {
                                                item[binding] = val / max;
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        // percentages
                        case ShowAs.PctGrand:
                        case ShowAs.PctCol:
                            // calculate grand total
                            var total_1 = 0;
                            if (fld.showAs == ShowAs.PctGrand) {
                                for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                    if (this_2._getColLevel(col) == -1) {
                                        total_1 += this_2._getColTotal(arr, col);
                                    }
                                }
                            }
                            var _loop_3 = function (col) {
                                // calculate column total
                                if (fld.showAs == ShowAs.PctCol) {
                                    total_1 = this_2._getColTotal(arr, col);
                                }
                                // convert column values to percentages
                                var binding = this_2._colBindings[col];
                                arr.forEach(function (item) {
                                    var value = item[binding];
                                    if (wijmo.isNumber(value)) {
                                        item[binding] = total_1 != 0 ? value / total_1 : null;
                                    }
                                });
                            };
                            // convert columns to percentages
                            for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                _loop_3(col);
                            }
                            break;
                        case ShowAs.PctRow:
                            for (var row = 0; row < arr.length; row++) {
                                // calculate total for this row
                                var item = arr[row], total_2 = 0;
                                for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                    if (this_2._getColLevel(col) == -1) {
                                        var binding = this_2._colBindings[col], value = item[binding];
                                        if (wijmo.isNumber(value)) {
                                            total_2 += value;
                                        }
                                    }
                                }
                                // convert row values to percentages
                                for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                    var binding = this_2._colBindings[col], value = item[binding];
                                    if (wijmo.isNumber(value)) {
                                        item[binding] = total_2 != 0 ? value / total_2 : null;
                                    }
                                }
                            }
                            break;
                        // row differences
                        case ShowAs.DiffRow:
                        case ShowAs.DiffRowPct:
                        case ShowAs.PctPrevRow:
                            for (var col = vf; col < this_2._colBindings.length; col += vfl) {
                                for (var row = arr.length - 1; row >= 0; row--) {
                                    var item = arr[row], binding = this_2._colBindings[col];
                                    item[binding] = this_2._getRowDifference(arr, row, col, fld.showAs);
                                }
                            }
                            break;
                        // column differences
                        case ShowAs.DiffCol:
                        case ShowAs.DiffColPct:
                        case ShowAs.PctPrevCol:
                            for (var row = 0; row < arr.length; row++) {
                                for (var col = this_2._colBindings.length - vfl + vf; col >= 0; col -= vfl) {
                                    var item = arr[row], binding = this_2._colBindings[col];
                                    item[binding] = this_2._getColDifference(arr, row, col, fld.showAs);
                                }
                            }
                            break;
                    }
                };
                var this_2 = this;
                // honor showAs property
                for (var vf = 0; vf < vfl; vf++) {
                    _loop_2(vf);
                }
            };
            // get object to use as a context for the field's getAggregateValue function
            PivotEngine.prototype._getAggregateObject = function (item, binding) {
                var obj = {}, rx = /(.+:.+;)*((.+):.+;)/, // one or more field names and values
                mThis = binding.match(rx);
                // copy matching row values into aggregate object
                for (var k in item) {
                    var mOther = k.match(rx);
                    if (mOther && mOther[1] == mThis[1]) { // match prefix
                        obj[mOther[3]] = item[k]; // save name
                    }
                }
                // done
                return obj;
            };
            // gets a total for all non-group values in a column
            PivotEngine.prototype._getColTotal = function (arr, col) {
                var _this = this;
                var binding = this._colBindings[col], total = 0;
                arr.forEach(function (item) {
                    if (_this._getRowLevel(item) == -1) { // TFS 385259
                        var val = item[binding];
                        if (wijmo.isNumber(val)) {
                            total += val;
                        }
                    }
                });
                return total;
            };
            // gets the a running total for an item by adding its value to the value in the previous row
            PivotEngine.prototype._getRunningTotal = function (arr, row, col) {
                // grand total? no running total (as in Excel).
                var level = this._getRowLevel(arr[row]); // TFS 457252
                if (level == 0) {
                    return null;
                }
                // get binding and cell value
                var binding = this._colBindings[col], runTot = arr[row][binding], srTot = this._getShowRowTotals();
                // get previous item at the same level
                var grpFld = this.rowFields.length - 2;
                for (var p = row - 1; p >= 0; p--) {
                    var plevel = this._getRowLevel(arr[p]); // TFS 457252
                    if (plevel == level) {
                        // honor groups even without subtotals 
                        if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                            var k = arr[row].$rowKey, kp = arr[p].$rowKey;
                            if (k.values[grpFld] != kp.values[grpFld]) {
                                return null;
                            }
                        }
                        // compute running total
                        var pval = arr[p][binding];
                        runTot += pval;
                        break;
                    }
                    // not found...
                    if (plevel > level)
                        break;
                }
                // return running total (percentages to be calculated later)
                return runTot;
            };
            // gets the last value in a row group (used to calculate running total percentages)
            PivotEngine.prototype._getLastValueInRowGroup = function (arr, row, col) {
                // get binding and cell value
                var binding = this._colBindings[col], lastVal = arr[row][binding];
                // get next item at the same level
                var level = this._getRowLevel(arr[row]), // TFS 457252
                grpFld = this.rowFields.length - 2, srTot = this._getShowRowTotals();
                for (var p = row + 1; p < arr.length; p++) {
                    var plevel = this._getRowLevel(arr[p]); // TFS 457252
                    if (plevel == level) {
                        // honor groups even without subtotals 
                        if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                            var k = arr[row].$rowKey, kp = arr[p].$rowKey;
                            if (k.values[grpFld] != kp.values[grpFld]) {
                                return lastVal;
                            }
                        }
                        // compute running total
                        lastVal = arr[p][binding];
                    }
                    // not found...
                    if (plevel > level)
                        break;
                }
                // return running total (percentages to be calculated later)
                return lastVal;
            };
            // gets the difference between an item and the item in the previous row
            PivotEngine.prototype._getRowDifference = function (arr, row, col, showAs) {
                // grand total? no previous item, no diff.
                var level = this._getRowLevel(arr[row]); // TFS 457252
                if (level == 0) {
                    return null;
                }
                // get previous item at the same level
                var binding = this._colBindings[col], val = arr[row][binding], grpFld = this.rowFields.length - 2, srTot = this._getShowRowTotals();
                for (var p = row - 1; p >= 0; p--) {
                    var plevel = this._getRowLevel(arr[p]); // TFS 457252
                    if (plevel == level) {
                        // honor groups even without subtotals 
                        if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                            var k = arr[row].$rowKey, kp = arr[p].$rowKey;
                            if (k.values[grpFld] != kp.values[grpFld]) {
                                return null;
                            }
                        }
                        // compute difference
                        var pval = arr[p][binding];
                        switch (showAs) {
                            case ShowAs.DiffRow:
                                val = val - pval;
                                break;
                            case ShowAs.DiffRowPct:
                                val = (val - pval) / pval;
                                break;
                            case ShowAs.PctPrevRow:
                                val = val / pval;
                                break;
                        }
                        // done
                        return val;
                    }
                    // not found...
                    if (plevel > level)
                        break;
                }
                // no previous item...
                return showAs == ShowAs.PctPrevRow
                    ? 1 // first item is 100%, like Excel
                    : null;
            };
            // gets the difference between an item and the item in the previous column
            PivotEngine.prototype._getColDifference = function (arr, row, col, showAs) {
                // grand total? no previous item, no diff.
                var level = this._getColLevel(col);
                if (level == 0) {
                    return null;
                }
                // get previous item at the same level
                var item = arr[row], val = item[this._colBindings[col]], vfl = this.valueFields.length, grpFld = this.columnFields.length - 2, scTot = this._getShowColTotals();
                for (var p = col - vfl; p >= 0; p -= vfl) {
                    var plevel = this._getColLevel(p);
                    if (plevel == level) {
                        // honor groups even without subtotals
                        if (grpFld > -1 && level < 0 && scTot != ShowTotals.Subtotals) {
                            var k = this._getKey(this._colBindings[col]), kp = this._getKey(this._colBindings[p]);
                            if (k.values[grpFld] != kp.values[grpFld]) {
                                return null;
                            }
                        }
                        // compute difference
                        var pval = item[this._colBindings[p]];
                        switch (showAs) {
                            case ShowAs.DiffCol:
                                val = val - pval;
                                break;
                            case ShowAs.DiffColPct:
                                val = (val - pval) / pval;
                                break;
                            case ShowAs.PctPrevCol:
                                val = val / pval;
                                break;
                        }
                        // done
                        return val;
                    }
                    // not found...
                    if (plevel > level)
                        break;
                }
                // no previous item...
                return showAs == ShowAs.PctPrevCol
                    ? 1 // first item is 100%, like Excel
                    : null;
            };
            // do not show totals if there are no value fields
            PivotEngine.prototype._getShowRowTotals = function () {
                return this._valueFields.length
                    ? this._showRowTotals
                    : ShowTotals.None;
            };
            PivotEngine.prototype._getShowColTotals = function () {
                return this._valueFields.length
                    ? this._showColTotals
                    : ShowTotals.None;
            };
            // get the list of unique values for a field
            PivotEngine.prototype._getUniqueValues = function (fld) {
                return this._server
                    ? this._server.getUniqueValues(fld)
                    : null;
            };
            // generate fields for the current itemsSource
            PivotEngine.prototype._generateFields = function () {
                var _this = this;
                // empty view lists
                this._viewLists.forEach(function (list) {
                    list.clear();
                });
                // remove old auto-generated fields
                for (var i = 0; i < this.fields.length; i++) {
                    var fld = this.fields[i];
                    if (fld._autoGenerated) {
                        this.fields.removeAt(i);
                        i--;
                    }
                }
                // get field list from server
                if (this._server) {
                    var fields = this._server.getFields();
                    fields.forEach(function (fldDef) {
                        var fld = _this._createField(fldDef, true);
                        if (!_this.fields.getField(fld.header)) {
                            _this.fields.push(fld);
                        }
                    });
                    return;
                }
                // get first item to infer data types
                var cv = this.collectionView, arr = cv ? cv.items : null; // using items to support calculated fields
                // auto-generate new fields
                // (skipping unwanted types: array and object)
                if (arr && arr.length && this.autoGenerateFields) {
                    wijmo.getTypes(arr).forEach(function (item) {
                        var fld = _this._createField({
                            binding: item.binding,
                            header: wijmo.toHeaderCase(item.binding),
                            dataType: item.dataType
                        }, true);
                        if (!_this.fields.getField(fld.header)) {
                            _this.fields.push(fld);
                        }
                    });
                }
            };
            // update missing field types
            PivotEngine.prototype._updateFieldTypes = function () {
                var _this = this;
                var cv = this.collectionView, arr = cv ? cv.sourceCollection : null;
                if (arr && arr.length) {
                    this.fields.forEach(function (fld) {
                        _this._updateFieldType(fld, arr);
                    });
                }
            };
            PivotEngine.prototype._updateFieldType = function (fld, arr) {
                var _this = this;
                // handle cube fields
                if (fld._hasSubFields()) {
                    fld.subFields.forEach(function (subField) {
                        _this._updateFieldType(subField, arr);
                    });
                    return;
                }
                // set field data type based on the data value
                if (fld.dataType == null && fld.binding) {
                    for (var index = 0; index < arr.length && index < 1000; index++) {
                        var value = fld._binding.getValue(arr[index]);
                        if (value != null) {
                            fld.dataType = wijmo.isPrimitive(value) ? wijmo.getType(value) : null;
                            break;
                        }
                    }
                }
                // adjust format and aggregate based on data type (TFS 382512)
                if (fld.dataType != null) {
                    if (!fld.format) {
                        fld.format = fld.dataType == wijmo.DataType.Date ? 'd' : 'n0';
                    }
                    if (fld.aggregate == wijmo.Aggregate.Sum && fld.dataType != wijmo.DataType.Number) {
                        fld.aggregate = wijmo.Aggregate.Cnt;
                    }
                }
            };
            // create a regular of cube field
            PivotEngine.prototype._createField = function (options, autoGenerated) {
                // create cube or regular field
                var fld;
                if (wijmo.isString(options)) {
                    fld = new olap.PivotField(this, options);
                }
                else if (options) {
                    if (options.key) { // remove key (it is readonly)
                        delete options.key;
                    }
                    fld = options.dimensionType != null
                        ? new olap.CubePivotField(this, options.binding, options.header, options)
                        : new olap.PivotField(this, options.binding, options.header, options);
                    if (options.dataType != null) { // TFS 299031
                        fld.dataType = options.dataType;
                    }
                }
                // remember if this field was auto generated
                fld._autoGenerated = autoGenerated;
                // set defaults if auto-generating
                if (autoGenerated || wijmo.isString(options)) {
                    fld.format = fld.dataType == wijmo.DataType.Date
                        ? 'd'
                        : 'n0';
                    fld.aggregate = fld.dataType == wijmo.DataType.Number
                        ? wijmo.Aggregate.Sum
                        : wijmo.Aggregate.Cnt;
                }
                // apply options after initialization (TFS 293397)
                if (options && !wijmo.isString(options)) {
                    wijmo.copy(fld, options);
                }
                // sanity: cube fields should have a key and EITHER have bindings OR subfields
                //if (fld instanceof CubePivotField) {
                //    let hasBinding = fld.binding != null && fld.binding.length > 0;
                //    if (fld.subFields != null && fld.subFields.length > 0) {
                //        assert(!hasBinding, 'Parent cube fields not have bindings.')
                //    } else {
                //        assert(hasBinding, 'Leaf cube fields should have bindings.')
                //    }
                //}
                // all done
                return fld;
            };
            // handle changes to data source
            PivotEngine.prototype._cvCollectionChanged = function (sender, e) {
                this.invalidate();
            };
            // handle changes to field lists
            PivotEngine.prototype._fieldListChanged = function (s, e) {
                if (e.action == wijmo.collections.NotifyCollectionChangedAction.Add) {
                    var arr = s;
                    // rule 1: prevent duplicate items within a list
                    for (var i = 0; i < arr.length - 1; i++) {
                        if (arr[i].key) { // REVIEW: cube fields with children have no key...
                            for (var j = i + 1; j < arr.length; j++) {
                                if (arr[i].key == arr[j].key) {
                                    arr.removeAt(j);
                                    j--;
                                }
                            }
                        }
                    }
                    // rule 2: if a field was added to one of the view lists, 
                    // make sure it is also on the main list
                    // and that it only appears once in the view lists
                    if (arr != this._fields) {
                        if (!this._fields.getField(e.item.key)) {
                            arr.removeAt(e.index); // not on the main list, remove from view list
                        }
                        else { // remove duplicates
                            for (var i = 0; i < this._viewLists.length; i++) {
                                if (this._viewLists[i] != arr) {
                                    var list = this._viewLists[i];
                                    var index = list.indexOf(e.item);
                                    if (index > -1) {
                                        list.removeAt(index);
                                    }
                                }
                            }
                        }
                    }
                    // rule 3: honor maxItems
                    if (wijmo.isNumber(arr.maxItems) && arr.maxItems > -1) {
                        while (arr.length > arr.maxItems) {
                            var index = arr.length - 1;
                            if (arr[index] == e.item && index > 0) {
                                index--;
                            }
                            arr.removeAt(index);
                        }
                    }
                }
                // notify and be done
                this.onViewDefinitionChanged();
                this.invalidate();
            };
            // handle changes to field properties
            /*private*/ PivotEngine.prototype._fieldPropertyChanged = function (field, e) {
                // raise viewDefinitionChanged
                this.onViewDefinitionChanged();
                // if the field is not active, we're done
                if (!field.isActive) {
                    return;
                }
                // take action depending on the property that changed
                var prop = e.propertyName;
                // changing the visible property of a field does not require any updates
                if (prop == 'visible') {
                    return;
                }
                // changing width, wordWrap or isContentHtml only requires a view refresh
                // (no need to update or re-summarize)
                if (prop == 'width' || prop == 'wordWrap' || prop == 'isContentHtml') {
                    this._pivotView.refresh();
                    return;
                }
                // changing the format of a value field only requires a view refresh 
                // (no need to update or re-summarize)
                if (prop == 'format' && this.valueFields.indexOf(field) > -1) {
                    this._pivotView.refresh();
                    return;
                }
                // changing the showAs property requires view update
                // (no need to re-summarize)
                if (prop == 'showAs') {
                    if (this.valueFields.indexOf(field) > -1 && !this.isUpdating) {
                        this._updatePivotView();
                    }
                    return;
                }
                // changing the descending property requires view update 
                // (no need to re-summarize)
                if (prop == 'descending') {
                    this._updatePivotView();
                    return;
                }
                // changing the aggregate property requires re-generation
                // on the server, view update on the client
                if (prop == 'aggregate') {
                    if (this.valueFields.indexOf(field) > -1 && !this.isUpdating) {
                        if (this._server) {
                            this._updateView(); // update the summaries
                        }
                        else {
                            this._updatePivotView(); // update the view
                        }
                    }
                    return;
                }
                // refresh the whole view (summarize and regenerate)
                this.invalidate();
            };
            // copy properties from a source object to a destination object
            /*private*/ PivotEngine.prototype._copyProps = function (dst, src, props) {
                for (var i = 0; i < props.length; i++) {
                    var prop = props[i];
                    if (src[prop] != null) {
                        dst[prop] = src[prop];
                    }
                }
            };
            // gets a copy of a field for inclusion in a viewDefinition string
            PivotEngine.prototype._getFieldFromDefinition = function (fldDef) {
                // remove filter proxy from definition (TFS 293422)
                var filterProxy = fldDef.filter;
                if (fldDef.filter) {
                    delete fldDef.filter;
                }
                // create field and filter
                var fld = this._createField(fldDef, true); // TFS 293397, 294121
                if (filterProxy) {
                    fld._setFilterProxy(filterProxy);
                    fldDef.filter = filterProxy;
                }
                // field is ready
                return fld;
            };
            // gets a field definition including any sub-fields
            PivotEngine.prototype._getFieldDefinition = function (fld) {
                var _this = this;
                var fldDef = {
                    binding: fld.binding,
                    header: fld.header,
                    dataType: fld.dataType,
                    aggregate: fld.aggregate,
                    showAs: fld.showAs,
                    descending: fld.descending,
                    format: fld.format,
                    align: fld.align,
                    wordWrap: fld.wordWrap,
                    width: fld.width,
                    isContentHtml: fld.isContentHtml
                };
                if (fld.weightField) {
                    fldDef.weightField = fld.weightField._getName();
                }
                if (fld.key) {
                    fldDef.key = fld.key;
                }
                if (fld.filter.isActive) {
                    fldDef.filter = fld._getFilterProxy();
                }
                if (fld._hasSubFields()) {
                    fldDef.subFields = [];
                    fld.subFields.forEach(function (subField) {
                        fldDef.subFields.push(_this._getFieldDefinition(subField));
                    });
                }
                if (fld instanceof olap.CubePivotField) {
                    fldDef.dimensionType = fld.dimensionType;
                }
                return fldDef;
            };
            // persist view field collections
            PivotEngine.prototype._getFieldCollectionProxy = function (arr) {
                var proxy = {
                    items: []
                };
                if (wijmo.isNumber(arr.maxItems) && arr.maxItems > -1) {
                    proxy.maxItems = arr.maxItems;
                }
                for (var i = 0; i < arr.length; i++) {
                    var fld = arr[i];
                    proxy.items.push(fld.key);
                }
                return proxy;
            };
            PivotEngine.prototype._setFieldCollectionProxy = function (arr, proxy) {
                arr.clear();
                arr.maxItems = wijmo.isNumber(proxy.maxItems) ? proxy.maxItems : null;
                for (var i = 0; i < proxy.items.length; i++) {
                    arr.push(proxy.items[i]);
                }
            };
            // batch size/delay for async processing
            PivotEngine._BATCH_SIZE = 10000;
            PivotEngine._BATCH_TIMEOUT = 0;
            PivotEngine._BATCH_DELAY = 100;
            // serializable properties
            PivotEngine._props = [
                'showZeros',
                'showRowTotals',
                'showColumnTotals',
                'totalsBeforeData',
                'sortableGroups',
                'defaultFilterType'
            ];
            return PivotEngine;
        }());
        olap.PivotEngine = PivotEngine;
        /**
         * Provides arguments for progress events.
         */
        var ProgressEventArgs = /** @class */ (function (_super) {
            __extends(ProgressEventArgs, _super);
            /**
             * Initializes a new instance of the {@link ProgressEventArgs} class.
             *
             * @param progress Number between 0 and 100 that represents the progress.
             */
            function ProgressEventArgs(progress) {
                var _this = _super.call(this) || this;
                _this._progress = wijmo.asNumber(progress);
                return _this;
            }
            Object.defineProperty(ProgressEventArgs.prototype, "progress", {
                /**
                 * Gets the current progress as a number between 0 and 100.
                 */
                get: function () {
                    return this._progress;
                },
                enumerable: true,
                configurable: true
            });
            return ProgressEventArgs;
        }(wijmo.EventArgs));
        olap.ProgressEventArgs = ProgressEventArgs;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Context Menu for {@link ListBox} controls containing {@link PivotField} objects.
         */
        var _ListContextMenu = /** @class */ (function (_super) {
            __extends(_ListContextMenu, _super);
            /**
             * Initializes a new instance of the {@link _ListContextMenu} class.
             *
             * @param full Whether to include all commands or only the ones that apply to the main field list.
             */
            function _ListContextMenu(full) {
                var _this = 
                // initialize the menu
                _super.call(this, document.createElement('div'), {
                    header: 'Field Context Menu',
                    displayMemberPath: 'text',
                    commandParameterPath: 'parm',
                    command: {
                        executeCommand: function (parm) {
                            _this._execute(parm);
                        },
                        canExecuteCommand: function (parm) {
                            return _this._canExecute(parm);
                        }
                    }
                }) || this;
                // finish initializing (after call to super)
                _this._full = full;
                _this.itemsSource = _this._getMenuItems(full);
                // add a class to allow CSS customization
                wijmo.addClass(_this.dropDown, 'context-menu wj-olap-context-menu');
                return _this;
            }
            // refresh menu items in case culture changed
            _ListContextMenu.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this.itemsSource = this._getMenuItems(this._full);
                _super.prototype.refresh.call(this, fullUpdate);
            };
            /**
             * Attaches this context menu to a {@link FlexGrid} control.
             *
             * @param grid {@link FlexGrid} control to attach this menu to.
             */
            _ListContextMenu.prototype.attach = function (grid) {
                var _this = this;
                wijmo.assert(grid instanceof wijmo.grid.FlexGrid, 'Expecting a FlexGrid control...');
                var owner = grid.hostElement;
                owner.addEventListener('contextmenu', function (e) {
                    // select the item that was clicked
                    if (_this._selectField(grid, e)) {
                        // prevent default context menu
                        e.preventDefault();
                        // show the menu
                        _this.owner = owner;
                        _this.show(e);
                    }
                });
            };
            // ** implementation
            // select the field that was clicked before showing the context menu
            _ListContextMenu.prototype._selectField = function (grid, e) {
                // check that this is a valid cell
                var ht = grid.hitTest(e);
                if (ht.panel != grid.cells || !ht.range.isValid) {
                    return false;
                }
                // no context menu for parent fields
                var fld = grid.rows[ht.row].dataItem;
                if (fld instanceof olap.CubePivotField && fld.subFields && fld.subFields.length) {
                    return false;
                }
                // select field and return true to show the menu
                grid.select(ht.range, true);
                return true;
            };
            // get the items used to populate the menu
            _ListContextMenu.prototype._getMenuItems = function (full) {
                var items;
                // build list (asterisks represent text that will be localized)
                if (full) {
                    items = [
                        { text: '<div class="menu-icon"></div>*', parm: 'up' },
                        { text: '<div class="menu-icon"></div>*', parm: 'down' },
                        { text: '<div class="menu-icon"></div>*', parm: 'first' },
                        { text: '<div class="menu-icon"></div>*', parm: 'last' },
                        { text: '<div class="wj-separator"></div>' },
                        { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*', parm: 'filter' },
                        { text: '<div class="menu-icon">&#8801;</div>*', parm: 'rows' },
                        { text: '<div class="menu-icon">&#10996;</div>*', parm: 'cols' },
                        { text: '<div class="menu-icon">&#931;</div>*', parm: 'vals' },
                        { text: '<div class="wj-separator"></div>' },
                        { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>*', parm: 'remove' },
                        { text: '<div class="wj-separator"></div>' },
                        { text: '<div class="menu-icon">&#9965;</div>*', parm: 'edit' }
                    ];
                }
                else {
                    items = [
                        { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*', parm: 'filter' },
                        { text: '<div class="menu-icon">&#8801;</div>*', parm: 'rows' },
                        { text: '<div class="menu-icon">&#10996;</div>*', parm: 'cols' },
                        { text: '<div class="menu-icon">&#931;</div>*', parm: 'vals' },
                        { text: '<div class="wj-separator"></div>' },
                        { text: '<div class="menu-icon">&#9965;</div>*', parm: 'edit' }
                    ];
                }
                // localize items
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.parm) {
                        var text = wijmo.culture.olap._ListContextMenu[item.parm];
                        wijmo.assert(text, 'missing localized text for item ' + item.parm);
                        item.text = item.text.replace(/([^>]+$)/, text);
                    }
                }
                // return localized items
                return items;
            };
            // execute the menu commands
            _ListContextMenu.prototype._execute = function (parm) {
                var grid = wijmo.Control.getControl(this.owner), flds = grid.itemsSource, row = grid.selection.row, fld = grid.rows[row].dataItem, ng = fld ? fld.engine : null, target = this._getTargetList(ng, parm);
                switch (parm) {
                    // move field within the list
                    case 'up':
                    case 'first':
                    case 'down':
                    case 'last':
                        if (ng) {
                            var index_1 = flds.indexOf(fld), newIndex_1 = parm == 'up' ? index_1 - 1 :
                                parm == 'first' ? 0 :
                                    parm == 'down' ? index_1 + 1 :
                                        parm == 'last' ? flds.length :
                                            -1;
                            ng.deferUpdate(function () {
                                flds.removeAt(index_1);
                                flds.insert(newIndex_1, fld);
                            });
                        }
                        break;
                    // move/copy field to a different list
                    case 'filter':
                    case 'rows':
                    case 'cols':
                    case 'vals':
                        if (target && fld) {
                            target.push(fld);
                        }
                        break;
                    // remove this field from the list
                    case 'remove':
                        if (fld) {
                            ng.removeField(fld);
                        }
                        break;
                    // edit this field's settings
                    case 'edit':
                        if (fld) {
                            ng.editField(fld);
                        }
                        break;
                }
            };
            _ListContextMenu.prototype._canExecute = function (parm) {
                // sanity
                var grid = wijmo.Control.getControl(this.owner);
                if (!grid) {
                    return false;
                }
                // go to work
                var row = grid.selection.row, fld = row > -1 ? grid.rows[row].dataItem : null, ng = fld ? fld.engine : null, target = this._getTargetList(ng, parm), cube = fld ? fld instanceof olap.CubePivotField : false, measure = fld ? fld.isMeasure : false;
                // check whether the command can be executed in the current context
                switch (parm) {
                    // disable moving first item up/first
                    case 'up':
                    case 'first':
                        return row > 0;
                    // disable moving last item down/last
                    case 'down':
                    case 'last':
                        return row < grid.rows.length - 1;
                    // disable moving to lists that contain the target
                    case 'filter':
                    case 'rows':
                    case 'cols':
                        return !measure && target && target.indexOf(fld) < 0;
                    case 'vals':
                        return (!cube || measure) && target && target.indexOf(fld) < 0;
                    // edit fields only if the engine allows it
                    case 'edit':
                        return ng && ng.allowFieldEditing;
                    // cubes don't show details...
                    case 'detail':
                        return fld && !cube;
                }
                // all else is OK
                return true;
            };
            // get target list for a command
            _ListContextMenu.prototype._getTargetList = function (engine, parm) {
                if (engine) {
                    switch (parm) {
                        case 'filter':
                            return engine.filterFields;
                        case 'rows':
                            return engine.rowFields;
                        case 'cols':
                            return engine.columnFields;
                        case 'vals':
                            return engine.valueFields;
                    }
                }
                return null;
            };
            return _ListContextMenu;
        }(wijmo.input.Menu));
        olap._ListContextMenu = _ListContextMenu;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Provides a user interface for interactively transforming regular data tables into Olap
         * pivot tables.
         *
         * Olap pivot tables group data into one or more dimensions. The dimensions are represented
         * by rows and columns on a grid, and the summarized data is stored in the grid cells.
         *
         * Use the {@link itemsSource} property to set the source data, and the {@link pivotView}
         * property to get the output table containing the summarized data.
         */
        var PivotPanel = /** @class */ (function (_super) {
            __extends(PivotPanel, _super);
            /**
             * Initializes a new instance of the {@link PivotPanel} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function PivotPanel(element, options) {
                var _this = _super.call(this, element, null, true) || this;
                // property storage
                _this._showIcons = true;
                _this._restrictDrag = null;
                /**
                 * Occurs after the value of the {@link deferredUpdate} property changes.
                 */
                _this.deferredUpdateChanged = new wijmo.Event();
                /**
                 * Occurs after the value of the {@link itemsSource} property changes.
                 */
                _this.itemsSourceChanged = new wijmo.Event();
                /**
                 * Occurs after the view definition changes.
                 */
                _this.viewDefinitionChanged = new wijmo.Event();
                /**
                 * Occurs when the engine starts updating the {@link pivotView} list.
                 */
                _this.updatingView = new wijmo.Event();
                /**
                 * Occurs after the engine has finished updating the {@link pivotView} list.
                 */
                _this.updatedView = new wijmo.Event();
                _this._isUpdatingChangedBnd = _this._isUpdatingChanged.bind(_this);
                // check dependencies
                // let depErr = 'Missing dependency: PivotPanel requires ';
                // assert(input != null, depErr + 'wijmo.input.');
                // assert(grid != null && grid.filter != null, depErr + 'wijmo.grid.filter.');
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-pivotpanel', tpl, {
                    _dFields: 'd-fields',
                    _dFilters: 'd-filters',
                    _dRows: 'd-rows',
                    _dCols: 'd-cols',
                    _dVals: 'd-vals',
                    _dProgress: 'd-prog',
                    _btnUpdate: 'btn-update',
                    _chkDefer: 'chk-defer',
                    _gFlds: 'g-flds',
                    _gDrag: 'g-drag',
                    _gFlt: 'g-flt',
                    _gCols: 'g-cols',
                    _gRows: 'g-rows',
                    _gVals: 'g-vals',
                    _gDefer: 'g-defer'
                });
                // globalization
                _this._globalize();
                // enable drag/drop
                var host = _this.hostElement;
                _this.addEventListener(host, 'dragstart', _this._dragstart.bind(_this));
                _this.addEventListener(host, 'dragover', _this._dragover.bind(_this));
                _this.addEventListener(host, 'dragleave', _this._dragover.bind(_this));
                _this.addEventListener(host, 'drop', _this._drop.bind(_this));
                _this.addEventListener(host, 'dragend', _this._dragend.bind(_this));
                // create child controls
                _this._lbFields = _this._createFieldGrid(_this._dFields);
                _this._lbFilters = _this._createFieldGrid(_this._dFilters);
                _this._lbRows = _this._createFieldGrid(_this._dRows);
                _this._lbCols = _this._createFieldGrid(_this._dCols);
                _this._lbVals = _this._createFieldGrid(_this._dVals);
                // add context menus to the controls
                var ctx = _this._ctxMenuShort = new olap._ListContextMenu(false);
                ctx.attach(_this._lbFields);
                ctx = _this._ctxMenuFull = new olap._ListContextMenu(true);
                ctx.attach(_this._lbFilters);
                ctx.attach(_this._lbRows);
                ctx.attach(_this._lbCols);
                ctx.attach(_this._lbVals);
                // create target indicator element
                _this._dMarker = wijmo.createElement('<div class="wj-marker" style="display:none">&nbsp;</div>');
                _this.hostElement.appendChild(_this._dMarker);
                // handle defer update/update buttons
                _this.addEventListener(_this._btnUpdate, 'click', function (e) {
                    _this._ng.refresh(true);
                    _this.refresh();
                    e.preventDefault();
                });
                _this.addEventListener(_this._chkDefer, 'click', function (e) {
                    _this.deferredUpdate = _this._chkDefer.checked;
                    _this._updateDeferredUpdateElements(); // reflect current engine state (for nested PivotEngine.beginUpdate calls)
                });
                // create default engine
                _this.engine = new olap.PivotEngine();
                // apply options
                _this.initialize(options);
                return _this;
            }
            PivotPanel.prototype._getProductInfo = function () {
                return 'D6F4,PivotPanel';
            };
            Object.defineProperty(PivotPanel.prototype, "engine", {
                // ** object model
                /**
                 * Gets or sets the {@link PivotEngine} being controlled by this {@link PivotPanel}.
                 */
                get: function () {
                    return this._ng;
                },
                set: function (value) {
                    var _this = this;
                    var ng = this._ng;
                    var prevDeferredUpdate;
                    // remove old handlers
                    if (ng) {
                        ng.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
                        ng.viewDefinitionChanged.removeHandler(this._viewDefinitionChanged);
                        ng.updatingView.removeHandler(this._updatingView);
                        ng.updatedView.removeHandler(this._updatedView);
                        ng.error.removeHandler(this._requestError);
                        ng._isUpdatingChanged.removeHandler(this._isUpdatingChangedBnd);
                        prevDeferredUpdate = this.deferredUpdate;
                    }
                    // save the new value
                    value = wijmo.asType(value, olap.PivotEngine, false);
                    ng = this._ng = value;
                    // add new handlers
                    ng.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
                    ng.viewDefinitionChanged.addHandler(this._viewDefinitionChanged, this);
                    ng.updatingView.addHandler(this._updatingView, this);
                    ng.updatedView.addHandler(this._updatedView, this);
                    ng.error.addHandler(this._requestError, this);
                    ng._isUpdatingChanged.addHandler(this._isUpdatingChangedBnd);
                    if (prevDeferredUpdate !== this.deferredUpdate) {
                        this.onDeferredUpdateChanged();
                    }
                    // update grid data sources
                    this._lbFields.itemsSource = value.fields;
                    this._lbFilters.itemsSource = value.filterFields;
                    this._lbRows.itemsSource = value.rowFields;
                    this._lbCols.itemsSource = value.columnFields;
                    this._lbVals.itemsSource = value.valueFields;
                    // hide field clones in fields list
                    this._lbFields.collectionView.filter = function (item) {
                        return item.visible && item.parentField == null;
                    };
                    // hide invisible fields in all lists
                    'Filters,Rows,Cols,Vals'.split(',').forEach(function (name) {
                        _this['_lb' + name].collectionView.filter = function (item) {
                            return item.visible;
                        };
                    });
                    this._updateDeferredUpdateElements();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "itemsSource", {
                /**
                 * Gets or sets the array or {@link ICollectionView} that contains the raw data.
                 */
                get: function () {
                    return this._ng.itemsSource;
                },
                set: function (value) {
                    if (value instanceof olap.PivotEngine) {
                        this.engine = value;
                    }
                    else {
                        this._ng.itemsSource = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} that contains the raw data.
                 */
                get: function () {
                    return this._ng.collectionView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "pivotView", {
                /**
                 * Gets the {@link ICollectionView} containing the output pivot view.
                 */
                get: function () {
                    return this._ng.pivotView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "autoGenerateFields", {
                /**
                 * Gets or sets a value that determines whether the engine should populate
                 * the {@link fields} collection automatically based on the {@link itemsSource}.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this.engine.autoGenerateFields;
                },
                set: function (value) {
                    this._ng.autoGenerateFields = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "fields", {
                /**
                 * Gets the list of fields available for building views.
                 */
                get: function () {
                    return this._ng.fields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "rowFields", {
                /**
                 * Gets the list of fields that define the rows in the output table.
                 */
                get: function () {
                    return this._ng.rowFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "columnFields", {
                /**
                 * Gets the list of fields that define the columns in the output table.
                 */
                get: function () {
                    return this._ng.columnFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "valueFields", {
                /**
                 * Gets the list of fields that define the values shown in the output table.
                 */
                get: function () {
                    return this._ng.valueFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "filterFields", {
                /**
                 * Gets the list of fields that define filters applied while generating the output table.
                 */
                get: function () {
                    return this._ng.filterFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "viewDefinition", {
                /**
                 * Gets or sets the current pivot view definition as a JSON string.
                 *
                 * This property is typically used to persist the current view as
                 * an application setting.
                 *
                 * For example, the code below implements two functions that save
                 * and load view definitions using local storage:
                 *
                 * ```typescript
                 * // save/load views
                 * function saveView() {
                 *   localStorage.viewDefinition = pivotPanel.viewDefinition;
                 * }
                 * function loadView() {
                 *   pivotPanel.viewDefinition = localStorage.viewDefinition;
                 * }
                 * ```
                 */
                get: function () {
                    return this._ng.viewDefinition;
                },
                set: function (value) {
                    this._ng.viewDefinition = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "isViewDefined", {
                /**
                 * Gets a value that determines whether a pivot view is currently defined.
                 *
                 * A pivot view is defined if the {@link valueFields} list is not empty and
                 * either the {@link rowFields} or {@link columnFields} lists are not empty.
                 */
                get: function () {
                    return this._ng.isViewDefined;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "showFieldIcons", {
                /**
                 * Gets or sets a value that determines whether the main field list should
                 * include icons indicating whether fields are measure or dimension fields.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showIcons;
                },
                set: function (value) {
                    if (value != this._showIcons) {
                        this._showIcons = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "restrictDragging", {
                /**
                 * Gets or sets a value that determines whether the panel should restrict
                 * drag operations based on field types.
                 *
                 * Setting this property to true prevents dragging dimension fields into
                 * the value field list and measure fields into the row or column field
                 * lists.
                 *
                 * Setting this property to false allows all drag operations.
                 *
                 * The default value for this property is **null**, which
                 * allows all drag operations on regular data sources and
                 * restricts dragging on cube data sources.
                 */
                get: function () {
                    return this._restrictDrag;
                },
                set: function (value) {
                    this._restrictDrag = wijmo.asBoolean(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotPanel.prototype, "deferredUpdate", {
                /**
                 * Gets or sets a value that determines whether engine is in deferred update state or not.
                 */
                get: function () {
                    return this.engine.isUpdating;
                },
                set: function (value) {
                    if (this.deferredUpdate != value) {
                        if (value) {
                            this._ng.beginUpdate();
                        }
                        else {
                            this._ng.endUpdate();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link deferredUpdateChanged} event.
             */
            PivotPanel.prototype.onDeferredUpdateChanged = function (e) {
                this.deferredUpdateChanged.raise(this, e);
            };
            /**
             * Raises the {@link itemsSourceChanged} event.
             */
            PivotPanel.prototype.onItemsSourceChanged = function (e) {
                this.itemsSourceChanged.raise(this, e);
            };
            /**
             * Raises the {@link viewDefinitionChanged} event.
             */
            PivotPanel.prototype.onViewDefinitionChanged = function (e) {
                this.viewDefinitionChanged.raise(this, e);
            };
            /**
             * Raises the {@link updatingView} event.
             *
             * @param e {@link ProgressEventArgs} that provides the event data.
             */
            PivotPanel.prototype.onUpdatingView = function (e) {
                this.updatingView.raise(this, e);
            };
            /**
             * Raises the {@link updatedView} event.
             */
            PivotPanel.prototype.onUpdatedView = function (e) {
                this.updatedView.raise(this, e);
            };
            // ** overrides
            // refresh field lists and culture strings when refreshing the control
            PivotPanel.prototype.refresh = function (fullUpdate) {
                var _this = this;
                if (fullUpdate === void 0) { fullUpdate = true; }
                if (this.hostElement) { // TFS 438146
                    // refresh field lists
                    ['Fields', 'Filters', 'Rows', 'Cols', 'Vals'].forEach(function (name) {
                        var list = _this['_lb' + name], view = list ? list.collectionView : null;
                        if (list && view) {
                            list.refresh();
                            view.refresh();
                        }
                    });
                    // refresh culture strings
                    if (fullUpdate) {
                        this._globalize();
                        this._ctxMenuShort.refresh();
                        this._ctxMenuFull.refresh();
                    }
                }
                // allow base class
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // ** implementation
            // method used in JSON-style initialization
            PivotPanel.prototype._copy = function (key, value) {
                switch (key) {
                    case 'engine':
                        this.engine = value;
                        return true;
                }
                return false;
            };
            // apply/refresh culture-specific strings
            PivotPanel.prototype._globalize = function () {
                var ci = wijmo.culture.olap.PivotPanel;
                wijmo.setText(this._gFlds, ci.fields);
                wijmo.setText(this._gDrag, ci.drag);
                wijmo.setText(this._gFlt, ci.filters);
                wijmo.setText(this._gCols, ci.cols);
                wijmo.setText(this._gRows, ci.rows);
                wijmo.setText(this._gVals, ci.vals);
                wijmo.setText(this._gDefer, ci.defer);
                wijmo.setText(this._btnUpdate, ci.update);
            };
            // handle and forward events raised by the engine
            PivotPanel.prototype._itemsSourceChanged = function (s, e) {
                this.onItemsSourceChanged(e);
            };
            PivotPanel.prototype._viewDefinitionChanged = function (s, e) {
                this.invalidate();
                this.onViewDefinitionChanged(e);
            };
            PivotPanel.prototype._updatingView = function (s, e) {
                var pct = wijmo.clamp(e.progress, 5, 100) % 100; // start from 5, done at 100
                this._dProgress.style.width = pct + '%';
                this.onUpdatingView(e);
            };
            PivotPanel.prototype._updatedView = function (s, e) {
                this.onUpdatedView(e);
            };
            PivotPanel.prototype._requestError = function (s, e) {
                this._dProgress.style.width = '0'; // hide progress bar on errors
            };
            PivotPanel.prototype._isUpdatingChanged = function () {
                this._updateDeferredUpdateElements();
                this.onDeferredUpdateChanged();
            };
            // update states of deferred update checkbox and button
            PivotPanel.prototype._updateDeferredUpdateElements = function () {
                var deferredUpdate = this.deferredUpdate;
                this._chkDefer.checked = deferredUpdate;
                wijmo.enable(this._btnUpdate, deferredUpdate);
            };
            // create a FlexGrid for showing olap fields (draggable)
            PivotPanel.prototype._createFieldGrid = function (host) {
                var _this = this;
                // create the FlexGrid
                var grid = new wijmo.grid.FlexGrid(host, {
                    autoGenerateColumns: false,
                    childItemsPath: 'subFields',
                    columns: [
                        { binding: 'header', width: '*' }
                    ],
                    headersVisibility: 'None',
                    selectionMode: 'Cell',
                    alternatingRowStep: 0
                });
                // we don't need horizontal scrollbars
                var root = grid.cells.hostElement.parentElement;
                root.style.overflowX = 'hidden';
                // make items draggable, show active/filter/aggregate indicators
                grid.formatItem.addHandler(function (s, e) {
                    // get data item
                    var fld = s.rows[e.row].dataItem;
                    wijmo.assert(fld instanceof olap.PivotField, 'PivotField expected...');
                    // special formatting/dragging behavior for header fields
                    var isHeader = fld._hasSubFields();
                    wijmo.toggleClass(e.cell, 'wj-header', isHeader);
                    e.cell.setAttribute('draggable', (!isHeader).toString());
                    // customize content
                    var html = e.cell.innerHTML;
                    // show filter indicator
                    if (fld.filter.isActive) {
                        html += '&nbsp;&nbsp;<span class="wj-glyph-filter"></span>';
                    }
                    // show aggregate type in value field list
                    if (s == _this._lbVals) {
                        // no localization here, the names are too long...
                        //let aggs = wijmo.culture.olap.PivotFieldEditor.aggs,
                        //    aggName = aggs[Object.keys(aggs)[fld.aggregate]];
                        html += ' <span class="wj-aggregate">(' + wijmo.Aggregate[fld.aggregate] + ')</span>';
                    }
                    // add icons and checkboxes to items in the main field list
                    if (s == _this._lbFields && !isHeader) {
                        // icon
                        if (_this._showIcons) {
                            var fldType = fld.isMeasure ? 'measure' : 'dimension';
                            html = '<span class="wj-glyph-' + fldType + '"></span> ' + html;
                        }
                        // checkbox
                        html = '<label><input type="checkbox"' +
                            (fld.isActive ? ' checked' : '') +
                            '> ' + html + '</label>';
                    }
                    // update cell content
                    e.cell.innerHTML = html;
                });
                // handle checkboxes
                grid.addEventListener(host, 'click', function (e) {
                    var check = e.target;
                    if (check instanceof HTMLInputElement && check.type == 'checkbox') {
                        var fld = _this._hitTestField(grid, e);
                        if (fld instanceof olap.PivotField) {
                            fld.isActive = check.checked;
                        }
                    }
                });
                // return the FlexGrid
                return grid;
            };
            // drag/drop event handlers
            PivotPanel.prototype._dragstart = function (e) {
                var target = this._getFlexGridTarget(e);
                if (target) {
                    // select field under the mouse, save drag source
                    this._dragField = this._hitTestField(target, e);
                    this._dragSource = this._dragField instanceof olap.PivotField
                        ? target.hostElement
                        : null;
                    // start drag operation
                    if (this._dragSource && e.dataTransfer) {
                        wijmo._startDrag(e.dataTransfer, 'copyMove');
                        e.stopPropagation();
                    }
                }
            };
            PivotPanel.prototype._dragover = function (e) {
                // check whether the move is valid
                var valid = false;
                // get target location
                var target = this._getFlexGridTarget(e);
                if (target && this._dragField) {
                    // dragging from main list to view (valid if the target does not contain the item)
                    if (this._dragSource == this._dFields && target != this._lbFields) {
                        // check that the target is not full
                        var list = target.itemsSource;
                        if (list.maxItems == null || list.length < list.maxItems) {
                            // check that the target does not contain the item (or is the values list)
                            var fld = this._dragField;
                            if (target.itemsSource.indexOf(fld) < 0) {
                                valid = true;
                            }
                            else if (target == this._lbVals) {
                                valid = fld instanceof olap.CubePivotField ? false : true;
                            }
                        }
                    }
                    // dragging view to main list (to delete the field) or within view lists
                    if (this._dragSource && this._dragSource != this._dFields) {
                        valid = true;
                    }
                }
                // prevent invalid moves
                if (valid && this._getRestrictDrag()) {
                    if (this._dragSource != target.hostElement) {
                        var isMeasure = this._dragField.isMeasure;
                        if (target == this._lbVals) {
                            valid = isMeasure;
                        }
                        else if (target == this._lbRows || target == this._lbCols) {
                            valid = !isMeasure;
                        }
                    }
                }
                // update marker and drop effect
                if (valid) {
                    this._updateDropMarker(target, e);
                    e.dataTransfer.dropEffect = this._dragSource == this._dFields ? 'copy' : 'move';
                    e.preventDefault();
                    e.stopPropagation();
                }
                else {
                    this._updateDropMarker();
                }
            };
            PivotPanel.prototype._drop = function (e) {
                var _this = this;
                // perform drop operation
                var target = this._getFlexGridTarget(e);
                if (target && this._dragField) {
                    var source = wijmo.Control.getControl(this._dragSource), fld_2 = this._dragField;
                    // if dragging a duplicate from main list to value list, 
                    // make a clone, add it do the main list, and continue as usual
                    if (source == this._lbFields && target == this._lbVals) {
                        if (target.itemsSource.indexOf(fld_2) > -1) {
                            fld_2 = fld_2._clone();
                            this.engine.fields.push(fld_2);
                        }
                    }
                    // if the target is the main list, remove from source
                    // otherwise, add to or re-position field in target list
                    if (target == this._lbFields) {
                        fld_2.isActive = false;
                    }
                    else {
                        this._ng.deferUpdate(function () {
                            var items = target.itemsSource, index = items.indexOf(fld_2);
                            if (index != _this._dropIndex) {
                                if (index > -1) {
                                    items.removeAt(index);
                                    if (index < _this._dropIndex) {
                                        _this._dropIndex--;
                                    }
                                }
                                items.insert(_this._dropIndex, fld_2);
                            }
                        });
                    }
                }
                // always reset the mouse state when done
                this._resetMouseState();
            };
            PivotPanel.prototype._dragend = function (e) {
                this._resetMouseState();
            };
            // select and return the field at the given mouse position
            PivotPanel.prototype._hitTestField = function (grid, e) {
                // use hit-test on target element because IE sends wrong mouse
                // coordinates when clicking the label and not the checkbox (TFS 247212)
                var ht = grid.hitTest(e.target);
                if (ht.panel == grid.cells && ht.range.isValid) {
                    grid.select(ht.range, true);
                    return grid.rows[ht.row].dataItem;
                }
                return null;
            };
            // check field types when dragging?
            PivotPanel.prototype._getRestrictDrag = function () {
                var restrict = this._restrictDrag;
                if (restrict == null && this.fields.length) {
                    restrict = this.fields[0] instanceof olap.CubePivotField;
                }
                return restrict;
            };
            // reset the mouse state after a drag operation
            PivotPanel.prototype._resetMouseState = function () {
                this._dragSource = null;
                this._updateDropMarker();
            };
            // gets the FlexGrid that contains the target of a drag event
            PivotPanel.prototype._getFlexGridTarget = function (e) {
                var grid = wijmo.Control.getControl(wijmo.closest(e.target, '.wj-flexgrid'));
                return grid instanceof wijmo.grid.FlexGrid ? grid : null;
            };
            // show the drop marker
            PivotPanel.prototype._updateDropMarker = function (grid, e) {
                // hide marker
                if (!e) {
                    this._dMarker.style.display = 'none';
                    return;
                }
                // get target rect and drop index
                var host = this.hostElement, rcHost = host.getBoundingClientRect(), rc;
                if (!grid.rows.length) { // if grid is empty, drop at index 0
                    rc = wijmo.Rect.fromBoundingRect(grid.hostElement.getBoundingClientRect());
                    rc.top += 4;
                    this._dropIndex = 0;
                }
                else { // drop at current position
                    var ht = grid.hitTest(e), row = ht.row;
                    if (row > -1) {
                        // dropping before or after a row
                        rc = grid.getCellBoundingRect(row, 0);
                        if (e.clientY > host.scrollTop + rc.top + rc.height / 2) {
                            if (row < grid.rows.length) {
                                rc.top += rc.height;
                                row++;
                            }
                        }
                        this._dropIndex = row;
                    }
                    else { // dropping after the last row
                        row = grid.viewRange.bottomRow;
                        rc = grid.getCellBoundingRect(row, 0);
                        rc.top += rc.height;
                        this._dropIndex = row + 1;
                    }
                }
                // show the drop marker
                wijmo.setCss(this._dMarker, {
                    left: Math.round(rc.left - rcHost.left) + host.scrollLeft,
                    top: Math.round(rc.top - rcHost.top - 2) + host.scrollTop,
                    width: Math.round(rc.width),
                    height: 4,
                    display: ''
                });
            };
            /**
             * Gets or sets the template used to instantiate {@link PivotPanel} controls.
             */
            PivotPanel.controlTemplate = '<div>' +
                // fields
                '<label wj-part="g-flds"></label>' +
                '<div wj-part="d-fields"></div>' +
                // drag/drop area
                '<label wj-part="g-drag"></label>' +
                '<table>' +
                '<tr>' +
                '<td width="50%">' +
                '<label><span class="wj-glyph wj-glyph-filter"></span> <span wj-part="g-flt"></span></label>' +
                '<div wj-part="d-filters"></div>' +
                '</td>' +
                '<td width= "50%" style="border-left-style:solid">' +
                '<label><span class="wj-glyph">&#10996;</span> <span wj-part="g-cols"></span></label>' +
                '<div wj-part="d-cols"></div>' +
                '</td>' +
                '</tr>' +
                '<tr style="border-top-style:solid">' +
                '<td width="50%">' +
                '<label><span class="wj-glyph">&#8801;</span> <span wj-part="g-rows"></span></label>' +
                '<div wj-part="d-rows"></div>' +
                '</td>' +
                '<td width= "50%" style="border-left-style:solid">' +
                '<label><span class="wj-glyph">&#931;</span> <span wj-part="g-vals"></span></label>' +
                '<div wj-part="d-vals"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                // progress indicator
                '<div wj-part="d-prog" class="wj-state-selected" style="width:0px;height:3px"></div>' +
                // update panel
                '<div style="display:table">' +
                '<label style="display:table-cell;vertical-align:middle">' +
                '<input wj-part="chk-defer" type="checkbox"/> <span wj-part="g-defer"></span>' +
                '</label>' +
                '<button wj-part="btn-update" class="wj-btn wj-state-disabled" style="float:right;margin:6px" disabled></button>' +
                '</div>' +
                '</div>';
            return PivotPanel;
        }(wijmo.Control));
        olap.PivotPanel = PivotPanel;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Extends the {@link FlexGrid} control to display pivot tables.
         *
         * To use this control, set its {@link itemsSource} property to an instance of a
         * {@link PivotPanel} control or to a {@link PivotEngine}.
         */
        var PivotGrid = /** @class */ (function (_super) {
            __extends(PivotGrid, _super);
            /**
             * Initializes a new instance of the {@link PivotGrid} class.
             *
             * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PivotGrid(element, options) {
                var _this = _super.call(this, element) || this;
                _this._showDetailOnDoubleClick = true;
                _this._collapsibleSubtotals = true;
                _this._customCtxMenu = true;
                _this._ctxMenu = new olap._GridContextMenu();
                _this._showRowFldSort = false;
                _this._showRowFldHdrs = true;
                _this._showColFldHdrs = true;
                _this._showValFldHdrs = false;
                _this._centerVert = true;
                _this._collapsedKeys = {};
                _this._resizingColumn = false;
                _this._outlineMode = false;
                _this._ignoreClick = false;
                /*private*/ _this._colRowFields = new Map();
                // previous culture name to update fixed content on dynamically changed culture (WJM-19988)
                _this._prevCulture = wijmo.culture.Globalize.name;
                // suppress ambiguity for header columns defaultSize during period from initialization to first rendering
                _this._hdrCols._setDefaultSize(_this._cols.defaultSize);
                // add class name to enable styling
                wijmo.addClass(_this.hostElement, 'wj-pivotgrid');
                // change some defaults
                _this.isReadOnly = true;
                _this.copyHeaders = wijmo.grid.HeadersVisibility.All;
                _this.deferResizing = true;
                _this.alternatingRowStep = 0;
                _this.autoGenerateColumns = false;
                _this.allowDragging = wijmo.grid.AllowDragging.None;
                _this.allowMerging = wijmo.grid.AllowMerging.All;
                _this.mergeManager = new olap._PivotMergeManager();
                _this.customContextMenu = true;
                _this.treeIndent = 32;
                // apply options
                _this.initialize(options);
                // customize cell rendering
                _this.formatItem.addHandler(_this._formatItem, _this);
                // customize mouse/keyboard handling
                var host = _this.hostElement;
                _this.addEventListener(host, 'mousedown', _this._mousedown.bind(_this), true);
                _this.addEventListener(host, 'mouseup', _this._mouseup.bind(_this), true);
                _this.addEventListener(host, 'dblclick', _this._dblclick.bind(_this), true);
                _this.addEventListener(host, 'click', _this._click.bind(_this), true);
                _this.addEventListener(host, 'keydown', _this._keydown.bind(_this), true);
                // custom context menu
                _this._ctxMenu.attach(_this);
                return _this;
            }
            PivotGrid.prototype._getProductInfo = function () {
                return 'D6F4,PivotGrid';
            };
            Object.defineProperty(PivotGrid.prototype, "engine", {
                /**
                 * Gets a reference to the {@link PivotEngine} that owns this {@link PivotGrid}.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showDetailOnDoubleClick", {
                /**
                 * Gets or sets a value that determines whether the grid should show a popup
                 * containing the detail records when the user double-clicks a cell.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showDetailOnDoubleClick;
                },
                set: function (value) {
                    this._showDetailOnDoubleClick = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "detailDialog", {
                /**
                 * Gets a reference to the {@link DetailDialog} used to display the detail records
                 * when the user double-clicks a cell.
                 *
                 * This property can be used to customize the content of the {@link DetailDialog}.
                 *
                 * It can also be used to customize properties of the dialog, which is a {@link Popup}
                 * control. For example, this code disables the default animations used when
                 * showing and hiding the detail dialog:
                 *
                 * ```typscript
                 * let dlg = thePivotGrid.detailDialog;
                 * dlg.fadeIn = false;
                 * dlg.fadeOut = false;
                 * ```
                 *
                 * See also the {@link showDetailOnDoubleClick} property and the {@link showDetail}
                 * method.
                 */
                get: function () {
                    if (!this._dlgDetail) {
                        this._dlgDetail = new olap.DetailDialog(document.createElement('div'));
                    }
                    return this._dlgDetail;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showRowFieldHeaders", {
                /**
                 * Gets or sets a value that determines whether the grid should
                 * display row field headers in its top-left panel.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showRowFldHdrs;
                },
                set: function (value) {
                    if (value != this._showRowFldHdrs) {
                        this._showRowFldHdrs = wijmo.asBoolean(value);
                        this._updateFixedContent(); // TFS 257954
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showColumnFieldHeaders", {
                /**
                 * Gets or sets a value that determines whether the grid should
                 * display column field headers in its top-left panel.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showColFldHdrs;
                },
                set: function (value) {
                    if (value != this._showColFldHdrs) {
                        this._showColFldHdrs = wijmo.asBoolean(value);
                        this._updateFixedContent(); // TFS 257954
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showValueFieldHeaders", {
                /**
                 * Gets or sets a value that determines whether the grid should
                 * display value field headers in its content panel even when
                 * the view has a single value field and a single column field.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._showValFldHdrs;
                },
                set: function (value) {
                    if (value != this._showValFldHdrs) {
                        this._showValFldHdrs = wijmo.asBoolean(value);
                        this._updateFixedCounts();
                        this._updateFixedContent();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showRowFieldSort", {
                /**
                 * Gets or sets a value that determines whether the grid should display
                 * sort indicators in the column headers for row fields.
                 *
                 * Unlike regular column headers, row fields are always sorted, either
                 * in ascending or descending order. If you set this property to true,
                 * sort icons will always be displayed over any row field headers.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._showRowFldSort;
                },
                set: function (value) {
                    if (value != this._showRowFldSort) {
                        this._showRowFldSort = wijmo.asBoolean(value);
                        this._updateFixedContent(); // TFS 257954
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "customContextMenu", {
                /**
                 * Gets or sets a value that determines whether the grid should provide a
                 * custom context menu.
                 *
                 * The custom context menu includes commands for changing field settings,
                 * removing fields, or showing detail records for the grid cells.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._customCtxMenu;
                },
                set: function (value) {
                    this._customCtxMenu = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "collapsibleSubtotals", {
                /**
                 * Gets or sets a value that determines whether the grid should allow
                 * users to collapse and expand subtotal groups of rows and columns.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._collapsibleSubtotals;
                },
                set: function (value) {
                    if (value != this._collapsibleSubtotals) {
                        this._collapsibleSubtotals = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "centerHeadersVertically", {
                /**
                 * Gets or sets a value that determines whether the content of
                 * header cells should be vertically centered.
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
            Object.defineProperty(PivotGrid.prototype, "outlineMode", {
                /**
                 * Gets or sets a value that determines whether the grid should display
                 * row groups in outline format, allowing for more compact displays.
                 *
                 * The default value for this property is **false**.
                 *
                 * In most applications, outline mode works best when rows have
                 * subtotals shown before the data, so if you set {@link outlineMode}
                 * to true it makes sense to set the pivotEngine's {@link showRowTotals}
                 * property to **ShowTotals.Subtotals** and the {@link totalsBeforeData}
                 * property to **true**.
                 *
                 * For example:
                 *
                 * ```typescript
                 * import { PivotEngine, ShowTotals} from '@grapecity/wijmo.olap';
                 * let theEngine = new PivotEngine({
                 *     showRowTotals: ShowTotals.Subtotals,
                 *     totalsBeforeData: true,
                 *     itemsSource: getData()
                 * });
                 * let theGrid = new PivotGrid('#theGrid', {
                 *     itemsSource: theEngine,
                 *     outlineMode: true
                 * });
                 * ```
                 */
                get: function () {
                    return this._outlineMode;
                },
                set: function (value) {
                    if (value != this._outlineMode) {
                        this._outlineMode = wijmo.asBoolean(value);
                        this._bindGrid(true);
                        //this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets an object with information about the fields and values
             * being used to summarize a given cell.
             *
             * For more details, see the @PivotEngine.getKeys method.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.getKeys = function (row, col) {
                var r = this.rows[wijmo.asInt(row)], c = this.columns[wijmo.asInt(col)], item = r ? r.dataItem : null, binding = c ? c.binding : null;
                return this._ng.getKeys(item, binding);
            };
            /**
             * Gets an array containing the records summarized by a given grid cell.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.getDetail = function (row, col) {
                var item = this.rows[wijmo.asInt(row)].dataItem, binding = this.columns[wijmo.asInt(col)].binding;
                return this._ng.getDetail(item, binding);
            };
            /**
             * Gets an {@link wijmo.ICollectionView} containing the records
             * summarized by a given grid cell.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.getDetailView = function (row, col) {
                var item = this.rows[wijmo.asInt(row)].dataItem, binding = this.columns[wijmo.asInt(col)].binding;
                return this._ng.getDetailView(item, binding);
            };
            /**
             * Shows a dialog containing details for a given grid cell.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.showDetail = function (row, col) {
                if (this._ng.valueFields.length) {
                    var dd = this.detailDialog;
                    dd.showDetail(this, new wijmo.grid.CellRange(row, col));
                    dd.show(true);
                }
            };
            /**
             * Collapses all rows to a given level.
             *
             * @param level Maximum row level to show. Zero means show only
             * grand totals; one means show only top-level groups; very high
             * levels expand all rows.
             */
            PivotGrid.prototype.collapseRowsToLevel = function (level) {
                this._collapseRowsToLevel(level);
            };
            /**
             * Collapses all columns to a given level.
             *
             * @param level Maximum column level to show. Zero means show only
             * grand totals; one means show only top-level groups; very high
             * levels expand all columns.
             */
            PivotGrid.prototype.collapseColumnsToLevel = function (level) {
                this._collapseColsToLevel(level);
            };
            // ** overrides
            // use quick auto size if there aren't any external item formatters
            PivotGrid.prototype._getQuickAutoSize = function () {
                return wijmo.isBoolean(this.quickAutoSize)
                    ? this.quickAutoSize
                    : this.formatItem.handlerCount <= 1 && this.itemFormatter == null;
            };
            // overridden to preserve outline state
            PivotGrid.prototype._bindGrid = function (full) {
                var _this = this;
                this.deferUpdate(function () {
                    var preserveState = _this.preserveOutlineState, collapsed = _this._collapsedKeys, rows = _this.rows, cols = _this.columns;
                    // if not preserving collapsed state, clear it!
                    if (!preserveState) {
                        collapsed = _this._collapsedKeys = {};
                    }
                    // bind the grid
                    _super.prototype._bindGrid.call(_this, full);
                    // restore collapsed state
                    if (_this._ng && preserveState && !wijmo.isEmpty(collapsed)) {
                        var tbd = _this._ng.totalsBeforeData, start = tbd ? rows.length - 1 : 0, end = tbd ? -1 : rows.length, step = tbd ? -1 : +1;
                        for (var i = start; i != end; i += step) {
                            var item = rows[i].dataItem, key = item ? item[olap._PivotKey._ROW_KEY_NAME] : null;
                            if (key && key.level > 0 && collapsed[key.toString()]) {
                                _this._setRowCollapsed(new wijmo.grid.CellRange(i, key.level - 1), true);
                            }
                        }
                        start = tbd ? cols.length - 1 : 0;
                        end = tbd ? -1 : cols.length;
                        step = tbd ? -1 : +1;
                        for (var i = start; i != end; i += step) {
                            var binding = cols[i].binding, key = _this._ng._getKey(binding);
                            if (key && key.level > 0 && collapsed[key.toString()]) {
                                _this._setColCollapsed(new wijmo.grid.CellRange(key.level - 1, i), true);
                            }
                        }
                    }
                });
            };
            // overridden to accept PivotPanel and PivotEngine as well as ICollectionView sources
            PivotGrid.prototype._getCollectionView = function (value) {
                if (value instanceof olap.PivotPanel) {
                    value = value.engine.pivotView;
                }
                else if (value instanceof olap.PivotEngine) {
                    value = value.pivotView;
                }
                return wijmo.asCollectionView(value);
            };
            // refresh menu items in case culture changed
            PivotGrid.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this._ctxMenu.refresh();
                var currentCulture = wijmo.culture.Globalize.name;
                if (this._prevCulture !== currentCulture) {
                    this._prevCulture = currentCulture;
                    this._updateFixedContent();
                }
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // overridden to connect to PivotEngine events
            PivotGrid.prototype.onItemsSourceChanged = function (e) {
                // disconnect old engine
                if (this._ng) {
                    this._ng.updatingView.removeHandler(this._updatingView, this);
                    this._ng.viewDefinitionChanged.removeHandler(this._viewDefinitionChanged, this);
                }
                // discard outline state
                this._collapsedKeys = {};
                // get new engine
                var view = this.collectionView;
                this._ng = view instanceof olap.PivotCollectionView
                    ? view.engine
                    : null;
                // connect new engine
                if (this._ng) {
                    this._ng.updatingView.addHandler(this._updatingView, this);
                    this._ng.viewDefinitionChanged.addHandler(this._viewDefinitionChanged, this);
                }
                this._updatingView(); // TFS 340084
                this._bindGrid(true);
                // fire event as usual
                _super.prototype.onItemsSourceChanged.call(this, e);
            };
            // overridden to save column widths into view definition
            PivotGrid.prototype.onResizedColumn = function (e) {
                var ng = this._ng;
                if (ng) {
                    this._resizingColumn = true;
                    // resized fixed column
                    if (e.panel.columns == this.rowHeaders.columns) {
                        var fld = this._colRowFields.get(e.getColumn()); // TFS 469842
                        if (fld instanceof olap.PivotField) {
                            fld.width = e.panel.columns[e.col].renderWidth;
                        }
                    }
                    // resized scrollable column
                    if (e.panel.columns == this.columnHeaders.columns) {
                        var vf = ng.valueFields;
                        if (vf.length > 0) {
                            var fld = vf[e.col % vf.length];
                            fld.width = e.panel.columns[e.col].renderWidth;
                        }
                    }
                    this._resizingColumn = false;
                }
                // raise the event
                _super.prototype.onResizedColumn.call(this, e);
            };
            // overridden to prevent sorting while updating (TFS 320362)
            PivotGrid.prototype.onSortingColumn = function (e) {
                var ng = this._ng;
                return ng && ng.isUpdating ? false : _super.prototype.onSortingColumn.call(this, e);
            };
            // overridden to prevent dragging while updating (TFS 320362)
            PivotGrid.prototype.onDraggingColumn = function (e) {
                var ng = this._ng;
                return ng && ng.isUpdating ? false : _super.prototype.onDraggingColumn.call(this, e);
            };
            // overridden to re-order row fields after dragging
            PivotGrid.prototype.onDraggedColumn = function (e) {
                var ng = this._ng;
                if (ng) {
                    if (e.panel.columns == this.topLeftCells.columns) {
                        var rowFields_1 = ng.rowFields, fld_3 = rowFields_1[e.data.col];
                        ng.deferUpdate(function () {
                            rowFields_1.removeAt(e.data.col);
                            rowFields_1.insert(e.col, fld_3);
                        });
                    }
                }
                _super.prototype.onDraggedColumn.call(this, e);
            };
            // ** implementation
            // reset the grid layout/bindings when the pivot view starts updating
            PivotGrid.prototype._updatingView = function () {
                // update fixed row/column counts
                this._updateFixedCounts();
                // clear scrollable rows/columns
                this.columns.clear();
                this.rows.clear();
            };
            // clear collapsed state when the view definition changes
            PivotGrid.prototype._viewDefinitionChanged = function () {
                if (!this._resizingColumn) { // TFS 396541
                    this._collapsedKeys = {};
                }
            };
            // update fixed cell content after loading rows
            PivotGrid.prototype.onLoadedRows = function (e) {
                // generate columns and headers if necessary
                if (this.columns.length == 0) {
                    this._generateColumns();
                }
                // update row/column headers
                this._updateFixedCounts(); // TFS 469842
                this._updateFixedContent();
                // fire event as usual
                _super.prototype.onLoadedRows.call(this, e);
            };
            // generate columns of appropriate type
            PivotGrid.prototype._generateColumns = function () {
                var _this = this;
                var view = this.collectionView, arr = view ? view.sourceCollection : null, arrLength = arr && arr.length;
                if (arrLength) {
                    // keys for which columns should be generated
                    var colKeys = Object.keys(arr[0]).filter(function (key) { return key != olap._PivotKey._ROW_KEY_NAME; });
                    // find column data types
                    var dataTypesByKey_1 = {};
                    var nonHandledKeys = colKeys.slice(); // copy array
                    for (var i = 0; i < arrLength; i++) {
                        var item = arr[i];
                        for (var j = nonHandledKeys.length - 1; j >= 0; j--) { // reverse order to simplify array element deletion handling
                            var key = nonHandledKeys[j];
                            var value = item[key];
                            if ((value !== undefined) && (value !== null)) { // it's slightly faster than (value != null)
                                dataTypesByKey_1[key] = wijmo.getType(value);
                                nonHandledKeys.splice(j, 1);
                            }
                        }
                        if (!nonHandledKeys.length) {
                            break;
                        }
                    }
                    // create columns
                    colKeys.forEach(function (key) {
                        _this.columns.push(new wijmo.grid.Column({
                            binding: key,
                            dataType: dataTypesByKey_1[key] != null ? dataTypesByKey_1[key] : wijmo.DataType.Number,
                            allowMerging: true,
                        }));
                    });
                }
            };
            // update the number of fixed rows and columns
            PivotGrid.prototype._updateFixedCounts = function () {
                var ng = this._ng, hasView = ng && ng.isViewDefined, cnt;
                // fixed columns
                cnt = Math.max(1, hasView ? ng.rowFields.length : 1);
                var cols = this.topLeftCells.columns;
                cols.clear();
                this._colRowFields.clear();
                for (var i = 0; i < cnt; i++) {
                    var col = new wijmo.grid.Column({
                        allowMerging: true
                    });
                    cols.push(col);
                    if (hasView) {
                        this._colRowFields.set(col, ng.rowFields[i]);
                    }
                }
                // fixed rows
                cnt = Math.max(1, hasView ? ng.columnFields.length : 1);
                if (ng && ng.columnFields.length) {
                    if (ng.valueFields.length > 1 || this.showValueFieldHeaders) {
                        cnt++;
                    }
                }
                var rows = this.topLeftCells.rows;
                rows.clear();
                for (var i = 0; i < cnt; i++) {
                    rows.push(new wijmo.grid.Row());
                }
            };
            // update the content of the fixed cells
            PivotGrid.prototype._updateFixedContent = function () {
                var ng = this._ng;
                // if no view, clear top-left (single) cell and be done
                if (!ng || !ng.isViewDefined) {
                    this.topLeftCells.setCellData(0, 0, null);
                    return;
                }
                // get field collections
                var rf = ng.rowFields, cf = ng.columnFields, vf = ng.valueFields;
                // build outline header with row field headers
                var outlineHeader = this.outlineMode
                    ? rf.map(function (fld) { return fld.header; }).join(' / ')
                    : '';
                // populate top-left cells
                var p = this.topLeftCells;
                for (var r = 0; r < p.rows.length; r++) {
                    for (var c = 0; c < p.columns.length; c++) {
                        var value = '';
                        // row field headers
                        if (this.showRowFieldHeaders) {
                            if (c < rf.length && r == p.rows.length - 1) {
                                value = this.outlineMode
                                    ? outlineHeader
                                    : rf[c].header;
                            }
                        }
                        // column field headers
                        if (this.showColumnFieldHeaders) {
                            if (!value && r < cf.length && c == 0) {
                                value = cf[r].header + ':';
                            }
                        }
                        // set it
                        p.setCellData(r, c, value, false, false);
                    }
                }
                // populate row headers
                p = this.rowHeaders;
                for (var r = 0; r < p.rows.length; r++) {
                    var key = p.rows[r].dataItem[olap._PivotKey._ROW_KEY_NAME];
                    wijmo.assert(key instanceof olap._PivotKey, 'missing PivotKey for row...');
                    for (var c = 0; c < p.columns.length; c++) {
                        var value = key.getValue(c, true);
                        p.setCellData(r, c, value, false, false);
                    }
                }
                // populate column headers
                p = this.columnHeaders;
                for (var c = 0; c < p.columns.length; c++) {
                    var key = ng._getKey(p.columns[c].binding);
                    wijmo.assert(key instanceof olap._PivotKey, 'missing PivotKey for column...');
                    for (var r = 0; r < p.rows.length; r++) {
                        // get cell data (field value or 'subtotal')
                        var value = key.getValue(r, true);
                        // replace row subtotal label with value field header 
                        // pretty nasty, many possible situations... (TFS 145673)
                        if (r == p.rows.length - 1 && vf.length) {
                            if (vf.length > 1 || cf.length == 0 || key.level > -1 || this.showValueFieldHeaders) {
                                value = vf[c % vf.length].header;
                            }
                        }
                        // set cell data
                        p.setCellData(r, c, value, false, false);
                    }
                }
                // set column widths
                p = this.topLeftCells;
                for (var c = 0; c < p.columns.length; c++) {
                    var col = p.columns[c], fld = (c < rf.length ? rf[c] : null);
                    col.wordWrap = fld ? fld.wordWrap : null;
                    col.align = fld ? fld.align : null;
                    if (this.outlineMode && c < p.columns.length - 1) { // outline columns
                        col.width = this.treeIndent; // narrow
                        col.allowResizing = false; // and non-resizable
                    }
                    else { // regular column, use field width
                        col.allowResizing = true; // TFS 393160
                        col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : null;
                    }
                }
                p = this.cells;
                for (var c = 0; c < p.columns.length; c++) {
                    var col = p.columns[c], fld = (vf.length ? vf[c % vf.length] : null);
                    col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : null;
                    col.wordWrap = fld ? fld.wordWrap : null;
                    col.format = fld ? fld.format : null;
                    col.align = fld ? fld.align : null;
                }
                // and invalidate the grid (TFS 466793)
                this.invalidate();
            };
            PivotGrid.prototype._updateDefaultSizes = function () {
                var defRowHei = _super.prototype._updateDefaultSizes.call(this);
                this._hdrCols._setDefaultSize(defRowHei * 4);
                return defRowHei;
            };
            // customize the grid display
            PivotGrid.prototype._formatItem = function (s, e) {
                var ng = this._ng, panel = e.panel, cell = e.cell;
                // make sure we're connected
                if (!ng) {
                    return;
                }
                // let CSS align the top-left panel
                if (panel == this.topLeftCells) {
                    var isColHdr = ng.rowFields.length == 0 ||
                        e.row < panel.rows.length - 1 ||
                        (e.row == panel.rows.length - 1 && !this.showRowFieldHeaders);
                    wijmo.toggleClass(cell, 'wj-col-field-hdr', isColHdr);
                    wijmo.toggleClass(cell, 'wj-row-field-hdr', !isColHdr);
                }
                // allow dragging row fields only
                var draggable = null;
                if (panel == this.topLeftCells) {
                    if (e.row == panel.rows.length - 1) {
                        if (this.allowDragging & wijmo.grid.AllowDragging.Columns) {
                            draggable = true;
                        }
                    }
                }
                wijmo.setAttribute(cell, 'draggable', draggable);
                // honor isContentHtml (before any other changes to the content, TFS 328746)
                var fld;
                switch (panel) {
                    case this.rowHeaders:
                        fld = ng.rowFields[e.col % ng.rowFields.length];
                        break;
                    case this.columnHeaders:
                        fld = ng.columnFields[e.row];
                        break;
                    case this.cells:
                        fld = ng.valueFields[e.col];
                        break;
                }
                if (fld && fld.isContentHtml) {
                    cell.innerHTML = cell.textContent;
                }
                // apply wj-group class name to total rows and columns (TFS 355176)
                var binding = panel.columns[e.col].binding, rowLevel = panel.rows == this.rows ? ng._getRowLevel(e.row) : -1, colLevel = panel.columns == this.columns ? ng._getColLevel(binding) : -1;
                wijmo.toggleClass(cell, 'wj-aggregate', rowLevel > -1 || colLevel > -1);
                // add collapse/expand icons
                if (this._collapsibleSubtotals) {
                    // collapsible row
                    if (panel == this.rowHeaders && ng._getShowRowTotals() == olap.ShowTotals.Subtotals) {
                        if (this.outlineMode) {
                            var rng = this._getGroupedRows(e.range); // does not include header row
                            if (e.col < ng.rowFields.length - 1) { // && rng.rowSpan > 1) {
                                var showGlyph = !rng.containsRow(e.row);
                                if (showGlyph) {
                                    var collapsed = this._getRowCollapsed(e.range);
                                    cell.innerHTML = this._getCollapsedGlyph(collapsed) + cell.innerHTML;
                                }
                            }
                        }
                        else {
                            var rng = this.getMergedRange(panel, e.row, e.col, false) || e.range;
                            if (e.col < ng.rowFields.length - 1 && rng.rowSpan > 1) {
                                var collapsed = this._getRowCollapsed(rng);
                                cell.innerHTML = this._getCollapsedGlyph(collapsed) + cell.innerHTML;
                            }
                        }
                    }
                    // hide redundant outline items
                    if (this.outlineMode && panel == this.rowHeaders) {
                        if (e.range.rightCol < panel.columns.length - 1) {
                            cell.innerHTML = '';
                        }
                    }
                    // collapsible column
                    if (panel == this.columnHeaders && ng._getShowColTotals() == olap.ShowTotals.Subtotals) {
                        var rng = this.getMergedRange(panel, e.row, e.col, false) || e.range;
                        if (e.row < ng.columnFields.length - 1 && rng.columnSpan > 1) {
                            var isCollapsed = this._getColCollapsed(rng);
                            cell.innerHTML = this._getCollapsedGlyph(isCollapsed) + cell.innerHTML;
                        }
                    }
                }
                // show sort icons on row field headers
                if (panel == this.topLeftCells && this.showRowFieldSort &&
                    e.col < ng.rowFields.length && e.row == this._getSortRowIndex()) {
                    fld = ng.rowFields[e.col];
                    wijmo.toggleClass(cell, 'wj-sort-asc', !fld.descending);
                    wijmo.toggleClass(cell, 'wj-sort-desc', fld.descending);
                    cell.innerHTML += ' <span class="wj-glyph-' + (fld.descending ? 'down' : 'up') + '"></span>';
                }
                // center-align header cells vertically (TFS 399113)
                if (panel != this.cells) { // header cell
                    wijmo.toggleClass(cell, 'wj-align-vcenter', this._centerVert);
                }
            };
            PivotGrid.prototype._getCollapsedGlyph = function (collapsed) {
                return '<div class="' + PivotGrid._WJC_COLLAPSE + '">' +
                    '<span class="wj-glyph-' + (collapsed ? 'plus' : 'minus') + '"></span>' +
                    '</div>';
            };
            // mouse handling
            PivotGrid.prototype._mousedown = function (e) {
                // make sure we want this event
                if (e.defaultPrevented || e.button != 0) {
                    this._htDown = null;
                    return;
                }
                // save mouse down position to use later on mouse up
                this._htDown = this.hitTest(e);
                this._ignoreClick = false;
                // collapse/expand on mousedown
                var icon = wijmo.closestClass(e.target, PivotGrid._WJC_COLLAPSE);
                if (icon != null && this._htDown.panel != null) {
                    var rng = this._htDown.range, collapsed = void 0;
                    switch (this._htDown.panel.cellType) {
                        case wijmo.grid.CellType.RowHeader:
                            collapsed = this._getRowCollapsed(rng);
                            if (e.shiftKey || e.ctrlKey) {
                                this._collapseRowsToLevel(rng.col + (collapsed ? 2 : 1));
                            }
                            else {
                                this._setRowCollapsed(rng, !collapsed);
                            }
                            break;
                        case wijmo.grid.CellType.ColumnHeader:
                            collapsed = this._getColCollapsed(rng);
                            if (e.shiftKey || e.ctrlKey) {
                                this._collapseColsToLevel(rng.row + (collapsed ? 2 : 1));
                            }
                            else {
                                this._setColCollapsed(rng, !collapsed);
                            }
                            break;
                    }
                    e.preventDefault();
                    this._ignoreClick = true;
                    this._htDown = null;
                    this.focus(); // close context menus (TFS 402641)
                }
            };
            PivotGrid.prototype._mouseup = function (e) {
                // make sure we want this event
                if (!this._htDown || e.defaultPrevented) {
                    return;
                }
                // make sure we're not resizing (TFS 396718)
                if (this._mouseHdl._szRowCol) {
                    return;
                }
                // make sure this is the same cell where the mouse was pressed
                var ht = this.hitTest(e);
                if (this._htDown.panel != ht.panel || !ht.range.equals(this._htDown.range)) {
                    return;
                }
                // toggle sort direction when user clicks the row field headers
                var ng = this._ng, topLeft = this.topLeftCells;
                if (ht.panel == topLeft && ht.row == topLeft.rows.length - 1 && ht.col > -1) {
                    var col = ht.getColumn();
                    if (this.allowSorting && col.allowSorting) {
                        var fld = this._colRowFields.get(col); // TFS 469842
                        if (fld && !ng.isUpdating) { // TFS 145269, 320362
                            var args = new wijmo.grid.CellRangeEventArgs(ht.panel, ht.range);
                            if (this.onSortingColumn(args)) {
                                ng.pivotView.sortDescriptions.clear();
                                fld.descending = !fld.descending;
                                this.onSortedColumn(args);
                            }
                        }
                    }
                    e.preventDefault();
                    this._ignoreClick = true;
                }
            };
            PivotGrid.prototype._click = function (e) {
                if (this._ignoreClick) {
                    e.preventDefault();
                }
            };
            PivotGrid.prototype._dblclick = function (e) {
                // check that we want this event
                if (!e.defaultPrevented && this._showDetailOnDoubleClick) {
                    var ht = this._htDown;
                    if (ht && ht.panel == this.cells) {
                        // check that we have an engine and it's not a cube
                        var ng = this._ng;
                        if (ng && ng.fields.length > 0) {
                            if (!(ng.fields[0] instanceof olap.CubePivotField)) {
                                // go show the detail
                                this.showDetail(ht.row, ht.col);
                            }
                        }
                    }
                }
            };
            PivotGrid.prototype._keydown = function (e) {
                // check that we want this event
                if (!e.defaultPrevented && !e.ctrlKey && e.altKey && this.collapsibleSubtotals) {
                    var sel = this.selection;
                    if (sel.isValid) {
                        // calculate outline level
                        var level = this._getRowLevel(sel.topRow);
                        if (level < 0) {
                            level = this.rowHeaders.columns.length - 1;
                        }
                        // alt-left collapses, alt-right expands the current row
                        var keyCode = this._getKeyCode(e);
                        switch (keyCode) {
                            case wijmo.Key.Left:
                            case wijmo.Key.Right:
                                var rng = new wijmo.grid.CellRange(sel.row, level - 1);
                                this._setRowCollapsed(rng, keyCode == wijmo.Key.Left);
                                e.preventDefault();
                                break;
                        }
                    }
                }
            };
            // ** row groups
            PivotGrid.prototype._getRowLevel = function (row) {
                return this._ng._getRowLevel(row);
            };
            PivotGrid.prototype._getGroupedRows = function (rng) {
                var getLevel = this._getRowLevel.bind(this), level = rng.col + 1, len = this.rows.length, tbd = this._ng.totalsBeforeData, start = rng.row, end;
                if (getLevel(start) == 0) { // grand totals
                    start = tbd ? 1 : 0;
                    end = tbd ? len - 1 : len - 2;
                }
                else { // regular groups
                    // move start past totals (TFS 378104)
                    if (tbd) {
                        for (; start < len; start++) {
                            if (getLevel(start) < 0)
                                break;
                        }
                    }
                    else {
                        for (; start >= 0; start--) {
                            if (getLevel(start) < 0)
                                break;
                        }
                    }
                    // expand range
                    for (; start > 0; start--) {
                        var lvl = getLevel(start - 1);
                        if (lvl >= 0 && lvl <= level)
                            break;
                    }
                    for (end = start; end < len - 1; end++) {
                        var lvl = getLevel(end + 1);
                        if (lvl >= 0 && lvl <= level)
                            break;
                    }
                }
                // done
                wijmo.assert(end >= start, 'group end < start?');
                return end >= start // TFS 190950
                    ? new wijmo.grid.CellRange(start, rng.col, end, rng.col2)
                    : rng;
            };
            PivotGrid.prototype._toggleRowCollapsed = function (rng) {
                this._setRowCollapsed(rng, !this._getRowCollapsed(rng));
            };
            PivotGrid.prototype._getRowCollapsed = function (rng) {
                rng = this._getGroupedRows(rng);
                var ng = this._ng, totIndex = ng.totalsBeforeData ? rng.row - 1 : rng.row2 + 1, totRow = this.rows[totIndex] || this.rows[rng.row], key = totRow ? totRow.dataItem[olap._PivotKey._ROW_KEY_NAME] : null;
                return key ? this._collapsedKeys[key.toString()] : false;
            };
            PivotGrid.prototype._setRowCollapsed = function (rng, collapse) {
                var _this = this;
                rng = this._getGroupedRows(rng);
                var ng = this._ng, totIndex = ng.totalsBeforeData ? rng.row - 1 : rng.row2 + 1, totRow = this.rows[totIndex] || this.rows[rng.row], key = totRow ? totRow.dataItem[olap._PivotKey._ROW_KEY_NAME] : null;
                // update key's collapsed state
                if (key) {
                    this._collapsedKeys[key.toString()] = collapse;
                }
                // update row visibility
                this.deferUpdate(function () {
                    // hide/show data, show total row
                    // show the total after hiding the data, in case there's paging and 
                    // we are using a data row as the total (argh...)
                    for (var r = rng.row; r <= rng.row2; r++) {
                        _this.rows[r].visible = !collapse;
                    }
                    if (totRow) {
                        totRow.visible = true;
                    }
                    // when expanding, apply state to child ranges
                    if (!collapse) {
                        var level = _this._getRowLevel(totIndex), childRanges = [];
                        for (var r = rng.row; r <= rng.row2; r++) {
                            if (_this._getRowLevel(r) > -1) {
                                var childRange = _this._getGroupedRows(new wijmo.grid.CellRange(r, level));
                                wijmo.assert(childRange.row >= rng.row && childRange.row2 <= rng.row2, 'child range overflow');
                                childRanges.push(childRange);
                                r++;
                            }
                        }
                        childRanges.forEach(function (rng) {
                            var collapsed = _this._getRowCollapsed(rng);
                            _this._setRowCollapsed(rng, collapsed);
                        });
                    }
                });
            };
            PivotGrid.prototype._collapseRowsToLevel = function (level) {
                var _this = this;
                if (level >= this._ng.rowFields.length) {
                    level = -1; // show all
                }
                this.deferUpdate(function () {
                    for (var r = 0; r < _this.rows.length; r++) {
                        // update key's collapsed state
                        var rowLevel = _this._getRowLevel(r);
                        if (rowLevel > 0) {
                            var key = _this.rows[r].dataItem[olap._PivotKey._ROW_KEY_NAME];
                            _this._collapsedKeys[key.toString()] = level > 0 && rowLevel >= level;
                        }
                        // update row visibility
                        if (level < 0) {
                            _this.rows[r].visible = true;
                        }
                        else {
                            var visible = rowLevel > -1 && rowLevel <= level;
                            // handle paging (avoid hiding all rows in group)
                            if (!visible) {
                                if (_this._ng.totalsBeforeData) {
                                    if (r == 0) {
                                        visible = true;
                                    }
                                }
                                else {
                                    if (r == _this.rows.length - 1) {
                                        visible = true;
                                    }
                                }
                            }
                            _this.rows[r].visible = visible;
                        }
                    }
                });
            };
            // ** column groups
            PivotGrid.prototype._getColLevel = function (col) {
                return this._ng._getColLevel(this.columns[col].binding);
            };
            PivotGrid.prototype._getGroupedCols = function (rng) {
                var getLevel = this._getColLevel.bind(this), level = rng.row + 1, len = this.columns.length, tbd = this._ng.totalsBeforeData, start = rng.col, end;
                if (getLevel(start) == 0) { // grand totals
                    start = tbd ? 1 : 0;
                    end = tbd ? len - 1 : len - 2;
                }
                else { // regular groups
                    // move start past totals (TFS 378104)
                    if (this._ng.totalsBeforeData) {
                        for (start = rng.col; start < len; start++) {
                            if (getLevel(start) < 0)
                                break;
                        }
                    }
                    else {
                        for (start = rng.col; start >= 0; start--) {
                            if (getLevel(start) < 0)
                                break;
                        }
                    }
                    // expand range
                    for (; start > 0; start--) {
                        var lvl = getLevel(start - 1);
                        if (lvl >= 0 && lvl <= level)
                            break;
                    }
                    for (end = start; end < len - 1; end++) {
                        var lvl = getLevel(end + 1);
                        if (lvl >= 0 && lvl <= level)
                            break;
                    }
                }
                // done
                wijmo.assert(end >= start, 'group end < start?');
                return end >= start // TFS 190950
                    ? new wijmo.grid.CellRange(rng.row, start, rng.row2, end)
                    : rng;
            };
            PivotGrid.prototype._toggleColCollapsed = function (rng) {
                this._setColCollapsed(rng, !this._getColCollapsed(rng));
            };
            PivotGrid.prototype._getColCollapsed = function (rng) {
                rng = this._getGroupedCols(rng);
                var ng = this._ng, totIndex = ng.totalsBeforeData ? rng.col - ng.valueFields.length : rng.col2 + 1, totCol = this.columns[totIndex], key = totCol ? totCol.binding : null;
                return key ? this._collapsedKeys[key.toString()] : false;
            };
            PivotGrid.prototype._setColCollapsed = function (rng, collapse) {
                var _this = this;
                rng = this._getGroupedCols(rng);
                var ng = this._ng, totIndex = ng.totalsBeforeData ? rng.col - ng.valueFields.length : rng.col2 + 1, totCol = this.columns[totIndex], key = totCol ? totCol.binding : null;
                // update key's collapsed state
                if (key) {
                    this._collapsedKeys[key.toString()] = collapse;
                }
                // update column visibility
                this.deferUpdate(function () {
                    // show totals, hide/show data
                    for (var v = 1; v <= ng.valueFields.length; v++) {
                        _this.columns[ng.totalsBeforeData ? rng.col - v : rng.col2 + v].visible = true;
                    }
                    for (var c = rng.col; c <= rng.col2; c++) {
                        _this.columns[c].visible = !collapse;
                    }
                    // when expanding, apply state to child ranges
                    if (!collapse) {
                        var level = _this._getColLevel(totIndex), childRanges = [];
                        for (var c = rng.col; c <= rng.col2; c++) {
                            if (_this._getColLevel(c) > -1) {
                                var childRange = _this._getGroupedCols(new wijmo.grid.CellRange(level, c));
                                wijmo.assert(childRange.col >= rng.col && childRange.col2 <= rng.col2, 'child range overflow');
                                childRanges.push(childRange);
                                c += ng.valueFields.length - 1;
                            }
                        }
                        childRanges.forEach(function (rng) {
                            var collapsed = _this._getColCollapsed(rng);
                            _this._setColCollapsed(rng, collapsed);
                        });
                    }
                });
            };
            PivotGrid.prototype._collapseColsToLevel = function (level) {
                var _this = this;
                if (level >= this._ng.columnFields.length) {
                    level = -1; // show all
                }
                this.deferUpdate(function () {
                    for (var c = 0; c < _this.columns.length; c++) {
                        // update key's collapsed state
                        var colLevel = _this._getColLevel(c);
                        if (colLevel > 0) {
                            var key = _this._ng._getKey(_this.columns[c].binding);
                            _this._collapsedKeys[key.toString()] = level > 0 && colLevel >= level;
                        }
                        // update column visibility
                        if (level < 0) {
                            _this.columns[c].visible = true;
                        }
                        else {
                            var visible = colLevel > -1 && colLevel <= level;
                            _this.columns[c].visible = visible;
                        }
                    }
                });
            };
            PivotGrid._WJC_COLLAPSE = 'wj-pivot-collapse';
            return PivotGrid;
        }(wijmo.grid.FlexGrid));
        olap.PivotGrid = PivotGrid;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a dialog used to display details for a grid cell.
         */
        var DetailDialog = /** @class */ (function (_super) {
            __extends(DetailDialog, _super);
            /**
             * Initializes a new instance of the {@link DetailDialog} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function DetailDialog(element, options) {
                var _this = _super.call(this, element, null) || this;
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-detaildialog', tpl, {
                    _sCnt: 'sp-cnt',
                    _dSummary: 'div-summary',
                    _dGrid: 'div-grid',
                    _btnOK: 'btn-ok',
                    _gHdr: 'g-hdr'
                });
                // create child grid
                _this._g = new wijmo.grid.FlexGrid(_this._dGrid, {
                    isReadOnly: true
                });
                // apply options
                _this.initialize(options);
                return _this;
            }
            // populates the dialog to show the detail for a given cell
            DetailDialog.prototype.showDetail = function (ownerGrid, cell) {
                var _this = this;
                // populate child grid
                var view = ownerGrid.getDetailView(cell.row, cell.col);
                this._g.itemsSource = view;
                // update caption
                var pcv = wijmo.tryCast(view, 'IPagedCollectionView');
                this._updateDetailCount(pcv ? pcv.totalItemCount : view.items.length);
                view.collectionChanged.addHandler(function () {
                    _this._updateDetailCount(view.items.length);
                });
                // update summary
                var ng = ownerGrid.engine, ci = wijmo.culture.olap.DetailDialog, summary = '';
                // update culture dependent elements here to apply culture dynamically (WJM-19988)
                this._gHdr.textContent = ci.header;
                this._btnOK.textContent = ci.ok;
                // row info
                var rowKey = ownerGrid.rows[cell.row].dataItem[olap._PivotKey._ROW_KEY_NAME];
                this._rowHdr = wijmo.escapeHtml(this._getHeader(rowKey));
                if (this._rowHdr) {
                    summary += ci.row + ': <b>' + this._rowHdr + '</b><br>';
                }
                // column info
                var colKey = ng._getKey(ownerGrid.columns[cell.col].binding);
                this._colHdr = wijmo.escapeHtml(this._getHeader(colKey));
                if (this._colHdr) {
                    summary += ci.col + ': <b>' + this._colHdr + '</b><br>';
                }
                // value info
                var valFlds = ng.valueFields, valFld = valFlds[cell.col % valFlds.length], val = ownerGrid.getCellData(cell.row, cell.col, true);
                this._cellHdr = wijmo.escapeHtml(valFld.header);
                this._cellValue = wijmo.escapeHtml(val);
                summary += this._cellHdr + ': <b>' + this._cellValue + '</b>';
                // show it
                this._dSummary.innerHTML = summary;
            };
            Object.defineProperty(DetailDialog.prototype, "rowHeader", {
                /**
                 * Gets the row header for the value being shown.
                 *
                 * This information is updated before the dialog is shown and
                 * is displayed above the detail grid.
                 */
                get: function () {
                    return this._rowHdr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailDialog.prototype, "columnHeader", {
                /**
                 * Gets the column header for the value being shown.
                 *
                 * This information is updated before the dialog is shown and
                 * is displayed above the detail grid.
                 */
                get: function () {
                    return this._colHdr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailDialog.prototype, "cellHeader", {
                /**
                 * Gets the cell header for the value being shown.
                 *
                 * This information is updated before the dialog is shown and
                 * is displayed above the detail grid.
                 */
                get: function () {
                    return this._cellHdr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailDialog.prototype, "cellValue", {
                /**
                 * Gets the formatted cell value for the value being shown.
                 *
                 * This information is updated before the dialog is shown and
                 * is displayed above the detail grid.
                 */
                get: function () {
                    return this._cellValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailDialog.prototype, "detailCount", {
                /**
                 * Gets the number of items shown in the detail dialog.
                 *
                 * This information is updated before the dialog is shown and
                 * is in the dialog header.
                 */
                get: function () {
                    return this._detailCount;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // update record count in dialog header
            DetailDialog.prototype._updateDetailCount = function (cnt) {
                var ci = wijmo.culture.olap.DetailDialog;
                this._sCnt.textContent = wijmo.format(cnt == 1 ? ci.item : ci.items, { cnt: cnt });
                this._detailCount = cnt;
            };
            // gets the headers that describe a key
            DetailDialog.prototype._getHeader = function (key) {
                if (key && key.values && key.values.length) {
                    var arr = [];
                    for (var i = 0; i < key.values.length; i++) {
                        arr.push(key.getValue(i, true));
                    }
                    return arr.join(' - ');
                }
                return null;
            };
            /**
             * Gets or sets the template used to instantiate {@link PivotFieldEditor} controls.
             */
            DetailDialog.controlTemplate = '<div>' +
                '<div class="wj-dialog-header">' +
                '<span wj-part="g-hdr">Detail View:</span> <span wj-part="sp-cnt"></span>' +
                '</div>' +
                '<div class="wj-dialog-body">' +
                '<div wj-part="div-summary" class="wj-summary"></div>' +
                '<div wj-part="div-grid"></div>' +
                '</div>' +
                '<div class="wj-dialog-footer">' +
                '<button wj-part="btn-ok"class="wj-hide wj-btn">OK</button>&nbsp;&nbsp;' +
                '</div>' +
                '</div>';
            return DetailDialog;
        }(wijmo.input.Popup));
        olap.DetailDialog = DetailDialog;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Provides custom merging for {@link PivotGrid} controls.
         */
        var _PivotMergeManager = /** @class */ (function (_super) {
            __extends(_PivotMergeManager, _super);
            function _PivotMergeManager() {
                return _super !== null && _super.apply(this, arguments) || this;
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
            _PivotMergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                if (clip === void 0) { clip = true; }
                // get the engine from the grid
                var view = p.grid.collectionView;
                this._ng = view instanceof olap.PivotCollectionView
                    ? view.engine
                    : null;
                // not connected? use default implementation
                if (!this._ng) {
                    return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                }
                // sanity
                if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
                    return null;
                }
                // merge row and column headers
                var allowMerging = p.grid.allowMerging, am = wijmo.grid.AllowMerging;
                switch (p.cellType) {
                    case wijmo.grid.CellType.TopLeft:
                        return (allowMerging & am.AllHeaders) != 0
                            ? this._getMergedTopLeftRange(p, r, c)
                            : null;
                    case wijmo.grid.CellType.RowHeader:
                        return (allowMerging & am.RowHeaders) != 0 // TFS 369672
                            ? this._getMergedRowHeaderRange(p, r, c, clip ? p.viewRange : null)
                            : null;
                    case wijmo.grid.CellType.ColumnHeader:
                        return (allowMerging & am.ColumnHeaders) != 0
                            ? this._getMergedColumnHeaderRange(p, r, c, clip ? p.viewRange : null)
                            : null;
                }
                // not merged
                return null;
            };
            // get merged top/left cells
            _PivotMergeManager.prototype._getMergedTopLeftRange = function (p, r, c) {
                // start with a single cell
                var rng = new wijmo.grid.CellRange(r, c);
                // special handling for outline mode
                var g = p.grid;
                if (g.outlineMode && g.showRowFieldHeaders) {
                    if (rng.row == p.rows.length - 1) {
                        rng.col = 0;
                        rng.col2 = p.columns.length - 1;
                        return rng;
                    }
                }
                // expand left until we get a non-empty cell
                while (rng.col > 0 && !p.getCellData(r, rng.col, true)) {
                    rng.col--;
                }
                // expand right to include empty cells
                while (rng.col2 < p.columns.length - 1 && !p.getCellData(r, rng.col2 + 1, true)) {
                    rng.col2++;
                }
                // done
                return rng.isSingleCell ? null : rng;
            };
            // get merged row header cells
            _PivotMergeManager.prototype._getMergedRowHeaderRange = function (p, r, c, rng) {
                var g = p.grid, col = p.columns[c];
                // honor Column.allowMerging
                if (!col.allowMerging) {
                    return null;
                }
                // handle outline mode
                if (g.outlineMode) {
                    // collapsible node
                    if (this._isSubtotal(p, r, c) || this._isSubtotal(p, r, c + 1)) {
                        var rng_1 = this._getOutlineRange(p, r, c);
                        return rng_1.isSingleCell ? null : rng_1;
                    }
                    // merged cells below collapsible node
                    if (c < p.columns.length - 1) {
                        var rng_2 = g._getGroupedRows(new wijmo.grid.CellRange(r, c));
                        return rng_2.isSingleCell ? null : rng_2;
                    }
                    // no merge
                    return null;
                }
                // expand range left and right (totals)
                var rowLevel = this._ng._getRowLevel(r);
                if (rowLevel > -1 && c >= rowLevel) {
                    var val = p.getCellData(r, c, false), c1 = void 0, c2 = void 0, cMin = rng ? rng.col : 0, cMax = rng ? rng.col2 : p.columns.length - 1;
                    for (c1 = c; c1 > cMin; c1--) {
                        if (p.getCellData(r, c1 - 1, false) != val) {
                            break;
                        }
                    }
                    for (c2 = c; c2 < cMax; c2++) {
                        if (p.getCellData(r, c2 + 1, false) != val) {
                            break;
                        }
                    }
                    return c1 != c2
                        ? new wijmo.grid.CellRange(r, c1, r, c2) // merged columns
                        : null; // not merged
                }
                // expand range up and down
                var r1, r2, rMin = rng ? rng.row : 0, rMax = rng ? rng.row2 : p.rows.length - 1;
                for (r1 = r; r1 > rMin; r1--) {
                    if (!this._sameColumnValues(p, r, r1 - 1, c)) {
                        break;
                    }
                }
                for (r2 = r; r2 < rMax; r2++) {
                    if (!this._sameColumnValues(p, r, r2 + 1, c)) {
                        break;
                    }
                }
                return r1 != r2
                    ? new wijmo.grid.CellRange(r1, c, r2, c) // merged rows
                    : null; // not merged
            };
            // compare column values to perform restricted merging (TFS 257125)
            _PivotMergeManager.prototype._sameColumnValues = function (p, r1, r2, c) {
                for (; c >= 0; c--) {
                    var v1 = p.getCellData(r1, c, false), v2 = p.getCellData(r2, c, false);
                    if (v1 != v2) {
                        return false;
                    }
                }
                return true;
            };
            // outline mode helpers
            _PivotMergeManager.prototype._isSubtotal = function (p, r, c) {
                var item = p.rows[r].dataItem, // TFS 371599
                key = item ? item[olap._PivotKey._ROW_KEY_NAME] : null;
                return item && c > key.values.length - 1 && c < p.columns.length;
            };
            _PivotMergeManager.prototype._getOutlineRange = function (p, r, c) {
                var rng = new wijmo.grid.CellRange(r, c);
                rng.col2 = p.columns.length - 1;
                while (rng.col && this._isSubtotal(p, r, rng.col)) {
                    rng.col--;
                }
                return rng;
            };
            // get merged column header cells
            _PivotMergeManager.prototype._getMergedColumnHeaderRange = function (p, r, c, rng) {
                var col = p.columns[c], key = this._ng._getKey(col.binding), val = p.getCellData(r, c, false);
                // expand range up and down (totals)
                var colLevel = this._ng._getColLevel(key);
                if (colLevel > -1 && r >= colLevel) {
                    var r1 = void 0, r2 = void 0, rMin = rng ? rng.row : 0, rMax = rng ? rng.row2 : p.rows.length - 1;
                    for (r1 = r; r1 > rMin; r1--) {
                        if (p.getCellData(r1 - 1, c, false) != val) {
                            break;
                        }
                    }
                    for (r2 = r; r2 < rMax; r2++) {
                        if (p.getCellData(r2 + 1, c, false) != val) {
                            break;
                        }
                    }
                    if (r1 != r2) { // merged rows
                        return new wijmo.grid.CellRange(r1, c, r2, c);
                    }
                    // fall through to allow merging subtotals over multiple value fields
                    //return r1 != r2 ? new grid.CellRange(r1, c, r2, c) : null;
                }
                // account for frozen cells (TFS 496696)
                if (rng) {
                    if (c < p.columns.frozen) {
                        rng.col = rng.col2 = 0;
                    }
                    if (r < p.rows.frozen) {
                        rng.row = rng.row2 = 0;
                    }
                }
                // expand range left and right
                var c1, c2, cMin = rng ? rng.col : 0, cMax = rng ? rng.col2 : p.columns.length - 1;
                for (c1 = c; c1 > cMin; c1--) {
                    if (!this._sameRowValues(p, r, c, c1 - 1)) {
                        break;
                    }
                }
                for (c2 = c; c2 < cMax; c2++) {
                    if (!this._sameRowValues(p, r, c, c2 + 1)) {
                        break;
                    }
                }
                if (c1 != c2) { // merged columns
                    return new wijmo.grid.CellRange(r, c1, r, c2);
                }
                // not merged
                return null;
            };
            // compare row values to perform restricted merging (TFS 257125)
            _PivotMergeManager.prototype._sameRowValues = function (p, r, c1, c2) {
                for (; r >= 0; r--) {
                    var v1 = p.getCellData(r, c1, false), v2 = p.getCellData(r, c2, false);
                    if (v1 != v2) {
                        return false;
                    }
                }
                return true;
            };
            return _PivotMergeManager;
        }(wijmo.grid.MergeManager));
        olap._PivotMergeManager = _PivotMergeManager;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Specifies constants that define the chart type.
         */
        var PivotChartType;
        (function (PivotChartType) {
            /** Shows vertical bars and allows you to compare values of items across categories. */
            PivotChartType[PivotChartType["Column"] = 0] = "Column";
            /** Shows horizontal bars. */
            PivotChartType[PivotChartType["Bar"] = 1] = "Bar";
            /** Shows patterns within the data using X and Y coordinates. */
            PivotChartType[PivotChartType["Scatter"] = 2] = "Scatter";
            /** Shows trends over a period of time or across categories. */
            PivotChartType[PivotChartType["Line"] = 3] = "Line";
            /** Shows line chart with the area below the line filled with color. */
            PivotChartType[PivotChartType["Area"] = 4] = "Area";
            /** Shows pie chart. */
            PivotChartType[PivotChartType["Pie"] = 5] = "Pie";
        })(PivotChartType = olap.PivotChartType || (olap.PivotChartType = {}));
        /**
         * Specifies constants that define when the chart legend should be displayed.
         */
        var LegendVisibility;
        (function (LegendVisibility) {
            /** Always show the legend. */
            LegendVisibility[LegendVisibility["Always"] = 0] = "Always";
            /** Never show the legend. */
            LegendVisibility[LegendVisibility["Never"] = 1] = "Never";
            /** Show the legend if the chart has more than one series. */
            LegendVisibility[LegendVisibility["Auto"] = 2] = "Auto";
        })(LegendVisibility = olap.LegendVisibility || (olap.LegendVisibility = {}));
        /**
         * Provides visual representations of {@link wijmo.olap} pivot tables.
         *
         * To use the control, set its {@link itemsSource} property to an instance of a
         * {@link PivotPanel} control or to a {@link PivotEngine}.
         */
        var PivotChart = /** @class */ (function (_super) {
            __extends(PivotChart, _super);
            /**
             * Initializes a new instance of the {@link PivotChart} class.
             *
             * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PivotChart(element, options) {
                var _this = _super.call(this, element) || this;
                _this._chartType = PivotChartType.Column;
                _this._showHierarchicalAxes = true;
                _this._showTotals = false;
                _this._showTitle = true;
                _this._showLegend = LegendVisibility.Always;
                _this._legendPosition = wijmo.chart.Position.Right;
                _this._maxSeries = PivotChart.MAX_SERIES;
                _this._maxPoints = PivotChart.MAX_POINTS;
                _this._stacking = wijmo.chart.Stacking.None;
                _this._colItms = [];
                _this._dataItms = [];
                _this._lblsSrc = [];
                _this._grpLblsSrc = [];
                // add class name to enable styling
                wijmo.addClass(_this.hostElement, 'wj-pivotchart');
                // add flex chart & flex pie
                if (!_this._isPieChart()) {
                    _this._createFlexChart();
                }
                else {
                    _this._createFlexPie();
                }
                _super.prototype.initialize.call(_this, options);
                return _this;
            }
            PivotChart.prototype._getProductInfo = function () {
                return 'D6F4,PivotChart';
            };
            Object.defineProperty(PivotChart.prototype, "engine", {
                /**
                 * Gets a reference to the {@link PivotEngine} that owns this {@link PivotChart}.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "itemsSource", {
                /**
                 * Gets or sets the {@link PivotEngine} or {@link PivotPanel} that provides data
                 * for this {@link PivotChart}.
                 */
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    if (value && this._itemsSource !== value) {
                        var oldVal = this._itemsSource;
                        if (value instanceof olap.PivotPanel) {
                            value = value.engine.pivotView;
                        }
                        else if (value instanceof olap.PivotEngine) {
                            value = value.pivotView;
                        }
                        this._itemsSource = wijmo.asCollectionView(value);
                        this._onItemsSourceChanged(oldVal);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "chartType", {
                /**
                 * Gets or sets the type of chart to create.
                 *
                 * The default value for this property is <b>PivotChartType.Column</b>.
                 */
                get: function () {
                    return this._chartType;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, PivotChartType);
                    if (value != this._chartType) {
                        var type = this._chartType;
                        this._chartType = value;
                        this._changeChartType();
                        if (value === PivotChartType.Bar || type === PivotChartType.Bar) {
                            this._updatePivotChart();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showHierarchicalAxes", {
                /**
                 * Gets or sets a value that determines whether the chart should group axis
                 * annotations for grouped data.
                 *
                 * The default value for this property is <b>true</b>.
                 */
                get: function () {
                    return this._showHierarchicalAxes;
                },
                set: function (value) {
                    if (value != this._showHierarchicalAxes) {
                        this._showHierarchicalAxes = wijmo.asBoolean(value, true);
                        if (!this._isPieChart() && this._flexChart) {
                            this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showTotals", {
                /**
                 * Gets or sets a value that determines whether the chart should
                 * include only totals.
                 *
                 * If showTotals is true and the view has Column Fields, then the
                 * chart will show column totals instead of individual values.
                 *
                 * The default value for this property is <b>false</b>.
                 */
                get: function () {
                    return this._showTotals;
                },
                set: function (value) {
                    if (value != this._showTotals) {
                        this._showTotals = wijmo.asBoolean(value, true);
                        this._updatePivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showTitle", {
                /**
                 * Gets or sets a value that determines whether the chart
                 * should include a title.
                 *
                 * The default value for this property is <b>true</b>.
                 */
                get: function () {
                    return this._showTitle;
                },
                set: function (value) {
                    if (value != this._showTitle) {
                        this._showTitle = wijmo.asBoolean(value, true);
                        this._updatePivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "showLegend", {
                /**
                 * Gets or sets a value that determines whether the chart
                 * should include a legend.
                 *
                 * The default value for this property is <b>LegendVisibility.Always</b>.
                 */
                get: function () {
                    return this._showLegend;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, LegendVisibility);
                    if (value != this.showLegend) {
                        this._showLegend = value;
                        this._updatePivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "legendPosition", {
                /**
                 * Gets or sets a value that determines whether and where the legend
                 * appears in relation to the plot area.
                 *
                 * The default value for this property is <b>Position.Right</b>.
                 */
                get: function () {
                    return this._legendPosition;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, wijmo.chart.Position);
                    if (value != this.legendPosition) {
                        this._legendPosition = value;
                        this._updatePivotChart();
                    }
                    return;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "stacking", {
                /**
                 * Gets or sets a value that determines whether and how the
                 * series objects are stacked.
                 *
                 * The default value for this property is <b>Stacking.None</b>.
                 */
                get: function () {
                    return this._stacking;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, wijmo.chart.Stacking);
                    if (value != this._stacking) {
                        this._stacking = value;
                        if (this._flexChart) {
                            this._flexChart.stacking = this._stacking;
                            this._updatePivotChart();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "maxSeries", {
                /**
                 * Gets or sets the maximum number of data series to be
                 * shown in the chart.
                 *
                 * The default value for this property is <b>100</b> series.
                 */
                get: function () {
                    return this._maxSeries;
                },
                set: function (value) {
                    if (value != this._maxSeries) {
                        this._maxSeries = wijmo.asNumber(value);
                        this._updatePivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "maxPoints", {
                /**
                 * Gets or sets the maximum number of points to be shown in each series.
                 *
                 * The default value for this property is <b>100</b> points.
                 */
                get: function () {
                    return this._maxPoints;
                },
                set: function (value) {
                    if (value != this._maxPoints) {
                        this._maxPoints = wijmo.asNumber(value);
                        this._updatePivotChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "flexChart", {
                /**
                 * Gets a reference to the inner <b>FlexChart</b> control.
                 */
                get: function () {
                    return this._flexChart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "flexPie", {
                /**
                 * Gets a reference to the inner <b>FlexPie</b> control.
                 */
                get: function () {
                    return this._flexPie;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "header", {
                /**
                 * Gets or sets the text displayed in the chart header.
                 */
                get: function () {
                    return this._header;
                },
                set: function (value) {
                    if (value != this._header) {
                        this._header = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "footer", {
                /**
                 * Gets or sets the text displayed in the chart footer.
                 */
                get: function () {
                    return this._footer;
                },
                set: function (value) {
                    if (value != this._footer) {
                        this._footer = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "headerStyle", {
                /**
                 * Gets or sets the style of the chart header.
                 */
                get: function () {
                    return this._headerStyle;
                },
                set: function (value) {
                    if (value != this._headerStyle) {
                        this._headerStyle = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotChart.prototype, "footerStyle", {
                /**
                 * Gets or sets the style of the chart footer.
                 */
                get: function () {
                    return this._footerStyle;
                },
                set: function (value) {
                    if (value != this._footerStyle) {
                        this._footerStyle = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Whether to update the control layout as well as the content.
             */
            PivotChart.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate); // always call the base class
                if (this._isPieChart()) {
                    if (this._flexPie) {
                        this._flexPie.refresh(fullUpdate);
                    }
                }
                else {
                    if (this._flexChart) {
                        this._flexChart.refresh(fullUpdate);
                    }
                }
                this._updatePivotChart();
            };
            /**
             * Saves the chart to an image data url.
             *
             * NOTE: This method does not work in IE browsers. If you require IE support,
             * add the <code>wijmo.chart.render</code> module to the page.
             *
             * @param format The {@link wijmo.chart.ImageFormat} for the exported image.
             * @param done A function to be called after data url is generated. The function gets passed the data url as its argument.
             */
            PivotChart.prototype.saveImageToDataUrl = function (format, done) {
                if (this._isPieChart()) {
                    if (this._flexPie) {
                        this._flexPie.saveImageToDataUrl(format, done);
                    }
                }
                else {
                    if (this._flexChart) {
                        this._flexChart.saveImageToDataUrl(format, done);
                    }
                }
            };
            /**
             * Saves the chart to an image file.
             *
             * NOTE: This method does not work in IE browsers. If you require IE support,
             * add the <code>wijmo.chart.render</code> module to the page.
             *
             * @param filename The filename for the exported image file including extension.
             * Supported types are PNG, JPEG and SVG.
             */
            PivotChart.prototype.saveImageToFile = function (filename) {
                if (this._isPieChart()) {
                    if (this._flexPie) {
                        this._flexPie.saveImageToFile(filename);
                    }
                }
                else {
                    if (this._flexChart) {
                        this._flexChart.saveImageToFile(filename);
                    }
                }
            };
            // ** implementation
            // occur when items source changed
            PivotChart.prototype._onItemsSourceChanged = function (oldItemsSource) {
                // disconnect old engine
                if (this._ng) {
                    this._ng.updatedView.removeHandler(this._updatePivotChart, this);
                }
                if (oldItemsSource) {
                    oldItemsSource.collectionChanged.removeHandler(this._updatePivotChart, this);
                }
                // get new engine
                var cv = this._itemsSource;
                this._ng = cv instanceof olap.PivotCollectionView
                    ? cv.engine
                    : null;
                // connect new engine
                if (this._ng) {
                    this._ng.updatedView.addHandler(this._updatePivotChart, this);
                }
                if (this._itemsSource) {
                    this._itemsSource.collectionChanged.addHandler(this._updatePivotChart, this);
                }
                this._updatePivotChart();
            };
            // create flex chart
            PivotChart.prototype._createFlexChart = function () {
                var _this = this;
                var hostEle = document.createElement('div');
                this.hostElement.appendChild(hostEle);
                this._flexChart = new wijmo.chart.FlexChart(hostEle);
                this._flexChart._bindingSeparator = null; // don't parse bindings at the commas
                this._flexChart.legend.position = wijmo.chart.Position.Right;
                this._flexChart.bindingX = olap._PivotKey._ROW_KEY_NAME;
                this._flexChart.stacking = this._stacking;
                this._flexChart.tooltip.content = function (ht) {
                    var content = ht.name
                        ? '<b>' + ht.name + '</b> ' + '<br/>'
                        : '';
                    content += _this._getLabel(ht.x) + ' ' + _this._getValue(ht);
                    return content;
                };
                this._flexChart.hostElement.style.visibility = 'hidden';
            };
            // create flex pie
            PivotChart.prototype._createFlexPie = function () {
                var _this = this;
                var menuHost = document.createElement('div');
                this.hostElement.appendChild(menuHost);
                this._colMenu = new wijmo.input.MultiSelect(menuHost, {
                    displayMemberPath: 'text',
                    placeholder: wijmo.culture.olap.PivotPanel.cols,
                    selectedValuePath: 'prop',
                    showSelectAllCheckbox: true
                });
                this._colMenu.hostElement.style.visibility = 'hidden';
                this._colMenu.checkedItemsChanged.addHandler(function (sender, args) { return _this._updateFlexPieBinding(); });
                var hostEle = document.createElement('div');
                this.hostElement.appendChild(hostEle);
                this._flexPie = new wijmo.chart.FlexPie(hostEle);
                this._flexPie.bindingName = olap._PivotKey._ROW_KEY_NAME;
                this._flexPie.tooltip.content = function (ht) {
                    return '<b>' + _this._getLabel(_this._dataItms[ht.pointIndex][olap._PivotKey._ROW_KEY_NAME]) + '</b> ' + '<br/>' + _this._getValue(ht);
                };
                this._flexPie.rendering.addHandler(this._updatePieInfo, this);
            };
            // update chart
            PivotChart.prototype._updatePivotChart = function () {
                if (!this._ng || !this._ng.pivotView) {
                    return;
                }
                var dataItems = [], lblsSrc = [], grpLblsSrc = [], lastLabelIndex = 0, lastRowKey, view = this._ng.pivotView, rowFields = this._ng.rowFields;
                // prepare data for chart
                for (var i = 0; i < view.items.length; i++) {
                    var item = view.items[i], rowKey = item.$rowKey;
                    // get columns
                    if (i == 0) {
                        this._getColumns(item);
                    }
                    // max points
                    if (dataItems.length >= this._maxPoints) {
                        break;
                    }
                    // skip total row
                    if (!this._isTotalRow(item[olap._PivotKey._ROW_KEY_NAME])) {
                        dataItems.push(item);
                        // organize the axis label data source
                        // 1. _groupAnnotations  = false;
                        lblsSrc.push({ value: dataItems.length - 1, text: this._getLabel(item[olap._PivotKey._ROW_KEY_NAME]) });
                        // 2. _groupAnnotations  = true;
                        for (var j = 0; j < rowFields.length; j++) {
                            if (grpLblsSrc.length <= j) {
                                grpLblsSrc.push([]);
                            }
                            var mergeIndex = this._getMergeIndex(rowKey, lastRowKey);
                            if (mergeIndex < j) {
                                // center previous label based on values
                                lastLabelIndex = grpLblsSrc[j].length - 1;
                                var grpLbl = grpLblsSrc[j][lastLabelIndex];
                                // first group label
                                if (lastLabelIndex === 0 && j < rowFields.length - 1) {
                                    grpLbl.value = (grpLbl.width - 1) / 2;
                                }
                                if (lastLabelIndex > 0 && j < rowFields.length - 1) {
                                    var offsetWidth = this._getOffsetWidth(grpLblsSrc[j]);
                                    grpLbl.value = offsetWidth + (grpLbl.width - 1) / 2;
                                }
                                grpLblsSrc[j].push({ value: dataItems.length - 1, text: rowKey.getValue(j, true), width: 1 });
                            }
                            else {
                                // calculate the width
                                lastLabelIndex = grpLblsSrc[j].length - 1;
                                grpLblsSrc[j][lastLabelIndex].width++;
                            }
                        }
                        lastRowKey = rowKey;
                    }
                }
                // center last label
                for (var j = 0; j < rowFields.length; j++) {
                    if (j < grpLblsSrc.length) { //this._ng.rowFields.length - 1) {
                        lastLabelIndex = grpLblsSrc[j].length - 1;
                        grpLblsSrc[j][lastLabelIndex].value = this._getOffsetWidth(grpLblsSrc[j]) + (grpLblsSrc[j][lastLabelIndex].width - 1) / 2;
                    }
                }
                this._dataItms = dataItems;
                this._lblsSrc = lblsSrc;
                this._grpLblsSrc = grpLblsSrc;
                this._updateFlexChartOrPie();
            };
            PivotChart.prototype._updateFlexChartOrPie = function () {
                var isPie = this._isPieChart();
                if (!isPie && this._flexChart) {
                    this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                }
                else if (isPie && this._flexPie) {
                    this._updateFlexPie(this._dataItms, this._lblsSrc);
                }
            };
            // update FlexChart
            PivotChart.prototype._updateFlexChart = function (dataItms, labelsSource, grpLblsSrc) {
                var chart = this._flexChart, host = chart ? chart.hostElement : null, axis;
                if (!this._ng || !chart || !host) { // TFS 331945
                    return;
                }
                chart.beginUpdate();
                chart.itemsSource = dataItms;
                this._createSeries();
                if (chart.series &&
                    chart.series.length > 0 &&
                    dataItms.length > 0) {
                    host.style.visibility = 'visible';
                }
                else {
                    host.style.visibility = 'hidden';
                }
                chart.header = this.header || this._getChartTitle();
                if (this.headerStyle) {
                    chart.headerStyle = this.headerStyle;
                }
                if (this.footer) {
                    chart.footer = this.footer;
                }
                if (this.footerStyle) {
                    chart.footerStyle = this.footerStyle;
                }
                if (this._isRotatedChart()) {
                    if (this._showHierarchicalAxes && grpLblsSrc.length > 0) {
                        chart.axisY.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                        chart.axisX.labelAngle = undefined;
                        if (grpLblsSrc.length >= 2) {
                            for (var i = grpLblsSrc.length - 2; i >= 0; i--) {
                                this._createGroupAxes(grpLblsSrc[i]);
                            }
                        }
                    }
                    else {
                        chart.axisY.labelAngle = undefined;
                        chart.axisY.itemsSource = labelsSource;
                    }
                    chart.axisX.itemsSource = undefined;
                }
                else {
                    if (this._showHierarchicalAxes && grpLblsSrc.length > 0) {
                        chart.axisX.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                        if (grpLblsSrc.length >= 2) {
                            for (var i = grpLblsSrc.length - 2; i >= 0; i--) {
                                this._createGroupAxes(grpLblsSrc[i]);
                            }
                        }
                    }
                    else {
                        chart.axisX.labelAngle = undefined;
                        chart.axisX.itemsSource = labelsSource;
                    }
                    chart.axisY.itemsSource = undefined;
                }
                chart.axisX.labelPadding = 6;
                chart.axisY.labelPadding = 6;
                if (this._isRotatedChart()) {
                    axis = chart.axisX;
                    chart.axisY.reversed = true;
                }
                else {
                    axis = chart.axisY;
                    chart.axisY.reversed = false;
                }
                if (chart.stacking !== wijmo.chart.Stacking.Stacked100pc && this._ng.valueFields.length > 0 && this._ng.valueFields[0].format) {
                    axis.format = this._ng.valueFields[0].format;
                }
                else {
                    axis.format = '';
                }
                chart.legend.position = this._getLegendPosition();
                chart.endUpdate();
            };
            // update FlexPie
            PivotChart.prototype._updateFlexPie = function (dataItms, labelsSource) {
                var pie = this._flexPie, host = pie ? pie.hostElement : null, colMenu = this._colMenu;
                if (!this._ng || !pie || !host) { // TFS 331945
                    return;
                }
                if (this._colItms.length > 0 &&
                    dataItms.length > 0) {
                    host.style.visibility = 'visible';
                }
                else {
                    host.style.visibility = 'hidden';
                }
                // updating pie: binding the first column
                pie.beginUpdate();
                pie.itemsSource = dataItms;
                pie.bindingName = olap._PivotKey._ROW_KEY_NAME;
                if (this._colItms && this._colItms.length > 0) {
                    pie.binding = this._colItms[0]['prop'];
                }
                pie.header = this.header || this._getChartTitle();
                if (this.headerStyle) {
                    pie.headerStyle = this.headerStyle;
                }
                if (this.footer) {
                    pie.footer = this.footer;
                }
                if (this.footerStyle) {
                    pie.footerStyle = this.footerStyle;
                }
                pie.legend.position = this._getLegendPosition();
                pie.endUpdate();
                // updating column selection menu
                var headerPrefix = this._getTitle(this._ng.columnFields);
                if (headerPrefix !== '') {
                    headerPrefix = '<b>' + headerPrefix + ': </b>';
                }
                if (this._colItms && this._colItms.length > 1 && dataItms.length > 0) {
                    colMenu.hostElement.style.visibility = 'visible';
                    colMenu.itemsSource = this._colItms;
                    colMenu.checkedItems = [this._colItms[0]];
                    colMenu.invalidate();
                    // colMenu.listBox.invalidate();
                }
                else {
                    colMenu.hostElement.style.visibility = 'hidden';
                }
            };
            // gets the position for the legend
            PivotChart.prototype._getLegendPosition = function () {
                var pos = this.legendPosition;
                if (this.showLegend == LegendVisibility.Never) {
                    pos = wijmo.chart.Position.None;
                }
                else if (this.showLegend == LegendVisibility.Auto) {
                    if (this.flexChart && this.flexChart.series) {
                        var cnt_1 = 0;
                        this.flexChart.series.forEach(function (series) {
                            var vis = series.visibility;
                            if (series.name &&
                                vis != wijmo.chart.SeriesVisibility.Hidden &&
                                vis != wijmo.chart.SeriesVisibility.Plot) {
                                cnt_1++;
                            }
                        });
                        if (cnt_1 < 2) {
                            pos = wijmo.chart.Position.None;
                        }
                    }
                }
                return pos;
            };
            // create series
            PivotChart.prototype._createSeries = function () {
                // clear the old series
                if (this._flexChart) {
                    this._flexChart.series.length = 0;
                }
                // trim series names if we have only one value field
                // so the legend doesn't show "Foo; Sales" "Bar; Sales" "Etc; Sales"
                var trimNames = this._ng.valueFields.length == 1;
                // create the new series
                for (var i = 0; i < this._colItms.length; i++) {
                    var series = new wijmo.chart.Series(), binding = this._colItms[i]['prop'], name_1 = this._colItms[i]['text'];
                    if (trimNames) {
                        var pos = name_1.lastIndexOf(';');
                        if (pos > -1) {
                            name_1 = name_1.substr(0, pos);
                        }
                    }
                    series.binding = binding;
                    series.name = name_1;
                    this._flexChart.series.push(series);
                }
            };
            // get columns from item
            PivotChart.prototype._getColumns = function (itm) {
                var sersCount = 0, colKey, colLbl;
                if (!itm) {
                    return;
                }
                this._colItms = [];
                for (var prop in itm) {
                    if (itm.hasOwnProperty(prop)) {
                        if (prop !== olap._PivotKey._ROW_KEY_NAME && sersCount < this._maxSeries) {
                            if (this._isValidColumn(prop)) {
                                colKey = this._ng._getKey(prop);
                                colLbl = this._getLabel(colKey);
                                this._colItms.push({ prop: prop, text: this._getLabel(colKey) });
                                sersCount++;
                            }
                        }
                    }
                }
            };
            // create group axes
            PivotChart.prototype._createGroupAxes = function (groups) {
                var _this = this;
                var chart = this._flexChart, rawAxis = this._isRotatedChart() ? chart.axisY : chart.axisX, ax;
                if (!groups) {
                    return;
                }
                // create auxiliary series
                ax = new wijmo.chart.Axis();
                ax.labelAngle = 0;
                ax.labelPadding = 6;
                ax.position = this._isRotatedChart() ? wijmo.chart.Position.Left : wijmo.chart.Position.Bottom;
                ax.majorTickMarks = wijmo.chart.TickMark.None;
                // set axis data source
                ax.itemsSource = groups;
                ax.reversed = rawAxis.reversed;
                ax.axisLine = false;
                // custom item formatting
                ax.itemFormatter = function (engine, label) {
                    if (ax._axrect) { // item formatter may be called before layout when axis rect isn't set yet
                        // find group
                        var group = groups.filter(function (obj) {
                            return obj.value == label.val;
                        })[0];
                        // draw custom decoration
                        var w = 0.5 * group.width;
                        if (!_this._isRotatedChart()) {
                            var x1 = ax.convert(label.val - w) + 5, x2 = ax.convert(label.val + w) - 5, y = ax._axrect.top;
                            engine.drawLine(x1, y, x2, y, PivotChart.HRHAXISCSS);
                            engine.drawLine(x1, y, x1, y - 5, PivotChart.HRHAXISCSS);
                            engine.drawLine(x2, y, x2, y - 5, PivotChart.HRHAXISCSS);
                            engine.drawLine(label.pos.x, y, label.pos.x, y + 5, PivotChart.HRHAXISCSS);
                        }
                        else {
                            var reversed = ax.reversed ? -1 : +1, y1 = ax.convert(label.val + w) + 5 * reversed, y2 = ax.convert(label.val - w) - 5 * reversed, x = ax._axrect.left + ax._axrect.width - 5;
                            engine.drawLine(x, y1, x, y2, PivotChart.HRHAXISCSS);
                            engine.drawLine(x, y1, x + 5, y1, PivotChart.HRHAXISCSS);
                            engine.drawLine(x, y2, x + 5, y2, PivotChart.HRHAXISCSS);
                            engine.drawLine(x, label.pos.y, x - 5, label.pos.y, PivotChart.HRHAXISCSS);
                        }
                    }
                    return label;
                };
                ax.min = rawAxis.actualMin;
                ax.max = rawAxis.actualMax;
                // sync axis limits with main x-axis
                rawAxis.rangeChanged.addHandler(function () {
                    if (!(isNaN(ax.min) && isNaN(rawAxis.actualMin)) && ax.min != rawAxis.actualMin) {
                        ax.min = rawAxis.actualMin;
                    }
                    if (!(isNaN(ax.max) && isNaN(rawAxis.actualMax)) && ax.max != rawAxis.actualMax) {
                        ax.max = rawAxis.actualMax;
                    }
                });
                var series = new wijmo.chart.Series();
                series.visibility = wijmo.chart.SeriesVisibility.Hidden;
                if (!this._isRotatedChart()) {
                    series.axisX = ax;
                }
                else {
                    series.axisY = ax;
                }
                chart.series.push(series);
            };
            PivotChart.prototype._updateFlexPieBinding = function () {
                var bnd = '';
                var titles = [];
                this._colMenu.checkedItems.forEach(function (item) {
                    if (bnd.length > 0) {
                        bnd += ',';
                    }
                    bnd += item['prop'];
                    titles.push(item['text']);
                });
                this._flexPie.binding = bnd;
                this._flexPie.titles = titles.length > 1 ? titles : null;
            };
            PivotChart.prototype._updatePieInfo = function () {
                var _this = this;
                if (!this._flexPie) {
                    return;
                }
                this._flexPie._labels = this._flexPie._labels.map(function (v, i) {
                    return _this._lblsSrc[i].text;
                });
            };
            // change chart type
            PivotChart.prototype._changeChartType = function () {
                var ct = null;
                if (this.chartType === PivotChartType.Pie) {
                    if (!this._flexPie) {
                        this._createFlexPie();
                    }
                    this._updateFlexPie(this._dataItms, this._lblsSrc);
                    this._swapChartAndPie(false);
                }
                else {
                    switch (this.chartType) {
                        case PivotChartType.Column:
                            ct = wijmo.chart.ChartType.Column;
                            break;
                        case PivotChartType.Bar:
                            ct = wijmo.chart.ChartType.Bar;
                            break;
                        case PivotChartType.Scatter:
                            ct = wijmo.chart.ChartType.Scatter;
                            break;
                        case PivotChartType.Line:
                            ct = wijmo.chart.ChartType.Line;
                            break;
                        case PivotChartType.Area:
                            ct = wijmo.chart.ChartType.Area;
                            break;
                    }
                    if (!this._flexChart) {
                        this._createFlexChart();
                        this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                    }
                    else {
                        // 1.from pie to flex chart
                        // 2.switch between bar chart and other flex charts
                        // then rebind the chart.
                        if (this._flexChart.hostElement.style.display === 'none' ||
                            ct === PivotChartType.Bar || this._flexChart.chartType === wijmo.chart.ChartType.Bar) {
                            this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                        }
                    }
                    this._flexChart.chartType = ct;
                    this._swapChartAndPie(true);
                }
            };
            PivotChart.prototype._swapChartAndPie = function (chartshow) {
                var _this = this;
                if (this._flexChart) {
                    this._flexChart.hostElement.style.display = chartshow ? 'block' : 'none';
                }
                if (this._flexPie) {
                    this._flexPie.hostElement.style.display = !chartshow ? 'block' : 'none';
                    ;
                }
                if (this._colMenu && this._colMenu.hostElement) {
                    this._colMenu.hostElement.style.display = chartshow ? 'none' : 'block';
                    //workaround for #276985
                    this._colMenu.hostElement.style.top = '0';
                    setTimeout(function () {
                        _this._colMenu.hostElement.style.top = '';
                    }, 0);
                }
            };
            PivotChart.prototype._getLabel = function (key) {
                var sb = '';
                if (!key || !key.values) {
                    return sb;
                }
                var fld = key.valueFields ? key.valueField : null; // TFS 258996
                switch (key.values.length) {
                    case 0:
                        if (fld) {
                            sb += fld.header;
                        }
                        break;
                    case 1:
                        sb += key.getValue(0, true);
                        if (fld) {
                            sb += '; ' + fld.header;
                        }
                        break;
                    default:
                        for (var i = 0; i < key.values.length; i++) {
                            if (i > 0)
                                sb += "; ";
                            sb += key.getValue(i, true);
                        }
                        if (fld) {
                            sb += '; ' + fld.header;
                        }
                        break;
                }
                return sb;
            };
            PivotChart.prototype._getValue = function (ht) {
                var vf = this._ng.valueFields, idx = ht.series ? ht.series.chart.series.indexOf(ht.series) : 0, fmt = idx < vf.length ? vf[idx].format : vf.length ? vf[0].format : '';
                return fmt ? wijmo.Globalize.format(ht.y, fmt) : ht._yfmt;
            };
            PivotChart.prototype._getChartTitle = function () {
                // no title? no value fields? no work
                if (!this.showTitle || !this._ng.valueFields.length) {
                    return null;
                }
                // build chart title
                var ng = this._ng, value = this._getTitle(ng.valueFields), rows = this._getTitle(ng.rowFields), cols = this._getTitle(ng.columnFields), title = value, str = wijmo.culture.olap.PivotChart;
                if (value && this._dataItms.length > 0) {
                    if (rows) {
                        title += wijmo.format(' {by} {rows}', {
                            by: str.by,
                            rows: rows
                        });
                    }
                    if (cols) {
                        title += wijmo.format(' {and} {cols}', {
                            and: rows ? str.and : str.by,
                            cols: cols
                        });
                    }
                }
                return title;
            };
            PivotChart.prototype._getTitle = function (fields) {
                var sb = '';
                for (var i = 0; i < fields.length; i++) {
                    if (sb.length > 0)
                        sb += '; ';
                    sb += fields[i].header;
                }
                return sb;
            };
            PivotChart.prototype._isValidColumn = function (colKey) {
                var kVals = colKey.split(';');
                var showTotals = this._showTotals;
                if (this._ng.columnFields.length === 0) {
                    return true;
                }
                else {
                    if (kVals && kVals.length === 2) {
                        return showTotals;
                    }
                    else if (kVals && (kVals.length - 2 === this._ng.columnFields.length)) {
                        return !showTotals;
                    }
                    else {
                        return false;
                    }
                }
            };
            PivotChart.prototype._isTotalRow = function (rowKey) {
                if (rowKey.values.length < this._ng.rowFields.length) {
                    return true;
                }
                return false;
            };
            PivotChart.prototype._isPieChart = function () {
                return this._chartType == PivotChartType.Pie;
            };
            PivotChart.prototype._isRotatedChart = function () {
                //xor
                return !this._isPieChart() && ((this._chartType == PivotChartType.Bar) !== this._flexChart.rotated);
            };
            PivotChart.prototype._getMergeIndex = function (key1, key2) {
                var index = -1;
                if (key1 != null && key2 != null &&
                    key1.values.length == key2.values.length &&
                    key1.values.length == key1.fields.length &&
                    key2.values.length == key2.fields.length) {
                    for (var i = 0; i < key1.values.length; i++) {
                        var v1 = key1.getValue(i, true);
                        var v2 = key2.getValue(i, true);
                        if (v1 == v2) {
                            index = i;
                        }
                        else {
                            return index;
                        }
                    }
                }
                return index;
            };
            PivotChart.prototype._getOffsetWidth = function (labels) {
                var offsetWidth = 0;
                if (labels.length <= 1) {
                    return offsetWidth;
                }
                for (var i = 0; i < labels.length - 1; i++) {
                    offsetWidth += labels[i].width;
                }
                return offsetWidth;
            };
            PivotChart.MAX_SERIES = 100;
            PivotChart.MAX_POINTS = 100;
            PivotChart.HRHAXISCSS = 'wj-hierarchicalaxes-line';
            return PivotChart;
        }(wijmo.Control));
        olap.PivotChart = PivotChart;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Generates MDX queries for the {@link _SqlServerConnection} class.
         */
        var _MdxQueryBuilder = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link _MdxQueryBuilder} class.
             *
             * @param engine {@link PivotEngine} from which to derive a query.
             * @param cubeName Name of the cube to be queried.
             */
            function _MdxQueryBuilder(engine, cubeName) {
                this._ng = null;
                this._cubeName = null;
                this._ng = engine;
                this._cubeName = cubeName;
            }
            /**
             * Builds the MDX query according to information from the {@link PivotEngine}.
             */
            _MdxQueryBuilder.prototype.buildQuery = function () {
                var expr = new olap._TextBuilder();
                var where = this.buildWhereSection(this._ng.valueFields);
                expr.append("SELECT ", this.buildAxes(), " FROM ", this.buildCubeName(), where);
                expr.append(" CELL PROPERTIES VALUE, FORMAT_STRING");
                return expr.toString();
            };
            /**
             * Builds expressions for the WHERE section of the MDX query.
             *
             * @param measureShelf Collection of measure fields.
             */
            _MdxQueryBuilder.prototype.buildWhereSection = function (measureShelf) {
                var expr = new olap._TextBuilder();
                if (measureShelf.length == 1) {
                    expr.append(this.buildSetForMeasuresShelf(measureShelf));
                    expr.wrap(" WHERE ", "");
                }
                return expr.toString();
            };
            /**
             * Returns the cube name for the FROM section of the MDX query.
             */
            _MdxQueryBuilder.prototype.buildCubeName = function () {
                var expr = new olap._TextBuilder();
                expr.append(this.buildSubcubeExpression());
                var needSubCube = expr.length > 0;
                if (needSubCube) {
                    expr.wrap("SELECT ", " FROM ");
                }
                expr.append("[", this._cubeName, "]");
                if (needSubCube) {
                    expr.wrap("(", ")");
                }
                return expr.toString();
            };
            /**
             * Builds the subcube section.
             */
            _MdxQueryBuilder.prototype.buildSubcubeExpression = function () {
                var expr = new olap._TextBuilder();
                var measures = this.getMeasureFilterExpressions(this._ng.valueFields);
                var filterSet = this.buildFilterAttributeSet(this._ng.filterFields);
                var rowSet = this.buildFilterAttributeSet(this._ng.rowFields, measures);
                var colSet = this.buildFilterAttributeSet(this._ng.columnFields, (rowSet.length == 0) ? measures : null);
                expr.joinItemToList(filterSet);
                expr.joinItemToList(rowSet);
                expr.joinItemToList(colSet);
                if (expr.length > 0) {
                    expr.wrap("(", ")");
                    expr.append(" ON COLUMNS");
                }
                return expr.toString();
            };
            _MdxQueryBuilder.prototype.buildFilterAttributeSet = function (shelf, measures) {
                var expr = new olap._TextBuilder();
                for (var i = 0; i < shelf.length; i++) {
                    var field = shelf[i];
                    var filter = this.buildFilterString(field, (i == 0) ? measures : null);
                    expr.joinItemToList(filter);
                }
                return expr.toString();
            };
            _MdxQueryBuilder.prototype.buildFilterString = function (field, measures) {
                var expr = new olap._TextBuilder();
                if (field.filter.isActive) {
                    if (field.filter.conditionFilter.isActive) {
                        expr.append(this.getConditionFilterString(field, measures));
                    }
                    else if (field.filter.valueFilter.isActive) {
                        expr.append(this.getValueFilterString(field));
                    }
                }
                else if (measures) {
                    expr.append(this.getConditionFilterString(field, measures));
                }
                return expr.toString();
            };
            _MdxQueryBuilder.prototype.getValueFilterString = function (field) {
                var expr = new olap._TextBuilder();
                var filter = field.filter.valueFilter;
                var values = Object.keys(filter.showValues).map(function (v) { return field.key + ".[" + v + "]"; });
                expr.append(values.join(","));
                if (expr.length > 0) {
                    expr.wrap("{", "}");
                }
                return expr.toString();
            };
            _MdxQueryBuilder.prototype.getConditionFilterString = function (field, measures) {
                var expr = new olap._TextBuilder();
                var allMembers = field.key + ".LEVELS(1).ALLMEMBERS";
                var condition1 = field.filter.conditionFilter.condition1;
                var condition2 = field.filter.conditionFilter.condition2;
                if (condition1.isActive) {
                    expr.append(this.getConditionFilterExpression(field, condition1));
                    if (condition2.isActive) {
                        expr.append(field.filter.conditionFilter.and ? " AND " : " OR ");
                    }
                }
                if (condition2.isActive) {
                    expr.append(this.getConditionFilterExpression(field, condition2));
                }
                if (measures && measures.length > 0) {
                    if (expr.length > 0) {
                        expr.append(" AND ");
                    }
                    expr.append(measures.join(" AND "));
                }
                if (expr.length > 0) {
                    expr.wrap("Filter(" + allMembers + ",(", "))");
                }
                return expr.toString();
            };
            _MdxQueryBuilder.prototype.getMeasureFilterExpressions = function (shelf) {
                var filters = [];
                for (var i = 0; i < shelf.length; i++) {
                    var expr = new olap._TextBuilder();
                    var field = shelf[i];
                    var isMeasure = field.dimensionType == olap.DimensionType.Measure;
                    var condition1 = field.filter.conditionFilter.condition1;
                    var condition2 = field.filter.conditionFilter.condition2;
                    if (condition1.isActive) {
                        expr.append(this.getConditionFilterExpression(field, condition1));
                        if (condition2.isActive) {
                            expr.append(field.filter.conditionFilter.and ? " AND " : " OR ");
                        }
                    }
                    if (condition2.isActive) {
                        expr.append(this.getConditionFilterExpression(field, condition2));
                    }
                    if (expr.length > 0) {
                        expr.wrap("(", ")");
                        filters.push(expr.toString());
                    }
                }
                return filters;
            };
            _MdxQueryBuilder.prototype.getConditionFilterExpression = function (field, condition) {
                if (!condition.isActive) {
                    return "";
                }
                var isMeasure = field.dimensionType == olap.DimensionType.Measure;
                var isNumeric = field.dataType == wijmo.DataType.Number;
                var isDate = field.dataType == wijmo.DataType.Date;
                var property = (isNumeric || isDate) ? "member_value" : "member_caption";
                var currentMembers = isMeasure ? field.key : field.key + ".CurrentMember." + property;
                var value = isDate ? "CDate('" + wijmo.Globalize.formatDate(condition.value, "d") + "')" : condition.value.toString();
                var expr = new olap._TextBuilder();
                switch (condition.operator) {
                    case wijmo.grid.filter.Operator.BW:
                        expr.append("(Left(", currentMembers, ",", value.length.toString(), ")=\"", value, "\")");
                        break;
                    case wijmo.grid.filter.Operator.EW:
                        expr.append("(Right(", currentMembers, ",", value.length.toString(), ")=\"", value, "\")");
                        break;
                    case wijmo.grid.filter.Operator.EQ:
                        if (isMeasure || isNumeric || isDate) {
                            expr.append("(", currentMembers, ")=", value);
                        }
                        else {
                            expr.append("(", currentMembers, ")=\"", value, "\"");
                        }
                        break;
                    case wijmo.grid.filter.Operator.NE:
                        if (isMeasure || isNumeric || isDate) {
                            expr.append("(", currentMembers, ")<>", value);
                        }
                        else {
                            expr.append("(", currentMembers, ")<>\"", value, "\"");
                        }
                        break;
                    case wijmo.grid.filter.Operator.CT:
                        expr.append("(InStr(1,", currentMembers, ",\"", value, "\")>0)");
                        break;
                    case wijmo.grid.filter.Operator.NC:
                        expr.append("(InStr(1,", currentMembers, ",\"", value, "\")=0))");
                        break;
                    case wijmo.grid.filter.Operator.GT:
                        expr.append("(", currentMembers, ")>", value);
                        break;
                    case wijmo.grid.filter.Operator.LT:
                        expr.append("(", currentMembers, ")<", value);
                        break;
                    case wijmo.grid.filter.Operator.GE:
                        expr.append("(", currentMembers, ")>=", value);
                        break;
                    case wijmo.grid.filter.Operator.LE:
                        expr.append("(", currentMembers, ")<=", value);
                        break;
                    default:
                        break;
                }
                return expr.toString();
            };
            /**
             * Builds expressions for the SELECT section of the MDX query.
             */
            _MdxQueryBuilder.prototype.buildAxes = function () {
                var expr = new olap._TextBuilder();
                var axisSet = this.buildSetForAttributesShelf(this._ng.rowFields);
                expr.joinItemToList(axisSet);
                if (this._ng.rowFields.length > 0) {
                    if (this._ng.columnFields.length > 0 || this._ng.valueFields.length > 1) {
                        expr.append(" ON ROWS");
                    }
                    else {
                        expr.append(" ON COLUMNS");
                    }
                }
                axisSet = this.buildSetForAttributesColumnShelf(this._ng.columnFields);
                expr.joinItemToList(axisSet);
                if (this._ng.columnFields.length > 0) {
                    expr.append(" ON COLUMNS");
                }
                if (this._ng.valueFields.length > 1 && this._ng.columnFields.length == 0) {
                    axisSet = this.buildSetForMeasuresShelf(this._ng.valueFields);
                    expr.joinItemToList(axisSet);
                    expr.append(" ON COLUMNS");
                }
                return expr.toString();
            };
            /**
             * Builds set for one axis.
             *
             * @param shelf Collection of fields to include in tuples of the set.
             */
            _MdxQueryBuilder.prototype.buildSetForAttributesShelf = function (shelf) {
                var expr = new olap._TextBuilder();
                for (var i = 0; i < shelf.length; i++) {
                    var field = shelf[i];
                    if (field.dimensionType == olap.DimensionType.Attribute || field.dimensionType == olap.DimensionType.Hierarchy) {
                        expr.joinItemToList(this.buildAttributeSetForAxis(field));
                    }
                    if (i > 0) {
                        expr.wrap("CrossJoin(", ")");
                    }
                }
                expr.wrap("NON EMPTY ", "");
                return expr.toString();
            };
            /**
             * Builds set for one axis.
             *
             * @param shelf Collection of fields to include in tuples of the set.
             */
            _MdxQueryBuilder.prototype.buildSetForAttributesColumnShelf = function (shelf) {
                var expr = new olap._TextBuilder();
                for (var i = 0; i < shelf.length; i++) {
                    var field = shelf[i];
                    if (field.dimensionType == olap.DimensionType.Attribute || field.dimensionType == olap.DimensionType.Hierarchy) {
                        expr.joinItemToList(this.buildAttributeSetForAxis(field));
                    }
                }
                if (this._ng.valueFields.length > 1 && shelf.length > 0) {
                    expr.joinItemToList(this.buildSetForMeasuresShelf(this._ng.valueFields));
                }
                if ((this._ng.valueFields.length > 1 && shelf.length > 0) || shelf.length > 1) {
                    expr.wrap("CrossJoin(", ")");
                }
                expr.wrap("NON EMPTY ", "");
                return expr.toString();
            };
            /**
             * Builds set for one axis.
             *
             * @param shelf Collection of fields to include in tuples of the set.
             */
            _MdxQueryBuilder.prototype.buildSetForMeasuresShelf = function (shelf) {
                var expr = new olap._TextBuilder();
                for (var i = 0; i < shelf.length; i++) {
                    var field = shelf[i];
                    if (field.dimensionType == olap.DimensionType.Measure || field.dimensionType == olap.DimensionType.Kpi) {
                        expr.joinItemToList(this.buildMeasureSetForAxis(field));
                    }
                }
                expr.wrap("{", "}");
                return expr.toString();
            };
            /**
             * Builds set for one attribute.
             *
             * @param field Attribute or named set.
             */
            _MdxQueryBuilder.prototype.buildAttributeSetForAxis = function (field) {
                var expr = new olap._TextBuilder();
                if (field.dimensionType == olap.DimensionType.Hierarchy) {
                    expr.append(field.key);
                    expr.append(".ALLMEMBERS");
                    expr.wrap("{", "}");
                    expr.wrap("HIERARCHIZE(", ")");
                }
                return expr.toString();
            };
            /**
             * Builds set for one attribute.
             *
             * @param field Attribute or named set.
             */
            _MdxQueryBuilder.prototype.buildMeasureSetForAxis = function (field) {
                var expr = new olap._TextBuilder();
                if (field.dimensionType == olap.DimensionType.Measure || field.dimensionType == olap.DimensionType.Kpi) {
                    expr.append(field.key);
                }
                return expr.toString();
            };
            return _MdxQueryBuilder;
        }());
        olap._MdxQueryBuilder = _MdxQueryBuilder;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a connection to a standard SSAS service.
         */
        var _SqlServerConnection = /** @class */ (function (_super) {
            __extends(_SqlServerConnection, _super);
            //private _override = null;
            /**
             * Initializes a new instance of the {@link _SqlServerConnection} class.
             *
             * @param engine {@link PivotEngine} that owns this field.
             * @param options Options used to communicate with the server.
             */
            function _SqlServerConnection(engine, options) {
                var _this = _super.call(this, engine, options.url) || this;
                _this._jsonResult = null;
                _this._dataTypes = null;
                _this._debug = false;
                engine.sortOnServer = true;
                wijmo.assert(wijmo.isString(options.cube) && !wijmo.isNullOrWhiteSpace(options.cube), "Cube name required.");
                _this._cubeName = options.cube;
                _this._catalogName = (wijmo.isString(options.catalog) && !wijmo.isNullOrWhiteSpace(options.catalog)) ? options.catalog : "";
                _this._url = options.url;
                _this._user = options.user;
                _this._password = options.password;
                return _this;
                //this._override = options.query;
            }
            /**
             * Gets a list of fields available on the server.
             */
            _SqlServerConnection.prototype.getFields = function () {
                // get SSAS session id
                var xhr = this._getSession();
                // parse and return result
                this._jsonResult = null;
                this._dataTypes = null;
                this._getProperties(this._token);
                this._getDimensions(this._token);
                this._endSession();
                return this._jsonResult;
            };
            /**
             * Gets the output view for the current view definition.
             *
             * @param callBack function invoked to handle the results.
             */
            _SqlServerConnection.prototype.getOutputView = function (callBack) {
                var _this = this;
                this._ng.onUpdatingView(new olap.ProgressEventArgs(0));
                var mdx = new olap._MdxQueryBuilder(this._ng, this._cubeName);
                var query = mdx.buildQuery();
                //if (this._override) {
                //    query = this._override(query);
                //}
                this._jsonResult = [];
                this._getSession();
                this._execQuery(this._token, query, function (xhr) {
                    //if (this._debug && isFunction(saveAs)) {
                    //    let blob = new Blob([xhr.responseText], {type: "text/plain;charset=utf-8"});
                    //    saveAs(blob, this._token + ".xml");
                    //    if (this._jsonResult.length > 0) {
                    //        let blob = new Blob([JSON.stringify(this._jsonResult)], {type: "text/plain;charset=utf-8"});
                    //        saveAs(blob, this._token + ".json");
                    //    }
                    //}
                    wijmo.asFunction(callBack)(_this._jsonResult);
                    _this._ng.onUpdatedView(new olap.ProgressEventArgs(100)); // TFS 404441
                });
            };
            /**
             * Gets an array containing the data items that were used to calculate
             * an aggregated cell.
             *
             * @param rowKey Identifies the row that contains the aggregated cell.
             * @param colKey Identifies the column that contains the aggregated cell.
             */
            _SqlServerConnection.prototype.getDetail = function (rowKey, colKey) {
                throw 'getDetail method not supported';
            };
            /**
             * Returns a sorted array of PivotKey ids (if sortOnServer is true, the assumption is
             * that subtotal keys are returned by the server as if totalsBeforeData is also true).
             */
            _SqlServerConnection.prototype.getSortedKeys = function (obj, isRow) {
                var _this = this;
                var keys = Object.keys(obj);
                if (!this._ng.sortOnServer) {
                    keys.sort(function (id1, id2) {
                        return _this._ng._keys[id1].compareTo(_this._ng._keys[id2]);
                    });
                }
                else if (keys.length > 1) {
                    var showTotals = isRow ? this._ng.showRowTotals : this._ng.showColumnTotals;
                    var maxKeys_1 = isRow ? this._ng.rowFields.length : this._ng.columnFields.length;
                    var maxValues_1 = this._ng.valueFields.length;
                    if (!this._ng.totalsBeforeData) {
                        if (showTotals !== olap.ShowTotals.None) {
                            var last_1 = -1;
                            var totals_1 = [], result_1 = [];
                            keys.forEach(function (key) {
                                var n = _this._getKeyLength(key, isRow);
                                if (n === maxKeys_1) {
                                    result_1.push(key);
                                }
                                else if (n >= last_1) {
                                    totals_1.push(key);
                                }
                                else {
                                    if (totals_1.length >= maxValues_1) {
                                        for (var i = 0; i < maxValues_1; i++) {
                                            result_1.push(totals_1.pop());
                                        }
                                    }
                                    totals_1.push(key);
                                }
                                last_1 = n;
                            });
                            if (totals_1.length > 0) {
                                totals_1.reverse();
                                result_1 = result_1.concat(totals_1);
                            }
                            return result_1;
                        }
                    }
                }
                return keys;
            };
            // ** implementation
            // get SSAS session id
            _SqlServerConnection.prototype._getSession = function () {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_SESSION,
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var xml = xhr.responseXML;
                        var session = xml.getElementsByTagName("Session");
                        _this._token = session[0].getAttribute("SessionId");
                    },
                    error: function (xhr) {
                        _this._handleError("Begin Session", xhr);
                    }
                });
            };
            // end SSAS session
            _SqlServerConnection.prototype._endSession = function () {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_ENDSESSION(this._token),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    error: function (xhr) {
                        _this._handleError("End Session", xhr);
                    },
                    complete: function (xhr) {
                        _this._token = undefined;
                    }
                });
            };
            // get properties of database members
            _SqlServerConnection.prototype._getProperties = function (id) {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_PROPERTIES(id, this._catalogName, this._cubeName),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var types = {};
                        var xml = xhr.responseXML;
                        var rows = xml.getElementsByTagName("row");
                        for (var i = 0; i < rows.length; i++) {
                            var name = _getTagValue(rows[i], "HIERARCHY_UNIQUE_NAME");
                            var type = Number(_getTagValue(rows[i], "DATA_TYPE"));
                            switch (type) {
                                case 2: // Small Integer
                                case 3: // Integer
                                case 4: // Single
                                case 5: // Double
                                case 6: // Currency
                                    types[name] = wijmo.DataType.Number;
                                    break;
                                case 7: // Date
                                    types[name] = wijmo.DataType.Date;
                                    break;
                            }
                        }
                        _this._dataTypes = types;
                    },
                    error: function (xhr) {
                        _this._handleError("Get Properties", xhr);
                    }
                });
            };
            // get first level dimensions
            _SqlServerConnection.prototype._getDimensions = function (id) {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_DIMENSIONS(id, this._catalogName, this._cubeName),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var data = [];
                        var xml = xhr.responseXML;
                        var rows = xml.getElementsByTagName("row");
                        for (var i = 0; i < rows.length; i++) {
                            var type = _getTagValue(rows[i], "DIMENSION_TYPE");
                            if (type !== "2") { // MD_DIMTYPE_MEASURE
                                var dim = _getTagValue(rows[i], "DIMENSION_UNIQUE_NAME");
                                var field = {
                                    "header": _getTagValue(rows[i], "DIMENSION_CAPTION"),
                                    "dataType": wijmo.DataType.Object,
                                    "dimensionType": olap.DimensionType.Dimension,
                                    "subFields": []
                                };
                                _this._getSubFolders(id, dim, field);
                                data.push(field);
                            }
                            else {
                                _this._getMeasures(id, data);
                            }
                        }
                        var kpi = {
                            "header": "KPIs",
                            "dataType": wijmo.DataType.Object,
                            "dimensionType": olap.DimensionType.Kpi,
                            "subFields": []
                        };
                        _this._getKPIs(id, kpi);
                        data.push(kpi);
                        _this._jsonResult = data;
                    },
                    error: function (xhr) {
                        _this._handleError("Get Dimensions", xhr);
                    }
                });
            };
            // get subfolders for second level
            _SqlServerConnection.prototype._getSubFolders = function (id, dimension, field) {
                var _this = this;
                var url = this._url;
                wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_HIERARCHIES(id, this._catalogName, this._cubeName, dimension),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var xml = xhr.responseXML;
                        var rows = xml.getElementsByTagName("row");
                        for (var i = 0; i < rows.length; i++) {
                            var row = {
                                "header": _getTagValue(rows[i], "HIERARCHY_NAME"),
                                "binding": _getTagValue(rows[i], "HIERARCHY_UNIQUE_NAME"),
                                "dataType": wijmo.DataType.String,
                                "dimensionType": olap.DimensionType.Hierarchy
                            };
                            if (_this._dataTypes[row.binding]) {
                                row.dataType = _this._dataTypes[row.binding];
                            }
                            var folder = _getTagValue(rows[i], "HIERARCHY_DISPLAY_FOLDER");
                            var names = folder.split("\\");
                            var temp = field;
                            for (var n = 0; n < names.length; n++) {
                                if (names[n] == "")
                                    continue;
                                var child = {
                                    "header": names[n],
                                    "dataType": wijmo.DataType.Object,
                                    "dimensionType": olap.DimensionType.Folder,
                                    "subFields": []
                                };
                                if (!_containsFolder(temp, names[n])) {
                                    temp.subFields.push(child);
                                    temp = child;
                                }
                                else {
                                    temp = _findSubFieldByName(temp, names[n]);
                                }
                            }
                            temp.subFields.push(row);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError("Get Hierarchies", xhr);
                    }
                });
            };
            // get measures
            _SqlServerConnection.prototype._getMeasures = function (id, fields) {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_MEASURES(id, this._catalogName, this._cubeName),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var xml = xhr.responseXML;
                        var rows = xml.getElementsByTagName("row");
                        var folders = {};
                        for (var i = 0; i < rows.length; i++) {
                            var folder = _getTagValue(rows[i], "MEASUREGROUP_NAME");
                            var field = {
                                "header": _getTagValue(rows[i], "MEASURE_CAPTION"),
                                "binding": _getTagValue(rows[i], "MEASURE_UNIQUE_NAME"),
                                "dataType": wijmo.DataType.Number,
                                "dimensionType": olap.DimensionType.Measure
                            };
                            if (Object.keys(folders).indexOf(folder) < 0) {
                                var measure = {
                                    "header": folder,
                                    "dataType": wijmo.DataType.Number,
                                    "dimensionType": olap.DimensionType.Measure,
                                    "subFields": []
                                };
                                measure.subFields.push(field);
                                fields.push(measure);
                                folders[folder] = measure;
                            }
                            else {
                                folders[folder].subFields.push(field);
                            }
                        }
                    },
                    error: function (xhr) {
                        _this._handleError("Get Measures", xhr);
                    }
                });
            };
            // get KPIs
            _SqlServerConnection.prototype._getKPIs = function (id, field) {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: false,
                    data: _ENV_KPIS(id, this._catalogName, this._cubeName),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var xml = xhr.responseXML;
                        var rows = xml.getElementsByTagName("row");
                        for (var i = 0; i < rows.length; i++) {
                            var folder = _getTagValue(rows[i], "KPI_DISPLAY_FOLDER");
                            var names = folder.split("\\");
                            var temp = field;
                            for (var n = 0; n < names.length; n++) {
                                var child = {
                                    "header": names[n],
                                    "dataType": wijmo.DataType.Object,
                                    "dimensionType": olap.DimensionType.Folder,
                                    "subFields": []
                                };
                                if (!_containsFolder(temp, names[n])) {
                                    temp.subFields.push(child);
                                    temp = child;
                                }
                                else {
                                    temp = _findSubFieldByName(temp, names[n]);
                                }
                            }
                            var kpi = {
                                "header": _getTagValue(rows[i], "KPI_CAPTION"),
                                "binding": _getTagValue(rows[i], "KPI_VALUE"),
                                "dataType": wijmo.DataType.Number,
                                "dimensionType": olap.DimensionType.Kpi
                            };
                            temp.subFields.push(kpi);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError("Get KPIs", xhr);
                    }
                });
            };
            // execute mdx query
            _SqlServerConnection.prototype._execQuery = function (id, query, success) {
                var _this = this;
                var url = this._url;
                return wijmo.httpRequest(url, {
                    async: true,
                    data: _ENV_QUERY(id, this._catalogName, query),
                    method: "POST",
                    user: this._user,
                    password: this._password,
                    requestHeaders: {
                        "Content-Type": "text/xml"
                    },
                    success: function (xhr) {
                        var xml = xhr.responseXML;
                        var error = xml.querySelector("Error");
                        if (error) {
                            var desc = error.getAttribute("Description");
                            throw "SSAS Error" + '\r\n' + desc + '\r\n' + query;
                        }
                        else {
                            _this._createPivotKeys(xml);
                            wijmo.asFunction(success)(xhr);
                        }
                    },
                    error: function (xhr) {
                        _this._handleError("Execute Query", xhr);
                    },
                    complete: function () {
                        _this._endSession();
                    }
                });
            };
            // convert XML cell data to an array of objects
            _SqlServerConnection.prototype._createPivotKeys = function (xml) {
                var rowAxis = null;
                var columnAxis = null;
                var cellData = xml.querySelector("CellData");
                if (this._ng.columnFields.length > 0 || this._ng.valueFields.length > 1) {
                    columnAxis = xml.querySelector("Axis[name='Axis0']");
                    if (this._ng.rowFields.length > 0) {
                        rowAxis = xml.querySelector("Axis[name='Axis1']");
                    }
                }
                else {
                    if (this._ng.rowFields.length > 0) {
                        rowAxis = xml.querySelector("Axis[name='Axis0']");
                    }
                }
                var hasRows = rowAxis && this._ng.rowFields.length > 0;
                var hasColumns = columnAxis && this._ng.columnFields.length > 0;
                if (hasRows && hasColumns) {
                    this._createRowKeys(cellData, rowAxis, columnAxis);
                }
                else if (hasRows) {
                    this._createRowOnlyKeys(cellData, rowAxis);
                }
                else if (hasColumns) {
                    this._createColumnOnlyKeys(cellData, columnAxis);
                }
            };
            // process row tuples when there are columns
            _SqlServerConnection.prototype._createRowKeys = function (cellData, rowAxis, columnAxis) {
                var rowTuples = rowAxis.getElementsByTagName("Tuple");
                var columnTuples = columnAxis.getElementsByTagName("Tuple");
                var rowStart = this._ng.showRowTotals !== olap.ShowTotals.None ? 0 : 1;
                var columnStart = this._ng.showColumnTotals !== olap.ShowTotals.None ? 0 : this._ng.valueFields.length;
                for (var i = rowStart; i < rowTuples.length; i++) {
                    var ordinal = i * columnTuples.length;
                    var rowTuple = rowTuples[i];
                    var cell = this._validateTuple(rowTuple, this._ng.showRowTotals);
                    if (cell) {
                        for (var j = columnStart; j < columnTuples.length; j++) {
                            var columnTuple = columnTuples[j];
                            var result = this._validateTuple(columnTuple, this._ng.showColumnTotals);
                            if (result) {
                                for (var key in cell) {
                                    result[key] = cell[key];
                                }
                                for (var v = 0; v < this._ng.valueFields.length; v++) {
                                    var field = this._ng.valueFields[v];
                                    result[field.key] = _getCellValue(cellData, ordinal + j + v);
                                }
                                this._jsonResult.push(result);
                            }
                        }
                    }
                }
            };
            // process row tuples when there are no columns
            _SqlServerConnection.prototype._createRowOnlyKeys = function (cellData, rowAxis) {
                var tuples = rowAxis.getElementsByTagName("Tuple");
                var skip = this._ng.valueFields.length;
                var start = this._ng.showRowTotals !== olap.ShowTotals.None ? 0 : 1;
                var ordinal = start * skip;
                for (var i = start; i < tuples.length; i++) {
                    var tuple = tuples[i];
                    var cell = this._validateTuple(tuple, this._ng.showRowTotals);
                    if (cell) {
                        for (var v = 0; v < this._ng.valueFields.length; v++) {
                            var field = this._ng.valueFields[v];
                            cell[field.key] = _getCellValue(cellData, ordinal++);
                        }
                        this._jsonResult.push(cell);
                    }
                    else {
                        ordinal++;
                    }
                }
            };
            // process column tuples when there are no rows
            _SqlServerConnection.prototype._createColumnOnlyKeys = function (cellData, columnAxis) {
                var tuples = columnAxis.getElementsByTagName("Tuple");
                var skip = this._ng.valueFields.length;
                var start = this._ng.showColumnTotals !== olap.ShowTotals.None ? 0 : 1;
                for (var i = start; i < tuples.length; i += skip) {
                    var tuple = tuples[i];
                    var cell = this._validateTuple(tuple, this._ng.showColumnTotals);
                    if (cell) {
                        for (var v = 0; v < this._ng.valueFields.length; v++) {
                            var field = this._ng.valueFields[v];
                            cell[field.key] = _getCellValue(cellData, i - start + v);
                        }
                        this._jsonResult.push(cell);
                    }
                }
            };
            // return an object that maps hierarchy keys to axis captions
            // (null return means skip this tuple and its <CellData> entries)
            _SqlServerConnection.prototype._validateTuple = function (tuple, totals) {
                var members = tuple.getElementsByTagName("Member");
                var oldLevel = undefined;
                var result = {};
                for (var m = 0; m < members.length; m++) {
                    var member = members[m];
                    var level = _getLevelNumber(member);
                    var hierarchy = member.getAttribute("Hierarchy");
                    var caption = _getCaptionValue(member);
                    if (m == 0) {
                        oldLevel = level;
                    }
                    else if (level > oldLevel) {
                        return null;
                    }
                    else if (totals !== olap.ShowTotals.Subtotals && level !== oldLevel && hierarchy !== "[Measures]") {
                        return null;
                    }
                    else {
                        oldLevel = level;
                    }
                    if (hierarchy.indexOf(".") >= 0) { // ignore [Measures], for example
                        result[hierarchy] = caption;
                    }
                    else if (caption !== null) {
                        result[caption] = null;
                    }
                }
                return result;
            };
            return _SqlServerConnection;
        }(olap._ServerConnection));
        olap._SqlServerConnection = _SqlServerConnection;
        // ** helper functions for XML parsing
        function _getTagValue(row, name) {
            var tag = row.querySelector(name);
            return tag ? (tag.innerHTML || tag.textContent) : null;
        }
        function _getLevelNumber(row) {
            return Number(_getTagValue(row, "LNum"));
        }
        function _getCaptionValue(row) {
            return _getLevelNumber(row) > 0 ? _getTagValue(row, "Caption") : null;
        }
        function _getCellValue(cells, ordinal) {
            var expr = "Cell[CellOrdinal='" + ordinal.toString() + "']";
            var cell = cells.querySelector(expr);
            if (cell) {
                var value = _getTagValue(cell, "Value");
                if (value) {
                    return Number(value);
                }
            }
            return null;
        }
        // ** helper functions for building field hierarchy
        function _findSubFieldByName(field, name) {
            if (field.subFields) {
                for (var i = 0; i < field.subFields.length; i++) {
                    var sub = field.subFields[i];
                    if (sub.header == name) {
                        return sub;
                    }
                }
            }
            return field;
        }
        function _containsFolder(field, name) {
            if (field.subFields) {
                for (var i = 0; i < field.subFields.length; i++) {
                    var sub = field.subFields[i];
                    if (sub.header == name) {
                        return true;
                    }
                }
            }
            return false;
        }
        // ** SOAP envelope templates for XMLA
        var _ENV_SESSION = "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <BeginSession soap:mustUnderstand=\"1\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <Command>\n                    <Statement />\n                </Command>\n                <Properties>\n                </Properties>\n            </Execute>\n        </Body>\n    </Envelope>";
        var _ENV_ENDSESSION = function (sessionId) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:EndSession soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <Command>\n                    <Statement />\n                </Command>\n                <Properties>\n                </Properties>\n            </Execute>\n        </Body>\n    </Envelope>"; };
        var _ENV_DIMENSIONS = function (sessionId, catalogName, cubeName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_DIMENSIONS</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_HIERARCHIES = function (sessionId, catalogName, cubeName, dimensionName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_HIERARCHIES</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                        <DIMENSION_UNIQUE_NAME>" + dimensionName + "</DIMENSION_UNIQUE_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_MEASURES = function (sessionId, catalogName, cubeName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_MEASURES</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_KPIS = function (sessionId, catalogName, cubeName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_KPIS</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_LEVELS = function (sessionId, catalogName, cubeName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_LEVELS</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_PROPERTIES = function (sessionId, catalogName, cubeName) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <RequestType>MDSCHEMA_PROPERTIES</RequestType>\n                <Restrictions>\n                    <RestrictionList>\n                        <CATALOG_NAME>" + catalogName + "</CATALOG_NAME>\n                        <CUBE_NAME>" + cubeName + "</CUBE_NAME>\n                        <PROPERTY_NAME>MEMBER_VALUE</PROPERTY_NAME>\n                    </RestrictionList>\n                </Restrictions>\n                <Properties>\n                </Properties>\n            </Discover>\n        </Body>\n    </Envelope>"; };
        var _ENV_QUERY = function (sessionId, catalogName, query) { return "\n    <Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n        <Header>\n            <XA:Session soap:mustUnderstand=\"1\" SessionId=\"" + sessionId + "\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:XA=\"urn:schemas-microsoft-com:xml-analysis\" />\n        </Header>\n        <Body>\n            <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\">\n                <Command>\n                    <Statement>\n                        <![CDATA[\n                        " + query + "\n                        ]]>\n                    </Statement>\n                </Command>\n                <Properties>\n                    <PropertyList>\n                        <Catalog>" + catalogName + "</Catalog>\n                        <Content>Data</Content>\n                    </PropertyList>\n                </Properties>\n            </Execute>\n        </Body>\n    </Envelope>"; };
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a filter used to select values for a {@link PivotField}.
         *
         * There are two types of filter: by value and by condition.
         *
         * Value filters allow users to select specific values they want
         * to include in the analysis. This is done by checking specific
         * values from a list.
         *
         * Condition filters include two conditions specified by an operator
         * and a value (e.g. 'begins with' and 's'). The conditions may
         * be combined with an 'and' or an 'or' operator.
         *
         * When the {@link PivotEngine} is connected to server-based data
         * sources, only condition filters can be used (value filters are
         * automatically hidden).
         */
        var PivotFilter = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link PivotFilter} class.
             *
             * @param field {@link PivotField} that owns this filter.
             */
            function PivotFilter(field) {
                this._fld = field;
                // REVIEW
                // use the field as a 'pseudo-column' to build value and condition filters;
                // properties in common:
                //   binding, format, dataType, isContentHtml, collectionView
                var col = field;
                this._valueFilter = new wijmo.grid.filter.ValueFilter(col);
                this._valueFilter.exclusiveValueSearch = this._fld.engine.exclusiveValueSearch;
                this._conditionFilter = new wijmo.grid.filter.ConditionFilter(col);
            }
            Object.defineProperty(PivotFilter.prototype, "filterType", {
                // ** object model
                /**
                 * Gets or sets the types of filtering provided by this filter.
                 *
                 * Setting this property to null causes the filter to use the value
                 * defined by the owner filter's {@link FlexGridFilter.defaultFilterType}
                 * property.
                 */
                get: function () {
                    return this._filterType != null
                        ? this._filterType
                        : this._fld.engine.defaultFilterType;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, wijmo.grid.filter.FilterType, true);
                    if (value != this._filterType) {
                        this._filterType = value;
                        this.clear();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a value that indicates whether a value passes the filter.
             *
             * @param value The value to test.
             */
            PivotFilter.prototype.apply = function (value) {
                return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
            };
            Object.defineProperty(PivotFilter.prototype, "isActive", {
                /**
                 * Gets a value that indicates whether the filter is active.
                 */
                get: function () {
                    return this._conditionFilter.isActive || this._valueFilter.isActive;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Clears the filter.
             */
            PivotFilter.prototype.clear = function () {
                var changed = false;
                if (this._valueFilter.isActive) {
                    this._valueFilter.clear();
                    changed = true;
                }
                if (this._conditionFilter.isActive) {
                    this._valueFilter.clear();
                    changed = true;
                }
                if (changed) {
                    this._fld.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
                }
            };
            Object.defineProperty(PivotFilter.prototype, "valueFilter", {
                /**
                 * Gets the {@link ValueFilter} in this {@link PivotFilter}.
                 */
                get: function () {
                    return this._valueFilter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFilter.prototype, "conditionFilter", {
                /**
                 * Gets the {@link ConditionFilter} in this {@link PivotFilter}.
                 */
                get: function () {
                    return this._conditionFilter;
                },
                enumerable: true,
                configurable: true
            });
            return PivotFilter;
        }());
        olap.PivotFilter = PivotFilter;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Editor for {@link PivotFilter} objects.
         */
        var PivotFilterEditor = /** @class */ (function (_super) {
            __extends(PivotFilterEditor, _super);
            /**
             * Initializes a new instance of the {@link PivotFilterEditor} class.
             *
             * @param element The DOM element that hosts the control, or a selector
             * for the host element (e.g. '#theCtrl').
             * @param field The {@link PivotField} to edit.
             * @param options JavaScript object containing initialization data for the editor.
             */
            function PivotFilterEditor(element, field, options) {
                var _this = _super.call(this, element) || this;
                /**
                 * Occurs when the user finishes editing the filter.
                 */
                _this.finishEditing = new wijmo.Event();
                // check dependencies
                //  let depErr = 'Missing dependency: PivotFilterEditor requires ';
                //  assert(input != null, depErr + 'wijmo.input.');
                // no focus on the control host (TFS 208262)
                _this.hostElement.tabIndex = -1;
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-pivotfiltereditor', tpl, {
                    _divType: 'div-type',
                    _aVal: 'a-val',
                    _aCnd: 'a-cnd',
                    _divEdtVal: 'div-edt-val',
                    _divEdtCnd: 'div-edt-cnd',
                    _btnOk: 'btn-ok'
                });
                // localization
                wijmo.setText(_this._aVal, wijmo.culture.FlexGridFilter.values);
                wijmo.setText(_this._aCnd, wijmo.culture.FlexGridFilter.conditions);
                wijmo.setText(_this._btnOk, wijmo.culture.olap.PivotFieldEditor.ok);
                // handle button clicks
                var bnd = _this._btnClicked.bind(_this);
                _this.addEventListener(_this._btnOk, 'click', bnd);
                _this.addEventListener(_this._aVal, 'click', bnd);
                _this.addEventListener(_this._aCnd, 'click', bnd);
                // commit/dismiss on Enter/Esc, keep focus within control when tabbing
                _this.addEventListener(_this.hostElement, 'keydown', function (e) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            switch (e.target.tagName) {
                                case 'A':
                                case 'BUTTON':
                                    _this._btnClicked(e);
                                    break;
                                default:
                                    _this.onFinishEditing(new wijmo.CancelEventArgs());
                                    break;
                            }
                            e.preventDefault();
                            break;
                        case wijmo.Key.Escape:
                            _this.onFinishEditing(new wijmo.CancelEventArgs());
                            e.preventDefault();
                            break;
                        case wijmo.Key.Tab:
                            wijmo.moveFocus(_this.hostElement, e.shiftKey ? -1 : +1);
                            e.preventDefault();
                            break;
                    }
                });
                // field being edited
                _this._fld = field;
                _this._uniqueValues = field.filter.valueFilter.uniqueValues;
                // apply options
                _this.initialize(options);
                // initialize all values
                _this.updateEditor();
                return _this;
            }
            Object.defineProperty(PivotFilterEditor.prototype, "field", {
                // ** object model
                /**
                 * Gets a reference to the {@link PivotField} whose filter is being edited.
                 */
                get: function () {
                    return this._fld;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFilterEditor.prototype, "filter", {
                /**
                 * Gets a reference to the {@link PivotFilter} being edited.
                 */
                get: function () {
                    return this._fld ? this._fld.filter : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFilterEditor.prototype, "isEditorClear", {
                /**
                 * Gets a value that determines whether the editor has been cleared.
                 */
                get: function () {
                    switch (this._getFilterType()) {
                        case wijmo.grid.filter.FilterType.Value:
                            return !this._edtVal || this._edtVal.isEditorClear;
                        case wijmo.grid.filter.FilterType.Condition:
                            return !this._edtCnd || this._edtCnd.isEditorClear;
                    }
                    wijmo.assert(false, 'unknown filter type?');
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the editor with current filter settings.
             */
            PivotFilterEditor.prototype.updateEditor = function () {
                // show/hide filter editors
                var FT = wijmo.grid.filter.FilterType, ft = FT.None;
                if (this.filter) {
                    ft = (this.filter.conditionFilter.isActive || (this.filter.filterType & FT.Value) == 0)
                        ? FT.Condition
                        : FT.Value;
                    this._showFilter(ft);
                }
                // update filter editors
                if (this._edtVal) {
                    var fld = this._fld, ng = fld.engine;
                    if (ng.isServer && !this._uniqueValues) {
                        var arr = ng._getUniqueValues(fld);
                        fld.filter.valueFilter.uniqueValues = arr;
                    }
                    this._edtVal.updateEditor();
                }
                if (this._edtCnd) {
                    this._edtCnd.updateEditor();
                }
            };
            /**
             * Updates the filter to reflect the current editor values.
             */
            PivotFilterEditor.prototype.updateFilter = function () {
                // update the filter
                switch (this._getFilterType()) {
                    case wijmo.grid.filter.FilterType.Value:
                        this._edtVal.updateFilter();
                        this.filter.conditionFilter.clear();
                        break;
                    case wijmo.grid.filter.FilterType.Condition:
                        this._edtCnd.updateFilter();
                        this.filter.valueFilter.clear();
                        break;
                }
                // refresh the view
                this.field.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
            };
            /**
             * Clears the editor fields without applying changes to the filter.
             */
            PivotFilterEditor.prototype.clearEditor = function () {
                if (this._edtVal) {
                    this._edtVal.clearEditor();
                }
                if (this._edtCnd) {
                    this._edtCnd.clearEditor();
                }
            };
            /**
             * Raises the {@link finishEditing} event.
             */
            PivotFilterEditor.prototype.onFinishEditing = function (e) {
                this.finishEditing.raise(this, e);
                return !e.cancel;
            };
            // ** implementation
            // shows the value or filter editor
            PivotFilterEditor.prototype._showFilter = function (filterType) {
                // create editor if we have to
                if (filterType == wijmo.grid.filter.FilterType.Value && this._edtVal == null) {
                    this._edtVal = new wijmo.grid.filter.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
                }
                if (filterType == wijmo.grid.filter.FilterType.Condition && this._edtCnd == null) {
                    this._edtCnd = new wijmo.grid.filter.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
                }
                // show selected editor
                if ((filterType & this.filter.filterType) != 0) {
                    if (filterType == wijmo.grid.filter.FilterType.Value) {
                        this._divEdtVal.style.display = '';
                        this._divEdtCnd.style.display = 'none';
                        this._enableLink(this._aVal, false);
                        this._enableLink(this._aCnd, true);
                    }
                    else {
                        this._divEdtVal.style.display = 'none';
                        this._divEdtCnd.style.display = '';
                        this._enableLink(this._aVal, true);
                        this._enableLink(this._aCnd, false);
                    }
                }
                // hide switch button if only one filter type is supported
                switch (this.filter.filterType) {
                    case wijmo.grid.filter.FilterType.None:
                    case wijmo.grid.filter.FilterType.Condition:
                    case wijmo.grid.filter.FilterType.Value:
                        this._divType.style.display = 'none';
                        break;
                    default:
                        this._divType.style.display = '';
                        break;
                }
            };
            // enable/disable filter switch links
            PivotFilterEditor.prototype._enableLink = function (a, enable) {
                a.style.textDecoration = enable ? '' : 'none';
                a.style.fontWeight = enable ? '' : 'bold';
                wijmo.setAttribute(a, 'href', enable ? '' : null);
            };
            // gets the type of filter currently being edited
            PivotFilterEditor.prototype._getFilterType = function () {
                var ft = wijmo.grid.filter.FilterType;
                return this._divEdtVal.style.display != 'none' ? ft.Value : ft.Condition;
            };
            // handle buttons
            PivotFilterEditor.prototype._btnClicked = function (e) {
                e.preventDefault();
                e.stopPropagation();
                // ignore disabled elements
                if (wijmo.hasClass(e.target, 'wj-state-disabled')) {
                    return;
                }
                // switch filters
                if (e.target == this._aVal) {
                    this._showFilter(wijmo.grid.filter.FilterType.Value);
                    wijmo.moveFocus(this._edtVal.hostElement, 0);
                    return;
                }
                if (e.target == this._aCnd) {
                    this._showFilter(wijmo.grid.filter.FilterType.Condition);
                    wijmo.moveFocus(this._edtCnd.hostElement, 0);
                    return;
                }
                // finish editing
                this.onFinishEditing(new wijmo.CancelEventArgs());
            };
            /**
             * Gets or sets the template used to instantiate {@link PivotFilterEditor} controls.
             */
            PivotFilterEditor.controlTemplate = '<div>' +
                '<div wj-part="div-type" style="text-align:center;margin-bottom:12px;font-size:80%">' +
                '<a wj-part="a-cnd" href="" tabindex="-1" draggable="false"></a>' +
                '&nbsp;|&nbsp;' +
                '<a wj-part="a-val" href="" tabindex="-1" draggable="false"></a>' +
                '</div>' +
                '<div wj-part="div-edt-val" tabindex="-1"></div>' +
                '<div wj-part="div-edt-cnd" tabindex="-1"></div>' +
                '<div style="text-align:right;margin-top:10px">' +
                '<button wj-part="btn-ok" class="wj-btn"></button>' +
                '</div>' +
                '</div>';
            return PivotFilterEditor;
        }(wijmo.Control));
        olap.PivotFilterEditor = PivotFilterEditor;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Editor for {@link PivotField} objects.
         */
        var PivotFieldEditor = /** @class */ (function (_super) {
            __extends(PivotFieldEditor, _super);
            /**
             * Initializes a new instance of the {@link PivotFieldEditor} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function PivotFieldEditor(element, options) {
                var _this = _super.call(this, element, null, true) || this;
                // check dependencies
                // let depErr = 'Missing dependency: PivotFieldEditor requires ';
                // assert(input != null, depErr + 'wijmo.input.');
                // no focus on the control host (TFS 208262)
                _this.hostElement.tabIndex = -1;
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-pivotfieldeditor', tpl, {
                    _dBnd: 'sp-bnd',
                    _dHdr: 'div-hdr',
                    _dAgg: 'div-agg',
                    _dShw: 'div-shw',
                    _dWFl: 'div-wfl',
                    _dSrt: 'div-srt',
                    _btnFltEdt: 'btn-flt-edt',
                    _btnFltClr: 'btn-flt-clr',
                    _dFmt: 'div-fmt',
                    _dSmp: 'div-smp',
                    _btnApply: 'btn-apply',
                    _btnCancel: 'btn-cancel',
                    _gDlg: 'g-dlg',
                    _gHdr: 'g-hdr',
                    _gAgg: 'g-agg',
                    _gShw: 'g-shw',
                    _gWfl: 'g-wfl',
                    _gSrt: 'g-srt',
                    _gFlt: 'g-flt',
                    _gFmt: 'g-fmt',
                    _gSmp: 'g-smp'
                });
                // date to use for preview
                _this._pvDate = new Date();
                // globalization
                var ci = wijmo.culture.olap.PivotFieldEditor;
                wijmo.setText(_this._gDlg, ci.dialogHeader);
                wijmo.setText(_this._gHdr, ci.header);
                wijmo.setText(_this._gAgg, ci.summary);
                wijmo.setText(_this._gShw, ci.showAs);
                wijmo.setText(_this._gWfl, ci.weighBy);
                wijmo.setText(_this._gSrt, ci.sort);
                wijmo.setText(_this._gFlt, ci.filter);
                wijmo.setText(_this._gFmt, ci.format);
                wijmo.setText(_this._gSmp, ci.sample);
                wijmo.setText(_this._btnFltEdt, ci.edit);
                wijmo.setText(_this._btnFltClr, ci.clear);
                wijmo.setText(_this._btnApply, ci.ok);
                wijmo.setText(_this._btnCancel, ci.cancel);
                // create inner controls
                _this._cmbHdr = new wijmo.input.ComboBox(_this._dHdr);
                _this._cmbAgg = new wijmo.input.ComboBox(_this._dAgg);
                _this._cmbShw = new wijmo.input.ComboBox(_this._dShw);
                _this._cmbWFl = new wijmo.input.ComboBox(_this._dWFl);
                _this._cmbSrt = new wijmo.input.ComboBox(_this._dSrt);
                _this._cmbFmt = new wijmo.input.ComboBox(_this._dFmt);
                _this._cmbSmp = new wijmo.input.ComboBox(_this._dSmp);
                // initialize inner controls
                _this._initAggregateOptions();
                _this._initShowAsOptions();
                _this._initFormatOptions();
                _this._initSortOptions();
                _this._updatePreview();
                // handle events
                _this._cmbShw.textChanged.addHandler(_this._updateFormat, _this);
                _this._cmbFmt.textChanged.addHandler(_this._updatePreview, _this);
                _this.addEventListener(_this._btnFltEdt, 'click', function (e) {
                    _this._editFilter();
                    e.preventDefault();
                });
                _this.addEventListener(_this._btnFltClr, 'click', function (e) {
                    _this._createFilterEditor();
                    setTimeout(function () {
                        _this._eFlt.clearEditor();
                        _this._btnFltEdt.focus(); // clear button will lose focus when disabled (TFS 336876)
                        wijmo.enable(_this._btnFltClr, false);
                    });
                    e.preventDefault();
                });
                _this.addEventListener(_this._btnApply, 'click', function (e) {
                    _this.updateField();
                });
                // apply options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(PivotFieldEditor.prototype, "field", {
                // ** object model
                /**
                 * Gets or sets a reference to the {@link PivotField} being edited.
                 */
                get: function () {
                    return this._fld;
                },
                set: function (value) {
                    if (value != this._fld) {
                        this._fld = wijmo.asType(value, olap.PivotField);
                        this.updateEditor();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates editor to reflect the current field values.
             */
            PivotFieldEditor.prototype.updateEditor = function () {
                var fld = this._fld;
                if (fld && fld.engine) {
                    // binding, header
                    this._dBnd.textContent = fld.binding;
                    this._cmbHdr.text = fld.header;
                    // aggregate, weigh by, sort
                    this._cmbAgg.collectionView.refresh();
                    this._cmbAgg.selectedValue = fld.aggregate;
                    this._cmbSrt.selectedValue = fld.descending;
                    this._cmbShw.selectedValue = fld.showAs;
                    this._initWeighByOptions();
                    // filter
                    var canFilter = fld.engine.defaultFilterType != wijmo.grid.filter.FilterType.None;
                    wijmo.enable(this._btnFltEdt, canFilter); // WJM19599
                    wijmo.enable(this._btnFltClr, canFilter && fld.filter.isActive); // WJM19599
                    // format, sample
                    this._cmbFmt.collectionView.refresh();
                    this._cmbFmt.selectedValue = fld.format;
                    if (!this._cmbFmt.selectedValue) {
                        this._cmbFmt.text = fld.format;
                    }
                    // disable items not supported by cube fields
                    var isCube = fld instanceof olap.CubePivotField;
                    this._cmbAgg.isDisabled = isCube;
                    this._cmbWFl.isDisabled = isCube;
                }
            };
            /**
             * Updates field to reflect the current editor values.
             */
            PivotFieldEditor.prototype.updateField = function () {
                var fld = this._fld;
                if (fld) {
                    // save header
                    var hdr = this._cmbHdr.text.trim();
                    fld.header = hdr ? hdr : wijmo.toHeaderCase(fld.binding);
                    // save aggregate, weigh by, sort
                    fld.aggregate = this._cmbAgg.selectedValue;
                    fld.showAs = this._cmbShw.selectedValue;
                    fld.weightField = this._cmbWFl.selectedValue;
                    fld.descending = this._cmbSrt.selectedValue;
                    // save format
                    var oldFmt = fld.format;
                    fld.format = this._cmbFmt.selectedValue || this._cmbFmt.text;
                    // save filter
                    var eFlt = this._eFlt;
                    if (eFlt) {
                        // save the new filter
                        eFlt.updateFilter();
                        // update value filter to account for format changes (TFS 467450)
                        // apply only for number and date fields (WJM-19609)
                        var isNumberField = (fld.dataType == wijmo.DataType.Number);
                        var isDateField = (fld.dataType == wijmo.DataType.Date);
                        if (oldFmt != fld.format && (isNumberField || isDateField)) {
                            var vf = fld.filter.valueFilter;
                            if (vf && vf.isActive && !vf.dataMap) {
                                var svFmt = {};
                                if (isNumberField) {
                                    for (var k in vf.showValues) {
                                        var val = wijmo.Globalize.parseFloat(k);
                                        svFmt[wijmo.Globalize.format(val, fld.format)] = true;
                                    }
                                }
                                else if (isDateField) {
                                    for (var k in vf.showValues) {
                                        var val = wijmo.Globalize.parseDate(k, oldFmt);
                                        svFmt[wijmo.Globalize.format(val, fld.format)] = true;
                                    }
                                }
                                vf.showValues = svFmt;
                            }
                        }
                    }
                }
            };
            // ** implementation
            // initialize aggregate options
            PivotFieldEditor.prototype._initAggregateOptions = function () {
                var _this = this;
                var g = wijmo.culture.olap.PivotFieldEditor.aggs, agg = wijmo.Aggregate, list = [
                    { key: g.sum, val: agg.Sum, all: false },
                    { key: g.cnt, val: agg.Cnt, all: true },
                    { key: g.avg, val: agg.Avg, all: false },
                    { key: g.max, val: agg.Max, all: true },
                    { key: g.min, val: agg.Min, all: true },
                    { key: g.rng, val: agg.Rng, all: false },
                    { key: g.std, val: agg.Std, all: false },
                    { key: g.var, val: agg.Var, all: false },
                    { key: g.stdp, val: agg.StdPop, all: false },
                    { key: g.varp, val: agg.VarPop, all: false },
                    { key: g.first, val: agg.First, all: true },
                    { key: g.last, val: agg.Last, all: true },
                ];
                this._cmbAgg.itemsSource = list;
                this._cmbAgg.collectionView.filter = function (item) {
                    if (item && item.all) { // all data types
                        return true;
                    }
                    if (_this._fld) { // numbers and Booleans (avg, range, stdev, etc)
                        var dt = _this._fld.dataType;
                        return dt == wijmo.DataType.Number || dt == wijmo.DataType.Boolean;
                    }
                    return false; // strings, dates (count, min/max)
                };
                this._cmbAgg.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize showAs options
            PivotFieldEditor.prototype._initShowAsOptions = function () {
                var g = wijmo.culture.olap.PivotFieldEditor.calcs, list = [
                    { key: g.noCalc, val: olap.ShowAs.NoCalculation },
                    { key: g.dRow, val: olap.ShowAs.DiffRow },
                    { key: g.dRowPct, val: olap.ShowAs.DiffRowPct },
                    { key: g.dCol, val: olap.ShowAs.DiffCol },
                    { key: g.dColPct, val: olap.ShowAs.DiffColPct },
                    { key: g.dPctGrand, val: olap.ShowAs.PctGrand },
                    { key: g.dPctRow, val: olap.ShowAs.PctRow },
                    { key: g.dPrevRow, val: olap.ShowAs.PctPrevRow },
                    { key: g.dPctCol, val: olap.ShowAs.PctCol },
                    { key: g.dPrevCol, val: olap.ShowAs.PctPrevCol },
                    { key: g.dRunTot, val: olap.ShowAs.RunTot },
                    { key: g.dRunTotPct, val: olap.ShowAs.RunTotPct }
                ];
                this._cmbShw.itemsSource = list;
                this._cmbShw.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize format options
            PivotFieldEditor.prototype._initFormatOptions = function () {
                var _this = this;
                var ci = wijmo.culture.olap.PivotFieldEditor.formats, list = [
                    // numbers (numeric dimensions and measures/aggregates)
                    { key: ci.n0, val: 'n0', all: true },
                    { key: ci.n2, val: 'n2', all: true },
                    { key: ci.c, val: 'c', all: true },
                    { key: ci.p0, val: 'p0', all: true },
                    { key: ci.p2, val: 'p2', all: true },
                    { key: ci.n2c, val: 'n2,', all: true },
                    { key: ci.n2cc, val: 'n2,,', all: true },
                    { key: ci.n2ccc, val: 'n2,,,', all: true },
                    // dates (date dimensions)
                    { key: ci.d, val: 'd', all: false },
                    { key: ci.MMMMddyyyy, val: 'MMMM dd, yyyy', all: false },
                    { key: ci.dMyy, val: 'd/M/yy', all: false },
                    { key: ci.ddMyy, val: 'dd/M/yy', all: false },
                    { key: ci.dMyyyy, val: 'dd/M/yyyy', all: false },
                    { key: ci.MMMyyyy, val: 'MMM yyyy', all: false },
                    { key: ci.MMMMyyyy, val: 'MMMM yyyy', all: false },
                    { key: ci.yyyy, val: 'yyyy', all: false },
                    { key: ci.yyyyQq, val: 'yyyy "Q"q', all: false },
                    { key: ci.FYEEEEQU, val: '"FY"EEEE "Q"U', all: false }
                ];
                this._cmbFmt.itemsSource = list;
                this._cmbFmt.isEditable = true;
                this._cmbFmt.isRequired = false;
                this._cmbFmt.collectionView.filter = function (item) {
                    if (item && item.all) {
                        return true;
                    }
                    if (_this._fld) {
                        return _this._fld.dataType == wijmo.DataType.Date;
                    }
                    return false;
                };
                this._cmbFmt.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize weight by options/value
            PivotFieldEditor.prototype._initWeighByOptions = function () {
                var fld = this._fld;
                if (fld) {
                    var list_2 = [
                        { key: wijmo.culture.olap.PivotFieldEditor.none, val: null }
                    ];
                    var ng = fld.engine;
                    ng.fields.forEach(function (wbf) {
                        if (wbf != fld && wbf.dataType == wijmo.DataType.Number) {
                            list_2.push({ key: wbf.header, val: wbf });
                        }
                    });
                    this._cmbWFl.initialize({
                        displayMemberPath: 'key',
                        selectedValuePath: 'val',
                        itemsSource: list_2,
                        selectedValue: fld.weightField
                    });
                }
            };
            // initialize sort options
            PivotFieldEditor.prototype._initSortOptions = function () {
                var g = wijmo.culture.olap.PivotFieldEditor.sorts, list = [
                    { key: g.asc, val: false },
                    { key: g.desc, val: true }
                ];
                this._cmbSrt.itemsSource = list;
                this._cmbSrt.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // update the format to match the 'showAs' setting
            PivotFieldEditor.prototype._updateFormat = function () {
                var showAsName = olap.ShowAs[this._cmbShw.selectedValue];
                this._cmbFmt.selectedValue = showAsName.indexOf('Pct') > -1 // percentage (TFS 431804)
                    ? 'p0'
                    : 'n0';
            };
            // update the preview field to show the effect of the current settings
            PivotFieldEditor.prototype._updatePreview = function () {
                var fmt = this._cmbFmt.selectedValue || this._cmbFmt.text, fmtFn = wijmo.Globalize.format, sample = '';
                if (fmt) {
                    var ft = fmt[0].toLowerCase(), nf = 'nfgxc';
                    if (nf.indexOf(ft) > -1) { // number
                        sample = fmtFn(1234.5678, fmt);
                    }
                    else if (ft == 'p') { // percentage
                        sample = fmtFn(0.12345678, fmt);
                    }
                    else { // date
                        sample = fmtFn(this._pvDate, fmt);
                    }
                }
                this._cmbSmp.text = sample;
            };
            // show the filter editor for this field
            PivotFieldEditor.prototype._editFilter = function () {
                this._createFilterEditor();
                wijmo.showPopup(this._dFlt, this._btnFltEdt, false, false, false);
                wijmo.moveFocus(this._dFlt, 0);
            };
            // create filter editor
            PivotFieldEditor.prototype._createFilterEditor = function () {
                var _this = this;
                if (!this._dFlt) {
                    // create filter
                    this._dFlt = document.createElement('div');
                    this._eFlt = new olap.PivotFilterEditor(this._dFlt, this._fld);
                    wijmo.addClass(this._dFlt, 'wj-dropdown-panel');
                    // close filter editor when it loses focus (changes are not applied)
                    this._eFlt.lostFocus.addHandler(function () {
                        setTimeout(function () {
                            var ctl = wijmo.Control.getControl(_this._dFlt);
                            if (ctl && !ctl.containsFocus()) {
                                _this._closeFilter();
                            }
                        }, 10);
                    });
                    // close the filter when the user finishes editing
                    this._eFlt.finishEditing.addHandler(function () {
                        _this._closeFilter();
                        wijmo.enable(_this._btnFltClr, !_this._eFlt.isEditorClear); // TFS 213762
                    });
                }
            };
            // close filter editor
            PivotFieldEditor.prototype._closeFilter = function () {
                if (this._dFlt) {
                    wijmo.hidePopup(this._dFlt, true);
                    this.focus();
                }
            };
            /**
             * Gets or sets the template used to instantiate {@link PivotFieldEditor} controls.
             */
            PivotFieldEditor.controlTemplate = '<div>' +
                // header
                '<div class="wj-dialog-header" tabindex="-1">' +
                '<span wj-part="g-dlg"></span> <span wj-part="sp-bnd"></span>' +
                '</div>' +
                // body
                '<div class="wj-dialog-body">' +
                // content
                '<table style="table-layout:fixed">' +
                '<tr>' +
                '<td wj-part="g-hdr"></td>' +
                '<td><div wj-part="div-hdr"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                '<td wj-part="g-agg"></td>' +
                '<td><div wj-part="div-agg"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                '<td wj-part="g-shw"></td>' +
                '<td><div wj-part="div-shw"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-wfl"></td>' +
                '<td><div wj-part="div-wfl"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-srt"></td>' +
                '<td><div wj-part="div-srt"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                '<td wj-part="g-flt"></td>' +
                '<td>' +
                '<div>' + // TFS 318475
                '<button wj-part="btn-flt-edt" class="wj-btn"></button>&nbsp;&nbsp;' +
                '<button wj-part="btn-flt-clr" class="wj-btn"></button>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                '<td wj-part="g-fmt"></td>' +
                '<td><div wj-part="div-fmt"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-smp"></td>' +
                '<td><div wj-part="div-smp" readonly tabindex="-1"></div></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                // footer
                '<div class="wj-dialog-footer">' +
                '<button wj-part="btn-apply" class="wj-btn wj-hide"></button>&nbsp;&nbsp;' +
                '<button wj-part="btn-cancel" class="wj-btn wj-hide"></button>' +
                '</div>' +
                '</div>';
            return PivotFieldEditor;
        }(wijmo.Control));
        olap.PivotFieldEditor = PivotFieldEditor;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var olap;
    (function (olap) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.olap', wijmo.olap);
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.olap.js.map