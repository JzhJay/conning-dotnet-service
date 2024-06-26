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


    module wijmo.chart.radar {
    



'use strict';

/**
 * Represents a series of data points to display in the chart.
 *
 * The {@link FlexRadarSeries} class supports all basic chart types. You may define
 * a different chart type on each {@link FlexRadarSeries} object that you add to the
 * {@link FlexRadar} series collection. This overrides the {@link chartType}
 * property set on the chart that is the default for all {@link FlexRadarSeries} objects
 * in its collection.
 */
export class FlexRadarSeries extends wijmo.chart.SeriesBase {
    private _finChartType;

    /**
     * Gets or sets the chart type for a specific series, overriding the chart type
     * set on the overall chart. Please note that ColumnVolume, EquiVolume,
     * CandleVolume and ArmsCandleVolume chart types are not supported and should be
     * set on the {@link FinancialChart}.
     */
    get chartType(): RadarChartType {
        return this._finChartType;
    }
    set chartType(value: RadarChartType) {
        value = wijmo.asEnum(value, RadarChartType, true);
        if (value != this._finChartType) {
            this._finChartType = value;
            this._invalidate();
        }
    }

    _getChartType(): wijmo.chart.ChartType {
        var ct;
        switch (this.chartType) {
            case RadarChartType.Area:
                ct = wijmo.chart.ChartType.Area;
                break;
            case RadarChartType.Line:
                ct = wijmo.chart.ChartType.Line;
                break;
            case RadarChartType.Column:
                ct = wijmo.chart.ChartType.Column;
                break;
            case RadarChartType.LineSymbols:
                ct = wijmo.chart.ChartType.LineSymbols;
                break;
            case RadarChartType.Scatter:
                ct = wijmo.chart.ChartType.Scatter;
                break;
        }

        return ct;
    }

}
    }
    


    module wijmo.chart.radar {
    


'use strict';

/**
 * Line/scatter radar chart plotter.
 */
export class _RadarLinePlotter extends wijmo.chart._LinePlotter {
    isArea: boolean = false;

    _getLabelPoint(series, dataPoint: wijmo.chart._DataPoint): wijmo.Point {
        var ax = series._getAxisX(),
            ay = series._getAxisY(),
            angle = ax.convert(dataPoint.dataX),
            radius = ay.convert(dataPoint.dataY);

        return (<any>this.chart)._convertPoint(radius, angle);
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: wijmo.chart._ISeries, palette: wijmo.chart._IPalette, iser: number, nser: number) {
        var ser: wijmo.chart.SeriesBase = wijmo.asType(series, wijmo.chart.SeriesBase),
            chart = <any>this.chart,
            chartType = ser._getChartType() || chart._getChartType(),
            si = chart.series.indexOf(series);

        var ys = series.getValues(0);
        var xs = series.getValues(1);
        if (!ys) {
            return;
        }
        if (!xs) {
            xs = this.dataInfo.getXVals();
        }

        var style = wijmo.chart._BasePlotter.cloneStyle(series.style, ['fill']);
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

        var xvals = new Array<number>();
        var yvals = new Array<number>();
        var ymax = ay.actualMax;

        var stacked = this.stacking != wijmo.chart.Stacking.None && !ser._isCustomAxisY();
        var stacked100 = this.stacking == wijmo.chart.Stacking.Stacked100pc && !ser._isCustomAxisY();
        if (ser._getChartType() !== undefined) {
            stacked = stacked100 = false;
        }

        var interpolateNulls = ser.interpolateNulls;
        var hasNulls = false;

        let ifmt = this.getItemFormatter(series);

        for (var i = 0; i < len; i++) {
            var datax = hasXs ? xs[i] : i;
            var datay = ys[i] == null ? 0 : ys[i];

            if (wijmo.chart._DataInfo.isValid(datax) && wijmo.chart._DataInfo.isValid(datay)) {

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
                datay = Math.min(datay, ymax);

                var dpt: wijmo.chart._DataPoint;

                dpt = new wijmo.chart._DataPoint(si, i, datax, datay);
                var angle = ax.convert(datax),
                    radius = ay.convert(datay),
                    point = (<any>this.chart)._convertPoint(radius, angle);

                datax = point.x;
                datay = point.y;

                if (!isNaN(datax) && !isNaN(datay)) {
                    xvals.push(datax);
                    yvals.push(datay);

                    var area = new wijmo.chart._CircleArea(new wijmo.Point(datax, datay), 0.5 * symSize);
                    area.tag = dpt;
                    this.hitTester.add(area, si);
                } else {
                    hasNulls = true;
                    if (interpolateNulls !== true) {
                        xvals.push(undefined);
                        yvals.push(undefined);
                    }
                }
            } else {
                hasNulls = true;
                if (interpolateNulls !== true) {
                    xvals.push(undefined);
                    yvals.push(undefined);
                }
            }
        }

        var itemIndex = 0;

        if (this.hasLines) {
            if (this.isArea) {
                engine.fill = fill || palette._getColorLight(si);
            } else {
                engine.fill = 'none';
            }

            if (hasNulls && interpolateNulls !== true) {
                var dx = [];
                var dy = [];

                for (var i = 0; i < len; i++) {
                    if (xvals[i] === undefined) {
                        dx.push(undefined);
                        dy.push(0);
                    }
                    else {
                        dx.push(xvals[i]);
                        dy.push(yvals[i]);
                    }
                }
                if (dx.length > 1) {
                    if (chart._isPolar && chartType !== wijmo.chart.ChartType.Area) {
                        this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                    } else {
                        if (chart.totalAngle < 360) {
                            dx.push(chart._center.x);
                            dy.push(chart._center.y);
                        }
                        engine.drawPolygon(dx, dy, null, style, this.chart._plotrectId);
                    }
                    this.hitTester.add(new wijmo.chart._LinesArea(dx, dy), si);
                    itemIndex++;
                }
            } else {
                if (chart._isPolar && chartType !== wijmo.chart.ChartType.Area) {
                    this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                } else {
                    if (chart.totalAngle < 360) {
                        xvals.push(chart._center.x);
                        yvals.push(chart._center.y);
                    }
                    engine.drawPolygon(xvals, yvals, null, style, this.chart._plotrectId);
                }
                this.hitTester.add(new wijmo.chart._LinesArea(xvals, yvals), si);
                itemIndex++;
            }
        }

        engine.fill = fill;
        for (var i = 0; i < len; i++) {
            var datax = xvals[i];
            var datay = yvals[i];

            // scatter fill/stroke
            if (this.hasLines === false) {
                engine.fill = ys[i] > 0 ? fill : altFill;
                engine.stroke = ys[i] > 0 ? stroke : altStroke;
            }

            if (this.isValid(datax, datay, ax, ay)) {
                if ((this.hasSymbols || ifmt) && symSize > 0) {
                    this._drawSymbol(engine, datax, datay, symSize, ser, i, ifmt);
                }
                series._setPointIndex(i, itemIndex);
                itemIndex++;
            }
        }
    }
}
    }
    


    module wijmo.chart.radar {
    


'use strict';

/**
 * Column(Rose) radar chart plotter.
 */
export class _RadarBarPlotter extends wijmo.chart._BarPlotter {
    
    adjustLimits(dataInfo: wijmo.chart._DataInfo, plotRect: wijmo.Rect): wijmo.Rect {
        this.dataInfo = dataInfo;

        var xmin = dataInfo.getMinX();
        var ymin = dataInfo.getMinY();
        var xmax = dataInfo.getMaxX();
        var ymax = dataInfo.getMaxY();

        var dx = dataInfo.getDeltaX();
        if (dx <= 0) {
            dx = 1;
        }
        if ((<any>this.chart).totalAngle < 360) {
            dx = 0;
        }

        this.unload();
        if (!this.chart.axisY._getLogBase()) {
            if (this.origin > ymax) {
                ymax = this.origin;
            } else if (this.origin < ymin) {
                ymin = this.origin;
            }
        }
        return new wijmo.Rect(xmin, ymin, xmax - xmin + dx, ymax - ymin);
    }

    _getLabelPoint(series, dataPoint: wijmo.chart._DataPoint): wijmo.Point {
        var ax = series._getAxisX(),
            ay = series._getAxisY(),
            angle = ax.convert(dataPoint.dataX),
            radius = ay.convert(dataPoint.dataY);

        return (<any>this.chart)._convertPoint(radius, angle);
    }

    plotSeries(engine: wijmo.chart.IRenderEngine, ax: wijmo.chart._IAxis, ay: wijmo.chart._IAxis, series: wijmo.chart._ISeries, palette: wijmo.chart._IPalette, iser: number, nser: number) {
        var si = this.chart.series.indexOf(series);
        var ser: wijmo.chart.SeriesBase = wijmo.asType(series, wijmo.chart.SeriesBase);
        var options = this.chart._options;
        var cw = this.width;
        var wpx = 0;
        var chart: any = this.chart;
        var startAngle = - 90 * Math.PI / 180;
        iser = iser || 0;
        var axid = ser._getAxisY()._uniqueId;
        var area;

        var stackNeg = this.stackNegMap[axid];
        var stackPos = this.stackPosMap[axid];
        var stacked = this.stacking != wijmo.chart.Stacking.None;
        var stacked100 = this.stacking == wijmo.chart.Stacking.Stacked100pc;

        var yvals = series.getValues(0);
        var xvals = series.getValues(1);

        if (!yvals) {
            return;
        }

        if (!xvals) {
            xvals = this.dataInfo.getXVals();
        }

        // find minimal distance between point and use it as column width
        var delta;
        if (xvals) {
            delta = chart.totalAngle / xvals.length;
        } else {
            delta = chart.totalAngle / (ax.actualMax - ax.actualMin);
        }
        if (delta > 0) {
            if (stacked) {
                cw = delta * cw * Math.PI / 180;
            } else {
                cw = delta * Math.pow(cw, iser + 1) * Math.PI / 180;
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

        if (ser._getChartType() !== undefined) {
            stacked = stacked100 = false;
        }

        if (origin < ay.actualMin) {
            origin = ay.actualMin;
        } else if (origin > ay.actualMax) {
            origin = ay.actualMax;
        }

        var originScreen = ay.convert(origin),
            xmin = ax.actualMin,
            xmax = ax.actualMax,
            ymax = ay.actualMax;

        if (ser._isCustomAxisY()) {
            stacked = stacked100 = false;
        }

        if (!chart._areas[si]) {
            chart._areas[si] = [];
        }

        for (var i = 0; i < len; i++) {
            var datax = xvals ? xvals[i] : i;
            var datay = yvals[i] == null ? 0 : yvals[i];

            if (this._getSymbolOrigin) {
                originScreen = ay.convert(this._getSymbolOrigin(origin, i, len));
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

            if (wijmo.chart._DataInfo.isValid(datax) && wijmo.chart._DataInfo.isValid(datay)) {

                if (stacked) {
                    var x0 = datax - 0.5 * cw,
                        x1 = datax + 0.5 * cw;
                    if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                        continue;
                    }
                    x0 = ax.convert(x0);
                    x1 = ax.convert(x1);

                    if (!wijmo.chart._DataInfo.isValid(x0) || !wijmo.chart._DataInfo.isValid(x1)) {
                        continue;
                    }

                    var y0: number, y1: number;

                    if (stacked100) {
                        var sumabs = this.dataInfo.getStackedAbsSum(datax);
                        datay = datay / sumabs;
                    }

                    var sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                    y0 = sum;
                    y1 = sum + datay;
                    stackPos[datax] = sum + datay;

                    var angle = ax.convert(datax),
                        radius0 = ay.convert(y0),
                        radius1 = ay.convert(y1);

                    angle = angle - cw / 2;
                    engine.drawDonutSegment(chart._center.x, chart._center.y, radius1, radius0, angle + startAngle, cw, null, ser.symbolStyle); 

                    area = new wijmo.chart._DonutSegment(new wijmo.Point(chart._center.x, chart._center.y), radius1, radius0, angle + startAngle, cw, chart.startAngle || 0);
                    area.tag = new wijmo.chart._DataPoint(si, i, datax, sum + datay);
                    this.hitTester.add(area, si);
                } else {

                    var angle = ax.convert(datax),
                        radius = ay.convert(Math.min(datay, ymax)),
                        p = chart._convertPoint(radius, angle);

                    angle = angle - cw / 2;
                    engine.drawPieSegment(chart._center.x, chart._center.y, radius, angle + startAngle, cw, null, ser.symbolStyle);

                    area = new wijmo.chart._PieSegment(new wijmo.Point(chart._center.x, chart._center.y), radius, angle + startAngle, cw, chart.startAngle);
                    area.tag = new wijmo.chart._DataPoint(si, i, datax, datay);
                    this.hitTester.add(area, si);
                }
                chart._areas[si].push(area);
                series._setPointIndex(i, itemIndex);
                itemIndex++;
            }
        }
    }
}
    }
    


    module wijmo.chart.radar {
    








'use strict';

/**
 * Specifies the type of radar chart.
 */
export enum RadarChartType {
    /** Shows vertical bars and allows you to compare values of items across categories. */
    Column,
    /** Shows patterns within the data using X and Y coordinates. */
    Scatter,
    /** Shows trends over a period of time or across categories. */
    Line,
    /** Shows line chart with a symbol on each data point. */
    LineSymbols,
    /** Shows line chart with the area below the line filled with color. */
    Area
}

/**
 * radar chart control.
 */
export class FlexRadar extends wijmo.chart.FlexChartCore {

    private _chartType = RadarChartType.Line;
    private _startAngle = 0;
    private _totalAngle = 360;
    private _reversed = false;
    _center: wijmo.Point;
    _radius: number;
    _angles: number[];
    _isPolar: boolean;
    _areas: any[] = [];
    private __radarLinePlotter;
    private __radarColumnPlotter;

    /**
     * Initializes a new instance of the {@link FlexRadar} class.
     *
     * @param element The DOM element that hosts the control, or a selector for the
     * host element (e.g. '#theCtrl').
     * @param options A JavaScript object containing initialization data for the
     * control.
     */
    constructor(element: any, options?: any) {
        super(element, options);
    }

    private get _radarLinePlotter() {
        if (this.__radarLinePlotter == null) {
            this.__radarLinePlotter = new _RadarLinePlotter();
            this._initPlotter(this.__radarLinePlotter);
        }
        return this.__radarLinePlotter;
    }

    private get _radarColumnPlotter() {
        if (this.__radarColumnPlotter == null) {
            this.__radarColumnPlotter = new _RadarBarPlotter();
            this._initPlotter(this.__radarColumnPlotter);
        }
        return this.__radarColumnPlotter;
    }

    _initAxes() {
        super._initAxes();
        this.axes.pop();
        this.axes.pop();

        this.axisX = new FlexRadarAxis(wijmo.chart.Position.Bottom);
        this.axisX.majorGrid = true;
        this.axisY = new FlexRadarAxis(wijmo.chart.Position.Left);
        this.axisY.majorTickMarks = wijmo.chart.TickMark.Outside;
        this.axes.push(this.axisX);
        this.axes.push(this.axisY);
    }

    _layout(rect: wijmo.Rect, size: wijmo.Size, engine: wijmo.chart.IRenderEngine) {
        super._layout(rect, size, engine);

        var height = (<FlexRadarAxis>this.axisX)._height;
        this._plotRect.top += height / 2;

        var pr = this._plotRect;
        this._radius = Math.min( Math.max(20, pr.width - height), pr.height) / 2;
        this._center = new wijmo.Point(pr.left + pr.width / 2, pr.top + pr.height / 2);
    }

    /**
     * Gets or sets the type of radar chart to be created.
     */
    get chartType(): RadarChartType {
        return this._chartType;
    }
    set chartType(value: RadarChartType) {
        value = wijmo.asEnum(value, RadarChartType);
        if (value != this._chartType) {
            this._chartType = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the starting angle for the radar, in degrees.
     *
     * Angles are measured clockwise, starting at the 12 o'clock position.
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
     * Gets or sets the total angle for the radar, in degrees.  Its default value is 360.
     * The value must be greater than 0, or less than or equal to 360.
     */
    get totalAngle(): number {
        return this._totalAngle;
    }
    set totalAngle(value: number) {
        if (value != this._totalAngle && value >= 0) {
            this._totalAngle = wijmo.asNumber(value, true);
            if (this._totalAngle <= 0) {
                wijmo.assert(false, "totalAngle must be greater than 0.");
                this._totalAngle = 0;
            }
            if (this._totalAngle > 360) {
                wijmo.assert(false, "totalAngle must be less than or equal to 360.");
                this._totalAngle = 360;
            }
            this.invalidate();
        }
    }

    /**
     * Gets or sets a value that determines whether angles are reversed 
     * (counter-clockwise).
     *
     * The default value is false, which causes angles to be measured in
     * the clockwise direction.
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
     * Gets or sets a value that determines whether and how the series objects are stacked.
     */
    get stacking(): wijmo.chart.Stacking {
        return this._stacking;
    }
    set stacking(value: wijmo.chart.Stacking) {
        value = wijmo.asEnum(value, wijmo.chart.Stacking);
        if (value != this._stacking) {
            this._stacking = value;
            this.invalidate();
        }
    }

    _getChartType(): wijmo.chart.ChartType {
        var ct = wijmo.chart.ChartType.Line;
        switch (this.chartType) {
            case RadarChartType.Area:
                ct = wijmo.chart.ChartType.Area;
                break;
            case RadarChartType.Line:
                ct = wijmo.chart.ChartType.Line;
                break;
            case RadarChartType.Column:
                ct = wijmo.chart.ChartType.Column;
                break;
            case RadarChartType.LineSymbols:
                ct = wijmo.chart.ChartType.LineSymbols;
                break;
            case RadarChartType.Scatter:
                ct = wijmo.chart.ChartType.Scatter;
                break;
        }

        return ct;
    }

    _getPlotter(series: FlexRadarSeries): wijmo.chart._IPlotter {
        var chartType = this.chartType,
            plotter: any = null,
            isSeries = false;

        if (series) {
            var stype = series.chartType;
            if (stype != null && stype != chartType) {
                chartType = stype;
                isSeries = true;
            }
        }

        switch (chartType) {
            // no plotter found for RadarChartType - try based on ChartType
            case RadarChartType.Line:
                this._radarLinePlotter.hasSymbols = false;
                this._radarLinePlotter.hasLines = true;
                this._radarLinePlotter.isArea = false;
                plotter = this._radarLinePlotter;
                break;
            case RadarChartType.LineSymbols:
                this._radarLinePlotter.hasSymbols = true;
                this._radarLinePlotter.hasLines = true;
                this._radarLinePlotter.isArea = false;
                plotter = this._radarLinePlotter;
                break;
            case RadarChartType.Area:
                this._radarLinePlotter.hasSymbols = false;
                this._radarLinePlotter.hasLines = true;
                this._radarLinePlotter.isArea = true;
                plotter = this._radarLinePlotter;
                break;
            case RadarChartType.Scatter:
                this._radarLinePlotter.hasSymbols = true;
                this._radarLinePlotter.hasLines = false;
                this._radarLinePlotter.isArea = false;
                plotter = this._radarLinePlotter;
                break;
            case RadarChartType.Column:
                this._radarColumnPlotter.isVolume = false;
                this._radarColumnPlotter.width = 0.8;
                plotter = this._radarColumnPlotter;
                break;
            default:
                plotter = super._getPlotter(series);
                break;
        }

        return plotter;
    }

    _convertPoint(radius, angle) {
        var pt = new wijmo.Point(),
            center = this._center;

        pt.x = center.x + radius * Math.sin(angle);
        pt.y = center.y - radius * Math.cos(angle);
        return pt;
    }

    _createSeries(): wijmo.chart.SeriesBase {
        return new FlexRadarSeries();
    }

    _clearCachedValues() {
        super._clearCachedValues();
        this._isPolar = false;
        this._areas = [];
    }

    _performBind() {
        this._xDataType = null;
        this._xlabels.splice(0);
        this._xvals.splice(0);
        if (this._cv) {
            var items = this._cv.items;
            if (items) {
                var len = items.length;
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    let bndx = this.bindingX ? new wijmo.Binding(this.bindingX) : null;
                    if (bndx) {
                        var x = bndx.getValue(item);
                        if (wijmo.isNumber(x)) {
                            this._xvals.push(wijmo.asNumber(x));
                            this._xDataType = wijmo.DataType.Number;
                        } else if (wijmo.isDate(x)) {
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
        if (this._xDataType === wijmo.DataType.Number) {
            this._isPolar = true;
        }
    }

    _prepareRender() {
        super._prepareRender();
        this._areas = [];
    }
}
    }
    


    module wijmo.chart.radar {
    




'use strict';

/**
 * Represents an axis in the radar chart.
 */
export class FlexRadarAxis extends wijmo.chart.Axis {

    private _points = [];
    private _axisLabels = [];
    _height: number;
    private __actualMin;
    private __actualMax;

    _render(engine: wijmo.chart.IRenderEngine) {
        if (!this._hasVisibileSeries()) {
            return;
        }
        super._render(engine);

        var labels = this._axisLabels;
        if (labels.length) {
            var renderLabels = () => {
                var cls = this.axisType == wijmo.chart.AxisType.X ? 'wj-axis-x-labels ' + wijmo.chart.FlexChart._CSS_AXIS_X : 'wj-axis-y-labels ' + wijmo.chart.FlexChart._CSS_AXIS_Y;
                engine.startGroup(cls);
                labels.forEach(lbl => {
                    var labelAngle = lbl.labelAngle;
                    if (labelAngle > 0) {
                        if (labelAngle == 90) {
                            wijmo.chart.FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                        } else {
                            wijmo.chart.FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                        }
                    } else if (labelAngle < 0) {
                        if (labelAngle == -90) {
                            wijmo.chart.FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                        } else {
                            wijmo.chart.FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                        }
                    } else {
                        this._renderLabel(engine, lbl.val, lbl.text, lbl.pos, lbl.align, lbl.vAlign /*1*/, lbl.class);
                    }
                });
                engine.endGroup();
                this._axisLabels = [];
                this._chart.rendered.removeHandler(renderLabels);
            };
            this._chart.rendered.addHandler(renderLabels, this);
        }
    }

    _getHeight(engine: wijmo.chart.IRenderEngine, maxw: number): number {
        var height = super._getHeight(engine, maxw);
        if (this._axisType == wijmo.chart.AxisType.Y) {
            height = 4;
        }
        this._height = height * 2;
        return this._height;
    }

    _getActualRange() {
        if (this._isTimeAxis && this.__actualMax != null && this.__actualMin != null) {
            return this.__actualMax - this.__actualMin;
        }
        return super._getActualRange();
    }

    _updateActualLimits(dataType: wijmo.DataType, dataMin: number, dataMax: number, labels: string[] = null, values: number[] = null) {
        super._updateActualLimits(dataType, dataMin, dataMax, labels, values);

        var chart: any = this._chart,
            lbls = this._lbls,
            min = this.actualMin.valueOf ? this.actualMin.valueOf() : this.actualMin,
            max = this.actualMax.valueOf ? this.actualMax.valueOf() : this.actualMax,
            len;

        if (this._lbls && this === chart.axisX) {
            chart._angles = [];
            if (this._isTimeAxis && this._lbls.length === 0) {
                this._values.forEach(v => {
                    lbls.push(this._formatValue(v))
                });
            }
            len = lbls.length;
            if (chart.totalAngle < 360) {
                len -= 1;
            }
            lbls.forEach((v, i) => {
                var val = min + (i / len) * (max - min),
                    angle = chart.startAngle + (i / len) * chart.totalAngle;

                if (!isNaN(angle) && !isNaN(val)) {
                    chart._angles.push({
                        value: this.convert(val),
                        angle: angle
                    });
                }
                if (this._isTimeAxis) {
                    if (this.__actualMin == null || this.__actualMin > v) {
                        this.__actualMin = v;
                    }
                    if (this.__actualMax == null || this.__actualMax < v) {
                        this.__actualMax = v;
                    }
                } else if (this.__actualMin != null || this.__actualMax != null) {
                    this.__actualMin = null;
                    this.__actualMax = null;
                }
            });
            if (this._isTimeAxis && this._lbls.length > 0) {
                this._updateAutoFormat(0);
                this._lbls = lbls.map(v => {
                    let val = wijmo.asDate(<any>v).valueOf();
                    return this._formatValue(val);
                });
            }
        }
    }

    _updateActualLimitsByChartType(labels, min, max) {
        var chart: any = this._chart,
            ctype = chart._getChartType();

        if (ctype != wijmo.chart.ChartType.Column && chart.totalAngle === 360) {
            if (this.axisType === wijmo.chart.AxisType.X) {
                if (this._isTimeAxis) {
                    var len = (chart._xlabels.length || chart._xvals.length) - 1;
                    len = len < 1 ? 1 : len;
                    max += (max - min) / len;
                } else if (!chart._isPolar) {
                    max += 1;
                }
            }
        }
        return { min: min, max: max };
    }

    _isOverlapped(engine: wijmo.chart.IRenderEngine, w: number, lblClass: string, axisType: wijmo.chart.AxisType) : boolean {
        return false;
    }

    /**
     * Converts the specified value from data to pixel coordinates.
     *
     * @param val The data value to convert.
     * @param maxValue The max value of the data, it's optional.
     * @param minValue The min value of the data, it's optional.
     */
    convert(val: number, maxValue?: number, minValue?: number): number {
        var max = maxValue == null ? this.actualMax : maxValue,
            min = minValue == null ? this.actualMin : minValue,
            chart: FlexRadar = <FlexRadar>this._chart;

        if (!chart) {
            return NaN;
        }
        if (max == min) {
            return 0;
        }

        if (this.axisType === wijmo.chart.AxisType.X) {
            if (chart.reversed) {
                return (chart.startAngle - (val - min) / (max - min) * chart.totalAngle) * Math.PI / 180;
            } else {
                return (chart.startAngle + (val - min) / (max - min) * chart.totalAngle) * Math.PI / 180;
            }
        } else {
            var base = this._getLogBase();

            if (!base) {
                return (val - min) / (max - min) * chart._radius;
            } else {
                if (val <= 0) {
                    return NaN;
                }

                var maxl = Math.log(max / min);
                return Math.log(val / min) / maxl * chart._radius;
            }
        }
    }

    _renderLineAndTitle(engine) {
        var chart = <any>this._chart,
            lineClass = wijmo.chart.FlexChart._CSS_LINE,
            //pie segment draw from 9 o'clock in IRenderEngine
            startAngle = (chart.startAngle - 90) * Math.PI / 180,
            totalAngle = chart.totalAngle * Math.PI / 180,
            radius = chart._radius;

        if (this.axisType === wijmo.chart.AxisType.X && this.axisLine) {
            engine.stroke = wijmo.chart.FlexChart._FG;
            if (chart._isPolar) {
                startAngle = chart.reversed ? startAngle - totalAngle : startAngle;
                engine.drawPieSegment(chart._center.x, chart._center.y, radius, startAngle, totalAngle, lineClass); 
            } else {
                this._renderPolygon(engine, radius, lineClass);
            }
        }
    }

    _renderPolygon(engine, r, cls) {
        var chart = <any>this._chart,
            cAngles = chart._angles,
            angleLen = cAngles.length,
            showXMinor = chart.axisX.minorGrid,
            gXPoints = [], gYPoints = [];

        cAngles.forEach((a, i) => {
            if (showXMinor && i > 0) {
                var newP = chart._convertPoint(r, a.value - (a.value - cAngles[i - 1].value) / 2);
                gXPoints.push(newP.x);
                gYPoints.push(newP.y);
            }
            var p = chart._convertPoint(r, a.value);
            gXPoints.push(p.x);
            gYPoints.push(p.y);
        });
        if (chart.totalAngle < 360) {
            gXPoints.push(chart._center.x);
            gYPoints.push(chart._center.y);
        } else if (showXMinor && angleLen >= 2) {
            //add last point
            var newP = chart._convertPoint(r, cAngles[angleLen - 1].value - (cAngles[angleLen - 2].value - cAngles[angleLen - 1].value) / 2);
            gXPoints.push(newP.x);
            gYPoints.push(newP.y);
        }
        engine.drawPolygon(gXPoints, gYPoints, cls);
    }

    _renderMinors(engine: wijmo.chart.IRenderEngine, ticks: number[], isVert: boolean, isNear: boolean) {
        var chart: any = this._chart,
            glineClass = wijmo.chart.FlexChart._CSS_GRIDLINE_MINOR,
            grid = this.minorGrid,
            cAngles = chart._angles,
            angleLen = cAngles.length,
            showXMinor = chart.axisX.minorGrid,
            gstroke = wijmo.chart.FlexChart._FG,
            gth = this._GRIDLINE_WIDTH,
            //pie segment draw from 9 o'clock in IRenderEngine
            startAngle = chart.startAngle * Math.PI / 180,
            totalAngle = chart.totalAngle * Math.PI / 180,
            tover = this._TICK_OVERLAP,
            tickMarks = this.minorTickMarks,
            hasTicks = true, angle;

        this._vals.minor = ticks;
        if (tickMarks == wijmo.chart.TickMark.Outside) {
            tover = 1;
        } else if (tickMarks == wijmo.chart.TickMark.Inside) {
            tover = -1;
        } else if (tickMarks == wijmo.chart.TickMark.Cross) {
            tover = 0;
        } else {
            hasTicks = false;
        }

        if (this.axisType == wijmo.chart.AxisType.Y) {
            engine.stroke = gstroke;
            engine.strokeWidth = gth;
            ticks.forEach(val => {
                var y = this.convert(val),
                    t;
                if (grid) {
                    this._renderYGridLine(engine, chart, y, glineClass);
                };
                if (hasTicks) {
                    cAngles.forEach((a, i) => {
                        if (showXMinor && i > 0) {
                            angle = a.value - (a.value - cAngles[i - 1].value) / 2;
                            var newP = chart._convertPoint(y, angle);
                            this._drawMinorTickLength(engine, tover, angle, newP);
                        }
                        angle = a.value;
                        var p = chart._convertPoint(y, angle);
                        this._drawMinorTickLength(engine, tover, angle, p);
                    });

                    if (showXMinor && angleLen >= 2) {
                        //add last point
                        angle = cAngles[angleLen - 1].value - (cAngles[angleLen - 2].value - cAngles[angleLen - 1].value) / 2;
                        var newP = chart._convertPoint(y, angle);
                        this._drawMinorTickLength(engine, tover, angle, newP);
                    }
                }
            });
        } else {
            engine.stroke = gstroke;
            engine.strokeWidth = gth;
            ticks.forEach(val => {
                var x = this.convert(val);
                if (grid) {
                    this._renderXGridLine(engine, chart, x, glineClass);
                    if (hasTicks) {
                        //draw x minor tick
                        this._drawMinorTickLength(engine, tover, x - Math.PI / 2, chart._convertPoint(chart._radius, x));

                    }
                }
            });
        }
    }

    private _drawMinorTickLength(engine, tover, angle, pt) {
        var th = this._TICK_HEIGHT,
            tickClass = wijmo.chart.FlexChart._CSS_TICK_MINOR;
        
        var x1 = 0.5 * (tover - 1) * th * Math.cos(angle);
        var x2 = 0.5 * (1 + tover) * th * Math.cos(angle);
        var y1 = 0.5 * (tover - 1) * th * Math.sin(angle);
        var y2 = 0.5 * (1 + tover) * th * Math.sin(angle);

        engine.drawLine(pt.x + x1, pt.y + y1, pt.x + x2, pt.y + y2, tickClass);
    }
    
    _renderLabelsAndTicks(engine, index, val, sval, labelAngle, tickMarks, showLabel, t1, t2) {
        this._points = [];

        labelAngle = this.labelAngle || 0;
        var hasLbl = true,
            chart: any = this._chart,
            labelPadding = this.labelPadding || 2,
            lblClass = wijmo.chart.FlexChart._CSS_LABEL,
            glineClass = wijmo.chart.FlexChart._CSS_GRIDLINE,
            tickClass = wijmo.chart.FlexChart._CSS_TICK,
            tstroke = wijmo.chart.FlexChart._FG,
            tth = this._TICK_WIDTH,
            has_gline = this.majorGrid,
            gstroke = wijmo.chart.FlexChart._FG,
            gth = this._GRIDLINE_WIDTH,
            //pie segment draw from 9 o'clock in IRenderEngine
            startAngle = chart.startAngle * Math.PI / 180,
            totalAngle = chart.totalAngle * Math.PI / 180,
            gXPoints = [], gYPoints = [], vAlign = 1, sAngle;

        if (this.axisType == wijmo.chart.AxisType.Y) {
            has_gline = val != this.actualMin && has_gline && val != this.actualMax;
            var y = this.convert(val),
                point = chart._convertPoint(y, startAngle);

            if (has_gline) {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                this._renderYGridLine(engine, chart, y, glineClass);
            }
            engine.stroke = tstroke;
            engine.strokeWidth = tth;
            if (showLabel) {
                sAngle = (chart.startAngle % 360 + 360) % 360;
                if ((sAngle <= 90 && sAngle >= 75) || (sAngle >= 270 && sAngle <= 285)) {
                    vAlign = 2;
                } else if ((sAngle > 90 && sAngle <= 105) || (sAngle < 270 && sAngle >= 255)) {
                    vAlign = 0;
                }
                var lpt = new wijmo.Point(point.x - labelPadding - Math.abs(t1 - t2), point.y);
                this._axisLabels.push({
                    val: val,
                    text: sval,
                    pos: lpt,
                    align: 2,
                    vAlign: vAlign,
                    labelAngle: labelAngle,
                    class: lblClass
                });
            }
            if (tickMarks != wijmo.chart.TickMark.None && hasLbl) {
                engine.drawLine(point.x - t2 * Math.cos(startAngle), point.y - t2 * Math.sin(startAngle),
                    point.x - t1 * Math.cos(startAngle), point.y - t1 * Math.sin(startAngle), tickClass);
            }
        } else {
            var x = this.convert(val);

            if (has_gline) {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                this._renderXGridLine(engine, chart, x, glineClass);
            }
            engine.stroke = tstroke;
            engine.strokeWidth = tth;
            if (showLabel) {
                var lpt = <wijmo.Point>chart._convertPoint(chart._radius + labelPadding, x),
                    angle, valign, align;

                if (chart._angles && chart._angles.length) {
                    angle = chart._angles[index].angle;
                } else {
                    angle = chart.startAngle + (val - this.actualMin) * chart.totalAngle / (this.actualMax - this.actualMin);
                }

                angle = angle % 360;
                angle = angle >= 0 ? angle : angle + 360;
                valign = this._getXLabelVAlign(angle);
                align = this._getXLabelAlign(angle);

                if (chart._isPolar) {
                    sval = this._formatValue(angle);
                }
                if (labelAngle > 0) {
                    if (labelAngle == 90) {
                        wijmo.chart.FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                    } else {
                        wijmo.chart.FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                    }
                } else if (labelAngle < 0) {
                    if (labelAngle == -90) {
                        wijmo.chart.FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                    } else {
                        wijmo.chart.FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                    }
                } else {
                    this._renderLabel(engine, val, sval, lpt, align, valign /*1*/, lblClass);
                }
            }
            if (tickMarks != wijmo.chart.TickMark.None && hasLbl) {
                //draw x major tick
                this._renderXTick(engine, chart, x, tickClass, t1, t2);
            }
        }
        return hasLbl;
    }

    private _renderXGridLine(engine, chart, x, cls) {
        var center = chart._center,
            point = chart._convertPoint(chart._radius, x);

        engine.drawLine(center.x, center.y, point.x, point.y, cls);
    }

    private _renderXTick(engine, chart, x, cls, t1, t2) {
        var center = chart._center,
            innerPoint, outerPoint;

        innerPoint = chart._convertPoint(chart._radius + t1, x);
        outerPoint = chart._convertPoint(chart._radius + t2, x);
        engine.drawLine(innerPoint.x, innerPoint.y, outerPoint.x, outerPoint.y, cls);
    }

    private _renderYGridLine(engine, chart, y, cls) {
        var cAngles = chart._angles,
            center = chart._center,
            startAngle = chart.startAngle * Math.PI / 180,
            totalAngle = chart.totalAngle * Math.PI / 180;

        if (chart._isPolar) {
            startAngle = (chart.startAngle - 90) * Math.PI / 180;
            startAngle = chart.reversed ? startAngle - totalAngle : startAngle;
            engine.drawPieSegment(center.x, center.y, y, startAngle, totalAngle, cls);
        } else {
            this._renderPolygon(engine, y, cls);
        }
    }

    private _getXLabelVAlign(angle) {
        var vAlign = 1,
            chart: any = this._chart,
            startAngle = chart.startAngle,
            reversed = chart.reversed;

        if (reversed) {
            angle = (360 + startAngle + (startAngle % 360 - angle % 360)) % 360;
        }

        if (angle === 0) {
            vAlign = 2;
        } else if (angle === 180) {
            vAlign = 0;
        }
        return vAlign;
    }

    private _getXLabelAlign(angle) {
        var align = 0,
            chart: any = this._chart,
            startAngle = chart.startAngle,
            reversed = chart.reversed;

        if (reversed) {
            angle = (360 + startAngle + (startAngle % 360 - angle % 360)) % 360;
        }
        if (angle > 0 && angle < 180) {
            align = -1;
        } else if (angle > 180 && angle < 360) {
            align = 1;
        }
        return align + 1;
    }

    _createTimeLabels(start: number, len: number, vals: number[], lbls: string[]) {
        if (this._axisType == wijmo.chart.AxisType.Y) {
            super._createTimeLabels(start, len, vals, lbls);
        } else {
            var values = this._values,
                fmt = this.format;

            if (!values || values.length === 0) {
                return;
            }
            values.forEach(v => {
                vals.push(v);
                lbls.push(this._formatValue(v));
            });
        }
    }

    _niceNumber(x: number, exp: number, round: boolean) {
        var chart: any = this._chart,
            range = this.actualMax - this.actualMin,
            totalAngle = chart.totalAngle;

        if (totalAngle > 360) {
            totalAngle = totalAngle % 360;
        }
        if (chart._isPolar) {
            if (totalAngle % 8 == 0) {
                return range / 8;
            } else if (totalAngle % 6 == 0) {
                return range / 6;
            } else if (totalAngle % 4 == 0) {
                return range / 4;
            } else if (totalAngle % 3 == 0) {
                return range / 3;
            } else if (totalAngle % 2 == 0) {
                return range / 2;
            }
            return super._niceNumber(x, exp, round);
        } else {
            return super._niceNumber(x, exp, round);
        }
    }
}
    }
    


    module wijmo.chart.radar {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.radar', wijmo.chart.radar);







    }
    