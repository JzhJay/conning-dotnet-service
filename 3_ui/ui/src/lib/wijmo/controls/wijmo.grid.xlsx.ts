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


    module wijmo.grid.xlsx {
    


export function softDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}


export function softMultiRow(): typeof wijmo.grid.multirow {
    return wijmo._getModule('wijmo.grid.multirow');
}


export function softTransposed(): typeof wijmo.grid.transposed {
    return wijmo._getModule('wijmo.grid.transposed');
}


export function softTransposedMultiRow(): typeof wijmo.grid.transposedmultirow {
    return wijmo._getModule('wijmo.grid.transposedmultirow');
}
    }
    


    module wijmo.grid.xlsx {
    







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
export class FlexGridXlsxConverter {
    // Indicates whether the browser supports the style.cssText property. Should be true in all major browsers.
    private static hasCssText: boolean;

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
    static save(grid: wijmo.grid.FlexGrid, options?: IFlexGridXlsxOptions, fileName?: string): wijmo.xlsx.Workbook {
        //window['xlsxTime'] = Date.now();
        let workbook = new wijmo.xlsx.Workbook();

        this._saveFlexGridToWorkbook(workbook, grid, options, false, null);

        //console.log(`Workbook created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
        //window['xlsxTime'] = Date.now();

        if (fileName) {
            workbook.save(fileName);
        }

        return workbook;
    }

    private static _cs: wijmo.xlsx._SyncPromise; // cancellation source;

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
    static saveAsync(grid: wijmo.grid.FlexGrid, options?: IFlexGridXlsxOptions, fileName?: string, onSaved?: (base64: string, workbook: wijmo.xlsx.Workbook) => any, onError?: (reason?: any) => any, onProgress?: (value: number) => void, asyncWorkbook?: boolean): wijmo.xlsx.Workbook {
        let workbook = new wijmo.xlsx.Workbook();

        if (!asyncWorkbook) {
            // Use the old manner: the workbook generation is synchronous.
            this._saveFlexGridToWorkbook(workbook, grid, options, false, null);

            if (fileName) {
                workbook.saveAsync(fileName,
                    (base64: string) => {
                        if (wijmo.isFunction(onSaved)) {
                            onSaved(base64, workbook);
                        }
                    },
                    onError, null);
            } else {
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
        let remap = fileName != null;

        this.cancelAsync(() => {
            let timer: any,
                events: wijmo.Event[] = [ // Track these events to restart the export when changes occur.
                    grid.collectionView && grid.collectionView.collectionChanged,
                    grid.columns && grid.columns.collectionChanged,
                    grid.rows && grid.rows.collectionChanged,
                    grid.resizedColumn, grid.resizedRow
                ],
                removeHandlers = () => events.forEach(v => {
                    if (v) {
                        v.removeHandler(restart)
                    }
                }),
                restart = () => {
                    // Inform the underlying task about cancellation immediately (#438498)
                    this._cs && this._cs.cancel(false);

                    // Then wait for debouncing to settle and restart the export.
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        removeHandlers();
                        workbook = null;
                        this.saveAsync(grid, options, fileName, onSaved, onError, onProgress);
                    }, 100);
                },
                finish = () => {
                    clearTimeout(timer);
                    this._cs = null;
                    removeHandlers();
                };

            //window['xlsxTime'] = Date.now();
            this._cs = new wijmo.xlsx._SyncPromise(null, finish);

            events.forEach(v => {
                if (v) {
                    v.addHandler(restart);
                }
            });

            this._saveFlexGridToWorkbook(workbook, grid, options, true, this._cs,
                (progress: number) => {
                    if (wijmo.isFunction(onProgress)) {
                        onProgress(remap ? Math.round(wijmo.xlsx._map(progress, 0, 100, 0, 50)) : progress);
                    }
                }).then(() => {
                    //console.log(`Workbook created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
                    //window['xlsxTime'] = Date.now();
                    if (fileName) {
                        workbook._externalCancellation = () => this._cs;
                        workbook.saveAsync(fileName,
                            (base64: string) => {
                                finish();
                                if (wijmo.isFunction(onSaved)) {
                                    onSaved(base64, workbook);
                                }
                            },
                            err => {
                                finish();
                                if (wijmo.isFunction(onError)) {
                                    onError(err); // React only to JSZip errors, like the original code does?
                                }
                            },
                            (progress: number) => {
                                if (wijmo.isFunction(onProgress)) {
                                    onProgress(Math.round(wijmo.xlsx._map(progress, 0, 100, 51, 100)));
                                }
                            });
                    } else {
                        finish();
                        if (wijmo.isFunction(onProgress)) {
                            onProgress(100);
                        }
                        if (wijmo.isFunction(onSaved)) {
                            onSaved(null, workbook);
                        }
                    }
                }, er => {
                    finish();
                    throw er;
                });
        });

        return null;
    }

    /**
     * Cancels the task started by the {@link FlexGridXlsxConverter.saveAsync} method.
     * @param done Callback invoked when the method finishes executing.
     */
    static cancelAsync(done?: () => void) {
        if (this._cs) { // exporting in progress
            this._cs.cancel();

            setTimeout(() => { // give time to cancel the export
                this._cs = null;
                if (wijmo.isFunction(done)) {
                    done();
                }
            }, 100);
        } else {
            if (wijmo.isFunction(done)) {
                done();
            }
        }
    }

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
    static load(grid: wijmo.grid.FlexGrid, workbook: string | ArrayBuffer | Blob | wijmo.xlsx.Workbook, options?: IFlexGridXlsxOptions) {
        if (workbook instanceof Blob) {
            _blobToBuffer(workbook, buffer => {
                workbook = null;
                let wb = new wijmo.xlsx.Workbook();
                //var begin = Date.now();
                wb.load(buffer);
                buffer = null;
                //console.log(`xlsx loaded in ${(Date.now() - begin) / 1000} seconds`);
                //begin = Date.now();
                grid.deferUpdate(() => {
                    this._loadToFlexGrid(grid, wb, options);
                    wb = null;
                    //console.log(`FlexGrid loaded in ${(Date.now() - begin) / 1000} seconds`);
                });
            });
        } else if (workbook instanceof wijmo.xlsx.Workbook) {
            grid.deferUpdate(() => {
                this._loadToFlexGrid(grid, workbook as wijmo.xlsx.Workbook, options);
                workbook = null;
            });
        } else {
            if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                throw 'Invalid workbook.';
            }

            let wb = new wijmo.xlsx.Workbook();
            wb.load(workbook);
            workbook = null;
            grid.deferUpdate(() => {
                this._loadToFlexGrid(grid, wb, options);
                wb = null;
            });
        }
    }

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
    static loadAsync(grid: wijmo.grid.FlexGrid, workbook: string | ArrayBuffer | Blob | wijmo.xlsx.Workbook, options?: IFlexGridXlsxOptions, onLoaded?: (workbook: wijmo.xlsx.Workbook) => void, onError?: (reason?: any) => any) {
        if (workbook instanceof Blob) {
            _blobToBuffer(workbook, buffer => {
                workbook = null;
                let wb = new wijmo.xlsx.Workbook();
                //var begin = Date.now();
                wb.loadAsync(buffer, () => {
                    buffer = null;
                    //console.log(`xlsx loaded in ${(Date.now() - begin) / 1000} seconds`);
                    //begin = Date.now();
                    grid.deferUpdate(() => {
                        this._loadToFlexGrid(grid, wb, options);
                        //console.log(`FlexGrid loaded in ${(Date.now() - begin) / 1000} seconds`);
                        if (onLoaded) {
                            onLoaded(wb);
                        }
                        wb = null;
                    });
                }, onError);
            });
        } else if (workbook instanceof wijmo.xlsx.Workbook) {
            grid.deferUpdate(() => {
                this._loadToFlexGrid(grid, workbook as wijmo.xlsx.Workbook, options);
                if (onLoaded) {
                    onLoaded(workbook as wijmo.xlsx.Workbook);
                }
                workbook = null;
            });
        } else {
            if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                throw 'Invalid workbook.';
            }

            let wb = new wijmo.xlsx.Workbook();
            wb.loadAsync(workbook, () => {
                workbook = null;
                grid.deferUpdate(() => {
                    this._loadToFlexGrid(grid, wb, options);
                    if (onLoaded) {
                        onLoaded(wb);
                    }
                    wb = null;
                });
            }, onError);
        }
    }

    // Save the flexgrid to workbook instance.
    private static _saveFlexGridToWorkbook(workbook: wijmo.xlsx.Workbook, grid: wijmo.grid.FlexGrid, options: IFlexGridXlsxOptions | null, isAsync: boolean, cs: wijmo.xlsx._ICancellationSource, progress?: (value: number) => void): wijmo.xlsx._SyncPromise {
        let p = new wijmo.xlsx._SyncPromise(cs),
            workSheet = new wijmo.xlsx.WorkSheet(),
            includeColumnHeaders = options && options.includeColumnHeaders != null ? options.includeColumnHeaders : true,
            includeRowHeaders = options && options.includeRowHeaders != null ? options.includeRowHeaders : false,
            includeCellStyles = _IncludeCellStyles.Cache,
            includeColumns = options ? options.includeColumns : null,
            formatItem = options ? options.formatItem : null,
            cellsCache: _CellsCache = [];

        if (options) {
            includeCellStyles = wijmo.asBoolean(options.includeCellStyles, true) === false
                ? _IncludeCellStyles.None
                : (wijmo.asBoolean(options.quickCellStyles, true) === false
                    ? _IncludeCellStyles.Regular
                    : _IncludeCellStyles.Cache);
        }

        let styleCache = (includeCellStyles === _IncludeCellStyles.Cache) ? new _StyleCache(500) : null;

        if (this.hasCssText == null) {
            this.hasCssText = 'cssText' in document.body.style;
        }

        // Set sheet name for the exporting sheet.
        let sheetInfo = <IExtendedSheetInfo>grid['wj_sheetInfo'];
        workSheet.name = options ? options.sheetName : '';
        workSheet.visible = options ? (options.sheetVisible !== false) : true;
        if (sheetInfo && sheetInfo.tables && sheetInfo.tables.length > 0) {
            for (let i = 0; i < sheetInfo.tables.length; i++) {
                workSheet.tables.push(sheetInfo.tables[i]);
            }
        }

        let fakeCell: HTMLDivElement;
        if (!sheetInfo && (includeCellStyles !== _IncludeCellStyles.None || formatItem)) {
            fakeCell = document.createElement('div');
            fakeCell.style.visibility = 'hidden';
            fakeCell.setAttribute(wijmo.grid.FlexGrid._WJS_MEASURE, 'true');
            grid.hostElement.appendChild(fakeCell);
        }

        let rowHeaderColumnCnt = includeRowHeaders ? grid.rowHeaders.columns.length : 0,
            headerColumnsInfo = this._getPerRowColumnsSettings(grid, includeRowHeaders ? [grid.topLeftCells, grid.columnHeaders] : [grid.columnHeaders]), // extract columns settings from the headerp panels
            headerColumns = headerColumnsInfo.cols,
            dataColumns = (softMultiRow() && (grid instanceof softMultiRow().MultiRow))
                ? this._getPerRowColumnsSettings(grid, includeRowHeaders ? [grid.rowHeaders, grid.cells] : [grid.cells], grid.rowsPerItem).cols // MultiRow: extract columns settings from the data panels
                : null,
            columnHeaderRowCnt = headerColumns.length; // visible rows only

        let panels = [// panel + the corresponding row headers panel.
            [grid.topLeftCells, grid.columnHeaders],
            [grid.rowHeaders, grid.cells],
            [grid.bottomLeftCells, grid.columnFooters]
        ];

        if (!includeColumnHeaders) {
            panels.shift();
        }

        let totalRows = panels.map(p => p[1].rows.length).reduce((a, c) => a + c);

        if (headerColumns.length) {
            // Fill workSheet.columns
            headerColumns[0].forEach((col, i) => {
                let bndCol = headerColumnsInfo.bndCols[0][i]; // a binding column associated with the col

                if (i >= rowHeaderColumnCnt /*ColumnHeader*/ && includeColumns && !includeColumns(bndCol)) {
                    return;
                }

                let workbookColumn = new wijmo.xlsx.WorkbookColumn();
                workbookColumn._deserialize(col);
                workSheet._addWorkbookColumn(workbookColumn);
            });
        }

        this._saveContentToWorksheet(cs, isAsync, Date.now(), 0,
            {
                panels: panels,
                panelIdx: 0,
                globRowIdx: 0,
                rowsOffset: 0,
                totalRows: totalRows
            },
            grid, workSheet, includeRowHeaders,
            (cellType: wijmo.grid.CellType) => {
                // MultiRow only: Because of headerLayoutDefinition the header and data columns can have different structures and formatting.
                if (cellType == wijmo.grid.CellType.Cell && dataColumns) {
                    return dataColumns;
                }
                return headerColumns;
            },
            includeCellStyles, fakeCell, cellsCache, styleCache, includeColumns, formatItem,
            (gri: number) => {
                progress(Math.round(gri / totalRows * 100));

            },
            () => {
                let workbookFrozenPane = new wijmo.xlsx.WorkbookFrozenPane();
                workbookFrozenPane.rows = includeColumnHeaders ? (grid.frozenRows + columnHeaderRowCnt) : grid.frozenRows;
                workbookFrozenPane.columns = includeRowHeaders ? (grid.frozenColumns + rowHeaderColumnCnt) : grid.frozenColumns;
                workSheet.frozenPane = workbookFrozenPane;

                workbook._addWorkSheet(workSheet);

                if (!sheetInfo && (includeCellStyles !== _IncludeCellStyles.None || formatItem)) {
                    // done with style element
                    grid.hostElement.removeChild(fakeCell);
                    cellsCache.forEach(p => p.forEach(el => {
                        if (el && el.parentElement) {
                            el.parentElement.removeChild(el);
                        }
                    }));
                }

                if (styleCache) {
                    styleCache.clear();
                }

                workbook.activeWorksheet = options ? options.activeWorksheet : null;

                p.resolve();
            });

        return p;
    }

    private static _saveContentToWorksheet(cs: wijmo.xlsx._ICancellationSource, isAsync: boolean, batchStart: number, startIndex: number, batchCtx: _IBatchContext,
        grid: wijmo.grid.FlexGrid,
        workSheet: wijmo.xlsx.WorkSheet,
        includeRowHeaders: boolean,
        columnSettingsGetter: (cellType: wijmo.grid.CellType) => wijmo.xlsx.IWorkbookColumn[][],
        includeCellStyles: _IncludeCellStyles,
        fakeCell: HTMLDivElement,
        cellsCache: HTMLDivElement[][],
        styleCache: _StyleCache,
        includeColumns: (column: wijmo.grid.Column) => boolean,
        formatItem: (args: XlsxFormatItemEventArgs) => void,
        progress: (globalRowIndex: number) => void,
        done: Function): void {
        let _BATCH_SIZE = includeCellStyles ? 20 : 200, // number of rows per batch
            _BATCH_DELAY = 100, // ms
            _BATCH_TIMEOUT = 0; // ms

        for (let gri = startIndex; gri < batchCtx.totalRows; gri++) {
            if (cs && cs.cancelled) {
                return;
            }

            // let go of the thread for a while
            if (isAsync && gri - startIndex > _BATCH_SIZE && Date.now() - batchStart > _BATCH_DELAY) {
                setTimeout(() => {
                    if (cs && cs.cancelled) {
                        return;
                    }

                    progress(gri);
                    this._saveContentToWorksheet(cs, isAsync, Date.now(), gri, batchCtx,
                        grid, workSheet, includeRowHeaders, columnSettingsGetter, includeCellStyles, fakeCell, cellsCache, styleCache, includeColumns, formatItem,
                        progress, done);
                }, _BATCH_TIMEOUT);

                return;
            }

            // Switch to the next panel if the end of the current panel is reached; skip panels with no rows.
            while (gri - batchCtx.rowsOffset >= batchCtx.panels[batchCtx.panelIdx][1].rows.length) {
                batchCtx.rowsOffset += batchCtx.panels[batchCtx.panelIdx][1].rows.length;
                batchCtx.panelIdx++;
            }

            let pnl = batchCtx.panels[batchCtx.panelIdx],
                header = pnl[0],
                content = pnl[1],
                ri = gri - batchCtx.rowsOffset; // Row index relative to current panel.

            let row = content.rows[ri];

            if ((content.cellType !== wijmo.grid.CellType.Cell && row.renderSize <= 0) || row instanceof wijmo.grid._NewRowTemplate) {
                continue;
            }

            let rowHeaderColumnCnt = 0,
                workbookRowOM: wijmo.xlsx.IWorkbookRow = {},
                workbookRow = new wijmo.xlsx.WorkbookRow(),
                isGroupRow = row instanceof wijmo.grid.GroupRow,
                groupLevel = 0;

            if (content.cellType === wijmo.grid.CellType.Cell) {
                if (isGroupRow) {
                    groupLevel = (row as wijmo.grid.GroupRow).level;
                } else {
                    if (grid.rows.maxGroupLevel > -1) {
                        groupLevel = grid.rows.maxGroupLevel + 1;
                    }
                }
            }

            let columnSettings = columnSettingsGetter(content.cellType);

            if (includeRowHeaders) {
                rowHeaderColumnCnt = this._parseFlexGridRowToSheetRow(header, workbookRowOM, ri, 0, columnSettings, includeCellStyles, fakeCell, cellsCache, styleCache, isGroupRow, groupLevel, includeColumns, formatItem);
            }

            this._parseFlexGridRowToSheetRow(content, workbookRowOM, ri, rowHeaderColumnCnt, columnSettings, includeCellStyles, fakeCell, cellsCache, styleCache, isGroupRow, groupLevel, includeColumns, formatItem);

            // Only the row contains cells need be added into the Workbook Object Model.
            if (workbookRowOM.cells.length > 0) {
                workbookRow._deserialize(workbookRowOM);
                workSheet._addWorkbookRow(workbookRow, batchCtx.globRowIdx);
            }

            batchCtx.globRowIdx++;
        }

        if (wijmo.isFunction(done)) {
            done();
        }
    }

    // Load the workbook instance to flexgrid
    private static _loadToFlexGrid(grid: wijmo.grid.FlexGrid, workbook: wijmo.xlsx.Workbook, options: IFlexGridXlsxOptions) {
        if (softTransposedMultiRow() && (grid instanceof softTransposedMultiRow().TransposedMultiRow)) {
            throw 'Not supported.';
        }

        options = options || {};

        let isFlexSheet = grid['wj_sheetInfo'] != null,
            currentSheet: wijmo.xlsx.WorkSheet,
            styledCells = {},
            mergedRanges: wijmo.grid.CellRange[] = [],
            fonts: string[] = [],
            groupCollapsedSettings: any = {};

        grid.itemsSource = null;
        grid.columns.clear();
        grid.columnHeaders.rows.clear();
        // grid.rowHeaders.columns.clear(); // TFS 465018
        grid.rows.clear();
        grid.frozenColumns = 0;
        grid.frozenRows = 0;

        let sheetIndex = options.sheetIndex != null && !isNaN(options.sheetIndex) ? options.sheetIndex : 0;
        if (sheetIndex < 0 || sheetIndex >= workbook.sheets.length) {
            throw 'The sheet index option is out of the sheet range of current workbook.';
        }

        if (options.sheetName != null) {
            for (let i = 0; i < workbook.sheets.length; i++) {
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

        let columnCount = this._getColumnCount(currentSheet.rows),
            rowCount = this._getRowCount(currentSheet.rows, columnCount),
            columnSettings = currentSheet.columns;

        for (let c = 0; c < columnCount; c++) {
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

        let includeColumnHeaders = (options.includeColumnHeaders != null ? options.includeColumnHeaders : true) && currentSheet.rows.length > 0,
            colHdrHeight = includeColumnHeaders ? this._getColumnHeadersHeight(currentSheet) : 0;

        //var begin = Date.now();
        let groupCollapsed = false,
            groupRow: wijmo.grid.GroupRow,
            columns: IColumn[] = [];

        let frzRows = currentSheet.frozenPane && currentSheet.frozenPane.rows,
            frzCols = currentSheet.frozenPane && currentSheet.frozenPane.columns;

        frzRows = wijmo.isNumber(frzRows) && !isNaN(frzRows) ? frzRows : null;
        frzCols = wijmo.isNumber(frzCols) && !isNaN(frzCols) ? frzCols : null;

        for (let r = colHdrHeight; r < rowCount; r++) {
            let isGroupHeader = false,
                rowWordWrap: boolean = null,
                sheetRow = currentSheet.rows[r];

            //if (r % 1000 === 0 && r !== 0) {
            //    console.log(`${r} rows loaded in ${(Date.now() - begin) / 1000} seconds`);
            //    begin = Date.now();
            //}
            if (sheetRow) {
                let nextRowIdx = r + 1;
                while (nextRowIdx < currentSheet.rows.length) {
                    let nextRow = currentSheet.rows[nextRowIdx];
                    if (nextRow) {
                        if ((isNaN(sheetRow.groupLevel) && !isNaN(nextRow.groupLevel))
                            || (!isNaN(sheetRow.groupLevel) && sheetRow.groupLevel < nextRow.groupLevel)) {
                            isGroupHeader = true;
                        }
                        break;
                    } else {
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
            } else {
                let row = new wijmo.grid.Row();
                if (sheetRow && this._checkParentCollapsed(groupCollapsedSettings, sheetRow.groupLevel)) {
                    row._setFlag(wijmo.grid.RowColFlags.ParentCollapsed, true);
                }
                grid.rows.push(row);
            }

            if (sheetRow && !!sheetRow.height && !isNaN(sheetRow.height)) {
                grid.rows[r - colHdrHeight].height = sheetRow.height;
            }

            for (let c = 0; c < columnCount; c++) {
                if (sheetRow) {
                    let item: wijmo.xlsx.WorkbookCell = sheetRow.cells[c],
                        formula = item ? item.formula : null;

                    if (formula && formula[0] !== '=') {
                        formula = '=' + formula;
                    }
                    if (item && item.textRuns && item.textRuns.length > 0) {
                        grid.rows[r - colHdrHeight].isContentHtml = true;
                        grid.setCellData(r - colHdrHeight, c, this._parseTextRunsToHTML(item.textRuns));
                    } else {
                        grid.setCellData(r - colHdrHeight, c, formula && isFlexSheet ? formula : this._getItemValue(item));
                    }
                    if (!isGroupHeader) {
                        this._setColumn(columns, c, item);
                    }

                    // Set styles for the cell in current processing sheet.
                    let cellIndex = r * columnCount + c,
                        cellStyle: wijmo.xlsx.WorkbookStyle = item ? item.style : null;

                    if (cellStyle) {
                        rowWordWrap = rowWordWrap == null ? !!cellStyle.wordWrap : rowWordWrap && !!cellStyle.wordWrap;

                        if (isFlexSheet) {
                            let cellFormat = wijmo.xlsx.Workbook._parseExcelFormat(item),
                                textAlign: string;

                            if (cellStyle.hAlign) {
                                textAlign = wijmo.xlsx.Workbook._parseHAlignToString(wijmo.asEnum(cellStyle.hAlign, wijmo.xlsx.HAlign));
                            } else {
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
                                        } else {
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
                                let sc = styledCells[cellIndex],
                                    bs = cellStyle.borders,
                                    fc = cellStyle.fill.color;

                                if (!bs) {
                                    sc.borderLeftColor = fc;

                                    if (c !== frzCols - 1) {
                                        sc.borderRightColor = fc;
                                    }

                                    sc.borderTopColor = fc;

                                    if (r !== frzRows - 1) {
                                        sc.borderBottomColor = fc;
                                    }
                                } else {
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
        for (let c = 0; c < grid.columnHeaders.columns.length; c++) {
            let columnSetting = columns[c],
                column = grid.columns[c] as wijmo.grid.Column;

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
        for (let i = 0; i < Math.max(colHdrHeight, 1); i++) { // Add at least one column header row even if includeColumnHeaders = false
            grid.columnHeaders.rows.push(new wijmo.grid.Row());
        }

        // colHdrHeight == 0 if includeColumnHeaders = false.
        for (let i = 0; i < colHdrHeight; i++) {
            for (let j = 0; j < grid.columnHeaders.columns.length; j++) {
                let cell = currentSheet.rows[i] ? currentSheet.rows[i].cells[j] : null,
                    text = cell && cell.value != null ? cell.value : '',
                    col = grid.columnHeaders.columns[j] as wijmo.grid.Column;

                if (text) {
                    let headerFormat = wijmo.xlsx.Workbook._parseExcelFormat(cell);
                    text = wijmo.Globalize.format(text, headerFormat);
                }

                col.header = col.header || text;
                grid.columnHeaders.setCellData(i, j, text);
            }
        }

        // Set sheet related info for importing.
        // This property contains the name, style of cells, merge cells and used fonts of current sheet.
        if (isFlexSheet) {
            let sheetVisible = options.sheetVisible != null ? options.sheetVisible : true;
            grid['wj_sheetInfo'].name = currentSheet.name;
            grid['wj_sheetInfo'].visible = sheetVisible === true ? true : currentSheet.visible !== false;
            grid['wj_sheetInfo'].styledCells = styledCells;
            grid['wj_sheetInfo'].mergedRanges = mergedRanges;
            grid['wj_sheetInfo'].fonts = fonts;
            grid['wj_sheetInfo'].tables = currentSheet.tables;
        }
    }

    // Gets the number of rows in column headers section.
    private static _getColumnHeadersHeight(sheet: wijmo.xlsx.WorkSheet): number {
        let rows: wijmo.xlsx.WorkbookRow[];

        if (!sheet || !(rows = sheet.rows).length) {
            return 0;
        }

        if (!rows[0]) { // an empty row
            return 1;
        }

        let i = 0;

        for (let steps = 1; i < rows.length && steps > 0; i++, steps--) {
            let span = rows[i].cells.reduce((prev, cur) => Math.max(prev, cur.rowSpan || 0), 1) // the maximum rowSpan value, or 1.
            if (span > steps) {
                steps = span;
            }
        }

        return i; // >= 1
    }

    private static _escapePlainText(value: string) {
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
    }

    // Parse the row data of flex grid to a sheet row
    private static _parseFlexGridRowToSheetRow(panel: wijmo.grid.GridPanel, workbookRow: wijmo.xlsx.IWorkbookRow,
        rowIndex: number, startColIndex: number, columnSettings: wijmo.xlsx.IWorkbookColumn[][],
        includeCellStyles: _IncludeCellStyles, fakeCell: HTMLDivElement, cellsCache: _CellsCache, styleCache: _StyleCache,
        isGroupRow: boolean, groupLevel: number,
        includeColumns: (column: wijmo.grid.Column) => boolean, formatItem?: (agrs: XlsxFormatItemEventArgs) => void): number {

        let flex = panel.grid,
            sheetInfo = <IExtendedSheetInfo>flex['wj_sheetInfo'],
            row = panel.rows[rowIndex],
            recordIndex = 0,
            evaluateFormulaFun: Function = sheetInfo && sheetInfo.evaluateFormula;

        if (row['recordIndex'] == null) {
            if (panel.cellType === wijmo.grid.CellType.ColumnHeader && panel.rows.length > 1) {
                recordIndex = Math.min(rowIndex, columnSettings.length - 1);
            }
        } else {
            recordIndex = row['recordIndex'];
        }

        if (!workbookRow.cells) { workbookRow.cells = []; }

        workbookRow.visible = row.isVisible;
        workbookRow.height = row.renderHeight || panel.rows.defaultSize;
        workbookRow.groupLevel = groupLevel;

        if (isGroupRow) {
            workbookRow.collapsed = (<wijmo.grid.GroupRow>row).isCollapsed;
        }

        if (row.wordWrap) {
            workbookRow.style = { wordWrap: row.wordWrap };
        }

        let isCommonRow = (row.constructor === wijmo.grid.Row
            || row.constructor === wijmo.grid._NewRowTemplate
            || (softTransposed() && flex instanceof softTransposed().TransposedGrid && row instanceof wijmo.grid.Row)
            || (softDetail() && row.constructor === softDetail().DetailRow)
            || (softMultiRow() && row.constructor === softMultiRow()._MultiRow)
            || (softTransposedMultiRow() && row instanceof softTransposedMultiRow()._MultiRow));

        let isDetailRow = (softDetail() && row.constructor === softDetail().DetailRow),
            xlsxCell: wijmo.xlsx.IWorkbookCell,
            ci = 0;

        for (; ci < panel.columns.length; ci++) {
            let mergedCells: wijmo.grid.CellRange,
                cellStyle: any,
                cloneFakeCell: HTMLDivElement,
                colSpan = 1,
                rowSpan = 1,
                isStartMergedCell = false,
                bcol = flex._getBindingColumn(panel, rowIndex, panel.columns[ci]),
                indent = 0;

            if (sheetInfo && panel === flex.cells) {
                let cellIndex = rowIndex * panel.columns.length + ci;
                // Get merge range for cell.
                if (sheetInfo.mergedRanges) {
                    mergedCells = this._getMergedRange(rowIndex, ci, sheetInfo.mergedRanges);
                }
                // Get style for cell.
                if (sheetInfo.styledCells) {
                    cellStyle = sheetInfo.styledCells[cellIndex];
                }
            } else if (includeCellStyles !== _IncludeCellStyles.None/* || formatItem*/) {
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
                } else {
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
            } else {
                isStartMergedCell = true;
            }

            if (!!includeColumns && !includeColumns(bcol)) {
                continue;
            }

            let columnSetting = columnSettings[recordIndex] ? columnSettings[recordIndex][ci + startColIndex] : null,
                formulaVal: any,
                isFormula: boolean,
                val: any,
                unformattedVal: any,
                valIsDate: boolean,
                orgFormat: string,
                format: string;

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
                    format = wijmo.xlsx.Workbook._parseCellFormat(cellStyle.format, valIsDate);
                } else if (columnSetting && columnSetting.style && columnSetting.style.format) {
                    orgFormat = bcol.format;
                    format = columnSetting.style.format;
                } else {
                    format = null;
                }

                if (isFormula && evaluateFormulaFun != null && wijmo.isFunction(evaluateFormulaFun)) {
                    formulaVal = evaluateFormulaFun(val);
                }

                if (!format) {
                    if (valIsDate) {
                        format = 'm/d/yyyy';
                    } else if (wijmo.isNumber(unformattedVal) && !bcol.dataMap) {
                        format = wijmo.isInt(unformattedVal) ? '#,##0' : '#,##0.00';
                    } else if (isFormula) {
                        let formula = (<string>val).toLowerCase();
                        if (formula.indexOf('now()') > -1) {
                            format = 'm/d/yyyy h:mm';
                            valIsDate = true;
                        } else if (formula.indexOf('today()') > -1 || formula.indexOf('date(') > -1) {
                            format = 'm/d/yyyy';
                            valIsDate = true;
                        } else if (formula.indexOf('time(') > -1) {
                            format = 'h:mm AM/PM';
                            valIsDate = true;
                        }
                    } else {
                        format = 'General';
                    }
                }
            } else {
                val = isStartMergedCell ? flex.columnHeaders.getCellData(0, ci, true) : null;
                format = 'General';
            }

            let textRuns: wijmo.xlsx.IWorkbookTextRun[] = undefined;

            if (wijmo.isString(val) && val.indexOf('<span') !== -1) {
                textRuns = this._parseToTextRuns(val);
                val = null;
            }

            let parsedCellStyle = this._parseCellStyle(cellStyle) || {};

            if (panel === flex.cells && isGroupRow && (<wijmo.grid.GroupRow>row).hasChildren && ci === flex.columns.firstVisibleIndex) {
                let groupHeader: any;

                // Process the group header of the flex grid.
                if (isFormula && formulaVal != null) {
                    groupHeader = formulaVal;
                } else {
                    if (val) {
                        groupHeader = val;
                    } else if (isStartMergedCell) {
                        groupHeader = (<wijmo.grid.GroupRow>row).getGroupHeader();
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
                    format = '0';
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
                        format: format,
                        font: {
                            bold: true
                        },
                        hAlign: wijmo.xlsx.HAlign.Left,
                        indent: indent
                    }),
                    textRuns: textRuns
                };
            } else {
                // Add the cell content

                // -- for now, let's leave the old behavior --
                // Don't escape HTML entities except for GroupRow (WJM-20034, TFS 238526).
                //if (isGroupRow) {
                val = wijmo.isString(val) ? wijmo.xlsx.Workbook._unescapeXML(val) : val;
                unformattedVal = wijmo.isString(unformattedVal) ? wijmo.xlsx.Workbook._unescapeXML(unformattedVal) : unformattedVal;
                //}

                if (!valIsDate && orgFormat && orgFormat.toLowerCase() === 'd' && wijmo.isInt(unformattedVal)) {
                    format = '0';
                }

                let hAlign: wijmo.xlsx.HAlign;
                if (parsedCellStyle && parsedCellStyle.hAlign) {
                    hAlign = parsedCellStyle.hAlign;
                } else if (columnSetting && columnSetting.style && columnSetting.style.hAlign != null) {
                    hAlign = wijmo.asEnum(columnSetting.style.hAlign, wijmo.xlsx.HAlign, true);
                } else {
                    if (wijmo.isDate(unformattedVal)) {
                        hAlign = wijmo.xlsx.HAlign.Left;
                    } else {
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
                        : (format === 'General' && !(val === '' && unformattedVal == null)
                            ? this._escapePlainText(val)
                            : this._escapePlainText(unformattedVal)),
                    isDate: valIsDate,
                    formula: isFormula ? this._parseToExcelFormula(val, valIsDate) : null,
                    colSpan: ci < flex.columns.firstVisibleIndex ? 1 : colSpan,
                    rowSpan: rowSpan,
                    style: this._extend(parsedCellStyle, {
                        format: format,
                        hAlign: hAlign,
                        vAlign: rowSpan > 1 ? (panel === flex.cells || flex['centerHeadersVertically'] === false ? wijmo.xlsx.VAlign.Top : wijmo.xlsx.VAlign.Center) : null,
                        indent: indent
                    }),
                    textRuns: textRuns
                };
            }

            if (formatItem) {
                let xlsxFormatItemArgs = new XlsxFormatItemEventArgs(panel, new wijmo.grid.CellRange(rowIndex, ci), cloneFakeCell, fakeCell, cellsCache, styleCache, xlsxCell);
                formatItem(xlsxFormatItemArgs);
                // If xlsxFormatItemArgs.getFormattedCell was called then a new cloned cell was created and
                // assigned to xlsxFormatItemArgs.cell, We assign it to cloneFakeCell to remove it from DOM
                // in the code below.
                //cloneFakeCell = <HTMLDivElement>xlsxFormatItemArgs.cell;
            }

            if (isDetailRow) {
                let detailRowCell = panel.getCellElement(rowIndex, ci);
                if (detailRowCell) {
                    // If _getCellStyle() was called then the detail element was moved to fakeCell (it also can be called from xlsxFormatItemArgs.getFormattedCell).
                    // Move the detail element back to its original parent element (324064).
                    let detail = (row as wijmo.grid.detail.DetailRow).detail;
                    detailRowCell.appendChild(detail);
                    wijmo.Control.refreshAll(detail); // 470414
                }
            }

            //if (cloneFakeCell) {
            //    cloneFakeCell.parentElement.removeChild(cloneFakeCell);
            //    cloneFakeCell = null;
            //}

            workbookRow.cells.push(xlsxCell);
        }

        return startColIndex + ci;
    }

    // Parse CSS style to Excel style.
    static _parseCellStyle(cellStyle: CSSStyleDeclaration, isTableStyle = false): wijmo.xlsx.IWorkbookStyle {
        if (cellStyle == null) {
            return null;
        }

        let fontSize = cellStyle.fontSize as any;
        fontSize = fontSize ? +fontSize.substring(0, fontSize.indexOf('px')) : null;
        // We should parse the font size from pixel to point for exporting.
        if (isNaN(fontSize)) {
            fontSize = null;
        }

        let wordWrap = cellStyle.whiteSpace as any;
        wordWrap = wordWrap ? (wordWrap.indexOf('pre') > -1 ? true : false) : false;

        // Process text-align property
        let textAlign = cellStyle.textAlign;
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
                underline: ((cellStyle as any).textDecorationStyle || cellStyle.textDecoration) === 'underline',
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
    }

    // Parse the border style.
    private static _parseBorder(cellStyle: any, isTableBorder: boolean): wijmo.xlsx.IWorkbookBorder {
        let border: wijmo.xlsx.IWorkbookBorder = {
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
    }

    // Parse the egde of the borders
    private static _parseEgdeBorder(cellStyle: any, edge: string): wijmo.xlsx.IWorkbookBorderSetting {
        let edgeBorder: wijmo.xlsx.IWorkbookBorderSetting,
            style = cellStyle['border' + edge + 'Style'],
            width = cellStyle['border' + edge + 'Width'];

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
                    } else {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.Dotted;
                    }
                    break;
                case 'dashed':
                    if (width > 1) {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.MediumDashed;
                    } else {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.Dashed;
                    }
                    break;
                case 'double':
                    edgeBorder.style = wijmo.xlsx.BorderStyle.Double;
                    break;
                default:
                    if (width > 2) {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.Thick;
                    } else if (width > 1) {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.Medium;
                    } else {
                        edgeBorder.style = wijmo.xlsx.BorderStyle.Thin;
                    }
                    break;
            }
            edgeBorder.color = cellStyle['border' + edge + 'Color'];
        }

        return edgeBorder;
    }

    // Parse the border style to css style.
    static _parseBorderStyle(borderStyle: wijmo.xlsx.BorderStyle, edge: string, cellStyle: any) {
        let edgeStyle = 'border' + edge + 'Style',
            edgeWidth = 'border' + edge + 'Width';

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
    }

    // Parse the CSS font family to excel font family.
    private static _parseToExcelFontFamily(fontFamily: string): string {
        let fonts: string[];

        if (fontFamily) {
            fonts = fontFamily.split(',');
            if (fonts && fonts.length > 0) {
                fontFamily = fonts[0].replace(/\"|\'/g, '');
            }
        }

        return fontFamily;
    }

    // Parse the formula to excel formula.
    private static _parseToExcelFormula(formula: string, isDate: boolean): string {
        let floorCeilReg = /(floor|ceiling)\([+-]?\d+\.?\d*\)/gi,
            textReg = /text\(\"?\w+\"?\s*\,\s*\"\w+\"\)/gi;

        let matches = formula.match(floorCeilReg);
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                let matchFormula = matches[i];
                let updatedFormula = matchFormula.substring(0, matchFormula.lastIndexOf(')')) + ', 1)';
                formula = formula.replace(matchFormula, updatedFormula);
            }
        }

        matches = null;
        matches = formula.match(textReg);
        if (matches) {
            let textFormatReg = /\"?\w+\"?\s*\,\s*\"(\w+)\"/i;
            for (let i = 0; i < matches.length; i++) {
                let matchFormula = matches[i];
                let formatMatches = matchFormula.match(textFormatReg);
                if (formatMatches && formatMatches.length === 2) {
                    let format = formatMatches[1];
                    if (!/^d{1,4}?$/.test(format)) {
                        let updatedFormat = wijmo.xlsx.Workbook._parseCellFormat(format, isDate);
                        let updatedFormula = matchFormula.replace(format, updatedFormat);
                        formula = formula.replace(matchFormula, updatedFormula);
                    }
                }
            }
        }

        return formula;
    }

    // Parse the rich text to text runs.
    private static _parseToTextRuns(value: string): wijmo.xlsx.IWorkbookTextRun[] {
        let spans = value.split('<span '),
            textRuns = [];

        for (let i = 0; i < spans.length; i++) {
            let item = spans[i],
                textRun: wijmo.xlsx.IWorkbookTextRun;

            if (item.indexOf('</span>') !== -1) {
                let text = item.substring(item.indexOf('>') + 1, item.indexOf('</span>')),
                    textFont = this._parseToTextRunFont(item.substring(item.indexOf('style="') + 7, item.indexOf(';"')));

                textRun = { text: text, font: textFont };
            } else {
                textRun = { text: item };
            }

            textRuns.push(textRun);
        }

        return textRuns;
    }

    // Parse the font for the text run.
    private static _parseToTextRunFont(style: string) {
        let styles = style.split(';'),
            textFont: wijmo.xlsx.IWorkbookFont;

        if (styles.length > 0) {
            let bold: boolean,
                italic: boolean,
                underline: boolean,
                fontSize: number,
                family: string,
                color: string;

            for (let i = 0; i < styles.length; i++) {
                let styleItem = styles[i].split(':');

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
    }

    // Returns a "measure" cell for custom style and content evaluation. It either gets it from the cache
    // or creates a new one and adds it to the DOM and cache.
    static _getMeasureCell(panel: wijmo.grid.GridPanel, colIndex: number, patternCell: HTMLDivElement, cellsCache: _CellsCache): HTMLDivElement {
        let panelCache = cellsCache[panel.cellType],
            cachedCell = panelCache && panelCache[colIndex],
            newCell = cachedCell == null;

        if (!cachedCell) {
            if (!panelCache) {
                cellsCache[panel.cellType] = panelCache = [];
            }
            panelCache[colIndex] = cachedCell = <HTMLDivElement>patternCell.cloneNode();
        } else {
            // clear the style
            if (this.hasCssText) { // checks that style.cssText is supported
                cachedCell.style.cssText = '';
                cachedCell.style.visibility = 'hidden';
            }
        }

        if (newCell || !cachedCell.parentElement) {
            if (panel.hostElement.children.length > 0) {
                panel.hostElement.children[0].appendChild(cachedCell);
            } else {
                panel.hostElement.appendChild(cachedCell);
            }
        }

        return cachedCell;
    }

    // Gets the column setting, include width, visible, format and alignment
    private static _getColumnSetting(column: wijmo.grid.Column, colIndex: number, columns: wijmo.grid.ColumnCollection): wijmo.xlsx.IWorkbookColumn {
        let renderColumn = column;

        if (column['colspan'] != null) { // multirow
            renderColumn = this._getRenderColumn(colIndex, columns);
        }

        if (!renderColumn) {
            return null;
        }

        return {
            autoWidth: true,
            width: renderColumn.renderWidth || columns.defaultSize,
            visible: renderColumn.visible && (renderColumn.width !== 0) && !renderColumn._getFlag(wijmo.grid.RowColFlags.ParentCollapsed), // hide column if width = 0 (TFS 467141)
            style: {
                //format: renderColumn.format ? mXlsx.Workbook._parseCellFormat(renderColumn.format, renderColumn.dataType === DataType.Date) : '',
                format: column.format ? wijmo.xlsx.Workbook._parseCellFormat(column.format, column.dataType === wijmo.DataType.Date) : '',
                hAlign: wijmo.xlsx.Workbook._parseStringToHAlign(this._toExcelHAlign(renderColumn.getAlignment())),
                wordWrap: renderColumn.wordWrap
            }
        };
    }

    // panels = [row headers (optional); content]
    // cols: An array of IWorkbookColumn extracted from panels.
    // bndCols: An array of the same structure containing the associated binding columns.
    private static _getPerRowColumnsSettings(grid: wijmo.grid.FlexGrid, panels: wijmo.grid.GridPanel[], maxRows?: number): { cols: wijmo.xlsx.IWorkbookColumn[][], bndCols: wijmo.grid.Column[][] } {
        let cols: wijmo.xlsx.IWorkbookColumn[][] = [],
            bndCols: wijmo.grid.Column[][] = [];

        panels.forEach((panel, pi) => {
            let visRi = 0,
                rowHdrOffset = pi > 0 ? panels[0].columns.length : 0;

            for (let ri = 0; ri < panel.rows.length; ri++) {
                if (maxRows != null && ri >= maxRows) {
                    break;
                }

                if (panel.rows[ri].renderSize <= 0) {
                    continue;
                }

                cols[visRi] = cols[visRi] || [];
                bndCols[visRi] = bndCols[visRi] || [];

                panel.columns.forEach((col, ci) => {
                    let bndCol = grid._getBindingColumn(panel, ri, col),
                        wbCol = this._getColumnSetting(bndCol, ci, panel.columns);

                    if (wbCol) {
                        cols[visRi][rowHdrOffset + ci] = wbCol;
                        bndCols[visRi][rowHdrOffset + ci] = bndCol;
                    }
                });

                visRi++;
            }
        });

        return {
            cols: cols,
            bndCols: bndCols
        };
    }

    // Parse the CSS alignment to excel hAlign.
    private static _toExcelHAlign(value: string): string {
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
    }

    // gets column count for specific row
    private static _getColumnCount(sheetData: any[]): number {
        let res = 0;

        for (let i = 0; i < sheetData.length; i++) {
            let data = sheetData[i] && sheetData[i].cells ? sheetData[i].cells : [];
            if (data && data.length > 0) {
                let currentColCnt = data.length;
                if (wijmo.isInt(data[currentColCnt - 1].colSpan) && data[currentColCnt - 1].colSpan > 1) {
                    currentColCnt = currentColCnt + data[currentColCnt - 1].colSpan - 1
                }
                if (currentColCnt > res) {
                    res = currentColCnt;
                }
            }
        }

        return res;
    }

    // gets row count for specified sheet
    private static _getRowCount(sheetData: any[], columnCnt: number): number {
        var rowCount = sheetData.length,
            rowIndex = rowCount - 1;

        for (let colIndex = 0; colIndex < columnCnt; colIndex++) {
            rowLoop:
            for (; rowIndex >= 0; rowIndex--) {
                let lastRow = sheetData[rowIndex],
                    data = lastRow && lastRow.cells ? lastRow.cells : [],
                    cell = data[colIndex];

                if (cell && ((cell.value != null && cell.value !== '') || (wijmo.isInt(cell.rowSpan) && cell.rowSpan > 1))) {
                    if (wijmo.isInt(cell.rowSpan) && cell.rowSpan > 1 && (rowIndex + cell.rowSpan > rowCount)) {
                        rowCount = rowIndex + cell.rowSpan;
                    }
                    break rowLoop;
                }
            }
        }

        return rowCount;
    }

    // convert the column index to alphabet
    private static _numAlpha(i: number): string {
        let t = Math.floor(i / 26) - 1;
        return (t > -1 ? this._numAlpha(t) : '') + String.fromCharCode(65 + i % 26);
    }

    // Get DataType for value of the specific excel item
    private static _getItemType(item: any): wijmo.DataType {
        if (item == null || item.value == null
            || isNaN(item.value)) {
            return null;
        }

        return wijmo.getType(item.value);
    }

    // Set column definition for the Flex Grid
    private static _setColumn(columns: IColumn[], columnIndex: number, item: wijmo.xlsx.WorkbookCell) {
        let columnSetting = columns[columnIndex];

        if (!columnSetting) {
            columns[columnIndex] = {
                dataType: this._getItemType(item),
                format: wijmo.xlsx.Workbook._parseExcelFormat(item),
                hAlign: '',
                wordWrap: null
            };
        } else {
            let dataType = this._getItemType(item);

            if (columnSetting.dataType !== dataType &&
                columnSetting.dataType === wijmo.DataType.Boolean && dataType !== wijmo.DataType.Boolean) {
                columnSetting.dataType = dataType;
            }

            if (item && item.value != null && !(wijmo.isString(item.value) && wijmo.isNullOrWhiteSpace(item.value))) {
                let format = wijmo.xlsx.Workbook._parseExcelFormat(item);

                if (format && columnSetting.format !== format && format !== 'General') {
                    columnSetting.format = format;
                }
            }

            let hAlign: string;

            if (item && item.style) {
                if (item.style.hAlign) {
                    hAlign = wijmo.xlsx.Workbook._parseHAlignToString(wijmo.asEnum(item.style.hAlign, wijmo.xlsx.HAlign));
                }
                if (columnSetting.wordWrap == null) {
                    columnSetting.wordWrap = !!item.style.wordWrap;
                } else {
                    columnSetting.wordWrap = columnSetting.wordWrap && !!item.style.wordWrap;
                }
            }

            if (!hAlign && dataType === wijmo.DataType.Number) {
                hAlign = 'right';
            }

            columnSetting.hAlign = hAlign;
        }
    }

    // Get value from the excel cell item
    private static _getItemValue(item: any): any {
        if (item == null || item.value == null) {
            return null;
        }

        let val = item.value;

        if (wijmo.isString(val) && val[0] === "'") {
            val = (<string>val).substr(1);
        }

        if (wijmo.isNumber(val) && isNaN(val)) {
            return '';
        } else if (val instanceof Date && isNaN(val.getTime())) {
            return '';
        } else {
            return val;
        }
    }

    // Get style of cell.
    static _getCellStyle(panel: wijmo.grid.GridPanel, fakeCell: HTMLDivElement, r: number, c: number, styleCache: _StyleCache | null, forceUpdateContent: boolean): CSSStyleDeclaration {
        let style: CSSStyleDeclaration,
            grid = panel.grid;

        try {
            //AlexI
            //this._resetCellStyle(fakeCell);
            // get styles for any panel, row, column

            // Update content only if quickCellStyles = false (the old behaviour, just for sure) or item formatter is attached.
            let update = !styleCache || grid.formatItem.hasHandlers || grid.itemFormatter || forceUpdateContent ? true : false;
            grid.cellFactory.updateCell(panel, r, c, fakeCell, null, update);
            fakeCell.className = fakeCell.className.replace('wj-state-selected', '');
            fakeCell.className = fakeCell.className.replace('wj-state-multi-selected', '');
        } catch (ex) {
            return null;
        }

        if (styleCache) { // includeCellStyles = Cache
            let host = panel.hostElement,
                fc = fakeCell as HTMLElement;

            // Build the cache key.
            //
            // First, extract the key from the fakeCell's inline style.
            let key = fc.style.cssText.split(/;\s+/).filter(propVal => {
                let prop = propVal.substring(0, propVal.indexOf(':'));
                return /^(color|background|border|font|text|whitespace)/i.test(prop); // leave only those properties that begin with these words.
            }).join(';');

            // Then add CSS class names to the key, starting with the fakeCell and ending with the panel element.
            do {
                key = fc.className + key;
            } while (fc !== host && (fc = fc.parentElement))

            // Check the cache.
            style = styleCache.getValue(key);
            if (!style) {
                style = window.getComputedStyle(fakeCell);
                styleCache.add(key, style);
            }
        } else {
            style = window.getComputedStyle(fakeCell);
        }

        return style;
    }

    // Parse the WorkbookTextRuns to related html markup.
    private static _parseTextRunsToHTML(textRuns: wijmo.xlsx.WorkbookTextRun[]): string {
        let res = '';

        for (let i = 0; i < textRuns.length; i++) {
            let textRun = textRuns[i],
                font = textRun.font;

            if (font) {
                res += '<span style="' + (font.bold ? 'font-weight: bold;' : '') + (font.italic ? 'font-style: italic;' : '')
                    + (font.underline ? 'text-decoration: underline;' : '') + (font.family ? 'font-family: ' + font.family + ';' : '')
                    + (font.size != null ? 'font-size: ' + font.size + 'px;' : '') + (font.color ? 'color: ' + font.color + ';' : '')
                    + '">' + textRun.text + '</span>';
            } else {
                res += textRun.text;
            }
        }

        return res;
    }

    // extends the source hash to destination hash
    private static _extend(dst: any, src: any) {
        for (let key in src) {
            let value = src[key];
            if (wijmo.isObject(value) && dst[key]) {
                wijmo.copy(dst[key], value); // copy sub-objects
            } else {
                dst[key] = value; // assign values
            }
        }

        return dst;
    }

    // check the parent group collapsed setting.
    private static _checkParentCollapsed(groupCollapsedSettings: any, groupLevel: number): boolean {
        let res = false;

        Object.keys(groupCollapsedSettings).forEach(key => {
            if (groupCollapsedSettings[key] === true && res === false && !isNaN(groupLevel) && +key < groupLevel) {
                res = true;
            }
        });

        return res;
    }

    // Get the col span for the merged cells.
    private static _getColSpan(p: wijmo.grid.GridPanel, mergedRange: wijmo.grid.CellRange, includeColumns: (column: wijmo.grid.Column) => boolean): number {
        let res = 0;

        for (let i = mergedRange.leftCol; i <= mergedRange.rightCol; i++) {
            if (!includeColumns || includeColumns(p.columns[i])) {
                res++;
            }
        }

        return res;
    }

    // Get the actual rendering column specific for MultiRow control. 
    private static _getRenderColumn(colIndex: number, columns: wijmo.grid.ColumnCollection): wijmo.grid.Column {
        if (colIndex >= columns.length) {
            return null;
        }

        return columns[colIndex];
    }

    // Get the merge cells in current sheet via row index and column index.
    private static _getMergedRange(row: number, col: number, mergeCells: wijmo.grid.CellRange[]): wijmo.grid.CellRange {
        for (let i = 0; i < mergeCells.length; i++) {
            let mr = mergeCells[i];
            if (row >= mr.topRow && row <= mr.bottomRow && col >= mr.leftCol && col <= mr.rightCol) {
                return mr;
            }
        }

        return null;
    }

    private static _isFormula(val: any) {
        return val && typeof (val) === 'string' && val.length > 1 && val[0] === '=' && val[1] !== '=';
    }
}

/**
 * Represents arguments of the IFlexGridXlsxOptions.formatItem callback.
 */
export class XlsxFormatItemEventArgs extends wijmo.grid.CellRangeEventArgs {
    private _cell: HTMLDivElement;
    private _patternCell: HTMLDivElement;
    private _xlsxCell: wijmo.xlsx.IWorkbookCell;
    private _cellsCache: _CellsCache;
    private _styleCache: _StyleCache;

    constructor(panel: wijmo.grid.GridPanel, rng: wijmo.grid.CellRange, cell: HTMLDivElement, patternCell: HTMLDivElement,
        cellsCache: _CellsCache, styleCache: _StyleCache, xlsxCell: wijmo.xlsx.IWorkbookCell) {
        super(panel, rng);

        this._cell = cell;
        this._patternCell = patternCell;
        this._xlsxCell = xlsxCell;
        this._cellsCache = cellsCache;
        this._styleCache = styleCache;
    }
    /**
         * If IFlexGridXlsxOptions.includeCellStyles is set to true then contains a
     * reference to the element that represents the formatted grid cell; otherwise, a null value.
     * 
     */
    get cell(): HTMLElement {
        return this._cell;
    }

    /**
     * Contains an exporting cell representation. Initially it contains a default cell representation created
     * by FlexGrid export, and can be modified by the event handler to customize its final content. For example,
     * the xlsxCell.value property can be updated to modify a cell content, xlsxCell.style to modify cell's style,
     * and so on.
     */
    get xlsxCell(): wijmo.xlsx.IWorkbookCell {
        return this._xlsxCell;
    }
    set xlsxCell(value: wijmo.xlsx.IWorkbookCell) {
        this._xlsxCell = value;
    }

    /**
     * Returns a cell with a custom formatting applied (formatItem event, cell templates).
     * This method is useful when export of custom formatting is disabled
     * (IFlexGridXlsxOptions.includeCellStyles=false), but you need
     * to export a custom content and/or style for a certain cells.
     */
    getFormattedCell(): HTMLElement {
        if (!this._cell) {
            //this._cell = <HTMLDivElement>this._patternCell.cloneNode();
            //this.panel.hostElement.children[0].appendChild(this._cell);
            this._cell = FlexGridXlsxConverter._getMeasureCell(this.panel, this.col, this._patternCell,
                this._cellsCache);
            //FlexGridXlsxConverter._getCellStyle(this.panel, this._cell, this.range.row, this.range.col);
            // The code is called from the formatItem callback, so we need to update the cell content.
            FlexGridXlsxConverter._getCellStyle(this.panel, this._cell, this.row, this.col, this._styleCache, true);
        }
        return this._cell
    }
}

enum _IncludeCellStyles {
    /**
     * Cells styling will not be included in the generated xlsx file (includeCellStyles = false).
     */
    None,
    /**
     * Cells styling will be included in the generated xlsx file (includeCellStyles = true, quickCellStyles = false).
     */
    Regular,
    /**
     * The same as Regular plus cell styles caching added (includeCellStyles = true, quickCellStyles = true).
     */
    Cache
}

export class _StyleCache {
    private _cache: { [key: string]: CSSStyleDeclaration } = {};
    private _max: number;
    private _size = 0;

    constructor(maxSize: number) {
        this._max = maxSize;
    }

    public add(key: string, value: CSSStyleDeclaration): void {
        if (this._size >= this._max) {
            this.clear();
        }

        // Don't keep the reference! We must clone the CSSStyleDeclaration object, otherwise there will be no performance gain.
        this._cache[key] = this._cloneStyle(value);
        this._size++;
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

    private _cloneStyle(val: CSSStyleDeclaration): CSSStyleDeclaration {
        if (!val) {
            return null;
        }

        let res = {},
            toCamel = (val: string) => val.replace(/\-([a-z])/g, (match: string, group: string, offset: number) => {
                return offset > 0
                    ? group.toUpperCase()
                    : group;
            });

        for (let i = 0, len = val.length; i < len; i++) {
            let name = val[i];
            res[toCamel(name)] = val.getPropertyValue(name);
        }

        return <any>res;
    }
}

export function _blobToBuffer(blob: Blob, callback: (buffer: ArrayBuffer) => void) {
    if (!blob || !callback) {
        return;
    }

    if ((<any>blob).arrayBuffer) {
        (<any>blob).arrayBuffer().then(buffer => callback(buffer));
    } else {
        let fr = new FileReader();
        fr.onload = () => {
            callback(fr.result as ArrayBuffer);
            fr = null;
        };
        fr.readAsArrayBuffer(blob);
    }
}

/*
 * Column Definition for Flex Grid
 */
interface IColumn {
    /*
     * Data Type
     */
    dataType: wijmo.DataType;
    /*
     * Format
     */
    format: string;
    /*
     * Horizontal alignment
     */
    hAlign: string;
    /*
     * Word wrap setting
     */
    wordWrap: boolean;
}
/**
 * Defines additional worksheet properties that can be accesses via the dynamic <b>wj_sheetInfo</b> property
 * of the {@link FlexGrid} instance.
 */
export interface IExtendedSheetInfo {
    /**
     * The sheet name.
     */
    name: string;
    /**
     * Sheet visibility.
     */
    visible: boolean;
    /**
     * Styled cells in the sheet
     */
    styledCells: any;
    /**
     * Merged ranges in the sheet
     */
    mergedRanges: wijmo.grid.CellRange[];
    /**
     * Contains an array of font names used in the sheet.
     */
    fonts: string[];
    /**
     * The tables in this worksheet.
     */
    tables: wijmo.xlsx.WorkbookTable[];
    /**
     * A function that evaluates the formula of cell. 
     */
    evaluateFormula?: Function;
}
/**
 * FlexGrid Xlsx conversion options
 */
export interface IFlexGridXlsxOptions {
    /**
     * The index of the sheet in the workbook.  It indicates to import which sheet.
     */
    sheetIndex?: number; // import only
    /**
     * The name of the sheet.
     * It indicates to import which sheet for importing.  If the sheetIndex and sheetName are both setting, the priority of sheetName is higher than sheetIndex.
     * It sets the name of worksheet for exporting.
     */
    sheetName?: string; //import-export
    /**
     * Export only.
     * Indicates whether the sheet is visible.
     * 
     * **Caveat:** This option must be used with care. In case where you generate an  
     * xlsx file with a single invisible sheet, such a file can't be opened by Excel.
     * The only scenario where this option can be set to false is where you use multiple
     * export actions to assemble a multi-sheet workbook using a custom code.
     * 
     * The default value for this option is true.
     */
    sheetVisible?: boolean; //import-export
    /**
     * Indicates whether to include column headers as first rows in the generated xlsx file.
     */
    includeColumnHeaders?: boolean; //import-export
    /**
     * Indicates whether to include column headers as first rows in the generated xlsx file.
     */
    includeRowHeaders?: boolean; //import-export
    /**
     * Indicates whether cells styling should be included in the generated xlsx file.
     */
    includeCellStyles?: boolean; //export only
    /**
     * Index or name of the active sheet in the xlsx file.
     */
    activeWorksheet?: any; // [[ changed type to 'any'; could be an index or a name ]]; export only
    /**
     * A callback to indicate which columns of FlexGrid need be included or omitted during exporting.
     *
     * For example:
     * <pre>// This sample excludes the 'country' column from export.
     * &nbsp;
     * // JavaScript
     * wijmo.grid.xlsx.FlexGridXlsxConverter.save(grid, {
     *   includeColumns: function(column) {
     *      return column.binding !== 'country';
     *   }
     * }</pre>
     */
    includeColumns?: (column: wijmo.grid.Column) => boolean; //export only
    /**
     * An optional callback which is called for every exported cell and allows to perform transformations
     * of exported cell value and style.
     * The callback is called irrespectively of the 'includeCellStyles' property value.
     * It has a single parameter of the {@link XlsxFormatItemEventArgs} type that
     * provides both information about the source grid cell and an {@link IWorkbookCell} object
     * defining its representation in the exported file, which can be customized in the callback.
     */
    formatItem?: (args: XlsxFormatItemEventArgs) => void; //export only
    /**
     * When turned on, decreases the export time by activating the cell styles caching if {@link IFlexGridXlsxOptions.includeCellStyles} property is enabled.
     * In typical scenarios it allows to decrease the export time by several times.
     *
     * The combination of cell's inline style specific properties, own CSS classes and CSS classes of row containing the cell is used as
     * the cache tag. Before the cell style is calculated, the cache is checked first, and if the style associated with the tag is found there,
     * it's taken from there and doesn't get recalculated.
     *
     * Using this mode can make the export slower when considerable amount of cells have the unique set of CSS classes and inline styles.
     * Also, when pseudo classes like :first-child and :nth-child are used to style the cells and rows, the cell styles can be determined
     * incorrectly.
     *
     * The default value is <b>true</b>.
     */
    quickCellStyles?: boolean; // export only
}

// First index is Panel.cellType, the second index is the column's index in the panel
export type _CellsCache = HTMLDivElement[][];

interface _IBatchContext {
    panels: wijmo.grid.GridPanel[][];
    panelIdx: number;
    globRowIdx: number;
    rowsOffset: number;
    totalRows: number;
}
    }
    


    module wijmo.grid.xlsx {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.xlsx', wijmo.grid.xlsx);


    }
    