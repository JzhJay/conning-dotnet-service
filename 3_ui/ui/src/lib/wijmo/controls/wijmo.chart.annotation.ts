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


    module wijmo.chart.annotation {
    




'use strict';

/**
 * Specifies the attachment of the annotation.
 */
export enum AnnotationAttachment {
    /** 
    * Coordinates of the annotation point are defined by the data series index and 
    * the data point index. */
    DataIndex,
    /** Annotation point is specified in data coordinates. */
    DataCoordinate,
    /** Annotation point is specified as a relative position inside the control where
    * (0,0) is the top left corner and (1,1) is the bottom right corner.*/
    Relative,
    /** The annotation point is specified in control's pixel coordinates.  */
    Absolute
}

/**
 * Specifies the position of the annotation.
 */
export enum AnnotationPosition {
    /** The annotation appears at the Center of the target point. */
    Center = 0,
    /** The annotation appears at the Top of the target point. */
    Top = 1,
    /** The annotation appears at the Bottom of the target point. */
    Bottom = 2,
    /** The annotation appears at the Left of the target point. */
    Left = 4,
    /** The annotation appears at the Right of the target point. */
    Right = 8
}

/**
 * Represents the base class of annotations for the {@link AnnotationLayer}.
 */
export class AnnotationBase {
    static _DATA_KEY = 'wj-chart-annotation';    // key used to store annotation reference in host element
    static _CSS_ANNOTATION = 'gcchart-annotation';
    static _CSS_ANNO_TEXT = 'anno-text';
    static _CSS_ANNO_SHAPE = 'anno-shape';

    private _attachment: AnnotationAttachment;
    private _point: wijmo.chart.DataPoint;
    private _seriesIndex: number;
    private _pointIndex: number;
    private _position: AnnotationPosition;
    private _offset: wijmo.Point;
    private _style: any;
    private _isVisible: boolean;
    private _tooltip: string;
    private _name: string;
    _element: SVGElement;
    _layer: AnnotationLayer;

    /**
     * Initializes a new instance of the {@link AnnotationBase} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        this._resetDefaultValue();
        this._copy(this, options);
    }

    /**
     * Gets or sets the attachment of the annotation.
     */
    get attachment(): AnnotationAttachment {
        return this._attachment;
    }
    set attachment(value: AnnotationAttachment) {
        value = wijmo.asEnum(value, AnnotationAttachment);
        if (value != this._attachment) {
            this._attachment = value;
            this._repaint();
        }
    }
    /**
     * Gets or sets the point of the annotation.
     * The coordinates of points depends on the {@link attachment} property. 
     * See {@link AnnotationAttachment} for further description.
     */
    get point(): wijmo.chart.DataPoint {
        return this._point;
    }
    set point(value: wijmo.chart.DataPoint) {
        if (value.x == null || value.y == null) {
            return;
        }
        if (value.x === this._point.x && value.y === this._point.y) {
            return;
        }
        this._point = value;
        this._repaint();
    }
    /**
     * Gets or sets the data series index of the annotation.
     * Applies only when the <b>attachment</b> property is set to DataIndex.
     */
    get seriesIndex(): number {
        return this._seriesIndex;
    }
    set seriesIndex(value: number) {
        value = wijmo.asNumber(value, false, true);
        if (value != this._seriesIndex) {
            this._seriesIndex = value;
            this._repaint();
        }
    }
    /**
     * Gets or sets the data point index of the annotation.
     * Applies only when the <b>attachment</b> property is set to DataIndex.
     */
    get pointIndex(): number {
        return this._pointIndex;
    }
    set pointIndex(value: number) {
        if (value === this._pointIndex) {
            return;
        }
        this._pointIndex = wijmo.asNumber(value, false, true);
        this._repaint();
    }
    /**
     * Gets or sets the position of the annotation.
     * The position is relative to the {@link point}.
     */
    get position(): AnnotationPosition {
        return this._position;
    }
    set position(value: AnnotationPosition) {
        //value could be AnnotationPosition.Right | AnnotationPosition.Top
        //value = asEnum(value, AnnotationPosition);
        if (value != this._position) {
            this._position = value;
            this._repaint();
        }
    }
    /**
     * Gets or sets the offset of the annotation from the {@link point}.
     */
    get offset(): wijmo.Point {
        return this._offset;
    }
    set offset(value: wijmo.Point) {
        if (value.x == null || value.y == null) {
            return;
        }
        if (value.x === this._offset.x && value.y === this._offset.y) {
            return;
        }
        this._offset = value;
        this._repaint();
    }
    /**
     * Gets or sets the style of the annotation.
     */
    get style(): any {
        if (this._style == null) {
            this._style = {};
        }
        return this._style;
    }
    set style(value: any) {
        if (value != this._style) {
            this._style = value;
            this._repaint();
        }
    }
    /**
     * Gets or sets the visibility of the annotation.
     */
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(value: boolean) {
        value = wijmo.asBoolean(value, false);
        if (value != this._isVisible) {
            this._isVisible = value;
            this._toggleVisibility(value);
        }
    }
    /**
     * Gets or sets the tooltip of the annotation.
     */
    get tooltip(): string {
        return this._tooltip;
    }
    set tooltip(value: string) {
        this._tooltip = value;
    }
    /**
     * Gets or sets the name of the annotation.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    /**
     * Render this annotation.
     * 
     * @param engine The engine to render annotation.
     */
    render(engine: wijmo.chart.IRenderEngine) {
        var self = this,
            series: wijmo.chart.SeriesBase;

        self._element = engine.startGroup(self._getCSSClass());
        engine.fill = '#88bde6';
        engine.strokeWidth = 1;
        engine.stroke = '#000000';
        self._render(engine);
        engine.endGroup();
        self._element[AnnotationBase._DATA_KEY] = this;
        if (!self._isVisible) {
            self._toggleVisibility(false);
        } else if (self._attachment === AnnotationAttachment.DataIndex) {
            series = self._layer._chart.series[self._seriesIndex];
            if (series && (series.visibility === wijmo.chart.SeriesVisibility.Legend || series.visibility === wijmo.chart.SeriesVisibility.Hidden)) {
                self._toggleVisibility(false);
            }
        }
    }

    /**
     * Destroy this annotation
     */
    destroy() {
    }

    // ** private stuff

    _copy(dst: any, src: any) {
        for (var key in src) {
            if (key in dst) {
                this._processOptions(key, dst, src);
            }
        }
    }
    _processOptions(key, dst, src) {
        dst[key] = src[key];
    }
    _resetDefaultValue() {
        var self = this;
        self._attachment = AnnotationAttachment.Absolute;
        self._point = new wijmo.chart.DataPoint(0, 0);
        self._seriesIndex = 0;
        self._pointIndex = 0;
        self._position = AnnotationPosition.Center;
        self._offset = new wijmo.Point(0, 0);
        self._isVisible = true;
        self._tooltip = '';
    }

    _toggleVisibility(visible: boolean) {
        var str = visible ? 'visible' : 'hidden';

        if (this._element) {
            this._element.setAttribute('visibility', str);
        }
    }

    _getCSSClass() {
        return AnnotationBase._CSS_ANNOTATION;
    }

    _render(engine: wijmo.chart.IRenderEngine) {
        this._element = null;
    }

    _repaint() {
        if (this._layer) {
            this._layer._renderAnnotation(this._layer._chart.renderEngine, this);
        }
    }

    _convertPoint(pt?: wijmo.chart.DataPoint): wijmo.Point {
        var self = this,
            att = self._attachment,
            newPt = new wijmo.Point(),
            chart,
            rect: wijmo.Rect,
            aX: wijmo.chart.Axis, aY: wijmo.chart.Axis, data,
            series: wijmo.chart.Series, item,
            xVal;

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
                let yVal = item[series._getBinding(0)] || aY.actualMin + 0.25;
                if((<any>series)._getYOffset!=null){
                    yVal = (<any>series)._getYOffset(this.pointIndex);
                }
                if (typeof xVal === 'string') {
                    xVal = self.pointIndex;
                    if((<any>series)._getXOffset!=null){
                        xVal += (<any>series)._getXOffset();
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
    }
    
    _convertDataToLen(total: number, axis: wijmo.chart.Axis, val, converted = false): number {
        var min = axis.min == null ? axis.actualMin : axis.min,
            max = axis.max == null ? axis.actualMax : axis.max,
            logBase = axis._getLogBase();

        if(axis.reversed) {
            converted = !converted;
        }

        if (!logBase) {
            if (converted) {
                return total * (1 - (val - min) / (max - min));
            } else {
                return total * (val - min) / (max - min);
            }
        } else {
            if (val <= 0) {
                return NaN;
            }
            let maxl = Math.log(max / min);
            if (converted) {
                return total * (1 - Math.log(val / min) / maxl);
            } else {
                return total * Math.log(val / min) / maxl;
            }
        }
    }

    _renderCenteredText(content: string, engine: wijmo.chart.IRenderEngine, point: wijmo.Point, className?: string, angle?: number, style?: any) {
        var text: SVGTextElement,
            box: SVGRect;


        if (!this._isValidPoint(point)) {
            return;
        }
        if (angle) {
            engine.drawStringRotated(content, point, point, angle, className, style);
        } else {
            engine.drawString(content, point, className, style);
        }
        text = <SVGTextElement>this._element.querySelector('text');
        if (text) {
            box = text.getBBox();
            text.setAttribute('x', (point.x - box.width / 2).toFixed(1));
            text.setAttribute('y', (point.y + box.height / 6).toFixed(1));
        }
    }

    _adjustOffset(pt: wijmo.Point, offset: wijmo.Point) {
        pt.x = pt.x + offset.x;
        pt.y = pt.y + offset.y;
    }

    _getOffset(engine?: wijmo.chart.IRenderEngine): wijmo.Point {
        var posOffset = this._getPositionOffset(engine);
        return new wijmo.Point(this._offset.x + posOffset.x, this._offset.y + posOffset.y);
    }

    _getPositionOffset(engine?: wijmo.chart.IRenderEngine): wijmo.Point {
        var posOffset = new wijmo.Point(0, 0),
            pos = this.position,
            size = this._getSize(engine);

        if ((pos & AnnotationPosition.Top) === AnnotationPosition.Top) {
            //top
            posOffset.y -= size.height / 2;
        } else if ((pos & AnnotationPosition.Bottom) === AnnotationPosition.Bottom) {
            //bottom
            posOffset.y += size.height / 2;
        }
        if ((pos & AnnotationPosition.Left) === AnnotationPosition.Left) {
            //left
            posOffset.x -= size.width / 2;
        } else if ((pos & AnnotationPosition.Right) === AnnotationPosition.Right) {
            //right
            posOffset.x += size.width / 2;
        }
        return posOffset;
    }

    _getSize(engine?: wijmo.chart.IRenderEngine): wijmo.Size {
        return new wijmo.Size();
    }

    _isValidPoint(pt: wijmo.Point): boolean {
        return isFinite(pt.x) && isFinite(pt.y);
    }

    // SVGRenderEngine will remove _textGroup element from _svg element after endRender is invoked.
    // Exception will be thrown when invoking measureString in FF because the element is not in Dom tree.
    _measureString(engine: wijmo.chart.IRenderEngine, text: string, className: string): wijmo.Size {
        var e = <any>engine,
            size: wijmo.Size;
        if (e._textGroup && e._textGroup.parentNode == null) {
            e._svg.appendChild(e._textGroup);
            size = e.measureString(text, className, null, this.style);
            e.endRender();
        } else {
            size = e.measureString(text, className, null, this.style);
        }
        return size;
    }
}

/**
 * Represents a text annotation for the {@link AnnotationLayer}.
 */
export class Text extends AnnotationBase {
    static _CSS_TEXT = 'gcchart-anno-text';
    private _text: string;

    /**
     * Initializes a new instance of the {@link Text} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._text = '';
        this.position = AnnotationPosition.Top;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Text._CSS_TEXT;
    }

    /**
     * Gets or sets the text of the annotation.
     */
    get text(): string {
        return this._text;
    }
    set text(value: string) {
        var self = this;

        if (value === self._text) {
            return;
        }
        self._text = value;
        self._repaint();
    }

    _render(engine: wijmo.chart.IRenderEngine) {
        var self = this,
            pt = self._convertPoint(self.point),
            offset: wijmo.Point;

        offset = self._getOffset(engine);
        self._adjustOffset(pt, offset);
        self._renderCenteredText(self._text, engine, pt, AnnotationBase._CSS_ANNO_TEXT, null, self.style);
    }

    _getSize(engine?: wijmo.chart.IRenderEngine): wijmo.Size {
        if (engine) {
            return this._measureString(engine, this._text, AnnotationBase._CSS_ANNO_TEXT);
        } else {
            return new wijmo.Size();
        }
    }
}

/**
 * Represents a base class of shape annotations for the {@link AnnotationLayer}.
 */
export class Shape extends AnnotationBase {
    //Shape type: Line, Polygon, Ellipse, Rectangle, Circle, Square, Image
    static _CSS_SHAPE = 'gcchart-anno-shape';
    private _content: string;
    _shapeContainer: SVGGElement;

    /**
     * Initializes a new instance of the {@link Shape} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._content = '';
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Shape._CSS_SHAPE;
    }

    /**
     * Gets or sets the text of the annotation.
     */
    get content(): string {
        return this._content;
    }
    set content(value: string) {
        var self = this;

        if (value === self._content) {
            return;
        }
        self._content = value;
        self._repaint();
    }

    _render(engine: wijmo.chart.IRenderEngine) {
        var self = this;

        self._shapeContainer = engine.startGroup();
        engine.stroke = '#000';
        self._renderShape(engine);
        engine.stroke = null;
        engine.endGroup();

        if (self._content) {
            self._renderText(engine);
        }
    }

    _getContentCenter(): wijmo.chart.DataPoint {
        return this.point;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
    }

    _renderText(engine: wijmo.chart.IRenderEngine) {
        var self = this,
            contentCenter: wijmo.Point,
            offset: wijmo.Point;

        contentCenter = self._convertPoint(self._getContentCenter());
        if (!self._isValidPoint(contentCenter)) {
            return;
        }
        offset = self._getOffset();
        self._adjustOffset(contentCenter, offset);
        self._renderCenteredText(self._content, engine, contentCenter, AnnotationBase._CSS_ANNO_TEXT);
    }
}

/**
 * Represents an ellipse annotation for {@link AnnotationLayer}.
 */
export class Ellipse extends Shape {
    static _CSS_ELLIPSE = 'gcchart-anno-ellipse';

    private _width: number;
    private _height: number;

    /**
     * Initializes a new instance of the {@link Ellipse} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    /**
     * Gets or sets the width of the {@link Ellipse} annotation.
     */
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        if (value === this._width) {
            return;
        }
        this._width = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    /**
     * Gets or sets the height of the {@link Ellipse} annotation.
     */
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        if (value === this._height) {
            return;
        }
        this._height = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._width = 100;
        this._height = 80;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Ellipse._CSS_ELLIPSE;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);
        var self = this,
            pt = self._convertPoint(self.point),
            w = self._width,
            h = self._height,
            offset = self._getOffset();

        self._adjustOffset(pt, offset);
        if(self._isValidPoint(pt)) {
            engine.drawEllipse(pt.x, pt.y, w / 2, h / 2, AnnotationBase._CSS_ANNO_SHAPE, self.style);
        }
    }

    _getSize(): wijmo.Size {
        return new wijmo.Size(this.width, this.height);
    }
}

/**
 * Represents a rectangle annotation for {@link AnnotationLayer}.
 */
export class Rectangle extends Shape {
    static _CSS_RECTANGLE = 'gcchart-anno-rectangle';

    private _width: number;
    private _height: number;

    /**
     * Initializes a new instance of the {@link Rectangle} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    /**
     * Gets or sets the width of the {@link Rectangle} annotation.
     */
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        if (value === this._width) {
            return;
        }
        this._width = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    /**
     * Gets or sets the height of the {@link Rectangle} annotation.
     */
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        if (value === this._height) {
            return;
        }
        this._height = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._width = 100;
        this._height = 80;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Rectangle._CSS_RECTANGLE;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            pt = self._convertPoint(self.point),
            w = self._width,
            h = self._height,
            offset = self._getOffset();

        self._adjustOffset(pt, offset);
        if (self._isValidPoint(pt)) {
            engine.drawRect(pt.x - w / 2, pt.y - h / 2, self._width, self._height, AnnotationBase._CSS_ANNO_SHAPE, self.style);
        }
    }

    _getSize(): wijmo.Size {
        return new wijmo.Size(this.width, this.height);
    }
}

