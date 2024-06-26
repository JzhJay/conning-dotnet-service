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


    module wijmo.chart.animation {
    


export function softFinancial(): typeof wijmo.chart.finance {
    return wijmo._getModule('wijmo.chart.finance');
}


export function softRadar(): typeof wijmo.chart.radar {
    return wijmo._getModule('wijmo.chart.radar');
}
    }
    


    module wijmo.chart.animation {
    



// Soft reference to financial, radar



/**
 * Specifies the rate of change of a parameter over time.
 */
export enum Easing {
    /** Simple linear tweening, no easing and no acceleration. */
    Linear,
    /** Easing equation for a swing easing */
    Swing,
    /** Easing equation for a quadratic easing in, accelerating from zero velocity. */
    EaseInQuad,
    /** Easing equation for a quadratic easing out, decelerating to zero velocity. */
    EaseOutQuad,
    /** Easing equation for a quadratic easing in and out, acceleration until halfway, then deceleration. */
    EaseInOutQuad,
    /** Easing equation for a cubic easing in - accelerating from zero velocity. */
    EaseInCubic,
    /** Easing equation for a cubic easing out - decelerating to zero velocity. */
    EaseOutCubic,
    /** Easing equation for a cubic easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutCubic,
    /** Easing equation for a quartic easing in - accelerating from zero velocity. */
    EaseInQuart,
    /** Easing equation for a quartic easing out - decelerating to zero velocity. */
    EaseOutQuart,
    /** Easing equation for a quartic easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutQuart,
    /** Easing equation for a quintic easing in - accelerating from zero velocity. */
    EaseInQuint,
    /** Easing equation for a quintic easing out - decelerating to zero velocity. */
    EaseOutQuint,
    /** Easing equation for a quintic easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutQuint,
    /** Easing equation for a sinusoidal easing in - accelerating from zero velocity. */
    EaseInSine,
    /** Easing equation for a sinusoidal easing out - decelerating to zero velocity.  */
    EaseOutSine,
    /** Easing equation for a sinusoidal easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutSine,
    /** Easing equation for an exponential easing in - accelerating from zero velocity. */
    EaseInExpo,
    /** Easing equation for an exponential easing out - decelerating to zero velocity. */
    EaseOutExpo,
    /** Easing equation for an exponential easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutExpo,
    /** Easing equation for a circular easing in - accelerating from zero velocity. */
    EaseInCirc,
    /** Easing equation for a circular easing out - decelerating to zero velocity. */
    EaseOutCirc,
    /** Easing equation for a circular easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutCirc,
    /** Easing equation for a back easing in - accelerating from zero velocity. */
    EaseInBack,
    /** Easing equation for a back easing out - decelerating to zero velocity. */
    EaseOutBack,
    /** Easing equation for a back easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutBack,
    /** Easing equation for a bounce easing in - accelerating from zero velocity. */
    EaseInBounce,
    /** Easing equation for a bounce easing out - decelerating to zero velocity. */
    EaseOutBounce,
    /** Easing equation for a bounce easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutBounce,
    /** Easing equation for an elastic easing in - accelerating from zero velocity. */
    EaseInElastic,
    /** Easing equation for an elastic easing out - decelerating to zero velocity. */
    EaseOutElastic,
    /** Easing equation for an elastic easing in and out - acceleration until halfway, then deceleration. */
    EaseInOutElastic
}

/**
 * Specifies the animation mode whether chart should animate one point at a time,
 * series by series, or all at once.
 */
export enum AnimationMode {
    /** All points and series are animated at once. */
    All,
    /**
     * Animation is performed point by point. Multiple series are animated
     * simultaneously at the same time. 
    */
    Point,
    /** 
     * Animation is performed series by series. 
     * Entire series is animated at once, following the same animation as the "All"
     * option, but just one series at a time. 
     */
    Series
}

/**
 * Represents the animation for {@link FlexChart}, {@link FinancialChart} and {@link FlexPie}.
 *
 * The {@link ChartAnimation} provides built-in animation while loading and updating 
 * the chart. 
 * The animation can be configured by the user through several properties that
 * include duration, easing function, animation mode.
 */
export class ChartAnimation {
    private _chart: wijmo.chart.FlexChartBase;
    private _animation: FlexAnimation;
    private _cv: wijmo.collections.ICollectionView;
    private _updateEventArgs: Array<wijmo.collections.NotifyCollectionChangedEventArgs>;
    private _chartType;
    private _play = true;

    /**
     * Initializes a new instance of the {@link ChartAnimation} class.
     * 
     * @param chart A chart to which the {@link ChartAnimation} is attached.
     * @param options A JavaScript object containing initialization data for
     * {@link ChartAnimation}.
     */
    constructor(chart: wijmo.chart.FlexChartBase, options?: any) {
        var self = this,
            ele = chart.hostElement,
            sz = new wijmo.Size(ele.offsetWidth, ele.offsetHeight);

        self._chart = chart;
        self._updateEventArgs = [];
        if (chart instanceof wijmo.chart.FlexPie) {
            self._animation = new FlexPieAnimation(<wijmo.chart.FlexPie>chart, self._updateEventArgs);
        } else {
            if (softRadar() && chart instanceof softRadar().FlexRadar) {
                self._animation = new FlexRadarAnimation(chart, self._updateEventArgs);
            } else {
                self._animation = new FlexChartAnimation(<wijmo.chart.FlexChartCore>chart, self._updateEventArgs);
            }
            self._chartType = (<any>chart).chartType;
        }

        self._initOptions(options);
        chart.beginUpdate();
        window.setTimeout(() => {
            //In angular sample, chart is created and rendered event is fired first.
            //Then invalidate function will be invoked when setting properties, and chart will refresh and rendered again.
            //This solution helps chart correctly playing load animation of first time rendering.
            chart.rendered.addHandler(self._playAnimation, self);
            chart.endUpdate();
        }, 0);
        self._setCV(chart.collectionView);

        //disable animation when user resizes the page.
        window.addEventListener('resize', function (evt) {
            var newSize = new wijmo.Size(ele.offsetWidth, ele.offsetHeight);
            if (!sz.equals(newSize)) {
                self._play = false;
                sz = newSize;
            }
        });
    }

    private _initOptions(options) {
        if (options) {
            if (options.duration) {
                this.duration = options.duration;
            }
            if (options.easing) {
                this.easing = options.easing;
            }
            if (options.animationMode) {
                this.animationMode = options.animationMode;
            }
        }
    }

    private _setCV(cv) {
        this._cv = cv;
        this._animation._clearState();
    }

    /**
     * Occurs after the animation ends.
     */
    readonly ended = new wijmo.Event<ChartAnimation, wijmo.EventArgs>();

    /**
     * Gets or sets whether the plot points animate one at a time, series by series,
     * or all at once.
     * The whole animation is still completed within the duration.
     */
    get animationMode(): AnimationMode {
        return this._animation.animationMode;
    }
    set animationMode(value: AnimationMode) {
        value = wijmo.asEnum(value, AnimationMode);
        if (value != this.animationMode) {
            this._animation.animationMode = value;
        }
    }

    /**
     * Gets or sets the easing function applied to the animation.
     */
    get easing(): Easing {
        return this._animation.easing;
    }
    set easing(value: Easing) {
        value = wijmo.asEnum(value, Easing);
        if (value != this.easing) {
            this._animation.easing = value;
        }
    }

    /**
     * Gets or sets the length of entire animation in milliseconds.
     */
    get duration(): number {
        return this._animation.duration;
    }
    set duration(value: number) {
        value = wijmo.asNumber(value);
        if (value != this.duration) {
            this._animation.duration = value;
        }
    }

    /**
     * Gets or sets a value indicating whether animation is applied to the axis.
     */
    get axisAnimation(): boolean {
        return this._animation.axisAnimation;
    }
    set axisAnimation(value: boolean) {
        value = wijmo.asBoolean(value);
        if (value != this.axisAnimation) {
            this._animation.axisAnimation = value;
        }
    }

    /**
     * Gets the animated chart instance.
     */
    get chart(): wijmo.chart.FlexChartBase {
        return this._chart;
    }

    private _playAnimation() {
        var self = this,
            chart = self._chart,
            chartType = (<any>chart).chartType;

        if (self._cv !== chart.collectionView) {
            //for item source changed.
            self._setCV(chart.collectionView);
        }

        //apply load animation after change chart type.
        if (self._chartType != null && self._chartType !== chartType) {
            self._chartType = chartType;
            self._animation._clearState();
        }

        if (self._play) {
            self._animation.playAnimation(() => self.ended.raise(self, wijmo.EventArgs.empty));
        } else {
            self._play = true;
        }
    }

    /**
     * Performs the animation.
     */
    animate() {
        var chart = this._chart;
        if (chart) {
            var itemsSource = chart.itemsSource;
            chart.beginUpdate();
            chart.itemsSource = null;
            chart.itemsSource = itemsSource;
            chart.endUpdate();
        }
    }
}

class FlexAnimation {
    _chart: wijmo.chart.FlexChartBase;
    _animationMode: AnimationMode;
    _easing: Easing;
    _duration: number;
    _axisAnimation: boolean = true;
    _currentState;
    _previousState;
    _previousXVal;
    _currentXVal;
    _timers: number[];

    constructor(chart: wijmo.chart.FlexChartBase, updateEventArgs) {
        this._chart = chart;
        this._timers = [];
    }

    get animationMode(): AnimationMode {
        return this._animationMode || AnimationMode.All;
    }
    set animationMode(value: AnimationMode) {
        value = wijmo.asEnum(value, AnimationMode, false);
        if (value !== this._animationMode) {
            this._clearState();
            this._animationMode = value;
        }
    }

    get easing(): Easing {
        return this._easing == null ? Easing.Swing : this._easing;
    }
    set easing(value: Easing) {
        if (value !== this._easing) {
            this._easing = wijmo.asEnum(value, Easing, false);
        }
    }

    get duration(): number {
        return this._duration || 400;
    }
    set duration(value: number) {
        if (value !== this._duration) {
            this._duration = wijmo.asNumber(value, false, true);
        }
    }

    get axisAnimation(): boolean {
        return !!this._axisAnimation;
    }
    set axisAnimation(value: boolean) {
        if (value !== this._axisAnimation) {
            this._axisAnimation = wijmo.asBoolean(value, false);
        }
    }

    playAnimation(ended: Function) {
    }

    _clearState() {
        if (this._previousState) {
            this._previousState = null;
        }
        if (this._currentState) {
            this._currentState = null;
        }
    }

    _setInitState(ele, from, to) {
        var state = AnimationHelper.parseAttrs(from, to);
        AnimationHelper.setElementAttr(ele, state, 0);
    }

    _getAnimation(animations, index) {
        if (!animations[index]) {
            animations[index] = [];
        }
        return animations[index];
    }

    _toggleVisibility(ele: SVGElement, visible: boolean) {
        if (visible) {
            AnimationHelper.playAnimation(ele, { opacity: 0 }, { opacity: 1 }, null, Easing.Swing, 100);
        } else {
            ele.setAttribute('opacity', '0');
        }
    }

    _toggleDataLabelVisibility(visible) {
        var ele = this._chart.hostElement,
            dataLabel = ele && <SVGGElement>ele.querySelector('.wj-data-labels');

        if (dataLabel) {
            this._toggleVisibility(dataLabel, visible);
        }
    }

    _playAnimation(animations, ended: Function) {
        var self = this,
            duration = self.duration,
            easing = self.easing,
            animLen = animations.length,
            dd;

        //Hide data labels
        self._toggleDataLabelVisibility(false);
        dd = self._getDurationAndDelay(animations.length, duration);

        if (this._timers && this._timers.length) {
            this._timers.forEach(t => window.clearInterval(t));
            this._timers.length = 0;
        }
        animations.forEach((val, i) => {
            var t;
            if (!val) {
                return;
            }
            t = window.setTimeout(() => {
                var timer;

                val.forEach((v, idx) => {
                    if (!v || !v.ele) {
                        return;
                    }

                    if (i === animLen - 1 && idx === 0) {
                        //Show Data label in done
                        var done = v.done;
                        v.done = function () {
                            self._toggleDataLabelVisibility(true);
                            if (done) {
                                done();
                            }
                            if (ended) {
                                ended();
                            }
                        }
                    }
                    if (wijmo.isArray(v.ele)) {
                        timer = AnimationHelper.playAnimations(v.ele, v.from, v.to, v.done, easing, dd.duration);
                        this._timers = this._timers.concat.apply(timer);
                    } else {
                        timer = AnimationHelper.playAnimation(v.ele, v.from, v.to, v.done, easing, dd.duration);
                        this._timers.push(timer);
                    }
                });
            }, dd.delay * i);
            this._timers.push(t);
        });
    }

    _getDurationAndDelay(aniLen: number, duration: number) {
        var dd = {
            duration: duration,
            delay: 0
        };

        if (aniLen > 1) {
            if (this._previousState) {
                //update
                dd.duration = duration / aniLen;
                dd.delay = duration / aniLen;
            } else {
                //load
                dd.duration = duration * 0.5;
                dd.delay = duration * 0.5 / (aniLen - 1);
            }
        }
        return dd;
    }
}

class FlexPieAnimation extends FlexAnimation {
    _chart: wijmo.chart.FlexPie;
    _isSelectionChanged: boolean;

    constructor(chart: wijmo.chart.FlexPie, updateEventArgs) {
        super(chart, updateEventArgs);

        chart.selectionChanged.addHandler(this._selectionChanged, this);
    }

    _selectionChanged() {
        this._isSelectionChanged = true;
    }

    _clearState() {
        super._clearState();
        this._isSelectionChanged = false;
    }

    _getElementRotate(ele) {
        var rotate = ele.getAttribute('transform'),
            center;
        if (rotate && rotate.indexOf('rotate') > -1) {
            rotate = rotate.replace('rotate(', '').replace(')', '');
            if (rotate.indexOf(',') > -1) {
                rotate = rotate.split(',').map(v => +v);
            } else {
                rotate = rotate.split(' ').map(v => +v);
            }
            if (rotate.length == 1) {
                center = this._chart._areas[0].center;
                rotate.push(center.x, center.y);
            }
        } else {
            center = this._chart._areas[0].center;
            rotate = [0, center.x, center.y];
        }
        return rotate;
    }

    _getDurationAndDelay(aniLen: number, duration: number) {
        var animationMode = this.animationMode,
            dd = {
                duration: duration,
                delay: 0
            };

        if (animationMode === AnimationMode.Point && aniLen > 1) {
            dd.duration = duration / aniLen;
            dd.delay = duration / aniLen;
        }
        return dd;
    }

    playAnimation(ended: Function) {
        super.playAnimation(ended);
        var self = this,
            animations = [];

        self._playPieAnimation(animations);
        if (animations.length) {
            self._playAnimation(animations, ended);
        }
    }

    _playPieAnimation(animations: Array<any>) {
        var self = this,
            chart = self._chart,
            isLoad = true;

        self._previousState = self._currentState;
        self._currentState = {
            areas: chart._areas,
            pels: chart._pels,
            rotate: chart._pels.length && self._getElementRotate(chart._pels[0].parentNode)
        };

        if (self._previousState) {
            isLoad = false;
        }

        //prevent pie from playing animation when selected.
        if (self._isSelectionChanged) {
            if (!chart.isAnimated) {
                self._playSelectPieAnimation(animations);
            }
            self._isSelectionChanged = false;
            return;
        }

        if (isLoad) {
            self._playLoadPieAnimation(animations);
        } else {
            self._playUpdatePieAnimation(animations);
        }

    }

    _playSelectPieAnimation(animations) {
        if (this._previousState == null) {
            return;
        }

        var self = this,
            ele = self._chart._pels[0].parentNode,
            previousRotation = self._previousState.rotate,
            currentRotation = self._getElementRotate(ele),
            animation, from, to,
            pr0 = previousRotation[0],
            cr0 = currentRotation[0];

        if (pr0 === cr0) {
            return;
        }
        //adjust rotate angle
        if (pr0 - cr0 > 180) {
            currentRotation[0] += 360;
        } else if (cr0 - pr0 > 180) {
            previousRotation[0] += 360;
        }

        animation = self._getAnimation(animations, 0);
        from = {
            rotate: previousRotation
        };
        to = {
            rotate: currentRotation
        };
        self._setInitState(ele, from, to);
        animation.push({
            ele: ele,
            from: from,
            to: to
        });
    }

    _playUpdatePieAnimation(animations) {
        var self = this,
            chart = self._chart,
            previousState = self._previousState,
            areas = chart._areas,
            pels = chart._pels,
            previousCount = previousState.areas.length,
            count = areas.length,
            maxCount = Math.max(count, previousCount),
            animation = self._getAnimation(animations, 0),
            idx, state, area, previousPel, startAngle = 0;

        if (count === 0 || previousCount === 0) {
            return;
        }

        //play rotate animation in selection mode.
        self._playSelectPieAnimation(animations);
        for (idx = 0; idx < maxCount; idx++) {
            state = {};
            if (pels[idx] && pels[idx].childNodes && pels[idx].childNodes.length > 0) {
                if (idx < count && idx < previousCount) {
                    area = areas[0];
                    if (idx === 0) {
                        startAngle = area.angle;
                    }
                    //reset d to previous state to prevent from screen flickering.
                    if (previousCount === 1) {
                        //ellipse
                        pels[idx].childNodes[0].setAttribute('d', AnimationHelper.getPathDescOfPie(area.center.x, area.center.y, area.radius, startAngle, Math.PI * 2, area.innerRadius || 0));
                    } else {
                        pels[idx].childNodes[0].setAttribute('d', previousState.pels[idx].childNodes[0].getAttribute('d'));
                    }
                }
                if (idx < count) {
                    area = areas[idx];
                    state.to = { pie: [area.center.x, area.center.y, area.radius, area.angle, area.sweep, area.innerRadius || 0] };
                    state.ele = pels[idx].childNodes[0];
                } else {
                    area = areas[0];
                    previousPel = previousState.pels[idx];
                    state.to = { pie: [area.center.x, area.center.y, area.radius, startAngle + Math.PI * 2, 0, area.innerRadius || 0] };
                    //append previous slice on page.
                    pels[0].parentNode.appendChild(previousPel);
                    state.done = (function (slice) { return function () { slice.parentNode.removeChild(slice); }; })(previousPel);
                    state.ele = previousPel.childNodes[0];
                }

                if (idx < previousCount) {
                    area = previousState.areas[idx];
                    state.from = { pie: [area.center.x, area.center.y, area.radius, area.angle, area.sweep, area.innerRadius || 0] };
                } else {
                    //reset d to from state to prevent from screen flickering.
                    pels[idx].childNodes[0].setAttribute('d', AnimationHelper.getPathDescOfPie(area.center.x, area.center.y, area.radius, Math.PI * 2 + startAngle, 0, area.innerRadius || 0));

                    area = previousState.areas[0];
                    state.from = { pie: [area.center.x, area.center.y, area.radius, Math.PI * 2 + startAngle, 0, area.innerRadius || 0] };
                }

                animation.push(state);
            }
        }
    }

    _playLoadPieAnimation(animations) {
        var self = this,
            chart = self._chart,
            animationMode = self.animationMode,
            areas = chart._areas,
            pels = chart._pels;

        pels.forEach((v, i) => {
            var slice = v.childNodes[0],
                animation, d, from = {}, to = {};

            if (!slice) {
                return;
            }
            if (animationMode === AnimationMode.Point) {
                //can use a clip-path with circle to cover it for better performance, but use current solution to keep consistent.
                self._parsePathByAngle(areas[i], from, to);
                animation = self._getAnimation(animations, i);
            } else {
                //can use scale from 0 -> 1 for better performance, but use current solution to keep consistent.
                self._parsePathByRadius(areas[i], from, to);
                animation = self._getAnimation(animations, 0);
            }
            self._setInitState(slice, from, to);
            animation.push({
                ele: slice,
                from: from,
                to: to
            });
        });
    }

    _parsePathByRadius(segment, from, to) {
        var f, t,
            cx = segment.center.x,
            cy = segment.center.y,
            radius = segment.radius,
            startAngle = segment.angle,
            sweep = segment.sweep,
            innerRadius = segment.innerRadius;

        f = [cx, cy, 0, startAngle, sweep, 0];
        t = [cx, cy, radius, startAngle, sweep, innerRadius || 0];
        from['pie'] = f;
        to['pie'] = t;
    }

    _parsePathByAngle(segment, from, to) {
        var f, t,
            cx = segment.center.x,
            cy = segment.center.y,
            radius = segment.radius,
            startAngle = segment.angle,
            sweep = segment.sweep,
            innerRadius = segment.innerRadius;

        f = [cx, cy, radius, startAngle, 0, innerRadius || 0];
        t = [cx, cy, radius, startAngle, sweep, innerRadius || 0];
        from['pie'] = f;
        from['stroke-width'] = 0;
        to['pie'] = t;
        to['stroke-width'] = 1;
    }
}

class FlexChartAnimation extends FlexAnimation {
    _chart: wijmo.chart.FlexChartCore;
    _addStart: number;
    _removeStart: number;
    _prevAxesStates: any;
    _currAxesStates: any;

    constructor(chart: wijmo.chart.FlexChartCore, updateEventArgs) {
        super(chart, updateEventArgs);
    }

    _clearState() {
        super._clearState();

        var self = this;
        if (self._prevAxesStates) {
            self._prevAxesStates = null;
        }
        if (self._currAxesStates) {
            self._currAxesStates = null;
        }
    }

    playAnimation(ended: Function) {
        super.playAnimation(ended);

        var self = this,
            isLoad = true,
            chart = self._chart,
            isFinancial = softFinancial() && chart instanceof softFinancial().FinancialChart,
            series = chart.series,
            len = series.length,
            i, s: wijmo.chart.SeriesBase, chartType: string, seriesType: wijmo.chart.ChartType, prevLen: number,
            prevState, prevXVal, currXVal, prev,
            animations = [];

        self._previousState = self._currentState;
        self._previousXVal = self._currentXVal;
        //only store element now, we can store calculated states later for better performance.
        self._currentState = [];
        self._addStart = 0;
        self._removeStart = 0;
        self._currentXVal = chart._xlabels.slice();

        if (self._previousState && self._previousState.length) {
            isLoad = false;
            prevState = self._previousState;
            prevLen = prevState.length;

            //check for items added at beginning.
            prevXVal = self._previousXVal;
            currXVal = self._currentXVal;
            if (prevXVal.length > 2 && currXVal.length > 2) {
                i = currXVal.indexOf(prevXVal[0]);
                if (i > 0 && i < currXVal.length - 2) {
                    //check 3 consecutive index numbers
                    if (currXVal[i + 1] === prevXVal[1] && currXVal[i + 2] === prevXVal[2]) {
                        self._addStart = i;
                    }
                } else {
                    i = prevXVal.indexOf(currXVal[0]);
                    if (i > 0 && i < prevXVal.length - 2) {
                        //check 3 consecutive index numbers
                        if (prevXVal[i + 1] === currXVal[1] && prevXVal[i + 2] === currXVal[2]) {
                            self._removeStart = i;
                        }
                    }
                }
            }
        }

        for (i = 0; i < len; i++) {
            s = series[i];
            seriesType = s._getChartType() != null ? s._getChartType() : chart._getChartType();
            chartType = self._getChartType(seriesType);
            self._currentState.push({
                seriesType: seriesType,
                ele: s.hostElement
            });

            if (isFinancial) {
                self._playDefaultAnimation(animations, i);
            } else {
                prev = prevState && prevState[i];

                if (chartType === 'Default') {
                    self._playDefaultAnimation(animations, i);
                    continue;
                }

                if (isLoad || (prev && prev.seriesType !== seriesType) || (prev && prev.ele && (prev.ele.innerHTML == '' || prev.ele.childNodes.length === 0))) {
                    self._playLoadAnimation(animations, i, chartType);
                } else {
                    self._playUpdateAnimation(animations, i, chartType, s, (prev && prev.ele) || null);
                    //check for removed series
                    if (i === len - 1 && i < prevLen - 1) {
                        for (i++; i <= prevLen - 1; i++) {
                            self._playUpdateAnimation(animations, i, chartType, null, prev.ele);
                        }
                    }

                }

            }
        }

        self._adjustAnimations(chartType, animations);

        if (animations.length) {
            self._playAnimation(animations, ended);
        }

        //add axis animation
        if (self.axisAnimation && !isFinancial) {
            self._playAxesAnimation();
        }
    }

    _playAxesAnimation() {
        var self = this,
            axes = self._chart.axes,
            len = axes.length,
            axis: wijmo.chart.Axis, i: number, maxLen: number;

        self._prevAxesStates = self._currAxesStates;
        self._currAxesStates = [];
        for (i = 0; i < len; i++) {
            axis = axes[i];
            if (axis.hostElement) {
                self._currAxesStates.push({
                    ele: axis.hostElement,
                    vals: axis._vals,
                    axis: axis,
                    maxValue: wijmo.isDate(axis.actualMax) ? axis.actualMax.getTime() : axis.actualMax,
                    minValue: wijmo.isDate(axis.actualMin) ? axis.actualMin.getTime() : axis.actualMin
                });
            }
        }

        if (!self._prevAxesStates) {
            return;
        }
        maxLen = Math.max(self._prevAxesStates.length, self._currAxesStates.length);
        for (i = 0; i < maxLen; i++) {
            self._playAxisAnimation(self._prevAxesStates[i], self._currAxesStates[i]);
        }
    }

    _playAxisAnimation(prevAxisStates, currAxisStates) {
        var self = this, state,
            currAnimations = [],
            prevAnimations = [];

        if (currAxisStates && (currAxisStates.maxValue - currAxisStates.minValue)) {
            state = self._parseAxisState(currAxisStates);
            self._convertAxisAnimation(currAnimations, state.major, currAxisStates.axis, prevAxisStates.maxValue, prevAxisStates.minValue);
            self._convertAxisAnimation(currAnimations, state.minor, currAxisStates.axis, prevAxisStates.maxValue, prevAxisStates.minValue);
        }
        if (prevAxisStates && (prevAxisStates.maxValue - prevAxisStates.minValue)) {
            state = self._parseAxisState(prevAxisStates);
            self._convertAxisAnimation(prevAnimations, state.major, prevAxisStates.axis);
            self._convertAxisAnimation(prevAnimations, state.minor, prevAxisStates.axis);
        }
        if (currAnimations && prevAnimations) {
            self._combineAxisAnimations(currAnimations, prevAnimations);
        }
        self._playCurrAxisAnimation(currAnimations);
        self._playPrevAxisAnimation(prevAnimations);
    }

    _combineAxisAnimations(curr, prev) {
        var len = prev.length,
            i, anim;

        for (i = len - 1; i >= 0; i--) {
            anim = prev[i];
            if (!anim.text) {
                continue;
            }
            curr.some(v => {
                if (v.text && v.text === anim.text) {
                    this._combineAxisAnimation(v, anim);
                    prev.splice(i, 1);
                    return true;
                }
            });
        }
    }

    _combineAxisAnimation(curr, prev) {
        ['label', 'majorGrid', 'tick'].forEach(v => {
            if (curr[v] && prev[v]) {
                this._resetExistAxisAttrs(curr[v], prev[v]);
            }
        });
    }

    _resetExistAxisAttrs(curr, prev) {
        var currEle = curr.ele,
            prevEle = prev.ele,
            calcPos: any = {},
            elePos: any = {};

        ['x', 'y', 'x1', 'x2', 'y1', 'y2'].forEach(v => {
            var currAttr = currEle.getAttribute(v),
                prevAttr = prevEle.getAttribute(v);

            if (currAttr !== prevAttr) {
                calcPos[v] = prevAttr;
                elePos[v] = currAttr;
            }
        });
        curr.calcPos = calcPos;
        curr.elePos = elePos;
    }

    _convertAxisAnimation(animations, state, axis: wijmo.chart.Axis, maxValue?, minValue?) {
        var host = axis.hostElement, animation,
            isVert = axis.axisType == wijmo.chart.AxisType.Y;

        state.forEach((v, i) => {
            var tarPos = axis.convert(v.val, maxValue, minValue);

            if (isNaN(tarPos)) {
                return;
            }
            animation = {};
            if (v.majorGrid) {
                animation.majorGrid = this._getAxisAnimationAttrs(v.majorGrid, host, tarPos, isVert);
            }
            if (v.label) {
                animation.label = this._getAxisAnimationAttrs(v.label, host, tarPos, isVert);
                animation.text = v.label.innerHTML || v.label.textContent;
            }
            if (v.tick) {
                animation.tick = this._getAxisAnimationAttrs(v.tick, host, tarPos, isVert);
            }
            animations.push(animation);
        });
    }

    _getAxisAnimationAttrs(ele, parent, tarPos, isVert) {
        var state, attr, elePos;

        state = {
            ele: ele,
            parent: parent,
            elePos: {},
            calcPos: {}
        };
        if (ele.nodeName === 'text') {
            attr = isVert ? 'y' : 'x';
            elePos = Number(ele.getAttribute(attr));

            state.elePos[attr] = elePos;
            state.calcPos[attr] = tarPos;
        } else {
            attr = isVert ? 'y1' : 'x1';
            elePos = Number(ele.getAttribute(attr));

            if (isVert) {
                state.elePos = {
                    y1: elePos,
                    y2: elePos
                };
                state.calcPos = {
                    y1: tarPos,
                    y2: tarPos
                }
            } else {
                state.elePos = {
                    x1: elePos,
                    x2: elePos
                };
                state.calcPos = {
                    x1: tarPos,
                    x2: tarPos
                }
            }
        }
        state.elePos.opacity = 1;
        state.calcPos.opacity = 0;

        return state;
    }

    _playCurrAxisAnimation(animations) {
        var duration = this.duration;

        if (!animations || animations.length === 0) {
            return;
        }
        animations.forEach(val => {
            ['majorGrid', 'label', 'tick'].forEach(p => {
                var v = val[p];
                if (!v) {
                    return;
                }
                var par = v.parent,
                    ele = v.ele,
                    elePos = v.elePos,
                    calcPos = v.calcPos;

                AnimationHelper.playAnimation(ele, calcPos, elePos, null, Easing.Swing, duration);
            });
        });
    }

    _playPrevAxisAnimation(animations) {
        var duration = this.duration;

        if (!animations || animations.length === 0) {
            return;
        }
        animations.forEach(val => {
            ['majorGrid', 'label', 'tick'].forEach(p => {
                var v = val[p];
                if (!v) {
                    return;
                }
                var par = v.parent,
                    ele = v.ele,
                    elePos = v.elePos,
                    calcPos = v.calcPos;

                par.appendChild(ele);
                AnimationHelper.playAnimation(ele, elePos, calcPos, function () {
                    if (ele.parentNode === par) {
                        par.removeChild(ele);
                    }
                }, Easing.Swing, duration);
            });
        });
    }

    _parseAxisState(axisState) {
        if (axisState == null) {
            return null;
        }
        var vals = axisState.vals,
            axis: wijmo.chart.Axis = axisState.axis,
            isVert = axis.axisType == wijmo.chart.AxisType.Y,
            ele = axisState.ele,
            eles = ele.childNodes,
            eleIdx = 0,
            majorStates = [],
            minorStates = [];

        let majors, minors, lbls;
        
        if(vals) {
            majors = vals.major;
            minors = vals.minor;
            lbls = vals.hasLbls;
        }

        majors && majors.forEach((v, i) => {
            var val: any = {},
                el,
                lbl = !!lbls[i];

            majorStates.push(val);
            val.val = v;
            el = eles[eleIdx];

            if (axis.majorGrid && wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_GRIDLINE)) {
                val.majorGrid = el;
                eleIdx++;
                el = eles[eleIdx];
            }
            if (isVert) {
                //vertical draw order grid --> tick --> (label/rotated label)
                if (lbl && el && axis.majorTickMarks !== wijmo.chart.TickMark.None && wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_TICK)) {
                    val.tick = el;
                    eleIdx++;
                    el = eles[eleIdx];
                }
                if (lbl && el && (wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_LABEL) || el.querySelector('.' + wijmo.chart.FlexChart._CSS_LABEL))) {
                    val.label = el;
                    eleIdx++;
                }
            } else {
                //horizontal draw order grid --> (label/rotated label) --> tick
                if (lbl && el && (wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_LABEL) || el.querySelector('.' + wijmo.chart.FlexChart._CSS_LABEL))) {
                    val.label = el;
                    eleIdx++;
                    el = eles[eleIdx];
                }
                if (lbl && el && axis.majorTickMarks !== wijmo.chart.TickMark.None && wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_TICK)) {
                    val.tick = el;
                    eleIdx++;
                }
            }
        });
        minors && minors.forEach((v, i) => {
            var val: any = {},
                el;

            minorStates.push(val);
            val.val = v;
            el = eles[eleIdx];

            if (axis.minorTickMarks !== wijmo.chart.TickMark.None && wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_TICK_MINOR)) {
                val.tick = el;
                eleIdx++;
                el = eles[eleIdx];
            }
            if (axis.minorGrid && wijmo.hasClass(el, wijmo.chart.FlexChart._CSS_GRIDLINE_MINOR)) {
                val.majorGrid = el;
                eleIdx++;
            }
        });
        return {
            major: majorStates,
            minor: minorStates
        };
    }

    _playLoadAnimation(animations: Array<any>, i: number, chartType: string) {
        this['_playLoad' + chartType + 'Animation'](animations, i);
    }

    _playUpdateAnimation(animations: Array<any>, i: number, chartType: string, series: wijmo.chart.SeriesBase, prevState) {
        if (series == null || prevState == null) {
            if (series == null) {
                //removed series
                this['_play' + chartType + 'RemoveAnimation'](animations, prevState);
            } else {
                //added series
                this['_play' + chartType + 'AddAnimation'](animations, series);
            }
        } else {
            this['_play' + chartType + 'MoveAnimation'](animations, series, prevState);
        }
    }

    _adjustAnimations(chartType: string, animations) {
        var len = animations.length,
            idx;

        if (chartType === 'Column' || chartType === 'Bar') {
            for (idx = len - 1; idx >= 0; idx--) {
                if (animations[idx] == null) {
                    animations.splice(idx, 1);
                }
            }
        }
    }

    _getChartType(chartType: wijmo.chart.ChartType) {
        var cType = 'Default',
            isRotated = this._chart._isRotated();

        switch (chartType) {
            case wijmo.chart.ChartType.Scatter:
            case wijmo.chart.ChartType.Bubble:
            case wijmo.chart.ChartType.Candlestick:
            case wijmo.chart.ChartType.HighLowOpenClose:
                cType = 'Scatter';
                break;
            case wijmo.chart.ChartType.Column:
            case wijmo.chart.ChartType.Bar:
                if (isRotated) {
                    cType = 'Bar';
                } else {
                    cType = 'Column';
                }
                break;
            case wijmo.chart.ChartType.Line:
            case wijmo.chart.ChartType.LineSymbols:
            case wijmo.chart.ChartType.Area:
            case wijmo.chart.ChartType.Spline:
            case wijmo.chart.ChartType.SplineSymbols:
            case wijmo.chart.ChartType.SplineArea:
                cType = 'Line';
                break;
            default:
                cType = 'Default';
                break;
        }
        return cType;
    }

    _playLoadLineAnimation(animations: Array<any>, index: number) {
        var self = this,
            series = self._chart.series[index],
            animationMode = self.animationMode,
            ele = series.hostElement,
            froms = [], tos = [],
            eles = [],
            animation;

        if (animationMode === AnimationMode.Point) {
            self._playDefaultAnimation(animations, index);
        } else {
            if (animationMode === AnimationMode.All) {
                animation = self._getAnimation(animations, 0);
            } else {
                animation = self._getAnimation(animations, index);
            }

            [].slice.call(ele.childNodes).forEach(v => {
                self._setLineRiseDiveAnimation(animation, v, true);
            });
        }
    }

    _setLineRiseDiveAnimation(animation, ele, isRise) {
        var self = this,
            chart = self._chart,
            nodeName = ele.nodeName,
            fromPoints = [], toPoints = [],
            bounds = self._chart._plotRect,
            top = bounds['top'] + bounds['height'],
            left = bounds['left'],
            f, t, from = {}, to = {}, len, idx, item, points, done;

        if (nodeName === 'g' && ele.childNodes) {
            [].slice.call(ele.childNodes).forEach(v => {
                this._setLineRiseDiveAnimation(animation, v, isRise);
            });
            return;
        } else if (nodeName === 'polyline' || nodeName === 'polygon') {
            points = ele.points;
            len = points.length || points.numberOfItems;
            for (idx = 0; idx < len; idx++) {
                item = points[idx] || points.getItem(idx);
                if ((<any>chart).rotated) {
                    fromPoints.push({ x: left, y: item.y });
                } else {
                    fromPoints.push({ x: item.x, y: top });
                }
                toPoints.push({ x: item.x, y: item.y });
            }
            from[nodeName] = fromPoints;
            to[nodeName] = toPoints;
        } else if (nodeName === 'ellipse') {
            self._toggleVisibility(ele, false);
            if (isRise) {
                done = function () {
                    self._toggleVisibility(ele, true);
                };
            }
        }

        f = isRise ? from : to;
        t = isRise ? to : from;
        self._setInitState(ele, f, t);
        animation.push({
            ele: ele,
            from: f,
            to: t,
            done: done
        });
    }

    _setLineMoveAnimation(animation, ori, tar, ele, done?) {
        if (ori == null || tar == null) {
            return;
        }
        var self = this,
            nodeName = ori.nodeName,
            fromPoints = [], toPoints = [],
            from = {}, to = {},
            oriLen, oriItem, oriPoints,
            tarLen, tarItem, tarPoints,
            idx, len, isPolyGon, added = 0;

        isPolyGon = nodeName === 'polygon';
        oriPoints = ori.points;
        tarPoints = tar.points;
        oriLen = oriPoints.length || oriPoints.numberOfItems;
        tarLen = tarPoints.length || tarPoints.numberOfItems;
        len = Math.max(oriLen, tarLen);

        for (idx = 0; idx < len; idx++) {
            if (idx < oriLen) {
                oriItem = oriPoints[idx] || oriPoints.getItem(idx);
                fromPoints.push({ x: oriItem.x, y: oriItem.y });
            }
            if (idx < tarLen) {
                tarItem = tarPoints[idx] || tarPoints.getItem(idx);
                toPoints.push({ x: tarItem.x, y: tarItem.y });
            }
        }

        if (self._addStart) {
            self._adjustStartLinePoints(self._addStart, fromPoints, oriPoints);
            oriLen += self._addStart;
        } else if (self._removeStart) {
            self._adjustStartLinePoints(self._removeStart, toPoints, tarPoints);
            tarLen += self._removeStart;
        }
        if (tarLen > oriLen) {
            self._adjustEndLinePoints(tarLen, oriLen, fromPoints, oriPoints, isPolyGon);
        } else if (tarLen < oriLen) {
            self._adjustEndLinePoints(oriLen, tarLen, toPoints, tarPoints, isPolyGon);
        }

        from[nodeName] = fromPoints;
        to[nodeName] = toPoints;

        self._setInitState(ele, from, to);
        animation.push({
            ele: ele,
            from: from,
            to: to,
            done: done
        });

    }

    _adjustStartLinePoints(len, points, oriPoints) {
        var item = oriPoints[0] || oriPoints.getItem(0);

        while (len) {
            points.splice(0, 0, { x: item.x, y: item.y });
            len--;
        }
    }

    _adjustEndLinePoints(oriLen, tarLen, points, oriPoints, isPolygon) {
        var rightBottom, leftBottom, item;

        if (isPolygon && (oriPoints.length >= 3 || oriPoints.numberOfItems >= 3)) {
            leftBottom = points.pop();
            rightBottom = points.pop();
            item = oriPoints[oriPoints.length - 3] || oriPoints.getItem(oriPoints.numberOfItems - 3);
        } else if (oriPoints.length > 0 || oriPoints.numberOfItems > 0) {
            item = oriPoints[oriPoints.length - 1] || oriPoints.getItem(oriPoints.numberOfItems - 1);
        }

        while (oriLen > tarLen && item) {
            points.push({ x: item.x, y: item.y });
            tarLen++;
        }
        if (isPolygon && leftBottom && rightBottom) {
            points.push(rightBottom);
            points.push(leftBottom);
        }
    }

    _playLineRemoveAnimation(animations: Array<any>, prevState) {
        var self = this,
            chart = self._chart,
            parNode = chart.series[0].hostElement.parentNode,
            animation = self._getAnimation(animations, 0),
            done;

        parNode.appendChild(prevState);
        [].slice.call(prevState.childNodes).forEach(v => {
            self._setLineRiseDiveAnimation(animation, v, false);
        });

        //remove node after animation.
        if (animation.length) {
            done = animation[0].done;
            animation[0].done = function () {
                if (prevState && prevState.parentNode === parNode) {
                    parNode.removeChild(prevState);
                }
                if (done) {
                    done();
                }
            };
        }
    }

    _playLineAddAnimation(animations: Array<any>, series) {
        var ele = series.hostElement,
            animation = this._getAnimation(animations, 0),
            eles = [], froms = [], tos = [];

        [].slice.call(ele.childNodes).forEach(v => {
            this._setLineRiseDiveAnimation(animation, v, true);
        });
    }

    _playLineMoveAnimation(animations: Array<any>, series: wijmo.chart.SeriesBase, prevState) {
        var self = this,
            chart = self._chart,
            animation = self._getAnimation(animations, 0),
            symbols = [],
            ele, eles, prevEles, prevEle, nodeName;

        ele = series.hostElement;
        prevEles = [].slice.call(prevState.childNodes);
        eles = [].slice.call(ele.childNodes);

        eles.forEach((v, i) => {
            nodeName = v.nodeName;
            prevEle = prevEles[i];
            if (nodeName === 'g' && v.nodeChilds) {
                [].slice.call(v.nodeChilds).forEach((cv, j) => {
                    if (prevEle) {
                        symbols.push(cv);
                        self._toggleVisibility(cv, false);
                    }
                });
            } else if (nodeName === 'polygon' || nodeName === 'polyline') {
                self._setLineMoveAnimation(animation, prevEle, v, v, i === 0 ? function () {
                    symbols.forEach(s => {
                        self._toggleVisibility(s, true);
                    });
                    symbols = null;
                } : null);
            } else if (prevEle) {
                symbols.push(v);
                self._toggleVisibility(v, false);
            }
        });
    }

    _playLoadColumnAnimation(animations: Array<any>, index: number) {
        this._playLoadBarAnimation(animations, index, true);
    }

    _playLoadBarAnimation(animations: Array<any>, index: number, vertical = false) {
        var self = this,
            series = self._chart.series[index],
            animationMode = self.animationMode,
            ele = series.hostElement,
            eles: Array<SVGElement>;

        //TODO: check origin value. need to update 'x' or 'y' attribute

        eles = [].slice.call(ele.childNodes);
        eles.forEach((v, i) => {
            var animation,
                nodeName = v.nodeName;;

            if (animationMode === AnimationMode.Point) {
                animation = self._getAnimation(animations, i);
            } else if (animationMode === AnimationMode.Series) {
                animation = self._getAnimation(animations, index);
            } else {
                animation = self._getAnimation(animations, 0);
            }

            if (nodeName === 'g') {
                if (v.childNodes) {
                    [].slice.call(v.childNodes).forEach((cv, j) => {
                        self._setLoadBarAnimation(animation, cv, vertical);
                    });
                }
            } else {
                self._setLoadBarAnimation(animation, v, vertical);
            }
        });
    }

    _setBarAnimation(animation, ele, from, to, done?) {
        this._setInitState(ele, from, to);

        animation.push({
            ele: ele,
            from: from,
            to: to,
            done: done
        });
    }

    _setLoadBarAnimation(animation, ele, vertical, reverse = false, done?) {
        var self = this,
            attr = vertical ? 'height' : 'width',
            xy = vertical ? 'y' : 'x',
            attrVal = ele.getAttribute(attr),
            xyVal = ele.getAttribute(xy),
            topLeft = vertical ? 'top' : 'left',
            bounds = self._chart._plotRect,
            f, t, from = {}, to = {};

        from[attr] = 0;
        to[attr] = Number(attrVal);
        if (vertical) {
            from[xy] = bounds[attr] + bounds[topLeft];
            to[xy] = Number(xyVal);
        }

        f = reverse ? to : from;
        t = reverse ? from : to;

        if (ele.nodeName === 'g') {
            if (ele.childNodes) {
                [].slice.call(ele.childNodes).forEach(v => {
                    self._setBarAnimation(animation, v, f, t, done);
                });
            }
        } else {
            self._setBarAnimation(animation, ele, f, t, done);
        }
    }

    _setMoveBarAnimation(animation, ori, tar) {
        var from = {}, to = {};

        if (ori == null || tar == null) {
            return;
        }
        ['width', 'height', 'x', 'y', 'top', 'left'].forEach(attr => {
            var oriAttr = ori.getAttribute(attr),
                tarAttr = tar.getAttribute(attr);

            if (oriAttr !== tarAttr) {
                from[attr] = Number(oriAttr);
                to[attr] = Number(tarAttr);
            }
        });
        this._setInitState(tar, from, to);

        animation.push({
            ele: tar,
            from: from,
            to: to
        });
    }

    _playColumnRemoveAnimation(animations: Array<any>, prevState) {
        this._playBarRemoveAnimation(animations, prevState, true);
    }

    _playColumnAddAnimation(animations: Array<any>, series) {
        this._playBarAddAnimation(animations, series, true);
    }

    _playColumnMoveAnimation(animations: Array<any>, series: wijmo.chart.SeriesBase, prevState) {
        this._playBarMoveAnimation(animations, series, prevState, true);
    }

    _playBarRemoveAnimation(animations: Array<any>, prevState, vertical = false) {
        var self = this,
            chart = self._chart,
            parNode = chart.series[0].hostElement.parentNode,
            animation = self._getAnimation(animations, 0),
            eles;

        parNode.appendChild(prevState);
        eles = [].slice.call(prevState.childNodes);
        eles.forEach(v => {
            self._setLoadBarAnimation(animation, v, vertical, true);
        });
        //remove node after animation.
        if (animation.length) {
            animation[0].done = function () {
                if (prevState && prevState.parentNode === parNode) {
                    parNode.removeChild(prevState);
                }
            };
        }
    }

    _playBarAddAnimation(animations: Array<any>, series, vertical = false) {
        var ele = series.hostElement,
            animation = this._getAnimation(animations, 2),
            eles;

        eles = [].slice.call(ele.childNodes);
        eles.forEach(v => {
            this._setLoadBarAnimation(animation, v, vertical, false);
        });
    }

    _playBarMoveAnimation(animations: Array<any>, series: wijmo.chart.SeriesBase, prevState, vertical = false) {
        var self = this,
            chart = self._chart,
            ele, eles, parNode, prevEles, prevEle, prevLen, len, idx;

        ele = series.hostElement;
        prevEles = [].slice.call(prevState.childNodes);
        if (self._addStart) {
            idx = 0;
            prevEle = prevEles[0];
            while (idx < self._addStart) {
                prevEles.splice(0, 0, prevEle);
                idx++;
            }
        }
        if (self._removeStart) {
            idx = 0;
            prevEle = prevEles[prevEles.length - 1];
            while (idx < self._removeStart) {
                var e = prevEles.shift();
                prevEles.push(e);
                idx++;
            }
        }
        prevLen = prevEles.length;
        eles = [].slice.call(ele.childNodes);
        len = eles.length;
        eles.forEach((v, i) => {
            var animation;

            if (i < prevLen) {

                prevEle = prevEles[i];
                if (i < self._addStart) {
                    //added
                    animation = self._getAnimation(animations, 2);
                    self._setLoadBarAnimation(animation, v, vertical, false);
                } else if (i >= prevLen - self._removeStart) {
                    //added
                    animation = self._getAnimation(animations, 2);
                    self._setLoadBarAnimation(animation, v, vertical, false);
                    //removed
                    animation = self._getAnimation(animations, 0);
                    self._removeBarAnimation(animation, v, prevEle, vertical);
                } else {
                    //move
                    animation = self._getAnimation(animations, 1);
                    self._setMoveBarAnimation(animation, prevEle, v);
                }

                //removed
                if (i === len - 1 && i < prevLen - 1) {
                    animation = self._getAnimation(animations, 0);
                    for (i++; i < prevLen; i++) {
                        prevEle = prevEles[i];
                        self._removeBarAnimation(animation, v, prevEle, vertical);
                    }
                }
            } else {
                //added
                animation = self._getAnimation(animations, 2);
                self._setLoadBarAnimation(animation, v, vertical, false);
            }
        });
    }

    _removeBarAnimation(animation, ele, prevEle, vertical) {
        var parNode = ele.parentNode;

        parNode.appendChild(prevEle);
        this._setLoadBarAnimation(animation, prevEle, vertical, true, (function (ele) {
            return function () {
                if (ele.parentNode && ele.parentNode === parNode) {
                    parNode.removeChild(ele);
                }
            };
        })(prevEle));
    }

    _playLoadScatterAnimation(animations: Array<any>, index: number) {
        var self = this,
            chart = self._chart,
            series = chart.series[index],
            animationMode = self.animationMode,
            ele = series.hostElement,
            xValues = series._xValues || chart._xvals,
            eles: Array<SVGElement>;

        if (xValues.length === 0) {
            xValues = series._pointIndexes;
        }
        eles = [].slice.call(ele.childNodes);
        eles.forEach((v, i) => {
            var animation;
            if (animationMode === AnimationMode.Point) {
                animation = self._getScatterAnimation(animations, xValues[i]);
            } else if (animationMode === AnimationMode.Series) {
                animation = self._getAnimation(animations, index);
            } else {
                animation = self._getAnimation(animations, 0);
            }

            self._setLoadScatterAnimation(animation, v, false);
        });
    }

    _setLoadScatterAnimation(animation, ele, reverse = false, done?) {
        var f, t, from = {}, to = {};

        if (ele.nodeName === 'g' && ele.childNodes) {
            [].slice.call(ele.childNodes).forEach(v => {
                this._setLoadScatterAnimation(animation, v, reverse, done);
            });
            return;
        }

        ['rx', 'ry', 'stroke-width'].forEach(attr => {
            //Can get and store first element's attribute and use this value for better performance,
            //but need to consider if it's possible that each scatter has different attributes.
            var val = ele.getAttribute(attr);
            from[attr] = 0;
            to[attr] = Number(val);
        });
        f = reverse ? to : from;
        t = reverse ? from : to;
        this._setInitState(ele, f, t);

        animation.push({
            ele: ele,
            from: f,
            to: t,
            done: done
        });
    }

    _setUpdateScatterAnimation(animation, srcEle, tarEle, done?) {
        var from = {}, to = {};

        ['cx', 'cy'].forEach(attr => {
            var src = srcEle.getAttribute(attr),
                tar = tarEle.getAttribute(attr);
            if (src !== tar) {
                from[attr] = Number(src);
                to[attr] = Number(tar);
            }
        });
        this._setInitState(tarEle, from, to);

        animation.push({
            ele: tarEle,
            from: from,
            to: to,
            done: done
        });
    }

    _getScatterAnimation(animations, x: number) {
        var idx = this._getScatterAnimationIndex(animations, x);
        if (!animations[idx]) {
            animations[idx] = [];
        }
        return animations[idx];
    }

    _getScatterAnimationIndex(animations, x: number) {
        var chart = this._chart,
            axis = chart.axisX,
            min = axis.min == null ? axis.actualMin : axis.min,
            max = axis.max == null ? axis.actualMax : axis.max,
            idx;

        //split into 20 parts.
        idx = Math.ceil((x - min) / ((max - min) / 20));
        return idx;
    }

    _playScatterRemoveAnimation(animations: Array<any>, prevState) {
        var self = this,
            chart = self._chart,
            parNode = chart.series[0].hostElement.parentNode,
            animation = self._getAnimation(animations, 0),
            eles;

        parNode.appendChild(prevState);
        eles = [].slice.call(prevState.childNodes);
        eles.forEach(v => {
            self._setLoadScatterAnimation(animation, v, true);
        });
        //remove node after animation.
        if (animation.length) {
            animation[0].done = function () {
                if (prevState && prevState.parentNode === parNode) {
                    parNode.removeChild(prevState);
                }
            };
        }
    }

    _playScatterAddAnimation(animations: Array<any>, series) {
        var ele = series.hostElement,
            animation = this._getAnimation(animations, 0),
            eles;

        eles = [].slice.call(ele.childNodes);
        eles.forEach(v => {
            this._setLoadScatterAnimation(animation, v, false);
        });
    }

    _playScatterMoveAnimation(animations: Array<any>, series: wijmo.chart.SeriesBase, prevState) {
        var self = this,
            chart = self._chart,
            animation = self._getAnimation(animations, 0),
            ele, eles, parNode, prevEles, prevEle, prevLen, len, idx;

        ele = series.hostElement;
        prevEles = [].slice.call(prevState.childNodes);
        if (self._addStart) {
            idx = 0;
            prevEle = prevEles[0];
            while (idx < self._addStart) {
                prevEles.splice(0, 0, prevEle);
                idx++;
            }
        }
        if (self._removeStart) {
            idx = 0;
            prevEle = prevEles[prevEles.length - 1];
            while (idx < self._removeStart) {
                var e = prevEles.shift();
                prevEles.push(e);
                idx++;
            }
        }
        prevLen = prevEles.length;
        eles = [].slice.call(ele.childNodes);
        len = eles.length;
        eles.forEach((v, i) => {
            if (i < prevLen) {
                if (i < self._addStart) {
                    //added
                    self._setLoadScatterAnimation(animation, v, false);
                } else if (i >= prevLen - self._removeStart) {
                    //added
                    self._setLoadScatterAnimation(animation, v, false);
                    //removed
                    prevEle = prevEles[i];
                    self._removeScatterAnimation(animation, v, prevEle);
                } else {
                    //move
                    prevEle = prevEles[i];
                    self._setUpdateScatterAnimation(animation, prevEle, v);
                }

                //removed
                if (i === len - 1 && i < prevLen - 1) {
                    for (i++; i < prevLen; i++) {
                        prevEle = prevEles[i];
                        self._removeScatterAnimation(animation, v, prevEle);
                    }
                }
            } else {
                //added
                self._setLoadScatterAnimation(animation, v, false);
            }
        });
    }

    _removeScatterAnimation(animation, ele, prevEle) {
        var parNode = ele.parentNode;

        parNode.appendChild(prevEle);
        this._setLoadScatterAnimation(animation, prevEle, true, (function (ele) {
            return function () {
                if (ele.parentNode && ele.parentNode === parNode) {
                    parNode.removeChild(ele);
                }
            };
        })(prevEle));
    }

    //default animation, set clip-rect
    _playDefaultAnimation(animations: Array<any>, index: number) {
        var chart = this._chart,
            series = chart.series[index],
            ele = series.hostElement,
            bounds = chart._plotRect,
            engine = chart._currentRenderEngine,
            oriClipPath = ele.getAttribute('clip-path'),
            clipPathID = 'clipPath' + (1000000 * Math.random()).toFixed(),
            clipPath, animation;

        let rev = chart.axisX.reversed;
        engine.addClipRect(new wijmo.Rect( rev? bounds.right : bounds.left, bounds.top, 0, bounds.height), clipPathID);
        ele.setAttribute('clip-path', 'url(#' + clipPathID + ')');

        clipPath = chart.hostElement.querySelector('#' + clipPathID);

        animation = this._getAnimation(animations, 0);
        let from = { width : 0 };
        let to = { width: bounds.width };

        if(rev) {
            from['x'] = bounds.right;
            to['x'] = bounds.left;
        }
        
        animation.push({
            ele: clipPath.querySelector('rect'),
            from: from,
            to: to,
            done: function () {
                if (!ele) {
                    return;
                }
                if (oriClipPath) {
                    ele.setAttribute('clip-path', oriClipPath);
                } else {
                    ele.removeAttribute('clip-path');
                }
                if (clipPath && clipPath.parentNode) {
                    clipPath.parentNode.removeChild(clipPath);
                }
            }
        });
    }
}

