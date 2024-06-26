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


    module wijmo.chart.finance {
    



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
export class FinancialSeries extends wijmo.chart.SeriesBase {
    private _finChartType;

    /**
     * Gets or sets the chart type for a specific series, overriding the chart type
     * set on the overall chart. Please note that ColumnVolume, EquiVolume,
     * CandleVolume and ArmsCandleVolume chart types are not supported and should be
     * set on the {@link FinancialChart}.
     */
    get chartType(): FinancialChartType {
        return this._finChartType;
    }
    set chartType(value: FinancialChartType) {
        value = wijmo.asEnum(value, FinancialChartType, true);
        if (value != this._finChartType) {
            this._finChartType = value;
            this._invalidate();
        }
    }

    _getChartType(): wijmo.chart.ChartType {
        var ct = null;
        switch (this.chartType) {
            case FinancialChartType.Area:
                ct = wijmo.chart.ChartType.Area;
                break;
            case FinancialChartType.Line:
            case FinancialChartType.Kagi:
            case FinancialChartType.PointAndFigure:
                ct = wijmo.chart.ChartType.Line;
                break;
            case FinancialChartType.Column:
            case FinancialChartType.ColumnVolume:
                ct = wijmo.chart.ChartType.Column;
                break;
            case FinancialChartType.LineSymbols:
                ct = wijmo.chart.ChartType.LineSymbols;
                break;
            case FinancialChartType.Scatter:
                ct = wijmo.chart.ChartType.Scatter;
                break;
            case FinancialChartType.Candlestick:
            case FinancialChartType.Renko:
            case FinancialChartType.HeikinAshi:
            case FinancialChartType.LineBreak:
            case FinancialChartType.EquiVolume:
            case FinancialChartType.CandleVolume:
            case FinancialChartType.ArmsCandleVolume:
                ct = wijmo.chart.ChartType.Candlestick;
                break;
            case FinancialChartType.HighLowOpenClose:
                ct = wijmo.chart.ChartType.HighLowOpenClose;
                break;
        }

        return ct;
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
        if (calculatedRect) {
            return calculatedRect;
        }

        var values = this.getValues(0),
            xvalues = this.getValues(1) || (this.chart._xvals && this.chart._xvals.length ? this.chart._xvals : null),
            bndHigh = this._getBinding(0),
            bndLow = this._getBinding(1),
            bndOpen = this._getBinding(2),
            bndClose = this._getBinding(3);

        let plotter: any = this._plotter,
            type = this._getChartType() || this.chart._getChartType();
        if ((type !== wijmo.chart.ChartType.HighLowOpenClose && type !== wijmo.chart.ChartType.Candlestick) || bndHigh === bndLow) {
            return null;
        }

        if (values) {
            var xmin = NaN,
                ymin = NaN,
                xmax = NaN,
                ymax = NaN;

            var len = values.length;

            for (var i = 0; i < len; i++) {
                var item = this._getItem(i);
                var val = values[i];
                if (isFinite(val)) {
                    let yvals = [val,
                        bndLow ? item[bndLow] : null,
                        bndOpen ? item[bndOpen] : null,
                        bndClose ? item[bndClose] : null];

                    yvals.forEach((yval) => {
                        if (wijmo.chart._DataInfo.isValid(yval) && yval !== null) {
                            if (isNaN(ymin) || yval < ymin) {
                                ymin = yval;
                            }
                            if (isNaN(ymax) || yval > ymax) {
                                ymax = yval;
                            }
                        }
                    });
                }
                if (xvalues) {
                    var xval = xvalues[i];
                    if (isFinite(xval)) {
                        if (isNaN(xmin)) {
                            xmin = xmax = xval;
                        } else {
                            if (xval < xmin) {
                                xmin = xval;
                            } else if (xval > xmax) {
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
}
    }
    


    module wijmo.chart.finance {
    


"use strict";

// simplified version of experimental Math.trunc()
// Math.trunc() on MDN: http://mzl.la/1BY3vHE
export function _trunc(value: number): number {
    wijmo.asNumber(value, true, false);
    return value > 0 ? Math.floor(value) : Math.ceil(value);
}

// sum a set of numbers
export function _sum(...values: number[]): number;
export function _sum(values: number[]): number;
export function _sum(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    return values.reduce((prev: number, curr: number) => prev + wijmo.asNumber(curr), 0);
}

// average a set of numbers
export function _average(...values: number[]): number;
export function _average(values: number[]): number;
export function _average(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    return _sum(values) / values.length;
}

// minimum value for a set of numbers
export function _minimum(...values: number[]): number;
export function _minimum(values: number[]): number;
export function _minimum(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    return Math.min.apply(null, values);
}

// maximum value for a set of numbers
export function _maximum(...values: number[]): number;
export function _maximum(values: number[]): number;
export function _maximum(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    return Math.max.apply(null, values);
}

// returns variance for a set of numbers
export function _variance(...values: number[]): number;
export function _variance(values: number[]): number;
export function _variance(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    var mean = _average(values),
        diffs = values.map((value: number) => Math.pow(value - mean, 2));
    return _average(diffs);
}

// returns standard deviation for a set of numbers
export function _stdDeviation(...values: number[]): number;
export function _stdDeviation(values: number[]): number;
export function _stdDeviation(values: any): number {
    if (arguments.length > 1) {
        values = Array.prototype.slice.call(arguments);
    }
    wijmo.asArray(values, false);
    return Math.sqrt(_variance(values));
}

// calculate Average True Range for a set of financial data
export function _avgTrueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
    wijmo.asArray(highs, false); wijmo.asArray(lows, false); wijmo.asArray(closes, false);
    wijmo.asInt(period, false, true);

    var trs = _trueRng(highs, lows, closes, period),
        len = Math.min(highs.length, lows.length, closes.length, trs.length),
        atrs: number[] = [];
    wijmo.assert(len > period && period > 1, "Average True Range period must be an integer less than the length of the data and greater than one.");

    for (var i = 0; i < len; i++) {
        wijmo.asNumber(highs[i], false); wijmo.asNumber(lows[i], false); wijmo.asNumber(closes[i], false); wijmo.asNumber(trs[i], false);

        if ((i + 1) === period) {
            atrs.push(_average(trs.slice(0, period)));
        } else if ((i + 1) > period) {
            atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
        }
    }

    return atrs;
}

// calculate True Range for a set of financial data
export function _trueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
    wijmo.asArray(highs, false); wijmo.asArray(lows, false); wijmo.asArray(closes, false);
    wijmo.asInt(period, false, true);

    var len = Math.min(highs.length, lows.length, closes.length),
        trs: number[] = [];
    wijmo.assert(len > period && period > 1, "True Range period must be an integer less than the length of the data and greater than one.");

    for (var i = 0; i < len; i++) {
        wijmo.asNumber(highs[i], false); wijmo.asNumber(lows[i], false); wijmo.asNumber(closes[i], false);

        if (i === 0) {
            trs.push(highs[i] - lows[i]);
        } else {
            trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
        }
    }

    return trs;
}

// simple moving average
export function _sma(values: number[], period: number): number[] {
    wijmo.asArray(values, false);
    wijmo.asNumber(period, false, true);
    wijmo.assert(values.length > period && period > 1, "Simple Moving Average period must be an integer less than the length of the data and greater than one.");

    var retval: number[] = [];

    for (var i = period; i <= values.length; i++) {
        retval.push(_average(values.slice(i - period, i)));
    }

    return retval;
}

// exponential moving average
export function _ema(values: number[], period: number): number[] {
    wijmo.asArray(values, false);
    wijmo.asNumber(period, false, true);
    wijmo.assert(values.length > period && period > 1, "Exponential Moving Average period must be an integer less than the length of the data and greater than one.");

    var retval: number[] = [],
        multiplier = 2 / (period + 1),
        smas = _sma(values, period);

    values = values.slice(period - 1);

    for (var i = 0; i < values.length; i++) {
        if (i === 0) {
            retval.push(smas[0]);
        } else {
            retval.push((values[i] - retval[i - 1]) * multiplier + retval[i - 1]);
        }
    }

    return retval;
}

// generate a range of numbers
export function _range(begin: number, end: number, step: number = 1): number[] {
    wijmo.asNumber(begin, false);
    wijmo.asNumber(end, false);
    wijmo.asNumber(step, false);
    wijmo.assert(begin < end, "begin argument must be less than end argument.");

    var retval: number[] = [];

    for (var i = begin; i <= end; i += step) {
        retval.push(i);
    }

    return retval;
}
    }
    


    module wijmo.chart.finance {
    


"use strict";

// represents a common return value for calculator implementations
//  no need for concrete type
export interface _IFinanceItem {
    high: number;   // max value of start/end
    low: number;    // min value of start/end
    open: number;   // i.e. range start
    close: number;  // i.e. range end
    x: number;
    pointIndex: number; // serves as the original (current) point index
}

// common interface for all calculators
export interface _IFinancialCalculator {
    highs: number[];
    lows: number[];
    opens: number[];
    closes: number[];
    xs?: number[];  // all but heikin-ashi
    size?: number;  // all but heikin-ashi
    unit?: RangeMode; // renko and kagi
    fields?: DataFields; // renko and kagi
    calculate(): any;
}

// abstract base class for range based calculators
export class _BaseCalculator implements _IFinancialCalculator {
    highs: number[];
    lows: number[];
    opens: number[];
    closes: number[];

    constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
        this.highs = highs;
        this.lows = lows;
        this.opens = opens;
        this.closes = closes;
    }

    calculate(): any { }
}

// calculator for Heikin-Ashi plotter - http://bit.ly/1BY55tc
export class _HeikinAshiCalculator extends _BaseCalculator {
    constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
        super(highs, lows, opens, closes);
    }

    calculate(): _IFinanceItem[] {
        var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
            haHigh: number, haLow: number, haOpen: number, haClose: number,
            retvals: _IFinanceItem[] = [];

        if (len <= 0) { return retvals; }

        for (var i = 0; i < len; i++) {
            haClose = _average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);

            if (i === 0) {
                haOpen = _average(this.opens[i], this.closes[i]);
                haHigh = this.highs[i];
                haLow = this.lows[i];
            } else {
                haOpen = _average(retvals[i - 1].open, retvals[i - 1].close);
                haHigh = Math.max(this.highs[i], haOpen, haClose);
                haLow = Math.min(this.lows[i], haOpen, haClose);
            }

            retvals.push({
                high: haHigh,
                low: haLow,
                close: haClose,
                open: haOpen,
                pointIndex: i,
                x: null
            });
        }

        return retvals;
    }
}

// abstract base class for range based calculators
export class _BaseRangeCalculator extends _BaseCalculator {
    xs: number[];
    size: number;
    unit: RangeMode;
    fields: DataFields;

    constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit?: RangeMode, fields?: DataFields) {
        super(highs, lows, opens, closes);
        this.xs = xs;
        this.size = size;
        this.unit = unit;
        this.fields = fields;
    }

    // based on "fields" member, return the values to be used for calculations
    //  DataFields.HighLow must be handled in the calculate() method
    _getValues(): number[] {
        var values: number[] = [],
            len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
            i: number;

        switch (this.fields) {
            case DataFields.High: {
                values = this.highs;
                break;
            }
            case DataFields.Low: {
                values = this.lows;
                break;
            }
            case DataFields.Open: {
                values = this.opens;
                break;
            }
            case DataFields.HL2: {
                for (i = 0; i < len; i++) {
                    values.push(_average(this.highs[i], this.lows[i]));
                }
                break;
            }
            case DataFields.HLC3: {
                for (i = 0; i < len; i++) {
                    values.push(_average(this.highs[i], this.lows[i], this.closes[i]));
                }
                break;
            }
            case DataFields.HLOC4: {
                for (i = 0; i < len; i++) {
                    values.push(_average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                }
                break;
            }
            case DataFields.Close:
            default: {
                values = this.closes;
                break;
            }
        }

        return values;
    }

    _getSize(): number {
        var atrs = this.unit === RangeMode.ATR ? _avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
        return this.unit === RangeMode.ATR ? atrs[atrs.length - 1] : this.size;
    }
}

// calculator for Line Break plotter
export class _LineBreakCalculator extends _BaseRangeCalculator {
    constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number) {
        super(highs, lows, opens, closes, xs, size);
    }

    calculate(): _IFinanceItem[] {
        var hasXs = this.xs !== null && this.xs.length > 0,
            len = this.closes.length,
            retvals: _IFinanceItem[] = [],
            rangeValues: number[][] = [[], []];

        if (len <= 0) { return retvals; }

        var tempRngs: number[] = [],
            basePrice: number,
            x: number, close: number,
            lbLen: number, lbIdx: number,
            max: number, min: number;

        // start at index of one
        for (var i = 1; i < len; i++) {
            lbLen = retvals.length;
            lbIdx = lbLen - 1;
            x = hasXs ? this.xs[i] : i;
            close = this.closes[i];

            if (lbIdx === -1) {
                basePrice = this.closes[0];
                if (basePrice === close) { continue; }
            } else {
                if (this._trendExists(rangeValues) || this.size === 1) {
                    tempRngs = rangeValues[0].slice(-this.size).concat(rangeValues[1].slice(-this.size));
                } else {
                    tempRngs = rangeValues[0].slice(1 - this.size).concat(rangeValues[1].slice(1 - this.size));
                }

                max = Math.max.apply(null, tempRngs);
                min = Math.min.apply(null, tempRngs);

                if (close > max) {
                    basePrice = Math.max(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                } else if (close < min) {
                    basePrice = Math.min(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                } else {
                    continue;
                }
            }

            rangeValues[0].push(basePrice);
            rangeValues[1].push(close);

            retvals.push({
                high: Math.max(basePrice, close),
                low: Math.min(basePrice, close),
                open: basePrice,
                close: close,
                x: x,
                pointIndex: i
            });
        }

        return retvals;
    }

    private _trendExists(vals: number[][]) {
        if (vals[1].length < this.size) { return false; }

        var retval = false,
            t: number,
            temp = vals[1].slice(-this.size);   // get subset of "current" values based on _newLineBreaks

        // detect rising trend
        for (t = 1; t < this.size; t++) {
            retval = temp[t] > temp[t - 1];
            if (!retval) { break; }
        }
        // detect falling trend
        if (!retval) {
            for (t = 1; t < this.size; t++) {
                retval = temp[t] < temp[t - 1];
                if (!retval) { break; }
            }
        }

        return retval;
    }
}

// calculator for Kagi plotter
export class _KagiCalculator extends _BaseRangeCalculator {
    constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields) {
        super(highs, lows, opens, closes, xs, size, unit, field);
    }

    calculate(): _IFinanceItem[] {
        var reversal = this._getSize(),
            len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
            values = this._getValues(),
            hasXs = this.xs !== null && this.xs.length > 0,
            retvals: _IFinanceItem[] = [],
            rangeValues: number[][] = [[], []];

        if (len <= 0) { return retvals; }

        var basePrice: number,
            x: number, current: number,
            rLen: number, rIdx: number,
            min: number, max: number,
            diff: number, extend: boolean,
            pointIndex: number;

        for (var i = 1; i < len; i++) {
            rLen = retvals.length;
            rIdx = rLen - 1;
            x = hasXs ? this.xs[i] : i;
            pointIndex = i;
            extend = false;

            // set current value
            if (this.fields === DataFields.HighLow) {
                if (rIdx === -1) {
                    if (this.highs[i] > this.highs[0]) {
                        current = this.highs[i];
                    } else if (this.lows[i] < this.lows[0]) {
                        current = this.lows[i];
                    } else {
                        continue;
                    }
                } else {
                    diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                    if (diff > 0) {
                        if (this.highs[i] > rangeValues[1][rIdx]) {
                            current = this.highs[i];
                        } else if (this.lows[i] < rangeValues[1][rIdx]) {
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    } else {
                        if (this.lows[i] < rangeValues[1][rIdx]) {
                            current = this.lows[i];
                        } else if (this.highs[i] > rangeValues[1][rIdx]) {
                            current = this.highs[i];
                        } else {
                            continue;
                        }
                    }
                }
            } else {
                current = values[i];
            }

            // set reversal for percentage-based charts
            if (this.unit === RangeMode.Percentage) {
                reversal = current * this.size;
            }

            // set base price value
            if (rIdx === -1) {
                x = hasXs ? this.xs[0] : 0;
                pointIndex = 0;
                if (this.fields === DataFields.HighLow) {
                    basePrice = this.highs[0] == null ? this.highs[this.highs.length - 1] : this.highs[0];
                } else {
                    basePrice = values[0] == null ? values[values.length - 1] : values[0];
                }
                diff = Math.abs(basePrice - current) || 0;
                if (diff < reversal) { continue; }
            } else {
                diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);

                if (diff > 0) { // up
                    if (current > max) {
                        extend = true;
                    } else {
                        diff = max - current;
                        if (diff >= reversal) { // back down
                            basePrice = max;
                        } else {
                            continue;
                        }
                    }
                } else {    // down
                    if (current < min) {
                        extend = true;
                    } else {
                        diff = current - min;
                        if (diff >= reversal) { // back up
                            basePrice = min;
                        } else {
                            continue;
                        }
                    }
                }
            }

            if (extend) {   // extend the current range
                rangeValues[1][rIdx] = current;

                retvals[rIdx].close = current;
                retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
            } else {    // new range
                rangeValues[0].push(basePrice);
                rangeValues[1].push(current);

                retvals.push({
                    high: Math.max(basePrice, current),
                    low: Math.min(basePrice, current),
                    open: basePrice,
                    close: current,
                    x: x,
                    pointIndex: pointIndex
                });
            }
        }

        return retvals;
    }
}

// calculator for Renko plotter
export class _RenkoCalculator extends _BaseRangeCalculator {
    rounding: boolean;
    constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields, rounding: boolean = false) {
        super(highs, lows, opens, closes, xs, size, unit, field);

        // internal only
        this.rounding = rounding;
    }

    calculate(): _IFinanceItem[] {
        var size = this._getSize(),
            len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
            hasXs = this.xs !== null && this.xs.length > 0,
            values = this._getValues(),
            retvals: _IFinanceItem[] = [],
            rangeValues: number[][] = [[], []];

        if (len <= 0) { return retvals; }

        var basePrice: number,
            x: number, current: number,
            rLen: number, rIdx: number,
            min: number, max: number,
            diff: number;

        // start at index of one
        for (var i = 1; i < len; i++) {
            rLen = retvals.length;
            rIdx = rLen - 1;
            x = hasXs ? this.xs[i] : i;

            // todo: not working correctly, figure out
            // set basePrice and current for DataFields == HighLow
            if (this.fields === DataFields.HighLow) {
                if (rIdx === -1) {
                    if (this.highs[i] - this.highs[0] > size) {
                        basePrice = this.highs[0];
                        current = this.highs[i];
                    } else if (this.lows[0] - this.lows[i] > size) {
                        basePrice = this.lows[0];
                        current = this.lows[i];
                    } else {
                        continue;
                    }
                } else {
                    min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    if ((this.highs[i] - max) > size) {
                        basePrice = max;
                        current = this.highs[i];
                    } else if ((min - this.lows[i]) > size) {
                        basePrice = min;
                        current = this.lows[i];
                    } else {
                        continue;
                    }
                }
            } else {    // set basePrice & current for
                        // DataFields != HighLow
                // current price
                current = values[i];

                // set "base price"
                if (rIdx === -1) {
                    basePrice = values[0];
                } else {
                    min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    if (current > max) {
                        basePrice = max;
                    } else if (current < min) {
                        basePrice = min;
                    } else {
                        continue;
                    }
                }
            }

            diff = current - basePrice;
            if (Math.abs(diff) < size) { continue; }

            // determine number of boxes to add
            diff = _trunc(diff / size);

            // append ranges and x's
            for (var j = 0; j < Math.abs(diff); j++) {
                var rng: any = {};

                // note StockCharts adjusts based on size
                if (this.rounding) {
                    basePrice = this._round(basePrice, size);
                }

                rangeValues[0].push(basePrice);
                rng.open = basePrice;

                basePrice = diff > 0 ? basePrice + size : basePrice - size;
                rangeValues[1].push(basePrice);
                rng.close = basePrice;

                rng.x = x;
                rng.pointIndex = i;
                rng.high = Math.max(rng.open, rng.close);
                rng.low = Math.min(rng.open, rng.close);

                retvals.push(rng);
            }
        }

        return retvals;
    }

    // internal only - for StockCharts rounding
    _round(value: number, size: number): number {
        return Math.round(value / size) * size;
    }
}
    }
    


    module wijmo.chart.finance {
    




"use strict";

// Abstract plotter for range based FinancialChartTypes
export class _BaseRangePlotter extends wijmo.chart._BasePlotter {
    private _symFactor = 0.7;

    // used for calculating derived data set
    _calculator: _BaseRangeCalculator;

    // storage for derived data set
    _rangeValues: _IFinanceItem[];

    // acts as itemsSource for X-Axis based on derived data set
    _rangeXLabels: any[];

    constructor() {
        super();
        this.clear();
    }

    clear(): void {
        super.clear();
        this._rangeValues = null;
        this._rangeXLabels = null;
        this._calculator = null;
    }

    unload(): void {
        super.unload();

        var series: wijmo.chart.SeriesBase,
            ax: wijmo.chart.Axis;

        for (var i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            if (!series) { continue; }
            ax = series._getAxisX();

            // reset AxisX.itemsSource
            if (ax && ax.itemsSource) {
                ax.itemsSource = null;
            }
        }
    }

    // todo: possibly add support for multiple series *later* (i.e. overlays/indicators)
    // todo: better way to adjust x limits?
    adjustLimits(dataInfo: wijmo.chart._DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        var series: FinancialSeries,
            arrTemp: number[], xTemp: number[],
            xmin = 0, xmax = 0,
            ymin = 0, ymax = 0,
            ax: wijmo.chart.Axis,
            padding = this.chart._xDataType === wijmo.DataType.Date ? 0.5 : 0;

        // only one supported at the moment - possibly remove later for overlays & indicators
        wijmo.assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");

        // looping for future - will need adjusted (see above)
        for (var i = 0; i < this.chart.series.length; i++) {
            series = this.chart.series[i];
            this._calculate(series);

            if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) { continue; }

            // create temporary array for calculating ymin & ymax
            arrTemp = this._rangeValues.map((value: _IFinanceItem) => value.open);
            arrTemp.push.apply(arrTemp, this._rangeValues.map((value: _IFinanceItem) => value.close));

            // create temp array for xmin & xmax
            xTemp = this._rangeXLabels.map((current) => current.value);

            // update y-axis
            ymin = Math.min.apply(null, arrTemp);
            ymax = Math.max.apply(null, arrTemp);

            // update x-axis and set itemsSource
            xmin = Math.min.apply(null, xTemp);
            xmax = Math.max.apply(null, xTemp);
            ax = series._getAxisX();
            ax.itemsSource = this._rangeXLabels;
        }

        xmin -= padding;
        return new wijmo.Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: FinancialSeries, palette: wijmo.chart._IPalette, iser: number, nser: number): void {
        this._calculate(series);

        var si = this.chart.series.indexOf(series),
            len = this._rangeValues.length,
            xmin = ax.actualMin,
            xmax = ax.actualMax,
            strWidth = this._DEFAULT_WIDTH,
            symSize = this._symFactor,
            fill = series._getSymbolFill(si),
            altFill = series._getAltSymbolFill(si) || "transparent",
            stroke = series._getSymbolStroke(si),
            altStroke = series._getAltSymbolStroke(si) || stroke;

        engine.strokeWidth = strWidth;

        var itemIndex = 0,
            x: number, start: number, end: number,
            dpt: wijmo.chart._DataPoint;

        let ifmt = this.getItemFormatter(series);

        for (var i = 0; i < len; i++) {
            x = i;
            if (wijmo.chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                start = this._rangeValues[i].open;
                end = this._rangeValues[i].close;

                // symbol fill and stroke
                engine.fill = start > end ? fill : altFill;
                engine.stroke = start > end ? stroke : altStroke;

                // manually specify values for HitTestInfo
                // for Bars - dataY should be the top of the bar
                dpt = this._getDataPoint(si, i, series, Math.max(start, end));

                engine.startGroup();

                if (ifmt) {
                    var hti = new wijmo.chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(end)), wijmo.chart.ChartElement.SeriesSymbol);
                    hti._setData(series, i);
                    hti._setDataPoint(dpt);

                    ifmt(engine, hti, () => {
                        this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                    });
                } else {
                    this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                }

                engine.endGroup();

                series._setPointIndex(i, itemIndex);
                itemIndex++;
            }
        }
    }

    _drawSymbol(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, si: number, pi: number, w: number, x: number, start: number, end: number, dpt: wijmo.chart._DataPoint): void {
        var y0: number, y1: number,
            x1: number, x2: number,
            area: wijmo.chart._IHitArea;

        x1 = ax.convert(x - 0.5 * w);
        x2 = ax.convert(x + 0.5 * w);
        if (x1 > x2) {
            var tmp = x1; x1 = x2; x2 = tmp;
        }

        if (wijmo.chart._DataInfo.isValid(start) && wijmo.chart._DataInfo.isValid(end)) {
            start = ay.convert(start);
            end = ay.convert(end);
            y0 = Math.min(start, end);
            y1 = y0 + Math.abs(start - end);

            engine.drawRect(x1, y0, x2 - x1, y1 - y0);

            area = new wijmo.chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
            area.tag = dpt;
            this.hitTester.add(area, si);
        }
    }

    // generates _DataPoint for hit test support
    _getDataPoint(seriesIndex: number, pointIndex: number, series: wijmo.chart.SeriesBase, dataY: number): wijmo.chart._DataPoint {
        var x = pointIndex,
            dpt = new wijmo.chart._DataPoint(seriesIndex, pointIndex, x, dataY),
            item = series._getItem(this._rangeValues[pointIndex].pointIndex),
            bndX = series.bindingX || this.chart.bindingX,
            bndHigh = series._getBinding(0),
            bndLow = series._getBinding(1),
            bndOpen = series._getBinding(2),
            bndClose = series._getBinding(3),
            ay = series._getAxisY();

        // set item related data and maintain original bindings
        dpt["item"] = wijmo.chart._BasePlotter.cloneStyle(item, []);
        dpt["item"][bndHigh] = this._rangeValues[pointIndex].high;
        dpt["item"][bndLow] = this._rangeValues[pointIndex].low;
        dpt["item"][bndOpen] = this._rangeValues[pointIndex].open;
        dpt["item"][bndClose] = this._rangeValues[pointIndex].close;

        // set x & y related data
        dpt["y"] = this._rangeValues[pointIndex].close;
        dpt["yfmt"] = ay._formatValue(this._rangeValues[pointIndex].close);
        dpt["x"] = dpt["item"][bndX];
        dpt["xfmt"] = this._rangeXLabels[pointIndex]._text;

        return dpt;
    }

    // initialize variables for calculations
    _init(): void {
        this._rangeValues = [];
        this._rangeXLabels = [];
    }

    // abstract method
    _calculate(series: FinancialSeries): void { }

    // generates new labels for the x-axis based on derived data
    _generateXLabels(series: FinancialSeries): void {
        var textVal: string,
            ax = series._getAxisX(),
            dataType = series.getDataType(1) || this.chart._xDataType;

        // todo: find a better way and/or separate
        this._rangeValues.forEach((value: _IFinanceItem, index: number) => {
            var val = value.x;
            if (dataType === wijmo.DataType.Date) {
                textVal = wijmo.Globalize.format(wijmo.chart.FlexChart._fromOADate(val), ax.format || "d");
            } else if (dataType === wijmo.DataType.Number) {
                textVal = ax._formatValue(val);
            } else if ((dataType === null || dataType === wijmo.DataType.String) && this.chart._xlabels) {
                textVal = this.chart._xlabels[val];
            } else {
                textVal = val.toString();
            }

            // _text property will be used as a backup for the text property
            // there could be cases, like Renko, where text is cleared
            this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
        }, this);
    }
}

