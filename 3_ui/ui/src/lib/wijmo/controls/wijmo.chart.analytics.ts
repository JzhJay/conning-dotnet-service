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


    module wijmo.chart.analytics {
    


'use strict';

/**
 * Represents a Waterfall series of {@link FlexChart}.
 *
 * The {@link Waterfall} series is normally used to demonstrate how
 * the starting position either increases or decreases through a
 * series of changes.
 */
export class Waterfall extends wijmo.chart.SeriesBase {
    static CSS_CONNECTOR_LINE_GROUP = 'water-fall-connector-lines';
    static CSS_CONNECTOR_LINE = 'water-fall-connector-line';
    static CSS_ENDLABEL = 'water-fall-end-label';

    _barPlotter: wijmo.chart._BarPlotter;
    private _start: number;
    private _startLabel = 'Start';
    private _relativeData = true;
    private _connectorLines = false;
    private _showTotal = false;
    private _totalLabel = 'Total';
    private _styles: any;
    private _wfstyle: any;
    private _xValues: any[];
    private _getXValues = false;
    private _yValues: any[];
    private _showIntermediateTotal = false;
    private _intermediateTotalPositions: number[];
    private _intermediateTotalLabels: any;
    private _intermediateTotalPos: any[] = [];

    /**
     * Initializes a new instance of the {@link Waterfall} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._chartType = wijmo.chart.ChartType.Bar;
        this.tooltipContent = "<b>{seriesName}</b><br/>{x} {value}";
        this.rendering.addHandler(this._rendering, this);
        this.initialize(options);
    }

    /**
     * Gets or sets a value that determines whether the given data
     * represents absolute or relative values (differences).
     */
    get relativeData(): boolean {
        return this._relativeData;
    }
    set relativeData(value: boolean) {
        if (value != this._relativeData) {
            this._relativeData = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines the value of the start bar.
     * If start is null, the start bar will not be shown.
     */
    get start(): number {
        return this._start;
    }
    set start(value: number) {
        if (value != this._start) {
            this._start = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the label of the start bar.
     */
    get startLabel(): string {
        return this._startLabel;
    }
    set startLabel(value: string) {
        if (value != this._startLabel) {
            this._startLabel = wijmo.asString(value, false);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show
     * the total bar at the end of the chart.
     */
    get showTotal(): boolean {
        return this._showTotal;
    }
    set showTotal(value: boolean) {
        if (value != this._showTotal) {
            this._showTotal = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the label of the total bar.
     */
    get totalLabel(): string {
        return this._totalLabel;
    }
    set totalLabel(value: string) {
        if (value != this._totalLabel) {
            this._totalLabel = wijmo.asString(value, false);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show intermediate
     * total bars.
     *
     * This property works with {@link intermediateTotalPositions} and
     * {@link intermediateTotalLabels} properties.
     */
    get showIntermediateTotal(): boolean {
        return this._showIntermediateTotal;
    }
    set showIntermediateTotal(value: boolean) {
        if (value != this._showIntermediateTotal) {
            this._showIntermediateTotal = wijmo.asBoolean(value, false);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value of the property that contains the index
     * for positions of the intermediate total bars.
     *
     * This property works with the {@link showIntermediateTotal} and
     * {@link intermediateTotalLabels} properties.
     */
    get intermediateTotalPositions(): number[] {
        return this._intermediateTotalPositions;
    }
    set intermediateTotalPositions(value: number[]) {
        if (value != this._intermediateTotalPositions) {
            this._intermediateTotalPositions = wijmo.asArray(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the name of the property that contains labels for
     * the intermediate total bars. This should be an array or a string.
     *
     * This property works with the {@link showIntermediateTotal} and
     * {@link intermediateTotalPositions} properties.
     */
    get intermediateTotalLabels(): any {
        return this._intermediateTotalLabels;
    }
    set intermediateTotalLabels(value: any) {
        if (value != this._intermediateTotalLabels) {
            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'Array or string expected.');
            this._intermediateTotalLabels = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show
     * connector lines.
     */
    get connectorLines(): boolean {
        return this._connectorLines;
    }
    set connectorLines(value: boolean) {
        if (value != this._connectorLines) {
            this._connectorLines = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
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
    get styles(): any {
        return this._styles;
    }
    set styles(value: any) {
        if (value != this._styles) {
            this._styles = value;
            this._invalidate();
        }
    }

    // ** implementation

    getValues(dim: number): number[] {
        var val = [],
            original, xVals, yVals, xLabels, maxX, len, offset = 0;

        original = super.getValues(dim);
        if (dim === 0) {
            if (!this._yValues) {
                var val = [], v = this.start != null ? this.start : 0, i = 0,
                    len = (original && original.length) || 0;

                if (this.relativeData) {
                    for (; i < len; i++) {
                        v += (isNaN(original[i]) ? 0 : original[i]);
                        val.push(v);
                    }
                    this._yValues = val;
                } else {
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
                        this.intermediateTotalPositions.reduceRight((prev, curr) => {
                            var val = curr === 0 ? yVals[0] : yVals[curr - 1];
                            if (yVals.length > curr) {
                                yVals.splice(curr, 0, val);
                                this._intermediateTotalPos.splice(curr, 0, true);
                            } else if (yVals.length === curr) {
                                yVals.push(val);
                                this._intermediateTotalPos.push(true);
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
        } else {
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
                            this.intermediateTotalPositions.reduceRight((prev, curr, idx) => {
                                var lbl = '';
                                if (wijmo.isString(itLabels)) {
                                    lbl = itLabels;
                                } else {
                                    lbl = itLabels[idx] || '';
                                }
                                if (xLabels.length > curr) {
                                    xLabels.splice(curr, 0, lbl);
                                } else if (xLabels.length === curr) {
                                    xLabels.push(lbl);
                                }
                                if (offset) {
                                    maxX += offset;
                                    this._xValues.push(maxX);
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
    }

    legendItemLength(): number {
        return (this.showTotal) ? 3 : 2;
    }

    measureLegendItem(engine: wijmo.chart.IRenderEngine, index: number): wijmo.Size {
        var name = this._getName(index);
        return name
            ? this._measureLegendItem(engine, name)
            : new wijmo.Size(0, 0);
    }

    drawLegendItem(engine: wijmo.chart.IRenderEngine, rect: wijmo.Rect, index: number): void {
        var style = this._getLegendStyles(index),
            name = this._getName(index);
        if (name) {
            this._drawLegendItem(engine, rect, wijmo.chart.ChartType.Bar, this._getName(index), style, this.symbolStyle);
        }
    }

    /*protected*/ _clearValues() {
        super._clearValues();
        this._xValues = null;
        this._yValues = null;
        this._wfstyle = null;
        this._getXValues = true;
        this._intermediateTotalPos = [];
        if (this.chart) {
            this.chart._performBind();
        }
    }

    /*protected*/ _invalidate() {
        super._invalidate();
        this._clearValues();
    }

    _getXOffset(): number {
        return this.start != null ? 1 : 0;
    }

    _getYOffset(pointIndex: number): number {
        return this.getValues(0)[pointIndex + this._getXOffset()];;
    }

    _getValue(pointIndex: number): number {
        let pi = pointIndex;
        if (this.start != null) {
            if (pointIndex == 0) {
                return this.start;
            } else {
                pointIndex--;
            }
        }

        if (this.showIntermediateTotal && this.intermediateTotalPositions) {
            if (this._intermediateTotalPos[pi] === true) {
                return this.getValues(0)[pi];
            };
        }

        return this.getValues(0)[pi];
    }

    _getItem(pi: number): any {
        let item = null;
        if (this.start != null) {
            if (pi == 0) {
                item = {};
                item[this.binding] = this.start;
            } else {
                pi--;
            }
        }

        if (this.showIntermediateTotal && this.intermediateTotalPositions) {
            let ps = this._intermediateTotalPos;
            if (ps[pi] === true) {
                item = {};
                item[this.binding] = this.getValues(0)[pi];
                return item;
            } else {
                let pic = pi;
                for (let i = 0; i < pi; i++) {
                    if (ps[i] === true) {
                        pic--;
                    }
                }
                pi = pic;
            }
        }

        if (!item) {
            item = super._getItem(pi);
            if (!item && this.showTotal && this._yValues && this._yValues.length > 0) {
                item = {};
                item[this.binding] = this._yValues[this._yValues.length - 1];
            }
        }

        return item;
    }

    private _rendering(sender: wijmo.chart.SeriesBase, args: wijmo.chart.SeriesRenderingEventArgs): void {
        args.cancel = true; // no default rendering

        this._wfstyle = null;
        var chart = this.chart,
            axisY = this._getAxisY(),
            axisX = this._getAxisX(),
            origin = axisY.origin || 0,
            engine: wijmo.chart.IRenderEngine = args.engine,
            i, len, rotated, areas, area, falling;

        this._barPlotter = <wijmo.chart._BarPlotter>chart._getPlotter(this);
        rotated = this._barPlotter.rotated;
        if (!this._barPlotter._getSymbolOrigin) {
            this._barPlotter._getSymbolOrigin = (origin, i, len) => {
                if (i === 0) {
                    //first
                    return origin;
                } else if (this._intermediateTotalPos[i] === true) {
                    //intermediateTotal
                    return origin;
                } else if (i === len - 1 && this.showTotal) {
                    //last
                    return origin;
                } else {
                    return this._yValues[i - 1];
                }
            };
        }
        if (!this._barPlotter._getSymbolStyles) {
            this._barPlotter._getSymbolStyles = (i, len) => {
                var wfStyle = this._getStyles(),
                    style = <any>{};

                if (i === 0 && this.start != null) { // first
                    style = wfStyle.start;
                } else if (this._intermediateTotalPos[i] === true) { // intermediateTotal
                    style = wfStyle.intermediateTotal;
                } else if (i === len - 1 && this.showTotal) { // last
                    style = wfStyle.total;
                } else {
                    if (i == 0) {
                        if (this._yValues[i] < 0) {
                            style = wfStyle.falling;
                        } else {
                            style = wfStyle.rising;
                        }
                    } else {
                        if (this._yValues[i] < this._yValues[i - 1]) { // falling
                            style = wfStyle.falling;
                        } else { // rising
                            style = wfStyle.rising;
                        }
                    }
                }
                return style;
            }
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
    }

    private _getStyles() {
        if (this._wfstyle) {
            return this._wfstyle;
        }
        var chart = this._chart,
            index = chart.series.indexOf(this),
            fill = this._getSymbolFill(index),
            stroke = this._getSymbolStroke(index),
            s = this.styles || {},
            style: any = {};

        this._wfstyle = {
            start: this._getStyleByKey(s, 'start', fill, stroke),
            intermediateTotal: this._getStyleByKey(s, 'intermediateTotal', fill, stroke),
            total: this._getStyleByKey(s, 'total', fill, stroke),
            falling: this._getStyleByKey(s, 'falling', 'red', 'red'),
            rising: this._getStyleByKey(s, 'rising', 'green', 'green')
        };

        return this._wfstyle;
    }

    private _getStyleByKey(styles, key, fill, stroke) {
        return {
            fill: styles[key] && styles[key].fill ? styles[key].fill : fill,
            stroke: styles[key] && styles[key].stroke ? styles[key].stroke : stroke
        }
    }

    private _drawConnectorLine(engine: wijmo.chart.IRenderEngine, rotated: boolean, prevArea: wijmo.Rect, currArea: wijmo.Rect, falling) {
        var p1 = new wijmo.Point(), p2 = new wijmo.Point(),
            reversed: any = this.chart.axisY.reversed,
            xReversed = this.chart.axisX.reversed;

        reversed = reversed ^ falling;
        if (rotated) {
            if (reversed) {
                p1.x = prevArea.left;
                p2.x = prevArea.left;
            } else {
                p1.x = prevArea.left + prevArea.width;
                p2.x = prevArea.left + prevArea.width;
            }
            if (xReversed) {
                p1.y = prevArea.top;
                p2.y = currArea.top + currArea.height;
            } else {
                p1.y = prevArea.top + prevArea.height;
                p2.y = currArea.top;
            }
        } else {
            if (reversed) {
                p1.y = prevArea.top + prevArea.height;
                p2.y = prevArea.top + prevArea.height;
            } else {
                p1.y = prevArea.top;
                p2.y = prevArea.top;
            }
            if (xReversed) {
                p1.x = prevArea.left + prevArea.width;
                p2.x = currArea.left;
            } else {
                p1.x = prevArea.left;
                p2.x = currArea.left + currArea.width;
            }
        }
        engine.drawLine(p1.x, p1.y, p2.x, p2.y, Waterfall.CSS_CONNECTOR_LINE, (this.styles && this.styles.connectorLines) || { stroke: 'black' });
    }

    // helper for series with multiple styles
    // Returns the appropriate style for the given index if ones exists
    // or null otherwise.
    private _getLegendStyles(index: number): any {
        if (index < 0 || this.styles === null) {
            return null;
        }

        var styles = this._getStyles();

        if (index === 0) {
            //rising
            return styles.rising;
        } else if (index === 1) {
            //falling
            return styles.falling;
        } else {
            //total
            return styles.total;
        }
    }

    // helper for series with multiple names (csv)
    // Returns undefined or the name.
    private _getName(index: number): string {
        var retval: string = undefined;

        if (this.name) {
            if (this.name.indexOf(",")) {
                var names = this.name.split(",");
                if (names && names.length - 1 >= index) {
                    retval = names[index].trim();
                }
            } else {
                retval = this.name;
            }
        }

        return retval;
    }
}
    }
    


    module wijmo.chart.analytics {
    




'use strict';

/**
 * Represents base class for various trend lines.
 */
export class TrendLineBase extends wijmo.chart.SeriesBase {
    private _sampleCount: number;
    private _bind: string;
    private _bindX: string;
    _xValues: any[];
    _yValues: any[];
    _originXValues: any[];
    _originYValues: any[];

    /**
     * Initializes a new instance of the {@link TrendLineBase} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._chartType = wijmo.chart.ChartType.Line;
        this._sampleCount = 100;
        this.initialize(options);
    }
    
    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the sample count for function calculation. 
     * The property doesn't apply for MovingAverage.
     */
    get sampleCount(): number {
        return this._sampleCount;
    }
    set sampleCount(value: number) {
        value = wijmo.asNumber(value, false, true);
        if (value != this._sampleCount) {
            this._sampleCount = value;
            this._invalidate();
        }
    }

    //--------------------------------------------------------------------------
    //** implementation

    /**
     * Gets the approximate y value from the given x value.
     * 
     * @param x The x value to be used for calculating the Y value.
     */
    approximate(x: number): number {
        return 0;
    }

    getValues(dim: number): number[]{
        var self = this,
            bind = self.binding,
            bindX = self.bindingX;

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
            self._originYValues = super.getValues(0);
        }
        if (self._originXValues == null) {
            self._originXValues = super.getValues(1);
        }
        if (self._originXValues == null || self._originYValues == null) {
            return null;
        }
        super.getValues(dim);

        if (self._xValues == null || self._yValues == null) {
            self._calculateValues();
        }

        if (dim === 0) {
            //y
            return self._yValues || null;
        } else if (dim === 1) {
            //x
            return self._xValues || null;
        }
    }

    _calculateValues() {
    }

    _invalidate() {
        super._invalidate();
        this._clearCalculatedValues();
    }

    _clearValues() {
        super._clearValues();

        this._originXValues = null;
        this._originYValues = null;
        this._clearCalculatedValues();
    }

    _clearCalculatedValues() {
        this._xValues = null;
        this._yValues = null;
    }

}
    }
    


    module wijmo.chart.analytics {
    



'use strict';

/**
 * Specifies the type of MovingAverage Series.
 */
export enum MovingAverageType {
    /** 
     * An average of the last n values.
     */
    Simple,
    /**
     * Weighted average of the last n values, 
     * where the weight decreases by 1 with each previous value.
     */
    Weighted,
    /**
     * Weighted average of the last n values, 
     * where the weight decreases exponentially with each previous value.
     */
    Exponential,
    /**
     * Weighted average of the last n values, 
     * whose result is equivalent to a double smoothed simple moving average. 
     */
    Triangular
}

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
export class MovingAverage extends TrendLineBase {
    // http://daytrading.about.com/od/indicators/a/Triangular.htm
    // http://daytrading.about.com/od/indicators/a/MovingAverages.htm
    // http://en.wikipedia.org/wiki/Moving_average
    private _period: number;
    private _type: MovingAverageType;

    /**
     * Initializes a new instance of the {@link MovingAverage} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._chartType = wijmo.chart.ChartType.Line;
        this._type = MovingAverageType.Simple;
        this._period = 2;
        this.initialize(options);
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the type of the moving average series.
     */
    get type(): MovingAverageType {
        return this._type;
    }
    set type(value: MovingAverageType) {
        value = wijmo.asEnum(value, MovingAverageType, false);
        if (value != this._type) {
            this._type = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the period of the moving average series.
     * It should be set to integer value greater than 1. 
     */
    get period(): number {
        return this._period;
    }
    set period(value: number) {
        var value = wijmo.asNumber(value, false, true);
        if (value != this._period) {
            this._period = wijmo.asNumber(value, false, true);
            this._invalidate();
        }
    }

    //--------------------------------------------------------------------------
    //** implementation

    _checkPeriod() {
        var period = this.period,
            oriXVals = this._originXValues;

        if (period <= 1) {
            wijmo.assert(false, "period must be greater than 1.");
        }
        if (oriXVals && oriXVals.length && period >= oriXVals.length) {
            wijmo.assert(false, "period must be less than itemSource's length.");
        }
    }

    _calculateValues() {
        var type = this._type,
            funcName = "_calculate" + MovingAverageType[this._type],
            x = [], y = [];

        this._checkPeriod();
        if (this[funcName]) {
            this[funcName].call(this, x, y);
        }

        this._yValues = y;
        this._xValues = x;
    }

    private _calculateSimple(x, y, forTMA: boolean = false) {
        var ox = this._originXValues,
            oy = this._originYValues,
            len = ox.length,
            p = this._period,
            total = 0;

        for (var i = 0; i < len; i++) {
            total += oy[i] || 0;
            if (i >= p) {
                total -= oy[i - p] || 0;
            }
            if (i >= p - 1) {
                x.push(ox[i]);
                y.push(total / p);
            } else if (forTMA) {
                x.push(ox[i]);
                y.push(total / (i + 1));
            }
        }
    }

    private _calculateWeighted(x, y) {
        var ox = this._originXValues,
            oy = this._originYValues,
            len = ox.length,
            p = this._period,
            denominator = p * (p + 1) / 2,
            total = 0, numerator = 0;

        for (var i = 0; i < len; i++) {
            if (i > 0) {
                total += oy[i - 1] || 0;
            }
            if (i > p) {
                total -= oy[i - p - 1] || 0;
            }

            if (i < p - 1) {
                numerator += (oy[i] || 0) * (i + 1);
            } else {
                numerator += (oy[i] || 0) * p;
                if (i > p - 1) {
                    numerator -= total;
                }
                x.push(ox[i]);
                y.push(numerator / denominator);
            }
        }
    }

    private _calculateExponential(x, y) {
        var ox = this._originXValues,
            oy = this._originYValues,
            len = ox.length,
            p = this._period,
            ema = 0;

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
    }

    private _calculateTriangular(x, y) {
        var p = this._period,
            ox = [], oy = [],
            total = 0;

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
    }
}
    }
    


    module wijmo.chart.analytics {
    


'use strict';

class MathHelper {
    // get rounded value by given digits.
    static round(val: number, digits?: number): number {
        if (!val) {
            return 0;
        }
        var rate = Math.pow(10, digits || 2);
        return Math.round(val * rate) / rate;
    }

    // determines minimum value in array of numbers
    static min = (values: number[]) => Math.min.apply(Math, wijmo.asArray(values, false));

    // determines maximum value in array of numbers
    static max = (values: number[]) => Math.max.apply(Math, wijmo.asArray(values, false));

    // determines the squared value of a number
    static square = (value: number) => Math.pow(wijmo.asNumber(value, false), 2);

    // determines the sum of squares from an array of numbers
    static sumOfSquares = (values: number[]) => MathHelper.sumOfPow(values, 2);

    // determines standard deviation from an array of numbers
    static stdDev = (values: number[]) => Math.sqrt(MathHelper.variance(values));

    // determines average value in array of numbers
    static avg(values: number[]): number {
        var sum = MathHelper.sum(values);
        return sum / values.length;
    }

    // determines sum of values in array of numbers
    static sum(values: number[]): number {
        values = wijmo.asArray(values, false);

        return values.reduce((prev, curr) => prev + curr, 0);
    }

    // determines sum of values to specified power
    static sumOfPow(values: number[], pow: number): number {
        values = wijmo.asArray(values, false);
        pow = wijmo.asNumber(pow, false);

        return values.reduce((prev, curr) => prev + Math.pow(curr, pow), 0);
    }

    // determines the sum product of two or more numeric arrays of equal length
    static sumProduct(...values: number[][]): number {
        var rows = values.length,
            cols = 0,
            vals = [],
            i, val;

        values = wijmo.asArray(values, false);

        values.forEach((row, idx) => {
            row = wijmo.asArray(row, false);
            if (idx === 0) {
                cols = row.length;
            } else {
                wijmo.assert(row.length === cols, 'The length of the arrays must be equal');
            }
        });

        for (i = 0; i < cols; i++) {
            val = 1;

            values.some((row, idx) => {
                var value = row[i];
                if (value && wijmo.isNumber(value)) {
                    val *= value;
                } else {
                    val = 0;
                    return true;
                }
            });
            vals.push(val);
        }

        return MathHelper.sum(vals);
    }

    // determines variance of array of numbers
    static variance(values: number[]): number {
        values = wijmo.asArray(values, false);

        var mean = MathHelper.avg(values),
            diffs: number[];

        diffs = values.map(v => v - mean);

        return MathHelper.sumOfSquares(diffs) / (values.length - 1);
    }

    // determines covariance based on two correlated arrays
    static covariance(values1: number[], values2: number[]): number {
        values1 = wijmo.asArray(values1, false);
        values2 = wijmo.asArray(values2, false);
        wijmo.assert(values1.length === values2.length, 'Length of arrays must be equal');

        var mean1 = MathHelper.avg(values1),
            mean2 = MathHelper.avg(values2),
            len = values1.length,
            val: number = 0,
            i;

        for (i = 0; i < len; i++) {
            val += ((values1[i] - mean1) * (values2[i] - mean2)) / len;
        }

        return val;
    }
}

/**
 * Specifies the fit type for a {@link TrendLine} series.
 */
export enum TrendLineFitType {
    /**
     * A straight line that most closely approximates the data.  Y(x) = a * x + b.
     */
    Linear,
    /**
     * Regression fit to the equation Y(x) = a * exp(b*x).
     */
    Exponential,
    /**
     * Regression fit to the equation Y(x) = a * ln(x) + b.
     */
    Logarithmic,
    /**
     * Regression fit to the equation Y(x) = a * pow(x, b).
     */
    Power,
    /**
     * Regression fit to the equation Y(x) = a + b * cos(x) + c * sin(x) + d * cos(2*x) + e * sin(2*x) + ...
     */
    Fourier,
    /**
     * Regression fit to the equation Y(x) = a * x^n + b * x^n-1 + c * x^n-2 + ... + z.
     */
    Polynomial,
    /** 
     * The minimum X-value. 
     */
    MinX,
    /** 
     * The minimum Y-value. 
     */
    MinY,
    /** 
     * The maximum X-value. 
     */
    MaxX,
    /** 
     * The maximum Y-value. 
     */
    MaxY,
    /** 
     * The average X-value. 
     */
    AverageX,
    /** 
     * The average Y-value.
     */
    AverageY
}

/**
 * Represents a trend line series in a {@link FlexChart} or {@link FinancialChart}.
 * 
 * A trend line is a line superimposed on a chart revealing the overall
 * direction of data.
 *
 * You may define a different fit type for each {@link TrendLine} series
 * on the {@link FlexChart} by setting its {@link fitType} property.
 */
export class TrendLine extends TrendLineBase {
    private _fitType: TrendLineFitType;
    private _order: number;
    private _helper: ITrendHelper;

    /**
     * Initializes a new instance of the {@link TrendLine} class.
     *
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._fitType = TrendLineFitType.Linear;
        this._order = 2;
        this.initialize(options);
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the fit type of the {@link TrendLine}.
     */
    get fitType(): TrendLineFitType {
        return this._fitType;
    }
    set fitType(value: TrendLineFitType) {
        value = wijmo.asEnum(value, TrendLineFitType, false);
        if (value != this._fitType) {
            this._fitType = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the number of terms in a polynomial or Fourier equation.
     *
     * Set this value to an integer greater than 1. 
     * It gets applied when the fitType is set to 
     * TrendLineFitType.Polynomial or 
     * TrendLineFitType.Fourier. 
     */
    get order(): number {
        return this._order;
    }
    set order(value: number) {
        if (value != this._order) {
            this._order = wijmo.asNumber(value, false, true);
            this._invalidate();
        }
    }
    /**
     * Gets the coefficients of the equation.
     */
    get coefficients(): number[]{
        return this._helper
            ? this._helper.coefficients
            : null;
    }
    /**
     * Gets the approximate y value from the given x value.
     * 
     * @param x The x value to be used for calculating the Y value.
     */
    approximate(x: number): number {
        return this._helper
            ? this._helper.approximate(x)
            : NaN;
    }
    /**
     * Gets the formatted equation string for the coefficients.
     * 
     * @param fmt The formatting function used to convert the coefficients
     * into strings. This parameter is optional.
     */
    getEquation(fmt?: Function) {
        var eq = this._helper ? this._helper.getEquation(fmt) : '';

        // add spaces around '+' and '-' binary operators
        return eq.replace(/\S(\+|\-)\d/g, function (match) {
            return match[0] + ' ' + match[1] + ' ' + match[2];
        });
    }

    //--------------------------------------------------------------------------
    //** implementation

    _calculateValues() {
        var fitType = TrendLineFitType[this._fitType];
        if (TrendLineHelper[fitType]) {
            //For string type x value, set first value to 1.
            var isXString = false,
                xArr = this._originXValues;

            if (this._chart._xvals.length == 0 && this._chart._xlabels.length > 0) {
                xArr = this._originXValues.map(v => v + 1);
                isXString = true;
            }
            var helper = new TrendLineHelper[fitType](this._originYValues, xArr, this.sampleCount, this.order);
            helper._isXString = isXString;
            var vals = helper.calculateValues();
            this._yValues = vals[0];
            this._xValues = vals[1];
            this._helper = helper;
        }
    }
}

// store calculated values.
class Calculator {
    private _x: number[];
    private _logX: number[];
    private _y: number[];
    private _logY: number[];
    private _minX: number;
    private _minY: number;
    private _maxX: number;
    private _maxY: number;
    private _averageX: number;
    private _averageY: number;
    private _sumX: number;
    private _sumY: number;
    private _sumProduct: number;
    private _sumOfSquareX: number;
    private _sumOfSquareY: number;
    private _sumLogX: number;
    private _sumLogY: number;
    private _sumOfSquareLogX: number;
    private _sumOfSquareLogY: number;

    constructor(x: number[], y: number[]) {
        this._x = x;
        this._y = y;
    }

    get x(): number[] {
        return this._x;
    }

    get y(): number[]{
        return this._y;
    }

    get minX(): number {
        if (this._minX == null) {
            this._minX = MathHelper.min(this._x);
        }
        return this._minX;
    }

    get minY(): number {
        if (this._minY == null) {
            this._minY = MathHelper.min(this._y);
        }
        return this._minY;
    }

    get maxX(): number {
        if (this._maxX == null) {
            this._maxX = MathHelper.max(this._x);
        }
        return this._maxX;
    }

    get maxY(): number {
        if (this._maxY == null) {
            this._maxY = MathHelper.max(this._y);
        }
        return this._maxY;
    }

    get averageX(): number {
        if (this._averageX == null) {
            this._averageX = MathHelper.avg(this._x);
        }
        return this._averageX;
    }

    get averageY(): number {
        if (this._averageY == null) {
            this._averageY = MathHelper.avg(this._y);
        }
        return this._averageY;
    }

    get sumX(): number {
        if (this._sumX == null) {
            this._sumX = MathHelper.sum(this._x);
        }
        return this._sumX;
    }

    get sumY(): number {
        if (this._sumY == null) {
            this._sumY = MathHelper.sum(this._y);
        }
        return this._sumY;
    }

    get LogX(): number[] {
        if (this._logX == null) {
            this._logX = this._x.map(val => Math.log(val));
        }
        return this._logX;
    }

    get LogY(): number[] {
        if (this._logY == null) {
            this._logY = this._y.map(val => Math.log(val));
        }
        return this._logY;
    }

    get sumLogX(): number {
        if (this._sumLogX == null) {
            this._sumLogX = MathHelper.sum(this.LogX);
        }
        return this._sumLogX;
    }

    get sumLogY(): number {
        if (this._sumLogY == null) {
            this._sumLogY = MathHelper.sum(this.LogY);
        }
        return this._sumLogY;
    }

    get sumOfSquareX(): number {
        if (this._sumOfSquareX == null) {
            this._sumOfSquareX = MathHelper.sumOfSquares(this._x);
        }
        return this._sumOfSquareX;
    }

    get sumOfSquareY(): number {
        if (this._sumOfSquareY == null) {
            this._sumOfSquareY = MathHelper.sumOfSquares(this._y);
        }
        return this._sumOfSquareY;
    }

    get sumOfSquareLogX(): number {
        if (this._sumOfSquareLogX == null) {
            this._sumOfSquareLogX = MathHelper.sumOfSquares(this.LogX);
        }
        return this._sumOfSquareLogX;
    }

    get sumOfSquareLogY(): number {
        if (this._sumOfSquareLogY == null) {
            this._sumOfSquareLogY = MathHelper.sumOfSquares(this.LogY);
        }
        return this._sumOfSquareLogY;
    }

    sumProduct(x, y): number {

        // In current cases, sumProduct get same x and y in each TrendHelpers, 
        // so use only one variable to store value.
        if (this._sumProduct == null) {
            this._sumProduct = MathHelper.sumProduct(x, y);
        }
        return this._sumProduct;
    }
}

// Simple interface for trend line helpers.
interface ITrendHelper {
    y: number[];
    x: number[];
    count: number;
    xMin: number;
    xMax: number;
    coefficients: number[];
    calculateValues(): number[][];
    approximate(x: number): number;
    getEquation(fmt?: Function): string;
}

// Base class for calculating trend line calculations.
// Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
class TrendHelperBase implements ITrendHelper {
    private _y: number[];
    private _x: number[];
    private _count: number;
    private _xMin: number;
    private _xMax: number;
    private _calculator: Calculator;
    _coefficients: number[];
    _isXString: boolean;

    constructor(y: number[], x: number[], count?: number) {
        this._coefficients = [];
        this.y = wijmo.asArray(y);
        this.x = wijmo.asArray(x);
        wijmo.assert(y.length === x.length, 'Length of X and Y arrays are not equal');
        this.count = count || y.length;
        this._calculator = new Calculator(x, y);
        this.xMin = this._calculator.minX;
        this.xMax = this._calculator.maxX;
    }

    get calculator(): Calculator {
        return this._calculator;
    }

    get y(): number[] {
        return this._y;
    }
    set y(value: number[]) {
        if (value !== this.y) {
            this._y = wijmo.asArray(value, false);
        }
    }

    get x(): number[] {
        return this._x;
    }
    set x(value: number[]) {
        if (value !== this.x) {
            this._x = wijmo.asArray(value, false);
        }
    }

    get count(): number {
        return this._count;
    }
    set count(value: number) {
        if (value !== this.count) {
            this._count = wijmo.asInt(value, false, true);
        }
    }

    get xMin(): number {
        return this._xMin;
    }
    set xMin(value: number) {
        if (value !== this.xMin) {
            this._xMin = wijmo.asNumber(value, false);
        }
    }

    get xMax(): number {
        return this._xMax;
    }
    set xMax(value: number) {
        if (value !== this.xMax) {
            this._xMax = wijmo.asNumber(value, false);
        }
    }

    get coefficients(): number[]{
        return this._coefficients;
    }

    _calculateCoefficients() {
        var b = this.calcB();
        var a = this.calcA(b);
        this._coefficients.push(a, b);
    }

    calculateValues(): number[][] {
        var delta = (this.xMax - this.xMin) / (this.count - 1),
            values: number[][] = [[], []];

        for (var i = 0; i < this.count; i++) {
            var xv = this.xMin + delta * i,
                yv = this.calcY(xv);
            values[0].push(yv);
            if (this._isXString) {
                values[1].push(xv - 1);
            } else {
                values[1].push(xv);
            }
        }

        return values;
    }

    // Calculates the y-offset.
    calcA(b?): number {
        var n = this.y.length,
            Ex = this.calculator.sumX,
            Ey = this.calculator.sumY,
            b = b ? b : this.calcB();

        return (Ey - (b * Ex)) / n;
    }

    // Calculates the slope.
    calcB(): number {
        var n = this.y.length,
            calc = this.calculator,
            Exy = calc.sumProduct(calc.x, calc.y),
            Ex = calc.sumX,
            Ey = calc.sumY,
            Exsq = calc.sumOfSquareX;

        return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
    }

    calcY(xval: number): number {
        var coeffs = this.coefficients;
        return coeffs[0] + (coeffs[1] * xval);
    }

    approximate(x: number): number {
        return this.calcY(x);
    }

    getEquation(fmt?: Function): string {
        var fmt = fmt ? fmt : this._defaultEquationFmt;
        return this._getEquation(fmt);
    }

    _getEquation(fmt: Function): string {
        var coeffs = this.coefficients,
            equations = [];
        coeffs.forEach(coeff => {
            equations.push(fmt(coeff));
        });
        return this._concatEquation(equations);
    }

    _concatEquation(equations: string[]): string {
        return '';
    }

    _defaultEquationFmt(coefficient: number): string {
        var val, len,
            coeff = Math.abs(coefficient),
            strCoeff = String(coeff),
            concatLen = 0;
        if (coeff >= 1e5) {
            len = String(Math.round(coeff)).length - 1;
            val = Math.round(coefficient / Number('1e' + len));
            return val + 'e' + len;
        } else if (coeff < 1e-4) {
            if (strCoeff.indexOf('e') > -1) {
                len = Math.abs(+strCoeff.substring(strCoeff.indexOf('e') + 1));
            } else {
                len = strCoeff.match(/\.0+/)[0].length;
            }
            val = Math.round(coefficient * Number('1e' + len));
            return val + 'e-' + len;
        } else {
            concatLen = coefficient > 0 ? 6 : 7;
            if (coeff >= 1e4) {
                concatLen--;
            }
            // use + to convert string to number to remove last '0' characters.
            return String(+(String(coefficient).substring(0, concatLen)));
        }
    }
}

// y = a * x + b
// Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
class LinearHelper extends TrendHelperBase {
    private _yOffset: number;

    get yOffset(): number {
        return this._yOffset;
    }
    set yOffset(value: number) {
        if (value !== this.yOffset) {
            this._yOffset = wijmo.asNumber(value, true);
        }
    }

    constructor(y: number[], x: number[], count?: number, yOffset?: number) {
        super(y, x, count);
        this._calculateCoefficients();
        this.yOffset = yOffset;
    }

    calcA(b?): number {
        return this.yOffset != null ? this.yOffset : super.calcA(b);
    }

    calcB(): number {
        return this.yOffset != null ? this._calculateBSimple() : super.calcB();
    }

    private _calculateBSimple(): number {
        var calc = this.calculator,
            Exy = calc.sumProduct(calc.x, calc.y),
            Ex = calc.sumX,
            Exsq = calc.sumOfSquareX;
        return (Exy - this.yOffset * Ex) / Exsq;
    }

    _calculateCoefficients() {
        var b = this.calcB(),
            a = this.calcA(b);
        this.coefficients.push(b, a);
    }

    calcY(xval: number): number {
        var coeffs = this.coefficients;
        return (coeffs[0] * xval) + coeffs[1];
    }

    _concatEquation(equations: string[]): string {
        return 'y = ' +
            equations[0] +
            'x' +
            (this.coefficients[1] >= 0 ? '+' : '') +
            equations[1];
    }
}

// y = a * lnx + b.
// Calculations: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
class LogHelper extends TrendHelperBase {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
        this._calculateCoefficients();
    }

    calcA(b?) {
        var n = this.y.length,
            calc = this.calculator,
            Ey = calc.sumY,
            Ex = calc.sumLogX,
            b = b ? b : this.calcB();
        return (Ey - (b * Ex)) / n;
    }

    calcB() {
        var n = this.y.length,
            calc = this.calculator,
            Exy = calc.sumProduct(calc.y, calc.LogX),
            Ey = calc.sumY,
            Ex = calc.sumLogX,
            Exsq = calc.sumOfSquareLogX;
        return ((n * Exy) - (Ey * Ex)) / ((n * Exsq) - MathHelper.square(Ex));
    }

    _calculateCoefficients() {
        var b = this.calcB(),
            a = this.calcA(b);
        this.coefficients.push(b, a);
    }

    calcY(xval: number): number {
        var coeffs = this.coefficients;
        return (Math.log(xval) * coeffs[0]) + coeffs[1];
    }

    _concatEquation(equations: string[]): string {
        return 'y = ' +
            equations[0] +
            'ln(x)' +
            (this.coefficients[1] >= 0 ? '+' : '') +
            equations[1];
    }
}

// y = a * e ^ (b * x)
// Calculations: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
class ExpHelper extends TrendHelperBase {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
        this._calculateCoefficients();
    }

    calcA(): number {
        var n = this.y.length,
            calc = this.calculator,
            Ey = calc.sumLogY,
            Exsq = calc.sumOfSquareX,
            Ex = calc.sumX,
            Exy = calc.sumProduct(calc.x, calc.LogY);
        return Math.exp(((Ey * Exsq) - (Ex * Exy)) / ((n * Exsq) - MathHelper.square(Ex)));
    }

    calcB(): number {
        var n = this.y.length,
            calc = this.calculator,
            Ey = calc.sumLogY,
            Exsq = calc.sumOfSquareX,
            Ex = calc.sumX,
            Exy = calc.sumProduct(calc.x, calc.LogY);
        return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
    }

    calcY(xval: number): number {
        var coeffs = this.coefficients;
        return coeffs[0] * Math.exp(coeffs[1] * xval);
    }

    _concatEquation(equations: string[]): string {
        return 'y = ' +
            equations[0] +
            'e<sup>' +
            equations[1] +
            'x</sup>';
    }
}

// y = a * x ^ b
// Calculations: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
class PowerHelper extends TrendHelperBase {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
        this._calculateCoefficients();
    }

    calcA(b?): number {
        var calc = this.calculator,
            n = this.y.length,
            Ex = calc.sumLogX,
            Ey = calc.sumLogY,
            b = b ? b : this.calcB();
        return Math.exp((Ey - (b * Ex)) / n);
    }

    calcB(): number {
        var n = this.y.length,
            calc = this.calculator,
            Exy = calc.sumProduct(calc.LogX, calc.LogY),
            Ex = calc.sumLogX,
            Ey = calc.sumLogY,
            Exsq = calc.sumOfSquareLogX;
        return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
    }

    calcY(xval: number): number {
        var coeffs = this.coefficients;
        return coeffs[0] * Math.pow(xval, coeffs[1]);
    }

    _concatEquation(equations: string[]): string {
        return 'y = ' +
            equations[0] +
            'x<sup>' +
            equations[1] +
            '</sup>';
    }
}

//For Polynomial/Fourier
class LeastSquaresHelper extends TrendHelperBase {
    private _basis: number[][];
    private _order: number;

    constructor(y: number[], x: number[], count?: number, order?: number) {
        super(y, x, count);
        this._order = order == null ? 2 : order;
        this._basis = [];
        this._calculateCoefficients();
    }

    get basis(): number[][] {
        return this._basis;
    }

    get order(): number {
        return this._order;
    }
    set order(value: number) {
        this._order = wijmo.asNumber(value, true);
    }

    _calculateCoefficients() {
        this._coefficients.length = this.order;
        this._createBasis();
        this._normalizeAndSolveGauss();
    }

    _createBasis() {
        var len = this.x.length,
            order = this.order;

        if (len < 2) {
            throw "Incompatible data: Less than 2 data points.";
        }
        if (order < 1) {
            throw "Incompatible data: Less than 1 coefficient in the fit";
        }
        if (order > len) {
            throw "Incompatible data: Number of data points less than number of terms";
        }
    }

    _normalizeAndSolveGauss() {
        var a = [];
        this._computeNormalEquations(a);
        this._genDefValForArray(a, 0);
        if (!this._solveGauss(a)) {
            throw 'Incompatible data: No solution.';
        }
    }

    private _genDefValForArray(a: number[][], def: number) {
        var len = a.length + 1;
        a.forEach(v => {
            for (var i = 0; i < len; i++) {
                if (v[i] == null) {
                    v[i] = def;
                }
            }
        });
    }

    // transform the least square task to the normal equation
    //  a * solution = c
    // where
    //   a = basis_transposed * basis
    //   c = basis_transposed * y 
    // 
    // here right part
    //   a[i][nt] = c[i]
    //
    _computeNormalEquations(a: number[][]) {
        var y = this.y,
            bas = this.basis,
            order = this.order,
            len = y.length,
            col, row, sum, i;

        for (col = 0; col < order; col++) {
            sum = 0;
            if (a[col] == null) {
                a[col] = [];
            }
            y.forEach((v, i) => {
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
    }
    
    // A[n][n]*x = A[n+1]
    _solveGauss(a: number[][]) {
        var n = a.length,
            epsilon = 0,
            coeffs = this._coefficients,
            result = true,
            i, j;

        if (coeffs.length < n || a[0].length < n + 1) {
            throw 'Dimension of matrix is not correct.';
        }

        a.some((v, i) => {
            var k = i,
                m = Math.abs(v[i]),
                val, _temp;

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
            } else {
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
    }

}

class PolyHelper extends LeastSquaresHelper {

    constructor(y: number[], x: number[], count?: number, order?: number) {
        super(y, x, count, order);
    }

    get coefficients(): number[] {
        return this._coefficients.slice(0).reverse();
    }

    calcY(xval: number): number {
        var coeffs = this._coefficients,
            yval = 0,
            pow = 1;

        coeffs.forEach((v, i) => {
            if (i > 0) {
                pow *= xval;
            }
            yval += v * pow;
        });
        return yval;
    }

    _calculateCoefficients() {
        var coeffs = this._coefficients,
            zero = false,
            i;

        this.order++;
        if (zero) {
            coeffs.pop();
        }
        super._calculateCoefficients();
        if (zero) {
        }
        this.order--;
    }

    //f0 = 1, f1 = x, f2 = x^2...
    _createBasis() {
        super._createBasis();

        var x = this.x,
            bas = this.basis,
            order = this.order;

        x.forEach((v, row) => {
            bas[row] = [1];
            for (var col = 1; col <= order; col++) {
                bas[row][col] = v * bas[row][col - 1];
            }
        });
    }

    _concatEquation(equations: string[]): string {
        var str = 'y = ',
            len = equations.length,
            coeffs = this.coefficients;
        equations.forEach(function (val, idx) {
            var pow = len - 1 - idx,
                operator;
            if (pow === 0) {
                str += val;
            } else if (pow === 1) {
                operator = coeffs[idx + 1] >= 0 ? '+' : '';
                str += val + 'x' + operator;
            } else {
                operator = coeffs[idx + 1] >= 0 ? '+' : '';
                str += val + 'x<sup>' + pow + '</sup>' + operator;
            }
        });
        return str;
    }
}

class FourierHelper extends LeastSquaresHelper {
    constructor(y: number[], x: number[], count?: number, order?: number) {
        order = order == null ? x.length : order;
        super(y, x, count, order);
    }

    //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
    _createBasis() {
        super._createBasis();
        var x = this.x,
            bas = this.basis,
            order = this.order;

        x.forEach((v, row) => {
            var col, n;
            bas[row] = [1];
            for (col = 1; col < order; col++) {
                n = Math.floor((col + 1) / 2);
                if (col % 2 === 1) {
                    bas[row].push(Math.cos(n * v));
                } else {
                    bas[row].push(Math.sin(n * v));
                }
            }
        });
    }

    calcY(xval: number): number {
        var coeffs = this._coefficients,
            yval;

        coeffs.forEach((v, i) => {
            var k = Math.floor((i + 1) / 2),
                val;

            if (i === 0) {
                yval = v;
            } else {
                val = k * xval;
                if ((i % 2) === 1) {
                    yval += v * Math.cos(val);
                } else {
                    yval += v * Math.sin(val);
                }
            }

        });
        return yval;
    }

    _concatEquation(equations: string[]): string {
        //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
        var str = 'y = ',
            len = equations.length,
            coeffs = this.coefficients;
        equations.forEach(function (val, idx) {
            var operator = idx === len - 1 ? '' : (coeffs[idx + 1] >= 0 ? '+' : ''),
                sincos = '',
                x = Math.ceil(idx / 2);

            if (idx === 0) {
                str += val + operator;
            } else {
                var sincos = (idx % 2 === 1) ? 'cos' : 'sin';
                sincos += '(' + (x === 1 ? '' : String(x)) + 'x)';
                str += val + sincos + operator;
            }
        });
        return str;
    }
}

class SimpleTrendHelper extends TrendHelperBase {
    private _val: number;

    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
        this._calculateCoefficients();
    }

    _setVal(val?: number) {
        this._val = val;
    }

    calcY(xval: number): number {
        return this._val;
    }
}

class MinXHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }

    calculateValues(): number[][]{
        var xMin = this.xMin,
            yMin = MathHelper.min(this.y),
            yMax = MathHelper.max(this.y),
            valsX, valsY;

        if (this._isXString) {
            xMin = xMin - 1;
        }

        valsX = [xMin, xMin];
        valsY = [yMin, yMax];
        this._setVal(xMin);
        return [valsY, valsX];
    }

    getEquation(fmt: Function): string {
        var xMin = this.xMin;
        if (this._isXString) {
            xMin = xMin - 1;
        }
        if (fmt) {
            xMin = fmt(xMin);
        }
        return 'x = ' + xMin;
    }
}

class MinYHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }

    calculateValues(): number[][] {
        var xMin = this.xMin,
            xMax = this.xMax,
            yMin = MathHelper.min(this.y),
            valsX, valsY;

        if (this._isXString) {
            xMin = xMin - 1;
            xMax = xMax - 1;
        }

        valsX = [xMin, xMax];
        valsY = [yMin, yMin];
        this._setVal(yMin);
        return [valsY, valsX];
    }

    getEquation(fmt: Function): string {
        var yMin = MathHelper.min(this.y);
        if (fmt) {
            yMin = fmt(yMin);
        }
        return 'y = ' + yMin;
    }
}

class MaxXHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }
    calculateValues(): number[][] {
        var xMax = this.xMax,
            yMin = MathHelper.min(this.y),
            yMax = MathHelper.max(this.y),
            valsX, valsY;

        if (this._isXString) {
            xMax = xMax - 1;
        }
        valsX = [xMax, xMax];
        valsY = [yMin, yMax];
        this._setVal(xMax);
        return [valsY, valsX];
    }

    getEquation(fmt: Function): string {
        var xMax = this.xMax;
        if (this._isXString) {
            xMax = xMax - 1;
        }
        if (fmt) {
            xMax = fmt(xMax);
        }
        return 'x = ' + xMax;
    }
}

class MaxYHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }

    calculateValues(): number[][] {
        var xMin = this.xMin,
            xMax = this.xMax,
            yMax = MathHelper.max(this.y),
            valsX, valsY;

        if (this._isXString) {
            xMin = xMin - 1;
            xMax = xMax - 1;
        }
        valsX = [xMin, xMax];
        valsY = [yMax, yMax];
        this._setVal(yMax);
        return [valsY, valsX];
    }

    getEquation(fmt: Function): string {
        var yMax = MathHelper.max(this.y);
        if (fmt) {
            yMax = fmt(yMax);
        }
        return 'y = ' + yMax;
    }
}

class AverageXHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }

    calculateValues(): number[][] {
        var xAverage = MathHelper.avg(this.x),
            yMin = MathHelper.min(this.y),
            yMax = MathHelper.max(this.y),
            valsX, valsY;

        if (this._isXString) {
            xAverage = xAverage - 1;
        }
        valsX = [xAverage, xAverage];
        valsY = [yMin, yMax]
        this._setVal(xAverage);
        return [valsY, valsX];
    }

    _getEquation(fmt: Function): string {
        var xAverage = MathHelper.avg(this.x);
        if (this._isXString) {
            xAverage = xAverage - 1;
        }
        if (fmt) {
            xAverage = fmt(xAverage);
        }
        return ' x =' + xAverage;
    }

    _defaultEquationFmt(coefficient: number): string {
        if (Math.abs(coefficient) < 1e5) {
            return super._defaultEquationFmt(coefficient);
        }
        return '' + MathHelper.round(coefficient, 2);
    }
}

class AverageYHelper extends SimpleTrendHelper {
    constructor(y: number[], x: number[], count?: number) {
        super(y, x, count);
    }

    calculateValues(): number[][] {
        var yAverage = MathHelper.avg(this.y),
            xMin = this.xMin,
            xMax = this.xMax,
            valsX, valsY;

        if (this._isXString) {
            xMin = xMin - 1;
            xMax = xMax - 1;
        }
        valsX = [xMin, xMax];
        valsY = [yAverage, yAverage];
        this._setVal(yAverage);
        return [valsY, valsX];
    }

    _getEquation(fmt: Function): string {
        var yAverage = fmt(MathHelper.avg(this.y));
        return 'y = ' + yAverage;
    }

    _defaultEquationFmt(coefficient: number): string {
        return Math.abs(coefficient) < 1e5
            ? super._defaultEquationFmt(coefficient)
            : '' + MathHelper.round(coefficient, 2);
    }
}

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
}
    }
    


    module wijmo.chart.analytics {
    


'use strict';

/**
 * Represents a base class of function series for {@link FlexChart}.
 */
export class FunctionSeries extends TrendLineBase {
    private _min: number;
    private _max: number;

    /**
     * Initializes a new instance of the {@link FunctionSeries} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._min = 0;
        this._max = 1;
        this.initialize(options);
        if (this.itemsSource == null) {
            this.itemsSource = [new wijmo.Point(0, 0)];
        }
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the minimum value of the parameter for calculating a function. 
     */
    get min(): number {
        return this._min;
    }
    set min(value: number) {
        if (this._min !== value) {
            this._min = wijmo.asNumber(value, false);
            this._invalidate();
        }
    }
    /**
     * Gets or sets the maximum value of the parameter for calculating a function.
     */
    get max(): number {
        return this._max;
    }
    set max(value: number) {
        if (this._max !== value) {
            this._max = wijmo.asNumber(value, false);
            this._invalidate();
        }
    }

    //--------------------------------------------------------------------------
    //** implementation

    getValues(dim: number): number[] {
        var self = this;

        if (self._xValues == null || self._yValues == null) {
            self._calculateValues();
        }

        if (dim === 0) {
            //y
            return self._yValues || null;
        } else if (dim === 1) {
            //x
            return self._xValues || null;
        }
    }

    _calculateValues() {
        var self = this,
            npts = self.sampleCount,
            x: number[] = [],
            y: number[] = [],
            delta = (self.max - self.min) / (npts - 1),
            t: number;

        for (var i = 0; i < npts; i++) {
            t = i === npts - 1 ? this.max : this.min + delta * i;

            x[i] = self._calculateX(t);
            y[i] = self._calculateY(t);
        }

        self._yValues = y;
        self._xValues = x;
    }

    // performs simple validation of data value
    _validateValue(value: number): number {
        return isFinite(value) ? value : Number.NaN;
    }

    // calculate the value of the function
    _calculateValue(func: Function, parameter: number): number {
        var value: number;

        try {
            value = func(parameter);
        }
        catch (ex) {
            value = Number.NaN;
        }

        return this._validateValue(value);
    }

    _calculateX(value: number): number {
        return 0;
    }

    _calculateY(value: number): number {
        return 0;
    }
}


/**
 * Represents a Y function series of {@link FlexChart}.
 *
 * The {@link YFunctionSeries} plots a function defined by formulas
 * of type y=f(x), specified using the {@link func} property.
 */
export class YFunctionSeries extends FunctionSeries {
    private _func: Function;

    /**
     * Initializes a new instance of the {@link YFunctionSeries} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the function used to calculate Y value. 
     */
    get func(): Function {
        return this._func;
    }
    set func(value: Function) {
        if (value && this._func !== value) {
            this._func = wijmo.asFunction(value, false);
            this._invalidate();
        }
    }
    
    //--------------------------------------------------------------------------
    //** implementation
    _calculateX(value: number): number {
        return value;
    }

    _calculateY(value: number): number {
        return this._calculateValue(this.func, value);
    }

    /**
     * Gets the approximate y value from the given x value.
     * 
     * @param x The x value to be used for calculating the Y value.
     */
    approximate(x: number): number {
        return this._calculateValue(this.func, x);
    }
}

/**
 * Represents a parametric function series for {@link FlexChart}.
 * 
 * The {@link ParametricFunctionSeries} plots a function defined by formulas
 * x=f(t) and y=f(t).
 *
 * The x and y values are calculated by the functions assigned to the
 * {@link xFunc} and {@link yFunc} properties.
 */
export class ParametricFunctionSeries extends FunctionSeries {
    private _xFunc: Function;
    private _yFunc: Function;

    /**
     * Initializes a new instance of the {@link ParametricFunctionSeries} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super(options);
    }

    //--------------------------------------------------------------------------
    //** object model

    /**
     * Gets or sets the function used to calculate the x value. 
     */
    get xFunc(): Function {
        return this._xFunc;
    }
    set xFunc(value: Function) {
        if (value && this._xFunc !== value) {
            this._xFunc = wijmo.asFunction(value, false);
            this._invalidate();
        }
    }

    /**
     * Gets or sets the function used to calculate the y value. 
     */
    get yFunc(): Function {
        return this._yFunc;
    }
    set yFunc(value: Function) {
        if (value && this._yFunc !== value) {
            this._yFunc = wijmo.asFunction(value, false);
            this._invalidate();
        }
    }

    //--------------------------------------------------------------------------
    //** implementation
    _calculateX(value: number): number {
        return this._calculateValue(this.xFunc, value);
    }

    _calculateY(value: number): number {
        return this._calculateValue(this.yFunc, value);
    }

    /**
     * Gets the approximate x and y from the given value.
     * 
     * @param value The value to calculate.
     */
    approximate(value: number) {
        var self = this,
            x = this._calculateValue(this.xFunc, value),
            y = this._calculateValue(this.yFunc, value);
        //add <any> for compiling error.
        return <any>new wijmo.Point(x, y);
    }
}
    }
    


    module wijmo.chart.analytics {
    


'use strict';

/**
 * Specifies the meaning of the {@link ErrorBar}'s {@link ErrorBar.value} property.
 */
export enum ErrorAmount {
    /** The value property represents the error as an absolute value. */
    FixedValue,
    /** The value property represents the error as a percentage. */
    Percentage,
    /** The value property represents the error as a number of standard deviations. */
    StandardDeviation,
    /** The error is the standard error of the mean (value property is not used). */
    StandardError,
    /** Error values are bound through the {@link ErrorBar.binding} property or set to an object with 'plus' and 'minus' values. */
    Custom
}

/**
 * Specifies the end style of the error bars.
 */
export enum ErrorBarEndStyle {
    /** Error bars end with a cap. */
    Cap,
    /** Error bars are simple lines. */
    NoCap
}

/**
 * Specifies the direction of the error bar.
 */
export enum ErrorBarDirection {
    /** Show errors in both directions. */
    Both,
    /** Show errors only in the minus direction. */
    Minus,
    /** Show errors only in the plus direction. */
    Plus
}

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
export class ErrorBar extends wijmo.chart.Series {
    private __errorValue: number;
    private _mean: number;
    private _errorAmount = ErrorAmount.FixedValue;
    private _endStyle = ErrorBarEndStyle.Cap;
    private _direction = ErrorBarDirection.Both;
    private _value: any;
    private _errorBarStyle: any;
    private _paddings: any[];
    private _plusBindingValues: number[];
    private _minusBindingValues: number[];
    private _errorBarEles: any[];

    /**
     * Initializes a new instance of the {@link ErrorBar} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this.rendering.addHandler(this._rendering, this);
        this.initialize(options);
    }

    /**
     * Gets or sets a value that specifies the error value of the series.
     *
     * This property works with the {@link errorAmount} property.
     */
    get value(): any {
        return this._value;
    }
    set value(value: any) {
        if (value != this._value) {
            this._value = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that specifies the meaning of the
     * {@link value} property.
     */
    get errorAmount(): ErrorAmount {
        return this._errorAmount;
    }
    set errorAmount(value: ErrorAmount) {
        value = wijmo.asEnum(value, ErrorAmount, true);
        if (value != this._errorAmount) {
            this._errorAmount = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets the style used to render the error bars.
     */
    get errorBarStyle(): any {
        return this._errorBarStyle;
    }
    set errorBarStyle(value: any) {
        if (value != this._errorBarStyle) {
            this._errorBarStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that specifies the end style of the error bars.
     */
    get endStyle(): ErrorBarEndStyle {
        return this._endStyle;
    }
    set endStyle(value: ErrorBarEndStyle) {
        value = wijmo.asEnum(value, ErrorBarEndStyle, true);
        if (value != this._endStyle) {
            this._endStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that specifies the direction of the error bars.
     */
    get direction(): ErrorBarDirection {
        return this._direction;
    }
    set direction(value: ErrorBarDirection) {
        value = wijmo.asEnum(value, ErrorBarDirection, true);
        if (value != this._direction) {
            this._direction = value;
            this._invalidate();
        }
    }

    // ** implementation

    getDataRect(currentRect?: wijmo.Rect, calculatedRect?: wijmo.Rect): wijmo.Rect {

        // too late to get values in chart's rendering event.
        if (!currentRect) {
            return null;
        }

        // calculate error value and only calculate one time.
        var chart = this._chart,
            errorAmount = this.errorAmount,
            s, minPadding = 0, maxPadding = 0, len;

        this._paddings = [];

        this._calculateErrorValue();

        var yVals = this.getValues(0),
            yMin = currentRect.top, yMax = currentRect.bottom, i, val;

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
    }

    private _getCustomValue(i) {
        var vals = this.value,
            v = {
                minus: 0,
                val: 0,
                plus: 0
            },
            val;
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
        } else {
            if (wijmo.isNumber(vals)) {
                v.minus = vals;
                v.plus = vals;
            } else {
                if (vals.minus) {
                    v.minus = vals.minus;
                }
                if (vals.plus) {
                    v.plus = vals.plus;
                }
            }
        }
        return v;
    }

    _calculateErrorValue() {
        var total = 0, count = 0, mean = 0;

        if (this._errorAmount === ErrorAmount.StandardDeviation || this._errorAmount === ErrorAmount.StandardError) {
            var vals = this.getValues(0);
            if (vals != null) {
                vals.forEach(v => {
                    total += v;
                    count++;
                });
                mean = total / count;
                this._mean = mean;
                total = 0;
                vals.forEach(v => {
                    total += Math.pow(v - mean, 2);
                });
                this._errorValue = Math.sqrt(total / (count - 1));
            }
            if (this._errorAmount == ErrorAmount.StandardError) {
                this._errorValue = this._errorValue / Math.sqrt(count);
            }
        }
    }

    _clearValues() {
        this.__errorValue = null;
        this._mean = null;
        this._plusBindingValues = null;
        this._minusBindingValues = null;
        super._clearValues();
    }

    getValues(dim: number): number[] {
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
        return super.getValues(dim);
    }

    get _chart(): wijmo.chart.FlexChartCore {
        return this.__chart;
    }
    set _chart(value: wijmo.chart.FlexChartCore) {
        if (value !== this.__chart) {
            this.__chart = value;
        }
    }

    get _errorValue(): number {
        return this.__errorValue;
    }
    set _errorValue(value: number) {
        if (value != this.__errorValue) {
            this.__errorValue = value;
        }
    }

    get _showPlus(): boolean {
        return this.direction === ErrorBarDirection.Both || this.direction === ErrorBarDirection.Plus;
    }

    get _showMinus(): boolean {
        return this.direction === ErrorBarDirection.Both || this.direction === ErrorBarDirection.Minus;
    }

    private _rendering(sender: wijmo.chart.SeriesBase, args: wijmo.chart.SeriesRenderingEventArgs): void {
        this._errorBarEles = [];
        args.cancel = true;

        var chart = this.chart,
            r = chart._plotRect,
            axisY = this._getAxisY(),
            axisX = this._getAxisX(),
            origin = axisY.origin || 0,
            engine: wijmo.chart.IRenderEngine = args.engine,
            si = chart.series.indexOf(this),
            plotter = this._plotter;

        //draw plotter elements
        plotter.plotSeries(engine, axisX, axisY, this, chart, args.index, args.count, (points: wijmo.Point[]) => {
            //draw error bars.
            var paddings = this._paddings,
                showPlus = this._showPlus,
                showMinus = this._showMinus,
                chartRotated = chart._isRotated(),
                off = (this.errorBarStyle && this.errorBarStyle['stroke-width']) || 2,
                offset, axis: wijmo.chart.Axis, actualMax;

            if (chartRotated) {
                axis = axisX;
            } else {
                axis = axisY;
            }
            actualMax = axis.actualMax;
            offset = axis.convert(actualMax);
            var stroke = engine.stroke;
            var strokeWidth = engine.strokeWidth;
            //set default style the same as in Excel.
            engine.stroke = 'black';
            engine.strokeWidth = 1;

            let clipID = this.chart._plotrectId;
            engine.startGroup(null, clipID);

            points && points.length && points.forEach((p, i) => {
                if (p != null && p.x != null && p.y != null) {
                    var padding = paddings[i];
                    var minus = (padding && padding.minus) || 0;
                    var plus = (padding && padding.plus) || 0;
                    var minusOff = Math.abs(axis.convert(actualMax - minus) - offset);
                    var plusOff = Math.abs(axis.convert(actualMax + plus) - offset);
                    var start = new wijmo.Point(p.x, p.y);
                    var end = new wijmo.Point(p.x, p.y);
                    if (chartRotated) {
                        if (this.errorAmount === ErrorAmount.StandardDeviation) {
                            p = new wijmo.Point(axis.convert(this._mean), p.y);
                            start.x = p.x;
                            end.x = p.x;
                        }
                        if (showMinus) {
                            start.x = start.x - minusOff;
                        }
                        if (showPlus) {
                            end.x = end.x + plusOff;
                        }
                    } else {
                        if (this.errorAmount === ErrorAmount.StandardDeviation) {
                            p = new wijmo.Point(p.x, axis.convert(this._mean));
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

                    let rect;
                    if (chartRotated) {
                        rect = new wijmo.Rect(start.x, start.y - off, Math.abs(end.x - start.x), off * 2);
                    } else {
                        rect = new wijmo.Rect(end.x - off, end.y, off * 2, Math.abs(end.y - start.y));
                    }
                    let area = new wijmo.chart._RectArea(rect);
                    area.ignoreLabel = true;
                    let dp = new wijmo.chart._DataPoint(si, i, i, padding.val);
                    area.tag = dp;
                    plotter.hitTester.add(area, si);

                    //let ele = engine.drawLine(Math.max(start.x, r.left), Math.min(start.y, r.bottom), Math.min(end.x, r.right), Math.max(end.y, r.top), 'error-bar', this.errorBarStyle);
                    let ele = engine.drawLine(start.x, start.y, end.x, end.y, 'error-bar', this.errorBarStyle);
                    let eles = [ele];
                    this._errorBarEles[i] = eles;
                    if (this.endStyle === ErrorBarEndStyle.Cap) {
                        if (showPlus) {
                            let plusEle;
                            if (chartRotated) {
                                if (end.x <= r.right) {
                                    plusEle = engine.drawLine(end.x, end.y - off, end.x, end.y + off, 'error-bar', this.errorBarStyle);
                                    eles.push(plusEle);
                                }
                            } else {
                                if (end.y >= r.top) {
                                    plusEle = engine.drawLine(end.x - off, end.y, end.x + off, end.y, 'error-bar', this.errorBarStyle);
                                    eles.push(plusEle);
                                }
                            }
                        }
                        if (showMinus) {
                            let minusEle;
                            if (chartRotated) {
                                if (start.x >= r.left) {
                                    minusEle = engine.drawLine(start.x, start.y - off, start.x, start.y + off, 'error-bar', this.errorBarStyle);
                                    eles.push(minusEle);
                                }
                            } else {
                                if (start.y <= r.bottom) {
                                    minusEle = engine.drawLine(start.x - off, start.y, start.x + off, start.y, 'error-bar', this.errorBarStyle);
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
    }

    /**
     * Gets the plot element that corresponds to the specified point index.
     *
     * @param pointIndex The index of the data point.
     */
    getPlotElement(pointIndex: number): any {
        if (this.hostElement) {
            if (pointIndex < this._pointIndexes.length) {
                let eles = this._errorBarEles[pointIndex] == null ? [] : this._errorBarEles[pointIndex].slice();
                var elementIndex = this._pointIndexes[pointIndex];
                if (elementIndex < this.hostElement.childNodes.length) {
                    eles.push(this.hostElement.childNodes[elementIndex]);
                }
                return eles;
            }
        }
        return null;
    }
}
    }
    


    module wijmo.chart.analytics {
    


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

/** Defines styles for the {@link BreakEven} series. */
export interface IBreakEvenStyles {
  /** Specifies the style of the fixed cost line. */
  fixedCost?: any;
  /** Specifies the style of the variable cost line. */
  variableCost?: any;
  /** Specifies the style of the total cost line. */
  totalCost?: any;
  /** Specifies the style of the sales revenue line. */
  salesRevenue?: any;
  /** Specifies the style of the safety margin area. */
  safetyMargin?: any;
  /** Specifies the style of the marginal profit line. */
  marginalProfit?: any;
  /** Specifies the style of the break even markers. */
  breakEven?: any;
}

/**
 * Represents a Break Even chart series.
 * 
 * A break even chart is a chart that shows the sales volume level at which total costs equal sales. 
 * Use the styles property to customize appearance of different parts of Break Even chart.
 * The name property contains comma-separated names that are shown as legend entries.
 */
export class BreakEven extends wijmo.chart.SeriesBase {
  private _fixedCost: number;
  private _variableCost: number;
  private _salesPrice: number;
  private _styles: IBreakEvenStyles;

  /**
   * Initializes a new instance of the {@link BreakEven} class.
   * 
   * @param options JavaScript object containing initialization data for the object.
   */
  constructor(options?: any) {
    super();
    this.rendering.addHandler(this._rendering, this);

    // default colors
    this.style = { // profit
      fill: 'rgba(0,255,0,0.5)',
      strokeWidth: 0
    };
    this.altStyle = { // loss
      fill: 'rgba(255,0,0,0.5)',
      strokeWidth: 0
    };
    this.tooltipContent = '{y}';
    this.initialize(options);
    this._chartType = wijmo.chart.ChartType.Line;
    //this.name = "Profit Area,Loss Area,Safety Margin,Sales Revenue,Total Cost,Fixed Cost,Variable Cost,Marginal Profit,Break Even";
    let cul = wijmo.culture.FlexChartAnalytics.BreakEven;
    this.name = cul.profitArea + ',' + cul.lossArea + ',' + cul.safetyMargin + ',' + cul.salesRevenue + ',' +
      cul.totalCost + ',' + cul.fixedCost + ',' + cul.variableCost + ',' + cul.marginalProfit + ',' + cul.breakEven;
  }

  /**
   * Gets or sets a value of fixed cost.
   */
  get fixedCost(): number {
    return this._fixedCost;
  }
  set fixedCost(value: number) {
    if (value != this._fixedCost) {
      this._fixedCost = wijmo.asNumber(value, true, true);
      this._invalidate();
    }
  }

  /**
   * Gets or sets a value of variable cost.
   */
  get variableCost(): number {
    return this._variableCost;
  }
  set variableCost(value: number) {
    if (value != this._variableCost) {
      this._variableCost = wijmo.asNumber(value, true, true);
      this._invalidate();
    }
  }

  /**
   * Gets or sets a value of sales price.
   */
  get salesPrice(): number {
    return this._salesPrice;
  }
  set salesPrice(value: number) {
    if (value != this._salesPrice) {
      this._salesPrice = wijmo.asNumber(value, true, true);
      this._invalidate();
    }
  }

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
  get styles(): IBreakEvenStyles {
    return this._styles;
  }
  set styles(value: IBreakEvenStyles) {
    if (value !== this._styles) {
      this._styles = value as IBreakEvenStyles;
      this._invalidate();
    }
  }

  getValues(dim: number): number[] {
    let contr = this.salesPrice - this.variableCost;

    if (contr == 0) {
      return null;
    }

    let q = this.fixedCost / contr;

    let maxQ = 1.3 * q;

    let values: number[] = [];
    for (let i = 0; i < 10; i++) {
      if (dim == 0) {
        values.push(((i * maxQ) / 10) * this.salesPrice);
      } else if (dim == 1) {
        values.push((i * maxQ) / 10);
      }
    }

    return values;
  }

  private _rendering(sender: wijmo.chart.SeriesBase, args: wijmo.chart.RenderEventArgs): void {
    let pr = this.chart._plotRect;
    let eng = args.engine;
    let ax = this.chart.axisX;
    let ay = this.chart.axisY;
    let xs = this.getValues(1);
    let ys = this.getValues(0);

    let contr = this.salesPrice - this.variableCost;
    let q = this.fixedCost / contr;

    let totalCostEnd =
      this.fixedCost + ys[ys.length - 1] - contr * xs[xs.length - 1];

    let clipID = this.chart._plotrectId;
    eng.startGroup(null, clipID);

    if (this.style) {
      if (this.style.fill) {
        eng.fill = this.style.fill;
        eng.drawPolygon(
          [
            ax.convert(xs[xs.length - 1]),
            ax.convert(q),
            ax.convert(xs[xs.length - 1])
          ],
          [
            ay.convert(ys[ys.length - 1]),
            ay.convert(q * this.salesPrice),
            ay.convert(totalCostEnd)
          ]
        );
        eng.fill = null;
      }
    }

    if (this.altStyle) {
      if (this.altStyle.fill) {
        eng.fill = this.altStyle.fill;
        eng.drawPolygon(
          [ax.convert(xs[0]), ax.convert(q), ax.convert(xs[0])],
          [
            ay.convert(0),
            ay.convert(q * this.salesPrice),
            ay.convert(this.fixedCost)
          ]
        );

        eng.fill = null;
      }
    }

    let safetyMarginStyle = this.styles ? this.styles.safetyMargin : undefined;
    let salesRevenueStyle = this.styles ? this.styles.salesRevenue : undefined;
    let totalCostStyle = this.styles ? this.styles.totalCost : undefined;
    let fixedCostStyle = this.styles ? this.styles.fixedCost : undefined;
    let variableCostStyle = this.styles ? this.styles.variableCost : undefined;
    let marginalProfitStyle = this.styles ? this.styles.marginalProfit : undefined;
    let breakEvenStyle = this.styles ? this.styles.breakEven : undefined;

    if (safetyMarginStyle && safetyMarginStyle.fill) {
      eng.fill = safetyMarginStyle.fill;
      eng.drawPolygon(
        [
          ax.convert(xs[xs.length - 1]),
          ax.convert(q),
          ax.convert(xs[xs.length - 1])
        ],
        [
          ay.convert(xs[xs.length - 1] * (this.salesPrice - this.variableCost)),
          ay.convert(this.fixedCost),
          ay.convert(this.fixedCost)
        ]
      );
      eng.fill = null;
    }

    if (salesRevenueStyle) {
      this._setStyle(eng, salesRevenueStyle);
      eng.drawLine(
        ax.convert(0),
        ay.convert(0),
        ax.convert(xs[xs.length - 1]),
        ay.convert(ys[ys.length - 1])
      );
    }

    if (totalCostStyle) {
      this._setStyle(eng, totalCostStyle);
      eng.drawLine(
        ax.convert(xs[0]),
        ay.convert(this.fixedCost),
        ax.convert(xs[xs.length - 1]),
        ay.convert(totalCostEnd)
      );
    }

    if (fixedCostStyle) {
      this._setStyle(eng, fixedCostStyle);
      eng.drawLine(
        ax.convert(xs[0]),
        ay.convert(this.fixedCost),
        ax.convert(xs[xs.length - 1]),
        ay.convert(this.fixedCost)
      );
    }

    if (variableCostStyle) {
      this._setStyle(eng, variableCostStyle);
      eng.drawLine(
        ax.convert(xs[0]),
        ay.convert(0),
        ax.convert(xs[xs.length - 1]),
        ay.convert(xs[xs.length - 1] * this.variableCost)
      );
    }

    if (marginalProfitStyle) {
      this._setStyle(eng, marginalProfitStyle);
      eng.drawLine(
        ax.convert(xs[0]),
        ay.convert(0),
        ax.convert(xs[xs.length - 1]),
        ay.convert(xs[xs.length - 1] * (this.salesPrice - this.variableCost))
      );
    }

    if (breakEvenStyle) {
      this._setStyle(eng, breakEvenStyle);
      eng.drawLine(
        ax.convert(q),
        ay.convert(0),
        ax.convert(q),
        ay.convert(q * this.salesPrice)
      );
      eng.drawLine(
        ax.convert(0),
        ay.convert(q * this.salesPrice),
        ax.convert(q),
        ay.convert(q * this.salesPrice)
      );
    }

    eng.endGroup();
  }

  _setStyle(eng: wijmo.chart.IRenderEngine, style: any) {
    eng.stroke = style.stroke;
    eng.strokeWidth = style.strokeWidth ? style.strokeWidth : 3;
  }

  _getName(dim: number): string {
    var name: string = undefined;

    if (this.name) {
      if (this.name.indexOf(",")) {
        var names = this.name.split(",");
        if (names && names.length - 1 >= dim) {
          name = names[dim].trim();
        }
      } else {
        name = this.name;
      }
    }

    return name;
  }

  legendItemLength(): number {
    return 9;
  }

  _getStyle(index: number): any {
    let style = null;
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
  }

  measureLegendItem(engine: wijmo.chart.IRenderEngine, index: number): wijmo.Size {
    var name = this._getName(index),
      sz = new wijmo.Size(0, 0),
      style = this._getStyle(index);

    if (name && style) {
      sz = this._measureLegendItem(engine, this._getName(index));
    }

    return sz;
  }

  drawLegendItem(engine: wijmo.chart.IRenderEngine, rect: wijmo.Rect, index: number): void {
    var style = this._getStyle(index), //this._getStyles(index) || this.style,
      name = this._getName(index);

    if (name && style) {
      this._drawLegendItem(engine, rect, index < 3 ? 5 : 3, name, style, this.symbolStyle);
    }
  }
}

    }
    


    module wijmo.chart.analytics {
    


'use strict';

/**
 * Specifies the quartile calculation method of {@link BoxWhisker} series.
 */
export enum QuartileCalculation {
    /** Include median value when calculating quartile. */
    InclusiveMedian,
    /** Exclude median value when calculating quartile. */
    ExclusiveMedian
}

/**
 * Represents a Box&Whisker chart series.
 *
 * The {@link BoxWhisker} series is normally used to compare distributions
 * between different sets of numerical data.
 */
export class BoxWhisker extends wijmo.chart.SeriesBase {

    private _groupWidth: number = 0.8;
    private _gapWidth: number = 0.1;
    private _showMeanLine: boolean;
    private _meanLineStyle: any;
    private _showMeanMarker: boolean;
    private _meanMarkerStyle: boolean;
    private _showInnerPoints = false;
    private _showOutliers = false;
    private _quartileCalculation: QuartileCalculation = QuartileCalculation.InclusiveMedian;
    hitTester: wijmo.chart._HitTester;

    /**
     * Initializes a new instance of the {@link BoxWhisker} class.
     * 
     * @param options JavaScript object containing initialization data for the object.
     */
    constructor(options?: any) {
        super();
        this._chartType = wijmo.chart.ChartType.Bar;
        this.rendering.addHandler(this._rendering, this);
        this.initialize(options);
    }

    private _initProperties(options) {
        wijmo.copy(this, options);
    }

    _clearValues() {
        super._clearValues();
    }

    /**
     * Gets or sets a value that specifies the quartile calculation method.
     */
    get quartileCalculation(): QuartileCalculation {
        return this._quartileCalculation;
    }
    set quartileCalculation(value: QuartileCalculation) {
        value = wijmo.asEnum(value, QuartileCalculation, true);
        if (value != this._quartileCalculation) {
            this._quartileCalculation = value;
            this._invalidate();
        }
    }

    /**
     * Gets or sets a value that determines the group width as a percentage.
     *
     * The default value for this property is 0.8. The min value is 0 and max value is 1.
     */
    get groupWidth(): number {
        return this._groupWidth;
    }
    set groupWidth(value: number) {
        if (value != this._groupWidth && value >= 0 && value <= 1) {
            this._groupWidth = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines the width of the gab between groups
     * as a percentage.
     *
     * The default value for this property is 0.1. The min value is 0 and max value is 1.
     */
    get gapWidth(): number {
        return this._gapWidth;
    }
    set gapWidth(value: number) {
        if (value != this._gapWidth && value >= 0 && value <= 1) {
            this._gapWidth = wijmo.asNumber(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show the mean line.
     */
    get showMeanLine(): boolean {
        return this._showMeanLine;
    }
    set showMeanLine(value: boolean) {
        if (value != this._showMeanLine) {
            this._showMeanLine = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that specifies the style for the mean line.
     */
    get meanLineStyle(): any {
        return this._meanLineStyle;
    }
    set meanLineStyle(value: any) {
        if (value != this._meanLineStyle) {
            this._meanLineStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show the mean marker.
     */
    get showMeanMarker(): boolean {
        return this._showMeanMarker;
    }
    set showMeanMarker(value: boolean) {
        if (value != this._showMeanMarker) {
            this._showMeanMarker = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that specifies the style for the mean marker.
     */
    get meanMarkerStyle(): any {
        return this._meanMarkerStyle;
    }
    set meanMarkerStyle(value: any) {
        if (value != this._meanMarkerStyle) {
            this._meanMarkerStyle = value;
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show the inner data points
     * for each point in the series.
     */
    get showInnerPoints(): boolean {
        return this._showInnerPoints;
    }
    set showInnerPoints(value: boolean) {
        if (value != this._showInnerPoints) {
            this._showInnerPoints = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether to show outliers.
     *
     * Outliers are inner points outside the range between the first
     * and third quartiles.
     */
    get showOutliers(): boolean {
        return this._showOutliers;
    }
    set showOutliers(value: boolean) {
        if (value != this._showOutliers) {
            this._showOutliers = wijmo.asBoolean(value, true);
            this._invalidate();
        }
    }

    private _rendering(sender: wijmo.chart.SeriesBase, args: wijmo.chart.SeriesRenderingEventArgs): void {
        args.cancel = true; // no default rendering

        var series = this,
            chart = series.chart,
            palette = series.chart,
            ax = series._getAxisX(),
            ay = series._getAxisY(),
            iser = args.index,
            nser = args.count,
            engine: wijmo.chart.IRenderEngine = args.engine;

        var plotter = <wijmo.chart._BarPlotter>this._plotter;
        var si = chart.series.indexOf(series);
        var ser: wijmo.chart.SeriesBase = wijmo.asType(series, wijmo.chart.SeriesBase);
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
        var fill = ser._getSymbolFill(si),
            altFill = ser._getAltSymbolFill(si) || fill,
            stroke = ser._getSymbolStroke(si),
            altStroke = ser._getAltSymbolStroke(si) || stroke;

        var len = yvals.length;
        if (xvals != null) {
            len = Math.min(len, xvals.length);
        }
        var origin = 0;

        var itemIndex = 0,
            currentFill: string,
            currentStroke: string;

        let ifmt = plotter.getItemFormatter(series);

        if (!plotter.rotated) {
            origin = ay.origin || origin;
            if (origin < ay.actualMin) {
                origin = ay.actualMin;
            } else if (origin > ay.actualMax) {
                origin = ay.actualMax;
            }

            var originScreen = ay.convert(origin),
                xmin = ax.actualMin,
                xmax = ax.actualMax;

            for (var i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i;
                var datay = <number[]><any>yvals[i];

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
                    var x0 = datax - 0.5 * cw + iser * w,
                        x1 = datax - 0.5 * cw + (iser + 1) * w,
                        offset = (x1 - x0) * gapWidth;

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

                    var boxPlot = new _BoxPlot(datay, quartileCalculation, showOutliers),
                        bpv = {
                            min: ay.convert(boxPlot.min),
                            max: ay.convert(boxPlot.max),
                            firstQuartile: ay.convert(boxPlot.firstQuartile),
                            median: ay.convert(boxPlot.median),
                            thirdQuartile: ay.convert(boxPlot.thirdQuartile),
                            mean: ay.convert(boxPlot.mean),
                            outlierPoints: this._convertPoints(boxPlot.outlierPoints, ay),
                            innerPoints: this._convertPoints(boxPlot.innerPoints, ay)
                        },
                        rect = new wijmo.Rect(Math.min(x0, x1), Math.min(bpv.min, bpv.max), Math.abs(x1 - x0), Math.abs(bpv.max - bpv.min));

                    var area = new wijmo.chart._RectArea(rect),
                        xs = {
                            min: Math.min(x0, x1),
                            median: (x0 + x1) / 2,
                            max: Math.max(x0, x1)
                        };

                    if (ifmt) {
                        engine.startGroup();
                        var hti: wijmo.chart.HitTestInfo = new wijmo.chart.HitTestInfo(chart, new wijmo.Point(xs.median, (bpv.min + bpv.max) / 2), wijmo.chart.ChartElement.SeriesSymbol);
                        hti._setData(series, i);

                        ifmt(engine, hti, () => {
                            this._drawBoxWhisker(engine, xs, bpv, prevXS, prevYS, series);
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

                    var dp = new wijmo.chart._DataPoint(si, i, datax, <any>datay);
                    (<any>dp).item = boxPlot;
                    area.tag = dp;
                    plotter.hitTester.add(area, si);

                    if (boxPlot.outlierPoints && boxPlot.outlierPoints.length) {
                        boxPlot.outlierPoints.forEach((p, i) => {
                            let y = bpv.outlierPoints[i];
                            let opArea = new wijmo.chart._CircleArea(new wijmo.Point(rect.left + rect.width / 2, y), 2);
                            opArea.tag = dp;
                            plotter.hitTester.add(opArea, si);
                        });
                    }
                }
            }
        } else {
            origin = ax.origin || origin;
            if (origin < ax.actualMin) {
                origin = ax.actualMin;
            } else if (origin > ax.actualMax) {
                origin = ax.actualMax;
            }

            var originScreen = ax.convert(origin),
                ymin = ay.actualMin,
                ymax = ay.actualMax;

            for (var i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i,
                    datay = <number[]><any>yvals[i];

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
                    var y0 = datax - 0.5 * cw + iser * w,
                        y1 = datax - 0.5 * cw + (iser + 1) * w,
                        offset = (y1 - y0) * gapWidth;

                    y0 += offset;
                    y1 -= offset;

                    if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                        continue;
                    }
                    y0 = ay.convert(y0);
                    y1 = ay.convert(y1);

                    var boxPlot = new _BoxPlot(datay, quartileCalculation, showOutliers),
                        bpv = {
                            min: ax.convert(boxPlot.min),
                            max: ax.convert(boxPlot.max),
                            firstQuartile: ax.convert(boxPlot.firstQuartile),
                            median: ax.convert(boxPlot.median),
                            thirdQuartile: ax.convert(boxPlot.thirdQuartile),
                            mean: ax.convert(boxPlot.mean),
                            outlierPoints: this._convertPoints(boxPlot.outlierPoints, ax),
                            innerPoints: this._convertPoints(boxPlot.innerPoints, ax)
                        },
                        rect = new wijmo.Rect(Math.min(bpv.min, bpv.max), Math.min(y0, y1), Math.abs(bpv.max - bpv.min), Math.abs(y1 - y0));

                    var area = new wijmo.chart._RectArea(rect),
                        ys = {
                            min: Math.min(y0, y1),
                            median: (y0 + y1) / 2,
                            max: Math.max(y1, y0)
                        };

                    if (ifmt) {
                        engine.startGroup();
                        var hti: wijmo.chart.HitTestInfo = new wijmo.chart.HitTestInfo(chart, new wijmo.Point((bpv.min + bpv.max) / 2, ys.median), wijmo.chart.ChartElement.SeriesSymbol);
                        hti._setData(series, i);

                        ifmt(engine, hti, () => {
                            this._drawBoxWhisker(engine, bpv, ys, prevXS, prevYS, series);
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

                    var dp = new wijmo.chart._DataPoint(si, i, <any>datay, datax);
                    (<any>dp).item = boxPlot;
                    area.tag = dp;
                    plotter.hitTester.add(area, si);

                    if (boxPlot.outlierPoints && boxPlot.outlierPoints.length) {
                        boxPlot.outlierPoints.forEach((p, i) => {
                            let x = bpv.outlierPoints[i];
                            let opArea = new wijmo.chart._CircleArea(new wijmo.Point(x, rect.top + rect.height / 2), 2);
                            opArea.tag = dp;
                            plotter.hitTester.add(opArea, si);
                        });
                    }
                }
            }
        }
    }

    _convertPoints(points: number[], axis: wijmo.chart._IAxis) {
        return points.map(p => axis.convert(p));
    }

    _drawBoxWhisker(engine: wijmo.chart.IRenderEngine, xs, ys, prevXS, prevYS, series: wijmo.chart._ISeries) {
        var style = series.symbolStyle,
            center: number,
            showInnerPoints = this.showInnerPoints,
            showOutliers = this.showOutliers,
            showMeanLine = this.showMeanLine,
            meanLineStyle = this.meanLineStyle,
            showMeanMarker = this.showMeanMarker,
            meanMarkerStyle = this.meanMarkerStyle,
            plotter = <wijmo.chart._BarPlotter>this._plotter;

        engine.startGroup('box-plot');
        engine.strokeWidth = 1;
        if (plotter.rotated) {
            engine.drawLine(xs.min, (ys.min + ys.median) / 2, xs.min, (ys.max + ys.median) / 2, null, style);
            engine.drawLine(xs.min, ys.median, xs.firstQuartile, ys.median, null, style);
            engine.drawRect(Math.min(xs.firstQuartile, xs.thirdQuartile), Math.min(ys.min, ys.max),
                Math.abs(xs.thirdQuartile - xs.firstQuartile), Math.abs(ys.max - ys.min), null, style);
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
                xs.outlierPoints.forEach(p => {
                    engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                });
            }
            if (showInnerPoints) {
                xs.innerPoints.forEach(p => {
                    engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                });
            }
        } else {
            engine.drawLine((xs.min + xs.median) / 2, ys.min, (xs.max + xs.median) / 2, ys.min, null, style);
            engine.drawLine(xs.median, ys.min, xs.median, ys.firstQuartile, null, style);
            engine.drawRect(Math.min(xs.min, xs.max), Math.min(ys.firstQuartile, ys.thirdQuartile),
                Math.abs(xs.max - xs.min), Math.abs(ys.thirdQuartile - ys.firstQuartile), null, style);
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
                ys.outlierPoints.forEach(p => {
                    engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                });
            }
            if (showInnerPoints) {
                ys.innerPoints.forEach(p => {
                    engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                });
            }
        }
        engine.endGroup();
    }

    _renderLabels(engine: wijmo.chart.IRenderEngine, smap: wijmo.chart._IHitArea[], chart: wijmo.chart.FlexChartCore, lblAreas: wijmo.chart._RectArea[]) {
        var series = this,
            plotter = <wijmo.chart._BarPlotter>this._plotter,
            len = smap.length,
            lbl = chart.dataLabel,
            bdr = lbl.border,
            offset = lbl.offset,
            line = lbl.connectingLine,
            dy = 'dataY',
            marg = 2;

        if (plotter.rotated) {
            dy = 'dataX';
        }
        if (offset === undefined) {
            offset = line ? 16 : 0;
        }
        if (bdr) {
            offset -= marg;
        }

        let dpts: wijmo.chart._DataPoint[] = [];

        for (var j = 0; j < len; j++) {
            var map = smap[j],
                tag = map.tag;

            var dp = <wijmo.chart._DataPoint>wijmo.asType(tag, wijmo.chart._DataPoint, true);
            if (dp && dpts.indexOf(dp) == -1) {
                dpts.push(dp);
                var item: _BoxPlot = tag.item;
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
                    let mean = Number(item.mean.toFixed(2));
                    tag[dy] = mean;
                    tag.yfmt = mean;
                    tag.y = mean;
                    this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                }
                if (item.showOutliers && item.outlierPoints) {
                    item.outlierPoints.forEach(v => {
                        tag[dy] = v;
                        tag.yfmt = v;
                        tag.y = v;
                        this._plotter._renderLabel(engine, map, dp, chart, lbl, series, offset, lblAreas);
                    })
                }
                tag.y = y;
            }
        }
    }
}

export class _BoxPlot {
    private _data: number[];
    private _min: number;
    private _max: number;
    private _mean: number;
    private _firstQuartile: number;
    private _thirdQuartile: number;
    private _median: number;
    private _quartileCalculation: QuartileCalculation;
    private _iqr: number;
    private _outlierPoints = [];
    private _innerPoints = [];
    private _showOutliers: boolean;

    constructor(data: number[], quartileCalculation: QuartileCalculation, showOutliers: boolean) {
        this._data = data;
        this._quartileCalculation = quartileCalculation;
        this._showOutliers = showOutliers;
        this._parse();
    }

    get showOutliers(): boolean {
        return this._showOutliers;
    }

    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }

    get mean(): number {
        return this._mean;
    }

    get firstQuartile(): number {
        return this._firstQuartile;
    }

    get thirdQuartile(): number {
        return this._thirdQuartile;
    }

    get median(): number {
        return this._median;
    }

    get outlierPoints(): number[] {
        return this._outlierPoints;
    }

    get innerPoints(): number[] {
        return this._innerPoints;
    }

    _parse() {
        var len = this._data.length,
            data = this._data,
            total = 0;

        this._outlierPoints = [];
        this._innerPoints = [];
        data.sort((a, b) => a - b);
        //filter null value.
        data.some(v => {
            if (v == null) {
                return false;
            }
            this._min = v;
            return true;
        });
        this._max = data[len - 1] == null ? 0 : data[len - 1];
        if (this._quartileCalculation === QuartileCalculation.InclusiveMedian) {
            this._firstQuartile = this._quartileInc(data, 0.25);
            this._median = this._quartileInc(data, 0.5);
            this._thirdQuartile = this._quartileInc(data, 0.75);
        } else {
            this._firstQuartile = this._quartileExc(data, 0.25);
            this._median = this._quartileExc(data, 0.5);
            this._thirdQuartile = this._quartileExc(data, 0.75);
        }
        this._iqr = 1.5 * Math.abs(this._thirdQuartile - this._firstQuartile);

        var minLimits = this._firstQuartile - this._iqr,
            maxLimits = this._thirdQuartile + this._iqr;

        if (this._showOutliers) {
            var minmax = this._max;
            this._max = this._min;
            this._min = minmax;
            this._data.forEach(v => {
                total += v;
                if (v < minLimits || v > maxLimits) {
                    this._outlierPoints.push(v);
                } else {
                    if (v < this._min) {
                        this._min = v;
                    }
                    if (v > this._max) {
                        this._max = v;
                    }
                }
            });
        } else {
            total = this._data.reduce((a, b) => a + b, 0);
        }
        this._innerPoints = this._data.filter(v => {
            if (v > this._min && v < this._max) {
                return true;
            }
        });
        this._mean = total / len;
    }

    _quartileInc(data: number[], percent: number) {
        var len = data.length,
            p1, p2, v, offset;

        if (len === 1) {
            return data[0];
        }

        p1 = (len - 1) * percent + 1;
        p2 = Math.floor(p1);
        v = data[p2 - 1];
        offset = p1 - p2;
        return v + (data[p2] - v) * offset;
    }

    _quartileExc(data: number[], percent: number) {
        var len = data.length,
            p1, p2, v, offset;

        //if (len < 3) return NaN;
        if (len === 1) {
            return data[0];
        } else if (len === 2) {
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
    }
}
    }
    


    module wijmo.chart.analytics {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.analytics', wijmo.chart.analytics);









    }
    