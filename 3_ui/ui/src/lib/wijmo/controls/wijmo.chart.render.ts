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


    module wijmo.chart.render {
    




'use strict';

//Render to canvas.
export class _CanvasRenderEngine implements wijmo.chart.IRenderEngine {
    private _element: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _svgEngine: wijmo.chart._SvgRenderEngine;
    private _fill: string;
    private _stroke: string;
    private _textFill: string;
    private _strokeWidth: number = 1;
    private _fontSize: string = null;
    private _fontFamily: string = null;

    private _canvasRect;
    private _canvasDefaultFont;

    private _applyCSSStyles: boolean;
    private _cssPriority: boolean = true;
    private _readOnly: boolean = false;

    constructor(element: HTMLElement, applyCSSStyles = false) {
        var self = this;

        self._element = element;
        self._canvas = document.createElement('canvas');
        self._svgEngine = new wijmo.chart._SvgRenderEngine(element);
        self._element.appendChild(self._canvas);
        self._applyCSSStyles = applyCSSStyles;
    }

    beginRender() {
        var self = this,
            svg = self._svgEngine.element,
            ele = <Element>self._element,
            style;

        if (self._applyCSSStyles) {
            self._svgEngine.beginRender();
            ele = svg;
        }
        self._element.appendChild(svg);
        //clear and initialize _canvasRect, _canvasDefaultFont
        self._canvasRect = {};
        style = window.getComputedStyle(ele);
        self._canvasDefaultFont = {
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            textFill: style.color
        };
    }

    endRender() {
        if (this._applyCSSStyles) {
            this._svgEngine.endRender();
        }
        this._svgEngine.element.parentNode.removeChild(this._svgEngine.element);
    }

    setViewportSize(w: number, h: number) {
        var self = this,
            canvas = self._canvas,
            ctx = canvas.getContext('2d'),
            f = self.fill,
            color, stroke;

        if (self._applyCSSStyles) {
            self._svgEngine.setViewportSize(w, h);
        }
        canvas.width = w;
        canvas.height = h;
        /*color = window.getComputedStyle(self._element).backgroundColor;
        stroke = self.stroke;
        if (color) {
            self.stroke = null;
            self.fill = color;
            self.drawRect(0, 0, w, h);
            self.fill = f;
            self.stroke = stroke;
        }*/
    }

    get element(): Element {
        return this._canvas;
    }

    get fill(): string {
        return this._fill
    }
    set fill(value: string) {
        this._svgEngine.fill = value;
        this._fill = value;
    }

    get fontSize(): string {
        return this._fontSize;
    }
    set fontSize(value: string) {
        this._svgEngine.fontSize = value;
        var val = (value == null || isNaN(<any>value)) ? value : value + 'px';
        this._fontSize = val;
    }

    get fontFamily(): string {
        return this._fontFamily;
    }
    set fontFamily(value: string) {
        this._svgEngine.fontFamily = value;
        this._fontFamily = value;
    }

    get stroke(): string {
        return this._stroke;
    }
    set stroke(value: string) {
        this._svgEngine.stroke = value;
        this._stroke = value;
    }

    get strokeWidth(): number {
        return this._strokeWidth;
    }
    set strokeWidth(value: number) {
        this._svgEngine.strokeWidth = value;
        this._strokeWidth = value;
    }

    get textFill(): string {
        return this._textFill;
    }
    set textFill(value: string) {
        this._svgEngine.textFill = value;
        this._textFill = value;
    }

    get cssPriority(): boolean {
        return this._cssPriority;
    }
    set cssPriority(value: boolean) {
        this._svgEngine.cssPriority = value;
        this._cssPriority = value;
    }

    get readOnly(): boolean {
        return this._readOnly;
    }
    set readOnly(value: boolean) {
        this._readOnly = value;
    }

    addClipRect(clipRect: wijmo.Rect, id: string) {
        if (clipRect && id) {
            if (this._applyCSSStyles) {
                this._svgEngine.addClipRect(clipRect, id);
            }
            this._canvasRect[id] = clipRect.clone();
        }
    }

    drawEllipse(cx: number, cy: number, rx: number, ry: number, className?: string, style?: any) {
        if (this.readOnly) {
            return;
        }
        var el, ctx = <any>this._canvas.getContext('2d');

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawEllipse(cx, cy, rx, ry, className, style);
        }

        ctx.save();
        ctx.beginPath();
        if (ctx.ellipse) {
            ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        } else {
            ctx.translate(cx, cy);
            ctx.scale(1, ry / rx);
            ctx.translate(-cx, -cy);
            ctx.arc(cx, cy, rx, 0, 2 * Math.PI);
            ctx.scale(1, 1);
        }
        this._applyCanvasStyles(el, style, className, true);
        ctx.restore();
        return el;
    }

    drawRect(x: number, y: number, w: number, h: number, className?: string, style?: any, clipPath?: string) {
        if (this.readOnly) {
            return;
        }

        var el, ctx = this._canvas.getContext('2d');

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawRect(x, y, w, h, className, style, clipPath);
        }
        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        this._applyCanvasStyles(el, style, className, true);
        ctx.restore();
        return el;
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, className?: string, style?: any) {
        if (this.readOnly) {
            return;
        }

        var el,
            ctx = this._canvas.getContext('2d');

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawLine(x1, y1, x2, y2, className, style);
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        this._applyCanvasStyles(el, style, className);
        ctx.restore();
        return el;
    }

    drawLines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?:number) {
        if (!xs || !ys || xs.length === 0 || ys.length === 0 || this.readOnly) {
            return;
        }

        var ctx = this._canvas.getContext('2d'),
            len = num? num : Math.min(xs.length, ys.length),
            el, i;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawLines([0, 1], [1, 0], className, style, clipPath);
        }
        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (i = 1; i < len; i++) {
            ctx.lineTo(xs[i], ys[i]);
        }
        this._applyCanvasStyles(el, style, className);
        ctx.restore();
        return el;
    }

    drawSplines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?:number) {
        if (!xs || !ys || xs.length === 0 || ys.length === 0 || this.readOnly) {
            return;
        }

        var ctx = this._canvas.getContext('2d'),
            spline = new wijmo.chart._Spline(xs, ys, num),
            s = spline.calculate(),
            sx = s.xs,
            sy = s.ys,
            len = Math.min(sx.length, sy.length),
            el, i;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawSplines([0, 1], [1, 0], className, style, clipPath);
        }
        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.moveTo(sx[0], sy[0]);
        for (i = 1; i < len; i++) {
            ctx.lineTo(sx[i], sy[i]);
        }
        this._applyCanvasStyles(el, style, className);
        ctx.restore();
        return el;
    }

    drawPolygon(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string) {
        if (!xs || !ys || xs.length === 0 || ys.length === 0 || this.readOnly) {
            return;
        }

        var ctx = this._canvas.getContext('2d'),
            len = Math.min(xs.length, ys.length),
            el, i;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawPolygon(xs, ys, className, style, clipPath);
        }
        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (i = 1; i < len; i++) {
            ctx.lineTo(xs[i], ys[i]);
        }
        ctx.closePath();
        this._applyCanvasStyles(el, style, className, true);
        ctx.restore();
        return el;
    }

    drawPieSegment(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number,
        className?: string, style?: any, clipPath?: string) {

        if (this.readOnly) {
            return;
        }

        var el,
            ctx = this._canvas.getContext('2d'),
            sta = startAngle,
            swa = startAngle + sweepAngle;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawPieSegment(cx, cy, r, startAngle, sweepAngle, className, style, clipPath);
        }
        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, sta, swa, false);
        ctx.lineTo(cx, cy);
        this._applyCanvasStyles(el, style, className, true);
        ctx.restore();
        return el;
    }

    drawDonutSegment(cx: number, cy: number, radius: number, innerRadius: number, startAngle: number, sweepAngle: number,
        className?: string, style?: any, clipPath?: string) {

        if (this.readOnly) {
            return;
        }

        var ctx = this._canvas.getContext('2d'),
            sta = startAngle,
            swa = startAngle + sweepAngle,
            el, p1, p2;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawDonutSegment(cx, cy, radius, innerRadius, startAngle, sweepAngle, className, style, clipPath);
        }
        p1 = new wijmo.Point(cx, cy);
        p1.x += innerRadius * Math.cos(sta);
        p1.y += innerRadius * Math.sin(sta);

        p2 = new wijmo.Point(cx, cy);
        p2.x += innerRadius * Math.cos(swa);
        p2.y += innerRadius * Math.sin(swa);

        ctx.save();

        this._applyCanvasClip(ctx, clipPath);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.arc(cx, cy, radius, sta, swa, false);
        ctx.lineTo(p2.x, p2.y);
        ctx.arc(cx, cy, innerRadius, swa, sta, true);
        this._applyCanvasStyles(el, style, className, true);
        ctx.restore();
        return el;
    }

    drawString(s: string, pt: wijmo.Point, className?: string, style?: any) {
        if(this.readOnly) {
            return;
        }

        var el, ctx = this._canvas.getContext('2d');

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawString(s, pt, className, style);
        }
        ctx.save();
        ctx.textBaseline = 'bottom';
        this._applyCanvasStyles(el, style, className, true, true);
        ctx.fillText(s, pt.x, pt.y);
        ctx.restore();
        return el;
    }

    drawStringRotated(s: string, pt: wijmo.Point, center: wijmo.Point, angle: number, className?: string, style?: any) {
        if(this.readOnly) {
            return;
        }

        var el,
            ctx = this._canvas.getContext('2d'),
            metric = ctx.measureText(s);

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawStringRotated(s, pt, center, angle, className, style);
        }
        ctx.save();
        ctx.textBaseline = 'bottom';
        ctx.translate(center.x, center.y);
        ctx.rotate(Math.PI / 180 * angle);
        ctx.translate(-center.x, -center.y);
        this._applyCanvasStyles(el, style, className, true, true);
        ctx.fillText(s, pt.x, pt.y);
        ctx.restore();
        return el;
    }

    measureString(s: string, className?: string, groupName?: string, style?: any): wijmo.Size {
        var ctx = ctx = this._canvas.getContext('2d'),
            width;

        if (this._applyCSSStyles) {
            return this._svgEngine.measureString(s, className, groupName, style);
        }
        this._applyCanvasStyles(null, null, className, true, true);
        width = ctx.measureText(s).width;
        return new wijmo.Size(width, parseInt(ctx.font) * 1.5);
    }

    startGroup(className?: string, clipPath?: string, createTransform: boolean = false) {
        var el,
            ctx = this._canvas.getContext('2d');

        if (this._applyCSSStyles) {
            el = this._svgEngine.startGroup(className, clipPath, createTransform);
        }
        ctx.save();
        this._applyCanvasClip(ctx, clipPath);
        return el;
    }

    endGroup() {
        if (this._applyCSSStyles) {
            this._svgEngine.endGroup();
        }
        this._canvas.getContext('2d').restore();
    }

    drawImage(imageHref: string, x: number, y: number, w: number, h: number) {
        if(this.readOnly) {
            return;
        }

        var el,
            ctx = this._canvas.getContext('2d'),
            img = new Image;

        if (this._applyCSSStyles) {
            el = this._svgEngine.drawImage(imageHref, x, y, w, h);
        }
        img.onload = function () {
            ctx.drawImage(img, x, y, w, h);
        };
        img.src = imageHref;
        return el;
    }

    private _applyCanvasClip = function (ctx, clipID) {
        var clipRect = this._canvasRect[clipID];

        if (!clipRect) {
            return;
        }
        ctx.beginPath();
        ctx.rect(clipRect.left, clipRect.top, clipRect.width, clipRect.height);
        ctx.clip();
        ctx.closePath();
    };

    private _getOpacityColor(color, opacity?) {
        var gcColor = new wijmo.Color(color);

        if (color.indexOf('url') > -1) {
            return this.fill;
        } else if (color.indexOf('-') > -1) {
            this.fill = color;
            return color;
        }
        if (opacity != null && gcColor.a === 1) {
            gcColor.a = isNaN(opacity) ? 1 : Number(opacity);
        }
        return gcColor.toString();
    }

    private _applyCanvasStyles = function (ele, style, className?, enableFill?, enableFont?) {
        var self = this,
            ctx = self._canvas.getContext('2d'),
            font, eleStyles, box,
            stroke = self.stroke,
            fill = self.fill,
            strokeWidth = self.strokeWidth;

        if (style && style.stroke !== undefined) {
            stroke = style.stroke;
        }
        if (style && style.fill !== undefined) {
            fill = self._getOpacityColor(style.fill, style['fill-opacity']);
        }
        //style can be set in tag name, so always get element style.
        if (ele) {
            eleStyles = window.getComputedStyle(ele);
            box = ele.getBBox();
        }
        if (enableFont) {
            if (eleStyles) {
                ctx.fillStyle = eleStyles.fill;
                font = eleStyles.fontStyle + ' ' + eleStyles.fontWeight +  ' ' + eleStyles.fontSize + ' ' + eleStyles.fontFamily;
                ctx.font = font;
                // ?? not sure that it's correct and why it was added
                //if (ctx.font.replace(/\"/g, "'") !== font.replace(/\"/g, "'")) {
                //    font = eleStyles.fontStyle + ' ' + eleStyles.fontSize + ' ' + (ctx.font.split(' ')[1] || 'sans-serif');
                //    ctx.font = font;
                //}
            } else if (self.fontSize) {
                ctx.fillStyle = self.textFill;
                ctx.font = self.fontSize + ' ' + (self.fontFamily || 'sans-serif');
            } else if (self._canvasDefaultFont) {
                ctx.fillStyle = self._canvasDefaultFont.textFill;
                font = self._canvasDefaultFont.fontSize + ' ' + self._canvasDefaultFont.fontFamily;
                ctx.font = font;
                if (ctx.font.replace(/\"/g, "'") !== font.replace(/\"/g, "'")) {
                    font = self._canvasDefaultFont.fontSize + ' ' + (ctx.font.split(' ')[1] || 'sans-serif');
                    ctx.font = font;
                }
            }
        } else {
            if (eleStyles) {
                stroke = (eleStyles.stroke && eleStyles.stroke !== 'none') ? eleStyles.stroke : stroke;
                fill = (eleStyles.fill && eleStyles.fill !== 'none') ? self._getOpacityColor(eleStyles.fill, eleStyles['fill-opacity']) : fill;
                strokeWidth = eleStyles.strokeWidth ? eleStyles.strokeWidth : strokeWidth;
            }
            if (stroke !== 'none' && stroke != null) {
                this._applyColor('strokeStyle', stroke, box);
                ctx.lineWidth = +strokeWidth.replace(/px/g, '');
                ctx.stroke();
            }
            if (enableFill && fill != null && fill !== 'transparent' && fill !== 'none') {
                this._applyColor('fillStyle', fill, box);
                ctx.fill();
            }
        }
    }

    private _applyColor(key: string, val: string, rect) {
        let color = _GradientColorUtil.tryParse(val),
            ctx = this._canvas.getContext('2d');

        if (color == null) {
            return;
        }
        if (wijmo.isString(color) || rect == null) {
            ctx[key] = color;
        } else {
            let gradient, width, height;
            if (color.x1 != null) {
                if (color.relative) {
                    gradient = ctx.createLinearGradient(rect.x + color.x1 * rect.width, rect.y + color.y1 * rect.height,
                        rect.x + color.x2 * rect.width, rect.y + color.y2 * rect.height);
                } else {
                    gradient = ctx.createLinearGradient(color.x1, color.y1, color.x2, color.y2);
                }
            } else if (color.r != null) {
                if (color.relative) {
                    let cx = rect.x + color.cx * rect.width,
                        cy = rect.y + color.cy * rect.height,
                        w = color.r * rect.width,
                        h = color.r * rect.height,
                        ratio = h / w,
                        fx = rect.x + (color.fx == null ? color.cx : color.fx) * rect.width,
                        fy = rect.y + (color.fy == null ? color.cy : color.fy) * rect.height,
                        fw = (color.fr == null ? 0 : color.fr) * rect.width,
                        fh = (color.fr == null ? 0 : color.fr) * rect.height,
                        fmin = Math.min(fw, fh);

                    gradient = ctx.createRadialGradient(fx, fy / ratio, fmin, cx, cy / ratio, w);
                    ctx.setTransform(1, 0, 0, ratio, 0, 0);

                } else {
                    gradient = ctx.createRadialGradient(color.fx == null ? color.cx : color.fx, color.fy == null ? color.cy : color.fy, color.fr || 0,
                        color.cx, color.cy, color.r);
                }
            }
            if (color.colors && color.colors.length > 0 && gradient != null) {
                color.colors.forEach(c => {
                    let color = new wijmo.Color('#000000');
                    if (c.color != null) {
                        color = c.color;
                    }
                    if (c.opacity != null) {
                        color.a = c.opacity;
                    }
                    gradient.addColorStop(c.offset, color.toString());
                });
            }
            ctx[key] = gradient;
        }
    }
}