/**
 * Represents a line annotation for {@link AnnotationLayer}.
 */
export class Line extends Shape {
    static _CSS_LINE = 'gcchart-anno-line';

    private _start: wijmo.chart.DataPoint;
    private _end: wijmo.chart.DataPoint;
    //converted start and end.
    private _cS: wijmo.Point;
    private _cE: wijmo.Point;

    /**
     * Initializes a new instance of the {@link Line} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    /**
     * Gets or sets the start point of the {@link Line} annotation.
     */
    get start(): wijmo.chart.DataPoint {
        return this._start;
    }
    set start(value: wijmo.chart.DataPoint) {
        var self = this;

        if (value.x == null || value.y == null) {
            return;
        }
        if (value.x === self._start.x && value.y === self._start.y) {
            return;
        }
        self._start = value;
        self._repaint();
    }

    /**
     * Gets or sets the end point of the Line annotation.
     */
    get end(): wijmo.chart.DataPoint {
        return this._end;
    }
    set end(value: wijmo.chart.DataPoint) {
        var self = this;

        if (value.x == null || value.y == null) {
            return;
        }
        if (value.x === self._end.x && value.y === self._end.y) {
            return;
        }
        self._end = value;
        self._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._start = new wijmo.chart.DataPoint(0, 0);
        this._end = new wijmo.chart.DataPoint(0, 0);
        this.position = AnnotationPosition.Top;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Line._CSS_LINE;
    }

