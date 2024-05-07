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


    module wijmo.chart.map {
    



'use strict';

/** Information about hit test result. */
export class MapHitTestInfo {
    private _pt: wijmo.Point;
    _item: any;
    private _map: FlexMap;
    _chartElement: wijmo.chart.ChartElement;

    /**
     * Gets the point in control coordinates.
     */
    get point(): wijmo.Point {
        return this._pt;
    }

    /**
     * Gets the data item associated with the point.
     */
    get item(): any {
        return this._item;
    }


    /** Gets the hit point in geographical coordinates. */
    get geoPoint(): wijmo.Point {
        return this._map ? this._map.convertBack(this.point) : null;
    }

    /** Gets chart element at the hit point. */
    get chartElement(): wijmo.chart.ChartElement {
        return this._chartElement;
    }

    /**
     * Get the map control.
     */
    get map(): FlexMap {
        return this._map;
    }
}
    }
    


    module wijmo.chart.map {
    


'use strict';

export class _DrawOptions {
    className?: string;
    clipPath?: string;
    style?: any;
}

export interface IMapRenderEngine extends wijmo.chart.IRenderEngine {
    drawPolygon2(options: _DrawOptions, pts: number[][]);
}

export class _SvgMapRenderEngine extends wijmo.chart.SvgRenderEngine {
    scale = 1;

    constructor(el?: HTMLElement) {
        super(el);
        this.element.setAttribute('xmlns:wj-map', 'http://www.grapecity.com/wijmo');
    }

    drawPolygon2(options: _DrawOptions, pts: number[][]): SVGElement {
        let className = options ? options.className : null;
        let clipPath = options ? options.clipPath : null;
        let style = options ? options.style : null;
        let prec = this.precision;

        if (pts && pts.length > 0) {
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            (<any>this)._applyColor(path, 'stroke', this.stroke);

            let sw = this.strokeWidth;
            if (sw !== null) {
                if (wijmo.isIE()) {
                    sw *= this.scale;
                }
                (<any>this)._setAttribute(path, 'stroke-width', sw.toString());
            }
            (<any>this)._applyColor(path, 'fill', this.fill);

            let d = '';

            for (let j = 0; j < pts.length; j++) {
                let pts0 = pts[j];
                let npt = pts0.length / 2;
                if (npt > 1) {

                    d += ' M ' + pts0[0].toFixed(prec) + ' ' + pts0[1].toFixed(prec);

                    for (let i = 1; i < npt; i++) {
                        d += ' L ' + pts0[i * 2].toFixed(prec) + ' ' + pts0[i * 2 + 1].toFixed(prec);
                    }

                    d += ' Z';
                }
            }

            (<any>this)._setAttribute(path, 'd', d);

            if (className) {
                path.setAttribute('class', className);
            }
            if (clipPath) {
                (<any>this)._setClipPath(path, clipPath);
            }
            (<any>this)._applyStyle(path, style);

            (<any>this)._appendChild(path);

            path.setAttribute('vector-effect', 'non-scaling-stroke');

            return path;

        }

        return null;
    }

}
    }
    


    module wijmo.chart.map {
    



'use strict';

export class _Range {
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    min: number;
    max: number;

    get range(): number {
        return this.max - this.min;
    }

    norm(val: number) {
        return (val - this.min) / this.range;
    }
}

export class _Utils {
    static getRange(items: any[], binding: wijmo.Binding | ((o: any) => number)): _Range {
        if (items && binding) {
            let len = items.length;
            let min: number = NaN;
            let max: number = NaN;

            for (let i = 0; i < len; i++) {
                let item = items[i];
                if (item) {
                    let val: number;

                    if (wijmo.isFunction(binding)) {
                        val = binding(item);
                    } else {
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
    }
}

    }
    


    module wijmo.chart.map {
    



'use strict';

export interface IColorScale {
    convert(val: number): string;
}


// todo
// * continuous/discrete
// * domain/clamp

/** Color scale performs value to color transformation. */
export class ColorScale implements IColorScale {
    private _clrs: wijmo.Color[] = [];
    private _clrSpline: _ColorSpline;
    private _scale: (v: number) => number;
    private _clrUnknown: string = 'transparent';
    _range: _Range;
    private _colors: string[];
    private _items: any[];
    private _binding: string | ((o: any) => number);
    private _fmt: string;
    _parent: any;

    constructor(options?: any) {
        this.colors = wijmo.chart.Palettes.SequentialSingle.Greys;
        this.initialize(options);
    }

    initialize(options: any) {
        wijmo.copy(this, options);
    }

    convert(val: number, norm = true): string {
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
        } else {
            return this._clrSpline.interpolate(val).toString();
        }
    }

    /** Gets or sets the scaling function. */
    get scale(): (v: number) => number {
        return this._scale;
    }
    set scale(value: (v: number) => number) {
        if (this._scale != value) {
            this._scale = value;
        }
    }

    /** Gets or sets the binding property or function. */
    get binding(): string | ((o: any) => number) {
        return this._binding;
    }
    set binding(value: string | ((o: any) => number)) {
        if (this._binding != value) {
            this._binding = value;
        }
    }

    /**
     * Get or sets the color for undefined values (NaN or undefined).
     */
    get colorUnknown(): string {
        return this._clrUnknown;
    }
    set colorUnknown(value: string) {
        if (this._clrUnknown != value) {
            this._clrUnknown = wijmo.asString(value);
        }
    }

    /** Gets or sets the array of colors (palette) used for transformation. */
    get colors(): string[] {
        return this._colors;
    }
    set colors(value: string[]) {
        if (this._colors != value) {
            this._clrs = [];
            let clrs = this._colors = value;
            if (clrs) {
                for (let i = 0; i < clrs.length; i++) {
                    this._clrs.push(new wijmo.Color(clrs[i]));
                }
                this._clrSpline = new _ColorSpline(this._clrs);
            }
        }
    }

    /**
     * Get or sets the format string for legend items.
     */
    get format(): string {
        return this._fmt;
    }
    set format(value: string) {
        if (this._fmt != value) {
            this._fmt = wijmo.asString(value, true);
        }
    }

    domain(items: any[]) {
        if (wijmo.isFunction(this.binding)) {
            this._range = _Utils.getRange(items, this.binding);
        } else {
            this._range = _Utils.getRange(items, new wijmo.Binding(this.binding));
        }
    }

    getValue(item: any): number {
        let val: number;
        if (wijmo.isFunction(this.binding)) {
            val = this.binding(item);
        } else {
            val = new wijmo.Binding(this.binding).getValue(item);
        }

        return val;
    }

    private _interpolate(clr1: wijmo.Color, clr2: wijmo.Color, pct: number): string {
        pct = wijmo.clamp(pct, 0, 1);
        let qpct = 1 - pct;

        return wijmo.Color.fromRgba(clr1.r * qpct + clr2.r * pct, clr1.g * qpct + clr2.g * pct,
            clr1.b * qpct + clr2.b * pct, clr1.a * qpct + clr2.a * pct).toString();
    }

    _drawLegend(e: wijmo.chart.IRenderEngine, rect: wijmo.Rect, isVert: boolean) {
        _ColorScaleLegend.draw(e, this, rect, isVert);
    }

    _measureLegend(e: wijmo.chart.IRenderEngine, isVert: boolean, w: number, h: number): wijmo.Size {
        return _ColorScaleLegend.measure(e, this, isVert, w, h);
    }
}

class _ColorScaleLegend {
    static itemSize = 20; // width or height of
    static marginText = 4;

    static measure(e: wijmo.chart.IRenderEngine, clrScale: ColorScale, isVert: boolean, w: number, h: number): wijmo.Size {
        let legendSize = isVert ? new wijmo.Size(this.itemSize, h - 120) : new wijmo.Size(w - 80, this.itemSize);

        let values = this._getValues(clrScale);
        let len = values.length;

        if (values.length) {
            let sz = new wijmo.Size();

            for (let i = 0; i < len; i++) {
                let s = this._getLabel(clrScale, values[i]);
                let sz0 = e.measureString(s);
                sz.width = Math.max(sz.width, sz0.width);
                sz.height = Math.max(sz.height, sz0.height);
            }

            if (sz.width && sz.height) {
                if (isVert) {
                    legendSize.width += sz.width + this.marginText;
                } else {
                    legendSize.height += sz.height + this.marginText;
                }
            }
        }

        return legendSize;
    }

    static draw(e: wijmo.chart.IRenderEngine, clrScale: ColorScale, rect: wijmo.Rect, isVert: boolean) {
        e.stroke = 'transparent';
        let cnt = 100;

        let vals = this._getValues(clrScale);

        if (isVert) {
            rect = rect.inflate(0, -10);
            let dy = rect.height / cnt;

            for (let i = 0; i < cnt; i++) {
                e.fill = clrScale.convert((i + 0.5) / cnt, false);
                e.drawRect(rect.left, rect.top + i * dy, this.itemSize, dy + 1);
            }

            if (vals.length) {
                e.stroke = 'black';
                for (let i = 0; i < vals.length; i++) {
                    let val = vals[i];
                    let vn = clrScale._range.norm(val);
                    let y = rect.top + vn * rect.height;
                    let s = this._getLabel(clrScale, val);
                    let sz = e.measureString(s);
                    e.drawString(s, new wijmo.Point(rect.left + this.itemSize + this.marginText, y + 0.5 * sz.height));
                    e.drawLine(rect.left, y, rect.left + this.itemSize, y);
                }
            }
        } else {
            rect = rect.inflate(-20, 0);
            let dx = rect.width / cnt;

            let dy = 0;

            if (vals.length) {
                for (let i = 0; i < vals.length; i++) {
                    let val = vals[i];
                    let vn = clrScale._range.norm(val);
                    if (clrScale.scale) {
                        vn = clrScale.scale(vn);
                    }
                    let x = rect.left + vn * rect.width;
                    let s = this._getLabel(clrScale, val);
                    let sz = e.measureString(s);
                    dy = Math.max(dy, sz.height);
                    e.drawString(this._getLabel(clrScale, val), new wijmo.Point(x - 0.5 * sz.width, rect.top + sz.height));
                }
            }

            if (dy) {
                dy += this.marginText;
            }

            for (let i = 0; i < cnt; i++) {
                e.fill = clrScale.convert((i + 0.5) / cnt, false);
                e.drawRect(rect.left + i * dx, rect.top + dy, dx + 1, this.itemSize);
            }

            if (vals.length) {
                e.stroke = 'black';
                for (let i = 0; i < vals.length; i++) {
                    let val = vals[i];
                    let vn = clrScale._range.norm(val);
                    if (clrScale.scale) {
                        vn = clrScale.scale(vn);
                    }
                    let x = rect.left + vn * rect.width;
                    e.drawLine(x, rect.bottom - this.itemSize, x, rect.bottom);
                }
            }

        }
    }

    static _getValues(clrScale: ColorScale): number[] {
        let values: number[] = [];
        let range = clrScale._range;
        if (range) {

            let delta = this._calcDelta(range.range);

            let min = Math.round(range.min / delta) * delta;

            for (let val = min; val <= range.max; val += delta) {
                if (val < range.min) {
                    continue;
                }
                values.push(val);
            }
        }
        return values;
    }

    static _getLabel(clrScale: ColorScale, val: number) {
        return clrScale.format ? wijmo.Globalize.formatNumber(val, clrScale.format) : val.toString();
    }

    static _calcDelta(range: number): number {
        var prec = this._nicePrecision(range);
        var dx = range / 10/*this._getAnnoNumber(this.axisType == AxisType.Y)*/;

        let delta = this._niceNumber(2 * dx, -prec, true);
        if (delta < dx) {
            delta = this._niceNumber(dx, -prec + 1, false);
        }
        if (delta < dx) {
            delta = this._niceTickNumber(dx);
        }

        return delta;
    }

    static _nicePrecision(range: number): number {
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
        } else {
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
    }

    static _niceTickNumber(x: number): number {
        if (x == 0) {
            return x;
        } else if (x < 0) {
            x = -x;
        }

        var log10 = Math.log(x) / Math.LN10;
        var exp = Math.floor(log10);

        var f = x / Math.pow(10.0, exp);
        var nf = 10.0;

        if (f <= 1.0) {
            nf = 1.0;
        } else if (f <= 2.0) {
            nf = 2.0;
        } else if (f <= 5.0) {
            nf = 5.0;
        }
        return (nf * Math.pow(10.0, exp));
    }

    static _niceNumber(x: number, exp: number, round: boolean) {
        if (x == 0) {
            return x;
        } else if (x < 0) {
            x = -x;
        }

        var f = x / Math.pow(10.0, exp);
        var nf = 10.0;

        if (round) {
            if (f < 1.5) {
                nf = 1;
            } else if (f < 3) {
                nf = 2;
            } else if (f < 4.5) {
                nf = 4;
            } else if (f < 7) {
                nf = 5;
            }
        } else {
            if (f <= 1) {
                nf = 1;
            } else if (f <= 2) {
                nf = 2;
            } else if (f <= 5) {
                nf = 5;
            }
        }

        return (nf * Math.pow(10.0, exp));
    }

}

class _ColorSpline {
    private _clrs: wijmo.Color[];
    private _rsp: _Spline;
    private _gsp: _Spline;
    private _bsp: _Spline;

    constructor(clrs: wijmo.Color[]) {
        this._clrs = clrs;
        let len = clrs.length;
        let ps: number[] = [];
        let rs: number[] = [];
        let gs: number[] = [];
        let bs: number[] = [];

        for (var i = 0; i < len; i++) {
            let clr = clrs[i];
            let p = i / (len - 1);
            ps.push(p);
            rs.push(clr.r);
            gs.push(clr.g);
            bs.push(clr.b);
        }

        this._rsp = new _Spline(ps, rs);
        this._gsp = new _Spline(ps, gs);
        this._bsp = new _Spline(ps, bs);
    }

    interpolate(val: number): wijmo.Color {
        val = wijmo.clamp(val, 0, 1);

        let r = this._rsp.calculate(val);
        let g = this._gsp.calculate(val);
        let b = this._bsp.calculate(val);

        return wijmo.Color.fromRgba(r, g, b);
    }
}

class _Spline {
    // 
    private k = 0.002;

    private _x;
    private _y;

    private _a = [];
    private _b = [];
    private _c = [];
    private _d = [];

    private _len: number;

    //  T^3     -1     +3    -3    +1     /
    //  T^2     +2     -5     4    -1    /
    //  T^1     -1      0     1     0   /  2
    //  T^0      0      2     0     0  /

    private m =
        [
            [-1 * 0.5, +3 * 0.5, -3 * 0.5, +1 * 0.5],
            [+2 * 0.5, -5 * 0.5, +4 * 0.5, -1 * 0.5],
            [-1 * 0.5, 0, +1 * 0.5, 0],
            [0, +2 * 0.5, 0, 0],
        ];

    constructor(x: number[], y: number[], num?: number) {
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

    calculate(val: number): number {
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
    }
}
    }
    


    module wijmo.chart.map {
    







'use strict';

export interface _IConverter {
    convert(pt: wijmo.Point): wijmo.Point;
}

/**
 * A control for visualization geographical data.
 */
export class FlexMap extends wijmo.chart.FlexChartBase implements _IConverter {
    private _layers: wijmo.collections.ObservableArray = new wijmo.collections.ObservableArray();

    private _center = new wijmo.Point();
    private _zoom = 1;
    private _zoomStep = 0.5;

    private _offset = new wijmo.Point();
    private _size: number;

    private _dragStart: wijmo.Point;
    private _overlay: HTMLElement;

    _mapRect: wijmo.Rect;
    _proj = new MercatorProjection();
    //_proj = new AlbersProjection();

    private _touchStartH = this._touchStart.bind(this);
    private _touchMoveH = this._touchMove.bind(this);
    private _touchEndH = this._touchEnd.bind(this);
    private _touchCancelH = this._touchCancel.bind(this);
    private _mouseWheelH = this._mouseWheel.bind(this);

    /**
     * Initializes a new instance of the {@link FlexMap} class.
     * 
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(element: any, options?: any) {
        super(element, null, true); // invalidate on resize
        const host = this.hostElement;

        // add classes to host element
        this.applyTemplate('wj-control wj-flexchart wj-flexmap', null, null);
        this._currentRenderEngine = new _SvgMapRenderEngine(host);
        let div = wijmo.createElement('<div></div>', null, { position: 'relative' });
        this._overlay = wijmo.createElement('<div></div>', div, { position: 'absolute', left: '90%', bottom: '90%' });

        let btnZoomIn = wijmo.createElement('<button class="wj-btn"><span class="wj-glyph-plus"></span></button>', this._overlay);
        btnZoomIn.addEventListener('click', () => this.zoom += this._zoomStep);
        let btnZoomOut = wijmo.createElement('<button class="wj-btn"><span class="wj-glyph-minus"></span></button>', this._overlay);
        btnZoomOut.addEventListener('click', () => this.zoom -= this._zoomStep);

        wijmo.addClass(host, 'wj-flexchart-touch-disabled');
        host.appendChild(div);

        this._legend = new wijmo.chart.Legend(this);
        this._legend.position = wijmo.chart.Position.None;

        this._tooltip = new wijmo.chart.ChartTooltip();
        this.tooltip.content = null;

        const self = this;
        this.layers.collectionChanged.addHandler(() => {
            this.layers.forEach(layer => layer.map = self);
            this.invalidate();
        });

        this.addEventListener(host, 'click', function (evt) {
            if (self.isDisabled) {
                return;
            }
            let tip = self._tooltip;
            let tc = tip.content;
            if (tc && self.isTouching) {
                self._updateTooltip(tip, evt);
            }
        });
        this.addEventListener(host, 'mousedown', (e: MouseEvent) => {
            if (self.isDisabled) {
                return;
            }
            if (e.button == 0) { // left button only
                this.focus();
                this._dragStart = new wijmo.Point(e.pageX, e.pageY);
                this._hideToolTip();
            }
        });
        this.addEventListener(host, 'mousemove', (e: MouseEvent) => {
            if (self.isDisabled) {
                return;
            }

            if (self._dragStart) {
                let p0 = this.convertBack(this._toControl(self._dragStart));
                let p1 = this.convertBack(this._toControl(e));
                this.center = new wijmo.Point(this.center.x - p1.x + p0.x, this.center.y - p1.y + p0.y);
                this._dragStart = new wijmo.Point(e.pageX, e.pageY);
            } else {
                let tip = self._tooltip;
                let tc = tip.content;
                if (tc && !self.isTouching) {
                    self._updateTooltip(tip, e);
                }
            }
        });
        this.addEventListener(host, 'mouseup', (e: MouseEvent) => {
            this._dragStart = null;
        });

        this.addEventListener(host, 'mouseleave', (e: MouseEvent) => {
            if (e.target == self.hostElement) {
                this._dragStart = null;
                self._hideToolTip();
            }
        });

        this.addEventListener(host, 'touchstart', this._touchStartH);
        this.addEventListener(host, 'touchmove', this._touchMoveH);
        this.addEventListener(host, 'touchcancel', this._touchCancelH);
        this.addEventListener(host, 'touchend', this._touchEndH);
        this.addEventListener(host, 'wheel', this._mouseWheelH);

        // apply options only after chart is fully initialized
        this.initialize(options);

        // refresh control to show current state
        this.refresh();
    }

    /**
     * Gets the collection of map layers.
     */
    get layers(): wijmo.collections.ObservableArray {
        return this._layers;
    }

    /** 
     * Gets or sets the map center in geo coordinates.
     */
    get center(): wijmo.Point {
        return this._center;
    }
    set center(center: wijmo.Point) {
        if (this._center != center) {
            this._center = center;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the map zoom level.
     */
    get zoom(): number {
        return this._zoom;
    }
    set zoom(value: number) {
        if (value < 1) {
            value = 1;
        }
        if (this._zoom != value) {
            this._zoom = value;
            this.invalidate();
        }
    }

    /**
     * Gets the map tooltip.
     */
    get tooltip(): wijmo.chart.ChartTooltip {
        return this._tooltip;
    }

    /**
     * Converts the specified point from geo coordinates to control's coordinates.
     * 
     * @param pt point in geo coordinates.
     */
    convert(pt: wijmo.Point): wijmo.Point {
        return this._convertMercator(pt);
    }

    /**
     * Converts the specified point from control's coordinates to geo coordinates.
     * 
     * @param pt point in control's coordinates.
     */
    convertBack(pt: wijmo.Point): wijmo.Point {
        return this._convertMercatorBack(pt);
    }

    /** Gets hit test information about specified point. The point can be specified as mouse event object.  */
    hitTest(pt: MouseEvent | wijmo.Point | number, y?: number): MapHitTestInfo {
        // control coords
        var cpt = this._toControl(pt, y);

        var hti = new MapHitTestInfo();
        if (wijmo.chart.FlexChartBase._contains(this._rectHeader, cpt)) {
            hti._chartElement = wijmo.chart.ChartElement.Header;
        } else if (wijmo.chart.FlexChartBase._contains(this._rectFooter, cpt)) {
            hti._chartElement = wijmo.chart.ChartElement.Footer;
        } else if (wijmo.chart.FlexChartBase._contains(this._rectLegend, cpt)) {
            hti._chartElement = wijmo.chart.ChartElement.Legend;
        } else if (wijmo.chart.FlexChartBase._contains(this._rectChart, cpt)) {
            let el: Element;
            if (pt instanceof MouseEvent) {
                el = document.elementFromPoint(pt.x, pt.y);
            } else {
                let off = this._getHostOffset();
                el = document.elementFromPoint(off.x + cpt.x, off.y + cpt.y);
            }
            let id = el.getAttribute('wj-map:id');
            if (id != null) {
                hti._item = this._getItemById(id);
            }
        }

        return hti;
    }

    /**
     * Zooms map to the specified rectangle in data coordinates.
     * 
     * @param rect rectangle in geo coordinates.
     */
    zoomTo(rect: wijmo.Rect) {
        let maxY = this._proj.maxY;
        let top = Math.max(rect.top, -maxY);
        let bottom = Math.min(rect.bottom, maxY);

        let p1 = this.convert(new wijmo.Point(rect.left, top));
        let p2 = this.convert(new wijmo.Point(rect.right, bottom));
        let p = new wijmo.Point(0.5 * (p1.x + p2.x), 0.5 * (p1.y + p2.y));

        this.center = this.convertBack(p);

        p1 = this.convert(new wijmo.Point(rect.left, top));
        p2 = this.convert(new wijmo.Point(rect.right, bottom));

        let sc1 = this._mapRect.width / Math.abs(p2.x - p1.x);
        let sc2 = this._mapRect.height / Math.abs(p2.y - p1.y);

        this.zoom *= this.zoom + Math.log(Math.min(sc1, sc2)) * Math.LOG2E;
    }

    invalidate(fullUpdate?: boolean) {
        if (fullUpdate) {
            this.layers.forEach((layer) => {
                if (layer._clearCache) {
                    layer._clearCache();
                }
            });
        }
        super.invalidate(fullUpdate);
    }

    _renderChart(engine: wijmo.chart.IRenderEngine, rect: wijmo.Rect, applyElement: boolean) {
        this.onRendering(new wijmo.chart.RenderEventArgs(engine));

        let w = rect.width;
        let h = rect.height;

        //this._tmGroup = 
        var margins = this._parseMargin(this.plotMargin);
        let def_marg = 8;

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

        let mapRectId = 'mapRect' + (1000000 * Math.random()).toFixed();
        engine.addClipRect(rect, mapRectId);

        let g = engine.startGroup(null, mapRectId, true);

        this._mapRect = rect.clone();//.inflate(-4, -4);

        let sz = this._size = 0.5 * Math.min(rect.width, rect.height);
        this._offset.x = this._mapRect.left;
        this._offset.y = this._mapRect.top;
        if (rect.width > 2 * sz) {
            this._offset.x = 0.5 * rect.width - sz + this._mapRect.left;
        } else if (rect.height > 2 * this._size) {
            this._offset.y = 0.5 * rect.height - sz + this._mapRect.top;
        }

        let sc = Math.pow(2, this.zoom);
        let p0 = this._proj.convert(this.center);
        p0.x = p0.x * sc * sz - sz;
        p0.y = p0.y * sc * sz - sz;

        this._offset.x -= p0.x;
        this._offset.y -= p0.y;

        //this._plotRect = rect;
        (<_SvgMapRenderEngine>engine).precision = 6;

        for (let i = 0; i < this.layers.length; i++) {
            let sw = 1 / (sc * sz);
            (<_SvgMapRenderEngine>engine).scale = sw;

            let t = (<SVGSVGElement>engine.element).createSVGTransform();
            let m = (<SVGSVGElement>engine.element).createSVGMatrix();
            m.a = m.d = sc * sz;
            m.b = m.c = 0;
            m.e = this._offset.x;
            m.f = this._offset.y;
            t.setMatrix(m);

            this.layers[i].render(engine, t, g);
        };

        engine.endGroup();

        let b = this._rectChart.bottom - this._mapRect.bottom;
        this._overlay.style.left = (this._mapRect.right - 80).toString() + 'px';
        this._overlay.style.bottom = b.toString() + 'px';

        this.onRendered(new wijmo.chart.RenderEventArgs(engine));
    }

    _getDesiredLegendSize(e: wijmo.chart.IRenderEngine, isVert: boolean, w: number, h: number): wijmo.Size {
        let sz = new wijmo.Size();

        for (let i = 0; i < this.layers.length; i++) {
            let l = this.layers[i];
            if (l.colorScale) {
                if (l.getAllFeatures) {
                    l.colorScale.domain(l.getAllFeatures());
                } else {
                    l.colorScale.domain(l.itemsSource);
                }
                let sz0 = l.colorScale._measureLegend(e, isVert, w, h);
                if (sz0 && sz0.width && sz0.height) {
                    sz = sz0;
                }
            }
        }

        return sz;
    }

    _renderLegend(e: wijmo.chart.IRenderEngine, pt: wijmo.Point, areas: any[], isVert: boolean, w: number, h: number) {
        let rect = new wijmo.Rect(pt.x, pt.y, w, h);
        this.layers.forEach((l) => {
            if (l.colorScale) {
                l.colorScale._drawLegend(e, rect, isVert);
            }
        });
    }

    _copy(key: string, value: any): boolean {
        if (key == 'layers') {
            this.layers.clear();
            var arr = wijmo.asArray(value);
            for (var i = 0; i < arr.length; i++) {
                this.layers.push(arr[i]);
            }
            return true;
        }
        return false;
    }

    private _updateTooltip(tip: wijmo.chart.ChartTooltip, evt: MouseEvent) {
        let content = tip.content;
        if (content) {
            let el = document.elementFromPoint(evt.x, evt.y);
            let id = el ? el.getAttribute('wj-map:id') : null;
            if (id != null) {
                let f = this._getItemById(id);
                if (f) {
                    if (wijmo.isFunction(content)) {
                        content = content(f);
                    }
                    content = wijmo.format(content, f);
                }
            } else {
                content = null;
            }
        }

        if (content && content.trim().length > 0) {
            this._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
        } else {
            this._hideToolTip();
        }
    }

    private _getItemById(id: string): any {
        for (let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];
            if (layer._getFeatureById) {
                let f = layer._getFeatureById(id);
                if (f) {
                    return f.properties;
                }
            } else if (layer.getItemById) {
                let f = layer.getItemById(id);
                if (f) {
                    return f;
                }
            }
        }
        return null;
    }

    private _convertMercator(pt: wijmo.Point): wijmo.Point {
        let sc = Math.pow(2, this.zoom) * this._size;

        let proj = this._proj;

        let p = proj.convert(pt);

        p.x *= sc;
        p.y *= sc;
        p.x += this._offset.x;// - p0.x;
        p.y += this._offset.y;// - p0.y;

        return p;
    }

    private _convertMercatorBack(pt: wijmo.Point): wijmo.Point {
        let sc = Math.pow(2, this.zoom) * this._size;

        let proj = this._proj;

        let p = pt.clone();
        p.x -= this._offset.x;
        p.y -= this._offset.y;

        p.x /= sc;
        p.y /= sc;

        p = proj.convertBack(p);

        return p;
    }

    _handleTouch = false;
    _touch1: wijmo.Point;
    _touch2: wijmo.Point;

    private _touchStart(e: TouchEvent) {
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
    }

    private _touchMove(e: TouchEvent) {
        if (this.isDisabled) {
            return;
        }

        if (this._handleTouch) {
            e.preventDefault();
        }

        if (this._dragStart) {
            let p0 = this.convertBack(this._toControl(this._dragStart));
            let p1 = this.convertBack(this._toControl(e.touches[0].pageX, e.touches[0].pageY));
            this.center = new wijmo.Point(this.center.x - p1.x + p0.x, this.center.y - p1.y + p0.y);
            this._dragStart = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);;
        } else if (this._touch1 && this._touch2) {
            let touch1 = new wijmo.Point(e.touches[0].pageX, e.touches[0].pageY);
            let touch2 = new wijmo.Point(e.touches[1].pageX, e.touches[1].pageY);

            let d0 = this._dist(this._touch1, this._touch2);
            let d1 = this._dist(touch1, touch2);
            if (Math.abs(d1 - d0) > 1) {
                this.zoom += Math.log2(d1 / d0);
                this._touch1 = touch1;
                this._touch2 = touch2;
            }
        }
    }

    private _dist(p1: wijmo.Point, p2: wijmo.Point): number {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private _touchEnd(e: any) {
        this._handleTouch = false;
        this._dragStart = this._touch1 = this._touch2 = null;
    }

    private _touchCancel(e: any) {
        this._handleTouch = false;
        this._dragStart = this._touch1 = this._touch2 = null;
    }

    private _mouseWheel(e: WheelEvent) {
        if (this.isDisabled) {
            return;
        }
        e.preventDefault();
        this._hideToolTip();
        let delta = -e.deltaY;
        delta = delta > 0 ? 0.1 : -0.1;
        this.zoom += delta;
    }
}

class MercatorProjection {
    maxY = (2 * Math.atan(Math.exp(Math.PI)) - 0.5 * Math.PI) / M.toRadians;

    public convert(pt: wijmo.Point): wijmo.Point {
        let x = this._convertX(pt.x);
        let y = Math.abs(pt.y) > this.maxY ? (pt.y > 0 ? 1 : -1) * this.maxY : pt.y;
        y = this._convertY(y);
        return new wijmo.Point(x, y);
    }

    public convertBack(pt: wijmo.Point): wijmo.Point {
        let x = this._convertBackX(pt.x);
        let y = this._convertBackY(pt.y);
        return new wijmo.Point(x, y);
    }

    private _convertX(x: number): number {
        return (x * M.toRadians + Math.PI) / M.pi2;
    }

    private _convertBackX(x: number): number {
        return (x * M.pi2 - Math.PI) / M.toRadians;
    }

    private _convertY(y: number): number {
        return (Math.PI + Math.log(Math.tan(M.pi4 - 0.5 * y * M.toRadians))) / M.pi2;
    }

    private _convertBackY(y: number): number {
        return -(2 * Math.atan(Math.exp(y * M.pi2 - Math.PI)) - 0.5 * Math.PI) / M.toRadians;
    }
}

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

class M {
    static toRadians = Math.PI / 180;
    static pi4 = 0.25 * Math.PI;
    static pi2 = 2 * Math.PI;
}
    }
    


    module wijmo.chart.map {
    


'use strict';

export interface IMapLayer {
    map: FlexMap;
    render(engine: wijmo.chart.IRenderEngine, t?: SVGTransform, g?: SVGGElement);
}


    }
    


    module wijmo.chart.map {
    





/** Base class for map layers. */
export class MapLayerBase implements IMapLayer {
    protected _items: any;
    private _url: string;
    private _map: FlexMap;
    private _style: any;
    private _colorScale: ColorScale;

    /** Gets the parent map */
    get map(): FlexMap {
        return this._map;
    }
    set map(value: FlexMap) {
        this._map = value;
    }

    /** Gets or sets the layer's style. */
    get style(): any {
        return this._style;
    }
    set style(value: any) {
        if (this._style != value) {
            this._style = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets a data source for the layer.
     * 
     * Data source should be GeoJSON object(s).
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        this._setItems(value);
    }

    /**
     * Occurs after the layer has been bound to a new items source.
     */
    readonly itemsSourceChanged = new wijmo.Event<MapLayerBase, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }

    /** Get or sets the data source url. */
    get url(): string {
        return this._url;
    }
    set url(value: string) {
        if (this._url != value) {
            this._url = wijmo.asString(value, true);
            this._loadUrl();
        }
    }

    /**
     * Gets or sets color scale used for fill layer's items.
     */
    get colorScale(): ColorScale {
        return this._colorScale;
    }
    set colorScale(value: ColorScale) {
        if (this._colorScale != value) {
            this._colorScale = value;
            this._clearCache();
            this.invalidate();
        }
    }

    render(e: wijmo.chart.IRenderEngine, t: SVGTransform, g: SVGGElement) { };

    invalidate() {
        if (this.map) {
            this.map.invalidate();
        }
    }

    /**
     * Initializes the series by copying the properties from a given object.
     *
     * @param options JavaScript object containing initialization data for the series.
     */
    initialize(options: any) {
        wijmo.copy(this, options);
    }

    _applyStyle(e: wijmo.chart.IRenderEngine) {
        if (this.style) {
            e.fill = this.style.fill;
            e.stroke = this.style.stroke;
            e.strokeWidth = this.style.strokeWidth;
        }
    }

    _clearCache() {

    }

    _loadUrl() {
        if (this.url) {
            // error handling ?
            wijmo.httpRequest(this.url, {
                success: xhr => this.itemsSource = JSON.parse(xhr.responseText)
            });
        } else {
            this.itemsSource = null;
        }
    }

    _setItems(value: any) {
        if (this._items != value) {
            this._clearCache();
            this._items = value;
            this.onItemsSourceChanged(new wijmo.EventArgs());
            this.invalidate();
        }
    }
}

    }
    


    module wijmo.chart.map {
    





'use strict';

/**
 * Represents scatter map layer.
 * 
 * The data for {@link ScatterMapLayer} is a collection of points in geographical coordinates.
 */
export class ScatterMapLayer extends MapLayerBase {
    private _binding: string;
    private _symbolSize = 5;
    private _symbolMinSize = 5;
    private _symbolMaxSize = 50;

    private _index = 0;
    private _prefix = '_';
    private _elMap = {};

    private _xBnd: wijmo.Binding;
    private _yBnd: wijmo.Binding;
    private _szBnd: wijmo.Binding;
    private _cBnd: wijmo.Binding;
    private _szRange: _Range;
    private _hasBindings = false;

    /**
     * Initializes a new instance of the {@link ScatterMapLayer} class.
     * 
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(options?: any) {
        super();
        this.style = { stroke: 'grey', strokeWidth: 0.5, fill: 'transparent' };
        this.initialize(options);
    }

    /**
     * Gets or sets the symbol size.
     */
    get symbolSize(): number {
        return this._symbolSize;
    }
    set symbolSize(value: number) {
        if (this._symbolSize != value) {
            this._symbolSize = wijmo.asNumber(value);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the minimal symbol size.
     * 
     * For bubble plot.
     */
    get symbolMinSize(): number {
        return this._symbolMinSize;
    }
    set symbolMinSize(value: number) {
        if (this._symbolMinSize != value) {
            this._symbolMinSize = wijmo.asNumber(value);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the maximal symbol size.
     * 
     * For bubble plot.  
     */
    get symbolMaxSize(): number {
        return this._symbolMaxSize;
    }
    set symbolMaxSize(value: number) {
        if (this._symbolMaxSize != value) {
            this._symbolMaxSize = wijmo.asNumber(value);
            this.invalidate();
        }
    }

    /**
     * Gets or sets a data source for the layer.
     * 
     * Data source should be a collection of objects that provides geographical coordinates (longitude and latitude).
     * Object property or properties which contains coordinates are specified by {@link binding} property.
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        this._setItems(value);
    }

    /**
     * Gets or sets the binding for the layer.
     * 
     * The binding can include two comma-separated property names (longitude and latitude) 'lon,lat'
     * or a single property name that contain a pair of geographical coordinates.
     */
    get binding(): string {
        return this._binding;
    }
    set binding(value: string) {
        if (this._binding != value) {
            this._binding = wijmo.asString(value, true);
            this.parseBindings();
            this.invalidate();
        }
    }

    /**
     * Renders the layer.
     * 
     * @param e Render engine.
     * @param t Svg transformation.
     * @param group SVG group element for the layer.
     */
    render(e: wijmo.chart.IRenderEngine, t: SVGTransform, group: SVGGElement) {
        this._elMap = {};
        this._index = 0;
        this._prefix = this.map.layers.indexOf(this).toString() + '_';

        let g = e.startGroup();

        let map = this.map;
        let r = this.map._mapRect;

        this._applyStyle(e);

        let items = this.itemsSource;
        let len = items ? items.length : 0;

        let xBnd = this._xBnd;
        let yBnd = this._yBnd;
        let cBnd = this._cBnd;
        let szBnd = this._szBnd;

        if (szBnd) {
            this._szRange = _Utils.getRange(items, szBnd);
        }

        let scale = this.colorScale;
        if (scale) {
            scale.domain(items);
        }

        if ((xBnd && yBnd) || cBnd) {
            for (let i = 0; i < len; i++) {
                let item = items[i];
                if (item) {
                    let pos = this.getItemPos(item);
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
    }

    renderItem(e: wijmo.chart.IRenderEngine, item: any, x: number, y: number) {
        if (wijmo.isNumber(x) && wijmo.isNumber(y)) {
            let pt = this.map.convert(new wijmo.Point(x, y));
            if (isFinite(pt.x) && isFinite(pt.y)) {
                let sz = this.symbolSize;
                if (this._szRange) {
                    let val = this._szBnd.getValue(item);
                    val = Math.sqrt((val - this._szRange.min) / this._szRange.range);
                    sz = this.symbolMinSize + (this.symbolMaxSize - this.symbolMinSize) * val;
                }

                if (isFinite(sz)) {
                    let el = e.drawEllipse(pt.x, pt.y, 0.5 * sz, 0.5 * sz);
                    el.setAttribute('vector-effect', 'non-scaling-stroke');

                    let id = this.createId();
                    this.setId(el, id);
                    this._elMap[id] = el;
                }
            }
        }
    }

    getItemById(id: string) {
        let items = this.itemsSource;
        if (items) {
            let el = this._elMap[id];
            if (el) {
                let i = parseInt(id.split('_')[1]);
                if (wijmo.isNumber(i) && i < items.length) {
                    return items[i];
                }
            }
        }
        return null;
    }

    /**
     * Gets the layer bounds in geo coordinates.
     */
    getGeoBBox(): wijmo.Rect {
        let items = this.itemsSource;
        let len = items ? items.length : 0;

        if (this._hasBindings) {
            let xmin = NaN, xmax = NaN, ymin = NaN, ymax = NaN;

            for (let i = 0; i < len; i++) {
                let item = items[i];
                if (item) {
                    let pos = this.getItemPos(item);
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
    }

    private getItemPos(item: any): wijmo.Point {
        let xBnd = this._xBnd;
        let yBnd = this._yBnd;
        let cBnd = this._cBnd;

        if (cBnd) {
            let xy: string = cBnd.getValue(item);
            if (xy) {
                let vals = xy.split(',');
                if (vals && vals.length >= 2) {
                    let x = parseFloat(vals[0]);
                    let y = parseFloat(vals[1]);

                    if (isFinite(x) && isFinite(y)) {
                        return new wijmo.Point(x, y);
                    }
                }
            }

        } else {
            let x = xBnd.getValue(item);
            let y = yBnd.getValue(item);

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
    }

    private setId(el: SVGElement, id: string) {
        if (el && id) {
            el.setAttribute('wj-map:id', id);
        }
    }

    private createId() {
        return this._prefix + this._index.toString();
    }

    private parseBindings() {
        let binding = this.binding;

        this._xBnd = this._yBnd = this._szBnd = null;
        this._hasBindings = false;

        if (binding) {
            let binds = binding.split(',');
            if (binds.length == 1) {
                this._cBnd = new wijmo.Binding(binds[0].trim());
                this._hasBindings = true;
            } else if (binds.length >= 2) {
                this._xBnd = new wijmo.Binding(binds[0].trim());
                this._yBnd = new wijmo.Binding(binds[1].trim());
                this._hasBindings = true;
                if (binds.length >= 3) {
                    this._szBnd = new wijmo.Binding(binds[2].trim());
                }
            }
        }
    }
}
    }
    


    module wijmo.chart.map {
    /*! Type definitions for non-npm package geojson 7946.0
Project: https://geojson.org/
Definitions by: Jacob Bruun <https://github.com/cobster>
                Arne Schubert <https://github.com/atd-schubert>
                Jeff Jacobson <https://github.com/JeffJacobson>
                Ilia Choly <https://github.com/icholy>
                Dan Vanderkam <https://github.com/danvk>
Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
 
This project is licensed under the MIT license.
Copyrights are respective of each contributor listed at the beginning of each definition file.
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

export module GeoJSON {
    /**
     * The valid values for the "type" property of GeoJSON geometry objects.
     * https://tools.ietf.org/html/rfc7946#section-1.4
     */
    export type GeoJsonGeometryTypes = Geometry['type'];

    /**
     * The value values for the "type" property of GeoJSON Objects.
     * https://tools.ietf.org/html/rfc7946#section-1.4
     */
    export type GeoJsonTypes = GeoJSON['type'];

    /**
     * Bounding box
     * https://tools.ietf.org/html/rfc7946#section-5
     */
    export type BBox = [number, number, number, number] | [number, number, number, number, number, number];

    /**
     * A Position is an array of coordinates.
     * https://tools.ietf.org/html/rfc7946#section-3.1.1
     * Array should contain between two and three elements.
     * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
     * but the current specification only allows X, Y, and (optionally) Z to be defined.
     */
    export type Position = number[]; // [number, number] | [number, number, number];

    /**
     * The base GeoJSON object.
     * https://tools.ietf.org/html/rfc7946#section-3
     * The GeoJSON specification also allows foreign members
     * (https://tools.ietf.org/html/rfc7946#section-6.1)
     * Developers should use "&" type in TypeScript or extend the interface
     * to add these foreign members.
     */
    export interface GeoJsonObject {
        // Don't include foreign members directly into this type def.
        // in order to preserve type safety.
        // [key: string]: any;
        /**
         * Specifies the type of GeoJSON object.
         */
        type: GeoJsonTypes;
        /**
         * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
         * The value of the bbox member is an array of length 2*n where n is the number of dimensions
         * represented in the contained geometries, with all axes of the most southwesterly point
         * followed by all axes of the more northeasterly point.
         * The axes order of a bbox follows the axes order of geometries.
         * https://tools.ietf.org/html/rfc7946#section-5
         */
        bbox?: BBox;
    }

    /**
     * Union of GeoJSON objects.
     */
    export type GeoJSON = Geometry | Feature | FeatureCollection;

    /**
     * Geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3
     */
    export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;
    export type GeometryObject = Geometry;

    /**
     * Point geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.2
     */
    export interface Point extends GeoJsonObject {
        type: "Point";
        coordinates: Position;
    }

    /**
     * MultiPoint geometry object.
     *  https://tools.ietf.org/html/rfc7946#section-3.1.3
     */
    export interface MultiPoint extends GeoJsonObject {
        type: "MultiPoint";
        coordinates: Position[];
    }

    /**
     * LineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.4
     */
    export interface LineString extends GeoJsonObject {
        type: "LineString";
        coordinates: Position[];
    }

    /**
     * MultiLineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.5
     */
    export interface MultiLineString extends GeoJsonObject {
        type: "MultiLineString";
        coordinates: Position[][];
    }

    /**
     * Polygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.6
     */
    export interface Polygon extends GeoJsonObject {
        type: "Polygon";
        coordinates: Position[][];
    }

    /**
     * MultiPolygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.7
     */
    export interface MultiPolygon extends GeoJsonObject {
        type: "MultiPolygon";
        coordinates: Position[][][];
    }

    /**
     * Geometry Collection
     * https://tools.ietf.org/html/rfc7946#section-3.1.8
     */
    export interface GeometryCollection extends GeoJsonObject {
        type: "GeometryCollection";
        geometries: Geometry[];
    }

    export type GeoJsonProperties = { [name: string]: any; } | null;

    /**
     * A feature object which contains a geometry and associated properties.
     * https://tools.ietf.org/html/rfc7946#section-3.2
     */
    export interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "Feature";
        /**
         * The feature's geometry
         */
        geometry: G;
        /**
         * A value that uniquely identifies this feature in a
         * https://tools.ietf.org/html/rfc7946#section-3.2.
         */
        id?: string | number;
        /**
         * Properties associated with this feature.
         */
        properties: P;
    }

    /**
     * A collection of feature objects.
     *  https://tools.ietf.org/html/rfc7946#section-3.3
     */
    export interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "FeatureCollection";
        features: Array<Feature<G, P>>;
    }
}
    }
    


    module wijmo.chart.map {
    






'use strict';

export class _GeoJsonRender {
    private _map = {};
    private _index = 0;

    prefix = '_';
    converter: _IConverter;
    hasPoints = false;
    symbolSize = 5;

    convert(pt: wijmo.Point): wijmo.Point {
        if (this.converter) {
            pt = this.converter.convert(pt);
        }
        return pt;
    }

    render(engine: wijmo.chart.IRenderEngine, geoJson: GeoJSON.GeoJSON, itemFormatter: (e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void = null) {
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
                        for (let i = 0; i < geoJson.features.length; i++) {
                            this.renderFeature(engine, geoJson.features[i], itemFormatter);
                        }
                    }
                    break;
            }
        }
    }

    renderFeature(engine: wijmo.chart.IRenderEngine, f: GeoJSON.Feature<GeoJSON.Geometry, { [name: string]: any; }>, itemFormatter: (e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void = null) {
        if (f && f.geometry) {
            if (itemFormatter) {
                itemFormatter(engine, f);
            }
            let id = this.createId();
            this.renderGeometry(engine, f.geometry, id);
            this._map[id] = f;
            this._index++;

        }
    }

    renderGeometry(engine: wijmo.chart.IRenderEngine, g: GeoJSON.Geometry, id: string = null) {
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
                        for (let i = 0; i < g.geometries.length; i++) {
                            this.renderGeometry(engine, g.geometries[i], id);
                        }
                    }
                    break;
            }
        }
    }

    renderPoint(engine: wijmo.chart.IRenderEngine, point: GeoJSON.Point, id: string = null) {
        if (point && point.coordinates && point.coordinates.length >= 2) {
            let pt = new wijmo.Point(point.coordinates[0], point.coordinates[1]);
            pt = this.convert(pt);
            let sz = (<_SvgMapRenderEngine>engine).scale * this.symbolSize;
            let el = <SVGElement>engine.drawEllipse(pt.x, pt.y, sz, sz);
            el.setAttribute('vector-effect', 'non-scaling-stroke');
            this.setAttribute(el, id);
        }
    }

    renderMultiPoint(engine: wijmo.chart.IRenderEngine, multiPoint: GeoJSON.MultiPoint, id: string = null) {
        if (multiPoint && multiPoint.coordinates) {
            let coords = multiPoint.coordinates;
            let len = multiPoint.coordinates.length;
            for (let i = 0; i < len; i++) {
                let pt = new wijmo.Point(coords[i][0], coords[i][1]);
                pt = this.convert(pt);
                let sz = (<_SvgMapRenderEngine>engine).scale * this.symbolSize;
                let el = <SVGElement>engine.drawEllipse(pt.x, pt.y, sz, sz);
                this.setAttribute(el, id);
            }
        }
    }

    renderLineString(engine: wijmo.chart.IRenderEngine, lineString: GeoJSON.LineString, id: string = null) {
        if (lineString && lineString.coordinates) {
            let coords = lineString.coordinates;
            let len = lineString.coordinates.length;
            let xs: Array<number> = [];
            let ys: Array<number> = [];

            for (let i = 0; i < len; i++) {
                let pt = new wijmo.Point(coords[i][0], coords[i][1]);
                pt = this.convert(pt);
                xs.push(pt.x);
                ys.push(pt.y);
            }

            let el = <SVGElement>engine.drawLines(xs, ys);
            this.setAttribute(el, id);
        }
    }

    renderMultiLineString(engine: wijmo.chart.IRenderEngine, multiLineString: GeoJSON.MultiLineString, id: string = null) {
        if (multiLineString && multiLineString.coordinates) {
            let coords = multiLineString.coordinates;
            let len = coords.length;
            for (let i = 0; i < len; i++) {
                let pts = coords[i];
                let xs: Array<number> = [];
                let ys: Array<number> = [];

                for (let j = 0; j < pts.length; j++) {
                    let pt = new wijmo.Point(pts[j][0], pts[j][1]);
                    pt = this.convert(pt);
                    xs.push(pt.x);
                    ys.push(pt.y);
                }

                let el = engine.drawLines(xs, ys);
                this.setAttribute(el, id);
            }
        }
    }

    renderMultiPolygon(e: wijmo.chart.IRenderEngine, o: GeoJSON.MultiPolygon, id: string = null) {
        if (o && o.coordinates) {
            let mcoords = o.coordinates;
            let mlen = mcoords.length;
            let e2 = <IMapRenderEngine>e;

            for (let i = 0; i < mlen; i++) {
                let coords = mcoords[i];
                let len = coords.length;

                let pt = [];

                for (let i = 0; i < 1; i++) {
                    let pts = coords[i];

                    let pt0 = []

                    for (let j = 0; j < pts.length; j++) {
                        let pt = new wijmo.Point(pts[j][0], pts[j][1]);
                        pt = this.convert(pt);

                        pt0.push(pt.x);
                        pt0.push(pt.y);
                    }

                    pt.push(pt0);
                }
                let el = e2.drawPolygon2(null, pt);
                this.setAttribute(el, id);
            }
        }
    }

    renderPolygon(e: wijmo.chart.IRenderEngine, o: GeoJSON.Polygon, id: string = null) {
        if (o && o.coordinates) {
            let coords = o.coordinates;
            let len = coords.length;
            let e2 = <IMapRenderEngine>e;

            let pt = [];

            for (let i = 0; i < len; i++) {
                let pts = coords[i];

                let pt0 = []

                for (let j = 0; j < pts.length; j++) {
                    let pt = new wijmo.Point(pts[j][0], pts[j][1]);
                    pt = this.convert(pt);

                    pt0.push(pt.x);
                    pt0.push(pt.y);
                }

                pt.push(pt0);
            }
            let el = e2.drawPolygon2(null, pt);
            this.setAttribute(el, id);
        }

    }

    getFeatureById(id: string): GeoJSON.Feature {
        return this._map[id];
    }

    getAllFeatures(geoJson: GeoJSON.GeoJSON): any[] {
        let features = [];

        if (geoJson) {
            switch (geoJson.type) {
                case "Feature":
                    features.push(geoJson);
                    break;
                case "FeatureCollection":
                    if (geoJson.features) {
                        for (let i = 0; i < geoJson.features.length; i++) {
                            features.push(geoJson.features[i]);
                        }
                    }
                    break;
            }
        }

        return features;
    }

    getBBox(geoJson: GeoJSON.GeoJSON): wijmo.Rect {
        let rect: wijmo.Rect = null;
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
                        for (let i = 0; i < geoJson.features.length; i++) {
                            //this.renderFeature(engine, geoJson.features[i], itemFormatter);
                            let nr = this.getGeometryBBox(geoJson.features[i].geometry, rect);
                            if (nr) {
                                rect = nr;
                            }
                        }
                    }
                    break;
            }
        }
        return rect;
    }

    getGeometryBBox(g: GeoJSON.Geometry, rect0?: wijmo.Rect): wijmo.Rect {
        let rect: wijmo.Rect = null;
        if (g) {
            switch (g.type) {
                case "Point":
                case "MultiPoint":
                case "LineString":
                case "MultiLineString":
                case "Polygon":
                case "MultiPolygon":
                    {
                        let gc = <any>g.coordinates;
                        let coords = this.flat(gc, 10); //gc.flat(4);
                        rect = this.getRect(coords, rect0);
                    }
                    break;
                case "GeometryCollection":
                    if (g.geometries) {
                        for (let i = 0; i < g.geometries.length; i++) {
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
    }

    getRect(coords: number[], rect0?: wijmo.Rect): wijmo.Rect {
        let rect: wijmo.Rect = null;
        if (coords) {
            let xmin = NaN, xmax = NaN, ymin = NaN, ymax = NaN;
            if (rect0) {
                xmin = rect0.left;
                xmax = rect0.right;
                ymin = rect0.top;
                ymax = rect0.bottom;
            }
            let len = coords.length / 2;
            for (let i = 0; i < len; i++) {
                let x = coords[2 * i];
                let y = coords[2 * i + 1];
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
    }

    private setAttribute(el: SVGElement, id: string) {
        if (el && id) {
            el.setAttribute('wj-map:id', id);
        }
    }

    private createId() {
        return this.prefix + this._index.toString();
    }

    private flat(array: any, depth: number): any[] {
        if (array.flat) {
            return array.flat(depth);
        } else {
            const stack = [...array];
            const res = [];
            while (stack.length) {
                const next = stack.pop();
                if (Array.isArray(next)) {
                    stack.push(...next);
                } else {
                    res.push(next);
                }
            }
            return res.reverse();
        }
    }
}
    }
    


    module wijmo.chart.map {
    








'use strict';

/**
 * Represents a map layer with geographical data.
 */
export class GeoMapLayer extends MapLayerBase {
    private _render = new _GeoJsonRender();
    private _g: SVGGElement;
    private _ifmt: (e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void;
    private _symbolSize = 5;

    /**
     * Initializes a new instance of the {@link GeoMapLayer} class.
     * 
     * @param options A JavaScript object containing initialization data
     * for the layer.
     */
    constructor(options?: any) {
        super();
        this.style = { stroke: 'gray', fill: 'transparent', strokeWidth: 0.5 };
        if (options) {
            this.initialize(options);
        }
    }

    /** Gets or sets a item formatter for GeoJSON feature. */
    get itemFormatter(): (e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void {
        return this._ifmt;
    }
    set itemFormatter(value: (e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void) {
        if (this._ifmt != value) {
            this._ifmt = <(e: wijmo.chart.IRenderEngine, f: GeoJSON.Feature) => void>wijmo.asFunction(value, true);
            this._clearCache();
            this.invalidate();
        }
    }

    /**
     * Gets all GeoJSON features on the layer.
     */
    getAllFeatures(): any[] {
        return this._render.getAllFeatures(this.itemsSource);
    }

    /**
     * Renders the layer.
     * 
     * @param e Render engine.
     * @param t Svg transformation.
     * @param group SVG group element for the layer.
     */
    render(e: wijmo.chart.IRenderEngine, t: SVGTransform, group: SVGGElement): any {
        if (this._render.hasPoints) {
            this._clearCache();
        }
        let g = this._g;

        if (!g) {
            g = e.startGroup();
            this._render.symbolSize = this.symbolSize;
            this._render.converter = <_IConverter>this.map._proj;

            let scale = this.colorScale;
            if (scale) {
                scale.domain(this.getAllFeatures());
            }

            this._applyStyle(e);
            this._render.prefix = this.map.layers.indexOf(this).toString() + '_';

            if (scale) {
                this._render.render(e, this.itemsSource, (e, f) => {
                    e.fill = scale.convert(scale.getValue(f));
                });
            } else {
                this._render.render(e, this.itemsSource, this.itemFormatter);
            }

            e.endGroup();

            this._g = g;

        } else {
            group.appendChild(g);
        }

        if (g.transform.baseVal.numberOfItems == 0) {
            g.transform.baseVal.appendItem(t);
        } else {
            g.transform.baseVal.replaceItem(t, 0);
        }

        return g;
    }

    /**
     * Gets the layer bounds in geo coordinates.
     */
    getGeoBBox(f?: GeoJSON.GeoJSON): wijmo.Rect {
        if (f) {
            return this._render.getBBox(f);
        } else {
            return this._render.getBBox(this.itemsSource);
        }
    }

    /**
     * Gets or sets the symbol size for rendering GeoJSON points/multi-points.
     */
    get symbolSize(): number {
        return this._symbolSize;
    }
    set symbolSize(value: number) {
        if (this._symbolSize != value) {
            this._symbolSize = wijmo.asNumber(value);
            this.invalidate();
        }
    }

    _clearCache() {
        this._g = null;
    }

    _getFeatureById(id: string): GeoJSON.Feature {
        return this._render.getFeatureById(id);
    }
}
    }
    


    module wijmo.chart.map {
    







'use strict';

export class GeoGridLayer extends MapLayerBase {
    constructor() {
        super();
        this.style = { stroke: 'lightgrey', strokeWidth: 0.5, fill: 'lightgrey' };
    }

    render(e: wijmo.chart.IRenderEngine, t: SVGTransform, group: SVGGElement) {
        let g = e.startGroup('wj-flexmap-geogrid');

        let map = this.map;
        let r = this.map._mapRect;
        let cls = 'wj-label';

        this._applyStyle(e);

        for (let x = -180; x <= 180; x += 30) {
            let pt1 = map.convert(new wijmo.Point(x, -85));
            let pt2 = map.convert(new wijmo.Point(x, 85));

            if (this.isValid(pt1) && this.isValid(pt2)) {
                let s = x.toString();
                let sz = e.measureString(s, cls);
                e.drawString(s, new wijmo.Point(pt1.x - 0.5*sz.width, r.top + sz.height), cls);
                let el = e.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
                //el.setAttribute('vector-effect', 'non-scaling-stroke');
            }
        }

        let x = r.left;

        for (let y = -80; y <= 80; y += 20) {
            let pt1 = map.convert(new wijmo.Point(-180, y));
            let pt2 = map.convert(new wijmo.Point(180, y));

            if (this.isValid(pt1) && this.isValid(pt2)) {
                let s = x.toString();
                let sz = e.measureString(s, cls);
                e.drawString(y.toString(), new wijmo.Point(x, pt1.y + 0.5*sz.height), cls);
                let el = e.drawLine(pt1.x, pt1.y, pt2.x, pt2.y);
                //el.setAttribute('vector-effect', 'non-scaling-stroke');
            }
        }

        e.endGroup();

        return g;
    }

    private isValid(pt: wijmo.Point): boolean {
        return isFinite(pt.x) && isFinite(pt.y);
    }
}

    }
    


    module wijmo.chart.map {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.map', wijmo.chart.map);













    }
    