class FlexRadarAnimation extends FlexChartAnimation {

    constructor(chart: wijmo.chart.radar.FlexRadar, updateEventArgs) {
        super(chart, updateEventArgs);
    }

    _getDurationAndDelay(aniLen: number, duration: number) {
        var dd = super._getDurationAndDelay(aniLen, duration);
        if (this.animationMode === AnimationMode.Point) {
            dd.duration = duration / aniLen;
            dd.delay = duration / aniLen;
        }
        return dd;
    }

    _playAxesAnimation() { }

    _getChartType(chartType: wijmo.chart.ChartType) {
        var cType = super._getChartType(chartType);

        if (cType === 'Bar') {
            cType = 'Column';
        }
        return cType;
    }

    _playLoadLineAnimation(animations: Array<any>, index: number) {
        var self = this,
            chart = self._chart,
            series = self._chart.series[index],
            xValues = series._xValues || chart._xvals,
            animationMode = self.animationMode,
            ele = series.hostElement,
            animation, offset, eles: SVGElement[];

        if (animationMode === AnimationMode.Point) {
            if (xValues.length === 0) {
                xValues = series._pointIndexes;
            }
            eles = <SVGElement[]>[].slice.call(ele.childNodes);
            offset = eles.length - ele.querySelectorAll('ellipse').length;
            eles.forEach((v, i) => {
                self._setRadarLinePointAnimation(animations, v, i, xValues, offset);
            });
        } else {
            if (animationMode === AnimationMode.All) {
                animation = self._getAnimation(animations, 0);
            } else {
                animation = self._getAnimation(animations, index);
            }

            [].slice.call(ele.childNodes).forEach(v => {
                self._setLineRiseDiveAnimation(animation, v, true);
            });
        }
    }

