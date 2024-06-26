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


    module wijmo.xlsx {
    



'use strict';

/**
 * Represents an Excel workbook. 
 */
export class Workbook implements IWorkbook {
    /**
     * Gets or sets the name of application that generated the file that appears in the file properties.
     */
    public application: string;
    /**
     * Gets or sets the name of company that generated the file that appears in the file properties.
     */
    public company: string;
    /**
     * Gets or sets the creator of the xlsx file.
     */
    public creator: string;
    /**
     * Gets or sets the creation time of the xlsx file.
     */
    public created: Date;
    /**
     * Gets or sets the last modifier of the xlsx file.
     */
    public lastModifiedBy: string;
    /**
     * Gets or sets the last modified time of the xlsx file.
     */
    public modified: Date;
    /**
     * Gets or sets the index of the active sheet in the xlsx file.
     */
    public activeWorksheet: number;

    private _reservedContent: any;
    private _sheets: WorkSheet[];
    private _styles: WorkbookStyle[];
    private _definedNames: DefinedName[];
    private _tableStyles: WorkbookTableStyle[];
    private _colorThemes: string[];
    private static _alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static _formatMap = {
        n: '#,##0{0}',
        c: '{1}#,##0{0}_);({1}#,##0{0})',
        p: '#,##0{0}%',
        f: '0{0}',
        d: '{0}',
        g: '0{0}'
    };

    /**
     * Initializes a new instance of the {@link Workbook} class.
     */
    constructor() {
    }

    /**
     * Gets the WorkSheet array of the workbook.
     */
    get sheets(): WorkSheet[] {
        if (this._sheets == null) {
            this._sheets = [];
        }
        return this._sheets;
    }

    /**
     * Gets the styles table of the workbook.
     */
    get styles(): WorkbookStyle[] {
        if (this._styles == null) {
            this._styles = [];
        }
        return this._styles;
    }

    /**
     * Gets the defined name items of the workbook.
     */
    get definedNames(): DefinedName[] {
        if (this._definedNames == null) {
            this._definedNames = [];
        }
        return this._definedNames;
    }

    /**
     * Gets the color of the workbook themes.
     */
    get colorThemes(): string[] {
        if (this._colorThemes == null) {
            this._colorThemes = [];
        }
        return this._colorThemes;
    }

    /**
     * Gets or sets the reserved content from xlsx file that flexgrid or flexsheet doesn't support yet.
     */
    get reservedContent(): any {
        if (this._reservedContent == null) {
            this._reservedContent = {};
        }
        return this._reservedContent;
    }
    set reservedContent(value: any) {
        this._reservedContent = value;
    }

    /**
     * Saves the book to a file and returns a base-64 string representation of
     * the book.
     * This method works with JSZip version 2.* only.
     *
     * For example, this sample creates an xlsx file with a single cell:
     *
     * <pre>function exportXlsx(fileName) {
     *     var book = new wijmo.xlsx.Workbook(),
     *         sheet = new wijmo.xlsx.WorkSheet(),
     *         bookRow = new wijmo.xlsx.WorkbookRow(),
     *         bookCell = new wijmo.xlsx.WorkbookCell();
     *     bookCell.value = 'Hello, Excel!';
     *     bookRow.cells.push(bookCell);
     *     sheet.rows.push(bookRow);
     *     book.sheets.push(sheet);
     *     book.save(fileName);
     * }</pre>
     *
     * The file name is optional. If not provided, the method still returns
     * a base-64 string representing the book. This string can be used for
     * further processing on the client or on the server.
     *
     * @param fileName Name of the xlsx file to save.
     * @return A base-64 string that represents the content of the file.
     */
    save(fileName?: string): string {
        var result = _xlsx.save(this),
            containMacros = !!(this._reservedContent && this._reservedContent.macros);

        if (fileName) {
            //console.log(`Zip string created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
            //window['xlsxTime'] = Date.now();
            Workbook._saveToFile(result.base64, fileName, containMacros);
        }
        return result.base64;
    }

    private _cs: _ICancellationSource;
    /**
     * Saves the book to a file asynchronously.
     * This method works with JSZip version 3.* only.
     *
     * @param fileName Name of the xlsx file to save.
     * @param onSaved This callback provides an approach to get the base-64 string
     * that represents the content of the saved workbook. Since this method is an
     * asynchronous method, user does not get the base-64 string immediately.
     * User has to get the base-64 string via this callback.
     * This has a single parameter, the base-64 string of the saved workbook.
     * It will be passed to user.
     * @param onError This callback catches error information when saving.
     * This has a single parameter, the failure reason.
     * Return value will be passed to user, if he wants to catch the save failure reason.
     * @param onProgress Callback function that gives feedback about the progress of a task.
     * The function accepts a single argument, the current progress as a number between 0 and 100.
     *
     * For example:
     * <pre>
     * workbook.saveAsync('', function (base64){
     *      // User can access the base64 string in this callback.
     *      document.getElementByID('export').href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' + 'base64,' + base64;
     * }, function (reason){
     *      // User can catch the failure reason in this callback.
     *      console.log('The reason of save failure is ' + reason);
     * });
     * </pre>
     */
    saveAsync(fileName?: string, onSaved?: (base64?: string) => any, onError?: (reason?: any) => any, onProgress?: (value: number) => void) {
        //console.log('Waiting for zip to save file');
        this.cancelAsync(() => {
            this._cs = wijmo.isFunction(this._externalCancellation) ? this._externalCancellation() : new _SyncPromise();

            _xlsx.saveAsync(this, this._cs, onError, onProgress).then(
                (base64: string) => {
                    //console.log(`Zip string created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
                    //window['xlsxTime'] = Date.now();
                    if (fileName) {
                        let containMacros = !!(this._reservedContent && this._reservedContent.macros);
                        Workbook._saveToFile(base64, fileName, containMacros);
                    }

                    this._cs = null;

                    if (wijmo.isFunction(onProgress)) onProgress(100);

                    if (onSaved) {
                        onSaved(base64);
                    }
                },
                () => this._cs = null
            );
        });
    }

    _externalCancellation: () => _ICancellationSource = null;

    /**
     * Cancels the export started by the {@link saveAsync} method.
     * @param done Callback invoked when the method finishes executing.
     */
    cancelAsync(done?: () => void) {
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
     * Loads from ArrayBuffer, base-64 string or data url.
     * This method works with JSZip version 2.* only.
     *
     * For example:
     * <pre>// This sample opens an xlsx file chosen from Open File
     * // dialog and creates a workbook instance to load the file.
     * &nbsp;
     * // HTML
     * &lt;input type="file" 
     *     id="importFile" 
     *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
     * /&gt;
     * &nbsp;
     * // JavaScript
     * var workbook, // receives imported IWorkbook
     *     importFile = document.getElementById('importFile');
     * &nbsp;
     * importFile.addEventListener('change', function () {
     *     loadWorkbook();
     * });
     * &nbsp;
     * function loadWorkbook() {
     *     var reader,
     *         workbook,
     *         file = importFile.files[0];
     *     if (file) {
     *         reader = new FileReader();
     *         reader.onload = function (e) {
     *            workbook = new wijmo.xlsx.Workbook(),
     *            workbook.load(reader.result);
     *         };
     *         reader.readAsDataURL(file);
     *     }
     * }</pre>
     *
     * @param data ArrayBuffer or base-64 string that contains the xlsx file content.
     */
    load(data: string | ArrayBuffer) {
        //var begin = Date.now();
        if (wijmo.isString(data)) {
            data = this._getBase64String(data);
        }
        let workbookOM = _xlsx.load(data);
        //console.log(`Workbook loaded in ${(Date.now() - begin) / 1000} seconds`);
        this._deserialize(workbookOM);
        data = null;
        workbookOM = null;
    }

    /**
     * Loads from ArrayBuffer or base-64 string or data url asynchronously.
     * This method works with JSZip version 3.* only.
     *
     * @param data ArrayBuffer or base-64 string that contains the xlsx file content.
     * @param onLoaded This callback provides an approach to get an instance of the loaded workbook.
     * Since this method is an asynchronous method, user is not able to get instance of
     * the loaded workbook immediately. User has to get the instance through this callback.
     * This has a single parameter, instance of the loaded workbook. It will be passed to user.
     * @param onError This callback catches error information when loading.
     * This has a single parameter, the failure reason. Return value is
     * be passed to user, if he wants to catch the load failure reason.
     *
     * For example:
     * <pre>
     * workbook.loadAsync(base64, function (workbook) {
     *      // User can access the loaded workbook instance in this callback.
     *      var app = worksheet.application ;
     *      ...
     * }, function (reason) {
     *      // User can catch the failure reason in this callback.
     *      console.log('The reason of load failure is ' + reason);
     * });
     * </pre>
     */
    loadAsync(data: string | ArrayBuffer, onLoaded: (workbook: Workbook) => void, onError?: (reason?: any) => any) {
        //var begin = Date.now();
        if (wijmo.isString(data)) {
            data = this._getBase64String(data);
        }

        _xlsx.loadAsync(data).then((result: IWorkbook) => {
            //console.log(`Workbook loaded in ${(Date.now() - begin) / 1000} seconds`);
            this._deserialize(result);
            data = null;
            result = null;
            onLoaded(this);
        }).catch(onError);
    }

    // Serializes the workbook instance to workbook object model. 
    _serialize(): IWorkbook {
        var workbookOM: IWorkbook = { sheets: [] };

        workbookOM.sheets = this._serializeWorkSheets();
        if (this._styles && this._styles.length > 0) {
            workbookOM.styles = this._serializeWorkbookStyles();
        }
        if (this._reservedContent) {
            workbookOM.reservedContent = this._reservedContent;
        }
        if (this.activeWorksheet != null && !isNaN(this.activeWorksheet) && this.activeWorksheet >= 0) {
            workbookOM.activeWorksheet = this.activeWorksheet;
        }
        if (this.application) {
            workbookOM.application = this.application;
        }
        if (this.company) {
            workbookOM.company = this.company;
        }
        if (this.created != null) {
            workbookOM.created = this.created;
        }
        if (this.creator) {
            workbookOM.creator = this.creator;
        }
        if (this.lastModifiedBy) {
            workbookOM.lastModifiedBy = this.lastModifiedBy;
        }
        if (this.modified != null) {
            workbookOM.modified = this.modified;
        }
        if (this._definedNames && this._definedNames.length > 0) {
            workbookOM.definedNames = this._serializeDefinedNames();
        }
        if (this._colorThemes && this._colorThemes.length > 0) {
            workbookOM.colorThemes = this._colorThemes.slice();
        }
        return workbookOM;
    }

    // Deserializes the workbook object model to workbook instance.
    _deserialize(workbookOM: IWorkbook) {
        this._deserializeWorkSheets(workbookOM.sheets);
        if (workbookOM.styles && workbookOM.styles.length > 0) {
            this._deserializeWorkbookStyles(workbookOM.styles);
        }
        this.activeWorksheet = workbookOM.activeWorksheet;
        this.application = workbookOM.application;
        this.company = workbookOM.company;
        this.created = workbookOM.created;
        this.creator = workbookOM.creator;
        this.lastModifiedBy = workbookOM.lastModifiedBy;
        this.modified = workbookOM.modified;
        this.reservedContent = workbookOM.reservedContent;
        if (workbookOM.definedNames && workbookOM.definedNames.length > 0) {
            this._deserializeDefinedNames(workbookOM.definedNames);
        }
        if (workbookOM.colorThemes && workbookOM.colorThemes.length > 0) {
            this._colorThemes = workbookOM.colorThemes.slice();
        }
    }

    // add worksheet instance into the _sheets array of the workbook.
    _addWorkSheet(workSheet: WorkSheet, sheetIndex?: number) {
        if (this._sheets == null) {
            this._sheets = [];
        }

        if (sheetIndex != null && !isNaN(sheetIndex)) {
            this._sheets[sheetIndex] = workSheet;
        } else {
            this._sheets.push(workSheet);
        }
    }

    // Save the blob object generated by the workbook instance to xlsx file.
    static _saveToFile(base64: string, fileName: string, containMarcos: boolean) {
        var document = window.document; // AlexI
        var suffix: string,
            suffixIndex: number,
            nameSuffix = containMarcos ? 'xlsm' : 'xlsx',
            //nameSuffix = this._reservedContent && this._reservedContent.macros ? 'xlsm' : 'xlsx',
            applicationType = nameSuffix === 'xlsm' ? 'application/vnd.ms-excel.sheet.macroEnabled.12' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            blob: Blob,
            reader: FileReader,
            link: HTMLAnchorElement,
            click: Function;

        suffixIndex = fileName.lastIndexOf('.');
        if (suffixIndex < 0) {
            fileName += '.' + nameSuffix;
        } else if (suffixIndex === 0) {
            throw 'Invalid file name.';
        } else {
            suffix = fileName.substring(suffixIndex + 1);
            if (suffix === '') {
                fileName += '.' + nameSuffix;
            } else if (suffix !== nameSuffix) {
                fileName += '.' + nameSuffix;
            }
        }
        blob = new Blob([_Base64.toArray(base64)], { type: applicationType });
        //console.log(`Blob created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
        //window['xlsxTime'] = Date.now();

        if (navigator.msSaveBlob) {
            // Saving the xlsx file using Blob and msSaveBlob in IE.
            navigator.msSaveBlob(blob, fileName);
            //console.log(`File saved (msSaveBlob) in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
            //window['xlsxTime'] = Date.now();
        } else if (URL.createObjectURL) {
            link = <HTMLAnchorElement>document.createElement('a');
            click = (element: HTMLElement) => {
                var evnt = <MouseEvent>document.createEvent('MouseEvents');
                evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(evnt);
            };
            (<any>link).download = fileName;
            link.href = URL.createObjectURL(blob);
            click(link);
            link = null;
            //console.log(`File saved (createObjectURL) in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
            //window['xlsxTime'] = Date.now();
        } else {
            reader = new FileReader();
            link = <HTMLAnchorElement>document.createElement('a');
            click = (element: HTMLElement) => {
                var evnt = <MouseEvent>document.createEvent('MouseEvents');
                evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(evnt);
            };
            reader.onload = () => {
                (<any>link).download = fileName;
                link.href = <string>reader.result;
                click(link);
                link = null;
            };
            reader.readAsDataURL(blob);
        }
    }

    // Get base64 string.
    private _getBase64String(base64: string): string {
        if (base64 == null || base64.length === 0) {
            throw 'Invalid xlsx file content.';
        }

        let idx = base64.search(/base64,/i);
        if (idx !== -1) {
            return base64.substring(idx + 7);
        }

        return base64;
    }

    /**
     * Converts the wijmo date format to Excel format.
     *
     * @param format The wijmo date format.
     * @return Excel format representation.
     */
    static toXlsxDateFormat(format: string): string {
        var xlsxFormat: string;

        if (format.length === 1) {
            switch (format) {
                case 'r':
                case 'R':
                    return 'ddd, dd MMM yyyy HH:mm:ss &quot;GMT&quot;';
                case 'u':
                    return 'yyyy-MM-dd&quot;T&quot;HH:mm:ss&quot;Z&quot;';
                case 'o':
                case 'O':
                    xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
                    xlsxFormat = xlsxFormat.replace(/f+k/gi, '000');
                    break;
                default:
                    xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
                    break;
            }
        }
        if (!xlsxFormat) {
            xlsxFormat = format;
        }
        xlsxFormat = xlsxFormat.replace(/"/g, '')
            .replace(/tt/, 'AM/PM')
            .replace(/t/, 'A/P')
            .replace(/M+/gi, (str: string) => {
                return str.toLowerCase();
            }).replace(/g+y+/gi, (str: string) => {
                return str.substring(0, str.indexOf('y')) + 'e';
            });
        if (/FY|Q/i.test(xlsxFormat)) {
            return 'General';
        }
        return xlsxFormat;
    }

    /**
     * Converts the wijmo number format to xlsx format.
     *
     * @param format The wijmo number format.
     * @return Excel format representation.
     */
    static toXlsxNumberFormat(format: string): string {
        let wijmoFormat = format ? format.toLowerCase() : '',
            firstFormatChar: string,
            mapFormat: string,
            xlsxFormat: string;

        if (/^[ncpfdg]\d*.*,*$/.test(wijmoFormat)) {
            firstFormatChar = wijmoFormat[0];
            mapFormat = this._formatMap[firstFormatChar];
        }

        if (mapFormat) {
            let commaArray = wijmoFormat.split(',');
            if (firstFormatChar === 'c') {
                let globCur = wijmo.culture.Globalize.numberFormat.currency,
                    m = format ? format.match(/([a-z])(\d*)(,*)(.*)/i) : null,
                    currencySymbol = (m && m[4]) ? m[4] : globCur.symbol;

                if (currencySymbol === '\u200B') {
                    currencySymbol = '';
                }

                // TFS 467457
                // **  Build a culture-specific format instead of using _formatMap['c'].
                let numFmt = this._formatMap['n'],
                    ptrn = globCur.pattern as string[],
                    ngtv = ptrn[0].replace('n', numFmt).replace('$', '{1}'),
                    pstv = ptrn[1].replace('n', numFmt).replace('$', '{1}');

                // If negative values are enclosed in parentheses then add indentation to positive values.
                if (ngtv[ngtv.length - 1] === ')') {
                    pstv += '_)';
                }

                mapFormat = pstv + ';' + ngtv; // Will match this._formatMap['c'] if culture is neutral (en).
                // **

                mapFormat = mapFormat.replace(/\{1\}/g, currencySymbol);
            }

            let dec = -1;

            if (wijmoFormat.length > 1) {
                dec = parseInt(commaArray[0].substr(1));
            } else if (firstFormatChar !== 'd') {
                dec = 2;
            }

            let decimalFmt = '';

            if (!isNaN(dec)) {
                for (let i = 0; i < dec; i++) {
                    decimalFmt += '0';
                }
            }

            for (let i = 0; i < commaArray.length - 1; i++) {
                decimalFmt += ',';
            }

            if (decimalFmt.length > 0) {
                if (firstFormatChar === 'd') {
                    xlsxFormat = mapFormat.replace(/\{0\}/g, decimalFmt);
                } else {
                    xlsxFormat = mapFormat.replace(/\{0\}/g, (!isNaN(dec) && dec > 0 ? '.' : '') + decimalFmt);
                }
            } else {
                if (firstFormatChar === 'd') {
                    xlsxFormat = mapFormat.replace(/\{0\}/g, '0');
                } else {
                    xlsxFormat = mapFormat.replace(/\{0\}/g, '');
                }
            }
        } else {
            xlsxFormat = wijmoFormat;
        }

        return xlsxFormat;
    }


    /**
     * Converts the xlsx multi-section format string to an array of corresponding wijmo formats.
     *
     * @param xlsxFormat The Excel format string, that may contain multiple format sections
     * separated by a semicolon.
     * @return An array of .Net format strings where each element corresponds to a separate
     * Excel format section.
     * The returning array always contains at least one element. It can be an empty string
     * in case the passed Excel format is empty.
     */
    static fromXlsxFormat(xlsxFormat: string): string[] {
        var wijmoFormats: string[] = [],
            wijmoFormat: string,
            formats: string[],
            currentFormat: string,
            i: number,
            j: number,
            lastDotIndex: number,
            lastZeroIndex: number,
            lastCommaIndex: number,
            commaArray: string[],
            currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol;

        if (!xlsxFormat || xlsxFormat === 'General') {
            return [''];
        }

        xlsxFormat = xlsxFormat.replace(/;@/g, '')
            .replace(/&quot;?/g, '');
        formats = xlsxFormat.split(';');

        for (i = 0; i < formats.length; i++) {
            currentFormat = formats[i];

            if (/[hsmy\:]/i.test(currentFormat)) {
                wijmoFormat = this._fromXlsxDateFormat(currentFormat);
            } else {
                lastDotIndex = currentFormat.lastIndexOf('.');
                lastZeroIndex = currentFormat.lastIndexOf('0');
                lastCommaIndex = currentFormat.lastIndexOf(',');
                if (currentFormat.search(/\[\$([^\-\]]+)[^\]]*\]/) > -1 || // Foreign Currency
                    (currentFormat.indexOf(currencySymbol) > -1 && currentFormat.search(/\[\$([\-\]]+)[^\]]*\]/) === -1)) {
                    wijmoFormat = 'c';
                } else if (currentFormat[xlsxFormat.length - 1] === '%') {
                    wijmoFormat = 'p';
                } else {
                    wijmoFormat = 'n';
                }

                if (lastDotIndex > -1 && lastDotIndex < lastZeroIndex) {
                    wijmoFormat += currentFormat.substring(lastDotIndex, lastZeroIndex).length;
                } else {
                    wijmoFormat += '0';
                }

                if (/^0+,*$/.test(currentFormat)) {
                    lastZeroIndex = currentFormat.lastIndexOf('0');
                    wijmoFormat = 'd' + (lastZeroIndex + 1);
                }

                if (lastCommaIndex > -1 && lastZeroIndex > -1 && lastZeroIndex < lastCommaIndex) {
                    commaArray = currentFormat.substring(lastZeroIndex + 1, lastCommaIndex + 1).split('');
                    for (j = 0; j < commaArray.length; j++) {
                        wijmoFormat += ',';
                    }
                }
            }

            wijmoFormats.push(wijmoFormat);
        }

        return wijmoFormats;
    }

    static _fromXlsxDateFormat(format: string) {
        return format.replace(/\[\$\-.+\]/g, '')
            .replace(/(\\)(.)/g, '$2')
            .replace(/H+/g, (str: string) => {
                return str.toLowerCase();
            }).replace(/m+/g, (str: string) => {
                return str.toUpperCase();
            }).replace(/S+/g, (str: string) => {
                return str.toLowerCase();
            }).replace(/AM\/PM/gi, 'tt')
            .replace(/A\/P/gi, 't')
            .replace(/\.000/g, '.fff')
            .replace(/\.00/g, '.ff')
            .replace(/\.0/g, '.f')
            .replace(/\\[\-\s,]/g, (str: string) => {
                return str.substring(1);
            }).replace(/Y+/g, (str: string) => {
                return str.toLowerCase();
            }).replace(/D+/g, (str: string) => {
                return str.toLowerCase();
            }).replace(/M+:?|:?M+/gi, (str: string) => {
                if (str.indexOf(':') > -1) {
                    return str.toLowerCase();
                } else {
                    return str;
                }
            }).replace(/g+e/gi, (str: string) => {
                return str.substring(0, str.length - 1) + 'yy';
            });
    }


    // Parse the cell format of flex grid to excel format.
    static _parseCellFormat(format: string, isDate: boolean): string {
        if (isDate) {
            return this.toXlsxDateFormat(format);
        }

        return this.toXlsxNumberFormat(format);
    }

    // parse the basic excel format to js format
    static _parseExcelFormat(item: IWorkbookCell): string {
        if (item == null) {
            return undefined;
        }

        var formatCode = item && item.style && item.style.format,
            format = '';

        if ((item.value == null && !formatCode) || isNaN(item.value)) {
            return undefined;
        } else {
            var isNum = wijmo.isNumber(item.value);

            if (isNum && (!formatCode || formatCode === 'General')) {
                format = wijmo.isInt(item.value) ? 'd' : 'f2';
            } else {
                if (item.isDate || wijmo.isDate(item.value) || isNum || item.value === '' || item.isNumber) {
                    format = this.fromXlsxFormat(formatCode)[0];
                } else {
                    format = formatCode;
                }
            }
        }

        return format;
    }

    /**
     * Converts zero-based cell, row or column index to Excel alphanumeric representation.
     *
     * @param row The zero-based row index or a null value if only column index
     * is to be converted.
     * @param col The zero-based column index or a null value if only row index
     * is to be converted.
     * @param absolute True value indicates that absolute indices is to be returned
     * for both, row and column (like $D$7). The <b>absoluteCol</b> parameter allows
     * to redefine this value for the column index.
     * @param absoluteCol True value indicates that column index is absolute.
     * @param isWholeRow Indicates whether the Cell reference is whole row, whole column or specific cell range.
     * If isWholeRow is true means the cell reference is whole row.
     * If isWholeRow is false means the cell reference is whole column.
     * If isWholeRow is null means the cell reference is specific cell range.
     * @return The alphanumeric Excel index representation.
    */
    static xlsxAddress(row: number, col: number, absolute?: boolean, absoluteCol?: boolean, isWholeRow?: boolean): string {
        var absRow = absolute ? '$' : '',
            absCol = absoluteCol == null ? absRow : (absoluteCol ? '$' : '');
        return isWholeRow === true ? '' : ((isNaN(col) ? '' : absCol + this._numAlpha(col))) + (isWholeRow === false ? '' : (isNaN(row) ? '' : absRow + (row + 1).toString()));
    }

    /**
     * Convert Excel's alphanumeric cell, row or column index to the zero-based
     * row/column indices pair.
     *
     * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based
     * column index and/or numeric 1-based row index, like "D15", "D" or "15". The
     * alphabetic column index can be in lower or upper case.
     * @return The object with <b>row</b> and <b>col</b> properties containing zero-based
     * row and/or column indices.
     * If row or column component is not specified in the alphanumeric index, then
     * corresponding returning property is undefined.
     */
    static tableAddress(xlsxIndex: string): ITableAddress {
        var patt = /^((\$?)([A-Za-z]+))?((\$?)(\d+))?$/,
            m = xlsxIndex && patt.exec(xlsxIndex),
            ret = <ITableAddress>{};

        if (!m) {
            return null;
        }
        if (m[3]) {
            ret.col = this._alphaNum(m[3]);
            ret.absCol = !!m[2];
        }
        if (m[6]) {
            ret.row = +m[6] - 1;
            ret.absRow = !!m[5];
        }
        return ret;
    }

    // Parse the horizontal alignment enum to string.
    static _parseHAlignToString(hAlign: HAlign): string {
        switch (hAlign) {
            case HAlign.Left:
                return 'left';
            case HAlign.Center:
                return 'center';
            case HAlign.Right:
                return 'right';
            case HAlign.Justify:
                return 'justify';
            default:
                return 'general';
        }
    }

    // Parse the horizontal alignment string to enum.
    static _parseStringToHAlign(hAlign: string): HAlign {
        var strAlign = hAlign ? hAlign.toLowerCase() : '';

        if (strAlign === 'left') {
            return HAlign.Left;
        }
        if (strAlign === 'center') {
            return HAlign.Center;
        }
        if (strAlign === 'right') {
            return HAlign.Right;
        }

        if (strAlign === 'justify') {
            return HAlign.Justify;
        }

        return HAlign.General;
    }

    // Parse the vartical alignment enum to string.
    static _parseVAlignToString(vAlign: VAlign): string {
        switch (vAlign) {
            case VAlign.Bottom:
                return 'bottom';
            case VAlign.Center:
                return 'center';
            case VAlign.Top:
                return 'top';
            default:
                return null;
        }
    }

    // Parse the vartical alignment string to enum.
    static _parseStringToVAlign(vAlign: string): VAlign {
        var strAlign = vAlign ? vAlign.toLowerCase() : '';

        if (strAlign === 'top') {
            return VAlign.Top;
        }
        if (strAlign === 'center') {
            return VAlign.Center;
        }
        if (strAlign === 'bottom') {
            return VAlign.Bottom;
        }

        return null;
    }

    // Parse the border type enum to string.
    static _parseBorderTypeToString(type: BorderStyle): string {
        switch (type) {
            case BorderStyle.Dashed:
                return 'dashed';
            case BorderStyle.Dotted:
                return 'dotted';
            case BorderStyle.Double:
                return 'double';
            case BorderStyle.Hair:
                return 'hair';
            case BorderStyle.Medium:
                return 'medium';
            case BorderStyle.MediumDashDotDotted:
                return 'mediumDashDotDot';
            case BorderStyle.MediumDashDotted:
                return 'mediumDashDot';
            case BorderStyle.MediumDashed:
                return 'mediumDashed';
            case BorderStyle.SlantedMediumDashDotted:
                return 'slantDashDot';
            case BorderStyle.Thick:
                return 'thick';
            case BorderStyle.Thin:
                return 'thin';
            case BorderStyle.ThinDashDotDotted:
                return 'dashDotDot';
            case BorderStyle.ThinDashDotted:
                return 'dashDot';
            case BorderStyle.None:
            default:
                return 'none';
        }
    }

    // Parse border type string to border type enum.
    static _parseStringToBorderType(type: string): BorderStyle {
        if (type === 'dashed') {
            return BorderStyle.Dashed;
        }
        if (type === 'dotted') {
            return BorderStyle.Dotted;
        }
        if (type === 'double') {
            return BorderStyle.Double;
        }
        if (type === 'hair') {
            return BorderStyle.Hair;
        }
        if (type === 'medium') {
            return BorderStyle.Medium;
        }
        if (type === 'mediumDashDotDot') {
            return BorderStyle.MediumDashDotDotted;
        }
        if (type === 'mediumDashDot') {
            return BorderStyle.MediumDashDotted;
        }
        if (type === 'mediumDashed') {
            return BorderStyle.MediumDashed;
        }
        if (type === 'slantDashDot') {
            return BorderStyle.SlantedMediumDashDotted;
        }
        if (type === 'thick') {
            return BorderStyle.Thick;
        }
        if (type === 'thin') {
            return BorderStyle.Thin;
        }
        if (type === 'dashDotDot') {
            return BorderStyle.ThinDashDotDotted;
        }
        if (type === 'dashDot') {
            return BorderStyle.ThinDashDotted;
        }
        return null;
    }

    static _escapeXML(s: any): string {
        return typeof s === 'string' ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
    }
    static _unescapeXML(val: any): string {
        if (typeof val === 'string') {
            return val.indexOf('&') >= 0
                // The replacement of "&amp;" with "&" MUST be the last one: "&amp;lt;" should be converted to "&lt;" not "<" ("&amp;lt;" -> "&lt;" -> "<")
                ? val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'').replace(/&#x2F;/g, '/').replace(/&amp;/g, '&')
                : val;
        }
        return '';
    }

    //TBD: make these functions accessible from c1xlsx.ts and reference them there.

    // Parse the number to alphat
    // For e.g. 5 will be converted to 'E'.
    private static _numAlpha(i: number): string {
        var t = Math.floor(i / 26) - 1;

        return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
    }
    private static _alphaNum(s: string) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            t = 0;

        if (!!s) {
            s = s.toUpperCase();
        }
        if (s.length === 2) {
            t = this._alphaNum(s.charAt(0)) + 1;
        }
        return t * 26 + this._alphabet.indexOf(s.substr(-1));
    }

    // Serializes the array of worksheet instance to the array of worksheet object model. 
    private _serializeWorkSheets(): IWorkSheet[] {
        var sheetOMs = [],
            workSheet: WorkSheet,
            i: number;

        for (i = 0; i < this._sheets.length; i++) {
            workSheet = this._sheets[i];
            if (workSheet) {
                sheetOMs[i] = workSheet._serialize();
            }
        }
        return sheetOMs;
    }

    //Serializes the array of workbookstyle instance to the array of workbookstyle object model.
    private _serializeWorkbookStyles(): IWorkbookStyle[] {
        var styleOMs = [],
            style: WorkbookStyle,
            i: number;

        for (i = 0; i < this._styles.length; i++) {
            style = this._styles[i];
            if (style) {
                styleOMs[i] = style._serialize();
            }
        }
        return styleOMs;
    }

    // Serialize the array of the definedname instance to the array of definedname object model.
    private _serializeDefinedNames(): IDefinedName[] {
        var defindesNameOMs = [],
            defindedName: DefinedName,
            i: number;

        for (i = 0; i < this._definedNames.length; i++) {
            defindedName = this._definedNames[i];
            if (defindedName) {
                defindesNameOMs[i] = defindedName._serialize();
            }
        }
        return defindesNameOMs;
    }

    // Serialize the array of the WorkbookTableStyle instance to the array of WorkbookTableStyle object model.
    private _serializeTableStyles(): IWorkbookTableStyle[] {
        var workbookTableStyleOMs = [],
            workbookTableStyle: WorkbookTableStyle,
            i: number;

        for (i = 0; i < this._tableStyles.length; i++) {
            workbookTableStyle = this._tableStyles[i];
            if (workbookTableStyle) {
                workbookTableStyleOMs[i] = workbookTableStyle._serialize();
            }
        }
        return workbookTableStyleOMs;
    }

    // Deserializes the array of worksheet object model to the array of worksheet instance.
    private _deserializeWorkSheets(workSheets: IWorkSheet[]) {
        var sheet: WorkSheet,
            sheetOM: IWorkSheet,
            i: number;

        this._sheets = [];
        wijmo.assert(workSheets != null, 'workSheets should not be null.');
        for (i = 0; i < workSheets.length; i++) {
            sheetOM = workSheets[i];
            if (sheetOM) {
                sheet = new WorkSheet();
                sheet._deserialize(sheetOM);
                this._sheets[i] = sheet;
            }
        }
    }

    // Deserializes the array of workbookstyle object model to the array of the workbookstyle instance.
    private _deserializeWorkbookStyles(workbookStyles: IWorkbookStyle[]) {
        var style: WorkbookStyle,
            styleOM: IWorkbookStyle,
            i: number;

        this._styles = [];
        for (i = 0; i < workbookStyles.length; i++) {
            styleOM = workbookStyles[i];
            if (styleOM) {
                style = new WorkbookStyle();
                style._deserialize(styleOM);
                this._styles[i] = style;
            }
        }
    }

    // Deserializes the array of definedName object model to the array of the definedName instance.
    private _deserializeDefinedNames(definedNames: IDefinedName[]) {
        var definedName: DefinedName,
            definedNameOM: IDefinedName,
            i: number;

        this._definedNames = [];
        for (i = 0; i < definedNames.length; i++) {
            definedNameOM = definedNames[i];
            if (definedNameOM) {
                definedName = new DefinedName();
                definedName._deserialize(definedNameOM);
                this._definedNames[i] = definedName;
            }
        }
    }

    // Deserializes the array of WorkbookTableStyle object model to the array of the WorkbookTableStyle instance.
    private _deserializeTableStyles(tableStyles: IWorkbookTableStyle[]) {
        var workbookTableStyle: WorkbookTableStyle,
            workbookTableStyleOM: IWorkbookTableStyle,
            i: number;

        this._tableStyles = [];
        for (i = 0; i < tableStyles.length; i++) {
            workbookTableStyleOM = tableStyles[i];
            if (workbookTableStyleOM) {
                workbookTableStyle = new WorkbookTableStyle();
                workbookTableStyle._deserialize(workbookTableStyleOM);
                this._tableStyles[i] = workbookTableStyle;
            }
        }
    }
}

/**
 * Represents the Workbook Object Model sheet definition that includes sheet
 * properties and data.
 * 
 * The sheet cells are stored in row objects and are accessible using JavaScript
 * expressions like <b>sheet.rows[i].cells[j]</b>.
 */
export class WorkSheet implements IWorkSheet {
    /**
     * Gets or sets the sheet name.
     */
    public name: string;
    /**
     *  Gets or sets the {@link WorkbookFrozenPane} settings.
     */
    public frozenPane: WorkbookFrozenPane;
    /**
     * Gets or sets a value indicating whether summary rows appear below or
     * above detail rows.
     */
    public summaryBelow: boolean;
    /**
     * Gets or sets the worksheet visibility.
     */
    public visible: boolean;
    /**
     * Gets or sets the row style.
     *
     * The property defines the style for all cells in the worksheet, and
     * can be overridden by the specific cell styles.
     */
    public style: WorkbookStyle;
    private _columns: WorkbookColumn[];
    private _rows: WorkbookRow[];
    private _tables: WorkbookTable[];