    _getContentCenter(): wijmo.chart.DataPoint {
        var start = this.start,
            end = this.end;
        
        if (wijmo.isDate(start.x) && wijmo.isDate(end.x)) {
            return new wijmo.chart.DataPoint(new Date((start.x.getTime() + end.x.getTime()) / 2), (start.y + end.y) / 2);
        } else {
            return new wijmo.chart.DataPoint((start.x + end.x) / 2, (start.y + end.y) / 2);
        }
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            start = self._convertPoint(self._start),
            end = self._convertPoint(self._end),
            offset;

        self._cS = start;
        self._cE = end;
        offset = self._getOffset();
        self._adjustOffset(start, offset);
        self._adjustOffset(end, offset);
        if (self._isValidPoint(start) && self._isValidPoint(end)) {
            engine.drawLine(start.x, start.y, end.x, end.y, AnnotationBase._CSS_ANNO_SHAPE, self.style);
        }
    }

    _getSize(): wijmo.Size {
        var start = this._cS,
            end = this._cE;
        return new wijmo.Size(Math.abs(start.x - end.x), Math.abs(start.y - end.y));
    }

    _renderText(engine: wijmo.chart.IRenderEngine) {
        var self = this,
            contentCenter: wijmo.Point,
            offset: wijmo.Point,
            start = self._cS,
            end = self._cE,
            angle;

        contentCenter = self._convertPoint(self._getContentCenter());
        offset = self._getOffset();
        self._adjustOffset(contentCenter, offset);
        if (!self._isValidPoint(contentCenter)) {
            return;
        }
        angle = Math.atan2((end.y - start.y), (end.x - start.x)) * 180 / Math.PI;
        angle = angle < -90 ? angle + 180 : (angle > 90 ? angle - 180 : angle);
        self._renderCenteredText(self.content, engine, contentCenter, AnnotationBase._CSS_ANNO_TEXT, angle);
    }