    _setRadarLinePointAnimation(animations, ele, index, xValues, offset) {
        var self = this,
            chart = <any>self._chart,
            nodeName = ele.nodeName,
            fromPoints = [], toPoints = [], fPoints = [], tPoints = [],
            center = chart._center, indices = [],
            setInit = false,
            from = {}, to = {}, len, idx, item, points, done, animation, aniIdx, itemIndex = 0;

        if (nodeName === 'polyline' || nodeName === 'polygon') {
            points = ele.points;
            len = points.length || points.numberOfItems;
            for (idx = 0; idx < len; idx++) {
                aniIdx = self._getScatterAnimationIndex(animations, xValues[idx]);
                if (!indices[aniIdx]) {
                    indices[aniIdx] = [];
                }
                indices[aniIdx].push(idx);
                item = points[idx] || points.getItem(idx);
                fromPoints.push({ x: center.x, y: center.y });
                toPoints.push({ x: item.x, y: item.y });
            }
            for (idx = 0, len = indices.length; idx < len; idx++) {
                if (indices[idx]) {
                    animation = self._getAnimation(animations, itemIndex);
                    fPoints = tPoints.length ? tPoints.slice() : fromPoints.slice();
                    tPoints = fPoints.slice();
                    indices[idx].forEach(v => {
                        var pt = toPoints[v];
                        tPoints[v] = { x: pt.x, y: pt.y };
                    });
                    from = {};
                    to = {};
                    from[nodeName] = fPoints;
                    to[nodeName] = tPoints;
                    if (!setInit) {
                        self._setInitState(ele, from, to);
                        setInit = true;
                    }
                    animation.push({
                        ele: ele,
                        from: from,
                        to: to,
                        done: done
                    });
                    itemIndex++;
                }
            }
        } else if (nodeName === 'ellipse') {
            idx = index - (offset || 0);
            if (idx < 0) {
                return;
            }
            if (chart._isPolar) {
                animation = self._getScatterAnimation(animations, xValues[idx]);
            } else {
                animation = self._getScatterAnimation(animations, idx);
            }
            self._toggleVisibility(ele, false);
            done = function () {
                self._toggleVisibility(ele, true);
            };
            animation.push({
                ele: ele,
                from: from,
                to: to,
                done: done
            });
        }
    }

