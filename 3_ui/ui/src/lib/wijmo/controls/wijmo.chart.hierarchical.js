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
    var chart;
    (function (chart) {
        var hierarchical;
        (function (hierarchical) {
            //
            // Contains utilities used by hierarchical chart.
            //
            'use strict';
            var HierarchicalUtil = /** @class */ (function () {
                function HierarchicalUtil() {
                }
                HierarchicalUtil.parseDataToHierarchical = function (data, binding, bindingName, childItemsPath) {
                    var arr = [], items;
                    if (data instanceof wijmo.collections.CollectionView && data.groups.length > 0) {
                        //support grouped collection view.
                        arr = HierarchicalUtil.parseGroupCV(data, binding);
                    }
                    else if (data.length > 0) {
                        if (wijmo.isString(bindingName) && bindingName.indexOf(',') > -1) {
                            bindingName = bindingName.split(',');
                        }
                        if (childItemsPath) {
                            arr = HierarchicalUtil.parseItems(data, binding, bindingName, childItemsPath);
                        }
                        else {
                            //flat data
                            items = HierarchicalUtil.convertFlatData(data, binding, bindingName);
                            arr = HierarchicalUtil.parseItems(items, 'value', bindingName, 'items');
                        }
                    }
                    return arr;
                };
                HierarchicalUtil.parseGroupCV = function (cv, binding) {
                    var arr = [];
                    for (var i = 0, len = cv.groups.length; i < len; i++) {
                        var item = this.parseGroups(cv.groups[i], binding);
                        arr.push(item);
                    }
                    return arr;
                };
                HierarchicalUtil.parseGroups = function (group, binding) {
                    var val = {};
                    val.name = group.name;
                    val.nameField = group.groupDescription.propertyName;
                    val.item = group.items;
                    if (group.groups && group.groups.length) {
                        val.items = [];
                        for (var i = 0, len = group.groups.length; i < len; i++) {
                            var item = this.parseGroups(group.groups[i], binding);
                            val.items.push(item);
                        }
                    }
                    else {
                        if (group.isBottomLevel) {
                            val.value = group.getAggregate(wijmo.Aggregate.Sum, binding);
                        }
                    }
                    return val;
                };
                HierarchicalUtil.parseItems = function (items, binding, bindingName, childItemsPath) {
                    var arr = [], i, len = items.length;
                    for (i = 0; i < len; i++) {
                        arr.push(HierarchicalUtil.parseItem(items[i], binding, bindingName, childItemsPath));
                    }
                    return arr;
                };
                HierarchicalUtil.isFlatItem = function (item, binding) {
                    if (wijmo.isArray(item[binding])) {
                        return false;
                    }
                    return true;
                };
                HierarchicalUtil.convertFlatData = function (items, binding, bindingName) {
                    var arr = [], data = {}, i, item, len = items.length;
                    for (i = 0; i < len; i++) {
                        item = items[i];
                        HierarchicalUtil.convertFlatItem(data, item, binding, wijmo.isArray(bindingName) ? bindingName : [bindingName]);
                    }
                    HierarchicalUtil.convertFlatToHierarchical(arr, data);
                    return arr;
                };
                HierarchicalUtil.convertFlatToHierarchical = function (arr, data) {
                    var order = data['flatDataOrder'];
                    if (order) {
                        order.forEach(function (v) {
                            var d = {}, val = data[v], items;
                            d[data['field']] = v;
                            if (val['flatDataOrder']) {
                                items = [];
                                HierarchicalUtil.convertFlatToHierarchical(items, val);
                                d.items = items;
                            }
                            else {
                                d.value = val;
                            }
                            arr.push(d);
                        });
                    }
                };
                HierarchicalUtil.convertFlatItem = function (data, item, binding, bindingName) {
                    var newBindingName, name, len, itemName, newData, converted;
                    newBindingName = bindingName.slice();
                    name = newBindingName.shift();
                    name = wijmo.isString(name) ? name.trim() : name;
                    itemName = name == null ? binding : item[name];
                    if (itemName == null) {
                        return false;
                    }
                    if (newBindingName.length === 0) {
                        data[itemName] = item[binding] || 0;
                        if (data['flatDataOrder']) {
                            data['flatDataOrder'].push(itemName);
                        }
                        else {
                            data['flatDataOrder'] = [itemName];
                        }
                        data['field'] = name;
                    }
                    else {
                        if (data[itemName] == null) {
                            data[itemName] = {};
                            if (data['flatDataOrder']) {
                                data['flatDataOrder'].push(itemName);
                            }
                            else {
                                data['flatDataOrder'] = [itemName];
                            }
                            data['field'] = name;
                        }
                        newData = data[itemName];
                        converted = HierarchicalUtil.convertFlatItem(newData, item, binding, newBindingName);
                        if (!converted) {
                            data[itemName] = item[binding];
                        }
                    }
                    return true;
                };
                HierarchicalUtil.parseItem = function (item, binding, bindingName, childItemsPath) {
                    var data = {}, newBindingName, name, value, len, childItem, newChildItemsPath;
                    if (wijmo.isArray(childItemsPath)) {
                        newChildItemsPath = childItemsPath.slice();
                        childItem = newChildItemsPath.length ? newChildItemsPath.shift().trim() : '';
                    }
                    else {
                        newChildItemsPath = childItemsPath;
                        childItem = childItemsPath;
                    }
                    if (wijmo.isArray(bindingName)) {
                        newBindingName = bindingName.slice();
                        name = newBindingName.shift();
                        name = name == null ? name : name.trim();
                        data.nameField = name == null ? binding : name;
                        data.name = name == null ? item[binding] : item[name];
                        value = item[childItem];
                        if (newBindingName.length === 0) {
                            data.value = item[binding];
                        }
                        else {
                            if (value && wijmo.isArray(value) && value.length > 0) {
                                data.items = HierarchicalUtil.parseItems(value, binding, newBindingName, newChildItemsPath);
                            }
                            else {
                                data.value = item[binding] || 0;
                            }
                        }
                    }
                    else {
                        data.nameField = bindingName == null ? binding : bindingName;
                        data.name = bindingName == null ? item[binding] : item[bindingName];
                        value = item[childItem];
                        if (value != null && wijmo.isArray(value) && value.length > 0) {
                            data.items = HierarchicalUtil.parseItems(value, binding, bindingName, newChildItemsPath);
                        }
                        else {
                            data.value = item[binding];
                        }
                    }
                    data.item = item;
                    return data;
                };
                HierarchicalUtil.parseFlatItem = function (data, item, binding, bindingName) {
                    if (!data.items) {
                        data.items = [];
                    }
                };
                return HierarchicalUtil;
            }());
            hierarchical.HierarchicalUtil = HierarchicalUtil;
        })(hierarchical = chart.hierarchical || (chart.hierarchical = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var hierarchical;
        (function (hierarchical) {
            'use strict';
            /**
             * Specifies the treemap type.
             */
            var TreeMapType;
            (function (TreeMapType) {
                /** Shows squarified treemap. */
                TreeMapType[TreeMapType["Squarified"] = 0] = "Squarified";
                /** Shows horizontal squarified treemap. */
                TreeMapType[TreeMapType["Horizontal"] = 1] = "Horizontal";
                /** Shows vertical squarified treemap. */
                TreeMapType[TreeMapType["Vertical"] = 2] = "Vertical";
            })(TreeMapType = hierarchical.TreeMapType || (hierarchical.TreeMapType = {}));
            /**
             * The {@link TreeMap} control displays hierarchical (tree-structured) data as a set
             * of nested rectangles. Each branch of the tree is given a rectangle, which is then
             * tiled with smaller rectangles representing sub-branches.
             * A leaf node's rectangle has an area proportional to a specified dimension of the data.
             * Often the leaf nodes are colored to show a separate dimension of the data.
             *
             * To use the {@link TreeMap} control, set the {@link TreeMap.itemsSource} property
             * to an array containing the data and use the {@link TreeMap.binding} and
             * {@link TreeMap.bindingName} properties to set the properties that contain
             * the item values and names.
             */
            var TreeMap = /** @class */ (function (_super) {
                __extends(TreeMap, _super);
                /**
                 * Initializes a new instance of the {@link TreeMap} class.
                 *
                 * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
                 * @param options A Javascript object containing initialization data for the control.
                 */
                function TreeMap(element, options) {
                    var _this = _super.call(this, element, null, true) || this;
                    _this._values = [];
                    _this._labels = [];
                    _this._areas = [];
                    _this._sum = 0;
                    _this._keywords = new wijmo.chart._KeyWords();
                    _this._processedData = [];
                    _this._depth = 1;
                    _this._itemIndex = 0;
                    _this._processedItem = [];
                    _this._maxDepth = -1;
                    _this._tmItems = [];
                    _this._colRowLens = [];
                    _this._defPalette = [{
                            titleColor: '#033884',
                            maxColor: '#1450a7',
                            minColor: '#83b3f9'
                        }, {
                            titleColor: '#a83100',
                            maxColor: '#dc4a0d',
                            minColor: '#ffb190'
                        }, {
                            titleColor: '#006658',
                            maxColor: '#008d7a',
                            minColor: '#7deddf'
                        }, {
                            titleColor: '#a10046',
                            maxColor: '#df0061',
                            minColor: '#ff8cbe'
                        }, {
                            titleColor: '#784d08',
                            maxColor: '#99681a',
                            minColor: '#efc989'
                        }, {
                            titleColor: '#54156f',
                            maxColor: '#722a90',
                            minColor: '#cf95e7'
                        }, {
                            titleColor: '#998605',
                            maxColor: '#c2ac19',
                            minColor: '#ffef8b'
                        }, {
                            titleColor: '#9a0005',
                            maxColor: '#c80c14',
                            minColor: '#ff888d'
                        }];
                    // add classes to host element
                    _this.applyTemplate('wj-control wj-flexchart wj-treemap', null, null);
                    _this._currentRenderEngine = new wijmo.chart._SvgRenderEngine(_this.hostElement);
                    _this._legend = new wijmo.chart.Legend(_this);
                    _this._legend.position = wijmo.chart.Position.None;
                    _this._tooltip = new wijmo.chart.ChartTooltip();
                    _this._tooltip.content = '<b>{name}</b><br/>{value}';
                    _this._tooltip.showDelay = 0;
                    _this._lbl = new wijmo.chart.DataLabel();
                    _this._lbl.position = wijmo.chart.LabelPosition.Center;
                    _this._lbl._chart = _this;
                    // tooltips
                    _this.hostElement.addEventListener('mousemove', function (evt) {
                        if (!_this.isTouching) {
                            _this._toogleTooltip(evt);
                        }
                    });
                    // selection
                    _this.hostElement.addEventListener('click', function (evt) {
                        var showToolTip = true;
                        if (_this.maxDepth > 0) {
                            var ht = _this.hitTest(evt);
                            var thershold = wijmo.chart.FlexChart._SELECTION_THRESHOLD;
                            if (_this.tooltip && _this.tooltip.threshold)
                                thershold = _this.tooltip.threshold;
                            if (ht.distance <= thershold) {
                                if (ht.pointIndex >= -1 && ht.pointIndex < _this._areas.length) {
                                    var area = _this._areas[ht.pointIndex];
                                    if (_this._currentItem != area.item) {
                                        _this._currentItem = area.item;
                                        _this._refreshChart();
                                        showToolTip = false;
                                    }
                                }
                            }
                        }
                        if (showToolTip && _this.isTouching) {
                            _this._toogleTooltip(evt);
                        }
                    });
                    _this.hostElement.addEventListener('contextmenu', function (evt) {
                        if (_this.maxDepth > 0) {
                            var ht = _this.hitTest(evt);
                            var threshold = wijmo.chart.FlexChart._SELECTION_THRESHOLD;
                            if (_this.tooltip && _this.tooltip.threshold)
                                threshold = _this.tooltip.threshold;
                            if (ht.distance <= threshold) {
                                _this._rollUp();
                            }
                        }
                        evt.preventDefault();
                        return false;
                    });
                    _this.hostElement.addEventListener('mouseleave', function () {
                        _this._hideToolTip();
                    });
                    // apply options only after chart is fully initialized
                    //this.initialize(options);
                    // refresh control to show current state
                    //this.refresh();
                    _this.deferUpdate(function () { return _this.initialize(options); });
                    return _this;
                }
                TreeMap.prototype._rollUp = function () {
                    this._currentItem = (this._currentItem && this._currentItem.parent) ? this._currentItem.parent : null;
                    this._refreshChart();
                };
                TreeMap.prototype._toogleTooltip = function (evt) {
                    var tip = this._tooltip;
                    var tc = tip.content;
                    if (tc) {
                        var ht = this.hitTest(evt);
                        if (ht.distance <= tip.threshold) {
                            var content = this._getLabelContent(ht, this.tooltip.content);
                            this._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                        }
                        else {
                            this._hideToolTip();
                        }
                    }
                };
                Object.defineProperty(TreeMap.prototype, "selectionMode", {
                    /**
                     * The selectionMode doesn't work in TreeMap control.
                     */
                    get: function () {
                        return wijmo.chart.SelectionMode.None;
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "_treeMapItems", {
                    get: function () {
                        return this._tmItems;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "tooltip", {
                    /**
                     * Gets the chart's {@link Tooltip}.
                     */
                    get: function () {
                        return this._tooltip;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "binding", {
                    /**
                    * Gets or sets the name of the property of the data item that contains the chart value.
                    *
                    * The binding property is used to calculate the size of the node as compared to other node values.
                    * The property should contain numeric data.
                    */
                    get: function () {
                        return this._binding;
                    },
                    set: function (value) {
                        if (value != this._binding) {
                            this._binding = wijmo.asString(value, true);
                            this._bindChart();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "type", {
                    /**
                     * Gets or sets the {@link TreeMapType} of the treemap.
                     */
                    get: function () {
                        return this._type == null ? TreeMapType.Squarified : this._type;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, TreeMapType);
                        if (value != this._type) {
                            this._type = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "bindingName", {
                    /**
                     * Gets or sets the name of the property containing name of the data item.
                     * The bindingName property is used to show name of the node. It should be an array or a string.
                     */
                    get: function () {
                        return this._bindingName;
                    },
                    set: function (value) {
                        if (value != this._bindingName) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'bindingName should be an array or a string.');
                            this._bindingName = value;
                            this._bindChart();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "dataLabel", {
                    /**
                     * Gets or sets the {@link DataLabel} of the treemap.
                     */
                    get: function () {
                        return this._lbl;
                    },
                    set: function (value) {
                        if (value != this._lbl) {
                            this._lbl = value;
                            if (this._lbl) {
                                this._lbl._chart = this;
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "childItemsPath", {
                    /**
                     * Gets or sets the name of the property (or properties) used to generate
                     * child items in hierarchical data.
                     *
                     * Set this property to a string to specify the name of the property that
                     * contains an item's child items (e.g. <code>'items'</code>).
                     *
                     * Set this property to an array containing the names of the properties
                     * that contain child items at each level, when the items are child items
                     * at different levels with different names
                     * (e.g. <code>[ 'accounts', 'checks', 'earnings' ]</code>).
                     */
                    get: function () {
                        return this._childItemsPath;
                    },
                    set: function (value) {
                        if (value != this._childItemsPath) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'childItemsPath should be an array or a string.');
                            this._childItemsPath = value;
                            this._bindChart();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "maxDepth", {
                    /**
                     * Gets or sets the maximum number of node levels to show in the current view.
                     * These levels are flattened into the current plane.
                     * If a treemap has more levels than this value, user has to move up and down.
                     */
                    get: function () {
                        return this._maxDepth;
                    },
                    set: function (value) {
                        if (value != this._maxDepth) {
                            this._maxDepth = wijmo.asNumber(value, true);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TreeMap.prototype, "palette", {
                    /**
                     * Gets or sets an array of default colors to be used in a treemap.
                     *
                     * The array contains strings that represent CSS colors. For example:
                     * <pre>
                     * // use colors specified by name
                     * chart.palette = ['red', 'green', 'blue'];
                     * // or use colors specified as rgba-values
                     * chart.palette = [
                     *   'rgba(255,0,0,1)',
                     *   'rgba(255,0,0,0.8)',
                     *   'rgba(255,0,0,0.6)',
                     *   'rgba(255,0,0,0.4)'];
                     * </pre>
                     *
                     * Or contains titleColor, maxColor, minColor separately. For example:
                     * <pre>
                     * chart.palette = [{
                     *      titleColor: '#00277d',
                     *      maxColor: 'rgba(0,39,125,0.7)',
                     *      minColor: 'rgba(168,187,230,0.7)'
                     *  }, {
                     *      titleColor: '#7d1f00',
                     *      maxColor: 'rgba(125,21,0,0.7)',
                     *      minColor: 'rgba(230,183,168,0.7)'
                     *  }, {
                     *      titleColor: '#007d27',
                     *      maxColor: 'rgba(0,125,39,0.7)',
                     *      minColor: 'rgba(168,230,188,0.7)'
                     *  }];
                     * </pre>
                     */
                    get: function () {
                        return this._palette;
                    },
                    set: function (value) {
                        if (value != this._palette) {
                            this._palette = wijmo.asArray(value);
                            if (this._tmItems && this._tmItems.length > 0) {
                                this._calculateColorForItems(this._tmItems);
                            }
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                TreeMap.prototype._initData = function () {
                    this._sum = 0;
                    this._tmItems = [];
                    this._currentItem = null;
                    this._values = [];
                    this._labels = [];
                    this._processedData = [];
                    this._depth = 1;
                    this._processedItem = [];
                };
                TreeMap.prototype._performBind = function () {
                    var items, processedData;
                    this._initData();
                    if (this._cv) {
                        items = this._cv.items;
                        if (this._cv.groups && this._cv.groups.length) {
                            this._processedData = hierarchical.HierarchicalUtil.parseDataToHierarchical(this._cv, this.binding, this.bindingName, this.childItemsPath);
                        }
                        else if (items) {
                            this._processedData = hierarchical.HierarchicalUtil.parseDataToHierarchical(items, this.binding, this.bindingName, this.childItemsPath);
                        }
                        if (this._processedData && this._processedData.length) {
                            this._sum = this._calculateValueAndDepth(this._processedData, 1);
                            this._sortData(this._processedData);
                            this._values = [];
                            this._getTMItemsAndLabelsAndValues(this._processedData, this._tmItems, 1, null);
                            this._calculateColorForItems(this._tmItems);
                        }
                    }
                };
                TreeMap.prototype._sortData = function (data) {
                    var _this = this;
                    data.forEach(function (d) {
                        if (d.items) {
                            _this._sortData(d.items);
                        }
                    });
                    data.sort(function (a, b) { return b.value - a.value; });
                };
                TreeMap.prototype._getTMItemsAndLabelsAndValues = function (data, treemapItems, depth, parentItem, color) {
                    var _this = this;
                    if (data && data.length > 0) {
                        data.forEach(function (d, i) {
                            var tmItem = new _TreeMapItem(), label;
                            tmItem.items = [];
                            tmItem.parent = parentItem;
                            tmItem.depth = depth;
                            if (d.items) {
                                _this._getTMItemsAndLabelsAndValues(d.items, tmItem.items, depth + 1, tmItem);
                            }
                            if (d.name) {
                                label = d.name;
                            }
                            else {
                                label = d.value.toString();
                            }
                            tmItem.label = label;
                            tmItem.value = d.value;
                            if (parentItem != null) {
                                if (d.value > parentItem.maxValue) {
                                    parentItem.maxValue = d.value;
                                }
                                if (d.value < parentItem.minValue) {
                                    parentItem.minValue = d.value;
                                }
                            }
                            treemapItems.push(tmItem);
                            _this._labels.push(label);
                            _this._values.push(d.value);
                        });
                    }
                };
                TreeMap.prototype._calculateColorForItems = function (items, color, colorConverter) {
                    var _this = this;
                    var converter = colorConverter;
                    items.forEach(function (item, i) {
                        var c = color;
                        if (item.depth === 1) {
                            c = _this._getColor(i);
                        }
                        item.palette = c;
                        var palette = item.palette;
                        if (wijmo.isString(palette)) {
                            var s = palette;
                            var f = _this._getLightColor(s);
                            item.titleFill = s;
                            item.titleStroke = s;
                            item.fill = f;
                            item.stroke = s;
                        }
                        else if (palette.maxColor && palette.minColor && palette.titleColor) {
                            item.titleFill = palette.titleColor;
                            item.titleStroke = palette.titleColor;
                            if (item.parent == null) {
                                item.fill = palette.maxColor;
                                item.stroke = palette.maxColor;
                            }
                            else {
                                if (converter == null) {
                                    converter = new _ColorConverter(palette.minColor, item.minValue, palette.maxColor, item.maxValue);
                                }
                                var Caledcolor = converter._calculateColorByVal(item.value, true).toString();
                                item.fill = Caledcolor;
                                item.stroke = Caledcolor;
                            }
                        }
                        if (item.items && item.items.length > 0) {
                            var newConverter = new _ColorConverter(palette.minColor, item.minValue, palette.maxColor, item.maxValue);
                            _this._calculateColorForItems(item.items, c, newConverter);
                        }
                    });
                };
                TreeMap.prototype._getBindData = function (item, values, binding) {
                    var v, val = 0;
                    if (binding) {
                        v = item[binding];
                    }
                    var val = 0;
                    if (wijmo.isNumber(v)) {
                        val = wijmo.asNumber(v);
                    }
                    else {
                        if (v) {
                            val = parseFloat(v.toString());
                        }
                    }
                    if (!isNaN(val) && isFinite(val)) {
                        values.push(val);
                    }
                    else {
                        val = 0;
                        values.push(val);
                    }
                    return val;
                };
                TreeMap.prototype._calculateValueAndDepth = function (arr, depth) {
                    var _this = this;
                    var sum = 0, values = this._values;
                    if (this._depth < depth) {
                        this._depth = depth;
                    }
                    arr.forEach(function (v) {
                        var val;
                        if (v.items) {
                            val = _this._calculateValueAndDepth(v.items, depth + 1);
                            v.value = val;
                            values.push(val);
                        }
                        else {
                            val = _this._getBindData(v, values, 'value');
                            v.value = val;
                        }
                        sum += val;
                    });
                    return sum;
                };
                TreeMap.prototype._prepareRender = function () {
                    this._areas = [];
                };
                TreeMap.prototype._renderChart = function (engine, rect, applyElement) {
                    var items, maxDepth, sum;
                    var r = this._rectChart.clone();
                    var hostSz = new wijmo.Size(r.width, r.height);
                    this.onRendering(new wijmo.chart.RenderEventArgs(engine));
                    var w = rect.width;
                    var h = rect.height;
                    this._tmGroup = engine.startGroup(null, null, true);
                    var margins = this._parseMargin(this.plotMargin), lbl = this.dataLabel;
                    if (isNaN(margins.left)) {
                        margins.left = TreeMap._MARGIN;
                    }
                    if (isNaN(margins.right)) {
                        margins.right = TreeMap._MARGIN;
                    }
                    if (isNaN(margins.top)) {
                        margins.top = TreeMap._MARGIN;
                    }
                    if (isNaN(margins.bottom)) {
                        margins.bottom = TreeMap._MARGIN;
                    }
                    rect.top += margins.top;
                    var h = rect.height - (margins.top + margins.bottom);
                    rect.height = h > 0 ? h : 24;
                    rect.left += margins.left;
                    var w = rect.width - (margins.left + margins.right);
                    rect.width = w > 0 ? w : 24;
                    this._plotRect = rect;
                    items = this._currentItem ? [this._currentItem] : this._tmItems;
                    if (this._currentItem == null || this.maxDepth < 1) {
                        maxDepth = this.maxDepth;
                    }
                    else if (this._currentItem && this._currentItem.items && this._currentItem.items.length && this.maxDepth > 1) {
                        maxDepth = this.maxDepth;
                    }
                    else {
                        maxDepth = this.maxDepth + 1;
                    }
                    sum = this._currentItem ? this._currentItem.value : this._sum;
                    this._renderTreeMap(engine, rect, this._tmGroup, items, sum, maxDepth);
                    engine.endGroup();
                    if (this.dataLabel.content && this.dataLabel.position != wijmo.chart.LabelPosition.None) {
                        this._renderLabels(engine);
                    }
                    this.onRendered(new wijmo.chart.RenderEventArgs(engine));
                };
                TreeMap.prototype._renderTreeMap = function (engine, rect, container, items, sum, maxDepth) {
                    if (sum > 0) {
                        this._itemIndex = 0;
                        this._resetItemRects(this._tmItems);
                        this._calculateItemRects(rect, items, sum, 1, maxDepth);
                        this._renderHierarchicalTreeMapItems(engine, container, rect, this._tmItems, sum, 1, maxDepth);
                    }
                };
                TreeMap.prototype._resetItemRects = function (items) {
                    var _this = this;
                    items.forEach(function (item) {
                        item.rect = new wijmo.Rect(0, 0, 0, 0);
                        item.isTitle = false;
                        item.type = _this.type;
                        if (item.items && item.items.length) {
                            _this._resetItemRects(item.items);
                        }
                    });
                };
                TreeMap.prototype._calculateItemRects = function (rect, items, sum, depth, maxDepth) {
                    var _this = this;
                    var tmType = this.type;
                    switch (tmType) {
                        case TreeMapType.Horizontal:
                            _TreeMapUtils.horizontal(items, rect, sum);
                            break;
                        case TreeMapType.Vertical:
                            _TreeMapUtils.vertical(items, rect, sum);
                            break;
                        case TreeMapType.Squarified:
                            _TreeMapUtils.squarified(items, rect, sum);
                            break;
                    }
                    items.forEach(function (item, i) {
                        var r = item.rect.clone();
                        if (item.items && item.items.length) {
                            //add title temporarily.
                            if (depth === maxDepth) {
                                //don't adjust items' rect.
                            }
                            else if (depth > maxDepth && maxDepth >= 1) {
                                //don't adjust items' rect.
                            }
                            else {
                                item.isTitle = true;
                                _this._calculateItemRects(item.itemsRect, item.items, item.value, depth + 1, maxDepth);
                            }
                        }
                    });
                };
                TreeMap.prototype._renderHierarchicalTreeMapItems = function (engine, container, rect, items, sum, depth, maxDepth) {
                    var len = items.length, tmType = this.type, itemContainer, item, val, rects, r, area;
                    if (len === 0) {
                        return;
                    }
                    for (var i = 0; i < len; i++) {
                        itemContainer = engine.startGroup(TreeMap._CSS_ITEMDEPTH + depth);
                        item = items[i];
                        val = Math.abs(item.value);
                        r = item.rect;
                        item.draw(engine);
                        area = new wijmo.chart._RectArea(r);
                        if (item.items) {
                            this._renderHierarchicalTreeMapItems(engine, itemContainer, item.itemsRect, item.items, val, depth + 1, maxDepth);
                        }
                        area.tag = this._itemIndex;
                        area.name = item.label;
                        area.value = val;
                        area.item = item;
                        this._areas.push(area);
                        this._itemIndex++;
                        engine.endGroup();
                    }
                };
                TreeMap.prototype._renderLabels = function (engine) {
                    var len = this._areas.length, lbl = this.dataLabel, pos = lbl.position, line = lbl.connectingLine, bdr = lbl.border, off = lbl.offset || 0, marg = 2, gcss = 'wj-data-labels', pt;
                    engine.stroke = 'null';
                    engine.fill = 'transparent';
                    engine.strokeWidth = 1;
                    engine.startGroup(gcss);
                    for (var i = 0; i < len; i++) {
                        var area = this._areas[i];
                        if (area) {
                            var rect = area.rect;
                            var hti = new wijmo.chart.HitTestInfo(this, pt);
                            hti._setData(null, i);
                            var content = this._getLabelContent(hti, lbl.content);
                            pt = new wijmo.Point(rect.left + rect.width / 2, rect.top + rect.height / 2);
                            if (content && rect.width > 0 && rect.height > 0) {
                                var ea = new wijmo.chart.DataLabelRenderEventArgs(engine, hti, pt, content);
                                if (lbl.onRendering(ea)) {
                                    content = ea.text;
                                    pt = ea.point;
                                    this._renderLabelAndBorder(engine, area, rect, content, pos, off, pt, line, marg, bdr);
                                }
                            }
                        }
                    }
                    engine.endGroup();
                };
                TreeMap.prototype._renderLabelAndBorder = function (engine, area, rect, s, pos, offset, pt, line, marg, border) {
                    var lrct, lcss = 'wj-data-label', clcss = 'wj-data-label-line', bcss = 'wj-data-label-border';
                    switch (pos) {
                        case wijmo.chart.LabelPosition.Top: {
                            if (line) {
                                engine.drawLine(pt.x, pt.y, pt.x, pt.y - offset, clcss);
                            }
                            pt.y -= marg + offset;
                            lrct = this._renderText(engine, area, rect, s, pt, 1, 2, lcss);
                            break;
                        }
                        case wijmo.chart.LabelPosition.Bottom: {
                            if (line) {
                                engine.drawLine(pt.x, pt.y, pt.x, pt.y + offset, clcss);
                            }
                            pt.y += marg + offset;
                            lrct = this._renderText(engine, area, rect, s, pt, 1, 0, lcss);
                            break;
                        }
                        case wijmo.chart.LabelPosition.Left: {
                            if (line) {
                                engine.drawLine(pt.x, pt.y, pt.x - offset, pt.y, clcss);
                            }
                            pt.x -= marg + offset;
                            lrct = this._renderText(engine, area, rect, s, pt, 2, 1, lcss);
                            break;
                        }
                        case wijmo.chart.LabelPosition.Right: {
                            if (line) {
                                engine.drawLine(pt.x, pt.y, pt.x + offset, pt.y, clcss);
                            }
                            pt.x += marg + offset;
                            lrct = this._renderText(engine, area, rect, s, pt, 0, 1, lcss);
                            break;
                        }
                        case wijmo.chart.LabelPosition.Center:
                            lrct = this._renderText(engine, area, rect, s, pt, 1, 1, lcss);
                            break;
                    }
                    if (border && lrct) {
                        engine.drawRect(lrct.left - marg, lrct.top - marg, lrct.width + 2 * marg, lrct.height + 2 * marg, bcss);
                    }
                    return lrct;
                };
                TreeMap.prototype._renderText = function (engine, area, rect, s, pt, halign, valign, className) {
                    var content = s, size, item = area.item;
                    size = engine.measureString(s, className);
                    if (this.type === TreeMapType.Horizontal && item.isTitle) {
                        if (size.width > rect.height) {
                            content = this._cutText(s, size.width, rect.height);
                        }
                        wijmo.chart.FlexChart._renderRotatedText(engine, content, pt, halign, valign, pt, -90, className);
                        return null;
                    }
                    else {
                        if (size.width > rect.width) {
                            content = this._cutText(s, size.width, rect.width);
                        }
                        return wijmo.chart.FlexChart._renderText(engine, content, pt, halign, valign, className);
                    }
                };
                TreeMap.prototype._cutText = function (s, actualWidth, maxWidth) {
                    var subString = '', len = s.length, subLen = Math.floor((1 - (actualWidth - maxWidth) / actualWidth) * len);
                    if (s.length > 0) {
                        subString = s[0] + (subLen > 1 ? s.substring(1, subLen - 1) + '..' : '');
                    }
                    return subString;
                };
                TreeMap.prototype._measureLegendItem = function (engine, text) {
                    var sz = new wijmo.Size();
                    sz.width = wijmo.chart.Series._LEGEND_ITEM_WIDTH;
                    sz.height = wijmo.chart.Series._LEGEND_ITEM_HEIGHT;
                    if (text) {
                        var tsz = engine.measureString(text, wijmo.chart.FlexChart._CSS_LABEL, wijmo.chart.FlexChart._CSS_LEGEND);
                        sz.width += tsz.width;
                        if (sz.height < tsz.height) {
                            sz.height = tsz.height;
                        }
                    }
                    sz.width += 3 * wijmo.chart.Series._LEGEND_ITEM_MARGIN;
                    sz.height += 2 * wijmo.chart.Series._LEGEND_ITEM_MARGIN;
                    return sz;
                };
                TreeMap.prototype._getDesiredLegendSize = function (engine, isVertical, width, height) {
                    // measure all series
                    var sz = new wijmo.Size();
                    var rect = new wijmo.Size(width, height);
                    var len = this._tmItems.length;
                    var cw = 0, rh = 0;
                    this._colRowLens = [];
                    for (var i = 0; i < len; i++) {
                        var isz = this._measureLegendItem(engine, this._tmItems[i].label);
                        if (isVertical) {
                            if (rh + isz.height > height) {
                                sz.height = height;
                                this._colRowLens.push(cw);
                                cw = 0;
                                rh = 0;
                            }
                            if (cw < isz.width) {
                                cw = isz.width;
                            }
                            rh += isz.height;
                        }
                        else {
                            if (cw + isz.width > width) {
                                sz.width = width;
                                this._colRowLens.push(rh);
                                rh = 0;
                                cw = 0;
                            }
                            if (rh < isz.height) {
                                rh = isz.height;
                            }
                            cw += isz.width;
                        }
                    }
                    if (isVertical) {
                        if (sz.height < rh) {
                            sz.height = rh;
                        }
                        this._colRowLens.push(cw);
                        sz.width = this._colRowLens.reduce(function (a, b) { return a + b; }, 0);
                        sz.width = this._getLegendSize(width, sz.width);
                    }
                    else {
                        if (sz.width < cw) {
                            sz.width = cw;
                        }
                        this._colRowLens.push(rh);
                        sz.height = this._colRowLens.reduce(function (a, b) { return a + b; }, 0);
                        sz.height = this._getLegendSize(height, sz.height);
                    }
                    return sz;
                };
                TreeMap.prototype._renderLegend = function (engine, pos, areas, isVertical, width, height) {
                    var rectLegend = this._rectLegend;
                    var len = this._tmItems.length;
                    var colRowLen = 0;
                    var p = pos.clone();
                    var label;
                    // create legend item
                    for (var i = 0; i < len; i++) {
                        label = this._tmItems[i].label;
                        var sz = this._measureLegendItem(engine, label);
                        if (isVertical) {
                            if (p.y + sz.height > rectLegend.top + rectLegend.height + 1) {
                                p.x += this._colRowLens[colRowLen];
                                colRowLen++;
                                p.y = pos.y;
                            }
                        }
                        else {
                            if (p.x + sz.width > rectLegend.left + rectLegend.width + 1) {
                                p.y += this._colRowLens[colRowLen];
                                colRowLen++;
                                p.x = pos.x;
                            }
                        }
                        var rect = new wijmo.Rect(p.x, p.y, sz.width, sz.height);
                        this._drawLegendItem(engine, rect, i, label);
                        areas.push(rect);
                        if (isVertical) {
                            p.y += sz.height;
                        }
                        else {
                            p.x += sz.width;
                        }
                    }
                };
                TreeMap.prototype._drawLegendItem = function (engine, rect, i, name) {
                    engine.strokeWidth = 1;
                    var marg = wijmo.chart.Series._LEGEND_ITEM_MARGIN;
                    var color = this._getColor(i);
                    var fill = color && color.maxColor ? color.maxColor : color;
                    var stroke = this._getLightColor(fill);
                    engine.fill = fill;
                    engine.stroke = stroke;
                    var yc = rect.top + 0.5 * rect.height;
                    var wsym = wijmo.chart.Series._LEGEND_ITEM_WIDTH;
                    var hsym = wijmo.chart.Series._LEGEND_ITEM_HEIGHT;
                    engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null);
                    if (name) {
                        wijmo.chart.FlexChart._renderText(engine, name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, wijmo.chart.FlexChart._CSS_LABEL);
                    }
                };
                //---------------------------------------------------------------------
                // tooltips
                TreeMap.prototype._getLabelContent = function (ht, content) {
                    if (wijmo.isString(content)) {
                        return this._keywords.replace(content, ht);
                    }
                    else if (wijmo.isFunction(content)) {
                        return content(ht);
                    }
                    return null;
                };
                /**
                    * Gets a {@link HitTestInfo} object with information about the specified point.
                    *
                    * @param pt The point to investigate, in window coordinates.
                    * @param y Y coordinate of the point (if the first parameter is a number).
                    * @return A {@link HitTestInfo} object containing information about the point.
                    */
                TreeMap.prototype.hitTest = function (pt, y) {
                    // control coords
                    var cpt = this._toControl(pt, y);
                    var hti = new wijmo.chart.HitTestInfo(this, cpt);
                    var si = null;
                    if (wijmo.chart.FlexChart._contains(this._rectHeader, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Header;
                    }
                    else if (wijmo.chart.FlexChart._contains(this._rectFooter, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Footer;
                    }
                    else if (wijmo.chart.FlexChart._contains(this._rectLegend, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Legend;
                        si = this.legend._hitTest(cpt);
                        if (si !== null && si >= 0 && si < this._areas.length) {
                            hti._setData(null, si);
                        }
                    }
                    else if (wijmo.chart.FlexChart._contains(this._rectChart, cpt)) {
                        var len = this._areas.length, min_dist = NaN, min_area;
                        for (var i = 0; i < len; i++) {
                            var pt1 = cpt.clone();
                            var area = this._areas[i];
                            if (area.contains(pt1)) {
                                hti._setData(null, area.tag);
                                hti._dist = 0;
                            }
                            var dist = area.distance(pt1);
                            if (dist !== undefined) {
                                if (isNaN(min_dist) || dist < min_dist) {
                                    min_dist = dist;
                                    min_area = area;
                                }
                            }
                        }
                        if (hti._dist !== 0 && min_area != null) {
                            hti._setData(null, min_area.tag);
                            hti._dist = min_dist;
                        }
                        hti._chartElement = wijmo.chart.ChartElement.ChartArea;
                    }
                    else {
                        hti._chartElement = wijmo.chart.ChartElement.None;
                    }
                    return hti;
                };
                TreeMap.prototype._getHitTestItem = function (index) {
                    var items = null, item = null;
                    if (this._cv != null) {
                        items = this._cv.items;
                    }
                    else {
                        items = this.itemsSource;
                    }
                    if (items && index < items.length) {
                        item = items[index];
                    }
                    return item;
                };
                TreeMap.prototype._getHitTestValue = function (index) {
                    return this._values[index];
                };
                TreeMap.prototype._getHitTestLabel = function (index) {
                    return this._labels[index];
                };
                TreeMap._CSS_ITEMDEPTH = 'wj-treemap-item-depth';
                TreeMap._MARGIN = 0;
                return TreeMap;
            }(wijmo.chart.FlexChartBase));
            hierarchical.TreeMap = TreeMap;
            var _TreeMapItem = /** @class */ (function () {
                function _TreeMapItem() {
                    this.items = [];
                    this.maxValue = Number.MIN_VALUE;
                    this.minValue = Number.MAX_VALUE;
                }
                _TreeMapItem.prototype.draw = function (engine) {
                    var r = this.rect;
                    engine.strokeWidth = 0;
                    if (this.isTitle) {
                        engine.fill = this.titleFill;
                        engine.stroke = this.titleStroke;
                    }
                    else {
                        engine.fill = this.fill;
                        engine.stroke = this.stroke;
                    }
                    engine.drawRect(r.left, r.top, r.width, r.height, _TreeMapItem._CLASSNAME);
                };
                Object.defineProperty(_TreeMapItem.prototype, "itemsRect", {
                    get: function () {
                        var r = this.rect, _r = this._rect;
                        var padding = this.depth === 1 ? 2 : 0.5;
                        if (this.isTitle) {
                            if (this.type === TreeMapType.Horizontal) {
                                return new wijmo.Rect(r.left + r.width + 1, r.top, _r.width - r.width - padding * 2, r.height + 1);
                            }
                            else {
                                return new wijmo.Rect(r.left, r.top + r.height + 1, r.width + 1, _r.height - r.height - padding * 2);
                            }
                        }
                        return new wijmo.Rect(0, 0, 0, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_TreeMapItem.prototype, "rect", {
                    get: function () {
                        var r = this._rect;
                        var padding = this.depth === 1 ? 2 : 0.5;
                        var width = r.width, height = r.height, left = r.left, top = r.top;
                        if (this.isTitle) {
                            if (this.type === TreeMapType.Horizontal) {
                                width = r.width > 20 ? 20 : width;
                                width = Math.max(20, width - 2 * padding);
                                height = height > padding * 2 ? height - padding * 2 : 0;
                            }
                            else {
                                height = r.height > 20 ? 20 : height;
                                height = Math.max(20, height - 2 * padding);
                                width = width > padding * 2 ? width - padding * 2 : 0;
                            }
                            left = left + padding;
                            top = top + padding;
                        }
                        else {
                            width = width > padding * 2 ? width - padding * 2 : 0;
                            height = height > padding * 2 ? height - padding * 2 : 0;
                        }
                        return new wijmo.Rect(left, top, width, height);
                    },
                    set: function (value) {
                        if (value != this._rect) {
                            this._rect = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_TreeMapItem.prototype, "isTitle", {
                    get: function () {
                        return this._isTitle;
                    },
                    set: function (value) {
                        var val = wijmo.asBoolean(value, true);
                        if (val !== this._isTitle) {
                            this._isTitle = val;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                _TreeMapItem._CLASSNAME = 'wj-treemap-item';
                return _TreeMapItem;
            }());
            //calculate color for different value.
            var _ColorConverter = /** @class */ (function () {
                function _ColorConverter(minColor, minColorValue, maxColor, maxColorValue, midColor, midColorValue) {
                    this.minColor = new wijmo.Color(minColor);
                    this.minColorValue = minColorValue;
                    this.maxColor = new wijmo.Color(maxColor);
                    this.maxColorValue = maxColorValue;
                    this.midColorValue = this.originalMidColorValue = midColorValue;
                    this._calculateMidColorValue();
                    this.midColor = this.originalMidColor = new wijmo.Color(midColor);
                    this._calculateMidColor();
                }
                _ColorConverter.prototype._resetminColor = function (val) {
                    this.minColor = new wijmo.Color(val);
                    this._calculateMidColor();
                };
                _ColorConverter.prototype._resetmidColor = function (val) {
                    this.midColor = this.originalMidColor = new wijmo.Color(val);
                    this._calculateMidColor();
                };
                _ColorConverter.prototype._resetmaxColor = function (val) {
                    this.maxColor = new wijmo.Color(val);
                    this._calculateMidColor();
                };
                _ColorConverter.prototype._resetminColorValue = function (val) {
                    this.minColorValue = val;
                    this._calculateMidColorValue();
                };
                _ColorConverter.prototype._resetmidColorValue = function (val) {
                    this.midColorValue = this.originalMidColorValue = val;
                    this._calculateMidColorValue();
                };
                _ColorConverter.prototype._resetmaxColorValue = function (val) {
                    this.maxColorValue = val;
                    this._calculateMidColorValue();
                };
                _ColorConverter.prototype._calculateMidColorValue = function () {
                    if (this.originalMidColorValue == null) {
                        this.midColorValue = (this.maxColorValue + this.minColorValue) / 2;
                    }
                };
                _ColorConverter.prototype._calculateMidColor = function () {
                    if (this.originalMidColor == null) {
                        this.midColor = this._calculateColorByVal(this.midColorValue, true);
                    }
                };
                _ColorConverter.prototype._calculateColorByVal = function (val, skipMidCheck) {
                    if (skipMidCheck === void 0) { skipMidCheck = false; }
                    var maxColor = this.maxColor, minColor = this.minColor, maxVal = this.maxColorValue, minVal = this.minColorValue;
                    if (val >= this.maxColorValue) {
                        return new wijmo.Color(maxColor.toString());
                    }
                    if (val <= this.minColorValue) {
                        return new wijmo.Color(minColor.toString());
                    }
                    if (!skipMidCheck) {
                        if (val === this.midColorValue) {
                            return new wijmo.Color(this.midColor.toString());
                        }
                        if (val < this.midColorValue) {
                            maxColor = this.midColor;
                            maxVal = this.midColorValue;
                        }
                        else {
                            minColor = this.midColor;
                            minVal = this.midColorValue;
                        }
                    }
                    return this._getColor(val, maxColor, maxVal, minColor, minVal);
                };
                _ColorConverter.prototype._getColor = function (val, max, maxVal, min, minVal) {
                    var color = wijmo.Color.fromRgba(this._getValueByRatio(val, max.r, maxVal, min.r, minVal), this._getValueByRatio(val, max.g, maxVal, min.g, minVal), this._getValueByRatio(val, max.b, maxVal, min.b, minVal), this._getValueByRatio(val, max.a, maxVal, min.a, minVal));
                    return color;
                };
                _ColorConverter.prototype._getValueByRatio = function (val, max, maxVal, min, minVal) {
                    return Math.abs(min + Math.round((val - minVal) * (max - min) / (maxVal - minVal)));
                };
                return _ColorConverter;
            }());
            //algorithm for painting TreeMap item.
            var _TreeMapUtils = /** @class */ (function () {
                function _TreeMapUtils() {
                }
                //"Squarified Treemap" http://www.win.tue.nl/~vanwijk/stm.pdf,
                //by Mark Bruls, Kees Huizing and Jarke J. van Wijk
                _TreeMapUtils.squarified = function (items, rect, sum) {
                    var v = items.slice(), r = rect.clone(), ratio = r.width * r.height / sum;
                    do {
                        var rowedItems = _TreeMapUtils.getRowedItems(v, r, ratio);
                        var rs = _TreeMapUtils.layoutRowedItems(rect, rowedItems, r, r.width > r.height);
                    } while (v.length);
                };
                _TreeMapUtils.horizontal = function (items, rect, sum) {
                    var r = rect.clone();
                    items.forEach(function (v) {
                        var rowedItems = [{
                                item: v,
                                val: v.value * rect.width * rect.height / sum
                            }];
                        var rs = _TreeMapUtils.layoutRowedItems(rect, rowedItems, r, false);
                    });
                };
                _TreeMapUtils.vertical = function (items, rect, sum) {
                    var r = rect.clone();
                    items.forEach(function (v) {
                        var rowedItems = [{
                                item: v,
                                val: v.value * rect.width * rect.height / sum
                            }];
                        var rs = _TreeMapUtils.layoutRowedItems(rect, rowedItems, r, true);
                    });
                };
                _TreeMapUtils.getNarrowLen = function (bounds) {
                    return Math.min(bounds.width, bounds.height);
                };
                _TreeMapUtils.getRowedItem = function (item, bounds, ratio) {
                    var itemSquare = ratio * item.value;
                    return {
                        item: item,
                        val: itemSquare
                    };
                };
                _TreeMapUtils.getRowedItems = function (items, bounds, ratio) {
                    var item = items.shift(), row = [], newRow = [], len = _TreeMapUtils.getNarrowLen(bounds), rowedItem = _TreeMapUtils.getRowedItem(item, bounds, ratio);
                    row.push(rowedItem);
                    newRow.push(rowedItem);
                    if (items.length > 0) {
                        do {
                            newRow.push(_TreeMapUtils.getRowedItem(items[0], bounds, ratio));
                            if (_TreeMapUtils.worst(row, len) > _TreeMapUtils.worst(newRow, len)) {
                                row = newRow.slice();
                                items.shift();
                            }
                            else {
                                break;
                            }
                        } while (items.length);
                    }
                    return row;
                };
                _TreeMapUtils.layoutRowedItems = function (containerRect, rowedItems, rect, isVertical) {
                    var left = rect.left, top = rect.top, maxX = left + rect.width, maxY = top + rect.height, rowHeight, sum = _TreeMapUtils.sumRowedArray(rowedItems);
                    if (isVertical) {
                        rowHeight = rect.height === 0 ? 0 : sum / rect.height;
                        if (left + rowHeight >= maxX) {
                            rowHeight = maxX - left;
                        }
                        rowedItems.forEach(function (item, idx) {
                            var len = rowHeight === 0 ? 0 : item.val / rowHeight;
                            if ((top + len) > maxY || idx === rowedItems.length - 1) {
                                len = maxY - top;
                            }
                            var r = new wijmo.Rect(left, top, rowHeight, len);
                            item.item.rect = r;
                            top += len;
                        });
                        rect.left += rowHeight;
                        rect.width -= rowHeight;
                    }
                    else {
                        rowHeight = rect.width === 0 ? 0 : sum / rect.width;
                        if (top + rowHeight >= maxY) {
                            rowHeight = maxY - top;
                        }
                        rowedItems.forEach(function (item, idx) {
                            var len = rowHeight === 0 ? 0 : item.val / rowHeight;
                            if ((left + len) > maxX || idx === rowedItems.length - 1) {
                                len = maxX - left;
                            }
                            var r = new wijmo.Rect(left, top, len, rowHeight);
                            item.item.rect = r;
                            left += len;
                        });
                        rect.top += rowHeight;
                        rect.height -= rowHeight;
                    }
                };
                _TreeMapUtils.sumRowedArray = function (arr) {
                    //http://jsperf.com/summing-array-elements-underscore-reduce-vs-for/2
                    //http://jsperf.com/eval-join-vs-reduce
                    //for loop is faster.
                    var sum = 0, len = arr.length;
                    for (var i = 0; i < len; i++) {
                        sum += arr[i].val;
                    }
                    return sum;
                };
                _TreeMapUtils.worst = function (arr, w) {
                    var max, min, tmp, sum = _TreeMapUtils.sumRowedArray(arr), sumSquare = sum * sum, wSquare = w * w;
                    max = min = arr[0].val;
                    //Don't use Math.min/max directly, for loop is the fastest way.
                    arr.forEach(function (item, idx) {
                        if (item.val > max) {
                            max = item.val;
                        }
                        else if (item.val < min) {
                            min = item.val;
                        }
                    });
                    return Math.max((wSquare * max) / sumSquare, sumSquare / (wSquare * min));
                };
                return _TreeMapUtils;
            }());
        })(hierarchical = chart.hierarchical || (chart.hierarchical = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var hierarchical;
        (function (hierarchical) {
            'use strict';
            /**
             * Sunburst chart control.
             */
            var Sunburst = /** @class */ (function (_super) {
                __extends(Sunburst, _super);
                function Sunburst(element, options) {
                    var _this = _super.call(this, element, options) || this;
                    //add classes to host element
                    _this._selectionIndex = 0;
                    _this.applyTemplate('wj-sunburst', null, null);
                    // apply options only after chart is fully initialized
                    _this.initialize(options);
                    // refresh control to show current state
                    _this.refresh();
                    return _this;
                }
                Object.defineProperty(Sunburst.prototype, "bindingName", {
                    /**
                     * Gets or sets the name of the property containing name of the data item;
                     * it should be an array or a string.
                     */
                    get: function () {
                        return this._bindName;
                    },
                    set: function (value) {
                        if (value != this._bindName) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'bindingName should be an array or a string.');
                            this._bindName = value;
                            this._bindChart();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sunburst.prototype, "childItemsPath", {
                    /**
                     * Gets or sets the name of the property (or properties) used to generate
                     * child items in hierarchical data.
                     *
                     * Set this property to a string to specify the name of the property that
                     * contains an item's child items (e.g. <code>'items'</code>).
                     *
                     * Set this property to an array containing the names of the properties
                     * that contain child items at each level, when the items are child items
                     * at different levels with different names
                     * (e.g. <code>[ 'accounts', 'checks', 'earnings' ]</code>).
                     */
                    get: function () {
                        return this._childItemsPath;
                    },
                    set: function (value) {
                        if (value != this._childItemsPath) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'childItemsPath should be an array or a string.');
                            this._childItemsPath = value;
                            this._bindChart();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Sunburst.prototype._initData = function () {
                    _super.prototype._initData.call(this);
                    this._processedData = [];
                    this._level = 1;
                    this._legendLabels = [];
                    this._processedItem = [];
                    this._values[0] = [];
                };
                Sunburst.prototype._performBind = function () {
                    var _this = this;
                    var items, processedData;
                    this._initData();
                    if (this._cv) {
                        items = this._cv.items;
                        if (this._cv.groups && this._cv.groups.length) {
                            this._processedData = hierarchical.HierarchicalUtil.parseDataToHierarchical(this._cv, this.binding, this.bindingName, this.childItemsPath);
                        }
                        else if (items) {
                            this._processedData = hierarchical.HierarchicalUtil.parseDataToHierarchical(items, this.binding, this.bindingName, this.childItemsPath);
                        }
                        if (this._processedData && this._processedData.length) {
                            this._sums[0] = this._sum = this._calculateValueAndLevel(this._processedData, 1);
                            this._processedData.forEach(function (v) {
                                _this._legendLabels.push(v.name);
                            });
                        }
                    }
                };
                Sunburst.prototype._calculateValueAndLevel = function (arr, level) {
                    var _this = this;
                    var sum = 0, values = this._values[0], labels = this._labels;
                    if (this._level < level) {
                        this._level = level;
                    }
                    arr.forEach(function (v) {
                        var val;
                        if (v.items) {
                            val = _this._calculateValueAndLevel(v.items, level + 1);
                            v.value = val;
                            values.push(val);
                            labels.push(v.name);
                        }
                        else {
                            val = _this._getBindData(v, values, labels, 'value', 'name');
                            v.value = val;
                        }
                        sum += val;
                    });
                    return sum;
                };
                Sunburst.prototype._renderPie = function (engine, i, radius, innerRadius, startAngle, offset) {
                    var center = this._getCenter();
                    this._sliceIndex = 0;
                    this._parentRef = {};
                    this._renderHierarchicalSlices(engine, center.x, center.y, this._processedData, this._sum, radius, innerRadius, startAngle, 2 * Math.PI, offset, 1);
                };
                Sunburst.prototype._renderHierarchicalSlices = function (engine, cx, cy, values, sum, radius, innerRadius, startAngle, totalSweep, offset, level) {
                    var len = values.length, angle = startAngle, reversed = this.reversed == true, r, ir, segment, sweep, value, val, pel, x, y, currentAngle;
                    segment = (radius - innerRadius) / this._level;
                    r = radius - (this._level - level) * segment;
                    ir = innerRadius + (level - 1) * segment;
                    for (var i = 0; i < len; i++) {
                        x = cx;
                        y = cy;
                        pel = engine.startGroup('wj-slice slice-level' + level);
                        if (level === 1) {
                            engine.fill = this._getColorLight(i);
                            engine.stroke = this._getColor(i);
                        }
                        value = values[i];
                        val = Math.abs(value.value);
                        sweep = Math.abs(val - sum) < 1E-10 ? totalSweep : totalSweep * val / sum;
                        currentAngle = reversed ? angle - 0.5 * sweep : angle + 0.5 * sweep;
                        if (offset > 0 && sweep < totalSweep) {
                            x += offset * Math.cos(currentAngle);
                            y += offset * Math.sin(currentAngle);
                        }
                        if (value.items) {
                            var idx = this._sliceIndex;
                            this._renderHierarchicalSlices(engine, x, y, value.items, val, radius, innerRadius, angle, sweep, 0, level + 1);
                            for (; idx < this._sliceIndex; idx++) {
                                if (this._parentRef[idx] == null) {
                                    this._parentRef[idx] = this._sliceIndex;
                                }
                            }
                        }
                        this._renderSlice(engine, x, y, currentAngle, 0, this._sliceIndex, r, ir, angle, sweep, totalSweep);
                        this._processedItem.push(value.item);
                        this._sliceIndex++;
                        if (reversed) {
                            angle -= sweep;
                        }
                        else {
                            angle += sweep;
                        }
                        engine.endGroup();
                        this._pels.push(pel);
                    }
                };
                Sunburst.prototype._getLabelsForLegend = function () {
                    return this._legendLabels || [];
                };
                Sunburst.prototype._highlightCurrent = function () {
                    if (this.selectionMode != wijmo.chart.SelectionMode.None) {
                        this._highlight(true, this._selectionIndex);
                    }
                };
                Sunburst.prototype.hitTest = function (pt, y) {
                    var hti = _super.prototype.hitTest.call(this, pt, y);
                    var cpt = this._toControl(pt, y);
                    if (wijmo.chart.FlexChartBase._contains(this._rectChart, cpt)) {
                        var idx = hti.pointIndex;
                        var item = this._processedItem[idx];
                        var dp = new wijmo.chart._DataPoint(null, idx, null, null);
                        dp['item'] = item;
                        hti._setDataPoint(dp);
                    }
                    return hti;
                };
                Sunburst.prototype._getSelectedItemOffset = function (index, angle) {
                    var dx = 0, dy = 0, off = 0;
                    if (this.selectedItemOffset > 0) {
                        if (index == this.selectedIndex) {
                            off = this.selectedItemOffset;
                        }
                        else {
                            var idx = this._getSelectedParentIndex(index);
                            if (idx != null) {
                                var seg = this._areas[idx];
                                var pos = this.dataLabel.position;
                                off = this.selectedItemOffset;
                                angle = seg.langle + this._rotationAngles[0];
                                angle = ((angle % 360) + 360) % 360;
                                angle *= Math.PI / 180;
                            }
                        }
                    }
                    if (off > 0) {
                        dx = Math.cos(angle) * off * this._radius;
                        dy = Math.sin(angle) * off * this._radius;
                    }
                    return {
                        x: dx,
                        y: dy
                    };
                };
                Sunburst.prototype._getSelectedParentIndex = function (index) {
                    var idx = this._parentRef[index];
                    if (idx != null) {
                        if (idx === this.selectedIndex) {
                            return idx;
                        }
                        else {
                            return this._getSelectedParentIndex(idx);
                        }
                    }
                    return null;
                };
                return Sunburst;
            }(wijmo.chart.FlexPie));
            hierarchical.Sunburst = Sunburst;
        })(hierarchical = chart.hierarchical || (chart.hierarchical = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var hierarchical;
        (function (hierarchical) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.chart.hierarchical', wijmo.chart.hierarchical);
        })(hierarchical = chart.hierarchical || (chart.hierarchical = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.chart.hierarchical.js.map