    _renderCenteredText(content: string, engine: wijmo.chart.IRenderEngine, point: wijmo.Point, className?: string, angle?: number, style?: any) {
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
        super._renderCenteredText(content, engine, point, className, angle, style);
    }
}

/**
 * Represents a polygon annotation for {@link AnnotationLayer}.
 */
export class Polygon extends Shape {
    static _CSS_POLYGON = 'gcchart-anno-polygon';

    private _points: wijmo.collections.ObservableArray;

    /**
     * Initializes a new instance of the {@link Polygon} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    _processOptions(key, dst, src) {
        if (key === 'points') {
            var val = src[key];
            if(wijmo.isArray(val)) {
                val.forEach(v => {
                    this.points.push(v);
                });
            }
        } else {
            super._processOptions(key, dst, src);
        }
    }

    /**
     * Gets the collection of points of the {@link Polygon} annotation.
     */
    get points(): wijmo.collections.ObservableArray {
        return this._points;
    }

    _resetDefaultValue() {
        var self = this;
        super._resetDefaultValue();
        self._points = new wijmo.collections.ObservableArray();
        self._points.collectionChanged.addHandler(function () {
            if (self._element) {
                self._repaint();
            }
        });
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Polygon._CSS_POLYGON;
    }

    _getContentCenter(): wijmo.chart.DataPoint {
        var pts = this.points,
            len = pts.length,
            x: number = 0, y: number = 0, i: number;

        for (i = 0; i < len; i++) {
            x += wijmo.isDate( pts[i].x) ? pts[i].x.getTime() : pts[i].x;
            y += wijmo.isDate( pts[i].y) ? pts[i].y.getTime() : pts[i].y;
        }
        return new wijmo.chart.DataPoint(x / len, y / len);
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            xs = [], ys = [],
            pts = self._points,
            len = pts.length,
            i, pt,
            offset = self._getOffset();

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
    }