    _setLineRiseDiveAnimation(animation, ele, isRise) {
        var self = this,
            chart = <any>self._chart,
            nodeName = ele.nodeName,
            fromPoints = [], toPoints = [],
            center = chart._center,
            f, t, from = {}, to = {}, len, idx, item, points, done;
        if (nodeName === 'polyline' || nodeName === 'polygon') {
            points = ele.points;
            len = points.length || points.numberOfItems;
            for (idx = 0; idx < len; idx++) {
                item = points[idx] || points.getItem(idx);
                fromPoints.push({ x: center.x, y: center.y });
                toPoints.push({ x: item.x, y: item.y });
            }
            from[nodeName] = fromPoints;
            to[nodeName] = toPoints;
        } else if (nodeName === 'ellipse') {
            self._toggleVisibility(ele, false);
            if (isRise) {
                done = function () {
                    self._toggleVisibility(ele, true);
                };
            }
        }

        f = isRise ? from : to;
        t = isRise ? to : from;
        self._setInitState(ele, f, t);
        animation.push({
            ele: ele,
            from: f,
            to: t,
            done: done
        });
    }

    _parsePathByRadius(segment, from, to) {
        var f, t,
            cx = segment.center.x,
            cy = segment.center.y,
            radius = segment.radius,
            startAngle = segment.angle,
            sweep = segment.sweep,
            innerRadius = segment.innerRadius;

        f = [cx, cy, 0, startAngle, sweep, 0];
        t = [cx, cy, radius, startAngle, sweep, innerRadius || 0];
        from['pie'] = f;
        to['pie'] = t;
    }