    // The rightmost column definition outside the layout dimensions.
    // The name must match _IWorkSheet._extraColumn.
    public _extraColumn: _WorkbookExtraColumn;

    /**
     * Initializes a new instance of the {@link WorkSheet} class.
     */
    constructor() {
    }

    /**
     * Gets or sets an array of sheet columns definitions.
     *
     * Each {@link WorkbookColumn} object in the array describes a column
     * at the corresponding position in xlsx sheet, i.e. the column with index 0
     * corresponds to xlsx sheet column with index A, object with
     * index 1 defines sheet column with index B, and so on. If certain column
     * has no description in xlsx file, then corresponding array element
     * is undefined for both export and import operations.
     * 
     * If {@link WorkbookColumn} object in the array doesn't specify the
     * <b>width</b> property value, then the default column width is applied.
     */
    get columns(): WorkbookColumn[] {
        if (this._columns == null) {
            this._columns = [];
        }
        return this._columns;
    }

    /**
     * Gets an array of sheet rows definition.
     *
     * Each {@link WorkbookRow} object in the array describes a row at the corresponding
     * position in xlsx sheet, i.e. the row with index 0 corresponds to excel sheet
     * row with index 1, object with index 1 defines sheet row with index 2, and so on.
     * If certain row has no properties and data in xlsx file, then corresponding array
     * element is undefined for both export and import operations.
     * 
     * If {@link WorkbookRow} object in the array doesn't specify the <b>height</b> property
     * value, then the default row height is applied.
     */
    get rows(): WorkbookRow[] {
        if (this._rows == null) {
            this._rows = [];
        }
        return this._rows;
    }

    /**
     * Gets the name of tables refered in this worksheet.
     */
    get tables(): WorkbookTable[] {
        if (this._tables == null) {
            this._tables = [];
        }
        return this._tables;
    }

    // Serializes the worksheet instance to worksheet object model.
    _serialize(): IWorkSheet {
        var workSheetOM: _IWorkSheet;

        if (this._checkEmptyWorkSheet()) {
            return null;
        }
        workSheetOM = {};
        if (this.style) {
            workSheetOM.style = this.style._serialize();
        }
        if (this._columns && this._columns.length > 0) {
            workSheetOM.columns = this._serializeWorkbookColumns();
        }
        if (this._rows && this._rows.length > 0) {
            workSheetOM.rows = this._serializeWorkbookRows();
        }
        if (this.frozenPane) {
            workSheetOM.frozenPane = this.frozenPane._serialize();
        }
        if (this.name) {
            workSheetOM.name = this.name;
        }
        if (this.summaryBelow != null) {
            workSheetOM.summaryBelow = this.summaryBelow;
        }
        if (this.visible != null) {
            workSheetOM.visible = this.visible;
        }
        if (this._tables && this._tables.length > 0) {
            workSheetOM.tables = this._serializeTables();
        }
        if (this._extraColumn) {
            workSheetOM._extraColumn = this._extraColumn._serialize();
        }
        return workSheetOM;
    }

    // Deserializes the worksheet object model to worksheet instance.
    _deserialize(workSheetOM: _IWorkSheet) {
        var frozenPane: WorkbookFrozenPane,
            style: WorkbookStyle;

        if (workSheetOM.style) {
            style = new WorkbookStyle();
            style._deserialize(workSheetOM.style);
            this.style = style;
        }
        if (workSheetOM.columns && workSheetOM.columns.length > 0) {
            this._deserializeWorkbookColumns(workSheetOM.columns);
        }
        if (workSheetOM.rows && workSheetOM.rows.length > 0) {
            this._deserializeWorkbookRows(workSheetOM.rows);
        }
        if (workSheetOM.frozenPane) {
            frozenPane = new WorkbookFrozenPane();
            frozenPane._deserialize(workSheetOM.frozenPane);
            this.frozenPane = frozenPane;
        }
        this.name = workSheetOM.name;
        this.summaryBelow = workSheetOM.summaryBelow;
        this.visible = workSheetOM.visible;
        if (workSheetOM.tables && workSheetOM.tables.length > 0) {
            this._deserializeTables(workSheetOM.tables);
        }
        if (workSheetOM._extraColumn) {
            this._extraColumn = new _WorkbookExtraColumn();
            this._extraColumn._deserialize(workSheetOM._extraColumn);
        }
    }

    // Add the workbookcolumn instance into the _columns array.
    _addWorkbookColumn(column: WorkbookColumn, columnIndex?: number) {
        if (this._columns == null) {
            this._columns = [];
        }

        if (columnIndex != null && !isNaN(columnIndex)) {
            this._columns[columnIndex] = column;
        } else {
            this._columns.push(column);
        }
    }

    // Add the workbookrow instance into the _rows array.
    _addWorkbookRow(row: WorkbookRow, rowIndex?: number) {
        if (this._rows == null) {
            this._rows = [];
        }

        if (rowIndex != null && !isNaN(rowIndex)) {
            this._rows[rowIndex] = row;
        } else {
            this._rows.push(row);
        }
    }

    // Serializes the array of the workbookcolumn instance to the array of the workbookcolumn object model.
    private _serializeWorkbookColumns(): IWorkbookColumn[] {
        var columnOMs = [],
            column: WorkbookColumn,
            i: number;

        for (i = 0; i < this._columns.length; i++) {
            column = this._columns[i];
            if (column) {
                columnOMs[i] = column._serialize();
            }
        }
        return columnOMs;
    }

    // Serializes the array of workbookrow instance to the array of the workbookrow object model.
    private _serializeWorkbookRows(): IWorkbookRow[] {
        var rowOMs = [],
            row: WorkbookRow,
            i: number;

        for (i = 0; i < this._rows.length; i++) {
            row = this._rows[i];
            if (row) {
                rowOMs[i] = row._serialize();
            }
        }
        return rowOMs;
    }

    // Serialize the array of the WorkbookTable instance to the array of WorkbookTable object model.
    private _serializeTables(): IWorkbookTable[] {
        var workbookTableOMs = [],
            workbookTable: WorkbookTable,
            i: number;

        for (i = 0; i < this._tables.length; i++) {
            workbookTable = this._tables[i];
            if (workbookTable) {
                workbookTableOMs[i] = workbookTable._serialize();
            }
        }
        return workbookTableOMs;
    }

    // Deserializes the arry of the workbookcolumn object model to the array of the workbookcolumn instance.
    private _deserializeWorkbookColumns(workbookColumns: IWorkbookColumn[]) {
        var columnOM: IWorkbookColumn,
            column: WorkbookColumn,
            i: number;

        this._columns = [];
        for (i = 0; i < workbookColumns.length; i++) {
            columnOM = workbookColumns[i];
            if (columnOM) {
                column = new WorkbookColumn();
                column._deserialize(columnOM);
                this._columns[i] = column;
            }
        }
    }

    // Deserializes the array of the workbookrow object model to the array of the workbookrow instance.
    private _deserializeWorkbookRows(workbookRows: IWorkbookRow[]) {
        var rowOM: IWorkbookRow,
            row: WorkbookRow,
            i: number;

        this._rows = [];
        for (i = 0; i < workbookRows.length; i++) {
            rowOM = workbookRows[i];
            if (rowOM) {
                row = new WorkbookRow();
                row._deserialize(rowOM);
                this._rows[i] = row;
            }
        }
    }

    // Deserializes the array of WorkbookTable object model to the array of the WorkbookTable instance.
    private _deserializeTables(tables: IWorkbookTable[]) {
        var workbookTable: WorkbookTable,
            workbookTableOM: IWorkbookTable,
            i: number;

        this._tables = [];
        for (i = 0; i < tables.length; i++) {
            workbookTableOM = tables[i];
            if (workbookTableOM) {
                workbookTable = new WorkbookTable();
                workbookTable._deserialize(workbookTableOM);
                this._tables[i] = workbookTable;
            }
        }
    }

    // Checks whether the worksheet instance is empty.
    private _checkEmptyWorkSheet(): boolean {
        return this._rows == null && this._columns == null && this.visible == null && this.summaryBelow == null && this.frozenPane == null && this.style == null
            && (this.name == null || this.name === '') && (this._tables == null || this._tables.length == 0);
    }
}

/**
 * Represents the Workbook Object Model column definition.
 */
export class WorkbookColumn implements IWorkbookColumn {
    /**
     * Gets or sets the width of the column in device-independent
     * (1/96th inch) pixels or characters.
     * 
     * The numeric value defines the width in pixels. On import,
     * the widths are always expressed in pixels.
     *
     * The string value which is a number with the 'ch' suffix,
     * for example '10ch', defines the width in characters.
     * It has the same meaning as the column width defined through
     * Excel UI. The width can be specified in characters
     * for the export operations only.
     * 
     * If width is not specified, then the default width is applied.
     */
    public width: any;
    /**
     * Gets or sets the column visibility.
     */
    public visible: boolean;
    /**
     * Gets or sets the column style.
     *
     * The property defines the style for all cells in the column,
     * and can be overridden by the specific cell styles.
     */
    public style: WorkbookStyle;
    /**
     * Gets or sets a value that determines whether the column width 
     * will be automatically increased to fit numeric/date contents 
     * after the user edits a cell.
     */
    public autoWidth: boolean;

    /**
     * Initializes a new instance of the {@link WorkbookColumn} class.
     */
    constructor() {
    }

    // Serializes the workbookcolumn instance to workbookcolumn object model.
    _serialize(): IWorkbookColumn {
        var workbookColumnOM: IWorkbookColumn;

        if (this._checkEmptyWorkbookColumn()) {
            return null;
        }

        workbookColumnOM = {};
        if (this.style) {
            workbookColumnOM.style = this.style._serialize();
        }
        if (this.autoWidth != null) {
            workbookColumnOM.autoWidth = this.autoWidth;
        }
        if (this.width != null) {
            workbookColumnOM.width = this.width;
        }
        if (this.visible != null) {
            workbookColumnOM.visible = this.visible;
        }
        return workbookColumnOM;
    }

    // Deserializes the workbookColummn object model to workbookcolumn instance.
    _deserialize(workbookColumnOM: IWorkbookColumn) {
        var style: WorkbookStyle;

        if (workbookColumnOM.style) {
            style = new WorkbookStyle();
            style._deserialize(workbookColumnOM.style);
            this.style = style;
        }
        this.autoWidth = workbookColumnOM.autoWidth;
        this.visible = workbookColumnOM.visible;
        this.width = workbookColumnOM.width;
    }

    // Checks whether the workbookcolumn instance is empty.
    private _checkEmptyWorkbookColumn() {
        return this.style == null && this.width == null && this.autoWidth == null && this.visible == null;
    }
}

export class _WorkbookExtraColumn extends WorkbookColumn implements _IWorkbookExtraColumn {
    public min: number;
    public max: number;

    constructor() {
        super();
    }

    _serialize(): _IWorkbookExtraColumn {
        var r = super._serialize() as _IWorkbookExtraColumn;
        r.min = this.min;
        r.max = this.max;
        return r;
    }

    _deserialize(workbookColumnOM: _IWorkbookExtraColumn) {
        super._deserialize(workbookColumnOM);
        this.min = workbookColumnOM.min;
        this.max = workbookColumnOM.max;
    }
}

/**
 * Represents the Workbook Object Model row definition.
 */
export class WorkbookRow implements IWorkbookRow {
    /**
     * Gets or sets the row height in device-independent (1/96th inch) pixels.
     * 
     * If height is not specified, then the default height is applied.
     */
    public height: number;
    /**
     * Gets or sets the row visibility.
     */
    public visible: boolean;
    /**
     * Gets or sets the group level of the row.
     */
    public groupLevel: number;
    /**
     * Gets or sets the row style.
     *
     * The property defines the style for all cells in the row,
     * and can be overridden by the specific cell styles.
     */
    public style: WorkbookStyle;
    /**
     * Indicating if the row is in the collapsed outline state.
     */
    public collapsed: boolean;
    private _cells: WorkbookCell[];

    /**
     * Initializes a new instance of the {@link WorkbookRow} class.
     */
    constructor() {
    }

    /**
     * Gets or sets an array of cells in the row.
     *
     * Each {@link WorkbookCell} object in the array describes a cell
     * at the corresponding position in the row, i.e. a cell with
     * index 0 pertains to column with index A, a cell with index 1
     * defines cell pertaining to column with index B, and so on. 
     * If a certain cell has no definition (empty) in xlsx file,
     * then corresponding array element is undefined for both export
     * and import operations.
     */
    get cells(): WorkbookCell[] {
        if (this._cells == null) {
            this._cells = [];
        }
        return this._cells;
    }

    // Serializes the workbookrow instance to workbookrow object model.
    _serialize(): IWorkbookRow {
        var workbookRowOM: IWorkbookRow;

        if (this._checkEmptyWorkbookRow()) {
            return null;
        }

        workbookRowOM = {};
        if (this._cells && this._cells.length > 0) {
            workbookRowOM.cells = this._serializeWorkbookCells();
        }
        if (this.style) {
            workbookRowOM.style = this.style._serialize();
        }
        if (this.collapsed != null) {
            workbookRowOM.collapsed = this.collapsed;
        }
        if (this.groupLevel != null && !isNaN(this.groupLevel)) {
            workbookRowOM.groupLevel = this.groupLevel;
        }
        if (this.height != null && !isNaN(this.height)) {
            workbookRowOM.height = this.height;
        }
        if (this.visible != null) {
            workbookRowOM.visible = this.visible;
        }
        return workbookRowOM;
    }

    // Deserializes the workbookrow object model to workbookrow instance.
    _deserialize(workbookRowOM: IWorkbookRow) {
        var style: WorkbookStyle;

        if (workbookRowOM.cells && workbookRowOM.cells.length > 0) {
            this._deserializeWorkbookCells(workbookRowOM.cells);
        }
        if (workbookRowOM.style) {
            style = new WorkbookStyle();
            style._deserialize(workbookRowOM.style);
            this.style = style;
        }
        this.collapsed = workbookRowOM.collapsed;
        this.groupLevel = workbookRowOM.groupLevel;
        this.height = workbookRowOM.height;
        this.visible = workbookRowOM.visible;
    }

    // Add the workbook cell instance into the _cells array.
    _addWorkbookCell(cell: WorkbookCell, cellIndex?: number) {
        if (this._cells == null) {
            this._cells = [];
        }

        if (cellIndex != null && !isNaN(cellIndex)) {
            this._cells[cellIndex] = cell;
        } else {
            this._cells.push(cell);
        }
    }

    // Serializes the array of the workbookcell instance to workbookcell object model.
    private _serializeWorkbookCells(): IWorkbookCell[] {
        var cellOMs = [],
            cell: WorkbookCell,
            i: number;

        for (i = 0; i < this._cells.length; i++) {
            cell = this._cells[i];
            if (cell) {
                cellOMs[i] = cell._serialize();
            }
        }
        return cellOMs;
    }

    // Deserializes the array of the workbookcell object model to workbookcell instance. 
    private _deserializeWorkbookCells(workbookCells: IWorkbookCell[]) {
        var cellOM: IWorkbookCell,
            cell: WorkbookCell,
            i: number;

        this._cells = [];
        for (i = 0; i < workbookCells.length; i++) {
            cellOM = workbookCells[i];
            if (cellOM) {
                cell = new WorkbookCell();
                cell._deserialize(cellOM);
                this._cells[i] = cell;
            }
        }
    }

    // Checks whether the workbookcell instance is empty.
    private _checkEmptyWorkbookRow(): boolean {
        return this._cells == null && this.style == null && this.collapsed == null && this.visible == null
            && (this.height == null || isNaN(this.height))
            && (this.groupLevel == null || isNaN(this.groupLevel));
    }
}

/**
 * Represents the Workbook Object Model cell definition.
 */
export class WorkbookCell implements IWorkbookCell {
    /**
     * Gets or sets the cell value.
     * 
     * The type of the value can be String, Number, Boolean or Date.
     */
    public value: any;
    /**
     * Indicates whether the cell value is date or not.
     */
    public isDate: boolean;
    /**
     * Indicates whether the cell value is number or not.
     */
    public isNumber: boolean;
    /**
     * Gets or sets the formula of cell.
     */
    public formula: string;
    /**
     * Gets or sets the style of cell.
     */
    public style: WorkbookStyle;
    /**
     * Gets or sets the colSpan setting of cell.
     */
    public colSpan: number;
    /**
     * Gets or sets the rowSpan setting of cell.
     */
    public rowSpan: number;
    /**
     * Gets or sets the hyperlink of cell.
     */
    public link: string;
    /**
     * Gets or sets the text runs represent the rich text of cell.
     */
    public textRuns: WorkbookTextRun[];

    /**
     * Gets or sets the note of the cell.
     */
    public note: WorkbookNote;

    /**
     * Initializes a new instance of the {@link WorkbookCell} class.
     */
    constructor() {
    }

    // Serializes the workbookcell instance to workbookcell object model.
    _serialize(): IWorkbookCell {
        var workbookCellOM: IWorkbookCell;

        if (this._checkEmptyWorkbookCell()) {
            return null;
        }

        workbookCellOM = {};
        if (this.style) {
            workbookCellOM.style = this.style._serialize();
        }
        if (this.value != null) {
            workbookCellOM.value = this.value;
        }
        if (this.formula) {
            workbookCellOM.formula = this.formula;
        }
        if (this.isDate != null) {
            workbookCellOM.isDate = this.isDate;
        }
        if (this.isNumber != null) {
            workbookCellOM.isNumber = this.isNumber;
        }
        if (this.colSpan != null && !isNaN(this.colSpan) && this.colSpan > 1) {
            workbookCellOM.colSpan = this.colSpan;
        }
        if (this.rowSpan != null && !isNaN(this.rowSpan) && this.rowSpan > 1) {
            workbookCellOM.rowSpan = this.rowSpan;
        }
        if (this.link) {
            workbookCellOM.link = this.link;
        }
        workbookCellOM.textRuns = _TextRunsSerializer.serialize(this.textRuns);

        if (this.note) {
            workbookCellOM.note = this.note._serialize();
        }

        return workbookCellOM;
    }

    // Deserializes the workbookcell object model to workbookcell instance.
    _deserialize(workbookCellOM: IWorkbookCell) {
        var style: WorkbookStyle;

        if (workbookCellOM.style) {
            style = new WorkbookStyle();
            style._deserialize(workbookCellOM.style);
            this.style = style;
        }
        this.value = workbookCellOM.value;
        this.formula = workbookCellOM.formula;
        this.isDate = workbookCellOM.isDate;
        this.isNumber = workbookCellOM.isNumber;
        this.colSpan = workbookCellOM.colSpan;
        this.rowSpan = workbookCellOM.rowSpan;
        this.link = workbookCellOM.link;
        this.textRuns = _TextRunsSerializer.deserialize(workbookCellOM.textRuns);
        if (workbookCellOM.note) {
            this.note = new WorkbookNote();
            this.note._deserialize(workbookCellOM.note);
        }
    }

    // Checks whether the workbookcell instance is empty.
    private _checkEmptyWorkbookCell(): boolean {
        return this.style == null && this.value == null && this.isDate == null && this.isNumber == null
            && (this.formula == null || this.formula === '')
            && (this.colSpan == null || isNaN(this.colSpan) || this.colSpan <= 1)
            && (this.rowSpan == null || isNaN(this.rowSpan) || this.rowSpan <= 1)
            && (this.link == null || this.link === '');
    }
}

/**
 * Represents the Workbook Object Model note definition.
 */
export class WorkbookNote implements IWorkbookNote {
    /**
     * Gets or sets the author of the note.
     * The default value is **undefined**.
     */
    author: string;
    /**
     * Gets or sets the text of the note.
     * The default value is **undefined**.
     *
     * Note that on import both this and {@link textRuns} properties are filled and this property contains a plain text version of the {@link textRuns} content.
     * On export {@link textRuns} takes precedence over this property if both are set.
     */
    text: string;
    /**
     * Gets or sets the text runs represent the rich text of the note.
     * The default value is **undefined**.
     *
     * Note that on import both this and {@link text} properties are filled and {@link text} contains a plain text version of the content of this property.
     * On export this property takes precedence over {@link text} if both are set.
     */
    textRuns: WorkbookTextRun[];
    /**
     * Indicates whether the note will be displayed when you open an .xlsx file or whether it will be displayed when your hover over the owner's cell.
     * The default value is **undefined**, which means **true**.
     */
    visible: boolean;

    //autoPositioning: NotePositioning;
    //alignment: WorkbookNoteAlignment;
    //margins: WorkbookNoteMargins;

    /**
     * Gets or sets the offset in the X coordinate relative to bottom-right corner of the cell, in pixels.
     * The default value is **undefined**, which causes to use the default offset, 15 pixels.
     */
    offsetX: number;
    /**
     * Gets or sets the offset in the Y coordinate relative to bottom-right corner of the cell, in pixels.
     * The default value is **undefined**, which causes to use the default offset, 2 pixels if the cell is in the first row, 15 pixels otherwise.
     */
    offsetY: number;
    /**
     * Gets or sets the width of the note, in pixels.
     * The default value is **undefined**, which causes to use the default width, 144 pixels.
     */
    width: number;
    /**
     * Gets or sets the height of the note, in pixels.
     * The default value is **undefined**, which causes to use the default height, 79 pixels.
     */
    height: number;

    /**
     * Initializes a new instance of the {@link WorkbookNote} class.
     */
    constructor() {
    }

    // Serializes the workbookcell instance to workbookcell object model.
    _serialize(): IWorkbookNote {
        if (this.text == null && (!this.textRuns || !this.textRuns.length)) {
            return null;
        }

        let res: IWorkbookNote = {};

        if (this.author != null) {
            res.author = this.author;
        }

        //if (this.autoPositioning != null) {
        //    res.autoPositioning = this.autoPositioning;
        //}

        if (this.text != null) {
            res.text = this.text;
        }

        res.textRuns = _TextRunsSerializer.serialize(this.textRuns)

        if (this.visible != null) {
            res.visible = this.visible;
        }

        if (this.offsetX != null) {
            res.offsetX = this.offsetX;
        }

        if (this.offsetY != null) {
            res.offsetY = this.offsetY;
        }

        if (this.width != null) {
            res.width = this.width;
        }

        if (this.height != null) {
            res.height = this.height;
        }

        //if (this.alignment != null) {
        //    res.alignment = this.alignment._serialize();
        //}

        //if (this.margins != null) {
        //    res.margins = this.margins._serialize();
        //}

        return res;
    }

    _deserialize(om: IWorkbookNote) {
        this.author = om.author;
        this.text = om.text;
        this.textRuns = _TextRunsSerializer.deserialize(om.textRuns);
        this.visible = om.visible;
        //this.autoPositioning = om.autoPositioning;

        this.offsetX = om.offsetX;
        this.offsetY = om.offsetY;
        this.width = om.width;
        this.height = om.height;

        //if (om.alignment) {
        //    this.alignment = new WorkbookNoteAlignment();
        //    this.alignment._deserialize(om.alignment);
        //}

        //if (om.margins) {
        //    this.margins = new WorkbookNoteMargins();
        //    this.margins._deserialize(om.margins);
        //}
    }
}

//export class WorkbookNoteAlignment implements IWorkbookNoteAlignment {
//    hAlign?: HAlign;
//    vAlign?: VAlign;
//    direction?: TextDirection;
//    orientation?: TextOrientation;

//    _deserialize(om: IWorkbookNoteAlignment) {
//        this.hAlign = om.hAlign;
//        this.vAlign = om.vAlign;
//        this.direction = om.direction;
//        this.orientation = om.orientation;
//    }

//    // Serializes the workbookcell instance to workbookcell object model.
//    _serialize(): IWorkbookNoteAlignment {
//        if ((this.hAlign == null && this.vAlign == null && this.direction == null && this.orientation == null)) {
//            return null;
//        }

//        return {
//            hAlign: this.hAlign,
//            vAlign: this.vAlign,
//            direction: this.direction,
//            orientation: this.orientation
//        };
//    }
//}

//export class WorkbookNoteMargins implements IWorkbookNoteMargins {
//    /**
//    * Determines whether margins are set automatically.
//    * The default value for this property is undefined, which means False.
//    */
//    auto?: boolean;

//    /**
//    * Gets or sets the left margin, in pixels.
//    */
//    left?: number;

//    /**
//    * Gets or sets the  top margin, in pixels.
//    */
//    top?: number;

//    /**
//    * Gets or sets the  right margin, in pixels.
//    */
//    right?: number;

//    /**
//    * Gets or sets the  right margin, in pixels.
//    */
//    bottom?: number;

//    _serialize(): IWorkbookNoteMargins {
//        if (this.left == null && this.top == null && this.bottom == null && this.right == null) {
//            return null;
//        }

//        return {
//            auto: this.auto,
//            left: this.left,
//            top: this.top,
//            right: this.right,
//            bottom: this.bottom
//        };
//    }

//    _deserialize(om: IWorkbookNoteMargins) {
//        this.auto = om.auto;
//        this.left = om.left;
//        this.top = om.top;
//        this.right = om.right;
//        this.bottom = om.bottom;
//    }
//}

/**
 * Workbook frozen pane definition
 */
export class WorkbookFrozenPane implements IWorkbookFrozenPane {
    /**
     * Gets or sets the number of frozen rows.
     */
    public rows: number;
    /**
     * Gets or sets the number of frozen columns.
     */
    public columns: number;

    /**
     * Initializes a new instance of the {@link WorkbookFrozenPane} class.
     */
    constructor() {
    }

    // Serializes the workbookfrozenpane instance to the workbookfrozenpane object model.
    _serialize(): IWorkbookFrozenPane {
        if ((this.columns == null || isNaN(this.columns) || this.columns === 0)
            && (this.rows == null || isNaN(this.rows) || this.rows === 0)) {
            return null;
        } else {
            return {
                columns: this.columns,
                rows: this.rows
            };
        }
    }

    // Deserializes the workbookfrozenpane object model to workbookfrozenpane instance.
    _deserialize(workbookFrozenPaneOM: IWorkbookFrozenPane) {
        this.columns = workbookFrozenPaneOM.columns;
        this.rows = workbookFrozenPaneOM.rows;
    }
}

/**
 * Represents the Workbook Object Model style definition used
 * to style Excel cells, columns and rows. 
 */
export class WorkbookStyle implements IWorkbookStyle {
    /**
     * Cell value format, defined using Excel format syntax.
     * 
     * The description of Excel format syntax can be found 
     * <a href="https://docs.microsoft.com/en-us/office/troubleshoot/excel/format-cells-settings" target="_blank">here</a>.
     *
     * You may use the <b>toXlsxNumberFormat</b> and <b>toXlsxDateFormat</b> static
     * functions of the {@link Workbook} class to convert from .Net ({@link Globalize})
     * format to Excel format.
     */
    public format: string;
    /**
     * Defines the base style that this style inherits.
     *
     * This property is applicable for the export operations only.
     * The style gets all the properties defined in the base style, 
     * and can override or augment them by setting its own properties.
     */
    public basedOn: WorkbookStyle;
    /**
     * Gets or sets the font of style.
     */
    public font: WorkbookFont;
    /**
     * Gets or sets the horizontal alignment of text. 
     */
    public hAlign: HAlign;
    /**
     *  Gets or sets the vertical alignment of text.
     */
    public vAlign: VAlign;
    /**
     * Gets or sets the indent setting of style.
     */
    public indent: number;
    /**
     * Gets or sets the background setting.
     */
    public fill: WorkbookFill;
    /**
     * Gets or sets the border setting.
     */
    public borders: WorkbookBorder;
    /**
     * Gets or sets the word wrap setting of row.
     */
    public wordWrap: boolean;

    /**
     * Initializes a new instance of the {@link WorkbookStyle} class.
     */
    constructor() {
    }

    // Serializes the workbookstyle instance to the workbookstyle object model.
    _serialize(): IWorkbookStyle {
        var workbookStyleOM: IWorkbookStyle;

        if (this._checkEmptyWorkbookStyle()) {
            return null;
        }

        workbookStyleOM = {};
        if (this.basedOn) {
            workbookStyleOM.basedOn = this.basedOn._serialize();
        }
        if (this.fill) {
            workbookStyleOM.fill = this.fill._serialize();
        }
        if (this.font) {
            workbookStyleOM.font = this.font._serialize();
        }
        if (this.borders) {
            workbookStyleOM.borders = this.borders._serialize();
        }
        if (this.format) {
            workbookStyleOM.format = this.format;
        }
        if (this.hAlign != null) {
            workbookStyleOM.hAlign = wijmo.asEnum(this.hAlign, HAlign, false);
        }
        if (this.vAlign != null) {
            workbookStyleOM.vAlign = wijmo.asEnum(this.vAlign, VAlign, false);
        }
        if (this.indent != null && !isNaN(this.indent)) {
            workbookStyleOM.indent = this.indent;
        }
        if (!!this.wordWrap) {
            workbookStyleOM.wordWrap = this.wordWrap;
        }
        return workbookStyleOM;
    }

    // Deserializes the workbookstyle object model to workbookstyle instance.
    _deserialize(workbookStyleOM: IWorkbookStyle) {
        var baseStyle: WorkbookStyle,
            fill: WorkbookFill,
            font: WorkbookFont,
            borders: WorkbookBorder;

        if (workbookStyleOM.basedOn) {
            baseStyle = new WorkbookStyle();
            baseStyle._deserialize(workbookStyleOM.basedOn);
            this.basedOn = baseStyle;
        }
        if (workbookStyleOM.fill) {
            fill = new WorkbookFill();
            fill._deserialize(workbookStyleOM.fill);
            this.fill = fill;
        }
        if (workbookStyleOM.font) {
            font = new WorkbookFont();
            font._deserialize(workbookStyleOM.font);
            this.font = font;
        }
        if (workbookStyleOM.borders) {
            borders = new WorkbookBorder();
            borders._deserialize(workbookStyleOM.borders);
            this.borders = borders;
        }
        this.format = workbookStyleOM.format;
        if (workbookStyleOM.hAlign != null) {
            this.hAlign = wijmo.asEnum(workbookStyleOM.hAlign, HAlign, false);
        }
        if (workbookStyleOM.vAlign != null) {
            this.vAlign = wijmo.asEnum(workbookStyleOM.vAlign, VAlign, false);
        }
        if (workbookStyleOM.indent != null && !isNaN(workbookStyleOM.indent)) {
            this.indent = workbookStyleOM.indent;
        }
        if (!!workbookStyleOM.wordWrap) {
            this.wordWrap = workbookStyleOM.wordWrap;
        }
    }

    // Checks whether the workbookstyle instance is empty.
    private _checkEmptyWorkbookStyle(): boolean {
        return this.basedOn == null && this.fill == null
            && this.font == null && this.borders == null
            && (this.format == null || this.format === '')
            && this.hAlign == null && this.vAlign == null
            && this.wordWrap == null;
    }
}

/**
 * Represents the Workbook Object Model font definition. 
 */
export class WorkbookFont implements IWorkbookFont {
    /**
     * Gets or sets the font family name.
     */
    public family: string;
    /**
     * Gets or sets the font size in device-independent (1/96th inch) pixels.
     */
    public size: number;
    /**
     * Indicates whether the current font is bold.
     */
    public bold: boolean;
    /**
     * Indicates whether the current font has the italic style applied.
     */
    public italic: boolean;
    /**
     * Indicates whether the current font is underlined.
     */
    public underline: boolean;
    /**
     * Gets or sets the font color.
     * 
     * For export, the color can be specified in any valid HTML format
     * like 6-character dash notation or rgb/rgba/hsl/hsla functional form. 
     * In case of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character dash
     * notation, for example, "#afbfcf".
     */
    public color: string;

    /**
     * Initializes a new instance of the {@link WorkbookFont} class.
     */
    constructor() {
    }

    //Serializes the workbookfont instance to the workbookfont object model.
    _serialize(): IWorkbookFont {
        var workbookFontOM: IWorkbookFont;

        if (this._checkEmptyWorkbookFont()) {
            return null;
        }

        workbookFontOM = {};
        if (this.bold != null) {
            workbookFontOM.bold = this.bold;
        }
        if (this.italic != null) {
            workbookFontOM.italic = this.italic;
        }
        if (this.underline != null) {
            workbookFontOM.underline = this.underline;
        }
        if (this.color) {
            workbookFontOM.color = this.color;
        }
        if (this.family) {
            workbookFontOM.family = this.family;
        }
        if (this.size != null && !isNaN(this.size)) {
            workbookFontOM.size = this.size;
        }
        return workbookFontOM;
    }

    // Deserializes the workbookfotn object model to the workbookfont instance.
    _deserialize(workbookFontOM: IWorkbookFont) {
        this.bold = workbookFontOM.bold;
        if (workbookFontOM.color != null) {
            this.color = workbookFontOM.color;
        }
        this.family = workbookFontOM.family;
        this.italic = workbookFontOM.italic;
        this.size = workbookFontOM.size;
        this.underline = workbookFontOM.underline;
    }

    // Checks whether the workbookfont instance is empty.
    private _checkEmptyWorkbookFont(): boolean {
        return this.bold == null && this.italic == null && this.underline == null
            && (this.color == null || this.color === '')
            && (this.family == null || this.family === '')
            && (this.size == null || isNaN(this.size));
    }
}

/**
 * Represents the Workbook Object Model background fill definition.
 */
export class WorkbookFill implements IWorkbookFill {
    /**
     * Gets or sets the fill color.
     * 
     * For export, the color can be specified in any valid HTML format
     * like 6-character dash notation or rgb/rgba/hsl/hsla functional form. 
     * In case of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character dash
     * notation, for example, "#afbfcf".
     */
    public color: string;

    /**
     * Initializes a new instance of the {@link WorkbookFill} class.
     */
    constructor() {
    }

    // Serializes the workbookfill instance to the workbookfill object model.
    _serialize(): IWorkbookFill {
        var workbookFillOM: IWorkbookFill;

        if (this.color) {
            return {
                color: this.color
            };
        } else {
            return null;
        }
    }

    // Deserializes the workbookfill object model to workbookfill instance.
    _deserialize(workbookFillOM: IWorkbookFill) {
        if (workbookFillOM.color != null) {
            this.color = workbookFillOM.color;
        }
    }
}

/**
 * Represents the Workbook Object Model border definition.
 */
export class WorkbookBorder implements IWorkbookBorder {
    /**
     * Gets or sets the top border setting.
     */
    public top: WorkbookBorderSetting;
    /**
     * Gets or sets the bottom border setting.
     */
    public bottom: WorkbookBorderSetting;
    /**
     * Gets or sets the left border setting.
     */
    public left: WorkbookBorderSetting;
    /**
     * Gets or sets the right border setting.
     */
    public right: WorkbookBorderSetting;
    /**
     * Gets or sets the diagonal border setting.
     */
    public diagonal: WorkbookBorderSetting;

    /**
     * Initializes a new instance of the {@link WorkbookBorder} class.
     */
    constructor() {
    }

