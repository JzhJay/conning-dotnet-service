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


    module wijmo.grid.cellmaker {
    




/**
 * Specifies parameters used to create cell elements.
 */
interface ICellMakerOptions {
    /** Template string used to set the element's CSS class names. */
    cssClass?: string;
    /** Template string used to set the element's "aria-label" attribute. */
    label?: string;
    /** Object with attributes to apply to the cell content element. */
    attributes?: object;
    /** Function to be executed when the element is clicked. */
    click?: ICellMakerClickHandler;
}

/**
 * Defines a handler for click events on custom cell content.
 */
interface ICellMakerClickHandler {
    /**
     * @param e <b>MouseEvent</b> that contains information about the click event.
     * @param ctx {@link ICellTemplateContext} that contains information about the 
     * custom cell that was clicked.
     */
    (e: MouseEvent, ctx: wijmo.grid.ICellTemplateContext): void
}

/**
 * Specifies parameters used to create cell buttons with the
 * {@link CellMaker.makeButton} method.
 */
interface IButtonOptions extends ICellMakerOptions {
    /** Template string used to set the element's display text. */
    text?: string;
}

/**
 * Specifies parameters used to create cell hyperlinks with the
 * {@link CellMaker.makeLink} method.
 */
interface ILinkOptions extends IButtonOptions {
    /** Template string used to set the link's <b>href</b> attribute. */
    href?: string;
}

/**
 * Specifies parameters used to create rating cells with the
 * {@link CellMaker.makeRating} method.
 */
interface IRatingOptions extends ICellMakerOptions {
    /**
     * Range of the rating values, expressed as an array with two numbers 
     * (minimum and maximum ratings).
     * 
     * The default value for this option is [0, 5].
     */
    range?: number[];
    /**
     * Whether to show symbols for zero ratings.
     * 
     * The default value for this option is false, which causes the zero
     * symbol not to be displayed. Users may still click the area to the
     * left of the first symbol to give the cell a zero rating.
     */
    showZeros?: boolean;
}

/**
 * Specifies constants that define Sparkline types.
 */
export enum SparklineType {
    /** A mini line chart. */
    Line,
    /** A mini column chart. */
    Column,
    /** A mini column chart that shows only three values: positive, negative, and zero. */
    WinLoss
}

/**
 * Specifies constants that define Sparkline markers.
 */
export enum SparklineMarkers {
    /** No markers. */
    None = 0,
    /** Add marker to first point. */
    First = 1,
    /** Add marker to last point. */
    Last = 2,
    /** Add marker to highest-value points. */
    High = 4,
    /** Add marker to lowest-value points. */
    Low = 8,
    /** Add marker to negative-value points. */
    Negative = 16
}

/**
 * Specifies parameters used to create Sparkline cells with the
 * {@link CellMaker.makeSparkline} method.
 */
interface ISparkLineOptions extends ICellMakerOptions {
    /**
     * Type of Sparkline to create.
     * 
     * The default type is {@link SparklineType.Line}.
     */
    type?: SparklineType;
    /**
     * Markers to add to Sparkline points.
     */
    markers?: SparklineMarkers;
    /**
     * Base value (position of the Y-axis) on a sparkline.
     * 
     * Setting this value to null causes the chart to calculate the base value
     * automatically so the chart fills the vertical extent of the cell. 
     * This is a good option to highlight relative changes, and is used by 
     * default for Sparklines of type {@link SparklineType.Line}.
     * 
     * Setting this value to an absolute number (like zero) is a better option
     * to show absolute changes, and is used by default for Sparklines of type
     * {@link SparklineType.Column}.
     */
    baseValue?: number;
    /**
     * Maximum number of points to use in the sparkline or sparkbar.
     * 
     * Setting this value to null causes the cell to show all points.
     */
    maxPoints?: number;
}

// return value for _scaleValues method
interface _IScaledValues {
    min: number,
    max: number,
    base: number,
    points: number[],
    data: number[]
}

/**
 * Provides methods for creating cells with custom content such as 
 * Buttons, Hyperlinks, Images, Ratings, and Sparklines.
 * 
 * To use these methods, assign their result to a column's 
 * {@link Column.cellTemplate} property.
 */
export class CellMaker {
    static _WJC_CellMaker = 'wj-cell-maker';

    /**
     * Creates a cell template with a button.
     * 
     * By default, the button displays the cell's bound text in it.
     * If you want to show a fixed string, set the <b>options.text</b> 
     * property to the string you want to show.
     * 
     * For example, the code below defines a column with button elements.
     * All buttons show the same text ('Click Me') and show an alert when 
     * clicked:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         { 
     *             binding: 'country', 
     *             header: 'My Buttons',
     *             cellTemplate: CellMaker.makeButton({
     *                 text: 'Click Me', // override bound text
     *                 click: (e: MouseEvent, ctx: ICellTemplateContext) => {
     *                     alert('Clicked Button ** ' + ctx.item.country + ' **')
     *                 }
     *             })
     *         }
     *     ]
     * });
     * ```
     * 
     * To avoid disrupting the regular tab navigation, the button's 
     * **tabindex** attribute is set to -1 by default.
     * 
     * If you want to include the buttons in the tab navigation,
     * use the **attributes** option to set their **tabindex**
     * attribute to zero. For example:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         { 
     *             binding: 'country', 
     *             header: 'My Buttons',
     *             cellTemplate: CellMaker.makeButton({
     *                 text: 'Click Me', // override bound text
     *                 click: (e: MouseEvent, ctx: ICellTemplateContext) => {
     *                     alert('Clicked Button ** ' + ctx.item.country + ' **')
     *                 },
     *                 attributes: {
     *                     tabindex: 0 // make button a tab stop
     *                 }
     *             })
     *         }
     *     ]
     * });
     * ```
     * 
     * For details on links and button elements, please visit
     * https://css-tricks.com/a-complete-guide-to-links-and-buttons/.
     * 
     * @param options {@link IButtonOptions} object containing parameters for the button.
     * @returns An {@link ICellTemplateFunction} to be assigned to a column's {@link Column.cellTemplate} property.
     */
    static makeButton(options?: IButtonOptions): wijmo.grid.ICellTemplateFunction {
        return (ctx: wijmo.grid.ICellTemplateContext, cell: HTMLElement) => {

            // make the column read-only
            ctx.col.isReadOnly = true;

            // clear the cell
            cell.innerHTML = '';

            // create the button
            let html = wijmo.format('<button type="button" tabindex="-1">{txt}</button>', {
                txt: CellMaker._getOptionText(options, 'text', ctx, ctx.text),
            });
            CellMaker._createElement(cell, html, options, ctx);

            // return null to keep the cell content
            return null;
        }
    }
    /**
     * Creates a cell template with a hyperlink.
     * 
     * By default, the link displays the cell's bound text in it.
     * If you want to show a fixed string, set the <b>options.text</b> 
     * property to the string you want to show.
     * 
     * For example, the code below defines a column with hyperlink elements.
     * The links show some custom text and link to a url from the cell's
     * data item:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         {
     *             binding: 'country', 
     *             header: 'My Links',
     *             cellTemplate: CellMaker.makeLink({
     *                 text: 'Visit ${item.country}', // override bound text
     *                 href: '${item.url}', // bound link destination
     *                 attributes: {
     *                     tabindex: 0 // make hyperlink a tab stop
     *                 }
     *             })
     *         }
     *     ]
     * });
     * ```
     * 
     * To avoid disrupting the regular tab navigation, the hyperlink's 
     * **tabindex** attribute is set to -1 by default.
     * 
     * If you want to include the hyperlinks in the tab navigation,
     * use the **attributes** option to set their **tabindex**
     * attribute to zero. For example:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         {
     *             binding: 'country', 
     *             header: 'My Links',
     *             cellTemplate: CellMaker.makeLink({
     *                 text: 'Visit ${item.country}', // override bound text
     *                 href: '${item.url}', // bound link destination
     *                 // no need for click handler, the link navigates automatically
     *             })
     *         }
     *     ]
     * });
     * ```
     * 
     * For details on links and button elements, please visit
     * https://css-tricks.com/a-complete-guide-to-links-and-buttons/.
     * 
     * @param options {@link ILinkOptions} object containing parameters for the hyperlink.
     * @returns An {@link ICellTemplateFunction} to be assigned to a column's {@link Column.cellTemplate} property.
     */
    static makeLink(options?: ILinkOptions): wijmo.grid.ICellTemplateFunction {
        return (ctx: wijmo.grid.ICellTemplateContext, cell: HTMLElement) => {

            // make the column read-only
            ctx.col.isReadOnly = true;

            // clear the cell
            cell.innerHTML = '';

            // create the link
            let html = wijmo.format('<a href="{href}" tabindex="-1">{txt}</a>', {
                txt: CellMaker._getOptionText(options, 'text', ctx, ctx.text),
                href: CellMaker._getOptionText(options, 'href', ctx, '#'),
            });
            CellMaker._createElement(cell, html, options, ctx);

            // return null to keep the cell content
            return null;
        }
    }
    /**
     * Creates a cell template with a sparkline.
     * 
     * The cell should be bound to an array of numbers to be shown as a
     * mini line chart.
     * 
     * For example, the code below defines a column with sparklines
     * showing the content of the 'history' array in the cell's data item.
     * You may customize the appearance of the sparklines using CSS:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         {
     *             binding: 'history',
     *             header: 'History Sparklines',
     *             width: 175,
     *             cellTemplate: CellMaker.makeSparkline({
     *                 markers: SparklineMarkers.High | SparklineMarkers.Low, // add markers
     *                 maxPoints: 25, // limit number of points
     *                 label: '${item.country} sales history line chart', // accessibility
     *             })
     *         }
     *     ]
     * });
     * ```
     * @param options {@link ISparkLineOptions} object containing parameters for the Sparkline.
     * It should include the <b>label</b> property for accessibility.
     * @returns An {@link ICellTemplateFunction} to be assigned to a column's {@link Column.cellTemplate} property.
     */
    static makeSparkline(options?: ISparkLineOptions): wijmo.grid.ICellTemplateFunction {
        return (ctx: wijmo.grid.ICellTemplateContext, cell: HTMLElement) => {

            // make the column read-only
            ctx.col.isReadOnly = true;

            // clear the cell
            cell.innerHTML = '';

            // create the sparkline
            let html = wijmo.format('<div><svg><g>{spark}</g></svg></div>', {
                spark: CellMaker._getSparkline(ctx.value as number[], options)
            });
            CellMaker._createElement(cell, html, options, ctx);

            // return null to keep the cell content
            return null;
        }
    }
    /**
     * Creates a cell template with an image.
     * 
     * The cell should be bound to a string containing an image URL.
     * 
     * For example, the code below defines a column with images located
     * at urls specified by the 'img' member of the data items:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         {
     *             binding: 'img',
     *             header: 'Images',
     *             cssClass: 'cell-img',
     *             cellTemplate: CellMaker.makeImage({
     *                 label: 'image for ${item.country}', // accessibility
     *                 click: (e, ctx) => alert('Clicked image for ' + ctx.item.country)
     *             })
     *         }
     *     ]
     * });
     * ```
     * @param options {@link ICellMakerOptions} object containing parameters for the image.
     * It should include the <b>label</b> property for accessibility.
     * @returns An {@link ICellTemplateFunction} to be assigned to a column's {@link Column.cellTemplate} property.
     */
    static makeImage(options?: ICellMakerOptions): wijmo.grid.ICellTemplateFunction {
        return (ctx: wijmo.grid.ICellTemplateContext, cell: HTMLElement) => {

            // make the column read-only
            ctx.col.isReadOnly = true;

            // clear the cell
            cell.innerHTML = '';

            // create the image element
            let html = wijmo.format('<img src="{src}"></div>', {
                src: CellMaker._getOptionText(options, 'src', ctx, ctx.text)
            });
            CellMaker._createElement(cell, html, options, ctx);

            // return null to keep the cell content
            return null;
        }
    }
    /**
     * Creates a cell template to show and edit a rating value.
     * 
     * The cell should be bound to a string containing a number that
     * represents a rating.
     * 
     * By default, cells show ratings as stars. You may customize
     * the appearance of rating cells using CSS.
     * 
     * For example, the code below defines a column with stars that 
     * show the 'rating' member of the data items.
     * Since the column is not read-only, users may edit the ratings
     * using the keyboard or the mouse:
     * 
     * ```typescript
     * new FlexGrid('#theGrid', {
     *     autoGenerateColumns: false,
     *     columns: [
     *         { binding: 'id', header: 'ID', isReadOnly: true },
     *         {
     *             binding: 'rating',
     *             header: 'Rating (editable)',
     *             width: 220,
     *             align: 'center',
     *             cellTemplate: CellMaker.makeRating({
     *                 range: [0, 5], // rating values between 0 and 5
     *                 label: 'Edit Product Rating'
     *             })
     *        }
     *     ]
     * });
     * ```
     * @param options {@link IRatingOptions} object containing parameters for the rating cell.
     * @returns An {@link ICellTemplateFunction} to be assigned to a column's {@link Column.cellTemplate} property.
     */
    static makeRating(options?: IRatingOptions): wijmo.grid.ICellTemplateFunction {
        return (ctx: wijmo.grid.ICellTemplateContext, cell: HTMLElement) => {

            // configure the the column as radio dataMap with cellMaker style (only once)
            let col = ctx.col,
                DME = wijmo.grid.DataMapEditor,
                cls = col.cssClass || '',
                CMC = CellMaker._WJC_CellMaker;
            if (!col.dataMap || col.dataMapEditor != DME.RadioButtons || cls.indexOf(CMC) < 0) {

                // set data map and editor
                let rng = options ? options.range : null,
                    map = [];
                rng = (rng && wijmo.isArray(rng) && rng.length > 1 && rng[1] > rng[0]) ? rng : [0, 5];
                for (let i = rng[0]; i <= rng[1]; i++) {
                    map.push(i);
                }
                col.dataMap = new wijmo.grid.DataMap(map);
                col.dataMapEditor = DME.RadioButtons;

                // update column's CSS class
                if (cls.indexOf(CMC) < 0) {
                    col.cssClass = (cls + ' ' + CMC).trim();
                }
            }

            // add aria-label attribute
            if (options && options.label) {
                let label = CellMaker._getOptionText(options, 'label', ctx);
                cell.setAttribute('aria-label', label.trim());
            }

            // add wj-zero, wj-off classes (used for styling)
            let labels = cell.querySelectorAll('label'),
                chkSel = 'input:checked',
                showZeros = options ? options.showZeros : false,
                chkOff = cell.querySelector(chkSel) == null;
            for (let i = 0; i < labels.length; i++) {
                let label = labels[i],
                    input = label.querySelector('input');
                wijmo.toggleClass(label, 'wj-chk-hidden', input.value == '0' && !showZeros); // zero checkbox
                wijmo.toggleClass(label, 'wj-chk-off', chkOff); // boxes past the check
                chkOff = chkOff || label.querySelector(chkSel) != null;
            }

            // return null to keep the cell content
            return null;
        }
    }

    // ** utilities

    // gets the text from a cell option
    static _getOptionText(options: any, option: string, ctx: wijmo.grid.ICellTemplateContext, defVal = ''): string {
        let tpl = options ? options[option] : '';
        return tpl ? wijmo.evalTemplate(tpl, ctx) : defVal;
    }

    // create the cell content element
    static _createElement(cell: HTMLElement, html: string, options: ICellMakerOptions, ctx: wijmo.grid.ICellTemplateContext): HTMLElement {

        // create element and add it to the cell
        let e = wijmo.createElement(html, cell);

        // add class
        let cls = CellMaker._WJC_CellMaker;
        if (options && options.cssClass) {
            cls += ' ' + CellMaker._getOptionText(options, 'cssClass', ctx);
        }
        e.className = cls.trim();

        // add aria-label and alt attributes
        if (options && options.label) {
            let label = CellMaker._getOptionText(options, 'label', ctx);
            e.setAttribute('aria-label', label.trim());
            if (e instanceof HTMLImageElement) {
                e.setAttribute('alt', label.trim());
            }
        }

        // add other attributes
        if (options && options.attributes) {
            for (let att in options.attributes) {
                e.setAttribute(att, options.attributes[att])
            }
        }

        // add click event handler
        if (options && wijmo.isFunction(options.click)) {
            e.onclick = CellMaker._handleClick.bind({
                options: options,
                ctx: CellMaker._cloneContext(ctx)
            });
        }

        // done
        return e;
    }

    // clone context since the CellFactory re-uses it
    static _cloneContext(ctx: wijmo.grid.ICellTemplateContext): wijmo.grid.ICellTemplateContext {
        if (wijmo.isFunction(Object.assign)) {
            return Object.assign({}, ctx);
        }
        let clone = {}; // IE does not implement Object.assign: TFS 423897
        for (let k in ctx) {
            clone[k] = ctx[k];
        }
        return clone as wijmo.grid.ICellTemplateContext;
    }

    // invoke the cell content element's click function
    static _handleClick(e: MouseEvent) {
        let options = this['options'] as IButtonOptions;
        if (wijmo.isFunction(options.click)) {
            e.preventDefault(); // prevent scrolling to the top of the page
            let ctx = this['ctx'] as wijmo.grid.ICellTemplateContext;
            options.click(e, ctx);
        }
    }

    // get the SVG for a sparkline chart
    static _getSparkline(data: number[], options: ISparkLineOptions): string {
        let svg = '',
            SLT = SparklineType,
            SLM = SparklineMarkers;

        // parse options
        options = options || {};
        let type = options.type != null ? options.type : SLT.Line,
            markers = options.markers != null ? options.markers : SLM.None,
            baseVal = wijmo.isNumber(options.baseValue) ? options.baseValue : type == SLT.Line ? null : 0,
            maxPoints = wijmo.isNumber(options.maxPoints) ? options.maxPoints : null;

        // generate the SVG
        if (data instanceof Array && data.length > 1) {

            // map data (numeric and boolean) for WinLoss sparklines
            if (type == SLT.WinLoss) {
                data = data.map(value => {
                    if (wijmo.isBoolean(value)) {
                        return value ? +1 : -1;
                    }
                    if (wijmo.isNumber(value)) {
                        return value > 0 ? +1 : value < 0 ? -1 : null;
                    }
                    return null;
                });
            }

            // scale the values
            let values = CellMaker._scaleValues(data, baseVal, maxPoints),
                pts = values.points,
                base = values.base,
                step = 100 / (pts.length - (type == SLT.Line ? 1 : 0)),
                barWidth = step > 4 ? step - 2 : step,
                offset = step - barWidth;

            // generate the SVG
            switch (type) {
                case SLT.Column:
                case SLT.WinLoss:
                    for (let i = 0; i < pts.length; i++) {
                        let val = pts[i];
                        if (val != null) {
                            svg += wijmo.format('<rect {cls}x={x}% y={y}% width={w}% height={h}% />', {
                                x: (i * step + offset).toFixed(2),
                                y: Math.min(base, val),
                                w: barWidth.toFixed(2),
                                h: Math.abs(base - val),
                                cls: CellMaker._getMarkers(markers, values, i)
                            });
                        }
                    }
                    break;
                case SLT.Line:
                    for (let i = 0; i < pts.length - 1; i++) {
                        let y1 = pts[i],
                            y2 = pts[i + 1];

                        // draw the line
                        if (y1 != null && y2 != null) {
                            svg += wijmo.format('<line x1={x1}% y1={y1}% x2={x2}% y2={y2}% />', {
                                x1: Math.round(step * i),
                                y1: y1,
                                x2: Math.round(step * (i + 1)),
                                y2: y2,
                            });
                        }

                        // draw the markers
                        let cls = CellMaker._getMarkers(markers, values, i),
                            fmtMarker = '<circle {cls}cx={x}% cy={y}% r="3"/>';
                        if (cls) {
                            svg += wijmo.format(fmtMarker, {
                                x: Math.round(step * i),
                                y: y1,
                                cls: cls
                            });
                        }

                        // draw the last marker in the series
                        if (i == pts.length - 2) {
                            cls = CellMaker._getMarkers(markers, values, i + 1);
                            if (cls) {
                                svg += wijmo.format(fmtMarker, {
                                    x: Math.round(step * (i + 1)),
                                    y: y2,
                                    cls: cls
                                });
                            }
                        }
                    }
                    break;
            }

            // add x axis
            if (baseVal != null && type != SLT.WinLoss) {
                svg += wijmo.format('<line class="x-axis" x1=0% y1={base}% x2=100% y2={base}% />', {
                    base: values.base
                });
            }
        }
        return svg;
    }

    // scale values in an array to the range [0, 100]
    static _scaleValues(data: number[], baseVal: number, maxPoints: number): _IScaledValues {
        let points = [];

        // honor maxPoints parameter
        if (maxPoints && maxPoints > 1 && data.length > maxPoints) {
            data = data.slice(0, maxPoints);
        }

        // get min/max
        let min: number,
            max: number;
        data.forEach(value => {
            if (wijmo.isNumber(value)) {
                min = !wijmo.isNumber(min) || value < min ? value : min;
                max = !wijmo.isNumber(max) || value > max ? value : max;
            }
        });

        // make sure we have enough numbers
        if (wijmo.isNumber(min) && wijmo.isNumber(max)) {

            // account for base val
            if (baseVal != null) {
                min = Math.min(min, baseVal);
                max = Math.max(max, baseVal);
            } else {
                baseVal = min > 0 ? min : max < 0 ? max : 0;
            }

            // make sure we have a range
            if (min == max) {
                min--;
                max++;
            }

            // start with base value, then add scaled values
            let rng = max - min;
            data.forEach(value => {
                points.push(wijmo.isNumber(value)
                    ? 100 - Math.round((value - min) / rng * 100)
                    : null);
            });
            baseVal = 100 - Math.round((baseVal - min) / rng * 100);
        }

        // done
        return {
            min: min,
            max: max,
            base: baseVal,
            points: points,
            data: data
        }
    }

    // get the classes that indicate markers for a given data point
    static _getMarkers(markers: SparklineMarkers, values: _IScaledValues, index: number): string {
        let cls = '',
            SLM = SparklineMarkers;
        if (markers) {
            let data = values.data,
                mk = 'wj-marker-';
            if ((markers & SLM.First) != 0 && index == 0) {
                cls += mk + 'first ';
            }
            if ((markers & SLM.Last) != 0 && index == data.length - 1) {
                cls += mk + 'last ';
            }
            if ((markers & SLM.High) != 0 && data[index] == values.max) {
                cls += mk + 'high ';
            }
            if ((markers & SLM.Low) != 0 && data[index] == values.min) {
                cls += mk + 'low ';
            }
            if ((markers & SLM.Negative) != 0 && data[index] < 0) {
                cls += mk + 'negative ';
            }
        }
        return cls ? 'class="wj-marker ' + cls.trim() + '"' : '';
    }
}



    }
    


    module wijmo.grid.cellmaker {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.cellmaker', wijmo.grid.cellmaker);


    }
    