    _playUpdateAnimation(animations: Array<any>, i: number, chartType: string, series: wijmo.chart.SeriesBase, prevState) {
        if (chartType === 'Bar' || chartType === 'Column') {
            if (series == null) {
                return;
            }
            this._playLoadBarAnimation(animations, i, false);
        } else {
            super._playUpdateAnimation(animations, i, chartType, series, prevState);
        }
    }

    _playLoadBarAnimation(animations: Array<any>, index: number, vertical = false) {
        var self = this,
            chart = <any>self._chart,
            series = chart.series[index],
            areas = chart._areas[index],
            animationMode = self.animationMode,
            ele = series.hostElement,
            eles: Array<SVGElement>;

        eles = [].slice.call(ele.childNodes);
        eles.forEach((v, i) => {
            var animation, from = {}, to = {}, area;

            if (animationMode === AnimationMode.Point) {
                animation = self._getAnimation(animations, i);
            } else if (animationMode === AnimationMode.Series) {
                animation = self._getAnimation(animations, index);
            } else {
                animation = self._getAnimation(animations, 0);
            }

            area = areas[i];
            self._parsePathByRadius(area, from, to);
            self._setInitState(v, from, to);
            animation.push({
                ele: v,
                from: from,
                to: to
            });
        });
    }
}

