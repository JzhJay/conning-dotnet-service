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
        var map;
        (function (map) {
            'use strict';
            /** Information about hit test result. */
            var MapHitTestInfo = /** @class */ (function () {
                function MapHitTestInfo() {
                }
                Object.defineProperty(MapHitTestInfo.prototype, "point", {
                    /**
                     * Gets the point in control coordinates.
                     */
                    get: function () {
                        return this._pt;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapHitTestInfo.prototype, "item", {
                    /**
                     * Gets the data item associated with the point.
                     */
                    get: function () {
                        return this._item;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapHitTestInfo.prototype, "geoPoint", {
                    /** Gets the hit point in geographical coordinates. */
                    get: function () {
                        return this._map ? this._map.convertBack(this.point) : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapHitTestInfo.prototype, "chartElement", {
                    /** Gets chart element at the hit point. */
                    get: function () {
                        return this._chartElement;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapHitTestInfo.prototype, "map", {
                    /**
                     * Get the map control.
                     */
                    get: function () {
                        return this._map;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MapHitTestInfo;
            }());
            map.MapHitTestInfo = MapHitTestInfo;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            var _DrawOptions = /** @class */ (function () {
                function _DrawOptions() {
                }
                return _DrawOptions;
            }());
            map._DrawOptions = _DrawOptions;
            var _SvgMapRenderEngine = /** @class */ (function (_super) {
                __extends(_SvgMapRenderEngine, _super);
                function _SvgMapRenderEngine(el) {
                    var _this = _super.call(this, el) || this;
                    _this.scale = 1;
                    _this.element.setAttribute('xmlns:wj-map', 'http://www.grapecity.com/wijmo');
                    return _this;
                }
                _SvgMapRenderEngine.prototype.drawPolygon2 = function (options, pts) {
                    var className = options ? options.className : null;
                    var clipPath = options ? options.clipPath : null;
                    var style = options ? options.style : null;
                    var prec = this.precision;
                    if (pts && pts.length > 0) {
                        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        this._applyColor(path, 'stroke', this.stroke);
                        var sw = this.strokeWidth;
                        if (sw !== null) {
                            if (wijmo.isIE()) {
                                sw *= this.scale;
                            }
                            this._setAttribute(path, 'stroke-width', sw.toString());
                        }
                        this._applyColor(path, 'fill', this.fill);
                        var d = '';
                        for (var j = 0; j < pts.length; j++) {
                            var pts0 = pts[j];
                            var npt = pts0.length / 2;
                            if (npt > 1) {
                                d += ' M ' + pts0[0].toFixed(prec) + ' ' + pts0[1].toFixed(prec);
                                for (var i = 1; i < npt; i++) {
                                    d += ' L ' + pts0[i * 2].toFixed(prec) + ' ' + pts0[i * 2 + 1].toFixed(prec);
                                }
                                d += ' Z';
                            }
                        }
                        this._setAttribute(path, 'd', d);
                        if (className) {
                            path.setAttribute('class', className);
                        }
                        if (clipPath) {
                            this._setClipPath(path, clipPath);
                        }
                        this._applyStyle(path, style);
                        this._appendChild(path);
                        path.setAttribute('vector-effect', 'non-scaling-stroke');
                        return path;
                    }
                    return null;
                };
                return _SvgMapRenderEngine;
            }(wijmo.chart.SvgRenderEngine));
            map._SvgMapRenderEngine = _SvgMapRenderEngine;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            var _Range = /** @class */ (function () {
                function _Range(min, max) {
                    this.min = min;
                    this.max = max;
                }
                Object.defineProperty(_Range.prototype, "range", {
                    get: function () {
                        return this.max - this.min;
                    },
                    enumerable: true,
                    configurable: true
                });
                _Range.prototype.norm = function (val) {
                    return (val - this.min) / this.range;
                };
                return _Range;
            }());
            map._Range = _Range;
            var _Utils = /** @class */ (function () {
                function _Utils() {
                }
                _Utils.getRange = function (items, binding) {
                    if (items && binding) {
                        var len = items.length;
                        var min = NaN;
                        var max = NaN;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (item) {
                                var val = void 0;
                                if (wijmo.isFunction(binding)) {
                                    val = binding(item);
                                }
                                else {
                                    val = binding.getValue(item);
                                }
                                if (wijmo.isString(val)) {
                                    val = parseFloat(val);
                                }
                                if (isFinite(val)) {
                                    if (isNaN(min) || val < min) {
                                        min = val;
                                    }
                                    if (isNaN(max) || val > max) {
                                        max = val;
                                    }
                                }
                            }
                        }
                        if (!isNaN(min) && !isNaN(max)) {
                            return new _Range(min, max);
                        }
                    }
                    return null;
                };
                return _Utils;
            }());
            map._Utils = _Utils;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            // todo
            // * continuous/discrete
            // * domain/clamp
            /** Color scale performs value to color transformation. */
            var ColorScale = /** @class */ (function () {
                function ColorScale(options) {
                    this._clrs = [];
                    this._clrUnknown = 'transparent';
                    this.colors = wijmo.chart.Palettes.SequentialSingle.Greys;
                    this.initialize(options);
                }
                ColorScale.prototype.initialize = function (options) {
                    wijmo.copy(this, options);
                };
                ColorScale.prototype.convert = function (val, norm) {
                    if (norm === void 0) { norm = true; }
                    if (!isFinite(val) || this._clrs.length == 0) {
                        return this.colorUnknown;
                    }
                    if (this._range && norm) {
                        val = this._range.norm(val);
                    }
                    if (this.scale) {
                        val = this.scale(val);
                    }
                    // return Color.interpolate(this._clrs[0], this._clrs[1], val).toString();
                    if (this._clrs.length == 2) {
                        return this._interpolate(this._clrs[0], this._clrs[1], val);
                    }
                    else {
                        return this._clrSpline.interpolate(val).toString();
                    }
                };
                Object.defineProperty(ColorScale.prototype, "scale", {
                    /** Gets or sets the scaling function. */
                    get: function () {
                        return this._scale;
                    },
                    set: function (value) {
                        if (this._scale != value) {
                            this._scale = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorScale.prototype, "binding", {
                    /** Gets or sets the binding property or function. */
                    get: function () {
                        return this._binding;
                    },
                    set: function (value) {
                        if (this._binding != value) {
                            this._binding = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorScale.prototype, "colorUnknown", {
                    /**
                     * Get or sets the color for undefined values (NaN or undefined).
                     */
                    get: function () {
                        return this._clrUnknown;
                    },
                    set: function (value) {
                        if (this._clrUnknown != value) {
                            this._clrUnknown = wijmo.asString(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorScale.prototype, "colors", {
                    /** Gets or sets the array of colors (palette) used for transformation. */
                    get: function () {
                        return this._colors;
                    },
                    set: function (value) {
                        if (this._colors != value) {
                            this._clrs = [];
                            var clrs = this._colors = value;
                            if (clrs) {
                                for (var i = 0; i < clrs.length; i++) {
                                    this._clrs.push(new wijmo.Color(clrs[i]));
                                }
                                this._clrSpline = new _ColorSpline(this._clrs);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorScale.prototype, "format", {
                    /**
                     * Get or sets the format string for legend items.
                     */
                    get: function () {
                        return this._fmt;
                    },
                    set: function (value) {
                        if (this._fmt != value) {
                            this._fmt = wijmo.asString(value, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ColorScale.prototype.domain = function (items) {
                    if (wijmo.isFunction(this.binding)) {
                        this._range = map._Utils.getRange(items, this.binding);
                    }
                    else {
                        this._range = map._Utils.getRange(items, new wijmo.Binding(this.binding));
                    }
                };
                ColorScale.prototype.getValue = function (item) {
                    var val;
                    if (wijmo.isFunction(this.binding)) {
                        val = this.binding(item);
                    }
                    else {
                        val = new wijmo.Binding(this.binding).getValue(item);
                    }
                    return val;
                };
                ColorScale.prototype._interpolate = function (clr1, clr2, pct) {
                    pct = wijmo.clamp(pct, 0, 1);
                    var qpct = 1 - pct;
                    return wijmo.Color.fromRgba(clr1.r * qpct + clr2.r * pct, clr1.g * qpct + clr2.g * pct, clr1.b * qpct + clr2.b * pct, clr1.a * qpct + clr2.a * pct).toString();
                };
                ColorScale.prototype._drawLegend = function (e, rect, isVert) {
                    _ColorScaleLegend.draw(e, this, rect, isVert);
                };
                ColorScale.prototype._measureLegend = function (e, isVert, w, h) {
                    return _ColorScaleLegend.measure(e, this, isVert, w, h);
                };
                return ColorScale;
            }());
            map.ColorScale = ColorScale;
            var _ColorScaleLegend = /** @class */ (function () {
                function _ColorScaleLegend() {
                }
                _ColorScaleLegend.measure = function (e, clrScale, isVert, w, h) {
                    var legendSize = isVert ? new wijmo.Size(this.itemSize, h - 120) : new wijmo.Size(w - 80, this.itemSize);
                    var values = this._getValues(clrScale);
                    var len = values.length;
                    if (values.length) {
                        var sz = new wijmo.Size();
                        for (var i = 0; i < len; i++) {
                            var s = this._getLabel(clrScale, values[i]);
                            var sz0 = e.measureString(s);
                            sz.width = Math.max(sz.width, sz0.width);
                            sz.height = Math.max(sz.height, sz0.height);
                        }
                        if (sz.width && sz.height) {
                            if (isVert) {
                                legendSize.width += sz.width + this.marginText;
                            }
                            else {
                                legendSize.height += sz.height + this.marginText;
                            }
                        }
                    }
                    return legendSize;
                };
                _ColorScaleLegend.draw = function (e, clrScale, rect, isVert) {
                    e.stroke = 'transparent';
                    var cnt = 100;
                    var vals = this._getValues(clrScale);
                    if (isVert) {
                        rect = rect.inflate(0, -10);
                        var dy = rect.height / cnt;
                        for (var i = 0; i < cnt; i++) {
                            e.fill = clrScale.convert((i + 0.5) / cnt, false);
                            e.drawRect(rect.left, rect.top + i * dy, this.itemSize, dy + 1);
                        }
                        if (vals.length) {
                            e.stroke = 'black';
                            for (var i = 0; i < vals.length; i++) {
                                var val = vals[i];
                                var vn = clrScale._range.norm(val);
                                var y = rect.top + vn * rect.height;
                                var s = this._getLabel(clrScale, val);
                                var sz = e.measureString(s);
                                e.drawString(s, new wijmo.Point(rect.left + this.itemSize + this.marginText, y + 0.5 * sz.height));
                                e.drawLine(rect.left, y, rect.left + this.itemSize, y);
                            }
                        }
                    }
                    else {
                        rect = rect.inflate(-20, 0);
                        var dx = rect.width / cnt;
                        var dy = 0;
                        if (vals.length) {
                            for (var i = 0; i < vals.length; i++) {
                                var val = vals[i];
                                var vn = clrScale._range.norm(val);
                                if (clrScale.scale) {
                                    vn = clrScale.scale(vn);
                                }
                                var x = rect.left + vn * rect.width;
                                var s = this._getLabel(clrScale, val);
                                var sz = e.measureString(s);
                                dy = Math.max(dy, sz.height);
                                e.drawString(this._getLabel(clrScale, val), new wijmo.Point(x - 0.5 * sz.width, rect.top + sz.height));
                            }
                        }
                        if (dy) {
                            dy += this.marginText;
                        }
                        for (var i = 0; i < cnt; i++) {
                            e.fill = clrScale.convert((i + 0.5) / cnt, false);
                            e.drawRect(rect.left + i * dx, rect.top + dy, dx + 1, this.itemSize);
                        }
                        if (vals.length) {
                            e.stroke = 'black';
                            for (var i = 0; i < vals.length; i++) {
                                var val = vals[i];
                                var vn = clrScale._range.norm(val);
                                if (clrScale.scale) {
                                    vn = clrScale.scale(vn);
                                }
                                var x = rect.left + vn * rect.width;
                                e.drawLine(x, rect.bottom - this.itemSize, x, rect.bottom);
                            }
                        }
                    }
                };
                _ColorScaleLegend._getValues = function (clrScale) {
                    var values = [];
                    var range = clrScale._range;
                    if (range) {
                        var delta = this._calcDelta(range.range);
                        var min = Math.round(range.min / delta) * delta;
                        for (var val = min; val <= range.max; val += delta) {
                            if (val < range.min) {
                                continue;
                            }
                            values.push(val);
                        }
                    }
                    return values;
                };
                _ColorScaleLegend._getLabel = function (clrScale, val) {
                    return clrScale.format ? wijmo.Globalize.formatNumber(val, clrScale.format) : val.toString();
                };
                _ColorScaleLegend._calcDelta = function (range) {
                    var prec = this._nicePrecision(range);
                    var dx = range / 10 /*this._getAnnoNumber(this.axisType == AxisType.Y)*/;
                    var delta = this._niceNumber(2 * dx, -prec, true);
                    if (delta < dx) {
                        delta = this._niceNumber(dx, -prec + 1, false);
                    }
                    if (delta < dx) {
                        delta = this._niceTickNumber(dx);
                    }
                    return delta;
                };
                _ColorScaleLegend._nicePrecision = function (range) {
                    //
                    //	Return a nice precision value for this range.
                    //	Doesn't take into account font size, window
                    //	size, etc.	Just use the log10 of the range.
                    //
                    if (!wijmo.isNumber(range) || range <= 0) {
                        return 0;
                    }
                    var log10 = Math.log(range) / Math.LN10;
                    var exp;
                    if (log10 >= 0) {
                        exp = Math.floor(log10);
                    }
                    else {
                        exp = Math.ceil(log10);
                    }
                    var f = range / Math.pow(10.0, exp);
                    /* we need the extra digit near the lower end */
                    if (f < 3.0) {
                        exp = -exp + 1;
                        // more precision for more labels
                        f = range / Math.pow(10.0, exp);
                        if (f < 3.0) {
                            exp = exp + 1;
                        }
                    }
                    return exp;
                };
                _ColorScaleLegend._niceTickNumber = function (x) {
                    if (x == 0) {
                        return x;
                    }
                    else if (x < 0) {
                        x = -x;
                    }
                    var log10 = Math.log(x) / Math.LN10;
                    var exp = Math.floor(log10);
                    var f = x / Math.pow(10.0, exp);
                    var nf = 10.0;
                    if (f <= 1.0) {
                        nf = 1.0;
                    }
                    else if (f <= 2.0) {
                        nf = 2.0;
                    }
                    else if (f <= 5.0) {
                        nf = 5.0;
                    }
                    return (nf * Math.pow(10.0, exp));
                };
                _ColorScaleLegend._niceNumber = function (x, exp, round) {
                    if (x == 0) {
                        return x;
                    }
                    else if (x < 0) {
                        x = -x;
                    }
                    var f = x / Math.pow(10.0, exp);
                    var nf = 10.0;
                    if (round) {
                        if (f < 1.5) {
                            nf = 1;
                        }
                        else if (f < 3) {
                            nf = 2;
                        }
                        else if (f < 4.5) {
                            nf = 4;
                        }
                        else if (f < 7) {
                            nf = 5;
                        }
                    }
                    else {
                        if (f <= 1) {
                            nf = 1;
                        }
                        else if (f <= 2) {
                            nf = 2;
                        }
                        else if (f <= 5) {
                            nf = 5;
                        }
                    }
                    return (nf * Math.pow(10.0, exp));
                };
                _ColorScaleLegend.itemSize = 20; // width or height of
                _ColorScaleLegend.marginText = 4;
                return _ColorScaleLegend;
            }());
            var _ColorSpline = /** @class */ (function () {
                function _ColorSpline(clrs) {
                    this._clrs = clrs;
                    var len = clrs.length;
                    var ps = [];
                    var rs = [];
                    var gs = [];
                    var bs = [];
                    for (var i = 0; i < len; i++) {
                        var clr = clrs[i];
                        var p = i / (len - 1);
                        ps.push(p);
                        rs.push(clr.r);
                        gs.push(clr.g);
                        bs.push(clr.b);
                    }
                    this._rsp = new _Spline(ps, rs);
                    this._gsp = new _Spline(ps, gs);
                    this._bsp = new _Spline(ps, bs);
                }
                _ColorSpline.prototype.interpolate = function (val) {
                    val = wijmo.clamp(val, 0, 1);
                    var r = this._rsp.calculate(val);
                    var g = this._gsp.calculate(val);
                    var b = this._bsp.calculate(val);
                    return wijmo.Color.fromRgba(r, g, b);
                };
                return _ColorSpline;
            }());
            var _Spline = /** @class */ (function () {
                function _Spline(x, y, num) {
                    // 
                    this.k = 0.002;
                    this._a = [];
                    this._b = [];
                    this._c = [];
                    this._d = [];
                    //  T^3     -1     +3    -3    +1     /
                    //  T^2     +2     -5     4    -1    /
                    //  T^1     -1      0     1     0   /  2
                    //  T^0      0      2     0     0  /
                    this.m = [
                        [-1 * 0.5, +3 * 0.5, -3 * 0.5, +1 * 0.5],
                        [+2 * 0.5, -5 * 0.5, +4 * 0.5, -1 * 0.5],
                        [-1 * 0.5, 0, +1 * 0.5, 0],
                        [0, +2 * 0.5, 0, 0],
                    ];
                    this._x = x;
                    this._y = y;
                    var len = this._len = num ? num : Math.min(x.length, y.length);
                    if (len > 3) {
                        for (var i = 0; i < len - 1; i++) {
                            var p1 = (i == 0) ? new wijmo.Point(x[i], y[i]) : new wijmo.Point(x[i - 1], y[i - 1]);
                            var p2 = new wijmo.Point(x[i], y[i]);
                            var p3 = new wijmo.Point(x[i + 1], y[i + 1]);
                            var p4 = (i == len - 2) ? new wijmo.Point(x[i + 1], y[i + 1]) : new wijmo.Point(x[i + 2], y[i + 2]);
                            var a = new wijmo.Point();
                            var b = new wijmo.Point();
                            var c = new wijmo.Point();
                            var d = new wijmo.Point();
                            a.x = p1.x * this.m[0][0] + p2.x * this.m[0][1] + p3.x * this.m[0][2] + p4.x * this.m[0][3];
                            b.x = p1.x * this.m[1][0] + p2.x * this.m[1][1] + p3.x * this.m[1][2] + p4.x * this.m[1][3];
                            c.x = p1.x * this.m[2][0] + p2.x * this.m[2][1] + p3.x * this.m[2][2] + p4.x * this.m[2][3];
                            d.x = p1.x * this.m[3][0] + p2.x * this.m[3][1] + p3.x * this.m[3][2] + p4.x * this.m[3][3];
                            a.y = p1.y * this.m[0][0] + p2.y * this.m[0][1] + p3.y * this.m[0][2] + p4.y * this.m[0][3];
                            b.y = p1.y * this.m[1][0] + p2.y * this.m[1][1] + p3.y * this.m[1][2] + p4.y * this.m[1][3];
                            c.y = p1.y * this.m[2][0] + p2.y * this.m[2][1] + p3.y * this.m[2][2] + p4.y * this.m[2][3];
                            d.y = p1.y * this.m[3][0] + p2.y * this.m[3][1] + p3.y * this.m[3][2] + p4.y * this.m[3][3];
                            this._a.push(a);
                            this._b.push(b);
                            this._c.push(c);
                            this._d.push(d);
                        }
                    }
                }
                _Spline.prototype.calculate = function (val) {
                    val = val * (this._len - 1);
                    var i = Math.floor(val);
                    if (i < 0) {
                        i = 0;
                    }
                    if (i > this._len - 2) {
                        i = this._len - 2;
                    }
                    var d = val - i;
                    var x = ((this._a[i].x * d + this._b[i].x) * d + this._c[i].x) * d + this._d[i].x;
                    var y = ((this._a[i].y * d + this._b[i].y) * d + this._c[i].y) * d + this._d[i].y;
                    return y;
                };
                return _Spline;
            }());
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            /**
             * A control for visualization geographical data.
             */
            var FlexMap = /** @class */ (function (_super) {
                __extends(FlexMap, _super);
                /**
                 * Initializes a new instance of the {@link FlexMap} class.
                 *
                 * @param options A JavaScript object containing initialization data
                 * for the layer.
                 */
                function FlexMap(element, options) {
                    var _this = _super.call(this, element, null, true) || this;
                    _this._layers = new wijmo.collections.ObservableArray();
                    _this._center = new wijmo.Point();
                    _this._zoom = 1;
                    _this._zoomStep = 0.5;
                    _this._offset = new wijmo.Point();
                    _this._proj = new MercatorProjection();
                    //_proj = new AlbersProjection();
                    _this._touchStartH = _this._touchStart.bind(_this);
                    _this._touchMoveH = _this._touchMove.bind(_this);
                    _this._touchEndH = _this._touchEnd.bind(_this);
                    _this._touchCancelH = _this._touchCancel.bind(_this);
                    _this._mouseWheelH = _this._mouseWheel.bind(_this);
                    _this._handleTouch = false;
                    var host = _this.hostElement;
                    // add classes to host element
                    _this.applyTemplate('wj-control wj-flexchart wj-flexmap', null, null);
                    _this._currentRenderEngine = new map._SvgMapRenderEngine(host);
                    var div = wijmo.createElement('<div></div>', null, { position: 'relative' });
                    _this._overlay = wijmo.createElement('<div></div>', div, { position: 'absolute', left: '90%', bottom: '90%' });
                    var btnZoomIn = wijmo.createElement('<button class="wj-btn"><span class="wj-glyph-plus"></span></button>', _this._overlay);
                    btnZoomIn.addEventListener('click', function () { return _this.zoom += _this._zoomStep; });
                    var btnZoomOut = wijmo.createElement('<button class="wj-btn"><span class="wj-glyph-minus"></span></button>', _this._overlay);
                    btnZoomOut.addEventListener('click', function () { return _this.zoom -= _this._zoomStep; });
                    wijmo.addClass(host, 'wj-flexchart-touch-disabled');
                    host.appendChild(div);
                    _this._legend = new wijmo.chart.Legend(_this);
                    _this._legend.position = wijmo.chart.Position.None;
                    _this._tooltip = new wijmo.chart.ChartTooltip();
                    _this.tooltip.content = null;
                    var self = _this;
                    _this.layers.collectionChanged.addHandler(function () {
                        _this.layers.forEach(function (layer) { return layer.map = self; });
                        _this.invalidate();
                    });
                    _this.addEventListener(host, 'click', function (evt) {
                        if (self.isDisabled) {
                            return;
                        }
                        var tip = self._tooltip;
                        var tc = tip.content;
                        if (tc && self.isTouching) {
                            self._updateTooltip(tip, evt);
                        }
                    });
                    _this.addEventListener(host, 'mousedown', function (e) {
                        if (self.isDisabled) {
                            return;
                        }
                        if (e.button == 0) { // left button only
                            _this.focus();
                            _this._dragStart = new wijmo.Point(e.pageX, e.pageY);
                            _this._hideToolTip();
                        }
                    });
                    _this.addEventListener(host, 'mousemove', function (e) {
                        if (self.isDisabled) {
                            return;
                        }
                        if (self._dragStart) {
                            var p0 = _this.convertBack(_this._toControl(self._dragStart));
                            var p1 = _this.convertBack(_this._toControl(e));
                            _this.center = new wijmo.Point(_this.center.x - p1.x + p0.x, _this.center.y - p1.y + p0.y);
                            _this._dragStart = new wijmo.Point(e.pageX, e.pageY);
                        }
                        else {
                            var tip = self._tooltip;
                            var tc = tip.content;
                            if (tc && !self.isTouching) {
                                self._updateTooltip(tip, e);
                            }
                        }
                    });
                    _this.addEventListener(host, 'mouseup', function (e) {
                        _this._dragStart = null;
                    });
                    _this.addEventListener(host, 'mouseleave', function (e) {
                        if (e.target == self.hostElement) {
                            _this._dragStart = null;
                            self._hideToolTip();
                        }
                    });
                    _this.addEventListener(host, 'touchstart', _this._touchStartH);
                    _this.addEventListener(host, 'touchmove', _this._touchMoveH);
                    _this.addEventListener(host, 'touchcancel', _this._touchCancelH);
                    _this.addEventListener(host, 'touchend', _this._touchEndH);
                    _this.addEventListener(host, 'wheel', _this._mouseWheelH);
                    // apply options only after chart is fully initialized
                    _this.initialize(options);
                    // refresh control to show current state
                    _this.refresh();
                    return _this;
                }
                Object.defineProperty(FlexMap.prototype, "layers", {
                    /**
                     * Gets the collection of map layers.
                     */
                    get: function () {
                        return this._layers;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexMap.prototype, "center", {
                    /**
                     * Gets or sets the map center in geo coordinates.
                     */
                    get: function () {
                        return this._center;
                    },
                    set: function (center) {
                        if (this._center != center) {
                            this._center = center;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexMap.prototype, "zoom", {
                    /**
                     * Gets or sets the map zoom level.
                     */
                    get: function () {
                        return this._zoom;
                    },
                    set: function (value) {
                        if (value < 1) {
                            value = 1;
                        }
                        if (this._zoom != value) {
                            this._zoom = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexMap.prototype, "tooltip", {
                    /**
                     * Gets the map tooltip.
                     */
                    get: function () {
                        return this._tooltip;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Converts the specified point from geo coordinates to control's coordinates.
                 *
                 * @param pt point in geo coordinates.
                 */
                FlexMap.prototype.convert = function (pt) {
                    return this._convertMercator(pt);
                };
                /**
                 * Converts the specified point from control's coordinates to geo coordinates.
                 *
                 * @param pt point in control's coordinates.
                 */
                FlexMap.prototype.convertBack = function (pt) {
                    return this._convertMercatorBack(pt);
                };
                /** Gets hit test information about specified point. The point can be specified as mouse event object.  */
                FlexMap.prototype.hitTest = function (pt, y) {
                    // control coords
                    var cpt = this._toControl(pt, y);
                    var hti = new map.MapHitTestInfo();
                    if (wijmo.chart.FlexChartBase._contains(this._rectHeader, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Header;
                    }
                    else if (wijmo.chart.FlexChartBase._contains(this._rectFooter, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Footer;
                    }
                    else if (wijmo.chart.FlexChartBase._contains(this._rectLegend, cpt)) {
                        hti._chartElement = wijmo.chart.ChartElement.Legend;
                    }
                    else if (wijmo.chart.FlexChartBase._contains(this._rectChart, cpt)) {
                        var el = void 0;
                        if (pt instanceof MouseEvent) {
                            el = document.elementFromPoint(pt.x, pt.y);
                        }
                        else {
                            var off = this._getHostOffset();
                            el = document.elementFromPoint(off.x + cpt.x, off.y + cpt.y);
                        }
                        var id = el.getAttribute('wj-map:id');
                        if (id != null) {
                            hti._item = this._getItemById(id);
                        }
                    }
                    return hti;
                };
                /**
                 * Zooms map to the specified rectangle in data coordinates.
                 *
                 * @param rect rectangle in geo coordinates.
                 */
                FlexMap.prototype.zoomTo = function (rect) {
                    var maxY = this._proj.maxY;
                    var top = Math.max(rect.top, -maxY);
                    var bottom = Math.min(rect.bottom, maxY);
                    var p1 = this.convert(new wijmo.Point(rect.left, top));
                    var p2 = this.convert(new wijmo.Point(rect.right, bottom));
                    var p = new wijmo.Point(0.5 * (p1.x + p2.x), 0.5 * (p1.y + p2.y));
                    this.center = this.convertBack(p);
                    p1 = this.convert(new wijmo.Point(rect.left, top));
                    p2 = this.convert(new wijmo.Point(rect.right, bottom));
                    var sc1 = this._mapRect.width / Math.abs(p2.x - p1.x);
                    var sc2 = this._mapRect.height / Math.abs(p2.y - p1.y);
                    this.zoom *= this.zoom + Math.log(Math.min(sc1, sc2)) * Math.LOG2E;
                };
                FlexMap.prototype.invalidate = function (fullUpdate) {
                    if (fullUpdate) {
                        this.layers.forEach(function (layer) {
                            if (layer._clearCache) {
                                layer._clearCache();
                            }
                        });
                    }
                    _super.prototype.invalidate.call(this, fullUpdate);
                };
                FlexMap.prototype._renderChart = function (engine, rect, applyElement) {
                    this.onRendering(new wijmo.chart.RenderEventArgs(engine));
                    var w = rect.width;
                    var h = rect.height;
                    //this._tmGroup = 
                    var margins = this._parseMargin(this.plotMargin);
                    var def_marg = 8;
                    if (isNaN(margins.left)) {
                        margins.left = def_marg;
                    }
                    if (isNaN(margins.right)) {
                        margins.right = def_marg;
                    }
                    if (isNaN(margins.top)) {
                        margins.top = def_marg;
                    }
                    if (isNaN(margins.bottom)) {
                        margins.bottom = def_marg;
                    }
                    rect.top += margins.top;
                    h = rect.height - (margins.top + margins.bottom);
                    rect.height = h > 0 ? h : 24;
                    rect.left += margins.left;
                    w = rect.width - (margins.left + margins.right);
                    rect.width = w > 0 ? w : 24;
                    var mapRectId = 'mapRect' + (1000000 * Math.random()).toFixed();
                    engine.addClipRect(rect, mapRectId);
                    var g = engine.startGroup(null, mapRectId, true);
                    this._mapRect = rect.clone(); //.inflate(-4, -4);
                    var sz = this._size = 0.5 * Math.min(rect.width, rect.height);
                    this._offset.x = this._mapRect.left;
                    this._offset.y = this._mapRect.top;
                    if (rect.width > 2 * sz) {
                        this._offset.x = 0.5 * rect.width - sz + this._mapRect.left;
                    }
                    else if (rect.height > 2 * this._size) {
                        this._offset.y = 0.5 * rect.height - sz + this._mapRect.top;
                    }
                    var sc = Math.pow(2, this.zoom);
                    var p0 = this._proj.convert(this.center);
                    p0.x = p0.x * sc * sz - sz;
                    p0.y = p0.y * sc * sz - sz;
                    this._offset.x -= p0.x;
                    this._offset.y -= p0.y;
                    //this._plotRect = rect;
                    engine.precision = 6;
                    for (var i = 0; i < this.layers.length; i++) {
                        var sw = 1 / (sc * sz);
                        engine.scale = sw;
                        var t = engine.element.createSVGTransform();
                        var m = engine.element.createSVGMatrix();
                        m.a = m.d = sc * sz;
                        m.b = m.c = 0;
                        m.e = this._offset.x;
                        m.f = this._offset.y;
                        t.setMatrix(m);
                        this.layers[i].render(engine, t, g);
                    }
                    ;
                    engine.endGroup();
                    var b = this._rectChart.bottom - this._mapRect.bottom;
                    this._overlay.style.left = (this._mapRect.right - 80).toString() + 'px';
                    this._overlay.style.bottom = b.toString() + 'px';
                    this.onRendered(new wijmo.chart.RenderEventArgs(engine));
                };
                FlexMap.prototype._getDesiredLegendSize = function (e, isVert, w, h) {
                    var sz = new wijmo.Size();
                    for (var i = 0; i < this.layers.length; i++) {
                        var l = this.layers[i];
                        if (l.colorScale) {
                            if (l.getAllFeatures) {
                                l.colorScale.domain(l.getAllFeatures());
                            }
                            else {
                                l.colorScale.domain(l.itemsSource);
                            }
                            var sz0 = l.colorScale._measureLegend(e, isVert, w, h);
                            if (sz0 && sz0.width && sz0.height) {
                                sz = sz0;
                            }
                        }
                    }
                    return sz;
                };
                FlexMap.prototype._renderLegend = function (e, pt, areas, isVert, w, h) {
                    var rect = new wijmo.Rect(pt.x, pt.y, w, h);
                    this.layers.forEach(function (l) {
                        if (l.colorScale) {
                            l.colorScale._drawLegend(e, rect, isVert);
                        }
                    });
                };
                FlexMap.prototype._copy = function (key, value) {
                    if (key == 'layers') {
                        this.layers.clear();
                        var arr = wijmo.asArray(value);
                        for (var i = 0; i < arr.length; i++) {
                            this.layers.push(arr[i]);
                        }
                        return true;
                    }
                    return false;
                };
                FlexMap.prototype._updateTooltip = function (tip, evt) {
                    var content = tip.content;
                    if (content) {
                        var el = document.elementFromPoint(evt.x, evt.y);
                        var id = el ? el.getAttribute('wj-map:id') : null;
                        if (id != null) {
                            var f = this._getItemById(id);
                            if (f) {
                                if (wijmo.isFunction(content)) {
                                    content = content(f);
                                }
                                content = wijmo.format(content, f);
                            }
                        }
                        else {
                            content = null;
                        }
                    }
                    if (content && content.trim().length > 0) {
                        this._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    }
                    else {
                        this._hideToolTip();
                    }
                };
                FlexMap.prototype._getItemById = function (id) {
                    for (var i = 0; i < this.layers.length; i++) {
                        var layer = this.layers[i];
                        if (layer._getFeatureById) {
                            var f = layer._getFeatureById(id);
                            if (f) {
                                return f.properties;
                            }
                        }
                        else if (layer.getItemById) {
                            var f = layer.getItemById(id);
                            if (f) {
                                return f;
                            }
                        }
                    }
                    return null;
                };
                FlexMap.prototype._convertMercator = function (pt) {
                    var sc = Math.pow(2, this.zoom) * this._size;
                    var proj = this._proj;
                    var p = proj.convert(pt);
                    p.x *= sc;
                    p.y *= sc;
                    p.x += this._offset.x; // - p0.x;
                    p.y += this._offset.y; // - p0.y;
                    return p;
                };
                FlexMap.prototype._convertMercatorBack = function (pt) {
                    var sc = Math.pow(2, this.zoom) * this._size;
                    var proj = this._proj;
                    var p = pt.clone();
                    p.x -= this._offset.x;
                    p.y -= this._offset.y;
                    p.x /= sc;
                    p.y /= sc;
                    p = proj.convertBack(p);
                    return p;
                };
                FlexMap.prototype._touchStart = function (e) {
                    if (this.isDisabled) {
                        return;
                    }
                    switch (e.touches.length) {
                        case 1:
                            this._handleTouch = true;
                            this._dragStart = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);
                            break;
                        case 2:
                            this._dragStart = null;
                            this._handleTouch = true;
                            this._touch1 = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);
                            this._touch2 = new wijmo.Point(e.touches[1].pageX, e.touches[1].pageY);
                            break;
                    }
                    if (this._handleTouch) {
                        this._hideToolTip();
                    }
                };
                FlexMap.prototype._touchMove = function (e) {
                    if (this.isDisabled) {
                        return;
                    }
                    if (this._handleTouch) {
                        e.preventDefault();
                    }
                    if (this._dragStart) {
                        var p0 = this.convertBack(this._toControl(this._dragStart));
                        var p1 = this.convertBack(this._toControl(e.touches[0].pageX, e.touches[0].pageY));
                        this.center = new wijmo.Point(this.center.x - p1.x + p0.x, this.center.y - p1.y + p0.y);
                        this._dragStart = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);
                        ;
                    }
                    else if (this._touch1 && this._touch2) {
                        var touch1 = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);
                        var touch2 = new wijmo.Point(e.touches[1].pageX, e.touches[1].pageY);
                        var d0 = this._dist(this._touch1, this._touch2);
                        var d1 = this._dist(touch1, touch2);
                        if (Math.abs(d1 - d0) > 1) {
                            this.zoom += Math.log2(d1 / d0);
                            this._touch1 = touch1;
                            this._touch2 = touch2;
                        }
                    }
                };
                FlexMap.prototype._dist = function (p1, p2) {
                    var dx = p1.x - p2.x;
                    var dy = p1.y - p2.y;
                    return Math.sqrt(dx * dx + dy * dy);
                };
                FlexMap.prototype._touchEnd = function (e) {
                    this._handleTouch = false;
                    this._dragStart = this._touch1 = this._touch2 = null;
                };
                FlexMap.prototype._touchCancel = function (e) {
                    this._handleTouch = false;
                    this._dragStart = this._touch1 = this._touch2 = null;
                };
                FlexMap.prototype._mouseWheel = function (e) {
                    if (this.isDisabled) {
                        return;
                    }
                    e.preventDefault();
                    this._hideToolTip();
                    var delta = -e.deltaY;
                    delta = delta > 0 ? 0.1 : -0.1;
                    this.zoom += delta;
                };
                return FlexMap;
            }(wijmo.chart.FlexChartBase));
            map.FlexMap = FlexMap;
            var MercatorProjection = /** @class */ (function () {
                function MercatorProjection() {
                    this.maxY = (2 * Math.atan(Math.exp(Math.PI)) - 0.5 * Math.PI) / M.toRadians;
                }
                MercatorProjection.prototype.convert = function (pt) {
                    var x = this._convertX(pt.x);
                    var y = Math.abs(pt.y) > this.maxY ? (pt.y > 0 ? 1 : -1) * this.maxY : pt.y;
                    y = this._convertY(y);
                    return new wijmo.Point(x, y);
                };
                MercatorProjection.prototype.convertBack = function (pt) {
                    var x = this._convertBackX(pt.x);
                    var y = this._convertBackY(pt.y);
                    return new wijmo.Point(x, y);
                };
                MercatorProjection.prototype._convertX = function (x) {
                    return (x * M.toRadians + Math.PI) / M.pi2;
                };
                MercatorProjection.prototype._convertBackX = function (x) {
                    return (x * M.pi2 - Math.PI) / M.toRadians;
                };
                MercatorProjection.prototype._convertY = function (y) {
                    return (Math.PI + Math.log(Math.tan(M.pi4 - 0.5 * y * M.toRadians))) / M.pi2;
                };
                MercatorProjection.prototype._convertBackY = function (y) {
                    return -(2 * Math.atan(Math.exp(y * M.pi2 - Math.PI)) - 0.5 * Math.PI) / M.toRadians;
                };
                return MercatorProjection;
            }());
            /*class AlbersProjection {
                maxY = 90;
            
                lat1 = 20;
                lat2 = 50;
                lat0 = 0;
                lon0 = 0;
            
                R = 0.25;
            
                public convert(pt: Point): Point {
                    let n = 0.5 * (Math.sin(this.lat1 * M.toRadians) + Math.sin(this.lat2 * M.toRadians));
                    let a = n * (pt.x - this.lon0);
                    let c = Math.cos(this.lat1 * M.toRadians) * Math.cos(this.lat1 * M.toRadians) + 2 * n * Math.sin(this.lat1 * M.toRadians);
                    let r = this.R / n * Math.sqrt(c - 2 * n * Math.sin(pt.y * M.toRadians));
                    let r0 = this.R / n * Math.sqrt(c - 2 * n * Math.sin(this.lat0 * M.toRadians));
            
                    let x = r * Math.sin(a * M.toRadians);
                    let y = this.R - r0 + r * Math.cos(a * M.toRadians);
            
                    return new Point(x, y);
                }
            
                public convertBack(pt: Point): Point {
                    let n = 0.5 * (Math.sin(this.lat1 * M.toRadians) + Math.sin(this.lat2 * M.toRadians));
                    let a = n * (pt.x - this.lon0);
                    let c = Math.cos(this.lat1 * M.toRadians) * Math.cos(this.lat1 * M.toRadians) + 2 * n * Math.sin(this.lat1 * M.toRadians);
                    // let r = this.R / n * Math.sqrt(c - 2 * n * Math.sin(pt.y * M.toRadians));
                    let r0 = this.R / n * Math.sqrt(c - 2 * n * Math.sin(this.lat0 * M.toRadians));
            
                    let r = Math.sqrt(pt.x * pt.x + (r0 - pt.y) * (r0 - pt.y));
                    let eta = Math.atan(pt.x / (r0 - pt.y));
            
                    let lat = Math.asin((c - r * r * n * n) / 2 / n);
                    let lon = this.lon0 + eta / n;
            
                    return new Point(lon, lat);
                }
            }*/
            var M = /** @class */ (function () {
                function M() {
                }
                M.toRadians = Math.PI / 180;
                M.pi4 = 0.25 * Math.PI;
                M.pi2 = 2 * Math.PI;
                return M;
            }());
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            /** Base class for map layers. */
            var MapLayerBase = /** @class */ (function () {
                function MapLayerBase() {
                    /**
                     * Occurs after the layer has been bound to a new items source.
                     */
                    this.itemsSourceChanged = new wijmo.Event();
                }
                Object.defineProperty(MapLayerBase.prototype, "map", {
                    /** Gets the parent map */
                    get: function () {
                        return this._map;
                    },
                    set: function (value) {
                        this._map = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapLayerBase.prototype, "style", {
                    /** Gets or sets the layer's style. */
                    get: function () {
                        return this._style;
                    },
                    set: function (value) {
                        if (this._style != value) {
                            this._style = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapLayerBase.prototype, "itemsSource", {
                    /**
                     * Gets or sets a data source for the layer.
                     *
                     * Data source should be GeoJSON object(s).
                     */
                    get: function () {
                        return this._items;
                    },
                    set: function (value) {
                        this._setItems(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the {@link itemsSourceChanged} event.
                 */
                MapLayerBase.prototype.onItemsSourceChanged = function (e) {
                    this.itemsSourceChanged.raise(this, e);
                };
                Object.defineProperty(MapLayerBase.prototype, "url", {
                    /** Get or sets the data source url. */
                    get: function () {
                        return this._url;
                    },
                    set: function (value) {
                        if (this._url != value) {
                            this._url = wijmo.asString(value, true);
                            this._loadUrl();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapLayerBase.prototype, "colorScale", {
                    /**
                     * Gets or sets color scale used for fill layer's items.
                     */
                    get: function () {
                        return this._colorScale;
                    },
                    set: function (value) {
                        if (this._colorScale != value) {
                            this._colorScale = value;
                            this._clearCache();
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                MapLayerBase.prototype.render = function (e, t, g) { };
                ;
                MapLayerBase.prototype.invalidate = function () {
                    if (this.map) {
                        this.map.invalidate();
                    }
                };
                /**
                 * Initializes the series by copying the properties from a given object.
                 *
                 * @param options JavaScript object containing initialization data for the series.
                 */
                MapLayerBase.prototype.initialize = function (options) {
                    wijmo.copy(this, options);
                };
                MapLayerBase.prototype._applyStyle = function (e) {
                    if (this.style) {
                        e.fill = this.style.fill;
                        e.stroke = this.style.stroke;
                        e.strokeWidth = this.style.strokeWidth;
                    }
                };
                MapLayerBase.prototype._clearCache = function () {
                };
                MapLayerBase.prototype._loadUrl = function () {
                    var _this = this;
                    if (this.url) {
                        // error handling ?
                        wijmo.httpRequest(this.url, {
                            success: function (xhr) { return _this.itemsSource = JSON.parse(xhr.responseText); }
                        });
                    }
                    else {
                        this.itemsSource = null;
                    }
                };
                MapLayerBase.prototype._setItems = function (value) {
                    if (this._items != value) {
                        this._clearCache();
                        this._items = value;
                        this.onItemsSourceChanged(new wijmo.EventArgs());
                        this.invalidate();
                    }
                };
                return MapLayerBase;
            }());
            map.MapLayerBase = MapLayerBase;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map_1) {
            'use strict';
            /**
             * Represents scatter map layer.
             *
             * The data for {@link ScatterMapLayer} is a collection of points in geographical coordinates.
             */
            var ScatterMapLayer = /** @class */ (function (_super) {
                __extends(ScatterMapLayer, _super);
                /**
                 * Initializes a new instance of the {@link ScatterMapLayer} class.
                 *
                 * @param options A JavaScript object containing initialization data
                 * for the layer.
                 */
                function ScatterMapLayer(options) {
                    var _this = _super.call(this) || this;
                    _this._symbolSize = 5;
                    _this._symbolMinSize = 5;
                    _this._symbolMaxSize = 50;
                    _this._index = 0;
                    _this._prefix = '_';
                    _this._elMap = {};
                    _this._hasBindings = false;
                    _this.style = { stroke: 'grey', strokeWidth: 0.5, fill: 'transparent' };
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(ScatterMapLayer.prototype, "symbolSize", {
                    /**
                     * Gets or sets the symbol size.
                     */
                    get: function () {
                        return this._symbolSize;
                    },
                    set: function (value) {
                        if (this._symbolSize != value) {
                            this._symbolSize = wijmo.asNumber(value);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScatterMapLayer.prototype, "symbolMinSize", {
                    /**
                     * Gets or sets the minimal symbol size.
                     *
                     * For bubble plot.
                     */
                    get: function () {
                        return this._symbolMinSize;
                    },
                    set: function (value) {
                        if (this._symbolMinSize != value) {
                            this._symbolMinSize = wijmo.asNumber(value);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScatterMapLayer.prototype, "symbolMaxSize", {
                    /**
                     * Gets or sets the maximal symbol size.
                     *
                     * For bubble plot.
                     */
                    get: function () {
                        return this._symbolMaxSize;
                    },
                    set: function (value) {
                        if (this._symbolMaxSize != value) {
                            this._symbolMaxSize = wijmo.asNumber(value);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScatterMapLayer.prototype, "itemsSource", {
                    /**
                     * Gets or sets a data source for the layer.
                     *
                     * Data source should be a collection of objects that provides geographical coordinates (longitude and latitude).
                     * Object property or properties which contains coordinates are specified by {@link binding} property.
                     */
                    get: function () {
                        return this._items;
                    },
                    set: function (value) {
                        this._setItems(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ScatterMapLayer.prototype, "binding", {
                    /**
                     * Gets or sets the binding for the layer.
                     *
                     * The binding can include two comma-separated property names (longitude and latitude) 'lon,lat'
                     * or a single property name that contain a pair of geographical coordinates.
                     */
                    get: function () {
                        return this._binding;
                    },
                    set: function (value) {
                        if (this._binding != value) {
                            this._binding = wijmo.asString(value, true);
                            this.parseBindings();
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Renders the layer.
                 *
                 * @param e Render engine.
                 * @param t Svg transformation.
                 * @param group SVG group element for the layer.
                 */
                ScatterMapLayer.prototype.render = function (e, t, group) {
                    this._elMap = {};
                    this._index = 0;
                    this._prefix = this.map.layers.indexOf(this).toString() + '_';
                    var g = e.startGroup();
                    var map = this.map;
                    var r = this.map._mapRect;
                    this._applyStyle(e);
                    var items = this.itemsSource;
                    var len = items ? items.length : 0;
                    var xBnd = this._xBnd;
                    var yBnd = this._yBnd;
                    var cBnd = this._cBnd;
                    var szBnd = this._szBnd;
                    if (szBnd) {
                        this._szRange = map_1._Utils.getRange(items, szBnd);
                    }
                    var scale = this.colorScale;
                    if (scale) {
                        scale.domain(items);
                    }
                    if ((xBnd && yBnd) || cBnd) {
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (item) {
                                var pos = this.getItemPos(item);
                                if (pos) {
                                    if (scale) {
                                        e.fill = scale.convert(scale.getValue(item));
                                    }
                                    this.renderItem(e, item, pos.x, pos.y);
                                }
                            }
                            this._index++;
                        }
                    }
                    e.endGroup();
                    return g;
                };
                ScatterMapLayer.prototype.renderItem = function (e, item, x, y) {
                    if (wijmo.isNumber(x) && wijmo.isNumber(y)) {
                        var pt = this.map.convert(new wijmo.Point(x, y));
                        if (isFinite(pt.x) && isFinite(pt.y)) {
                            var sz = this.symbolSize;
                            if (this._szRange) {
                                var val = this._szBnd.getValue(item);
                                val = Math.sqrt((val - this._szRange.min) / this._szRange.range);
                                sz = this.symbolMinSize + (this.symbolMaxSize - this.symbolMinSize) * val;
                            }
                            if (isFinite(sz)) {
                                var el = e.drawEllipse(pt.x, pt.y, 0.5 * sz, 0.5 * sz);
                                el.setAttribute('vector-effect', 'non-scaling-stroke');
                                var id = this.createId();
                                this.setId(el, id);
                                this._elMap[id] = el;
                            }
                        }
                    }
                };
                ScatterMapLayer.prototype.getItemById = function (id) {
                    var items = this.itemsSource;
                    if (items) {
                        var el = this._elMap[id];
                        if (el) {
                            var i = parseInt(id.split('_')[1]);
                            if (wijmo.isNumber(i) && i < items.length) {
                                return items[i];
                            }
                        }
                    }
                    return null;
                };
                /**
                 * Gets the layer bounds in geo coordinates.
                 */
                ScatterMapLayer.prototype.getGeoBBox = function () {
                    var items = this.itemsSource;
                    var len = items ? items.length : 0;
                    if (this._hasBindings) {
                        var xmin = NaN, xmax = NaN, ymin = NaN, ymax = NaN;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (item) {
                                var pos = this.getItemPos(item);
                                if (pos) {
                                    if (isFinite(pos.x)) {
                                        if (isNaN(xmin) || pos.x < xmin) {
                                            xmin = pos.x;
                                        }
                                        if (isNaN(xmax) || pos.x > xmax) {
                                            xmax = pos.x;
                                        }
                                    }
                                    if (isFinite(pos.y)) {
                                        if (isNaN(ymin) || pos.y < ymin) {
                                            ymin = pos.y;
                                        }
                                        if (isNaN(ymax) || pos.y > ymax) {
                                            ymax = pos.y;
                                        }
                                    }
                                }
                            }
                        }
                        if (!isNaN(xmin) && !isNaN(ymin)) {
                            return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                    }
                    return null;
                };
                ScatterMapLayer.prototype.getItemPos = function (item) {
                    var xBnd = this._xBnd;
                    var yBnd = this._yBnd;
                    var cBnd = this._cBnd;
                    if (cBnd) {
                        var xy = cBnd.getValue(item);
                        if (xy) {
                            var vals = xy.split(',');
                            if (vals && vals.length >= 2) {
                                var x = parseFloat(vals[0]);
                                var y = parseFloat(vals[1]);
                                if (isFinite(x) && isFinite(y)) {
                                    return new wijmo.Point(x, y);
                                }
                            }
                        }
                    }
                    else {
                        var x = xBnd.getValue(item);
                        var y = yBnd.getValue(item);
                        if (wijmo.isString(x)) {
                            x = parseFloat(x);
                        }
                        if (wijmo.isString(y)) {
                            y = parseFloat(y);
                        }
                        if (isFinite(x) && isFinite(y)) {
                            return new wijmo.Point(x, y);
                        }
                    }
                    return null;
                };
                ScatterMapLayer.prototype.setId = function (el, id) {
                    if (el && id) {
                        el.setAttribute('wj-map:id', id);
                    }
                };
                ScatterMapLayer.prototype.createId = function () {
                    return this._prefix + this._index.toString();
                };
                ScatterMapLayer.prototype.parseBindings = function () {
                    var binding = this.binding;
                    this._xBnd = this._yBnd = this._szBnd = null;
                    this._hasBindings = false;
                    if (binding) {
                        var binds = binding.split(',');
                        if (binds.length == 1) {
                            this._cBnd = new wijmo.Binding(binds[0].trim());
                            this._hasBindings = true;
                        }
                        else if (binds.length >= 2) {
                            this._xBnd = new wijmo.Binding(binds[0].trim());
                            this._yBnd = new wijmo.Binding(binds[1].trim());
                            this._hasBindings = true;
                            if (binds.length >= 3) {
                                this._szBnd = new wijmo.Binding(binds[2].trim());
                            }
                        }
                    }
                };
                return ScatterMapLayer;
            }(map_1.MapLayerBase));
            map_1.ScatterMapLayer = ScatterMapLayer;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            var _GeoJsonRender = /** @class */ (function () {
                function _GeoJsonRender() {
                    this._map = {};
                    this._index = 0;
                    this.prefix = '_';
                    this.hasPoints = false;
                    this.symbolSize = 5;
                }
                _GeoJsonRender.prototype.convert = function (pt) {
                    if (this.converter) {
                        pt = this.converter.convert(pt);
                    }
                    return pt;
                };
                _GeoJsonRender.prototype.render = function (engine, geoJson, itemFormatter) {
                    if (itemFormatter === void 0) { itemFormatter = null; }
                    this._map = {};
                    this._index = 0;
                    this.hasPoints = false;
                    if (geoJson) {
                        switch (geoJson.type) {
                            case "Point":
                            case "MultiPoint":
                            case "LineString":
                            case "MultiLineString":
                            case "Polygon":
                            case "MultiPolygon":
                            case "GeometryCollection":
                                this.renderGeometry(engine, geoJson);
                                break;
                            case "Feature":
                                this.renderFeature(engine, geoJson, itemFormatter);
                                break;
                            case "FeatureCollection":
                                if (geoJson.features) {
                                    for (var i = 0; i < geoJson.features.length; i++) {
                                        this.renderFeature(engine, geoJson.features[i], itemFormatter);
                                    }
                                }
                                break;
                        }
                    }
                };
                _GeoJsonRender.prototype.renderFeature = function (engine, f, itemFormatter) {
                    if (itemFormatter === void 0) { itemFormatter = null; }
                    if (f && f.geometry) {
                        if (itemFormatter) {
                            itemFormatter(engine, f);
                        }
                        var id = this.createId();
                        this.renderGeometry(engine, f.geometry, id);
                        this._map[id] = f;
                        this._index++;
                    }
                };
                _GeoJsonRender.prototype.renderGeometry = function (engine, g, id) {
                    if (id === void 0) { id = null; }
                    if (g) {
                        switch (g.type) {
                            case "Point":
                                this.renderPoint(engine, g, id);
                                this.hasPoints = true;
                                break;
                            case "MultiPoint":
                                this.renderMultiPoint(engine, g, id);
                                this.hasPoints = true;
                                break;
                            case "LineString":
                                this.renderLineString(engine, g, id);
                                break;
                            case "MultiLineString":
                                this.renderMultiLineString(engine, g, id);
                                break;
                            case "Polygon":
                                this.renderPolygon(engine, g, id);
                                break;
                            case "MultiPolygon":
                                this.renderMultiPolygon(engine, g, id);
                                break;
                            case "GeometryCollection":
                                if (g.geometries) {
                                    for (var i = 0; i < g.geometries.length; i++) {
                                        this.renderGeometry(engine, g.geometries[i], id);
                                    }
                                }
                                break;
                        }
                    }
                };
                _GeoJsonRender.prototype.renderPoint = function (engine, point, id) {
                    if (id === void 0) { id = null; }
                    if (point && point.coordinates && point.coordinates.length >= 2) {
                        var pt = new wijmo.Point(point.coordinates[0], point.coordinates[1]);
                        pt = this.convert(pt);
                        var sz = engine.scale * this.symbolSize;
                        var el = engine.drawEllipse(pt.x, pt.y, sz, sz);
                        el.setAttribute('vector-effect', 'non-scaling-stroke');
                        this.setAttribute(el, id);
                    }
                };
                _GeoJsonRender.prototype.renderMultiPoint = function (engine, multiPoint, id) {
                    if (id === void 0) { id = null; }
                    if (multiPoint && multiPoint.coordinates) {
                        var coords = multiPoint.coordinates;
                        var len = multiPoint.coordinates.length;
                        for (var i = 0; i < len; i++) {
                            var pt = new wijmo.Point(coords[i][0], coords[i][1]);
                            pt = this.convert(pt);
                            var sz = engine.scale * this.symbolSize;
                            var el = engine.drawEllipse(pt.x, pt.y, sz, sz);
                            this.setAttribute(el, id);
                        }
                    }
                };
                _GeoJsonRender.prototype.renderLineString = function (engine, lineString, id) {
                    if (id === void 0) { id = null; }
                    if (lineString && lineString.coordinates) {
                        var coords = lineString.coordinates;
                        var len = lineString.coordinates.length;
                        var xs = [];
                        var ys = [];
                        for (var i = 0; i < len; i++) {
                            var pt = new wijmo.Point(coords[i][0], coords[i][1]);
                            pt = this.convert(pt);
                            xs.push(pt.x);
                            ys.push(pt.y);
                        }
                        var el = engine.drawLines(xs, ys);
                        this.setAttribute(el, id);
                    }
                };
                _GeoJsonRender.prototype.renderMultiLineString = function (engine, multiLineString, id) {
                    if (id === void 0) { id = null; }
                    if (multiLineString && multiLineString.coordinates) {
                        var coords = multiLineString.coordinates;
                        var len = coords.length;
                        for (var i = 0; i < len; i++) {
                            var pts = coords[i];
                            var xs = [];
                            var ys = [];
                            for (var j = 0; j < pts.length; j++) {
                                var pt = new wijmo.Point(pts[j][0], pts[j][1]);
                                pt = this.convert(pt);
                                xs.push(pt.x);
                                ys.push(pt.y);
                            }
                            var el = engine.drawLines(xs, ys);
                            this.setAttribute(el, id);
                        }
                    }
                };
                _GeoJsonRender.prototype.renderMultiPolygon = function (e, o, id) {
                    if (id === void 0) { id = null; }
                    if (o && o.coordinates) {
                        var mcoords = o.coordinates;
                        var mlen = mcoords.length;
                        var e2 = e;
                        for (var i = 0; i < mlen; i++) {
                            var coords = mcoords[i];
                            var len = coords.length;
                            var pt = [];
                            for (var i_1 = 0; i_1 < 1; i_1++) {
                                var pts = coords[i_1];
                                var pt0 = [];
                                for (var j = 0; j < pts.length; j++) {
                                    var pt_1 = new wijmo.Point(pts[j][0], pts[j][1]);
                                    pt_1 = this.convert(pt_1);
                                    pt0.push(pt_1.x);
                                    pt0.push(pt_1.y);
                                }
                                pt.push(pt0);
                            }
                            var el = e2.drawPolygon2(null, pt);
                            this.setAttribute(el, id);
                        }
                    }
                };
                _GeoJsonRender.prototype.renderPolygon = function (e, o, id) {
                    if (id === void 0) { id = null; }
                    if (o && o.coordinates) {
                        var coords = o.coordinates;
                        var len = coords.length;
                        var e2 = e;
                        var pt = [];
                        for (var i = 0; i < len; i++) {
                            var pts = coords[i];
                            var pt0 = [];
                            for (var j = 0; j < pts.length; j++) {
                                var pt_2 = new wijmo.Point(pts[j][0], pts[j][1]);
                                pt_2 = this.convert(pt_2);
                                pt0.push(pt_2.x);
                                pt0.push(pt_2.y);
                            }
                            pt.push(pt0);
                        }
                        var el = e2.drawPolygon2(null, pt);
                        this.setAttribute(el, id);
                    }
                };
                _GeoJsonRender.prototype.getFeatureById = function (id) {
                    return this._map[id];
                };
                _GeoJsonRender.prototype.getAllFeatures = function (geoJson) {
                    var features = [];
                    if (geoJson) {
                        switch (geoJson.type) {
                            case "Feature":
                                features.push(geoJson);
                                break;
                            case "FeatureCollection":
                                if (geoJson.features) {
                                    for (var i = 0; i < geoJson.features.length; i++) {
                                        features.push(geoJson.features[i]);
                                    }
                                }
                                break;
                        }
                    }
                    return features;
                };
                _GeoJsonRender.prototype.getBBox = function (geoJson) {
                    var rect = null;
                    if (geoJson) {
                        switch (geoJson.type) {
                            case "Point":
                            case "MultiPoint":
                            case "LineString":
                            case "MultiLineString":
                            case "Polygon":
                            case "MultiPolygon":
                            case "GeometryCollection":
                                rect = this.getGeometryBBox(geoJson);
                                break;
                            case "Feature":
                                //this.renderFeature(engine, geoJson, itemFormatter);
                                rect = this.getGeometryBBox(geoJson.geometry);
                                break;
                            case "FeatureCollection":
                                if (geoJson.features) {
                                    for (var i = 0; i < geoJson.features.length; i++) {
                                        //this.renderFeature(engine, geoJson.features[i], itemFormatter);
                                        var nr = this.getGeometryBBox(geoJson.features[i].geometry, rect);
                                        if (nr) {
                                            rect = nr;
                                        }
                                    }
                                }
                                break;
                        }
                    }
                    return rect;
                };
                _GeoJsonRender.prototype.getGeometryBBox = function (g, rect0) {
                    var rect = null;
                    if (g) {
                        switch (g.type) {
                            case "Point":
                            case "MultiPoint":
                            case "LineString":
                            case "MultiLineString":
                            case "Polygon":
                            case "MultiPolygon":
                                {
                                    var gc = g.coordinates;
                                    var coords = this.flat(gc, 10); //gc.flat(4);
                                    rect = this.getRect(coords, rect0);
                                }
                                break;
                            case "GeometryCollection":
                                if (g.geometries) {
                                    for (var i = 0; i < g.geometries.length; i++) {
                                        rect = this.getGeometryBBox(g.geometries[i], rect0);
                                        if (rect) {
                                            rect0 = rect.clone();
                                        }
                                    }
                                }
                                break;
                        }
                    }
                    return rect;
                };
                _GeoJsonRender.prototype.getRect = function (coords, rect0) {
                    var rect = null;
                    if (coords) {
                        var xmin = NaN, xmax = NaN, ymin = NaN, ymax = NaN;
                        if (rect0) {
                            xmin = rect0.left;
                            xmax = rect0.right;
                            ymin = rect0.top;
                            ymax = rect0.bottom;
                        }
                        var len = coords.length / 2;
                        for (var i = 0; i < len; i++) {
                            var x = coords[2 * i];
                            var y = coords[2 * i + 1];
                            if (isNaN(xmin) || x < xmin) {
                                xmin = x;
                            }
                            if (isNaN(xmax) || x > xmax) {
                                xmax = x;
                            }
                            if (isNaN(ymin) || y < ymin) {
                                ymin = y;
                            }
                            if (isNaN(ymax) || y > ymax) {
                                ymax = y;
                            }
                        }
                        if (!isNaN(xmin) && !isNaN(ymin)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                    }
                    return rect;
                };
                _GeoJsonRender.prototype.setAttribute = function (el, id) {
                    if (el && id) {
                        el.setAttribute('wj-map:id', id);
                    }
                };
                _GeoJsonRender.prototype.createId = function () {
                    return this.prefix + this._index.toString();
                };
                _GeoJsonRender.prototype.flat = function (array, depth) {
                    if (array.flat) {
                        return array.flat(depth);
                    }
                    else {
                        var stack = array.slice();
                        var res = [];
                        while (stack.length) {
                            var next = stack.pop();
                            if (Array.isArray(next)) {
                                stack.push.apply(stack, next);
                            }
                            else {
                                res.push(next);
                            }
                        }
                        return res.reverse();
                    }
                };
                return _GeoJsonRender;
            }());
            map._GeoJsonRender = _GeoJsonRender;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            'use strict';
            /**
             * Represents a map layer with geographical data.
             */
            var GeoMapLayer = /** @class */ (function (_super) {
                __extends(GeoMapLayer, _super);
                /**
                 * Initializes a new instance of the {@link GeoMapLayer} class.
                 *
                 * @param options A JavaScript object containing initialization data
                 * for the layer.
                 */
                function GeoMapLayer(options) {
                    var _this = _super.call(this) || this;
                    _this._render = new map._GeoJsonRender();
                    _this._symbolSize = 5;
                    _this.style = { stroke: 'gray', fill: 'transparent', strokeWidth: 0.5 };
                    if (options) {
                        _this.initialize(options);
                    }
                    return _this;
                }
                Object.defineProperty(GeoMapLayer.prototype, "itemFormatter", {
                    /** Gets or sets a item formatter for GeoJSON feature. */
                    get: function () {
                        return this._ifmt;
                    },
                    set: function (value) {
                        if (this._ifmt != value) {
                            this._ifmt = wijmo.asFunction(value, true);
                            this._clearCache();
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets all GeoJSON features on the layer.
                 */
                GeoMapLayer.prototype.getAllFeatures = function () {
                    return this._render.getAllFeatures(this.itemsSource);
                };
                /**
                 * Renders the layer.
                 *
                 * @param e Render engine.
                 * @param t Svg transformation.
                 * @param group SVG group element for the layer.
                 */
                GeoMapLayer.prototype.render = function (e, t, group) {
                    if (this._render.hasPoints) {
                        this._clearCache();
                    }
                    var g = this._g;
                    if (!g) {
                        g = e.startGroup();
                        this._render.symbolSize = this.symbolSize;
                        this._render.converter = this.map._proj;
                        var scale_1 = this.colorScale;
                        if (scale_1) {
                            scale_1.domain(this.getAllFeatures());
                        }
                        this._applyStyle(e);
                        this._render.prefix = this.map.layers.indexOf(this).toString() + '_';
                        if (scale_1) {
                            this._render.render(e, this.itemsSource, function (e, f) {
                                e.fill = scale_1.convert(scale_1.getValue(f));
                            });
                        }
                        else {
                            this._render.render(e, this.itemsSource, this.itemFormatter);
                        }
                        e.endGroup();
                        this._g = g;
                    }
                    else {
                        group.appendChild(g);
                    }
                    if (g.transform.baseVal.numberOfItems == 0) {
                        g.transform.baseVal.appendItem(t);
                    }
                    else {
                        g.transform.baseVal.replaceItem(t, 0);
                    }
                    return g;
                };
                /**
                 * Gets the layer bounds in geo coordinates.
                 */
                GeoMapLayer.prototype.getGeoBBox = function (f) {
                    if (f) {
                        return this._render.getBBox(f);
                    }
                    else {
                        return this._render.getBBox(this.itemsSource);
                    }
                };
                Object.defineProperty(GeoMapLayer.prototype, "symbolSize", {
                    /**
                     * Gets or sets the symbol size for rendering GeoJSON points/multi-points.
                     */
                    get: function () {
                        return this._symbolSize;
                    },
                    set: function (value) {
                        if (this._symbolSize != value) {
                            this._symbolSize = wijmo.asNumber(value);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                GeoMapLayer.prototype._clearCache = function () {
                    this._g = null;
                };
                GeoMapLayer.prototype._getFeatureById = function (id) {
                    return this._render.getFeatureById(id);
                };
                return GeoMapLayer;
            }(map.MapLayerBase));
            map.GeoMapLayer = GeoMapLayer;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map_2) {
            'use strict';
            var GeoGridLayer = /** @class */ (function (_super) {
                __extends(GeoGridLayer, _super);
                function GeoGridLayer() {
                    var _this = _super.call(this) || this;
                    _this.style = { stroke: 'lightgrey', strokeWidth: 0.5, fill: 'lightgrey' };
                    return _this;
                }
                GeoGridLayer.prototype.render = function (e, t, group) {
                    var g = e.startGroup('wj-flexmap-geogrid');
                    var map = this.map;
                    var r = this.map._mapRect;
                    var cls = 'wj-label';
                    this._applyStyle(e);
                    for (var x_1 = -180; x_1 <= 180; x_1 += 30) {
                        var pt1 = map.convert(new wijmo.Point(x_1, -85));
                        var pt2 = map.convert(new wijmo.Point(x_1, 85));
                        if (this.isValid(pt1) && this.isValid(pt2)) {
                            var s = x_1.toString();
                            var sz = e.measureString(s, cls);
                            e.drawString(s, new wijmo.Point(pt1.x - 0.5 * sz.width, r.top + sz.height), cls);
                            var el = e.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
                            //el.setAttribute('vector-effect', 'non-scaling-stroke');
                        }
                    }
                    var x = r.left;
                    for (var y = -80; y <= 80; y += 20) {
                        var pt1 = map.convert(new wijmo.Point(-180, y));
                        var pt2 = map.convert(new wijmo.Point(180, y));
                        if (this.isValid(pt1) && this.isValid(pt2)) {
                            var s = x.toString();
                            var sz = e.measureString(s, cls);
                            e.drawString(y.toString(), new wijmo.Point(x, pt1.y + 0.5 * sz.height), cls);
                            var el = e.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
                            //el.setAttribute('vector-effect', 'non-scaling-stroke');
                        }
                    }
                    e.endGroup();
                    return g;
                };
                GeoGridLayer.prototype.isValid = function (pt) {
                    return isFinite(pt.x) && isFinite(pt.y);
                };
                return GeoGridLayer;
            }(map_2.MapLayerBase));
            map_2.GeoGridLayer = GeoGridLayer;
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var map;
        (function (map) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.chart.map', wijmo.chart.map);
        })(map = chart.map || (chart.map = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.chart.map.js.map