    _getSize(): wijmo.Size {
        var self = this,
            xMin, xMax, yMin, yMax, i, pt,
            len = self._points.length,
            pts;

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
            } else if (pt.x > xMax) {
                xMax = pt.x;
            }
            if (pt.y < yMin) {
                yMin = pt.y;
            } else if (pt.y > yMax) {
                yMax = pt.y;
            }
        }
        return new wijmo.Size(xMax - xMin, yMax - yMin);
    }
}

/**
 * Represents a circle annotation for {@link AnnotationLayer}.
 */
export class Circle extends Shape {
    static _CSS_CIRCLE = 'gcchart-anno-circle';

    private _radius: number;

    /**
     * Initializes a new instance of the {@link Circle} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    /**
     * Gets or sets the radius of the {@link Circle} annotation.
     */
    get radius(): number {
        return this._radius;
    }
    set radius(value: number) {
        if (value === this._radius) {
            return;
        }
        this._radius = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._radius = 100;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Circle._CSS_CIRCLE;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            pt = self._convertPoint(self.point),
            offset = self._getOffset();
        self._adjustOffset(pt, offset);
        if (self._isValidPoint(pt)) {
            engine.drawPieSegment(pt.x, pt.y, self.radius, 0, 360, AnnotationBase._CSS_ANNO_SHAPE, self.style);
        }
    }

