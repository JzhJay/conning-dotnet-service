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
        var annotation;
        (function (annotation) {
            'use strict';
            /**
             * Specifies the attachment of the annotation.
             */
            var AnnotationAttachment;
            (function (AnnotationAttachment) {
                /**
                * Coordinates of the annotation point are defined by the data series index and
                * the data point index. */
                AnnotationAttachment[AnnotationAttachment["DataIndex"] = 0] = "DataIndex";
                /** Annotation point is specified in data coordinates. */
                AnnotationAttachment[AnnotationAttachment["DataCoordinate"] = 1] = "DataCoordinate";
                /** Annotation point is specified as a relative position inside the control where
                * (0,0) is the top left corner and (1,1) is the bottom right corner.*/
                AnnotationAttachment[AnnotationAttachment["Relative"] = 2] = "Relative";
                /** The annotation point is specified in control's pixel coordinates.  */
                AnnotationAttachment[AnnotationAttachment["Absolute"] = 3] = "Absolute";
            })(AnnotationAttachment = annotation.AnnotationAttachment || (annotation.AnnotationAttachment = {}));
            /**
             * Specifies the position of the annotation.
             */
            var AnnotationPosition;
            (function (AnnotationPosition) {
                /** The annotation appears at the Center of the target point. */
                AnnotationPosition[AnnotationPosition["Center"] = 0] = "Center";
                /** The annotation appears at the Top of the target point. */
                AnnotationPosition[AnnotationPosition["Top"] = 1] = "Top";
                /** The annotation appears at the Bottom of the target point. */
                AnnotationPosition[AnnotationPosition["Bottom"] = 2] = "Bottom";
                /** The annotation appears at the Left of the target point. */
                AnnotationPosition[AnnotationPosition["Left"] = 4] = "Left";
                /** The annotation appears at the Right of the target point. */
                AnnotationPosition[AnnotationPosition["Right"] = 8] = "Right";
            })(AnnotationPosition = annotation.AnnotationPosition || (annotation.AnnotationPosition = {}));
            /**
             * Represents the base class of annotations for the {@link AnnotationLayer}.
             */
            var AnnotationBase = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link AnnotationBase} class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function AnnotationBase(options) {
                    this._resetDefaultValue();
                    this._copy(this, options);
                }
                Object.defineProperty(AnnotationBase.prototype, "attachment", {
                    /**
                     * Gets or sets the attachment of the annotation.
                     */
                    get: function () {
                        return this._attachment;
                    },
                    set: function (value) {
                        value = wijmo.asEnum(value, AnnotationAttachment);
                        if (value != this._attachment) {
                            this._attachment = value;
                            this._repaint();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "point", {
                    /**
                     * Gets or sets the point of the annotation.
                     * The coordinates of points depends on the {@link attachment} property.
                     * See {@link AnnotationAttachment} for further description.
                     */
                    get: function () {
                        return this._point;
                    },
                    set: function (value) {
                        if (value.x == null || value.y == null) {
                            return;
                        }
                        if (value.x === this._point.x && value.y === this._point.y) {
                            return;
                        }
                        this._point = value;
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "seriesIndex", {
                    /**
                     * Gets or sets the data series index of the annotation.
                     * Applies only when the <b>attachment</b> property is set to DataIndex.
                     */
                    get: function () {
                        return this._seriesIndex;
                    },
                    set: function (value) {
                        value = wijmo.asNumber(value, false, true);
                        if (value != this._seriesIndex) {
                            this._seriesIndex = value;
                            this._repaint();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "pointIndex", {
                    /**
                     * Gets or sets the data point index of the annotation.
                     * Applies only when the <b>attachment</b> property is set to DataIndex.
                     */
                    get: function () {
                        return this._pointIndex;
                    },
                    set: function (value) {
                        if (value === this._pointIndex) {
                            return;
                        }
                        this._pointIndex = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "position", {
                    /**
                     * Gets or sets the position of the annotation.
                     * The position is relative to the {@link point}.
                     */
                    get: function () {
                        return this._position;
                    },
                    set: function (value) {
                        //value could be AnnotationPosition.Right | AnnotationPosition.Top
                        //value = asEnum(value, AnnotationPosition);
                        if (value != this._position) {
                            this._position = value;
                            this._repaint();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "offset", {
                    /**
                     * Gets or sets the offset of the annotation from the {@link point}.
                     */
                    get: function () {
                        return this._offset;
                    },
                    set: function (value) {
                        if (value.x == null || value.y == null) {
                            return;
                        }
                        if (value.x === this._offset.x && value.y === this._offset.y) {
                            return;
                        }
                        this._offset = value;
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "style", {
                    /**
                     * Gets or sets the style of the annotation.
                     */
                    get: function () {
                        if (this._style == null) {
                            this._style = {};
                        }
                        return this._style;
                    },
                    set: function (value) {
                        if (value != this._style) {
                            this._style = value;
                            this._repaint();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "isVisible", {
                    /**
                     * Gets or sets the visibility of the annotation.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    set: function (value) {
                        value = wijmo.asBoolean(value, false);
                        if (value != this._isVisible) {
                            this._isVisible = value;
                            this._toggleVisibility(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "tooltip", {
                    /**
                     * Gets or sets the tooltip of the annotation.
                     */
                    get: function () {
                        return this._tooltip;
                    },
                    set: function (value) {
                        this._tooltip = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnnotationBase.prototype, "name", {
                    /**
                     * Gets or sets the name of the annotation.
                     */
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        this._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Render this annotation.
                 *
                 * @param engine The engine to render annotation.
                 */
                AnnotationBase.prototype.render = function (engine) {
                    var self = this, series;
                    self._element = engine.startGroup(self._getCSSClass());
                    engine.fill = '#88bde6';
                    engine.strokeWidth = 1;
                    engine.stroke = '#000000';
                    self._render(engine);
                    engine.endGroup();
                    self._element[AnnotationBase._DATA_KEY] = this;
                    if (!self._isVisible) {
                        self._toggleVisibility(false);
                    }
                    else if (self._attachment === AnnotationAttachment.DataIndex) {
                        series = self._layer._chart.series[self._seriesIndex];
                        if (series && (series.visibility === wijmo.chart.SeriesVisibility.Legend || series.visibility === wijmo.chart.SeriesVisibility.Hidden)) {
                            self._toggleVisibility(false);
                        }
                    }
                };
                /**
                 * Destroy this annotation
                 */
                AnnotationBase.prototype.destroy = function () {
                };
                // ** private stuff
                AnnotationBase.prototype._copy = function (dst, src) {
                    for (var key in src) {
                        if (key in dst) {
                            this._processOptions(key, dst, src);
                        }
                    }
                };
                AnnotationBase.prototype._processOptions = function (key, dst, src) {
                    dst[key] = src[key];
                };
                AnnotationBase.prototype._resetDefaultValue = function () {
                    var self = this;
                    self._attachment = AnnotationAttachment.Absolute;
                    self._point = new wijmo.chart.DataPoint(0, 0);
                    self._seriesIndex = 0;
                    self._pointIndex = 0;
                    self._position = AnnotationPosition.Center;
                    self._offset = new wijmo.Point(0, 0);
                    self._isVisible = true;
                    self._tooltip = '';
                };
                AnnotationBase.prototype._toggleVisibility = function (visible) {
                    var str = visible ? 'visible' : 'hidden';
                    if (this._element) {
                        this._element.setAttribute('visibility', str);
                    }
                };
                AnnotationBase.prototype._getCSSClass = function () {
                    return AnnotationBase._CSS_ANNOTATION;
                };
                AnnotationBase.prototype._render = function (engine) {
                    this._element = null;
                };
                AnnotationBase.prototype._repaint = function () {
                    if (this._layer) {
                        this._layer._renderAnnotation(this._layer._chart.renderEngine, this);
                    }
                };
                AnnotationBase.prototype._convertPoint = function (pt) {
                    var self = this, att = self._attachment, newPt = new wijmo.Point(), chart, rect, aX, aY, data, series, item, xVal;
                    if (self._layer && self._layer._chart) {
                        chart = self._layer._chart;
                        rect = chart._plotRect;
                    }
                    switch (att) {
                        case AnnotationAttachment.DataIndex:
                            if (!chart.series || chart.series.length <= self.seriesIndex) {
                                break;
                            }
                            series = chart.series[self.seriesIndex];
                            item = series._getItem(self.pointIndex);
                            if (!item) {
                                break;
                            }
                            aX = series.axisX || chart.axisX;
                            aY = series.axisY || chart.axisY;
                            xVal = item[series.bindingX] || item['x'];
                            var yVal = item[series._getBinding(0)] || aY.actualMin + 0.25;
                            if (series._getYOffset != null) {
                                yVal = series._getYOffset(this.pointIndex);
                            }
                            if (typeof xVal === 'string') {
                                xVal = self.pointIndex;
                                if (series._getXOffset != null) {
                                    xVal += series._getXOffset();
                                }
                            }
                            newPt.x = self._convertDataToLen(rect.width, aX, xVal);
                            newPt.y = self._convertDataToLen(rect.height, aY, yVal, true);
                            break;
                        case AnnotationAttachment.DataCoordinate:
                            aX = chart.axisX;
                            aY = chart.axisY;
                            newPt.x = self._convertDataToLen(rect.width, aX, pt.x);
                            newPt.y = self._convertDataToLen(rect.height, aY, pt.y, true);
                            break;
                        case AnnotationAttachment.Relative:
                            newPt.x = rect.width * pt.x;
                            newPt.y = rect.height * pt.y;
                            break;
                        case AnnotationAttachment.Absolute:
                        default:
                            newPt.x = pt.x;
                            newPt.y = pt.y;
                            break;
                    }
                    return newPt;
                };
                AnnotationBase.prototype._convertDataToLen = function (total, axis, val, converted) {
                    if (converted === void 0) { converted = false; }
                    var min = axis.min == null ? axis.actualMin : axis.min, max = axis.max == null ? axis.actualMax : axis.max, logBase = axis._getLogBase();
                    if (axis.reversed) {
                        converted = !converted;
                    }
                    if (!logBase) {
                        if (converted) {
                            return total * (1 - (val - min) / (max - min));
                        }
                        else {
                            return total * (val - min) / (max - min);
                        }
                    }
                    else {
                        if (val <= 0) {
                            return NaN;
                        }
                        var maxl = Math.log(max / min);
                        if (converted) {
                            return total * (1 - Math.log(val / min) / maxl);
                        }
                        else {
                            return total * Math.log(val / min) / maxl;
                        }
                    }
                };
                AnnotationBase.prototype._renderCenteredText = function (content, engine, point, className, angle, style) {
                    var text, box;
                    if (!this._isValidPoint(point)) {
                        return;
                    }
                    if (angle) {
                        engine.drawStringRotated(content, point, point, angle, className, style);
                    }
                    else {
                        engine.drawString(content, point, className, style);
                    }
                    text = this._element.querySelector('text');
                    if (text) {
                        box = text.getBBox();
                        text.setAttribute('x', (point.x - box.width / 2).toFixed(1));
                        text.setAttribute('y', (point.y + box.height / 6).toFixed(1));
                    }
                };
                AnnotationBase.prototype._adjustOffset = function (pt, offset) {
                    pt.x = pt.x + offset.x;
                    pt.y = pt.y + offset.y;
                };
                AnnotationBase.prototype._getOffset = function (engine) {
                    var posOffset = this._getPositionOffset(engine);
                    return new wijmo.Point(this._offset.x + posOffset.x, this._offset.y + posOffset.y);
                };
                AnnotationBase.prototype._getPositionOffset = function (engine) {
                    var posOffset = new wijmo.Point(0, 0), pos = this.position, size = this._getSize(engine);
                    if ((pos & AnnotationPosition.Top) === AnnotationPosition.Top) {
                        //top
                        posOffset.y -= size.height / 2;
                    }
                    else if ((pos & AnnotationPosition.Bottom) === AnnotationPosition.Bottom) {
                        //bottom
                        posOffset.y += size.height / 2;
                    }
                    if ((pos & AnnotationPosition.Left) === AnnotationPosition.Left) {
                        //left
                        posOffset.x -= size.width / 2;
                    }
                    else if ((pos & AnnotationPosition.Right) === AnnotationPosition.Right) {
                        //right
                        posOffset.x += size.width / 2;
                    }
                    return posOffset;
                };
                AnnotationBase.prototype._getSize = function (engine) {
                    return new wijmo.Size();
                };
                AnnotationBase.prototype._isValidPoint = function (pt) {
                    return isFinite(pt.x) && isFinite(pt.y);
                };
                // SVGRenderEngine will remove _textGroup element from _svg element after endRender is invoked.
                // Exception will be thrown when invoking measureString in FF because the element is not in Dom tree.
                AnnotationBase.prototype._measureString = function (engine, text, className) {
                    var e = engine, size;
                    if (e._textGroup && e._textGroup.parentNode == null) {
                        e._svg.appendChild(e._textGroup);
                        size = e.measureString(text, className, null, this.style);
                        e.endRender();
                    }
                    else {
                        size = e.measureString(text, className, null, this.style);
                    }
                    return size;
                };
                AnnotationBase._DATA_KEY = 'wj-chart-annotation'; // key used to store annotation reference in host element
                AnnotationBase._CSS_ANNOTATION = 'gcchart-annotation';
                AnnotationBase._CSS_ANNO_TEXT = 'anno-text';
                AnnotationBase._CSS_ANNO_SHAPE = 'anno-shape';
                return AnnotationBase;
            }());
            annotation.AnnotationBase = AnnotationBase;
            /**
             * Represents a text annotation for the {@link AnnotationLayer}.
             */
            var Text = /** @class */ (function (_super) {
                __extends(Text, _super);
                /**
                 * Initializes a new instance of the {@link Text} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Text(options) {
                    return _super.call(this, options) || this;
                }
                Text.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._text = '';
                    this.position = AnnotationPosition.Top;
                };
                Text.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Text._CSS_TEXT;
                };
                Object.defineProperty(Text.prototype, "text", {
                    /**
                     * Gets or sets the text of the annotation.
                     */
                    get: function () {
                        return this._text;
                    },
                    set: function (value) {
                        var self = this;
                        if (value === self._text) {
                            return;
                        }
                        self._text = value;
                        self._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Text.prototype._render = function (engine) {
                    var self = this, pt = self._convertPoint(self.point), offset;
                    offset = self._getOffset(engine);
                    self._adjustOffset(pt, offset);
                    self._renderCenteredText(self._text, engine, pt, AnnotationBase._CSS_ANNO_TEXT, null, self.style);
                };
                Text.prototype._getSize = function (engine) {
                    if (engine) {
                        return this._measureString(engine, this._text, AnnotationBase._CSS_ANNO_TEXT);
                    }
                    else {
                        return new wijmo.Size();
                    }
                };
                Text._CSS_TEXT = 'gcchart-anno-text';
                return Text;
            }(AnnotationBase));
            annotation.Text = Text;
            /**
             * Represents a base class of shape annotations for the {@link AnnotationLayer}.
             */
            var Shape = /** @class */ (function (_super) {
                __extends(Shape, _super);
                /**
                 * Initializes a new instance of the {@link Shape} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Shape(options) {
                    return _super.call(this, options) || this;
                }
                Shape.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._content = '';
                };
                Shape.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Shape._CSS_SHAPE;
                };
                Object.defineProperty(Shape.prototype, "content", {
                    /**
                     * Gets or sets the text of the annotation.
                     */
                    get: function () {
                        return this._content;
                    },
                    set: function (value) {
                        var self = this;
                        if (value === self._content) {
                            return;
                        }
                        self._content = value;
                        self._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Shape.prototype._render = function (engine) {
                    var self = this;
                    self._shapeContainer = engine.startGroup();
                    engine.stroke = '#000';
                    self._renderShape(engine);
                    engine.stroke = null;
                    engine.endGroup();
                    if (self._content) {
                        self._renderText(engine);
                    }
                };
                Shape.prototype._getContentCenter = function () {
                    return this.point;
                };
                Shape.prototype._renderShape = function (engine) {
                };
                Shape.prototype._renderText = function (engine) {
                    var self = this, contentCenter, offset;
                    contentCenter = self._convertPoint(self._getContentCenter());
                    if (!self._isValidPoint(contentCenter)) {
                        return;
                    }
                    offset = self._getOffset();
                    self._adjustOffset(contentCenter, offset);
                    self._renderCenteredText(self._content, engine, contentCenter, AnnotationBase._CSS_ANNO_TEXT);
                };
                //Shape type: Line, Polygon, Ellipse, Rectangle, Circle, Square, Image
                Shape._CSS_SHAPE = 'gcchart-anno-shape';
                return Shape;
            }(AnnotationBase));
            annotation.Shape = Shape;
            /**
             * Represents an ellipse annotation for {@link AnnotationLayer}.
             */
            var Ellipse = /** @class */ (function (_super) {
                __extends(Ellipse, _super);
                /**
                 * Initializes a new instance of the {@link Ellipse} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Ellipse(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Ellipse.prototype, "width", {
                    /**
                     * Gets or sets the width of the {@link Ellipse} annotation.
                     */
                    get: function () {
                        return this._width;
                    },
                    set: function (value) {
                        if (value === this._width) {
                            return;
                        }
                        this._width = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Ellipse.prototype, "height", {
                    /**
                     * Gets or sets the height of the {@link Ellipse} annotation.
                     */
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        if (value === this._height) {
                            return;
                        }
                        this._height = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Ellipse.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._width = 100;
                    this._height = 80;
                };
                Ellipse.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Ellipse._CSS_ELLIPSE;
                };
                Ellipse.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, pt = self._convertPoint(self.point), w = self._width, h = self._height, offset = self._getOffset();
                    self._adjustOffset(pt, offset);
                    if (self._isValidPoint(pt)) {
                        engine.drawEllipse(pt.x, pt.y, w / 2, h / 2, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                    }
                };
                Ellipse.prototype._getSize = function () {
                    return new wijmo.Size(this.width, this.height);
                };
                Ellipse._CSS_ELLIPSE = 'gcchart-anno-ellipse';
                return Ellipse;
            }(Shape));
            annotation.Ellipse = Ellipse;
            /**
             * Represents a rectangle annotation for {@link AnnotationLayer}.
             */
            var Rectangle = /** @class */ (function (_super) {
                __extends(Rectangle, _super);
                /**
                 * Initializes a new instance of the {@link Rectangle} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Rectangle(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Rectangle.prototype, "width", {
                    /**
                     * Gets or sets the width of the {@link Rectangle} annotation.
                     */
                    get: function () {
                        return this._width;
                    },
                    set: function (value) {
                        if (value === this._width) {
                            return;
                        }
                        this._width = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rectangle.prototype, "height", {
                    /**
                     * Gets or sets the height of the {@link Rectangle} annotation.
                     */
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        if (value === this._height) {
                            return;
                        }
                        this._height = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Rectangle.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._width = 100;
                    this._height = 80;
                };
                Rectangle.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Rectangle._CSS_RECTANGLE;
                };
                Rectangle.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, pt = self._convertPoint(self.point), w = self._width, h = self._height, offset = self._getOffset();
                    self._adjustOffset(pt, offset);
                    if (self._isValidPoint(pt)) {
                        engine.drawRect(pt.x - w / 2, pt.y - h / 2, self._width, self._height, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                    }
                };
                Rectangle.prototype._getSize = function () {
                    return new wijmo.Size(this.width, this.height);
                };
                Rectangle._CSS_RECTANGLE = 'gcchart-anno-rectangle';
                return Rectangle;
            }(Shape));
            annotation.Rectangle = Rectangle;
            /**
             * Represents a line annotation for {@link AnnotationLayer}.
             */
            var Line = /** @class */ (function (_super) {
                __extends(Line, _super);
                /**
                 * Initializes a new instance of the {@link Line} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Line(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Line.prototype, "start", {
                    /**
                     * Gets or sets the start point of the {@link Line} annotation.
                     */
                    get: function () {
                        return this._start;
                    },
                    set: function (value) {
                        var self = this;
                        if (value.x == null || value.y == null) {
                            return;
                        }
                        if (value.x === self._start.x && value.y === self._start.y) {
                            return;
                        }
                        self._start = value;
                        self._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Line.prototype, "end", {
                    /**
                     * Gets or sets the end point of the Line annotation.
                     */
                    get: function () {
                        return this._end;
                    },
                    set: function (value) {
                        var self = this;
                        if (value.x == null || value.y == null) {
                            return;
                        }
                        if (value.x === self._end.x && value.y === self._end.y) {
                            return;
                        }
                        self._end = value;
                        self._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Line.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._start = new wijmo.chart.DataPoint(0, 0);
                    this._end = new wijmo.chart.DataPoint(0, 0);
                    this.position = AnnotationPosition.Top;
                };
                Line.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Line._CSS_LINE;
                };
                Line.prototype._getContentCenter = function () {
                    var start = this.start, end = this.end;
                    if (wijmo.isDate(start.x) && wijmo.isDate(end.x)) {
                        return new wijmo.chart.DataPoint(new Date((start.x.getTime() + end.x.getTime()) / 2), (start.y + end.y) / 2);
                    }
                    else {
                        return new wijmo.chart.DataPoint((start.x + end.x) / 2, (start.y + end.y) / 2);
                    }
                };
                Line.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, start = self._convertPoint(self._start), end = self._convertPoint(self._end), offset;
                    self._cS = start;
                    self._cE = end;
                    offset = self._getOffset();
                    self._adjustOffset(start, offset);
                    self._adjustOffset(end, offset);
                    if (self._isValidPoint(start) && self._isValidPoint(end)) {
                        engine.drawLine(start.x, start.y, end.x, end.y, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                    }
                };
                Line.prototype._getSize = function () {
                    var start = this._cS, end = this._cE;
                    return new wijmo.Size(Math.abs(start.x - end.x), Math.abs(start.y - end.y));
                };
                Line.prototype._renderText = function (engine) {
                    var self = this, contentCenter, offset, start = self._cS, end = self._cE, angle;
                    contentCenter = self._convertPoint(self._getContentCenter());
                    offset = self._getOffset();
                    self._adjustOffset(contentCenter, offset);
                    if (!self._isValidPoint(contentCenter)) {
                        return;
                    }
                    angle = Math.atan2((end.y - start.y), (end.x - start.x)) * 180 / Math.PI;
                    angle = angle < -90 ? angle + 180 : (angle > 90 ? angle - 180 : angle);
                    self._renderCenteredText(self.content, engine, contentCenter, AnnotationBase._CSS_ANNO_TEXT, angle);
                };
                Line.prototype._renderCenteredText = function (content, engine, point, className, angle, style) {
                    if (angle != null) {
                        //text on top of line.
                        var offsetX, offsetY, len, radian;
                        len = this._measureString(engine, content, className).height / 2;
                        radian = angle * Math.PI / 180;
                        offsetX = len * Math.sin(radian);
                        offsetY = len * Math.cos(radian);
                        point.x = point.x + offsetX;
                        point.y = point.y - offsetY;
                    }
                    _super.prototype._renderCenteredText.call(this, content, engine, point, className, angle, style);
                };
                Line._CSS_LINE = 'gcchart-anno-line';
                return Line;
            }(Shape));
            annotation.Line = Line;
            /**
             * Represents a polygon annotation for {@link AnnotationLayer}.
             */
            var Polygon = /** @class */ (function (_super) {
                __extends(Polygon, _super);
                /**
                 * Initializes a new instance of the {@link Polygon} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Polygon(options) {
                    return _super.call(this, options) || this;
                }
                Polygon.prototype._processOptions = function (key, dst, src) {
                    var _this = this;
                    if (key === 'points') {
                        var val = src[key];
                        if (wijmo.isArray(val)) {
                            val.forEach(function (v) {
                                _this.points.push(v);
                            });
                        }
                    }
                    else {
                        _super.prototype._processOptions.call(this, key, dst, src);
                    }
                };
                Object.defineProperty(Polygon.prototype, "points", {
                    /**
                     * Gets the collection of points of the {@link Polygon} annotation.
                     */
                    get: function () {
                        return this._points;
                    },
                    enumerable: true,
                    configurable: true
                });
                Polygon.prototype._resetDefaultValue = function () {
                    var self = this;
                    _super.prototype._resetDefaultValue.call(this);
                    self._points = new wijmo.collections.ObservableArray();
                    self._points.collectionChanged.addHandler(function () {
                        if (self._element) {
                            self._repaint();
                        }
                    });
                };
                Polygon.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Polygon._CSS_POLYGON;
                };
                Polygon.prototype._getContentCenter = function () {
                    var pts = this.points, len = pts.length, x = 0, y = 0, i;
                    for (i = 0; i < len; i++) {
                        x += wijmo.isDate(pts[i].x) ? pts[i].x.getTime() : pts[i].x;
                        y += wijmo.isDate(pts[i].y) ? pts[i].y.getTime() : pts[i].y;
                    }
                    return new wijmo.chart.DataPoint(x / len, y / len);
                };
                Polygon.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, xs = [], ys = [], pts = self._points, len = pts.length, i, pt, offset = self._getOffset();
                    for (i = 0; i < len; i++) {
                        pt = self._convertPoint(pts[i]);
                        if (!self._isValidPoint(pt)) {
                            return;
                        }
                        self._adjustOffset(pt, offset);
                        xs.push(pt.x);
                        ys.push(pt.y);
                    }
                    engine.drawPolygon(xs, ys, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                };
                Polygon.prototype._getSize = function () {
                    var self = this, xMin, xMax, yMin, yMax, i, pt, len = self._points.length, pts;
                    pts = [].map.call(self._points, function (pt) {
                        return self._convertPoint(pt);
                    });
                    for (i = 0; i < len; i++) {
                        pt = pts[i];
                        if (i === 0) {
                            xMin = xMax = pt.x;
                            yMin = yMax = pt.y;
                            continue;
                        }
                        if (pt.x < xMin) {
                            xMin = pt.x;
                        }
                        else if (pt.x > xMax) {
                            xMax = pt.x;
                        }
                        if (pt.y < yMin) {
                            yMin = pt.y;
                        }
                        else if (pt.y > yMax) {
                            yMax = pt.y;
                        }
                    }
                    return new wijmo.Size(xMax - xMin, yMax - yMin);
                };
                Polygon._CSS_POLYGON = 'gcchart-anno-polygon';
                return Polygon;
            }(Shape));
            annotation.Polygon = Polygon;
            /**
             * Represents a circle annotation for {@link AnnotationLayer}.
             */
            var Circle = /** @class */ (function (_super) {
                __extends(Circle, _super);
                /**
                 * Initializes a new instance of the {@link Circle} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Circle(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Circle.prototype, "radius", {
                    /**
                     * Gets or sets the radius of the {@link Circle} annotation.
                     */
                    get: function () {
                        return this._radius;
                    },
                    set: function (value) {
                        if (value === this._radius) {
                            return;
                        }
                        this._radius = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Circle.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._radius = 100;
                };
                Circle.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Circle._CSS_CIRCLE;
                };
                Circle.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, pt = self._convertPoint(self.point), offset = self._getOffset();
                    self._adjustOffset(pt, offset);
                    if (self._isValidPoint(pt)) {
                        engine.drawPieSegment(pt.x, pt.y, self.radius, 0, 360, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                    }
                };
                Circle.prototype._getSize = function () {
                    var d = this.radius * 2;
                    return new wijmo.Size(d, d);
                };
                Circle._CSS_CIRCLE = 'gcchart-anno-circle';
                return Circle;
            }(Shape));
            annotation.Circle = Circle;
            /**
             * Represents a square annotation for the {@link AnnotationLayer}.
             */
            var Square = /** @class */ (function (_super) {
                __extends(Square, _super);
                /**
                 * Initializes a new instance of the {@link Square} annotation class.
                 *
                 * @param options JavaScript object containing initialization data for the object.
                 */
                function Square(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Square.prototype, "length", {
                    /**
                        * Gets or sets the length of the {@link Square} annotation.
                        */
                    get: function () {
                        return this._length;
                    },
                    set: function (value) {
                        if (value === this._length) {
                            return;
                        }
                        this._length = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Square.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._length = 100;
                };
                Square.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Square._CSS_SQUARE;
                };
                Square.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, pt = self._convertPoint(self.point), len = self.length, offset = self._getOffset();
                    self._adjustOffset(pt, offset);
                    if (self._isValidPoint(pt)) {
                        engine.drawRect(pt.x - len / 2, pt.y - len / 2, len, len, AnnotationBase._CSS_ANNO_SHAPE, self.style);
                    }
                };
                Square.prototype._getSize = function () {
                    return new wijmo.Size(this.length, this.length);
                };
                Square._CSS_SQUARE = 'gcchart-anno-square';
                return Square;
            }(Shape));
            annotation.Square = Square;
            /**
                * Represents an image annotation for {@link AnnotationLayer}.
                */
            var Image = /** @class */ (function (_super) {
                __extends(Image, _super);
                /**
                    * Initializes a new instance of the {@link Image} annotation class.
                    *
                    * @param options JavaScript object containing initialization data for the object.
                    */
                function Image(options) {
                    return _super.call(this, options) || this;
                }
                Object.defineProperty(Image.prototype, "width", {
                    /**
                        * Gets or sets the width of the {@link Image} annotation.
                        */
                    get: function () {
                        return this._width;
                    },
                    set: function (value) {
                        if (value === this._width) {
                            return;
                        }
                        this._width = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Image.prototype, "height", {
                    /**
                        * Gets or sets the height of the {@link Image} annotation.
                        */
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        if (value === this._height) {
                            return;
                        }
                        this._height = wijmo.asNumber(value, false, true);
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Image.prototype, "href", {
                    /**
                        * Gets or sets the href of the {@link Image} annotation.
                        */
                    get: function () {
                        return this._href;
                    },
                    set: function (value) {
                        if (value === this._href) {
                            return;
                        }
                        this._href = value;
                        this._repaint();
                    },
                    enumerable: true,
                    configurable: true
                });
                Image.prototype._resetDefaultValue = function () {
                    _super.prototype._resetDefaultValue.call(this);
                    this._width = 100;
                    this._height = 100;
                    this._href = '';
                };
                Image.prototype._getCSSClass = function () {
                    return _super.prototype._getCSSClass.call(this) + ' ' + Image._CSS_IMAGE;
                };
                Image.prototype._renderShape = function (engine) {
                    _super.prototype._renderShape.call(this, engine);
                    var self = this, pt = self._convertPoint(self.point), href = self._href, w = self.width, h = self.height, offset = self._getOffset();
                    if (href.length > 0 && self._isValidPoint(pt)) {
                        self._adjustOffset(pt, offset);
                        engine.drawImage(href, pt.x - w / 2, pt.y - h / 2, w, h);
                    }
                    self._applyStyle(self._element, self.style);
                };
                Image.prototype._getSize = function () {
                    return new wijmo.Size(this.width, this.height);
                };
                Image.prototype._applyStyle = function (el, style) {
                    if (style) {
                        for (var key in style) {
                            el.setAttribute(this._deCase(key), style[key]);
                        }
                    }
                };
                Image.prototype._deCase = function (s) {
                    return s.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase(); });
                };
                Image._CSS_IMAGE = 'gcchart-anno-image';
                return Image;
            }(Shape));
            annotation.Image = Image;
        })(annotation = chart_1.annotation || (chart_1.annotation = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart_2) {
        var annotation;
        (function (annotation_1) {
            'use strict';
            /**
             * Represents an annotation layer for {@link FlexChart} and {@link FinancialChart}.
             *
             * The AnnotationLayer contains a collection of various annotation elements: texts,
             * lines, images, rectangles etc.
             * To use the {@link AnnotationLayer}, create annotations and push them to the layer's
             * items property.
             */
            var AnnotationLayer = /** @class */ (function () {
                /**
                 * Initializes a new instance of the {@link AnnotationLayer} class.
                 *
                 * @param chart A chart to which the {@link AnnotationLayer} is attached.
                 * @param options A JavaScript object containing initialization data for
                 * {@link AnnotationLayer}.
                 */
                function AnnotationLayer(chart, options) {
                    var self = this;
                    self._init(chart);
                    self._renderGroup();
                    self._bindTooltip();
                    if (options && wijmo.isArray(options)) {
                        options.forEach(function (val) {
                            var type = val['type'] || 'Circle', a;
                            if (wijmo.chart.annotation[type]) {
                                a = new wijmo.chart.annotation[type](val);
                                self._items.push(a);
                            }
                        });
                    }
                }
                AnnotationLayer.prototype._init = function (chart) {
                    var self = this;
                    self._items = new wijmo.collections.ObservableArray();
                    self._items.collectionChanged.addHandler(self._itemsChanged, self);
                    self._chart = chart;
                    self._forceTTShowing = false;
                    self._annoTTShowing = false;
                    chart.rendered.addHandler(self._renderAnnotations, self);
                    chart.lostFocus.addHandler(self._lostFocus, self);
                };
                AnnotationLayer.prototype._lostFocus = function (evt) {
                    this._toggleTooltip(this._tooltip, evt, this._chart.hostElement);
                };
                Object.defineProperty(AnnotationLayer.prototype, "items", {
                    /**
                     * Gets the collection of annotation elements in the {@link AnnotationLayer}.
                     */
                    get: function () {
                        return this._items;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets an annotation element by name in the {@link AnnotationLayer}.
                 * @param name The annotation's name.
                 */
                AnnotationLayer.prototype.getItem = function (name) {
                    var items = this.getItems(name);
                    if (items.length > 0) {
                        return items[0];
                    }
                    else {
                        return null;
                    }
                };
                /**
                 * Gets the annotation elements by name in the {@link AnnotationLayer}.
                 * @param name The annotations' name.
                 */
                AnnotationLayer.prototype.getItems = function (name) {
                    var items = [];
                    if (this._items.length === 0 || !name || name === '') {
                        return items;
                    }
                    for (var i = 0; i < this._items.length; i++) {
                        if (name === this._items[i].name) {
                            items.push(this._items[i]);
                        }
                    }
                    return items;
                };
                AnnotationLayer.prototype._bindTooltip = function () {
                    var self = this, ele = self._chart.hostElement, tooltip = self._tooltip, ttHide;
                    if (!tooltip) {
                        tooltip = self._tooltip = new wijmo.chart.ChartTooltip();
                        ttHide = wijmo.Tooltip.prototype.hide;
                        wijmo.Tooltip.prototype.hide = function () {
                            if (self._forceTTShowing) {
                                return;
                            }
                            ttHide.call(tooltip);
                        };
                    }
                    if (ele) {
                        ele.addEventListener('click', function (evt) {
                            self._toggleTooltip(tooltip, evt, ele);
                        });
                        document.addEventListener('mousemove', function (evt) {
                            if (self._showTooltip()) {
                                self._toggleTooltip(tooltip, evt, ele);
                            }
                        });
                    }
                };
                AnnotationLayer.prototype._showTooltip = function () {
                    return !this._chart.isTouching;
                };
                AnnotationLayer.prototype._toggleTooltip = function (tooltip, evt, parentNode) {
                    var self = this, annotation = self._getAnnotation(evt.target, parentNode);
                    if (annotation && annotation.tooltip) {
                        self._forceTTShowing = true;
                        self._annoTTShowing = true;
                        tooltip.show(self._layerEle, annotation.tooltip, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    }
                    else {
                        if (!self._annoTTShowing) {
                            return;
                        }
                        self._annoTTShowing = false;
                        self._forceTTShowing = false;
                        tooltip.hide();
                    }
                };
                AnnotationLayer.prototype._getAnnotation = function (ele, parentNode) {
                    var node = this._getAnnotationElement(ele, parentNode);
                    if (node == null) {
                        return null;
                    }
                    return node[annotation_1.AnnotationBase._DATA_KEY];
                };
                AnnotationLayer.prototype._getAnnotationElement = function (ele, pNode) {
                    if (!ele || !pNode) {
                        return null;
                    }
                    var parentNode = ele.parentNode;
                    if (wijmo.hasClass(ele, annotation_1.AnnotationBase._CSS_ANNOTATION)) {
                        return ele;
                    }
                    else if (parentNode == null || parentNode === document.body || parentNode === document || parentNode === pNode) {
                        return null;
                    }
                    else {
                        return this._getAnnotationElement(parentNode, pNode);
                    }
                };
                AnnotationLayer.prototype._itemsChanged = function (items, e) {
                    var action = e.action, item = e.item;
                    switch (action) {
                        case wijmo.collections.NotifyCollectionChangedAction.Add:
                        case wijmo.collections.NotifyCollectionChangedAction.Change:
                            item._layer = this;
                            this._renderAnnotation(this._chart.renderEngine, item);
                            break;
                        case wijmo.collections.NotifyCollectionChangedAction.Remove:
                            this._destroyAnnotation(item);
                            break;
                        default:
                            this._destroyAnnotations();
                            this._renderAnnotations(this._chart, new wijmo.chart.RenderEventArgs(this._chart.renderEngine));
                            break;
                    }
                };
                AnnotationLayer.prototype._renderAnnotations = function (chart, args) {
                    var items = this.items, len = items.length, i;
                    this._renderGroup();
                    for (i = 0; i < len; i++) {
                        this._renderAnnotation(args.engine, items[i]);
                    }
                };
                AnnotationLayer.prototype._renderGroup = function () {
                    var self = this, rect = self._chart._plotRect, parent;
                    var engine = this._chart.renderEngine;
                    if (!rect || !engine) {
                        return;
                    }
                    if (!self._layerEle || self._layerEle.parentNode == null) {
                        self._plotrectId = 'plotRect' + (1000000 * Math.random()).toFixed();
                        //set rect.left/top to 0 because clippath will translate with g element together.
                        engine.addClipRect(new wijmo.Rect(0, 0, rect.width, rect.height), self._plotrectId);
                        self._layerEle = engine.startGroup(AnnotationLayer._CSS_Layer, self._plotrectId);
                        self._layerEle.setAttribute('transform', 'translate(' + rect.left + ', ' + rect.top + ')');
                        engine.endGroup();
                    }
                };
                AnnotationLayer.prototype._renderAnnotation = function (engine, item) {
                    if (!this._layerEle || this._layerEle.parentNode == null) {
                        return;
                    }
                    if (item._element && item._element.parentNode == this._layerEle) {
                        this._layerEle.removeChild(item._element);
                    }
                    engine.useSvg = true;
                    item.render(engine);
                    engine.useSvg = false;
                    this._layerEle.appendChild(item._element);
                };
                AnnotationLayer.prototype._destroyAnnotations = function () {
                    var items = this.items, len = items.length, i;
                    for (i = 0; i < len; i++) {
                        this._destroyAnnotation(items[i]);
                    }
                    this._layerEle.innerHTML = '';
                };
                AnnotationLayer.prototype._destroyAnnotation = function (item) {
                    if (this._layerEle) {
                        this._layerEle.removeChild(item._element);
                    }
                    item.destroy();
                };
                AnnotationLayer._CSS_Layer = 'wj-chart-annotationlayer';
                return AnnotationLayer;
            }());
            annotation_1.AnnotationLayer = AnnotationLayer;
        })(annotation = chart_2.annotation || (chart_2.annotation = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var chart;
    (function (chart) {
        var annotation;
        (function (annotation) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.chart.annotation', wijmo.chart.annotation);
        })(annotation = chart.annotation || (chart.annotation = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.chart.annotation.js.map