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


    module wijmo.gauge {
    

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
export class Range {
    static _ctr = 0;
    private _min = 0;
    private _max = 100;
    private _thickness = 1;
    private _color: string;
    private _name: string;

    /**
     * Initializes a new instance of the {@link Range} class.
     *
     * @param options Initialization options for the {@link Range} or a string
     * containing the {@link Range} name.
     */
    constructor(options?: any) {
        if (wijmo.isString(options)) {
            this._name = options;
        } else {
            wijmo.copy(this, options);
        }
    }

    /**
     * Gets or sets the minimum value for this range.
     */
    get min(): number {
        return this._min;
    }
    set min(value: number) {
        this._setProp('_min', wijmo.asNumber(value, true));
    }
    /**
     * Gets or sets the maximum value for this range.
     */
    get max(): number {
        return this._max;
    }
    set max(value: number) {
        this._setProp('_max', wijmo.asNumber(value, true));
    }
    /**
     * Gets or sets the color used to display this range.
     */
    get color(): string {
        return this._color;
    }
    set color(value: string) {
        this._setProp('_color', wijmo.asString(value));
    }
    /**
     * Gets or sets the thickness of this range as a percentage of 
     * the parent gauge's thickness.
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        this._setProp('_thickness', wijmo.clamp(wijmo.asNumber(value), 0, 1));
    }
    /**
     * Gets or sets the name of this {@link Range}.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._setProp('_name', wijmo.asString(value));
    }

    /**
     * Occurs when the value of a property in this {@link Range} changes.
     */
    readonly propertyChanged = new wijmo.Event<Range, wijmo.PropertyChangedEventArgs>();
    /**
     * Raises the {@link propertyChanged} event.
     *
     * @param e {@link PropertyChangedEventArgs} that contains the property
     * name, old, and new values.
     */
    onPropertyChanged(e: wijmo.PropertyChangedEventArgs) {
        this.propertyChanged.raise(this, e);
    }

    // ** implementation

    // sets property value and notifies about the change
    _setProp(name: string, value: any) {
        let oldValue = this[name];
        if (value != oldValue) {
            this[name] = value;
            let e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
            this.onPropertyChanged(e);
        }
    }
}
    }
    


    module wijmo.gauge {
    




'use strict';

/**
 * Specifies which values to display as text.
 */
export enum ShowText {
    /** Do not show any text in the gauge. */
    None = 0,
    /** Show the gauge's {@link Gauge.value} as text. */
    Value = 1,
    /** Show the gauge's {@link Gauge.min} and {@link Gauge.max} values as text. */
    MinMax = 2,
    /** Show the gauge's {@link Gauge.value}, {@link Gauge.min}, and {@link Gauge.max} as text. */
    All = 3
}

/**
 * Represents a method that gets customized text to display
 * in a {@link Gauge} control. */
export interface IGetGaugeText {
    /**
     * @param gauge Gauge that contains the text.
     * @param part Name of the gauge part (e.g. 'min', 'max', 'value').
     * @param value Value being formatted.
     * @param text Default text to show.
     * @returns Text to be shown for the given part.
     */
    (gauge: Gauge, part: string, value: number, text: string): string;
}

/**
 * Base class for the Wijmo Gauge controls (abstract).
 */
export class Gauge extends wijmo.Control {
    static _SVGNS = 'http://www.w3.org/2000/svg';
    static _ctr = 0;

    // property storage
    private _ranges = new wijmo.collections.ObservableArray<Range>();
    private _rngElements = [];
    private _format = 'n0';
    private _getText: IGetGaugeText;
    private _showRanges = true;
    private _stackRanges = false;
    private _shadow = true;
    private _animated = true;
    private _animInterval: number;
    private _readOnly = true;
    private _handleWheel = true;
    private _step = 1;
    private _showText = ShowText.None;
    private _showTicks = false;
    private _showTickText = false;
    private _tickSpacing: number;
    private _thumbSize: number;
    private _filterID: string;
    private _rangesDirty: boolean;
    private _origin: number;
    private _dragging: boolean;

    // protected
    protected _thickness = 0.8;
    protected _initialized = false;
    protected _animColor: string;

    // main ranges:
    // face is the background and defines the Gauge's range (min/max);
    // pointer is the indicator and defines the Gauge's current value.
    protected _face: Range;
    protected _pointer: Range;

    // template parts
    protected _dSvg: HTMLDivElement;
    protected _svg: SVGSVGElement;
    protected _gFace: SVGGElement;
    protected _gRanges: SVGGElement;
    protected _gPointer: SVGGElement;
    protected _gCover: SVGGElement;
    protected _pFace: SVGPathElement;
    protected _pPointer: SVGPathElement;
    protected _pTicks: SVGPathElement;
    protected _gTicks: SVGGElement;
    protected _gNeedle: SVGGElement;
    protected _filter: SVGFilterElement;
    protected _cValue: SVGCircleElement;
    protected _tValue: SVGTextElement;
    protected _tMin: SVGTextElement;
    protected _tMax: SVGTextElement;

    /**
     * Gets or sets the template used to instantiate {@link Gauge} controls.
     */
    static controlTemplate =
        '<div wj-part="dsvg" dir="ltr">' + // dir="ltr" set to address TFS 233532
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

    /**
     * Initializes a new instance of the {@link Gauge} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true);
        Gauge._ctr++;
        let host = this.hostElement;

        // accessibility: 
        // https://www.w3.org/TR/wai-aria-1.1/#slider
        // http://oaa-accessibility.org/examples/role/95/
        wijmo.setAttribute(host, 'role', 'slider', true);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-gauge', tpl, {
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
        wijmo.setCss(this._dSvg, {
            width: '100%',
            height: '100%'
        });

        // apply filter id to template
        this._filterID = 'wj-gauge-filter-' + Gauge._ctr.toString(36);
        this._filter.setAttribute('id', this._filterID);

        // initialize main ranges
        this.face = new Range();
        this.pointer = new Range();

        // invalidate control and re-create range elements when ranges change
        this._ranges.collectionChanged.addHandler(() => {

            // check types
            this._ranges.forEach(rng => {
                wijmo.assert(rng instanceof Range, 'ranges array must contain Range objects.');
            });

            // remember ranges are dirty and invalidate
            this._rangesDirty = true;
            this.invalidate();
        });

        // keyboard handling
        this.addEventListener(host, 'keydown', this._keydown.bind(this));

        // mouse handling
        this.addEventListener(host, 'click', (e: MouseEvent) => {
            if (e.button == 0) { // left button only
                this.focus();
                this._applyMouseValue(e);
            }
        });
        this.addEventListener(host, 'mousedown', (e: MouseEvent) => {
            if (e.button == 0) { // left button only
                this.focus();
                this._dragging = true;
                setTimeout(() => { // give IE some time (TFS 391629)
                    this._applyMouseValue(e);
                });
            }
        });
        this.addEventListener(host, 'mousemove', (e: MouseEvent) => {
            if (this._dragging && this.containsFocus()) {
                this._applyMouseValue(e, true);
            }
        });
        this.addEventListener(host, 'mouseup', (e: MouseEvent) => {
            this._dragging = false;
        });
        this.addEventListener(host, 'mouseleave', (e: MouseEvent) => {
            if (e.target == host) {
                this._dragging = false;
            }
        });

        // touch handling
        if ('ontouchstart' in window) {
            this.addEventListener(host, 'touchstart', (e: PointerEvent) => {
                this.focus();
                if (!e.defaultPrevented && this._applyMouseValue(e, false)) { // TFS 321526
                    e.preventDefault();
                }
            });
            this.addEventListener(host, 'touchmove', (e: PointerEvent) => {
                if (!e.defaultPrevented && this._applyMouseValue(e, true)) {
                    e.preventDefault();
                }
            });
        }

        // use wheel to increase/decrease the value
        this.addEventListener(host, 'wheel', (e: WheelEvent) => {
            if (this._handleWheel && !this.isReadOnly) {
                if (!e.defaultPrevented && this.containsFocus() && this.value != null && this.hitTest(e)) {
                    let step = wijmo.clamp(-e.deltaY, -1, +1);
                    this.value = wijmo.clamp(this.value + (this.step || 1) * step, this.min, this.max);
                    e.preventDefault();
                }
            }
        });

        // initialize control options
        this.isReadOnly = true; // update wj-state-readonly class
        this.initialize(options);

        // ensure face and text are updated
        this.invalidate();
    }

    /**
     * Gets or sets the value displayed on the gauge.
     */
    get value(): number {
        return this._pointer.max;
    }
    set value(value: number) {
        if (value != this.value) {
            this._pointer.max = wijmo.asNumber(value, true);
            this._updateAria();
        }
    }
    /**
     * Gets or sets the minimum value that can be displayed on the gauge.
     * 
     * For details about using the {@link min} and {@link max} properties, please see the 
     * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
     */
    get min(): number {
        return this._face.min;
    }
    set min(value: number) {
        if (value != this.min) {
            this._face.min = wijmo.asNumber(value);
            this._updateAria();
        }
    }
    /**
     * Gets or sets the maximum value that can be displayed on the gauge.
     * 
     * For details about using the {@link min} and {@link max} properties, please see the 
     * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
     */
    get max(): number {
        return this._face.max;
    }
    set max(value: number) {
        if (value != this.max) {
            this._face.max = wijmo.asNumber(value);
            this._updateAria();
        }
    }
    /**
     * Gets or sets the starting point used for painting the range.
     *
     * By default, this property is set to null, which causes the value range
     * to start at the gauge's minimum value, or zero if the minimum is less
     * than zero.
     */
    get origin(): number {
        return this._origin;
    }
    set origin(value: number) {
        if (value != this._origin) {
            this._origin = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the user can edit the gauge
     * value using the mouse and keyboard.
     * 
     * The default value for this property is **true**.
     */
    get isReadOnly(): boolean {
        return this._readOnly;
    }
    set isReadOnly(value: boolean) {
        this._readOnly = wijmo.asBoolean(value);
        wijmo.setAttribute(this._svg, 'cursor', this._readOnly ? null : 'pointer');
        wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
    }
    /**
     * Gets or sets a value that determines whether the user can edit the 
     * gauge value using the mouse wheel.
     * 
     * The default value for this property is **true**.
     */
    get handleWheel(): boolean {
        return this._handleWheel;
    }
    set handleWheel(value: boolean) {
        this._handleWheel = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the amount to add to or subtract from the {@link value} property
     * when the user presses the arrow keys or moves the mouse wheel.
     */
    get step(): number {
        return this._step;
    }
    set step(value: number) {
        if (value != this._step) {
            this._step = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the format string used to display gauge values as text.
     */
    get format(): string {
        return this._format;
    }
    set format(value: string) {
        if (value != this._format) {
            this._format = wijmo.asString(value);
            this.invalidate();
        }
    }
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
    get getText(): IGetGaugeText {
        return this._getText;
    }
    set getText(value: IGetGaugeText) {
        if (value != this._getText) {
            this._getText = wijmo.asFunction(value) as IGetGaugeText;
            this.invalidate();
        }
    }
    /**
     * Gets or sets the thickness of the gauge, on a scale between zero and one.
     *
     * Setting the thickness to one causes the gauge to fill as much of the
     * control area as possible. Smaller values create thinner gauges.
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        if (value != this._thickness) {
            this._thickness = wijmo.clamp(wijmo.asNumber(value, false), 0, 1);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the {@link Range} used to represent the gauge's overall geometry
     * and appearance.
     */
    get face(): Range {
        return this._face;
    }
    set face(value: Range) {
        if (value != this._face) {
            if (this._face) {
                this._face.propertyChanged.removeHandler(this._rangeChanged);
            }
            this._face = wijmo.asType(value, Range);
            if (this._face) {
                this._face.propertyChanged.addHandler(this._rangeChanged, this);
            }
            this.invalidate();
        }
    }
    /**
     * Gets or sets the {@link Range} used to represent the gauge's current value.
     */
    get pointer(): Range {
        return this._pointer;
    }
    set pointer(value: Range) {
        if (value != this._pointer) {
            let gaugeValue = null;
            if (this._pointer) {
                gaugeValue = this.value;
                this._pointer.propertyChanged.removeHandler(this._rangeChanged);
            }
            this._pointer = wijmo.asType(value, Range);
            if (this._pointer) {
                if (gaugeValue) {
                    this.value = gaugeValue;
                }
                this._pointer.propertyChanged.addHandler(this._rangeChanged, this);
            }
            this.invalidate();
        }
    }
    /**
     * Gets or sets the {@link ShowText} values to display as text in the gauge.
     * 
     * The default value for this property is **ShowText.All** for {@link RadialGauge}
     * controls, and to **ShowText.None** for {@link LinearGauge} controls.
     */
    get showText(): ShowText {
        return this._showText;
    }
    set showText(value: ShowText) {
        value = wijmo.asEnum(value, ShowText);
        if (value != this._showText) {
            this._showText = value;
            this.invalidate();
        }
    }
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
    get showTicks(): boolean {
        return this._showTicks;
    }
    set showTicks(value: boolean) {
        if (value != this._showTicks) {
            this._showTicks = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
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
    get showTickText(): boolean {
        return this._showTickText;
    }
    set showTickText(value: boolean) {
        if (value != this._showTickText) {
            this._showTickText = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
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
    get tickSpacing(): number {
        return this._tickSpacing;
    }
    set tickSpacing(value: number) {
        if (value != this._tickSpacing) {
            this._tickSpacing = wijmo.asNumber(value, true);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the size of the element that shows the gauge's current value,
     * in pixels.
     */
    get thumbSize(): number {
        return this._thumbSize;
    }
    set thumbSize(value: number) {
        if (value != this._thumbSize) {
            this._thumbSize = wijmo.asNumber(value, true, true);
            this.invalidate();
        }
    }
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
    get showRanges(): boolean {
        return this._showRanges;
    }
    set showRanges(value: boolean) {
        if (value != this._showRanges) {
            this._showRanges = wijmo.asBoolean(value);
            this._animColor = null;
            this._rangesDirty = true;
            this.invalidate();
        }
    }
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
    get stackRanges(): boolean {
        return this._stackRanges;
    }
    set stackRanges(value: boolean) {
        if (value != this._stackRanges) {
            this._stackRanges = wijmo.asBoolean(value);
            this._animColor = null;
            this._rangesDirty = true;
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the gauge displays
     * a shadow effect.
     * 
     * The default value for this property is **true**.
     */
    get hasShadow(): boolean {
        return this._shadow;
    }
    set hasShadow(value: boolean) {
        if (value != this._shadow) {
            this._shadow = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the {@link Gauge} 
     * should use animation to show value changes.
     *
     * The default value for this property is **true**.
     */
    get isAnimated(): boolean {
        return this._animated;
    }
    set isAnimated(value: boolean) {
        this._animated = wijmo.asBoolean(value);
    }
    /**
     * Gets the collection of ranges in this gauge.
     */
    get ranges(): wijmo.collections.ObservableArray {
        return this._ranges;
    }
    /**
     * Occurs when the value of the {@link value} property changes.
     */
    readonly valueChanged = new wijmo.Event<Gauge, wijmo.EventArgs>();
    /**
     * Raises the {@link valueChanged} event.
     */
    onValueChanged(e?: wijmo.EventArgs) {
        this.valueChanged.raise(this, e);
    }

    /**
     * Refreshes the control.
     *
     * @param fullUpdate Indicates whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);

        // update ranges if they are dirty
        if (this._rangesDirty) {
            this._rangesDirty = false;
            let gr = this._gRanges;

            // remove old elements and disconnect event handlers
            this._rngElements.forEach(e => {
                e.rng.propertyChanged.removeHandler(this._rangeChanged);
            });
            while (gr.lastChild) {
                gr.removeChild(gr.lastChild);
            }
            this._rngElements = [];

            // add elements for each range and listen to changes
            if (this._showRanges) {
                this._ranges.forEach(rng => {
                    rng.propertyChanged.addHandler(this._rangeChanged, this);
                    this._rngElements.push({
                        rng: rng,
                        el: this._createElement('path', gr)
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
        let filterUrl = this._getFilterUrl();
        wijmo.setAttribute(this._pFace, 'filter', filterUrl);
        wijmo.setAttribute(this._pPointer, 'filter', filterUrl);
        this._updateRange(this._face);
        this._updateRange(this._pointer);
        this._updateTicks();

        // update ranges
        this._ranges.forEach(rng => {
            this._updateRange(rng);
        })

        // ready
        this._initialized = true;
    }
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
    hitTest(pt: any, y?: number): number {

        // get point in page coordinates
        if (wijmo.isNumber(pt) && wijmo.isNumber(y)) { // accept hitTest(x, y)
            pt = new wijmo.Point(pt, y);
        } else if (!(pt instanceof wijmo.Point)) {
            pt = wijmo.mouseToPage(pt);
        }
        pt = wijmo.asType(pt, wijmo.Point);

        // convert point to gauge client coordinates
        let rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
        pt.x -= rc.left + pageXOffset;
        pt.y -= rc.top + pageYOffset;

        // get gauge value from point
        return this._getValueFromPoint(pt);
    }

    // ** implementation

    // safe version of getBBox (TFS 129851, 144174)
    // (workaround for FF bug, see https://bugzilla.mozilla.org/show_bug.cgi?id=612118)
    //
    // In TS 2.2 the type of the 'e' parameter was changed from SVGLocatable to 
    // SVGGraphicsElement. We use 'any' for the 'e' parameter and for the
    // return type so the library can be compiled with TS 2.1 and later.
    static _getBBox(e: any): any {
        try {
            return e.getBBox();
        } catch (x) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    // gets the unique filter ID used by this gauge
    // NOTE: shadows (filters) are not supported in iOS (iPad, iPod, iPhone: TFS 419493)
    // alternative CSS fix: http://ethanclevenger.com/Filter-Bug-Turns-SVGs-Invisible-on-iOS-Browsers/
    protected _getFilterUrl() {
        return this.hasShadow && !wijmo.isiOS() 
            ? 'url(#' + this._filterID + ')'
            : null;
    }

    // gets the path element that represents a Range
    protected _getRangeElement(rng: Range): SVGPathElement {
        if (rng == this._face) {
            return this._pFace;
        } else if (rng == this._pointer) {
            return this._pPointer;
        }
        for (let i = 0; i < this._rngElements.length; i++) {
            let rngEl = this._rngElements[i];
            if (rngEl.rng == rng) {
                return rngEl.el;
            }
        }
        return null;
    }

    // handle changes to range objects
    protected _rangeChanged(rng: Range, e: wijmo.PropertyChangedEventArgs) {

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
                let s1 = this._getPointerColor(e.oldValue),
                    s2 = this._getPointerColor(e.newValue),
                    c1 = s1 ? new wijmo.Color(s1) : null,
                    c2 = s2 ? new wijmo.Color(s2) : null,
                    pctChange = wijmo.clamp(Math.abs(e.newValue - e.oldValue) / (this.max - this.min), 0, 1);
                this._animInterval = wijmo.animate((pct) => {
                    this._animColor = (c1 && c2)
                        ? wijmo.Color.interpolate(c1, c2, pct).toString()
                        : null;
                    this._updateRange(rng, e.oldValue + pct * (e.newValue - e.oldValue));
                    if (pct >= 1) {
                        this._animColor = null;
                        this._animInterval = null;
                        this._updateRange(rng);
                        this._updateText();
                    }
                }, pctChange * wijmo.Control._ANIM_DEF_DURATION); // duration proportional to change
                return;
            }
        }

        // update range without animation
        this._updateRange(rng);
    }

    // creates an SVG element with the given tag and appends it to a given element
    protected _createElement(tag: string, parent: SVGElement, cls?: string) {
        let e = document.createElementNS(Gauge._SVGNS, tag);
        if (cls) {
            e.setAttribute('class', cls);
        }
        parent.appendChild(e);
        return e;
    }

    // centers an SVG text element at a given point
    protected _centerText(e: SVGTextElement, value: number, center: wijmo.Point) {
        if (e.getAttribute('display') != 'none') {

            // get the text for the element
            let text = wijmo.Globalize.format(value, this.format);
            if (wijmo.isFunction(this.getText)) {
                let part = '';
                if (e == this._tValue) part = 'value';
                else if (e == this._tMin) part = 'min';
                else if (e == this._tMax) part = 'max';
                if (part) {
                    text = this.getText(this, part, value, text);
                }
            }

            // set the text and center the element
            e.textContent = text;
            let box = wijmo.Rect.fromBoundingRect(Gauge._getBBox(e)),
                x = (center.x - box.width / 2),
                y = (center.y + box.height / 4);
            e.setAttribute('x', this._fix(x));
            e.setAttribute('y', this._fix(y));
        }
    }

    // method used in JSON-style initialization
    protected _copy(key: string, value: any): boolean {
        if (key == 'ranges') {
            wijmo.asArray(value).forEach(rngInfo => {
                let rng = new Range(rngInfo);
                this.ranges.push(rng);
            });
            return true;
        } else if (key == 'pointer') {
            wijmo.copy(this.pointer, value);
            return true;
        }
        return false;
    }

    // scales a value to a percentage based on the gauge's min and max properties
    protected _getPercent = function (value) {
        let pct = (this.max > this.min) ? (value - this.min) / (this.max - this.min) : 0;
        return Math.max(0, Math.min(1, pct));
    };

    // shows or hides an element
    protected _showElement(e: SVGElement, show: boolean) {
        wijmo.setAttribute(e, 'display', show ? null : 'none');
    }

    // updates the element for a given range
    protected _updateRange(rng: Range, value = rng.max) {

        // update pointer's min value
        if (rng == this._pointer) {
            rng.min = this.origin != null
                ? this.origin
                : (this.min < 0 && this.max > 0) ? 0 : this.min;
        }

        // update the range's element
        let e = this._getRangeElement(rng);
        if (e) {
            this._updateRangeElement(e, rng, value);
            let color = rng.color;
            if (rng == this._pointer) {
                color = this._animColor ? this._animColor : this._getPointerColor(rng.max);
            }
            wijmo.setAttribute(e, 'style', color ? 'fill:' + color : null);
        }
    }

    // gets the color for the pointer range based on the gauge ranges
    protected _getPointerColor(value: number): string {
        var rng: Range;
        if (!this._showRanges) {
            let rng: Range;
            for (let i = 0; i < this._ranges.length; i++) { // TFS 269674
                let r = this._ranges[i];
                if (value >= r.min && value <= r.max) {
                    rng = r;
                    break;
                }
            }
            if (rng) {
                return rng.color;
            }
        }
        return this._pointer.color;
    }

    // keyboard handling
    protected _keydown(e: KeyboardEvent) {
        if (!this._readOnly && this._step) {
            let key = this._getKey(e.keyCode),
                handled = true;
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
    }

    // override to translate keys to account for gauge direction
    protected _getKey(key: number): number {
        return key;
    }

    // apply value based on mouse/pointer position
    protected _applyMouseValue(e: any, instant?: boolean): boolean {
        if (!this.isReadOnly && this.containsFocus()) {
            let value = this.hitTest(e);
            if (value != null) {
                let anim = this._animated,
                    step = this._step;

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
    }

    // ** virtual methods (must be overridden in derived classes)

    // updates the range element
    protected _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {
        wijmo.assert(false, 'Gauge is an abstract class.');
    }

    // updates the text elements
    protected _updateText() {
        wijmo.assert(false, 'Gauge is an abstract class.');
    }

    // updates the tickmarks
    protected _updateTicks() {
        wijmo.assert(false, 'Gauge is an abstract class.');
    }

    // gets the value at a given point (in gauge client coordinates)
    protected _getValueFromPoint(pt: wijmo.Point) {
        return null;
    }

    // formats numbers or points with up to 4 decimals
    protected _fix(n: any): string {
        return wijmo.isNumber(n)
            ? parseFloat(n.toFixed(4)).toString()
            : this._fix(n.x) + ' ' + this._fix(n.y);
    }

    // update ARIA attributes for this control
    protected _updateAria() {
        let host = this.hostElement;
        if (host) {
            wijmo.setAttribute(host, 'aria-valuemin', this.min);
            wijmo.setAttribute(host, 'aria-valuemax', this.max);
            wijmo.setAttribute(host, 'aria-valuenow', this.value);
        }
    }
}
    }
    


    module wijmo.gauge {
    



'use strict';

/**
 * Specifies a pre-defined shape for the gauge's needle element.
 */
export enum NeedleShape {
    /** No pre-defined shape. */
    None,
    /** The needle element has a triangular shape. */
    Triangle,
    /** The needle element has a diamond shape. */
    Diamond,
    /** The needle element has an hexagonal shape. */
    Hexagon,
    /** The needle element has a rectangular shape. */
    Rectangle,
    /** The needle element has an arrow shape. */
    Arrow,
    /** The needle element has a wide arrow shape. */
    WideArrow,
    /** The needle element has a pointer shape. */
    Pointer,
    /** The needle element has a wide pointer shape. */
    WidePointer,
    /** The needle element has a triangular shape with an offset. */
    Outer
}

/**
 * Specifies the length of the needle element with respect to the pointer range.
 */
export enum NeedleLength {
    /** The needle element extends to the outer radius of the pointer range. */
    Outer,
    /** The needle element extends to the mid ponit between the inner and outer radii of the pointer range. */
    Middle,
    /** The needle element extends to the inner radius of the pointer range. */
    Inner
}

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
export class RadialGauge extends Gauge {

    // property storage
    private _startAngle = 0;
    private _sweepAngle = 180;
    private _autoScale = true;
    private _ndlElement: SVGElement;
    private _ndlShape = NeedleShape.None;
    private _ndlLength = NeedleLength.Middle;

    // svg rect used to position ranges and text
    private _rcSvg: wijmo.Rect;

    // SVG matrix and point used to perform hit-testing 
    private _ctmInv: SVGMatrix;
    private _ptSvg: SVGPoint;

    /**
     * Initializes a new instance of the {@link RadialGauge} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);

        // customize
        wijmo.addClass(this.hostElement, 'wj-radialgauge');
        this._thickness = .4;
        this.showText = ShowText.All;

        // initialize control options
        this.initialize(options);
    }

    /**
     * Gets or sets the starting angle for the gauge.
     *
     * Angles are measured in degrees, clockwise, starting from the
     * 9 o'clock position.
     * 
     * The default value for this property is **0**.
     */
    get startAngle(): number {
        return this._startAngle;
    }
    set startAngle(value: number) {
        if (value != this._startAngle) {
            this._startAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
            this.invalidate();
        }
    }
    /**
     * Gets or sets the sweep angle for the gauge.
     *
     * Angles are measured in degrees, clockwise,
     * starting from the 9 o'clock position.
     *
     * The default value for this property is **180** degrees.
     */
    get sweepAngle(): number {
        return this._sweepAngle;
    }
    set sweepAngle(value: number) {
        if (value != this._sweepAngle) {
            this._sweepAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that indicates whether the gauge automatically
     * scales to fill the host element.
     * 
     * The default value for this property is **true**.
     */
    get autoScale(): boolean {
        return this._autoScale;
    }
    set autoScale(value: boolean) {
        if (value != this._autoScale) {
            this._autoScale = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets the bounds of the gauge's face element.
     *
     * This property is useful for positioning custom SVG elements 
     * on the gauge.
     * 
     * {@fiddle mbno06j3}
     */
    get faceBounds(): wijmo.Rect {
        return this._rcSvg ? this._rcSvg.clone() : null;
    }
    get clientSize(): wijmo.Size {
        wijmo._deprecated('clientSize', 'faceBounds');
        let rc = this._rcSvg;
        return rc ? new wijmo.Size(rc.width, rc.height) : null;
    }
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
    get needleElement(): SVGElement {
        return this._ndlElement;
    }
    set needleElement(value: SVGElement) {
        if (value != this._ndlElement) {

            // no pre-defined shape
            this._ndlShape = 0;

            // save new element
            this._ndlElement = wijmo.asType(value, SVGElement, true);

            // add it to the gauge
            let gNeedle = this._gNeedle;
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
    }
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
    get needleShape(): NeedleShape {
        return this._ndlShape;
    }
    set needleShape(value: NeedleShape) {
        if (value != this._ndlShape) {
            value = wijmo.asEnum(value, NeedleShape);
            let needle = null;
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
    }
    /**
     * Gets or sets a value that determines the length of the gauge's
     * {@link needleElement} with respect to the pointer range.
     * 
     * The default value for this property is **NeedleLength.Middle**.
     */
    get needleLength(): NeedleLength {
        return this._ndlLength;
    }
    set needleLength(value: NeedleLength) {
        if (value != this._ndlLength) {
            this._ndlLength = wijmo.asEnum(value, NeedleLength);
            this.invalidate();
        }
    }
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
    static createNeedleElement(points: any[], capRadius?: number, innerCapRadius?: number) {

        // build needle path
        let pathDef = '';
        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            if (i == points.length - 1 && pt.y == 0) {
                break;
            }
            pathDef += (i > 0 ? ' L ' : 'M ') + (pt.x) + ' ' + (pt.y);
        }
        for (let i = points.length - 1; i >= 0; i--) {
            let pt = points[i];
            pathDef += ' L ' + (pt.x) + ' ' + (-pt.y);
        }
        pathDef += ' Z';

        // wrap it in an SVG group element
        let ns = 'http://www.w3.org/2000/svg';
        let g = document.createElementNS(ns, 'g');
        let p = document.createElementNS(ns, 'path');
        wijmo.setAttribute(p, 'd', pathDef);
        g.appendChild(p);

        // add cap elements
        if (capRadius) {
            let cap = document.createElementNS(ns, 'circle');
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
    }

    // virtual methods

    /**
     * Refreshes the control.
     *
     * @param fullUpdate Indicates whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {

        // clear viewbox
        wijmo.setAttribute(this._svg, 'viewBox', null);

        // cache svg rect since (in Chrome) it changes after setting the viewbox
        this._rcSvg = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());

        // update gauge
        super.refresh(fullUpdate);

        // clear transform matrix
        this._ctmInv = null;
        this._ptSvg = null;

        // set viewbox to auto-scale
        if (this._autoScale) {

            // clear viewbox first
            wijmo.setAttribute(this._svg, 'viewBox', null);

            // measure
            let rc = wijmo.Rect.fromBoundingRect(Gauge._getBBox(this._pFace));
            if ((this.showText & ShowText.Value) != 0) {
                rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(Gauge._getBBox(this._tValue)));
            }
            if ((this.showText & ShowText.MinMax) != 0) {
                rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(Gauge._getBBox(this._tMin)));
                rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(Gauge._getBBox(this._tMax)));
            }

            // apply viewbox
            let viewBox = [this._fix(rc.left), this._fix(rc.top), this._fix(rc.width), this._fix(rc.height)].join(' ');
            wijmo.setAttribute(this._svg, 'viewBox', viewBox);

            // save transform matrix for hit-testing (_getValueFromPoint)
            let ctm = this._pFace.getCTM();
            this._ctmInv = ctm ? ctm.inverse() : null; // TFS 144174
            this._ptSvg = this._svg.createSVGPoint();
        }
    }

    // updates the element for a given range
    _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {
        if (this._rcSvg) {
            let rc = this._rcSvg,
                center = new wijmo.Point(rc.width / 2, rc.height / 2),
                radius = Math.min(rc.width, rc.height) / 2,
                fThick = radius * this.thickness,
                rThick = fThick * rng.thickness,
                outer = radius - (fThick - rThick) / 2,
                inner = outer - rThick,
                start = this._getStartAngle(),
                sweep = this._getSweepAngle(),
                face = rng == this._face,
                ps = face ? 0 : this._getPercent(rng.min),
                pe = face ? 1 : this._getPercent(value),
                rngStart = start + sweep * ps,
                rngSweep = sweep * (pe - ps);

            // stack ranges
            if (this.stackRanges && rng != this.face && rng != this.pointer) {
                let index = this.ranges.indexOf(rng);
                if (index > -1) {
                    let len = this.ranges.length,
                        wid = (outer - inner) / len;
                    inner += (len - 1 - index) * wid;
                    outer = inner + wid;
                }
            }

            // update path
            this._updateSegment(e, center, outer, inner, rngStart, rngSweep);

            // update pointer thumb and/or needle
            if (rng == this._pointer) {
                let fix = this._fix;

                // thumb
                if (this.thumbSize > 0) {
                    let color = this._animColor ? this._animColor : this._getPointerColor(rng.max),
                        pt = this._getPoint(center, start + sweep * this._getPercent(value), (outer + inner) / 2),
                        ce = this._cValue;
                    wijmo.setAttribute(ce, 'cx', fix(pt.x));
                    wijmo.setAttribute(ce, 'cy', fix(pt.y));
                    wijmo.setAttribute(ce, 'style', color ? 'fill:' + color : null);
                    wijmo.setAttribute(ce, 'r', fix(this.thumbSize / 2));
                }

                // needle
                if (this.needleElement) {

                    // calculate needle length
                    let radius = outer;
                    if (this._ndlLength == NeedleLength.Inner) {
                        radius = inner;
                    } else if (this._ndlLength == NeedleLength.Middle) {
                        radius = (inner + outer) / 2;
                    }

                    // apply transforms
                    let t = 'translate({cx}, {cy}) scale({scale}) rotate({angle})'
                        .replace('{cx}', fix(center.x)) // translate so 0,0 is at the center
                        .replace('{cy}', fix(center.y))
                        .replace('{scale}', fix(radius / 100)) // scale so 100 is the radius
                        .replace('{angle}', fix(rngStart + rngSweep)); // rotate so it points to the current value
                    this._gNeedle.setAttribute('transform', t); // apply the transform
                }
            }
        }
    }

    // gets the start angle accounting for RTL (TFS 441076)
    _getStartAngle(): number {
        let start = this.startAngle + 180;
        if (this.rightToLeft) {
            start = 180 - start;
        }
        return start;
    }

    // gets the sweep angle accounting for RTL (TFS 441076)
    _getSweepAngle(): number {
        let sweep = this.sweepAngle;
        if (this.rightToLeft) {
            sweep = -sweep;
        }
        return sweep;
    }

    // update the content and position of the text elements
    _updateText() {
        if (this._rcSvg) {
            let rc = this._rcSvg,
                center = new wijmo.Point(rc.width / 2, rc.height / 2),
                outer = Math.min(rc.width, rc.height) / 2,
                inner = Math.max(0, outer * (1 - this.thickness)),
                start = this._getStartAngle(),
                sweep = this._getSweepAngle();

            // show thumb if it has a size
            this._showElement(this._cValue, this.thumbSize > 0);

            // hide min/max if sweep angle > 300 degrees
            let show = (this.showText & ShowText.MinMax) != 0 && Math.abs(sweep) <= 300;
            this._showElement(this._tMin, show);
            this._showElement(this._tMax, show);

            // update text/position
            this._centerText(this._tValue, this.value, center);
            let offset = 10 * (this._getSweepAngle() < 0 ? -1 : +1);
            this._centerText(this._tMin, this.min, this._getPoint(center, start - offset, (outer + inner) / 2));
            this._centerText(this._tMax, this.max, this._getPoint(center, start + sweep + offset, (outer + inner) / 2));
        }
    }

    // update the tickmarks
    _updateTicks() {
        let step = (this.tickSpacing && this.tickSpacing > 0) ? this.tickSpacing : this.step,
            path = '',
            gTicks = this._gTicks;

        // clear tickmark text
        while (gTicks.firstChild) {
            wijmo.removeChild(gTicks.firstChild);
        }

        // draw tickmarks and text
        if (this.showTicks && step > 0) {
            let rc = this._rcSvg,
                ctr = new wijmo.Point(rc.width / 2, rc.height / 2),
                radius = Math.min(rc.width, rc.height) / 2,
                fThick = radius * this.thickness,
                rThick = fThick * this._face.thickness,
                outer = radius - (fThick - rThick) / 2,
                inner = outer - rThick,
                rTick = outer * 1.15,
                start = this._getStartAngle(),
                sweep = this._getSweepAngle();
            for (let val = this.min; val <= this.max; val += step) {
                let angle = start + sweep * this._getPercent(val),
                    p1 = this._fix(this._getPoint(ctr, angle, inner)),
                    p2 = this._fix(this._getPoint(ctr, angle, outer));

                // tick mark
                if (val > this.min && val < this.max) {
                    path += 'M ' + p1 + ' L ' + p2 + ' ';
                }

                // tick text
                if (this.showTickText) {
                    let tt = this._createElement('text', gTicks) as SVGTextElement,
                        p = this._getPoint(ctr, angle, rTick);
                    this._centerText(tt, val, p);
                }
            }
        }
        this._pTicks.setAttribute('d', path);
    }

    // draws a radial segment at the specified position
    _updateSegment(path: SVGPathElement, ctr: wijmo.Point, rOut: number, rIn: number, start: number, sweep: number) {
        sweep = Math.min(Math.max(sweep, -359.99), 359.99);
        let p1 = this._getPoint(ctr, start, rIn),
            p2 = this._getPoint(ctr, start, rOut),
            p3 = this._getPoint(ctr, start + sweep, rOut),
            p4 = this._getPoint(ctr, start + sweep, rIn);
        let data = {
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
        let content = wijmo.format('M {p1} ' +
            'L {p2} A {or} {or} 0 {large} {cw} {p3} ' +
            'L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z',
            data);
        path.setAttribute('d', content);
    }

    // converts polar to Cartesian coordinates
    _getPoint(ctr: wijmo.Point, angle: number, radius: number): wijmo.Point {
        angle = angle * Math.PI / 180;
        return new wijmo.Point(
            ctr.x + radius * Math.cos(angle),
            ctr.y + radius * Math.sin(angle));
    }

    // gets the gauge value at a given point (in gauge client coordinates)
    _getValueFromPoint(pt: wijmo.Point) {

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
        let rc = this._rcSvg,
            ctr = new wijmo.Point(rc.width / 2, rc.height / 2),
            outer = Math.min(rc.width, rc.height) / 2,
            dx = pt.x - ctr.x,
            dy = pt.y - ctr.y,
            r2 = dy * dy + dx * dx;

        // check that the point is not too close to the center (10 pixels at least)
        // nor too far from the outer edge of the face (TFS 391703)
        let edge = 10;
        if (r2 < edge * edge || r2 > (outer + edge) * (outer + edge)) {
            return null;
        }

        // calculate angle
        let ang = (Math.PI - Math.atan2(-dy, dx)) * 180 / Math.PI,
            start = this.startAngle,
            sweep = this.sweepAngle,
            end = start + sweep;
        if (this.rightToLeft) {
            ang = 180 - ang;
        }
        if (sweep > 0) {
            while (ang < start) ang += 360;
            while (ang > end) ang -= 360;
        } else {
            while (ang < end) ang += 360;
            while (ang > start) ang -= 360;
        }

        // clamp the angle (TFS 431484)
        if ((ang - start) * (ang - end) > 0) {
            let pAng = this._getPoint(ctr, ang, outer),
                pMin = this._getPoint(ctr, start, outer),
                pMax = this._getPoint(ctr, end, outer);
            ang = this._getDist2(pAng, pMin) < this._getDist2(pAng, pMax) ? start : end;
        }

        // calculate percentage and return value
        let pct = sweep ? wijmo.clamp(Math.abs(ang - start) / Math.abs(sweep), 0, 1) : 0; // TFS 435434
        return this.min + pct * (this.max - this.min);
    }

    // measures the distance between two points (squared)
    _getDist2(p1: wijmo.Point, p2: wijmo.Point): number {
        let dx = p1.x - p2.x,
            dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    }
}


    }
    


    module wijmo.gauge {
    




'use strict';

/**
 * Represents the direction in which the pointer of a {@link LinearGauge}
 * increases.
 */
export enum GaugeDirection {
    /** Gauge value increases from left to right. */
    Right,
    /** Gauge value increases from right to left. */
    Left,
    /** Gauge value increases from bottom to top. */
    Up,
    /** Gauge value increases from top to bottom. */
    Down
}

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
export class LinearGauge extends Gauge {

    // property storage
    private _direction = GaugeDirection.Right;

    /**
     * Initializes a new instance of the {@link LinearGauge} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);

        // customize
        wijmo.addClass(this.hostElement, 'wj-lineargauge');

        // initialize control options
        this.initialize(options);
    }

    /**
     * Gets or sets the direction in which the gauge is filled.
     * 
     * The default value for this property is **GaugeDirection.Right**.
     */
    get direction(): GaugeDirection {
        return this._direction;
    }
    set direction(value: GaugeDirection) {
        value = wijmo.asEnum(value, GaugeDirection);
        if (value != this._direction) {
            this._direction = value;
            this.invalidate();
        }
    }
    /**
     * Gets the bounds of the gauge's face element.
     *
     * This property is useful for positioning custom SVG elements
     * on the gauge.
     *
     * {@fiddle tha1vms3}
     * 
     */
    get faceBounds(): wijmo.Rect {
        return this._getRangeRect(this._face);
    }

    // virtual methods

    // updates the element for a given range
    _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {

        // update the path
        let rc = this._getRangeRect(rng, value);
        this._updateSegment(e, rc);

        // check whether we have to show text and/or thumb
        let showText = (rng == this._pointer) && (this.showText & ShowText.Value) != 0,
            showThumb = showText || (rng == this._pointer && this.thumbSize > 0);

        // calculate thumb center
        let x = rc.left + rc.width / 2,
            y = rc.top + rc.height / 2;
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
            rc = wijmo.Rect.fromBoundingRect(Gauge._getBBox(this._tValue));
            let color = this._animColor ? this._animColor : this._getPointerColor(rng.max),
                radius = this.thumbSize != null ? this.thumbSize / 2 : Math.max(rc.width, rc.height) * .8,
                ce = this._cValue;
            wijmo.setAttribute(ce, 'cx', this._fix(x));
            wijmo.setAttribute(ce, 'cy', this._fix(y));
            wijmo.setAttribute(ce, 'style', color ? 'fill:' + color : null);
            wijmo.setAttribute(ce, 'r', this._fix(radius));
        }
    }

    // update the text elements
    _updateText() {
        let rc = this._getRangeRect(this._face);
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
    }

    // update the tickmarks
    _updateTicks() {
        let step = (this.tickSpacing && this.tickSpacing > 0) ? this.tickSpacing : this.step,
            path = '',
            gTicks = this._gTicks;

        // clear tickmark text
        while (gTicks.firstChild) {
            wijmo.removeChild(gTicks.firstChild);
        }

        // draw tickmarks and text
        if (this.showTicks && step > 0) {
            let rc = this._getRangeRect(this._face),
                pt = new wijmo.Point(rc.left - rc.width * 0.75, rc.top - rc.height * 0.75),
                pos: string,
                fix = this._fix;
            for (let val = this.min; val <= this.max; val += step) {
                let tickPath = null;
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
                    let tt = this._createElement('text', gTicks) as SVGTextElement;
                    this._centerText(tt, val, pt);
                }
            }
        }
        this._pTicks.setAttribute('d', path);
    }

    // ** private stuff

    // draws a rectangular segment at the specified position
    _updateSegment(path: SVGPathElement, rc: wijmo.Rect) {
        let data = {
            p1: this._fix(new wijmo.Point(rc.left, rc.top)),
            p2: this._fix(new wijmo.Point(rc.right, rc.top)),
            p3: this._fix(new wijmo.Point(rc.right, rc.bottom)),
            p4: this._fix(new wijmo.Point(rc.left, rc.bottom))
        };
        let content = wijmo.format('M {p1} L {p2} L {p3} L {p4} Z', data);
        path.setAttribute('d', content);
    }

    // positions a text element
    _setText(e: SVGTextElement, value: number, rc: wijmo.Rect, pos: string) {
        if (e.getAttribute('display') != 'none') {

            // get the text for the element (TFS 250358)
            let text = wijmo.Globalize.format(value, this.format);
            if (wijmo.isFunction(this.getText)) {
                let part = e == this._tValue ? 'value' :
                    e == this._tMin ? 'min' :
                        e == this._tMax ? 'max' :
                            null;
                wijmo.assert(part != null, 'unknown element');
                text = this.getText(this, part, value, text);
            }

            // set the text and position the element
            e.textContent = text;
            let box = wijmo.Rect.fromBoundingRect(Gauge._getBBox(e)),
                pt = new wijmo.Point(rc.left + rc.width / 2 - box.width / 2,
                    rc.top + rc.height / 2 + box.height / 2);
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
    }

    // gets a rectangle that represents a Range
    _getRangeRect(rng: Range, value = rng.max): wijmo.Rect {

        // get gauge size
        let host = this.hostElement,
            rc = new wijmo.Rect(0, 0, host.clientWidth, host.clientHeight),
            direction = this._getDirection();

        // get face rect (account for thickness, text or thumb at edges)
        let padding = this.thumbSize ? Math.ceil(this.thumbSize / 2) : 0;
        if (this.showText != ShowText.None) {
            let fontSize = parseInt(getComputedStyle(host).fontSize);
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
            let index = this.ranges.indexOf(rng);
            if (index > -1) {
                let len = this.ranges.length;
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
        let face = rng == this._face,
            pctMin = face ? 0 : this._getPercent(rng.min),
            pctMax = face ? 1 : this._getPercent(value); // TFS 210156
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
    }

    // gets the gauge value at a given point (in gauge client coordinates)
    _getValueFromPoint(pt: wijmo.Point) {

        // get face rectangle to calculate coordinates
        let rc = this._getRangeRect(this._face);

        // accept clicks anywhere to be touch-friendly
        //if (!rc.contains(pt)) {
        //    return null;
        //}

        // get position in control coordinates (min to max)
        let pct = 0;
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
    }

    // get gauge direction accounting for RTL (as in input type="range")
    _getDirection(): GaugeDirection {
        let dir = this._direction;
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
    }

    // override to translate keys to account for gauge direction
    _getKey(key: number): number {
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
    }
}
    }
    


    module wijmo.gauge {
    



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
export class BulletGraph extends LinearGauge {

    // child ranges
    _rngTarget: Range;
    _rngGood: Range;
    _rngBad: Range;

    /**
     * Initializes a new instance of the {@link BulletGraph} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);

        // customize
        wijmo.addClass(this.hostElement, 'wj-bulletgraph');
        this._pointer.thickness = .35;

        // add reference ranges
        this._rngTarget = new Range('target');
        this._rngTarget.thickness = .8;
        this._rngTarget.color = 'black';
        this._rngGood = new Range('good');
        this._rngGood.color = 'rgba(0,0,0,.15)';
        this._rngBad = new Range('bad');
        this._rngBad.color = 'rgba(0,0,0,.3)';
        this.ranges.push(this._rngBad);
        this.ranges.push(this._rngGood);
        this.ranges.push(this._rngTarget);

        // initialize control options
        this.initialize(options);
    }

    /**
     * Gets or sets the target value for the measure.
     */
    get target(): number {
        return this._rngTarget.max;
    }
    set target(value: number) {
        this._rngTarget.max = value;
    }
    /**
     * Gets or sets a reference value considered good for the measure.
     */
    get good(): number {
        return this._rngGood.max;
    }
    set good(value: number) {
        this._rngGood.max = value;
    }
    /**
     * Gets or sets a reference value considered bad for the measure.
     */
    get bad(): number {
        return this._rngBad.max;
    }
    set bad(value: number) {
        this._rngBad.max = value;
    }

    // ** implementation

    // gets a rectangle that represents a Range
    _getRangeRect(rng: Range, value = rng.max): wijmo.Rect {

        // let base class calculate the rectangle
        let rc = super._getRangeRect(rng, value);

        // make target range rect look like a bullet
        if (rng == this._rngTarget) {
            switch (this._getDirection()) { // TFS 233532
                case GaugeDirection.Right:
                    rc.left = rc.right - 1;
                    rc.width = 3;
                    break;
                case GaugeDirection.Left:
                    rc.width = 3;
                    break;
                case GaugeDirection.Up:
                    rc.height = 3;
                    break;
                case GaugeDirection.Down:
                    rc.top = rc.bottom - 1;
                    rc.height = 3;
                    break;
            }
        }

        // done
        return rc;
    }
}
    }
    


    module wijmo.gauge {
    // Entry file. All real code files should be re-wijmo from here.


wijmo._registerModule('wijmo.gauge', wijmo.gauge);







    }
    