//Utilities for gradient color.
class _GradientColorUtil {

    static parsedColor = {};

    static tryParse(color: string) {
        if (_GradientColorUtil.parsedColor[color]) {
            return _GradientColorUtil.parsedColor[color];
        }
        if (color == null || color.indexOf('-') === -1) {
            return color;
        }

        var arr = color.replace(/\s+/g, '').split(/\-/g);
        var type = arr[0][0];
        var relative = false;
        var gc;
        //Suppose string with '-' is gradient color.
        var coords = arr[0].match(/\(\S+\)/)[0].replace(/[\(\\)]/g, '').split(/\,/g);
        if (type === 'l' || type === 'L') {
            gc = <_ILinearGradientColor>{
                x1: '0',
                y1: '0',
                x2: '0',
                y2: '0',
                colors: []
            };
            if (type === 'l') {
                relative = true;
            }
            ['x1', 'y1', 'x2', 'y2'].forEach((v, i) => {
                if (coords[i] != null) {
                    gc[v] = +coords[i];
                }
            });
        } else if (type === 'r' || type === 'R') {
            gc = <_IRadialGradientColor>{
                cx: '0',
                cy: '0',
                r: '0',
                colors: []
            }
            if (type === 'r') {
                relative = true;
            }
            ['cx', 'cy', 'r', 'fx', 'fy', 'fr'].forEach((v, i) => {
                if (coords[i] != null && coords[i] !== '') {
                    gc[v] = +coords[i];
                }
            });
        }
        gc.relative = relative;

        _GradientColorUtil.parsedColor[color] = gc;
        var len = arr.length - 1;
        arr.forEach((v, i) => {
            if (v.indexOf(')') > -1) {
                v = v.match(/\)\S+/)[0].replace(')', '')
            }
            var c = v.split(':');
            var col = <_IGradientColor>{
                color: new wijmo.Color('#000000')
            };
            if (c[0] != null) {
                col.color = wijmo.Color.fromString(c[0]);
            }
            if (c[1] != null) {
                col.offset = +c[1];
            } else {
                col.offset = i / len;
            }
            if (c[2] != null) {
                col.opacity = +c[2];
            }
            gc.colors.push(col);
        });
        return gc;
    }
}