    // Serializes the workbookborder instance to the workbookborder object model.
    _serialize(): IWorkbookBorder {
        var workbookBorderOM: IWorkbookBorder;

        if (this._checkEmptyWorkbookBorder()) {
            return null;
        }
        workbookBorderOM = {};
        if (this.top) {
            workbookBorderOM.top = this.top._serialize();
        }
        if (this.bottom) {
            workbookBorderOM.bottom = this.bottom._serialize();
        }
        if (this.left) {
            workbookBorderOM.left = this.left._serialize();
        }
        if (this.right) {
            workbookBorderOM.right = this.right._serialize();
        }
        if (this.diagonal) {
            workbookBorderOM.diagonal = this.diagonal._serialize();
        }

        return workbookBorderOM;
    }

    // Deserializes the workbookborder object model to workbookborder instance.
    _deserialize(workbookBorderOM: IWorkbookBorder) {
        var top: WorkbookBorderSetting,
            bottom: WorkbookBorderSetting,
            left: WorkbookBorderSetting,
            right: WorkbookBorderSetting,
            diagonal: WorkbookBorderSetting;

        if (workbookBorderOM.top) {
            top = new WorkbookBorderSetting();
            top._deserialize(workbookBorderOM.top);
            this.top = top;
        }
        if (workbookBorderOM.bottom) {
            bottom = new WorkbookBorderSetting();
            bottom._deserialize(workbookBorderOM.bottom);
            this.bottom = bottom;
        }
        if (workbookBorderOM.left) {
            left = new WorkbookBorderSetting();
            left._deserialize(workbookBorderOM.left);
            this.left = left;
        }
        if (workbookBorderOM.right) {
            right = new WorkbookBorderSetting();
            right._deserialize(workbookBorderOM.right);
            this.right = right;
        }
        if (workbookBorderOM.diagonal) {
            diagonal = new WorkbookBorderSetting();
            diagonal._deserialize(workbookBorderOM.diagonal);
            this.diagonal = diagonal;
        }
    }

    // Checks whether the workbookborder instance is empty.
    private _checkEmptyWorkbookBorder(): boolean {
        return this.top == null && this.bottom == null
            && this.left == null && this.right == null && this.diagonal == null;
    }
}

/**
 * Represents the Workbook Object Model background setting definition.
 */
export class WorkbookBorderSetting implements IWorkbookBorderSetting {
    /**
     * Gets or sets the border color.
     *
     * For export, the color can be specified in any valid HTML format
     * like 6-character dash notation or rgb/rgba/hsl/hsla functional form. 
     * In case of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character dash
     * notation, for example, "#afbfcf".
     */
    public color: string;
    /**
     * Gets or sets the border type.
     */
    public style: BorderStyle;

    /**
     * Initializes a new instance of the {@link WorkbookBorderSetting} class.
     */
    constructor() {
    }

    // Serializes the workbookbordersetting instance to the workbookbordersetting object model.
    _serialize(): IWorkbookBorderSetting {
        var workbookBorderSettingOM: IWorkbookBorderSetting;

        if ((this.color == null || this.color === '') && this.style == null) {
            return null;
        }

        workbookBorderSettingOM = {};
        if (this.color) {
            workbookBorderSettingOM.color = this.color;
        }
        if (this.style != null) {
            workbookBorderSettingOM.style = wijmo.asEnum(this.style, BorderStyle, false);
        }

        return workbookBorderSettingOM;
    }

    // Deserializes the workbookbordersetting object model to workbookbordersetting instance.
    _deserialize(workbookBorderSettingOM: IWorkbookBorderSetting) {
        if (workbookBorderSettingOM.color != null || workbookBorderSettingOM.style != null) {
            this.color = workbookBorderSettingOM.color;

            if (workbookBorderSettingOM.style != null) {
                this.style = wijmo.asEnum(workbookBorderSettingOM.style, BorderStyle, false);
            }
        }
    }
}

/**
 * Represents the Workbook Object Model Defined Name item definition.
 */
export class DefinedName implements IDefinedName {
    /**
     * The name of the defined name item.
     */
    public name: string;
    /**
     * The value of the defined name item.
     * The value could be a formula, a string constant or a cell range.
     * For e.g. "Sum(1, 2, 3)", "test" or "sheet1!A1:B2"
     */
    public value: any;
    /**
     * Indicates the defined name item works in which sheet.
     * If omitted, the defined name item works in workbook
     */
    public sheetName: string;

    /**
     * Initializes a new instance of the {@link DefinedName} class.
     */
    constructor() {
    }

    // Serializes the DefinedName instance to the DefinedName object model.
    _serialize(): IDefinedName {
        var definedNameOM: IDefinedName;

        if (this.name == null) {
            return null;
        }

        definedNameOM = {
            name: this.name,
            value: this.value
        };
        if (this.sheetName != null) {
            definedNameOM.sheetName = this.sheetName;
        }

        return definedNameOM;
    }

    // Deserializes the DefinedName object model to DefinedName instance.
    _deserialize(definedNameOM: IDefinedName) {
        this.name = definedNameOM.name;
        this.value = definedNameOM.value;
        this.sheetName = definedNameOM.sheetName;
    }
}

/**
 * Represents the WorkbookTable Object Model background setting definition.
 */
export class WorkbookTable implements IWorkbookTable {
    /**
     * The name of the table.  It is used to reference the table programmatically.
     */
    public name: string;
    /**
     * The range on the relevant sheet that the table occupies expressed using A1 style referencing. i.e. "A1:D4".
     * The reference shall include the totals row if it is shown.
     */
    public range: string;
    /**
     * Indicates whether show the header row for the table.
     */
    public showHeaderRow: boolean;
    /**
     * Indicates whether show the total row for the table.
     */
    public showTotalRow: boolean;
    /**
     * Indicating whether banded column formatting is applied.
     */
    public showBandedColumns: boolean;
    /**
     * The table style to use with the table.
     */
    public style: WorkbookTableStyle;
    /**
     * Indicating whether banded row formatting is applied.
     */
    public showBandedRows: boolean;
    /**
     * Indicating whether the first column in the table should have the style applied.
     */
    public alterFirstColumn: boolean;
    /**
     * Indicating whether the last column in the table should have the style applied.
     */
    public alterLastColumn: boolean;

    private _columns: WorkbookTableColumn[];
    /**
     * The columns of the table.
     */
    get columns(): WorkbookTableColumn[] {
        if (this._columns == null) {
            this._columns = [];
        }
        return this._columns;
    }

    /**
     * Initializes a new instance of the {@link WorkbookTable} class.
     */
    constructor() {
    }

    // Serializes the WorkbookTable instance to the WorkbookTable object model.
    _serialize(): IWorkbookTable {
        var workbookTableOM: IWorkbookTable,
            tableStyle: IWorkbookTableStyle;

        if (this.name == null || this.range == null || this._columns == null) {
            return null;
        }

        if (this.style != null) {
            tableStyle = this.style._serialize();
        }
        workbookTableOM = {
            name: this.name,
            range: this.range,
            showHeaderRow: this.showHeaderRow,
            showTotalRow: this.showTotalRow,
            style: tableStyle,
            showBandedColumns: this.showBandedColumns,
            showBandedRows: this.showBandedRows,
            alterFirstColumn: this.alterFirstColumn,
            alterLastColumn: this.alterLastColumn,
            columns: []
        };
        workbookTableOM.columns = this._serializeTableColumns();

        return workbookTableOM;
    }

    // Deserializes the WorkbookTable object model to WorkbookTable instance.
    _deserialize(workbookTableOM: IWorkbookTable) {
        var tableStyle: WorkbookTableStyle;

        this.name = workbookTableOM.name;
        this.range = workbookTableOM.range;
        this.showHeaderRow = workbookTableOM.showHeaderRow;
        this.showTotalRow = workbookTableOM.showTotalRow;
        if (workbookTableOM.style != null) {
            tableStyle = new WorkbookTableStyle();
            tableStyle._deserialize(workbookTableOM.style);
            this.style = tableStyle;
        }
        this.showBandedColumns = workbookTableOM.showBandedColumns;
        this.showBandedRows = workbookTableOM.showBandedRows;
        this.alterFirstColumn = workbookTableOM.alterFirstColumn;
        this.alterLastColumn = workbookTableOM.alterLastColumn;
        this._deserializeTableColumns(workbookTableOM.columns)
    }

    // Serialize the array of the WorkbookColumn instance to the array of WorkbookColumn object model.
    private _serializeTableColumns(): IWorkbookTableColumn[] {
        var tableColumnOMs = [],
            tableColumn: WorkbookTableColumn,
            i: number;

        for (i = 0; i < this._columns.length; i++) {
            tableColumn = this._columns[i];
            if (tableColumn) {
                tableColumnOMs[i] = tableColumn._serialize();
            }
        }
        return tableColumnOMs;
    }

    // Deserialize the array of WorkbookColumn object model to the array of the WorkbookColumn instance.
    private _deserializeTableColumns(tableColumnOMs: IWorkbookTableColumn[]) {
        var tableColumn: WorkbookTableColumn,
            tableColumnOM: IWorkbookTableColumn,
            i: number;

        wijmo.assert(tableColumnOMs != null, 'table Columns should not be null.');
        this._columns = [];
        for (i = 0; i < tableColumnOMs.length; i++) {
            tableColumnOM = tableColumnOMs[i];
            if (tableColumnOM) {
                tableColumn = new WorkbookTableColumn();
                tableColumn._deserialize(tableColumnOM);
                this._columns[i] = tableColumn;
            }
        }
    }
}

/**
 * Represents the WorkbookTableColumn Object Model background setting definition.
 */
export class WorkbookTableColumn implements IWorkbookTableColumn {
    /**
     * The name of the table column. It is referenced through functions.
     */
    public name: string;
    /**
     * The string to show in the totals row cell for the column.
     */
    public totalRowLabel: string;
    /**
     * The function to show in the totals row cell for this column.
     */
    public totalRowFunction: string;
    /**
     * Indicating whether show filter button for the column.
     */
    public showFilterButton: boolean;

    /**
     * Initializes a new instance of the {@link WorkbookTableColumn} class.
     */
    constructor() {
    }

    // Serializes the WorkbookTableColumn instance to the WorkbookTableColumn object model.
    _serialize(): IWorkbookTableColumn {
        var workbookTableColumnOM: IWorkbookTableColumn;

        if (this.name == null) {
            return null;
        }

        workbookTableColumnOM = {
            name: this.name,
            totalRowLabel: this.totalRowLabel,
            totalRowFunction: this.totalRowFunction,
            showFilterButton: this.showFilterButton
        };

        return workbookTableColumnOM;
    }

    // Deserializes the WorkbookTableColumn object model to WorkbookTableColumn instance.
    _deserialize(workbookTableColumnOM: IWorkbookTableColumn) {
        this.name = workbookTableColumnOM.name;
        this.totalRowLabel = workbookTableColumnOM.totalRowLabel;
        this.totalRowFunction = workbookTableColumnOM.totalRowFunction;
        this.showFilterButton = workbookTableColumnOM.showFilterButton;
    }
}

/**
 * Represents the WorkbookTableStyle Object Model background setting definition.
 */
export class WorkbookTableStyle implements IWorkbookTableStyle {
    /**
     * The name of the table style.
     */
    public name: string;
    /**
     * The whole table style.
     */
    public wholeTableStyle: WorkbookTableCommonStyle;
    /**
     * The first column stripe style.
     */
    public firstBandedColumnStyle: WorkbookTableBandedStyle;
    /**
     * The second column stripe style.
     */
    public secondBandedColumnStyle: WorkbookTableBandedStyle;
    /**
     * The first row stripe style.
     */
    public firstBandedRowStyle: WorkbookTableBandedStyle;
    /**
     * The second row stripe style.
     */
    public secondBandedRowStyle: WorkbookTableBandedStyle;
    /**
     * The first column style.
     */
    public firstColumnStyle: WorkbookTableCommonStyle;
    /**
     * The last column style.
     */
    public lastColumnStyle: WorkbookTableCommonStyle;
    /**
     * The header row style.
     */
    public headerRowStyle: WorkbookTableCommonStyle;
    /**
     * The total row style.
     */
    public totalRowStyle: WorkbookTableCommonStyle;
    /**
     * The first cell style in the header row.
     */
    public firstHeaderCellStyle: WorkbookTableCommonStyle;
    /**
     * The last cell style in the header row.
     */
    public lastHeaderCellStyle: WorkbookTableCommonStyle;
    /**
     * The first cell style in the total row.
     */
    public firstTotalCellStyle: WorkbookTableCommonStyle;
    /**
     * The last cell style in the total row.
     */
    public lastTotalCellStyle: WorkbookTableCommonStyle;

    /**
     * Initializes a new instance of the {@link WorkbookTableStyle} class.
     */
    constructor() {
    }

    // Serializes the WorkbookTableStyle instance to the WorkbookTableStyle object model.
    _serialize(): IWorkbookTableStyle {
        var workbookTableStyleOM: IWorkbookTableStyle;

        if (this._checkEmptyWorkbookTableStyle()) {
            return null;
        }

        workbookTableStyleOM = { name: this.name };
        if (this.wholeTableStyle) {
            workbookTableStyleOM.wholeTableStyle = this.wholeTableStyle._serialize();
        }
        if (this.firstBandedColumnStyle) {
            workbookTableStyleOM.firstBandedColumnStyle = this.firstBandedColumnStyle._serialize();
        }
        if (this.firstBandedRowStyle) {
            workbookTableStyleOM.firstBandedRowStyle = this.firstBandedRowStyle._serialize();
        }
        if (this.secondBandedColumnStyle) {
            workbookTableStyleOM.secondBandedColumnStyle = this.secondBandedColumnStyle._serialize();
        }
        if (this.secondBandedRowStyle) {
            workbookTableStyleOM.secondBandedRowStyle = this.secondBandedRowStyle._serialize();
        }
        if (this.headerRowStyle) {
            workbookTableStyleOM.headerRowStyle = this.headerRowStyle._serialize();
        }
        if (this.totalRowStyle) {
            workbookTableStyleOM.totalRowStyle = this.totalRowStyle._serialize();
        }
        if (this.firstColumnStyle) {
            workbookTableStyleOM.firstColumnStyle = this.firstColumnStyle._serialize();
        }
        if (this.lastColumnStyle) {
            workbookTableStyleOM.lastColumnStyle = this.lastColumnStyle._serialize();
        }
        if (this.firstHeaderCellStyle) {
            workbookTableStyleOM.firstHeaderCellStyle = this.firstHeaderCellStyle._serialize();
        }
        if (this.lastHeaderCellStyle) {
            workbookTableStyleOM.lastHeaderCellStyle = this.lastHeaderCellStyle._serialize();
        }
        if (this.firstTotalCellStyle) {
            workbookTableStyleOM.firstTotalCellStyle = this.firstTotalCellStyle._serialize();
        }
        if (this.lastTotalCellStyle) {
            workbookTableStyleOM.lastTotalCellStyle = this.lastTotalCellStyle._serialize();
        }
        return workbookTableStyleOM;
    }

    // Deserializes the WorkbookTableStyle object model to WorkbookTableStyle instance.
    _deserialize(workbookTableStyleOM: IWorkbookTableStyle) {
        this.name = workbookTableStyleOM.name;
        if (workbookTableStyleOM.wholeTableStyle) {
            this.wholeTableStyle = new WorkbookTableCommonStyle();
            this.wholeTableStyle._deserialize(workbookTableStyleOM.wholeTableStyle);
        }
        if (workbookTableStyleOM.firstBandedColumnStyle) {
            this.firstBandedColumnStyle = new WorkbookTableBandedStyle();
            this.firstBandedColumnStyle._deserialize(workbookTableStyleOM.firstBandedColumnStyle);
        }
        if (workbookTableStyleOM.firstBandedRowStyle) {
            this.firstBandedRowStyle = new WorkbookTableBandedStyle();
            this.firstBandedRowStyle._deserialize(workbookTableStyleOM.firstBandedRowStyle);
        }
        if (workbookTableStyleOM.secondBandedColumnStyle) {
            this.secondBandedColumnStyle = new WorkbookTableBandedStyle();
            this.secondBandedColumnStyle._deserialize(workbookTableStyleOM.secondBandedColumnStyle);
        }
        if (workbookTableStyleOM.secondBandedRowStyle) {
            this.secondBandedRowStyle = new WorkbookTableBandedStyle();
            this.secondBandedRowStyle._deserialize(workbookTableStyleOM.secondBandedRowStyle);
        }
        if (workbookTableStyleOM.headerRowStyle) {
            this.headerRowStyle = new WorkbookTableCommonStyle();
            this.headerRowStyle._deserialize(workbookTableStyleOM.headerRowStyle);
        }
        if (workbookTableStyleOM.totalRowStyle) {
            this.totalRowStyle = new WorkbookTableCommonStyle();
            this.totalRowStyle._deserialize(workbookTableStyleOM.totalRowStyle);
        }
        if (workbookTableStyleOM.firstColumnStyle) {
            this.firstColumnStyle = new WorkbookTableCommonStyle();
            this.firstColumnStyle._deserialize(workbookTableStyleOM.firstColumnStyle);
        }
        if (workbookTableStyleOM.lastColumnStyle) {
            this.lastColumnStyle = new WorkbookTableCommonStyle();
            this.lastColumnStyle._deserialize(workbookTableStyleOM.lastColumnStyle);
        }
        if (workbookTableStyleOM.firstHeaderCellStyle) {
            this.firstHeaderCellStyle = new WorkbookTableCommonStyle();
            this.firstHeaderCellStyle._deserialize(workbookTableStyleOM.firstHeaderCellStyle);
        }
        if (workbookTableStyleOM.lastHeaderCellStyle) {
            this.lastHeaderCellStyle = new WorkbookTableCommonStyle();
            this.lastHeaderCellStyle._deserialize(workbookTableStyleOM.lastHeaderCellStyle);
        }
        if (workbookTableStyleOM.firstTotalCellStyle) {
            this.firstTotalCellStyle = new WorkbookTableCommonStyle();
            this.firstTotalCellStyle._deserialize(workbookTableStyleOM.firstTotalCellStyle);
        }
        if (workbookTableStyleOM.lastTotalCellStyle) {
            this.lastTotalCellStyle = new WorkbookTableCommonStyle();
            this.lastTotalCellStyle._deserialize(workbookTableStyleOM.lastTotalCellStyle);
        }
    }

    // Checks whether the workbookstyle instance is empty.
    private _checkEmptyWorkbookTableStyle(): boolean {
        return this.name == null ||
            (this.wholeTableStyle == null && this.firstBandedColumnStyle == null && this.firstBandedRowStyle == null
                && this.secondBandedColumnStyle == null && this.secondBandedRowStyle == null
                && this.headerRowStyle == null && this.totalRowStyle == null
                && this.firstColumnStyle == null && this.lastColumnStyle == null
                && this.firstHeaderCellStyle == null && this.lastHeaderCellStyle == null
                && this.firstTotalCellStyle == null && this.lastTotalCellStyle == null);
    }
}

/**
 * Represents the WorkbookTableCommonStyle Object Model background setting definition.
 */
export class WorkbookTableCommonStyle extends WorkbookStyle implements IWorkbookTableCommonStyle {
    /**
     * Table borders setting.
     */
    public borders: WorkbookTableBorder;

    /**
     * Initializes a new instance of the {@link WorkbookTableCommonStyle} class.
     */
    constructor() {
        super();
    }

    // Deserializes the WorkbookTableCommonStyle object model to WorkbookTableCommonStyle instance.
    _deserialize(workbookTableCommonStyleOM: IWorkbookTableCommonStyle) {
        var borders: WorkbookTableBorder;

        super._deserialize(workbookTableCommonStyleOM);

        if (workbookTableCommonStyleOM.borders) {
            borders = new WorkbookTableBorder();
            borders._deserialize(workbookTableCommonStyleOM.borders);
            this.borders = borders;
        }
    }
}

/**
 * Represents the WorkbookTableBandedStyle Object Model background setting definition.
 */
export class WorkbookTableBandedStyle extends WorkbookTableCommonStyle implements IWorkbookTableBandedStyle {
    /**
     * Number of rows or columns in a single band of striping.
     */
    public size: number;

    /**
     * Initializes a new instance of the {@link WorkbookTableBandedStyle} class.
     */
    constructor() {
        super();
    }

    // Serializes the IWorkbookTableBandedStyle instance to the IWorkbookTableBandedStyle object model.
    _serialize(): IWorkbookTableBandedStyle {
        var workbookTableBandedStyleOM: IWorkbookTableBandedStyle;

        workbookTableBandedStyleOM = super._serialize();
        workbookTableBandedStyleOM.size = this.size;

        return workbookTableBandedStyleOM;
    }

    // Deserializes the IWorkbookTableBandedStyle object model to IWorkbookTableBandedStyle instance.
    _deserialize(workbookTableBandedStyleOM: IWorkbookTableBandedStyle) {
        super._deserialize(workbookTableBandedStyleOM);
        if (workbookTableBandedStyleOM.size != null) {
            this.size = workbookTableBandedStyleOM.size;
        }
    }
}

/**
 * Represents the Workbook Object Model table border definition.
 */
export class WorkbookTableBorder extends WorkbookBorder implements IWorkbookTableBorder {
    /**
     * Vertical border setting.
     */
    public vertical: WorkbookBorderSetting;
    /**
     * Horizontal border setting.
     */
    public horizontal: WorkbookBorderSetting;

    /**
     * Initializes a new instance of the {@link WorkbookTableBorder} class.
     */
    constructor() {
        super();
    }

    // Serializes the WorkbooktableBorder instance to the WorkbooktableBorder object model.
    _serialize(): IWorkbookTableBorder {
        var workbookBorderOM: IWorkbookTableBorder;

        workbookBorderOM = super._serialize();

        if (workbookBorderOM == null && (!this.vertical || !this.horizontal)) {
            workbookBorderOM = {};
        }
        if (this.vertical) {
            workbookBorderOM.vertical = this.vertical._serialize();
        }
        if (this.horizontal) {
            workbookBorderOM.horizontal = this.horizontal._serialize();
        }

        return workbookBorderOM;
    }

    // Deserializes the WorkbooktableBorder object model to WorkbooktableBorder instance.
    _deserialize(workbookBorderOM: IWorkbookTableBorder) {
        var vertical: WorkbookBorderSetting,
            horizontal: WorkbookBorderSetting;

        super._deserialize(workbookBorderOM);


        if (workbookBorderOM.vertical) {
            vertical = new WorkbookBorderSetting();
            vertical._deserialize(workbookBorderOM.vertical);
            this.vertical = vertical;
        }
        if (workbookBorderOM.horizontal) {
            horizontal = new WorkbookBorderSetting();
            horizontal._deserialize(workbookBorderOM.horizontal);
            this.horizontal = horizontal;
        }
    }
}

/**
 * Represents the Workbook Object Model text run definition. 
 */
export class WorkbookTextRun implements IWorkbookTextRun {
    /**
     * Gets or sets the font of the text run.
     */
    public font: WorkbookFont;
    /**
     * Gets or sets the text of the text run.
     */
    public text: string;

    /**
     * Initializes a new instance of the {@link WorkbookTextRun} class.
     */
    constructor() {
    }

    // Serializes the WorkboookTextRun instance to the WorkboookTextRun object model.
    _serialize(): IWorkbookTextRun {
        var textRunOM: IWorkbookTextRun = {
            text: this.text
        };

        if (this.font) {
            textRunOM.font = this.font._serialize();
        }
        return textRunOM;
    }

    // Deserializes the WorkboookTextRun object model to WorkboookTextRun instance.
    _deserialize(workbookTextRunOM: IWorkbookTextRun) {
        if (workbookTextRunOM.font) {
            this.font = new WorkbookFont();
            this.font._deserialize(workbookTextRunOM.font);
        }
        this.text = workbookTextRunOM.text;
    }
}

class _Base64 {
    // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
    private static _b64ToUint6(nChr: number): number {
        return nChr > 64 && nChr < 91 ?
            nChr - 65
            : nChr > 96 && nChr < 123 ?
                nChr - 71
                : nChr > 47 && nChr < 58 ?
                    nChr + 4
                    : nChr === 43 ?
                        62
                        : nChr === 47 ?
                            63
                            :
                            0;
    }

    // Decodes a base-64 string to Uint8Array.
    static toArray(base64: string, nBlocksSize?: number): Uint8Array {
        var sB64Enc = base64.replace(/[^A-Za-z0-9\+\/]/g, ""),
            nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
            taBytes = new Uint8Array(nOutLen);

        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    }

    //// taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    ///* Base64 string to array encoding */
    //private static _uint6ToB64(nUint6: number): number {
    //    return nUint6 < 26 ?
    //        nUint6 + 65
    //        : nUint6 < 52 ?
    //            nUint6 + 71
    //            : nUint6 < 62 ?
    //                nUint6 - 4
    //                : nUint6 === 62 ?
    //                    43
    //                    : nUint6 === 63 ?
    //                        47
    //                        :
    //                        65;
    //}

    //// Creates a base-64 string from Uint8Array.
    //static fromArray(arr: Uint8Array): string {
    //    var nMod3 = 2, sB64Enc = "";

    //    for (var nLen = arr.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    //        nMod3 = nIdx % 3;
    //        if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
    //        nUint24 |= arr[nIdx] << (16 >>> nMod3 & 24);
    //        if (nMod3 === 2 || arr.length - nIdx === 1) {
    //            sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
    //            nUint24 = 0;
    //        }
    //    }

    //    return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
    //}
}

class _TextRunsSerializer {
    static deserialize(value: IWorkbookTextRun[]): WorkbookTextRun[] {
        if (!value || !value.length) {
            return null;
        }

        return value.map(v => {
            let tr = new WorkbookTextRun();
            tr._deserialize(v);
            return tr;
        });
    }

    static serialize(value: WorkbookTextRun[]): IWorkbookTextRun[] {
        if (!value || !value.length) {
            return null;
        }

        return value.map(v => v._serialize());
    }
}



/*
 * The exported Xlsx file content definition.
 */
export interface IXlsxFileContent {
    /*
     * base64 string for the exported result. 
     */
    base64: string;
    /*
     * Converted int array for base64 string result.
     */
    base64Array: Uint8Array;
    /*
     * Download link for the exported result.
     */
    href: Function;
}

/**
 * Represents the Workbook Object Model sheet definition that 
 * includes sheet properties and data.
 * 
 * The sheet cells are stored in row objects and are accessible 
 * using JavaScript expressions like <b>sheet.rows[i].cells[j]</b>.
 */
export interface IWorkSheet {
    /**
     * Gets or sets the sheet name.
     */
    name?: string;
    /**
     * Gets or sets an array of sheet columns definitions.
     *
     * Each {@link IWorkbookColumn} object in the array describes a column at the 
     * corresponding position in xlsx sheet, i.e. column with index 0 corresponds
     * to xlsx sheet column with index A, object with index 1 defines sheet column 
     * with index B, and so on. If certain column has no description in xlsx file,
     * then corresponding array element is undefined for both export and import operations.
     * 
     * If {@link IWorkbookColumn} object in the array doesn't specify the <b>width</b> 
     * property value, then the default column width is applied.
     */
    columns?: IWorkbookColumn[];
    /**
     * Gets or sets an array of sheet rows definition.
     *
     * Each {@link IWorkbookRow} object in the array describes a row at the 
     * corresponding position in xlsx sheet, i.e. row with index 0 corresponds
     * to xlsx sheet row with index A, object with index 1 defines sheet row 
     * with index B, and so on. If certain row has no description in xlsx file,
     * then corresponding array element is undefined for both export and import operations.
     * 
     * If {@link IWorkbookRow} object in the array doesn't specify the <b>height</b> 
     * property value, then the default row height is applied.
     */
    rows?: IWorkbookRow[];
    /**
     *  Gets or sets the frozen pane settings.
     */
    frozenPane?: IWorkbookFrozenPane;
    /**
     * Gets or sets a value indicating whether summary rows appear below or above detail rows.
     */
    summaryBelow?: boolean;
    /**
     * Gets or sets the worksheet visibility.
     */
    visible?: boolean;
    /**
     * Gets or sets the sheet style.
     *
     * The property defines the style for all cells in the worksheet, 
     * and can be overridden by the specific cell styles.
     */
    style?: IWorkbookStyle;
    /**
     * Gets the tables in this worksheet.
     */
    tables?: IWorkbookTable[];
}

// Extends IWorkSheet with some internal properties.
export interface _IWorkSheet extends IWorkSheet {
    maxCol?: number;
    maxRow?: number;
    tableRIds?: string[];
    externalLinks?: string[];

    // The rightmost column definition outside the layout dimensions (467873):
    //
    // <dimension ref="B1:C10" />   // "B" to "C"
    //
    // <col min=1 max=1>            // "A"
    // <col min=2 max=3>            // "B" to "C"
    // <col min=4 max=16384>        // "D" to ...
    //
    _extraColumn?: _IWorkbookExtraColumn; // the name must match WorkSheet._extraColumn
}

/**
 * Represents the Workbook Object Model column definition.
 */
export interface IWorkbookColumn {
    /**
     * Gets or sets the width of the column in device-independent (1/96th inch) pixels
     * or characters.
     * 
     * The numeric value defines the width in pixels. On import, the widths are
     * always expressed in pixels.
     *
     * The string value which is a number with the 'ch' suffix, for example '10ch',
     * defines the width in characters. It has the same meaning as the column width
     * defined through Excel UI. The width can be specified in characters
     * for the export operations only.
     * 
     * If width is not specified, then the default width is applied.
     */
    width?: any;
    /**
     * Gets or sets the column visibility.
     */
    visible?: boolean;
    /**
     * Gets or sets the column style.
     *
     * The property defines the style for all cells in the column, 
     * and can be overridden by the specific cell styles.
     */
    style?: IWorkbookStyle;
    /**
     * Gets or sets a value indicating whether the column width is
     * automatically adjusted to fit the content of its cells. 
     */
    autoWidth?: boolean;
}

export interface _IWorkbookExtraColumn extends IWorkbookColumn {
    min?: number;
    max?: number;
}

/**
 * Represents the Workbook Object Model row definition.
 */
export interface IWorkbookRow {
    /**
     * Gets or sets the row height in device-independent (1/96th inch) pixels.
     * 
     * If height is not specified, then the default height is applied.
     */
    height?: number;
    /**
     * Gets or sets the row visibility.
     */
    visible?: boolean;
    /**
     * Gets or sets the group level of the row.
     */
    groupLevel?: number;
    /**
     * Gets or sets the row style.
     *
     * The property defines the style for all cells in the row,
     * and can be overridden by the specific cell styles.
     */
    style?: IWorkbookStyle;
    /**
     * TBD: Indicating if the row is in the collapsed outline state.
     */
    collapsed?: boolean;
    /**
     * Gets or sets an array of cells in the row.
     *
     * Each {@link IWorkbookCell} object in the array describes a cell at 
     * the corresponding position in the row, i.e. cell with index 0
     * pertains to column with index A, cell with index 1 defines 
     * cell pertaining to column with index B, and so on. If a certain cell 
     * has no definition (empty) in xlsx file, then corresponding array 
     * element is undefined for both export and import operations.
     */
    cells?: IWorkbookCell[];
}

/**
 * Represents the Workbook Object Model cell definition.
 */
export interface IWorkbookCell {
    /**
     * Gets or sets the cell value.
     * 
     * The type of the value can be String, Number, Boolean or Date.
     */
    value?: any;
    /**
     * Indicates whether the cell value is date or not.
     */
    isDate?: boolean;
    /**
     * Indicates whether the cell value is number or not.
     */
    isNumber?: boolean;
    /**
     * Cell formula
     */
    formula?: string;
    /**
     * Cell style
     */
    style?: IWorkbookStyle;
    /**
     * Cell colSpan setting
     */
    colSpan?: number;
    /**
     * Cell rowSpan setting
     */
    rowSpan?: number;
    /**
     * The hyperlink of the cell.
     */
    link?: string;
    /**
     * The text runs represent the rich text of cell.
     */
    textRuns?: IWorkbookTextRun[];
    /**
     * Represents the note of the cell.
     */
    note?: IWorkbookNote;
}

/**
 * Represents the Workbook Object Model note definition.
 */
export interface IWorkbookNote {
    /**
     * Gets or sets the author of the note.
     * The default value is **undefined**.
     */
    author?: string;
    /**
     * Gets or sets the text of the note.
     * The default value is **undefined**.
     *
     * Note that on import both this and {@link textRuns} properties are filled and this property contains a plain text version of the {@link textRuns} content.
     * On export {@link textRuns} takes precedence over this property if both are set.
     */
    text?: string;
    /**
     * Gets or sets the text runs represent the rich text of the note.
     * The default value is **undefined**.
     *
     * Note that on import both this and {@link text} properties are filled and {@link text} contains a plain text version of the content of this property.
     * On export this property takes precedence over {@link text} if both are set.
     */
    textRuns?: IWorkbookTextRun[];
    /**
     * Indicates whether the note will be displayed when you open an .xlsx file or whether it will be displayed when your hover over the owner's cell.
     * The default value is **undefined**, which means **true**.
     */
    visible?: boolean;

    //autoPositioning?: NotePositioning;
    //alignment?: IWorkbookNoteAlignment;
    //margins?: IWorkbookNoteMargins; 

    /**
     * Gets or sets the offset in the X coordinate relative to bottom-right corner of the cell, in pixels.
     * The default value is **undefined**, which causes to use the default offset, 15 pixels.
     */
    offsetX?: number;
    /**
     * Gets or sets the offset in the Y coordinate relative to bottom-right corner of the cell, in pixels.
     * The default value is **undefined**, which causes to use the default offset, 2 pixels if the cell is in the first row, 15 pixels otherwise.
     */
    offsetY?: number;
    /**
     * Gets or sets the width of the note, in pixels.
     * The default value is **undefined**, which causes to use the default width, 144 pixels.
     */
    width?: number;
    /**
     * Gets or sets the height of the note, in pixels.
     * The default value is **undefined**, which causes to use the default height, 79 pixels.
     */
    height?: number;

    _col?: number;
    _row?: number;
}

///**
//* Determines the alignment settings for a note.
//*/
//export interface IWorkbookNoteAlignment {
//    hAlign?: HAlign,
//    vAlign?: VAlign,
//    direction?: TextDirection;
//    orientation?: TextOrientation;
//}

//export interface IWorkbookNoteMargins {
//    /**
//    * Determines whether margins are set automatically.
//    * The default value for this property is undefined, which means False.
//    */
//    auto?: boolean;

//    /**
//    * Gets or sets the left margin, in pixels.
//    */
//    left?: number;

//    /**
//    * Gets or sets the  top margin, in pixels.
//    */
//    top?: number;

//    /**
//    * Gets or sets the  right margin, in pixels.
//    */
//    right?: number;

//    /**
//    * Gets or sets the  right margin, in pixels.
//    */
//    bottom?: number;
//}

/**
 * Workbook frozen pane definition
 */
export interface IWorkbookFrozenPane {
    /**
     * Gets or sets the number of frozen rows.
     */
    rows: number;
    /**
     * Gets or sets the number of frozen columns.
     */
    columns: number;
}

/**
 * Represents an Excel Workbook. This interface is the root of the Excel 
 * Workbook Object Model (WOM) which provides a way to define properties
 * and data stored in xlsx file.
 * 
 * To create an xlsx file, create a {@link Workbook} object and populate them
 * with {@link WorkSheet}, {@link WorkbookColumn}, {@link WorkbookRow}, and {@link WorkbookCell}
 * objects.
 *
 * To save xlsx files, use the {@link Workbook.save} method which can save the 
 * book to a file or return it as a base-64 string.
 *
 * To load existing xlsx files, use the {@link Workbook.load} method which will 
 * populate the book.
 */
