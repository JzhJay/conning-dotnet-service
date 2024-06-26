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
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var cellmaker;
        (function (cellmaker) {
            /**
             * Specifies constants that define Sparkline types.
             */
            var SparklineType;
            (function (SparklineType) {
                /** A mini line chart. */
                SparklineType[SparklineType["Line"] = 0] = "Line";
                /** A mini column chart. */
                SparklineType[SparklineType["Column"] = 1] = "Column";
                /** A mini column chart that shows only three values: positive, negative, and zero. */
                SparklineType[SparklineType["WinLoss"] = 2] = "WinLoss";
            })(SparklineType = cellmaker.SparklineType || (cellmaker.SparklineType = {}));
            /**
             * Specifies constants that define Sparkline markers.
             */
            var SparklineMarkers;
            (function (SparklineMarkers) {
                /** No markers. */
                SparklineMarkers[SparklineMarkers["None"] = 0] = "None";
                /** Add marker to first point. */
                SparklineMarkers[SparklineMarkers["First"] = 1] = "First";
                /** Add marker to last point. */
                SparklineMarkers[SparklineMarkers["Last"] = 2] = "Last";
                /** Add marker to highest-value points. */
                SparklineMarkers[SparklineMarkers["High"] = 4] = "High";
                /** Add marker to lowest-value points. */
                SparklineMarkers[SparklineMarkers["Low"] = 8] = "Low";
                /** Add marker to negative-value points. */
                SparklineMarkers[SparklineMarkers["Negative"] = 16] = "Negative";
            })(SparklineMarkers = cellmaker.SparklineMarkers || (cellmaker.SparklineMarkers = {}));
            /**
             * Provides methods for creating cells with custom content such as
             * Buttons, Hyperlinks, Images, Ratings, and Sparklines.
             *
             * To use these methods, assign their result to a column's
             * {@link Column.cellTemplate} property.
             */
            var CellMaker = /** @class */ (function () {
                function CellMaker() {
                }
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
                CellMaker.makeButton = function (options) {
                    return function (ctx, cell) {
                        // make the column read-only
                        ctx.col.isReadOnly = true;
                        // clear the cell
                        cell.innerHTML = '';
                        // create the button
                        var html = wijmo.format('<button type="button" tabindex="-1">{txt}</button>', {
                            txt: CellMaker._getOptionText(options, 'text', ctx, ctx.text),
                        });
                        CellMaker._createElement(cell, html, options, ctx);
                        // return null to keep the cell content
                        return null;
                    };
                };
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
                CellMaker.makeLink = function (options) {
                    return function (ctx, cell) {
                        // make the column read-only
                        ctx.col.isReadOnly = true;
                        // clear the cell
                        cell.innerHTML = '';
                        // create the link
                        var html = wijmo.format('<a href="{href}" tabindex="-1">{txt}</a>', {
                            txt: CellMaker._getOptionText(options, 'text', ctx, ctx.text),
                            href: CellMaker._getOptionText(options, 'href', ctx, '#'),
                        });
                        CellMaker._createElement(cell, html, options, ctx);
                        // return null to keep the cell content
                        return null;
                    };
                };
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
                CellMaker.makeSparkline = function (options) {
                    return function (ctx, cell) {
                        // make the column read-only
                        ctx.col.isReadOnly = true;
                        // clear the cell
                        cell.innerHTML = '';
                        // create the sparkline
                        var html = wijmo.format('<div><svg><g>{spark}</g></svg></div>', {
                            spark: CellMaker._getSparkline(ctx.value, options)
                        });
                        CellMaker._createElement(cell, html, options, ctx);
                        // return null to keep the cell content
                        return null;
                    };
                };
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
                CellMaker.makeImage = function (options) {
                    return function (ctx, cell) {
                        // make the column read-only
                        ctx.col.isReadOnly = true;
                        // clear the cell
                        cell.innerHTML = '';
                        // create the image element
                        var html = wijmo.format('<img src="{src}"></div>', {
                            src: CellMaker._getOptionText(options, 'src', ctx, ctx.text)
                        });
                        CellMaker._createElement(cell, html, options, ctx);
                        // return null to keep the cell content
                        return null;
                    };
                };
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
                CellMaker.makeRating = function (options) {
                    return function (ctx, cell) {
                        // configure the the column as radio dataMap with cellMaker style (only once)
                        var col = ctx.col, DME = wijmo.grid.DataMapEditor, cls = col.cssClass || '', CMC = CellMaker._WJC_CellMaker;
                        if (!col.dataMap || col.dataMapEditor != DME.RadioButtons || cls.indexOf(CMC) < 0) {
                            // set data map and editor
                            var rng = options ? options.range : null, map = [];
                            rng = (rng && wijmo.isArray(rng) && rng.length > 1 && rng[1] > rng[0]) ? rng : [0, 5];
                            for (var i = rng[0]; i <= rng[1]; i++) {
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
                            var label = CellMaker._getOptionText(options, 'label', ctx);
                            cell.setAttribute('aria-label', label.trim());
                        }
                        // add wj-zero, wj-off classes (used for styling)
                        var labels = cell.querySelectorAll('label'), chkSel = 'input:checked', showZeros = options ? options.showZeros : false, chkOff = cell.querySelector(chkSel) == null;
                        for (var i = 0; i < labels.length; i++) {
                            var label = labels[i], input_1 = label.querySelector('input');
                            wijmo.toggleClass(label, 'wj-chk-hidden', input_1.value == '0' && !showZeros); // zero checkbox
                            wijmo.toggleClass(label, 'wj-chk-off', chkOff); // boxes past the check
                            chkOff = chkOff || label.querySelector(chkSel) != null;
                        }
                        // return null to keep the cell content
                        return null;
                    };
                };
                // ** utilities
                // gets the text from a cell option
                CellMaker._getOptionText = function (options, option, ctx, defVal) {
                    if (defVal === void 0) { defVal = ''; }
                    var tpl = options ? options[option] : '';
                    return tpl ? wijmo.evalTemplate(tpl, ctx) : defVal;
                };
                // create the cell content element
                CellMaker._createElement = function (cell, html, options, ctx) {
                    // create element and add it to the cell
                    var e = wijmo.createElement(html, cell);
                    // add class
                    var cls = CellMaker._WJC_CellMaker;
                    if (options && options.cssClass) {
                        cls += ' ' + CellMaker._getOptionText(options, 'cssClass', ctx);
                    }
                    e.className = cls.trim();
                    // add aria-label and alt attributes
                    if (options && options.label) {
                        var label = CellMaker._getOptionText(options, 'label', ctx);
                        e.setAttribute('aria-label', label.trim());
                        if (e instanceof HTMLImageElement) {
                            e.setAttribute('alt', label.trim());
                        }
                    }
                    // add other attributes
                    if (options && options.attributes) {
                        for (var att in options.attributes) {
                            e.setAttribute(att, options.attributes[att]);
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
                };
                // clone context since the CellFactory re-uses it
                CellMaker._cloneContext = function (ctx) {
                    if (wijmo.isFunction(Object.assign)) {
                        return Object.assign({}, ctx);
                    }
                    var clone = {}; // IE does not implement Object.assign: TFS 423897
                    for (var k in ctx) {
                        clone[k] = ctx[k];
                    }
                    return clone;
                };
                // invoke the cell content element's click function
                CellMaker._handleClick = function (e) {
                    var options = this['options'];
                    if (wijmo.isFunction(options.click)) {
                        e.preventDefault(); // prevent scrolling to the top of the page
                        var ctx = this['ctx'];
                        options.click(e, ctx);
                    }
                };
                // get the SVG for a sparkline chart
                CellMaker._getSparkline = function (data, options) {
                    var svg = '', SLT = SparklineType, SLM = SparklineMarkers;
                    // parse options
                    options = options || {};
                    var type = options.type != null ? options.type : SLT.Line, markers = options.markers != null ? options.markers : SLM.None, baseVal = wijmo.isNumber(options.baseValue) ? options.baseValue : type == SLT.Line ? null : 0, maxPoints = wijmo.isNumber(options.maxPoints) ? options.maxPoints : null;
                    // generate the SVG
                    if (data instanceof Array && data.length > 1) {
                        // map data (numeric and boolean) for WinLoss sparklines
                        if (type == SLT.WinLoss) {
                            data = data.map(function (value) {
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
                        var values = CellMaker._scaleValues(data, baseVal, maxPoints), pts = values.points, base = values.base, step = 100 / (pts.length - (type == SLT.Line ? 1 : 0)), barWidth = step > 4 ? step - 2 : step, offset = step - barWidth;
                        // generate the SVG
                        switch (type) {
                            case SLT.Column:
                            case SLT.WinLoss:
                                for (var i = 0; i < pts.length; i++) {
                                    var val = pts[i];
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
                                for (var i = 0; i < pts.length - 1; i++) {
                                    var y1 = pts[i], y2 = pts[i + 1];
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
                                    var cls = CellMaker._getMarkers(markers, values, i), fmtMarker = '<circle {cls}cx={x}% cy={y}% r="3"/>';
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
                };
                // scale values in an array to the range [0, 100]
                CellMaker._scaleValues = function (data, baseVal, maxPoints) {
                    var points = [];
                    // honor maxPoints parameter
                    if (maxPoints && maxPoints > 1 && data.length > maxPoints) {
                        data = data.slice(0, maxPoints);
                    }
                    // get min/max
                    var min, max;
                    data.forEach(function (value) {
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
                        }
                        else {
                            baseVal = min > 0 ? min : max < 0 ? max : 0;
                        }
                        // make sure we have a range
                        if (min == max) {
                            min--;
                            max++;
                        }
                        // start with base value, then add scaled values
                        var rng_1 = max - min;
                        data.forEach(function (value) {
                            points.push(wijmo.isNumber(value)
                                ? 100 - Math.round((value - min) / rng_1 * 100)
                                : null);
                        });
                        baseVal = 100 - Math.round((baseVal - min) / rng_1 * 100);
                    }
                    // done
                    return {
                        min: min,
                        max: max,
                        base: baseVal,
                        points: points,
                        data: data
                    };
                };
                // get the classes that indicate markers for a given data point
                CellMaker._getMarkers = function (markers, values, index) {
                    var cls = '', SLM = SparklineMarkers;
                    if (markers) {
                        var data = values.data, mk = 'wj-marker-';
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
                };
                CellMaker._WJC_CellMaker = 'wj-cell-maker';
                return CellMaker;
            }());
            cellmaker.CellMaker = CellMaker;
        })(cellmaker = grid.cellmaker || (grid.cellmaker = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var cellmaker;
        (function (cellmaker) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.cellmaker', wijmo.grid.cellmaker);
        })(cellmaker = grid.cellmaker || (grid.cellmaker = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.cellmaker.js.map