class AnimationHelper {
    static playAnimations(els: Array<SVGElement>, from, to, done?: Function, easing = Easing.Swing, duration?: number, step?: number) {
        var len = els.length,
            count = 0,
            timers = [];

        els.forEach((v, i) => {
            var timer = AnimationHelper.playAnimation(v, from[i], to[i], function () {
                if (count === len - 1 && done) {
                    done();
                }
                count++;
            }, easing, duration, step);
            timers.push(timer);
        });
        return timers;
    }
    static playAnimation(el: SVGElement, from, to, done?: Function, easing = Easing.Swing, duration?: number, step?: number) {
        var state = AnimationHelper.parseAttrs(from, to);

        return AnimationHelper.animate(function (p) {
            AnimationHelper.setElementAttr(el, state, p);
        }, done, easing, duration, step);
    }

    static setElementAttr(ele, state, p) {
        var st: ChartAnimateState, attr: string;

        for (attr in state) {
            st = state[attr];
            AnimationHelper.calcValue(st, p);
            ele.setAttribute(attr, st.getValue(st.value, p));
        }
    }

    static getPathDescOfPie(cx, cy, radius, startAngle, sweepAngle, innerRadius = 0): string {
        var isFull = false;
        if (sweepAngle >= Math.PI * 2) {
            isFull = true;
            sweepAngle = Math.PI * 2 - 0.001;
        }

        var p1 = new wijmo.Point(cx, cy);
        p1.x += radius * Math.cos(startAngle);
        p1.y += radius * Math.sin(startAngle);

        var a2 = startAngle + sweepAngle;
        var p2 = new wijmo.Point(cx, cy);
        p2.x += radius * Math.cos(a2);
        p2.y += radius * Math.sin(a2);

        if (innerRadius) {
            var p3 = new wijmo.Point(cx, cy);
            p3.x += innerRadius * Math.cos(a2);
            p3.y += innerRadius * Math.sin(a2);

            var p4 = new wijmo.Point(cx, cy);
            p4.x += innerRadius * Math.cos(startAngle);
            p4.y += innerRadius * Math.sin(startAngle);
        }

        var opt1 = ' 0 0,1 ',
            opt2 = ' 0 0,0 ';
        if (Math.abs(sweepAngle) > Math.PI) {
            opt1 = ' 0 1,1 ';
            opt2 = ' 0 1,0 ';
        }

        var d = 'M ' + p1.x.toFixed(3) + ',' + p1.y.toFixed(3);

        d += ' A ' + radius.toFixed(3) + ',' + radius.toFixed(3) + opt1;
        d += p2.x.toFixed(3) + ',' + p2.y.toFixed(3);
        if (innerRadius) {
            if (isFull) {
                d += ' M ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
            } else {
                d += ' L ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
            }
            d += ' A ' + innerRadius.toFixed(3) + ',' + innerRadius.toFixed(3) + opt2;
            d += p4.x.toFixed(3) + ',' + p4.y.toFixed(3);
        } else {
            d += ' L ' + cx.toFixed(3) + ',' + cy.toFixed(3);
        }

        if (!isFull) {
            d += ' z';
        }
        return d;
    }

