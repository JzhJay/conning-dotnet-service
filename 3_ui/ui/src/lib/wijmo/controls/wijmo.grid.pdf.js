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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            'use strict';
            function softGrid() {
                return wijmo._getModule('wijmo.grid');
            }
            pdf.softGrid = softGrid;
            function softDetail() {
                return wijmo._getModule('wijmo.grid.detail');
            }
            pdf.softDetail = softDetail;
            function softMultiRow() {
                return wijmo._getModule('wijmo.grid.multirow');
            }
            pdf.softMultiRow = softMultiRow;
            function softSheet() {
                return wijmo._getModule('wijmo.grid.sheet');
            }
            pdf.softSheet = softSheet;
            function softOlap() {
                return wijmo._getModule('wijmo.olap');
            }
            pdf.softOlap = softOlap;
            function softTransposed() {
                return wijmo._getModule('wijmo.grid.transposed');
            }
            pdf.softTransposed = softTransposed;
            function softTransposedMultiRow() {
                return wijmo._getModule('wijmo.grid.transposedmultirow');
            }
            pdf.softTransposedMultiRow = softTransposedMultiRow;
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            'use strict';
            /**
             * Specifies how the grid content should be scaled to fit the page.
             */
            var ScaleMode;
            (function (ScaleMode) {
                /**
                 * Render the grid in actual size, breaking into pages as needed.
                 */
                ScaleMode[ScaleMode["ActualSize"] = 0] = "ActualSize";
                /**
                 * Scale the grid, so that it fits the page width.
                 */
                ScaleMode[ScaleMode["PageWidth"] = 1] = "PageWidth";
                /**
                 * Scale the grid, so that it fits on a single page.
                 */
                ScaleMode[ScaleMode["SinglePage"] = 2] = "SinglePage";
            })(ScaleMode = pdf.ScaleMode || (pdf.ScaleMode = {}));
            /**
             * Specifies whether the whole grid or just a section should be rendered.
             */
            var ExportMode;
            (function (ExportMode) {
                /**
                 * Exports all the data from grid.
                 */
                ExportMode[ExportMode["All"] = 0] = "All";
                /**
                 * Exports the current selection only.
                 */
                ExportMode[ExportMode["Selection"] = 1] = "Selection";
            })(ExportMode = pdf.ExportMode || (pdf.ExportMode = {}));
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            'use strict';
            // An equivalent of wijmo.grid.CellType
            var _CellType;
            (function (_CellType) {
                _CellType[_CellType["None"] = 0] = "None";
                _CellType[_CellType["Cell"] = 1] = "Cell";
                _CellType[_CellType["ColumnHeader"] = 2] = "ColumnHeader";
                _CellType[_CellType["RowHeader"] = 3] = "RowHeader";
                _CellType[_CellType["TopLeft"] = 4] = "TopLeft";
                _CellType[_CellType["ColumnFooter"] = 5] = "ColumnFooter";
                _CellType[_CellType["BottomLeft"] = 6] = "BottomLeft";
            })(_CellType = pdf._CellType || (pdf._CellType = {}));
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            'use strict';
            /*
             * Merges the content of the source object with the destination object.
             *
             * @param dst The destination object.
             * @param src The source object.
             * @param overwrite Indicates whether the existing properties should be overwritten.
             * @return The modified destination object.
             */
            function _merge(dst, src, overwrite) {
                if (overwrite === void 0) { overwrite = false; }
                if (!dst && src) {
                    dst = {};
                }
                if (src && dst) {
                    for (var key in src) {
                        var srcProp = src[key], dstProp = dst[key];
                        if (!wijmo.isObject(srcProp)) {
                            if (dstProp === undefined || (overwrite && srcProp !== undefined)) {
                                dst[key] = srcProp;
                            }
                        }
                        else {
                            if (dstProp === undefined || !wijmo.isObject(dstProp) && overwrite) {
                                if (wijmo.isFunction(srcProp.clone)) {
                                    dst[key] = dstProp = srcProp.clone();
                                    continue;
                                }
                                else {
                                    dst[key] = dstProp = {};
                                }
                            }
                            if (wijmo.isObject(dstProp)) {
                                _merge(dst[key], srcProp, overwrite);
                            }
                        }
                    }
                }
                return dst;
            }
            pdf._merge = _merge;
            // Used when obtaining a binding column from MultiRow and TransposedGrid, which is virtual for these controls.
            function _combineColumns(regCol, bndCol) {
                return {
                    aggregate: bndCol.aggregate,
                    binding: bndCol.binding,
                    name: bndCol.name,
                    dataType: bndCol.dataType,
                    wordWrap: bndCol.wordWrap,
                    multiLine: bndCol.multiLine,
                    getAlignment: function ( /*row*/) {
                        if ('getAlignment' in bndCol) { // in case if bndCol is a POJO (TransposedGrid) 
                            return bndCol.getAlignment( /*row*/);
                        }
                        return undefined;
                    },
                    index: regCol.index,
                    visibleIndex: regCol.visibleIndex,
                    isVisible: regCol.isVisible,
                    renderWidth: regCol.renderWidth
                };
            }
            pdf._combineColumns = _combineColumns;
            function _cloneStyle(val) {
                if (!val) {
                    return null;
                }
                var res = {}, toCamel = function (val) { return val.replace(/\-([a-z])/g, function (match, group, offset) {
                    return offset > 0
                        ? group.toUpperCase()
                        : group;
                }); };
                for (var i = 0, len = val.length; i < len; i++) {
                    var name_1 = val[i];
                    res[toCamel(name_1)] = val.getPropertyValue(name_1);
                }
                return res;
            }
            pdf._cloneStyle = _cloneStyle;
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            'use strict';
            /**
             * Represents arguments of the IFlexGridDrawSettings.formatItem callback.
             */
            var PdfFormatItemEventArgs = /** @class */ (function (_super) {
                __extends(PdfFormatItemEventArgs, _super);
                /**
                 * Initializes a new instance of the {@link PdfFormatItemEventArgs} class.
                 *
                 * @param p {@link GridPanel} that contains the range.
                 * @param rng Range of cells affected by the event.
                 * @param cell Element that represents the grid cell to be rendered.
                 * @param canvas Canvas to perform the custom painting on.
                 * @param clientRect    Object that represents the client rectangle of the grid cell to be rendered in canvas coordinates.
                 * @param contentRect Object that represents the content rectangle of the grid cell to be rendered in canvas coordinates.
                 * @param style Object that represents the style of the grid cell to be rendered.
                 * @param getFormattedCell Callback function that should return the grid cell when the getFormattedCell method is called.
                 * @param getTextRect Callback function that should return the text rectangle of the grid cell to be rendered in canvas coordinates.
                 */
                function PdfFormatItemEventArgs(p /*_IGridPanel*/, rng /*_ICellRange*/, cell, canvas, clientRect, contentRect, style, getFormattedCell, getTextRect) {
                    var _this = _super.call(this) || this;
                    /**
                     * Gets or sets a value that indicates that default cell borders drawing should be canceled.
                     */
                    _this.cancelBorders = false;
                    _this._p = p;
                    _this._rng = rng;
                    if (typeof (HTMLElement) !== 'undefined') {
                        _this._cell = wijmo.asType(cell, HTMLElement, true);
                    }
                    _this._canvas = canvas;
                    _this._clientRect = clientRect;
                    _this._contentRect = contentRect;
                    _this._style = style;
                    _this._getFormattedCell = getFormattedCell;
                    _this._getTextRect = getTextRect;
                    return _this;
                }
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "panel", {
                    /**
                     * Gets the {@link GridPanel} affected by this event.
                     */
                    get: function () {
                        return this._p;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "range", {
                    /**
                     * Gets the {@link CellRange} affected by this event.
                     */
                    get: function () {
                        return this._rng.clone();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "row", {
                    /**
                     * Gets the row affected by this event.
                     */
                    get: function () {
                        return this._rng.row;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "col", {
                    /**
                     * Gets the column affected by this event.
                     */
                    get: function () {
                        return this._rng.col;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "data", {
                    /**
                     * Gets or sets the data associated with the event.
                     */
                    get: function () {
                        return this._data;
                    },
                    set: function (value) {
                        this._data = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "canvas", {
                    /**
                     * Gets the canvas to perform the custom painting on.
                     */
                    get: function () {
                        return this._canvas;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "cell", {
                    /**
                     * Gets a reference to the element that represents the grid cell being rendered.
                     * If IFlexGridDrawSettings.customCellContent is set to true then contains
                     * reference to the element that represents the formatted grid cell; otherwise, a null value.
                     */
                    get: function () {
                        return this._cell;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "clientRect", {
                    /**
                     * Gets the client rectangle of the cell being rendered in canvas coordinates.
                     */
                    get: function () {
                        return this._clientRect;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "contentRect", {
                    /**
                     * Gets the content rectangle of the cell being rendered in canvas coordinates.
                     */
                    get: function () {
                        return this._contentRect;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Draws the background of the cell with the specified brush or color, or, if it is not specified, with the value of the {@link style.backgroundColor} property.
                 * @param brush The brush or color to use.
                 */
                PdfFormatItemEventArgs.prototype.drawBackground = function (brush) {
                    pdf._CellRenderer._drawBackground(this.canvas, this.clientRect, brush || this.style.backgroundColor);
                };
                /**
                 * Returns a reference to the element that represents the grid cell being rendered.
                 * This method is useful when export of custom formatting is disabled, but you need
                 * to export custom content for certain cells.
                 */
                PdfFormatItemEventArgs.prototype.getFormattedCell = function () {
                    return wijmo.asFunction(this._getFormattedCell)();
                };
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "style", {
                    /**
                     * Gets an object that represents the style of the cell being rendered.
                     * If IFlexGridDrawSettings.customCellContent is set to true then the style is inferred
                     * from the cell style; othwerwise it contains a combination of the IFlexGridDrawSettings.styles export
                     * setting, according to the row type of exported cell.
                     */
                    get: function () {
                        return this._style;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfFormatItemEventArgs.prototype, "textTop", {
                    /**
                     * Gets the value that represents the top position of the text of the cell being rendered in canvas coordinates.
                     */
                    get: function () {
                        if (!this._textRect && wijmo.isFunction(this._getTextRect)) {
                            this._textRect = this._getTextRect();
                        }
                        return this._textRect ? this._textRect.top : this._contentRect.top;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PdfFormatItemEventArgs;
            }(/*wijmo.grid.CellRangeEventArgs*/ wijmo.CancelEventArgs));
            pdf.PdfFormatItemEventArgs = PdfFormatItemEventArgs;
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var pdf;
        (function (pdf) {
            'use strict';
            /**
             * Provides a functionality to export the {@link FlexGrid} to PDF.
             */
            var _FlexGridPdfCoreConverter = /** @class */ (function () {
                function _FlexGridPdfCoreConverter() {
                }
                /**
                 * Draws the {@link FlexGrid} to an existing {@link PdfDocument} instance at the
                 * specified coordinates.
                 *
                 * If width is not specified, then grid will be rendered in actual size
                 * without any page breaks.
                 * If height is not specified, then grid will be scaled to fit the width
                 * without any page breaks.
                 * If both, width and height are determined, then grid will be scaled to fit
                 * the specified rectangle without any page breaks.
                 *
                 * <pre>
                 * var doc = new wijmo.pdf.PdfDocument({
                 *    ended: function (sender, args) {
                 *       wijmo.pdf.saveBlob(args.blob, 'FlexGrid.pdf');
                 *    }
                 * });
                 *
                 * wijmo.grid.pdf.FlexGridPdfConverter.drawToPosition(grid, doc, new wijmo.Point(0, 0), null, null, {
                 *    maxPages: 10,
                 *    styles: {
                 *       cellStyle: {
                 *          backgroundColor: '#ffffff',
                 *          borderColor: '#c6c6c6'
                 *       },
                 *       headerCellStyle: {
                 *          backgroundColor: '#eaeaea'
                 *       }
                 *    }
                 * });
                 * </pre>
                 *
                 * @param flex The {@link FlexGrid} instance to export.
                 * @param doc The {@link PdfDocument} instance to draw in.
                 * @param point The position to draw at, in points.
                 * @param width The width of the drawing area in points.
                 * @param height The height of the drawing area in points.
                 * @param settings The draw settings.
                 */
                _FlexGridPdfCoreConverter.draw = function (flex, doc, point, width, height, settings) {
                    wijmo.assert(!!flex, 'The flex argument cannot be null.');
                    wijmo.assert(!!doc, 'The doc argument cannot be null.');
                    settings = this._applyDefaultDrawSettings(settings);
                    if (settings.scaleMode == null) { // Settings came from the draw/drawToPosition function.
                        if (width == null) {
                            settings.scaleMode = pdf.ScaleMode.ActualSize;
                        }
                        else {
                            settings.scaleMode = height == null ? pdf.ScaleMode.PageWidth : pdf.ScaleMode.SinglePage;
                        }
                    }
                    this._drawInternal(flex, doc, point, width, height, settings);
                };
                // Clones and applies defaults.
                _FlexGridPdfCoreConverter._applyDefaultDrawSettings = function (settings) {
                    return pdf._merge(pdf._merge({}, settings), _FlexGridPdfCoreConverter.DefaultDrawSettings);
                };
                _FlexGridPdfCoreConverter._drawInternal = function (flex, doc, point, width, height, settings) {
                    var isPositionedMode = point != null, clSize = new wijmo.Size(doc.width, doc.height);
                    if (!point) {
                        point = new wijmo.Point(0, doc.y);
                        //point = new Point(doc.x, doc.y); // use current position
                    }
                    if (wijmo.isArray(settings.embeddedFonts)) {
                        settings.embeddedFonts.forEach(function (font) {
                            doc.registerFont(font);
                        });
                    }
                    // ** initialize
                    var range = this._getRowsToRender(flex, settings), gr = new FlexGridRenderer(flex, settings, range, this.BorderWidth, true), rect = new wijmo.Rect(point.x || 0, point.y || 0, width || clSize.width, height || clSize.height), scaleFactor = this._getScaleFactor(gr, settings.scaleMode, rect);
                    // TFS 472062
                    // If grid is not drawn from the top of the page and row breaks are allowed then check if the header + first data row fit the height.
                    // If not, then start drawing from a new page.
                    if (point.y > 0 && this._canBreakRows(settings.scaleMode)) {
                        var row = range.find(flex.cells, function (row) { return gr.isRenderableRow(row); });
                        if (row) {
                            var avlHeight = (rect.height - rect.top) * (1 / scaleFactor), hdrHeight = gr.showColumnHeader ? wijmo.pdf.pxToPt(flex.columnHeaders.height) : 0, rowHeight = wijmo.pdf.pxToPt(row.renderHeight);
                            if (hdrHeight + rowHeight - this.BorderWidth > avlHeight) { // Doesn't fit? Let's start at the beginning of a new page then.
                                doc.addPage();
                                rect = new wijmo.Rect(point.x || 0, 0, width || clSize.width, height || clSize.height);
                            }
                        }
                    }
                    var pages = this._getPages(gr, range, rect, settings, isPositionedMode, scaleFactor);
                    // ** initialize progress stuff
                    var cellsCount = !settings.progress ? 0 : this._getCellsCount(flex, settings, pages), step = cellsCount / settings._progressMax, progress = 0, // [0.._progressMax]
                    cellIdx = 0, // current cell index
                    cellIdxLast = 0, // last cell when an event was triggered
                    onProgress = !settings.progress
                        ? null
                        : function () {
                            if (++cellIdx - cellIdxLast >= 50) { // trigger the event every 50 cells.
                                cellIdxLast = cellIdx;
                                settings.progress(cellIdx / step);
                            }
                        };
                    // inform that the operation has just begun.
                    if (settings.progress) {
                        settings.progress(0);
                    }
                    // ** render
                    for (var i = 0; i < pages.length; i++) {
                        if (i > 0) { // PDFKit adds first page automatically
                            doc.addPage();
                        }
                        var page = pages[i], x = page.pageCol === 0 ? rect.left : 0, y = page.pageRow === 0 ? rect.top : 0;
                        doc.saveState();
                        //doc.paths.rect(0, 0, clSize.width, clSize.height).clip(); -- buggy, doesn't take ctm into account.
                        doc.paths.rect(0, 0, doc._widthCtm, doc._heightCtm).clip();
                        doc.scale(scaleFactor, scaleFactor, new wijmo.Point(x, y));
                        doc.translate(x, y);
                        var gridPage = new FlexGridRenderer(flex, settings, page.range, this.BorderWidth, i === pages.length - 1);
                        gridPage.render(doc, onProgress);
                        doc.restoreState();
                        // move document cursor to the grid's left bottom corner.
                        doc.x = x;
                        doc.y = y + gridPage.renderSize.height * scaleFactor;
                    }
                    // inform that the operation has completed.
                    if (settings.progress && (progress < settings._progressMax)) {
                        settings.progress(settings._progressMax);
                    }
                };
                _FlexGridPdfCoreConverter._getCellsCount = function (flex, settings, pages) {
                    var result = 0;
                    for (var i = 0; i < pages.length; i++) {
                        var pageRenderer = new FlexGridRenderer(flex, settings, pages[i].range, 0, false);
                        result += pageRenderer.getCellsCount();
                    }
                    return result;
                };
                _FlexGridPdfCoreConverter._getRowsToRender = function (flex, settings) {
                    var ranges = [];
                    if (settings.exportMode == pdf.ExportMode.All) {
                        ranges.push(new _CellRange(0, 0, flex.rows.length - 1, flex.columns.length - 1)); // row\row2 can be negative if flex.cells contains no rows
                    }
                    else {
                        ranges = flex.getSelection();
                    }
                    var result = new RowRange(ranges);
                    if (result.isValid && !settings.drawDetailRows) { // exclude detail rows
                        var newRanges = [];
                        result.forEach(flex.cells, function (row, range, rowIdx) {
                            if (!flex.isDetailRow(row)) {
                                var len = newRanges.length;
                                if (len && (newRanges[len - 1].bottomRow + 1 === rowIdx)) {
                                    newRanges[len - 1].row2++; // this is a continuation of the same range, just expand it.
                                }
                                else { // no ranges, or delta > 1; start a new range
                                    newRanges.push(new _CellRange(rowIdx, range.col, rowIdx, range.col2));
                                }
                            }
                        });
                        result = new RowRange(newRanges);
                    }
                    return result;
                };
                _FlexGridPdfCoreConverter._getScaleFactor = function (gr, scaleMode, rect) {
                    var factor = 1;
                    if (scaleMode == pdf.ScaleMode.ActualSize) {
                        return factor;
                    }
                    var size = gr.renderSize;
                    if (scaleMode == pdf.ScaleMode.SinglePage) {
                        var f = Math.min(rect.width / size.width, rect.height / size.height);
                        if (f < 1) {
                            factor = f;
                        }
                    }
                    else { // pageWidth
                        var f = rect.width / size.width;
                        if (f < 1) {
                            factor = f;
                        }
                    }
                    return factor;
                };
                _FlexGridPdfCoreConverter._canBreakRows = function (mode) {
                    return mode == pdf.ScaleMode.ActualSize || mode == pdf.ScaleMode.PageWidth;
                };
                _FlexGridPdfCoreConverter._getPages = function (gr, ranges, rect, settings, isPositionedMode, scaleFactor) {
                    var _this = this;
                    var rowBreaks = [], colBreaks = [], p2u = wijmo.pdf.pxToPt, flex = gr.flex, showColumnHeader = gr.showColumnHeader, showColumnFooter = gr.showColumnFooter, showRowHeader = gr.showRowHeader, colHeaderHeight = showColumnHeader ? p2u(flex.columnHeaders.height) : 0, colFooterHeight = showColumnFooter ? p2u(flex.columnFooters.height) : 0, rowHeaderWidth = showRowHeader ? p2u(flex.rowHeaders.width) : 0, breakRows = this._canBreakRows(settings.scaleMode), breakColumns = settings.scaleMode == pdf.ScaleMode.ActualSize, zeroColWidth = (rect.width - rect.left) * (1 / scaleFactor), // the width of the leftmost grids
                    zeroRowHeight = (rect.height - rect.top) * (1 / scaleFactor), // the height of the topmost grids
                    rectWidth = rect.width * (1 / scaleFactor), rectHeight = rect.height * (1 / scaleFactor), totalHeight = colHeaderHeight, totalWidth = rowHeaderWidth, 
                    // Normally in ActualSize mode we are inserting page breaks before partially visible columns\ rows to display them completely.
                    // But there is no page breaks in positioned mode, so we need to omit this to fit the maximum amount of content in a drawing area.
                    dontBreakBeforePartiallyVisibleElements = isPositionedMode && (settings.scaleMode == pdf.ScaleMode.ActualSize), curRenderAreaHeight = zeroRowHeight;
                    if (breakRows) {
                        var visibleRowsCnt_1 = 0, rpIdx_1 = 0; // the current row's index within the current page
                        ranges.forEach(flex.cells, function (row, rng, rIdx, sIdx) {
                            curRenderAreaHeight = rowBreaks.length ? rectHeight : zeroRowHeight;
                            if (gr.isRenderableRow(row)) {
                                var rowHeight = p2u(row.renderHeight);
                                visibleRowsCnt_1++;
                                totalHeight += rowHeight;
                                if (showColumnHeader || visibleRowsCnt_1 > 1) {
                                    totalHeight -= _this.BorderWidth; // border collapse
                                }
                                // We exceeding the bottom boundary.
                                if (totalHeight > curRenderAreaHeight) {
                                    if (dontBreakBeforePartiallyVisibleElements ||
                                        // The current row will exceed the bottom boundary even if we put it on a new page.
                                        (colHeaderHeight + rowHeight > curRenderAreaHeight && rpIdx_1 === 0)) {
                                        // Break rows after the current row. The current row remains on the current page, the next row will start on a new page.
                                        rowBreaks.push(sIdx);
                                        totalHeight = colHeaderHeight;
                                    }
                                    else {
                                        // Break rows before the current row. The current row will start on a new page.
                                        rowBreaks.push(sIdx - 1);
                                        totalHeight = colHeaderHeight + rowHeight;
                                    }
                                    rpIdx_1 = 0;
                                    if (showColumnHeader) {
                                        totalHeight -= _this.BorderWidth; // border collapse
                                    }
                                }
                                else {
                                    rpIdx_1++;
                                }
                            }
                        });
                    }
                    var last = Math.max(ranges.length() - 1, 0);
                    if (!rowBreaks.length || (rowBreaks[rowBreaks.length - 1] !== last)) {
                        rowBreaks.push(last);
                    }
                    if (showColumnFooter && (totalHeight + colFooterHeight > curRenderAreaHeight)) {
                        // Force to add a new page (no data rows, just header and footer) if footer doesn't fit the area.
                        rowBreaks.push(-1);
                    }
                    if (breakColumns) {
                        var visibleColumnsCnt = 0;
                        for (var i = ranges.leftCol; i <= ranges.rightCol; i++) {
                            var col = flex.columns[i];
                            if (gr.isRenderableColumn(col)) {
                                var colWidth = p2u(col.renderWidth), renderAreaWidth = colBreaks.length ? rectWidth : zeroColWidth;
                                visibleColumnsCnt++;
                                totalWidth += colWidth;
                                if (showRowHeader || visibleColumnsCnt > 1) {
                                    totalWidth -= this.BorderWidth; // border collapse
                                }
                                if (totalWidth > renderAreaWidth) {
                                    if (rowHeaderWidth + colWidth > renderAreaWidth || dontBreakBeforePartiallyVisibleElements) { // current columns is too big, break on it
                                        colBreaks.push(i);
                                        totalWidth = rowHeaderWidth;
                                    }
                                    else { // break on previous column
                                        colBreaks.push(i - 1);
                                        totalWidth = rowHeaderWidth + colWidth;
                                    }
                                    if (showRowHeader) {
                                        totalWidth -= this.BorderWidth; // border collapse
                                    }
                                }
                            }
                        }
                    }
                    if (!colBreaks.length || (colBreaks[colBreaks.length - 1] !== ranges.rightCol)) {
                        colBreaks.push(ranges.rightCol);
                    }
                    var pages = [], flag = false, pageCount = 1, maxPages = isPositionedMode && (settings.maxPages > 0) ? 1 : settings.maxPages;
                    for (var i = 0; i < rowBreaks.length && !flag; i++) {
                        for (var j = 0; j < colBreaks.length && !flag; j++, pageCount++) {
                            if (!(flag = pageCount > maxPages)) {
                                var r = i === 0 ? 0 : rowBreaks[i - 1] + 1, c = j === 0 ? ranges.leftCol : colBreaks[j - 1] + 1;
                                var rowRange = (rowBreaks[i] === -1)
                                    ? new RowRange([new _CellRange(-1, c, -1, colBreaks[j])]) // special case - an empty page, no data rows, just header and footer.
                                    : ranges.subrange(r, rowBreaks[i] - r + 1, c, colBreaks[j]);
                                pages.push(new PdfPageRowRange(rowRange, j, i));
                            }
                        }
                    }
                    return pages;
                };
                _FlexGridPdfCoreConverter.BorderWidth = 1; // pt, hardcoded because of border collapsing.
                _FlexGridPdfCoreConverter.DefFont = new wijmo.pdf.PdfFont();
                _FlexGridPdfCoreConverter.DefaultDrawSettings = {
                    customCellContent: false,
                    drawDetailRows: false,
                    exportMode: pdf.ExportMode.All,
                    maxPages: Number.MAX_VALUE,
                    repeatMergedValuesAcrossPages: true,
                    recalculateStarWidths: true,
                    styles: {
                        cellStyle: {
                            font: {
                                family: _FlexGridPdfCoreConverter.DefFont.family,
                                size: _FlexGridPdfCoreConverter.DefFont.size,
                                style: _FlexGridPdfCoreConverter.DefFont.style,
                                weight: _FlexGridPdfCoreConverter.DefFont.weight
                            },
                            padding: 1.5,
                            verticalAlign: 'middle'
                        },
                        headerCellStyle: {
                            font: { weight: 'bold' } // Don't use PdfFont. It's necessary to specify exclusive properties only, no default values (in order to merge cell styles properly).
                        }
                    },
                    quickCellStyles: true,
                    _progressMax: 1 // 100%
                };
                return _FlexGridPdfCoreConverter;
            }());
            pdf._FlexGridPdfCoreConverter = _FlexGridPdfCoreConverter;
            var FlexGridRenderer = /** @class */ (function () {
                function FlexGridRenderer(flex, settings, range, borderWidth, lastPage) {
                    this._flex = flex;
                    this._borderWidth = borderWidth;
                    this._lastPage = lastPage;
                    this._settings = settings || {};
                    this._topLeft = new PanelSectionRenderer(this, flex.topLeftCells, this.showRowHeader && this.showColumnHeader
                        ? new RowRange([new _CellRange(0, 0, flex.topLeftCells.rows.length - 1, flex.topLeftCells.columns.length - 1)])
                        : new RowRange([]), borderWidth);
                    this._rowHeader = new PanelSectionRenderer(this, flex.rowHeaders, this.showRowHeader
                        ? range.clone(0, flex.rowHeaders.columns.length - 1)
                        : new RowRange([]), borderWidth);
                    this._columnHeader = new PanelSectionRenderer(this, flex.columnHeaders, this.showColumnHeader
                        ? new RowRange([new _CellRange(0, range.leftCol, flex.columnHeaders.rows.length - 1, range.rightCol)])
                        : new RowRange([]), borderWidth);
                    this._cells = new PanelSectionRenderer(this, flex.cells, range, borderWidth);
                    this._bottomLeft = new PanelSectionRenderer(this, flex.bottomLeftCells, this.showRowHeader && this.showColumnFooter
                        ? new RowRange([new _CellRange(0, 0, flex.bottomLeftCells.rows.length - 1, flex.bottomLeftCells.columns.length - 1)])
                        : new RowRange([]), borderWidth);
                    this._columnFooter = new PanelSectionRenderer(this, flex.columnFooters, this.showColumnFooter
                        ? new RowRange([new _CellRange(0, range.leftCol, flex.columnFooters.rows.length - 1, range.rightCol)])
                        : new RowRange([]), borderWidth);
                }
                Object.defineProperty(FlexGridRenderer.prototype, "settings", {
                    get: function () {
                        return this._settings;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridRenderer.prototype.isRenderableRow = function (row) {
                    return this._flex.isRenderableRow(row);
                };
                FlexGridRenderer.prototype.isRenderableColumn = function (col) {
                    return this._flex.isRenderableColumn(col);
                };
                FlexGridRenderer.prototype.getCellsCount = function () {
                    return this._topLeft.getCellsCount() +
                        this._rowHeader.getCellsCount() +
                        this._columnHeader.getCellsCount() +
                        this._cells.getCellsCount() +
                        this._bottomLeft.getCellsCount() +
                        this._columnFooter.getCellsCount();
                };
                FlexGridRenderer.prototype.render = function (doc, cellRendered) {
                    var offsetX = Math.max(0, Math.max(this._topLeft.renderSize.width, this._rowHeader.renderSize.width) - this._borderWidth), // left section width
                    offsetY = Math.max(0, Math.max(this._topLeft.renderSize.height, this._columnHeader.renderSize.height) - this._borderWidth); // top section height
                    this._topLeft.render(doc, 0, 0, cellRendered);
                    this._rowHeader.render(doc, 0, offsetY, cellRendered);
                    this._columnHeader.render(doc, offsetX, 0, cellRendered);
                    this._cells.render(doc, offsetX, offsetY, cellRendered);
                    offsetY += Math.max(0, this._cells.renderSize.height - this._borderWidth);
                    this._bottomLeft.render(doc, 0, offsetY, cellRendered);
                    this._columnFooter.render(doc, offsetX, offsetY, cellRendered);
                };
                Object.defineProperty(FlexGridRenderer.prototype, "flex", {
                    get: function () {
                        return this._flex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridRenderer.prototype, "renderSize", {
                    get: function () {
                        var height = Math.max(this._topLeft.renderSize.height, this._columnHeader.renderSize.height) // top section height
                            + Math.max(this._rowHeader.renderSize.height, this._cells.renderSize.height) // middle section height
                            + Math.max(this._bottomLeft.renderSize.height, this._columnFooter.renderSize.height), // bottom section height
                        width = Math.max(this._topLeft.renderSize.width, this._rowHeader.renderSize.width) // left section width
                            + Math.max(this._columnHeader.renderSize.width, this._cells.renderSize.width); // right section width
                        if (this._columnHeader.renderableRowsCount > 0) {
                            height -= this._borderWidth;
                        }
                        if (this._columnFooter.renderableRowsCount > 0) {
                            height -= this._borderWidth;
                        }
                        if (this._rowHeader.renderableColumnsCount > 0) {
                            width -= this._borderWidth;
                        }
                        return new wijmo.Size(width, height);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridRenderer.prototype, "showColumnHeader", {
                    get: function () {
                        return this._flex.showColumnHeader;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridRenderer.prototype, "showRowHeader", {
                    get: function () {
                        return this._flex.showRowHeader;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridRenderer.prototype, "showColumnFooter", {
                    get: function () {
                        return this._lastPage && this._flex.showColumnFooter;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridRenderer.prototype.alignMergedTextToTheTopRow = function (panel) {
                    return this._flex.alignMergedTextToTheTopRow(panel);
                };
                FlexGridRenderer.prototype.getColumn = function (panel, row, col) {
                    return this._flex.getColumn(panel, row, col);
                };
                FlexGridRenderer.prototype.isAlternatingRow = function (row) {
                    return this._flex.isAlternatingRow(row);
                };
                FlexGridRenderer.prototype.isGroupRow = function (row) {
                    return this._flex.isGroupRow(row);
                };
                FlexGridRenderer.prototype.isNewRow = function (row) {
                    return this._flex.isNewRow(row);
                };
                FlexGridRenderer.prototype.isExpandableGroupRow = function (row) {
                    return this._flex.isExpandableGroupRow(row);
                };
                FlexGridRenderer.prototype.isBooleanCell = function (panel, row, col) {
                    return this._flex.isBooleanCell(panel, row, col);
                };
                FlexGridRenderer.prototype.getCellStyle = function (panel, row, col) {
                    return this._flex.getCellStyle(panel, row, col);
                };
                return FlexGridRenderer;
            }());
            var PanelSection = /** @class */ (function () {
                function PanelSection(flex, panel, range) {
                    this._flex = flex;
                    this._panel = panel;
                    this._range = range.clone();
                }
                Object.defineProperty(PanelSection.prototype, "renderableRowsCount", {
                    get: function () {
                        var _this = this;
                        if (this._renderableRowsCnt == null) {
                            this._renderableRowsCnt = 0;
                            this._range.forEach(this._panel, function (row) {
                                if (_this._flex.isRenderableRow(row)) {
                                    _this._renderableRowsCnt++;
                                }
                            });
                        }
                        return this._renderableRowsCnt;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PanelSection.prototype, "renderableColumnsCount", {
                    get: function () {
                        if (this._renderableColumnsCnt == null) {
                            this._renderableColumnsCnt = 0;
                            if (this._range.isValid) {
                                for (var i = this._range.leftCol; i <= this._range.rightCol; i++) {
                                    if (this._flex.isRenderableColumn(this._panel.columns[i])) {
                                        this._renderableColumnsCnt++;
                                    }
                                }
                            }
                        }
                        return this._renderableColumnsCnt;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PanelSection.prototype, "size", {
                    // pt units
                    get: function () {
                        if (this._size == null) {
                            var sz = this._range.getRenderSize(this._flex, this._panel);
                            this._size = new wijmo.Size(wijmo.pdf.pxToPt(sz.width), wijmo.pdf.pxToPt(sz.height));
                        }
                        return this._size;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PanelSection.prototype, "range", {
                    get: function () {
                        return this._range;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PanelSection.prototype, "panel", {
                    get: function () {
                        return this._panel;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PanelSection;
            }());
            var PanelSectionRenderer = /** @class */ (function (_super) {
                __extends(PanelSectionRenderer, _super);
                function PanelSectionRenderer(gr, panel, range, borderWidth) {
                    var _this = _super.call(this, gr.flex, panel, range) || this;
                    _this._gr = gr;
                    _this._borderWidth = borderWidth;
                    return _this;
                }
                Object.defineProperty(PanelSectionRenderer.prototype, "gr", {
                    get: function () {
                        return this._gr;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PanelSectionRenderer.prototype, "renderSize", {
                    // pt units
                    get: function () {
                        if (this._renderSize == null) {
                            this._renderSize = this.size.clone();
                            if (this.renderableColumnsCount > 1) {
                                this._renderSize.width -= this._borderWidth * (this.renderableColumnsCount - 1);
                            }
                            if (this.renderableRowsCount > 1) {
                                this._renderSize.height -= this._borderWidth * (this.renderableRowsCount - 1);
                            }
                        }
                        return this._renderSize;
                    },
                    enumerable: true,
                    configurable: true
                });
                PanelSectionRenderer.prototype.getRangeWidth = function (leftCol, rightCol) {
                    var width = 0, visibleColumns = 0, pnl = this.panel;
                    for (var i = leftCol; i <= rightCol; i++) {
                        var col = pnl.columns[i];
                        if (this._gr.isRenderableColumn(col)) {
                            visibleColumns++;
                            width += col.renderWidth;
                        }
                    }
                    width = wijmo.pdf.pxToPt(width);
                    if (visibleColumns > 1) {
                        width -= this._borderWidth * (visibleColumns - 1);
                    }
                    return width;
                };
                PanelSectionRenderer.prototype.getRangeHeight = function (topRow, bottomRow) {
                    var height = 0, visibleRows = 0, pnl = this.panel;
                    for (var i = topRow; i <= bottomRow; i++) {
                        var row = pnl.rows[i];
                        if (this._gr.isRenderableRow(row)) {
                            visibleRows++;
                            height += row.renderHeight;
                        }
                    }
                    height = wijmo.pdf.pxToPt(height);
                    if (visibleRows > 1) {
                        height = height - this._borderWidth * (visibleRows - 1);
                    }
                    return height;
                };
                //// Returns the number of cells without taking into account the merged ones.
                //public getCellsCountRaw() {
                //    return this.visibleColumns * this.visibleRows;
                //}
                // Important! When changing, synchronize the cells detection code with render()
                PanelSectionRenderer.prototype.getCellsCount = function () {
                    var _this = this;
                    var result = 0, ranges = this.range, pnl = this.panel, mngr = new GetMergedRangeProxy(this._gr.flex);
                    if (!ranges.isValid) {
                        return result;
                    }
                    ranges.forEach(pnl, function (row, rng, r) {
                        if (!_this._gr.isRenderableRow(row)) {
                            return;
                        }
                        for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                            if (!_this._gr.isRenderableColumn(pnl.columns[c])) { // a regular column
                                continue;
                            }
                            var needRender = false, skipC = undefined, mergedRng = mngr.getMergedRange(pnl, r, c);
                            if (mergedRng) {
                                var veryFirstRow = r === mergedRng.firstVisibleRow, // the very first row of a merged range
                                veryFirstCol = c === mergedRng.leftCol, // the very first column of a merged range
                                firstRow = r === rng.topRow, // the first row of a range spreaded between multiple pages
                                firstCol = c === rng.leftCol, // the first column of a range spreaded between multiple pages
                                rc = mergedRng.rowSpan > 1, cs = mergedRng.columnSpan > 1;
                                if ((rc && cs && ((veryFirstRow && veryFirstCol) || (firstRow && firstCol))) ||
                                    (rc && !cs && (veryFirstRow || firstRow)) ||
                                    (!rc && cs && (veryFirstCol || firstCol))) {
                                    needRender = true;
                                    if (cs) {
                                        // skip absorbed cells until the end of the merged range or page (which comes first)
                                        skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
                                    }
                                }
                            }
                            else {
                                needRender = true;
                            }
                            if (needRender) {
                                result++;
                            }
                            if (skipC) {
                                c = skipC;
                            }
                        }
                    });
                    return result;
                };
                // Important! When changing, synchronize the cells detection code with getCellsCount().
                PanelSectionRenderer.prototype.render = function (doc, x, y, cellRendered) {
                    var _this = this;
                    var ranges = this.range;
                    if (!ranges.isValid) {
                        return;
                    }
                    var pY = {}, // tracks the current Y position for each column
                    pnl = this.panel, mngr = new GetMergedRangeProxy(this._gr.flex), curCellRange = new _CellRangeExt(pnl, 0, 0, 0, 0), cellRenderer = new _CellRenderer(this, doc, this._borderWidth);
                    for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                        pY[c] = y;
                    }
                    ranges.forEach(pnl, function (row, rng, r) {
                        if (!_this._gr.isRenderableRow(row)) {
                            return;
                        }
                        var pX = x;
                        for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                            var col = _this.gr.getColumn(pnl, r, c);
                            if (!_this._gr.isRenderableColumn(col)) { // #362720
                                continue;
                            }
                            var height = undefined, width = undefined, value, needRender = false, skipC = undefined, cellValue = _this._gr.flex.getCellContent(_this.panel, row, col, c), mergedRng = mngr.getMergedRange(pnl, r, c);
                            if (mergedRng) {
                                //wijmo.assert(!mergedRng.isSingleCell, 'The merged range is expected.');
                                curCellRange.copyFrom(mergedRng);
                                var veryFirstRow = r === mergedRng.firstVisibleRow, // the very first row of a merged range
                                veryFirstCol = c === mergedRng.leftCol, // the very first column of a merged range
                                firstRow = r === rng.topRow, // the first row of a range spreaded between multiple pages
                                firstCol = c === rng.leftCol, // the first column of a range spreaded between multiple pages
                                rc = mergedRng.rowSpan > 1, cs = mergedRng.columnSpan > 1;
                                if ((rc && cs && ((veryFirstRow && veryFirstCol) || (firstRow && firstCol))) ||
                                    (rc && !cs && (veryFirstRow || firstRow)) ||
                                    (!rc && cs && (veryFirstCol || firstCol))) {
                                    needRender = true;
                                    value = (veryFirstRow && veryFirstCol) || _this.gr.settings.repeatMergedValuesAcrossPages ? cellValue : '';
                                    height = rc
                                        ? _this.getRangeHeight(r, Math.min(mergedRng.bottomRow, rng.bottomRow))
                                        : _this.getRangeHeight(r, r);
                                    if (cs) {
                                        width = _this.getRangeWidth(Math.max(ranges.leftCol, mergedRng.leftCol), Math.min(ranges.rightCol, mergedRng.rightCol));
                                        // skip absorbed cells until the end of the merged range or page (which comes first)
                                        skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
                                        for (var t = c + 1; t <= skipC; t++) {
                                            pY[t] += height - _this._borderWidth; // collapse borders
                                        }
                                    }
                                }
                                if (width == null) { // a cell absorbed by the vertical merging
                                    width = _this.getRangeWidth(c, c);
                                }
                            }
                            else { // an ordinary cell
                                curCellRange.setRange(r, c, r, c);
                                needRender = true;
                                value = cellValue;
                                height = _this.getRangeHeight(r, r);
                                width = _this.getRangeWidth(c, c);
                            }
                            if (needRender && width > 0 && height > 0) {
                                cellRenderer.renderCell(value, row, col, curCellRange, new wijmo.Rect(pX, pY[c], width, height));
                                if (cellRendered) {
                                    cellRendered();
                                }
                            }
                            if (height) {
                                pY[c] += height - _this._borderWidth; // collapse borders
                            }
                            if (width) {
                                pX += width - _this._borderWidth; // collapse borders
                            }
                            if (skipC) {
                                c = skipC;
                            }
                        }
                    });
                };
                return PanelSectionRenderer;
            }(PanelSection));
            var _CellRenderer = /** @class */ (function () {
                function _CellRenderer(panelRenderer, area, borderWidth) {
                    this._pr = panelRenderer;
                    this._area = area;
                    this._borderWidth = borderWidth;
                }
                _CellRenderer._drawBackground = function (area, clientRect, brush) {
                    if (brush && clientRect.width > 0 && clientRect.height > 0) {
                        area.paths
                            .rect(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
                            .fill(brush);
                    }
                };
                _CellRenderer.prototype.renderCell = function (value, row, column, rng, r) {
                    var _this = this;
                    var formatEventArgs, grid = this._pr.gr.flex, panel = this._pr.panel, getGridCell = function (updateContent) {
                        return grid.getCell(panel, rng.topRow, rng.leftCol, updateContent);
                    }, gridCell = null, style = this._pr.gr.getCellStyle(panel, row, column), customContent = this._pr.gr.settings.customCellContent, hasFormatItem = wijmo.isFunction(this._pr.gr.settings.formatItem);
                    if (customContent) {
                        var css = grid.getComputedStyle(panel, gridCell = getGridCell(hasFormatItem));
                        // change the exported (public) properties only
                        style.color = css.color;
                        style.backgroundColor = css.backgroundColor;
                        //style.borderColor = css.borderRightColor || css.borderBottomColor || css.borderLeftColor || css.borderTopColor; // || css.borderColor -- borderColor is a computed property
                        // Use individual borders for each side of a cell (431292, case 2)
                        var defColor = grid.getComputedDefBorderColor();
                        style.borderLeftColor = css.borderLeftStyle != 'none' ? css.borderLeftColor : defColor;
                        style.borderRightColor = css.borderRightStyle != 'none' ? css.borderRightColor : defColor;
                        style.borderTopColor = css.borderTopStyle != 'none' ? css.borderTopColor : defColor;
                        style.borderBottomColor = css.borderBottomStyle != 'none' ? css.borderBottomColor : defColor;
                        style.font = new wijmo.pdf.PdfFont(css.fontFamily, wijmo.pdf._asPt(css.fontSize, true, undefined), css.fontStyle, css.fontWeight);
                        style.textAlign = css.textAlign;
                    }
                    if (style.font && !(style.font instanceof wijmo.pdf.PdfFont)) {
                        var fnt = style.font;
                        style.font = new wijmo.pdf.PdfFont(fnt.family, fnt.size, fnt.style, fnt.weight);
                    }
                    // hard-coded border styles
                    style.boxSizing = 'border-box';
                    style.borderWidth = this._borderWidth;
                    style.borderStyle = 'solid';
                    // horizontal alignment
                    //if (!style.textAlign && !(grid.isGroupRow(row) && !column.aggregate)) {
                    if (!customContent && !(this._pr.gr.isExpandableGroupRow(row) && column.visibleIndex === 0)) { // && panel.columns.firstVisibleIndex === column.visibleIndex
                        style.textAlign = column.getAlignment(row);
                    }
                    // add indent
                    if (panel.cellType === pdf._CellType.Cell && grid.rows.maxGroupLevel >= 0 && rng.leftCol === grid.columns.firstVisibleIndex) {
                        var level = grid.isGroupRow(row)
                            ? Math.max(row.level, 0) // group row cell
                            : grid.rows.maxGroupLevel + 1; // data cell
                        var basePadding = wijmo.pdf._asPt(style.paddingLeft || style.padding), levelPadding = wijmo.pdf.pxToPt(level * grid.treeIndent);
                        style.paddingLeft = basePadding + levelPadding;
                    }
                    var m = this._measureCell(value, panel, row, column, style, r), alignToTopRow = (rng.rowSpan > 1) && (rng.visibleRowsCount > 1) && this._pr.gr.alignMergedTextToTheTopRow(panel);
                    var textContentRect = !alignToTopRow
                        ? m.contentRect
                        : new wijmo.Rect(m.contentRect.left, m.contentRect.top, m.contentRect.width, m.contentRect.height / (rng.visibleRowsCount || 1)); // the content rect of the top row.
                    if (hasFormatItem) {
                        formatEventArgs = new pdf.PdfFormatItemEventArgs(panel, rng, gridCell, this._area, m.rect, m.contentRect, style, function () { return gridCell || getGridCell(true); }, function () { return m.textRect = _this._calculateTextRect(value, panel, row, column, textContentRect, style); });
                        formatEventArgs.data = value;
                        this._pr.gr.settings.formatItem(formatEventArgs);
                        if (formatEventArgs.data !== value) {
                            value = wijmo.asString(formatEventArgs.data);
                            m.textRect = null; // value has been changed, recalculate
                        }
                    }
                    var renderContent = formatEventArgs ? !formatEventArgs.cancel : true, renderBorders = formatEventArgs ? !formatEventArgs.cancelBorders : true;
                    if (renderContent && !m.textRect) {
                        m.textRect = this._calculateTextRect(value, panel, row, column, textContentRect, style);
                    }
                    // // Force to draw only the first line of text.
                    //if (m.textRect) {
                    //    if (!(column.wordWrap || row.wordWrap || column.multiLine || row.multiLine || (customContent && gridCell.children.length /*contains text only*/))) {
                    //        m.textRect.height = this._getTextLineHeight(style.font);
                    //    }
                    //}
                    this._renderCell(value, row, column, rng, m, style, renderContent, renderBorders);
                };
                _CellRenderer.prototype._renderCell = function (value, row, column, rng, m, style, renderContent, renderBorders) {
                    if (!renderContent && !renderBorders) {
                        return;
                    }
                    this._renderEmptyCell(m, style, renderContent, renderBorders);
                    if (renderContent) {
                        if (this._isBooleanCellAndValue(value, this._pr.panel, row, column)) {
                            this._renderBooleanCell(value, m, style);
                        }
                        else {
                            this._renderTextCell(value, m, style);
                        }
                    }
                };
                _CellRenderer.prototype._isBooleanCellAndValue = function (value, panel, row, column) {
                    return this._pr.gr.isBooleanCell(panel, row, column) && this._isBoolean(value);
                };
                _CellRenderer.prototype._isBoolean = function (value) {
                    var lowerCase = wijmo.isString(value) && value.toLowerCase();
                    return lowerCase === 'true' || lowerCase === 'false' || value === true || value === false;
                };
                _CellRenderer.prototype._measureCell = function (value, panel, row, column, style, rect) {
                    this._decompositeStyle(style);
                    var x = rect.left, //  wijmo.pdf._asPt(style.left),
                    y = rect.top, // wijmo.pdf._asPt(style.top),
                    height = rect.height, // wijmo.pdf._asPt(style.height),
                    width = rect.width, // wijmo.pdf._asPt(style.width),
                    brd = this._parseBorder(style), blw = brd.left.width, btw = brd.top.width, bbw = brd.bottom.width, brw = brd.right.width, pad = this._parsePadding(style), 
                    // content + padding
                    clientHeight = 0, clientWidth = 0, 
                    // content
                    contentHeight = 0, contentWidth = 0;
                    // setup client and content dimensions depending on boxing model.
                    if (style.boxSizing === 'content-box' || style.boxSizing === undefined) {
                        clientHeight = pad.top + height + pad.bottom;
                        clientWidth = pad.left + width + pad.right;
                        contentHeight = height;
                        contentWidth = width;
                    }
                    else {
                        if (style.boxSizing === 'border-box') {
                            // Browsers are using different approaches to calculate style.width and style.heigth properties. While Chrome and Firefox returns the total size, IE returns the content size only.
                            if (wijmo.pdf._IE && (style instanceof CSSStyleDeclaration)) { // content size: max(0, specifiedSizeValue - (padding + border)). Make sure that this code path will not be executed for the human-generated style object.
                                clientHeight = pad.top + pad.bottom + height;
                                clientWidth = pad.left + pad.right + width;
                            }
                            else { // total size: Max(specifiedSizeValue, padding + border)
                                clientHeight = Math.max(height - btw - bbw, 0);
                                clientWidth = Math.max(width - blw - brw, 0);
                            }
                        }
                        else {
                            // padding-box? It is supported by Mozilla only.
                            throw 'Invalid value: ' + style.boxSizing;
                        }
                        contentHeight = Math.max(clientHeight - pad.top - pad.bottom, 0);
                        contentWidth = Math.max(clientWidth - pad.left - pad.right, 0);
                    }
                    var rect = new wijmo.Rect(x, y, width, height), clientRect = new wijmo.Rect(x + blw, y + btw, clientWidth, clientHeight), // rect - borders
                    contentRect = new wijmo.Rect(x + blw + pad.left, y + btw + pad.top, contentWidth, contentHeight); // rect - borders - padding
                    return {
                        rect: rect,
                        clientRect: clientRect,
                        contentRect: contentRect,
                        textRect: null // calculate on demand
                    };
                };
                //    Decomposites some properties to handle the situation when the style was created manually.
                _CellRenderer.prototype._decompositeStyle = function (style) {
                    if (style) {
                        var val;
                        if (val = style.borderColor) {
                            // honor single properties
                            if (!style.borderLeftColor) {
                                style.borderLeftColor = val;
                            }
                            if (!style.borderRightColor) {
                                style.borderRightColor = val;
                            }
                            if (!style.borderTopColor) {
                                style.borderTopColor = val;
                            }
                            if (!style.borderBottomColor) {
                                style.borderBottomColor = val;
                            }
                        }
                        if (val = style.borderWidth) {
                            // honor single properties
                            if (!style.borderLeftWidth) {
                                style.borderLeftWidth = val;
                            }
                            if (!style.borderRightWidth) {
                                style.borderRightWidth = val;
                            }
                            if (!style.borderTopWidth) {
                                style.borderTopWidth = val;
                            }
                            if (!style.borderBottomWidth) {
                                style.borderBottomWidth = val;
                            }
                        }
                        if (val = style.borderStyle) {
                            // honor single properties
                            if (!style.borderLeftStyle) {
                                style.borderLeftStyle = val;
                            }
                            if (!style.borderRightStyle) {
                                style.borderRightStyle = val;
                            }
                            if (!style.borderTopStyle) {
                                style.borderTopStyle = val;
                            }
                            if (!style.borderBottomStyle) {
                                style.borderBottomStyle = val;
                            }
                        }
                        if (val = style.padding) {
                            // honor single properties
                            if (!style.paddingLeft) {
                                style.paddingLeft = val;
                            }
                            if (!style.paddingRight) {
                                style.paddingRight = val;
                            }
                            if (!style.paddingTop) {
                                style.paddingTop = val;
                            }
                            if (!style.paddingBottom) {
                                style.paddingBottom = val;
                            }
                        }
                    }
                };
                /*
                * Extracts the border values from the CSSStyleDeclaration object.
                *
                * @param style A value to extract from.
                * @return A {@link _IBorder} object.
                */
                _CellRenderer.prototype._parseBorder = function (style) {
                    var borders = {
                        left: { width: 0 },
                        top: { width: 0 },
                        bottom: { width: 0 },
                        right: { width: 0 }
                    };
                    if (style.borderLeftStyle !== 'none') {
                        borders.left = {
                            width: wijmo.pdf._asPt(style.borderLeftWidth),
                            style: style.borderLeftStyle,
                            color: style.borderLeftColor
                        };
                    }
                    if (style.borderTopStyle !== 'none') {
                        borders.top = {
                            width: wijmo.pdf._asPt(style.borderTopWidth),
                            style: style.borderTopStyle,
                            color: style.borderTopColor
                        };
                    }
                    if (style.borderBottomStyle !== 'none') {
                        borders.bottom = {
                            width: wijmo.pdf._asPt(style.borderBottomWidth),
                            style: style.borderBottomStyle,
                            color: style.borderBottomColor
                        };
                    }
                    if (style.borderRightStyle !== 'none') {
                        borders.right = {
                            width: wijmo.pdf._asPt(style.borderRightWidth),
                            style: style.borderRightStyle,
                            color: style.borderRightColor
                        };
                    }
                    return borders;
                };
                /*
                * Extracts the padding values from the CSSStyleDeclaration object.
                *
                * @param style Value to extract from.
                * @return The {@link IPadding} object.
                */
                _CellRenderer.prototype._parsePadding = function (style) {
                    return {
                        left: wijmo.pdf._asPt(style.paddingLeft),
                        top: wijmo.pdf._asPt(style.paddingTop),
                        bottom: wijmo.pdf._asPt(style.paddingBottom),
                        right: wijmo.pdf._asPt(style.paddingRight)
                    };
                };
                /*
                * Renders an empty cell.
                *
                * The following CSSStyleDeclaration properties are supported for now:
                *   left, top
                *   width, height
                *   border<Left \ Right\ Top\ Bottom>Style (if 'none' then no border, otherwise a solid border)
                *   border<Left\ Right\ Top\ Bottom>Width,
                *   border<Left\ Right\ Top\ Bottom>Color
                *   backgroundColor
                *   boxSizing (content-box + border-box)
                *   padding<Left\ Top\ Right\ Bottom>
                *   textAlign
                *   fontFamily, fontStyle, fontWeight, fontSize
                *
                * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
                * @return A ICellInfo object that represents information about the cell's content.
                */
                _CellRenderer.prototype._renderEmptyCell = function (m, style, renderContent, renderBorders) {
                    var x = m.rect.left, y = m.rect.top, clientWidth = m.clientRect.width, clientHeight = m.clientRect.height, blw = m.clientRect.left - m.rect.left, btw = m.clientRect.top - m.rect.top, bbw = (m.rect.top + m.rect.height) - (m.clientRect.top + m.clientRect.height), brw = (m.rect.left + m.rect.width) - (m.clientRect.left + m.clientRect.width);
                    if (renderBorders && (blw || brw || bbw || btw)) {
                        var blc = style.borderLeftColor || style.borderColor, brc = style.borderRightColor || style.borderColor, btc = style.borderTopColor || style.borderColor, bbc = style.borderBottomColor || style.borderColor;
                        // all borders has the same width and color, draw a rectangle
                        if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (blc === brc && blc === bbc && blc === btc)) {
                            var border = blw, half = border / 2; // use an adjustment because of center border alignment used by PDFKit.
                            this._area.paths
                                .rect(x + half, y + half, clientWidth + border, clientHeight + border)
                                .stroke(new wijmo.pdf.PdfPen(blc, border));
                        }
                        else {
                            // use a trapeze for each border
                            if (blw) {
                                this._area.paths
                                    .polygon([[x, y], [x + blw, y + btw], [x + blw, y + btw + clientHeight], [x, y + btw + clientHeight + bbw]])
                                    .fill(blc);
                            }
                            if (btw) {
                                this._area.paths
                                    .polygon([[x, y], [x + blw, y + btw], [x + blw + clientWidth, y + btw], [x + blw + clientWidth + brw, y]])
                                    .fill(btc);
                            }
                            if (brw) {
                                this._area.paths
                                    .polygon([[x + blw + clientWidth + brw, y], [x + blw + clientWidth, y + btw], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]])
                                    .fill(brc);
                            }
                            if (bbw) {
                                this._area.paths
                                    .polygon([[x, y + btw + clientHeight + bbw], [x + blw, y + btw + clientHeight], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]])
                                    .fill(bbc);
                            }
                        }
                    }
                    // draw background
                    /*if (renderContent && style.backgroundColor && clientWidth > 0 && clientHeight > 0) {
                    this._area.paths
                        .rect(x + blw, y + btw, clientWidth, clientHeight)
                        .fill(style.backgroundColor);
                    }*/
                    if (renderContent) {
                        _CellRenderer._drawBackground(this._area, m.clientRect, style.backgroundColor);
                    }
                };
                /*
                * Renders a cell with a checkbox inside.
                *
                * @param value Boolean value.
                * @param style A CSSStyleDeclaration object that represents the cell style and
                * positioning.
                *
                * @return A reference to the document.
                */
                _CellRenderer.prototype._renderBooleanCell = function (value, m, style) {
                    if (!m.textRect || m.textRect.height <= 0 || m.textRect.width <= 0) {
                        return;
                    }
                    var border = 0.5, x = m.textRect.left, y = m.textRect.top, sz = m.textRect.height;
                    // border and content area
                    this._area.paths
                        .rect(x, y, sz, sz)
                        .fillAndStroke(wijmo.Color.fromRgba(255, 255, 255), new wijmo.pdf.PdfPen(undefined, border));
                    // checkmark
                    if (wijmo.changeType(value, wijmo.DataType.Boolean, '') === true) {
                        var space = sz / 20, cmRectSize = sz - border - space * 2, cmLineWidth = sz / 8;
                        this._area.document.saveState();
                        this._area.translate(x + border / 2 + space, y + border / 2 + space)
                            .paths
                            .moveTo(cmLineWidth / 2, cmRectSize * 0.6)
                            .lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth)
                            .lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2)
                            .stroke(new wijmo.pdf.PdfPen(undefined, cmLineWidth));
                        this._area.document.restoreState();
                    }
                };
                /*
                * Renders a cell with a text inside.
                *
                * @param text Text inside the cell.
                * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
                *
                * @return A reference to the document.
                */
                _CellRenderer.prototype._renderTextCell = function (text, m, style) {
                    if (!text || !m.textRect || m.textRect.height <= 0 || m.textRect.width <= 0) {
                        return;
                    }
                    this._area.drawText(text, m.textRect.left, m.textRect.top, {
                        brush: style.color,
                        font: style.font,
                        height: m.textRect.height,
                        width: m.textRect.width,
                        align: style.textAlign === 'center'
                            ? wijmo.pdf.PdfTextHorizontalAlign.Center
                            : (style.textAlign === 'right'
                                ? wijmo.pdf.PdfTextHorizontalAlign.Right
                                : (style.textAlign === 'justify'
                                    ? wijmo.pdf.PdfTextHorizontalAlign.Justify
                                    : wijmo.pdf.PdfTextHorizontalAlign.Left)) // default
                    });
                };
                _CellRenderer.prototype._calculateTextRect = function (value, panel, row, column, content, style) {
                    if (value != null && !wijmo.isString(value)) {
                        return null;
                    }
                    var res = content.clone();
                    if (this._isBooleanCellAndValue(value, panel, row, column)) {
                        var szh = this._getTextLineHeight(style.font);
                        switch (style.verticalAlign) {
                            case 'middle':
                                res.top = content.top + content.height / 2 - szh / 2;
                                break;
                            case 'bottom':
                                res.top = content.top + content.height - szh;
                                break;
                        }
                        switch (style.textAlign) {
                            case 'justify':
                            case 'center':
                                res.left = content.left + content.width / 2 - szh / 2;
                                break;
                            case 'right':
                                res.left = content.left + content.width - szh;
                                break;
                        }
                        res.height = res.width = szh;
                    }
                    else {
                        if (res.height > 0 && res.width > 0) {
                            switch (style.verticalAlign) {
                                case 'bottom':
                                    var sz = this._area.measureText(value, style.font, { height: res.height, width: res.width });
                                    if (sz.size.height < res.height) {
                                        var ndoc = this._area.document._document, lastLineExtLeading = ndoc.currentLineHeight(true) - ndoc.currentLineHeight(false);
                                        res.top += res.height - sz.size.height - lastLineExtLeading;
                                        res.height = sz.size.height;
                                    }
                                    break;
                                case 'middle':
                                    var sz = this._area.measureText(value, style.font, { height: res.height, width: res.width });
                                    if (sz.size.height < res.height) {
                                        var ndoc = this._area.document._document, lastLineExtLeading = ndoc.currentLineHeight(true) - ndoc.currentLineHeight(false);
                                        res.top += res.height / 2 - (sz.size.height - lastLineExtLeading) / 2;
                                        res.height = sz.size.height;
                                    }
                                    break;
                                default: // 'top'
                                    break;
                            }
                        }
                    }
                    return res;
                };
                _CellRenderer.prototype._getTextLineHeight = function (font) {
                    //return this._area.measureText('A', font, { width: Infinity }).size.height;
                    return this._area.lineHeight(font);
                };
                return _CellRenderer;
            }());
            pdf._CellRenderer = _CellRenderer;
            // A caching proxy for the flex.getMergedRange method, caches last vertical range for each column.
            var GetMergedRangeProxy = /** @class */ (function () {
                function GetMergedRangeProxy(flex) {
                    this._columns = {};
                    this._flex = flex;
                }
                // The [r, c] cell belongs to a visible column/row.
                GetMergedRangeProxy.prototype.getMergedRange = function (p, r, c) {
                    var rng = this._columns[c];
                    if (rng && r >= rng.topRow && r <= rng.bottomRow) {
                        return rng;
                    }
                    else {
                        var mr = this._flex.getMergedRange(p, r, c), cols = p.columns, rows = p.rows;
                        // collapse invisible edge columns/rows, if any (418356)
                        if (mr && !mr.isSingleCell && (!cols[mr.col].isVisible || !cols[mr.col2].isVisible || !rows[mr.row].isVisible || !rows[mr.row2].isVisible)) {
                            mr = mr.clone();
                            while (mr.col < mr.col2 && !cols[mr.col].isVisible)
                                mr.col++;
                            while (mr.col2 > mr.col && !cols[mr.col2].isVisible)
                                mr.col2--;
                            while (mr.row < mr.row2 && !rows[mr.row].isVisible)
                                mr.row++;
                            while (mr.row2 > mr.row && !rows[mr.row2].isVisible)
                                mr.row2--;
                        }
                        if (mr && mr.isSingleCell) {
                            mr = null; // 408290, PivotGrid.getMergedRange returns non-null values for non-merged cells.
                        }
                        return this._columns[c] = mr ? new _CellRangeExt(p, mr) : null;
                    }
                };
                return GetMergedRangeProxy;
            }());
            var _CellRange = /** @class */ (function () {
                function _CellRange(cr, col, row2, col2) {
                    if (typeof (cr) === "number") {
                        this._row = cr;
                        this._col = col;
                        this._row2 = row2;
                        this._col2 = col2;
                    }
                    else {
                        this._row = cr.row;
                        this._col = cr.col;
                        this._row2 = cr.row2;
                        this._col2 = cr.col2;
                    }
                    if (this._row < 0 || this._row2 < 0) {
                        this._row = this._row2 = -1;
                    }
                    if (this._col < 0 || this._col2 < 0) {
                        this._col = this._col2 = -1;
                    }
                }
                Object.defineProperty(_CellRange.prototype, "row", {
                    get: function () {
                        return this._row;
                    },
                    set: function (value) {
                        this._row = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "col", {
                    get: function () {
                        return this._col;
                    },
                    set: function (value) {
                        this._col = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "row2", {
                    get: function () {
                        return this._row2;
                    },
                    set: function (value) {
                        this._row2 = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "col2", {
                    get: function () {
                        return this._col2;
                    },
                    set: function (value) {
                        this._col2 = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "topRow", {
                    get: function () {
                        return Math.min(this._row, this._row2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "bottomRow", {
                    get: function () {
                        return Math.max(this._row, this._row2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "leftCol", {
                    get: function () {
                        return Math.min(this._col, this._col2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "rightCol", {
                    get: function () {
                        return Math.max(this._col, this._col2);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "columnSpan", {
                    get: function () {
                        return Math.abs(this._col2 - this._col) + 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "rowSpan", {
                    get: function () {
                        return Math.abs(this._row2 - this._row) + 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "isValid", {
                    get: function () {
                        return this._row > -1 && this._col > -1 && this._row2 > -1 && this._col2 > -1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRange.prototype, "isSingleCell", {
                    get: function () {
                        return this._row === this._row2 && this._col === this._col2;
                    },
                    enumerable: true,
                    configurable: true
                });
                _CellRange.prototype.copyFrom = function (cr) {
                    this.setRange(cr.row, cr.col, cr.row2, cr.col2);
                };
                _CellRange.prototype.clone = function () {
                    return new _CellRange(this._row, this._col, this._row2, this._col2);
                };
                _CellRange.prototype.getRenderSize = function (flex, p) {
                    var sz = new wijmo.Size(0, 0);
                    if (this.isValid) {
                        for (var r = this.topRow; r <= this.bottomRow; r++) {
                            var row = p.rows[r];
                            if (flex.isRenderableRow(row)) {
                                sz.height += row.renderHeight;
                            }
                        }
                        for (var c = this.leftCol; c <= this.rightCol; c++) {
                            var col = p.columns[c];
                            if (flex.isRenderableColumn(col)) {
                                sz.width += col.renderWidth;
                            }
                        }
                    }
                    return sz;
                };
                _CellRange.prototype.setRange = function (r, c, r2, c2) {
                    if (r === void 0) { r = -1; }
                    if (c === void 0) { c = -1; }
                    if (r2 === void 0) { r2 = r; }
                    if (c2 === void 0) { c2 = c; }
                    this._row = wijmo.asInt(r);
                    this._col = wijmo.asInt(c);
                    this._row2 = wijmo.asInt(r2);
                    this._col2 = wijmo.asInt(c2);
                };
                return _CellRange;
            }());
            pdf._CellRange = _CellRange;
            var _CellRangeExt = /** @class */ (function (_super) {
                __extends(_CellRangeExt, _super);
                function _CellRangeExt(panel, cr, col, row2, col2) {
                    var _this = _super.call(this, cr, col, row2, col2) || this;
                    _this.firstVisibleRow = -1;
                    _this.visibleRowsCount = 0;
                    if (panel) {
                        var tr = _this.topRow, br = _this.bottomRow, len = panel.rows.length;
                        // find the first visible row
                        if (len > 0) {
                            for (var i = tr; i <= br && i < len; i++) {
                                if (panel.rows[i].isVisible) {
                                    if (_this.firstVisibleRow < 0) {
                                        _this.firstVisibleRow = i;
                                    }
                                    _this.visibleRowsCount++;
                                }
                            }
                        }
                    }
                    return _this;
                }
                _CellRangeExt.prototype.copyFrom = function (cr) {
                    _super.prototype.copyFrom.call(this, cr);
                    this.firstVisibleRow = cr.firstVisibleRow;
                    this.visibleRowsCount = cr.visibleRowsCount;
                };
                _CellRangeExt.prototype.clone = function () {
                    return new _CellRangeExt(null, this.row, this.col, this.row2, this.col2);
                };
                return _CellRangeExt;
            }(_CellRange));
            pdf._CellRangeExt = _CellRangeExt;
            var RowRange = /** @class */ (function () {
                function RowRange(ranges) {
                    this._ranges = ranges || [];
                }
                RowRange.prototype.length = function () {
                    var res = 0;
                    for (var i = 0; i < this._ranges.length; i++) {
                        var r = this._ranges[i];
                        if (r.isValid) {
                            res += r.bottomRow - r.topRow + 1;
                        }
                    }
                    return res;
                };
                Object.defineProperty(RowRange.prototype, "isValid", {
                    get: function () {
                        return this._ranges.length && this._ranges[0].isValid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowRange.prototype, "leftCol", {
                    get: function () {
                        if (this._ranges.length) {
                            return this._ranges[0].leftCol;
                        }
                        return -1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowRange.prototype, "rightCol", {
                    get: function () {
                        if (this._ranges.length) {
                            return this._ranges[0].rightCol;
                        }
                        return -1;
                    },
                    enumerable: true,
                    configurable: true
                });
                RowRange.prototype.clone = function (leftCol, rightCol) {
                    var ranges = [];
                    for (var i = 0; i < this._ranges.length; i++) {
                        var range = this._ranges[i].clone();
                        if (arguments.length > 0) {
                            range.col = leftCol;
                        }
                        if (arguments.length > 1) {
                            range.col2 = rightCol;
                        }
                        ranges.push(range);
                    }
                    return new RowRange(ranges);
                };
                RowRange.prototype.getRenderSize = function (flex, panel) {
                    var res = new wijmo.Size(0, 0);
                    for (var i = 0; i < this._ranges.length; i++) {
                        var size = this._ranges[i].getRenderSize(flex, panel);
                        res.width = Math.max(res.width, size.width);
                        res.height += size.height;
                    }
                    return res;
                };
                RowRange.prototype.find = function (panel, fn) {
                    var val = null;
                    this.forEach(panel, function (row) {
                        if (fn(row) === true) {
                            val = row;
                            return false;
                        }
                    });
                    return val;
                };
                RowRange.prototype.forEach = function (panel, fn) {
                    var idx = 0, brk = false;
                    for (var i = 0; (i < this._ranges.length) && !brk; i++) {
                        var range = this._ranges[i];
                        if (range.isValid) {
                            for (var j = range.topRow; (j <= range.bottomRow) && !brk; j++) {
                                brk = fn(panel.rows[j], range, j, idx++) === false;
                            }
                        }
                    }
                };
                RowRange.prototype.subrange = function (from, count, leftCol, rightCol) {
                    var ranges = [];
                    if (from >= 0 && count > 0) {
                        var start = 0, end = 0;
                        for (var i = 0; i < this._ranges.length && count > 0; i++, start = end + 1) {
                            var r = this._ranges[i];
                            end = start + (r.bottomRow - r.topRow);
                            if (from > end) {
                                continue;
                            }
                            var r1 = (from > start) ? r.topRow + (from - start) : r.topRow, r2 = Math.min(r.bottomRow, r1 + count - 1), lCol = arguments.length > 2 ? leftCol : r.leftCol, rCol = arguments.length > 2 ? rightCol : r.rightCol;
                            ranges.push(new _CellRange(r1, lCol, r2, rCol));
                            count -= r2 - r1 + 1;
                        }
                    }
                    return new RowRange(ranges);
                };
                return RowRange;
            }());
            var PdfPageRowRange = /** @class */ (function () {
                function PdfPageRowRange(range, col, row) {
                    this._col = col;
                    this._row = row;
                    this._range = range;
                }
                Object.defineProperty(PdfPageRowRange.prototype, "range", {
                    get: function () {
                        return this._range;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfPageRowRange.prototype, "pageCol", {
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfPageRowRange.prototype, "pageRow", {
                    get: function () {
                        return this._row;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PdfPageRowRange;
            }());
        })(pdf = grid_1.pdf || (grid_1.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_2) {
        var pdf;
        (function (pdf) {
            // Always use a soft reference to these modules (in the places that will be transpiled directly to JS) to avoid requiring an import,
            // otherwise webpack will embedd them into the worker bundle.
            // The worker bundle should contain nothing but wijmo, wijmo.pdf and wijmo.grid.pdf modules, any other code is redundant.
            'use strict';
            var _fc;
            var FAKE_CELL = 'wj-pdf-fake-cell';
            function getFakeCell(panel) {
                if (!_fc) {
                    _fc = document.createElement('div');
                    _fc.setAttribute(FAKE_CELL, 'true');
                    if (pdf.softGrid()) {
                        _fc.setAttribute(pdf.softGrid().FlexGrid._WJS_MEASURE, 'true');
                    }
                }
                var s = _fc.style;
                s.cssText = '';
                // we can't use 'hidden' because of innerText, it returns nothing for the hidden elements in Chrome/FF (WJM-19602)
                //s.visibility = 'hidden';
                s.position = 'absolute';
                s.overflow = 'hidden';
                s.width = '1px';
                s.height = '1px';
                s.clipPath = 'inset(100%)';
                s.clip = 'rect(0 0 0 0)';
                var host = panel.hostElement;
                // Add fakeCell to the first row of the panel, or, if there is no rows, to the panel itself.
                var parent = host.children.length ? host.children[0] : host;
                if (_fc.parentNode !== parent) {
                    parent.appendChild(_fc);
                }
                return _fc;
            }
            function _removeFakeCell() {
                if (_fc) {
                    wijmo.removeChild(_fc);
                    _fc = null;
                }
            }
            pdf._removeFakeCell = _removeFakeCell;
            /**
            * Provides a functionality to export the {@link FlexGrid} to PDF.
            *
            * The example below shows how you can use a {@link FlexGridPdfConverter} to
            * export a {@link FlexGrid} to PDF:
            *
            * {@sample Grid/ImportExportPrint/PDF/ExportToFile/purejs Example}
            */
            var FlexGridPdfConverter = /** @class */ (function () {
                function FlexGridPdfConverter() {
                }
                /**
                * Draws the {@link FlexGrid} to an existing {@link PdfDocument} at the
                * (0, @wijmo.pdf.PdfDocument.y) coordinates.
                *
                * If both, **width** and **height** are determined, then grid will be scaled to fit the
                * specified rectangle without any page breaks.
                * If only **width** is specifed, then grid will be scaled to fit the width, breaking
                * into pages vertically as needed.
                * Otherwise grid will be rendered in actual size, breaking into pages as needed.
                *
                * <pre>
                * var doc = new wijmo.pdf.PdfDocument({
                *    ended: function (sender, args) {
                *       wijmo.pdf.saveBlob(args.blob, 'FlexGrid.pdf');
                *    }
                * });
                *
                * wijmo.grid.pdf.FlexGridPdfConverter.draw(grid, doc, null, null, {
                *    maxPages: 10,
                *    styles: {
                *       cellStyle: {
                *          backgroundColor: '#ffffff',
                *          borderColor: '#c6c6c6'
                *       },
                *       headerCellStyle: {
                *          backgroundColor: '#eaeaea'
                *       }
                *    }
                * });
                * </pre>
                *
                * @param flex The {@link FlexGrid} instance to export.
                * @param doc The {@link PdfDocument} instance to draw in.
                * @param width The width of the drawing area in points.
                * @param height The height of the drawing area in points.
                * @param settings The draw settings.
                */
                FlexGridPdfConverter.draw = function (flex, doc, width, height, settings) {
                    this.drawToPosition(flex, doc, null, width, height, settings);
                };
                /**
                * Draws the {@link FlexGrid} to an existing {@link PdfDocument} instance at the
                * specified coordinates.
                *
                * If both, **width** and **height** are determined, then grid will be scaled to fit
                * the specified rectangle without any page breaks.
                * If only **width** is specified, then grid will be scaled to fit the width without
                * any page breaks.
                * Othwerwise grid will be rendered in actual size without any page breaks.
                *
                * <pre>
                * var doc = new wijmo.pdf.PdfDocument({
                *    ended: function (sender, args) {
                *       wijmo.pdf.saveBlob(args.blob, 'FlexGrid.pdf');
                *    }
                * });
                *
                * wijmo.grid.pdf.FlexGridPdfConverter.drawToPosition(grid, doc, new wijmo.Point(0, 0), null, null, {
                *    maxPages: 10,
                *    styles: {
                *       cellStyle: {
                *          backgroundColor: '#ffffff',
                *          borderColor: '#c6c6c6'
                *       },
                *       headerCellStyle: {
                *          backgroundColor: '#eaeaea'
                *       }
                *    }
                * });
                * </pre>
                *
                * @param flex The {@link FlexGrid} instance to export.
                * @param doc The {@link PdfDocument} instance to draw in.
                * @param point The position to draw at, in points.
                * @param width The width of the drawing area in points.
                * @param height The height of the drawing area in points.
                * @param settings The draw settings.
                */
                FlexGridPdfConverter.drawToPosition = function (flex, doc, point, width, height, settings) {
                    wijmo.assert(!!flex, 'The flex argument cannot be null.');
                    wijmo.assert(!!doc, 'The doc argument cannot be null.');
                    var isControl = pdf.softGrid() && (flex instanceof pdf.softGrid().FlexGrid), ctrl = flex, orgWidth;
                    try {
                        settings = pdf._FlexGridPdfCoreConverter._applyDefaultDrawSettings(settings);
                        var adapter = flex;
                        if (isControl) {
                            if (settings && settings.recalculateStarWidths) { // recalculate the star-sized columns to get a lesser scale factor
                                orgWidth = ctrl.columns.getTotalSize(); // save the current width
                                ctrl.columns._updateStarSizes(wijmo.pdf.ptToPx(doc.width));
                            }
                            adapter = this._getFlexGridAdapter(ctrl, settings);
                        }
                        pdf._FlexGridPdfCoreConverter.draw(adapter, doc, point, width, height, settings);
                    }
                    finally {
                        _removeFakeCell();
                        if (isControl && settings && settings.recalculateStarWidths) {
                            ctrl.columns._updateStarSizes(orgWidth); // rollback changes
                        }
                    }
                };
                /**
                * Exports the {@link FlexGrid} to PDF.
                *
                * <pre>
                * wijmo.grid.pdf.FlexGridPdfConverter.export(grid, 'FlexGrid.pdf', {
                *    scaleMode: wijmo.grid.pdf.ScaleMode.PageWidth,
                *    maxPages: 10,
                *    styles: {
                *       cellStyle: {
                *          backgroundColor: '#ffffff',
                *          borderColor: '#c6c6c6'
                *       },
                *       headerCellStyle: {
                *          backgroundColor: '#eaeaea'
                *       }
                *    },
                *    documentOptions: {
                *       info: {
                *          title: 'Sample'
                *       }
                *    }
                * });
                * </pre>
                *
                * @param flex The {@link FlexGrid} instance to export.
                * @param fileName Name of the file to export.
                * @param settings The export settings.
                */
                FlexGridPdfConverter.export = function (flex, fileName, settings) {
                    wijmo.assert(!!flex, 'The flex argument cannot be null.');
                    wijmo.assert(!!fileName, 'The fileName argument cannot be empty.');
                    settings = this._applyDefaultExportSettings(settings);
                    var originalEnded = settings.documentOptions.ended;
                    settings.documentOptions.ended = function (sender, args) {
                        if (settings.progress) {
                            settings.progress(1); // _maxProgress = 0.9, inform that the operation has completed.
                        }
                        if (!originalEnded || (originalEnded.apply(doc, [sender, args]) !== false)) {
                            wijmo.pdf.saveBlob(args.blob, fileName);
                        }
                        sender.dispose(); // Dispose the document
                    };
                    var doc = new wijmo.pdf.PdfDocument(settings.documentOptions);
                    this.drawToPosition(flex, doc, null, null, null, settings);
                    doc.end();
                };
                FlexGridPdfConverter._getFlexGridAdapter = function (flex, settings) {
                    var t = ((pdf.softMultiRow() && (flex instanceof pdf.softMultiRow().MultiRow) && MultiRowAdapter) || // MultiRow
                        (pdf.softSheet() && (flex instanceof pdf.softSheet().FlexSheet) && FlexSheetAdapter) || // FlexSheet
                        (pdf.softOlap() && (flex instanceof pdf.softOlap().PivotGrid) && PivotGridAdapter) || // PivotGrid
                        (pdf.softTransposed() && (flex instanceof pdf.softTransposed().TransposedGrid) && _TransposedGridAdapter) || // TransposedGrid
                        (pdf.softTransposedMultiRow() && (flex instanceof pdf.softTransposedMultiRow().TransposedMultiRow) && TransposedMultiRowAdapter) || // TransposedMultiRow
                        FlexGridAdapter);
                    return new t(flex, settings);
                };
                // Clones and applies defaults.
                FlexGridPdfConverter._applyDefaultExportSettings = function (settings) {
                    return pdf._merge(pdf._merge({}, settings), this._DefaultExportSettings);
                };
                FlexGridPdfConverter._DefaultExportSettings = pdf._merge({
                    scaleMode: pdf.ScaleMode.PageWidth,
                    documentOptions: {
                        compress: false,
                        pageSettings: {
                            margins: {
                                left: 36,
                                right: 36,
                                top: 18,
                                bottom: 18
                            }
                        }
                    },
                    _progressMax: 0.9 // 90%, the "rendering" to "document finalization" ratio is estimated as 90%:10%.
                }, pdf._FlexGridPdfCoreConverter.DefaultDrawSettings);
                return FlexGridPdfConverter;
            }());
            pdf.FlexGridPdfConverter = FlexGridPdfConverter;
            var FlexGridAdapter = /** @class */ (function () {
                function FlexGridAdapter(flex, settings) {
                    this._defBorderColor = null;
                    this._flex = flex;
                    this._settings = settings;
                    if (settings.quickCellStyles) {
                        this._styleCache = new StyleCache(500);
                    }
                }
                Object.defineProperty(FlexGridAdapter.prototype, "flex", {
                    get: function () {
                        return this._flex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "settings", {
                    get: function () {
                        return this._settings;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "columns", {
                    get: function () {
                        return this._flex.columns;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "rows", {
                    get: function () {
                        return this._flex.rows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "bottomLeftCells", {
                    get: function () {
                        return this._flex.bottomLeftCells;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "cells", {
                    get: function () {
                        return this._flex.cells;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "columnFooters", {
                    get: function () {
                        return this._flex.columnFooters;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "columnHeaders", {
                    get: function () {
                        return this._flex.columnHeaders;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "rowHeaders", {
                    get: function () {
                        return this._flex.rowHeaders;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "topLeftCells", {
                    get: function () {
                        return this._flex.topLeftCells;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "treeIndent", {
                    get: function () {
                        return this._flex.treeIndent;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridAdapter.prototype.getSelection = function () {
                    var ranges = [], selection = this._flex.selection, sg = pdf.softGrid();
                    switch (this._flex.selectionMode) {
                        case sg.SelectionMode.None:
                            break;
                        case sg.SelectionMode.Cell:
                        case sg.SelectionMode.CellRange:
                            ranges.push(new pdf._CellRange(selection.row, selection.col, selection.row2, selection.col2));
                            break;
                        case sg.SelectionMode.Row:
                            ranges.push(new pdf._CellRange(selection.topRow, 0, selection.topRow, this._flex.cells.columns.length - 1));
                            break;
                        case sg.SelectionMode.RowRange:
                            ranges.push(new pdf._CellRange(selection.topRow, 0, selection.bottomRow, this._flex.cells.columns.length - 1));
                            break;
                        case sg.SelectionMode.ListBox:
                            var top = -1;
                            for (var r = 0; r < this._flex.rows.length; r++) {
                                var row = this._flex.rows[r];
                                if (row.isSelected) {
                                    if (top < 0) {
                                        top = r;
                                    }
                                    if (r === this._flex.rows.length - 1) {
                                        ranges.push(new pdf._CellRange(top, 0, r, this._flex.cells.columns.length - 1));
                                    }
                                }
                                else {
                                    if (top >= 0) {
                                        ranges.push(new pdf._CellRange(top, 0, r - 1, this._flex.cells.columns.length - 1));
                                    }
                                    top = -1;
                                }
                            }
                            break;
                    }
                    return ranges;
                };
                FlexGridAdapter.prototype.getCell = function (panel, row, column, updateContent) {
                    var cell = panel.getCellElement(row, column);
                    // Not in a view? Return a fake cell then.
                    // Important: for DetailGrid always return a real cell, if possible (WJM-19946).
                    if (!cell) {
                        cell = getFakeCell(panel);
                        this._flex.cellFactory.updateCell(panel, row, column, cell, null, updateContent);
                    }
                    return cell;
                };
                FlexGridAdapter.prototype.getComputedDefBorderColor = function () {
                    if (this._defBorderColor == null) {
                        var style = window.getComputedStyle(this._flex.hostElement);
                        this._defBorderColor = style.borderRightStyle != 'none'
                            ? style.borderRightColor
                            : style.borderBottomStyle != 'none'
                                ? style.borderBottomColor
                                : style.borderLeftStyle != 'none'
                                    ? style.borderLeftColor
                                    : style.borderTopStyle != 'none'
                                        ? style.borderTopColor
                                        : 'rgba(0,0,0,0.2)'; //.wj-content
                    }
                    return this._defBorderColor;
                };
                FlexGridAdapter.prototype.getComputedStyle = function (panel, cell) {
                    var style;
                    var real = cell.getAttribute(FAKE_CELL) == null, // a real cell, not a fake one.
                    className = cell.className, selected = className.indexOf('wj-state-selected') >= 0 || className.indexOf('wj-state-multi-selected') >= 0;
                    if (selected) {
                        // We don't want these styles to be exported to PDF.
                        cell.className = className.replace('wj-state-selected', '').replace('wj-state-multi-selected', '');
                    }
                    if (this._styleCache) {
                        var host = panel.hostElement;
                        // Build the cache key.
                        //
                        // First, extract the key from the fakeCell's inline style.
                        var key = cell.style.cssText.split(/;\s+/).filter(function (propVal) {
                            var prop = propVal.substring(0, propVal.indexOf(':'));
                            return /^(color|background-color|border-color|border-left-color|border-right-color|border-top-color|border-bottom-color|font|textAlign)/i.test(prop); // leave only those properties that begin with these words. See ICellStyle for supported properties.
                        }).join(';');
                        // Then add CSS class names to the key, starting with the fakeCell and ending with the panel element.
                        var el = cell;
                        do {
                            key = el.className + key;
                        } while (el !== host && (el = el.parentElement));
                        // Check the cache.
                        style = this._styleCache.getValue(key);
                        if (!style) {
                            style = window.getComputedStyle(cell);
                            style = this._styleCache.add(key, style);
                        }
                    }
                    else {
                        style = pdf._cloneStyle(window.getComputedStyle(cell)); // don't use a live object, after restoring the cell.className it will change.
                    }
                    if (real && selected) { // restore className
                        cell.className = className;
                    }
                    return style;
                };
                FlexGridAdapter.prototype.getMergedRange = function (p, r, c) {
                    var cr = this._flex.getMergedRange(p, r, c, false);
                    return cr ? new pdf._CellRange(cr.row, cr.col, cr.row2, cr.col2) : null;
                };
                Object.defineProperty(FlexGridAdapter.prototype, "showColumnHeader", {
                    get: function () {
                        return !!(this._flex.headersVisibility & pdf.softGrid().HeadersVisibility.Column);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "showRowHeader", {
                    get: function () {
                        return !!(this._flex.headersVisibility & pdf.softGrid().HeadersVisibility.Row);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridAdapter.prototype, "showColumnFooter", {
                    get: function () {
                        return this._flex.columnFooters.rows.length > 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridAdapter.prototype.alignMergedTextToTheTopRow = function (panel) {
                    return false;
                };
                FlexGridAdapter.prototype.getCellData = function (panel, row, col) {
                    return panel.getCellData(row, col, true);
                };
                FlexGridAdapter.prototype.getCellContent = function (panel, row, col, colIdx) {
                    var value, sg = pdf.softGrid();
                    if (this.settings.customCellContent) {
                        // take value directly from the cell
                        var cell = this.getCell(panel, row.index, colIdx, true);
                        //value = cell.textContent.trim();
                        value = cell.innerText.trim(); // use innerText instead of textContent to normalize whitespaces (TFS 472692).
                        value = value.replace(/\r/gm, '').replace(/\n+/gm, '\n');
                        if (!value && this.isBooleanCell(panel, row, col)) {
                            value = this._extractCheckboxValue(cell);
                            value = value == null ? '' : value + '';
                        }
                    }
                    else {
                        var isHtml = col.isContentHtml;
                        value = this.getCellData(panel, row.index, colIdx);
                        // handle formatted/localized group headers
                        if (this.isGroupRow(row) && (panel.cellType === sg.CellType.Cell) && (col.index === panel.columns.firstVisibleIndex)) {
                            isHtml = true;
                            if (!value) {
                                value = row.getGroupHeader();
                            }
                        }
                        // handle HTML content
                        if (isHtml) {
                            value = wijmo.toPlainText(value).trim();
                        }
                    }
                    return value;
                };
                FlexGridAdapter.prototype.isBooleanCell = function (panel, row, col) {
                    if (col.dataType !== wijmo.DataType.Boolean || panel.cellType !== pdf.softGrid().CellType.Cell) {
                        return false;
                    }
                    if (this.isExpandableGroupRow(row)) {
                        //return col.visibleIndex !== panel.columns.firstVisibleIndex;
                        return col.visibleIndex > 0; // TFS 401965
                    }
                    return true;
                };
                FlexGridAdapter.prototype.getColumn = function (panel, row, col) {
                    return panel.columns[col];
                };
                FlexGridAdapter.prototype.isAlternatingRow = function (row) {
                    var altRow = false, altStep = this._flex.alternatingRowStep;
                    if (altStep) {
                        altRow = row.visibleIndex % (altStep + 1) == 0;
                        if (altStep == 1)
                            altRow = !altRow; // compatibility
                    }
                    return altRow;
                };
                FlexGridAdapter.prototype.isGroupRow = function (row) {
                    return row instanceof pdf.softGrid().GroupRow;
                };
                FlexGridAdapter.prototype.isNewRow = function (row) {
                    return row instanceof pdf.softGrid()._NewRowTemplate;
                };
                FlexGridAdapter.prototype.isDetailRow = function (row) {
                    return pdf.softDetail() && (row instanceof pdf.softDetail().DetailRow);
                };
                FlexGridAdapter.prototype.isExpandableGroupRow = function (row) {
                    return (row instanceof pdf.softGrid().GroupRow) && row.hasChildren; // Group row with no children rows should be treated as a data row (hierarchical grid)
                };
                FlexGridAdapter.prototype.isRenderableRow = function (row) {
                    return row.isVisible && row.renderHeight > 0 && !this.isNewRow(row);
                };
                FlexGridAdapter.prototype.isRenderableColumn = function (col) {
                    return col.isVisible && col.renderWidth > 0;
                };
                FlexGridAdapter.prototype.getCellStyle = function (panel, row, column) {
                    var styles = this.settings.styles, result = pdf._merge({}, styles.cellStyle), // merge cell styles
                    grid = this._flex, sg = pdf.softGrid();
                    switch (panel.cellType) {
                        case sg.CellType.Cell:
                            if (this.isExpandableGroupRow(row)) {
                                pdf._merge(result, styles.groupCellStyle, true);
                            }
                            else {
                                if (this.isAlternatingRow(row)) { // check row.index value; row.index == rowIndex.
                                    pdf._merge(result, styles.altCellStyle, true);
                                }
                            }
                            break;
                        case sg.CellType.ColumnHeader:
                        case sg.CellType.RowHeader:
                        case sg.CellType.TopLeft:
                        case sg.CellType.BottomLeft:
                            pdf._merge(result, styles.headerCellStyle, true);
                            break;
                        case sg.CellType.ColumnFooter:
                            pdf._merge(result, styles.headerCellStyle, true);
                            pdf._merge(result, styles.footerCellStyle, true);
                            break;
                    }
                    if (!this.settings.customCellContent && grid._getShowErrors() && grid._getError(panel, row.index, column.index)) {
                        pdf._merge(result, styles.errorCellStyle, true);
                    }
                    return result;
                };
                FlexGridAdapter.prototype._extractCheckboxValue = function (cell) {
                    var cb = cell.querySelector('input[type=checkbox]' /*'input.wj-cell-check[type=checkbox]'*/);
                    if (cb && cb.style.display !== 'none' && cb.style.visibility !== 'hidden') {
                        return cb.checked;
                    }
                    return undefined;
                };
                return FlexGridAdapter;
            }());
            var FlexSheetAdapter = /** @class */ (function (_super) {
                __extends(FlexSheetAdapter, _super);
                function FlexSheetAdapter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                //#region override
                FlexSheetAdapter.prototype.getCellData = function (panel, row, col) {
                    if (panel.cellType === pdf.softGrid().CellType.Cell) {
                        // Treat the data row as a column header row 
                        if (panel.rows[row] instanceof pdf.softSheet().HeaderRow) { // will be true for the first row of a data-bound sheet only
                            return this.flex.columnHeaders.getCellData(row, col, true);
                        }
                        return this.flex.getCellValue(row, col, true); // formula evaluation
                    }
                    return _super.prototype.getCellData.call(this, panel, row, col);
                };
                FlexSheetAdapter.prototype.getCellStyle = function (panel, row, column) {
                    var result = _super.prototype.getCellStyle.call(this, panel, row, column), table = this.flex.selectedSheet.findTable(row.index, column.index);
                    if (table) {
                        var tableRange = table.getRange(), ri = row.index - tableRange.topRow, ci = column.index - tableRange.leftCol, style = table._getTableCellAppliedStyles(ri, ci);
                        if (style) {
                            style.font = new wijmo.pdf.PdfFont(style.fontFamily, wijmo.pdf._asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight);
                        }
                        pdf._merge(result, style, true);
                    }
                    return result;
                };
                Object.defineProperty(FlexSheetAdapter.prototype, "showColumnHeader", {
                    // hide all headers/footers
                    get: function () {
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheetAdapter.prototype, "showRowHeader", {
                    get: function () {
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheetAdapter.prototype, "showColumnFooter", {
                    get: function () {
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                return FlexSheetAdapter;
            }(FlexGridAdapter));
            var MultiRowAdapter = /** @class */ (function (_super) {
                __extends(MultiRowAdapter, _super);
                function MultiRowAdapter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                //#region override
                MultiRowAdapter.prototype.getColumn = function (panel, row, col) {
                    var rCol = _super.prototype.getColumn.call(this, panel, row, col), bCol = this.flex.getBindingColumn(panel, row, col);
                    // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                    // As Bernardo said: "The binding columns are not used for display, only their binding information matters."
                    return pdf._combineColumns(rCol, bCol);
                };
                MultiRowAdapter.prototype.isAlternatingRow = function (row) {
                    if (row instanceof pdf.softMultiRow()._MultiRow) {
                        var altRow = false, altStep = this.flex.alternatingRowStep;
                        if (altStep) {
                            altRow = row.dataIndex % (altStep + 1) == 0;
                            if (altStep == 1)
                                altRow = !altRow; // compatibility
                        }
                        return altRow;
                    }
                    return _super.prototype.isAlternatingRow.call(this, row);
                };
                return MultiRowAdapter;
            }(FlexGridAdapter));
            var PivotGridAdapter = /** @class */ (function (_super) {
                __extends(PivotGridAdapter, _super);
                function PivotGridAdapter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                //#region override
                PivotGridAdapter.prototype.alignMergedTextToTheTopRow = function (panel) {
                    var sg = pdf.softGrid();
                    return !this.flex.centerHeadersVertically && (panel.cellType === sg.CellType.ColumnHeader || panel.cellType === sg.CellType.RowHeader);
                };
                return PivotGridAdapter;
            }(FlexGridAdapter));
            var _TransposedGridAdapter = /** @class */ (function (_super) {
                __extends(_TransposedGridAdapter, _super);
                function _TransposedGridAdapter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                _TransposedGridAdapter.prototype.getColumn = function (panel, row, col) {
                    var rCol = _super.prototype.getColumn.call(this, panel, row, col);
                    if (panel.cellType != pdf.softGrid().CellType.Cell) {
                        return rCol;
                    }
                    else {
                        var bCol = panel.grid._getBindingColumn(panel, row, rCol);
                        if (!bCol) {
                            return rCol;
                        }
                        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                        return pdf._combineColumns(rCol, bCol);
                    }
                };
                return _TransposedGridAdapter;
            }(FlexGridAdapter));
            var TransposedMultiRowAdapter = /** @class */ (function (_super) {
                __extends(TransposedMultiRowAdapter, _super);
                function TransposedMultiRowAdapter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TransposedMultiRowAdapter.prototype.getColumn = function (panel, row, col) {
                    var rCol = _super.prototype.getColumn.call(this, panel, row, col);
                    if (panel.cellType != pdf.softGrid().CellType.Cell) {
                        return rCol;
                    }
                    else {
                        var bCol = this.flex.getBindingColumn(panel, row, col);
                        if (!bCol) {
                            return rCol;
                        }
                        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                        return pdf._combineColumns(rCol, bCol);
                    }
                };
                return TransposedMultiRowAdapter;
            }(FlexGridAdapter));
            var StyleCache = /** @class */ (function () {
                function StyleCache(maxSize) {
                    this._cache = {};
                    this._size = 0;
                    this._max = maxSize;
                }
                StyleCache.prototype.add = function (key, value) {
                    if (this._size >= this._max) {
                        this.clear();
                    }
                    // Don't keep a reference! We must clone the CSSStyleDeclaration object, otherwise there will be no performance gain.
                    var clone = this._cache[key] = pdf._cloneStyle(value);
                    this._size++;
                    return clone;
                };
                StyleCache.prototype.clear = function () {
                    this._cache = {};
                    this._size = 0;
                };
                StyleCache.prototype.getValue = function (key) {
                    return this._cache[key] || null;
                };
                StyleCache.prototype.hasKey = function (key) {
                    return !!this._cache[key];
                };
                return StyleCache;
            }());
        })(pdf = grid_2.pdf || (grid_2.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_3) {
        var pdf;
        (function (pdf) {
            // Always use a soft reference to these modules (in the places that will be transpiled directly to JS) to avoid requiring an import,
            // otherwise webpack will embedd them into the worker bundle.
            // The worker bundle should contain nothing but wijmo, wijmo.pdf and wijmo.grid.pdf modules, any other code is redundant.
            'use strict';
            var PdfWebWorkerResponseStatus;
            (function (PdfWebWorkerResponseStatus) {
                PdfWebWorkerResponseStatus[PdfWebWorkerResponseStatus["Done"] = 1] = "Done";
                PdfWebWorkerResponseStatus[PdfWebWorkerResponseStatus["Progress"] = 2] = "Progress";
            })(PdfWebWorkerResponseStatus || (PdfWebWorkerResponseStatus = {}));
            var DefGridName = '';
            /**
             * Provides arguments for the callback parameter of the {@link PdfWebWorkerClient.exportGrid} and {@link PdfWebWorkerClient.export} methods.
             */
            var PdfWebWorkerExportDoneEventArgs = /** @class */ (function (_super) {
                __extends(PdfWebWorkerExportDoneEventArgs, _super);
                /**
                * Initializes a new instance of the {@link PdfWebWorkerExportDoneEventArgs} class.
                *
                * @param buffer An ArrayBuffer.
                */
                function PdfWebWorkerExportDoneEventArgs(buffer) {
                    var _this = _super.call(this) || this;
                    _this._buf = buffer;
                    return _this;
                }
                Object.defineProperty(PdfWebWorkerExportDoneEventArgs.prototype, "blob", {
                    /**
                    * Gets a Blob object that contains the document data.
                    */
                    get: function () {
                        if (!this._blob) {
                            this._blob = new Blob([new Uint8Array(this._buf)], { type: 'application/pdf' });
                        }
                        return this._blob;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PdfWebWorkerExportDoneEventArgs.prototype, "buffer", {
                    /**
                    * Gets an ArrayBuffer that contains the document data.
                    */
                    get: function () {
                        return this._buf;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PdfWebWorkerExportDoneEventArgs;
            }(wijmo.EventArgs));
            pdf.PdfWebWorkerExportDoneEventArgs = PdfWebWorkerExportDoneEventArgs;
            /**
             * Represents client-side methods for exporting FlexGrid to PDF/generating PDF, for use with Web Worker.
             */
            var PdfWebWorkerClient = /** @class */ (function () {
                function PdfWebWorkerClient() {
                }
                /**
                 * Exports the {@link FlexGrid} to PDF in a background thread.
                 *
                 * @param worker The Web Worker instance to run the exporting code in.
                 * @param grid The {@link FlexGrid} instance to export.
                 * @param fileName The name of the file to export.
                 * @param settings The export settings.
                 * @param done An optional callback function to call when exporting is done. The function takes a single parameter, an instance of the {@link PdfWebWorkerExportDoneEventArgs} class.
                 * To prevent the creation of a file the function should return False.
                 * @param progress An optional function that gives feedback about the progress of the export. The function takes a single parameter, a number changing from 0.0 to 1.0,
                 * where the value of 0.0 indicates that the operation has just begun and the value of 1.0 indicates that the operation has completed.
                 */
                PdfWebWorkerClient.exportGrid = function (worker, grid, fileName, settings, done, progress) {
                    settings = pdf.FlexGridPdfConverter._applyDefaultExportSettings(settings);
                    // Set .progress (to any function) to enable automatic progress messaging if the progress argument is set.        
                    settings.progress = settings.progress || progress;
                    this.addGrid(worker, grid, DefGridName, settings);
                    this.export(worker, settings.documentOptions, function (args) {
                        // No callback or the default action was not cancelled?
                        if (!wijmo.isFunction(done) || (done(args) !== false)) {
                            wijmo.pdf.saveBlob(args.blob, fileName);
                        }
                    }, progress);
                };
                /**
                 * Exports PDF in a background thread.
                 *
                 * @param worker The Web Worker instance to run the exporting code in.
                 * @param settings An object containing {@link PdfDocument}'s initialization settings.
                 * @param done The callback function to call when drawing is done. The function takes a single parameter, an instance of the {@link PdfWebWorkerExportDoneEventArgs} class.
                 * @param progress An optional function that gives feedback about the progress of the export. The function takes a single parameter, a number changing from 0.0 to 1.0,
                 * where the value of 0.0 indicates that the operation has just begun and the value of 1.0 indicates that the operation has completed.
                 */
                PdfWebWorkerClient.export = function (worker, settings, done, progress) {
                    worker.addEventListener('message', function handler(e) {
                        var data = e.data;
                        switch (data.status) {
                            case PdfWebWorkerResponseStatus.Done:
                                worker.removeEventListener('message', handler);
                                if (wijmo.isFunction(done)) {
                                    done(new PdfWebWorkerExportDoneEventArgs(data.data));
                                }
                                break;
                            case PdfWebWorkerResponseStatus.Progress:
                                if (progress) {
                                    progress(data.data);
                                }
                                break;
                            default:
                                throw "Unknown status: " + data.status;
                        }
                    });
                    var transObj = this._clientDataToArrayBuffer(worker);
                    worker.postMessage({ content: transObj, settings: settings }, [transObj]);
                    this._clearClientData(worker); // don't store client data between the different export calls.
                };
                /**
                 * Adds named FlexGrid with settings, which will be used in a Web Worker to generate a PDF document.
                 * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
                 *
                 * @param worker The Web Worker instance to send the data to.
                 * @param grid The grid
                 * @param name The name associated with the grid.
                 * @param settings The draw settings.
                 */
                PdfWebWorkerClient.addGrid = function (worker, grid, name, settings) {
                    var json = this._gridToJson(grid, settings);
                    this._addClientData(worker, JSON.stringify(json), name, settings, true);
                };
                /**
                 * Adds named image with settings, which will be used in a Web Worker to generate a PDF document.
                 * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
                 *
                 * @param worker The Web Worker instance to send the data to.
                 * @param image A string containing the URL to get the image from or the data URI containing a base64 encoded image.
                 * @param name The name associated with the image.
                 * @param settings The image drawing settings.
                 */
                PdfWebWorkerClient.addImage = function (worker, image, name, settings) {
                    var dataUri = (wijmo.isString(image) && image.indexOf('data:image/svg') >= 0)
                        ? image // svg image
                        : wijmo.pdf._PdfImageHelper.getDataUri(image); // raster image (jpg or png).
                    this._addClientData(worker, dataUri, name, settings);
                };
                /**
                 * Adds named string which will be used in a Web Worker code to generate a PDF document.
                 * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
                 *
                 * @param worker The Web Worker instance to send the data to.
                 * @param value The value.
                 * @param name The name associated with the string.
                 */
                PdfWebWorkerClient.addString = function (worker, value, name) {
                    this._addClientData(worker, value, name, null);
                };
                /**
                * Serializes the {@link FlexGrid} to ArrayBuffer. The serialized data can be send to a Web Worker using the postMessage method.
                *
                * @param grid The {@link FlexGrid} instance to serialize.
                * @param settings The export settings used to serialize the grid.
                */
                PdfWebWorkerClient.serializeGrid = function (grid, settings) {
                    var json = this._gridToJson(grid, settings);
                    return strToBuf(JSON.stringify(json));
                };
                PdfWebWorkerClient._addClientData = function (worker, value, name, settings, isGrid) {
                    if (isGrid === void 0) { isGrid = false; }
                    wijmo.asType(worker, Worker);
                    wijmo.asString(name);
                    wijmo.asString(value, true);
                    var w = worker;
                    w.clientData = w.clientData || {};
                    w.clientData[name] = {
                        content: value,
                        settings: settings ? JSON.stringify(settings) : null,
                    };
                    var gridData = w.clientData[name];
                    if (isGrid) {
                        gridData.isGrid = true;
                        gridData.progressMessaging = settings ? wijmo.isFunction(settings.progress) : false;
                    }
                };
                PdfWebWorkerClient._clearClientData = function (worker) {
                    var w = worker;
                    delete w.clientData;
                };
                PdfWebWorkerClient._clientDataToArrayBuffer = function (worker) {
                    var w = worker;
                    return strToBuf(JSON.stringify(w.clientData || {}));
                };
                PdfWebWorkerClient._gridToJson = function (grid, settings) {
                    settings = pdf.FlexGridPdfConverter._applyDefaultExportSettings(settings);
                    var doc, orgWidth;
                    try {
                        doc = new wijmo.pdf.PdfDocument(settings.documentOptions);
                        if (settings && settings.recalculateStarWidths) { // recalculate the star-sized columns to get a lesser scale factor
                            orgWidth = grid.columns.getTotalSize(); // save the current width
                            grid.columns._updateStarSizes(wijmo.pdf.ptToPx(doc.width));
                        }
                        var gridJson = this._getJsonConverter(grid, settings).convert();
                        //let buffer = strToBuf(JSON.stringify(gridJson));
                        return gridJson;
                    }
                    finally {
                        pdf._removeFakeCell();
                        if (settings && settings.recalculateStarWidths) {
                            grid.columns._updateStarSizes(orgWidth); // rollback changes.
                        }
                        if (doc != null) {
                            doc.dispose();
                            doc = null;
                        }
                    }
                };
                PdfWebWorkerClient._getJsonConverter = function (flex, settings) {
                    var t = ((pdf.softMultiRow() && (flex instanceof pdf.softMultiRow().MultiRow) && MultiRowJsonConverter) || // MultiRow
                        (pdf.softOlap() && (flex instanceof pdf.softOlap().PivotGrid) && PivotGridJsonConverter) || // PivotGrid
                        (pdf.softTransposed() && (flex instanceof pdf.softTransposed().TransposedGrid) && TransposedGridJsonConverter) || // TransposedGrid
                        (pdf.softTransposedMultiRow() && (flex instanceof pdf.softTransposedMultiRow().TransposedMultiRow) && TransposedMultirowJsonConverter) || // TransposedMultiRow
                        FlexGridJsonConverter);
                    return new t(flex, settings, pdf.FlexGridPdfConverter._getFlexGridAdapter(flex, settings));
                };
                return PdfWebWorkerClient;
            }());
            pdf.PdfWebWorkerClient = PdfWebWorkerClient;
            /**
             * Represents server-side methods for exporting FlexGrid to PDF/generating PDF, for use with Web Worker.
             */
            var PdfWebWorker = /** @class */ (function () {
                function PdfWebWorker() {
                }
                /**
                 * Performs the export started in a UI thread by calling the {@link PdfWebWorkerClient.exportGrid} method.
                 */
                PdfWebWorker.initExportGrid = function () {
                    var _this = this;
                    this.initExport(function (doc, clientData) {
                        var gridData = clientData[DefGridName];
                        if (gridData.progressMessaging) {
                            gridData.settings._progressMax = pdf.FlexGridPdfConverter._DefaultExportSettings._progressMax; // use 9:1 ratio, as the FlexGridPdfConverter.export() method.
                            gridData.settings.progress = function (value) {
                                _this.sendExportProgress(value);
                            };
                            doc.ended.addHandler(function () {
                                _this.sendExportProgress(1); //_maxProgress = 0.9, inform that the operation has completed.
                            });
                        }
                        pdf.FlexGridPdfConverter.draw(gridData.content, doc, null, null, gridData.settings);
                        doc.end();
                    });
                };
                /**
                 * Performs the PDF document generation started in a UI thread by calling the {@link PdfWebWorkerClient.export} method.
                 *
                 * @param draw The callback function to draw PDF.
                 * The function takes two parameters:
                 * <ul>
                 *     <li><b>doc</b>: An instance of the {@link wijmo.pdf.PdfDocument} class.</li>
                 *     <li><b>clientData</b>: A dictionary of {name: value} pairs that contains the data added on the client side.</li>
                 * </ul>
                 */
                PdfWebWorker.initExport = function (draw) {
                    self.addEventListener('message', function handler(e) {
                        self.removeEventListener('message', handler);
                        var data = e.data;
                        var clientData = JSON.parse(bufToStr(data.content));
                        var docSettings = data.settings || {};
                        docSettings.ended = function (sender, args) {
                            // Convert Blob to ArrayBuffer and send it to client
                            blobToBuf(args.blob, function (buffer) {
                                self.postMessage({ data: buffer, status: PdfWebWorkerResponseStatus.Done }, [buffer]);
                            });
                        };
                        var doc = new wijmo.pdf.PdfDocument(docSettings);
                        Object.keys(clientData).forEach(function (key) {
                            var value = clientData[key];
                            if (value.settings) {
                                value.settings = JSON.parse(value.settings);
                            }
                            if (value.isGrid) {
                                if (value.settings) {
                                    PdfWebWorker._disableUnsupportedFeatures(value.settings);
                                }
                                value.content = PdfWebWorker._deserializeGridFromString(value.content, value.settings);
                            }
                        });
                        draw(doc, clientData);
                    });
                };
                /**
                 * Sends the progress value to a client, where it will be handled by the {@link PdfWebWorkerClient.export}'s progress callback function.
                 * Should be used in conjunction with the {@link PdfWebWorkerClient.export} method to inform client about the progress of the export.
                 *
                 * @param value The progress value, in the range of [0.0..1.0].
                 */
                PdfWebWorker.sendExportProgress = function (value) {
                    value = wijmo.clamp(value, 0, 1);
                    self.postMessage({ data: value, status: PdfWebWorkerResponseStatus.Progress });
                };
                /**
                * Deserializes the {@link FlexGrid} from ArrayBuffer to its internal representation that can be used in a Web Worker and passed to the {@link FlexGridPdfConverter.draw} and {@link FlexGridPdfConverter.drawToPosition} methods.
                *
                * @param data The data to deserialize.
                * @param settings The draw settings used to deserialize the grid.
                */
                PdfWebWorker.deserializeGrid = function (data, settings) {
                    return this._deserializeGridFromString(bufToStr(data), settings);
                };
                PdfWebWorker._deserializeGridFromString = function (jsonStr, settings) {
                    return this._getJsonAdapter(JSON.parse(jsonStr), pdf.FlexGridPdfConverter._applyDefaultExportSettings(settings));
                };
                PdfWebWorker._disableUnsupportedFeatures = function (settings) {
                    settings.customCellContent = false;
                };
                PdfWebWorker._getJsonAdapter = function (json, settings) {
                    switch (json.typeName) {
                        case 'MultiRow':
                            return new MultiRowJsonAdapter(json, settings);
                        case 'PivotGrid':
                            return new PivotGridJsonAdapter(json, settings);
                        case 'TransposedGrid':
                            return new TransposedGridJsonAdapter(json, settings);
                        case 'TransposedMultiRow':
                            return new TransposedMultiRowJsonAdapter(json, settings);
                        default:
                            return new FlexGridJsonAdapter(json, settings);
                    }
                };
                return PdfWebWorker;
            }());
            pdf.PdfWebWorker = PdfWebWorker;
            //#region Utils
            function bufToStr(value) {
                var array = new Uint16Array(value);
                var str = "";
                for (var i = 0, len = array.length; i < len; i++) {
                    str += String.fromCharCode(array[i]);
                }
                return str;
                // unable to use due to stack overflow.
                // return String.fromCharCode.apply(null, array); 
            }
            function strToBuf(value) {
                var buffer = new ArrayBuffer(value.length * 2), view = new Uint16Array(buffer);
                for (var i = 0, len = value.length; i < len; i++) {
                    view[i] = value.charCodeAt(i);
                }
                return buffer;
            }
            function blobToBuf(blob, done) {
                wijmo.asFunction(done);
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    done(e.target.result);
                };
                fileReader.readAsArrayBuffer(blob);
            }
            //#endregion
            //#region FlexGrid JSON model
            var RowState;
            (function (RowState) {
                RowState[RowState["None"] = 0] = "None";
                RowState[RowState["Alternate"] = 1] = "Alternate";
                RowState[RowState["Group"] = 2] = "Group";
                RowState[RowState["ExpandableGroup"] = 4] = "ExpandableGroup";
                RowState[RowState["New"] = 8] = "New";
                RowState[RowState["Visible"] = 16] = "Visible";
                RowState[RowState["Detail"] = 32] = "Detail"; // instance of the wijmo.Detail.DetailRow class.
            })(RowState || (RowState = {}));
            var ColState;
            (function (ColState) {
                ColState[ColState["None"] = 0] = "None";
                ColState[ColState["Visible"] = 1] = "Visible";
            })(ColState || (ColState = {}));
            //#endregion FlexGrid JSON model
            //#region Converters
            var FlexGridJsonConverter = /** @class */ (function () {
                function FlexGridJsonConverter(flex, settings, adapter) {
                    this._flex = flex;
                    this._settings = settings;
                    this._adapter = adapter;
                }
                FlexGridJsonConverter.prototype.convert = function () {
                    var result = {};
                    result.typeName = this._getTypeName(this._flex);
                    result.selection = this._serializeSelection();
                    result.showColumnFooter = this.adapter.showColumnFooter;
                    result.showColumnHeader = this.adapter.showColumnHeader;
                    result.showRowHeader = this.adapter.showRowHeader;
                    result.treeIndent = this._flex.treeIndent;
                    result.bottomLeftCells = this._serializePanel(this._flex.bottomLeftCells);
                    result.cells = this._serializePanel(this._flex.cells);
                    result.columnFooters = this._serializePanel(this._flex.columnFooters);
                    result.columnHeaders = this._serializePanel(this._flex.columnHeaders);
                    result.rowHeaders = this._serializePanel(this._flex.rowHeaders);
                    result.topLeftCells = this._serializePanel(this._flex.topLeftCells);
                    return result;
                };
                Object.defineProperty(FlexGridJsonConverter.prototype, "adapter", {
                    get: function () {
                        return this._adapter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridJsonConverter.prototype, "flex", {
                    get: function () {
                        return this._flex;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridJsonConverter.prototype._getTypeName = function (flex) {
                    return flex.constructor.toString().match(/function\s*(\w+)/)[1];
                };
                FlexGridJsonConverter.prototype._getRowState = function (row) {
                    var state = RowState.None;
                    if (this.adapter.isAlternatingRow(row)) {
                        state |= RowState.Alternate;
                    }
                    if (row instanceof pdf.softGrid().GroupRow) {
                        state |= RowState.Group;
                    }
                    if (this.adapter.isDetailRow(row)) {
                        state |= RowState.Detail;
                    }
                    if (this.adapter.isExpandableGroupRow(row)) {
                        state |= RowState.ExpandableGroup;
                    }
                    if (row instanceof pdf.softGrid()._NewRowTemplate) {
                        state |= RowState.New;
                    }
                    if (row.isVisible) {
                        state |= RowState.Visible;
                    }
                    return state;
                };
                FlexGridJsonConverter.prototype._getColumnState = function (col) {
                    var state = ColState.None;
                    if (col.isVisible) {
                        state |= ColState.Visible;
                    }
                    return state;
                };
                FlexGridJsonConverter.prototype._serializeSelection = function () {
                    var selection = this.adapter.getSelection(), result = [];
                    for (var i = 0; i < selection.length; i++) {
                        var cr = selection[i];
                        result.push([cr.row, cr.col, cr.row2, cr.col2]);
                    }
                    return result;
                };
                FlexGridJsonConverter.prototype._serializeColumns = function (columns) {
                    var result = [];
                    for (var i = 0, len = (columns || []).length; i < len; i++) {
                        var col = columns[i], jcol = null;
                        if (col) {
                            jcol = {
                                aggregate: col.aggregate,
                                renderWidth: col.renderWidth,
                                visibleIndex: col.visibleIndex
                            };
                            var al = col.getAlignment();
                            if (al) {
                                jcol.alignment = al;
                            }
                            var state = this._getColumnState(col);
                            if (state !== ColState.None) {
                                jcol.state = state;
                            }
                            if (col.binding) {
                                jcol.binding = col.binding;
                            }
                            if (col.dataType != null) {
                                jcol.dataType = col.dataType;
                            }
                            if (col.name != null) {
                                jcol.name = col.name;
                            }
                            if (col.wordWrap) {
                                jcol.wordWrap = true;
                            }
                            if (col.multiLine) {
                                jcol.multiLine = true;
                            }
                        }
                        result.push(jcol);
                    }
                    return result;
                };
                FlexGridJsonConverter.prototype._serializePanel = function (panel) {
                    var _this = this;
                    var result = {
                        cellType: panel.cellType,
                        height: panel.height,
                        width: panel.width
                    };
                    // Taken from Column.getAlignment(row?: Row)
                    var getAlignment = function (row) {
                        if (row.align) {
                            return row.align;
                        }
                        if (!row.dataMap) {
                            switch (row.dataType) {
                                case wijmo.DataType.Boolean:
                                    return 'center';
                                case wijmo.DataType.Number:
                                    return 'right';
                            }
                        }
                        return null;
                    };
                    result.mergedRanges = this._serializeMergedRanges(panel);
                    result.columns = this._serializeColumns(panel.columns);
                    result.columnsFirstVisibleIndex = panel.columns.firstVisibleIndex;
                    result.rows = [];
                    result.rowsMaxGroupLevel = panel.rows.maxGroupLevel;
                    var collectErrors = !this._settings.customCellContent && this._flex._getShowErrors();
                    var _loop_1 = function (i, rowsLen, colsLen) {
                        var row = panel.rows[i];
                        var jrow = {
                            renderHeight: row.renderHeight
                        };
                        result.rows.push(jrow);
                        var al = getAlignment(row);
                        if (al) {
                            jrow.alignment = al;
                        }
                        if (row instanceof pdf.softGrid().GroupRow) {
                            jrow.level = row.level;
                        }
                        var state = this_1._getRowState(row);
                        if (state !== RowState.None) {
                            jrow.state = state;
                        }
                        if (row.binding) {
                            jrow.binding = row.binding;
                        }
                        if (row.dataType != null) {
                            jrow.dataType = row.dataType;
                        }
                        if (row.wordWrap) {
                            jrow.wordWrap = true;
                        }
                        if (row.multiLine) {
                            jrow.multiLine = true;
                        }
                        jrow.cells = [];
                        var sg = pdf.softGrid();
                        var _loop_2 = function (j) {
                            var value = this_1._adapter.getCellContent(panel, panel.rows[i], panel.columns[j], j);
                            if (wijmo.isFunction(this_1._settings.formatItem)) {
                                var fargs = new pdf.PdfFormatItemEventArgs(panel, new sg.CellRange(i, j), null, null, null, null, null, function () { return _this._adapter.getCell(panel, i, j, true); }, null);
                                fargs.data = value;
                                this_1._settings.formatItem(fargs);
                                if (fargs.data !== value) {
                                    value = fargs.data;
                                }
                            }
                            jrow.cells[j] = value;
                            if (collectErrors && this_1._flex._getError(panel, i, j)) {
                                if (!jrow.errors) {
                                    jrow.errors = {};
                                }
                                jrow.errors[j] = 1;
                            }
                        };
                        for (var j = 0; j < colsLen; j++) {
                            _loop_2(j);
                        }
                    };
                    var this_1 = this;
                    for (var i = 0, rowsLen = panel.rows.length, colsLen = panel.columns.length; i < rowsLen; i++) {
                        _loop_1(i, rowsLen, colsLen);
                    }
                    return result;
                };
                FlexGridJsonConverter.prototype._serializeMergedRanges = function (panel) {
                    var ranges = [];
                    var idc = [];
                    for (var i = 0; i < panel.columns.length; i++) {
                        idc[i] = 0;
                    }
                    for (var r = 0; r < panel.rows.length; r++) {
                        for (var c = 0; c < panel.columns.length; c++) {
                            if (r < idc[c]) {
                                continue;
                            }
                            var cr = panel.grid.getMergedRange(panel, r, c);
                            if (cr == null || cr.isSingleCell) {
                                continue;
                            }
                            ranges.push([cr.row, cr.col, cr.row2, cr.col2]);
                            for (var j = cr.col; j <= cr.col2; j++) {
                                idc[j] = cr.row2 + 1;
                            }
                            if (cr.col !== cr.col2) {
                                c = cr.col2;
                                continue;
                            }
                        }
                    }
                    return ranges;
                };
                return FlexGridJsonConverter;
            }());
            var MultiRowJsonConverter = /** @class */ (function (_super) {
                __extends(MultiRowJsonConverter, _super);
                function MultiRowJsonConverter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MultiRowJsonConverter.prototype.convert = function () {
                    var result = _super.prototype.convert.call(this);
                    result.rowsPerItem = this.flex.rowsPerItem;
                    return result;
                };
                MultiRowJsonConverter.prototype._serializePanel = function (panel) {
                    var result = _super.prototype._serializePanel.call(this, panel);
                    result.cellGroups = this._serializeCellGroup(panel);
                    return result;
                };
                MultiRowJsonConverter.prototype._serializeCellGroup = function (panel) {
                    var bindingColumns = [], mappings = [], sg = pdf.softGrid();
                    var cnt = this.flex.rowsPerItem;
                    if (panel.cellType === sg.CellType.TopLeft || panel.cellType === sg.CellType.ColumnHeader) {
                        cnt = panel.rows.length;
                    }
                    for (var r = 0; r < cnt; r++) {
                        mappings[r] = [];
                        for (var c = 0; c < panel.columns.length; c++) {
                            var bc = this.flex.getBindingColumn(panel, r, c);
                            var idx = bindingColumns.indexOf(bc);
                            if (idx < 0) {
                                mappings[r][c] = bindingColumns.push(bc) - 1;
                            }
                            else {
                                mappings[r][c] = idx;
                            }
                        }
                    }
                    return {
                        bindingColumns: this._serializeColumns(bindingColumns),
                        mappings: mappings
                    };
                };
                return MultiRowJsonConverter;
            }(FlexGridJsonConverter));
            var PivotGridJsonConverter = /** @class */ (function (_super) {
                __extends(PivotGridJsonConverter, _super);
                function PivotGridJsonConverter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PivotGridJsonConverter.prototype.convert = function () {
                    var result = _super.prototype.convert.call(this);
                    result.centerHeadersVertically = this.flex.centerHeadersVertically;
                    return result;
                };
                return PivotGridJsonConverter;
            }(FlexGridJsonConverter));
            var TransposedGridJsonConverter = /** @class */ (function (_super) {
                __extends(TransposedGridJsonConverter, _super);
                function TransposedGridJsonConverter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TransposedGridJsonConverter.prototype.convert = function () {
                    var result = _super.prototype.convert.call(this);
                    var rowInfo = new Array(this.flex.cells.rows.length), p = this.flex.cells, sg = pdf.softGrid();
                    for (var i = 0, len = p.rows.length; i < len; i++) {
                        var dataItem = (p.rows[i].dataItem), ri = dataItem && dataItem._rowInfo;
                        if (!(ri instanceof sg.Column)) { // _rowInfo is a POJO, it means that TransposedGrid has autogenerated rows.
                            ri = pdf._combineColumns(ri, ri); // turn it into a _IColumn-like object.
                        }
                        rowInfo[i] = ri;
                    }
                    result.rowInfo = this._serializeColumns(rowInfo);
                    return result;
                };
                return TransposedGridJsonConverter;
            }(FlexGridJsonConverter));
            var TransposedMultirowJsonConverter = /** @class */ (function (_super) {
                __extends(TransposedMultirowJsonConverter, _super);
                function TransposedMultirowJsonConverter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TransposedMultirowJsonConverter.prototype.convert = function () {
                    var result = _super.prototype.convert.call(this);
                    result.cellGroups = this._serializeCellGroup();
                    result.columnsPerItem = this.flex.columnsPerItem;
                    return result;
                };
                TransposedMultirowJsonConverter.prototype._serializeCellGroup = function () {
                    var bindingColumns = [], mappings = [];
                    var cnt = this.flex.columnsPerItem, panel = this.flex.cells;
                    for (var r = 0; r < panel.rows.length; r++) {
                        mappings[r] = [];
                        for (var c = 0; c < cnt; c++) {
                            var bc = this.flex.getBindingColumn(panel, r, c);
                            var idx = bindingColumns.indexOf(bc);
                            if (idx < 0) {
                                mappings[r][c] = bindingColumns.push(bc) - 1;
                            }
                            else {
                                mappings[r][c] = idx;
                            }
                        }
                    }
                    return {
                        bindingColumns: this._serializeColumns(bindingColumns),
                        mappings: mappings
                    };
                };
                return TransposedMultirowJsonConverter;
            }(FlexGridJsonConverter));
            //#endregion Converters
            //#region Adapters
            /*abstract class RowColJson implements _IRowCol {
            public readonly index: number;
            public readonly binding: string | null;
            public readonly dataType: number | null;
            public abstract readonly isVisible: boolean;
            
            constructor(json: IRowColJson, index: number) {
                this.index = index;
                this.binding = json.binding;
                this.dataType = json.dataType;
            }
            }*/
            var RowJson /*extends RowColJson*/ = /** @class */ (function () {
                function RowJson(json, index) {
                    //super(json, index);
                    this.index = index;
                    this.binding = json.binding;
                    this.dataType = json.dataType;
                    this.alignment = json.alignment;
                    this.level = json.level;
                    this.renderHeight = json.renderHeight;
                    this.cells = json.cells;
                    this.wordWrap = json.wordWrap || false;
                    this.multiLine = json.multiLine || false;
                    this.errors = json.errors;
                    this._state = json.state;
                }
                Object.defineProperty(RowJson.prototype, "isAlternatingRow", {
                    get: function () {
                        return (this._state & RowState.Alternate) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowJson.prototype, "isGroupRow", {
                    get: function () {
                        return (this._state & RowState.Group) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowJson.prototype, "isDetailRow", {
                    get: function () {
                        return (this._state & RowState.Detail) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowJson.prototype, "isExpandableGroupRow", {
                    get: function () {
                        return (this._state & RowState.ExpandableGroup) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowJson.prototype, "isNewRow", {
                    get: function () {
                        return (this._state & RowState.New) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RowJson.prototype, "isVisible", {
                    get: function () {
                        return (this._state & RowState.Visible) !== RowState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RowJson;
            }());
            var ColumnJson /*extends RowColJson*/ = /** @class */ (function () {
                function ColumnJson(json, index) {
                    //super(json, index);
                    this.index = index;
                    this.binding = json.binding;
                    this.dataType = json.dataType;
                    this.aggregate = json.aggregate;
                    this.name = json.name;
                    this.renderWidth = json.renderWidth;
                    this.visibleIndex = json.visibleIndex;
                    this.wordWrap = json.wordWrap || false;
                    this.multiLine = json.multiLine || false;
                    this._alignment = json.alignment;
                    this._state = json.state;
                }
                ColumnJson.prototype.getAlignment = function (row) {
                    if (this._alignment) {
                        return this._alignment;
                    }
                    if (row && row.alignment) {
                        return row.alignment;
                    }
                    return '';
                };
                Object.defineProperty(ColumnJson.prototype, "isVisible", {
                    get: function () {
                        return (this._state & ColState.Visible) !== ColState.None;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ColumnJson;
            }());
            var RowJsonCollection = /** @class */ (function () {
                function RowJsonCollection(json, maxGroupLevel) {
                    if (maxGroupLevel === void 0) { maxGroupLevel = -1; }
                    //this._maxGroupLevel = json.maxGroupLevel;
                    this.maxGroupLevel = maxGroupLevel;
                    this.length = json.length;
                    for (var i = 0; i < json.length; i++) {
                        this[i] = new RowJson(json[i], i);
                    }
                }
                return RowJsonCollection;
            }());
            var ColumnJsonCollection = /** @class */ (function () {
                function ColumnJsonCollection(json, firstVisibleIndex) {
                    if (firstVisibleIndex === void 0) { firstVisibleIndex = -1; }
                    //this._firstVisibleIndex = json.firstVisibleIndex;
                    this.firstVisibleIndex = firstVisibleIndex;
                    this.length = json.length;
                    for (var i = 0; i < json.length; i++) {
                        var ji = json[i];
                        this[i] = ji ? new ColumnJson(json[i], i) : null;
                    }
                }
                return ColumnJsonCollection;
            }());
            var GridJsonPanel = /** @class */ (function () {
                function GridJsonPanel(json) {
                    this.height = json.height;
                    this.width = json.width;
                    this.cellType = json.cellType;
                    this.columns = new ColumnJsonCollection(json.columns, json.columnsFirstVisibleIndex);
                    this.rows = new RowJsonCollection(json.rows, json.rowsMaxGroupLevel);
                    this._mergedRanges = this._deserializeMergedRanges(json.mergedRanges);
                }
                GridJsonPanel.prototype.getCellData = function (r, c) {
                    return this.rows[r].cells[c];
                };
                GridJsonPanel.prototype.getMergedRange = function (r, c) {
                    var mr = this._mergedRanges[r];
                    if (mr) {
                        for (var i = 0, len = mr.length; i < len; i++) {
                            var range = mr[i];
                            if (c >= range.col && c <= range.col2) {
                                return range;
                            }
                        }
                    }
                    return null;
                };
                GridJsonPanel.prototype._deserializeMergedRanges = function (ranges) {
                    var result = [];
                    ranges = ranges || [];
                    for (var i = 0, len = this.rows.length; i < len; i++) {
                        result[i] = [];
                    }
                    for (var i = 0, len = ranges.length; i < len; i++) {
                        var item = ranges[i], cr = new pdf._CellRange(item[0], item[1], item[2], item[3]);
                        for (var j = cr.row; j <= cr.row2; j++) {
                            result[j].push(cr);
                        }
                    }
                    return result;
                };
                return GridJsonPanel;
            }());
            var FlexGridJsonAdapter = /** @class */ (function () {
                function FlexGridJsonAdapter(json, settings) {
                    this.settings = settings;
                    this.bottomLeftCells = this.deserializePanel(json.bottomLeftCells);
                    this.cells = this.deserializePanel(json.cells);
                    this.columnFooters = this.deserializePanel(json.columnFooters);
                    this.columnHeaders = this.deserializePanel(json.columnHeaders);
                    this.rowHeaders = this.deserializePanel(json.rowHeaders);
                    this.topLeftCells = this.deserializePanel(json.topLeftCells);
                    this.treeIndent = json.treeIndent;
                    this.showColumnFooter = json.showColumnFooter;
                    this.showColumnHeader = json.showColumnHeader;
                    this.showRowHeader = json.showRowHeader;
                    this._selection = [];
                    for (var i = 0; i < json.selection.length; i++) {
                        var item = json.selection[i];
                        this._selection.push(new pdf._CellRange(item[0], item[1], item[2], item[3]));
                    }
                }
                Object.defineProperty(FlexGridJsonAdapter.prototype, "columns", {
                    get: function () {
                        return this.cells.columns;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridJsonAdapter.prototype, "rows", {
                    get: function () {
                        return this.cells.rows;
                    },
                    enumerable: true,
                    configurable: true
                });
                FlexGridJsonAdapter.prototype.getSelection = function () {
                    return this._selection;
                };
                FlexGridJsonAdapter.prototype.getCell = function (panel, row, column, updateContent) {
                    throw 'Not implemented';
                };
                FlexGridJsonAdapter.prototype.getComputedDefBorderColor = function () {
                    throw 'Not implemented';
                };
                FlexGridJsonAdapter.prototype.getComputedStyle = function (panel, cell) {
                    throw 'Not implemented';
                };
                FlexGridJsonAdapter.prototype.getMergedRange = function (p, r, c) {
                    return p.getMergedRange(r, c);
                };
                FlexGridJsonAdapter.prototype.alignMergedTextToTheTopRow = function (panel) {
                    return false;
                };
                FlexGridJsonAdapter.prototype.getCellData = function (panel, row, col) {
                    return panel.getCellData(row, col);
                };
                FlexGridJsonAdapter.prototype.getCellContent = function (panel, row, col, colIdx) {
                    return this.getCellData(panel, row.index, colIdx);
                };
                FlexGridJsonAdapter.prototype.isBooleanCell = function (panel, row, col) {
                    return col.dataType === wijmo.DataType.Boolean && panel.cellType === pdf._CellType.Cell && !this.isExpandableGroupRow(row);
                };
                FlexGridJsonAdapter.prototype.getColumn = function (panel, row, col) {
                    return panel.columns[col];
                };
                FlexGridJsonAdapter.prototype.isAlternatingRow = function (row) {
                    return row.isAlternatingRow;
                };
                FlexGridJsonAdapter.prototype.isGroupRow = function (row) {
                    return row.isGroupRow;
                };
                FlexGridJsonAdapter.prototype.isNewRow = function (row) {
                    return row.isNewRow;
                };
                FlexGridJsonAdapter.prototype.isDetailRow = function (row) {
                    return row.isDetailRow;
                };
                FlexGridJsonAdapter.prototype.isExpandableGroupRow = function (row) {
                    return row.isExpandableGroupRow;
                };
                FlexGridJsonAdapter.prototype.isRenderableRow = function (row) {
                    return row.isVisible && row.renderHeight > 0 && !this.isNewRow(row);
                };
                FlexGridJsonAdapter.prototype.isRenderableColumn = function (col) {
                    return col.isVisible && col.renderWidth > 0;
                };
                FlexGridJsonAdapter.prototype.getCellStyle = function (panel, row, column) {
                    var styles = this.settings.styles, result = pdf._merge({}, styles.cellStyle); // merge cell styles
                    switch (panel.cellType) {
                        case pdf._CellType.Cell:
                            if (this.isExpandableGroupRow(row)) {
                                pdf._merge(result, styles.groupCellStyle, true);
                            }
                            else {
                                if (this.isAlternatingRow(row)) { // check row.index value; row.index == rowIndex.
                                    pdf._merge(result, styles.altCellStyle, true);
                                }
                            }
                            break;
                        case pdf._CellType.ColumnHeader:
                        case pdf._CellType.RowHeader:
                        case pdf._CellType.TopLeft:
                        case pdf._CellType.BottomLeft:
                            pdf._merge(result, styles.headerCellStyle, true);
                            break;
                        case pdf._CellType.ColumnFooter:
                            pdf._merge(result, styles.headerCellStyle, true);
                            pdf._merge(result, styles.footerCellStyle, true);
                            break;
                    }
                    if (row.errors && row.errors[column.index]) {
                        pdf._merge(result, styles.errorCellStyle, true);
                    }
                    return result;
                };
                FlexGridJsonAdapter.prototype.deserializePanel = function (json) {
                    return new GridJsonPanel(json);
                };
                return FlexGridJsonAdapter;
            }());
            var PivotGridJsonAdapter = /** @class */ (function (_super) {
                __extends(PivotGridJsonAdapter, _super);
                function PivotGridJsonAdapter(json, settings) {
                    var _this = _super.call(this, json, settings) || this;
                    _this._centerHeadersVertically = json.centerHeadersVertically;
                    return _this;
                }
                // override
                PivotGridJsonAdapter.prototype.alignMergedTextToTheTopRow = function (panel) {
                    return !this._centerHeadersVertically && (panel.cellType === pdf._CellType.ColumnHeader || panel.cellType === pdf._CellType.RowHeader);
                };
                return PivotGridJsonAdapter;
            }(FlexGridJsonAdapter));
            var MultiRowJsonPanel = /** @class */ (function (_super) {
                __extends(MultiRowJsonPanel, _super);
                function MultiRowJsonPanel(json) {
                    var _this = _super.call(this, json) || this;
                    if (json.cellGroups) {
                        _this._cellGroups = {
                            bindingColumns: new ColumnJsonCollection(json.cellGroups.bindingColumns),
                            mappings: json.cellGroups.mappings
                        };
                    }
                    return _this;
                }
                MultiRowJsonPanel.prototype.getColumn = function (r, c, rowsPerItem) {
                    var rCol = this.columns[c];
                    if (this._cellGroups) {
                        if (this.cellType !== pdf._CellType.ColumnHeader && this.cellType !== pdf._CellType.BottomLeft) {
                            r = r % rowsPerItem;
                        }
                        var bCol = this._cellGroups.bindingColumns[this._cellGroups.mappings[r][c]];
                        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                        return pdf._combineColumns(rCol, bCol);
                    }
                    return rCol;
                };
                return MultiRowJsonPanel;
            }(GridJsonPanel));
            var MultiRowJsonAdapter = /** @class */ (function (_super) {
                __extends(MultiRowJsonAdapter, _super);
                function MultiRowJsonAdapter(json, settings) {
                    var _this = _super.call(this, json, settings) || this;
                    _this._rowsPerItem = json.rowsPerItem;
                    return _this;
                }
                // override
                MultiRowJsonAdapter.prototype.deserializePanel = function (json) {
                    return new MultiRowJsonPanel(json);
                };
                // override
                MultiRowJsonAdapter.prototype.getColumn = function (panel, row, col) {
                    return panel.getColumn(row, col, this._rowsPerItem);
                };
                return MultiRowJsonAdapter;
            }(FlexGridJsonAdapter));
            var TransposedGridJsonAdapter = /** @class */ (function (_super) {
                __extends(TransposedGridJsonAdapter, _super);
                function TransposedGridJsonAdapter(json, settings) {
                    var _this = _super.call(this, json, settings) || this;
                    _this._rowInfo = new ColumnJsonCollection(json.rowInfo);
                    return _this;
                }
                TransposedGridJsonAdapter.prototype.getColumn = function (panel, row, col) {
                    var rCol = _super.prototype.getColumn.call(this, panel, row, col);
                    if (panel.cellType !== pdf._CellType.Cell) {
                        return rCol;
                    }
                    else {
                        var bCol = this._rowInfo[row];
                        if (!bCol) {
                            return rCol;
                        }
                        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                        return pdf._combineColumns(rCol, bCol);
                    }
                };
                return TransposedGridJsonAdapter;
            }(FlexGridJsonAdapter));
            var TransposedMultiRowJsonAdapter = /** @class */ (function (_super) {
                __extends(TransposedMultiRowJsonAdapter, _super);
                function TransposedMultiRowJsonAdapter(json, settings) {
                    var _this = _super.call(this, json, settings) || this;
                    _this._columnsPerItem = json.columnsPerItem;
                    if (json.cellGroups) {
                        _this._cellGroups = {
                            bindingColumns: new ColumnJsonCollection(json.cellGroups.bindingColumns),
                            mappings: json.cellGroups.mappings
                        };
                    }
                    return _this;
                }
                TransposedMultiRowJsonAdapter.prototype.getColumn = function (panel, row, col) {
                    var rCol = _super.prototype.getColumn.call(this, panel, row, col);
                    if (this._cellGroups && panel.cellType === pdf._CellType.Cell) {
                        col = col % this._columnsPerItem;
                        var bCol = this._cellGroups.bindingColumns[this._cellGroups.mappings[row][col]];
                        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
                        return pdf._combineColumns(rCol, bCol);
                    }
                    return rCol;
                };
                return TransposedMultiRowJsonAdapter;
            }(FlexGridJsonAdapter));
            //#endregion Adapters
        })(pdf = grid_3.pdf || (grid_3.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var pdf;
        (function (pdf) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.pdf', wijmo.grid.pdf);
        })(pdf = grid.pdf || (grid.pdf = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.pdf.js.map