//Represents the linear gradient color.
interface _ILinearGradientColor {
    x1: string;
    y1: string;
    x2: string;
    y2: string;
    relative: boolean;
    colors: _IGradientColor[];
}

//Represents the radial gradient color.
interface _IRadialGradientColor {
    cx: string;
    cy: string;
    r: string;
    fx?: string;
    fy?: string;
    fr?: string;
    relative: boolean;
    colors: _IGradientColor[];
}

//Represents the gradient color.
interface _IGradientColor {
    color: wijmo.Color;
    offset: number;
    opacity?: number;
}

if (wijmo.chart.FlexChartBase && wijmo.chart.FlexChartBase.prototype && wijmo.chart.FlexChartBase.prototype._exportToImage) {
    var _exportFn = wijmo.chart.FlexChartBase.prototype._exportToImage;

    wijmo.chart.FlexChartBase.prototype._exportToImage = function (extension, processDataURI) {
        if (extension === 'svg') {
            _exportFn.call(this, extension, processDataURI);
            return;
        }

        //fill background
        let bg = this._bgColor(this.hostElement);
        if (this._isTransparent(bg)) {
            bg = '#ffffff';
        }

        var canvasEngine = new _CanvasRenderEngine(this.hostElement, true), dataUrl, canvas;
        this._render(canvasEngine, false, bg);
        canvas = canvasEngine.element;
        dataUrl = canvas.toDataURL('image/' + extension);
        canvas.parentNode.removeChild(canvas);
        processDataURI.call(null, dataUrl);
        canvas = null;
        canvasEngine = null;
    }
}
    }
    


    module wijmo.chart.render {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.render', wijmo.chart.render);



    }
    