    _getSize(): wijmo.Size {
        var d = this.radius * 2;

        return new wijmo.Size(d, d);
    }
}

/**
 * Represents a square annotation for the {@link AnnotationLayer}.
 */
export class Square extends Shape {
    static _CSS_SQUARE = 'gcchart-anno-square';

    private _length: number;

    /**
     * Initializes a new instance of the {@link Square} annotation class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    /**
        * Gets or sets the length of the {@link Square} annotation.
        */
    get length(): number {
        return this._length;
    }
    set length(value: number) {
        if (value === this._length) {
            return;
        }
        this._length = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._length = 100;
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Square._CSS_SQUARE;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            pt = self._convertPoint(self.point),
            len = self.length,
            offset = self._getOffset();
        self._adjustOffset(pt, offset);
        if (self._isValidPoint(pt)) {
            engine.drawRect(pt.x - len / 2, pt.y - len / 2, len, len, AnnotationBase._CSS_ANNO_SHAPE, self.style);
        }
    }

    _getSize(): wijmo.Size {
        return new wijmo.Size(this.length, this.length);
    }
}

/**
    * Represents an image annotation for {@link AnnotationLayer}.
    */
export class Image extends Shape {
    static _CSS_IMAGE = 'gcchart-anno-image';

    private _width: number;
    private _height: number;
    private _href: string;

