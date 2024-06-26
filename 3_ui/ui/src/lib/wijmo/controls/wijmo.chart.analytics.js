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
    (function (chart_1) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents a Waterfall series of {@link FlexChart}.
             *
             * The {@link Waterfall} series is normally used to demonstrate how
             * the starting position either increases or decreases through a
             * series of changes.
             */
            var Waterfall = /** @class */ (function (_super) {
                __extends(Waterfall, _super);
                /**
                 * Initializes a new instance of the {@link Waterfall} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Waterfall(options) {
                    var _this = _super.call(this) || this;
                    _this._startLabel = 'Start';
                    _this._relativeData = true;
                    _this._connectorLines = false;
                    _this._showTotal = false;
                    _this._totalLabel = 'Total';
                    _this._getXValues = false;
                    _this._showIntermediateTotal = false;
                    _this._intermediateTotalPos = [];
                    _this._chartType = wijmo.chart.ChartType.Bar;
                    _this.tooltipContent = "<b>{seriesName}</b><br/>{x} {value}";
                    _this.rendering.addHandler(_this._rendering, _this);
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(Waterfall.prototype, "relativeData", {
                    /**
                     * Gets or sets a value that determines whether the given data
                     * represents absolute or relative values (differences).
                     */
                    get: function () {
                        return this._relativeData;
                    },
                    set: function (value) {
                        if (value != this._relativeData) {
                            this._relativeData = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "start", {
                    /**
                     * Gets or sets a value that determines the value of the start bar.
                     * If start is null, the start bar will not be shown.
                     */
                    get: function () {
                        return this._start;
                    },
                    set: function (value) {
                        if (value != this._start) {
                            this._start = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "startLabel", {
                    /**
                     * Gets or sets the label of the start bar.
                     */
                    get: function () {
                        return this._startLabel;
                    },
                    set: function (value) {
                        if (value != this._startLabel) {
                            this._startLabel = wijmo.asString(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "showTotal", {
                    /**
                     * Gets or sets a value that determines whether to show
                     * the total bar at the end of the chart.
                     */
                    get: function () {
                        return this._showTotal;
                    },
                    set: function (value) {
                        if (value != this._showTotal) {
                            this._showTotal = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "totalLabel", {
                    /**
                     * Gets or sets the label of the total bar.
                     */
                    get: function () {
                        return this._totalLabel;
                    },
                    set: function (value) {
                        if (value != this._totalLabel) {
                            this._totalLabel = wijmo.asString(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "showIntermediateTotal", {
                    /**
                     * Gets or sets a value that determines whether to show intermediate
                     * total bars.
                     *
                     * This property works with {@link intermediateTotalPositions} and
                     * {@link intermediateTotalLabels} properties.
                     */
                    get: function () {
                        return this._showIntermediateTotal;
                    },
                    set: function (value) {
                        if (value != this._showIntermediateTotal) {
                            this._showIntermediateTotal = wijmo.asBoolean(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "intermediateTotalPositions", {
                    /**
                     * Gets or sets a value of the property that contains the index
                     * for positions of the intermediate total bars.
                     *
                     * This property works with the {@link showIntermediateTotal} and
                     * {@link intermediateTotalLabels} properties.
                     */
                    get: function () {
                        return this._intermediateTotalPositions;
                    },
                    set: function (value) {
                        if (value != this._intermediateTotalPositions) {
                            this._intermediateTotalPositions = wijmo.asArray(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "intermediateTotalLabels", {
                    /**
                     * Gets or sets the name of the property that contains labels for
                     * the intermediate total bars. This should be an array or a string.
                     *
                     * This property works with the {@link showIntermediateTotal} and
                     * {@link intermediateTotalPositions} properties.
                     */
                    get: function () {
                        return this._intermediateTotalLabels;
                    },
                    set: function (value) {
                        if (value != this._intermediateTotalLabels) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'Array or string expected.');
                            this._intermediateTotalLabels = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "connectorLines", {
                    /**
                     * Gets or sets a value that determines whether to show
                     * connector lines.
                     */
                    get: function () {
                        return this._connectorLines;
                    },
                    set: function (value) {
                        if (value != this._connectorLines) {
                            this._connectorLines = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "styles", {
                    /**
                     * Gets or sets the Waterfall styles.
                     *
                     * The following styles are supported:
                     *
                     * <ol>
                     *   <li><b>start</b>: Specifies the style of the start column.</li>
                     *   <li><b>total</b>: Specifies the style of the total column.</li>
                     *   <li><b>intermediateTotal</b>: Specifies the style of the intermediate total column.</li>
                     *   <li><b>falling</b>: Specifies the style of the falling columns.</li>
                     *   <li><b>rising</b>: Specifies the style of the rising columns.</li>
                     *   <li><b>connectorLines</b>: Specifies the style of the connectorLines.</li>
                     * </ol>
                     *
                     * <pre>waterfall.styles = {
                     *   start: { fill: 'blue', stroke: 'blue' },
                     *   total: { fill: 'yellow', stroke: 'yellow' },
                     *   falling: { fill: 'red', stroke: 'red' },
                     *   rising: { fill: 'green', stroke: 'green' },
                     *   connectorLines: { stroke: 'blue', 'stroke-dasharray': '10, 10' }
                     * }</pre>
                     */
                    get: function () {
                        return this._styles;
                    },
                    set: function (value) {
                        if (value != this._styles) {
                            this._styles = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // ** implementation
                Waterfall.prototype.getValues = function (dim) {
                    var _this = this;
                    var val = [], original, xVals, yVals, xLabels, maxX, len, offset = 0;
                    original = _super.prototype.getValues.call(this, dim);
                    if (dim === 0) {
                        if (!this._yValues) {
                            var val = [], v = this.start != null ? this.start : 0, i = 0, len = (original && original.length) || 0;
                            if (this.relativeData) {
                                for (; i < len; i++) {
                                    v += (isNaN(original[i]) ? 0 : original[i]);
                                    val.push(v);
                                }
                                this._yValues = val;
                            }
                            else {
                                for (; i < len; i++) {
                                    v = isNaN(original[i]) ? 0 : original[i];
                                    val.push(v);
                                }
                                this._yValues = val;
                            }
                            yVals = this._yValues;
                            if (yVals && yVals.length > 0) {
                                if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                                    this._intermediateTotalPos = yVals.slice();
                                    this.intermediateTotalPositions.reduceRight(function (prev, curr) {
                                        var val = curr === 0 ? yVals[0] : yVals[curr - 1];
                                        if (yVals.length > curr) {
                                            yVals.splice(curr, 0, val);
                                            _this._intermediateTotalPos.splice(curr, 0, true);
                                        }
                                        else if (yVals.length === curr) {
                                            yVals.push(val);
                                            _this._intermediateTotalPos.push(true);
                                        }
                                        return 0;
                                    }, 0);
                                }
                                if (this.start != null) {
                                    yVals.splice(0, 0, this.start);
                                    this._intermediateTotalPos.splice(0, 0, false);
                                }
                                if (this.showTotal && yVals) {
                                    yVals.push(yVals[yVals.length - 1]);
                                }
                            }
                        }
                        return this._yValues;
                    }
                    else {
                        if (!this._xValues && this._getXValues) {
                            this._xValues = original && original.slice();
                            this._getXValues = false;
                            if (this._xValues && this._xValues.length > 1) {
                                len = this._xValues.length;
                                maxX = this._xValues[len - 1];
                                offset = Math.abs(this._xValues[len - 1] - this._xValues[len - 2]);
                            }
                            if (this.chart && this.chart._xlabels && this.chart._xlabels.length) {
                                xLabels = this.chart._xlabels;
                                if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                                    var itLabels = this.intermediateTotalLabels;
                                    if (itLabels) {
                                        this.intermediateTotalPositions.reduceRight(function (prev, curr, idx) {
                                            var lbl = '';
                                            if (wijmo.isString(itLabels)) {
                                                lbl = itLabels;
                                            }
                                            else {
                                                lbl = itLabels[idx] || '';
                                            }
                                            if (xLabels.length > curr) {
                                                xLabels.splice(curr, 0, lbl);
                                            }
                                            else if (xLabels.length === curr) {
                                                xLabels.push(lbl);
                                            }
                                            if (offset) {
                                                maxX += offset;
                                                _this._xValues.push(maxX);
                                            }
                                            return 0;
                                        }, 0);
                                    }
                                }
                                if (this.start != null) {
                                    xLabels.splice(0, 0, this.startLabel);
                                    if (offset) {
                                        maxX += offset;
                                        this._xValues.push(maxX);
                                    }
                                }
                                if (this.showTotal) {
                                    xLabels.push(this.totalLabel);
                                    if (offset) {
                                        maxX += offset;
                                        this._xValues.push(maxX);
                                    }
                                }
                            }
                        }
                        return this._xValues;
                    }
                };
                Waterfall.prototype.legendItemLength = function () {
                    return (this.showTotal) ? 3 : 2;
                };
                Waterfall.prototype.measureLegendItem = function (engine, index) {
                    var name = this._getName(index);
                    return name
                        ? this._measureLegendItem(engine, name)
                        : new wijmo.Size(0, 0);
                };
                Waterfall.prototype.drawLegendItem = function (engine, rect, index) {
                    var style = this._getLegendStyles(index), name = this._getName(index);
                    if (name) {
                        this._drawLegendItem(engine, rect, wijmo.chart.ChartType.Bar, this._getName(index), style, this.symbolStyle);
                    }
                };
                /*protected*/ Waterfall.prototype._clearValues = function () {
                    _super.prototype._clearValues.call(this);
                    this._xValues = null;
                    this._yValues = null;
                    this._wfstyle = null;
                    this._getXValues = true;
                    this._intermediateTotalPos = [];
                    if (this.chart) {
                        this.chart._performBind();
                    }
                };
                /*protected*/ Waterfall.prototype._invalidate = function () {
                    _super.prototype._invalidate.call(this);
                    this._clearValues();
                };
                Waterfall.prototype._getXOffset = function () {
                    return this.start != null ? 1 : 0;
                };
                Waterfall.prototype._getYOffset = function (pointIndex) {
                    return this.getValues(0)[pointIndex + this._getXOffset()];
                    ;
                };
                Waterfall.prototype._getValue = function (pointIndex) {
                    var pi = pointIndex;
                    if (this.start != null) {
                        if (pointIndex == 0) {
                            return this.start;
                        }
                        else {
                            pointIndex--;
                        }
                    }
                    if (this.showIntermediateTotal && this.intermediateTotalPositions) {
                        if (this._intermediateTotalPos[pi] === true) {
                            return this.getValues(0)[pi];
                        }
                        ;
                    }
                    return this.getValues(0)[pi];
                };
                Waterfall.prototype._getItem = function (pi) {
                    var item = null;
                    if (this.start != null) {
                        if (pi == 0) {
                            item = {};
                            item[this.binding] = this.start;
                        }
                        else {
                            pi--;
                        }
                    }
                    if (this.showIntermediateTotal && this.intermediateTotalPositions) {
                        var ps = this._intermediateTotalPos;
                        if (ps[pi] === true) {
                            item = {};
                            item[this.binding] = this.getValues(0)[pi];
                            return item;
                        }
                        else {
                            var pic = pi;
                            for (var i = 0; i < pi; i++) {
                                if (ps[i] === true) {
                                    pic--;
                                }
                            }
                            pi = pic;
                        }
                    }
                    if (!item) {
                        item = _super.prototype._getItem.call(this, pi);
                        if (!item && this.showTotal && this._yValues && this._yValues.length > 0) {
                            item = {};
                            item[this.binding] = this._yValues[this._yValues.length - 1];
                        }
                    }
                    return item;
                };
                Waterfall.prototype._rendering = function (sender, args) {
                    var _this = this;
                    args.cancel = true; // no default rendering
                    this._wfstyle = null;
                    var chart = this.chart, axisY = this._getAxisY(), axisX = this._getAxisX(), origin = axisY.origin || 0, engine = args.engine, i, len, rotated, areas, area, falling;
                    this._barPlotter = chart._getPlotter(this);
                    rotated = this._barPlotter.rotated;
                    if (!this._barPlotter._getSymbolOrigin) {
                        this._barPlotter._getSymbolOrigin = function (origin, i, len) {
                            if (i === 0) {
                                //first
                                return origin;
                            }
                            else if (_this._intermediateTotalPos[i] === true) {
                                //intermediateTotal
                                return origin;
                            }
                            else if (i === len - 1 && _this.showTotal) {
                                //last
                                return origin;
                            }
                            else {
                                return _this._yValues[i - 1];
                            }
                        };
                    }
                    if (!this._barPlotter._getSymbolStyles) {
                        this._barPlotter._getSymbolStyles = function (i, len) {
                            var wfStyle = _this._getStyles(), style = {};
                            if (i === 0 && _this.start != null) { // first
                                style = wfStyle.start;
                            }
                            else if (_this._intermediateTotalPos[i] === true) { // intermediateTotal
                                style = wfStyle.intermediateTotal;
                            }
                            else if (i === len - 1 && _this.showTotal) { // last
                                style = wfStyle.total;
                            }
                            else {
                                if (i == 0) {
                                    if (_this._yValues[i] < 0) {
                                        style = wfStyle.falling;
                                    }
                                    else {
                                        style = wfStyle.rising;
                                    }
                                }
                                else {
                                    if (_this._yValues[i] < _this._yValues[i - 1]) { // falling
                                        style = wfStyle.falling;
                                    }
                                    else { // rising
                                        style = wfStyle.rising;
                                    }
                                }
                            }
                            return style;
                        };
                    }
                    this._barPlotter.plotSeries(engine, axisX, axisY, sender, chart, 0, 1);
                    if (this.connectorLines) {
                        areas = this._barPlotter.hitTester._map[0];
                        if (areas && areas.length) {
                            engine.startGroup(Waterfall.CSS_CONNECTOR_LINE_GROUP);
                            falling = this._yValues[0] < origin;
                            area = areas[0].rect;
                            for (i = 1, len = areas.length; i < len; i++) {
                                if (this._intermediateTotalPos[i] === true && i !== len - 1) {
                                    continue;
                                }
                                this._drawConnectorLine(engine, rotated, area, areas[i].rect, falling);
                                area = areas[i].rect;
                                falling = this._yValues[i] < this._yValues[i - 1];
                            }
                            engine.endGroup();
                        }
                    }
                };
                Waterfall.prototype._getStyles = function () {
                    if (this._wfstyle) {
                        return this._wfstyle;
                    }
                    var chart = this._chart, index = chart.series.indexOf(this), fill = this._getSymbolFill(index), stroke = this._getSymbolStroke(index), s = this.styles || {}, style = {};
                    this._wfstyle = {
                        start: this._getStyleByKey(s, 'start', fill, stroke),
                        intermediateTotal: this._getStyleByKey(s, 'intermediateTotal', fill, stroke),
                        total: this._getStyleByKey(s, 'total', fill, stroke),
                        falling: this._getStyleByKey(s, 'falling', 'red', 'red'),
                        rising: this._getStyleByKey(s, 'rising', 'green', 'green')
                    };
                    return this._wfstyle;
                };
                Waterfall.prototype._getStyleByKey = function (styles, key, fill, stroke) {
                    return {
                        fill: styles[key] && styles[key].fill ? styles[key].fill : fill,
                        stroke: styles[key] && styles[key].stroke ? styles[key].stroke : stroke
                    };
                };
                Waterfall.prototype._drawConnectorLine = function (engine, rotated, prevArea, currArea, falling) {
                    var p1 = new wijmo.Point(), p2 = new wijmo.Point(), reversed = this.chart.axisY.reversed, xReversed = this.chart.axisX.reversed;
                    reversed = reversed ^ falling;
                    if (rotated) {
                        if (reversed) {
                            p1.x = prevArea.left;
                            p2.x = prevArea.left;
                        }
                        else {
                            p1.x = prevArea.left + prevArea.width;
                            p2.x = prevArea.left + prevArea.width;
                        }
                        if (xReversed) {
                            p1.y = prevArea.top;
                            p2.y = currArea.top + currArea.height;
                        }
                        else {
                            p1.y = prevArea.top + prevArea.height;
                            p2.y = currArea.top;
                        }
                    }
                    else {
                        if (reversed) {
                            p1.y = prevArea.top + prevArea.height;
                            p2.y = prevArea.top + prevArea.height;
                        }
                        else {
                            p1.y = prevArea.top;
                            p2.y = prevArea.top;
                        }
                        if (xReversed) {
                            p1.x = prevArea.left + prevArea.width;
                            p2.x = currArea.left;
                        }
                        else {
                            p1.x = prevArea.left;
                            p2.x = currArea.left + currArea.width;
                        }
                    }
                    engine.drawLine(p1.x, p1.y, p2.x, p2.y, Waterfall.CSS_CONNECTOR_LINE, (this.styles && this.styles.connectorLines) || { stroke: 'black' });
                };
                // helper for series with multiple styles
                // Returns the appropriate style for the given index if ones exists
                // or null otherwise.
                Waterfall.prototype._getLegendStyles = function (index) {
                    if (index < 0 || this.styles === null) {
                        return null;
                    }
                    var styles = this._getStyles();
                    if (index === 0) {
                        //rising
                        return styles.rising;
                    }
                    else if (index === 1) {
                        //falling
                        return styles.falling;
                    }
                    else {
                        //total
                        return styles.total;
                    }
                };
                // helper for series with multiple names (csv)
                // Returns undefined or the name.
                Waterfall.prototype._getName = function (index) {
                    var retval = undefined;
                    if (this.name) {
                        if (this.name.indexOf(",")) {
                            var names = this.name.split(",");
                            if (names && names.length - 1 >= index) {
                                retval = names[index].trim();
                            }
                        }
                        else {
                            retval = this.name;
                        }
                    }
                    return retval;
                };
                Waterfall.CSS_CONNECTOR_LINE_GROUP = 'water-fall-connector-lines';
                Waterfall.CSS_CONNECTOR_LINE = 'water-fall-connector-line';
                Waterfall.CSS_ENDLABEL = 'water-fall-end-label';
                return Waterfall;
            }(wijmo.chart.SeriesBase));
            analytics.Waterfall = Waterfall;
        })(analytics = chart_1.analytics || (chart_1.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents base class for various trend lines.
             */
            var TrendLineBase = /** @class */ (function (_super) {
                __extends(TrendLineBase, _super);
                /**
                 * Initializes a new instance of the {@link TrendLineBase} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function TrendLineBase(options) {
                    var _this = _super.call(this) || this;
                    _this._chartType = wijmo.chart.ChartType.Line;
                    _this._sampleCount = 100;
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(TrendLineBase.prototype, "sampleCount", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the sample count for function calculation.
                     * The property doesn't apply for MovingAverage.
                     */
                    get: function () {
                        return this._sampleCount;
                    },
                    set: function (value) {
                        value = wijmo.asNumber(value, false, true);
                        if (value != this._sampleCount) {
                            this._sampleCount = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                TrendLineBase.prototype.approximate = function (x) {
                    return 0;
                };
                TrendLineBase.prototype.getValues = function (dim) {
                    var self = this, bind = self.binding, bindX = self.bindingX;
                    //reset binding and bindingX to trendline base.
                    if (bind !== self._bind) {
                        self._bind = bind;
                        self.binding = bind;
                    }
                    if (bindX !== self._bindX) {
                        self._bindX = bindX;
                        self.bindingX = bindX;
                    }
                    if (self._originYValues == null) {
                        self._originYValues = _super.prototype.getValues.call(this, 0);
                    }
                    if (self._originXValues == null) {
                        self._originXValues = _super.prototype.getValues.call(this, 1);
                    }
                    if (self._originXValues == null || self._originYValues == null) {
                        return null;
                    }
                    _super.prototype.getValues.call(this, dim);
                    if (self._xValues == null || self._yValues == null) {
                        self._calculateValues();
                    }
                    if (dim === 0) {
                        //y
                        return self._yValues || null;
                    }
                    else if (dim === 1) {
                        //x
                        return self._xValues || null;
                    }
                };
                TrendLineBase.prototype._calculateValues = function () {
                };
                TrendLineBase.prototype._invalidate = function () {
                    _super.prototype._invalidate.call(this);
                    this._clearCalculatedValues();
                };
                TrendLineBase.prototype._clearValues = function () {
                    _super.prototype._clearValues.call(this);
                    this._originXValues = null;
                    this._originYValues = null;
                    this._clearCalculatedValues();
                };
                TrendLineBase.prototype._clearCalculatedValues = function () {
                    this._xValues = null;
                    this._yValues = null;
                };
                return TrendLineBase;
            }(wijmo.chart.SeriesBase));
            analytics.TrendLineBase = TrendLineBase;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Specifies the type of MovingAverage Series.
             */
            var MovingAverageType;
            (function (MovingAverageType) {
                /**
                 * An average of the last n values.
                 */
                MovingAverageType[MovingAverageType["Simple"] = 0] = "Simple";
                /**
                 * Weighted average of the last n values,
                 * where the weight decreases by 1 with each previous value.
                 */
                MovingAverageType[MovingAverageType["Weighted"] = 1] = "Weighted";
                /**
                 * Weighted average of the last n values,
                 * where the weight decreases exponentially with each previous value.
                 */
                MovingAverageType[MovingAverageType["Exponential"] = 2] = "Exponential";
                /**
                 * Weighted average of the last n values,
                 * whose result is equivalent to a double smoothed simple moving average.
                 */
                MovingAverageType[MovingAverageType["Triangular"] = 3] = "Triangular";
            })(MovingAverageType = analytics.MovingAverageType || (analytics.MovingAverageType = {}));
            /**
             * Represents a moving average trend line for {@link FlexChart} and {@link FinancialChart}.
             *
             * It is a calculation to analyze data points by creating a series of averages of
             * different subsets of the full data set. You may define a different type on each
             * {@link MovingAverage} object by setting the {@link type} property on the
             * {@link MovingAverage} itself.
             *
             * The {@link MovingAverage} class has a {@link period} property that allows you to set
             * the number of periods for computing the average value.
             */
            var MovingAverage = /** @class */ (function (_super) {
                __extends(MovingAverage, _super);
                /**
                 * Initializes a new instance of the {@link MovingAverage} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function MovingAverage(options) {
                    var _this = _super.call(this) || this;
                    _this._chartType = wijmo.chart.ChartType.Line;
                    _this._type = MovingAverageType.Simple;
                    _this._period = 2;
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(MovingAverage.prototype, "type", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the type of the moving average series.
                     */
                    get: function () {
                        return this._type;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, MovingAverageType, false);
                        if (value != this._type) {
                            this._type = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MovingAverage.prototype, "period", {
                    /**
                     * Gets or sets the period of the moving average series.
                     * It should be set to integer value greater than 1.
                     */
                    get: function () {
                        return this._period;
                    },
                    set: function (value) {
                        var value = wijmo.asNumber(value, false, true);
                        if (value != this._period) {
                            this._period = wijmo.asNumber(value, false, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                MovingAverage.prototype._checkPeriod = function () {
                    var period = this.period, oriXVals = this._originXValues;
                    if (period <= 1) {
                        wijmo.assert(false, "period must be greater than 1.");
                    }
                    if (oriXVals && oriXVals.length && period >= oriXVals.length) {
                        wijmo.assert(false, "period must be less than itemSource's length.");
                    }
                };
                MovingAverage.prototype._calculateValues = function () {
                    var type = this._type, funcName = "_calculate" + MovingAverageType[this._type], x = [], y = [];
                    this._checkPeriod();
                    if (this[funcName]) {
                        this[funcName].call(this, x, y);
                    }
                    this._yValues = y;
                    this._xValues = x;
                };
                MovingAverage.prototype._calculateSimple = function (x, y, forTMA) {
                    if (forTMA === void 0) { forTMA = false; }
                    var ox = this._originXValues, oy = this._originYValues, len = ox.length, p = this._period, total = 0;
                    for (var i = 0; i < len; i++) {
                        total += oy[i] || 0;
                        if (i >= p) {
                            total -= oy[i - p] || 0;
                        }
                        if (i >= p - 1) {
                            x.push(ox[i]);
                            y.push(total / p);
                        }
                        else if (forTMA) {
                            x.push(ox[i]);
                            y.push(total / (i + 1));
                        }
                    }
                };
                MovingAverage.prototype._calculateWeighted = function (x, y) {
                    var ox = this._originXValues, oy = this._originYValues, len = ox.length, p = this._period, denominator = p * (p + 1) / 2, total = 0, numerator = 0;
                    for (var i = 0; i < len; i++) {
                        if (i > 0) {
                            total += oy[i - 1] || 0;
                        }
                        if (i > p) {
                            total -= oy[i - p - 1] || 0;
                        }
                        if (i < p - 1) {
                            numerator += (oy[i] || 0) * (i + 1);
                        }
                        else {
                            numerator += (oy[i] || 0) * p;
                            if (i > p - 1) {
                                numerator -= total;
                            }
                            x.push(ox[i]);
                            y.push(numerator / denominator);
                        }
                    }
                };
                MovingAverage.prototype._calculateExponential = function (x, y) {
                    var ox = this._originXValues, oy = this._originYValues, len = ox.length, p = this._period, ema = 0;
                    for (var i = 0; i < len; i++) {
                        if (i <= p - 2) {
                            ema += oy[i] || 0;
                            if (i === p - 2) {
                                ema /= p - 1;
                            }
                            continue;
                        }
                        ema = ema + (2 / (p + 1)) * ((oy[i] || 0) - ema);
                        x.push(ox[i]);
                        y.push(ema);
                    }
                };
                MovingAverage.prototype._calculateTriangular = function (x, y) {
                    var p = this._period, ox = [], oy = [], total = 0;
                    this._calculateSimple(ox, oy, true);
                    for (var i = 0, len = ox.length; i < len; i++) {
                        total += oy[i] || 0;
                        if (i >= p) {
                            total -= oy[i - p] || 0;
                        }
                        if (i >= p - 1) {
                            x.push(ox[i]);
                            y.push(total / p);
                        }
                    }
                };
                return MovingAverage;
            }(analytics.TrendLineBase));
            analytics.MovingAverage = MovingAverage;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            var MathHelper = /** @class */ (function () {
                function MathHelper() {
                }
                // get rounded value by given digits.
                MathHelper.round = function (val, digits) {
                    if (!val) {
                        return 0;
                    }
                    var rate = Math.pow(10, digits || 2);
                    return Math.round(val * rate) / rate;
                };
                // determines average value in array of numbers
                MathHelper.avg = function (values) {
                    var sum = MathHelper.sum(values);
                    return sum / values.length;
                };
                // determines sum of values in array of numbers
                MathHelper.sum = function (values) {
                    values = wijmo.asArray(values, false);
                    return values.reduce(function (prev, curr) { return prev + curr; }, 0);
                };
                // determines sum of values to specified power
                MathHelper.sumOfPow = function (values, pow) {
                    values = wijmo.asArray(values, false);
                    pow = wijmo.asNumber(pow, false);
                    return values.reduce(function (prev, curr) { return prev + Math.pow(curr, pow); }, 0);
                };
                // determines the sum product of two or more numeric arrays of equal length
                MathHelper.sumProduct = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    var rows = values.length, cols = 0, vals = [], i, val;
                    values = wijmo.asArray(values, false);
                    values.forEach(function (row, idx) {
                        row = wijmo.asArray(row, false);
                        if (idx === 0) {
                            cols = row.length;
                        }
                        else {
                            wijmo.assert(row.length === cols, 'The length of the arrays must be equal');
                        }
                    });
                    for (i = 0; i < cols; i++) {
                        val = 1;
                        values.some(function (row, idx) {
                            var value = row[i];
                            if (value && wijmo.isNumber(value)) {
                                val *= value;
                            }
                            else {
                                val = 0;
                                return true;
                            }
                        });
                        vals.push(val);
                    }
                    return MathHelper.sum(vals);
                };
                // determines variance of array of numbers
                MathHelper.variance = function (values) {
                    values = wijmo.asArray(values, false);
                    var mean = MathHelper.avg(values), diffs;
                    diffs = values.map(function (v) { return v - mean; });
                    return MathHelper.sumOfSquares(diffs) / (values.length - 1);
                };
                // determines covariance based on two correlated arrays
                MathHelper.covariance = function (values1, values2) {
                    values1 = wijmo.asArray(values1, false);
                    values2 = wijmo.asArray(values2, false);
                    wijmo.assert(values1.length === values2.length, 'Length of arrays must be equal');
                    var mean1 = MathHelper.avg(values1), mean2 = MathHelper.avg(values2), len = values1.length, val = 0, i;
                    for (i = 0; i < len; i++) {
                        val += ((values1[i] - mean1) * (values2[i] - mean2)) / len;
                    }
                    return val;
                };
                // determines minimum value in array of numbers
                MathHelper.min = function (values) { return Math.min.apply(Math, wijmo.asArray(values, false)); };
                // determines maximum value in array of numbers
                MathHelper.max = function (values) { return Math.max.apply(Math, wijmo.asArray(values, false)); };
                // determines the squared value of a number
                MathHelper.square = function (value) { return Math.pow(wijmo.asNumber(value, false), 2); };
                // determines the sum of squares from an array of numbers
                MathHelper.sumOfSquares = function (values) { return MathHelper.sumOfPow(values, 2); };
                // determines standard deviation from an array of numbers
                MathHelper.stdDev = function (values) { return Math.sqrt(MathHelper.variance(values)); };
                return MathHelper;
            }());
            /**
             * Specifies the fit type for a {@link TrendLine} series.
             */
            var TrendLineFitType;
            (function (TrendLineFitType) {
                /**
                 * A straight line that most closely approximates the data.  Y(x) = a * x + b.
                 */
                TrendLineFitType[TrendLineFitType["Linear"] = 0] = "Linear";
                /**
                 * Regression fit to the equation Y(x) = a * exp(b*x).
                 */
                TrendLineFitType[TrendLineFitType["Exponential"] = 1] = "Exponential";
                /**
                 * Regression fit to the equation Y(x) = a * ln(x) + b.
                 */
                TrendLineFitType[TrendLineFitType["Logarithmic"] = 2] = "Logarithmic";
                /**
                 * Regression fit to the equation Y(x) = a * pow(x, b).
                 */
                TrendLineFitType[TrendLineFitType["Power"] = 3] = "Power";
                /**
                 * Regression fit to the equation Y(x) = a + b * cos(x) + c * sin(x) + d * cos(2*x) + e * sin(2*x) + ...
                 */
                TrendLineFitType[TrendLineFitType["Fourier"] = 4] = "Fourier";
                /**
                 * Regression fit to the equation Y(x) = a * x^n + b * x^n-1 + c * x^n-2 + ... + z.
                 */
                TrendLineFitType[TrendLineFitType["Polynomial"] = 5] = "Polynomial";
                /**
                 * The minimum X-value.
                 */
                TrendLineFitType[TrendLineFitType["MinX"] = 6] = "MinX";
                /**
                 * The minimum Y-value.
                 */
                TrendLineFitType[TrendLineFitType["MinY"] = 7] = "MinY";
                /**
                 * The maximum X-value.
                 */
                TrendLineFitType[TrendLineFitType["MaxX"] = 8] = "MaxX";
                /**
                 * The maximum Y-value.
                 */
                TrendLineFitType[TrendLineFitType["MaxY"] = 9] = "MaxY";
                /**
                 * The average X-value.
                 */
                TrendLineFitType[TrendLineFitType["AverageX"] = 10] = "AverageX";
                /**
                 * The average Y-value.
                 */
                TrendLineFitType[TrendLineFitType["AverageY"] = 11] = "AverageY";
            })(TrendLineFitType = analytics.TrendLineFitType || (analytics.TrendLineFitType = {}));
            /**
             * Represents a trend line series in a {@link FlexChart} or {@link FinancialChart}.
             *
             * A trend line is a line superimposed on a chart revealing the overall
             * direction of data.
             *
             * You may define a different fit type for each {@link TrendLine} series
             * on the {@link FlexChart} by setting its {@link fitType} property.
             */
            var TrendLine = /** @class */ (function (_super) {
                __extends(TrendLine, _super);
                /**
                 * Initializes a new instance of the {@link TrendLine} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function TrendLine(options) {
                    var _this = _super.call(this) || this;
                    _this._fitType = TrendLineFitType.Linear;
                    _this._order = 2;
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(TrendLine.prototype, "fitType", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the fit type of the {@link TrendLine}.
                     */
                    get: function () {
                        return this._fitType;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, TrendLineFitType, false);
                        if (value != this._fitType) {
                            this._fitType = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendLine.prototype, "order", {
                    /**
                     * Gets or sets the number of terms in a polynomial or Fourier equation.
                     *
                     * Set this value to an integer greater than 1.
                     * It gets applied when the fitType is set to
                     * TrendLineFitType.Polynomial or
                     * TrendLineFitType.Fourier.
                     */
                    get: function () {
                        return this._order;
                    },
                    set: function (value) {
                        if (value != this._order) {
                            this._order = wijmo.asNumber(value, false, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendLine.prototype, "coefficients", {
                    /**
                     * Gets the coefficients of the equation.
                     */
                    get: function () {
                        return this._helper
                            ? this._helper.coefficients
                            : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                TrendLine.prototype.approximate = function (x) {
                    return this._helper
                        ? this._helper.approximate(x)
                        : NaN;
                };
                /**
                 * Gets the formatted equation string for the coefficients.
                 *
                 * @param fmt The formatting function used to convert the coefficients
                 * into strings. This parameter is optional.
                 */
                TrendLine.prototype.getEquation = function (fmt) {
                    var eq = this._helper ? this._helper.getEquation(fmt) : '';
                    // add spaces around '+' and '-' binary operators
                    return eq.replace(/\S(\+|\-)\d/g, function (match) {
                        return match[0] + ' ' + match[1] + ' ' + match[2];
                    });
                };
                //--------------------------------------------------------------------------
                //** implementation
                TrendLine.prototype._calculateValues = function () {
                    var fitType = TrendLineFitType[this._fitType];
                    if (TrendLineHelper[fitType]) {
                        //For string type x value, set first value to 1.
                        var isXString = false, xArr = this._originXValues;
                        if (this._chart._xvals.length == 0 && this._chart._xlabels.length > 0) {
                            xArr = this._originXValues.map(function (v) { return v + 1; });
                            isXString = true;
                        }
                        var helper = new TrendLineHelper[fitType](this._originYValues, xArr, this.sampleCount, this.order);
                        helper._isXString = isXString;
                        var vals = helper.calculateValues();
                        this._yValues = vals[0];
                        this._xValues = vals[1];
                        this._helper = helper;
                    }
                };
                return TrendLine;
            }(analytics.TrendLineBase));
            analytics.TrendLine = TrendLine;
            // store calculated values.
            var Calculator = /** @class */ (function () {
                function Calculator(x, y) {
                    this._x = x;
                    this._y = y;
                }
                Object.defineProperty(Calculator.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "minX", {
                    get: function () {
                        if (this._minX == null) {
                            this._minX = MathHelper.min(this._x);
                        }
                        return this._minX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "minY", {
                    get: function () {
                        if (this._minY == null) {
                            this._minY = MathHelper.min(this._y);
                        }
                        return this._minY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "maxX", {
                    get: function () {
                        if (this._maxX == null) {
                            this._maxX = MathHelper.max(this._x);
                        }
                        return this._maxX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "maxY", {
                    get: function () {
                        if (this._maxY == null) {
                            this._maxY = MathHelper.max(this._y);
                        }
                        return this._maxY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "averageX", {
                    get: function () {
                        if (this._averageX == null) {
                            this._averageX = MathHelper.avg(this._x);
                        }
                        return this._averageX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "averageY", {
                    get: function () {
                        if (this._averageY == null) {
                            this._averageY = MathHelper.avg(this._y);
                        }
                        return this._averageY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumX", {
                    get: function () {
                        if (this._sumX == null) {
                            this._sumX = MathHelper.sum(this._x);
                        }
                        return this._sumX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumY", {
                    get: function () {
                        if (this._sumY == null) {
                            this._sumY = MathHelper.sum(this._y);
                        }
                        return this._sumY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "LogX", {
                    get: function () {
                        if (this._logX == null) {
                            this._logX = this._x.map(function (val) { return Math.log(val); });
                        }
                        return this._logX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "LogY", {
                    get: function () {
                        if (this._logY == null) {
                            this._logY = this._y.map(function (val) { return Math.log(val); });
                        }
                        return this._logY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumLogX", {
                    get: function () {
                        if (this._sumLogX == null) {
                            this._sumLogX = MathHelper.sum(this.LogX);
                        }
                        return this._sumLogX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumLogY", {
                    get: function () {
                        if (this._sumLogY == null) {
                            this._sumLogY = MathHelper.sum(this.LogY);
                        }
                        return this._sumLogY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareX", {
                    get: function () {
                        if (this._sumOfSquareX == null) {
                            this._sumOfSquareX = MathHelper.sumOfSquares(this._x);
                        }
                        return this._sumOfSquareX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareY", {
                    get: function () {
                        if (this._sumOfSquareY == null) {
                            this._sumOfSquareY = MathHelper.sumOfSquares(this._y);
                        }
                        return this._sumOfSquareY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareLogX", {
                    get: function () {
                        if (this._sumOfSquareLogX == null) {
                            this._sumOfSquareLogX = MathHelper.sumOfSquares(this.LogX);
                        }
                        return this._sumOfSquareLogX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareLogY", {
                    get: function () {
                        if (this._sumOfSquareLogY == null) {
                            this._sumOfSquareLogY = MathHelper.sumOfSquares(this.LogY);
                        }
                        return this._sumOfSquareLogY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Calculator.prototype.sumProduct = function (x, y) {
                    // In current cases, sumProduct get same x and y in each TrendHelpers, 
                    // so use only one variable to store value.
                    if (this._sumProduct == null) {
                        this._sumProduct = MathHelper.sumProduct(x, y);
                    }
                    return this._sumProduct;
                };
                return Calculator;
            }());
            // Base class for calculating trend line calculations.
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
            var TrendHelperBase = /** @class */ (function () {
                function TrendHelperBase(y, x, count) {
                    this._coefficients = [];
                    this.y = wijmo.asArray(y);
                    this.x = wijmo.asArray(x);
                    wijmo.assert(y.length === x.length, 'Length of X and Y arrays are not equal');
                    this.count = count || y.length;
                    this._calculator = new Calculator(x, y);
                    this.xMin = this._calculator.minX;
                    this.xMax = this._calculator.maxX;
                }
                Object.defineProperty(TrendHelperBase.prototype, "calculator", {
                    get: function () {
                        return this._calculator;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        if (value !== this.y) {
                            this._y = wijmo.asArray(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        if (value !== this.x) {
                            this._x = wijmo.asArray(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "count", {
                    get: function () {
                        return this._count;
                    },
                    set: function (value) {
                        if (value !== this.count) {
                            this._count = wijmo.asInt(value, false, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "xMin", {
                    get: function () {
                        return this._xMin;
                    },
                    set: function (value) {
                        if (value !== this.xMin) {
                            this._xMin = wijmo.asNumber(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "xMax", {
                    get: function () {
                        return this._xMax;
                    },
                    set: function (value) {
                        if (value !== this.xMax) {
                            this._xMax = wijmo.asNumber(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "coefficients", {
                    get: function () {
                        return this._coefficients;
                    },
                    enumerable: true,
                    configurable: true
                });
                TrendHelperBase.prototype._calculateCoefficients = function () {
                    var b = this.calcB();
                    var a = this.calcA(b);
                    this._coefficients.push(a, b);
                };
                TrendHelperBase.prototype.calculateValues = function () {
                    var delta = (this.xMax - this.xMin) / (this.count - 1), values = [[], []];
                    for (var i = 0; i < this.count; i++) {
                        var xv = this.xMin + delta * i, yv = this.calcY(xv);
                        values[0].push(yv);
                        if (this._isXString) {
                            values[1].push(xv - 1);
                        }
                        else {
                            values[1].push(xv);
                        }
                    }
                    return values;
                };
                // Calculates the y-offset.
                TrendHelperBase.prototype.calcA = function (b) {
                    var n = this.y.length, Ex = this.calculator.sumX, Ey = this.calculator.sumY, b = b ? b : this.calcB();
                    return (Ey - (b * Ex)) / n;
                };
                // Calculates the slope.
                TrendHelperBase.prototype.calcB = function () {
                    var n = this.y.length, calc = this.calculator, Exy = calc.sumProduct(calc.x, calc.y), Ex = calc.sumX, Ey = calc.sumY, Exsq = calc.sumOfSquareX;
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                TrendHelperBase.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] + (coeffs[1] * xval);
                };
                TrendHelperBase.prototype.approximate = function (x) {
                    return this.calcY(x);
                };
                TrendHelperBase.prototype.getEquation = function (fmt) {
                    var fmt = fmt ? fmt : this._defaultEquationFmt;
                    return this._getEquation(fmt);
                };
                TrendHelperBase.prototype._getEquation = function (fmt) {
                    var coeffs = this.coefficients, equations = [];
                    coeffs.forEach(function (coeff) {
                        equations.push(fmt(coeff));
                    });
                    return this._concatEquation(equations);
                };
                TrendHelperBase.prototype._concatEquation = function (equations) {
                    return '';
                };
                TrendHelperBase.prototype._defaultEquationFmt = function (coefficient) {
                    var val, len, coeff = Math.abs(coefficient), strCoeff = String(coeff), concatLen = 0;
                    if (coeff >= 1e5) {
                        len = String(Math.round(coeff)).length - 1;
                        val = Math.round(coefficient / Number('1e' + len));
                        return val + 'e' + len;
                    }
                    else if (coeff < 1e-4) {
                        if (strCoeff.indexOf('e') > -1) {
                            len = Math.abs(+strCoeff.substring(strCoeff.indexOf('e') + 1));
                        }
                        else {
                            len = strCoeff.match(/\.0+/)[0].length;
                        }
                        val = Math.round(coefficient * Number('1e' + len));
                        return val + 'e-' + len;
                    }
                    else {
                        concatLen = coefficient > 0 ? 6 : 7;
                        if (coeff >= 1e4) {
                            concatLen--;
                        }
                        // use + to convert string to number to remove last '0' characters.
                        return String(+(String(coefficient).substring(0, concatLen)));
                    }
                };
                return TrendHelperBase;
            }());
            // y = a * x + b
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
            var LinearHelper = /** @class */ (function (_super) {
                __extends(LinearHelper, _super);
                function LinearHelper(y, x, count, yOffset) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._calculateCoefficients();
                    _this.yOffset = yOffset;
                    return _this;
                }
                Object.defineProperty(LinearHelper.prototype, "yOffset", {
                    get: function () {
                        return this._yOffset;
                    },
                    set: function (value) {
                        if (value !== this.yOffset) {
                            this._yOffset = wijmo.asNumber(value, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                LinearHelper.prototype.calcA = function (b) {
                    return this.yOffset != null ? this.yOffset : _super.prototype.calcA.call(this, b);
                };
                LinearHelper.prototype.calcB = function () {
                    return this.yOffset != null ? this._calculateBSimple() : _super.prototype.calcB.call(this);
                };
                LinearHelper.prototype._calculateBSimple = function () {
                    var calc = this.calculator, Exy = calc.sumProduct(calc.x, calc.y), Ex = calc.sumX, Exsq = calc.sumOfSquareX;
                    return (Exy - this.yOffset * Ex) / Exsq;
                };
                LinearHelper.prototype._calculateCoefficients = function () {
                    var b = this.calcB(), a = this.calcA(b);
                    this.coefficients.push(b, a);
                };
                LinearHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return (coeffs[0] * xval) + coeffs[1];
                };
                LinearHelper.prototype._concatEquation = function (equations) {
                    return 'y = ' +
                        equations[0] +
                        'x' +
                        (this.coefficients[1] >= 0 ? '+' : '') +
                        equations[1];
                };
                return LinearHelper;
            }(TrendHelperBase));
            // y = a * lnx + b.
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
            var LogHelper = /** @class */ (function (_super) {
                __extends(LogHelper, _super);
                function LogHelper(y, x, count) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._calculateCoefficients();
                    return _this;
                }
                LogHelper.prototype.calcA = function (b) {
                    var n = this.y.length, calc = this.calculator, Ey = calc.sumY, Ex = calc.sumLogX, b = b ? b : this.calcB();
                    return (Ey - (b * Ex)) / n;
                };
                LogHelper.prototype.calcB = function () {
                    var n = this.y.length, calc = this.calculator, Exy = calc.sumProduct(calc.y, calc.LogX), Ey = calc.sumY, Ex = calc.sumLogX, Exsq = calc.sumOfSquareLogX;
                    return ((n * Exy) - (Ey * Ex)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                LogHelper.prototype._calculateCoefficients = function () {
                    var b = this.calcB(), a = this.calcA(b);
                    this.coefficients.push(b, a);
                };
                LogHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return (Math.log(xval) * coeffs[0]) + coeffs[1];
                };
                LogHelper.prototype._concatEquation = function (equations) {
                    return 'y = ' +
                        equations[0] +
                        'ln(x)' +
                        (this.coefficients[1] >= 0 ? '+' : '') +
                        equations[1];
                };
                return LogHelper;
            }(TrendHelperBase));
            // y = a * e ^ (b * x)
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
            var ExpHelper = /** @class */ (function (_super) {
                __extends(ExpHelper, _super);
                function ExpHelper(y, x, count) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._calculateCoefficients();
                    return _this;
                }
                ExpHelper.prototype.calcA = function () {
                    var n = this.y.length, calc = this.calculator, Ey = calc.sumLogY, Exsq = calc.sumOfSquareX, Ex = calc.sumX, Exy = calc.sumProduct(calc.x, calc.LogY);
                    return Math.exp(((Ey * Exsq) - (Ex * Exy)) / ((n * Exsq) - MathHelper.square(Ex)));
                };
                ExpHelper.prototype.calcB = function () {
                    var n = this.y.length, calc = this.calculator, Ey = calc.sumLogY, Exsq = calc.sumOfSquareX, Ex = calc.sumX, Exy = calc.sumProduct(calc.x, calc.LogY);
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                ExpHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] * Math.exp(coeffs[1] * xval);
                };
                ExpHelper.prototype._concatEquation = function (equations) {
                    return 'y = ' +
                        equations[0] +
                        'e<sup>' +
                        equations[1] +
                        'x</sup>';
                };
                return ExpHelper;
            }(TrendHelperBase));
            // y = a * x ^ b
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
            var PowerHelper = /** @class */ (function (_super) {
                __extends(PowerHelper, _super);
                function PowerHelper(y, x, count) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._calculateCoefficients();
                    return _this;
                }
                PowerHelper.prototype.calcA = function (b) {
                    var calc = this.calculator, n = this.y.length, Ex = calc.sumLogX, Ey = calc.sumLogY, b = b ? b : this.calcB();
                    return Math.exp((Ey - (b * Ex)) / n);
                };
                PowerHelper.prototype.calcB = function () {
                    var n = this.y.length, calc = this.calculator, Exy = calc.sumProduct(calc.LogX, calc.LogY), Ex = calc.sumLogX, Ey = calc.sumLogY, Exsq = calc.sumOfSquareLogX;
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                PowerHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] * Math.pow(xval, coeffs[1]);
                };
                PowerHelper.prototype._concatEquation = function (equations) {
                    return 'y = ' +
                        equations[0] +
                        'x<sup>' +
                        equations[1] +
                        '</sup>';
                };
                return PowerHelper;
            }(TrendHelperBase));
            //For Polynomial/Fourier
            var LeastSquaresHelper = /** @class */ (function (_super) {
                __extends(LeastSquaresHelper, _super);
                function LeastSquaresHelper(y, x, count, order) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._order = order == null ? 2 : order;
                    _this._basis = [];
                    _this._calculateCoefficients();
                    return _this;
                }
                Object.defineProperty(LeastSquaresHelper.prototype, "basis", {
                    get: function () {
                        return this._basis;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LeastSquaresHelper.prototype, "order", {
                    get: function () {
                        return this._order;
                    },
                    set: function (value) {
                        this._order = wijmo.asNumber(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                LeastSquaresHelper.prototype._calculateCoefficients = function () {
                    this._coefficients.length = this.order;
                    this._createBasis();
                    this._normalizeAndSolveGauss();
                };
                LeastSquaresHelper.prototype._createBasis = function () {
                    var len = this.x.length, order = this.order;
                    if (len < 2) {
                        throw "Incompatible data: Less than 2 data points.";
                    }
                    if (order < 1) {
                        throw "Incompatible data: Less than 1 coefficient in the fit";
                    }
                    if (order > len) {
                        throw "Incompatible data: Number of data points less than number of terms";
                    }
                };
                LeastSquaresHelper.prototype._normalizeAndSolveGauss = function () {
                    var a = [];
                    this._computeNormalEquations(a);
                    this._genDefValForArray(a, 0);
                    if (!this._solveGauss(a)) {
                        throw 'Incompatible data: No solution.';
                    }
                };
                LeastSquaresHelper.prototype._genDefValForArray = function (a, def) {
                    var len = a.length + 1;
                    a.forEach(function (v) {
                        for (var i = 0; i < len; i++) {
                            if (v[i] == null) {
                                v[i] = def;
                            }
                        }
                    });
                };
                // transform the least square task to the normal equation
                //  a * solution = c
                // where
                //   a = basis_transposed * basis
                //   c = basis_transposed * y 
                // 
                // here right part
                //   a[i][nt] = c[i]
                //
                LeastSquaresHelper.prototype._computeNormalEquations = function (a) {
                    var y = this.y, bas = this.basis, order = this.order, len = y.length, col, row, sum, i;
                    for (col = 0; col < order; col++) {
                        sum = 0;
                        if (a[col] == null) {
                            a[col] = [];
                        }
                        y.forEach(function (v, i) {
                            sum += v * bas[i][col];
                        });
                        a[col][order] = sum;
                        for (row = col; row < order; row++) {
                            sum = 0;
                            for (i = 0; i < len; i++) {
                                sum += bas[i][row] * bas[i][col];
                            }
                            if (a[row] == null) {
                                a[row] = [];
                            }
                            a[row][col] = sum;
                            a[col][row] = sum;
                        }
                    }
                };
                // A[n][n]*x = A[n+1]
                LeastSquaresHelper.prototype._solveGauss = function (a) {
                    var n = a.length, epsilon = 0, coeffs = this._coefficients, result = true, i, j;
                    if (coeffs.length < n || a[0].length < n + 1) {
                        throw 'Dimension of matrix is not correct.';
                    }
                    a.some(function (v, i) {
                        var k = i, m = Math.abs(v[i]), val, _temp;
                        for (j = i + 1; j < n; j++) {
                            val = Math.abs(a[j][i]);
                            if (m < val) {
                                m = val;
                                k = j;
                            }
                        }
                        if (m > epsilon) {
                            for (j = i; j <= n; j++) {
                                _temp = a[i][j];
                                a[i][j] = a[k][j];
                                a[k][j] = _temp;
                            }
                            for (k = i + 1; k < n; k++) {
                                _temp = a[k][i] / v[i];
                                a[k][i] = 0;
                                for (j = i + 1; j <= n; j++)
                                    a[k][j] -= _temp * v[j];
                            }
                        }
                        else {
                            result = false;
                            return true;
                        }
                    });
                    if (result) {
                        for (i = n - 1; i >= 0; i--) {
                            coeffs[i] = a[i][n];
                            for (j = i + 1; j < n; j++) {
                                coeffs[i] -= a[i][j] * coeffs[j];
                            }
                            coeffs[i] = coeffs[i] / a[i][i];
                        }
                    }
                    return result;
                };
                return LeastSquaresHelper;
            }(TrendHelperBase));
            var PolyHelper = /** @class */ (function (_super) {
                __extends(PolyHelper, _super);
                function PolyHelper(y, x, count, order) {
                    return _super.call(this, y, x, count, order) || this;
                }
                Object.defineProperty(PolyHelper.prototype, "coefficients", {
                    get: function () {
                        return this._coefficients.slice(0).reverse();
                    },
                    enumerable: true,
                    configurable: true
                });
                PolyHelper.prototype.calcY = function (xval) {
                    var coeffs = this._coefficients, yval = 0, pow = 1;
                    coeffs.forEach(function (v, i) {
                        if (i > 0) {
                            pow *= xval;
                        }
                        yval += v * pow;
                    });
                    return yval;
                };
                PolyHelper.prototype._calculateCoefficients = function () {
                    var coeffs = this._coefficients, zero = false, i;
                    this.order++;
                    if (zero) {
                        coeffs.pop();
                    }
                    _super.prototype._calculateCoefficients.call(this);
                    if (zero) {
                    }
                    this.order--;
                };
                //f0 = 1, f1 = x, f2 = x^2...
                PolyHelper.prototype._createBasis = function () {
                    _super.prototype._createBasis.call(this);
                    var x = this.x, bas = this.basis, order = this.order;
                    x.forEach(function (v, row) {
                        bas[row] = [1];
                        for (var col = 1; col <= order; col++) {
                            bas[row][col] = v * bas[row][col - 1];
                        }
                    });
                };
                PolyHelper.prototype._concatEquation = function (equations) {
                    var str = 'y = ', len = equations.length, coeffs = this.coefficients;
                    equations.forEach(function (val, idx) {
                        var pow = len - 1 - idx, operator;
                        if (pow === 0) {
                            str += val;
                        }
                        else if (pow === 1) {
                            operator = coeffs[idx + 1] >= 0 ? '+' : '';
                            str += val + 'x' + operator;
                        }
                        else {
                            operator = coeffs[idx + 1] >= 0 ? '+' : '';
                            str += val + 'x<sup>' + pow + '</sup>' + operator;
                        }
                    });
                    return str;
                };
                return PolyHelper;
            }(LeastSquaresHelper));
            var FourierHelper = /** @class */ (function (_super) {
                __extends(FourierHelper, _super);
                function FourierHelper(y, x, count, order) {
                    var _this = this;
                    order = order == null ? x.length : order;
                    _this = _super.call(this, y, x, count, order) || this;
                    return _this;
                }
                //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
                FourierHelper.prototype._createBasis = function () {
                    _super.prototype._createBasis.call(this);
                    var x = this.x, bas = this.basis, order = this.order;
                    x.forEach(function (v, row) {
                        var col, n;
                        bas[row] = [1];
                        for (col = 1; col < order; col++) {
                            n = Math.floor((col + 1) / 2);
                            if (col % 2 === 1) {
                                bas[row].push(Math.cos(n * v));
                            }
                            else {
                                bas[row].push(Math.sin(n * v));
                            }
                        }
                    });
                };
                FourierHelper.prototype.calcY = function (xval) {
                    var coeffs = this._coefficients, yval;
                    coeffs.forEach(function (v, i) {
                        var k = Math.floor((i + 1) / 2), val;
                        if (i === 0) {
                            yval = v;
                        }
                        else {
                            val = k * xval;
                            if ((i % 2) === 1) {
                                yval += v * Math.cos(val);
                            }
                            else {
                                yval += v * Math.sin(val);
                            }
                        }
                    });
                    return yval;
                };
                FourierHelper.prototype._concatEquation = function (equations) {
                    //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
                    var str = 'y = ', len = equations.length, coeffs = this.coefficients;
                    equations.forEach(function (val, idx) {
                        var operator = idx === len - 1 ? '' : (coeffs[idx + 1] >= 0 ? '+' : ''), sincos = '', x = Math.ceil(idx / 2);
                        if (idx === 0) {
                            str += val + operator;
                        }
                        else {
                            var sincos = (idx % 2 === 1) ? 'cos' : 'sin';
                            sincos += '(' + (x === 1 ? '' : String(x)) + 'x)';
                            str += val + sincos + operator;
                        }
                    });
                    return str;
                };
                return FourierHelper;
            }(LeastSquaresHelper));
            var SimpleTrendHelper = /** @class */ (function (_super) {
                __extends(SimpleTrendHelper, _super);
                function SimpleTrendHelper(y, x, count) {
                    var _this = _super.call(this, y, x, count) || this;
                    _this._calculateCoefficients();
                    return _this;
                }
                SimpleTrendHelper.prototype._setVal = function (val) {
                    this._val = val;
                };
                SimpleTrendHelper.prototype.calcY = function (xval) {
                    return this._val;
                };
                return SimpleTrendHelper;
            }(TrendHelperBase));
            var MinXHelper = /** @class */ (function (_super) {
                __extends(MinXHelper, _super);
                function MinXHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                MinXHelper.prototype.calculateValues = function () {
                    var xMin = this.xMin, yMin = MathHelper.min(this.y), yMax = MathHelper.max(this.y), valsX, valsY;
                    if (this._isXString) {
                        xMin = xMin - 1;
                    }
                    valsX = [xMin, xMin];
                    valsY = [yMin, yMax];
                    this._setVal(xMin);
                    return [valsY, valsX];
                };
                MinXHelper.prototype.getEquation = function (fmt) {
                    var xMin = this.xMin;
                    if (this._isXString) {
                        xMin = xMin - 1;
                    }
                    if (fmt) {
                        xMin = fmt(xMin);
                    }
                    return 'x = ' + xMin;
                };
                return MinXHelper;
            }(SimpleTrendHelper));
            var MinYHelper = /** @class */ (function (_super) {
                __extends(MinYHelper, _super);
                function MinYHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                MinYHelper.prototype.calculateValues = function () {
                    var xMin = this.xMin, xMax = this.xMax, yMin = MathHelper.min(this.y), valsX, valsY;
                    if (this._isXString) {
                        xMin = xMin - 1;
                        xMax = xMax - 1;
                    }
                    valsX = [xMin, xMax];
                    valsY = [yMin, yMin];
                    this._setVal(yMin);
                    return [valsY, valsX];
                };
                MinYHelper.prototype.getEquation = function (fmt) {
                    var yMin = MathHelper.min(this.y);
                    if (fmt) {
                        yMin = fmt(yMin);
                    }
                    return 'y = ' + yMin;
                };
                return MinYHelper;
            }(SimpleTrendHelper));
            var MaxXHelper = /** @class */ (function (_super) {
                __extends(MaxXHelper, _super);
                function MaxXHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                MaxXHelper.prototype.calculateValues = function () {
                    var xMax = this.xMax, yMin = MathHelper.min(this.y), yMax = MathHelper.max(this.y), valsX, valsY;
                    if (this._isXString) {
                        xMax = xMax - 1;
                    }
                    valsX = [xMax, xMax];
                    valsY = [yMin, yMax];
                    this._setVal(xMax);
                    return [valsY, valsX];
                };
                MaxXHelper.prototype.getEquation = function (fmt) {
                    var xMax = this.xMax;
                    if (this._isXString) {
                        xMax = xMax - 1;
                    }
                    if (fmt) {
                        xMax = fmt(xMax);
                    }
                    return 'x = ' + xMax;
                };
                return MaxXHelper;
            }(SimpleTrendHelper));
            var MaxYHelper = /** @class */ (function (_super) {
                __extends(MaxYHelper, _super);
                function MaxYHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                MaxYHelper.prototype.calculateValues = function () {
                    var xMin = this.xMin, xMax = this.xMax, yMax = MathHelper.max(this.y), valsX, valsY;
                    if (this._isXString) {
                        xMin = xMin - 1;
                        xMax = xMax - 1;
                    }
                    valsX = [xMin, xMax];
                    valsY = [yMax, yMax];
                    this._setVal(yMax);
                    return [valsY, valsX];
                };
                MaxYHelper.prototype.getEquation = function (fmt) {
                    var yMax = MathHelper.max(this.y);
                    if (fmt) {
                        yMax = fmt(yMax);
                    }
                    return 'y = ' + yMax;
                };
                return MaxYHelper;
            }(SimpleTrendHelper));
            var AverageXHelper = /** @class */ (function (_super) {
                __extends(AverageXHelper, _super);
                function AverageXHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                AverageXHelper.prototype.calculateValues = function () {
                    var xAverage = MathHelper.avg(this.x), yMin = MathHelper.min(this.y), yMax = MathHelper.max(this.y), valsX, valsY;
                    if (this._isXString) {
                        xAverage = xAverage - 1;
                    }
                    valsX = [xAverage, xAverage];
                    valsY = [yMin, yMax];
                    this._setVal(xAverage);
                    return [valsY, valsX];
                };
                AverageXHelper.prototype._getEquation = function (fmt) {
                    var xAverage = MathHelper.avg(this.x);
                    if (this._isXString) {
                        xAverage = xAverage - 1;
                    }
                    if (fmt) {
                        xAverage = fmt(xAverage);
                    }
                    return ' x =' + xAverage;
                };
                AverageXHelper.prototype._defaultEquationFmt = function (coefficient) {
                    if (Math.abs(coefficient) < 1e5) {
                        return _super.prototype._defaultEquationFmt.call(this, coefficient);
                    }
                    return '' + MathHelper.round(coefficient, 2);
                };
                return AverageXHelper;
            }(SimpleTrendHelper));
            var AverageYHelper = /** @class */ (function (_super) {
                __extends(AverageYHelper, _super);
                function AverageYHelper(y, x, count) {
                    return _super.call(this, y, x, count) || this;
                }
                AverageYHelper.prototype.calculateValues = function () {
                    var yAverage = MathHelper.avg(this.y), xMin = this.xMin, xMax = this.xMax, valsX, valsY;
                    if (this._isXString) {
                        xMin = xMin - 1;
                        xMax = xMax - 1;
                    }
                    valsX = [xMin, xMax];
                    valsY = [yAverage, yAverage];
                    this._setVal(yAverage);
                    return [valsY, valsX];
                };
                AverageYHelper.prototype._getEquation = function (fmt) {
                    var yAverage = fmt(MathHelper.avg(this.y));
                    return 'y = ' + yAverage;
                };
                AverageYHelper.prototype._defaultEquationFmt = function (coefficient) {
                    return Math.abs(coefficient) < 1e5
                        ? _super.prototype._defaultEquationFmt.call(this, coefficient)
                        : '' + MathHelper.round(coefficient, 2);
                };
                return AverageYHelper;
            }(SimpleTrendHelper));
            var TrendLineHelper = {
                TrendHelperBase: TrendHelperBase,
                Linear: LinearHelper,
                Exponential: ExpHelper,
                Logarithmic: LogHelper,
                Power: PowerHelper,
                Polynomial: PolyHelper,
                Fourier: FourierHelper,
                MinX: MinXHelper,
                MinY: MinYHelper,
                MaxX: MaxXHelper,
                MaxY: MaxYHelper,
                AverageX: AverageXHelper,
                AverageY: AverageYHelper
            };
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents a base class of function series for {@link FlexChart}.
             */
            var FunctionSeries = /** @class */ (function (_super) {
                __extends(FunctionSeries, _super);
                /**
                 * Initializes a new instance of the {@link FunctionSeries} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function FunctionSeries(options) {
                    var _this = _super.call(this) || this;
                    _this._min = 0;
                    _this._max = 1;
                    _this.initialize(options);
                    if (_this.itemsSource == null) {
                        _this.itemsSource = [new wijmo.Point(0, 0)];
                    }
                    return _this;
                }
                Object.defineProperty(FunctionSeries.prototype, "min", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the minimum value of the parameter for calculating a function.
                     */
                    get: function () {
                        return this._min;
                    },
                    set: function (value) {
                        if (this._min !== value) {
                            this._min = wijmo.asNumber(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FunctionSeries.prototype, "max", {
                    /**
                     * Gets or sets the maximum value of the parameter for calculating a function.
                     */
                    get: function () {
                        return this._max;
                    },
                    set: function (value) {
                        if (this._max !== value) {
                            this._max = wijmo.asNumber(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                FunctionSeries.prototype.getValues = function (dim) {
                    var self = this;
                    if (self._xValues == null || self._yValues == null) {
                        self._calculateValues();
                    }
                    if (dim === 0) {
                        //y
                        return self._yValues || null;
                    }
                    else if (dim === 1) {
                        //x
                        return self._xValues || null;
                    }
                };
                FunctionSeries.prototype._calculateValues = function () {
                    var self = this, npts = self.sampleCount, x = [], y = [], delta = (self.max - self.min) / (npts - 1), t;
                    for (var i = 0; i < npts; i++) {
                        t = i === npts - 1 ? this.max : this.min + delta * i;
                        x[i] = self._calculateX(t);
                        y[i] = self._calculateY(t);
                    }
                    self._yValues = y;
                    self._xValues = x;
                };
                // performs simple validation of data value
                FunctionSeries.prototype._validateValue = function (value) {
                    return isFinite(value) ? value : Number.NaN;
                };
                // calculate the value of the function
                FunctionSeries.prototype._calculateValue = function (func, parameter) {
                    var value;
                    try {
                        value = func(parameter);
                    }
                    catch (ex) {
                        value = Number.NaN;
                    }
                    return this._validateValue(value);
                };
                FunctionSeries.prototype._calculateX = function (value) {
                    return 0;
                };
                FunctionSeries.prototype._calculateY = function (value) {
                    return 0;
                };
                return FunctionSeries;
            }(analytics.TrendLineBase));
            analytics.FunctionSeries = FunctionSeries;
            /**
             * Represents a Y function series of {@link FlexChart}.
             *
             * The {@link YFunctionSeries} plots a function defined by formulas
             * of type y=f(x), specified using the {@link func} property.
             */
            var YFunctionSeries = /** @class */ (function (_super) {
                __extends(YFunctionSeries, _super);
                /**
                 * Initializes a new instance of the {@link YFunctionSeries} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function YFunctionSeries(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(YFunctionSeries.prototype, "func", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the function used to calculate Y value.
                     */
                    get: function () {
                        return this._func;
                    },
                    set: function (value) {
                        if (value && this._func !== value) {
                            this._func = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                YFunctionSeries.prototype._calculateX = function (value) {
                    return value;
                };
                YFunctionSeries.prototype._calculateY = function (value) {
                    return this._calculateValue(this.func, value);
                };
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                YFunctionSeries.prototype.approximate = function (x) {
                    return this._calculateValue(this.func, x);
                };
                return YFunctionSeries;
            }(FunctionSeries));
            analytics.YFunctionSeries = YFunctionSeries;
            /**
             * Represents a parametric function series for {@link FlexChart}.
             *
             * The {@link ParametricFunctionSeries} plots a function defined by formulas
             * x=f(t) and y=f(t).
             *
             * The x and y values are calculated by the functions assigned to the
             * {@link xFunc} and {@link yFunc} properties.
             */
            var ParametricFunctionSeries = /** @class */ (function (_super) {
                __extends(ParametricFunctionSeries, _super);
                /**
                 * Initializes a new instance of the {@link ParametricFunctionSeries} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function ParametricFunctionSeries(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(ParametricFunctionSeries.prototype, "xFunc", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the function used to calculate the x value.
                     */
                    get: function () {
                        return this._xFunc;
                    },
                    set: function (value) {
                        if (value && this._xFunc !== value) {
                            this._xFunc = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ParametricFunctionSeries.prototype, "yFunc", {
                    /**
                     * Gets or sets the function used to calculate the y value.
                     */
                    get: function () {
                        return this._yFunc;
                    },
                    set: function (value) {
                        if (value && this._yFunc !== value) {
                            this._yFunc = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                ParametricFunctionSeries.prototype._calculateX = function (value) {
                    return this._calculateValue(this.xFunc, value);
                };
                ParametricFunctionSeries.prototype._calculateY = function (value) {
                    return this._calculateValue(this.yFunc, value);
                };
                /**
                 * Gets the approximate x and y from the given value.
                 *
                 * @param value The value to calculate.
                 */
                ParametricFunctionSeries.prototype.approximate = function (value) {
                    var self = this, x = this._calculateValue(this.xFunc, value), y = this._calculateValue(this.yFunc, value);
                    //add <any> for compiling error.
                    return new wijmo.Point(x, y);
                };
                return ParametricFunctionSeries;
            }(FunctionSeries));
            analytics.ParametricFunctionSeries = ParametricFunctionSeries;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart_2) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Specifies the meaning of the {@link ErrorBar}'s {@link ErrorBar.value} property.
             */
            var ErrorAmount;
            (function (ErrorAmount) {
                /** The value property represents the error as an absolute value. */
                ErrorAmount[ErrorAmount["FixedValue"] = 0] = "FixedValue";
                /** The value property represents the error as a percentage. */
                ErrorAmount[ErrorAmount["Percentage"] = 1] = "Percentage";
                /** The value property represents the error as a number of standard deviations. */
                ErrorAmount[ErrorAmount["StandardDeviation"] = 2] = "StandardDeviation";
                /** The error is the standard error of the mean (value property is not used). */
                ErrorAmount[ErrorAmount["StandardError"] = 3] = "StandardError";
                /** Error values are bound through the {@link ErrorBar.binding} property or set to an object with 'plus' and 'minus' values. */
                ErrorAmount[ErrorAmount["Custom"] = 4] = "Custom";
            })(ErrorAmount = analytics.ErrorAmount || (analytics.ErrorAmount = {}));
            /**
             * Specifies the end style of the error bars.
             */
            var ErrorBarEndStyle;
            (function (ErrorBarEndStyle) {
                /** Error bars end with a cap. */
                ErrorBarEndStyle[ErrorBarEndStyle["Cap"] = 0] = "Cap";
                /** Error bars are simple lines. */
                ErrorBarEndStyle[ErrorBarEndStyle["NoCap"] = 1] = "NoCap";
            })(ErrorBarEndStyle = analytics.ErrorBarEndStyle || (analytics.ErrorBarEndStyle = {}));
            /**
             * Specifies the direction of the error bar.
             */
            var ErrorBarDirection;
            (function (ErrorBarDirection) {
                /** Show errors in both directions. */
                ErrorBarDirection[ErrorBarDirection["Both"] = 0] = "Both";
                /** Show errors only in the minus direction. */
                ErrorBarDirection[ErrorBarDirection["Minus"] = 1] = "Minus";
                /** Show errors only in the plus direction. */
                ErrorBarDirection[ErrorBarDirection["Plus"] = 2] = "Plus";
            })(ErrorBarDirection = analytics.ErrorBarDirection || (analytics.ErrorBarDirection = {}));
            /**
             * Represents an {@link ErrorBar} series on a {@link FlexChart}.
             *
             * The {@link ErrorBar} series shows error margins and standard deviations
             * at a glance. They can be shown as a standard error amounts, percentages,
             * or standard deviation.
             *
             * You can also set the error values explicitly to display the exact
             * amounts you want.
             */
            var ErrorBar = /** @class */ (function (_super) {
                __extends(ErrorBar, _super);
                /**
                 * Initializes a new instance of the {@link ErrorBar} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function ErrorBar(options) {
                    var _this = _super.call(this) || this;
                    _this._errorAmount = ErrorAmount.FixedValue;
                    _this._endStyle = ErrorBarEndStyle.Cap;
                    _this._direction = ErrorBarDirection.Both;
                    _this.rendering.addHandler(_this._rendering, _this);
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(ErrorBar.prototype, "value", {
                    /**
                     * Gets or sets a value that specifies the error value of the series.
                     *
                     * This property works with the {@link errorAmount} property.
                     */
                    get: function () {
                        return this._value;
                    },
                    set: function (value) {
                        if (value != this._value) {
                            this._value = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "errorAmount", {
                    /**
                     * Gets or sets a value that specifies the meaning of the
                     * {@link value} property.
                     */
                    get: function () {
                        return this._errorAmount;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, ErrorAmount, true);
                        if (value != this._errorAmount) {
                            this._errorAmount = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "errorBarStyle", {
                    /**
                     * Gets or sets the style used to render the error bars.
                     */
                    get: function () {
                        return this._errorBarStyle;
                    },
                    set: function (value) {
                        if (value != this._errorBarStyle) {
                            this._errorBarStyle = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "endStyle", {
                    /**
                     * Gets or sets a value that specifies the end style of the error bars.
                     */
                    get: function () {
                        return this._endStyle;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, ErrorBarEndStyle, true);
                        if (value != this._endStyle) {
                            this._endStyle = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "direction", {
                    /**
                     * Gets or sets a value that specifies the direction of the error bars.
                     */
                    get: function () {
                        return this._direction;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, ErrorBarDirection, true);
                        if (value != this._direction) {
                            this._direction = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // ** implementation
                ErrorBar.prototype.getDataRect = function (currentRect, calculatedRect) {
                    // too late to get values in chart's rendering event.
                    if (!currentRect) {
                        return null;
                    }
                    // calculate error value and only calculate one time.
                    var chart = this._chart, errorAmount = this.errorAmount, s, minPadding = 0, maxPadding = 0, len;
                    this._paddings = [];
                    this._calculateErrorValue();
                    var yVals = this.getValues(0), yMin = currentRect.top, yMax = currentRect.bottom, i, val;
                    if (!yVals) {
                        return currentRect;
                    }
                    for (i = 0, len = yVals.length; i < len; i++) {
                        var padding = {
                            plus: 0,
                            val: 0,
                            minus: 0
                        };
                        var v = this._value || 0;
                        val = yVals[i];
                        switch (errorAmount) {
                            case ErrorAmount.Custom:
                                padding = this._getCustomValue(i);
                                padding.val = val;
                                this._paddings.push(padding);
                                break;
                            case ErrorAmount.FixedValue:
                                this._paddings.push({
                                    plus: v,
                                    minus: v,
                                    val: val
                                });
                                break;
                            case ErrorAmount.Percentage:
                                this._paddings.push({
                                    plus: val * v,
                                    minus: val * v,
                                    val: val
                                });
                                break;
                            case ErrorAmount.StandardDeviation:
                                this._paddings.push({
                                    plus: this._errorValue * v,
                                    minus: this._errorValue * v,
                                    val: val
                                });
                                break;
                            case ErrorAmount.StandardError:
                                this._paddings.push({
                                    plus: this._errorValue,
                                    minus: this._errorValue,
                                    val: val
                                });
                                break;
                        }
                        // for ErrorAmount.Custom
                        if (isNaN(yMin) || yMin > val - padding.minus) {
                            yMin = val - padding.minus;
                        }
                        if (isNaN(yMax) || yMax < val + padding.plus) {
                            yMax = val + padding.plus;
                        }
                    }
                    switch (errorAmount) {
                        case ErrorAmount.FixedValue:
                            minPadding = v;
                            maxPadding = v;
                            break;
                        case ErrorAmount.Percentage:
                            minPadding = yMin * v;
                            maxPadding = yMax * v;
                            break;
                        case ErrorAmount.StandardDeviation:
                            minPadding = this._errorValue * v;
                            maxPadding = this._errorValue * v;
                            break;
                        case ErrorAmount.StandardError:
                            minPadding = this._errorValue;
                            maxPadding = this._errorValue;
                            break;
                    }
                    if (this._showPlus) {
                        yMax += maxPadding;
                    }
                    if (this._showMinus) {
                        yMin -= minPadding;
                    }
                    return new wijmo.Rect(currentRect.left, yMin, currentRect.width, yMax - yMin);
                };
                ErrorBar.prototype._getCustomValue = function (i) {
                    var vals = this.value, v = {
                        minus: 0,
                        val: 0,
                        plus: 0
                    }, val;
                    if (this._minusBindingValues != null || this._plusBindingValues != null) {
                        v.minus = (this._minusBindingValues && this._minusBindingValues[i]) || 0;
                        v.plus = (this._plusBindingValues && this._plusBindingValues[i]) || 0;
                        return v;
                    }
                    if (vals == null) {
                        return v;
                    }
                    if (wijmo.isArray(vals)) {
                        val = vals[i];
                        if (val && val.minus) {
                            v.minus = val.minus;
                        }
                        if (val && val.plus) {
                            v.plus = val.plus;
                        }
                    }
                    else {
                        if (wijmo.isNumber(vals)) {
                            v.minus = vals;
                            v.plus = vals;
                        }
                        else {
                            if (vals.minus) {
                                v.minus = vals.minus;
                            }
                            if (vals.plus) {
                                v.plus = vals.plus;
                            }
                        }
                    }
                    return v;
                };
                ErrorBar.prototype._calculateErrorValue = function () {
                    var total = 0, count = 0, mean = 0;
                    if (this._errorAmount === ErrorAmount.StandardDeviation || this._errorAmount === ErrorAmount.StandardError) {
                        var vals = this.getValues(0);
                        if (vals != null) {
                            vals.forEach(function (v) {
                                total += v;
                                count++;
                            });
                            mean = total / count;
                            this._mean = mean;
                            total = 0;
                            vals.forEach(function (v) {
                                total += Math.pow(v - mean, 2);
                            });
                            this._errorValue = Math.sqrt(total / (count - 1));
                        }
                        if (this._errorAmount == ErrorAmount.StandardError) {
                            this._errorValue = this._errorValue / Math.sqrt(count);
                        }
                    }
                };
                ErrorBar.prototype._clearValues = function () {
                    this.__errorValue = null;
                    this._mean = null;
                    this._plusBindingValues = null;
                    this._minusBindingValues = null;
                    _super.prototype._clearValues.call(this);
                };
                ErrorBar.prototype.getValues = function (dim) {
                    if (dim == 0 && this.errorAmount === ErrorAmount.Custom) {
                        var plusBinding = this._getBinding(1);
                        var minusBinding = this._getBinding(2);
                        if ((this._plusBindingValues == null || this._minusBindingValues == null) && plusBinding && minusBinding) {
                            if (this._cv != null) {
                                if (plusBinding) {
                                    var plusDA = this._bindValues(this._cv.items, plusBinding);
                                    this._plusBindingValues = plusDA.values;
                                }
                                if (minusBinding) {
                                    var minusDA = this._bindValues(this._cv.items, minusBinding);
                                    this._minusBindingValues = minusDA.values;
                                }
                            }
                            else if (this.binding != null) {
                                if (this._chart != null && this._chart.collectionView != null) {
                                    if (plusBinding) {
                                        var plusDA = this._bindValues(this._chart.collectionView.items, plusBinding);
                                        this._plusBindingValues = plusDA.values;
                                    }
                                    if (minusBinding) {
                                        var minusDA = this._bindValues(this._chart.collectionView.items, minusBinding);
                                        this._minusBindingValues = minusDA.values;
                                    }
                                }
                            }
                        }
                    }
                    return _super.prototype.getValues.call(this, dim);
                };
                Object.defineProperty(ErrorBar.prototype, "_chart", {
                    get: function () {
                        return this.__chart;
                    },
                    set: function (value) {
                        if (value !== this.__chart) {
                            this.__chart = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "_errorValue", {
                    get: function () {
                        return this.__errorValue;
                    },
                    set: function (value) {
                        if (value != this.__errorValue) {
                            this.__errorValue = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "_showPlus", {
                    get: function () {
                        return this.direction === ErrorBarDirection.Both || this.direction === ErrorBarDirection.Plus;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ErrorBar.prototype, "_showMinus", {
                    get: function () {
                        return this.direction === ErrorBarDirection.Both || this.direction === ErrorBarDirection.Minus;
                    },
                    enumerable: true,
                    configurable: true
                });
                ErrorBar.prototype._rendering = function (sender, args) {
                    var _this = this;
                    this._errorBarEles = [];
                    args.cancel = true;
                    var chart = this.chart, r = chart._plotRect, axisY = this._getAxisY(), axisX = this._getAxisX(), origin = axisY.origin || 0, engine = args.engine, si = chart.series.indexOf(this), plotter = this._plotter;
                    //draw plotter elements
                    plotter.plotSeries(engine, axisX, axisY, this, chart, args.index, args.count, function (points) {
                        //draw error bars.
                        var paddings = _this._paddings, showPlus = _this._showPlus, showMinus = _this._showMinus, chartRotated = chart._isRotated(), off = (_this.errorBarStyle && _this.errorBarStyle['stroke-width']) || 2, offset, axis, actualMax;
                        if (chartRotated) {
                            axis = axisX;
                        }
                        else {
                            axis = axisY;
                        }
                        actualMax = axis.actualMax;
                        offset = axis.convert(actualMax);
                        var stroke = engine.stroke;
                        var strokeWidth = engine.strokeWidth;
                        //set default style the same as in Excel.
                        engine.stroke = 'black';
                        engine.strokeWidth = 1;
                        var clipID = _this.chart._plotrectId;
                        engine.startGroup(null, clipID);
                        points && points.length && points.forEach(function (p, i) {
                            if (p != null && p.x != null && p.y != null) {
                                var padding = paddings[i];
                                var minus = (padding && padding.minus) || 0;
                                var plus = (padding && padding.plus) || 0;
                                var minusOff = Math.abs(axis.convert(actualMax - minus) - offset);
                                var plusOff = Math.abs(axis.convert(actualMax + plus) - offset);
                                var start = new wijmo.Point(p.x, p.y);
                                var end = new wijmo.Point(p.x, p.y);
                                if (chartRotated) {
                                    if (_this.errorAmount === ErrorAmount.StandardDeviation) {
                                        p = new wijmo.Point(axis.convert(_this._mean), p.y);
                                        start.x = p.x;
                                        end.x = p.x;
                                    }
                                    if (showMinus) {
                                        start.x = start.x - minusOff;
                                    }
                                    if (showPlus) {
                                        end.x = end.x + plusOff;
                                    }
                                }
                                else {
                                    if (_this.errorAmount === ErrorAmount.StandardDeviation) {
                                        p = new wijmo.Point(p.x, axis.convert(_this._mean));
                                        start.y = p.y;
                                        end.y = p.y;
                                    }
                                    if (showMinus) {
                                        start.y = start.y + minusOff;
                                    }
                                    if (showPlus) {
                                        end.y = end.y - plusOff;
                                    }
                                }
                                var rect = void 0;
                                if (chartRotated) {
                                    rect = new wijmo.Rect(start.x, start.y - off, Math.abs(end.x - start.x), off * 2);
                                }
                                else {
                                    rect = new wijmo.Rect(end.x - off, end.y, off * 2, Math.abs(end.y - start.y));
                                }
                                var area = new wijmo.chart._RectArea(rect);
                                area.ignoreLabel = true;
                                var dp = new wijmo.chart._DataPoint(si, i, i, padding.val);
                                area.tag = dp;
                                plotter.hitTester.add(area, si);
                                //let ele = engine.drawLine(Math.max(start.x, r.left), Math.min(start.y, r.bottom), Math.min(end.x, r.right), Math.max(end.y, r.top), 'error-bar', this.errorBarStyle);
                                var ele = engine.drawLine(start.x, start.y, end.x, end.y, 'error-bar', _this.errorBarStyle);
                                var eles = [ele];
                                _this._errorBarEles[i] = eles;
                                if (_this.endStyle === ErrorBarEndStyle.Cap) {
                                    if (showPlus) {
                                        var plusEle = void 0;
                                        if (chartRotated) {
                                            if (end.x <= r.right) {
                                                plusEle = engine.drawLine(end.x, end.y - off, end.x, end.y + off, 'error-bar', _this.errorBarStyle);
                                                eles.push(plusEle);
                                            }
                                        }
                                        else {
                                            if (end.y >= r.top) {
                                                plusEle = engine.drawLine(end.x - off, end.y, end.x + off, end.y, 'error-bar', _this.errorBarStyle);
                                                eles.push(plusEle);
                                            }
                                        }
                                    }
                                    if (showMinus) {
                                        var minusEle = void 0;
                                        if (chartRotated) {
                                            if (start.x >= r.left) {
                                                minusEle = engine.drawLine(start.x, start.y - off, start.x, start.y + off, 'error-bar', _this.errorBarStyle);
                                                eles.push(minusEle);
                                            }
                                        }
                                        else {
                                            if (start.y <= r.bottom) {
                                                minusEle = engine.drawLine(start.x - off, start.y, start.x + off, start.y, 'error-bar', _this.errorBarStyle);
                                                eles.push(minusEle);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        engine.endGroup();
                        engine.stroke = stroke;
                        engine.strokeWidth = strokeWidth;
                    });
                };
                /**
                 * Gets the plot element that corresponds to the specified point index.
                 *
                 * @param pointIndex The index of the data point.
                 */
                ErrorBar.prototype.getPlotElement = function (pointIndex) {
                    if (this.hostElement) {
                        if (pointIndex < this._pointIndexes.length) {
                            var eles = this._errorBarEles[pointIndex] == null ? [] : this._errorBarEles[pointIndex].slice();
                            var elementIndex = this._pointIndexes[pointIndex];
                            if (elementIndex < this.hostElement.childNodes.length) {
                                eles.push(this.hostElement.childNodes[elementIndex]);
                            }
                            return eles;
                        }
                    }
                    return null;
                };
                return ErrorBar;
            }(wijmo.chart.Series));
            analytics.ErrorBar = ErrorBar;
        })(analytics = chart_2.analytics || (chart_2.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            wijmo._addCultureInfo('FlexChartAnalytics', {
                BreakEven: {
                    profitArea: 'Profit Area',
                    lossArea: 'Loss Area',
                    safetyMargin: 'Safety Margin',
                    salesRevenue: 'Sales Revenue',
                    totalCost: 'Total Cost',
                    fixedCost: 'Fixed Cost',
                    variableCost: 'Variable Cost',
                    marginalProfit: 'Marginal Profit',
                    breakEven: 'Break Even'
                }
            });
            /**
             * Represents a Break Even chart series.
             *
             * A break even chart is a chart that shows the sales volume level at which total costs equal sales.
             * Use the styles property to customize appearance of different parts of Break Even chart.
             * The name property contains comma-separated names that are shown as legend entries.
             */
            var BreakEven = /** @class */ (function (_super) {
                __extends(BreakEven, _super);
                /**
                 * Initializes a new instance of the {@link BreakEven} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function BreakEven(options) {
                    var _this = _super.call(this) || this;
                    _this.rendering.addHandler(_this._rendering, _this);
                    // default colors
                    _this.style = {
                        fill: 'rgba(0,255,0,0.5)',
                        strokeWidth: 0
                    };
                    _this.altStyle = {
                        fill: 'rgba(255,0,0,0.5)',
                        strokeWidth: 0
                    };
                    _this.tooltipContent = '{y}';
                    _this.initialize(options);
                    _this._chartType = wijmo.chart.ChartType.Line;
                    //this.name = "Profit Area,Loss Area,Safety Margin,Sales Revenue,Total Cost,Fixed Cost,Variable Cost,Marginal Profit,Break Even";
                    var cul = wijmo.culture.FlexChartAnalytics.BreakEven;
                    _this.name = cul.profitArea + ',' + cul.lossArea + ',' + cul.safetyMargin + ',' + cul.salesRevenue + ',' +
                        cul.totalCost + ',' + cul.fixedCost + ',' + cul.variableCost + ',' + cul.marginalProfit + ',' + cul.breakEven;
                    return _this;
                }
                Object.defineProperty(BreakEven.prototype, "fixedCost", {
                    /**
                     * Gets or sets a value of fixed cost.
                     */
                    get: function () {
                        return this._fixedCost;
                    },
                    set: function (value) {
                        if (value != this._fixedCost) {
                            this._fixedCost = wijmo.asNumber(value, true, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BreakEven.prototype, "variableCost", {
                    /**
                     * Gets or sets a value of variable cost.
                     */
                    get: function () {
                        return this._variableCost;
                    },
                    set: function (value) {
                        if (value != this._variableCost) {
                            this._variableCost = wijmo.asNumber(value, true, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BreakEven.prototype, "salesPrice", {
                    /**
                     * Gets or sets a value of sales price.
                     */
                    get: function () {
                        return this._salesPrice;
                    },
                    set: function (value) {
                        if (value != this._salesPrice) {
                            this._salesPrice = wijmo.asNumber(value, true, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BreakEven.prototype, "styles", {
                    /**
                     * Gets or sets the styles of Break Even chart.
                     *
                     * The following styles are supported:
                     *
                     * <ol>
                     *   <li><b>fixedCost</b>: Specifies the style of the fixed cost.</li>
                     *   <li><b>variableCost</b>: Specifies the style of the variable cost.</li>
                     *   <li><b>totalCost</b>: Specifies the style of the total cost.</li>
                     *   <li><b>salesRevenue</b>: Specifies the style of the sales revenue.</li>
                     *   <li><b>safetyMargin</b>: Specifies the style of the safety margin.</li>
                     *   <li><b>marginalProfit</b>: Specifies the style of the marginal profit.</li>
                     *   <li><b>breakEven</b>: Specifies the style of the break even.</li>
                     * </ol>
                     *
                     * The style of profit and loss areas is specified by the style and altStyle properties.
                     */
                    get: function () {
                        return this._styles;
                    },
                    set: function (value) {
                        if (value !== this._styles) {
                            this._styles = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                BreakEven.prototype.getValues = function (dim) {
                    var contr = this.salesPrice - this.variableCost;
                    if (contr == 0) {
                        return null;
                    }
                    var q = this.fixedCost / contr;
                    var maxQ = 1.3 * q;
                    var values = [];
                    for (var i = 0; i < 10; i++) {
                        if (dim == 0) {
                            values.push(((i * maxQ) / 10) * this.salesPrice);
                        }
                        else if (dim == 1) {
                            values.push((i * maxQ) / 10);
                        }
                    }
                    return values;
                };
                BreakEven.prototype._rendering = function (sender, args) {
                    var pr = this.chart._plotRect;
                    var eng = args.engine;
                    var ax = this.chart.axisX;
                    var ay = this.chart.axisY;
                    var xs = this.getValues(1);
                    var ys = this.getValues(0);
                    var contr = this.salesPrice - this.variableCost;
                    var q = this.fixedCost / contr;
                    var totalCostEnd = this.fixedCost + ys[ys.length - 1] - contr * xs[xs.length - 1];
                    var clipID = this.chart._plotrectId;
                    eng.startGroup(null, clipID);
                    if (this.style) {
                        if (this.style.fill) {
                            eng.fill = this.style.fill;
                            eng.drawPolygon([
                                ax.convert(xs[xs.length - 1]),
                                ax.convert(q),
                                ax.convert(xs[xs.length - 1])
                            ], [
                                ay.convert(ys[ys.length - 1]),
                                ay.convert(q * this.salesPrice),
                                ay.convert(totalCostEnd)
                            ]);
                            eng.fill = null;
                        }
                    }
                    if (this.altStyle) {
                        if (this.altStyle.fill) {
                            eng.fill = this.altStyle.fill;
                            eng.drawPolygon([ax.convert(xs[0]), ax.convert(q), ax.convert(xs[0])], [
                                ay.convert(0),
                                ay.convert(q * this.salesPrice),
                                ay.convert(this.fixedCost)
                            ]);
                            eng.fill = null;
                        }
                    }
                    var safetyMarginStyle = this.styles ? this.styles.safetyMargin : undefined;
                    var salesRevenueStyle = this.styles ? this.styles.salesRevenue : undefined;
                    var totalCostStyle = this.styles ? this.styles.totalCost : undefined;
                    var fixedCostStyle = this.styles ? this.styles.fixedCost : undefined;
                    var variableCostStyle = this.styles ? this.styles.variableCost : undefined;
                    var marginalProfitStyle = this.styles ? this.styles.marginalProfit : undefined;
                    var breakEvenStyle = this.styles ? this.styles.breakEven : undefined;
                    if (safetyMarginStyle && safetyMarginStyle.fill) {
                        eng.fill = safetyMarginStyle.fill;
                        eng.drawPolygon([
                            ax.convert(xs[xs.length - 1]),
                            ax.convert(q),
                            ax.convert(xs[xs.length - 1])
                        ], [
                            ay.convert(xs[xs.length - 1] * (this.salesPrice - this.variableCost)),
                            ay.convert(this.fixedCost),
                            ay.convert(this.fixedCost)
                        ]);
                        eng.fill = null;
                    }
                    if (salesRevenueStyle) {
                        this._setStyle(eng, salesRevenueStyle);
                        eng.drawLine(ax.convert(0), ay.convert(0), ax.convert(xs[xs.length - 1]), ay.convert(ys[ys.length - 1]));
                    }
                    if (totalCostStyle) {
                        this._setStyle(eng, totalCostStyle);
                        eng.drawLine(ax.convert(xs[0]), ay.convert(this.fixedCost), ax.convert(xs[xs.length - 1]), ay.convert(totalCostEnd));
                    }
                    if (fixedCostStyle) {
                        this._setStyle(eng, fixedCostStyle);
                        eng.drawLine(ax.convert(xs[0]), ay.convert(this.fixedCost), ax.convert(xs[xs.length - 1]), ay.convert(this.fixedCost));
                    }
                    if (variableCostStyle) {
                        this._setStyle(eng, variableCostStyle);
                        eng.drawLine(ax.convert(xs[0]), ay.convert(0), ax.convert(xs[xs.length - 1]), ay.convert(xs[xs.length - 1] * this.variableCost));
                    }
                    if (marginalProfitStyle) {
                        this._setStyle(eng, marginalProfitStyle);
                        eng.drawLine(ax.convert(xs[0]), ay.convert(0), ax.convert(xs[xs.length - 1]), ay.convert(xs[xs.length - 1] * (this.salesPrice - this.variableCost)));
                    }
                    if (breakEvenStyle) {
                        this._setStyle(eng, breakEvenStyle);
                        eng.drawLine(ax.convert(q), ay.convert(0), ax.convert(q), ay.convert(q * this.salesPrice));
                        eng.drawLine(ax.convert(0), ay.convert(q * this.salesPrice), ax.convert(q), ay.convert(q * this.salesPrice));
                    }
                    eng.endGroup();
                };
                BreakEven.prototype._setStyle = function (eng, style) {
                    eng.stroke = style.stroke;
                    eng.strokeWidth = style.strokeWidth ? style.strokeWidth : 3;
                };
                BreakEven.prototype._getName = function (dim) {
                    var name = undefined;
                    if (this.name) {
                        if (this.name.indexOf(",")) {
                            var names = this.name.split(",");
                            if (names && names.length - 1 >= dim) {
                                name = names[dim].trim();
                            }
                        }
                        else {
                            name = this.name;
                        }
                    }
                    return name;
                };
                BreakEven.prototype.legendItemLength = function () {
                    return 9;
                };
                BreakEven.prototype._getStyle = function (index) {
                    var style = null;
                    switch (index) {
                        case 0:
                            style = this.style;
                            break;
                        case 1:
                            style = this.altStyle;
                            break;
                        case 2:
                            style = this.styles ? this.styles.safetyMargin : null;
                            break;
                        case 3:
                            style = this.styles ? this.styles.salesRevenue : null;
                            break;
                        case 4:
                            style = this.styles ? this.styles.totalCost : null;
                            break;
                        case 5:
                            style = this.styles ? this.styles.fixedCost : null;
                            break;
                        case 6:
                            style = this.styles ? this.styles.variableCost : null;
                            break;
                        case 7:
                            style = this.styles ? this.styles.marginalProfit : null;
                            break;
                        case 8:
                            style = this.styles ? this.styles.breakEven : null;
                            break;
                        default:
                            break;
                    }
                    return style;
                };
                BreakEven.prototype.measureLegendItem = function (engine, index) {
                    var name = this._getName(index), sz = new wijmo.Size(0, 0), style = this._getStyle(index);
                    if (name && style) {
                        sz = this._measureLegendItem(engine, this._getName(index));
                    }
                    return sz;
                };
                BreakEven.prototype.drawLegendItem = function (engine, rect, index) {
                    var style = this._getStyle(index), //this._getStyles(index) || this.style,
                    name = this._getName(index);
                    if (name && style) {
                        this._drawLegendItem(engine, rect, index < 3 ? 5 : 3, name, style, this.symbolStyle);
                    }
                };
                return BreakEven;
            }(wijmo.chart.SeriesBase));
            analytics.BreakEven = BreakEven;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart_3) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Specifies the quartile calculation method of {@link BoxWhisker} series.
             */
            var QuartileCalculation;
            (function (QuartileCalculation) {
                /** Include median value when calculating quartile. */
                QuartileCalculation[QuartileCalculation["InclusiveMedian"] = 0] = "InclusiveMedian";
                /** Exclude median value when calculating quartile. */
                QuartileCalculation[QuartileCalculation["ExclusiveMedian"] = 1] = "ExclusiveMedian";
            })(QuartileCalculation = analytics.QuartileCalculation || (analytics.QuartileCalculation = {}));
            /**
             * Represents a Box&Whisker chart series.
             *
             * The {@link BoxWhisker} series is normally used to compare distributions
             * between different sets of numerical data.
             */
            var BoxWhisker = /** @class */ (function (_super) {
                __extends(BoxWhisker, _super);
                /**
                 * Initializes a new instance of the {@link BoxWhisker} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function BoxWhisker(options) {
                    var _this = _super.call(this) || this;
                    _this._groupWidth = 0.8;
                    _this._gapWidth = 0.1;
                    _this._showInnerPoints = false;
                    _this._showOutliers = false;
                    _this._quartileCalculation = QuartileCalculation.InclusiveMedian;
                    _this._chartType = wijmo.chart.ChartType.Bar;
                    _this.rendering.addHandler(_this._rendering, _this);
                    _this.initialize(options);
                    return _this;
                }
                BoxWhisker.prototype._initProperties = function (options) {
                    wijmo.copy(this, options);
                };
                BoxWhisker.prototype._clearValues = function () {
                    _super.prototype._clearValues.call(this);
                };
                Object.defineProperty(BoxWhisker.prototype, "quartileCalculation", {
                    /**
                     * Gets or sets a value that specifies the quartile calculation method.
                     */
                    get: function () {
                        return this._quartileCalculation;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, QuartileCalculation, true);
                        if (value != this._quartileCalculation) {
                            this._quartileCalculation = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "groupWidth", {
                    /**
                     * Gets or sets a value that determines the group width as a percentage.
                     *
                     * The default value for this property is 0.8. The min value is 0 and max value is 1.
                     */
                    get: function () {
                        return this._groupWidth;
                    },
                    set: function (value) {
                        if (value != this._groupWidth && value >= 0 && value <= 1) {
                            this._groupWidth = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "gapWidth", {
                    /**
                     * Gets or sets a value that determines the width of the gab between groups
                     * as a percentage.
                     *
                     * The default value for this property is 0.1. The min value is 0 and max value is 1.
                     */
                    get: function () {
                        return this._gapWidth;
                    },
                    set: function (value) {
                        if (value != this._gapWidth && value >= 0 && value <= 1) {
                            this._gapWidth = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "showMeanLine", {
                    /**
                     * Gets or sets a value that determines whether to show the mean line.
                     */
                    get: function () {
                        return this._showMeanLine;
                    },
                    set: function (value) {
                        if (value != this._showMeanLine) {
                            this._showMeanLine = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "meanLineStyle", {
                    /**
                     * Gets or sets a value that specifies the style for the mean line.
                     */
                    get: function () {
                        return this._meanLineStyle;
                    },
                    set: function (value) {
                        if (value != this._meanLineStyle) {
                            this._meanLineStyle = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "showMeanMarker", {
                    /**
                     * Gets or sets a value that determines whether to show the mean marker.
                     */
                    get: function () {
                        return this._showMeanMarker;
                    },
                    set: function (value) {
                        if (value != this._showMeanMarker) {
                            this._showMeanMarker = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "meanMarkerStyle", {
                    /**
                     * Gets or sets a value that specifies the style for the mean marker.
                     */
                    get: function () {
                        return this._meanMarkerStyle;
                    },
                    set: function (value) {
                        if (value != this._meanMarkerStyle) {
                            this._meanMarkerStyle = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "showInnerPoints", {
                    /**
                     * Gets or sets a value that determines whether to show the inner data points
                     * for each point in the series.
                     */
                    get: function () {
                        return this._showInnerPoints;
                    },
                    set: function (value) {
                        if (value != this._showInnerPoints) {
                            this._showInnerPoints = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BoxWhisker.prototype, "showOutliers", {
                    /**
                     * Gets or sets a value that determines whether to show outliers.
                     *
                     * Outliers are inner points outside the range between the first
                     * and third quartiles.
                     */
                    get: function () {
                        return this._showOutliers;
                    },
                    set: function (value) {
                        if (value != this._showOutliers) {
                            this._showOutliers = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                BoxWhisker.prototype._rendering = function (sender, args) {
                    var _this = this;
                    args.cancel = true; // no default rendering
                    var series = this, chart = series.chart, palette = series.chart, ax = series._getAxisX(), ay = series._getAxisY(), iser = args.index, nser = args.count, engine = args.engine;
                    var plotter = this._plotter;
                    var si = chart.series.indexOf(series);
                    var ser = wijmo.asType(series, wijmo.chart.SeriesBase);
                    var quartileCalculation = this.quartileCalculation;
                    var showOutliers = this.showOutliers;
                    var cw = this.groupWidth;
                    var gapWidth = (this.gapWidth == null ? 0.2 : this.gapWidth) / 2;
                    var wpx = 0;
                    var padding = 0.9;
                    var prevXS, prevYS;
                    iser = iser || 0;
                    nser = nser || 1;
                    var w = cw / nser;
                    var yvals = series.getValues(0);
                    var xvals = series.getValues(1);
                    if (!yvals) {
                        return;
                    }
                    if (!xvals) {
                        xvals = plotter.dataInfo.getXVals();
                    }
                    if (xvals) {
                        // find minimal distance between point and use it as column width
                        var delta = plotter.dataInfo.getDeltaX();
                        if (delta > 0) {
                            cw *= delta;
                            w *= delta;
                        }
                    }
                    // set series fill and stroke from style
                    var fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || fill, stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke;
                    var len = yvals.length;
                    if (xvals != null) {
                        len = Math.min(len, xvals.length);
                    }
                    var origin = 0;
                    var itemIndex = 0, currentFill, currentStroke;
                    var ifmt = plotter.getItemFormatter(series);
                    if (!plotter.rotated) {
                        origin = ay.origin || origin;
                        if (origin < ay.actualMin) {
                            origin = ay.actualMin;
                        }
                        else if (origin > ay.actualMax) {
                            origin = ay.actualMax;
                        }
                        var originScreen = ay.convert(origin), xmin = ax.actualMin, xmax = ax.actualMax;
                        for (var i = 0; i < len; i++) {
                            var datax = xvals ? xvals[i] : i;
                            var datay = yvals[i];
                            if (datay == null || datay.length === 0) {
                                return;
                            }
                            if (plotter._getSymbolOrigin) {
                                originScreen = ay.convert(plotter._getSymbolOrigin(origin, i, len));
                            }
                            if (plotter._getSymbolStyles) {
                                var style = plotter._getSymbolStyles(i, len);
                                fill = style && style.fill ? style.fill : fill;
                                altFill = style && style.fill ? style.fill : altFill;
                                stroke = style && style.stroke ? style.stroke : stroke;
                                altStroke = style && style.stroke ? style.stroke : altStroke;
                            }
                            // apply fill and stroke
                            currentFill = datay[0] > 0 ? fill : altFill;
                            currentStroke = datay[0] > 0 ? stroke : altStroke;
                            engine.fill = currentFill;
                            engine.stroke = currentStroke;
                            if (wijmo.chart._DataInfo.isValid(datax) && wijmo.isArray(datay) && datay.length > 0 && wijmo.chart._DataInfo.isValid(datay[0])) {
                                var x0 = datax - 0.5 * cw + iser * w, x1 = datax - 0.5 * cw + (iser + 1) * w, offset = (x1 - x0) * gapWidth;
                                x0 += offset;
                                x1 -= offset;
                                //if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                                //    continue;
                                //}
                                x0 = ax.convert(x0);
                                x1 = ax.convert(x1);
                                if (!wijmo.chart._DataInfo.isValid(x0) || !wijmo.chart._DataInfo.isValid(x1)) {
                                    continue;
                                }
                                var boxPlot = new _BoxPlot(datay, quartileCalculation, showOutliers), bpv = {
                                    min: ay.convert(boxPlot.min),
                                    max: ay.convert(boxPlot.max),
                                    firstQuartile: ay.convert(boxPlot.firstQuartile),
                                    median: ay.convert(boxPlot.median),
                                    thirdQuartile: ay.convert(boxPlot.thirdQuartile),
                                    mean: ay.convert(boxPlot.mean),
                                    outlierPoints: this._convertPoints(boxPlot.outlierPoints, ay),
                                    innerPoints: this._convertPoints(boxPlot.innerPoints, ay)
                                }, rect = new wijmo.Rect(Math.min(x0, x1), Math.min(bpv.min, bpv.max), Math.abs(x1 - x0), Math.abs(bpv.max - bpv.min));
                                var area = new wijmo.chart._RectArea(rect), xs = {
                                    min: Math.min(x0, x1),
                                    median: (x0 + x1) / 2,
                                    max: Math.max(x0, x1)
                                };
                                if (ifmt) {
                                    engine.startGroup();
                                    var hti = new wijmo.chart.HitTestInfo(chart, new wijmo.Point(xs.median, (bpv.min + bpv.max) / 2), wijmo.chart.ChartElement.SeriesSymbol);
                                    hti._setData(series, i);
                                    ifmt(engine, hti, function () {
                                        _this._drawBoxWhisker(engine, xs, bpv, prevXS, prevYS, series);
                                        prevXS = xs;
                                        prevYS = bpv;
                                    });
                                    engine.endGroup();
                                }
                                else {
                                    this._drawBoxWhisker(engine, xs, bpv, prevXS, prevYS, series);
                                    prevXS = xs;
                                    prevYS = bpv;
                                }
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                var dp = new wijmo.chart._DataPoint(si, i, datax, datay);
                                dp.item = boxPlot;
                                area.tag = dp;
                                plotter.hitTester.add(area, si);
                                if (boxPlot.outlierPoints && boxPlot.outlierPoints.length) {
                                    boxPlot.outlierPoints.forEach(function (p, i) {
                                        var y = bpv.outlierPoints[i];
                                        var opArea = new wijmo.chart._CircleArea(new wijmo.Point(rect.left + rect.width / 2, y), 2);
                                        opArea.tag = dp;
                                        plotter.hitTester.add(opArea, si);
                                    });
                                }
                            }
                        }
                    }
                    else {
                        origin = ax.origin || origin;
                        if (origin < ax.actualMin) {
                            origin = ax.actualMin;
                        }
                        else if (origin > ax.actualMax) {
                            origin = ax.actualMax;
                        }
                        var originScreen = ax.convert(origin), ymin = ay.actualMin, ymax = ay.actualMax;
                        for (var i = 0; i < len; i++) {
                            var datax = xvals ? xvals[i] : i, datay = yvals[i];
                            if (datay == null || datay.length === 0) {
                                return;
                            }
                            if (plotter._getSymbolOrigin) {
                                originScreen = ay.convert(plotter._getSymbolOrigin(origin, i));
                            }
                            if (plotter._getSymbolStyles) {
                                var style = plotter._getSymbolStyles(i);
                                fill = style && style.fill ? style.fill : fill;
                                altFill = style && style.fill ? style.fill : altFill;
                                stroke = style && style.stroke ? style.fill : stroke;
                                altStroke = style && style.stroke ? style.fill : altStroke;
                            }
                            // apply fill and stroke
                            currentFill = datay[0] > 0 ? fill : altFill;
                            currentStroke = datay[0] > 0 ? stroke : altStroke;
                            engine.fill = currentFill;
                            engine.stroke = currentStroke;
                            if (wijmo.chart._DataInfo.isValid(datax) && wijmo.isArray(datay) && datay.length > 0 && wijmo.chart._DataInfo.isValid(datay[0])) {
                                var y0 = datax - 0.5 * cw + iser * w, y1 = datax - 0.5 * cw + (iser + 1) * w, offset = (y1 - y0) * gapWidth;
                                y0 += offset;
                                y1 -= offset;
                                if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                                    continue;
                                }
                                y0 = ay.convert(y0);
                                y1 = ay.convert(y1);
                                var boxPlot = new _BoxPlot(datay, quartileCalculation, showOutliers), bpv = {
                                    min: ax.convert(boxPlot.min),
                                    max: ax.convert(boxPlot.max),
                                    firstQuartile: ax.convert(boxPlot.firstQuartile),
                                    median: ax.convert(boxPlot.median),
                                    thirdQuartile: ax.convert(boxPlot.thirdQuartile),
                                    mean: ax.convert(boxPlot.mean),
                                    outlierPoints: this._convertPoints(boxPlot.outlierPoints, ax),
                                    innerPoints: this._convertPoints(boxPlot.innerPoints, ax)
                                }, rect = new wijmo.Rect(Math.min(bpv.min, bpv.max), Math.min(y0, y1), Math.abs(bpv.max - bpv.min), Math.abs(y1 - y0));
                                var area = new wijmo.chart._RectArea(rect), ys = {
                                    min: Math.min(y0, y1),
                                    median: (y0 + y1) / 2,
                                    max: Math.max(y1, y0)
                                };
                                if (ifmt) {
                                    engine.startGroup();
                                    var hti = new wijmo.chart.HitTestInfo(chart, new wijmo.Point((bpv.min + bpv.max) / 2, ys.median), wijmo.chart.ChartElement.SeriesSymbol);
                                    hti._setData(series, i);
                                    ifmt(engine, hti, function () {
                                        _this._drawBoxWhisker(engine, bpv, ys, prevXS, prevYS, series);
                                        prevXS = bpv;
                                        prevYS = ys;
                                    });
                                    engine.endGroup();
                                }
                                else {
                                    this._drawBoxWhisker(engine, bpv, ys, prevXS, prevYS, series);
                                    prevXS = bpv;
                                    prevYS = ys;
                                }
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                var dp = new wijmo.chart._DataPoint(si, i, datay, datax);
                                dp.item = boxPlot;
                                area.tag = dp;
                                plotter.hitTester.add(area, si);
                                if (boxPlot.outlierPoints && boxPlot.outlierPoints.length) {
                                    boxPlot.outlierPoints.forEach(function (p, i) {
                                        var x = bpv.outlierPoints[i];
                                        var opArea = new wijmo.chart._CircleArea(new wijmo.Point(x, rect.top + rect.height / 2), 2);
                                        opArea.tag = dp;
                                        plotter.hitTester.add(opArea, si);
                                    });
                                }
                            }
                        }
                    }
                };
                BoxWhisker.prototype._convertPoints = function (points, axis) {
                    return points.map(function (p) { return axis.convert(p); });
                };
                BoxWhisker.prototype._drawBoxWhisker = function (engine, xs, ys, prevXS, prevYS, series) {
                    var style = series.symbolStyle, center, showInnerPoints = this.showInnerPoints, showOutliers = this.showOutliers, showMeanLine = this.showMeanLine, meanLineStyle = this.meanLineStyle, showMeanMarker = this.showMeanMarker, meanMarkerStyle = this.meanMarkerStyle, plotter = this._plotter;
                    engine.startGroup('box-plot');
                    engine.strokeWidth = 1;
                    if (plotter.rotated) {
                        engine.drawLine(xs.min, (ys.min + ys.median) / 2, xs.min, (ys.max + ys.median) / 2, null, style);
                        engine.drawLine(xs.min, ys.median, xs.firstQuartile, ys.median, null, style);
                        engine.drawRect(Math.min(xs.firstQuartile, xs.thirdQuartile), Math.min(ys.min, ys.max), Math.abs(xs.thirdQuartile - xs.firstQuartile), Math.abs(ys.max - ys.min), null, style);
                        engine.drawLine(xs.median, ys.min, xs.median, ys.max, null, style);
                        engine.drawLine(xs.max, ys.median, xs.thirdQuartile, ys.median, null, style);
                        engine.drawLine(xs.max, (ys.min + ys.median) / 2, xs.max, (ys.max + ys.median) / 2, null, style);
                        if (showMeanLine && prevXS && prevYS) {
                            engine.drawLine(xs.mean, ys.median, prevXS.mean, prevYS.median, 'box-whisker-mean-line', meanLineStyle || style);
                        }
                        if (showMeanMarker) {
                            var offset = Math.abs(ys.median - ys.min) / 2;
                            engine.drawLine(xs.mean - offset, ys.median - offset, xs.mean + offset, ys.median + offset, null, meanMarkerStyle || style);
                            engine.drawLine(xs.mean + offset, ys.median - offset, xs.mean - offset, ys.median + offset, null, meanMarkerStyle || style);
                        }
                        if (showOutliers) {
                            xs.outlierPoints.forEach(function (p) {
                                engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                            });
                        }
                        if (showInnerPoints) {
                            xs.innerPoints.forEach(function (p) {
                                engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                            });
                        }
                    }
                    else {
                        engine.drawLine((xs.min + xs.median) / 2, ys.min, (xs.max + xs.median) / 2, ys.min, null, style);
                        engine.drawLine(xs.median, ys.min, xs.median, ys.firstQuartile, null, style);
                        engine.drawRect(Math.min(xs.min, xs.max), Math.min(ys.firstQuartile, ys.thirdQuartile), Math.abs(xs.max - xs.min), Math.abs(ys.thirdQuartile - ys.firstQuartile), null, style);
                        engine.drawLine(xs.min, ys.median, xs.max, ys.median, null, style);
                        engine.drawLine(xs.median, ys.max, xs.median, ys.thirdQuartile, null, style);
                        engine.drawLine((xs.min + xs.median) / 2, ys.max, (xs.max + xs.median) / 2, ys.max, null, style);
                        if (showMeanLine && prevXS && prevYS) {
                            engine.drawLine(xs.median, ys.mean, prevXS.median, prevYS.mean, 'box-whisker-mean-line', meanLineStyle || style);
                        }
                        if (showMeanMarker) {
                            var offset = Math.abs(xs.median - xs.min) / 2;
                            engine.drawLine(xs.median - offset, ys.mean - offset, xs.median + offset, ys.mean + offset, null, meanMarkerStyle || style);
                            engine.drawLine(xs.median - offset, ys.mean + offset, xs.median + offset, ys.mean - offset, null, meanMarkerStyle || style);
                        }
                        if (showOutliers) {
                            ys.outlierPoints.forEach(function (p) {
                                engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                            });
                        }
                        if (showInnerPoints) {
                            ys.innerPoints.forEach(function (p) {
                                engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                            });
                        }
                    }
                    engine.endGroup();
                };
                BoxWhisker.prototype._renderLabels = function (engine, smap, chart, lblAreas) {
                    var _this = this;
                    var series = this, plotter = this._plotter, len = smap.length, lbl = chart.dataLabel, bdr = lbl.border, offset = lbl.offset, line = lbl.connectingLine, dy = 'dataY', marg = 2;
                    if (plotter.rotated) {
                        dy = 'dataX';
                    }
                    if (offset === undefined) {
                        offset = line ? 16 : 0;
                    }
                    if (bdr) {
                        offset -= marg;
                    }
                    var dpts = [];
                    for (var j = 0; j < len; j++) {
                        var map = smap[j], tag = map.tag;
                        var dp = wijmo.asType(tag, wijmo.chart._DataPoint, true);
                        if (dp && dpts.indexOf(dp) == -1) {
                            dpts.push(dp);
                            var item = tag.item;
                            var y = tag.y;
                            tag[dy] = item.min;
                            tag.yfmt = item.min;
                            tag.y = item.min;
                            this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            tag[dy] = item.firstQuartile;
                            tag.yfmt = item.firstQuartile;
                            tag.y = item.firstQuartile;
                            this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            tag[dy] = item.median;
                            tag.yfmt = item.median;
                            tag.y = item.median;
                            this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            tag[dy] = item.thirdQuartile;
                            tag.yfmt = item.thirdQuartile;
                            tag.y = item.thirdQuartile;
                            this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            tag[dy] = item.max;
                            tag.yfmt = item.max;
                            tag.y = item.max;
                            this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            if (this.showMeanMarker) {
                                var mean = Number(item.mean.toFixed(2));
                                tag[dy] = mean;
                                tag.yfmt = mean;
                                tag.y = mean;
                                this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                            }
                            if (item.showOutliers && item.outlierPoints) {
                                item.outlierPoints.forEach(function (v) {
                                    tag[dy] = v;
                                    tag.yfmt = v;
                                    tag.y = v;
                                    _this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                                });
                            }
                            tag.y = y;
                        }
                    }
                };
                return BoxWhisker;
            }(wijmo.chart.SeriesBase));
            analytics.BoxWhisker = BoxWhisker;
            var _BoxPlot = /** @class */ (function () {
                function _BoxPlot(data, quartileCalculation, showOutliers) {
                    this._outlierPoints = [];
                    this._innerPoints = [];
                    this._data = data;
                    this._quartileCalculation = quartileCalculation;
                    this._showOutliers = showOutliers;
                    this._parse();
                }
                Object.defineProperty(_BoxPlot.prototype, "showOutliers", {
                    get: function () {
                        return this._showOutliers;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "min", {
                    get: function () {
                        return this._min;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "max", {
                    get: function () {
                        return this._max;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "mean", {
                    get: function () {
                        return this._mean;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "firstQuartile", {
                    get: function () {
                        return this._firstQuartile;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "thirdQuartile", {
                    get: function () {
                        return this._thirdQuartile;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "median", {
                    get: function () {
                        return this._median;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "outlierPoints", {
                    get: function () {
                        return this._outlierPoints;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_BoxPlot.prototype, "innerPoints", {
                    get: function () {
                        return this._innerPoints;
                    },
                    enumerable: true,
                    configurable: true
                });
                _BoxPlot.prototype._parse = function () {
                    var _this = this;
                    var len = this._data.length, data = this._data, total = 0;
                    this._outlierPoints = [];
                    this._innerPoints = [];
                    data.sort(function (a, b) { return a - b; });
                    //filter null value.
                    data.some(function (v) {
                        if (v == null) {
                            return false;
                        }
                        _this._min = v;
                        return true;
                    });
                    this._max = data[len - 1] == null ? 0 : data[len - 1];
                    if (this._quartileCalculation === QuartileCalculation.InclusiveMedian) {
                        this._firstQuartile = this._quartileInc(data, 0.25);
                        this._median = this._quartileInc(data, 0.5);
                        this._thirdQuartile = this._quartileInc(data, 0.75);
                    }
                    else {
                        this._firstQuartile = this._quartileExc(data, 0.25);
                        this._median = this._quartileExc(data, 0.5);
                        this._thirdQuartile = this._quartileExc(data, 0.75);
                    }
                    this._iqr = 1.5 * Math.abs(this._thirdQuartile - this._firstQuartile);
                    var minLimits = this._firstQuartile - this._iqr, maxLimits = this._thirdQuartile + this._iqr;
                    if (this._showOutliers) {
                        var minmax = this._max;
                        this._max = this._min;
                        this._min = minmax;
                        this._data.forEach(function (v) {
                            total += v;
                            if (v < minLimits || v > maxLimits) {
                                _this._outlierPoints.push(v);
                            }
                            else {
                                if (v < _this._min) {
                                    _this._min = v;
                                }
                                if (v > _this._max) {
                                    _this._max = v;
                                }
                            }
                        });
                    }
                    else {
                        total = this._data.reduce(function (a, b) { return a + b; }, 0);
                    }
                    this._innerPoints = this._data.filter(function (v) {
                        if (v > _this._min && v < _this._max) {
                            return true;
                        }
                    });
                    this._mean = total / len;
                };
                _BoxPlot.prototype._quartileInc = function (data, percent) {
                    var len = data.length, p1, p2, v, offset;
                    if (len === 1) {
                        return data[0];
                    }
                    p1 = (len - 1) * percent + 1;
                    p2 = Math.floor(p1);
                    v = data[p2 - 1];
                    offset = p1 - p2;
                    return v + (data[p2] - v) * offset;
                };
                _BoxPlot.prototype._quartileExc = function (data, percent) {
                    var len = data.length, p1, p2, v, offset;
                    //if (len < 3) return NaN;
                    if (len === 1) {
                        return data[0];
                    }
                    else if (len === 2) {
                        return data[Math.round(percent)];
                    }
                    // TFS 472288 condition removed, not sure why it require a special handling 
                    //if ((len + 1) % 4 === 0) {
                    //    return data[(len + 1) * percent];
                    //} else {
                    p1 = (len + 1) * percent;
                    p2 = Math.floor(p1);
                    v = data[p2 - 1];
                    offset = p1 - p2;
                    return v + (data[p2] - v) * offset;
                    //}
                };
                return _BoxPlot;
            }());
            analytics._BoxPlot = _BoxPlot;
        })(analytics = chart_3.analytics || (chart_3.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.chart.analytics', wijmo.chart.analytics);
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.chart.analytics.js.map