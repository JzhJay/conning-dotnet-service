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
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * Defines ranges to be used with {@link Gauge} controls.
         *
         * {@link Range} objects have {@link min} and {@link max} properties that
         * define the range's domain, as well as {@link color} and {@link thickness}
         * properties that define the range's appearance.
         *
         * Every {@link Gauge} control has at least two ranges:
         * the 'face' defines the minimum and maximum values for the gauge, and
         * the 'pointer' displays the gauge's current value.
         *
         * In addition to the built-in ranges, gauges may have additional
         * ranges used to display regions of significance (for example,
         * low, medium, and high values).
         */
        var Range = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link Range} class.
             *
             * @param options Initialization options for the {@link Range} or a string
             * containing the {@link Range} name.
             */
            function Range(options) {
                this._min = 0;
                this._max = 100;
                this._thickness = 1;
                /**
                 * Occurs when the value of a property in this {@link Range} changes.
                 */
                this.propertyChanged = new wijmo.Event();
                if (wijmo.isString(options)) {
                    this._name = options;
                }
                else {
                    wijmo.copy(this, options);
                }
            }
            Object.defineProperty(Range.prototype, "min", {
                /**
                 * Gets or sets the minimum value for this range.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._setProp('_min', wijmo.asNumber(value, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "max", {
                /**
                 * Gets or sets the maximum value for this range.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._setProp('_max', wijmo.asNumber(value, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "color", {
                /**
                 * Gets or sets the color used to display this range.
                 */
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._setProp('_color', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "thickness", {
                /**
                 * Gets or sets the thickness of this range as a percentage of
                 * the parent gauge's thickness.
                 */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    this._setProp('_thickness', wijmo.clamp(wijmo.asNumber(value), 0, 1));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "name", {
                /**
                 * Gets or sets the name of this {@link Range}.
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._setProp('_name', wijmo.asString(value));
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
            Range.prototype.onPropertyChanged = function (e) {
                this.propertyChanged.raise(this, e);
            };
            // ** implementation
            // sets property value and notifies about the change
            Range.prototype._setProp = function (name, value) {
                var oldValue = this[name];
                if (value != oldValue) {
                    this[name] = value;
                    var e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
                    this.onPropertyChanged(e);
                }
            };
            Range._ctr = 0;
            return Range;
        }());
        gauge.Range = Range;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var gauge;
    (function (gauge_1) {
        'use strict';
        /**
         * Specifies which values to display as text.
         */
        var ShowText;
        (function (ShowText) {
            /** Do not show any text in the gauge. */
            ShowText[ShowText["None"] = 0] = "None";
            /** Show the gauge's {@link Gauge.value} as text. */
            ShowText[ShowText["Value"] = 1] = "Value";
            /** Show the gauge's {@link Gauge.min} and {@link Gauge.max} values as text. */
            ShowText[ShowText["MinMax"] = 2] = "MinMax";
            /** Show the gauge's {@link Gauge.value}, {@link Gauge.min}, and {@link Gauge.max} as text. */
            ShowText[ShowText["All"] = 3] = "All";
        })(ShowText = gauge_1.ShowText || (gauge_1.ShowText = {}));
        /**
         * Base class for the Wijmo Gauge controls (abstract).
         */
        var Gauge = /** @class */ (function (_super) {
            __extends(Gauge, _super);
            /**
             * Initializes a new instance of the {@link Gauge} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Gauge(element, options) {
                var _this = _super.call(this, element, null, true) || this;
                // property storage
                _this._ranges = new wijmo.collections.ObservableArray();
                _this._rngElements = [];
                _this._format = 'n0';
                _this._showRanges = true;
                _this._stackRanges = false;
                _this._shadow = true;
                _this._animated = true;
                _this._readOnly = true;
                _this._handleWheel = true;
                _this._step = 1;
                _this._showText = ShowText.None;
                _this._showTicks = false;
                _this._showTickText = false;
                // protected
                _this._thickness = 0.8;
                _this._initialized = false;
                /**
                 * Occurs when the value of the {@link value} property changes.
                 */
                _this.valueChanged = new wijmo.Event();
                // scales a value to a percentage based on the gauge's min and max properties
                _this._getPercent = function (value) {
                    var pct = (this.max > this.min) ? (value - this.min) / (this.max - this.min) : 0;
                    return Math.max(0, Math.min(1, pct));
                };
                Gauge._ctr++;
                var host = _this.hostElement;
                // accessibility: 
                // https://www.w3.org/TR/wai-aria-1.1/#slider
                // http://oaa-accessibility.org/examples/role/95/
                wijmo.setAttribute(host, 'role', 'slider', true);
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-gauge', tpl, {
                    _dSvg: 'dsvg',
                    _svg: 'svg',
                    _filter: 'filter',
                    _gFace: 'gface',
                    _gRanges: 'granges',
                    _gPointer: 'gpointer',
                    _gCover: 'gcover',
                    _pFace: 'pface',
                    _pPointer: 'ppointer',
                    _cValue: 'cvalue',
                    _tValue: 'value',
                    _tMin: 'min',
                    _tMax: 'max',
                    _pTicks: 'pticks',
                    _gTicks: 'gticks',
                    _gNeedle: 'gneedle'
                });
                // set style in code to keep CSP happy
                wijmo.setCss(_this._dSvg, {
                    width: '100%',
                    height: '100%'
                });
                // apply filter id to template
                _this._filterID = 'wj-gauge-filter-' + Gauge._ctr.toString(36);
                _this._filter.setAttribute('id', _this._filterID);
                // initialize main ranges
                _this.face = new gauge_1.Range();
                _this.pointer = new gauge_1.Range();
                // invalidate control and re-create range elements when ranges change
                _this._ranges.collectionChanged.addHandler(function () {
                    // check types
                    _this._ranges.forEach(function (rng) {
                        wijmo.assert(rng instanceof gauge_1.Range, 'ranges array must contain Range objects.');
                    });
                    // remember ranges are dirty and invalidate
                    _this._rangesDirty = true;
                    _this.invalidate();
                });
                // keyboard handling
                _this.addEventListener(host, 'keydown', _this._keydown.bind(_this));
                // mouse handling
                _this.addEventListener(host, 'click', function (e) {
                    if (e.button == 0) { // left button only
                        _this.focus();
                        _this._applyMouseValue(e);
                    }
                });
                _this.addEventListener(host, 'mousedown', function (e) {
                    if (e.button == 0) { // left button only
                        _this.focus();
                        _this._dragging = true;
                        setTimeout(function () {
                            _this._applyMouseValue(e);
                        });
                    }
                });
                _this.addEventListener(host, 'mousemove', function (e) {
                    if (_this._dragging && _this.containsFocus()) {
                        _this._applyMouseValue(e, true);
                    }
                });
                _this.addEventListener(host, 'mouseup', function (e) {
                    _this._dragging = false;
                });
                _this.addEventListener(host, 'mouseleave', function (e) {
                    if (e.target == host) {
                        _this._dragging = false;
                    }
                });
                // touch handling
                if ('ontouchstart' in window) {
                    _this.addEventListener(host, 'touchstart', function (e) {
                        _this.focus();
                        if (!e.defaultPrevented && _this._applyMouseValue(e, false)) { // TFS 321526
                            e.preventDefault();
                        }
                    });
                    _this.addEventListener(host, 'touchmove', function (e) {
                        if (!e.defaultPrevented && _this._applyMouseValue(e, true)) {
                            e.preventDefault();
                        }
                    });
                }
                // use wheel to increase/decrease the value
                _this.addEventListener(host, 'wheel', function (e) {
                    if (_this._handleWheel && !_this.isReadOnly) {
                        if (!e.defaultPrevented && _this.containsFocus() && _this.value != null && _this.hitTest(e)) {
                            var step = wijmo.clamp(-e.deltaY, -1, +1);
                            _this.value = wijmo.clamp(_this.value + (_this.step || 1) * step, _this.min, _this.max);
                            e.preventDefault();
                        }
                    }
                });
                // initialize control options
                _this.isReadOnly = true; // update wj-state-readonly class
                _this.initialize(options);
                // ensure face and text are updated
                _this.invalidate();
                return _this;
            }
            Object.defineProperty(Gauge.prototype, "value", {
                /**
                 * Gets or sets the value displayed on the gauge.
                 */
                get: function () {
                    return this._pointer.max;
                },
                set: function (value) {
                    if (value != this.value) {
                        this._pointer.max = wijmo.asNumber(value, true);
                        this._updateAria();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "min", {
                /**
                 * Gets or sets the minimum value that can be displayed on the gauge.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._face.min;
                },
                set: function (value) {
                    if (value != this.min) {
                        this._face.min = wijmo.asNumber(value);
                        this._updateAria();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "max", {
                /**
                 * Gets or sets the maximum value that can be displayed on the gauge.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._face.max;
                },
                set: function (value) {
                    if (value != this.max) {
                        this._face.max = wijmo.asNumber(value);
                        this._updateAria();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "origin", {
                /**
                 * Gets or sets the starting point used for painting the range.
                 *
                 * By default, this property is set to null, which causes the value range
                 * to start at the gauge's minimum value, or zero if the minimum is less
                 * than zero.
                 */
                get: function () {
                    return this._origin;
                },
                set: function (value) {
                    if (value != this._origin) {
                        this._origin = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can edit the gauge
                 * value using the mouse and keyboard.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    wijmo.setAttribute(this._svg, 'cursor', this._readOnly ? null : 'pointer');
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "handleWheel", {
                /**
                 * Gets or sets a value that determines whether the user can edit the
                 * gauge value using the mouse wheel.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._handleWheel;
                },
                set: function (value) {
                    this._handleWheel = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "step", {
                /**
                 * Gets or sets the amount to add to or subtract from the {@link value} property
                 * when the user presses the arrow keys or moves the mouse wheel.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    if (value != this._step) {
                        this._step = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "format", {
                /**
                 * Gets or sets the format string used to display gauge values as text.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this._format) {
                        this._format = wijmo.asString(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "getText", {
                /**
                 * Gets or sets a callback that returns customized strings used to
                 * display gauge values.
                 *
                 * Use this property if you want to customize the strings shown on
                 * the gauge in cases where the {@link format} property is not enough.
                 *
                 * If provided, the callback should be a function as that takes as
                 * parameters the gauge, the part name, the value, and the formatted
                 * value. The callback should return the string to be displayed on
                 * the gauge.
                 *
                 * For example:
                 *
                 * ```typescript
                 * // callback to convert values into strings
                 * gauge.getText = (gauge, part, value, text) => {
                 *     switch (part) {
                 *         case 'value':
                 *             if (value &lt;= 10) return 'Empty!';
                 *             if (value &lt;= 25) return 'Low...';
                 *             if (value &lt;= 95) return 'Good';
                 *             return 'Full';
                 *         case 'min':
                 *             return 'EMPTY';
                 *         case 'max':
                 *            return 'FULL';
                 *     }
                 *     return text;
                 * }
                 * ```
                 */
                get: function () {
                    return this._getText;
                },
                set: function (value) {
                    if (value != this._getText) {
                        this._getText = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "thickness", {
                /**
                 * Gets or sets the thickness of the gauge, on a scale between zero and one.
                 *
                 * Setting the thickness to one causes the gauge to fill as much of the
                 * control area as possible. Smaller values create thinner gauges.
                 */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    if (value != this._thickness) {
                        this._thickness = wijmo.clamp(wijmo.asNumber(value, false), 0, 1);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "face", {
                /**
                 * Gets or sets the {@link Range} used to represent the gauge's overall geometry
                 * and appearance.
                 */
                get: function () {
                    return this._face;
                },
                set: function (value) {
                    if (value != this._face) {
                        if (this._face) {
                            this._face.propertyChanged.removeHandler(this._rangeChanged);
                        }
                        this._face = wijmo.asType(value, gauge_1.Range);
                        if (this._face) {
                            this._face.propertyChanged.addHandler(this._rangeChanged, this);
                        }
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "pointer", {
                /**
                 * Gets or sets the {@link Range} used to represent the gauge's current value.
                 */
                get: function () {
                    return this._pointer;
                },
                set: function (value) {
                    if (value != this._pointer) {
                        var gaugeValue = null;
                        if (this._pointer) {
                            gaugeValue = this.value;
                            this._pointer.propertyChanged.removeHandler(this._rangeChanged);
                        }
                        this._pointer = wijmo.asType(value, gauge_1.Range);
                        if (this._pointer) {
                            if (gaugeValue) {
                                this.value = gaugeValue;
                            }
                            this._pointer.propertyChanged.addHandler(this._rangeChanged, this);
                        }
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showText", {
                /**
                 * Gets or sets the {@link ShowText} values to display as text in the gauge.
                 *
                 * The default value for this property is **ShowText.All** for {@link RadialGauge}
                 * controls, and to **ShowText.None** for {@link LinearGauge} controls.
                 */
                get: function () {
                    return this._showText;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, ShowText);
                    if (value != this._showText) {
                        this._showText = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showTicks", {
                /**
                 * Gets or sets a property that determines whether the gauge should
                 * display tickmarks at each {@link step} (or {@link tickSpacing})
                 * value.
                 *
                 * The tickmarks can be formatted in CSS using the **wj-gauge** and
                 * **wj-ticks** class names. For example:
                 *
                 * ```css
                 * .wj-gauge .wj-ticks {
                 *     stroke-width: 2px;
                 *     stroke: white;
                 * }
                 * ```
                 *
                 * The default value for this property is **false.
                 */
                get: function () {
                    return this._showTicks;
                },
                set: function (value) {
                    if (value != this._showTicks) {
                        this._showTicks = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showTickText", {
                /**
                 * Gets or sets a property that determines whether the gauge should
                 * display the text value of each tick mark.
                 *
                 * You can use CSS to style the tickmark text:
                 *
                 * ```css
                 * .wj-gauge .wj-tick-text text {
                 *     opacity: 1;
                 *     font-family: Courier;
                 *     font-size: 8pt;
                 *     fill: purple;
                 * }
                 * ```
                 *
                 * See also the {@link showTicks} and {@link tickSpacing} properties.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._showTickText;
                },
                set: function (value) {
                    if (value != this._showTickText) {
                        this._showTickText = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "tickSpacing", {
                /**
                 * Gets or sets the spacing between tickmarks.
                 *
                 * Set the {@link showTicks} property to true if you want the
                 * gauge to show tickmarks along its face. By default, the
                 * interval between tickmarks is defined by the {@link step}
                 * property.
                 *
                 * Use the {@link tickSpacing} property to override the default
                 * and use a spacing that is different from the {@link step}
                 * value. Set the {@link tickSpacing} property to null to revert
                 * to the default behavior.
                 */
                get: function () {
                    return this._tickSpacing;
                },
                set: function (value) {
                    if (value != this._tickSpacing) {
                        this._tickSpacing = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "thumbSize", {
                /**
                 * Gets or sets the size of the element that shows the gauge's current value,
                 * in pixels.
                 */
                get: function () {
                    return this._thumbSize;
                },
                set: function (value) {
                    if (value != this._thumbSize) {
                        this._thumbSize = wijmo.asNumber(value, true, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showRanges", {
                /**
                 * Gets or sets a value that indicates whether the gauge displays the ranges
                 * contained in  the {@link ranges} property.
                 *
                 * If this property is set to false, the ranges contained in the {@link ranges}
                 * property are not displayed in the gauge. Instead, they are used to
                 * interpolate the color of the {@link pointer} range while animating value changes.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showRanges;
                },
                set: function (value) {
                    if (value != this._showRanges) {
                        this._showRanges = wijmo.asBoolean(value);
                        this._animColor = null;
                        this._rangesDirty = true;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "stackRanges", {
                /**
                 * Gets or sets a value that determines whether the ranges contained in
                 * the {@link ranges} collection should be stacked within the gauge.
                 *
                 * By default, {@link stackRanges} is set to false, and the ranges in the
                 * {@link ranges} collection are displayed with the same thickness as the
                 * gauge's face.
                 *
                 * Setting {@link stackRanges} to true causes the ranges to become narrower,
                 * and to be displayed side-by-side.
                 */
                get: function () {
                    return this._stackRanges;
                },
                set: function (value) {
                    if (value != this._stackRanges) {
                        this._stackRanges = wijmo.asBoolean(value);
                        this._animColor = null;
                        this._rangesDirty = true;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "hasShadow", {
                /**
                 * Gets or sets a value that indicates whether the gauge displays
                 * a shadow effect.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._shadow;
                },
                set: function (value) {
                    if (value != this._shadow) {
                        this._shadow = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "isAnimated", {
                /**
                 * Gets or sets a value that determines whether the {@link Gauge}
                 * should use animation to show value changes.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._animated;
                },
                set: function (value) {
                    this._animated = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "ranges", {
                /**
                 * Gets the collection of ranges in this gauge.
                 */
                get: function () {
                    return this._ranges;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link valueChanged} event.
             */
            Gauge.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Indicates whether to update the control layout as well as the content.
             */
            Gauge.prototype.refresh = function (fullUpdate) {
                var _this = this;
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                // update ranges if they are dirty
                if (this._rangesDirty) {
                    this._rangesDirty = false;
                    var gr_1 = this._gRanges;
                    // remove old elements and disconnect event handlers
                    this._rngElements.forEach(function (e) {
                        e.rng.propertyChanged.removeHandler(_this._rangeChanged);
                    });
                    while (gr_1.lastChild) {
                        gr_1.removeChild(gr_1.lastChild);
                    }
                    this._rngElements = [];
                    // add elements for each range and listen to changes
                    if (this._showRanges) {
                        this._ranges.forEach(function (rng) {
                            rng.propertyChanged.addHandler(_this._rangeChanged, _this);
                            _this._rngElements.push({
                                rng: rng,
                                el: _this._createElement('path', gr_1)
                            });
                        });
                    }
                }
                // update text elements
                this._showElement(this._tValue, (this.showText & ShowText.Value) != 0);
                this._showElement(this._tMin, (this.showText & ShowText.MinMax) != 0);
                this._showElement(this._tMax, (this.showText & ShowText.MinMax) != 0);
                this._showElement(this._cValue, (this.showText & ShowText.Value) != 0 || this._thumbSize > 0);
                this._updateText();
                // update face and pointer
                var filterUrl = this._getFilterUrl();
                wijmo.setAttribute(this._pFace, 'filter', filterUrl);
                wijmo.setAttribute(this._pPointer, 'filter', filterUrl);
                this._updateRange(this._face);
                this._updateRange(this._pointer);
                this._updateTicks();
                // update ranges
                this._ranges.forEach(function (rng) {
                    _this._updateRange(rng);
                });
                // ready
                this._initialized = true;
            };
            /**
             * Gets a number that corresponds to the value of the gauge at a given point.
             *
             * For example:
             *
             * ```typescript
             * // hit test a point when the user clicks on the gauge
             * gauge.hostElement.addEventListener('click', e => {
             *     var ht = gauge.hitTest(e.pageX, e.pageY);
             *     if (ht != null) {
             *         console.log('you clicked the gauge at value ' + ht.toString());
             *     }
             * });
             * ```
             *
             * @param pt The point to investigate, in window coordinates, or a MouseEvent object,
             * or the x coordinate of the point.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             * @return Value of the gauge at the point, or null if the point is not on the gauge's face.
             */
            Gauge.prototype.hitTest = function (pt, y) {
                // get point in page coordinates
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y)
                    pt = new wijmo.Point(pt, y);
                }
                else if (!(pt instanceof wijmo.Point)) {
                    pt = wijmo.mouseToPage(pt);
                }
                pt = wijmo.asType(pt, wijmo.Point);
                // convert point to gauge client coordinates
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
                pt.x -= rc.left + pageXOffset;
                pt.y -= rc.top + pageYOffset;
                // get gauge value from point
                return this._getValueFromPoint(pt);
            };
            // ** implementation
            // safe version of getBBox (TFS 129851, 144174)
            // (workaround for FF bug, see https://bugzilla.mozilla.org/show_bug.cgi?id=612118)
            //
            // In TS 2.2 the type of the 'e' parameter was changed from SVGLocatable to 
            // SVGGraphicsElement. We use 'any' for the 'e' parameter and for the
            // return type so the library can be compiled with TS 2.1 and later.
            Gauge._getBBox = function (e) {
                try {
                    return e.getBBox();
                }
                catch (x) {
                    return { x: 0, y: 0, width: 0, height: 0 };
                }
            };
            // gets the unique filter ID used by this gauge
            // NOTE: shadows (filters) are not supported in iOS (iPad, iPod, iPhone: TFS 419493)
            // alternative CSS fix: http://ethanclevenger.com/Filter-Bug-Turns-SVGs-Invisible-on-iOS-Browsers/
            Gauge.prototype._getFilterUrl = function () {
                return this.hasShadow && !wijmo.isiOS()
                    ? 'url(#' + this._filterID + ')'
                    : null;
            };
            // gets the path element that represents a Range
            Gauge.prototype._getRangeElement = function (rng) {
                if (rng == this._face) {
                    return this._pFace;
                }
                else if (rng == this._pointer) {
                    return this._pPointer;
                }
                for (var i = 0; i < this._rngElements.length; i++) {
                    var rngEl = this._rngElements[i];
                    if (rngEl.rng == rng) {
                        return rngEl.el;
                    }
                }
                return null;
            };
            // handle changes to range objects
            Gauge.prototype._rangeChanged = function (rng, e) {
                var _this = this;
                // when pointer.max changes, raise valueChanged
                if (rng == this._pointer && e.propertyName == 'max') {
                    this.onValueChanged();
                    this._updateText();
                }
                // when face changes, invalidate the whole gauge
                if (rng == this._face) {
                    this.invalidate();
                    return;
                }
                // update pointer with animation
                if (rng == this._pointer && e.propertyName == 'max') {
                    // clear pending animations if any
                    if (this._animInterval) {
                        clearInterval(this._animInterval);
                    }
                    // animate
                    if (this.isAnimated && !this.isUpdating && this._initialized) {
                        var s1 = this._getPointerColor(e.oldValue), s2 = this._getPointerColor(e.newValue), c1_1 = s1 ? new wijmo.Color(s1) : null, c2_1 = s2 ? new wijmo.Color(s2) : null, pctChange = wijmo.clamp(Math.abs(e.newValue - e.oldValue) / (this.max - this.min), 0, 1);
                        this._animInterval = wijmo.animate(function (pct) {
                            _this._animColor = (c1_1 && c2_1)
                                ? wijmo.Color.interpolate(c1_1, c2_1, pct).toString()
                                : null;
                            _this._updateRange(rng, e.oldValue + pct * (e.newValue - e.oldValue));
                            if (pct >= 1) {
                                _this._animColor = null;
                                _this._animInterval = null;
                                _this._updateRange(rng);
                                _this._updateText();
                            }
                        }, pctChange * wijmo.Control._ANIM_DEF_DURATION); // duration proportional to change
                        return;
                    }
                }
                // update range without animation
                this._updateRange(rng);
            };
            // creates an SVG element with the given tag and appends it to a given element
            Gauge.prototype._createElement = function (tag, parent, cls) {
                var e = document.createElementNS(Gauge._SVGNS, tag);
                if (cls) {
                    e.setAttribute('class', cls);
                }
                parent.appendChild(e);
                return e;
            };
            // centers an SVG text element at a given point
            Gauge.prototype._centerText = function (e, value, center) {
                if (e.getAttribute('display') != 'none') {
                    // get the text for the element
                    var text = wijmo.Globalize.format(value, this.format);
                    if (wijmo.isFunction(this.getText)) {
                        var part = '';
                        if (e == this._tValue)
                            part = 'value';
                        else if (e == this._tMin)
                            part = 'min';
                        else if (e == this._tMax)
                            part = 'max';
                        if (part) {
                            text = this.getText(this, part, value, text);
                        }
                    }
                    // set the text and center the element
                    e.textContent = text;
                    var box = wijmo.Rect.fromBoundingRect(Gauge._getBBox(e)), x = (center.x - box.width / 2), y = (center.y + box.height / 4);
                    e.setAttribute('x', this._fix(x));
                    e.setAttribute('y', this._fix(y));
                }
            };
            // method used in JSON-style initialization
            Gauge.prototype._copy = function (key, value) {
                var _this = this;
                if (key == 'ranges') {
                    wijmo.asArray(value).forEach(function (rngInfo) {
                        var rng = new gauge_1.Range(rngInfo);
                        _this.ranges.push(rng);
                    });
                    return true;
                }
                else if (key == 'pointer') {
                    wijmo.copy(this.pointer, value);
                    return true;
                }
                return false;
            };
            // shows or hides an element
            Gauge.prototype._showElement = function (e, show) {
                wijmo.setAttribute(e, 'display', show ? null : 'none');
            };
            // updates the element for a given range
            Gauge.prototype._updateRange = function (rng, value) {
                if (value === void 0) { value = rng.max; }
                // update pointer's min value
                if (rng == this._pointer) {
                    rng.min = this.origin != null
                        ? this.origin
                        : (this.min < 0 && this.max > 0) ? 0 : this.min;
                }
                // update the range's element
                var e = this._getRangeElement(rng);
                if (e) {
                    this._updateRangeElement(e, rng, value);
                    var color = rng.color;
                    if (rng == this._pointer) {
                        color = this._animColor ? this._animColor : this._getPointerColor(rng.max);
                    }
                    wijmo.setAttribute(e, 'style', color ? 'fill:' + color : null);
                }
            };
            // gets the color for the pointer range based on the gauge ranges
            Gauge.prototype._getPointerColor = function (value) {
                var rng;
                if (!this._showRanges) {
                    var rng_1;
                    for (var i = 0; i < this._ranges.length; i++) { // TFS 269674
                        var r = this._ranges[i];
                        if (value >= r.min && value <= r.max) {
                            rng_1 = r;
                            break;
                        }
                    }
                    if (rng_1) {
                        return rng_1.color;
                    }
                }
                return this._pointer.color;
            };
            // keyboard handling
            Gauge.prototype._keydown = function (e) {
                if (!this._readOnly && this._step) {
                    var key = this._getKey(e.keyCode), handled = true;
                    switch (key) {
                        case wijmo.Key.Left:
                        case wijmo.Key.Down:
                            this.value = wijmo.clamp(this.value - this._step, this.min, this.max);
                            break;
                        case wijmo.Key.Right:
                        case wijmo.Key.Up:
                            this.value = wijmo.clamp(this.value + this._step, this.min, this.max);
                            break;
                        case wijmo.Key.Home:
                            this.value = this.min;
                            break;
                        case wijmo.Key.End:
                            this.value = this.max;
                            break;
                        default:
                            handled = false;
                            break;
                    }
                    if (handled) {
                        e.preventDefault();
                    }
                }
            };
            // override to translate keys to account for gauge direction
            Gauge.prototype._getKey = function (key) {
                return key;
            };
            // apply value based on mouse/pointer position
            Gauge.prototype._applyMouseValue = function (e, instant) {
                if (!this.isReadOnly && this.containsFocus()) {
                    var value = this.hitTest(e);
                    if (value != null) {
                        var anim = this._animated, step = this._step;
                        // disable animation for instant changes
                        if (instant) {
                            this._animated = false;
                        }
                        // make the change (TFS 256767)
                        if (step) {
                            value = Math.round(value / step) * step;
                        }
                        this.value = wijmo.clamp(value, this.min, this.max);
                        // restore animation and return true
                        this._animated = anim;
                        return true;
                    }
                }
                // not editable or hit-test off the gauge? return false
                return false;
            };
            // ** virtual methods (must be overridden in derived classes)
            // updates the range element
            Gauge.prototype._updateRangeElement = function (e, rng, value) {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // updates the text elements
            Gauge.prototype._updateText = function () {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // updates the tickmarks
            Gauge.prototype._updateTicks = function () {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // gets the value at a given point (in gauge client coordinates)
            Gauge.prototype._getValueFromPoint = function (pt) {
                return null;
            };
            // formats numbers or points with up to 4 decimals
            Gauge.prototype._fix = function (n) {
                return wijmo.isNumber(n)
                    ? parseFloat(n.toFixed(4)).toString()
                    : this._fix(n.x) + ' ' + this._fix(n.y);
            };
            // update ARIA attributes for this control
            Gauge.prototype._updateAria = function () {
                var host = this.hostElement;
                if (host) {
                    wijmo.setAttribute(host, 'aria-valuemin', this.min);
                    wijmo.setAttribute(host, 'aria-valuemax', this.max);
                    wijmo.setAttribute(host, 'aria-valuenow', this.value);
                }
            };
            Gauge._SVGNS = 'http://www.w3.org/2000/svg';
            Gauge._ctr = 0;
            /**
             * Gets or sets the template used to instantiate {@link Gauge} controls.
             */
            Gauge.controlTemplate = '<div wj-part="dsvg" dir="ltr">' + // dir="ltr" set to address TFS 233532
                '<svg wj-part="svg" width="100%" height="100%">' +
                '<defs>' +
                '<filter wj-part="filter">' +
                '<feOffset dx="3" dy="3"></feOffset>' +
                '<feGaussianBlur result="offset-blur" stdDeviation="5"></feGaussianBlur>' +
                '<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>' +
                '<feFlood flood-color="black" flood-opacity="0.2" result="color"></feFlood>' +
                '<feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>' +
                '<feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>' +
                '</filter>' +
                '</defs>' +
                '<g wj-part="gface" class="wj-face">' +
                '<path wj-part="pface"/>' +
                '</g>' +
                '<g wj-part="granges" class="wj-ranges"/>' +
                '<g wj-part="gpointer" class="wj-pointer">' +
                '<path wj-part="ppointer"/>' +
                '</g>' +
                '<g wj-part="gcover" class="wj-cover">' +
                '<path wj-part="pticks" class="wj-ticks"/>' +
                '<g wj-part="gticks" aria-hidden="true" class="wj-tick-text"/>' +
                '<circle wj-part="cvalue" class="wj-pointer wj-thumb"/>' +
                '<g wj-part="gneedle" class="wj-needle"/>' +
                '<text wj-part="value" class="wj-value"/>' +
                '<text wj-part="min" class="wj-min" aria-hidden="true"/>' +
                '<text wj-part="max" class="wj-max" aria-hidden="true"/>' +
                '</g>' +
                '</svg>' +
                '</div>';
            return Gauge;
        }(wijmo.Control));
        gauge_1.Gauge = Gauge;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * Specifies a pre-defined shape for the gauge's needle element.
         */
        var NeedleShape;
        (function (NeedleShape) {
            /** No pre-defined shape. */
            NeedleShape[NeedleShape["None"] = 0] = "None";
            /** The needle element has a triangular shape. */
            NeedleShape[NeedleShape["Triangle"] = 1] = "Triangle";
            /** The needle element has a diamond shape. */
            NeedleShape[NeedleShape["Diamond"] = 2] = "Diamond";
            /** The needle element has an hexagonal shape. */
            NeedleShape[NeedleShape["Hexagon"] = 3] = "Hexagon";
            /** The needle element has a rectangular shape. */
            NeedleShape[NeedleShape["Rectangle"] = 4] = "Rectangle";
            /** The needle element has an arrow shape. */
            NeedleShape[NeedleShape["Arrow"] = 5] = "Arrow";
            /** The needle element has a wide arrow shape. */
            NeedleShape[NeedleShape["WideArrow"] = 6] = "WideArrow";
            /** The needle element has a pointer shape. */
            NeedleShape[NeedleShape["Pointer"] = 7] = "Pointer";
            /** The needle element has a wide pointer shape. */
            NeedleShape[NeedleShape["WidePointer"] = 8] = "WidePointer";
            /** The needle element has a triangular shape with an offset. */
            NeedleShape[NeedleShape["Outer"] = 9] = "Outer";
        })(NeedleShape = gauge.NeedleShape || (gauge.NeedleShape = {}));
        /**
         * Specifies the length of the needle element with respect to the pointer range.
         */
        var NeedleLength;
        (function (NeedleLength) {
            /** The needle element extends to the outer radius of the pointer range. */
            NeedleLength[NeedleLength["Outer"] = 0] = "Outer";
            /** The needle element extends to the mid ponit between the inner and outer radii of the pointer range. */
            NeedleLength[NeedleLength["Middle"] = 1] = "Middle";
            /** The needle element extends to the inner radius of the pointer range. */
            NeedleLength[NeedleLength["Inner"] = 2] = "Inner";
        })(NeedleLength = gauge.NeedleLength || (gauge.NeedleLength = {}));
        /**
         * The {@link RadialGauge} displays a circular scale with an indicator
         * that represents a single value and optional ranges to represent
         * reference values.
         *
         * If you set the gauge's {@link RadialGauge.isReadOnly} property to
         * false, then users will be able to edit the value by clicking on
         * the gauge.
         *
         * {@sample Gauge/RadialGauge Example}
         */
        var RadialGauge = /** @class */ (function (_super) {
            __extends(RadialGauge, _super);
            /**
             * Initializes a new instance of the {@link RadialGauge} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function RadialGauge(element, options) {
                var _this = _super.call(this, element, null) || this;
                // property storage
                _this._startAngle = 0;
                _this._sweepAngle = 180;
                _this._autoScale = true;
                _this._ndlShape = NeedleShape.None;
                _this._ndlLength = NeedleLength.Middle;
                // customize
                wijmo.addClass(_this.hostElement, 'wj-radialgauge');
                _this._thickness = .4;
                _this.showText = gauge.ShowText.All;
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(RadialGauge.prototype, "startAngle", {
                /**
                 * Gets or sets the starting angle for the gauge.
                 *
                 * Angles are measured in degrees, clockwise, starting from the
                 * 9 o'clock position.
                 *
                 * The default value for this property is **0**.
                 */
                get: function () {
                    return this._startAngle;
                },
                set: function (value) {
                    if (value != this._startAngle) {
                        this._startAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "sweepAngle", {
                /**
                 * Gets or sets the sweep angle for the gauge.
                 *
                 * Angles are measured in degrees, clockwise,
                 * starting from the 9 o'clock position.
                 *
                 * The default value for this property is **180** degrees.
                 */
                get: function () {
                    return this._sweepAngle;
                },
                set: function (value) {
                    if (value != this._sweepAngle) {
                        this._sweepAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "autoScale", {
                /**
                 * Gets or sets a value that indicates whether the gauge automatically
                 * scales to fill the host element.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._autoScale;
                },
                set: function (value) {
                    if (value != this._autoScale) {
                        this._autoScale = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "faceBounds", {
                /**
                 * Gets the bounds of the gauge's face element.
                 *
                 * This property is useful for positioning custom SVG elements
                 * on the gauge.
                 *
                 * {@fiddle mbno06j3}
                 */
                get: function () {
                    return this._rcSvg ? this._rcSvg.clone() : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "clientSize", {
                get: function () {
                    wijmo._deprecated('clientSize', 'faceBounds');
                    var rc = this._rcSvg;
                    return rc ? new wijmo.Size(rc.width, rc.height) : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "needleElement", {
                /**
                 * Gets or sets an SVGElement to be used as a needle for the Gauge.
                 *
                 * If provided, the needle element should extend from 0 to 100
                 * units in the X direction, and should typically be symmetrical
                 * about the Y axis.
                 *
                 * When this property is set, the needle element becomes part of
                 * the gauge DOM and is removed from its original container.
                 * To use the same element in several gauges, use the clone method
                 * to create copies of the needle element.
                 */
                get: function () {
                    return this._ndlElement;
                },
                set: function (value) {
                    if (value != this._ndlElement) {
                        // no pre-defined shape
                        this._ndlShape = 0;
                        // save new element
                        this._ndlElement = wijmo.asType(value, SVGElement, true);
                        // add it to the gauge
                        var gNeedle = this._gNeedle;
                        while (gNeedle.firstChild) {
                            wijmo.removeChild(gNeedle.firstChild);
                        }
                        if (this._ndlElement) {
                            wijmo.setAttribute(gNeedle, 'transform', 'scale(0)'); // hide until update
                            gNeedle.appendChild(this._ndlElement);
                        }
                        // show it
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "needleShape", {
                /**
                 * Gets or sets a value that determines the shape of the gauge's
                 * needle element.
                 *
                 * Use this property to select one of the pre-defined needle shapes.
                 * The pre-defined shapes are created using the
                 * {@link createNeedleElement} method.
                 *
                 * You can also create custom needle elements by setting the
                 * {@link needleElement} property to custom elements created using
                 * the {@link createNeedleElement} method with parameters of your
                 * choice, or to custom SVG group elements created using whatever
                 * method you prefer.
                 *
                 * You can style the needle using CSS. For example:
                 *
                 * ```css
                 * .wj-gauge .wj-needle {
                 *     fill: orangered;
                 *     stroke: orangered;
                 * }
                 * .wj-gauge .wj-needle .wj-inner-needle-cap {
                 *     fill: white;
                 * }
                 * ```
                 *
                 * The default value for this property is **NeedleShape.None**.
                 */
                get: function () {
                    return this._ndlShape;
                },
                set: function (value) {
                    if (value != this._ndlShape) {
                        value = wijmo.asEnum(value, NeedleShape);
                        var needle = null;
                        switch (value) {
                            case NeedleShape.Triangle:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -10, y: 10 },
                                    { x: 100, y: 0 }
                                ]);
                                break;
                            case NeedleShape.Diamond:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -20, y: 0 },
                                    { x: 0, y: 10 },
                                    { x: 100, y: 0 }
                                ]);
                                break;
                            case NeedleShape.Hexagon:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -15, y: 0 },
                                    { x: -10, y: 5 },
                                    { x: 10, y: 5 },
                                    { x: 100, y: 0 }
                                ]);
                                break;
                            case NeedleShape.Rectangle:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -20, y: 3 },
                                    { x: 100, y: 3 }
                                ], 10);
                                break;
                            case NeedleShape.Arrow:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -20, y: 3 },
                                    { x: 70, y: 3 },
                                    { x: 70, y: 15 },
                                    { x: 100, y: 0 }
                                ], 10);
                                break;
                            case NeedleShape.WideArrow:
                                needle = RadialGauge.createNeedleElement([
                                    { x: -30, y: 5 },
                                    { x: -40, y: 15 },
                                    { x: -20, y: 15 },
                                    { x: -10, y: 5 },
                                    { x: 80, y: 5 },
                                    { x: 70, y: 15 },
                                    { x: 100, y: 0 }
                                ]);
                                break;
                            case NeedleShape.Pointer:
                                needle = RadialGauge.createNeedleElement([
                                    { x: 0, y: 10 },
                                    { x: 100, y: 0 }
                                ], 20, 10);
                                break;
                            case NeedleShape.WidePointer:
                                needle = RadialGauge.createNeedleElement([
                                    { x: 0, y: 20 },
                                    { x: 100, y: 0 }
                                ], 20, 10);
                                break;
                            case NeedleShape.Outer:
                                needle = RadialGauge.createNeedleElement([
                                    { x: 60, y: 20 },
                                    { x: 100, y: 0 }
                                ]);
                                break;
                        }
                        this.needleElement = needle;
                        this._ndlShape = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "needleLength", {
                /**
                 * Gets or sets a value that determines the length of the gauge's
                 * {@link needleElement} with respect to the pointer range.
                 *
                 * The default value for this property is **NeedleLength.Middle**.
                 */
                get: function () {
                    return this._ndlLength;
                },
                set: function (value) {
                    if (value != this._ndlLength) {
                        this._ndlLength = wijmo.asEnum(value, NeedleLength);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Creates an SVG element to be used as a gauge needle.
             *
             * @param points Array of objects with "x" and "y" values that define
             * the needle shape. The "x" values should range from 0 (gauge center)
             * to 100 (gauge radius). The "y" values define the needle width, and
             * typically range from 0 to 20. Each "y" value is used twice: from
             * left to right to define the extent of the needle above the needle
             * axis, and from right to left, with sign reversed, to define the
             * extent of the needle below the axis.
             * @param capRadius Optional value that defines the radius of the
             * cap element, a circle centered at the origin.
             * @param innerCapRadius Optional value that defines the radius of
             * a circle painted above the cap element.
             *
             * The {@link createNeedleElement} method provides an easy and concise
             * way to create custom needle shapes for use with the
             * {@link needleElement} property.
             *
             * For example, the code below shows how the {@link createNeedleElement}
             * method is used internally by the {@link RadialGauge} to build some of
             * the common needle shapes defined by the {@link NeedleShape} enumeration:
             *
             * ```typescript
             * let needle = null;
             * switch (value) {
             *     case NeedleShape.Triangle:
             *         needle = RadialGauge.createNeedleElement([
             *             { x: -10, y: 10 }, { x: 100, y: 0 }
             *         ]);
             *         break;
             *     case NeedleShape.Diamond:
             *         needle = RadialGauge.createNeedleElement([
             *             { x: -20, y: 0 }, { x: 0, y: 10 }, { x: 100, y: 0 }
             *         ]);
             *         break;
             *     case NeedleShape.Drop:
             *         needle = RadialGauge.createNeedleElement([
             *             { x: 0, y: 20 }, { x: 100, y: 0 }
             *         ], 20, 10);
             *         break;
             *     case NeedleShape.Outer:
             *         needle = RadialGauge.createNeedleElement([
             *           { x: 60, y: 20 }, { x: 100, y: 0 }
             *         ]);
             *         break;
             * }
             * ```
             */
            RadialGauge.createNeedleElement = function (points, capRadius, innerCapRadius) {
                // build needle path
                var pathDef = '';
                for (var i = 0; i < points.length; i++) {
                    var pt = points[i];
                    if (i == points.length - 1 && pt.y == 0) {
                        break;
                    }
                    pathDef += (i > 0 ? ' L ' : 'M ') + (pt.x) + ' ' + (pt.y);
                }
                for (var i = points.length - 1; i >= 0; i--) {
                    var pt = points[i];
                    pathDef += ' L ' + (pt.x) + ' ' + (-pt.y);
                }
                pathDef += ' Z';
                // wrap it in an SVG group element
                var ns = 'http://www.w3.org/2000/svg';
                var g = document.createElementNS(ns, 'g');
                var p = document.createElementNS(ns, 'path');
                wijmo.setAttribute(p, 'd', pathDef);
                g.appendChild(p);
                // add cap elements
                if (capRadius) {
                    var cap = document.createElementNS(ns, 'circle');
                    wijmo.addClass(cap, 'wj-needle-cap');
                    wijmo.setAttribute(cap, 'r', capRadius);
                    g.appendChild(cap);
                    if (innerCapRadius) {
                        cap = document.createElementNS(ns, 'circle');
                        wijmo.addClass(cap, 'wj-inner-needle-cap');
                        wijmo.setAttribute(cap, 'r', innerCapRadius);
                        g.appendChild(cap);
                    }
                }
                // all done!
                return g;
            };
            // virtual methods
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Indicates whether to update the control layout as well as the content.
             */
            RadialGauge.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                // clear viewbox
                wijmo.setAttribute(this._svg, 'viewBox', null);
                // cache svg rect since (in Chrome) it changes after setting the viewbox
                this._rcSvg = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
                // update gauge
                _super.prototype.refresh.call(this, fullUpdate);
                // clear transform matrix
                this._ctmInv = null;
                this._ptSvg = null;
                // set viewbox to auto-scale
                if (this._autoScale) {
                    // clear viewbox first
                    wijmo.setAttribute(this._svg, 'viewBox', null);
                    // measure
                    var rc = wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._pFace));
                    if ((this.showText & gauge.ShowText.Value) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tValue)));
                    }
                    if ((this.showText & gauge.ShowText.MinMax) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tMin)));
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tMax)));
                    }
                    // apply viewbox
                    var viewBox = [this._fix(rc.left), this._fix(rc.top), this._fix(rc.width), this._fix(rc.height)].join(' ');
                    wijmo.setAttribute(this._svg, 'viewBox', viewBox);
                    // save transform matrix for hit-testing (_getValueFromPoint)
                    var ctm = this._pFace.getCTM();
                    this._ctmInv = ctm ? ctm.inverse() : null; // TFS 144174
                    this._ptSvg = this._svg.createSVGPoint();
                }
            };
            // updates the element for a given range
            RadialGauge.prototype._updateRangeElement = function (e, rng, value) {
                if (this._rcSvg) {
                    var rc = this._rcSvg, center = new wijmo.Point(rc.width / 2, rc.height / 2), radius = Math.min(rc.width, rc.height) / 2, fThick = radius * this.thickness, rThick = fThick * rng.thickness, outer = radius - (fThick - rThick) / 2, inner = outer - rThick, start = this._getStartAngle(), sweep = this._getSweepAngle(), face = rng == this._face, ps = face ? 0 : this._getPercent(rng.min), pe = face ? 1 : this._getPercent(value), rngStart = start + sweep * ps, rngSweep = sweep * (pe - ps);
                    // stack ranges
                    if (this.stackRanges && rng != this.face && rng != this.pointer) {
                        var index = this.ranges.indexOf(rng);
                        if (index > -1) {
                            var len = this.ranges.length, wid = (outer - inner) / len;
                            inner += (len - 1 - index) * wid;
                            outer = inner + wid;
                        }
                    }
                    // update path
                    this._updateSegment(e, center, outer, inner, rngStart, rngSweep);
                    // update pointer thumb and/or needle
                    if (rng == this._pointer) {
                        var fix = this._fix;
                        // thumb
                        if (this.thumbSize > 0) {
                            var color = this._animColor ? this._animColor : this._getPointerColor(rng.max), pt = this._getPoint(center, start + sweep * this._getPercent(value), (outer + inner) / 2), ce = this._cValue;
                            wijmo.setAttribute(ce, 'cx', fix(pt.x));
                            wijmo.setAttribute(ce, 'cy', fix(pt.y));
                            wijmo.setAttribute(ce, 'style', color ? 'fill:' + color : null);
                            wijmo.setAttribute(ce, 'r', fix(this.thumbSize / 2));
                        }
                        // needle
                        if (this.needleElement) {
                            // calculate needle length
                            var radius_1 = outer;
                            if (this._ndlLength == NeedleLength.Inner) {
                                radius_1 = inner;
                            }
                            else if (this._ndlLength == NeedleLength.Middle) {
                                radius_1 = (inner + outer) / 2;
                            }
                            // apply transforms
                            var t = 'translate({cx}, {cy}) scale({scale}) rotate({angle})'
                                .replace('{cx}', fix(center.x)) // translate so 0,0 is at the center
                                .replace('{cy}', fix(center.y))
                                .replace('{scale}', fix(radius_1 / 100)) // scale so 100 is the radius
                                .replace('{angle}', fix(rngStart + rngSweep)); // rotate so it points to the current value
                            this._gNeedle.setAttribute('transform', t); // apply the transform
                        }
                    }
                }
            };
            // gets the start angle accounting for RTL (TFS 441076)
            RadialGauge.prototype._getStartAngle = function () {
                var start = this.startAngle + 180;
                if (this.rightToLeft) {
                    start = 180 - start;
                }
                return start;
            };
            // gets the sweep angle accounting for RTL (TFS 441076)
            RadialGauge.prototype._getSweepAngle = function () {
                var sweep = this.sweepAngle;
                if (this.rightToLeft) {
                    sweep = -sweep;
                }
                return sweep;
            };
            // update the content and position of the text elements
            RadialGauge.prototype._updateText = function () {
                if (this._rcSvg) {
                    var rc = this._rcSvg, center = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, inner = Math.max(0, outer * (1 - this.thickness)), start = this._getStartAngle(), sweep = this._getSweepAngle();
                    // show thumb if it has a size
                    this._showElement(this._cValue, this.thumbSize > 0);
                    // hide min/max if sweep angle > 300 degrees
                    var show = (this.showText & gauge.ShowText.MinMax) != 0 && Math.abs(sweep) <= 300;
                    this._showElement(this._tMin, show);
                    this._showElement(this._tMax, show);
                    // update text/position
                    this._centerText(this._tValue, this.value, center);
                    var offset = 10 * (this._getSweepAngle() < 0 ? -1 : +1);
                    this._centerText(this._tMin, this.min, this._getPoint(center, start - offset, (outer + inner) / 2));
                    this._centerText(this._tMax, this.max, this._getPoint(center, start + sweep + offset, (outer + inner) / 2));
                }
            };
            // update the tickmarks
            RadialGauge.prototype._updateTicks = function () {
                var step = (this.tickSpacing && this.tickSpacing > 0) ? this.tickSpacing : this.step, path = '', gTicks = this._gTicks;
                // clear tickmark text
                while (gTicks.firstChild) {
                    wijmo.removeChild(gTicks.firstChild);
                }
                // draw tickmarks and text
                if (this.showTicks && step > 0) {
                    var rc = this._rcSvg, ctr = new wijmo.Point(rc.width / 2, rc.height / 2), radius = Math.min(rc.width, rc.height) / 2, fThick = radius * this.thickness, rThick = fThick * this._face.thickness, outer = radius - (fThick - rThick) / 2, inner = outer - rThick, rTick = outer * 1.15, start = this._getStartAngle(), sweep = this._getSweepAngle();
                    for (var val = this.min; val <= this.max; val += step) {
                        var angle = start + sweep * this._getPercent(val), p1 = this._fix(this._getPoint(ctr, angle, inner)), p2 = this._fix(this._getPoint(ctr, angle, outer));
                        // tick mark
                        if (val > this.min && val < this.max) {
                            path += 'M ' + p1 + ' L ' + p2 + ' ';
                        }
                        // tick text
                        if (this.showTickText) {
                            var tt = this._createElement('text', gTicks), p = this._getPoint(ctr, angle, rTick);
                            this._centerText(tt, val, p);
                        }
                    }
                }
                this._pTicks.setAttribute('d', path);
            };
            // draws a radial segment at the specified position
            RadialGauge.prototype._updateSegment = function (path, ctr, rOut, rIn, start, sweep) {
                sweep = Math.min(Math.max(sweep, -359.99), 359.99);
                var p1 = this._getPoint(ctr, start, rIn), p2 = this._getPoint(ctr, start, rOut), p3 = this._getPoint(ctr, start + sweep, rOut), p4 = this._getPoint(ctr, start + sweep, rIn);
                var data = {
                    large: Math.abs(sweep) > 180 ? 1 : 0,
                    cw: sweep > 0 ? 1 : 0,
                    ccw: sweep > 0 ? 0 : 1,
                    or: this._fix(rOut),
                    ir: this._fix(rIn),
                    p1: this._fix(p1),
                    p2: this._fix(p2),
                    p3: this._fix(p3),
                    p4: this._fix(p4)
                };
                var content = wijmo.format('M {p1} ' +
                    'L {p2} A {or} {or} 0 {large} {cw} {p3} ' +
                    'L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z', data);
                path.setAttribute('d', content);
            };
            // converts polar to Cartesian coordinates
            RadialGauge.prototype._getPoint = function (ctr, angle, radius) {
                angle = angle * Math.PI / 180;
                return new wijmo.Point(ctr.x + radius * Math.cos(angle), ctr.y + radius * Math.sin(angle));
            };
            // gets the gauge value at a given point (in gauge client coordinates)
            RadialGauge.prototype._getValueFromPoint = function (pt) {
                // convert client coordinates to SVG viewport
                // the getCTM matrix transforms viewport into client coordinates
                // the inverse matrix transforms client into viewport, which is what we want
                if (this.autoScale && this._ctmInv) {
                    this._ptSvg.x = pt.x;
                    this._ptSvg.y = pt.y;
                    this._ptSvg = this._ptSvg.matrixTransform(this._ctmInv);
                    pt.x = this._ptSvg.x;
                    pt.y = this._ptSvg.y;
                }
                // sanity
                if (!this._rcSvg || !this.sweepAngle) {
                    return null;
                }
                // calculate geometry
                var rc = this._rcSvg, ctr = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, dx = pt.x - ctr.x, dy = pt.y - ctr.y, r2 = dy * dy + dx * dx;
                // check that the point is not too close to the center (10 pixels at least)
                // nor too far from the outer edge of the face (TFS 391703)
                var edge = 10;
                if (r2 < edge * edge || r2 > (outer + edge) * (outer + edge)) {
                    return null;
                }
                // calculate angle
                var ang = (Math.PI - Math.atan2(-dy, dx)) * 180 / Math.PI, start = this.startAngle, sweep = this.sweepAngle, end = start + sweep;
                if (this.rightToLeft) {
                    ang = 180 - ang;
                }
                if (sweep > 0) {
                    while (ang < start)
                        ang += 360;
                    while (ang > end)
                        ang -= 360;
                }
                else {
                    while (ang < end)
                        ang += 360;
                    while (ang > start)
                        ang -= 360;
                }
                // clamp the angle (TFS 431484)
                if ((ang - start) * (ang - end) > 0) {
                    var pAng = this._getPoint(ctr, ang, outer), pMin = this._getPoint(ctr, start, outer), pMax = this._getPoint(ctr, end, outer);
                    ang = this._getDist2(pAng, pMin) < this._getDist2(pAng, pMax) ? start : end;
                }
                // calculate percentage and return value
                var pct = sweep ? wijmo.clamp(Math.abs(ang - start) / Math.abs(sweep), 0, 1) : 0; // TFS 435434
                return this.min + pct * (this.max - this.min);
            };
            // measures the distance between two points (squared)
            RadialGauge.prototype._getDist2 = function (p1, p2) {
                var dx = p1.x - p2.x, dy = p1.y - p2.y;
                return dx * dx + dy * dy;
            };
            return RadialGauge;
        }(gauge.Gauge));
        gauge.RadialGauge = RadialGauge;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * Represents the direction in which the pointer of a {@link LinearGauge}
         * increases.
         */
        var GaugeDirection;
        (function (GaugeDirection) {
            /** Gauge value increases from left to right. */
            GaugeDirection[GaugeDirection["Right"] = 0] = "Right";
            /** Gauge value increases from right to left. */
            GaugeDirection[GaugeDirection["Left"] = 1] = "Left";
            /** Gauge value increases from bottom to top. */
            GaugeDirection[GaugeDirection["Up"] = 2] = "Up";
            /** Gauge value increases from top to bottom. */
            GaugeDirection[GaugeDirection["Down"] = 3] = "Down";
        })(GaugeDirection = gauge.GaugeDirection || (gauge.GaugeDirection = {}));
        /**
         * The {@link LinearGauge} displays a linear scale with an indicator
         * that represents a single value and optional ranges to represent
         * reference values.
         *
         * If you set the gauge's {@link LinearGauge.isReadOnly} property to
         * false, then users will be able to edit the value by clicking on
         * the gauge.
         *
         * {@sample Gauge/LinearGauge Example}
         */
        var LinearGauge = /** @class */ (function (_super) {
            __extends(LinearGauge, _super);
            /**
             * Initializes a new instance of the {@link LinearGauge} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function LinearGauge(element, options) {
                var _this = _super.call(this, element, null) || this;
                // property storage
                _this._direction = GaugeDirection.Right;
                // customize
                wijmo.addClass(_this.hostElement, 'wj-lineargauge');
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(LinearGauge.prototype, "direction", {
                /**
                 * Gets or sets the direction in which the gauge is filled.
                 *
                 * The default value for this property is **GaugeDirection.Right**.
                 */
                get: function () {
                    return this._direction;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, GaugeDirection);
                    if (value != this._direction) {
                        this._direction = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinearGauge.prototype, "faceBounds", {
                /**
                 * Gets the bounds of the gauge's face element.
                 *
                 * This property is useful for positioning custom SVG elements
                 * on the gauge.
                 *
                 * {@fiddle tha1vms3}
                 *
                 */
                get: function () {
                    return this._getRangeRect(this._face);
                },
                enumerable: true,
                configurable: true
            });
            // virtual methods
            // updates the element for a given range
            LinearGauge.prototype._updateRangeElement = function (e, rng, value) {
                // update the path
                var rc = this._getRangeRect(rng, value);
                this._updateSegment(e, rc);
                // check whether we have to show text and/or thumb
                var showText = (rng == this._pointer) && (this.showText & gauge.ShowText.Value) != 0, showThumb = showText || (rng == this._pointer && this.thumbSize > 0);
                // calculate thumb center
                var x = rc.left + rc.width / 2, y = rc.top + rc.height / 2;
                switch (this._getDirection()) {
                    case GaugeDirection.Right:
                        x = rc.right;
                        break;
                    case GaugeDirection.Left:
                        x = rc.left;
                        break;
                    case GaugeDirection.Up:
                        y = rc.top;
                        break;
                    case GaugeDirection.Down:
                        y = rc.bottom;
                        break;
                }
                // update text
                if (showText) {
                    this._centerText(this._tValue, value, new wijmo.Point(x, y));
                }
                // update thumb
                if (showText || showThumb) {
                    rc = wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tValue));
                    var color = this._animColor ? this._animColor : this._getPointerColor(rng.max), radius = this.thumbSize != null ? this.thumbSize / 2 : Math.max(rc.width, rc.height) * .8, ce = this._cValue;
                    wijmo.setAttribute(ce, 'cx', this._fix(x));
                    wijmo.setAttribute(ce, 'cy', this._fix(y));
                    wijmo.setAttribute(ce, 'style', color ? 'fill:' + color : null);
                    wijmo.setAttribute(ce, 'r', this._fix(radius));
                }
            };
            // update the text elements
            LinearGauge.prototype._updateText = function () {
                var rc = this._getRangeRect(this._face);
                switch (this._getDirection()) {
                    case GaugeDirection.Right:
                        this._setText(this._tMin, this.min, rc, 'left');
                        this._setText(this._tMax, this.max, rc, 'right');
                        break;
                    case GaugeDirection.Left:
                        this._setText(this._tMin, this.min, rc, 'right');
                        this._setText(this._tMax, this.max, rc, 'left');
                        break;
                    case GaugeDirection.Up:
                        this._setText(this._tMin, this.min, rc, 'bottom');
                        this._setText(this._tMax, this.max, rc, 'top');
                        break;
                    case GaugeDirection.Down:
                        this._setText(this._tMin, this.min, rc, 'top');
                        this._setText(this._tMax, this.max, rc, 'bottom');
                        break;
                }
            };
            // update the tickmarks
            LinearGauge.prototype._updateTicks = function () {
                var step = (this.tickSpacing && this.tickSpacing > 0) ? this.tickSpacing : this.step, path = '', gTicks = this._gTicks;
                // clear tickmark text
                while (gTicks.firstChild) {
                    wijmo.removeChild(gTicks.firstChild);
                }
                // draw tickmarks and text
                if (this.showTicks && step > 0) {
                    var rc = this._getRangeRect(this._face), pt = new wijmo.Point(rc.left - rc.width * 0.75, rc.top - rc.height * 0.75), pos = void 0, fix = this._fix;
                    for (var val = this.min; val <= this.max; val += step) {
                        var tickPath = null;
                        switch (this._getDirection()) {
                            case GaugeDirection.Right:
                                pt.x = rc.left + rc.width * this._getPercent(val);
                                pos = fix(pt.x);
                                tickPath = 'M ' + pos + ' ' + fix(rc.top) + ' L ' + pos + ' ' + fix(rc.bottom) + ' ';
                                break;
                            case GaugeDirection.Left:
                                pt.x = rc.right - rc.width * this._getPercent(val);
                                pos = fix(pt.x);
                                tickPath = 'M ' + pos + ' ' + fix(rc.top) + ' L ' + pos + ' ' + fix(rc.bottom) + ' ';
                                break;
                            case GaugeDirection.Up:
                                pt.y = rc.bottom - rc.height * this._getPercent(val);
                                pos = fix(pt.y);
                                tickPath = 'M ' + fix(rc.left) + ' ' + pos + ' L ' + fix(rc.right) + ' ' + pos + ' ';
                                break;
                            case GaugeDirection.Down:
                                pt.y = rc.top + rc.height * this._getPercent(val);
                                pos = fix(pt.y);
                                tickPath = 'M ' + fix(rc.left) + ' ' + pos + ' L ' + fix(rc.right) + ' ' + pos + ' ';
                                break;
                        }
                        // tick mark
                        if (val > this.min && val < this.max) {
                            path += tickPath;
                        }
                        // tick text
                        if (this.showTickText) {
                            var tt = this._createElement('text', gTicks);
                            this._centerText(tt, val, pt);
                        }
                    }
                }
                this._pTicks.setAttribute('d', path);
            };
            // ** private stuff
            // draws a rectangular segment at the specified position
            LinearGauge.prototype._updateSegment = function (path, rc) {
                var data = {
                    p1: this._fix(new wijmo.Point(rc.left, rc.top)),
                    p2: this._fix(new wijmo.Point(rc.right, rc.top)),
                    p3: this._fix(new wijmo.Point(rc.right, rc.bottom)),
                    p4: this._fix(new wijmo.Point(rc.left, rc.bottom))
                };
                var content = wijmo.format('M {p1} L {p2} L {p3} L {p4} Z', data);
                path.setAttribute('d', content);
            };
            // positions a text element
            LinearGauge.prototype._setText = function (e, value, rc, pos) {
                if (e.getAttribute('display') != 'none') {
                    // get the text for the element (TFS 250358)
                    var text = wijmo.Globalize.format(value, this.format);
                    if (wijmo.isFunction(this.getText)) {
                        var part = e == this._tValue ? 'value' :
                            e == this._tMin ? 'min' :
                                e == this._tMax ? 'max' :
                                    null;
                        wijmo.assert(part != null, 'unknown element');
                        text = this.getText(this, part, value, text);
                    }
                    // set the text and position the element
                    e.textContent = text;
                    var box = wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(e)), pt = new wijmo.Point(rc.left + rc.width / 2 - box.width / 2, rc.top + rc.height / 2 + box.height / 2);
                    switch (pos) {
                        case 'top':
                            pt.y = rc.top - 4;
                            break;
                        case 'left':
                            pt.x = rc.left - 4 - box.width;
                            break;
                        case 'right':
                            pt.x = rc.right + 4;
                            break;
                        case 'bottom':
                            pt.y = rc.bottom + 4 + box.height;
                            break;
                    }
                    e.setAttribute('x', this._fix(pt.x));
                    e.setAttribute('y', this._fix(pt.y));
                }
            };
            // gets a rectangle that represents a Range
            LinearGauge.prototype._getRangeRect = function (rng, value) {
                if (value === void 0) { value = rng.max; }
                // get gauge size
                var host = this.hostElement, rc = new wijmo.Rect(0, 0, host.clientWidth, host.clientHeight), direction = this._getDirection();
                // get face rect (account for thickness, text or thumb at edges)
                var padding = this.thumbSize ? Math.ceil(this.thumbSize / 2) : 0;
                if (this.showText != gauge.ShowText.None) {
                    var fontSize = parseInt(getComputedStyle(host).fontSize);
                    if (!isNaN(fontSize)) {
                        padding = Math.max(padding, 3 * fontSize);
                    }
                }
                switch (direction) {
                    case GaugeDirection.Right:
                    case GaugeDirection.Left:
                        rc = rc.inflate(-padding, -rc.height * (1 - this.thickness * rng.thickness) / 2);
                        break;
                    case GaugeDirection.Up:
                    case GaugeDirection.Down:
                        rc = rc.inflate(-rc.width * (1 - this.thickness * rng.thickness) / 2, -padding);
                        break;
                }
                // stack ranges
                if (this.stackRanges && rng != this.face && rng != this.pointer) {
                    var index = this.ranges.indexOf(rng);
                    if (index > -1) {
                        var len = this.ranges.length;
                        switch (direction) {
                            case GaugeDirection.Right:
                            case GaugeDirection.Left:
                                rc.height /= len;
                                rc.top += index * rc.height;
                                break;
                            case GaugeDirection.Up:
                            case GaugeDirection.Down:
                                rc.width /= len;
                                rc.left += index * rc.width;
                                break;
                        }
                    }
                }
                // get range rect
                var face = rng == this._face, pctMin = face ? 0 : this._getPercent(rng.min), pctMax = face ? 1 : this._getPercent(value); // TFS 210156
                switch (direction) {
                    case GaugeDirection.Right:
                        rc.left += rc.width * pctMin;
                        rc.width *= (pctMax - pctMin);
                        break;
                    case GaugeDirection.Left:
                        rc.left = rc.right - rc.width * pctMax;
                        rc.width = rc.width * (pctMax - pctMin);
                        break;
                    case GaugeDirection.Down:
                        rc.top += rc.height * pctMin;
                        rc.height *= (pctMax - pctMin);
                        break;
                    case GaugeDirection.Up:
                        rc.top = rc.bottom - rc.height * pctMax;
                        rc.height = rc.height * (pctMax - pctMin);
                        break;
                }
                // done
                return rc;
            };
            // gets the gauge value at a given point (in gauge client coordinates)
            LinearGauge.prototype._getValueFromPoint = function (pt) {
                // get face rectangle to calculate coordinates
                var rc = this._getRangeRect(this._face);
                // accept clicks anywhere to be touch-friendly
                //if (!rc.contains(pt)) {
                //    return null;
                //}
                // get position in control coordinates (min to max)
                var pct = 0;
                switch (this._getDirection()) {
                    case GaugeDirection.Right:
                        pct = rc.width > 0 ? (pt.x - rc.left) / rc.width : 0;
                        break;
                    case GaugeDirection.Left:
                        pct = rc.width > 0 ? (rc.right - pt.x) / rc.width : 0;
                        break;
                    case GaugeDirection.Up:
                        pct = rc.height > 0 ? (rc.bottom - pt.y) / rc.height : 0;
                        break;
                    case GaugeDirection.Down:
                        pct = rc.height > 0 ? (pt.y - rc.top) / rc.height : 0;
                        break;
                }
                // done
                return this.min + pct * (this.max - this.min);
            };
            // get gauge direction accounting for RTL (as in input type="range")
            LinearGauge.prototype._getDirection = function () {
                var dir = this._direction;
                if (this.rightToLeft) {
                    switch (dir) {
                        case GaugeDirection.Left:
                            dir = GaugeDirection.Right;
                            break;
                        case GaugeDirection.Right:
                            dir = GaugeDirection.Left;
                            break;
                    }
                }
                return dir;
            };
            // override to translate keys to account for gauge direction
            LinearGauge.prototype._getKey = function (key) {
                switch (this._getDirection()) {
                    // reverse left/right keys when direction is Left
                    case GaugeDirection.Left:
                        switch (key) {
                            case wijmo.Key.Left:
                                key = wijmo.Key.Right;
                                break;
                            case wijmo.Key.Right:
                                key = wijmo.Key.Left;
                                break;
                        }
                        break;
                    // reverse up/down keys when direction is Down
                    case GaugeDirection.Down:
                        switch (key) {
                            case wijmo.Key.Up:
                                key = wijmo.Key.Down;
                                break;
                            case wijmo.Key.Down:
                                key = wijmo.Key.Up;
                                break;
                        }
                        break;
                }
                return key;
            };
            return LinearGauge;
        }(gauge.Gauge));
        gauge.LinearGauge = LinearGauge;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * The {@link BulletGraph} is a type of linear gauge designed specifically for use
         * in dashboards. It displays a single key measure along with a comparative
         * measure and qualitative ranges to instantly signal whether the measure is
         * good, bad, or in some other state.
         *
         * Bullet Graphs were created and popularized by dashboard design expert
         * Stephen Few. You can find more details and examples on
         * <a href="https://en.wikipedia.org/wiki/Bullet_graph">Wikipedia</a>.
         *
         * {@sample Gauge/BulletGraph Example}
         */
        var BulletGraph = /** @class */ (function (_super) {
            __extends(BulletGraph, _super);
            /**
             * Initializes a new instance of the {@link BulletGraph} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function BulletGraph(element, options) {
                var _this = _super.call(this, element, null) || this;
                // customize
                wijmo.addClass(_this.hostElement, 'wj-bulletgraph');
                _this._pointer.thickness = .35;
                // add reference ranges
                _this._rngTarget = new gauge.Range('target');
                _this._rngTarget.thickness = .8;
                _this._rngTarget.color = 'black';
                _this._rngGood = new gauge.Range('good');
                _this._rngGood.color = 'rgba(0,0,0,.15)';
                _this._rngBad = new gauge.Range('bad');
                _this._rngBad.color = 'rgba(0,0,0,.3)';
                _this.ranges.push(_this._rngBad);
                _this.ranges.push(_this._rngGood);
                _this.ranges.push(_this._rngTarget);
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(BulletGraph.prototype, "target", {
                /**
                 * Gets or sets the target value for the measure.
                 */
                get: function () {
                    return this._rngTarget.max;
                },
                set: function (value) {
                    this._rngTarget.max = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BulletGraph.prototype, "good", {
                /**
                 * Gets or sets a reference value considered good for the measure.
                 */
                get: function () {
                    return this._rngGood.max;
                },
                set: function (value) {
                    this._rngGood.max = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BulletGraph.prototype, "bad", {
                /**
                 * Gets or sets a reference value considered bad for the measure.
                 */
                get: function () {
                    return this._rngBad.max;
                },
                set: function (value) {
                    this._rngBad.max = value;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // gets a rectangle that represents a Range
            BulletGraph.prototype._getRangeRect = function (rng, value) {
                if (value === void 0) { value = rng.max; }
                // let base class calculate the rectangle
                var rc = _super.prototype._getRangeRect.call(this, rng, value);
                // make target range rect look like a bullet
                if (rng == this._rngTarget) {
                    switch (this._getDirection()) { // TFS 233532
                        case gauge.GaugeDirection.Right:
                            rc.left = rc.right - 1;
                            rc.width = 3;
                            break;
                        case gauge.GaugeDirection.Left:
                            rc.width = 3;
                            break;
                        case gauge.GaugeDirection.Up:
                            rc.height = 3;
                            break;
                        case gauge.GaugeDirection.Down:
                            rc.top = rc.bottom - 1;
                            rc.height = 3;
                            break;
                    }
                }
                // done
                return rc;
            };
            return BulletGraph;
        }(gauge.LinearGauge));
        gauge.BulletGraph = BulletGraph;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var gauge;
    (function (gauge) {
        // Entry file. All real code files should be re-wijmo from here.
        wijmo._registerModule('wijmo.gauge', wijmo.gauge);
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.gauge.js.map