    /**
        * Initializes a new instance of the {@link Image} annotation class.
        * 
        * @param options JavaScript object containing initialization data for the object.
        */
    constructor(options?: any) {
        super(options);
    }

    /**
        * Gets or sets the width of the {@link Image} annotation.
        */
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        if (value === this._width) {
            return;
        }
        this._width = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    /**
        * Gets or sets the height of the {@link Image} annotation.
        */
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        if (value === this._height) {
            return;
        }
        this._height = wijmo.asNumber(value, false, true);
        this._repaint();
    }

    /**
        * Gets or sets the href of the {@link Image} annotation.
        */
    get href(): string {
        return this._href;
    }
    set href(value: string) {
        if (value === this._href) {
            return;
        }
        this._href = value;
        this._repaint();
    }

    _resetDefaultValue() {
        super._resetDefaultValue();
        this._width = 100;
        this._height = 100;
        this._href = '';
    }

    _getCSSClass() {
        return super._getCSSClass() + ' ' + Image._CSS_IMAGE;
    }

    _renderShape(engine: wijmo.chart.IRenderEngine) {
        super._renderShape(engine);

        var self = this,
            pt = self._convertPoint(self.point),
            href = self._href,
            w = self.width,
            h = self.height,
            offset = self._getOffset();

        if (href.length > 0 && self._isValidPoint(pt)) {
            self._adjustOffset(pt, offset);
            engine.drawImage(href, pt.x - w / 2, pt.y - h / 2, w, h);
        }
        self._applyStyle(self._element, self.style);
    }

    _getSize(): wijmo.Size {
        return new wijmo.Size(this.width, this.height);
    }


    private _applyStyle(el: SVGElement, style: any) {
        if (style) {
            for (var key in style) {
                el.setAttribute(this._deCase(key), style[key]);
            }
        }
    }

    private _deCase(s: string): string {
        return s.replace(/[A-Z]/g, function (a) {return '-' + a.toLowerCase() });
    }

}
    }
    


    module wijmo.chart.annotation {
    





'use strict';

/**
 * Represents an annotation layer for {@link FlexChart} and {@link FinancialChart}.
 *
 * The AnnotationLayer contains a collection of various annotation elements: texts, 
 * lines, images, rectangles etc.
 * To use the {@link AnnotationLayer}, create annotations and push them to the layer's 
 * items property.
 */
export class AnnotationLayer {
    static _CSS_Layer = 'wj-chart-annotationlayer';

    private _items: wijmo.collections.ObservableArray;
    _layerEle: SVGGElement;
    private _plotrectId: string;
    private _tooltip: wijmo.chart.ChartTooltip;
    //prevent others from closing annotation's tooltip.
    private _forceTTShowing: boolean;
    //prevent annotation from closing others tooltip.
    private _annoTTShowing: boolean;
    _chart: wijmo.chart.FlexChartCore;

    /**
     * Initializes a new instance of the {@link AnnotationLayer} class.
     * 
     * @param chart A chart to which the {@link AnnotationLayer} is attached.
     * @param options A JavaScript object containing initialization data for 
     * {@link AnnotationLayer}.  
     */
    constructor(chart: wijmo.chart.FlexChartCore, options?) {
        var self = this;

        self._init(chart);
        self._renderGroup();
        self._bindTooltip();
        if (options && wijmo.isArray(options)) {
            options.forEach(val => {
                var type = val['type'] || 'Circle',
                    a;
                if (wijmo.chart.annotation[type]) {
                    a = new wijmo.chart.annotation[type](val);
                    self._items.push(a);
                }
            });
        }
    }

    _init(chart: wijmo.chart.FlexChartCore) {
        var self = this;
        self._items = new wijmo.collections.ObservableArray();
        self._items.collectionChanged.addHandler(self._itemsChanged, self);
        self._chart = chart;
        self._forceTTShowing = false;
        self._annoTTShowing = false;
        chart.rendered.addHandler(self._renderAnnotations, self);
        chart.lostFocus.addHandler(self._lostFocus, self);
    }

    private _lostFocus(evt) {
        this._toggleTooltip(this._tooltip, evt, this._chart.hostElement);
    }

    /**
     * Gets the collection of annotation elements in the {@link AnnotationLayer}.
     */
    get items(): wijmo.collections.ObservableArray {
        return this._items;
    }

    /**
     * Gets an annotation element by name in the {@link AnnotationLayer}.
     * @param name The annotation's name.
     */
    getItem(name: string): AnnotationBase {
        var items = this.getItems(name);

        if (items.length > 0) {
            return items[0];
        } else {
            return null;
        }
    }

    /**
     * Gets the annotation elements by name in the {@link AnnotationLayer}.
     * @param name The annotations' name.
     */
    getItems(name: string): Array<AnnotationBase> {
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
    }


    private _bindTooltip() {
        var self = this,
            ele = self._chart.hostElement,
            tooltip = self._tooltip,
            ttHide: Function;

        if (!tooltip) {
            tooltip = self._tooltip = new wijmo.chart.ChartTooltip();
            ttHide = wijmo.Tooltip.prototype.hide;
            wijmo.Tooltip.prototype.hide = function () {
                if (self._forceTTShowing) {
                    return;
                }
                ttHide.call(tooltip);
            }
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
    }

    _showTooltip() {
        return !this._chart.isTouching;
    }

    private _toggleTooltip(tooltip, evt, parentNode) {
        var self = this,
            annotation = self._getAnnotation(evt.target, parentNode);
        if (annotation && annotation.tooltip) {
            self._forceTTShowing = true;
            self._annoTTShowing = true;
            tooltip.show(self._layerEle, annotation.tooltip, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
        } else {
            if (!self._annoTTShowing) {
                return;
            }
            self._annoTTShowing = false;
            self._forceTTShowing = false;
            tooltip.hide();
        }
    }

    _getAnnotation(ele, parentNode): AnnotationBase {
        var node = this._getAnnotationElement(ele, parentNode);
        if (node == null) {
            return null;
        }
        return node[AnnotationBase._DATA_KEY];
    }

    private _getAnnotationElement(ele, pNode): SVGGElement {
        if (!ele || !pNode) {
            return null;
        }
        var parentNode = ele.parentNode;
        if (wijmo.hasClass(ele, AnnotationBase._CSS_ANNOTATION)) {
            return ele;
        } else if (parentNode == null || parentNode === document.body || parentNode === document || parentNode === pNode) {
            return null;
        } else {
            return this._getAnnotationElement(parentNode, pNode);
        }
    }

    private _itemsChanged(items, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        var action = e.action,
            item: AnnotationBase = e.item;

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
    }

    private _renderAnnotations(chart: wijmo.chart.FlexChartBase, args: wijmo.chart.RenderEventArgs) {
        var items = this.items,
            len = items.length,
            i;

        this._renderGroup();
        for (i = 0; i < len; i++) {
            this._renderAnnotation(args.engine, items[i]);
        }
    }

    _renderGroup() {
        var self = this,
            rect = self._chart._plotRect,
            parent;

        let engine = this._chart.renderEngine;

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
    }

    _renderAnnotation(engine: wijmo.chart.IRenderEngine, item: AnnotationBase) {
        if (!this._layerEle || this._layerEle.parentNode == null) {
            return;
        }
        if (item._element && item._element.parentNode == this._layerEle) {
            this._layerEle.removeChild(item._element);
        }
        (<any>engine).useSvg = true;
        item.render(engine);
        (<any>engine).useSvg = false;
        this._layerEle.appendChild(item._element);
    }

    private _destroyAnnotations() {
        var items = this.items,
            len = items.length,
            i;

        for (i = 0; i < len; i++) {
            this._destroyAnnotation(items[i]);
        }
        this._layerEle.innerHTML = '';
    }

    private _destroyAnnotation(item: AnnotationBase) {
        if (this._layerEle) {
            this._layerEle.removeChild(item._element);
        }
        item.destroy();
    }

    //TODO: hitTest method.
    //HitTestInfo in chart is not suitable for this, because annotation is not only x/y data coordinate.
}
    }
    


    module wijmo.chart.annotation {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.annotation', wijmo.chart.annotation);




    }
    