/**
 * Specifies which fields are to be used for calculation. Applies to Renko and Kagi chart types.
 */
export enum DataFields {
    /** Close values are used for calculations. */
    Close,
    /** High values are used for calculations. */
    High,
    /** Low values are used for calculations. */
    Low,
    /** Open values are used for calculations. */
    Open,
    /** High-Low method is used for calculations. DataFields.HighLow is currently not
     * supported with Renko chart types. */
    HighLow,
    /** Average of high and low values is used for calculations. */
    HL2,
    /** Average of high, low, and close values is used for calculations. */
    HLC3,
    /** Average of high, low, open, and close values is used for calculations. */
    HLOC4
}

/**
 * Specifies the unit for Kagi and Renko chart types.
 */
export enum RangeMode {
    /** Uses a fixed, positive number for the Kagi chart's reversal amount
     * or Renko chart's box size. */
    Fixed,
    /** Uses the current Average True Range value for Kagi chart's reversal amount
     * or Renko chart's box size. When ATR is used, the reversal amount or box size
     * option of these charts must be an integer and will be used as the period for 
     * the ATR calculation. */
    ATR,
    /** Uses a percentage for the Kagi chart's reversal amount. RangeMode.Percentage
     * is currently not supported with Renko chart types. */
    Percentage
}
    }
    


    module wijmo.chart.finance {
    

 



"use strict";

/**
 * Specifies the scaling mode for point and figure chart.
 */
export enum PointAndFigureScaling {
    /** Traditional scaling. The box size is calculated automatically based on price range.  */
    Traditional,
    /** Fixed scaling. The box size is defined by boxSize property. */
    Fixed,
    /** Dynamic(ATR) scaling. The box size is calculated based on ATR. */
    Dynamic,
    // TODO: Percentage,
}

// Plotter for PointAndFigure FinancialChartType
export class _PointAndFigurePlotter extends wijmo.chart._BasePlotter {
    private _boxSize: number;
    private _reversal: number;
    private _period: number; // ATR period
    private _fields: DataFields;
    private _scaling: PointAndFigureScaling;

    private _actualBoxSize: number;
    private _pfdata: any[] | null;
    private _xlbls: any[] | null;
    private axisYMajorGrid: boolean;

    constructor() {
        super();
    }

    clear(): void {
        super.clear();
        this._boxSize = null;
        this._fields = null;
        this._reversal = null;
        this._scaling = null;
    }

    unload(): void {
        super.unload();
        this.chart.axisX.itemsSource = this._xlbls;
    }

    _init(): void {

        this._boxSize = this.getNumOption("boxSize", "pointAndFigure") || 1;
        this._reversal = this.getNumOption("reversal", "pointAndFigure") || 3;
        this._period = this.getNumOption("period", "pointAndFigure") || 20;

        // DataFields
        this._fields = this.getOption("fields", "pointAndFigure") || DataFields.Close;
        this._fields = wijmo.asEnum(this._fields, DataFields, true);

        // todo: figure out HighLow
        wijmo.assert((this._fields == DataFields.Close) || (this._fields == DataFields.HighLow),
            "Only DataFields.Close and DataFields.HighLow are supported");

        this._scaling = this.getOption("scaling", "pointAndFigure") || PointAndFigureScaling.Traditional;
        this._scaling = wijmo.asEnum(this._scaling, PointAndFigureScaling, true);

        this._xlbls = [];
    }

    adjustLimits(dataInfo: wijmo.chart._DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this._init();

        this.hitTester.clear();

        let rect: wijmo.Rect = new wijmo.Rect(0,0,0,0);
        let len = this.chart.series.length;

        // only one supported at the moment - possibly remove later for overlays & indicators
        wijmo.assert( len <= 1, "Current FinancialChartType only supports a single series");

        if (len > 0) {
            let series: FinancialSeries = this.chart.series[0];

            let reversal = this._reversal;
            let cv = series.collectionView ? series.collectionView : this.chart.collectionView;
            let data = cv ? cv.items : null;

            if (data && data.length > 0) {

                let bnd0 = series._getBinding(0);
                let bnd1 = series._getBinding(1);
                let bnd2 = series._getBinding(2);
                let bnd3 = series._getBinding(3);

                if (this._fields == DataFields.Close) {
                    if (bnd3) {
                        bnd0 = bnd3; // HLOC
                    } else if (bnd2) {
                        bnd0 = bnd2; // HLC
                    }

                    bnd1 = bnd0;
                }

                let xbnd = series.bindingX ? series.bindingX : this.chart.bindingX;

                let boxSize = this._actualBoxSize = this.calcBoxSize(data, bnd0, bnd1);

                this._pfdata = this.calcPFHiLo2(data, bnd0, bnd1, xbnd, boxSize, reversal);

                if (this._pfdata && this._pfdata.length > 0) {
                    var max = this._pfdata.reduce(function (a: any, b: any) {
                        return Math.max(a, b.max);
                    }, this._pfdata[0].max);
                    var min = this._pfdata.reduce(function (a: any, b: any) {
                        return Math.min(a, b.min);
                    }, this._pfdata[0].min);

                    rect = new wijmo.Rect(-0.5, min - 0.5 * boxSize, this._pfdata.length, max - min + boxSize);

                    for (var i = 1; i < this._pfdata.length; i++) {
                        var item0 = this._pfdata[i-1];
                        var item = this._pfdata[i];
                        if (wijmo.isDate(item.date) && wijmo.isDate(item0.date) && item.date.getYear() != item0.date.getYear()) {
                            this._xlbls.push({ value: i, text: wijmo.Globalize.formatNumber(item.date.getFullYear() % 100, 'd2') });
                        }
                    }
                }
            }
        } 

        if (this._xlbls.length == 0) {
            this._xlbls.push({ value: 0 });
        }
        //#345052, save axisY's majorGrid
        let ay = this.chart.axisY;
        this.axisYMajorGrid = ay.majorGrid;
        ay._chart = null;
        ay.majorGrid = false;
        ay._chart = this.chart;
        this.chart.axisX.itemsSource = this._xlbls;

        return rect;
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: FinancialSeries, palette: wijmo.chart._IPalette, iser: number, nser: number): void {
        if (this._pfdata && this._pfdata.length>0) {
            var boxSize = this._actualBoxSize;
            this.renderGrid(engine, this._pfdata, boxSize);
            this.renderData(this.chart, engine, this._pfdata, boxSize);
        }
        //#345052, load axisY's majorGrid;
        let axy = this.chart.axisY;
        axy._chart = null;
        axy.majorGrid = this.axisYMajorGrid;
        axy._chart = this.chart;
    }

    private calcBoxSize(data: any[], fieldHi: string, fieldLo: string): number {
        var high = data.reduce(function (a: any, b: any) {
            return Math.max(a, b[fieldHi]);
        }, data[0][fieldHi]);
        var low = data.reduce(function (a: any, b: any) {
            return Math.min(a, b[fieldLo]);
        }, data[0][fieldLo]);

        var boxSize = this._boxSize;
        var range = high - low;
        switch (this._scaling) {
            case PointAndFigureScaling.Traditional:
                if (range < 0.25) {
                    boxSize = 0.0625;
                } else if (range >= 0.25 && range < 1.00) {
                    boxSize = 0.125;
                } else if (range >= 1.00 && range < 5.00) {
                    boxSize = 0.25;
                } else if (range >= 5.00 && range < 20.00) {
                    boxSize = 0.50;
                } else if (range >= 20.00 && range < 100) {
                    boxSize = 1.00
                } else if (range >= 100 && range < 200) {
                    boxSize = 2.00;
                } else if (range >= 200 && range < 500) {
                    boxSize = 4.00;
                } else if (range >= 500 && range < 1000) {
                    boxSize = 5.00
                } else if (range >= 1000 && range < 25000) {
                    boxSize = 50.00;
                } else if (range > - 25000) {
                    boxSize = 500;
                }
                break;
            case PointAndFigureScaling.Dynamic:
                let series: FinancialSeries = this.chart.series[0];
                let highs = series._getBindingValues(0),
                    lows = series._getBindingValues(1),
                    opens = series._getBindingValues(2),
                    closes = series._getBindingValues(3);
                var atrs = _avgTrueRng(highs, lows, closes, this._period);
                boxSize = atrs[atrs.length - 1];
                break;
            case PointAndFigureScaling.Fixed:
                break;
            default:
                break;
        }
        return boxSize;
    }

    private calcPFHiLo2(data, fieldHi: string, fieldLo: string, xbnd: string, boxSize: number, reversal: number): any[] {
        let result: any[] = [];

        for (let i = 0; i < data.length; i++) {
            let high = data[i][fieldHi];
            let low = data[i][fieldLo];
            wijmo.assert(high >= low, "'High' value must be larger than 'low' value.");

            let date = data[i][xbnd];

            if (result.length == 0) {
                result.push({ min: this.roundDown(low, boxSize), max: this.roundDown(high, boxSize), rise: false, date: date });
            } else {
                var cur: any = result[result.length - 1];
                if (cur.rise) {
                    var ap1: number = cur.max + boxSize;
                    var ap2: number = cur.max - reversal * boxSize;

                    if (this.roundUp(high, boxSize) >= ap1) {
                        cur.max = this.roundUp(high, boxSize);
                    } else if (low <= ap2) {
                        result.push({ min: this.roundDown(low, boxSize), max: cur.max - boxSize, rise: false, date: date });
                    }
                } else {
                    var ap1: number = cur.min - boxSize;
                    var ap2: number = cur.min + reversal * boxSize;

                    if (this.roundDown(low, boxSize) <= ap1) {
                        cur.min = this.roundDown(low, boxSize);
                    } else if (high >= ap2) {
                        result.push({ min: cur.min + boxSize, max: this.roundUp(high, boxSize), rise: true, date: date });
                    }
                }
            }
        }

        if (result.length > 0) {
            var item: any = result[0];
            if (item.min == item.max) {
                result.splice(0, 1);
            }
        }

        return result;
    }

    private roundUp(val, boxSize) {
        return Math.ceil(val / boxSize - 0.999999) * boxSize;
    }

    private roundDown(val, boxSize) {
        return Math.floor(val / boxSize + 0.999999) * boxSize;
    }

    private renderGrid(engine: wijmo.chart.IRenderEngine, data: any[], boxSize: number): void {
        if (this._pfdata) {
            var max = this._pfdata.reduce(function (a: any, b: any) {
                return Math.max(a, b.max);
            }, this._pfdata[0].max);
            var min = this._pfdata.reduce(function (a: any, b: any) {
                return Math.min(a, b.min);
            }, this._pfdata[0].min);

            var chart = this.chart;
            var xmin = -0.5;
            var xmax = this._pfdata.length;

            for (var val = min - 0.5 * boxSize; val <= max + boxSize; val += boxSize) {
                var pt1 = new wijmo.Point(xmin, val);
                pt1 = chart.dataToPoint(pt1);
                var pt2 = new wijmo.Point(xmax, val);
                pt2 = chart.dataToPoint(pt2);
                engine.stroke = wijmo.chart.FlexChartCore._FG;
                engine.strokeWidth = 1;
                engine.drawLine(pt1.x, pt1.y, pt2.x, pt2.y, wijmo.chart.FlexChartCore._CSS_GRIDLINE);
            }

            for (var x = xmin; x <= xmax; x += 1) {
                var pt1 = new wijmo.Point(x, this.chart.axisY.actualMin);
                pt1 = chart.dataToPoint(pt1);
                var pt2 = new wijmo.Point(x, this.chart.axisY.actualMax);
                pt2 = chart.dataToPoint(pt2);
                engine.stroke = wijmo.chart.FlexChartCore._FG;
                engine.strokeWidth = 1;
                engine.drawLine(pt1.x, pt1.y, pt2.x, pt2.y, wijmo.chart.FlexChartCore._CSS_GRIDLINE);
            }

        }
    }

    private renderData(chart: wijmo.chart.FlexChartCore, engine: wijmo.chart.IRenderEngine, data: any[], boxSize: number) {
        let si = 0; // single series
        let series = chart.series[0];

        let stroke = series._getSymbolStroke(si),
            altStroke = series._getAltSymbolStroke(si) || stroke;

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let nsym = (data[i].max - data[i].min) / boxSize;
            if (nsym == 0) {
                continue;
            }

            let pt1 = new wijmo.Point(i - 0.5, item.min);
            pt1 = chart.dataToPoint(pt1);
            let pt2 = new wijmo.Point(i + 0.5, item.max);
            pt2 = chart.dataToPoint(pt2);

            engine.fill = 'transparent';

            let h0 = (pt2.y - pt1.y) / nsym;
            for (var j = 0; j < nsym + 1; j++) {
                engine.strokeWidth = 1.5;
                if (item.rise) {
                    engine.stroke = stroke;
                    engine.drawLine(pt1.x, pt1.y + (j - 0.5) * h0, pt2.x, pt1.y + (j + 0.5) * h0);
                    engine.drawLine(pt2.x, pt1.y + (j - 0.5) * h0, pt1.x, pt1.y + (j + 0.5) * h0);
                } else {
                    engine.stroke = altStroke;
                    engine.drawEllipse(0.5 * (pt1.x + pt2.x), pt1.y + j * h0, 0.5 * Math.abs(pt1.x - pt2.x), 0.5 * Math.abs(h0));
                }

                if (this.hitTester) {
                    let y = item.min + j * boxSize;
                    let dpt = new wijmo.chart._DataPoint(si, i, item.date, y);

                    dpt["y"] = y;
                    dpt["yfmt"] = this.chart.axisY._formatValue(y);
                    if (wijmo.isDate(item.date)) {
                        dpt["x"] = item.date;
                        dpt["xfmt"] = wijmo.Globalize.formatDate(item.date, 'd');
                    }

                    let rect = new wijmo.Rect(Math.min(pt1.x, pt2.x),
                        pt1.y + j * h0 - 0.5 * h0,
                        Math.abs(pt2.x - pt1.x),
                        h0);
                    if (rect.height < 0) {
                        rect.top += h0; rect.height = -rect.height;
                    }
                    let ra = new wijmo.chart._RectArea(rect);
                    ra.tag = dpt;
                    this.hitTester.add(ra, si);
                }
            }
        }
    }
}
    }
    


    module wijmo.chart.finance {
    





"use strict";

// Plotter for Kagi FinancialChartType
export class _KagiPlotter extends _BaseRangePlotter {
    // reversal amount, period, or percentage - based on unit
    private _reversalAmount: number;

    // unit for reversal
    private _rangeMode: RangeMode;

    // fields(s) to use in calculations
    private _fields: DataFields;

    constructor() {
        super();
    }

    _calculate(series: FinancialSeries): void {
        this._init();

        var highs = series._getBindingValues(0),
            lows = series._getBindingValues(1),
            opens = series._getBindingValues(2),
            closes = series._getBindingValues(3),
            xs = series.getValues(1) || this.chart._xvals;

        this._calculator = new _KagiCalculator(highs, lows, opens, closes, xs, this._reversalAmount, this._rangeMode, this._fields);
        this._rangeValues = this._calculator.calculate();
        if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
            this._rangeValues = [];
        }

        // always regenerate x-axis labels at the end of each calculation cycle
        this._generateXLabels(series);
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: FinancialSeries, palette: wijmo.chart._IPalette, iser: number, nser: number): void {
        this._calculate(series);

        var si = this.chart.series.indexOf(series),
            len = this._rangeValues.length,
            xmin = ax.actualMin,
            xmax = ax.actualMax,
            strWidth = this._DEFAULT_WIDTH,
            stroke = series._getSymbolStroke(si),
            altStroke = series._getAltSymbolStroke(si) || stroke,
            dx: number[] = [], dy: number[] = [];

        engine.stroke = stroke;
        engine.strokeWidth = strWidth;

        var itemIndex = 0, x: number,
            start: number, end: number,
            min: number, max: number,
            area: wijmo.chart._IHitArea, dpt: wijmo.chart._DataPoint;

        engine.startGroup();
        for (var i = 0; i < len; i++) {
            x = i;
            if (wijmo.chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                start = this._rangeValues[i].open;
                end = this._rangeValues[i].close;

                // main (vertical) line
                if (i === 0) {
                    min = Math.min(start, end);
                    max = Math.max(start, end);

                    // determine thinkness
                    engine.strokeWidth = start > end ? strWidth : strWidth * 2;

                    // determine stroke
                    engine.stroke = start > end ? stroke : altStroke;

                    // main line
                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));

                    // initial inflection line
                    engine.drawLine(ax.convert(x - 1) - (engine.strokeWidth / 2), ay.convert(start), ax.convert(x) + (engine.strokeWidth / 2), ay.convert(start));
                } else if (engine.strokeWidth === strWidth) {   // currently yin/thin/down
                    if (end > start) {  // up
                        if (end > max) {
                            // change in thickness
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(max));
                            engine.strokeWidth = strWidth * 2;
                            engine.stroke = altStroke;
                            engine.drawLine(ax.convert(x), ay.convert(max), ax.convert(x), ay.convert(end));

                            // new min
                            min = start;
                        } else {
                            // maintain current thickness
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                        }

                        // new max
                        max = end;
                    } else {  // down
                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                    }
                } else if ((engine.strokeWidth / 2) === strWidth) { // currently yang/thick/up
                    if (end < start) {  // down
                        if (end < min) {
                            // change in thickness
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(min));
                            engine.strokeWidth = strWidth;
                            engine.stroke = stroke;
                            engine.drawLine(ax.convert(x), ay.convert(min), ax.convert(x), ay.convert(end));

                            // new max
                            max = start;
                        } else {
                            // maintain thickness
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                        }

                        // new min
                        min = end;
                    } else {  // up
                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                    }
                }

                // inflection (horizontal) line
                if (i < (len - 1)) {
                    // x needs to account for engine.strokeWidth, after conversion, to prevent corner gaps
                    // where horizontal and vertical lines meet
                    engine.drawLine(ax.convert(x) - (engine.strokeWidth / 2), ay.convert(end), ax.convert(x + 1) + (engine.strokeWidth / 2), ay.convert(end));
                }

                // manually specify values for HitTestInfo
                dpt = this._getDataPoint(si, i, series, end);

                // add item to HitTester
                area = new wijmo.chart._CircleArea(new wijmo.Point(ax.convert(x), ay.convert(end)), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this.hitTester.add(area, si);

                // point index
                series._setPointIndex(i, itemIndex);
                itemIndex++;

                // append x/y values to collection for _LinesArea which
                // is needed for selection
                dx.push(ax.convert(x));
                dy.push(ay.convert(start));
                dx.push(ax.convert(x));
                dy.push(ay.convert(end));
            }
        }
        engine.endGroup();

        // add _LinesArea for selection
        this.hitTester.add(new wijmo.chart._LinesArea(dx, dy), si);
    }

    _init(): void {
        super._init();

        // ReversalAmount
        this._reversalAmount = this.getNumOption("reversalAmount", "kagi") || 14;

        // RangeMode
        this._rangeMode = this.getOption("rangeMode", "kagi") || RangeMode.Fixed;
        this._rangeMode = wijmo.asEnum(this._rangeMode, RangeMode, true);

        // DataFields
        this._fields = this.getOption("fields", "kagi") || DataFields.Close;
        this._fields = wijmo.asEnum(this._fields, DataFields, true);
    }

    clear(): void {
        super.clear();
        this._reversalAmount = null;
        this._rangeMode = null;
    }
}
    }
    


    module wijmo.chart.finance {
    




"use strict";

// Plotter for Renko FinancialChartType
export class _RenkoPlotter extends _BaseRangePlotter {
    // brick size or period - based on units
    private _boxSize: number;

    // mode for brick size
    private _rangeMode: RangeMode;

    // fields(s) to use in calculations
    private _fields: DataFields;

    // for stockcharts rounding
    private _rounding: boolean;

    constructor() {
        super();
    }

    clear(): void {
        super.clear();
        this._boxSize = null;
        this._rangeMode = null;
    }

    _calculate(series: FinancialSeries): void {
        this._init();

        var highs = series._getBindingValues(0),
            lows = series._getBindingValues(1),
            opens = series._getBindingValues(2),
            closes = series._getBindingValues(3),
            xs = series.getValues(1) || this.chart._xvals;

        this._calculator = new _RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
        this._rangeValues = this._calculator.calculate();
        if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
            this._rangeValues = [];
        }

        // always regenerate x-axis labels at the end of each calculation cycle
        this._generateXLabels(series);
    }

    _init(): void {
        super._init();

        // BoxSize
        this._boxSize = this.getNumOption("boxSize", "renko") || 14;

        // RangeMode
        this._rangeMode = this.getOption("rangeMode", "renko") || RangeMode.Fixed;
        this._rangeMode = wijmo.asEnum(this._rangeMode, RangeMode, true);
        wijmo.assert(this._rangeMode !== RangeMode.Percentage, "RangeMode.Percentage is not supported");

        // DataFields
        this._fields = this.getOption("fields", "renko") || DataFields.Close;
        this._fields = wijmo.asEnum(this._fields, DataFields, true);

        // todo: figure out HighLow
        wijmo.assert(this._fields !== DataFields.HighLow, "DataFields.HighLow is not supported");

        // rounding - internal only
        this._rounding = wijmo.asBoolean(this.getOption("rounding", "renko"), true);
    }

    _generateXLabels(series: FinancialSeries): void {
        super._generateXLabels(series);

        // bricks may have duplicate x-labels - prevent that behavior
        this._rangeXLabels.forEach((value: any, index: number) => {
            // compare current item's text property to the previous item's _text property (backup for text)
            if (index > 0 && this._rangeXLabels[index - 1]._text === value.text) {
                value.text = "";
            }
        }, this);
    }
}
    }
    


    module wijmo.chart.finance {
    




"use strict";

// Plotter for Line Break FinancialChartType
export class _LineBreakPlotter extends _BaseRangePlotter {
    // specifies number of lines that need to be broken in order for a reversal to occur
    private _newLineBreaks: number;

    constructor() {
        super();
    }

    clear(): void {
        super.clear();
        this._newLineBreaks = null;
    }

    _calculate(series: FinancialSeries): void {
        this._init();

        var closes = series._getBindingValues(3),
            xs = series.getValues(1) || this.chart._xvals;

        this._calculator = new _LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
        this._rangeValues = this._calculator.calculate();
        if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
            this._rangeValues = [];
        }

        // always regenerate x-axis labels at the end of each calculation cycle
        this._generateXLabels(series);
    }

    _init(): void {
        super._init();

        // NewLineBreaks
        this._newLineBreaks = wijmo.asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
        wijmo.assert(this._newLineBreaks >= 1, "Value must be greater than 1");
    }
}
    }
    


    module wijmo.chart.finance {
    




"use strict";

// Plotter for Heikin-Ashi FinancialChartType
export class _HeikinAshiPlotter extends wijmo.chart._FinancePlotter {
    private _haValues: _IFinanceItem[];
    private _calculator: _BaseCalculator;
    private _symFactor = 0.7;

    constructor() {
        super();
        this.clear();
    }

    clear(): void {
        super.clear();
        this._haValues = null;
        this._calculator = null;
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: FinancialSeries, palette: wijmo.chart._IPalette, iser: number, nser: number): void {
        this._calculate(series);

        var ser: wijmo.chart.SeriesBase = wijmo.asType(series, wijmo.chart.SeriesBase),
            si = this.chart.series.indexOf(series),
            xs = series.getValues(1),
            sw = this._symFactor;

        var len = this._haValues.length,
            hasXs = true;

        if (!xs) {
            xs = this.dataInfo.getXVals();
        } else {
            // find minimal distance between point and use it as column width
            var delta = this.dataInfo.getDeltaX();
            if (delta > 0) {
                sw *= delta;
            }
        }

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
            symSize = sw,
            dt = series.getDataType(1) || series.chart._xDataType;

        engine.strokeWidth = swidth;

        var xmin = ax.actualMin,
            xmax = ax.actualMax,
            itemIndex = 0,
            currentFill: string, currentStroke: string,
            x: any, dpt: wijmo.chart._DataPoint,
            hi: number, lo: number, open: number, close: number;

        let ifmt = this.getItemFormatter(series);

        for (var i = 0; i < len; i++) {
            x = hasXs ? xs[i] : i;

            if (wijmo.chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                hi = this._haValues[i].high;
                lo = this._haValues[i].low;
                open = this._haValues[i].open;
                close = this._haValues[i].close;

                currentFill = open < close ? altFill : fill;
                currentStroke = open < close ? altStroke : stroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;

                engine.startGroup();

                // manually specify values for HitTestInfo
                dpt = this._getDataPoint(si, i, x, series);

                if (ifmt) {
                    var hti = new wijmo.chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)), wijmo.chart.ChartElement.SeriesSymbol);
                    hti._setData(ser, i);
                    hti._setDataPoint(dpt);

                    ifmt(engine, hti, () => {
                        this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                    });
                } else {
                    this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                }
                engine.endGroup();

                series._setPointIndex(i, itemIndex);
                itemIndex++;
            }
        }
    }

    // modified variation of FinancialPlotter's implementation - added optional _DataPoint parameter
    _drawSymbol(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, si: number, pi: number, fill: any, w: number,
                x: number, hi: number, lo: number, open: number, close: number, dpt?: wijmo.chart._DataPoint, dt?: wijmo.DataType) {
        var area: wijmo.chart._RectArea,
            y0 = null, y1 = null,
            x1 = null, x2 = null,
            half = dt === wijmo.DataType.Date ? 43200000 : 0.5;   // todo: better way?

        x1 = ax.convert(x - half * w);
        x2 = ax.convert(x + half * w);
        if (x1 > x2) {
            var tmp = x1; x1 = x2; x2 = tmp;
        }
        x = ax.convert(x);

        if (wijmo.chart._DataInfo.isValid(open) && wijmo.chart._DataInfo.isValid(close)) {
            open = ay.convert(open);
            close = ay.convert(close);
            y0 = Math.min(open, close);
            y1 = y0 + Math.abs(open - close);

            engine.drawRect(x1, y0, x2 - x1, y1 - y0);

            area = new wijmo.chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
            area.tag = dpt;
            this.hitTester.add(area, si);
        }
        if (wijmo.chart._DataInfo.isValid(hi)) {
            hi = ay.convert(hi);
            if (y0 !== null) {
                engine.drawLine(x, y0, x, hi);
                area.rect.top = hi;
                area.rect.height = area.rect.height + hi;
            }
        }
        if (wijmo.chart._DataInfo.isValid(lo)) {
            lo = ay.convert(lo);
            if (y1 !== null) {
                engine.drawLine(x, y1, x, lo);
                area.rect.height = area.rect.height + lo;
            }
        }
    }

    // generates _DataPoint for hit test support
    _getDataPoint(seriesIndex: number, pointIndex: number, x: any, series: wijmo.chart.SeriesBase): wijmo.chart._DataPoint {
        var dpt = new wijmo.chart._DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high),
            item = series._getItem(pointIndex),
            bndHigh = series._getBinding(0),
            bndLow = series._getBinding(1),
            bndOpen = series._getBinding(2),
            bndClose = series._getBinding(3),
            ay = series._getAxisY();

        // set item related data and maintain original binding
        if (item != null) {
            dpt["item"] = wijmo.chart._BasePlotter.cloneStyle(item, []);
            dpt["item"][bndHigh] = this._haValues[pointIndex].high;
            dpt["item"][bndLow] = this._haValues[pointIndex].low;
            dpt["item"][bndOpen] = this._haValues[pointIndex].open;
            dpt["item"][bndClose] = this._haValues[pointIndex].close;
        }

        // set y related data
        dpt["y"] = this._haValues[pointIndex].high;
        dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);
        // don't set "x" or "xfmt" values - can use default behavior

        return dpt;
    }

    private _calculate(series: FinancialSeries): void {
        var highs = series._getBindingValues(0),
            lows = series._getBindingValues(1),
            opens = series._getBindingValues(2),
            closes = series._getBindingValues(3);

        this._calculator = new _HeikinAshiCalculator(highs, lows, opens, closes);
        this._haValues = this._calculator.calculate();
        if (this._haValues === null || wijmo.isUndefined(this._haValues)) {
            this._init();
        }
    }

    private _init(): void {
        this._haValues = [];
    }
}
    }
    


    module wijmo.chart.finance {
    










'use strict';

/**
 * Specifies the type of financial chart.
 */
export enum FinancialChartType {
    /** Shows vertical bars and allows you to compare values of items across categories. */
    Column,
    /** Uses X and Y coordinates to show patterns within the data. */
    Scatter,
    /** Shows trends over a period of time or across categories. */
    Line,
    /** Shows line chart with a symbol on each data point. */
    LineSymbols,
    /** Shows line chart with area below the line filled with color. */
    Area,
    /** Presents items with high, low, open, and close values.
     * The size of the wick line is determined by the High and Low values, while
     * the size of the bar is determined by the Open and Close values. The bar is
     * displayed using different colors, depending on whether the close value is
     * higher or lower than the open value. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty".  */
    Candlestick,
    /** Displays the same information as a candlestick chart, except that opening
     * values are displayed using lines to the left, while lines to the right
     * indicate closing values. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    HighLowOpenClose,
    /** Derived from the candlestick chart and uses information from the current and
     * prior period in order to filter out the noise. These charts cannot be combined
     * with any other series objects. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    HeikinAshi,
    /** Filters out noise by focusing exclusively on price changes. These charts cannot
     * be combined with any other series objects. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    LineBreak,
    /** Ignores time and focuses on price changes that meet a specified amount. These
     * charts cannot be combined with any other series objects. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    Renko,
    /** Ignores time and focuses on price action. These charts cannot be combined with
     * any other series objects. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "highProperty, lowProperty, openProperty, closeProperty". */
    Kagi,
    /** Identical to the standard Column chart, except that the width of each bar is
     * determined by the Volume value. The data for this chart type can be defined using the
     *  {@link FinancialChart} or {@link FinancialSeries} <b>binding</b> property as a comma separated value in the
     * following format: "yProperty, volumeProperty".  This chart type can only be used at
     * the {@link FinancialChart} level, and should not be applied on
     * {@link FinancialSeries} objects. Only one set of volume data is currently supported
     * per {@link FinancialChart}. */
    ColumnVolume,
    /** Similar to the Candlestick chart, but shows the high and low values only.
     * In addition, the width of each bar is determined by Volume value. The data for
     * this chart type can be defined using the  {@link FinancialChart} or {@link FinancialSeries}
     * <b>binding</b> property as a comma separated value in the following format:
     * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
     * This chart type can only be used at the {@link FinancialChart} level, and should not
     * be applied on {@link FinancialSeries} objects. Only one set of volume data is currently
     * supported per {@link FinancialChart}. */
    EquiVolume,
    /** Identical to the standard Candlestick chart, except that the width of each
     * bar is determined by Volume value. The data for
     * this chart type can be defined using the  {@link FinancialChart} or {@link FinancialSeries}
     * <b>binding</b> property as a comma separated value in the following format:
     * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
     * This chart type can only be used at the {@link FinancialChart} level, and should not
     * be applied on {@link FinancialSeries} objects. Only one set of volume data is currently
     * supported per {@link FinancialChart}. */
    CandleVolume,
    /** Created by Richard Arms, this chart is a combination of EquiVolume and
     * CandleVolume chart types. The data for
     * this chart type can be defined using the  {@link FinancialChart} or {@link FinancialSeries}
     * <b>binding</b> property as a comma separated value in the following format:
     * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
     * This chart type can only be used at the {@link FinancialChart} level, and should not
     * be applied on {@link FinancialSeries} objects. Only one set of volume data is currently
     * supported per {@link FinancialChart}. */
    ArmsCandleVolume,
    /**
     * Point and figure financial chart.
     * The data for this chart type can be defined using the  {@link FinancialChart}
     * or {@link FinancialSeries} <b>binding</b> property as a comma separated value in
     * the following format: "highProperty, lowProperty, closeProperty".
     * This chart type can only be used at the {@link FinancialChart} level, and should not
     * be applied on {@link FinancialSeries} objects. */
    PointAndFigure
}

/**
 * Financial charting control.
 */
export class FinancialChart extends wijmo.chart.FlexChartCore {

    private _chartType = FinancialChartType.Line;

    private __heikinAshiPlotter = null;
    private __lineBreakPlotter = null;
    private __renkoPlotter = null;
    private __kagiPlotter = null;
    private __pfPlotter = null;

    /**
     * Initializes a new instance of the {@link FlexChart} class.
     *
     * @param element The DOM element that hosts the control, or a selector for the
     * host element (e.g. '#theCtrl').
     * @param options A JavaScript object containing initialization data for the
     * control.
     */
    constructor(element: any, options?: any) {
        super(element, null);
        this.initialize(options);
    }
    _getProductInfo(): string {
        return 'A78U,FinancialChart';
    }

    /**
     * Gets or sets the type of financial chart to create.
     */
    get chartType(): FinancialChartType {
        return this._chartType;
    }
    set chartType(value: FinancialChartType) {
        value = wijmo.asEnum(value, FinancialChartType);
        if (value != this._chartType) {
            this._chartType = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets various chart options.
     *
     * The following options are supported:
     *
     * <b>kagi.fields</b>: Specifies the {@link DataFields} used for
     * the Kagi chart. The default value is DataFields.Close.
     *
     * <b>kagi.rangeMode</b>: Specifies the {@link RangeMode} for
     * the Kagi chart. The default value is RangeMode.Fixed.
     *
     * <b>kagi.reversalAmount</b>: Specifies the reversal amount for
     * the Kagi chart. The default value is 14.
     *
     * <pre>chart.options = {
     *   kagi: {
     *      fields: DataFields.Close,
     *      rangeMode: RangeMode.Fixed,
     *      reversalAmount: 14
     *   }
     * }</pre>
     *
     * <b>lineBreak.newLineBreaks</b>: Gets or sets the number of previous
     * boxes that must be compared before a new box is drawn in
     * Line Break charts. The default value is 3.
     *
     * <pre>chart.options = {
     *   lineBreak: { newLineBreaks: 3 }
     * }</pre>
     *
     * <b>renko.fields</b>: Specifies the {@link DataFields} used for
     * the Renko chart. The default value is DataFields.Close.
     *
     * <b>renko.rangeMode</b>: Specifies the {@link RangeMode} for
     * the Renko chart. The default value is RangeMode.Fixed.
     *
     * <b>renko.boxSize</b>: Specifies the box size for
     * the Renko chart. The default value is 14.
     *
     * <pre>chart.options = {
     *   renko: {
     *      fields: DataFields.Close,
     *      rangeMode: RangeMode.Fixed,
     *      boxSize: 14
     *   }
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

    private get _heikinAshiPlotter(): wijmo.chart._IPlotter {
        if (this.__heikinAshiPlotter === null) {
            this.__heikinAshiPlotter = new _HeikinAshiPlotter();
            this._initPlotter(this.__heikinAshiPlotter);
        }
        return this.__heikinAshiPlotter;
    }

    private get _lineBreakPlotter(): wijmo.chart._IPlotter {
        if (this.__lineBreakPlotter === null) {
            this.__lineBreakPlotter = new _LineBreakPlotter();
            this._initPlotter(this.__lineBreakPlotter);
        }
        return this.__lineBreakPlotter;
    }

    private get _renkoPlotter(): wijmo.chart._IPlotter {
        if (this.__renkoPlotter === null) {
            this.__renkoPlotter = new _RenkoPlotter();
            this._initPlotter(this.__renkoPlotter);
        }
        return this.__renkoPlotter;
    }

    private get _kagiPlotter(): wijmo.chart._IPlotter {
        if (this.__kagiPlotter === null) {
            this.__kagiPlotter = new _KagiPlotter();
            this._initPlotter(this.__kagiPlotter);
        }
        return this.__kagiPlotter;
    }

    private get _pfPlotter(): wijmo.chart._IPlotter {
        if (this.__pfPlotter === null) {
            this.__pfPlotter = new _PointAndFigurePlotter();
            this._initPlotter(this.__pfPlotter);
        }
        return this.__pfPlotter;
    }

    _getChartType(): wijmo.chart.ChartType {
        var ct = null;
        switch (this.chartType) {
            case FinancialChartType.Area:
                ct = wijmo.chart.ChartType.Area;
                break;
            case FinancialChartType.Line:
            case FinancialChartType.Kagi:
            case FinancialChartType.PointAndFigure:
                ct = wijmo.chart.ChartType.Line;
                break;
            case FinancialChartType.Column:
            case FinancialChartType.ColumnVolume:
                ct = wijmo.chart.ChartType.Column;
                break;
            case FinancialChartType.LineSymbols:
                ct = wijmo.chart.ChartType.LineSymbols;
                break;
            case FinancialChartType.Scatter:
                ct = wijmo.chart.ChartType.Scatter;
                break;
            case FinancialChartType.Candlestick:
            case FinancialChartType.Renko:
            case FinancialChartType.HeikinAshi:
            case FinancialChartType.LineBreak:
            case FinancialChartType.EquiVolume:
            case FinancialChartType.CandleVolume:
            case FinancialChartType.ArmsCandleVolume:
                ct = wijmo.chart.ChartType.Candlestick;
                break;
            case FinancialChartType.HighLowOpenClose:
                ct = wijmo.chart.ChartType.HighLowOpenClose;
                break;
        }

        return ct;
    }

    _getPlotter(series: FinancialSeries): wijmo.chart._IPlotter {
        var chartType = this.chartType,
            plotter: any = null,
            isSeries = false;

        if (series) {
            var stype = series.chartType;
            if (stype && !wijmo.isUndefined(stype) && stype != chartType) {
                chartType = stype;
                isSeries = true;
            }
        }

        switch (chartType) {
            case FinancialChartType.HeikinAshi:
                plotter = this._heikinAshiPlotter;
                break;
            case FinancialChartType.LineBreak:
                plotter = this._lineBreakPlotter;
                break;
            case FinancialChartType.Renko:
                plotter = this._renkoPlotter;
                break;
            case FinancialChartType.Kagi:
                plotter = this._kagiPlotter;
                break;
            case FinancialChartType.ColumnVolume:
                plotter = super._getPlotter(series);
                plotter.isVolume = true;
                plotter.width = 1;
                break;
            case FinancialChartType.EquiVolume:
                plotter = super._getPlotter(series);
                plotter.isEqui = true;
                plotter.isCandle = false;
                plotter.isArms = false;
                plotter.isVolume = true;
                plotter.symbolWidth = "100%";
                break;
            case FinancialChartType.CandleVolume:
                plotter = super._getPlotter(series);
                plotter.isEqui = false;
                plotter.isCandle = true;
                plotter.isArms = false;
                plotter.isVolume = true;
                plotter.symbolWidth = "100%";
                break;
            case FinancialChartType.ArmsCandleVolume:
                plotter = super._getPlotter(series);
                plotter.isEqui = false;
                plotter.isCandle = false;
                plotter.isArms = true;
                plotter.isVolume = true;
                plotter.symbolWidth = "100%";
                break;
            case FinancialChartType.PointAndFigure:
                plotter = this._pfPlotter;
                break;
            // no plotter found for FinancialChartType - try based on ChartType
            default:
                plotter = super._getPlotter(series);
                break;
        }

        return plotter;
    }

    _createSeries(): wijmo.chart.SeriesBase {
        return new FinancialSeries();
    }
}
    }
    


    module wijmo.chart.finance {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.finance', wijmo.chart.finance);












    }
    