    static parseAttrs(from, to) {
        var state = {}, value;
        for (var key in from) {
            if (to[key] == null) {
                continue;
            }
            switch (key) {
                case 'polyline':
                    state['points'] = AnimationHelper.parseAttr(from[key], to[key], function (v, p) {
                        if (p === 1) {
                            var len, idx, prev, cur;
                            //remove same start points
                            while (v.length > 1) {
                                prev = v[0];
                                cur = v[1];
                                if (prev.x === cur.x && prev.y === cur.y) {
                                    v.splice(1, 1);
                                } else {
                                    prev = null;
                                    cur = null;
                                    break;
                                }
                            }
                            len = v.length;
                            //remove same end points, keep last one
                            for (idx = len - 1; idx > 0; idx--) {
                                prev = cur;
                                cur = v[idx];
                                if (prev) {
                                    if (prev.x === cur.x && prev.y === cur.y) {
                                        v.pop();
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                        return v.map(a => a.x + ',' + a.y).join(' ');
                    });
                    break;
                case 'polygon':
                    state['points'] = AnimationHelper.parseAttr(from[key], to[key], function (v, p) {
                        if (p === 1) {
                            var len, idx, prev, cur, v0, v1;

                            v0 = v.pop();
                            v1 = v.pop();

                            //remove same start points
                            while (v.length > 1) {
                                prev = v[0];
                                cur = v[1];
                                if (prev.x === cur.x && prev.y === cur.y) {
                                    v.splice(1, 1);
                                } else {
                                    prev = null;
                                    cur = null;
                                    break;
                                }
                            }
                            len = v.length;
                            //remove same end points
                            for (idx = len - 1; idx >= 0; idx--) {
                                prev = cur;
                                cur = v[idx];
                                if (prev) {
                                    if (prev.x === cur.x && prev.y === cur.y) {
                                        v.splice(idx, 1);
                                    } else {
                                        break;
                                    }
                                }
                            }
                            v.push(v1);
                            v.push(v0);
                        }
                        return v.map(a => a.x + ',' + a.y).join(' ');
                    });
                    break;
                case 'd':
                    state[key] = AnimationHelper.parseAttr(from[key], to[key], function (v) {
                        return v.map(a => {
                            if (typeof a === 'string') {
                                return a;
                            }
                            return a['0'] + ',' + a['1'];
                        }).join(' ');
                    });
                    break;
                case 'pie':
                    state['d'] = AnimationHelper.parseAttr(from[key], to[key], function (v) {
                        return AnimationHelper.getPathDescOfPie.apply(AnimationHelper, v);
                    });
                    break;
                case 'rotate':
                    state['transform'] = AnimationHelper.parseAttr(from[key], to[key], function (v) {
                        return 'rotate(' + v.join(' ') + ')';
                    });
                    break;
                case 'x':
                case 'width':
                case 'height':
                case 'rx':
                case 'ry':
                case 'stroke-width':
                    state[key] = AnimationHelper.parseAttr(from[key], to[key], function (v) {
                        return Math.abs(v);
                    });
                    break;
                default:
                    state[key] = AnimationHelper.parseAttr(from[key], to[key]);
                    break;
            }
        }
        return state;
    }

    static animate(apply: Function, done?: Function, easing = Easing.Swing, duration = 400, step = 16): any {
        wijmo.asFunction(apply);
        wijmo.asNumber(duration, false, true);
        wijmo.asNumber(step, false, true);
        var t = 0;

        //step = 25;
        var timer = setInterval(function () {
            var b = Date.now();
            var pct = t / duration;
            pct = EasingHelper[Easing[easing]](pct);
            apply(pct);
            t += step;
            if (t >= duration) {
                clearInterval(timer);
                //add pct > 1 for easing.(swing, bounce, elastic, back, etc.)
                if (pct < 1 || pct > 1) {
                    apply(1); // ensure apply(1) is called to finish
                }
                if (done) {
                    done();
                }
            }
        }, step);
        return timer;
    }

    static calcValue(state: ChartAnimateState, percent: number) {
        var from = state.from,
            diff = state.diff,
            value = state.value;

        if (wijmo.isNumber(from)) {
            state.value = diff === 0 ? from : from + diff * percent;
        } else if (wijmo.isArray(from)) {
            AnimationHelper.parseArrayAttr(value, from, diff, function (f, t) {
                return typeof f === 'number' ? f + t * percent : f;
            });
        }
    }

    static parseAttr(from, to, getValue?: Function): ChartAnimateState {
        var f, t, diff, val;

        if (wijmo.isArray(from) && wijmo.isArray(to)) {
            f = from;
            t = to;
            diff = [];
            val = f.slice();
            AnimationHelper.parseArrayAttr(diff, f, t, function (from, to) {
                if (from === to) {
                    return 0;
                }
                return to - from;
            });
        } else {
            f = Number(from);
            t = Number(to);
            val = f;
            diff = t - f;
        }

        return <ChartAnimateState>{
            from: <any>f,
            to: <any>t,
            value: val,
            diff: diff,
            getValue: getValue || function (v, p) {
                return v;
            }
        };
    }

    static parseArrayAttr(val, from, to, fn) {

        from.forEach((v, i) => {
            var objs, obj = {}, arr = [],
                t = to[i];
            if (wijmo.isNumber(v) || typeof v === 'string') {
                val[i] = fn(v, t);
            } else if (wijmo.isArray(v)) {
                v.forEach((a, b) => {
                    arr[b] = fn(v[b], t[b]);
                });
                val[i] = arr;
            } else {
                objs = Object.getOwnPropertyNames(v);
                objs.forEach(key => {
                    obj[key] = fn(v[key], t[key]);
                });
                val[i] = obj;
            }
        });
    }
}

interface ChartAnimateState {
    from: any;
    to: any;
    value: any;
    diff: any;
    getValue(v, p): string;
}

//http://easings.net/
//https://github.com/wout/svg.easing.js
class EasingHelper {
    static Linear(t) {
        return t;
    }

    static Swing(t) {
        var s = 1.70158;

        return ((t /= 0.5) < 1) ? 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s)) :
            0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2)
    }

    static EaseInQuad(t) {
        return t * t;
    }

    static EaseOutQuad(t) {
        return t * (2 - t);
    }

    static EaseInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static EaseInCubic(t) {
        return t * t * t;
    }

    static EaseOutCubic(t) {
        return (--t) * t * t + 1;
    }

    static EaseInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    static EaseInQuart(t) {
        return t * t * t * t;
    }

    static EaseOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    static EaseInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }

