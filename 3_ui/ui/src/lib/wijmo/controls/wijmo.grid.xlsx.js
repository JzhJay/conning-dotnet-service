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
        var xlsx;
        (function (xlsx) {
            function softDetail() {
                return wijmo._getModule('wijmo.grid.detail');
            }
            xlsx.softDetail = softDetail;
            function softMultiRow() {
                return wijmo._getModule('wijmo.grid.multirow');
            }
            xlsx.softMultiRow = softMultiRow;
            function softTransposed() {
                return wijmo._getModule('wijmo.grid.transposed');
            }
            xlsx.softTransposed = softTransposed;
            function softTransposedMultiRow() {
                return wijmo._getModule('wijmo.grid.transposedmultirow');
            }
            xlsx.softTransposedMultiRow = softTransposedMultiRow;
        })(xlsx = grid.xlsx || (grid.xlsx = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var xlsx;
        (function (xlsx) {
            'use strict';
            /**
             * This class provides static <b>load</b> and <b>save</b> methods for loading
             * and saving {@link FlexGrid} controls from and to Excel xlsx files.
             *
             * The example below shows how you can use the {@link FlexGridXlsxConverter} to
             * export the content of a {@link FlexGrid} control to XLSX:
             *
             * {@sample Grid/ImportExportPrint/Excel/Async/purejs Example}
             */
            var FlexGridXlsxConverter = /** @class */ (function () {
                function FlexGridXlsxConverter() {
                }
                /**
                 * Save the {@link FlexGrid} instance to the {@link Workbook} instance.
                 * This method works with JSZip 2.5.
                 *
                 * For example:
                 * <pre>// This sample exports FlexGrid content to an xlsx file.
                 * // click.
                 * &nbsp;
                 * // HTML
                 * &lt;button
                 *     onclick="saveXlsx('FlexGrid.xlsx')"&gt;
                 *     Save
                 * &lt;/button&gt;
                 * &nbsp;
                 * // JavaScript
                 * function saveXlsx(fileName) {
                 *     // Save the flexGrid to xlsx file.
                 *     wijmo.grid.xlsx.FlexGridXlsxConverter.save(flexGrid,
                 *             { includeColumnHeaders: true }, fileName);
                 * }</pre>
                 *
                 * @param grid FlexGrid that will be saved.
                 * @param options {@link IFlexGridXlsxOptions} object specifying the save options.
                 * @param fileName Name of the file that will be generated.
                 * @return A {@link Workbook} object that can be used to customize the workbook
                 * before saving it (with the Workbook.save method).
                 */
                FlexGridXlsxConverter.save = function (grid, options, fileName) {
                    //window['xlsxTime'] = Date.now();
                    var workbook = new wijmo.xlsx.Workbook();
                    this._saveFlexGridToWorkbook(workbook, grid, options, false, null);
                    //console.log(`Workbook created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
                    //window['xlsxTime'] = Date.now();
                    if (fileName) {
                        workbook.save(fileName);
                    }
                    return workbook;
                };
                /**
                 * Asynchronously saves the content of a {@link FlexGrid} to a file.
                 *
                 * This method requires JSZip 3.0.
                 *
                 * The return value depends on the {@link asyncWorkbook} parameter. If it is false (default) then the
                 * method returns the {@link Workbook} instance. If it is true then the method returns a null value
                 * and the {@link Workbook} instance should be obtained in the {@link onSaved} callback.
                 *
                 * If {@link asyncWorkbook} parameter is true then, once started, the task will be automatically
                 * restarted when changes in the grid are detected.
                 *
                 * @param grid FlexGrid that will be saved.
                 * @param options {@link IFlexGridXlsxOptions} object specifying the save options.
                 * @param fileName Name of the file that will be generated.
                 * @param onSaved Callback invoked when the method finishes executing.
                 * The callback provides access to the content of the saved workbook
                 * (encoded as a base-64 string and passed as a parameter to the callback).
                 * @param onError Callback invoked when there are errors saving the file.
                 * The error is passed as a parameter to the callback.
                 * @param onProgress Callback function that gives feedback about the progress of a task.
                 * The function accepts a single argument, the current progress as a number between 0 and 100.
                 * Can be used only if the {@link asyncWorkbook} parameter is set to true.
                 * @param asyncWorkbook Indicates whether Workbook genaration should be performed asynchronously or not.
                 * The default value is false.
                 *
                 * For example:
                 * <pre>
                 * wijmo.grid.xlsx.FlexGridXlsxConverter.saveAsync(flexGrid,
                 *     { includeColumnHeaders: true }, // options
                 *     'FlexGrid.xlsx', // filename
                 *     function (base64) { // onSaved
                 *         // User can access the base64 string in this callback.
                 *         document.getElementByID('export').href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' + 'base64,' + base64;
                 *     },
                 *     function (reason) { // onError
                 *         // User can catch the failure reason in this callback.
                 *         console.log('The reason of save failure is ' + reason);
                 *     }
                 *  );</pre>
                 */
                FlexGridXlsxConverter.saveAsync = function (grid, options, fileName, onSaved, onError, onProgress, asyncWorkbook) {
                    var _this = this;
                    var workbook = new wijmo.xlsx.Workbook();
                    if (!asyncWorkbook) {
                        // Use the old manner: the workbook generation is synchronous.
                        this._saveFlexGridToWorkbook(workbook, grid, options, false, null);
                        if (fileName) {
                            workbook.saveAsync(fileName, function (base64) {
                                if (wijmo.isFunction(onSaved)) {
                                    onSaved(base64, workbook);
                                }
                            }, onError, null);
                        }
                        else {
                            if (wijmo.isFunction(onSaved)) {
                                onSaved(null, workbook);
                            }
                        }
                        return workbook;
                    }
                    // Progress ratio
                    //
                    // Stage 1 (0-50%)
                    //  100% grid -> workbook
                    // Stage 2 (51-100%)
                    //  90% workbook -> in-memory xlsx
                    //  10% xlsx -> zip (JSZip)
                    var remap = fileName != null;
                    this.cancelAsync(function () {
                        var timer, events = [
                            grid.collectionView && grid.collectionView.collectionChanged,
                            grid.columns && grid.columns.collectionChanged,
                            grid.rows && grid.rows.collectionChanged,
                            grid.resizedColumn, grid.resizedRow
                        ], removeHandlers = function () { return events.forEach(function (v) {
                            if (v) {
                                v.removeHandler(restart);
                            }
                        }); }, restart = function () {
                            // Inform the underlying task about cancellation immediately (#438498)
                            _this._cs && _this._cs.cancel(false);
                            // Then wait for debouncing to settle and restart the export.
                            clearTimeout(timer);
                            timer = setTimeout(function () {
                                removeHandlers();
                                workbook = null;
                                _this.saveAsync(grid, options, fileName, onSaved, onError, onProgress);
                            }, 100);
                        }, finish = function () {
                            clearTimeout(timer);
                            _this._cs = null;
                            removeHandlers();
                        };
                        //window['xlsxTime'] = Date.now();
                        _this._cs = new wijmo.xlsx._SyncPromise(null, finish);
                        events.forEach(function (v) {
                            if (v) {
                                v.addHandler(restart);
                            }
                        });
                        _this._saveFlexGridToWorkbook(workbook, grid, options, true, _this._cs, function (progress) {
                            if (wijmo.isFunction(onProgress)) {
                                onProgress(remap ? Math.round(wijmo.xlsx._map(progress, 0, 100, 0, 50)) : progress);
                            }
                        }).then(function () {
                            //console.log(`Workbook created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
                            //window['xlsxTime'] = Date.now();
                            if (fileName) {
                                workbook._externalCancellation = function () { return _this._cs; };
                                workbook.saveAsync(fileName, function (base64) {
                                    finish();
                                    if (wijmo.isFunction(onSaved)) {
                                        onSaved(base64, workbook);
                                    }
                                }, function (err) {
                                    finish();
                                    if (wijmo.isFunction(onError)) {
                                        onError(err); // React only to JSZip errors, like the original code does?
                                    }
                                }, function (progress) {
                                    if (wijmo.isFunction(onProgress)) {
                                        onProgress(Math.round(wijmo.xlsx._map(progress, 0, 100, 51, 100)));
                                    }
                                });
                            }
                            else {
                                finish();
                                if (wijmo.isFunction(onProgress)) {
                                    onProgress(100);
                                }
                                if (wijmo.isFunction(onSaved)) {
                                    onSaved(null, workbook);
                                }
                            }
                        }, function (er) {
                            finish();
                            throw er;
                        });
                    });
                    return null;
                };
                /**
                 * Cancels the task started by the {@link FlexGridXlsxConverter.saveAsync} method.
                 * @param done Callback invoked when the method finishes executing.
                 */
                FlexGridXlsxConverter.cancelAsync = function (done) {
                    var _this = this;
                    if (this._cs) { // exporting in progress
                        this._cs.cancel();
                        setTimeout(function () {
                            _this._cs = null;
                            if (wijmo.isFunction(done)) {
                                done();
                            }
                        }, 100);
                    }
                    else {
                        if (wijmo.isFunction(done)) {
                            done();
                        }
                    }
                };
                /**
                 * Loads a {@link Workbook} instance or a Blob object containing xlsx
                 * file content to the {@link FlexGrid} instance.
                 * This method works with JSZip 2.5.
                 *
                 * For example:
                 * <pre>// This sample opens an xlsx file chosen through Open File
                 * // dialog and fills FlexGrid with the content of the first
                 * // sheet.
                 * &nbsp;
                 * // HTML
                 * &lt;input type="file"
                 *     id="importFile"
                 *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                 * /&gt;
                 * &lt;div id="flexHost"&gt;&lt;/&gt;
                 * &nbsp;
                 * // JavaScript
                 * var flexGrid = new wijmo.grid.FlexGrid("#flexHost"),
                 *     importFile = document.getElementById('importFile');
                 * &nbsp;
                 * importFile.addEventListener('change', function () {
                 *     loadWorkbook();
                 * });
                 * &nbsp;
                 * function loadWorkbook() {
                 *     var reader,
                 *         file = importFile.files[0];
                 *     if (file) {
                 *         reader = new FileReader();
                 *         reader.onload = function (e) {
                 *             wijmo.grid.xlsx.FlexGridXlsxConverter.load(flexGrid, reader.result,
                 *                 { includeColumnHeaders: true });
                 *         };
                 *         reader.readAsArrayBuffer(file);
                 *     }
                 * }</pre>
                 *
                 * @param grid {@link FlexGrid} that loads the {@link Workbook} object.
                 * @param workbook A {@link Workbook}, Blob, base-64 string, or ArrayBuffer
                 * containing the xlsx file content.
                 * @param options {@link IFlexGridXlsxOptions} object specifying the load options.
                 */
                FlexGridXlsxConverter.load = function (grid, workbook, options) {
                    var _this = this;
                    if (workbook instanceof Blob) {
                        _blobToBuffer(workbook, function (buffer) {
                            workbook = null;
                            var wb = new wijmo.xlsx.Workbook();
                            //var begin = Date.now();
                            wb.load(buffer);
                            buffer = null;
                            //console.log(`xlsx loaded in ${(Date.now() - begin) / 1000} seconds`);
                            //begin = Date.now();
                            grid.deferUpdate(function () {
                                _this._loadToFlexGrid(grid, wb, options);
                                wb = null;
                                //console.log(`FlexGrid loaded in ${(Date.now() - begin) / 1000} seconds`);
                            });
                        });
                    }
                    else if (workbook instanceof wijmo.xlsx.Workbook) {
                        grid.deferUpdate(function () {
                            _this._loadToFlexGrid(grid, workbook, options);
                            workbook = null;
                        });
                    }
                    else {
                        if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                            throw 'Invalid workbook.';
                        }
                        var wb_1 = new wijmo.xlsx.Workbook();
                        wb_1.load(workbook);
                        workbook = null;
                        grid.deferUpdate(function () {
                            _this._loadToFlexGrid(grid, wb_1, options);
                            wb_1 = null;
                        });
                    }
                };
                /**
                 * Asynchronously loads a {@link Workbook} or a Blob representing an xlsx file
                 * into a {@link FlexGrid}.
                 *
                 * This method requires JSZip 3.0.
                 *
                 * @param grid {@link FlexGrid} that loads the {@link Workbook} object.
                 * @param workbook {@link Workbook}, Blob, base-64 string, or ArrayBuffer
                 * representing the xlsx file content.
                 * @param options {@link IFlexGridXlsxOptions} object specifying the load options.
                 * @param onLoaded Callback invoked when the method finishes executing.
                 * The callback provides access to the workbook that was loaded
                 * (passed as a parameter to the callback).
                 * @param onError Callback invoked when there are errors saving the file.
                 * The error is passed as a parameter to the callback.
                 *
                 * For example:
                 * <pre>
                 * wijmo.grid.xlsx.FlexGridXlsxConverter.loadAsync(grid, blob, null, function (workbook) {
                 *      // user can access the loaded workbook instance in this callback.
                 *      var app = worksheet.application ;
                 *      ...
                 * }, function (reason) {
                 *      // User can catch the failure reason in this callback.
                 *      console.log('The reason of save failure is ' + reason);
                 * });
                 * </pre>
                 */
                FlexGridXlsxConverter.loadAsync = function (grid, workbook, options, onLoaded, onError) {
                    var _this = this;
                    if (workbook instanceof Blob) {
                        _blobToBuffer(workbook, function (buffer) {
                            workbook = null;
                            var wb = new wijmo.xlsx.Workbook();
                            //var begin = Date.now();
                            wb.loadAsync(buffer, function () {
                                buffer = null;
                                //console.log(`xlsx loaded in ${(Date.now() - begin) / 1000} seconds`);
                                //begin = Date.now();
                                grid.deferUpdate(function () {
                                    _this._loadToFlexGrid(grid, wb, options);
                                    //console.log(`FlexGrid loaded in ${(Date.now() - begin) / 1000} seconds`);
                                    if (onLoaded) {
                                        onLoaded(wb);
                                    }
                                    wb = null;
                                });
                            }, onError);
                        });
                    }
                    else if (workbook instanceof wijmo.xlsx.Workbook) {
                        grid.deferUpdate(function () {
                            _this._loadToFlexGrid(grid, workbook, options);
                            if (onLoaded) {
                                onLoaded(workbook);
                            }
                            workbook = null;
                        });
                    }
                    else {
                        if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                            throw 'Invalid workbook.';
                        }
                        var wb_2 = new wijmo.xlsx.Workbook();
                        wb_2.loadAsync(workbook, function () {
                            workbook = null;
                            grid.deferUpdate(function () {
                                _this._loadToFlexGrid(grid, wb_2, options);
                                if (onLoaded) {
                                    onLoaded(wb_2);
                                }
                                wb_2 = null;
                            });
                        }, onError);
                    }
                };
                // Save the flexgrid to workbook instance.
                FlexGridXlsxConverter._saveFlexGridToWorkbook = function (workbook, grid, options, isAsync, cs, progress) {
                    var p = new wijmo.xlsx._SyncPromise(cs), workSheet = new wijmo.xlsx.WorkSheet(), includeColumnHeaders = options && options.includeColumnHeaders != null ? options.includeColumnHeaders : true, includeRowHeaders = options && options.includeRowHeaders != null ? options.includeRowHeaders : false, includeCellStyles = _IncludeCellStyles.Cache, includeColumns = options ? options.includeColumns : null, formatItem = options ? options.formatItem : null, cellsCache = [];
                    if (options) {
                        includeCellStyles = wijmo.asBoolean(options.includeCellStyles, true) === false
                            ? _IncludeCellStyles.None
                            : (wijmo.asBoolean(options.quickCellStyles, true) === false
                                ? _IncludeCellStyles.Regular
                                : _IncludeCellStyles.Cache);
                    }
                    var styleCache = (includeCellStyles === _IncludeCellStyles.Cache) ? new _StyleCache(500) : null;
                    if (this.hasCssText == null) {
                        this.hasCssText = 'cssText' in document.body.style;
                    }
                    // Set sheet name for the exporting sheet.
                    var sheetInfo = grid['wj_sheetInfo'];
                    workSheet.name = options ? options.sheetName : '';
                    workSheet.visible = options ? (options.sheetVisible !== false) : true;
                    if (sheetInfo && sheetInfo.tables && sheetInfo.tables.length > 0) {
                        for (var i = 0; i < sheetInfo.tables.length; i++) {
                            workSheet.tables.push(sheetInfo.tables[i]);
                        }
                    }
                    var fakeCell;
                    if (!sheetInfo && (includeCellStyles !== _IncludeCellStyles.None || formatItem)) {
                        fakeCell = document.createElement('div');
                        fakeCell.style.visibility = 'hidden';
                        fakeCell.setAttribute(wijmo.grid.FlexGrid._WJS_MEASURE, 'true');
                        grid.hostElement.appendChild(fakeCell);
                    }
                    var rowHeaderColumnCnt = includeRowHeaders ? grid.rowHeaders.columns.length : 0, headerColumnsInfo = this._getPerRowColumnsSettings(grid, includeRowHeaders ? [grid.topLeftCells, grid.columnHeaders] : [grid.columnHeaders]), // extract columns settings from the headerp panels
                    headerColumns = headerColumnsInfo.cols, dataColumns = (xlsx.softMultiRow() && (grid instanceof xlsx.softMultiRow().MultiRow))
                        ? this._getPerRowColumnsSettings(grid, includeRowHeaders ? [grid.rowHeaders, grid.cells] : [grid.cells], grid.rowsPerItem).cols // MultiRow: extract columns settings from the data panels
                        : null, columnHeaderRowCnt = headerColumns.length; // visible rows only
                    var panels = [
                        [grid.topLeftCells, grid.columnHeaders],
                        [grid.rowHeaders, grid.cells],
                        [grid.bottomLeftCells, grid.columnFooters]
                    ];
                    if (!includeColumnHeaders) {
                        panels.shift();
                    }
                    var totalRows = panels.map(function (p) { return p[1].rows.length; }).reduce(function (a, c) { return a + c; });
                    if (headerColumns.length) {
                        // Fill workSheet.columns
                        headerColumns[0].forEach(function (col, i) {
                            var bndCol = headerColumnsInfo.bndCols[0][i]; // a binding column associated with the col
                            if (i >= rowHeaderColumnCnt /*ColumnHeader*/ && includeColumns && !includeColumns(bndCol)) {
                                return;
                            }
                            var workbookColumn = new wijmo.xlsx.WorkbookColumn();
                            workbookColumn._deserialize(col);
                            workSheet._addWorkbookColumn(workbookColumn);
                        });
                    }
                    this._saveContentToWorksheet(cs, isAsync, Date.now(), 0, {
                        panels: panels,
                        panelIdx: 0,
                        globRowIdx: 0,
                        rowsOffset: 0,
                        totalRows: totalRows
                    }, grid, workSheet, includeRowHeaders, function (cellType) {
                        // MultiRow only: Because of headerLayoutDefinition the header and data columns can have different structures and formatting.
                        if (cellType == wijmo.grid.CellType.Cell && dataColumns) {
                            return dataColumns;
                        }
                        return headerColumns;
                    }, includeCellStyles, fakeCell, cellsCache, styleCache, includeColumns, formatItem, function (gri) {
                        progress(Math.round(gri / totalRows * 100));
                    }, function () {
                        var workbookFrozenPane = new wijmo.xlsx.WorkbookFrozenPane();
                        workbookFrozenPane.rows = includeColumnHeaders ? (grid.frozenRows + columnHeaderRowCnt) : grid.frozenRows;
                        workbookFrozenPane.columns = includeRowHeaders ? (grid.frozenColumns + rowHeaderColumnCnt) : grid.frozenColumns;
                        workSheet.frozenPane = workbookFrozenPane;
                        workbook._addWorkSheet(workSheet);
                        if (!sheetInfo && (includeCellStyles !== _IncludeCellStyles.None || formatItem)) {
                            // done with style element
                            grid.hostElement.removeChild(fakeCell);
                            cellsCache.forEach(function (p) { return p.forEach(function (el) {
                                if (el && el.parentElement) {
                                    el.parentElement.removeChild(el);
                                }
                            }); });
                        }
                        if (styleCache) {
                            styleCache.clear();
                        }
                        workbook.activeWorksheet = options ? options.activeWorksheet : null;
                        p.resolve();
                    });
                    return p;
                };
                FlexGridXlsxConverter._saveContentToWorksheet = function (cs, isAsync, batchStart, startIndex, batchCtx, grid, workSheet, includeRowHeaders, columnSettingsGetter, includeCellStyles, fakeCell, cellsCache, styleCache, includeColumns, formatItem, progress, done) {
                    var _this = this;
                    var _BATCH_SIZE = includeCellStyles ? 20 : 200, // number of rows per batch
                    _BATCH_DELAY = 100, // ms
                    _BATCH_TIMEOUT = 0; // ms
                    var _loop_1 = function (gri) {
                        if (cs && cs.cancelled) {
                            return { value: void 0 };
                        }
                        // let go of the thread for a while
                        if (isAsync && gri - startIndex > _BATCH_SIZE && Date.now() - batchStart > _BATCH_DELAY) {
                            setTimeout(function () {
                                if (cs && cs.cancelled) {
                                    return;
                                }
                                progress(gri);
                                _this._saveContentToWorksheet(cs, isAsync, Date.now(), gri, batchCtx, grid, workSheet, includeRowHeaders, columnSettingsGetter, includeCellStyles, fakeCell, cellsCache, styleCache, includeColumns, formatItem, progress, done);
                            }, _BATCH_TIMEOUT);
                            return { value: void 0 };
                        }
                        // Switch to the next panel if the end of the current panel is reached; skip panels with no rows.
                        while (gri - batchCtx.rowsOffset >= batchCtx.panels[batchCtx.panelIdx][1].rows.length) {
                            batchCtx.rowsOffset += batchCtx.panels[batchCtx.panelIdx][1].rows.length;
                            batchCtx.panelIdx++;
                        }
                        var pnl = batchCtx.panels[batchCtx.panelIdx], header = pnl[0], content = pnl[1], ri = gri - batchCtx.rowsOffset; // Row index relative to current panel.
                        var row = content.rows[ri];
                        if ((content.cellType !== wijmo.grid.CellType.Cell && row.renderSize <= 0) || row instanceof wijmo.grid._NewRowTemplate) {
                            return "continue";
                        }
                        var rowHeaderColumnCnt = 0, workbookRowOM = {}, workbookRow = new wijmo.xlsx.WorkbookRow(), isGroupRow = row instanceof wijmo.grid.GroupRow, groupLevel = 0;
                        if (content.cellType === wijmo.grid.CellType.Cell) {
                            if (isGroupRow) {
                                groupLevel = row.level;
                            }
                            else {
                                if (grid.rows.maxGroupLevel > -1) {
                                    groupLevel = grid.rows.maxGroupLevel + 1;
                                }
                            }
                        }
                        var columnSettings = columnSettingsGetter(content.cellType);
                        if (includeRowHeaders) {
                            rowHeaderColumnCnt = this_1._parseFlexGridRowToSheetRow(header, workbookRowOM, ri, 0, columnSettings, includeCellStyles, fakeCell, cellsCache, styleCache, isGroupRow, groupLevel, includeColumns, formatItem);
                        }
                        this_1._parseFlexGridRowToSheetRow(content, workbookRowOM, ri, rowHeaderColumnCnt, columnSettings, includeCellStyles, fakeCell, cellsCache, styleCache, isGroupRow, groupLevel, includeColumns, formatItem);
                        // Only the row contains cells need be added into the Workbook Object Model.
                        if (workbookRowOM.cells.length > 0) {
                            workbookRow._deserialize(workbookRowOM);
                            workSheet._addWorkbookRow(workbookRow, batchCtx.globRowIdx);
                        }
                        batchCtx.globRowIdx++;
                    };
                    var this_1 = this;
                    for (var gri = startIndex; gri < batchCtx.totalRows; gri++) {
                        var state_1 = _loop_1(gri);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                    if (wijmo.isFunction(done)) {
                        done();
                    }
                };
                // Load the workbook instance to flexgrid
                FlexGridXlsxConverter._loadToFlexGrid = function (grid, workbook, options) {
                    if (xlsx.softTransposedMultiRow() && (grid instanceof xlsx.softTransposedMultiRow().TransposedMultiRow)) {
                        throw 'Not supported.';
                    }
                    options = options || {};
                    var isFlexSheet = grid['wj_sheetInfo'] != null, currentSheet, styledCells = {}, mergedRanges = [], fonts = [], groupCollapsedSettings = {};
                    grid.itemsSource = null;
                    grid.columns.clear();
                    grid.columnHeaders.rows.clear();
                    // grid.rowHeaders.columns.clear(); // TFS 465018
                    grid.rows.clear();
                    grid.frozenColumns = 0;
                    grid.frozenRows = 0;
                    var sheetIndex = options.sheetIndex != null && !isNaN(options.sheetIndex) ? options.sheetIndex : 0;
                    if (sheetIndex < 0 || sheetIndex >= workbook.sheets.length) {
                        throw 'The sheet index option is out of the sheet range of current workbook.';
                    }
                    if (options.sheetName != null) {
                        for (var i = 0; i < workbook.sheets.length; i++) {
                            if (options.sheetName === workbook.sheets[i].name) {
                                currentSheet = workbook.sheets[i];
                                break;
                            }
                        }
                    }
                    currentSheet = currentSheet || workbook.sheets[sheetIndex];
                    if (currentSheet.rows == null) {
                        return;
                    }
                    var columnCount = this._getColumnCount(currentSheet.rows), rowCount = this._getRowCount(currentSheet.rows, columnCount), columnSettings = currentSheet.columns;
                    for (var c = 0; c < columnCount; c++) {
                        grid.columns.push(new wijmo.grid.Column());
                        if (!!columnSettings[c]) {
                            if (!isNaN(+columnSettings[c].width)) {
                                grid.columns[c].width = +columnSettings[c].width;
                            }
                            if (!columnSettings[c].visible && columnSettings[c].visible != null) {
                                grid.columns[c].visible = !!columnSettings[c].visible;
                            }
                            if (columnSettings[c].style && !!columnSettings[c].style.wordWrap) {
                                grid.columns[c].wordWrap = columnSettings[c].style.wordWrap;
                            }
                        }
                    }
                    var includeColumnHeaders = (options.includeColumnHeaders != null ? options.includeColumnHeaders : true) && currentSheet.rows.length > 0, colHdrHeight = includeColumnHeaders ? this._getColumnHeadersHeight(currentSheet) : 0;
                    //var begin = Date.now();
                    var groupCollapsed = false, groupRow, columns = [];
                    var frzRows = currentSheet.frozenPane && currentSheet.frozenPane.rows, frzCols = currentSheet.frozenPane && currentSheet.frozenPane.columns;
                    frzRows = wijmo.isNumber(frzRows) && !isNaN(frzRows) ? frzRows : null;
                    frzCols = wijmo.isNumber(frzCols) && !isNaN(frzCols) ? frzCols : null;
                    for (var r = colHdrHeight; r < rowCount; r++) {
                        var isGroupHeader = false, rowWordWrap = null, sheetRow = currentSheet.rows[r];
                        //if (r % 1000 === 0 && r !== 0) {
                        //    console.log(`${r} rows loaded in ${(Date.now() - begin) / 1000} seconds`);
                        //    begin = Date.now();
                        //}
                        if (sheetRow) {
                            var nextRowIdx = r + 1;
                            while (nextRowIdx < currentSheet.rows.length) {
                                var nextRow = currentSheet.rows[nextRowIdx];
                                if (nextRow) {
                                    if ((isNaN(sheetRow.groupLevel) && !isNaN(nextRow.groupLevel))
                                        || (!isNaN(sheetRow.groupLevel) && sheetRow.groupLevel < nextRow.groupLevel)) {
                                        isGroupHeader = true;
                                    }
                                    break;
                                }
                                else {
                                    nextRowIdx++;
                                }
                            }
                        }
                        if (isGroupHeader && !currentSheet.summaryBelow) {
                            if (groupRow) {
                                groupRow.isCollapsed = groupCollapsed;
                            }
                            groupRow = new wijmo.grid.GroupRow();
                            groupRow.isReadOnly = false;
                            groupCollapsed = sheetRow.collapsed == null ? false : sheetRow.collapsed;
                            groupRow.level = isNaN(sheetRow.groupLevel) ? 0 : sheetRow.groupLevel;
                            groupCollapsedSettings[groupRow.level] = groupCollapsed;
                            if (this._checkParentCollapsed(groupCollapsedSettings, groupRow.level)) {
                                groupRow._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, true);
                            }
                            grid.rows.push(groupRow);
                        }
                        else {
                            var row = new wijmo.grid.Row();
                            if (sheetRow && this._checkParentCollapsed(groupCollapsedSettings, sheetRow.groupLevel)) {
                                row._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, true);
                            }
                            grid.rows.push(row);
                        }
                        if (sheetRow && !!sheetRow.height && !isNaN(sheetRow.height)) {
                            grid.rows[r - colHdrHeight].height = sheetRow.height;
                        }
                        for (var c = 0; c < columnCount; c++) {
                            if (sheetRow) {
                                var item = sheetRow.cells[c], formula = item ? item.formula : null;
                                if (formula && formula[0] !== '=') {
                                    formula = '=' + formula;
                                }
                                if (item && item.textRuns && item.textRuns.length > 0) {
                                    grid.rows[r - colHdrHeight].isContentHtml = true;
                                    grid.setCellData(r - colHdrHeight, c, this._parseTextRunsToHTML(item.textRuns));
                                }
                                else {
                                    grid.setCellData(r - colHdrHeight, c, formula && isFlexSheet ? formula : this._getItemValue(item));
                                }
                                if (!isGroupHeader) {
                                    this._setColumn(columns, c, item);
                                }
                                // Set styles for the cell in current processing sheet.
                                var cellIndex = r * columnCount + c, cellStyle = item ? item.style : null;
                                if (cellStyle) {
                                    rowWordWrap = rowWordWrap == null ? !!cellStyle.wordWrap : rowWordWrap && !!cellStyle.wordWrap;
                                    if (isFlexSheet) {
                                        var cellFormat = wijmo.xlsx.Workbook._parseExcelFormat(item), textAlign = void 0;
                                        if (cellStyle.hAlign) {
                                            textAlign = wijmo.xlsx.Workbook._parseHAlignToString(wijmo.asEnum(cellStyle.hAlign, wijmo.xlsx.HAlign));
                                        }
                                        else {
                                            switch (this._getItemType(item)) {
                                                case wijmo.DataType.Number:
                                                    textAlign = 'right';
                                                    break;
                                                case wijmo.DataType.Boolean:
                                                    textAlign = 'center';
                                                    break;
                                                default:
                                                    if (cellFormat && cellFormat.search(/[n,c,p]/i) === 0) {
                                                        textAlign = 'right';
                                                    }
                                                    else {
                                                        textAlign = 'left';
                                                    }
                                                    break;
                                            }
                                        }
                                        styledCells[cellIndex] = {
                                            fontWeight: cellStyle.font && cellStyle.font.bold ? 'bold' : 'none',
                                            fontStyle: cellStyle.font && cellStyle.font.italic ? 'italic' : 'none',
                                            textDecoration: cellStyle.font && cellStyle.font.underline ? 'underline' : 'none',
                                            textAlign: textAlign,
                                            fontFamily: cellStyle.font && cellStyle.font.family ? cellStyle.font.family : '',
                                            fontSize: cellStyle.font && cellStyle.font.size ? cellStyle.font.size + 'px' : '',
                                            color: cellStyle.font && cellStyle.font.color ? cellStyle.font.color : '',
                                            backgroundColor: cellStyle.fill && cellStyle.fill.color ? cellStyle.fill.color : '',
                                            whiteSpace: cellStyle.wordWrap ? 'pre-wrap' : 'normal',
                                            format: cellFormat
                                        };
                                        if (cellStyle.borders) {
                                            if (cellStyle.borders.left) {
                                                this._parseBorderStyle(cellStyle.borders.left.style, 'Left', styledCells[cellIndex]);
                                                styledCells[cellIndex].borderLeftColor = cellStyle.borders.left.color;
                                            }
                                            if (cellStyle.borders.right) {
                                                this._parseBorderStyle(cellStyle.borders.right.style, 'Right', styledCells[cellIndex]);
                                                styledCells[cellIndex].borderRightColor = cellStyle.borders.right.color;
                                            }
                                            if (cellStyle.borders.top) {
                                                this._parseBorderStyle(cellStyle.borders.top.style, 'Top', styledCells[cellIndex]);
                                                styledCells[cellIndex].borderTopColor = cellStyle.borders.top.color;
                                            }
                                            if (cellStyle.borders.bottom) {
                                                this._parseBorderStyle(cellStyle.borders.bottom.style, 'Bottom', styledCells[cellIndex]);
                                                styledCells[cellIndex].borderBottomColor = cellStyle.borders.bottom.color;
                                            }
                                        }
                                        // If the fill color of cell is defined but the border color is not, use the fill color as the border color.
                                        if (cellStyle.fill && cellStyle.fill.color) {
                                            var sc = styledCells[cellIndex], bs = cellStyle.borders, fc = cellStyle.fill.color;
                                            if (!bs) {
                                                sc.borderLeftColor = fc;
                                                if (c !== frzCols - 1) {
                                                    sc.borderRightColor = fc;
                                                }
                                                sc.borderTopColor = fc;
                                                if (r !== frzRows - 1) {
                                                    sc.borderBottomColor = fc;
                                                }
                                            }
                                            else {
                                                if (!bs.left || !bs.left.color) {
                                                    sc.borderLeftColor = fc;
                                                }
                                                if ((!bs.right || !bs.right.color) && (c !== frzCols - 1)) {
                                                    sc.borderRightColor = fc;
                                                }
                                                if (!bs.top || !bs.top.color) {
                                                    sc.borderTopColor = fc;
                                                }
                                                if ((!bs.bottom || !bs.bottom.color) && (r !== frzRows - 1)) {
                                                    sc.borderBottomColor = fc;
                                                }
                                            }
                                        }
                                        if (cellStyle.font && fonts.indexOf(cellStyle.font.family) === -1) {
                                            fonts.push(cellStyle.font.family);
                                        }
                                    }
                                }
                                // Get merged cell ranges.
                                if (isFlexSheet && item && (wijmo.isNumber(item.rowSpan) && item.rowSpan > 0)
                                    && (wijmo.isNumber(item.colSpan) && item.colSpan > 0)
                                    && (item.rowSpan > 1 || item.colSpan > 1)) {
                                    mergedRanges.push(new wijmo.grid.CellRange(r, c, r + item.rowSpan - 1, c + item.colSpan - 1));
                                }
                            }
                        }
                        if (sheetRow) {
                            if (!this._checkParentCollapsed(groupCollapsedSettings, sheetRow.groupLevel) && !sheetRow.visible && sheetRow.visible != null) {
                                grid.rows[r - colHdrHeight].visible = sheetRow.visible;
                            }
                            grid.rows[r - colHdrHeight].wordWrap = (!!sheetRow.style && !!sheetRow.style.wordWrap) || !!rowWordWrap;
                        }
                    }
                    // Set isCollapsed property for the last group row (TFS #139848 case 1)
                    if (groupRow) {
                        groupRow.isCollapsed = groupCollapsed;
                    }
                    if (frzCols != null) {
                        grid.frozenColumns = frzCols;
                    }
                    if (frzRows != null) {
                        grid.frozenRows = includeColumnHeaders && frzRows > 0 ? frzRows - 1 : frzRows;
                    }
                    // set columns for column header.
                    for (var c = 0; c < grid.columnHeaders.columns.length; c++) {
                        var columnSetting = columns[c], column = grid.columns[c];
                        column.isRequired = false; // Setting the required property of the column to false for the imported sheet. TFS #126125
                        if (columnSetting) {
                            if (columnSetting.dataType === wijmo.DataType.Boolean) {
                                column.dataType = columnSetting.dataType;
                            }
                            column.format = columnSetting.format;
                            column.align = columnSetting.hAlign;
                            column.wordWrap = column.wordWrap || !!columnSetting.wordWrap;
                        }
                    }
                    // * Process column header's rows *
                    for (var i = 0; i < Math.max(colHdrHeight, 1); i++) { // Add at least one column header row even if includeColumnHeaders = false
                        grid.columnHeaders.rows.push(new wijmo.grid.Row());
                    }
                    // colHdrHeight == 0 if includeColumnHeaders = false.
                    for (var i = 0; i < colHdrHeight; i++) {
                        for (var j = 0; j < grid.columnHeaders.columns.length; j++) {
                            var cell = currentSheet.rows[i] ? currentSheet.rows[i].cells[j] : null, text = cell && cell.value != null ? cell.value : '', col = grid.columnHeaders.columns[j];
                            if (text) {
                                var headerFormat = wijmo.xlsx.Workbook._parseExcelFormat(cell);
                                text = wijmo.Globalize.format(text, headerFormat);
                            }
                            col.header = col.header || text;
                            grid.columnHeaders.setCellData(i, j, text);
                        }
                    }
                    // Set sheet related info for importing.
                    // This property contains the name, style of cells, merge cells and used fonts of current sheet.
                    if (isFlexSheet) {
                        var sheetVisible = options.sheetVisible != null ? options.sheetVisible : true;
                        grid['wj_sheetInfo'].name = currentSheet.name;
                        grid['wj_sheetInfo'].visible = sheetVisible === true ? true : currentSheet.visible !== false;
                        grid['wj_sheetInfo'].styledCells = styledCells;
                        grid['wj_sheetInfo'].mergedRanges = mergedRanges;
                        grid['wj_sheetInfo'].fonts = fonts;
                        grid['wj_sheetInfo'].tables = currentSheet.tables;
                    }
                };
                // Gets the number of rows in column headers section.
                FlexGridXlsxConverter._getColumnHeadersHeight = function (sheet) {
                    var rows;
                    if (!sheet || !(rows = sheet.rows).length) {
                        return 0;
                    }
                    if (!rows[0]) { // an empty row
                        return 1;
                    }
                    var i = 0;
                    for (var steps = 1; i < rows.length && steps > 0; i++, steps--) {
                        var span = rows[i].cells.reduce(function (prev, cur) { return Math.max(prev, cur.rowSpan || 0); }, 1); // the maximum rowSpan value, or 1.
                        if (span > steps) {
                            steps = span;
                        }
                    }
                    return i; // >= 1
                };
                FlexGridXlsxConverter._escapePlainText = function (value) {
                    if (value == null) {
                        return '';
                    }
                    if (value === '') {
                        return "'";
                    }
                    // check if value starts with ' or ==
                    if (value && ((value[0] === "'") || (value.length > 1 && value[0] === '=' && value[1] === '='))) {
                        return "'" + value;
                    }
                    return value;
                };
                // Parse the row data of flex grid to a sheet row
                FlexGridXlsxConverter._parseFlexGridRowToSheetRow = function (panel, workbookRow, rowIndex, startColIndex, columnSettings, includeCellStyles, fakeCell, cellsCache, styleCache, isGroupRow, groupLevel, includeColumns, formatItem) {
                    var flex = panel.grid, sheetInfo = flex['wj_sheetInfo'], row = panel.rows[rowIndex], recordIndex = 0, evaluateFormulaFun = sheetInfo && sheetInfo.evaluateFormula;
                    if (row['recordIndex'] == null) {
                        if (panel.cellType === wijmo.grid.CellType.ColumnHeader && panel.rows.length > 1) {
                            recordIndex = Math.min(rowIndex, columnSettings.length - 1);
                        }
                    }
                    else {
                        recordIndex = row['recordIndex'];
                    }
                    if (!workbookRow.cells) {
                        workbookRow.cells = [];
                    }
                    workbookRow.visible = row.isVisible;
                    workbookRow.height = row.renderHeight || panel.rows.defaultSize;
                    workbookRow.groupLevel = groupLevel;
                    if (isGroupRow) {
                        workbookRow.collapsed = row.isCollapsed;
                    }
                    if (row.wordWrap) {
                        workbookRow.style = { wordWrap: row.wordWrap };
                    }
                    var isCommonRow = (row.constructor === wijmo.grid.Row
                        || row.constructor === wijmo.grid._NewRowTemplate
                        || (xlsx.softTransposed() && flex instanceof xlsx.softTransposed().TransposedGrid && row instanceof wijmo.grid.Row)
                        || (xlsx.softDetail() && row.constructor === xlsx.softDetail().DetailRow)
                        || (xlsx.softMultiRow() && row.constructor === xlsx.softMultiRow()._MultiRow)
                        || (xlsx.softTransposedMultiRow() && row instanceof xlsx.softTransposedMultiRow()._MultiRow));
                    var isDetailRow = (xlsx.softDetail() && row.constructor === xlsx.softDetail().DetailRow), xlsxCell, ci = 0;
                    for (; ci < panel.columns.length; ci++) {
                        var mergedCells = void 0, cellStyle = void 0, cloneFakeCell = void 0, colSpan = 1, rowSpan = 1, isStartMergedCell = false, bcol = flex._getBindingColumn(panel, rowIndex, panel.columns[ci]), indent = 0;
                        if (sheetInfo && panel === flex.cells) {
                            var cellIndex = rowIndex * panel.columns.length + ci;
                            // Get merge range for cell.
                            if (sheetInfo.mergedRanges) {
                                mergedCells = this._getMergedRange(rowIndex, ci, sheetInfo.mergedRanges);
                            }
                            // Get style for cell.
                            if (sheetInfo.styledCells) {
                                cellStyle = sheetInfo.styledCells[cellIndex];
                            }
                        }
                        else if (includeCellStyles !== _IncludeCellStyles.None /* || formatItem*/) {
                            //cloneFakeCell = <HTMLDivElement>fakeCell.cloneNode();
                            //if (panel.hostElement.children.length > 0) {
                            //    panel.hostElement.children[0].appendChild(cloneFakeCell);
                            //} else {
                            //    panel.hostElement.appendChild(cloneFakeCell);
                            //}
                            cloneFakeCell = this._getMeasureCell(panel, ci, fakeCell, cellsCache);
                            mergedCells = flex.getMergedRange(panel, rowIndex, ci, false);
                            if (mergedCells) {
                                cellStyle = this._getCellStyle(panel, cloneFakeCell, mergedCells.bottomRow, mergedCells.rightCol, styleCache, !!formatItem) || {};
                            }
                            else {
                                cellStyle = this._getCellStyle(panel, cloneFakeCell, rowIndex, ci, styleCache, !!formatItem) || {};
                            }
                        }
                        if (!mergedCells) {
                            mergedCells = flex.getMergedRange(panel, rowIndex, ci, false);
                        }
                        if (mergedCells) {
                            if (rowIndex === mergedCells.topRow && ci === mergedCells.leftCol) {
                                rowSpan = mergedCells.bottomRow - mergedCells.topRow + 1;
                                colSpan = this._getColSpan(panel, mergedCells, includeColumns);
                                isStartMergedCell = true;
                            }
                        }
                        else {
                            isStartMergedCell = true;
                        }
                        if (!!includeColumns && !includeColumns(bcol)) {
                            continue;
                        }
                        var columnSetting = columnSettings[recordIndex] ? columnSettings[recordIndex][ci + startColIndex] : null, formulaVal = void 0, isFormula = void 0, val = void 0, unformattedVal = void 0, valIsDate = void 0, orgFormat = void 0, format_1 = void 0;
                        if (isCommonRow || isGroupRow) {
                            val = isStartMergedCell ? panel.getCellData(rowIndex, ci, true) : null;
                            unformattedVal = isStartMergedCell ? panel.getCellData(rowIndex, ci, false) : null;
                            isFormula = this._isFormula(val);
                            formulaVal = null;
                            valIsDate = wijmo.isDate(unformattedVal);
                            if (cellStyle && cellStyle.format /*&& unformattedVal != null*/) { // 454833 The cell format must have priority over the column format, regardless of whether the cell contains a value.
                                orgFormat = cellStyle.format;
                                if (/[hsmyt\:]/i.test(orgFormat)) {
                                    valIsDate = true;
                                }
                                format_1 = wijmo.xlsx.Workbook._parseCellFormat(cellStyle.format, valIsDate);
                            }
                            else if (columnSetting && columnSetting.style && columnSetting.style.format) {
                                orgFormat = bcol.format;
                                format_1 = columnSetting.style.format;
                            }
                            else {
                                format_1 = null;
                            }
                            if (isFormula && evaluateFormulaFun != null && wijmo.isFunction(evaluateFormulaFun)) {
                                formulaVal = evaluateFormulaFun(val);
                            }
                            if (!format_1) {
                                if (valIsDate) {
                                    format_1 = 'm/d/yyyy';
                                }
                                else if (wijmo.isNumber(unformattedVal) && !bcol.dataMap) {
                                    format_1 = wijmo.isInt(unformattedVal) ? '#,##0' : '#,##0.00';
                                }
                                else if (isFormula) {
                                    var formula = val.toLowerCase();
                                    if (formula.indexOf('now()') > -1) {
                                        format_1 = 'm/d/yyyy h:mm';
                                        valIsDate = true;
                                    }
                                    else if (formula.indexOf('today()') > -1 || formula.indexOf('date(') > -1) {
                                        format_1 = 'm/d/yyyy';
                                        valIsDate = true;
                                    }
                                    else if (formula.indexOf('time(') > -1) {
                                        format_1 = 'h:mm AM/PM';
                                        valIsDate = true;
                                    }
                                }
                                else {
                                    format_1 = 'General';
                                }
                            }
                        }
                        else {
                            val = isStartMergedCell ? flex.columnHeaders.getCellData(0, ci, true) : null;
                            format_1 = 'General';
                        }
                        var textRuns = undefined;
                        if (wijmo.isString(val) && val.indexOf('<span') !== -1) {
                            textRuns = this._parseToTextRuns(val);
                            val = null;
                        }
                        var parsedCellStyle = this._parseCellStyle(cellStyle) || {};
                        if (panel === flex.cells && isGroupRow && row.hasChildren && ci === flex.columns.firstVisibleIndex) {
                            var groupHeader = void 0;
                            // Process the group header of the flex grid.
                            if (isFormula && formulaVal != null) {
                                groupHeader = formulaVal;
                            }
                            else {
                                if (val) {
                                    groupHeader = val;
                                }
                                else if (isStartMergedCell) {
                                    groupHeader = row.getGroupHeader();
                                }
                                if (groupHeader) {
                                    groupHeader = groupHeader.replace(/<\/?\w+>/g, '').replace(/&#39;/g, '\'');
                                }
                            }
                            // If the formatted value, unformatted value and style of the cell is null, we should ignore this empty cell in the Workbook Object Model.
                            if (groupHeader == null && !cellStyle) {
                                continue;
                            }
                            valIsDate = wijmo.isDate(groupHeader);
                            if (!valIsDate && orgFormat && orgFormat.toLowerCase() === 'd' && wijmo.isInt(groupHeader)) {
                                format_1 = '0';
                            }
                            groupHeader = wijmo.isString(groupHeader)
                                // gpoupHeader can contain escaped HTML entities, we need to unescape them (see GroupHeader.getGroupHeader()) WJM-20034, TFS 238526.
                                ? wijmo.xlsx.Workbook._unescapeXML(groupHeader)
                                : groupHeader;
                            if (ci === flex.columns.firstVisibleIndex && flex.treeIndent) {
                                indent = groupLevel;
                            }
                            xlsxCell = {
                                value: groupHeader,
                                isDate: valIsDate,
                                formula: isFormula ? this._parseToExcelFormula(val, valIsDate) : null,
                                colSpan: colSpan,
                                rowSpan: rowSpan,
                                style: this._extend(parsedCellStyle, {
                                    format: format_1,
                                    font: {
                                        bold: true
                                    },
                                    hAlign: wijmo.xlsx.HAlign.Left,
                                    indent: indent
                                }),
                                textRuns: textRuns
                            };
                        }
                        else {
                            // Add the cell content
                            // -- for now, let's leave the old behavior --
                            // Don't escape HTML entities except for GroupRow (WJM-20034, TFS 238526).
                            //if (isGroupRow) {
                            val = wijmo.isString(val) ? wijmo.xlsx.Workbook._unescapeXML(val) : val;
                            unformattedVal = wijmo.isString(unformattedVal) ? wijmo.xlsx.Workbook._unescapeXML(unformattedVal) : unformattedVal;
                            //}
                            if (!valIsDate && orgFormat && orgFormat.toLowerCase() === 'd' && wijmo.isInt(unformattedVal)) {
                                format_1 = '0';
                            }
                            var hAlign = void 0;
                            if (parsedCellStyle && parsedCellStyle.hAlign) {
                                hAlign = parsedCellStyle.hAlign;
                            }
                            else if (columnSetting && columnSetting.style && columnSetting.style.hAlign != null) {
                                hAlign = wijmo.asEnum(columnSetting.style.hAlign, wijmo.xlsx.HAlign, true);
                            }
                            else {
                                if (wijmo.isDate(unformattedVal)) {
                                    hAlign = wijmo.xlsx.HAlign.Left;
                                }
                                else {
                                    hAlign = wijmo.xlsx.HAlign.General;
                                }
                            }
                            if (ci === flex.columns.firstVisibleIndex && flex.treeIndent && (hAlign === wijmo.xlsx.HAlign.Left || hAlign === wijmo.xlsx.HAlign.General)) {
                                indent = groupLevel;
                            }
                            xlsxCell = {
                                // Null must be exported as an empty value (''), empty string must be exported as a quote ("'").
                                value: isFormula
                                    ? formulaVal
                                    : (format_1 === 'General' && !(val === '' && unformattedVal == null)
                                        ? this._escapePlainText(val)
                                        : this._escapePlainText(unformattedVal)),
                                isDate: valIsDate,
                                formula: isFormula ? this._parseToExcelFormula(val, valIsDate) : null,
                                colSpan: ci < flex.columns.firstVisibleIndex ? 1 : colSpan,
                                rowSpan: rowSpan,
                                style: this._extend(parsedCellStyle, {
                                    format: format_1,
                                    hAlign: hAlign,
                                    vAlign: rowSpan > 1 ? (panel === flex.cells || flex['centerHeadersVertically'] === false ? wijmo.xlsx.VAlign.Top : wijmo.xlsx.VAlign.Center) : null,
                                    indent: indent
                                }),
                                textRuns: textRuns
                            };
                        }
                        if (formatItem) {
                            var xlsxFormatItemArgs = new XlsxFormatItemEventArgs(panel, new wijmo.grid.CellRange(rowIndex, ci), cloneFakeCell, fakeCell, cellsCache, styleCache, xlsxCell);
                            formatItem(xlsxFormatItemArgs);
                            // If xlsxFormatItemArgs.getFormattedCell was called then a new cloned cell was created and
                            // assigned to xlsxFormatItemArgs.cell, We assign it to cloneFakeCell to remove it from DOM
                            // in the code below.
                            //cloneFakeCell = <HTMLDivElement>xlsxFormatItemArgs.cell;
                        }
                        if (isDetailRow) {
                            var detailRowCell = panel.getCellElement(rowIndex, ci);
                            if (detailRowCell) {
                                // If _getCellStyle() was called then the detail element was moved to fakeCell (it also can be called from xlsxFormatItemArgs.getFormattedCell).
                                // Move the detail element back to its original parent element (324064).
                                var detail_1 = row.detail;
                                detailRowCell.appendChild(detail_1);
                                wijmo.Control.refreshAll(detail_1); // 470414
                            }
                        }
                        //if (cloneFakeCell) {
                        //    cloneFakeCell.parentElement.removeChild(cloneFakeCell);
                        //    cloneFakeCell = null;
                        //}
                        workbookRow.cells.push(xlsxCell);
                    }
                    return startColIndex + ci;
                };
                // Parse CSS style to Excel style.
                FlexGridXlsxConverter._parseCellStyle = function (cellStyle, isTableStyle) {
                    if (isTableStyle === void 0) { isTableStyle = false; }
                    if (cellStyle == null) {
                        return null;
                    }
                    var fontSize = cellStyle.fontSize;
                    fontSize = fontSize ? +fontSize.substring(0, fontSize.indexOf('px')) : null;
                    // We should parse the font size from pixel to point for exporting.
                    if (isNaN(fontSize)) {
                        fontSize = null;
                    }
                    var wordWrap = cellStyle.whiteSpace;
                    wordWrap = wordWrap ? (wordWrap.indexOf('pre') > -1 ? true : false) : false;
                    // Process text-align property
                    var textAlign = cellStyle.textAlign;
                    if (textAlign === 'start') {
                        textAlign = cellStyle.direction === 'rtl' ? 'right' : 'left';
                    }
                    if (textAlign === 'end') {
                        textAlign = cellStyle.direction === 'rtl' ? 'left' : 'right';
                    }
                    return {
                        font: {
                            bold: cellStyle.fontWeight === 'bold' || (+cellStyle.fontWeight) >= 700,
                            italic: cellStyle.fontStyle === 'italic',
                            underline: (cellStyle.textDecorationStyle || cellStyle.textDecoration) === 'underline',
                            family: this._parseToExcelFontFamily(cellStyle.fontFamily),
                            size: fontSize,
                            color: cellStyle.color
                        },
                        fill: {
                            color: cellStyle.backgroundColor
                        },
                        borders: this._parseBorder(cellStyle, isTableStyle),
                        hAlign: wijmo.xlsx.Workbook._parseStringToHAlign(textAlign),
                        wordWrap: wordWrap
                    };
                };
                // Parse the border style.
                FlexGridXlsxConverter._parseBorder = function (cellStyle, isTableBorder) {
                    var border = {
                        left: this._parseEgdeBorder(cellStyle, 'Left'),
                        right: this._parseEgdeBorder(cellStyle, 'Right'),
                        top: this._parseEgdeBorder(cellStyle, 'Top'),
                        bottom: this._parseEgdeBorder(cellStyle, 'Bottom')
                    };
                    if (isTableBorder) {
                        border['vertical'] = this._parseEgdeBorder(cellStyle, 'Vertical');
                        border['horizontal'] = this._parseEgdeBorder(cellStyle, 'Horizontal');
                    }
                    return border;
                };
                // Parse the egde of the borders
                FlexGridXlsxConverter._parseEgdeBorder = function (cellStyle, edge) {
                    var edgeBorder, style = cellStyle['border' + edge + 'Style'], width = cellStyle['border' + edge + 'Width'];
                    if (width) {
                        width = parseFloat(width); // (also removes units, "1px" -> 1)
                    }
                    if (style && style !== 'none' && style !== 'hidden' && width !== 0) {
                        edgeBorder = {};
                        style = style.toLowerCase();
                        switch (style) {
                            case 'dotted':
                                if (width > 1) {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.MediumDashDotted;
                                }
                                else {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.Dotted;
                                }
                                break;
                            case 'dashed':
                                if (width > 1) {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.MediumDashed;
                                }
                                else {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.Dashed;
                                }
                                break;
                            case 'double':
                                edgeBorder.style = wijmo.xlsx.BorderStyle.Double;
                                break;
                            default:
                                if (width > 2) {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.Thick;
                                }
                                else if (width > 1) {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.Medium;
                                }
                                else {
                                    edgeBorder.style = wijmo.xlsx.BorderStyle.Thin;
                                }
                                break;
                        }
                        edgeBorder.color = cellStyle['border' + edge + 'Color'];
                    }
                    return edgeBorder;
                };
                // Parse the border style to css style.
                FlexGridXlsxConverter._parseBorderStyle = function (borderStyle, edge, cellStyle) {
                    var edgeStyle = 'border' + edge + 'Style', edgeWidth = 'border' + edge + 'Width';
                    switch (borderStyle) {
                        case wijmo.xlsx.BorderStyle.Dotted:
                        case wijmo.xlsx.BorderStyle.Hair:
                            cellStyle[edgeStyle] = 'dotted';
                            cellStyle[edgeWidth] = '1px';
                            break;
                        case wijmo.xlsx.BorderStyle.Dashed:
                        case wijmo.xlsx.BorderStyle.ThinDashDotDotted:
                        case wijmo.xlsx.BorderStyle.ThinDashDotted:
                            cellStyle[edgeStyle] = 'dashed';
                            cellStyle[edgeWidth] = '1px';
                            break;
                        case wijmo.xlsx.BorderStyle.MediumDashed:
                        case wijmo.xlsx.BorderStyle.MediumDashDotDotted:
                        case wijmo.xlsx.BorderStyle.MediumDashDotted:
                        case wijmo.xlsx.BorderStyle.SlantedMediumDashDotted:
                            cellStyle[edgeStyle] = 'dashed';
                            cellStyle[edgeWidth] = '2px';
                            break;
                        case wijmo.xlsx.BorderStyle.Double:
                            cellStyle[edgeStyle] = 'double';
                            cellStyle[edgeWidth] = '3px';
                            break;
                        case wijmo.xlsx.BorderStyle.Medium:
                            cellStyle[edgeStyle] = 'solid';
                            cellStyle[edgeWidth] = '2px';
                            break;
                        case wijmo.xlsx.BorderStyle.Thick:
                            cellStyle[edgeStyle] = 'solid';
                            cellStyle[edgeWidth] = '3px';
                            break;
                        default:
                            cellStyle[edgeStyle] = 'solid';
                            cellStyle[edgeWidth] = '1px';
                            break;
                    }
                };
                // Parse the CSS font family to excel font family.
                FlexGridXlsxConverter._parseToExcelFontFamily = function (fontFamily) {
                    var fonts;
                    if (fontFamily) {
                        fonts = fontFamily.split(',');
                        if (fonts && fonts.length > 0) {
                            fontFamily = fonts[0].replace(/\"|\'/g, '');
                        }
                    }
                    return fontFamily;
                };
                // Parse the formula to excel formula.
                FlexGridXlsxConverter._parseToExcelFormula = function (formula, isDate) {
                    var floorCeilReg = /(floor|ceiling)\([+-]?\d+\.?\d*\)/gi, textReg = /text\(\"?\w+\"?\s*\,\s*\"\w+\"\)/gi;
                    var matches = formula.match(floorCeilReg);
                    if (matches) {
                        for (var i = 0; i < matches.length; i++) {
                            var matchFormula = matches[i];
                            var updatedFormula = matchFormula.substring(0, matchFormula.lastIndexOf(')')) + ', 1)';
                            formula = formula.replace(matchFormula, updatedFormula);
                        }
                    }
                    matches = null;
                    matches = formula.match(textReg);
                    if (matches) {
                        var textFormatReg = /\"?\w+\"?\s*\,\s*\"(\w+)\"/i;
                        for (var i = 0; i < matches.length; i++) {
                            var matchFormula = matches[i];
                            var formatMatches = matchFormula.match(textFormatReg);
                            if (formatMatches && formatMatches.length === 2) {
                                var format_2 = formatMatches[1];
                                if (!/^d{1,4}?$/.test(format_2)) {
                                    var updatedFormat = wijmo.xlsx.Workbook._parseCellFormat(format_2, isDate);
                                    var updatedFormula = matchFormula.replace(format_2, updatedFormat);
                                    formula = formula.replace(matchFormula, updatedFormula);
                                }
                            }
                        }
                    }
                    return formula;
                };
                // Parse the rich text to text runs.
                FlexGridXlsxConverter._parseToTextRuns = function (value) {
                    var spans = value.split('<span '), textRuns = [];
                    for (var i = 0; i < spans.length; i++) {
                        var item = spans[i], textRun = void 0;
                        if (item.indexOf('</span>') !== -1) {
                            var text = item.substring(item.indexOf('>') + 1, item.indexOf('</span>')), textFont = this._parseToTextRunFont(item.substring(item.indexOf('style="') + 7, item.indexOf(';"')));
                            textRun = { text: text, font: textFont };
                        }
                        else {
                            textRun = { text: item };
                        }
                        textRuns.push(textRun);
                    }
                    return textRuns;
                };
                // Parse the font for the text run.
                FlexGridXlsxConverter._parseToTextRunFont = function (style) {
                    var styles = style.split(';'), textFont;
                    if (styles.length > 0) {
                        var bold = void 0, italic = void 0, underline = void 0, fontSize = void 0, family = void 0, color = void 0;
                        for (var i = 0; i < styles.length; i++) {
                            var styleItem = styles[i].split(':');
                            if (styleItem.length !== 2) {
                                continue;
                            }
                            styleItem[1] = styleItem[1].trim();
                            switch (styleItem[0]) {
                                case 'font-size':
                                    fontSize = +styleItem[1].substring(0, styleItem[1].indexOf('px'));
                                    if (isNaN(fontSize)) {
                                        fontSize = null;
                                    }
                                    break;
                                case 'font-weight':
                                    bold = styleItem[1] === 'bold' || +styleItem[1] >= 700;
                                    break;
                                case 'font-style':
                                    italic = styleItem[1] === 'italic';
                                    break;
                                case 'text-decoration-style':
                                case 'text-decoration':
                                    underline = styleItem[1] === 'underline';
                                    break;
                                case 'font-family':
                                    family = this._parseToExcelFontFamily(styleItem[1]);
                                    break;
                                case 'color':
                                    color = styleItem[1];
                                    break;
                            }
                        }
                        textFont = {
                            bold: bold,
                            italic: italic,
                            underline: underline,
                            family: family,
                            size: fontSize,
                            color: color
                        };
                    }
                    return textFont;
                };
                // Returns a "measure" cell for custom style and content evaluation. It either gets it from the cache
                // or creates a new one and adds it to the DOM and cache.
                FlexGridXlsxConverter._getMeasureCell = function (panel, colIndex, patternCell, cellsCache) {
                    var panelCache = cellsCache[panel.cellType], cachedCell = panelCache && panelCache[colIndex], newCell = cachedCell == null;
                    if (!cachedCell) {
                        if (!panelCache) {
                            cellsCache[panel.cellType] = panelCache = [];
                        }
                        panelCache[colIndex] = cachedCell = patternCell.cloneNode();
                    }
                    else {
                        // clear the style
                        if (this.hasCssText) { // checks that style.cssText is supported
                            cachedCell.style.cssText = '';
                            cachedCell.style.visibility = 'hidden';
                        }
                    }
                    if (newCell || !cachedCell.parentElement) {
                        if (panel.hostElement.children.length > 0) {
                            panel.hostElement.children[0].appendChild(cachedCell);
                        }
                        else {
                            panel.hostElement.appendChild(cachedCell);
                        }
                    }
                    return cachedCell;
                };
                // Gets the column setting, include width, visible, format and alignment
                FlexGridXlsxConverter._getColumnSetting = function (column, colIndex, columns) {
                    var renderColumn = column;
                    if (column['colspan'] != null) { // multirow
                        renderColumn = this._getRenderColumn(colIndex, columns);
                    }
                    if (!renderColumn) {
                        return null;
                    }
                    return {
                        autoWidth: true,
                        width: renderColumn.renderWidth || columns.defaultSize,
                        visible: renderColumn.visible && (renderColumn.width !== 0) && !renderColumn._getFlag(wijmo.grid.RowColFlags.ParentCollapsed),
                        style: {
                            //format: renderColumn.format ? mXlsx.Workbook._parseCellFormat(renderColumn.format, renderColumn.dataType === DataType.Date) : '',
                            format: column.format ? wijmo.xlsx.Workbook._parseCellFormat(column.format, column.dataType === wijmo.DataType.Date) : '',
                            hAlign: wijmo.xlsx.Workbook._parseStringToHAlign(this._toExcelHAlign(renderColumn.getAlignment())),
                            wordWrap: renderColumn.wordWrap
                        }
                    };
                };
                // panels = [row headers (optional); content]
                // cols: An array of IWorkbookColumn extracted from panels.
                // bndCols: An array of the same structure containing the associated binding columns.
                FlexGridXlsxConverter._getPerRowColumnsSettings = function (grid, panels, maxRows) {
                    var _this = this;
                    var cols = [], bndCols = [];
                    panels.forEach(function (panel, pi) {
                        var visRi = 0, rowHdrOffset = pi > 0 ? panels[0].columns.length : 0;
                        var _loop_2 = function (ri) {
                            if (maxRows != null && ri >= maxRows) {
                                return "break";
                            }
                            if (panel.rows[ri].renderSize <= 0) {
                                return "continue";
                            }
                            cols[visRi] = cols[visRi] || [];
                            bndCols[visRi] = bndCols[visRi] || [];
                            panel.columns.forEach(function (col, ci) {
                                var bndCol = grid._getBindingColumn(panel, ri, col), wbCol = _this._getColumnSetting(bndCol, ci, panel.columns);
                                if (wbCol) {
                                    cols[visRi][rowHdrOffset + ci] = wbCol;
                                    bndCols[visRi][rowHdrOffset + ci] = bndCol;
                                }
                            });
                            visRi++;
                        };
                        for (var ri = 0; ri < panel.rows.length; ri++) {
                            var state_2 = _loop_2(ri);
                            if (state_2 === "break")
                                break;
                        }
                    });
                    return {
                        cols: cols,
                        bndCols: bndCols
                    };
                };
                // Parse the CSS alignment to excel hAlign.
                FlexGridXlsxConverter._toExcelHAlign = function (value) {
                    value = value ? value.trim().toLowerCase() : value;
                    if (!value)
                        return value;
                    if (value.indexOf('center') > -1) {
                        return 'center';
                    }
                    if (value.indexOf('right') > -1 || value.indexOf('end') > -1) {
                        return 'right';
                    }
                    if (value.indexOf('justify') > -1) {
                        return 'justify';
                    }
                    return 'left';
                };
                // gets column count for specific row
                FlexGridXlsxConverter._getColumnCount = function (sheetData) {
                    var res = 0;
                    for (var i = 0; i < sheetData.length; i++) {
                        var data = sheetData[i] && sheetData[i].cells ? sheetData[i].cells : [];
                        if (data && data.length > 0) {
                            var currentColCnt = data.length;
                            if (wijmo.isInt(data[currentColCnt - 1].colSpan) && data[currentColCnt - 1].colSpan > 1) {
                                currentColCnt = currentColCnt + data[currentColCnt - 1].colSpan - 1;
                            }
                            if (currentColCnt > res) {
                                res = currentColCnt;
                            }
                        }
                    }
                    return res;
                };
                // gets row count for specified sheet
                FlexGridXlsxConverter._getRowCount = function (sheetData, columnCnt) {
                    var rowCount = sheetData.length, rowIndex = rowCount - 1;
                    for (var colIndex = 0; colIndex < columnCnt; colIndex++) {
                        rowLoop: for (; rowIndex >= 0; rowIndex--) {
                            var lastRow = sheetData[rowIndex], data = lastRow && lastRow.cells ? lastRow.cells : [], cell = data[colIndex];
                            if (cell && ((cell.value != null && cell.value !== '') || (wijmo.isInt(cell.rowSpan) && cell.rowSpan > 1))) {
                                if (wijmo.isInt(cell.rowSpan) && cell.rowSpan > 1 && (rowIndex + cell.rowSpan > rowCount)) {
                                    rowCount = rowIndex + cell.rowSpan;
                                }
                                break rowLoop;
                            }
                        }
                    }
                    return rowCount;
                };
                // convert the column index to alphabet
                FlexGridXlsxConverter._numAlpha = function (i) {
                    var t = Math.floor(i / 26) - 1;
                    return (t > -1 ? this._numAlpha(t) : '') + String.fromCharCode(65 + i % 26);
                };
                // Get DataType for value of the specific excel item
                FlexGridXlsxConverter._getItemType = function (item) {
                    if (item == null || item.value == null
                        || isNaN(item.value)) {
                        return null;
                    }
                    return wijmo.getType(item.value);
                };
                // Set column definition for the Flex Grid
                FlexGridXlsxConverter._setColumn = function (columns, columnIndex, item) {
                    var columnSetting = columns[columnIndex];
                    if (!columnSetting) {
                        columns[columnIndex] = {
                            dataType: this._getItemType(item),
                            format: wijmo.xlsx.Workbook._parseExcelFormat(item),
                            hAlign: '',
                            wordWrap: null
                        };
                    }
                    else {
                        var dataType = this._getItemType(item);
                        if (columnSetting.dataType !== dataType &&
                            columnSetting.dataType === wijmo.DataType.Boolean && dataType !== wijmo.DataType.Boolean) {
                            columnSetting.dataType = dataType;
                        }
                        if (item && item.value != null && !(wijmo.isString(item.value) && wijmo.isNullOrWhiteSpace(item.value))) {
                            var format_3 = wijmo.xlsx.Workbook._parseExcelFormat(item);
                            if (format_3 && columnSetting.format !== format_3 && format_3 !== 'General') {
                                columnSetting.format = format_3;
                            }
                        }
                        var hAlign = void 0;
                        if (item && item.style) {
                            if (item.style.hAlign) {
                                hAlign = wijmo.xlsx.Workbook._parseHAlignToString(wijmo.asEnum(item.style.hAlign, wijmo.xlsx.HAlign));
                            }
                            if (columnSetting.wordWrap == null) {
                                columnSetting.wordWrap = !!item.style.wordWrap;
                            }
                            else {
                                columnSetting.wordWrap = columnSetting.wordWrap && !!item.style.wordWrap;
                            }
                        }
                        if (!hAlign && dataType === wijmo.DataType.Number) {
                            hAlign = 'right';
                        }
                        columnSetting.hAlign = hAlign;
                    }
                };
                // Get value from the excel cell item
                FlexGridXlsxConverter._getItemValue = function (item) {
                    if (item == null || item.value == null) {
                        return null;
                    }
                    var val = item.value;
                    if (wijmo.isString(val) && val[0] === "'") {
                        val = val.substr(1);
                    }
                    if (wijmo.isNumber(val) && isNaN(val)) {
                        return '';
                    }
                    else if (val instanceof Date && isNaN(val.getTime())) {
                        return '';
                    }
                    else {
                        return val;
                    }
                };
                // Get style of cell.
                FlexGridXlsxConverter._getCellStyle = function (panel, fakeCell, r, c, styleCache, forceUpdateContent) {
                    var style, grid = panel.grid;
                    try {
                        //AlexI
                        //this._resetCellStyle(fakeCell);
                        // get styles for any panel, row, column
                        // Update content only if quickCellStyles = false (the old behaviour, just for sure) or item formatter is attached.
                        var update = !styleCache || grid.formatItem.hasHandlers || grid.itemFormatter || forceUpdateContent ? true : false;
                        grid.cellFactory.updateCell(panel, r, c, fakeCell, null, update);
                        fakeCell.className = fakeCell.className.replace('wj-state-selected', '');
                        fakeCell.className = fakeCell.className.replace('wj-state-multi-selected', '');
                    }
                    catch (ex) {
                        return null;
                    }
                    if (styleCache) { // includeCellStyles = Cache
                        var host = panel.hostElement, fc = fakeCell;
                        // Build the cache key.
                        //
                        // First, extract the key from the fakeCell's inline style.
                        var key = fc.style.cssText.split(/;\s+/).filter(function (propVal) {
                            var prop = propVal.substring(0, propVal.indexOf(':'));
                            return /^(color|background|border|font|text|whitespace)/i.test(prop); // leave only those properties that begin with these words.
                        }).join(';');
                        // Then add CSS class names to the key, starting with the fakeCell and ending with the panel element.
                        do {
                            key = fc.className + key;
                        } while (fc !== host && (fc = fc.parentElement));
                        // Check the cache.
                        style = styleCache.getValue(key);
                        if (!style) {
                            style = window.getComputedStyle(fakeCell);
                            styleCache.add(key, style);
                        }
                    }
                    else {
                        style = window.getComputedStyle(fakeCell);
                    }
                    return style;
                };
                // Parse the WorkbookTextRuns to related html markup.
                FlexGridXlsxConverter._parseTextRunsToHTML = function (textRuns) {
                    var res = '';
                    for (var i = 0; i < textRuns.length; i++) {
                        var textRun = textRuns[i], font = textRun.font;
                        if (font) {
                            res += '<span style="' + (font.bold ? 'font-weight: bold;' : '') + (font.italic ? 'font-style: italic;' : '')
                                + (font.underline ? 'text-decoration: underline;' : '') + (font.family ? 'font-family: ' + font.family + ';' : '')
                                + (font.size != null ? 'font-size: ' + font.size + 'px;' : '') + (font.color ? 'color: ' + font.color + ';' : '')
                                + '">' + textRun.text + '</span>';
                        }
                        else {
                            res += textRun.text;
                        }
                    }
                    return res;
                };
                // extends the source hash to destination hash
                FlexGridXlsxConverter._extend = function (dst, src) {
                    for (var key in src) {
                        var value = src[key];
                        if (wijmo.isObject(value) && dst[key]) {
                            wijmo.copy(dst[key], value); // copy sub-objects
                        }
                        else {
                            dst[key] = value; // assign values
                        }
                    }
                    return dst;
                };
                // check the parent group collapsed setting.
                FlexGridXlsxConverter._checkParentCollapsed = function (groupCollapsedSettings, groupLevel) {
                    var res = false;
                    Object.keys(groupCollapsedSettings).forEach(function (key) {
                        if (groupCollapsedSettings[key] === true && res === false && !isNaN(groupLevel) && +key < groupLevel) {
                            res = true;
                        }
                    });
                    return res;
                };
                // Get the col span for the merged cells.
                FlexGridXlsxConverter._getColSpan = function (p, mergedRange, includeColumns) {
                    var res = 0;
                    for (var i = mergedRange.leftCol; i <= mergedRange.rightCol; i++) {
                        if (!includeColumns || includeColumns(p.columns[i])) {
                            res++;
                        }
                    }
                    return res;
                };
                // Get the actual rendering column specific for MultiRow control. 
                FlexGridXlsxConverter._getRenderColumn = function (colIndex, columns) {
                    if (colIndex >= columns.length) {
                        return null;
                    }
                    return columns[colIndex];
                };
                // Get the merge cells in current sheet via row index and column index.
                FlexGridXlsxConverter._getMergedRange = function (row, col, mergeCells) {
                    for (var i = 0; i < mergeCells.length; i++) {
                        var mr = mergeCells[i];
                        if (row >= mr.topRow && row <= mr.bottomRow && col >= mr.leftCol && col <= mr.rightCol) {
                            return mr;
                        }
                    }
                    return null;
                };
                FlexGridXlsxConverter._isFormula = function (val) {
                    return val && typeof (val) === 'string' && val.length > 1 && val[0] === '=' && val[1] !== '=';
                };
                return FlexGridXlsxConverter;
            }());
            xlsx.FlexGridXlsxConverter = FlexGridXlsxConverter;
            /**
             * Represents arguments of the IFlexGridXlsxOptions.formatItem callback.
             */
            var XlsxFormatItemEventArgs = /** @class */ (function (_super) {
                __extends(XlsxFormatItemEventArgs, _super);
                function XlsxFormatItemEventArgs(panel, rng, cell, patternCell, cellsCache, styleCache, xlsxCell) {
                    var _this = _super.call(this, panel, rng) || this;
                    _this._cell = cell;
                    _this._patternCell = patternCell;
                    _this._xlsxCell = xlsxCell;
                    _this._cellsCache = cellsCache;
                    _this._styleCache = styleCache;
                    return _this;
                }
                Object.defineProperty(XlsxFormatItemEventArgs.prototype, "cell", {
                    /**
                         * If IFlexGridXlsxOptions.includeCellStyles is set to true then contains a
                     * reference to the element that represents the formatted grid cell; otherwise, a null value.
                     *
                     */
                    get: function () {
                        return this._cell;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XlsxFormatItemEventArgs.prototype, "xlsxCell", {
                    /**
                     * Contains an exporting cell representation. Initially it contains a default cell representation created
                     * by FlexGrid export, and can be modified by the event handler to customize its final content. For example,
                     * the xlsxCell.value property can be updated to modify a cell content, xlsxCell.style to modify cell's style,
                     * and so on.
                     */
                    get: function () {
                        return this._xlsxCell;
                    },
                    set: function (value) {
                        this._xlsxCell = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Returns a cell with a custom formatting applied (formatItem event, cell templates).
                 * This method is useful when export of custom formatting is disabled
                 * (IFlexGridXlsxOptions.includeCellStyles=false), but you need
                 * to export a custom content and/or style for a certain cells.
                 */
                XlsxFormatItemEventArgs.prototype.getFormattedCell = function () {
                    if (!this._cell) {
                        //this._cell = <HTMLDivElement>this._patternCell.cloneNode();
                        //this.panel.hostElement.children[0].appendChild(this._cell);
                        this._cell = FlexGridXlsxConverter._getMeasureCell(this.panel, this.col, this._patternCell, this._cellsCache);
                        //FlexGridXlsxConverter._getCellStyle(this.panel, this._cell, this.range.row, this.range.col);
                        // The code is called from the formatItem callback, so we need to update the cell content.
                        FlexGridXlsxConverter._getCellStyle(this.panel, this._cell, this.row, this.col, this._styleCache, true);
                    }
                    return this._cell;
                };
                return XlsxFormatItemEventArgs;
            }(wijmo.grid.CellRangeEventArgs));
            xlsx.XlsxFormatItemEventArgs = XlsxFormatItemEventArgs;
            var _IncludeCellStyles;
            (function (_IncludeCellStyles) {
                /**
                 * Cells styling will not be included in the generated xlsx file (includeCellStyles = false).
                 */
                _IncludeCellStyles[_IncludeCellStyles["None"] = 0] = "None";
                /**
                 * Cells styling will be included in the generated xlsx file (includeCellStyles = true, quickCellStyles = false).
                 */
                _IncludeCellStyles[_IncludeCellStyles["Regular"] = 1] = "Regular";
                /**
                 * The same as Regular plus cell styles caching added (includeCellStyles = true, quickCellStyles = true).
                 */
                _IncludeCellStyles[_IncludeCellStyles["Cache"] = 2] = "Cache";
            })(_IncludeCellStyles || (_IncludeCellStyles = {}));
            var _StyleCache = /** @class */ (function () {
                function _StyleCache(maxSize) {
                    this._cache = {};
                    this._size = 0;
                    this._max = maxSize;
                }
                _StyleCache.prototype.add = function (key, value) {
                    if (this._size >= this._max) {
                        this.clear();
                    }
                    // Don't keep the reference! We must clone the CSSStyleDeclaration object, otherwise there will be no performance gain.
                    this._cache[key] = this._cloneStyle(value);
                    this._size++;
                };
                _StyleCache.prototype.clear = function () {
                    this._cache = {};
                    this._size = 0;
                };
                _StyleCache.prototype.getValue = function (key) {
                    return this._cache[key] || null;
                };
                _StyleCache.prototype.hasKey = function (key) {
                    return !!this._cache[key];
                };
                _StyleCache.prototype._cloneStyle = function (val) {
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
                };
                return _StyleCache;
            }());
            xlsx._StyleCache = _StyleCache;
            function _blobToBuffer(blob, callback) {
                if (!blob || !callback) {
                    return;
                }
                if (blob.arrayBuffer) {
                    blob.arrayBuffer().then(function (buffer) { return callback(buffer); });
                }
                else {
                    var fr_1 = new FileReader();
                    fr_1.onload = function () {
                        callback(fr_1.result);
                        fr_1 = null;
                    };
                    fr_1.readAsArrayBuffer(blob);
                }
            }
            xlsx._blobToBuffer = _blobToBuffer;
        })(xlsx = grid_1.xlsx || (grid_1.xlsx = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var xlsx;
        (function (xlsx) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.xlsx', wijmo.grid.xlsx);
        })(xlsx = grid.xlsx || (grid.xlsx = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.xlsx.js.map