export interface IWorkbook {
    /**
     * Defines an array of Excel Workbook sheets.
     */
    sheets: IWorkSheet[];
    /**
    * Name of the application that generated the file that appears in the file properties.
    */
    application?: string;
    /**
    * Name of the company that generated the file that appears in the file properties.
    */
    company?: string;
    /**
     * Creator of the xlsx file.
     */
    creator?: string;
    /**
     * Creation time of the xlsx file.
     */
    created?: Date;
    /**
     * Last modifier of the xlsx file.
     */
    lastModifiedBy?: string;
    /**
     * Last modified time of the xlsx file.
     */
    modified?: Date;
    /**
     * Index of the active sheet in the xlsx file.
     */
    activeWorksheet?: number;
    /**
     * Styles table of the workbook.
     */
    styles?: IWorkbookStyle[];
    /**
     * The reserved content for the workbook.
     */
    reservedContent?: any;
    /**
     * The array of the defined name items.
     */
    definedNames?: IDefinedName[];
    /**
     * The color of the workbook themes.
     */
    colorThemes?: string[];
}

/**
 * Represents the Workbook Object Model style definition used to 
 * style Excel cells, columns and rows. 
 */
export interface IWorkbookStyle {
    /**
     * Cell value format, defined using Excel format syntax.
     * 
     * The description of Excel format syntax can be found 
     * <a href="https://support.office.com/en-us/article/create-a-custom-number-format-78f2a361-936b-4c03-8772-09fab54be7f4" target="_blank">here</a>.
     *
     * You may use the <b>toXlsxNumberFormat</b> and <b>toXlsxDateFormat</b> 
     * static functions of the {@link Workbook} class to convert from .Net 
     * ({@link Globalize}) format to Excel format.
     */
    format?: string;
    /**
     * Defines the base style that this style inherits.
     *
     * This property is applicable for export operations only. 
     * The style gets all the properties defined in the base style, 
     * and can override or augment them by setting its own properties.
     */
    basedOn?: IWorkbookStyle;
    /**
     * Gets or sets the font properties.
     */
    font?: IWorkbookFont;
    /**
     * Gets or sets the horizontal alignment of a text. 
     */
    hAlign?: HAlign;
    /**
     *  Gets or sets the vertical alignment of a text.
     */
    vAlign?: VAlign;
    /**
     * Text indent.
     * It is an integer value, where an increment of 1 represents 3 spaces.
     */
    indent?: number;
    /*
     * The rotation angle of text.
     * Text rotation in cells. Expressed in degrees. Values range from 0 to 180. The first letter of the text is considered the center-point of the arc
     * For 0 - 90, the value represents degrees above horizon. 
     * For 91-180 the degrees below the horizon is calculated as: [degrees below horizon] = 90 - textRotation.
     */
    //textRotation?: number;
    /*
     * The direction of text flow.
     */
    //textDirection?: TextDirection;
    /**
     * Cell outline setting.
     */
    borders?: IWorkbookBorder;
    /**
     * Cells background.
     */
    fill?: IWorkbookFill;
    /**
     * Word wrap setting.
     */
    wordWrap?: boolean;
    /*
     * Allow text wrap.
     */
    //wrapText?: boolean;
    /*
     * Allow text shrink to fit cell size.
     */
    //shrinkToFit?: boolean;
    /*
     * Whether to lock the cells.
     */
    //locked?: boolean;
}

/**
 * Represents the Workbook Object Model font definition. 
 */
export interface IWorkbookFont {
    /**
     * Gets or sets the font family name.
     */
    family?: string;
    /**
     * Gets or sets the font size in device-independent (1/96th inch) pixels.
     */
    size?: number;
    /**
     * Gets or sets a value indicating whether this font is bold.
     */
    bold?: boolean;
    /**
     * Gets or sets a value indicating whether this font has the italic style applied.
     */
    italic?: boolean;
    /**
     * Gets or sets a value indicating whether this font is underlined.
     */
    underline?: boolean;
    /*
     * Whether to strike through.
     */
    //strikethrough?: boolean;
    /**
     * Gets or sets the font color.
     * 
     * For export, the color can be specified in any valid HTML format like 
     * 6-character dash notation or rgb/rgba/hsl/hsla functional form. In case
     * of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character 
     * dash notation, for example, "#afbfcf".
     */
    color?: string;
}

/**
 * Workbook cell outline definition.
 */
export interface IWorkbookBorder {
    /**
     * Top border setting.
     */
    top?: IWorkbookBorderSetting;
    /**
     * Bottom border setting.
     */
    bottom?: IWorkbookBorderSetting;
    /**
     * Left border setting.
     */
    left?: IWorkbookBorderSetting;
    /**
     * Right border setting.
     */
    right?: IWorkbookBorderSetting;
    /**
     * Diagonal border setting.
     */
    diagonal?: IWorkbookBorderSetting;
}

/**
 * Border style definition
 */
export interface IWorkbookBorderSetting {
    /**
     * Border color.
     *
     * For export, the color can be specified in any valid HTML format like 
     * 6-character dash notation or rgb/rgba/hsl/hsla functional form. In case
     * of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character 
     * dash notation, for example, "#afbfcf".
     */
    color?: string;
    /**
     * Border type.
     */
    style?: BorderStyle;
}

/**
 * Represents the Workbook Object Model background fill definition.
 */
export interface IWorkbookFill {
    /*
     * Fill pattern.
     */
    //pattern?: FillPattern;
    /**
     * Gets or sets the fill color.
     * 
     * For export, the color can be specified in any valid HTML format like 
     * 6-character dash notation or rgb/rgba/hsl/hsla functional form. In case
     * of rgba/hsla representations, specified alpha channel value 
     * is ignored.
     *
     * For import, a value is always represented in the HTML 6-character 
     * dash notation, for example, "#afbfcf".
     */
    color?: string;
}

// /**
// * Workbook theme color definition
// */
// export interface IWorkbookThemeColor {
// /**
// * The theme index for the theme color.
// */
// themeIndex: number;
// /**
//  * Specifies the tint value applied to the color.
//  */
// tint: number;
//}

/*
 * Defines a cell index with zero-based row and column components, as well as the properties indicating whether
 * the index component is absolute (for example "$D") or relative (for example "D").
 *
 * This interface is deprecated. Please use the {@link ITableAddress} interface instead.
 */
export interface ITableIndex {
    /*
     * A zero-based row index.
     */
    row: number;
    /*
     * A zero-based column index.
     */
    col: number;
    /*
     * Indicates whether the original column index is absolute (for example: "$D")
     * or relative (for example: "D").
     */
    absCol: boolean;
    /*
    * Indicates whether the original row index is absolute (for example: "$15")
    * or relative (for example: "15").
    */
    absRow: boolean;
}

/**
 * Defines a cell index with zero-based row and column components, 
 * as well as the properties indicating whether the index component
 * is absolute (for example: "$D") or relative (for example: "D").
 *
 * It is not related with the WorkbookTable any more.
 * It is a zero-based row/column indices pair that stores the converted Excel's alphanumeric cell.
 */
export interface ITableAddress {
    /**
     * A zero-based row index.
     */
    row: number;
    /**
     * A zero-based column index.
     */
    col: number;
    /**
    * Indicates whether the original column index is absolute (for example: "$D")
    * or relative (for example: "D").
    */
    absCol: boolean;
    /**
    * Indicates whether the original row index is absolute (for example: "$15")
    * or relative (for example: "15").
    */
    absRow: boolean;
}

/**
 * Represents the Defined name definition.
 */
export interface IDefinedName {
    /**
     * The name of the defined name item.
     */
    name: string;
    /**
     * The value of the defined name item.
     * The value could be a formula, a string constant or a cell range.
     * For e.g. "Sum(1, 2, 3)", "test" or "sheet1!A1:B2"
     */
    value: any;
    /**
     * Indicates the defined name item works in which sheet.
     * If omitted, the defined name item works in workbook.
     */
    sheetName?: string;
}

/**
 * Represents the Table definition.
 */
export interface IWorkbookTable {
    /**
     * The name of the table.  It is used to reference the table programmatically.
     */
    name: string;
    /**
     * The range on the relevant sheet that the table occupies expressed using A1 style referencing. i.e. "A1:D4".
     * The reference shall include the totals row if it is shown.
     */
    range: string;
    /**
     * Indicates whether show the header row for the table.
     */
    showHeaderRow: boolean;
    /**
     * Indicates whether show the total row for the table.
     */
    showTotalRow: boolean;
    /**
     * Indicating whether banded column formatting is applied.
     */
    showBandedColumns: boolean;
    /**
     * The table style to use with the table.
     */
    style: IWorkbookTableStyle;
    /**
     * Indicating whether banded row formatting is applied.
     */
    showBandedRows: boolean;
    /**
     * Indicating whether the first column in the table should have the style applied.
     */
    alterFirstColumn: boolean;
    /**
     * Indicating whether the last column in the table should have the style applied.
     */
    alterLastColumn: boolean;
    /**
     * The columns of the table.
     */
    columns: IWorkbookTableColumn[];
}

// Extends IWorkbookTable with some internal properties.
export interface _IWorkbookTable extends IWorkbookTable {
    fileName?: string;
}

/**
 * Represents the Table Column definition.
 */
export interface IWorkbookTableColumn {
    /**
     * The name of the table column. It is referenced through functions.
     */
    name: string;
    /**
     * The string to show in the totals row cell for the column.
     */
    totalRowLabel?: string;
    /**
     * The function to show in the totals row cell for this column.
     */
    totalRowFunction?: string;
    /**
     * Indicating whether show filter button for the column.
     */
    showFilterButton?: boolean;
}

/**
 * Represents the Table Style definition.
 */
export interface IWorkbookTableStyle {
    /**
     * The name of the table style.
     */
    name: string;
    /**
     * The whole table style.
     */
    wholeTableStyle?: IWorkbookTableCommonStyle;
    /**
     * The first column stripe style.
     */
    firstBandedColumnStyle?: IWorkbookTableBandedStyle;
    /**
     * The second column stripe style.
     */
    secondBandedColumnStyle?: IWorkbookTableBandedStyle;
    /**
     * The first row stripe style.
     */
    firstBandedRowStyle?: IWorkbookTableBandedStyle;
    /**
     * The second row stripe style.
     */
    secondBandedRowStyle?: IWorkbookTableBandedStyle;
    /**
     * The first column style.
     */
    firstColumnStyle?: IWorkbookTableCommonStyle;
    /**
     * The last column style.
     */
    lastColumnStyle?: IWorkbookTableCommonStyle;
    /**
     * The header row style.
     */
    headerRowStyle?: IWorkbookTableCommonStyle;
    /**
     * The total row style.
     */
    totalRowStyle?: IWorkbookTableCommonStyle;
    /**
     * The first cell style in the header row.
     */
    firstHeaderCellStyle?: IWorkbookTableCommonStyle;
    /**
     * The last cell style in the header row.
     */
    lastHeaderCellStyle?: IWorkbookTableCommonStyle;
    /**
     * The first cell style in the total row.
     */
    firstTotalCellStyle?: IWorkbookTableCommonStyle;
    /**
     * The last cell style in the total row.
     */
    lastTotalCellStyle?: IWorkbookTableCommonStyle;
}

/**
 * Represents the Table Common Style definition.
 */
export interface IWorkbookTableCommonStyle extends IWorkbookStyle {
    /**
     * Table borders setting.
     */
    borders?: IWorkbookTableBorder;
}

/**
 * Represents the Table Stripe Style definition.
 */
export interface IWorkbookTableBandedStyle extends IWorkbookTableCommonStyle {
    /**
     * Number of rows or columns in a single band of striping.
     */
    size?: number;
}

/**
 * Table border definition.
 */
export interface IWorkbookTableBorder extends IWorkbookBorder {
    /**
     * Vertical border setting.
     */
    vertical?: IWorkbookBorderSetting;
    /**
     * Horizontal border setting.
     */
    horizontal?: IWorkbookBorderSetting;
}

/**
 * Piece of text run for rich text.
 */
export interface IWorkbookTextRun {
    /**
     * The font of the text run.
     */
    font?: IWorkbookFont;
    /**
     * The text of the text run.
     */
    text: string;
}

// https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.horizontalalignmentvalues
/**
 * Defines the Workbook Object Model horizontal text alignment.
 */
export enum HAlign {
    /** Alignment depends on the cell value type. */
    General = 0,
    /** Text is aligned to the left. */
    Left = 1,
    /** Text is centered. */
    Center = 2,
    /** Text is aligned to the right. */
    Right = 3,
    /** Text is replicated to fill the whole cell width. */
    Fill = 4,
    /** Text is justified. */
    Justify = 5

    ///* Center continuous horizontal alignment. */
    //CenterContinuous = 6,
    ///* Distributed horizontal alignment. */
    //Distributed = 7
}

// https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.verticalalignmentvalues
/**
 * Vertical alignment
 */
export enum VAlign {
    /** Top vertical alignment */
    Top = 0,
    /** Center vertical alignment */
    Center = 1,
    /** Bottom vertical alignment */
    Bottom = 2,
    /** Justified vertical alignment */
    Justify = 3

    ///* Distributed vertical alignment. */
    //Distributed = 4
}

/**
* Defines text direction.
*/
export enum TextDirection {
    /**
    * Text direction is context dependent.
    */
    Context = 0,

    /**
    * Text direction is from left to right.
    */
    LeftToRight = 1,

    /**
    * Text direction is from right to left.
    */
    RightToLeft = 2
}

/**
* Defines text orientation.
*/
export enum TextOrientation {
    /**
    * Orientates text horizontally.
    */
    Horizontal = 0,

    /**
    * Orientates text vertically.
    */
    Vertical = 1,

    /**
    * Rotates text 90 degrees counterclockwise.
    */
    RotateUp = 2,

    /**
    * Rotates text 90 degrees clockwise.
    */
    RotateDown = 3
}

///**
//* Determines how note box is changed when underlying rows\columns are moved or resized.
//*/
//export enum NotePositioning {
//    /**
//    * Prevent note box from moving and resizing.
//    */
//    None,
//    /**
//    * Move note box but not resize when underlying rows\columns are moved or resized.
//    */
//    Move,
//    /**
//    * Move and resize note box when underlying rows\columns are moved or resized.
//    */
//    MoveAndSize
//}

///**
// * Fill Pattern 
// */
//export enum FillPattern {
//	/** No fill */
//	None = 0,
//	/** Solid fill */
//	Solid = 1,
//	/** Medium gray fill */
//	Gray50 = 2,
//	/** Dark gray fill */
//	Gray75 = 3,
//	/** Light gray fill */
//	Gray25 = 4,
//	/** Horizontal stripe fill */
//	HorizontalStripe = 5,
//	/** Vertical stripe fill */
//	VerticalStripe = 6,
//	/** Reverse diagonal stripe fill */
//	ReverseDiagonalStripe = 7,
//	/** Diagonal stripe fill */
//	DiagonalStripe = 8,
//	/** Diagonal crosshatch fill */
//	DiagonalCrosshatch = 9,
//	/** Thick diagonal crosshatch fill */
//	ThickDiagonalCrosshatch = 10,
//	/** Thin horizontal stripe fill */
//	ThinHorizontalStripe = 11,
//	/** Thin vertical stripe fill */
//	ThinVerticalStripe = 12,
//	/** Thin reverse diagonal stripe fill */
//	ThinReverseDiagonalStripe = 13,
//	/** Thin diagonal stripe fill */
//	ThinDiagonalStripe = 14,
//	/** Thin horizontal crosshatch fill */
//	ThinHorizontalCrosshatch = 15,
//	/** Thin diagonal crosshatch fill */
//	ThinDiagonalCrosshatch = 16,
//	/** Gray 125 fill */
//	Gray12 = 17,
//	/** Gray 0.0625 fill */
//	Gray06 = 18
//}

/**
 * Border line style
 */