    static EaseInQuint(t) {
        return t * t * t * t * t;
    }

    static EaseOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    }

    static EaseInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }

    static EaseInSine(t) {
        return -Math.cos(t * (Math.PI / 2)) + 1;
    }

    static EaseOutSine(t) {
        return Math.sin(t * (Math.PI / 2));
    }

    static EaseInOutSine(t) {
        return (-0.5 * (Math.cos(Math.PI * t) - 1));
    }

    static EaseInExpo(t) {
        return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
    }

    static EaseOutExpo(t) {
        return (t == 1) ? 1 : -Math.pow(2, -10 * t) + 1;
    }

    static EaseInOutExpo(t) {
        if (t == !!t) {
            return t;
        }
        if ((t /= 0.5) < 1) {
            return 0.5 * Math.pow(2, 10 * (t - 1));
        }
        return 0.5 * (-Math.pow(2, -10 * --t) + 2);
    }

    static EaseInCirc(t) {
        return -(Math.sqrt(1 - (t * t)) - 1);
    }

    static EaseOutCirc(t) {
        return Math.sqrt(1 - Math.pow((t - 1), 2));
    }

    static EaseInOutCirc(t) {
        if ((t /= 0.5) < 1) {
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }

    static EaseInBack(t) {
        var s = 1.70158;
        return t * t * ((s + 1) * t - s)
    }

    static EaseOutBack(t) {
        var s = 1.70158;

        t = t - 1;
        return t * t * ((s + 1) * t + s) + 1
    }

    static EaseInOutBack(t) {
        var s = 1.70158;

        if ((t /= 0.5) < 1) {
            return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    }

    static EaseInBounce(t) {
        return 1 - EasingHelper.EaseOutBounce(1 - t);
    }

    static EaseOutBounce(t) {
        var s = 7.5625;

        if (t < (1 / 2.75)) {
            return s * t * t;
        }
        else if (t < (2 / 2.75)) {
            return s * (t -= (1.5 / 2.75)) * t + 0.75;
        }
        else if (t < (2.5 / 2.75)) {
            return s * (t -= (2.25 / 2.75)) * t + 0.9375;
        }
        else {
            return s * (t -= (2.625 / 2.75)) * t + 0.984375;
        }
    }

    static EaseInOutBounce(t) {
        if (t < 0.5) {
            return EasingHelper.EaseInBounce(t * 2) * 0.5;
        }
        return EasingHelper.EaseOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }

    static EaseInElastic(t) {
        if (t == !!t) {
            return t;
        }
        return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3));
    }

    static EaseOutElastic(t) {
        if (t == !!t) {
            return t;
        }
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
    }

    static EaseInOutElastic(t) {
        if (t == !!t) {
            return t;
        }

        t = t * 2;
        if (t < 1) {
            return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.1125) * (2 * Math.PI) / 0.45));
        }
        return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - 0.1125) * (2 * Math.PI) / 0.45) * 0.5 + 1;
    }
}
    }
    


    module wijmo.chart.animation {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.animation', wijmo.chart.animation);



    }
    