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


    module wijmo.chart {
    

"use strict";

export class _VolumeHelper {
    private _volumes: number[];
    private _xVals: number[];
    private _xDataMin: number;
    private _xDataMax: number;
    private _xDataType: wijmo.DataType;
    private _hasXs: boolean;
    private _calcData: any[];

    constructor(volumes: number[], xVals: number[], xDataMin: number, xDataMax: number, xDataType?: wijmo.DataType) {
        this._volumes = wijmo.asArray(volumes);
        this._xVals = wijmo.asArray(xVals);
        this._xDataMin = wijmo.asNumber(xDataMin, true, false);
        this._xDataMax = wijmo.asNumber(xDataMax, true, false);
        this._xDataType = wijmo.asEnum(xDataType, wijmo.DataType, true);
        this._calcData = [];

        // initialize
        this._init();
    }

    // converts the specified value from data to pixel coordinates
    // for volume based x-axis (customConvert)
    convert(x: number, min: number, max: number): number {
        var retval = undefined,
            len = this._calcData.length,
            i = -1;

        if (this._hasXs && this._xDataType === wijmo.DataType.Date) {
            // find directly
            i = this._xVals.indexOf(x);

            // loop through and attempt to find index
            if (i === -1) {
                for (var j = 0; j < this._xVals.length; j++) {
                    if (j < (this._xVals.length - 1) && this._xVals[j] <= x && x <= this._xVals[j + 1])  {
                        i = j;
                        break;
                    } else if (j === 0 && x <= this._xVals[j]) {
                        i = j;
                        break;
                    } else if (j === (this._xVals.length - 1) && this._xVals[j] <= x) {
                        i = j;
                        break;
                    }
                }
            }

            // last resort - force
            if (i === -1) {
                i = this._xVals.indexOf(Math.floor(x));
                i = wijmo.clamp(i, 0, len - 1);
            }
        } else if (this._hasXs) {
            i = this._xVals.indexOf(x);
            if (i === -1) {
                i = this._xVals.indexOf(Math.floor(x));
                i = wijmo.clamp(i, 0, len - 1);
            }
        } else {
            i = wijmo.clamp(Math.round(x), 0, len - 1);
        }

        if (0 <= i && i < len) {
            if (this._hasXs) {  // change range from something like 5-9 to 0-4
                x = _VolumeHelper.convertToRange(x, 0,(len - 1), this._xDataMin, this._xDataMax);
            }

            retval = this._calcData[i].value + ((x - i) * this._calcData[i].width) - (0.5 * this._calcData[i].width);

            // tranform to the actual data range
            min = this._getXVolume(min);
            max = this._getXVolume(max);
            retval = (retval - min) / (max - min);
        }

        return retval;
    }

    // converts the specified value from pixel to data coordinates
    // for volume based x-axis (customConvertBack)
    convertBack(x: number, min: number, max: number): number {
        var retval = undefined,
            len = this._calcData.length, idx = -1, i: number;

        // try to find correct index based on ranges (x1 = start & x2 = end)
        for (i = 0; i < len; i++) {
            if ((this._calcData[i].x1 <= x && x <= this._calcData[i].x2) ||
                (i === 0 && x <= this._calcData[i].x2) ||
                (i === (len - 1) && this._calcData[i].x1 <= x)) {
                idx = i;
                break;
            }
        }

        if (0 <= idx && idx < len) {
            retval = (x / this._calcData[idx].width) - (this._calcData[idx].value / this._calcData[idx].width) + .5 + i;

            if (this._hasXs) {  // change range from something like 0-4 to 5-9
                retval = _VolumeHelper.convertToRange(retval, this._xDataMin, this._xDataMax, 0,(len - 1));
            }
        }

        return retval;
    }

    // initialize volume data
    private _init(): void {
        // xVals, xDataMin, and xDataMax must all be set for _hasXs to be true
        this._hasXs = this._xVals !== null && this._xVals.length > 0;
        if (this._hasXs && !wijmo.isNumber(this._xDataMin)) {
            this._xDataMin = Math.min.apply(null, this._xVals);
        }
        if (this._hasXs && !wijmo.isNumber(this._xDataMax)) {
            this._xDataMax = Math.max.apply(null, this._xVals);
        }
        if (this._hasXs) {
            this._hasXs = wijmo.isNumber(this._xDataMin) && wijmo.isNumber(this._xDataMax);
        }
        if (this._hasXs && this._xDataType === wijmo.DataType.Date) {
            // try fill gaps for dates
            this._fillGaps();
        }

        // calculate total volume
        var totalVolume = 0, i = 0,
            len = this._volumes !== null && this._volumes.length > 0 ? this._volumes.length : 0;
        for (i = 0; i < len; i++) {
            totalVolume += this._volumes[i] || 0;
        }

        // calculate width and position (range = 0 to 1)
        var val: number, width: number, pos = 0;
        for (i = 0; i < len; i++) {
            width = (this._volumes[i] || 0) / totalVolume;
            val = pos + width;
            this._calcData.push({
                value: val,
                width: width,
                x1: pos,
                x2: val
            });
            pos = this._calcData[i].value;
        }
    }

    // for converting min/max
    private _getXVolume(x: number): number {
        var len = this._calcData.length, i = -1;

        if (this._hasXs) {
            i = this._xVals.indexOf(x);

            // loop through and attempt to find index
            for (var j = 0; j < this._xVals.length; j++) {
                if (j < (this._xVals.length - 1) && this._xVals[j] <= x && x <= this._xVals[j + 1]) {
                    i = j;
                    break;
                } else if (j === 0 && x <= this._xVals[j]) {
                    i = j;
                    break;
                } else if (j === (this._xVals.length - 1) && this._xVals[j] <= x) {
                    i = j;
                    break;
                }
            }
        }

        // change range from something like 5-9 to 0-4
        if (this._hasXs) {
            x = _VolumeHelper.convertToRange(x, 0, (len - 1), this._xDataMin, this._xDataMax);
        }

        if (i === -1) {
            i = wijmo.clamp(Math.round(x), 0, len - 1);
        }

        return this._calcData[i].value + ((x - i) * this._calcData[i].width) - (0.5 * this._calcData[i].width);
    }

    // converts a value from one range to another
    // ex. converts a number within range 0-10 to a number within range 0-100 (5 becomes 50)
    static convertToRange(value: number, newMin: number, newMax: number, oldMin: number, oldMax: number): number {
        if (newMin === newMax || oldMin === oldMax) {
            return 0;
        }

        return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
    }

    // fill gaps in volume and x data when x-axis is using dates
    // there could potentially be gaps for weekends and/or holidays
    private _fillGaps(): void {
        if (this._xDataType !== wijmo.DataType.Date || this._xVals === null || this._xVals.length <= 0) {
            return;
        }

        var xmin: any = this._xDataMin,
            xmax: any = this._xDataMax,
            i: number;

        for (i = 1; xmin < xmax; i++) {
            xmin = new Date(xmin);
            xmin.setDate(xmin.getDate() + 1);
            xmin = xmin.valueOf();

            if (xmin !== this._xVals[i]) {
                this._xVals.splice(i, 0, xmin);
                this._volumes.splice(i, 0, 0);
            }
        }
    }
}
    }
    


    module wijmo.chart {
    

'use strict';

/**
 * Calculates Spline curves.
 */
export class _Spline {
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

    constructor(x: number[], y: number[], num?:number) {
        this._x = x;
        this._y = y;

        var len = this._len = num? num : Math.min(x.length, y.length);

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

    private calculatePoint(val: number): any {
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

        return { x: x, y: y };
    }

    calculate() {
        if (this._len <= 3) {
            return { xs: this._x, ys: this._y };
        }

        var xs = [];
        var ys = [];

        var p0 = this.calculatePoint(0);
        xs.push(p0.x);
        ys.push(p0.y);

        var delta = this._len * this.k;
        var d = 3;

        for (var i = delta; i <= this._len - 1; i += delta)
        {
            var p = this.calculatePoint(i);

            if (Math.abs(p0.x - p.x) >= d || Math.abs(p0.y - p.y) >= d) {
                xs.push(p.x);
                ys.push(p.y)
                p0 = p;
            }
        }

        return { xs: xs, ys: ys };
    }
}
    }
    


    module wijmo.chart {
    'use strict';

/**
 * These are predefined color palettes for chart {@link Series} objects.
 *
 * To create custom color palettes, supply an array of strings or rgba values.
 *
 * You can specify palettes for {@link FlexChart} and {@link FlexPie} controls.
 * For example:
 *
 * <pre>chart.palette = Palettes.light;</pre>
 *
 * The following palettes are pre-defined:
 * <ul>
 *   <li>standard (default)</li>
 *   <li>cocoa</li>
 *   <li>coral</li>
 *   <li>dark</li>
 *   <li>highcontrast</li>
 *   <li>light</li>
 *   <li>midnight</li>
 *   <li>modern</li>
 *   <li>organic</li>
 *   <li>slate</li>
 *   <li>zen</li>
 *   <li>cyborg</li>
 *   <li>superhero</li>
 *   <li>flatly</li>
 *   <li>darkly</li>
 *   <li>cerulan</li>
 * </ul>
 */
export class Palettes {
    static standard = ['#88bde6', '#fbb258', '#90cd97', '#f6aac9', '#bfa554', '#bc99c7', '#eddd46', '#f07e6e', '#8c8c8c'];
    static cocoa = ['#466bb0', '#c8b422', '#14886e', '#b54836', '#6e5944', '#8b3872', '#73b22b', '#b87320', '#141414'];
    static coral = ['#84d0e0', '#f48256', '#95c78c', '#efa5d6', '#ba8452', '#ab95c2', '#ede9d0', '#e96b7d', '#888888'];
    static dark = ['#005fad', '#f06400', '#009330', '#e400b1', '#b65800', '#6a279c', '#d5a211', '#dc0127', '#000000'];
    static highcontrast = ['#ff82b0', '#0dda2c', '#0021ab', '#bcf28c', '#19c23b', '#890d3a', '#607efd', '#1b7700', '#000000'];
    static light = ['#ddca9a', '#778deb', '#cb9fbb', '#b5eae2', '#7270be', '#a6c7a7', '#9e95c7', '#95b0c7', '#9b9b9b'];
    static midnight = ['#83aaca', '#e37849', '#14a46a', '#e097da', '#a26d54', '#a584b7', '#d89c54', '#e86996', '#2c343b'];
    static modern = ['#2d9fc7', '#ec993c', '#89c235', '#e377a4', '#a68931', '#a672a6', '#d0c041', '#e35855', '#68706a'];
    static organic = ['#9c88d9', '#a3d767', '#8ec3c0', '#e9c3a9', '#91ab36', '#d4ccc0', '#61bbd8', '#e2d76f', '#80715a'];
    static slate = ['#7493cd', '#f99820', '#71b486', '#e4a491', '#cb883b', '#ae83a4', '#bacc5c', '#e5746a', '#505d65'];
    static zen = ['#7bb5ae', '#e2d287', '#92b8da', '#eac4cb', '#7b8bbd', '#c7d189', '#b9a0c8', '#dfb397', '#a9a9a9'];
    static cyborg = ['#2a9fd6', '#77b300', '#9933cc', '#ff8800', '#cc0000', '#00cca3', '#3d6dcc', '#525252', '#000000'];
    static superhero = ['#5cb85c', '#f0ad4e', '#5bc0de', '#d9534f', '#9f5bde', '#46db8c', '#b6b86e', '#4e5d6c', '#2b3e4b'];
    static flatly = ['#18bc9c', '#3498db', '#f39c12', '#6cc1be', '#99a549', '#8f54b5', '#e74c3c', '#8a9899', '#2c3e50'];
    static darkly = ['#375a7f', '#00bc8c', '#3498db', '#f39c12', '#e74c3c', '#8f61b3', '#b08725', '#4a4949', '#000000'];
    static cerulan = ['#033e76', '#87c048', '#59822c', '#53b3eb', '#fc6506', '#d42323', '#e3bb00', '#cccccc', '#222222'];

    /** 
     * This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/). 
     * Please see license at http://colorbrewer.org/export/LICENSE.txt
     * 
     * Qualitative palettes from ColorBrewer https://colorbrewer2.org . 
     * 
     * Qualitative (or categorical) palettes are usually used for plotting independent data categories
     * which don't have any specific order. For example, the series that represents shipping methods or
     * product types. The colors in these palettes are selected to be distinctive and clearly indicate
     * difference between data series.  
     *
     * You can specify palettes for charting controls, like {@link FlexChart} and {@link FlexPie}.
     * For example:
     *
     * <pre>chart.palette = Palettes.Qualitative.Accent;</pre>
     *
     * The Qualitative palettes include the following color schemes:
     * <ul>
     *   <li>Accent</li>
     *   <li>Dark2</li>
     *   <li>Paired</li>
     *   <li>Pastel1</li>
     *   <li>Pastel2</li>
     *   <li>Set1</li>
     *   <li>Set2</li>
     *   <li>Set2</li>
     * </ul>
    */
    static Qualitative = {
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5']
    };

    /** Diverging palettes from ColorBrewer https://colorbrewer2.org. 
     * 
     * Diverging palettes are used to indicate distance from a critical point. These color schemes work
     * well when your data has some mid-point. For example, temperature data could be a shade of blue below zero,
     * a red color is for the values above zero and temperature around zero would have a neutral color. 
     *
     * You can specify palettes for charting controls, like {@link FlexChart} and {@link FlexPie}, or
     * use palette for {@link ColorScale.colors} property. 
     * For example:
     *
     * <pre>chart.palette = Palettes.Diverging.BrBG;</pre>
     *
     * The Diverging palettes include the following color schemes:
     * <ul>
     *   <li>BrBG</li>
     *   <li>PiYG</li>
     *   <li>PRGn</li>
     *   <li>PuOr</li>
     *   <li>RdBu</li>
     *   <li>RdGy</li>
     *   <li>RdYlBu</li>
     *   <li>RdYlGn</li>
     *   <li>Spectral</li>
     * </ul>
     */
    static Diverging = {
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2']
    };

    /** Sequential single-hue palettes from ColorBrewer https://colorbrewer2.org.
     *  
     * Sequential palettes are used for data that have ordered, quantitative nature, for example precipitation amount
     * or number of road incidents for some region. These color schemes are shade variations of a single base color,
     * usually from light to dark.
     *
     * You can specify palettes for charting controls, like {@link FlexChart} and {@link FlexPie}, or
     * use palette for {@link ColorScale.colors} property. 
     * For example:
     *
     * <pre>chart.palette = Palettes.SequentialSingle.Blues;</pre>
     *
     * The Sequential single-hue palettes include the following color schemes:
     * <ul>
     *   <li>Blues</li>
     *   <li>Greens</li>
     *   <li>Greys</li>
     *   <li>Oranges</li>
     *   <li>Purples</li>
     *   <li>Reds</li>
     * </ul>
    */
    static SequentialSingle = {
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d']
    };

    /** Sequential multi-hue palettes from ColorBrewer https://colorbrewer2.org. 
     * 
     * Sequential palettes are used for data that have ordered, quantitative nature, for example precipitation amount
     * or number of road incidents for some region. In addition to lightness variation, these color schemes also
     * use several hues to improve perception.
     *
     * You can specify palettes for charting controls, like {@link FlexChart} and {@link FlexPie}, or
     * use palette for {@link ColorScale.colors} property. 
     * For example:
     *
     * <pre>chart.palette = Palettes.SequentialMulti.BuGn;</pre>
     *
     * The Sequential multi-hue palettes include the following color schemes:
     * <ul>
     *   <li>BuGn</li>
     *   <li>BuPu</li>
     *   <li>GnBu</li>
     *   <li>OrRd</li>
     *   <li>PuBu</li>
     *   <li>PuBuGn</li>
     *   <li>PuRd</li>
     *   <li>RdPu</li>
     *   <li>YlGn</li>
     *   <li>YlGnBu</li>
     *   <li>YlOrBr</li>
     *   <li>YlOrRd</li>
     * </ul>
    */
    static SequentialMulti = {
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
    }

    static _isExtended(clrs: string[]): boolean {
        return this._values(Palettes.Diverging).indexOf(clrs) !== -1 ||
            this._values(Palettes.Qualitative).indexOf(clrs) !== -1 ||
            this._values(Palettes.SequentialSingle).indexOf(clrs) !== -1 ||
            this._values(Palettes.SequentialMulti).indexOf(clrs) !== -1;
    }

    private static _values(obj: any): any[] {
        return Object.keys(obj).map(e => obj[e]);
    }
}
    }
    


    module wijmo.chart {
    


'use strict';

/**
 * Represents a rendering engine that performs the basic drawing routines.
 */
export interface IRenderEngine
{
    /**
     * Clears the viewport and starts the rendering cycle.
     */
    beginRender();
    /**
     * Finishes the rendering cycle.
     */
    endRender();
    /**
     * Sets the size of the viewport.
     * 
     * @param w Viewport width.
     * @param h Viewport height.
     */
    setViewportSize(w: number, h: number);
    /**
     * Gets the rendered element.
     */
    element: Element;
    /**
     * Gets or sets the color used to fill the element.
     */
    fill: string;
    /**
     * Gets or sets the color used to outline the element.
     */
    stroke: string;
    /**
     * Gets or sets the thickness of the outline.
     */
    strokeWidth: number;
    /**
     * Gets or sets the text color.
     */
    textFill: string;
    /**
     * Gets or sets the font size for the text output.
     */
    fontSize: string;
    /**
     * Gets or sets the font family for the text output.
     */
    fontFamily: string;
    /**
     * Gets or sets the value that indicates css priority.
     * By default, it's true and the specified css class has a priority
     * over current engine's properties like fill or stroke.
     */ 
    cssPriority: boolean;
    readOnly: boolean;
    /**
     * Draws an ellipse.
     *
     * @param cx X coordinate of the ellipse's center.
     * @param cy Y coordinate of the ellipse's center.
     * @param rx X radius (half of the ellipse's width).
     * @param ry Y radius (half of the ellipse's height).
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     */
    drawEllipse(cx: number, cy: number, rx: number, ry: number, className?: string, style?: any);
    /**
     * Draws a rectangle.
     *
     * @param x Left of the rectangle.
     * @param y Bottom of the rectangle.
     * @param w Width of the rectangle.
     * @param h Height of the rectangle.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawRect(x: number, y: number, w: number, h: number, className?: string, style?: any, clipPath?: string);
    /**
     * Draws a line.
     *
     * @param x1 X coordinate of the first point.
     * @param y1 Y coordinate of the first point.
     * @param x2 X coordinate of the second point.
     * @param y2 Y coordinate of the second point.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, className?: string, style?: any);
    /**
     * Draws a series of lines.
     *
     * @param xs Array of X coordinates.
     * @param ys Array of Y coordinates.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawLines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?:number);
    /**
     * Draws a series of splines (smooth path).
     *
     * @param xs Array of X coordinates.
     * @param ys Array of Y coordinates.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawSplines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?:number);
    /**
     * Draws a polygon.
     *
     * @param xs Array of X coordinates.
     * @param ys Array of Y coordinates.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawPolygon(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string);
    /**
     * Draws a pie segment.
     *
     * @param cx X coordinate of the segment center.
     * @param cy Y coordinate of the segment center.
     * @param radius Radius of the segment.
     * @param startAngle Start angle of the segment, in degrees.
     * @param sweepAngle Sweep angle of the segment, in degrees clockwise.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawPieSegment(cx: number, cy: number, radius: number, startAngle: number, sweepAngle: number, className?: string, style?: any, clipPath?: string);
    /**
     * Draws a doughnut segment.
     *
     * @param cx X coordinate of the segment center.
     * @param cy Y coordinate of the segment center.
     * @param radius Outer radius of the segment.
     * @param innerRadius Inner radius of the segment.
     * @param startAngle Start angle of the segment, in degrees.
     * @param sweepAngle Sweep angle of the segment, in degrees clockwise.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     * @param clipPath Id of the path to use as a clipping path.
     */
    drawDonutSegment(cx: number, cy: number, radius: number, innerRadius: number, startAngle: number, sweepAngle: number, className?: string, style?: any, clipPath?: string);
    /**
     * Draws a string.
     *
     * @param s String to be drawn.
     * @param pt Reference point for the string.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     */
    drawString(s: string, pt: wijmo.Point, className?: string, style?: any);
    /**
     * Draws a rotated string.
     *
     * @param s String to be drawn.
     * @param pt Reference point for rendering the string.
     * @param center Reference point for rotating the string.
     * @param angle Rotation angle, in degrees, clockwise.
     * @param className Class name to be applied to the element.
     * @param style Style object to be applied to the element.
     */
    drawStringRotated(s: string, pt: wijmo.Point, center: wijmo.Point, angle: number, className?: string, style?: any);
    /**
     * Draws an image.
     *
     * @param href Url of the image to draw.
     * @param x Left coordinate of the image's bounding rectangle.
     * @param y Bottom coordinate of the image's bounding rectangle.
     * @param w Image width.
     * @param h Image height.
     */
    drawImage(href:string, x: number, y: number, w: number, h: number);
    /**
     * Measures a string.
     *
     * @param s String to be measured.
     * @param className Class name to use when measuring the string.
     * @param groupName Name of the group to use when measuring the string.
     * @param style Style object to use when measuring the string.
     */
    measureString(s: string, className?: string, groupName?: string, style?: any): wijmo.Size;
    /**
     * Starts a group.
     *
     * @param className Class name to apply to the new group.
     * @param clipPath Id of the path to use as a clipping path.
     * @param createTransform Whether to create a new transform for the group.
     */
    startGroup(className?: string, clipPath?: string, createTransform?: boolean);
    /**
     * Ends a group.
     */
    endGroup();
    /**
     * Adds a clipping rectangle to the context.
     *
     * @param clipRect The clipping rectangle.
     * @param id The ID of the clipping rectangle.
     */
    addClipRect(clipRect: wijmo.Rect, id: string);
}


    }
    


    module wijmo.chart {
    




'use strict';

/**
 * Represents a plot area on the chart.
 *
 * The chart can have multiple plot areas with multiple axes.
 * To assign axis to plot area use <b>Axis.plotArea</b> property. For example:
 * <pre>
 *  // create a plot area
 *  var pa = new PlotArea();
 *  pa.row = 1;
 *  chart.plotAreas.push(pa);
 *  // create auxiliary y-axis
 *  var ay2 = new Axis(Position.Left);
 *  ay2.plotArea = pa; // attach axis to the plot area
 *  chart.axes.push(ay2);
 *  // plot first series along y-axis
 *  chart.series[0].axisY = ay2;
 * </pre>
 */
export class PlotArea
{
    private _row: number = 0;
    private _col: number = 0;
    private _width: any;
    private _height: any;
    private _name: string;
    private _style: any;
    private _rect = new wijmo.Rect(0,0,0,0);

    _chart: FlexChartCore;

    /**
     * Initializes a new instance of the {@link PlotArea} class.
     *
     * @param options Initialization options for the plot area.
     */
    constructor(options?: any) {
        wijmo.copy(this, options);
    }

    /**
     * Gets or sets the row index of plot area. 
     * This determines the vertical position of the plot area
     * on the chart. 
     */
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        if (value != this._row) {
            this._row = wijmo.asInt(value, true, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the column index of plot area.
     * This determines the horizontal position of the plot
     * area on the chart. 
     */
    get column(): number {
        return this._col;
    }
    set column(value: number) {
        if (value != this._col) {
            this._col = wijmo.asInt(value, true, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the plot area name.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (value != this._name) {
            this._name = wijmo.asString(value, true);
        }
    }

    /**
     * Gets or sets width of the plot area. 
     *
     * The width can be specified as a number (in pixels) or
     * as a string in the format '{number}*' (star sizing).
     */
    get width(): any {
        return this._width;
    }
    set width(value: any) {
        if (value != this._width) {
            this._width = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets the height of the plot area. 
     *
     * The height can be specified as a number (in pixels) or
     * as a string in the format '{number}*' (star sizing).
     */
    get height(): any {
        return this._height;
    }
    set height(value: any) {
        if (value != this._height) {
            this._height = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets the style of the plot area. 
     *
     * Using <b>style</b> property, you can set appearance of the plot area. 
     * For example:
     * <pre>
     *   pa.style = { fill: 'rgba(0,255,0,0.1)' };
     * </pre>
     */
    get style(): any {
        return this._style;
    }
    set style(value: any) {
        if (value != this._style) {
            this._style = value;
            this._invalidate();
        }
    }

    private _invalidate() {
        if (this._chart) {
            this._chart.invalidate();
        }
    }

    _render(engine: IRenderEngine) {
        engine.drawRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height,
            null, this.style);
    }

    _setPlotX(x:number, w:number){
        this._rect.left = x; this._rect.width = w;
    }

    _setPlotY(y:number, h:number){
            this._rect.top = y; this._rect.height = h;
    }

}

/**
 * Represents a collection of {@link PlotArea} objects in a {@link FlexChartCore} control.
 */
export class PlotAreaCollection extends wijmo.collections.ObservableArray {

    /**
     * Gets a plot area by name.
     *
     * @param name The name of the plot area to look for.
     * @return The axis object with the specified name, or null if not found.
     */
    getPlotArea(name: string): PlotArea {
        var index = this.indexOf(name);
        return index > -1 ? this[index] : null;
    }
    
    /**
     * Gets the index of a plot area by name.
     *
     * @param name The name of the plot area to look for.
     * @return The index of the plot area with the specified name, or -1 if not found.
     */
    indexOf(name: string): number {
        for (var i = 0; i < this.length; i++) {
            if ((<PlotArea>this[i]).name == name) {
                return i;
            }
        }
        return -1;
    }

    _getWidth(column: number): any {
        var w;
        for (var i = 0; i < this.length; i++) {
            var pa = <PlotArea>this[i];

            if (pa.column == column && pa.row == 0 /* ? */ ) {
                return pa.width;
            }
        }

        return w;
    }

    _getHeight(row: number): any {
        var w;
        for (var i = 0; i < this.length; i++) {
            var pa = <PlotArea>this[i];
            if (pa.row == row && pa.column == 0 /* ? */ ) {
                return pa.height;
            }
        }

        return w;
    }

    _calculateWidths(width: number, ncols:number) : number[] {
        if (ncols <= 0)
            throw("ncols");

        var glens = [];
        for (var i = 0; i < ncols; i++)
        {
            var w = this._getWidth(i);
            glens[i] = new _GridLength(w);
        }

        return this._calculateLengths(width, ncols, glens);
    }

    _calculateHeights( height : number, nrows:number) : number[] {
        if (nrows <= 0)
            throw("nrows");

        var glens = [];
        for (var i = 0; i < nrows; i++)
        {
            var h = this._getHeight(i);
            glens[i] = new _GridLength(h);
        }

        return this._calculateLengths(height, nrows, glens);
    }

    private _calculateLengths( width:number, ncols:number, glens : _GridLength[]) : number[] {
        var ws = [ncols];

        var wabs = 0.0;
        var nstars = 0.0;

        for (var i = 0; i < ncols; i++)
        {
            if (glens[i].isAbsolute) {
                ws[i] = glens[i].value;
                wabs += ws[i];
            }
            else if (glens[i].isStar)
                nstars += glens[i].value;
            else if (glens[i].isAuto)
                nstars++;
        }

        var availw = width - wabs;
        var wstar = availw / nstars;

        for (var i = 0; i < ncols; i++)
        {
            if (glens[i].isStar)
                ws[i] = wstar * glens[i].value;
            else if (glens[i].isAuto)
                ws[i] = wstar;

            if (ws[i] < 0)
                ws[i] = 0;
        }

        return ws;
    }
}

enum _GridUnitType {
    Auto,
    Pixel,
    Star
}

class _GridLength {
    private _value: number;
    private _unitType = _GridUnitType.Auto;

    constructor(s:any = null) {
        if (s) {
            s = s.toString();

            if (s.indexOf('*') >= 0) {
                this._unitType = _GridUnitType.Star;
                s = s.replace('*', '');
                this._value = parseFloat(s);
                if (isNaN(this._value)) {
                    this._value = 1;
                }
            } else {
                this._unitType = _GridUnitType.Pixel;
                this._value = parseFloat(s);
                if (isNaN(this._value)) {
                    this._unitType = _GridUnitType.Auto;
                    this._value = 1;
                }
            }
        }
    }

    public get value(): number {
        return this._value;
    }
    
    public get isStar(): boolean {
        return this._unitType == _GridUnitType.Star;
    } 

    public get isAbsolute(): boolean {
        return this._unitType == _GridUnitType.Pixel;
    } 

    public get isAuto(): boolean {
        return this._unitType == _GridUnitType.Auto;
    } 
}
    }
    


    module wijmo.chart {
    



'use strict';

/**
 * Render to svg.
 */
export class _SvgRenderEngine implements IRenderEngine {
    private static svgNS = 'http://www.w3.org/2000/svg';
    private static xlinkNS = 'http://www.w3.org/1999/xlink';

    private _element: HTMLElement;
    private _svg: Element;
    private _text: SVGTextElement;
    private _textGroup: SVGGElement;
    private _defs: SVGDefsElement;

    private _fill: string;
    private _stroke: string;
    private _textFill: string;

    private _strokeWidth: number = 1;

    private _fontSize: string = null;
    private _fontFamily: string = null;

    private _group: Element;
    private _groupCls: string;
    private _clipRect: wijmo.Rect;
    private static _isff: boolean;
    private static _isSafari: boolean;
    private _savedGradient = {};

    private _bbCache = {}; // getBBox() cache
    private _baseUrl = '';
    private _cssPriority: boolean = true;
    private _readOnly: boolean = false;
    private _isRtl = false;

    private _precision = 1;

    constructor(element?: HTMLElement) {
        this._element = element;
        this._create();

        if (this._element) {
            this._element.appendChild(this._svg);
        }

        let ua = navigator.userAgent.toLowerCase();
        if (_SvgRenderEngine._isff === undefined) {
            _SvgRenderEngine._isff = ua.indexOf('firefox') >= 0;
        }
        if (_SvgRenderEngine._isSafari === undefined) {
            _SvgRenderEngine._isSafari = ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1;
        }

        // this._baseUrl = window.location.pathname.replace(window.location.hash, '').replace(/\/$/gi, '');
        this._baseUrl = window.location.pathname.replace(window.location.hash, '');
        if (window.location.protocol == 'file:' && (wijmo.isIE() || wijmo.isEdge())) {
            this._baseUrl = "file:" + this._baseUrl;
        }
    }

    attach(el: HTMLElement) {
        this._element = el;
        if (el) {
            el.insertBefore(this._svg, el.childNodes[0]);
            el.appendChild(this._svg);
        }
    }

    detach() {
        if (this._element) {
            this._element.removeChild(this._svg);
        }
        while (this._svg.firstChild) {
            wijmo.removeChild(this._svg.firstChild);
        }
    }

    beginRender() {
        while (this._svg.firstChild) {
            wijmo.removeChild(this._svg.firstChild);
        }
        this._savedGradient = {};
        this._bbCache = {};
        this._svg.appendChild(this._defs);
        this._svg.appendChild(this._textGroup);
        this._isRtl = this._checkRtl();
    }

    endRender() {
        wijmo.removeChild(this._textGroup);
    }

    setViewportSize(w: number, h: number) {
        this._svg.setAttribute('width', w.toString());
        this._svg.setAttribute('height', h.toString());
    }

    get element(): Element {
        return this._svg;
    }

    get fill(): string {
        return this._fill
    }
    set fill(value: string) {
        this._fill = value;
    }

    get fontSize(): string {
        return this._fontSize;
    }
    set fontSize(value: string) {
        this._fontSize = value;
    }

    get fontFamily(): string {
        return this._fontFamily;
    }
    set fontFamily(value: string) {
        this._fontFamily = value;
    }

    get stroke(): string {
        return this._stroke;
    }
    set stroke(value: string) {
        this._stroke = value;
    }

    get strokeWidth(): number {
        return this._strokeWidth;
    }
    set strokeWidth(value: number) {
        this._strokeWidth = value === undefined ? null : value;
    }

    get textFill(): string {
        return this._textFill;
    }
    set textFill(value: string) {
        this._textFill = value;
    }

    get cssPriority(): boolean {
        return this._cssPriority;
    }
    set cssPriority(value: boolean) {
        this._cssPriority = value;
    }

    get readOnly(): boolean {
        return this._readOnly;
    }
    set readOnly(value: boolean) {
        this._readOnly = value;
    }

    get precision(): number {
        return this._precision;
    }
    set precision(value: number) {
        this._precision = wijmo.asNumber(value);
    }

    addClipRect(clipRect: wijmo.Rect, id: string) {
        if (clipRect && id) {
            let precision = this.precision;
            var clipPath = document.createElementNS(_SvgRenderEngine.svgNS, 'clipPath');
            var rect = document.createElementNS(_SvgRenderEngine.svgNS, 'rect');
            rect.setAttribute('x', (clipRect.left - 1).toFixed(precision));
            rect.setAttribute('y', (clipRect.top - 1).toFixed(precision));
            rect.setAttribute('width', (clipRect.width + 2).toFixed(precision));
            rect.setAttribute('height', (clipRect.height + 2).toFixed(precision));
            clipPath.appendChild(rect);

            clipPath.setAttribute('id', id);

            this._svg.appendChild(clipPath);
        }
    }

    drawEllipse(cx: number, cy: number, rx: number, ry: number, className?: string, style?: any): SVGElement {
        let ell = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'ellipse');
        let precision = this.precision;

        this._applyColor(ell, 'stroke', this._stroke);
        if (this._strokeWidth !== null) {
            this._setAttribute(ell, 'stroke-width', this._strokeWidth.toString())
        }
        this._applyColor(ell, 'fill', this._fill);
        ell.setAttribute('cx', cx.toFixed(precision));
        ell.setAttribute('cy', cy.toFixed(precision));
        ell.setAttribute('rx', rx.toFixed(precision));
        ell.setAttribute('ry', ry.toFixed(precision));

        if (className) {
            ell.setAttribute('class', className);
        }
        this._applyStyle(ell, style);

        this._appendChild(ell);

        return ell;
    }

    drawRect(x: number, y: number, w: number, h: number, className?: string, style?: any, clipPath?: string): SVGElement {
        let rect = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'rect');
        let precision = this.precision;

        this._applyColor(rect, 'fill', this._fill);
        this._applyColor(rect, 'stroke', this._stroke);
        if (this._strokeWidth !== null) {
            this._setAttribute(rect, 'stroke-width', this._strokeWidth.toString());
        }
        rect.setAttribute('x', x.toFixed(precision));
        rect.setAttribute('y', y.toFixed(precision));
        if (w > 0 && w < 0.05) {
            rect.setAttribute('width', '0.1');
        } else {
            rect.setAttribute('width', w.toFixed(precision));
        }
        if (h > 0 && h < 0.05) {
            rect.setAttribute('height', '0.1');
        } else {
            rect.setAttribute('height', h.toFixed(precision));
        }
        if (clipPath) {
            this._setClipPath(rect, clipPath);
        }

        if (className) {
            rect.setAttribute('class', className);
        }
        this._applyStyle(rect, style);

        this._appendChild(rect);

        return rect;
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, className?: string, style?: any): SVGElement {
        let line = <SVGAElement>document.createElementNS(_SvgRenderEngine.svgNS, 'line');
        let precision = this.precision;

        this._applyColor(line, 'stroke', this._stroke);
        if (this._strokeWidth !== null) {
            this._setAttribute(line, 'stroke-width', this._strokeWidth.toString());
        }
        line.setAttribute('x1', x1.toFixed(precision));
        line.setAttribute('x2', x2.toFixed(precision));
        line.setAttribute('y1', y1.toFixed(precision));
        line.setAttribute('y2', y2.toFixed(precision));

        if (className) {
            line.setAttribute('class', className);
        }
        this._applyStyle(line, style);

        this._appendChild(line);

        return line;
    }

    drawLines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?: number): SVGElement {
        if (xs && ys) {
            var len = num ? num : Math.min(xs.length, ys.length);
            if (len > 0) {
                let pline = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');
                let precision = this.precision;

                this._applyColor(pline, 'stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    this._setAttribute(pline, 'stroke-width', this._strokeWidth.toString());
                }

                pline.setAttribute('fill', 'none');
                var spts = '';
                for (var i = 0; i < len; i++) {
                    spts += xs[i].toFixed(precision) + ',' + ys[i].toFixed(precision) + ' ';
                }
                pline.setAttribute('points', spts);

                if (className) {
                    pline.setAttribute('class', className);
                }
                if (clipPath) {
                    this._setClipPath(pline, clipPath);
                }
                this._applyStyle(pline, style);

                this._appendChild(pline);

                return pline;
            }
        }

        return null;
    }

    drawSplines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?: number): SVGElement {
        if (xs && ys) {
            var spline = new _Spline(xs, ys, num);
            var s = spline.calculate();
            var sx = s.xs;
            var sy = s.ys;

            var len = Math.min(sx.length, sy.length);
            if (len > 0) {
                let pline = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');
                let precision = this.precision;

                this._applyColor(pline, 'stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    this._setAttribute(pline, 'stroke-width', this._strokeWidth.toString());
                }

                pline.setAttribute('fill', 'none');
                var spts = '';
                for (var i = 0; i < len; i++) {
                    spts += sx[i].toFixed(precision) + ',' + sy[i].toFixed(precision) + ' ';
                }
                pline.setAttribute('points', spts);

                if (className) {
                    pline.setAttribute('class', className);
                }
                if (clipPath) {
                    this._setClipPath(pline, clipPath);
                }
                this._applyStyle(pline, style);

                this._appendChild(pline);

                return pline;
            }
        }

        return null;
    }

    drawPolygon(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string): SVGElement {
        if (xs && ys) {
            var len = Math.min(xs.length, ys.length);
            if (len > 0) {
                let poly = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'polygon');
                let precision = this.precision;

                this._applyColor(poly, 'stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    this._setAttribute(poly, 'stroke-width', this._strokeWidth.toString());
                }
                this._applyColor(poly, 'fill', this._fill);

                var spts = '';
                for (var i = 0; i < len; i++) {
                    spts += xs[i].toFixed(precision) + ',' + ys[i].toFixed(precision) + ' ';
                }
                poly.setAttribute('points', spts);

                if (className) {
                    poly.setAttribute('class', className);
                }
                if (clipPath) {
                    this._setClipPath(poly, clipPath);
                }
                this._applyStyle(poly, style);

                this._appendChild(poly);

                return poly;
            }
        }

        return null;
    }

    drawPieSegment(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number,
        className?: string, style?: any, clipPath?: string): SVGElement {

        if (sweepAngle >= Math.PI * 2) {
            return this.drawEllipse(cx, cy, r, r, className, style);
        }

        let path = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'path');
        let precision = this.precision;

        this._applyColor(path, 'fill', this._fill);
        this._applyColor(path, 'stroke', this._stroke);
        if (this._strokeWidth !== null) {
            this._setAttribute(path, 'stroke-width', this._strokeWidth.toString());
        }

        var p1 = new wijmo.Point(cx, cy);
        p1.x += r * Math.cos(startAngle);
        p1.y += r * Math.sin(startAngle);

        var a2 = startAngle + sweepAngle;
        var p2 = new wijmo.Point(cx, cy);
        p2.x += r * Math.cos(a2);
        p2.y += r * Math.sin(a2);

        var opt = ' 0 0,1 ';
        if (Math.abs(sweepAngle) > Math.PI) {
            opt = ' 0 1,1 ';
        }

        var d = 'M ' + p1.x.toFixed(precision) + ',' + p1.y.toFixed(precision);
        d += ' A ' + r.toFixed(precision) + ',' + r.toFixed(precision) + opt;
        d += p2.x.toFixed(precision) + ',' + p2.y.toFixed(precision);
        d += ' L ' + cx.toFixed(precision) + ',' + cy.toFixed(precision) + ' z';

        path.setAttribute('d', d);


        if (clipPath) {
            this._setClipPath(path, clipPath);
        }

        if (className) {
            path.setAttribute('class', className);
        }
        this._applyStyle(path, style);

        this._appendChild(path);

        return path;
    }

    drawDonutSegment(cx: number, cy: number, radius: number, innerRadius: number, startAngle: number, sweepAngle: number,
        className?: string, style?: any, clipPath?: string): SVGElement {

        var isFull = false;
        if (sweepAngle >= Math.PI * 2) {
            isFull = true;
            sweepAngle -= 0.001;
        }
        let path = <SVGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'path');
        let precision = this.precision + 2;

        this._applyColor(path, 'fill', this._fill);
        this._applyColor(path, 'stroke', this._stroke);
        if (this._strokeWidth !== null) {
            this._setAttribute(path, 'stroke-width', this._strokeWidth.toString());
        }

        var p1 = new wijmo.Point(cx, cy);
        p1.x += radius * Math.cos(startAngle);
        p1.y += radius * Math.sin(startAngle);

        var a2 = startAngle + sweepAngle;
        var p2 = new wijmo.Point(cx, cy);
        p2.x += radius * Math.cos(a2);
        p2.y += radius * Math.sin(a2);

        var p3 = new wijmo.Point(cx, cy);
        p3.x += innerRadius * Math.cos(a2);
        p3.y += innerRadius * Math.sin(a2);

        var p4 = new wijmo.Point(cx, cy);
        p4.x += innerRadius * Math.cos(startAngle);
        p4.y += innerRadius * Math.sin(startAngle);

        var opt1 = ' 0 0,1 ',
            opt2 = ' 0 0,0 ';
        if (Math.abs(sweepAngle) > Math.PI) {
            opt1 = ' 0 1,1 ';
            opt2 = ' 0 1,0 ';
        }

        var d = 'M ' + p1.x.toFixed(precision) + ',' + p1.y.toFixed(precision);

        d += ' A ' + radius.toFixed(precision) + ',' + radius.toFixed(precision) + opt1;
        d += p2.x.toFixed(precision) + ',' + p2.y.toFixed(precision);
        if (isFull) {
            d += ' M ' + p3.x.toFixed(precision) + ',' + p3.y.toFixed(precision);
        } else {
            d += ' L ' + p3.x.toFixed(precision) + ',' + p3.y.toFixed(precision);
        }
        d += ' A ' + innerRadius.toFixed(precision) + ',' + innerRadius.toFixed(precision) + opt2;
        d += p4.x.toFixed(precision) + ',' + p4.y.toFixed(precision);
        if (!isFull) {
            d += ' z';
        }

        path.setAttribute('d', d);

        if (clipPath) {
            this._setClipPath(path, clipPath);
        }

        if (className) {
            path.setAttribute('class', className);
        }
        this._applyStyle(path, style);

        this._appendChild(path);

        return path;
    }

    drawString(s: string, pt: wijmo.Point, className?: string, style?: any): SVGElement {
        let text = this._createText(pt, s);
        let precision = this.precision;

        if (className) {
            text.setAttribute('class', className);
        }

        this._applyStyle(text, style);

        this._appendChild(text);

        var key = this._getKey(s, className, this._groupCls);
        var bb;
        if (this._bbCache[key]) {
            bb = this._bbCache[key];
            text.setAttribute('y', (pt.y - (bb.y + bb.height)).toFixed(precision));
        } else {
            bb = this._getBBox(text);
            text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(precision));
        }

        if (this._isRtl && !wijmo.isIE()) {
            text.setAttribute('x', (pt.x + bb.width).toFixed(precision));
        }
        return text;
    }

    drawStringRotated(s: string, pt: wijmo.Point, center: wijmo.Point, angle: number, className?: string, style?: any): SVGElement {
        let text = this._createText(pt, s);
        let precision = this.precision;

        if (className) {
            text.setAttribute('class', className);
        }
        this._applyStyle(text, style);

        var g = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
        g.setAttribute('transform', 'rotate(' + angle.toFixed(precision) + ',' + center.x.toFixed(precision) + ',' + center.y.toFixed(precision) + ')');
        g.appendChild(text);

        this._appendChild(g);
        var bb = this._getBBox(text);
        text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(precision));

        if (this._isRtl && !wijmo.isIE()) {
            text.setAttribute('x', (pt.x + bb.width).toFixed(precision));
        }

        return text;
    }

    measureString(s: string, className?: string, groupName?: string, style?: any): wijmo.Size {
        var sz = new wijmo.Size(0, 0);

        if (!this._fontFamily && !this._fontSize) {
            let key = this._getKey(s, className, groupName);
            if (this._bbCache[key])
                return <wijmo.Size>this._bbCache[key];
        }

        if (this.cssPriority) {
            if (this._fontSize) {
                this._text.setAttribute('font-size', this._fontSize);
            }
            if (this._fontFamily) {
                this._text.setAttribute('font-family', this._fontFamily);
            }
        } else {
            let style: string = '';

            if (this._fontSize) {
                style += 'font-size:' + this._fontSize + ';';
            }
            if (this._fontFamily) {
                style += 'font-family:' + this._fontFamily + ';';
            }

            if (style.length > 0) {
                this._text.setAttribute('style', style);
            }
        }
        if (className) {
            this._text.setAttribute('class', className);
        }
        if (groupName) {
            this._textGroup.setAttribute('class', groupName);
        }

        this._applyStyle(this._text, style);

        this._setText(this._text, s);

        var rect = this._getBBox(this._text);
        sz.width = rect.width;
        sz.height = rect.height;

        this._text.removeAttribute('font-size');
        this._text.removeAttribute('font-family');
        this._text.removeAttribute('class');
        this._text.removeAttribute('style');

        if (style) {
            for (var key in style) {
                this._text.removeAttribute(this._deCase(key));
            }
        }

        this._textGroup.removeAttribute('class');
        this._text.textContent = null;

        if (!this._fontFamily && !this._fontSize) {
            let key = this._getKey(s, className, groupName);
            this._bbCache[key] = { x: rect.x, y: rect.y + 1000, width: rect.width, height: rect.height };
        }

        return sz;
    }

    startGroup(className?: string, clipPath?: string, createTransform: boolean = false): SVGElement {
        var group = <SVGGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'g');
        if (className) {
            group.setAttribute('class', className);
            this._groupCls = className;
        }
        if (clipPath) {
            this._setClipPath(group, clipPath);
        }
        this._appendChild(group);
        if (createTransform) {
            group.transform.baseVal.appendItem((<SVGSVGElement>this._svg).createSVGTransform());
        }
        this._group = group;
        return group;
    }

    endGroup() {
        if (this._group) {
            var parent = <Element>this._group.parentNode;
            if (parent == this._svg) {
                this._group = null;
                this._groupCls = null;
            } else {
                this._group = parent;
                this._groupCls = this._getClass(this._group);
            }
        }
    }

    drawImage(imageHref: string, x: number, y: number, w: number, h: number): SVGElement {
        let img = <SVGGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'image');
        let precision = this.precision;

        img.setAttributeNS(_SvgRenderEngine.xlinkNS, 'href', imageHref);
        img.setAttribute('x', x.toFixed(precision));
        img.setAttribute('y', y.toFixed(precision));
        img.setAttribute('width', w.toFixed(precision));
        img.setAttribute('height', h.toFixed(precision));

        this._appendChild(img);

        return img;
    }

    private _setClipPath(ele, id) {
        ele.setAttribute('clip-path', 'url(#' + id + ')');
        if (_SvgRenderEngine._isSafari) {
            wijmo.setCss(ele, {
                '-webkit-clip-path': 'url(#' + id + ')'
            });
        }
    }

    private _appendChild(element: Element) {
        if (this.readOnly) {
            return;
        }

        var group = this._group;
        if (!group) {
            group = this._svg;
        }
        group.appendChild(element);
    }

    private _create() {
        this._svg = document.createElementNS(_SvgRenderEngine.svgNS, 'svg');
        this._defs = <SVGDefsElement>document.createElementNS(_SvgRenderEngine.svgNS, 'defs');
        this._svg.appendChild(this._defs);
        this._text = this._createText(new wijmo.Point(-1000, -1000), '');
        this._textGroup = <SVGGElement>document.createElementNS(_SvgRenderEngine.svgNS, 'g');
        this._textGroup.appendChild(this._text);
        this._svg.appendChild(this._textGroup);
    }

    private _setText(element: Element, s: string) {
        var text = s ? s.toString() : null;
        if (text && text.indexOf('tspan') >= 0) {
            try {
                element.textContent = null;

                // Parse the markup into valid nodes.
                var dXML = new DOMParser();

                //dXML.async = false;
                // Wrap the markup into a SVG node to ensure parsing works.
                var sXML = '<svg xmlns="http://www.w3.org/2000/svg\">' + text + '</svg>';
                var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

                // Now take each node, import it and append to this element.
                var childNode = <Node>svgDocElement.firstChild;

                while (childNode) {
                    element.appendChild(element.ownerDocument.importNode(childNode, true));
                    childNode = childNode.nextSibling;
                }

            } catch (e) {
                throw new Error('Error parsing XML string.');
            };
        }
        else {
            element.textContent = text;
        }
    }

    private _getKey(s: string, cls: string, group: string): string {
        return s + (cls || '') + (group || '');
    }

    private _createText(pos: wijmo.Point, text: string): SVGTextElement {
        let textEl = document.createElementNS(_SvgRenderEngine.svgNS, 'text');
        let precision = this.precision;

        this._setText(textEl, text);
        textEl.setAttribute('x', pos.x.toFixed(precision));
        textEl.setAttribute('y', pos.y.toFixed(precision));

        if (this.cssPriority) {
            if (this._textFill != null) {
                textEl.setAttribute('fill', this._textFill);
            }
            if (this._fontSize) {
                textEl.setAttribute('font-size', this._fontSize);
            }
            if (this._fontFamily) {
                textEl.setAttribute('font-family', this._fontFamily);
            }
        } else {
            let style: string = '';

            if (this._textFill != null) {
                style += 'fill:' + this._textFill + ';';
            }
            if (this._fontSize) {
                style += 'font-size:' + this._fontSize + ';';
            }
            if (this._fontFamily) {
                style += 'font-family:' + this._fontFamily + ';';
            }

            if (style.length > 0) {
                textEl.setAttribute('style', style);
            }
        }
        return <SVGTextElement>textEl;
    }

    private _applyStyle(el: SVGElement, style: any) {
        if (style) {
            for (var key in style) {
                if (key === 'fill' || key === 'stroke') {
                    this._applyColor(el, key, style[key]);
                } else {
                    el.setAttribute(this._deCase(key), style[key]);
                }
            }
        }
    }

    private _deCase(s: string): string {
        return s.replace(/[A-Z]/g, function (a) { return '-' + a.toLowerCase() });
    }

    private _getClass(el: Element): string {
        let cls: string;
        if (el) {
            for (let e = el; e; e = <Element>e.parentNode) {
                cls = e.getAttribute('class');
                if (cls)
                    break;
            }
        }

        return cls;
    }

    private _getBBox(text: SVGTextElement) {
        if (_SvgRenderEngine._isff) {
            try {
                return text.getBBox();
            } catch (e) {
                return { x: 0, y: 0, width: 0, height: 0 };
            }
        } else {
            return text.getBBox();
        }
    }

    private _applyColor(el, key: string, val: string) {
        let color = _GradientColorUtil.tryParse(val);

        if (color == null) {
            return;
        }
        if (!wijmo.isString(color)) {
            if (this._savedGradient[val] == null) {
                var id = 'gc' + (1000000 * Math.random()).toFixed();
                var gradient;
                if (color.x1 != null) {
                    gradient = document.createElementNS(_SvgRenderEngine.svgNS, 'linearGradient');
                    ['x1', 'y1', 'x2', 'y2', 'gradientUnits'].forEach(v => {
                        if (color[v] != null) {
                            gradient.setAttribute(v, color[v]);
                        }
                    });
                } else if (color.r != null) {
                    gradient = document.createElementNS(_SvgRenderEngine.svgNS, 'radialGradient');
                    ['cx', 'cy', 'r', 'fx', 'fy', 'fr', 'gradientUnits'].forEach(v => {
                        if (color[v] != null) {
                            gradient.setAttribute(v, color[v]);
                        }
                    });
                }
                if (color.colors && color.colors && color.colors.length > 0) {
                    color.colors.forEach(c => {
                        var stop = document.createElementNS(_SvgRenderEngine.svgNS, 'stop');
                        if (c.color != null) {
                            stop.setAttribute('stop-color', c.color);
                        }
                        if (c.offset != null) {
                            stop.setAttribute('offset', c.offset);
                        }
                        if (c.opacity != null) {
                            stop.setAttribute('stop-opacity', c.opacity);
                        }
                        gradient.appendChild(stop);
                    });
                }
                gradient.setAttribute('id', id);
                this._defs.appendChild(gradient);
                this._savedGradient[val] = id;
            }
            color = `url(${this._baseUrl}#${this._savedGradient[val]})`;
            //el.setAttribute(key, `url(${this._baseUrl}#${this._savedGradient[val]})`);
            //el.setAttribute(key, 'url(#' + this._savedGradient[val] + ')');
        }
        if (this.cssPriority) {
            el.setAttribute(key, color);
        } else {
            this._addInlineStyle(el, key, color);
        }
    }

    private _addInlineStyle(el: SVGElement, attr: string, value: string) {
        let style = el.getAttribute('style');
        if (style) {
            el.setAttribute('style', style + attr + ':' + value + ';')
        } else {
            el.setAttribute('style', attr + ':' + value + ';')
        }
    }

    private _setAttribute(el: SVGElement, attr: string, value: string) {
        if (this.cssPriority) {
            el.setAttribute(attr, value);
        } else {
            this._addInlineStyle(el, attr, value);
        }
    }

    private _checkRtl(): boolean {
        return this._element && wijmo.hasClass(this._element, 'wj-rtl');
    }
}

//Utilities for gradient color.
class _GradientColorUtil {

    static parsedColor = {};

    static tryParse(color: string) {
        if (_GradientColorUtil.parsedColor[color]) {
            return _GradientColorUtil.parsedColor[color];
        }
        if (color == null || color.indexOf('-') === -1 || color.indexOf('var(') !== -1) {
            return color;
        }

        var arr = color.replace(/\s+/g, '').split(/\-/g);
        var type = arr[0][0];
        var relative = false;
        var gc;
        //Suppose string with '-' is gradient color.
        var m = arr[0].match(/\(\S+\)/);
        if (!m || m.length == 0) {
            return color;
        }
        var coords = m[0].replace(/[\(\\)]/g, '').split(/\,/g);
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
                    gc[v] = relative ? +coords[i] * 100 + '%' : coords[i] + '';
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
                    gc[v] = relative ? +coords[i] * 100 + '%' : coords[i] + '';
                }
            });
        }
        if (!relative) {
            gc.gradientUnits = "userSpaceOnUse";
        }

        _GradientColorUtil.parsedColor[color] = gc;
        var len = arr.length - 1;
        arr.forEach((v, i) => {
            if (v.indexOf(')') > -1) {
                v = v.match(/\)\S+/)[0].replace(')', '')
            }
            var c = v.split(':');
            var col = <_IGradientColor>{
                color: 'black'
            };
            if (c[0] != null) {
                col.color = c[0];
            }
            if (c[1] != null) {
                col.offset = relative ? +c[1] * 100 + '%' : c[1] + '';
            } else {
                col.offset = (i / len * 100) + '%';
            }
            if (c[2] != null) {
                col.opacity = c[2];
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
    gradientUnits?: string;
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
    gradientUnits?: string;
    colors: _IGradientColor[];
}

//Represents the gradient color.
interface _IGradientColor {
    color: string;
    offset?: string;
    opacity?: string;
}

/**
 * SVG render engine for FlexChart.
 */
export class SvgRenderEngine extends _SvgRenderEngine {
}

    }
    


    module wijmo.chart {
    




'use strict';

/**
 * Represents the chart legend.
 */
export class Legend {
    _chart: FlexChartBase;
    _position: Position = Position.Right;
    private _title: string = '';
    private _titleAlign: string = 'left';
    private _titlePadding: number = 5;
    private _areas = new Array<any>();
    private _sz: wijmo.Size = new wijmo.Size();
    private _colRowLens = [];
    private _orient:Orientation = Orientation.Auto;
    private _maxSz:number | string;

    /**
     * Initializes a new instance of the {@link Legend} class.
     *
     * @param chart {@link FlexChartBase} that owns this {@link Legend}.
     */
    constructor(chart: FlexChartBase) {
        this._chart = chart;
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets a value that determines whether and where the legend
     * appears in relation to the plot area.
     */
    get position(): Position {
        return this._position;
    }
    set position(value: Position) {
        value = wijmo.asEnum(value, Position);
        if (value != this._position) {
            this._position = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value that determines the title of the legend.
     */
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        if (value != this._title) {
            this._title = wijmo.asString(value, false);
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value that determines the align value of the legend.
     * The value should be 'left', 'center' or 'right'.
     */
    get titleAlign(): string {
        return this._titleAlign;
    }
    set titleAlign(value: string) {
        if (value != this._titleAlign) {
            var align = wijmo.asString(value, false);
            if (align === 'right') {
                this._titleAlign = 'right';
            } else if (align === 'center') {
                this._titleAlign = 'center';
            } else {
                this._titleAlign = 'left';
            }
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value that determines the orientation of the legend.
     */
    get orientation() : Orientation {
        return this._orient;
    }
    set orientation(value: Orientation) {
        value = wijmo.asEnum(value, Orientation);
        if (value != this._orient) {
            this._orient = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets the maximum legend size (width for left or right position and height for top or bottom position).
     * The size can be specified in pixels: maxSize = '100px' or percents: maxSize = '50%'. 
     */
    get maxSize(): number | string {
        return this._maxSz;
    }
    set maxSize(value: number | string) {
        if (value != this._maxSz) {
            if(wijmo.isNumber(value)) {
                this._maxSz = value;
            } else if(wijmo.isString(value)) {
                let s = wijmo.asString(value);
                wijmo.assert( FlexChartBase._endsWith(s, 'px') || FlexChartBase._endsWith(s,'%'), 'number with unit (px or %) expected.')
                this._maxSz = s;
            } else if(value) {
                wijmo.assert(false, 'number or string expected.');
            }
            this._invalidate()
        }
    }

    //--------------------------------------------------------------------------
    //** implementation

    // measures the legend
    _getDesiredSize(engine: IRenderEngine, pos: Position, w: number, h: number): wijmo.Size {

        // no legend? no size.
        if (pos == Position.None) {
            return null;
        }
        var isVertical = this.orientation == Orientation.Auto ?
          pos == Position.Right || pos == Position.Left :
          this.orientation == Orientation.Vertical;

        var size = this._chart._getDesiredLegendSize(engine, isVertical, w, h);
        if (size != null) {
            if (this.title.length > 0) {
                var titleSize = engine.measureString(this.title, 'wj-title', 'wj-legend');
                size.height += titleSize.height + this._titlePadding;
                if (titleSize.width > size.width) {
                    size.width = titleSize.width;
                }
            }
            this._sz = size;
        }
        return size;
    }

    _getPosition(w: number, h: number): Position {
        if (this.position == Position.Auto) {
            return (w >= h) ? Position.Right : Position.Bottom;
        } else {
            return this.position;
        }
    }

    // render the legend
    _render(engine: IRenderEngine, pt: wijmo.Point, pos: Position, w: number, h: number) {
        this._areas = [];
        var isVertical = this.orientation == Orientation.Auto ?
          pos == Position.Right || pos == Position.Left :
          this.orientation == Orientation.Vertical;

        // draw legend area
        engine.fill = 'transparent';
        engine.stroke = null;
        engine.drawRect(pt.x, pt.y, this._sz.width, this._sz.height);

        if (this.title.length) {
            let pt0 = pt.clone();
            let sz = engine.measureString(this.title, 'wj-title`');
            pt0.y += sz.height;
            if (this.titleAlign === 'right') {
                pt0.x = pt.x + w - sz.width;
            } else if (this.titleAlign === 'center') {
                pt0.x = pt.x + 0.5*(w - sz.width);
            }
            engine.drawString(this.title, pt0, 'wj-title');
            let len = sz.height + this._titlePadding;
            pt.y += len;
            h -= len;
        }

        this._chart._renderLegend(engine, pt, this._areas, isVertical, w, h);
    }

    // perform hit-testing on the legend
    _hitTest(pt: wijmo.Point): number {
        var areas = this._areas;
        for (var i = 0; i < areas.length; i++) {
            if (areas[i] && FlexChartBase._contains(areas[i], pt)) {
                return i;
            }
        }
        return null;
    }
    
    private _invalidate() {
        if(this._chart) {
            this._chart.invalidate();
        }
    }

    _getMaxSize(sz:number) : number {
        let max = this.maxSize;
 
        if(wijmo.isNumber(max)) {
            let nsz = wijmo.asNumber(max, true);
            if(nsz > 0) {
                return Math.min( nsz, sz);
            }
        } else {
            let ssz = wijmo.asString(max, true);
            if(ssz) {
                if( FlexChartBase._endsWith( ssz, 'px')) {
                    let nsz = parseFloat(ssz.replace('px',''));
                    if(nsz > 0) {
                        return Math.min( nsz, sz);
                    }
                } else if( FlexChartBase._endsWith( ssz,'%')) {
                    let nsz = parseFloat(ssz.replace('%',''));
                    if(nsz > 0) {
                        return sz * Math.min( nsz, 100) / 100;
                    }
                }
            }
        }

        return 0.5 * sz;
    }
}
    }
    


    module wijmo.chart {
    







'use strict';

/**
 * Represents the chart palette.
 */
export interface _IPalette {
    _getColor(i: number): string;
    _getColorLight(i: number): string;
}

/**
 * Class that represents a data point (with x and y coordinates).
 *
 * X and Y coordinates can be specified as a number or a Date object(time-based data).
 */
export class DataPoint {
    /**
     * Gets or sets X coordinate value of this {@link DataPoint}.
     */
    x: any;

    /**
     * Gets or sets Y coordinate value of this {@link DataPoint}.
     */
    y: any;

    /**
     * Initializes a new instance of the {@link DataPoint} class.
     *
     * @param x X coordinate of the new DataPoint.
     * @param y Y coordinate of the new DataPoint.
     */
    constructor(x: any = 0, y: any = 0) {
        this.x = x;
        this.y = y;
    }

}

/**
 * Provides arguments for {@link Series} events.
 */
export class RenderEventArgs extends wijmo.CancelEventArgs {
    _engine: IRenderEngine;

    /**
     * Initializes a new instance of the {@link RenderEventArgs} class.
     *
     * @param engine ({@link IRenderEngine}) The rendering engine to use.
     */
    constructor(engine: IRenderEngine) {
        super();
        this._engine = engine;
    }

    /**
     * Gets the {@link IRenderEngine} object to use for rendering the chart elements.
     */
    get engine(): IRenderEngine {
        return this._engine;
    }
}

/**
 * Provides arguments for {@link Series} rendering event.
 */
export class SeriesRenderingEventArgs extends RenderEventArgs {
    _index: number;
    _count: number;

    /**
     * Initializes a new instance of the {@link SeriesRenderingEventArgs} class.
     *
     * @param engine ({@link IRenderEngine}) The rendering engine to use.
     * @param index The index of the series to render.
     * @param count Total number of the series to render.
     */
    constructor(engine: IRenderEngine, index: number, count: number) {
        super(engine);
        this._index = index;
        this._count = count;
    }

    /**
     * Gets the index of the series to render.
     */
    get index(): number {
        return this._index;
    }

    /**
     * Gets the total number of series to render.
     */
    get count(): number {
        return this._count;
    }
}

/**
 * Specifies the format of the image with embed base64-encoded binary data.
 */
export enum ImageFormat {
    /** Gets the W3C Portable Network Graphics (PNG) image format. */
    Png,
    /** Gets the Joint Photographic Experts Group (JPEG) image format. */
    Jpeg,
    /** Gets the Scalable Vector Graphics(SVG) image format. */
    Svg
};

/**
 * Specifies what is selected when the user clicks the chart.
 */
export enum SelectionMode {
    /** Select neither series nor data points when the user clicks the chart. */
    None,
    /** Select the whole {@link Series} when the user clicks it on the chart. */
    Series,
    /** Select the data point when the user clicks it on the chart. Since Line, Area, Spline,
     * and SplineArea charts do not render individual data points, nothing is selected with this
     * setting on those chart types. */
    Point
};

/**
 * Specifies the position of an axis or legend on the chart.
 */
export enum Position {
    /** The item is not visible. */
    None,
    /** The item appears to the left of the chart. */
    Left,
    /** The item appears above the chart. */
    Top,
    /** The item appears to the right of the chart. */
    Right,
    /** The item appears below the chart. */
    Bottom,
    /** The item is positioned automatically. */
    Auto
};

/**
 * Specifies the element orientation.
 */
export enum Orientation {
    /** Orientation is selected automatically based on element position. */
    Auto,
    /** Vertical orientation. */
    Vertical,
    /** Horizontal orientation. */
    Horizontal
};

/**
 * The {@link FlexChartBase} control from which the FlexChart and FlexPie derive.
 */
export class FlexChartBase extends wijmo.Control implements _IPalette {
    static _WIDTH = 300;
    static _HEIGHT = 200;
    static _SELECTION_THRESHOLD = 15;
    static _CSS_LEGEND = 'wj-legend';
    static _CSS_HEADER = 'wj-header';
    static _CSS_FOOTER = 'wj-footer';
    static _CSS_TITLE = 'wj-title';
    static _CSS_LABEL = 'wj-label';
    static _CSS_SELECTION = 'wj-state-selected';
    static _CSS_PLOT_AREA = 'wj-plot-area';
    static _FG = '#666';


    // property storage
    _items: any;
    _cv: wijmo.collections.ICollectionView;
    protected _palette: string[] = null;
    private _selectionMode = SelectionMode.None;
    private _itemFormatter: Function;
    _selectionIndex: number;
    _options: any;
    private _plotMargin: any;
    _header: string;
    _headerStyle: any;
    _footer: string;
    _footerStyle: any;
    _legend: Legend;

    _defPalette = Palettes.standard;// ['#5DA5DA', '#FAA43A', '#60BD68', '#E5126F', '#9D722A'];
    _notifyCurrentChanged: boolean = true;
    _rectFooter: wijmo.Rect;
    _rectHeader: wijmo.Rect;
    _rectChart: wijmo.Rect;
    _rectLegend: wijmo.Rect;
    _currentRenderEngine: IRenderEngine;

    _legendHost: SVGGElement = null;

    private _needBind = false;
    private _toShow: any;
    private _toHide: any;
    _tooltip: ChartTooltip;
    _chartRectId: string;
    private _skipLightClr = false;

    //--------------------------------------------------------------------------
    // ** object model

    /**
     * Gets or sets the array or {@link ICollectionView} object that contains the data used to create the chart.
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        if (this._items != value) {

            // raise changing event
            let e = new wijmo.CancelEventArgs();
            if (!this.onItemsSourceChanging(e)) {
                return;
            }

            // unbind current collection view
            if (this._cv) {
                this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                this._cv = null;
            }

            // save new data source and collection view
            this._items = value;
            this._cv = wijmo.asCollectionView(value);

            // bind new collection view
            if (this._cv != null) {
                this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
            }
            this._clearCachedValues();

            // raise changed event
            this.onItemsSourceChanged(e);

            // bind chart
            this._bindChart();
        }
    }

    /**
     * Gets the {@link ICollectionView} object that contains the chart data.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._cv;
    }

    /**
     * Gets or sets an array of default colors to use for displaying each series.
     * 
     * The array contains strings that represents CSS colors. For example:
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
     * There is a set of predefined palettes in the {@link Palettes} class that you can use, for example:
     * <pre>
     * chart.palette = Palettes.coral;
     * </pre>
     */
    get palette(): string[] {
        return this._palette;
    }
    set palette(value: string[]) {
        if (value != this._palette) {
            this._palette = wijmo.asArray(value);
            this._skipLightClr = Palettes._isExtended(this._palette);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the plot margin in pixels.
     *
     * The plot margin represents the area between the edges of the control
     * and the plot area.
     *
     * By default, this value is calculated automatically based on the space 
     * required by the axis labels, but you can override it if you want
     * to control the precise position of the plot area within the control
     * (for example, when aligning multiple chart controls on a page).
     *
     * You may set this property to a numeric value or to a CSS-style
     * margin specification. For example:
     *
     * <pre>
     * // set the plot margin to 20 pixels on all sides
     * chart.plotMargin = 20;
     * // set the plot margin for top, right, bottom, left sides
     * chart.plotMargin = '10 15 20 25';
     * // set the plot margin for top/bottom (10px) and left/right (20px)
     * chart.plotMargin = '10 20';
     * </pre>
     */
    get plotMargin(): any {
        return this._plotMargin;
    }
    set plotMargin(value: any) {
        if (value != this._plotMargin) {
            this._plotMargin = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the chart legend.
     */
    get legend(): Legend {
        return this._legend;
    }
    set legend(value: Legend) {
        if (value != this._legend) {
            this._legend = wijmo.asType(value, Legend);
            if (this._legend != null) {
                this._legend._chart = this;
            }
        }
    }

    /**
     * Gets or sets the text displayed in the chart header.
     */
    get header(): string {
        return this._header;
    }
    set header(value: string) {
        if (value != this._header) {
            this._header = wijmo.asString(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the text displayed in the chart footer.
     */
    get footer(): string {
        return this._footer;
    }
    set footer(value: string) {
        if (value != this._footer) {
            this._footer = wijmo.asString(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the style of the chart header.
     */
    get headerStyle(): any {
        return this._headerStyle;
    }
    set headerStyle(value: any) {
        if (value != this._headerStyle) {
            this._headerStyle = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the style of the chart footer.
     */
    get footerStyle(): any {
        return this._footerStyle;
    }
    set footerStyle(value: any) {
        if (value != this._footerStyle) {
            this._footerStyle = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets an enumerated value indicating whether or what is 
     * selected when the user clicks the chart.
     * 
     * The default value for this property is <b>SelectionMode.None</b>.
     */
    get selectionMode(): SelectionMode {
        return this._selectionMode;
    }
    set selectionMode(value: SelectionMode) {
        value = wijmo.asEnum(value, SelectionMode);
        if (value != this._selectionMode) {
            this._selectionMode = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the item formatter function that allows you to customize 
     * the appearance of the chart elements.
     *
     * If specified, the function should take three parameters: the chart's
     * {@link IRenderEngine} responsible for rendering elements on the chart,
     * a {@link HitTestInfo} parameter that describes the element being rendered,
     * and a function that provides the default rendering for the item.
     * 
     * For example:
     * <pre>
     * itemFormatter: function (engine, hitTestInfo, defaultRenderer) {
     *   var ht = hitTestInfo,
     *       binding = 'downloads';
     *
     *   // check that this is the right series/element
     *   if (ht.series.binding == binding && ht.pointIndex &gt; 0 &&
     *       ht.chartElement == ChartElement.SeriesSymbol) {
     *
     *     // get current and previous values
     *     var chart = ht.series.chart,
     *         items = chart.collectionView.items,
     *         valNow = items[ht.pointIndex][binding],
     *         valPrev = items[ht.pointIndex - 1][binding];
     *
     *     // add line if value is increasing
     *     if (valNow &gt; valPrev) {
     *       var pt1 = chart.dataToPoint(ht.pointIndex, valNow),
     *           pt2 = chart.dataToPoint(ht.pointIndex - 1, valPrev);
     *       engine.drawLine(pt1.x, pt1.y, pt2.x, pt2.y, null, {
     *         stroke: 'gold',
     *         strokeWidth: 6
     *       });
     *     }
     *   }
     *
     *   // render element as usual
     *   defaultRenderer();
     * }
     * </pre>
     * 
     * {@sample: Chart/LineArea/CustomLineSegments/purejs Example}
     */
    get itemFormatter(): Function {
        return this._itemFormatter;
    }
    set itemFormatter(value: Function) {
        if (value != this._itemFormatter) {
            this._itemFormatter = wijmo.asFunction(value);
            this.invalidate();
        }
    }

    /**
     * Occurs before the chart starts rendering data.
     */
    readonly rendering = new wijmo.Event<FlexChartBase, RenderEventArgs>();
    /**
     * Raises the {@link rendering} event.
     *
     * @param e The {@link RenderEventArgs} object used to render the chart.
     */
    onRendering(e: RenderEventArgs) {
        this.rendering.raise(this, e);
    }

    /**
     * Occurs after the chart finishes rendering.
     */
    readonly rendered = new wijmo.Event<FlexChartBase, RenderEventArgs>();
    /**
     * Raises the {@link rendered} event.
     *
     * @param e The {@link RenderEventArgs} object used to render the chart.
     */
    onRendered(e: RenderEventArgs) {
        this.rendered.raise(this, e);
    }

    /**
     * Occurs before the chart is bound to a new items source.
     */
    readonly itemsSourceChanging = new wijmo.Event<FlexChartBase, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link itemsSourceChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onItemsSourceChanging(e: wijmo.CancelEventArgs): boolean {
        this.itemsSourceChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the chart has been bound to a new items source.
     */
    readonly itemsSourceChanged = new wijmo.Event<FlexChartBase, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }

    /**
     * Saves the chart to an image file.
     * 
     * NOTE: This method does not work in IE browsers. If you require IE support,
     * add the <code>flex-chart.render</code> module to the page.
     * 
     * @param filename The filename for the exported image file including extension.
     * Supported types are PNG, JPEG and SVG.
     */
    saveImageToFile(filename: string): void {
        var name, ext, format, fn;

        if (!filename || filename.length === 0 || filename.indexOf('.') === -1) {
            filename = 'image.png';
        }
        fn = filename.split('.');
        name = fn[0];
        ext = fn[1].toLowerCase();
        format = ImageFormat[(ext[0].toUpperCase() + ext.substring(1))];

        this.saveImageToDataUrl(format, dataURI => {
            ExportHelper.downloadImage(dataURI, name, ext);
        });
    }

    /**
     * Saves the chart to an image data url.
     * 
     * NOTE: This method does not work in IE browsers. If you require IE support,
     * add the <code>flex-chart.render</code> module to the page.
     *
     * @param format The {@link ImageFormat} for the exported image.
     * @param done A function to be called after data url is generated. The function gets passed the data url as its argument. 
     */
    saveImageToDataUrl(format: ImageFormat, done: Function): void {
        var form = wijmo.asEnum(format, ImageFormat, false),
            f = ImageFormat[form].toLowerCase(),
            dataURI;

        if (f && f.length) {
            this._exportToImage(f, uri => {
                done.call(done, uri);
            });
        }
    }

    _exportToImage(extension, processDataURI) {
        var image = new Image(),
            ele = this._currentRenderEngine.element,
            dataUrl;

        dataUrl = ExportHelper.getDataUri(ele, this);
        if (extension === 'svg') {
            processDataURI.call(null, dataUrl);
        } else {
            image.onload = () => {
                var canvas = document.createElement('canvas'),
                    node: any = ele.parentNode || ele,
                    rect = wijmo.getElementRect(node),
                    uri;

                canvas.width = rect.width;
                canvas.height = rect.height;
                var context = canvas.getContext('2d');

                //fill background
                let bg = this._bgColor(this.hostElement);
                if (this._isTransparent(bg)) {
                    bg = '#ffffff';
                }
                context.fillStyle = bg;
                context.fillRect(0, 0, rect.width, rect.height);

                var left = window.getComputedStyle(node, null).getPropertyValue('padding-left').replace('px', '');
                var top = window.getComputedStyle(node, null).getPropertyValue('padding-top').replace('px', '');
                context.drawImage(image, +left || 0, +top || 0);

                uri = canvas.toDataURL('image/' + extension);
                processDataURI.call(null, uri);
                canvas = null;
            }
            image.src = dataUrl;
        }
    }

    /**
     * Refreshes the chart.
     *
     * @param fullUpdate A value indicating whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {

        // call base class to suppress any pending invalidations
        super.refresh(fullUpdate);

        // update the chart
        if (!this.isUpdating) {
            this._refreshChart();
        }
    }

    /**
     * Occurs after the selection changes, whether programmatically
     * or when the user clicks the chart. This is useful, for example,
     * when you want to update details in a textbox showing the current
     * selection.
     */
    readonly selectionChanged = new wijmo.Event<FlexChartBase, wijmo.EventArgs>();

    /**
     * Raises the {@link selectionChanged} event.
     */
    onSelectionChanged(e?: wijmo.EventArgs) {
        this.selectionChanged.raise(this, e);
    }

    onLostFocus(e?: wijmo.EventArgs) {
        if (this._tooltip && this._tooltip.isVisible) {
            this._tooltip.hide();
        }
        super.onLostFocus(e);
    }

    //--------------------------------------------------------------------------
    // implementation

    // updates chart to sync with data source
    private _cvCollectionChanged(sender, e) {
        this._clearCachedValues();
        this._bindChart();
    }

    // updates selection to sync with data source
    private _cvCurrentChanged(sender, e) {
        if (this._notifyCurrentChanged) {
            this._bindChart();
        }
    }

    _bgColor(el: Element): string {
        if (!el) {
            return 'transparent';
        }

        let bg = getComputedStyle(el).backgroundColor;
        if (this._isTransparent(bg)) {
            return this._bgColor(el.parentElement);
        } else {
            return bg;
        }
    }

    _isTransparent(c: string) {
        let clr = new wijmo.Color(c);
        return clr.a == 0 && clr.b == 0 && clr.g == 0 && clr.r == 0;
    }

    // IPalette 

    /**
    * Gets a color from the palette by index.
    *
    * @param index The index of the color in the palette.
    */
    _getColor(index: number): string {
        var palette = this._defPalette;
        if (this._palette != null && this._palette.length > 0) {
            palette = this._palette;
        }
        return palette[index % palette.length];
    }

    /**
     * Gets a lighter color from the palette by index.
     *
     * @param index The index of the color in the palette.
     */
    _getColorLight(index: number): string {
        let clr = this._getColor(index);
        if(!this._skipLightClr) {
            clr = this._getLightColor(clr);
        }
        return clr;
    }

    /**
     * Gets a lighter color from the palette by color string.
     *
     * @param color The color in the palette.
     */
    _getLightColor(color: string) {
        var c = new wijmo.Color(color);

        if (c != null && color.indexOf('-') === -1) {
            if (c.a == 1 && color.indexOf('rgba') == -1 && color.indexOf('hsla') == -1) {
                c.a *= 0.7;
            }
            color = c.toString();
        }
        return color;
    }

    // abstract

    // binds the chart to the current data source.
    _bindChart() {
        this._needBind = true;
        this.invalidate();
    }

    _clearCachedValues() {
    }

    _renderEls(engine: IRenderEngine, sz: wijmo.Size, applyElement = true, bg: string = null, hidden: boolean = false) {
        let w = sz.width,
            h = sz.height;

        //if width is 0, don't draw chart.
        if (w == 0) {
            return;
        }

        if (isNaN(w) || w < 0) {
            w = FlexChartBase._WIDTH;
        }
        if (h <= 0 || isNaN(h)) {
            h = FlexChartBase._HEIGHT;
        }

        let hasSz = w > 0 && h > 0;

        if (hasSz) {
            engine.setViewportSize(w, h);
        }

        engine.beginRender();
        engine.cssPriority = true;

        if (hasSz) {
            this._rectChart = new wijmo.Rect(0, 0, w, h);
            this._prepareRender();

            if (bg) {
                let str = engine.stroke, fill = engine.fill;
                engine.fill = bg;
                engine.stroke = null;
                engine.drawRect(0, 0, w, h);
                engine.fill = fill;
                engine.stroke = str;
            }

            let rect = new wijmo.Rect(0, 0, w, h);

            //add chart rect to header/footer/axis/legend groups for IE.
            this._chartRectId = 'chartRect' + (1000000 * Math.random()).toFixed();
            engine.addClipRect(rect, this._chartRectId);

            this._renderHeader(engine, rect);
            this._renderFooter(engine, rect);
            this._renderLegends(engine, rect);

            this._renderChart(engine, rect, applyElement);
        }

        engine.endRender();
    }

    private _h: number;

    _render(engine: IRenderEngine, applyElement = true, bg: string = null) {
        let sz = this._getHostSize();

        // TFS 425513
        if (this._h) {
            let d = sz.height - this._h;
            if (d >= 4 && d <= 6 && this._isPCUnit('height') !== false) {
                sz.height = this._h;
            }
        }
        this._h = sz.height;
        this._renderEls(engine, sz, applyElement, bg);
    }

    _isPCUnit(prop: string): boolean {
        let result = null;
        let host: any = this.hostElement;
        if (host && host.computedStyleMap) {
            let map = host.computedStyleMap();
            if (map) {
                let val = map.get(prop);
                if (val) {
                    result = val.unit == 'percent';
                }
            }
        }

        return result;
    }

    _renderHidden(sz: wijmo.Size = null, bg: string = null): any {
        let div = document.createElement('div');
        wijmo.addClass(div, this.hostElement.getAttribute('class') || '');
        div.style.visibility = 'hidden';
        let eng = new _SvgRenderEngine(div);
        document.body.appendChild(div);

        if (!sz) {
            let cstyle = this._getHostComputedStyle();
            let w = 0, h = 0;
            if (cstyle) {
                w = this._parsePx(cstyle.width);
                h = this._parsePx(cstyle.height);

                if (w == 0) {
                    w = FlexChartBase._WIDTH;
                }
                if (h == 0) {
                    h = FlexChartBase._HEIGHT;
                }

                w -= this._parsePx(cstyle.paddingLeft);
                w -= this._parsePx(cstyle.paddingRight);
                h -= this._parsePx(cstyle.paddingTop);
                h -= this._parsePx(cstyle.paddingBottom);

                w -= this._parsePx(cstyle.borderLeftWidth);
                w -= this._parsePx(cstyle.borderRightWidth);
                h -= this._parsePx(cstyle.borderTopWidth);
                h -= this._parsePx(cstyle.borderBottomWidth);
            }
            if (w == 0) {
                w = FlexChartBase._WIDTH;
            }
            if (h == 0) {
                h = FlexChartBase._HEIGHT;
            }
            sz = new wijmo.Size(w, h);
        }
        this._renderEls(eng, sz, true, bg, true);
        wijmo.removeChild(div);
        return eng.element;
    }

    _renderHeader(engine: IRenderEngine, rect: wijmo.Rect) {
        engine.startGroup(FlexChartBase._CSS_HEADER, this._chartRectId);
        rect = this._drawTitle(engine, rect, this.header, this.headerStyle, false);
        engine.endGroup();
    }

    _renderFooter(engine: IRenderEngine, rect: wijmo.Rect) {
        engine.startGroup(FlexChartBase._CSS_FOOTER, this._chartRectId);
        rect = this._drawTitle(engine, rect, this.footer, this.footerStyle, true);
        engine.endGroup();
    }

    _renderLegends(engine: IRenderEngine, rect: wijmo.Rect) {
        var legend = this.legend,
            lsz: wijmo.Size, lpos: wijmo.Point,
            w = rect.width,
            h = rect.height,
            legpos = legend._getPosition(w, h);

        lsz = legend._getDesiredSize(engine, legpos, w, h);
        switch (legpos) {
            case Position.Right:
                w -= lsz.width;
                lpos = new wijmo.Point(w, rect.top + 0.5 * (h - lsz.height));
                break;
            case Position.Left:
                rect.left += lsz.width;
                w -= lsz.width;
                lpos = new wijmo.Point(0, rect.top + 0.5 * (h - lsz.height));
                break;
            case Position.Top:
                h -= lsz.height;
                lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top);
                rect.top += lsz.height;
                break;
            case Position.Bottom:
                h -= lsz.height;
                lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top + h);
                break;
        }

        rect.width = w;
        rect.height = h;
        if (lsz) {
            this._rectLegend = new wijmo.Rect(lpos.x, lpos.y, lsz.width, lsz.height);
            let lrcid = 'legRect' + (1000000 * Math.random()).toFixed();
            engine.addClipRect(this._rectLegend, lrcid);
            this._legendHost = engine.startGroup(FlexChartBase._CSS_LEGEND, lrcid);
            this.legend._render(engine, lpos, legpos, lsz.width, lsz.height);
            engine.endGroup();
        } else {
            this._legendHost = null;
            this._rectLegend = null;
        }
    }

    _prepareRender() {
    }

    _renderChart(engine: IRenderEngine, rect: wijmo.Rect, applyElement: boolean) {
    }

    _performBind() {
    }

    _getDesiredLegendSize(engine: IRenderEngine, isVertical: boolean, width: number, height: number): wijmo.Size {
        return null;
    }

    _renderLegend(engine: IRenderEngine, pt: wijmo.Point, areas: any[], isVertical: boolean, width: number, height: number) {
    }

    _getHitTestItem(index: number) {
        return null;
    }

    _getHitTestValue(index: number, gi?: number) {
        return null;
    }

    _getHitTestLabel(index: number) {
        return null;
    }

    // render
    _refreshChart() {
        if (this._needBind) {
            this._needBind = false;
            this._performBind();
        }
        if (this.hostElement) {
            this._render(this._currentRenderEngine);
        }
    }

    _drawTitle(engine: IRenderEngine, rect: wijmo.Rect, title: string, style: any, isFooter: boolean): wijmo.Rect {
        var lblClass = FlexChartBase._CSS_TITLE;
        var groupClass = isFooter ? FlexChartBase._CSS_FOOTER : FlexChartBase._CSS_HEADER;

        var tsz: wijmo.Size = null;
        if (isFooter) {
            this._rectFooter = null;
        }
        else {
            this._rectHeader = null;
        }

        if (title != null) {
            var fontSize = null;
            var fg = null;
            var fontFamily = null;
            var halign = null;

            if (style) {
                if (style.fontSize) {
                    fontSize = style.fontSize;
                }
                if (style.foreground) {
                    fg = style.foreground;
                }
                if (style.fill) {
                    fg = style.fill;
                }
                if (style.fontFamily) {
                    fontFamily = style.fontFamily;
                }
                if (style.halign) {
                    halign = style.halign;
                }
            }

            engine.fontSize = fontSize;
            engine.fontFamily = fontFamily;

            tsz = engine.measureString(title, lblClass, groupClass, style);
            rect.height -= tsz.height;

            if (!fg) {
                fg = FlexChartBase._FG;
            }

            engine.textFill = fg;
            if (isFooter) {

                if (halign == 'left') {
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left, rect.bottom), 0, 0, lblClass, groupClass, style);
                } else if (halign == 'right') {
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left + rect.width, rect.bottom), 2, 0, lblClass, groupClass, style);
                } else { // default center
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left + 0.5 * rect.width, rect.bottom), 1, 0, lblClass, groupClass, style);
                }

                this._rectFooter = new wijmo.Rect(rect.left, rect.bottom, rect.width, tsz.height);
            } else {
                this._rectHeader = new wijmo.Rect(rect.left, rect.top, rect.width, tsz.height);

                rect.top += tsz.height;
                if (halign == 'left') {
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left, 0), 0, 0, lblClass, groupClass, style);
                } else if (halign == 'right') {
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left + rect.width, 0), 2, 0, lblClass, groupClass, style);
                } else { // default center
                    FlexChartBase._renderText(engine, title, new wijmo.Point(rect.left + 0.5 * rect.width, 0), 1, 0, lblClass, groupClass, style);
                }
            }

            engine.textFill = null;
            engine.fontSize = null;
            engine.fontFamily = null;
        }
        return rect;
    }

    /**
     * Converts page coordinates to control coordinates.
     *
     * @param pt The point of page coordinates or x value
         of page coordinates. 
        * @param y The y value of page coordinates. Its value
            should be a number, if pt is a number type. However,
            the y parameter is optional when pt is Point type. 
        */
    pageToControl(pt: any, y?: number): wijmo.Point {
        return this._toControl(pt, y);
    }

    // convert page coordinates to control
    _toControl(pt: any, y?: number): wijmo.Point {
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y) as well
            pt = new wijmo.Point(pt, y);
        } else if (pt instanceof MouseEvent) {
            pt = wijmo.mouseToPage(pt);
        }
        wijmo.asType(pt, wijmo.Point);

        // control coords
        var cpt = pt.clone();
        var offset = this._getHostOffset();
        cpt.x -= offset.x;
        cpt.y -= offset.y;

        let svg = this._currentRenderEngine ? this._currentRenderEngine.element : null;
        if (svg != null) {
            let r = svg.getBoundingClientRect();
            let w = parseFloat(svg.getAttribute('width'));
            let h = parseFloat(svg.getAttribute('height'));
            if (r.width != w) {
                cpt.x *= w / r.width;
            }
            if (r.height != h) {
                cpt.y *= h / r.height;
            }
        }

        var cstyle = this._getHostComputedStyle();
        if (cstyle) {
            var padLeft = parseInt(cstyle.paddingLeft.replace('px', ''));
            if (padLeft && !isNaN(padLeft)) {
                cpt.x -= padLeft;
            }
            var padTop = parseInt(cstyle.paddingTop.replace('px', ''));
            if (padTop && !isNaN(padTop)) {
                cpt.y -= padTop;
            }
        }

        return cpt;
    }

    _highlightItems(items, cls, selected: boolean) {
        if (selected) {
            for (var i = 0; i < items.length; i++) {
                wijmo.addClass(items[i], cls);
            }
        } else {
            for (var i = 0; i < items.length; i++) {
                wijmo.removeClass(items[i], cls);
            }
        }
    }

    _parseMargin(value: any): any {
        var margins = {};
        if (wijmo.isNumber(value) && !isNaN(value)) {
            margins['top'] = margins['bottom'] = margins['left'] = margins['right'] = wijmo.asNumber(value);
        } else if (wijmo.isString(value)) {

            var s = wijmo.asString(value);
            var ss = s.split(' ', 4);
            var top = NaN,
                bottom = NaN,
                left = NaN,
                right = NaN;

            if (ss) {
                if (ss.length == 4) {
                    top = parseFloat(ss[0]);
                    right = parseFloat(ss[1]);
                    bottom = parseFloat(ss[2]);
                    left = parseFloat(ss[3]);
                } else if (ss.length == 2) {
                    top = bottom = parseFloat(ss[0]);
                    left = right = parseFloat(ss[1]);
                } else if (ss.length == 1) {
                    top = bottom = left = right = parseFloat(ss[1]);
                }

                if (!isNaN(top)) {
                    margins['top'] = top;
                }
                if (!isNaN(bottom)) {
                    margins['bottom'] = bottom;
                }
                if (!isNaN(left)) {
                    margins['left'] = left;
                }
                if (!isNaN(right)) {
                    margins['right'] = right;
                }
            }
        }

        return margins;
    }

    // shows an automatic tooltip
    _showToolTip(content, rect) {
        var self = this,
            showDelay = this._tooltip.showDelay;
        self._clearTimeouts();
        if (self.isDisabled) {
            return;
        }
        if (!content) {
            self._tooltip.hide();
        }
        if (showDelay > 0) {
            self._toShow = setTimeout(function () {
                self._tooltip.show(self.hostElement, content, rect);
                if (self._tooltip.hideDelay > 0) {
                    self._toHide = setTimeout(function () {
                        self._tooltip.hide();
                    }, self._tooltip.hideDelay);
                }
            }, showDelay);
        } else {
            self._tooltip.show(self.hostElement, content, rect);
            if (self._tooltip.hideDelay > 0) {
                self._toHide = setTimeout(function () {
                    self._tooltip.hide();
                }, self._tooltip.hideDelay);
            }
        }
    }

    // hides an automatic tooltip
    _hideToolTip() {
        this._clearTimeouts();
        this._tooltip.hide();
    }

    // clears the timeouts used to show and hide automatic tooltips
    private _clearTimeouts() {
        if (this._toShow) {
            clearTimeout(this._toShow);
            this._toShow = null;
        }
        if (this._toHide) {
            clearTimeout(this._toHide);
            this._toHide = null;
        }
    }

    _getHostOffset(): wijmo.Point {
        var rect = wijmo.getElementRect(this.hostElement);
        return new wijmo.Point(rect.left, rect.top);
    }

    _getHostSize(): wijmo.Size {
        var sz = new wijmo.Size();

        var host = this.hostElement;

        var cstyle = this._getHostComputedStyle();
        var w = host.offsetWidth,
            h = host.offsetHeight;

        if (cstyle) {
            w -= this._parsePx(cstyle.paddingLeft);
            w -= this._parsePx(cstyle.paddingRight);
            h -= this._parsePx(cstyle.paddingTop);
            h -= this._parsePx(cstyle.paddingBottom);

            w -= this._parsePx(cstyle.borderLeftWidth);
            w -= this._parsePx(cstyle.borderRightWidth);
            h -= this._parsePx(cstyle.borderTopWidth);
            h -= this._parsePx(cstyle.borderBottomWidth);

            sz.width = w;
            sz.height = h;
        }

        return sz;
    }

    _parsePx(s: string): number {
        let n = parseFloat(s.replace('px', ''));
        return isNaN(n) ? 0 : n;
    }

    _getHostComputedStyle(): CSSStyleDeclaration {
        var host = this.hostElement;
        if (host && host.ownerDocument && host.ownerDocument.defaultView) {
            return host.ownerDocument.defaultView.getComputedStyle(this.hostElement);
        }
        return null;
    }

    _find(elem: SVGElement, names: string[]): any[] {
        var found = [];

        for (var i = 0; i < elem.childElementCount; i++) {
            var child = elem.childNodes.item(i);
            if (names.indexOf(child.nodeName) >= 0) {
                found.push(child);
            } else {
                var items = this._find(<SVGElement>child, names);
                if (items.length > 0) {
                    for (var j = 0; j < items.length; j++)
                        found.push(items[j]);
                }
            }
        }

        return found;
    }

    _getLegendSize(sz: number, lsz: number): number {
        return Math.min(lsz, this.legend._getMaxSize(sz));
    }

    //---------------------------------------------------------------------
    // tools

    static _contains(rect: wijmo.Rect, pt: wijmo.Point): boolean {
        if (rect && pt) {
            return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
        }

        return false;
    }

    static _intersects(rect1: wijmo.Rect, rect2: wijmo.Rect): boolean {
        if (rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top) {
            return false;
        }

        return true;
    }


    static _epoch = new Date(1899, 11, 30).getTime();
    static _msPerDay = 86400000;

    static _toOADate(date: Date): number {
        return date.valueOf();
    }

    static _fromOADate(val: number): Date {
        return new Date(val);
    }

    static _renderText(engine: IRenderEngine, text: string, pos: wijmo.Point, halign, valign, className?: string, groupName?: string, style?: any, test?: any): wijmo.Rect {
        var sz = engine.measureString(text, className, groupName, style);
        var x = pos.x;
        var y = pos.y;

        switch (halign) {
            // center
            case 1:
                x -= 0.5 * sz.width;
                break;
            // right
            case 2:
                x -= sz.width;
                break;
        }
        switch (valign) {
            // center
            case 1:
                y += 0.5 * sz.height;
                break;
            // top
            case 0:
                y += sz.height;
                break;
        }

        var rect = new wijmo.Rect(x, y - sz.height, sz.width, sz.height);
        if (test) {
            if (test(rect)) {
                engine.drawString(text, new wijmo.Point(x, y), className, style);
                return rect;
            }
            else
                return null;
        }
        else {
            engine.drawString(text, new wijmo.Point(x, y), className, style);
            return rect;
        }
    }

    static _renderRotatedText(engine: IRenderEngine, text: string, pos: wijmo.Point, halign, valign,
        center: wijmo.Point, angle: number, className: string, groupClassName?: string, style?: any) {
        var sz = engine.measureString(text, className, groupClassName, style);
        var x = pos.x;
        var y = pos.y;

        switch (halign) {
            case 1:
                x -= 0.5 * sz.width;
                break;
            case 2:
                x -= sz.width;
                break;
        }
        switch (valign) {
            case 1:
                y += 0.5 * sz.height;
                break;
            case 0:
                y += sz.height;
                break;
        }

        return engine.drawStringRotated(text, new wijmo.Point(x, y), center, angle, className, style);
    }

    static _endsWith(str: string, suffix: string): boolean {
        if (str && suffix) {
            let expectedPos = str.length - suffix.length;
            return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
        } else {
            return false;
        }
    }
}

export interface _IHitArea {
    contains(pt: wijmo.Point): boolean;
    distance(pt: wijmo.Point): number;
    tag: any;
    ignoreLabel: boolean;
}

export class _KeyWords {
    private _keys = {};

    constructor() {
        this._keys['seriesName'] = null;
        this._keys['pointIndex'] = null;
        this._keys['x'] = null;
        this._keys['y'] = null;
        this._keys['value'] = null;
        this._keys['name'] = null;
    }

    replace(s: string, ht: HitTestInfo): string {
        var kw = this;
        return wijmo.format(s,
            {// empty data - own get/format function
            },
            function (data, name, fmt, val) {
                return kw.getValue(name, ht, fmt);
            });
    }

    getValue(key: string, ht: HitTestInfo, fmt?: string): string {

        // handle pre-defined keywords
        switch (key) {
            case 'seriesName':
                return ht.series ? ht.series.name : '';
            case 'pointIndex':
                return ht.pointIndex != null ? ht.pointIndex.toFixed() : '';
            case 'x':
                return fmt ? wijmo.Globalize.format(ht.x, fmt) : ht._xfmt;
            case 'y':
                return fmt ? wijmo.Globalize.format(ht.y, fmt) : ht._yfmt;
            case 'value':
                return fmt ? wijmo.Globalize.format(ht.value, fmt) : ht._getValueFmt(); // ht.value;
            case 'name':
                return ht.name;
        }

        // look for key in data item
        if (ht.item) {
            if (key.indexOf('item.') == 0) { // strip 'item.' from key (to allow 'item.name' for example)
                key = key.substr(5);
            }
            let val = ht.item[key];
            if (!wijmo.isUndefined(val)) {
                return fmt ? wijmo.Globalize.format(val, fmt) : val;
            }
        }

        // no match
        return '';
    }
}

class ExportHelper {
    static doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    static xmlns = 'http://www.w3.org/2000/xmlns/';

    static downloadImage(dataUrl, name, ext) {
        var a = document.createElement('a'),
            contentType = 'image/' + ext;
        if (navigator.msSaveOrOpenBlob) {
            dataUrl = dataUrl.substring(dataUrl.indexOf(',') + 1);

            var byteCharacters = atob(dataUrl),
                byteArrays = [],
                sliceSize = 512,
                offset, slice, blob;

            for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            blob = new Blob(byteArrays, { type: contentType });
            navigator.msSaveOrOpenBlob(blob, name + '.' + ext);
        } else {
            (<any>a).download = name + '.' + ext;
            a.href = dataUrl;
            document.body.appendChild(a);
            a.addEventListener("click", function (e) {
                wijmo.removeChild(a);
            });
            a.click();
        }
    }

    static getDataUri(ele, chart: FlexChartBase) {
        var outer = document.createElement('div'),
            clone = ele.cloneNode(true),
            rect, width, height, viewBoxWidth, viewBoxHeight, box, css, parent, s, defs;
        let hidden = false;

        if (ele.tagName == 'svg') {
            rect = wijmo.getElementRect(ele.parentNode || ele);
            width = rect.width || 0;
            height = rect.height || 0;

            // hidden chart
            if (width == 0) {
                hidden = true;
                // width = ele.width.baseVal.value;
            }
            //if (height == 0) {
            //    height = ele.height.baseVal.value;
            //}

            viewBoxWidth = ele.viewBox.baseVal && ele.viewBox.baseVal.width !== 0 ? ele.viewBox.baseVal.width : width;
            viewBoxHeight = ele.viewBox.baseVal && ele.viewBox.baseVal.height !== 0 ? ele.viewBox.baseVal.height : height;
        } else {
            box = ele.getBBox();
            width = box.x + box.width;
            height = box.y + box.height;
            clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));
            viewBoxWidth = width;
            viewBoxHeight = height;

            parent = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            parent.appendChild(clone)
            clone = parent;
        }

        if (hidden) {
            let e = chart._renderHidden();
            let cstyle = chart._getHostComputedStyle();
            let w = 0, h = 0;
            if (cstyle) {
                w = chart._parsePx(cstyle.width);
                h = chart._parsePx(cstyle.height);
            }
            if (w == 0) {
                w = FlexChartBase._WIDTH;
            }
            if (h == 0) {
                h = FlexChartBase._HEIGHT;
            }

            viewBoxWidth = width = w;
            viewBoxHeight = height = h;
            clone = e.cloneNode(true);
        }

        clone.setAttribute('version', '1.1');
        clone.setAttributeNS(ExportHelper.xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
        clone.setAttributeNS(ExportHelper.xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        clone.setAttribute('width', width);
        clone.setAttribute('height', height);
        clone.setAttribute('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);

        //add FlexChart's class to clone element.
        wijmo.addClass(clone, (ele.parentNode && ele.parentNode.getAttribute('class')) || '');
        outer.appendChild(clone);

        css = ExportHelper.getStyles(ele);

        // remove attributes since they aren't applied correctly for svg element
        // WJM-20057
        //css += '.wj-flexchart' + " { " + 'margin:0px;padding:0px;border:none;' + 'width:' + width + 'px;' + 'height:' + height + 'px;'  + " }\n";
        css += `.wj-flexchart{margin:0px;padding:0px;border:none;width:${width}px;height:${height}px;}\n`;

        s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
        defs = document.createElement('defs');
        defs.appendChild(s);
        clone.insertBefore(defs, clone.firstChild);

        if (!wijmo.isIE()) {
            clone.querySelectorAll('foreignObject').forEach(e => {
                clone.removeChild(e);
            });;
        }

        let canvas = (<any>chart._currentRenderEngine).canvas;
        if (canvas) {
            let img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('width', canvas.width);
            img.setAttribute('height', canvas.height);
            img.setAttribute('href', canvas.toDataURL());
            clone.insertBefore(img, clone.firstChild);
            chart.invalidate(); // TFS 467529 chart seems need to be repainted after exporting webgl canvas
        }

        // encode then decode to handle `btoa` on Unicode; see MDN for `btoa`.
        return 'data:image/svg+xml;base64,' + window.btoa((<any>window).unescape(encodeURIComponent(ExportHelper.doctype + outer.innerHTML)));
    }

    static getStyles(ele) {
        var css = '',
            styleSheets = document.styleSheets;

        if (styleSheets == null || styleSheets.length === 0) {
            return null;
        }

        [].forEach.call(styleSheets, (sheet => {
            //TODO: href, or other external resources
            var cssRules;
            try {
                if (sheet.cssRules == null || sheet.cssRules.length === 0) {
                    return true;
                }
            }
            //Note that SecurityError exception is specific to Firefox.
            catch (e) {
                if (e.name == 'SecurityError') {
                    console.log("SecurityError. Can't read: " + sheet.href);
                    return true;
                }
            }
            cssRules = sheet.cssRules;

            [].forEach.call(cssRules, (rule => {
                var style = rule.style,
                    match;

                if (style == null) {
                    return true;
                }

                try {
                    match = rule.selectorText == '.wj-flexchart' || ele.querySelector(rule.selectorText);
                } catch (e) {
                    console.warn('Invalid CSS selector "' + rule.selectorText + '"', e);
                }

                if (match) {
                    css += rule.selectorText + " { " + style.cssText + " }\n";
                } else if (rule.cssText.match(/^@font-face/)) {
                    css += rule.cssText + '\n';
                }
            }));
        }));
        return css;
    }
}

/**
 * Extends the {@link Tooltip} class to provide chart tooltips.
 */
export class ChartTooltip extends wijmo.Tooltip {
    private _content: any = '<b>{seriesName}</b><br/>{x} {y}';
    private _threshold: number = 15;

    /**
     * Initializes a new instance of the {@link ChartTooltip} class.
     */
    constructor() {
        super();
    }

    /**
     * Gets or sets the tooltip content.
     *
     * The tooltip content can be specified as a string or as a function that
     * takes a {@link HitTestInfo} object as a parameter.
     *
     * When the tooltip content is a string, it may contain any of the following
     * parameters:
     *
     * <ul>
     *  <li><b>propertyName</b>:    Any property of the data object represented by the point.</li>
     *  <li><b>seriesName</b>:      Name of the series that contains the data point (FlexChart only).</li>
     *  <li><b>pointIndex</b>:      Index of the data point.</li>
     *  <li><b>value</b>:           <b>Value</b> of the data point (y-value for {@link FlexChart}, item value for {@link FlexPie}).</li>
     *  <li><b>x</b>:               <b>x</b>-value of the data point (FlexChart only).</li>
     *  <li><b>y</b>:               <b>y</b>-value of the data point (FlexChart only).</li>
     *  <li><b>name</b>:            <b>Name</b> of the data point (x-value for {@link FlexChart} or legend entry for {@link FlexPie}).</li>
     * </ul>
     *
     * Parameters must be enclosed in single curly brackets. For example:
     *
     * <pre>
     *   // 'country' and 'sales' are properties of the data object.
     *   chart.tooltip.content = '{country}, sales:{sales}';
     * </pre>
     *
     * The next example shows how to set the tooltip content using a function.
     *
     *  <pre>
     *   // Set the tooltip content
     *   chart.tooltip.content = function (ht) {
     *     return ht.name + ":" + ht.value.toFixed();
     *   }
     * </pre>
     */
    get content(): any {
        return this._content;
    }
    set content(value: any) {
        if (value != this._content) {
            this._content = value;
        }
    }

    /**
     * Gets or sets the maximum distance from the element to display the tooltip.
     */
    get threshold(): number {
        return this._threshold;
    }
    set threshold(value: number) {
        if (value != this._threshold) {
            this._threshold = wijmo.asNumber(value);
        }
    }

    /**
     * Shows the tooltip with the specified content, next to the specified element.
     *
     * @param element Element, element ID, or control that the tooltip explains.
     * @param content Tooltip content or ID of the element that contains the tooltip content.
     * @param bounds Optional element that defines the bounds of the area that the tooltip 
     * targets. If not provided, the bounds of the element are used (as reported by the
     * <b>getBoundingClientRect</b> method).
     */
    show(element: any, content: string, bounds?: wijmo.Rect) {
        super.show(element, content, bounds);
        let tip = ChartTooltip._eTip;
        if (tip && tip.style) {
            tip.style.pointerEvents = 'none';
        }
    }
}
    }
    


    module wijmo.chart {
    





'use strict';

/**
 * Specifies the position of data labels on the chart.
 */
export enum LabelPosition {
    /** No data labels appear. */
    None = 0,
    /** The labels appear to the left of the data points. */
    Left = 1,
    /** The labels appear above the data points. */
    Top = 2,
    /** The labels appear to the right of the data points. */
    Right = 3,
    /** The labels appear below the data points. */
    Bottom = 4,
    /** The labels appear centered on the data points. */
    Center = 5
};

/**
 * Specifies the position of data labels on the pie chart.
 */
export enum PieLabelPosition {
    /** No data labels. */
    None = 0,
    /** The label appears inside the pie slice. */
    Inside = 1,
    /** The item appears at the center of the pie slice. */
    Center = 2,
    /** The item appears outside the pie slice. */
    Outside = 3,
    /** The item appears inside the pie slice and depends of its angle. */
    Radial = 4,
    /** The item appears inside the pie slice and has circular direction. */
    Circular = 5
};

/**
 * Provides arguments for {@link DataLabel} rendering event.
 */
export class DataLabelRenderEventArgs extends RenderEventArgs {
    private _ht: HitTestInfo;
    private _pt: wijmo.Point;
    private _text: string;

    /**
     * Initializes a new instance of the {@link DataLabelRenderEventArgs} class.
     *
     * @param engine ({@link IRenderEngine}) The rendering engine to use.
     * @param ht The hit test information.
     * @param pt The reference point.
     * @param text The label text.
     */
    constructor(engine: IRenderEngine, ht:HitTestInfo,  pt:wijmo.Point, text:string) {
        super(engine);
        this._ht = ht;
        this._pt = pt;
        this._text = text;
    }

    /**
     * Gets or sets a value that indicates whether the event should be cancelled.
     */
    cancel = false;

    /**
     * Gets the point associated with the label in control coordinates. 
     */
    get point():wijmo.Point {
        return this._pt;
    }

    /**
     * Gets or sets the label text.
     */
    get text(): string {
        return this._text;
    }
    set text(value: string) {
        this._text = wijmo.asString(value);
    }

    /**
     * Gets the hit test information.
     */
    get hitTestInfo(): HitTestInfo {
        return this._ht;
    }
}

/**
* Represents the base abstract class for the {@link DataLabel} and the {@link PieDataLabel} classes.
*/
export class DataLabelBase {
    private _content: any;
    _chart: FlexChartBase;
    private _bdr: boolean;
    private _line: boolean;
    private _off:number;

    /**
     * Gets or sets the content of data labels.
     * 
     * The content can be specified as a string or as a function that
     * takes {@link HitTestInfo} object as a parameter.
     *
     * When the label content is a string, it can contain any of the following
     * parameters:
     *
     * <ul>
     *  <li><b>seriesName</b>: Name of the series that contains the data point (FlexChart only).</li>
     *  <li><b>pointIndex</b>: Index of the data point.</li>
     *  <li><b>value</b>: <b>Value</b> of the data point.</li>
     *  <li><b>x</b>: <b>x</b>-value of the data point (FlexChart only).</li>
     *  <li><b>y</b>: <b>y</b>-value of the data point (FlexChart only).</li>
     *  <li><b>name</b>: <b>Name</b> of the data point.</li>
     *  <li><b>propertyName</b>: any property of data object.</li>
     * </ul>
     * 
     * The parameter must be enclosed in curly brackets, for example 'x={x}, y={y}'.
     *
     * In the following example, we show the y value of the data point in the labels.
     *
     * <pre> 
     *  // Create a chart and show y data in labels positioned above the data point.
     *  var chart = new FlexChart('#theChart');
     *  chart.initialize({
     *      itemsSource: data,
     *      bindingX: 'country',
     *      series: [
     *          { name: 'Sales', binding: 'sales' },
     *          { name: 'Expenses', binding: 'expenses' },
     *          { name: 'Downloads', binding: 'downloads' }],
     *  });
     *  chart.dataLabel.position = "Top";
     *  chart.dataLabel.content = "{country} {seriesName}:{y}";
     * </pre>
     *
     * The next example shows how to set data label content using a function.
     *
     * <pre> 
     *  // Set the data label content 
     *  chart.dataLabel.content = function (ht) {
     *    return ht.name + ":" + ht.value.toFixed();
     *  }
     * </pre>
     *
     */
    get content(): any {
        return this._content;
    }
    set content(value: any) {
        if (value != this._content) {
            this._content = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value indicating whether the data labels have borders.
     */
    get border(): boolean {
        return this._bdr;
    }
    set border(value: boolean) {
        if (value != this._bdr) {
            this._bdr = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the offset from label to the data point.
     */
    get offset(): number {
        return this._off;
    }
    set offset(value: number) {
        if (value != this._off) {
            this._off = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether to draw lines that connect 
     * labels to the data points.
     */
    get connectingLine(): boolean {
        return this._line;
    }
    set connectingLine(value: boolean) {
        if (value != this._line) {
            this._line = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Occurs before the data label is rendered.
     */
    readonly rendering = new wijmo.Event<DataLabel, DataLabelRenderEventArgs>();
    
    /**
     * Raises the {@link rendering} event.
     *
     * @param e The {@link DataLabelRenderEventArgs} object used to render the label.
     * @return True if the event was not canceled.
     */
    onRendering(e: DataLabelRenderEventArgs) {
        this.rendering.raise(this, e);
        return !e.cancel;
    }

    _invalidate() {
        if (this._chart) {
            this._chart.invalidate();
        }
    }
} 


/**
 * The point data label for FlexChart.
 */
export class DataLabel extends DataLabelBase {
    private _pos = LabelPosition.Top;

    /**
     * Gets or sets the position of the data labels.
     */
    get position(): LabelPosition {
        return this._pos;
    }
    set position(value: LabelPosition) {
        value = wijmo.asEnum(value, LabelPosition);
        if (value != this._pos) {
            this._pos = value;
            this._invalidate();
        }
    }
} 

/**
 * The point data label for FlexPie.
 */
export class PieDataLabel extends DataLabelBase {
    private _pos = PieLabelPosition.Center;

    /**
     * Gets or sets the position of the data labels.
     */
    get position(): PieLabelPosition {
        return this._pos;
    }
    set position(value: PieLabelPosition) {
        value = wijmo.asEnum(value, PieLabelPosition);
        if (value != this._pos) {
            this._pos = value;
            this._invalidate();
        }
    }
}
    }
    


    module wijmo.chart {
    







'use strict';

/**
 * Specifies the axis type.
 */
export enum AxisType {
    /** Category axis (normally horizontal). */
    X,
    /** Value axis (normally vertical). */
    Y
}

/**
 * Specifies how to handle overlapping labels.
 */
export enum OverlappingLabels {
    /**
     * Hide overlapping labels.
     */
    Auto,
    /**
     * Show all labels, including overlapping ones.
     */
    Show
}

/**
 * Axis interface.
 */
export interface _IAxis {
    actualMin: number;
    actualMax: number;
    convert(val: number): number
}

/**
 * Specifies whether and where the axis tick marks appear.
 */
export enum TickMark {
    /** No tick marks appear. */
    None,
    /** Tick marks appear outside the plot area. */
    Outside,
    /** Tick marks appear inside the plot area. */
    Inside,
    /** Tick marks cross the axis. */
    Cross
}

/**
 * Represents an axis in the chart.
 */
export class Axis implements _IAxis {
    _GRIDLINE_WIDTH = 1;
    _LINE_WIDTH = 1;
    _TICK_WIDTH = 1;
    _TICK_HEIGHT = 4;
    _TICK_OVERLAP = 1;
    _TICK_LABEL_DISTANCE = 4;
    private static MAX_MAJOR = 1000;
    private static MAX_MINOR = 2000;

    // property storage
    _chart: FlexChartCore;
    private _type: any;
    private _min: any;
    private _max: any;
    private _position: Position;
    private _majorUnit: any; // number, '1w', '1m', etc
    private _minorUnit: any;
    private _majorGrid;
    private _minorGrid = false;
    private _title: string;
    private _labelStyle: any;
    private _reversed: boolean;
    private _format: string;
    _actualMin: number;
    _actualMax: number;
    _axisType: AxisType;
    private _majorTickMarks: TickMark;
    private _minorTickMarks: TickMark;
    private _logBase: number;
    private _labels = true;
    private _labelAngle;
    private _labelAlign: string;
    private _axisLine;// = true;
    _plotrect: wijmo.Rect;
    private _szTitle: wijmo.Size;
    _isTimeAxis: boolean = false;
    _lbls: string[];
    _values: number[];
    private _rects: wijmo.Rect[];
    private _name: string;
    private _origin: number;
    private _overlap: OverlappingLabels;
    private _items: any;
    private _cv: wijmo.collections.ICollectionView;
    private _binding: string;
    private _ifmt: Function;
    private _tfmt: string;

    private static _id = 0;
    private __uniqueId: number;

    private _parea: PlotArea;
    private _labelPadding = 5;
    private _actualLabels: string[] = [];

    _axrect: wijmo.Rect;
    _desiredSize: wijmo.Size;
    _annoSize: wijmo.Size;
    _hasOrigin: boolean;
    _hostElement: SVGGElement;
    _vals;

    /**
     * Initializes a new instance of the {@link Axis} class.
     *
     * @param position The position of the axis on the chart.
     */
    constructor(position?: Position) {
        this.__uniqueId = Axis._id++;

        this._position = position;
        if (position == Position.Bottom || position == Position.Top) {
            this._axisType = AxisType.X;
        } else {
            this._axisType = AxisType.Y;
            //this._axisLine = false;
        }

        this._minorTickMarks = TickMark.None;
        this._overlap = OverlappingLabels.Auto;
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets the axis host element.
     */
    get hostElement(): SVGGElement {
        return this._hostElement;
    }

    /**
     * Gets the actual axis minimum.
     *
     * It returns a number or a Date object (for time-based data).
    */
    get actualMin(): any {
        return this._isTimeAxis ? new Date(this._actualMin) : this._actualMin;
    }

    /**
    * Gets the actual axis maximum.
    *
    * It returns a number or a Date object (for time-based data).
    */
    get actualMax(): any {
        return this._isTimeAxis ? new Date(this._actualMax) : this._actualMax;
    }

    /**
     * Gets or sets the minimum value shown on the axis.
     *
     * The value can be a number or a Date object (for time-based data).
     * 
     * The default value for this property is <b>null</b>, which causes
     * the chart to calculate the minimum value based on the data.
     */
    get min(): any {
        return this._min;
    }
    set min(value: any) {
        if (value != this._min) {
            if (wijmo.isDate(value)) {
                this._min = wijmo.asDate(value, true);
            } else {
                this._min = wijmo.asNumber(value, true);
            }
            this._invalidate();
        }
    }

    /**
     * Gets or sets the maximum value shown on the axis.
     *
     * The value can be a number or a Date object (for time-based data).
     * 
     * The default value for this property is <b>null</b>, which causes
     * the chart to calculate the maximum value based on the data.
     */
    get max(): any {
        return this._max;
    }
    set max(value: any) {
        if (value != this._max) {
            if (wijmo.isDate(value)) {
                this._max = wijmo.asDate(value, true);
            } else {
                this._max = wijmo.asNumber(value, true);
            }
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether the axis is
     * reversed (top to bottom or right to left).
     * 
     * The default value for this property is <b>false</b>.
     */
    get reversed(): boolean {
        return this._reversed;
    }
    set reversed(value: boolean) {
        if (this._reversed != value) {
            this._reversed = wijmo.asBoolean(value);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the position of the axis with respect to the plot area.
     */
    get position(): Position {
        return this._position;
    }
    set position(value: Position) {
        value = wijmo.asEnum(value, Position, false);
        if (value != this._position) {
            this._position = value;
            if (this._position == Position.Bottom || this._position == Position.Top) {
                this._axisType = AxisType.X;
            } else if (this._position == Position.Left || this._position == Position.Right) {
                this._axisType = AxisType.Y;
            }
            this._invalidate();
        }
    }

    /**
     * Gets or sets the number of units between axis labels.
     *
     * If the axis contains date values, then the units are
     * expressed in days.
     */
    get majorUnit(): number {
        return this._majorUnit;
    }
    set majorUnit(value: number) {
        if (value != this._majorUnit) {
            this._majorUnit = wijmo.asNumber(value, true);
            this._invalidate()
        }
    }

    /**
         * Gets or sets the number of units between minor axis ticks.
         *
         * If the axis contains date values, then the units are
         * expressed in days.
         */
    get minorUnit(): number {
        return this._minorUnit;
    }
    set minorUnit(value: number) {
        if (value != this._minorUnit) {
            this._minorUnit = wijmo.asNumber(value, true);
            this._invalidate()
        }
    }

    /**
     * Gets or sets the axis name.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (value != this._name) {
            this._name = wijmo.asString(value, true);
        }
    }

    /**
     * Gets or sets the title text shown next to the axis.
     */
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        if (value != this._title) {
            this._title = wijmo.asString(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the format string used for the axis labels
     * (see {@link Globalize}).
     */
    get format(): string {
        return this._format;
    }
    set format(value: string) {
        if (value != this._format) {
            this._format = wijmo.asString(value, true);
            this._invalidate();
        }
    }
    //

    /**
     * Gets or sets a value indicating whether the axis includes grid lines.
     */
    get majorGrid(): boolean {
        return this._majorGrid;
    }
    set majorGrid(value: boolean) {
        if (value != this._majorGrid) {
            this._majorGrid = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the location of the axis tick marks.
     */
    get majorTickMarks(): TickMark {
        return this._majorTickMarks;
    }
    set majorTickMarks(value: TickMark) {
        value = wijmo.asEnum(value, TickMark, true);
        if (value != this._majorTickMarks) {
            this._majorTickMarks = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether the axis includes minor grid lines.
     */
    get minorGrid(): boolean {
        return this._minorGrid;
    }
    set minorGrid(value: boolean) {
        if (value != this._minorGrid) {
            this._minorGrid = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the location of the minor axis tick marks.
     */
    get minorTickMarks(): TickMark {
        return this._minorTickMarks;
    }
    set minorTickMarks(value: TickMark) {
        value = wijmo.asEnum(value, TickMark, true);
        if (value != this._minorTickMarks) {
            this._minorTickMarks = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether the axis line is visible.
     *
     * The default value for this property is <b>true</b>.
     */
    get axisLine(): boolean {
        if (this._axisLine === undefined) {
            return this.axisType == AxisType.X ? true : false;
        } else {
            return this._axisLine;
        }
    }
    set axisLine(value: boolean) {
        if (value != this._axisLine) {
            this._axisLine = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether the axis labels are visible.
     *
     * The default value for this property is <b>true</b>.
     */
    get labels(): boolean {
        return this._labels;
    }
    set labels(value: boolean) {
        if (value != this._labels) {
            this._labels = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the label alignment.
     *
     * By default the labels are centered. The supported values are
     * 'left' and 'right for the X-axis, 'top' and 'bottom' for the Y-axis.
     */
    get labelAlign(): string {
        return this._labelAlign;
    }
    set labelAlign(value: string) {
        if (value != this._labelAlign) {
            this._labelAlign = wijmo.asString(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the rotation angle of the axis labels.
     *
     * The angle is measured in degrees with valid values
     * ranging from -90 to 90.
     */
    get labelAngle(): number {
        return this._labelAngle;
    }
    set labelAngle(value: number) {
        if (value != this._labelAngle) {
            this._labelAngle = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the value at which an axis crosses the perpendicular axis.
     **/
    get origin(): number {
        return this._origin;
    }
    set origin(value: number) {
        if (value != this._origin) {
            this._origin = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value indicating how to handle overlapping axis labels.
     *
     * The default value for this property is <b>OverlappingLabels.Auto</b>.
     */
    get overlappingLabels(): OverlappingLabels {
        return this._overlap;
    }
    set overlappingLabels(value: OverlappingLabels) {
        value = wijmo.asEnum(value, OverlappingLabels, true);
        if (value != this._overlap) {
            this._overlap = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets the items source for the axis labels.
     *
     * Names of the properties are specified by the {@link Axis.binding} property.
     *
     * For example:
     *
     * <pre>
     *  // default value for Axis.binding is 'value,text'
     *  chart.axisX.itemsSource = [ { value:1, text:'one' }, { value:2, text:'two' } ];
     * </pre>
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        if (this._items != value) {

            // unbind current collection view
            if (this._cv) {
                this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                this._cv = null;
            }

            // save new data source and collection view
            this._items = value;
            this._cv = wijmo.asCollectionView(value);

            // bind new collection view
            if (this._cv != null) {
                this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
            }

        }
    }

    /**
     * Gets or sets the comma-separated property names for the
     * {@link Axis.itemsSource} property to use in axis labels.
     *
     * The first name specifies the value on the axis, the second represents the corresponding
     * axis label. The default value is 'value,text'.
     */
    get binding(): string {
        return this._binding;
    }
    set binding(value: string) {
        if (value != this._binding) {
            this._binding = wijmo.asString(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the itemFormatter function for the axis labels.
     *
     * If specified, the function takes two parameters:
     * <ul>
     * <li><b>render engine</b>: The {@link IRenderEngine} object to be used
     * in formatting the labels.</li>
     * <li><b>current label</b>: An object with the following properties:
     *   <ul>
     *     <li><b>value</b>: The value of the axis label to format.</li>
     *     <li><b>text</b>: The text to use in the label.</li>
     *     <li><b>pos</b>: The position in control coordinates at which
     *     the label is to be rendered.</li>
     *     <li><b>cls</b>: The CSS class to be applied to the label.</li>
     *   </ul></li>
     * </ul>
     *
     * The function returns the label parameters of labels for which
     * properties are modified.
     *
     * For example:
     * <pre>
     * chart.axisY.itemFormatter = function(engine, label) {
     *     if (label.val &gt; 5){
     *         engine.textFill = 'red'; // red text
     *         label.cls = null; // no default CSS
     *      }
     *     return label;
     * }
     * </pre>
     */
    get itemFormatter(): Function {
        return this._ifmt;
    }
    set itemFormatter(value: Function) {
        if (this._ifmt != value) {
            this._ifmt = wijmo.asFunction(value, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the logarithmic base of the axis.
     *
     * If the base is not specified the axis uses a linear scale.
     *
     * Use the {@link logBase} property to spread data that is clustered
     * around the origin. This is common in several financial and economic
     * data sets.
     */
    get logBase(): number {
        return this._logBase;
    }
    set logBase(value: number) {
        if (value != this._logBase) {
            this._logBase = wijmo.asNumber(value, true, true);
            this._invalidate();
        }
    }

    /**
     * Gets the array with actual axis labels.
     */
    get axisLabels(): string[] {
        return this._actualLabels;
    }

    _getLogBase() {
        if (this._chart && this._chart._stacking === Stacking.Stacked100pc) {
            return 0;
        }
        return this.logBase;
    }

    _isLogAxis() {
        let logBase = this._getLogBase();
        return logBase != null && logBase > 0;
    }

    /**
     * Gets or sets the plot area for the axis.
     */
    get plotArea(): PlotArea {
        return this._parea;
    }
    set plotArea(value: PlotArea) {
        if (value != this._parea) {
            this._parea = wijmo.asType(value, PlotArea, true);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the label padding, in pixels.
     * 
     * The default value for this property is <b>5</b> pixels.
     */
    get labelPadding(): number {
        return this._labelPadding;
    }
    set labelPadding(value: number) {
        if (value != this._labelPadding) {
            this._labelPadding = wijmo.asNumber(value, true, true);
            this._invalidate();
        }
    }

    get _groupClass(): string {
        return this.axisType === AxisType.X ? FlexChartCore._CSS_AXIS_X : FlexChartCore._CSS_AXIS_Y;
    }

    /**
     * Occurs when the axis range changes.
     */
    readonly rangeChanged = new wijmo.Event<Axis, wijmo.EventArgs>();

    /**
     * Raises the {@link rangeChanged} event.
     */
    onRangeChanged(e?: wijmo.EventArgs) {
        this.rangeChanged.raise(this, e);
    }

    //--------------------------------------------------------------------------
    // implementation

    _getPosition(): Position {
        if (this.axisType == AxisType.X) {
            if (this.position == Position.Auto) {
                return Position.Bottom;
            }
        } else if (this.axisType == AxisType.Y) {
            if (this.position == Position.Auto) {
                return Position.Left;
            }
        }
        return this.position;
    }

    _isOverlapped(engine: IRenderEngine, w: number, lblClass: string, axisType: AxisType) {
        var lbls = this._lbls;
        if (lbls != null && lbls.length > 1) {
            var len = lbls.length;
            var vals = this._values && this._values.length == len ? this._values : null;

            var x0 = 0;
            var w0 = 0;
            for (var i = 0; i < len; i++) {
                var val = vals ? vals[i] : i;

                if (val >= this._actualMin && val <= this._actualMax) {
                    var x = w * (val - this._actualMin) / (this._actualMax - this._actualMin);

                    var sz = engine.measureString(lbls[i], lblClass, this._groupClass);
                    if (this.axisType == AxisType.X) {
                        if (i > 0 && Math.abs(x - x0) < Math.max(sz.width, w0) + 12) {
                            return true;
                        }
                        x0 = x;
                        w0 = sz.width;
                    } else if (this.axisType == AxisType.Y) {
                        //rotate if label width is larger than 1/3 of chart area
                        // ! need more research
                        // if (sz.width >= this._chart._rectChart.width / 3) {
                        //    return true;
                        //}
                    }
                }
            }
        }

        return false;
    }

    _actualAngle: number;

    /**
     * Calculates the axis height.
     *
     * @param engine Rendering engine.
     * @param maxw Max width.
     */
    _getHeight(engine: IRenderEngine, maxw: number): number {

        this._actualAngle = null;
        let lblClass = FlexChartCore._CSS_LABEL;
        let titleClass = FlexChartCore._CSS_TITLE;

        let range = this._actualMax - this._actualMin;
        let delta = 0.1 * range;// r * 0.01 * Math.E;

        let lbls = this._lbls;

        let angle = this.labelAngle;

        if (this.labels && this._chart._getChartType() !== ChartType.Funnel) {
            delta = this._updateAutoFormat(delta);

            if (lbls != null && lbls.length > 0) {
                let len = lbls.length;
                let vals = this._values && this._values.length == len ? this._values : null;
                this._annoSize = new wijmo.Size();
                for (var i = 0; i < len; i++) {
                    let val = vals ? vals[i] : i;

                    if (val >= this._actualMin && val <= this._actualMax) {
                        let text = lbls[i];
                        let cls = lblClass;
                        if (this.itemFormatter) {
                            let lbl = this._getFormattedItem(engine, val, text, new wijmo.Point(), lblClass, true);
                            text = lbl.text;
                            cls = lbl.cls;
                        }

                        let sz = engine.measureString(text, cls, this._groupClass);

                        if (this.axisType == AxisType.X) {
                            if (sz.width > this._annoSize.width) {
                                this._annoSize.width = sz.width;
                            }
                        } else {
                            if (sz.width > this._annoSize.width) {
                                this._annoSize.width = sz.width;
                            }
                        }
                        if (sz.height > this._annoSize.height) {
                            this._annoSize.height = sz.height;
                        }
                    }
                }

                //Only rotate for x axis when Axis's labelAngle property is not set.
                if (angle == null && this.axisType == AxisType.X) {
                    if (this._isOverlapped(engine, maxw, lblClass, this.axisType)) {
                        angle = this._actualAngle = - 45;
                    } else {
                        this._actualAngle = 0;
                    }
                }
            } else {
                let val = this._actualMin - delta;
                let text = this._formatValue(val);
                let cls = lblClass;

                if (this.itemFormatter) {
                    let lbl = this._getFormattedItem(engine, val, text, new wijmo.Point(), lblClass, true);
                    text = lbl.text;
                    cls = lblClass;
                }

                let sz = engine.measureString(text, cls, this._groupClass);
                this._annoSize = sz;

                val = this._actualMax + delta;
                text = this._formatValue(val);
                cls = lblClass;

                if (this.itemFormatter) {
                    let lbl = this._getFormattedItem(engine, val, text, new wijmo.Point(), lblClass, true);
                    text = lbl.text;
                    cls = lblClass;
                }

                sz = engine.measureString(text, cls, this._groupClass);
                if (sz.width > this._annoSize.width) {
                    this._annoSize.width = sz.width;
                }
                if (sz.height > this._annoSize.height)
                    this._annoSize.height = sz.height;
            }

            if (angle) {
                if (angle > 90) {
                    angle = 90;
                } else if (angle < -90) {
                    angle = -90;
                }
                let a = angle * Math.PI / 180,
                    w = this._annoSize.width,
                    h = this._annoSize.height;

                this._annoSize.width = w * Math.abs(Math.cos(a)) + h * Math.abs(Math.sin(a));
                this._annoSize.height = w * Math.abs(Math.sin(a)) + h * Math.abs(Math.cos(a));
            }
        } else {
            this._annoSize = new wijmo.Size(8, 8);
        }

        let h = 2 * (this._labelPadding || 5);

        if (this._axisType == AxisType.X) {
            h += this._annoSize.height;
        } else {
            h += this._annoSize.width + this._TICK_LABEL_DISTANCE + 2;
        }

        let th = this._TICK_HEIGHT;
        let tover = this._TICK_OVERLAP;
        let tickMarks = this.majorTickMarks;

        if (tickMarks == TickMark.Outside) {
            tover = 1;
        } else if (tickMarks == TickMark.Inside) {
            tover = -1;
        } else if (tickMarks == TickMark.Cross) {
            tover = 0;
        }

        if (tickMarks == null) {
            tickMarks = TickMark.Outside;
        }

        if (tickMarks != TickMark.None) {
            h += 0.5 * (1 + tover) * th;
        }

        if (this._title) {
            let text = this._title;
            this._szTitle = engine.measureString(text, titleClass, this._groupClass);
            h += this._szTitle.height;
        }

        engine.fontSize = null;
        return h;
    }

    _updateAutoFormat(delta: number): number {
        if (this._isTimeAxis) {
            var fmt = this.format;
            var td = (0.001 * (this._getActualRange()) / 10);
            var trange = new _timeSpan(td * _timeSpan.TicksPerSecond);
            var tdelta = wijmo.isNumber(this._majorUnit) // TFS 250742
                ? _timeSpan.fromDays(this._majorUnit)
                : _timeHelper.NiceTimeSpan(trange, fmt);
            if (!fmt)
                this._tfmt = _timeHelper.GetTimeDefaultFormat(1000 * tdelta.TotalSeconds, 0);
            delta = tdelta.TotalSeconds;
        }
        return delta;
    }
    _getActualRange() {
        return this._actualMax - this._actualMin;
    }

    _updateActualLimitsByChartType(labels, min, max) {
        if (labels && labels.length > 0 && !this._isTimeAxis) {
            var ctype = this._chart._getChartType();
            if (ctype != ChartType.Column && ctype != ChartType.Bar) {
                min -= 0.5;
                max += 0.5;
            }
        }
        return { min: min, max: max };
    }

    /**
     * Update the actual axis limits based on a specified data range.
     *
     * @param dataType Data type.
     * @param dataMin Data minimum.
     * @param dataMax Data maximum.
     * @param labels Category labels(category axis).
     * @param values Values(value axis).
     */
    _updateActualLimits(dataType: wijmo.DataType, dataMin: number, dataMax: number, labels: string[] = null, values: number[] = null) {
        var oldmin = this._actualMin,
            oldmax = this._actualMax;

        this._isTimeAxis = dataType == wijmo.DataType.Date;

        var minmax = this._updateActualLimitsByChartType(labels, dataMin, dataMax);
        dataMin = minmax.min;
        dataMax = minmax.max;

        var min = this._min,
            max = this._max;
        if (wijmo.isDate(min)) {
            min = min.valueOf();
        }
        if (wijmo.isDate(max)) {
            max = max.valueOf();
        }

        let canSet = this._chart && this._chart._stacking !== Stacking.Stacked100pc;
        if (!canSet) {
            canSet = this._chart._isRotated() ? this.axisType == AxisType.Y : this.axisType == AxisType.X;
        }

        const amin = this._actualMin = (min != null && canSet) ? min : dataMin;
        const amax = this._actualMax = (max != null && canSet) ? max : dataMax;

        // todo: validate min&max
        if (amin == amax) {
            if (min !== undefined && max === undefined) {
                this._actualMax += 1;
            } else if (min === undefined && max !== undefined) {
                this._actualMin -= 1;
            } else {
                // range can't be 0
                // adjust limits
                if (amin === 0) {
                    this._actualMax = 1;
                } else {
                    const abs = Math.abs(amin);
                    if (abs < 1) {
                        this._actualMin -= abs;
                        this._actualMax += abs;
                    } else {
                        this._actualMin -= 1;
                        this._actualMax += 1;
                    }
                }
            }
        }

        if (this._getLogBase() > 0) {
            const base = this.logBase;
            const k = Math.log(base);

            if (!this._max) {
                var imax = Math.ceil(Math.log(this._actualMax) / k);
                this._actualMax = Math.pow(base, imax);
            }
            if (!this._min) {
                var imin = Math.floor(Math.log(this._actualMin) / k);
                this._actualMin = Math.pow(base, imin);
            }

            if (this._actualMin <= 0 || !wijmo.isNumber(this._actualMin)) {
                this._actualMin = 1;
            }
            if (this._actualMax < this._actualMin) {
                this._actualMax = this._actualMin + 1;
            } else if(this._actualMax === this._actualMin) {
                this._actualMin = 0.1 * this._actualMax;
            }
        }

        if ((oldmin != this._actualMin && (wijmo.isNumber(oldmin) || wijmo.isNumber(this._actualMin))) ||
            (oldmax != this._actualMax && (wijmo.isNumber(oldmax) || wijmo.isNumber(this._actualMax)))) {
            this.onRangeChanged();
        }

        if (this._items) {
            this._values = [];
            this._lbls = [];
            var len = this._items.length;
            var vbnd = 'value';
            var nbnd = 'text';
            if (this.binding) {
                var bnds = this.binding.split(',');
                if (bnds.length == 2) {
                    vbnd = bnds[0];
                    nbnd = bnds[1];
                }
            }
            for (var i = 0; i < len; i++) {
                var item = this._items[i];
                var val = item[vbnd];
                if (wijmo.isNumber(val)) {
                    this._values.push(val);
                    this._lbls.push(item[nbnd]);
                } else if (wijmo.isDate(val)) {
                    this._values.push(val.getTime());
                    this._lbls.push(item[nbnd]);
                }
            }
        } else {
            this._lbls = labels;
            this._values = values;
        }

    }

    /**
     * Set the axis position.
     *
     * @param axisRect Axis rectangle.
     * @param plotRect Plot area rectangle.
     */
    _layout(axisRect: wijmo.Rect, plotRect: wijmo.Rect) {
        var isVert = this.axisType == AxisType.Y;
        this._plotrect = plotRect;

        if (isVert)
            this._axrect = new wijmo.Rect(axisRect.left, axisRect.top, axisRect.height, axisRect.width);
        else
            this._axrect = axisRect;
    }

    _hasVisibileSeries(): boolean {
        var series = this._chart.series, i = 0,
            len = series.length, vis;

        for (; i < len; i++) {
            vis = series[i].visibility;
            if (vis == SeriesVisibility.Plot || vis == SeriesVisibility.Visible) {
                return true;
            }
        }
        return false;
    }

    /**
     * Render the axis.
     *
     * @param engine Rendering engine.
     */
    _render(engine: IRenderEngine) {
        if (this.position == Position.None) {
            return;
        }
        if (!this._hasVisibileSeries()) {
            return;
        }

        this.axisLabels.length = 0;
        this._vals = {};
        var labelAngle = 0;
        if (this.labelAngle) {
            labelAngle = this.labelAngle;
            if (labelAngle > 90) {
                labelAngle = 90;
            } else if (labelAngle < -90) {
                labelAngle = -90;
            }
        }

        // check for null rather than undefined (TFS 250732)
        if (this.labelAngle == null && this._actualAngle != null) {
            labelAngle = this._actualAngle;
        }

        var fg = FlexChartCore._FG;
        var fontSize = null;

        var range = this._actualMax - this._actualMin;

        if (wijmo.isNumber(range)) {

            var delta = this._calcMajorUnit();
            if (delta == 0)
                delta = this._niceTickNumber(range) * 0.1;

            var len = Math.min(Axis.MAX_MAJOR, Math.floor(range / delta) + 1);
            var vals = [];
            var lbls = [];
            this._rects = [];

            this._vals.major = vals;
            this._vals.hasLbls = [];

            var st = Math.floor(this._actualMin / delta) * delta;
            if (st < this._actualMin)
                st += delta;

            var isCategory = false;
            // labels
            if (this._lbls && this._lbls.length > 0) {
                lbls = this._lbls; // category
                if (this._values.length == 0) {
                    isCategory = true;
                    for (var i = 0; i < lbls.length; i++) {
                        vals.push(i);
                    }
                }
                else {
                    vals = this._values;
                }
            }
            else if (this._isTimeAxis) {
                this._createTimeLabels(st, len, vals, lbls); // time
            } else if (!this._getLogBase()) {
                this._createLabels(st, len, delta, vals, lbls); // numeric
            } else {
                this._createLogarithmicLabels(this._actualMin, this._actualMax, this.majorUnit, vals, lbls, true);
            }

            len = Math.min(vals.length, lbls.length);

            engine.textFill = fg;

            var th = this._TICK_HEIGHT;
            var tover = this._TICK_OVERLAP;

            var tickMarks = this.majorTickMarks;
            if (tickMarks == null) {
                tickMarks = TickMark.Outside;
            }

            if (tickMarks == TickMark.Outside) {
                tover = 1;
            } else if (tickMarks == TickMark.Inside) {
                tover = -1;
            } else if (tickMarks == TickMark.Cross) {
                tover = 0;
            }

            var t1 = 0.5 * (tover - 1) * th;
            var t2 = 0.5 * (1 + tover) * th;


            for (var i = 0; i < len; i++) {
                var hasLbl = true;
                var val = vals[i];
                var sval = lbls[i];
                var showLabel = this.labels;
                if (showLabel && (isCategory || this.itemsSource) && this.majorUnit) {
                    if (i % this.majorUnit != 0) {
                        showLabel = false;
                    }
                }

                if (val >= this._actualMin && val <= this._actualMax) {
                    var txtFill = engine.textFill;
                    hasLbl = this._renderLabelsAndTicks(engine, i, val, sval, labelAngle, tickMarks, showLabel, t1, t2);
                    // reset text color
                    engine.textFill = txtFill;
                }
                this._vals.hasLbls.push(hasLbl);
                if (hasLbl) {
                    this.axisLabels.push(sval);
                }
            }
        }

        if (this.minorGrid || this.minorTickMarks != TickMark.None) {
            this._renderMinor(engine, vals, isCategory);
        }

        engine.stroke = fg;
        engine.fontSize = fontSize;

        // line and title
        this._renderLineAndTitle(engine);

        engine.stroke = null;
        engine.fontSize = null;
        engine.textFill = null;
        engine.strokeWidth = null;
    }

    _renderLineAndTitle(engine) {
        var pos = this._getPosition();
        var isVert = this.axisType == AxisType.Y,
            isNear = pos != Position.Top && pos != Position.Right,
            titleClass = FlexChartCore._CSS_TITLE,
            lineClass = FlexChartCore._CSS_LINE;

        if (isVert) {
            if (isNear) {
                if (this._title) {
                    var center = new wijmo.Point(this._axrect.left + this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                    FlexChartCore._renderRotatedText(engine, this._title, center, 1, 1, center, -90, titleClass, this._groupClass);
                }

                if (this.axisLine) {
                    engine.drawLine(this._axrect.right, this._axrect.top, this._axrect.right, this._axrect.bottom, lineClass);
                }
            } else {
                if (this._title) {
                    var center = new wijmo.Point(this._axrect.right - this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                    FlexChartCore._renderRotatedText(engine, this._title, center, 1, 1, center, 90, titleClass, this._groupClass);
                }

                if (this.axisLine) {
                    engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.left, this._axrect.bottom, lineClass);
                }
            }
        } else {
            if (isNear) {
                if (this.axisLine) {
                    engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.right, this._axrect.top, lineClass);
                }

                if (this._title) {
                    FlexChartCore._renderText(engine, this._title,
                        new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.bottom), 1, 2, titleClass);
                }
            } else {
                if (this.axisLine) {
                    engine.drawLine(this._axrect.left, this._axrect.bottom, this._axrect.right, this._axrect.bottom, lineClass);
                }

                if (this._title) {
                    FlexChartCore._renderText(engine, this._title,
                        new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.top), 1, 0, titleClass);
                }
            }
        }
    }

    _renderMinor(engine, vals, isCategory) {
        var pos = this._getPosition();
        var isVert = this.axisType == AxisType.Y,
            isNear = pos != Position.Top && pos != Position.Right;

        if (!this._getLogBase())
            this._createMinors(engine, vals, isVert, isNear, isCategory);
        else {
            if (this.minorUnit > 0) {
                var mvals = [];
                this._createLogarithmicLabels(this._actualMin, this._actualMax, this.minorUnit, mvals, null, false);
                var ticks = [];
                for (var i = 0; i < mvals.length; i++) {
                    var val = mvals[i];
                    if (vals.indexOf(val) == -1 && val > this._actualMin)
                        ticks.push(val);
                }

                this._renderMinors(engine, ticks, isVert, isNear);
            }
        }
    }

    _renderRotatedText(engine: IRenderEngine, val, text: string, pos: wijmo.Point, halign, valign,
        center: wijmo.Point, angle: number, className: string, groupClassName?: string, style?: any) {
        if (this.itemFormatter) {
            var lbl = this._getFormattedItem(engine, val, text, pos, className);

            if (lbl) {
                text = lbl.text;
                className = lbl.cls;
            } else {
                text = null;
            }
        }
        FlexChartCore._renderRotatedText(engine, text, pos, halign, valign, center, angle, className, groupClassName, style);
    }

    _getFormattedItem(engine: IRenderEngine, val, text: string, pos: wijmo.Point, className: string, readOnly: boolean = false) {
        if (this.itemFormatter) {
            let pt = pos.clone();

            if (this._plotrect) {
                if (this.axisType == AxisType.X) {
                    if (this.position == Position.Top)
                        pt.y = this._plotrect.top;
                    else
                        pt.y = this._plotrect.bottom;
                } else {
                    if (this.position == Position.Right)
                        pt.x = this._plotrect.right;
                    else
                        pt.x = this._plotrect.left;
                }
            }
            let lbl = { val: val, text: text, pos: pt, cls: className };

            if (readOnly) {
                engine.readOnly = true;
            }

            lbl = this.itemFormatter(engine, lbl);

            if (readOnly) {
                engine.readOnly = false;
            }

            return lbl;
        }
    }

    _renderLabelsAndTicks(engine, index, val, sval, labelAngle, tickMarks, showLabel, t1, t2) {
        var pos = this._getPosition();
        var hasLbl = false,
            isVert = this.axisType == AxisType.Y,
            isNear = pos != Position.Top && pos != Position.Right,
            labelPadding = this.labelPadding || 5,
            tth = this._TICK_WIDTH,
            lalign = this._getLabelAlign(isVert),
            lblClass = FlexChartCore._CSS_LABEL,
            glineClass = FlexChartCore._CSS_GRIDLINE,
            tickClass = FlexChartCore._CSS_TICK,
            gstroke = FlexChartCore._FG,
            tstroke = FlexChartCore._FG,
            gth = this._GRIDLINE_WIDTH;

        var has_gline = val != this._actualMin && this.majorGrid;

        if (isVert) {
            var y = this.convert(val);

            if (has_gline) {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                engine.drawLine(this._plotrect.left, y, this._plotrect.right, y, glineClass);
            }

            engine.stroke = tstroke;
            engine.strokeWidth = tth;
            if (isNear) {
                if (showLabel) {
                    hasLbl = true;
                    var lpt = new wijmo.Point(this._axrect.right - t2 - this._TICK_LABEL_DISTANCE - labelPadding, y);
                    if (labelAngle > 0) {
                        if (labelAngle == 90) {
                            this._renderRotatedText(engine, val, sval, lpt, 1, 0, lpt, labelAngle, lblClass, this._groupClass);
                        } else {
                            this._renderRotatedText(engine, val, sval, lpt, 2, 1, lpt, labelAngle, lblClass, this._groupClass);
                        }
                    } else if (labelAngle < 0) {
                        if (labelAngle == -90) {
                            this._renderRotatedText(engine, val, sval, lpt, 1, 2, lpt, labelAngle, lblClass, this._groupClass);
                        } else {
                            this._renderRotatedText(engine, val, sval, lpt, 2, 1, lpt, labelAngle, lblClass, this._groupClass);
                        }
                    } else {
                        hasLbl = this._renderLabel(engine, val, sval, lpt, 2, lalign, lblClass);
                    }
                }
                if (tickMarks != TickMark.None && hasLbl) {
                    engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                }
            } else {
                if (showLabel) {
                    hasLbl = true;
                    var lpt = new wijmo.Point(this._axrect.left + t2 + this._TICK_LABEL_DISTANCE + labelPadding, y);
                    if (labelAngle > 0) {
                        if (labelAngle == 90) {
                            this._renderRotatedText(engine, val, sval, lpt, 1, 2, lpt, labelAngle, lblClass, this._groupClass);
                        } else {
                            this._renderRotatedText(engine, val, sval, lpt, 0, 1, lpt, labelAngle, lblClass, this._groupClass);
                        }
                    } else if (labelAngle < 0) {
                        if (labelAngle == -90) {
                            this._renderRotatedText(engine, val, sval, lpt, 1, 0, lpt, labelAngle, lblClass, this._groupClass);
                        } else {
                            this._renderRotatedText(engine, val, sval, lpt, 0, 1, lpt, labelAngle, lblClass, this._groupClass);
                        }
                    } else {
                        hasLbl = this._renderLabel(engine, val, sval, lpt, 0, lalign, lblClass);
                    }
                }
                if (tickMarks != TickMark.None && hasLbl) {
                    engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                }
            }
        } else {
            var x = this.convert(val);

            if (this.overlappingLabels == OverlappingLabels.Auto && this._xCross(x))
                showLabel = false;

            if (has_gline && showLabel) {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                engine.drawLine(x, this._plotrect.top, x, this._plotrect.bottom, glineClass);
            }

            engine.stroke = tstroke;
            engine.strokeWidth = tth;
            if (isNear) {
                if (showLabel) {
                    var lpt = new wijmo.Point(x, this._axrect.top + t2 + labelPadding);
                    if (labelAngle != 0) {
                        hasLbl = this._renderRotatedLabel(engine, val, sval, lpt, lalign, labelAngle, lblClass, isNear);
                    } else {
                        hasLbl = this._renderLabel(engine, val, sval, lpt, lalign, 0, lblClass);
                    }
                }

                if (tickMarks != TickMark.None) {
                    if (hasLbl) {
                        x = this.convert(val);
                        engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                    }
                }

            } else {
                if (showLabel) {
                    var lpt = new wijmo.Point(x, this._axrect.bottom - t2 - labelPadding);
                    if (labelAngle != 0) {
                        hasLbl = this._renderRotatedLabel(engine, val, sval, lpt, lalign, labelAngle, lblClass, isNear);
                    } else {
                        hasLbl = this._renderLabel(engine, val, sval, lpt, lalign, 2, lblClass);
                    }
                }

                if (tickMarks != TickMark.None) {
                    if (hasLbl) {
                        x = this.convert(val);
                        engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                    }
                }
            }
        }
        return hasLbl;
    }

    _xCross(x: number): boolean {
        var len = this._rects.length;
        for (var i = 0; i < len; i++) {
            var r = this._rects[i];
            if (x >= r.left && x <= r.right) {
                return true;
            }
        }
        return false;
    }

    _createMinors(engine: IRenderEngine, vals: number[], isVert: boolean, isNear: boolean, isCategory: boolean) {
        if (vals && vals.length > 1) {
            var delta = this.majorUnit
                ? (this._isTimeAxis ? this.majorUnit * 24 * 3600 * 1000 : this.majorUnit)
                : vals[1] - vals[0];

            var minorUnit = wijmo.isNumber(this.minorUnit)
                ? (this._isTimeAxis ? this.minorUnit * 24 * 3600 * 1000 : this.minorUnit)
                : delta * 0.5;

            var ticks = [];

            for (var val = vals[0]; val > this._actualMin && ticks.length < Axis.MAX_MINOR; val -= minorUnit) {
                if (vals.indexOf(val) == -1) {
                    ticks.push(val);
                }
            }

            for (var val = vals[0] + minorUnit; val < this._actualMax && ticks.length < Axis.MAX_MINOR; val += minorUnit) {
                if (vals.indexOf(val) == -1) {
                    ticks.push(val);
                } else if (isCategory && this.majorUnit && val % this.majorUnit != 0) {
                    ticks.push(val);
                }
            }

            this._renderMinors(engine, ticks, isVert, isNear);
        }
    }

    _renderMinors(engine: IRenderEngine, ticks: number[], isVert: boolean, isNear: boolean) {
        var th = this._TICK_HEIGHT;
        var tth = this._TICK_WIDTH;
        var tover = this._TICK_OVERLAP;
        var tstroke = FlexChartCore._FG;

        var tickMarks = this.minorTickMarks;
        var hasTicks = true;

        this._vals.minor = ticks;
        if (tickMarks == TickMark.Outside) {
            tover = 1;
        } else if (tickMarks == TickMark.Inside) {
            tover = -1;
        } else if (tickMarks == TickMark.Cross) {
            tover = 0;
        } else {
            hasTicks = false;
        }

        var t1 = 0.5 * (tover - 1) * th;
        var t2 = 0.5 * (1 + tover) * th;

        var cnt = ticks ? ticks.length : 0;

        var grid = this.minorGrid;
        var prect = this._plotrect;

        var gth = this._GRIDLINE_WIDTH;
        var gstroke = FlexChartCore._FG;

        // CSS
        var glineClass = FlexChartCore._CSS_GRIDLINE_MINOR;
        var tickClass = FlexChartCore._CSS_TICK_MINOR;

        for (var i = 0; i < cnt; i++) {
            //only render ticks between min and max.
            if (ticks[i] >= this.actualMin && ticks[i] <= this.actualMax) {
                if (isVert) {
                    var y = this.convert(ticks[i]);

                    if (hasTicks) {
                        engine.stroke = tstroke;
                        engine.strokeWidth = tth;

                        if (isNear) {
                            engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                        } else {
                            engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                        }
                    }

                    if (grid) {
                        engine.stroke = gstroke;
                        engine.strokeWidth = gth;
                        engine.drawLine(prect.left, y, prect.right, y, glineClass);
                    }
                } else {
                    var x = this.convert(ticks[i]);

                    if (hasTicks) {
                        engine.stroke = tstroke;
                        engine.strokeWidth = tth;

                        if (isNear) {
                            engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                        } else {
                            engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                        }
                    }

                    if (grid) {
                        engine.stroke = gstroke;
                        engine.strokeWidth = gth;
                        engine.drawLine(x, prect.top, x, prect.bottom, glineClass);
                    }
                }
            }
        }
    }

    _renderLabel(engine: IRenderEngine, val: number, text: string, pos: wijmo.Point, ha, va, className?: string): boolean {
        var ok = false;

        if (this.itemFormatter) {
            var lbl = this._getFormattedItem(engine, val, text, pos, className);

            if (lbl) {
                text = lbl.text;
                className = lbl.cls;
            } else {
                text = null;
            }
        }

        if (text) {
            var rects = this._rects;
            var hide = this.overlappingLabels == OverlappingLabels.Auto && !wijmo.isNumber(this._actualAngle);
            var rect = FlexChartCore._renderText(engine, text, pos, ha, va, className, this._groupClass, null, function (rect) {
                if (hide) {
                    var len = rects.length;
                    for (var i = 0; i < len; i++) {
                        if (FlexChartCore._intersects(rects[i], rect))
                            return false;
                    }
                }
                return true;
            });
            if (rect) {
                // extend rect to have more intervals between labels
                rect.left += 4;
                rect.width += 8;
                rects.push(rect);
                ok = true;
            }
        }

        return ok;
    }

    private _renderRotatedLabel(engine: IRenderEngine, val, sval: string, lpt: wijmo.Point, ha, labelAngle: number, lblClass: string, isNear: boolean): boolean {
        if (this.itemFormatter) {
            var lbl = this._getFormattedItem(engine, val, sval, lpt, lblClass);

            if (lbl) {
                sval = lbl.text;
                lblClass = lbl.cls;
            } else {
                sval = null;
            }
        }
        if (sval) {
            var sz = engine.measureString(sval, lblClass, this._groupClass);

            var dy = 0.5 * sz.height;
            var dx = 0.5 * sz.width * Math.abs(Math.sin(labelAngle * Math.PI / 180));
            var dw = 0.5 * sz.width;
            var offWidth = 0.5 * (sz.width * Math.abs(Math.cos(labelAngle * Math.PI / 180)) + sz.height * Math.abs(Math.sin(labelAngle * Math.PI / 180)));
            var center = new wijmo.Point(lpt.x, lpt.y);
            var pt = new wijmo.Point(lpt.x, lpt.y);

            //if label align is not set, adjust its align according to angle.
            if (!this.labelAlign) {
                if (labelAngle == 90 || labelAngle == -90) {
                    ha = 1;
                } else {
                    if (isNear) {
                        if (labelAngle > 0) {
                            ha = 0;
                        } else {
                            ha = 2;
                        }
                    } else {
                        if (labelAngle > 0) {
                            ha = 2;
                        } else {
                            ha = 0;
                        }
                    }
                }
            }
            if (isNear) {
                lpt.y += dy + dx;
                center.y += dy + dx - 0.5 * sz.height;
            } else {
                lpt.y -= dy + dx - sz.height;
                center.y -= dy + dx - 0.5 * sz.height;
            }
            var rectLeft = 0;
            if (ha === 2) {
                //right
                center.x -= offWidth;
                lpt.x -= dw + offWidth;
                rectLeft = center.x + offWidth - sz.height - 2;
            } else if (ha === 0) {
                //left
                center.x += offWidth;
                lpt.x -= dw - offWidth;
                rectLeft = center.x - offWidth;
            } else {
                lpt.x -= dw;
                rectLeft = center.x - sz.height / 2;
            }

            var rect = new wijmo.Rect(rectLeft, pt.y, sz.height + 2, sz.width);

            var rects = this._rects;
            var hide = this.overlappingLabels == OverlappingLabels.Auto;
            if (hide) {
                var len = rects.length;
                for (var i = 0; i < len; i++) {
                    if (FlexChartCore._intersects(rects[i], rect))
                        return false;
                }
            }

            FlexChartCore._renderRotatedText(engine, sval, lpt, 0, 2, center, labelAngle, lblClass, this._groupClass);

            this._rects.push(rect);

            return true;
        } else {
            return false;
        }
    }

    private _getLabelAlign(isVert: boolean): number {
        var lalign = 1;
        if (this.labelAlign) {
            var la = this.labelAlign.toLowerCase();
            if (isVert) {
                if (la == 'top') {
                    lalign = 0;
                } else if (la == 'bottom') {
                    lalign = 2;
                }
            } else {
                if (la == 'left') {
                    lalign = 0;
                } else if (la == 'right') {
                    lalign = 2;
                }
            }
        }
        return lalign;
    }

    // defines custom conversion functions, it allows to create axis with non-linear scale

    // convert axis coordinate to relative position on the axis.
    // The range is from 0(min) to 1(max).
    _customConvert: Function = null;
    // inverse function for _customConvert
    // convert relative axis position to axis coordinate
    _customConvertBack: Function = null;

    /**
     * Converts the specified value from data to pixel coordinates.
     *
     * @param val The data value to convert.
     * @param maxValue The max value of the data, it's optional.
     * @param minValue The min value of the data, it's optional.
     */
    convert(val: number, maxValue?: number, minValue?: number): number {
        var max = maxValue == null ? this._actualMax : maxValue,
            min = minValue == null ? this._actualMin : minValue;

        if (max == min || !this._axrect) {
            return 0;
        }

        var x = this._axrect.left;
        var w = this._axrect.width;
        var y = this._axrect.top;
        var h = this._axrect.height;

        if (this._customConvert != null) {
            var r = this._customConvert(val, min, max);
            if (this.axisType == AxisType.Y) {
                return y + r * h;
            } else {
                return x + r * w;
            }
        } else {
            var base = this._getLogBase();

            if (!base) {
                if (this._reversed) {
                    if (this.axisType == AxisType.Y) {
                        return y + (val - min) / (max - min) * h;
                    } else {
                        return x + w - (val - min) / (max - min) * w;
                    }
                } else {
                    if (this.axisType == AxisType.Y) {
                        return y + h - (val - min) / (max - min) * h;
                    } else {
                        return x + (val - min) / (max - min) * w;
                    }
                }
            }
            else {
                if (val <= 0)
                    return NaN;

                var maxl = Math.log(max / min);

                if (this._reversed) {
                    if (this.axisType == AxisType.Y)
                        return y + Math.log(val / min) / maxl * h;
                    else
                        return x + w - Math.log(val / min) / maxl * w;
                } else {
                    if (this.axisType == AxisType.Y)
                        return y + h - Math.log(val / min) / maxl * h;
                    else
                        return x + Math.log(val / min) / maxl * w;
                }
            }
        }
    }

    /**
     * Converts the specified value from pixel to data coordinates.
     *
     * @param val The pixel coordinates to convert back.
     */
    convertBack(val: number): number {
        if (this._actualMax == this._actualMin) {
            return 0;
        }

        var x = this._plotrect.left;
        var w = this._plotrect.width;
        var y = this._plotrect.top;
        var h = this._plotrect.height;

        var range = this._actualMax - this._actualMin;
        var base = this._getLogBase();

        if (this._customConvertBack != null) {
            if (this.axisType == AxisType.Y) {
                return this._customConvertBack((val - y) / h, this._actualMin, this._actualMax);
            } else {
                return this._customConvertBack((val - x) / w, this._actualMin, this._actualMax);
            }
        } else if (!base) {
            if (this._reversed) {
                if (this.axisType == AxisType.Y) {
                    return this._actualMin + (val - y) * range / h;
                } else {
                    return this._actualMin + (x + w - val) * range / w;
                }
            } else {
                if (this.axisType == AxisType.Y) {
                    return this._actualMax - (val - y) * range / h;
                } else {
                    return this._actualMin + (val - x) * range / w;
                }
            }
        } else {
            var rval = 0;
            if (this._reversed) {
                if (this.axisType == AxisType.Y) {
                    rval = (val - y) / h;
                } else {
                    rval = 1 - (val - x) / w;
                }
            } else {
                if (this.axisType == AxisType.Y) {
                    rval = 1 - (val - y) / h;
                } else {
                    rval = (val - x) / w;
                }
            }

            return Math.pow(base,
                (Math.log(this._actualMin) + (Math.log(this._actualMax) - Math.log(this._actualMin)) * rval) / Math.log(base));
        }
    }


    /**
     * Gets the axis type.
     */
    get axisType(): AxisType {
        var chart = this._chart;
        if (chart) { // for main axis axis type is constant
            if (chart.axisX == this) {
                return AxisType.X;
            } else if (chart.axisY == this) {
                return AxisType.Y;
            }
        }
        return this._axisType;
    }

    _getMinNum(): number {
        return this._actualMin;
    }

    _getMaxNum(): number {
        return this._actualMax;
    }

    //---------------------------------------------------------------------
    // private

    private _invalidate() {
        if (this._chart) {
            this._chart.invalidate();
        }
    }

    private _cvCollectionChanged(sender, e) {
        this._invalidate();
    }

    private _createLabels(start: number, len: number, delta: number, vals: number[], lbls: string[]) {
        for (var i = 0; i < len; i++) {
            var val0 = (start + delta * i).toFixed(14);
            var val = parseFloat(val0);
            var sval = this._formatAxisValue(val);

            let i0 = lbls.indexOf(sval);
            if (i0 >= 0 && !wijmo.isNumber(this.majorUnit) && !this._format) {
                let bval = parseFloat(sval);
                if (Math.abs(bval - val) < Math.abs(bval - vals[i0])) {
                    vals[i0] = val;
                }
            } else {
                vals.push(val);
                lbls.push(sval);
            }
        }
    }

    private _createLogarithmicLabels(min: number, max: number, unit: number, vals: number[], lbls: string[], isLabels: boolean) {
        var base = this._getLogBase();
        var k = Math.log(base);
        var imin = Math.floor(Math.log(min) / k);
        var imax = Math.ceil(Math.log(max) / k);

        var delta = base;

        var auto = true;
        if (unit > 0) {
            auto = false;
            delta = unit;
        }

        if (delta < base)
            delta = base;

        var n = ((imax - imin + 1) * base / delta);
        var step = 1;

        if (isLabels) {
            var pos = this._getPosition();
            var na = this._getAnnoNumber(pos == Position.Left || pos == Position.Right);
            if (n > na)
                step = Math.floor(n / na + 1);
            else if (auto) {
                if (n <= 0.2 * na)
                    delta = 0.2 * base;
                else if (n <= 0.1 * na)
                    delta = 0.1 * base;
            }
        }

        for (var i = imin; i <= imax; i += step) {
            if (auto) {
                var baseval = Math.pow(base, i);

                for (var j = 0; j * delta < (base - 1); j++) {
                    var val = baseval * (1 + j * delta);
                    if (val >= min && val <= max) {
                        if (j == 0) {
                            vals.unshift(val);
                            if (lbls)
                                lbls.unshift(this._formatValue(val));
                        } else {
                            vals.push(val);
                            if (lbls)
                                lbls.push(this._formatValue(val));
                        }
                    }
                }
            } else {
                var val = Math.pow(delta, i);
                if (val >= min && val <= max) {
                    vals.push(val);
                    if (lbls)
                        lbls.push(this._formatValue(val));
                }
            }
        }
    }

    _createTimeLabels(start: number, len: number, vals: number[], lbls: string[]) {
        var min = this._actualMin,
            max = this._actualMax,
            dtmin0 = new Date(min),
            dtmax0 = new Date(max);

        var fmt = this._format,
            anum = this._getAnnoNumber(this._axisType == AxisType.Y);
        if (anum > 10) {
            anum = 10;
        }

        var td = (0.001 * (this._actualMax - this._actualMin) / anum);

        var range = new _timeSpan(td * _timeSpan.TicksPerSecond);

        var delta = wijmo.isNumber(this._majorUnit) // TFS 250742
            ? _timeSpan.fromDays(this._majorUnit)
            : _timeHelper.NiceTimeSpan(range, fmt);

        if (!fmt) {
            this._tfmt = fmt = _timeHelper.GetTimeDefaultFormat(1000 * delta.TotalSeconds, 0);
        }

        var delta_ticks = delta.Ticks;

        var newmin = _timeHelper.RoundTime(min, delta.TotalDays, false);
        if (isFinite(newmin)) {
            min = newmin;
        }
        var newmax = _timeHelper.RoundTime(max, delta.TotalDays, true);
        if (isFinite(newmax)) {
            max = newmax;
        }

        var dtmin = new Date(min);
        var dtmax = new Date(max);

        if (delta.TotalDays >= 365 && !wijmo.isNumber(this._majorUnit)) { // TFS 250742
            dtmin = new Date(dtmin0.getFullYear(), 0, 1);
            if (dtmin < dtmin0) {
                dtmin.setFullYear(dtmin.getFullYear() + 1);
            }

            var years = (delta.TotalDays / 365);
            years = years - (years % 1);

            for (var current = dtmin; current <= dtmax0 && years;
                current.setFullYear(current.getFullYear() + years)
            ) {
                var val = current.valueOf();
                vals.push(val);
                lbls.push(this._formatValue(val));
            }
        }
        else if (delta.TotalDays >= 30 && !wijmo.isNumber(this._majorUnit)) { // TFS 250742
            dtmin = new Date(dtmin0.getFullYear(), dtmin0.getMonth(), 1);
            if (dtmin < dtmin0)
                dtmin.setMonth(dtmin.getMonth() + 1);

            var nmonths = delta.TotalDays / 30;
            nmonths = nmonths - (nmonths % 1);

            for (var current = dtmin; current <= dtmax0;
                current.setMonth(current.getMonth() + nmonths)
            ) {
                var val = current.valueOf();
                vals.push(val);
                lbls.push(this._formatValue(val));
            }
        } else {
            var dt = (1000 * delta_ticks) / _timeSpan.TicksPerSecond,
                current = dtmin,
                timedif = dtmin0.getTime() - current.getTime();
            if (timedif > dt) {
                current = new Date(current.getTime() + Math.floor(timedif / dt) * dt);
            }
            for (; current <= dtmax0 && dt;
                current = new Date(current.getTime() + dt)) {

                if (current >= dtmin0) {
                    var val = current.valueOf();

                    vals.push(val);
                    lbls.push(this._formatValue(val));
                }
            }
        }
    }

    _formatValue(val: number): string {
        if (this._isTimeAxis) {
            if (this._format) {
                return wijmo.Globalize.format(new Date(val), this._format);
            } else {
                return wijmo.Globalize.format(new Date(val), this._tfmt);
            }
        } else {
            if (this._format)
                return wijmo.Globalize.format(val, this._format);
            else {
                var fmt = val == Math.round(val) ? 'n0' : 'n';
                return wijmo.Globalize.format(val, fmt);
            }
        }
    }

    private _formatAxisValue(val: number, prec: number = undefined): string {
        if (this._isTimeAxis) {
            if (this._format) {
                return wijmo.Globalize.format(new Date(val), this._format);
            } else {
                return wijmo.Globalize.format(new Date(val), this._tfmt);
            }
        } else {
            if (this._format)
                return wijmo.Globalize.format(val, this._format);
            else {
                if (wijmo.isNumber(val)) {
                    let fmt = this._findFormat(val, prec);
                    return wijmo.Globalize.format(val, fmt);
                } else {
                    return val;
                }
            }
        }
    }

    private _findFormat(val: number, prec: number = undefined): string {
        var fmt = val == Math.round(val) ? 'n0' : 'n';

        if (prec !== undefined) {
            fmt += prec.toString();
        }

        if (fmt == 'n') {
            let s = val.toFixed(14);
            let pos = s.search('.');
            if (pos >= 0) {
                prec = 1;
                for (let i = s.length - 1; i >= pos; i--) {
                    if (s[i] != '0') {
                        prec = i - pos - 1;
                        break;
                    }
                }
                fmt += prec.toString();
            }
        }

        return fmt;
    }

    private _calcMajorUnit(): number {
        var delta = this._majorUnit;

        if (!wijmo.isNumber(delta)) {
            var range = this._actualMax - this._actualMin;
            var prec = this._nicePrecision(range);
            var dx = range / this._getAnnoNumber(this.axisType == AxisType.Y);

            delta = this._niceNumber(2 * dx, -prec, true);
            if (delta < dx) {
                delta = this._niceNumber(dx, -prec + 1, false);
            }
            if (delta < dx) {
                delta = this._niceTickNumber(dx);
            }
        }

        return delta;
    }

    private _getAnnoNumber(isVert: boolean): number {
        var w0 = isVert ? this._annoSize.height : this._annoSize.width;
        var w = isVert ? this._axrect.height : this._axrect.width;
        if (w0 > 0 && w > 0) {
            var n = Math.floor(w / (w0 + 6));
            if (n <= 0) {
                n = 1;
            }
            return n;
        } else {
            return 10;
        }
    }

    private _nicePrecision(range: number): number {
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

    private _niceTickNumber(x: number): number {
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

    _niceNumber(x: number, exp: number, round: boolean) {
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

    get _uniqueId(): number {
        return this.__uniqueId;
    }
}


/**
 * Represents a collection of {@link Axis} objects in a {@link FlexChart} control.
 */
export class AxisCollection extends wijmo.collections.ObservableArray {

    /**
     * Gets an axis by name.
     *
     * @param name The name of the axis to look for.
     * @return The axis object with the specified name, or null if not found.
     */
    getAxis(name: string): Axis {
        var index = this.indexOf(name);
        return index > -1 ? this[index] : null;
    }
    /**
     * Gets the index of an axis by name.
     *
     * @param name The name of the axis to look for.
     * @return The index of the axis with the specified name, or -1 if not found.
     */
    indexOf(name: string): number {
        for (var i = 0; i < this.length; i++) {
            if ((<Axis>this[i]).name == name) {
                return i;
            }
        }
        return -1;
    }
}

enum _tmInc {
    tickf7 = -7,
    tickf6 = -6,
    tickf5 = -5,
    tickf4 = -4,
    tickf3 = -3,
    tickf2 = -2,
    tickf1 = -1,
    second = 1,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7,
    month = day * 31,
    year = day * 365,
    maxtime = Number.MAX_VALUE
}

class _timeSpan {
    private ticks: number;

    public static TicksPerSecond: number = 10000000;

    constructor(ticks: number) {
        this.ticks = ticks;
    }

    public get Ticks(): number {
        return this.ticks;
    }

    public get TotalSeconds(): number {
        return this.ticks / 10000000;
    }

    public get TotalDays(): number {
        return this.ticks / 10000000 / (24 * 60 * 60);
    }

    public static fromSeconds(seconds: number): _timeSpan {
        return new _timeSpan(seconds * 10000000);
    }

    public static fromDays(days: number): _timeSpan {
        return new _timeSpan(days * 10000000 * 24 * 60 * 60);
    }
}

class _timeHelper {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;

    private init(dt: Date) {
        this.year = dt.getFullYear();
        this.month = dt.getMonth();
        this.day = dt.getDate();
        this.hour = dt.getHours();
        this.minute = dt.getMinutes();
        this.second = dt.getSeconds();
    }

    constructor(date: any) {
        if (wijmo.isDate(date))
            this.init(date);
        else if (wijmo.isNumber(date))
            this.init(FlexChartCore._fromOADate(date));
    }

    getTimeAsDateTime(): Date {
        var smon = 0, sday = 0, ssec = 0;

        // N3CHT000043
        if (this.hour >= 24) {
            this.hour -= 24;
            this.day += 1;
        }

        if (this.month < 0) {
            smon = -1 - this.day;
            this.month = 1;
        }
        else if (this.month > 11) {
            smon = this.month - 12;
            this.month = 12;
        }

        if (this.day < 1) {
            sday = -1 - this.day;
            this.day = 1;
        }
        else if (this.day > 28 && this.month == 2) {
            sday = this.day - 28;
            this.day = 28;
        }
        else if (this.day > 30 && (this.month == 4 || this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11)) {
            sday = this.day - 30;
            this.day = 30;
        }
        else if (this.day > 31) {
            sday = this.day - 31;
            this.day = 31;
        }

        if (this.second > 59) {
            ssec = this.second - 59;
            this.second = 59;
        }

        var smin = 0;
        if (this.minute > 59) {
            smin = this.minute - 59;
            this.minute = 59;
        }

        return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
    }

    getTimeAsDouble(): number {
        return this.getTimeAsDateTime().valueOf();
    }

    static tround(tval: number, tunit: number, roundup: boolean): number {
        var test = ((tval / tunit) * tunit);
        test = test - (test % 1);
        if (roundup && test != tval) {
            tunit = tunit - (tunit % 1)
            test += tunit;
        }
        return test;
    }

    static RoundTime(timevalue: number, unit: number, roundup: boolean): number {
        var tunit = unit * 24 * 60 * 60;

        if (tunit > 0) {
            var th = new _timeHelper(timevalue);

            if (tunit < _tmInc.minute) {
                th.second = this.tround(th.second, tunit, roundup);
                return th.getTimeAsDouble();
            }

            th.second = 0;
            if (tunit < _tmInc.hour) {
                tunit /= _tmInc.minute;
                th.minute = this.tround(th.minute, tunit, roundup);
                return th.getTimeAsDouble();
            }

            th.minute = 0;
            if (tunit < _tmInc.day) {
                tunit /= _tmInc.hour;
                th.hour = this.tround(th.hour, tunit, roundup);
                return th.getTimeAsDouble();
            }

            th.hour = 0;
            if (tunit < _tmInc.month) {
                tunit /= _tmInc.day;
                th.day = this.tround(th.day, tunit, roundup);
                return th.getTimeAsDouble();
            }

            th.day = 1;
            if (tunit < _tmInc.year) {
                tunit /= _tmInc.month;

                // Jan - is good enough
                if (th.month != 1)
                    th.month = this.tround(th.month, tunit, roundup);
                return th.getTimeAsDouble();
            }

            th.month = 1;
            tunit /= _tmInc.year;
            th.year = this.tround(th.year, tunit, roundup);
            return th.getTimeAsDouble();
        } else {
            // alext 26-Sep-03
            var td = timevalue;

            var tx = td - tunit;
            var tz = ((tx / unit)) * unit;// alext 12-Sep-06 int -> long VNCHT000517
            if (roundup && tz != tx)
                tz += unit;
            td = tunit + tz;
            return td;
        }
    }

    private static secInYear = (24 * 60 * 60);

    private static TimeSpanFromTmInc(ti: _tmInc): _timeSpan {
        var rv = _timeSpan.fromSeconds(1);

        if (ti != _tmInc.maxtime) {
            if (ti > _tmInc.tickf1) {
                rv = _timeSpan.fromSeconds(ti);
            } else {
                var rti = ti;
                var ticks = 1;
                rti += 7;	// rti is now power of 10 of number of Ticks
                while (rti > 0) {
                    ticks *= 10;
                    rti--;
                }
                rv = new _timeSpan(ticks);
            }
        }
        return rv;
    }

    private static manualTimeInc(manualformat: string): _tmInc {
        var minSpan = _tmInc.second;

        // only interested in the lowest increment of the format,
        // so it is not necessary that the format be valid, but it
        // must exist as a string to process.
        if (manualformat == null || manualformat.length == 0)
            return minSpan;

        var f = manualformat.indexOf('f');
        if (f >= 0) {
            var rv = -1;
            if (f > 0 && manualformat.substr(f - 1, 1) == '%') {
                rv = -1;
            } else {
                for (var i = 1; i < 6; i++) {
                    // alext 26-Sep-03
                    if ((f + i) >= manualformat.length)
                        break;
                    //
                    var ss = manualformat.substr(f + i, 1);

                    if (ss != 'f')
                        break;

                    rv--;
                }
            }
            minSpan = rv;
        }
        else if (manualformat.indexOf('s') >= 0)
            minSpan = _tmInc.second;
        else if (manualformat.indexOf('m') >= 0)
            minSpan = _tmInc.minute;
        else if (manualformat.indexOf('h') >= 0 || manualformat.indexOf('H'))
            minSpan = _tmInc.hour;
        else if (manualformat.indexOf('d') >= 0)
            minSpan = _tmInc.day;
        else if (manualformat.indexOf('M') >= 0)
            minSpan = _tmInc.month;
        else if (manualformat.indexOf('y') >= 0)
            minSpan = _tmInc.year;

        return minSpan;
    }

    private static getNiceInc(tik: number[], ts: number, mult: number): number {
        for (var i = 0; i < tik.length; i++) {
            var tikm = tik[i] * mult;
            if (ts <= tikm)
                return tikm;
        }
        return 0;
    }

    public static NiceTimeSpan(ts: _timeSpan, manualformat: string): _timeSpan {
        var minSpan = _tmInc.second;

        if (manualformat != null && manualformat.length > 0)
            minSpan = _timeHelper.manualTimeInc(manualformat);

        var tsinc = 0;
        var tinc = 0;

        // have the minimum required by format.
        if (minSpan < _tmInc.second) {
            // alext 10-Jan-2011
            if (ts.TotalSeconds < 10.0) {
                tsinc = ts.Ticks;
                tinc = _timeHelper.TimeSpanFromTmInc(minSpan).Ticks;

                while (tsinc > 10 * tinc)
                    tinc *= 10;

                // alext 10-Jan-2011
                var tinc1 = tinc;
                if (tsinc > tinc1)
                    tinc1 *= 2;
                if (tsinc > tinc1)
                    tinc1 = 5 * tinc;
                if (tsinc > tinc1)
                    tinc1 = 10 * tinc;

                //
                return new _timeSpan(tinc1);
            }
        }

        tsinc = Math.ceil(ts.TotalSeconds);

        if (tsinc == 0)
            return _timeHelper.TimeSpanFromTmInc(minSpan);

        tinc = 1;

        if (minSpan < _tmInc.minute) { // seconds
            if (tsinc < _tmInc.minute) {
                tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan);
                if (tinc != 0) return _timeSpan.fromSeconds(tinc);
            }
            minSpan = _tmInc.minute;
        }
        if (minSpan < _tmInc.hour) { // minutes
            if (tsinc < _tmInc.hour) {
                tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan);
                if (tinc != 0) return _timeSpan.fromSeconds(tinc);
            }
            minSpan = _tmInc.hour;
        }
        if (minSpan < _tmInc.day) { // hours
            if (tsinc < _tmInc.day) {
                tinc = _timeHelper.getNiceInc([1, 3, 6, 12], tsinc, minSpan);
                if (tinc != 0) return _timeSpan.fromSeconds(tinc);
            }
            minSpan = _tmInc.day;
        }
        if (minSpan < _tmInc.month) { // days
            if (tsinc < _tmInc.month) {
                tinc = _timeHelper.getNiceInc([1, 2, 7, 14], tsinc, minSpan);
                if (tinc != 0) return _timeSpan.fromSeconds(tinc);
            }
            minSpan = _tmInc.month;
        }
        if (minSpan < _tmInc.year) { // months
            if (tsinc < _tmInc.year) {
                tinc = _timeHelper.getNiceInc([1, 2, 3, 4, 6], tsinc, minSpan);
                if (tinc != 0) return _timeSpan.fromSeconds(tinc);
            }
            minSpan = _tmInc.year;
        }

        // years
        tinc = 100 * _tmInc.year;
        if (tsinc < tinc) {
            tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 20, 50], tsinc, minSpan);
            if (tinc == 0) tinc = 100 * _tmInc.year;
        }
        return _timeSpan.fromSeconds(tinc);
    }

    public static NiceTimeUnit(timeinc: number, manualformat: string): number {
        var tsRange = _timeSpan.fromDays(timeinc);
        tsRange = _timeHelper.NiceTimeSpan(tsRange, manualformat);
        return tsRange.TotalDays;
    }

    public static GetTimeDefaultFormat(maxdate: number, mindate: number): string {
        if (!wijmo.isNumber(maxdate) || !wijmo.isNumber(mindate)) {
            return '';
        }

        var format = 's';

        var tsRange = _timeSpan.fromSeconds(0.001 * (maxdate - mindate));
        var range = tsRange.TotalSeconds;

        if (range >= _tmInc.year) {
            format = 'yyyy';
        } else if (range >= _tmInc.month) {
            format = 'MMM yyyy';
        } else if (range >= _tmInc.day) {
            format = 'MMM d';
        } else if (range >= _tmInc.hour) {
            format = 'ddd H:mm';
        } else if (range >= 0.5 * _tmInc.hour) {
            format = 'H:mm';
        } else if (range >= 1) {
            format = 'H:mm:ss';
        } else if (range > 0) {
            var ticks = tsRange.Ticks;
            format = 's' + '.';
            while (ticks < _timeSpan.TicksPerSecond) {
                ticks *= 10;
                format += 'f';
            }
        }

        return format;
    }
}
    }
    


    module wijmo.chart {
    





'use strict';

export class _DataPoint {
    private _seriesIndex: number;
    private _pointIndex: number;
    private _dataX: number;
    private _dataY: number;

    constructor(seriesIndex: number, pointIndex: number, dataX: number, dataY: number) {
        this._seriesIndex = seriesIndex;
        this._pointIndex = pointIndex;
        this._dataX = dataX;
        this._dataY = dataY;
    }

    get seriesIndex(): number {
        return this._seriesIndex;
    }

    get pointIndex(): number {
        return this._pointIndex;
    }

    get dataX(): number {
        return this._dataX;
    }
    set dataX(value: number) {
        if (value !== this._dataX) {
            this._dataX = value;
        }
    }

    get dataY(): number {
        return this._dataY;
    }
    set dataY(value: number) {
        if (value !== this._dataY) {
            this._dataY = value;
        }
    }
}

export enum _MeasureOption {
    X,
    Y,
    XY
}

export class _RectArea implements _IHitArea {
    private _rect: wijmo.Rect;

    constructor(rect: wijmo.Rect) {
        this._rect = rect;
    }

    get rect(): wijmo.Rect {
        return this._rect;
    }

    tag: any;

    ignoreLabel: boolean;

    contains(pt: wijmo.Point): boolean {
        var rect = this._rect;
        return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
    }

    pointDistance(pt1: wijmo.Point, pt2: wijmo.Point, option: _MeasureOption): number {
        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;
        if (option == _MeasureOption.X) {
            return Math.abs(dx);
        } else if (option == _MeasureOption.Y) {
            return Math.abs(dy);
        }

        return Math.sqrt(dx * dx + dy * dy);
    }

    distance(pt: wijmo.Point): number {
        var option = _MeasureOption.XY;
        if ( isNaN(pt.x) || pt.x === null ) {
            option = _MeasureOption.Y;
        } else if ( isNaN(pt.y) || pt.y === null) {
            option = _MeasureOption.X;
        }

        var rect = this._rect;
        if (pt.x < rect.left) { // Region I, VIII, or VII
            if (pt.y < rect.top) { // I
                return this.pointDistance(pt, new wijmo.Point(rect.left, rect.top), option);
            }
            else if (pt.y > rect.bottom) { // VII
                return this.pointDistance(pt, new wijmo.Point(rect.left, rect.bottom), option);
            }
            else { // VIII

                if (option == _MeasureOption.Y) {
                    return 0;
                }
                return rect.left - pt.x;
            }
        }
        else if (pt.x > rect.right) { // Region III, IV, or V
            if (pt.y < rect.top) { // III
                return this.pointDistance(pt, new wijmo.Point(rect.right, rect.top), option);
            }
            else if (pt.y > rect.bottom) { // V
                return this.pointDistance(pt, new wijmo.Point(rect.right, rect.bottom), option);
            }
            else { // IV
                if (option == _MeasureOption.Y) {
                    return 0;
                }

                return pt.x - rect.right;
            }
        }
        else { // Region II, IX, or VI
            if (option == _MeasureOption.X) {
                return 0;
            }

            if (pt.y < rect.top) { // II
                return rect.top - pt.y;
            }
            else if (pt.y > rect.bottom) { // VI
                return pt.y - rect.bottom;
            }
            else { // IX
                return 0;
            }
        }
    }
}

export class _CircleArea implements _IHitArea {
    private _center: wijmo.Point;
    private _rad: number;
    private _rad2: number;

    tag: any;

    ignoreLabel: boolean;

    constructor(center: wijmo.Point, radius: number) {
        this._center = center;
        this.setRadius(radius);
    }

    setRadius(radius: number) {
        this._rad = radius;
        this._rad2 = radius * radius;
    }

    get center(): wijmo.Point {
        return this._center;
    }

    contains(pt: wijmo.Point): boolean {
        var dx = this._center.x - pt.x;
        var dy = this._center.y - pt.y;
        return dx * dx + dy * dy <= this._rad2;
    }

    distance(pt: wijmo.Point): number {
        var dx = !isNaN(pt.x) ? this._center.x - pt.x : 0;
        var dy = !isNaN(pt.y) ? this._center.y - pt.y : 0;

        var d2 = dx * dx + dy * dy;

        if (d2 <= this._rad2)
            return 0;
        else
            return Math.sqrt(d2) - this._rad;
    }
}

export class _LinesArea implements _IHitArea {
    private _x = [];
    private _y = [];

    tag: any;

    ignoreLabel: boolean;

    constructor(x: any, y: any) {
        this._x = x;
        this._y = y;
    }

    contains(pt: wijmo.Point): boolean {
        return false;
    }

    distance(pt: wijmo.Point): number {
        var dmin = NaN;
        for (var i = 0; i < this._x.length - 1; i++) {
            var d = FlexChartCore._dist(pt, new wijmo.Point(this._x[i], this._y[i]), new wijmo.Point(this._x[i + 1], this._y[i + 1]));
            if (isNaN(dmin) || d < dmin) {
                dmin = d;
            }
        }

        return dmin;
    }
}

export class _HitResult {
    area: _IHitArea;
    distance: number;
}

export class _HitTester {
    _chart: FlexChartCore;
    _map: { [key: number]: Array<_IHitArea> } = {};

    constructor(chart: FlexChartCore) {
        this._chart = chart;
    }

    add(area: _IHitArea, seriesIndex: number) {
        if (this._map[seriesIndex]) {
            if (!area.tag) {
                area.tag = new _DataPoint(seriesIndex, NaN, NaN, NaN);
            }
            this._map[seriesIndex].push(area);
        }
    }

    clear() {
        this._map = {};
        var series = this._chart.series;
        for (var i = 0; i < series.length; i++) {
            if (series[i].hitTest === Series.prototype.hitTest) {
                this._map[i] = new Array<_IHitArea>();
            }
        }
    }

    hitTest(pt: wijmo.Point, testLines= false): _HitResult {
        var closest = null;
        var dist = Number.MAX_VALUE;

        var series = this._chart.series;
        for (var key = series.length-1; key >=0; key--) {
            var areas = this._map[key];
            if (areas) {
                var len = areas.length;

                for (var i = len - 1; i >= 0; i--) {
                    var area = areas[i];
                    if (wijmo.tryCast(area, _LinesArea) && !testLines) {
                        continue;
                    }

                    var d = area.distance(pt);
                    if (d < dist) {
                        dist = d;
                        closest = area;
                        if (dist == 0)
                            break;
                    }
                }

                if (dist == 0)
                    break;
            }
        }

        if (closest) {
            var hr = new _HitResult();
            hr.area = closest;
            hr.distance = dist;
            return hr;
        }

        return null;
    }

    hitTestSeries(pt: wijmo.Point, seriesIndex): _HitResult {
        var closest = null;
        var dist = Number.MAX_VALUE;

        var areas = this._map[seriesIndex];
        if (areas) {
            var len = areas.length;

            for (var i = len - 1; i >= 0; i--) {
                var area = areas[i];

                var d = area.distance(pt);
                if (d < dist) {
                    dist = d;
                    closest = area;
                    if (dist == 0)
                        break;
                }
            }
        }

        if (closest) {
            var hr = new _HitResult();
            hr.area = closest;
            hr.distance = dist;
            return hr;
        }

        return null;
    }
}
    }
    


    module wijmo.chart {
    







'use strict';

/**
 * Specifies the type of chart element found by the hitTest method.
 */
export enum ChartElement {
    /** The area within the axes. */
    PlotArea,
    /** X-axis. */
    AxisX,
    /** Y-axis. */
    AxisY,
    /** The area within the control but outside the axes. */
    ChartArea,
    /** The chart legend. */
    Legend,
    /** The chart header. */
    Header,
    /** The chart footer. */
    Footer,
    /** A chart series. */
    Series,
    /** A chart series symbol. */
    SeriesSymbol,
    /** A data label. */
    DataLabel,
    /** No chart element. */
    None
};

/**
 * Contains information about a part of a {@link FlexChart} control at
 * a specified page coordinate.
 */
export class HitTestInfo {
    private _chart: FlexChartBase;
    private _pt: wijmo.Point;

    private _series: SeriesBase;
    private _pointIndex: number = null;
    _chartElement: ChartElement = ChartElement.None;
    _dist: number;
    private _item: any;
    private _x: any;
    private __xfmt: string;
    private _y: any;
    private __yfmt: string;
    private _name: string;
        private _groupIndex: number;

    /**
     * Initializes a new instance of the {@link HitTestInfo} class.
     *
     * @param chart The chart control.
     * @param point The original point in window coordinates.
     * @param element The chart element.
     */
    constructor(chart: FlexChartBase, point: wijmo.Point, element?: ChartElement) {
        this._chart = chart;
        this._pt = point;
        this._chartElement = element;
    }

    /**
     * Gets the {@link FlexChartBase} that owns this {@link HitTestInfo}.
     */
    get chart(): FlexChartBase {
        return this._chart;
    }

    /**
     * Gets the point, in control coordinates,
     * that this {@link HitTestInfo} refers to.
     */
    get point(): wijmo.Point {
        return this._pt;
    }

    /**
     * Gets the chart series at the specified coordinates.
     */
    get series(): SeriesBase {
        return this._series;
    }

    /**
     * Gets the data point index at the specified coordinates.
     */
    get pointIndex(): number {
        return this._pointIndex;
    }

    /**
     * Gets the chart element at the specified coordinates.
     */
    get chartElement(): ChartElement {
        return this._chartElement;
    }

    /**
     * Gets the distance to the closest data point.
     */
    get distance(): number {
        return this._dist;
    }

    /**
     * Gets the data object that corresponds to the closest data point.
     */
    get item(): any {
        if (this._item == null) {
            if (this.pointIndex !== null) {
                if (this.series != null) {
                    this._item = this.series._getItem(this.pointIndex);
                } else {
                    var item = this._chart._getHitTestItem(this.pointIndex);
                    if (item) {
                        this._item = item;
                    }
                }
            }
        }
        return this._item;
    }

    /**
     * Gets the x-value of the closest data point.
     */
    get x(): any {
        if (this._x === undefined) {
            this._x = this._getValue(1, false);
        }
        return this._x;
    }

    /**
     * Gets the y-value of the closest data point.
     */
    get y(): any {
        if (this._y === undefined) {
            this._y = this._getValue(0, false);
        }
        return this._y;
    }

    get value(): any {
        var val = this._chart._getHitTestValue(this.pointIndex, this._groupIndex);
        if (val != null) {
            return val;
        } else if(this.series) {
            if((<any>this.series)._getValue!=null) {
                return (<any>this.series)._getValue(this.pointIndex);
            }
        }
        return this.y;
    }

    get name(): any {
        if (this._name === undefined) {
            var label = this._chart._getHitTestLabel(this.pointIndex);
            return label == null ? this.series.name : label.toString();
        }
        return this._name;
    }

    /**
     * Gets the group index for the closest data point.
     */
    get groupIndex(): number {
        return this._groupIndex;
    }

    // formatted x-value
    get _xfmt(): any {
        if (this.__xfmt === undefined) {
            this.__xfmt = this._getValue(1, true);
        }
        return this.__xfmt;
    }

    // formatted y-value
    get _yfmt(): any {
        if (this.__yfmt === undefined) {
            this.__yfmt = this._getValue(0, true);
        }
        return this.__yfmt;
    }

    _setData(series: SeriesBase, pi?: number) {
        this._series = series;
        this._pointIndex = pi;
    }

        _setDataGroup(gi: number, pi: number) {
            this._groupIndex = gi;
            this._pointIndex = pi;
        }

    _setDataPoint(dataPoint: _DataPoint) {
        dataPoint = wijmo.asType(dataPoint, _DataPoint, true);
        if (dataPoint) {
            this._pointIndex = dataPoint.pointIndex;
            var fch = <FlexChartCore>wijmo.asType(this._chart, FlexChartCore, true);
            var si = dataPoint.seriesIndex;
            if (si !== null && si >= 0 && si < fch.series.length) {
                this._series = fch.series[si];
            }

            // additional properties
            if (dataPoint['item'] != null) {
                this._item = dataPoint['item'];
            }
            if (dataPoint['x'] != null) {
                this._x = dataPoint['x'];
            }
            if (dataPoint['y'] != null) {
                this._y = dataPoint['y'];
            }
            if (dataPoint['xfmt'] != null) {
                this.__xfmt = dataPoint['xfmt'];
            }
            if (dataPoint['yfmt'] != null) {
                this.__yfmt = dataPoint['yfmt'];
            }
            if (dataPoint['name'] != null) {
                this._name = dataPoint['name'];
            }
        }
    }

    _getValueFmt() : any {
        let v = this.value;
        if(v!=null) {
            if( this.series!=null) {
                let chart = <FlexChartCore>this._chart;
                v = chart._isRotated() ? this.ax._formatValue(v) : this.ay._formatValue(v);
            } else {
                var fmt = v == Math.round(v) ? '{val:n0}' : '{val:n}';
                return wijmo.format( fmt, { val : v});
            }
        }

        return v;
    }

    // y: index=0
    // x: index=1
    private _getValue(index: number, formatted: boolean): any {
        var value = this._chart._getHitTestValue(this.pointIndex, this.groupIndex);
        if (value !== null) {
            return value;
        }
        // todo: rotated charts?

        var val = null,
            chart = <FlexChartCore>this._chart,
            pi = this.pointIndex,
            rotated = chart._isRotated();

        if (this.series !== null && pi !== null) {
            var vals = this.series.getValues(index); // xvalues
            var type = this.series.getDataType(index);

            // normal values
            if (vals && this.pointIndex < vals.length) {
                val = vals[this.pointIndex];
                if (type == wijmo.DataType.Date && !formatted) {
                    val = new Date(val);
                }
            } else if (index == 1) {
                // category axis
                if (chart._xlabels && chart._xlabels.length > 0 && pi < chart._xlabels.length) {
                    val = chart._xlabels[pi];
                    // automatic axis values
                } else if (chart._xvals && pi < chart._xvals.length) {
                    val = chart._xvals[pi];
                    if (chart._xDataType == wijmo.DataType.Date && !formatted) {
                        val = new Date(val);
                    }
                }
            }
        }
        if (val !== null && formatted) {
            if (rotated) {
                if (index == 0) {
                    val = this.ax._formatValue(val);
                } else if (index == 1) {
                    val = this.ay._formatValue(val);
                }
            } else {
            if (index == 0) {
                    val = this.ay._formatValue(val);
            } else if(index == 1) {
                    val = this.ax._formatValue(val);
                }
            }
        }

        return val;
    }

    private get ax(): Axis{
        return this.series.axisX ? this.series.axisX : (<FlexChartCore>this._chart).axisX;
    }

    private get ay(): Axis {
        return this.series.axisY ? this.series.axisY : (<FlexChartCore>this._chart).axisY;
    }
}
    }
    


    module wijmo.chart {
    









'use strict';

/**
 * Specifies whether and where the Series is visible.
 */
export enum SeriesVisibility {
    /** The series is visible on the plot and in the legend. */
    Visible,
    /** The series is visible only on the plot. */
    Plot,
    /** The series is visible only in the legend. */
    Legend,
    /** The series is hidden. */
    Hidden
}

/**
 * Specifies the type of marker to use for the {@link Series.symbolMarker}
 * property.
 *
 * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
 */
export enum Marker {
    /**
     * Uses a circle to mark each data point.
     */
    Dot,
    /**
     * Uses a square to mark each data point.
     */
    Box
};

/**
 * Data series interface
 */
export interface _ISeries {
    style: any;
    symbolStyle: any;
    getValues: (dim: number) => number[];
    getDataType: (dim: number) => wijmo.DataType;
    //chartType: ChartType;

    drawLegendItem(engine: IRenderEngine, rect: wijmo.Rect, index: number);
    measureLegendItem(engine: IRenderEngine, index: number): wijmo.Size;
    _setPointIndex(pointIndex: number, elementIndex: number);
}

export class DataArray {
    dataType: wijmo.DataType;
    values: Array<number>;
}

/**
 * Provides arguments for {@link Series} events.
 */
export class SeriesEventArgs extends wijmo.EventArgs {
    _series: SeriesBase;

    /**
     * Initializes a new instance of the {@link SeriesEventArgs} class.
     *
     * @param series Specifies the {@link Series} object affected by this event.
     */
    constructor(series: SeriesBase) {
        super();
        this._series = wijmo.asType(series, SeriesBase);
    }

    /**
     * Gets the {@link Series} object affected by this event.
     */
    get series(): SeriesBase {
        return this._series;
    }
}

/**
 * Represents a series of data points to display in the chart.
 */
export class SeriesBase implements _ISeries {
    static _LEGEND_ITEM_WIDTH = 10;
    static _LEGEND_ITEM_HEIGHT = 10;
    static _LEGEND_ITEM_MARGIN = 4;
    private static _DEFAULT_SYM_SIZE = 10;

    // property storage
    __chart: FlexChartCore;
    private _name: string;
    private _binding: string;
    private _showValues: boolean;
    private _symbolStyle: any;
    private _symbolSize: number;
    private _style: any;
    private _altStyle: any = null;

    _cv: wijmo.collections.ICollectionView;
    private _itemsSource: any;
    private _values: number[];
    private _valueDataType: wijmo.DataType;
    _chartType: ChartType;
    private _symbolMarker: Marker = Marker.Dot;

    private _bindingX: string;
    private _xvalues: number[];
    private _xvalueDataType: wijmo.DataType;
    private _cssClass: string;
    private _visibility: SeriesVisibility = SeriesVisibility.Visible;

    private _axisX: Axis;
    private _axisY: Axis;
    private __plotter: _IPlotter;
    private _interpolateNulls = null;
    private _tooltipContent: any;
    private _itemFormatter: Function;
    private _cache: { [key: number]: number[] } = {};

    _legendElement: SVGAElement;
    _hostElement: SVGGElement;
    _pointIndexes: number[];

    /**
     * Initializes a new instance of the {@link SeriesBase} class.
     *
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        this.initialize(options);
    }

    //--------------------------------------------------------------------------
    // ** implementation


    /**
     * Gets or sets a value that determines whether to interpolate 
     * null values in the data.
     *
     * If true, the series interpolates the value of any missing data
     * based on neighboring points. If false, it leaves a break in
     * lines and areas at the points with null values.
     *
     * The default value for this property is <b>false</b>.
     */
    get interpolateNulls(): boolean {
        return this._interpolateNulls == null ? this._chart && this._chart.interpolateNulls : this._interpolateNulls;
    }
    set interpolateNulls(value: boolean) {
        if (value != this._interpolateNulls) {
            this._interpolateNulls = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the series style.
     */
    get style(): any {
        return this._style;
    }
    set style(value: any) {
        if (value != this._style) {
            this._style = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the alternate style for the series.
     * 
     * The alternate style is used for negative values in Bar, Column,
     * and Scatter charts; and for rising values in financial chart types
     * like Candlestick, LineBreak, EquiVolume etc.
     *
     * The default value for this property is <b>null</b>, which causes the
     * series to use the default style.
     */
    get altStyle(): any {
        return this._altStyle;
    }
    set altStyle(value: any) {
        if (value != this._altStyle) {
            this._altStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the series symbol style.
     * 
     * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
     */
    get symbolStyle(): any {
        return this._symbolStyle;
    }
    set symbolStyle(value: any) {
        if (value != this._symbolStyle) {
            this._symbolStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the size (in pixels) of the symbols used to render this {@link Series}.
     * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
     * 
     * The default value for this property is <b>10</b> pixels.
     */
    get symbolSize(): number {
        return this._symbolSize;
    }
    set symbolSize(value: number) {
        if (value != this._symbolSize) {
            this._symbolSize = wijmo.asNumber(value, true, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the shape of marker to use for each data point in the series.
     * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
     * 
     * The default value for this property is <b>Marker.Dot</b>.
     */
    get symbolMarker(): Marker {
        return this._symbolMarker;
    }
    set symbolMarker(value: Marker) {
        value = wijmo.asEnum(value, Marker, true);
        if (value != this._symbolMarker) {
            this._symbolMarker = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the name of the property that contains Y values for the series.
     */
    get binding(): string {
        return this._binding ? this._binding : this._chart ? this._chart.binding : null;
    }
    set binding(value: string) {
        if (value != this._binding) {
            this._binding = wijmo.asString(value, true);
            this._clearValues();
            this._invalidate();
        }
    }
    /**
     * Gets or sets the name of the property that contains X values for the series.
     */
    get bindingX(): string {
        return this._bindingX ? this._bindingX : this._chart ? this._chart.bindingX : null;
    }
    set bindingX(value: string) {
        if (value != this._bindingX) {
            this._bindingX = wijmo.asString(value, true);
            this._clearValues();
            this._invalidate();
        }
    }
    /**
     * Gets or sets the series name.
     *
     * The series name is displayed in the chart legend. Any series without a name
     * does not appear in the legend.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
    /**
     * Gets or sets the array or {@link ICollectionView} object that contains the series data.
     */
    get itemsSource(): any {
        return this._itemsSource;
    }
    set itemsSource(value: any) {
        if (value != this._itemsSource) {

            // unbind current collection view
            if (this._cv) {
                this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                this._cv = null;
            }

            // save new data source and collection view
            this._itemsSource = value;
            this._cv = wijmo.asCollectionView(value);

            // bind new collection view
            if (this._cv != null) {
                this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
            }

            this._clearValues();
            this._itemsSource = value;
            this._invalidate();
        }
    }
    /**
     * Gets the {@link ICollectionView} object that contains the data for this series.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._cv ? this._cv : this._chart ? this._chart.collectionView : null;
    }
    /**
     * Gets the {@link FlexChart} object that owns this series.
     */
    get chart(): FlexChartCore {
        return this._chart;
    }
    /**
     * Gets the series host element.
     */
    get hostElement(): SVGGElement {
        return this._hostElement;
    }
    /**
     * Gets the series element in the legend.
     */
    get legendElement(): SVGGElement {
        return this._legendElement;
    }
    /**
     * Gets or sets the series CSS class.
     */
    get cssClass(): string {
        return this._cssClass;
    }
    set cssClass(value: string) {
        this._cssClass = wijmo.asString(value, true);
    }
    /**
     * Gets or sets an enumerated value indicating whether and where the series appears.
     * 
     * The default value for this property is <b>SeriesVisibility.Visible</b>.
     */
    get visibility(): SeriesVisibility {
        return this._visibility;
    }
    set visibility(value: SeriesVisibility) {
        value = wijmo.asEnum(value, SeriesVisibility);
        if (value != this._visibility) {
            this._visibility = value;
            this._clearValues();
            this._invalidate();
            if (this._chart) {
                this._chart.onSeriesVisibilityChanged(new SeriesEventArgs(this));
            }
        }
    }
    /**
     * Gets or sets the series specific tooltip content.
     *
     * The property overrides the content of chart tooltip content.
     */
    get tooltipContent(): any {
        return this._tooltipContent;
    }
    set tooltipContent(value: any) {
        if (value != this._tooltipContent) {
            this._tooltipContent = value;
        }
    }
    /**
     * Gets or sets the item formatter function that allows you to customize
     * the appearance of the series.
     *
     * The property overrides the chart's itemFormatter {@link wijmo.chart.FlexChart.itemFormatter}.
     */
    get itemFormatter(): Function {
        return this._itemFormatter;
    }
    set itemFormatter(value: Function) {
        if (value != this._itemFormatter) {
            this._itemFormatter = wijmo.asFunction(value);
            this._invalidate();
        }
    }
    /**
     * Gets a {@link HitTestInfo} object with information about the specified point.
     *
     * @param pt The point to investigate, in window coordinates.
     * @param y The Y coordinate of the point (if the first parameter is a number).
     */
    hitTest(pt: any, y?: number): HitTestInfo {
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y) as well
            pt = new wijmo.Point(pt, y);
        } else if (pt instanceof MouseEvent) {
            pt = new wijmo.Point(pt.pageX, pt.pageY);
        }
        wijmo.asType(pt, wijmo.Point);

        if (this._chart) {
            return this._chart._hitTestSeries(pt, this._chart.series.indexOf(this));
        }
        else {
            return null;
        }
    }
    /**
     * Gets the plot element that corresponds to the specified point index.
     *
     * @param pointIndex The index of the data point.
     */
    getPlotElement(pointIndex: number): any {
        if (this.hostElement) {
            if (pointIndex < this._pointIndexes.length) {
                var elementIndex = this._pointIndexes[pointIndex];
                if (elementIndex < this.hostElement.childNodes.length) {
                    return this.hostElement.childNodes[elementIndex];
                }
            }
        }
        return null;
    }
    /**
     * Gets or sets the X-axis for the series.
     */
    get axisX(): Axis {
        return this._axisX;
    }
    set axisX(value: Axis) {
        if (value != this._axisX) {
            this._axisX = wijmo.asType(value, Axis, true);
            if (this._axisX) {
                var chart = this._axisX._chart = this._chart;
                if (chart && chart.axes.indexOf(this._axisX) == -1) {
                    chart.axes.push(this._axisX);
                }
            }
            this._invalidate();
        }
    }
    /**
     * Gets or sets the Y-axis for the series.
     */
    get axisY(): Axis {
        return this._axisY;
    }
    set axisY(value: Axis) {
        if (value != this._axisY) {
            this._axisY = wijmo.asType(value, Axis, true);
            if (this._axisY) {
                var chart = this._axisY._chart = this._chart;
                if (chart && chart.axes.indexOf(this._axisY) == -1) {
                    chart.axes.push(this._axisY);
                }
            }
            this._invalidate();
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

    /**
     * Converts a {@link Point} from control coordinates to series data coordinates.
     *
     * @param pt The point to convert, in control coordinates.
     * @return The point in series data coordinates.
     */
    pointToData(pt: wijmo.Point): wijmo.Point {
        wijmo.asType(pt, wijmo.Point);
        pt = pt.clone();
        pt.x = this._getAxisX().convertBack(pt.x);
        pt.y = this._getAxisY().convertBack(pt.y);
        return pt;
    }

    /**
     * Converts a {@link Point} from series data coordinates to control coordinates.
     *
     * @param pt {@link Point} in series data coordinates.
     * @return The {@link Point} in control coordinates.
     */
    dataToPoint(pt: wijmo.Point): wijmo.Point {
        wijmo.asType(pt, wijmo.Point);
        pt = pt.clone();
        pt.x = this._getAxisX().convert(pt.x);
        pt.y = this._getAxisY().convert(pt.y);
        return pt;
    }

    /**
     * Occurs when series is rendering.
     */
    readonly rendering = new wijmo.Event<SeriesBase, SeriesRenderingEventArgs>();
    /**
     * Raises the {@link rendering} event.
     *
     * @param engine The {@link IRenderEngine} object used to render the series.
     * @param index The index of the series to render.
     * @param count Total number of the series to render.
     */
    onRendering(engine: IRenderEngine, index: number, count: number): boolean {
        var args = new SeriesRenderingEventArgs(engine, index, count);
        this.rendering.raise(this, args);
        return args.cancel;
    }
    /**
     * Occurs when series is rendered.
     */
    readonly rendered = new wijmo.Event<SeriesBase, RenderEventArgs>();
    /**
     * Raises the {@link rendered} event.
     *
     * @param engine The {@link IRenderEngine} object used to render the series.
     */
    onRendered(engine: IRenderEngine) {
        this.rendered.raise(this, new RenderEventArgs(engine));
    }

    // ** private stuff

    get _chart(): FlexChartCore {
        return this.__chart;
    }
    set _chart(value: FlexChartCore) {
        if (value !== this.__chart) {
            this.__chart = value;
        }
    }
    _getSymbolSize(): number {
        return this.symbolSize != null ? this.symbolSize : this.chart.symbolSize;
    }
    get _plotter(): _IPlotter {
        if (this.chart && !this.__plotter) {
            this.__plotter = this.chart._getPlotter(this);
        }
        return this.__plotter;
    }
    set _plotter(value: _IPlotter) {
        if (value != this.__plotter) {
            this.__plotter = value;
        }
    }

    //--------------------------------------------------------------------------
    // ** implementation

    getDataType(dim: number): wijmo.DataType {
        if (dim == 0) {
            return this._valueDataType;
        }
        else if (dim == 1) {
            return this._xvalueDataType;
        }
        return null;
    }
    getValues(dim: number): number[] {
        if (dim == 0) {
            if (this._values == null) {
                this._valueDataType = null;
                if (this._cv != null) {
                    var da = this._bindValues(this._cv.items, this._getBinding(0));
                    this._values = da.values;
                    this._valueDataType = da.dataType;
                }
                else if (this.binding != null) {
                    if (this._chart != null && this._chart.collectionView != null) {
                        var da = this._bindValues(this._chart.collectionView.items, this._getBinding(0));
                        this._values = da.values;
                        this._valueDataType = da.dataType;
                    }
                }
            }
            return this._values;
        } else if (dim == 1) {
            if (this._xvalues == null) {
                this._xvalueDataType = null;

                var base: any = this;

                if (this.bindingX != null) {
                    if (base._cv != null) {
                        var da = this._bindValues(base._cv.items, this.bindingX, true);
                        this._xvalueDataType = da.dataType;
                        this._xvalues = da.values;
                    }
                    else {
                        if (this._bindingX == null) {
                            return null;
                        }

                        if (base._chart != null && base._chart.collectionView != null) {
                            var da = this._bindValues(base._chart.collectionView.items, this.bindingX, true);
                            this._xvalueDataType = da.dataType;
                            this._xvalues = da.values;
                        }
                    }
                }
            }
            return this._xvalues;
        }
        return null;
    }
    /**
     * Draw a legend item at the specified position.
     *
     * @param engine The rendering engine to use.
     * @param rect The position of the legend item.
     * @param index Index of legend item(for series with multiple legend items).
     */
    drawLegendItem(engine: IRenderEngine, rect: wijmo.Rect, index: number) {
        var chartType = this._getChartType();
        if (chartType == null) {
            chartType = this._chart._getChartType();
        }

        let style = this._getLegendStyle(this.style);
        if (chartType === ChartType.Funnel) {
            this._drawFunnelLegendItem(engine, rect, index, style, this.symbolStyle);
        } else {
            this._drawLegendItem(engine, rect, chartType, this.name, style, this.symbolStyle);
        }
    }

    private _getLegendStyle(style) {
        if (!style) {
            return;
        }
        let s: any = {};
        if (style.fill) {
            s.fill = style.fill;
        }
        if (style.stroke) {
            s.stroke = style.stroke;
        }
        return s;
    }

    /**
     * Measures height and width of the legend item.
     *
     * @param engine The rendering engine to use.
     * @param index Index of legend item(for series with multiple legend items).
     */
    measureLegendItem(engine: IRenderEngine, index: number): wijmo.Size {
        var chartType = this._getChartType();
        if (chartType == null) {
            chartType = this._chart._getChartType();
        }

        if (chartType === ChartType.Funnel) {
            return this._measureLegendItem(engine, this._getFunnelLegendName(index));
        } else {
            return this._measureLegendItem(engine, this.name);
        }
    }
    /**
     * Returns number of series items in the legend.
     */
    legendItemLength(): number {
        var chartType = this._getChartType();
        if (chartType == null) {
            chartType = this._chart._getChartType();
        }
        if (chartType === ChartType.Funnel) {
            if (this._chart._xlabels && this._chart._xlabels.length) {
                return this._chart._xlabels.length;
            } else if (this._chart._xvals && this._chart._xvals.length) {
                return this._chart._xvals.length;
            }
            return 1;
        } else {
            return 1;
        }
    }
    /**
     * Returns the series bounding rectangle in data coordinates.
     *
     * If getDataRect() returns null, the limits are calculated automatically based on the data values.
     *
     * @param currentRect The current rectangle of chart. This parameter is optional.
     * @param calculatedRect The calculated rectangle of chart. This parameter is optional.
     */
    getDataRect(currentRect?: wijmo.Rect, calculatedRect?: wijmo.Rect): wijmo.Rect {
        return null;
    }
    _getChartType(): ChartType {
        return this._chartType;
    }
    /**
     * Clears any cached data values.
     */
    _clearValues() {
        this._values = null;
        this._xvalues = null;
        this.__plotter = null;
        this._cache = {};
    }
    _getBinding(index: number): string {
        var binding = this.binding;
        if (binding) {
            var sep = this.chart ? this.chart._bindingSeparator : ',';
            if (sep) {
                var props = binding.split(sep);
                if (props && props.length > index) {
                    binding = props[index].trim();
                }
            }
        }
        return binding;
    }
    _getBindingValues(index: number): number[] {
        if (this._cache[index]) {
            return this._cache[index];
        } else {
            var items: any[];
            if (this._cv != null) {
                items = this._cv.items;
            }
            else if (this._chart != null && this._chart.collectionView != null) {
                items = this._chart.collectionView.items;
            }

            var da = this._bindValues(items, this._getBinding(index));
            return this._cache[index] = da.values;
        }
    }
    _getItem(pointIndex: number): any {
        var item = null;
        var items = null;
        if (this.itemsSource != null) {
            if (this._cv != null)
                items = this._cv.items;
            else
                items = this.itemsSource;
        }
        else if (this._chart.itemsSource != null) {
            if (this._chart.collectionView != null) {
                items = this._chart.collectionView.items;
            } else {
                items = this._chart.itemsSource;
            }
        }
        if (items != null) {
            item = items[pointIndex];
        }

        return item;
    }
    _getLength(): number {
        var len = 0;
        var items = null;
        if (this.itemsSource != null) {
            if (this._cv != null)
                items = this._cv.items;
            else
                items = this.itemsSource;
        } else if (this._chart.itemsSource != null) {
            if (this._chart.collectionView != null) {
                items = this._chart.collectionView.items;
            } else {
                items = this._chart.itemsSource;
            }
        }

        if (items != null) {
            len = items.length
        }
        return len;
    }
    _setPointIndex(pointIndex: number, elementIndex: number) {
        this._pointIndexes[pointIndex] = elementIndex;
    }

    private _getDataRect(): wijmo.Rect {
        var values = this.getValues(0);
        var xvalues = this.getValues(1);
        if (values) {
            var xmin = NaN,
                ymin = NaN,
                xmax = NaN,
                ymax = NaN;

            var len = values.length;

            for (var i = 0; i < len; i++) {
                var val = values[i];
                if (isFinite(val)) {
                    if (isNaN(ymin)) {
                        ymin = ymax = val;
                    } else {
                        if (val < ymin) {
                            ymin = val;
                        } else if (val > ymax) {
                            ymax = val;
                        }
                    }
                }
                if (xvalues) {
                    var xval = xvalues[i];
                    if (isFinite(xval)) {
                        if (isNaN(xmin)) {
                            xmin = xmax = xval;
                        } else {
                            if (xval < xmin) {
                                xmin = xval;
                            } else if (val > ymax) {
                                xmax = xval;
                            }
                        }
                    }
                }
            }

            if (!xvalues) {
                xmin = 0; xmax = len - 1;
            }

            if (!isNaN(ymin)) {
                return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }
        }

        return null;
    }

    _isCustomAxisX(): boolean {
        if (this._axisX) {
            if (this._chart) {
                return this._axisX != this.chart.axisX;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    _isCustomAxisY(): boolean {
        if (this._axisY) {
            if (this._chart) {
                return this._axisY != this.chart.axisY;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    _getAxisX(): Axis {
        var ax: Axis = null;
        if (this.axisX) {
            ax = this.axisX;
        } else if (this.chart) {
            ax = this.chart.axisX;
        }
        return ax;
    }

    _getAxisY(): Axis {
        var ay: Axis = null;
        if (this.axisY) {
            ay = this.axisY;
        } else if (this.chart) {
            ay = this.chart.axisY;
        }
        return ay;
    }

    _measureLegendItem(engine: IRenderEngine, text: string): wijmo.Size {
        var sz = new wijmo.Size();
        sz.width = SeriesBase._LEGEND_ITEM_WIDTH;
        sz.height = SeriesBase._LEGEND_ITEM_HEIGHT;
        if (this._name) {
            var tsz = engine.measureString(text, FlexChartCore._CSS_LABEL, FlexChartCore._CSS_LEGEND);
            sz.width += tsz.width;
            if (sz.height < tsz.height) {
                sz.height = tsz.height;
            }
        };
        sz.width += 3 * SeriesBase._LEGEND_ITEM_MARGIN;
        sz.height += 2 * SeriesBase._LEGEND_ITEM_MARGIN;
        return sz;
    }

    _drawFunnelLegendItem(engine: IRenderEngine, rect: wijmo.Rect, index: number, style: any, symbolStyle: any) {

        engine.strokeWidth = 1;

        var marg = SeriesBase._LEGEND_ITEM_MARGIN;

        var fill = null;
        var stroke = null;

        if (fill === null)
            fill = this._chart._getColorLight(index);
        if (stroke === null)
            stroke = this._chart._getColor(index);

        engine.fill = fill;
        engine.stroke = stroke;

        var yc = rect.top + 0.5 * rect.height;

        var wsym = SeriesBase._LEGEND_ITEM_WIDTH;
        var hsym = SeriesBase._LEGEND_ITEM_HEIGHT;
        var name = this._getFunnelLegendName(index);
        engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);

        if (name != null) {
            FlexChartCore._renderText(engine, name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChartCore._CSS_LABEL, FlexChartCore._CSS_LEGEND);
        }
    }

    private _getFunnelLegendName(index): string {
        var chart = this._chart,
            name;

        if (chart._xlabels && chart._xlabels.length && index < chart._xlabels.length) {
            name = chart._xlabels[index];
        } else if (chart._xvals && chart._xvals.length && index < chart._xvals.length) {
            name = chart._xvals[index];
            if (chart._xDataType === wijmo.DataType.Date) {
                name = FlexChartCore._fromOADate(name);
            }
        }
        if (name == null) {
            name = this.name;
        }
        return name.toString();
    }

    _drawLegendItem(engine: IRenderEngine, rect: wijmo.Rect, chartType: ChartType, text: string, style: any, symbolStyle: any) {

        engine.strokeWidth = 1;

        var marg = SeriesBase._LEGEND_ITEM_MARGIN;

        var fill = null;
        var stroke = null;

        if (fill === null)
            fill = this._chart._getColorLight(this._chart.series.indexOf(this));
        if (stroke === null)
            stroke = this._chart._getColor(this._chart.series.indexOf(this));

        engine.fill = fill;
        engine.stroke = stroke;

        var yc = rect.top + 0.5 * rect.height;

        var wsym = SeriesBase._LEGEND_ITEM_WIDTH;
        var hsym = SeriesBase._LEGEND_ITEM_HEIGHT;
        switch (chartType) {
            case ChartType.Area:
            case ChartType.SplineArea:
            case ChartType.StepArea:
                {
                    engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, style);
                }
                break;
            case ChartType.Bar:
            case ChartType.Column:
                {
                    engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);
                }
                break;
            case ChartType.Scatter:
            case ChartType.Bubble:
                {
                    var rx = 0.3 * wsym;
                    var ry = 0.3 * hsym;
                    if (this.symbolMarker == Marker.Box) {
                        engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle ? symbolStyle : style);
                    } else {
                        engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle ? symbolStyle : style);
                    }
                }
                break;
            case ChartType.Line:
            case ChartType.Spline:
            case ChartType.Step:
                {
                    engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                }
                break;
            case ChartType.LineSymbols:
            case ChartType.SplineSymbols:
            case ChartType.StepSymbols:
                {
                    var rx = 0.3 * wsym;
                    var ry = 0.3 * hsym;
                    if (this.symbolMarker == Marker.Box) {
                        engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle ? symbolStyle : style);
                    } else {
                        engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle ? symbolStyle : style);
                    }

                    engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                }
                break;
            case ChartType.Candlestick:
            case ChartType.HighLowOpenClose:
                {
                    engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, symbolStyle ? symbolStyle : style);
                }
                break;
        }
        if (this._name) {
            FlexChartCore._renderText(engine, text, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChartCore._CSS_LABEL, FlexChartCore._CSS_LEGEND);
        }
    }

    private _cvCollectionChanged(sender, e) {
        this._clearValues();
        this._invalidate();
    }

    // updates selection to sync with data source
    private _cvCurrentChanged(sender, e) {
        if (this._chart && this._chart._notifyCurrentChanged) {
            this._invalidate();
        }
    }

    _bindValues(items: Array<any>, binding: string, isX: boolean= false): DataArray {
        var values: Array<number>;
        var dataType: wijmo.DataType;
        var arrVal;
        if (items != null) {
            var len = items.length;
            values = new Array<number>(items.length);
            let bnd = binding ? new wijmo.Binding(binding) : null;

            for (var i = 0; i < len; i++) {
                arrVal = null;
                var val = items[i];
                if (bnd != null) {
                    val = bnd.getValue(val);
                }

                if (wijmo.isArray(val) && val.length > 0) {
                    arrVal = val;
                    val = val[0]
                }
                if (wijmo.isNumber(val)) {
                    values[i] = val;
                    dataType = wijmo.DataType.Number;
                }
                else if (wijmo.isDate(val)) {
                    values[i] = val.valueOf();
                    dataType = wijmo.DataType.Date;
                } else if (isX && val) {
                    // most likely it's category axis
                    // return appropriate values
                    values[i] = i;
                    dataType = wijmo.DataType.Number;
                }
                if (wijmo.isArray(arrVal) && arrVal.length > 0) {
                    values[i] = arrVal as any;
                }
            }
        }
        var darr = new DataArray();
        darr.values = values;
        darr.dataType = dataType;
        return darr;
    }

    _invalidate() {
        if (this._chart) {
            this._chart.invalidate();
        }
    }

    _indexToPoint(pointIndex: number): wijmo.Point {
        if (pointIndex >= 0 && pointIndex < this._values.length) {
            var y = this._values[pointIndex];
            var x = this._xvalues ? this._xvalues[pointIndex] : pointIndex;

            return new wijmo.Point(x, y);
        }

        return null;
    }

    _getSymbolFill(seriesIndex?: number): string {
        var fill: string = null;
        if (this.symbolStyle) {
            fill = this.symbolStyle.fill;
        }
        if (!fill && this.style) {
            fill = this.style.fill;
        }
        if (!fill && this.chart) {
            fill = this.chart._getColorLight(seriesIndex);
        }
        return fill;
    }

    _getSymbolStroke(seriesIndex?: number): string {
        var stroke: string = null;
        if (this.symbolStyle) {
            stroke = this.symbolStyle.stroke;
        }
        if (!stroke && this.style) {
            stroke = this.style.stroke;
        }
        if (!stroke && this.chart) {
            stroke = this.chart._getColor(seriesIndex);
        }
        return stroke;
    }

    // convenience method to return symbol stroke value from
    // the altStyle property
    _getAltSymbolStroke(seriesIndex?: number): string {
        var stroke: string = null;
        if (this.altStyle) {
            stroke = this.altStyle.stroke;
        }
        return stroke;
    }

    // convenience method to return symbol fill value from
    // the altStyle property
    _getAltSymbolFill(seriesIndex?: number): string {
        var fill: string = null;
        if (this.altStyle) {
            fill = this.altStyle.fill;
        }
        return fill;
    }

    _renderLabels(engine: IRenderEngine, smap: _IHitArea[], chart: FlexChartCore, lblAreas: _RectArea[]) {
        if (!this._plotter) {
            return;
        }
        this._plotter._renderLabels(engine, this, smap, chart, lblAreas);
    }

}
    }
    


    module wijmo.chart {
    




'use strict';

/**
 * Represents a series of data points to display in the chart.
 *
 * The {@link Series} class supports all basic chart types. You may define
 * a different chart type on each {@link Series} object that you add to the 
 * {@link FlexChart} series collection. This overrides the {@link chartType} 
 * property set on the chart that is the default for all {@link Series} objects
 * in its collection.
 */
export class Series extends SeriesBase {

    /**
     * Gets or sets the chart type for a specific series, overriding the chart type 
     * set on the overall chart.
     *
     * The default value for this property is <b>null</b>, which causes the 
     * series to use chart type defined by the parent chart.
     */
    get chartType(): ChartType {
        return this._chartType;
    }
    set chartType(value: ChartType) {
        value = wijmo.asEnum(value, ChartType, true);
        if (value != this._chartType) {
            this._chartType = value;
            this._invalidate();
        }
    }
}
    }
    


    module wijmo.chart {
    










'use strict';

/**
 * The {@link FlexPie} control provides pie and doughnut charts with selectable 
 * slices.
 *
 * To use the {@link FlexPie} control, set the {@link FlexPie.itemsSource} property
 * to an array containing the data and use the {@link FlexPie.binding} and
 * {@link FlexPie.bindingName} properties to set the properties that contain
 * the item values and names.
 */
export class FlexPie extends FlexChartBase {
    private static _MARGIN = 4;
    private static _CSS_GROUP_TITLE = 'wj-label';

    private _binding: string;
    private _bindingName: string;
    _areas = [];
    private _keywords: _KeyWords = new _KeyWords();

    private _startAngle = 0;
    private _innerRadius = 0;
    private _offset = 0;
    private _reversed = false;
    private _isAnimated = false;

    private _selectedItemPosition = Position.None;
    private _selectedItemOffset = 0;

    private _pieGroups: SVGGElement[] = [];
    _rotationAngles: number[] = [];
    private _centers: wijmo.Point[] = [new wijmo.Point()];
    _radius: number;
    private _selectedOffset = new wijmo.Point();
    private _selectedIndex = -1;
    private _angles = [];

    private _selectionAnimationID;
    private _colRowLens = [];

    private _lbl: PieDataLabel;
    private _titles: string[] = undefined;
    private _innerText: any;
    private _innerTextStyle: any;
    private _chartsPerLine;

    _values: number[][] = [];
    _labels: string[] = [];
    _pels = [];
    _sum: number = 0;
    _sums: number[] = [];
    _bindingSeparator = ',';

    /**
     * Initializes a new instance of the {@link FlexPie} class.
     *
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param options A Javascript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true); // invalidate on resize

        // add classes to host element
        this.applyTemplate('wj-control wj-flexchart wj-flexpie', null, null);

        this._currentRenderEngine = new _SvgRenderEngine(this.hostElement);
        this._legend = new Legend(this);
        this._tooltip = new ChartTooltip();
        this._tooltip.content = '<b>{name}</b><br/>{value}';
        this._tooltip.showDelay = 0;

        this._lbl = new PieDataLabel();
        this._lbl._chart = this;

        var self = this;

        // tooltips
        this.hostElement.addEventListener('mousemove', function (evt) {
            var tip = self._tooltip;
            var tc = tip.content;
            if (tc && !self.isTouching) {
                var ht = self.hitTest(evt);
                if (ht.distance <= tip.threshold) {
                    var content = self._getLabelContent(ht, self.tooltip.content);
                    self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                } else {
                    self._hideToolTip();
                }
            }
        });

        // selection
        this.hostElement.addEventListener('click', function (evt) {
            var showToolTip = true;

            if (self.selectionMode == SelectionMode.Point) {
                var ht = self.hitTest(evt);

                var thershold = FlexChartBase._SELECTION_THRESHOLD;
                if (self.tooltip && self.tooltip.threshold)
                    thershold = self.tooltip.threshold;
                if (ht.distance <= thershold) {
                    if (ht.pointIndex != self._selectionIndex && self.selectedItemPosition != Position.None) {
                        showToolTip = false;
                    }
                    if (ht.pointIndex != self._selectionIndex) {
                        self._select(ht.pointIndex, true);
                    }
                } else {
                    if (self._selectedIndex >= 0) {
                        self._select(null);
                    }
                }
            }

            if (showToolTip && self.isTouching) {
                var tip = self._tooltip;
                var tc = tip.content;
                if (tc) {
                    var ht = self.hitTest(evt);
                    if (ht.distance <= tip.threshold) {
                        var content = self._getLabelContent(ht, self.tooltip.content);
                        self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    } else {
                        self._hideToolTip();
                    }
                }
            }
        });

        this.hostElement.addEventListener('mouseleave', function (evt) {
            self._hideToolTip();
        });

        
        // apply options only after chart is fully initialized
        //this.initialize(options);

        // refresh control to show current state
        //this.refresh();
        this.deferUpdate( () => this.initialize(options));
     }

    /**
     * Gets or sets the name of the property that contains the chart values.
     */
    get binding(): string {
        return this._binding;
    }
    set binding(value: string) {
        if (value != this._binding) {
            this._binding = wijmo.asString(value, true);
            this._bindChart();
        }
    }

    /**
     * Gets or sets the name of the property that contains the name of the data items.
     */
    get bindingName(): string {
        return this._bindingName;
    }
    set bindingName(value: string) {
        if (value != this._bindingName) {
            this._bindingName = wijmo.asString(value, true);
            this._bindChart();
        }
    }

    /**
     * Gets or sets the starting angle for the pie slices, in degrees.
     *
     * Angles are measured clockwise, starting at the 9 o'clock position.
     *
     * The default value for this property is <b>0</b>.
     */
    get startAngle(): number {
        return this._startAngle;
    }
    set startAngle(value: number) {
        if (value != this._startAngle) {
            this._startAngle = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the offset of the slices from the pie center.
     *
     * The offset is measured as a fraction of the pie radius.
     * 
     * The default value for this property is <b>0</b>.
     */
    get offset(): number {
        return this._offset;
    }
    set offset(value: number) {
        if (value != this._offset) {
            this._offset = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the size of the pie's inner radius.
     *
     * The inner radius is measured as a fraction of the pie radius.
     *
     * The default value for this property is zero, which creates
     * a pie. Setting this property to values greater than zero 
     * creates pies with a hole in the middle, also known as 
     * doughnut charts. The valid range for inner radius is from 0 to 1.
     *
     * The default value for this property is <b>0</b>.
     */
    get innerRadius(): number {
        return this._innerRadius;
    }
    set innerRadius(value: number) {
        if (value != this._innerRadius) {
            this._innerRadius = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the style of text inside the pie.
     */
    get innerTextStyle(): any {
        return this._innerTextStyle;
    }
    set innerTextStyle(value: any) {
        if (value != this._innerText) {
            this._innerTextStyle = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the text inside the pie (at the pie center).
     */
    get innerText(): any {
        return this._innerText;
    }
    set innerText(value: any) {
        if (value != this._innerText) {
            this._innerText = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value that determines whether angles are reversed 
     * (counter-clockwise).
     *
     * The default value is false, which causes angles to be measured in
     * the clockwise direction.
     *
     * The default value for this property is <b>false</b>.
     */
    get reversed(): boolean {
        return this._reversed;
    }
    set reversed(value: boolean) {
        if (value != this._reversed) {
            this._reversed = wijmo.asBoolean(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the position of the selected slice.
     *
     * Setting this property to a value other than 'None' causes
     * the pie to rotate when an item is selected.
     *
     * Note that in order to select slices by clicking the chart, 
     * you must set the {@link selectionMode} property to 'Point'.
     *
     * The default value for this property is <b>Position.None</b>.
     */
    get selectedItemPosition(): Position {
        return this._selectedItemPosition;
    }
    set selectedItemPosition(value: Position) {
        value = wijmo.asEnum(value, Position, true);
        if (value != this._selectedItemPosition) {
            this._selectedItemPosition = value;
            this.invalidate();
        }
    }
    /**
     * Gets or sets the offset of the selected slice from the pie center.
     *
     * Offsets are measured as a fraction of the pie radius.
     *
     * The default value for this property is <b>0</b>.
     */
    get selectedItemOffset(): number {
        return this._selectedItemOffset;
    }
    set selectedItemOffset(value: number) {
        if (value != this._selectedItemOffset) {
            this._selectedItemOffset = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value indicating whether to use animation when items are selected.
     *
     * See also the {@link selectedItemPosition} and {@link selectionMode}
     * properties.
     *
     * The default value for this property is <b>false</b>.
     */
    get isAnimated(): boolean {
        return this._isAnimated;
    }
    set isAnimated(value: boolean) {
        if (value != this._isAnimated) {
            this._isAnimated = value;
        }
    }
    /**
     * Gets the chart's {@link Tooltip}.
     */
    get tooltip(): ChartTooltip {
        return this._tooltip;
    }

    /**
     * Gets or sets the point data label. 
     */
    get dataLabel(): PieDataLabel {
        return this._lbl;
    }
    set dataLabel(value: PieDataLabel) {
        if (value != this._lbl) {
            this._lbl = value;
            if (this._lbl) {
                this._lbl._chart = this;
            }
        }
    }

    /**
     * Gets or sets the index of the selected slice.
     */
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        if (value != this._selectedIndex) {
            var index = wijmo.asNumber(value, true);
            this._select(index, true);
        }
    }

    /**
     * Gets or sets the pie titles. 
     * 
     * The titles are shown above each pie chart when multiple properties are specified in {@link binding}.
     * If the property is not set (undefined) the property names are used as pie titles.
     */
    get titles(): string[] {
        return this._titles;
    }
    set titles(value: string[]) {
        if (value !== this._titles) {
            this._titles = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the maximal number of charts per line.
     * 
     * The property is used when there are multiple pies. By default, 
     * it's undefined and the control perform layout automatically.  
     */
    get chartsPerLine(): number {
        return this._chartsPerLine;
    }
    set chartsPerLine(value: number) {
        if (value != this._chartsPerLine) {
            this._chartsPerLine = wijmo.asNumber(value, true, true);
            this.invalidate();
        }
    }

    _getLabelsForLegend() {
        return this._labels;
    }

    /**
     * Gets a {@link HitTestInfo} object with information about the specified point.
     *
     * @param pt The point to investigate, in window coordinates.
     * @param y The Y coordinate of the point (if the first parameter is a number).
     * @return A {@link HitTestInfo} object containing information about the point.
     */
    hitTest(pt: any, y?: number): HitTestInfo {

        // control coords
        var cpt = this._toControl(pt, y);
        var hti: HitTestInfo = new HitTestInfo(this, cpt);
        var si: number = null;
        if (FlexChartBase._contains(this._rectHeader, cpt)) {
            hti._chartElement = ChartElement.Header;
        } else if (FlexChartBase._contains(this._rectFooter, cpt)) {
            hti._chartElement = ChartElement.Footer;
        } else if (FlexChartBase._contains(this._rectLegend, cpt)) {
            hti._chartElement = ChartElement.Legend;
            si = this.legend._hitTest(cpt);
            if (si !== null && si >= 0 && si < this._areas.length) {
                hti._setData(null, si);
            }
        } else if (FlexChartBase._contains(this._rectChart, cpt)) {
            var len = this._areas.length,
                min_dist: number = NaN,
                min_area: _IHitArea;

            for (var i = 0; i < len; i++) {
                var pt1 = cpt.clone();
                let seg = <_ISegment>this._areas[i];
                let ra = this._rotationAngles[seg.gi];
                if (ra != 0) {
                    let center = this._centers[seg.gi];

                    let cx = center.x,
                        cy = center.y;
                    let dx = -cx + pt1.x;
                    let dy = -cy + pt1.y;
                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - ra * Math.PI / 180;

                    pt1.x = cx + r * Math.cos(a);
                    pt1.y = cy + r * Math.sin(a);
                }

                if (i == this._selectedIndex) {
                    pt1.x -= this._selectedOffset.x;
                    pt1.y -= this._selectedOffset.y;
                }

                var area = <_IHitArea>this._areas[i];

                if (area.contains(pt1)) {
                    hti._setDataGroup(seg.gi, area.tag);
                    hti._dist = 0;
                    if (i != this._selectedIndex) {
                        break;
                    }
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
                hti._setDataGroup((<any>min_area).gi, min_area.tag);
                hti._dist = min_dist;
            }

            hti._chartElement = ChartElement.ChartArea;
        }
        else {
            hti._chartElement = ChartElement.None;
        }
        return hti;
    }

    // binds the chart to the current data source.
    _performBind() {
        this._initData();

        if (this._cv) {
            this._selectionIndex = this._cv.currentPosition;
            let items = this._cv.items;
            if (items) {
                let len = items.length;
                let bnds = this._getBindings();
                for (let j = 0; j < bnds.length; j++) {
                    this._values[j] = [];
                    this._sums[j] = 0;
                }

                for (var i = 0; i < len; i++) {
                    let item = items[i];
                    for (let j = 0; j < bnds.length; j++) {
                        this._sums[j] += Math.abs(this._getBindData(item, this._values[j], j == 0 ? this._labels : null, bnds[j], this.bindingName));
                    }
                }
            }
        }
    }

    _getBindings(): string[] {
        let bnds: string[] = [];
        let bnd = this.binding;
        if (bnd) {
            var sep = this._bindingSeparator;
            if (sep) {
                bnds = bnd.split(sep);
            }
        }
        return bnds;
    }

    _initData() {
        this._sum = 0;
        this._sums = [];
        this._values = [];
        this._labels = [];
    }

    _getBindData(item: any, values: number[], labels, binding: string, bindingName: string) {
        var v, val = 0;
        let bnd = binding ? new wijmo.Binding(binding) : null;
        if (bnd) {
            v = bnd.getValue(item);
        }

        var val = 0;

        if (wijmo.isNumber(v)) {
            val = wijmo.asNumber(v);
        } else {
            if (v) {
                val = parseFloat(v.toString());
            }
        }

        if (!isNaN(val) && isFinite(val)) {
            values.push(val);
        } else {
            val = 0;
            values.push(val);
        }

        let bndName = bindingName ? new wijmo.Binding(bindingName) : null;
        if (labels) {
            if (bndName && item) {
                var name = bndName.getValue(item);
                if (name) {
                    name = name.toString();
                }
                labels.push(name);
            } else {
                labels.push(val.toString());
            }
        }
        return val;
    }

    _render(engine: IRenderEngine, applyElement = true, bg: string = null) {
        // cancelAnimationFrame(this._selectionAnimationID);
        if (this._selectionAnimationID) {
            clearInterval(this._selectionAnimationID);
        }

        this.onRendering(new RenderEventArgs(engine));
        super._render(engine, applyElement, bg);
    }

    _prepareRender() {
        this._areas = [];
    }

    _renderChart(engine: IRenderEngine, rect: wijmo.Rect, applyElement: boolean) {
        var r = this._rectChart.clone();
        var hostSz = new wijmo.Size(r.width, r.height);
        var tsz: wijmo.Size;

        var w = rect.width;
        var h = rect.height;

        //this._pieGroup = engine.startGroup('wj-slice-group', null, true); // all series

        var margins = this._parseMargin(this.plotMargin),
            lbl = this.dataLabel;

        var hasOutLabels = lbl.content && lbl.position == PieLabelPosition.Outside;
        var outOffs = hasOutLabels ? (wijmo.isNumber(lbl.offset) ? lbl.offset : 0) + 24 : 0;

        if (isNaN(margins.left)) {
            margins.left = hasOutLabels ? outOffs : FlexPie._MARGIN;
        }
        if (isNaN(margins.right)) {
            margins.right = hasOutLabels ? outOffs : FlexPie._MARGIN;
        }
        if (isNaN(margins.top)) {
            margins.top = hasOutLabels ? outOffs : FlexPie._MARGIN;
        }
        if (isNaN(margins.bottom)) {
            margins.bottom = hasOutLabels ? outOffs : FlexPie._MARGIN;
        }

        rect.top += margins.top;
        var h = rect.height - (margins.top + margins.bottom);
        rect.height = h > 0 ? h : 24;
        rect.left += margins.left;
        var w = rect.width - (margins.left + margins.right);
        rect.width = w > 0 ? w : 24;

        let bnds = this._getBindings();
        let titles = this.titles;
        if (titles === undefined && bnds.length > 1) {
            titles = bnds;
        }
        let rects = this._layout(engine, rect, titles, bnds.length);
        this._angles = [];
        this._pels = [];
        this._pieGroups = [];
        this._rotationAngles = [];

        for (let i = 0; i < bnds.length; i++) {
            let cr = rects[i];
            if (titles && i < titles.length && titles[i]) {
                FlexChartBase._renderText(engine, titles[i], new wijmo.Point(cr.left + 0.5 * cr.width, cr.top), 1, 2, FlexPie._CSS_GROUP_TITLE);
            }
            // engine.fill = 'transparent';
            // engine.drawRect(cr.left, cr.top, cr.width, cr.height);
            let pieGroup = engine.startGroup('wj-slice-group', null, true);
            this._pieGroups.push(pieGroup);
            this._renderData(engine, cr, i, pieGroup);
            engine.endGroup();
            this._rotationAngles.push(0);
        }

        //engine.endGroup();
        //this._rotationAngle = 0;
        this._highlightCurrent();

        if (this.innerText) {
            this._renderInnerText(engine);
        }

        if (this.dataLabel.content && this.dataLabel.position != PieLabelPosition.None) {
            this._renderLabels(engine);
        }

        this.onRendered(new RenderEventArgs(engine));
    }

    _layout(eng: IRenderEngine, r: wijmo.Rect, titles: string[], n: number): wijmo.Rect[] {
        let side = 0;
        let ncols = n;
        let nrows = 1;

        //let th = n > 1 ? 20 : 0;
        let th = 0;
        if (titles) {
            for (let i = 0; i < titles.length; i++) {
                th = Math.max(th, eng.measureString(titles[i], FlexPie._CSS_GROUP_TITLE).height);
            }
        }

        let chartPerLine = Math.floor(this.chartsPerLine);
        if (chartPerLine > 0) {
            ncols = Math.min( n, chartPerLine);
            nrows = Math.ceil( n / ncols);
            let sw = Math.floor(r.width / ncols);
            let sh = Math.floor(r.height / nrows) - th;
            side = Math.min(sw,sh);
        } else {
            for (let nc = 1; nc <= n; nc++) {
                let nr = Math.floor((n + (nc - 1)) / nc);

                // calculate the sides based on the nc, nr specified layout
                let sw = Math.floor(r.width / nc);
                let sh = Math.floor(r.height / nr);

                sh -= th;

                // put the most appropriate side in sw
                if (sh < sw)
                    sw = sh;

                // if a bigger side than current, then switch
                if (sw > side) {
                    side = sw;
                    ncols = nc;
                    nrows = nr;
                }
            }
        }

        let rs: wijmo.Rect[] = [];
        let marg = 8;

        let dx = 0.5 * (r.width - side * ncols);
        let dy = 0.5 * (r.height - (side + th) * nrows);

        for (let irow = 0; irow < nrows; irow++) {
            for (let icol = 0; icol < ncols; icol++) {
                rs.push(new wijmo.Rect(r.left + side * icol + marg + dx, r.top + (side + th) * irow + marg + dy + th, side - 2 * marg, side - 2 * marg));
            }
        }

        return rs;
    }

    _getDesiredLegendSize(engine: IRenderEngine, isVertical: boolean, width: number, height: number): wijmo.Size {
        var sz = new wijmo.Size();
        var pieChart = this;
        var rect = new wijmo.Size(width, height);
        var labels = pieChart._getLabelsForLegend();
        var len = labels.length;
        var cw = 0, rh = 0;

        this._colRowLens = [];
        for (var i = 0; i < len; i++) {
            // measure the legend
            var isz = pieChart._measureLegendItem(engine, labels[i]);
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
            } else {
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
            sz.width = this._colRowLens.reduce((a, b) => a + b, 0);
            sz.width = this._getLegendSize(width, sz.width);
        } else {
            if (sz.width < cw) {
                sz.width = cw;
            }
            this._colRowLens.push(rh);
            sz.height = this._colRowLens.reduce((a, b) => a + b, 0);
            sz.height = this._getLegendSize(height, sz.height);
        }
        return sz;
    }
    _renderLegend(engine: IRenderEngine, pos: wijmo.Point, areas: any[], isVertical: boolean, width: number, height: number) {
        var pieChart = this;
        var rectLegend = pieChart._rectLegend;
        var labels = pieChart._getLabelsForLegend();
        var len = labels.length;
        var colRowLen = 0;
        var p = pos.clone();

        // draw legend items
        for (var i = 0; i < len; i++) {

            var sz = pieChart._measureLegendItem(engine, labels[i]);
            if (isVertical) {
                if (p.y + sz.height > rectLegend.top + rectLegend.height + 1) {
                    p.x += this._colRowLens[colRowLen];
                    colRowLen++;
                    p.y = pos.y;
                }
            } else {
                if (p.x + sz.width > rectLegend.left + rectLegend.width + 1) {
                    p.y += this._colRowLens[colRowLen];
                    colRowLen++;
                    p.x = pos.x;
                }
            }
            var rect = new wijmo.Rect(p.x, p.y, sz.width, sz.height);
            pieChart._drawLegendItem(engine, rect, i, labels[i]);

            areas.push(rect);

            if (isVertical) {
                p.y += sz.height;
            } else {
                p.x += sz.width;
            }
        }
    }

    _renderData(engine: IRenderEngine, rect: wijmo.Rect, i: number, g: any) {
        //this._pels = [];
        //this._angles = [];
        //engine.strokeWidth = 2;

        var sum = this._sums[i];

        var startAngle = this.startAngle + 180, // start from 9 o'clock
            innerRadius = this.innerRadius,
            offset = this.offset;
        if(innerRadius > 1) {
            innerRadius = 1;
        }

        if (sum > 0) {
            var angle = startAngle * Math.PI / 180,
                cx0 = rect.left + 0.5 * rect.width,
                cy0 = rect.top + 0.5 * rect.height,
                r = Math.min(0.5 * rect.width, 0.5 * rect.height);

            //this._center.x = cx0;
            //this._center.y = cy0;
            this._centers[i] = new wijmo.Point(cx0, cy0);

            var maxoff = Math.max(offset, this.selectedItemOffset);
            if (maxoff > 0) {
                r = r / (1 + maxoff);
                offset = offset * r;
            }
            this._radius = r;
            var irad = innerRadius * r;

            this._renderPie(engine, i, r, irad, angle, offset);

            //this._highlightCurrent();
        }
    }

    _renderPie(engine: IRenderEngine, gi: number, radius: number, innerRadius: number, startAngle: number, offset: number) {
        this._renderSlices(engine, this._values[gi], this._sums[gi], gi, radius, innerRadius, startAngle, 2 * Math.PI, offset);
    }

    _getCenter() {
        return this._centers[0];
    }

    _renderSlices(engine, values, sum, gi: number, radius, innerRadius, startAngle, totalSweep, offset) {
        var len = values.length,
            validValuesLen = 0,
            angle = startAngle,
            reversed = this.reversed == true,
            center = this._centers[gi],
            sweep, pel, cx, cy;

        for (let i = 0; i < len; i++) {
            if (values[i] > 0) {
                validValuesLen++;
            }
        }
        //Max sweep is 359.9/360 if len > 1, to prevent data like [1, 99999].
        var totalAngle = validValuesLen === 1 ? 360 : 359.9 / 360;

        for (let i = 0; i < len; i++) {
            cx = center.x;
            cy = center.y;
            pel = engine.startGroup('wj-slice');
            engine.fill = this._getColorLight(i);
            engine.stroke = this._getColor(i);

            var val = Math.abs(values[i]);
            var sweep = Math.abs(val - sum) < 1E-10 ? totalSweep : totalSweep * val / sum;
            sweep = Math.min(sweep, totalSweep * totalAngle);
            var currentAngle = reversed ? angle - 0.5 * sweep : angle + 0.5 * sweep;
            if (offset > 0 && sweep < totalSweep) {
                cx += offset * Math.cos(currentAngle);
                cy += offset * Math.sin(currentAngle);
            }
            this._renderSlice(engine, cx, cy, currentAngle, gi, i, radius, innerRadius, angle, sweep, totalSweep);

            if (reversed) {
                angle -= sweep;
            } else {
                angle += sweep;
            }

            engine.endGroup();
            this._pels.push(pel);
        }
    }

    _renderSlice(engine: IRenderEngine, cx: number, cy: number, currentAngle: number, gi: number, idx: number, radius: number, innerRadius: number, startAngle: number, sweep: number, totalSweep: number) {
        var reversed = !!this.reversed;

        this._angles.push(currentAngle);
        if (this.itemFormatter) {
            var hti: HitTestInfo = new HitTestInfo(this, new wijmo.Point(cx + radius * Math.cos(currentAngle), cy + radius * Math.sin(currentAngle)), ChartElement.SeriesSymbol);
            hti._setData(null, idx);

            this.itemFormatter(engine, hti, () => {
                this._drawSlice(engine, gi, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
            });
            engine.cssPriority = true;
        } else {
            this._drawSlice(engine, gi, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
        }
    }

    _getSelectedItemOffset(index, angle) {
        var dx = 0,
            dy = 0,
            off = 0;
        if (index == this._selectedIndex && this.selectedItemOffset > 0) {
            off = this.selectedItemOffset;
        }
        if (off > 0) {
            dx = Math.cos(angle) * off * this._radius;
            dy = Math.sin(angle) * off * this._radius;
        }
        return {
            x: dx,
            y: dy
        };
    }

    _renderInnerText(engine: IRenderEngine) {
        let text = this.innerText;
        let style = this.innerTextStyle;
        for (let i = 0; i < this._centers.length; i++) {
            let cp = this._centers[i];
            let s: string;
            if (wijmo.isFunction(text)) {
                s = text(i);
            } else if (wijmo.isArray(text)) {
                s = wijmo.asString(text[i]);
            } else {
                s = wijmo.asString(text);
            }

            if (s) {
                s = wijmo.format(s, { total: this._sums[i], binding: this._getBindings()[i] });

                if (style) {
                    engine.cssPriority = false;
                }

                FlexPie._renderText(engine, s, cp, 1, 1, FlexChartBase._CSS_TITLE, null, style);
                engine.cssPriority = true;
            }
        }
    }

    _renderLabels(engine: IRenderEngine) {
        var len = this._areas.length,
            lbl = this.dataLabel,
            pos = lbl.position,
            marg = 2,
            gcss = 'wj-data-labels',
            lcss = 'wj-data-label',
            bcss = 'wj-data-label-border',
            clcss = 'wj-data-label-line',
            da = this._rotationAngles,
            line = lbl.connectingLine,
            lofs = lbl.offset ? lbl.offset : 0;
        engine.stroke = 'null';
        engine.fill = 'transparent';
        engine.strokeWidth = 1;

        engine.startGroup(gcss);
        for (var i = 0; i < len; i++) {
            var seg = this._areas[i];
            if (seg) {
                var r = seg.radius;

                var a = (seg.langle + da[seg.gi]);

                var ha = 1,
                    va = 1;
                if (pos == PieLabelPosition.Center || pos === PieLabelPosition.Radial || pos === PieLabelPosition.Circular) {
                    r *= 0.5 * (1 + ((<_DonutSegment>seg).innerRadius || 0) / seg.radius);
                } else {
                    a = _Math.clampAngle(a);
                    if (a <= -170 || a >= 170) {
                        ha = 2; va = 1;
                    } else if (a >= -100 && a <= -80) {
                        ha = 1; va = 2;
                    } else if (a >= -10 && a <= 10) {
                        ha = 0; va = 1;
                    } else if (a >= 80 && a <= 100) {
                        ha = 1; va = 0;
                    } else if (-180 < a && a < -90) {
                        ha = 2; va = 2;
                    } else if (-90 <= a && a < 0) {
                        ha = 0; va = 2;
                    } else if (0 < a && a < 90) {
                        ha = 0; va = 0;
                    } else if (90 < a && a < 180) {
                        ha = 2; va = 0;
                    }

                    if (pos == PieLabelPosition.Inside) {
                        ha = 2 - ha; va = 2 - va;
                    }
                }

                a *= Math.PI / 180;
                let pi = seg.gi ? i - seg.gi * this._values[0].length : i;
                var off = this._getSelectedItemOffset(pi, a),
                    dx = off.x,
                    dy = off.y;

                var r0 = r;
                if (pos == PieLabelPosition.Outside) {
                    r0 += lofs;
                } else if (pos == PieLabelPosition.Inside) {
                    r0 -= lofs;
                }
                var centerX = seg.center.x;
                var centerY = seg.center.y;
                let center = this._centers[seg.gi];
                var offX = centerX - center.x;
                var offY = centerY - center.y;
                if (this._rotationAngles[seg.gi] != 0) {
                    var offR = Math.sqrt(offX * offX + offY * offY);
                    var offA = Math.atan2(offY, offX) + this._rotationAngles[seg.gi] * Math.PI / 180;

                    centerX = center.x + offR * Math.cos(offA);
                    centerY = center.y + offR * Math.sin(offA);

                }
                var pt = new wijmo.Point(centerX + dx + r0 * Math.cos(a),
                    centerY + dy + r0 * Math.sin(a));

                if (lbl.border && pos != PieLabelPosition.Center) {
                    if (ha == 0)
                        pt.x += marg;
                    else if (ha == 2)
                        pt.x -= marg;
                    if (va == 0)
                        pt.y += marg;
                    else if (va == 2)
                        pt.y -= marg;
                }

                var hti: HitTestInfo = new HitTestInfo(this, pt);
                hti._setDataGroup(seg.gi, seg.tag);
                var content = this._getLabelContent(hti, lbl.content);

                var ea = new DataLabelRenderEventArgs(engine, hti, pt, content);

                if (lbl.onRendering) {
                    if (lbl.onRendering(ea)) {
                        content = ea.text;
                        pt = ea.point;
                    } else {
                        content = null;
                    }
                }
                if (content) {
                    var text, lr;
                    var angle = Math.atan2(centerY - pt.y, centerX - pt.x) * 180 / Math.PI;

                    angle = (angle + 360) % 360;
                    if (pos === PieLabelPosition.Radial || pos === PieLabelPosition.Circular) {
                        if (pos === PieLabelPosition.Radial) {
                            if (angle > 90 && angle < 270) {
                                angle += 180;
                            }
                        } else {
                            if (angle > 180 && angle < 360) {
                                angle += 180;
                            }
                            angle -= 90;
                        }
                        text = FlexChartBase._renderRotatedText(engine, content, pt, ha, va, pt, angle, lcss);
                        lr = text.getBBox();
                        lr.left = lr.x;
                        lr.top = lr.y;
                    } else {
                        lr = FlexChartBase._renderText(engine, content, pt, ha, va, lcss);
                    }

                    if (lbl.border) {
                        engine.drawRect(lr.left - marg, lr.top - marg, lr.width + 2 * marg, lr.height + 2 * marg, bcss);
                    }

                    if (line) {
                        var pt2 = new wijmo.Point(centerX + dx + (r) * Math.cos(a),
                            centerY + dy + (r) * Math.sin(a));
                        engine.drawLine(pt.x, pt.y, pt2.x, pt2.y, clcss);
                    }
                }
                engine.cssPriority = true;
            }
        }
        engine.endGroup();
    }

    _drawSlice(engine: IRenderEngine, gi: number, i: number, reversed: boolean, cx: number, cy: number, r: number, irad: number, angle: number, sweep: number) {
        var area;
        if (reversed) {
            if (irad > 0) {
                if (sweep != 0) {
                    engine.drawDonutSegment(cx, cy, r, irad, angle - sweep, sweep);
                }

                area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle - sweep, sweep, this.startAngle);
                area.tag = i;
                this._areas.push(area);
            } else {
                if (sweep != 0) {
                    engine.drawPieSegment(cx, cy, r, angle - sweep, sweep);
                }

                area = new _PieSegment(new wijmo.Point(cx, cy), r, angle - sweep, sweep, this.startAngle);
                area.tag = i;
                this._areas.push(area);
            }
        }
        else {
            if (irad > 0) {
                if (sweep != 0) {
                    engine.drawDonutSegment(cx, cy, r, irad, angle, sweep);
                }

                area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle, sweep, this.startAngle);
                area.tag = i;
                this._areas.push(area);
            } else {
                if (sweep != 0) {
                    engine.drawPieSegment(cx, cy, r, angle, sweep);
                }

                area = new _PieSegment(new wijmo.Point(cx, cy), r, angle, sweep, this.startAngle);
                area.tag = i;
                this._areas.push(area);
            }
            angle += sweep;
        }

        if (area) {
            area.gi = gi;
        }
    }

    _measureLegendItem(engine: IRenderEngine, name: string): wijmo.Size {
        var sz = new wijmo.Size();
        sz.width = Series._LEGEND_ITEM_WIDTH;
        sz.height = Series._LEGEND_ITEM_HEIGHT;
        if (name) {
            var tsz = engine.measureString(name, FlexChartBase._CSS_LABEL, FlexChartBase._CSS_LEGEND);
            sz.width += tsz.width;
            if (sz.height < tsz.height) {
                sz.height = tsz.height;
            }
        };
        sz.width += 3 * Series._LEGEND_ITEM_MARGIN;
        sz.height += 2 * Series._LEGEND_ITEM_MARGIN;
        return sz;
    }

    _drawLegendItem(engine: IRenderEngine, rect: wijmo.Rect, i: number, name: string) {
        engine.strokeWidth = 1;

        var marg = Series._LEGEND_ITEM_MARGIN;

        var fill = null;
        var stroke = null;

        if (fill === null)
            fill = this._getColorLight(i);
        if (stroke === null)
            stroke = this._getColor(i);

        engine.fill = fill;
        engine.stroke = stroke;

        var yc = rect.top + 0.5 * rect.height;

        var wsym = Series._LEGEND_ITEM_WIDTH;
        var hsym = Series._LEGEND_ITEM_HEIGHT;
        engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null);//, this.style);

        if (name != null) {
            FlexChartBase._renderText(engine, name.toString(), new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChartBase._CSS_LABEL);
        }
    }

    //---------------------------------------------------------------------
    // tooltips

    private _getLabelContent(ht: HitTestInfo, content: any): string {
        if (wijmo.isString(content)) {
            return this._keywords.replace(content, ht);
        } else if (wijmo.isFunction(content)) {
            return content(ht);
        }

        return null;
    }

    //---------------------------------------------------------------------
    // selection

    private _select(pointIndex: number, animate: boolean = false) {
        this._highlight(false, this._selectionIndex);
        this._selectionIndex = pointIndex;

        if (this.selectionMode == SelectionMode.Point) {
            var cv = this._cv;
            if (cv) {
                this._notifyCurrentChanged = false;
                cv.moveCurrentToPosition(pointIndex);
                this._notifyCurrentChanged = true;
            }
        }

        if (pointIndex == null) {
            this._selectedIndex = -1;
            this.invalidate();
        } else if (!(this.isAnimated && this.selectedItemPosition != Position.None) && (this.selectedItemOffset > 0 || this.selectedItemPosition != Position.None)) {
            this._selectedIndex = pointIndex;
            this.invalidate();
        } else {
            this._highlight(true, this._selectionIndex, animate);
        }

        this.onSelectionChanged();
    }

    _highlightCurrent() {
        if (this.selectionMode != SelectionMode.None) {
            var pointIndex = -1;
            var cv = this._cv;

            if (cv) {
                pointIndex = cv.currentPosition;
            }

            this._highlight(true, pointIndex);
        }
    }

    _highlight(selected: boolean, pointIndex: number, animate: boolean = false) {
        if (this.selectionMode == SelectionMode.Point && pointIndex !== undefined && pointIndex !== null && pointIndex >= 0) {
            if (selected) {
                let targetAngles: number[] = [];
                for (let gi = 0; gi < this._pieGroups.length; gi++) {
                    var gs = this._pels[pointIndex + gi * this._values[0].length];

                    if (gs) {
                        gs.parentNode.appendChild(gs);

                        var ells = this._find(gs, ['ellipse']);
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), FlexChartBase._CSS_SELECTION, selected);
                    }

                    var selectedAngle = this._angles[pointIndex + gi * this._values[0].length];
                    if (this.selectedItemPosition != Position.None && selectedAngle != 0) {
                        var angle = 0;
                        if (this.selectedItemPosition == Position.Left) {
                            angle = 180;
                        } else if (this.selectedItemPosition == Position.Top) {
                            angle = -90;
                        } else if (this.selectedItemPosition == Position.Bottom) {
                            angle = 90;
                        }

                        var targetAngle = angle * Math.PI / 180 - selectedAngle;// - this._rotationAngle;
                        targetAngle *= 180 / Math.PI;

                        if (animate && this.isAnimated) {
                            //this._animateSelectionAngle(targetAngle, 0.5);
                            targetAngles.push(targetAngle);
                        } else {
                            this._rotationAngles[gi] = targetAngle;
                            this._pieGroups[gi].transform.baseVal.getItem(0).setRotate(targetAngle, this._centers[gi].x, this._centers[gi].y);
                        }
                    }

                    var off = this.selectedItemOffset;
                    if (off > 0 && ells && ells.length == 0) {
                        var x = this._selectedOffset.x = Math.cos(selectedAngle) * off * this._radius;
                        var y = this._selectedOffset.y = Math.sin(selectedAngle) * off * this._radius;

                        if (gs) {
                            gs.setAttribute('transform', 'translate(' + x.toFixed() + ',' + y.toFixed() + ')');
                        }
                    }
                    this._selectedIndex = pointIndex;
                }

                if (targetAngles.length > 0) {
                    this._animateSelectionAngle(targetAngles, 0.5);
                }
            } else {
                for (let gi = 0; gi < this._pieGroups.length; gi++) {
                    var gs = this._pels[pointIndex + gi * this._values[0].length];
                    if (gs) {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(pointIndex));
                        gs.removeAttribute('transform');
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), FlexChartBase._CSS_SELECTION, selected);
                    }
                }
                if (this._selectedIndex == pointIndex) {
                    this._selectedIndex = -1;
                }
            }
        }
    }

    _animateSelectionAngle(targetAngles: number[], duration: number) {
        //var source = _Math.clampAngle(this._rotationAngle);
        //target = _Math.clampAngle(target);

        /*var delta = (target - source) / (60 * duration);
        this._selectionAnimationID = requestAnimationFrame(doAnim);
        var self = this;

        function doAnim() {

            source += delta;

            if ( Math.abs(target-source) < Math.abs(delta)) {
               self._rotationAngle = source = target;
            }

            self._pieGroup.transform.baseVal.getItem(0).setRotate(source, self._center.x, self._center.y);

            if (target == source) {
                cancelAnimationFrame(self._selectionAnimationID);
            } else {
                self._selectionAnimationID = requestAnimationFrame(doAnim);
            }
        }*/

        //var delta = (target - source);
        var self = this;
        //var start = source;
        var groups = self._pieGroups;

        if (self._selectionAnimationID) {
            clearInterval(this._selectionAnimationID);
        }

        this._selectionAnimationID = wijmo.animate(function (pct) {
            if (groups == self._pieGroups) {
                //self._rotationAngle = source = start + delta * pct;

                for (let gi = 0; gi < groups.length; gi++) {
                    let source = _Math.clampAngle(self._rotationAngles[gi]);
                    let target = _Math.clampAngle(targetAngles[gi]);
                    let delta = (target - source);
                    let start = source;
                    self._rotationAngles[gi] = source = start + delta * pct;
                    groups[gi].transform.baseVal.getItem(0).setRotate(source, self._centers[gi].x, self._centers[gi].y);
                }
                if (pct == 1) {
                    clearInterval(self._selectionAnimationID);
                }
                if (pct > 0.99) {
                    if (self.selectedItemOffset > 0 || self.selectedItemPosition != Position.None) {
                        self.invalidate();
                    }
                }
            }
        }, duration * 1000);
    }

    _getHitTestItem(index: number) {
        var items = null, item = null;

        if (this._cv != null) {
            items = this._cv.items;
        } else {
            items = this.itemsSource;
        }
        if (items && index < items.length) {
            item = items[index];
        }
        return item;
    }

    _getHitTestValue(index: number, gi: number) {
        if (gi == undefined) {
            gi = 0;
        }
        return this._values[gi][index];
    }

    _getHitTestLabel(index: number) {
        return this._labels[index];
    }
}

class _Math {
    static clampAngle(angle: number, startAngle: number = 0) {
        var a = (angle + 180) % 360 - 180;
        if (a < -180 + (startAngle < 0 ? startAngle + 360 : startAngle)) {
            a += 360;
        }
        return a;
    }
}

export interface _ISegment {
    center: wijmo.Point;
    radius: number;
    langle: number;
    angle: number;
    sweep: number;
    gi: number; // group index
}

export class _PieSegment implements _IHitArea, _ISegment {
    private _center: wijmo.Point;
    private _angle: number;
    private _sweep: number;
    private _radius: number;
    private _radius2: number;
    private _isFull: boolean = false;
    private _originAngle: number;
    private _originSweep: number;
    private _startAngle: number;

    constructor(center: wijmo.Point, radius: number, angle: number, sweep: number, startAngle: number = 0) {
        this._center = center;
        this._radius = radius;
        this._originAngle = angle;
        this._originSweep = sweep;
        if (sweep >= 2 * Math.PI) {
            this._isFull = true;
        }
        this._sweep = 0.5 * sweep * 180 / Math.PI;
        this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
        this._radius2 = radius * radius;
        this._startAngle = startAngle;
    }

    contains(pt: wijmo.Point): boolean {
        var dx = pt.x - this._center.x;
        var dy = pt.y - this._center.y;
        var r2 = dx * dx + dy * dy;

        if (r2 <= this._radius2) {
            var a = Math.atan2(dy, dx) * 180 / Math.PI;
            var delta = _Math.clampAngle(this._angle, this._startAngle) - _Math.clampAngle(a, this._startAngle);
            if (this._isFull || Math.abs(delta) <= this._sweep) {
                return true;
            }
        }
        return false;
    }

    distance(pt: wijmo.Point): number {
        if (this.contains(pt)) {
            return 0;
        }

        var dx = pt.x - this._center.x;
        var dy = pt.y - this._center.y;
        var r2 = dx * dx + dy * dy;

        var a = Math.atan2(dy, dx) * 180 / Math.PI;
        var delta = _Math.clampAngle(this._angle, this._startAngle) - _Math.clampAngle(a, this._startAngle);
        if (this._isFull || Math.abs(delta) <= this._sweep) {
            return Math.sqrt(r2) - this._radius;
        }

        return undefined;
    }

    get center(): wijmo.Point {
        return this._center;
    }

    get radius(): number {
        return this._radius;
    }

    get langle(): number {
        return this._angle;
    }

    get angle(): number {
        return this._originAngle;
    }

    get sweep(): number {
        return this._originSweep;
    }

    tag: any;

    ignoreLabel: boolean;
    gi: number;
}

export class _DonutSegment implements _IHitArea, _ISegment {
    private _center: wijmo.Point;
    private _angle: number;
    private _sweep: number;
    private _originAngle: number;
    private _originSweep: number;
    private _radius: number;
    private _radius2: number;
    private _iradius: number;
    private _iradius2: number;
    private _isFull: boolean = false;
    private _startAngle: number;

    constructor(center: wijmo.Point, radius: number, innerRadius: number, angle: number, sweep: number, startAngle: number = 0) {
        this._center = center;
        this._radius = radius;
        this._iradius = innerRadius;
        this._originAngle = angle;
        this._originSweep = sweep;
        if (sweep >= 2 * Math.PI) {
            this._isFull = true;
        }
        this._sweep = 0.5 * sweep * 180 / Math.PI;
        this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
        this._radius2 = radius * radius;
        this._iradius2 = innerRadius * innerRadius;
        this._startAngle = startAngle;
    }

    contains(pt: wijmo.Point): boolean {
        var dx = pt.x - this._center.x;
        var dy = pt.y - this._center.y;
        var r2 = dx * dx + dy * dy;

        if (r2 >= this._iradius2 && r2 <= this._radius2) {
            var a = Math.atan2(dy, dx) * 180 / Math.PI;
            var delta = _Math.clampAngle(this._angle, this._startAngle) - _Math.clampAngle(a, this._startAngle);
            if (this._isFull || Math.abs(delta) <= this._sweep) {
                return true;
            }
        }
        return false;
    }

    distance(pt: wijmo.Point): number {
        if (this.contains(pt)) {
            return 0;
        }

        return undefined;
    }

    get center(): wijmo.Point {
        return this._center;
    }

    get radius(): number {
        return this._radius;
    }

    get langle(): number {
        return this._angle;
    }

    get angle(): number {
        return this._originAngle;
    }

    get sweep(): number {
        return this._originSweep;
    }

    get innerRadius(): number {
        return this._iradius;
    }

    tag: any;

    ignoreLabel: boolean;

    gi: number;
}


    }
    


    module wijmo.chart {
    










'use strict';

/**
 * Plots data series.
 */
export interface _IPlotter {
    chart: FlexChartCore;
    dataInfo: _DataInfo;
    hitTester: _HitTester;
    seriesIndex: number;
    seriesCount: number;
    clipping: boolean;

    stacking: Stacking;
    rotated: boolean;
    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect;
    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function);
    _renderLabels(engine: IRenderEngine, series: SeriesBase, smap: _IHitArea[], chart: FlexChartCore, lblAreas: _RectArea[]);
    _renderLabel(engine: IRenderEngine, map: _IHitArea, dp: _DataPoint, chart: FlexChartCore, lbl: DataLabel, series: SeriesBase, offset: number, lblAreas: _RectArea[]);

    load();
    unload();
}

/**
 * Base class for chart plotters of all types (bar, line, area).
 */
export class _BasePlotter {
    _DEFAULT_WIDTH = 2;
    _DEFAULT_SYM_SIZE = 10;

    clipping = true;
    chart: FlexChartCore;
    hitTester: _HitTester;
    dataInfo: _DataInfo;
    seriesIndex: number;
    seriesCount: number;

    clear() {
        this.seriesCount = 0;
        this.seriesIndex = 0;
    }

    _renderLabels(engine: IRenderEngine, series: SeriesBase, smap: _IHitArea[], chart: FlexChartCore, lblAreas: _RectArea[]) {
        var len = smap.length,
            lbl = chart.dataLabel,
            bdr = lbl.border,
            offset = lbl.offset,
            line = lbl.connectingLine,
            marg = 2;
        if (offset === undefined) {
            offset = line ? 16 : 0;
        }
        if (bdr) {
            offset -= marg;
        }

        for (var j = 0; j < len; j++) {
            var map = smap[j];
            var dp = <_DataPoint>wijmo.asType(map.tag, _DataPoint, true);
            if (dp && !map.ignoreLabel) {
                this._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
            }
        }
    }

    _renderLabel(engine: IRenderEngine, map: _IHitArea, dp: _DataPoint, chart: FlexChartCore, lbl: DataLabel, series: SeriesBase, offset: number, lblAreas: _RectArea[]) {
        var pos = lbl.position == null ? LabelPosition.Top : lbl.position,
            bdr = lbl.border,
            line = lbl.connectingLine,
            marg = 2;
        var ht: HitTestInfo = new HitTestInfo(chart, pt);
        ht._setDataPoint(dp);

        var s = chart._getLabelContent(ht, lbl.content);

        var pt = this._getLabelPoint(series, dp);
        this._getPointAndPosition(pt, pos, map, chart);

        if (!chart._plotRect.contains(pt)) {
            return;
        }

        var ea = new DataLabelRenderEventArgs(engine, ht, pt, s);

        if (lbl.onRendering) {
            if (lbl.onRendering(ea)) {
                s = ea.text;
                pt = ea.point;
            } else {
                s = null;
            }
        }
        if (s) {
            var lrct: wijmo.Rect = this._renderLabelAndBorder(engine, s, pos, offset, pt, line, marg, bdr);

            if (lrct) {
                var area = new _RectArea(lrct);
                area.tag = dp;
                lblAreas.push(area);
            }
        }
        engine.cssPriority = true;
    }

    _getPointAndPosition(pt: wijmo.Point, pos: LabelPosition, map: _IHitArea, chart: FlexChartCore) {
        if (map instanceof _RectArea) {
            var ra = <_RectArea>map;
            if (chart._isRotated()) {
                pt.y = ra.rect.top + 0.5 * ra.rect.height;
            } else {
                pt.x = ra.rect.left + 0.5 * ra.rect.width;
            }
        }
    }

    _getLabelPoint(series: SeriesBase, dataPoint: _DataPoint): wijmo.Point {
        var ax = series._getAxisX(),
            ay = series._getAxisY();

        return new wijmo.Point(ax.convert(dataPoint.dataX), ay.convert(dataPoint.dataY));
    }

    _renderLabelAndBorder(engine: IRenderEngine, s: string, pos: LabelPosition, offset: number, pt: wijmo.Point, line: boolean, marg, border: boolean): wijmo.Rect {
        var lrct,
            lcss = 'wj-data-label',
            clcss = 'wj-data-label-line',
            bcss = 'wj-data-label-border',
            gcss = FlexChartCore._CSS_DATA_LABELS;

        switch (pos) {
            case LabelPosition.Top: {
                if (line) {
                    engine.drawLine(pt.x, pt.y, pt.x, pt.y - offset, clcss);
                }
                pt.y -= marg + offset;
                lrct = FlexChartCore._renderText(engine, s, pt, 1, 2, lcss, gcss);
                break;
            }
            case LabelPosition.Bottom: {
                if (line) {
                    engine.drawLine(pt.x, pt.y, pt.x, pt.y + offset, clcss);
                }
                pt.y += marg + offset;
                lrct = FlexChartCore._renderText(engine, s, pt, 1, 0, lcss, gcss);
                break;
            }
            case LabelPosition.Left: {
                if (line) {
                    engine.drawLine(pt.x, pt.y, pt.x - offset, pt.y, clcss);
                }
                pt.x -= marg + offset;
                lrct = FlexChartCore._renderText(engine, s, pt, 2, 1, lcss, gcss);
                break;
            }
            case LabelPosition.Right: {
                if (line) {
                    engine.drawLine(pt.x, pt.y, pt.x + offset, pt.y, clcss);
                }
                pt.x += marg + offset;
                lrct = FlexChartCore._renderText(engine, s, pt, 0, 1, lcss, gcss);
                break;
            }
            case LabelPosition.Center:
                lrct = FlexChartCore._renderText(engine, s, pt, 1, 1, lcss, gcss);
                break;
        }
        if (border && lrct) {
            engine.drawRect(lrct.left - marg, lrct.top - marg, lrct.width + 2 * marg, lrct.height + 2 * marg, bcss);
        }

        return lrct;
    }

    getOption(name: string, parent?: string): any {
        var options = this.chart._options;
        if (parent) {
            options = options ? options[parent] : null;
        }
        if (options && !wijmo.isUndefined(options[name]) && options[name] !== null) {
            return options[name];
        }
        return undefined;
    }

    getNumOption(name: string, parent?: string): number {
        var options = this.chart._options;
        if (parent) {
            options = options ? options[parent] : null;
        }
        if (options && options[name]) {
            return wijmo.asNumber(options[name], true);
        }
        return undefined;
    }

    getItemFormatter(series: _ISeries): Function {
        if (series instanceof SeriesBase) {
            var ser = <SeriesBase>series;
            return ser.itemFormatter ? ser.itemFormatter : this.chart.itemFormatter;
        }

        return this.chart.itemFormatter;
    }

    static cloneStyle(style: any, ignore: string[]): any {
        if (!style) {
            return style;
        }
        var newStyle = {};

        for (var key in style) {
            if (ignore && ignore.indexOf(key) >= 0) {
                continue;
            }
            newStyle[key] = style[key];
        }

        return newStyle;
    }

    isValid(datax: number, datay: number, ax: _IAxis, ay: _IAxis): boolean {
        return isFinite(datax) && isFinite(datay) &&
            FlexChartCore._contains(this.chart._plotRect, new wijmo.Point(datax, datay))
    }

    load() {
    }

    unload() {
    }

    _createSteps(x: number[], y: number[], num?:number): { x: number[], y: number[] } {
        let step = this.getOption('position', 'step');

        let len = num? num : x.length;
        let sx: number[] = [];
        let sy: number[] = [];

        let rot = this.chart._isRotated();

        if (step == 'center') {
            if (rot) {
                for (let i = 0; i < len; i++) {
                    let dym = i == 0 ? y[i + 1] - y[i] : y[i] - y[i - 1];
                    let dyp = i == len - 1 ? y[i] - y[i - 1] : y[i + 1] - y[i];

                    sx.push(x[i]);
                    sy.push(y[i] - 0.5 * dym);

                    sx.push(x[i]);
                    sy.push(y[i] + 0.5 * dyp);
                }
            } else {
                for (let i = 0; i < len; i++) {
                    let dxm = i == 0 ? x[i + 1] - x[i] : x[i] - x[i - 1];
                    let dxp = i == len - 1 ? x[i] - x[i - 1] : x[i + 1] - x[i];

                    sx.push(x[i] - 0.5 * dxm);
                    sy.push(y[i]);

                    sx.push(x[i] + 0.5 * dxp);
                    sy.push(y[i]);
                }
            }
        }
        else if(step == 'end') {
            for (let i = 0; i < len; i++) {
                if (i > 0) {
                    if (rot) {
                        sx.push(x[i]);
                        sy.push(y[i - 1]);
                    }
                    else {
                        sx.push(x[i - 1]);
                        sy.push(y[i]);
                    }
                }
                sx.push(x[i]);
                sy.push(y[i]);
            }
        }
        else {
            for (let i = 0; i < len; i++) {
                sx.push(x[i]);
                sy.push(y[i]);
                if (i < len - 1) {
                    if (rot) {
                        sx.push(x[i]);
                        sy.push(y[i + 1]);
                    }
                    else {
                        sx.push(x[i + 1]);
                        sy.push(y[i]);
                    }
                }
            }
        }
        return { x: sx, y: sy };
    }
}
    }
    


    module wijmo.chart {
    






















'use strict';

/**
 * Specifies the chart type.
 */
export enum ChartType {
    /** Shows vertical bars and allows you to compare values of items across categories. */
    Column,
    /** Shows horizontal bars. */
    Bar,
    /** Shows patterns within the data using X and Y coordinates. */
    Scatter,
    /** Shows trends over a period of time or across categories. */
    Line,
    /** Shows a line chart with a symbol on each data point. */
    LineSymbols,
    /** Shows a line chart with the area below the line filled with color. */
    Area,
    /** Shows a Scatter chart with a third data value that determines the 
     * size of the symbol. The data for this chart type can be defined using the 
     *  {@link FlexChart} or {@link Series} <b>binding</b> property as a comma separated value in the 
     * following format: "yProperty, bubbleSizeProperty".*/
    Bubble,
    /** Presents items with high, low, open, and close values.
     * The size of the wick line is determined by the High and Low values, 
     * while the size of the bar is determined by the Open and Close values. 
     * The bar is displayed using different colors, depending on 
     * whether the close value is higher or lower than the open value. 
     * The data for this chart type can be defined using the 
     *  {@link FlexChart} or {@link Series} <b>binding</b> property as a comma separated value in the 
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    Candlestick,
    /** Displays the same information as a candlestick chart, except that opening 
     * values are displayed using lines to the left, while lines to the right
     * indicate closing values.  The data for this chart type can be defined using the 
     *  {@link FlexChart} or {@link Series} <b>binding</b> property as a comma separated value in the 
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    HighLowOpenClose,
    /** Displays a line chart that plots curves rather than angled lines through the
    * data points. */
    Spline,
    /** Displays a spline chart with symbols on each data point. */
    SplineSymbols,
    /** Displays a spline chart with the area below the line filled with color. */
    SplineArea,
    /** Displays a funnel chart, usually representing stages in a process such as a sales pipeline. */
    Funnel,
    /** Displays a step chart */
    Step,
    /** Displays a step chart with symbols on each data point. */
    StepSymbols,
    /** Displays a step area chart */
    StepArea
}

/**
 * Specifies whether and how to stack the chart's data values.
 */
export enum Stacking {
    /** No stacking. Each series object is plotted independently. */
    None,
    /** Stacked charts show how each value contributes to the total. */
    Stacked,
    /** 100% stacked charts show how each value contributes to the total with the relative size of
     * each series representing its contribution to the total. */
    Stacked100pc
}

/**
 * The core charting control for {@link FlexChart}.
 */
export class FlexChartCore extends FlexChartBase {
    static _CSS_AXIS_X = 'wj-axis-x';
    static _CSS_AXIS_Y = 'wj-axis-y';

    static _CSS_LINE = 'wj-line';
    static _CSS_GRIDLINE = 'wj-gridline';
    static _CSS_TICK = 'wj-tick';

    static _CSS_GRIDLINE_MINOR = 'wj-gridline-minor';
    static _CSS_TICK_MINOR = 'wj-tick-minor';

    static _CSS_DATA_LABELS = 'wj-data-labels';
    // property storage
    private _series = new wijmo.collections.ObservableArray();
    private _axes = new AxisCollection();
    private _pareas = new PlotAreaCollection();

    private _axisX: Axis;
    private _axisY: Axis;
    private _selection: SeriesBase;
    private _interpolateNulls = false;
    private _legendToggle = false;
    private _symbolSize = 10;

    _dataInfo = new _DataInfo();
    _plotRect: wijmo.Rect;

    private __barPlotter = null;
    private __linePlotter = null;
    private __areaPlotter = null;
    private __bubblePlotter = null;
    private __financePlotter = null;
    private __funnelPlotter = null;
    private _plotters = [];

    private _binding: string;
    private _bindingX: string;
    _rotated = false;
    _stacking = Stacking.None;
    private _lbl: DataLabel;

    _xlabels: string[] = [];
    _xvals: number[] = [];
    _xDataType: wijmo.DataType;

    private _hitTester: _HitTester;
    private _lblAreas: _RectArea[] = [];

    private _keywords: _KeyWords;

    private _curPlotter: _IPlotter;
    private _colRowLens = [];
    private _selectedEls = [];
    _markers: LineMarker[] = [];

    // specify the string to be used as a binding separator.
    // the default is a comma, but in some charts (like PivotChart)
    // the bindings might contain commas, so allow them to change this.
    _bindingSeparator = ',';

    /**
     * Initializes a new instance of the {@link FlexChart} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options A JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true); // invalidate on resize

        // add classes to host element
        this.applyTemplate('wj-control wj-flexchart', null, null);

        // handle changes to chartSeries array
        var self = this;
        self._series.collectionChanged.addHandler(function () {

            // check that chartSeries array contains Series objects
            var arr = self._series;
            for (var i = 0; i < arr.length; i++) {
                var cs = <SeriesBase>wijmo.tryCast(arr[i], SeriesBase);
                if (!cs) {
                    throw 'chartSeries array must contain SeriesBase objects.';
                }
                cs._chart = self;
                if (cs.axisX && cs.axisX._chart == null) {
                    cs.axisX._chart = self;
                    self.axes.push(cs.axisX);
                }
                if (cs.axisY && cs.axisY._chart == null) {
                    cs.axisY._chart = self;
                    self.axes.push(cs.axisY);
                }
            }

            // refresh chart to show the change
            self.invalidate();
        });

        this._currentRenderEngine = new _SvgRenderEngine(this.hostElement);
        this._hitTester = new _HitTester(this);
        this._legend = new Legend(this);
        this._tooltip = new ChartTooltip();
        this._tooltip.showDelay = 0;

        this._lbl = new DataLabel();
        this._lbl._chart = this;

        this._initAxes();

        self._axes.collectionChanged.addHandler(function () {

            var arr = self._axes;
            for (var i = 0; i < arr.length; i++) {
                var axis = wijmo.tryCast(arr[i], Axis);
                if (!axis) {
                    throw 'axes array must contain Axis objects.';
                }
                axis._chart = self;
            }

            // refresh chart to show the change
            self.invalidate();
        });

        self._pareas.collectionChanged.addHandler(function () {
            var arr = self._pareas;
            for (var i = 0; i < arr.length; i++) {
                var pa = wijmo.tryCast(arr[i], PlotArea);
                if (!pa) {
                    throw 'plotAreas array must contain PlotArea objects.';
                }
                pa._chart = self;
            }
            // refresh chart to show the change
            self.invalidate();
        });

        this._keywords = new _KeyWords();

        this.hostElement.addEventListener('click', function (evt) {
            var tip = self._tooltip;
            var tc = tip.content;
            if (tc && self.isTouching) {
                self._updateTooltip(tip, evt);
            }
        });
        this.hostElement.addEventListener('mousemove', function (evt) {
            var tip = self._tooltip;
            var tc = tip.content;
            if (tc && !self.isTouching) {
                self._updateTooltip(tip, evt);
            }
        });

        this.hostElement.addEventListener('mouseleave', function (evt) {
            self._hideToolTip();
        });

        this.hostElement.addEventListener('click', function (evt) {
            if (self.selectionMode != SelectionMode.None) {
                var ht = self._hitTestData(evt);

                var threshold = FlexChartCore._SELECTION_THRESHOLD;
                if (self.tooltip && self.tooltip.threshold)
                    threshold = self.tooltip.threshold;
                if (ht.distance <= threshold && ht.series) {
                    self._select(ht.series, ht.pointIndex);
                } else {
                    if (self.selectionMode == SelectionMode.Series) {
                        ht = self.hitTest(evt);
                        if (ht.chartElement == ChartElement.Legend && ht.series) {
                            self._select(ht.series, null);
                        } else {
                            self._select(null, null);
                        }
                    }
                    else {
                        self._select(null, null);
                    }
                }
            }

            if (self.legendToggle === true) {
                ht = self.hitTest(evt);
                if (ht.chartElement == ChartElement.Legend && ht.series) {
                    if (ht.series.visibility == SeriesVisibility.Legend) {
                        ht.series.visibility = SeriesVisibility.Visible;
                    }
                    else if (ht.series.visibility == SeriesVisibility.Visible) {
                        ht.series.visibility = SeriesVisibility.Legend;
                    }
                    self.focus();
                }
            }
        });

        // apply options only after chart is fully initialized
        this.deferUpdate( () => this.initialize(options));
    }

    initialize(options: any) {
        if (options && options.renderEngine) {
            let eold = wijmo.asType(this._currentRenderEngine, _SvgRenderEngine, true);
            if (eold) {
                eold.detach();
            }
            this._currentRenderEngine = null;
        }
        super.initialize(options);
    }

    _initAxes() {
        this._axisX = new Axis(Position.Bottom);
        this._axisY = new Axis(Position.Left);

        // default style
        this._axisX.majorGrid = false;
        this._axisX.name = 'axisX';
        this._axisY.majorGrid = true;
        this._axisY.majorTickMarks = TickMark.None;
        this._axisY.name = 'axisY';

        this._axisX._chart = this;
        this._axisY._chart = this;

        this._axes.push(this._axisX);
        this._axes.push(this._axisY);
    }

    //--------------------------------------------------------------------------
    // ** object model

    /**
     * Gets the collection of {@link Series} objects.
     */
    get series(): wijmo.collections.ObservableArray {
        return this._series;
    }

    /**
     * Gets the collection of {@link Axis} objects.
     */
    get axes(): wijmo.collections.ObservableArray {
        return this._axes;
    }

    /**
     * Gets or sets the main X axis.
     */
    get axisX(): Axis {
        return this._axisX;
    }
    set axisX(value: Axis) {
        if (value != this._axisX) {
            var ax = this._axisX = wijmo.asType(value, Axis);

            // set default axis attributes
            this.beginUpdate();

            if (ax) {
                if (ax.majorGrid === undefined) {
                    ax.majorGrid = false;
                }
                if (ax.name === undefined) {
                    ax.name = 'axisX';
                }
                if (ax.position == undefined) {
                    ax.position = Position.Bottom;
                }
                ax._axisType = AxisType.X;
                ax._chart = this;
            }
            this.endUpdate();
        }
    }

    /**
     * Gets or sets the main Y axis.
     */
    get axisY(): Axis {
        return this._axisY;
    }
    set axisY(value: Axis) {
        if (value != this._axisY) {
            var ay = this._axisY = wijmo.asType(value, Axis);
            // set default axis attributes
            this.beginUpdate();
            if (ay) {
                if (ay.majorGrid === undefined) {
                    ay.majorGrid = true;
                }
                if (ay.name === undefined) {
                    ay.name = 'axisY';
                }
                ay.majorTickMarks = TickMark.None;
                if (ay.position == undefined) {
                    ay.position = Position.Left;
                }
                ay._axisType = AxisType.Y;
                ay._chart = this;
            }
            this.endUpdate();
        }
    }

    /**
     * Gets the collection of {@link PlotArea} objects.
     */
    get plotAreas(): PlotAreaCollection {
        return this._pareas;
    }

    /**
     * Gets or sets the name of the property that contains the Y values.
     */
    get binding(): string {
        return this._binding;
    }
    set binding(value: string) {
        if (value != this._binding) {
            this._binding = wijmo.asString(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the name of the property that contains the X data values.
     */
    get bindingX(): string {
        return this._bindingX;
    }
    set bindingX(value: string) {
        if (value != this._bindingX) {
            this._bindingX = wijmo.asString(value, true);
            this._bindChart();
        }
    }

    /**
     * Gets or sets the size of the symbols used for all Series objects
     * in this {@link FlexChart}.
     *
     * This property may be overridden by the symbolSize property on 
     * each {@link Series} object.
     * 
     * The default value for this property is <b>10</b> pixels.
     */
    get symbolSize(): number {
        return this._symbolSize;
    }
    set symbolSize(value: number) {
        if (value != this._symbolSize) {
            this._symbolSize = wijmo.asNumber(value, false, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value that determines whether to interpolate 
     * null values in the data.
     *
     * If true, the chart interpolates the value of any missing data
     * based on neighboring points. If false, it leaves a break in
     * lines and areas at the points with null values.
     *
     * The default value for this property is <b>false</b>.
     */
    get interpolateNulls(): boolean {
        return this._interpolateNulls;
    }
    set interpolateNulls(value: boolean) {
        if (value != this._interpolateNulls) {
            this._interpolateNulls = wijmo.asBoolean(value);
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether clicking legend items toggles the
     * series visibility in the chart.
     *
     * The default value for this property is <b>false</b>.
     */
    get legendToggle(): boolean {
        return this._legendToggle;
    }
    set legendToggle(value: boolean) {
        if (value != this._legendToggle) {
            this._legendToggle = wijmo.asBoolean(value);
        }
    }

    /**
     * Gets the chart {@link Tooltip} object.
     *
     * The tooltip content is generated using a template that may contain any of the following
     * parameters:
     *
     * <ul>
     *  <li><b>propertyName</b>:    Any property of the data object represented by the point.</li>
     *  <li><b>seriesName</b>:      Name of the series that contains the data point (FlexChart only).</li>
     *  <li><b>pointIndex</b>:      Index of the data point.</li>
     *  <li><b>value</b>:           <b>Value</b> of the data point (y-value for {@link FlexChart}, item value for {@link FlexPie}).</li>
     *  <li><b>x</b>:               <b>x</b>-value of the data point (FlexChart only).</li>
     *  <li><b>y</b>:               <b>y</b>-value of the data point (FlexChart only).</li>
     *  <li><b>name</b>:            <b>Name</b> of the data point (x-value for {@link FlexChart} or legend entry for {@link FlexPie}).</li>
     * </ul>
     *
     * To modify the template, assign a new value to the tooltip's content property.
     * For example:
     *
     * <pre>
     * chart.tooltip.content = '&lt;b&gt;{seriesName}&lt;/b&gt; ' +
     *    '&lt;img src="resources/{x}.png"/&gt;&lt;br/&gt;{y}';
     * </pre>
     *
     * You can disable chart tooltips by setting the template to an empty string.
     *
     * You can also use the {@link tooltip} property to customize tooltip parameters
     * such as {@link Tooltip.showDelay} and {@link Tooltip.hideDelay}:
     *
     * <pre>
     * chart.tooltip.showDelay = 1000;
     * </pre>
     *
     * See {@link ChartTooltip} properties for more details and options.
     */
    get tooltip(): ChartTooltip {
        return this._tooltip;
    }

    /**
     * Gets or sets the point data label.
     */
    get dataLabel(): DataLabel {
        return this._lbl;
    }
    set dataLabel(value: DataLabel) {
        if (value != this._lbl) {
            this._lbl = wijmo.asType(value, DataLabel);
            if (this._lbl) {
                this._lbl._chart = this;
            }
        }
    }

    /**
     * Gets or sets the selected chart series.
     */
    get selection(): SeriesBase {
        return this._selection;
    }
    set selection(value: SeriesBase) {
        if (value != this._selection) {
            this._selection = wijmo.asType(value, SeriesBase, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the chart render engine.
     */
    get renderEngine(): IRenderEngine {
        return this._currentRenderEngine;
    }
    set renderEngine(value: IRenderEngine) {
        if (value != this._currentRenderEngine) {
            let eold = wijmo.asType(this._currentRenderEngine, _SvgRenderEngine, true);
            if (eold) {
                eold.detach();
            }
            this._currentRenderEngine = value;
            let enew = wijmo.asType(this._currentRenderEngine, _SvgRenderEngine, true);
            if (enew) {
                enew.attach(this.hostElement);
            }
            this.refresh();
        }
    }

    /**
     * Occurs when the series visibility changes, for example when the legendToggle
     * property is set to true and the user clicks the legend.
    */
    readonly seriesVisibilityChanged = new wijmo.Event<FlexChartCore, SeriesEventArgs>();

    /**
     * Raises the {@link seriesVisibilityChanged} event.
     *
     * @param e The {@link SeriesEventArgs} object that contains the event data.
     */
    onSeriesVisibilityChanged(e: SeriesEventArgs) {
        this.seriesVisibilityChanged.raise(this, e);
    }

    /**
     * Gets a {@link HitTestInfo} object with information about the specified point.
     *
     * @param pt The point to investigate, in window coordinates.
     * @param y The Y coordinate of the point (if the first parameter is a number).
     * @return A {@link HitTestInfo} object with information about the point.
     */
    hitTest(pt: any, y?: number): HitTestInfo {
        // control coords
        var cpt = this._toControl(pt, y);

        var hti: HitTestInfo = new HitTestInfo(this, cpt);

        var si: number = null;

        if (FlexChartCore._contains(this._rectHeader, cpt)) {
            hti._chartElement = ChartElement.Header;
        } else if (FlexChartCore._contains(this._rectFooter, cpt)) {
            hti._chartElement = ChartElement.Footer;
        } else if (FlexChartCore._contains(this._rectLegend, cpt)) {
            hti._chartElement = ChartElement.Legend;

            si = this.legend._hitTest(cpt);
            if (si !== null && si >= 0 && si < this.series.length) {
                if (this._getChartType() === ChartType.Bar) {
                    hti._setData(this.series[this.series.length - 1 - si]);
                } else {
                    hti._setData(this.series[si]);
                }
            }
        } else if (FlexChartCore._contains(this._rectChart, cpt)) {
            var lblArea = this._hitTestLabels(cpt);
            if (lblArea) {
                hti._chartElement = ChartElement.DataLabel;
                hti._dist = 0;
                hti._setDataPoint(lblArea.tag);
            } else {
                var hr = this._hitTester.hitTest(cpt);

                // custom series hit test
                var ht: HitTestInfo = null;
                var htsi = null;
                for (var i = this.series.length - 1; i >= 0; i--) {
                    if (this.series[i].hitTest !== Series.prototype.hitTest) {
                        var hts = this.series[i].hitTest(pt);
                        if (hts) {
                            if (!ht || hts.distance < ht.distance) {
                                ht = hts;
                                htsi = i;
                            }
                            if (hts.distance === 0) {
                                break;
                            }
                        }
                    }
                }

                if (hr && hr.area) {
                    if (ht && ht.distance < hr.distance) {
                        hti = ht;
                    } else if (ht && ht.distance == hr.distance && htsi > hr.area.tag.seriesIndex) {
                        hti = ht;
                    } else {
                        hti._setDataPoint(hr.area.tag);
                        hti._dist = hr.distance;
                    }
                } else if (ht) {
                    hti = ht;
                }

                let isAxis = false;
                this.axes.some((axis: Axis) => {
                    if (FlexChartCore._contains(axis._axrect, cpt)) {
                        if (axis.axisType === AxisType.X) {
                            hti._chartElement = ChartElement.AxisX;
                        } else {
                            hti._chartElement = ChartElement.AxisY;
                        }
                        isAxis = true;
                        return true;
                    }
                });
                if (!isAxis) {
                    if (FlexChartCore._contains(this._plotRect, cpt)) {
                        hti._chartElement = ChartElement.PlotArea;
                    } else if (FlexChartCore._contains(this._rectChart, cpt)) {
                        hti._chartElement = ChartElement.ChartArea;
                    }
                }
            }
        }
        else {
            hti._chartElement = ChartElement.None;
        }

        return hti;
    }

    /**
     * Converts a {@link Point} from control coordinates to chart data coordinates.
     *
     * @param pt The point to convert, in control coordinates.
     * @param y The Y coordinate of the point (if the first parameter is a number).
     * @return The point in chart data coordinates.
     */
    pointToData(pt: any, y?: number): wijmo.Point {
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y) as well
            pt = new wijmo.Point(pt, y);
        } if (pt instanceof MouseEvent) {
            pt = new wijmo.Point(pt.pageX, pt.pageY);
            pt = this._toControl(pt);
        }
        else {
            pt = pt.clone();
        }

        pt.x = this.axisX.convertBack(pt.x);
        pt.y = this.axisY.convertBack(pt.y);
        return pt;
    }

    /**
     * Converts a {@link Point} from data coordinates to control coordinates.
     *
     * @param pt {@link Point} in data coordinates, or X coordinate of a point in data coordinates.
     * @param y Y coordinate of the point (if the first parameter is a number).
     * @return The {@link Point} in control coordinates.
     */
    dataToPoint(pt: any, y?: number): wijmo.Point {
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept (x, y) as well
            pt = new wijmo.Point(pt, y);
        }
        wijmo.asType(pt, wijmo.Point);
        var cpt = pt.clone();
        cpt.x = this.axisX.convert(cpt.x);
        cpt.y = this.axisY.convert(cpt.y);

        return cpt;
    }

    /**
     * Disposes of the control by removing its association with the host element.
     */
    dispose(): void {
        this._markers.forEach(lm => lm.remove());
        this._markers = [];
        super.dispose();
    }

    //--------------------------------------------------------------------------
    // implementation

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        if (key == 'series') {
            this.series.clear();
            var arr = wijmo.asArray(value);
            for (var i = 0; i < arr.length; i++) {
                var s = this._createSeries();
                wijmo.copy(s, arr[i]);
                this.series.push(s);
            }
            return true;
        }
        return false;
    }

    _createSeries(): SeriesBase {
        return new Series();
    }

    _clearCachedValues() {
        for (var i = 0; i < this._series.length; i++) {
            var series = <Series>this._series[i];
            if (series.itemsSource == null)
                series._clearValues();
        }
    }

    _performBind() {
        this._xDataType = null;
        this._xlabels.splice(0);
        this._xvals.splice(0);
        if (this._cv) {
            var items = this._cv.items;
            if (items) {
                var len = items.length;
                let bndx = this.bindingX ? new wijmo.Binding(this.bindingX) : null;
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    if (bndx) {
                        var x = bndx.getValue(item);
                        if (wijmo.isNumber(x)) {
                            this._xvals.push(wijmo.asNumber(x));
                            this._xDataType = wijmo.DataType.Number;
                        } else if (wijmo.isDate(x)) {
                            this._xvals.push(wijmo.asDate(x).valueOf());
                            this._xDataType = wijmo.DataType.Date;
                        }
                        this._xlabels.push(x);
                    }
                }
                if (this._xvals.length == len) {
                    this._xlabels.splice(0);
                } else {
                    this._xvals.splice(0);
                }
            }
        }
    }

    _hitTestSeries(pt: wijmo.Point, seriesIndex: number): HitTestInfo {
        // control coords
        var cpt = this._toControl(pt);

        var hti: HitTestInfo = new HitTestInfo(this, cpt);
        var si = seriesIndex;
        var hr = this._hitTester.hitTestSeries(cpt, seriesIndex);

        if (hr && hr.area) {
            hti._setDataPoint(hr.area.tag);
            hti._chartElement = ChartElement.PlotArea;
            hti._dist = hr.distance;
        }

        return hti;
    }

    // hitTest including lines
    _hitTestData(pt: any): HitTestInfo {
        var cpt = this._toControl(pt);
        var hti = new HitTestInfo(this, cpt);
        var hr = this._hitTester.hitTest(cpt, true);

        if (hr && hr.area) {
            hti._setDataPoint(hr.area.tag);
            hti._dist = hr.distance;
        }

        return hti;
    }

    _hitTestLabels(pt: wijmo.Point): _IHitArea {
        var area: _IHitArea = null;

        var len = this._lblAreas.length;
        for (var i = 0; i < len; i++) {
            if (this._lblAreas[i].contains(pt)) {
                area = this._lblAreas[i];
                break;
            }
        }

        return area;
    }

    private static _dist2(p1: wijmo.Point, p2: wijmo.Point): number {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    }

    static _dist(p0: wijmo.Point, p1: wijmo.Point, p2: wijmo.Point): number {
        return Math.sqrt(FlexChartCore._distToSegmentSquared(p0, p1, p2));
    }

    static _distToSegmentSquared(p: wijmo.Point, v: wijmo.Point, w: wijmo.Point): number {
        var l2 = FlexChartCore._dist2(v, w);
        if (l2 == 0)
            return FlexChartCore._dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0)
            return FlexChartCore._dist2(p, v);
        if (t > 1)
            return FlexChartCore._dist2(p, w);
        return FlexChartCore._dist2(p, new wijmo.Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
    }

    _isRotated(): boolean {
        return this._getChartType() == ChartType.Bar ? !this._rotated : this._rotated;
    }

    _plotrectId: string;

    _getChartType(): ChartType {
        return null;
    }

    _prepareRender() {
        this._hitTester.clear();
    }

    _renderChart(engine: IRenderEngine, rect: wijmo.Rect, applyElement: boolean) {
        var tsz: wijmo.Size;
        var r = this._rectChart.clone();
        var hostSz = new wijmo.Size(r.width, r.height);

        var w = rect.width;
        var h = rect.height;

        this._selectedEls.length = 0;
        //
        var plotter = this._getPlotter(null);
        plotter.stacking = this._stacking;

        if (this._curPlotter != plotter) {
            if (this._curPlotter) {
                this._curPlotter.unload(); // clean up / restore chart settings
            }
            this._curPlotter = plotter;
        }
        plotter.load(); // change global chart settings

        var isRotated = this._isRotated();

        this._dataInfo.analyse(this._series, isRotated, plotter.stacking, this._xvals.length > 0 ? this._xvals : null,
            this.axisX._getLogBase() > 0, this.axisY._getLogBase() > 0);

        var rect0 = plotter.adjustLimits(this._dataInfo, rect.clone());

        if (isRotated) {
            var ydt = this._dataInfo.getDataTypeX();
            if (!ydt) {
                ydt = this._xDataType;
            }
            this.axisX._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.left, rect0.right);
            this.axisY._updateActualLimits(ydt, rect0.top, rect0.bottom, this._xlabels, this._xvals);
        }
        else {
            var xdt = this._dataInfo.getDataTypeX();
            if (!xdt) {
                xdt = this._xDataType;
            }
            this.axisX._updateActualLimits(xdt, rect0.left, rect0.right, this._xlabels, this._xvals);
            this.axisY._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.top, rect0.bottom);
        }

        var axes = this._getAxes();
        this._updateAuxAxes(axes, isRotated);

        this._layout(rect, hostSz, engine);

        // render plot areas
        engine.startGroup(FlexChartCore._CSS_PLOT_AREA);
        engine.fill = 'transparent';
        engine.stroke = null;
        var plen = this.plotAreas.length;
        if (plen > 0) {
            for (var i = 0; i < this.plotAreas.length; i++) {
                var pa = <PlotArea>this.plotAreas[i];
                pa._render(engine);
            }
        } else {
            var prect = this._plotRect;
            engine.drawRect(prect.left, prect.top, prect.width, prect.height);
        }
        engine.endGroup();

        var len = this._series.length;

        this._clearPlotters();
        var groups = {};

        for (var i = 0; i < len; i++) {
            var series: SeriesBase = this._series[i],
                vis = series.visibility;
            if ((vis == SeriesVisibility.Visible || vis == SeriesVisibility.Plot) && series.getValues(0)) {
                var ay = series._getAxisY();
                var plotter = this._getPlotter(series);

                // auxiliary y-axis and non-bar plots has own series group
                if (ay && ay != this.axisY && !(plotter instanceof _BarPlotter)) {
                    var axid = ay._uniqueId;
                    if (!groups[axid]) {
                        groups[axid] = { count: 1, index: 0 };
                    } else {
                        groups[axid].count += 1;
                    }
                } else {
                    plotter.seriesCount++;
                }
            }
        }

        this.onRendering(new RenderEventArgs(engine));

        //Don't draw axis for funnel chart.
        if (this._getChartType() !== ChartType.Funnel) {
            for (var i = 0; i < axes.length; i++) {
                var ax: Axis = axes[i], ele;
                if (ax.axisType == AxisType.X) {
                    ele = engine.startGroup(FlexChartCore._CSS_AXIS_X, this._chartRectId);
                } else {
                    ele = engine.startGroup(FlexChartCore._CSS_AXIS_Y, this._chartRectId);
                }
                ax._hostElement = applyElement ? ele : ax._hostElement;

                ax._render(engine);
                engine.endGroup();
            }
        }

        engine.startGroup('wj-series-group'); // all series

        this._plotrectId = 'plotRect' + (1000000 * Math.random()).toFixed();

        engine.addClipRect(this._plotRect, this._plotrectId);

        for (var i = 0; i < len; i++) {
            let series = <SeriesBase>this._series[i];
            series._pointIndexes = [];
            var plotter = this._getPlotter(series);
            series._plotter = plotter;
            var ele = engine.startGroup(series.cssClass, plotter.clipping ? this._plotrectId : null);
            series._hostElement = applyElement ? ele : series._hostElement;
            var vis = series.visibility;
            var axisX = series.axisX;
            var axisY = series.axisY;
            if (!axisX) {
                axisX = this.axisX;
            }
            if (!axisY) {
                axisY = this.axisY;
            }

            if (vis == SeriesVisibility.Visible || vis == SeriesVisibility.Plot) {
                var group = groups[axisY._uniqueId];
                var index, count;
                if (group && !(plotter instanceof _BarPlotter)) {
                    index = group.index;
                    count = group.count;
                    group.index++;
                    if (!series.onRendering(engine, index, count)) {
                        plotter.plotSeries(engine, axisX, axisY, series, this, index, count);
                    }
                } else {
                    index = plotter.seriesIndex;
                    count = plotter.seriesCount;
                    plotter.seriesIndex++;
                    if (!series.onRendering(engine, index, count)) {
                        plotter.plotSeries(engine, axisX, axisY, series, this, index, count);
                    }
                }
                series.onRendered(engine);
            }
            engine.endGroup();
        }
        engine.endGroup();

        this._lblAreas = [];
        if (this.dataLabel.content && this.dataLabel.position != LabelPosition.None) {
            this._renderLabels(engine);
        }

        this._highlightCurrent();
        this.onRendered(new RenderEventArgs(engine));
    }

    _getDesiredLegendSize(engine: IRenderEngine, isVertical: boolean, width: number, height: number): wijmo.Size {
        // measure all series
        var sz = new wijmo.Size();
        var arr = this.series;
        var len = arr.length;

        var rh = 0;
        var cw = 0;

        this._colRowLens = [];
        for (var i = 0; i < len; i++) {

            // get the series
            var series = <SeriesBase>wijmo.tryCast(arr[i], SeriesBase);

            // skip hidden series and series with no names
            var vis = series.visibility;
            if (!series.name || vis == SeriesVisibility.Hidden || vis == SeriesVisibility.Plot) {
                continue;
            }

            var slen = series.legendItemLength();

            for (var si = 0; si < slen; si++) {
                // measure the legend
                var isz = series.measureLegendItem(engine, si);
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
                } else {
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
        }

        if (isVertical) {
            if (sz.height < rh) {
                sz.height = rh;
            }
            this._colRowLens.push(cw);
            sz.width = this._colRowLens.reduce((a, b) => a + b, 0);
            sz.width = this._getLegendSize(width, sz.width);
        } else {
            if (sz.width < cw) {
                sz.width = cw;
            }
            this._colRowLens.push(rh);
            sz.height = this._colRowLens.reduce((a, b) => a + b, 0);
            sz.height = this._getLegendSize(height, sz.height);
        }

        return sz;
    }

    _renderLegend(engine: IRenderEngine, pos: wijmo.Point, areas: any[], isVertical: boolean, width: number, height: number) {
        var arr = this.series;
        var len = arr.length;
        var series;
        var p = pos.clone();
        var colRowLen = 0;

        // draw legend items
        if (this._legendReversed()) {
            for (var i = len - 1; i >= 0; i--) {
                series = wijmo.tryCast(arr[i], SeriesBase);
                colRowLen = this._renderLegendElements(engine, series, pos, p, areas, isVertical, width, height, colRowLen);
            }
        } else {
            for (var i = 0; i < len; i++) {
                series = wijmo.tryCast(arr[i], SeriesBase);
                colRowLen = this._renderLegendElements(engine, series, pos, p, areas, isVertical, width, height, colRowLen);
            }
        }
    }

    private _legendReversed() : boolean {
        var rev = false;

        var ct = this._getChartType();

        if(ct === ChartType.Bar || (ct === ChartType.Column && this._rotated)) {
            if(this._stacking === Stacking.None && !this.axisY.reversed) {
                rev = true;
            }
        }

        return rev;
    }

    private _renderLegendElements(engine: IRenderEngine, series: SeriesBase, pos: wijmo.Point, p: wijmo.Point, areas: any[], isVertical: boolean, width: number, height: number, colRowLen: number) {
        var rectLegend = this._rectLegend;
        var colLen = colRowLen;
        var rh = 0,
            cw = 0;
        if (!series) {
            return colLen;
        }

        // skip hidden series and series with no names
        var vis = series.visibility;
        if (!series.name || vis == SeriesVisibility.Hidden || vis == SeriesVisibility.Plot) {
            series._legendElement = null;
            areas.push(null);
            return colLen;
        }

        var slen = series.legendItemLength();

        var g = engine.startGroup(series.cssClass);
        if (vis == SeriesVisibility.Legend) {
            g.setAttribute('opacity', '0.5');
            series._legendElement = g;
        } else if (vis == SeriesVisibility.Visible) {
            series._legendElement = g;
        } else {
            series._legendElement = null;
        }

        for (var si = 0; si < slen; si++) {

            // create legend item
            var sz = series.measureLegendItem(engine, si);

            if (isVertical) {
                if (p.y + sz.height > rectLegend.top + rectLegend.height + 1) {
                    p.x += this._colRowLens[colLen];
                    colLen++;
                    p.y = pos.y;
                }
            } else {
                if (p.x + sz.width > rectLegend.left + rectLegend.width + 1) {
                    p.y += this._colRowLens[colLen];
                    colLen++;
                    p.x = pos.x;
                }
            }

            var rect = new wijmo.Rect(p.x, p.y, sz.width, sz.height);
            if (vis == SeriesVisibility.Legend || vis == SeriesVisibility.Visible) {
                series.drawLegendItem(engine, rect, si);
            }

            // done, move on to next item
            areas.push(rect);
            if (isVertical) {
                p.y += sz.height;
            } else {
                p.x += sz.width;
            }
        }
        engine.endGroup();
        return colLen;
    }

    private _renderLabels(engine: IRenderEngine) {
        var srs = this.series;
        var slen = srs.length;
        engine.stroke = 'null';
        engine.fill = 'transparent';
        engine.strokeWidth = 1;
        var gcss = FlexChartCore._CSS_DATA_LABELS;

        engine.startGroup(gcss);

        for (var i = 0; i < slen; i++) {
            var ser = <SeriesBase>srs[i];
            var smap = this._hitTester._map[i];
            if (smap) {
                ser._renderLabels(engine, smap, this, this._lblAreas);
            }
        }
        engine.endGroup();
    }

    private _getAxes(): Axis[] {
        var axes = [this.axisX, this.axisY];
        var len = this.series.length;
        for (var i = 0; i < len; i++) {
            var ser = <Series>this.series[i];
            var ax = ser.axisX;
            if (ax && axes.indexOf(ax) === -1) {
                axes.push(ax);
            }
            var ay = ser.axisY;
            if (ay && axes.indexOf(ay) === -1) {
                axes.push(ay);
            }
        }

        return axes;
    }

    private _clearPlotters() {
        var len = this._plotters.length;
        for (var i = 0; i < len; i++)
            this._plotters[i].clear();
    }

    _initPlotter(plotter: _IPlotter) {
        plotter.chart = this;
        plotter.dataInfo = this._dataInfo;
        plotter.hitTester = this._hitTester;
        this._plotters.push(plotter);
    }

    private get _barPlotter() {
        if (this.__barPlotter === null) {
            this.__barPlotter = new _BarPlotter();
            this._initPlotter(this.__barPlotter);
        }
        return this.__barPlotter;
    }

    private get _linePlotter(): _LinePlotter {
        if (this.__linePlotter === null) {
            this.__linePlotter = new _LinePlotter();
            this._initPlotter(this.__linePlotter);
        }
        return this.__linePlotter;
    }

    private get _areaPlotter() {
        if (this.__areaPlotter === null) {
            this.__areaPlotter = new _AreaPlotter();
            this._initPlotter(this.__areaPlotter);
        }
        return this.__areaPlotter;
    }

    private get _bubblePlotter() {
        if (this.__bubblePlotter === null) {
            this.__bubblePlotter = new _BubblePlotter();
            this._initPlotter(this.__bubblePlotter);
        }
        return this.__bubblePlotter;
    }

    private get _financePlotter() {
        if (this.__financePlotter === null) {
            this.__financePlotter = new _FinancePlotter();
            this._initPlotter(this.__financePlotter);
        }
        return this.__financePlotter;
    }

    private get _funnelPlotter() {
        if (this.__funnelPlotter === null) {
            this.__funnelPlotter = new _FunnelPlotter();
            this._initPlotter(this.__funnelPlotter);
        }
        return this.__funnelPlotter;
    }

    _getPlotter(series: SeriesBase): _IPlotter {
        var chartType = this._getChartType();
        var isSeries = false;
        if (series) {
            var stype = series._getChartType();
            if (stype !== null && stype !== undefined && stype != chartType) {
                chartType = stype;
                isSeries = true;
            }
        }

        var plotter: _IPlotter;
        switch (chartType) {
            case ChartType.Column:
                this._barPlotter.isVolume = false;
                this._barPlotter.width = 0.7;
                plotter = this._barPlotter;
                break;
            case ChartType.Bar:
                this._barPlotter.rotated = !this._rotated;
                this._barPlotter.isVolume = false;
                this._barPlotter.width = 0.7;
                plotter = this._barPlotter;
                break;
            case ChartType.Line:
                this._linePlotter.hasSymbols = false;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = false;
                this._linePlotter.isStep = false;
                plotter = this._linePlotter;
                break;
            case ChartType.Scatter:
                this._linePlotter.hasSymbols = true;
                this._linePlotter.hasLines = false;
                this._linePlotter.isSpline = false;
                this._linePlotter.isStep = false;
                plotter = this._linePlotter;
                break;
            case ChartType.LineSymbols:
                this._linePlotter.hasSymbols = true;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = false;
                this._linePlotter.isStep = false;
                plotter = this._linePlotter;
                break;
            case ChartType.Area:
                this._areaPlotter.isSpline = false;
                this._areaPlotter.isStep = false;
                plotter = this._areaPlotter;
                break;
            case ChartType.Bubble:
                plotter = this._bubblePlotter;
                break;
            case ChartType.Candlestick:
                var fp = this._financePlotter;
                fp.isCandle = true;
                fp.isEqui = false;
                fp.isArms = false;
                fp.isVolume = false;
                plotter = fp;
                break;
            case ChartType.HighLowOpenClose:
                var fp = this._financePlotter;
                fp.isCandle = false;
                fp.isEqui = false;
                fp.isArms = false;
                fp.isVolume = false;
                plotter = fp;
                break;
            case ChartType.Spline:
                this._linePlotter.hasSymbols = false;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = true;
                this._linePlotter.isStep = false;
                plotter = this._linePlotter;
                break;
            case ChartType.SplineSymbols:
                this._linePlotter.hasSymbols = true;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = true;
                this._linePlotter.isStep = false;
                plotter = this._linePlotter;
                break;
            case ChartType.SplineArea:
                this._areaPlotter.isSpline = true;
                this._areaPlotter.isStep = false;
                plotter = this._areaPlotter;
                break;
            case ChartType.Funnel:
                plotter = this._funnelPlotter;
                break;
            case ChartType.Step:
                this._linePlotter.hasSymbols = false;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = false;
                this._linePlotter.isStep = true;
                plotter = this._linePlotter;
                break;
            case ChartType.StepSymbols:
                this._linePlotter.hasSymbols = true;
                this._linePlotter.hasLines = true;
                this._linePlotter.isSpline = false;
                this._linePlotter.isStep = true;
                plotter = this._linePlotter;
                break;
            case ChartType.StepArea:
                this._areaPlotter.isSpline = false;
                this._areaPlotter.isStep = true;
                plotter = this._areaPlotter;
                break;

            default:
                throw 'Invalid chart type.';
        }

        plotter.rotated = this._rotated;
        if (chartType == ChartType.Bar)
            plotter.rotated = !plotter.rotated;
        if (isSeries) {
            plotter.rotated = this._isRotated();
        }

        return plotter;
    }

    _layout(rect: wijmo.Rect, size: wijmo.Size, engine: IRenderEngine) {
        if (this.plotAreas.length > 0) {
            this._layoutMultiple(rect, size, engine);
        } else {
            this._layoutSingle(rect, size, engine);
        }
    }

    private _layoutSingle(rect: wijmo.Rect, size: wijmo.Size, engine: IRenderEngine) {
        var w = rect.width;
        var h = rect.height;
        var mxsz = new wijmo.Size(w, 0.75 * h);
        var mysz = new wijmo.Size(h, 0.75 * w);

        var left = 0, top = 0, right = w, bottom = h;
        var l0 = 0, t0 = 0, r0 = w, b0 = h;

        var axes = this._getAxes();

        for (var i = 0; i < axes.length; i++) {
            var ax: Axis = axes[i];
            var origin = ax.origin;
            var pos = ax._getPosition();

            if (ax.axisType == AxisType.X) {
                var ah = ax._getHeight(engine, w);

                if (ah > mxsz.height)
                    ah = mxsz.height;

                ax._desiredSize = new wijmo.Size(mxsz.width, ah);

                var hasOrigin = ax._hasOrigin =
                    wijmo.isNumber(origin) && origin > this.axisY._getMinNum() && origin < this.axisY._getMaxNum();

                var annoWidth = Math.min(0.25 * w, ax._annoSize.width);

                if (pos == Position.Bottom) {
                    left = Math.max(left, annoWidth * 0.5);
                    right = Math.min(right, w - annoWidth * 0.5);

                    if (hasOrigin) {
                        var yorigin = this._convertY(origin, t0, b0);
                        b0 = b0 - Math.max(0, (yorigin + ah) - b0);
                    } else {
                        b0 = b0 - ah;
                    }
                } else if (pos == Position.Top) {
                    left = Math.max(left, annoWidth * 0.5);
                    right = Math.min(right, w - annoWidth * 0.5);

                    if (hasOrigin) {
                        var yorigin = this._convertY(origin, t0, b0);
                        t0 = t0 + Math.max(0, t0 - (yorigin - ah));
                    }
                    else {
                        t0 = t0 + ah;
                    }
                }
            } else if (ax.axisType == AxisType.Y) {
                var ah = ax._getHeight(engine, h);
                if (ah > mysz.height) {
                    ah = mysz.height;
                }
                ax._desiredSize = new wijmo.Size(mysz.width, ah);

                var hasOrigin = ax._hasOrigin =
                    wijmo.isNumber(origin) && origin > this.axisX._getMinNum() && origin < this.axisX._getMaxNum();

                if (pos == Position.Left) {
                    if (ax._actualAngle < 0) {
                        bottom = Math.min(bottom, h - ax._annoSize.height);
                    } else if (ax._actualAngle > 0) {
                        top = Math.max(top, ax._annoSize.height);
                    }
                    else {
                        top = Math.max(top, ax._annoSize.height);
                        bottom = Math.min(bottom, h - ax._annoSize.height);
                    }

                    if (hasOrigin) {
                        var xorigin = this._convertX(origin, l0, r0);
                        l0 += Math.max(0, l0 - (xorigin - ah));
                    } else {
                        l0 += ah;
                    }
                } else if (pos == Position.Right) {
                    if (ax._actualAngle > 0) {
                        bottom = Math.min(bottom, h - ax._annoSize.height);
                    } else if (ax._actualAngle < 0) {
                        top = Math.max(top, ax._annoSize.height);
                    }
                    else {
                        top = Math.max(top, ax._annoSize.height);
                        bottom = Math.min(bottom, h - ax._annoSize.height);
                    }

                    if (hasOrigin) {
                        var xorigin = this._convertX(origin, l0, r0);
                        r0 = r0 - Math.max(0, (xorigin + ah) - r0);
                    }
                    else {
                        r0 = r0 - ah;
                    }
                }
            }
        }

        // todo: custom margins
        var margins = this._parseMargin(this.plotMargin);

        if (!isNaN(margins.left)) {
            left = l0 = margins.left;
        } else {
            left = l0 = Math.max(left, l0) + rect.left;
        }

        if (!isNaN(margins.right)) {
            right = r0 = size.width - margins.right;
        } else {
            right = r0 = Math.min(right, r0) + rect.left;
        }

        if (!isNaN(margins.top)) {
            top = t0 = margins.top;
        } else {
            top = t0 = Math.max(top, t0) + rect.top;
        }
        if (!isNaN(margins.bottom)) {
            bottom = b0 = size.height - margins.bottom;
        } else {
            bottom = b0 = Math.min(bottom, b0) + rect.top;
        }

        w = Math.max(1, right - left);
        h = Math.max(1, bottom - top);
        this._plotRect = new wijmo.Rect(left, top, w, h);

        if (bottom <= top) {
            b0 = t0 + 1;
        }

        engine.stroke = null;

        for (var i = 0; i < axes.length; i++) {
            var ax: Axis = axes[i];
            var origin = ax.origin;
            var pos = ax._getPosition();

            if (ax.axisType == AxisType.X) {
                var axr: wijmo.Rect;

                if (!ax._hasOrigin) {
                    if (pos == Position.Bottom) {
                        axr = new wijmo.Rect(left, b0, w, ax._desiredSize.height);
                        b0 += ax._desiredSize.height;
                    } else if (pos == Position.Top) {
                        axr = new wijmo.Rect(left, t0 - ax._desiredSize.height, w, ax._desiredSize.height);
                        t0 -= ax._desiredSize.height;
                    }
                    else {
                        axr = new wijmo.Rect(left, t0, w, 1);
                    }
                } else {
                    var yorigin = this._convertY(origin, this._plotRect.top, this._plotRect.bottom);
                    if (pos == Position.Bottom) {
                        axr = new wijmo.Rect(left, yorigin, w, ax._desiredSize.height);
                        b0 += Math.max(0, axr.bottom - this._plotRect.bottom);
                    } else if (pos == Position.Top) {
                        axr = new wijmo.Rect(left, yorigin - ax._desiredSize.height, w, ax._desiredSize.height);
                        t0 -= Math.max(0, this._plotRect.top - axr.top);
                    } else {
                        axr = new wijmo.Rect(left, yorigin, w, 1);
                    }
                }
                ax._layout(axr, this._plotRect);
            } else if (ax.axisType == AxisType.Y) {
                var ayr: wijmo.Rect;

                if (!ax._hasOrigin) {
                    if (pos == Position.Left) {
                        ayr = new wijmo.Rect(l0 - ax._desiredSize.height, top, h, ax._desiredSize.height);
                        l0 -= ax._desiredSize.height;
                    }
                    else if (pos == Position.Right) {
                        ayr = new wijmo.Rect(r0, top, h, ax._desiredSize.height);
                        r0 += ax._desiredSize.height;
                    }
                    else {
                        ayr = new wijmo.Rect(l0, top, h, 1);
                    }
                } else {
                    var xorigin = this._convertX(origin, this._plotRect.left, this._plotRect.right);

                    if (pos == Position.Left) {
                        ayr = new wijmo.Rect(xorigin - ax._desiredSize.height, top, h, ax._desiredSize.height);
                        l0 -= ax._desiredSize.height;
                    }
                    else if (pos == Position.Right) {
                        ayr = new wijmo.Rect(xorigin, top, h, ax._desiredSize.height);
                        r0 += ax._desiredSize.height;
                    } else {
                        ayr = new wijmo.Rect(xorigin, top, h, 1);
                    }
                }

                ax._layout(ayr, this._plotRect);
            }
        }
    }

    private _layoutMultiple(rect: wijmo.Rect, size: wijmo.Size, engine: IRenderEngine) {
        var w = rect.width;
        var h = rect.height;

        var cols = [],
            rows = [];

        var axes = this._getAxes();
        var cnt = axes.length;

        for (var i = 0; i < cnt; i++) {
            var ax = <Axis>axes[i];
            ax._plotrect = null;
            if (ax.axisType == AxisType.X) {
                var col = ax.plotArea ? ax.plotArea.column : 0;
                while (cols.length <= col)
                    cols.push(new _AreaDef());
                cols[col].axes.push(ax);
            }
            else if (ax.axisType == AxisType.Y) {
                var row = ax.plotArea ? ax.plotArea.row : 0;
                while (rows.length <= row)
                    rows.push(new _AreaDef());
                rows[row].axes.push(ax);
            }
        }

        var ncols = cols.length,
            nrows = rows.length;

        var mxsz = new wijmo.Size(w, 0.3 * h),
            mysz = new wijmo.Size(h, 0.3 * w),
            left = 0,
            top = 0,
            right = w,
            bottom = h;

        for (var icol = 0; icol < ncols; icol++) {
            var ad = <_AreaDef>cols[icol];
            ad.right = w;
            ad.bottom = h;
            for (var i = 0; i < ad.axes.length; i++) {
                var ax = <Axis>ad.axes[i];
                var ah = ax._getHeight(engine, ax.axisType == AxisType.X ? w : h);
                if (ah > mxsz.height)
                    ah = mxsz.height;
                var szx = new wijmo.Size(mxsz.width, ah);
                ax._desiredSize = szx;

                if (icol == 0)
                    ad.left = Math.max(ad.left, ax._annoSize.width * 0.5);
                if (icol == ncols - 1)
                    ad.right = Math.min(ad.right, w - ax._annoSize.width * 0.5);

                var pos = ax._getPosition();
                if (pos == Position.Bottom)
                    ad.bottom -= szx.height;
                else if (pos == Position.Top)
                    ad.top += szx.height;
            }
        }

        for (var irow = 0; irow < nrows; irow++) {
            var ad = <_AreaDef>rows[irow];
            ad.right = w;
            ad.bottom = h;
            for (var i = 0; i < ad.axes.length; i++) {
                var ax = <Axis>ad.axes[i];
                var szy = new wijmo.Size(mysz.width, ax._getHeight(engine, ax.axisType == AxisType.X ? w : h));
                if (szy.height > mysz.height)
                    szy.height = mysz.height;
                ax._desiredSize = szy;

                if (irow == 0)
                    ad.top = Math.max(ad.top, ax._annoSize.width * 0.5);
                if (irow == nrows - 1)
                    ad.bottom = Math.min(ad.bottom, h - ax._annoSize.width * 0.5);

                var pos = ax._getPosition();
                if (pos == Position.Left)
                    ad.left += szy.height;
                else if (pos == Position.Right)
                    ad.right -= szy.height;
            }
        }

        var l0 = 0,
            t0 = 0,
            r0 = w,
            b0 = h;

        for (var icol = 0; icol < ncols; icol++) {
            var ad = <_AreaDef>cols[icol];
            l0 = Math.max(l0, ad.left); t0 = Math.max(t0, ad.top);
            r0 = Math.min(r0, ad.right); b0 = Math.min(b0, ad.bottom);
        }
        for (var irow = 0; irow < nrows; irow++) {
            var ad = <_AreaDef>rows[irow];
            l0 = Math.max(l0, ad.left); t0 = Math.max(t0, ad.top);
            r0 = Math.min(r0, ad.right); b0 = Math.min(b0, ad.bottom);
        }

        l0 = left = Math.max(left, l0);
        r0 = right = Math.min(right, r0);
        t0 = top = Math.max(top, t0);
        b0 = bottom = Math.min(bottom, b0);

        this._plotRect = new wijmo.Rect(left, top, right - left, bottom - top);
        var plot0 = this._plotRect.clone();

        var x = left;
        var widths = this.plotAreas._calculateWidths(this._plotRect.width, ncols);

        for (var icol = 0; icol < ncols; icol++) {
            b0 = bottom; t0 = top;
            var ad = <_AreaDef>cols[icol];
            var wcol = widths[icol];
            for (var i = 0; i < ad.axes.length; i++) {
                var ax = ad.axes[i];
                var pos = ax._getPosition();
                var axplot = new wijmo.Rect(x, plot0.top, wcol, plot0.height);

                var axr: wijmo.Rect;// = new Rect();
                if (pos == Position.Bottom) {
                    axr = new wijmo.Rect(x, b0, wcol, ax._desiredSize.height);
                    b0 += ax._desiredSize.height;
                }
                else if (pos == Position.Top) {
                    axr = new wijmo.Rect(x, t0 - ax._desiredSize.height, wcol, ax._desiredSize.height);
                    t0 -= ax._desiredSize.height;
                }
                ax._layout(axr, axplot);
            }

            for (var i = 0; i < this.plotAreas.length; i++) {
                var pa = <PlotArea>this.plotAreas[i];
                if (pa.column == icol)
                    pa._setPlotX(x, wcol);
            }

            x += wcol;
        }

        var y = top;//bottom;
        var heights = this.plotAreas._calculateHeights(this._plotRect.height, nrows);

        for (var irow = 0; irow < nrows; irow++) {
            l0 = left; r0 = right;
            var ad = <_AreaDef>rows[irow];
            var hrow = heights[irow];

            for (var i = 0; i < ad.axes.length; i++) {
                var ax = ad.axes[i];
                var pos = ax._getPosition();
                var axplot = new wijmo.Rect(plot0.left, y, plot0.width, hrow);
                if (ax._plotrect) {
                    axplot.left = ax._plotrect.left;
                    axplot.width = ax._plotrect.width;
                } else if (widths && widths.length > 0) {
                    axplot.width = widths[0];
                }
                var ayr: wijmo.Rect;

                if (pos == Position.Left) {
                    ayr = new wijmo.Rect(l0 - ax._desiredSize.height, y, hrow, ax._desiredSize.height);
                    l0 -= ax._desiredSize.height;
                }
                else if (pos == Position.Right) {
                    ayr = new wijmo.Rect(r0, y, hrow, ax._desiredSize.height);
                    r0 += ax._desiredSize.height;
                }

                ax._layout(ayr, axplot);
            }

            for (var i = 0; i < this.plotAreas.length; i++) {
                var pa = <PlotArea>this.plotAreas[i];
                if (pa.row == irow)
                    pa._setPlotY(y, hrow);
            }

            y += hrow;
        }
    }

    //---------------------------------------------------------------------

    private _convertX(x: number, left: number, right: number) {
        var ax = this.axisX;
        if (ax.reversed)
            return right - (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
        else
            return left + (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
    }

    private _convertY(y: number, top: number, bottom: number): number {
        var ay = this.axisY;
        if (ay.reversed)
            return top + (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
        else
            return bottom - (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
    }

    // tooltips

    _getLabelContent(ht: HitTestInfo, content: any): string {
        if (wijmo.isString(content)) {
            return this._keywords.replace(content, ht);
        } else if (wijmo.isFunction(content)) {
            return content(ht);
        }

        return null;
    }


    //---------------------------------------------------------------------
    // selection
    private _select(newSelection: SeriesBase, pointIndex: number) {
        var raiseSelectionChanged = false;
        if (newSelection != this._selection || pointIndex != this._selectionIndex) {
            raiseSelectionChanged = true;
        }
        // un-highlight old selection
        if (this._selection) {
            this._highlight(this._selection, false, this._selectionIndex);
        }

        // highlight new selection
        this._selection = newSelection;
        this._selectionIndex = pointIndex;
        if (this._selection) {
            this._highlight(this._selection, true, this._selectionIndex);
        }

        // update CollectionView
        if (this.selectionMode == SelectionMode.Point) {
            var cv = newSelection ? newSelection.collectionView : this._cv;
            if (cv) {
                this._notifyCurrentChanged = false;
                cv.moveCurrentToPosition(newSelection ? pointIndex : -1);
                this._notifyCurrentChanged = true;
            }
        }

        // raise event
        if (raiseSelectionChanged) {
            this.onSelectionChanged();
        }
    }

    private _highlightCurrent() {
        if (this.selectionMode != SelectionMode.None) {
            var selection = this._selection;
            var pointIndex = -1;
            if (selection) {
                var cv = selection.collectionView;
                if (!cv) {
                    cv = this._cv;
                }

                if (cv) {
                    pointIndex = cv.currentPosition;
                }

                this._highlight(selection, true, pointIndex);
            }
        }
    }

    private _highlight(series: SeriesBase, selected: boolean, pointIndex: number) {

        // check that the selection is a Series object (or null)
        series = wijmo.asType(series, SeriesBase, true);

        // select the series or the point
        if (this.selectionMode == SelectionMode.Series) {
            var index = this.series.indexOf(series);
            var gs = series.hostElement;

            if (selected) {
                gs.parentNode.appendChild(gs);
            } else {
                gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
            }

            var found = this._find(gs, ['rect', 'ellipse', 'polyline', 'polygon', 'line', 'path']);
            this._highlightItems(found, FlexChartCore._CSS_SELECTION, selected);

            if (series.legendElement) {
                this._highlightItems(this._find(series.legendElement, ['rect', 'ellipse', 'line']), FlexChartCore._CSS_SELECTION, selected);
            }

        } else if (this.selectionMode == SelectionMode.Point) {
            var index = this.series.indexOf(series);
            var gs = series.hostElement;

            if (selected) {
                gs.parentNode.appendChild(gs);
                var pel = series.getPlotElement(pointIndex);
                if (pel) {
                    if (pel instanceof SVGElement) {
                        if (pel.nodeName != 'g') {
                            this._highlightItems([pel], FlexChartCore._CSS_SELECTION, selected);
                            this._selectedEls.push(pel);
                        }
                        var found = this._find(pel, ['line', 'rect', 'ellipse', 'path', 'polygon']);
                        if (found.length > 0) {
                            this._highlightItems(found, FlexChartCore._CSS_SELECTION, selected);
                            for (let i = 0; i < found.length; i++) {
                                this._selectedEls.push(found[i]);
                            }
                        }
                    } else if (Array.isArray(pel)) {
                        this._highlightItems(pel, FlexChartCore._CSS_SELECTION, selected);
                        for (let i = 0; i < pel.length; i++) {
                            this._selectedEls.push(pel[i]);
                        }
                    }
                }
            } else {
                gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                if (this._selectedEls.length > 0) {
                    this._highlightItems(this._selectedEls, FlexChartCore._CSS_SELECTION, selected);
                    this._selectedEls.length = 0;
                }
                // else {
                //    var found = this._find(gs, ['rect', 'ellipse', 'line', 'path', 'polygon']);
                //    this._highlightItems(found, FlexChartCore._CSS_SELECTION, selected);
                //}
            }

        }
    }

    private _updateTooltip(tip: ChartTooltip, evt: MouseEvent) {
        let ht = this.hitTest(evt);
        let content: string;
        if (ht.distance <= tip.threshold) {
            let tc = tip.content;
            if (ht.series) {
                let tsc = ht.series.tooltipContent;
                if (tsc || tsc === '') {
                    tc = tsc;
                }
            }
            content = this._getLabelContent(ht, tc);
        }
        if (content) {
            this._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
        } else {
            this._hideToolTip();
        }
    }

    // aux axes
    _updateAuxAxes(axes: Axis[], isRotated: boolean) {
        for (var i = 2; i < axes.length; i++) {
            var ax = axes[i];
            ax._chart = this;
            var slist = [];
            for (var iser = 0; iser < this.series.length; iser++) {
                var ser = this.series[iser];
                if (ser.axisX == ax || ser.axisY == ax) {
                    slist.push(ser);
                }
            }
            var dataMin,
                dataMax;
            for (var iser = 0; iser < slist.length; iser++) {
                var rect = slist[iser].getDataRect() || slist[iser]._getDataRect();
                if (rect) {
                    if ((ax.axisType == AxisType.X && !isRotated) || (ax.axisType == AxisType.Y && isRotated)) {
                        if (dataMin === undefined || rect.left < dataMin) {
                            dataMin = rect.left;
                        }
                        if (dataMax === undefined || rect.right > dataMax) {
                            dataMax = rect.right;
                        }
                    } else {
                        if (dataMin === undefined || rect.top < dataMin) {
                            dataMin = rect.top;
                        }
                        if (dataMax === undefined || rect.bottom > dataMax) {
                            dataMax = rect.bottom;
                        }
                    }
                }
            }

            var dtype = slist[0].getDataType(0);
            if (dtype == null) {
                dtype = wijmo.DataType.Number;
            }

            axes[i]._updateActualLimits(dtype, dataMin, dataMax);
        }

    }
}


class _AreaDef {
    private _axes = new Array<Axis>();

    public get axes(): Array<Axis> {
        return this._axes;
    }

    public left = 0;
    public right = 0;
    public top = 0;
    public bottom = 0;
}


/**
 * Analyzes chart data.
 */
export class _DataInfo {
    private minY: number;
    private maxY: number;
    private minX: number;
    private maxX: number;
    private minXp: number;
    private minYp: number;

    private dataTypeX: wijmo.DataType;
    private dataTypeY: wijmo.DataType;

    private stackAbs: { [key: number]: number } = {};
    private _xvals: Array<number> = null;

    private dx: number;

    constructor() {
    }

    analyse(seriesList: any, isRotated: boolean, stacking: Stacking, xvals: Array<number>, logx: boolean, logy: boolean) {
        this.minY = NaN;
        this.maxY = NaN;
        this.minX = NaN;
        this.maxX = NaN;
        this.minXp = NaN;
        this.minYp = NaN;
        this.dx = 0;

        var stackPos: { [key: number]: number } = {};
        var stackNeg: { [key: number]: number } = {};
        var stackAbs: { [key: number]: number } = {};

        this.dataTypeX = null;
        this.dataTypeY = null;

        this._xvals = xvals;
        if (xvals != null) {
            var len = xvals.length;
            for (var i = 0; i < len; i++) {
                var xval = xvals[i];
                if (isNaN(this.minX) || this.minX > xval) {
                    this.minX = xval;
                }
                if (isNaN(this.maxX) || this.maxX < xval) {
                    this.maxX = xval;
                }

                if (xval > 0) {
                    if (isNaN(this.minXp) || this.minXp > xval) {
                        this.minXp = xval;
                    }
                }

                if (i > 0) {
                    var dx = Math.abs(xval - xvals[i - 1]);
                    if (!isNaN(dx) && (dx < this.dx || this.dx == 0)) {
                        this.dx = dx;
                    }
                }
            }
        }

        for (var i = 0; i < seriesList.length; i++) {
            var series = <Series>seriesList[i];
            var ctype = series._getChartType();
            var custom = series.chartType !== undefined;
            var vis = series.visibility;
            if (vis == SeriesVisibility.Hidden || vis == SeriesVisibility.Legend) {
                continue;
            }

            var calDr = series.getDataRect();
            var drLen;
            if (calDr) {
                if (!isNaN(this.minX) && this.minX < calDr.left) {
                    drLen = calDr.right;
                    calDr.left = this.minX;
                    calDr.width = drLen - this.minX;
                }
                if (!isNaN(this.maxX) && this.maxX > calDr.right) {
                    calDr.width = this.maxX - calDr.left;
                }
                if (!series._isCustomAxisY()) {
                    if (!isNaN(this.minY) && this.minY < calDr.top) {
                        drLen = calDr.bottom;
                        calDr.top = this.minY;
                        calDr.height = drLen - this.minY;
                    }
                    if (!isNaN(this.maxY) && this.maxY > calDr.bottom) {
                        calDr.height = this.maxY - calDr.top;
                    }
                }
            }

            var xvalues = null;
            if (isRotated) {
                if (!series._isCustomAxisY()) {
                    xvalues = series.getValues(1);
                }
            } else {
                if (!series._isCustomAxisX()) {
                    xvalues = series.getValues(1);
                }
            }

            if (xvalues) {
                if (!this.dataTypeX) {
                    this.dataTypeX = series.getDataType(1);
                }
                for (var j = 0; j < xvalues.length; j++) {
                    var val = xvalues[j];
                    if (isFinite(val)) {
                        if (isNaN(this.minX) || this.minX > val) {
                            this.minX = val;
                        }
                        if (isNaN(this.maxX) || this.maxX < val) {
                            this.maxX = val;
                        }

                        if (j > 0 && (!ctype || // only default or col/bar
                            ctype == <ChartType>ChartType.Column || ctype == ChartType.Bar)) {
                            var dx = Math.abs(val - xvalues[j - 1]);
                            if (!isNaN(dx) && dx > 0 && (dx < this.dx || this.dx == 0)) {
                                this.dx = dx;
                            }
                        }
                    }
                }
            }
            var values = null,
                customY = false;
            if (isRotated) {
                customY = series._isCustomAxisX();
                values = series.getValues(0);
            } else {
                customY = series._isCustomAxisY();
                values = series.getValues(0);
            }

            if (values) {
                if (!this.dataTypeY && !customY) {
                    this.dataTypeY = series.getDataType(0);
                }

                if (isNaN(this.minX)) {
                    this.minX = 0;
                } else if (!xvalues && !xvals) {
                    this.minX = Math.min(this.minX, 0);
                }

                if (isNaN(this.maxX)) {
                    this.maxX = values.length - 1;
                } else if (!xvalues && !xvals) {
                    this.maxX = Math.max(this.maxX, values.length - 1);
                }

                if (!customY) {
                    let notStacked = stacking == Stacking.None || custom;
                    for (let j = 0; j < values.length; j++) {
                        let val = values[j];
                        let xval = xvalues ? wijmo.asNumber(xvalues[j], true) : (xvals ? wijmo.asNumber(xvals[j], true) : j);
                        if (wijmo.isArray(val)) {
                            //for BarPlot.
                            val.forEach(v => {
                                this._parseYVal(v, xval, notStacked, stackAbs, stackPos, stackNeg);
                            });
                        } else {
                            this._parseYVal(val, xval, notStacked, stackAbs, stackPos, stackNeg);
                        }
                    }
                }
            }
            //update rect based on current rect if necessary.
            var dr = series.getDataRect(new wijmo.Rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY), calDr);
            if (dr) {
                this.minX = dr.left;
                this.maxX = dr.right;

                if (!customY) {
                    this.minY = dr.top;
                    this.maxY = dr.bottom;
                }
            }
        }

        if (stacking == Stacking.Stacked) {
            for (var key in stackPos) {
                if (stackPos[key] > this.maxY) {
                    this.maxY = stackPos[key];
                }
            }
            for (var key in stackNeg) {
                if (stackNeg[key] < this.minY) {
                    this.minY = stackNeg[key];
                }
            }
        } else if (stacking == Stacking.Stacked100pc) {
            this.minY = 0;
            this.maxY = 0;
            for (var key in stackAbs) {
                var sum = stackAbs[key];
                if (isFinite(sum) && sum != 0) {
                    var vpos = stackPos[key];
                    var vneg = stackNeg[key];
                    if (isFinite(vpos)) {
                        vpos = Math.max(vpos / sum, this.maxY);
                        if (vpos > this.maxY) {
                            this.maxY = vpos;
                        }
                    }
                    if (isFinite(vneg)) {
                        vneg = Math.min(vneg / sum, this.minY);
                        if (vneg < this.minY) {
                            this.minY = vneg;
                        }
                    }
                }
            }
            if (this.minY == this.maxY) {
                this.minY = 0;
                this.maxY = 1;
            }
        }
        this.stackAbs = stackAbs;

        if (logx) {
            if (isRotated)
                this.minY = isNaN(this.minYp) ? 1 : this.minYp;
            else
                this.minX = isNaN(this.minXp) ? 1 : this.minXp;
        }
        if (logy) {
            if (isRotated)
                this.minX = isNaN(this.minXp) ? 1 : this.minXp;
            else
                this.minY = isNaN(this.minYp) ? 1 : this.minYp;
        }
    }

    _parseYVal(val, xval, custom, stackAbs, stackPos, stackNeg) {
        if (isFinite(val)) {
            if (val != null && (isNaN(this.minY) || this.minY > val)) {
                this.minY = val;
            }
            if (val != null && (isNaN(this.maxY) || this.maxY < val)) {
                this.maxY = val;
            }
            if (val > 0 && (isNaN(this.minYp) || this.minYp > val)) {
                this.minYp = val;
            }
            if (!custom) {
                if (val > 0) {
                    if (isNaN(stackPos[xval])) {
                        stackPos[xval] = val;
                    } else {
                        stackPos[xval] += val;
                    }
                } else {
                    if (isNaN(stackNeg[xval])) {
                        stackNeg[xval] = val;
                    } else {
                        stackNeg[xval] += val;
                    }
                }
                if (isNaN(stackAbs[xval])) {
                    stackAbs[xval] = Math.abs(val);
                } else {
                    stackAbs[xval] += Math.abs(val);
                }
            }
        }
    }

    getMinY(): number {
        return this.minY;
    }

    getMaxY(): number {
        return this.maxY;
    }

    getMinX(): number {
        return this.minX;
    }

    getMaxX(): number {
        return this.maxX;
    }

    getMinXp(): number {
        return this.minXp;
    }

    getMinYp(): number {
        return this.minYp;
    }

    getDeltaX(): number {
        return this.dx;
    }

    getDataTypeX(): wijmo.DataType {
        return this.dataTypeX;
    }

    getDataTypeY(): wijmo.DataType {
        return this.dataTypeY;
    }

    getStackedAbsSum(key: number) {
        var sum = this.stackAbs[key];
        return isFinite(sum) ? sum : 0;
    }

    getXVals(): Array<number> {
        return this._xvals;
    }

    //static isValid(value: number): boolean {
    //    return isFinite(value);// && !isNaN(value);
    //}

    static isValid(...vals: number[]): boolean {
        let len = vals.length;
        for (let i = 0; i < len; i++) {
            if (!isFinite(vals[i])) {
                return false;
            }
        }
        return true;
    }
}

    }
    


    module wijmo.chart {
    





'use strict';

/**
 * The {@link FlexChart} control provides a powerful and flexible way to visualize
 * data.
 *
 * You can use the {@link FlexChart} control to create charts that display data in
 * several formats, including bar, line, symbol, bubble, and others.
 *
 * To use the {@link FlexChart} control, set the {@link FlexChart.itemsSource} property
 * to an array containing the data objects, then add one or more {@link Series} objects
 * to the {@link FlexChart.series} property.
 *
 * Use the {@link FlexChart.chartType} property to define the {@link ChartType} used as
 * a default for all series. You may override the chart type for each series by
 * setting the {@link Series.chartType} property on the members of the
 * {@link FlexChart.series} array.
 *
 * {@sample Chart/Overview/purejs Example}
 */
export class FlexChart extends FlexChartCore {

    private _chartType = ChartType.Column;

    /**
     * Initializes a new instance of the {@link FlexChart} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options A JavaScript object containing initialization data
     * for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);
        this.initialize(options);
    }

    _getChartType(): ChartType {
        return this._chartType;
    }

    /**
     * Gets or sets the type of chart to create.
     * 
     * The default value for this property is <b>ChartType.Column</b>.
     */
    get chartType(): ChartType {
        return this._chartType;
    }
    set chartType(value: ChartType) {
        value = wijmo.asEnum(value, ChartType);
        if (value != this._chartType) {
            this._chartType = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value indicating whether to flip the axes so that 
     * X becomes vertical and Y becomes horizontal.
     * 
     * The default value for this property is <b>false</b>.
     */
    get rotated(): boolean {
        return this._rotated;
    }
    set rotated(value: boolean) {
        if (value != this._rotated) {
            this._rotated = wijmo.asBoolean(value);
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value that determines whether and how the series objects are stacked.
     *
     * The default value for this property is <b>Stacking.None</b>.
     */
    get stacking(): Stacking {
        return this._stacking;
    }
    set stacking(value: Stacking) {
        value = wijmo.asEnum(value, Stacking);
        if (value != this._stacking) {
            this._stacking = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets various chart options.
     *
     * The following options are supported:
     *
     * <b>bubble.maxSize</b>: Specifies the maximum size
     * of symbols in the Bubble chart. The default value is 30 pixels.
     *
     * <b>bubble.minSize</b>: Specifies the minimum size
     * of symbols in the Bubble chart. The default value is 5 pixels.
     *
     * <pre>chart.options = {
     *   bubble: { minSize: 5, maxSize: 30 }
     * }</pre>
     *
     *
     * <b>funnel.neckWidth</b>: Specifies the neck width as a percentage for the Funnel chart.
     * The default value is 0.2.
     *
     * <b>funnel.neckHeight</b>: Specifies the neck height as a percentage for the Funnel chart.
     * The default value is 0.
     *
     * <b>funnel.type</b>: Specifies the type of Funnel chart. It should be 'rectangle' or 'default'.
     * neckWidth and neckHeight don't work if type is set to rectangle.
     *
     * <pre>chart.options = {
     *   funnel: { neckWidth: 0.3, neckHeight: 0.3, type: 'rectangle' }
     * }</pre>

        * <b>groupWidth</b>: Specifies the group width for the Column charts, 
        * or the group height for the Bar charts. The group width can be specified
        * in pixels or as percentage of the available space. The default value is '70%'.
        *
        * <pre>chart.options = {
        *   groupWidth : 50; // 50 pixels
        * }
        * chart.options = {
        *   groupWidth : '100%'; // 100% pixels
        * }</pre>
        */
    get options(): any {
        return this._options;
    }
    set options(value: any) {
        if (value != this._options) {
            this._options = value;
            this.invalidate();
        }
    }
}
    }
    


    module wijmo.chart {
    











'use strict';

/**
 * Area chart plotter.
 */
export class _AreaPlotter extends _BasePlotter implements _IPlotter {
    stacking = Stacking.None;
    isSpline = false;
    isStep = false;
    rotated: boolean;

    private stackPos: { [key: number]: number } = {};
    private stackNeg: { [key: number]: number } = {};

    constructor() {
        super();
    }

    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;
        let xmin = dataInfo.getMinX();
        let ymin = dataInfo.getMinY();
        let xmax = dataInfo.getMaxX();
        let ymax = dataInfo.getMaxY();

        for (let iser = 0; iser < this.chart.series.length; iser++) {
            let ser: SeriesBase = this.chart.series[iser];
            if (this._isRange(ser)) {
                let ct = ser._getChartType();
                if (!ct || ct == ChartType.Area) {
                    let vals = ser._getBindingValues(1);
                    for (let i = 0; i < vals.length; i++) {
                        if (vals[i] > ymax) {
                            ymax = vals[i];
                        } else if (vals[i] < ymin) {
                            ymin = vals[i];
                        }
                    }
                }
            }
        }

        if (this.isSpline) {
            let dy = 0.1 * (ymax - ymin);
            if (!this.chart.axisY._getLogBase())
                ymin -= dy;
            ymax += dy;
        }

        if (this.rotated) {
            return new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin);
        }
        else {
            return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
        }
    }

    clear() {
        super.clear();
        this.stackNeg = {};
        this.stackPos = {};
    }

    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        let ser = <SeriesBase>series;
        if (this._isRange(ser)) {
            this.plotSeriesRanged(engine, ax, ay, series, palette, iser, nser, customRender);
            return;
        }

        let points = [];
        let si = this.chart.series.indexOf(series);
        let ys = series.getValues(0);
        let xs = series.getValues(1);

        if (!ys) {
            return;
        }

        let len = ys.length;

        if (!len) {
            return;
        }

        if (!xs)
            xs = this.dataInfo.getXVals();

        let hasXs = true;
        if (!xs) {
            hasXs = false
            xs = new Array<number>(len);
        }
        else if (xs.length < len) {
            len = xs.length;
        }

        let xvals = new Array<number>();
        let yvals = new Array<number>();

        let xvals0 = new Array<number>();
        let yvals0 = new Array<number>();

        let stacked = this.stacking != Stacking.None && !ser._isCustomAxisY();
        let stacked100 = this.stacking == Stacking.Stacked100pc && !ser._isCustomAxisY();
        if (ser._getChartType() !== undefined) {
            stacked = stacked100 = false;
        }

        let rotated = this.rotated;

        let hasNulls = false;
        let interpolateNulls = ser.interpolateNulls;

        let xmax: number = null;
        let xmin: number = null;

        let prect = this.chart._plotRect;

        for (let i = 0; i < len; i++) {
            let datax = hasXs ? xs[i] : i;
            let datay = ys[i];
            if (xmax === null || datax > xmax) {
                xmax = datax;
            }
            if (xmin === null || datax < xmin) {
                xmin = datax;
            }
            if (_DataInfo.isValid(datax, datay)) {
                let x = rotated ? ay.convert(datax) : ax.convert(datax);
                if (stacked) {
                    if (stacked100) {
                        let sumabs = this.dataInfo.getStackedAbsSum(datax);
                        datay = datay / sumabs;
                    }

                    let sum = 0;

                    if (datay >= 0) {
                        sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                        datay = this.stackPos[datax] = sum + datay;
                    }
                    else {
                        sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                        datay = this.stackNeg[datax] = sum + datay;
                    }

                    if (rotated) {
                        if (sum < ax.actualMin) {
                            sum = ax.actualMin;
                        }
                        xvals0.push(ax.convert(sum));
                        yvals0.push(x);
                    } else {
                        xvals0.push(x);
                        if (sum < ay.actualMin) {
                            sum = ay.actualMin;
                        }
                        yvals0.push(ay.convert(sum));
                    }
                }
                if (rotated) {
                    let y = ax.convert(datay);
                    if (!isNaN(x) && !isNaN(y)) {
                        xvals.push(y);
                        yvals.push(x);
                        if (FlexChartCore._contains(prect, new wijmo.Point(y, x))) {
                            let area = new _CircleArea(new wijmo.Point(y, x), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datay, datax);
                            this.hitTester.add(area, si);
                        }
                    }
                    else {
                        hasNulls = true;
                        if (!stacked && interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }
                else {
                    let y = ay.convert(datay);

                    if (!isNaN(x) && !isNaN(y)) {
                        xvals.push(x);
                        yvals.push(y);
                        if (FlexChartCore._contains(prect, new wijmo.Point(x, y))) {
                            let area = new _CircleArea(new wijmo.Point(x, y), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datax, datay);
                            this.hitTester.add(area, si);
                        }
                    }
                    else {
                        hasNulls = true;
                        if (!stacked && interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }
            }
            else {
                hasNulls = true;
                if (!stacked && interpolateNulls !== true) {
                    xvals.push(undefined);
                    yvals.push(undefined);
                }
            }
        }

        if (customRender) {
            xvals.forEach((v, i) => {
                if (v != null) {
                    points.push(new wijmo.Point(v, yvals[i]));
                }
            });
        }

        let swidth = this._DEFAULT_WIDTH;
        let fill = palette._getColorLight(si);
        let stroke = palette._getColor(si);

        let lstyle = _BasePlotter.cloneStyle(series.style, ['fill']);
        let pstyle = _BasePlotter.cloneStyle(series.style, ['stroke']);

        if (!stacked && interpolateNulls !== true && hasNulls) {
            let dx = [];
            let dy = [];

            for (let i = 0; i < len; i++) {
                if (xvals[i] === undefined) {
                    if (dx.length > 1) {
                        let pts = this._modifyPoints(dx,dy);
                        dx = pts.x; dy = pts.y;

                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.fill = 'none';
                        engine.drawLines(dx, dy, null, lstyle);
                        this.hitTester.add(new _LinesArea(dx, dy), si);

                        if (rotated) {
                            dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                            dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                        }
                        else {
                            dx.push(dx[dx.length - 1], dx[0]);
                            dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                        }
                        engine.fill = fill;
                        engine.stroke = 'none';
                        engine.drawPolygon(dx, dy, null, pstyle, this.chart._plotrectId);
                    }
                    dx = [];
                    dy = [];
                }
                else {
                    dx.push(xvals[i]);
                    dy.push(yvals[i]);
                }
            }
            if (dx.length > 1) {
                let pts = this._modifyPoints(dx,dy);
                dx = pts.x; dy = pts.y;

                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = 'none';
                engine.drawLines(dx, dy, null, lstyle);
                this.hitTester.add(new _LinesArea(dx, dy), si);

                if (rotated) {
                    dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                    dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                }
                else {
                    dx.push(dx[dx.length - 1], dx[0]);
                    dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                }
                engine.fill = fill;
                engine.stroke = 'none';
                engine.drawPolygon(dx, dy, null, pstyle, this.chart._plotrectId);
            }
        }
        else {
            let pts = this._modifyPoints(xvals,yvals);
            xvals = pts.x; yvals = pts.y;

            if (stacked) {
                let pts0 = this._modifyPoints(xvals0,yvals0);
                xvals0 = pts0.x; yvals0 = pts0.y;

                xvals = xvals.concat(xvals0.reverse());
                yvals = yvals.concat(yvals0.reverse());
            }
            else {
                if (rotated) {
                    xvals.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                        yvals.push(yvals[yvals.length - 1], yvals[0]);
                }
                else {
                        xvals.push(xvals[xvals.length - 1], xvals[0]);
                    yvals.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                }
            }

            engine.fill = fill;
            engine.stroke = 'none';
            engine.drawPolygon(xvals, yvals, null, pstyle, this.chart._plotrectId);

            if (stacked) {
                xvals = xvals.slice(0, xvals.length - xvals0.length);
                yvals = yvals.slice(0, yvals.length - yvals0.length);
            } else {
                xvals = xvals.slice(0, xvals.length - 2);
                yvals = yvals.slice(0, yvals.length - 2);
            }

            engine.stroke = stroke;
            engine.strokeWidth = swidth;
            engine.fill = 'none';
            engine.drawLines(xvals, yvals, null, lstyle, this.chart._plotrectId);
            this.hitTester.add(new _LinesArea(xvals, yvals), si);
        }

        this._drawSymbols(engine, series, si);

        if (customRender && points && points.length) {
            customRender(points);
        }
    }

    private _isRange(series: SeriesBase) {
        let sep = this.chart ? this.chart._bindingSeparator : ',';
        let fields = series.binding == null ? null : series.binding.split(sep);
        return fields != null && fields.length == 2;
    }

    private _modifyPoints(x:number[], y:number[]) : {x:number[], y:number[]} {
        let res = {x:x, y:y};
        if (this.isSpline) {
            let s = this._convertToSpline(x, y);
            res.x = s.xs; res.y = s.ys;
        } else if(this.isStep) {
            let steps = this._createSteps(x, y);
            res.x = steps.x; res.y = steps.y;
        }
        return res;
    }

    plotSeriesRanged(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        let points = [];
        let si = this.chart.series.indexOf(series);
        let ser = <SeriesBase>series;

        let ys = series.getValues(0);
        let xs = series.getValues(1);
        let ys2 = ser._getBindingValues(1);

        if (!ys) {
            return;
        }

        let len = ys.length;

        if (!len) {
            return;
        }

        if (!xs)
            xs = this.dataInfo.getXVals();

        let hasXs = true;
        if (!xs) {
            hasXs = false;
            xs = new Array<number>(len);
        }
        else if (xs.length < len) {
            len = xs.length;
        }

        let xvals = new Array<number>();
        let yvals = new Array<number>();
        let vals2 = new Array<number>();

        let rotated = this.rotated;
        let hasNulls = false;
        let interpolateNulls = ser.interpolateNulls;

        let prect = this.chart._plotRect;

        for (let i = 0; i < len; i++) {
            let datax = hasXs ? xs[i] : i;
            let datay = ys[i];
            let datay2 = ys2[i];
            if (_DataInfo.isValid(datax, datay, datay2)) {
                let x = rotated ? ay.convert(datax) : ax.convert(datax);
                if (rotated) {
                    let y = ax.convert(datay);
                    let y2 = ax.convert(datay2);
                    if (!isNaN(x) && !isNaN(y)) {
                        xvals.push(y);
                        yvals.push(x);
                        vals2.push(y2);
                        if (FlexChartCore._contains(prect, new wijmo.Point(y, x))) {
                            let area = new _CircleArea(new wijmo.Point(y, x), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datay, datax);
                            this.hitTester.add(area, si);
                        }
                        if (FlexChartCore._contains(prect, new wijmo.Point(y2, x))) {
                            let area = new _CircleArea(new wijmo.Point(y2, x), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datay2, datax);
                            this.hitTester.add(area, si);
                        }
                    }
                    else {
                        hasNulls = true;
                        if ( interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                            vals2.push(undefined);
                        }
                    }
                }
                else {
                    let y = ay.convert(datay);
                    let y2 = ay.convert(datay2);
                    if (!isNaN(x) && !isNaN(y)) {
                        xvals.push(x);
                        yvals.push(y);
                        vals2.push(y2);
                        if (FlexChartCore._contains(prect, new wijmo.Point(x, y))) {
                            let area = new _CircleArea(new wijmo.Point(x, y), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datax, datay);
                            this.hitTester.add(area, si);
                        }
                        if (FlexChartCore._contains(prect, new wijmo.Point(x, y2))) {
                            let area = new _CircleArea(new wijmo.Point(x, y2), this._DEFAULT_SYM_SIZE);
                            area.tag = new _DataPoint(si, i, datax, datay2);
                            this.hitTester.add(area, si);
                        }
                    }
                    else {
                        hasNulls = true;
                        if (interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                            vals2.push(undefined);
                        }
                    }
                }
            }
            else {
                hasNulls = true;
                if (interpolateNulls !== true) {
                    xvals.push(undefined);
                    yvals.push(undefined);
                    vals2.push(undefined);
                }
            }
        }

        if (customRender) {
            xvals.forEach((v, i) => {
                if (v != null) {
                    points.push(new wijmo.Point(v, yvals[i]));
                }
            });
        }

        let swidth = this._DEFAULT_WIDTH;
        let fill = palette._getColorLight(si);
        let stroke = palette._getColor(si);

        let lstyle = _BasePlotter.cloneStyle(series.style, ['fill']);
        let pstyle = _BasePlotter.cloneStyle(series.style, ['stroke']);

        if (interpolateNulls !== true && hasNulls) {
            let dx = [];
            let dy = [];
            let dv = [];

            for (let i = 0; i < len; i++) {
                if (xvals[i] === undefined) {
                    if (dx.length > 1) {
                        let dx2 = rotated ? dv.slice(0).reverse() : dx.slice(0).reverse();
                        let dy2 = rotated ? dy.slice(0).reverse() : dv.slice(0).reverse();
                        this._drawRangedArea(engine, dx, dy, dx2, dy2, fill, stroke, swidth, pstyle, lstyle);
                        this.hitTester.add(new _LinesArea(dx, dy), si);
                        this.hitTester.add(new _LinesArea(dx2, dy2), si);
                    }
                    dx = [];
                    dy = [];
                    dv = [];
                }
                else {
                    dx.push(xvals[i]);
                    dy.push(yvals[i]);
                    dv.push(vals2[i]);
                }
            }
            if (dx.length > 1) {
                let dx2 = rotated ? dv.slice(0).reverse() : dx.slice(0).reverse();
                let dy2 = rotated ? dy.slice(0).reverse() : dv.slice(0).reverse();
                this._drawRangedArea(engine, dx, dy, dx2, dy2, fill, stroke, swidth, pstyle, lstyle);
                this.hitTester.add(new _LinesArea(dx, dy), si);
                this.hitTester.add(new _LinesArea(dx2, dy2), si);
            }
        }
        else {
            let xvals2 = rotated ? vals2.slice(0).reverse() : xvals.slice(0).reverse();
            let yvals2 = rotated ? yvals.slice(0).reverse() : vals2.slice(0).reverse();
            this._drawRangedArea(engine, xvals, yvals, xvals2, yvals2, fill, stroke, swidth, pstyle, lstyle);
            this.hitTester.add(new _LinesArea(xvals, yvals), si);
            this.hitTester.add(new _LinesArea(xvals2, yvals2), si);
        }

        this._drawSymbols(engine, series, si);

        if (customRender && points && points.length) {
            customRender(points);
        }
    }

    _drawRangedArea(engine: IRenderEngine, xvals1: number[], yvals1: number[], xvals2: number[], yvals2: number[],
        fill: string, stroke: string, swidth: number, pstyle:any, lstyle:any) {
        if (this.isSpline) {
            let s1 = this._convertToSpline(xvals1, yvals1);
            let s2 = this._convertToSpline(xvals2, yvals2);
            xvals1 = s1.xs; yvals1 = s1.ys;
            xvals2 = s2.xs; yvals2 = s2.ys;
        }

        xvals1 = xvals1.concat(xvals2);
        yvals1 = yvals1.concat(yvals2);

        engine.fill = fill;
        engine.stroke = 'none';
        engine.drawPolygon(xvals1, yvals1, null, pstyle);

        xvals1 = xvals1.slice(0, xvals1.length - xvals2.length);
        yvals1 = yvals1.slice(0, yvals1.length - yvals2.length);

        engine.stroke = stroke;
        engine.strokeWidth = swidth;
        engine.fill = 'none';
        engine.drawLines(xvals1, yvals1, null, lstyle);
        engine.drawLines(xvals2, yvals2, null, lstyle);
    }

    _convertToSpline(x: number[], y: number[]) {
        if (x && y) {
            var spline = new _Spline(x, y);
            var s = spline.calculate();
            return { xs: s.xs, ys: s.ys };
        } else {
            return { xs: x, ys: y };
        }
    }

    _drawSymbols(engine: IRenderEngine, series: _ISeries, seriesIndex: number) {
        let ifmt = this.getItemFormatter(series);
        if (ifmt != null) {
            let areas = this.hitTester._map[seriesIndex];
            for (let i = 0; i < areas.length; i++) {
                let area: _CircleArea = wijmo.tryCast(areas[i], _CircleArea);
                if (area) {
                    let dpt = <_DataPoint>area.tag;
                    engine.startGroup();
                    let hti: HitTestInfo = new HitTestInfo(this.chart, area.center, ChartElement.SeriesSymbol);
                    hti._setDataPoint(dpt);
                    ifmt(engine, hti, () => {});
                    engine.endGroup();
                }
            }
            engine.cssPriority = true;
        }
    }
}
    }
    


    module wijmo.chart {
    












'use strict';

/**
 * Bar/column chart plotter.
 */
export class _BarPlotter extends _BasePlotter implements _IPlotter {
    origin = 0;
    width = 0.7;
    isVolume = false;
    private _volHelper: _VolumeHelper = null;
    private _itemsSource: any[];

    stackPosMap = {};
    stackNegMap = {};

    stacking = Stacking.None;
    rotated: boolean;

    _getSymbolOrigin: Function;
    _getSymbolStyles: Function;

    clear() {
        super.clear();

        this.stackNegMap[this.chart.axisY._uniqueId] = {};
        this.stackPosMap[this.chart.axisY._uniqueId] = {};
        this._volHelper = null;
    }

    load(): void {
        super.load();
        if (!this.isVolume) { return; }

        var series: SeriesBase,
            ax: Axis, ct: ChartType,
            vols: number[],
            dt: wijmo.DataType, i: number,
            xvals: number[],
            itemsSource: any[],
            xmin: number = null,
            xmax: number = null;

        // loop through series collection
        for (i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            dt = series.getDataType(1) || series.chart._xDataType;
            ax = series._getAxisX();

            // get volume data based on chart type
            ct = series._getChartType();
            ct = ct === null || wijmo.isUndefined(ct) ? this.chart._getChartType() : ct;
            if (ct === ChartType.Column) {
                let sep = this.chart ? this.chart._bindingSeparator : ',';
                let len = series.binding.split(sep).length - 1;
                vols = series._getBindingValues(len);
            } else if (ct === ChartType.Candlestick) {
                vols = series._getBindingValues(4);
            } else {
                vols = null;
            }

            // get x values directly for dates, otherwise get from dataInfo
            if (dt === wijmo.DataType.Date) {
                var date;
                xvals = [];
                itemsSource = [];
                for (i = 0; i < series._getLength(); i++) {
                    date = series._getItem(i)[series.bindingX].valueOf();
                    xvals.push(date);
                    itemsSource.push({
                        value: date,
                        text: wijmo.Globalize.format(new Date(date), ax.format || "d")
                    });
                }
            } else {
                xvals = this.dataInfo.getXVals();
            }

            xmin = this.dataInfo.getMinX();
            xmax = this.dataInfo.getMaxX();

            if (vols && vols.length > 0) {
                this._volHelper = new _VolumeHelper(vols, xvals, xmin, xmax, dt);
                ax._customConvert = this._volHelper.convert.bind(this._volHelper);
                ax._customConvertBack = this._volHelper.convertBack.bind(this._volHelper);

                if (itemsSource && itemsSource.length > 0) {
                    this._itemsSource = ax.itemsSource = itemsSource;
                }
                break;  // only one set of volume data is supported per chart
            }
        }
    }

    unload(): void {
        super.unload();
        var series: SeriesBase,
            ax: Axis;

        for (var i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            ax = series._getAxisX();
            if (ax) {
                ax._customConvert = null;
                ax._customConvertBack = null;
                if (ax.itemsSource && ax.itemsSource == this._itemsSource) {
                    this._itemsSource = ax.itemsSource = null;
                }
            }
        }
    }

    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;

        var xmin = dataInfo.getMinX();
        var xmax = dataInfo.getMaxX();
        var ymin = dataInfo.getMinY();
        var ymax = dataInfo.getMaxY();

        var dx = dataInfo.getDeltaX();
        if (dx <= 0) {
            dx = 1;
        }

        let origin = false;

        // init/cleanup volume conversions for x-axis based on ChartType/FinancialChartType mappings
        if (this.isVolume && (this.chart._getChartType() === ChartType.Column || this.chart._getChartType() === ChartType.Candlestick)) {
            this.load();
        } else {
            this.unload();
        }
        //for range bar, stack is not supported yet.
        for (let i = 0; i < this.chart.series.length; i++) {
            let series = this.chart.series[i];
            let ct = series._getChartType();
            ct = ct === null || wijmo.isUndefined(ct) ? this.chart._getChartType() : ct;
            if (ct === ChartType.Column || ct === ChartType.Bar) {
                let isRange = this._isRange(series);
                if (isRange) {
                    let vals = series._getBindingValues(1);
                    vals.forEach(v => {
                        if (v < ymin) {
                            ymin = v;
                        } else if (v > ymax) {
                            ymax = v;
                        }
                    });
                }
            }
            if (!origin && series.constructor.name != 'BoxWhisker') {
                origin = true;
            }
        }

        if (this.rotated) {
            if (!this.chart.axisY._getLogBase() && dataInfo.getDataTypeY() !== wijmo.DataType.Date && origin) {
                if (this.origin > ymax) {
                    ymax = this.origin;
                } else if (this.origin < ymin) {
                    ymin = this.origin;
                }
            }
            return new wijmo.Rect(ymin, xmin - 0.5 * dx, ymax - ymin, xmax - xmin + dx);
        } else {
            if (!this.chart.axisY._getLogBase() && dataInfo.getDataTypeY() !== wijmo.DataType.Date && origin) {
                if (this.origin > ymax) {
                    ymax = this.origin;
                } else if (this.origin < ymin) {
                    ymin = this.origin;
                }
            }
            return new wijmo.Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
        }
    }

    private _isRange(series: SeriesBase) {
        let sep = this.chart ? this.chart._bindingSeparator : ',';
        let seps = series.binding == null ? '' : series.binding.split(sep);
        let len = seps.length - 1;
        let isRange = this.isVolume ? len === 2 : len === 1;
        return isRange;
    }

    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        var points = [];
        var si = this.chart.series.indexOf(series);
        var ser: SeriesBase = wijmo.asType(series, SeriesBase);
        var options = this.chart._options;
        var cw = this.width;
        var wpx = 0;
        iser = iser || 0;
        nser = nser || 1;

        if (options && options.groupWidth) {
            var gw = options.groupWidth;
            if (wijmo.isNumber(gw)) {
                // px
                var gwn = wijmo.asNumber(gw);
                if (isFinite(gwn) && gwn > 0) {
                    wpx = gwn; cw = 1;
                }
            } else if (wijmo.isString(gw)) {
                var gws = wijmo.asString(gw);

                // %
                if (gws && gws.indexOf('%') >= 0) {
                    gws = gws.replace('%', '');
                    var gwn = parseFloat(gws);
                    if (isFinite(gwn)) {
                        if (gwn < 0) {
                            gwn = 0;
                        } else if (gwn > 100) {
                            gwn = 100;
                        }
                        wpx = 0; cw = gwn / 100;
                    }
                } else {
                    // px
                    var gwn = parseFloat(gws);
                    if (isFinite(gwn) && gwn > 0) {
                        wpx = gwn; cw = 1;
                    }
                }
            }
        }

        var w = cw / nser;

        var axid = ser._getAxisY()._uniqueId;

        var stackNeg = this.stackNegMap[axid];
        var stackPos = this.stackPosMap[axid];

        var yvals = series.getValues(0);
        var xvals = series.getValues(1);
        let isRange = this._isRange(ser);
        let rangeData = ser._bindValues(ser._cv == null ? (this.chart.collectionView == null ? null : this.chart.collectionView.items) :
            ser._cv.items, ser._getBinding(1)).values;

        if (!yvals) {
            return;
        }

        if (!xvals) {
            xvals = this.dataInfo.getXVals();
        }

        if (xvals) {
            // find minimal distance between point and use it as column width
            var delta = this.dataInfo.getDeltaX();
            if (delta > 0) {
                cw *= delta;
                w *= delta;
            }
        }

        // set series fill and stroke from style
        var fill = ser._getSymbolFill(si),
            altFill = ser._getAltSymbolFill(si) || fill,
            stroke = ser._getSymbolStroke(si),
            altStroke = ser._getAltSymbolStroke(si) || stroke;

        var len = yvals.length;
        if (xvals != null) {
            len = Math.min(len, xvals.length);
        }
        var origin = this.origin;

        var itemIndex = 0,
            currentFill: string,
            currentStroke: string;

        var stacked = this.stacking != Stacking.None;
        var stacked100 = this.stacking == Stacking.Stacked100pc;
        if (ser._getChartType() !== undefined) {
            stacked = stacked100 = false;
        }

        let ifmt = this.getItemFormatter(series);

        let xmin = (<any>ax)._actualMin,
            xmax = (<any>ax)._actualMax,
            ymin = (<any>ay)._actualMin,
            ymax = (<any>ay)._actualMax;

        if (!this.rotated) {
            if (origin < ymin) {
                origin = ymin;
            } else if (origin > ymax) {
                origin = ymax;
            }

            var originScreen = ay.convert(origin);

            if (ser._isCustomAxisY()) {
                stacked = stacked100 = false;
            }

            for (var i = 0; i < len; i++) {
                let oriScreen = originScreen;
                var datax = xvals ? xvals[i] : i;
                var datay = yvals[i];

                if (this._getSymbolOrigin) {
                    oriScreen = ay.convert(this._getSymbolOrigin(origin, i, len));
                }

                if (isRange && rangeData && rangeData.length) {
                    let rangeVal = rangeData[i];
                    if (_DataInfo.isValid(rangeVal)) {
                        oriScreen = ay.convert(rangeVal);
                    }
                }
                if (this._getSymbolStyles) {
                    var style = this._getSymbolStyles(i, len);
                    fill = style && style.fill ? style.fill : fill;
                    altFill = style && style.fill ? style.fill : altFill;
                    stroke = style && style.stroke ? style.stroke : stroke;
                    altStroke = style && style.stroke ? style.stroke : altStroke;
                }
                // apply fill and stroke
                currentFill = datay > 0 ? fill : altFill;
                currentStroke = datay > 0 ? stroke : altStroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;
                engine.strokeWidth = null;

                if (_DataInfo.isValid(datax, datay)) {
                    if (stacked) {
                        var x0 = datax - 0.5 * cw,
                            x1 = datax + 0.5 * cw;
                        if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                            continue;
                        }
                        x0 = ax.convert(x0);
                        x1 = ax.convert(x1);

                        if (!_DataInfo.isValid(x0, x1)) {
                            continue;
                        }

                        var y0: number, y1: number;

                        if (stacked100) {
                            var sumabs = this.dataInfo.getStackedAbsSum(datax);
                            datay = datay / sumabs;
                        }

                        var sum = 0;
                        if (datay >= 0) {
                            sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                            y0 = ay.convert(Math.max(sum, ymin));
                            y1 = ay.convert(Math.max(sum + datay, ymin));
                            stackPos[datax] = sum + datay;
                        } else {
                            sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                            y0 = ay.convert(sum);
                            y1 = ay.convert(sum + datay);
                            stackNeg[datax] = sum + datay;
                        }

                        if (customRender) {
                            points.push(new wijmo.Point(ax.convert(datax), y1));
                        }

                        if (!_DataInfo.isValid(y0, y1)) {
                            continue;
                        }

                        var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                        if (wpx > 0) {
                            var ratio = 1 - wpx / rect.width;
                            if (ratio < 0) {
                                ratio = 0;
                            }
                            var xc = rect.left + 0.5 * rect.width;
                            rect.left += (xc - rect.left) * ratio;
                            rect.width = Math.min(wpx, rect.width);
                        }

                        var area = new _RectArea(rect);

                        this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y1), ifmt);
                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        area.tag = new _DataPoint(si, i, datax, sum + datay);
                        this.hitTester.add(area, si);
                    } else {
                        var x0 = datax - 0.5 * cw + iser * w,
                            x1 = datax - 0.5 * cw + (iser + 1) * w;

                        if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                            continue;
                        }
                        x0 = ax.convert(x0);
                        x1 = ax.convert(x1);
                        let y = ay.convert(datay);

                        if (!_DataInfo.isValid(y, x0, x1)) {
                            continue;
                        }

                        let rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y, oriScreen), Math.abs(x1 - x0), Math.abs(oriScreen - y));

                        if (customRender) {
                            points.push(new wijmo.Point((x0 + x1) / 2, y));
                        }
                        if (wpx > 0) {
                            var sw = wpx / nser;
                            var ratio = 1 - sw / rect.width;
                            if (ratio < 0) {
                                ratio = 0;
                            }
                            var xc = ax.convert(datax);
                            rect.left += (xc - rect.left) * ratio;
                            rect.width = Math.min(sw, rect.width);
                        }

                        var area = new _RectArea(rect);

                        this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y), ifmt);
                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        area.tag = new _DataPoint(si, i, datax, datay);
                        this.hitTester.add(area, si);
                    }
                } else if (customRender) {
                    points.push(null);
                }
            }
        } else {
            if (origin < xmin) {
                origin = xmin;
            } else if (origin > xmax) {
                origin = xmax;
            }

            if (ser._isCustomAxisY()) {
                stacked = stacked100 = false;
            }

            var originScreen = ax.convert(origin);

            for (var i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i,
                    datay = yvals[i];
                let oriScreen = originScreen;

                if (this._getSymbolOrigin) {
                    oriScreen = ay.convert(this._getSymbolOrigin(origin, i));
                }
                if (isRange && rangeData && rangeData.length) {
                    let rangeVal = rangeData[i];
                    if (_DataInfo.isValid(rangeVal)) {
                        oriScreen = ax.convert(rangeVal);
                    }
                }
                if (this._getSymbolStyles) {
                    var style = this._getSymbolStyles(i);
                    fill = style && style.fill ? style.fill : fill;
                    altFill = style && style.fill ? style.fill : altFill;
                    stroke = style && style.stroke ? style.fill : stroke;
                    altStroke = style && style.stroke ? style.fill : altStroke;
                }
                // apply fill and stroke
                currentFill = datay > 0 ? fill : altFill;
                currentStroke = datay > 0 ? stroke : altStroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;

                if (_DataInfo.isValid(datax, datay)) {
                    if (stacked) {
                        var y0 = datax - 0.5 * cw,
                            y1 = datax + 0.5 * cw;
                        if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                            continue;
                        }
                        y0 = ay.convert(Math.max(y0, ymin));
                        y1 = ay.convert(Math.min(y1, ymax));

                        var x0: number, x1: number;

                        if (stacked100) {
                            var sumabs = this.dataInfo.getStackedAbsSum(datax);
                            datay = datay / sumabs;
                        }

                        var sum = 0;
                        if (datay >= 0) {
                            sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                            x0 = ax.convert(sum);
                            x1 = ax.convert(sum + datay);
                            stackPos[datax] = sum + datay;
                        } else {
                            sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                            x0 = ax.convert(sum);
                            x1 = ax.convert(sum + datay);
                            stackNeg[datax] = sum + datay;
                        }

                        if (customRender) {
                            points.push(new wijmo.Point(x1, ay.convert(datax)));
                        }

                        if (!_DataInfo.isValid(x0, x1)) {
                            continue;
                        }

                        var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                        if (wpx > 0) {
                            var ratio = 1 - wpx / rect.height;
                            if (ratio < 0) {
                                ratio = 0;
                            }
                            var yc = rect.top + 0.5 * rect.height;
                            rect.top += (yc - rect.top) * ratio;
                            rect.height = Math.min(wpx, rect.height);
                        }

                        var area = new _RectArea(rect);
                        this.drawSymbol(engine, rect, series, i, new wijmo.Point(x1, rect.top + 0.5 * rect.height), ifmt);
                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        area.tag = new _DataPoint(si, i, sum + datay, datax);
                        this.hitTester.add(area, si);
                    }
                    else {
                        var y0 = datax - 0.5 * cw + iser * w,
                            y1 = datax - 0.5 * cw + (iser + 1) * w;

                        if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                            continue;
                        }
                        y0 = ay.convert(Math.max(y0, ymin));
                        y1 = ay.convert(Math.min(y1, ymax));
                        let x = ax.convert(datay);

                        if (!_DataInfo.isValid(x, y0, y1)) {
                            continue;
                        }

                        let rect = new wijmo.Rect(Math.min(x, oriScreen), Math.min(y0, y1), Math.abs(oriScreen - x), Math.abs(y1 - y0));

                        if (customRender) {
                            points.push(new wijmo.Point(x, (y0 + y1) / 2));
                        }
                        if (wpx > 0) {
                            var sw = wpx / nser;
                            var ratio = 1 - sw / rect.height;
                            if (ratio < 0) {
                                ratio = 0;
                            }
                            var yc = ay.convert(datax);
                            rect.top += (yc - rect.top) * ratio;
                            rect.height = Math.min(sw, rect.height);
                        }

                        var area = new _RectArea(rect);
                        this.drawSymbol(engine, rect, series, i, new wijmo.Point(x, rect.top + 0.5 * rect.height), ifmt);
                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        area.tag = new _DataPoint(si, i, datay, datax);
                        this.hitTester.add(area, si);
                    }
                } else if (customRender) {
                    points.push(null);
                }
            }
        }
        if (customRender && points && points.length) {
            customRender(points);
        }
    }

    private drawSymbol(engine: IRenderEngine, rect: wijmo.Rect, series: _ISeries, pointIndex: number, point: wijmo.Point, ifmt: Function) {
        if (ifmt) {
            engine.startGroup();
            var hti: HitTestInfo = new HitTestInfo(this.chart, point, ChartElement.SeriesSymbol);
            hti._setData(<Series>series, pointIndex);

            ifmt(engine, hti, () => {
                this.drawDefaultSymbol(engine, rect, series);
            });
            engine.cssPriority = true;
            engine.endGroup();
        }
        else {
            this.drawDefaultSymbol(engine, rect, series);
        }
    }

    private drawDefaultSymbol(engine: IRenderEngine, rect: wijmo.Rect, series: _ISeries) {
        engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
    }
}
    }
    


    module wijmo.chart {
    












'use strict';

/**
 * Funnel chart plotter.
 */
export class _FunnelPlotter extends _BasePlotter implements _IPlotter {

    _getSymbolOrigin: Function;
    _getSymbolStyles: Function;
    stacking = Stacking.None;
    rotated: boolean;

    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;
        var xmin = dataInfo.getMinX();
        var ymin = dataInfo.getMinY();
        var xmax = dataInfo.getMaxX();
        var ymax = dataInfo.getMaxY();

        return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
    }

    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        var si = this.chart.series.indexOf(series);

        if (si > 0) {
            //Only support one series for Funnel in current version.
            return;
        }
        var ser: SeriesBase = wijmo.asType(series, SeriesBase),
            options = this.chart._options,
            yvals = series.getValues(0),
            xvals = series.getValues(1),
            rect = this.chart._plotRect,
            neckWidth = (options && options.funnel && options.funnel.neckWidth != null) ? options.funnel.neckWidth : 0.2,
            neckHeight = (options && options.funnel && options.funnel.neckHeight != null) ? options.funnel.neckHeight : 0,
            neckAbsWidth = neckWidth * rect.width,
            i = 0, sum = 0, neckX = 0, neckY = 0, areas, angle, offsetX, offsetY, h,
            x = rect.left, y = rect.top, width = rect.width, height = rect.height;

        if (!yvals) {
            return;
        }

        if (this.rotated) {
            y += rect.height;
        }
        neckAbsWidth = neckAbsWidth ? neckAbsWidth : 1;
        if (!xvals) {
            xvals = this.dataInfo.getXVals();
        }

        var len = yvals.length;
        if (xvals != null) {
            len = Math.min(len, xvals.length);
        }
        for (i = 0; i < len; i++) {
            if(_DataInfo.isValid(yvals[i])) {
                sum += yvals[i];
            }
        }

        var itemIndex = 0,
            currentFill: string,
            currentStroke: string;

        if (options && options.funnel && options.funnel.type === 'rectangle') {
            neckHeight = height / len;
            neckWidth = width;
            var ratio;
            for (i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i;
                var datay = yvals[i];
                var ht;

                // set series fill and stroke from style
                var fill = ser._getSymbolFill(i),
                    altFill = ser._getAltSymbolFill(i) || fill,
                    stroke = ser._getSymbolStroke(i),
                    altStroke = ser._getAltSymbolStroke(i) || stroke;

                if (this._getSymbolStyles) {
                    var style = this._getSymbolStyles(i, len);
                    fill = style && style.fill ? style.fill : fill;
                    altFill = style && style.fill ? style.fill : altFill;
                    stroke = style && style.stroke ? style.stroke : stroke;
                    altStroke = style && style.stroke ? style.stroke : altStroke;
                }
                // apply fill and stroke
                currentFill = datay > 0 ? fill : altFill;
                currentStroke = datay > 0 ? stroke : altStroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;
                if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                    if (!ratio) {
                        ratio = width / datay;
                    }
                    var w = ratio * datay;
                    x = x + (neckWidth - w) / 2;

                    if (this.rotated) {
                        y -= neckHeight;
                    }
                    engine.drawRect(x, y, w, neckHeight);
                    ht = new _FunnelSegment(new wijmo.Point(x, y), w, neckHeight, w, neckHeight);

                    if (!this.rotated) {
                        y = y + neckHeight;
                    }
                    neckWidth = w;
                    ht.tag = new _DataPoint(si, i, datax, datay);
                    this.hitTester.add(ht, si);

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        } else {
            neckX = rect.left + rect.width * (1 - neckWidth) / 2;
            neckY = rect.top + rect.height * (this.rotated ? neckHeight : 1 - neckHeight);
            angle = (1 - neckWidth) * rect.width / 2 / (rect.height * (1 - neckHeight));
            if (isNaN(angle) || !isFinite(angle)) {
                width = neckAbsWidth;
                x = neckX;
                y = neckY;
            }
            areas = rect.width * neckWidth * rect.height + rect.width * (1 - neckWidth) / 2 * rect.height * (1 - neckHeight);
            for (i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i;
                var datay = yvals[i];
                var xs = [], ys = [];
                var ht;
                // set series fill and stroke from style
                var fill = ser._getSymbolFill(i),
                    altFill = ser._getAltSymbolFill(i) || fill,
                    stroke = ser._getSymbolStroke(i),
                    altStroke = ser._getAltSymbolStroke(i) || stroke;

                if (this._getSymbolStyles) {
                    var style = this._getSymbolStyles(i, len);
                    fill = style && style.fill ? style.fill : fill;
                    altFill = style && style.fill ? style.fill : altFill;
                    stroke = style && style.stroke ? style.stroke : stroke;
                    altStroke = style && style.stroke ? style.stroke : altStroke;
                }
                // apply fill and stroke
                currentFill = datay > 0 ? fill : altFill;
                currentStroke = datay > 0 ? stroke : altStroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;
                if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                    var area = areas * datay / sum;
                    if (width > neckAbsWidth) {
                        offsetY = this._getTrapezoidOffsetY(width, area, angle);
                        if (this.rotated) {
                            if ((y - offsetY) > neckY) {
                                offsetX = angle * offsetY;
                                xs = [x, x + offsetX, x + width - offsetX, x + width];
                                ys = [y, y - offsetY, y - offsetY, y];

                                ht = new _FunnelSegment(new wijmo.Point(x, y - offsetY), width, offsetY, width - offsetX * 2, 0, true);
                                width = width - 2 * offsetX;
                                x = x + offsetX;
                                y = y - offsetY;
                            } else {
                                offsetY = y - neckY;
                                offsetX = angle * offsetY;
                                area = area - this._getTrapezoidArea(width, angle, offsetY);

                                h = area / neckAbsWidth;
                                xs.push(x, x + offsetX, x + offsetX, x + offsetX + neckAbsWidth, x + offsetX + neckAbsWidth, x + width);
                                ys.push(y, y - offsetY, y - offsetY - h, y - offsetY - h, y - offsetY, y);

                                ht = new _FunnelSegment(new wijmo.Point(x, y - offsetY - h), width, offsetY + h, neckAbsWidth, h, true);
                                width = neckAbsWidth;
                                x = x + offsetX;
                                y = y - offsetY - h;
                            }
                        } else {
                            if ((y + offsetY) < neckY) {
                                offsetX = angle * offsetY;
                                xs = [x, x + offsetX, x + width - offsetX, x + width];
                                ys = [y, y + offsetY, y + offsetY, y];

                                ht = new _FunnelSegment(new wijmo.Point(x, y), width, offsetY, width - offsetX * 2, 0);
                                width = width - 2 * offsetX;
                                x = x + offsetX;
                                y = y + offsetY;
                            } else {
                                offsetY = neckY - y;
                                offsetX = angle * offsetY;
                                area = area - this._getTrapezoidArea(width, angle, offsetY);

                                h = area / neckAbsWidth;
                                xs.push(x, x + offsetX, x + offsetX, x + offsetX + neckAbsWidth, x + offsetX + neckAbsWidth, x + width);
                                ys.push(y, y + offsetY, y + offsetY + h, y + offsetY + h, y + offsetY, y);

                                ht = new _FunnelSegment(new wijmo.Point(x, y), width, offsetY + h, neckAbsWidth, h);
                                width = neckAbsWidth;
                                x = x + offsetX;
                                y = y + offsetY + h;
                            }
                        }
                        engine.drawPolygon(xs, ys);
                    } else {
                        h = area / neckAbsWidth;
                        if (this.rotated) {
                            y -= h;
                        }
                        engine.drawRect(x, y, width, h);

                        ht = new _FunnelSegment(new wijmo.Point(x, y), neckAbsWidth, h, neckAbsWidth, h);
                        if (!this.rotated) {
                            y += h;
                        }
                    }

                    ht.tag = new _DataPoint(si, i, datax, datay);
                    this.hitTester.add(ht, si);

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }
    }

    private _getTrapezoidArea(width, angle, height) {
        var offsetX = height * angle;
        return offsetX * height + (width - 2 * offsetX) * height;
    }

    private _getTrapezoidOffsetY(width, area, angle) {
        var val = Math.pow(width / 2 / angle, 2) - area / angle;
        var offsetY = width / 2 / angle - Math.sqrt(val >= 0 ? val : 0);
        return offsetY;
    }

    /*private drawSymbol(engine: IRenderEngine, rect: Rect, series: _ISeries, pointIndex: number, point: Point) {
        if (this.chart.itemFormatter) {
            engine.startGroup();
            var hti: HitTestInfo = new HitTestInfo(this.chart, point, ChartElement.SeriesSymbol);
            hti._setData(<Series>series, pointIndex);

            this.chart.itemFormatter(engine, hti, () => {
                this.drawDefaultSymbol(engine, rect, series);
            });
            engine.endGroup();
        }
        else {
            this.drawDefaultSymbol(engine, rect, series);
        }
    }*/

    private drawDefaultSymbol(engine: IRenderEngine, rect: wijmo.Rect, series: _ISeries) {
        engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle/* ,'plotRect'*/);
    }

    _getPointAndPosition(pt: wijmo.Point, pos: LabelPosition, map: _IHitArea, chart: FlexChartCore) {
        var fs = <_FunnelSegment>map;
        pt.x = fs.center.x;
        pt.y = fs.center.y;
        pos = pos == null ? LabelPosition.Center : pos;
    }
}

export class _FunnelSegment implements _IHitArea {
    private _center: wijmo.Point;
    private _startPoint: wijmo.Point;
    private _width: number;
    private _height: number;
    private _neckWidth: number;
    private _neckHeight: number;
    private _offsetX: number;
    private _offsetY: number;
    private _rotated: boolean;

    constructor(startPoint: wijmo.Point, width: number, height: number, neckWidth: number, neckHeight: number, rotated = false) {
        this._startPoint = startPoint;
        this._width = width;
        this._height = height;
        this._neckWidth = neckWidth;
        this._neckHeight = neckHeight;
        this._center = new wijmo.Point(this._startPoint.x + width / 2, this._startPoint.y + height / 2);
        this._offsetX = (width - neckWidth) / 2;
        this._offsetY = (height - neckHeight);
        this._rotated = rotated;
    }

    contains(pt: wijmo.Point): boolean {
        var sp = this._startPoint,
            ox = this._offsetX,
            oy = this._offsetY;

        if (this._rotated) {
            if (pt.x >= sp.x && pt.x <= sp.x + this._width && pt.y >= sp.y && pt.y <= sp.y + this._height) {
                if (pt.x >= sp.x + ox && pt.x <= sp.x + this._width - ox) {
                    return true;
                } else if (pt.y < sp.y + this._neckHeight) {
                    return false;
                } else if (pt.x < this._center.x) {
                    return (sp.y + this._height - pt.y) / (pt.x - sp.x) < oy / ox;
                } else if (pt.x > this._center.x) {
                    return (sp.y + this._height - pt.y) / (sp.x + this._width - pt.x) < oy / ox;
                }
            }
        } else {
            if (pt.x >= sp.x && pt.x <= sp.x + this._width && pt.y >= sp.y && pt.y <= sp.y + this._height) {
                if (pt.x >= sp.x + ox && pt.x <= sp.x + this._width - ox) {
                    return true;
                } else if (pt.y > sp.y + oy) {
                    return false;
                } else if (pt.x < this._center.x) {
                    return (pt.y - sp.y) / (pt.x - sp.x) < oy / ox;
                } else if (pt.x > this._center.x) {
                    return (pt.y - sp.y) / (sp.x + this._width - pt.x) < oy / ox;
                }
            }
        }
        return false;
    }

    distance(pt: wijmo.Point): number {
        if (this.contains(pt)) {
            return 0;
        }

        var sp = this._startPoint,
            w = this._width,
            h = this._height,
            ox = this._offsetX,
            oy = this._offsetY;

        if (this._rotated) {
            if (pt.y > sp.y + h) {
                if (pt.x < sp.x) {
                    return Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(sp.y + h - pt.y, 2));
                } else if (pt.x > sp.x + w) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w, 2) + Math.pow(sp.y + h - pt.y, 2));
                } else {
                    return pt.y - sp.y - h;
                }
            } else if (pt.y < sp.y) {
                if (pt.x < sp.x + ox) {
                    return Math.sqrt(Math.pow(sp.x + ox - pt.x, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else if (pt.x > sp.x + w - ox) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w + ox, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else {
                    return sp.y - pt.y;
                }
            } else if (pt.y < sp.y + h - oy) {
                if (pt.x < sp.x + ox) {
                    return sp.x + ox - pt.x;
                } else if (pt.x > sp.x + w - ox) {
                    return pt.x - sp.x - w + ox;
                }
            } else {
                if (pt.x < sp.x + ox) {
                    return Math.min(Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(pt.y - sp.y - h, 2)),
                        Math.sqrt(Math.pow(pt.x - ox / 2 - sp.x, 2) + Math.pow(pt.y - h + oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - ox - sp.x, 2) + Math.pow(pt.y - h + oy - sp.y, 2)));
                } else {
                    return Math.min(Math.sqrt(Math.pow(pt.x - w - sp.x, 2) + Math.pow(pt.y - h - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - w + ox / 2 - sp.x, 2) + Math.pow(pt.y - h + oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - w + ox - sp.x, 2) + Math.pow(pt.y - h + oy - sp.y, 2)));
                }
            }
        } else {
            if (pt.y < sp.y) {
                if (pt.x < sp.x) {
                    return Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(sp.y - pt.y, 2));
                } else if (pt.x > sp.x + w) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w, 2) + Math.pow(sp.y - pt.y, 2));
                } else {
                    return sp.y - pt.y;
                }
            } else if (pt.y > sp.y + h) {
                if (pt.x < sp.x + ox) {
                    return Math.sqrt(Math.pow(sp.x + ox - pt.x, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else if (pt.x > sp.x + w - ox) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w + ox, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else {
                    return pt.y - sp.y - h;
                }
            } else if (pt.y > sp.y + oy) {
                if (pt.x < sp.x + ox) {
                    return sp.x + ox - pt.x;
                } else if (pt.x > sp.x + w - ox) {
                    return pt.x - sp.x - w + ox;
                }
            } else {
                if (pt.x < sp.x + ox) {
                    return Math.min(Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(pt.y - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - ox / 2 - sp.x, 2) + Math.pow(pt.y - oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - ox - sp.x, 2) + Math.pow(pt.y - oy - sp.y, 2)));
                } else {
                    return Math.min(Math.sqrt(Math.pow(pt.x - w - sp.x, 2) + Math.pow(pt.y - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - w + ox / 2 - sp.x, 2) + Math.pow(pt.y - oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x - w + ox - sp.x, 2) + Math.pow(pt.y - oy - sp.y, 2)));
                }
            }
        }

        return undefined;
    }

    get center(): wijmo.Point {
        return this._center;
    }

    tag: any;

    ignoreLabel: boolean;
}
    }
    


    module wijmo.chart {
    











'use strict';

export class _FinancePlotter extends _BasePlotter {
    isCandle: boolean = true;
    isArms = false;
    isEqui = false;
    isVolume = false;
    symbolWidth: any; // '100%' or '10'(pixels)

    private _volHelper: _VolumeHelper = null;
    private _itemsSource: any[];
    private _symWidth = 0.7;
    private _isPixel;

    clear(): void {
        super.clear();
        this._volHelper = null;
    }

    load(): void {
        super.load();
        if (!this.isVolume) { return; }

        var series: SeriesBase,
            ax: Axis, ct: ChartType,
            vols: number[],
            dt: wijmo.DataType, i: number,
            xvals: number[],
            itemsSource: any[],
            xmin: number = null,
            xmax: number = null;

        // loop through series collection
        for (i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            dt = series.getDataType(1) || series.chart._xDataType;
            ax = series._getAxisX();

            // get volume data based on chart type
            ct = series._getChartType();
            ct = ct === null || wijmo.isUndefined(ct) ? this.chart._getChartType() : ct;
            if (ct === ChartType.Column) {
                vols = series._getBindingValues(1);
            } else if (ct === ChartType.Candlestick) {
                vols = series._getBindingValues(4);
            } else {
                vols = null;
            }

            // get x values directly for dates, otherwise get from dataInfo
            if (dt === wijmo.DataType.Date) {
                var date;
                xvals = [];
                itemsSource = [];
                for (i = 0; i < series._getLength(); i++) {
                    date = series._getItem(i)[series.bindingX].valueOf();
                    xvals.push(date);
                    itemsSource.push({
                        value: date,
                        text: wijmo.Globalize.format(new Date(date), ax.format || "d")
                    });
                }
            } else {
                xvals = this.dataInfo.getXVals();
            }

            xmin = this.dataInfo.getMinX();
            xmax = this.dataInfo.getMaxX();

            if (vols && vols.length > 0) {
                this._volHelper = new _VolumeHelper(vols, xvals, xmin, xmax, dt);
                ax._customConvert = this._volHelper.convert.bind(this._volHelper);
                ax._customConvertBack = this._volHelper.convertBack.bind(this._volHelper);

                if (itemsSource && itemsSource.length > 0) {
                    this._itemsSource = ax.itemsSource = itemsSource;
                }
                break;  // only one set of volume data is supported per chart
            }
        }
    }

    unload(): void {
        super.unload();
        var series: SeriesBase,
            ax: Axis;

        for (var i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            ax = series._getAxisX();
            if (ax) {
                ax._customConvert = null;
                ax._customConvertBack = null;
                if (ax.itemsSource && ax.itemsSource == this._itemsSource) {
                    this._itemsSource = ax.itemsSource = null;
                }
            }
        }
    }

    parseSymbolWidth(val: any) {
        this._isPixel = undefined;
        if (val) {
            if (wijmo.isNumber(val)) {
                // px
                var wpix = wijmo.asNumber(val);
                if (isFinite(wpix) && wpix > 0) {
                    this._symWidth = wpix; this._isPixel = true;
                }
            } else if (wijmo.isString(val)) {
                var ws = wijmo.asString(val);

                // %
                if (ws && ws.indexOf('%') >= 0) {
                    ws = ws.replace('%', '');
                    var wn = parseFloat(ws);
                    if (isFinite(wn)) {
                        if (wn < 0) {
                            wn = 0;
                        } else if (wn > 100) {
                            wn = 100;
                        }
                        this._symWidth = wn / 100; this._isPixel = false;
                    }
                } else {
                    // px
                    var wn = parseFloat(val);
                    if (isFinite(wn) && wn > 0) {
                        this._symWidth = wn; this._isPixel = true;
                    }
                }
            }
        }
    }

    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;
        var xmin = dataInfo.getMinX();
        var ymin = dataInfo.getMinY();
        var xmax = dataInfo.getMaxX();
        var ymax = dataInfo.getMaxY();
        var dx = dataInfo.getDeltaX();
        var dt = this.chart._xDataType;
        if (dx <= 0) {
            dx = 1;
        }

        var series = this.chart.series;
        var len = series.length;

        var swmax = 0;

        this.parseSymbolWidth(this.symbolWidth);

        // init/cleanup volume conversions for x-axis based on ChartType/FinancialChartType mappings
        if (this.isVolume && (this.chart._getChartType() === ChartType.Column || this.chart._getChartType() === ChartType.Candlestick)) {
            this.load();
        } else {
            this.unload();
        }

        for (var i = 0; i < len; i++) {
            var ser = <SeriesBase>series[i];
            if (ser._isCustomAxisY()) {
                continue;
            }

            var bndLow = ser._getBinding(1),
                bndOpen = ser._getBinding(2),
                bndClose = ser._getBinding(3);

            var slen = ser._getLength();
            if (slen) {

                var sw = ser._getSymbolSize();
                if (sw > swmax) {
                    swmax = sw;
                }

                for (var j = 0; j < slen; j++) {
                    var item = ser._getItem(j);
                    if (item) {
                        var yvals = [bndLow ? item[bndLow] : null,
                            bndOpen ? item[bndOpen] : null,
                            bndClose ? item[bndClose] : null];

                        yvals.forEach((yval) => {
                            if (_DataInfo.isValid(yval) && yval !== null) {
                                if (isNaN(ymin) || yval < ymin) {
                                    ymin = yval;
                                }
                                if (isNaN(ymax) || yval > ymax) {
                                    ymax = yval;
                                }
                            }
                        });
                    }
                }
            }
        }

        // adjust limits according to symbol size unless volume-based
        var xrng = xmax - xmin;
        var pr = this.chart._plotRect;
        if (pr && pr.width && !this.isVolume) {
            if (isNaN(sw)) {
                sw = ser._getSymbolSize();
            }
            sw += 2;
            var xrng1 = pr.width / (pr.width - sw) * xrng;
            xmin = xmin - 0.5 * (xrng1 - xrng);
            xrng = xrng1;
        }

        if (((dt === wijmo.DataType.Date && this.isVolume) || dt === wijmo.DataType.Number) && (this.chart._getChartType() === ChartType.Column || this.chart._getChartType() === ChartType.Candlestick)) {
            return new wijmo.Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
        } else {
            return this.chart._isRotated()? new wijmo.Rect(ymin, xmin, ymax - ymin, xrng) : new wijmo.Rect(xmin, ymin, xrng, ymax - ymin);
        }
    }

    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        var ser: SeriesBase = wijmo.asType(series, SeriesBase);
        var si = this.chart.series.indexOf(series);

        var highs = series.getValues(0);
        var xs = series.getValues(1);
        var sw = this._symWidth,
            rotated = this.chart._isRotated();

        if (!highs) {
            return;
        }

        if (!xs) {
            xs = this.dataInfo.getXVals();
        }

        if (xs) {
            // find minimal distance between point and use it as column width
            var delta = this.dataInfo.getDeltaX();
            if (delta > 0 && this._isPixel === false) {
                sw *= delta;
            }
        }

        var len = highs.length;
        var hasXs = true;
        if (!xs) {
            hasXs = false;
            xs = new Array<number>(len);
        } else {
            len = Math.min(len, xs.length);
        }

        var swidth = this._DEFAULT_WIDTH,
            fill = ser._getSymbolFill(si),
            altFill = ser._getAltSymbolFill(si) || "transparent",
            stroke = ser._getSymbolStroke(si),
            altStroke = ser._getAltSymbolStroke(si) || stroke,
            symSize = this._isPixel === undefined ? ser._getSymbolSize() : sw;

        engine.stroke = stroke;
        engine.strokeWidth = swidth;
        engine.fill = fill;

        var bndLow = ser._getBinding(1);
        var bndOpen = ser._getBinding(2);
        var bndClose = ser._getBinding(3);

        var xmin = rotated ? ay.actualMin : ax.actualMin,
            xmax = rotated ? ay.actualMax : ax.actualMax;

        var itemIndex = 0,
            currentFill: string,
            currentStroke: string,
            item = null,
            prevItem = null;

        let ifmt = this.getItemFormatter(series);

        for (var i = 0; i < len; i++) {
            item = ser._getItem(i);
            if (item) {
                var x = hasXs ? xs[i] : i;

                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    var hi = highs[i];
                    var lo = bndLow ? item[bndLow] : null;
                    var open = bndOpen ? item[bndOpen] : null;
                    var close = bndClose ? item[bndClose] : null;

                    engine.startGroup();

                    if (this.isEqui && prevItem !== null) {
                        // if price is the same as previous, use previous color for now - possibly introduce a neutral color
                        if (prevItem[bndClose] !== item[bndClose]) {
                            currentFill = prevItem[bndClose] < item[bndClose] ? altFill : fill;
                            currentStroke = prevItem[bndClose] < item[bndClose] ? altStroke : stroke;
                        }
                    } else {
                        currentFill = open < close ? altFill : fill;
                        currentStroke = open < close ? altStroke : stroke;
                    }
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;
                    engine.strokeWidth = swidth;

                    if (ifmt) {
                        var hti: HitTestInfo = new HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)), ChartElement.SeriesSymbol);
                        hti._setData( ser, i);

                        ifmt(engine, hti, () => {
                            this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                        });
                        engine.cssPriority = true;
                    } else {
                        this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                    }

                    engine.endGroup();

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
                prevItem = item;
            }
        }
    }

    _drawSymbol(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, si: number, pi: number, fill: any, w: number,
        x: number, hi: number, lo: number, open: number, close: number) {
        var area: _RectArea;
        var y0 = null, y1 = null,
            x1 = null, x2 = null,
            rotated = this.chart._isRotated();
        var dpt = rotated ? new _DataPoint(si, pi, hi, x) : new _DataPoint(si, pi, x, hi);

        if (rotated) {
            var axtmp = ay; ay = ax; ax = axtmp;
        }

        if (this._isPixel === false) {
            x1 = ax.convert(x - 0.5 * w);
            x2 = ax.convert(x + 0.5 * w);
            if (x1 > x2) {
                var tmp = x1; x1 = x2; x2 = tmp;
            }
        }
        x = ax.convert(x);

        if (this._isPixel !== false) {
            x1 = x - 0.5 * w;
            x2 = x + 0.5 * w;
        }

        if (this.isCandle) {
            if (_DataInfo.isValid(open) && _DataInfo.isValid(close)) {
                open = ay.convert(open);
                close = ay.convert(close);
                y0 = Math.min(open, close);
                y1 = y0 + Math.abs(open - close);

                if (rotated) {
                    engine.drawRect(y0, x1, y1 - y0 || 1, x2 - x1 || 1);
                    area = new _RectArea(new wijmo.Rect(y0, x1, y1 - y0 || 1, x2 - x1 || 1));
                } else {
                    engine.drawRect(x1, y0, x2 - x1 || 1, y1 - y0 || 1);
                    area = new _RectArea(new wijmo.Rect(x1, y0, x2 - x1 || 1, y1 - y0 || 1));
                }
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
            if (_DataInfo.isValid(hi)) {
                hi = ay.convert(hi);
                if (y0 !== null) {
                    if (rotated) {
                        engine.drawLine(y1, x, hi, x);
                        area.rect.width = area.rect.width + hi;
                    } else {
                        engine.drawLine(x, y0, x, hi);
                        area.rect.top = hi;
                        area.rect.height = area.rect.height + hi;
                    }
                }
            }
            if (_DataInfo.isValid(lo)) {
                lo = ay.convert(lo);
                if (y1 !== null) {
                    if (rotated) {
                        engine.drawLine(y0, x, lo, x);
                        area.rect.left = lo;
                        area.rect.width = area.rect.width + lo;
                    } else {
                        engine.drawLine(x, y1, x, lo);
                        area.rect.height = area.rect.height + lo;
                    }
                }
            }
        } else if (this.isEqui) {
            if (_DataInfo.isValid(hi) && _DataInfo.isValid(lo)) {
                hi = ay.convert(hi);
                lo = ay.convert(lo);
                y0 = Math.min(hi, lo);
                y1 = y0 + Math.abs(hi - lo);

                engine.drawRect(x1, y0, x2 - x1 || 1, y1 - y0 || 1);

                area = new _RectArea(new wijmo.Rect(x1, y0, x2 - x1 || 1, y1 - y0 || 1));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
        } else if (this.isArms) {
            // inner box
            if (_DataInfo.isValid(open) && _DataInfo.isValid(close)) {
                open = ay.convert(open);
                close = ay.convert(close);

                y0 = Math.min(open, close);
                y1 = y0 + Math.abs(open - close);

                engine.drawRect(x1, y0, x2 - x1 || 1, y1 - y0 || 1);
            }

            // high line
            if (_DataInfo.isValid(hi) && y0 !== null) {
                hi = ay.convert(hi);
                engine.drawLine(x, y0, x, hi);
            }

            // low line
            if (_DataInfo.isValid(lo) && y1 !== null) {
                lo = ay.convert(lo);
                engine.drawLine(x, y1, x, lo);
            }

            // outer box
            if (_DataInfo.isValid(hi) && _DataInfo.isValid(lo)) {
                engine.fill = "transparent";
                y0 = Math.min(hi, lo);
                y1 = y0 + Math.abs(hi - lo);

                engine.drawRect(x1, y0, x2 - x1 || 1, y1 - y0 || 1);

                area = new _RectArea(new wijmo.Rect(x1, y0, x2 - x1 || 1, y1 - y0 || 1));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
        } else {
            if (_DataInfo.isValid(hi) && _DataInfo.isValid(lo)) {
                hi = ay.convert(hi);
                lo = ay.convert(lo);
                y0 = Math.min(hi, lo);
                y1 = y0 + Math.abs(hi - lo);

                if (rotated) {
                    engine.drawLine(lo, x, hi, x);
                    area = new _RectArea(new wijmo.Rect(y0, x1, y1 - y0 || 1, x2 - x1 || 1));
                } else {
                    engine.drawLine(x, lo, x, hi);
                    area = new _RectArea(new wijmo.Rect(x1, y0, x2 - x1 || 1, y1 - y0 || 1));
                }
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
            if (_DataInfo.isValid(open)) {
                open = ay.convert(open);
                if (rotated) {
                    engine.drawLine(open, x1, open, x);
                } else {
                    engine.drawLine(x1, open, x, open);
                }
            }
            if (_DataInfo.isValid(close)) {
                close = ay.convert(close);
                if (rotated) {
                    engine.drawLine(close, x, close, x2);
                } else {
                    engine.drawLine(x, close, x2, close);
                }
            }
        }
    }
}
    }
    


    module wijmo.chart {
    






'use strict';

class LineMarkers {
    private _markers;
    private _bindMoveMarker;

    constructor() {
        this._markers = [];
        this._bindMoveMarker = this._moveMarker.bind(this);
    }

    attach(marker: LineMarker) {
        var hostEle = marker.chart.hostElement,
            markers = this._markers,
            markerIndex = hostEle.getAttribute('data-markerIndex'),
            len, arr;
        if (markerIndex != null)  {
            arr = markers[markerIndex];
            if (arr && wijmo.isArray(arr)) {
                arr.push(marker);
            } else {
                markers[markerIndex] = [marker];
                this._bindMoveEvent(hostEle);
            }
        } else {
            len = markers.length,
            arr = [marker];
            markers.push(arr);
            hostEle.setAttribute('data-markerIndex', len);
            this._bindMoveEvent(hostEle);
        }
    }

    detach(marker: LineMarker) {
        var hostEle = marker.chart.hostElement,
            markers = this._markers,
            markerIndex = hostEle.getAttribute('data-markerIndex'),
            idx, arr: LineMarker[];

        if (markerIndex != null) {
            arr = <LineMarker[]>markers[markerIndex];
            idx = arr.indexOf(marker);
            if (idx > -1) {
                arr.splice(idx, 1);
            }
            if (arr.length === 0) {
                idx = markers.indexOf(arr);
                if (idx > -1) {
                    markers[idx] = undefined;
                }
                this._unbindMoveEvent(hostEle);
            }
        }
    }

    _moveMarker = function (e) {
        var dom = e.currentTarget,
            markers = this._markers,
            markerIndex = dom.getAttribute('data-markerIndex'),
            arr;

        if (markerIndex != null) {
            arr = markers[markerIndex];
            arr.forEach(function (marker) {
                marker._moveMarker(e);
            });
        }
    }

    _unbindMoveEvent(ele: Element) {
        var _moveMarker = this._bindMoveMarker;

        ele.removeEventListener('mousemove', _moveMarker);
        if ('ontouchstart' in window) {
            ele.removeEventListener('touchmove', _moveMarker);
        }
    }

    _bindMoveEvent(ele: Element) {
        var _moveMarker = this._bindMoveMarker;

        ele.addEventListener('mousemove', _moveMarker);
        if ('ontouchstart' in window) {
            ele.addEventListener('touchmove', _moveMarker);
        }
    }
}

var lineMarkers = new LineMarkers();

/**
 * Specifies the direction of the lines shown by the {@link LineMarker}.
 */
export enum LineMarkerLines {
    /** No lines. */
    None,
    /** Vertical line. */
    Vertical,
    /** Horizontal line. */
    Horizontal,
    /** Vertical and horizontal lines. */
    Both
}

// TODO: Implement drag interaction.
// Drag 
/**
 * Specifies how the {@link LineMarker} interacts with the user.
 */
export enum LineMarkerInteraction {
    /** No interaction, the user specifies the position by clicking. */
    None,
    /** The {@link LineMarker} moves with the pointer. */
    Move,
    /** The {@link LineMarker} moves when the user drags the lines. */
    Drag
}

//Binary
//Right 0 -> 0, Left 1 -> 1, Bottom 4 -> 100, Top 6 -> 110
/**
 * Specifies the alignment of the {@link LineMarker}.
 */
export enum LineMarkerAlignment {
    /** 
     * The LineMarker alignment adjusts automatically so that it stays
     * within the boundaries of the plot area. */
    Auto = 2,
    /** The LineMarker aligns to the right of the pointer. */
    Right = 0,
    /** The LineMarker aligns to the left of the pointer. */
    Left = 1,
    /** The LineMarker aligns to the bottom of the pointer. */
    Bottom = 4,
    /** The LineMarker aligns to the top of the pointer. */
    Top = 6
}

/**
 * Represents an extension of the LineMarker for the FlexChart.
 *
 * The {@link LineMarker} consists of a text area with content reflecting
 * data point values, and optional vertical or horizontal lines
 * (or both for a cross-hair effect) positioned over the plot area.
 *
 * It can be static (interaction = None), follow the mouse or touch
 * position (interaction = Move), or move when the user drags the
 * line (interaction = Drag).
 *
 * For example:
 * <pre>
 *   // create an interactive marker with a horizontal line and y-value
 *   var lm = new LineMarker($scope.ctx.chart, {
 *       lines: LineMarkerLines.Horizontal,
 *       interaction: LineMarkerInteraction.Move,
 *       alignment : LineMarkerAlignment.Top
 *   });
 *   lm.content = function (ht) {
 *       // show y-value
 *       return lm.y.toFixed(2);
 *   }
 * </pre>
 */
export class LineMarker {

    static _CSS_MARKER = 'wj-chart-linemarker';
    static _CSS_MARKER_HLINE = 'wj-chart-linemarker-hline';
    static _CSS_MARKER_VLINE = 'wj-chart-linemarker-vline';
    static _CSS_MARKER_CONTENT = 'wj-chart-linemarker-content';
    static _CSS_MARKER_CONTAINER = 'wj-chart-linemarker-container';
    static _CSS_LINE_DRAGGABLE = 'wj-chart-linemarker-draggable';
    static _CSS_TOUCH_DISABLED = 'wj-flexchart-touch-disabled';

    private _chart: FlexChartCore;
    private _plot: SVGGElement;
    private _marker: HTMLElement;
    private _markerContainer: HTMLElement;
    private _markerContent: HTMLElement;
    private _dragEle: HTMLElement;
    private _hLine: HTMLElement;
    private _vLine: HTMLElement;
    private _plotRect: wijmo.Rect;
    private _targetPoint: wijmo.Point;
    private _wrapperMoveMarker;
    private _capturedEle: HTMLElement;
    private _wrapperMousedown = null;
    private _wrapperMouseup = null;
    private _contentDragStartPoint: wijmo.Point;
    private _mouseDownCrossPoint: wijmo.Point;

    // object model
    private _isVisible: boolean;
    private _horizontalPosition: number;
    private _verticalPosition: number;
    private _alignment: LineMarkerAlignment;
    private _content: Function;
    private _seriesIndex: number;
    private _lines: LineMarkerLines;
    private _interaction: LineMarkerInteraction;
    private _dragThreshold: number;
    private _dragContent: boolean;
    private _dragLines: boolean;

    /**
     * Initializes a new instance of the {@link LineMarker} class.
     * 
     * @param chart The chart on which the LineMarker appears.
     * @param options A JavaScript object containing initialization data for the control.  
     */
    constructor(chart: FlexChartCore, options?) {
        var self = this;

        self._chart = chart;
        chart._markers.push(self);
        chart.rendered.addHandler(self._initialize, self);
        self._resetDefaultValue();
        wijmo.copy(this, options);
        self._initialize();
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets the {@link FlexChart} object that owns the LineMarker.
     */
    get chart(): FlexChartCore {
        return this._chart;
    }

    /**
     * Gets or sets the visibility of the LineMarker.
     */
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(value: boolean) {
        var self = this;

        if (value === self._isVisible) {
            return;
        }
        self._isVisible = wijmo.asBoolean(value);
        if (!self._marker) {
            return;
        }
        self._toggleVisibility();
    }

    /**
     * Gets or sets the index of the series in the chart in which the LineMarker appears.
     * This takes effect when the {@link interaction} property is set to 
     * LineMarkerInteraction.Move or LineMarkerInteraction.Drag.
     */
    get seriesIndex(): number {
        return this._seriesIndex;
    }
    set seriesIndex(value: number) {
        var self = this;

        if (value === self._seriesIndex) {
            return;
        }
        self._seriesIndex = wijmo.asNumber(value, true);
    }

    /**
     * Gets or sets the horizontal position of the LineMarker relative to the plot area. 
     * 
     * Its value range is (0, 1).
     * If the value is null or undefined and {@link interaction} is set to 
     * LineMarkerInteraction.Move or LineMarkerInteraction.Drag, 
     * the horizontal position of the marker is calculated automatically based on the 
     * pointer's position.
     */
    get horizontalPosition(): number {
        return this._horizontalPosition;
    }
    set horizontalPosition(value: number) {
        var self = this;

        if (value === self._horizontalPosition) {
            return;
        }
        self._horizontalPosition = wijmo.asNumber(value, true);
        if (self._horizontalPosition < 0 || self._horizontalPosition > 1) {
            throw 'horizontalPosition\'s value should be in (0, 1).';
        }
        if (!self._marker) {
            return;
        }
        self._updateMarkerPosition();
    }

    /**
     * Gets the current x-value as chart data coordinates.
     */
    get x(): number {
        var self = this,
            len = self._targetPoint.x - self._plotRect.left,
            axis = self._chart.axisX;

        return axis.convertBack(len);
    }

    /**
     * Gets the current y-value as chart data coordinates.
     */
    get y(): number {
        var self = this,
            len = self._targetPoint.y - self._plotRect.top,
            axis = self._chart.axisY;

        return axis.convertBack(len);
    }

    /**
     * Gets or sets the content function that allows you to customize the text content of the LineMarker.
     */
    get content(): Function {
        return this._content;
    }
    set content(value: Function) {
        if (value === this._content) {
            return;
        }
        this._content = wijmo.asFunction(value);
        this._updateMarkerPosition();
    }

    /**
     * Gets or sets the vertical position of the LineMarker relative to the plot area. 
     * 
     * Its value range is (0, 1).
     * If the value is null or undefined and {@link interaction} is set to LineMarkerInteraction.Move 
     * or LineMarkerInteraction.Drag, the vertical position of the LineMarker is calculated automatically based on the pointer's position.
     */
    get verticalPosition(): number {
        return this._verticalPosition;
    }
    set verticalPosition(value: number) {
        var self = this;

        if (value === self._verticalPosition) {
            return;
        }
        self._verticalPosition = wijmo.asNumber(value, true);
        if (self._verticalPosition < 0 || self._verticalPosition > 1) {
            throw 'verticalPosition\'s value should be in (0, 1).';
        }
        if (!self._marker) {
            return;
        }
        self._updateMarkerPosition();
    }

    /**
     * Gets or sets the alignment of the LineMarker content.
     * 
     * By default, the LineMarker shows to the right, at the bottom of the target point.
     * Use '|' to combine alignment values.
     * 
     * <pre>
     * // set the alignment to the left.
     * marker.alignment = LineMarkerAlignment.Left;
     * // set the alignment to the left top.
     * marker.alignment = LineMarkerAlignment.Left | LineMarkerAlignment.Top;
     * </pre>
     */
    get alignment(): LineMarkerAlignment {
        return this._alignment;
    }
    set alignment(value: LineMarkerAlignment) {
        var self = this;

        if (value === self._alignment) {
            return;
        }
        self._alignment = value;
        if (!self._marker) {
            return;
        }
        self._updatePositionByAlignment();
    }

    /**
     * Gets or sets the visibility of the LineMarker lines.
     */
    get lines(): LineMarkerLines {
        return this._lines;
    }
    set lines(value: LineMarkerLines) {
        value = wijmo.asEnum(value, LineMarkerLines);
        if (value != this._lines) {
            this._lines = value;
            if (this._marker) {
                this._resetLinesVisibility();
            }
        }
    }

    /**
     * Gets or sets the interaction mode of the LineMarker.
     */
    get interaction(): LineMarkerInteraction {
        return this._interaction;
    }
    set interaction(value: LineMarkerInteraction) {
        value = wijmo.asEnum(value, LineMarkerInteraction);
        if (value != this._interaction) {
            if (this._marker) {
                this._detach();
            }
            this._interaction = value;
            if (this._marker) {
                this._attach();
            }
            this._toggleElesDraggableClass(this._interaction == LineMarkerInteraction.Drag);
        }
    }

    /**
     * Gets or sets the maximum distance from the horizontal or vertical
     * line that the marker can be dragged.
     */
    get dragThreshold(): number {
        return this._dragThreshold;
    }
    set dragThreshold(value: number) {
        if (value != this._dragThreshold) {
            this._dragThreshold = wijmo.asNumber(value);
        }
    }

    /**
     * Gets or sets a value indicating whether the content of the marker
     * is draggable when the interaction mode is "Drag."
     */
    get dragContent(): boolean {
        return this._dragContent;
    }
    set dragContent(value: boolean) {
        var self = this;
        if (value !== self._dragContent) {
            self._dragContent = wijmo.asBoolean(value);
        }
        wijmo.toggleClass(self._dragEle, LineMarker._CSS_LINE_DRAGGABLE,
            self._interaction === LineMarkerInteraction.Drag &&
            self._dragContent &&
            self._lines !== LineMarkerLines.None);
    }

    /**
     * Gets or sets a value indicating whether the lines are linked
     * when the horizontal or vertical line is dragged when the
     * interaction mode is "Drag."
     */
    get dragLines(): boolean {
        return this._dragLines;
    }
    set dragLines(value: boolean) {
        if (value != this._dragLines) {
            this._dragLines = wijmo.asBoolean(value);
        }
    }

    /**
     * Occurs after the {@link LineMarker}'s position changes.
     */
    readonly positionChanged = new wijmo.Event<LineMarker, wijmo.Point>(); // REVIEW: should be an EventArgs...

    /**
     * Raises the {@link positionChanged} event.
     *
     * @param point The target point at which to show the LineMarker.
     */
    onPositionChanged(point: wijmo.Point) {
        this.positionChanged.raise(this, point);
    }

    //--------------------------------------------------------------------------
    //** implementation

    /**
     * Removes the LineMarker from the chart.
     */
    remove() {
        var self = this,
            chart = self._chart;
        if (self._marker) {
            chart.rendered.removeHandler(self._initialize, self);
            self._detach();
            self._removeMarker();
            self._wrapperMoveMarker = null;
            self._wrapperMousedown = null;
            self._wrapperMouseup = null;
        }
    }

    private _attach() {
        var self = this, hostElement = self._chart.hostElement;
        if (this._interaction !== LineMarkerInteraction.None) {
            wijmo.addClass(hostElement, LineMarker._CSS_TOUCH_DISABLED);
        } else {
            wijmo.removeClass(hostElement, LineMarker._CSS_TOUCH_DISABLED);
        }

        lineMarkers.attach(self);
        self._attachDrag();
    }

    private _attachDrag() {
        var self = this;

        if (self._interaction !== LineMarkerInteraction.Drag) {
            return;
        }

        if (!self._wrapperMousedown) {
            self._wrapperMousedown = self._onMousedown.bind(self);
        }
        if (!self._wrapperMouseup) {
            self._wrapperMouseup = self._onMouseup.bind(self);
        }
        // Drag mode
        self._toggleDragEventAttach(true);
    }

    private _detach() {
        var self = this;
        wijmo.removeClass(self._chart.hostElement, LineMarker._CSS_TOUCH_DISABLED);
        lineMarkers.detach(self);
        self._detachDrag();
    }

    private _detachDrag() {
        var self = this;

        if (self._interaction !== LineMarkerInteraction.Drag) {
            return;
        }

        // Drag mode
        self._toggleDragEventAttach(false);
    }

    private _toggleDragEventAttach(isAttach: boolean) {
        var self = this,
            chartHostEle = self._chart.hostElement,
            eventListener = isAttach ? 'addEventListener' : 'removeEventListener';

        chartHostEle[eventListener]('mousedown', self._wrapperMousedown);
        document[eventListener]('mouseup', self._wrapperMouseup);

        if ('ontouchstart' in window) {
            chartHostEle[eventListener]('touchstart', self._wrapperMousedown);
        }

        if ('ontouchend' in window) {
            document[eventListener]('touchend', self._wrapperMouseup);
        }
    }

    private _onMousedown(e) {
        var self = this, pt = self._getEventPoint(e),
            hRect: wijmo.Rect, vRect: wijmo.Rect, contentRect:wijmo.Rect, isHRectVisible, isVRectVisible;

        if (self._interaction !== LineMarkerInteraction.Drag) {
            return;
        }

        hRect = wijmo.getElementRect(self._hLine);
        isHRectVisible = !(hRect.width === 0 || hRect.height === 0);
        vRect = wijmo.getElementRect(self._vLine);
        isVRectVisible = !(vRect.width === 0 || vRect.height === 0);

        contentRect = wijmo.getElementRect(self._markerContent);

        if (self._dragContent &&
            self._pointInRect(pt, contentRect)) {
            self._capturedEle = self._markerContent;
            self._contentDragStartPoint = new wijmo.Point(pt.x, pt.y);
            self._mouseDownCrossPoint = new wijmo.Point(self._targetPoint.x, self._targetPoint.y);
        } else if (isHRectVisible && ((Math.abs(hRect.top - pt.y) <= self._dragThreshold) ||
            (Math.abs(pt.y - hRect.top - hRect.height) <= self._dragThreshold) ||
            (pt.y >= hRect.top && pt.y <= hRect.top + hRect.height))) {
            self._capturedEle = self._hLine;
            self._contentDragStartPoint = undefined;
            wijmo.addClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
        } else if (isVRectVisible && (Math.abs(vRect.left - pt.x) <= self._dragThreshold ||
            (Math.abs(pt.x - vRect.left - vRect.width) <= self._dragThreshold) ||
            (pt.x >= vRect.left && pt.x <= vRect.left + vRect.width))) {
            self._capturedEle = self._vLine;
            self._contentDragStartPoint = undefined;
            wijmo.addClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
        }

        e.preventDefault();
    }

    private _onMouseup(e) {
        var self = this,
            needReAlignment = self._alignment === LineMarkerAlignment.Auto
            && self._capturedEle === self._markerContent && self._lines !== LineMarkerLines.None;

        self._capturedEle = undefined;
        self._contentDragStartPoint = undefined;
        self._mouseDownCrossPoint = undefined;
        if (needReAlignment) {
            // because the size of content has changed, so need to adjust the position twice.
            self._updatePositionByAlignment();
            self._updatePositionByAlignment();
        }
        wijmo.removeClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
    }

    _moveMarker(e) {
        var self = this,
            chart = self._chart,
            point = self._getEventPoint(e),
            plotRect = self._plotRect,
            isDragAction = self._interaction === LineMarkerInteraction.Drag,
            hLineVisible = self._lines === LineMarkerLines.Horizontal,
            vLineVisible = self._lines === LineMarkerLines.Vertical,
            seriesIndex = self._seriesIndex,
            series: Series,
            offset = wijmo.getElementRect(chart.hostElement),
            hitTest:HitTestInfo, xAxis, yAxis, x, y;

        if (!plotRect) {
            return;
        }

        if (!self._isVisible || self._interaction === LineMarkerInteraction.None ||
            (self._interaction === LineMarkerInteraction.Drag &&
            (!self._capturedEle || self._lines === LineMarkerLines.None))) {
            return;
        }

        if (isDragAction) {
            if (self._contentDragStartPoint) {
                point.x = hLineVisible ? self._targetPoint.x :
                        self._mouseDownCrossPoint.x + point.x - self._contentDragStartPoint.x;
                point.y = vLineVisible ? self._targetPoint.y :
                        self._mouseDownCrossPoint.y + point.y - self._contentDragStartPoint.y;
            } else if (hLineVisible ||
                (!self._dragLines && self._capturedEle === self._hLine)) {
                // horizontal hine dragging
                point.x = self._targetPoint.x;
            } else if (vLineVisible ||
                    (!self._dragLines && self._capturedEle === self._vLine)) {
                // vertical hine dragging
                point.y = self._targetPoint.y;
            }
        }

        if ((isDragAction && self._lines === LineMarkerLines.Horizontal) ||
                (!self._dragLines && self._capturedEle === self._hLine)) {
            if (point.y <= plotRect.top || point.y >= plotRect.top + plotRect.height) {
                return;
            }
        } else if ((isDragAction && self._lines === LineMarkerLines.Vertical) ||
            (!self._dragLines && self._capturedEle === self._vLine)) {
            if (point.x <= plotRect.left || point.x >= plotRect.left + plotRect.width) {
                return;
            }
        } else {
            if (point.x <= plotRect.left || point.y <= plotRect.top
                || point.x >= plotRect.left + plotRect.width
                || point.y >= plotRect.top + plotRect.height) {
                return;
            }
        }

        if (seriesIndex != null && seriesIndex >= 0 && seriesIndex < chart.series.length) {
            series = chart.series[seriesIndex];
            hitTest = series.hitTest(new wijmo.Point(point.x, NaN));
            if (hitTest == null || hitTest.x == null || hitTest.y == null) {
                return;
            }
            xAxis = series.axisX || chart.axisX;
            yAxis = series._getAxisY();
            x = wijmo.isDate(hitTest.x) ? FlexChartCore._toOADate(hitTest.x) : hitTest.x;
            x = wijmo.isString(x) ? hitTest.pointIndex : x;
            y = wijmo.isDate(hitTest.y) ? FlexChartCore._toOADate(hitTest.y) : hitTest.y;
            let paddingLeft = this._getElementPaddingValuee(chart.hostElement, 'padding-left');
            let paddingTop = this._getElementPaddingValuee(chart.hostElement, 'padding-top');
            point.x = xAxis.convert(x) + paddingLeft + offset.left;
            if (this.chart._stacking != Stacking.None) {
                y = this._calcStackedValue(seriesIndex, x, y);
            }
            point.y = yAxis.convert(y) + paddingTop + offset.top;
        }
        self._updateMarkerPosition(point);
        e.preventDefault();
    }

    private _calcStackedValue(seriesIndex: number, x: number, y: number): number {
        let sum = y;
        let isAbs = this.chart._stacking == Stacking.Stacked100pc;
        for (let i = 0; i < seriesIndex; i++) {
            let ser = <_ISeries>this.chart.series[i];
            let xs = ser.getValues(1);
            let ys = ser.getValues(0);
            if (ys) {
                for (let j = 0; j < ys.length; j++) {
                    let xc = xs ? xs[j] : j;
                    if (x === xc) {
                        if (isFinite(ys[j]) && (isAbs || this._sign(y) == this._sign(ys[j]))) {
                            sum += ys[j];
                        }
                        break;
                    }
                }
            }
        }
        if(isAbs && sum) {
            sum = sum / this.chart._dataInfo.getStackedAbsSum(x);
            if(sum > 1) {
                sum = 1;
            }
        }

        return sum;
    }

    private _sign(val:number) : number {
        if(val > 0) {
            return 1;
        } else if(val < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    private _getElementPaddingValuee(ele: Element, key: string) {
        var val = window.getComputedStyle(ele, null).getPropertyValue(key).replace('px', '');
        return +val;
    }

    private _show(ele?: HTMLElement) {
        var e = ele ? ele : this._marker;
        e.style.display = 'block';
    }

    private _hide(ele?: HTMLElement) {
        var e = ele ? ele : this._marker;
        e.style.display = 'none';
    }

    private _toggleVisibility() {
        this._isVisible ? this._show() : this._hide();
    }

    private _resetDefaultValue() {
        var self = this;

        self._isVisible = true;
        self._alignment = LineMarkerAlignment.Auto;
        self._lines = LineMarkerLines.None;
        self._interaction = LineMarkerInteraction.None;
        self._horizontalPosition = null;
        self._verticalPosition = null;
        self._content = null;
        self._seriesIndex = null;
        self._dragThreshold = 15;
        self._dragContent = false;
        self._dragLines = false;

        self._targetPoint = new wijmo.Point();
    }

    private _initialize() {
        var self = this,
            plot = <SVGGElement>self._chart.hostElement.querySelector("." + FlexChartCore._CSS_PLOT_AREA),
            box;

        self._plot = plot;
        if (!self._marker) {
            self._createMarker();
        }
        if (plot) {
            self._plotRect = wijmo.getElementRect(plot);

            box = plot.getBBox();
            self._plotRect.width = box.width;
            self._plotRect.height = box.height;
            self._updateMarkerSize();
            self._updateLinesSize();
        }
        self._updateMarkerPosition();
        self._wrapperMoveMarker = self._moveMarker.bind(self);
        self._attach();
    }

    private _createMarker() {
        var self = this,
            marker: HTMLElement,
            container: HTMLElement;

        marker = document.createElement('div');
        wijmo.addClass(marker, LineMarker._CSS_MARKER);

        container = self._getContainer();
        container.appendChild(marker);

        self._markerContainer = container;
        self._marker = marker;

        self._createChildren();
    }

    private _removeMarker() {
        var self = this,
            mc = self._markerContainer;

        mc.removeChild(self._marker);
        self._content = null;
        self._hLine = null;
        self._vLine = null;

        if (!mc.hasChildNodes()) {
            self._chart.hostElement.removeChild(self._markerContainer);
            self._markerContainer = null;
        }
        self._marker = null;
    }

    private _getContainer(): HTMLElement {
        var container = <HTMLElement>this._chart.hostElement.querySelector(LineMarker._CSS_MARKER_CONTAINER);

        if (!container) {
            container = this._createContainer();
        }
        return container;
    }

    private _createContainer(): HTMLElement {
        var markerContainer = document.createElement('div'),
            hostEle = this._chart.hostElement;

        wijmo.addClass(markerContainer, LineMarker._CSS_MARKER_CONTAINER);
        hostEle.insertBefore(markerContainer, hostEle.firstChild);

        return markerContainer;
    }

    private _createChildren() {
        var self = this,
            marker = self._marker,
            markerContent: HTMLElement, hline: HTMLElement, vline: HTMLElement, dragEle: HTMLElement;

        // work around for marker content touchmove: 
        // when the content is dynamic element, the touchmove fire only once.
        dragEle = document.createElement('div');
        dragEle.style.position = 'absolute';
        dragEle.style.height = '100%';
        dragEle.style.width = '100%';
        marker.appendChild(dragEle);
        self._dragEle = dragEle;
        //content
        markerContent = document.createElement('div');
        wijmo.addClass(markerContent, LineMarker._CSS_MARKER_CONTENT);
        marker.appendChild(markerContent);
        self._markerContent = markerContent;
        // lines
        hline = document.createElement('div');
        wijmo.addClass(hline, LineMarker._CSS_MARKER_HLINE);
        marker.appendChild(hline);
        self._hLine = hline;
        vline = document.createElement('div');
        wijmo.addClass(vline, LineMarker._CSS_MARKER_VLINE);
        marker.appendChild(vline);
        self._vLine = vline;
        self._toggleElesDraggableClass(self._interaction === LineMarkerInteraction.Drag);
        self._resetLinesVisibility();
    }

    private _toggleElesDraggableClass(draggable: boolean) {
        var self = this;
        wijmo.toggleClass(self._hLine, LineMarker._CSS_LINE_DRAGGABLE, draggable);
        wijmo.toggleClass(self._vLine, LineMarker._CSS_LINE_DRAGGABLE, draggable);
        wijmo.toggleClass(self._dragEle, LineMarker._CSS_LINE_DRAGGABLE, draggable &&
            self._dragContent && self._lines !== LineMarkerLines.None);
    }

    private _updateMarkerSize() {
        var self = this,
            plotRect = self._plotRect,
            chartEle = self._chart.hostElement,
            computedStyle = window.getComputedStyle(chartEle, null),
            chartRect = wijmo.getElementRect(chartEle);

        if (!self._marker) {
            return;
        }
        self._marker.style.marginTop = (plotRect.top - chartRect.top - (parseFloat(computedStyle.getPropertyValue('padding-top')) || 0)) + 'px';
        self._marker.style.marginLeft = (plotRect.left - chartRect.left - (parseFloat(computedStyle.getPropertyValue('padding-left')) || 0)) + 'px';
    }

    private _updateLinesSize() {
        var self = this,
            plotRect = self._plotRect;

        if (!self._hLine || !self._vLine) {
            return;
        }

        self._hLine.style.width = plotRect.width + 'px';
        self._vLine.style.height = plotRect.height + 'px';
    }

    private _resetLinesVisibility() {
        var self = this;

        if (!self._hLine || !self._vLine) {
            return;
        }

        self._hide(self._hLine);
        self._hide(self._vLine);
        if (self._lines === LineMarkerLines.Horizontal || self._lines === LineMarkerLines.Both) {
            self._show(self._hLine);
        }
        if (self._lines === LineMarkerLines.Vertical || self._lines === LineMarkerLines.Both) {
            self._show(self._vLine);
        }
    }

    private _updateMarkerPosition(point?: wijmo.Point) {
        var self = this,
            plotRect = self._plotRect,
            targetPoint = self._targetPoint,
            x, y, raiseEvent = false,
            isDragAction = self._interaction === LineMarkerInteraction.Drag;

        if (!self._plot) {
            return;
        }

        x = plotRect.left + plotRect.width * (self._horizontalPosition || 0);
        y = plotRect.top + plotRect.height * (self._verticalPosition || 0);

        if (self._horizontalPosition == null && point) {
            x = point.x;
        }
        if (self._verticalPosition == null && point) {
            y = point.y;
        }

        if (x !== targetPoint.x || y !== targetPoint.y) {
            raiseEvent = true;
        }

        targetPoint.x = x;
        targetPoint.y = y;
        self._toggleVisibility();
        if (self._content) {
            self._updateContent();
        }

        if (raiseEvent) {
            self._raisePositionChanged(x, y);
        }

        // after the content changed(size changed), then update the marker's position
        self._updatePositionByAlignment(point ? true : false);
    }

    private _updateContent() {
        var self = this,
            chart = self._chart,
            point = self._targetPoint,
            hitTestInfo = chart.hitTest(point),
            text;

        text = self._content.call(null, hitTestInfo, point);
        self._markerContent.innerHTML = text || '';
    }

    private _raisePositionChanged(x: number, y: number) {
        var plotRect = this._plotRect;

        this.onPositionChanged(new wijmo.Point(x, y));
    }

    private _updatePositionByAlignment(isMarkerMoved?: boolean) {
        var self = this,
            align = self._alignment,
            tp = self._targetPoint,
            marker = self._marker,
            topBottom = 0, leftRight = 0,
            width = marker.clientWidth,
            height = marker.clientHeight,
            plotRect = self._plotRect,
            //offset for right-bottom lnkemarker to avoid mouse overlapping.
            offset = 12;

        if (!self._plot) {
            return;
        }

        if (!self._capturedEle || (self._capturedEle && self._capturedEle !== self._markerContent)) {
            if (align === LineMarkerAlignment.Auto) {
                if ((tp.x + width + offset > plotRect.left + plotRect.width) && (tp.x - width >= 0 )) {
                    leftRight = width;
                }
                //set default auto to right top.
                topBottom = height;
                if (tp.y - height < plotRect.top) {
                    topBottom = 0;
                }
            } else {
                if ((1 & align) === 1) {//left
                    leftRight = width;
                }
                if ((2 & align) === 2) {//Top
                    topBottom = height;
                }
            }
            //only add offset when interaction is move and alignment is right bottom
            if (self._interaction === LineMarkerInteraction.Move && topBottom === 0 && leftRight === 0 && this.verticalPosition == null) {
                leftRight = -offset;
            }
        } else {
            //content dragging: when the content is on top position
            if (parseInt(self._hLine.style.top) > 0) {
                topBottom = height;
            }
            //content dragging: when the content is on left position
            if (parseInt(self._vLine.style.left) > 0) {
                leftRight = width;
            }
        }

        marker.style.left = (tp.x - leftRight - plotRect.left) + 'px';
        marker.style.top = (tp.y - topBottom - plotRect.top) + 'px';
        self._hLine.style.top = topBottom + 'px';
        self._hLine.style.left = plotRect.left - tp.x + leftRight + 'px';
        self._vLine.style.top = plotRect.top - tp.y + topBottom + 'px';
        self._vLine.style.left = leftRight + 'px';
    }


    private _getEventPoint(e: any): wijmo.Point {
        return e instanceof MouseEvent ?
            new wijmo.Point(e.pageX, e.pageY) :
            new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }

    private _pointInRect(pt: wijmo.Point, rect: wijmo.Rect): boolean {
        if (!pt || !rect) {
            return false;
        }
        if (pt.x >= rect.left && pt.x <= rect.left + rect.width &&
            pt.y >= rect.top && pt.y <= rect.top + rect.height) {
            return true;
        }

        return false;
    }
}
    }
    


    module wijmo.chart {
    










'use strict';

/**
 * Line/scatter chart plotter.
 */
export class _LinePlotter extends _BasePlotter implements _IPlotter {
    hasSymbols: boolean = false;
    hasLines: boolean = true;
    isSpline: boolean = false;
    isStep: boolean = false;
    rotated: boolean;
    stacking = Stacking.None;

    stackPos: { [key: number]: number } = {};
    stackNeg: { [key: number]: number } = {};

    constructor() {
        super();
        this.clipping = false;
    }

    clear() {
        super.clear();
        this.stackNeg = {};
        this.stackPos = {};
    }

    adjustLimits(dataInfo: _DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;
        var xmin = dataInfo.getMinX();
        var ymin = dataInfo.getMinY();
        var xmax = dataInfo.getMaxX();
        var ymax = dataInfo.getMaxY();

        if (this.isSpline && !this.chart.axisY._getLogBase()) {
            var dy = 0.1 * (ymax - ymin);
            ymin -= dy;
            ymax += dy;
        }

        return this.rotated
            ? new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin)
            : new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
    }

    plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number, customRender?: Function) {
        var points = [];
        var ser: SeriesBase = wijmo.asType(series, SeriesBase);
        var si = this.chart.series.indexOf(series);

        var ys = series.getValues(0);
        var xs = series.getValues(1);
        if (!ys) {
            return;
        }
        if (!xs) {
            xs = this.dataInfo.getXVals();
        }

        var style = _BasePlotter.cloneStyle(series.style, ['fill']);
        var len = ys.length;
        var hasXs = true;
        if (!xs) {
            hasXs = false;
            xs = new Array<number>(len);
        } else {
            len = Math.min(len, xs.length);
        }

        var swidth = this._DEFAULT_WIDTH,
            fill = ser._getSymbolFill(si),
            altFill = ser._getAltSymbolFill(si) || fill,
            stroke = ser._getSymbolStroke(si),
            altStroke = ser._getAltSymbolStroke(si) || stroke,
            symSize = ser._getSymbolSize();

        engine.stroke = stroke;
        engine.strokeWidth = swidth;
        engine.fill = fill;

        let xvals = new Float64Array(len);
        let yvals = new Float64Array(len);
        let ipt = 0;
        let isNullVals = new Int8Array(len);//new Array<boolean>();
        let inull = 0;

        var rotated = this.rotated;
        var stacked = this.stacking != Stacking.None && !ser._isCustomAxisY();
        var stacked100 = this.stacking == Stacking.Stacked100pc && !ser._isCustomAxisY();
        if (ser._getChartType() !== undefined) {
            stacked = stacked100 = false;
        }

        var interpolateNulls = ser.interpolateNulls;
        var hasNulls = false;

        let ifmt = this.getItemFormatter(series);
        for (var i = 0; i < len; i++) {
            var datax = hasXs ? xs[i] : i;
            var datay = ys[i];

            if (isFinite(datax) && isFinite(datay)) {

                if (stacked) {
                    if (stacked100) {
                        var sumabs = this.dataInfo.getStackedAbsSum(datax);
                        datay = datay / sumabs;
                    }

                    if (datay >= 0) {
                        var sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                        datay = this.stackPos[datax] = sum + datay;
                    }
                    else {
                        var sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                        datay = this.stackNeg[datax] = sum + datay;
                    }
                }

                var dpt: _DataPoint;

                if (rotated) {
                    dpt = new _DataPoint(si, i, datay, datax);
                    var x = ax.convert(datay);
                    datay = ay.convert(datax);
                    datax = x;
                } else {
                    dpt = new _DataPoint(si, i, datax, datay);
                    datax = ax.convert(datax);
                    datay = ay.convert(datay);
                }
                if (!isNaN(datax) && !isNaN(datay)) {
                    // xvals.push(datax);
                    // yvals.push(datay);
                    xvals[ipt] = datax;
                    yvals[ipt++] = datay;
                    // isNullVals.push(false);
                    inull++;

                    if (customRender) {
                        points.push(new wijmo.Point(datax, datay));
                    }

                    var area = new _CircleArea(new wijmo.Point(datax, datay), 0.5 * symSize);
                    area.tag = dpt;
                    this.hitTester.add(area, si);
                } else {
                    hasNulls = true;
                    if (interpolateNulls !== true) {
                        // xvals.push(undefined);
                        // yvals.push(undefined);
                        xvals[ipt] = NaN;
                        yvals[ipt++] = NaN;
                    }
                    // isNullVals.push(true);
                    isNullVals[inull++] = 1; 

                    if (customRender) {
                        points.push(null);
                    }
                }
            } else {
                hasNulls = true;
                if (interpolateNulls !== true) {
                    // xvals.push(undefined);
                    // yvals.push(undefined);
                    xvals[ipt] = NaN;
                    yvals[ipt++] = NaN;
                }
                // isNullVals.push(true);
                isNullVals[inull++] = 1;

                if (customRender) {
                    points.push(null);
                }
            }
        }

        var itemIndex = 0;

        if (this.hasLines) {
            engine.fill = null;

            if (hasNulls && interpolateNulls !== true) {
                var dx = [];
                var dy = [];

                for (var i = 0; i < len; i++) {
                    if ( isNaN(xvals[i])) {
                        if (dx.length > 1) {
                            this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                            this.hitTester.add(new _LinesArea(dx, dy), si);
                            itemIndex++;
                        }
                        dx = [];
                        dy = [];
                    }
                    else {
                        dx.push(xvals[i]);
                        dy.push(yvals[i]);
                    }
                }
                if (dx.length > 1) {
                    this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                    this.hitTester.add(new _LinesArea(dx, dy), si);
                    itemIndex++;
                }
            } else {
                this._drawLines(engine, <any>xvals, <any>yvals, null, style, this.chart._plotrectId, ipt);
                this.hitTester.add(new _LinesArea(xvals, yvals), si);
                itemIndex++;
            }
        }

        if ((this.hasSymbols && symSize > 0) || ifmt) {
            engine.fill = fill;
            var symbolIndex = 0;
            for (var i = 0; i < len; i++) {
                if (interpolateNulls && isNullVals[i]) {
                    continue;
                }
                var datax = xvals[symbolIndex];
                var datay = yvals[symbolIndex];

                // scatter fill/stroke
                if (this.hasLines === false || ifmt) {
                    engine.fill = ys[i] > 0 ? fill : altFill;
                    engine.stroke = ys[i] > 0 ? stroke : altStroke;
                    engine.strokeWidth = swidth;
                }

                //if (DataInfo.isValid(datax) && DataInfo.isValid(datay)) {
                if (this.isValid(datax, datay, ax, ay)) {
                    this._drawSymbol(engine, datax, datay, symSize, ser, i, ifmt);
                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
                symbolIndex++;
            }
        }

        if (customRender && points && points.length) {
            customRender(points);
        }
    }

    _drawLines(engine: IRenderEngine, xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?:number) {
        if (this.isSpline && num > 3) {
            engine.drawSplines(xs, ys, className, style, clipPath, num);
        } else if (this.isStep) {
            let steps = this._createSteps(xs, ys, num);
            xs = steps.x; ys = steps.y;
            engine.drawLines(xs, ys, className, style, clipPath);
        } else {
            engine.drawLines(xs, ys, className, style, clipPath, num);
        }
    }

    _drawSymbol(engine: IRenderEngine, x: number, y: number, sz: number, series: SeriesBase, pointIndex: number, ifmt: Function) {
        if (ifmt) {
            engine.startGroup();
            var hti: HitTestInfo = new HitTestInfo(this.chart, new wijmo.Point(x, y), ChartElement.SeriesSymbol);
            hti._setData(series, pointIndex);

            ifmt(engine, hti, () => {
                if (this.hasSymbols && sz > 0) {
                    this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                }
            });
            engine.cssPriority = true;
            engine.endGroup();
        } else {
            this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
        }
    }

    _drawDefaultSymbol(engine: IRenderEngine, x: number, y: number, sz: number, marker: Marker, style?: any) {
        if (marker == Marker.Dot) {
            engine.drawEllipse(x, y, 0.5 * sz, 0.5 * sz, null, style);
        } else if (marker == Marker.Box) {
            engine.drawRect(x - 0.5 * sz, y - 0.5 * sz, sz, sz, null, style);
        }
    }
}
    }
    


    module wijmo.chart {
    








'use strict';

export class _BubblePlotter extends _LinePlotter {
    private _MIN_SIZE = 5;
    private _MAX_SIZE = 30;

    private _minSize: number;
    private _maxSize: number;
    private _minValue: number;
    private _maxValue: number;

    constructor() {
        super();
        this.hasLines = false;
        this.hasSymbols = true;
        this.clipping = true;
    }

    adjustLimits(dataInfo: _DataInfo, pr: wijmo.Rect): wijmo.Rect {
        var minSize = this.getNumOption('minSize', 'bubble');
        this._minSize = minSize ? minSize : this._MIN_SIZE;
        var maxSize = this.getNumOption('maxSize', 'bubble');
        this._maxSize = maxSize ? maxSize : this._MAX_SIZE;

        var series = this.chart.series;
        var len = series.length;

        var min: number = NaN;
        var max: number = NaN;

        for (var i = 0; i < len; i++) {
            var ser = <Series>series[i];
            if (ser._getChartType() == ChartType.Bubble || (ser._getChartType() == null && ser._chart._getChartType() == ChartType.Bubble)) {
                let vals = ser._getBindingValues(1);
                if (vals) {
                    var vlen = vals.length;
                    for (var j = 0; j < vlen; j++) {
                        if (isFinite(vals[j])) {
                            if (isNaN(min) || vals[j] < min) {
                                min = vals[j];
                            }
                            if (isNaN(max) || vals[j] > max) {
                                max = vals[j];
                            }
                        }
                    }
                }
            }
        }
        this._minValue = min;
        this._maxValue = max;

        let rect = super.adjustLimits(dataInfo, pr);

        let left = pr.left;
        let right = pr.right;
        let top = pr.top;
        let bottom = pr.bottom;

        for (var i = 0; i < len; i++) {
            var ser = <Series>series[i];
            if (ser._getChartType() == ChartType.Bubble || (ser._getChartType() == null && ser._chart._getChartType() == ChartType.Bubble)) {
                let vals = ser._getBindingValues(1);
                let xs = ser.getValues(1);
                let ys = ser.getValues(0);

                if (vals && xs && ys) {
                    let vlen = vals.length;
                    for (var j = 0; j < vlen; j++) {
                        let x = xs ? xs[j] : j;
                        let y = ys[j];
                        let sz = vals[j];
                        if (_DataInfo.isValid(x, y, sz)) {
                            x = pr.left + pr.width * (x - rect.left) / rect.width;
                            y = pr.top + pr.height * (y - rect.top) / rect.height;
                            sz = this._minSize + (this._maxSize - this._minSize) * (sz - min) / (max - min);
                            if (x - sz < left) {
                                left = x - sz;
                            }
                            if (x + sz > right) {
                                right = x + sz;
                            }
                            if (y - sz < top) {
                                top = y - sz;
                            }
                            if (y + sz > bottom) {
                                bottom = y + sz;
                            }
                        }
                    }
                }
            }
        }

        left = pr.left - left + 5;
        right = right - pr.right + 5;
        top = pr.top - top + 5;
        bottom = bottom - pr.bottom + 5;

        var ax = this.chart.axisX,
            ay = this.chart.axisY;

        // adjust only for non-log axes
        if (!ax._isLogAxis()) {
            if (this.stacking == Stacking.Stacked100pc && this.rotated) {
                let w = pr.width - this._maxSize;
                let kw = w / rect.width;
                rect.left -= this._maxSize * 0.5 / kw;
                rect.width += this._maxSize / kw;
            } else {
                let w = pr.width - (left + right);
                let kw = w / rect.width;
                rect.left -= left / kw;
                rect.width += (left + right) / kw;
            }
        }

        if (!ay._isLogAxis()) {
            if (this.stacking == Stacking.Stacked100pc && !this.rotated) {
                let h = pr.height - this._maxSize;
                let kh = h / rect.height;
                rect.top -= this._maxSize * 0.5 / kh;
                rect.height += this._maxSize / kh;
            } else {
                let h = pr.height - (top + bottom);
                let kh = h / rect.height;
                rect.top -= top / kh;
                rect.height += (top + bottom) / kh;
            }
        }
        return rect;
    }

    _drawSymbol(engine: IRenderEngine, x: number, y: number, sz: number, series: Series, pointIndex: number, ifmt: Function) {
        //If chart type is not bubble, adjust limits is not executed.
        if (this._minSize == null) {
            var minSize = this.getNumOption('minSize', 'bubble');
            this._minSize = minSize ? minSize : this._MIN_SIZE;
        }
        if (this._maxSize == null) {
            var maxSize = this.getNumOption('maxSize', 'bubble');
            this._maxSize = maxSize ? maxSize : this._MAX_SIZE;
        }

        var item = series._getItem(pointIndex);
        if (item) {
            var szBinding = series._getBinding(1);
            if (szBinding) {
                var sz = <number>item[szBinding];
                if (isFinite(sz)) {
                    if (sz == null) {
                        sz = this._minValue;
                    }
                    var k = this._minValue == this._maxValue ? 1 :
                        Math.sqrt((sz - this._minValue) / (this._maxValue - this._minValue));
                    sz = this._minSize + (this._maxSize - this._minSize) * k;

                    if (ifmt) {
                        var hti: HitTestInfo = new HitTestInfo(this.chart, new wijmo.Point(x, y), ChartElement.SeriesSymbol);
                        hti._setData(series, pointIndex);

                        engine.startGroup();
                        ifmt(engine, hti, () => {
                            this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                        });
                        engine.endGroup();
                    } else {
                        this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                    }

                    var areas = this.hitTester._map[this.chart.series.indexOf(series)];
                    if (areas != null) {
                        var len = areas.length;
                        for (var i = len - 1; i >= 0; i--) {
                            var area = areas[i];
                            if (area.tag && area.tag.pointIndex == pointIndex) {
                                var ca = wijmo.tryCast(area, _CircleArea);
                                if (ca)
                                    ca.setRadius(0.5 * sz);
                            }
                        }
                    }

                }
            }
        }
    }
}
    }
    


    module wijmo.chart {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart', wijmo.chart);


























    }
    