export enum BorderStyle {
    /** No border */
    None = 0,
    /** Thin border */
    Thin = 1,
    /** Medium border */
    Medium = 2,
    /** Dashed border */
    Dashed = 3,
    /** Dotted border */
    Dotted = 4,
    /** Thick line border */
    Thick = 5,
    /** Double line border */
    Double = 6,
    /** Hair line border */
    Hair = 7,
    /** Medium dashed border */
    MediumDashed = 8,
    /** Thin dash dotted border */
    ThinDashDotted = 9,
    /** Medium dash dotted border */
    MediumDashDotted = 10,
    /** Thin dash dot dotted border */
    ThinDashDotDotted = 11,
    /** Medium dash dot dotted border */
    MediumDashDotDotted = 12,
    /** Slanted medium dash dotted border */
    SlantedMediumDashDotted = 13
}
    }
    


    module wijmo.xlsx {
    //---------------------------------------------------------
//
// Change log.
//
// 1.  Add row height / column width support for exporting.
//     We add the height property in the worksheet.row for exporting row height.
//     We add the width property in the worksheet.col for exporting column width.
// 2.  Add row/column visible support for exporting.
//     We add the rowVisible property in the first cell of each row to supporting the row visible feature.
//     We add the visible property in the cells for supporting the column visible feature.
// 3.  Add group header support for exporting/importing.
//     We add the groupLevel property in the cells for exporting group.
//     We read the outlineLevel property of the excel row for importing group.
// 4.  Add indent property for nested group for exporting.
//     We add the indent property in the cells of the group row for exporting the indentation for the nested groups.
// 5.  Modify the excel built-in format 'mm-dd-yy' to 'm/d/yyyy'.
// 6.  Add excel built-in format '$#,##0.00_);($#,##0.00)'.
// 7.  Fix issue that couldn't read rich text content of excel cell.
// 8.  Fix issue that couldn't read the excel cell content processed by the string processing function.
// 9.  Fix issue exporting empty sheet 'dimension ref' property incorrect.
// 10. Add frozen rows and columns supporting for exporting/importing.
//     We add frozenPane property that includes rows and columns sub properties in each worksheet.
// 11. Add 'ca' attribute for the cellFormula element for exporting.
// 12. Add formula supporting for importing.
// 13. escapeXML for the formula of the cell.
// 14. Add font color and fill color processing for exporting.
// 15. Add font and fill color processing for importing.
// 16. Add horizontal alignment processing for importing.
// 17. Add column width and row height processing for importing.
// 18. Update merge cells processing for exporting.
// 19. Add merge cells processing for importing.
// 20. Packed cell styles into the style property of cell for exporting.
// 21. Fixed convert excel date value to JS Date object issue.
// 22. Parse the merge cell info to rowSpan and colSpan property of cell.
// 23. Add row collapsed processing for importing.
// 24. Fixed the getting type of cell issue when there is shared formula in the cell.
// 25. Rename the method name from xlsx to _xlsx.
// 26. Add isDate property for cell to indicated whether the value of the cell is date or not.
// 27. Add parsePixelToCharWidth method and parseCharWidthToPixel method.
// 28. Just get the display string for importing.
// 29. Add inheritance style parsing for exporting.
// 30. Fixed the issue that the string like number pattern won't be exported as string.
// 31. Added parse indexed color processing.
// 32. Added parse theme color processing.
// 33. Added row style supporting.
// 34. Added column style supporting.
// 35. Added check empty object function.
// 36. Added hidden worksheet supporting for importing\exporting.
// 37. Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
// 38. Add vertical alignment processing for exporting.
// 39. Add shared formula importing.
// 40. Add macro importing\exporting.
// 41. Add border style exporting.
// 42. Add processing for worksheet style.
//
//----------------------------------------------------------





// use default import insted of wildcard for commonjs modules
// as babel can incorrectly handle wildcard imports (TFS 462116);




declare var JSZip;



'use strict';

/**
 * NOTE: This function is OBSOLETE and retained for compatibility.
 * It is no longer needed because wijmo.xlsx module loads
 * jszip module automatically. You should only ensure that jszip module is installed in
 * your application.
 * 
 * Defines a reference to JSZip module that will be used by the Wijmo xlsx export modules.
 *
 * This method should be used in npm modules based applications to provide wijmo.xlsx module
 * with a reference to the JSZip module retrieved using the ES6 import statement. For example:
 * <pre>import * as JSZip from 'jszip';
 * import * as wjcXlsx from 'wijmo/wijmo.xlsx';
 * wjcXlsx.useJSZip(JSZip);
 * </pre>
 * 
 * @param jszip Reference to the JSZip constructor function.
 */
export function useJSZip(jszip: any) {
    JSZip = jszip;
}

/*
 * This class provides static <b>load</b> and <b>save</b> methods for loading and saving of the Workbook object model
 * from/to Excel xlsx files.
 */
export class _xlsx {
    private static _alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // The mapping for the indexed colors please refer
    // https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.indexedcolors(v=office.14).aspx
    private static _indexedColors = ['000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
        '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
        '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080',
        '9999FF', '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF',
        '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000', '008080', '0000FF',
        '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99',
        '3366FF', '33CCCC', '99CC00', 'FFCC00', 'FF9900', 'FF6600', '666699', '969696',
        '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333',
        '000000', 'FFFFFF'];
    private static _numFmts = ['General', '0', '0.00', '#,##0', '#,##0.00', , , '$#,##0.00_);($#,##0.00)', , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'm/d/yyyy', 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
        'h:mm', 'h:mm:ss', 'm/d/yy h:mm', , , , , , , , , , , , , , , '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)', , , , , 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'];
    private static _tableColumnFunctions = 'average, count, countNums, max, min, stdDev, sum, var';
    private static _xmlDescription = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    private static _workbookNS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    private static _relationshipsNS = 'http://schemas.openxmlformats.org/package/2006/relationships';
    private static _defaultFontName = 'Calibri';
    private static _defaultFontSize = 11;
    private static _macroEnabled = false;
    private static _sharedStrings: any[];
    static readonly _defaultColorThemes = ['FFFFFF', '000000', 'EEECE1', '1F497D', '4F818D', 'C0504D', '9BBB59', '8064A2', '4BACC6', 'F79646'];
    private static _colorThemes: string[];
    private static _styles: any[];
    private static _sharedFormulas: ISharedFormulaInfo[];
    private static _borders: string[];
    private static _fonts: string[];
    private static _fills: string[];
    private static _contentTypes: string[];
    private static _props: string[];
    private static _xlRels: string[];
    private static _worksheets: string[];
    private static _tableStyles: any[];
    private static _dxfs: any[];
    private static _tables: any[];
    private static _notes: { [sheetIndex: number]: IWorkbookNote[] } // array of notes per sheet

    /*
     * Loads the xlsx file to the Workbook object model.
     * This method works with JSZip 3.0.
     *
     * @param data ArrayBuffer or base-64 string that contains the xlsx file content.
     */
    public static load(data: string | ArrayBuffer): IWorkbook {
        let zip = new JSZip();
        wijmo.assert(zip.loadAsync == null, "Please use JSZip 2.5 to load excel files synchronously.");

        let zipImpl = new _JsZipWrapper(zip),
            ret: IWorkbook;

        // Note that callback function in 'then' is called *synchronously* here, so the 'ret' var will be
        // assigned with the complete result before 'return'.
        this._loadImpl(zipImpl, data).then((result: IWorkbook) =>
            ret = result
        );

        return ret;
    }

    /*
     * Loads the xlsx file to the Workbook object model asynchronously.
     * This method works with JSZip 3.0.
     *
     * @param data ArrayBuffer or base64 string that contains the xlsx file content.
     */
    public static loadAsync(data: string | ArrayBuffer): any {
        let zipLib = new JSZip();
        wijmo.assert(zipLib.loadAsync != null, "Please use JSZip 3.0 to load excel files asynchrounously.");
        return this._loadImpl(zipLib, data);
    }

    /*
     * Saves the workbook object model to a base-64 string representation of the workbook object model.
     * This method works with JSZip 2.5.
     *
     * @param workbook the workbook object model.
     */
    public static save(workbook: IWorkbook): any {
        let processTime = Date.now();

        let zip;
        this._saveWorkbookToZip(workbook, null, false).then(v => zip = v);

        //console.log(`Zip OM created (includes xmlSerializer) in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
        //window['xlsxTime'] = Date.now();
        processTime = Date.now() - processTime;

        var applicationType = '';
        if (this._macroEnabled) {
            applicationType = 'application/vnd.ms-excel.sheet.macroEnabled.12;';
        } else {
            applicationType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
        }

        let zipTime = Date.now(),
            base64 = zip.generate({ compression: 'DEFLATE' });
        //console.log('zip.generate');
        return {
            base64: base64,
            zipTime: Date.now() - zipTime,
            processTime: processTime,
            href: () => {
                return 'data:' + applicationType + 'base64,' + base64;
            }
        };
    }

    /*
     * Saves the workbook object model to a base-64 string representation of the workbook object model asynchronously.
     * This method works with JSZip 3.0.
     *
     * @param workbook the workbook object model.
     * @param onError this callback user can catche error information when loading.
     * @param onProgress Callback function that gives feedback about the progress of a task.
     * The function accepts a single argument, the current progress as a number between 0 and 100.
     */
    public static saveAsync(workbook: IWorkbook, cs: _ICancellationSource, onError?: (reason?: any) => any, onProgress?: (value: number) => void) {
        let p = new _SyncPromise(cs);

        if (wijmo.isFunction(onProgress)) {
            onProgress(0);
        }

        // 0..90
        this._saveWorkbookToZip(workbook, cs, true,
            (progress: number) => {
                if (wijmo.isFunction(onProgress)) {
                    onProgress(Math.round(_map(progress, 0, 100, 0, 90)));
                }
            }
        ).then(
            zip => {
                // 91..100
                if (wijmo.isFunction(onProgress)) {
                    onProgress(91);
                }

                let zp = zip.generateAsync({ type: 'base64', compression: 'DEFLATE' });

                zp.catch((reason: any) => {
                    if (onError) {
                        onError(reason);
                    }
                    p.reject(reason);
                });

                zp.then((val: string) => {
                    if (cs && cs.cancelled) {
                        p.cancel();
                    } else {
                        if (wijmo.isFunction(onProgress)) {
                            onProgress(100);
                        }

                        p.resolve(val);
                    }
                });
            }, er => {
                p.reject(er);
            });

        return p;
    }

    private static _loadImpl(zipImpl: _IJsZip, data: string | ArrayBuffer): any {
        let self = this,
            processTime = Date.now(),
            zip: _IJsZipContent,
            result: any = { sheets: [] };

        // Load content and assign 'zip' var with an object representing it.
        let chain = zipImpl.loadAsync(data, { base64: wijmo.isString(data) }).then(zp => zip = zp);
        data = null;
        // Gets the specific implementation of Promise (it'll be a native Promise or a polyfill
        // for JSZip3, or owr own _JSZipSyncPromise for JSZip2.
        // The only method we use from here is the static _PromiseImpl.resolve() used to create
        // an empty promise to start a new promises chain.
        let _PromiseImpl = <any>chain.constructor;

        chain = chain.then(() => {
            let file = zip.file('xl/theme/theme1.xml');
            if (file) {
                return file.async('string').then(content => {
                    //console.log('xl/theme/theme1.xml');
                    self._getTheme(content);
                    result.colorThemes = self._colorThemes;
                })
            }
        });

        chain = chain.then(() => {
            let file = zip.file('xl/styles.xml');
            if (file) {
                return file.async('string').then(content => {
                    //console.log('xl/styles.xml');
                    self._getStyle(content);
                    result.styles = self._styles;
                    if (self._tableStyles != null) {
                        result.tableStyles = self._tableStyles;
                    }
                });
            }
        });

        chain = chain.then(() => {
            let file = zip.file('xl/sharedStrings.xml');
            if (file) {
                return file.async('string').then(content => {
                    //console.log('xl/sharedStrings.xml');
                    self._getSharedString(content);
                });
            }
        });

        chain = chain.then(() => {
            let file = zip.file('xl/workbook.xml');
            if (file) {
                // Get workbook info from "xl/workbook.xml".
                return file.async('string').then(content => {
                    //console.log('xl/workbook.xml');
                    self._getWorkbook(content, result);
                });
            }
        });

        chain = chain.then(() => {
            //console.log('Chaining tables - started');
            self._tables = null;
            let retChain = _PromiseImpl.resolve();
            zip.folder('xl/tables').forEach((relativePath, file) => {
                if (self._tables == null) {
                    self._tables = [];
                }
                //console.log(`Chaining tables - ${relativePath}`);
                retChain = retChain.then(() => {
                    return file.async('string').then(content => {
                        //console.log(`Table: ${relativePath}`);
                        let table = self._getTable(content);
                        table.fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
                        self._tables.push(table);
                    });
                });
            });
            return retChain;
        });

        chain = chain.then(() => {
            let file = zip.file('docProps/core.xml');
            if (file) {
                return file.async('string').then(content => {
                    //console.log('docProps/core.xml');
                    self._getCoreSetting(content, result);
                });
            }
        });

        chain = chain.then(() => {
            let file = zip.file('xl/vbaProject.bin');
            if (file) {
                return file.async('uint8array').then(content => {
                    //console.log('xl/vbaProject.bin');
                    if (result.reservedContent == null) {
                        result.reservedContent = {};
                    }
                    result.reservedContent.macros = content;
                });
            }
        });

        chain = chain.then(() => {
            //console.log('Chaining sheets - started');
            let retChain = _PromiseImpl.resolve();
            zip.folder('xl/worksheets').forEach((relativePath, file) => {
                if (relativePath && relativePath.indexOf('/') === -1) {
                    //console.log(`Chaining sheets - ${relativePath}`);
                    let index = self._getSheetIndex(file.name);
                    if (!isNaN(index)) {
                        retChain = retChain.then(() => {
                            return file.async('string').then(content => {
                                //console.log(`WORKSHEET: ${relativePath}`);
                                self._getSheet(content, index - 1, result);
                                let sheetRel = zip.file('xl/worksheets/_rels/sheet' + index + '.xml.rels');
                                if (sheetRel) {
                                    return sheetRel.async('string').then(content => {
                                        //console.log(`WORKSHEET REL: ${sheetRel.name}`);
                                        let rels = content.split('<Relationship ');
                                        let relCnt = rels.length;

                                        let relComment: _IXlsxRelation,
                                            relDrawing: _IXlsxRelation;

                                        while (--relCnt) {
                                            let rel = rels[relCnt];
                                            let id = self._getAttr(rel, 'Id');
                                            if (result.sheets[index - 1].tableRIds && result.sheets[index - 1].tableRIds.indexOf(id) !== -1) {
                                                if (result.sheets[index - 1].tables == null) {
                                                    result.sheets[index - 1].tables = [];
                                                }
                                                result.sheets[index - 1].tables.push(self._getSheetRelatedTable(rel));
                                            } else if (result.sheets[index - 1].hyperlinkRIds) {
                                                self._getSheetRelatedHyperlink(rel, id, result.sheets[index - 1]);
                                            } else {
                                                let rType = self._getAttr(rel, 'Type');
                                                if (/\/comments$/.test(rType)) {
                                                    relComment = {
                                                        id: self._getAttr(rel, 'Id'),
                                                        target: self._getAttr(rel, 'Target')
                                                    };
                                                } else {
                                                    if (/\/vmlDrawing$/.test(rType)) {
                                                        relDrawing = {
                                                            id: self._getAttr(rel, 'Id'),
                                                            target: self._getAttr(rel, 'Target')
                                                        };
                                                    }
                                                }
                                            }
                                        }

                                        if (relComment && relDrawing) {
                                            return ((sheet: IWorkSheet) => {
                                                let chain = _PromiseImpl.resolve();
                                                //let start = new Date().getTime();
                                                return self._readNotes(sheet, relComment, relDrawing, zip, chain).then(() => {
                                                    //alert((new Date().getTime() - start) / 1000)
                                                });
                                            })(result.sheets[index - 1]);
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            });
            //console.log('Chaining sheets - finished');
            return retChain;
        });

        return chain.then(() => {
            //console.log('CHAINED');
            result.processTime = Date.now() - processTime;
            zip = null;

            this._sharedStrings = null;
            this._colorThemes = null;
            this._styles = null;
            this._sharedFormulas = null;
            this._borders = null;
            this._fonts = null;
            this._fills = null;
            this._contentTypes = null;
            this._props = null;
            this._xlRels = null;
            this._worksheets = null;
            this._tableStyles = null;
            this._dxfs = null;
            this._tables = null;
            this._notes = null;

            return result;
        });
    }


    private static _readNotes(sheet: _IWorkSheet, comment: _IXlsxRelation, drawing: _IXlsxRelation, zip: _IJsZipContent, retChain: any): any {
        // The comment and drawing pathes are relative to the 'xl\worksheets' folder.
        let absPath = (path: string) => path && path.replace(/^..\//, 'xl/');

        let cFile = zip.file(absPath(comment.target));
        if (cFile) {
            retChain = retChain.then(() => {
                // Reading comments<N>.xml
                return cFile.async('string').then((cc: string) => {
                    let list = cc.substring(cc.indexOf('<authors>'), cc.indexOf('</authors>')).split('<author>');

                    let authors = [];
                    for (let i = 1; i < list.length; i++) {
                        authors.push(list[i].substring(0, list[i].indexOf('</author>')));
                    }

                    list = cc.substring(cc.indexOf('<commentList>'), cc.indexOf('</commentList>')).split('<comment ')

                    for (let i = 1; i < list.length; i++) {
                        let ref = _xlsx._getAttr(list[i], 'ref')

                        let col = this._alphaNum(ref.match(/[a-zA-Z]*/g)[0]),
                            row = +ref.match(/\d*/g).join('') - 1,
                            item = list[i],
                            text = item.substring(item.indexOf('<text>') + '<text>'.length, item.lastIndexOf('</text>')),
                            textRuns = this._extractTextRuns(text);


                        let cell = sheet.rows[row].cells[col];
                        if (cell == null) { // an empty cell
                            sheet.rows[row].cells[col] = cell = {};
                        }

                        cell.note = {
                            author: authors[_xlsx._getAttr(item, 'authorId')],
                            textRuns: textRuns,
                            text: this._getTextOfTextRuns(textRuns)
                        };
                    }

                    // Reading vmlDrawing<N>.xml
                    let dFile = zip.file(absPath(drawing.target));
                    if (dFile) {
                        return dFile.async('string').then((dc: string) => {
                            let ns: { vml: string, office: string, excel: string } = {} as any;

                            // extract namespaces
                            dc.substring(0, dc.indexOf('>')).split('xmlns:').forEach(val => {
                                if (val.indexOf('vml') >= 0) {
                                    ns.vml = val.substring(0, val.indexOf('='));
                                } else {
                                    if (val.indexOf('office:office') >= 0) {
                                        ns.office = val.substring(0, val.indexOf('='));
                                    } else {
                                        if (val.indexOf('office:excel') >= 0) {
                                            ns.excel = val.substring(0, val.indexOf('='));
                                        }
                                    }
                                }
                            });


                            // parse shapes
                            let shapes = dc.split(`<${ns.vml}:shape `),
                                conv = new _NotePositionConverter(sheet);

                            for (let i = 1; i < shapes.length; i++) {
                                let shape = shapes[i];
                                //shapeAttrSec = shape.substring(0, shape.indexOf('>')),
                                //textbox = this._getSubElement(shape, `${ns.vml}:textbox`),
                                //div = this._getSubElement(textbox, 'div');

                                let cdTag = `${ns.excel}:ClientData`;
                                let idx = shape.indexOf(cdTag);
                                if (idx > 0) {
                                    idx += cdTag.length + 1;
                                    let cd = shape.substring(idx, shape.indexOf('</' + cdTag, idx));
                                    if (this._getAttr(cd, 'ObjectType') === 'Note') {
                                        let row = +this._getElementValue(cd, `${ns.excel}:Row`, null, null), // 0-based
                                            col = +this._getElementValue(cd, `${ns.excel}:Column`, null, null); // 0-based

                                        let cmt = sheet.rows[row].cells[col].note;

                                        wijmo.assert(cmt != null, 'No related note was found, row=${row}, col=${col}.');

                                        cmt.visible = this._getElementValue(cd, `${ns.excel}:Visible`, false, true);

                                        //let moveWithCells = this._getElementValue(cd, `${ns.excel}:MoveWithCells`, true, false),
                                        //    sizeWithCells = this._getElementValue(cd, `${ns.excel}:SizeWithCells`, true, false);

                                        //cmt.autoPositioning = !moveWithCells && !sizeWithCells
                                        //    ? NotePositioning.None
                                        //    : (moveWithCells && sizeWithCells ? NotePositioning.MoveAndSize : NotePositioning.Move);

                                        let anchor = (this._getElementValue(cd, `${ns.excel}:Anchor`, null, null) as string).split(',').map(v => parseFloat(v));
                                        conv.fromAnchor(anchor, cmt, row, col);

                                        //// ** alignment ** 
                                        //let algn: IWorkbookNoteAlignment = {};

                                        //algn.hAlign = asEnum(this._getElementValue(cd, `${ns.excel}:TextHAlign`, 'Left', 'Left'), HAlign);
                                        //algn.vAlign = asEnum(this._getElementValue(cd, `${ns.excel}:TextVAlign`, 'Top', 'Top'), VAlign);

                                        //algn.direction = TextDirection.Context;
                                        //if (div) {
                                        //    if (div.indexOf('rtl') >= 0) {
                                        //        algn.direction = TextDirection.RightToLeft;
                                        //    } else {
                                        //        if (div.indexOf('mso-direction-alt:auto') < 0) {
                                        //            algn.direction = TextDirection.LeftToRight;
                                        //        }
                                        //    }
                                        //}

                                        //algn.orientation = TextOrientation.Horizontal;
                                        //if (textbox && textbox.indexOf('vertical') > 0) {  // layout-flow:vertical
                                        //    algn.orientation = TextOrientation.RotateDown; // no mso-layout-flow-alt

                                        //    if (textbox.indexOf('top-to-bottom') > 0) {  // mso-layout-flow-alt:top-to-bottom;
                                        //        algn.orientation = TextOrientation.Vertical;
                                        //    } else {
                                        //        if (textbox.indexOf('bottom-to-top') > 0) { // mso-layout-flow-alt:bottom-to-top;
                                        //            algn.orientation = TextOrientation.RotateUp;
                                        //        }
                                        //    }
                                        //}

                                        //cmt.alignment = algn;

                                        ////#region margins
                                        //if (textbox) {
                                        //    let inset = this._getAttr(textbox, 'inset'); // inset="left,top,right,bottom", in mm.
                                        //    if (inset) {
                                        //        let auto = shapeAttrSec.indexOf(`${ns.office}:insetmode="auto"`) >= 0,
                                        //            arr = inset.split(',').map(v => parseFloat(v) / (25.4 / 96)); //  mm -> px

                                        //        cmt.margins = {
                                        //            auto: auto,
                                        //            left: arr[0],
                                        //            top: arr[1],
                                        //            right: arr[2],
                                        //            bottom: arr[3]
                                        //        };
                                        //    }
                                        //}

                                        ////#endregion
                                    }
                                }
                            }

                            ns = null;
                        });
                    }
                });
            });
        }

        return retChain;
    }

    // progress 0..100
    private static _saveWorkbookToZip(workbook: IWorkbook, cs: _ICancellationSource, isAsync: boolean, progress?: (value: number) => void): _SyncPromise {
        let zip = new JSZip();

        if (isAsync) {
            wijmo.assert(zip.generateAsync != null, "Please use JSZip 3.0 to save excel files asynchrounously.");
        } else {
            wijmo.assert(zip.generateAsync == null, "Please use JSZip 2.5 to save excel files synchronously.");
        }

        if (wijmo.isFunction(progress)) {
            progress(0);
        }

        zip.folder('_rels').file('.rels', this._xmlDescription + this._generateRelsDoc());
        var docProps = zip.folder('docProps');

        var xl = zip.folder('xl');
        this._colorThemes = workbook.colorThemes;
        xl.folder('theme').file('theme1.xml', this._xmlDescription + this._generateThemeDoc());

        // Export the macro to xlsx file.
        this._macroEnabled = !!(workbook.reservedContent && workbook.reservedContent.macros);
        if (this._macroEnabled) {
            xl.file('vbaProject.bin', workbook.reservedContent.macros);
        }

        // Not content dependent
        docProps.file('core.xml', this._xmlDescription + this._generateCoreDoc(workbook));

        // Content dependent
        this._sharedStrings = [[], 0];
        this._styles = new Array(1);
        this._borders = new Array(1);
        this._fonts = new Array(1);
        this._fills = new Array(2);
        this._tableStyles = new Array();
        this._dxfs = new Array();

        this._contentTypes = [];
        this._props = [];
        this._xlRels = [];
        this._worksheets = [];
        this._tables = [];
        this._tableStyles = [];
        this._notes = {};

        let p = new _SyncPromise(cs);

        this._generateWorksheets(workbook, xl, cs, isAsync, progress).then(() => {
            this._writeNotes(workbook.sheets, xl);

            // xl/styles.xml
            xl.file('styles.xml', this._xmlDescription + this._generateStyleDoc());

            // [Content_Types].xml
            zip.file('[Content_Types].xml', this._xmlDescription + this._generateContentTypesDoc(workbook));

            // docProps/app.xml
            docProps.file('app.xml', this._xmlDescription + this._generateAppDoc(workbook));

            // xl/_rels/workbook.xml.rels
            xl.folder('_rels').file('workbook.xml.rels', this._xmlDescription + this._generateWorkbookRels());

            // xl/sharedStrings.xml
            var strSharedStringDoc = this._xmlDescription + this._generateSharedStringsDoc();
            this._sharedStrings = [[], 0];
            xl.file('sharedStrings.xml', strSharedStringDoc);
            strSharedStringDoc = null;

            // xl/workbook.xml
            xl.file('workbook.xml', this._xmlDescription + this._generateWorkbook(workbook));

            if (wijmo.isFunction(progress)) {
                progress(100);
            }

            p.resolve(zip);
        });

        return p;
    }

    private static _writeNotes(sheets: _IWorkSheet[], xl: any) {
        const NoteOffsetSmall = 2; // Used if note is anchored to the first row\column.
        const NoteOffsetBig = 15;
        const DefNoteWidth = 144;
        const DefNoteHeight = 79;
        const DefHMargin = 2.5 / (25.4 / 96); // 2.5mm
        const DefVMargin = 1.3 / (25.4 / 96); // 1.3mm

        sheets.forEach((sheet, index) => {
            let notes = this._notes[index];

            if (!notes) { // the sheet has no notes.
                return;
            }

            xl.folder('drawings').file(`vmlDrawing${index + 1}.vml`, ((sheet: _IWorkSheet) => {
                let xml = '<xml xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">\r\n',
                    shapeTypeId = '_x0000_t202';

                xml += '<o:shapelayout v:ext="edit">\r\n';
                xml += '<o:idmap v:ext="edit" data="1"/>\r\n';
                xml += '</o:shapelayout>\r\n';

                xml += `<v:shapetype id="${shapeTypeId}" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">\r\n`;
                xml += '<v:stroke joinstyle="miter"/>\r\n';
                xml += '<v:path gradientshapeok="t" o:connecttype="rect"/>\r\n';
                xml += '</v:shapetype>\r\n';

                let noteShapeIdx = (index + 1) * 1000 + 50,
                    conv = new _NotePositionConverter(sheet);

                notes.forEach((note, i) => {
                    wijmo.assert(note._row >= 0 && note._col >= 0, 'Invalid cell\'s indicies.');

                    let visible = note.visible == null || note.visible === true, // def value is True
                        style = `position:absolute; visibility:${visible ? 'visible' : 'hidden'}; z-index:${i + 1};`,
                        //mrgns = note.margins,
                        //hasMargins = mrgns && (mrgns.left != null || mrgns.top != null || mrgns.right != null || mrgns.bottom != null),
                        //autoInsetMode = !hasMargins || !!mrgns.auto;
                        autoInsetMode = true;


                    //#region shape
                    xml += `<v:shape id="_x0000_s${noteShapeIdx++}" type="#${shapeTypeId}" style='${style}' fillcolor="infoBackground [80]" ${autoInsetMode ? 'o:insetmode="auto"' : ''}>\r\n`;

                    xml += '<v:fill color2="infoBackground [80]"/>\r\n';
                    xml += '<v:shadow color="none [81]" obscured="t"/>\r\n';
                    xml += '<v:path o:connecttype="none"/>\r\n';


                    // ** alignment **
                    let //algn = note.alignment,
                        //ha = algn && algn.hAlign || HAlign.Left, // undefined + General -> Left
                        //va = algn && algn.vAlign || VAlign.Top,
                        //dir = algn && algn.direction || TextDirection.Context,
                        //ornt = algn && algn.orientation || TextOrientation.Horizontal,
                        divStyle = '',
                        textBoxStyle = '';

                    //if (ha === HAlign.Fill || ha === HAlign.CenterContinuous) { // suppress unsupported values
                    //    ha = HAlign.Left;
                    //}


                    divStyle += 'text-align:left;'; // default, ha = HAlign.Left 
                    //if (ha !== HAlign.Distributed && va !== VAlign.Distributed) {
                    //    switch (ha) {
                    //        case HAlign.Left:
                    //            divStyle += 'text-align:left;'; break;
                    //        case HAlign.Center:
                    //            divStyle += 'text-align:center;'; break;
                    //        case HAlign.Right:
                    //            divStyle += 'text-align:right;'; break;
                    //        case HAlign.Justify:
                    //            divStyle += 'text-align:justify;'; break;
                    //    }
                    //}


                    //if (ornt !== TextOrientation.Horizontal) {
                    //    textBoxStyle += 'layout-flow:vertical;';

                    //    if (ornt === TextOrientation.Vertical) {
                    //        textBoxStyle += 'mso-layout-flow-alt:top-to-bottom;';
                    //    }
                    //    if (ornt === TextOrientation.RotateUp) {
                    //        textBoxStyle += 'mso-layout-flow-alt:bottom-to-top;';
                    //    }
                    //}

                    textBoxStyle += 'mso-direction-alt:auto;'; // default, dir = TextDirection.Context
                    //if (dir === TextDirection.Context) {
                    //    textBoxStyle += 'mso-direction-alt:auto;';
                    //} else {
                    //    if (dir === TextDirection.RightToLeft) {
                    //        textBoxStyle += 'direction:RTL;';
                    //        divStyle += 'direction:ltr;';
                    //    }
                    //}

                    //// ** margins ** 
                    //let inset = '';
                    //if (hasMargins) {
                    //    inset = [
                    //        mrgns.left == null ? DefHMargin : mrgns.left,
                    //        mrgns.top == null ? DefVMargin : mrgns.top,
                    //        mrgns.right == null ? DefHMargin : mrgns.right,
                    //        mrgns.bottom == null ? DefVMargin : mrgns.bottom
                    //    ].map(v => (v * (25.4 / 96)).toFixed(1) + 'mm').join(); // px -> mm
                    //}

                    xml += `<v:textbox style="${textBoxStyle}" `;

                    //if (inset) {
                    //    xml += `inset="${inset}" `;
                    //}

                    xml += '>\r\n'; // close the v:textbox tag

                    xml += `<div style="${divStyle}"></div>\r\n`;
                    xml += '</v:textbox>\r\n';

                    //#region ClientData
                    xml += '<x:ClientData ObjectType="Note">\r\n';

                    //if (ha !== HAlign.Left) { // skip default value
                    //    xml += `<x:TextHAlign>${HAlign[ha]}</x:TextHAlign>\r\n`;
                    //}

                    //if (va !== VAlign.Top) { // skip default value
                    //    xml += `<x:TextVAlign>${VAlign[va]}</x:TextVAlign>\r\n`;
                    //}


                    // default, autoPositioning = NotePositioning.None
                    xml += '<x:MoveWithCells/>\r\n'; // Don't move
                    xml += '<x:SizeWithCells/>\r\n'; // Don't size
                    //if (note.autoPositioning !== NotePositioning.MoveAndSize) { // undefined || None (def) || Move
                    //    if (!note.autoPositioning) { // None
                    //        xml += '<x:MoveWithCells/>\r\n'; // Don't move
                    //    }
                    //    xml += '<x:SizeWithCells/>\r\n'; // Don't size
                    //}

                    //#region apply default position\size values
                    if (note.width == null) {
                        note.width = DefNoteWidth;
                    }

                    if (note.height == null) {
                        note.height = DefNoteHeight;
                    }

                    if (note.offsetX == null) {
                        note.offsetX = NoteOffsetBig;
                    }

                    if (note.offsetY == null) {
                        note.offsetY = (note._row == 0 ? NoteOffsetSmall : NoteOffsetBig);
                    }
                    //#endregion

                    let anchor = conv.toAnchor(note, note._row, note._col);
                    xml += `<x:Anchor>${anchor.toString()}</x:Anchor>\r\n`;

                    xml += '<x:AutoFill>False</x:AutoFill>\r\n'
                    xml += `<x:Row>${note._row}</x:Row>\r\n`;
                    xml += `<x:Column>${note._col}</x:Column>\r\n`;

                    if (visible) {
                        xml += '<x:Visible/>\r\n';
                    }

                    xml += '</x:ClientData>\r\n';
                    //#endregion

                    xml += '</v:shape>\r\n';
                    //#endregion
                });

                return xml + '</xml>';
            })(sheet));

            xl.file(`comments${index + 1}.xml`, ((sheet: _IWorkSheet) => {
                let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
                xml += '<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
                    'mc:Ignorable="xr" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision">\r\n';

                //#region authors
                let authDict: { [name: string]: number } = {},
                    authArray: string[] = [],
                    defNoteFont: IWorkbookFont = { family: 'Tahoma', size: 9 * (96 / 72) }; // Tahoma, 9pt 

                notes.forEach(n => {
                    let author = n.author || '';
                    if (authDict[author] == null) {
                        authDict[author] = authArray.length;
                        authArray.push(author);
                    }
                });

                xml += '<authors>\r\n';
                authArray.forEach(v => xml += `<author>${v}</author>\r\n`);
                xml += '</authors>\r\n';
                //#endregion

                //#region commentList
                xml += '<commentList>\r\n';
                notes.forEach(n => {
                    let ref = this._numAlpha(n._col) + (n._row + 1);
                    xml += `<comment ref="${ref}" authorId="${authDict[n.author || '']}" shapeId="0" xr:uid="${_guid()}">\r\n`;
                    xml += '<text>\r\n';

                    let textRuns = n.textRuns && n.textRuns.length ? n.textRuns : [{ text: n.text }]; // get text runs, convert plain text to text runs
                    textRuns = textRuns.map(v => { v.font = v.font || defNoteFont; return v; }); // set default font

                    xml += this._generateTextRuns(textRuns, this._defaultFontName.toLowerCase());

                    xml += '</text>';
                    xml += '</comment>\r\n';
                });
                xml += '</commentList>\r\n';
                //#endregion

                return xml + '</comments>';
            })(sheet));
        });
    }

    // 0..100
    private static _generateWorksheets(workbook: IWorkbook, xl: any, cs: _ICancellationSource, isAsync: boolean, progress?: (value: number) => void) {
        let xlWorksheets = xl.folder('worksheets'),
            len = workbook.sheets.length,
            xlTables,
            promises: (() => _SyncPromise)[] = [];

        // progress
        let totalRows: number = workbook.sheets.map(sheet => sheet.rows.length).reduce((a, c) => a + c),
            progK: number[] = workbook.sheets.map(sheet => sheet.rows.length / totalRows),
            prevSheet = len - 1,
            prevProg = 0,
            progAcc = 0;

        while (len--) {
            let sheetIndex = len;

            promises.push(() => {
                let p = new _SyncPromise(cs);

                this._generateWorkSheet(sheetIndex, workbook, xlWorksheets, cs, isAsync,
                    (value: number) => { // 0..100, for the current sheet
                        if (wijmo.isFunction(progress)) {
                            value = Math.round(value * progK[sheetIndex]);

                            if (prevSheet !== sheetIndex) {
                                prevSheet = sheetIndex;
                                progAcc += prevProg;
                            }

                            prevProg = value;

                            progress(progAcc + value);
                        }
                    }).then(() => {
                        // sheet relationship file.
                        let sheet = workbook.sheets[sheetIndex] as _IWorkSheet,
                            sheetExtLinks: string[] = sheet && sheet.externalLinks,
                            hasNotes = this._sheetHasNotes(sheetIndex);

                        if (sheet && ((sheet.tables && sheet.tables.length > 0) || (sheetExtLinks && sheetExtLinks.length > 0) || hasNotes)) {
                            let relIndex = 1,
                                sheetRelDoc = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';

                            if (hasNotes) {
                                sheetRelDoc += `<Relationship Id="rId${relIndex++}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/vmlDrawing${sheetIndex + 1}.vml" />`;
                                sheetRelDoc += `<Relationship Id="rId${relIndex++}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="../comments${sheetIndex + 1}.xml" />`;
                            }

                            if (sheetExtLinks && sheetExtLinks.length > 0) {
                                sheetRelDoc += this._generateHyperlinkRel(sheetExtLinks, relIndex);
                                relIndex += sheetExtLinks.length;
                            }

                            if (sheet.tables && sheet.tables.length > 0) {
                                if (xlTables == null) {
                                    xlTables = xl.folder('tables');
                                }
                                for (let tableIndex = 0; tableIndex < sheet.tables.length; tableIndex++) {
                                    let table = sheet.tables[tableIndex] as _IWorkbookTable;
                                    this._generateTable(table, xlTables);
                                    sheetRelDoc += '<Relationship Target="../tables/' + table.fileName
                                        + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Id="rId' + (tableIndex + relIndex) + '"/>'
                                }
                            }

                            sheetRelDoc += '</Relationships>';
                            xlWorksheets.folder('_rels').file('sheet' + (sheetIndex + 1) + '.xml.rels', this._xmlDescription + sheetRelDoc);
                        }

                        p.resolve();

                    });

                return p;
            });
        }

        return _SyncPromise.serial(cs, promises).then(() => {
            if (wijmo.isFunction(progress)) {
                progress(100);
            }
        });
    }

    // Get shared strings
    private static _getSharedString(sharedString: string) {
        var s = sharedString.split(/<si.*?>/g),
            i = s.length;

        this._sharedStrings = [];
        while (--i) {
            if (s[i].search(/<r>/gi) > -1) {
                // GrapeCity: Handle the rich text run.
                this._sharedStrings[i - 1] = this._extractTextRuns(s[i]);
            } else {
                let val = this._getElementValue(s[i], 't', '', '');
                this._sharedStrings[i - 1] = Workbook._unescapeXML(val);
            }
        }
    }

    private static _extractTextRuns(trStr: string) {
        let res = [],
            raw = trStr.split(/<r>/g);

        for (var i = 1; i < raw.length; i++) {
            let textFont;

            if (raw[i].indexOf('<rPr>') !== -1) {
                textFont = this._getTextRunFont(raw[i]);
            }

            let text = this._getElementValue(raw[i], 't', '', '');

            res.push({
                font: textFont,
                text: Workbook._unescapeXML(text)
            });
        }

        return res;
    }

    private static _getInlineString(trStr: string): string {
        let content = trStr.split('<t'),
            i = content.length,
            res = '';

        while (--i) {
            let val = content[i];
            if (val[0] === ' ' || val[0] === '>') { // <t ...>val</t> or <t>val</t>
                let tagEnd = val.indexOf('</t>');
                if (tagEnd > 0) {
                    res = val.substring(val.indexOf('>') + 1, tagEnd) + res;
                }
            }
        }

        return res;
    }

    // Converts decimal entities in a given string to Unicode.
    private static _convertDecimalEntities(val: string): string {
        // "a&#&#5&#;&#z;&#65;&#&#12345678;&#65&#65;" -> "a&#&#5&#;&#z;A&#&#12345678;&#65A"

        //Regex version:
        // Same performance when the string contains no decimal entities.
        // 2-3 times slower in Chrome on strings with well-formed decimal entities (&#N;&#N;....&#N;)
        // 1.5-2 times faster in Chrome and Firefox on tricky strings like in the snippet above.
        // Always faster in IE11.

        if (wijmo.isIE() && val.indexOf('&#') !== -1) {
            return val.replace(/&#(\d{1,7});/g, (m, code) => fromCodePointImpl(code));
        }

        let start = 0,
            mrkr: number,
            decoded = '';

        while ((mrkr = val.indexOf('&#', start)) >= 0) {
            let scln = val.indexOf(';', mrkr + 2);
            if (scln === -1) {
                break;
            }

            let cplen = scln - mrkr - 2;
            if (cplen > 0 && cplen < 8) { // the maximum valid decimal code point is 1114112 (len=7)
                let codeStr = val.substr(mrkr + 2, cplen);

                // Parse the codeStr and check if it contains exactly a decimal value (it seems to be the strictest and the fastest way).
                let code = +codeStr; // NB: +"0xFF" -> 255
                if (code == <any>codeStr) {
                    decoded += val.substring(start, mrkr);
                    decoded += fromCodePointImpl(code);
                } else {
                    decoded += val.substr(start, 2);
                    start += 2;
                    continue;
                }
            } else {
                decoded += val.substring(start, scln + 1);
            }

            start = scln + 1; // move to the character after the ';'
        }

        if (start !== val.length) {
            decoded += val.substr(start);
        }

        return decoded || val;
    }

    // Get core setting.
    private static _getCoreSetting(coreSetting: string, result: any) {
        var s: string,
            index: number;

        index = coreSetting.indexOf('<dc:creator>');
        if (index >= 0) {
            s = coreSetting.substr(index + 12);
            result.creator = s.substring(0, s.indexOf('</dc:creator>'));
        }

        index = coreSetting.indexOf('<cp:lastModifiedBy>');
        if (index >= 0) {
            s = coreSetting.substr(index + 19);
            result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));
        }

        index = coreSetting.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">');
        if (index >= 0) {
            s = coreSetting.substr(index + 43);
            result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));
        }

        index = coreSetting.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">');
        if (index >= 0) {
            s = coreSetting.substr(index + 44);
            result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
        }
    }

    // Get workbook setting.
    private static _getWorkbook(workbook: string, result: any) {
        var bookView = workbook.substring(workbook.indexOf('<bookViews>'), workbook.indexOf('</bookViews>')),
            activeSheet = '',
            definedNamesIndex = workbook.indexOf('<definedNames>'),
            definedNames: string,
            definedName: any,
            value: any,
            sheetIndex: any,
            sheet: any,
            s: string[],
            i: number,
            name: string,
            worksheetVisible: boolean;

        if (bookView) {
            activeSheet = this._getAttr(bookView, 'activeTab');
        }
        result.activeWorksheet = +activeSheet;

        s = workbook.split('<sheet ');
        i = s.length;
        while (--i) { // Do not process i === 0, because s[0] is the text before the first sheet element
            name = this._getAttr(s[i], 'name');
            // GrapeCity Begin: Gets the worksheet visible property.
            worksheetVisible = this._getAttr(s[i], 'state') !== 'hidden';
            result.sheets.unshift({ name: name, visible: worksheetVisible, columns: [], rows: [] });
            // GrapeCity End
        }

        if (definedNamesIndex > -1) {
            result.definedNames = [];
            definedNames = workbook.substring(definedNamesIndex, workbook.indexOf('</definedNames>'));
            s = definedNames.split('<definedName ');
            i = s.length;
            while (--i) {
                name = this._getAttr(s[i], 'name');
                value = s[i].match(/.*>.+(?=<\/definedName>)/);
                if (value) {
                    value = value[0].replace(/(.*>)(.+)/, "$2");
                    value = isNaN(+value) ? value : +value;
                }
                definedName = { name: name, value: value };
                sheetIndex = this._getAttr(s[i], 'localSheetId');
                if (sheetIndex !== '') {
                    sheet = result.sheets[+sheetIndex];
                    if (sheet) {
                        definedName.sheetName = sheet.name;
                    }
                }
                result.definedNames.unshift(definedName);
            }
        }
    }

    // Get themes.
    private static _getTheme(theme: string) {
        theme = theme.substring(theme.indexOf('<a:clrScheme'), theme.indexOf('</a:clrScheme>'));
        this._colorThemes = this._defaultColorThemes.slice();
        this._colorThemes[0] = this._getAttr(theme.substring(theme.indexOf('a:lt1'), theme.indexOf('</a:lt1>')), 'lastClr') || this._getAttr(theme.substring(theme.indexOf('a:lt1'), theme.indexOf('</a:lt1>')), 'val');
        this._colorThemes[1] = this._getAttr(theme.substring(theme.indexOf('a:dk1'), theme.indexOf('</a:dk1>')), 'lastClr') || this._getAttr(theme.substring(theme.indexOf('a:dk1'), theme.indexOf('</a:dk1>')), 'val');
        this._colorThemes[2] = this._getAttr(theme.substring(theme.indexOf('a:lt2'), theme.indexOf('</a:lt2>')), 'val');
        this._colorThemes[3] = this._getAttr(theme.substring(theme.indexOf('a:dk2'), theme.indexOf('</a:dk2>')), 'val');
        var accentThemes = theme.substring(theme.indexOf('<a:accent1'), theme.indexOf('</a:accent6>')).split('<a:accent');
        var i = accentThemes.length;
        while (--i) {
            this._colorThemes[i + 3] = this._getAttr(accentThemes[i], 'val');
        }
    }

    // Get styles.
    private static _getStyle(styleSheet: string) {
        let fonts = [],
            fills = [],
            borders = [],
            formats = this._numFmts.slice();

        this._styles = [];

        let index = styleSheet.indexOf('<numFmts');
        if (index >= 0) {
            let numFmtArray = styleSheet.substring(index + 8, styleSheet.indexOf('</numFmts>')).split('<numFmt'),
                i = numFmtArray.length;

            while (--i) {
                let item = numFmtArray[i];
                formats[+this._getAttr(item, 'numFmtId')] = this._getAttr(item, 'formatCode');
            }
        }

        index = styleSheet.indexOf('<fonts');
        if (index >= 0) {
            let fontArray = styleSheet.substring(index, styleSheet.indexOf('</fonts>')).split('<font>'),
                i = fontArray.length;

            while (--i) {
                let item = fontArray[i],
                    size = this._getChildNodeValue(item, 'sz'),
                    tval: string;

                fonts[i - 1] = {
                    bold: /<b\s*\/>/.test(item) || this._getChildNodeValue(item, 'b') === 'true',
                    italic: /<i\s*\/>/.test(item) || this._getChildNodeValue(item, 'i') === 'true',
                    underline: /<u\s*\/>/.test(item) || (!!(tval = this._getChildNodeValue(item, 'u')) && tval !== 'none'),
                    size: Math.round(size ? +size * 96 / 72 : 14),
                    family: this._getChildNodeValue(item, 'name'),
                    color: this._getColor(item, false)
                };

                size = null;
            }
        }

        index = styleSheet.indexOf('<fills');
        if (index >= 0) {
            let fillArray = styleSheet.substring(index, styleSheet.indexOf('</fills>')).split('<fill>'),
                i = fillArray.length;

            while (--i) {
                fills[i - 1] = this._getColor(fillArray[i], true);
            }
        }

        index = styleSheet.indexOf('<borders');
        if (index >= 0) {
            //var borderArray = styleSheet.substring(index, styleSheet.indexOf('</borders>')).split(/<border\/?>/);
            let borderArray = styleSheet.substring(index + 8, styleSheet.indexOf('</borders>')).split('<border'),
                i = borderArray.length;

            while (--i) {
                let item = borderArray[i];

                borders[i - 1] = {
                    left: this._getEdgeBorder(item, 'left'),
                    right: this._getEdgeBorder(item, 'right'),
                    top: this._getEdgeBorder(item, 'top'),
                    bottom: this._getEdgeBorder(item, 'bottom'),
                };
            }

        }

        index = styleSheet.indexOf('<cellXfs');
        if (index >= 0) {
            let xfs = styleSheet.substring(index, styleSheet.indexOf('</cellXfs>')).split('<xf'),
                i = xfs.length;

            while (--i) {
                let item = xfs[i],
                    id = +this._getAttr(item, 'numFmtId'),
                    format = formats[id],
                    typ = 'unknown';

                if (!!format) {
                    if (/[hsmy\:]/i.test(format)) {
                        typ = 'date';
                    } else if (format.indexOf('0') > -1) {
                        typ = 'number';
                    } else if (format === '@') {
                        typ = 'string';
                    }
                }

                id = +this._getAttr(item, 'fontId');
                let font = id > 0 ? fonts[id] : null;

                id = +this._getAttr(item, 'fillId');
                let fill = id > 1 ? fills[id] : null;

                id = +this._getAttr(item, 'borderId');
                let border = id > 0 ? borders[id] : null;

                index = item.indexOf('<alignment');

                this._styles.unshift({
                    formatCode: format,
                    type: typ,
                    font: font,
                    fillColor: fill,
                    borders: border,
                    hAlign: index >= 0 ? Workbook._parseStringToHAlign(this._getAttr(item, 'horizontal')) : null,
                    vAlign: index >= 0 ? Workbook._parseStringToVAlign(this._getAttr(item, 'vertical')) : null,
                    wordWrap: index >= 0 ? this._getAttr(item, 'wrapText') === '1' : null,
                    quotePrefix: (+this._getAttr(item, 'quotePrefix') === 1)
                });
            }
        }

        if (styleSheet.indexOf('<tableStyle ') > -1) {
            this._tableStyles = [];
            let tableStyles = styleSheet.substring(styleSheet.indexOf('<tableStyles '), styleSheet.indexOf('</tableStyles>'));
            let dxfs = styleSheet.substring(styleSheet.indexOf('<dxfs '), styleSheet.indexOf('</dxfs>'));
            this._getTableStyles(tableStyles, dxfs.split('<dxf>'));
        }
    }

    // Get border style of specific edge.
    private static _getEdgeBorder(strBorder: string, edge: string): any {
        var border,
            edgeBorder: string,
            borderStyle: BorderStyle,
            borderColor: string,
            beginIndex = strBorder.indexOf('<' + edge),
            endIndex = strBorder.indexOf('</' + edge + '>');
        if (beginIndex >= 0) {
            edgeBorder = strBorder.substring(beginIndex);
            if (endIndex >= 0) {
                edgeBorder = edgeBorder.substring(0, endIndex);
            } else {
                edgeBorder = edgeBorder.substring(0, edgeBorder.indexOf('/>'));
            }
            var style = this._getAttr(edgeBorder, 'style');
            if (style) {
                borderStyle = Workbook._parseStringToBorderType(style);
                borderColor = this._getColor(edgeBorder, false);
                // Ignore the default border setting for importing.
                if (borderStyle !== BorderStyle.Thin || !(borderColor && borderColor.toLowerCase() === '#c6c6c6')) {
                    border = {};
                    border['style'] = borderStyle;
                    border['color'] = borderColor;
                }
            }
        }
        return border;
    }

    // Get worksheet.
    private static _getSheet(sheet: string, index: number, result: IWorkbook) {
        var mergeCells = [];
        var mergeRange;
        if (sheet.indexOf('<mergeCells') > -1) {
            var mergeCellArray = sheet.substring(sheet.indexOf('<mergeCells'), sheet.indexOf('</mergeCells>')).split('<mergeCell ');
            var j = mergeCellArray.length;
            while (--j) {
                mergeRange = this._getAttr(mergeCellArray[j], 'ref').split(':');
                if (mergeRange.length === 2) {
                    mergeCells.unshift({
                        topRow: +mergeRange[0].match(/\d*/g).join('') - 1,
                        leftCol: this._alphaNum(mergeRange[0].match(/[a-zA-Z]*/g)[0]),
                        bottomRow: +mergeRange[1].match(/\d*/g).join('') - 1,
                        rightCol: this._alphaNum(mergeRange[1].match(/[a-zA-Z]*/g)[0])
                    });
                }
            }
        }
        // GrapeCity End
        // GrapeCity Begin: Gets tha base shared formula for current sheet.
        this._getsBaseSharedFormulas(sheet);
        // GrapeCity End
        var rows = sheet.split('<row ');
        var w = result.sheets[index] as _IWorkSheet;
        var dimensionIndex = rows[0].indexOf('<dimension');
        if (dimensionIndex >= 0) {
            var dimension = this._getAttr(rows[0].substr(rows[0].indexOf('<dimension')), 'ref');
            if (!!dimension) {
                dimension = dimension.substr(dimension.indexOf(':') + 1);
                w.maxCol = this._alphaNum(dimension.match(/[a-zA-Z]*/g)[0]) + 1;
                w.maxRow = +dimension.match(/\d*/g).join('');
            }
        }

        var tablePartsIndex = sheet.indexOf('<tableParts');
        if (tablePartsIndex > -1) {
            var tableParts = sheet.substring(tablePartsIndex, sheet.indexOf('</tableParts>')).split('<tablePart ');
            var tableCnt = tableParts.length;
            w.tableRIds = [];
            while (--tableCnt) {
                w.tableRIds.unshift(this._getAttr(tableParts[tableCnt], 'r:id'));
            }
        }

        // GrapeCity Begin: Add frozen cols/rows processing. 
        if (rows.length > 0 && rows[0].indexOf('<pane') > -1) {
            if (this._getAttr(rows[0].substr(rows[0].indexOf('<pane')), 'state') === 'frozen') {
                var frozenRows = this._getAttr(rows[0].substr(rows[0].indexOf('<pane')), 'ySplit');
                var frozenCols = this._getAttr(rows[0].substr(rows[0].indexOf('<pane')), 'xSplit');
                w.frozenPane = {
                    rows: frozenRows ? +frozenRows : NaN,
                    columns: frozenCols ? +frozenCols : NaN
                };
            }
        }
        // GrapeCity End
        // GrapeCity Begin: Check whether the Group Header is below the group content.
        w.summaryBelow = this._getAttr(rows[0], 'summaryBelow') !== '0';
        // GrapeCity End
        j = rows.length;
        if (rows.length <= 1) {
            w.maxCol = 20;
            w.maxRow = 200;
        } else if (w.maxRow == null || w.maxRow < j - 1) {
            w.maxRow = j - 1;
        }
        var style: IWorkbookStyle = null;
        var f = null;
        var colIndex: number;
        while (--j) { // Don't process j === 0, because s[0] is the text before the first row element
            var row: IWorkbookRow = w.rows[+this._getAttr(rows[j], 'r') - 1] = { visible: true, groupLevel: NaN, cells: [] };
            // GrapeCity Begin: Check the visibility of the row.
            if (rows[j].substring(0, rows[j].indexOf('>')).indexOf('hidden') > -1 && this._getAttr(rows[j], 'hidden') === '1') {
                row.visible = false;
            }
            // GrapeCity End
            // GrapeCity Begin: Get the row height setting for the custom Height row.
            if (this._getAttr(rows[j], 'customHeight') === '1') {
                var height = +this._getAttr(rows[j].substring(0, rows[j].indexOf('>')).replace('customHeight', ''), 'ht');
                row.height = height * 96 / 72;
            }
            style = null;
            f = null;
            if (this._getAttr(rows[j], 'customFormat') === '1') {
                f = this._styles[+this._getAttr(rows[j].substring(rows[j].indexOf(' s=')), 's')] || { type: 'General', formatCode: null };
                if (f.font || f.fillColor || f.hAlign || f.vAlign || f.wordWrap || f.borders || (f.formatCode && f.formatCode !== 'General')) {
                    style = {
                        format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                        font: f.font,
                        fill: {
                            color: f.fillColor
                        },
                        borders: f.borders,
                        hAlign: f.hAlign,
                        vAlign: f.vAlign,
                        wordWrap: f.wordWrap
                    };
                } else {
                    style = null;
                }
            }
            row.style = style;
            // GrapeCity End
            // GrapeCity Begin: Get the group level.
            var groupLevel = this._getAttr(rows[j], 'outlineLevel');
            row.groupLevel = groupLevel && groupLevel !== '' ? +groupLevel : NaN;
            // GrapeCity End
            // GrapeCity Begin: Get the collapsed attribute of the row.
            row.collapsed = this._getAttr(rows[j], 'collapsed') === '1';
            // GrapeCity End
            var columns = rows[j].split('<c ');
            var k = columns.length;
            if (w.maxCol == null || w.maxCol < k - 1) {
                w.maxCol = k - 1;
            }
            while (--k) { // Don't process l === 0, because k[0] is the text before the first c (cell) element
                var cell = columns[k];
                f = this._styles[+this._getAttr(cell, 's')] || { type: 'General', formatCode: null };
                // GrapeCity Begin: set font setting, fill setting and horizontal alignment into the style property.
                if (f.font || f.fillColor || f.hAlign || f.vAlign || f.wordWrap || f.borders || (f.formatCode && f.formatCode !== 'General')) {
                    style = {
                        format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                        font: f.font,
                        fill: {
                            color: f.fillColor
                        },
                        borders: f.borders,
                        hAlign: f.hAlign,
                        vAlign: f.vAlign,
                        wordWrap: f.wordWrap
                    };
                } else {
                    style = null;
                }
                // GrapeCity End
                var t = this._getAttr(cell.substring(0, cell.indexOf('>')), 't') || f.type;
                var val = null;
                var isInlineString = t === 'inlineStr' || cell.indexOf('<is>') >= 0;
                if (isInlineString) {
                    val = this._getInlineString(cell);
                    val = this._convertDecimalEntities(val);
                } else {
                    val = this._getElementValue(cell, 'v', '', '');
                    val = Workbook._unescapeXML(val); // 470006 (additional case)
                }

                // GrapeCity Begin: Add formula processing. 
                var formula = null;
                var si = null;
                var cellRef = null;
                if (cell.indexOf('<f') > -1) {
                    if (cell.indexOf('</f>') > -1) {
                        formula = cell.match(/<f.*>.+(?=<\/f>)/);
                        if (formula) {
                            formula = formula[0].replace(/(\<f.*>)(.+)/, "$2");
                        }
                    } else {
                        si = this._getAttr(cell, 'si');
                        if (si) {
                            cellRef = this._getAttr(cell, 'r');
                            formula = this._getSharedFormula(si, cellRef);
                        }
                    }
                }

                // Replace the structured reference with '#This Row' to '@' for exporting.
                if (formula != null) {
                    formula = formula.replace(/\[\#This Row\]\s*,\s*/gi, '@');
                }

                // GrapeCity End
                // GrapeCity Begin: Fix issue that couldn't read the excel cell content processed by the string processing function.
                if (t !== 'str' && t !== 'e' && !isInlineString) {
                    val = val ? +val : val; // val = val ? +val : '';
                } // turn non-zero into number when the type of the cell is not 'str'
                // GrapeCity End
                colIndex = this._alphaNum(this._getAttr(cell, 'r').match(/[a-zA-Z]*/g)[0]);
                var textRuns = null;
                switch (t) {
                    case 's':
                        val = this._sharedStrings[val];
                        if (val != null) {
                            if (wijmo.isString(val)) {
                                if (f && f.quotePrefix /*&& val[0] !== '\''*/) {
                                    val = '\'' + val;
                                }
                            } else {
                                textRuns = val.slice();
                                val = this._getTextOfTextRuns(textRuns);
                            }
                        }
                        break;
                    case 'b':
                        val = val === 1;
                        break;
                    case 'date':
                        val = val ? this._convertDate(val) : '';
                        break;
                }

                if (wijmo.isNumber(val)) {
                    if (style == null) {
                        style = { format: '' };
                    }
                    if (wijmo.isInt(val)) {
                        style.format = style.format || '#,##0';
                    } else {
                        style.format = style.format || '#,##0.00';
                    }
                }

                row.cells[colIndex] = {
                    value: val,
                    textRuns: textRuns,
                    isDate: t === 'date', /* Add isDate property for the cell */
                    isNumber: t === 'number', // GrapeCity
                    formula: Workbook._unescapeXML(formula) /* GrapeCity: Add formula property.*/,
                    style: style /* GrapeCity: Add style property.*/
                };
            }
        }

        // GrapeCity Begin: Add hidden column and column width processing. 
        var cols = [];
        var colsSetting: IWorkbookColumn[] = [];
        style = null;
        f = null;
        if (rows.length > 0 && rows[0].indexOf('<cols>') > -1) {
            cols = rows[0].substring(rows[0].indexOf('<cols>') + 6, rows[0].indexOf('</cols>')).split('<col ');
            for (var idx = cols.length - 1; idx > 0; idx--) {
                var colWidth = this._parseCharWidthToPixel(+this._getAttr(cols[idx], 'width'));
                f = null;
                if (cols[idx].indexOf('style') > -1) {
                    f = this._styles[+this._getAttr(cols[idx], 'style')] || { type: 'General', formatCode: null };
                }
                style = null;
                if (f && (f.font || f.fillColor || f.hAlign || f.vAlign || f.wordWrap || f.borders || (f.formatCode && f.formatCode !== 'General'))) {
                    style = {
                        format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                        font: f.font,
                        fill: {
                            color: f.fillColor
                        },
                        borders: f.borders,
                        hAlign: f.hAlign,
                        vAlign: f.vAlign,
                        wordWrap: f.wordWrap
                    };
                }

                var min = +this._getAttr(cols[idx], 'min'),
                    max = +this._getAttr(cols[idx], 'max');

                if (max > w.maxCol) { // The rightmost column definition is outside the worksheet dimensions (467873)
                    w._extraColumn = {
                        min: min,
                        max: max,
                        width: colWidth,
                        style: style
                    };
                } else {
                    for (colIndex = min - 1; colIndex < max && colIndex < w.maxCol; colIndex++) {
                        colsSetting[colIndex] = {
                            visible: this._getAttr(cols[idx], 'hidden') !== '1',
                            autoWidth: this._getAttr(cols[idx], 'bestFit') === '1',
                            width: colWidth,
                            style: style
                        };
                    }
                }
            }
        }
        w.columns = colsSetting;
        // GrapeCity End

        var hyperlinksIndex = sheet.indexOf('<hyperlinks');
        if (hyperlinksIndex > -1) {
            var linkParts = sheet.substring(hyperlinksIndex, sheet.indexOf('</hyperlinks>')).split('<hyperlink ');
            var linkCnt = linkParts.length;
            while (--linkCnt) {
                this._getHyperlink(w, linkParts[linkCnt]);
            }
        }

        // Check the visible row/column count in the fronze pane. (TFS 238470)
        if (w.frozenPane) {
            if (!isNaN(w.frozenPane.rows)) {
                for (j = 0; j < w.rows.length; j++) {
                    if (j < w.frozenPane.rows) {
                        if (w.rows[j] && !w.rows[j].visible) {
                            w.frozenPane.rows++;
                        }
                    } else {
                        break;
                    }
                }
            }
            if (!isNaN(w.frozenPane.columns)) {
                for (j = 0; j < colsSetting.length; j++) {
                    if (j < w.frozenPane.columns) {
                        if (colsSetting[j] && !colsSetting[j].visible) {
                            w.frozenPane.columns++;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        // GrapeCity Begin: Parse the merge cell info to rowSpan and colSpan property of cell.
        var mergeCell;
        for (k = 0; k < mergeCells.length; k++) {
            mergeCell = mergeCells[k];
            if (!w.rows[mergeCell.topRow]) {
                w.rows[mergeCell.topRow] = { cells: [] };
            }
            if (!w.rows[mergeCell.topRow].cells) {
                w.rows[mergeCell.topRow].cells = [];
            }
            if (!w.rows[mergeCell.topRow].cells[mergeCell.leftCol]) {
                w.rows[mergeCell.topRow].cells[mergeCell.leftCol] = {};
            }
            w.rows[mergeCell.topRow].cells[mergeCell.leftCol].rowSpan = mergeCell.bottomRow < w.maxRow ? mergeCell.bottomRow - mergeCell.topRow + 1 : 200;
            w.rows[mergeCell.topRow].cells[mergeCell.leftCol].colSpan = mergeCell.rightCol < w.maxCol ? mergeCell.rightCol - mergeCell.leftCol + 1 : 20;
        }
        // GrapeCity End.
    }

    // Get table.
    private static _getTable(table: string): any {
        var tableOM: any = {};
        tableOM.name = this._getAttr(table, 'name');
        tableOM.range = this._getAttr(table, 'ref');
        var headerRowCnt = this._getAttr(table, 'headerRowCount');
        tableOM.showHeaderRow = headerRowCnt == '' || headerRowCnt === '1';
        var totalRowCnt = this._getAttr(table, 'totalsRowCount');
        tableOM.showTotalRow = totalRowCnt === '1';
        var tableStyleInfo = table.substring(table.indexOf('<tableStyleInfo'));
        var styleName = this._getAttr(tableStyleInfo, 'name');
        if (this._isBuiltInStyleName(styleName)) {
            tableOM.style = {
                name: styleName
            }
        } else {
            tableOM.style = this._getTableStyleByName(styleName);
        }
        tableOM.showBandedColumns = this._getAttr(tableStyleInfo, 'showColumnStripes') === '1';
        tableOM.showBandedRows = this._getAttr(tableStyleInfo, 'showRowStripes') === '1';
        tableOM.alterFirstColumn = this._getAttr(tableStyleInfo, 'showFirstColumn') === '1';
        tableOM.alterLastColumn = this._getAttr(tableStyleInfo, 'showLastColumn') === '1';
        var columns = table.split('<tableColumn ');

        tableOM.columns = [];
        for (var i = 1; i < columns.length; i++) {
            var column = columns[i];
            tableOM.columns.push(this._getTableColumn(column));
        }

        if (table.indexOf('filterColumn') > -1) {
            var columnFilter = table.substring(table.indexOf('<autoFilter'), table.indexOf('</autoFilter>'));
            var filters = columnFilter.split('<filterColumn');
            for (var j = 1; j < filters.length; j++) {
                var filter = filters[j];
                var columnIndex = +this._getAttr(filter, 'colId');
                tableOM.columns[columnIndex].showFilterButton = this._getAttr(filter, 'hiddenButton') !== '1';
            }
        }

        return tableOM;
    }

    // Get table column.
    private static _getTableColumn(column: string): any {
        var columnOM: any = {};
        columnOM.name = this._getAttr(column, 'name');
        var totalRowLabel = this._getAttr(column, 'totalsRowLabel');
        if (totalRowLabel) {
            columnOM.totalRowLabel = totalRowLabel;
        } else {
            var totalRowFormula = this._getAttr(column, 'totalsRowFunction');
            if (totalRowFormula === 'custom') {
                totalRowFormula = column.substring(column.indexOf('<totalsRowFormula>') + 2 + 'totalsRowFormula'.length, column.indexOf('</totalsRowFormula>'));
            }
            columnOM.totalRowFunction = totalRowFormula;
        }

        return columnOM;
    }

    // Get the related table name of the sheet.
    private static _getSheetRelatedTable(rel: string): string {
        var target = this._getAttr(rel, 'Target');
        target = target.substring(target.lastIndexOf('/') + 1);
        for (var i = 0; i < this._tables.length; i++) {
            var table = this._tables[i];
            if (target === table.fileName) {
                return table;
            }
        }
        return null;
    }

    // Get the related external hyperlink of the sheet.
    private static _getSheetRelatedHyperlink(rel: string, id: string, sheet: any) {
        for (var rIdIndex = 0; rIdIndex < sheet.hyperlinkRIds.length; rIdIndex++) {
            var hyperlinkRId = sheet.hyperlinkRIds[rIdIndex];
            if (hyperlinkRId.rId === id) {
                var target = this._getAttr(rel, 'Target');
                if (sheet.rows[hyperlinkRId.ref.row] && sheet.rows[hyperlinkRId.ref.row].cells[hyperlinkRId.ref.col]) {
                    sheet.rows[hyperlinkRId.ref.row].cells[hyperlinkRId.ref.col].link = target;
                }
            }
        }
    }

    // Get table style.
    private static _getTableStyles(styleDefs: string, dxfs: string[]) {
        var styles = styleDefs.split('<tableStyle ');
        var styleIndex = styles.length;
        while (--styleIndex) {
            var styleOM: any = {};
            var style = styles[styleIndex];
            styleOM.name = this._getAttr(style, 'name');
            var styleEles = style.split('<tableStyleElement ');
            var styleEleIndex = styleEles.length;
            while (--styleEleIndex) {
                var styleEle = styleEles[styleEleIndex];
                var styleType = this._getAttr(styleEle, 'type');
                switch (styleType) {
                    case 'firstRowStripe':
                        styleType = 'firstBandedRowStyle';
                        break;
                    case 'secondRowStripe':
                        styleType = 'secondBandedRowStyle';
                        break;
                    case 'firstColumnStripe':
                        styleType = 'firstBandedColumnStyle';
                        break;
                    case 'secondColumnStripe':
                        styleType = 'secondBandedColumnStyle';
                        break;
                    default:
                        styleType += 'Style';
                        break;
                }
                var dxfId = this._getAttr(styleEle, 'dxfId');
                if (dxfId !== '') {
                    styleOM[styleType] = this._getTableStyleElement(dxfs[+dxfId + 1]);
                }
                var size = this._getAttr(styleEle, 'size');
                if (size) {
                    if (styleOM[styleType] == null) {
                        styleOM[styleType] = {};
                    }
                    styleOM[styleType].size = +size;
                }
            }
            this._tableStyles.push(styleOM);
        }
    }

    // Get table style element.
    private static _getTableStyleElement(dxf: string): any {
        var item = null,
            font = null,
            fill = null,
            borders = null;

        var index = dxf.indexOf('<font>');
        if (index >= 0) {
            item = dxf.substring(index, dxf.indexOf('</font>'));
            var size = this._getChildNodeValue(item, "sz");
            font = {
                bold: this._getChildNodeValue(item, "b") === '1',
                italic: this._getChildNodeValue(item, "i") === '1',
                underline: this._getChildNodeValue(item, "u") === '1',
                size: Math.round(size ? +size * 96 / 72 : 14),
                family: this._getChildNodeValue(item, "name"),
                color: this._getColor(item, false)
            }
        }
        item = null;

        index = dxf.indexOf('<fill>');
        if (index >= 0) {
            item = dxf.substring(index, dxf.indexOf('</fill>'));
            fill = { color: this._getColor(item, true) };
        }

        item = null;
        index = dxf.indexOf('<border>');
        if (index >= 0) {
            item = dxf.substring(index, dxf.indexOf('</border>'));
            borders = {
                left: this._getEdgeBorder(item, 'left'),
                right: this._getEdgeBorder(item, 'right'),
                top: this._getEdgeBorder(item, 'top'),
                bottom: this._getEdgeBorder(item, 'bottom'),
                vertical: this._getEdgeBorder(item, 'vertical'),
                horizontal: this._getEdgeBorder(item, 'horizontal')
            }
        }

        return {
            font: font,
            fill: fill,
            borders: borders
        };
    }

    // Gets the table style by its name.
    private static _getTableStyleByName(styleName: string): any {
        var i: number,
            tableStyle: any;

        if (this._tableStyles == null || this._tableStyles.length === 0) {
            return null;
        }

        for (i = 0; i < this._tableStyles.length; i++) {
            tableStyle = this._tableStyles[i];
            if (tableStyle && tableStyle.name.toLowerCase() === styleName.toLowerCase()) {
                return tableStyle;
            }
        }

        return null;
    }

    // Get hyperlink item.
    private static _getHyperlink(sheet: any, hyperlinkPart: string) {
        var refAttr: string,
            ref: string,
            refs: string[],
            refAddress: ITableAddress,
            rId: string,
            location: string;

        refAttr = this._getAttr(hyperlinkPart, 'ref');
        if (refAttr == null) {
            return;
        }
        refs = refAttr.split(':');
        rId = this._getAttr(hyperlinkPart, 'r:id');
        if (rId == null) {
            location = this._getAttr(hyperlinkPart, 'location');
        }
        for (var i = 0; i < refs.length; i++) {
            ref = refs[i];
            refAddress = Workbook.tableAddress(ref);
            if (rId) {
                if (sheet.hyperlinkRIds == null) {
                    sheet.hyperlinkRIds = [];
                }
                sheet.hyperlinkRIds.push({
                    ref: refAddress,
                    rId: rId
                });
            } else if (location) {
                if (sheet.rows[refAddress.row] && sheet.rows[refAddress.row].cells[refAddress.col]) {
                    sheet.rows[refAddress.row].cells[refAddress.col].link = location;
                }
            }
        }
    }

    // Get the font of the text run for rich text.
    private static _getTextRunFont(item: string) {
        var size = this._getChildNodeValue(item, 'sz'),
            tval: string,
            font = {
                bold: item.indexOf('<b/>') >= 0 || this._getChildNodeValue(item, 'b') === 'true',
                italic: item.indexOf('<i/>') >= 0 || this._getChildNodeValue(item, 'i') === 'true',
                underline: item.indexOf('<u/>') >= 0 || ((tval = this._getChildNodeValue(item, 'u')) && tval !== 'none'),
                size: Math.round(size ? +size * 96 / 72 : 14),
                family: this._getChildNodeValue(item, 'rFont'),
                color: this._getColor(item, false)
            }
        return font;
    }

    // Get text from text runs for rich text.
    private static _getTextOfTextRuns(textRuns: IWorkbookTextRun[]): string {
        var i: number,
            textRun: any,
            text: string = '';

        for (i = 0; i < textRuns.length; i++) {
            textRun = textRuns[i];
            if (textRun) {
                text += textRun.text;
            }
        }

        return text;
    }

    // Check whether the style name is built-in table style of excel.
    private static _isBuiltInStyleName(styleName: string): boolean {
        var styleIndex: number;
        if (styleName.search(/TableStyleLight/i) === 0) {
            styleIndex = +styleName.substring(15);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 21) {
                return true;
            }
        } else if (styleName.search(/TableStyleMedium/i) === 0) {
            styleIndex = +styleName.substring(16);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 28) {
                return true;
            }
        } else if (styleName.search(/TableStyleDark/i) === 0) {
            styleIndex = +styleName.substring(14);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 11) {
                return true;
            }
        }
        return false;
    }

    // Generate the _rels doc.
    private static _generateRelsDoc(): string {
        var rels = '<Relationships xmlns="' + this._relationshipsNS + '">' +
            '<Relationship Target="docProps/app.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Id="rId3"/>' +
            '<Relationship Target="docProps/core.xml" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Id="rId2"/>' +
            '<Relationship Target="xl/workbook.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Id="rId1"/>' +
            '</Relationships>';
        return rels;
    }

    // Generate the theme doc.
    private static _generateThemeDoc(): string {
        var theme = '<a:theme name="Office Theme" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
            '<a:themeElements>' +
            this._generateClrScheme() +
            this._generateFontScheme() +
            this._generateFmtScheme() +
            '</a:themeElements>' +
            '<a:objectDefaults/><a:extraClrSchemeLst/>' +
            '</a:theme>';
        return theme;
    }

    // Generate ClrScheme element for theme doc.
    private static _generateClrScheme(): string {
        if (this._colorThemes === null) {
            this._colorThemes = [];
        }
        var clrScheme = '<a:clrScheme name="Office">' +
            '<a:dk1><a:sysClr lastClr="' + (this._colorThemes[1] || '000000') + '" val="windowText"/></a:dk1>' +
            '<a:lt1><a:sysClr lastClr="' + (this._colorThemes[0] || 'FFFFFF') + '" val="window"/></a:lt1>' +
            '<a:dk2><a:srgbClr val="' + (this._colorThemes[3] || '1F497D') + '"/></a:dk2>' +
            '<a:lt2><a:srgbClr val="' + (this._colorThemes[2] || 'EEECE1') + '"/></a:lt2>' +
            '<a:accent1><a:srgbClr val="' + (this._colorThemes[4] || '4F81BD') + '"/></a:accent1>' +
            '<a:accent2><a:srgbClr val="' + (this._colorThemes[5] || 'C0504D') + '"/></a:accent2>' +
            '<a:accent3><a:srgbClr val="' + (this._colorThemes[6] || '9BBB59') + '"/></a:accent3>' +
            '<a:accent4><a:srgbClr val="' + (this._colorThemes[7] || '8064A2') + '"/></a:accent4>' +
            '<a:accent5><a:srgbClr val="' + (this._colorThemes[8] || '4BACC6') + '"/></a:accent5>' +
            '<a:accent6><a:srgbClr val="' + (this._colorThemes[9] || 'F79646') + '"/></a:accent6>' +
            '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>' +
            '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>' +
            '</a:clrScheme>';
        return clrScheme;
    }

    // Generate fontScheme element for theme doc.
    private static _generateFontScheme(): string {
        var fontScheme = '<a:fontScheme name="Office"><a:majorFont>' +
            '<a:latin typeface="Cambria"/>' +
            '<a:ea typeface=""/>' +
            '<a:cs typeface=""/>' +
            '<a:font typeface="ＭＳ Ｐゴシック" script="Jpan"/>' +
            '<a:font typeface="맑은 고딕" script="Hang"/>' +
            '<a:font typeface="宋体" script="Hans"/>' +
            '<a:font typeface="新細明體" script="Hant"/>' +
            '<a:font typeface="Times New Roman" script="Arab"/>' +
            '<a:font typeface="Times New Roman" script="Hebr"/>' +
            '<a:font typeface="Tahoma" script="Thai"/>' +
            '<a:font typeface="Nyala" script="Ethi"/>' +
            '<a:font typeface="Vrinda" script="Beng"/>' +
            '<a:font typeface="Shruti" script="Gujr"/>' +
            '<a:font typeface="MoolBoran" script="Khmr"/>' +
            '<a:font typeface="Tunga" script="Knda"/>' +
            '<a:font typeface="Raavi" script="Guru"/>' +
            '<a:font typeface="Euphemia" script="Cans"/>' +
            '<a:font typeface="Plantagenet Cherokee" script="Cher"/>' +
            '<a:font typeface="Microsoft Yi Baiti" script="Yiii"/>' +
            '<a:font typeface="Microsoft Himalaya" script="Tibt"/>' +
            '<a:font typeface="MV Boli" script="Thaa"/>' +
            '<a:font typeface="Mangal" script="Deva"/>' +
            '<a:font typeface="Gautami" script="Telu"/>' +
            '<a:font typeface="Latha" script="Taml"/>' +
            '<a:font typeface="Estrangelo Edessa" script="Syrc"/>' +
            '<a:font typeface="Kalinga" script="Orya"/>' +
            '<a:font typeface="Kartika" script="Mlym"/>' +
            '<a:font typeface="DokChampa" script="Laoo"/>' +
            '<a:font typeface="Iskoola Pota" script="Sinh"/>' +
            '<a:font typeface="Mongolian Baiti" script="Mong"/>' +
            '<a:font typeface="Times New Roman" script="Viet"/>' +
            '<a:font typeface="Microsoft Uighur" script="Uigh"/>' +
            '<a:font typeface="Sylfaen" script="Geor"/>' +
            '</a:majorFont>' +
            '<a:minorFont>' +
            '<a:latin typeface="Calibri"/>' +
            '<a:ea typeface=""/>' +
            '<a:cs typeface=""/>' +
            '<a:font typeface="ＭＳ Ｐゴシック" script="Jpan"/>' +
            '<a:font typeface="맑은 고딕" script="Hang"/>' +
            '<a:font typeface="宋体" script="Hans"/>' +
            '<a:font typeface="新細明體" script="Hant"/>' +
            '<a:font typeface="Arial" script="Arab"/>' +
            '<a:font typeface="Arial" script="Hebr"/>' +
            '<a:font typeface="Tahoma" script="Thai"/>' +
            '<a:font typeface="Nyala" script="Ethi"/>' +
            '<a:font typeface="Vrinda" script="Beng"/>' +
            '<a:font typeface="Shruti" script="Gujr"/>' +
            '<a:font typeface="DaunPenh" script="Khmr"/>' +
            '<a:font typeface="Tunga" script="Knda"/>' +
            '<a:font typeface="Raavi" script="Guru"/>' +
            '<a:font typeface="Euphemia" script="Cans"/>' +
            '<a:font typeface="Plantagenet Cherokee" script="Cher"/>' +
            '<a:font typeface="Microsoft Yi Baiti" script="Yiii"/>' +
            '<a:font typeface="Microsoft Himalaya" script="Tibt"/>' +
            '<a:font typeface="MV Boli" script="Thaa"/>' +
            '<a:font typeface="Mangal" script="Deva"/>' +
            '<a:font typeface="Gautami" script="Telu"/>' +
            '<a:font typeface="Latha" script="Taml"/>' +
            '<a:font typeface="Estrangelo Edessa" script="Syrc"/>' +
            '<a:font typeface="Kalinga" script="Orya"/>' +
            '<a:font typeface="Kartika" script="Mlym"/>' +
            '<a:font typeface="DokChampa" script="Laoo"/>' +
            '<a:font typeface="Iskoola Pota" script="Sinh"/>' +
            '<a:font typeface="Mongolian Baiti" script="Mong"/>' +
            '<a:font typeface="Arial" script="Viet"/>' +
            '<a:font typeface="Microsoft Uighur" script="Uigh"/>' +
            '<a:font typeface="Sylfaen" script="Geor"/>' +
            '</a:minorFont>' +
            '</a:fontScheme>';
        return fontScheme;
    }

    // Generate fmtScheme element for theme doc.
    private static _generateFmtScheme(): string {
        var fmtScheme = '<a:fmtScheme name="Office">' +
            this._generateFillScheme() +
            this._generateLineStyles() +
            this._generateEffectScheme() +
            this._generateBgFillScheme() +
            '</a:fmtScheme>';
        return fmtScheme;
    }

    // Generate fillStyles element for fmtScheme element.
    private static _generateFillScheme(): string {
        var fillStyles = '<a:fillStyleLst>' +
            '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0"><a:schemeClr val="phClr">' +
            '<a:tint val="50000"/>' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="35000"><a:schemeClr val="phClr">' +
            '<a:tint val="37000"/>' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="100000"><a:schemeClr val="phClr">' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr></a:gs>' +
            '</a:gsLst>' +
            '<a:lin scaled="1" ang="16200000"/>' +
            '</a:gradFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0"><a:schemeClr val="phClr">' +
            '<a:tint val="51000"/>' +
            '<a:satMod val="130000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="80000"><a:schemeClr val="phClr">' +
            '<a:tint val="15000"/>' +
            '<a:satMod val="130000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="100000"><a:schemeClr val="phClr">' +
            '<a:tint val="94000"/>' +
            '<a:satMod val="135000"/>' +
            '</a:schemeClr></a:gs>' +
            '</a:gsLst>' +
            '<a:lin scaled="1" ang="16200000"/>' +
            '</a:gradFill>' +
            '</a:fillStyleLst>';
        return fillStyles;
    }

    // Generate lineStyles element for fmtScheme element.
    private static _generateLineStyles(): string {
        var lineStyles = '<a:lnStyleLst>' +
            '<a:ln algn="ctr" cmpd="sng" cap="flat" w="9525">' +
            '<a:solidFill><a:schemeClr val="phClr">' +
            '<a:shade val="9500"/>' +
            '<a:satMod val="105000"/>' +
            '</a:schemeClr></a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>' +
            '<a:ln algn="ctr" cmpd="sng" cap="flat" w="25400">' +
            '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>' +
            '<a:ln algn="ctr" cmpd="sng" cap="flat" w="38100">' +
            '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>' +
            '</a:lnStyleLst>';
        return lineStyles;
    }

    // Generate effectStyles element for fmtScheme element.
    private static _generateEffectScheme(): string {
        var effectStyles = '<a:effectStyleLst>' +
            '<a:effectStyle><a:effectLst>' +
            '<a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000">' +
            '<a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst></a:effectStyle>' +
            '<a:effectStyle><a:effectLst>' +
            '<a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000">' +
            '<a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst></a:effectStyle>' +
            '<a:effectStyle><a:effectLst>' +
            '<a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000">' +
            '<a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst>' +
            '<a:scene3d>' +
            '<a:camera prst="orthographicFront">' +
            '<a:rot rev="0" lon="0" lat="0"/>' +
            '</a:camera>' +
            '<a:lightRig dir="t" rig="threePt">' +
            '<a:rot rev="1200000" lon="0" lat="0"/>' +
            '</a:lightRig>' +
            '</a:scene3d>' +
            '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>' +
            '</a:effectStyle>' +
            '</a:effectStyleLst>';
        return effectStyles;
    }

    // Generate bgFillStyles element for fmtScheme element.
    private static _generateBgFillScheme(): string {
        var bgFillStyles = '<a:bgFillStyleLst>' +
            '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0"><a:schemeClr val="phClr">' +
            '<a:tint val="40000"/>' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="40000"><a:schemeClr val="phClr">' +
            '<a:tint val="45000"/>' +
            '<a:shade val="99000"/>' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="100000"><a:schemeClr val="phClr">' +
            '<a:tint val="20000"/>' +
            '<a:satMod val="255000"/>' +
            '</a:schemeClr></a:gs>' +
            '</a:gsLst>' +
            '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>' +
            '</a:gradFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0"><a:schemeClr val="phClr">' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr></a:gs>' +
            '<a:gs pos="100000"><a:schemeClr val="phClr">' +
            '<a:tint val="80000"/>' +
            '<a:satMod val="200000"/>' +
            '</a:schemeClr></a:gs>' +
            '</a:gsLst>' +
            '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>' +
            '</a:gradFill>' +
            '</a:bgFillStyleLst>';
        return bgFillStyles;
    }

    // Generate core doc.
    private static _generateCoreDoc(workbook: IWorkbook): string {
        var coreProperties = '<cp:coreProperties ' +
            'xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
            'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
            'xmlns:dcterms="http://purl.org/dc/terms/" ' +
            'xmlns:dcmitype="http://purl.org/dc/dcmitype/" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
        if (!!workbook.creator) {
            coreProperties += '<dc:creator>' + workbook.creator + '</dc:creator>';
        } else {
            coreProperties += '<dc:creator/>';
        }
        if (!!workbook.lastModifiedBy) {
            coreProperties += '<cp:lastModifiedBy>' + workbook.lastModifiedBy + '</cp:lastModifiedBy>';
        } else {
            coreProperties += '<cp:lastModifiedBy/>';
        }
        coreProperties += '<dcterms:created xsi:type="dcterms:W3CDTF">' + (workbook.created || new Date()).toISOString() + '</dcterms:created>' +
            '<dcterms:modified xsi:type="dcterms:W3CDTF">' + (workbook.modified || new Date()).toISOString() + '</dcterms:modified>' +
            '</cp:coreProperties>';
        return coreProperties;
    }

    // Generate sheet global settings.
    private static _generateSheetGlobalSetting(sheetIndex: number, worksheet: _IWorkSheet, workbook: IWorkbook): string {
        var l = worksheet.rows && worksheet.rows[0] && worksheet.rows[0].cells ? worksheet.rows[0].cells.length : 0;
        var ret = ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

        if (this._sheetHasNotes(sheetIndex)) { // the sheet has notes
            ret += ' xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"' +
                ' xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"';
        }

        ret += ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"' +
            ' mc:Ignorable="x14ac"' +
            ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">';

        ret += '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>';
        ret += '<dimension ref="A1' + (l > 0 ? ':' + this._numAlpha(l - 1) + (worksheet.rows.length) : '') + '"/>';
        ret += '<sheetViews><sheetView workbookViewId="0"';
        if (sheetIndex === workbook.activeWorksheet) {
            ret += ' tabSelected="1"';
        }

        let fr = 0, fc = 0;
        if (worksheet.frozenPane && ((fr = worksheet.frozenPane.rows || 0) || (fc = worksheet.frozenPane.columns || 0))) {
            ret += '>'; // sheetView
            ret += '<pane state="frozen"' +
                ' activePane="' + (fr !== 0 && fc !== 0 ? 'bottomRight' : (fr !== 0 ? 'bottomLeft' : 'topRight')) +
                '" topLeftCell="' + (this._numAlpha(fc) + (fr + 1)) +
                '" ySplit="' + fr.toString() +
                '" xSplit="' + fc.toString() +
                '"/>';
            ret += '</sheetView>';
        } else {
            ret += '/>'; // sheetView
        }

        ret += '</sheetViews>';
        ret += '<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>';

        return ret;
    }

    // Generate cell element.
    private static _generateCell(rowIndex: number, colIndex: number,
        styleIndex: number, type: string, val: any, formula: string): string {
        var ret = '<c r="' + this._numAlpha(colIndex) + (rowIndex + 1) +
            '" s="' + styleIndex.toString() + '"';
        if (!!type) {
            ret += ' t="' + type + '"';
        }
        var children = '';
        if (!!formula) {
            if (formula[0] === '=') {
                formula = formula.substring(1);
            }
            // Replace the '@' to '#This Row' for importing structured references.
            formula = formula.replace(/\@\s*/gi, '[#This Row], ');
            children += '<f>' + Workbook._escapeXML(formula) + '</f>';
        }
        if (val != null && val !== '') {
            children += '<v>' + val + '</v>';
        }
        //return cell;
        return ret + (children ? '>' + children + '</c>' : '/>');
    }

    // Generate merge cell setting.
    private static _generateMergeSetting(merges: any[]): string {
        var ret = '<mergeCells count="' + merges.length.toString() + '">';
        for (var i = 0; i < merges.length; i++) {
            ret += '<mergeCell ref="' + merges[i].join(':') + '"/>';
        }
        return ret + '</mergeCells>';
    }

    // Generate style doc
    private static _generateStyleDoc(): string {
        var styleSheet = '<styleSheet ' +
            'xmlns="' + this._workbookNS + '" ' +
            'xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" ' +
            'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
            'mc:Ignorable="x14ac">';

        var numFmts = '';
        var numFmt = '';
        var customNumFmts = [];
        var i = 0;
        var newFormatIndex = 0;
        var fonts = '';
        var fontEle = '';
        fontEle = this._generateFontStyle({}, true);
        var fills = '';
        var fillEle = '';
        fillEle += this._generateFillStyle('none', null);
        fillEle += this._generateFillStyle('gray125', null);
        var borders = '';
        var borderEle = '';
        borderEle += this._generateBorderStyle({});
        var cellXfs = '';
        var cellXf = '';
        cellXf += this._generateCellXfs(0, 0, 0, 0, {});
        while (i < this._styles.length) {
            var style = this._styles[i];

            if (!!style) {
                style = JSON.parse(style);
                // cell formatting, refer to it if necessary
                var formatIndex = 0;
                if (style.format && style.format !== 'General') {
                    formatIndex = this._numFmts.indexOf(style.format);
                    if (formatIndex < 0) {
                        var cusFmtIdx = customNumFmts.indexOf(style.format);
                        if (cusFmtIdx === -1) {
                            customNumFmts.push(style.format);
                            formatIndex = 164 + newFormatIndex;
                            numFmt += '<numFmt numFmtId="' + formatIndex.toString() + '" formatCode="' + style.format + '"/>';
                            newFormatIndex++;
                        } else {
                            formatIndex = 164 + cusFmtIdx;
                        }

                    }
                }

                // border declaration: add a new declaration and refer to it in style
                var borderIndex = 0;
                if (style.borders) {
                    // try to reuse existing border
                    var border = JSON.stringify(style.borders);
                    borderIndex = this._borders.indexOf(border);
                    if (borderIndex < 0) {
                        borderIndex = this._borders.push(border) - 1;
                        borderEle += this._generateBorderStyle(style.borders);
                    }
                }

                // font declaration: add a new declaration and refer to it in style
                var fontIndex = 0;
                if (style.font) {
                    var font = JSON.stringify(style.font);
                    // try to reuse existing font
                    fontIndex = this._fonts.indexOf(font);
                    if (fontIndex < 0) {
                        fontIndex = this._fonts.push(font) - 1;
                        fontEle += this._generateFontStyle(style.font);
                    }
                }

                // Add fill color property
                var fillIndex = 0;
                if (style.fill && style.fill.color) {
                    var fill = JSON.stringify(style.fill);;
                    fillIndex = this._fills.indexOf(fill);
                    if (fillIndex < 0) {
                        fillIndex = this._fills.push(fill) - 1;
                        fillEle += this._generateFillStyle('solid', style.fill.color);
                    }
                }

                cellXf += this._generateCellXfs(formatIndex, borderIndex, fontIndex, fillIndex, style);
            }
            i++;
        }

        customNumFmts = null;

        if (newFormatIndex > 0) {
            numFmts = '<numFmts count="' + newFormatIndex + '">';
            numFmts += numFmt;
            numFmts += '</numFmts>';
        } else {
            numFmts = '<numFmts count="0"/>';
        }
        styleSheet += numFmts;
        fonts = '<fonts count="' + this._fonts.length + '" x14ac:knownFonts="1">';
        fonts += fontEle;
        fonts += '</fonts>';
        styleSheet += fonts;
        fills = '<fills count="' + this._fills.length + '">';
        fills += fillEle;
        fills += '</fills>';
        styleSheet += fills;
        borders = '<borders count="' + this._borders.length + '">';
        borders += borderEle;
        borders += '</borders>';
        styleSheet += borders;
        styleSheet += '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
        cellXfs = '<cellXfs count="' + this._styles.length + '">';
        cellXfs += cellXf;
        cellXfs += '</cellXfs>';
        var dxfs = '';
        var tableStylesEle = '';
        if (this._tableStyles.length > 0) {
            this._getDxfs();
            if (this._dxfs.length > 0) {
                dxfs = this._generateDxfs();
            }
            tableStylesEle = this._generateTableStyles();
        }
        styleSheet += cellXfs +
            '<cellStyles count="1"><cellStyle xfId="0" builtinId="0" name="Normal"/></cellStyles>' +
            (dxfs === '' ? '<dxfs count="0"/>' : dxfs) +
            (tableStylesEle === '' ? '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>' : tableStylesEle) +
            '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}">' +
            '<x14ac:slicerStyles defaultSlicerStyle="SlicerStyleLight1" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"/>' +
            '</ext></extLst>' +
            '</styleSheet>';

        return styleSheet;
    }

    // Generate border style element.
    private static _generateBorderStyle(borders: any, isTable: boolean = false): string {
        var border = '<border>',
            edgeEle: string,
            color: any,
            colorEle: string;

        for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0, vertical: 0, horizontal: 0 }) {
            if (!isTable && (edge === 'vertical' || edge === 'horizontal')) {
                continue;
            }
            if (borders[edge]) {
                edgeEle = '<' + edge + ' style="' + borders[edge].style + '">';
                colorEle = '';
                color = borders[edge].color;
                color = color ? (color[0] === '#' ? color.substring(1) : color) : '';
                // add transparency if missing
                if (color.length === 6) {
                    color = 'FF' + color;
                }
                if (!color) {
                    color = 'FF000000';
                }
                colorEle = '<color rgb="' + color + '"/>';

                edgeEle += colorEle;
                edgeEle += '</' + edge + '>';
            } else {
                edgeEle = '<' + edge + '/>';
            }
            border += edgeEle;
        }
        border += '</border>';

        return border;
    }

    // Generate font style element.
    private static _generateFontStyle(fontStyle: IWorkbookFont, needScheme: boolean = false, isRunProps = false): string {
        var font = isRunProps ? '<rPr>' : '<font>';

        if (fontStyle.bold) {
            font += '<b/>';
        }
        if (fontStyle.italic) {
            font += '<i/>';
        }
        if (fontStyle.underline) {
            font += '<u/>';
        }
        var value = fontStyle.size ? Math.round(fontStyle.size * 72 / 96) : this._defaultFontSize;
        font += '<sz val="' + value + '"/>';
        if (!!fontStyle.color) {
            font += '<color rgb="FF' + this._parseColor(fontStyle.color).substring(1) + '"/>';
        } else {
            font += '<color theme="1"/>';
        }

        font += `<${isRunProps ? 'rFont' : 'name'} val="${fontStyle.family || this._defaultFontName}" />`;

        font += '<family val="2"/>'; // 2 = Roman
        if (needScheme) {
            font += '<scheme val="minor"/>';
        }

        font += isRunProps ? '</rPr>' : '</font>';
        return font;
    }

    // Generate fill style element
    private static _generateFillStyle(patternType: string, fillColor: any, isTableStyle: boolean = false): string {
        var fillEle = '<fill><patternFill patternType="' + patternType + '">',
            fillColorTag: string;

        if (!!fillColor) {
            fillColorTag = isTableStyle ? '<bgColor ' : '<fgColor ';
            fillColorTag += 'rgb="FF' + (fillColor[0] === '#' ? fillColor.substring(1) : fillColor) + '"/>';
            fillEle += fillColorTag;
        }
        fillEle += '</patternFill></fill>';

        return fillEle;
    }

    // Generate xf element
    private static _generateCellXfs(numFmtId: number, borderId: number, fontId: number, fillId: number, style: any): string {
        var cellXf = '<xf xfId="0" ';

        cellXf += 'numFmtId="' + numFmtId.toString() + '" ';
        if (numFmtId > 0) {
            cellXf += 'applyNumberFormat="1" ';
        }
        cellXf += 'borderId="' + borderId.toString() + '" ';
        if (borderId > 0) {
            cellXf += 'applyBorder="1" ';
        }
        cellXf += 'fontId="' + fontId.toString() + '" ';
        if (fontId > 0) {
            cellXf += 'applyFont="1" ';
        }
        cellXf += 'fillId="' + fillId.toString() + '" ';
        if (fillId > 0) {
            cellXf += 'applyFill="1" ';
        }
        if (style.quotePrefix) {
            cellXf += 'quotePrefix="1" ';
        }

        if (style.hAlign || style.vAlign || style.indent || style.wordWrap) {
            cellXf += 'applyAlignment="1">';
            var alignment = '<alignment ';
            if (style.hAlign) {
                alignment += 'horizontal="' + style.hAlign + '" ';
            }
            if (style.vAlign) {
                alignment += 'vertical="' + style.vAlign + '" ';
            }
            if (style.indent) {
                alignment += 'indent="' + style.indent + '" ';
            }
            if (style.wordWrap) {
                alignment += 'wrapText="1"';
            }
            alignment += '/>';
            cellXf += alignment;
            cellXf += '</xf>';
        } else {
            cellXf += '/>';
        }

        return cellXf;
    }

    // Generate content types doc
    private static _generateContentTypesDoc(workbook: IWorkbook): string {
        var types = '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">';

        var sheets = workbook.sheets;
        var hasNotes = sheets.reduce((acc: boolean, cur, curIdx) => acc || this._sheetHasNotes(curIdx), this._sheetHasNotes(0));

        if (this._macroEnabled) {
            types += '<Default ContentType="application/vnd.ms-office.vbaProject" Extension="bin"/>';
        }

        if (hasNotes) {
            types += '<Default Extension="vml" ContentType = "application/vnd.openxmlformats-officedocument.vmlDrawing" />';
        }

        types += '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>' +
            '<Default ContentType="application/xml" Extension="xml"/>' +
            '<Override ContentType="' + (this._macroEnabled ? 'application/vnd.ms-excel.sheet.macroEnabled.main+xml' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml') + '" PartName="/xl/workbook.xml"/>';


        for (let i = 0; i < this._contentTypes.length; i++) {
            types += this._contentTypes[i];
        }

        types += '<Override ContentType="application/vnd.openxmlformats-officedocument.theme+xml" PartName="/xl/theme/theme1.xml"/>' +
            '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>' +
            '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>' +
            '<Override ContentType="application/vnd.openxmlformats-package.core-properties+xml" PartName="/docProps/core.xml"/>' +
            '<Override ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" PartName="/docProps/app.xml"/>';

        if (hasNotes) {
            for (let i = 0, j = 0; i < sheets.length; i++) {
                if (this._sheetHasNotes(i)) {
                    types += `<Override PartName="/xl/comments${++j}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"/>`;
                }
            }
        }

        for (let i = 0; i < this._tables.length; i++) {
            types += '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml" PartName="/xl/tables/' + this._tables[i] + '"/>';
        }

        types += '</Types>';

        return types;
    }

    // Generate app doc
    private static _generateAppDoc(file: any): string {
        var props = '<Properties xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes" xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">' +
            '<Application>' + (file.application || 'wijmo.xlsx') + '</Application>' +
            '<DocSecurity>0</DocSecurity>' +
            '<ScaleCrop>false</ScaleCrop>' +
            '<HeadingPairs><vt:vector baseType="variant" size="2">' +
            '<vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>' +
            '<vt:variant><vt:i4>' + this._props.length + '</vt:i4></vt:variant>' +
            '</vt:vector></HeadingPairs>' +
            '<TitlesOfParts><vt:vector baseType="lpstr" size="' + this._props.length + '">';
        for (var i = 0; i < this._props.length; i++) {
            props += '<vt:lpstr>' + this._props[i] + '</vt:lpstr>';
        }
        props += '</vt:vector></TitlesOfParts>' +
            '<Manager/>' +
            '<Company>' + (file.company || 'GrapeCity, Inc.') + '</Company>' +
            '<LinksUpToDate>false</LinksUpToDate>' +
            '<SharedDoc>false</SharedDoc>' +
            '<HyperlinksChanged>false</HyperlinksChanged>' +
            '<AppVersion>1.0</AppVersion>' +
            '</Properties>';

        return props;
    }

    // Generate workbook relationships doc
    private static _generateWorkbookRels(): string {
        var rels = '<Relationships xmlns="' + this._relationshipsNS + '">';
        for (var i = 0; i < this._xlRels.length; i++) {
            rels += this._xlRels[i];
        }
        rels += '<Relationship Target="sharedStrings.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Id="rId' + (this._xlRels.length + 1) + '"/>' +
            '<Relationship Target="styles.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Id="rId' + (this._xlRels.length + 2) + '"/>' +
            '<Relationship Target="theme/theme1.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Id="rId' + (this._xlRels.length + 3) + '"/>';
        if (this._macroEnabled) {
            rels += '<Relationship Target="vbaProject.bin" Type="http://schemas.microsoft.com/office/2006/relationships/vbaProject" Id="rId' + (this._xlRels.length + 4) + '"/>';
        }
        rels += '</Relationships>';

        return rels;
    }

    // Generate workbook doc
    private static _generateWorkbook(file: any): string {
        var workbook = '<workbook xmlns="' + this._workbookNS + '" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
            '<fileVersion rupBuild="9303" lowestEdited="5" lastEdited="5" appName="xl"/>' +
            '<workbookPr/>' +
            '<bookViews><workbookView xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"' + (file.activeWorksheet != null ? ' activeTab="' + file.activeWorksheet.toString() + '"' : '') + '/></bookViews>' +
            '<sheets>',
            i: number;
        for (var i = 0; i < this._worksheets.length; i++) {
            workbook += this._worksheets[i];
        }
        workbook += '</sheets>';

        if (file.definedNames && file.definedNames.length > 0) {
            workbook += '<definedNames>';
            for (i = 0; i < file.definedNames.length; i++) {
                var sheetIndex = -1;
                if (file.definedNames[i].sheetName) {
                    sheetIndex = this._getSheetIndexBySheetName(file, file.definedNames[i].sheetName);
                }
                workbook += '<definedName name="' + file.definedNames[i].name + '" ' + (sheetIndex > -1 ? 'localSheetId="' + sheetIndex + '"' : '') + '>' +
                    file.definedNames[i].value + '</definedName>';
            }
            workbook += '</definedNames>';
        }

        workbook += '<calcPr fullCalcOnLoad="1"/></workbook>';
        return workbook;
    }


    // progress: 0..100
    private static _generateWorksheetRows(batchStart: number, startIndex: number, sheet: _IWorkSheet, sheetStyle, columnsStyle, out: _IGenerateWorksheetRowsOutput, cs: _ICancellationSource, isAsync: boolean, progress: (value: number) => void, done: Function) {
        const _BATCH_SIZE = 100, // number of rows per batch
            _BATCH_DELAY = 100, // ms
            _BATCH_TIMEOUT = 0; // ms

        let rows = sheet.rows;

        for (let i = startIndex, len = rows.length; i < len; i++) {
            if (cs && cs.cancelled) {
                return;
            }

            // let go of the thread for a while
            if (isAsync && i - startIndex > _BATCH_SIZE && Date.now() - batchStart > _BATCH_DELAY) {
                setTimeout(() => {
                    if (cs && cs.cancelled) {
                        return;
                    }

                    progress(Math.round((i + 1) / rows.length * 100));
                    this._generateWorksheetRows(Date.now(), i, sheet, sheetStyle, columnsStyle, out, cs, isAsync, progress, done);
                }, _BATCH_TIMEOUT);

                return;
            }

            let j = -1,
                k = rows[i] && rows[i].cells ? rows[i].cells.length : 0,
                rowStyle = null;
            // Add row visibility, row height and group level for current excel row.

            out.sheetData += '<row x14ac:dyDescent="0.25" r="' + (i + 1).toString() + '"';
            if (!!rows[i]) {
                if (rows[i].height) {
                    out.sheetData += ' customHeight="1" ht="' + (+rows[i].height * 72 / 96).toString() + '"';
                }
                if (rows[i].groupLevel) {
                    out.sheetData += ' outlineLevel="' + (rows[i].groupLevel).toString() + '"';
                }
                rowStyle = rows[i].style ? this._cloneStyle(rows[i].style) : null;
                if (rowStyle) {
                    rowStyle = this._resolveStyleInheritance(rowStyle);
                    if (rowStyle.font && rowStyle.font.color) {
                        rowStyle.font.color = this._parseColor(rowStyle.font.color);
                    }
                    if (rowStyle.fill && rowStyle.fill.color) {
                        rowStyle.fill.color = this._parseColor(rowStyle.fill.color);
                    }
                    if (rowStyle.hAlign != null && !wijmo.isString(rowStyle.hAlign)) {
                        rowStyle.hAlign = Workbook._parseHAlignToString(wijmo.asEnum(rowStyle.hAlign, HAlign));
                    }
                    if (rowStyle.vAlign != null && !wijmo.isString(rowStyle.vAlign)) {
                        rowStyle.vAlign = Workbook._parseVAlignToString(wijmo.asEnum(rowStyle.vAlign, VAlign));
                    }
                    let strStyle = JSON.stringify(rowStyle),
                        styleIndex = this._styles.indexOf(strStyle);
                    if (styleIndex < 0) {
                        styleIndex = this._styles.push(strStyle) - 1;
                    }
                    out.sheetData += ' customFormat="1" s="' + styleIndex.toString() + '"';
                }
            }
            if (rows[i] && rows[i].visible === false) {
                out.sheetData += ' hidden="1"';
            }
            if (rows[i] && rows[i].collapsed === true) {
                out.sheetData += ' collapsed="1"';
            }
            out.sheetData += '>'; // <row>

            while (++j < k) {
                let cell = rows[i].cells[j];

                if (cell == undefined) { // The cells is a sparse array, skip empty cells (467873).
                    continue;
                }

                let t = '',
                    index = -1,
                    textRuns = cell ? cell.textRuns : null,
                    val = cell && cell.hasOwnProperty('value') ? cell.value : cell,
                    cellStyle = cell && cell.style ? this._cloneStyle(cell.style) : {};

                // Resolve the inheritance style.
                cellStyle = this._resolveStyleInheritance(cellStyle);
                // Extends the cell style with worksheet style, column style and row style.
                let columnStyle = columnsStyle[j];
                if (columnStyle) {
                    columnStyle = this._resolveStyleInheritance(columnStyle);
                    cellStyle = this._extend(cellStyle, columnStyle);
                }
                if (rowStyle) {
                    cellStyle = this._extend(cellStyle, rowStyle);
                }
                if (sheetStyle) {
                    sheetStyle = this._resolveStyleInheritance(sheetStyle);
                    cellStyle = this._extend(cellStyle, sheetStyle);
                }
                // Parse the hAlign/vAlign from enum to string.
                if (cellStyle.hAlign != null && !wijmo.isString(cellStyle.hAlign)) {
                    cellStyle.hAlign = Workbook._parseHAlignToString(wijmo.asEnum(cellStyle.hAlign, HAlign));
                }
                if (cellStyle.vAlign != null && !wijmo.isString(cellStyle.vAlign)) {
                    cellStyle.vAlign = Workbook._parseVAlignToString(wijmo.asEnum(cellStyle.vAlign, VAlign));
                }

                // Parse the different color pattern to Hex pattern like #RRGGBB for the font color and fill color.
                if (cellStyle.font && cellStyle.font.color) {
                    cellStyle.font.color = this._parseColor(cellStyle.font.color);
                }
                if (cellStyle.fill && cellStyle.fill.color) {
                    cellStyle.fill.color = this._parseColor(cellStyle.fill.color);
                }

                this._applyDefaultBorder(cellStyle);
                // Parse the border setting incluing border color and border style for each border.
                if (cellStyle.borders) {
                    cellStyle.borders = this._extend({}, cellStyle.borders);
                    this._parseBorder(cellStyle.borders, !!cellStyle.fill && !!cellStyle.fill.color);
                }

                if ((cell && cell.isDate) && !wijmo.isDate(val)) {
                    var dateVal = new Date(val);
                    if (wijmo.isDate(dateVal)) {
                        val = dateVal;
                    }
                }

                if (wijmo.isNumber(val) && (isNaN(val) || !isFinite(val))) {
                    val = val.toString();
                }

                // GrapeCity: remove the isFinite checking for the string value.  If the value is string, it will always be exported as string.
                if (textRuns || (val && wijmo.isString(val) && (cellStyle.format === '@' || cellStyle.format === 'General' || (+val).toString() !== val || !isFinite(+val)))) {
                    // If value is string, and not string of just a number, place a sharedString reference instead of the value
                    this._sharedStrings[1]++; // Increment total count, unique count derived from sharedStrings[0].length
                    val = textRuns ? '{RichTextMark}' + JSON.stringify(textRuns) : Workbook._unescapeXML(val);
                    if (val[0] === '\'') {
                        cellStyle.quotePrefix = true;
                        val = val.substring(1);
                    }
                    index = this._sharedStrings[0].indexOf(val);
                    if (index < 0) {
                        index = this._sharedStrings[0].push(val) - 1;
                    }
                    val = index;
                    t = 's';
                } else if (wijmo.isBoolean(val)) {
                    val = (val ? 1 : 0); t = 'b';
                } else if (wijmo.isDate(val)) {
                    val = this._convertDate(val);
                    cellStyle.format = cellStyle.format || 'mm-dd-yy';
                } else if (wijmo.isObject(val)) {
                    val = null;
                } // unsupported value

                // use stringified version as unique and reproducible style signature
                let strStyle = JSON.stringify(cellStyle),
                    styleIndex = this._styles.indexOf(strStyle);
                if (styleIndex < 0) {
                    styleIndex = this._styles.push(strStyle) - 1;
                }

                // store merges if needed and add missing cells. Cannot have rowSpan AND colSpan
                // Update for merge cells processing.
                if (cell) {
                    if ((cell.colSpan != null && cell.colSpan > 1) || (cell.rowSpan != null && cell.rowSpan > 1)) {
                        cell.colSpan = cell.colSpan || 1;
                        cell.rowSpan = cell.rowSpan || 1;
                        if (this._checkValidMergeCell(out.merges, i, cell.rowSpan, j, cell.colSpan)) {
                            out.merges.push([this._numAlpha(j) + (i + 1), this._numAlpha(j + cell.colSpan - 1) + (i + cell.rowSpan)]);
                        }
                    }
                }
                if (cell && cell.link) {
                    if (out.hyperlinks == null) {
                        out.hyperlinks = [];
                    }
                    out.hyperlinks.push({
                        ref: Workbook.xlsxAddress(i, j),
                        value: val,
                        href: cell.link
                    });
                }
                cellStyle = null;
                out.sheetData += this._generateCell(i, j, styleIndex, t, val, cell && cell.formula ? cell.formula : null);
            }
            out.sheetData += '</row>';
        }

        if (wijmo.isFunction(done)) {
            done();
        }
    }

    // done == Function means async.
    // progress 0..100
    private static _generateWorkSheet(sheetIndex: number, workbook: IWorkbook, xlWorksheets: any, cs: _ICancellationSource, isAsync: boolean, progress: (value: number) => void): _SyncPromise {
        // Generate worksheet (gather sharedStrings) then generate entries for constant files below
        let worksheet = workbook.sheets[sheetIndex] as _IWorkSheet;

        if (!worksheet) {
            throw 'Worksheet should not be empty!'
        }

        //console.log(`Came to WorkSheet generation in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
        //window['xlsxTime'] = Date.now();

        progress(0);

        this._collectNotes(worksheet, sheetIndex);

        let p = new _SyncPromise(cs),
            columnSettings = worksheet.columns,
            columnsStyle = this._cloneColumnsStyle(columnSettings),
            sheetStyle = worksheet.style ? this._cloneStyle(worksheet.style) : null,
            sheetDoc = '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
                + this._generateSheetGlobalSetting(sheetIndex, worksheet, workbook);

        let output: _IGenerateWorksheetRowsOutput = {
            hyperlinks: [],
            merges: [],
            sheetData: '<sheetData>'
        };

        this._generateWorksheetRows(Date.now(), 0, worksheet, sheetStyle, columnsStyle, output, cs, isAsync, progress, () => {
            let id = sheetIndex + 1;

            output.sheetData += '</sheetData>';

            //cols = null;
            if (columnSettings && columnSettings.length > 0) {
                sheetDoc += '<cols>';

                for (let i = 0; i < columnSettings.length; i++) {
                    sheetDoc += this._generateWorksheetColumn(columnsStyle[i], columnSettings[i], i);
                }

                let extra = worksheet._extraColumn;
                if (extra) {
                    extra.min = Math.max(columnSettings.length, extra.min); // in case the user has changed the columns manually...
                    if (extra.min <= extra.max) { // ... and the extra column definition is still valid.
                        sheetDoc += this._generateWorksheetColumn(extra.style, extra, -1);
                    }
                }

                sheetDoc += '</cols>';
            }
            output.sheetData = sheetDoc + output.sheetData;
            sheetDoc = output.sheetData;
            output.sheetData = null;

            if (output.merges.length > 0) {
                sheetDoc += this._generateMergeSetting(output.merges);
            }

            let relIndex = 1,
                vmlRelId = 0;

            if (this._sheetHasNotes(sheetIndex)) {
                vmlRelId = relIndex++; // reserving the ID.
            }

            let hyperlinks = output.hyperlinks;
            if (hyperlinks && hyperlinks.length > 0) {
                sheetDoc += '<hyperlinks>';
                for (let i = 0; i < hyperlinks.length; i++) {
                    if (/\'?(\w+)\'?\!\$?[A-Za-z]{1,2}\$?\d+(:\$?[A-Za-z]{1,2}\$?\d+)?/.test(hyperlinks[i].href)
                        || /^\$?[A-Za-z]{1,2}\$?\d+(:\$?[A-Za-z]{1,2}\$?\d+)?$/.test(hyperlinks[i].href)) {
                        sheetDoc += '<hyperlink ref="' + hyperlinks[i].ref + '" display="' + hyperlinks[i].value + '" location="' + hyperlinks[i].href + '"/>';
                    } else {
                        if (worksheet.externalLinks == null) {
                            worksheet.externalLinks = [];
                        }
                        worksheet.externalLinks.push(hyperlinks[i].href);
                        sheetDoc += '<hyperlink ref="' + hyperlinks[i].ref + '" r:id="rId' + relIndex + '"/>';
                        relIndex++;
                    }
                }
                sheetDoc += '</hyperlinks>';
            }

            sheetDoc += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>';


            if (worksheet.tables && worksheet.tables.length > 0) {
                sheetDoc += '<tableParts count="' + worksheet.tables.length + '">';
                for (let i = 0; i < worksheet.tables.length; i++) {
                    sheetDoc += '<tablePart r:id="rId' + relIndex + '"/>';
                    relIndex++;
                }
                sheetDoc += '</tableParts>';
            }

            // It looks like Excel is showing an error if legacyDrawing is not the last element...
            if (vmlRelId > 0) { // if the sheet has notes
                sheetDoc += `<legacyDrawing r:id="rId${vmlRelId}"/>`;
            }

            sheetDoc += '</worksheet>';

            //console.log(`sheetDoc.length = ${sheetDoc.length}`);
            //console.log(`WorkSheet xml string created in ${(Date.now() - window['xlsxTime']) / 1000} seconds`);
            //window['xlsxTime'] = Date.now();

            xlWorksheets.file('sheet' + id + '.xml', this._xmlDescription + sheetDoc);
            sheetDoc = null; // free memory

            var contentType = '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet' + id + '.xml"/>';
            this._contentTypes.unshift(contentType);
            this._props.unshift(Workbook._escapeXML(worksheet.name) || 'Sheet' + id);
            var xlRel = '<Relationship Target="worksheets/sheet' + id + '.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Id="rId' + id + '"/>';
            this._xlRels.unshift(xlRel);
            var sheetEle = '<sheet r:id="rId' + id + '" sheetId="' + id + '" name="' + (Workbook._escapeXML(worksheet.name) || 'Sheet' + id) + '"' + (worksheet.visible === false ? ' state="hidden"' : '') + '/>';
            this._worksheets.unshift(sheetEle);

            progress(100);
            p.resolve();
        });

        return p;
    }

    // colIdx = -1 means that it is a rightmost column definition outside the worksheet dimensions.
    private static _generateWorksheetColumn(colStyle, colSettings, colIdx: number): string {
        let styleIndex = -1,
            result = '';

        // Add the column visibilty for the excel column
        if (!this._isEmpty(colStyle)) {
            colStyle = this._resolveStyleInheritance(colStyle);
            if (colStyle.font && colStyle.font.color) {
                colStyle.font.color = this._parseColor(colStyle.font.color);
            }
            if (colStyle.fill && colStyle.fill.color) {
                colStyle.fill.color = this._parseColor(colStyle.fill.color);
            }
            if (colStyle.hAlign != null && !wijmo.isString(colStyle.hAlign)) {
                colStyle.hAlign = Workbook._parseHAlignToString(wijmo.asEnum(colStyle.hAlign, HAlign));
            }
            if (colStyle.vAlign != null && !wijmo.isString(colStyle.vAlign)) {
                colStyle.vAlign = Workbook._parseVAlignToString(wijmo.asEnum(colStyle.vAlign, VAlign));
            }

            let strStyle = JSON.stringify(colStyle);
            styleIndex = this._styles.indexOf(strStyle);
            if (styleIndex < 0) {
                styleIndex = this._styles.push(strStyle) - 1;
            }
        }

        if (!this._isEmpty(colSettings)) {
            let colWidth = colSettings.width;
            if (colWidth != null) {
                if (typeof colWidth === 'string' && colWidth.indexOf('ch') > -1) {
                    colWidth = this._parseCharCountToCharWidth(colWidth.substring(0, colWidth.indexOf('ch')));
                } else {
                    colWidth = this._parsePixelToCharWidth(colWidth);
                }
            } else {
                colWidth = 8.43;
            }

            if (colIdx == -1) { // the rightmost out-of-dimensions column (467873).
                result += '<col min="' + (<_IWorkbookExtraColumn>colSettings).min + '" max="' + (<_IWorkbookExtraColumn>colSettings).max + '"';
            } else {
                var colIdxStr = (colIdx + 1).toString();
                result += '<col min="' + colIdxStr + '" max="' + colIdxStr + '"';
            }
            if (styleIndex >= 0) {
                result += ' style="' + styleIndex.toString() + '"';
            }
            if (!!colWidth) {
                result += ' width="' + colWidth + '" customWidth="1"';
            }
            if (colSettings.autoWidth !== false) {
                result += ' bestFit="1"';
            }
            if (colSettings.visible === false) {
                result += ' hidden="1"';
            }
            result += '/>'; // <col .../>
        }

        return result;
    }

    // Generate shared strings doc.
    private static _generateSharedStringsDoc(): string {
        var ret = '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' +
            this._sharedStrings[1] + '" uniqueCount="' + this._sharedStrings[0].length + '">';

        for (var i = 0; i < this._sharedStrings[0].length; i++) {
            ret += '<si>';
            var val = this._sharedStrings[0][i];
            if (val && val.indexOf('{RichTextMark}') === 0) {
                try {
                    var textRuns = JSON.parse(val.substring(14)) as IWorkbookTextRun[];
                    ret += this._generateTextRuns(textRuns, this._defaultFontName.toLowerCase()) + '</si>';
                } catch (ex) {
                    ret += this._generatePlainText(val) + '</si>';
                }
            } else {
                ret += this._generatePlainText(val) + '</si>';
            }
        }
        return ret + '</sst>';
    }

    private static _generateTextRuns(textRuns: IWorkbookTextRun[], defFont: string): string {
        let ret = '';

        if (textRuns && textRuns.length > 0) {
            for (var j = 0; j < textRuns.length; j++) {
                ret += '<r>';
                let textRun = textRuns[j];

                if (textRun.font) {
                    let useMinorScheme = !textRun.font.family || (textRun.font.family.toLowerCase() === defFont);
                    ret += this._generateFontStyle(textRun.font, useMinorScheme, true);
                }

                ret += this._generatePlainText(textRun.text);
                ret += '</r>';
            }
        }

        return ret;
    }

    // Generate plain text node in the shared string doc.
    private static _generatePlainText(val: string): string {
        if (val === '') {
            return '<t/>';
        }

        var ret = '<t';
        if (wijmo.isNullOrWhiteSpace(val) || /^\s+\w*|\w*\s+$/.test(val)) {
            ret += ' xml:space="preserve"';
        }
        ret += '>' + Workbook._escapeXML(val) + '</t>';
        return ret;
    }

    // Generate tables.
    private static _generateTable(table: _IWorkbookTable, xlTables: any) {
        var tableId = this._tables.length + 1;
        var fileName = 'table' + tableId + '.xml';
        table.fileName = fileName;
        this._tables.push(fileName);
        var tableDoc = '<table ref="' + table.range + '" displayName="' + table.name + '" name="' + table.name + '" id="' + tableId + '" ' +
            (table.showHeaderRow === false ? 'headerRowCount="0" ' : '') + (table.showTotalRow === true ? 'totalsRowCount="1" ' : 'totalsRowShown="0" ') +
            ' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

        if (table.showHeaderRow !== false) {
            tableDoc += this._generateTableFilterSetting(table.range, table.showTotalRow, table.columns);
        }

        tableDoc += '<tableColumns count="' + table.columns.length + '">';
        var columnDoc = '';
        for (var i = 0; i < table.columns.length; i++) {
            var column = table.columns[i];
            columnDoc += '<tableColumn name="' + column.name + '" id="' + (i + 1) + '" '
            if (column.totalRowFunction) {
                if (this._tableColumnFunctions.indexOf(column.totalRowFunction) > -1) {
                    columnDoc += 'totalsRowFunction="' + column.totalRowFunction + '"/>';
                } else {
                    columnDoc += 'totalsRowFunction="custom"><totalsRowFormula>' + column.totalRowFunction + '</totalsRowFormula></tableColumn>';
                }
            } else {
                columnDoc += (column.totalRowLabel ? 'totalsRowLabel="' + column.totalRowLabel + '"' : '') + '/>';
            }
        }
        tableDoc += columnDoc + '</tableColumns>';
        tableDoc += '<tableStyleInfo name="' + table.style.name + '" showColumnStripes="' + (table.showBandedColumns ? '1' : '0') + '" showRowStripes="' + (table.showBandedRows ? '1' : '0')
            + '" showLastColumn="' + (table.alterLastColumn ? '1' : '0') + '" showFirstColumn="' + (table.alterFirstColumn ? '1' : '0') + '"/>'
            + '</table>';

        if (!this._isBuiltInStyleName(table.style.name)) {
            var tableStyle = JSON.stringify(table.style);
            if (this._tableStyles.indexOf(tableStyle) === -1) {
                this._tableStyles.push(tableStyle);
            }
        }

        xlTables.file(fileName, this._xmlDescription + tableDoc);
        tableDoc = null; // free memory
    }

    // Generate table filtering setting.
    private static _generateTableFilterSetting(ref: string, showTotalRow: boolean, columns: IWorkbookTableColumn[]): string {
        var filterRef = ref;
        if (showTotalRow) {
            var addressIndex = filterRef.indexOf(':') + 1;
            var cellAddress = Workbook.tableAddress(filterRef.substring(filterRef.indexOf(':') + 1));
            cellAddress.row -= 1;
            filterRef = filterRef.substring(0, addressIndex) + Workbook.xlsxAddress(cellAddress.row, cellAddress.col);
        }
        var filterDoc = '<autoFilter ref="' + filterRef + '"';
        var filterCoulmnDoc = '';
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].showFilterButton === false) {
                filterCoulmnDoc += '<filterColumn hiddenButton="1" colId="' + i + '"/>';
            }
        }
        if (filterCoulmnDoc === '') {
            filterDoc += '/>';
        } else {
            filterDoc += '>' + filterCoulmnDoc + '</autoFilter>'
        }
        return filterDoc;
    }

    // Generate Hyperlink relation doc.
    private static _generateHyperlinkRel(externalLinks: string[], startId: number) {
        var sheetRelsDoc = '';
        for (var i = 0; i < externalLinks.length; i++) {
            sheetRelsDoc += '<Relationship TargetMode="External" Target="' + externalLinks[i] + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Id="rId' + (startId + i) + '"/>';
        }
        return sheetRelsDoc;
    }

    // Get the dxfs from the table style.
    private static _getDxfs() {
        var tableStyle: any;
        for (var i = 0; i < this._tableStyles.length; i++) {
            tableStyle = JSON.parse(this._tableStyles[i]);
            Object.keys(tableStyle).forEach((key: string) => {
                var ele = tableStyle[key],
                    styleEle: string,
                    styleIndex: number;
                if (ele && !wijmo.isString(ele)) {
                    if (!this._isEmptyStyleEle(ele)) {
                        styleEle = JSON.stringify(ele);
                        styleIndex = this._dxfs.indexOf(styleEle);
                        if (styleIndex === -1) {
                            styleIndex = this._dxfs.push(styleEle) - 1;
                            ele.styleIndex = styleIndex;
                        }
                    }
                }
            });
            this._tableStyles[i] = tableStyle;
        }
    }

    // Generate the dxfs doc.
    private static _generateDxfs(): string {
        var dxf: any,
            strDxfs = '<dxfs count="' + this._dxfs.length + '">';
        for (var i = 0; i < this._dxfs.length; i++) {
            strDxfs += '<dxf>';
            dxf = JSON.parse(this._dxfs[i]);
            if (dxf.font) {
                strDxfs += this._generateFontStyle(dxf.font);
            }
            if (dxf.fill && dxf.fill.color) {
                strDxfs += this._generateFillStyle('solid', dxf.fill.color, true);
            }
            if (dxf.borders && !this._isEmpty(dxf.borders)) {
                dxf.borders = this._extend({}, dxf.borders);
                this._parseBorder(dxf.borders, false);
                strDxfs += this._generateBorderStyle(dxf.borders, true);
            }
            strDxfs += '</dxf>';
        }
        strDxfs += '</dxfs>'
        return strDxfs;
    }

    // Generate the table styles doc.
    private static _generateTableStyles(): string {
        var tableStyle: any,
            strTableStyles = '<tableStyles count="' + this._tableStyles.length + '" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16">',
            keys: string[],
            key: string,
            styleEle: any,
            strStyleEle: string,
            styleEleCnt: number;

        for (var i = 0; i < this._tableStyles.length; i++) {
            tableStyle = this._tableStyles[i];
            keys = Object.keys(tableStyle);
            strStyleEle = '';
            styleEleCnt = 0;
            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                key = keys[keyIndex];
                styleEle = tableStyle[key];
                if (!wijmo.isString(styleEle)) {
                    styleEleCnt++;
                    strStyleEle += '<tableStyleElement';
                    if (styleEle.styleIndex != null) {
                        strStyleEle += ' dxfId="' + styleEle.styleIndex + '"';
                    }
                    switch (key) {
                        case 'firstBandedColumnStyle':
                            strStyleEle += ' type="firstColumnStripe"';
                            if (styleEle.size != null) {
                                strStyleEle += ' size="' + styleEle.size + '"';
                            }
                            break;
                        case 'secondBandedColumnStyle':
                            strStyleEle += ' type="secondColumnStripe"';
                            if (styleEle.size != null) {
                                strStyleEle += ' size="' + styleEle.size + '"';
                            }
                            break;
                        case 'firstBandedRowStyle':
                            strStyleEle += ' type="firstRowStripe"';
                            if (styleEle.size != null) {
                                strStyleEle += ' size="' + styleEle.size + '"';
                            }
                            break;
                        case 'secondBandedRowStyle':
                            strStyleEle += ' type="secondRowStripe"';
                            if (styleEle.size != null) {
                                strStyleEle += ' size="' + styleEle.size + '"';
                            }
                            break;
                        default:
                            strStyleEle += ' type="' + key.substring(0, key.length - 5) + '"';
                            break;
                    }
                    strStyleEle += '/>';
                }
            }
            if (styleEleCnt > 0) {
                strTableStyles += '<tableStyle count="' + styleEleCnt + '" name="' + tableStyle.name + '" pivot="0">';
                strTableStyles += strStyleEle + '</tableStyle>';
            }
        }
        strTableStyles += '</tableStyles>';
        return strTableStyles;
    }

    // Check whether the table style element is empty.
    private static _isEmptyStyleEle(styleEle: any) {
        return this._isEmpty(styleEle.borders) && (this._isEmpty(styleEle.fill) || wijmo.isNullOrWhiteSpace(styleEle.fill.color))
            && (this._isEmpty(styleEle.font) || (styleEle.font.bold !== true && wijmo.isNullOrWhiteSpace(styleEle.font.color)
                && wijmo.isNullOrWhiteSpace(styleEle.font.family) && styleEle.font.italic !== true && styleEle.font.size == null && styleEle.font.underline !== true));
    }

    // Get the file name of the table doc.
    private static _getTableFileName(tables: _IWorkbookTable[], tableName: string): string {
        var fileName = '';
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            if (table.name === tableName) {
                fileName = table.fileName;
                break;
            }
        }
        return fileName;
    }

    // Get color
    private static _getColor(s, isFillColor): string {
        let fgcStart = -1,
            bgcStart = -1,
            clrStart = -1,
            value;

        if ((isFillColor && (fgcStart = s.search(/<fgcolor/i)) === -1 && (bgcStart = s.search(/<bgcolor/i)) === -1)
            || (!isFillColor && (clrStart = s.search(/<color/i)) === -1)) {
            return null;
        }

        if (isFillColor) { // fgcolor or bgcolor
            let start = fgcStart >= 0 ? fgcStart : bgcStart,
                isFg = start >= 0,
                end = isFg ? s.search(/<\/fgc/i) : s.indexOf(/<\/bgc/i);

            end = end > 0 ? end : s.indexOf('/>'); // no closing tag? assume a self-closing tag then.
            s = s.substring(start, end);
        } else { // color
            s = s.substring(clrStart);
        }

        if (s.indexOf('rgb=') !== -1) {
            value = this._getAttr(s, 'rgb');
            if (value && value.length === 8) {
                value = value.substring(2);
            }
        } else if (s.indexOf('indexed') !== -1) {
            var index = +this._getAttr(s, 'indexed');
            value = this._indexedColors[index] || '';
        } else {
            if (s.indexOf('auto') !== -1 && this._getAttr(s, 'auto') === '1') {
                value = '#000000';
            } else {
                var theme = +this._getAttr(s, 'theme'),
                    tint;
                if (s.indexOf('tint') !== -1) {
                    tint = +this._getAttr(s, 'tint');
                }
                value = this._getThemeColor(theme, tint);
            }
        }

        return value && value[0] === '#' ? value : '#' + value;

        //var colorIndex, theme, index, value, tint;
        //if ((s.search(/fgcolor/i) === -1 && s.search(/bgcolor/i) === -1 && isFillColor)
        //    || (s.search(/color/i) === -1 && !isFillColor)) {
        //    return null;
        //}
        //colorIndex = s.indexOf('<fgColor');
        //if (colorIndex === -1) {
        //    colorIndex = s.indexOf('<bgColor');
        //}
        //s = isFillColor ? s.substring(colorIndex, s.indexOf('/>')) : s.substring(s.indexOf('<color'));
        //if (s.indexOf('rgb=') !== -1) {
        //    value = this._getAttr(s, 'rgb');
        //    if (value && value.length === 8) {
        //        value = value.substring(2);
        //    }
        //} else if (s.indexOf('indexed') !== -1) {
        //    index = +this._getAttr(s, 'indexed');
        //    value = this._indexedColors[index] || '';
        //} else {
        //    if (s.indexOf('auto') !== -1 && this._getAttr(s, 'auto') === '1') {
        //        value = '#000000';
        //    } else {
        //        theme = +this._getAttr(s, 'theme');
        //        if (s.indexOf('tint') !== -1) {
        //            tint = +this._getAttr(s, 'tint');
        //        }
        //        value = this._getThemeColor(theme, tint);
        //    }
        //}

        //return value && value[0] === '#' ? value : '#' + value;
    }

    private static _getThemeColor(theme, tint) {
        if (!this._colorThemes) { // TFS 47297, xlsx doesn't contains the theme part (theme/theme1.xml).
            return '#000000'; // auto
        }

        let themeColor = this._colorThemes[theme];
        if (tint != null) {
            let color = new wijmo.Color('#' + themeColor),
                hslArray = color.getHsl();
            // About the tint value and theme color convert to rgb color, 
            // please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.color.aspx
            if (tint < 0) {
                hslArray[2] = hslArray[2] * (1.0 + tint);
            } else {
                hslArray[2] = hslArray[2] * (1.0 - tint) + (1 - 1 * (1.0 - tint));
            }
            color = wijmo.Color.fromHsl(hslArray[0], hslArray[1], hslArray[2]);
            return color.toString().substring(1);
        }

        // if the color value is undefined, we should return the themeColor (TFS 121712)
        return themeColor;
    }

    private static _parsedColors: { [key: string]: string } = {};
    // Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
    private static _parseColor(color) {
        let pc = this._parsedColors[color];
        if (!pc) {
            let c = new wijmo.Color(color);

            // Because Excel doesn't support transparency, we have to make the color closer to white to simulate the transparency.
            if (c.a < 1) {
                c = wijmo.Color.toOpaque(c);
            }

            this._parsedColors[color] = pc = c.toString();
        }
        return pc;
    }

    // Get shared formula.
    private static _getsBaseSharedFormulas(/*sheet: Document*/ sheet: string) {
        var formulas = sheet.match(/\<f[^<]*ref[^<]*>[^<]+(?=\<\/f>)/g),
            formula: string,
            sharedIndex: string,
            cellRef: string;

        this._sharedFormulas = [];
        if (formulas && formulas.length > 0) {
            for (var i = 0; i < formulas.length; i++) {
                formula = formulas[i];
                sharedIndex = this._getAttr(formula, 'si');
                cellRef = this._getAttr(formula, 'ref');
                cellRef = cellRef ? cellRef.substring(0, cellRef.indexOf(':')) : '';
                formula = formula.replace(/(\<f.*>)(.+)/, "$2");
                this._sharedFormulas[+sharedIndex] = this._parseSharedFormulaInfo(cellRef, formula);
            }
        }
    }

    // Parse the base shared formula to shared formula info that contains the cell reference, formula and the formula cell references of the shared formula.
    private static _parseSharedFormulaInfo(cellRef: string, formula: string): ISharedFormulaInfo {
        var formulaRefs = formula.match(/(\'?\w+\'?\!)?(\$?[A-Za-z]+)(\$?\d+)/g),
            formulaRef: string,
            formulaRefCellIndex: number,
            sheetRef: string,
            cellRefAddress: ITableAddress,
            formulaRefsAddress: ICellAddress[];

        cellRefAddress = Workbook.tableAddress(cellRef);
        if (formulaRefs && formulaRefs.length > 0) {
            formulaRefsAddress = [];
            for (var i = 0; i < formulaRefs.length; i++) {
                formulaRef = formulaRefs[i];
                formula = formula.replace(formulaRef, '{' + i + '}');
                formulaRefCellIndex = formulaRef.indexOf('!');
                if (formulaRefCellIndex > 0) {
                    sheetRef = formulaRef.substring(0, formulaRefCellIndex);
                    formulaRef = formulaRef.substring(formulaRefCellIndex + 1);
                }
                formulaRefsAddress[i] = {
                    cellAddress: Workbook.tableAddress(formulaRef),
                    sheetRef: sheetRef
                }
            }
        }

        return {
            cellRef: cellRefAddress,
            formula: formula,
            formulaRefs: formulaRefsAddress
        }
    }

    // Gets the shared formula via the si and cell reference.
    private static _getSharedFormula(si: string, cellRef: string): string {
        var sharedFormulaInfo: ISharedFormulaInfo,
            cellAddress: ITableAddress,
            rowDiff: number,
            colDiff: number,
            rowIndex: number,
            colIndex: number,
            srcRow: number,
            srcCol: number,
            formula: string,
            formulaRefs: ICellAddress[],
            formulaRef: ICellAddress,
            formulaCell: string;

        if (this._sharedFormulas && this._sharedFormulas.length > 0) {
            sharedFormulaInfo = this._sharedFormulas[+si];
            if (sharedFormulaInfo) {
                formula = sharedFormulaInfo.formula;
                formulaRefs = sharedFormulaInfo.formulaRefs;
                if (formulaRefs && formulaRefs.length > 0) {
                    cellAddress = Workbook.tableAddress(cellRef);
                    srcRow = sharedFormulaInfo.cellRef ? sharedFormulaInfo.cellRef.row : 0;
                    srcCol = sharedFormulaInfo.cellRef ? sharedFormulaInfo.cellRef.col : 0;
                    rowDiff = cellAddress.row - srcRow;
                    colDiff = cellAddress.col - srcCol;
                    for (var i = 0; i < formulaRefs.length; i++) {
                        formulaRef = formulaRefs[i];
                        rowIndex = formulaRef.cellAddress.row + (formulaRef.cellAddress.absRow ? 0 : rowDiff);
                        colIndex = formulaRef.cellAddress.col + (formulaRef.cellAddress.absCol ? 0 : colDiff);
                        formulaCell = Workbook.xlsxAddress(rowIndex, colIndex, formulaRef.cellAddress.absRow, formulaRef.cellAddress.absCol);
                        if (formulaRef.sheetRef != null && formulaRef.sheetRef !== '') {
                            formulaCell = formulaRef.sheetRef + '!' + formulaCell;
                        }
                        formula = formula.replace('{' + i + '}', formulaCell);
                    }
                }
                return formula;
            }
        }
        return '';
    }

    // Convert excel UTC date to JS date.
    private static _convertDate(input): any {
        var d = new Date(1900, 0, 0),
            utcD = Date.UTC(1900, 0, 0),
            isDateObject = Object.prototype.toString.call(input) === "[object Date]",
            timezonOffset = ((isDateObject ? input.getTimezoneOffset() : (new Date()).getTimezoneOffset()) - d.getTimezoneOffset()) * 60000,
            offset = d.getTime() - utcD - d.getTimezoneOffset() * 60000,
            dateOffset: number,
            inputDate: Date;
        if (isDateObject) {
            return ((input.getTime() - d.getTime() - timezonOffset + offset) / 86400000) + 1;
        } else if (wijmo.isNumber(input)) {
            dateOffset = input > 59 ? 1 : 0;
            inputDate = new Date(Math.round((+d + (input - dateOffset) * 86400000) / 1000) * 1000);
            timezonOffset = (inputDate.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
            if (timezonOffset !== 0) {
                return new Date(Math.round((+d + timezonOffset - offset + (input - dateOffset) * 86400000) / 1000) * 1000);
            }
            return inputDate;
        } else {
            return null;
        }
    }

    // Parse border setting for exporting.
    private static _parseBorder(border: any, needDefaultBorder: boolean) {
        for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0 }) {
            var egdeBorder = border[edge];
            if (egdeBorder) {
                if (wijmo.isString(egdeBorder.color)) {
                    egdeBorder.color = this._parseColor(egdeBorder.color);
                }
                if (egdeBorder.style != null && !wijmo.isString(egdeBorder.style)) {
                    egdeBorder.style = Workbook._parseBorderTypeToString(wijmo.asEnum(egdeBorder.style, BorderStyle, false));
                }
                if (!needDefaultBorder && egdeBorder.color && egdeBorder.color.toLowerCase() === '#c6c6c6' && egdeBorder.style === 'thin') {
                    border[edge] = null;
                }
            }
        }
    }

    // apply the default border for the cell style.
    // Since the fill color will extends the border of cells in excel. https://answers.microsoft.com/en-us/msoffice/forum/msoffice_excel-mso_other/gridlines-in-excel-2007-disappear-when-cell/10e54382-67d8-4dca-abb8-05e9a6ad390d
    // add the default border setting to the cell style in case of the default border disappear in excel. (TFS 257902)
    private static _applyDefaultBorder(style: any) {
        if (style.fill && style.fill.color) {
            if (style.borders == null) {
                style.borders = {};
            }
            for (var edge in { left: 0, right: 0, top: 0, bottom: 0 }) {
                if (style.borders[edge] == null) {
                    style.borders[edge] = {
                        style: BorderStyle.Thin,
                        color: '#C6C6C6'
                    };
                }
            }
        }
    }

    // Parse inheritance style
    private static _resolveStyleInheritance(style: any): any {
        var resolvedStyle;

        // no inheritance? save some time
        if (!style.basedOn) {
            return style;
        }

        // resolve inheritance
        for (var key in style.basedOn) {
            if (key === 'basedOn') {
                resolvedStyle = this._resolveStyleInheritance(style.basedOn);
                for (key in resolvedStyle) {
                    var val = resolvedStyle[key];
                    style[key] = style[key] == null ? val : this._extend(style[key], val);
                }
            } else {
                var val = style.basedOn[key];
                style[key] = style[key] == null ? val : this._extend(style[key], val);
            }
        }
        delete style.basedOn;

        // return resolved style
        return style;
    }

    // Parse the pixel width to character width for exporting
    private static _parsePixelToCharWidth(pixels): number {
        if (pixels == null || isNaN(+pixels)) {
            return null;
        }
        // The calculation is =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
        // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
        return ((+pixels - 5) / 7 * 100 + 0.5) / 100;
    }

    // Parse the character width to pixel width for importing
    private static _parseCharWidthToPixel(charWidth): number {
        if (charWidth == null || isNaN(+charWidth)) {
            return null;
        }
        // The calculation is =Truncate(((256 * {width} + Truncate(128/{Maximum Digit Width}))/256)*{Maximum Digit Width})
        // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
        return Math.floor(((256 * (+charWidth) + (128 / 7)) / 256) * 7) + 5;
    }

    // Parse the chart count to char width
    private static _parseCharCountToCharWidth(charCnt): number {
        if (charCnt == null || isNaN(+charCnt)) {
            return null;
        }
        // The calculation is =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
        // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
        return (((+charCnt) * 7 + 5) / 7 * 256) / 256;
    }

    private static _numAlpha(i): string {
        var t = Math.floor(i / 26) - 1; return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
    }

    private static _alphaNum(s): number {
        let t = 0;
        if (s.length > 1) {
            return (this._alphabet.indexOf(s[0]) + 1) * Math.pow(26, s.length - 1) + this._alphaNum(s.substring(1));
        } else {
            return this._alphabet.indexOf(s);
        }
    }

    private static _typeOf(obj): string {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }

    // extends the source hash to destination hash
    private static _extend(dst: any, src: any): any {
        if (wijmo.isObject(dst) && wijmo.isObject(src)) {
            for (var key in src) {
                var value = src[key];
                if (wijmo.isObject(value) && dst[key] != null) {
                    this._extend(dst[key], value); // extend sub-objects
                } else if (value != null && dst[key] == null) {
                    dst[key] = value; // assign values
                }
            }
            return dst;
        } else {
            return src;
        }
    }

    private static _isEmpty(obj): boolean {
        // Speed up calls to hasOwnProperty
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        // null and undefined are "empty"
        if (obj == null) {
            return true;
        }
        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) {
            return false;
        }
        if (obj.length === 0) {
            return true;
        }
        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    // _clone the object.
    private static _cloneStyle(src: any): any {
        var clone: any;

        // Handle the 3 simple types, and null or undefined
        if (null == src || "object" !== typeof src) {
            return src;
        }

        // Handle Object
        clone = {};
        for (var attr in src) {
            if (src.hasOwnProperty(attr)) {
                clone[attr] = this._cloneStyle(src[attr]);
            }
        }
        return clone;
    }

    // Clone the styles of columns.
    private static _cloneColumnsStyle(columns: any[]): any[] {
        var cloneStyles = [],
            column: any;

        for (var i = 0; i < columns.length; i++) {
            column = columns[i];
            if (column && column.style) {
                cloneStyles[i] = this._cloneStyle(column.style);
            }
        }

        return cloneStyles;
    }

    // Get the index of the sheet.
    private static _getSheetIndex(fileName: string): number {
        var index = -1;

        fileName = fileName.substring(0, fileName.lastIndexOf('.xml'));
        index = +fileName.substring(fileName.lastIndexOf('sheet') + 5);

        return index;
    }

    // Check whether the merge cell is valid.
    private static _checkValidMergeCell(merges: any[], startRow: number, rowSpan: number, startCol: number, colSpan: number): boolean {
        for (var i = 0; i < merges.length; i++) {
            var mergeEle = merges[i];
            var topRow = +mergeEle[0].match(/\d*/g).join('') - 1;
            var leftCol = this._alphaNum(mergeEle[0].match(/[a-zA-Z]*/g)[0]);
            var bottomRow = +mergeEle[1].match(/\d*/g).join('') - 1;
            var rightCol = this._alphaNum(mergeEle[1].match(/[a-zA-Z]*/g)[0]);
            if (!(startRow > bottomRow || (startRow + rowSpan - 1) < topRow) && !(startCol > rightCol || (startCol + colSpan - 1) < leftCol)) {
                return false;
            }
        }
        return true;
    }

    private static _getAttr(s: string, attr: string): string {
        var start = s.indexOf(attr + '="');
        if (start >= 0) {
            start += attr.length + 2;
            return s.substring(start, s.indexOf('"', start));
        }
        return '';
    }

    // GrapeCity Begin: Add the function to get the "val" attribute of child node 
    private static _getChildNodeValue(s: string, child: string): string {
        var start = s.indexOf(child + ' val="');
        if (start >= 0) {
            start += child.length + 6;
            return s.substring(start, s.indexOf('"', start));
        }
        return '';
    }

    private static _getElementValue(s: string, elTag: string, noElementValue: any, emptyElementValue: any): any {
        let i = s.indexOf('<' + elTag);
        if (i >= 0) {
            i = s.indexOf('>', i + 1 + elTag.length);
            let val;
            if (i > 0 && s[i - 1] !== '/') { // check for an empty (self-closing) tag
                val = s.substring(i + 1, s.indexOf('</', i + 1));
            }
            return val || emptyElementValue;
        }

        return noElementValue;
    }

    private static _getSubElement(s: string, elTag: string): string {
        if (s) {
            let i = s.indexOf('<' + elTag);
            if (i >= 0) {
                let nxt = i + 1 + elTag.length,
                    j = s.indexOf('</' + elTag, nxt);

                if (j < 0) {
                    j = s.indexOf('/>', nxt);
                }

                return s.substring(nxt, j);
            }
        }
        return undefined;
    }

    // GrapeCity End

    // Get the sheet index by the sheet name.
    private static _getSheetIndexBySheetName(file: any, sheetName: string): number {
        for (var i = 0; i < file.sheets.length; i++) {
            if (file.sheets[i].name === sheetName) {
                return i;
            }
        }
        return -1;
    }

    private static _sheetHasNotes(sheetIndex: number): boolean {
        return !!this._notes[sheetIndex];
    }

    private static _collectNotes(sheet: IWorkSheet, sheetIndex: number): void {
        let rows = sheet.rows,
            arr: IWorkbookNote[];

        for (let i = 0, rlen = rows.length; i < rlen; i++) {
            let row = rows[i];
            if (!row) { // rows is a sparse array
                continue;
            }

            for (let j = 0, clen = row.cells.length; j < clen; j++) {
                let cell = row.cells[j];
                if (!cell) { // cells is a sparse array
                    continue;
                }

                let note = cell.note;
                if (note && (note.text != null || (note.textRuns && note.textRuns.length > 0))) {
                    if (!arr) {
                        arr = this._notes[sheetIndex];
                        if (!arr) {
                            this._notes[sheetIndex] = arr = [];
                        }
                    }

                    note._row = i;
                    note._col = j;
                    arr.push(note);
                }
            }
        }
    }
}

interface ISharedFormulaInfo {
    cellRef: ITableAddress;
    formula: string;
    formulaRefs: ICellAddress[];
}

interface ICellAddress {
    cellAddress: ITableAddress;
    sheetRef?: string;
}

// A simplistic *synchronous* Promise implementation used in _JsZipWrapper
class _JSZipSyncPromise {
    constructor(private value?) {
    }

    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): _JSZipSyncPromise {
        return new _JSZipSyncPromise(onFulfilled ? onFulfilled(this.value) : null);
    }

    catch(onRejected: (reason?: any) => any): _JSZipSyncPromise {
        return this.then(null, onRejected);
    }

    static resolve() {
        return new _JSZipSyncPromise();
    }

}

// Used as a wrapper around JSZip2 to mimic JSZip3 API. All methods that return a promise are actually
// synchronous, because the returning _JSZipSyncPromise is synchronous.
class _JsZipWrapper implements _IJsZip, _IJsZipContent, _IJsZipFile, _IJsZipFolder {
    private _obj;

    constructor(obj) {
        this._obj = obj;
    }

    loadAsync(...params): _JSZipSyncPromise {
        let ret = this._obj.load(...params);
        return new _JSZipSyncPromise(this._wrapOrNull(ret));
    }
    file(...params): _IJsZipFile {
        let ret = this._obj.file(...params);
        return this._wrapOrNull(ret);
    }
    get name(): string {
        return this._obj.name;
    }
    async(...params): _JSZipSyncPromise {
        let ret: any;
        if (params && params.length > 0 && params[0].toLowerCase() === 'uint8array') {
            ret = this._obj.asUint8Array();
        } else {
            ret = this._obj.asText();
        }
        return new _JSZipSyncPromise(ret);
    }
    folder(path): _IJsZipFolder {
        let ret = this._obj.folder(path);
        return this._wrapOrNull(ret);
    }
    forEach(cb: (relativePath: string, file) => void): void {
        let folderName = <string>this._obj.root,
            len = folderName.length,
            files = this._obj.files;
        for (let entry in files) {
            if (entry.length > len && entry.substr(0, len).toLowerCase() === folderName) {
                cb(entry.substr(len), new _JsZipWrapper(files[entry]));
            }
        }
    }

    private _wrapOrNull(value) {
        return value != null ? new _JsZipWrapper(value) : null;
    }
}

interface _IXlsxRelation {
    id: string;
    target: string;
    type?: string
}

interface _IJsZip {
    loadAsync(...params): any;
}

interface _IJsZipContent {
    file(...params): _IJsZipFile;
    folder(path): _IJsZipFolder;
}

interface _IJsZipFile {
    name: string;
    async(...params): any;
}

interface _IJsZipFolder {
    forEach(cb: (relativePath: string, file) => void): void;
}

interface _IGenerateWorksheetRowsOutput {
    sheetData: string;
    hyperlinks: any[];
    merges: any[];
}

export interface _ISyncPromiseCallback {
    onFulfilled?: (value?: any) => any;
    onRejected?: (reason?: any) => any;
}

export interface _ICancellationSource {
    cancelled: boolean;
    cancel(): void;
}

export class _SyncPromise implements _ISyncPromiseCallback, _ICancellationSource {
    static serial(cs: _ICancellationSource, promises: (() => _SyncPromise)[]): _SyncPromise {
        promises = promises.slice(); // clone

        let p = new _SyncPromise(cs),
            results = [],
            drain = () => {
                if (p.cancelled) {
                    promises = [];
                    return;
                }

                if (!promises.length) {
                    p.resolve(results);
                } else {
                    promises.shift()().then(val => {
                        results.push(val);
                        drain();
                    }, err => {
                        promises = [];
                        p.reject(err)
                    });
                }
            }

        drain();

        return p;
    }

    private _callbacks: _ISyncPromiseCallback[] = [];
    private _resolved: { value: any };
    private _cs: _ICancellationSource;
    private _onCancel: Function;
    private _cancelled: boolean;

    constructor(cs?: _ICancellationSource, onCancel?: Function) {
        this._cs = cs;
        this._onCancel = onCancel;
    }

    cancel(raiseEvent = true) {
        this._cancelled = true;
        if (raiseEvent && this._onCancel) {
            this._onCancel();
        }
    }

    get cancelled() {
        return this._cancelled || (this._cs && this._cs.cancelled);
    }

    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) {
        this._callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });

        if (this._resolved) {
            this.resolve(this._resolved.value);
        }

        return this;
    }

    catch(onRejected: (reason?: any) => any): _SyncPromise {
        return this.then(null, onRejected);
    }

    resolve(value?: any) {
        if (this.cancelled) {
            return this;
        }

        this._resolved = {
            value: value
        }

        try {
            this.onFulfilled(value);
        } catch (e) {
            this.onRejected(e);
        }

        return this;
    }

    reject(reason?: any) {
        if (this.cancelled) {
            return this;
        }

        this.onRejected(reason);
        return this;
    }

    onFulfilled(value: any) {
        while (this._callbacks.length) {
            let cb = this._callbacks[0];

            if (cb.onFulfilled) {
                cb.onFulfilled(value);
            }

            // No exceptions? Remove.
            this._callbacks.shift();
        }
    }

    onRejected(reason: any) {
        let callback: _ISyncPromiseCallback;
        while (callback = this._callbacks.shift()) {
            if (callback.onRejected) {
                callback.onRejected(reason);
            }
        }
    }
}

class _NotePositionConverter {
    private _cols: IWorkbookColumn[];
    private _rows: IWorkbookRow[];

    constructor(sheet: IWorkSheet) {
        this._cols = sheet.columns;
        this._rows = sheet.rows;
    }

    public toAnchor(note: IWorkbookNote, r: number, c: number): number[] {
        // ** leftColumn, leftOffset **
        let lc: number, lo: number,
            ox = note.offsetX,
            oy = note.offsetY;

        if (ox < 0) {
            let width: number;

            for (lc = c, lo = -ox; lc >= 0; lc--) {
                width = this._getColWidth(lc);
                if (lo <= width) {
                    break;
                }
                lo -= width;
            }

            lo = width - lo;
        } else {
            for (lc = c + 1, lo = ox; lo >= 0; lc++) {
                let width = this._getColWidth(lc);
                if (lo <= width) {
                    break;
                }
                lo -= width;
            }
        }

        // ** topRow, topOffset **
        let tr: number, to: number;

        if (oy < 0) {
            for (tr = r - 1, to = -oy; tr >= 0; tr--) {
                let height = this._getRowHeight(tr);
                if (to <= height) {
                    break;
                }
                to -= height;
            }
        } else {
            for (tr = r, to = oy; to >= 0; tr++) {
                let height = this._getRowHeight(tr);
                if (to <= height) {
                    break;
                }
                to -= height;
            }
        }

        // ** rightColumn, ** rightOffset
        let rc: number, ro: number;

        for (rc = lc, ro = lo + note.width; ro >= 0; rc++) {
            let width = this._getColWidth(rc);
            if (ro <= width) {
                break;
            }
            ro -= width;
        }

        // ** bottomRow, bottomOffset
        let br: number, bo: number;

        for (br = tr, bo = to + note.height; bo >= 0; br++) {
            let heigt = this._getRowHeight(br);
            if (bo <= heigt) {
                break;
            }
            bo -= heigt;
        }

        return [
            lc, lo, // leftColumn, leftOffset
            tr, to, // topRow, topOffset
            rc, ro, // rightColumn, rightOffset
            br, bo  // bottomRow, bottomOffset
        ];
    }

    public fromAnchor(anchor: number[], note: IWorkbookNote, r: number, c: number): void {
        let lc = anchor[0], lo = anchor[1], // leftColumn, leftOffset
            tr = anchor[2], to = anchor[3], // topRow, topOffset
            rc = anchor[4], ro = anchor[5], // rightColumn, rightOffset
            br = anchor[6], bo = anchor[7]; // bottomRow, bottomOffset

        // ** offsetX -- relative to the right edge of the cell **
        let offsetX = 0;

        if (c === lc) {
            offsetX = -(this._getColWidth(c) - lo);
        } else {
            if (lc > c) {
                offsetX += lo;
                for (let left = c + 1, right = lc - 1; left <= right; left++) {
                    offsetX += this._getColWidth(left);
                }
            } else { // lc < c
                for (let left = lc + 1, right = c; left <= right; left++) {
                    offsetX -= this._getColWidth(left);
                }
                offsetX -= this._getColWidth(lc) - lo;
            }
        }

        // ** offsetY -- relative to the top edge of the cell **
        let offsetY = 0;
        if (r === tr) {
            offsetY = to;
        } else {
            if (tr > r) {
                for (let top = r, bottom = tr - 1; top <= bottom; top++) {
                    offsetY += this._getRowHeight(top);
                }
                offsetY += to;
            } else { // tr < r
                for (let top = tr + 1, bottom = r; top < bottom; top++) {
                    offsetY -= this._getRowHeight(top);
                }
                offsetY -= this._getRowHeight(tr) - to;
            }
        }

        // ** width **
        let width = 0;

        if (lc === rc) {
            width = ro - lo;
        } else {
            for (let left = lc + 1, right = rc - 1; left <= right; left++) {
                width += this._getColWidth(left);
            }

            width += this._getColWidth(lc) - lo; // add leftOffset
            width += ro; // add rightOffset
        }

        // ** height **
        let height = 0;

        if (tr === br) {
            height = bo - to;
        } else {
            for (let top = tr + 1, bottom = br - 1; top <= bottom; top++) {
                height += this._getRowHeight(top);
            }

            height += this._getRowHeight(tr) - to; // add topOffset
            height += bo; // add bottomOffset
        }

        note.offsetX = offsetX;
        note.offsetY = offsetY;
        note.width = width;
        note.height = height;
    }

    private _colsWidthCnt = 0;
    private _colsWidth: number[] = [];

    private _getColWidth(colIndex: number): number {
        const defColWidth = 64; // The default column width is 8.43ch, 64px.
        let width = this._colsWidth[colIndex];

        if (width == null) {
            if (this._colsWidthCnt > 1000) {
                this._colsWidth = [];
                this._colsWidthCnt = 0;
            }

            let col = this._cols[colIndex];

            width = !col || col.visible == null || col.visible
                ? (!col || col.width == null ? defColWidth : Math.max(col.width - 5, 0)) // subtract padding (5).
                : 0;

            this._colsWidth[colIndex] = width;
            this._colsWidthCnt++;
        }

        return width;

    }

    private _rowsHeightCnt = 0;
    private _rowsHeight: number[] = [];

    private _getRowHeight(rowIndex: number): number {
        const defRowHeight = 20; // The default row height is 15 pt, 20px.
        let height = this._rowsHeight[rowIndex];

        if (height == null) {
            if (this._rowsHeightCnt > 1000) {
                this._rowsHeight = [];
                this._rowsHeightCnt = 0;
            }

            let row = this._rows[rowIndex];

            height = !row || row.visible == null || row.visible
                ? (!row || row.height == null ? defRowHeight : row.height)
                : 0;

            this._rowsHeight[rowIndex] = height;
            this._rowsHeightCnt++;
        }

        return height;
    }
}

export function _map(value: number, minIn: number, maxIn: number, minOut: number, maxOut: number): number {
    let delta = maxIn - minIn;
    if (delta == 0) {
        delta = 1;
    }

    let k = (maxOut - minOut) / delta;
    return (value - minIn) * k + minOut;
}

var fromCodePointImpl = String.fromCodePoint || ((code) => {
    if (code <= 0xFFFF) {
        return String.fromCharCode(code);
    } else {
        code -= 0x10000;
        return String.fromCharCode((code >> 10) + 0xD800, (code % 0x400) + 0xDC00);
    }
});

let _uid = 0;
function _guid() {
    if (_uid > 0xFFFFFFFF) {
        _uid = 0;
    }

    let loWord = ((_uid & 0xFFFF) | 0x10000).toString(16).substr(1);
    let hiWord = (((_uid >> 16) & 0xFFFF) | 0x10000).toString(16).substr(1);

    _uid++;

    //{8-4-4-12}
    return `{00000000-0000-0000-0000${hiWord}${loWord}}`;
};
    }
    


    module wijmo.xlsx {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.xlsx', wijmo.xlsx);




    }
    