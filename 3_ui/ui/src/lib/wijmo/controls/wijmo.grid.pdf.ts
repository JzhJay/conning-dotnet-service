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


    module wijmo.grid.pdf {
    









'use strict';

export function softGrid(): typeof wijmo.grid {
    return wijmo._getModule('wijmo.grid');
}

export function softDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}

export function softMultiRow(): typeof wijmo.grid.multirow {
    return wijmo._getModule('wijmo.grid.multirow');
}

export function softSheet(): typeof wijmo.grid.sheet {
    return wijmo._getModule('wijmo.grid.sheet');
}

export function softOlap(): typeof wijmo.olap {
    return wijmo._getModule('wijmo.olap');
}

export function softTransposed(): typeof wijmo.grid.transposed {
    return wijmo._getModule('wijmo.grid.transposed');
}

export function softTransposedMultiRow(): typeof wijmo.grid.transposedmultirow {
    return wijmo._getModule('wijmo.grid.transposedmultirow');
}
    }
    


    module wijmo.grid.pdf {
    

'use strict';

/**
 * Specifies how the grid content should be scaled to fit the page.
 */
export enum ScaleMode {
    /**
     * Render the grid in actual size, breaking into pages as needed.
     */
    ActualSize,
    /**
     * Scale the grid, so that it fits the page width.
     */
    PageWidth,
    /**
     * Scale the grid, so that it fits on a single page.
     */
    SinglePage
}

/**
 * Specifies whether the whole grid or just a section should be rendered.
 */
export enum ExportMode {
    /**
     * Exports all the data from grid.
     */
    All,
    /**
     * Exports the current selection only.
     */
    Selection
}
    }
    


    module wijmo.grid.pdf {
    



/**
 * Represents the look and feel of a cell.
 */
export interface ICellStyle {
    /**
     * Represents the background color of a cell.
     */
    backgroundColor?: string;
    /**
     * Represents the border color of a cell.
     */
    borderColor?: string,
    /**
     * Represents the text color of a cell.
     */
    color?: string;
    /**
     * Represents the font of a cell.
     */
    font?: any; // wijmo.pdf.PdfFont;
}

/**
 * Represents the look and feel of the {@link FlexGrid} being exported.
 */
export interface IFlexGridStyle {
    /**
     * Specifies the cell style applied to cells within a {@link FlexGrid}.
     */
    cellStyle?: ICellStyle;
    /**
     * Represents the cell style applied to odd-numbered rows of the {@link FlexGrid}.
     */
    altCellStyle?: ICellStyle;
    /**
     * Represents the cell style applied to grouped rows of the {@link FlexGrid}.
     */
    groupCellStyle?: ICellStyle;
    /**
     * Represents the cell style applied to row headers and column headers of 
     * the {@link FlexGrid}.
     */
    headerCellStyle?: ICellStyle;
    /**
     * Represents the cell style applied to column footers of the {@link FlexGrid}.
     */
    footerCellStyle?: ICellStyle;
    /**
     * Represents the cell style applied to cells of the {@link FlexGrid} that contain
     * validation errors if the {@link FlexGrid.showErrors} property is enabled.
     */
    errorCellStyle?: ICellStyle;
}

/**
 * Represents the settings used by the {@link FlexGridPdfConverter.draw} and 
 * {@link FlexGridPdfConverter.drawToPosition} methods.
 */
export interface IFlexGridDrawSettings {
    /**
     * Indicates whether custom cell content and style should be evaluated and exported.
     * If set to true then export logic will retrieve cell content using cell.innerText property,
     * and cell style using getComputedStyle(cell).
     * Default is 'undefined' (i.e. false).
     */
    customCellContent?: boolean;
    /**
     * Indicates whether to draw detail rows.
     * If set to false then the detail rows will be ignored; otherwise the detail rows will be drawn empty
     * and their content should be drawn manually using formatItem event handler.
     * Default is 'undefined' (i.e. false).
     */
    drawDetailRows?: boolean;
    /**
     * Represents an array of custom fonts that will be embedded into the document.
     *
     * This sample illustrates how to setup the FlexGridPdfConverter to use two custom
     * fonts, Cuprum-Bold.ttf and Cuprum-Regular.ttf. The first one is applied to the 
     * header cells only, while the second one is applied to all the remaining cells.
     *
     * <pre>
     * wijmo.grid.pdf.FlexGridPdfConverter.export(flex, fileName, {
     *    embeddedFonts: [{
     *       source: 'resources/ttf/Cuprum-Bold.ttf',
     *       name: 'cuprum',
     *       style: 'normal',
     *       weight: 'bold'
     *    }, {
     *       source: 'resources/ttf/Cuprum-Regular.ttf',
     *       name: 'cuprum',
     *       style: 'normal',
     *       weight: 'normal'
     *    }],
     *    styles: {
     *       cellStyle: {
     *          font: {
     *             family: 'cuprum'
     *          }
     *       },
     *       headerCellStyle: {
     *          font: {
     *             weight: 'bold'
     *          }
     *       }
     *    }
     * });
     * </pre>
     */
    embeddedFonts?: wijmo.pdf.IPdfFontFile[];
    /**
     * Determines the export mode.
     */
    exportMode?: ExportMode;
    /**
     * An optional callback function called for every exported cell that allows to perform transformations of exported
     * cell value and style, or perform a custom drawing.
     *
     * The function accepts the {@link PdfFormatItemEventArgs} class instance as the first argument.
     *
     * In case of custom drawing the {@link PdfFormatItemEventArgs.cancel} property should be set to true to cancel the default cell content drawing, and
     * the {@link PdfFormatItemEventArgs.cancelBorders} property should be set to true to cancel the default cell borders drawing.
     *
     * <pre>
     * wijmo.grid.pdf.FlexGridPdfConverter.export(flex, fileName, {
     *    formatItem: function(args) {
     *        // Change the background color of the regular cells of "Country" column.
     *        if (args.panel.cellType === wijmo.grid.CellType.Cell && args.panel.columns[args.col].binding === "country") {
     *            args.style.backgroundColor = 'blue';
     *        }
     *    }
     * });</pre>
     */
    formatItem?: (args: PdfFormatItemEventArgs) => void;
    /**
     * Determines the maximum number of pages to export.
     */
    maxPages?: number;
    /**
     * Indicates whether merged values should be repeated across pages when the merged range
     * is split on multiple pages.
     */
    repeatMergedValuesAcrossPages?: boolean;
    /**
     * Indicates whether star-sized columns widths should be recalculated against the PDF page
     * width instead of using the grid's width.
     */
    recalculateStarWidths?: boolean;
    /**
     * Represents the look and feel of an exported {@link FlexGrid}.
     */
    styles?: IFlexGridStyle;

    /**
     * An optional function that gives feedback about the progress of a task.
     * The function accepts a single argument, a number changing from 0.0 to 1.0, where the value of 0.0 indicates that
     * the operation has just begun and the value of 1.0 indicates that the operation has completed.
     *
     * <pre>
     * wijmo.grid.pdf.FlexGridPdfConverter.export(flex, fileName, {
     *    progress: function(value) {
     *        // Handle the progress here.
     *    }
     * });</pre>
     */
    progress?: (value: number) => void;

    /**
     * When turned on, decreases the drawing time by activating the cell styles caching if {@link IFlexGridDrawSettings.customCellContent} property is enabled.
     *
     * The combination of cell's inline style specific properties, own CSS classes and CSS classes of row containing the cell is used as
     * the cache tag. Before the cell style is calculated, the cache is checked first, and if the style associated with the tag is found there,
     * it's taken from there and doesn't get recalculated.
     *
     * Using this mode can make the drawing slower when considerable amount of cells have the unique set of CSS classes and inline styles.
     * Also, when pseudo classes like :first-child and :nth-child are used to style the cells and rows, the cell styles can be determined
     * incorrectly.
     *
     * The default value is <b>true</b>.
     */
    quickCellStyles?: boolean;

    _progressMax?: number; // [0..1], 0% to 100%
}

/**
 * Represents the settings used by the {@link FlexGridPdfConverter.export} method.
 */
export interface IFlexGridExportSettings extends IFlexGridDrawSettings {
    /**
     * Determines the scale mode.
     */
    scaleMode?: ScaleMode;
    /**
     * Represents the options of the underlying {@link PdfDocument}.
     */
    documentOptions?: wijmo.pdf.IPdfDocumentOptions;
}
    }
    


    module wijmo.grid.pdf {
    



'use strict'

export interface _IFlexGridAdapter {
    columns: _IColumnCollection;
    rows: _IRowCollection;

    bottomLeftCells: _IGridPanel;
    cells: _IGridPanel;
    columnFooters: _IGridPanel;
    columnHeaders: _IGridPanel;
    rowHeaders: _IGridPanel;
    topLeftCells: _IGridPanel;

    treeIndent: number;

    getSelection(): _ICellRange[];
    getComputedStyle(panel: _IGridPanel, cell: HTMLElement): CSSStyleDeclaration;
    getComputedDefBorderColor(): string;
    getMergedRange(p: _IGridPanel, r: number, c: number): _ICellRange;

    showColumnHeader: boolean;
    showRowHeader: boolean;
    showColumnFooter: boolean;
    alignMergedTextToTheTopRow(panel: _IGridPanel): boolean;
    getCell(panel: _IGridPanel, row: number, column: number, updateContent: boolean): HTMLElement;
    getCellContent(panel: _IGridPanel, row: _IRow, col: _IColumn, colIdx: number): string;
    getCellStyle(panel: _IGridPanel, row: _IRow, col: _IColumn): ICellStyle;
    getColumn(panel: _IGridPanel, row: number, col: number): _IColumn;
    isAlternatingRow(row: _IRow): boolean;
    isBooleanCell(panel: _IGridPanel, row: _IRow, col: _IColumn): boolean;
    isGroupRow(row: _IRow): boolean;
    isNewRow(row: _IRow): boolean;
    isDetailRow(row: _IRow): boolean;
    isExpandableGroupRow(row: _IRow): boolean;
    isRenderableRow(row: _IRow): boolean;
    isRenderableColumn(col: _IColumn): boolean;
}

export interface _IGridPanel {
    columns: _IColumnCollection;
    cellType: number;
    rows: _IRowCollection;

    height: number;
    width: number;
}

export interface _IColumnCollection {
    [index: number]: _IColumn;
    firstVisibleIndex: number;
    length: number;
}

export interface _IRowCol {
    dataType?: number;
    binding?: string;
    index: number;
    isVisible: boolean;
}

export interface _IColumn extends _IRowCol {
    aggregate: number;
    name?: string;
    visibleIndex: number;
    renderWidth: number;
    wordWrap: boolean;
    multiLine: boolean;
    getAlignment(row?: _IRow): string;
}

export interface _ICellRange {
    row: number;
    col: number;
    row2: number;
    col2: number;
    bottomRow: number;
    rightCol: number;
    leftCol: number;
    topRow: number;
    isValid: boolean;
    rowSpan: number;
    columnSpan: number;
    isSingleCell: boolean;

    getRenderSize(flex: _IFlexGridAdapter, panel: _IGridPanel): wijmo.Size;
    clone(): _ICellRange;
}

export interface _IRowCollection {
    [index: number]: _IRow;
    length: number;
    maxGroupLevel: number;
}

export interface _IRow extends _IRowCol {
    level?: number;
    renderHeight: number;
    wordWrap: boolean;
    multiLine: boolean;
}

// An equivalent of wijmo.grid.CellType
export enum _CellType {
    None = 0,
    Cell = 1,
    ColumnHeader = 2,
    RowHeader = 3,
    TopLeft = 4,
    ColumnFooter = 5,
    BottomLeft = 6
}
    }
    


    module wijmo.grid.pdf {
    


'use strict';

/*
 * Merges the content of the source object with the destination object.
 *
 * @param dst The destination object.
 * @param src The source object.
 * @param overwrite Indicates whether the existing properties should be overwritten.
 * @return The modified destination object. 
 */
export function _merge(dst: any, src: any, overwrite = false): any {
    if (!dst && src) {
        dst = {};
    }

    if (src && dst) {
        for (var key in src) {
            var srcProp = src[key],
                dstProp = dst[key];

            if (!wijmo.isObject(srcProp)) {
                if (dstProp === undefined || (overwrite && srcProp !== undefined)) {
                    dst[key] = srcProp;
                }
            } else {
                if (dstProp === undefined || !wijmo.isObject(dstProp) && overwrite) {
                    if (wijmo.isFunction(srcProp.clone)) {
                        dst[key] = dstProp = srcProp.clone();
                        continue;
                    } else {
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

// Used when obtaining a binding column from MultiRow and TransposedGrid, which is virtual for these controls.
export function _combineColumns(regCol: _IColumn, bndCol: _IColumn): _IColumn {
    return {
        aggregate: bndCol.aggregate,
        binding: bndCol.binding,
        name: bndCol.name,
        dataType: bndCol.dataType,
        wordWrap: bndCol.wordWrap,
        multiLine: bndCol.multiLine,
            getAlignment: (/*row*/) => {
                if ('getAlignment' in bndCol) { // in case if bndCol is a POJO (TransposedGrid) 
                    return bndCol.getAlignment(/*row*/)
                }

                return undefined;
            },
        index: regCol.index,
        visibleIndex: regCol.visibleIndex,
        isVisible: regCol.isVisible,
        renderWidth: regCol.renderWidth
    };
}

export function _cloneStyle(val: CSSStyleDeclaration): any {
    if (!val) {
        return null;
    }

    var res = {},
        toCamel = (val: string) => val.replace(/\-([a-z])/g, (match: string, group: string, offset: number) => {
            return offset > 0
                ? group.toUpperCase()
                : group;
        });

    for (let i = 0, len = val.length; i < len; i++) {
        let name = val[i];
        res[toCamel(name)] = val.getPropertyValue(name);
    }

    return res;
}
    }
    


    module wijmo.grid.pdf {
    






'use strict';

/**
 * Represents arguments of the IFlexGridDrawSettings.formatItem callback.
 */
export class PdfFormatItemEventArgs extends /*wijmo.grid.CellRangeEventArgs*/ wijmo.CancelEventArgs {
    private _p: wijmo.grid.GridPanel;
    private _rng: wijmo.grid.CellRange;
    private _data: any;

    private _canvas: wijmo.pdf.PdfPageArea;
    private _cell: HTMLElement;
    private _clientRect: wijmo.Rect;
    private _contentRect: wijmo.Rect;
    private _textRect: wijmo.Rect;
    private _style: ICellStyle;
    private _getFormattedCell: () => HTMLElement;
    private _getTextRect: () => wijmo.Rect;

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
    constructor(p: any /*_IGridPanel*/, rng: any /*_ICellRange*/, cell: HTMLElement, canvas: wijmo.pdf.PdfPageArea, clientRect: wijmo.Rect, contentRect: wijmo.Rect, style: ICellStyle, getFormattedCell: () => HTMLElement, getTextRect: () => wijmo.Rect) {
        super();

        this._p = p;
        this._rng = rng;

        if (typeof (HTMLElement) !== 'undefined') {
            this._cell = wijmo.asType(cell, HTMLElement, true);
        }

        this._canvas = canvas;
        this._clientRect = clientRect;
        this._contentRect = contentRect;
        this._style = style;
        this._getFormattedCell = getFormattedCell;
        this._getTextRect = getTextRect;
    }

    /**
     * Gets the {@link GridPanel} affected by this event.
     */
    get panel(): wijmo.grid.GridPanel {
        return this._p;
    }
    /**
     * Gets the {@link CellRange} affected by this event.
     */
    get range(): wijmo.grid.CellRange {
        return this._rng.clone();
    }
    /**
     * Gets the row affected by this event.
     */
    get row(): number {
        return this._rng.row;
    }
    /**
     * Gets the column affected by this event.
     */
    get col(): number {
        return this._rng.col;
    }
    /**
     * Gets or sets the data associated with the event.
     */
    get data(): any {
        return this._data;
    }
    set data(value: any) {
        this._data = value;
    }

    /**
     * Gets or sets a value that indicates that default cell borders drawing should be canceled.
     */
    public cancelBorders = false;

    /**
     * Gets the canvas to perform the custom painting on.
     */
    get canvas(): wijmo.pdf.PdfPageArea {
        return this._canvas;
    }

    /**
     * Gets a reference to the element that represents the grid cell being rendered.
     * If IFlexGridDrawSettings.customCellContent is set to true then contains
     * reference to the element that represents the formatted grid cell; otherwise, a null value.
     */
    get cell(): HTMLElement {
        return this._cell;
    }

    /**
     * Gets the client rectangle of the cell being rendered in canvas coordinates.
     */
    get clientRect(): wijmo.Rect {
        return this._clientRect;
    }

    /**
     * Gets the content rectangle of the cell being rendered in canvas coordinates.
     */
    get contentRect(): wijmo.Rect {
        return this._contentRect;
    }

    /**
     * Draws the background of the cell with the specified brush or color, or, if it is not specified, with the value of the {@link style.backgroundColor} property.
     * @param brush The brush or color to use.
     */
    drawBackground(brush?: wijmo.pdf.PdfBrush | wijmo.Color | string): void {
        _CellRenderer._drawBackground(this.canvas, this.clientRect, brush || this.style.backgroundColor);
    }

    /**
     * Returns a reference to the element that represents the grid cell being rendered.
     * This method is useful when export of custom formatting is disabled, but you need
     * to export custom content for certain cells.
     */
    getFormattedCell(): HTMLElement {
        return wijmo.asFunction(this._getFormattedCell)();
    }

    /**
     * Gets an object that represents the style of the cell being rendered.
     * If IFlexGridDrawSettings.customCellContent is set to true then the style is inferred
     * from the cell style; othwerwise it contains a combination of the IFlexGridDrawSettings.styles export
     * setting, according to the row type of exported cell.
     */
    get style(): ICellStyle {
        return this._style;
    }

    /**
     * Gets the value that represents the top position of the text of the cell being rendered in canvas coordinates.
     */
    get textTop(): number {
        if (!this._textRect && wijmo.isFunction(this._getTextRect)) {
            this._textRect = this._getTextRect();
        }
        return this._textRect ? this._textRect.top : this._contentRect.top;
    }
}
    }
    


    module wijmo.grid.pdf {
    








'use strict';

/**
 * Provides a functionality to export the {@link FlexGrid} to PDF.
 */
export class _FlexGridPdfCoreConverter {
    private static BorderWidth = 1; // pt, hardcoded because of border collapsing.
    private static DefFont = new wijmo.pdf.PdfFont();

    public static DefaultDrawSettings: IFlexGridDrawSettings = {
        customCellContent: false,
        drawDetailRows: false,
        exportMode: ExportMode.All,
        maxPages: Number.MAX_VALUE,
        repeatMergedValuesAcrossPages: true,
        recalculateStarWidths: true,
        styles: {
            cellStyle: <any>{
                font: {
                    family: _FlexGridPdfCoreConverter.DefFont.family,
                    size: _FlexGridPdfCoreConverter.DefFont.size,
                    style: _FlexGridPdfCoreConverter.DefFont.style,
                    weight: _FlexGridPdfCoreConverter.DefFont.weight
                },
                padding: 1.5,
                verticalAlign: 'middle'
            },
            headerCellStyle: <any>{
                font: { weight: 'bold' } // Don't use PdfFont. It's necessary to specify exclusive properties only, no default values (in order to merge cell styles properly).
            }
        },
        quickCellStyles: true,
        _progressMax: 1 // 100%
    };

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
    static draw(flex: _IFlexGridAdapter, doc: wijmo.pdf.PdfDocument, point?: wijmo.Point, width?: number, height?: number, settings?: IFlexGridExportSettings): void {
        wijmo.assert(!!flex, 'The flex argument cannot be null.');
        wijmo.assert(!!doc, 'The doc argument cannot be null.');

        settings = this._applyDefaultDrawSettings(settings);

        if (settings.scaleMode == null) { // Settings came from the draw/drawToPosition function.
            if (width == null) {
                settings.scaleMode = ScaleMode.ActualSize;
            } else {
                settings.scaleMode = height == null ? ScaleMode.PageWidth : ScaleMode.SinglePage;
            }
        }

        this._drawInternal(flex, doc, point, width, height, settings);
    }

    // Clones and applies defaults.
    static _applyDefaultDrawSettings(settings: any): IFlexGridDrawSettings {
        return _merge(_merge({}, settings), _FlexGridPdfCoreConverter.DefaultDrawSettings);
    }

    private static _drawInternal(flex: _IFlexGridAdapter, doc: wijmo.pdf.PdfDocument, point: wijmo.Point, width: number, height: number, settings: IFlexGridExportSettings): void {
        var isPositionedMode = point != null,
            clSize = new wijmo.Size(doc.width, doc.height);

        if (!point) {
            point = new wijmo.Point(0, doc.y);
            //point = new Point(doc.x, doc.y); // use current position
        }

        if (wijmo.isArray(settings.embeddedFonts)) {
            settings.embeddedFonts.forEach((font) => {
                doc.registerFont(font);
            });
        }

        // ** initialize
        var range = this._getRowsToRender(flex, settings),
            gr = new FlexGridRenderer(flex, settings, range, this.BorderWidth, true),
            rect = new wijmo.Rect(point.x || 0, point.y || 0, width || clSize.width, height || clSize.height),
            scaleFactor = this._getScaleFactor(gr, settings.scaleMode, rect);

        // TFS 472062
        // If grid is not drawn from the top of the page and row breaks are allowed then check if the header + first data row fit the height.
        // If not, then start drawing from a new page.
        if (point.y > 0 && this._canBreakRows(settings.scaleMode)) {
            var row = range.find(flex.cells, row => gr.isRenderableRow(row));
            if (row) {
                var avlHeight = (rect.height - rect.top) * (1 / scaleFactor),
                    hdrHeight = gr.showColumnHeader ? wijmo.pdf.pxToPt(flex.columnHeaders.height) : 0,
                    rowHeight = wijmo.pdf.pxToPt(row.renderHeight);

                if (hdrHeight + rowHeight - this.BorderWidth > avlHeight) { // Doesn't fit? Let's start at the beginning of a new page then.
                    doc.addPage();
                    rect = new wijmo.Rect(point.x || 0, 0, width || clSize.width, height || clSize.height);
                }
            }
        }

        var pages = this._getPages(gr, range, rect, settings, isPositionedMode, scaleFactor);

        // ** initialize progress stuff
        var cellsCount = !settings.progress ? 0 : this._getCellsCount(flex, settings, pages),
            step = cellsCount / settings._progressMax,
            progress = 0, // [0.._progressMax]
            cellIdx = 0, // current cell index
            cellIdxLast = 0, // last cell when an event was triggered
            onProgress = !settings.progress
                ? null
                : () => {
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

            var page = pages[i],
                x = page.pageCol === 0 ? rect.left : 0,
                y = page.pageRow === 0 ? rect.top : 0;

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
    }

    private static _getCellsCount(flex: _IFlexGridAdapter, settings: IFlexGridExportSettings, pages: PdfPageRowRange[]): number {
        var result = 0;

        for (var i = 0; i < pages.length; i++) {
            var pageRenderer = new FlexGridRenderer(flex, settings, pages[i].range, 0, false);
            result += pageRenderer.getCellsCount();
        }

        return result;
    }

    private static _getRowsToRender(flex: _IFlexGridAdapter, settings: IFlexGridExportSettings): RowRange {
        var ranges: _ICellRange[] = [];

        if (settings.exportMode == ExportMode.All) {
            ranges.push(new _CellRange(0, 0, flex.rows.length - 1, flex.columns.length - 1)); // row\row2 can be negative if flex.cells contains no rows
        } else {
            ranges = flex.getSelection();
        }

        var result = new RowRange(ranges);

        if (result.isValid && !settings.drawDetailRows) { // exclude detail rows
            var newRanges: _CellRange[] = [];

            result.forEach(flex.cells, (row, range, rowIdx) => {
                if (!flex.isDetailRow(row)) {
                    var len = newRanges.length;

                    if (len && (newRanges[len - 1].bottomRow + 1 === rowIdx)) {
                        newRanges[len - 1].row2++; // this is a continuation of the same range, just expand it.
                    } else { // no ranges, or delta > 1; start a new range
                        newRanges.push(new _CellRange(rowIdx, range.col, rowIdx, range.col2));
                    }
                }
            });

            result = new RowRange(newRanges);
        }

        return result;
    }

    private static _getScaleFactor(gr: FlexGridRenderer, scaleMode: ScaleMode, rect: wijmo.Rect): number {
        var factor = 1;

        if (scaleMode == ScaleMode.ActualSize) {
            return factor;
        }

        var size = gr.renderSize;

        if (scaleMode == ScaleMode.SinglePage) {
            var f = Math.min(rect.width / size.width, rect.height / size.height);

            if (f < 1) {
                factor = f;
            }
        } else { // pageWidth
            var f = rect.width / size.width;

            if (f < 1) {
                factor = f;
            }
        }

        return factor;
    }

    private static _canBreakRows(mode: ScaleMode) {
        return mode == ScaleMode.ActualSize || mode == ScaleMode.PageWidth;
    }

    private static _getPages(gr: FlexGridRenderer, ranges: RowRange, rect: wijmo.Rect, settings: IFlexGridExportSettings, isPositionedMode: boolean, scaleFactor: number): PdfPageRowRange[] {
        let rowBreaks: number[] = [],
            colBreaks: number[] = [],
            p2u = wijmo.pdf.pxToPt,

            flex = gr.flex,
            showColumnHeader = gr.showColumnHeader,
            showColumnFooter = gr.showColumnFooter,
            showRowHeader = gr.showRowHeader,

            colHeaderHeight = showColumnHeader ? p2u(flex.columnHeaders.height) : 0,
            colFooterHeight = showColumnFooter ? p2u(flex.columnFooters.height) : 0,
            rowHeaderWidth = showRowHeader ? p2u(flex.rowHeaders.width) : 0,

            breakRows = this._canBreakRows(settings.scaleMode),
            breakColumns = settings.scaleMode == ScaleMode.ActualSize,
            zeroColWidth = (rect.width - rect.left) * (1 / scaleFactor), // the width of the leftmost grids
            zeroRowHeight = (rect.height - rect.top) * (1 / scaleFactor), // the height of the topmost grids
            rectWidth = rect.width * (1 / scaleFactor),
            rectHeight = rect.height * (1 / scaleFactor),

            totalHeight = colHeaderHeight,
            totalWidth = rowHeaderWidth,

            // Normally in ActualSize mode we are inserting page breaks before partially visible columns\ rows to display them completely.
            // But there is no page breaks in positioned mode, so we need to omit this to fit the maximum amount of content in a drawing area.
            dontBreakBeforePartiallyVisibleElements = isPositionedMode && (settings.scaleMode == ScaleMode.ActualSize),

            curRenderAreaHeight = zeroRowHeight;

        if (breakRows) {
            let visibleRowsCnt = 0,
                rpIdx = 0;  // the current row's index within the current page

            ranges.forEach(flex.cells, (row, rng, rIdx, sIdx) => {
                curRenderAreaHeight = rowBreaks.length ? rectHeight : zeroRowHeight;

                if (gr.isRenderableRow(row)) {
                    let rowHeight = p2u(row.renderHeight);

                    visibleRowsCnt++;
                    totalHeight += rowHeight;

                    if (showColumnHeader || visibleRowsCnt > 1) {
                        totalHeight -= this.BorderWidth; // border collapse
                    }

                    // We exceeding the bottom boundary.
                    if (totalHeight > curRenderAreaHeight) {
                        if (
                            dontBreakBeforePartiallyVisibleElements ||
                            // The current row will exceed the bottom boundary even if we put it on a new page.
                            (colHeaderHeight + rowHeight > curRenderAreaHeight && rpIdx === 0)
                        ) {
                            // Break rows after the current row. The current row remains on the current page, the next row will start on a new page.
                            rowBreaks.push(sIdx);
                            totalHeight = colHeaderHeight;
                        } else {
                            // Break rows before the current row. The current row will start on a new page.
                            rowBreaks.push(sIdx - 1);
                            totalHeight = colHeaderHeight + rowHeight;
                        }

                        rpIdx = 0;

                        if (showColumnHeader) {
                            totalHeight -= this.BorderWidth; // border collapse
                        }
                    } else {
                        rpIdx++;
                    }
                }
            });
        }

        let last = Math.max(ranges.length() - 1, 0);
        if (!rowBreaks.length || (rowBreaks[rowBreaks.length - 1] !== last)) {
            rowBreaks.push(last);
        }

        if (showColumnFooter && (totalHeight + colFooterHeight > curRenderAreaHeight)) {
            // Force to add a new page (no data rows, just header and footer) if footer doesn't fit the area.
            rowBreaks.push(-1);
        }

        if (breakColumns) {
            let visibleColumnsCnt = 0;

            for (let i = ranges.leftCol; i <= ranges.rightCol; i++) {
                let col = flex.columns[i];

                if (gr.isRenderableColumn(col)) {
                    let colWidth = p2u(col.renderWidth),
                        renderAreaWidth = colBreaks.length ? rectWidth : zeroColWidth;

                    visibleColumnsCnt++;
                    totalWidth += colWidth;

                    if (showRowHeader || visibleColumnsCnt > 1) {
                        totalWidth -= this.BorderWidth; // border collapse
                    }

                    if (totalWidth > renderAreaWidth) {
                        if (rowHeaderWidth + colWidth > renderAreaWidth || dontBreakBeforePartiallyVisibleElements) { // current columns is too big, break on it
                            colBreaks.push(i);
                            totalWidth = rowHeaderWidth;
                        } else { // break on previous column
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

        let pages: PdfPageRowRange[] = [],
            flag = false,
            pageCount = 1,
            maxPages = isPositionedMode && (settings.maxPages > 0) ? 1 : settings.maxPages;

        for (let i = 0; i < rowBreaks.length && !flag; i++) {
            for (let j = 0; j < colBreaks.length && !flag; j++, pageCount++) {

                if (!(flag = pageCount > maxPages)) {
                    let r = i === 0 ? 0 : rowBreaks[i - 1] + 1,
                        c = j === 0 ? ranges.leftCol : colBreaks[j - 1] + 1;

                    let rowRange = (rowBreaks[i] === -1)
                        ? new RowRange([new _CellRange(-1, c, -1, colBreaks[j])]) // special case - an empty page, no data rows, just header and footer.
                        : ranges.subrange(r, rowBreaks[i] - r + 1, c, colBreaks[j]);

                    pages.push(new PdfPageRowRange(rowRange, j, i));
                }
            }
        }

        return pages;
    }
}

class FlexGridRenderer {
    private _flex: _IFlexGridAdapter;
    private _borderWidth: number;
    private _lastPage: boolean;

    private _topLeft: PanelSectionRenderer;
    private _rowHeader: PanelSectionRenderer;
    private _columnHeader: PanelSectionRenderer;
    private _cells: PanelSectionRenderer;

    private _bottomLeft: PanelSectionRenderer;
    private _columnFooter: PanelSectionRenderer;

    private _settings: IFlexGridExportSettings;

    constructor(flex: _IFlexGridAdapter, settings: IFlexGridExportSettings, range: RowRange, borderWidth: number, lastPage: boolean) {
        this._flex = flex;
        this._borderWidth = borderWidth;
        this._lastPage = lastPage;
        this._settings = settings || {};

        this._topLeft = new PanelSectionRenderer(this, flex.topLeftCells,
            this.showRowHeader && this.showColumnHeader
                ? new RowRange([new _CellRange(0, 0, flex.topLeftCells.rows.length - 1, flex.topLeftCells.columns.length - 1)])
                : new RowRange([]),
            borderWidth);

        this._rowHeader = new PanelSectionRenderer(this, flex.rowHeaders,
            this.showRowHeader
                ? range.clone(0, flex.rowHeaders.columns.length - 1)
                : new RowRange([]),
            borderWidth);

        this._columnHeader = new PanelSectionRenderer(this, flex.columnHeaders,
            this.showColumnHeader
                ? new RowRange([new _CellRange(0, range.leftCol, flex.columnHeaders.rows.length - 1, range.rightCol)])
                : new RowRange([]),
            borderWidth);

        this._cells = new PanelSectionRenderer(this, flex.cells, range, borderWidth);

        this._bottomLeft = new PanelSectionRenderer(this, flex.bottomLeftCells,
            this.showRowHeader && this.showColumnFooter
                ? new RowRange([new _CellRange(0, 0, flex.bottomLeftCells.rows.length - 1, flex.bottomLeftCells.columns.length - 1)])
                : new RowRange([]),
            borderWidth);

        this._columnFooter = new PanelSectionRenderer(this, flex.columnFooters,
            this.showColumnFooter
                ? new RowRange([new _CellRange(0, range.leftCol, flex.columnFooters.rows.length - 1, range.rightCol)])
                : new RowRange([]),
            borderWidth);
    }

    get settings(): IFlexGridExportSettings {
        return this._settings;
    }

    public isRenderableRow(row: _IRow): boolean {
        return this._flex.isRenderableRow(row);
    }

    public isRenderableColumn(col: _IColumn): boolean {
        return this._flex.isRenderableColumn(col);
    }

    public getCellsCount() {
        return this._topLeft.getCellsCount() +
            this._rowHeader.getCellsCount() +
            this._columnHeader.getCellsCount() +
            this._cells.getCellsCount() +
            this._bottomLeft.getCellsCount() +
            this._columnFooter.getCellsCount();
    }

    public render(doc: wijmo.pdf.PdfDocument, cellRendered?: () => void) {
        var offsetX = Math.max(0, Math.max(this._topLeft.renderSize.width, this._rowHeader.renderSize.width) - this._borderWidth), // left section width
            offsetY = Math.max(0, Math.max(this._topLeft.renderSize.height, this._columnHeader.renderSize.height) - this._borderWidth); // top section height

        this._topLeft.render(doc, 0, 0, cellRendered);
        this._rowHeader.render(doc, 0, offsetY, cellRendered);

        this._columnHeader.render(doc, offsetX, 0, cellRendered);
        this._cells.render(doc, offsetX, offsetY, cellRendered);

        offsetY += Math.max(0, this._cells.renderSize.height - this._borderWidth);
        this._bottomLeft.render(doc, 0, offsetY, cellRendered);
        this._columnFooter.render(doc, offsetX, offsetY, cellRendered);
    }

    public get flex(): _IFlexGridAdapter {
        return this._flex;
    }

    public get renderSize(): wijmo.Size {
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
    }

    public get showColumnHeader(): boolean {
        return this._flex.showColumnHeader;
    }

    public get showRowHeader(): boolean {
        return this._flex.showRowHeader;
    }

    public get showColumnFooter(): boolean {
        return this._lastPage && this._flex.showColumnFooter;
    }

    public alignMergedTextToTheTopRow(panel: _IGridPanel): boolean {
        return this._flex.alignMergedTextToTheTopRow(panel);
    }

    public getColumn(panel: _IGridPanel, row: number, col: number): _IColumn {
        return this._flex.getColumn(panel, row, col);
    }

    public isAlternatingRow(row: _IRow): boolean {
        return this._flex.isAlternatingRow(row);
    }

    public isGroupRow(row: _IRow): boolean {
        return this._flex.isGroupRow(row);
    }

    public isNewRow(row: _IRow): boolean {
        return this._flex.isNewRow(row);
    }

    public isExpandableGroupRow(row: _IRow): boolean {
        return this._flex.isExpandableGroupRow(row);
    }

    public isBooleanCell(panel: _IGridPanel, row: _IRow, col: _IColumn): boolean {
        return this._flex.isBooleanCell(panel, row, col);
    }

    public getCellStyle(panel: _IGridPanel, row: _IRow, col: _IColumn): ICellStyle {
        return this._flex.getCellStyle(panel, row, col);
    }
}

class PanelSection {
    private _range: RowRange;
    private _panel: _IGridPanel;
    private _flex: _IFlexGridAdapter;

    private _renderableRowsCnt: number;
    private _renderableColumnsCnt: number;
    private _size: wijmo.Size;

    constructor(flex: _IFlexGridAdapter, panel: _IGridPanel, range: RowRange) {
        this._flex = flex;
        this._panel = panel;
        this._range = range.clone();
    }

    public get renderableRowsCount(): number {
        if (this._renderableRowsCnt == null) {
            this._renderableRowsCnt = 0;

            this._range.forEach(this._panel, (row) => {
                if (this._flex.isRenderableRow(row)) {
                    this._renderableRowsCnt++;
                }
            });
        }

        return this._renderableRowsCnt;
    }

    public get renderableColumnsCount(): number {
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
    }

    // pt units
    public get size(): wijmo.Size {
        if (this._size == null) {
            var sz = this._range.getRenderSize(this._flex, this._panel);

            this._size = new wijmo.Size(wijmo.pdf.pxToPt(sz.width), wijmo.pdf.pxToPt(sz.height));
        }

        return this._size;
    }

    public get range(): RowRange {
        return this._range;
    }

    public get panel(): _IGridPanel {
        return this._panel;
    }
}

class PanelSectionRenderer extends PanelSection {
    private _borderWidth: number;
    private _gr: FlexGridRenderer;
    private _renderSize: wijmo.Size;

    constructor(gr: FlexGridRenderer, panel: _IGridPanel, range: RowRange, borderWidth: number) {
        super(gr.flex, panel, range);
        this._gr = gr;
        this._borderWidth = borderWidth;
    }

    public get gr() {
        return this._gr;
    }

    // pt units
    public get renderSize(): wijmo.Size {
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
    }

    public getRangeWidth(leftCol: number, rightCol: number): number {
        var width = 0,
            visibleColumns = 0,
            pnl = this.panel;

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
    }

    public getRangeHeight(topRow: number, bottomRow: number): number {
        var height = 0,
            visibleRows = 0,
            pnl = this.panel;

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
    }

    //// Returns the number of cells without taking into account the merged ones.
    //public getCellsCountRaw() {
    //    return this.visibleColumns * this.visibleRows;
    //}

    // Important! When changing, synchronize the cells detection code with render()
    public getCellsCount(): number {
        var result = 0,
            ranges = this.range,
            pnl = this.panel,
            mngr = new GetMergedRangeProxy(this._gr.flex);

        if (!ranges.isValid) {
            return result;
        }

        ranges.forEach(pnl, (row, rng, r) => {
            if (!this._gr.isRenderableRow(row)) {
                return;
            }

            for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                if (!this._gr.isRenderableColumn(pnl.columns[c])) { // a regular column
                    continue;
                }

                var needRender = false,
                    skipC: number = undefined,
                    mergedRng = mngr.getMergedRange(pnl, r, c);

                if (mergedRng) {
                    let veryFirstRow = r === mergedRng.firstVisibleRow, // the very first row of a merged range
                        veryFirstCol = c === mergedRng.leftCol, // the very first column of a merged range
                        firstRow = r === rng.topRow, // the first row of a range spreaded between multiple pages
                        firstCol = c === rng.leftCol, // the first column of a range spreaded between multiple pages
                        rc = mergedRng.rowSpan > 1,
                        cs = mergedRng.columnSpan > 1;

                    if ((rc && cs && ((veryFirstRow && veryFirstCol) || (firstRow && firstCol))) ||
                        (rc && !cs && (veryFirstRow || firstRow)) ||
                        (!rc && cs && (veryFirstCol || firstCol))) {
                        needRender = true;
                        if (cs) {
                            // skip absorbed cells until the end of the merged range or page (which comes first)
                            skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
                        }
                    }
                } else {
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
    }

    // Important! When changing, synchronize the cells detection code with getCellsCount().
    public render(doc: wijmo.pdf.PdfDocument, x: number, y: number, cellRendered?: () => void): void {
        var ranges = this.range;

        if (!ranges.isValid) {
            return;
        }

        var pY: { [key: number]: number } = {}, // tracks the current Y position for each column
            pnl = this.panel,
            mngr = new GetMergedRangeProxy(this._gr.flex),
            curCellRange = new _CellRangeExt(pnl, 0, 0, 0, 0),
            cellRenderer = new _CellRenderer(this, doc, this._borderWidth);

        for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
            pY[c] = y;
        }

        ranges.forEach(pnl, (row, rng, r) => {
            if (!this._gr.isRenderableRow(row)) {
                return;
            }

            var pX = x;

            for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                var col = this.gr.getColumn(pnl, r, c);

                if (!this._gr.isRenderableColumn(col)) { // #362720
                    continue;
                }

                var height: number = undefined,
                    width: number = undefined,
                    value: string,
                    needRender = false,
                    skipC: number = undefined,
                    cellValue = this._gr.flex.getCellContent(this.panel, row, col, c),
                    mergedRng = mngr.getMergedRange(pnl, r, c);

                if (mergedRng) {
                    //wijmo.assert(!mergedRng.isSingleCell, 'The merged range is expected.');
                    curCellRange.copyFrom(mergedRng);

                    let veryFirstRow = r === mergedRng.firstVisibleRow, // the very first row of a merged range
                        veryFirstCol = c === mergedRng.leftCol, // the very first column of a merged range
                        firstRow = r === rng.topRow, // the first row of a range spreaded between multiple pages
                        firstCol = c === rng.leftCol, // the first column of a range spreaded between multiple pages
                        rc = mergedRng.rowSpan > 1,
                        cs = mergedRng.columnSpan > 1;

                    if (
                        (rc && cs && ((veryFirstRow && veryFirstCol) || (firstRow && firstCol))) ||
                        (rc && !cs && (veryFirstRow || firstRow)) ||
                        (!rc && cs && (veryFirstCol || firstCol))
                    ) {
                        needRender = true;

                        value = (veryFirstRow && veryFirstCol) || this.gr.settings.repeatMergedValuesAcrossPages ? cellValue : '';

                        height = rc
                            ? this.getRangeHeight(r, Math.min(mergedRng.bottomRow, rng.bottomRow))
                            : this.getRangeHeight(r, r);

                        if (cs) {
                            width = this.getRangeWidth(Math.max(ranges.leftCol, mergedRng.leftCol), Math.min(ranges.rightCol, mergedRng.rightCol))

                            // skip absorbed cells until the end of the merged range or page (which comes first)
                            skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
                            for (var t = c + 1; t <= skipC; t++) {
                                pY[t] += height - this._borderWidth; // collapse borders
                            }
                        }
                    }

                    if (width == null) { // a cell absorbed by the vertical merging
                        width = this.getRangeWidth(c, c);
                    }

                } else { // an ordinary cell
                    curCellRange.setRange(r, c, r, c);

                    needRender = true;
                    value = cellValue;
                    height = this.getRangeHeight(r, r);
                    width = this.getRangeWidth(c, c);
                }

                if (needRender && width > 0 && height > 0) {
                    cellRenderer.renderCell(value, row, col, curCellRange, new wijmo.Rect(pX, pY[c], width, height));

                    if (cellRendered) {
                        cellRendered();
                    }
                }

                if (height) {
                    pY[c] += height - this._borderWidth; // collapse borders
                }

                if (width) {
                    pX += width - this._borderWidth; // collapse borders
                }

                if (skipC) {
                    c = skipC;
                }
            }
        });
    }
}

interface _ICellMeasurements {
    rect: wijmo.Rect,
    clientRect: wijmo.Rect,
    contentRect: wijmo.Rect,
    textRect: wijmo.Rect
}

// Mimics the CSSStyleDeclaration interface
interface _ICellStyleEx extends ICellStyle {
    borderWidth?: number;
    borderStyle?: string;

    borderLeftColor?: string;
    borderLeftWidth?: number;
    borderLeftStyle?: string;

    borderRightColor?: string;
    borderRightWidth?: number;
    borderRightStyle?: string;

    borderTopColor?: string;
    borderTopWidth?: number;
    borderTopStyle?: string;

    borderBottomColor?: string;
    borderBottomWidth?: number;
    borderBottomStyle?: string;

    boxSizing?: string;

    padding?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingRight?: number;

    textAlign?: string;

    verticalAlign?: string;
}

export class _CellRenderer {
    private _pr: PanelSectionRenderer;
    private _area: wijmo.pdf.PdfPageArea;
    private _borderWidth: number;

    public static _drawBackground(area: wijmo.pdf.PdfPageArea, clientRect: wijmo.Rect, brush: wijmo.pdf.PdfBrush | wijmo.Color | string): void {
        if (brush && clientRect.width > 0 && clientRect.height > 0) {
            area.paths
                .rect(clientRect.left, clientRect.top, clientRect.width, clientRect.height)
                .fill(brush);
        }
    }

    constructor(panelRenderer: PanelSectionRenderer, area: wijmo.pdf.PdfPageArea, borderWidth: number) {
        this._pr = panelRenderer;
        this._area = area;
        this._borderWidth = borderWidth;
    }

    public renderCell(value: string, row: _IRow, column: _IColumn, rng: _CellRangeExt, r: wijmo.Rect): void {
        var formatEventArgs: PdfFormatItemEventArgs,
            grid = this._pr.gr.flex,
            panel = this._pr.panel,
            getGridCell = (updateContent: boolean) => {
                return grid.getCell(panel, rng.topRow, rng.leftCol, updateContent);
            },
            gridCell: HTMLElement = null,
            style: _ICellStyleEx = this._pr.gr.getCellStyle(panel, row, column),
            customContent = this._pr.gr.settings.customCellContent,
            hasFormatItem = wijmo.isFunction(this._pr.gr.settings.formatItem);

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
            let fnt = style.font as wijmo.pdf.PdfFont;
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
        if (panel.cellType === _CellType.Cell && grid.rows.maxGroupLevel >= 0 && rng.leftCol === grid.columns.firstVisibleIndex) {
            var level = grid.isGroupRow(row)
                ? Math.max(row.level, 0) // group row cell
                : grid.rows.maxGroupLevel + 1; // data cell

            var basePadding = wijmo.pdf._asPt(style.paddingLeft || style.padding),
                levelPadding = wijmo.pdf.pxToPt(level * grid.treeIndent);

            style.paddingLeft = basePadding + levelPadding;
        }

        var m = this._measureCell(value, panel, row, column, style, r),
            alignToTopRow = (rng.rowSpan > 1) && (rng.visibleRowsCount > 1) && this._pr.gr.alignMergedTextToTheTopRow(panel);

        let textContentRect = !alignToTopRow
            ? m.contentRect
            : new wijmo.Rect(m.contentRect.left, m.contentRect.top, m.contentRect.width, m.contentRect.height / (rng.visibleRowsCount || 1)); // the content rect of the top row.

        if (hasFormatItem) {
            formatEventArgs = new PdfFormatItemEventArgs(panel, rng, gridCell, this._area,
                m.rect,
                m.contentRect,
                style,
                () => gridCell || getGridCell(true),
                () => m.textRect = this._calculateTextRect(value, panel, row, column, textContentRect, style)
            );

            formatEventArgs.data = value;

            this._pr.gr.settings.formatItem(formatEventArgs);

            if (formatEventArgs.data !== value) {
                value = wijmo.asString(formatEventArgs.data);
                m.textRect = null; // value has been changed, recalculate
            }
        }

        let renderContent = formatEventArgs ? !formatEventArgs.cancel : true,
            renderBorders = formatEventArgs ? !formatEventArgs.cancelBorders : true;

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
    }

    private _renderCell(value: string, row: _IRow, column: _IColumn, rng: _ICellRange, m: _ICellMeasurements, style: _ICellStyleEx, renderContent: boolean, renderBorders: boolean) {
        if (!renderContent && !renderBorders) {
            return;
        }

        this._renderEmptyCell(m, style, renderContent, renderBorders);

        if (renderContent) {
            if (this._isBooleanCellAndValue(value, this._pr.panel, row, column)) {
                this._renderBooleanCell(value, m, style);
            } else {
                this._renderTextCell(value, m, style);
            }
        }
    }

    private _isBooleanCellAndValue(value: string, panel: _IGridPanel, row: _IRow, column: _IColumn): boolean {
        return this._pr.gr.isBooleanCell(panel, row, column) && this._isBoolean(value);
    }

    private _isBoolean(value: any): boolean {
        var lowerCase = wijmo.isString(value) && (<string>value).toLowerCase();
        return lowerCase === 'true' || lowerCase === 'false' || value === true || value === false;
    }

    private _measureCell(value: string, panel: _IGridPanel, row: _IRow, column: _IColumn, style: _ICellStyleEx, rect: wijmo.Rect): _ICellMeasurements {
        this._decompositeStyle(style);

        var x = rect.left, //  wijmo.pdf._asPt(style.left),
            y = rect.top, // wijmo.pdf._asPt(style.top),
            height = rect.height, // wijmo.pdf._asPt(style.height),
            width = rect.width, // wijmo.pdf._asPt(style.width),

            brd = this._parseBorder(style),
            blw = brd.left.width,
            btw = brd.top.width,
            bbw = brd.bottom.width,
            brw = brd.right.width,

            pad = this._parsePadding(style),

            // content + padding
            clientHeight = 0,
            clientWidth = 0,

            // content
            contentHeight = 0,
            contentWidth = 0;

        // setup client and content dimensions depending on boxing model.
        if (style.boxSizing === 'content-box' || style.boxSizing === undefined) {
            clientHeight = pad.top + height + pad.bottom;
            clientWidth = pad.left + width + pad.right;

            contentHeight = height;
            contentWidth = width;
        } else {
            if (style.boxSizing === 'border-box') {
                // Browsers are using different approaches to calculate style.width and style.heigth properties. While Chrome and Firefox returns the total size, IE returns the content size only.
                if (wijmo.pdf._IE && (style instanceof CSSStyleDeclaration)) { // content size: max(0, specifiedSizeValue - (padding + border)). Make sure that this code path will not be executed for the human-generated style object.
                    clientHeight = pad.top + pad.bottom + height;
                    clientWidth = pad.left + pad.right + width;
                } else { // total size: Max(specifiedSizeValue, padding + border)
                    clientHeight = Math.max(height - btw - bbw, 0);
                    clientWidth = Math.max(width - blw - brw, 0);
                }
            } else {
                // padding-box? It is supported by Mozilla only.
                throw 'Invalid value: ' + style.boxSizing;
            }

            contentHeight = Math.max(clientHeight - pad.top - pad.bottom, 0);
            contentWidth = Math.max(clientWidth - pad.left - pad.right, 0);
        }

        var rect = new wijmo.Rect(x, y, width, height),
            clientRect = new wijmo.Rect(x + blw, y + btw, clientWidth, clientHeight), // rect - borders
            contentRect = new wijmo.Rect(x + blw + pad.left, y + btw + pad.top, contentWidth, contentHeight); // rect - borders - padding

        return {
            rect: rect,
            clientRect: clientRect, // rect - borders
            contentRect: contentRect,
            textRect: null // calculate on demand
        };
    }

    //    Decomposites some properties to handle the situation when the style was created manually.
    private _decompositeStyle(style: _ICellStyleEx | CSSStyleDeclaration): void {
        if (style) {
            var val: any;

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
    }

    /*
    * Extracts the border values from the CSSStyleDeclaration object.
    *
    * @param style A value to extract from.
    * @return A {@link _IBorder} object.
    */
    private _parseBorder(style: _ICellStyleEx | CSSStyleDeclaration) {
        var borders: {
            left: { width: number, style?: string, color?: string },
            top: { width: number, style?: string, color?: string },
            bottom: { width: number, style?: string, color?: string },
            right: { width: number, style?: string, color?: string }
        } = {
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
    }

    /*
    * Extracts the padding values from the CSSStyleDeclaration object.
    *
    * @param style Value to extract from.
    * @return The {@link IPadding} object.
    */
    private _parsePadding(style: _ICellStyleEx | CSSStyleDeclaration) {
        return {
            left: wijmo.pdf._asPt(style.paddingLeft),
            top: wijmo.pdf._asPt(style.paddingTop),
            bottom: wijmo.pdf._asPt(style.paddingBottom),
            right: wijmo.pdf._asPt(style.paddingRight)
        };
    }

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
    private _renderEmptyCell(m: _ICellMeasurements, style: _ICellStyleEx, renderContent: boolean, renderBorders: boolean): void {
        var x = m.rect.left,
            y = m.rect.top,

            clientWidth = m.clientRect.width,
            clientHeight = m.clientRect.height,

            blw = m.clientRect.left - m.rect.left,
            btw = m.clientRect.top - m.rect.top,
            bbw = (m.rect.top + m.rect.height) - (m.clientRect.top + m.clientRect.height),
            brw = (m.rect.left + m.rect.width) - (m.clientRect.left + m.clientRect.width);

        if (renderBorders && (blw || brw || bbw || btw)) {
            var blc = style.borderLeftColor || style.borderColor,
                brc = style.borderRightColor || style.borderColor,
                btc = style.borderTopColor || style.borderColor,
                bbc = style.borderBottomColor || style.borderColor;

            // all borders has the same width and color, draw a rectangle
            if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (blc === brc && blc === bbc && blc === btc)) {
                var border = blw,
                    half = border / 2; // use an adjustment because of center border alignment used by PDFKit.

                this._area.paths
                    .rect(x + half, y + half, clientWidth + border, clientHeight + border)
                    .stroke(new wijmo.pdf.PdfPen(blc, border));

            } else {
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
    }

    /*
    * Renders a cell with a checkbox inside.
    *
    * @param value Boolean value.
    * @param style A CSSStyleDeclaration object that represents the cell style and
    * positioning.
    *
    * @return A reference to the document.
    */
    private _renderBooleanCell(value: boolean | string, m: _ICellMeasurements, style: _ICellStyleEx): void {
        if (!m.textRect || m.textRect.height <= 0 || m.textRect.width <= 0) {
            return;
        }

        var border = 0.5,
            x = m.textRect.left,
            y = m.textRect.top,
            sz = m.textRect.height;

        // border and content area
        this._area.paths
            .rect(x, y, sz, sz)
            .fillAndStroke(wijmo.Color.fromRgba(255, 255, 255), new wijmo.pdf.PdfPen(undefined, border));

        // checkmark
        if (wijmo.changeType(value, wijmo.DataType.Boolean, '') === true) {
            var space = sz / 20,
                cmRectSize = sz - border - space * 2,
                cmLineWidth = sz / 8;

            this._area.document.saveState();

            this._area.translate(x + border / 2 + space, y + border / 2 + space)
                .paths
                .moveTo(cmLineWidth / 2, cmRectSize * 0.6)
                .lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth)
                .lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2)
                .stroke(new wijmo.pdf.PdfPen(undefined, cmLineWidth))

            this._area.document.restoreState();
        }
    }

    /*
    * Renders a cell with a text inside.
    *
    * @param text Text inside the cell.
    * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
    *
    * @return A reference to the document.
    */
    private _renderTextCell(text: string, m: _ICellMeasurements, style: _ICellStyleEx): void {
        if (!text || !m.textRect || m.textRect.height <= 0 || m.textRect.width <= 0) {
            return;
        }

        this._area.drawText(text, m.textRect.left, m.textRect.top, {
            brush: style.color,
            font: style.font,  //new wijmo.pdf.PdfFont(style.font.family, style.font.size, style.font.style, style.font.weight),
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
    }

    private _calculateTextRect(value: any, panel: _IGridPanel, row: _IRow, column: _IColumn, content: wijmo.Rect, style: _ICellStyleEx): wijmo.Rect {
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
        } else {
            if (res.height > 0 && res.width > 0) {
                switch (style.verticalAlign) {
                    case 'bottom':
                        var sz = this._area.measureText(value, style.font, { height: res.height, width: res.width });

                        if (sz.size.height < res.height) {
                            var ndoc = this._area.document._document,
                                lastLineExtLeading = ndoc.currentLineHeight(true) - ndoc.currentLineHeight(false);

                            res.top += res.height - sz.size.height - lastLineExtLeading;
                            res.height = sz.size.height;
                        }
                        break;

                    case 'middle':
                        var sz = this._area.measureText(value, style.font, { height: res.height, width: res.width });

                        if (sz.size.height < res.height) {
                            var ndoc = this._area.document._document,
                                lastLineExtLeading = ndoc.currentLineHeight(true) - ndoc.currentLineHeight(false);

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
    }

    private _getTextLineHeight(font?: wijmo.pdf.PdfFont): number {
        //return this._area.measureText('A', font, { width: Infinity }).size.height;
        return this._area.lineHeight(font);
    }
}

// A caching proxy for the flex.getMergedRange method, caches last vertical range for each column.
class GetMergedRangeProxy {
    private _flex: _IFlexGridAdapter;
    private _columns: { [key: number]: _CellRangeExt } = {};

    constructor(flex: _IFlexGridAdapter) {
        this._flex = flex;
    }

    // The [r, c] cell belongs to a visible column/row.
    public getMergedRange(p: _IGridPanel, r: number, c: number): _CellRangeExt {
        let rng = this._columns[c];

        if (rng && r >= rng.topRow && r <= rng.bottomRow) {
            return rng;
        } else {
            let mr = this._flex.getMergedRange(p, r, c),
                cols = p.columns,
                rows = p.rows;

            // collapse invisible edge columns/rows, if any (418356)
            if (mr && !mr.isSingleCell && (!cols[mr.col].isVisible || !cols[mr.col2].isVisible || !rows[mr.row].isVisible || !rows[mr.row2].isVisible)) {
                mr = mr.clone();

                while (mr.col < mr.col2 && !cols[mr.col].isVisible) mr.col++;
                while (mr.col2 > mr.col && !cols[mr.col2].isVisible) mr.col2--;
                while (mr.row < mr.row2 && !rows[mr.row].isVisible) mr.row++;
                while (mr.row2 > mr.row && !rows[mr.row2].isVisible) mr.row2--;
            }

            if (mr && mr.isSingleCell) {
                mr = null; // 408290, PivotGrid.getMergedRange returns non-null values for non-merged cells.
            }

            return this._columns[c] = mr ? new _CellRangeExt(p, mr) : null;
        }
    }
}

export class _CellRange implements _ICellRange {
    private _row: number;
    private _col: number;
    private _row2: number;
    private _col2: number;

    constructor(cr: _ICellRange);
    constructor(row: number, col: number, row2: number, col2: number);
    constructor(cr: _ICellRange | number, col?: number, row2?: number, col2?: number) {
        if (typeof (cr) === "number") {
            this._row = cr;
            this._col = col;
            this._row2 = row2;
            this._col2 = col2;
        } else {
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

    get row(): number {
        return this._row;
    }
    set row(value: number) {
        this._row = value;
    }
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        this._col = value;
    }
    get row2(): number {
        return this._row2;
    }
    set row2(value: number) {
        this._row2 = value;
    }
    get col2(): number {
        return this._col2;
    }
    set col2(value: number) {
        this._col2 = value;
    }
    get topRow(): number {
        return Math.min(this._row, this._row2);
    }
    get bottomRow(): number {
        return Math.max(this._row, this._row2);
    }
    get leftCol(): number {
        return Math.min(this._col, this._col2);
    }
    get rightCol(): number {
        return Math.max(this._col, this._col2);
    }

    get columnSpan(): number {
        return Math.abs(this._col2 - this._col) + 1;
    }
    get rowSpan(): number {
        return Math.abs(this._row2 - this._row) + 1;
    }

    get isValid(): boolean {
        return this._row > -1 && this._col > -1 && this._row2 > -1 && this._col2 > -1;
    }

    get isSingleCell(): boolean {
        return this._row === this._row2 && this._col === this._col2;
    }

    copyFrom(cr: _CellRange) {
        this.setRange(cr.row, cr.col, cr.row2, cr.col2);
    }

    clone() {
        return new _CellRange(this._row, this._col, this._row2, this._col2);
    }

    getRenderSize(flex: _IFlexGridAdapter, p: _IGridPanel): wijmo.Size {
        let sz = new wijmo.Size(0, 0);
        if (this.isValid) {
            for (let r = this.topRow; r <= this.bottomRow; r++) {
                let row = p.rows[r];
                if (flex.isRenderableRow(row)) {
                    sz.height += row.renderHeight;
                }
            }
            for (let c = this.leftCol; c <= this.rightCol; c++) {
                let col = p.columns[c];
                if (flex.isRenderableColumn(col)) {
                    sz.width += col.renderWidth;
                }
            }
        }
        return sz;
    }

    setRange(r = -1, c = -1, r2 = r, c2 = c) {
        this._row = wijmo.asInt(r);
        this._col = wijmo.asInt(c);
        this._row2 = wijmo.asInt(r2);
        this._col2 = wijmo.asInt(c2);
    }
}

export class _CellRangeExt extends _CellRange {
    public firstVisibleRow: number;
    public visibleRowsCount: number;

    constructor(panel: _IGridPanel, cr: _ICellRange);
    constructor(panel: _IGridPanel, row: number, col: number, row2: number, col2: number);
    constructor(panel: _IGridPanel, cr: _ICellRange | number, col?: number, row2?: number, col2?: number) {
        super(<any>cr, col, row2, col2);

        this.firstVisibleRow = -1;
        this.visibleRowsCount = 0;

        if (panel) {
            var tr = this.topRow,
                br = this.bottomRow,
                len = panel.rows.length;

            // find the first visible row
            if (len > 0) {
                for (var i = tr; i <= br && i < len; i++) {
                    if (panel.rows[i].isVisible) {
                        if (this.firstVisibleRow < 0) {
                            this.firstVisibleRow = i;
                        }

                        this.visibleRowsCount++;
                    }
                }
            }
        }
    }

    copyFrom(cr: _CellRangeExt) {
        super.copyFrom(cr);
        this.firstVisibleRow = cr.firstVisibleRow;
        this.visibleRowsCount = cr.visibleRowsCount;
    }

    clone() {
        return new _CellRangeExt(null, this.row, this.col, this.row2, this.col2);
    }
}

class RowRange {
    private _ranges: _ICellRange[];

    constructor(ranges: _ICellRange[]) {
        this._ranges = ranges || [];
    }

    public length(): number {
        var res = 0;

        for (var i = 0; i < this._ranges.length; i++) {
            var r = this._ranges[i];

            if (r.isValid) {
                res += r.bottomRow - r.topRow + 1;
            }
        }

        return res;
    }

    public get isValid(): boolean {
        return this._ranges.length && this._ranges[0].isValid;
    }

    public get leftCol(): number {
        if (this._ranges.length) {
            return this._ranges[0].leftCol;
        }

        return -1;
    }

    public get rightCol(): number {
        if (this._ranges.length) {
            return this._ranges[0].rightCol;
        }

        return -1;
    }

    public clone(leftCol?: number, rightCol?: number): RowRange {
        var ranges: _ICellRange[] = [];

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
    }

    public getRenderSize(flex: _IFlexGridAdapter, panel: _IGridPanel): wijmo.Size {
        var res = new wijmo.Size(0, 0);

        for (var i = 0; i < this._ranges.length; i++) {
            var size = this._ranges[i].getRenderSize(flex, panel);

            res.width = Math.max(res.width, size.width);
            res.height += size.height;
        }

        return res;
    }

    public find(panel: _IGridPanel, fn: (row: _IRow) => boolean): _IRow | null {
        var val: _IRow = null;

        this.forEach(panel, row => {
            if (fn(row) === true) {
                val = row;
                return false;
            }
        });

        return val;
    }

    public forEach(panel: _IGridPanel, fn: (row: _IRow, range?: _ICellRange, rowIdx?: number, seqIdx?: number) => void | boolean): void {
        var idx = 0,
            brk = false;

        for (var i = 0; (i < this._ranges.length) && !brk; i++) {
            var range = this._ranges[i];

            if (range.isValid) {
                for (var j = range.topRow; (j <= range.bottomRow) && !brk; j++) {
                    brk = fn(panel.rows[j], range, j, idx++) === false;
                }
            }
        }
    }

    public subrange(from: number, count: number, leftCol?: number, rightCol?: number): RowRange {
        var ranges: _ICellRange[] = [];

        if (from >= 0 && count > 0) {
            var start = 0,
                end = 0;

            for (var i = 0; i < this._ranges.length && count > 0; i++, start = end + 1) {
                var r = this._ranges[i];

                end = start + (r.bottomRow - r.topRow);

                if (from > end) {
                    continue;
                }

                var r1 = (from > start) ? r.topRow + (from - start) : r.topRow,
                    r2 = Math.min(r.bottomRow, r1 + count - 1),
                    lCol = arguments.length > 2 ? leftCol : r.leftCol,
                    rCol = arguments.length > 2 ? rightCol : r.rightCol;

                ranges.push(new _CellRange(r1, lCol, r2, rCol));

                count -= r2 - r1 + 1;
            }
        }

        return new RowRange(ranges);
    }
}

class PdfPageRowRange {
    private _range: RowRange;
    private _col: number;
    private _row: number;

    constructor(range: RowRange, col: number, row: number) {
        this._col = col;
        this._row = row;
        this._range = range;
    }

    get range(): RowRange {
        return this._range;
    }

    get pageCol(): number {
        return this._col;
    }

    get pageRow(): number {
        return this._row;
    }
}
    }
    


    module wijmo.grid.pdf {
    








// Always use a soft reference to these modules (in the places that will be transpiled directly to JS) to avoid requiring an import,
// otherwise webpack will embedd them into the worker bundle.
// The worker bundle should contain nothing but wijmo, wijmo.pdf and wijmo.grid.pdf modules, any other code is redundant.








'use strict';

var _fc: HTMLElement;

const FAKE_CELL = 'wj-pdf-fake-cell';

function getFakeCell(panel: _IGridPanel): HTMLElement {
    if (!_fc) {
        _fc = document.createElement('div');
        _fc.setAttribute(FAKE_CELL, 'true');

        if (softGrid()) {
            _fc.setAttribute(softGrid().FlexGrid._WJS_MEASURE, 'true');
        }
    }

    let s = _fc.style;
    s.cssText = '';

    // we can't use 'hidden' because of innerText, it returns nothing for the hidden elements in Chrome/FF (WJM-19602)
    //s.visibility = 'hidden';

    s.position = 'absolute';
    s.overflow = 'hidden';
    s.width = '1px';
    s.height = '1px';
    s.clipPath = 'inset(100%)';
    s.clip = 'rect(0 0 0 0)';

    let host = (<wijmo.grid.GridPanel>panel).hostElement;
    // Add fakeCell to the first row of the panel, or, if there is no rows, to the panel itself.
    let parent = host.children.length ? host.children[0] : host;

    if (_fc.parentNode !== parent) {
        parent.appendChild(_fc);
    }

    return _fc;
}

export function _removeFakeCell() {
    if (_fc) {
        wijmo.removeChild(_fc);
        _fc = null;
    }
}

/**
* Provides a functionality to export the {@link FlexGrid} to PDF.
* 
* The example below shows how you can use a {@link FlexGridPdfConverter} to 
* export a {@link FlexGrid} to PDF:
* 
* {@sample Grid/ImportExportPrint/PDF/ExportToFile/purejs Example}
*/
export class FlexGridPdfConverter {
    public static _DefaultExportSettings: IFlexGridExportSettings = _merge({
        scaleMode: ScaleMode.PageWidth,
        documentOptions: {
            compress: false, // turn off by default to improve performance
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
    }, _FlexGridPdfCoreConverter.DefaultDrawSettings);

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
    static draw(flex: any, doc: wijmo.pdf.PdfDocument, width?: number, height?: number, settings?: IFlexGridDrawSettings): void {
        this.drawToPosition(flex, doc, null, width, height, settings);
    }

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
    static drawToPosition(flex: any, doc: wijmo.pdf.PdfDocument, point: wijmo.Point, width?: number, height?: number, settings?: IFlexGridDrawSettings): void {
        wijmo.assert(!!flex, 'The flex argument cannot be null.');
        wijmo.assert(!!doc, 'The doc argument cannot be null.');

        let isControl = softGrid() && (flex instanceof softGrid().FlexGrid),
            ctrl: wijmo.grid.FlexGrid = flex,
            orgWidth: number;

        try {
            settings = _FlexGridPdfCoreConverter._applyDefaultDrawSettings(settings);

            let adapter = flex as _IFlexGridAdapter;

            if (isControl) {
                if (settings && settings.recalculateStarWidths) { // recalculate the star-sized columns to get a lesser scale factor
                    orgWidth = ctrl.columns.getTotalSize(); // save the current width
                    ctrl.columns._updateStarSizes(wijmo.pdf.ptToPx(doc.width));
                }
                adapter = this._getFlexGridAdapter(ctrl, settings);
            }

            _FlexGridPdfCoreConverter.draw(adapter, doc, point, width, height, settings);
        } finally {
            _removeFakeCell();

            if (isControl && settings && settings.recalculateStarWidths) {
                ctrl.columns._updateStarSizes(orgWidth); // rollback changes
            }
        }
    }

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
    static export(flex: wijmo.grid.FlexGrid, fileName: string, settings?: IFlexGridExportSettings): void {
        wijmo.assert(!!flex, 'The flex argument cannot be null.');
        wijmo.assert(!!fileName, 'The fileName argument cannot be empty.');

        settings = this._applyDefaultExportSettings(settings);

        var originalEnded = settings.documentOptions.ended;
        settings.documentOptions.ended = (sender: wijmo.pdf.PdfDocument, args: wijmo.pdf.PdfDocumentEndedEventArgs) => {
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
    }

    static _getFlexGridAdapter(flex: wijmo.grid.FlexGrid, settings: IFlexGridDrawSettings): _IFlexGridAdapter {
        var t = <typeof FlexGridAdapter>((softMultiRow() && (flex instanceof softMultiRow().MultiRow) && MultiRowAdapter) || // MultiRow
            (softSheet() && (flex instanceof softSheet().FlexSheet) && FlexSheetAdapter) || // FlexSheet
            (softOlap() && (flex instanceof softOlap().PivotGrid) && PivotGridAdapter) || // PivotGrid
            (softTransposed() && (flex instanceof softTransposed().TransposedGrid) && _TransposedGridAdapter) || // TransposedGrid
            (softTransposedMultiRow() && (flex instanceof softTransposedMultiRow().TransposedMultiRow) && TransposedMultiRowAdapter) || // TransposedMultiRow
            FlexGridAdapter);

        return new t(flex, settings);
    }

    // Clones and applies defaults.
    static _applyDefaultExportSettings(settings: any): IFlexGridExportSettings {
        return _merge(_merge({}, settings), this._DefaultExportSettings);
    }
}

class FlexGridAdapter<G extends wijmo.grid.FlexGrid> implements _IFlexGridAdapter {
    private _flex: G;
    private _settings: IFlexGridDrawSettings;
    private _styleCache: StyleCache;

    constructor(flex: G, settings: IFlexGridDrawSettings) {
        this._flex = flex;
        this._settings = settings;
        if (settings.quickCellStyles) {
            this._styleCache = new StyleCache(500);
        }
    }

    protected get flex(): G {
        return this._flex;
    }

    protected get settings(): IFlexGridDrawSettings {
        return this._settings;
    }

    get columns(): _IColumnCollection {
        return this._flex.columns;
    }

    get rows(): _IRowCollection {
        return this._flex.rows;
    }

    get bottomLeftCells(): _IGridPanel {
        return this._flex.bottomLeftCells;
    }

    get cells(): _IGridPanel {
        return this._flex.cells;
    }

    get columnFooters(): _IGridPanel {
        return this._flex.columnFooters;
    }

    get columnHeaders(): _IGridPanel {
        return this._flex.columnHeaders;
    }

    get rowHeaders(): _IGridPanel {
        return this._flex.rowHeaders;
    }

    get topLeftCells(): _IGridPanel {
        return this._flex.topLeftCells;
    }

    get treeIndent() {
        return this._flex.treeIndent;
    }

    getSelection(): _ICellRange[] {
        var ranges: _ICellRange[] = [],
            selection = this._flex.selection,
            sg = softGrid();

        switch (this._flex.selectionMode) {
            case sg.SelectionMode.None:
                break;

            case sg.SelectionMode.Cell:
            case sg.SelectionMode.CellRange:
                ranges.push(new _CellRange(selection.row, selection.col, selection.row2, selection.col2));
                break;

            case sg.SelectionMode.Row:
                ranges.push(new _CellRange(selection.topRow, 0, selection.topRow, this._flex.cells.columns.length - 1));
                break;

            case sg.SelectionMode.RowRange:
                ranges.push(new _CellRange(selection.topRow, 0, selection.bottomRow, this._flex.cells.columns.length - 1));
                break;

            case sg.SelectionMode.ListBox:
                var top = -1;

                for (var r = 0; r < this._flex.rows.length; r++) {
                    var row = <wijmo.grid.Row>this._flex.rows[r];

                    if (row.isSelected) {
                        if (top < 0) {
                            top = r;
                        }

                        if (r === this._flex.rows.length - 1) {
                            ranges.push(new _CellRange(top, 0, r, this._flex.cells.columns.length - 1));
                        }
                    } else {
                        if (top >= 0) {
                            ranges.push(new _CellRange(top, 0, r - 1, this._flex.cells.columns.length - 1));
                        }

                        top = -1;
                    }
                }

                break;
        }

        return ranges;
    }

    getCell(panel: _IGridPanel, row: number, column: number, updateContent: boolean): HTMLElement {
        var cell = (<wijmo.grid.GridPanel>panel).getCellElement(row, column);

        // Not in a view? Return a fake cell then.
        // Important: for DetailGrid always return a real cell, if possible (WJM-19946).
        if (!cell) {
            cell = getFakeCell(panel);
            this._flex.cellFactory.updateCell(<wijmo.grid.GridPanel>panel, row, column, cell, null, updateContent);
        }

        return cell;
    }

    private _defBorderColor: string = null;
    getComputedDefBorderColor(): string {
        if (this._defBorderColor == null) {
            let style = window.getComputedStyle(this._flex.hostElement);

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
    }

    getComputedStyle(panel: _IGridPanel, cell: HTMLElement): CSSStyleDeclaration {
        let style: CSSStyleDeclaration;

        let real = cell.getAttribute(FAKE_CELL) == null, // a real cell, not a fake one.
            className = cell.className,
            selected = className.indexOf('wj-state-selected') >= 0 || className.indexOf('wj-state-multi-selected') >= 0;

        if (selected) {
            // We don't want these styles to be exported to PDF.
            cell.className = className.replace('wj-state-selected', '').replace('wj-state-multi-selected', '');
        }

        if (this._styleCache) {
            let host = (<wijmo.grid.GridPanel>panel).hostElement;

            // Build the cache key.
            //
            // First, extract the key from the fakeCell's inline style.
            let key = cell.style.cssText.split(/;\s+/).filter(propVal => {
                var prop = propVal.substring(0, propVal.indexOf(':'));
                return /^(color|background-color|border-color|border-left-color|border-right-color|border-top-color|border-bottom-color|font|textAlign)/i.test(prop); // leave only those properties that begin with these words. See ICellStyle for supported properties.
            }).join(';');

            // Then add CSS class names to the key, starting with the fakeCell and ending with the panel element.
            let el = cell;
            do {
                key = el.className + key;
            } while (el !== host && (el = el.parentElement))

            // Check the cache.
            style = this._styleCache.getValue(key);
            if (!style) {
                style = window.getComputedStyle(cell);
                style = this._styleCache.add(key, style);
            }
        } else {
            style = _cloneStyle(window.getComputedStyle(cell)); // don't use a live object, after restoring the cell.className it will change.
        }

        if (real && selected) { // restore className
            cell.className = className;
        }

        return style;
    }

    getMergedRange(p: _IGridPanel, r: number, c: number): _ICellRange {
        let cr = this._flex.getMergedRange(<wijmo.grid.GridPanel>p, r, c, false);
        return cr ? new _CellRange(cr.row, cr.col, cr.row2, cr.col2) : null;
    }

    get showColumnHeader() {
        return !!(this._flex.headersVisibility & softGrid().HeadersVisibility.Column);
    }

    get showRowHeader() {
        return !!(this._flex.headersVisibility & softGrid().HeadersVisibility.Row);
    }

    get showColumnFooter() {
        return this._flex.columnFooters.rows.length > 0;
    }

    alignMergedTextToTheTopRow(panel: _IGridPanel) {
        return false;
    }

    getCellData(panel: _IGridPanel, row: number, col: number) {
        return (<wijmo.grid.GridPanel>panel).getCellData(row, col, true);
    }

    getCellContent(panel: _IGridPanel, row: _IRow, col: _IColumn, colIdx: number): string {
        let value: string,
            sg = softGrid();

        if (this.settings.customCellContent) {
            // take value directly from the cell
            let cell = this.getCell(panel, row.index, colIdx, true);

            //value = cell.textContent.trim();

            value = cell.innerText.trim(); // use innerText instead of textContent to normalize whitespaces (TFS 472692).
            value = (value as string).replace(/\r/gm, '').replace(/\n+/gm, '\n');

            if (!value && this.isBooleanCell(panel, row, col)) {
                value = this._extractCheckboxValue(cell) as any;
                value = value == null ? '' : value + '';
            }
        } else {
            let isHtml = (<wijmo.grid.Column>col).isContentHtml;

            value = this.getCellData(panel, row.index, colIdx);

            // handle formatted/localized group headers
            if (this.isGroupRow(row) && (panel.cellType === sg.CellType.Cell) && (col.index === panel.columns.firstVisibleIndex)) {
                isHtml = true;

                if (!value) {
                    value = (<wijmo.grid.GroupRow>row).getGroupHeader();
                }
            }

            // handle HTML content
            if (isHtml) {
                value = wijmo.toPlainText(value).trim();
            }
        }

        return value;
    }

    isBooleanCell(panel: _IGridPanel, row: _IRow, col: _IColumn): boolean {
        if (col.dataType !== wijmo.DataType.Boolean || panel.cellType !== softGrid().CellType.Cell) {
            return false;
        }

        if (this.isExpandableGroupRow(row)) {
            //return col.visibleIndex !== panel.columns.firstVisibleIndex;
            return col.visibleIndex > 0; // TFS 401965
        }

        return true;
    }

    getColumn(panel: _IGridPanel, row: number, col: number): _IColumn {
        return panel.columns[col];
    }

    isAlternatingRow(row: _IRow) {
        let altRow = false,
            altStep = this._flex.alternatingRowStep;

        if (altStep) {
            altRow = (row as wijmo.grid.Row).visibleIndex % (altStep + 1) == 0;
            if (altStep == 1) altRow = !altRow; // compatibility
        }

        return altRow;
    }

    isGroupRow(row: _IRow) {
        return row instanceof softGrid().GroupRow;
    }

    isNewRow(row: _IRow) {
        return row instanceof softGrid()._NewRowTemplate;
    }

    isDetailRow(row: _IRow) {
        return softDetail() && (row instanceof softDetail().DetailRow);
    }

    isExpandableGroupRow(row: _IRow) {
        return (row instanceof softGrid().GroupRow) && (<wijmo.grid.GroupRow>row).hasChildren; // Group row with no children rows should be treated as a data row (hierarchical grid)
    }

    isRenderableRow(row: _IRow) {
        return row.isVisible && row.renderHeight > 0 && !this.isNewRow(row);
    }

    isRenderableColumn(col: _IColumn) {
        return col.isVisible && col.renderWidth > 0;
    }

    getCellStyle(panel: _IGridPanel, row: _IRow, column: _IColumn) {
        var styles = this.settings.styles,
            result: ICellStyle = _merge({}, styles.cellStyle), // merge cell styles
            grid = this._flex,
            sg = softGrid();

        switch (panel.cellType) {
            case sg.CellType.Cell:
                if (this.isExpandableGroupRow(row)) {
                    _merge(result, styles.groupCellStyle, true);
                } else {
                    if (this.isAlternatingRow(row)) { // check row.index value; row.index == rowIndex.
                        _merge(result, styles.altCellStyle, true);
                    }
                }
                break;

            case sg.CellType.ColumnHeader:
            case sg.CellType.RowHeader:
            case sg.CellType.TopLeft:
            case sg.CellType.BottomLeft:
                _merge(result, styles.headerCellStyle, true);
                break;

            case sg.CellType.ColumnFooter:
                _merge(result, styles.headerCellStyle, true);
                _merge(result, styles.footerCellStyle, true);
                break;
        }

        if (!this.settings.customCellContent && grid._getShowErrors() && grid._getError(<wijmo.grid.GridPanel>panel, row.index, column.index)) {
            _merge(result, styles.errorCellStyle, true);
        }

        return result;
    }

    private _extractCheckboxValue(cell: HTMLElement): boolean {
        var cb = <HTMLInputElement>cell.querySelector('input[type=checkbox]'/*'input.wj-cell-check[type=checkbox]'*/);
        if (cb && cb.style.display !== 'none' && cb.style.visibility !== 'hidden') {
            return cb.checked;
        }

        return undefined;
    }
}

class FlexSheetAdapter extends FlexGridAdapter<wijmo.grid.sheet.FlexSheet> {

    //#region override

    public getCellData(panel: _IGridPanel, row: number, col: number): string {
        if (panel.cellType === softGrid().CellType.Cell) {
            // Treat the data row as a column header row 
            if (panel.rows[row] instanceof softSheet().HeaderRow) { // will be true for the first row of a data-bound sheet only
                return this.flex.columnHeaders.getCellData(row, col, true);
            }

            return this.flex.getCellValue(row, col, true); // formula evaluation
        }

        return super.getCellData(panel, row, col);
    }

    public getCellStyle(panel: _IGridPanel, row: _IRow, column: _IColumn): ICellStyle {
        var result = super.getCellStyle(panel, row, column),
            table = this.flex.selectedSheet.findTable(row.index, column.index);

        if (table) {
            var tableRange = table.getRange(),
                ri = row.index - tableRange.topRow,
                ci = column.index - tableRange.leftCol,
                style = table._getTableCellAppliedStyles(ri, ci);

            if (style) {
                (<ICellStyle><any>style).font = new wijmo.pdf.PdfFont(style.fontFamily, wijmo.pdf._asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight);
            }

            _merge(result, style, true);
        }

        return result;
    }

    // hide all headers/footers

    public get showColumnHeader(): boolean {
        return false;
    }

    public get showRowHeader(): boolean {
        return false;
    }

    public get showColumnFooter(): boolean {
        return false;
    }

    //#endregion
}

class MultiRowAdapter extends FlexGridAdapter<wijmo.grid.multirow.MultiRow> {
    //#region override

    public getColumn(panel: _IGridPanel, row: number, col: number): _IColumn {
        var rCol = super.getColumn(panel, row, col),
            bCol = this.flex.getBindingColumn(panel as wijmo.grid.GridPanel, row, col);

        // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
        // As Bernardo said: "The binding columns are not used for display, only their binding information matters."
        return _combineColumns(rCol, bCol);
    }

    public isAlternatingRow(row: _IRow): boolean {
        if (row instanceof softMultiRow()._MultiRow) {
            let altRow = false,
                altStep = this.flex.alternatingRowStep;

            if (altStep) {
                altRow = row.dataIndex % (altStep + 1) == 0;
                if (altStep == 1) altRow = !altRow; // compatibility
            }

            return altRow;
        }

        return super.isAlternatingRow(row);
    }

    //#endregion
}

class PivotGridAdapter extends FlexGridAdapter<wijmo.olap.PivotGrid> {
    //#region override

    public alignMergedTextToTheTopRow(panel: _IGridPanel): boolean {
        let sg = softGrid();
        return !this.flex.centerHeadersVertically && (panel.cellType === sg.CellType.ColumnHeader || panel.cellType === sg.CellType.RowHeader);
    }

    //#endregion
}

class _TransposedGridAdapter extends FlexGridAdapter<wijmo.grid.transposed.TransposedGrid> {
    public getColumn(panel: _IGridPanel, row: number, col: number): _IColumn {
        let rCol = super.getColumn(panel, row, col);

        if (panel.cellType != softGrid().CellType.Cell) {
            return rCol;
        } else {
            let bCol = (panel as wijmo.grid.GridPanel).grid._getBindingColumn(panel as wijmo.grid.GridPanel, row, rCol as wijmo.grid.Column);

            if (!bCol) {
                return rCol;
            }

            // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
            return _combineColumns(rCol, bCol);
        }
    }
}


class TransposedMultiRowAdapter extends FlexGridAdapter<wijmo.grid.transposedmultirow.TransposedMultiRow> {
    public getColumn(panel: _IGridPanel, row: number, col: number): _IColumn {
        let rCol = super.getColumn(panel, row, col);

        if (panel.cellType != softGrid().CellType.Cell) {
            return rCol;
        } else {
            let bCol = this.flex.getBindingColumn(panel as wijmo.grid.GridPanel, row, col);

            if (!bCol) {
                return rCol;
            }

            // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
            return _combineColumns(rCol, bCol);
        }
    }
}

class StyleCache {
    private _cache: { [key: string]: CSSStyleDeclaration } = {};
    private _max: number;
    private _size = 0;

    constructor(maxSize: number) {
        this._max = maxSize;
    }

    public add(key: string, value: CSSStyleDeclaration): CSSStyleDeclaration {
        if (this._size >= this._max) {
            this.clear();
        }

        // Don't keep a reference! We must clone the CSSStyleDeclaration object, otherwise there will be no performance gain.
        let clone = this._cache[key] = _cloneStyle(value);
        this._size++;

        return clone;
    }

    public clear() {
        this._cache = {};
        this._size = 0;
    }

    public getValue(key: string): CSSStyleDeclaration {
        return this._cache[key] || null;
    }

    public hasKey(key: string): boolean {
        return !!this._cache[key];
    }
}

    }
    


    module wijmo.grid.pdf {
    









// Always use a soft reference to these modules (in the places that will be transpiled directly to JS) to avoid requiring an import,
// otherwise webpack will embedd them into the worker bundle.
// The worker bundle should contain nothing but wijmo, wijmo.pdf and wijmo.grid.pdf modules, any other code is redundant.







'use strict';

/**
* Represents a single item of the {@link IClientData} dictionary.
*/
export interface IClientDataItem {
    /**
    * Gets or sets the content for the data item.
    */
    content: any;
    /**
    * Gets or sets the settings for the data item.
    */
    settings: any;
}

/**
* Represents a dictionary of {name: value} pairs which contains client data.
*/
export interface IClientData {
    [name: string]: IClientDataItem;
}

interface _IFlexGridClientDataItem extends IClientDataItem {
    content: _IFlexGridAdapter,
    settings: IFlexGridExportSettings,
    isGrid?: boolean;
    progressMessaging?: boolean; // enables progress messaging for exportGrid() method.
}

interface IWorkerExt extends Worker {
    clientData: { [name: string]: IClientDataItem }
}

interface IWorkerResponse {
    data: any;
    status: PdfWebWorkerResponseStatus;
}

enum PdfWebWorkerResponseStatus {
    Done = 1,
    Progress = 2
}

const DefGridName = '';

/**
 * Provides arguments for the callback parameter of the {@link PdfWebWorkerClient.exportGrid} and {@link PdfWebWorkerClient.export} methods.
 */
export class PdfWebWorkerExportDoneEventArgs extends wijmo.EventArgs {
    private _blob: Blob;
    private _buf: ArrayBuffer;

    /**
    * Initializes a new instance of the {@link PdfWebWorkerExportDoneEventArgs} class.
    *
    * @param buffer An ArrayBuffer.
    */
    constructor(buffer: ArrayBuffer) {
        super();
        this._buf = buffer;
    }

    /**
    * Gets a Blob object that contains the document data.
    */
    public get blob(): Blob {
        if (!this._blob) {
            this._blob = new Blob([new Uint8Array(this._buf)], { type: 'application/pdf' });
        }

        return this._blob;
    }

    /**
    * Gets an ArrayBuffer that contains the document data.
    */
    public get buffer(): ArrayBuffer {
        return this._buf;
    }
}

/**
 * Represents client-side methods for exporting FlexGrid to PDF/generating PDF, for use with Web Worker.
 */
export class PdfWebWorkerClient {
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
    public static exportGrid(worker: Worker, grid: wijmo.grid.FlexGrid, fileName: string, settings?: IFlexGridExportSettings, done?: (args: PdfWebWorkerExportDoneEventArgs) => false | void, progress?: (value: number) => void) {
        settings = FlexGridPdfConverter._applyDefaultExportSettings(settings);
        // Set .progress (to any function) to enable automatic progress messaging if the progress argument is set.        
        settings.progress = settings.progress || progress;

        this.addGrid(worker, grid, DefGridName, settings);

        this.export(worker, settings.documentOptions, (args: PdfWebWorkerExportDoneEventArgs) => {
            // No callback or the default action was not cancelled?
            if (!wijmo.isFunction(done) || (done(args) !== false)) {
                wijmo.pdf.saveBlob(args.blob, fileName);
            }
        }, progress);
    }

    /**
     * Exports PDF in a background thread.
     * 
     * @param worker The Web Worker instance to run the exporting code in.
     * @param settings An object containing {@link PdfDocument}'s initialization settings.
     * @param done The callback function to call when drawing is done. The function takes a single parameter, an instance of the {@link PdfWebWorkerExportDoneEventArgs} class.
     * @param progress An optional function that gives feedback about the progress of the export. The function takes a single parameter, a number changing from 0.0 to 1.0,
     * where the value of 0.0 indicates that the operation has just begun and the value of 1.0 indicates that the operation has completed.
     */
    public static export(worker: Worker, settings: any, done: (args: PdfWebWorkerExportDoneEventArgs) => void, progress?: (value: number) => void) {
        worker.addEventListener('message', function handler(e: MessageEvent) {
            let data = <IWorkerResponse>e.data;

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
                    throw `Unknown status: ${data.status}`;
            }
        });

        let transObj = this._clientDataToArrayBuffer(worker);
        worker.postMessage(<IClientDataItem>{ content: transObj, settings: settings }, [transObj]);

        this._clearClientData(worker); // don't store client data between the different export calls.
    }

    /**
     * Adds named FlexGrid with settings, which will be used in a Web Worker to generate a PDF document.
     * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
     *
     * @param worker The Web Worker instance to send the data to.
     * @param grid The grid
     * @param name The name associated with the grid.
     * @param settings The draw settings.
     */
    public static addGrid(worker: Worker, grid: wijmo.grid.FlexGrid, name: string, settings?: IFlexGridDrawSettings) {
        let json = this._gridToJson(grid, settings);
        this._addClientData(worker, JSON.stringify(json), name, settings, true);
    }

    /**
     * Adds named image with settings, which will be used in a Web Worker to generate a PDF document.
     * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
     *
     * @param worker The Web Worker instance to send the data to.
     * @param image A string containing the URL to get the image from or the data URI containing a base64 encoded image.
     * @param name The name associated with the image.
     * @param settings The image drawing settings.
     */
    public static addImage(worker: Worker, image: string, name: string, settings?: wijmo.pdf.IPdfImageDrawSettings) {
        let dataUri = (wijmo.isString(image) && image.indexOf('data:image/svg') >= 0)
            ? image // svg image
            : wijmo.pdf._PdfImageHelper.getDataUri(image); // raster image (jpg or png).

        this._addClientData(worker, dataUri, name, settings);
    }

    /**
     * Adds named string which will be used in a Web Worker code to generate a PDF document.
     * This method should be used in conjunction with the {@link PdfWebWorkerClient.export} method.
     *
     * @param worker The Web Worker instance to send the data to.
     * @param value The value.
     * @param name The name associated with the string.
     */
    public static addString(worker: Worker, value: string, name: string) {
        this._addClientData(worker, value, name, null);
    }

    /**
    * Serializes the {@link FlexGrid} to ArrayBuffer. The serialized data can be send to a Web Worker using the postMessage method.
    *
    * @param grid The {@link FlexGrid} instance to serialize.
    * @param settings The export settings used to serialize the grid.
    */
    public static serializeGrid(grid: wijmo.grid.FlexGrid, settings?: IFlexGridExportSettings): ArrayBuffer {
        let json = this._gridToJson(grid, settings);
        return strToBuf(JSON.stringify(json));
    }

    private static _addClientData(worker: Worker, value: string, name: string, settings?: any, isGrid = false) {
        wijmo.asType(worker, Worker);
        wijmo.asString(name);
        wijmo.asString(value, true);

        let w = <IWorkerExt>worker;
        w.clientData = w.clientData || {} as any;

        w.clientData[name] = {
            content: value,
            settings: settings ? JSON.stringify(settings) : null,
        };

        var gridData = <_IFlexGridClientDataItem>w.clientData[name];

        if (isGrid) {
            gridData.isGrid = true;
            gridData.progressMessaging = settings ? wijmo.isFunction((<IFlexGridDrawSettings>settings).progress) : false;
        }
    }

    private static _clearClientData(worker: Worker) {
        let w = <IWorkerExt>worker;
        delete w.clientData;
    }

    private static _clientDataToArrayBuffer(worker: Worker): ArrayBuffer {
        let w = <IWorkerExt>worker;
        return strToBuf(JSON.stringify(w.clientData || {}));
    }

    private static _gridToJson(grid: wijmo.grid.FlexGrid, settings?: IFlexGridExportSettings): IFlexGridJson {
        settings = FlexGridPdfConverter._applyDefaultExportSettings(settings);

        let doc: wijmo.pdf.PdfDocument,
            orgWidth: number;

        try {
            doc = new wijmo.pdf.PdfDocument(settings.documentOptions);

            if (settings && settings.recalculateStarWidths) { // recalculate the star-sized columns to get a lesser scale factor
                orgWidth = grid.columns.getTotalSize(); // save the current width
                grid.columns._updateStarSizes(wijmo.pdf.ptToPx(doc.width));
            }

            let gridJson = this._getJsonConverter(grid, settings).convert();
            //let buffer = strToBuf(JSON.stringify(gridJson));

            return gridJson;
        }
        finally {
            _removeFakeCell();

            if (settings && settings.recalculateStarWidths) {
                grid.columns._updateStarSizes(orgWidth); // rollback changes.
            }

            if (doc != null) {
                doc.dispose();
                doc = null;
            }
        }
    }

    private static _getJsonConverter(flex: wijmo.grid.FlexGrid, settings: IFlexGridDrawSettings): FlexGridJsonConverter<wijmo.grid.FlexGrid, IGridPanelJson, IFlexGridJson> {
        var t = <typeof FlexGridJsonConverter>((softMultiRow() && (flex instanceof softMultiRow().MultiRow) && MultiRowJsonConverter) || // MultiRow
            (softOlap() && (flex instanceof softOlap().PivotGrid) && PivotGridJsonConverter) || // PivotGrid
            (softTransposed() && (flex instanceof softTransposed().TransposedGrid) && TransposedGridJsonConverter) || // TransposedGrid
            (softTransposedMultiRow() && (flex instanceof softTransposedMultiRow().TransposedMultiRow) && TransposedMultirowJsonConverter) || // TransposedMultiRow
            FlexGridJsonConverter);

        return new t(flex, settings, FlexGridPdfConverter._getFlexGridAdapter(flex, settings));
    }
}

/**
 * Represents server-side methods for exporting FlexGrid to PDF/generating PDF, for use with Web Worker.
 */
export class PdfWebWorker {
    /**
     * Performs the export started in a UI thread by calling the {@link PdfWebWorkerClient.exportGrid} method.
     */
    public static initExportGrid() {
        this.initExport((doc: wijmo.pdf.PdfDocument, clientData: IClientData) => {
            var gridData: _IFlexGridClientDataItem = clientData[DefGridName];

            if (gridData.progressMessaging) {
                gridData.settings._progressMax = FlexGridPdfConverter._DefaultExportSettings._progressMax; // use 9:1 ratio, as the FlexGridPdfConverter.export() method.

                gridData.settings.progress = (value) => {
                    this.sendExportProgress(value);
                };

                doc.ended.addHandler(() => {
                    this.sendExportProgress(1); //_maxProgress = 0.9, inform that the operation has completed.
                });
            }

            FlexGridPdfConverter.draw(gridData.content, doc, null, null, gridData.settings);
            doc.end();
        });
    }

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
    public static initExport(draw: (doc: wijmo.pdf.PdfDocument, clientData: IClientData) => void) {
        self.addEventListener('message', function handler(e: MessageEvent) {
            self.removeEventListener('message', handler);

            let data = <IClientDataItem>e.data;
            let clientData: IClientData = JSON.parse(bufToStr(data.content));
            let docSettings = data.settings || {};

            docSettings.ended = (sender: wijmo.pdf.PdfDocument, args: wijmo.pdf.PdfDocumentEndedEventArgs) => {
                // Convert Blob to ArrayBuffer and send it to client
                blobToBuf(args.blob, (buffer) => {
                    (<Worker><any>self).postMessage(<IWorkerResponse>{ data: buffer, status: PdfWebWorkerResponseStatus.Done }, [buffer]);
                });
            };

            let doc = new wijmo.pdf.PdfDocument(docSettings);

            Object.keys(clientData).forEach(key => {
                let value = clientData[key];

                if (value.settings) {
                    value.settings = JSON.parse(value.settings);
                }

                if ((<_IFlexGridClientDataItem>value).isGrid) {
                    if (value.settings) {
                        PdfWebWorker._disableUnsupportedFeatures(value.settings);
                    }

                    value.content = PdfWebWorker._deserializeGridFromString(value.content, value.settings);
                }
            });

            draw(doc, clientData);
        });
    }

    /**
     * Sends the progress value to a client, where it will be handled by the {@link PdfWebWorkerClient.export}'s progress callback function.
     * Should be used in conjunction with the {@link PdfWebWorkerClient.export} method to inform client about the progress of the export.
     *
     * @param value The progress value, in the range of [0.0..1.0].
     */
    public static sendExportProgress(value: number): void {
        value = wijmo.clamp(value, 0, 1);
        (<Worker><any>self).postMessage(<IWorkerResponse>{ data: value, status: PdfWebWorkerResponseStatus.Progress });
    }

    /**
    * Deserializes the {@link FlexGrid} from ArrayBuffer to its internal representation that can be used in a Web Worker and passed to the {@link FlexGridPdfConverter.draw} and {@link FlexGridPdfConverter.drawToPosition} methods.
    *
    * @param data The data to deserialize.
    * @param settings The draw settings used to deserialize the grid.
    */
    public static deserializeGrid(data: ArrayBuffer, settings?: IFlexGridDrawSettings): any {
        return this._deserializeGridFromString(bufToStr(data), settings);
    }

    private static _deserializeGridFromString(jsonStr: string, settings?: IFlexGridDrawSettings): FlexGridJsonAdapter {
        return this._getJsonAdapter(JSON.parse(jsonStr), FlexGridPdfConverter._applyDefaultExportSettings(settings));
    }

    private static _disableUnsupportedFeatures(settings: IFlexGridDrawSettings) {
        settings.customCellContent = false;
    }

    private static _getJsonAdapter(json: IFlexGridJson, settings: IFlexGridExportSettings): FlexGridJsonAdapter {
        switch (json.typeName) {
            case 'MultiRow':
                return new MultiRowJsonAdapter(json as any, settings);
            case 'PivotGrid':
                return new PivotGridJsonAdapter(json as any, settings);
            case 'TransposedGrid':
                return new TransposedGridJsonAdapter(json as any, settings);
            case 'TransposedMultiRow':
                return new TransposedMultiRowJsonAdapter(json as any, settings);
            default:
                return new FlexGridJsonAdapter(json, settings)
        }
    }
}

//#region Utils
function bufToStr(value: ArrayBuffer): string {
    var array = new Uint16Array(value);

    var str = "";
    for (var i = 0, len = array.length; i < len; i++) {
        str += String.fromCharCode(array[i]);
    }
    return str;
    // unable to use due to stack overflow.
    // return String.fromCharCode.apply(null, array); 
}

function strToBuf(value: string): ArrayBuffer {
    var buffer = new ArrayBuffer(value.length * 2),
        view = new Uint16Array(buffer);

    for (var i = 0, len = value.length; i < len; i++) {
        view[i] = value.charCodeAt(i);
    }

    return buffer;
}

function blobToBuf(blob: Blob, done: (value: ArrayBuffer) => void): void {
    wijmo.asFunction(done);

    var fileReader = new FileReader();
    fileReader.onload = function (e) {
        done((e.target as any).result);
    };
    fileReader.readAsArrayBuffer(blob);
}
//#endregion

//#region FlexGrid JSON model

enum RowState {
    None = 0,
    Alternate = 1,
    Group = 2,
    ExpandableGroup = 4,
    New = 8,
    Visible = 16,
    Detail = 32 // instance of the wijmo.Detail.DetailRow class.
}

enum ColState {
    None = 0,
    Visible = 1
}

interface IGridPanelJson {
    columns: IColumnJson[];
    cellType: _CellType;
    rows: IRowJson[];
    mergedRanges: number[][]; // An array of merged cell ranges (an unique ranges having colspan/rowspan > 1); each CellRange item is represented by the [row, col, row2, col2] array.
    height: number;
    width: number;

    columnsFirstVisibleIndex: number;
    rowsMaxGroupLevel: number;
}

interface IRowColJson {
    binding?: string;
    dataType?: wijmo.DataType;
}

interface IColumnJson extends IRowColJson {
    aggregate: number;
    alignment?: string;
    name?: string;
    renderWidth: number;
    state: ColState;
    visibleIndex: number;
    wordWrap?: boolean;
    multiLine?: boolean;
}

interface IRowJson extends IRowColJson {
    alignment?: string;
    cells: string[];
    level?: number;
    renderHeight: number;
    state: RowState;
    wordWrap?: boolean;
    multiLine?: boolean;
    errors?: { [index: number]: number }; // Indicates whether row.cells[i] has an error or not.
}

interface IFlexGridJson {
    typeName: string;
    bottomLeftCells: IGridPanelJson;
    cells: IGridPanelJson;
    columnFooters: IGridPanelJson;
    columnHeaders: IGridPanelJson;
    rowHeaders: IGridPanelJson;
    topLeftCells: IGridPanelJson;

    selection: number[][]; // An array of selected cell ranges; each CellRange item is represented by the [row, col, row2, col2] array.
    treeIndent: number;
    showColumnFooter: boolean;
    showColumnHeader: boolean;
    showRowHeader: boolean;
}

interface IMultiRowPanelCellGroup {
    bindingColumns: IColumnJson[];
    mappings: number[][];
}

interface IMultiRowPanelJson extends IGridPanelJson {
    cellGroups: IMultiRowPanelCellGroup;
}

interface IMultiRowJson extends IFlexGridJson {
    rowsPerItem: number;
}

interface IPivotGridJson extends IFlexGridJson {
    centerHeadersVertically: boolean;
}

interface ITransposedGridJson extends IFlexGridJson {
    rowInfo: IColumnJson[]; // contains cells.rows[i].dataItem._rowInfo for each row of the .cells panel.
}

interface ITransposedMultiRowCellGroup {
    bindingColumns: IColumnJson[];
    mappings: number[][];
}

interface ITransposedMultiRowJson extends IFlexGridJson {
    cellGroups: ITransposedMultiRowCellGroup;
    columnsPerItem: number;
}

//#endregion FlexGrid JSON model

//#region Converters

class FlexGridJsonConverter<G extends wijmo.grid.FlexGrid, P extends IGridPanelJson, R extends IFlexGridJson> {
    private _flex: G;
    private _adapter: _IFlexGridAdapter;
    private _settings: IFlexGridDrawSettings;

    constructor(flex: G, settings: IFlexGridDrawSettings, adapter: _IFlexGridAdapter) {
        this._flex = flex;
        this._settings = settings;
        this._adapter = adapter;
    }

    convert(): R {
        var result: R = {} as any;

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
    }

    protected get adapter() {
        return this._adapter;
    }

    protected get flex(): G {
        return this._flex;
    }

    private _getTypeName(flex: wijmo.grid.FlexGrid): string {
        return flex.constructor.toString().match(/function\s*(\w+)/)[1];
    }

    private _getRowState(row: wijmo.grid.Row): RowState {
        var state = RowState.None;

        if (this.adapter.isAlternatingRow(row)) {
            state |= RowState.Alternate;
        }

        if (row instanceof softGrid().GroupRow) {
            state |= RowState.Group;
        }

        if (this.adapter.isDetailRow(row)) {
            state |= RowState.Detail;
        }

        if (this.adapter.isExpandableGroupRow(row)) {
            state |= RowState.ExpandableGroup;
        }

        if (row instanceof softGrid()._NewRowTemplate) {
            state |= RowState.New;
        }

        if (row.isVisible) {
            state |= RowState.Visible;
        }

        return state;
    }

    private _getColumnState(col: _IColumn): ColState {
        var state = ColState.None;

        if (col.isVisible) {
            state |= ColState.Visible;
        }

        return state;
    }

    private _serializeSelection(): number[][] {
        let selection = this.adapter.getSelection(),
            result: number[][] = [];

        for (let i = 0; i < selection.length; i++) {
            var cr = selection[i];
            result.push([cr.row, cr.col, cr.row2, cr.col2]);
        }

        return result;
    }

    protected _serializeColumns(columns: _IColumn[]): IColumnJson[] {
        let result: IColumnJson[] = [];

        for (let i = 0, len = (columns || []).length; i < len; i++) {
            let col = columns[i],
                jcol: IColumnJson = null;

            if (col) {
                jcol = <IColumnJson>{
                    aggregate: col.aggregate,
                    renderWidth: col.renderWidth,
                    visibleIndex: col.visibleIndex
                };

                let al = col.getAlignment();
                if (al) {
                    jcol.alignment = al;
                }

                let state = this._getColumnState(col);
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
    }

    protected _serializePanel(panel: wijmo.grid.GridPanel): P {
        let result = <P>{
            cellType: <number>panel.cellType,
            height: panel.height,
            width: panel.width
        };

        // Taken from Column.getAlignment(row?: Row)
        let getAlignment = (row: wijmo.grid.Row) => {
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
        }

        result.mergedRanges = this._serializeMergedRanges(panel);

        result.columns = this._serializeColumns(panel.columns);
        result.columnsFirstVisibleIndex = panel.columns.firstVisibleIndex;

        result.rows = [];
        result.rowsMaxGroupLevel = panel.rows.maxGroupLevel;

        let collectErrors = !this._settings.customCellContent && this._flex._getShowErrors();

        for (let i = 0, rowsLen = panel.rows.length, colsLen = panel.columns.length; i < rowsLen; i++) {
            let row: wijmo.grid.Row = panel.rows[i];

            let jrow = <IRowJson>{
                renderHeight: row.renderHeight
            };

            result.rows.push(jrow);

            let al = getAlignment(row);
            if (al) {
                jrow.alignment = al;
            }

            if (row instanceof softGrid().GroupRow) {
                jrow.level = row.level;
            }

            let state = this._getRowState(row);
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
            let sg = softGrid();

            for (let j = 0; j < colsLen; j++) {
                let value = this._adapter.getCellContent(panel, panel.rows[i], panel.columns[j], j);
                if (wijmo.isFunction(this._settings.formatItem)) {
                    let fargs = new PdfFormatItemEventArgs(panel, new sg.CellRange(i, j), null, null, null, null, null, () => this._adapter.getCell(panel, i, j, true), null);
                    fargs.data = value;
                    this._settings.formatItem(fargs);
                    if (fargs.data !== value) {
                        value = fargs.data;
                    }
                }
                jrow.cells[j] = value;

                if (collectErrors && this._flex._getError(panel, i, j)) {
                    if (!jrow.errors) {
                        jrow.errors = {};
                    }

                    jrow.errors[j] = 1;
                }
            }
        }

        return result;
    }

    private _serializeMergedRanges(panel: wijmo.grid.GridPanel): number[][] {
        var ranges: number[][] = [];
        var idc: number[] = [];

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
    }
}

class MultiRowJsonConverter extends FlexGridJsonConverter<wijmo.grid.multirow.MultiRow, IMultiRowPanelJson, IMultiRowJson> {
    convert(): IMultiRowJson {
        let result = super.convert();
        result.rowsPerItem = this.flex.rowsPerItem;
        return result;
    }

    protected _serializePanel(panel: wijmo.grid.GridPanel) {
        let result = super._serializePanel(panel);
        result.cellGroups = this._serializeCellGroup(panel);
        return result;
    }

    private _serializeCellGroup(panel: wijmo.grid.GridPanel): IMultiRowPanelCellGroup {
        let bindingColumns: wijmo.grid.Column[] = [],
            mappings: number[][] = [],
            sg = softGrid();

        let cnt = this.flex.rowsPerItem;
        if (panel.cellType === sg.CellType.TopLeft || panel.cellType === sg.CellType.ColumnHeader) {
            cnt = panel.rows.length;
        }

        for (let r = 0; r < cnt; r++) {
            mappings[r] = [];

            for (let c = 0; c < panel.columns.length; c++) {
                let bc = this.flex.getBindingColumn(panel, r, c);
                let idx = bindingColumns.indexOf(bc);

                if (idx < 0) {
                    mappings[r][c] = bindingColumns.push(bc) - 1;
                } else {
                    mappings[r][c] = idx;
                }
            }
        }

        return {
            bindingColumns: this._serializeColumns(bindingColumns),
            mappings: mappings
        };
    }
}

class PivotGridJsonConverter extends FlexGridJsonConverter<wijmo.olap.PivotGrid, IGridPanelJson, IPivotGridJson> {
    convert() {
        let result = super.convert();
        result.centerHeadersVertically = this.flex.centerHeadersVertically;
        return result;
    }
}

class TransposedGridJsonConverter extends FlexGridJsonConverter<wijmo.grid.transposed.TransposedGrid, IGridPanelJson, ITransposedGridJson> {
    convert() {
        let result = super.convert();

        let rowInfo: _IColumn[] = new Array(this.flex.cells.rows.length),
            p = this.flex.cells,
            sg = softGrid();

        for (var i = 0, len = p.rows.length; i < len; i++) {
            var dataItem = (p.rows[i].dataItem),
                ri: any = dataItem && dataItem._rowInfo;

            if (!(ri instanceof sg.Column)) { // _rowInfo is a POJO, it means that TransposedGrid has autogenerated rows.
                ri = _combineColumns(ri, ri); // turn it into a _IColumn-like object.
            }

            rowInfo[i] = ri;
        }

        result.rowInfo = this._serializeColumns(rowInfo);

        return result;
    }
}

class TransposedMultirowJsonConverter extends FlexGridJsonConverter<wijmo.grid.transposedmultirow.TransposedMultiRow, IGridPanelJson, ITransposedMultiRowJson> {
    convert() {
        let result = super.convert();
        result.cellGroups = this._serializeCellGroup();
        result.columnsPerItem = this.flex.columnsPerItem;
        return result;
    }

    private _serializeCellGroup(): ITransposedMultiRowCellGroup {
        let bindingColumns: wijmo.grid.Column[] = [],
            mappings: number[][] = [];

        let cnt = this.flex.columnsPerItem,
            panel = this.flex.cells;

        for (let r = 0; r < panel.rows.length; r++) {
            mappings[r] = [];

            for (let c = 0; c < cnt; c++) {
                let bc = this.flex.getBindingColumn(panel, r, c);
                let idx = bindingColumns.indexOf(bc);

                if (idx < 0) {
                    mappings[r][c] = bindingColumns.push(bc) - 1;
                } else {
                    mappings[r][c] = idx;
                }
            }
        }

        return {
            bindingColumns: this._serializeColumns(bindingColumns),
            mappings: mappings
        };
    }
}

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

class RowJson /*extends RowColJson*/ implements _IRow {
    public readonly index: number;
    public readonly binding: string | null;
    public readonly dataType: number | null;

    public readonly alignment: string;
    public readonly level: number;
    public readonly renderHeight: number;
    public readonly cells: string[];
    public readonly wordWrap: boolean;
    public readonly multiLine: boolean;
    public readonly errors: { [index: number]: number } | null;
    private _state: RowState;

    constructor(json: IRowJson, index: number) {
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

    get isAlternatingRow(): boolean {
        return (this._state & RowState.Alternate) !== RowState.None;
    }

    get isGroupRow(): boolean {
        return (this._state & RowState.Group) !== RowState.None;
    }

    get isDetailRow(): boolean {
        return (this._state & RowState.Detail) !== RowState.None;
    }

    get isExpandableGroupRow(): boolean {
        return (this._state & RowState.ExpandableGroup) !== RowState.None;
    }

    get isNewRow(): boolean {
        return (this._state & RowState.New) !== RowState.None;
    }

    get isVisible(): boolean {
        return (this._state & RowState.Visible) !== RowState.None;
    }
}

class ColumnJson /*extends RowColJson*/ implements _IColumn {
    public readonly index: number;
    public readonly binding: string | null;
    public readonly dataType: number | null;

    public readonly aggregate: number;
    public readonly name: string | null;
    public readonly renderWidth: number;
    public readonly visibleIndex: number;
    public readonly wordWrap: boolean;
    public readonly multiLine: boolean;

    private _alignment: string;
    private _state: ColState;

    constructor(json: IColumnJson, index: number) {
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

    getAlignment(row?: RowJson): string {
        if (this._alignment) {
            return this._alignment;
        }

        if (row && row.alignment) {
            return row.alignment;
        }

        return '';
    }

    get isVisible(): boolean {
        return (this._state & ColState.Visible) !== ColState.None;
    }
}

class RowJsonCollection implements _IRowCollection {
    public readonly length: number;
    public readonly maxGroupLevel: number;
    [index: number]: RowJson;

    constructor(json: IRowJson[], maxGroupLevel: number = -1) {
        //this._maxGroupLevel = json.maxGroupLevel;
        this.maxGroupLevel = maxGroupLevel;
        this.length = json.length;

        for (let i = 0; i < json.length; i++) {
            this[i] = new RowJson(json[i], i) as any;
        }
    }
}

class ColumnJsonCollection implements _IColumnCollection {
    public readonly length: number;
    public readonly firstVisibleIndex: number;
    [index: number]: ColumnJson;

    constructor(json: IColumnJson[], firstVisibleIndex: number = -1) {
        //this._firstVisibleIndex = json.firstVisibleIndex;
        this.firstVisibleIndex = firstVisibleIndex;
        this.length = json.length;

        for (let i = 0; i < json.length; i++) {
            let ji = json[i];
            this[i] = ji ? new ColumnJson(json[i], i) as any : null;
        }
    }
}

class GridJsonPanel implements _IGridPanel {
    public readonly height: number;
    public readonly width: number;
    public readonly cellType: number;
    public readonly columns: ColumnJsonCollection;
    public readonly rows: RowJsonCollection;

    private _mergedRanges: _CellRange[][];

    constructor(json: IGridPanelJson) {
        this.height = json.height;
        this.width = json.width;
        this.cellType = json.cellType;
        this.columns = new ColumnJsonCollection(json.columns, json.columnsFirstVisibleIndex);
        this.rows = new RowJsonCollection(json.rows, json.rowsMaxGroupLevel);
        this._mergedRanges = this._deserializeMergedRanges(json.mergedRanges);
    }

    public getCellData(r: number, c: number) {
        return this.rows[r].cells[c];
    }

    public getMergedRange(r: number, c: number): _ICellRange {
        let mr = this._mergedRanges[r];

        if (mr) {
            for (let i = 0, len = mr.length; i < len; i++) {
                var range = mr[i];

                if (c >= range.col && c <= range.col2) {
                    return range;
                }
            }
        }

        return null;
    }

    private _deserializeMergedRanges(ranges: number[][]): _CellRange[][] {
        let result: _CellRange[][] = [];

        ranges = ranges || [];

        for (let i = 0, len = this.rows.length; i < len; i++) {
            result[i] = [];
        }

        for (let i = 0, len = ranges.length; i < len; i++) {
            let item = ranges[i],
                cr = new _CellRange(item[0], item[1], item[2], item[3]);

            for (let j = cr.row; j <= cr.row2; j++) {
                result[j].push(cr);
            }
        }

        return result;
    }
}

class FlexGridJsonAdapter implements _IFlexGridAdapter {
    public readonly bottomLeftCells: GridJsonPanel;
    public readonly cells: GridJsonPanel;
    public readonly columnFooters: GridJsonPanel;
    public readonly columnHeaders: GridJsonPanel;
    public readonly rowHeaders: GridJsonPanel;
    public readonly topLeftCells: GridJsonPanel;

    public readonly treeIndent: number;
    public readonly showColumnFooter: boolean;
    public readonly showColumnHeader: boolean;
    public readonly showRowHeader: boolean;
    public readonly settings: IFlexGridDrawSettings;

    private _selection: _ICellRange[];

    constructor(json: IFlexGridJson, settings: IFlexGridDrawSettings) {
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
        for (let i = 0; i < json.selection.length; i++) {
            let item = json.selection[i];
            this._selection.push(new _CellRange(item[0], item[1], item[2], item[3]));
        }
    }

    get columns(): _IColumnCollection {
        return this.cells.columns;
    }

    get rows(): _IRowCollection {
        return this.cells.rows;
    }

    getSelection(): _ICellRange[] {
        return this._selection;
    }

    getCell(panel: _IGridPanel, row: number, column: number, updateContent: boolean): HTMLElement {
        throw 'Not implemented';
    }

    getComputedDefBorderColor(): string {
        throw 'Not implemented';
    }

    getComputedStyle(panel: _IGridPanel, cell: HTMLElement): CSSStyleDeclaration {
        throw 'Not implemented';
    }

    getMergedRange(p: GridJsonPanel, r: number, c: number): _ICellRange {
        return p.getMergedRange(r, c);
    }

    alignMergedTextToTheTopRow(panel: GridJsonPanel): boolean {
        return false;
    }

    getCellData(panel: GridJsonPanel, row: number, col: number): string {
        return panel.getCellData(row, col);
    }

    getCellContent(panel: GridJsonPanel, row: _IRow, col: _IColumn, colIdx: number): string {
        return this.getCellData(panel, row.index, colIdx);
    }

    isBooleanCell(panel: _IGridPanel, row: RowJson, col: _IColumn): boolean {
        return col.dataType === wijmo.DataType.Boolean && panel.cellType === _CellType.Cell && !this.isExpandableGroupRow(row);
    }

    getColumn(panel: GridJsonPanel, row: number, col: number): _IColumn {
        return panel.columns[col];
    }

    isAlternatingRow(row: RowJson): boolean {
        return row.isAlternatingRow;
    }

    isGroupRow(row: RowJson): boolean {
        return row.isGroupRow;
    }

    isNewRow(row: RowJson): boolean {
        return row.isNewRow;
    }

    isDetailRow(row: RowJson): boolean {
        return row.isDetailRow;
    }

    isExpandableGroupRow(row: RowJson): boolean {
        return row.isExpandableGroupRow;
    }

    isRenderableRow(row: RowJson): boolean {
        return row.isVisible && row.renderHeight > 0 && !this.isNewRow(row);
    }

    isRenderableColumn(col: ColumnJson): boolean {
        return col.isVisible && col.renderWidth > 0;
    }

    getCellStyle(panel: _IGridPanel, row: RowJson, column: _IColumn): ICellStyle {
        var styles = this.settings.styles,
            result: ICellStyle = _merge({}, styles.cellStyle); // merge cell styles

        switch (panel.cellType) {
            case _CellType.Cell:
                if (this.isExpandableGroupRow(row)) {
                    _merge(result, styles.groupCellStyle, true);
                } else {
                    if (this.isAlternatingRow(row)) { // check row.index value; row.index == rowIndex.
                        _merge(result, styles.altCellStyle, true);
                    }
                }
                break;

            case _CellType.ColumnHeader:
            case _CellType.RowHeader:
            case _CellType.TopLeft:
            case _CellType.BottomLeft:
                _merge(result, styles.headerCellStyle, true);
                break;

            case _CellType.ColumnFooter:
                _merge(result, styles.headerCellStyle, true);
                _merge(result, styles.footerCellStyle, true);
                break;
        }

        if (row.errors && row.errors[column.index]) {
            _merge(result, styles.errorCellStyle, true);
        }

        return result;
    }

    protected deserializePanel(json: IGridPanelJson): GridJsonPanel {
        return new GridJsonPanel(json);
    }
}

class PivotGridJsonAdapter extends FlexGridJsonAdapter {
    private _centerHeadersVertically: boolean;

    constructor(json: IPivotGridJson, settings: IFlexGridDrawSettings) {
        super(json, settings);

        this._centerHeadersVertically = json.centerHeadersVertically;
    }

    // override
    public alignMergedTextToTheTopRow(panel: GridJsonPanel): boolean {
        return !this._centerHeadersVertically && (panel.cellType === _CellType.ColumnHeader || panel.cellType === _CellType.RowHeader);
    }
}

class MultiRowJsonPanel extends GridJsonPanel {
    private _cellGroups: {
        bindingColumns: ColumnJsonCollection,
        mappings: number[][]
    };

    constructor(json: IMultiRowPanelJson) {
        super(json);

        if (json.cellGroups) {
            this._cellGroups = {
                bindingColumns: new ColumnJsonCollection(json.cellGroups.bindingColumns),
                mappings: json.cellGroups.mappings
            };
        }
    }

    public getColumn(r: number, c: number, rowsPerItem: number): _IColumn {
        var rCol = this.columns[c];

        if (this._cellGroups) {
            if (this.cellType !== _CellType.ColumnHeader && this.cellType !== _CellType.BottomLeft) {
                r = r % rowsPerItem;
            }

            var bCol = this._cellGroups.bindingColumns[this._cellGroups.mappings[r][c]];

            // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
            return _combineColumns(rCol, bCol);
        }

        return rCol;
    }
}

class MultiRowJsonAdapter extends FlexGridJsonAdapter {
    private _rowsPerItem: number;

    constructor(json: IMultiRowJson, settings: IFlexGridDrawSettings) {
        super(json, settings);

        this._rowsPerItem = json.rowsPerItem;
    }

    // override
    protected deserializePanel(json: IMultiRowPanelJson): GridJsonPanel {
        return new MultiRowJsonPanel(json);
    }

    // override
    getColumn(panel: MultiRowJsonPanel, row: number, col: number): _IColumn {
        return panel.getColumn(row, col, this._rowsPerItem);
    }
}

class TransposedGridJsonAdapter extends FlexGridJsonAdapter {
    private _rowInfo: ColumnJsonCollection;

    constructor(json: ITransposedGridJson, settings: IFlexGridDrawSettings) {
        super(json, settings);
        this._rowInfo = new ColumnJsonCollection(json.rowInfo);
    }

    getColumn(panel: GridJsonPanel, row: number, col: number): _IColumn {
        let rCol = super.getColumn(panel, row, col);

        if (panel.cellType !== _CellType.Cell) {
            return rCol;
        } else {
            let bCol = this._rowInfo[row];

            if (!bCol) {
                return rCol;
            }

            // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
            return _combineColumns(rCol, bCol);
        }
    }
}

class TransposedMultiRowJsonAdapter extends FlexGridJsonAdapter {
    private _columnsPerItem: number;
    private _cellGroups: {
        bindingColumns: ColumnJsonCollection,
        mappings: number[][]
    };

    constructor(json: ITransposedMultiRowJson, settings: IFlexGridDrawSettings) {
        super(json, settings);

        this._columnsPerItem = json.columnsPerItem;

        if (json.cellGroups) {
            this._cellGroups = {
                bindingColumns: new ColumnJsonCollection(json.cellGroups.bindingColumns),
                mappings: json.cellGroups.mappings
            };
        }
    }

    getColumn(panel: GridJsonPanel, row: number, col: number): _IColumn {
        let rCol = super.getColumn(panel, row, col);

        if (this._cellGroups && panel.cellType === _CellType.Cell) {
            col = col % this._columnsPerItem;

            let bCol = this._cellGroups.bindingColumns[this._cellGroups.mappings[row][col]];

            // Combine both regular and binding column into a single object because binding column has wrong index/visibleIndex values.
            return _combineColumns(rCol, bCol);
        }

        return rCol;
    }
}

//#endregion Adapters
    }
    


    module wijmo.grid.pdf {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.pdf', wijmo.grid.pdf);






    }
    