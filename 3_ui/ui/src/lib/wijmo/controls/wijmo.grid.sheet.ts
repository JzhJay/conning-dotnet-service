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


    module wijmo.grid.sheet {
    


export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}


export function softXlsx(): typeof wijmo.xlsx {
    return wijmo._getModule('wijmo.xlsx');
}
    }
    


    module wijmo.grid.sheet {
    'use strict';

export var _ErrorMessages = {
    InvalidCellRef: 'Invalid cell reference.',
    InvalidSheetRef: 'Invalid sheet reference.',
    InvalidTableRef: 'Invalid table reference.',
    InvalidTableColRef: 'Invalid table column reference.',
    InvalidParameters: 'Invalid parameters.',
    BadExpression: 'Bad expression.',
    CircRef: 'Circular reference.',

    InvalidParameter: (name: string) => `Invalid parameter: "${name}".`,
    ParameterIsOutOfRange: (name: string) => `Parameter is out of range: "${name}".`,
    RowIsOutOfTableRange: (name: string) => `The row is out of the table (${name}) range.`,
    UnkFuncName: (name: string) => `The function "${name}" has not supported in FlexSheet yet.`,
    DefNameInvalidSheet: (sheetName: string) => `The defined name item works in "${sheetName}". It does not work in current sheet.`,
    InvalidTable: (name: string) => `The Table(${name}) is not located in any sheet.`,
    InvalidExpression: (expression: string) => `Invalid Expression: ${expression}`,

    Atan2ArgsLessThanZero: 'The x number and y number can\'t both be zero for the atan2 function.',
    RateCriteriaFails: 'It is not able to calculate the rate with current parameters.',
    RangesMustBeTheSame: 'The row span and column span of each cell range has to be same with each other.',
    TooFewParameters: 'Too few parameters.',
    TooManyParameters: 'Too many parameters.',
    ExpressionExpected: 'Expression expected.',
    UnbalancedParenthesis: 'Unbalanced parenthesis.',
    UnbalancedSquareBrackets: 'Unbalanced square brackets.',
    TableReferencesExpected: 'Table references expected.',
    IdentifierExpected: 'Identifier expected.',
    CantFindFinalQuote: 'Can\'t find final quote.',
    IllegalCrossSheetReference: 'Illegal cross sheet reference.',
    CantFindFinalDateDelimiter: 'Can\'t find final date delimiter ("#").',
    CellRefMustBeInSameSheet: 'The cell reference must be in the same sheet.',
    SyntaxError: 'Syntax error.'
};

// Errors that can be created from a string representation.
enum _KnownErrors {
    Div = '#DIV/0!',
    Name = '#NAME?',
    Ref = '#REF!',
    Num = '#NUM!',
    Val = '#VALUE!',
    Null = '#NULL!',
    NA = '#N/A'
};

/**
 * Represents the error that occurs when evaluating the formula.
 *
 * This class is not intended to be instantiated in your code.
 */
export class FormulaError {
    private _error: string;
    private _data: any;

    protected constructor(error: string, data?: any) {
        this._error = error;
        this._data = data;
    }

    /**
    * Gets the error code, for example "#DIV/0!".
    */
    get error() {
        return this._error;
    }

    /**
    * Ges the data associated with the error.
    *
    * It could be a text that explains the error or a JavaScript exception object associated with the error.
    */
    get data() {
        return this._data;
    }

    /**
     * Returns the string that represents the error.
     */
    toString() {
        return this._error || (this._data || '').toString();
    }
}

/**
 * Represents the "#DIV/0!" error that occurs when a number is divided by zero.
 *
 * This class is not intended to be instantiated in your code.
 */
export class DivideByZeroError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Div, data);
    }
}

/**
 * Represents the "#NAME?" error that occurs when FlexSheet is unable to recognize text in a formula (for example, when function name is mistyped).
 *
 * This class is not intended to be instantiated in your code.
 */
export class NameError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Name, data);
    }
}

/**
 * Represents the "#REF!" error that occurs when a cell reference is not valid.
 *
 * This class is not intended to be instantiated in your code.
 */
export class ReferenceError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Ref, data);
    }
}

/**
 * Represents the "#NUM!" error that occurs when when a formula contains invalid numeric values.
 *
 * This class is not intended to be instantiated in your code.
 */
export class NumericError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Num, data);
    }
}

/**
 * Represents the "#VALUE!" error that occurs when value is not the expected type or when the formula is badly formed (incorrect number of parameters in function, unbalanced parenthesis etc).
 *
 * This class is not intended to be instantiated in your code.
 */
export class ValueError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Val, data);
    }
}

/**
 * Represents the "#N/A" error that occurs when value a value is not available to a formula.
 *
 * This class is not intended to be instantiated in your code.
 */
export class NotAvailableError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.NA, data);
    }
}

/**
 * Represents the "#NULL!" error that occurs when you specify an intersection of two areas that do not intersect.
 *
 * This class is not intended to be instantiated in your code.
 */
export class NullError extends FormulaError {
    constructor(data?: string) {
        super(_KnownErrors.Null, data);
    }
}

/**
 * Represents an unknown error, for example a JavaScript exception that raises during the formula evaluation.
 *
 * This class is not intended to be instantiated in your code.
 */
export class UnknownError extends FormulaError {
    constructor(data: any) {
        super('', data);
    }
}

/**
 * Represents a syntax error that occurs during parsing the formula.
 *
 * This class is not intended to be instantiated in your code.
 */
export class SyntaxError extends FormulaError {
    constructor(data: string) {
        super('#SYNTAX', data);
    }
}

export class _FormulaErrorHelper {
    private static _errTypeMap: { [key: string]: any } = (() => {
        var res = {};
        Object.keys(_KnownErrors).forEach(val => res[_KnownErrors[val]] = 1);
        return res;
    })();

    static asError(value: FormulaError | string): FormulaError {
        if (value instanceof FormulaError) {
            return value;
        }

        if (typeof (value) === 'string') {
            return this.fromString(value);
        }

        return null;
    }

    private static fromString(value: string) {
        value = value.toUpperCase();

        if (this._errTypeMap[value]) {
            switch (value) {
                case _KnownErrors.Div:
                    return new DivideByZeroError();
                case _KnownErrors.Name:
                    return new NameError();
                case _KnownErrors.NA:
                    return new NotAvailableError();
                case _KnownErrors.Null:
                    return new NullError();
                case _KnownErrors.Num:
                    return new NumericError();
                case _KnownErrors.Ref:
                    return new ReferenceError();
                case _KnownErrors.Val:
                    return new ValueError();
            }
        }

        return null;
    }
}
    }
    


    module wijmo.grid.sheet {
    





'use strict';

/**
 * Represents a Table within the {@link FlexSheet} control.
 */
export class Table {
    _owner: FlexSheet;
    private _sheet: Sheet;
    private _name: string;
    private _columns: TableColumn[];
    private _range: wijmo.grid.CellRange;
    private _style: TableStyle;
    private _showHeaderRow: boolean = true;
    private _showTotalRow: boolean = false;
    private _showBandedColumns: boolean = false;
    private _showBandedRows: boolean = true;
    private _alterFirstColumn: boolean = false;
    private _alterLastColumn: boolean = false;
    _orgHeaderCellsContent: any[] = [];

    /**
     * Initializes a new instance of the {@link Table} class.
     *
     * @param name The name of the table.
     * @param range The range of the table.
     * @param style The table style to use with the table.  The default style is the 'TableStyleMedium9' built-in table style, if the style is omitted.
     * @param columns The columns of the table.
     * @param options The options {@link ITableOptions} of the table.
     */
    constructor(name: string, range: wijmo.grid.CellRange, style?: TableStyle, columns?: TableColumn[], options?: ITableOptions) {
        if (!range.isValid) {
            throw 'The range of this table is invalid.';
        }
        this._name = name;
        this._range = range.clone();
        this._style = style;
        if (columns != null && columns.length > 0) {
            this._pushTableColumns(columns);
        }
        if (options != null) {
            if (options.showHeaderRow != null) {
                this._showHeaderRow = options.showHeaderRow;
            }
            if (options.showTotalRow != null) {
                this._showTotalRow = options.showTotalRow;
            }
            if (options.showBandedColumns != null) {
                this._showBandedColumns = options.showBandedColumns;
            }
            if (options.showBandedRows != null) {
                this._showBandedRows = options.showBandedRows;
            }
            if (options.alterFirstColumn != null) {
                this._alterFirstColumn = options.alterFirstColumn;
            }
            if (options.alterLastColumn != null) {
                this._alterLastColumn = options.alterLastColumn;
            }
        }
    }

    /**
     * Gets or sets the table name.
     * 
     * The table name is used to reference the table programmatically.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        var undoAction: _TableSettingAction,
            oldName: string;

        if (value == null || value === '') {
            throw 'The name of the Table should not be empty.';
        }

        if (this._name.toLowerCase() !== value.toLowerCase()) {
            oldName = this._name;
            this._name = value;
            if (this._owner) {
                if (!this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                    undoAction = new _TableSettingAction(this._owner, this);
                }

                this._owner._updateFormulasWithNameUpdating(oldName, value, true);
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
            }
        }
    }

    /**
     * Gets the {@link Sheet} this table belongs to.
     */
    get sheet(): Sheet {
        return this._sheet;
    }

    /**
     * Gets or sets the {@link TableStyle} associated with this table.
     */
    get style(): TableStyle {
        return this._style;
    }
    set style(value: TableStyle) {
        var undoAction: _TableSettingAction;

        if (value.name !== this._style.name /* && check whether the style name exists in FlexSheet */) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            this._style = value;
            if (this._owner) {
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
                this._owner.refresh();
            }
        }
    }

    /**
     * Indicates whether the table should include a header row.
     */
    get showHeaderRow(): boolean {
        return this._showHeaderRow;
    }
    set showHeaderRow(value: boolean) {
        var undoAction: _TableSettingAction,
            orgVal: boolean;

        if (value !== this._showHeaderRow) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            orgVal = this._showHeaderRow;
            this._showHeaderRow = value;
            if (this._owner) {
                try {
                    this._owner.beginUpdate();
                    this._adjustTableRangeWithHeaderRow();
                    if (undoAction) {
                        undoAction.saveNewState();
                        this._owner.undoStack._addAction(undoAction);
                    }
                } catch (ex) {
                    this._showHeaderRow = orgVal;
                    throw ex;
                } finally {
                    undoAction = null;
                    this._owner.endUpdate();
                }
            }
        }
    }

    /**
     * Indicates whether the table should include a total row.
     */
    get showTotalRow(): boolean {
        return this._showTotalRow;
    }
    set showTotalRow(value: boolean) {
        var undoAction: _TableSettingAction,
            orgVal: boolean;

        if (value !== this._showTotalRow) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            orgVal = this._showTotalRow;
            this._showTotalRow = value;
            if (this._owner) {
                try {
                    this._owner.beginUpdate();
                    this._adjustTableRangeWithTotalRow();
                    if (undoAction) {
                        undoAction.saveNewState();
                        this._owner.undoStack._addAction(undoAction);
                    }
                } catch (ex) {
                    this._showTotalRow = orgVal;
                    throw ex;
                } finally {
                    undoAction = null;
                    this._owner.endUpdate();
                }
            }

        }
    }

    /**
     * Indicating whether banded column formatting is applied.
     */
    get showBandedColumns(): boolean {
        return this._showBandedColumns;
    }
    set showBandedColumns(value: boolean) {
        var undoAction: _TableSettingAction;

        if (value !== this._showBandedColumns) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            this._showBandedColumns = value;
            if (this._owner) {
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
                this._owner.refresh();
            }
        }
    }

    /**
     * Gets or sets a value that determines whether banded row
     * formatting is applied.
     */
    get showBandedRows(): boolean {
        return this._showBandedRows;
    }
    set showBandedRows(value: boolean) {
        var undoAction: _TableSettingAction;

        if (value !== this._showBandedRows) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            this._showBandedRows = value;
            if (this._owner) {
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
                this._owner.refresh();
            }
        }
    }

    /**
     * Gets or sets a value that determines whether the first table
     * column should have the style applied.
     */
    get alterFirstColumn(): boolean {
        return this._alterFirstColumn;
    }
    set alterFirstColumn(value: boolean) {
        var undoAction: _TableSettingAction;

        if (value !== this._alterFirstColumn) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            this._alterFirstColumn = value;
            if (this._owner) {
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
                this._owner.refresh();
            }
        }
    }

    /**
     * Gets or sets a value that determines whether the last table
     * column should have the style applied.
     */
    get alterLastColumn(): boolean {
        return this._alterLastColumn;
    }
    set alterLastColumn(value: boolean) {
        var undoAction: _TableSettingAction;

        if (value !== this._alterLastColumn) {
            if (this._owner && !this._owner._isUndoing && this._owner.undoStack.stackSize > 0) {
                undoAction = new _TableSettingAction(this._owner, this);
            }
            this._alterLastColumn = value;
            if (this._owner) {
                if (undoAction) {
                    undoAction.saveNewState();
                    this._owner.undoStack._addAction(undoAction);
                    undoAction = null;
                }
                this._owner.refresh();
            }
        }
    }

    _isHeaderRow(row: number): boolean {
        return this._showHeaderRow && (row === this._range.topRow);
    }

    _getTableRange(): wijmo.grid.CellRange {
        return this._range;
    }

    _getColumns(): TableColumn[] {
        return this._columns || [];
    }

    /**
     * Gets the range of the specific section and column on the relevant sheet that the table occupies.
     *
     * @param section The section of Table.  If the section is omitted.  It will get the range of entire table.
     * @param column The column of Table. The column could be {@link TableColumn} instance, column name or column index.  
     *      If the column is omitted.  It will get the range for all columns in the table.
     *      If the section is null, the reference of the specific column includes the header row and the totals row if they are visible.
     * @return the range of the specific table section and specific column, if the specific column doesn't exist in table it will return null.
     */
    getRange(section: TableSection = TableSection.All, column?: any): wijmo.grid.CellRange {
        let tableRange: wijmo.grid.CellRange;

        switch (section) {
            case TableSection.Data:
                tableRange = this._getDataRange();
                break;
            case TableSection.Header:
                tableRange = this._getHeaderRange();
                break;
            case TableSection.Footer:
                tableRange = this._getFooterRange();
                break;
            default:
                tableRange = this._range.clone();
                break;
        }

        if (column != null && tableRange) {
            let columnIndex = this._getColumnIndex(column);
            if (columnIndex != null) {
                tableRange.col = tableRange.col2 = tableRange.leftCol + columnIndex;
            } else {
                return null;
            }
        }
        return tableRange;
    }

    /**
     * Gets the table's columns.
     */
    getColumns(): TableColumn[] {
        if (this._columns) {
            return this._columns.slice();
        }
        return [];
    }

    /**
     * Insert rows into Table.
     *
     * @param index The position where new rows should be added in table.
     * @param count The numbers of rows to add. If not specified then one row will be added.
     * @param shift Indicates whether cells beneath the table should be shifted or not.  If not specified cells beneath will be shifted.
     * @return True if the rows are inserted successfully.
     */
    insertRows(index: number, count?: number, shift: boolean = true): boolean {
        var addRowCount: number,
            rowIndex: number,
            range = this.getRange(),
            shiftRange: wijmo.grid.CellRange,
            ret = false,
            flex: any,
            dataSourceIsCV: boolean;

        if (count == null) {
            count = 1;
        }
        if (!wijmo.isInt(count) || count < 1) {
            return false;
        }
        if ((index === 0 && this._showHeaderRow) || (index === this._range.rowSpan - 1 && this._showTotalRow)
            || index < 0 || index >= this._range.rowSpan) {
            return false;
        }

        if (this._owner) {
            this._owner.beginUpdate();
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;
            if (shift) {
                shiftRange = new wijmo.grid.CellRange(range.bottomRow + 1, range.col, range.bottomRow + 1, range.col2);
                if (this._sheet._canShiftCells(shiftRange)) {
                    addRowCount = this._sheet._needAddRowCountForInsertTableRows(count, range);
                    if (flex.collectionView) {
                        dataSourceIsCV = flex.itemsSource instanceof wijmo.collections.CollectionView;
                        flex.collectionView.beginUpdate();
                        for (rowIndex = 0; rowIndex < addRowCount; rowIndex++) {
                            if (dataSourceIsCV) {
                                flex.itemsSource.sourceCollection.push({});
                            } else {
                                flex.itemsSource.push({});
                            }
                        }
                        flex.collectionView.endUpdate(true);
                    } else {
                        for (rowIndex = 0; rowIndex < addRowCount; rowIndex++) {
                            flex.rows.push(new wijmo.grid.Row());
                        }
                    }
                    this._sheet._moveDownCells(count, shiftRange);
                    ret = true;
                }
            } else {
                if (this._canInsertRowsWithoutShift(count)) {
                    ret = true;
                }
            }
            if (ret) {
                this._sheet._moveDownCellsWithinTable(index, count, range);
                this._updateTableRange(0, count, 0, 0);
            }
            this._owner.endUpdate();
        } else {
            this._updateTableRange(0, count, 0, 0);
            ret = true;
        }

        return ret;
    }

    /**
     * Delete rows of Table.
     *
     * @param index The starting index of the deleting rows in Table. 
     * @param count The numbers of rows to delete. If not specified then one row will be deleted.
     * @param shift Indicates whether cells beneath the table should be shifted or not.  If not specified cells beneath will be shifted.
     */
    deleteRows(index: number, count?: number, shift: boolean = true) {
        var canDeleteRows = false,
            range = this.getRange(),
            shiftRange: wijmo.grid.CellRange;

        if (count == null) {
            count = 1;
        }
        if (!wijmo.isInt(count) || count < 1) {
            return;
        }
        if ((index === 0 && this._showHeaderRow) || (index === this._range.rowSpan - 1 && this._showTotalRow)
            || index < 0 || index >= this._range.rowSpan) {
            return;
        }
        if (index + count > (this._range.rowSpan - (this._showTotalRow ? 1 : 0))) {
            return;
        }

        if (this._owner) {
            this._owner.beginUpdate();
            if (shift) {
                shiftRange = new wijmo.grid.CellRange(range.bottomRow + 1, range.col, range.bottomRow + 1, range.col2);
                if (this._sheet._canShiftCells(shiftRange)) {
                    canDeleteRows = true;
                }
            } else {
                canDeleteRows = true;
            }
            if (canDeleteRows) {
                this._sheet._moveUpCellsWithinTable(index, count, range);
                if (shift) {
                    this._sheet._moveUpCells(count, shiftRange);
                }
                this._updateTableRange(0, -count, 0, 0);
            }
            this._owner.endUpdate();
        } else {
            this._updateTableRange(0, -count, 0, 0);
        }
    }

    // Add table column in Table.
    _addColumn(index: number, columnName?: string) {
        var nameIndex = 1,
            range = this.getRange(),
            tmpColumnName: string,
            column: TableColumn,
            flex: any;

        if (index <= 0 || index > this._columns.length) {
            throw 'The column index is out of range.';
        }

        columnName = this._getUniqueColumnName(index, columnName);

        column = new TableColumn(columnName);
        column._attach(this);
        this._columns.splice(index, 0, column);
        if (this.showHeaderRow && this._owner && this._sheet) {
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;
            flex.setCellData(range.topRow, range.leftCol + index, columnName);
        }
    }

    // Update the table cell.
    _updateCell(rowIndex: number, colIndex: number, cell: HTMLElement) {
        var tableRowIndex = rowIndex - this._range.topRow,
            tableColIndex = colIndex - this._range.leftCol,
            appliedStyle: ITableSectionStyle;

        if (this._style == null) {
            return;
        }

        appliedStyle = this._getTableCellAppliedStyles(tableRowIndex, tableColIndex);

        this._applyStylesForCell(appliedStyle, cell);
    }

    // Update the range of the table
    _updateTableRange(topRowChange: number, bottomRowChage: number, leftColChange: number, rightColChange: number) {
        if (this._range.row <= this._range.row2) {
            this._range.row += topRowChange;
            this._range.row2 += bottomRowChage;
        } else {
            this._range.row2 += topRowChange;
            this._range.row += bottomRowChage;
        }

        if (this._range.col <= this._range.col2) {
            this._range.col += leftColChange;
            this._range.col2 += rightColChange;
        } else {
            this._range.col2 += leftColChange;
            this._range.col += rightColChange;
        }
    }

    // Set range to the Table.
    _setTableRange(range: wijmo.grid.CellRange, columns?: TableColumn[]) {
        var columnIndex: number;

        this._range = range;
        if (columns != null) {
            this._columns.splice(0, this._columns.length);
            for (columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                this._columns.push(columns[columnIndex]);
            }
        }
    }

    // Update name of the column
    _updateColumnName(columnIndex: number, columnName: string) {
        var column = this._columns[columnIndex],
            flex: any;

        columnName = this._getUniqueColumnName(null, columnName);
        column.name = columnName;
        if (this._showHeaderRow && this._owner && this._sheet) {
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;
            flex.setCellData(this._range.topRow, this._range.leftCol + columnIndex, columnName);
        }
    }

    // Update the total row content for the specific column in the Table.
    _updateColumnTotalRowContent(column: TableColumn, columnIndex?: number) {
        var subtotalFun: string,
            totalCellContent: string,
            flex: any;

        if (columnIndex == null) {
            columnIndex = this._columns.indexOf(column);
        }

        if (columnIndex < 0) {
            return;
        }

        if (column.totalRowFunction) {
            subtotalFun = this._getSubtotalFunction(column.totalRowFunction.toLowerCase());
            if (subtotalFun != null) {
                totalCellContent = '=subtotal(' + subtotalFun + ',[' + column.name + '])';
            } else {
                totalCellContent = column.totalRowFunction[0] === '=' ? column.totalRowFunction : '=' + column.totalRowFunction;
            }
        } else {
            if (columnIndex === 0) {
                if (!column.totalRowLabel) {
                    column.totalRowLabel = 'Total';
                }
                totalCellContent = column.totalRowLabel;
            } else {
                totalCellContent = column.totalRowLabel;
            }
        }
        if (this._owner && this._sheet) {
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;
            flex.setCellData(this._range.bottomRow, this._range.leftCol + columnIndex, totalCellContent, false);
        }
    }

    // Attach the table to its parent sheet.
    _attachSheet(sheet: Sheet) {
        var range = this.getRange();

        if (this._sheet && this._owner) {
            return;
        }
        this._sheet = sheet;
        this._owner = sheet._owner;
        if (this._owner == null) {
            return;
        }
        if (this._owner._containsMergedCells(this._range, sheet)) {
            throw 'Table does not allow the merged cell within the table.';
        }
        if (this._style == null) {
            this._style = this._owner.getBuiltInTableStyle('TableStyleMedium9');
        }
        if (this._columns == null || this._columns.length === 0) {
            this._generateColumns(this._showHeaderRow);
        }
        try {
            this._owner.beginUpdate();
            if (this._showHeaderRow && range.rowSpan === 1) {
                this._adjustTableRangeWithHeaderRow();
            }
            if (this._showTotalRow) {
                this._updateTotalRow();
            }
        } finally {
            this._owner.endUpdate();
        }
    }

    // Detach the table from its parent sheet.
    _detachSheet() {
        this._sheet = null;
        this._owner = null;
    }

    // Push the table columns in the columns collection of Table.
    private _pushTableColumns(columns: TableColumn[]) {
        var column: TableColumn,
            i: number;

        this._columns = [];
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            column._attach(this);
            this._columns.push(column);
        }
    }

    // Generates the columns for the table by the range of the table. 
    private _generateColumns(showHeaderRow: boolean) {
        var colIndex: number,
            columnName: string,
            column: TableColumn,
            cellStyle: ICellStyle,
            gridColumn: wijmo.grid.Column,
            cellIndex: number,
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;

        if (!this._range.isValid) {
            throw 'The range of the table is invalid.';
        }
        this._columns = [];
        for (var colIndex = 0; colIndex < this._range.columnSpan; colIndex++) {
            var cellVal = null;
            gridColumn = this._sheet.grid.columns[this._range.leftCol + colIndex];
            cellIndex = this._range.topRow * this._sheet.grid.columns.length + this._range.leftCol + colIndex;
            if (this._range.rowSpan === 1) {
                columnName = this._getUniqueColumnName(colIndex + 1);
            } else {
                columnName = cellVal = this._sheet.grid.getCellData(this._range.topRow, this._range.leftCol + colIndex, false);
                if (columnName == null) {
                    columnName = '';
                }
                if (_isFormula(columnName)) {
                    columnName = this._owner.evaluate(columnName, '', this._sheet, false);
                }
                cellStyle = this._sheet._styledCells[cellIndex];
                var tmp = this._owner._formatEvaluatedResult(columnName, gridColumn, cellStyle ? cellStyle.format : '');
                if (columnName == null || tmp != '') {
                    columnName = tmp;
                }
                columnName = this._getUniqueColumnName(colIndex + 1, columnName.toString());
            }
            if (showHeaderRow && this._range.rowSpan > 1) {
                this._orgHeaderCellsContent[colIndex] = this._sheet.grid.getCellData(this._range.topRow, this._range.leftCol + colIndex, false);
                if (!isNaN(+columnName) && !gridColumn.format && !(cellStyle && cellStyle.format)) {
                    if (cellStyle) {
                        cellStyle.format = '@';
                    } else {
                        this._sheet._styledCells[cellIndex] = { format: '@' };
                    }
                }
                flex.setCellData(this._range.topRow, this._range.leftCol + colIndex,
                    // Do not convert boolean to string in the table header cell (TFS 465924)
                    gridColumn.dataType === wijmo.DataType.Boolean && wijmo.isBoolean(cellVal) ? cellVal : columnName,
                    false);
            }
            column = new TableColumn(columnName);
            column._attach(this);
            if (colIndex === 0) {
                column._totalRowLabel = 'Total';
            } else if (colIndex === this._range.columnSpan - 1) {
                column._totalRowFunction = 'Sum';
            }
            this._columns.push(column);
        }
    }

    // Get the table cell apllied table styles.
    _getTableCellAppliedStyles(cellRowIndex: number, cellColIndex: number): ITableSectionStyle {
        var appliedStyle = {},
            isHeaderCell: boolean = false,
            isTotalCell: boolean = false,
            rowOffset: number = 0,
            firstSize: number,
            secondSize: number,
            totalSize: number,
            ret: number;

        if (this._showHeaderRow) {
            rowOffset = 1;
        }

        if (this._showHeaderRow && cellRowIndex === 0) {
            isHeaderCell = true;
        } else if (this._showTotalRow && cellRowIndex === this._range.rowSpan - 1) {
            isTotalCell = true;
        }

        this._extendStyle(appliedStyle, this._style.wholeTableStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);

        if (!isHeaderCell && !isTotalCell) {
            if (this._showBandedColumns && (this._style.firstBandedColumnStyle != null || this._style.secondBandedColumnStyle != null)) {
                if (this._style.firstBandedColumnStyle) {
                    firstSize = this._style.firstBandedColumnStyle.size == null ? 1 : this._style.firstBandedColumnStyle.size;
                } else {
                    firstSize = 1;
                }
                if (this._style.secondBandedColumnStyle) {
                    secondSize = this._style.secondBandedColumnStyle.size == null ? 1 : this._style.secondBandedColumnStyle.size;
                } else {
                    secondSize = 1;
                }
                totalSize = firstSize + secondSize;
                ret = cellColIndex % totalSize;
                if (ret >= firstSize) {
                    if (this._style.secondBandedColumnStyle) {
                        this._extendStyle(appliedStyle, this._style.secondBandedRowStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
                    }
                } else {
                    if (this._style.firstBandedColumnStyle) {
                        this._extendStyle(appliedStyle, this._style.firstBandedColumnStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
                    }
                }
            }

            if (this._showBandedRows && (this._style.firstBandedRowStyle != null || this._style.secondBandedRowStyle != null)) {
                if (this._style.firstBandedRowStyle) {
                    firstSize = this._style.firstBandedRowStyle.size == null ? 1 : this._style.firstBandedRowStyle.size;
                } else {
                    firstSize = 1;
                }
                if (this._style.secondBandedRowStyle) {
                    secondSize = this._style.secondBandedRowStyle.size == null ? 1 : this._style.secondBandedRowStyle.size;
                } else {
                    secondSize = 1;
                }
                totalSize = firstSize + secondSize;
                ret = (cellRowIndex - rowOffset) % totalSize;
                if (ret >= firstSize) {
                    if (this._style.secondBandedRowStyle) {
                        this._extendStyle(appliedStyle, this._style.secondBandedRowStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
                    }
                } else {
                    if (this._style.firstBandedRowStyle) {
                        this._extendStyle(appliedStyle, this._style.firstBandedRowStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
                    }
                }
            }
        }

        if (this._alterLastColumn && cellColIndex === this._range.columnSpan - 1 && this._style.lastColumnStyle) {
            this._extendStyle(appliedStyle, this._style.lastColumnStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
        }

        if (this._alterFirstColumn && cellColIndex === 0 && this._style.firstColumnStyle) {
            this._extendStyle(appliedStyle, this._style.firstColumnStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
        }

        if (isHeaderCell) {
            if (this._style.headerRowStyle) {
                this._extendStyle(appliedStyle, this._style.headerRowStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
            if (cellColIndex === this._range.columnSpan - 1 && this._style.lastHeaderCellStyle) {
                this._extendStyle(appliedStyle, this._style.lastHeaderCellStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
            if (cellColIndex === 0 && this._style.firstHeaderCellStyle) {
                this._extendStyle(appliedStyle, this._style.firstHeaderCellStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
        } else if (isTotalCell) {
            if (this._style.totalRowStyle) {
                this._extendStyle(appliedStyle, this._style.totalRowStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
            if (cellColIndex === this._range.columnSpan - 1 && this._style.lastTotalCellStyle) {
                this._extendStyle(appliedStyle, this._style.lastTotalCellStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
            if (cellColIndex === 0 && this._style.firstTotalCellStyle) {
                this._extendStyle(appliedStyle, this._style.firstTotalCellStyle, cellRowIndex, cellColIndex, isHeaderCell, isTotalCell);
            }
        }

        return appliedStyle;
    }

    // Aplly the related table styles for the table cell.
    private _applyStylesForCell(cellStyle: ITableSectionStyle, cell: HTMLElement) {
        var st = cell.style,
            styleInfoVal: any;
        for (var styleProp in cellStyle) {
            styleInfoVal = cellStyle[styleProp];
            if (styleInfoVal) {
                st[styleProp] = styleInfoVal;
            }
        }
    }

    // Extend the table style.
    private _extendStyle(dstStyle: ITableSectionStyle, srcStyle: ITableSectionStyle, cellRowIndex: number, cellColIndex: number, isHeaderCell: boolean, isTotalCell: boolean) {
        var key: string,
            value: any;
        for (var key in srcStyle) {
            value = srcStyle[key];
            if (value === null) {
                continue;
            }
            if (key.indexOf('borderTop') > -1) {
                if (cellRowIndex === 0 || isTotalCell) {
                    dstStyle[key] = value;
                }
            } else if (key.indexOf('borderBottom') > -1) {
                if (cellRowIndex === this._range.rowSpan - 1 || isHeaderCell) {
                    dstStyle[key] = value;
                }
            } else if (key.indexOf('borderLeft') > -1) {
                if (cellColIndex === 0) {
                    dstStyle[key] = value;
                }
            } else if (key.indexOf('borderRight') > -1) {
                if (cellColIndex === this._range.columnSpan - 1) {
                    dstStyle[key] = value;
                }
            } else if (key.indexOf('borderHorizontal') > -1) {
                if (cellRowIndex < this._range.rowSpan - 1) {
                    if (key === 'borderHorizontalStyle') {
                        dstStyle['borderBottomStyle'] = value;
                    } else if (key === 'borderHorizontalWidth') {
                        dstStyle['borderBottomWidth'] = value;
                    } else {
                        dstStyle['borderBottomColor'] = value;
                    }
                }
            } else if (key.indexOf('borderVertical') > -1) {
                if (cellColIndex < this._range.columnSpan - 1) {
                    if (key === 'borderVerticalStyle') {
                        dstStyle['borderRightStyle'] = value;
                    } else if (key === 'borderVerticalWidth') {
                        dstStyle['borderRightWidth'] = value;
                    } else {
                        dstStyle['borderRightColor'] = value;
                    }
                }
            } else {
                dstStyle[key] = value;
            }
        }
    }

    // Get the subtotal function number for the releated subtotal function.
    private _getSubtotalFunction(functionName: string): string {
        switch (functionName) {
            case 'average':
                return '101';
            case 'countnums':
                return '102';
            case 'count':
                return '103';
            case 'max':
                return '104';
            case 'min':
                return '105';
            case 'stddev':
                return '107';
            case 'sum':
                return '109';
            case 'var':
                return '110';
        }
        return null;
    }

    // Check whether the column name has existed.
    private _checkColumnNameExist(name: string) {
        var index: number,
            column: TableColumn,
            columns = this.getColumns();

        for (index = 0; index < columns.length; index++) {
            column = columns[index];
            if (column.name.toLowerCase() === name.toLowerCase()) {
                return true;
            }
        }

        return false;
    }

    // Adjust the table range with the change of the visiblity of the header row.
    private _adjustTableRangeWithHeaderRow() {
        var i: number,
            column: TableColumn,
            range: wijmo.grid.CellRange,
            shiftRange: wijmo.grid.CellRange,
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;

        if (this._showHeaderRow) {
            if (this._sheet._needMoveDownTable(this)) {
                range = this.getRange();
                shiftRange = new wijmo.grid.CellRange(range.bottomRow + 1, range.col, range.bottomRow + 1, range.col2);
                if (!this._sheet._canShiftCells(shiftRange)) {
                    throw 'The operation is not allowed.  The operation is attempting to shift the cells in a table or a merged cell on the current sheet.';
                }
                if (this._sheet._needAddRowCountForInsertTableRows(1, range) === 1) {
                    if (flex.collectionView) {
                        flex.collectionView.beginUpdate();
                        if (flex.itemsSource instanceof wijmo.collections.CollectionView) {
                            flex.itemsSource.sourceCollection.push({});
                        } else {
                            flex.itemsSource.push({});
                        }
                        flex.collectionView.endUpdate(true);
                    } else {
                        flex.rows.push(new wijmo.grid.Row());
                    }
                }
                this._sheet._moveDownCells(1, shiftRange);
                this._sheet._moveDownTable(this);
            }
            if (this._range.row <= this._range.row2) {
                this._range.row -= 1;
            } else {
                this._range.row2 -= 1;
            }
            for (i = 0; i < this._columns.length; i++) {
                column = this._columns[i];
                this._orgHeaderCellsContent[i] = flex.getCellData(this._range.topRow, this._range.leftCol + i, false);
                flex.setCellData(this._range.topRow, this._range.leftCol + i, column.name);
            }
        } else {
            for (i = this._range.leftCol; i <= this._range.rightCol; i++) {
                flex.setCellData(this._range.topRow, i, '');
            }
            if (this._range.row <= this._range.row2) {
                this._range.row += 1;
            } else {
                this._range.row2 += 1;
            }
        }
    }

    // Adjust the table with the change of the visiblity of the total row.
    private _adjustTableRangeWithTotalRow() {
        var i: number,
            range: wijmo.grid.CellRange,
            shiftRange: wijmo.grid.CellRange,
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;

        range = this.getRange();
        shiftRange = new wijmo.grid.CellRange(range.bottomRow + 1, range.col, range.bottomRow + 1, range.col2);
        if (this._showTotalRow) {
            if (this._sheet._canShiftCells(shiftRange)) {
                if (this._sheet._needAddRowCountForInsertTableRows(1, range) === 1) {
                    if (flex.collectionView) {
                        flex.collectionView.beginUpdate();
                        if (flex.itemsSource instanceof wijmo.collections.CollectionView) {
                            flex.itemsSource.sourceCollection.push({});
                        } else {
                            flex.itemsSource.push({});
                        }
                        flex.collectionView.endUpdate(true);
                    } else {
                        flex.rows.push(new wijmo.grid.Row());
                    }
                }
                this._sheet._moveDownCells(1, shiftRange);
                this._owner._updateAffectedFormula(this._range.bottomRow + 1, 1, true, true, this.getRange());
            } else if (!this._beneathRowIsEmpty()) {
                throw 'The operation is not allowed.  The operation is attempting to shift the cells in a table or a merged cell on the current sheet.';
            }
            if (this._range.row <= this._range.row2) {
                this._range.row2 += 1;
            } else {
                this._range.row += 1;
            }
            this._updateTotalRow();
        } else {
            for (i = this._range.leftCol; i <= this._range.rightCol; i++) {
                flex.setCellData(this._range.bottomRow, i, '');
            }
            if (this._sheet._canShiftCells(shiftRange)) {
                this._owner._updateAffectedFormula(this._range.bottomRow, 1, false, true, this.getRange());
                this._sheet._moveUpCells(1, shiftRange);
            }
            if (this._range.row <= this._range.row2) {
                this._range.row2 -= 1;
            } else {
                this._range.row -= 1;
            }
        }
    }

    // Update the cell content of the Total row.
    private _updateTotalRow() {
        let column: TableColumn,
            subtotalFun: string,
            totalCellContent;
        if (this.showTotalRow) {
            for (let i = 0; i < this._columns.length; i++) {
                column = this._columns[i];
                this._updateColumnTotalRowContent(column, i);
            }
        }
    }

    // Get the unique name for the column.
    private _getUniqueColumnName(index: number, columnName?: string): string {
        var tmpColumnName: string,
            nameIndex = 1;

        if (columnName == null || columnName === '') {
            columnName = 'Column' + index;
        }

        if (this._checkColumnNameExist(columnName)) {
            tmpColumnName = columnName + nameIndex;
            while (this._checkColumnNameExist(tmpColumnName)) {
                nameIndex++;
                tmpColumnName = columnName + nameIndex;
            }
            columnName = tmpColumnName;
        }

        return columnName;
    }

    // Move a table column from position to another.
    _moveColumns(src: number, dst: number) {
        if (!this._columns) {
            return;
        }
        let column = this._columns[src];
        this._columns.splice(src, 1);
        if (dst < 0) {
            dst = this._columns.length;
        }
        this._columns.splice(dst, 0, column);
    }

    // Check whether able to insert rows into table without shift the cells beneath the table.
    private _canInsertRowsWithoutShift(count: number): boolean {
        var i: number,
            rowIndex: number,
            colIndex: number,
            cellData: any,
            cellStyle: ICellStyle,
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;

        if (this._range.bottomRow + count >= flex.rows.length) {
            return false;
        }

        for (i = 1; i <= count; i++) {
            rowIndex = this._range.bottomRow + i;
            for (colIndex = this._range.leftCol; colIndex <= this._range.rightCol; colIndex++) {
                cellData = flex.getCellData(rowIndex, colIndex, false);
                cellStyle = this._sheet.getCellStyle(rowIndex, colIndex);
                if ((cellData != null && cellData !== '') || cellStyle != null) {
                    return false;
                }
            }
        }
        return true;
    }

    // Check whether the row below the table is empty.
    private _beneathRowIsEmpty(): boolean {
        let rowIndex = this._range.bottomRow + 1,
            flex = this._sheet === this._owner.selectedSheet ? this._owner : this._sheet.grid;

        if (rowIndex >= flex.rows.length) {
            return false;
        }

        for (let colIndex = this._range.leftCol; colIndex <= this._range.rightCol; colIndex++) {
            let cellData = flex.getCellData(this._range.bottomRow + 1, colIndex, false);
            if (cellData != null && cellData !== '') {
                return false;
            }

            let cellStyle = this._sheet.getCellStyle(this._range.bottomRow + 1, colIndex);
            if (cellStyle != null) {
                return false;
            }

            if (this._sheet.findTable(rowIndex, colIndex)) {
                return null;
            }

            let cellIndex = rowIndex * flex.columns.length + colIndex,
                mergeRange = this._sheet._mergedRanges[cellIndex];

            if (mergeRange != null) {
                return false;
            }
        }
        return true;
    }

    // Gets the table's data range.
    private _getDataRange(): wijmo.grid.CellRange {
        var topRow = this._range.topRow,
            bottomRow = this._range.bottomRow;

        if (this._showHeaderRow) {
            topRow += 1;
        }
        if (this._showTotalRow) {
            bottomRow -= 1;
        }

        return new wijmo.grid.CellRange(topRow, this._range.leftCol, bottomRow, this._range.rightCol);
    }

    // Gets the table's header row range.
    private _getHeaderRange(): wijmo.grid.CellRange {
        if (this._showHeaderRow) {
            return new wijmo.grid.CellRange(this._range.topRow, this._range.leftCol, this._range.topRow, this._range.rightCol);
        }
        return null;
    }

    // Gets the table's total row range.
    private _getFooterRange(): wijmo.grid.CellRange {
        if (this._showTotalRow) {
            return new wijmo.grid.CellRange(this._range.bottomRow, this._range.leftCol, this._range.bottomRow, this._range.rightCol);
        }
        return null;
    }

    // Gets the index of specific column in table.
    private _getColumnIndex(column: any): number {
        var colIndex: number,
            columnName: string,
            columns: TableColumn[];

        if (wijmo.isInt(column) && column >= 0 && column < this._columns.length) {
            colIndex = column;
        } else {
            if (column instanceof TableColumn) {
                columnName = column.name.toLowerCase();
            } else if (wijmo.isString(column) && column !== '') {
                columnName = column.toLowerCase();
            }
            columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].name.toLowerCase() === columnName) {
                    colIndex = i;
                    break;
                }
            }
        }

        return colIndex;
    }
}

/**
 * Represents a column within the {@link Table}.
 */
export class TableColumn {
    private _table: Table;
    private _name: string;
    _totalRowLabel: string;
    _totalRowFunction: string;
    private _showFilterButton: boolean;

    /**
     * Initializes a new instance of the {@link TableColumn} class.
     *
     * @param name The name of the table column.
     * @param totalRowLabel The string to show in the totals row cell for the column.
     * @param totalRowFunction The function to show in the totals row cell for this column.
     * @param showFilterButton Indicating whether show the filter button for the table column.  The default value of showFilterButton is true.
     */
    constructor(name: string, totalRowLabel?: string, totalRowFunction?: string, showFilterButton: boolean = true) {
        this._name = name;
        this._totalRowLabel = totalRowLabel;
        this._totalRowFunction = totalRowFunction;
        if (showFilterButton != null) {
            this._showFilterButton = showFilterButton;
        }
    }

    /**
     * Gets the Table the table columns belongs to.
     */
    get table(): Table {
        return this._table;
    }

    /**
     * Gets the name of the table column. It is referenced through functions.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (value !== this._name /* && check is valid column name. */) {
            this._name = value;
            // Todo:
            // Update the formulas refer the column in FlexSheet.
        }
    }

    /**
     * The string to show in the totals row cell for the column.
     */
    get totalRowLabel(): string {
        return this._totalRowLabel;
    }
    set totalRowLabel(value: string) {
        if (value !== this._totalRowLabel) {
            this._totalRowLabel = value;
            this._updateTableTotalInfo();
        }
    }

    /**
     * The function to show in the totals row cell for the column.
     */
    get totalRowFunction(): string {
        return this._totalRowFunction;
    }
    set totalRowFunction(value: string) {
        if (value !== this._totalRowFunction) {
            this._totalRowFunction = value;
            this._updateTableTotalInfo();
        }
    }

    /**
     * Indicating whether show the filter button for the table column.
     *
     * As FlexSheet has not supported filter for table yet, this property is used for import/export operation only by now.
     */
    get showFilterButton(): boolean {
        return this._showFilterButton;
    }
    set showFilterButton(value: boolean) {
        if (this._showFilterButton !== value) {
            this._showFilterButton = value;
            // Todo:
            // Update the header row cell to show/hide the filter button.
        }
    }

    // Attach the table column to its parent table.
    _attach(table: Table) {
        this._table = table;
    }

    // Update the total row info for the columns parent Table.
    private _updateTableTotalInfo() {
        if (this._table && this._table.showTotalRow) {
            this._table._updateColumnTotalRowContent(this);
            if (this._table._owner) {
                this._table._owner.refresh();
            }
        }
    }
}

/**
 * Represents a Table style for the {@link Table}.
 */
export class TableStyle {
    private _name: string;
    private _isBuiltIn: boolean;
    private _wholeTableStyle: ITableSectionStyle;
    private _firstBandedColumnStyle: IBandedTableSectionStyle;
    private _secondBandedColumnStyle: IBandedTableSectionStyle;
    private _firstBandedRowStyle: IBandedTableSectionStyle;
    private _secondBandedRowStyle: IBandedTableSectionStyle;
    private _firstColumnStyle: ITableSectionStyle;
    private _lastColumnStyle: ITableSectionStyle;
    private _headerRowStyle: ITableSectionStyle;
    private _totalRowStyle: ITableSectionStyle;
    private _firstHeaderCellStyle: ITableSectionStyle;
    private _lastHeaderCellStyle: ITableSectionStyle;
    private _firstTotalCellStyle: ITableSectionStyle;
    private _lastTotalCellStyle: ITableSectionStyle;

    /**
     * Initializes a new instance of the {@link TableStyle} class.
     *
     * @param name The name of the table style.
     * @param isBuiltIn Indicates whether the table style is built-in style.
     */
    constructor(name: string, isBuiltIn: boolean = false) {
        this._name = name;
        this._isBuiltIn = isBuiltIn;
    }
    /**
     * Gets or sets the name of the table style.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (value !== this._name) {
            this._name = value;
            // Todo:
            // Update the styleName property of the tables apply this table style.
        }
    }

    /**
     * Gets or sets the whole table style.
     */
    get wholeTableStyle(): ITableSectionStyle {
        return this._wholeTableStyle;
    }
    set wholeTableStyle(value: ITableSectionStyle) {
        this._wholeTableStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the first banded column style.
     */
    get firstBandedColumnStyle(): IBandedTableSectionStyle {
        return this._firstBandedColumnStyle;
    }
    set firstBandedColumnStyle(value: IBandedTableSectionStyle) {
        this._firstBandedColumnStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the second banded column style.
     */
    get secondBandedColumnStyle(): IBandedTableSectionStyle {
        return this._secondBandedColumnStyle;
    }
    set secondBandedColumnStyle(value: IBandedTableSectionStyle) {
        this._secondBandedColumnStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the first banded row style.
     */
    get firstBandedRowStyle(): IBandedTableSectionStyle {
        return this._firstBandedRowStyle;
    }
    set firstBandedRowStyle(value: IBandedTableSectionStyle) {
        this._firstBandedRowStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the second banded row style.
     */
    get secondBandedRowStyle(): IBandedTableSectionStyle {
        return this._secondBandedRowStyle;
    }
    set secondBandedRowStyle(value: IBandedTableSectionStyle) {
        this._secondBandedRowStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the first column style.
     */
    get firstColumnStyle(): ITableSectionStyle {
        return this._firstColumnStyle;
    }
    set firstColumnStyle(value: ITableSectionStyle) {
        this._firstColumnStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the last column style.
     */
    get lastColumnStyle(): ITableSectionStyle {
        return this._lastColumnStyle;
    }
    set lastColumnStyle(value: ITableSectionStyle) {
        this._lastColumnStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the header row style.
     */
    get headerRowStyle(): ITableSectionStyle {
        return this._headerRowStyle;
    }
    set headerRowStyle(value: ITableSectionStyle) {
        this._headerRowStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the total row style.
     */
    get totalRowStyle(): ITableSectionStyle {
        return this._totalRowStyle;
    }
    set totalRowStyle(value: ITableSectionStyle) {
        this._totalRowStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the first cell style in the header row.
     */
    get firstHeaderCellStyle(): ITableSectionStyle {
        return this._firstHeaderCellStyle;
    }
    set firstHeaderCellStyle(value: ITableSectionStyle) {
        this._firstHeaderCellStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the last cell style in the header row.
     */
    get lastHeaderCellStyle(): ITableSectionStyle {
        return this._lastHeaderCellStyle;
    }
    set lastHeaderCellStyle(value: ITableSectionStyle) {
        this._lastHeaderCellStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the first cell style in the total row.
     */
    get firstTotalCellStyle(): ITableSectionStyle {
        return this._firstTotalCellStyle;
    }
    set firstTotalCellStyle(value: ITableSectionStyle) {
        this._firstTotalCellStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Gets or sets the last cell style in the total row.
     */
    get lastTotalCellStyle(): ITableSectionStyle {
        return this._lastTotalCellStyle;
    }
    set lastTotalCellStyle(value: ITableSectionStyle) {
        this._lastTotalCellStyle = value;
        // Todo:
        // Re-render the tables apply this table style.
    }

    /**
     * Indicates whether the table style is built-in style.
     */
    get isBuiltIn(): boolean {
        return this._isBuiltIn;
    }
}

/**
 * Defines the table styling properties.
 */
export interface ITableSectionStyle extends ICellStyle {
    /**
     * Color of the Horizontal border.
     */
    borderHorizontalColor?: any;
    /**
     * Style of the Horizontal border.
     */
    borderHorizontalStyle?: string;
    /**
     * Width of the Horizontal border.
     */
    borderHorizontalWidth?: string;
    /**
     * Color of the Vertical border.
     */
    borderVerticalColor?: any;
    /**
     * Style of the Vertical border.
     */
    borderVerticalStyle?: string;
    /**
     * Width of the Vertical border.
     */
    borderVerticalWidth?: string;
}

/**
 * Defines the table stripe styling properties.
 */
export interface IBandedTableSectionStyle extends ITableSectionStyle {
    /**
     * Number of rows or columns in a single band of striping.
     */
    size?: number;
}

/**
 * Defines the table options for creating table.
 */
export interface ITableOptions {
    /**
     * Indicates whether show the header row for the table.
     */
    showHeaderRow?: boolean;
    /**
     * Indicates whether show the total row for the table.
     */
    showTotalRow?: boolean;
    /**
     * Indicating whether banded column formatting is applied.
     */
    showBandedColumns?: boolean;
    /**
     * Indicating whether banded row formatting is applied.
     */
    showBandedRows?: boolean;
    /**
     * Indicating whether the first column in the table should have the style applied.
     */
    alterFirstColumn?: boolean;
    /**
     * Indicating whether the last column in the table should have the style applied.
     */
    alterLastColumn?: boolean;
}

/**
 * Specifies constants define the section of Table.
 */
export enum TableSection {
    /** The entire table, including header, data and footer **/
    All = 0,
    /** The data rows **/
    Data = 1,
    /** The header row **/
    Header = 2,
    /** The footer row **/
    Footer = 3
}
    }
    


    module wijmo.grid.sheet {
    






'use strict';

/*
 * Base class for {@link FlexSheet} undo/redo actions.
 */
export class _UndoAction {
    _owner: FlexSheet;
    private _sheetIndex: number;

    /*
     * Initializes a new instance of the {@link _UndoAction} class.
     *
     * @param owner The {@link FlexSheet} control that the {@link _UndoAction} works for.
     */
    constructor(owner: FlexSheet) {
        this._owner = owner;
        this._sheetIndex = owner.selectedSheetIndex;
    }

    /*
     * Gets the index of the sheet that the undo action wokrs for.
     */
    get sheetIndex(): number {
        return this._sheetIndex;
    }

    /*
     * Executes undo of the undo action
     */
    undo() {
        throw 'This abstract method must be overridden.';
    }

    /*
     * Executes redo of the undo action
     */
    redo() {
        throw 'This abstract method must be overridden.';
    }

    /*
     * Saves the current FlexSheet state.
     */
    saveNewState(): boolean {
        throw 'This abstract method must be overridden.';
    }
}

/*
 * Defines the _EditAction class.
 *
 * It deals with the undo/redo for editing values in FlexSheet cells.
 */
export class _EditAction extends _UndoAction {
    private _selections: wijmo.grid.CellRange[];
    private _oldValues: any;
    private _newValues: any;
    private _isPaste: boolean;
    private _mergeAction: _CellMergeAction;
    private _cellStyleAction: _CellStyleAction;
    private _deletedTables: Table[];
    _affectedFormulas: any;

    /*
     * Initializes a new instance of the {@link _EditAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _EditAction works for.
     * @param selection The @CellRange of current editing cell.
     */
    constructor(owner: FlexSheet, selection?: wijmo.grid.CellRange) {
        super(owner);

        this._isPaste = false;
        this._selections = selection ? [selection] : (owner.selectedSheet.selectionRanges.length > 0 ? owner.selectedSheet.selectionRanges.slice() : [owner.selection.clone()]);
        this._mergeAction = new _CellMergeAction(owner);
        this._cellStyleAction = new _CellStyleAction(owner);
        this._saveValues(true);
    }

    /*
     * Gets the isPaste state to indicate the edit action works for edit cell or copy/paste.
     */
    get isPaste(): boolean {
        return this._isPaste;
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        if (!this._saveValues(false)) {
            return false;
        }
        this._mergeAction.saveNewState();
        this._cellStyleAction.saveNewState();

        return this._checkActionState();
    }

    /*
     * Mark the cell edit action works for paste action.
     */
    markIsPaste() {
        this._isPaste = true;
    }

    /*
     * Update the edit action for pasting.
     * 
     * @param rng the {@link CellRange} used to update the edit action
     */
    updateForPasting(rng: wijmo.grid.CellRange) {
        var selection = this._selections[this._selections.length - 1],
            val = this._owner.getCellData(rng.row, rng.col, !!this._owner.columns[rng.col].dataMap);

        if (!selection) {
            selection = this._owner.selection;
            this._selections = [selection];
        }

        val = val == null ? '' : val;
        this._oldValues['r' + rng.row + '_c' + rng.col] = {
            row: rng.row,
            col: rng.col,
            value: val
        };

        selection.row = Math.min(selection.topRow, rng.topRow);
        selection.row2 = Math.max(selection.bottomRow, rng.bottomRow);
        selection.col = Math.min(selection.leftCol, rng.leftCol);
        selection.col2 = Math.max(selection.rightCol, rng.rightCol);
    }

    // Store the deleted table.
    _storeDeletedTables(table: Table) {
        if (this._deletedTables == null) {
            this._deletedTables = [];
        }
        this._deletedTables.push(table);
    }

    // Check whether the values changed after editing.
    private _checkActionState(): boolean {
        var self = this,
            ret = false;

        Object.keys(self._oldValues).forEach((key) => {
            var oldItem: any,
                newItem: any;
            if (!ret) {
                oldItem = self._oldValues[key];
                newItem = self._newValues[key];
                if (oldItem && newItem && oldItem.value !== newItem.value) {
                    ret = true;
                }
            }
        });

        return ret || self._mergeAction._checkActionState() || self._cellStyleAction._checkActionState();
    }

    // Save undo/redo action values.
    private _saveValues(isOldValue: boolean): boolean {
        let values = {};

        for (let i = 0; i < this._selections.length; i++) {
            let selection = this._selections[i];

            for (let r = selection.topRow; r <= selection.bottomRow; r++) {
                for (let c = selection.leftCol; c <= selection.rightCol; c++) {
                    let currentCol = this._owner.columns[c];
                    if (!currentCol) {
                        return false;
                    }

                    let val = this._owner.getCellData(r, c, !!currentCol.dataMap);

                    val = val == null ? '' : val;
                    values['r' + r + '_c' + c] = {
                        row: r,
                        col: c,
                        value: val
                    };
                }
            }
        }

        if (isOldValue) {
            this._oldValues = values;
        } else {
            this._newValues = values;
        }

        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        let self = this;

        self._owner._clearCalcEngine();
        self._owner.selectedSheet.selectionRanges.clear();

        self._owner.deferUpdate(() => {
            let actionValues = isUndo ? self._oldValues : self._newValues;

            if (self._deletedTables && self._deletedTables.length > 0) {
                for (let i = 0; i < self._deletedTables.length; i++) {
                    let table = self._deletedTables[i];
                    if (isUndo) {
                        self._owner.selectedSheet.tables.push(table);
                    } else {
                        self._owner.selectedSheet.tables.remove(table);
                    }

                }
            }
            for (let i = 0; i < self._selections.length; i++) {
                let selection = self._selections[i];
                self._owner.selectedSheet.selectionRanges.push(selection);
            }
            Object.keys(actionValues).forEach((key) => {
                let item = actionValues[key];
                self._owner.setCellData(item.row, item.col, item.value);
            });

            let effectFormulas: any[];
            if (self._affectedFormulas) {
                effectFormulas = isUndo ? self._affectedFormulas.oldFormulas : self._affectedFormulas.newFormulas;
            }

            if (!!effectFormulas && effectFormulas.length > 0) {
                for (let i = 0; i < effectFormulas.length; i++) {
                    let formulaObj = effectFormulas[i];
                    self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                }
            }

            if (isUndo) {
                self._mergeAction.undo();
                self._cellStyleAction.undo();
            } else {
                self._mergeAction.redo();
                self._cellStyleAction.redo();
            }
            self._owner.refresh(false);
        });
    }
}

/*
 * Defines the _ColumnResizeAction class.
 *
 * It deals with the undo/redo for resize the column of the FlexSheet.
 */
export class _ColumnResizeAction extends _UndoAction {
    private _colIndex: number;
    private _panel: wijmo.grid.GridPanel;
    private _oldColWidth: number;
    private _newColWidth: number;

    /*
     * Initializes a new instance of the {@link _ColumnResizeAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _ColumnResizeAction works for.
     * @param panel The {@link GridPanel} indicates the resizing column belongs to which part of the FlexSheet.
     * @param colIndex it indicates which column is resizing.
     */
    constructor(owner: FlexSheet, panel: wijmo.grid.GridPanel, colIndex: number) {
        super(owner);

        this._panel = panel;
        this._colIndex = colIndex;
        this._oldColWidth = (<wijmo.grid.Column>panel.columns[colIndex]).width;
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._newColWidth = (<wijmo.grid.Column>this._panel.columns[this._colIndex]).width;
        if (this._oldColWidth === this._newColWidth) {
            return false;
        }
        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var column = <wijmo.grid.Column>this._panel.columns[this._colIndex];
        if (column) {
            column.width = isUndo ? this._oldColWidth : this._newColWidth;
        }
    }
}

/*
 * Defines the _RowResizeAction class.
 *
 * It deals with the undo\redo for resize the row of the FlexSheet.
 */
export class _RowResizeAction extends _UndoAction {
    private _rowIndex: number;
    private _panel: wijmo.grid.GridPanel;
    private _oldRowHeight: number;
    private _newRowHeight: number;

    /*
     * Initializes a new instance of the {@link _RowResizeAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _RowResizeAction works for.
     * @param panel The {@link GridPanel} indicates the resizing row belongs to which part of the FlexSheet.
     * @param rowIndex it indicates which row is resizing.
     */
    constructor(owner: FlexSheet, panel: wijmo.grid.GridPanel, rowIndex: number) {
        super(owner);

        this._panel = panel;
        this._rowIndex = rowIndex;
        this._oldRowHeight = (<wijmo.grid.Row>panel.rows[rowIndex]).height;
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._newRowHeight = (<wijmo.grid.Row>this._panel.rows[this._rowIndex]).height;
        if (this._oldRowHeight === this._newRowHeight) {
            return false;
        }
        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var row = <wijmo.grid.Row>this._panel.rows[this._rowIndex];
        if (row) {
            row.height = isUndo ? this._oldRowHeight : this._newRowHeight;
        }
    }
}

/*
 * Defines the _ColumnsChangedAction class.
 *
 * It deals with the undo\redo for insert or delete column of the FlexSheet.
 */
export class _ColumnsChangedAction extends _UndoAction {
    private _oldValue: _IColumnsChangedActionValue;
    private _newValue: _IColumnsChangedActionValue;
    private _columnIndex: number;
    private _count: number;
    private _isAdding: boolean;
    _delSubActions: _ColumnsChangedAction[] = []; // used to store undo actions for non-contiguous ranges deletion.
    _affectedFormulas: any;
    _affectedDefinedNameVals: any;
    _deletedTables: Table[];

    /*
     * Initializes a new instance of the {@link _ColumnsChangedAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _ColumnsChangedAction works for.
     * @param columnIndex The start column index of insert/remove columns operation.
     * @param count The count of insert/remove columns.
     * @param isAdding Indicates the {@link _ColumnsChangedAction} works for insert or remove columns.
     */
    constructor(owner: FlexSheet, columnIndex?: number, count?: number, isAdding?: boolean) {
        super(owner);
        this._columnIndex = columnIndex;
        this._count = count;
        this._isAdding = isAdding;
        this._saveValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._saveValues(false);
        return true;
    }

    // Save undo/redo action values.
    private _saveValues(isOldValue: boolean) {
        var columns = [],
            tableRanges = [];

        if (this._isAdding == null) {
            for (let i = 0; i < this._owner.columns.length; i++) {
                columns.push(this._owner.columns[i]);
            }
        } else {
            if ((isOldValue && !this._isAdding) || (!isOldValue && this._isAdding)) {
                for (let i = this._columnIndex; i < this._columnIndex + this._count && i < this._owner.columns.length; i++) {
                    columns.push(this._owner.columns[i]);
                }
            }
        }

        if (this._owner.selectedSheet.tables && this._owner.selectedSheet.tables.length > 0) {
            for (let i = 0; i < this._owner.selectedSheet.tables.length; i++) {
                let table = this._owner.selectedSheet.tables[i];
                if (table && table.sheet.name === this._owner.selectedSheet.name) {
                    tableRanges.push({
                        name: table.name,
                        range: table.getRange(),
                        columns: table.getColumns()
                    });
                }
            }
        }

        let value: _IColumnsChangedActionValue = {
            columns: columns,
            sortList: this._owner.sortManager._cloneSortList(this._owner.sortManager._committedList),
            styledCells: this._owner.selectedSheet ? this._owner._cloneObject(this._owner.selectedSheet._styledCells) : null,
            mergedCells: this._owner.selectedSheet ? this._owner.selectedSheet._cloneMergedCells() : null,
            tableRanges: tableRanges,
            selection: this._owner.selection,
            filterDef: this._owner.selectedSheet._filterDefinition
        };

        if (isOldValue) {
            this._oldValue = value;
        } else {
            this._newValue = value;
        }
    }

    // Handle the undo/redo action.
    private _handleUndoRedo(isUndo: boolean, updateControl = true) {
        let self = this,
            actionValues = isUndo ? self._oldValue : self._newValue;

        if (!self._owner.selectedSheet) {
            return;
        }

        if (this._delSubActions.length) {
            self._owner.deferUpdate(() => {
                if (isUndo) { // starting from the leftmost columns
                    for (let i = this._delSubActions.length - 1; i >= 0; i--) {
                        let sub = this._delSubActions[i];
                        sub._handleUndoRedo(isUndo, false);
                    }
                } else { // starting from the rightmost columns
                    for (let i = 0; i < this._delSubActions.length; i++) {
                        let sub = this._delSubActions[i];
                        sub._handleUndoRedo(isUndo, false);
                    }
                }
            });

            return;
        }

        try {
            if (updateControl) {
                this._owner.beginUpdate();
            }

            let headerRow: wijmo.grid.Row;
            self._owner._isUndoing = true;
            self._owner._clearCalcEngine();
            self._owner.finishEditing();
            if (self._isAdding == null) {
                self._owner.columns.clear();
                self._columnIndex = 0;
            }
            self._owner.selectedSheet._styledCells = null;
            self._owner.selectedSheet._mergedRanges.length = 0;

            self._owner.columns.beginUpdate();
            if (actionValues.columns && actionValues.columns.length > 0) {
                for (let colIndex = 0; colIndex < actionValues.columns.length; colIndex++) {
                    let column = actionValues.columns[colIndex];
                    if (column && column.isVisible) {
                        self._owner.columns.insert(self._columnIndex + colIndex, column);
                        if (self._owner.itemsSource) {
                            headerRow = self._owner.rows[self._owner._getDataRowsOffset() - 1];
                            if (headerRow) {
                                if (!headerRow._ubv) {
                                    headerRow._ubv = {};
                                }
                                headerRow._ubv[column._hash] = column.header;
                            }
                        }
                    }
                }
            } else {
                for (let colIndex = self._columnIndex + self._count - 1; colIndex >= self._columnIndex; colIndex--) {
                    let column = self._owner.columns[colIndex];
                    if (column && column.isVisible) {
                        self._owner.columns.removeAt(colIndex);
                    }
                }
            }
            self._owner.columns.endUpdate();

            self._owner.selectedSheet._styledCells = self._owner._cloneObject(actionValues.styledCells);
            for (let i = 0; i < actionValues.mergedCells.length; i++) {
                self._owner.selectedSheet._mergedRanges[i] = actionValues.mergedCells[i];
            }

            for (let i = 0; i < actionValues.tableRanges.length; i++) {
                let tableSetting = actionValues.tableRanges[i],
                    table = self._owner._getTable(tableSetting.name);

                if (table) {
                    table._setTableRange(tableSetting.range, tableSetting.columns);
                }
            }

            let effectFormulas: any[];

            if (self._affectedFormulas) {
                effectFormulas = isUndo ? self._affectedFormulas.oldFormulas : self._affectedFormulas.newFormulas;
            }

            // Set the 'old' formulas for undo.
            if (!!effectFormulas && effectFormulas.length > 0) {
                for (let i = 0; i < effectFormulas.length; i++) {
                    let formulaObj = effectFormulas[i];
                    if (formulaObj.point != null) {
                        if (formulaObj.sheet.name === self._owner.selectedSheet.name) {
                            self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                        } else {
                            formulaObj.sheet.grid.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                        }
                    } else {
                        formulaObj.row._ubv[formulaObj.column._hash] = formulaObj.formula;
                    }
                }
            }

            if (self._deletedTables && self._deletedTables.length > 0) {
                for (let i = 0; i < self._deletedTables.length; i++) {
                    let table = self._deletedTables[i];
                    if (isUndo) {
                        self._owner.selectedSheet.tables.push(table);
                    } else {
                        self._owner.selectedSheet.tables.remove(table);
                    }

                }
            }

            // Update defined names
            let effectDefinedNameVals: any[];
            if (self._affectedDefinedNameVals) {
                effectDefinedNameVals = isUndo ? self._affectedDefinedNameVals.oldDefinedNameVals : self._affectedDefinedNameVals.newDefinedNameVals;
            }
            if (effectDefinedNameVals && effectDefinedNameVals.length > 0) {
                for (let i = 0; i < effectDefinedNameVals.length; i++) {
                    let definedNameObj = effectDefinedNameVals[i],
                        nameIndex = self._owner._getDefinedNameIndexByName(definedNameObj.name);

                    if (nameIndex > -1) {
                        self._owner.definedNames[nameIndex].value = definedNameObj.value;
                    }
                }
            }

            // Synch the cell style for current sheet.
            self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
            // Synch the merged range for current sheet.
            self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;
        } finally {
            if (updateControl) {
                this._owner.endUpdate();
            }
        }

        // AlexI - TFS 292673
        self._owner._copyColumnsToSelectedSheet();
        self._owner.sortManager.sortDescriptions.sourceCollection = actionValues.sortList.slice();
        self._owner.selectedSheet._filterDefinition = actionValues.filterDef;
        self._owner.sortManager.commitSort(false);
        self._owner.selection = actionValues.selection;
        self._owner._isUndoing = false;
    }
}

/*
 * Defines the _RowsChangedAction class.
 *
 * It deals with the undo\redo for insert or delete row of the FlexSheet.
 */
export class _RowsChangedAction extends _UndoAction {
    private _oldValue: _IRowsChangedActionValue;
    private _newValue: _IRowsChangedActionValue;
    private _rowIndex: number;
    private _count: number;
    private _isAdding: boolean;
    private _delSubActions: _RowsChangedAction[] = []; // used to store undo actions for non-contiguous ranges deletion.
    _affectedFormulas: any;
    _affectedDefinedNameVals: any;
    _deletedTables: Table[];

    /*
     * Initializes a new instance of the {@link _RowsChangedAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _RowsChangedAction works for.
     * @param rowIndex The start row index of insert/remove rows operation.
     * @param count The count of insert/remove rows.
     * @param isAdding Indicates the {@link _RowsChangedAction} works for insert or remove rows.
     */
    constructor(owner: FlexSheet, rowIndex?: number, count?: number, isAdding?: boolean) {
        super(owner);
        this._rowIndex = rowIndex;
        this._count = count;
        this._isAdding = isAdding;
        this._saveValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._saveValues(false);
        return true;
    }

    addDeleteSubAction(sub: _RowsChangedAction) {
        this._delSubActions.push(sub);
    }

    // Save undo/redo action values.
    private _saveValues(isOldValue: boolean) {
        let items: any[],
            dataView: any[],
            rows = [],
            columns = [],
            tableRanges = [];

        if (this._isAdding == null) {
            if (this._owner.itemsSource) {
                if (this._owner.itemsSource instanceof wijmo.collections.CollectionView) {
                    items = this._owner.itemsSource.sourceCollection.slice();
                } else {
                    items = this._owner.itemsSource.slice();
                }
                for (let i = 0; i < this._owner.columns.length; i++) {
                    columns.push(this._owner.columns[i]);
                }
            } else {
                for (let i = 0; i < this._owner.rows.length; i++) {
                    rows.push(this._owner.rows[i]);
                }
            }
        } else {
            if ((isOldValue && !this._isAdding) || (!isOldValue && this._isAdding)) {
                for (let i = this._rowIndex; i < this._rowIndex + this._count && i < this._owner.rows.length; i++) {
                    let row = this._owner.rows[i];
                    if (row.isVisible || this._isAdding) {
                        rows.push(row);
                    } else {
                        rows.push(null);
                    }
                }
            }
            if (this._owner.collectionView && this._owner.collectionView.sortDescriptions.length > 0) {
                dataView = (<wijmo.collections.CollectionView>this._owner.collectionView)._view.slice();
            }
        }

        if (this._owner.selectedSheet.tables && this._owner.selectedSheet.tables.length > 0) {
            for (let i = 0; i < this._owner.selectedSheet.tables.length; i++) {
                let table = this._owner.selectedSheet.tables[i];
                if (table && table.sheet.name === this._owner.selectedSheet.name) {
                    tableRanges.push({
                        name: table.name,
                        range: table.getRange(),
                        setting: {
                            showHeaderRow: table.showHeaderRow,
                            showTotalRow: table.showTotalRow
                        }
                    });
                }
            }
        }

        let value = {
            rows: rows,
            columns: columns,
            itemsSource: items,
            styledCells: this._owner.selectedSheet ? this._owner._cloneObject(this._owner.selectedSheet._styledCells) : null,
            mergedCells: this._owner.selectedSheet ? this._owner.selectedSheet._cloneMergedCells() : null,
            tableSettings: tableRanges,
            selection: this._owner.selection,
            dataView: dataView,
            scrollPosition: this._owner.scrollPosition
        };

        if (isOldValue) {
            this._oldValue = value;
        } else {
            this._newValue = value;
        }
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean, updateControl = true) {
        var self = this,
            dataSourceBinding = !!self._owner.itemsSource,
            actionValues = isUndo ? self._oldValue : self._newValue,
            originAutoGenerateColumns: boolean;

        if (!self._owner.selectedSheet) {
            return;
        }

        if (this._delSubActions.length) {
            self._owner.deferUpdate(() => {
                if (isUndo) { // starting from the top rows
                    for (let i = this._delSubActions.length - 1; i >= 0; i--) {
                        let sub = this._delSubActions[i];
                        sub._handleUndoRedo(isUndo, false);
                    }
                } else { // starting from the bottom rows
                    for (let i = 0; i < this._delSubActions.length; i++) {
                        let sub = this._delSubActions[i];
                        sub._handleUndoRedo(isUndo, false);
                    }
                }
            });

            return;
        }

        try {
            if (updateControl) {
                self._owner.beginUpdate();
            }

            self._owner._isUndoing = true;
            self._owner._clearCalcEngine();
            self._owner.finishEditing();
            if (self._isAdding == null) {
                if (self._owner.itemsSource) {
                    self._owner.columns.clear();
                }
                self._owner.rows.clear();
                self._rowIndex = 0;
            }
            self._owner.selectedSheet._styledCells = null;
            self._owner.selectedSheet._mergedRanges.length = 0;

            if (this._isAdding == null && dataSourceBinding) {
                originAutoGenerateColumns = self._owner.autoGenerateColumns;
                self._owner.autoGenerateColumns = false;
                self._owner.collectionView.beginUpdate();
                if (self._owner.itemsSource instanceof wijmo.collections.CollectionView) {
                    let args = [0, self._owner.itemsSource.sourceCollection.length].concat(actionValues.itemsSource);
                    Array.prototype.splice.apply(self._owner.itemsSource.sourceCollection, args);
                } else {
                    self._owner.itemsSource = actionValues.itemsSource.slice();
                }
                self._owner.columns.beginUpdate();
                for (let i = 0; i < actionValues.columns.length; i++) {
                    self._owner.columns.push(actionValues.columns[i]);
                }
                self._owner.columns.endUpdate();
                self._owner.collectionView.endUpdate(true);
                self._owner.autoGenerateColumns = originAutoGenerateColumns;
            } else {
                self._owner.rows.beginUpdate();

                let startItemIndex: number;
                if (dataSourceBinding) {
                    originAutoGenerateColumns = self._owner.autoGenerateColumns;
                    self._owner.autoGenerateColumns = false;
                    startItemIndex = self._rowIndex - self._owner._getDataRowsOffset();
                    self._owner.collectionView.beginUpdate();
                }

                let cv = self._owner.collectionView,
                    cvc = cv instanceof wijmo.collections.CollectionView ? cv : null;

                if (actionValues.rows && actionValues.rows.length > 0) {
                    for (let i = 0; i < actionValues.rows.length; i++) {
                        let row = actionValues.rows[i];
                        if (row) {
                            if (dataSourceBinding && row.dataItem) {
                                let itemIndex = row.dataItem._itemIdx != null
                                    ? row.dataItem._itemIdx
                                    : startItemIndex + i;

                                // redo
                                self._owner._updateItemIndexForInsertingRow(cv.sourceCollection, itemIndex, 1);
                                cv.sourceCollection.splice(itemIndex, 0, row.dataItem);

                                if (cvc && cvc.trackChanges) {
                                    // New items are not added to the cvc.itemsRemoved after insert+redo, so, it is NOT a new item.
                                    let isRemoved = cvc.itemsRemoved.indexOf(row.dataItem) >= 0;

                                    if (isRemoved) {
                                        cvc.itemsRemoved.remove(row.dataItem);
                                    }

                                    if (!isRemoved && (cvc.itemsAdded.indexOf(row.dataItem) <= 0)) {
                                        cvc.itemsAdded.push(row.dataItem);
                                    }
                                }

                                //let cv = self._owner.itemsSource instanceof CollectionView
                                //    ? <CollectionView>self._owner.itemsSource
                                //    : null;

                                //if (cv) { // redo
                                //    self._owner._updateItemIndexForInsertingRow(cv.sourceCollection, itemIndex, 1);
                                //    cv.sourceCollection.splice(itemIndex, 0, row.dataItem);

                                //    if (cv.trackChanges) {
                                //        // New items are not added to the cv.itemsRemoved after insert+redo, so, its NOT a new item.
                                //        let isRemoved = cv.itemsRemoved.indexOf(row.dataItem) >= 0;

                                //        if (isRemoved) {
                                //            cv.itemsRemoved.remove(row.dataItem);
                                //        }

                                //        if (!isRemoved && (cv.itemsAdded.indexOf(row.dataItem) <= 0)) {
                                //            cv.itemsAdded.push(row.dataItem);
                                //        }
                                //    }
                                //} else {
                                //    self._owner._updateItemIndexForInsertingRow(self._owner.itemsSource, itemIndex, 1);
                                //    self._owner.itemsSource.splice(itemIndex, 0, row.dataItem);
                                //}
                            } else {
                                self._owner.rows.insert(self._rowIndex + i, row);
                            }
                        }
                    }
                } else {
                    for (let ri = self._rowIndex + self._count - 1; ri >= self._rowIndex; ri--) {
                        let row = self._owner.rows[ri];
                        if (row) {
                            if (dataSourceBinding && row.dataItem) {
                                let itemIndex = row.dataItem._itemIdx != null
                                    ? row.dataItem._itemIdx
                                    : ri - self._owner._getDataRowsOffset();

                                cv.sourceCollection.splice(itemIndex, 1);
                                self._owner._updateItemIndexForRemovingRow(cv.sourceCollection, itemIndex);

                                if (cvc && cvc.trackChanges) {
                                    // Existing items are not added to the cvc.itemsAdded after delete+undo, so it is a new item.
                                    let isAdded = cvc.itemsAdded.indexOf(row.dataItem) >= 0;

                                    if (isAdded) {
                                        cvc.itemsAdded.remove(row.dataItem);
                                    }

                                    if (!isAdded && (cvc.itemsRemoved.indexOf(row.dataItem) < 0)) {
                                        cvc.itemsRemoved.push(row.dataItem);
                                    }
                                }

                                //let cv = self._owner.itemsSource instanceof CollectionView
                                //    ? <CollectionView>self._owner.itemsSource
                                //    : null;

                                //if (cv) { // undo
                                //    cv.sourceCollection.splice(itemIndex, 1);
                                //    self._owner._updateItemIndexForRemovingRow(cv.sourceCollection, itemIndex);

                                //    if (cv.trackChanges) {
                                //        // Existing items are not added to the cv.itemsAdded after delete+undo, so it is a new item.
                                //        let isAdded = cv.itemsAdded.indexOf(row.dataItem) >= 0;

                                //        if (isAdded) {
                                //            cv.itemsAdded.remove(row.dataItem);
                                //        }

                                //        if (!isAdded && (cv.itemsRemoved.indexOf(row.dataItem) < 0)) {
                                //            cv.itemsRemoved.push(row.dataItem);
                                //        }
                                //    }
                                //} else {
                                //    self._owner.itemsSource.splice(itemIndex, 1);
                                //    self._owner._updateItemIndexForRemovingRow(self._owner.itemsSource, itemIndex);
                                //}
                            } else {
                                self._owner.rows.removeAt(ri);
                            }
                        }
                    }
                }
                if (dataSourceBinding) {
                    self._owner._lastCount = (<wijmo.collections.CollectionView>self._owner.collectionView).itemCount;
                    self._owner.collectionView.endUpdate(true);
                    if (actionValues.dataView && actionValues.dataView.length > 0) {
                        (<wijmo.collections.CollectionView>self._owner.collectionView)._view = actionValues.dataView;
                        (<wijmo.collections.CollectionView>self._owner.collectionView)._pgView = (<wijmo.collections.CollectionView>self._owner.collectionView)._getPageView();
                        if (!(self._owner.itemsSource instanceof wijmo.collections.CollectionView)) {
                            (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._view = actionValues.dataView;
                            (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._getPageView();
                        }
                        self._owner['_bindGrid'](false);
                        self._owner.selectedSheet.grid['_bindGrid'](false);
                    }
                    self._owner.autoGenerateColumns = originAutoGenerateColumns;
                }

                self._owner.rows.endUpdate();
            }

            self._owner.selectedSheet._styledCells = self._owner._cloneObject(actionValues.styledCells);
            for (let i = 0; i < actionValues.mergedCells.length; i++) {
                self._owner.selectedSheet._mergedRanges[i] = actionValues.mergedCells[i];
            }

            for (let i = 0; i < actionValues.tableSettings.length; i++) {
                let tableSetting = actionValues.tableSettings[i],
                    table = self._owner._getTable(tableSetting.name);

                if (table) {
                    table['_showHeaderRow'] = tableSetting.setting.showHeaderRow;
                    table['_showTotalRow'] = tableSetting.setting.showTotalRow;
                    table._setTableRange(tableSetting.range);
                }
            }

            let effectFormulas: any[];
            if (self._affectedFormulas) {
                effectFormulas = isUndo ? self._affectedFormulas.oldFormulas : self._affectedFormulas.newFormulas;
            }

            // Set the 'old' formulas for undo.
            if (!!effectFormulas && effectFormulas.length > 0) {
                for (let i = 0; i < effectFormulas.length; i++) {
                    let formulaObj = effectFormulas[i];
                    if (formulaObj.point != null) {
                        if (formulaObj.sheet.name === self._owner.selectedSheet.name) {
                            self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                        } else {
                            formulaObj.sheet.grid.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                        }
                    } else {
                        formulaObj.row._ubv[formulaObj.column._hash] = formulaObj.formula;
                    }
                }
            }

            if (self._deletedTables && self._deletedTables.length > 0) {
                for (let i = 0; i < self._deletedTables.length; i++) {
                    let table = self._deletedTables[i];
                    if (isUndo) {
                        self._owner.selectedSheet.tables.push(table);
                    } else {
                        self._owner.selectedSheet.tables.remove(table);
                    }
                }
            }

            // Update defined names
            let effectDefinedNameVals: any[];
            if (self._affectedDefinedNameVals) {
                effectDefinedNameVals = isUndo ? self._affectedDefinedNameVals.oldDefinedNameVals : self._affectedDefinedNameVals.newDefinedNameVals;
            }
            if (effectDefinedNameVals && effectDefinedNameVals.length > 0) {
                for (let i = 0; i < effectDefinedNameVals.length; i++) {
                    let definedNameObj = effectDefinedNameVals[i],
                        nameIndex = self._owner._getDefinedNameIndexByName(definedNameObj.name);
                    if (nameIndex > -1) {
                        self._owner.definedNames[nameIndex].value = definedNameObj.value;
                    }
                }
            }

            // Synch the cell style for current sheet.
            self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
            // Synch the merged range for current sheet.
            self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;

            self._owner.selection = actionValues.selection;
            self._owner.scrollPosition = actionValues.scrollPosition;
            self._owner._isUndoing = false;
        }
        finally {
            if (updateControl) {
                self._owner.endUpdate();
            }
        }

        self._owner._copyRowsToSelectedSheet();
    }
}

/*
 * Defines the _CellStyleAction class.
 *
 * It deals with the undo\redo for applying style for the cells of the FlexSheet.
 */
export class _CellStyleAction extends _UndoAction {
    private _oldStyledCells: any;
    private _newStyledCells: any;

    /*
     * Initializes a new instance of the {@link _CellStyleAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _CellStyleAction works for.
     * @param styledCells Current styled cells of the {@link FlexSheet} control.
     */
    constructor(owner: FlexSheet, styledCells?: any) {
        super(owner);

        this._oldStyledCells = styledCells ? owner._cloneObject(styledCells) : (owner.selectedSheet ? owner._cloneObject(owner.selectedSheet._styledCells) : null);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._newStyledCells = this._owner.selectedSheet ? this._owner._cloneObject(this._owner.selectedSheet._styledCells) : null;
        return true;
    }

    // Check whether the values changed after editing.
    _checkActionState() {
        if (this._oldStyledCells != null && this._newStyledCells == null || this._oldStyledCells == null && this._newStyledCells != null) {
            return true;
        }

        if (this._oldStyledCells != null && this._newStyledCells != null && this._oldStyledCells.length !== this._newStyledCells.length) {
            return true;
        }

        return false;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var styledCells: any;

        if (!this._owner.selectedSheet) {
            return;
        }
        styledCells = isUndo ? this._oldStyledCells : this._newStyledCells;
        this._owner.selectedSheet._styledCells = this._owner._cloneObject(styledCells);
        this._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = this._owner.selectedSheet._styledCells;
        this._owner.refresh(false);
    }
}

/*
 * Defines the _CellMergeAction class.
 *
 * It deals with the undo\redo for merging the cells of the FlexSheet.
 */
export class _CellMergeAction extends _UndoAction {
    private _oldMergedCells: wijmo.grid.CellRange[];
    private _newMergedCells: wijmo.grid.CellRange[];

    /*
     * Initializes a new instance of the {@link _CellMergeAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _CellMergeAction works for.
     */
    constructor(owner: FlexSheet) {
        super(owner);

        this._oldMergedCells = owner.selectedSheet ? owner.selectedSheet._cloneMergedCells() : null;
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._newMergedCells = this._owner.selectedSheet ? this._owner.selectedSheet._cloneMergedCells() : null;
        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var mergedCells: wijmo.grid.CellRange[],
            mergeCellIndex: number;
        if (!this._owner.selectedSheet) {
            return;
        }
        mergedCells = isUndo ? this._oldMergedCells : this._newMergedCells;
        this._owner._clearCalcEngine();
        if (mergedCells) {
            this._owner.selectedSheet._mergedRanges.length = 0;
            for (mergeCellIndex = 0; mergeCellIndex < mergedCells.length; mergeCellIndex++) {
                this._owner.selectedSheet._mergedRanges[mergeCellIndex] = mergedCells[mergeCellIndex];
            }
        }
        this._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = this._owner.selectedSheet._mergedRanges;
        this._owner.refresh(true);
    }

    // Check whether the values changed after editing.
    _checkActionState() {
        let index: number,
            newMergeCell: wijmo.grid.CellRange,
            oldMergeCell: wijmo.grid.CellRange;

        if (this._oldMergedCells != null && this._newMergedCells == null || this._oldMergedCells == null && this._newMergedCells != null) {
            return true;
        }

        if (this._oldMergedCells != null && this._newMergedCells != null && this._oldMergedCells.length !== this._newMergedCells.length) {
            return true;
        }

        if (this._oldMergedCells != null && this._newMergedCells != null && this._oldMergedCells.length === this._newMergedCells.length) {
            for (index = 0; index < this._oldMergedCells.length; index++) {
                oldMergeCell = this._oldMergedCells[index];
                newMergeCell = this._oldMergedCells[index];
                if (!oldMergeCell.equals(newMergeCell)) {
                    return true;
                }
            }
        }

        return false;
    }
}

/*
 * Defines the _SortColumnAction class.
 *
 * It deals with the undo\redo for sort columns of the FlexSheet.
 */
export class _SortColumnAction extends _UndoAction {
    private _oldValue: _ISortColumnActionValue;
    private _newValue: _ISortColumnActionValue;

    /*
     * Initializes a new instance of the {@link _CellMergeAction} class.
     *
     * @param owner The {@link FlexSheet} control that the {@link _CellMergeAction} works for.
     */
    constructor(owner: FlexSheet) {
        super(owner);

        this._saveValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._saveValues(false);
        return true;
    }

    // Save undo/redo action values.
    private _saveValues(isOldvalue: boolean) {
        let columns: wijmo.grid.Column[] = [],
            rows: wijmo.grid.Row[],
            rowsVisible: boolean[],
            dataView: any[];

        for (let colIndex = 0; colIndex < this._owner.columns.length; colIndex++) {
            columns.push(this._owner.columns[colIndex]);
        }

        if (this._owner.itemsSource) {
            let itemOffset = this._owner._getDataRowsOffset();
            rowsVisible = [];
            for (let i = 0; i < this._owner.rows.length - itemOffset; i++) {
                let row = this._owner.rows[i + itemOffset],
                    item = row.dataItem;

                if (item) {
                    let itemIndex = item._itemIdx != null ? item._itemIdx : i;
                    rowsVisible[itemIndex] = row.visible;
                }
            }
            if (isOldvalue) {
                dataView = (<wijmo.collections.CollectionView>this._owner.collectionView)._view.slice();
            }
        } else {
            rows = [];
            for (let i = 0; i < this._owner.rows.length; i++) {
                rows.push(this._owner.rows[i]);
            }
        }

        let value = {
            sortList: this._owner.sortManager._committedList.slice(),
            rows: rows,
            columns: columns,
            selection: this._owner.selection.clone(),
            formulas: this._owner._scanFormulas(),
            styledCells: this._owner.selectedSheet ? this._owner._cloneObject(this._owner.selectedSheet._styledCells) : null,
            rowsVisible: rowsVisible,
            dataView: dataView
        }

        if (isOldvalue) {
            this._oldValue = value;
        } else {
            this._newValue = value;
        }
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        let self = this,
            actionValues = isUndo ? self._oldValue : self._newValue,
            isBoundSheet = !!self._owner.itemsSource,
            isCVItemsSource = this._owner.itemsSource instanceof wijmo.collections.CollectionView;

        if (!self._owner.selectedSheet) {
            return;
        }
        self._owner._isUndoing = true;
        self._owner.deferUpdate(() => {
            self._owner._clearCalcEngine();
            self._owner.sortManager.sortDescriptions.sourceCollection = actionValues.sortList.slice();
            self._owner.sortManager.commitSort(false);
            self._owner.selectedSheet._styledCells = self._owner._cloneObject(actionValues.styledCells);

            if (isBoundSheet) {
                if (actionValues.dataView && actionValues.dataView.length > 0) {
                    (<wijmo.collections.CollectionView>self._owner.collectionView)._view = actionValues.dataView;
                    (<wijmo.collections.CollectionView>self._owner.collectionView)._pgView = (<wijmo.collections.CollectionView>self._owner.collectionView)._getPageView();
                    if (!isCVItemsSource) {
                        (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._view = actionValues.dataView;
                        (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>self._owner.selectedSheet.grid.collectionView)._getPageView();
                    }
                    self._owner['_bindGrid'](false);
                    self._owner.selectedSheet.grid['_bindGrid'](false);
                }
            } else {
                self._owner.rows.clear();
                self._owner.selectedSheet.grid.rows.clear();
                for (let i = 0; i < actionValues.rows.length; i++) {
                    let row = actionValues.rows[i];
                    self._owner.selectedSheet.grid.rows.push(row);
                    self._owner.rows.push(row);
                }

                self._owner.columns.clear();

                for (let i = 0; i < actionValues.columns.length; i++) {
                    let column = actionValues.columns[i];
                    self._owner.columns.push(column);
                }

                self._owner._resetFormulas(actionValues.formulas);
            }

            self._owner._isUndoing = false;
        });
    }
}

/*
 * Defines the _MoveCellsAction class.
 *
 * It deals with drag & drop the rows or columns to move or copy the cells action.
 */
export class _MoveCellsAction extends _UndoAction {
    private _draggingCells: _IMoveCellsActionValue[];
    private _draggingColumnSetting: any;
    private _oldDroppingCells: _IMoveCellsActionValue[];
    private _newDroppingCells: _IMoveCellsActionValue[];
    private _oldDroppingColumnSetting: any;
    private _newDroppingColumnSetting: any;
    private _dragRange: wijmo.grid.CellRange;
    private _dropRange: wijmo.grid.CellRange;
    private _isCopyCells: boolean;
    private _isDraggingColumns: boolean;
    private _draggingTableColumns: _IMoveCellsActionValue[];
    _affectedFormulas: any;
    _affectedDefinedNameVals: any;

    /*
     * Initializes a new instance of the {@link _MoveCellsAction} class.
     *
     * @param owner The {@link FlexSheet} control that the {@link _MoveCellsAction} works for.
     * @param draggingCells The {@link CellRange} contains dragging target cells.
     * @param droppingCells The {@link CellRange} contains the dropping target cells.
     * @param isCopyCells Indicates whether the action is moving or copying the cells.
     */
    constructor(owner: FlexSheet, draggingCells: wijmo.grid.CellRange, droppingCells: wijmo.grid.CellRange, isCopyCells: boolean) {
        super(owner);

        if (!owner.selectedSheet) {
            return;
        }

        if (draggingCells.topRow === 0 && draggingCells.bottomRow === owner.rows.length - 1) {
            this._isDraggingColumns = true;
        } else {
            this._isDraggingColumns = false;
        }

        this._isCopyCells = isCopyCells;
        this._dragRange = draggingCells;
        this._dropRange = droppingCells;

        this._saveValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        if (!this._owner.selectedSheet) {
            return false;
        }
        if (this._dropRange) {
            this._saveValues(false);
            return true;
        }
        return false;
    }

    // Save undo/redo action values.
    private _saveValues(isOldvalue: boolean) {
        let droppingCells = [],
            droppingColumnSetting = {};

        for (let ri = this._dropRange.topRow; ri <= this._dropRange.bottomRow; ri++) {
            for (let ci = this._dropRange.leftCol; ci <= this._dropRange.rightCol; ci++) {
                if (this._isDraggingColumns) {
                    if (!droppingColumnSetting[ci]) {
                        droppingColumnSetting[ci] = {
                            dataType: this._owner.columns[ci].dataType,
                            align: this._owner.columns[ci].align,
                            format: this._owner.columns[ci].format
                        };
                    }
                }

                let cellIndex = ri * this._owner.columns.length + ci,
                    cellStyle = this._owner.selectedSheet._styledCells[cellIndex]
                        ? this._owner._cloneObject(this._owner.selectedSheet._styledCells[cellIndex])
                        : null,
                    val = this._owner.getCellData(ri, ci, false);

                droppingCells.push({
                    rowIndex: ri,
                    columnIndex: ci,
                    cellContent: val,
                    cellStyle: cellStyle
                });
            }
        }

        if (isOldvalue) {
            this._oldDroppingCells = droppingCells;
            this._oldDroppingColumnSetting = droppingColumnSetting;
        } else {
            this._newDroppingCells = droppingCells;
            this._newDroppingColumnSetting = droppingColumnSetting;
        }

        if (this._isCopyCells) {
            if (this._isDraggingColumns) {
                if (isOldvalue) {
                    for (let ri = this._dragRange.topRow; ri <= this._dragRange.bottomRow; ri++) {
                        for (let ci = this._dragRange.leftCol; ci <= this._dragRange.rightCol; ci++) {
                            let table = this._owner.selectedSheet.findTable(ri, ci);

                            if (table && table._isHeaderRow(ri)) {
                                let tableRange = table._getTableRange(),
                                    tableColumns = table._getColumns();

                                if (!this._draggingTableColumns) {
                                    this._draggingTableColumns = [];
                                }
                                this._draggingTableColumns.push({
                                    rowIndex: ri,
                                    columnIndex: ci,
                                    cellContent: tableColumns[ci - tableRange.leftCol].name
                                });
                            }
                        }
                    }
                } else {
                    if (this._draggingTableColumns && this._draggingTableColumns.length > 0) {
                        if (this._draggingTableColumns && this._draggingTableColumns.length > 0) {
                            for (let i = 0; i < this._draggingTableColumns.length; i++) {
                                let draggingCell = this._draggingTableColumns[i],
                                    table = this._owner.selectedSheet.findTable(draggingCell.rowIndex, draggingCell.columnIndex);

                                if (table && table._isHeaderRow(draggingCell.rowIndex)) {
                                    let tableRange = table._getTableRange(),
                                        tableColumns = table._getColumns();
                                    draggingCell.updatedCellContent = tableColumns[draggingCell.columnIndex - tableRange.leftCol].name;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (isOldvalue) {
                this._draggingCells = [];
                this._draggingColumnSetting = {};
                for (let ri = this._dragRange.topRow; ri <= this._dragRange.bottomRow; ri++) {
                    for (let ci = this._dragRange.leftCol; ci <= this._dragRange.rightCol; ci++) {
                        if (this._isDraggingColumns) {
                            if (!this._draggingColumnSetting[ci]) {
                                this._draggingColumnSetting[ci] = {
                                    dataType: this._owner.columns[ci].dataType,
                                    align: this._owner.columns[ci].align,
                                    format: this._owner.columns[ci].format
                                };
                            }
                        }
                        let cellIndex = ri * this._owner.columns.length + ci,
                            cellStyle = this._owner.selectedSheet._styledCells[cellIndex]
                                ? this._owner._cloneObject(this._owner.selectedSheet._styledCells[cellIndex])
                                : null,
                            val = this._owner.getCellData(ri, ci, false);

                        this._draggingCells.push({
                            rowIndex: ri,
                            columnIndex: ci,
                            cellContent: val,
                            cellStyle: cellStyle
                        });
                    }
                }
            } else if (this._isDraggingColumns) {
                if (this._draggingCells && this._draggingCells.length > 0) {
                    for (let i = 0; i < this._draggingCells.length; i++) {
                        let draggingCell = this._draggingCells[i],
                            table = this._owner.selectedSheet.findTable(draggingCell.rowIndex, draggingCell.columnIndex);

                        if (table && table._isHeaderRow(draggingCell.rowIndex)) {
                            let tableRange = table._getTableRange(),
                                tableColumns = table._getColumns();
                            draggingCell.updatedCellContent = tableColumns[draggingCell.columnIndex - tableRange.leftCol].name;
                        }
                    }
                }
            }
        }
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var self = this,
            droppingCells = isUndo ? self._oldDroppingCells : self._newDroppingCells,
            droppingColumnSetting = isUndo ? self._oldDroppingColumnSetting : self._newDroppingColumnSetting;

        if (!self._owner.selectedSheet) {
            return;
        }

        self._owner._clearCalcEngine();
        self._owner.deferUpdate(() => {
            // Update the formulas.
            let effectFormulas: any[];

            if (self._affectedFormulas) {
                effectFormulas = isUndo ? self._affectedFormulas.oldFormulas : self._affectedFormulas.newFormulas;
            }
            if (!!effectFormulas && effectFormulas.length > 0) {
                for (let i = 0; i < effectFormulas.length; i++) {
                    let formulaObj = effectFormulas[i];
                    if (formulaObj.sheet.name === self._owner.selectedSheet.name) {
                        self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                    } else {
                        formulaObj.sheet.grid.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                    }
                }
            }

            // Update defined names
            let effectDefinedNameVals: any[];
            if (self._affectedDefinedNameVals) {
                effectDefinedNameVals = isUndo ? self._affectedDefinedNameVals.oldDefinedNameVals : self._affectedDefinedNameVals.newDefinedNameVals;
            }
            if (effectDefinedNameVals && effectDefinedNameVals.length > 0) {
                for (let i = 0; i < effectDefinedNameVals.length; i++) {
                    let definedNameObj = effectDefinedNameVals[i],
                        nameIndex = self._owner._getDefinedNameIndexByName(definedNameObj.name);

                    if (nameIndex > -1) {
                        self._owner.definedNames[nameIndex].value = definedNameObj.value;
                    }
                }
            }

            for (let i = 0; i < droppingCells.length; i++) {
                let action = droppingCells[i];
                self._owner.setCellData(action.rowIndex, action.columnIndex, action.cellContent);
                let table = self._owner.selectedSheet.findTable(action.rowIndex, action.columnIndex);

                if (table && table._isHeaderRow(action.rowIndex)) {
                    let tableRange = table._getTableRange(),
                        tableColumns = table._getColumns();

                    tableColumns[action.columnIndex - tableRange.leftCol].name = action.cellContent;
                }

                let cellIndex = action.rowIndex * self._owner.columns.length + action.columnIndex;
                if (action.cellStyle) {
                    self._owner.selectedSheet._styledCells[cellIndex] = action.cellStyle;
                } else {
                    delete self._owner.selectedSheet._styledCells[cellIndex];
                }
            }

            if (self._isDraggingColumns && !!droppingColumnSetting) {
                Object.keys(droppingColumnSetting).forEach((key) => {
                    self._owner.columns[+key].dataType = droppingColumnSetting[+key].dataType ? droppingColumnSetting[+key].dataType : wijmo.DataType.Object;
                    self._owner.columns[+key].align = droppingColumnSetting[+key].align;
                    self._owner.columns[+key].format = droppingColumnSetting[+key].format;
                });
            }

            if (self._isCopyCells) {
                if (self._draggingTableColumns && self._draggingTableColumns.length > 0) {
                    for (let i = 0; i < self._draggingTableColumns.length; i++) {
                        let action = self._draggingTableColumns[i];
                        let table = self._owner.selectedSheet.findTable(action.rowIndex, action.columnIndex);
                        if (table && table._isHeaderRow(action.rowIndex)) {
                            let tableRange = table._getTableRange(),
                                tableColumns = table._getColumns();

                            self._owner.setCellData(action.rowIndex, action.columnIndex, (isUndo ? action.cellContent : action.updatedCellContent));
                            tableColumns[action.columnIndex - tableRange.leftCol].name = isUndo ? action.cellContent : action.updatedCellContent
                        }
                    }
                }
            } else {
                for (let i = 0; i < self._draggingCells.length; i++) {
                    let action = self._draggingCells[i];
                    let table = self._owner.selectedSheet.findTable(action.rowIndex, action.columnIndex);
                    if (table) {
                        let tableRange = table._getTableRange(),
                            tableColumns = table._getColumns();

                        if (table._isHeaderRow(action.rowIndex)) {
                            self._owner.setCellData(action.rowIndex, action.columnIndex, (isUndo ? action.cellContent : action.updatedCellContent));
                            tableColumns[action.columnIndex - tableRange.leftCol].name = isUndo ? action.cellContent : action.updatedCellContent;
                        } else {
                            self._owner.setCellData(action.rowIndex, action.columnIndex, (isUndo ? action.cellContent : null));
                        }
                    } else {
                        self._owner.setCellData(action.rowIndex, action.columnIndex, (isUndo ? action.cellContent : null));

                    }
                    let cellIndex = action.rowIndex * self._owner.columns.length + action.columnIndex;
                    if (isUndo) {
                        if (action.cellStyle) {
                            self._owner.selectedSheet._styledCells[cellIndex] = action.cellStyle;
                        }
                    } else {
                        if (self._owner.selectedSheet._styledCells[cellIndex]) {
                            delete self._owner.selectedSheet._styledCells[cellIndex];
                        }
                    }
                }

                if (self._isDraggingColumns && !!self._draggingColumnSetting) {
                    Object.keys(self._draggingColumnSetting).forEach((key) => {
                        self._owner.columns[+key].dataType = isUndo ? (self._draggingColumnSetting[+key].dataType ? self._draggingColumnSetting[+key].dataType : wijmo.DataType.Object) : wijmo.DataType.Object;
                        self._owner.columns[+key].align = isUndo ? self._draggingColumnSetting[+key].align : null;
                        self._owner.columns[+key].format = isUndo ? self._draggingColumnSetting[+key].format : null;
                    });
                }

                if (isUndo) {
                    if (self._isDraggingColumns) {
                        if (self._dragRange.leftCol < self._dropRange.leftCol) {
                            let descColIndex = self._dragRange.leftCol;
                            for (let srcColIndex = self._dropRange.leftCol; srcColIndex <= self._dropRange.rightCol; srcColIndex++) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex++;
                            }
                        } else {
                            let descColIndex = self._dragRange.rightCol;
                            for (let srcColIndex = self._dropRange.rightCol; srcColIndex >= self._dropRange.leftCol; srcColIndex--) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex--;
                            }
                        }
                    }
                } else {
                    if (self._isDraggingColumns) {
                        if (self._dragRange.leftCol > self._dropRange.leftCol) {
                            let descColIndex = self._dropRange.leftCol;
                            for (let srcColIndex = self._dragRange.leftCol; srcColIndex <= self._dragRange.rightCol; srcColIndex++) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex++;
                            }
                        } else {
                            let descColIndex = self._dropRange.rightCol;
                            for (let srcColIndex = self._dragRange.rightCol; srcColIndex >= self._dragRange.leftCol; srcColIndex--) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex--;
                            }
                        }
                    }
                }
            }
        });
    }
}

/*
 * Defines the _CutAction class.
 *
 * It deals with the undo/redo for cutting pasting values in FlexSheet cells.
 */
export class _CutAction extends _UndoAction {
    private _selection: wijmo.grid.CellRange;
    private _cutSelection: wijmo.grid.CellRange;
    private _cutSheet: Sheet;
    private _oldValues: any[];
    private _newValues: any[];
    private _oldCutValues: any[];
    private _newCutValues: any[];
    private _mergeAction: _CellMergeAction;
    private _celltyleAction: _CellStyleAction;

    /*
     * Initializes a new instance of the {@link _CutAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _CutAction works for.
     */
    constructor(owner: FlexSheet) {
        super(owner);

        this._oldValues = [];
        this._mergeAction = new _CellMergeAction(owner);
        this._celltyleAction = new _CellStyleAction(owner);
        this._cutSheet = owner._copiedSheet;
        this._selection = owner.selection;
        this._cutSelection = owner.selectionMode === wijmo.grid.SelectionMode.ListBox ? owner._getSelectionForListBoxMode(this._cutSheet.grid) : owner._copiedRanges[0];
        this._saveCutValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        var cutSource = this._cutSheet === this._owner.selectedSheet ? this._owner : this._cutSheet.grid;

        this._saveCutValues(false);

        this._newValues = [];
        for (let ri = this._selection.topRow; ri <= this._selection.bottomRow; ri++) {
            for (let ci = this._selection.leftCol; ci <= this._selection.rightCol; ci++) {
                let currentCol = this._owner.columns[ci];
                if (!currentCol) {
                    return false;
                }
                let val = this._owner.getCellData(ri, ci, !!this._owner.columns[ci].dataMap);
                val = val == null ? '' : val;
                this._newValues.push({
                    row: ri,
                    col: ci,
                    value: val
                });
            }
        }
        this._mergeAction.saveNewState();
        this._celltyleAction.saveNewState();

        return true;
    }

    /*
     * Update the cut action for pasting.
     * 
     * @param rng the {@link CellRange} used to update the cut action
     */
    updateForPasting(rng: wijmo.grid.CellRange) {
        var val = this._owner.getCellData(rng.row, rng.col, !!this._owner.columns[rng.col].dataMap);

        val = val == null ? '' : val;
        this._oldValues.push({
            row: rng.row,
            col: rng.col,
            value: val
        });

        this._selection.row = Math.min(this._selection.topRow, rng.topRow);
        this._selection.row2 = Math.max(this._selection.bottomRow, rng.bottomRow);
        this._selection.col = Math.min(this._selection.leftCol, rng.leftCol);
        this._selection.col2 = Math.max(this._selection.rightCol, rng.rightCol);
    }

    // Save undo/redo action cut values.
    private _saveCutValues(isOldvalue: boolean) {
        let cutSource = this._cutSheet === this._owner.selectedSheet ? this._owner : this._cutSheet.grid,
            cutValues = [];

        for (let ri = this._cutSelection.topRow; ri <= this._cutSelection.bottomRow; ri++) {
            if (cutSource.rows[ri] == null) {
                continue;
            }
            for (let ci = this._cutSelection.leftCol; ci <= this._cutSelection.rightCol; ci++) {
                let val = cutSource.getCellData(ri, ci, !!cutSource.columns[ci].dataMap);
                val = val == null ? '' : val;
                cutValues.push({
                    row: ri,
                    col: ci,
                    value: val
                });
            }
        }

        if (isOldvalue) {
            this._oldCutValues = cutValues;
        } else {
            this._newCutValues = cutValues;
        }
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var self = this,
            cutvalues = isUndo ? self._oldCutValues : self._newCutValues,
            values = isUndo ? self._oldValues : self._newValues;

        self._owner._clearCalcEngine();
        self._owner.selectedSheet.selectionRanges.clear();

        self._owner.deferUpdate(() => {
            var i: number,
                item: any,
                cutSource = self._cutSheet === self._owner.selectedSheet ? self._owner : self._cutSheet.grid;

            self._owner.selectedSheet.selectionRanges.push(self._selection);
            for (i = 0; i < cutvalues.length; i++) {
                item = cutvalues[i];
                cutSource.setCellData(item.row, item.col, item.value);
            }
            for (i = 0; i < values.length; i++) {
                item = values[i];
                self._owner.setCellData(item.row, item.col, item.value);
            }
            if (isUndo) {
                self._mergeAction.undo();
                self._celltyleAction.undo();
            } else {
                self._mergeAction.redo();
                self._celltyleAction.redo();
            }
            self._owner.refresh(false);
        });
    }
}

/*
 * Defines the _TableSettingAction class.
 *
 * It deals with the undo/redo for updating the table settings.
 */
export class _TableSettingAction extends _UndoAction {
    private _table: Table;
    private _oldTableSetting: _ITableSetting;
    private _newTableSetting: _ITableSetting;

    /*
     * Initializes a new instance of the {@link _TableSettingAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _TableSettingAction works for.
     * @param table The {@link Table} need do undo/redo action.
     */
    constructor(owner: FlexSheet, table: Table) {
        super(owner);

        this._table = table;
        this._saveValues(true);
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._saveValues(false);
        return true;
    }

    // Save undo/redo action values.
    private _saveValues(isOldvalue: boolean) {
        var tableSetting = {
            name: this._table.name,
            style: this._table.style,
            showHeaderRow: this._table.showHeaderRow,
            showTotalRow: this._table.showTotalRow,
            showbandedRows: this._table.showBandedRows,
            showBandedColumns: this._table.showBandedColumns,
            alterFirstColumn: this._table.alterFirstColumn,
            alterLastColumn: this._table.alterLastColumn
        };

        if (isOldvalue) {
            this._oldTableSetting = tableSetting;
        } else {
            this._newTableSetting = tableSetting;
        }
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        var tableSetting = isUndo ? this._oldTableSetting : this._newTableSetting;
        this._owner.beginUpdate();
        this._owner._isUndoing = true;
        this._table.name = tableSetting.name;
        this._table.style = tableSetting.style;
        this._table.showHeaderRow = tableSetting.showHeaderRow;
        this._table.showTotalRow = tableSetting.showTotalRow;
        this._table.showBandedRows = tableSetting.showbandedRows;
        this._table.showBandedColumns = tableSetting.showBandedColumns;
        this._table.alterFirstColumn = tableSetting.alterFirstColumn;
        this._table.alterLastColumn = tableSetting.alterLastColumn;
        this._owner._isUndoing = false;
        this._owner.endUpdate();
    }
}

/*
 * Defines the _TableAction class.
 *
 * It deals with the undo/redo for adding table.
 */
export class _TableAction extends _UndoAction {
    private _addedTable: Table;
    private _orgHeaderCellsContent: any[];

    /*
     * Initializes a new instance of the {@link _TableSettingAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _TableAction works for.
     * @param table The {@link Table} need do undo/redo action.
     */
    constructor(owner: FlexSheet, table: Table) {
        super(owner);

        this._addedTable = table;
        if (table.showHeaderRow) {
            this._orgHeaderCellsContent = table._orgHeaderCellsContent.slice();
        }
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        if (isUndo) {
            this._owner.selectedSheet.tables.remove(this._addedTable);
        } else {
            this._owner.selectedSheet.tables.push(this._addedTable);
        }

        if (this._addedTable.showHeaderRow) {
            let tr = this._addedTable.getRange(),
                tc = this._addedTable.getColumns();
            for (let i = 0; i < tr.columnSpan; i++) {
                this._owner.setCellData(tr.topRow, tr.leftCol + i, (isUndo ? this._orgHeaderCellsContent[i] : tc[i].name));
            }
        }

        this._owner.refresh();
    }
}

/*
 * Defines the _FilteringAction class.
 *
 * It deals with the undo/redo for filtering in FlexSheet.
 */
export class _FilteringAction extends _UndoAction {
    private _oldFilterDefinition: string;
    private _newFilterDefinition: string;
    private _oldRowsVisible: boolean[];
    private _newRowsVisible: boolean[];

    /*
     * Initializes a new instance of the {@link _FilteringAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _FilteringAction works for.
     */
    constructor(owner: FlexSheet) {
        super(owner);
        this._oldFilterDefinition = owner.filter.filterDefinition;
        this._oldRowsVisible = this._getRowsVisible();
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._newFilterDefinition = this._owner.filter.filterDefinition;
        this._newRowsVisible = this._getRowsVisible();

        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        let filterDef = isUndo ? this._oldFilterDefinition : this._newFilterDefinition;
        if (this._owner.filter.filterDefinition !== filterDef) {
            this._owner._isUndoing = true;
            this._owner.selectedSheet._filterDefinition = filterDef;
            this._owner.selectedSheet._applyFilterSetting();
            this._owner._isUndoing = false;
            this._owner.filter.apply();
        } else {
            this._setRowVisible(isUndo);
        }
    }

    // Get rows visible setting.
    private _getRowsVisible(): boolean[] {
        let rowsVisible = [],
            rowIdx = 0,
            row: wijmo.grid.Row;

        for (; rowIdx < this._owner.rows.length; rowIdx++) {
            row = this._owner.rows[rowIdx];
            if (row) {
                rowsVisible.push(row.visible);
            }
        }

        return rowsVisible;
    }

    // Set rows visible.
    private _setRowVisible(isUndo: boolean) {
        let rowsVisible = isUndo ? this._oldRowsVisible : this._newRowsVisible,
            rowIdx = 0,
            row: wijmo.grid.Row;

        for (; rowIdx < rowsVisible.length; rowIdx++) {
            row = this._owner.rows[rowIdx];
            if (row) {
                row.visible = rowsVisible[rowIdx];
            }
        }
    }
}

/*
 * Defines the _FillAction class.
 *
 * It deals with the undo/redo for drag & fill operation in FlexSheet.
 */
export class _FillAction extends _UndoAction {
    private _fillSource: wijmo.grid.CellRange;
    private _fillRange: wijmo.grid.CellRange;
    private _oldCellSettings: any[];
    private _newCellSettings: any[];

    /*
     * Initializes a new instance of the {@link _FillAction} class.
     *
     * @param owner The {@link FlexSheet} control that the _FillAction works for.
     * @param source The source range of the drag & fill operation.
     */
    constructor(owner: FlexSheet, source: wijmo.grid.CellRange) {
        super(owner);
        this._fillSource = source.clone();
        this._oldCellSettings = owner._orgCellSettings;
    }

    /*
     * Overrides the undo method of its base class {@link _UndoAction}.
     */
    undo() {
        this._handleUndoRedo(true);
    }

    /*
     * Overrides the redo method of its base class {@link _UndoAction}.
     */
    redo() {
        this._handleUndoRedo(false);
    }

    /*
     * Overrides the saveNewState method of its base class {@link _UndoAction}.
     */
    saveNewState(): boolean {
        this._fillRange = this._owner.selection.clone();
        this._newCellSettings = this._owner._getCellSettingsForFill(this._fillSource, this._fillRange);
        return true;
    }

    // Handle the undo/redon action.
    private _handleUndoRedo(isUndo: boolean) {
        let index: number,
            cellSetting: any,
            rowIndex: number,
            colIndex: number,
            cellIndex: number,
            resetMergeRange: wijmo.grid.CellRange,
            cellSettins = isUndo ? this._oldCellSettings : this._newCellSettings,
            sel = isUndo ? this._fillSource : this._fillRange;

        this._owner.beginUpdate();

        if (this._fillRange.topRow < this._fillSource.topRow) {
            resetMergeRange = new wijmo.grid.CellRange(this._fillRange.topRow, this._fillRange.col, this._fillSource.topRow - 1, this._fillRange.col2);
        } else {
            if (this._fillRange.leftCol === this._fillSource.leftCol && this._fillRange.rightCol === this._fillSource.rightCol) {
                resetMergeRange = new wijmo.grid.CellRange(this._fillSource.bottomRow + 1, this._fillRange.col, this._fillRange.bottomRow, this._fillRange.col2);
            } else {
                if (this._fillRange.leftCol < this._fillSource.leftCol) {
                    resetMergeRange = new wijmo.grid.CellRange(this._fillRange.row, this._fillRange.leftCol, this._fillRange.row2, this._fillSource.leftCol - 1);
                } else {
                    resetMergeRange = new wijmo.grid.CellRange(this._fillRange.row, this._fillSource.rightCol + 1, this._fillRange.row2, this._fillRange.rightCol);
                }
            }
        }
        this._owner._resetMergedRange(resetMergeRange);
        if (cellSettins && cellSettins.length > 0) {
            for (index = 0; index < cellSettins.length; index++) {
                cellSetting = cellSettins[index];
                rowIndex = cellSetting.row;
                colIndex = cellSetting.col;
                cellIndex = rowIndex * this._owner.columns.length + colIndex;
                this._owner.selectedSheet._styledCells[cellIndex] = cellSetting.style;
                this._owner.setCellData(rowIndex, colIndex, cellSetting.value);
                if (cellSetting.mergedCell) {
                    this._owner.mergeRange(cellSetting.mergedCell);
                }
            }
        }
        this._owner.selection = sel;
        this._owner.endUpdate();
    }
}

interface _IColumnsChangedActionValue {
    columns: wijmo.grid.Column[];
    sortList: any[];
    styledCells: _StyledCellsDict;
    mergedCells: wijmo.grid.CellRange[];
    tableRanges: any[];
    selection: wijmo.grid.CellRange;
    filterDef: string;
}

interface _IRowsChangedActionValue {
    rows: wijmo.grid.Row[];
    columns: wijmo.grid.Column[];
    itemsSource: any[];
    styledCells: _StyledCellsDict;
    mergedCells: wijmo.grid.CellRange[];
    tableSettings: any[];
    selection: wijmo.grid.CellRange;
    dataView?: any[];
    scrollPosition: wijmo.Point;
}

interface _ISortColumnActionValue {
    sortList: any[];
    columns: wijmo.grid.Column[];
    selection: wijmo.grid.CellRange;
    styledCells: _StyledCellsDict;
    rows?: wijmo.grid.Row[];
    formulas: any[];
    rowsVisible?: boolean[];
    dataView?: any[];
}

interface _IMoveCellsActionValue {
    rowIndex: number;
    columnIndex: number;
    cellContent: any;
    updatedCellContent?: any;
    cellStyle?: any;
}

interface _ITableSetting {
    name: string;
    style: TableStyle;
    showHeaderRow: boolean;
    showTotalRow: boolean;
    showBandedColumns: boolean;
    showbandedRows: boolean;
    alterFirstColumn: boolean;
    alterLastColumn: boolean;
}
    }
    


    module wijmo.grid.sheet {
    





'use strict';

/**
 * Maintains sorting of the selected {@link Sheet} of the {@link FlexSheet}. 
 */
export class SortManager {
    private _sortDescriptions: wijmo.collections.CollectionView;
    private _owner: FlexSheet;
    _committedList: ColumnSortDescription[];

    /**
     * Initializes a new instance of the {@link SortManager} class.
     *
     * @param owner The {@link FlexSheet} control that owns this <b>SortManager</b>.
     */
    constructor(owner: FlexSheet) {
        this._owner = owner;
        this._sortDescriptions = new wijmo.collections.CollectionView();
        this._committedList = [new ColumnSortDescription(-1, true)];
        this._sortDescriptions.newItemCreator = () => {
            return new ColumnSortDescription(-1, true);
        }
    }

    /**
     * Gets or sets the collection of the sort descriptions represented by the  {@link ColumnSortDescription} objects.
     */
    get sortDescriptions(): wijmo.collections.CollectionView {
        return this._sortDescriptions;
    }
    set sortDescriptions(value: wijmo.collections.CollectionView) {
        this._sortDescriptions = value;
        this.commitSort();
    }

    /**
     * Adds a blank sorting level to the sort descriptions.
     *
     * @param columnIndex The index of the column in the FlexSheet control.
     * @param ascending The sort order for the sort level.
     */
    addSortLevel(columnIndex?: number, ascending: boolean = true) {
        var item = this._sortDescriptions.addNew();
        if (columnIndex != null && !isNaN(columnIndex) && wijmo.isInt(columnIndex)) {
            item.columnIndex = columnIndex;
        }
        item.ascending = ascending;
        this._sortDescriptions.commitNew();
    }

    /**
     * Removes the current sorting level from the sort descriptions.
     *
     * @param columnIndex The index of the column in the FlexSheet control.
     */
    deleteSortLevel(columnIndex?: number) {
        var item: any;

        if (columnIndex != null) {
            item = this._getSortItem(columnIndex);
        } else {
            item = this._sortDescriptions.currentItem;
        }
        if (item) {
            this._sortDescriptions.remove(item);
        }
    }

    /**
     * Adds a copy of the current sorting level to the sort descriptions.
     */
    copySortLevel() {
        var item = this._sortDescriptions.currentItem;
        if (item) {
            var newItem = this._sortDescriptions.addNew();
            newItem.columnIndex = parseInt(item.columnIndex);
            newItem.ascending = item.ascending;
            this._sortDescriptions.commitNew();
        }
    }

    /**
     * Updates the current sort level.
     *
     * @param columnIndex The column index for the sort level.
     * @param ascending The sort order for the sort level.
     */
    editSortLevel(columnIndex?: number, ascending?: boolean) {
        if (columnIndex != null) {
            this._sortDescriptions.currentItem.columnIndex = columnIndex;
        }
        if (ascending != null) {
            this._sortDescriptions.currentItem.ascending = ascending;
        }
    }

    /**
     * Moves the current sorting level to a new position.
     *
     * @param offset The offset to move the current level by.
     */
    moveSortLevel(offset: number) {
        var item = this._sortDescriptions.currentItem;
        if (item) {
            var arr = this._sortDescriptions.sourceCollection,
                index = arr.indexOf(item),
                newIndex = index + offset;
            if (index > -1 && newIndex > -1) {
                arr.splice(index, 1);
                arr.splice(newIndex, 0, item);
                this._sortDescriptions.refresh();
                this._sortDescriptions.moveCurrentTo(item);
            }
        }
    }

    /**
     * Check whether the sort item of specific column exists or not 
     *
     * @param columnIndex The index of the column in the FlexSheet control.
     */
    checkSortItemExists(columnIndex): number {
        var i = 0,
            sortItemCnt = this._sortDescriptions.itemCount,
            sortItem: any;

        for (; i < sortItemCnt; i++) {
            sortItem = this._sortDescriptions.items[i];

            if (+sortItem.columnIndex === columnIndex) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Commits the current sort descriptions to the FlexSheet control.
     *
     * @param undoable The boolean value indicating whether the commit sort action is undoable.
     */
    commitSort(undoable = true) {
        var self = this,
            owner = self._owner,
            sd: any,
            newSortDesc: wijmo.collections.SortDescription,
            bindSortDesc: wijmo.collections.ObservableArray,
            dataBindSortDesc: wijmo.collections.ObservableArray,
            i: number,
            unSortDesc: wijmo.collections.ObservableArray,
            sortAction: _SortColumnAction,
            ecv: wijmo.collections.IEditableCollectionView,
            isCVItemsSource: boolean = self._owner.itemsSource instanceof wijmo.collections.CollectionView,
            sel: wijmo.grid.CellRange,
            sp: wijmo.Point,
            sortedSource: any[],
            itemIndex: number,
            row: wijmo.grid.Row,
            item: any,
            itemOffset: number,
            sortedCellsStyle = {};

        if (!self._owner.selectedSheet || self._owner.columns.length === 0) {
            return;
        }

        var sheetCVIsNull = self._owner.selectedSheet.grid.collectionView == null;

        owner._needCopyToSheet = false;
        unSortDesc = owner.selectedSheet._unboundSortDesc;
        if (undoable && owner.undoStack.stackSize > 0) {
            sortAction = new _SortColumnAction(owner);
        }

        if (self._sortDescriptions.itemCount > 0) {
            self._committedList = self._cloneSortList(self._sortDescriptions.items);
        } else {
            self._committedList = [new ColumnSortDescription(-1, true)];
        }

        if (owner.collectionView) {
            owner._isSorting = true;
            owner.beginUpdate();
            ecv = owner.editableCollectionView;
            if (ecv && ecv.currentEditItem && (ecv.items.indexOf(ecv.currentEditItem) !== -1 && !self._isEmpty(ecv.currentEditItem))) {
                ecv.commitEdit();
            }
            // Update sorting for the bind booksheet
            owner.collectionView.beginUpdate();
            if (!sheetCVIsNull) {
                owner.selectedSheet.grid.collectionView.beginUpdate();
            }
            bindSortDesc = owner.collectionView.sortDescriptions;
            bindSortDesc.clear();
            sel = owner.selection.clone();
            sp = owner.scrollPosition;
            itemOffset = owner._getDataRowsOffset();

            // To make the sort filter behavior be consistent with excel.
            // We need reserve the original visible setting of related items in itemsSource in case of that filter change the visible setting. (TFS 339373)
            let rowsVisible = [];
            if (!owner._isUndoing && owner.filter && owner.filter._isActive()) {
                for (i = 0; i < owner.rows.length - itemOffset; i++) {
                    row = owner.rows[i + itemOffset];
                    item = row.dataItem;
                    if (item) {
                        itemIndex = item._itemIdx != null ? item._itemIdx : i;
                        rowsVisible[itemIndex] = row.visible;
                    }
                }
            }

            if (!isCVItemsSource) {
                if (sheetCVIsNull) {
                    dataBindSortDesc = owner.collectionView.sortDescriptions;
                } else {
                    dataBindSortDesc = owner.selectedSheet.grid.collectionView.sortDescriptions;
                }
                dataBindSortDesc.clear();
            }
            owner.collectionView.sourceCollection.map((item: any, index: number) => {
                if (item._itemIdx == null) {
                    item._itemIdx = index;
                }
            });
            owner.selection = sel;
            owner.scrollPosition = sp;
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                (<wijmo.collections.CollectionView>owner.collectionView).useStableSort = true;
                if (!isCVItemsSource && !sheetCVIsNull) {
                    (<wijmo.collections.CollectionView>owner.selectedSheet.grid.collectionView).useStableSort = true;
                }
            }
            for (i = 0; i < self._sortDescriptions.itemCount; i++) {
                sd = self._sortDescriptions.items[i];
                if (sd.columnIndex > -1 && sd.columnIndex < owner.columns.length) {
                    newSortDesc = new wijmo.collections.SortDescription(owner.columns[sd.columnIndex].binding, sd.ascending);
                    bindSortDesc.push(newSortDesc);
                    // Synch the sorts for the grid of current sheet.
                    if (!isCVItemsSource) {
                        // The newSortDesc has already been added to owner.collectionView.sortDescriptions in two lines above, because bindSortDesc refers to it.
                        //owner.collectionView.sortDescriptions.push(newSortDesc);
                        dataBindSortDesc.push(newSortDesc);
                    }
                }
            }
            owner.selectedSheet.selectionRanges.clear();
            owner.collectionView.endUpdate(true);
            if (!sheetCVIsNull) {
                owner.selectedSheet.grid.collectionView.endUpdate(true);
            }
            sel = owner.selection.clone();
            sp = owner.scrollPosition;
            sortedSource = (<wijmo.collections.CollectionView>owner.collectionView)._view.slice();

            for (i = 0; i < sortedSource.length; i++) {
                item = sortedSource[i];
                if (i !== item._itemIdx) {
                    owner._updateFormulaForReorderingRows(item._itemIdx + itemOffset, i + itemOffset);
                }
                owner._updateCellStyleForReorderingRows(item._itemIdx + itemOffset, i + itemOffset, sortedCellsStyle);
            }

            // To make the sort filter behavior be consistent with excel.
            // We need reserve the original visible setting of related items in itemsSource in case of that filter change the visible setting. (TFS 339373)
            if (rowsVisible.length) {
                for (i = 0; i < owner.rows.length - itemOffset; i++) {
                    row = owner.rows[i + itemOffset];
                    item = row.dataItem;
                    if (item) {
                        itemIndex = item._itemIdx != null ? item._itemIdx : i;
                        row.visible = rowsVisible[itemIndex];
                    }
                }
            }

            sortedSource.map((item: any, index: number) => {
                item._itemIdx = index;
            });

            owner.selectedSheet._styledCells = sortedCellsStyle;
            owner.selection = sel;
            owner.scrollPosition = sp;
            owner.endUpdate();
            owner._copyColumnsToSelectedSheet();
            owner._isSorting = false;
        } else {
            // Update sorting for the unbound booksheet.
            //unSortDesc.beginUpdate(); // commented because of TFS 454619.
            unSortDesc.clear();
            for (i = 0; i < self._sortDescriptions.itemCount; i++) {
                sd = self._sortDescriptions.items[i];

                if (sd.columnIndex > -1) {
                    unSortDesc.push(new _UnboundSortDescription(owner.columns[sd.columnIndex], sd.ascending));
                }
            }
            //unSortDesc.endUpdate();

             // Don't re-apply the filter after deleting\inserting columns (277041), except for the undo operation (WJM-16639)
            if (owner.filter && (owner._isUndoing || !owner.filter._isActive())) {
                setTimeout(() => {
                    owner._checkCollectionOwner(owner.columns, false);
                    owner.filter.apply();
                }, 10);
            }
            //setTimeout(() => owner.filter.apply(), 10);
        }

        if (sortAction) {
            sortAction.saveNewState();
            owner.undoStack._addAction(sortAction);
        }

        owner._copiedRanges = null;
        owner._needCopyToSheet = true;
    }

    /**
     * Cancel the current sort descriptions to the FlexSheet control.
     */
    cancelSort() {
        this._sortDescriptions.sourceCollection = this._committedList.slice();
    }

    /**
     * Clear the sort descriptions.
     */
    clearSort() {
        this._sortDescriptions.sourceCollection = [];
        this.commitSort();
    }

    // Get the sort item via the column index
    private _getSortItem(columnIndex: number): any {
        var index = this.checkSortItemExists(columnIndex);

        if (index > -1) {
            return this._sortDescriptions.items[index];
        }

        return undefined;
    }

    // Clone the sort list.
    _cloneSortList(sortList: ColumnSortDescription[]): ColumnSortDescription[] {
        var cloneSortList = [];
        for (var i = 0; i < sortList.length; i++) {
            cloneSortList[i] = sortList[i].clone();
        }
        return cloneSortList;
    }

    // Update the related column sort desciptions with columns' change.
    _updateSortSortDescription(colIndex: number, count: number, isAdd: boolean = true) {
        let index: number,
            sd: ColumnSortDescription;

        for (index = this._sortDescriptions.items.length - 1; index >= 0; index--) {
            sd = this._sortDescriptions.items[index];
            if (isAdd) {
                if (sd.columnIndex > colIndex) {
                    sd.columnIndex += count;
                }
            } else {
                if (sd.columnIndex >= colIndex + count) {
                    sd.columnIndex -= count;
                } else if (sd.columnIndex >= colIndex) {
                    this._sortDescriptions.remove(sd);
                }
            }
        }
    }

    // Check whether is empty object.
    private _isEmpty(obj: any): boolean {
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
}

/**
 * Describes a {@link FlexSheet} column sorting criterion. 
 */
export class ColumnSortDescription {
    private _columnIndex: number;
    private _ascending: boolean;

    /**
     * Initializes a new instance of the {@link ColumnSortDescription} class.
     *
     * @param columnIndex Indicates which column to sort the rows by.
     * @param ascending The sort order.
     */
    constructor(columnIndex: number, ascending: boolean) {
        this._columnIndex = columnIndex;
        this._ascending = ascending;
    }

    /**
     * Gets or sets the column index.
     */
    get columnIndex(): number {
        return this._columnIndex;
    }
    set columnIndex(value: number) {
        this._columnIndex = +value;
    }

    /**
     * Gets or sets the ascending.
     */
    get ascending(): boolean {
        return this._ascending;
    }
    set ascending(value: boolean) {
        this._ascending = value;
    }

    /**
     * Creates a copy of the ColumnSortDescription.
     */
    clone(): ColumnSortDescription {
        return new ColumnSortDescription(this._columnIndex, this._ascending);
    }
}
    }
    


    module wijmo.grid.sheet {
    





















'use strict';

wijmo._addCultureInfo('FlexSheet', {
    insertRow: 'Insert Row',
    deleteRow: 'Delete Rows',
    insertCol: 'Insert Column',
    deleteCol: 'Delete Columns',
    convertTable: 'Convert To Table',
    insertSheet: 'Insert',
    deleteSheet: 'Delete',
    renameSheet: 'Rename',
    copyCells: 'Copy Cells',
    fillSeries: 'Fill Series',
    fillFormat: 'Fill Formatting Only',
    fillWithoutFormat: 'Fill Without Formatting'
});

var FlexSheetFunctions = [
    { name: 'abs', description: 'Returns the absolute value of a number.' },
    { name: 'acos', description: 'Returns the arccosine of a number.' },
    { name: 'address', description: 'Obtains the address of a cell in a worksheet by given specified row and column numbers.' },
    { name: 'and', description: 'Returns TRUE if all of its arguments are TRUE.' },
    { name: 'asin', description: 'Returns the arcsine of a number.' },
    { name: 'atan', description: 'Returns the arctangent of a number.' },
    { name: 'atan2', description: 'Returns the arctangent from x- and y-coordinates.' },
    { name: 'average', description: 'Returns the average of its arguments.' },
    { name: 'ceiling', description: 'Rounds a number to the nearest integer or to the nearest multiple of significance.' },
    { name: 'char', description: 'Returns the character specified by the code number.' },
    { name: 'choose', description: 'Chooses a value from a list of values.' },
    { name: 'code', description: 'Returns a numeric code for the first character in a text string.' },
    { name: 'column', description: 'Returns the column number of a reference.' },
    { name: 'columns', description: 'Returns the number of columns in a reference.' },
    { name: 'concatenate', description: 'Joins several text items into one text item.' },
    { name: 'cos', description: 'Returns the cosine of a number.' },
    { name: 'count', description: 'Counts how many numbers are in the list of arguments.' },
    { name: 'counta', description: 'Counts how many values are in the list of arguments.' },
    { name: 'countblank', description: 'Counts the number of blank cells within a range.' },
    { name: 'countif', description: 'Counts the number of cells within a range that meet the given criteria.' },
    { name: 'countifs', description: 'Counts the number of cells within a range that meet multiple criteria.' },
    { name: 'date', description: 'Returns the serial number of a particular date.' },
    { name: 'datedif', description: 'Calculates the number of days, months, or years between two dates.' },
    { name: 'day', description: 'Converts a serial number to a day of the month.' },
    { name: 'dcount', description: 'Counts the cells that contain numbers in a database.' },
    { name: 'exp', description: 'Returns e raised to the power of a given number.' },
    { name: 'exact', description: 'Compares two text strings and returns TRUE if they are exactly the same, FALSE otherwise.' },
    { name: 'false', description: 'Returns the logical value FALSE.' },
    { name: 'find', description: 'Finds one text value within another (case-sensitive).' },
    { name: 'floor', description: 'Rounds a number down, toward zero.' },
    { name: 'hlookup', description: 'Looks in the top row of an array and returns the value of the indicated cell.' },
    { name: 'hour', description: 'Converts a serial number to an hour.' },
    { name: 'if', description: 'Specifies a logical test to perform.' },
    { name: 'iferror', description: 'Returns a value you specify if a formula evaluates to an error; otherwise, it returns the result of the formula.' },
    { name: 'index', description: 'Uses an index to choose a value from a reference.' },
    { name: 'indirect', description: 'Returns the reference specified by a text string. References are immediately evaluated to display their contents.' },
    { name: 'iserr', description: 'Checks if value is an error (#VALUE!, #REF!, #DIV/0!, #NUM!, #NAME?, or #NULL!) excluding #N/A, and returns TRUE or FALSE.' },
    { name: 'iserror', description: 'Checks if value is an error (#N/A, #VALUE!, #REF!, #DIV/0!, #NUM!, #NAME?, or #NULL!), and returns TRUE or FALSE.' },
    { name: 'left', description: 'Returns the leftmost characters from a text value.' },
    { name: 'len', description: 'Returns the number of characters in a text string.' },
    { name: 'ln', description: 'Returns the natural logarithm of a number.' },
    { name: 'lower', description: 'Converts text to lowercase.' },
    { name: 'max', description: 'Returns the maximum value in a list of arguments.' },
    { name: 'mid', description: 'Returns a specific number of characters from a text string starting at the position you specify.' },
    { name: 'min', description: 'Returns the minimum value in a list of arguments.' },
    { name: 'mod', description: 'Returns the remainder from division.' },
    { name: 'month', description: 'Converts a serial number to a month.' },
    { name: 'not', description: 'Reverses the logic of its argument.' },
    { name: 'now', description: 'Returns the serial number of the current date and time.' },
    { name: 'or', description: 'Returns TRUE if any argument is TRUE.' },
    { name: 'pi', description: 'Returns the value of pi.' },
    { name: 'power', description: 'Returns the result of a number raised to a power.' },
    { name: 'product', description: 'Multiplies its arguments.' },
    { name: 'proper', description: 'Capitalizes the first letter in each word of a text value.' },
    { name: 'rand', description: 'Returns a random number between 0 and 1.' },
    { name: 'rank', description: 'Returns the rank of a number in a list of numbers.' },
    { name: 'rate', description: 'Returns the interest rate per period of an annuity.' },
    { name: 'replace', description: 'Replaces characters within text.' },
    { name: 'rept', description: 'Repeats text a given number of times.' },
    { name: 'right', description: 'Returns the rightmost characters from a text value.' },
    { name: 'round', description: 'Rounds a number to a specified number of digits.' },
    { name: 'rounddown', description: 'Rounds a number down, toward zero.' },
    { name: 'roundup', description: 'Rounds a number up, away from zero.' },
    { name: 'row', description: 'Returns the row number of a reference.' },
    { name: 'rows', description: 'Returns the number of rows in a reference.' },
    { name: 'search', description: 'Finds one text value within another (not case-sensitive).' },
    { name: 'sin', description: 'Returns the sine of the given angle.' },
    { name: 'sqrt', description: 'Returns a positive square root.' },
    { name: 'stdev', description: 'Estimates standard deviation based on a sample.' },
    { name: 'stdevp', description: 'Calculates standard deviation based on the entire population.' },
    { name: 'substitute', description: 'Substitutes new text for old text in a text string.' },
    { name: 'subtotal', description: 'Returns a subtotal in a list or database.' },
    { name: 'sum', description: 'Adds its arguments.' },
    { name: 'sumif', description: 'Adds the cells specified by a given criteria.' },
    { name: 'sumifs', description: 'Adds the cells in a range that meet multiple criteria.' },
    { name: 'sumproduct', description: 'Multiplies corresponding components in the given arrays, and returns the sum of those products.' },
    { name: 'tan', description: 'Returns the tangent of a number.' },
    { name: 'text', description: 'Formats a number and converts it to text.' },
    { name: 'time', description: 'Returns the serial number of a particular time.' },
    { name: 'today', description: 'Returns the serial number of today\'s date.' },
    { name: 'trim', description: 'Removes spaces from text.' },
    { name: 'true', description: 'Returns the logical value TRUE.' },
    { name: 'trunc', description: 'Truncates a number to an integer.' },
    { name: 'upper', description: 'Converts text to uppercase.' },
    { name: 'value', description: 'Converts a text argument to a number.' },
    { name: 'var', description: 'Estimates variance based on a sample.' },
    { name: 'varp', description: 'Calculates variance based on the entire population.' },
    { name: 'vlookup', description: 'Looks in the first column of an array and returns the value of the indicated cell.' },
    { name: 'year', description: 'Converts a serial number to a year.' }
];

/**
 * Defines the {@link FlexSheet} control.
 *
 * The {@link FlexSheet} control extends the {@link FlexGrid} control to provide Excel-like 
 * features such as a calculation engine, multiple sheets, undo/redo, and 
 * XLSX import/export.
 *
 * A complete list of the functions supported by the {@link FlexSheet}'s calculation
 * engine can be found here:
 * <a href="/wijmo/docs/Topics/Grid/FlexSheet/FlexSheet-Fomulas">FlexSheet Functions</a>.
 *
 * {@sample Grid/FlexSheet/Bound/purejs Example}
 */
export class FlexSheet extends wijmo.grid.FlexGrid {
    private _sheets: SheetCollection;
    private _selectedSheetIndex: number = -1;
    /*private*/ _tabHolder: _TabHolder;
    private _contextMenu: _SheetContextMenu;
    private _divContainer: HTMLElement;
    private _columnHeaderClicked: boolean = false;
    private _htDown: wijmo.grid.HitTestInfo;
    private _filter: FlexSheetFilter;
    private _calcEngine: _CalcEngine;
    private _functionListHost: HTMLElement;
    private _functionList: wijmo.input.ListBox;
    private _functionTarget: HTMLInputElement;
    private _undoStack: UndoStack;
    private _longClickTimer: any;
    private _cloneStyle: any;
    private _sortManager: SortManager;
    private _dragable: boolean;
    private _isDragging: boolean;
    private _draggingColumn: boolean;
    private _draggingRow: boolean;
    private _draggingMarker: HTMLDivElement;
    private _draggingTooltip: wijmo.Tooltip;
    private _draggingCells: wijmo.grid.CellRange;
    private _dropRange: wijmo.grid.CellRange;
    private _addingSheet: boolean = false;
    private _mouseMoveHdl = this._mouseMove.bind(this);
    private _clickHdl = this._click.bind(this);
    private _touchStartHdl = this._touchStart.bind(this);
    private _touchEndHdl = this._touchEnd.bind(this);
    private _keydownHdl = this._keydown.bind(this);
    private _toRefresh: any;
    /*private*/ _copiedRanges: wijmo.grid.CellRange[];
    /*private*/ _copiedSheet: Sheet;
    /*private*/ _isCutting: boolean;
    private _cutValue: string;
    private _isContextMenuKeyDown: boolean = false;
    _colorThemes: string[];
    _enableMulSel: boolean;
    _isClicking: boolean = false;
    _isCopying: boolean;
    _isUndoing: boolean;
    _reservedContent: any;
    _lastVisibleFrozenRow: number;
    _lastVisibleFrozenColumn: number;
    private _definedNames = new wijmo.collections.ObservableArray<DefinedName>();
    private _builtInTableStylesCache: any = null;
    _needCopyToSheet: boolean = true;
    _isPasting: boolean;
    private _resizing: boolean;
    _isSorting: boolean = false;
    private _fillingData: boolean = false;
    private _fillingPoint: wijmo.Point;
    private _fillingSource: wijmo.grid.CellRange;
    private _fillingRange: wijmo.grid.CellRange;
    private _fillingMarker: HTMLDivElement;
    _orgCellSettings: any[];
    private _fillingTooltip: wijmo.Tooltip;
    private _enableDragDrop = true;
    private _enableFormulas = true;
    //private _orgRowVisible: boolean;
    private _allowAutoFill: boolean;
    private _headerRowRemoved: boolean = false;
    private _lsmPos: wijmo.grid.CellRange;
    private _clearCalcCacheOnRefresh = true;
    private _copyingTo = false;
    private _ignoreBindGrid = false;
    private _loadingFromWorkbook = false;

    /**
     * Overrides the template used to instantiate {@link FlexSheet} control.
     */
    static controlTemplate =
        '<div style="width:100%;height:100%">' +
        '<div wj-part="container" style="width:100%">' +  // (start)a container contains original flexgrid to hide the horizontal scrollbar.
        wijmo.grid.FlexGrid.controlTemplate +
        '</div>' + // (end)a container contains original flexgrid to hide the horizontal scrollbar.
        '<div wj-part="tab-holder" class="wj-tabholder" style="width:100%; min-width:100px"></div>' + // sheet scrollbar splitter
        '<div wj-part="context-menu" style="display:none;z-index:100"></div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link FlexSheet} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, options);

        if (!options || (options.allowAutoFill == null)) {
            this._allowAutoFill = true;
        }

        this._needCopyToSheet = false;
        // TBD: should take it from _xlsx._defaultColorThemes?
        //this._colorThemes = wijmo.xlsx._xlsx._defaultColorThemes.slice();
        this._colorThemes = ['FFFFFF', '000000', 'EEECE1', '1F497D', '4F818D', 'C0504D', '9BBB59', '8064A2', '4BACC6', 'F79646'];
        this._eCt.style.backgroundColor = 'white';
        // We will use the native scrollbar of the flexgrid instead of the custom scrollbar of flexsheet (TFS 121971)
        //this['_root'].style.overflowX = 'hidden';
        wijmo.addClass(this.hostElement, 'wj-flexsheet');
        // Set the default font to Arial of the FlexSheet control (TFS 127769) 
        wijmo.setCss(this.hostElement, {
            fontFamily: 'Arial'
        });
        this._cf = new _FlexSheetCellFactory();
        this['_bndSortConverter'] = this._sheetSortConverter.bind(this);
        this._selHdl = new _FlexSheetSelectionHandler(this);
        this.quickAutoSize = false;

        // initialize the splitter, the sheet tab and the hscrollbar.
        this._init();

        this.showSort = false;
        this.allowSorting = wijmo.grid.AllowSorting.None;
        this.showGroups = false;
        this.showMarquee = true;
        this.showSelectedHeaders = wijmo.grid.HeadersVisibility.All;
        this.allowResizing = wijmo.grid.AllowResizing.Both;
        this.allowDragging = wijmo.grid.AllowDragging.None;
        this.keyActionTab = wijmo.grid.KeyAction.CycleOut;

        this._needCopyToSheet = true;
    }
    _getProductInfo(): string {
        return 'R20I,FlexSheet';
    }

    /**
     * Gets the collection of {@link Sheet} objects representing workbook sheets.
     */
    get sheets(): SheetCollection {
        if (!this._sheets) {
            this._sheets = new SheetCollection();
        }
        return this._sheets;
    }

    /**
     * Gets or sets the index of the current sheet in the {@link FlexSheet}. 
     */
    get selectedSheetIndex(): number {
        return this._selectedSheetIndex;
    }
    set selectedSheetIndex(value: number) {
        if (value !== this._selectedSheetIndex) {
            this._showSheet(value);
            this._sheets.selectedIndex = value;
        }
    }

    /**
     * Gets the current {@link Sheet} in the <b>FlexSheet</b>. 
     */
    get selectedSheet(): Sheet {
        return this._selectedSheetIndex >= 0 ? this._sheets[this._selectedSheetIndex] : null;
    }

    /**
     * Gets a value indicating whether the function list is opened.
     */
    get isFunctionListOpen(): boolean {
        return this._functionListHost && this._functionListHost.style.display !== 'none';
    }

    /**
     * Gets or sets a value indicating whether the TabHolder is visible.
     */
    get isTabHolderVisible(): boolean {
        return this._tabHolder.visible;
    }
    set isTabHolderVisible(value: boolean) {
        if (value !== this._tabHolder.visible) {
            this._updateDivContainerHeight(value);
            if (value) {
                this._eFocus.removeAttribute('tabindex');
            } else {
                this._eFocus.tabIndex = this._orgTabIndex;
            }
            this._tabHolder.visible = value;
            this.invalidate(); // 415155
        }
    }

    /**
     * Gets the {@link UndoStack} instance that controls undo and redo operations of the <b>FlexSheet</b>.
     */
    get undoStack(): UndoStack {
        return this._undoStack;
    }

    /**
     * Gets the {@link SortManager} instance that controls <b>FlexSheet</b> sorting.
     */
    get sortManager(): SortManager {
        return this._sortManager;
    }

    /**
     * Gets the {@link FlexSheetFilter} instance that controls <b>FlexSheet</b> filtering.
     */
    get filter(): FlexSheetFilter {
        return this._filter;
    }

    /**
     * Gets or sets the visiblity of the filter icon.
     */
    get showFilterIcons(): boolean {
        if (!!this._filter) {
            return this._filter.showFilterIcons;
        }
        return false;
    }
    set showFilterIcons(value: boolean) {
        if (!!this._filter && this._filter.showFilterIcons !== value) {
            this._filter.showFilterIcons = value;
        }
    }

    /**
         * Gets an array the {@link DefinedName} objects representing named ranges/expressions
     * defined in the <b>FlexSheet</b>.
     */
    get definedNames(): wijmo.collections.ObservableArray<DefinedName> {
        return this._definedNames;
    }

    /**
     * Gets or sets the value to indicates whether enable drag and drop rows or columns in FlexSheet.
     */
    get enableDragDrop(): boolean {
        return this._enableDragDrop;
    }
    set enableDragDrop(value: boolean) {
        this._enableDragDrop = value;
    }

    /**
     * Gets or sets the value to indicates whether enable formulas in FlexSheet.
     */
    get enableFormulas(): boolean {
        return this._enableFormulas;
    }
    set enableFormulas(value: boolean) {
        if (this._enableFormulas !== value) {
            this._enableFormulas = value;
            this.refresh();
        }
    }

    /**
     * Gets or sets the value to indicates whether enable autofill, the feature to fill cells with data that follows
     * a pattern by dragging the bottom right corner of the cell.
     */
    get allowAutoFill(): boolean {
        return this._allowAutoFill;
    }
    set allowAutoFill(value: boolean) {
        this._allowAutoFill = wijmo.asBoolean(value);
    }

    get _lastSelMovePos() {
        return this._lsmPos;
    }
    set _lastSelMovePos(value: wijmo.grid.CellRange) {
        this._lsmPos = value ? value.clone() : null;
    }

    /**
     * Occurs when current sheet index changed.
     */
    readonly selectedSheetChanged = new wijmo.Event<FlexSheet, wijmo.PropertyChangedEventArgs>();
    /**
     * Raises the currentSheetChanged event.
     *
     * @param e {@link PropertyChangedEventArgs} that contains the event data.
     */
    onSelectedSheetChanged(e: wijmo.PropertyChangedEventArgs) {
        this.selectedSheetChanged.raise(this, e);
    }

    /**
     * Occurs when dragging the rows or the columns of the <b>FlexSheet</b>.
     */
    readonly draggingRowColumn = new wijmo.Event<FlexSheet, DraggingRowColumnEventArgs>();
    /**
     * Raises the draggingRowColumn event.
     */
    onDraggingRowColumn(e: DraggingRowColumnEventArgs) {
        this.draggingRowColumn.raise(this, e);
    }

    /**
     * Occurs when dropping the rows or the columns of the <b>FlexSheet</b>.
     * This event has been deprecated. Please use beginDroppingRowColumn and endDroppingRowColumn event instead.
     */
    readonly droppingRowColumn = new wijmo.Event<FlexSheet, wijmo.EventArgs>();
    /**
     * Raises the droppingRowColumn event.
     */
    onDroppingRowColumn(e?: wijmo.EventArgs) {
        wijmo._deprecated('droppingRowColumn', 'beginDroppingRowColumn and endDroppingRowColumn');
        this.droppingRowColumn.raise(this, new wijmo.EventArgs());
    }

    /**
     * Occurs when begin dropping the rows or the columns of the <b>FlexSheet</b>.
     */
    readonly beginDroppingRowColumn = new wijmo.Event<FlexSheet, DroppingRowColumnEventArgs>();
    /**
     * Raises the beginDroppingRowColumn event.
     */
    onBeginDroppingRowColumn(e: DroppingRowColumnEventArgs) {
        this.beginDroppingRowColumn.raise(this, e);
    }

    /**
     * Occurs when end dropping the rows or the columns of the <b>FlexSheet</b>.
     */
    readonly endDroppingRowColumn = new wijmo.Event<FlexSheet, wijmo.CancelEventArgs>();
    /**
     * Raises the endDroppingRowColumn event.
     */
    onEndDroppingRowColumn(e: wijmo.CancelEventArgs) {
        this.endDroppingRowColumn.raise(this, e);
    }

    /**
     * Occurs after the {@link FlexSheet} loads the {@link Workbook} instance 
     */
    readonly loaded = new wijmo.Event<FlexSheet, wijmo.EventArgs>();
    /**
     * Raises the loaded event.
     */
    onLoaded(e?: wijmo.EventArgs) {
        if (this._toRefresh) {
            clearTimeout(this._toRefresh);
            this._toRefresh = null;
        }

        this._toRefresh = setTimeout(() => {
            this._setFlexSheetToDirty();
            this.invalidate();
        }, 10);

        this.loaded.raise(this, new wijmo.EventArgs());
    }

    /**
     * Occurs when the {@link FlexSheet} meets the unknown formula.
     */
    readonly unknownFunction = new wijmo.Event<FlexSheet, UnknownFunctionEventArgs>();
    /**
     * Raises the unknownFunction event.
     */
    onUnknownFunction(e: UnknownFunctionEventArgs) {
        this.unknownFunction.raise(this, e);
    }

    /**
     * Occurs when the {@link FlexSheet} is cleared.
     */
    readonly sheetCleared = new wijmo.Event<FlexSheet, wijmo.EventArgs>();
    /**
     * Raises the sheetCleared event.
     */
    onSheetCleared(e?: wijmo.EventArgs) {
        this.sheetCleared.raise(this, e);
    }

    /**
     * Occurs before the {@link FlexSheet} insert\delete rows.
     */
    readonly prepareChangingRow = new wijmo.Event<FlexSheet, RowColumnChangedEventArgs>();
    /**
     * Raises the prepareChangingRow event.
     */
    onPrepareChangingRow(e: RowColumnChangedEventArgs) {
        this.prepareChangingRow.raise(this, e);
    }

    /**
     * Occurs before the {@link FlexSheet} inserts or deletes columns.
     */
    readonly prepareChangingColumn = new wijmo.Event<FlexSheet, RowColumnChangedEventArgs>();
    /**
     * Raises the prepareChangingColumn event.
     */
    onPrepareChangingColumn(e: RowColumnChangedEventArgs) {
        this.prepareChangingColumn.raise(this, e);
    }

    /**
     * Occurs after the {@link FlexSheet} insert\delete rows.
     */
    readonly rowChanged = new wijmo.Event<FlexSheet, RowColumnChangedEventArgs>();
    /**
     * Raises the rowChanged event.
     */
    onRowChanged(e: RowColumnChangedEventArgs) {
        this.rowChanged.raise(this, e);
    }

    /**
     * Occurs after the {@link FlexSheet} inserted or deleted columns.
     */
    readonly columnChanged = new wijmo.Event<FlexSheet, RowColumnChangedEventArgs>();
    /**
     * Raises the columnChanged event.
     */
    onColumnChanged(e: RowColumnChangedEventArgs) {
        this.columnChanged.raise(this, e);
    }

    /**
     * Occurs before the {@link FlexSheet} performs the auto-fill operation.
     */
    readonly autoFilling = new wijmo.Event<FlexSheet, AutoFillingEventArgs>();
    /**
     * Raises the autoFilling event.
     */
    onAutoFilling(e: AutoFillingEventArgs) {
        this.autoFilling.raise(this, e);
    }

    /**
     * Occurs after the {@link FlexSheet} has performed the auto-fill operation.
     */
    readonly autoFilled = new wijmo.Event<FlexSheet, AutoFilledEventArgs>();
    /**
     * Raises the autoFilled event.
     */
    onAutoFilled(e: AutoFillingEventArgs) {
        this.autoFilled.raise(this, e);
    }

    /**
     * Overridden to refresh the sheet and the TabHolder.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {
        var rowIndex: number,
            row: wijmo.grid.Row,
            colIndex: number,
            col: wijmo.grid.Column;

        if (this.hostElement && !this.isUpdating) {
            this._updateDivContainerHeight(this.isTabHolderVisible);
        }
        if (!this.preserveSelectedState && !!this.selectedSheet) {
            this.selectedSheet.selectionRanges.clear();
            this.selectedSheet.selectionRanges.push(this.selection);
        }
        if (fullUpdate) {
            if (this._clearCalcCacheOnRefresh) {
                this._clearCalcEngine();
            }
            this._clearCalcCacheOnRefresh = true;
        }
        this._lastVisibleFrozenRow = -1;
        if (this.frozenRows > 0) {
            for (var ri = this.frozenRows - 1; ri >= 0; ri--) {
                if (this.rows[ri] && this.rows[ri].isVisible) {
                    this._lastVisibleFrozenRow = ri;
                    break;
                }
            }
        }
        this._lastVisibleFrozenColumn = -1;
        if (this.frozenColumns > 0) {
            for (var ci = this.frozenColumns - 1; ci >= 0; ci--) {
                if (this.columns[ci] && this.columns[ci].isVisible) {
                    this._lastVisibleFrozenColumn = ci;
                    break;
                }
            }
        }
        if (this.selectedSheet) {
            if (this.selectedSheet._freezeHiddenRows && this.selectedSheet._freezeHiddenRows.length > 0) {
                for (rowIndex = 0; rowIndex < this.selectedSheet._freezeHiddenRows.length; rowIndex++) {
                    row = this.rows[rowIndex];
                    if (!(row instanceof HeaderRow) && this.selectedSheet._freezeHiddenRows[rowIndex]) {
                        row.visible = false;
                    }
                }
            }
            if (this.selectedSheet._freezeHiddenCols && this.selectedSheet._freezeHiddenCols.length > 0) {
                for (colIndex = 0; colIndex < this.selectedSheet._freezeHiddenCols.length; colIndex++) {
                    if (this.selectedSheet._freezeHiddenCols[colIndex]) {
                        this.columns[colIndex].visible = false;
                    }
                }
            }
        }

        super.refresh(fullUpdate);

        if (this.hostElement && !this.isUpdating) {
            this._tabHolder.adjustSize();
            this._tabHolder.isDisabled = this.isDisabled;
            this._tabHolder.sheetControl.isDisabled = this.isDisabled;
        }
    }

    /**
     * Overrides the setCellData function of the base class.
     *
     * @param r Index of the row that contains the cell.
     * @param c Index, name, or binding of the column that contains the cell.
     * @param value Value to store in the cell.
     * @param coerce Whether to change the value automatically to match the column's data type.
     * @param invalidate Whether to invalidate the FlexSheet to show the change.
     * @return True if the value was stored successfully, false otherwise.
     */
    setCellData(r: number, c: any, value: any, coerce = false, invalidate = true): boolean {
        var isFormula = _isFormula(value);

        this._clearCalcEngine();

        return this.cells.setCellData(r, c, value, coerce && !isFormula, invalidate) || this._getHasValidation();
    }

    /**
     * Overrides the base class method to take into account the function list.
     */
    containsFocus(): boolean {
        return this.isFunctionListOpen || super.containsFocus();
    }

    /**
     * Add an unbound {@link Sheet} to the <b>FlexSheet</b>.
     * 
     * @param sheetName The name of the Sheet.
     * @param rows The row count of the Sheet.
     * @param cols The column count of the Sheet.
     * @param pos The position in the <b>sheets</b> collection.
     * @param grid The {@link FlexGrid} instance associated with the {@link Sheet}. If not specified then new {@link FlexGrid} instance 
     * will be created.
     */
    addUnboundSheet(sheetName?: string, rows?: number, cols?: number, pos?: number, grid?: wijmo.grid.FlexGrid): Sheet {
        var sheet = this._addSheet(sheetName, rows, cols, pos, grid);

        if (sheet.selectionRanges.length === 0) {
            // Store current selection in the selection array for multiple selection.
            sheet.selectionRanges.push(this.selection);
        }

        return sheet;
    }

    /**
     * Add a bound {@link Sheet} to the <b>FlexSheet</b>.
     *
     * @param sheetName The name of the {@link Sheet}.
     * @param source The items source for the {@link Sheet}.
     * @param pos The position in the <b>sheets</b> collection.
     * @param grid The {@link FlexGrid} instance associated with the {@link Sheet}. If not specified then new {@link FlexGrid} instance 
     * will be created.
     */
    addBoundSheet(sheetName: string, source: any, pos?: number, grid?: wijmo.grid.FlexGrid): Sheet {
        var sheet = this._addSheet(sheetName, 0, 0, pos, grid);

        if (source) {
            sheet.itemsSource = source;
            if (this.childItemsPath) {
                sheet.grid.childItemsPath = this.childItemsPath;
            }
        }

        if (sheet.selectionRanges.length === 0) {
            // Store current selection in the selection array for multiple selection.
            sheet.selectionRanges.push(this.selection);
        }

        return sheet;
    }

    /**
     * Apply the style to a range of cells. 
     *
     * @param cellStyle The {@link ICellStyle} object to apply. 
     * @param cells An array of {@link CellRange} objects to apply the style to. If not specified then
     * style is applied to the currently selected cells.
     * @param isPreview Indicates whether the applied style is just for preview.
     */
    applyCellsStyle(cellStyle: ICellStyle, cells?: wijmo.grid.CellRange[], isPreview: boolean = false) {
        var rowIndex: number,
            colIndex: number,
            forceApply = cells != null && cells.length > 0,
            ranges = cells || [this.selection],
            range: wijmo.grid.CellRange,
            index: number,
            cellStyleAction: _CellStyleAction;

        if (!this.selectedSheet) {
            return;
        }

        // Cancel current applied style.
        if (!cellStyle && this._cloneStyle) {
            this.selectedSheet._styledCells = this._cloneObject(this._cloneStyle);
            this._cloneStyle = null;
            this.refresh(false);
            return;
        }

        // Apply cells style for the cell range of the FlexSheet control.
        if (ranges) {
            if (!cells && !isPreview) {
                if (this.undoStack.stackSize > 0) {
                    cellStyleAction = new _CellStyleAction(this, this._cloneStyle);
                }
                this._cloneStyle = null;
            } else if (isPreview && !this._cloneStyle) {
                this._cloneStyle = this._cloneObject(this.selectedSheet._styledCells);
            }

            for (index = 0; index < ranges.length; index++) {
                range = ranges[index];
                for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                    for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                        this._applyStyleForCell(rowIndex, colIndex, cellStyle, forceApply);
                    }
                }
            }

            if (cellStyleAction) {
                cellStyleAction.saveNewState();
                this._undoStack._addAction(cellStyleAction);
            }
        }

        if (!cells) {
            this.refresh(false);
        }
    }

    /**
     * Freeze or unfreeze the columns and rows of the <b>FlexSheet</b> control.
     */
    freezeAtCursor() {
        var rowIndex: number,
            colIndex: number,
            frozenColumns: number,
            frozenRows: number,
            row: wijmo.grid.Row,
            column: wijmo.grid.Column;

        if (!this.selectedSheet) {
            return;
        }

        this.selectedSheet._freezeHiddenRows = null;
        this.selectedSheet._freezeHiddenCols = null;
        if (this.selection && this.frozenRows === 0 && this.frozenColumns === 0) {
            // hide rows\cols scrolled above and scrolled left of the view range
            // so the user can freeze arbitrary parts of the grid 
            // (not necessarily starting with the first row/column)
            if (this._ptScrl.y < 0) {
                this.selectedSheet._freezeHiddenRows = [];
                for (rowIndex = 0; rowIndex < this.selection.topRow - 1; rowIndex++) {
                    row = this.rows[rowIndex];
                    if (!(row instanceof HeaderRow)) {
                        if (row._pos + this._ptScrl.y < 0 && row.visible) {
                            row.visible = false;
                            this.selectedSheet._freezeHiddenRows[rowIndex] = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (this._ptScrl.x < 0) {
                this.selectedSheet._freezeHiddenCols = [];
                for (colIndex = 0; colIndex < this.selection.leftCol - 1; colIndex++) {
                    column = this.columns[colIndex];
                    if (column._pos + this._ptScrl.x < 0 && column.visible) {
                        column.visible = false;
                        this.selectedSheet._freezeHiddenCols[colIndex] = true;
                    } else {
                        break;
                    }
                }
            }

            // freeze
            frozenColumns = this.selection.leftCol > 0 ? this.selection.leftCol : 0;
            frozenRows = this.selection.topRow > 0 ? this.selection.topRow : 0;
        } else {
            // unhide
            for (rowIndex = 0; rowIndex < this.frozenRows - 1; rowIndex++) {
                (<wijmo.grid.Row>this.rows[rowIndex]).visible = true;
            }
            for (colIndex = 0; colIndex < this.frozenColumns - 1; colIndex++) {
                (<wijmo.grid.Column>this.columns[colIndex]).visible = true;
            }

            // Apply the filter of the FlexSheet again after resetting the visible of the rows. (TFS 204887)
            this._filter.apply();

            // unfreeze
            frozenColumns = 0;
            frozenRows = 0;
        }

        // Synch to the grid of current sheet.
        this.frozenRows = this.selectedSheet.grid.frozenRows = frozenRows;
        this.frozenColumns = this.selectedSheet.grid.frozenColumns = frozenColumns;

        setTimeout(() => {
            this._setFlexSheetToDirty();
            this.invalidate();
            this.scrollIntoView(this.selection.topRow, this.selection.leftCol);
        }, 10);
    }

    /**
     * Show the filter editor.
     */
    showColumnFilter() {
        var selectedCol = this.selection.col > 0 ? this.selection.col : 0;

        if (this.columns.length > 0) {
            this._filter.editColumnFilter(this.columns[selectedCol]);
        }
    }

    /**
     * Clears the content of the <b>FlexSheet</b> control.
     */
    clear() {
        this.beginUpdate();
        this.selection = new wijmo.grid.CellRange();
        this.sheets.clear();
        this._selectedSheetIndex = -1;
        this.columns.clear();
        this.rows.clear();
        this.columnHeaders.columns.clear();
        this.rowHeaders.rows.clear();
        this._undoStack.clear();
        this._ptScrl = new wijmo.Point();
        this._clearCalcEngine();
        this._definedNames.clear();
        this._builtInTableStylesCache = null;
        this._copiedRanges = null;
        this._copiedSheet = null;
        this._isCutting = false;
        this._cutValue = null;
        this._reservedContent = null;
        this._lastVisibleFrozenRow = -1;
        this._lastVisibleFrozenColumn = -1;

        this.addUnboundSheet();
        this.endUpdate();
    }

    /**
     * Gets the {@link IFormatState} object describing formatting of the selected cells.
     *
     * @return The {@link IFormatState} object containing formatting properties.
     */
    getSelectionFormatState(): IFormatState {
        var rowIndex: number,
            colIndex: number,
            rowCount = this.rows.length,
            columnCount = this.columns.length,
            formatState = {
                isBold: false,
                isItalic: false,
                isUnderline: false,
                textAlign: 'left',
                isMergedCell: false
            };

        // If there is no rows or columns in the flexsheet, we should return the default format state (TFS 122628)
        if (rowCount === 0 || columnCount === 0) {
            return formatState;
        }

        // Check the selected cells
        if (this.selection) {
            if (this.selection.row >= rowCount || this.selection.row2 >= rowCount
                || this.selection.col >= columnCount || this.selection.col2 >= columnCount) {
                return formatState;
            }
            for (rowIndex = this.selection.topRow; rowIndex <= this.selection.bottomRow; rowIndex++) {
                for (colIndex = this.selection.leftCol; colIndex <= this.selection.rightCol; colIndex++) {
                    this._checkCellFormat(rowIndex, colIndex, formatState);
                }
            }
        }

        return formatState;
    }

    /**
     * Inserts rows in the current {@link Sheet} of the <b>FlexSheet</b> control.
     *
     * @param index The position where new rows should be added. If not specified then rows will be added
     * before the first row of the current selection.
     * @param count The numbers of rows to add. If not specified then one row will be added.
     */
    insertRows(index?: number, count?: number) {
        var rowIndex = wijmo.isNumber(index) && index >= 0
            ? index
            : (this.selection && this.selection.topRow > -1) ? this.selection.topRow : 0,
            rowCount = wijmo.isNumber(count) ? count : 1,
            insRowAction: _RowsChangedAction,
            currentRow = this.rows[rowIndex],
            //isBoundSheet = false,
            needUpdateFormula = true,
            affectedFormulas: any,
            affectedDefinedNameVals: any,
            dataSourceIsCV: boolean,
            //newItem: any,
            originAutoGenerateColumns: boolean,
            gridOriginAutoGenerateColumns: boolean,
            newItemIndex: number;

        if (!this.selectedSheet) {
            return;
        }

        if (this.rows.length > 0) {
            if (rowIndex >= this.rows.length) {
                rowIndex = this.rows.length - 1;
            }
        } else {
            rowIndex = 0;
        }

        this._clearCalcEngine();
        this.finishEditing();
        // The header row of the bound sheet should always in the top of the flexsheet.
        // The new should be added below the header row. (TFS #124391.)
        if (rowIndex === 0 && currentRow && currentRow.constructor === HeaderRow) {
            rowIndex = 1;
        }

        this.onPrepareChangingRow(new RowColumnChangedEventArgs(rowIndex, rowCount, true, false));
        if (this.undoStack.stackSize > 0) {
            insRowAction = new _RowsChangedAction(this, rowIndex, rowCount, true);
        }
        // We should update styled cells hash before adding rows.
        this._updateCellsForUpdatingRow(this.rows.length, rowIndex, rowCount);

        needUpdateFormula = !this.collectionView || this.collectionView.sortDescriptions.length === 0;
        if (needUpdateFormula) {
            affectedFormulas = this._updateAffectedFormula(rowIndex, rowCount, true, true);
            affectedDefinedNameVals = this._updateAffectedNamedRanges(rowIndex, rowCount, true, true)
        }

        if (insRowAction) {
            // Update the affected formulas.
            insRowAction._affectedFormulas = affectedFormulas;
            insRowAction._affectedDefinedNameVals = affectedDefinedNameVals;
        }

        let sheetCVIsNull = this.selectedSheet.grid.collectionView == null,
            cv = this.collectionView,
            cvc = cv instanceof wijmo.collections.CollectionView ? cv : null;

        if (cv) { // bound sheet
            this.selectedSheet._dataView = (<wijmo.collections.CollectionView>this.collectionView)._view.slice();
            dataSourceIsCV = this.itemsSource instanceof wijmo.collections.CollectionView;
            originAutoGenerateColumns = this.autoGenerateColumns;
            this.autoGenerateColumns = false;
            this.collectionView.beginUpdate();
            if (!dataSourceIsCV) {
                gridOriginAutoGenerateColumns = this.selectedSheet.grid.autoGenerateColumns;
                this.selectedSheet.grid.autoGenerateColumns = false;
                if (!sheetCVIsNull) {
                    this.selectedSheet.grid.collectionView.beginUpdate();
                }
            }

            for (let i = 0; i < rowCount; i++) {
                let newItem = cvc && cvc.newItemCreator ? cvc.newItemCreator() : {};

                newItemIndex = Math.max(rowIndex - this._getDataRowsOffset(), 0);

                cv.sourceCollection.splice(newItemIndex, 0, newItem);

                if (cvc && cvc.trackChanges) {
                    cvc.itemsAdded.push(newItem);
                }

                if (!dataSourceIsCV) {
                    let sheetSource = this.selectedSheet.grid.itemsSource;
                    if (sheetSource && (this.itemsSource !== sheetSource)) {
                        sheetSource.splice(newItemIndex, 0, newItem);
                    }
                }

                //if (dataSourceIsCV) {
                //    let cv = self.itemsSource as CollectionView;

                //    if (cv.newItemCreator) {
                //        newItem = cv.newItemCreator();
                //    } else {
                //        newItem = {};
                //    }
                //    cv.sourceCollection.splice(newItemIndex, 0, newItem);

                //    if (cv.trackChanges) {
                //        cv.itemsAdded.push(newItem);
                //    }
                //} else {
                //    newItem = {};
                //    self.itemsSource.splice(newItemIndex, 0, newItem);
                //    if (self.itemsSource !== self.selectedSheet.grid.itemsSource && self.selectedSheet.grid.itemsSource) {
                //        self.selectedSheet.grid.itemsSource.splice(newItemIndex, 0, newItem);
                //    }
                //}

                this.selectedSheet._dataView.splice(newItemIndex, 0, newItem);
            }
            this._updateItemIndexForInsertingRow(this.collectionView.sourceCollection, newItemIndex, rowCount);
            if (!dataSourceIsCV) {
                if (!sheetCVIsNull) {
                    this.selectedSheet.grid.collectionView.endUpdate(true);
                }
                this.selectedSheet.grid.autoGenerateColumns = gridOriginAutoGenerateColumns;
            }
            this.collectionView.endUpdate(true);
            if (this.collectionView.sortDescriptions.length > 0) {
                (<wijmo.collections.CollectionView>this.collectionView)._view = this.selectedSheet._dataView;
                (<wijmo.collections.CollectionView>this.collectionView)._pgView = (<wijmo.collections.CollectionView>this.collectionView)._getPageView();
                if (!dataSourceIsCV && !sheetCVIsNull) {
                    (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._view = this.selectedSheet._dataView;
                    (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._getPageView();
                }
                this._bindGrid(false);
                this.selectedSheet.grid['_bindGrid'](false);
            }

            setTimeout(() => {
                this._filter.apply();
            });
            this.autoGenerateColumns = originAutoGenerateColumns;
        } else { // unbound sheet
            this.rows.beginUpdate();
            for (let i = 0; i < rowCount; i++) {
                this.rows.insert(rowIndex, new wijmo.grid.Row());
            }
            this.rows.endUpdate();
        }

        this._updateTablesForUpdatingRow(rowIndex, rowCount);

        if (!this.selection || this.selection.row === -1 || this.selection.col === -1) {
            this.selection = new wijmo.grid.CellRange(0, 0);
        }

        if (insRowAction) {
            insRowAction.saveNewState();
            this._undoStack._addAction(insRowAction);
        }

        this.onRowChanged(new RowColumnChangedEventArgs(rowIndex, rowCount, true, false));

        if (cv) {
            this.refresh();
        }
    }

    /**
     * Deletes rows from the current @see:Sheet of the <b>FlexSheet</b> control.
     *
     * @param index The starting index of the deleting rows. If not specified then rows will be deleted
     * starting from the first row of the current selection.
     * @param count The numbers of rows to delete. If not specified then one row will be deleted.
     */
    deleteRows(index?: number, count?: number): void;
    /**
     * Deletes rows from the current {@link Sheet} of the <b>FlexSheet</b> control.
     * @param ranges An array of {@link CellRange} instances that determines the deleting rows.
     */
    deleteRows(ranges: wijmo.grid.CellRange[]): void;
    deleteRows(indexOrRanges?: number | wijmo.grid.CellRange[], count?: number): void {
        if (!this.selectedSheet || this.rows.length < 1 /*|| this.itemsSource*/) {
            return;
        }

        let ranges = <wijmo.grid.CellRange[]>indexOrRanges;
        let isRanges = wijmo.isArray(indexOrRanges);

        // Convert the index and count arguments to a CellRange[], if any
        if (!isRanges) {
            if (wijmo.isNumber(indexOrRanges)) {
                count = wijmo.isNumber(count) ? count : 1;

                if (count < 1) {
                    return;
                }

                ranges = [new wijmo.grid.CellRange(<number>indexOrRanges, -1, <number>indexOrRanges + count - 1, -1)];
            }
            else {
                ranges = this._selections();
                isRanges = ranges.length > 1; // use new RowColumnChangedEventArgs's arguments behaviour in case of multiple ranges.
            }
        }

        ranges = _RangesHelper.validateRowRanges(ranges, this.rows.length);

        if (!ranges.length) {
            return;
        }

        let rowsToDelete = 0;
        ranges.forEach(r => {
            r.col = r.col2 = -1;
            rowsToDelete += r.rowSpan;
        });

        this._clearCalcEngine();
        this.finishEditing();

        let orgSelTopRow = this.selection.topRow;
        let orgAutoGenerateColumns: boolean;
        let gridOrgAutoGenerateColumns: boolean;

        let rccea = isRanges ? new RowColumnChangedEventArgs(ranges, false, false) : new RowColumnChangedEventArgs(ranges[0].topRow, ranges[0].rowSpan, false, false);
        this.onPrepareChangingRow(rccea);

        let delRowAction: _RowsChangedAction;
        if (this.undoStack.stackSize > 0) {
            delRowAction = new _RowsChangedAction(this, null, null, false);
        }

        let deleteAll = rowsToDelete === this.rows.length;
        let isBoundSheet = !!this.collectionView;
        let dataSourceIsCV = isBoundSheet && this.itemsSource instanceof wijmo.collections.CollectionView;
        let sheetCVIsNull = this.selectedSheet.grid.collectionView == null;

        this.rows.beginUpdate();

        if (isBoundSheet) {
            this.selectedSheet._dataView = (<wijmo.collections.CollectionView>this.collectionView)._view.slice();
            orgAutoGenerateColumns = this.autoGenerateColumns;
            this.autoGenerateColumns = false;
            this.collectionView.beginUpdate();
            if (!dataSourceIsCV) {
                gridOrgAutoGenerateColumns = this.selectedSheet.grid.autoGenerateColumns;
                this.selectedSheet.grid.autoGenerateColumns = false;
                if (!sheetCVIsNull) {
                    this.selectedSheet.grid.collectionView.beginUpdate();
                }
            }
        }

        for (let i = ranges.length - 1; i >= 0; i--) {
            let rng = ranges[i],
                subAction: _RowsChangedAction;

            if (delRowAction) {
                subAction = new _RowsChangedAction(this, rng.topRow, rng.rowSpan, false);
                subAction._affectedFormulas = this._updateAffectedFormula(rng.bottomRow, rng.rowSpan, false, true);
                subAction._affectedDefinedNameVals = this._updateAffectedNamedRanges(rng.bottomRow, rng.rowSpan, false, true);
                subAction._deletedTables = this._updateTablesForUpdatingRow(rng.topRow, rng.rowSpan, true);
                delRowAction.addDeleteSubAction(subAction);
            }

            // We should update styled cells hash before deleting rows.
            this._updateCellsForUpdatingRow(this.rows.length, rng.topRow, rng.rowSpan, true);

            for (let j = rng.bottomRow; j >= rng.topRow; j--) {
                let deletingRow = this.rows[j];

                if (deletingRow && ((deletingRow.constructor === HeaderRow && !deleteAll) || !deletingRow.isVisible)) {
                    continue;
                }
                // if we remove the rows in the bound sheet,
                // we need remove the row related item in the itemsSource of the flexsheet. (TFS 121651)
                if (deletingRow.dataItem && this.editableCollectionView) {
                    let deletingItemIndex: number;

                    this.editableCollectionView.remove(deletingRow.dataItem);

                    this.selectedSheet._dataView.splice(this.selectedSheet._dataView.indexOf(deletingRow.dataItem), 1);
                    if (!dataSourceIsCV) {
                        deletingItemIndex = this.itemsSource.indexOf(deletingRow.dataItem)
                    }
                    this._updateItemIndexForRemovingRow(this.collectionView.sourceCollection, deletingItemIndex);

                    //let deletingRowIndex = this._getCvIndex(j);
                    //if (deletingRowIndex > -1) {
                    //    let deletingItem = this.collectionView.items[deletingRowIndex];
                    //    let deletingItemIndex: number;

                    //    if (dataSourceIsCV) {
                    //        (this.itemsSource as CollectionView).remove(deletingItem);
                    //    } else {
                    //        deletingItemIndex = this.itemsSource.indexOf(deletingItem);
                    //        this.itemsSource.splice(deletingItemIndex, 1);
                    //        if (this.itemsSource !== this.selectedSheet.grid.itemsSource && this.selectedSheet.grid.itemsSource) {
                    //            this.selectedSheet.grid.itemsSource.splice(deletingItemIndex, 1);
                    //        }
                    //    }
                    //    this.selectedSheet._dataView.splice(this.selectedSheet._dataView.indexOf(deletingItem), 1);
                    //    this._updateItemIndexForRemovingRow(this.collectionView.sourceCollection, deletingItemIndex);
                    //}
                } else {
                    this.rows.removeAt(j);
                }
            }

            if (subAction) {
                subAction.saveNewState();
            }
        }

        if (isBoundSheet) {
            if (!dataSourceIsCV) {
                if (!sheetCVIsNull) {
                    this.selectedSheet.grid.collectionView.endUpdate(true);
                }
                this.selectedSheet.grid.autoGenerateColumns = gridOrgAutoGenerateColumns;
            }
            this.collectionView.endUpdate(true);
            if (this.collectionView.sortDescriptions.length > 0) {
                (<wijmo.collections.CollectionView>this.collectionView)._view = this.selectedSheet._dataView;
                (<wijmo.collections.CollectionView>this.collectionView)._pgView = (<wijmo.collections.CollectionView>this.collectionView)._getPageView();
                if (!dataSourceIsCV && !sheetCVIsNull) {
                    (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._view = this.selectedSheet._dataView;
                    (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._getPageView();
                }
                this._bindGrid(false);
                this.selectedSheet.grid['_bindGrid'](false);
            }
            this.autoGenerateColumns = orgAutoGenerateColumns;
        }

        this.rows.endUpdate();

        // Change current selection
        this.selectedSheet.selectionRanges.clear();

        let rl = this.rows.length;
        if (rl === 0) {
            this.select(new wijmo.grid.CellRange());
            if (this.hostElement.style.cursor === 'move') {
                this.hostElement.style.cursor = 'default';
            }
        } else if (this.selection.topRow >= rl) {
            this.select(new wijmo.grid.CellRange(rl - 1, 0, rl - 1, this.columns.length - 1));
        } else {
            let row = orgSelTopRow - rowsToDelete + 1;

            row = Math.max(row, ranges[0].topRow); // limit from the top
            row = Math.min(row, this.selection.topRow); // limit from the bottom (403947)

            this.select(new wijmo.grid.CellRange(row, this.selection.col, row, this.selection.col2));
        }

        // Add undo action
        if (delRowAction) {
            this._undoStack._addAction(delRowAction);
        }

        // Done
        this.onRowChanged(rccea);

        if (isBoundSheet) {
            this.refresh();
        }
    }


    /**
     * Inserts columns in the current {@link Sheet} of the <b>FlexSheet</b> control.
     *
     * @param index The position where new columns should be added. If not specified then columns will be added
     * before the left column of the current selection.
     * @param count The numbers of columns to add. If not specified then one column will be added.
     */
    insertColumns(index?: number, count?: number) {
        var columnIndex = wijmo.isNumber(index) && index >= 0 ? index :
            this.selection && this.selection.leftCol > -1 ? this.selection.leftCol : 0,
            colCount = wijmo.isNumber(count) ? count : 1,
            insColumnAction: _ColumnsChangedAction,
            affectedFormulas: any,
            affectedDefinedNameVals: any;

        if (!this.selectedSheet) {
            return;
        }

        if (this.columns.length > 0) {
            if (columnIndex >= this.columns.length) {
                columnIndex = this.columns.length - 1;
            }
        } else {
            columnIndex = 0;
        }

        this._clearCalcEngine();
        this.finishEditing();

        this.onPrepareChangingColumn(new RowColumnChangedEventArgs(columnIndex, colCount, true, true));
        if (this.undoStack.stackSize > 0) {
            insColumnAction = new _ColumnsChangedAction(this, columnIndex, colCount, true);
        }
        // We should update styled cells hash before adding columns.
        this._updateCellsForUpdatingColumn(this.columns.length, columnIndex, colCount);

        affectedFormulas = this._updateAffectedFormula(columnIndex, colCount, true, false);
        affectedDefinedNameVals = this._updateAffectedNamedRanges(columnIndex, colCount, true, false);

        if (insColumnAction) {
            // Update the affected formulas.
            insColumnAction._affectedFormulas = affectedFormulas;
            insColumnAction._affectedDefinedNameVals = affectedDefinedNameVals;
        }

        this.columns.beginUpdate();
        for (let i = 0; i < colCount; i++) {
            let column = new wijmo.grid.Column();
            column.isRequired = false;
            if (this.itemsSource) {
                column.binding = this._getUniqueColumnName();
                let headerRow = this.rows[this._getDataRowsOffset() - 1];
                if (headerRow) {
                    if (!headerRow._ubv) {
                        headerRow._ubv = {};
                    }
                    headerRow._ubv[column._hash] = FlexSheet._getHeaderRowText(column);
                }
            }
            this.columns.insert(columnIndex, column);
        }
        this.columns.endUpdate();

        this.selectedSheet._filterDefinition = this._filter.filterDefinition;
        this.selectedSheet.grid.columns._dirty = false; // #393387
        this._sortManager._updateSortSortDescription(columnIndex, colCount);
        this._sortManager.commitSort(false);

        this._updateTablesForUpdatingColumn(columnIndex, colCount);

        if (!this.selection || this.selection.row === -1 || this.selection.col === -1) {
            this.selection = new wijmo.grid.CellRange(0, 0);
        }

        if (insColumnAction) {
            insColumnAction.saveNewState();
            this._undoStack._addAction(insColumnAction);
        }
        this.onColumnChanged(new RowColumnChangedEventArgs(columnIndex, colCount, true, true));
    }

    /**
     * Deletes columns from the current @see:Sheet of the <b>FlexSheet</b> control.
     * 
     * @param index The starting index of the deleting columns. If not specified then columns will be deleted
     * starting from the first column of the current selection.
     * @param count The numbers of columns to delete. If not specified then one column will be deleted.
     */
    deleteColumns(index?: number, count?: number): void;
    /**
     * Deletes columns from the current {@link Sheet} of the <b>FlexSheet</b> control.
     * @param ranges An array of {@link CellRange} instances that determines the deleting columns.
     */
    deleteColumns(ranges: wijmo.grid.CellRange[]): void;
    deleteColumns(indexOrRanges?: number | wijmo.grid.CellRange[], count?: number): void {
        if (!this.selectedSheet) {
            return;
        }

        let ranges = <wijmo.grid.CellRange[]>indexOrRanges;
        let isRanges = wijmo.isArray(indexOrRanges);

        // Convert the index and count arguments to [CellRange], if any
        if (!isRanges) {
            if (wijmo.isNumber(indexOrRanges)) {
                count = wijmo.isNumber(count) ? count : 1;

                if (count < 1) {
                    return;
                }

                ranges = [new wijmo.grid.CellRange(-1, <number>indexOrRanges, -1, <number>indexOrRanges + count - 1)];
            }
            else {
                ranges = this._selections();
                isRanges = ranges.length > 1; // use new RowColumnChangedEventArgs's arguments behaviour in case of multiple ranges.
            }
        }

        ranges = _RangesHelper.validateColumnRanges(ranges, this.columns.length);

        if (!ranges.length) {
            return;
        }

        let orgSelLeftCol = this.selection.leftCol;
        let columnsToDelete = 0;

        ranges.forEach(cr => {
            columnsToDelete += cr.columnSpan;
            cr.row = cr.row2 = -1
        })

        this._clearCalcEngine();
        this.finishEditing();

        let rccea = isRanges ? new RowColumnChangedEventArgs(ranges, false, true) : new RowColumnChangedEventArgs(ranges[0].leftCol, ranges[0].columnSpan, false, true);
        this.onPrepareChangingColumn(rccea);

        let delColumnAction: _ColumnsChangedAction;
        if (this.undoStack.stackSize > 0) {
            delColumnAction = new _ColumnsChangedAction(this, null, null, false);
        }

        this.columns.beginUpdate();

        for (let i = ranges.length - 1; i >= 0; i--) {
            let rng = ranges[i],
                subAction: _ColumnsChangedAction;

            if (delColumnAction) {
                subAction = new _ColumnsChangedAction(this, rng.leftCol, rng.columnSpan, false);
                subAction._affectedFormulas = this._updateAffectedFormula(rng.rightCol, rng.columnSpan, false, false);;
                subAction._affectedDefinedNameVals = this._updateAffectedNamedRanges(rng.rightCol, rng.columnSpan, false, false);
                subAction._deletedTables = this._updateTablesForUpdatingColumn(rng.leftCol, rng.columnSpan, true);
                delColumnAction._delSubActions.push(subAction);
            }

            // We should update styled cells hash before deleting columns.
            this._updateCellsForUpdatingColumn(this.columns.length, rng.leftCol, rng.columnSpan, true);

            for (let j = rng.rightCol; j >= rng.leftCol; j--) {
                if (!this.columns[j].isVisible) {
                    continue;
                }
                this.columns.removeAt(j);
                this._sortManager.deleteSortLevel(j);
            }

            this._sortManager._updateSortSortDescription(rng.leftCol, rng.columnSpan, false);
        }

        this.columns.endUpdate();

        this.selectedSheet._filterDefinition = this._filter.filterDefinition;
        this.selectedSheet.grid.columns._dirty = false; // #393387
        this._sortManager.commitSort(false);

        this.selectedSheet.selectionRanges.clear();

        let cl = this.columns.length;
        if (cl === 0) {
            this.select(new wijmo.grid.CellRange());
            if (this.hostElement.style.cursor === 'move') {
                this.hostElement.style.cursor = 'default';
            }
        } else if (this.selection.leftCol >= cl) {
            this.select(new wijmo.grid.CellRange(0, cl - 1, this.rows.length - 1, cl - 1));
        } else {
            let col = orgSelLeftCol - columnsToDelete + 1;

            col = Math.max(col, ranges[0].leftCol); // limit from the left
            col = Math.min(col, this.selection.leftCol); // limit from the right

            this.select(new wijmo.grid.CellRange(this.selection.row, col, this.selection.row2, col));
        }

        if (delColumnAction) {
            this._undoStack._addAction(delColumnAction);
            delColumnAction._delSubActions.forEach(v => v.saveNewState());
        }

        this.onColumnChanged(rccea);
    }

    /**
     * Merges the selected {@link CellRange} into one cell.
     *
     * @param cells The {@link CellRange} to merge.
     * @param isCopyMergeCell This parameter indicates that merge operation is done by copy\paste merge cell or not.
     */
    mergeRange(cells?: wijmo.grid.CellRange, isCopyMergeCell: boolean = false) {
        var rowIndex: number,
            colIndex: number,
            cellIndex: number,
            row: wijmo.grid.Row,
            column: wijmo.grid.Column,
            mergedRange: wijmo.grid.CellRange,
            range = cells || this.selection,
            cellMergeAction: _CellMergeAction,
            firstVisibleRow = -1,
            firstVisibleCol = -1;

        if (!this.selectedSheet) {
            return;
        }

        if (range) {
            if (range.rowSpan === 1 && range.columnSpan === 1) {
                return;
            }
            // If the merge cell range intersects with table, it isn't allowed to merge.
            for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                    if (this.selectedSheet.findTable(rowIndex, colIndex)) {
                        return;
                    }
                }
            }
            if (!cells && !isCopyMergeCell) {
                if (this.undoStack.stackSize > 0) {
                    cellMergeAction = new _CellMergeAction(this);
                }
                this.hostElement.focus();
            }

            if (!this._resetMergedRange(range)) {
                for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                    row = this.rows[rowIndex];
                    if (row && row.isVisible) {
                        firstVisibleRow = rowIndex;
                        break;
                    }
                }

                for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                    column = this.columns[colIndex];
                    if (column && column.isVisible) {
                        firstVisibleCol = colIndex;
                        break;
                    }
                }

                if (firstVisibleRow > -1 && firstVisibleCol > -1) {
                    this.selectedSheet._mergedRanges.push(new wijmo.grid.CellRange(firstVisibleRow, firstVisibleCol, range.bottomRow, range.rightCol));
                }
            }

            if (cellMergeAction) {
                cellMergeAction.saveNewState();
                this._undoStack._addAction(cellMergeAction);
            }
        }

        if (!cells) {
            this.refresh();
        }
    }

    /**
     * Gets a {@link CellRange} that specifies the merged extent of a cell
     * in a {@link GridPanel}.
     * This method overrides the getMergedRange method of its parent class FlexGrid
     *
     * @param panel {@link GridPanel} that contains the range.
     * @param r Index of the row that contains the cell.
     * @param c Index of the column that contains the cell.
     * @param clip Whether to clip the merged range to the grid's current view range.
     * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
     */
    getMergedRange(panel: wijmo.grid.GridPanel, r: number, c: number, clip = true): wijmo.grid.CellRange {
        var mergedRange = this.selectedSheet ? this.selectedSheet._getMergedRange(r, c) : null,
            topRow: number,
            bottonRow: number,
            leftCol: number,
            rightCol: number;

        if (panel === this.cells && mergedRange) {
            // Adjust the merged cell with the frozen pane.
            if (!mergedRange.isSingleCell && (this.frozenRows > 0 || this.frozenColumns > 0)
                && ((mergedRange.topRow < this.frozenRows && mergedRange.bottomRow >= this.frozenRows)
                    || (mergedRange.leftCol < this.frozenColumns && mergedRange.rightCol >= this.frozenColumns))) {
                topRow = mergedRange.topRow;
                bottonRow = mergedRange.bottomRow;
                leftCol = mergedRange.leftCol;
                rightCol = mergedRange.rightCol;

                if (r >= this.frozenRows && mergedRange.topRow < this.frozenRows) {
                    topRow = this.frozenRows;
                }

                if (r < this.frozenRows && mergedRange.bottomRow >= this.frozenRows) {
                    bottonRow = this.frozenRows - 1;
                }

                if (bottonRow >= this.rows.length) {
                    bottonRow = this.rows.length - 1;
                }

                if (c >= this.frozenColumns && mergedRange.leftCol < this.frozenColumns) {
                    leftCol = this.frozenColumns;
                }

                if (c < this.frozenColumns && mergedRange.rightCol >= this.frozenColumns) {
                    rightCol = this.frozenColumns - 1;
                }

                if (rightCol >= this.columns.length) {
                    rightCol = this.columns.length - 1;
                }

                return new wijmo.grid.CellRange(topRow, leftCol, bottonRow, rightCol);
            }

            if (mergedRange.bottomRow >= this.rows.length) {
                return new wijmo.grid.CellRange(mergedRange.topRow, mergedRange.leftCol, this.rows.length - 1, mergedRange.rightCol);
            }

            if (mergedRange.rightCol >= this.columns.length) {
                return new wijmo.grid.CellRange(mergedRange.topRow, mergedRange.leftCol, mergedRange.bottomRow, this.columns.length - 1);
            }

            return mergedRange.clone();
        }

        return super.getMergedRange(panel, r, c, clip);
    }

    /**
     * Evaluates a formula.
     *
     * {@link FlexSheet} formulas follow the Excel syntax, including a large subset of the
     * functions supported by Excel. A complete list of the functions supported by
     * {@link FlexSheet} can be found here: 
     * <a href="/wijmo/docs/Topics/Grid/FlexSheet/FlexSheet-Fomulas">FlexSheet Functions</a>.
     *
     * @param formula The formula to evaluate. The formula may start with an optional equals sign ('=').
     * @param format If specified, defines the .Net format that will be applied to the evaluated value.
     * @param sheet The {@link Sheet} whose data will be used for evaluation. 
     *              If not specified then the current sheet is used.
     * @param getPrimitiveResult Indicates whether need convert the non-primitive result to primitive type.
     */
    evaluate(formula: string, format?: string, sheet?: Sheet, getPrimitiveResult: boolean = true): any {
        let result = this._evaluate(formula, format, sheet);

        if (getPrimitiveResult && result != null && !wijmo.isPrimitive(result)) {
            if (result instanceof FormulaError) {
                return result.error;
            }

            return result.value;
        }
        return result;
    }

    /**
     * Gets the evaluated cell value.
     * 
     * Unlike the <b>getCellData</b> method that returns a raw data that can be a value or a formula, the <b>getCellValue</b>
     * method always returns an evaluated value, that is if the cell contains a formula then it will be evaluated first and the 
     * resulting value will be returned.
     *
     * @param rowIndex The row index of the cell.
     * @param colIndex The column index of the cell.
     * @param formatted Indicates whether to return an original or a formatted value of the cell.
     * @param sheet The {@link Sheet} whose value to evaluate. If not specified then the data from current sheet 
     * is used.
     */
    getCellValue(rowIndex: number, colIndex: number, formatted: boolean = false, sheet?: Sheet): any {
        var col = sheet && sheet !== this.selectedSheet ? <wijmo.grid.Column>sheet.grid.columns[colIndex] : <wijmo.grid.Column>this.columns[colIndex],
            styleInfo = this._getCellStyle(rowIndex, colIndex, sheet),
            format = (styleInfo && styleInfo.format) || null,
            cellVal = sheet && sheet !== this.selectedSheet
                ? sheet.grid.getCellData(rowIndex, colIndex, false)
                : this.getCellData(rowIndex, colIndex, false);

        if (wijmo.isString(cellVal)) {
            // Table header cells contain static values (column names) and therefore do not need to be formatted (related issue 456938).
            let tsheet = sheet || this.selectedSheet;
            if (tsheet) {
                let table = tsheet.findTable(rowIndex, colIndex);
                if (table && table._isHeaderRow(rowIndex)) {
                    return cellVal;
                }
            }

            var err = _FormulaErrorHelper.asError(cellVal);
            if (err) {
                return err;
            }

            if (_isFormula(cellVal)) {
                cellVal = this._evaluate(cellVal, null, sheet, rowIndex, colIndex);

                if (cellVal instanceof FormulaError) {
                    return cellVal;
                }
            }
        }

        if (formatted) {
            if (!format && cellVal != null && !wijmo.isPrimitive(cellVal)) {
                format = cellVal.format;
            }
            cellVal = this._formatEvaluatedResult(cellVal, col, format);
        } else if (cellVal != null && !wijmo.isPrimitive(cellVal)) {
            cellVal = cellVal.value;
        }

        // formatted=0 means that null\undefined values shouldn't be converted to ''. Used iternally in _CellRangeExpression.evaluate to detect empty cells.
        if (formatted as any === 0) {
            return cellVal;
        }

        return cellVal == null ? '' : cellVal; // synchronize with _CellRangeExpression.evaluate() when it changes.
    }

    /**
     * Open the function list.
     *
     * @param target The DOM element that toggle the function list.
     */
    showFunctionList(target: HTMLElement) {
        if (!this._enableFormulas) {
            return;
        }

        this._functionTarget = wijmo.tryCast(target, HTMLInputElement);
        if (this._functionTarget && this._functionTarget.value && this._functionTarget.value[0] === '=') {
            this._functionList._cv.filter = (item: any) => {
                var text = (<string>item['actualvalue']).toLowerCase(),
                    searchIndex = this._getCurrentFormulaIndex(this._functionTarget.value),
                    searchText: string;

                if (searchIndex === -1) {
                    searchIndex = 0;
                }
                searchText = this._functionTarget.value.substr(searchIndex + 1).trim().toLowerCase();

                if ((searchText.length > 0 && text.indexOf(searchText) === 0) || this._functionTarget.value === '=') {
                    return true;
                }
                return false;
            };
            this._functionList.selectedIndex = 0;

            let functionOffset = this._cumulativeOffset(target),
                rootOffset = this._cumulativeOffset(this._root),
                offsetTop = functionOffset.y + target.clientHeight + 2 + (wijmo.hasClass(target, 'wj-grid-editor') ? this._ptScrl.y : 0),
                offsetLeft = functionOffset.x + (wijmo.hasClass(target, 'wj-grid-editor') ? this._ptScrl.x : 0);

            wijmo.setCss(this._functionListHost, {
                height: this._functionList._cv.items.length > 5 ? '218px' : 'auto',
                display: this._functionList._cv.items.length > 0 ? 'block' : 'none',
                top: '',
                left: ''
            });
            this._functionListHost.scrollTop = 0;

            if (this._functionListHost.offsetHeight + offsetTop > rootOffset.y + this._root.offsetHeight) {
                offsetTop = offsetTop - target.clientHeight - this._functionListHost.offsetHeight - 5;
            } else {
                offsetTop += 5;
            }
            if (this._functionListHost.offsetWidth + offsetLeft > rootOffset.x + this._root.offsetWidth) {
                offsetLeft = rootOffset.x + this._root.offsetWidth - this._functionListHost.offsetWidth;
            }
            wijmo.setCss(this._functionListHost, {
                top: offsetTop,
                left: offsetLeft
            });
        } else {
            this.hideFunctionList();
        }
    }

    /**
     * Close the function list.
     */
    hideFunctionList() {
        this._functionListHost.style.display = 'none';
    }

    /**
     * Select previous function in the function list.
     */
    selectPreviousFunction() {
        var index = this._functionList.selectedIndex;
        if (index > 0) {
            this._functionList.selectedIndex--;
        }
    }

    /**
     * Select next function in the function list.
     */
    selectNextFunction() {
        var index = this._functionList.selectedIndex;
        if (index < this._functionList.itemsSource.length) {
            this._functionList.selectedIndex++;
        }
    }

    /**
     * Inserts the selected function from the function list to the cell value editor.
     */
    applyFunctionToCell() {
        if (this._functionTarget) {
            let currentFormulaIndex = this._getCurrentFormulaIndex(this._functionTarget.value);
            if (currentFormulaIndex === -1) {
                currentFormulaIndex = this._functionTarget.value.indexOf('=');
            } else {
                currentFormulaIndex += 1;
            }
            this._functionTarget.value = this._functionTarget.value.substring(0, currentFormulaIndex) + this._functionList.selectedValue + '(';
            if (this._functionTarget.value[0] !== '=') {
                this._functionTarget.value = '=' + this._functionTarget.value;
            }
            this._functionTarget.focus();
            this.hideFunctionList();
        }
    }

    /**
     * Saves <b>FlexSheet</b> to xlsx file.
     * This method works with JSZip 2.5.
     *
     * For example:
     * <pre>// This sample exports FlexSheet content to an xlsx file.  
     * // click.
     * &nbsp;
     * // HTML
     * &lt;button 
     *     onclick="saveXlsx('FlexSheet.xlsx')"&gt;
     *     Save
     * &lt;/button&gt;
     * &nbsp;
     * // JavaScript
     * function saveXlsx(fileName) {
     *     // Save the flexGrid to xlsx file.
     *     flexsheet.save(fileName);
     * }</pre>
     *
     * @param fileName Name of the file that is generated.
     * @param options {@link IFlexSheetXlsxOptions} object specifying the save options.
     * @return A workbook instance containing the generated xlsx file content.
     */
    save(fileName?: string, options?: IFlexSheetXlsxOptions): wijmo.xlsx.Workbook {
        var workbook = this._saveToWorkbook(options);

        if (fileName) {
            workbook.save(fileName);
        }

        return workbook;
    }

    /**
     * Saves the <b>FlexSheet</b> to xlsx file asynchronously.
     * This method works with JSZip 3.0.
     *
     * @param fileName Name of the file that is generated.
     * @param onSaved This callback provides an approach to get the base-64 string that
     *  represents the content of the saved FlexSheet. Since this method is an asynchronous
     * method, user is not able to get the base-64 string immediately. User has to get the
     * base-64 string through this callback. This has a single parameter, the base64 string
     * of the saved flexsheet. It is passed to user.
     * @param onError This callback catches error information when saving.
     * This has a single parameter, the failure reason. The return value is passed to user
     * if he wants to catch the save failure reason.
     *
     * For example:
     * <pre>
     * flexsheet.saveAsync('', function (base64) {
     *      // user can access the base64 string in this callback.
     *      document.getElementByID('export').href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' + 'base64,' + base64;
     * }, function (reason) {
     *      // User can catch the failure reason in this callback.
     *      console.log('The reason of save failure is ' + reason);
     * });
     * </pre>
     * @param options {@link IFlexSheetXlsxOptions} object specifying the save options.
     * @return A workbook instance containing the generated xlsx file content.
     */
    saveAsync(fileName?: string, onSaved?: (base64?: string) => any, onError?: (reason?: any) => any, options?: IFlexSheetXlsxOptions) {
        var workbook = this._saveToWorkbook(options);

        workbook.saveAsync(fileName, onSaved, onError);

        return workbook;
    }

    /*
     * Save the <b>FlexSheet</b> to Workbook Object Model represented by the {@link IWorkbook} interface.
     *
     * @param options {@link IFlexSheetXlsxOptions} object specifying the save options.
     * @return The {@link IWorkbook} instance that represents the export results.
     */
    saveToWorkbookOM(options?: IFlexSheetXlsxOptions): wijmo.xlsx.IWorkbook {
        var workbook = this._saveToWorkbook(options);

        return workbook._serialize();
    }

    /**
     * Loads the workbook into <b>FlexSheet</b>.
     * This method works with JSZip 2.5.
     *
     * For example:
     * <pre>// This sample opens an xlsx file chosen through Open File
     * // dialog and fills FlexSheet
     * &nbsp;
     * // HTML
     * &lt;input type="file" 
     *     id="importFile" 
     *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
     * /&gt;
     * &lt;div id="flexHost"&gt;&lt;/&gt;
     * &nbsp;
     * // JavaScript
     * var flexSheet = new wijmo.grid.FlexSheet("#flexHost"),
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
     *             flexSheet.load(reader.result);
     *         };
     *         reader.readAsArrayBuffer(file);
     *     }
     * }</pre>
     *
     * @param workbook A {@link wijmo.xlsx.Workbook}, Blob, base-64 string, or ArrayBuffer
     * containing the xlsx file content.
     */
    load(workbook: string | ArrayBuffer | Blob | wijmo.xlsx.Workbook) {
        if (workbook instanceof Blob) {
            wijmo.grid.xlsx._blobToBuffer(workbook, buffer => {
                workbook = null;
                let wb = new wijmo.xlsx.Workbook();
                wb.load(buffer);
                buffer = null;
                this._loadFromWorkbook(wb);
                wb = null;
            });
        } else if (workbook instanceof wijmo.xlsx.Workbook) {
            this._loadFromWorkbook(workbook);
            workbook = null;
        } else {
            if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                throw 'Invalid workbook.';
            }

            let wb = new wijmo.xlsx.Workbook();
            wb.load(workbook);
            workbook = null;
            this._loadFromWorkbook(wb);
            wb = null;
        }
    }

    /**
     * Loads the workbook into <b>FlexSheet</b> asynchronously.
     * This method works with JSZip 3.0.
     *
     * @param workbook A {@link wijmo.xlsx.Workbook}, Blob, base-64 string, or ArrayBuffer
     * containing the xlsx file content.
     * @param onLoaded This callback provides access to the loaded workbook instance.
     * Since this method is asynchronous, users cannot get the loaded workbook
     * instance immediately. 
     * This callback has a single parameter, the loaded workbook instance.
     * @param onError This callback catches errors when loading workbooks.
     * It has a single parameter, the failure reason.
     *
     * For example:
     * <pre>
     * flexsheet.loadAsync(blob, function (workbook) {
     *      // user can access the loaded workbook instance in this callback.
     *      var app = worksheet.application ;
     *      ...
     * }, function (reason) {
     *      // User can catch the failure reason in this callback.
     *      console.log('The reason of load failure is ' + reason);
     * });
     * </pre>
     */
    loadAsync(workbook: string | ArrayBuffer | Blob | wijmo.xlsx.Workbook, onLoaded?: (workbook: wijmo.xlsx.Workbook) => void, onError?: (reason?: any) => any) {
        if (workbook instanceof Blob) {
            wijmo.grid.xlsx._blobToBuffer(workbook, buffer => {
                workbook = null;
                let wb = new wijmo.xlsx.Workbook();
                wb.loadAsync(buffer, () => {
                    this._loadFromWorkbook(wb);
                    if (onLoaded) {
                        onLoaded(wb);
                    }
                    buffer = null;
                    wb = null;
                }, onError);
            });
        } else if (workbook instanceof wijmo.xlsx.Workbook) {
            this._loadFromWorkbook(workbook);
            if (onLoaded) {
                onLoaded(workbook);
            }
            workbook = null;
        } else {
            if (!(workbook instanceof ArrayBuffer) && !wijmo.isString(workbook)) {
                throw 'Invalid workbook.';
            }

            let wb = new wijmo.xlsx.Workbook();
            wb.loadAsync(workbook, () => {
                workbook = null;
                this._loadFromWorkbook(wb);
                if (onLoaded) {
                    onLoaded(wb);
                }
                wb = null;
            }, onError);
        }
    }

    /*
     * Load the Workbook Object Model instance into the <b>FlexSheet</b>.
     *
     * @param workbook The Workbook Object Model instance to load data from.
     */
    loadFromWorkbookOM(workbook: wijmo.xlsx.IWorkbook) {
        var grids = [],
            workbookInstance: wijmo.xlsx.Workbook;

        if (workbook instanceof wijmo.xlsx.Workbook) {
            workbookInstance = <wijmo.xlsx.Workbook>workbook;
        } else {
            workbookInstance = new wijmo.xlsx.Workbook();
            workbookInstance._deserialize(workbook);
        }

        this._loadFromWorkbook(workbookInstance);
    }

    /**
     * Undo the last user action.
     */
    undo() {
        // The undo should wait until other operations have done. (TFS 189582) 
        setTimeout(() => {
            this._undoStack.undo();
        }, 100);
    }

    /**
     * Redo the last user action.
     */
    redo() {
        // The redo should wait until other operations have done. (TFS 189582) 
        setTimeout(() => {
            this._undoStack.redo();
        }, 100);
    }

    /**
     * Selects a cell range and optionally scrolls it into view.
     *
     * {@link FlexSheet} overrides this method to adjust the selection cell range for the merged cells in the {@link FlexSheet}.
     *
     * @param rng The cell range to select.
     * @param show Indicates whether to scroll the new selection into view.
     */
    select(rng: any, show: any = true): boolean {
        var mergedRange: wijmo.grid.CellRange,
            rowIndex: number,
            colIndex: number;

        if (wijmo.isNumber(rng) && wijmo.isNumber(show)) {
            rng = new wijmo.grid.CellRange(<number>rng, <number>show);
            // Store the position before expanding the selection to merged cells (TFS 368034).
            this._lastSelMovePos = rng;
            show = true;
        } else {
            this._lastSelMovePos = null;
        }

        if (rng.rowSpan !== this.rows.length && rng.columnSpan !== this.columns.length) {
            for (rowIndex = rng.topRow; rowIndex <= rng.bottomRow; rowIndex++) {
                for (colIndex = rng.leftCol; colIndex <= rng.rightCol; colIndex++) {
                    mergedRange = this.getMergedRange(this.cells, rowIndex, colIndex);

                    if (mergedRange && !rng.equals(mergedRange)) {
                        if (rng.row <= rng.row2) {
                            rng.row = Math.min(rng.topRow, mergedRange.topRow);
                            rng.row2 = Math.max(rng.bottomRow, mergedRange.bottomRow);
                        } else {
                            rng.row = Math.max(rng.bottomRow, mergedRange.bottomRow);
                            rng.row2 = Math.min(rng.topRow, mergedRange.topRow);
                        }

                        if (rng.col <= rng.col2) {
                            rng.col = Math.min(rng.leftCol, mergedRange.leftCol);
                            rng.col2 = Math.max(rng.rightCol, mergedRange.rightCol);
                        } else {
                            rng.col = Math.max(rng.rightCol, mergedRange.rightCol);
                            rng.col2 = Math.min(rng.leftCol, mergedRange.leftCol);
                        }
                    }
                }
            }
        }

        if (this._isPasting && this.collectionView) {
            (<wijmo.collections.CollectionView>this.collectionView)._pendingRefresh = false;
        }

        if (!this._enableMulSel && this.selectedSheet) {
            this.selectedSheet.selectionRanges.clear();
        }

        return super.select(rng, show);
    }

    /*
     * Add custom function in {@link FlexSheet}.
     * @param name the name of the custom function.
     * @param func the custom function.
     * @param description the description of the custom function, it will be shown in the function autocompletion of the {@link FlexSheet}.
     * @param minParamsCount the minimum count of the parameter that the function need.
     * @param maxParamsCount the maximum count of the parameter that the function need.
     *        If the count of the parameters in the custom function is arbitrary, the minParamsCount and maxParamsCount should be set to null.
     */
    addCustomFunction(name: string, func: Function, description?: string, minParamsCount?: number, maxParamsCount?: number) {
        wijmo._deprecated('addCustomFunction', 'addFunction');
        this._calcEngine.addCustomFunction(name, func, minParamsCount, maxParamsCount);
        this._addCustomFunctionDescription(name, description);
    }

    /**
     * Add custom function in {@link FlexSheet}.
     * @param name the name of the custom function.
     * @param func the custom function.
     * <br/>
     * The function signature looks as follows:
     * <br/>
     * <pre>function (...params: any[][][]): any;</pre>
     * The function takes a variable number of parameters, each parameter corresponds to an expression
     * passed as a function argument. Independently of whether the expression passed as a function argument
     * resolves to a single value or to a cell range, each parameter value is always a two dimensional array
     * of resolved values. The number of rows (first index) and columns (second index) in the array corresponds
     * to the size of the specified cell range. In case where argument is an expression that resolves
     * to a single value, it will be a one-to-one array where its value can be retrieved using the
     * param[0][0] indexer.
     * <br/>
     * The sample below adds a custom Sum Product function ('customSumProduct') to the FlexSheet:
     * <pre>flexSheet.addFunction('customSumProduct', (...params: any[][][]) =&gt; {
     *    let result = 0,
     *        range1 = params[0],
     *        range2 = params[1];
     *
     *    if (range1.length &gt; 0 && range1.length === range2.length && range1[0].length === range2[0].length) {
     *        for (let i = 0; i &lt; range1.length; i++) {
     *            for (let j = 0; j &lt; range1[0].length; j++) {
     *                result += range1[i][j] * range2[i][j];
     *            }
     *        }
     *    }
     *    return result;
     * }, 'Custom SumProduct Function', 2, 2);</pre>
     * After adding this function, it can be used it in sheet cell expressions, like here:
     * <pre>=customSumProduct(A1:B5, B1:C5)</pre>
     * @param description the description of the custom function, it will be shown in the function autocompletion of the {@link FlexSheet}.
     * @param minParamsCount the minimum count of the parameter that the function need.
     * @param maxParamsCount the maximum count of the parameter that the function need.
     *        If the count of the parameters in the custom function is arbitrary, the minParamsCount and maxParamsCount should be set to null.
     */
    addFunction(name: string, func: Function, description?: string, minParamsCount?: number, maxParamsCount?: number) {
        this._calcEngine.addFunction(name, func, minParamsCount, maxParamsCount);
        this._addCustomFunctionDescription(name, description);
    }

    /**
     * Disposes of the control by removing its association with the host element.
     */
    dispose() {
        var userAgent = window.navigator.userAgent;

        this._needCopyToSheet = false;
        this.removeEventListener(document.body, 'mousemove', this._mouseMoveHdl);
        this.removeEventListener(document.body, 'keydown', this._keydownHdl);
        this.removeEventListener(document.body, 'click', this._clickHdl);

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            this.removeEventListener(document.body, 'touchstart', this._touchStartHdl);
            this.removeEventListener(document.body, 'touchend', this._touchEndHdl);
        }

        if (this._filter) {
            this._filter.filterApplied.removeAllHandlers();
        }

        this.hideFunctionList();

        if (!this.itemsSource) { // TFS 423676
            let sel = this._selHdl.selection;
            sel.row = sel.row2 = -1;
        }

        super.dispose();
    }

    /**
     * Gets the content of a {@link CellRange} as a string suitable for 
     * copying to the clipboard.
     *
     * {@link FlexSheet} overrides this method to support multiple rows or columns selection in {@link FlexSheet}.
     *
     * Hidden rows and columns are not included in the clip string.
     *
     * @param rng {@link CellRange} to copy. If omitted, the current selection is used.
     */
    getClipString(rng?: wijmo.grid.CellRange): string {
        var clipString = '',
            selections: wijmo.grid.CellRange[],
            rowIndex: number,
            selIndex: number,
            firstRow: boolean = true,
            firstCell: boolean,
            firstSel: wijmo.grid.CellRange,
            sel: wijmo.grid.CellRange,
            cell: string;

        if (!this.selectedSheet) {
            return super.getClipString(rng);
        }

        this._isCutting = false;
        if (!rng) {
            if (this.selectedSheet.selectionRanges.length > 1) {
                if (this._isMultipleRowsSelected()) {
                    clipString = '';
                    selections = this._selections();
                    selections.sort(this._sortByRow);
                    for (selIndex = 0; selIndex < selections.length; selIndex++) {
                        if (clipString) {
                            clipString += '\n';
                        }
                        clipString += this.getClipString(selections[selIndex]);
                    }
                    return clipString;
                } else if (this._isMultipleColumnsSelected()) {
                    clipString = '';
                    selections = this._selections();
                    selections.sort(this._sortByColumn);
                    firstSel = selections[0];
                    for (rowIndex = firstSel.topRow, firstRow = true; rowIndex <= firstSel.bottomRow; rowIndex++) {
                        if (!firstRow) {
                            clipString += '\n';
                        }
                        firstRow = false;
                        for (selIndex = 0, firstCell = true; selIndex < selections.length; selIndex++) {
                            sel = selections[selIndex];
                            if (!firstCell) {
                                clipString += '\t';
                            }
                            firstCell = false;
                            clipString += this.getClipString(new wijmo.grid.CellRange(rowIndex, sel.col, rowIndex, sel.col2));
                        }
                    }
                    return clipString;
                } else {
                    wijmo.assert(false, 'Copy or Cut operation cannot be used on multiple selections.');
                }
            } else {
                rng = this.selection;
                switch (this.selectionMode) {
                    // row modes: expand range to cover all columns
                    case wijmo.grid.SelectionMode.Row:
                    case wijmo.grid.SelectionMode.RowRange:
                        rng.col = 0;
                        rng.col2 = this.columns.length - 1;
                        break;

                    // ListBox mode: scan rows and copy selected ones
                    case wijmo.grid.SelectionMode.ListBox:
                        rng.col = 0;
                        rng.col2 = this.columns.length - 1;
                        for (var i = 0; i < this.rows.length; i++) {
                            if (this.rows[i].isSelected && this.rows[i].isVisible) {
                                rng.row = rng.row2 = i;
                                if (clipString) clipString += '\n';
                                clipString += this.getClipString(rng);
                            }
                        }
                        return clipString;
                }
            }
        }

        // scan rows
        rng = wijmo.asType(rng, wijmo.grid.CellRange);
        if (!rng.isValid) {
            return '';
        }
        for (var r = rng.topRow, firstRow = true; r <= rng.bottomRow; r++) {

            // skip invisible, add separator
            if (!this.rows[r].isVisible) continue;
            if (!firstRow) clipString += '\n';
            firstRow = false;

            // scan cells
            for (var c = rng.leftCol, firstCell = true; c <= rng.rightCol; c++) {

                // skip invisible, add separator
                if (!this.columns[c].isVisible) continue;
                if (!firstCell) clipString += '\t';
                firstCell = false;

                // append cell
                cell = this.getCellValue(r, c, true).toString();
                cell = cell.replace(/\t/g, ' '); // handle tabs
                if (cell.indexOf('\n') > -1) {   // handle line breaks
                    cell = '"' + cell.replace(/"/g, '""') + '"';
                }
                clipString += cell;
            }
        }

        return clipString;
    }

    /**
     * Parses a string into rows and columns and applies the content to a given range.
     *
     * Override the <b>setClipString</b> method of {@link FlexGrid}.
     *
     * @param text Tab and newline delimited text to parse into the grid.
     * @param rng {@link CellRange} to copy. If omitted, the current selection is used.
     */
    setClipString(text: string, rng?: wijmo.grid.CellRange) {
        var autoRange = rng == null,
            pasted = false,
            rngPaste: wijmo.grid.CellRange,
            row: number,
            col: number,
            pastedRow: number,
            pastedCol: number,
            copiedRow: number,
            copiedCol: number,
            rows: string[][],
            cells: string[],
            rowDiff: number,
            colDiff: number,
            exp: _Expression,
            srcRange: wijmo.grid.CellRange,
            dstRange: wijmo.grid.CellRange,
            copiedRange: wijmo.grid.CellRange,
            isMultiLine: boolean = false,
            copiedRowIndex: number,
            copiedColIndex: number,
            orgText: string,
            ecv = this.editableCollectionView;

        if (!this.selectedSheet) {
            super.setClipString(text, rng);
            return;
        }

        rng = rng ? wijmo.asType(rng, wijmo.grid.CellRange) : this.selection;

        // normalize text
        text = wijmo.asString(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        orgText = text;

        rows = this._edtHdl._parseClipString(wijmo.asString(text));
        if (autoRange && !rng.isSingleCell && rows.length) {
            this._edtHdl._expandClipRows(rows, rng);
        }

        isMultiLine = this._containsMultiLineText(rows);

        if ((!this._copiedRanges || this._copiedRanges.length === 0 || (orgText.trim() !== this._getRangeString(this._copiedRanges, this._copiedSheet).trim() && !this._containsRandFormula(this._copiedRanges, this._copiedSheet)) || !!this._cutValue) && !isMultiLine) {
            if (orgText !== this._cutValue) {
                this._cutValue = null;
                super.setClipString(text);
            }
            this._copiedRanges = null;
            this._copiedSheet = null;
            return;
        }

        if (this._copiedRanges) {
            var unEvaluatedText = this._getRangeString(this._copiedRanges, this._copiedSheet, false) + '\r\n';
            // normalize text
            unEvaluatedText = wijmo.asString(unEvaluatedText).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

            rows = this._edtHdl._parseClipString(wijmo.asString(unEvaluatedText));
            if (autoRange && !rng.isSingleCell && rows.length) {
                this._edtHdl._expandClipRows(rows, rng);
            }
        }

        // keep track of paste range to select later
        pastedRow = rng.topRow + rows.length - 1;
        if (pastedRow >= this.rows.length) {
            pastedRow = this.rows.length - 1;
        }
        pastedCol = rng.leftCol + rows[0].length - 1;
        if (pastedCol >= this.columns.length) {
            pastedCol = this.columns.length - 1;
        }
        rngPaste = new wijmo.grid.CellRange(rng.topRow, rng.leftCol, pastedRow, pastedCol);

        if (!this.onPasting(new wijmo.grid.CellRangeEventArgs(this.cells, rngPaste, text))) {
            this._cutValue = null;
            this._copiedRanges = null;
            this._copiedSheet = null;
            return;
        }

        // copy lines to rows
        this.beginUpdate();
        if (isMultiLine || !this._copiedRanges || this._copiedRanges.length > 1 || this._copiedRanges.length === 0) {
            row = rng.topRow;
            copiedRange = this._copiedRanges && this._copiedRanges.length > 1 ? this._copiedRanges[0] : new wijmo.grid.CellRange();
            copiedRow = copiedRange.topRow;
            for (let i = 0; i < rows.length && row < this.rows.length; i++, row++) {
                // skip invisible row, keep clip line
                if (!this.rows[row].isVisible) {
                    i--;
                    continue;
                }
                // copy cells to columns
                cells = rows[i];
                copiedCol = copiedRange.leftCol;
                col = rng.leftCol;
                colDiff = col - copiedCol;
                for (let j = 0; j < cells.length && col < this.columns.length; j++, col++) {
                    // skip invisible column, keep clip cell
                    if (!this.columns[col].isVisible) {
                        j--;
                        continue;
                    }
                    // assign cell
                    let cell = cells[j];
                    if (!this.columns[col].isReadOnly && !this.rows[row].isReadOnly) {
                        // unquote multi-line cells
                        let len = cell.length;
                        if (len > 1 && cell[0] == '"' && cell[len - 1] == '"' && cell.indexOf('\n') > -1) {
                            cell = cell.substr(1, len - 2);
                        }

                        pasted = this._postSetClipStringProcess(cell, row, col, copiedRow, copiedCol, ecv);

                        // update paste range
                        rngPaste.row2 = Math.max(rngPaste.row2, row);
                        rngPaste.col2 = Math.max(rngPaste.col2, col);
                    }
                    if (copiedCol >= 0) {
                        copiedCol++;
                    }
                }
                if (copiedRow >= 0) {
                    copiedRow++;
                }
            }
        } else if (this._copiedRanges && this._copiedRanges.length === 1) {
            var copiedGrid = this.selectedSheet === this._copiedSheet ? this : this._copiedSheet.grid;

            copiedRowIndex = 0;
            copiedRange = this.selectionMode === wijmo.grid.SelectionMode.ListBox ? this._getSelectionForListBoxMode(copiedGrid) : this._copiedRanges[0];
            row = rng.topRow;
            for (let i = 0; i < rows.length && row < this.rows.length; i++, row++) {
                copiedColIndex = 0;
                // skip invisible row
                if (!this.rows[row].isVisible) {
                    i--;
                    continue;
                }
                while (copiedGrid.rows[copiedRange.topRow + copiedRowIndex] && !copiedGrid.rows[copiedRange.topRow + copiedRowIndex].isVisible) {
                    copiedRowIndex++;
                }
                if (copiedRowIndex >= copiedRange.rowSpan) {
                    copiedRowIndex = copiedRowIndex % copiedRange.rowSpan;
                }
                if (!copiedGrid.rows[copiedRange.topRow + copiedRowIndex]) {
                    break;
                }
                rowDiff = row - copiedRange.topRow - copiedRowIndex;
                cells = rows[i];
                col = rng.leftCol;
                for (let j = 0; j < cells.length && col < this.columns.length; j++, col++) {
                    // skip invisible column
                    if (!this.columns[col] || !this.columns[col].isVisible) {
                        j--;
                        continue;
                    }
                    if (copiedColIndex >= copiedRange.columnSpan) {
                        copiedColIndex = copiedColIndex % copiedRange.columnSpan;
                    }
                    if (!copiedGrid.columns[copiedRange.leftCol + copiedColIndex]) {
                        break;
                    }
                    colDiff = col - copiedRange.leftCol - copiedColIndex;
                    if (!this.columns[col].isReadOnly && !this.rows[row].isReadOnly) {
                        let cell = cells[j],
                            styleInfo = this._getCellStyle(copiedRange.topRow + copiedRowIndex, copiedRange.leftCol + copiedColIndex, this._copiedSheet);

                        if (_isFormula(cell) && (rowDiff !== 0 || colDiff !== 0)) {
                            try {
                                exp = this._calcEngine._parse(cell);
                                srcRange = new wijmo.grid.CellRange(copiedRange.topRow + copiedRowIndex, copiedRange.leftCol + copiedColIndex);
                                dstRange = new wijmo.grid.CellRange(copiedRange.topRow + copiedRowIndex + rowDiff, copiedRange.leftCol + copiedColIndex + colDiff);

                                let updateFormula = this._isCutting && !exp._refersTo(copiedRange)
                                    ? false // When doing cut and paste, update the formula only if it refers to a cell that is also being cutted. (472136, 473065)
                                    : true;

                                if (exp._moveCellRangeExp(this.selectedSheetIndex, srcRange, dstRange, false, updateFormula)) {
                                    cell = '=' + exp._getStringExpression();
                                }
                            } catch (e) {
                            }
                        }
                        if (copiedGrid.columns[copiedRange.leftCol + copiedColIndex].format && !this.columns[col].format) {
                            if (!styleInfo) {
                                styleInfo = { format: copiedGrid.columns[copiedRange.leftCol + copiedColIndex].format };
                            } else if (!styleInfo.format) {
                                styleInfo.format = copiedGrid.columns[copiedRange.leftCol + copiedColIndex].format;
                            }
                        }
                        pasted = this._postSetClipStringProcess(cell, row, col, copiedRange.topRow + copiedRowIndex, copiedRange.leftCol + copiedColIndex, ecv, styleInfo);

                        // update paste range
                        rngPaste.row2 = Math.max(rngPaste.row2, row);
                        rngPaste.col2 = Math.max(rngPaste.col2, col);
                    }
                    copiedColIndex++;
                }
                copiedRowIndex++;
            }
        }

        if (this._isCutting) {
            this._delCutData(rows.length, rows[0].length);
            this._isCutting = false;
            this._cutValue = orgText;
            this._copiedRanges = null;
            this._copiedSheet = null;
        }

        this.endUpdate();

        // done, refresh view to update sorting/filtering 
        if (this.collectionView && pasted) {
            this.collectionView.refresh();
        }

        // select pasted range
        this.select(rngPaste);
        this.onPasted(new wijmo.grid.CellRangeEventArgs(this.cells, rngPaste));
    }

    /**
     * Get the built-in table style via its name.
     *
     * @param styleName The name of the built-in table style.
     */
    getBuiltInTableStyle(styleName: string): TableStyle {
        var tableStyle: TableStyle;

        if (this._builtInTableStylesCache == null) {
            this._builtInTableStylesCache = {};
        }
        tableStyle = <TableStyle>this._builtInTableStylesCache[styleName.toLowerCase()];
        if (tableStyle == null) {
            tableStyle = this._createBuiltInTableStyle(styleName);
            Object.freeze(tableStyle);
            this._builtInTableStylesCache[styleName.toLowerCase()] = tableStyle;
        }

        return tableStyle;
    }

    onSortingColumn(e: wijmo.grid.CellRangeEventArgs): boolean {
        // Prevent FlexSheet from sorting when clicking on a column header even if allowSorting is set. (TFS 352216)
        return false;
    }

    // Override the getCvIndex method of its parent class FlexGrid
    _getCvIndex(index: number): number {
        var row: wijmo.grid.Row;
        if (index > -1 && this.collectionView) {
            row = this.rows[index];
            if (row instanceof HeaderRow) {
                return index;
            } else {
                return super._getCvIndex(index);
            }
        }

        return -1;
    }

    _getDataRowsOffset(): number {
        let offset = 0;

        // skip the new row template
        if (this.allowAddNew && this.newRowAtTop) {
            offset++;
        }

        // skip the header row
        if (this.rows[offset] instanceof HeaderRow) {
            offset++;
        }

        return offset;
    }

    // Override the _bindGrid method of FlexGrid.
    protected _bindGrid(full: boolean) {
        if (this._ignoreBindGrid) {
            return;
        }

        if (this.itemsSource) {
            super._bindGrid(full);
        } else {
            // update selection in case we have no rows
            let sel = this._selHdl.selection;
            sel.row = sel.row2 = -1;
        }
    }

    // Initialize the FlexSheet control
    private _init() {
        let userAgent = window.navigator.userAgent,
            mouseUp = (e: MouseEvent) => {
                document.removeEventListener('mouseup', mouseUp);
                this._mouseUp(e);
            };

        this.hostElement.setAttribute('tabindex', '-1');
        this._divContainer = <HTMLElement>this.hostElement.querySelector('[wj-part="container"]');
        this._tabHolder = new _TabHolder(this.hostElement.querySelector('[wj-part="tab-holder"]'), this);

        // Add sheets event handlers after _tabHolder 
        this._sheets.selectedSheetChanged.addHandler(this._selectedSheetChange, this);
        this._sheets.collectionChanged.addHandler(this._sourceChange, this);
        this._sheets.sheetVisibleChanged.addHandler(this._sheetVisibleChange, this);
        this._sheets.sheetCleared.addHandler(this.onSheetCleared, this);

        this._contextMenu = new _SheetContextMenu(this.hostElement.querySelector('[wj-part="context-menu"]'), this);

        // #394118
        this._tabHolder.addEventListener(this._tabHolder.hostElement, 'mousedown', () => {
            if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
                this._hideContextMenu();
            }
        });

        this['_gpCells'] = new FlexSheetPanel(this, wijmo.grid.CellType.Cell, this.rows, this.columns, <HTMLElement>this._eCt);
        this['_gpCHdr'] = new FlexSheetPanel(this, wijmo.grid.CellType.ColumnHeader, this._hdrRows, this.columns, this._eCHdrCt);
        this['_gpRHdr'] = new FlexSheetPanel(this, wijmo.grid.CellType.RowHeader, this.rows, this._hdrCols, this._eRHdrCt);
        this['_gpTL'] = new FlexSheetPanel(this, wijmo.grid.CellType.TopLeft, this._hdrRows, this._hdrCols, this._eTLCt);
        // Override the '_syncSelection' of FlexGrid (TFS 352257, 353407)
        this['_syncSelection'] = this._flexSheetSyncSelection.bind(this);

        this._sortManager = new SortManager(this);
        this._filter = new FlexSheetFilter(this);
        this._filter.filterApplied.addHandler(() => {
            if (this.selectedSheet) {
                this.selectedSheet._filterDefinition = this._filter.filterDefinition;
                if (this.selectedSheet.itemsSource) {
                    this.selectedSheet._storeRowSettings();
                    this.selectedSheet._setRowSettings();
                }
            }
        });
        this._calcEngine = new _CalcEngine(this);
        this._calcEngine.unknownFunction.addHandler((sender: Object, e: UnknownFunctionEventArgs) => {
            this.onUnknownFunction(e);
        }, this);
        this._initFuncsList();

        this._undoStack = new UndoStack(this);

        // Add header row for the bind sheet.
        this.loadedRows.addHandler(() => {
            if (this.collectionView && !(this.rows[0] instanceof HeaderRow) && !this._headerRowRemoved) {
                var row = new HeaderRow(),
                    col: wijmo.grid.Column;
                row.isReadOnly = true;
                for (var i = 0; i < this.columns.length; i++) {
                    col = this.columns[i]
                    if (!row._ubv) {
                        row._ubv = {};
                    }
                    row._ubv[col._hash] = FlexSheet._getHeaderRowText(col);
                }
                if (this.rows[0] instanceof wijmo.grid._NewRowTemplate && this.newRowAtTop) {
                    this.rows.insert(1, row);
                } else {
                    this.rows.insert(0, row);
                }
            }

            if (this._filter) {
                this._filter.apply();
            }
        });

        // Setting the required property of the column to false for the bound sheet.
        // TFS #126125
        this.itemsSourceChanged.addHandler(() => {
            var colIndex: number;
            for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                this.columns[colIndex].isRequired = false;
            }
            if (this.collectionView) {
                //this.collectionView.currentChanged.removeHandler(this['_cvCurrentChanged'], this);
                this.collectionView.currentChanged.removeHandler(null, this); // because _cvCurrentChanged is an arrow function now. (TFS 466799)
            }
        });

        // Store the copied range for updating cell reference of the formula when copying. (TFS 190785)
        this.copied.addHandler((sender: Object, args: wijmo.grid.CellRangeEventArgs) => {
            var selections: wijmo.grid.CellRange[];
            if (!this.selectedSheet) {
                return;
            }
            this._copiedSheet = this.selectedSheet;
            this._needCopyToSheet = true;
            if (this.selectedSheet.selectionRanges.length > 1) {
                if (this._isMultipleRowsSelected()) {
                    selections = this.selectedSheet.selectionRanges.slice(0);
                    selections.sort(this._sortByRow);
                    this._copiedRanges = selections;
                } else if (this._isMultipleColumnsSelected()) {
                    selections = this.selectedSheet.selectionRanges.slice(0);
                    selections.sort(this._sortByColumn);
                    this._copiedRanges = selections;
                } else {
                    wijmo.assert(false, 'Copy operation cannot be used on multiple selections.');
                }
            } else {
                this._copiedRanges = [args.range];
            }
        });

        // If the rows\columns of FlexSheet were cleared, we should reset merged cells, styled cells and selection of current sheet to null. (TFS 140344)
        this.rows.collectionChanged.addHandler((sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
            this._clearForEmptySheet('rows');
            if (!this.itemsSource && this.selectedSheet && this._needCopyToSheet && !this._isCopying && !this._isUndoing && !(e.item instanceof wijmo.grid._NewRowTemplate)) {
                // Synch the change of rows with current sheet.
                this._copyRowsToSelectedSheet();
            }
            if (this.itemsSource && this.selectedSheet && e.action === wijmo.collections.NotifyCollectionChangedAction.Remove && e.item instanceof HeaderRow) {
                this._headerRowRemoved = true;
            }
        }, this);
        this.columns.collectionChanged.addHandler((sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
            this._clearForEmptySheet('columns');
            if (this.selectedSheet && this._needCopyToSheet && !this._isCopying && !this._isUndoing) {
                // Synch the change of columns with current sheet.
                this._copyColumnsToSelectedSheet();
            }
        }, this);

        // Validate the inserted and updated defined name item.
        this.definedNames.collectionChanged.addHandler((sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
            if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add || e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
                var action = e.action === wijmo.collections.NotifyCollectionChangedAction.Add ? 'inserted' : 'updated';
                if (!(e.item instanceof DefinedName)) {
                    this.definedNames.remove(e.item);
                    throw 'Invalid defined name item object was ' + action + '.  The DefinedName instance should be ' + action + ' in the definedNames array.';
                }
                if (!(e.item && e.item.name && e.item.value != null)) {
                    this.definedNames.remove(e.item);
                    throw 'Invalid defined name was ' + action + '.';
                }
                if (e.item.sheetName != null && !this._validateSheetName(e.item.sheetName)) {
                    this.definedNames.remove(e.item);
                    throw 'The sheet name (' + e.item.sheetName + ') does not exist in FlexSheet.';
                }
                if (this._checkExistDefinedName(e.item.name, e.item.sheetName, e.index)) {
                    this.definedNames.remove(e.item);
                    throw 'The ' + e.item.name + ' already existed in definedNames.';
                }
            }
        });

        this.addEventListener(this.hostElement, 'mousedown', (e: MouseEvent) => {
            document.addEventListener('mouseup', mouseUp);
            // Only when the target is the child of the root container of the FlexSheet control, 
            // it will deal with the mouse down event handler of the FlexSheet control. (TFS 152995)
            if (this._isDescendant(this._divContainer, e.target)) {
                this._mouseDown(e);
            }
        }, true);

        this.addEventListener(this.hostElement, 'dragend', () => {
            this._columnHeaderClicked = false;
            // After dropping in flexsheet, the flexsheet._htDown should be reset to null. (TFS #142369, #380457)
            this._htDown = null;

            // WJM-14168 
            this._enableMulSel = false;
            this.selectedSheet._addSelection(this.selection);
        });

        this.addEventListener(this.hostElement, 'contextmenu', (e: MouseEvent) => {
            if (e.defaultPrevented || !this.selectedSheet) {
                return;
            }

            if (!this.activeEditor) {
                let ht: wijmo.grid.HitTestInfo,
                    point: wijmo.Point,
                    sel = this.selection;

                // Handle the hitTest for the keyboard context menu event in IE
                // Since it can't get the correct position for the keyboard context menu event in IE (TFS 122943)
                if (this._isContextMenuKeyDown && sel.row > -1 && sel.col > -1 && this.rows.length > 0 && this.columns.length > 0) {
                    let selectedCol = this.columns[sel.col],
                        selectedRow = this.rows[sel.row],
                        hostOffset = this._cumulativeOffset(this.hostElement),
                        hostScrollOffset = this._cumulativeScrollOffset(this.hostElement),
                        colPos = selectedCol.pos + this._eCt.offsetLeft + hostOffset.x + selectedCol.renderSize / 2 + this._ptScrl.x,
                        rowPos = selectedRow.pos + this._eCt.offsetTop + hostOffset.y + selectedRow.renderSize / 2 + this._ptScrl.y;

                    point = new wijmo.Point(colPos - hostScrollOffset.x, rowPos - hostScrollOffset.y);
                    ht = this.hitTest(colPos, rowPos);
                } else {
                    ht = this.hitTest(e);
                }

                e.preventDefault();

                if (ht && ht.cellType !== wijmo.grid.CellType.None) {
                    let lci = this.columns.length - 1,
                        lri = this.rows.length - 1,
                        newSel: wijmo.grid.CellRange;

                    switch (ht.cellType) {
                        case wijmo.grid.CellType.TopLeft:
                            newSel = new wijmo.grid.CellRange(Math.min(0, lri), Math.min(0, lci), lri, lci);
                            break;
                        case wijmo.grid.CellType.RowHeader:
                            newSel = new wijmo.grid.CellRange(ht.row, Math.min(0, lci), ht.row, lci);
                            break;
                        case wijmo.grid.CellType.ColumnHeader:
                            newSel = new wijmo.grid.CellRange(this.itemsSource && this.rows[0] && !this.rows[0].isVisible ? 1 : Math.min(0, lri), ht.col, lri, ht.col);
                            break;
                        case wijmo.grid.CellType.Cell:
                            newSel = new wijmo.grid.CellRange(ht.row, ht.col);
                            break;
                    }

                    // The selection should not change after right-clicking on an item that is already selected.
                    if ((newSel && this.selection.contains(newSel)) ||
                        (ht.cellType === wijmo.grid.CellType.RowHeader && this._isRowSelected(ht.row)) ||
                        (ht.cellType === wijmo.grid.CellType.ColumnHeader && this._isColumnSelected(ht.col)) ||
                        (ht.cellType === wijmo.grid.CellType.Cell && this._isCellSelected(ht.row, ht.col))
                    ) {
                        newSel = null;
                    }

                    if (newSel) {
                        if (this.selectedSheet) {
                            this.selectedSheet.selectionRanges.clear();
                            this.selectedSheet.selectionRanges.push(newSel);
                        }
                        this.selection = newSel;
                    }

                    this._contextMenu.show(e, point);
                }
            }

            this._isContextMenuKeyDown = false;
        });

        this.prepareCellForEdit.addHandler(this._prepareCellForEditHandler, this);

        this.cellEditEnded.addHandler((sender: wijmo.grid.FlexGrid, args: wijmo.grid.CellEditEndingEventArgs) => {
            if (args.data && (args.data.keyCode === 46 || args.data.keyCode === 8)) {
                return;
            }
            setTimeout(() => {
                this.hideFunctionList();
            }, 200);
        });

        this.cellEditEnding.addHandler((sender: wijmo.grid.FlexGrid, args: wijmo.grid.CellEditEndingEventArgs) => {
            if (args.cancel || (args.data && (args.data.keyCode === 46 || args.data.keyCode === 8))) {
                return;
            }

            let orgVal = this.getCellData(args.row, args.col, false),
                updateVal = this.cellFactory.getEditorValue(this);

            if ((orgVal == null || orgVal === '') && updateVal != null && updateVal !== '' && !isNaN(+updateVal)) {
                let updatedFormulas = this._updateFormulaBoundaryForEditingCell(args.row, args.col);
                if (this._undoStack._pendingAction && this._undoStack._pendingAction instanceof _EditAction) {
                    (<_EditAction>this._undoStack._pendingAction)._affectedFormulas = updatedFormulas;
                }
            }

            this._clearCalcEngine();
            this._clearCalcCacheOnRefresh = false;
        });

        this.rowEditEnding.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            let cv = this.collectionView;
            if (cv && this.selectedSheet) {
                //this._orgRowVisible = this.rows[e.row].visible;

                let sort = cv.sortDescriptions.length > 0;
                let filter = this._filter && this._filter._isActive();

                // _dataView != null means that some of the rows were inserted/deleted (398852)
                if (sort || this.selectedSheet._dataView || filter) {
                    this.selectedSheet._dataView = (<wijmo.collections.CollectionView>cv)._view.slice();
                }

                if (sort) {
                    this.selectedSheet._scrollPosition = this.scrollPosition;
                }
            }
        });

        this.rowEditEnded.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            let cv = this.collectionView;
            if (cv && this.selectedSheet) {
                if (this.selectedSheet._dataView) { // 407927; 398852 (some of the rows were inserted/deleted)
                    this.selectedSheet._dataView = (<wijmo.collections.CollectionView>cv)._view.slice();
                }

                let sort = cv.sortDescriptions.length > 0;
                let filter = this._filter && this._filter._isActive();

                if (sort || filter) {
                    (<wijmo.collections.CollectionView>cv)._view = this.selectedSheet._dataView;
                    (<wijmo.collections.CollectionView>cv)._pgView = (<wijmo.collections.CollectionView>cv)._getPageView();
                    if (!(this.itemsSource instanceof wijmo.collections.CollectionView)) {
                        (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._view = this.selectedSheet._dataView;
                        (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>this.selectedSheet.grid.collectionView)._getPageView();
                    }
                    this._bindGrid(false);
                    this.selectedSheet.grid['_bindGrid'](false);
                }

                if (sort) {
                    this.scrollPosition = this.selectedSheet._scrollPosition;
                }

                //if (this.rows[e.row]) {
                //    this.rows[e.row].visible = this._orgRowVisible; // If grouping is active then e.row can point to a completely different row...
                //}
            }
        });

        this.pasting.addHandler(() => {
            this._needCopyToSheet = false;
            this._isPasting = true;
        });

        this.pasted.addHandler(() => {
            var sel = this.selection;
            this._needCopyToSheet = true;
            this._isPasting = false;
            this._clearCalcEngine();
        });

        this.resizingColumn.addHandler(() => {
            this._resizing = true;
        });

        this.resizingRow.addHandler(() => {
            this._resizing = true;
        });

        this.resizedColumn.addHandler(() => {
            this._resizing = false;
        });

        this.resizedRow.addHandler(() => {
            this._resizing = false;
        });

        this.selectionChanged.addHandler(() => {
            let sel = this.selection;

            // TFS 398682.
            // if (!this._isCopying && sel.isValid && !this.containsFocus()) {
            //     this.hostElement.focus();
            // }
            if (sel.rightCol >= this.columns.length) {
                this.selection = new wijmo.grid.CellRange(sel.row, Math.min(sel.col, this.columns.length - 1), sel.row2, Math.min(this.selection.col2, this.columns.length - 1));
            }
            if (!this._enableMulSel && !this._isCopying && this.selectedSheet) {
                this.selectedSheet.selectionRanges.clear();
            }
        });

        this.addEventListener(this.hostElement, 'keydown', (e: KeyboardEvent) => {
            var args: wijmo.grid.CellRangeEventArgs,
                text: string,
                selectedRowsExist: boolean = false,
                continuousSelected: boolean = false;

            if (e.ctrlKey) {
                if (e.keyCode === 89) {
                    this.finishEditing();
                    this.redo();
                    e.preventDefault();
                }

                if (e.keyCode === 90) {
                    this.finishEditing();
                    this.undo();
                    e.preventDefault();
                }

                if (!!this.selectedSheet && e.keyCode === 65) {
                    this.selectedSheet.selectionRanges.clear();
                    this.selectedSheet.selectionRanges.push(this.selection);
                }

                if (e.keyCode === 67 || e.keyCode == 45) {
                    if (!!this.activeEditor) {
                        this._copiedRanges = null;
                        this._copiedSheet = null;
                    }
                    this._cutValue = null;
                }

                // Processing for 'Cut' operation. (TFS 191694)
                if (e.keyCode === 88) {
                    if (!this.activeEditor) {
                        e.stopPropagation();
                        if (this.selectionMode === wijmo.grid.SelectionMode.ListBox) {
                            for (var i = 0; i < this.rows.length; i++) {
                                if (this.rows[i].isSelected) {
                                    if (!selectedRowsExist) {
                                        selectedRowsExist = true;
                                        continuousSelected = true;
                                    } else if (continuousSelected) {
                                        continue;
                                    } else {
                                        wijmo.assert(false, 'Cut operation cannot be used on multiple selections.');
                                    }
                                } else if (continuousSelected) {
                                    continuousSelected = false;
                                }
                            }
                        }
                        if (this.selectedSheet.selectionRanges.length > 1) {
                            wijmo.assert(false, 'Cut operation cannot be used on multiple selections.');
                        } else {
                            this.finishEditing();
                            args = new wijmo.grid.CellRangeEventArgs(this.cells, this.selection);
                            if (this.onCopying(args)) {
                                this._cutValue = null;
                                text = this.getClipString();
                                this._isCutting = true;
                                wijmo.Clipboard.copy(text);
                                this.onCopied(args);
                            }
                        }
                    }
                }

                if (e.keyCode === wijmo.Key.Space && this.selection.isValid && (this.selectionMode === wijmo.grid.SelectionMode.CellRange || this.selectionMode === wijmo.grid.SelectionMode.MultiRange)) {
                    this.select(new wijmo.grid.CellRange(0, this.selection.col, this.rows.length - 1, this.selection.col));
                }
            }

            // When press 'Esc' key, we should hide the context menu (TFS 122527)
            if (e.keyCode === wijmo.Key.Escape) {
                this._hideContextMenu();
            }

            // Mark the context menu shortcut key pressed.
            if (e.keyCode === 93 || (e.shiftKey && e.keyCode === 121)) {
                if (this._contextMenu.visible && !wijmo.isFirefox()) {
                    this._isContextMenuKeyDown = false;
                } else {
                    this._isContextMenuKeyDown = true;
                }
            }
        });

        this.addEventListener(document.body, 'keydown', this._keydownHdl, true);

        this.addEventListener(document.body, 'click', this._clickHdl);

        this.addEventListener(document.body, 'mousemove', this._mouseMoveHdl);

        // Show/hide the customize context menu for iPad or iPhone 
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            this.addEventListener(document.body, 'touchstart', this._touchStartHdl);
            this.addEventListener(document.body, 'touchend', this._touchEndHdl);
        }
    }

    // Override the '_syncSelection' method of FlexGrid.
    private _flexSheetSyncSelection(force: boolean) {
        if (this.collectionView && this.selectionMode != wijmo.grid.SelectionMode.None) {
            let sel = this.selection,
                row = sel.row > -1 && sel.row < this.rows.length ? this.rows[sel.row] : null,
                item = row ? row.dataItem : null;

            if (this.collectionView instanceof wijmo.collections.CollectionView && this.collectionView.isUpdating) {
                return;
            }

            if (row instanceof HeaderRow || (this.newRowAtTop && row instanceof wijmo.grid._NewRowTemplate) || (item instanceof wijmo.collections.CollectionViewGroup)) {
                item = null;
            }

            // if it doesn't match the view's, move the selection to match
            if (item != this.collectionView.currentItem || force) {
                if (!this.editableCollectionView || !this.editableCollectionView.currentAddItem) {
                    let index = this['_getRowIndex'](this.collectionView.currentPosition);
                    if (index != sel.row) {
                        sel.row = sel.row2 = index;
                        this.select(sel, false);
                        if (this.selectionMode && !this._copyingTo) { // != SelectionMode.None) {
                            this.scrollIntoView(sel.row, -1);
                        }
                    }
                }
            }
        }
    }

    // initialize the function autocomplete list
    private _initFuncsList() {
        this._functionListHost = document.createElement('div');
        wijmo.addClass(this._functionListHost, 'wj-flexsheet-formula-list');
        document.querySelector('body').appendChild(this._functionListHost);
        this._functionListHost.style.display = 'none';
        this._functionListHost.style.position = 'absolute';

        this._functionList = new wijmo.input.ListBox(this._functionListHost);
        this._functionList.isContentHtml = true;
        this._functionList.itemsSource = this._getFunctions();
        this._functionList.displayMemberPath = 'displayValue';
        this._functionList.selectedValuePath = 'actualvalue';

        this.addEventListener(this._functionListHost, 'click', this.applyFunctionToCell.bind(this));
        this.addEventListener(this._functionListHost, 'keydown', (e: KeyboardEvent) => {
            // When press 'Esc' key in the host element of the function list,
            // the function list should be hidden and make the host element of the flexsheet get focus. (TFS 142370)
            if (e.keyCode === wijmo.Key.Escape) {
                this.hideFunctionList();
                this.hostElement.focus();
                e.preventDefault();
            }
            // When press 'Enter' key in the host element of the function list,
            // the selected function of the function should be applied to the selected cell
            // and make the host element of the flexsheet get focus.
            if (e.keyCode === wijmo.Key.Enter) {
                this.applyFunctionToCell();
                this.hostElement.focus();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    // Organize the functions data the function list box
    private _getFunctions(): string[] {
        var functions = [],
            i = 0,
            func: any;

        for (; i < FlexSheetFunctions.length; i++) {
            func = FlexSheetFunctions[i];
            functions.push({
                displayValue: '<div class="wj-flexsheet-formula-name">' + func.name + '</div><div class="wj-flexsheet-formula-description">' + func.description + '</div>',
                actualvalue: func.name
            });
        }

        return functions;
    }

    // Add the description of the custom function in flexsheet.
    private _addCustomFunctionDescription(name: string, description: string) {
        var customFuncDesc = {
            displayValue: '<div class="wj-flexsheet-formula-name">' + name + '</div>' + (description ? '<div class="wj-flexsheet-formula-description">' + description + '</div>' : ''),
            actualvalue: name
        },
            funcList = this._functionList.itemsSource,
            funcIndex = -1,
            i = 0,
            funcDesc: any;

        for (; i < funcList.length; i++) {
            funcDesc = funcList[i];
            if (funcDesc.actualvalue === name) {
                funcIndex = i;
                break;
            }
        }

        if (funcIndex > -1) {
            funcList.splice(funcIndex, 1, customFuncDesc)
        } else {
            funcList.push(customFuncDesc);
        }
    }

    // Get current processing formula index.
    private _getCurrentFormulaIndex(searchText: string): number {
        var searchIndex = -1;

        ['+', '-', '*', '/', '^', '(', '&'].forEach((val) => {
            var index = searchText.lastIndexOf(val);

            // skip if '/' is a part of #N/A or #DIV/0? error.
            if (val === '/' && ((index >= 2 && searchText.substr(index - 2, 2) === '#N') || (index >= 4 && searchText.substr(index - 4, 4) === '#DIV'))) {
                return;
            }

            if (index > searchIndex) {
                searchIndex = index;
            }
        });

        return searchIndex;
    }

    // Prepare cell for edit event handler.
    // This event handler will attach keydown, keyup and blur event handler for the edit cell.
    private _prepareCellForEditHandler() {
        var edt = this._edtHdl._edt;

        if (!edt) {
            return;
        }
        // bind keydown event handler for the edit cell.
        this.addEventListener(edt, 'keydown', (e: KeyboardEvent) => {
            if (this.isFunctionListOpen) {
                switch (e.keyCode) {
                    case wijmo.Key.Up:
                        this.selectPreviousFunction();
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    case wijmo.Key.Down:
                        this.selectNextFunction();
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    case wijmo.Key.Tab:
                    case wijmo.Key.Enter:
                        this.applyFunctionToCell();
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    case wijmo.Key.Escape:
                        this.hideFunctionList();
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                }
            }
        });
        // bind the keyup event handler for the edit cell.
        this.addEventListener(edt, 'keyup', (e: KeyboardEvent) => {
            if ((e.keyCode > 40 || e.keyCode < 32) && e.keyCode !== wijmo.Key.Tab && e.keyCode !== wijmo.Key.Escape) {
                setTimeout(() => {
                    this.showFunctionList(edt);
                }, 0);
            }
        });
    }

    // Add new sheet into the flexsheet.
    private _addSheet(sheetName?: string, rows?: number, cols?: number, pos?: number, grid?: wijmo.grid.FlexGrid): Sheet {
        let sheet = new Sheet(this, grid, sheetName, rows, cols);

        if (!this.sheets.isValidSheetName(sheet)) {
            sheet._setValidName(this.sheets.getValidSheetName(sheet));
        }

        if (typeof (pos) === 'number') {
            if (pos < 0) {
                pos = 0;
            }
            if (pos >= this.sheets.length) {
                pos = this.sheets.length;
            }
        } else {
            pos = this.sheets.length;
        }
        this.sheets.insert(pos, sheet);

        sheet.nameChanged.addHandler((sender, e) => {
            if (!this._loadingFromWorkbook) {
                this._updateDefinedNameWithSheetRefUpdating(e.oldValue, e.newValue);
                this._updateFormulasWithNameUpdating(e.oldValue, e.newValue);
            }
        });

        return sheet;
    }

    // Show specific sheet in the FlexSheet.
    private _showSheet(index: number) {
        if (!this.sheets || !this.sheets.length || index >= this.sheets.length
            || index < 0 || index === this.selectedSheetIndex
            || (this.sheets[index] && !this.sheets[index].visible)) {
            return;
        }

        this.beginUpdate();

        // finish any pending edits in the old sheet data.
        this.finishEditing();
        this._clearCalcEngine();
        this._isCopying = true;

        // save the old sheet data
        if (this.selectedSheetIndex > -1 && this.selectedSheetIndex < this.sheets.length && !this._sheets._exchangingPosition) {
            this._copyingTo = true;
            try {
                this._copyTo(this.sheets[this.selectedSheetIndex]);
            } finally {
                this._copyingTo = false;
            }
        }

        // show the new sheet data
        if (this.sheets[index]) {
            this._selectedSheetIndex = index;
            this._copyFrom(this.sheets[index]);
        }
        this._isCopying = false;

        this.endUpdate();

        this._filter.closeEditor();
    }

    // Current sheet changed event handler.
    private _selectedSheetChange(sender: any, e: wijmo.PropertyChangedEventArgs) {
        this.beginUpdate();
        this._showSheet(e.newValue);
        this._clearCalcCacheOnRefresh = false; // Don't clear the cache on upcoming refresh, it's has been cleared in the _showSheet method.
        this.endUpdate();
        this.onSelectedSheetChanged(e);
    }

    // SheetCollection changed event handler.
    private _sourceChange(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs<Sheet>) {
        var item: Sheet;

        if (this.sheets._exchangingPosition) {
            return;
        }

        this.beginUpdate();

        if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add || e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
            item = e.item;
            item._attachOwner(this);
            if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add) {
                this._addingSheet = true;
                if (e.index <= this.selectedSheetIndex) {
                    this._selectedSheetIndex += 1;
                }
            } else {
                if (e.index === this.selectedSheetIndex) {
                    this._copyFrom(e.item);
                }
            }
            this.selectedSheetIndex = e.index;
        } else if (e.action === wijmo.collections.NotifyCollectionChangedAction.Reset) {
            for (var i = 0; i < this.sheets.length; i++) {
                item = this.sheets[i];
                item._attachOwner(this);
            }
            if (this.sheets.length > 0) {
                if (this.selectedSheetIndex === 0) {
                    this._copyFrom(this.selectedSheet);
                }
                this.selectedSheetIndex = 0;
            } else {
                this.rows.clear();
                this.columns.clear();
                this._selectedSheetIndex = -1;
            }
        } else {
            if (this.sheets.length > 0) {
                if (this.selectedSheetIndex === e.index) { // the current sheet is removed, change it
                    this._selectedSheetIndex = -1;
                    this.sheets._setCurrentIdx(-1);
                    this.selectedSheetIndex = e.index > this.sheets.length - 1 ? this.sheets.length - 1 : e.index
                } else {
                    if (this.selectedSheetIndex > e.index) {
                        // The current sheet remains the same, just update idicies silently.
                        this._selectedSheetIndex--;
                        this.sheets._setCurrentIdx(this._selectedSheetIndex);
                    }
                }
            } else {
                this.rows.clear();
                this.columns.clear();
                this._selectedSheetIndex = -1;
            }
        }

        this._updateDivContainerHeight(this.isTabHolderVisible); // #146881

        this.endUpdate();
    }

    // Sheet visible changed event handler.
    private _sheetVisibleChange(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (!e.item.visible) {
            if (e.index === this.selectedSheetIndex) {
                if (this.selectedSheetIndex === this.sheets.length - 1) {
                    this.selectedSheetIndex = e.index - 1;
                } else {
                    this.selectedSheetIndex = e.index + 1;
                }
            }
        }
    }

    // apply the styles for the selected cells.
    private _applyStyleForCell(rowIndex: number, colIndex: number, cellStyle: ICellStyle, forceApply: boolean = false) {
        var row = this.rows[rowIndex],
            currentCellStyle: ICellStyle,
            mergeRange: wijmo.grid.CellRange,
            cellIndex: number;

        // Will ignore the cells in the HeaderRow. 
        if (row == null || row instanceof HeaderRow || (!row.isVisible && !forceApply)) {
            return;
        }

        cellIndex = rowIndex * this.columns.length + colIndex;

        // Handle the merged range style.
        mergeRange = this.selectedSheet._getMergedRange(rowIndex, colIndex);
        if (mergeRange) {
            cellIndex = mergeRange.topRow * this.columns.length + mergeRange.leftCol;
        }

        currentCellStyle = this.selectedSheet._styledCells[cellIndex];
        // Add new cell style for the cell.
        if (!currentCellStyle) {
            this.selectedSheet._styledCells[cellIndex] = {
                className: cellStyle.className,
                textAlign: cellStyle.textAlign,
                verticalAlign: cellStyle.verticalAlign,
                fontStyle: cellStyle.fontStyle,
                fontWeight: cellStyle.fontWeight,
                fontFamily: cellStyle.fontFamily,
                fontSize: cellStyle.fontSize,
                textDecoration: cellStyle.textDecoration,
                backgroundColor: cellStyle.backgroundColor,
                color: cellStyle.color,
                format: cellStyle.format,
                whiteSpace: cellStyle.whiteSpace,
                borderTopColor: cellStyle.borderTopColor,
                borderTopStyle: cellStyle.borderTopStyle,
                borderTopWidth: cellStyle.borderTopWidth,
                borderBottomColor: cellStyle.borderBottomColor,
                borderBottomStyle: cellStyle.borderBottomStyle,
                borderBottomWidth: cellStyle.borderBottomWidth,
                borderLeftColor: cellStyle.borderLeftColor,
                borderLeftStyle: cellStyle.borderLeftStyle,
                borderLeftWidth: cellStyle.borderLeftWidth,
                borderRightColor: cellStyle.borderRightColor,
                borderRightStyle: cellStyle.borderRightStyle,
                borderRightWidth: cellStyle.borderRightWidth
            }
        } else {
            // Update the cell style.
            // Note: null or "" should reset the CSS property.
            Object.keys(cellStyle).forEach(k => {
                let v = cellStyle[k];

                switch (k) {
                    case 'className':
                        currentCellStyle[k] = v === 'normal' || v === null || v === ''
                            ? undefined
                            : v || currentCellStyle[k];
                        break;

                    case 'fontStyle':
                    case 'fontWeight':
                    case 'textDecoration':
                        currentCellStyle[k] = v === 'none' || v === null || v === ''
                            ? undefined
                            : v || currentCellStyle[k];
                        break;

                    default:
                        currentCellStyle[k] = v === null || v === ''
                            ? undefined
                            : v || currentCellStyle[k];
                }
            });
        }
    }

    // Check the format states for the cells of the selection.
    private _checkCellFormat(rowIndex: number, colIndex: number, formatState: IFormatState) {
        //return;
        var cellIndex = rowIndex * this.columns.length + colIndex,
            mergeRange: wijmo.grid.CellRange,
            cellStyle: ICellStyle;

        if (!this.selectedSheet) {
            return;
        }

        mergeRange = this.selectedSheet._getMergedRange(rowIndex, colIndex);
        if (mergeRange) {
            formatState.isMergedCell = true;
            cellIndex = mergeRange.topRow * this.columns.length + mergeRange.leftCol;
        }
        cellStyle = <ICellStyle>this.selectedSheet._styledCells[cellIndex];

        // get the format states for the cells of the selection.
        if (cellStyle) {
            formatState.isBold = formatState.isBold || cellStyle.fontWeight === 'bold';
            formatState.isItalic = formatState.isItalic || cellStyle.fontStyle === 'italic';
            formatState.isUnderline = formatState.isUnderline || cellStyle.textDecoration === 'underline';
        }

        // get text align state for the selected cells.
        if (rowIndex === this.selection.row && colIndex === this.selection.col) {
            if (cellStyle && cellStyle.textAlign) {
                formatState.textAlign = cellStyle.textAlign
            } else if (colIndex > -1) {
                formatState.textAlign = (<wijmo.grid.Column>this.columns[colIndex]).getAlignment() || formatState.textAlign;
            }
        }
    }

    // Reset the merged range.
    /*private*/ _resetMergedRange(range: wijmo.grid.CellRange): boolean {
        var rowIndex: number,
            colIndex: number,
            mergeCellIndex: number,
            mergedCell: wijmo.grid.CellRange,
            mergedCellExists = false;

        for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
            for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                mergedCell = this.selectedSheet._getMergedRange(rowIndex, colIndex)
                if (mergedCell) {
                    mergedCellExists = true;
                    mergeCellIndex = this.selectedSheet._mergedRanges.indexOf(mergedCell);
                    this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                }
            }
        }

        return mergedCellExists;
    }

    // update the styledCells hash and mergedRange hash for add\delete rows.
    private _updateCellsForUpdatingRow(originalRowCount: number, index: number, count: number, isDelete?: boolean) {
        //return;
        var startIndex: number,
            cellIndex: number,
            newCellIndex: number,
            cellStyle: ICellStyle,
            mergeRange: wijmo.grid.CellRange,
            mergeCellIndex: number,
            effectIndex: number,
            originalCellCount = originalRowCount * this.columns.length;

        // update for deleting rows.
        if (isDelete) {
            startIndex = index * this.columns.length;
            for (cellIndex = startIndex; cellIndex < originalCellCount; cellIndex++) {
                newCellIndex = cellIndex - count * this.columns.length;

                // Update the styledCells hash
                cellStyle = this.selectedSheet._styledCells[cellIndex];
                if (cellStyle) {
                    // if the cell is behind the delete cell range, we should update the cell index for the cell to store the style.
                    // if the cell is inside the delete cell range, it need be deleted directly.
                    if (cellIndex >= (index + count) * this.columns.length) {
                        this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                    }
                    delete this.selectedSheet._styledCells[cellIndex];
                }
            }
        } else {
            // Update for adding rows.
            startIndex = index * this.columns.length - 1;
            for (cellIndex = originalCellCount - 1; cellIndex > startIndex; cellIndex--) {
                newCellIndex = cellIndex + this.columns.length * count;

                // Update the styledCells hash
                cellStyle = this.selectedSheet._styledCells[cellIndex];
                if (cellStyle) {
                    this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                    delete this.selectedSheet._styledCells[cellIndex];
                }
            }
        }

        if (this.selectedSheet._mergedRanges.length > 0) {
            for (mergeCellIndex = this.selectedSheet._mergedRanges.length - 1; mergeCellIndex >= 0; mergeCellIndex--) {
                mergeRange = this.selectedSheet._mergedRanges[mergeCellIndex];
                if (isDelete) {
                    effectIndex = index + count - 1
                    if (effectIndex < mergeRange.topRow) {
                        mergeRange.row -= count;
                        mergeRange.row2 -= count;
                    } else if (effectIndex >= mergeRange.topRow && effectIndex <= mergeRange.bottomRow) {
                        if (index <= mergeRange.topRow && effectIndex >= mergeRange.bottomRow) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else if (index < mergeRange.topRow) {
                            if (mergeRange.row <= mergeRange.row2) {
                                mergeRange.row += index - mergeRange.topRow;
                                mergeRange.row2 -= count;
                            } else {
                                mergeRange.row2 += index - mergeRange.topRow;
                                mergeRange.row -= count;
                            }
                        } else if (index === mergeRange.topRow && count === mergeRange.rowSpan) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else {
                            if (mergeRange.row <= mergeRange.row2) {
                                mergeRange.row2 -= count;
                            } else {
                                mergeRange.row -= count;
                            }
                        }
                    } else {
                        if (index <= mergeRange.topRow) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else if (index <= mergeRange.bottomRow) {
                            if (mergeRange.row <= mergeRange.row2) {
                                mergeRange.row2 += index - mergeRange.bottomRow - 1;
                            } else {
                                mergeRange.row += index - mergeRange.bottomRow - 1;
                            }
                        }
                    }
                } else {
                    if (index <= mergeRange.topRow) {
                        mergeRange.row += count;
                        mergeRange.row2 += count;
                    } else if (index > mergeRange.topRow && index <= mergeRange.bottomRow) {
                        if (mergeRange.row <= mergeRange.row2) {
                            mergeRange.row2 += count;
                        } else {
                            mergeRange.row += count;
                        }
                    }
                }
            }
        }
    }

    // update styledCells hash and mergedRange hash for add\delete columns.
    private _updateCellsForUpdatingColumn(originalColumnCount: number, index: number, count: number, isDelete?: boolean) {
        var cellIndex: number,
            newCellIndex: number,
            cellStyle: ICellStyle,
            rowIndex: number,
            columnIndex: number,
            mergeRange: wijmo.grid.CellRange,
            mergeCellIndex: number,
            effectIndex: number,
            originalCellCount = this.rows.length * originalColumnCount;

        // Update for deleting columns.
        if (isDelete) {
            for (cellIndex = index; cellIndex < originalCellCount; cellIndex++) {
                rowIndex = Math.floor(cellIndex / originalColumnCount);
                columnIndex = cellIndex % originalColumnCount;
                newCellIndex = cellIndex - (count * (rowIndex + (columnIndex >= index ? 1 : 0)));

                // Update the styledCells hash
                cellStyle = this.selectedSheet._styledCells[cellIndex];
                if (cellStyle) {
                    // if the cell is outside the delete cell range, we should update the cell index for the cell to store the style.
                    // otherwise it need be deleted directly.
                    if (columnIndex < index || columnIndex >= index + count) {
                        this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                    }
                    delete this.selectedSheet._styledCells[cellIndex];
                }
            }
        } else {
            // Update for adding columns.
            for (cellIndex = originalCellCount - 1; cellIndex >= index; cellIndex--) {
                rowIndex = Math.floor(cellIndex / originalColumnCount);
                columnIndex = cellIndex % originalColumnCount;
                newCellIndex = rowIndex * count + cellIndex + (columnIndex >= index ? count : 0);

                // Update the styledCells hash
                cellStyle = this.selectedSheet._styledCells[cellIndex];
                if (cellStyle) {
                    this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                    delete this.selectedSheet._styledCells[cellIndex];
                }
            }
        }

        if (this.selectedSheet._mergedRanges.length > 0) {
            for (mergeCellIndex = this.selectedSheet._mergedRanges.length - 1; mergeCellIndex >= 0; mergeCellIndex--) {
                mergeRange = this.selectedSheet._mergedRanges[mergeCellIndex];
                if (isDelete) {
                    effectIndex = index + count - 1
                    if (effectIndex < mergeRange.leftCol) {
                        mergeRange.col -= count;
                        mergeRange.col2 -= count;
                    } else if (effectIndex >= mergeRange.leftCol && effectIndex <= mergeRange.rightCol) {
                        if (index <= mergeRange.leftCol && effectIndex >= mergeRange.rightCol) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else if (index < mergeRange.leftCol) {
                            if (mergeRange.col <= mergeRange.col2) {
                                mergeRange.col += index - mergeRange.leftCol;
                                mergeRange.col2 -= count;
                            } else {
                                mergeRange.col2 += index - mergeRange.leftCol;
                                mergeRange.col -= count;
                            }
                        } else if (index === mergeRange.leftCol && count === mergeRange.columnSpan) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else {
                            if (mergeRange.col <= mergeRange.col2) {
                                mergeRange.col2 -= count;
                            } else {
                                mergeRange.col -= count;
                            }
                        }
                    } else {
                        if (index <= mergeRange.leftCol) {
                            this.selectedSheet._mergedRanges.splice(mergeCellIndex, 1);
                        } else if (index <= mergeRange.rightCol) {
                            if (mergeRange.col <= mergeRange.col2) {
                                mergeRange.col2 -= mergeRange.rightCol - index + 1;
                            } else {
                                mergeRange.col -= mergeRange.rightCol - index + 1;
                            }
                        }
                    }
                } else {
                    if (index <= mergeRange.leftCol) {
                        mergeRange.col += count;
                        mergeRange.col2 += count;
                    } else if (index > mergeRange.leftCol && index <= mergeRange.rightCol) {
                        if (mergeRange.col <= mergeRange.col2) {
                            mergeRange.col2 += count;
                        } else {
                            mergeRange.col += count;
                        }
                    }
                }
            }
        }
    }

    // Clone object.
    _cloneObject(source: any): any {
        var copy: any;

        if (null == source || !wijmo.isObject(source)) {
            return source;
        }

        // Handle Object
        copy = {};
        for (var attr in source) {
            if (source.hasOwnProperty(attr)) {
                if (source[attr] != null) {
                    if (source[attr].clone) {
                        copy[attr] = source[attr].clone();
                    } else {
                        copy[attr] = this._cloneObject(source[attr]);
                    }
                }
            }
        }
        return copy;
    }

    // Evaluate specified formula for flexsheet.
    private _evaluate(formula: string, format?: string, sheet?: Sheet, rowIndex?: number, columnIndex?: number): any {
        if (formula && formula.length > 1 && this._enableFormulas) {
            formula = formula[0] === '=' ? formula : '=' + formula;

            return this._calcEngine.evaluate(formula, format, sheet, rowIndex, columnIndex);
        }

        return formula;
    }

    // Clears the list and re-set the items owner if they added to another list.
    private _clearAndCheckItemsOwner(list: wijmo.grid.RowColCollection): void {
        if (list && list.length) {
            let itemOwner = <wijmo.grid.RowColCollection>(<wijmo.grid.RowCol>list[0])._list;
            list.clear(); // will set list[i]._list to null
            this._checkCollectionOwner(itemOwner); // in case the items were shared between to lists (grids) (TFS 381994)
        }
    }

    _checkCollectionOwner(col: wijmo.grid.RowColCollection, undefOnly = true): void {
        if (col && col.length && (!(<wijmo.grid.RowCol>col[0])._list || (!undefOnly && ((<wijmo.grid.RowCol>col[0])._list != col)))) {
            for (let i = 0, cnt = col.length; i < cnt; i++) {
                (<wijmo.grid.RowCol>col[i])._list = col;
            }
        }
    }

    _checkCollectionsOwner() {
        this._checkCollectionOwner(this.columns, false);
        this._checkCollectionOwner(this.rows, false);
        this._checkCollectionOwner(this.columnFooters.columns, false);
        this._checkCollectionOwner(this.columnFooters.rows, false);
        this._checkCollectionOwner(this.columnHeaders.columns, false);
        this._checkCollectionOwner(this.columnHeaders.rows, false);
        this._checkCollectionOwner(this.rowHeaders.columns, false);
        this._checkCollectionOwner(this.rowHeaders.rows, false);
    }

    // Copy the current flex sheet to the flexgrid of current sheet.
    _copyTo(sheet: Sheet) {
        var originAutoGenerateColumns = sheet.grid.autoGenerateColumns,
            currentSel: wijmo.grid.CellRange;

        this.beginUpdate();

        sheet._storeRowSettings();
        this._selHdl.extendedSelection.clear(); // 385092 [Case 2]. Will be restored in _copyFrom from selectionRanges.
        currentSel = this.selection.clone();
        sheet.grid.select(new wijmo.grid.CellRange(), false);

        this._clearAndCheckItemsOwner(sheet.grid.rows);
        this._clearAndCheckItemsOwner(sheet.grid.columns);
        this._clearAndCheckItemsOwner(sheet.grid.columnHeaders.columns);
        this._clearAndCheckItemsOwner(sheet.grid.rowHeaders.rows);

        sheet._ownerHeaderRowRemoved = this._headerRowRemoved;
        if (this.itemsSource) {
            sheet.grid.autoGenerateColumns = false;
            sheet.itemsSource = this.itemsSource;
            if (this.collectionView.sortDescriptions.length > 0) {
                sheet._dataView = (<wijmo.collections.CollectionView>this.collectionView)._view.slice();
            }
            sheet.grid.collectionView.beginUpdate();
        } else {
            sheet.itemsSource = null;
            for (var rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                sheet.grid.rows.push(this.rows[rowIndex]);
            }
        }

        sheet._sortList = this.sortManager._committedList.slice();

        sheet._getFilterSetting();

        for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
            sheet.grid.columns.push(this.columns[colIndex]);
        }
        if (sheet.grid.collectionView) {
            this._resetMappedColumns(sheet.grid);
            sheet.grid.collectionView.endUpdate(true);
        }

        sheet.grid.autoGenerateColumns = originAutoGenerateColumns;
        sheet.grid.frozenRows = this.frozenRows;
        sheet.grid.frozenColumns = this.frozenColumns;
        sheet.grid.allowAddNew = this.allowAddNew;
        if (this.newRowAtTop != null) {
            sheet.grid.newRowAtTop = this.newRowAtTop;
        }
        sheet.grid.select(currentSel, false);

        sheet._scrollPosition = this.scrollPosition;

        this._setFlexSheetToDirty();

        this.endUpdate();
    }

    // Copy the flexgrid of current sheet to flexsheet.
    _copyFrom(sheet: Sheet, needUpdate = true) {
        var originAutoGenerateColumns = this.autoGenerateColumns,
            colIndex: number,
            rowIndex: number,
            i: number,
            rowSetting: any,
            column: wijmo.grid.Column,
            currentSel: wijmo.grid.CellRange,
            isHeaderRow: boolean;

        this._isCopying = true;
        this._dragable = false;

        if (needUpdate) {
            this.beginUpdate();
        }

        this.itemsSource = null;
        this._clearAndCheckItemsOwner(this.rows); // TFS 381994. this.rows.clear();
        this._clearAndCheckItemsOwner(this.columns); // this.columns.clear();
        this._clearAndCheckItemsOwner(this.columnHeaders.columns); // this.columnHeaders.columns.clear();
        this._clearAndCheckItemsOwner(this.rowHeaders.rows); // this.rowHeaders.rows.clear()
        currentSel = sheet.grid.selection.clone();
        this._selHdl.select(new wijmo.grid.CellRange(), false);

        if (sheet.selectionRanges.length > 1 && (this.selectionMode === wijmo.grid.SelectionMode.CellRange || this.selectionMode === wijmo.grid.SelectionMode.MultiRange)) {
            this._enableMulSel = true;
        }

        this._headerRowRemoved = sheet._ownerHeaderRowRemoved;
        if (sheet.itemsSource) {
            this.autoGenerateColumns = false;
            this._ignoreBindGrid = wijmo.isArray(sheet.itemsSource) || sheet.itemsSource instanceof wijmo.collections.CollectionView; // #414410 (the _bindGrid will be called by this.collectionView.endUpdate() below)
            this.itemsSource = sheet.itemsSource;
            this._ignoreBindGrid = false;
            this.collectionView.beginUpdate();
        } else {
            for (rowIndex = 0; rowIndex < sheet.grid.rows.length; rowIndex++) {
                this.rows.push(sheet.grid.rows[rowIndex]);
            }
        }

        this.sortManager.sortDescriptions.sourceCollection = sheet._sortList.slice();
        this.sortManager._committedList = sheet._sortList.slice();

        for (colIndex = 0; colIndex < sheet.grid.columns.length; colIndex++) {
            column = sheet.grid.columns[colIndex];
            column.isRequired = false;
            this.columns.push(column);
        }

        if (this.collectionView) {
            // Restore sortDescriptions to display sort icons after changing the current sheet (TFS 399979).
            if (sheet.grid.collectionView) {
                this.collectionView.sortDescriptions.clear();
                sheet.grid.collectionView.sortDescriptions.forEach(sd => this.collectionView.sortDescriptions.push(sd));
            }

            this.collectionView.moveCurrentToPosition(this._getCvIndex(currentSel.row));
            this._resetMappedColumns(this);
            this.collectionView.endUpdate(true);
            if (sheet._dataView) {
                (<wijmo.collections.CollectionView>this.collectionView)._view = sheet._dataView;
                (<wijmo.collections.CollectionView>this.collectionView)._pgView = (<wijmo.collections.CollectionView>this.collectionView)._getPageView();
                if (!(this.itemsSource instanceof wijmo.collections.CollectionView)) {
                    (<wijmo.collections.CollectionView>sheet.grid.collectionView)._view = sheet._dataView;
                    (<wijmo.collections.CollectionView>sheet.grid.collectionView)._pgView = (<wijmo.collections.CollectionView>sheet.grid.collectionView)._getPageView();
                }
                this._bindGrid(false);
                sheet.grid['_bindGrid'](false);
            }
            this.collectionView.collectionChanged.addHandler((sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
                if (e.action === wijmo.collections.NotifyCollectionChangedAction.Reset) {
                    setTimeout(() => {
                        this.invalidate();
                    }, 10);
                }
            }, this);
        }

        if (this.rows.length && this.columns.length) {
            this._selHdl.select(currentSel, false);

            // Restore FlexGrid's selectedRanges property from sheet.selectionRanges.
            if (this.selectionMode === wijmo.grid.SelectionMode.MultiRange) {
                this._selHdl.extendedSelection.beginUpdate();
                for (var i = 0; i < sheet.selectionRanges.length; i++) {
                    if (!this.selection.equals(sheet.selectionRanges[i])) {
                        this._selHdl.extendedSelection.push(sheet.selectionRanges[i]);
                    }
                }
                this._selHdl.extendedSelection.endUpdate();
            }
        }

        sheet._applyFilterSetting();

        for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            rowSetting = sheet._rowSettings[rowIndex];
            if (rowSetting) {
                let row = this.rows[rowIndex];
                isHeaderRow = row instanceof HeaderRow;
                row.height = rowSetting.height;
                row.allowMerging = rowSetting.allowMerging;
                row.visible = rowSetting.visible;
                if (row instanceof wijmo.grid.GroupRow) {
                    (<wijmo.grid.GroupRow>row).isCollapsed = !!rowSetting.isCollapsed;
                }
                row.isSelected = !!rowSetting.isSelected;
                row.isReadOnly = isHeaderRow || !!rowSetting.readOnly;
            }
        }

        this.autoGenerateColumns = originAutoGenerateColumns;
        this.frozenRows = sheet.grid.frozenRows;
        this.frozenColumns = sheet.grid.frozenColumns;

        this._isCopying = false;

        if (needUpdate) {
            // Fixes the problem when extra cells from the previous sheet, that are still in this.cells.hostElement, affect the size of the current .cells panel
            // which leads to the appearance of a white space from the previous sheet's scroll bar. (TFS 455474 + TFS 422181, QA update).
            // This hack should solve the problem without updating the control again, so there will be no performance drop here.
            // Note: to reproduce this issue the bottom row should be partially visible.
            this.cells.hostElement.style.overflow = 'hidden';

            this._setFlexSheetToDirty();
            this.endUpdate();

            if (this._addingSheet) { // #414700
                clearTimeout(this._toRefresh);
                this._toRefresh = setTimeout(() => {
                    this._setFlexSheetToDirty();
                    this.invalidate();
                }, wijmo.Control._REFRESH_INTERVAL);
                this._addingSheet = false;
            }
        }

        this._updateScrollPos = true; // Layout may not be ready, restore the scrollPosition later, in onUpdatedLayout.
        //this.scrollPosition = sheet._scrollPosition;
        //this._ptScrl = sheet._scrollPosition;
    }

    private _updateScrollPos = false;
    onUpdatedLayout(e?: wijmo.EventArgs) {
        if (this._updateScrollPos) {
            this.cells.hostElement.style.overflow = ''; // just for sure, see above.

            this._updateScrollPos = false;
            let ss = this.selectedSheet;
            if (ss) {
                this.scrollPosition = ss._scrollPosition;
                this._ptScrl = ss._scrollPosition;
            }
        }

        super.onUpdatedLayout(e);
    }

    // Reset the _mappedColumns hash for the flexgrid. 
    private _resetMappedColumns(flex: wijmo.grid.FlexGrid) {
        var col: wijmo.grid.Column,
            sds: wijmo.collections.ObservableArray,
            i = 0;

        flex._mappedColumns = null;
        if (flex.collectionView) {
            sds = flex.collectionView.sortDescriptions;
            for (; i < sds.length; i++) {
                col = flex.columns.getColumn(sds[i].property);
                if (col && col.dataMap) {
                    if (!flex._mappedColumns) {
                        flex._mappedColumns = {};
                    }
                    flex._mappedColumns[col.binding] = col.dataMap;
                }
            }
        }
    }

    // Load the workbook instance to the flexsheet
    private _loadFromWorkbook(wb: wijmo.xlsx.Workbook) {
        if (wb.sheets == null || wb.sheets.length === 0) {
            return;
        }

        this._loadingFromWorkbook = true;
        this.beginUpdate();
        this.clear();

        this._reservedContent = wb.reservedContent;
        if (wb.colorThemes && wb.colorThemes.length > 0) {
            for (let i = 0; i < this._colorThemes.length; i++) {
                this._colorThemes[i] = wb.colorThemes[i];
            }
        }

        for (let i = 0, cnt = wb.sheets.length; i < cnt; i++) {
            if (i > 0) {
                this.addUnboundSheet();
            }

            let sheet = this.selectedSheet,
                grid = sheet.grid,
                info: wijmo.grid.xlsx.IExtendedSheetInfo = grid['wj_sheetInfo'] = {} as any;

            wijmo.grid.xlsx.FlexGridXlsxConverter.load(grid, wb, { sheetIndex: i, includeColumnHeaders: false });
            sheet.name = info.name;
            sheet.visible = info.visible;
            sheet._styledCells = info.styledCells;
            if (info.mergedRanges) {
                for (let ci = 0; ci < info.mergedRanges.length; ci++) {
                    sheet._mergedRanges[ci] = info.mergedRanges[ci];
                }
                info.mergedRanges = sheet._mergedRanges;
            }

            this._copyFrom(sheet);

            if (info.tables && info.tables.length > 0) {
                for (let ti = 0; ti < info.tables.length; ti++) {
                    this._parseFromWorkbookTable(info.tables[ti], sheet);
                }
            }
        }

        if (wb.activeWorksheet != null && wb.activeWorksheet > -1 && wb.activeWorksheet < this.sheets.length) {
            this.selectedSheetIndex = wb.activeWorksheet;
        } else {
            this.selectedSheetIndex = 0;
        }

        if (wb.definedNames) {
            wb.definedNames.forEach(name => {
                this.definedNames.push(new DefinedName(this, name.name, name.value, name.sheetName));
            });
        }

        this.endUpdate();
        this._loadingFromWorkbook = false;
        this.onLoaded();
    }

    // Save the flexsheet to the workbook instance.
    private _saveToWorkbook(options: IFlexSheetXlsxOptions): wijmo.xlsx.Workbook {
        if (this.sheets.length === 0) {
            throw 'The flexsheet is empty.';
        }

        let includeFormulaValues = !!(options && options.includeFormulaValues),
            wb = this._saveSheetToWorkbook(0, includeFormulaValues);

        for (let i = 1; i < this.sheets.length; i++) {
            let tmp = this._saveSheetToWorkbook(i, includeFormulaValues);
            wb._addWorkSheet(tmp.sheets[0], i);
        }

        wb.activeWorksheet = this.selectedSheetIndex;
        wb.reservedContent = this._reservedContent;

        for (let i = 0; i < this.definedNames.length; i++) {
            let item = this.definedNames[i],
                def = new wijmo.xlsx.DefinedName();

            def.name = item.name;
            def.value = item.value;
            def.sheetName = item.sheetName;
            wb.definedNames.push(def);
        }

        let themes = this._colorThemes;
        if (themes && themes.length > 0) {
            for (let i = 0; i < themes.length; i++) {
                wb.colorThemes[i] = themes[i];
            }
        }

        return wb;
    }

    private _saveSheetToWorkbook(sheetIdx: number, includeFormulaValues: boolean): wijmo.xlsx.Workbook {
        let sheet = this.sheets[sheetIdx],
            info = sheet.grid['wj_sheetInfo'] as wijmo.grid.xlsx.IExtendedSheetInfo;

        if (includeFormulaValues) {
            info.evaluateFormula = (formula: string) => this.evaluate(formula, null, sheet);
        }

        if (this.selectedSheetIndex === sheetIdx) {
            sheet._storeRowSettings();
            if (!(sheet.itemsSource instanceof wijmo.collections.CollectionView)) {
                this._copyRowsToSelectedSheet();
            }
        }

        sheet._setRowSettings();

        if (sheet.tables.length > 0) {
            info.tables = []
            for (let i = 0; i < sheet.tables.length; i++) {
                info.tables.push(this._parseToWorkbookTable(sheet.tables[i]));
            }
        }

        let wb = wijmo.grid.xlsx.FlexGridXlsxConverter.save(sheet.grid, { sheetName: sheet.name, sheetVisible: sheet.visible, includeColumnHeaders: false });
        this._checkTableHeaderRow(sheet.tables, wb);

        info.evaluateFormula = null;

        return wb;
    }

    // mouseDown event handler.
    // This event handler for handling selecting columns
    private _mouseDown(e: MouseEvent) {
        var userAgent = window.navigator.userAgent,
            ht = this.hitTest(e),
            currentRange: wijmo.grid.CellRange,
            rowIndex: number;

        if (this.selectedSheet) {
            this.selectedSheet._scrollPosition = this.scrollPosition;
        }

        if (ht.cellType !== wijmo.grid.CellType.None) {
            this._isClicking = true;
        }

        if (this._dragable) {
            this._isDragging = true;

            this._draggingMarker = document.createElement('div');
            wijmo.setCss(this._draggingMarker, {
                position: 'absolute',
                display: 'none',
                borderStyle: 'dotted',
                cursor: 'move'
            });
            document.body.appendChild(this._draggingMarker);

            this._draggingTooltip = new wijmo.Tooltip();
            this._draggingCells = this.selection;

            if (this.selectedSheet) {
                this.selectedSheet.selectionRanges.clear();
            }

            this.onDraggingRowColumn(new DraggingRowColumnEventArgs(this.selection.clone(), this._draggingRow, e.shiftKey));

            e.preventDefault();
            return;
        }

        if (this.hostElement.style.cursor === 'crosshair' && this._fillingMarker == null) {
            this.finishEditing();
            this._fillingData = true;
            this._fillingPoint = new wijmo.Point(e.clientX - this.scrollPosition.x, e.clientY - this.scrollPosition.y);
            this._fillingSource = this.selection.clone();
            this._fillingMarker = document.createElement('div');
            wijmo.setCss(this._fillingMarker, {
                position: 'absolute',
                display: 'none',
                border: '2px dashed'
            });
            this._root.appendChild(this._fillingMarker);

            this._fillingTooltip = new wijmo.Tooltip();

            e.preventDefault();
            return;
        }

        if (this.selectionMode === wijmo.grid.SelectionMode.CellRange || this.selectionMode === wijmo.grid.SelectionMode.MultiRange) {
            if (e.ctrlKey) {
                if (!this._enableMulSel) {
                    this._enableMulSel = true;
                    if (this.selectedSheet.selectionRanges.length === 0) {
                        this.selectedSheet.selectionRanges.push(this.selection);
                    }
                }
            } else {
                if (ht.cellType !== wijmo.grid.CellType.None) {
                    if (this.selectedSheet) {
                        if (e.which === 3 && this._isCellSelected(ht.row, ht.col)) {
                            // User clicks with RMB on a selected cell.
                        } else {
                            this.selectedSheet.selectionRanges.clear();
                        }
                    }

                    if (this._enableMulSel) {
                        this.refresh(false);
                    }
                    this._enableMulSel = false;
                }
            }
        } else {
            this._enableMulSel = false;
            if (this.selectedSheet) {
                this.selectedSheet.selectionRanges.clear();
            }
        }

        this._htDown = ht;

        // If there is no rows or columns in the flexsheet, we don't need deal with anything in the mouse down event(TFS 122628)
        if (this.rows.length === 0 || this.columns.length === 0) {
            return;
        }

        if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
            this._hideContextMenu();
        }

        if (e.which === 3) {
            return;
        }

        if (this.selectionMode !== wijmo.grid.SelectionMode.CellRange && this.selectionMode !== wijmo.grid.SelectionMode.MultiRange) {
            return;
        }

        if (ht.cellType !== wijmo.grid.CellType.ColumnHeader && ht.cellType !== wijmo.grid.CellType.None) {
            return;
        }

        if (ht.col > -1 && this.columns[ht.col].isSelected) {
            return;
        }

        if (!wijmo.hasClass(<HTMLElement>e.target, 'wj-cell') || ht.edgeRight) {
            return;
        }

        this._columnHeaderClicked = true;

        rowIndex = this.itemsSource && this.rows[0] && !this.rows[0].isVisible ? 1 : 0;

        (<HTMLElement>e.target).focus(); // TFS 380457, 347559

        if (e.shiftKey) {
            this._multiSelectColumns(ht);
        } else {
            currentRange = new wijmo.grid.CellRange(rowIndex, ht.col, this.rows.length - 1, ht.col);
            if (e.which === 3 && this.selection.contains(currentRange)) {
                return;
            }
            this.select(currentRange);
        }

        if (this._eCt.children[rowIndex] && this._eCt.children[rowIndex].children[ht.col]) {
            (<HTMLElement>this._eCt.children[rowIndex].children[ht.col]).focus();
        }
    }

    // mouseMove event handler
    // This event handler for handling multiple selecting columns.
    private _mouseMove(e: MouseEvent) {
        var ht = this.hitTest(e),
            selection = this.selection.clone(),
            rowCnt = this.rows.length,
            colCnt = this.columns.length,
            cursor = this.hostElement.style.cursor,
            isTopRow: boolean;

        if (this.rows.length === 0 || this.columns.length === 0) {
            this._dragable = false;
            if (ht.cellType === wijmo.grid.CellType.Cell) {
                this.hostElement.style.cursor = 'default';
            }
            return;
        }

        if (this._isDragging) {
            this.hostElement.style.cursor = 'move';
            this._showDraggingMarker(e);
            return;
        }

        if (!this._isClicking && ht.edgeBottom && ht.edgeRight && ht.row === selection.bottomRow && ht.col === selection.rightCol && this.allowAutoFill) {
            this.hostElement.style.cursor = 'crosshair';
            return;
        }

        if (this._fillingData) {
            this.hostElement.style.cursor = 'crosshair';
            this._showFillMarker(e);
            return;
        }

        if (this.itemsSource) {
            isTopRow = selection.topRow === 0 || selection.topRow === 1;
        } else {
            isTopRow = selection.topRow === 0;
        }

        if (!this._isClicking && selection && ht.cellType !== wijmo.grid.CellType.None && !this.itemsSource && !this.isReadOnly && this._enableDragDrop && (!this._filter || !this._filter._isEditorOpened())) {
            this._draggingColumn = isTopRow && selection.bottomRow === rowCnt - 1;
            this._draggingRow = selection.leftCol === 0 && selection.rightCol === colCnt - 1;
            if (ht.cellType === wijmo.grid.CellType.Cell) {
                if (this._draggingColumn && (((ht.col === selection.leftCol - 1 || ht.col === selection.rightCol) && ht.edgeRight)
                    || (ht.row === rowCnt - 1 && ht.edgeBottom))) {
                    cursor = 'move';
                }
                if (this._draggingRow && !this._containsGroupRows(selection) && ((ht.row === selection.topRow - 1 || ht.row === selection.bottomRow) && ht.edgeBottom
                    || (ht.col === colCnt - 1 && ht.edgeRight))) {
                    cursor = 'move';
                }
            } else if (ht.cellType === wijmo.grid.CellType.ColumnHeader) {
                if (ht.edgeBottom) {
                    if (this._draggingColumn && (ht.col >= selection.leftCol && ht.col <= selection.rightCol)) {
                        cursor = 'move';
                    } else if (this._draggingRow && selection.topRow === 0) {
                        cursor = 'move';
                    }
                }
            } else if (ht.cellType === wijmo.grid.CellType.RowHeader) {
                if (ht.edgeRight) {
                    if (this._draggingColumn && selection.leftCol === 0) {
                        cursor = 'move';
                    } else if (this._draggingRow && (ht.row >= selection.topRow && ht.row <= selection.bottomRow) && !this._containsGroupRows(selection)) {
                        cursor = 'move';
                    }
                }
            }

            if (cursor === 'move') {
                this._dragable = true;
            } else {
                this._dragable = false;
            }

            this.hostElement.style.cursor = cursor;
        }

        if (!this._htDown || !this._htDown.panel) {
            return;
        }

        ht = new wijmo.grid.HitTestInfo(this._htDown.panel, e);

        this._multiSelectColumns(ht);

        if (ht.cellType === wijmo.grid.CellType.Cell) {
            this.scrollIntoView(ht.row, ht.col);
        }
    }

    // mouseUp event handler.
    // This event handler for resetting the variable for handling multiple select columns
    private _mouseUp(e: MouseEvent) {
        try {
            if (this._isDragging) {
                if (this._dropRange && !this._draggingCells.equals(this._dropRange)) {
                    let beginEventArgs = new DroppingRowColumnEventArgs(this._dropRange.clone(), this._draggingRow),
                        endEventArgs = new wijmo.CancelEventArgs();
                    this.onBeginDroppingRowColumn(beginEventArgs);
                    endEventArgs.cancel = beginEventArgs.cancel;
                    if (!beginEventArgs.cancel) {
                        this._handleDropping(e);
                    }
                    this.onEndDroppingRowColumn(endEventArgs);
                }
            } else if (this._fillingData) {
                let fillOperation = AutoFillOperation.CopyContent,
                    range = this._fillingRange,
                    source = this._fillingSource,
                    isFillRow: boolean,
                    undoAction: _FillAction;
                this._orgCellSettings = null;
                if (this._fillingRange && this._fillingRange.isValid) {
                    wijmo.assert(this._canDoFillOperation(), 'To do this, all the merged cells need be the same size.');
                    isFillRow = source.leftCol === range.leftCol && source.rightCol === range.rightCol;
                    if (isFillRow) {
                        if (source.row !== source.row2) {
                            fillOperation = AutoFillOperation.FillSeries;
                        }
                    } else {
                        if (source.col !== source.col2) {
                            fillOperation = AutoFillOperation.FillSeries;
                        }
                    }
                    this._orgCellSettings = this._getCellSettingsForFill();
                    undoAction = new _FillAction(this, this._fillingSource);
                    this._undoStack._addAction(undoAction);
                    fillOperation = AutoFillOperation.CopyFormat | fillOperation;
                    if (this._fillData(fillOperation)) {
                        let host = this._root.appendChild(document.createElement('div'));
                        let smartTag = new _SmartTag(host, this, fillOperation, {
                            operationSelected: (sender: _SmartTag) => {
                                this._fillData(sender.operation);
                            },
                            cancelled: () => {
                                host.parentElement.removeChild(host);
                                smartTag.dispose();
                                smartTag = null;
                                this._undoStack._updateCurrentAction(_FillAction);
                                this.focus();
                            }
                        });
                    }
                }
            }
        } finally {
            if (this._isDragging) {
                this._draggingCells = null;
                this._dropRange = null;

                document.body.removeChild(this._draggingMarker);
                this._draggingMarker = null;

                this._draggingTooltip.hide();
                this._draggingTooltip = null;

                this._isDragging = false;
                this._draggingColumn = false;
                this._draggingRow = false;
            }

            if (this._htDown && this._htDown.cellType !== wijmo.grid.CellType.None && this.selectedSheet) {
                if (this._htDown.cellType === wijmo.grid.CellType.TopLeft && (this.selectionMode === wijmo.grid.SelectionMode.CellRange || this.selectionMode === wijmo.grid.SelectionMode.MultiRange)) {
                    this.selection = new wijmo.grid.CellRange(0, 0, this.rows.length - 1, this.columns.length - 1);
                }

                if (this.selection.isValid) {
                    this.selectedSheet._addSelection(this.selection);
                }
                this._enableMulSel = false;
            }

            if (this._fillingData) {
                this._fillingData = false;
                this._fillingPoint = null;
                this._fillingRange = null;
                this._root.removeChild(this._fillingMarker);
                this._fillingMarker = null;
                this._fillingTooltip.hide();
                this._fillingTooltip = null;
                this.hostElement.style.cursor = 'default';
            }

            this._isClicking = false;
            this._columnHeaderClicked = false;
            this._htDown = null;
        }
    }

    // Click event handler.
    private _click() {
        var userAgent = window.navigator.userAgent;

        // When click in the body, we also need hide the context menu.
        if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
            this._hideContextMenu();
        }
        setTimeout(() => {
            this.hideFunctionList();
        }, 200);
    }

    // touch start event handler for iOS device
    private _touchStart(e: any) {
        if (!wijmo.hasClass(e.target, 'wj-context-menu-item')) {
            this._hideContextMenu();
        }
        this._longClickTimer = setTimeout(() => {
            var ht: wijmo.grid.HitTestInfo;
            if (!this._isDescendant(this._divContainer, e.target)) {
                return;
            }
            ht = this.hitTest(e);
            if (ht && ht.cellType !== wijmo.grid.CellType.None && !this._resizing) {
                if (ht.cellType === wijmo.grid.CellType.TopLeft) {
                    this.selection = new wijmo.grid.CellRange(0, 0, this.rows.length - 1, this.columns.length - 1);
                    if (this.selectedSheet) {
                        this.selectedSheet.selectionRanges.clear();
                        this.selectedSheet.selectionRanges.push(this.selection);
                    }
                }
                this._contextMenu.show(null, new wijmo.Point(e.pageX + 10, e.pageY + 10));
            }
        }, 500);
    }

    // touch end event handler for iOS device
    private _touchEnd() {
        clearTimeout(this._longClickTimer);
    }

    // Keydown event handler.
    private _keydown(e: KeyboardEvent) {
        if ((this._isDescendant(this.hostElement, e.target) || this.hostElement === e.target) && !this._edtHdl.activeEditor && !(e.target instanceof HTMLInputElement)) {
            // Delete cell content when user presses Delete or Back keys
            // (Mac keyboards don't have a Delete key, so honor Back here as well)
            if (this.selectedSheet && (e.keyCode === wijmo.Key.Delete || e.keyCode === wijmo.Key.Back)) {
                this._delSeletionContent(e);
                e.preventDefault();
            }
        }

        // If the context menu of the FlexSheet is visible, we'll handle the 'keydown' event for the context menu. 
        let visibleMenu = this._contextMenu.visible ? this._contextMenu : (this._tabHolder.sheetControl._contextMenu.visible ? this._tabHolder.sheetControl._contextMenu : null);
        if (visibleMenu) {
            if (e.keyCode === wijmo.Key.Down) {
                visibleMenu.moveToNext();
            }
            if (e.keyCode === wijmo.Key.Up) {
                visibleMenu.moveToPrev();
            }
            if (e.keyCode === wijmo.Key.Home) {
                visibleMenu.moveToFirst();
            }
            if (e.keyCode === wijmo.Key.End) {
                visibleMenu.moveToLast();
            }
            if (e.keyCode === wijmo.Key.Enter) {
                visibleMenu.handleContextMenu();
            }
            e.preventDefault();
        }
    }

    // Show the dragging marker while the mouse moving.
    private _showDraggingMarker(e: MouseEvent) {
        var hitInfo = new wijmo.grid.HitTestInfo(this.cells, e),
            selection = this.selection,
            colCnt = this.columns.length,
            rowCnt = this.rows.length,
            scrollOffset = this._cumulativeScrollOffset(this.hostElement),
            rootBounds = this._root.getBoundingClientRect(),
            rootOffsetX = rootBounds.left + scrollOffset.x,
            rootOffsetY = rootBounds.top + scrollOffset.y,
            hitCellBounds: wijmo.Rect,
            selectionCnt: number,
            hit: number,
            height: number,
            width: number,
            rootSize: number,
            i: number,
            content: string,
            css: any;

        this.scrollIntoView(hitInfo.row, hitInfo.col);

        if (this._draggingColumn) {
            selectionCnt = selection.rightCol - selection.leftCol + 1;
            hit = hitInfo.col;
            width = 0;

            if (hit < 0 || hit + selectionCnt > colCnt) {
                hit = colCnt - selectionCnt;
            }

            hitCellBounds = this.cells.getCellBoundingRect(0, hit);
            rootSize = this._root.offsetHeight - this._eCHdr.offsetHeight;
            height = this.cells.height;
            height = height > rootSize ? rootSize : height;
            for (i = 0; i < selectionCnt; i++) {
                width += this.columns[hit + i].renderSize;
            }

            content = FlexSheet.convertNumberToAlpha(hit) + ' : ' + FlexSheet.convertNumberToAlpha(hit + selectionCnt - 1);

            if (this._dropRange) {
                this._dropRange.col = hit;
                this._dropRange.col2 = hit + selectionCnt - 1;
            } else {
                this._dropRange = new wijmo.grid.CellRange(0, hit, this.rows.length - 1, hit + selectionCnt - 1);
            }
        } else if (this._draggingRow) {
            selectionCnt = selection.bottomRow - selection.topRow + 1;
            hit = hitInfo.row;
            height = 0;

            if (hit < 0 || hit + selectionCnt > rowCnt) {
                hit = rowCnt - selectionCnt;
            }

            hitCellBounds = this.cells.getCellBoundingRect(hit, 0);
            rootSize = this._root.offsetWidth - this._eRHdr.offsetWidth;
            for (i = 0; i < selectionCnt; i++) {
                height += this.rows[hit + i].renderSize;
            }
            width = this.cells.width;
            width = width > rootSize ? rootSize : width;

            content = (hit + 1) + ' : ' + (hit + selectionCnt);

            if (this._dropRange) {
                this._dropRange.row = hit;
                this._dropRange.row2 = hit + selectionCnt - 1;
            } else {
                this._dropRange = new wijmo.grid.CellRange(hit, 0, hit + selectionCnt - 1, this.columns.length - 1);
            }
        }

        if (!hitCellBounds) {
            return;
        }

        css = {
            display: 'inline',
            zIndex: '9999',
            opacity: 0.5,
            top: hitCellBounds.top - (this._draggingColumn ? this._ptScrl.y : 0) + scrollOffset.y,
            left: hitCellBounds.left - (this._draggingRow ? this._ptScrl.x : 0) + scrollOffset.x,
            height: height,
            width: width
        }

        hitCellBounds.top = hitCellBounds.top - (this._draggingColumn ? this._ptScrl.y : 0);
        hitCellBounds.left = hitCellBounds.left - (this._draggingRow ? this._ptScrl.x : 0);
        if (this.rightToLeft && this._draggingRow) {
            css.left = css.left - width + hitCellBounds.width + 2 * this._ptScrl.x;
            hitCellBounds.left = hitCellBounds.left + 2 * this._ptScrl.x;
        }

        if (this._draggingRow) {
            if (rootOffsetX + this._eRHdr.offsetWidth !== css.left || rootOffsetY + this._root.offsetHeight + 1 < css.top + css.height) {
                return;
            }
        } else {
            if (rootOffsetY + this._eCHdr.offsetHeight !== css.top || rootOffsetX + this._root.offsetWidth + 1 < css.left + css.width) {
                return;
            }
        }

        wijmo.setCss(this._draggingMarker, css);

        this._draggingTooltip.show(this.hostElement, content, hitCellBounds);
    }

    // Show the filling data marker
    private _showFillMarker(e: MouseEvent) {
        let ht = new wijmo.grid.HitTestInfo(this.cells, e);

        if (ht.row > -1 && ht.col > -1) {
            let hDistance = e.clientX - this.scrollPosition.x - this._fillingPoint.x,
                vDistance = e.clientY - this.scrollPosition.y - this._fillingPoint.y,
                row: number,
                col: number,
                row2: number,
                col2: number;

            if (Math.abs(hDistance) >= Math.abs(vDistance)) {
                row = this._fillingSource.topRow;
                row2 = this._fillingSource.bottomRow;
                col = hDistance >= 0 ? this._fillingSource.leftCol : ht.col;
                col2 = hDistance >= 0 ? ht.col : this._fillingSource.rightCol;
            } else {
                row = vDistance >= 0 ? this._fillingSource.topRow : ht.row;
                row2 = vDistance >= 0 ? ht.row : this._fillingSource.bottomRow;
                col = this._fillingSource.leftCol;
                col2 = this._fillingSource.rightCol;
            }

            this._fillingRange = new wijmo.grid.CellRange(row, col, row2, col2);

            this._updateFillingMarquee();

            this.scrollIntoView(ht.row, ht.col);

            this._showFillTooltip();
        }
    }

    _updateMarquee() {
        super._updateMarquee();
        this._updateFillingMarquee(); // WJM-20195, update filling marquee when scrolling
    }

    private _updateFillingMarquee() {
        let el = this._fillingMarker,
            rng = this._fillingRange;

        if (!el || !rng) {
            return;
        }

        let topLeft = this.cells.getCellBoundingRect(rng.row, rng.col, true),
            btmRight = this.cells.getCellBoundingRect(rng.row2, rng.col2, true);

        // adjust for frozen rows
        if (this.rows.frozen) {
            let fzr = Math.min(this.rows.length, this.rows.frozen),
                rcf = this.cells.getCellBoundingRect(fzr - 1, 0, true);
            if (rng.topRow >= fzr && topLeft.top < rcf.bottom) {
                topLeft.top = rcf.bottom;
            }
            if (rng.bottomRow >= fzr && btmRight.bottom < rcf.bottom) {
                btmRight.height = rcf.bottom - btmRight.top;
            }
        }

        // adjust for frozen columns
        if (this.columns.frozen) {
            let fzc = Math.min(this.columns.length, this.columns.frozen),
                rcf = this.cells.getCellBoundingRect(0, fzc - 1, true);
            if (this.rightToLeft) {
                if (rng.leftCol >= fzc && topLeft.right > rcf.left) {
                    topLeft.left = rcf.left - topLeft.width;
                }
                if (rng.rightCol >= fzc && btmRight.left > rcf.left) {
                    btmRight.left = rcf.left;
                }
            } else {
                if (rng.leftCol >= fzc && topLeft.left < rcf.right) {
                    topLeft.left = rcf.right;
                }
                if (rng.rightCol >= fzc && btmRight.right < rcf.right) {
                    btmRight.width = rcf.right - btmRight.left;
                }
            }
        }

        let host = this.cells.hostElement;

        wijmo.setCss(el, {
            left: topLeft.left + host.offsetLeft,
            top: topLeft.top + host.offsetTop,
            width: btmRight.right - topLeft.left,
            height: btmRight.bottom - topLeft.top,
            display: '',
            zIndex: (this.frozenRows || this.frozenColumns) ? '3' : ''
        });
    }

    // Show the tooltip for drag and fill operation
    private _showFillTooltip() {
        let source = this._fillingSource,
            range = this._fillingRange,
            tooltipRect: wijmo.Rect,
            isFillRow: boolean,
            cellDiff: number,
            srcIndex: number,
            isCopyContent: boolean,
            srcData: any,
            series: _IFillSeries,
            content: string,
            srcCellStyle: ICellStyle,
            srcMergedCell: wijmo.grid.CellRange,
            column: wijmo.grid.Column,
            format: string;

        this._fillingTooltip.hide();
        if (range.equals(source) || source.contains(range)) {
            return;
        }

        isFillRow = source.leftCol === range.leftCol && source.rightCol === range.rightCol;
        if (isFillRow) {
            if (range.bottomRow > source.bottomRow) {
                tooltipRect = this.cells.getCellBoundingRect(range.bottomRow, range.rightCol);
                tooltipRect.top = tooltipRect.bottom + 10;
                cellDiff = range.bottomRow - source.topRow;
            } else {
                tooltipRect = this.cells.getCellBoundingRect(range.topRow, range.rightCol);
                tooltipRect.top += 10;
                cellDiff = range.topRow - source.topRow;
            }
            tooltipRect.left = tooltipRect.right;
            srcIndex = cellDiff % source.rowSpan;
            if (srcIndex < 0) {
                srcIndex += source.rowSpan;;
            }
            if (source.row === source.row2) {
                isCopyContent = true;
            }
            srcCellStyle = this.selectedSheet.getCellStyle(source.topRow + srcIndex, source.leftCol);
            srcMergedCell = this.getMergedRange(this.cells, source.topRow + srcIndex, source.leftCol);
            column = this.columns[source.leftCol];
            format = srcCellStyle ? (srcCellStyle.format ? srcCellStyle.format : column.format) : column.format;
            if (isCopyContent) {
                content = this.getCellData(srcMergedCell ? srcMergedCell.topRow : source.topRow + srcIndex, source.leftCol, false);
                if (_isFormula(content)) {
                    content = '';
                } else {
                    content = wijmo.Globalize.format(content, format);
                }
            } else {
                srcData = this.getCellData(source.topRow + srcIndex, source.leftCol, false);
                if (wijmo.isNumber(srcData) || wijmo.isDate(srcData)) {
                    series = this._getFillSeries(isFillRow, 0, srcIndex);
                    if (series) {
                        content = this._getFillData(srcIndex, cellDiff, source, isFillRow, series, true);
                        content = wijmo.Globalize.format(content, format);
                    } else {
                        content = '';
                    }
                } else {
                    content = srcData;
                    if (_isFormula(content)) {
                        content = '';
                    }
                }
            }
        } else {
            if (range.rightCol > source.rightCol) {
                tooltipRect = this.cells.getCellBoundingRect(range.bottomRow, range.rightCol);
                cellDiff = range.rightCol - source.leftCol;
            } else {
                tooltipRect = this.cells.getCellBoundingRect(range.bottomRow, range.leftCol);
                cellDiff = range.leftCol - source.leftCol;
            }
            tooltipRect.top = tooltipRect.bottom + 10;
            srcIndex = cellDiff % source.columnSpan;
            if (srcIndex < 0) {
                srcIndex += source.columnSpan;;
            }
            if (source.col === source.col2) {
                isCopyContent = true;
            }
            srcCellStyle = this.selectedSheet.getCellStyle(source.topRow, source.leftCol + srcIndex);
            srcMergedCell = this.getMergedRange(this.cells, source.topRow, source.leftCol + srcIndex);
            column = this.columns[source.leftCol + srcIndex];
            format = srcCellStyle ? (srcCellStyle.format ? srcCellStyle.format : column.format) : column.format;
            if (isCopyContent) {
                content = this.getCellData(source.topRow, srcMergedCell ? srcMergedCell.leftCol : source.leftCol + srcIndex, false);
                if (_isFormula(content)) {
                    content = '';
                } else {
                    content = wijmo.Globalize.format(content, format);
                }
            } else {
                srcData = this.getCellData(source.topRow, source.leftCol + srcIndex, false);
                if (wijmo.isNumber(srcData) || wijmo.isDate(srcData)) {
                    series = this._getFillSeries(isFillRow, 0, srcIndex);
                    if (series) {
                        content = this._getFillData(srcIndex, cellDiff, source, isFillRow, series, true);
                        content = wijmo.Globalize.format(content, format);
                    } else {
                        content = '';
                    }
                } else {
                    content = srcData;
                    if (_isFormula(content)) {
                        content = '';
                    }
                }
            }
        }

        tooltipRect.top += this.cells.hostElement.offsetTop;
        this._fillingTooltip.show(this.hostElement, content, tooltipRect);
    }

    // Gets the array of CellRange objects that define the current (multi)selection in a uniform manner.
    // In contrast to selectedSheet.selectionRanges and this.selectedRanges, it also supports the ListBox selection mode.
    private _selections(): wijmo.grid.CellRange[] {
        var r: wijmo.grid.CellRange[] = [];

        if (!this.selectedSheet) {
            return r;
        }

        if (this.selectionMode == wijmo.grid.SelectionMode.ListBox) {
            for (let i = 0, len = this.rows.length, lastCol = this.columns.length - 1; i < len; i++) {
                if ((<wijmo.grid.Row>this.rows[i]).isSelected) {
                    r.push(new wijmo.grid.CellRange(i, 0, i, lastCol));
                }
            }
        } else {
            r = this.selectedSheet.selectionRanges.slice();
        }

        return r.length ? r : [this.selection];
    }

    private _isCellSelected(r: number, c: number) {
        return this._selections().some(v => v.contains(r, c));
    }

    private _isColumnSelected(c: number) {
        return this._selections().some(v => v.containsColumn(c) && v.row === 0 && v.row2 === this.rows.length - 1);
    }

    private _isRowSelected(r: number) {
        return this._selections().some(v => v.containsRow(r) && v.col === 0 && v.col2 === this.columns.length - 1);
    }

    // Handle dropping rows or columns.
    private _handleDropping(e: MouseEvent) {
        var srcRowIndex: number,
            srcColIndex: number,
            desRowIndex: number,
            desColIndex: number,
            moveCellsAction: _MoveCellsAction,
            affectedFormulas: any,
            affectedDefinedNames: any;

        if (!this.selectedSheet || !this._draggingCells || !this._dropRange || this._containsMergedCells(this._draggingCells) || this._containsMergedCells(this._dropRange)) {
            return;
        }

        this._clearCalcEngine();
        if ((this._draggingColumn && this._draggingCells.leftCol > this._dropRange.leftCol)
            || (this._draggingRow && this._draggingCells.topRow > this._dropRange.topRow)) {
            // Handle changing the columns or rows position.
            if (e.shiftKey) {
                if (!this._allowExchangeCells(this._draggingRow, true)) {
                    console.warn('Can not complete operation: You are attempting to change a position of table row or column in a way that is not allowed.');
                    return;
                }
                if (this._draggingColumn) {
                    desColIndex = this._dropRange.leftCol;
                    for (srcColIndex = this._draggingCells.leftCol; srcColIndex <= this._draggingCells.rightCol; srcColIndex++) {
                        this.columns.moveElement(srcColIndex, desColIndex);
                        desColIndex++;
                    }
                    this._exchangeTableColumns(true);
                } else if (this._draggingRow) {
                    desRowIndex = this._dropRange.topRow;
                    for (srcRowIndex = this._draggingCells.topRow; srcRowIndex <= this._draggingCells.bottomRow; srcRowIndex++) {
                        this.rows.moveElement(srcRowIndex, desRowIndex);
                        desRowIndex++;
                    }
                }
                this._exchangeCellStyle(true);
            } else {
                // Handle moving or copying the cell content.
                if (this.undoStack.stackSize > 0) {
                    moveCellsAction = new _MoveCellsAction(this, this._draggingCells, this._dropRange, e.ctrlKey);
                }
                desRowIndex = this._dropRange.topRow;
                for (srcRowIndex = this._draggingCells.topRow; srcRowIndex <= this._draggingCells.bottomRow; srcRowIndex++) {
                    desColIndex = this._dropRange.leftCol;
                    for (srcColIndex = this._draggingCells.leftCol; srcColIndex <= this._draggingCells.rightCol; srcColIndex++) {
                        this._moveCellContent(srcRowIndex, srcColIndex, desRowIndex, desColIndex, e.ctrlKey);
                        if (this._draggingColumn && desRowIndex === this._dropRange.topRow) {
                            this.columns[desColIndex].dataType = this.columns[srcColIndex].dataType ? this.columns[srcColIndex].dataType : wijmo.DataType.Object;
                            this.columns[desColIndex].align = this.columns[srcColIndex].align;
                            this.columns[desColIndex].format = this.columns[srcColIndex].format;
                            if (!e.ctrlKey) {
                                this.columns[srcColIndex].dataType = wijmo.DataType.Object;
                                this.columns[srcColIndex].align = null;
                                this.columns[srcColIndex].format = null;
                            }
                        }
                        desColIndex++;
                    }
                    desRowIndex++;
                }

                if (this._draggingColumn && !e.ctrlKey) {
                    desColIndex = this._dropRange.leftCol;
                    for (srcColIndex = this._draggingCells.leftCol; srcColIndex <= this._draggingCells.rightCol; srcColIndex++) {
                        this._updateColumnFiler(srcColIndex, desColIndex);
                        desColIndex++;
                    }
                }
            }
        } else if ((this._draggingColumn && this._draggingCells.leftCol < this._dropRange.leftCol)
            || (this._draggingRow && this._draggingCells.topRow < this._dropRange.topRow)) {
            // Handle changing the columns or rows position.
            if (e.shiftKey) {
                if (!this._allowExchangeCells(this._draggingRow, false)) {
                    console.warn('Can not complete operation: You are attempting to change a position of table row or column in a way that is not allowed.');
                    return;
                }
                if (this._draggingColumn) {
                    desColIndex = this._dropRange.rightCol;
                    for (srcColIndex = this._draggingCells.rightCol; srcColIndex >= this._draggingCells.leftCol; srcColIndex--) {
                        this.columns.moveElement(srcColIndex, desColIndex);
                        desColIndex--;
                    }
                    this._exchangeTableColumns(false);
                } else if (this._draggingRow) {
                    desRowIndex = this._dropRange.bottomRow;
                    for (srcRowIndex = this._draggingCells.bottomRow; srcRowIndex >= this._draggingCells.topRow; srcRowIndex--) {
                        this.rows.moveElement(srcRowIndex, desRowIndex);
                        desRowIndex--;
                    }
                }
                this._exchangeCellStyle(false);
            } else {
                // Handle moving or copying the cell content.
                if (this.undoStack.stackSize > 0) {
                    moveCellsAction = new _MoveCellsAction(this, this._draggingCells, this._dropRange, e.ctrlKey);
                }
                desRowIndex = this._dropRange.bottomRow;
                for (srcRowIndex = this._draggingCells.bottomRow; srcRowIndex >= this._draggingCells.topRow; srcRowIndex--) {
                    desColIndex = this._dropRange.rightCol;
                    for (srcColIndex = this._draggingCells.rightCol; srcColIndex >= this._draggingCells.leftCol; srcColIndex--) {
                        this._moveCellContent(srcRowIndex, srcColIndex, desRowIndex, desColIndex, e.ctrlKey);
                        if (this._draggingColumn && desRowIndex === this._dropRange.bottomRow) {
                            this.columns[desColIndex].dataType = this.columns[srcColIndex].dataType ? this.columns[srcColIndex].dataType : wijmo.DataType.Object;
                            this.columns[desColIndex].align = this.columns[srcColIndex].align;
                            this.columns[desColIndex].format = this.columns[srcColIndex].format;
                            if (!e.ctrlKey) {
                                this.columns[srcColIndex].dataType = wijmo.DataType.Object;
                                this.columns[srcColIndex].align = null;
                                this.columns[srcColIndex].format = null;
                            }
                        }
                        desColIndex--;
                    }
                    desRowIndex--;
                }

                if (this._draggingColumn && !e.ctrlKey) {
                    desColIndex = this._dropRange.rightCol;
                    for (srcColIndex = this._draggingCells.rightCol; srcColIndex >= this._draggingCells.leftCol; srcColIndex--) {
                        this._updateColumnFiler(srcColIndex, desColIndex);
                        desColIndex--;
                    }
                }
            }
        }

        if (!e.ctrlKey) {
            affectedFormulas = this._updateFormulaForDropping(e.shiftKey);
            affectedDefinedNames = this._updateNamedRangesForDropping(e.shiftKey);
        }
        if (moveCellsAction && moveCellsAction.saveNewState()) {
            moveCellsAction._affectedFormulas = affectedFormulas;
            moveCellsAction._affectedDefinedNameVals = affectedDefinedNames;
            this._undoStack._addAction(moveCellsAction);
        }
        if (this._undoStack._pendingAction) {
            this._undoStack._pendingAction['_affectedFormulas'] = affectedFormulas;
            this._undoStack._pendingAction['_affectedDefinedNameVals'] = affectedDefinedNames;
        }

        this.select(this._dropRange);
        this.selectedSheet._addSelection(this.selection);
        // Ensure that the host element of FlexSheet get focus after dropping. (TFS 142888)
        this.hostElement.focus();
    }

    // Move the content and style of the source cell to the destination cell.
    private _moveCellContent(srcRowIndex: number, srcColIndex: number, desRowIndex: number, desColIndex: number, isCopyContent: boolean) {
        var val = this.getCellData(srcRowIndex, srcColIndex, false),
            srcCellIndex = srcRowIndex * this.columns.length + srcColIndex,
            desCellIndex = desRowIndex * this.columns.length + desColIndex,
            srcCellStyle = this.selectedSheet._styledCells[srcCellIndex],
            desColName: string,
            needUpdateDesCellData = true;

        let desTable = this.selectedSheet.findTable(desRowIndex, desColIndex);
        if (desTable && desTable._isHeaderRow(desRowIndex)) {
            let desTableRange = desTable.getRange(),
                desTableColumns = desTable.getColumns(),
                desTableColIndex = desColIndex - desTableRange.leftCol;

            desColName = desTableColumns[desTableColIndex].name;
            if (val == null || val === '') {
                needUpdateDesCellData = false;
            } else {
                desTableColumns[desTableColIndex].name = val;
            }
        }

        if (needUpdateDesCellData) {
            if (isCopyContent && _isFormula(val) && (desCellIndex - srcCellIndex !== 0)) {
                try {
                    let exp = this._calcEngine._parse(val);
                    if (exp._moveCellRangeExp(this.selectedSheetIndex, new wijmo.grid.CellRange(srcRowIndex, srcColIndex), new wijmo.grid.CellRange(desRowIndex, desColIndex), false, true)) {
                        val = '=' + exp._getStringExpression();
                    }
                } catch (e) {
                }
            }
            this.setCellData(desRowIndex, desColIndex, val);
        } else {
            needUpdateDesCellData = true;
        }

        // Copy the cell style of the source cell to the destination cell.
        if (srcCellStyle) {
            this.selectedSheet._styledCells[desCellIndex] = this._cloneObject(srcCellStyle);
        } else {
            delete this.selectedSheet._styledCells[desCellIndex];
        }

        // If we just move the columns or the rows, we need remove the content and styles of the cells in the columns or the rows.
        if (!isCopyContent) {
            delete this.selectedSheet._styledCells[srcCellIndex];

            let srcTable = this.selectedSheet.findTable(srcRowIndex, srcColIndex);
            if (srcTable) {
                let srcTableRange = srcTable._getTableRange();
                if (srcTable === desTable && srcRowIndex === desRowIndex) {
                    if (srcTable._isHeaderRow(srcRowIndex)) {
                        let srcTableColIndex = srcColIndex - srcTableRange.leftCol;
                        srcTable._updateColumnName(srcTableColIndex, desColName);
                        return;
                    }
                }

                if (srcTable.showHeaderRow && srcRowIndex === srcTableRange.topRow) {
                    return;
                }
            }
            this.setCellData(srcRowIndex, srcColIndex, null);
        } else {
            let srcTable = this.selectedSheet.findTable(srcRowIndex, srcColIndex);
            if (srcTable) {
                let srcTableRange = srcTable._getTableRange();
                if (srcTable === desTable && srcRowIndex === desRowIndex) {
                    if (srcTable._isHeaderRow(srcRowIndex)) {
                        let srcTableColIndex = srcColIndex - srcTableRange.leftCol;
                        srcTable._updateColumnName(srcTableColIndex, val);
                    }
                }
            }
        }
    }

    // Check whether exchanging rows/columns operation is allowed.
    private _allowExchangeCells(isRow: boolean, isReverse: boolean): boolean {
        let tables = this.selectedSheet.tables,
            tableIndex: number,
            table: Table,
            tableRange: wijmo.grid.CellRange,
            draggingRange: wijmo.grid.CellRange,
            droppingRange: wijmo.grid.CellRange,
            cellSpan: number;

        for (tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            table = tables[tableIndex];
            if (isRow) {
                tableRange = table.getRange(TableSection.Data);
                cellSpan = this._draggingCells.rowSpan;
                draggingRange = new wijmo.grid.CellRange(this._draggingCells.topRow, tableRange.leftCol, this._draggingCells.bottomRow, tableRange.rightCol);
                droppingRange = new wijmo.grid.CellRange(this._dropRange.topRow, tableRange.leftCol, this._dropRange.bottomRow, tableRange.rightCol);
            } else {
                tableRange = table.getRange();
                cellSpan = this._draggingCells.columnSpan;
                draggingRange = new wijmo.grid.CellRange(tableRange.topRow, this._draggingCells.leftCol, tableRange.bottomRow, this._draggingCells.rightCol);
                droppingRange = new wijmo.grid.CellRange(tableRange.topRow, this._dropRange.leftCol, tableRange.bottomRow, this._dropRange.rightCol);

            }
            if ((tableRange.intersects(draggingRange) && !tableRange.contains(draggingRange))
                || (tableRange.intersects(droppingRange) && !tableRange.contains(droppingRange))
                || (tableRange.contains(draggingRange) && !tableRange.contains(droppingRange))
                || (!tableRange.contains(draggingRange) && tableRange.contains(droppingRange))) {
                return false;
            }
        }

        return true;
    }

    // Exchange the table columns.
    private _exchangeTableColumns(isReverse: boolean) {
        let tables = this.selectedSheet.tables,
            tableIndex: number,
            table: Table,
            tableRange: wijmo.grid.CellRange,
            srcColIndex: number,
            desColIndex: number,
            tableColumn: TableColumn,
            count: number;

        for (tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            table = tables[tableIndex];
            tableRange = table.getRange();
            if (tableRange.leftCol <= this._draggingCells.leftCol && tableRange.rightCol >= this._draggingCells.rightCol) {
                srcColIndex = (isReverse ? this._draggingCells.leftCol : this._draggingCells.rightCol) - tableRange.leftCol;
                desColIndex = (isReverse ? this._dropRange.leftCol : this._dropRange.rightCol) - tableRange.leftCol;
                for (count = 0; count < this._draggingCells.columnSpan; count++) {
                    table._moveColumns(srcColIndex, desColIndex);
                    if (isReverse) {
                        srcColIndex++;
                        desColIndex++;
                    } else {
                        srcColIndex--;
                        desColIndex--;
                    }
                }
            }
        }
    }

    // Exchange the cell style for changing the rows or columns position.
    private _exchangeCellStyle(isReverse: boolean) {
        var rowIndex: number,
            colIndex: number,
            cellIndex: number,
            newCellIndex: number,
            draggingRange: number,
            index = 0,
            srcCellStyles = [];

        // Store the style of the source cells and delete the style of the source cells.
        // Since the stored style will be moved to the destination cells.
        for (rowIndex = this._draggingCells.topRow; rowIndex <= this._draggingCells.bottomRow; rowIndex++) {
            for (colIndex = this._draggingCells.leftCol; colIndex <= this._draggingCells.rightCol; colIndex++) {
                cellIndex = rowIndex * this.columns.length + colIndex;
                if (this.selectedSheet._styledCells[cellIndex]) {
                    srcCellStyles.push(this._cloneObject(this.selectedSheet._styledCells[cellIndex]));
                    delete this.selectedSheet._styledCells[cellIndex];
                } else {
                    srcCellStyles.push(undefined);
                }
            }
        }

        // Adjust the style of the cells that is between the dragging cells and the drop range.
        if (isReverse) {
            if (this._draggingColumn) {
                draggingRange = this._draggingCells.rightCol - this._draggingCells.leftCol + 1;
                for (colIndex = this._draggingCells.leftCol - 1; colIndex >= this._dropRange.leftCol; colIndex--) {
                    for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                        cellIndex = rowIndex * this.columns.length + colIndex;
                        newCellIndex = rowIndex * this.columns.length + colIndex + draggingRange;
                        if (this.selectedSheet._styledCells[cellIndex]) {
                            this.selectedSheet._styledCells[newCellIndex] = this._cloneObject(this.selectedSheet._styledCells[cellIndex]);
                            delete this.selectedSheet._styledCells[cellIndex];
                        } else {
                            delete this.selectedSheet._styledCells[newCellIndex];
                        }
                    }
                }
            } else if (this._draggingRow) {
                draggingRange = this._draggingCells.bottomRow - this._draggingCells.topRow + 1;
                for (rowIndex = this._draggingCells.topRow - 1; rowIndex >= this._dropRange.topRow; rowIndex--) {
                    for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                        cellIndex = rowIndex * this.columns.length + colIndex;
                        newCellIndex = (rowIndex + draggingRange) * this.columns.length + colIndex;
                        if (this.selectedSheet._styledCells[cellIndex]) {
                            this.selectedSheet._styledCells[newCellIndex] = this._cloneObject(this.selectedSheet._styledCells[cellIndex]);
                            delete this.selectedSheet._styledCells[cellIndex];
                        } else {
                            delete this.selectedSheet._styledCells[newCellIndex];
                        }
                    }
                }
            }
        } else {
            if (this._draggingColumn) {
                draggingRange = this._draggingCells.rightCol - this._draggingCells.leftCol + 1;
                for (colIndex = this._draggingCells.rightCol + 1; colIndex <= this._dropRange.rightCol; colIndex++) {
                    for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                        cellIndex = rowIndex * this.columns.length + colIndex;
                        newCellIndex = rowIndex * this.columns.length + colIndex - draggingRange;
                        if (this.selectedSheet._styledCells[cellIndex]) {
                            this.selectedSheet._styledCells[newCellIndex] = this._cloneObject(this.selectedSheet._styledCells[cellIndex]);
                            delete this.selectedSheet._styledCells[cellIndex];
                        } else {
                            delete this.selectedSheet._styledCells[newCellIndex];
                        }
                    }
                }
            } else if (this._draggingRow) {
                draggingRange = this._draggingCells.bottomRow - this._draggingCells.topRow + 1;
                for (rowIndex = this._draggingCells.bottomRow + 1; rowIndex <= this._dropRange.bottomRow; rowIndex++) {
                    for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                        cellIndex = rowIndex * this.columns.length + colIndex;
                        newCellIndex = (rowIndex - draggingRange) * this.columns.length + colIndex;
                        if (this.selectedSheet._styledCells[cellIndex]) {
                            this.selectedSheet._styledCells[newCellIndex] = this._cloneObject(this.selectedSheet._styledCells[cellIndex]);
                            delete this.selectedSheet._styledCells[cellIndex];
                        } else {
                            delete this.selectedSheet._styledCells[newCellIndex];
                        }
                    }
                }
            }
        }

        // Set the stored the style of the source cells to the destination cells.
        for (rowIndex = this._dropRange.topRow; rowIndex <= this._dropRange.bottomRow; rowIndex++) {
            for (colIndex = this._dropRange.leftCol; colIndex <= this._dropRange.rightCol; colIndex++) {
                cellIndex = rowIndex * this.columns.length + colIndex;
                if (srcCellStyles[index]) {
                    this.selectedSheet._styledCells[cellIndex] = srcCellStyles[index];
                } else {
                    delete this.selectedSheet._styledCells[cellIndex];
                }

                index++;
            }
        }
    }

    // Check whether the specific cell range contains merged cells.
    _containsMergedCells(rng: wijmo.grid.CellRange, sheet?: Sheet): boolean {
        var mergeCellIndex: number,
            mergedRange: wijmo.grid.CellRange;

        sheet = sheet || this.selectedSheet;

        if (!sheet) {
            return false;
        }

        for (mergeCellIndex = 0; mergeCellIndex < sheet._mergedRanges.length; mergeCellIndex++) {
            mergedRange = sheet._mergedRanges[mergeCellIndex];
            if (rng.intersects(mergedRange)) {
                return true;
            }
        }

        return false;
    }

    // Multiple select columns processing.
    private _multiSelectColumns(ht: wijmo.grid.HitTestInfo) {
        var range: wijmo.grid.CellRange;

        if (ht && this._columnHeaderClicked) {
            range = new wijmo.grid.CellRange(ht.row, ht.col);

            range.row = this.itemsSource && this.rows[0] && !this.rows[0].isVisible ? 1 : 0;;
            range.row2 = this.rows.length - 1;
            range.col2 = this.selection.col2;

            this.select(range);
        }
    }

    // Gets the absolute offset for the element.
    private _cumulativeOffset(element): wijmo.Point {
        var top = 0, left = 0;

        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return new wijmo.Point(left, top);
    }

    // Gets the absolute scroll offset for the element.
    private _cumulativeScrollOffset(element): wijmo.Point {
        var scrollTop = 0, scrollLeft = 0;

        do {
            scrollTop += element.scrollTop || 0;
            scrollLeft += element.scrollLeft || 0;
            element = element.offsetParent;
        } while (element && !(element instanceof HTMLBodyElement));

        // Chrome and Safari always use document.body.scrollTop, 
        // while IE and Firefox use document.body.scrollTop for quirks mode and document.documentElement.scrollTop for standard mode. 
        // So we need check both the document.body.scrollTop and document.documentElement.scrollTop (TFS 142679)
        scrollTop += document.body.scrollTop || document.documentElement.scrollTop;
        scrollLeft += document.body.scrollLeft || document.documentElement.scrollLeft;

        return new wijmo.Point(scrollLeft, scrollTop);
    }

    // Check whether current hit is within current selection.
    private _checkHitWithinSelection(ht: wijmo.grid.HitTestInfo): boolean {
        var cellIndex: number,
            mergedRange: wijmo.grid.CellRange;

        if (ht != null && ht.cellType === wijmo.grid.CellType.Cell) {
            mergedRange = this.getMergedRange(this.cells, ht.row, ht.col);
            if (mergedRange && mergedRange.contains(this.selection)) {
                return true;
            }

            if (this.selection.row === ht.row && this.selection.col === ht.col) {
                return true;
            }
        }
        return false;
    }

    // Clear the merged cells, styled cells and selection for the empty sheet.
    private _clearForEmptySheet(rowsOrColumns: string) {
        if (this.selectedSheet && this[rowsOrColumns].length === 0 && this._isCopying !== true && this._isUndoing !== true && this._isSorting !== true) {
            this.selectedSheet._mergedRanges.length = 0;
            this.selectedSheet._styledCells = null;
            this.select(new wijmo.grid.CellRange());
        }
    }

    // Check whether the specified cell range contains Group Row.
    private _containsGroupRows(cellRange: wijmo.grid.CellRange): boolean {
        var rowIndex: number,
            row: wijmo.grid.Row;

        for (rowIndex = cellRange.topRow; rowIndex <= cellRange.bottomRow; rowIndex++) {
            row = this.rows[rowIndex];
            if (row instanceof wijmo.grid.GroupRow) {
                return true;
            }
        }
        return false;
    }

    // Delete the content of the selected cells.
    private _delSeletionContent(evt: KeyboardEvent) {
        var selection: wijmo.grid.CellRange,
            evtRange: wijmo.grid.CellRange,
            index: number,
            colIndex: number,
            rowIndex: number,
            tableIndex: number,
            table: Table,
            tableCnt: number,
            bcol: wijmo.grid.Column,
            contentDeleted = false,
            e: wijmo.grid.CellEditEndingEventArgs,
            delAction = new _EditAction(this),
            ecv = this.editableCollectionView,
            ecvUpdating = false,
            sp = this.scrollPosition,
            row: wijmo.grid.Row;

        if (this.isReadOnly) {
            return;
        }

        if (this.allowDelete) {
            if (this.selection.isValid && this.selection.leftCol === 0 && this.selection.rightCol === this.columns.length - 1) {
                this.deleteRows(this._selections());
                return;
            }
        }

        this.beginUpdate();

        if (this.undoStack.stackSize > 0) {
            delAction = new _EditAction(this);
        }

        var selections = this._selections();

        for (index = 0; index < selections.length; index++) {
            selection = selections[index];
            evtRange = new wijmo.grid.CellRange();
            e = new wijmo.grid.CellEditEndingEventArgs(this.cells, evtRange, evt);
            tableCnt = this.selectedSheet.tables.length;
            if (tableCnt > 0) {
                for (tableIndex = tableCnt - 1; tableIndex >= 0; tableIndex--) {
                    table = this.selectedSheet.tables[tableIndex];
                    if (selection.contains(table.getRange())) {
                        if (delAction) {
                            delAction._storeDeletedTables(table);
                        }
                        this.selectedSheet.tables.remove(table);
                    }
                }
            }
            for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                row = this.rows[rowIndex];
                if (row && !row.isReadOnly && (row.visible || (this.selectedSheet._freezeHiddenRows && this.selectedSheet._freezeHiddenRows[rowIndex]))) {
                    for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                        bcol = this._getBindingColumn(this.cells, rowIndex, this.columns[colIndex]);
                        if (bcol && !bcol.isReadOnly && (bcol.isRequired === false || (bcol.isRequired == null && bcol.dataType == wijmo.DataType.String)) && (bcol.visible || (this.selectedSheet._freezeHiddenCols && this.selectedSheet._freezeHiddenCols[colIndex]))) {
                            if (this.getCellData(rowIndex, colIndex, true)) {
                                evtRange.setRange(rowIndex, colIndex);
                                e.cancel = false;
                                if (this.onBeginningEdit(e)) {
                                    if (ecv) {
                                        if (!ecvUpdating) {
                                            ecvUpdating = true;
                                            ecv.beginUpdate();
                                        }
                                        ecv.editItem(row.dataItem);
                                        this._edtHdl._edItem = ecv.currentEditItem;
                                    }
                                    this.setCellData(rowIndex, colIndex, '', true);
                                    contentDeleted = true;
                                    this.onCellEditEnding(e);
                                    this.onCellEditEnded(e);
                                }
                            }
                        }
                    }
                }
            }

            // done updating
            if (ecvUpdating) {
                ecv.endUpdate(true);
                (<wijmo.collections.CollectionView>ecv)._pendingRefresh = false;
                if (selection.rowSpan > 1) {
                    ecv.commitEdit();
                }
            }
        }

        if (contentDeleted && delAction) {
            delAction.saveNewState();
            this._undoStack._addAction(delAction);
        }

        this.selection = selection;
        this.scrollPosition = sp;

        this.endUpdate();
    }

    // Update the affected formulas for inserting/removing row/columns.
    _updateAffectedFormula(index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): any {
        var sheetIndex: number,
            sheet: Sheet,
            grid: wijmo.grid.FlexGrid,
            rowIndex: number,
            colIndex: number,
            newRowIndex: number,
            newColIndex: number,
            cellData: any,
            updatedCellData: string,
            oldFormulas: any[] = [],
            newFormulas: any[] = [],
            currentSel = this.selection.clone();

        this.selectedSheet._storeRowSettings();

        this.beginUpdate();

        for (sheetIndex = 0; sheetIndex < this.sheets.length; sheetIndex++) {
            sheet = this.sheets[sheetIndex];
            grid = sheet.grid;
            for (rowIndex = 0; rowIndex < grid.rows.length; rowIndex++) {
                for (colIndex = 0; colIndex < grid.columns.length; colIndex++) {
                    cellData = grid.getCellData(rowIndex, colIndex, false);
                    if (_isFormula(cellData)) {
                        updatedCellData = this._updateCellRef(cellData, sheetIndex, index, count, isAdding, isRow, affectRange);
                        if (updatedCellData) {
                            oldFormulas.push({
                                sheet: sheet,
                                point: new wijmo.Point(rowIndex, colIndex),
                                formula: cellData
                            });

                            newRowIndex = rowIndex;
                            newColIndex = colIndex;
                            if (sheetIndex === this.selectedSheetIndex) {
                                if (isRow) {
                                    if (rowIndex >= index) {
                                        if (isAdding) {
                                            newRowIndex += count;
                                        } else {
                                            newRowIndex -= count;
                                        }
                                    }
                                } else {
                                    if (colIndex >= index) {
                                        if (isAdding) {
                                            newColIndex += count;
                                        } else {
                                            newColIndex -= count;
                                        }
                                    }
                                }
                                if (!isAdding) {
                                    if ((isRow && rowIndex <= index && rowIndex >= index - count + 1) ||
                                        (!isRow && colIndex <= index && colIndex >= index - count + 1)) {
                                        continue;
                                    }
                                }
                            }
                            grid.setCellData(rowIndex, colIndex, updatedCellData, false);
                            newFormulas.push({
                                sheet: sheet,
                                point: new wijmo.Point(newRowIndex, newColIndex),
                                formula: updatedCellData
                            });
                        }
                    }
                }
            }
        }

        this.selection = currentSel;
        this.endUpdate();

        return {
            oldFormulas: oldFormulas,
            newFormulas: newFormulas
        };
    }

    // Update the affected NamedRanges for inserting/removing row/columns.
    private _updateAffectedNamedRanges(index: number, count: number, isAdding: boolean, isRow: boolean): any {
        var nameIndex: number,
            definedName: DefinedName,
            definedNameVal: any,
            updatedDefinedNameVal: any,
            oldDefinedNameVals: any[] = [],
            newDefinedNameVals: any[] = [];

        for (nameIndex = 0; nameIndex < this.definedNames.length; nameIndex++) {
            definedName = this.definedNames[nameIndex];
            definedNameVal = definedName.value;
            if (!!definedNameVal && wijmo.isString(definedNameVal)) {
                updatedDefinedNameVal = this._updateCellRef(definedNameVal, this.selectedSheetIndex, index, count, isAdding, isRow);
                if (updatedDefinedNameVal) {
                    oldDefinedNameVals.push({
                        name: definedName.name,
                        value: definedNameVal
                    });

                    definedName.value = updatedDefinedNameVal;
                    newDefinedNameVals.push({
                        name: definedName.name,
                        value: updatedDefinedNameVal
                    });
                }
            }
        }

        return {
            oldDefinedNameVals: oldDefinedNameVals,
            newDefinedNameVals: newDefinedNameVals
        };

    }

    // Update the cell range boundary of the related formulas when editing cell.
    private _updateFormulaBoundaryForEditingCell(row: number, col: number): any {
        let rowIndex: number,
            colIndex: number,
            cellData: any,
            updatedCellData: string,
            oldFormulas: any[] = [],
            newFormulas: any[] = [];

        this.beginUpdate();

        for (rowIndex = row; rowIndex < this.rows.length; rowIndex++) {
            cellData = this.getCellData(rowIndex, col, false);
            if (_isFormula(cellData)) {
                updatedCellData = this._updateCellBoundary(cellData, row, col);
                if (updatedCellData) {
                    oldFormulas.push({
                        point: new wijmo.Point(rowIndex, col),
                        formula: cellData
                    });

                    this.setCellData(rowIndex, col, updatedCellData, false);
                    newFormulas.push({
                        point: new wijmo.Point(rowIndex, col),
                        formula: updatedCellData
                    });
                }
            }
        }

        for (colIndex = col; colIndex < this.columns.length; colIndex++) {
            cellData = this.getCellData(row, colIndex, false);
            if (_isFormula(cellData)) {
                updatedCellData = this._updateCellBoundary(cellData, row, col);
                if (updatedCellData) {
                    oldFormulas.push({
                        point: new wijmo.Point(row, colIndex),
                        formula: cellData
                    });

                    this.setCellData(row, colIndex, updatedCellData, false);
                    newFormulas.push({
                        point: new wijmo.Point(row, colIndex),
                        formula: updatedCellData
                    });
                }
            }
        }

        this.endUpdate();

        return {
            oldFormulas: oldFormulas,
            newFormulas: newFormulas
        };
    }

    // Update the column filter for moving the column. 
    _updateColumnFiler(srcColIndex: number, descColIndex: number) {
        var filterDef = JSON.parse(this._filter.filterDefinition);

        for (var i = 0; i < filterDef.filters.length; i++) {
            var filter = filterDef.filters[i];
            if (filter.columnIndex === srcColIndex) {
                filter.columnIndex = descColIndex;
                break;
            }
        }

        this._filter.filterDefinition = JSON.stringify(filterDef);
    }

    // Chech the specific element is the child of other element.
    /*private*/ _isDescendant(paranet, child): boolean {
        var node = child.parentNode;
        while (node != null) {
            if (node === paranet) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    // Clear the expression cache of the CalcEngine.
    _clearCalcEngine() {
        this._calcEngine._clearExpressionCache();
    }

    // Get string of the given cell ranges and sheet.
    private _getRangeString(ranges, sheet: Sheet, isGetCellValue: boolean = true) {
        var clipString = '',
            rowIndex: number,
            selIndex: number,
            firstRow: boolean = true,
            firstCell: boolean,
            sel: wijmo.grid.CellRange,
            cell: any,
            rng: wijmo.grid.CellRange,
            flex = !sheet || (sheet === this.selectedSheet) ? this : sheet.grid;

        if (wijmo.isArray(ranges)) {
            if (ranges.length > 1) {
                if (this._isMultipleRowsSelected(ranges, sheet)) {
                    clipString = '';
                    for (selIndex = 0; selIndex < ranges.length; selIndex++) {
                        if (clipString) {
                            clipString += '\n';
                        }
                        clipString += this._getRangeString(ranges[selIndex], sheet);
                    }
                    return clipString;
                } else if (this._isMultipleColumnsSelected(ranges, sheet)) {
                    clipString = '';
                    for (rowIndex = 0, firstRow = true; rowIndex < flex.rows.length; rowIndex++) {
                        if (!firstRow) {
                            clipString += '\n';
                        }
                        firstRow = false;
                        for (selIndex = 0, firstCell = true; selIndex < ranges.length; selIndex++) {
                            sel = ranges[selIndex].clone();
                            sel.row = sel.row2 = rowIndex;
                            if (!firstCell) {
                                clipString += '\t';
                            }
                            firstCell = false;
                            clipString += this._getRangeString(ranges[selIndex], sheet);
                        }
                        return clipString;
                    }
                } else {
                    return '';
                }
            } else {
                rng = ranges[0];
                switch (this.selectionMode) {
                    // row modes: expand range to cover all columns
                    case wijmo.grid.SelectionMode.Row:
                    case wijmo.grid.SelectionMode.RowRange:
                        rng.col = 0;
                        rng.col2 = sheet.grid.columns.length - 1;
                        break;

                    // ListBox mode: scan rows and copy selected ones
                    case wijmo.grid.SelectionMode.ListBox:
                        rng.col = 0;
                        rng.col2 = sheet.grid.columns.length - 1;
                        for (var i = 0; i < sheet.grid.rows.length; i++) {
                            if (sheet.grid.rows[i].isSelected && sheet.grid.rows[i].isVisible) {
                                rng.row = rng.row2 = i;
                                if (clipString) clipString += '\n';
                                clipString += this._getRangeString(rng, sheet);
                            }
                        }
                        return clipString;
                }
            }
        }

        // scan rows
        rng = wijmo.asType(wijmo.isArray(ranges) ? ranges[0] : ranges, wijmo.grid.CellRange);
        for (var r = rng.topRow; r <= rng.bottomRow; r++) {
            // skip invisible, add separator
            if (!(flex.rows[r] && flex.rows[r].isVisible)) continue;
            if (!firstRow) clipString += '\n';
            firstRow = false;

            // scan cells
            for (var c = rng.leftCol, firstCell = true; c <= rng.rightCol; c++) {

                // skip invisible, add separator
                if (!(flex.columns[c] && flex.columns[c].isVisible)) continue;
                if (!firstCell) clipString += '\t';
                firstCell = false;

                // append cell
                var styleInfo = this._getCellStyle(r, c, sheet);
                var format = styleInfo ? styleInfo.format : '';
                var col = flex.columns[c];
                if (isGetCellValue) {
                    cell = flex.getCellData(r, c, false);
                    if (_isFormula(cell)) {
                        cell = this._evaluate(cell, null, sheet, r, c);
                    }
                    cell = this._formatEvaluatedResult(cell, col, format);
                } else {
                    cell = flex.getCellData(r, c, false);
                    if (wijmo.isDate(cell)) {
                        cell = wijmo.Globalize.format(cell, format || col.format);
                    }
                    if (col.dataMap) {
                        cell = col.dataMap.getDisplayValue(cell);
                    }
                }
                cell = cell == null ? '' : cell.toString();
                cell = cell.replace(/\t/g, ' '); // handle tabs
                if (cell.indexOf('\n') > -1) {   // handle line breaks
                    cell = '"' + cell.replace(/"/g, '""') + '"';
                }
                clipString += cell;
            }
        }

        // done
        return clipString;
    }

    // Get selection range for ListBox mode;
    _getSelectionForListBoxMode(flex: wijmo.grid.FlexGrid): wijmo.grid.CellRange {
        let row = 0,
            cutRange: wijmo.grid.CellRange;

        for (; row < flex.rows.length; row++) {
            if ((<wijmo.grid.Row>flex.rows[row]).isSelected) {
                if (cutRange) {
                    cutRange.row2 = row;
                } else {
                    cutRange = new wijmo.grid.CellRange(row, 0, row, flex.columns.length - 1);
                }
            }
        }

        return cutRange;
    }

    // Check whether the cell ranges contains formula cells.
    private _containsRandFormula(ranges: wijmo.grid.CellRange[], sheet: Sheet): boolean {
        for (var i = 0; i < ranges.length; i++) {
            var rng = ranges[i];
            for (var rowIndex = rng.topRow; rowIndex <= rng.bottomRow && rowIndex < sheet.grid.rows.length; rowIndex++) {
                for (var colIndex = rng.leftCol; colIndex <= rng.rightCol && colIndex < sheet.grid.columns.length; colIndex++) {
                    var cellData = sheet.grid.getCellData(rowIndex, colIndex, false);
                    if (_isFormula(cellData) && cellData.search(/rand/i) !== -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Check current selections of the FlexSheet are multiple rows.
    private _isMultipleRowsSelected(ranges?, sheet?: Sheet): boolean {
        var firstSel: wijmo.grid.CellRange,
            sel: wijmo.grid.CellRange,
            selections;

        if (ranges && ranges.length > 1) {
            selections = ranges;
        } else if (this.selectedSheet.selectionRanges.length > 1) {
            selections = this.selectedSheet.selectionRanges;
        }

        firstSel = selections[0];
        for (var i = 1; i < selections.length; i++) {
            sel = selections[i];
            if (sel.leftCol !== firstSel.leftCol || sel.rightCol !== firstSel.rightCol) {
                return false;
            }
        }
        return true;
    }

    // Check current selections of the FlexSheet are multiple columns.
    private _isMultipleColumnsSelected(ranges?, sheet?: Sheet): boolean {
        var firstSel: wijmo.grid.CellRange,
            sel: wijmo.grid.CellRange,
            selections;

        if (ranges && ranges.length > 1) {
            selections = ranges;
        } else if (this.selectedSheet.selectionRanges.length > 1) {
            selections = this.selectedSheet.selectionRanges;
        }

        firstSel = selections[0];
        for (var i = 0; i < selections.length; i++) {
            sel = selections[i];
            if (sel.topRow !== firstSel.topRow || sel.bottomRow !== firstSel.bottomRow) {
                return false;
            }
        }
        return true;
    }

    // Post processing for setting clip string in FlexSheet.
    private _postSetClipStringProcess(cellData: any, row: number, col: number, copiedRow: number, copiedCol: number, ecv: wijmo.collections.IEditableCollectionView, styleInfo?: ICellStyle): boolean {
        var mergedCell: wijmo.grid.CellRange,
            e = new wijmo.grid.CellRangeEventArgs(this.cells, new wijmo.grid.CellRange(row, col), cellData);

        // raise events so user can cancel the paste
        if (this.onPastingCell(e)) {
            if (copiedRow >= 0 && copiedCol >= 0) {
                if (this._copiedSheet) {
                    mergedCell = this._copiedSheet._getMergedRange(copiedRow, copiedCol);
                    if (!!mergedCell && mergedCell.topRow === copiedRow && mergedCell.leftCol === copiedCol) {
                        var rowSpan = row + mergedCell.rowSpan - 1;
                        rowSpan = rowSpan < this.rows.length ? rowSpan : this.rows.length - 1;
                        var colSpan = col + mergedCell.columnSpan - 1;
                        colSpan = colSpan < this.columns.length ? colSpan : this.columns.length - 1;
                        let pastedMergeRange = new wijmo.grid.CellRange(row, col, rowSpan, colSpan);
                        for (let r = pastedMergeRange.topRow; r <= pastedMergeRange.bottomRow; r++) {
                            for (let c = pastedMergeRange.leftCol; c <= pastedMergeRange.rightCol; c++) {
                                let anotherMergedCell = this.getMergedRange(this.cells, r, c);
                                if (anotherMergedCell != null && !anotherMergedCell.equals(pastedMergeRange)) {
                                    console.error('We can\'t paste the merged cell to another merged cell.');
                                    return false;
                                }
                            }
                        }
                        this.mergeRange(new wijmo.grid.CellRange(row, col, rowSpan, colSpan), true);
                    }
                }
            }

            if (ecv) {
                ecv.editItem(this.rows[row].dataItem);
            }

            var pasted = (<FlexSheetPanel>this.cells).setCellData(row, col, styleInfo && styleInfo.format ? new _ValWithFormat(e.data, styleInfo.format) : e.data);

            if (pasted) {
                if (wijmo.isString(e.data) && e.data !== '\n') { // 413110, ignore a single newline character.
                    var match = e.data.match(/\n/g);
                    if (match && match.length > 0) {
                        if (styleInfo) {
                            styleInfo.whiteSpace = 'pre';
                        } else {
                            styleInfo = { whiteSpace: 'pre' };
                        }
                        this.rows[row].height = this.rows.defaultSize * (match.length + 1);
                    }
                }

                // *** TFS 470176 (the style of each cell is always copied to the first cell of a merged range)
                //var cellIndex = (mergedCell = this.selectedSheet._getMergedRange(row, col))
                //    ? mergedCell.topRow * this.columns.length + mergedCell.leftCol
                //    : row * this.columns.length + col;

                var cellIndex = row * this.columns.length + col;
                // ***

                this.selectedSheet._styledCells[cellIndex] = styleInfo
                    ? this._cloneObject(styleInfo)
                    : undefined;

                this.onPastedCell(e);
            }
        }

        return pasted;
    }

    // Delete the cut data.
    private _delCutData(rowsSpan: number, colsSpan: number) {
        var row: number,
            col: number,
            bcol: wijmo.grid.Column,
            cutRange: wijmo.grid.CellRange,
            cutSource = this._copiedSheet === this.selectedSheet ? this : this._copiedSheet.grid;

        if (this.selectionMode === wijmo.grid.SelectionMode.ListBox) {
            cutRange = this._getSelectionForListBoxMode(cutSource);
        } else {
            cutRange = this._copiedRanges[0];
        }

        for (row = cutRange.topRow; row <= cutRange.bottomRow; row++) {
            if (cutSource.rows[row] == null) {
                continue;
            }
            for (col = cutRange.leftCol; col <= cutRange.rightCol; col++) {
                if (this._copiedSheet !== this.selectedSheet || row < this.selection.topRow || row > this.selection.topRow + rowsSpan - 1 || col < this.selection.leftCol || col > this.selection.leftCol + colsSpan - 1) {
                    bcol = cutSource._getBindingColumn(cutSource.cells, row, cutSource.columns[col]);
                    if (bcol.isRequired == false || (bcol.isRequired == null && bcol.dataType == wijmo.DataType.String)) {
                        if (cutSource.getCellData(row, col, true)) {
                            cutSource.setCellData(row, col, '', true);
                        }
                    }
                }
            }
        }
    }

    // Check whether the pasted texts contains multi-line text.
    private _containsMultiLineText(rows: string[][]): boolean {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j].indexOf('\n') > 0) { // >= 0 TFS 400190.
                    return true;
                }
            }
        }
        return false;
    }

    // Sort the selections by row.
    private _sortByRow(sel1: wijmo.grid.CellRange, sel2: wijmo.grid.CellRange): number {
        if (sel1.topRow > sel2.topRow) {
            return 1;
        } else if (sel1.topRow < sel2.topRow) {
            return -1;
        } else {
            return 0;
        }
    }

    // Sort the selections by column.
    private _sortByColumn(sel1: wijmo.grid.CellRange, sel2: wijmo.grid.CellRange): number {
        if (sel1.leftCol > sel2.leftCol) {
            return 1;
        } else if (sel1.leftCol < sel2.leftCol) {
            return -1;
        } else {
            return 0;
        }
    }

    // Set all the rows and columns to dirty for updating
    _setFlexSheetToDirty() {
        this.columns._dirty = true;
        this.rows._dirty = true;
        this.rowHeaders.columns._dirty = true;
        this.rowHeaders.rows._dirty = true;
        this.columnHeaders.columns._dirty = true;
        this.columnHeaders.rows._dirty = true;
    }

    /**
     * Converts the number value to its corresponding alpha value.
     * For instance: 0, 1, 2...to a, b, c...
     * @param c The number value need to be converted.
     */
    static convertNumberToAlpha(c: number): string {
        var content = '',
            dCount: number,
            pos: number;

        if (c >= 0) {
            do {
                dCount = Math.floor(c / 26);
                pos = c % 26;
                content = String.fromCharCode(pos + 65) + content;
                c = dCount - 1;
            } while (dCount);
        }

        return content;
    }

    // update the formula of the row after reordering the row.
    _updateFormulaForReorderingRows(srcRow: number, dstRow: number, isResetFormula: boolean = false) {
        var distance = isResetFormula ? srcRow - dstRow : dstRow - srcRow,
            cellData: any,
            exp: _Expression;

        this.beginUpdate();

        for (var i = 0; i < this.columns.length; i++) {
            cellData = this.getCellData(dstRow, i, false);
            if (_isFormula(cellData) && distance !== 0) {
                try {
                    exp = this._calcEngine._parse(cellData);
                } catch (e) {
                    continue;
                }
                if (exp._updateCellRangeExpForReorderingRows(distance)) {
                    this.setCellData(dstRow, i, '=' + exp._getStringExpression());
                }
            }
        }

        this.endUpdate();
    }

    // update the formulas for drag & drop rows or columns.
    private _updateFormulaForDropping(isChangePos: boolean): any {
        var oldFormulas = [],
            newFormulas = [],
            sheet: Sheet,
            grid: wijmo.grid.FlexGrid,
            sheetIndex: number,
            rowIndex: number,
            row: wijmo.grid.Row,
            colIndex: number,
            column: wijmo.grid.Column,
            cellData: string,
            updatedCellData: string;

        this.beginUpdate();

        for (sheetIndex = 0; sheetIndex < this.sheets.length; sheetIndex++) {
            sheet = this.sheets[sheetIndex];
            grid = sheet.grid;
            for (rowIndex = 0; rowIndex < grid.rows.length; rowIndex++) {
                for (colIndex = 0; colIndex < grid.columns.length; colIndex++) {
                    cellData = grid.getCellData(rowIndex, colIndex, false);
                    if (_isFormula(cellData)) {
                        updatedCellData = this._updateCellRefForDropping(cellData, sheetIndex, isChangePos);
                        if (updatedCellData) {
                            grid.setCellData(rowIndex, colIndex, updatedCellData, false);
                            if (isChangePos && sheetIndex === this.selectedSheetIndex) {
                                row = grid.rows[rowIndex];
                                column = grid.columns[colIndex];
                                oldFormulas.push({
                                    sheet: sheet,
                                    row: row,
                                    column: column,
                                    formula: cellData
                                });
                                newFormulas.push({
                                    sheet: sheet,
                                    row: row,
                                    column: column,
                                    formula: updatedCellData
                                });
                            } else {
                                oldFormulas.push({
                                    sheet: sheet,
                                    point: new wijmo.Point(rowIndex, colIndex),
                                    formula: cellData
                                });
                                newFormulas.push({
                                    sheet: sheet,
                                    point: new wijmo.Point(rowIndex, colIndex),
                                    formula: updatedCellData
                                });
                            }
                        }
                    }
                }
            }
        }

        this.endUpdate();

        return {
            oldFormulas: oldFormulas,
            newFormulas: newFormulas
        };
    }

    // Update the affected NamedRanges for drag & drop rows or columns.
    private _updateNamedRangesForDropping(isChangePos: boolean): any {
        var nameIndex: number,
            definedName: DefinedName,
            definedNameVal: any,
            updatedDefinedNameVal: any,
            oldDefinedNameVals: any[] = [],
            newDefinedNameVals: any[] = [];

        for (nameIndex = 0; nameIndex < this.definedNames.length; nameIndex++) {
            definedName = this.definedNames[nameIndex];
            definedNameVal = definedName.value;
            if (!!definedNameVal && wijmo.isString(definedNameVal)) {
                updatedDefinedNameVal = this._updateCellRefForDropping(definedNameVal, this.selectedSheetIndex, isChangePos);
                if (updatedDefinedNameVal) {
                    oldDefinedNameVals.push({
                        name: definedName.name,
                        value: definedNameVal
                    });

                    definedName.value = updatedDefinedNameVal;
                    newDefinedNameVals.push({
                        name: definedName.name,
                        value: updatedDefinedNameVal
                    });
                }
            }
        }

        return {
            oldDefinedNameVals: oldDefinedNameVals,
            newDefinedNameVals: newDefinedNameVals
        };

    }

    // Update cell reference for drag & drop rows or columns.
    private _updateCellRefForDropping(cellData: string, sheetIndex: number, isChangePos: boolean = false): string {
        let exp: _Expression;
        try {
            exp = this._calcEngine._parse(cellData);
        } catch (e) {
            return null;
        }
        if (exp._moveCellRangeExp(sheetIndex, this._draggingCells, this._dropRange, isChangePos)) {
            return '=' + exp._getStringExpression();
        }
        return null;
    }

    // update the style of cells after reordering the row.
    _updateCellStyleForReorderingRows(srcRow: number, dstRow: number, sortedCellsStyle: any) {
        let colCnt = this.columns.length,
            colIndex: number,
            dstCellIndex: number,
            cellStyle: ICellStyle;

        for (colIndex = 0; colIndex < colCnt; colIndex++) {
            cellStyle = this._getCellStyle(srcRow, colIndex);
            if (cellStyle) {
                dstCellIndex = dstRow * colCnt + colIndex;
                sortedCellsStyle[dstCellIndex] = cellStyle;
            }
        }
    }

    // Scan the formulas of current sheet.
    _scanFormulas(): any[] {
        var formulas = [];
        for (var i = 0; i < this.rows.length; i++) {
            for (var j = 0; j < this.columns.length; j++) {
                var data = this.getCellData(i, j, false);
                if (_isFormula(data)) {
                    formulas.push({
                        row: i,
                        column: j,
                        formula: data
                    });
                }
            }
        }
        return formulas;
    }

    // Reset the formulas for current sheet.
    _resetFormulas(formulas: any[]) {
        if (!formulas) {
            return;
        }
        this.deferUpdate(() => {
            for (var i = 0; i < formulas.length; i++) {
                var item = formulas[i];
                this.setCellData(item.row, item.column, item.formula);
            }
        });
    }

    // Get the cell style in selected sheet.
    _getCellStyle(rowIndex: number, colIndex: number, sheet?: Sheet): ICellStyle {
        var sheet = sheet || this.selectedSheet;
        if (!sheet) {
            return null;
        }
        return sheet.getCellStyle(rowIndex, colIndex);
    }

    _getSheet(name: string): Sheet {
        if (name == null) {
            return null;
        }
        name = name.toLowerCase();

        for (let i = 0; i < this.sheets.length; i++) {
            let sheet = this.sheets[i];
            if (sheet.name.toLowerCase() === name) {
                return sheet;
            }
        }

        return null;
    }

    // Validate the sheet name of the defined name item.
    _validateSheetName(sheetName: string): boolean {
        return !!this._getSheet(sheetName);
    }

    // Check whether the defined name already existed.
    _checkExistDefinedName(name: string, sheetName: string, ignoreIndex: number = -1): boolean {
        sheetName = sheetName ? sheetName.toLowerCase() : sheetName;

        for (let i = 0; i < this.definedNames.length; i++) {
            let dn = this.definedNames[i],
                dnsn = dn.sheetName ? dn.sheetName.toLowerCase() : dn.sheetName;

            if (dn.name === name && dnsn === sheetName && i !== ignoreIndex) {
                return true;
            }
        }
        return false;
    }

    // Update the defiend name item with the sheet name changing.
    private _updateDefinedNameWithSheetRefUpdating(oldSheetName: string, newSheetName: string) {
        var definedName: DefinedName,
            match: any,
            cellRef: string,
            sheetRef: string;
        for (var i = 0; i < this.definedNames.length; i++) {
            definedName = this.definedNames[i];
            // Update the sheet name of the defined name item.
            if (definedName.sheetName != null && definedName.sheetName.toLowerCase() === oldSheetName.toLowerCase()) {
                definedName._sheetName = newSheetName;
            }
            // Update the sheet reference of the value of the defined name item.
            match = definedName.value.match(/(\w+)\!\$?[A-Za-z]+\$?\d+/g);
            if (match && match.length > 0) {
                for (var j = 0; j < match.length; j++) {
                    cellRef = match[j];
                    sheetRef = cellRef.substring(0, cellRef.indexOf('!'));
                    if (sheetRef === oldSheetName) {
                        definedName.value = definedName.value.replace(cellRef, cellRef.replace(oldSheetName, newSheetName));
                    }
                }
            }
        }
    }

    // Updated the formulas refer to the defined name or the table via the change of the name of defined name or table.
    _updateFormulasWithNameUpdating(oldName: string, newName: string, isTable: boolean = false) {
        if (!this.sheets.length) {
            return;
        }

        let sheetIndex: number,
            rowIndex: number,
            colIndex: number,
            sheet: Sheet,
            grid: wijmo.grid.FlexGrid,
            cellData: any,
            nameIndex: number,
            prevChar: string,
            folChar: string,
            replaceRegEx: RegExp,
            currentSel = this.selection.clone(),
            formulaChanged = false,
            folCharCheckReg: RegExp;

        if (isTable) {
            folCharCheckReg = /\[/;
        } else {
            folCharCheckReg = /\w/;
        }

        this.selectedSheet._storeRowSettings();
        this.beginUpdate();

        for (sheetIndex = 0; sheetIndex < this.sheets.length; sheetIndex++) {
            sheet = this.sheets[sheetIndex];
            grid = sheet.grid;
            for (rowIndex = 0; rowIndex < grid.rows.length; rowIndex++) {
                for (colIndex = 0; colIndex < grid.columns.length; colIndex++) {
                    cellData = grid.getCellData(rowIndex, colIndex, false);
                    if (_isFormula(cellData)) {
                        formulaChanged = false;
                        nameIndex = cellData.indexOf(oldName);
                        replaceRegEx = new RegExp(oldName, 'g');
                        while (nameIndex > -1) {
                            prevChar = '';
                            folChar = '';
                            if (nameIndex > 0) {
                                prevChar = cellData[nameIndex - 1];
                            }
                            if (nameIndex + oldName.length < cellData.length) {
                                folChar = cellData[nameIndex + oldName.length];
                            }
                            if (!(/\w/.test(prevChar)) && ((isTable && folCharCheckReg.test(folChar)) || (!isTable && !folCharCheckReg.test(folChar)))) {
                                cellData = cellData.replace(replaceRegEx, (match, offset) => {
                                    if (offset === nameIndex) {
                                        return newName;
                                    } else {
                                        return oldName;
                                    }
                                });
                                formulaChanged = true;
                            }
                            nameIndex = cellData.indexOf(oldName, nameIndex + oldName.length);
                        }
                        if (formulaChanged) {
                            grid.setCellData(rowIndex, colIndex, cellData, false);
                        }
                    }
                }
            }
        }

        this.selection = currentSel;
        this.endUpdate();
    }

    // Get the index of the defined name by its name.
    _getDefinedNameIndexByName(name: string): number {
        var index = 0;
        for (; index < this.definedNames.length; index++) {
            if (this.definedNames[index].name === name) {
                return index;
            }
        }
        return -1;
    }

    // update the table range of current sheet for add\delete rows.
    private _updateTablesForUpdatingRow(index: number, count: number, isDelete?: boolean): Table[] {
        var tableIndex: number,
            tableName: string,
            table: Table,
            tableRange: wijmo.grid.CellRange,
            effectIndex: number,
            deletedTables: Table[];

        if (this.selectedSheet.tables.length > 0) {
            for (tableIndex = this.selectedSheet.tables.length - 1; tableIndex >= 0; tableIndex--) {
                table = this.selectedSheet.tables[tableIndex];
                tableRange = table.getRange();
                if (isDelete) {
                    effectIndex = index + count - 1
                    if (effectIndex < tableRange.topRow) {
                        table._updateTableRange(-count, -count, 0, 0);
                    } else if (effectIndex >= tableRange.topRow && effectIndex <= tableRange.bottomRow) {
                        if (index <= tableRange.topRow && effectIndex === tableRange.bottomRow) {
                            if (deletedTables == null) {
                                deletedTables = [];
                            }
                            deletedTables.push(table);
                            this.selectedSheet.tables.remove(table);
                            continue;
                        } else if (index < tableRange.topRow) {
                            if (table.showHeaderRow) {
                                table['_showHeaderRow'] = false;
                            }
                            table._updateTableRange(index - tableRange.topRow, -count, 0, 0);
                        } else {
                            if (index === tableRange.topRow && table.showHeaderRow) {
                                table['_showHeaderRow'] = false;
                            }
                            if (effectIndex === tableRange.bottomRow && table.showTotalRow) {
                                table['_showTotalRow'] = false;
                            }
                            table._updateTableRange(0, -count, 0, 0);
                        }
                    } else {
                        if (index <= tableRange.topRow) {
                            if (deletedTables == null) {
                                deletedTables = [];
                            }
                            deletedTables.push(table);
                            this.selectedSheet.tables.remove(table);
                        } else if (index <= tableRange.bottomRow) {
                            if (table.showTotalRow) {
                                table['_showTotalRow'] = false;
                            }
                            table._updateTableRange(0, index - tableRange.bottomRow - 1, 0, 0);
                        }
                    }
                } else {
                    if (index <= tableRange.topRow) {
                        table._updateTableRange(count, count, 0, 0);
                    } else if (index > tableRange.topRow && index <= tableRange.bottomRow) {
                        table._updateTableRange(0, count, 0, 0);
                    }
                }
            }
        }

        return deletedTables;
    }

    // update the table range of current sheet for add\delete columns.
    private _updateTablesForUpdatingColumn(index: number, count: number, isDelete?: boolean): Table[] {
        var tableIndex: number,
            tableName: string,
            table: Table,
            tableRange: wijmo.grid.CellRange,
            effectIndex: number,
            effectCount: number,
            startIndex: number,
            i: number,
            deletedTables: Table[];

        if (this.selectedSheet.tables.length > 0) {
            for (tableIndex = this.selectedSheet.tables.length - 1; tableIndex >= 0; tableIndex--) {
                table = this.selectedSheet.tables[tableIndex];
                tableRange = table.getRange();
                if (isDelete) {
                    effectIndex = index + count - 1
                    if (effectIndex < tableRange.leftCol) {
                        table._updateTableRange(0, 0, -count, -count);
                    } else if (effectIndex >= tableRange.leftCol && effectIndex <= tableRange.rightCol) {
                        if (index <= tableRange.leftCol && effectIndex === tableRange.rightCol) {
                            if (deletedTables == null) {
                                deletedTables = [];
                            }
                            deletedTables.push(table);
                            this.selectedSheet.tables.remove(table);
                            continue;
                        } else if (index < tableRange.leftCol) {
                            effectCount = count - tableRange.leftCol + index;
                            startIndex = tableRange.leftCol;
                            table._updateTableRange(0, 0, index - tableRange.leftCol, -count);
                        } else {
                            effectCount = count;
                            startIndex = index;
                            table._updateTableRange(0, 0, 0, -effectCount);
                        }
                        table['_columns'].splice(startIndex - tableRange.leftCol, effectCount);
                    } else {
                        if (index <= tableRange.leftCol) {
                            if (deletedTables == null) {
                                deletedTables = [];
                            }
                            deletedTables.push(table);
                            this.selectedSheet.tables.remove(table);
                        } else if (index <= tableRange.rightCol) {
                            effectCount = tableRange.rightCol - index + 1;
                            table._updateTableRange(0, 0, 0, -effectCount);
                            table['_columns'].splice(index, effectCount);
                        }
                    }
                } else {
                    if (index <= tableRange.leftCol) {
                        table._updateTableRange(0, 0, count, count);
                    } else if (index > tableRange.leftCol && index <= tableRange.rightCol) {
                        table._updateTableRange(0, 0, 0, count);
                        startIndex = index - tableRange.leftCol;
                        for (i = 0; i < count; i++) {
                            table._addColumn(startIndex + i);
                        }
                    }
                }
            }
        }

        return deletedTables;
    }

    private _updateDivContainerHeight(tabHolderVisible: boolean): void {
        let height = this._divContainer.parentElement.clientHeight;

        if (tabHolderVisible) {
            height -= this._tabHolder.getSheetBlanketSize();
        }

        this._divContainer.style.height = height + 'px';
    }

    // Check whether disable DeleteRow for flexsheet.
    _isDisableDeleteRow(topRow: number, bottomRow: number): boolean {
        var tableIndex: number,
            table: Table,
            tableRange: wijmo.grid.CellRange;

        if (this.selectedSheet.tables.length > 0) {
            for (tableIndex = 0; tableIndex < this.selectedSheet.tables.length; tableIndex++) {
                table = this.selectedSheet.tables[tableIndex];
                tableRange = table.getRange();
                if (table.showHeaderRow && tableRange.topRow >= topRow && tableRange.topRow <= bottomRow) {
                    return true;
                }
            }
        }

        return false;
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        var headerRow: wijmo.grid.Row,
            column: wijmo.grid.Column;
        if (key == 'columns') {
            super._copy(key, value);
            if (!!this.itemsSource) {
                headerRow = this.rows[0];
                if (headerRow instanceof HeaderRow) {
                    headerRow._ubv = null;
                    headerRow._ubv = {};
                    for (var i = 0; i < this.columns.length; i++) {
                        column = this.columns[i];
                        headerRow._ubv[column._hash] = FlexSheet._getHeaderRowText(column);
                    }
                }
            }
            return true;
        }
        return false;
    }

    // Get the sheet index the specific table is located in.
    private _getTableSheetIndex(sheetTables: string[][], tableName: string): number {
        let sheets = this.sheets;
        for (let i = 0; i < sheetTables.length; i++) {
            if (sheetTables[i].indexOf(tableName) > -1) {
                return i;
            }
        }
        return -1;
    }

    // Sort converter for FlexSheet, this converter mainly handles to evaluate the formula value.
    private _sheetSortConverter(sd: wijmo.collections.SortDescription, item: any, value: any, init: boolean) {
        value = super['_sortConverter'](sd, item, value, init);

        if (_isFormula(value)) {
            value = this.evaluate(value);
        }

        return value;
    }

    // Format the evaluated result.
    /*private*/ _formatEvaluatedResult(result: any, col: wijmo.grid.Column, format: string): any {
        if (wijmo.isPrimitive(result)) {
            if (col.dataMap) {
                result = col.dataMap.getDisplayValue(result);
            }

            let fmt = format || col.format;

            if (wijmo.isInt(result) && !fmt && !col.dataMap) {
                result = result.toString();
            } else {
                if (wijmo.isDate(result) && _isExclusiveNumericFormat(fmt)) { // 467361, format date as a number.
                    result = FlexSheet._toOADate(result);
                } else {
                    if (fmt && fmt !== '@' && wijmo.isString(result) && (+result).toString() === result) {
                        result = +result;
                    }
                }

                result = result != null ? wijmo.Globalize.format(result, fmt) : '';
            }
        } else if (result) {
            if (result instanceof FormulaError) {
                return result.error;
            }

            let fmt = format || result.format || col.format;

            if (wijmo.isInt(result.value) && !fmt && !col.dataMap) {
                result = result.value.toString();
            } else {
                if (wijmo.isDate(result.value) && _isExclusiveNumericFormat(fmt)) { // 467361, format date as a number.
                    result.value = FlexSheet._toOADate(result.value);
                } else {
                    if (wijmo.isString(result.value) && (+result.value).toString() === result.value) {
                        result.value = +result.value;
                    }
                }

                result = result.value != null ? wijmo.Globalize.format(result.value, fmt) : '';
            }
        }
        return result;
    }

    // Updated the cell reference of the formula for updating the rows\columns of the FlexSheet.
    private _updateCellRef(cellData: string, sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange) {
        let exp: _Expression;
        try {
            exp = this._calcEngine._parse(cellData);
        } catch (e) {
            return null;
        }
        if (exp._updateCellRangeExp(sheetIndex, index, count, isAdding, isRow, affectRange)) {
            return '=' + exp._getStringExpression();
        }
        return null;
    }

    // Updated the cell boundary of the formula.
    private _updateCellBoundary(cellData: string, row: number, col) {
        let exp: _Expression;
        try {
            exp = this._calcEngine._parse(cellData);
        } catch (e) {
            return null;
        }
        if (exp instanceof _FunctionExpression && exp._updateCellBoundary(row, col)) {
            return '=' + exp._getStringExpression();
        }
        return null;
    }

    // Fill Data.
    private _fillData(operation: AutoFillOperation = AutoFillOperation.CopyFormat | AutoFillOperation.FillSeries): boolean {
        let sel = this._fillingRange || this.selection,
            source = this._fillingSource,
            isCopyFormat = (operation & AutoFillOperation.CopyFormat) !== 0,
            isCopyContent = (operation & AutoFillOperation.CopyContent) !== 0,
            isFillSeries = (operation & AutoFillOperation.FillSeries) !== 0,
            isFillRow = source.leftCol === sel.leftCol && source.rightCol === sel.rightCol,
            sourceSeries: _IFillSeries[] = [];

        let args = new AutoFillingEventArgs(sel, operation);
        this.onAutoFilling(args);
        if (args.cancel) {
            return false;
        }

        this.beginUpdate();
        this._resetCellsForFillRange(operation);

        for (let rowIndex = 0; rowIndex < sel.rowSpan; rowIndex++) {
            let dstRowIndex = sel.topRow + rowIndex,
                rowDiff = dstRowIndex - source.topRow,
                srcRowIndex = rowDiff % source.rowSpan;

            if (srcRowIndex < 0) {
                srcRowIndex += source.rowSpan;
            }

            columnLoop:
            for (let colIndex = 0; colIndex < sel.columnSpan; colIndex++) {
                let dstColIndex = sel.leftCol + colIndex,
                    colDiff = dstColIndex - source.leftCol;

                if (rowDiff >= 0 && rowDiff < source.rowSpan && colDiff >= 0 && colDiff < source.columnSpan) {
                    continue;
                }

                let srcColIndex = colDiff % source.columnSpan;
                if (srcColIndex < 0) {
                    srcColIndex += source.columnSpan;
                }

                let isStartMergeCell = false,
                    srcMergedCell = this.getMergedRange(this.cells, source.topRow + srcRowIndex, source.leftCol + srcColIndex);

                if (srcMergedCell) {
                    isStartMergeCell = srcMergedCell.topRow === source.topRow + srcRowIndex && srcMergedCell.leftCol === source.leftCol + srcColIndex;
                    if (isStartMergeCell) {
                        let dstMegredCell = this.getMergedRange(this.cells, dstRowIndex, dstColIndex);
                        if (!dstMegredCell) {
                            this.mergeRange(new wijmo.grid.CellRange(dstRowIndex, dstColIndex, dstRowIndex + srcMergedCell.rowSpan - 1, dstColIndex + srcMergedCell.columnSpan - 1));
                        }
                    }
                }

                if (isCopyFormat) {
                    let cellStyle = this.selectedSheet.getCellStyle(source.topRow + srcRowIndex, source.leftCol + srcColIndex),
                        dstCellStyle = cellStyle ? this._cloneObject(cellStyle) : null,
                        dstCellIndex = dstRowIndex * this.columns.length + dstColIndex;

                    this.selectedSheet._styledCells[dstCellIndex] = dstCellStyle;
                }

                if (srcMergedCell && !isStartMergeCell) {
                    continue columnLoop;
                }

                if (this.isReadOnly || this.rows[dstRowIndex].isReadOnly) {
                    continue;
                }

                if (this.columns[dstColIndex].isReadOnly) {
                    continue columnLoop;
                }

                let val: any;

                if (isCopyContent) {
                    val = this.getCellData(source.topRow + srcRowIndex, source.leftCol + srcColIndex, false);
                    if (_isFormula(val)) {
                        this._fillFormula(val, source.topRow + srcRowIndex, source.leftCol + srcColIndex, dstRowIndex, dstColIndex);
                    } else {
                        this.setCellData(dstRowIndex, dstColIndex, val);
                    }
                } else if (isFillSeries) {
                    let seriesIndex: number,
                        srcIndex: number;

                    if (isFillRow) {
                        seriesIndex = colIndex;
                        srcIndex = srcRowIndex;
                    } else {
                        seriesIndex = rowIndex;
                        srcIndex = srcColIndex;
                    }

                    val = this.getCellData(source.topRow + srcRowIndex, source.leftCol + srcColIndex, false);

                    if (val == null || wijmo.isString(val)) {
                        if (_isFormula(val)) {
                            this._fillFormula(val, source.topRow + srcRowIndex, source.leftCol + srcColIndex, dstRowIndex, dstColIndex);
                        } else {
                            this.setCellData(dstRowIndex, dstColIndex, val);
                        }
                        sourceSeries[seriesIndex] = null;
                    } else {
                        if (!sourceSeries[seriesIndex]) {
                            sourceSeries[seriesIndex] = this._getFillSeries(isFillRow, seriesIndex, srcIndex);
                        }

                        let series = sourceSeries[seriesIndex];
                        if (series) {
                            if (isFillRow) {
                                val = this._getFillData(srcRowIndex, rowDiff, source, isFillRow, series, (operation != null || seriesIndex === 0));
                                if (series.endIndex === source.topRow + srcRowIndex) {
                                    sourceSeries[seriesIndex] = null;
                                }
                            } else {
                                val = this._getFillData(srcColIndex, colDiff, source, isFillRow, series, (operation != null || seriesIndex === 0));
                                if (series.endIndex === source.leftCol + srcColIndex) {
                                    sourceSeries[seriesIndex] = null;
                                }
                            }

                            this.setCellData(dstRowIndex, dstColIndex, val);
                        }
                    }
                }
            }
        }

        if (this._fillingRange) {
            this.select(this._fillingRange, false);
        }

        this.endUpdate();

        this.onAutoFilled(args);

        return true;
    }

    // Gets the fill data via its fill series.
    private _getFillData(srcIndex: number, cellDiff: number, source: wijmo.grid.CellRange, isFillRow: boolean, series: _IFillSeries, needGetTrendData: boolean): any {
        let seriesItems = series.items,
            dstIndex: number,
            val: any;

        if (seriesItems.length === 1 && !needGetTrendData) {
            return seriesItems[0];
        }
        if (isFillRow) {
            dstIndex = Math.floor(cellDiff / source.rowSpan) * series.itemIndexes[series.itemIndexes.length - 1] + source.topRow + srcIndex - series.startIndex + 1;
        } else {
            dstIndex = Math.floor(cellDiff / source.columnSpan) * series.itemIndexes[series.itemIndexes.length - 1] + source.leftCol + srcIndex - series.startIndex + 1;
        }
        val = this._getLinearBestFitTrendData(seriesItems, series.itemIndexes, dstIndex);
        if (series.type === 'date') {
            val = FlexSheet._fromOADate(val);
        }
        return val;
    }

    // Fill the formula.
    private _fillFormula(cellData: string, srcRowIndex: number, srcColIndex: number, dstRowIndex: number, dstColIndex: number) {
        let exp: _Expression,
            srcRange: wijmo.grid.CellRange,
            dstRange: wijmo.grid.CellRange;
        try {
            exp = this._calcEngine._parse(cellData);
            srcRange = new wijmo.grid.CellRange(srcRowIndex, srcColIndex);
            dstRange = new wijmo.grid.CellRange(dstRowIndex, dstColIndex);
            if (exp._moveCellRangeExp(this.selectedSheetIndex, srcRange, dstRange, false, true)) {
                cellData = '=' + exp._getStringExpression();
            }
        } catch (e) {
        } finally {
            this.setCellData(dstRowIndex, dstColIndex, cellData);
        }
    }

    // Get the fill series.
    private _getFillSeries(isFillRow: boolean, seriesIndex: number, srcIndex: number): _IFillSeries {
        let source = this._fillingSource,
            seriesItems = [],
            itemIndexes = [],
            valueType: string,
            seriesType: string,
            seriesStartIndex: number,
            itemIndex: number,
            index: number,
            mergedCell: wijmo.grid.CellRange,
            lastMergeCell: wijmo.grid.CellRange,
            val: any;

        if (isFillRow) {
            srcIndex = source.topRow + srcIndex;
            itemIndex = 0;
            for (index = source.topRow; index <= source.bottomRow; index++) {
                mergedCell = this.getMergedRange(this.cells, index, source.leftCol + seriesIndex);
                if (mergedCell) {
                    if (lastMergeCell && !mergedCell.equals(lastMergeCell)) {
                        itemIndex += lastMergeCell.rowSpan;
                        lastMergeCell = mergedCell;
                        if (mergedCell.leftCol !== source.leftCol + seriesIndex) {
                            continue;
                        }
                    } else if (mergedCell.topRow === index && mergedCell.leftCol === source.leftCol + seriesIndex) {
                        itemIndex += 1;
                        lastMergeCell = mergedCell;
                    } else {
                        continue;
                    }
                } else {
                    if (lastMergeCell) {
                        itemIndex += lastMergeCell.rowSpan;
                        lastMergeCell = null;
                    } else {
                        itemIndex += 1;
                    }
                }
                val = this.getCellData(index, source.leftCol + seriesIndex, false);
                if (val == null || val === '') {
                    continue;
                }
                if (wijmo.isNumber(val) || wijmo.isDate(val)) {
                    valueType = wijmo.isNumber(val) ? 'number' : 'date';
                    if (wijmo.isDate(val)) {
                        val = FlexSheet._toOADate(val);
                    }
                    if (seriesItems.length === 0) {
                        seriesStartIndex = index;
                        seriesType = valueType;
                        seriesItems.push(val);
                        itemIndexes.push(itemIndex);
                    } else {
                        if (valueType === seriesType) {
                            seriesItems.push(val);
                            itemIndexes.push(itemIndex);
                        } else {
                            if (srcIndex >= seriesStartIndex && srcIndex <= index) {
                                return {
                                    type: seriesType,
                                    startIndex: seriesStartIndex,
                                    endIndex: index - 1,
                                    items: seriesItems,
                                    itemIndexes: itemIndexes
                                };
                            } else {
                                seriesItems.splice(0, seriesItems.length);
                                itemIndexes.splice(0, itemIndexes.length);
                            }
                        }
                    }
                } else if (seriesItems.length > 0) {
                    if (srcIndex >= seriesStartIndex && srcIndex <= index) {
                        return {
                            type: seriesType,
                            startIndex: seriesStartIndex,
                            endIndex: index - 1,
                            items: seriesItems,
                            itemIndexes: itemIndexes
                        };
                    } else {
                        seriesItems.splice(0, seriesItems.length);
                        itemIndexes.splice(0, itemIndexes.length);
                    }
                }
            }
        } else {
            srcIndex = source.leftCol + srcIndex;
            itemIndex = 0;
            for (index = source.leftCol; index <= source.rightCol; index++) {
                mergedCell = this.getMergedRange(this.cells, source.topRow + seriesIndex, index);
                if (mergedCell) {
                    if (lastMergeCell && !mergedCell.equals(lastMergeCell)) {
                        itemIndex += lastMergeCell.columnSpan;
                        lastMergeCell = mergedCell;
                        if (mergedCell.topRow !== source.topRow + seriesIndex) {
                            continue;
                        }
                    } else if (mergedCell.leftCol === index && mergedCell.topRow === source.topRow + seriesIndex) {
                        itemIndex += 1;
                        lastMergeCell = mergedCell;
                    } else {
                        continue;
                    }
                } else {
                    if (lastMergeCell) {
                        itemIndex += lastMergeCell.columnSpan;
                        lastMergeCell = null;
                    } else {
                        itemIndex += 1;
                    }
                }
                val = this.getCellData(source.topRow + seriesIndex, index, false);
                if (val == null || val === '') {
                    continue;
                }
                if (wijmo.isNumber(val) || wijmo.isDate(val)) {
                    valueType = wijmo.isNumber(val) ? 'number' : 'date';
                    if (wijmo.isDate(val)) {
                        val = FlexSheet._toOADate(val);
                    }
                    if (seriesItems.length === 0) {
                        seriesStartIndex = index;
                        seriesType = valueType;
                        seriesItems.push(val);
                        itemIndexes.push(itemIndex);
                    } else {
                        if (valueType === seriesType) {
                            seriesItems.push(val);
                            itemIndexes.push(itemIndex);
                        } else {
                            if (srcIndex >= seriesStartIndex && srcIndex <= index) {
                                return {
                                    type: seriesType,
                                    startIndex: seriesStartIndex,
                                    endIndex: index - 1,
                                    items: seriesItems,
                                    itemIndexes: itemIndexes
                                };
                            } else {
                                seriesItems.splice(0, seriesItems.length);
                                itemIndexes.splice(0, itemIndexes.length);
                            }
                        }
                    }
                } else if (seriesItems.length > 0) {
                    if (srcIndex >= seriesStartIndex && srcIndex <= index) {
                        return {
                            type: seriesType,
                            startIndex: seriesStartIndex,
                            endIndex: index - 1,
                            items: seriesItems,
                            itemIndexes: itemIndexes
                        };
                    } else {
                        seriesItems.splice(0, seriesItems.length);
                        itemIndexes.splice(0, itemIndexes.length);
                    }
                }
            }
        }

        if (seriesItems.length > 0) {
            return {
                type: seriesType,
                startIndex: seriesStartIndex,
                endIndex: index - 1,
                items: seriesItems,
                itemIndexes: itemIndexes
            };
        }

        return null;
    }

    // Get the linear best fit trend data for filling series.
    // The approach of getting the linear best fit trend data refered the simple linear regression:
    // https://en.wikipedia.org/wiki/Simple_linear_regression
    private _getLinearBestFitTrendData(vals: number[], valIndexes: number[], index: number): number {
        let i: number,
            x: number,
            y: number,
            length: number,
            xSum: number = 0,
            ySum: number = 0,
            x2Sum: number = 0,
            xySum: number = 0,
            k: number,
            b: number;

        length = vals.length;
        if (length === 1) {
            return vals[0] + index - 1;
        }
        for (i = 0; i < valIndexes.length; i++) {
            x = valIndexes[i];
            y = vals[i];
            xSum += x;
            x2Sum += x * x;
            ySum += y;
            xySum += x * y;
        }

        k = (length * xySum - xSum * ySum) / (length * x2Sum - xSum * xSum);
        b = (ySum * x2Sum - xSum * xySum) / (length * x2Sum - xSum * xSum);

        return index * k + b;
    }

    // Get the original content and style of the cells in the fill range.
    _getCellSettingsForFill(fillSource?: wijmo.grid.CellRange, fillRange?: wijmo.grid.CellRange): any[] {
        let rowIndex: number,
            colIndex: number,
            content: any,
            style: ICellStyle,
            cellSetting: any[],
            mergedCell: wijmo.grid.CellRange;

        if (!fillSource) {
            fillSource = this._fillingSource;
        }
        if (!fillRange) {
            fillRange = this._fillingRange;
        }

        cellSetting = [];
        for (rowIndex = fillRange.topRow; rowIndex <= fillRange.bottomRow; rowIndex++) {
            for (colIndex = fillRange.leftCol; colIndex <= fillRange.rightCol; colIndex++) {
                if (rowIndex >= fillSource.topRow && rowIndex <= fillSource.bottomRow && colIndex >= fillSource.leftCol && colIndex <= fillSource.rightCol) {
                    continue;
                }
                content = this.getCellData(rowIndex, colIndex, false);
                style = this._cloneObject(this.selectedSheet.getCellStyle(rowIndex, colIndex));
                mergedCell = this.getMergedRange(this.cells, rowIndex, colIndex);
                if (!mergedCell || mergedCell.topRow !== rowIndex || mergedCell.leftCol !== colIndex) {
                    mergedCell = null;
                }

                cellSetting.push({
                    row: rowIndex,
                    col: colIndex,
                    value: content,
                    style: style,
                    mergedCell: mergedCell ? mergedCell.clone() : null
                });
            }
        }

        return cellSetting;
    }

    // Reset the original content or style of the cells in the fill range.
    private _resetCellsForFillRange(operation: AutoFillOperation) {
        let isCopyFormat = (operation & AutoFillOperation.CopyFormat) !== 0,
            isCopyContent = (operation & AutoFillOperation.CopyContent) !== 0,
            isFillSeries = (operation & AutoFillOperation.FillSeries) !== 0;

        if (this._orgCellSettings && this._orgCellSettings.length > 0) {
            for (let index = 0; index < this._orgCellSettings.length; index++) {
                let cellSetting = this._orgCellSettings[index],
                    rowIndex = cellSetting.row,
                    colIndex = cellSetting.col;

                if (!isCopyFormat) {
                    let cellIndex = rowIndex * this.columns.length + colIndex;
                    this.selectedSheet._styledCells[cellIndex] = cellSetting.style;
                }
                if (!isCopyContent && !isFillSeries) {
                    this.setCellData(rowIndex, colIndex, cellSetting.value);
                }
            }
        }
    }

    // Check whether the fill opeartion can be done.
    // The fill operation can be done with beneath situation:
    // 1. The size of the cells in the fill source are all same. 
    //    The size of the cell in the fill range is the same with its related source cell.
    //    The cells releated the source cell are single cell.
    // 2. The size of the cells in the fill source are different. 
    //    All the cells in fill range should be single cell.
    private _canDoFillOperation(): boolean {
        let source = this._fillingSource,
            range = this._fillingRange,
            multiSizeCells = false,
            rowIndex: number,
            colIndex: number,
            dstRowIndex: number,
            srcRowIndex: number,
            rowDiff: number,
            dstColIndex: number,
            srcColIndex: number,
            colDiff: number,
            dstMergedRange: wijmo.grid.CellRange,
            srcMergedRange: wijmo.grid.CellRange,
            lastMergedRange: wijmo.grid.CellRange,
            dstMergedRangeRowOffset: number,
            dstMergedRangeColOffset: number,
            srcMergedRangeRowOffset: number,
            srcMergedRangeColOffset: number;

        for (rowIndex = source.topRow; rowIndex <= source.bottomRow; rowIndex++) {
            for (colIndex = source.leftCol; colIndex <= source.rightCol; colIndex++) {
                srcMergedRange = this.getMergedRange(this.cells, rowIndex, colIndex);
                if (!lastMergedRange) {
                    lastMergedRange = srcMergedRange;
                } else if (!srcMergedRange || !lastMergedRange.equals(srcMergedRange)) {
                    multiSizeCells = true;
                    break;

                }
            }
        }

        for (dstRowIndex = range.topRow; dstRowIndex <= range.bottomRow; dstRowIndex++) {
            rowDiff = dstRowIndex - source.topRow;
            srcRowIndex = rowDiff % source.rowSpan;
            if (srcRowIndex < 0) {
                srcRowIndex += source.rowSpan;
            }
            srcRowIndex += source.topRow;
            for (dstColIndex = range.leftCol; dstColIndex <= range.rightCol; dstColIndex++) {
                colDiff = dstColIndex - source.leftCol;
                if (rowDiff >= 0 && rowDiff < source.rowSpan && colDiff >= 0 && colDiff < source.columnSpan) {
                    continue;
                }
                srcColIndex = colDiff % source.columnSpan;
                if (srcColIndex < 0) {
                    srcColIndex += source.columnSpan;
                }
                srcColIndex += source.leftCol;
                srcMergedRange = this.getMergedRange(this.cells, srcRowIndex, srcColIndex);
                dstMergedRange = this.getMergedRange(this.cells, dstRowIndex, dstColIndex);
                if (dstMergedRange) {
                    if (!multiSizeCells && srcMergedRange) {
                        dstMergedRangeRowOffset = dstMergedRange ? dstRowIndex - dstMergedRange.topRow : NaN;
                        dstMergedRangeColOffset = dstMergedRange ? dstColIndex - dstMergedRange.leftCol : NaN;
                        srcMergedRangeRowOffset = srcMergedRange ? srcRowIndex - srcMergedRange.topRow : NaN;
                        srcMergedRangeColOffset = srcMergedRange ? srcColIndex - srcMergedRange.leftCol : NaN;
                        if (dstMergedRangeRowOffset !== srcMergedRangeRowOffset || dstMergedRangeColOffset !== srcMergedRangeColOffset) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // Update the index of the item in the itemsSource when insert row into the bound sheet.
    _updateItemIndexForInsertingRow(items: any[], newItemIndex: number, rowCount: number) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item && item._itemIdx != null && item._itemIdx >= newItemIndex) {
                item._itemIdx += rowCount;
            }
        }
    }

    // Update the index of the item in the itemsSource when remove row from the bound sheet.
    _updateItemIndexForRemovingRow(items: any[], itemIndex: number) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item && item._itemIdx != null && item._itemIdx >= itemIndex) {
                item._itemIdx -= 1;
            }
        }
    }

    // Copy the rows of the FlexSheet to its selected sheet.
    _copyRowsToSelectedSheet() {
        if (!this.selectedSheet) {
            return;
        }
        this.selectedSheet.grid.rows.clear();
        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i] as wijmo.grid.Row;
            this.selectedSheet.grid.rows.push(row);
            row._list = this.rows; // restore the owner that was changed by the previous line (TFS 376511)
        }
        setTimeout(() => {
            this._setFlexSheetToDirty();
            this.invalidate();
        }, 10);
    }

    // Copy the columns of the FlexSheet to its selected sheet.
    // AlexI - made "internal" to fix TFS 292673
    /*private*/ _copyColumnsToSelectedSheet() {
        if (!this.selectedSheet) {
            return;
        }
        this.selectedSheet.grid.columns.clear();
        for (let i = 0; i < this.columns.length; i++) {
            let col = this.columns[i] as wijmo.grid.Column;
            this.selectedSheet.grid.columns.push(col);
            col._list = this.columns; // restore the owner that was changed by the previous line (TFS 376511)
        }
        setTimeout(() => {
            this._setFlexSheetToDirty();
            this.invalidate();
        }, 10);
    }

    //  Get unique column name for current sheet.
    private _getUniqueColumnName(): string {
        let columnName = 'col',
            index = 1;

        while (this.columns.getColumn(columnName + index) != null) {
            index++;
        }

        return columnName + index;
    }

    // Hide context menu of FlexSheet.
    private _hideContextMenu() {
        this._contextMenu.hide();
        this._tabHolder.sheetControl._contextMenu.hide();
    }

    // Parse the WorkbookTable instance to Table instance.
    private _parseFromWorkbookTable(workbookTable: wijmo.xlsx.WorkbookTable, sheet: Sheet): Table {
        var tableRange: wijmo.grid.CellRange,
            tableRefs: string[],
            tableRef1: string,
            tableRef2: string,
            tableAddress1: wijmo.xlsx.ITableAddress,
            tableAddress2: wijmo.xlsx.ITableAddress,
            sheetTableColumns: TableColumn[],
            tableColumn: wijmo.xlsx.WorkbookTableColumn,
            tableStyle: TableStyle,
            table: Table,
            addRowCnt: number,
            addColumnCnt: number,
            i: number,
            flex = sheet === this.selectedSheet ? this : sheet.grid;

        tableRefs = workbookTable.range.split(':');
        tableRef1 = tableRefs[0];
        tableRef2 = tableRefs[1];
        tableAddress1 = wijmo.xlsx.Workbook.tableAddress(tableRef1);
        tableRange = new wijmo.grid.CellRange(tableAddress1.row, tableAddress1.col);
        tableAddress2 = wijmo.xlsx.Workbook.tableAddress(tableRef2);
        tableRange.row2 = tableAddress2.row;
        tableRange.col2 = tableAddress2.col;

        if (tableRange.bottomRow >= sheet.rowCount) {
            addColumnCnt = tableRange.bottomRow - sheet.rowCount + 1;
            for (i = 0; i < addColumnCnt; i++) {
                flex.rows.push(new wijmo.grid.Row());
            }
        }

        if (tableRange.rightCol >= sheet.columnCount) {
            addColumnCnt = tableRange.rightCol - sheet.columnCount + 1;
            for (i = 0; i < addColumnCnt; i++) {
                flex.columns.push(new wijmo.grid.Column());
            }
        }

        if (workbookTable.columns && workbookTable.columns.length > 0) {
            sheetTableColumns = [];
            for (var i = 0; i < workbookTable.columns.length; i++) {
                tableColumn = workbookTable.columns[i];
                sheetTableColumns[i] = new TableColumn(tableColumn.name, tableColumn.totalRowLabel, tableColumn.totalRowFunction, tableColumn.showFilterButton);
            }
        }

        if (workbookTable.style != null) {
            if (this._isBuiltInStyleName(workbookTable.style.name)) {
                tableStyle = this.getBuiltInTableStyle(workbookTable.style.name);
            } else {
                tableStyle = this._parseFromWorkbookTableStyle(workbookTable.style);
            }
        }

        table = new Table(workbookTable.name, tableRange, tableStyle, sheetTableColumns, {
            showHeaderRow: workbookTable.showHeaderRow,
            showTotalRow: workbookTable.showTotalRow,
            showBandedColumns: workbookTable.showBandedColumns,
            showBandedRows: workbookTable.showBandedRows,
            alterFirstColumn: workbookTable.alterFirstColumn,
            alterLastColumn: workbookTable.alterLastColumn
        });
        sheet.tables.push(table);

        return table;
    }

    // Parse the WorkbookTableStyle instance to TableStyle instance.
    private _parseFromWorkbookTableStyle(tableStyle: wijmo.xlsx.WorkbookTableStyle): TableStyle {
        var sheetTableStyle = new TableStyle(tableStyle.name);
        if (tableStyle.firstBandedColumnStyle != null) {
            sheetTableStyle.firstBandedColumnStyle = this._parseFromWorkbookTableStyleElement(tableStyle.firstBandedColumnStyle);
        }
        if (tableStyle.firstBandedRowStyle != null) {
            sheetTableStyle.firstBandedRowStyle = this._parseFromWorkbookTableStyleElement(tableStyle.firstBandedRowStyle);
        }
        if (tableStyle.firstColumnStyle != null) {
            sheetTableStyle.firstColumnStyle = this._parseFromWorkbookTableStyleElement(tableStyle.firstColumnStyle);
        }
        if (tableStyle.firstHeaderCellStyle != null) {
            sheetTableStyle.firstHeaderCellStyle = this._parseFromWorkbookTableStyleElement(tableStyle.firstHeaderCellStyle);
        }
        if (tableStyle.firstTotalCellStyle != null) {
            sheetTableStyle.firstTotalCellStyle = this._parseFromWorkbookTableStyleElement(tableStyle.firstTotalCellStyle);
        }
        if (tableStyle.headerRowStyle != null) {
            sheetTableStyle.headerRowStyle = this._parseFromWorkbookTableStyleElement(tableStyle.headerRowStyle);
        }
        if (tableStyle.lastColumnStyle != null) {
            sheetTableStyle.lastColumnStyle = this._parseFromWorkbookTableStyleElement(tableStyle.lastColumnStyle);
        }
        if (tableStyle.lastHeaderCellStyle != null) {
            sheetTableStyle.lastHeaderCellStyle = this._parseFromWorkbookTableStyleElement(tableStyle.lastHeaderCellStyle);
        }
        if (tableStyle.lastTotalCellStyle != null) {
            sheetTableStyle.lastTotalCellStyle = this._parseFromWorkbookTableStyleElement(tableStyle.lastTotalCellStyle);
        }
        if (tableStyle.secondBandedColumnStyle != null) {
            sheetTableStyle.secondBandedColumnStyle = this._parseFromWorkbookTableStyleElement(tableStyle.secondBandedColumnStyle);
        }
        if (tableStyle.secondBandedRowStyle != null) {
            sheetTableStyle.secondBandedRowStyle = this._parseFromWorkbookTableStyleElement(tableStyle.secondBandedRowStyle);
        }
        if (tableStyle.totalRowStyle != null) {
            sheetTableStyle.totalRowStyle = this._parseFromWorkbookTableStyleElement(tableStyle.totalRowStyle);
        }
        if (tableStyle.wholeTableStyle != null) {
            sheetTableStyle.wholeTableStyle = this._parseFromWorkbookTableStyleElement(tableStyle.wholeTableStyle);
        }
        return sheetTableStyle;
    }

    // Parse the WorkbookTableStyleElement instance to Table style element.
    private _parseFromWorkbookTableStyleElement(tableStyleElement: any): any {
        var sheetTableStyleEle: any;
        sheetTableStyleEle = {
            fontWeight: tableStyleElement.font && tableStyleElement.font.bold ? 'bold' : 'none',
            fontStyle: tableStyleElement.font && tableStyleElement.font.italic ? 'italic' : 'none',
            textDecoration: tableStyleElement.font && tableStyleElement.font.underline ? 'underline' : 'none',
            fontFamily: tableStyleElement.font && tableStyleElement.font.family ? tableStyleElement.font.family : '',
            fontSize: tableStyleElement.font && tableStyleElement.font.size ? tableStyleElement.font.size + 'px' : '',
            color: tableStyleElement.font && tableStyleElement.font.color ? tableStyleElement.font.color : '',
            backgroundColor: tableStyleElement.fill && tableStyleElement.fill.color ? tableStyleElement.fill.color : ''
        }

        if (tableStyleElement.borders) {
            if (tableStyleElement.borders.left) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.left.style, 'Left', sheetTableStyleEle);
                sheetTableStyleEle.borderLeftColor = tableStyleElement.borders.left.color;
            }
            if (tableStyleElement.borders.right) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.right.style, 'Right', sheetTableStyleEle);
                sheetTableStyleEle.borderRightColor = tableStyleElement.borders.right.color;
            }
            if (tableStyleElement.borders.top) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.top.style, 'Top', sheetTableStyleEle);
                sheetTableStyleEle.borderTopColor = tableStyleElement.borders.top.color;
            }
            if (tableStyleElement.borders.bottom) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.bottom.style, 'Bottom', sheetTableStyleEle);
                sheetTableStyleEle.borderBottomColor = tableStyleElement.borders.bottom.color;
            }
            if (tableStyleElement.borders.vertical) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.vertical.style, 'Vertical', sheetTableStyleEle);
                sheetTableStyleEle.borderVerticalColor = tableStyleElement.borders.vertical.color;
            }
            if (tableStyleElement.borders.horizontal) {
                wijmo.grid.xlsx.FlexGridXlsxConverter._parseBorderStyle(tableStyleElement.borders.horizontal.style, 'Horizontal', sheetTableStyleEle);
                sheetTableStyleEle.borderHorizontalColor = tableStyleElement.borders.horizontal.color;
            }
        }

        if (tableStyleElement.size != null) {
            sheetTableStyleEle.size = tableStyleElement.size;
        }

        return sheetTableStyleEle;
    }

    // Parse the FlexSheet table to workbook table.
    private _parseToWorkbookTable(table: Table): wijmo.xlsx.WorkbookTable {
        var workbookTable = new wijmo.xlsx.WorkbookTable(),
            tableRange = table.getRange(),
            tableColumns = table.getColumns(),
            cellRef1: string,
            cellRef2: string;

        workbookTable.name = table.name;
        cellRef1 = wijmo.xlsx.Workbook.xlsxAddress(tableRange.topRow, tableRange.leftCol);
        cellRef2 = wijmo.xlsx.Workbook.xlsxAddress(tableRange.bottomRow, tableRange.rightCol);
        workbookTable.range = cellRef1 + ':' + cellRef2;
        if (table.style != null) {
            if (table.style.isBuiltIn) {
                workbookTable.style = new wijmo.xlsx.WorkbookTableStyle();
                workbookTable.style.name = table.style.name;
            } else {
                workbookTable.style = this._parseToWorkbookTableStyle(table.style);
            }
        }
        workbookTable.showBandedColumns = table.showBandedColumns;
        workbookTable.showBandedRows = table.showBandedRows;
        workbookTable.showHeaderRow = table.showHeaderRow;
        workbookTable.showTotalRow = table.showTotalRow;
        workbookTable.alterFirstColumn = table.alterFirstColumn;
        workbookTable.alterLastColumn = table.alterLastColumn;

        for (var i = 0; i < tableColumns.length; i++) {
            var column = tableColumns[i],
                workbookTableColumn = new wijmo.xlsx.WorkbookTableColumn();

            workbookTableColumn.name = column.name;
            workbookTableColumn.totalRowLabel = column.totalRowLabel;
            workbookTableColumn.totalRowFunction = column.totalRowFunction;
            workbookTableColumn.showFilterButton = column.showFilterButton;

            workbookTable.columns.push(workbookTableColumn);
        }

        return workbookTable;
    }

    // Parse the FlexSheet table style to workbook table style.
    private _parseToWorkbookTableStyle(tableStyle: TableStyle): wijmo.xlsx.WorkbookTableStyle {
        var workbookTableStyle = new wijmo.xlsx.WorkbookTableStyle();
        workbookTableStyle.name = tableStyle.name;
        if (tableStyle.firstBandedColumnStyle != null) {
            workbookTableStyle.firstBandedColumnStyle = this._parseToWorkbookTableStyleElement(tableStyle.firstBandedColumnStyle, true);
        }
        if (tableStyle.firstBandedRowStyle != null) {
            workbookTableStyle.firstBandedRowStyle = this._parseToWorkbookTableStyleElement(tableStyle.firstBandedRowStyle, true);
        }
        if (tableStyle.firstColumnStyle != null) {
            workbookTableStyle.firstColumnStyle = this._parseToWorkbookTableStyleElement(tableStyle.firstColumnStyle);
        }
        if (tableStyle.firstHeaderCellStyle != null) {
            workbookTableStyle.firstHeaderCellStyle = this._parseToWorkbookTableStyleElement(tableStyle.firstHeaderCellStyle);
        }
        if (tableStyle.firstTotalCellStyle != null) {
            workbookTableStyle.firstTotalCellStyle = this._parseToWorkbookTableStyleElement(tableStyle.firstTotalCellStyle);
        }
        if (tableStyle.headerRowStyle != null) {
            workbookTableStyle.headerRowStyle = this._parseToWorkbookTableStyleElement(tableStyle.headerRowStyle);
        }
        if (tableStyle.lastColumnStyle != null) {
            workbookTableStyle.lastColumnStyle = this._parseToWorkbookTableStyleElement(tableStyle.lastColumnStyle);
        }
        if (tableStyle.lastHeaderCellStyle != null) {
            workbookTableStyle.lastHeaderCellStyle = this._parseToWorkbookTableStyleElement(tableStyle.lastHeaderCellStyle);
        }
        if (tableStyle.lastTotalCellStyle != null) {
            workbookTableStyle.lastTotalCellStyle = this._parseToWorkbookTableStyleElement(tableStyle.lastTotalCellStyle);
        }
        if (tableStyle.secondBandedColumnStyle != null) {
            workbookTableStyle.secondBandedColumnStyle = this._parseToWorkbookTableStyleElement(tableStyle.secondBandedColumnStyle, true);
        }
        if (tableStyle.secondBandedRowStyle != null) {
            workbookTableStyle.secondBandedRowStyle = this._parseToWorkbookTableStyleElement(tableStyle.secondBandedRowStyle, true);
        }
        if (tableStyle.totalRowStyle != null) {
            workbookTableStyle.totalRowStyle = this._parseToWorkbookTableStyleElement(tableStyle.totalRowStyle);
        }
        if (tableStyle.wholeTableStyle != null) {
            workbookTableStyle.wholeTableStyle = this._parseToWorkbookTableStyleElement(tableStyle.wholeTableStyle);
        }
        return workbookTableStyle;
    }

    // Parse the FlexSheet table style element to workbook table style element.
    private _parseToWorkbookTableStyleElement(tableStyleElement: any, isBandedStyle: boolean = false): any {
        var workbookTableStyleEle: any,
            workbookTableStyleEleOM = wijmo.grid.xlsx.FlexGridXlsxConverter._parseCellStyle(tableStyleElement, true);

        if (isBandedStyle) {
            workbookTableStyleEle = new wijmo.xlsx.WorkbookTableBandedStyle();
            workbookTableStyleEle.size = tableStyleElement.size;
        } else {
            workbookTableStyleEle = new wijmo.xlsx.WorkbookTableCommonStyle();
        }
        workbookTableStyleEle._deserialize(workbookTableStyleEleOM);

        return workbookTableStyleEle;
    }

    // Check whether the style name is built-in table style of excel.
    private _isBuiltInStyleName(styleName: string): boolean {
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

    // Gets the table instance of FlexSheet by table name.
    _getTable(name: string): Table {
        var table: Table,
            sheetIndex: number,
            tables: wijmo.collections.ObservableArray,
            i: number;
        for (var sheetIndex = 0; sheetIndex < this.sheets.length; sheetIndex++) {
            tables = this.sheets[sheetIndex].tables;
            for (i = 0; i < tables.length; i++) {
                table = tables[i];
                if (table.name.toLowerCase() === name.toLowerCase()) {
                    return table;
                }
            }
        }
        return null;
    }

    // As the cell content in WorkbookTable header should be string, so we need reset the isDate property of the workbook cell to false.
    private _checkTableHeaderRow(tables: wijmo.collections.ObservableArray, workbook: wijmo.xlsx.Workbook) {
        let table: Table,
            index: number,
            rowIndex: number,
            cellIndex: number,
            tableHeaderRowRng: wijmo.grid.CellRange;

        for (index = 0; index < tables.length; index++) {
            table = tables[index];
            if (table.showHeaderRow) {
                tableHeaderRowRng = table.getRange(TableSection.Header);
                rowIndex = tableHeaderRowRng.row;
                for (cellIndex = tableHeaderRowRng.leftCol; cellIndex <= tableHeaderRowRng.rightCol; cellIndex++) {
                    workbook.sheets[0].rows[rowIndex].cells[cellIndex].isDate = false;
                }
            }
        }
    }

    // Get theme color.
    private _getThemeColor(theme: number, tint?: number): string {
        var themeColor = this._colorThemes[theme],
            color: wijmo.Color,
            hslArray: number[];

        if (tint != null) {
            color = new wijmo.Color('#' + themeColor);
            hslArray = color.getHsl();
            // About the tint value and theme color convert to rgb color, 
            // please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.color.aspx
            if (tint < 0) {
                hslArray[2] = hslArray[2] * (1.0 + tint);
            } else {
                hslArray[2] = hslArray[2] * (1.0 - tint) + (1 - 1 * (1.0 - tint));
            }
            color = wijmo.Color.fromHsl(hslArray[0], hslArray[1], hslArray[2]);
            return color.toString();
        }
        // if the color value is undefined, we should return the themeColor (TFS 121712)
        return '#' + themeColor;
    }

    // Create the built-in table style via its name
    private _createBuiltInTableStyle(styleName: string): TableStyle {
        var styleIndex: number;

        if (styleName.search(/TableStyleLight/i) === 0) {
            styleIndex = +styleName.substring(15);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 21) {
                if (styleIndex <= 7) {
                    return this._generateTableLightStyle1(styleIndex - 1, styleName, true);
                } else if (styleIndex <= 14) {
                    return this._generateTableLightStyle2(styleIndex - 8, styleName);
                } else {
                    return this._generateTableLightStyle1(styleIndex - 15, styleName, false);
                }
            }
        } else if (styleName.search(/TableStyleMedium/i) === 0) {
            styleIndex = +styleName.substring(16);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 28) {
                if (styleIndex <= 7) {
                    return this._generateTableMediumStyle1(styleIndex - 1, styleName);
                } else if (styleIndex <= 14) {
                    return this._generateTableMediumStyle2(styleIndex - 8, styleName);
                } else if (styleIndex <= 21) {
                    return this._generateTableMediumStyle3(styleIndex - 15, styleName);
                } else {
                    return this._generateTableMediumStyle4(styleIndex - 22, styleName);
                }
            }
        } else if (styleName.search(/TableStyleDark/i) === 0) {
            styleIndex = +styleName.substring(14);
            if (!isNaN(styleIndex) && styleIndex >= 1 && styleIndex <= 11) {
                if (styleIndex <= 7) {
                    return this._generateTableDarkStyle1(styleIndex - 1, styleName);
                } else {
                    return this._generateTableDarkStyle2(styleIndex - 8, styleName);
                }
            }
        }
        return null;
    }

    private _generateTableLightStyle1(styleIndex: number, styleName: string, isLowerStyle: boolean) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3,
            headerBorderWidth = isLowerStyle ? '1px' : '2px',
            totalBorderStyle = isLowerStyle ? 'solid' : 'double',
            totalBorderWidth = isLowerStyle ? '1px' : '3px';

        tableStyle.wholeTableStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomColor: this._getThemeColor(colorTheme),
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px'
        };
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold'
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold'
        };
        tableStyle.headerRowStyle = {
            borderBottomColor: this._getThemeColor(colorTheme),
            borderBottomStyle: 'solid',
            borderBottomWidth: headerBorderWidth,
            fontWeight: 'bold'
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: totalBorderStyle,
            borderTopWidth: totalBorderWidth,
            fontWeight: 'bold'
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.color = this._getThemeColor(colorTheme);
            tableStyle.firstColumnStyle.color = this._getThemeColor(colorTheme);
            tableStyle.lastColumnStyle.color = this._getThemeColor(colorTheme);
            tableStyle.headerRowStyle.color = this._getThemeColor(colorTheme);
            tableStyle.totalRowStyle.color = this._getThemeColor(colorTheme);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(0, -0.15)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(0, -0.15)
            };
        } else {
            if (isLowerStyle) {
                tableStyle.wholeTableStyle.color = this._getThemeColor(colorTheme, -0.25);
                tableStyle.firstColumnStyle.color = this._getThemeColor(colorTheme, -0.25);
                tableStyle.lastColumnStyle.color = this._getThemeColor(colorTheme, -0.25);
                tableStyle.headerRowStyle.color = this._getThemeColor(colorTheme, -0.25);
                tableStyle.totalRowStyle.color = this._getThemeColor(colorTheme, -0.25);
            } else {
                tableStyle.wholeTableStyle.color = this._getThemeColor(1);
                tableStyle.firstColumnStyle.color = this._getThemeColor(1);
                tableStyle.lastColumnStyle.color = this._getThemeColor(1);
                tableStyle.headerRowStyle.color = this._getThemeColor(1);
                tableStyle.totalRowStyle.color = this._getThemeColor(1);
            }
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.8)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.8)
            };
        }

        if (!isLowerStyle) {
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderLeftStyle = 'solid';
            tableStyle.wholeTableStyle.borderLeftWidth = '1px';
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderRightStyle = 'solid';
            tableStyle.wholeTableStyle.borderRightWidth = '1px';
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderHorizontalStyle = 'solid';
            tableStyle.wholeTableStyle.borderHorizontalWidth = '1px';
            tableStyle.wholeTableStyle.borderVerticalColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderVerticalStyle = 'solid';
            tableStyle.wholeTableStyle.borderVerticalWidth = '1px';
        }

        return tableStyle;
    }

    private _generateTableLightStyle2(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3;

        tableStyle.wholeTableStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomColor: this._getThemeColor(colorTheme),
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftColor: this._getThemeColor(colorTheme),
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightColor: this._getThemeColor(colorTheme),
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            color: this._getThemeColor(1)
        };
        tableStyle.firstBandedRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'solid',
            borderTopWidth: '1px'
        };
        tableStyle.secondBandedRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'solid',
            borderTopWidth: '1px'
        };
        tableStyle.firstBandedColumnStyle = {
            borderLeftColor: this._getThemeColor(colorTheme),
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px'
        };
        tableStyle.secondBandedColumnStyle = {
            borderLeftColor: this._getThemeColor(colorTheme),
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px'
        };
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.headerRowStyle = {
            backgroundColor: this._getThemeColor(colorTheme),
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };

        return tableStyle;
    }

    private _generateTableMediumStyle1(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3;

        tableStyle.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            color: this._getThemeColor(1)
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.borderTopColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderBottomColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(colorTheme);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(0, -0.15)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(0, -0.15)
            };
        } else {
            tableStyle.wholeTableStyle.borderTopColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderBottomColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.8)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.8)
            };
        }
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.headerRowStyle = {
            backgroundColor: this._getThemeColor(colorTheme),
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };

        return tableStyle;
    }

    private _generateTableMediumStyle2(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3;

        tableStyle.wholeTableStyle = {
            borderVerticalStyle: 'solid',
            borderVerticalWidth: '1px',
            borderVerticalColor: this._getThemeColor(0),
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            borderHorizontalColor: this._getThemeColor(0),
            color: this._getThemeColor(1)
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(0, -0.15);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(0, -0.35)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(0, -0.35)
            };
        } else {
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(colorTheme, 0.8);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.6)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.6)
            };
        }
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme)
        };
        tableStyle.headerRowStyle = {
            borderBottomColor: this._getThemeColor(0),
            borderBottomStyle: 'solid',
            borderBottomWidth: '3px',
            backgroundColor: this._getThemeColor(colorTheme),
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(0),
            borderTopStyle: 'solid',
            borderTopWidth: '3px',
            backgroundColor: this._getThemeColor(colorTheme),
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };

        return tableStyle;
    }

    private _generateTableMediumStyle3(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3;

        tableStyle.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            borderTopColor: this._getThemeColor(1),
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            borderBottomColor: this._getThemeColor(1),
            color: this._getThemeColor(1)
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(1);
            tableStyle.wholeTableStyle.borderLeftStyle = 'solid';
            tableStyle.wholeTableStyle.borderLeftWidth = '1px';
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(1);
            tableStyle.wholeTableStyle.borderRightStyle = 'solid';
            tableStyle.wholeTableStyle.borderRightWidth = '1px';
            tableStyle.wholeTableStyle.borderVerticalColor = this._getThemeColor(1);
            tableStyle.wholeTableStyle.borderVerticalStyle = 'solid';
            tableStyle.wholeTableStyle.borderVerticalWidth = '1px';
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(1);
            tableStyle.wholeTableStyle.borderHorizontalStyle = 'solid';
            tableStyle.wholeTableStyle.borderHorizontalWidth = '1px';
        }
        tableStyle.firstBandedRowStyle = {
            backgroundColor: this._getThemeColor(0, -0.35)
        };
        tableStyle.firstBandedColumnStyle = {
            backgroundColor: this._getThemeColor(0, -0.35)
        };
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme)
        };
        tableStyle.headerRowStyle = {
            borderBottomColor: this._getThemeColor(1),
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            backgroundColor: this._getThemeColor(colorTheme),
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(1),
            borderTopStyle: 'double',
            borderTopWidth: '3px'
        };

        return tableStyle;
    }

    private _generateTableMediumStyle4(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3;

        tableStyle.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderVerticalStyle: 'solid',
            borderVerticalWidth: '1px',
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            color: this._getThemeColor(1)
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.borderTopColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderBottomColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderVerticalColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(colorTheme);
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(0, -0.15);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(0, -0.35)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(0, -0.35)
            };
        } else {
            tableStyle.wholeTableStyle.borderTopColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderBottomColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderLeftColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderRightColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderVerticalColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.borderHorizontalColor = this._getThemeColor(colorTheme, 0.4);
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(colorTheme, 0.8);
            tableStyle.firstBandedRowStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.6)
            };
            tableStyle.firstBandedColumnStyle = {
                backgroundColor: this._getThemeColor(colorTheme, 0.6)
            };
        }
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.headerRowStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(colorTheme),
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            fontWeight: 'bold',
            color: this._getThemeColor(1),
        };

        return tableStyle;
    }

    private _generateTableDarkStyle1(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 1 : styleIndex + 3,
            tint = styleIndex === 0 ? 0.25 : -0.25;

        tableStyle.wholeTableStyle = {
            color: this._getThemeColor(0)
        };
        tableStyle.firstBandedRowStyle = {
            backgroundColor: this._getThemeColor(colorTheme, tint)
        };
        tableStyle.firstBandedColumnStyle = {
            backgroundColor: this._getThemeColor(colorTheme, tint)
        };
        tableStyle.firstColumnStyle = {
            borderRightColor: this._getThemeColor(0),
            borderRightStyle: 'solid',
            borderRightWidth: '2px',
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme, tint)
        };
        tableStyle.lastColumnStyle = {
            borderLeftColor: this._getThemeColor(0),
            borderLeftStyle: 'solid',
            borderLeftWidth: '2px',
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme, tint)
        };
        tableStyle.headerRowStyle = {
            borderBottomColor: this._getThemeColor(0),
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            fontWeight: 'bold',
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(1)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(0),
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            fontWeight: 'bold',
            color: this._getThemeColor(0)
        };
        if (styleIndex === 0) {
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(colorTheme, 0.5);
            tableStyle.totalRowStyle.backgroundColor = this._getThemeColor(colorTheme, 0.15)
        } else {
            tableStyle.wholeTableStyle.backgroundColor = this._getThemeColor(colorTheme);
            tableStyle.totalRowStyle.backgroundColor = this._getThemeColor(colorTheme, -0.5);
        }

        return tableStyle;
    }

    private _generateTableDarkStyle2(styleIndex: number, styleName: string) {
        var tableStyle = new TableStyle(styleName, true),
            colorTheme = styleIndex === 0 ? 0 : 2 * styleIndex + 2,
            colorTheme2 = styleIndex === 0 ? 1 : 2 * styleIndex + 3,
            tint = styleIndex === 0 ? -0.15 : 0.8;

        tableStyle.wholeTableStyle = {
            backgroundColor: this._getThemeColor(colorTheme, tint)
        };
        tableStyle.firstBandedRowStyle = {
            backgroundColor: this._getThemeColor(colorTheme, tint - 0.2)
        };
        tableStyle.firstBandedColumnStyle = {
            backgroundColor: this._getThemeColor(colorTheme, tint - 0.2)
        };
        tableStyle.firstColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.lastColumnStyle = {
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };
        tableStyle.headerRowStyle = {
            color: this._getThemeColor(0),
            backgroundColor: this._getThemeColor(colorTheme2)
        };
        tableStyle.totalRowStyle = {
            borderTopColor: this._getThemeColor(1),
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: this._getThemeColor(1)
        };

        return tableStyle;
    }

    static _getHeaderRowText(col: wijmo.grid.Column): string {
        let b = col.binding,
            h = col['_hdr'];

        if (h == null || h.trim() == '') {
            h = wijmo.toHeaderCase(b || '');
        }

        return h;
    }

    // convert the common date to OLE Automation date.
    static _toOADate(val: Date): number {
        let d = new Date(1900, 0, 0),
            epoch = Date.UTC(1900, 0, 0), // 1899-12-31T00:00:00
            offset = d.getTime() - epoch - d.getTimezoneOffset() * 60000,
            timezonOffset = (val.getTimezoneOffset() - d.getTimezoneOffset()) * 60000,
            oADate: number;

        oADate = (val.getTime() - d.getTime() - (timezonOffset !== 0 ? timezonOffset - offset : 0)) / 8.64e7;
        // This is a workaround for the excel leap year bug.
        // https://support.microsoft.com/en-us/help/214326/excel-incorrectly-assumes-that-the-year-1900-is-a-leap-year
        oADate += (oADate > 59 ? 1 : 0);

        return oADate;
    }

    // convert the OLE Automation date to common date.
    static _fromOADate(oADate: number): Date {
        let d = new Date(1900, 0, 0),
            utcD = Date.UTC(1900, 0, 0),
            offset = d.getTime() - utcD - d.getTimezoneOffset() * 60000,
            timezonOffset: number,
            dateOffset: number,
            inputDate: Date;

        // This is a workaround for the excel leap year bug.
        // https://support.microsoft.com/en-us/help/214326/excel-incorrectly-assumes-that-the-year-1900-is-a-leap-year
        dateOffset = oADate > 59 ? 1 : 0;

        inputDate = new Date(d.getTime() + (oADate - dateOffset) * 8.64e7);
        timezonOffset = (inputDate.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;

        if (timezonOffset !== 0) {
            return new Date(d.getTime() + timezonOffset - offset + (oADate - dateOffset) * 8.64e7);
        }
        return inputDate;
    }
}

/**
 * Provides arguments for the {@link FlexSheet.draggingRowColumn} event.
 */
export class DraggingRowColumnEventArgs extends wijmo.EventArgs {
    private _isDraggingRows: boolean;
    private _isShiftKey: boolean;
    private _draggingRange: wijmo.grid.CellRange;

    /**
     * Initializes a new instance of the {@link DraggingRowColumnEventArgs} class.
     *
     * @param draggingRange The dragging cells range.
     * @param isDraggingRows Indicates whether the dragging event is triggered due to dragging rows or columns.
     * @param isShiftKey Indicates whether the shift key is pressed when dragging.
     */
    constructor(draggingRange: wijmo.grid.CellRange, isDraggingRows: boolean, isShiftKey: boolean) {
        super();

        this._draggingRange = draggingRange;
        this._isDraggingRows = isDraggingRows;
        this._isShiftKey = isShiftKey;
    }

    /**
     * Gets the dragging cells range.
     */
    get draggingRange(): wijmo.grid.CellRange {
        return this._draggingRange;
    }

    /**
     * Gets a value indicating whether the event refers to dragging rows or columns.
     */
    get isDraggingRows(): boolean {
        return this._isDraggingRows;
    }

    /**
     * Gets a value indicating whether the shift key is pressed.
     */
    get isShiftKey(): boolean {
        return this._isShiftKey;
    }
}

/**
 * Provides arguments for the {@link FlexSheet.beginDroppingRowColumn} event.
 */
export class DroppingRowColumnEventArgs extends wijmo.CancelEventArgs {
    private _droppingRange: wijmo.grid.CellRange;
    private _isDroppingRows: boolean;

    /**
     * Initializes a new instance of the {@link DroppingRowColumnEventArgs} class.
     *
     * @param droppingRange The dropping cells range.
     * @param isDroppingRows Indicates whether the dropping event is triggered due to dropping rows or columns.
     */
    constructor(droppingRange: wijmo.grid.CellRange, isDroppingRows: boolean) {
        super();

        this._droppingRange = droppingRange;
        this._isDroppingRows = isDroppingRows;
    }

    /**
     * Gets the dragging cells range.
     */
    get droppingRange(): wijmo.grid.CellRange {
        return this._droppingRange;
    }

    /**
     * Gets a value indicating whether the event refers to dropping rows or columns.
     */
    get isDroppingRows(): boolean {
        return this._isDroppingRows;
    }
}

/**
 * Provides arguments for unknown function events.
 */
export class UnknownFunctionEventArgs extends wijmo.EventArgs {
    private _funcName: string;
    private _params: any[];
    /**
     * Gets or sets the result for the unknown funtion.
     */
    value: string;

    /**
     * Initializes a new instance of the {@link UnknownFunctionEventArgs} class.
     *
     * @param funcName The name of the unknown function.
     * @param params The parameters' value list of the nuknown function.
     */
    constructor(funcName: string, params: any[]) {
        super();

        this._funcName = funcName;
        this._params = params;
    }

    /**
     * Gets the name of the unknown function.
     */
    get funcName(): string {
        return this._funcName;
    }

    /**
     * Gets the parameters' value list of the nuknown function.
     */
    get params(): any[] {
        return this._params;
    }
}

/**
 * Provides arguments for rows or columns changed events.
 */
export class RowColumnChangedEventArgs extends wijmo.EventArgs {
    private _index: number;
    private _count: number;
    private _added: boolean;
    private _ranges: wijmo.grid.CellRange[];

    /**
     * Initializes a new instance of the @see:RowColumnChangedEventArgs class.
     *
     * @param index The start index of the changed rows or columns.
     * @param count The added or removed count of the rows or columns.
     * @param added The value indicates the event is for adding ot removing rows or columns.
     * @param isCol Determines whether the changes are related to columns or rows.
     */
    constructor(index: number, count: number, added: boolean, isCol: boolean);
    /**
     * Initializes a new instance of the {@link RowColumnChangedEventArgs} class.
     *
     * @param ranges An array of {@link CellRange} instances that determines the changed rows or columns.
     * @param added The value indicates the event is for adding ot removing rows or columns.
     * @param isCol Determines whether the changes are related to columns or rows.
     */
    constructor(ranges: wijmo.grid.CellRange[], added: boolean, isCol: boolean);
    constructor(indexOrRanges: number | wijmo.grid.CellRange[], countOrAdded: number | boolean, addedOrIsCol?: boolean, isCol?: boolean) {
        super();

        if (wijmo.isArray(indexOrRanges)) {
            this._ranges = <wijmo.grid.CellRange[]>indexOrRanges;
            this._added = <boolean>countOrAdded;

            if (indexOrRanges.length === 1) { // extract index and count from the first element
                let item = indexOrRanges[0] as wijmo.grid.CellRange;
                if (addedOrIsCol) {
                    this._index = item.leftCol;
                    this._count = item.columnSpan;
                } else {
                    this._index = item.topRow;
                    this._count = item.rowSpan;
                }
            } else {
                this._index = -1;
                this._count = -1;
            }
        }
        else {
            this._index = <number>indexOrRanges;
            this._count = <number>countOrAdded;
            this._added = addedOrIsCol;
            this._ranges = isCol
                ? [new wijmo.grid.CellRange(-1, this._index, -1, this._index + this._count - 1)]
                : [new wijmo.grid.CellRange(this._index, -1, this._index + this._count - 1, -1)];
        }
    }

    /**
     * Gets an array of {@link CellRange} instances that determines the changed rows or columns.
     */
    get ranges(): wijmo.grid.CellRange[] {
        return this._ranges;
    }

    /**
     * Gets the start index of the changed rows or columns.
     * Returns -1 if an array of {@link CellRange} objects containing more than 1 element was used when creating the instance.
     */
    get index(): number {
        return this._index;
    }

    /**
     * Gets the added or removed count of the rows or columns.
     * Returns -1 if an array of {@link CellRange} objects containing more than 1 element was used when creating the instance.
     */
    get count(): number {
        return this._count;
    }
    /**
    * Gets the value indicates the event is for adding ot removing rows or columns.
    */
    get added(): boolean {
        return this._added;
    }

    /*
     * Gets the value indicates the event is for adding ot removing rows or columns.
     */
    get isAdd(): boolean {
        wijmo._deprecated('RowColumnChangedEventArgs.isAdd', 'RowColumnChangedEventArgs.added');
        return this._added;
    }
}

/**
 * Provides arguments for the {@link FlexSheet.autoFilling} event.
 */
export class AutoFillingEventArgs extends wijmo.CancelEventArgs {
    private _range: wijmo.grid.CellRange;
    private _op: AutoFillOperation;

    /**
     * Initializes a new instance of the {@link AutoFillingEventArgs} class.
     * @param range Range of cells affected by the event.
     * @param operation The auto-fill operation.
     */
    constructor(range: wijmo.grid.CellRange, operation: AutoFillOperation) {
        super();
        this._range = range;
        this._op = operation;
    }

    /**
     * Gets the {@link CellRange} affected by this event.
     */
    public get range(): wijmo.grid.CellRange {
        return this._range;
    }

    /**
     * Gets the auto-fill operation.
     */
    public get operation(): AutoFillOperation {
        return this._op;
    }
}

/**
 * Provides arguments for the {@link FlexSheet.autoFilled} event.
 */
export class AutoFilledEventArgs extends wijmo.EventArgs {
    private _range: wijmo.grid.CellRange;
    private _op: AutoFillOperation;

    /**
     * Initializes a new instance of the {@link AutoFilledEventArgs} class.
     * @param range Range of cells affected by the event.
     * @param operation The auto-fill operation.
     */
    constructor(range: wijmo.grid.CellRange, operation: AutoFillOperation) {
        super();
        this._range = range;
        this._op = operation;
    }

    /**
     * Gets the {@link CellRange} affected by this event.
     */
    public get range(): wijmo.grid.CellRange {
        return this._range;
    }

    /**
     * Gets the auto-fill operation.
     */
    public get operation(): AutoFillOperation {
        return this._op;
    }
}

/**
 * Defines the extension of the {@link GridPanel} class, which is used by <b>FlexSheet</b> where 
 * the base {@link FlexGrid} class uses {@link GridPanel}. For example, the <b>cells</b> property returns an instance
 * of this class.
 */
export class FlexSheetPanel extends wijmo.grid.GridPanel {

    /**
     * Initializes a new instance of the {@link FlexSheetPanel} class.
     *
     * @param grid The {@link FlexGrid} object that owns the panel.
     * @param cellType The type of cell in the panel.
     * @param rows The rows displayed in the panel.
     * @param cols The columns displayed in the panel.
     * @param element The HTMLElement that hosts the cells in the control.
     */
    constructor(grid: wijmo.grid.FlexGrid, cellType: wijmo.grid.CellType, rows: wijmo.grid.RowCollection, cols: wijmo.grid.ColumnCollection, element: HTMLElement) {
        super(grid, cellType, rows, cols, element);
    }

    /**
     * Gets a {@link SelectedState} value that indicates the selected state of a cell.
     *
     * Overrides this method to support multiple selection showSelectedHeaders for {@link FlexSheet}
     *
     * @param r Row index of the cell to inspect.
     * @param c Column index of the cell to inspect.
     * @param rng {@link CellRange} that contains the cell to inspect.
     */
    getSelectedState(r: number, c: number, rng: wijmo.grid.CellRange): wijmo.grid.SelectedState {
        if (!this.grid) {
            return undefined;
        }

        let sheet = (this.grid as FlexSheet).selectedSheet,
            selections = sheet ? sheet.selectionRanges : null,
            selectionCnt = selections ? selections.length : 0,
            selectedState = super.getSelectedState(r, c, rng);

        if (selectedState === wijmo.grid.SelectedState.None && selectionCnt > 0) {
            let mergedRange = this.grid.getMergedRange(this, r, c),
                lastColIdx = this.columns.length - 1,
                lastRowIdx = this.rows.length - 1;

            for (let index = 0; index < selections.length; index++) {
                let selection = selections[index];

                if (selection && selection instanceof wijmo.grid.CellRange) {
                    if (this.cellType === wijmo.grid.CellType.Cell) {
                        if (mergedRange) {
                            if (mergedRange.contains(selection.row, selection.col)) {
                                if (index === selectionCnt - 1 && !(<FlexSheet>this.grid)._isClicking) {
                                    return this.grid.showMarquee ? wijmo.grid.SelectedState.None : wijmo.grid.SelectedState.Cursor;
                                }
                                return wijmo.grid.SelectedState.Selected;
                            }
                            if (mergedRange.intersects(selection)) {
                                return wijmo.grid.SelectedState.Selected;
                            }
                        }

                        if (selection.row === r && selection.col === c) {
                            if (index === selectionCnt - 1 && !(<FlexSheet>this.grid)._isClicking) {
                                return this.grid.showMarquee ? wijmo.grid.SelectedState.None : wijmo.grid.SelectedState.Cursor;
                            }
                            return wijmo.grid.SelectedState.Selected;
                        }
                        if (selection.contains(r, c)) {
                            return wijmo.grid.SelectedState.Selected;
                        }
                    }

                    if (this.cellType === wijmo.grid.CellType.RowHeader
                        && this.grid.showSelectedHeaders & wijmo.grid.HeadersVisibility.Row
                        && c === lastColIdx // this._lastVisRowHeaderColumnIdx
                        && selection.containsRow(r)) {
                        return wijmo.grid.SelectedState.Selected;
                    }

                    if (this.cellType === wijmo.grid.CellType.ColumnHeader
                        && this.grid.showSelectedHeaders & wijmo.grid.HeadersVisibility.Column
                        && r === lastRowIdx // this._lastVisColumnHeaderRowIdx
                        && selection.containsColumn(c)) {
                        return wijmo.grid.SelectedState.Selected;
                    }
                }
            }
        }

        return selectedState;
    }

    /**
     * Gets the value stored in a cell in the panel.
     *
     * @param r The row index of the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param formatted Whether to format the value for display.
     */
    getCellData(r: number, c: any, formatted: boolean): any {
        // get column index by name or binding
        if (wijmo.isString(c)) {
            c = this.columns.indexOf(c);
            if (c < 0) {
                throw 'Invalid column name or binding.';
            }
        }

        if (r >= this.rows.length || wijmo.asNumber(c, false, true) >= this.columns.length) {
            return null;
        }

        if (this.cellType === wijmo.grid.CellType.RowHeader) {
            return (r + 1) + '';
        }

        let col = <wijmo.grid.Column>this.columns[wijmo.asNumber(c, false, true)],
            bcol = this.grid ? this.grid._getBindingColumn(this, r, col) : col,
            fs = <FlexSheet>this.grid;

        if (this.cellType === wijmo.grid.CellType.ColumnHeader) {
            let row = this.rows[r] as wijmo.grid.Row;

            if (row && row._ubv && row._ubv[col._hash] != null) { // 394801: The cell contains data that was previously set using setCellData.
                return super.getCellData(r, c, formatted);
            }

            let ss = fs && fs.selectedSheet;

            if (!(ss && ss.itemsSource) && !(fs && fs.itemsSource)) {
                if ((ss && ss._showDefaultHeader) || bcol.header == null) {
                    return FlexSheet.convertNumberToAlpha(c);
                } else {
                    return bcol.header;
                }
            } else {
                let hdr = bcol['_hdr'];
                if ((ss && ss._showDefaultHeader) || hdr == null || hdr === bcol.binding || hdr === wijmo.toHeaderCase(bcol.binding)) {
                    return FlexSheet.convertNumberToAlpha(c);
                } else {
                    return hdr;
                }
            }
        } else {
            if (formatted && !(bcol && bcol.dataMap)) {
                if (_isEditingCell(this.grid, r, c)) { // Never apply cellStyle.format/column.format to a cell being edited (419341 Case 1, 467178), always use default formatting.
                    let data = super.getCellData(r, c, false);
                    return wijmo.Globalize.format(data, null);
                } else { // Apply cellStyle.format, if any
                    let cs = fs && fs._getCellStyle(r, c);
                    if (cs && cs.format) {
                        let data = super.getCellData(r, c, false);
                        if (wijmo.isDate(data) || wijmo.isNumber(data)) {
                            return wijmo.Globalize.format(data, cs.format);
                        }
                    }
                }
            }

            return super.getCellData(r, c, formatted);
        }
    }

    /**
     * Sets the content of a cell in the panel.
     *
     * @param r The index of the row that contains the cell.
     * @param c The index, name, or binding of the column that contains the cell.
     * @param value The value to store in the cell.
     * @param coerce A value indicating whether to change the value automatically to match the column's data type.
     * @param invalidate Whether to invalidate the FlexSheet to show the change.
     * @return Returns true if the value is stored successfully, otherwise false (failed cast).
     */
    setCellData(r: number, c: any, value: any, coerce = true, invalidate = true): boolean {
        if (r >= this.rows.length || c >= this.columns.length) {
            return false;
        }

        let bcol = this.grid ? this.grid._getBindingColumn(this, r, this.columns[c]) : this.columns[c],
            row = this.rows[r],
            valueFormat: string; // value's format of the cell being copied

        if (value instanceof _ValWithFormat) {
            valueFormat = value.format;
            value = value.value;
        }

        // Always parse the value when pasting (467721)
        if ((<FlexSheet>this.grid)._isPasting) {
            // isPasting = true and coerce = false means that the value being pasted was copied from a cell's editor or outside of the FlexSheet, otherwise coerce = true.
            // (_EditHandler calls g.setCellData with a default value of the "coerce" argument which is overrided in FlexSheet to "false")
            coerce = true;
        }

        let isStr = wijmo.isString(value);

        // The content of the table header cells are not allowed to set to null or empty string (TFS 382311: except for the data-mapped columns).
        if (this.grid && (<FlexSheet>this.grid).selectedSheet) {
            let table = (<FlexSheet>this.grid).selectedSheet.findTable(r, c);
            if (table && table._isHeaderRow(r)) {
                if ((value == null || (isStr && wijmo.isNullOrWhiteSpace(value) && !bcol.dataMap))) { // TFS 382311, allow empty strings for the data-mapped columns.
                    return;
                } else {
                    if (row instanceof HeaderRow) {
                        row._ubv[bcol._hash] = value.toString();
                    } else {
                        // Do not convert boolean to string in the table header cell (TFS 465924)
                        value = bcol.dataType === wijmo.DataType.Boolean && wijmo.isBoolean(value) ? value : value.toString();
                        return super.setCellData(r, c, value, false, invalidate);
                    }
                }
            }
        }

        let isAposStr = isStr && value[0] === '\'',
            isFormula = isStr && _isFormula(value);

        if (coerce && value && (bcol.dataType !== wijmo.DataType.String) && isStr && !isAposStr && !isFormula) {
            let l10n = wijmo.culture.Globalize,
                orgStringVal = this.getCellData(r, c, true);

            if (orgStringVal === value) {
                return true;
            }

            let cellStyle = this.grid ? (<FlexSheet>this.grid)._getCellStyle(r, c) : null,
                format = valueFormat || (cellStyle && cellStyle.format) || bcol.format,
                parsedDateVal = null;

            if (format && /[yYMhsmt\:-]/.test(format) && !/[pc]/.test(format)) { // If it looks like a date-time format (and doesn't look like a number format, TFS 470352)
                parsedDateVal = wijmo.Globalize.parseDate(value, format);
            }

            // Failed (TFS 436303) or format is not set? Try to use the default formatting ("d") then.
            if (parsedDateVal == null && (value.indexOf(l10n.calendar['/']) >= 0)) {
                parsedDateVal = wijmo.Globalize.parseDate(value, null);
            }

            if (parsedDateVal) {
                value = parsedDateVal;
            } else {
                let isCurrency = false,
                    isPercentage = false;

                // test for currency
                // var cs = l10n.numberFormat.currency.symbol;
                //if (!isPureNumber && !isPercentage && value.indexOf(cs) >= 0) {
                //    var tmp = value.replace('-', '').replace('(', '').replace(')', '').trim();
                //    isCurrency = tmp.indexOf(cs) === 0 || tmp.lastIndexOf(cs) === tmp.length - cs.length;
                //}

                if (!wijmo.isNullOrWhiteSpace(value) && (
                    // A rough checks, the changeType method will do the rest
                    (isPercentage = value[value.length - 1] === '%') ||
                    // If the guess is wrong, the penalty can be significant. Maybe we should use a stricter check (see above).
                    (isCurrency = value.indexOf(l10n.numberFormat.currency.symbol) >= 0) ||
                    !/[^-\d,\.]/.test(value) // contains only digit/dot/comma/minus characters
                )) {
                    let parsedVal = wijmo.changeType(value, wijmo.DataType.Number, '');
                    if (wijmo.isNumber(parsedVal)) {
                        value = parsedVal;
                        if (!format && (!bcol.dataType /* undefined or Object */ || bcol.dataType === wijmo.DataType.Number)) { // apply style formatting only if the value matches the dataType (467721).
                            if (isCurrency) {
                                (<FlexSheet>this.grid).applyCellsStyle({ format: 'C' + (wijmo.isInt(value) ? '0' : '') }, [new wijmo.grid.CellRange(r, c)]);
                            } else if (isPercentage) {
                                (<FlexSheet>this.grid).applyCellsStyle({ format: 'P' + (wijmo.isInt(value * 100) ? '0' : '') }, [new wijmo.grid.CellRange(r, c)]);
                            }
                        }
                    } else {
                        coerce = false;
                    }
                } else if (bcol.dataType === wijmo.DataType.Boolean) {
                    value = wijmo.changeType(value, wijmo.DataType.Boolean, null);
                }
            }
        }

        // When the cell data is formula, we shall not force to change the data type of the cell data.
        if (isFormula || isAposStr || !bcol.dataType) {
            coerce = false;
        }

        if (row instanceof HeaderRow) {
            row._ubv[bcol._hash] = value;
        } else {
            return super.setCellData(r, c, value, coerce, invalidate);
        }
    }

    // renders a cell
    // It overrides the _renderCell method of the parent class GridPanel.
    _renderCell(row: HTMLElement, r: number, c: number, vrng: wijmo.grid.CellRange, state: boolean, ctr: number): number {
        let cellIndex = r * this.grid.columns.length + c,
            mr = this.grid.getMergedRange(this, r, c);

        let updatedCtr = super._renderCell(row, r, c, vrng, state, ctr);

        if (this.cellType !== wijmo.grid.CellType.Cell) {
            return updatedCtr;
        }

        // skip over cells that have been merged over
        if (mr) {
            if (cellIndex > mr.topRow * this.grid.columns.length + mr.leftCol) {
                return updatedCtr;
            }
        }

        // skip hidden and non-merged columns
        let col = this.columns[c] as wijmo.grid.Column;
        if (col.renderSize <= 0) {
            if (!mr || mr.getRenderSize(this).width <= 0) {
                return updatedCtr;
            }
        }

        let cell = <HTMLElement>row.childNodes[ctr];

        if (cell) {
            let ss = (<FlexSheet>this.grid).selectedSheet;

            if (ss && !_isEditingCell(this.grid, r, c)) {
                // if the cell is located in Table, will apply the related table styles for the cell.
                let table = ss.findTable(r, c);
                if (table) {
                    table._updateCell(r, c, cell);
                }
            }

            let cs = ss ? ss._styledCells[cellIndex] : null,
                multiSel: boolean;

            if (wijmo.hasClass(cell, 'wj-state-selected') || (multiSel = wijmo.hasClass(cell, 'wj-state-multi-selected'))) {
                // If the cell is selected state, we'll remove the custom background color and font color style.
                // TFS 467674: The cell can be customized by formatItem/itemFormatter, so remove these styles only if they are overriden by applyCellsStyle.
                if (cs && cs.backgroundColor) {
                    cell.style.backgroundColor = '';
                }
                if (cs && cs.color) {
                    cell.style.color = '';
                }

                // If the cell has an individual background color then make it visible through the selection (467720).
                if (multiSel && cs && cs.backgroundColor) {
                    // just make the background color darker and use it instead of selection color.
                    cell.style.backgroundColor = this._darker(cs.backgroundColor);
                }
            } else if (cs) {
                // If the cell removes selected state, we'll resume the custom background color and font color style.
                if (cs.backgroundColor !== '') {
                    cell.style.backgroundColor = cs.backgroundColor;
                }
                if (cs.color !== '') {
                    cell.style.color = cs.color;
                }
            }
        }

        return updatedCtr;
    }

    private _drkColors: { [key: string]: string } = {};
    private _darker(color: string): string {
        let val = this._drkColors[color];
        if (!val) {
            let hsl = new wijmo.Color(color).getHsl();
            this._drkColors[color] = val = wijmo.Color.fromHsl(hsl[0], hsl[1], hsl[2] * 0.75).toString();
        }
        return val;
    }
}

/**
 * Represents a row used to display column header information for a bound sheet.
 */
export class HeaderRow extends wijmo.grid.Row {
    /**
    * Initializes a new instance of the HeaderRow class. 
    */
    constructor() {
        super();
        this.isReadOnly = true;
    }
}

/**
 * Represents a defined name item of FlexSheet.
 */
export class DefinedName {
    private _owner: FlexSheet;
    private _name: string;
    private _value: any;
    _sheetName: string;

    /**
     * Initializes a new instance of the DefinedName class.
     *
     * @param owner The owner {@link FlexSheet} control.
     * @param name The name of the defined name item.
     * @param value The value of the defined name item.
     * @param sheetName The sheet name indicates the defined name item works in which sheet of FlexSheet.  If omitted, the defined name item works in all sheets of FlexSheet.
     */
    constructor(owner: FlexSheet, name: string, value: any, sheetName?: string) {
        this._owner = owner;
        this._name = name;
        this._value = value;
        if (sheetName != null) {
            if (owner._validateSheetName(sheetName)) {
                this._sheetName = sheetName;
            } else {
                throw 'The sheet name:(' + sheetName + ') does not exist in FlexSheet.';
            }
        }
    }

    /**
     * Gets or sets the name of the defined name item.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        var oldName: string;
        if (this._name !== value) {
            if (!this._owner._checkExistDefinedName(value, this._sheetName)) {
                oldName = this._name;
                this._name = value;
                this._owner._updateFormulasWithNameUpdating(oldName, this._name);
            } else {
                throw 'The ' + value + ' already existed in definedNames.';
            }
        }
    }

    /**
     * Gets or sets the value of the defined name item.
     */
    get value(): any {
        return this._value;
    }
    set value(val: any) {
        if (this._value !== val) {
            this._value = val;
        }
    }

    /**
     * Gets the sheetName of the defined name item.
     */
    get sheetName(): string {
        return this._sheetName;
    }
}

/**
 * Defines the cell styling properties.
 */
export interface ICellStyle {
    /**
     * The CSS class name to add to a cell.
     */
    className?: string;
    /**
     * The font family.
     */
    fontFamily?: string;
    /**
     * The font size.
     */
    fontSize?: string;
    /**
     * The font style.
     */
    fontStyle?: string;
    /**
     * The font weight.
     */
    fontWeight?: string;
    /**
     * The text decoration.
     */
    textDecoration?: string;
    /**
     * The text alignment.
     */
    textAlign?: string;
    /**
     * The vertical alignment.
     */
    verticalAlign?: string;
    /**
     * The background color.
     */
    backgroundColor?: string;
    /**
     * The font color.
     */
    color?: string;
    /**
     * Format string for formatting the value of the cell.
     */
    format?: string;
    /**
     * Describes how whitespace inside the element is handled.
     */
    whiteSpace?: string;
    /**
     * Color of the Left border.
     */
    borderLeftColor?: string;
    /**
     * Style of the Left border.
     */
    borderLeftStyle?: string;
    /**
     * Width of the Left border.
     */
    borderLeftWidth?: string;
    /**
     * Color of the Right border.
     */
    borderRightColor?: string;
    /**
     * Style of the Right border.
     */
    borderRightStyle?: string;
    /**
     * Width of the Right border.
     */
    borderRightWidth?: string;
    /**
     * Color of the Top border.
     */
    borderTopColor?: string;
    /**
     * Style of the Top border.
     */
    borderTopStyle?: string;
    /**
     * Width of the Top border.
     */
    borderTopWidth?: string;
    /**
     * Color of the Bottom border.
     */
    borderBottomColor?: string;
    /**
     * Style of the Bottom border.
     */
    borderBottomStyle?: string;
    /**
     * Width of the Bottom border.
     */
    borderBottomWidth?: string;
}

/**
 * Defines the format states for the cells.
 */
export interface IFormatState {
    /**
     * Indicates whether the bold style is applied. 
     */
    isBold?: boolean;
    /**
     * Indicates whether the italic style is applied. 
     */
    isItalic?: boolean;
    /**
     * Indicates whether the underlined style is applied. 
     */
    isUnderline?: boolean;
    /**
     * Gets the applied text alignment.
     */
    textAlign?: string;
    /**
     * Indicate whether the current selection is a merged cell.
     */
    isMergedCell?: boolean;
}

/**
 * FlexSheet Xlsx export options
 */
export interface IFlexSheetXlsxOptions {
    /**
     * Indicates whether export the calculated value for formula cells.
     */
    includeFormulaValues?: boolean;
}

export function _isFormula(val: any) {
    return val && typeof (val) === 'string' && val.length > 1 && val[0] === '=' && val[1] !== '=';
}

export function _isEditingCell(g: wijmo.grid.FlexGrid, r: number, c: number) {
    let rng = g.editRange;
    return rng && rng.contains(r, c);
}

function _isExclusiveNumericFormat(val: string): boolean {
    if (val) {
        var m = val.match(/^[cdefgnprx](\d?)/i);
        if (m) {
            let s = m[0][0].toLowerCase();
            return s === 'd' || s === 'e' || s === 'f' || s === 'g' // these specifiers can be used in a date format too...
                ? !!m[1] // ... so check if the precision specifier is set.
                : true;
        }
    }

    return false;
}

/*
 * Defines the operation for drag & fill.
 */
export enum AutoFillOperation {
    /*
     * Copy the format.
     */
    CopyFormat = 1,
    /*
     * Copy the content.
     */
    CopyContent = 2,
    /*
     * Fill series.
     */
    FillSeries = 4
}

/*
 * The definition of fill series setting.
 */
interface _IFillSeries {
    /*
     * The type of the data in the fill series.
     * I could be 'number' or 'date'.
     */
    type: string;
    /*
     * The start row index or column index of the fill series.
     */
    startIndex: number;
    /*
     * The end row index or column index of the fill series.
     */
    endIndex: number;
    /*
     * The items of the fill series.
     */
    items: any[];
    /*
     * The index of the series items.
     */
    itemIndexes: number[];
}

class _RangesHelper {

    // Performs rows ranges validation: removes invalid/null ranges, combines overlapping and adjacent ranges.
    static validateRowRanges(ranges: wijmo.grid.CellRange[], rowsCount: number) {
        return this._validateCellRanges(ranges, rowsCount, 'topRow', 'bottomRow', 'row2');
    }

    // Performs columns ranges validation: removes invalid/null ranges, combines overlapping and adjacent ranges.
    static validateColumnRanges(ranges: wijmo.grid.CellRange[], columnsCount: number) {
        return this._validateCellRanges(ranges, columnsCount, 'leftCol', 'rightCol', 'col2');
    }

    private static _validateCellRanges(ranges: wijmo.grid.CellRange[], max: number, start: string, end: string, scndVal: string) {
        // Remove invalid or null ranges
        ranges = ranges.filter(r => r && r[start] >= 0 && r[end] >= 0 && r[start] < max && r[end] < max);

        let rl = ranges.length;
        if (rl > 1) { // Combine overlapping and adjacent ranges to avoid duplicates.
            ranges = ranges.sort((a, b) => {
                if (b[start] >= a[start] && b[end] <= a[end]) { // a contains b, put it first
                    return -1;
                }

                return a[start] - b[start];
            });

            let tmp: wijmo.grid.CellRange[] = [];

            for (let r = ranges[0].clone(), i = 1; i < rl; i++) {
                let c = ranges[i];

                if (c[start] >= r[start] && c[end] <= r[end]) { // r contains c, go to the next range.
                } else {
                    if (c[start] <= r[end] + 1) { // extend r to c, go to the next range. [0, 1], [1, 2] => [0, 2]; [0, 1], [2, 3] => [0, 3]
                        r[scndVal] = c[end];
                    } else { // a new range, c.firstProp - r.lastProp > 1
                        tmp.push(r);
                        r = c.clone();
                    }
                }

                if (i === rl - 1) {
                    tmp.push(r);
                }
            }

            ranges = tmp;
        }

        return ranges;
    }
}

class _ValWithFormat {
    constructor(public value: any, public format: string) {
    }
}
    }
    


    module wijmo.grid.sheet {
    




'use strict';

/**
 * Controls undo and redo operations in the {@link FlexSheet}.
 */
export class UndoStack {
    private MAX_STACK_SIZE = 500;
    private _owner: FlexSheet;
    private _stack = [];
    private _pointer = -1;
    /*private*/ _pendingAction: _UndoAction;
    private _resizingTriggered = false;
    private _stackSize: number;

    /**
     * Initializes a new instance of the {@link UndoStack} class.
     *
     * @param owner The {@link FlexSheet} control that the {@link UndoStack} works for.
     */
    constructor(owner: FlexSheet) {
        let self = this;

        self._owner = owner;

        // Handles the cell edit action for editing cell
        self._owner.prepareCellForEdit.addHandler(self._initCellEditAction, self);
        self._owner.cellEditEnded.addHandler((sender: wijmo.grid.FlexGrid, args: wijmo.grid.CellEditEndingEventArgs) => {
            // For edit cell content.
            if (!self._pendingAction) {
                return;
            }
            if (args.data && (args.data.keyCode === 46 || args.data.keyCode === 8)) {
                return;
            }
            if (self._pendingAction instanceof _EditAction && !(<_EditAction>self._pendingAction).isPaste) {
                self._afterProcessCellEditAction(self);
            }
        }, self);

        // Handles the cell edit action for copy\paste operation
        self._owner.pasting.addHandler(self._initCellEditActionForPasting, self);
        self._owner.pastingCell.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            if (!self._pendingAction) {
                return;
            }

            if (self._pendingAction instanceof _EditAction) {
                (<_EditAction>self._pendingAction).updateForPasting(e.range);
            } else if (self._pendingAction instanceof _CutAction) {
                (<_CutAction>self._pendingAction).updateForPasting(e.range);
            }
        }, self);
        self._owner.pasted.addHandler(() => {
            if (!self._pendingAction) {
                return;
            }
            // For paste content to the cell.
            if (self._pendingAction instanceof _EditAction && (<_EditAction>self._pendingAction).isPaste) {
                self._afterProcessCellEditAction(self);
            } else if (self._pendingAction instanceof _CutAction) {
                self._pendingAction.saveNewState();
                self._addAction(self._pendingAction);
                self._pendingAction = null;
            }
        }, self);

        // Handles the resize column action
        self._owner.resizingColumn.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            if (self.stackSize === 0 || !self._owner.selectedSheet) {
                return;
            }
            if (!self._resizingTriggered) {
                self._pendingAction = new _ColumnResizeAction(self._owner, e.panel, e.col);
                self._resizingTriggered = true;
            }
        }, self)
        self._owner.resizedColumn.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            if (self._pendingAction instanceof _ColumnResizeAction && self._pendingAction.saveNewState()) {
                self._addAction(self._pendingAction);
            }
            self._pendingAction = null;
            self._resizingTriggered = false;
        }, self);

        // Handles the resize row action
        self._owner.resizingRow.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            if (self.stackSize === 0 || !self._owner.selectedSheet) {
                return;
            }
            if (!self._resizingTriggered) {
                self._pendingAction = new _RowResizeAction(self._owner, e.panel, e.row);
                self._resizingTriggered = true;
            }
        }, self);
        self._owner.resizedRow.addHandler((sender: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
            if (self._pendingAction instanceof _RowResizeAction && self._pendingAction.saveNewState()) {
                self._addAction(self._pendingAction);
            }
            self._pendingAction = null;
            self._resizingTriggered = false;
        }, self);

        // Handle the changing rows\columns position action.
        self._owner.draggingRowColumn.addHandler((sender: wijmo.grid.FlexGrid, e: DraggingRowColumnEventArgs) => {
            if (self.stackSize === 0 || !self._owner.selectedSheet) {
                return;
            }
            if (e.isShiftKey) {
                if (e.isDraggingRows) {
                    self._pendingAction = new _RowsChangedAction(self._owner);
                } else {
                    self._pendingAction = new _ColumnsChangedAction(self._owner);
                }
            }
        }, self);
        self._owner.endDroppingRowColumn.addHandler((sender: FlexSheet, e: wijmo.CancelEventArgs) => {
            if (!e.cancel && self._pendingAction && self._pendingAction.saveNewState()) {
                self._addAction(self._pendingAction);
            }
            self._pendingAction = null;
        }, self);
    }

    /**
     * Gets or sets the size of the undo stack.
     */
    get stackSize(): number {
        if (this._stackSize == null) {
            return this.MAX_STACK_SIZE;
        }
        return this._stackSize;
    }
    set stackSize(value: number) {
        if (wijmo.isNumber(value)) {
            if (value < 0) {
                this._stackSize = 0;
            } else if (value > this.MAX_STACK_SIZE) {
                this._stackSize = this.MAX_STACK_SIZE;
            } else {
                this._stackSize = Math.floor(value);
            }
        }
    }

    /**
     * Checks whether an undo action can be performed.
     */
    get canUndo(): boolean {
        return this._pointer > -1 && this._pointer < this._stack.length;
    }

    /**
     * Checks whether a redo action can be performed.
     */
    get canRedo(): boolean {
        return this._pointer + 1 > -1 && this._pointer + 1 < this._stack.length;
    }

    /**
     * Occurs after the undo stack has changed.
     */
    readonly undoStackChanged = new wijmo.Event<UndoStack, wijmo.EventArgs>();
    /**
     * Raises the {@link undoStackChanged} event.
     */
    onUndoStackChanged(e?: wijmo.EventArgs) {
        this.undoStackChanged.raise(this, e);
    }

    /**
     * Undo the last action.
     */
    undo() {
        let action: _UndoAction;
        if (this.canUndo) {
            action = this._stack[this._pointer];
            this._beforeUndoRedo(action);
            action.undo();
            this._pointer--;
            this.onUndoStackChanged();
        }
    }

    /**
     * Redo the last undone action.
     */
    redo() {
        let action: _UndoAction;
        if (this.canRedo) {
            this._pointer++;
            action = this._stack[this._pointer];
            this._beforeUndoRedo(action);
            action.redo();
            this.onUndoStackChanged();
        }
    }

    /**
     * Clears the undo stack.
     */
    clear() {
        this._stack.length = 0;
    }

    // Add an action to the undo stack.
    _addAction(action: _UndoAction) {
        // trim stack
        if (this._stack.length > 0 && this._stack.length > this._pointer + 1) {
            this._stack.splice(this._pointer + 1, this._stack.length - this._pointer - 1);
        }
        if (this._stack.length >= this.stackSize) {
            this._stack.splice(0, this._stack.length - this.stackSize + 1);
        }

        // update pointer and add action to stack
        this._pointer = this._stack.length;
        this._stack.push(action);
        this.onUndoStackChanged();
    }

    // Removes the last undo action from the undo stack.
    _pop(): _UndoAction {
        let action: _UndoAction;
        if (this._pointer < 0) {
            return null;
        }
        action = this._stack[this._pointer];
        this._pointer--;
        return action;
    }

    // Save new state for current undo action.
    _updateCurrentAction(actionType: any) {
        let action: _UndoAction;
        if (this._pointer < 0) {
            return;
        }
        action = this._stack[this._pointer];
        if (action instanceof actionType) {
            action.saveNewState();
        }
    }

    // initialize the cell edit action.
    private _initCellEditAction(sender: any, args: wijmo.grid.CellRangeEventArgs) {
        if (this.stackSize === 0 || !this._owner.selectedSheet) {
            return;
        }
        this._pendingAction = new _EditAction(this._owner, args.range);
    }

    // initialize the cell edit action for pasting action.
    private _initCellEditActionForPasting() {
        if (this.stackSize === 0 || !this._owner.selectedSheet) {
            return;
        }
        if (this._owner._isCutting) {
            this._pendingAction = new _CutAction(this._owner);
        } else {
            this._pendingAction = new _EditAction(this._owner);
            (<_EditAction>this._pendingAction).markIsPaste();
        }
    }

    // after processing the cell edit action.
    private _afterProcessCellEditAction(self: UndoStack) {
        if (!self._pendingAction) {
            return;
        }
        if (self._pendingAction instanceof _EditAction && self._pendingAction.saveNewState()) {
            self._addAction(this._pendingAction);
        }
        self._pendingAction = null;
    }

    // Called before an action is undone or redone.
    private _beforeUndoRedo(action: _UndoAction) {
        this._owner.selectedSheetIndex = action.sheetIndex;
    }
}
    }
    


    module wijmo.grid.sheet {
    



'use strict';

/**
 * The editor used to inspect and modify {@link FlexSheetValueFilter} objects.
 *
 * This class is used by the {@link FlexSheetFilter} class; you 
 * rarely use it directly.
 */
export class FlexSheetValueFilterEditor extends wijmo.grid.filter.ValueFilterEditor {
    /**
     * Updates editor with current filter settings.
     */
    updateEditor() {
        var col = this.filter.column,
            flexSheet = <FlexSheet>col.grid,
            colIndex = col.index,
            values = [],
            keys = {},
            tmpShowValues = this.filter.showValues,
            cndFilter = flexSheet.filter.getColumnFilter(col, false).conditionFilter,
            tmpOp1 = cndFilter.condition1.operator,
            tmpOp2 = cndFilter.condition2.operator;


        // get list of unique values
        if (this.filter.uniqueValues || (flexSheet.itemsSource != null && flexSheet.childItemsPath != null)) {  // explicit list provided
            super.updateEditor();
            return;
        }

        // format and add unique values to the 'values' array
        for (var i = 0; i < flexSheet.rows.length; i++) {
            let row = flexSheet.rows[i];

            if (row instanceof HeaderRow || row instanceof wijmo.grid.GroupRow || row instanceof wijmo.grid._NewRowTemplate) {
                continue;
            }

            //  ** Get the result of other filters for current row.
            //
            // temporarily disable all the current column's filters.
            this.filter.showValues = null;
            cndFilter.condition1.operator = null;
            cndFilter.condition2.operator = null;

            let otherFilterResult = flexSheet.filter['_filter'](i);

            // restore
            this.filter.showValues = tmpShowValues;
            cndFilter.condition1.operator = tmpOp1;
            cndFilter.condition2.operator = tmpOp2;
            // **

            if (!row.visible && !otherFilterResult) { // skip the row if it is hidden by a filter that does not belong to the current column.
                continue;
            }

            if (!row.visible && this.filter.apply(i) && cndFilter.apply(i)) { // skip the row if it is hidden by setting the visible property to false.
                continue;
            }

            let r = i, // r, c - the indicies to get the cell's value from.
                c = colIndex,
                mergedRange = flexSheet.getMergedRange(flexSheet.cells, r, c);

            if (mergedRange) { // For any cell in the merged range, redirect to the upper left cell (TFS 199443) even if the row is filtered out (invisible) (TFS 392169).
                if (mergedRange.leftCol !== colIndex) { // Skip if not the first column of the merged range (TFS 419075).
                    continue;
                }

                r = mergedRange.topRow;
                c = mergedRange.leftCol;
            }

            let value = flexSheet.getCellValue(r, c),
                text: string;

            if (this.filter.dataMap) {
                text = this.filter.dataMap.getDisplayValue(value);
            } else {
                text = flexSheet.getCellValue(r, c, true);
            }

            value = value === '' ? null : value;

            let orgText: string = flexSheet.getCellData(r, c, true),
                cellRef: string;

            if (!keys[text]) {
                keys[text] = true;
                if (orgText && orgText[0] === '=') {
                    cellRef = i + '_' + colIndex;
                } else {
                    cellRef = '';
                }

                values.push({ value: value, text: text, cellRef: cellRef });
            }
        }

        // check the items that are currently selected
        var showValues = this.filter.showValues;
        if (!showValues || Object.keys(showValues).length == 0) {
            for (var i = 0; i < values.length; i++) {
                values[i].show = true;
            }
        } else {
            for (var key in showValues) {
                for (var i = 0; i < values.length; i++) {
                    if (showValues[key] && values[i].cellRef !== '' && values[i].cellRef === showValues[key].cellRef) {
                        showValues[values[i].text] = {
                            show: true,
                            cellRef: values[i].cellRef
                        };
                        values[i].show = true;
                        if (values[i].text != key) { // TFS 396572
                            delete showValues[key];
                        }
                    } else if (values[i].text == key) {
                        values[i].show = true;
                        break;
                    }
                }
            }
        }

        // honor isContentHtml property
        this['_lbValues'].isContentHtml = col.isContentHtml;

        // load filter and apply immediately
        this['_cmbFilter'].text = this.filter.filterText;
        this['_filterText'] = this['_cmbFilter'].text.toLowerCase();

        // show the values
        this['_view'].pageSize = this.filter.maxValues;
        this['_view'].sourceCollection = values;
    }

    /**
     * Updates filter to reflect the current editor values.
     */
    updateFilter() {
        var showValues = null,
            items = this['_view'].items;
        if (this['_filterText'] || this['_cbSelectAll'].indeterminate) {
            showValues = {};
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.show) {
                    showValues[item.text] = {
                        show: true,
                        cellRef: item.cellRef
                    };
                }
            }
        }
        this['_filter'].showValues = showValues;
        this['_filter'].filterText = this['_filterText'];
    };
}
    }
    


    module wijmo.grid.sheet {
    




'use strict';

/**
 * Defines a condition filter for a column on a {@link FlexSheet} control.
 *
 * Condition filters contain two conditions that may be combined
 * using an 'and' or an 'or' operator.
 *
 * This class is used by the {@link FlexSheetFilter} class; you will
 * rarely use it directly.
 */
export class FlexSheetConditionFilter extends wijmo.grid.filter.ConditionFilter {

    /**
     * Initializes a new instance of the {@link ConditionFilter} class.
     *
     * @param column The column to filter.
     */
    constructor(column: wijmo.grid.Column) {
        super(column);
    }

    /**
     * Returns a value indicating whether a value passes this filter.
     *
     * @param value The value to test.
     */
    apply(value): boolean {
        var col = this.column,
            flexSheet = <FlexSheet>col.grid,
            c1 = this.condition1,
            c2 = this.condition2,
            compareVal: any,
            compareVal1: any,
            compareVal2: any,
            dataMap: wijmo.grid.DataMap;

        if (!(flexSheet instanceof FlexSheet)) {
            return true;
        }

        // no binding or not active? accept everything
        if (!this.isActive) {
            return true;
        }

        if (flexSheet.rows[value] instanceof wijmo.grid._NewRowTemplate) {
            return true;
        }

        // retrieve the value
        compareVal = flexSheet.getCellValue(value, col.index);
        if (compareVal === '' && col.dataType !== wijmo.DataType.String) {
            compareVal = null;
        }
        compareVal1 = compareVal2 = compareVal;
        dataMap = this.dataMap || col.dataMap;
        if (dataMap) {
            compareVal = dataMap.getDisplayValue(compareVal);
            compareVal1 = compareVal2 = compareVal;
        } else if (wijmo.isDate(compareVal)) {
            if (wijmo.isString(c1.value) || wijmo.isString(c2.value)) { // comparing times
                compareVal = flexSheet.getCellValue(value, col.index, true);
                compareVal1 = compareVal2 = compareVal;
            }
        } else if (wijmo.isNumber(compareVal)) { 
            compareVal = wijmo.Globalize.parseFloat(flexSheet.getCellValue(value, col.index, true));
            compareVal1 = compareVal2 = compareVal;
            if (compareVal === 0 && !col.dataType) {
                if (c1.isActive && c1.value === '') {
                    compareVal1 = compareVal.toString();
                }
                if (c2.isActive && c2.value === '') {
                    compareVal2 = compareVal2.toString();
                }
            }
        } else if (compareVal == null) {
            if (c1.isActive && wijmo.isNumber(c1.value)) {
                compareVal1 = NaN;
            }
            if (c2.isActive && wijmo.isNumber(c2.value)) {
                compareVal2 = NaN;
            }
        }

        // apply conditions
        var rv1 = c1.apply(compareVal1),
            rv2 = c2.apply(compareVal2);

        // combine results
        if (c1.isActive && c2.isActive) {
            return this.and ? rv1 && rv2 : rv1 || rv2;
        } else {
            return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
        }
    }
}
    }
    


    module wijmo.grid.sheet {
    



'use strict';

/**
 * Defines a value filter for a column on a {@link FlexSheet} control.
 *
 * Value filters contain an explicit list of values that should be 
 * displayed by the sheet.
 */
export class FlexSheetValueFilter extends wijmo.grid.filter.ValueFilter {

    /**
     * Initializes a new instance of the {@link FlexSheetValueFilter} class.
     *
     * @param column The column to filter.
     */
    constructor(column: wijmo.grid.Column) {
        super(column);
    }

    /**
     * Gets a value that indicates whether a value passes the filter.
     *
     * @param value The value to test.
     */
    apply(value): boolean {
        var flexSheet = <FlexSheet>this.column.grid,
            dataMap: wijmo.grid.DataMap;

        if (!(flexSheet instanceof FlexSheet)) {
            return true;
        }

        // values? accept everything
        if (!this.showValues || !Object.keys(this.showValues).length) {
            return true;
        }

        if (flexSheet.rows[value] instanceof wijmo.grid._NewRowTemplate) {
            return true;
        }

        dataMap = this.dataMap || this.column.dataMap;
        if (dataMap) {
            value = dataMap.getDisplayValue(flexSheet.getCellValue(value, this.column.index));
        } else {
            value = flexSheet.getCellValue(value, this.column.index, true);
        }
        
        // apply conditions
        return this.showValues[value] != undefined;
    }
}
    }
    


    module wijmo.grid.sheet {
    





'use strict';

/**
 * Defines a filter for a column on a {@link FlexSheet} control.
 *
 * The {@link FlexSheetColumnFilter} contains a {@link FlexSheetConditionFilter} and a
 * {@link FlexSheetValueFilter}; only one of them may be active at a time.
 *
 * This class is used by the {@link FlexSheetFilter} class; you 
 * rarely use it directly.
 */
export class FlexSheetColumnFilter extends wijmo.grid.filter.ColumnFilter {
    /**
     * Initializes a new instance of the {@link FlexSheetColumnFilter} class.
     *
     * @param owner The {@link FlexSheetFilter} that owns this column filter.
     * @param column The {@link Column} to filter.
     */
    constructor(owner: FlexSheetFilter, column: wijmo.grid.Column) {
        super(owner, column);
        
        this['_valueFilter'] = new FlexSheetValueFilter(column);
        this['_valueFilter'].exclusiveValueSearch = owner.exclusiveValueSearch;
        this['_conditionFilter'] = new FlexSheetConditionFilter(column);
    }
}
    }
    


    module wijmo.grid.sheet {
    






'use strict';

/**
 * The editor used to inspect and modify column filters.
 *
 * This class is used by the {@link FlexSheetFilter} class; you 
 * rarely use it directly.
 */
export class FlexSheetColumnFilterEditor extends wijmo.grid.filter.ColumnFilterEditor {
    private _btnSortAsc: HTMLInputElement;
    private _btnSortDsc: HTMLInputElement;
    /**
     * Initializes a new instance of the {@link FlexSheetColumnFilterEditor} class.
     *
     * @param element The DOM element that hosts the control, or a selector 
     * for the host element (e.g. '#theCtrl').
     * @param filter The {@link FlexSheetColumnFilter} to edit.
     * @param sortButtons Whether to show sort buttons in the editor.
     */
    constructor(element: any, filter: FlexSheetColumnFilter, sortButtons = true) {
        super(element, filter, sortButtons);

        var self = this;

        if (sortButtons) {
            this['_divSort'].style.display = '';
        }

        this._btnSortAsc = this.cloneElement(this['_btnAsc']) as HTMLInputElement;
        this._btnSortDsc = this.cloneElement(this['_btnDsc']) as HTMLInputElement;

        this['_btnAsc'].parentNode.replaceChild(this._btnSortAsc, this['_btnAsc']);
        this['_btnDsc'].parentNode.replaceChild(this._btnSortDsc, this['_btnDsc']);
        this._btnSortAsc.addEventListener('click', (e: MouseEvent) => {
            self._sortBtnClick(e, true);
        });
        this._btnSortDsc.addEventListener('click', (e: MouseEvent) => {
            self._sortBtnClick(e, false);
        });

        this._updateSortButtonStateUnbound();
    }

    // shows the value or filter editor
    _showFilter(filterType: wijmo.grid.filter.FilterType) {

        // create editor if we have to
        if (filterType == wijmo.grid.filter.FilterType.Value && this['_edtVal'] == null) {
            this['_edtVal'] = new FlexSheetValueFilterEditor(this['_divEdtVal'], this.filter.valueFilter);
            this['_edtVal'].canApplyChanged.addHandler(s => {
                wijmo.enable(this['_btnApply'], this['_edtVal'].canApply);
            });
        }

        super._showFilter(filterType);
    }

    // sort button click event handler
    private _sortBtnClick(e: MouseEvent, asceding: boolean) {
        var column = this.filter.column,
            sortManager = (<FlexSheet>column.grid).sortManager,
            sortIndex: number,
            offset: number,
            sortItem: ColumnSortDescription;

        e.preventDefault();
        e.stopPropagation();

        sortIndex = sortManager.checkSortItemExists(column.index);
        if (sortIndex > -1) {
            // If the sort item for current column doesn't exist, we add new sort item for current column
            sortManager.sortDescriptions.moveCurrentToPosition(sortIndex)
            sortItem = sortManager.sortDescriptions.currentItem;
            sortItem.ascending = asceding;
            offset = -sortIndex;
        } else {
            sortManager.addSortLevel(column.index, asceding);
            offset = -(sortManager.sortDescriptions.items.length - 1);
        }
        // Move sort item for current column to first level.
        sortManager.moveSortLevel(offset);
        sortManager.commitSort();

        // raise event so caller can close the editor and apply the new filter
        this.onButtonClicked();
    }

    // Clone dom element and its child node
    private cloneElement(element: HTMLElement): Node {
        var cloneEle = element.cloneNode();

        while (element.firstChild) {
            cloneEle.appendChild(element.lastChild);
        }

        return cloneEle;
    }

    private _updateSortButtonStateUnbound() {
        let col = this.filter.column;

        if (col && col.grid && (col.grid as FlexSheet).selectedSheet) {
            let usd = (col.grid as FlexSheet).selectedSheet._unboundSortDesc;

            for (let i = 0; i < usd.length; i++) {
                if (usd[i].column === col) {
                    wijmo.toggleClass(this._btnSortAsc, 'wj-state-active', usd[i].ascending === true);
                    wijmo.toggleClass(this._btnSortDsc, 'wj-state-active', usd[i].ascending === false);
                    break;
                }
            }
        }
    }
}
    }
    


    module wijmo.grid.sheet {
    







'use strict';

/**
 * Implements an Excel-style filter for {@link FlexSheet} controls.
 *
 * To enable filtering on a {@link FlexSheet} control, create an instance 
 * of the {@link FlexSheetFilter} and pass the grid as a parameter to the 
 * constructor. 
 */
export class FlexSheetFilter extends wijmo.grid.filter.FlexGridFilter {
    private _undoAcion: _FilteringAction;
    private _filterChanged: boolean;

    /**
     * Gets or sets the current filter definition as a JSON string.
     */
    get filterDefinition(): string {
        var def = {
            filters: []
        }
        for (var i = 0; i < this['_filters'].length; i++) {
            var cf = this['_filters'][i];
            if (cf && cf.column && this.grid.columns.indexOf(cf.column) > -1) {
                if (cf.conditionFilter.isActive) {
                    var cfc = cf.conditionFilter;
                    def.filters.push({
                        columnIndex: cf.column.index,
                        type: 'condition',
                        condition1: { operator: cfc.condition1.operator, value: cfc.condition1.value },
                        and: cfc.and,
                        condition2: { operator: cfc.condition2.operator, value: cfc.condition2.value }
                    });
                } else if (cf.valueFilter.isActive) {
                    var cfv = cf.valueFilter;
                    def.filters.push({
                        columnIndex: cf.column.index,
                        type: 'value',
                        filterText: cfv.filterText,
                        showValues: cfv.showValues
                    });
                }
            }
        }
        return JSON.stringify(def);
    }
    set filterDefinition(value: string) {
        var def = JSON.parse(wijmo.asString(value));
        this.clear();
        for (var i = 0; i < def.filters.length; i++) {
            var cfs = def.filters[i],
                col = this.grid.columns[cfs.columnIndex],
                cf = this.getColumnFilter(col, true);
            if (cf) {
                switch (cfs.type) {
                    case 'condition':
                        var cfc = cf.conditionFilter;
                        cfc.condition1.value = col.dataType == wijmo.DataType.Date // handle times/times: TFS 125144, 143453
                            ? wijmo.changeType(cfs.condition1.value, col.dataType, null)
                            : cfs.condition1.value;
                        cfc.condition1.operator = cfs.condition1.operator;
                        cfc.and = cfs.and;
                        cfc.condition2.value = col.dataType == wijmo.DataType.Date
                            ? wijmo.changeType(cfs.condition2.value, col.dataType, null)
                            : cfs.condition2.value;
                        cfc.condition2.operator = cfs.condition2.operator;
                        break;
                    case 'value':
                        var cfv = cf.valueFilter;
                        cfv.filterText = cfs.filterText;
                        cfv.showValues = cfs.showValues;
                        break;
                }
            }
        }
        this.apply();
    }
    /**
     * Applies the current column filters to the sheet.
     */
    apply() {
        var self = this;
        self.grid.deferUpdate(() => {
            var row: wijmo.grid.Row,
                filterResult: boolean,
                groupCells: wijmo.grid.CellRange,
                groupBottomRow: number = -1;
            for (var i = 0; i < self.grid.rows.length; i++) {
                row = self.grid.rows[i];
                if (row instanceof HeaderRow || i <= groupBottomRow) {
                    continue;
                }
                groupBottomRow = -1;
                filterResult = self['_filter'](i);
                if (row instanceof wijmo.grid.GroupRow) {
                    groupCells = (<wijmo.grid.GroupRow>row).getCellRange();
                    if (row.dataItem == null || row.dataItem instanceof wijmo.collections.CollectionViewGroup) {
                        // Check the filter result of the group row for the common sheet.
                        row.visible = self._checkGroupVisible(groupCells);
                    } else {
                        // Check the filter result for the hierarchical tree.
                        row.visible = filterResult;
                        groupBottomRow = groupCells.bottomRow;
                        if (groupCells.isValid) {
                            for (var r = groupCells.topRow; r <= groupCells.bottomRow; r++) {
                                self.grid.rows[r].visible = filterResult;
                            }
                        }
                    }
                } else {
                    row.visible = filterResult;
                }
            }

            // and fire the event
            if (!(<FlexSheet>self.grid)._isCopying && !(<FlexSheet>self.grid)._isUndoing && !(<FlexSheet>self.grid)._isSorting) {
                self.onFilterApplied();
            }
        });
    }

    /**
     * Shows the filter editor for the given grid column.
     *
     * @param col The {@link Column} that contains the filter to edit.
     * @param ht A {@link wijmo.chart.HitTestInfo} object containing the range of the cell that
     * triggered the filter display.
     */
    editColumnFilter(col: any, ht?: wijmo.grid.HitTestInfo) {
        var self = this,
            g = self.grid;

        // remove current editor
        self.closeEditor();

        // get column by name or by reference
        col = self._asColumn(col);

        // get the filter and the editor
        var div = document.createElement('div'),
            flt = self.getColumnFilter(col),
            edt = new FlexSheetColumnFilterEditor(div, flt, self.showSortButtons);
        wijmo.addClass(div, 'wj-dropdown-panel');
        // save reference to editor
        self['_divEdt'] = div;
        self['_edtCol'] = col;

        // raise filterChanging event
        var e = new wijmo.grid.CellRangeEventArgs(g.cells, new wijmo.grid.CellRange(-1, col.index));
        self.onFilterChanging(e);
        if (e.cancel) {
            self['_divEdt'] = null;
            self['_edtCol'] = null;
            return;
        }
        e.cancel = true; // assume the changes will be canceled

        if ((<FlexSheet>g).undoStack.stackSize > 0) {
            self._undoAcion = new _FilteringAction(<FlexSheet>g);
        }

        // handle RTL
        if (g.rightToLeft) {
            div.dir = 'rtl';
        }

        // apply filter when it changes
        edt.filterChanged.addHandler(() => {
            e.cancel = false; // the changes were not canceled
            self._filterChanged = true;
            setTimeout(() => { // apply after other handlers have been called
                if (!e.cancel) {
                    self.apply();
                    if (self._undoAcion) {
                        self._undoAcion.saveNewState();
                        (<FlexSheet>g).undoStack._addAction(self._undoAcion);
                        self._undoAcion = null;
                    }
                }
            });
        });

        // close editor when editor button is clicked
        edt.buttonClicked.addHandler(() => {
            self.closeEditor();
            g.focus();
            self.onFilterChanged(e);
        });

        // close editor when it loses focus (changes are not applied)
        edt.lostFocus.addHandler(() => {
            setTimeout(() => {
                var ctl = wijmo.Control.getControl(self['_divEdt']);
                if (ctl && !ctl.containsFocus()) {
                    self.closeEditor();
                }
            }, 10); //200); // let others handle it first
        });

        // commit any pending row edits and scroll the column into view
        g._edtHdl._commitRowEdits(); // TFS 306203
        g.scrollIntoView(-1, col.index, true);

        // get the header cell to position editor
        var ch = self.grid.columnHeaders,
            r = ht ? ht.row : ch.rows.length - 1,
            c = ht ? ht.col : col.index,
            rc = ch.getCellBoundingRect(r, c),
            hdrCell = <HTMLElement>document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
        hdrCell = <HTMLElement>wijmo.closest(hdrCell, '.wj-cell');

        // show editor and give it focus
        if (hdrCell) {
            wijmo.showPopup(div, hdrCell, false, false, false);
        } else {
            wijmo.showPopup(div, rc);
        }


        // update aria-expanded attribute on both buttons (visible and hidden)
        self._setAriaExpanded(hdrCell, true);
        self._setAriaExpanded(g.cells.getCellElement(-1, c), true);

        // give the focus to the editor's first visible input element
        let inputs = edt.hostElement.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            let el = inputs[i];
            if (el.offsetHeight > 0 && el.tabIndex > -1 && !el.disabled) {
                el.focus();
                break;
            }
        }
        if (!edt.containsFocus()) { // just in case...
            edt.focus();
        }
    }

    /**
     * Closes the filter editor.
     */
    closeEditor() {
        if (this._undoAcion && !this._filterChanged) {
            this._undoAcion = null;
        }
        super.closeEditor();
    }

    /**
     * Gets the filter for the given column.
     *
     * @param col The {@link Column} that the filter applies to (or column name or index).
     * @param create Whether to create the filter if it does not exist.
     */
    getColumnFilter(col: string | number | wijmo.grid.Column, create = true): FlexSheetColumnFilter {
        if (col = this._asColumn(col)) {
            // look for the filter
            for (let i = 0; i < this['_filters'].length; i++) {
                if (this['_filters'][i].column == col) {
                    return this['_filters'][i];
                }
            }

            // not found, create one now
            if (create) {
                let cf = new FlexSheetColumnFilter(this, col);
                this['_filters'].push(cf);
                return cf;
            }
        }

        // not found, not created
        return null;
    }

    _isActive() {
        return (this['_filters'] as wijmo.grid.filter.ColumnFilter[]).some(cf => {
            return cf.column && (cf.conditionFilter.isActive || cf.valueFilter.isActive) && (this.grid.columns.indexOf(cf.column) >= 0);
        });
    }

    _isEditorOpened() {
        return !!this['_divEdt'];
    }

    // Check the visiblity of the group.
    private _checkGroupVisible(range: wijmo.grid.CellRange): boolean {
        var groupVisible = true,
            row: wijmo.grid.Row;
        for (var i = range.topRow + 1; i <= range.bottomRow; i++) {
            row = this.grid.rows[i];
            if (row) {
                if (row instanceof wijmo.grid.GroupRow) {
                    groupVisible = this._checkGroupVisible((<wijmo.grid.GroupRow>row).getCellRange());
                } else {
                    groupVisible = this['_filter'](i);
                    if (groupVisible) {
                        break;
                    }
                }
            }
        }
        return groupVisible;
    }
}
    }
    


    module wijmo.grid.sheet {
    



'use strict';

export class _SmartTag extends wijmo.Control {
    private readonly CopyCells = AutoFillOperation.CopyFormat | AutoFillOperation.CopyContent;
    private readonly FillSeries = AutoFillOperation.CopyFormat | AutoFillOperation.FillSeries;
    private readonly FillFormat = AutoFillOperation.CopyFormat;
    private readonly FillWithoutFormat = AutoFillOperation.FillSeries;

    private readonly FullWidth = 32;
    private readonly CompactWidth = 18;

    static controlTemplate =
        '<img wj-part="icon" style="float:left; height: 18; margin: 0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAFJJREFUeNrclEEKACAIBOfp/Xy7i4WSRnRYBIVRVhFJVIhyEAxllQa5E/wBSnsU6Rza2nugqNmASi57C/KKNg/Iqn+iVWzx6M4bOdUEAAD//wMAAYRMfiNaiqEAAAAASUVORK5CYII=" />' +
        '<img wj-part="btn-menu" style="float:left; height: 18; margin: 0; display: none" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAASCAYAAACXScT7AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAGCSURBVHjafNFPKKRxHAbw5/v7GYdBYUQjLm5SkoNykCQHtcx431/KgdKumJvSrAO7Nwc3RQ5kd3OkHJC/hUJREluonVcToqRh3sRFPA6M1Mbhc3z6Pj1fkMRHQNJL0uPeul731lU37o1y49cqHr8GvvgWQRLBsmpM/P0j4XAXiooKcXl1CZDEzl4EJBEwAZBUwWAQsVgsFSRR11gmM8trimSa3WypzZ31l5v2/vfk/4oAcv9aSGyUSz4gg/AIAOET0YQswIQWaNrnH+2OeSaY0BJN2+wDTi/OpCrwkxX1vW8q63p5cnaaB+Z/09u7x0nFJTVMiEajPsNCQaC6Ryb8THKcw/Tikho6zj//0RGUNV6gMZ1H8fmpH5iTHDlwsiOhO7FrN5RdP6aBIUj/pvJ2bkFbkxAzBzELELNCQQqgrJ5ST1/jqmYOJcHa7dYYGV5TrQ3d+vfUU+b7IfrOIRCGBYD0o1VGmaHaB6DZkqvMD2hUfF1UAISkvE/+yqbCZ89+HgBtwgFOrBUzJgAAAABJRU5ErkJggg==" />';

    private _owner: FlexSheet;
    private _icon: HTMLImageElement;
    private _btnMenu: HTMLDivElement;
    private _menu: wijmo.input.Menu; // filling operations
    private _op: AutoFillOperation;
    private _uiEventHdl = this._onUIEvent.bind(this);

    constructor(element: HTMLElement, owner: FlexSheet, fillOperation: AutoFillOperation, options?: any) {
        super(element);

        this._owner = owner;
        this._op = fillOperation;

        let tpl = this.getTemplate();
        this.applyTemplate('wj-flexsheet-smart-tag', tpl, {
            _icon: 'icon',
            _btnMenu: 'btn-menu'
        });

        let pos = this._getPos();
        wijmo.setCss(this.hostElement, { left: pos.x, top: pos.y });

        this.addEventListener(this.hostElement, 'mouseover', () => {
            this.hostElement.style.width = this.FullWidth + 'px';
            this._btnMenu.style.display = '';
        });

        this.addEventListener(this.hostElement, 'mouseleave', () => {
            if (!this._menu) {
                this.hostElement.style.width = this.CompactWidth + 'px';
                this._btnMenu.style.display = 'none';
            }
        });

        this.addEventListener(this.hostElement, 'mousedown', (e: MouseEvent) => {
            e.preventDefault();
            this._showFillOpMenu();
        }, true);


        this.addEventListener(document.body, 'mousedown', this._uiEventHdl, true);
        this.addEventListener(document.body, 'keydown', this._uiEventHdl, true);

        this.initialize(options);
    }

    dispose() {
        this.removeEventListener(document.body, 'mousedown', this._uiEventHdl, true);
        this.removeEventListener(document.body, 'keydown', this._uiEventHdl, true);
        super.dispose();
    }

    get operation(): AutoFillOperation {
        return this._op;
    }

    readonly operationSelected = new wijmo.Event<_SmartTag, wijmo.EventArgs>();

    onOperationSelected(e?: wijmo.EventArgs) {
        this.operationSelected.raise(this, e);
    }

    readonly cancelled = new wijmo.Event<_SmartTag, wijmo.EventArgs>();

    onCancelled(e?: wijmo.EventArgs) {
        this.cancelled.raise(this, e);
    }

    private _getPos(): wijmo.Point {
        let fx = this._owner,
            root = fx._root,
            sel = fx.selection,
            rect = fx.cells.getCellBoundingRect(sel.bottomRow, sel.rightCol, true),
            ch = fx.cells.hostElement,
            x = rect.right + ch.offsetLeft,
            y = rect.bottom + ch.offsetTop;

        if (x + fx._ptScrl.x + 32 + (ch.offsetHeight > root.offsetHeight ? 17 : 0) > root.offsetWidth) {
            x = x - 32;
        }
        if (y + fx._ptScrl.y + 18 + (ch.offsetWidth > root.offsetWidth ? 17 : 0) > root.offsetHeight) {
            y = y - 18;
        }

        return new wijmo.Point(x, y);
    }

    private _showFillOpMenu() {
        let ci = wijmo.culture.FlexSheet;

        this._menu = new wijmo.input.Menu(document.createElement('div'), {
            displayMemberPath: 'item',
            selectedValuePath: 'op',
            dropDownCssClass: 'wj-flexsheet-fill-menu',
            openOnHover: false,
            closeOnLeave: false,
            itemsSource: [
                { item: ci.copyCells, op: this.CopyCells, checked: this._op === this.CopyCells },
                { item: ci.fillSeries, op: this.FillSeries, checked: this._op === this.FillSeries },
                { item: ci.fillFormat, op: this.FillFormat, checked: this._op === this.FillFormat },
                { item: ci.fillWithoutFormat, op: this.FillWithoutFormat, checked: this._op === this.FillWithoutFormat }
            ],
            selectedValue: this._op,
            itemClicked: (menu: wijmo.input.Menu) => {
                this._op = menu.selectedValue;
                this.onOperationSelected();
            }
        });

        this._menu.listBox.checkedMemberPath = 'checked';
        this._menu.show(this.hostElement); // show menu relative to the smartTag's element.
        this._menu.selectedValue = this._op; // restore the selected value because Menu resets it.
    }

    private _onUIEvent(e: UIEvent) {
        let t = e.target,
            canHandle = wijmo.contains(this.hostElement, t) || (this._menu && wijmo.contains(this._menu.listBox.hostElement, t));

        if (canHandle && (e instanceof KeyboardEvent)) {
            canHandle = (e.keyCode == wijmo.Key.Down || e.keyCode == wijmo.Key.Up || e.keyCode == wijmo.Key.Enter);
        }

        if (!canHandle) {
            this.onCancelled();
        }
    }
}
    }
    


    module wijmo.grid.sheet {
    


export class _FlexSheetSelectionHandler extends wijmo.grid._SelectionHandler {
    private _fs: FlexSheet;

    constructor(flexSheet: FlexSheet) {
        let mode = flexSheet.selectionMode;
        super(flexSheet);
        this['_mode'] = mode; // TFS 444292
        this._fs = flexSheet;
    }

    moveSelection(rowMove: wijmo.grid.SelMove, colMove: wijmo.grid.SelMove, extend: boolean) {
        let fs = this._fs;

        if (!extend && fs._lastSelMovePos) {
            // Restore the selection to the state preceding the expansion of the selection to the merged cells (TFS 368034).
            this.selection.copy(fs._lastSelMovePos);
        }

        fs._lastSelMovePos = null;
        
        super.moveSelection(rowMove, colMove, extend);
    }
}
    }
    


    module wijmo.grid.sheet {
    




'use strict';

/*
* Defines the ContextMenu for a {@link FlexSheet} control.
*/
export class _ContextMenu extends wijmo.Control {
    protected _owner: FlexSheet;
    protected _idx: number = -1;

    /*
    * Initializes a new instance of the _ContextMenu class.
    *
    * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
    * @param owner The {@link FlexSheet} control what the ContextMenu works with.
    */
    constructor(element: any, owner: FlexSheet) {
        super(element);

        this._owner = owner;
    }

    /*
    * Gets the visible of the context menu.
    */
    get visible(): boolean {
        return this.hostElement.style.display !== 'none';
    }

    /*
    * Show the context menu.
    *
    * @param e The mouse event.
    * @param point The point indicates the position for the context menu.
    */
    show(e: MouseEvent, point?: wijmo.Point) {
        if (!this._owner.selectedSheet) {
            return;
        }

        this._owner.finishEditing(); // hide drop-down editor, if any (457101)

        let posX = (point ? point.x : e.clientX) + (e ? window.pageXOffset : 0), //Left Position of Mouse Pointer
            posY = (point ? point.y : e.clientY) + (e ? window.pageYOffset : 0); //Top Position of Mouse Pointer
        this.hostElement.style.position = 'absolute';
        this.hostElement.style.display = 'inline';
        if (posY + this.hostElement.clientHeight > window.innerHeight + (e ? window.pageYOffset : 0)) {
            posY -= this.hostElement.clientHeight;
        }
        if (posX + this.hostElement.clientWidth > window.innerWidth + (e ? window.pageXOffset : 0)) {
            posX -= this.hostElement.clientWidth;
        }
        this.hostElement.style.top = posY + 'px';
        this.hostElement.style.left = posX + 'px';
    }

    /*
    * Hide the context menu.
    */
    hide() {
        this._idx = -1;
        let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
        this._removeSelectedState(menuItems);
        this.hostElement.style.display = 'none';
    }

    /*
    * Move to next context menu item.
    */
    moveToNext() {
        let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
        this._removeSelectedState(menuItems);

        this._idx++;
        while (menuItems[this._idx] && ((<HTMLElement>menuItems[this._idx]).style.display === 'none' || wijmo.hasClass((<HTMLElement>menuItems[this._idx]), 'wj-state-disabled'))) {
            this._idx++;
        }
        if (this._idx >= menuItems.length) {
            this._idx = 0;
        }
        wijmo.addClass(<HTMLElement>menuItems[this._idx], 'wj-context-menu-item-selected');
    }

    /*
    * Move to previous context menu item
    */
    moveToPrev() {
        let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
        this._removeSelectedState(menuItems);

        this._idx--;
        if (this._idx < 0) {
            this._idx = menuItems.length - 1;
        }
        while (this._idx > 0 && ((<HTMLElement>menuItems[this._idx]).style.display === 'none' || wijmo.hasClass((<HTMLElement>menuItems[this._idx]), 'wj-state-disabled'))) {
            this._idx--;
        }

        wijmo.addClass(<HTMLElement>menuItems[this._idx], 'wj-context-menu-item-selected');
    }

    /*
    * Move to the first context menu item
    */
    moveToFirst() {
        let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
        this._removeSelectedState(menuItems);

        this._idx = 0;
        wijmo.addClass(<HTMLElement>menuItems[this._idx], 'wj-context-menu-item-selected');
    }

    /*
    * Move to the last context menu item
    */
    moveToLast() {
        let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
        this._removeSelectedState(menuItems);

        this._idx = menuItems.length - 1;
        if (menuItems[this._idx] && (<HTMLElement>menuItems[this._idx]).style.display === 'none') {
            this._idx--;
        }
        wijmo.addClass(<HTMLElement>menuItems[this._idx], 'wj-context-menu-item-selected');
    }

    /*
    * Handle command for the selected context menu item. 
    */
    handleContextMenu() {
        if (this._idx === -1) {
            // If there is no selected context menu item, we will select the first context menu item.
            this.moveToNext();
        } else {
            let menuItems = this.hostElement.querySelectorAll('.wj-context-menu-item');
            this._handleMenuItemOperation(menuItems);
            this.hide();
            this._owner.hostElement.focus();
        }
    }

    /**
    * Refreshes the control.
    *
    * @param fullUpdate Indicates whether to update the control layout as well as the content.
    */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        this._localize();
    }

    // Initialize the context menu.
    protected _init() {
        let self = this,
            menuItems = self.hostElement.querySelectorAll('.wj-context-menu-item');

        self.hostElement.style.zIndex = '9999';
        document.body.appendChild(self.hostElement);

        self.addEventListener(document.body, 'mousemove', () => {
            self._removeSelectedState(menuItems);
        });

        self.addEventListener(self.hostElement, 'contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        this._localize();
    }

    // Handle the operation for the related menu item.
    protected _handleMenuItemOperation(menuItems: NodeListOf<Element>) {
    }

    protected _localize() {
    }

    // Remove the selected state for the context menu items.
    private _removeSelectedState(menuItems: NodeListOf<Element>) {
        for (let i = 0; i < menuItems.length; i++) {
            wijmo.removeClass(<HTMLElement>menuItems[i], 'wj-context-menu-item-selected');
        }
    }
}

/*
* Defines the Sheet operation ContextMenu for a {@link FlexSheet} control.
* We can insert\remove rows\columns and convert cell range to table in Sheet via the _SheetContextMenu.
*/
export class _SheetContextMenu extends _ContextMenu {
    private _insRows: HTMLElement;
    private _delRows: HTMLElement;
    private _insCols: HTMLElement;
    private _delCols: HTMLElement;
    private _splitter: HTMLElement;
    private _convertTable: HTMLElement;
    private _isDisableDelRow: boolean = false;
    private _isDisableConvertTable: boolean = false;

    static controlTemplate = '<div class="wj-context-menu wj-control wj-flexsheet-context-menu" width="150px">' +
        '<div class="wj-context-menu-item" wj-part="insert-rows"></div>' +
        '<div class="wj-context-menu-item" wj-part="delete-rows"></div>' +
        '<div class="wj-context-menu-item" wj-part="insert-columns"></div>' +
        '<div class="wj-context-menu-item" wj-part="delete-columns"></div>' +
        '<div class="wj-state-disabled" wj-part="splitter" style="width:100%;height:1px;background-color:lightgray;"></div>' +
        '<div class="wj-context-menu-item" wj-part="convert-table"></div>' +
        '</div>';

    /*
    * Initializes a new instance of the _SheetContextMenu class.
    *
    * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
    * @param owner The {@link FlexSheet} control what the ContextMenu works with.
    */
    constructor(element: any, owner: FlexSheet) {
        super(element, owner);

        this.applyTemplate('', this.getTemplate(), {
            _insRows: 'insert-rows',
            _delRows: 'delete-rows',
            _insCols: 'insert-columns',
            _delCols: 'delete-columns',
            _splitter: 'splitter',
            _convertTable: 'convert-table'
        });

        this._init();
    }

    /*
    * Show the context menu.
    *
    * @param e The mouse event.
    * @param point The point indicates the position for the context menu.
    */
    show(e: MouseEvent, point?: wijmo.Point) {
        if (!this._owner.selectedSheet) {
            return;
        }
        if (this._owner._isDisableDeleteRow(this._owner.selection.topRow, this._owner.selection.bottomRow)) {
            this._isDisableDelRow = true;
            wijmo.addClass(this._delRows, 'wj-state-disabled');
        }
        this._showTableOperation();
        if (!this._owner.selection.isValid) {
            this._isDisableConvertTable = true;
            wijmo.addClass(this._convertTable, 'wj-state-disabled');
        }
        super.show(e, point);
    }

    /*
    * Hide the context menu.
    */
    hide() {
        super.hide();
        this._isDisableDelRow = false;
        this._isDisableConvertTable = false;
        wijmo.removeClass(this._delRows, 'wj-state-disabled');
        wijmo.removeClass(this._convertTable, 'wj-state-disabled');
    }

    // Initialize the context menu.
    protected _init() {
        super._init();

        let self = this;

        self.addEventListener(self._insRows, 'click', (e: MouseEvent) => {
            self._owner.insertRows();
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._delRows, 'click', (e: MouseEvent) => {
            if (!self._isDisableDelRow) {
                self._owner.deleteRows();
            }
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._insCols, 'click', (e: MouseEvent) => {
            self._owner.insertColumns();
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._delCols, 'click', (e: MouseEvent) => {
            self._owner.deleteColumns();
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._convertTable, 'click', (e: MouseEvent) => {
            if (!self._isDisableConvertTable) {
                self._addTable();
            }
            self.hide();
            self._owner.hostElement.focus();
        });
    }

    // Handle the operation for the related menu item.
    protected _handleMenuItemOperation(menuItems: NodeListOf<Element>) {
        switch (menuItems[this._idx]) {
            case this._insCols:
                this._owner.insertColumns();
                break;
            case this._insRows:
                this._owner.insertRows();
                break;
            case this._delCols:
                this._owner.deleteColumns();
                break;
            case this._delRows:
                if (!this._isDisableDelRow) {
                    this._owner.deleteRows();
                }
                break;
            case this._convertTable:
                this._addTable();
                break;
        }
    }

    protected _localize() {
        super._localize();

        let ci = wijmo.culture.FlexSheet;

        this._insRows.textContent = ci.insertRow;
        this._delRows.textContent = ci.deleteRow;
        this._insCols.textContent = ci.insertCol;
        this._delCols.textContent = ci.deleteCol;
        this._convertTable.textContent = ci.convertTable;
    }

    // Show the table operation in the context menu.
    private _showTableOperation() {
        let selection = this._owner.selection;

        for (let r = selection.topRow; r <= selection.bottomRow; r++) {
            for (let c = selection.leftCol; c <= selection.rightCol; c++) {
                let table = this._owner.selectedSheet.findTable(r, c);
                if (table != null) {
                    this._convertTable.style.display = 'none';
                    this._splitter.style.display = 'none';
                    return;
                }
            }
        }
        if (!selection.isSingleCell && !this._owner._containsMergedCells(selection)) {
            this._convertTable.style.display = '';
            this._splitter.style.display = '';
        } else {
            this._convertTable.style.display = 'none';
            this._splitter.style.display = 'none';
        }
    }

    // Add table.
    private _addTable() {
        let table = this._owner.selectedSheet._addTable(this._owner.selection);
        if (table) {
            if (this._owner.undoStack.stackSize === 0) {
                return;
            }
            let undoAction = new _TableAction(this._owner, table);
            this._owner.undoStack._addAction(undoAction);
        }
    }
}

/*
* Defines the Sheet tab operation ContextMenu for a {@link FlexSheet} control.
* We can insert, remove and rename the sheet tab via the _SheetTabContextMenu. 
*/
export class _SheetTabContextMenu extends _ContextMenu {
    private _insSheet: HTMLElement;
    private _delSheet: HTMLElement;
    private _renameSheet: HTMLElement;

    static controlTemplate = '<div class="wj-context-menu wj-control wj-flexsheet-context-menu" width="150px">' +
        '<div class="wj-context-menu-item" wj-part="insert-sheet"></div>' +
        '<div class="wj-context-menu-item" wj-part="delete-sheet"></div>' +
        '<div class="wj-context-menu-item" wj-part="rename-sheet"></div>' +
        '<div>';

    /*
    * Initializes a new instance of the _ContextMenu class.
    *
    * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
    * @param owner The {@link FlexSheet} control what the ContextMenu works with.
    */
    constructor(element: any, owner: FlexSheet) {
        super(element, owner);

        this.applyTemplate('', this.getTemplate(), {
            _insSheet: 'insert-sheet',
            _delSheet: 'delete-sheet',
            _renameSheet: 'rename-sheet'
        });

        this._init();
    }

    // Initialize the context menu.
    protected _init() {
        let ci = wijmo.culture.FlexSheet,
            self = this;

        self._insSheet.textContent = ci.insertSheet;
        self._delSheet.textContent = ci.deleteSheet;
        self._renameSheet.textContent = ci.renameSheet;

        super._init();

        self.addEventListener(self._insSheet, 'click', (e: MouseEvent) => {
            self._owner.addUnboundSheet(null, null, null, self._owner.selectedSheetIndex);
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._delSheet, 'click', (e: MouseEvent) => {
            self._owner.sheets.removeAt(self._owner.selectedSheetIndex);
            self.hide();
            self._owner.hostElement.focus();
        });
        self.addEventListener(self._renameSheet, 'click', (e: MouseEvent) => {
            self._owner._tabHolder.sheetControl._startEditingSheetName(self._owner.selectedSheetIndex);
            self.hide();
        });
    }

    // Handle the operation for the related menu item.
    protected _handleMenuItemOperation(menuItems: NodeListOf<Element>) {
        switch (menuItems[this._idx]) {
            case this._insSheet:
                this._owner.addUnboundSheet(null, null, null, this._owner.selectedSheetIndex);
                break;
            case this._delSheet:
                this._owner.sheets.removeAt(this._owner.selectedSheetIndex);
                break;
            case this._renameSheet:
                this._owner._tabHolder.sheetControl._startEditingSheetName(this._owner.selectedSheetIndex);
                break;
        }
    }

    protected _localize() {
        super._localize();

        let ci = wijmo.culture.FlexSheet;

        this._insSheet.textContent = ci.insertSheet;
        this._delSheet.textContent = ci.deleteSheet;
        this._renameSheet.textContent = ci.renameSheet;
    }
}
    }
    


    module wijmo.grid.sheet {
    







'use strict';

/**
 * Represents a sheet within the {@link FlexSheet} control.
 */
export class Sheet {
    private _name: string;
    /*private*/ _owner: FlexSheet;
    private _visible: boolean = true;
    _unboundSortDesc = new wijmo.collections.ObservableArray<_UnboundSortDescription>();
    private _currentStyledCells: _StyledCellsDict = {};
    private _currentMergedRanges: wijmo.grid.CellRange[] = [];
    private _grid: wijmo.grid.FlexGrid;
    private _selectionRanges: wijmo.collections.ObservableArray;
    private _isEmptyGrid = false;
    _rowSettings = [];
    _filterDefinition: string;
    _scrollPosition: wijmo.Point = new wijmo.Point();
    _freezeHiddenRows: boolean[];
    _freezeHiddenCols: boolean[];
    private _tables: wijmo.collections.ObservableArray;
    _sortList: ColumnSortDescription[];
    private _filterSetting: IFilterSetting;
    _showDefaultHeader: boolean = false;
    _dataView: any[];
    _ownerHeaderRowRemoved: boolean = false;

    /**
     * Initializes a new instance of the {@link Sheet} class.
     *
     * @param owner The owner {@link FlexSheet} control.
     * @param grid The associated {@link FlexGrid} control used to store the sheet data. If not specified then the 
     * new <b>FlexGrid</b> control will be created.
     * @param sheetName The name of the sheet within the {@link FlexSheet} control.
     * @param rows The row count for the sheet.
     * @param cols The column count for the sheet.
     */
    constructor(owner?: FlexSheet, grid?: wijmo.grid.FlexGrid, sheetName?: string, rows?: number, cols?: number) {
        var self = this;

        self._owner = owner;
        self._name = sheetName;
        self._sortList = [new ColumnSortDescription(-1, true)];

        rows = wijmo.isNumber(rows) && !isNaN(rows) && rows >= 0 ? rows : 200;
        cols = wijmo.isNumber(cols) && !isNaN(cols) && cols >= 0 ? cols : 20;

        if (grid) {
            self._showDefaultHeader = true;
            self._grid = grid;
            // Add header row for the grid of the bind sheet.
            self._addHeaderRow(true);
        } else {
            self._grid = this._createGrid(rows, cols);
        }
        self._grid.loadedRows.addHandler(() => {
            if (self._owner) {
                // TFS 387921
                // Make sure that the _owner's collections [i]._list property still refers to  _owner (as the collections are shared between the _owner and the _grid).
                self._owner._checkCollectionsOwner();
            }
            self._addHeaderRow();
            self._setRowSettings();
        });

        self._grid.refreshed.addHandler(() => {
            if (self._owner) {
                // Make sure that the _owner's collections [i]._list property still refers to  _owner (as the collections are shared between the _owner and the _grid).
                self._owner._checkCollectionsOwner();
            }
        });

        self._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this);

        self._unboundSortDesc.collectionChanged.addHandler(() => {
            var arr = self._unboundSortDesc,
                i: number,
                sd: _UnboundSortDescription,
                row: wijmo.grid.Row,
                sortedCellsStyle: any = {};

            for (i = 0; i < arr.length; i++) {
                sd = wijmo.tryCast(arr[i], _UnboundSortDescription);
                if (!sd) {
                    throw 'sortDescriptions array must contain SortDescription objects.';
                }
            }

            if (self._owner) {
                self._owner.rows.beginUpdate();
                self._owner.rows.sort(self._compareRows());
                if (!self._owner._isUndoing) {
                    for (i = 0; i < self._owner.rows.length; i++) {
                        row = self._owner.rows[i];
                        if (i !== row._idx) {
                            self._owner._updateFormulaForReorderingRows(row._idx, i);
                        }
                        self._owner._updateCellStyleForReorderingRows(row._idx, i, sortedCellsStyle);
                    }
                    self._currentStyledCells = sortedCellsStyle;
                }
                self._owner.rows.endUpdate();
                self._owner.rows._dirty = true;
                self._owner.rows._update();

                // Synch with current sheet.
                if (self._owner.selectedSheet) {
                    self._owner._copyTo(self._owner.selectedSheet);
                    self._owner._copyFrom(self._owner.selectedSheet);
                }
            }
        });

        self.tables.collectionChanged.addHandler((s: Object, e: wijmo.collections.NotifyCollectionChangedEventArgs) => {
            if (e.item != null && !(e.item instanceof Table)) {
                throw 'The tables only allows to handle Table instance.';
            }
            if (!self._owner) {
                return;
            }
            if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add || e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
                if (e.item) {
                    let table = <Table>e.item,
                        tableRange = table._getTableRange(),
                        flex = self === self._owner.selectedSheet ? self._owner : self.grid;

                    try {
                        if (tableRange.topRow >= flex.rows.length || tableRange.leftCol >= flex.columns.length) {
                            throw '';
                        }
                        if (tableRange.leftCol + tableRange.columnSpan > flex.columns.length) {
                            throw '';
                        }
                        if (tableRange.topRow + tableRange.rowSpan > flex.rows.length) {
                            throw '';
                        }
                        for (let r = tableRange.topRow; r <= tableRange.bottomRow; r++) {
                            for (let c = tableRange.leftCol; c <= tableRange.rightCol; c++) {
                                let otherTable = self.findTable(r, c);
                                if (otherTable !== table) {
                                    throw '';
                                }
                            }
                        }
                        table._attachSheet(self);
                    } catch (ex) {
                        self.tables.removeAt(e.index);
                    }
                }
            } else if (e.action === wijmo.collections.NotifyCollectionChangedAction.Remove) {
                if (e.item) {
                    (<Table>e.item)._detachSheet();
                }
            }
        });
    }

    /**
     * Gets the associated {@link FlexGrid} control used to store the sheet data.
     */
    get grid(): wijmo.grid.FlexGrid {
        if (this._grid['wj_sheetInfo'] == null) {
            this._grid['wj_sheetInfo'] = {};
        }
        return this._grid;
    }

    /**
     * Gets or sets the name of the sheet.
     */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (!wijmo.isNullOrWhiteSpace(value) && ((this._name && this._name.toLowerCase() !== value.toLowerCase()) || !this._name)) {
            var e = new wijmo.PropertyChangedEventArgs('sheetName', this._name, value);
            this._name = value;
            this.grid['wj_sheetInfo'].name = value;
            this.onNameChanged(e);
        }
    }

    /**
     * Gets or sets the sheet visibility.
     */
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        if (this._visible !== value) {
            this._visible = value;
            this.grid['wj_sheetInfo'].visible = value;
            this.onVisibleChanged(new wijmo.EventArgs());
        }
    }

    /**
     * Gets or sets the number of rows in the sheet.
     */
    get rowCount(): number {
        if (this._grid != null) {
            return this._grid.rows.length;
        }
        return 0;
    }
    set rowCount(value: number) {
        if (!!this.itemsSource) {
            return;
        }

        let rowsCount = this.grid.rows.length;

        if (wijmo.isNumber(value) && !isNaN(value) && value >= 0 && rowsCount !== value) {
            if (rowsCount < value) {
                for (let i = 0; i < (value - rowsCount); i++) {
                    this.grid.rows.push(new wijmo.grid.Row());
                }
            } else {
                this.grid.rows.splice(value, rowsCount - value);
            }

            this._currentStyledCells = this._adjustStylesDict(this._currentStyledCells);

            // If the sheet is current selected sheet of the flexsheet, 
            // we should synchronize the updating of the sheet to the flexsheet.
            if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                this._owner._copyFrom(this);
            }
        }
    }

    /**
     * Gets or sets the number of columns in the sheet.
     */
    get columnCount(): number {
        if (this._grid != null) {
            return this._grid.columns.length;
        }
        return 0;
    }
    set columnCount(value: number) {
        if (!!this.itemsSource) {
            return;
        }

        let colsCnt = this.grid.columns.length;

        if (wijmo.isNumber(value) && !isNaN(value) && value >= 0 && colsCnt !== value) {
            if (colsCnt < value) {
                for (let i = 0; i < (value - colsCnt); i++) {
                    this._grid.columns.push(new wijmo.grid.Column());
                }
            } else {
                this._grid.columns.splice(value, colsCnt - value);
            }

            this._currentStyledCells = this._adjustStylesDict(this._currentStyledCells);

            // If the sheet is current selected sheet of the flexsheet, 
            // we should synchronize the updating of the sheet to the flexsheet.
            if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                this._owner._copyFrom(this);
            }
        }
    }

    /**
     * Gets the selection array.
     */
    get selectionRanges(): wijmo.collections.ObservableArray {
        if (!this._selectionRanges) {
            this._selectionRanges = new wijmo.collections.ObservableArray();
            this._selectionRanges.collectionChanged.addHandler(() => {
                var selectionCnt: number,
                    lastSelection: wijmo.grid.CellRange;
                if (this._owner && !this._owner._isClicking) {
                    selectionCnt = this._selectionRanges.length;
                    if (selectionCnt > 0) {
                        lastSelection = this._selectionRanges[selectionCnt - 1];
                        if (lastSelection && lastSelection instanceof wijmo.grid.CellRange) {
                            this._owner.selection = lastSelection;
                        }
                    }
                    if (selectionCnt > 1) {
                        this._owner._enableMulSel = true;
                        this._owner.refresh(false);
                    }
                    this._owner._enableMulSel = false;
                }
            }, this);
        }
        return this._selectionRanges;
    }

    /**
     * Gets or sets the array or {@link ICollectionView} for the {@link FlexGrid} instance of the sheet.
     */
    get itemsSource(): any {
        if (this._grid != null) {
            return this._grid.itemsSource;
        }
        return null;
    }
    set itemsSource(value: any) {
        if (this._grid && (this._grid.itemsSource == value)) {
            return; // TFS 379755
        }

        // This code will never be called since this._grid is created in constructor.
        //if (this._grid == null) {
        //    this._createGrid();
        //    this._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, self);
        //}

        if (!this._owner || !this._owner._isCopying) {
            this._dataView = null;
        }

        if (this._isEmptyGrid) {
            this._clearGrid();
        }

        this._grid.itemsSource = value;
    }

    /**
     * Gets or sets the filter setting for this sheet.
     */
    get filterSetting(): IFilterSetting {
        if (this._owner && this === this._owner.selectedSheet) {
            this._getFilterSetting();
        }
        return this._filterSetting;
    }
    set filterSetting(value: IFilterSetting) {
        this._filterSetting = value;
        if (this._owner && this === this._owner.selectedSheet) {
            this._applyFilterSetting();
        }
    }

    /**
     * Gets the collection of the {@link Table} objects on this Sheet.
     * It allows to insert/remove {@link Table} on this Sheet via the tables collection.
     */
    get tables(): wijmo.collections.ObservableArray {
        if (this._tables == null) {
            this._tables = new wijmo.collections.ObservableArray();
        }
        return this._tables;
    }

    /*
     * Gets or sets the styled cells
     * This property uses the cell index as the key and stores the @ICellStyle object as the value.
     * { 1: { fontFamily: xxxx, fontSize: xxxx, .... }, 2: {...}, ... }
     */
    get _styledCells(): _StyledCellsDict {
        if (!this._currentStyledCells) {
            this._currentStyledCells = {};
        }

        this._currentStyledCells.columnCount = this.columnCount;
        this._currentStyledCells.rowCount = this.rowCount;

        return this._currentStyledCells;
    }
    set _styledCells(value: _StyledCellsDict) {
        //value = this._adjustStylesDict(value); // ensure that indicies are OK when style is restored due to 'undo' operation.
        this._currentStyledCells = value;
    }

    /*
     * Gets or sets the merge ranges.
     */
    get _mergedRanges(): wijmo.grid.CellRange[] {
        if (!this._currentMergedRanges) {
            this._currentMergedRanges = [];
        }
        return this._currentMergedRanges;
    }

    /**
     * Occurs after the sheet name has changed.
     */
    readonly nameChanged = new wijmo.Event<Sheet, wijmo.PropertyChangedEventArgs>();
    /**
     * Raises the {@link nameChanged} event.
     */
    onNameChanged(e: wijmo.PropertyChangedEventArgs) {
        this.nameChanged.raise(this, e);
    }

    /**
     * Occurs after the visible of sheet has changed.
     */
    readonly visibleChanged = new wijmo.Event<Sheet, wijmo.EventArgs>();
    /**
     * Raises the {@link visibleChanged} event.
     */
    onVisibleChanged(e: wijmo.EventArgs) {
        this.visibleChanged.raise(this, e);
    }

    /**
     * Dispose sheet instance.
     */
    dispose() {
        this._clearGrid();
        this._grid['wj_sheetInfo'] = null;
        this._grid.dispose();
        this._grid = null;

        if (this._tables != null) {
            for (let i = 0; i < this._tables.length; i++) {
                this._tables[i] = null;
            }
            this._tables = null;
        }
    }

    /**
     * Gets the style of specified cell.
     *
     * @param rowIndex the row index of the specified cell.
     * @param columnIndex the column index of the specified cell.
     */
    getCellStyle(rowIndex: number, columnIndex: number): ICellStyle {
        var cellIndex: number,
            rowCnt = this._grid.rows.length,
            colCnt = this._grid.columns.length;

        if (rowIndex >= rowCnt || columnIndex >= colCnt) {
            return null;
        }

        cellIndex = rowIndex * colCnt + columnIndex;

        return this._styledCells[cellIndex];
    }

    /**
     * Add table from an object array.
     *
     * @param row The row position of the table.
     * @param column The column position of the table.
     * @param array The object array load to the table.
     * @param properties It allows to retrieve only a subset of columns from the object of the array.  If it is omitted, the table will load all the keys of the object of the array.
     * @param tableName The name of the table.
     * @param tableStyle The table style is applied to the table.
     * @param options The options {@link ITableOptions} of the table.
     * @param shift Indicates whether cells beneath the table should be shifted or not.  If not specified cells beneath will be shifted.
     * @return the table if the table was added successfully, otherwise retun null.
     */
    addTableFromArray(row: number, column: number, array: any[], properties?: string[], tableName?: string, tableStyle?: TableStyle, options?: ITableOptions, shift: boolean = true): Table {
        let table: Table,
            tableColumns: TableColumn[],
            tableColumn: TableColumn,
            tableRange: wijmo.grid.CellRange,
            shiftCnt: number,
            addRowCnt: number,
            addColumnCnt: number,
            index: number,
            r: number,
            c: number,
            key: string,
            needMoveDownCells = false,
            flex: any,
            dataSourceIsCV: boolean;

        if (!this._owner) {
            return;
        }

        flex = this === this._owner.selectedSheet ? this._owner : this.grid

        if (array == null || array.length === 0) {
            throw 'Invalid array to load.';
        }

        if (properties == null || properties.length === 0) {
            properties = Object.keys(array[0]);
            if (properties == null || properties.length === 0) {
                throw 'Invalid array to load.';
            }
        }

        if (row >= this.rowCount || column >= this.columnCount) {
            return null;
        }

        let showHeader = (options && options.showHeaderRow) == null || options.showHeaderRow, // default is true
            showTotal = !!(options && options.showTotalRow),
            dataRowFirst = row + (showHeader ? 1 : 0),
            dataRowLast = dataRowFirst + array.length - 1,
            tableRowLast = dataRowLast + (showTotal ? 1 : 0);

        tableColumns = [];
        for (c = 0; c < properties.length; c++) {
            key = properties[c];
            tableColumn = new TableColumn(key);
            if (c === 0) {
                tableColumn._totalRowLabel = 'Total';
            } else if (c === properties.length - 1) {
                tableColumn._totalRowFunction = 'Sum';
            }
            tableColumns.push(tableColumn);
        }

        tableRange = new wijmo.grid.CellRange(row, column, tableRowLast, column + properties.length - 1);
        shiftCnt = this._needShiftForTable(tableRange);
        if (shiftCnt !== 0) {
            if (!shift) {
                return null;
            } else {
                if (this._canShiftCells(tableRange)) {
                    addRowCnt = this._needAddRowCountForAddTable(shiftCnt, tableRange);
                    if (flex.collectionView) {
                        dataSourceIsCV = flex.itemsSource instanceof wijmo.collections.CollectionView;
                        flex.collectionView.beginUpdate();
                        for (index = 0; index < addRowCnt; index++) {
                            if (dataSourceIsCV) {
                                flex.itemsSource.sourceCollection.push({});
                            } else {
                                flex.itemsSource.push({});
                            }
                        }
                        flex.collectionView.endUpdate(true);
                    } else {
                        for (index = 0; index < addRowCnt; index++) {
                            flex.rows.push(new wijmo.grid.Row());
                        }
                    }
                    needMoveDownCells = true;
                } else {
                    return null;
                }
            }
        }

        if (column + properties.length >= flex.columns.length) {
            if (!shift) {
                return null;
            } else {
                addColumnCnt = column + properties.length - flex.columns.length + 1;
                if (this.itemsSource && addColumnCnt > 0) {
                    return null;
                }
                flex.columns.beginUpdate();
                for (index = 0; index < addColumnCnt; index++) {
                    flex.columns.push(new wijmo.grid.Column());
                }
                flex.columns.endUpdate();
            }
        }

        flex.beginUpdate();
        if (needMoveDownCells) {
            this._moveDownCells(shiftCnt, tableRange);
        }
        if (showHeader) {
            for (c = 0; c < properties.length; c++) {
                key = properties[c];
                flex.setCellData(row, column + c, key);
            }
        }
        for (r = 0; r < array.length; r++) {
            for (c = 0; c < properties.length; c++) {
                key = properties[c];
                flex.setCellData(dataRowFirst + r, column + c, array[r][key]);
            }
        }
        flex.endUpdate();

        table = this._addTable(tableRange, tableName, tableStyle, tableColumns, options);
        return table;
    }

    /**
     * Finds the table via the cell location.
     *
     * @param rowIndex the row index of the specified cell.
     * @param columnIndex the column index of the specified cell.
     */
    findTable(rowIndex: number, columnIndex: number): Table {
        let tbs = this._tables,
            len = 0;

        if (tbs && ((len = tbs.length) > 0)) {
            for (let i = 0; i < len; i++) {
                let t = tbs[i] as Table,
                    tr = t._getTableRange();

                if (rowIndex >= tr.topRow && rowIndex <= tr.bottomRow
                    && columnIndex >= tr.leftCol && columnIndex <= tr.rightCol) {
                    return t;
                }
            }
        }

        return null;
    }

    // Attach the sheet to the {@link FlexSheet} control as owner.
    _attachOwner(owner: FlexSheet) {
        if (this._owner !== owner) {
            this._owner = owner;

            if (this._owner) { // 395550
                // let fn = () => {
                //     this._addHeaderRow();
                //     this._owner.loadedRows.removeHandler(fn);
                // };
                // this._owner.loadedRows.addHandler(fn);

                // 402869. Event.raise doesn't works well when the handler himself unsubscribes from the event.
                var flag = false;
                this._owner.loadedRows.addHandler(() => {
                    if (!flag) { // run once
                        flag = true;
                        this._addHeaderRow();
                    }
                });
            }
        }
    }

    // Update the sheet name with valid name.
    _setValidName(validName: string) {
        this._name = validName;
        this.grid['wj_sheetInfo'].name = validName;
    }

    // Store the row settings FlexSheet.
    _storeRowSettings() {
        var rowIdx = 0,
            row: wijmo.grid.Row;

        if (!this._owner) {
            return;
        }
        this._rowSettings = [];
        for (; rowIdx < this._grid.rows.length; rowIdx++) {
            row = this._owner.rows[rowIdx];
            if (row) {
                this._rowSettings[rowIdx] = {
                    height: row.height,
                    allowMerging: row.allowMerging,
                    isCollapsed: row instanceof wijmo.grid.GroupRow ? (<wijmo.grid.GroupRow>row).isCollapsed : null,
                    visible: row.visible,
                    isSelected: row.isSelected,
                    readOnly: row.isReadOnly
                }
            }
        }
    }

    // Set the row settings to the sheet grid.
    _setRowSettings() {
        var rowIdx = 0,
            row: wijmo.grid.Row,
            rowSetting: any,
            isHeaderRow: boolean;

        for (; rowIdx < this._rowSettings.length; rowIdx++) {
            rowSetting = this._rowSettings[rowIdx];
            if (rowSetting) {
                row = this._grid.rows[rowIdx];
                if (row) {
                    isHeaderRow = row instanceof HeaderRow;
                    row.height = rowSetting.height;
                    row.allowMerging = rowSetting.allowMerging;
                    row.visible = rowSetting.visible;
                    if (row instanceof wijmo.grid.GroupRow) {
                        (<wijmo.grid.GroupRow>row).isCollapsed = !!rowSetting.isCollapsed;
                    }
                    row.isSelected = !!rowSetting.isSelected;
                    row.isReadOnly = isHeaderRow || !!rowSetting.readOnly;
                }
            }
        }
    }

    // Add table in FlexSheet.
    _addTable(range: wijmo.grid.CellRange, tableName?: string, tableStyle?: TableStyle, columns?: TableColumn[], options?: ITableOptions): Table {
        if (!range.isValid || !this._owner) {
            return null;
        }
        let table: Table;
        if (tableName == null || this._owner._getTable(tableName) != null) {
            tableName = this._getUniqueTableName();
        }

        table = new Table(tableName, range, tableStyle, columns, options);
        this.tables.push(table);

        return table;
    }

    // Add selection into selectionRanges array.
    _addSelection(val: wijmo.grid.CellRange) {
        let sr = this.selectionRanges;

        sr.beginUpdate();

        for (let i = sr.length - 1; i >= 0; i--) {
            if (val.contains(sr[i])) {
                sr.removeAt(i);
            }
        }

        if (val.isValid) {
            sr.push(val);
        }

        sr.endUpdate();
    }

    // comparison function used in rows sort for unbound sheet.
    private _compareRows() {
        var self = this,
            sortDesc = this._unboundSortDesc;

        return function (a, b) {
            for (var i = 0; i < sortDesc.length; i++) {

                // get values
                var sd = <_UnboundSortDescription>sortDesc[i],
                    v1 = a._ubv && sd.column ? a._ubv[sd.column._hash] : '',
                    v2 = b._ubv && sd.column ? b._ubv[sd.column._hash] : '';

                // if the cell value is formula, we should try to evaluate this formula.
                if (_isFormula(v1)) {
                    v1 = self._owner.evaluate(v1);
                }
                if (_isFormula(v2)) {
                    v2 = self._owner.evaluate(v2);
                }

                // check for NaN (isNaN returns true for NaN but also for non-numbers)
                if (v1 !== v1) v1 = null;
                if (v2 !== v2) v2 = null;

                // ignore case when sorting  (but add the original string to keep the 
                // strings different and the sort consistent, 'aa' between 'AA' and 'bb')
                if (wijmo.isString(v1)) v1 = v1.toLowerCase() + v1;
                if (wijmo.isString(v2)) v2 = v2.toLowerCase() + v2;

                // compare the values (at last!)
                if (v1 === '' || v1 == null) {
                    return 1;
                }
                if (v2 === '' || v2 == null) {
                    return -1;
                }
                var cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
                if (wijmo.isString(v1) && wijmo.isNumber(v2)) {
                    cmp = 1;
                }
                if (wijmo.isString(v2) && wijmo.isNumber(v1)) {
                    cmp = -1;
                }
                if (cmp !== 0) {
                    return sd.ascending ? +cmp : -cmp;
                }
            }
            return 0;
        }
    }

    // Create a blank flexsheet.
    private _createGrid(rowsCnt: number, columnsCnt: number): wijmo.grid.FlexGrid {
        var hostElement = document.createElement('div'),
            grid: wijmo.grid.FlexGrid,
            column: wijmo.grid.Column,
            colIndex: number,
            rowIndex: number;

        this._isEmptyGrid = true;
        // We should append the host element of the data grid of current sheet to body before creating data grid,
        // this will make the host element to inherit the style of body (TFS 121713)
        hostElement.style.visibility = 'hidden';
        document.body.appendChild(hostElement);
        grid = new wijmo.grid.FlexGrid(hostElement);
        document.body.removeChild(hostElement);

        for (rowIndex = 0; rowIndex < rowsCnt; rowIndex++) {
            grid.rows.push(new wijmo.grid.Row());
        }

        for (colIndex = 0; colIndex < columnsCnt; colIndex++) {
            column = new wijmo.grid.Column();
            // Setting the required property of the column to false for the data grid of current sheet.
            // TFS #126125
            column.isRequired = false;
            grid.columns.push(column);
        }

        // Add sheet related info into the flexgrid.
        // This property contains the name, style of cells and merge cells of current sheet.
        grid['wj_sheetInfo'] = {
            name: this.name,
            visible: this.visible,
            styledCells: this._styledCells,
            mergedRanges: this._mergedRanges
        };

        return grid;
    }

    // Clear the grid of the sheet.
    private _clearGrid() {
        this._grid.rows.clear();
        this._grid.columns.clear();
        this._grid.columnHeaders.columns.clear();
        this._grid.rowHeaders.rows.clear();
    }

    // Items source changed handler for the grid of the sheet.
    private _gridItemsSourceChanged() {
        var self = this;
        if (!this._owner || this._owner._isCopying) {
            return;
        }
        // If the sheet is current seleced sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
        if (this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
            this._owner.filter.clear();

            this._owner._copyFrom(this, false);
            setTimeout(() => {
                self._owner._setFlexSheetToDirty();
                self._owner.invalidate();
            }, 10);

            // this._owner.beginUpdate();
            // this._owner._copyFrom(this);
            // setTimeout(() => {
            //     self._owner._setFlexSheetToDirty();
            //     self._owner.endUpdate();
            // }, 10);
        }
    }

    // Add header row for the bound grid.
    private _addHeaderRow(isPassedInConstructor: boolean = false) {
        var row: HeaderRow,
            col: wijmo.grid.Column;
        if (this._needAddHeaderRow() || isPassedInConstructor) {
            var row = new HeaderRow(),
                col: wijmo.grid.Column;
            row.isReadOnly = true;
            for (var i = 0; i < this._grid.columns.length; i++) {
                col = this._grid.columns[i]
                if (!row._ubv) {
                    row._ubv = {};
                }
                row._ubv[col._hash] = FlexSheet._getHeaderRowText(col);
            }
            this._grid.rows.insert(0, row);
        }
    }

    // Check whether need to add a HeaderRow for grid instance of the sheet.
    private _needAddHeaderRow() {
        let hdr = this._grid.allowAddNew && this._grid.newRowAtTop ? this._grid.rows[1] : this._grid.rows[0];
        if (this._grid.collectionView && !(<wijmo.collections.CollectionView>this._grid.collectionView).isEmpty && !(hdr instanceof HeaderRow)) {
            if (this._owner == null || !this._owner.rows.length) {
                return true;
            }
            let ownerHdr = this._owner.allowAddNew && this._owner.newRowAtTop ? this._owner.rows[1] : this._owner.rows[0];
            return ownerHdr instanceof HeaderRow;
        } else {
            return false;
        }
    }

    // Get the unique name of the table.
    private _getUniqueTableName(): string {
        var validName = 'Table1',
            index = 2;
        do {
            if (this._owner._getTable(validName) == null) {
                break;
            } else {
                validName = 'Table' + index;
            }
            index = index + 1;
        } while (true);

        return validName;
    }

    // Check whether need shift cells when add table from array.
    private _needShiftForTable(range: wijmo.grid.CellRange): number {
        let shiftCnt = 0,
            index = 0,
            row: number,
            col: number,
            cellData: any,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (row = range.topRow; row <= range.bottomRow; row++) {
            if (row >= flex.rows.length) {
                shiftCnt = range.rowSpan - index;
                return shiftCnt;
            }
            for (col = range.leftCol; col <= range.rightCol && col < flex.columns.length; col++) {
                cellData = flex.getCellData(row, col, false);
                if (cellData != null && cellData !== '') {
                    shiftCnt = range.rowSpan - index;
                    return shiftCnt;
                }
            }
            index++;
        }

        return shiftCnt;
    }

    // Check whether need add new row in the flexsheet.    
    private _needAddRowCountForAddTable(shiftCount: number, tableRange: wijmo.grid.CellRange): number {
        var i: number,
            rowIndex: number,
            colIndex: number,
            cellData: any,
            cellStyle: ICellStyle,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (i = 1; i <= shiftCount; i++) {
            rowIndex = flex.rows.length - i;
            for (colIndex = tableRange.leftCol; colIndex <= tableRange.rightCol && colIndex < flex.columns.length; colIndex++) {
                cellData = flex.getCellData(rowIndex, colIndex, false);
                cellStyle = this.getCellStyle(rowIndex, colIndex);
                if ((cellData != null && cellData !== '') || cellStyle != null) {
                    return shiftCount - i + 1;
                }
            }
        }

        return 0;
    }

    // Move down the table.
    _moveDownTable(table: Table) {
        let range = table._getTableRange(),
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (let rowIndex = range.bottomRow; rowIndex >= range.topRow; rowIndex--) {
            for (let colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                let column = flex.columns[colIndex],
                    formatted = column.dataMap != null,
                    cellData = flex.getCellData(rowIndex, colIndex, formatted);

                flex.setCellData(rowIndex + 1, colIndex, cellData);
                flex.setCellData(rowIndex, colIndex, '');
            }
        }
        table._updateTableRange(1, 1, 0, 0);
    }

    // Move down the cells below the table.
    _moveDownCells(count: number, range: wijmo.grid.CellRange) {
        var rowIndex: number,
            colIndex: number,
            cellData: any,
            cellStyle: ICellStyle,
            cellIndex: number,
            newCellIndex: number,
            mergeRange: wijmo.grid.CellRange,
            column: wijmo.grid.Column,
            formatted: boolean,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (rowIndex = flex.rows.length - 1 - count; rowIndex >= range.topRow; rowIndex--) {
            for (colIndex = range.leftCol; colIndex <= range.rightCol && colIndex < flex.columns.length; colIndex++) {
                column = flex.columns[colIndex];
                formatted = column.dataMap != null;
                cellData = flex.getCellData(rowIndex, colIndex, formatted);
                flex.setCellData(rowIndex + count, colIndex, cellData);
                flex.setCellData(rowIndex, colIndex, '');
                cellStyle = this.getCellStyle(rowIndex, colIndex);
                newCellIndex = (rowIndex + count) * flex.columns.length + colIndex;
                cellIndex = rowIndex * flex.columns.length + colIndex;
                if (cellStyle) {
                    this._styledCells[newCellIndex] = cellStyle;
                    this._styledCells[cellIndex] = null;
                }
                mergeRange = this._mergedRanges[cellIndex];
                if (mergeRange) {
                    mergeRange.row += count;
                    mergeRange.row2 += count;
                    this._mergedRanges[newCellIndex] = mergeRange;
                    this._mergedRanges[cellIndex] = null;
                }
                let table = this.findTable(rowIndex, colIndex);
                if (table) {
                    let tableRange = table._getTableRange();
                    if (tableRange.topRow === rowIndex && tableRange.leftCol === colIndex) {
                        table._updateTableRange(count, count, 0, 0);
                    }
                }
            }
        }
    }

    // Move up the cells below the table.
    _moveUpCells(count: number, range: wijmo.grid.CellRange) {
        var rowIndex: number,
            colIndex: number,
            cellData: any,
            cellStyle: ICellStyle,
            cellIndex: number,
            newCellIndex: number,
            mergeRange: wijmo.grid.CellRange,
            column: wijmo.grid.Column,
            formatted: boolean,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (rowIndex = range.topRow; rowIndex < flex.rows.length; rowIndex++) {
            for (colIndex = range.leftCol; colIndex <= range.rightCol && colIndex < flex.columns.length; colIndex++) {
                column = flex.columns[colIndex];
                formatted = column.dataMap != null;
                cellData = flex.getCellData(rowIndex, colIndex, formatted);
                flex.setCellData(rowIndex - count, colIndex, cellData);
                flex.setCellData(rowIndex, colIndex, '');
                cellStyle = this.getCellStyle(rowIndex, colIndex);
                newCellIndex = (rowIndex - count) * flex.columns.length + colIndex;
                cellIndex = rowIndex * flex.columns.length + colIndex;
                if (cellStyle) {
                    this._styledCells[newCellIndex] = cellStyle;
                    this._styledCells[cellIndex] = null;
                }
                mergeRange = this._mergedRanges[cellIndex];
                if (mergeRange) {
                    mergeRange.row -= count;
                    mergeRange.row2 -= count;
                    this._mergedRanges[newCellIndex] = mergeRange;
                    this._mergedRanges[cellIndex] = null;
                }
                let table = this.findTable(rowIndex, colIndex);
                if (table) {
                    let tableRange = table._getTableRange();
                    if (tableRange.topRow === rowIndex && tableRange.leftCol === colIndex) {
                        table._updateTableRange(-count, -count, 0, 0);
                    }
                }
            }
        }
    }

    // Move down the cells within table when insert rows in table.
    _moveDownCellsWithinTable(index: number, count: number, tableRange: wijmo.grid.CellRange) {
        let cellStyle: ICellStyle,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (let rowIndex = tableRange.bottomRow; rowIndex > tableRange.topRow + index; rowIndex--) {
            for (let colIndex = tableRange.leftCol; colIndex <= tableRange.rightCol; colIndex++) {
                let column = flex.columns[colIndex],
                    formatted = column.dataMap != null,
                    cellData = flex.getCellData(rowIndex, colIndex, formatted);

                flex.setCellData(rowIndex + count, colIndex, cellData);
                flex.setCellData(rowIndex, colIndex, '');

                let newCellIndex = (rowIndex + count) * flex.columns.length + colIndex,
                    cellIndex = rowIndex * flex.columns.length + colIndex;

                if (cellStyle) { // ?? cellStyle is never assigned
                    this._styledCells[newCellIndex] = cellStyle;
                    this._styledCells[cellIndex] = null;
                }
            }
        }
    }

    // Move up the cells within table when remove rows in table.
    _moveUpCellsWithinTable(index: number, count: number, tableRange: wijmo.grid.CellRange) {
        var rowIndex: number,
            colIndex: number,
            cellData: any,
            cellIndex: number,
            newCellIndex: number,
            cellStyle: ICellStyle,
            column: wijmo.grid.Column,
            formatted: boolean,
            beginIndex = tableRange.topRow + index,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (rowIndex = beginIndex; rowIndex <= tableRange.bottomRow; rowIndex++) {
            for (colIndex = tableRange.leftCol; colIndex <= tableRange.rightCol; colIndex++) {
                if (rowIndex >= beginIndex + count) {
                    column = flex.columns[colIndex];
                    formatted = column.dataMap != null;
                    cellData = flex.getCellData(rowIndex, colIndex, formatted);
                    flex.setCellData(rowIndex - count, colIndex, cellData);
                }
                flex.setCellData(rowIndex, colIndex, '');
                newCellIndex = (rowIndex - count) * flex.columns.length + colIndex;
                cellIndex = rowIndex * flex.columns.length + colIndex;
                if (cellStyle) {
                    this._styledCells[newCellIndex] = cellStyle;
                    this._styledCells[cellIndex] = null;
                }
            }
        }
    }

    // Check whether other table or merged cell is located below the table.
    _canShiftCells(shiftRange: wijmo.grid.CellRange) {
        var flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (let rowIndex = shiftRange.topRow; rowIndex < flex.rows.length; rowIndex++) {
            for (let colIndex = shiftRange.leftCol; colIndex <= shiftRange.rightCol && colIndex < flex.columns.length; colIndex++) {
                let table = this.findTable(rowIndex, colIndex);
                if (table) {
                    let tableRange = table._getTableRange();
                    if (tableRange.leftCol < shiftRange.leftCol || tableRange.rightCol > shiftRange.rightCol) {
                        return false;
                    }
                }

                let cellIndex = rowIndex * flex.columns.length + colIndex,
                    mergeRange = this._mergedRanges[cellIndex];

                if (mergeRange && (mergeRange.leftCol < shiftRange.leftCol || mergeRange.rightCol > shiftRange.rightCol)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Check whether need move down the table when show the header row.
    _needMoveDownTable(table: Table): boolean {
        var i: number,
            cellData: any,
            range = table.getRange(),
            columns = table.getColumns(),
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        if (range.topRow === 0) {
            return true;
        }

        for (i = 0; i < columns.length; i++) {
            cellData = flex.getCellData(range.topRow - 1, range.leftCol + i, false);
            if (cellData != null && cellData !== '') {
                return true;
            }
        }

        return false;
    }

    // Check whether need add new row in the flexsheet when insert rows in specific table.    
    _needAddRowCountForInsertTableRows(count: number, range: wijmo.grid.CellRange): number {
        var i: number,
            rowIndex: number,
            colIndex: number,
            cellData: any,
            cellStyle: ICellStyle,
            flex = this === this._owner.selectedSheet ? this._owner : this.grid;

        for (i = 1; i <= count; i++) {
            rowIndex = flex.rows.length - i;
            if (rowIndex <= range.bottomRow) {
                return count;
            }
            for (colIndex = range.leftCol; colIndex <= range.rightCol && colIndex < flex.columns.length; colIndex++) {
                cellData = flex.getCellData(rowIndex, colIndex, false);
                cellStyle = this.getCellStyle(rowIndex, colIndex);
                if ((cellData != null && cellData !== '') || cellStyle != null) {
                    return count - i + 1;
                }
            }
        }

        return 0;
    }

    // Gets the filter setting of this sheet.
    _getFilterSetting() {
        let index = 0,
            cf: wijmo.grid.filter.ColumnFilter;

        this._filterDefinition = this._owner.filter.filterDefinition;
        this._filterSetting = {};
        this._filterSetting.filterColumns = this._owner.filter.filterColumns;
        if (!this._filterSetting.columnFilterSettings) {
            this._filterSetting.columnFilterSettings = [];
        }

        for (; index < this._owner.filter['_filters'].length; index++) {
            cf = this._owner.filter['_filters'][index];
            if (cf) {
                this._filterSetting.columnFilterSettings.push({
                    column: cf.column,
                    filterType: cf.filterType,
                    dataMap: cf.dataMap,
                    valueFilterSetting: {
                        maxValues: cf.valueFilter.maxValues,
                        uniqueValues: cf.valueFilter.uniqueValues,
                        sortValues: cf.valueFilter.sortValues,
                        dataMap: cf.valueFilter.dataMap,
                        exclusiveValueSearch: cf.valueFilter.exclusiveValueSearch
                    },
                    conditionFilterSetting: {
                        dataMap: cf.conditionFilter.dataMap
                    }
                });
            }
        }
    }

    // Applies the filter setting for the filter of this sheet.
    _applyFilterSetting() {
        let index = 0,
            columnFilterSettings: IColumnFilterSetting[],
            columnFilterSetting: IColumnFilterSetting,
            valueFilterSetting: IValueFiterSetting,
            coditionFilterSetting: IConditionFilterSetting,
            cf: wijmo.grid.filter.ColumnFilter,
            cfvShowValues: any[],
            cfvFilterText: string,
            cfcCondition1: any,
            cfcCondition2: any,
            cfcAnd: boolean;

        if (this._filterSetting == null) {
            this._clearFilterSetting();
        } else {
            this._owner.filter.filterColumns = this._filterSetting.filterColumns;
            if (this._filterDefinition) {
                this._owner.filter.filterDefinition = this._filterDefinition;
            }
            columnFilterSettings = this._filterSetting.columnFilterSettings;
            if (columnFilterSettings != null && columnFilterSettings.length > 0) {
                for (; index < columnFilterSettings.length; index++) {
                    columnFilterSetting = columnFilterSettings[index];
                    if (columnFilterSetting && columnFilterSetting.column != null) {
                        cf = this._owner.filter.getColumnFilter(columnFilterSetting.column);
                        if (cf) {
                            cfvShowValues = cf.valueFilter.showValues;
                            cfvFilterText = cf.valueFilter.filterText;
                            cfcCondition1 = {
                                operator: cf.conditionFilter.condition1.operator,
                                value: cf.conditionFilter.condition1.value
                            };
                            cfcCondition2 = {
                                operator: cf.conditionFilter.condition2.operator,
                                value: cf.conditionFilter.condition2.value
                            };
                            cfcAnd = cf.conditionFilter.and;
                            if (columnFilterSetting.dataMap != null) {
                                cf.dataMap = columnFilterSetting.dataMap;
                            }
                            if (columnFilterSetting.filterType != null) {
                                cf.filterType = columnFilterSetting.filterType;
                            }
                            valueFilterSetting = columnFilterSetting.valueFilterSetting;
                            if (valueFilterSetting) {
                                if (valueFilterSetting.dataMap) {
                                    cf.valueFilter.dataMap = valueFilterSetting.dataMap;
                                }
                                if (valueFilterSetting.maxValues != null) {
                                    cf.valueFilter.maxValues = valueFilterSetting.maxValues;
                                }
                                if (valueFilterSetting.sortValues != null) {
                                    cf.valueFilter.sortValues = valueFilterSetting.sortValues;
                                }
                                if (valueFilterSetting.uniqueValues) {
                                    cf.valueFilter.uniqueValues = valueFilterSetting.uniqueValues;
                                }
                                cf.valueFilter.exclusiveValueSearch = valueFilterSetting.exclusiveValueSearch;
                            }
                            coditionFilterSetting = columnFilterSetting.conditionFilterSetting;
                            if (coditionFilterSetting) {
                                if (coditionFilterSetting.dataMap) {
                                    cf.conditionFilter.dataMap = coditionFilterSetting.dataMap;
                                }
                            }
                            cf.valueFilter.showValues = cfvShowValues;
                            cf.valueFilter.filterText = cfvFilterText;
                            cf.conditionFilter.condition1.operator = cfcCondition1.operator;
                            cf.conditionFilter.condition1.value = cfcCondition1.value;
                            cf.conditionFilter.condition2.operator = cfcCondition2.operator;
                            cf.conditionFilter.condition2.value = cfcCondition2.value;
                            cf.conditionFilter.and = cfcAnd;
                        }
                    }
                }
            }
        }
    }

    // Clone the merged cells array of this sheet.
    _cloneMergedCells(): wijmo.grid.CellRange[] {
        let index = 0,
            cloneMergedCells = [],
            mergedCell: wijmo.grid.CellRange;

        for (; index < this._mergedRanges.length; index++) {
            mergedCell = this._mergedRanges[index];
            cloneMergedCells.push(mergedCell.clone());
        }

        return cloneMergedCells;
    }

    // Get the merge cells in current sheet via row index and column index.
    _getMergedRange(row: number, col: number): wijmo.grid.CellRange {
        let index: number,
            mergedRange: wijmo.grid.CellRange;

        for (index = 0; index < this._mergedRanges.length; index++) {
            mergedRange = this._mergedRanges[index];
            if (row >= mergedRange.topRow && row <= mergedRange.bottomRow && col >= mergedRange.leftCol && col <= mergedRange.rightCol) {
                return mergedRange;
            }
        }

        return null;
    }

    // Clear the filter setting for the filter of this sheet.
    private _clearFilterSetting() {
        this._owner.filter['_filters'] = [];
        this._owner.filter.filterColumns = null;

        if (this._filterDefinition) {
            this._owner.filter.filterDefinition = this._filterDefinition;
        }
    }

    // Rebuilds the dict with updated indicies according to the rowCount and columnCount properties.
    // Use it when changing rowCount or columnCount.
    private _adjustStylesDict(dict: _StyledCellsDict): _StyledCellsDict {
        if (!dict) {
            return;
        }

        let oldColCnt = dict.columnCount,
            oldRowCnt = dict.rowCount,
            newColCnt = this.columnCount,
            newRowCnt = this.rowCount;

        if ((oldColCnt && oldColCnt != newColCnt) || (oldRowCnt && oldRowCnt != newRowCnt)) {
            let nd: _StyledCellsDict = {};

            // recalculate incicies
            Object.keys(dict).forEach(key => {
                let idx = +key;

                if (isNaN(idx)) {
                    return; // skip 'columnCount' and 'rowCount' properties
                }

                // row and column indicies within the original dict.
                let r = Math.floor(idx / oldColCnt),  // IE doesn't support Math.trunc
                    c = idx % oldColCnt;

                // if indicies are valid
                if (r < newRowCnt && c < newColCnt) {
                    // then add style to the new dictionary
                    nd[r * newColCnt + c] = dict[key];
                }

                // and delete it from the original dictionary
                delete dict[key];
            });

            dict = nd;
        }

        dict.columnCount = newColCnt;
        dict.rowCount = newRowCnt;

        return dict;
    }
}

/**
 * Defines the collection of the {@link Sheet} objects.
 */
export class SheetCollection<T extends Sheet = Sheet> extends wijmo.collections.ObservableArray<T> {
    private _current: number = -1;
    _exchangingPosition: boolean;

    /**
     * Occurs when the {@link SheetCollection} is cleared.
     */
    readonly sheetCleared = new wijmo.Event<SheetCollection, wijmo.EventArgs>();
    /**
     * Raises the sheetCleared event.
     */
    onSheetCleared() {
        this.sheetCleared.raise(this);
    }

    /**
     * Gets or sets the index of the currently selected sheet.
     */
    get selectedIndex(): number {
        return this._current;
    }
    set selectedIndex(index: number) {
        this._moveCurrentTo(+index);
    }

    /**
     * Occurs when the <b>selectedIndex</b> property changes.
     */
    readonly selectedSheetChanged = new wijmo.Event<SheetCollection, wijmo.EventArgs>();
    /**
     * Raises the <b>currentChanged</b> event.
     *
     * @param e {@link PropertyChangedEventArgs} that contains the event data.
     */
    onSelectedSheetChanged(e: wijmo.PropertyChangedEventArgs) {
        this.selectedSheetChanged.raise(this, e);
    }


    // There is no need to override.
    // It is enough to call the base method, the splice() will do the rest.
    // As a result, the _postprocessSheet() will not be called twice.

    ///**
    // * Inserts an item at a specific position in the array.
    // * Overrides the insert method of its base class {@link ObservableArray}. 
    // *
    // * @param index Position where the item will be added.
    // * @param item Item to add to the array.
    // */
    //insert(index: number, item: T) {
    //    var name = item.name ? this.getValidSheetName(item) : this._getUniqueName();
    //    if (name !== item.name) {
    //        item.name = name;
    //    }
    //    super.insert(index, item);
    //    this._postprocessSheet(item);
    //}

    /**
     * Adds one or more items to the end of the array.
     * Overrides the push method of its base class {@link ObservableArray}. 
     *
     * @param ...item One or more items to add to the array.
     * @return The new length of the array.
     */
    push(...item: T[]): number {
        for (var idx = 0; idx < item.length; idx++) {
            var name = item[idx].name ? this.getValidSheetName(item[idx]) : this._getUniqueName();
            if (name !== item[idx].name) {
                item[idx].name = name;
            }
            super.push(item[idx]);
            this._postprocessSheet(item[idx]);
        }
        return this.length;
    }

    /**
     * Removes and/or adds items to the array.
     * Overrides the splice method of its base class {@link ObservableArray}. 
     *
     * @param index Position where items will be added or removed.
     * @param count Number of items to remove from the array.
     * @param ...item Items to add to the array.
     * @return An array containing the removed elements.
     */
    splice(index: number, count: number, ...item: T[]): any[] {
        item.forEach(sheet => {
            sheet.name = sheet.name ? this.getValidSheetName(sheet) : this._getUniqueName();
            this._postprocessSheet(sheet);
        });
        return super.splice(index, count, ...item);
    }

    onCollectionChanged(e?: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (this._current >= this.length) {
            this._current = this.length - 1;
        }
        super.onCollectionChanged(e);
    }

    /**
     * Occurs after the name of the sheet in the collection has changed.
     */
    readonly sheetNameChanged = new wijmo.Event<SheetCollection, wijmo.collections.NotifyCollectionChangedEventArgs>();
    /**
     * Raises the <b>sheetNameChanged</b> event.
     */
    onSheetNameChanged(e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        this.sheetNameChanged.raise(this, e);
    }

    /**
     * Occurs after the visible of the sheet in the collection has changed.
     */
    readonly sheetVisibleChanged = new wijmo.Event<SheetCollection, wijmo.collections.NotifyCollectionChangedEventArgs>();
    /**
     * Raises the <b>sheetVisibleChanged</b> event.
     */
    onSheetVisibleChanged(e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        this.sheetVisibleChanged.raise(this, e);
    }

    /**
     * Selects the first sheet in the {@link FlexSheet} control.
     */
    selectFirst(): boolean {
        return this._moveCurrentTo(0);
    }

    /**
     * Selects the last sheet in the owner {@link FlexSheet} control.
     */
    selectLast(): boolean {
        return this._moveCurrentTo(this.length - 1);
    }

    /**
     * Selects the previous sheet in the owner {@link FlexSheet} control.
     */
    selectPrevious(): boolean {
        return this._moveCurrentTo(this._current - 1);
    }

    /**
     * Select the next sheet in the owner {@link FlexSheet} control.
     */
    selectNext(): boolean {
        return this._moveCurrentTo(this._current + 1);
    }

    /**
     * Hides the sheet at the specified position.
     *
     * @param pos The position of the sheet to hide.
     */
    hide(pos: number): boolean {
        if (pos < 0 && pos >= this.length) {
            return false;
        }
        if (!this[pos].visible) {
            return false;
        }
        this[pos].visible = false;

        return true;
    }

    /**
     * Unhide and selects the {@link Sheet} at the specified position.
     *
     * @param pos The position of the sheet to show.
     */
    show(pos: number): boolean {
        if (pos < 0 && pos >= this.length) {
            return false;
        }
        this[pos].visible = true;
        this._moveCurrentTo(pos);
        return true;
    }

    /**
     * Clear the SheetCollection.
     */
    clear() {
        let sheet: Sheet;
        for (let i = 0; i < this.length; i++) {
            sheet = this[i];
            sheet.dispose();
            sheet = null;
        }
        super.clear();
        this._current = -1;

        this.onSheetCleared();
    }

    /**
     * Checks whether the sheet name is valid.
     *
     * @param sheet The {@link Sheet} for which the name needs to check.
     */
    isValidSheetName(sheet: T): boolean {
        var sheetIndex = this._getSheetIndexFrom(sheet.name),
            currentSheetIndex = this.indexOf(sheet);

        return (sheetIndex === -1 || sheetIndex === currentSheetIndex);
    }

    /**
     * Gets the valid name for the sheet.
     *
     * @param currentSheet The {@link Sheet} need get the valid name.
     */
    getValidSheetName(currentSheet: T): string {
        var validName = currentSheet.name,
            index = 1,
            currentSheetIndex = this.indexOf(currentSheet),
            sheetIndex: number;

        do {
            sheetIndex = this._getSheetIndexFrom(validName);
            if (sheetIndex === -1 || sheetIndex === currentSheetIndex) {
                break;
            } else {
                validName = currentSheet.name.concat((index + 1).toString());
            }
            index = index + 1;
        } while (true);

        return validName;
    }

    _setCurrentIdx(value: number) {
        this._current = value;
    }

    // Move the current index to indicated position.
    private _moveCurrentTo(pos: number): boolean {
        var searchedPos = pos,
            e: wijmo.PropertyChangedEventArgs;

        if (pos < 0 || pos >= this.length) {
            return false;
        }
        if (this._current < searchedPos || searchedPos === 0) {
            while (searchedPos < this.length && !this[searchedPos].visible) {
                searchedPos++;
            }
        } else if (this._current > searchedPos) {
            while (searchedPos >= 0 && !this[searchedPos].visible) {
                searchedPos--;
            }
        }
        if (searchedPos === this.length) {
            searchedPos = pos;
            while (searchedPos >= 0 && !this[searchedPos].visible) {
                searchedPos--;
            }
        }

        if (searchedPos < 0) {
            return false;
        }

        if (searchedPos !== this._current) {
            e = new wijmo.PropertyChangedEventArgs('sheetIndex', this._current, searchedPos);
            this._current = searchedPos;
            this.onSelectedSheetChanged(e);
        }

        return true;
    }

    // Get the index for the sheet in the SheetCollection.
    /*private*/ _getSheetIndexFrom(sheetName: string): number {
        var result = -1,
            sheet: Sheet,
            name: string;

        if (!sheetName) {
            return result;
        }

        sheetName = sheetName.toLowerCase();
        for (var i = 0; i < this.length; i++) {
            sheet = this[i];
            name = sheet.name ? sheet.name.toLowerCase() : '';
            if (name === sheetName) {
                return i;
            }
        }
        return result;
    }

    // Post process the newly added sheet.
    private _postprocessSheet(item: T) {
        item.nameChanged.removeHandler(this._shNameChanged, this);
        item.nameChanged.addHandler(this._shNameChanged, this); // Update the sheet name via the sheetNameChanged event handler.

        item.visibleChanged.removeHandler(this._shVisibleChanged, this);
        item.visibleChanged.addHandler(this._shVisibleChanged, this);
    }

    private _shNameChanged(sheet: T, e: wijmo.PropertyChangedEventArgs) {
        if (!this.isValidSheetName(sheet)) {
            sheet._setValidName(this.getValidSheetName(sheet));
        }

        let index = this._getSheetIndexFrom(sheet.name);

        let args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, sheet, wijmo.isNumber(index) ? index : this.length - 1);
        this.onSheetNameChanged(args);

    }

    private _shVisibleChanged(sheet: T, e: wijmo.EventArgs) {
        let index = this._getSheetIndexFrom(sheet.name),
            args = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, sheet, wijmo.isNumber(index) ? index : this.length - 1);
        this.onSheetVisibleChanged(args);
    }

    // Get the unique name for the sheet in the SheetCollection.
    private _getUniqueName(): string {
        var validName = 'Sheet1',
            index = 2;
        do {
            if (this._getSheetIndexFrom(validName) === -1) {
                break;
            } else {
                validName = 'Sheet' + index;
            }
            index = index + 1;
        } while (true);

        return validName;
    }
}

/*
 * Represents the control that shows tabs for switching between {@link FlexSheet} sheets.
 */
export class _SheetTabs extends wijmo.Control {
    private _sheets: SheetCollection;
    private _tabContainer: HTMLElement;
    private _sheetPage: HTMLElement;
    private _newSheet: HTMLElement;
    private _owner: FlexSheet;
    private _rtl = false;
    private _sheetTabClicked = false;
    private _editingSheetTab: HTMLLIElement;
    private _measureEle: HTMLSpanElement;
    private _contextMenuHost: HTMLElement;
    private _dragSrcIdx: number;
    _contextMenu: _SheetTabContextMenu;

    static controlTemplate =
        '<div wj-part="sheet-container" class="wj-sheet" style="height:100%;position:relative">' +
        '<div wj-part="sheet-page" class="wj-btn-group wj-sheet-page">' + // Sheets page
        '<button type="button" class="wj-btn wj-btn-default">' +
        '<span class="wj-sheet-icon wj-glyph-step-backward"></span>' +
        '</button>' +
        '<button type="button" class="wj-btn wj-btn-default">' +
        '<span class="wj-sheet-icon wj-glyph-left"></span>' +
        '</button>' +
        '<button type="button" class="wj-btn wj-btn-default">' +
        '<span class="wj-sheet-icon wj-glyph-right"></span>' +
        '</button>' +
        '<button type="button" class="wj-btn wj-btn-default">' +
        '<span class="wj-sheet-icon wj-glyph-step-forward"></span>' +
        '</button>' +
        '</div>' +
        '<div class="wj-sheet-tab" style="height:100%;overflow:hidden">' + // Sheet Tabs
        '<ul wj-part="container"></ul>' +
        '</div>' +
        '<div wj-part="new-sheet" class="wj-new-sheet">' +
        '<span class="wj-sheet-icon wj-glyph-file"></span>' +
        '</div>' +
        '<div wj-part="context-menu" style="display:none;z-index:100"></div>' +
        '</div>';

    /*
     * Initializes a new instance of the {@link _SheetTabs} class.
     *
     * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
     * @param owner The {@link FlexSheet} control what the SheetTabs control works with.
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, owner: FlexSheet, options?: any) {
        super(element, options);

        this._owner = owner;
        this._sheets = owner.sheets;
        this._rtl = getComputedStyle(owner.hostElement).direction == 'rtl';

        this._initControl();
        this.deferUpdate(() => {
            this.initialize(options);
        });
    }

    /*
     * Override to refresh the control.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    refresh(fullUpdate) {
        this._tabContainer.innerHTML = '';
        this._tabContainer.innerHTML = this._getSheetTabs();
        if (this._rtl) {
            this._adjustSheetsPosition();
        }
        this._adjustSize();
    }

    // The items source changed event handler.
    private _sourceChanged(sender: any, e: wijmo.EventArgs = wijmo.collections.NotifyCollectionChangedEventArgs.reset) {
        var eArgs: wijmo.collections.NotifyCollectionChangedEventArgs = <wijmo.collections.NotifyCollectionChangedEventArgs>e,
            index: number;

        switch (eArgs.action) {
            case wijmo.collections.NotifyCollectionChangedAction.Add:
                index = eArgs.index - 1;
                if (index < 0) {
                    index = 0;
                }
                this._tabContainer.innerHTML = '';
                this._tabContainer.innerHTML = this._getSheetTabs();
                if (this._rtl) {
                    this._adjustSheetsPosition();
                }
                this._adjustSize();
                break;
            case wijmo.collections.NotifyCollectionChangedAction.Remove:
                this._tabContainer.removeChild(this._tabContainer.children[eArgs.index]);
                this._adjustSize();
                break;
            default:
                this.invalidate();
                break;
        }
    }

    // The current changed of the item source event handler.
    private _selectedSheetChanged(sender: any, e: wijmo.PropertyChangedEventArgs) {
        this._updateTabActive(e.oldValue, false);
        this._updateTabActive(e.newValue, true);
        if (this._sheetTabClicked) {
            this._sheetTabClicked = false;
        } else {
            this._scrollToActiveSheet(e.newValue, e.oldValue);
        }
        this._adjustSize();
    }

    // Initialize the SheetTabs control.
    private _initControl() {
        var self = this,
            host = self.hostElement;
        //apply template
        self.applyTemplate('', self.getTemplate(), {
            _sheetContainer: 'sheet-container',
            _tabContainer: 'container',
            _sheetPage: 'sheet-page',
            _newSheet: 'new-sheet',
            _contextMenuHost: 'context-menu'
        });
        //init opts

        self._contextMenu = new _SheetTabContextMenu(self._contextMenuHost, self._owner);

        if (self._rtl) {
            self._sheetPage.style.right = '0px';
            self._tabContainer.parentElement.style.right = self._sheetPage.clientWidth + 'px';
            self._tabContainer.style.right = '0px';
            self._tabContainer.style.cssFloat = 'right';
            self._newSheet.style.right = (self._sheetPage.clientWidth + self._tabContainer.parentElement.clientWidth) + 'px';
        }

        self._adjustNavigationButtons(self._rtl);

        // Reset the _htDown of _MouseHandler to null when mouse down in the sheet tab to avoid trigger mouse move event handler.
        // This is for fixing TFS issue #326006.
        self.addEventListener(host, 'mousedown', () => {
            self._owner._mouseHdl._htDown = null;
        });

        self.addEventListener(host, 'dragstart', (evt: DragEvent) => {
            evt.dataTransfer.setData('text', 'foo'); // Make Firefox happy (TFS 367506)

            if (evt.target instanceof HTMLLIElement && self._owner._isDescendant(self._tabContainer, evt.target)) {
                self._dragSrcIdx = self._getItemIndex(self._tabContainer, evt.target);
            } else {
                self._dragSrcIdx = -1;
            }
        });

        self.addEventListener(host, 'dragover', (evt: DragEvent) => {
            evt.dataTransfer.dropEffect = 'move';
            evt.preventDefault();
            evt.stopPropagation();
        });

        self.addEventListener(host, 'drop', (evt: DragEvent) => {
            let targetIdx: number,
                srcSheet: Sheet,
                sheetContainerRect: ClientRect;
            if (self._dragSrcIdx > -1) {
                if (evt.target instanceof HTMLLIElement && self._owner._isDescendant(self._tabContainer, evt.target)) {
                    targetIdx = self._getItemIndex(self._tabContainer, evt.target);
                } else {
                    sheetContainerRect = self._tabContainer.getBoundingClientRect();
                    if (evt.clientX < sheetContainerRect.left) {
                        targetIdx = 0;
                    } else if (evt.clientX > sheetContainerRect.right) {
                        targetIdx = self._sheets.length - 1;
                    } else {
                        targetIdx = -1;
                    }
                }
                if (targetIdx !== self._dragSrcIdx) {
                    srcSheet = self._sheets[self._dragSrcIdx];
                    self._sheets._exchangingPosition = true;
                    self._sheets.beginUpdate();
                    self._sheets.splice(self._dragSrcIdx, 1);
                    self._sheets.splice(targetIdx, 0, srcSheet);
                    self._sheets.endUpdate();
                    self._owner.selectedSheetIndex = targetIdx;
                    self._sheets._exchangingPosition = false;
                }
            }
            self._dragSrcIdx = -1;
            evt.preventDefault();
            evt.stopPropagation();
        });

        self.addEventListener(self._newSheet, 'click', (evt: MouseEvent) => {
            var oldIndex = self._owner.selectedSheetIndex;
            self._owner.addUnboundSheet();
            self._scrollToActiveSheet(self._owner.selectedSheetIndex, oldIndex);
        });

        self._sheets.collectionChanged.addHandler(self._sourceChanged, self);
        self._sheets.selectedSheetChanged.addHandler(self._selectedSheetChanged, self);
        self._sheets.sheetNameChanged.addHandler(self._updateSheetName, self);
        self._sheets.sheetVisibleChanged.addHandler(self._updateTabShown, self);

        self._initSheetPage();
        self._initSheetTab();
    }

    // Initialize the sheet tab part.
    private _initSheetTab() {
        let self = this;

        self.addEventListener(self._tabContainer, 'mousedown', (evt: MouseEvent) => {
            let li = <HTMLElement>evt.target,
                idx: number;

            if (li instanceof HTMLLIElement) {
                self._sheetTabClicked = true;
                idx = self._getItemIndex(self._tabContainer, li);
                self._scrollSheetTabContainer(li);
                if (idx > -1) {
                    self._sheets.selectedIndex = idx;
                }
            }
        });

        self.addEventListener(self._tabContainer, 'dblclick', (evt: MouseEvent) => {
            let li = <HTMLElement>evt.target,
                idx: number;

            if (li instanceof HTMLLIElement) {
                idx = self._getItemIndex(self._tabContainer, li);
                self._scrollSheetTabContainer(li);
                if (idx > -1) {
                    self._startEditingSheetName(idx);
                }
            }
        });

        self.addEventListener(self._tabContainer, 'contextmenu', (evt: MouseEvent) => {
            evt.preventDefault();
            self._contextMenu.show(evt);
        });
    }

    // Initialize the sheet pager part.
    private _initSheetPage() {
        var self = this;

        self.hostElement.querySelector('div.wj-sheet-page').addEventListener('click', (e: MouseEvent) => {
            var btn = (<HTMLElement>e.target).toString() === '[object HTMLButtonElement]' ? <HTMLElement>e.target : (<HTMLElement>e.target).parentElement,
                index = self._getItemIndex(self._sheetPage, btn),
                currentSheetTab: HTMLElement;

            if (self._sheets.length === 0) {
                return;
            }

            switch (index) {
                case 0:
                    self._sheets.selectFirst();
                    break;
                case 1:
                    self._sheets.selectPrevious();
                    break;
                case 2:
                    self._sheets.selectNext();
                    break;
                case 3:
                    self._sheets.selectLast();
                    break;
            }
        });
    }

    // Get markup for the sheet tabs
    private _getSheetTabs(): string {
        var html = '',
            i: number;

        for (i = 0; i < this._sheets.length; i++) {
            html += this._getSheetElement(this._sheets[i], this._sheets.selectedIndex === i);
        }
        return html;
    }

    // Get the markup for a sheet tab.
    private _getSheetElement(sheetItem: Sheet, isActive = false): string {
        var result = '<li';
        if (!sheetItem.visible) {
            result += ' class="hidden"';
        } else if (isActive) {
            result += ' class="active"';
        }
        result += ' draggable="true">' + sheetItem.name + '</li>';
        return result;
    }

    // Update the active state for the sheet tabs.
    private _updateTabActive(pos: number, active: boolean) {
        if (pos >= 0 && pos < this._tabContainer.children.length) {
            wijmo.toggleClass(this._tabContainer.children[pos], 'active', active);
        }
    }

    // Update the show or hide state for the sheet tabs
    private _updateTabShown(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (e.index < 0 || e.index >= this._tabContainer.children.length) {
            return;
        }
        if (!e.item.visible) {
            wijmo.addClass(<HTMLElement>this._tabContainer.children[e.index], 'hidden');
        } else {
            wijmo.removeClass(<HTMLElement>this._tabContainer.children[e.index], 'hidden');
        }
        this._adjustSize();
    }

    // Adjust the size of the SheetTabs control.
    _adjustSize() {
        //adjust the size
        var sheetCount = this._tabContainer.childElementCount,
            index: number,
            containerMaxWidth: number,
            width: number = 0,
            scrollLeft = 0;

        if (this.hostElement.style.display === 'none') {
            return;
        }

        // Get the scroll left of the tab container, before setting the size of the size of the tab container. (TFS 142788)
        scrollLeft = this._tabContainer.parentElement.scrollLeft;

        // Before adjusting the size of the sheet tab, we should reset the size to ''. (TFS #139846)
        this._tabContainer.parentElement.style.width = '';
        this._tabContainer.style.width = '';
        this._sheetPage.parentElement.style.width = '';

        for (index = 0; index < sheetCount; index++) {
            width += (<HTMLElement>this._tabContainer.children[index]).offsetWidth + 1;
        }
        containerMaxWidth = this.hostElement.offsetWidth - this._sheetPage.offsetWidth - this._newSheet.offsetWidth - 2;
        this._tabContainer.parentElement.style.width = (width > containerMaxWidth ? containerMaxWidth : width) + 'px';
        this._tabContainer.style.width = width + 'px';
        this._sheetPage.parentElement.style.width = this._sheetPage.offsetWidth + this._newSheet.offsetWidth + this._tabContainer.parentElement.offsetWidth + 3 + 'px';

        // Reset the scroll left for the tab container. (TFS 142788)
        this._tabContainer.parentElement.scrollLeft = scrollLeft;
    }

    // Get the index of the element in its parent container.
    private _getItemIndex(container: HTMLElement, item: HTMLElement): number {
        var idx = 0;
        for (; idx < container.children.length; idx++) {
            if (container.children[idx] === item) {
                return idx;
            }
        }
        return -1;
    }

    // Update the sheet tab name.
    private _updateSheetName(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        (<HTMLElement>this._tabContainer.querySelectorAll('li')[e.index]).textContent = e.item.name;
        this._adjustSize();
    }

    // Scroll the sheet tab container to display the invisible or partial visible sheet tab.
    private _scrollSheetTabContainer(currentSheetTab: HTMLElement) {
        var scrollLeft = this._tabContainer.parentElement.scrollLeft,
            sheetPageSize = this._sheetPage.offsetWidth,
            newSheetSize = this._newSheet.offsetWidth,
            containerSize = this._tabContainer.parentElement.offsetWidth,
            containerOffset: number;

        if (this._rtl) {
            switch (wijmo.grid.FlexGrid['_getRtlMode']()) {
                case 'rev':
                    containerOffset = -this._tabContainer.offsetLeft;
                    if (containerOffset + currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                        this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                    } else if (containerOffset + currentSheetTab.offsetLeft < scrollLeft) {
                        this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                    }
                    break;
                case 'neg':
                    if (currentSheetTab.offsetLeft < scrollLeft) {
                        this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                    } else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                        this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                    }
                    break;
                default:
                    if (currentSheetTab.offsetLeft - newSheetSize + scrollLeft < 0) {
                        this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                    } else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - newSheetSize + scrollLeft > containerSize) {
                        this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                    }
                    break;
            }
        } else {
            if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - sheetPageSize > containerSize + scrollLeft) {
                this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
            } else if (currentSheetTab.offsetLeft - sheetPageSize < scrollLeft) {
                this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
            }
        }
    }

    // Adjust the position of each sheet tab for 'rtl' direction.
    private _adjustSheetsPosition() {
        var sheets = this._tabContainer.querySelectorAll('li'),
            position = 0,
            sheet: HTMLElement,
            index: number;

        for (index = 0; index < sheets.length; index++) {
            sheet = <HTMLElement>sheets[index];
            sheet.style.cssFloat = 'right';
            sheet.style.right = position + 'px';
            position += (<HTMLElement>sheets[index]).clientWidth;
        }
    }

    // Scroll to the active sheet tab.
    private _scrollToActiveSheet(newIndex: number, oldIndex: number) {
        var sheets = this._tabContainer.querySelectorAll('li'),
            activeSheet: HTMLElement,
            scrollLeft: number,
            i: number;

        if (this._tabContainer.clientWidth > this._tabContainer.parentElement.clientWidth) {
            scrollLeft = this._tabContainer.clientWidth - this._tabContainer.parentElement.clientWidth;
        } else {
            scrollLeft = 0;
        }

        if (sheets.length > 0 && newIndex < sheets.length && oldIndex < sheets.length) {
            if ((newIndex === 0 && !this._rtl) || (newIndex === sheets.length - 1 && this._rtl)) {

                if (this._rtl) {
                    switch (wijmo.grid.FlexGrid['_getRtlMode']()) {
                        case 'rev':
                            this._tabContainer.parentElement.scrollLeft = 0;
                            break;
                        case 'neg':
                            this._tabContainer.parentElement.scrollLeft = -scrollLeft;
                            break;
                        default:
                            this._tabContainer.parentElement.scrollLeft = scrollLeft;
                            break;
                    }
                } else {
                    this._tabContainer.parentElement.scrollLeft = 0;
                }
                return;
            }

            if ((newIndex === 0 && this._rtl) || (newIndex === sheets.length - 1 && !this._rtl)) {
                if (this._rtl) {
                    switch (wijmo.grid.FlexGrid['_getRtlMode']()) {
                        case 'rev':
                            this._tabContainer.parentElement.scrollLeft = scrollLeft;
                            break;
                        case 'neg':
                            this._tabContainer.parentElement.scrollLeft = 0;
                            break;
                        default:
                            this._tabContainer.parentElement.scrollLeft = 0;
                            break;
                    }
                } else {
                    this._tabContainer.parentElement.scrollLeft = scrollLeft;
                }
                return;
            }

            if (newIndex >= oldIndex) {
                for (i = oldIndex + 1; i <= newIndex; i++) {
                    activeSheet = <HTMLElement>sheets[i];
                    this._scrollSheetTabContainer(activeSheet);
                }
            } else {
                for (i = oldIndex - 1; i >= newIndex; i--) {
                    activeSheet = <HTMLElement>sheets[i];
                    this._scrollSheetTabContainer(activeSheet);
                }
            }
        }
    }

    // Adjust the direction for sheet navigation buttons' glyph.
    private _adjustNavigationButtons(rtl: boolean) {
        var navBtns = this.hostElement.querySelectorAll('.wj-sheet-page button'),
            btnGlyph: HTMLSpanElement;

        if (navBtns && navBtns.length === 4) {
            if (rtl) {
                btnGlyph = <HTMLSpanElement>navBtns[0].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-step-backward');
                wijmo.addClass(btnGlyph, 'wj-glyph-step-forward');

                btnGlyph = <HTMLSpanElement>navBtns[1].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-left');
                wijmo.addClass(btnGlyph, 'wj-glyph-right');

                btnGlyph = <HTMLSpanElement>navBtns[2].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-right');
                wijmo.addClass(btnGlyph, 'wj-glyph-left');

                btnGlyph = <HTMLSpanElement>navBtns[3].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-step-forward');
                wijmo.addClass(btnGlyph, 'wj-glyph-step-backward');
            } else {
                btnGlyph = <HTMLSpanElement>navBtns[0].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-step-forward');
                wijmo.addClass(btnGlyph, 'wj-glyph-step-backward');

                btnGlyph = <HTMLSpanElement>navBtns[1].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-right');
                wijmo.addClass(btnGlyph, 'wj-glyph-left');

                btnGlyph = <HTMLSpanElement>navBtns[2].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-left');
                wijmo.addClass(btnGlyph, 'wj-glyph-right');

                btnGlyph = <HTMLSpanElement>navBtns[3].querySelector('span');
                wijmo.removeClass(btnGlyph, 'wj-glyph-step-backward');
                wijmo.addClass(btnGlyph, 'wj-glyph-step-forward');
            }
        }
    }

    // Start to edit the sheet name.
    _startEditingSheetName(index: number) {
        let self = this,
            li = self._tabContainer.children[index] as HTMLLIElement,
            sheetName = li.textContent,
            nameEdt: HTMLInputElement;

        self._editingSheetTab = li;
        // create element to measure content
        self._measureEle = document.createElement('span');
        self._measureEle.setAttribute(wijmo.grid.FlexGrid._WJS_MEASURE, 'true');
        self._measureEle.style.visibility = 'hidden';
        self.hostElement.appendChild(self._measureEle);

        li.innerHTML = '<input type="text" style="width: ' + (li.offsetWidth - 40) + 'px;"/>';
        nameEdt = li.children[0] as HTMLInputElement;
        wijmo.addClass(nameEdt, 'wj-sheet-name-editor wj-form-control');
        nameEdt.value = sheetName;
        wijmo.setSelectionRange(nameEdt, 0, sheetName.length);

        self.addEventListener(nameEdt, 'keydown', (evt: KeyboardEvent) => {
            if (evt.keyCode === wijmo.Key.Enter) {
                self._commitSheetName();
            } else {
                self._measureInputWidth(evt.key);
            }
        });

        self.addEventListener(nameEdt, 'blur', self._commitSheetName.bind(self));
    }

    // Commit the sheet name.
    private _commitSheetName() {
        let newSheetName: string,
            sheetIndex: number,
            nameEdt: HTMLInputElement;

        if (!this._editingSheetTab) {
            return;
        }

        nameEdt = this._editingSheetTab.children[0] as HTMLInputElement;
        this.removeEventListener(nameEdt);
        newSheetName = nameEdt.value;
        sheetIndex = this._getItemIndex(this._tabContainer, this._editingSheetTab);
        if (newSheetName != null && newSheetName !== '' && this._sheets._getSheetIndexFrom(newSheetName) === -1) {
            this._sheets[sheetIndex].name = newSheetName;
            this._editingSheetTab.textContent = newSheetName;
        } else {
            this._editingSheetTab.textContent = this._sheets[sheetIndex].name;
        }
        this._editingSheetTab = null;
        wijmo.removeChild(this._measureEle);
        this._measureEle = null;
        this._adjustSize();
    }

    // Measure the width of the sheet name input.
    private _measureInputWidth(key: string) {
        let nameEdt: HTMLInputElement,
            selectionStart: number,
            selectionEnd: number,
            content: string;

        if (!this._editingSheetTab || key.length > 1) {
            return;
        }
        nameEdt = this._editingSheetTab.children[0] as HTMLInputElement;
        selectionStart = nameEdt.selectionStart;
        selectionEnd = nameEdt.selectionEnd;
        content = nameEdt.value;
        content = content.substring(0, selectionStart) + key + content.substring(selectionEnd);
        if (content == null || content === '') {
            return;
        }
        this._measureEle.textContent = content;
        nameEdt.style.width = this._measureEle.offsetWidth + 'px';
        this._adjustSize();
    }
}

/*
 * Defines the class defining {@link FlexSheet} column sorting criterion.
 */
export class _UnboundSortDescription {
    private _column: wijmo.grid.Column;
    private _ascending: boolean;

    /*
     * Initializes a new instance of the {@link UnboundSortDescription} class.
     *
     * @param column The column to sort the rows by.
     * @param ascending The sort order.
     */
    constructor(column: wijmo.grid.Column, ascending: boolean) {
        this._column = column;
        this._ascending = ascending;
    }

    /*
     * Gets the column to sort the rows by.
     */
    get column(): wijmo.grid.Column {
        return this._column;
    }

    /*
     * Gets the sort order.
     */
    get ascending(): boolean {
        return this._ascending;
    }
}

/**
 * Defines the filter setting of sheet.
 */
export interface IFilterSetting {
    /**
     * An array containing the names or bindings of the columns that have filters.
     */
    filterColumns?: string[];
    /**
     * The filter setting for the columns of the sheet.
     */
    columnFilterSettings?: IColumnFilterSetting[];
}

/**
 * The setting for column filter.
 */
export interface IColumnFilterSetting {
    /**
     * Column being filtered.  It could be the {@link Column} instance, name of the {@link Column} or index in the column collection.
     */
    column: any;
    /**
     * The types of filtering provided by this filter.
     */
    filterType?: wijmo.grid.filter.FilterType;
    /**
     * The {@link DataMap} used to convert raw values into display values shown when editing this filter.
     */
    dataMap?: wijmo.grid.DataMap;
    /**
     * The value filter setting in this column filter setting.
     */
    valueFilterSetting?: IValueFiterSetting;
    /**
     * The condition filter setting in this column filter setting.
     */
    conditionFilterSetting?: IConditionFilterSetting;
}

/**
 * The value filter setting.
 */
export interface IValueFiterSetting {
    /**
     * The maximum number of elements on the list of display values.
     */
    maxValues?: number;
    /**
     * An array containing the unique values to be displayed on the list.
     */
    uniqueValues?: any[];
    /**
     * A value that determines whether the values should be sorted
     */
    sortValues?: boolean;
    /**
     * The {@link DataMap} used to convert raw values into display values shown when editing this filter.
     */
    dataMap: wijmo.grid.DataMap;
    /**
     * Gets or sets a value that determines whether the filter should
     * include only values selected by the {@link filterText} property.
     *
     * This property is set to true by default, which matches Excel's
     * behavior.
     *
     * Set it to false to disable this behavior, so searching only affects
     * which items are displayed on the list and not which items are
     * included in the filter.
     */
    exclusiveValueSearch: boolean;
}

/**
 * The condition filter setting.
 */
export interface IConditionFilterSetting {
    /**
     * The {@link DataMap} used to convert raw values into display values shown when editing this filter.
     */
    dataMap?: wijmo.grid.DataMap;
}

export type _StyledCellsDict = {
    [index: number]: ICellStyle;
    rowCount?: number;
    columnCount?: number;
};

    }
    


    module wijmo.grid.sheet {
    



'use strict';

/*
 * Defines the _TabHolder control.
 */
export class _TabHolder extends wijmo.Control {
    private _owner: FlexSheet;

    // child controls
    private _sheetControl: _SheetTabs;

    // child elements
    private _divSheet: HTMLElement;
    private _divSplitter: HTMLElement;
    private _divRight: HTMLElement;

    // event handler
    private _funSplitterMousedown: (ev: MouseEvent) => any;
    private _splitterMousedownHdl = this._splitterMousedownHandler.bind(this);

    private _startPos: number;

    static controlTemplate =
        '<div>' +
            '<div wj-part="left" style="float:left;height:100%;overflow:hidden"></div>' +  // left sheet
            '<div wj-part="splitter" style="float:left;height:100%;width:6px;background-color:#e9eaee;padding:2px;cursor:e-resize">' +
                '<div style="background-color:#8a9eb2;height:100%"></div>' +
            '</div>' + // splitter
            '<div wj-part="right" style="float:left;height:100%;background-color:#e9eaee"></div>' +
        '</div>';

    /*
     * Initializes a new instance of the _TabHolder class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param owner The {@link FlexSheet} control that the _TabHolder control is associated to.
     */
    constructor(element: any, owner: FlexSheet) {
        super(element);
        this._owner = owner;

        // instantiate and apply template
        this.applyTemplate('', this.getTemplate(), {
            _divSheet: 'left',
            _divSplitter: 'splitter',
            _divRight: 'right'
        });

        this._init();
    }

    /*
     * Gets the SheetTabs control
     */
    get sheetControl(): _SheetTabs {
        return this._sheetControl;
    }

    /*
     * Gets or sets the visibility of the TabHolder control
     */
    get visible(): boolean {
        return this.hostElement.style.display !== 'none';
    }
    set visible(value: boolean) {
        this.hostElement.style.display = value ? 'block' : 'none'; 
        this._divSheet.style.display = value ? 'block' : 'none'; 
    }

    /*
     * Gets the Blanket size for the TabHolder control.
     */
    public getSheetBlanketSize(): number {
        return 20;
    }

    /*
     * Adjust the size of the TabHolder control 
     */
    public adjustSize() {
        var hScrollDis = this._owner.scrollSize.width - this._owner.clientSize.width,
            vScrollDis = this._owner.scrollSize.height - this._owner.clientSize.height,
            eParent = this._divSplitter.parentElement,
            leftWidth: number;

        if (hScrollDis <= 0) {
            eParent.style.minWidth = '100px';
            this._divSplitter.style.display = 'none';
            this._divRight.style.display = 'none';
            this._divSheet.style.width = '100%';
            this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
        } else {
            eParent.style.minWidth = '300px';
            this._divSplitter.style.display = 'none';
            this._divRight.style.display = 'none';
            this._divSheet.style.width = '100%';
            this._divSplitter.removeEventListener('mousedown', this._splitterMousedownHdl, true);
            this._divSplitter.addEventListener('mousedown', this._splitterMousedownHdl, true);
        }

        this._sheetControl._adjustSize();
    }

    // Init the size of the splitter.
    // And init the ScrollBar, SheetTabs control 
    private _init() {
        var self = this;
        self._funSplitterMousedown = function (e: MouseEvent) {
            self._splitterMouseupHandler(e);
        };
        self._divSplitter.parentElement.style.height = self.getSheetBlanketSize() + 'px';
        //init sheet
        self._sheetControl = new _SheetTabs(self._divSheet, this._owner);
    }

    // Mousedown event handler for the splitter
    private _splitterMousedownHandler(e: MouseEvent) {
        this._startPos = e.pageX;
        document.addEventListener('mousemove', this._splitterMousemoveHandler.bind(this), true);
        document.addEventListener('mouseup', this._funSplitterMousedown, true);
        e.preventDefault();
    }

    // Mousemove event handler for the splitter
    private _splitterMousemoveHandler(e: MouseEvent) {
        if (this._startPos === null || typeof (this._startPos) === 'undefined') {
            return;
        }
        this._adjustDis(e.pageX - this._startPos);
    }

    // Mouseup event handler for the splitter
    private _splitterMouseupHandler(e: MouseEvent) {
        document.removeEventListener('mousemove', this._splitterMousemoveHandler, true);
        document.removeEventListener('mouseup', this._funSplitterMousedown, true);
        this._adjustDis(e.pageX - this._startPos);
        this._startPos = null;
    }

    // Adjust the distance for the splitter
    private _adjustDis(dis: number) {
        var rightWidth = this._divRight.offsetWidth - dis,
            leftWidth = this._divSheet.offsetWidth + dis;

        if (rightWidth <= 100) {
            rightWidth = 100;
            dis = this._divRight.offsetWidth - rightWidth;
            leftWidth = this._divSheet.offsetWidth + dis;
        } else if (leftWidth <= 100) {
            leftWidth = 100;
            dis = leftWidth - this._divSheet.offsetWidth;
            rightWidth = this._divRight.offsetWidth - dis;
        }
        if (dis == 0) {
            return;
        }
        this._divRight.style.width = rightWidth + 'px';
        this._divSheet.style.width = leftWidth + 'px';
        this._startPos = this._startPos + dis;
    }
}
    }
    


    module wijmo.grid.sheet {
    







'use strict';

/*
 * Defines the base class that represents parsed expressions.
 */
export class _Expression {
    private _token: _Token;
    _evaluatedValue: any;
    _inGroup: boolean;

    /*
     * Initializes a new instance of the {@link Expression} class.
     *
     * @param arg This parameter is used to build the token for the expression.
     */
    constructor(arg?: any) {
        if (arg) {
            if (arg instanceof _Token) {
                this._token = arg;
            } else {
                this._token = new _Token(arg, _TokenID.ATOM, _TokenType.LITERAL);
            }
        } else {
            this._token = new _Token(null, _TokenID.ATOM, _TokenType.IDENTIFIER);
        }
    }

    /*
     * Gets the token of the expression.
     */
    get token(): _Token {
        return this._token;
    }

    /*
     * Evaluates the expression.
     *
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     * @param strictStringCmp Indicates whether to use strict comparison if one of the operands is a string.
     * @param throwOnError Indicates whether an FormulaError should be returned or thrown if it occurred. The default value is true.
     */
    evaluate(rowIndex: number, columnIndex: number, sheet?: Sheet, strictStringCmp = true, throwOnError = true): any {
        if (this._token.tokenType === _TokenType.ERROR) {
            if (throwOnError) {
                throw this._token.value;
            }
            return this._token.value;
        }

        if (this._token.tokenType !== _TokenType.LITERAL) {
            throw new SyntaxError(_ErrorMessages.BadExpression);
        }
        return this._token.value;
    }

    /*
     * Parse the expression to a string value.
     *
     * @param x The {@link Expression} need be parsed to string value.
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     */
    static toString(x: _Expression, rowIndex: number, columnIndex: number, sheet?: Sheet): string {
        var v = x.evaluate(rowIndex, columnIndex, sheet);

        if (v instanceof FormulaError) {
            throw v;
        }

        if (!wijmo.isPrimitive(v)) {
            v = v.value;
        }

        if (wijmo.isString(v) && v[0] === '\'') {
            v = v.substr(1);
        }

        if (wijmo.isDate(v)) {
            v = v.valueOf();
        }

        return v != null ? v.toString() : '';
    }

    /*
     * Parse the expression to a number value.
     *
     * @param x The {@link Expression} need be parsed to number value.
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     */
    static toNumber(x: _Expression, rowIndex: number, columnIndex: number, sheet?: Sheet): number {
        // evaluate
        var v = x.evaluate(rowIndex, columnIndex, sheet);

        if (v instanceof FormulaError) {
            throw v;
        }

        if (!wijmo.isPrimitive(v)) {
            v = v.value;
        }

        // handle numbers
        if (wijmo.isNumber(v)) {
            return v;
        }

        // handle booleans
        if (wijmo.isBoolean(v)) {
            return v ? 1 : 0;
        }

        // handle dates
        if (wijmo.isDate(v)) {
            return FlexSheet._toOADate(v);
        }

        // handle strings
        if (wijmo.isString(v)) {
            if (v[0] === '\'') {
                v = v.substr(1);
            }

            if (v) {
                if (!isNaN(+v)) {
                    return +v;
                } else if (this.isDateValue(v)) {
                    return FlexSheet._toOADate(new Date(v));
                }
                return wijmo.changeType(v, wijmo.DataType.Number, '');
            } else {
                return 0;
            }
        }

        // handle everything else
        return wijmo.changeType(v, wijmo.DataType.Number, '');
    }

    /*
     * Parse the expression to a boolean value.
     *
     * @param x The {@link Expression} need be parsed to boolean value.
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     */
    static toBoolean(x: _Expression, rowIndex: number, columnIndex: number, sheet?: Sheet) {
        // evaluate
        var v = x.evaluate(rowIndex, columnIndex, sheet);

        if (v instanceof FormulaError) {
            throw v;
        }

        if (!wijmo.isPrimitive(v)) {
            v = v.value;
        }

        // handle booleans
        if (wijmo.isBoolean(v)) {
            return v;
        }

        // handle numbers
        if (wijmo.isNumber(v)) {
            return v === 0 ? false : true;
        }

        if (wijmo.isString(v) && v[0] === '\'') {
            v = v.substr(1);
        }

        // handle everything else
        return wijmo.changeType(v, wijmo.DataType.Boolean, '');
    }

    /*
     * Parse the expression to a date value.
     *
     * @param x The {@link Expression} need be parsed to date value.
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     */
    static toDate(x: _Expression, rowIndex: number, columnIndex: number, sheet?: Sheet) {
        // evaluate
        var v = x.evaluate(rowIndex, columnIndex, sheet);

        if (v instanceof FormulaError) {
            throw v;
        }

        if (!wijmo.isPrimitive(v)) {
            v = v.value;
        }

        // handle dates
        if (wijmo.isDate(v)) {
            return v;
        }

        // handle numbers
        if (wijmo.isNumber(v)) {
            return FlexSheet._fromOADate(v);
        }

        if (wijmo.isString(v) && v[0] === '\'') {
            v = v.substr(1);
        }

        // handle everything else
        return wijmo.changeType(v, wijmo.DataType.Date, '');
    }

    // Check whether the value is date.
    // Must be improved (honor format and culture settings).
    static isDateValue(val: any): boolean {
        let ret: boolean,
            monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (!(val instanceof FormulaError) && !wijmo.isPrimitive(val)) {
            val = val.value;
        }

        ret = wijmo.isDate(val);
        if (!ret && wijmo.isString(val)) {
            if (val[0] === '\'') {
                val = val.substr(1);
            }

            if (!wijmo.isNullOrWhiteSpace(val) && isNaN(<any>val) && (val.indexOf('/') > 0 || val.indexOf('-') > 0)) { // Skip a number-like strings because Date.parse() has a very loose validation in Chromium (TFS 457808, WJM-17491)
                ret = !isNaN(Date.parse(val));

                if (!ret) {
                    for (let item in monthArray) {
                        if ((<string>val).indexOf(monthArray[item]) > -1) {
                            ret = true;
                            break;
                        }
                    }
                }
            }
        }
        return ret;
    }

    // Indicates whether expression refers to a cell from a specified range.
    _refersTo(rng: wijmo.grid.CellRange): boolean {
        return false;
    }

    // Update the cell range in the expression with insert\remove rows\columns.
    _updateCellRangeExp(sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): boolean {
        return false;
    }

    // Moves the cell range in the expression with moving rows\columns. 
    _moveCellRangeExp(sheetIndex: number, srcRange: wijmo.grid.CellRange, dstRange: wijmo.grid.CellRange, isChangePos: boolean = false, isCopying: boolean = false): boolean {
        return false;
    }

    // Update the cell range in the expression with reordering rows.
    _updateCellRangeExpForReorderingRows(rowDiff: number) {
        return false;
    }

    // Update the cell boundary
    _updateCellBoundary(row: number, col: number) {
        return false;
    }

    // Gets the string represents this expression.
    _getStringExpression(): string {
        return this._token.value == null ? '' : (wijmo.isString(this._token.value) ? '"' + this._token.value + '"' : this._token.value.toString());
    }
}

/*
 * Defines the unary expression class.
 * For e.g. -1.23.
 */
export class _UnaryExpression extends _Expression {
    private _expr: _Expression;

    /*
     * Initializes a new instance of the {@link UnaryExpression} class.
     *
     * @param arg This parameter is used to build the token for the expression.
     * @param expr The {@link Expression} instance for evaluating the UnaryExpression.
     */
    constructor(arg: any, expr: _Expression) {
        super(arg);

        this._expr = expr;
    }

    /*
     * Overrides the evaluate function of base class.
     *
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     * @param strictStringCmp Indicates whether to use strict comparison if one of the operands is a string.
     * @param throwOnError Indicates whether an FormulaError should be returned or thrown if it occurred. The default value is true.
     */
    evaluate(rowIndex: number, columnIndex: number, sheet?: Sheet, strictStringCmp = true, throwOnError = true): any {
        if (this._expr.token.tokenType === _TokenType.ERROR) {
            if (throwOnError) {
                throw this._expr.token.value;
            }
            return this._expr.token.value;
        }

        if (this.token.tokenID === _TokenID.SUB) {
            if (this._evaluatedValue == null) {
                let val = _Expression.toNumber(this._expr, rowIndex, columnIndex, sheet);
                this._evaluatedValue = wijmo.isString(val) ? NaN : -val;
            }
            return this._evaluatedValue;
        }

        if (this.token.tokenID === _TokenID.ADD) {
            if (this._evaluatedValue == null) {
                let val = _Expression.toNumber(this._expr, rowIndex, columnIndex, sheet);
                this._evaluatedValue = wijmo.isString(val) ? NaN : +val;
            }
            return this._evaluatedValue;
        }

        throw new SyntaxError(_ErrorMessages.BadExpression);
    }

    _refersTo(rng: wijmo.grid.CellRange) {
        return this._expr._refersTo(rng);
    }

    // Update the cell range in the expression with insert\remove rows\columns.
    _updateCellRangeExp(sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): boolean {
        return this._expr._updateCellRangeExp(sheetIndex, index, count, isAdding, isRow, affectRange);
    }

    // Moves the cell range in the expression with moving rows\columns. 
    _moveCellRangeExp(sheetIndex: number, srcRange: wijmo.grid.CellRange, dstRange: wijmo.grid.CellRange, isChangePos: boolean = false, isCopying: boolean = false): boolean {
        return this._expr._moveCellRangeExp(sheetIndex, srcRange, dstRange, isChangePos, isCopying);
    }

    // Update the cell range in the expression with reordering rows.
    _updateCellRangeExpForReorderingRows(rowDiff: number) {
        return this._expr._updateCellRangeExpForReorderingRows(rowDiff);
    }

    // Gets the string represents this expression.
    _getStringExpression(): string {
        if (this.token.tokenID === _TokenID.SUB) {
            return (this._inGroup ? '(' : '') + '-' + this._expr._getStringExpression() + (this._inGroup ? ')' : '');
        }

        if (this.token.tokenID === _TokenID.ADD) {
            return (this._inGroup ? '(' : '') + '+' + this._expr._getStringExpression() + (this._inGroup ? ')' : '');
        }

        return '';
    }
}

/*
 * Defines the binary expression class.
 * For e.g. 1 + 1.
 */
export class _BinaryExpression extends _Expression {
    private _leftExpr: _Expression;
    private _rightExpr: _Expression;

    /*
     * Initializes a new instance of the {@link BinaryExpression} class.
     *
     * @param arg This parameter is used to build the token for the expression.
     * @param leftExpr The {@link Expression} instance for evaluating the BinaryExpression.
     * @param rightExpr The {@link Expression} instance for evaluating the BinaryExpression.
     */
    constructor(arg: any, leftExpr: _Expression, rightExpr: _Expression) {
        super(arg);

        this._leftExpr = leftExpr;
        this._rightExpr = rightExpr;
    }

    /*
     * Overrides the evaluate function of base class.
     *
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     * @param strictStringCmp Indicates whether to use strict comparison if one of the operands is a string.
     * @param throwOnError Indicates whether an FormulaError should be returned or thrown if it occurred. The default value is true.
     */
    evaluate(rowIndex: number, columnIndex: number, sheet?: Sheet, strictStringCmp = true, throwOnError = true): any {
        var strLeftVal: string,
            strRightVal: string,
            orgLeftVal: any,
            orgRightVal: any,
            leftFormat: string,
            rightFormat: string,
            leftValue: number,
            rightValue: number,
            isDateVal = false;

        if (this._evaluatedValue != null) {
            return this._evaluatedValue;
        }

        if (this._leftExpr.token.tokenType === _TokenType.ERROR) {
            if (throwOnError) {
                throw this._leftExpr.token.value;
            }
            return this._leftExpr.token.value;
        }

        if (this._rightExpr.token.tokenType === _TokenType.ERROR) {
            if (throwOnError) {
                throw this._rightExpr.token.value;
            }
            return this._rightExpr.token.value;
        }

        strLeftVal = _Expression.toString(this._leftExpr, rowIndex, columnIndex, sheet);
        strRightVal = _Expression.toString(this._rightExpr, rowIndex, columnIndex, sheet);
        if (this.token.tokenType === _TokenType.CONCAT) {
            this._evaluatedValue = strLeftVal + strRightVal;
            return this._evaluatedValue;
        }

        orgLeftVal = this._leftExpr.evaluate(rowIndex, columnIndex, sheet);
        if (!wijmo.isPrimitive(orgLeftVal)) {
            leftFormat = orgLeftVal.format;
            orgLeftVal = orgLeftVal.value;
        }
        orgRightVal = this._rightExpr.evaluate(rowIndex, columnIndex, sheet);
        if (!wijmo.isPrimitive(orgRightVal)) {
            rightFormat = orgRightVal.format;
            orgRightVal = orgRightVal.value;
        }

        isDateVal = _Expression.isDateValue(orgLeftVal) || _Expression.isDateValue(orgRightVal);
        if (isDateVal) {
            leftValue = wijmo.isDate(orgLeftVal) ? FlexSheet._toOADate(orgLeftVal) : (wijmo.isNumber(orgLeftVal) ? orgLeftVal : FlexSheet._toOADate(new Date(orgLeftVal)));
            rightValue = wijmo.isDate(orgRightVal) ? FlexSheet._toOADate(orgRightVal) : (wijmo.isNumber(orgRightVal) ? orgRightVal : FlexSheet._toOADate(new Date(orgRightVal)));
        } else {
            leftValue = _Expression.toNumber(this._leftExpr, rowIndex, columnIndex, sheet);
            rightValue = _Expression.toNumber(this._rightExpr, rowIndex, columnIndex, sheet);
        }

        // handle comparisons
        if (this.token.tokenType === _TokenType.COMPARE) {
            let compareVal: number; // -1: l < r, 0: l == r, 1: l > r

            if ((this._leftExpr instanceof _CellRangeExpression) && (<_CellRangeExpression>this._leftExpr)._isEmpty) {
                orgLeftVal = null;
            }

            if ((this._rightExpr instanceof _CellRangeExpression) && (<_CellRangeExpression>this._rightExpr)._isEmpty) {
                orgRightVal = null;
            }

            let leftIsEmpty = orgLeftVal == null,
                rightIsEmpty = orgRightVal == null;

            if (leftIsEmpty !== rightIsEmpty) { // one and only one of the values is empty.
                compareVal = leftIsEmpty ? -1 : 1; // the non-empty value is greater than the empty value.
            } else {
                let leftIsBool = wijmo.isBoolean(orgLeftVal),
                    rightIsBool = wijmo.isBoolean(orgRightVal);

                if (leftIsBool !== rightIsBool) {
                    compareVal = leftIsBool ? 1 : -1; // Boolean value is greater then a non-boolean value.
                } else {
                    let leftIsStr = wijmo.isString(orgLeftVal),
                        rightIsStr = wijmo.isString(orgRightVal);

                    if (strictStringCmp && (leftIsStr !== rightIsStr)) {
                        compareVal = leftIsStr ? 1 : - 1; // String value is greater than a non-string value.
                    } else {
                        if ((orgLeftVal !== 0 && wijmo.isNullOrWhiteSpace(orgLeftVal)) || (orgRightVal !== 0 && wijmo.isNullOrWhiteSpace(orgRightVal))) {
                            // One of the values is empty or whitespace string.
                            // Avoid comparison using an implicit JS type conversion ((""=0) == true)
                            compareVal = orgLeftVal === orgRightVal ? 0 : (orgLeftVal < orgRightVal ? -1 : 1)
                        } else {
                            compareVal = leftValue - rightValue;
                        }
                    }
                }
            }

            switch (this.token.tokenID) {
                case _TokenID.GT: return compareVal > 0;
                case _TokenID.LT: return compareVal < 0;
                case _TokenID.GE: return compareVal >= 0;
                case _TokenID.LE: return compareVal <= 0;
                case _TokenID.EQ:
                    if (isNaN(compareVal)) {
                        this._evaluatedValue = strLeftVal.toLowerCase() === strRightVal.toLowerCase();
                        return this._evaluatedValue;
                    } else {
                        this._evaluatedValue = compareVal === 0;
                        return this._evaluatedValue;
                    }
                case _TokenID.NE:
                    if (isNaN(compareVal)) {
                        this._evaluatedValue = strLeftVal.toLowerCase() !== strRightVal.toLowerCase();
                        return this._evaluatedValue;
                    } else {
                        this._evaluatedValue = compareVal !== 0;
                        return this._evaluatedValue;
                    }
            }
        }

        // handle everything else
        switch (this.token.tokenID) {
            case _TokenID.ADD:
                this._evaluatedValue = leftValue + rightValue;
                break;
            case _TokenID.SUB:
                this._evaluatedValue = leftValue - rightValue;
                break;
            case _TokenID.MUL:
                this._evaluatedValue = leftValue * rightValue;
                break;
            case _TokenID.DIV:
                if (rightValue === 0) {
                    throw this._evaluatedValue = new DivideByZeroError();
                }
                this._evaluatedValue = leftValue / rightValue;
                break;
            case _TokenID.DIVINT:
                if (rightValue === 0) {
                    throw this._evaluatedValue = new DivideByZeroError();
                }
                this._evaluatedValue = Math.floor(leftValue / rightValue);
                break;
            case _TokenID.MOD:
                if (rightValue === 0) {
                    throw this._evaluatedValue = new DivideByZeroError();
                }
                this._evaluatedValue = Math.floor(leftValue % rightValue);
                break;
            case _TokenID.POWER:
                if (rightValue === 0.0) {
                    this._evaluatedValue = 1.0;
                }
                if (rightValue === 0.5) {
                    this._evaluatedValue = Math.sqrt(leftValue);
                }
                if (rightValue === 1.0) {
                    this._evaluatedValue = leftValue;
                }
                if (rightValue === 2.0) {
                    this._evaluatedValue = leftValue * leftValue;
                }
                if (rightValue === 3.0) {
                    this._evaluatedValue = leftValue * leftValue * leftValue;
                }
                if (rightValue === 4.0) {
                    this._evaluatedValue = leftValue * leftValue * leftValue * leftValue;
                }
                this._evaluatedValue = Math.pow(leftValue, rightValue);
                break;
            default:
                this._evaluatedValue = NaN;
                break;
        }

        if (!isNaN(this._evaluatedValue)) {
            if (isDateVal) {
                this._evaluatedValue = {
                    value: FlexSheet._fromOADate(this._evaluatedValue),
                    format: leftFormat || rightFormat
                };
            }
            return this._evaluatedValue;
        }

        throw new SyntaxError(_ErrorMessages.BadExpression);
    }

    _refersTo(rng: wijmo.grid.CellRange) {
        return this._leftExpr._refersTo(rng) || this._rightExpr._refersTo(rng);
    }

    // Update the cell range in the expression with insert\remove rows\columns.
    _updateCellRangeExp(sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): boolean {
        let changed = false,
            ret: boolean;
        ret = this._leftExpr._updateCellRangeExp(sheetIndex, index, count, isAdding, isRow, affectRange);
        changed = changed || ret;
        ret = this._rightExpr._updateCellRangeExp(sheetIndex, index, count, isAdding, isRow, affectRange);
        return changed || ret;
    }

    // Moves the cell range in the expression with moving rows\columns. 
    _moveCellRangeExp(sheetIndex: number, srcRange: wijmo.grid.CellRange, dstRange: wijmo.grid.CellRange, isChangePos: boolean = false, isCopying: boolean = false): boolean {
        let changed = false,
            ret: boolean;
        ret = this._leftExpr._moveCellRangeExp(sheetIndex, srcRange, dstRange, isChangePos, isCopying);
        changed = changed || ret;
        ret = this._rightExpr._moveCellRangeExp(sheetIndex, srcRange, dstRange, isChangePos, isCopying);
        return changed || ret;
    }

    // Update the cell range in the expression with reordering rows.
    _updateCellRangeExpForReorderingRows(rowDiff: number) {
        let changed = false,
            ret: boolean;
        ret = this._leftExpr._updateCellRangeExpForReorderingRows(rowDiff);
        changed = changed || ret;
        ret = this._rightExpr._updateCellRangeExpForReorderingRows(rowDiff);
        return changed || ret;
    }

    // Gets the string represents this expression.
    _getStringExpression(): string {
        let strOperator: string;
        switch (this.token.tokenID) {
            case _TokenID.GT:
                strOperator = '>';
                break;
            case _TokenID.LT:
                strOperator = '<';
                break;
            case _TokenID.GE:
                strOperator = '>=';
                break;
            case _TokenID.LE:
                strOperator = '<=';
                break;
            case _TokenID.EQ:
                strOperator = '=';
                break;
            case _TokenID.NE:
                strOperator = '<>';
                break;
            case _TokenID.ADD:
                strOperator = '+';
                break;
            case _TokenID.SUB:
                strOperator = '-';
                break;
            case _TokenID.MUL:
                strOperator = '*';
                break;
            case _TokenID.DIV:
                strOperator = '/';
                break;
            case _TokenID.DIVINT:
                strOperator = '\\';
                break;
            case _TokenID.POWER:
                strOperator = '^';
                break;
            case _TokenID.CONCAT:
                strOperator = '&';
                break;
            default:
                return '';
        }

        return (this._inGroup ? '(' : '') + this._leftExpr._getStringExpression() + strOperator + this._rightExpr._getStringExpression() + (this._inGroup ? ')' : '');
    }
}

/*
 * Defines the cell range expression class.
 * For e.g. A1 or A1:B2.
 */
export class _CellRangeExpression extends _Expression {
    private _cells: wijmo.grid.CellRange;
    private _sheetRef: string;
    private _flex: FlexSheet;
    private _isCellRange: boolean;
    private _absRow: boolean;
    private _absCol: boolean;
    private _absRow2: boolean;
    private _absCol2: boolean;
    private _evalutingRange: any;
    private _isWholeRow: boolean;

    _isEmpty: boolean;
    _tableName: string;
    _tableParams: string[];

    /*
     * Initializes a new instance of the {@link CellRangeExpression} class.
     *
     * @param cells The {@link CellRange} instance represents the cell range for the CellRangeExpression.
     * @param sheetRef The sheet name of the sheet which the cells range refers.
     * @param flex The {@link FlexSheet} instance for evaluating the value for the CellRangeExpression.
     * @param isCellRange indicates this cell range expression represents single cell or cells range.
     * @param absRow indicates whether the row of the cell range is absolute or not.
     * @param absCol indicates whether the col of the cell range is absolute or not.
     * @param absRow2 indicates whether the row2 of the cell range is absolute or not.
     * @param absCol2 indicates whether the col2 of the cell range is absolute or not.
     */
    constructor(cells: wijmo.grid.CellRange, sheetRef: string, flex: FlexSheet, isCellRange: boolean = true, absRow: boolean = false, absCol: boolean = false, absRow2: boolean = false, absCol2: boolean = false, isWholeRow?: boolean) {
        super();

        this._cells = new wijmo.grid.CellRange(cells.topRow, cells.leftCol, cells.bottomRow, cells.rightCol);
        this._sheetRef = sheetRef;
        this._flex = flex;
        this._evalutingRange = {};
        this._isCellRange = isCellRange;
        this._absRow = absRow;
        this._absCol = absCol;
        this._absRow2 = absRow2;
        this._absCol2 = absCol2;
        this._isWholeRow = isWholeRow;
    }

    /*
     * Overrides the evaluate function of base class.
     *
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     * @param strictStringCmp Indicates whether to use strict comparison if one of the operands is a string.
     * @param throwOnError Indicates whether an FormulaError should be returned or thrown if it occurred. The default value is true.
     */
    evaluate(rowIndex: number, columnIndex: number, sheet?: Sheet, strictStringCmp = true, throwOnError = true): any {
        if (this._evaluatedValue == null) {
            let cells = this._extendRange(sheet);
            let val = this._getCellValue(cells, sheet, rowIndex, columnIndex, throwOnError, true); // get the cell value without converting empty values to ''

            this._isEmpty = val == null;

            if (val == null) { // emulate the default behavior of this._getCellValue/flexSheet.getCellValue()
                val = '';
            }

            this._evaluatedValue = val;
        }

        return this._evaluatedValue;
    }

    /*
     * Gets the value list for each cell inside the cell range.
     *
     * @param isGetHiddenValue indicates whether get the cell value of the hidden row or hidden column.
     * @param columnIndex indicates which column of the cell range need be get.
     * @param sheet The {@link Sheet} whose value to evaluate. If not specified then the data from current sheet 
     * @param throwOnError Indicates whether an FormulaError should be returned or thrown if it occurred. The default value is true.
     */
    getValues(isGetHiddenValue: boolean = true, columnIndex?: number, sheet?: Sheet, throwOnError = true): any[] {
        var cellValue: any,
            vals: any[] = [],
            valIndex: number = 0,
            rowIndex: number,
            columnIndex: number,
            startColumnIndex: number,
            endColumnIndex: number,
            cells: wijmo.grid.CellRange;

        sheet = this._getSheet() || sheet || this._flex.selectedSheet;
        if (!sheet) {
            return null;
        }

        cells = this._extendRange(sheet);

        startColumnIndex = columnIndex != null && !isNaN(+columnIndex) ? columnIndex : cells.leftCol;
        endColumnIndex = columnIndex != null && !isNaN(+columnIndex) ? columnIndex : cells.rightCol;

        let rng = new wijmo.grid.CellRange();

        for (rowIndex = cells.topRow; rowIndex <= cells.bottomRow && rowIndex < sheet.grid.rows.length; rowIndex++) {
            if (!isGetHiddenValue && (<wijmo.grid.Row>sheet.grid.rows[rowIndex]).isVisible === false) {
                continue;
            }
            for (columnIndex = startColumnIndex; columnIndex <= endColumnIndex && columnIndex < sheet.grid.columns.length; columnIndex++) {
                rng.col = columnIndex;
                rng.col2 = columnIndex;
                rng.row = rowIndex;
                rng.row2 = rowIndex;

                cellValue = this._getCellValue(rng /*new CellRange(rowIndex, columnIndex)*/, sheet, undefined, undefined, throwOnError);
                if (!(cellValue instanceof FormulaError) && !wijmo.isPrimitive(cellValue)) {
                    cellValue = cellValue.value;
                }
                vals[valIndex] = cellValue;
                valIndex++;
            }
        }

        return vals;
    }

    /*
     * Gets the two-dimensional value list for each cell inside the cell range.
     *
     * @param isGetHiddenValue indicates whether get the cell value of the hidden row or hidden column.
     * @param sheet The {@link Sheet} whose value to evaluate. If not specified then the data from current sheet 
     */
    getValuesWithTwoDimensions(isGetHiddenValue: boolean = true, sheet?: Sheet) {
        var cellValue: any,
            vals: any[] = [],
            rowVals: any[],
            rowValIndex: number = 0,
            valIndex: number = 0,
            rowIndex: number,
            columnIndex: number,
            cells: wijmo.grid.CellRange;

        sheet = this._getSheet() || sheet || this._flex.selectedSheet;
        if (!sheet) {
            return null;
        }

        cells = this._extendRange(sheet);

        for (rowIndex = cells.topRow; rowIndex <= cells.bottomRow && rowIndex < sheet.grid.rows.length; rowIndex++) {
            if (!isGetHiddenValue && (<wijmo.grid.Row>sheet.grid.rows[rowIndex]).isVisible === false) {
                rowValIndex++;
                continue;
            }
            rowVals = [];
            valIndex = 0;
            for (columnIndex = cells.leftCol; columnIndex <= cells.rightCol && columnIndex < sheet.grid.columns.length; columnIndex++) {
                if (!isGetHiddenValue && (<wijmo.grid.Column>sheet.grid.columns[columnIndex]).isVisible === false) {
                    valIndex++;
                    continue;
                }
                cellValue = this._getCellValue(new wijmo.grid.CellRange(rowIndex, columnIndex), sheet);
                if (!(cellValue instanceof FormulaError) && !wijmo.isPrimitive(cellValue)) {
                    cellValue = cellValue.value;
                }
                rowVals[valIndex] = cellValue;
                valIndex++;
            }
            vals[rowValIndex] = rowVals;
            rowValIndex++;
        }

        return vals;
    }

    /*
     * Gets the cell range of the CellRangeExpression.
     */
    get cells(): wijmo.grid.CellRange {
        return this._cells;
    }

    /*
     * Gets the sheet reference of the CellRangeExpression.
     */
    get sheetRef(): string {
        return this._sheetRef;
    }

    // Get cell value for a cell.
    // throwOnError indicates whether a FormulaError should be returned or throwned.
    private _getCellValue(cell: wijmo.grid.CellRange, sheet?: Sheet, rowIndex?: number, columnIndex?: number, throwOnError = true, dontConvertNull?: boolean): any {
        var sheet: Sheet,
            cellKey: string,
            row: number,
            col: number;

        sheet = this._getSheet() || sheet || this._flex.selectedSheet;
        if (!sheet) {
            return null;
        }

        if (cell.isSingleCell) {
            row = cell.row;
            col = cell.col;
        } else {
            if (rowIndex != null) {
                if (rowIndex >= cell.topRow && rowIndex <= cell.bottomRow && cell.col === cell.col2) {
                    row = rowIndex;
                    col = cell.col;
                }
            }
            if (columnIndex != null) {
                if (columnIndex >= cell.leftCol && columnIndex <= cell.rightCol && cell.row === cell.row2) {
                    row = cell.row;
                    col = columnIndex;
                }
            }
        }

        if (row == null || col == null) {
            throw new ReferenceError(_ErrorMessages.InvalidCellRef);
        }
        cellKey = sheet.name + ':' + row + ',' + col + '-' + row + ',' + col;

        if (this._evalutingRange[cellKey]) {
            throw new SyntaxError(_ErrorMessages.CircRef);
        }

        try {
            if (this._flex) {
                this._evalutingRange[cellKey] = true;

                let grid = sheet === this._flex.selectedSheet ? this._flex : sheet.grid;
                if (row < grid.rows.length && col < grid.columns.length) {
                    let column = sheet.grid.columns[col],
                        val = this._flex.getCellValue(row, col, dontConvertNull ? 0 as any : false, sheet);

                    if (val instanceof FormulaError) {
                        if (throwOnError) {
                            throw val;
                        }
                        return val;
                    }

                    if (column.dataMap && !dontConvertNull) {
                        val = column.dataMap.getDisplayValue(val);
                    }
                    return val;
                }
                return 0;
            }
        }
        finally {
            delete this._evalutingRange[cellKey];
        }
    }

    // Gets the sheet by the sheetRef.
    _getSheet(): Sheet {
        if (!this._sheetRef) {
            return null;
        }

        let sheet = this._flex._getSheet(this._sheetRef);

        if (!sheet) {
            throw new ReferenceError(_ErrorMessages.InvalidSheetRef);
        }

        return sheet;
    }

    _refersTo(rng: wijmo.grid.CellRange) {
        return rng.contains(this.cells);
    }

    // Update the cell range in the expression with insert\remove rows\columns.
    _updateCellRangeExp(sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): boolean {
        let cellRange = this._cells,
            changed: boolean = false;

        if (this._tableParams && this._tableParams.length > 0) {
            return false;
        }

        if (sheetIndex === this._flex.selectedSheetIndex) {
            if (this._sheetRef && this._sheetRef.toLowerCase() !== this._flex.selectedSheet.name.toLowerCase()) {
                return false;
            }
        } else {
            if (!this._sheetRef || this._sheetRef.toLowerCase() !== this._flex.selectedSheet.name.toLowerCase()) {
                return false;
            }
        }
        if (isRow) {
            if (this._isWholeRow == null || this._isWholeRow) {
                if (affectRange && (cellRange.leftCol > affectRange.rightCol || cellRange.rightCol < affectRange.leftCol)) {
                    return false;
                }
                if (isAdding) {
                    if (cellRange.topRow >= index) {
                        cellRange.row += count;
                        cellRange.row2 += count;
                        changed = true;
                    } else if (cellRange.topRow < index && cellRange.bottomRow >= index) {
                        cellRange.row2 += count;
                        changed = true;
                    }
                } else {
                    if (cellRange.topRow > index) {
                        cellRange.row -= count;
                        cellRange.row2 -= count;
                        changed = true;
                    } else {
                        if (cellRange.isSingleCell) {
                            if (cellRange.row >= index - count + 1) {
                                cellRange.row = index - count + 1;
                                cellRange.row2 = index - count + 1;
                                changed = true;
                            }
                        } else {
                            if (cellRange.topRow >= index - count + 1) {
                                cellRange.row = index - count + 1;
                                cellRange.row2 -= count;
                                changed = true;
                            } else if (cellRange.topRow < index - count + 1 && cellRange.bottomRow >= index - count + 1) {
                                if (cellRange.bottomRow > index) {
                                    cellRange.row2 -= count;
                                } else {
                                    cellRange.row2 = index - count;
                                }
                                changed = true;
                            }
                        }
                    }
                }
            }
        } else {
            if (this._isWholeRow == null || !this._isWholeRow) {
                if (affectRange && (cellRange.topRow > affectRange.bottomRow || cellRange.bottomRow < affectRange.topRow)) {
                    return false;
                }
                if (isAdding) {
                    if (cellRange.leftCol >= index) {
                        cellRange.col += count;
                        cellRange.col2 += count;
                        changed = true;
                    } else if (cellRange.leftCol < index && cellRange.rightCol >= index) {
                        cellRange.col2 += count;
                        changed = true;
                    }
                } else {
                    if (cellRange.leftCol > index) {
                        cellRange.col -= count;
                        cellRange.col2 -= count;
                        changed = true;
                    } else {
                        if (cellRange.isSingleCell) {
                            if (cellRange.col >= index - count + 1) {
                                cellRange.col = index - count + 1;
                                cellRange.col2 = index - count + 1;
                                changed = true;
                            }
                        } else {
                            if (cellRange.leftCol >= index - count + 1) {
                                cellRange.col = index - count + 1;
                                cellRange.col2 -= count;
                                changed = true;
                            } else if (cellRange.leftCol < index - count + 1 && cellRange.rightCol >= index - count + 1) {
                                if (cellRange.rightCol > index) {
                                    cellRange.col2 -= count;
                                } else {
                                    cellRange.col2 = index - count;
                                }
                                changed = true;
                            }
                        }
                    }
                }
            }
        }

        return changed;
    }

    // Moves the cell range in the expression with moving rows\columns. 
    _moveCellRangeExp(sheetIndex: number, srcRange: wijmo.grid.CellRange, dstRange: wijmo.grid.CellRange, isChangePos: boolean = false, isCopying: boolean = false): boolean {
        let cellRange = this._cells,
            changed: boolean = false,
            rowDiff: number,
            colDiff: number;

        if (this._tableParams && this._tableParams.length > 0) {
            return false;
        }

        // Do not update formulas in other sheets unless they refer to the current sheet. (#422956).
        if (this._flex.selectedSheetIndex != sheetIndex && (!this._sheetRef || this._sheetRef.toLowerCase() !== this._flex.selectedSheet.name.toLowerCase())) {
            return false;
        }

        // During moving do not update formulas in the current sheet if they referring to other sheets. (#422195, #436271).
        if (!isCopying && this._flex.selectedSheetIndex == sheetIndex && this._sheetRef && this._sheetRef.toLowerCase() !== this._flex.selectedSheet.name.toLowerCase()) {
            return false;
        }

        rowDiff = dstRange.topRow - srcRange.topRow;
        colDiff = dstRange.leftCol - srcRange.leftCol;

        if (isCopying) {
            if (rowDiff !== 0 && (this._isWholeRow == null || this._isWholeRow)) {
                cellRange.row += isCopying && this._absRow ? 0 : rowDiff;
                cellRange.row2 += this._isCellRange ? (isCopying && this._absRow2 ? 0 : rowDiff) : (isCopying && this._absRow ? 0 : rowDiff);
                changed = true;
            }
            if (colDiff !== 0 && (this._isWholeRow == null || !this._isWholeRow)) {
                cellRange.col += isCopying && this._absCol ? 0 : colDiff;
                cellRange.col2 += this._isCellRange ? (isCopying && this._absCol2 ? 0 : colDiff) : (isCopying && this._absCol ? 0 : colDiff);
                changed = true;
            }
            return changed;
        }

        if (srcRange.contains(cellRange)) {
            if (rowDiff !== 0 && (this._isWholeRow == null || this._isWholeRow)) {
                cellRange.row += rowDiff;
                cellRange.row2 += rowDiff;
                changed = true;
            }
            if (colDiff !== 0 && (this._isWholeRow == null || !this._isWholeRow)) {
                cellRange.col += colDiff;
                cellRange.col2 += colDiff;
                changed = true;
            }
        } else if (srcRange.intersects(cellRange)) {
            if (srcRange.intersectsRow(cellRange)) {
                var cellRngContainsSrcRng = srcRange.topRow >= cellRange.topRow && srcRange.bottomRow <= cellRange.bottomRow;

                if (rowDiff !== 0 && (this._isWholeRow == null || this._isWholeRow)) {
                    if (srcRange.topRow <= cellRange.topRow) {
                        if (rowDiff < 0) {
                            cellRange.row += rowDiff;
                            changed = true;
                        } else if (rowDiff > 0) {
                            var moveDownInside = cellRngContainsSrcRng && dstRange.bottomRow < cellRange.bottomRow; // srcRange moves down inside cellRange
                            if (isChangePos && !moveDownInside) {
                                if (srcRange.topRow < cellRange.topRow) {
                                    cellRange.row -= cellRange.topRow - srcRange.topRow;
                                }
                                cellRange.row2 -= srcRange.rowSpan;
                                changed = true;
                            }
                        }
                    } else if (srcRange.bottomRow >= cellRange.bottomRow) {
                        if (rowDiff > 0) {
                            cellRange.row2 += rowDiff;
                            changed = true;
                        } else if (rowDiff < 0) {
                            var moveUpInside = cellRngContainsSrcRng && dstRange.topRow > cellRange.topRow; // srcRange moves up inside cellRange
                            if (isChangePos && !moveUpInside) {
                                if (srcRange.bottomRow > cellRange.bottomRow) {
                                    cellRange.row2 += srcRange.bottomRow - cellRange.bottomRow;
                                }
                                cellRange.row += srcRange.rowSpan;
                                changed = true;
                            }
                        }
                    } else {
                        if (isChangePos) {
                            if (rowDiff < 0 && dstRange.topRow <= cellRange.topRow) {
                                cellRange.row += srcRange.rowSpan;
                            }
                            if (rowDiff > 0 && dstRange.bottomRow >= cellRange.bottomRow) {
                                cellRange.row2 -= srcRange.rowSpan;
                            }
                            changed = true;
                        }
                    }
                }
            }

            if (srcRange.intersectsColumn(cellRange)) {
                if (colDiff !== 0 && (this._isWholeRow == null || !this._isWholeRow)) {
                    if (srcRange.leftCol <= cellRange.leftCol) {
                        if (colDiff < 0) {
                            cellRange.col += colDiff;
                            changed = true;
                        } else if (colDiff > 0) {
                            if (isChangePos) {
                                if (srcRange.leftCol < cellRange.leftCol) {
                                    cellRange.col -= cellRange.leftCol - srcRange.leftCol;
                                }
                                cellRange.col2 -= srcRange.columnSpan;
                                changed = true;
                            }
                        }
                    } else if (srcRange.rightCol >= cellRange.rightCol) {
                        if (colDiff > 0) {
                            cellRange.col2 += colDiff;
                            changed = true;
                        } else if (colDiff < 0) {
                            if (isChangePos) {
                                if (srcRange.rightCol > cellRange.rightCol) {
                                    cellRange.col2 += srcRange.rightCol - cellRange.rightCol;
                                }
                                cellRange.col += srcRange.columnSpan;
                                changed = true;
                            }
                        }
                    } else {
                        if (isChangePos) {
                            if (colDiff < 0) {
                                cellRange.col += srcRange.columnSpan;
                            } else {
                                cellRange.col2 -= srcRange.columnSpan;
                            }
                            changed = true;
                        }
                    }
                }
            }
        } else { // srcRange.intersects(cellRange) == false
            if (isChangePos) {
                if (this._isWholeRow == null || this._isWholeRow) {
                    if ((cellRange.row !== cellRange.row2) && cellRange.containsRow(dstRange.topRow)) {
                        // Expand the cellRange when inserting rows into it.
                        if (rowDiff < 0) {
                            cellRange.row2 += dstRange.rowSpan;
                        } else {
                            cellRange.row = Math.max(0, cellRange.row - dstRange.rowSpan);
                        }
                        changed = true;
                    } else {
                        // Rows are inserted above the cellRange
                        if (cellRange.topRow >= dstRange.topRow && cellRange.topRow < srcRange.topRow && rowDiff < 0) {
                            cellRange.row += dstRange.rowSpan;
                            cellRange.row2 += dstRange.rowSpan;
                            changed = true;
                        }

                        // Rows are inserted below the cellRange
                        if (cellRange.topRow > srcRange.bottomRow && cellRange.bottomRow <= dstRange.bottomRow && rowDiff > 0) {
                            cellRange.row -= dstRange.rowSpan;
                            cellRange.row2 -= dstRange.rowSpan;
                            changed = true;
                        }
                    }
                }

                if (this._isWholeRow == null || !this._isWholeRow) {
                    if ((cellRange.col !== cellRange.col2) && cellRange.containsColumn(dstRange.leftCol)) {
                        // Expand the cellRange when inserting columns into it.
                        if (colDiff < 0) {
                            cellRange.col2 += dstRange.columnSpan;
                        } else {
                            cellRange.col = Math.max(0, cellRange.col - dstRange.columnSpan);
                        }
                        changed = true;
                    } else {
                        // Columns are inserted to the left of the cellRange
                        if (cellRange.leftCol >= dstRange.leftCol && cellRange.leftCol < srcRange.leftCol && colDiff < 0) {
                            cellRange.col += dstRange.columnSpan;
                            cellRange.col2 += dstRange.columnSpan;
                            changed = true;
                        }

                        // Columns are inserted to the right of the cellRange
                        if (cellRange.leftCol > srcRange.rightCol && cellRange.rightCol <= dstRange.rightCol && colDiff > 0) {
                            cellRange.col -= dstRange.columnSpan;
                            cellRange.col2 -= dstRange.columnSpan;
                            changed = true;
                        }
                    }
                }
            }
        }

        return changed;
    }

    // Update the cell range in the expression with reordering rows.
    _updateCellRangeExpForReorderingRows(rowDiff: number) {
        let updatedRow: number,
            cellRange = this._cells;

        if (this._isWholeRow == null || this._isWholeRow) {
            updatedRow = this._cells.row + rowDiff;
            if (updatedRow < 0) {
                updatedRow = 0;
            } else if (updatedRow >= this._flex.rows.length) {
                updatedRow = this._flex.rows.length - 1;
            }
            cellRange.row = updatedRow;

            if (this._isCellRange) {
                updatedRow = this._cells.row2 + rowDiff;
                if (updatedRow < 0) {
                    updatedRow = 0;
                } else if (updatedRow >= this._flex.rows.length) {
                    updatedRow = this._flex.rows.length - 1;
                }
            }
            cellRange.row2 = updatedRow;
        }

        return true;
    }

    // Update the cell boundary
    _updateCellBoundary(row: number, col: number) {
        let cellRange = this._cells;

        if (this._sheetRef && this._sheetRef.toLowerCase() !== this._flex.selectedSheet.name.toLowerCase()) {
            return false;
        }
        if (cellRange.row === cellRange.row2 && cellRange.row === row && col === cellRange.col2 + 1) {
            cellRange.col2 += 1;
            return true;
        }

        if (cellRange.col === cellRange.col2 && cellRange.col === col && row === cellRange.row2 + 1) {
            cellRange.row2 += 1;
            return true;
        }

        return false;
    }

    // Gets the string represents this expression.
    _getStringExpression(): string {
        if (this._tableParams && this._tableParams.length > 0) {
            return this._getTableParamsStringExpression();
        }

        let sheetRef = this._quoteName(this._sheetRef);

        return (sheetRef ? sheetRef + '!' : '') + wijmo.xlsx.Workbook.xlsxAddress(this._cells.row, this._cells.col, this._absRow, this._absCol, this._isWholeRow) +
            (this._isCellRange ? ':' + wijmo.xlsx.Workbook.xlsxAddress(this._cells.row2, this._cells.col2, this._absRow2, this._absCol2, this._isWholeRow) : '');
    }

    private _quoteName(name: string): string {
        if (name && (/[\s\-!\$]/.test(name) || /^\d/.test(name))) { // Name must be enclosed in "'" if contains invalid characters (WJM-19589, WJM-19415).
            name = `'${name}'`;
        }
        return name;
    }

    // Gets the string represents the table reference expression.
    private _getTableParamsStringExpression(): string {
        let index = 0,
            expression = '',
            paramsCount = this._tableParams.length,
            columnExisted = false,
            param: string;

        for (; index < paramsCount; index++) {
            param = this._tableParams[index];
            if (param[0] === '#') {
                expression += '[' + param + ']';
                if (index < paramsCount - 1) {
                    expression += ', ';
                }
            } else {
                if (!columnExisted) {
                    expression += '[' + param + ']';
                    columnExisted = true;
                } else {
                    expression += ': [' + param + ']';
                }
            }
        }

        if (paramsCount > 1) {
            expression = '[' + expression + ']';
        }

        if (this._tableName) {
            expression = this._tableName + expression;
        }
        return expression;
    }

    private _extendRange(sheet?: Sheet) {
        let rng = this._cells.clone();

        if (this._isWholeRow != null) {
            if (this._isWholeRow) {
                rng.col = 0;
                rng.col2 = sheet ? sheet.grid.columns.length - 1 : this._flex.columns.length - 1;
            } else {
                rng.row = 0;
                rng.row2 = sheet ? sheet.grid.rows.length - 1 : this._flex.rows.length - 1;
            }
        }

        return rng;
    }
}

/*
 * Defines the function expression class.
 * For e.g. sum(1,2,3).
 */
export class _FunctionExpression extends _Expression {
    private _funcId: string;
    private _funcDefinition: _FunctionDefinition;
    private _params: Array<_Expression>;
    private _needCacheEvaluatedVal: boolean;

    /*
     * Initializes a new instance of the {@link FunctionExpression} class.
     *
     * @param funcId The id of related {@link FunctionDefinition}.
     * @param func The {@link FunctionDefinition} instance keeps function name, parameter counts, and function.
     * @param params The parameter list that the function of the {@link FunctionDefinition} instance needs.
     * @param needCacheEvaluatedVal indicates whether the _FunctionExpression need cache the evaluated value.
     */
    constructor(funcId: string, func: _FunctionDefinition, params: Array<_Expression>, needCacheEvaluatedVal: boolean = true) {
        super();

        this._funcId = funcId;
        this._funcDefinition = func;
        this._params = params;
        this._needCacheEvaluatedVal = needCacheEvaluatedVal;
    }

    /*
     * Overrides the evaluate function of base class.
     *
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     */
    evaluate(rowIndex: number, columnIndex: number, sheet?: Sheet): any {
        if (!this._needCacheEvaluatedVal) {
            return this._funcDefinition.func(this._params, sheet, rowIndex, columnIndex);
        }

        if (this._evaluatedValue == null) {
            this._evaluatedValue = this._funcDefinition.func(this._params, sheet, rowIndex, columnIndex);
        }

        return this._evaluatedValue;
    }

    _refersTo(rng: wijmo.grid.CellRange) {
        if (this._params) {
            for (let i = 0; i < this._params.length; i++) {
                if (this._params[i]._refersTo(rng)) {
                    return true;
                }
            }
        }

        return false;
    }

    // Update the cell range in the expression with insert\remove rows\columns.
    _updateCellRangeExp(sheetIndex: number, index: number, count: number, isAdding: boolean, isRow: boolean, affectRange?: wijmo.grid.CellRange): boolean {
        let paramIndex: number,
            param: _Expression,
            changed: boolean = false,
            ret: boolean;

        if (this._params && this._params.length > 0) {
            for (paramIndex = 0; paramIndex < this._params.length; paramIndex++) {
                param = this._params[paramIndex];
                ret = param._updateCellRangeExp(sheetIndex, index, count, isAdding, isRow, affectRange);
                if (!changed) {
                    changed = changed || ret;
                }
            }
        }

        return changed;
    }

    // Moves the cell range in the expression with moving rows\columns. 
    _moveCellRangeExp(sheetIndex: number, srcRange: wijmo.grid.CellRange, dstRange: wijmo.grid.CellRange, isChangePos: boolean = false, isCopying: boolean = false): boolean {
        let paramIndex: number,
            param: _Expression,
            changed: boolean = false,
            ret: boolean;

        if (this._params && this._params.length > 0) {
            for (paramIndex = 0; paramIndex < this._params.length; paramIndex++) {
                param = this._params[paramIndex];
                ret = param._moveCellRangeExp(sheetIndex, srcRange, dstRange, isChangePos, isCopying);
                if (!changed) {
                    changed = changed || ret;
                }
            }
        }

        return changed;
    }

    // Update the cell range in the expression with reordering rows.
    _updateCellRangeExpForReorderingRows(rowDiff: number) {
        let paramIndex: number,
            param: _Expression,
            changed: boolean = false,
            ret: boolean;

        if (this._params && this._params.length > 0) {
            for (paramIndex = 0; paramIndex < this._params.length; paramIndex++) {
                param = this._params[paramIndex];
                ret = param._updateCellRangeExpForReorderingRows(rowDiff);
                if (!changed) {
                    changed = changed || ret;
                }
            }
        }

        return changed;
    }

    // Update the cell boundary
    _updateCellBoundary(row: number, col: number) {
        let param: _Expression;

        if (this._params && this._params.length === 1) {
            param = this._params[0];
            if (param instanceof _CellRangeExpression) {
                return param._updateCellBoundary(row, col);
            }
        }

        return false;
    }

    // Gets the string represents this expression.
    _getStringExpression(): string {
        return this._funcId + this._parseParamsExpToString();
    }

    // Gets the string represents this expression.
    private _parseParamsExpToString() {
        let index: number,
            param: _Expression,
            strParam: string;
        if (this._params && this._params.length > 0) {
            strParam = '';
            for (index = 0; index < this._params.length; index++) {
                param = this._params[index];
                if (index === 0) {
                    strParam += '(';
                }
                strParam += param._getStringExpression();
                if (index < this._params.length - 1) {
                    strParam += ', ';
                } else {
                    strParam += ')';
                }
            }
            return strParam;
        }

        return '()';
    }
}
    }
    


    module wijmo.grid.sheet {
    








'use strict';

/*
 * Defines the CalcEngine class.
 *
 * It deals with the calculation for the flexsheet control.
 */
export class _CalcEngine {
    private _owner: FlexSheet;
    private _expression: string;
    private _expressLength: number;
    private _pointer: number;
    private _expressionCache: { [key: string]: _Expression } = {};
    private _tokenTable: any;
    private _token: _Token;
    private _idChars: string = '$:!';
    private _functionTable: { [funcName: string]: _FunctionDefinition } = {};
    private _cacheSize: number = 0;
    private _tableRefStart: boolean = false;
    private _rowIndex: number;
    private _columnIndex: number;
    private _containsCellRef: boolean;
    private _sheet: Sheet;

    /*
     * Initializes a new instance of the {@link CalcEngine} class.
     *
     * @param owner The {@link FlexSheet} control that the CalcEngine works for.
     */
    constructor(owner: FlexSheet) {
        this._owner = owner;

        this._buildSymbolTable();
        this._registerAggregateFunction();
        this._registerMathFunction();
        this._registerLogicalFunction();
        this._registerTextFunction();
        this._registerDateFunction();
        this._registLookUpReferenceFunction();
        this._registFinacialFunction();
        this._registAddressRelatedFunction();
        this._registerErrorFunctions();
    }

    /*
     * Occurs when the {@link _CalcEngine} meets the unknown formula.
     */
    readonly unknownFunction = new wijmo.Event<_CalcEngine, UnknownFunctionEventArgs>();
    /*
     * Raises the unknownFunction event.
     */
    onUnknownFunction(funcName: string, params: Array<_Expression>): _Expression {
        var paramsList: any[],
            eventArgs: UnknownFunctionEventArgs;

        if (params && params.length > 0) {
            paramsList = [];
            for (var i = 0; i < params.length; i++) {
                paramsList[i] = params[i].evaluate(this._rowIndex, this._columnIndex);
            }
        }

        eventArgs = new UnknownFunctionEventArgs(funcName, paramsList);
        this.unknownFunction.raise(this, eventArgs);

        if (eventArgs.value != null) {
            return new _Expression(eventArgs.value);
        }

        throw new NameError(_ErrorMessages.UnkFuncName(funcName));
    }

    /*
     * Evaluates an expression.
     *
     * @param expression the expression need to be evaluated to value.
     * @param format the format string used to convert raw values into display.
     * @param sheet The {@link Sheet} is referenced by the {@link Expression}.
     * @param rowIndex The row index of the cell where the expression located in.
     * @param columnIndex The column index of the cell where the expression located in.
     */
    evaluate(expression: string, format?: string, sheet?: Sheet, rowIndex?: number, columnIndex?: number, strictStringCmp = true): any {
        var expr: _Expression,
            result: any;

        if (!this._owner.enableFormulas) {
            return expression;
        }
        try {
            if (_isFormula(expression)) {
                this._containsCellRef = false;
                this._rowIndex = rowIndex;
                this._columnIndex = columnIndex;
                this._sheet = sheet ? sheet : this._owner.selectedSheet;
                expr = this._checkCache(expression, strictStringCmp);
                result = expr.evaluate(rowIndex, columnIndex, sheet, strictStringCmp);
                while (result instanceof _Expression) {
                    result = (<_Expression>result).evaluate(rowIndex, columnIndex, sheet, strictStringCmp);
                }
                if (format && wijmo.isPrimitive(result)) {
                    return wijmo.Globalize.format(result, format);
                }
                return result;
            }

            return expression ? expression : '';
        } catch (e) {
            var err = e instanceof FormulaError ? e : new UnknownError(e);

            if (expr) {
                expr._evaluatedValue = err;
            }

            return err;
        }
    }

    /*
     * Add a custom function to the {@link _CalcEngine}.
     *
     * @param name the name of the custom function, the function name should be lower case.
     * @param func the custom function.
     * @param minParamsCount the minimum count of the parameter that the function need.
     * @param maxParamsCount the maximum count of the parameter that the function need.
     *        If the count of the parameters in the custom function is arbitrary, the
     *        minParamsCount and maxParamsCount should be set to null.
     */
    addCustomFunction(name: string, func: Function, minParamsCount?: number, maxParamsCount?: number) {
        var self = this;

        name = name.toLowerCase();
        this._functionTable[name] = new _FunctionDefinition((params) => {
            var param,
                paramsList = [];
            if (params && params.length > 0) {
                for (var i = 0; i < params.length; i++) {
                    param = params[i];
                    if (param instanceof _CellRangeExpression) {
                        paramsList[i] = (<_CellRangeExpression>param).cells;
                    } else {
                        paramsList[i] = param.evaluate(self._rowIndex, self._columnIndex);
                    }
                }
            }
            return func.apply(self, paramsList);
        }, maxParamsCount, minParamsCount);
    }

    /*
     * Add a custom function to the {@link _CalcEngine}.
     *
     * @param name the name of the custom function, the function name should be lower case.
     * @param func the custom function.
     * @param minParamsCount the minimum count of the parameter that the function need.
     * @param maxParamsCount the maximum count of the parameter that the function need.
     *        If the count of the parameters in the custom function is arbitrary, the
     *        minParamsCount and maxParamsCount should be set to null.
     */
    addFunction(name: string, func: Function, minParamsCount?: number, maxParamsCount?: number) {
        var self = this;

        name = name.toLowerCase();
        this._functionTable[name] = new _FunctionDefinition((params) => {
            var param,
                paramsList = [];
            if (params && params.length > 0) {
                for (var i = 0; i < params.length; i++) {
                    param = params[i];
                    if (param instanceof _CellRangeExpression) {
                        paramsList[i] = (<_CellRangeExpression>param).getValuesWithTwoDimensions();
                    } else {
                        paramsList[i] = [[param.evaluate(self._rowIndex, self._columnIndex)]];
                    }
                }
            }
            return func.apply(self, paramsList);
        }, maxParamsCount, minParamsCount);
    }

    // Clear the expression cache.
    _clearExpressionCache() {
        this._expressionCache = null;
        this._expressionCache = {};
        this._cacheSize = 0;
    }

    // Parse the string expression to an Expression instance that can be evaluated to value.
    /*private*/ _parse(expression: string): _Expression {
        this._expression = expression;
        this._expressLength = expression ? expression.length : 0;
        this._pointer = 0;

        // skip leading equals sign
        if (this._expressLength > 0 && this._expression[0] === '=') {
            this._pointer++;
        }

        return this._parseExpression();
    }

    // Build static token table.
    private _buildSymbolTable(): any {
        if (!this._tokenTable) {
            this._tokenTable = {};
            this._addToken('+', _TokenID.ADD, _TokenType.ADDSUB);
            this._addToken('-', _TokenID.SUB, _TokenType.ADDSUB);
            this._addToken('(', _TokenID.OPEN, _TokenType.GROUP);
            this._addToken(')', _TokenID.CLOSE, _TokenType.GROUP);
            this._addToken('*', _TokenID.MUL, _TokenType.MULDIV);
            this._addToken(',', _TokenID.COMMA, _TokenType.GROUP);
            this._addToken('.', _TokenID.PERIOD, _TokenType.GROUP);
            this._addToken('/', _TokenID.DIV, _TokenType.MULDIV);
            this._addToken('\\', _TokenID.DIVINT, _TokenType.MULDIV);
            this._addToken('=', _TokenID.EQ, _TokenType.COMPARE);
            this._addToken('>', _TokenID.GT, _TokenType.COMPARE);
            this._addToken('<', _TokenID.LT, _TokenType.COMPARE);
            this._addToken('^', _TokenID.POWER, _TokenType.POWER);
            this._addToken("<>", _TokenID.NE, _TokenType.COMPARE);
            this._addToken(">=", _TokenID.GE, _TokenType.COMPARE);
            this._addToken("<=", _TokenID.LE, _TokenType.COMPARE);
            this._addToken('&', _TokenID.CONCAT, _TokenType.CONCAT);
            this._addToken('[', _TokenID.OPEN, _TokenType.SQUAREBRACKETS);
            this._addToken(']', _TokenID.CLOSE, _TokenType.SQUAREBRACKETS);
        }
    }

    // Register the aggregate function for the CalcEngine.
    private _registerAggregateFunction() {
        var self = this;

        self._functionTable['sum'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Sum, params, sheet);
        });
        self._functionTable['average'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Avg, params, sheet);
        });
        self._functionTable['max'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Max, params, sheet);
        });
        self._functionTable['min'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Min, params, sheet);
        });
        self._functionTable['var'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Var, params, sheet);
        });
        self._functionTable['varp'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.VarPop, params, sheet);
        });
        self._functionTable['stdev'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.Std, params, sheet);
        });
        self._functionTable['stdevp'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getAggregateResult(wijmo.Aggregate.StdPop, params, sheet);
        });
        self._functionTable['count'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Count, params, sheet);
        });
        self._functionTable['counta'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountA, params, sheet);
        });
        self._functionTable['countblank'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountBlank, params, sheet);
        });
        self._functionTable['countif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIf, params, sheet);
        }, 2, 2);
        self._functionTable['countifs'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIfs, params, sheet);
        }, 254, 2);
        self._functionTable['sumif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIf, params, sheet);
        }, 3, 2);
        self._functionTable['sumifs'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIfs, params, sheet);
        }, 255, 2);
        self._functionTable['rank'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Rank, params, sheet);
        }, 3, 2);
        self._functionTable['product'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Product, params, sheet);
        }, 255, 1);
        self._functionTable['subtotal'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._handleSubtotal(params, sheet);
        }, 255, 2);
        self._functionTable['dcount'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._handleDCount(params, sheet);
        }, 3, 3);
        self._functionTable['sumproduct'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._getSumProduct(params, sheet);
        }, 255, 1);
    }

    // Register the math function for the calcEngine.
    private _registerMathFunction() {
        var self = this,
            unaryFuncs = ['abs', 'acos', 'asin', 'atan', 'cos', 'exp', 'ln', 'sin', 'sqrt', 'tan'],
            ceilingFloorFuncs = ['ceiling', 'floor'],
            roundFuncs = ['round', 'rounddown', 'roundup'];

        self._functionTable['pi'] = new _FunctionDefinition(() => {
            return Math.PI;
        }, 0, 0);

        self._functionTable['rand'] = new _FunctionDefinition(() => {
            return Math.random();
        }, 0, 0);

        self._functionTable['power'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return Math.pow(_Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet), _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet));
        }, 2, 2);

        self._functionTable['atan2'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var x = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                y = _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet);

            if (x === 0 && y === 0) {
                throw new DivideByZeroError(_ErrorMessages.Atan2ArgsLessThanZero);
            }
            return Math.atan2(y, x);
        }, 2, 2);

        self._functionTable['mod'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            let num = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                div = _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet),
                divider = Math.abs(div);

            if (divider === 0) {
                throw new DivideByZeroError();
            }

            let result = Math.abs(num) % divider;

            if (div < 0) {
                result = -result;
            }
            return result;
        }, 2, 2);

        self._functionTable['trunc'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var num = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                precision = params.length === 2 ? _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet) : 0,
                multiple: number,
                result: number,
                format: string;

            if (precision === 0) {
                format = 'n0';
                if (num >= 0) {
                    result = Math.floor(num);
                } else {
                    result = Math.ceil(num);
                }
            } else {
                precision = precision > 0 ? Math.floor(precision) : Math.ceil(precision);
                format = 'n' + (precision > 0 ? precision : 0);
                multiple = Math.pow(10, precision);
                if (num >= 0) {
                    result = Math.floor(num * multiple) / multiple;
                } else {
                    result = Math.ceil(num * multiple) / multiple;
                }
            }

            if (result != null) {
                return {
                    value: result,
                    format: format
                };
            }
        }, 2, 1);

        ceilingFloorFuncs.forEach((val) => {
            self._functionTable[val] = new _FunctionDefinition((params, sheet?: Sheet) => {
                var num = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                    significance = params.length === 2 ? _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet) : 1,
                    diff: number,
                    precision: number,
                    multiple: number;

                if (isNaN(num)) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('number'));
                }

                if (isNaN(significance)) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('significance'));
                }

                if (num > 0 && significance < 0) {
                    throw new NumericError(_ErrorMessages.InvalidParameter('significance'));
                }

                if (num === 0 || significance === 0) {
                    return 0;
                }

                diff = significance - Math.floor(significance);
                precision = 1;
                if (diff !== 0) {
                    while (diff < 1) {
                        precision *= 10;
                        diff *= 10;
                    }
                }
                if (val === 'ceiling') {
                    multiple = Math.ceil(num / significance);
                } else {
                    multiple = Math.floor(num / significance);
                }

                return significance * precision * multiple / precision;
            }, 2, 1);
        });

        roundFuncs.forEach((val) => {
            self._functionTable[val] = new _FunctionDefinition((params, sheet?: Sheet) => {
                var num = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                    precision = _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet),
                    result: number,
                    format: string,
                    multiple: number,
                    offset: number;

                if (precision === 0) {
                    switch (val) {
                        case 'rounddown':
                            if (num >= 0) {
                                result = Math.floor(num);
                            } else {
                                result = Math.ceil(num);
                            }
                            break;
                        case 'roundup':
                            if (num >= 0) {
                                result = Math.ceil(num);
                            } else {
                                result = Math.floor(num);
                            }
                            break;
                        case 'round':
                            offset = num >= 0 ? 0 : 1 / 10;
                            result = Math.round(num - offset);
                            break;
                        default:
                            result = Math.floor(num);
                            break;
                    }
                    format = 'n0';
                } else {
                    precision = precision > 0 ? Math.floor(precision) : Math.ceil(precision);
                    multiple = Math.pow(10, precision);
                    switch (val) {
                        case 'rounddown':
                            if (num >= 0) {
                                result = Math.floor(num * multiple) / multiple;
                            } else {
                                result = Math.ceil(num * multiple) / multiple;
                            }
                            break;
                        case 'roundup':
                            if (num >= 0) {
                                result = Math.ceil(num * multiple) / multiple;
                            } else {
                                result = Math.floor(num * multiple) / multiple;
                            }
                            break;
                        case 'round':
                            offset = num >= 0 ? 0 : 1 * multiple / 10;
                            result = Math.round(num * multiple - offset) / multiple;
                            break;
                    }
                    format = 'n' + (precision > 0 ? precision : 0);
                }

                if (result != null) {
                    return {
                        value: result,
                        format: format
                    };
                }
            }, 2, 2);
        });

        unaryFuncs.forEach((val) => {
            self._functionTable[val] = new _FunctionDefinition((params, sheet?: Sheet) => {
                if (val === 'ln') {
                    return Math.log(_Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet));
                } else {
                    return Math[val](_Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet));
                }
            }, 1, 1);
        });
    }

    // Register the logical function for the calcEngine.
    private _registerLogicalFunction() {
        // and(true,true,false,...)
        var self = this;
        self._functionTable['and'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var result: boolean = true,
                index: number;
            for (index = 0; index < params.length; index++) {
                result = result && _Expression.toBoolean(params[index], self._rowIndex, self._columnIndex, sheet);
                if (!result) {
                    break;
                }
            }
            return result;
        }, Number.MAX_VALUE, 1);

        // or(false,true,true,...)
        self._functionTable['or'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var result: boolean = false,
                index: number;
            for (index = 0; index < params.length; index++) {
                result = result || _Expression.toBoolean(params[index], self._rowIndex, self._columnIndex, sheet);
                if (result) {
                    break;
                }
            }
            return result;
        }, Number.MAX_VALUE, 1);

        // not(false)
        self._functionTable['not'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return !_Expression.toBoolean(params[0], self._rowIndex, self._columnIndex, sheet);
        }, 1, 1);

        // if(true,a,b)
        self._functionTable['if'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            if (params.length === 3) {
                return _Expression.toBoolean(params[0], self._rowIndex, self._columnIndex, sheet) ? params[1].evaluate(self._rowIndex, self._columnIndex, sheet) : params[2].evaluate(self._rowIndex, self._columnIndex, sheet);
            } else {
                return _Expression.toBoolean(params[0], self._rowIndex, self._columnIndex, sheet) ? params[1].evaluate(self._rowIndex, self._columnIndex, sheet) : false;
            }
        }, 3, 2);

        // true()
        self._functionTable['true'] = new _FunctionDefinition(() => {
            return true;
        }, 0, 0);

        // false()
        self._functionTable['false'] = new _FunctionDefinition(() => {
            return false;
        }, 0, 0);
    }

    // register the text process function
    private _registerTextFunction() {
        // char(65, 66, 67,...) => "abc"
        var self = this;
        self._functionTable['char'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var index: number,
                result: string = '';

            for (index = 0; index < params.length; index++) {
                result += String.fromCharCode(_Expression.toNumber(params[index], self._rowIndex, self._columnIndex, sheet));
            }
            return result;
        }, Number.MAX_VALUE, 1);

        // code("A")
        self._functionTable['code'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str && str.length > 0) {
                return str.charCodeAt(0);
            }

            return -1;
        }, 1, 1);

        // concatenate("abc","def","ghi",...) => "abcdefghi"
        self._functionTable['concatenate'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var index: number,
                result: string = '';

            for (index = 0; index < params.length; index++) {
                result = result.concat(_Expression.toString(params[index], self._rowIndex, self._columnIndex, sheet));
            }
            return result;
        }, Number.MAX_VALUE, 1);

        // left("Abcdefgh", 5) => "Abcde"
        self._functionTable['left'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                length = params[1] == null ? 1 : Math.floor(_Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet));

            if (str && str.length > 0) {
                return str.slice(0, length);
            }

            return null;
        }, 2, 1);

        // right("Abcdefgh", 5) => "defgh"
        self._functionTable['right'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                length = params[1] == null ? 1 : Math.floor(_Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet));

            if (str && str.length > 0) {
                if (!length) {
                    return ''; // The same as the left("smth", 0)
                }

                return str.slice(-length);
            }

            return null;
        }, 2, 1);

        // find("abc", "abcdefgh") 
        // this function is case-sensitive.
        self._functionTable['find'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var search = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                text = _Expression.toString(params[1], self._rowIndex, self._columnIndex, sheet),
                startIndex = params[2] != null ? wijmo.asInt(_Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet)) : 0,
                result: number;

            if (text != null && search != null) {
                if (!isNaN(startIndex) && startIndex > 0 && startIndex <= text.length) { // startIndex is 1-based
                    result = text.indexOf(search, startIndex - 1);
                } else {
                    result = text.indexOf(search);
                }
                if (result > -1) {
                    return result + 1;
                }
            }

            return -1;
        }, 3, 2);

        // search("abc", "ABCDEFGH") 
        // this function is not case-sensitive.
        self._functionTable['search'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var search = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                text = _Expression.toString(params[1], self._rowIndex, self._columnIndex, sheet),
                startIndex = params[2] != null ? wijmo.asInt(_Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet)) : 0,
                adjustNum: number,
                searchRegExp: RegExp,
                result: number;

            if (text != null && search != null) {
                searchRegExp = new RegExp(search, 'i');
                if (!isNaN(startIndex) && startIndex > 0 && startIndex < text.length) { // startIndex is 1-based
                    text = text.substring(startIndex - 1);
                    adjustNum = startIndex;
                } else {
                    adjustNum = 1;
                }
                result = text.search(searchRegExp);
                if (result > -1) {
                    return result + adjustNum;
                }
            }

            return -1;
        }, 3, 2);

        // len("abcdefgh")
        self._functionTable['len'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str != null) {
                return str.length;
            }

            return -1;
        }, 1, 1);

        //  mid("abcdefgh", 2, 3) => "bcd"
        self._functionTable['mid'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var text = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                start = Math.floor(_Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet)),
                length = Math.floor(_Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet));

            if (text && text.length > 0 && start > 0) {
                return text.substr(start - 1, length);
            }

            return null;
        }, 3, 3);

        // lower("ABCDEFGH")
        self._functionTable['lower'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str && str.length > 0) {
                return str.toLowerCase();
            }

            return null;
        }, 1, 1);

        // upper("abcdefgh")
        self._functionTable['upper'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str && str.length > 0) {
                return str.toUpperCase();
            }

            return null;
        }, 1, 1);

        // proper("aB1cD  EF.gh\ij") => "Ab1Cd  Ef.Gh\Ij"
        self._functionTable['proper'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str && str.length > 0) {
                str = str.toLowerCase();

                str = str[0].toUpperCase() + str.substring(1); // capitalize the first letter.

                for (var i = 1; i < str.length; i++) {
                    if (rgLetter.test(str[i]) && !rgLetter.test(str[i - 1])) { // if a non-letter character preceeds a letter character
                        str = str.substr(0, i) + str[i].toUpperCase() + str.substring(i + 1); // capitalize the letter character
                        i++;
                    }
                }

                return str;
            }

            return null;
        }, 1, 1);

        // trim("   abcd   efgh   ") => "abcd efgh"
        self._functionTable['trim'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var str = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet);

            if (str && str.length > 0) {
                return str.trim().replace(/\s+/gm, ' ');
            }

            return null;
        }, 1, 1);

        // replace("abcdefg", 2, 3, "xyz") => "axyzefg"
        self._functionTable['replace'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var text = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                start = Math.floor(_Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet)),
                length = Math.floor(_Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet)),
                replaceText = _Expression.toString(params[3], self._rowIndex, self._columnIndex, sheet);

            if (text && text.length > 0 && start > 0) {
                return text.substring(0, start - 1) + replaceText + text.slice(start - 1 + length);
            }

            return null;
        }, 4, 4);

        // substitute("abcabcdabcdefgh", "ab", "xy") => "xycxycdxycdefg"
        self._functionTable['substitute'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var text = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                oldText = _Expression.toString(params[1], self._rowIndex, self._columnIndex, sheet),
                newText = _Expression.toString(params[2], self._rowIndex, self._columnIndex, sheet),
                instanceNum = params.length === 4 ? _Expression.toNumber(params[3], self._rowIndex, self._columnIndex, sheet) : null,
                replaceCnt = 0,
                searhRegExp: RegExp;

            if ((instanceNum != null && instanceNum < 1) || isNaN(instanceNum)) {
                throw new ValueError(_ErrorMessages.InvalidParameter('instance_num'));
            }

            if (text && text.length > 0 && oldText && oldText.length > 0) {
                searhRegExp = new RegExp(oldText, 'g');
                return text.replace(searhRegExp, (text: string) => {
                    replaceCnt++;
                    if (instanceNum != null) {
                        instanceNum = Math.floor(instanceNum);
                        if (replaceCnt === instanceNum) {
                            return newText;
                        } else {
                            return text
                        }
                    }
                    return newText;
                });
            }

            return null;
        }, 4, 3);

        // rept("abc", 3) => "abcabcabc"
        self._functionTable['rept'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var text = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                repeatTimes = Math.floor(_Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet)),
                result = '',
                i: number;

            if (text && text.length > 0 && repeatTimes > 0) {
                for (i = 0; i < repeatTimes; i++) {
                    result = result.concat(text);
                }
            }

            return result;
        }, 2, 2);

        // text("1234", "n2") => "1234.00"
        self._functionTable['text'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var value = params[0].evaluate(self._rowIndex, self._columnIndex, sheet),
                format = _Expression.toString(params[1], self._rowIndex, self._columnIndex, sheet),
                matches: RegExpMatchArray;

            if (!wijmo.isPrimitive(value) && value) {
                value = value.value;
            }

            if (wijmo.isDate(value)) {
                format = wijmo.xlsx.Workbook._fromXlsxDateFormat(format);
            } else {
                let numVal = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet);

                if (wijmo.isNumber(numVal) && !isNaN(numVal)) {
                    matches = format.match(/^(\d+)(\.\d+)?\E\+(\d+)(\.\d+)?$/);
                    if (matches && matches.length === 5) {
                        return self._parseToScientificValue(numVal, matches[1], matches[2], matches[3], matches[4]);
                    } else if (/M{1,4}|d{1,4}|y{1,4}/i.test(format)) {
                        format = wijmo.xlsx.Workbook._fromXlsxDateFormat(format);
                        value = FlexSheet._fromOADate(numVal);
                    } else if (!!format && !/[ncpfdg]\d?/i.test(format)) {
                        format = wijmo.xlsx.Workbook.fromXlsxFormat(format)[0];
                    }
                } else {
                    return value;
                }
            }

            if (wijmo.isDate(value)) {
                switch (format) {
                    case 'd':
                        return (<Date>value).getDate();
                    case 'M':
                        return (<Date>value).getMonth() + 1;
                    case 'y':
                        format = 'yy';
                        break;
                    case 'yyy':
                        format = 'yyyy';
                        break;
                }
            }

            return wijmo.Globalize.format(value, format);
        }, 2, 2);

        // value("1234") => 1234
        self._functionTable['value'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var strVal = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                val: number;

            strVal = strVal.replace(/(\,\d{3})/g, (text: string) => {
                return text.substring(1)
            });
            if (strVal.length > 0) {
                if (strVal[0] === wijmo.culture.Globalize.numberFormat.currency.symbol) {
                    strVal = strVal.substring(1);
                    return +strVal;
                }
                if (strVal[strVal.length - 1] === '%') {
                    strVal = strVal.substring(0, strVal.length - 1);
                    return +strVal / 100;
                }
            }
            val = +strVal;
            return isNaN(val) ? _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet) : val;
        }, 1, 1);

        self._functionTable['exact'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            let p1 = _Expression.toString(params[0], self._rowIndex, self._columnIndex, sheet),
                p2 = _Expression.toString(params[1], self._rowIndex, self._columnIndex, sheet);

            return p1 == p2;
        }, 2, 2);
    }

    // Register the datetime function for the calcEngine.
    private _registerDateFunction() {
        var self = this;
        self._functionTable['now'] = new _FunctionDefinition(() => {
            return {
                value: new Date(),
                format: 'M/d/yyyy h:mm'
            };
        }, 0, 0);

        self._functionTable['today'] = new _FunctionDefinition(() => {
            var now = new Date();
            return {
                value: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                format: 'M/d/yyyy'
            };
        }, 0, 0);

        // year("11/25/2015") => 2015
        self._functionTable['year'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var date = _Expression.toDate(params[0], self._rowIndex, self._columnIndex, sheet);
            if (!wijmo.isPrimitive(date) && date) {
                return date.value;
            }
            if (wijmo.isDate(date)) {
                return date.getFullYear();
            }
            return 1900;
        }, 1, 1);

        // month("11/25/2015") => 11
        self._functionTable['month'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var date = _Expression.toDate(params[0], self._rowIndex, self._columnIndex, sheet);
            if (!wijmo.isPrimitive(date) && date) {
                return date.value;
            }
            if (wijmo.isDate(date)) {
                return date.getMonth() + 1;
            }
            return 1;
        }, 1, 1);

        // day("11/25/2015") => 25
        self._functionTable['day'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var date = _Expression.toDate(params[0], self._rowIndex, self._columnIndex, sheet);
            if (!wijmo.isPrimitive(date) && date) {
                return date.value;
            }
            if (wijmo.isDate(date)) {
                return date.getDate();
            }
            return 0;
        }, 1, 1);

        // hour("11/25/2015 16:50") => 16 or hour(0.5) => 12
        self._functionTable['hour'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var val = params[0].evaluate(self._rowIndex, self._columnIndex, sheet);
            if (wijmo.isNumber(val) && !isNaN(val)) {
                return Math.floor(24 * (val - Math.floor(val)));
            } else if (wijmo.isDate(val)) {
                return val.getHours();
            }

            val = _Expression.toDate(params[0], self._rowIndex, self._columnIndex, sheet);
            if (!wijmo.isPrimitive(val) && val) {
                val = val.value;
            }

            if (wijmo.isDate(val)) {
                return val.getHours();
            }

            throw new ValueError(_ErrorMessages.InvalidParameter('serial_number'));
        }, 1, 1);

        // time(10, 23, 11) => 10:23:11 AM
        self._functionTable['time'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var hour = params[0].evaluate(self._rowIndex, self._columnIndex, sheet),
                minute = params[1].evaluate(self._rowIndex, self._columnIndex, sheet),
                second = params[2].evaluate(self._rowIndex, self._columnIndex, sheet);

            if (wijmo.isNumber(hour) && wijmo.isNumber(minute) && wijmo.isNumber(second)) {
                hour %= 24;
                minute %= 60;
                second %= 60;

                return {
                    value: new Date(0, 0, 0, hour, minute, second),
                    format: 'h:mm tt'
                };
            }

            throw new ValueError(_ErrorMessages.InvalidParameters);
        }, 3, 3);

        // time(2015, 11, 25) => 11/25/2015
        self._functionTable['date'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var year = params[0].evaluate(self._rowIndex, self._columnIndex, sheet),
                month = params[1].evaluate(self._rowIndex, self._columnIndex, sheet),
                day = params[2].evaluate(self._rowIndex, self._columnIndex, sheet);

            if (wijmo.isNumber(year) && wijmo.isNumber(month) && wijmo.isNumber(day)) {
                return {
                    value: new Date(year, month - 1, day),
                    format: 'M/d/yyyy'
                };
            }

            throw new ValueError(_ErrorMessages.InvalidParameters);
        }, 3, 3);

        self._functionTable['datedif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var startDate = _Expression.toDate(params[0], self._rowIndex, self._columnIndex, sheet),
                endDate = _Expression.toDate(params[1], self._rowIndex, self._columnIndex, sheet),
                unit = params[2].evaluate(self._rowIndex, self._columnIndex, sheet),
                startDateTime: number,
                endDateTime: number,
                diffDays: number,
                diffMonths: number,
                diffYears: number;

            if (!wijmo.isPrimitive(startDate) && startDate) {
                startDate = startDate.value;
            }

            if (!wijmo.isPrimitive(endDate) && endDate) {
                endDate = endDate.value;
            }

            if (wijmo.isDate(startDate) && wijmo.isDate(endDate) && wijmo.isString(unit)) {
                startDateTime = startDate.getTime();
                endDateTime = endDate.getTime();

                if (startDateTime > endDateTime) {
                    throw new NumericError(_ErrorMessages.InvalidParameter('start_date'));
                }

                diffDays = endDate.getDate() - startDate.getDate();
                diffMonths = endDate.getMonth() - startDate.getMonth();
                diffYears = endDate.getFullYear() - startDate.getFullYear();

                switch (unit.toUpperCase()) {
                    case 'Y':
                        if (diffMonths > 0) {
                            return diffYears;
                        } else if (diffMonths < 0) {
                            return diffYears - 1;
                        } else {
                            if (diffDays >= 0) {
                                return diffYears;
                            } else {
                                return diffYears - 1;
                            }
                        }
                    case 'M':
                        if (diffDays >= 0) {
                            return diffYears * 12 + diffMonths;
                        } else {
                            return diffYears * 12 + diffMonths - 1;
                        }
                    case 'D':
                        return (endDateTime - startDateTime) / (1000 * 3600 * 24);
                    case 'YM':
                        if (diffDays >= 0) {
                            diffMonths = diffYears * 12 + diffMonths;
                        } else {
                            diffMonths = diffYears * 12 + diffMonths - 1;
                        }
                        return diffMonths % 12;
                    case 'YD':
                        if (diffMonths > 0) {
                            return (new Date(startDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                        } else if (diffMonths < 0) {
                            return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                        } else {
                            if (diffDays >= 0) {
                                return diffDays;
                            } else {
                                return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                            }
                        }
                    case 'MD':
                        if (diffDays >= 0) {
                            return diffDays;
                        } else {
                            diffDays = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate() - new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1).getDate() + 1 + diffDays;
                            return diffDays;
                        }
                    default:
                        throw new NumericError(_ErrorMessages.InvalidParameter('unit'));
                }
            }

            throw new ValueError(_ErrorMessages.InvalidParameters);
        }, 3, 3);
    }

    // Register the cell reference and look up related functions for the calcEngine.
    private _registLookUpReferenceFunction() {
        var self = this;

        self._functionTable['column'] = new _FunctionDefinition((params, sheet?: Sheet, rowIndex?: number, columnIndex?: number) => {
            var cellExpr: _Expression;
            if (params == null) {
                return columnIndex + 1;
            }

            cellExpr = params[0];
            cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                return (<_CellRangeExpression>cellExpr).cells.col + 1;
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 1, 0);

        self._functionTable['columns'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var cellExpr = params[0];

            cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                return (<_CellRangeExpression>cellExpr).cells.columnSpan;
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 1, 1);

        self._functionTable['row'] = new _FunctionDefinition((params, sheet?: Sheet, rowIndex?: number, columnIndex?: number) => {
            var cellExpr: _Expression;
            if (params == null) {
                return rowIndex + 1;
            }

            cellExpr = params[0];
            cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                return (<_CellRangeExpression>cellExpr).cells.row + 1;
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 1, 0);

        self._functionTable['rows'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var cellExpr = params[0];

            cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                return (<_CellRangeExpression>cellExpr).cells.rowSpan;
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 1, 1);

        self._functionTable['choose'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var index = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet);

            if (isNaN(index)) {
                throw new ValueError(_ErrorMessages.InvalidParameter('index_num'));
            }

            if (index < 1 || index >= params.length) {
                throw new ValueError(_ErrorMessages.ParameterIsOutOfRange('index_num'));
            }

            index = Math.floor(index);

            return params[index].evaluate(self._rowIndex, self._columnIndex, sheet);
        }, 255, 2);

        self._functionTable['index'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var cellExpr = params[0],
                cells: wijmo.grid.CellRange,
                rowNum = _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet),
                colNum = params[2] != null ? _Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet) : 0;

            if (isNaN(rowNum) || rowNum < 0) {
                throw new ValueError(_ErrorMessages.InvalidParameter('row_num'));
            }
            if (isNaN(colNum) || colNum < 0) {
                throw new ValueError(_ErrorMessages.InvalidParameter('column_num'));
            }

            cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                cells = (<_CellRangeExpression>cellExpr).cells;
                if (rowNum > cells.rowSpan) {
                    throw new ReferenceError(_ErrorMessages.ParameterIsOutOfRange('row_num'));
                }
                if (colNum > cells.columnSpan) {
                    throw new ReferenceError(_ErrorMessages.ParameterIsOutOfRange('column_num'));
                }
                if (rowNum > 0 && colNum > 0) {
                    return self._owner.getCellValue(cells.topRow + rowNum - 1, cells.leftCol + colNum - 1, true, sheet);
                }
                if (rowNum === 0 && colNum === 0) {
                    return cellExpr;
                }
                if (rowNum === 0) {
                    return new _CellRangeExpression(new wijmo.grid.CellRange(cells.topRow, cells.leftCol + colNum - 1, cells.bottomRow, cells.leftCol + colNum - 1), (<_CellRangeExpression>cellExpr).sheetRef, self._owner);
                }
                if (colNum === 0) {
                    return new _CellRangeExpression(new wijmo.grid.CellRange(cells.topRow + rowNum - 1, cells.leftCol, cells.topRow + rowNum - 1, cells.rightCol), (<_CellRangeExpression>cellExpr).sheetRef, self._owner);
                }
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 4, 2);

        self._functionTable['hlookup'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._handleHLookup(params, sheet);
        }, 4, 3);

        self._functionTable['vlookup'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return self._handleVLookup(params, sheet);
        }, 4, 3);
    }

    // Register the finacial function for the calcEngine.
    private _registFinacialFunction() {
        var self = this;

        self._functionTable['rate'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var rate = self._calculateRate(params, sheet);

            return {
                value: rate,
                format: 'p2'
            };
        }, 6, 3);
    }

    // Register the adress related function for the calcEngine.
    private _registAddressRelatedFunction() {
        let self = this;

        self._functionTable['indirect'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            let param = self._ensureNonFunctionExpression(<_Expression>params[0], sheet),
                paramCell: wijmo.grid.CellRange,
                paramValue: any,
                definedNameRefs: string[],
                sheetRef: string,
                definedNameRef: string,
                targetRange: _ICellReferrence,
                targetSheet: Sheet;

            if (param instanceof _CellRangeExpression) {
                paramCell = (<_CellRangeExpression>param).cells;
                paramValue = param.evaluate(paramCell.row, paramCell.col, sheet);
            } else {
                paramValue = param.evaluate(self._rowIndex, self._columnIndex, sheet);
            }
            if (wijmo.isString(paramValue)) {
                // first look for defined name
                definedNameRefs = paramValue.split('!');
                if (definedNameRefs.length === 2) {
                    sheetRef = definedNameRefs[0].toLowerCase();
                    definedNameRef = definedNameRefs[1].toLowerCase();
                } else {
                    definedNameRef = definedNameRefs[0].toLowerCase();
                }
                let definedName = self._getDefinedName(definedNameRef, sheetRef || self._sheet.name);
                sheet = sheet || self._owner.selectedSheet;
                if (definedName) {
                    if (definedName.sheetName && (definedName.sheetName.toLowerCase() !== sheet.name.toLowerCase())) {
                        throw new ReferenceError(_ErrorMessages.InvalidCellRef);
                    }
                    paramValue = definedName.value;
                }
                // look for Cell Range.
                targetRange = self._getCellRange(paramValue);
                if (targetRange) {
                    if (targetRange.sheetRef) {
                        for (let i = 0; i < self._owner.sheets.length; i++) {
                            if (self._owner.sheets[i].name.toLowerCase() === targetRange.sheetRef.toLowerCase()) {
                                targetSheet = self._owner.sheets[i];
                                break;
                            }
                        }
                    } else {
                        targetSheet = self._owner.selectedSheet;
                    }
                    if (targetSheet) {
                        return self._owner.getCellValue(targetRange.cellRef.cellRange.row, targetRange.cellRef.cellRange.col, true, sheet);
                    }
                }
            }
            throw new SyntaxError(_ErrorMessages.InvalidCellRef);
        }, 2, 1);

        self._functionTable['address'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            let rowNum = _Expression.toNumber(params[0], self._rowIndex, self._columnIndex, sheet),
                colNum = _Expression.toNumber(params[1], self._rowIndex, self._columnIndex, sheet),
                absRow = false,
                absCol = false,
                absNum: number,
                sheetName: string;

            if (isNaN(rowNum) || !wijmo.isInt(rowNum) || rowNum < 1 || rowNum > 1048576) {
                throw new ValueError(_ErrorMessages.InvalidParameter('row_num'));
            }
            if (isNaN(colNum) || !wijmo.isInt(colNum) || colNum < 1 || colNum > 16384) {
                throw new ValueError(_ErrorMessages.InvalidParameter('column_num'));
            }
            if (params[2] != null) {
                absNum = _Expression.toNumber(params[2], self._rowIndex, self._columnIndex, sheet);
                if (isNaN(absNum) || !wijmo.isInt(absNum) || absNum < 1 || absNum > 4) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('abs_num'));
                }
            }
            if (params[4] != null) {
                sheetName = _Expression.toString(params[4], self._rowIndex, self._columnIndex, sheet);
            }
            if (absNum == null || absNum === 1) {
                absRow = true;
                absCol = true;
            } else if (absNum === 2) {
                absRow = true;
            } else if (absNum === 3) {
                absCol = true;
            }
            return (sheetName != null ? sheetName + '!' : '') + (absCol ? '$' : '') + self._numAlpha(colNum) + (absRow ? '$' : '') + rowNum.toString();
        }, 5, 2);
    }

    private _registerErrorFunctions() {
        var isError = (param: _Expression, sheet?: Sheet) => {
            var val;

            try {
                val = param.evaluate(this._rowIndex, this._columnIndex, sheet);
            } catch (e) {
                if (e instanceof FormulaError) {
                    val = e;
                }
            }

            return val;
        };

        this._functionTable['iserror'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            return isError(params[0], sheet) instanceof FormulaError;
        }, 1, 1);

        this._functionTable['iserr'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var val = isError(params[0], sheet);
            return val instanceof FormulaError && !(val instanceof NotAvailableError);
        }, 1, 1);

        this._functionTable['iferror'] = new _FunctionDefinition((params, sheet?: Sheet) => {
            var val = isError(params[0], sheet);
            return val instanceof FormulaError ? (<_Expression>params[1]).evaluate(this._rowIndex, this._columnIndex, sheet) : val;
        }, 2, 2);
    }

    // Add token into the static token table.
    private _addToken(symbol: any, id: _TokenID, type: _TokenType) {
        var token = new _Token(symbol, id, type);
        this._tokenTable[symbol] = token;
    }

    // Parse expression
    private _parseExpression(): _Expression {
        this._getToken();
        return this._parseCompareOrConcat();
    }

    // Parse compare expression
    private _parseCompareOrConcat(): _Expression {
        var x = this._parseAddSub(),
            t: _Token,
            exprArg: _Expression;

        while (this._token.tokenType === _TokenType.COMPARE || this._token.tokenType === _TokenType.CONCAT) {
            t = this._token;
            this._getToken();
            exprArg = this._parseAddSub();
            x = new _BinaryExpression(t, x, exprArg);
        }

        return x;
    }

    // Parse add/sub expression.
    private _parseAddSub(): _Expression {
        var x = this._parseMulDiv(),
            t: _Token,
            exprArg: _Expression;

        while (this._token.tokenType === _TokenType.ADDSUB) {
            t = this._token;
            this._getToken();
            exprArg = this._parseMulDiv();
            x = new _BinaryExpression(t, x, exprArg);
        }

        return x;
    }

    // Parse multiple/division expression.
    private _parseMulDiv(): _Expression {
        var x = this._parsePower(),
            t: _Token,
            exprArg: _Expression;

        while (this._token.tokenType === _TokenType.MULDIV) {
            t = this._token;
            this._getToken();
            exprArg = this._parsePower();
            x = new _BinaryExpression(t, x, exprArg);
        }

        return x;
    }

    // Parse power expression.
    private _parsePower(): _Expression {
        var x = this._parseUnary(),
            t: _Token,
            exprArg: _Expression;

        while (this._token.tokenType === _TokenType.POWER) {
            t = this._token;
            this._getToken();
            exprArg = this._parseUnary();
            x = new _BinaryExpression(t, x, exprArg);
        }

        return x;
    }

    // Parse unary expression
    private _parseUnary(): _Expression {
        var t: _Token,
            exprArg: _Expression;

        // unary plus and minus
        if (this._token.tokenID === _TokenID.ADD || this._token.tokenID === _TokenID.SUB) {
            t = this._token;
            this._getToken();
            exprArg = this._parseAtom();
            return new _UnaryExpression(t, exprArg);
        }

        // not unary, return atom
        return this._parseAtom();
    }

    // Parse atomic expression
    private _parseAtom(): _Expression {
        var x: _Expression = null,
            funcDefinition: _FunctionDefinition,
            params: Array<_Expression>,
            pCnt: number,
            range: _ICellReferrence,
            orgExpression: string,
            orgExpressionLength: number,
            orgPointer: number,
            definedNameRefs: string[],
            definedNameRef: string,
            sheetRef: string,
            table: Table,
            tokenType = this._token.tokenType;

        switch (tokenType) {
            // literals
            case _TokenType.LITERAL:
                x = new _Expression(this._token);
                break;
            case _TokenType.ERROR:
                x = new _Expression(this._token);
                break;
            // identifiers
            case _TokenType.IDENTIFIER:
                // get identifier
                let id = this._token.value.toString(),
                    idLc = id.toLowerCase();

                funcDefinition = this._functionTable[idLc];

                // look for functions
                if (funcDefinition) {
                    params = this._getParameters();
                    if (this._token.tokenType === _TokenType.GROUP && this._token.tokenID === _TokenID.CLOSE) {
                        pCnt = params ? params.length : 0;
                        if (funcDefinition.paramMin !== -1 && pCnt < funcDefinition.paramMin) {
                            throw new SyntaxError(_ErrorMessages.TooFewParameters);
                        }
                        if (funcDefinition.paramMax !== -1 && pCnt > funcDefinition.paramMax) {
                            throw new SyntaxError(_ErrorMessages.TooManyParameters);
                        }
                        if (idLc === 'rand' || ((idLc === 'column' || idLc === 'row') && pCnt === 0)) {
                            this._containsCellRef = true; // don't cache 
                        }
                        x = new _FunctionExpression(idLc, funcDefinition, params);
                        break;
                    } else if (idLc === 'true' || idLc === 'false') {
                        x = new _FunctionExpression(idLc, funcDefinition, params, false);
                        break;
                    }
                }

                // look for defined name
                definedNameRefs = idLc.split('!');
                if (definedNameRefs.length === 2) {
                    sheetRef = definedNameRefs[0];
                    definedNameRef = definedNameRefs[1];
                } else {
                    definedNameRef = definedNameRefs[0];
                }
                let definedName = this._getDefinedName(definedNameRef, sheetRef || this._sheet.name);
                if (definedName) {
                    if (!definedName.sheetName || definedName.sheetName.toLowerCase() === this._sheet.name.toLowerCase() || definedName.sheetName.toLowerCase() === sheetRef) {
                        orgPointer = this._pointer;
                        orgExpressionLength = this._expressLength;
                        orgExpression = this._expression;
                        this._pointer = 0;
                        x = this._checkCache(definedName.value);
                        this._pointer = orgPointer;
                        this._expressLength = orgExpressionLength;
                        this._expression = orgExpression;
                        break;
                    } else {
                        throw new NameError(_ErrorMessages.DefNameInvalidSheet(definedName.sheetName));
                    }
                }
                sheetRef = '';

                table = this._owner._getTable(idLc);
                if (table != null) {
                    sheetRef = table.sheet.name;
                    if (sheetRef === '') {
                        throw new NameError(_ErrorMessages.InvalidTable(idLc));
                    }
                    this._getToken();
                    if (this._token.tokenType === _TokenType.SQUAREBRACKETS && this._token.tokenID === _TokenID.OPEN) {
                        this._tableRefStart = true;
                        x = this._getTableReference(table, sheetRef);
                    } else {
                        throw new SyntaxError(_ErrorMessages.InvalidTableRef);
                    }
                    break;
                }

                // look for Cell Range.
                range = this._getCellRange(id);
                if (range) {
                    this._containsCellRef = true;
                    x = new _CellRangeExpression(range.cellRef.cellRange, range.sheetRef, this._owner, id.indexOf(':') > -1, range.cellRef.absRow, range.cellRef.absCol, range.cellRef.absRow2, range.cellRef.absCol2, range.isWholeRow);
                    break;
                }

                // trigger the unknownFunction event.
                params = this._getParameters();
                x = this.onUnknownFunction(idLc, params);

                break;
            // sub-expressions
            case _TokenType.GROUP:
                // anything other than opening parenthesis is illegal here
                if (this._token.tokenID !== _TokenID.OPEN) {
                    throw new SyntaxError(_ErrorMessages.ExpressionExpected);
                }

                // get expression
                this._getToken();
                x = this._parseCompareOrConcat();

                // check that the parenthesis was closed
                if (this._token.tokenID !== <_TokenID>_TokenID.CLOSE) {
                    throw new SyntaxError(_ErrorMessages.UnbalancedParenthesis);
                }
                x._inGroup = true;

                break;
            case _TokenType.SQUAREBRACKETS:
                if (this._token.tokenID !== _TokenID.OPEN) {
                    throw new ValueError(_ErrorMessages.TableReferencesExpected);
                }
                table = this._sheet.findTable(this._rowIndex, this._columnIndex);
                if (table != null) {
                    sheetRef = table.sheet.name;
                    this._tableRefStart = true;
                    x = this._getTableReference(table, sheetRef, false);
                }
                break;
        }

        // make sure we got something...
        if (x === null) {
            throw new SyntaxError(_ErrorMessages.BadExpression);
        }

        // done
        this._getToken();
        return x;
    }

    // Get token for the expression.
    private _getToken() {
        var i: number,
            c: string,
            lastChar: string,
            lastPointer: number,
            isLetter: boolean,
            isDigit: boolean,
            id = '',
            sheetRef = '',
            // About the Japanese characters checking
            // Please refer http://stackoverflow.com/questions/15033196/using-javascript-to-check-whether-a-string-contains-japanese-characters-includi
            // And http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
            japaneseRegExp = new RegExp('[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]');

        // eat white space 
        while (this._pointer < this._expressLength && this._expression[this._pointer] === ' ') {
            this._pointer++;
        }

        // are we done?
        if (this._pointer >= this._expressLength) {
            this._token = new _Token(null, _TokenID.END, _TokenType.GROUP);
            return;
        }

        // prepare to parse
        c = this._expression[this._pointer];

        // operators
        // this gets called a lot, so it's pretty optimized.
        // note that operators must start with non-letter/digit characters.
        isLetter = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || japaneseRegExp.test(c);
        isDigit = (c >= '0' && c <= '9') || c == '.';
        if (!isLetter && !isDigit) {
            var tk = this._tokenTable[c];
            if (tk) {
                // save token we found
                this._token = tk;
                this._pointer++;

                // look for double-char tokens (special case)
                if (this._pointer < this._expressLength && (c === '>' || c === '<')) {
                    tk = this._tokenTable[this._expression.substring(this._pointer - 1, this._pointer + 1)];
                    if (tk) {
                        this._token = tk;
                        this._pointer++;
                    }
                }
                return;
            }
        }

        // parse numbers token
        if (isDigit) {
            lastPointer = this._pointer;
            this._parseDigit();
            if (this._expression[this._pointer] !== ':') {
                return;
            }
            this._pointer = lastPointer;
        }

        // parse strings token
        if (c === '\"') {
            this._parseString();
            return;
        }

        if (c === '\'') {
            sheetRef = this._parseSheetRef();
            if (!sheetRef) {
                return;
            }
        }

        if (c === '#' && this._parseError()) {
            return;
        }

        // parse dates token
        if (c === '#') {
            this._parseDate();
            return;
        }

        // identifiers (functions, objects) must start with alpha or underscore
        if (!isLetter && !isDigit && c !== '_' && this._idChars.indexOf(c) < 0 && !sheetRef) {
            throw new SyntaxError(_ErrorMessages.IdentifierExpected);
        }

        // and must contain only letters/digits/_idChars
        for (i = 1; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];
            isLetter = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || japaneseRegExp.test(c);
            isDigit = c >= '0' && c <= '9';
            if (c === '\'' && lastChar === ':') {
                id = sheetRef + this._expression.substring(this._pointer, this._pointer + i);
                this._pointer += i;

                sheetRef = this._parseSheetRef();
                i = 0;
                continue;
            }
            lastChar = c;
            if (!isLetter && !isDigit && c !== '_' && this._idChars.indexOf(c) < 0) {
                break;
            }
        }

        // got identifier
        id += sheetRef + this._expression.substring(this._pointer, this._pointer + i);
        this._pointer += i;
        this._token = new _Token(id, _TokenID.ATOM, _TokenType.IDENTIFIER);
    }

    // Get token for the table reference.
    private _getTableToken() {
        var i: number,
            c: string,
            id: string,
            thisRowId = '',
            tableParamStart = false;

        // eat white space 
        while (this._pointer < this._expressLength && this._expression[this._pointer] === ' ') {
            this._pointer++;
        }

        c = this._expression[this._pointer];
        if (c === '@') {
            thisRowId = c;
            this._pointer++;
        }
        c = this._expression[this._pointer];
        if (c === '[') {
            tableParamStart = true;
        }
        for (i = 1; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];
            if ((tableParamStart && c === ',')) {
                throw new SyntaxError(_ErrorMessages.InvalidTableRef);
            }
            if (c === ']') {
                break;
            }
        }
        id = thisRowId + this._expression.substring(this._pointer + (tableParamStart ? 1 : 0), this._pointer + i);
        this._pointer += i + (tableParamStart ? 1 : 0);
        this._token = new _Token(id, _TokenID.ATOM, _TokenType.IDENTIFIER);
    }

    // Parse digit token
    private _parseDigit() {
        var div = -1,
            sci = false,
            pct = false,
            val = 0.0,
            i: number,
            c: string,
            lit: string;

        for (i = 0; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];

            // digits always OK
            if (c >= '0' && c <= '9') {
                val = val * 10 + (+c - 0);
                if (div > -1) {
                    div *= 10;
                }
                continue;
            }

            // one decimal is OK
            if (c === '.' && div < 0) {
                div = 1;
                continue;
            }

            // scientific notation?
            if ((c === 'E' || c === 'e') && !sci) {
                sci = true;
                c = this._expression[this._pointer + i + 1];
                if (c === '+' || c === '-') i++;
                continue;
            }

            // percentage?
            if (c === '%') {
                pct = true;
                i++;
                break;
            }

            // end of literal
            break;
        }

        // end of number, get value
        if (!sci) {
            // much faster than ParseDouble
            if (div > 1) {
                val /= div;
            }
            if (pct) {
                val /= 100.0;
            }
        } else {
            lit = this._expression.substring(this._pointer, this._pointer + i);
            val = +lit;
        }

        // build token
        this._token = new _Token(val, _TokenID.ATOM, _TokenType.LITERAL);

        // advance pointer and return
        this._pointer += i;
    }

    // Parse string token
    private _parseString() {
        var i: number,
            c: string,
            cNext: string,
            lit: string;

        // look for end quote, skip double quotes
        for (i = 1; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];
            if (c !== '\"') {
                continue;
            }
            cNext = i + this._pointer < this._expressLength - 1 ? this._expression[this._pointer + i + 1] : ' ';
            if (cNext !== '\"') {
                break;
            }
            i++;
        }

        // check that we got the end of the string
        if (c !== '\"') {
            throw new SyntaxError(_ErrorMessages.CantFindFinalQuote);
        }

        // end of string
        lit = this._expression.substring(this._pointer + 1, this._pointer + i);
        this._pointer += i + 1;
        if (this._expression[this._pointer] === '!') {
            throw new SyntaxError(_ErrorMessages.IllegalCrossSheetReference);
        }
        this._token = new _Token(lit.replace('\"\"', '\"'), _TokenID.ATOM, _TokenType.LITERAL);
    }

    // Parse datetime token
    private _parseDate() {
        var i: number,
            c: string,
            lit: string;

        // look for end #
        for (i = 1; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];
            if (c === '#') {
                break;
            }
        }

        // check that we got the end of the date
        if (c !== '#') {
            throw new SyntaxError(_ErrorMessages.CantFindFinalDateDelimiter);
        }

        // end of date
        lit = this._expression.substring(this._pointer + 1, this._pointer + i);
        this._pointer += i + 1;
        this._token = new _Token(Date.parse(lit), _TokenID.ATOM, _TokenType.LITERAL);
    }

    // Parses error token and updates this._pointer if succeed.
    private _parseError(): boolean {
        var pnt = this._pointer,
            i: number;

        for (i = pnt + 1; i < this._expressLength; i++) {
            var c = this._expression[i],
                pc = this._expression[i - 1];

            if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                ((c === '0' || c === '?' || c === '!' || c === '/') && ((pc >= 'a' && pc <= 'z') || (pc >= 'A' && pc <= 'Z') || pc === '/' || pc === '0')))) {
                break;
            }
        }

        var tokenLen = i - pnt;
        if (tokenLen > 3) {
            var test = this._expression.substring(pnt, pnt + tokenLen);
            var err = _FormulaErrorHelper.asError(test);
            if (err) {
                this._token = new _Token(err, _TokenID.ATOM, _TokenType.ERROR);
                this._pointer += tokenLen;
                return true;
            }
        }

        return false;
    }

    // Parse the sheet reference.
    private _parseSheetRef(): string {
        var i: number,
            c: string,
            cNext: string,
            lit: string;

        // look for end quote, skip double quotes
        for (i = 1; i + this._pointer < this._expressLength; i++) {
            c = this._expression[this._pointer + i];
            if (c !== '\'') {
                continue;
            }
            cNext = i + this._pointer < this._expressLength - 1 ? this._expression[this._pointer + i + 1] : ' ';
            if (cNext !== '\'') {
                break;
            }
            i++;
        }

        // check that we got the end of the string
        if (c !== '\'') {
            throw new SyntaxError(_ErrorMessages.CantFindFinalQuote);
        }

        // end of string
        lit = this._expression.substring(this._pointer + 1, this._pointer + i);
        this._pointer += i + 1;
        if (this._expression[this._pointer] === '!') {
            return lit.replace(/\'\'/g, '\'');
        } else {
            return '';
        }
    }

    // Gets the cell range by the identifier.
    // For e.g. A1:C3 to cellRange(row=0, col=0, row1=2, col1=2)
    private _getCellRange(identifier: string): _ICellReferrence {
        var cells: string[],
            cell: _ICellReferrence,
            cell2: _ICellReferrence,
            sheetRef: string,
            rng: wijmo.grid.CellRange,
            rng2: wijmo.grid.CellRange;

        if (identifier) {
            cells = identifier.split(':');

            if (cells.length > 0 && cells.length < 3) {
                cell = this._parseCell(cells[0]);
                if (cell.cellRef == null) {
                    return null;
                }
                rng = cell.cellRef.cellRange;

                if (cell.cellRef.isWholeRow != null && cells.length === 1) {
                    return null;
                }

                if (rng && cells.length === 2) {
                    cell2 = this._parseCell(cells[1]);
                    rng2 = cell2.cellRef.cellRange;
                    if (cell.cellRef.isWholeRow != null && cell.cellRef.isWholeRow !== cell2.cellRef.isWholeRow) {
                        return null;
                    }

                    if (cell.sheetRef && !cell2.sheetRef) {
                        cell2.sheetRef = cell.sheetRef;
                    }

                    if (cell.sheetRef !== cell2.sheetRef) {
                        throw new ReferenceError(_ErrorMessages.CellRefMustBeInSameSheet);
                    }

                    if (rng2) {
                        rng.col2 = rng2.col;
                        rng.row2 = rng2.row;
                    } else {
                        rng = null;
                    }
                }
            }
        }

        if (rng == null) {
            return null;
        }

        return {
            cellRef: {
                cellRange: rng,
                absRow: cell.cellRef.absRow,
                absCol: cell.cellRef.absCol,
                absRow2: cell2 ? cell2.cellRef.absRow : null,
                absCol2: cell2 ? cell2.cellRef.absCol : null
            },
            sheetRef: cell.sheetRef,
            isWholeRow: cell.cellRef.isWholeRow
        };
    }

    // Parse the single string cell identifier to cell range;
    // For e.g. A1 to cellRange(row=0, col=0).
    private _parseCellRange(cell: string): _ICellRange {
        var col = -1,
            row = -1,
            absCol = false,
            absRow = false,
            index: number,
            rng: wijmo.grid.CellRange,
            c: string,
            isWholeRow: boolean;

        // parse column
        for (index = 0; index < cell.length; index++) {
            c = cell[index];

            if (c === '$' && !absCol) {
                absCol = true;
                continue;
            }
            if (!(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z')) {
                break;
            }
            if (col < 0) {
                col = 0;
            }
            col = 26 * col + (c.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1);
        }

        // parse row
        for (; index < cell.length; index++) {
            c = cell[index];

            if (c === '$' && !absRow) {
                absRow = true;
                continue;
            }
            if (!(c >= '0' && c <= '9')) {
                break;
            }
            if (row < 0) {
                row = 0;
            }
            row = 10 * row + (+c - 0);
        }

        // sanity
        if (index < cell.length) {
            return null;
        }

        if (row > -1 && col > -1) {
            if (row === 0) { // the row index should start from 1, A0 is invalid.
                throw new NameError(_ErrorMessages.InvalidCellRef); // throw the NameError like Excel does.
            }

            rng = new wijmo.grid.CellRange(row - 1, col - 1);
        } else {
            if (col === -1) {
                isWholeRow = true;
                rng = new wijmo.grid.CellRange(row - 1, 0);
            } else if (row === -1) {
                isWholeRow = false;
                rng = new wijmo.grid.CellRange(0, col - 1);
            }
        }

        // done
        return {
            cellRange: rng,
            absRow: absRow,
            absCol: absCol,
            isWholeRow: isWholeRow
        };
    }

    // Parse the single cell reference string to cell reference object.
    // For e.g. 'sheet1!A1' to { sheetRef: 'sheet1', cellRange: CellRange(row = 0, col = 0)}
    private _parseCell(cell: string): _ICellReferrence {
        var rng: _ICellRange,
            sheetRefIndex: number,
            cellsRef: string,
            sheetRef: string;

        sheetRefIndex = cell.lastIndexOf('!');

        if (sheetRefIndex > 0 && sheetRefIndex < cell.length - 1) {
            sheetRef = cell.substring(0, sheetRefIndex);
            cellsRef = cell.substring(sheetRefIndex + 1);
        } else if (sheetRefIndex <= 0) {
            cellsRef = cell;
        } else {
            return null;
        }

        rng = this._parseCellRange(cellsRef);

        return {
            cellRef: rng,
            sheetRef: sheetRef
        };
    }

    // Gets the parameters for the function.
    // e.g. myfun(a, b, c+2)
    private _getParameters() {
        // check whether next token is a (, 
        // restore state and bail if it's not
        var pos = this._pointer,
            tk = this._token,
            parms: Array<_Expression>,
            expr: _Expression;

        this._getToken();

        if (this._token.tokenType === _TokenType.SQUAREBRACKETS && this._token.tokenID === _TokenID.OPEN) {
            return;
        }

        if (this._token.tokenID !== <_TokenID>_TokenID.OPEN) {
            this._pointer = pos;
            this._token = tk;
            return null;
        }

        // check for empty Parameter list
        pos = this._pointer;
        this._getToken();
        if (this._token.tokenID === <_TokenID>_TokenID.CLOSE) {
            return null;
        }
        this._pointer = pos;

        // get Parameters until we reach the end of the list
        parms = new Array();
        expr = this._parseExpression();
        parms.push(expr);
        while (this._token.tokenID === _TokenID.COMMA) {
            expr = this._parseExpression();
            parms.push(expr);
        }

        // make sure the list was closed correctly
        if (this._token.tokenID !== _TokenID.CLOSE) {
            throw new SyntaxError(_ErrorMessages.SyntaxError);
        }

        // done
        return parms;
    }

    // Get table reference.
    private _getTableReference(table: Table, sheetRef: string, needTableName: boolean = true) {
        var tableParams = [],
            param = this._getTableParameter(),
            isRange = false,
            refRange: wijmo.grid.CellRange,
            rangeExp: _CellRangeExpression;

        if (param == null) {
            throw new SyntaxError(_ErrorMessages.InvalidTableRef);
        }
        tableParams.push(param);
        while (this._tableRefStart && (this._token.tokenID === _TokenID.COMMA || this._token.value === ':')) {
            if (this._token.value === ':') {
                isRange = true;
            }
            param = this._getTableParameter();
            if (param == null) {
                throw new SyntaxError(_ErrorMessages.InvalidTableRef);
            }
            if (isRange) {
                tableParams[tableParams.length - 1] += ':' + param;
                isRange = false;
            } else {
                tableParams.push(param);
            }
        }

        if (this._token.tokenType === _TokenType.SQUAREBRACKETS && this._token.tokenID === _TokenID.CLOSE) {
            this._tableRefStart = false;
        } else {
            throw new SyntaxError(_ErrorMessages.UnbalancedSquareBrackets);
        }

        refRange = this._getTableRange(table, tableParams);
        this._containsCellRef = true;
        rangeExp = new _CellRangeExpression(refRange, sheetRef.toLowerCase(), this._owner);
        rangeExp._tableParams = tableParams;
        if (needTableName) {
            rangeExp._tableName = table.name;
        }

        return rangeExp;
    }

    // Get parameters of the table reference.
    private _getTableParameter() {
        var value: any,
            token: _Token,
            pos = this._pointer;

        // eat white space 
        while (this._pointer < this._expressLength && this._expression[this._pointer] === ' ') {
            this._pointer++;
        }

        if (this._expression[this._pointer] === ']') {
            this._tableRefStart = false;
            return null;
        }

        this._getTableToken();
        value = this._token.value;
        this._getToken();
        return value;
    }

    // Get the range of the table reference.
    private _getTableRange(table: Table, tableRefs: string[]) {
        var ref: string,
            columnExisted: boolean,
            range: wijmo.grid.CellRange,
            tableRange: wijmo.grid.CellRange,
            tmpRange: wijmo.grid.CellRange,
            colRefs: string[];

        for (var i = 0; i < tableRefs.length; i++) {
            if (columnExisted) {
                throw new ValueError(_ErrorMessages.InvalidTableRef);
            }
            ref = tableRefs[i].toLowerCase();
            tmpRange = null;
            if (ref[0] === '#') {
                switch (ref) {
                    case '#all':
                        tmpRange = table.getRange();
                        break;
                    case '#data':
                        tmpRange = table.getRange(TableSection.Data);
                        break;
                    case '#headers':
                        tmpRange = table.getRange(TableSection.Header);
                        break;
                    case '#totals':
                        tmpRange = table.getRange(TableSection.Footer);
                        break;
                    case '#this row':
                        tableRange = table.getRange();
                        if (this._rowIndex >= tableRange.topRow && this._rowIndex <= tableRange.bottomRow) {
                            tmpRange = new wijmo.grid.CellRange(this._rowIndex, tableRange.leftCol, this._rowIndex, tableRange.rightCol);
                        } else {
                            throw new ValueError(_ErrorMessages.RowIsOutOfTableRange(table.name));
                        }
                        break;
                    default:
                        throw new ValueError(_ErrorMessages.InvalidTableRef);
                }
                if (tmpRange == null) {
                    throw new ValueError(_ErrorMessages.InvalidTableRef);
                }
                if (range == null) {
                    range = tmpRange;
                } else {
                    range.row = range.topRow < tmpRange.topRow ? range.topRow : tmpRange.topRow;;
                    range.row2 = range.bottomRow > tmpRange.bottomRow ? range.bottomRow : tmpRange.bottomRow;
                }
            } else {
                columnExisted = true;
                colRefs = ref.split(':');
                for (var j = 0; j < colRefs.length; j++) {
                    if (colRefs.length > 2) {
                        throw new ValueError(_ErrorMessages.InvalidTableColRef);
                    }
                    ref = colRefs[j];
                    if (ref[0] === '@') {
                        tmpRange = table.getRange(TableSection.Data, ref.substring(1));
                        if (tmpRange == null) {
                            throw new ValueError(_ErrorMessages.InvalidTableRef);
                        }
                        if (this._rowIndex >= tmpRange.topRow && this._rowIndex <= tmpRange.bottomRow) {
                            tmpRange.row = this._rowIndex;
                            tmpRange.row2 = this._rowIndex;
                        } else {
                            throw new ValueError(_ErrorMessages.RowIsOutOfTableRange(table.name));
                        }
                    } else {
                        tmpRange = table.getRange(TableSection.Data, ref);
                        if (tmpRange == null) {
                            throw new ValueError(_ErrorMessages.InvalidTableRef);
                        }
                    }
                    if (j === 0) {
                        if (range == null) {
                            range = tmpRange;
                        } else {
                            range.col = tmpRange.col;
                        }
                    }
                    range.col2 = tmpRange.col;
                    tmpRange = null;
                }
            }
        }

        return range;
    }

    private _getAggregate(aggType: wijmo.Aggregate, items: any[]) {
        let cntn = 0,
            sum = 0,
            sum2 = 0,
            min = null,
            max = null;

        // calculate aggregate
        for (let i = 0; i < items.length; i++) {
            // get item/value
            let val = items[i];

            // aggregate
            if (val != null && (typeof (val) === 'number') && !isNaN(val)) {
                if (min == null || val < min) {
                    min = val;
                }
                if (max == null || val > max) {
                    max = val;
                }

                cntn++;
                sum += val;
                sum2 += val * val;
            }
        }

        // return result
        let avg = cntn == 0 ? 0 : sum / cntn;
        switch (aggType) {
            case wijmo.Aggregate.Avg:
                return avg;
            case wijmo.Aggregate.Max:
                return max;
            case wijmo.Aggregate.Min:
                return min;
            case wijmo.Aggregate.Sum:
                return sum;
            case wijmo.Aggregate.VarPop:
                return cntn <= 1 ? 0 : sum2 / cntn - avg * avg;
            case wijmo.Aggregate.StdPop:
                return cntn <= 1 ? 0 : Math.sqrt(sum2 / cntn - avg * avg);
            case wijmo.Aggregate.Var:
                return cntn <= 1 ? 0 : (sum2 / cntn - avg * avg) * cntn / (cntn - 1);
            case wijmo.Aggregate.Std:
                return cntn <= 1 ? 0 : Math.sqrt((sum2 / cntn - avg * avg) * cntn / (cntn - 1));
        }

        // should never get here...
        throw 'Invalid aggregate type.';
    }

    // Get the aggregate result for the CalcEngine.
    private _getAggregateResult(aggType: wijmo.Aggregate, params: Array<_Expression>, sheet?: Sheet): any {
        var list = this._getItemList(params, sheet),
            result: any;

        result = this._getAggregate(aggType, list.items);
        if (list.isDate) {
            result = new Date(result);
            result = {
                value: result,
                format: list.format || 'M/d/yyyy'
            }
        }
        return result;
    }


    // Get the flexsheet aggregate result for the CalcEngine
    private _getFlexSheetAggregateResult(aggType: _FlexSheetAggregate, params: Array<_Expression>, sheet?: Sheet): any {
        var list: _ICalcutationItems,
            sumList: _ICalcutationItems,
            num: number,
            order: number;

        switch (aggType) {
            case _FlexSheetAggregate.Count:
                list = this._getItemList(params, sheet, false, undefined, undefined, false);
                return this._countNumberCells(list.items);
            case _FlexSheetAggregate.CountA:
                list = this._getItemList(params, sheet, false, undefined, undefined, false);
                return list.items.length;
            case _FlexSheetAggregate.CountBlank:
                list = this._getItemList(params, sheet, true, undefined, undefined, false);
                return this._countBlankCells(list.items);
            case _FlexSheetAggregate.Rank:
                num = _Expression.toNumber(params[0], this._rowIndex, this._columnIndex, sheet);
                order = params[2] ? _Expression.toNumber(params[2], this._rowIndex, this._columnIndex, sheet) : 0;
                if (isNaN(num)) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('number'));
                }
                if (isNaN(order)) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('order'));
                }
                params[1] = this._ensureNonFunctionExpression(<_Expression>params[1], sheet);
                if (params[1] instanceof _CellRangeExpression) {
                    list = this._getItemList([params[1]], sheet);
                    return this._getRankOfCellRange(num, list.items, order);
                }
                throw new SyntaxError(_ErrorMessages.InvalidCellRef);
            case _FlexSheetAggregate.CountIf:
                params[0] = this._ensureNonFunctionExpression(<_Expression>params[0], sheet);
                if (params[0] instanceof _CellRangeExpression) {
                    list = this._getItemList([params[0]], sheet, undefined, undefined, undefined, false);
                    return this._countCellsByCriteria([list.items], [params[1]], sheet);
                }
                throw new SyntaxError(_ErrorMessages.InvalidCellRef);
            case _FlexSheetAggregate.CountIfs:
                return this._handleCountIfs(params, sheet);
            case _FlexSheetAggregate.SumIf:
                params[0] = this._ensureNonFunctionExpression(<_Expression>params[0], sheet);
                if (params[0] instanceof _CellRangeExpression) {
                    let getEmptyValues = false;
                    params[2] = this._ensureNonFunctionExpression(<_Expression>params[2], sheet);
                    if (params[2] != null && params[2] instanceof _CellRangeExpression) {
                        sumList = this._getItemList([params[2]], sheet, getEmptyValues = true);
                    }
                    list = this._getItemList([params[0]], sheet, getEmptyValues);
                    return this._sumCellsByCriteria([list.items], [params[1]], sumList ? sumList.items : null, sheet);
                }
                throw new SyntaxError(_ErrorMessages.InvalidCellRef);
            case _FlexSheetAggregate.SumIfs:
                return this._handleSumIfs(params, sheet);
            case _FlexSheetAggregate.Product:
                list = this._getItemList(params, sheet);
                return this._getProductOfNumbers(list.items);
        }

        throw 'Invalid aggregate type.';
    }

    // Get item list for aggregate processing.
    // throwOnError indicates whether a FormulaError should be returned or throwned.
    private _getItemList(params: Array<_Expression>, sheet?: Sheet, isGetEmptyValue = false, isGetHiddenValue = true, columnIndex?: number, throwOnError = true): _ICalcutationItems {
        var items: Array<any> = new Array<any>(),
            item: any,
            index: number,
            cellIndex: number,
            cellValues: any[],
            param: _Expression,
            isDateCell: boolean,
            format: string,
            cellSheetRef: Sheet,
            cellStyle: ICellStyle,
            column: wijmo.grid.Column;

        for (index = 0; index < params.length; index++) {
            param = params[index];
            // When meets the CellRangeExpression, 
            // we need set the value of the each cell in the cell range into the array to get the aggregate result.
            param = this._ensureNonFunctionExpression(<_Expression>param, sheet);
            if (param instanceof _CellRangeExpression) {
                cellValues = (<_CellRangeExpression>param).getValues(isGetHiddenValue, columnIndex, sheet, throwOnError);
                if (index === 0) {
                    cellSheetRef = (<_CellRangeExpression>param)._getSheet() || sheet || this._sheet;
                    cellStyle = cellSheetRef.getCellStyle((<_CellRangeExpression>param).cells.topRow, (<_CellRangeExpression>param).cells.leftCol);
                    if (cellStyle) {
                        format = cellStyle.format;
                    }
                    if (!format) {
                        column = cellSheetRef.grid.columns[(<_CellRangeExpression>param).cells.leftCol];
                        if (column) {
                            format = column.format;
                        }
                    }
                }
                checkListType:
                for (cellIndex = 0; cellIndex < cellValues.length; cellIndex++) {
                    item = cellValues[cellIndex];
                    if (isDateCell == null && item != null && !wijmo.isString(item)) {
                        isDateCell = wijmo.isDate(item);
                        break checkListType;
                    }
                }
                cells:
                for (cellIndex = 0; cellIndex < cellValues.length; cellIndex++) {
                    item = cellValues[cellIndex];
                    if (!isGetEmptyValue && (item == null || item === '')) {
                        continue cells;
                    }

                    if (wijmo.isDate(item)) {
                        items.push(+item)
                    } else {
                        items.push(item); // Don't convert string values obtained from a cell range. SUM(A1:A2) = 2, where A1=2 and A2="4".
                    }
                }
            } else {
                item = param instanceof _Expression ? param.evaluate(this._rowIndex, this._columnIndex, sheet, undefined, throwOnError) : param;
                if (!(item instanceof FormulaError) && !wijmo.isPrimitive(item)) {
                    item = item.value;
                }
                if (!isGetEmptyValue && (item == null || item === '')) {
                    continue;
                }

                let num = +item;
                if (!isNaN(num)) { // Always try to convert string values directly passed to a function, =SUM(2, "4") = 6.
                    item = num;
                }

                items.push(item);

                if (isDateCell == null && items.length > 0) {
                    isDateCell = item instanceof Date;
                }
            }
        }

        if (items.length === 0) {
            isDateCell = false;
        }

        return {
            isDate: isDateCell,
            items: items,
            format: format
        };
    }

    // Count blank cells
    private _countBlankCells(items: Array<any>): number {
        var i = 0,
            count = 0,
            item: any;

        for (; i < items.length; i++) {
            item = items[i];
            if (item == null || (wijmo.isString(item) && item === '') || (wijmo.isNumber(item) && isNaN(item))) {
                count++;
            }
        }

        return count;
    }

    // Count number cells
    private _countNumberCells(items: Array<any>): number {
        var i = 0,
            count = 0,
            item: any;

        for (; i < items.length; i++) {
            item = items[i];
            if (item != null && wijmo.isNumber(item) && !isNaN(item)) {
                count++;
            }
        }

        return count;
    }

    // Get the rank for the number in the cell range.
    private _getRankOfCellRange(num: number, items: Array<any>, order: number = 0): number {
        var i = 0,
            rank = 0,
            item: any;

        // Sort the items list
        if (!order) {
            items.sort((a, b) => {
                if (isNaN(a) || isNaN(b)) {
                    return 1;
                }
                return b - a;
            });
        } else {
            items.sort((a, b) => {
                if (isNaN(a) || isNaN(b)) {
                    return -1;
                }
                return a - b;
            });
        }

        for (; i < items.length; i++) {
            item = items[i];
            if (isNaN(item) || !wijmo.isNumber(item)) {
                continue;
            }
            rank++;
            if (num === item) {
                return rank;
            }
        }

        throw new ValueError(_ErrorMessages.ParameterIsOutOfRange('number'));
    }

    // Handles the CountIfs function
    private _handleCountIfs(params: Array<_Expression>, sheet?: Sheet) {
        var i = 0,
            itemsList = [],
            criteriaList = [],
            list: _ICalcutationItems,
            cellExpr: _Expression,
            rowCount: number,
            colCount: number;

        if (params.length % 2 !== 0) {
            throw new ValueError(_ErrorMessages.InvalidParameters);
        }
        for (; i < params.length / 2; i++) {
            cellExpr = params[2 * i];
            cellExpr = this._ensureNonFunctionExpression(cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                if (i === 0) {
                    if ((<_CellRangeExpression>cellExpr).cells) {
                        rowCount = (<_CellRangeExpression>cellExpr).cells.rowSpan;
                        colCount = (<_CellRangeExpression>cellExpr).cells.columnSpan;
                    } else {
                        throw new SyntaxError(_ErrorMessages.InvalidCellRef);
                    }
                } else {
                    if (!(<_CellRangeExpression>cellExpr).cells) {
                        throw new SyntaxError(_ErrorMessages.InvalidCellRef);
                    } else if ((<_CellRangeExpression>cellExpr).cells.rowSpan !== rowCount || (<_CellRangeExpression>cellExpr).cells.columnSpan !== colCount) {
                        throw new ValueError(_ErrorMessages.RangesMustBeTheSame);
                    }
                }
                list = this._getItemList([cellExpr], sheet, undefined, undefined, undefined, false);
                itemsList[i] = list.items;

                criteriaList[i] = params[2 * i + 1];
            } else {
                throw new SyntaxError(_ErrorMessages.InvalidCellRef);
            }
        }

        return this._countCellsByCriteria(itemsList, criteriaList, sheet);
    }

    // Count the cells that meet the criteria.
    private _countCellsByCriteria(itemsList: Array<any>[], criteria: _Expression[], sheet?: Sheet, countItems?: Array<any>): number {
        var i = 0,
            j = 0,
            count = 0,
            rangeLength = itemsList[0].length,
            parsedRightExprs = [],
            result: boolean,
            countItem: any,
            items: Array<any>,
            leftExpr: any,
            rightExpr: any;

        for (; j < criteria.length; j++) {
            rightExpr = _Expression.toString(criteria[j], this._rowIndex, this._columnIndex, sheet);
            if (rightExpr === '*') {
                parsedRightExprs.push(rightExpr);
            } else {
                parsedRightExprs.push(this._parseRightExpr(rightExpr));
            }
        }

        for (; i < rangeLength; i++) {
            result = false;

            for (j = 0; j < itemsList.length; j++) {
                items = itemsList[j];

                leftExpr = items[i];
                rightExpr = parsedRightExprs[j];
                if (typeof rightExpr === 'string') {
                    if (rightExpr !== '*' && (leftExpr == null || leftExpr === '')) {
                        result = false;
                        break;
                    }
                    result = rightExpr === '*' || this.evaluate(this._combineExpr(leftExpr, rightExpr), null, sheet, this._rowIndex, this._columnIndex, false);
                    if (result as any instanceof FormulaError || !result) {
                        break;
                    }
                } else {
                    result = result = (<_IRegCriteria>rightExpr).reg.test(leftExpr.toString()) === (<_IRegCriteria>rightExpr).checkMathces;
                    if (!result) {
                        break;
                    }
                }
            }
            if (result && !(result as any instanceof FormulaError)) {
                if (countItems) {
                    countItem = countItems[i];
                    if (countItem != null && wijmo.isNumber(countItem) && !isNaN(countItem)) {
                        count++;
                    }
                } else {
                    count++;
                }
            }
        }

        return count;
    }

    // Handles the SumIfs function
    private _handleSumIfs(params: Array<_Expression>, sheet?: Sheet) {
        var i = 1,
            itemsList = [],
            criteriaList = [],
            list: _ICalcutationItems,
            sumList: _ICalcutationItems,
            sumCellExpr: _Expression,
            cellExpr: _Expression,
            rowCount: number,
            colCount: number,
            getEmptyValues = false;

        if (params.length % 2 !== 1) {
            throw new ValueError(_ErrorMessages.InvalidParameters);
        }

        sumCellExpr = params[0];
        sumCellExpr = this._ensureNonFunctionExpression(sumCellExpr, sheet);
        if (sumCellExpr instanceof _CellRangeExpression) {
            if ((<_CellRangeExpression>sumCellExpr).cells) {
                rowCount = (<_CellRangeExpression>sumCellExpr).cells.rowSpan;
                colCount = (<_CellRangeExpression>sumCellExpr).cells.columnSpan;
            } else {
                throw new ValueError(_ErrorMessages.InvalidParameter('Sum_range'));
            }
            sumList = this._getItemList([sumCellExpr], sheet, getEmptyValues = true);
        } else {
            throw new ValueError(_ErrorMessages.InvalidParameter('Sum_range'));
        }

        for (; i < (params.length + 1) / 2; i++) {
            cellExpr = params[2 * i - 1];
            cellExpr = this._ensureNonFunctionExpression(cellExpr, sheet);
            if (cellExpr instanceof _CellRangeExpression) {
                if (!(<_CellRangeExpression>cellExpr).cells) {
                    throw new ValueError(_ErrorMessages.InvalidParameter('Criteria_range' + i));
                } else if ((<_CellRangeExpression>cellExpr).cells.rowSpan !== rowCount || (<_CellRangeExpression>cellExpr).cells.columnSpan !== colCount) {
                    throw new ValueError(_ErrorMessages.RangesMustBeTheSame);
                }
                list = this._getItemList([cellExpr], sheet, getEmptyValues);
                itemsList[i - 1] = list.items;

                criteriaList[i - 1] = params[2 * i];
            } else {
                throw new ValueError(_ErrorMessages.InvalidParameter('Criteria_range' + i));
            }
        }

        return this._sumCellsByCriteria(itemsList, criteriaList, sumList.items, sheet);
    }

    // Gets the sum of the numeric values in the cells specified by a given criteria.
    private _sumCellsByCriteria(itemsList: Array<any>[], criteria: _Expression[], sumItems?: Array<any>, sheet?: Sheet): number {
        var i = 0,
            j = 0,
            sum = 0,
            sumItem: number,
            rangeLength = itemsList[0].length,
            parsedRightExprs = [],
            result: boolean,
            items: Array<any>,
            leftExpr: any,
            rightExpr: any;

        if (sumItems == null) {
            sumItems = itemsList[0];
        }

        for (; j < criteria.length; j++) {
            rightExpr = _Expression.toString(criteria[j], this._rowIndex, this._columnIndex, sheet);
            if (rightExpr === '*') {
                parsedRightExprs.push(rightExpr);
            } else {
                parsedRightExprs.push(this._parseRightExpr(rightExpr));
            }
        }

        for (; i < rangeLength; i++) {
            result = false;
            sumItem = sumItems[i];

            for (j = 0; j < itemsList.length; j++) {
                items = itemsList[j];

                leftExpr = items[i];
                rightExpr = parsedRightExprs[j];
                if (typeof rightExpr === 'string') {
                    if (rightExpr !== '*' && (leftExpr == null /* || leftExpr === ''*/)) {
                        result = false;
                        break;
                    }
                    result = rightExpr === '*' || this.evaluate(this._combineExpr(leftExpr, rightExpr), null, sheet, this._rowIndex, this._columnIndex);
                    if ((result as any instanceof FormulaError) || !result) {
                        break;
                    }
                } else {
                    result = (<_IRegCriteria>rightExpr).reg.test(leftExpr.toString()) === (<_IRegCriteria>rightExpr).checkMathces;
                    if (!result) {
                        break;
                    }
                }
            }

            if (result && wijmo.isNumber(sumItem) && !isNaN(sumItem)) {
                sum += sumItem;
            }
            //if (result && isNumber(+sumItem) && !isNaN(+sumItem)) {
            //   sum += +sumItem;
            //}
        }

        return sum;
    }

    // Get product for numbers
    private _getProductOfNumbers(items: any[]) {
        var item: any,
            i = 0,
            product = 1,
            containsValidNum = false;

        if (items) {
            for (; i < items.length; i++) {
                item = items[i];
                if (wijmo.isNumber(item) && !isNaN(item)) {
                    product *= item;
                    containsValidNum = true;
                }
            }
        }

        if (containsValidNum) {
            return product;
        }

        return 0;
    }

    //  Handle the subtotal function.
    private _handleSubtotal(params: Array<_Expression>, sheet: Sheet): any {
        var func: any,
            list: _ICalcutationItems,
            aggType: wijmo.Aggregate,
            result: any,
            isGetHiddenValue = true,
            needParseToNum = true;

        func = _Expression.toNumber(params[0], this._rowIndex, this._columnIndex, sheet);
        if ((func >= 1 && func <= 11) || (func >= 101 && func <= 111)) {
            if (func >= 101 && func <= 111) {
                isGetHiddenValue = false;
            }

            func = wijmo.asEnum(func, _SubtotalFunction);
            if (func === _SubtotalFunction.CountA || func === _SubtotalFunction.CountAWithoutHidden) {
                needParseToNum = false;
            }

            list = this._getItemList(params.slice(1), sheet, needParseToNum, isGetHiddenValue);

            switch (func) {
                case _SubtotalFunction.Count:
                case _SubtotalFunction.CountWithoutHidden:
                    return this._countNumberCells(list.items);
                case _SubtotalFunction.CountA:
                case _SubtotalFunction.CountAWithoutHidden:
                    return list.items.length;
                case _SubtotalFunction.Product:
                case _SubtotalFunction.ProductWithoutHidden:
                    return this._getProductOfNumbers(list.items);
                case _SubtotalFunction.Average:
                case _SubtotalFunction.AverageWithoutHidden:
                    aggType = wijmo.Aggregate.Avg;
                    break;
                case _SubtotalFunction.Max:
                case _SubtotalFunction.MaxWithoutHidden:
                    aggType = wijmo.Aggregate.Max;
                    break;
                case _SubtotalFunction.Min:
                case _SubtotalFunction.MinWithoutHidden:
                    aggType = wijmo.Aggregate.Min;
                    break;
                case _SubtotalFunction.Std:
                case _SubtotalFunction.StdWithoutHidden:
                    aggType = wijmo.Aggregate.Std;
                    break;
                case _SubtotalFunction.StdPop:
                case _SubtotalFunction.StdPopWithoutHidden:
                    aggType = wijmo.Aggregate.StdPop;
                    break;
                case _SubtotalFunction.Sum:
                case _SubtotalFunction.SumWithoutHidden:
                    aggType = wijmo.Aggregate.Sum;
                    break;
                case _SubtotalFunction.Var:
                case _SubtotalFunction.VarWithoutHidden:
                    aggType = wijmo.Aggregate.Var;
                    break;
                case _SubtotalFunction.VarPop:
                case _SubtotalFunction.VarPopWithoutHidden:
                    aggType = wijmo.Aggregate.VarPop;
                    break;
            }

            result = this._getAggregate(aggType, list.items);
            if (list.isDate) {
                result = new Date(result);
            }
            return result;
        }

        throw new ValueError(_ErrorMessages.InvalidParameter('Function_num'));
    }

    // Handle the DCount function.
    private _handleDCount(params: Array<_Expression>, sheet: Sheet) {
        var cellExpr = params[0],
            criteriaCellExpr = params[2],
            field: any,
            columnIndex: number,
            list: _ICalcutationItems;

        cellExpr = this._ensureNonFunctionExpression(cellExpr, sheet);
        criteriaCellExpr = this._ensureNonFunctionExpression(criteriaCellExpr, sheet);

        if (cellExpr instanceof _CellRangeExpression && criteriaCellExpr instanceof _CellRangeExpression) {
            field = params[1].evaluate(this._rowIndex, this._columnIndex, sheet);
            columnIndex = this._getColumnIndexByField(<_CellRangeExpression>cellExpr, field);
            list = this._getItemList([cellExpr], sheet, false, true, columnIndex, false);

            if (list.items && list.items.length > 1) { // skip the column label
                return this._DCountWithCriteria(list.items.slice(1), <_CellRangeExpression>cellExpr, <_CellRangeExpression>criteriaCellExpr);
            }

            return 0;
        }

        throw new ValueError(_ErrorMessages.InvalidParameter('Database'));
    }

    // Counts the cells by the specified criteria.
    private _DCountWithCriteria(countItems: Array<any>, countRef: _CellRangeExpression, criteriaRef: _CellRangeExpression) {
        var criteriaCells = criteriaRef.cells,
            count = 0,
            countSheet: Sheet,
            criteriaSheet: Sheet,
            fieldRowIndex: number,
            rowIndex: number,
            colIndex: number,
            criteriaColIndex: number,
            criteria: any,
            criteriaField: any,
            list: _ICalcutationItems,
            itemsList: Array<any>[],
            criteriaList: any[];

        countSheet = this._owner._getSheet(countRef.sheetRef);
        criteriaSheet = this._owner._getSheet(criteriaRef.sheetRef);

        if (criteriaCells.rowSpan > 1) {
            fieldRowIndex = criteriaCells.topRow;
            for (rowIndex = criteriaCells.bottomRow; rowIndex > criteriaCells.topRow; rowIndex--) {
                itemsList = [];
                criteriaList = [];
                for (colIndex = criteriaCells.leftCol; colIndex <= criteriaCells.rightCol; colIndex++) {
                    // Collects the criteria and related cell reference.
                    criteria = this._owner.getCellValue(rowIndex, colIndex, false, criteriaSheet);
                    if (criteria != null && criteria !== '') {
                        criteriaList.push(new _Expression(criteria));

                        criteriaField = this._owner.getCellValue(fieldRowIndex, colIndex, false, criteriaSheet);
                        criteriaColIndex = this._getColumnIndexByField(countRef, criteriaField);
                        list = this._getItemList([countRef], countSheet, false, true, criteriaColIndex, false);
                        if (list.items != null && list.items.length > 1) {
                            itemsList.push(list.items.slice(1));
                        } else {
                            throw new ValueError('Criteria');
                        }
                    }
                }

                count += this._countCellsByCriteria(itemsList, criteriaList, countSheet, countItems);
            }

            return count;
        }

        throw new ValueError('Criteria');
    }

    // Get column index of the count cell range by the field.
    private _getColumnIndexByField(cellExpr: _CellRangeExpression, field: any) {
        var cells: wijmo.grid.CellRange,
            sheet: Sheet,
            columnIndex: number,
            value: any,
            rowIndex: number;

        cells = cellExpr.cells;
        rowIndex = cells.topRow;

        if (rowIndex === -1) {
            throw new ValueError(_ErrorMessages.InvalidParameter('Database'));
        }

        if (wijmo.isInt(field) && !isNaN(field)) {
            // if the field is integer, we consider the field it the column index of the count cell range.
            if (field >= 1 && field <= cells.columnSpan) {
                columnIndex = cells.leftCol + field - 1;
                return columnIndex;
            }
        } else {
            sheet = this._owner._getSheet(cellExpr.sheetRef);
            for (columnIndex = cells.leftCol; columnIndex <= cells.rightCol; columnIndex++) {
                value = this._owner.getCellValue(rowIndex, columnIndex, false, sheet);
                field = wijmo.isString(field) ? (<string>field).toLowerCase() : field;
                value = wijmo.isString(value) ? (<string>value).toLowerCase() : value;
                if (field === value) {
                    return columnIndex;
                }
            }
        }

        throw new ValueError(_ErrorMessages.InvalidParameter('Field'));
    }

    // Gets the result of the sumProduct formula. 
    private _getSumProduct(params: Array<_Expression>, sheet: Sheet): number {
        var product: number,
            sum: number = 0,
            list = this._getItemListForSumProduct(params, sheet),
            xAxisCnt: number,
            yAxisCnt: number;

        if (list.length > 0) {
            xAxisCnt = list[0].length;
            yAxisCnt = list.length;

            for (var ci = 0; ci < xAxisCnt; ci++) {
                product = 1;
                for (var ri = 0; ri < yAxisCnt; ri++) {
                    product *= list[ri][ci];
                }
                sum += product;
            }
        }

        return sum;
    }

    // Gets item list for the sumProduct formula.
    private _getItemListForSumProduct(params: Array<_Expression>, sheet: Sheet): Array<number>[] {
        var list: Array<number>[] = [new Array<number>()],
            items: Array<number>,
            item: any,
            index: number,
            cellIndex: number,
            cellValues: any[],
            param: _Expression;

        for (index = 0; index < params.length; index++) {
            param = params[index];
            items = new Array<number>(),
                // When meets the CellRangeExpression, 
                // we need set the value of the each cell in the cell range into the array to get the aggregate result.
                param = this._ensureNonFunctionExpression(<_Expression>param, sheet);
            if (param instanceof _CellRangeExpression) {
                cellValues = (<_CellRangeExpression>param).getValues(true, null, sheet);
                for (cellIndex = 0; cellIndex < cellValues.length; cellIndex++) {
                    item = cellValues[cellIndex];
                    items.push(+item);
                }
            } else {
                item = param instanceof _Expression ? param.evaluate(this._rowIndex, this._columnIndex, sheet) : param;
                items.push(+item);
            }
            if (index > 0) {
                if (items.length !== list[0].length) {
                    throw new ValueError(_ErrorMessages.RangesMustBeTheSame);
                }
            }
            list[index] = items;
        }

        return list;
    }

    // Parse the right expression for countif countifs sumif and sumifs function.
    private _parseRightExpr(rightExpr: string): any {
        var match: string[],
            matchReg: RegExp,
            checkMathces = false;

        // Match the criteria that contains '?' such as '??match' and etc..
        if (rightExpr.indexOf('?') > -1 || rightExpr.indexOf('*') > -1) {
            match = rightExpr.match(/=?([\?\*]*)(\w*)([\?\*]*)(\w*)([\?\*]*)/);
            if (match != null && match.length === 6) {
                matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
                    + (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
                    + (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
            } else {
                throw new ValueError(_ErrorMessages.InvalidParameter('Criteria'));
            }

            if (/^[<>=]/.test(rightExpr)) {
                if (rightExpr.trim()[0] === '=') {
                    checkMathces = true;
                }
            } else {
                checkMathces = true;
            }

            return {
                reg: matchReg,
                checkMathces: checkMathces
            };
        } else {
            if (!isNaN(+rightExpr)) {
                rightExpr = '=' + (+rightExpr);
            } else if (/^\w/.test(rightExpr)) {
                rightExpr = '="' + rightExpr + '"';
            } else if (/^[<>=]{1,2}\s*-?.+$/.test(rightExpr)) {
                //rightExpr = rightExpr.replace(/([<>=]{1,2})\s*(-?.+)/, '$1"$2"');
                rightExpr = rightExpr.replace(/([<>=]{1,2})\s*(-?.+)/, (sub, s1, s2) => {
                    return s1 + (isNaN(+s2) ? `"${s2}"` : s2);
                });
            } else {
                throw new ValueError(_ErrorMessages.InvalidParameter('Criteria'));
            }

            return rightExpr;
        }
    }

    // combine the left expression and right expression for countif countifs sumif and sumifs function.
    private _combineExpr(leftExpr: any, rightExpr: string): string {
        if (wijmo.isString(leftExpr) || wijmo.isDate(leftExpr)) {
            leftExpr = '"' + leftExpr + '"';
        }
        leftExpr = '=' + leftExpr;

        return leftExpr + rightExpr;
    }

    // Parse regex criteria for '?' and '*'
    private _parseRegCriteria(criteria: string): string {
        var i = 0,
            questionMarkCnt = 0,
            regString = '';

        for (; i < criteria.length; i++) {
            if (criteria[i] === '*') {
                if (questionMarkCnt > 0) {
                    regString += '\\w{' + questionMarkCnt + '}';
                    questionMarkCnt = 0;
                }
                regString += '\\w*'
            } else if (criteria[i] === '?') {
                questionMarkCnt++;
            }
        }

        if (questionMarkCnt > 0) {
            regString += '\\w{' + questionMarkCnt + '}';
        }

        return regString;
    }

    // Calculate the rate.
    // The algorithm of the rate calculation refers http://stackoverflow.com/questions/3198939/recreate-excel-rate-function-using-newtons-method
    private _calculateRate(params: Array<_Expression>, sheet?: Sheet) {
        var FINANCIAL_PRECISION = 0.0000001,
            FINANCIAL_MAX_ITERATIONS = 20,
            i = 0,
            x0 = 0,
            x1: number,
            rate: number,
            nper: number,
            pmt: number,
            pv: number,
            fv: number,
            type: number,
            guess: number,
            y: number,
            f: number,
            y0: number,
            y1: number;

        nper = _Expression.toNumber(params[0], this._rowIndex, this._columnIndex, sheet);
        pmt = _Expression.toNumber(params[1], this._rowIndex, this._columnIndex, sheet);
        pv = _Expression.toNumber(params[2], this._rowIndex, this._columnIndex, sheet);
        fv = params[3] != null ? _Expression.toNumber(params[3], this._rowIndex, this._columnIndex, sheet) : 0;
        type = params[4] != null ? _Expression.toNumber(params[4], this._rowIndex, this._columnIndex, sheet) : 0;
        guess = params[5] != null ? _Expression.toNumber(params[5], this._rowIndex, this._columnIndex, sheet) : 0.1;

        rate = guess;
        if (Math.abs(rate) < FINANCIAL_PRECISION) {
            y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
        } else {
            f = Math.exp(nper * Math.log(1 + rate));
            y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
        }
        y0 = pv + pmt * nper + fv;
        y1 = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;

        // find root by secant method
        x1 = rate;
        while ((Math.abs(y0 - y1) > FINANCIAL_PRECISION) && (i < FINANCIAL_MAX_ITERATIONS)) {
            rate = (y1 * x0 - y0 * x1) / (y1 - y0);
            x0 = x1;
            x1 = rate;

            if (Math.abs(rate) < FINANCIAL_PRECISION) {
                y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
            } else {
                f = Math.exp(nper * Math.log(1 + rate));
                y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
            }

            y0 = y1;
            y1 = y;
            ++i;
        }

        if (Math.abs(y0 - y1) > FINANCIAL_PRECISION && i === FINANCIAL_MAX_ITERATIONS) {
            throw new NumericError(_ErrorMessages.RateCriteriaFails);
        }

        return rate;
    }

    // Handle the hlookup function.
    private _handleHLookup(params: Array<_Expression>, sheet?: Sheet) {
        return this._handleLookup(params, sheet, {
            base: cr => cr.topRow,
            span: cr => cr.rowSpan,
            iterStart: cr => cr.leftCol,
            iterEnd: cr => cr.rightCol,
            getValue: (baseIdx, iterIdx) => this._owner.getCellValue(baseIdx, iterIdx, false, sheet)
        });
    }

    // Handle the vlookup function.
    private _handleVLookup(params: Array<_Expression>, sheet?: Sheet) {
        return this._handleLookup(params, sheet, {
            base: cr => cr.leftCol,
            span: cr => cr.columnSpan,
            iterStart: cr => cr.topRow,
            iterEnd: cr => cr.bottomRow,
            getValue: (baseIdx, iterIdx) => this._owner.getCellValue(iterIdx, baseIdx, false, sheet)
        });
    }

    // Handle the lookup functions.
    private _handleLookup(params: Array<_Expression>, sheet: Sheet, lkh: _ILookupHandler) {
        var lookupVal = (<_Expression>params[0]).evaluate(this._rowIndex, this._columnIndex, sheet),
            cellExpr = params[1],
            baseIdx = _Expression.toNumber(params[2], this._rowIndex, this._columnIndex, sheet),
            approximateMatch = params[3] != null ? _Expression.toBoolean(params[3], this._rowIndex, this._columnIndex, sheet) : true;

        if (lookupVal == null || lookupVal == '') {
            throw new ValueError(_ErrorMessages.InvalidParameter('Lookup_value'));
        }

        if (isNaN(baseIdx) || baseIdx < 0) {
            throw new ValueError(_ErrorMessages.InvalidParameter('index_num'));
        }

        cellExpr = this._ensureNonFunctionExpression(<_Expression>cellExpr, sheet);
        if (cellExpr instanceof _CellRangeExpression) {
            var cells = (<_CellRangeExpression>cellExpr).cells;
            if (baseIdx > lkh.span(cells)) {
                throw new ValueError(_ErrorMessages.ParameterIsOutOfRange('index_num'));
            }

            var iterIdx: number;

            if (approximateMatch) {
                iterIdx = this._exactMatch(lookupVal, cells, false, lkh);
                if (iterIdx === -1) {
                    iterIdx = this._approximateMatch(lookupVal, cells, lkh);
                }
            } else {
                iterIdx = this._exactMatch(lookupVal, cells, true, lkh);
            }

            if (iterIdx === -1) {
                throw new NotAvailableError();
            }

            return lkh.getValue(lkh.base(cells) + baseIdx - 1, iterIdx);
        }

        throw new SyntaxError(_ErrorMessages.InvalidCellRef);
    }

    // Handle the exact match for the lookup functions.
    private _exactMatch(lookupValue: any, cells: wijmo.grid.CellRange, needHandleWildCard: boolean, lkh: _ILookupHandler): number {
        var baseIdx = lkh.base(cells),
            matchReg: RegExp;

        if (wijmo.isString(lookupValue)) {
            lookupValue = (<string>lookupValue).toLowerCase();
        }

        // handle the wildcard question mark (?) and asterisk (*) for the lookup value.
        if (needHandleWildCard && wijmo.isString(lookupValue) && ((<string>lookupValue).indexOf('?') > -1 || (<string>lookupValue).indexOf('*') > -1)) {
            var match = (<string>lookupValue).match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/);
            if (match != null && match.length === 6) {
                matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
                    + (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
                    + (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
            } else {
                throw new ValueError(_ErrorMessages.InvalidParameter('Lookup_value'));
            }
        }

        for (var idx = lkh.iterStart(cells); idx <= lkh.iterEnd(cells); idx++) {
            var value = lkh.getValue(baseIdx, idx);

            if (matchReg != null) {
                if (matchReg.test(value)) {
                    return idx;
                }
            } else {
                if (wijmo.isString(value)) {
                    value = (<string>value).toLowerCase();
                }
                if (lookupValue === value) {
                    return idx;
                }
            }
        }

        return -1;
    }

    // Handle the approximate match for the lookup functions.
    private _approximateMatch(lookupValue: any, cells: wijmo.grid.CellRange, lkh: _ILookupHandler): number {
        var baseIdx = lkh.base(cells),
            cellValues = [];

        if (wijmo.isString(lookupValue)) {
            lookupValue = (<string>lookupValue).toLowerCase();
        }

        for (var idx = lkh.iterStart(cells); idx <= lkh.iterEnd(cells); idx++) {
            var val = lkh.getValue(baseIdx, idx);
            val = isNaN(+val) ? val : +val;
            cellValues.push({ value: val, index: idx });
        }

        // Sort the cellValues array with descent order.
        cellValues.sort((a, b) => {
            if (wijmo.isString(a.value)) {
                a.value = (<string>a.value).toLowerCase();
            }
            if (wijmo.isString(b.value)) {
                b.value = (<string>b.value).toLowerCase();
            }

            if (a.value > b.value) {
                return -1;
            } else if (a.value === b.value) {
                return b.index - a.index;
            }

            return 1;
        })

        for (var i = 0; i < cellValues.length; i++) {
            var val = cellValues[i];
            if (wijmo.isString(val.value)) {
                val.value = (<string>val.value).toLowerCase();
            }
            // return the column index of the first value that less than lookup value.
            if (lookupValue > val.value) {
                return val.index;
            }
        }

        throw new NotAvailableError();
    }

    // Parse the number value to scietific notation.
    private _parseToScientificValue(value: number, intCoefficientFmt: string, decimalCoefficientFmt: string, intExponentFmt: string, decimalExponentFmt: string): string {
        var coefficientNumber: number,
            sign: string,
            result: string,
            dotIndex: number,
            decimalLength: number,
            exponent = 0;

        if (Math.abs(value) >= 1) {
            sign = '+';
            coefficientNumber = Math.pow(10, intCoefficientFmt.length);
            while (value > coefficientNumber) {
                value /= coefficientNumber;
                exponent += intCoefficientFmt.length;
            }
        } else {
            sign = '-';
            coefficientNumber = Math.pow(10, intCoefficientFmt.length);
            while ((value * coefficientNumber) < coefficientNumber) {
                value *= coefficientNumber;
                exponent += intCoefficientFmt.length;
            }
        }

        result = wijmo.Globalize.format(value, 'D' + intCoefficientFmt.length);
        if (decimalCoefficientFmt) {
            result += wijmo.Globalize.format(value - Math.floor(value), intCoefficientFmt + decimalCoefficientFmt).substring(1);
            dotIndex = result.indexOf('.');
            if (dotIndex > -1) {
                decimalLength = result.length - 1 - result.indexOf('.');
            } else {
                result += '.';
                decimalLength = 0;
            }
            while (decimalLength < decimalCoefficientFmt.length - 1) {
                result += '0';
                decimalLength++;
            }
        }

        result += 'E' + sign + wijmo.Globalize.format(exponent, 'D' + intExponentFmt.length);
        if (decimalExponentFmt) {
            result += '.';
            for (var i = 1; i < decimalExponentFmt.length; i++) {
                result += '0';
            }
        }

        return result;
    }

    // Check the expression cache.
    /*private*/ _checkCache(expression: string, strictStringCmp = true, sheetIndex?: number, rowIndex?: number, columnIndex?: number): _Expression {
        if (sheetIndex != null) {
            this._sheet = this._owner.sheets[sheetIndex];
        }
        if (rowIndex != null) {
            this._rowIndex = rowIndex;
        }
        if (columnIndex != null) {
            this._columnIndex = columnIndex;
        }

        let name = this._sheet ? this._sheet.name : '',
            expr = this._expressionCache[name + ':' + strictStringCmp + ':' + expression]
                || this._expressionCache[name + '_' + this._rowIndex + '_' + this._columnIndex + ':' + strictStringCmp + ':' + expression];

        if (expr) {
            if (expr.token.tokenType === _TokenType.ERROR) {
                throw expr.token.value;
            }

            return expr;
        }

        expr = this._parse(expression);
        if (this._token.tokenID !== _TokenID.END || this._token.tokenType !== _TokenType.GROUP) {
            throw new SyntaxError(_ErrorMessages.InvalidExpression(expression));
        }
        // when the size of the expression cache is greater than 10000,
        // We will release the expression cache.
        if (this._cacheSize > 10000) {
            this._clearExpressionCache();
        }
        this._expressionCache[name + (this._containsCellRef ? '_' + this._rowIndex + '_' + this._columnIndex : '') + ':' + strictStringCmp + ':' + expression] = expr;
        this._cacheSize++;

        return expr;
    }

    // Ensure current is not function expression.
    private _ensureNonFunctionExpression(expr: _Expression, sheet?: Sheet) {
        while (expr instanceof _FunctionExpression) {
            expr = expr.evaluate(this._rowIndex, this._columnIndex, sheet);
        }
        return expr;
    }

    // Gets the defined name item of FlexSheet by its name.
    private _getDefinedName(name: string, sheetName: string): DefinedName {
        var globalItem: DefinedName;

        sheetName = sheetName ? sheetName.toLowerCase() : sheetName;

        for (var i = 0; i < this._owner.definedNames.length; i++) {
            let item = this._owner.definedNames[i];
            if (item.name.toLowerCase() === name) {
                if (item.sheetName) {
                    if (item.sheetName.toLowerCase() === sheetName) {
                        return item;
                    }
                } else {
                    globalItem = item;
                }
            }
        }
        return globalItem;
    }

    // Parse the number value to alphabet value.
    private _numAlpha(i): string {
        let t = Math.floor((i - 1) / 26);
        return (t > 0 ? this._numAlpha(t) : '') + String.fromCharCode((i - 1) % 26 + 65);
    }
}

/*
 * Defines the Token class.
 *
 * It assists the expression instance to evaluate value.
 */
export class _Token {
    private _tokenType: _TokenType;
    private _tokenID: _TokenID;
    private _value: any;

    /*
     * Initializes a new instance of the {@link Token} class.
     *
     * @param val The value of the token.
     * @param tkID The {@link TokenID} value of the token.
     * @param tkType The {@link TokenType} value of the token.
     */
    constructor(val: any, tkID: _TokenID, tkType: _TokenType) {
        this._value = val;
        this._tokenID = tkID;
        this._tokenType = tkType;
    }

    /*
     * Gets the value of the token instance.
     */
    get value(): any {
        return this._value;
    }

    /*
     * Gets the token ID of the token instance.
     */
    get tokenID(): _TokenID {
        return this._tokenID;
    }

    /*
     * Gets the token type of the token instance.
     */
    get tokenType(): _TokenType {
        return this._tokenType;
    }
}

/*
 * Function definition class (keeps function name, parameter counts, and function).
 */
export class _FunctionDefinition {
    private _paramMax: number = Number.MAX_VALUE;
    private _paramMin: number = Number.MIN_VALUE;
    private _func: Function;

    /*
     * Initializes a new instance of the {@link FunctionDefinition} class.
     *
     * @param func The function will be invoked by the CalcEngine.
     * @param paramMax The maximum count of the parameter that the function need.
     * @param paramMin The minimum count of the parameter that the function need.
     */
    constructor(func: Function, paramMax?: number, paramMin?: number) {
        this._func = func;
        if (wijmo.isNumber(paramMax) && !isNaN(paramMax)) {
            this._paramMax = paramMax;
        }
        if (wijmo.isNumber(paramMin) && !isNaN(paramMin)) {
            this._paramMin = paramMin;
        }
    }

    /*
     * Gets the paramMax of the FunctionDefinition instance.
     */
    get paramMax(): number {
        return this._paramMax;
    }

    /*
     * Gets the paramMin of the FunctionDefinition instance.
     */
    get paramMin(): number {
        return this._paramMin;
    }

    /*
     * Gets the func of the FunctionDefinition instance.
     */
    get func(): Function {
        return this._func;
    }
}

/*
 * Token types (used when building expressions, sequence defines operator priority)
 */
export enum _TokenType {
    /*
     * This token type includes '<', '>', '=', '<=', '>=' and '<>'.
     */
    COMPARE,
    /*
     * This token type includes '+' and '-'.
     */
    ADDSUB,
    /*
     * This token type includes '*' and '/'.
     */
    MULDIV,
    /*
     * This token type includes '^'.
     */
    POWER,
    /*
     * This token type includes '&'.
     */
    CONCAT,
    /*
     * This token type includes '(' and ')'.
     */
    GROUP,
    /*
     * This token type includes number value, string value and etc..
     */
    LITERAL,
    /*
     * This token type includes function.
     */
    IDENTIFIER,
    /*
     * This token type includes error.
     */
    ERROR,
    /*
     * This token includes '[' and ']'
     */
    SQUAREBRACKETS
}

/*
 * Token ID (used when evaluating expressions)
 */
export enum _TokenID {
    /*
     * Greater than.
     */
    GT,
    /*
     * Less than.
     */
    LT,
    /*
     * Greater than or equal to.
     */
    GE,
    /*
     * Less than or equal to.
     */
    LE,
    /*
     * Equal to.
     */
    EQ,
    /*
     * Not equal to.
     */
    NE,
    /*
     * Addition.
     */
    ADD,
    /*
     * Subtraction.
     */
    SUB,
    /*
     * Multiplication.
     */
    MUL,
    /*
     * Division.
     */
    DIV,
    /*
     * Gets quotient of division.
     */
    DIVINT,
    /*
     * Gets remainder of division.
     */
    MOD,
    /*
     * Power.
     */
    POWER,
    /*
     * String concat.
     */
    CONCAT,
    /*
     * Opening bracket.
     */
    OPEN,
    /*
     * Closing bracket.
     */
    CLOSE,
    /*
     * Group end.
     */
    END,
    /*
     * Comma.
     */
    COMMA,
    /*
     * Period.
     */
    PERIOD,
    /*
     * Literal token
     */
    ATOM
}

/*
 * Specifies the type of aggregate for flexsheet.
 */
enum _FlexSheetAggregate {
    /*
     * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
     */
    Count,
    /*
     * Returns the number of cells that are not empty in a range.
     */
    CountA,
    /*
     * Returns the number of empty cells in a specified range of cells.
     */
    CountBlank,
    /*
     * Returns the number of the cells that meet the criteria you specify in the argument.
     */
    CountIf,
    /*
     * Returns the number of the cells that meet multiple criteria.
     */
    CountIfs,
    /*
     * Returns the rank of a number in a list of numbers.
     */
    Rank,
    /*
     * Returns the sum of the numeric values in the cells specified by a given criteria.
     */
    SumIf,
    /*
     * Returns the sum of the numeric values in the cells specified by a multiple criteria.
     */
    SumIfs,
    /*
     * Multiplies all the numbers given as arguments and returns the product.
     */
    Product
}

/*
 * Specifies the type of subtotal f to calculate over a group of values.
 */
enum _SubtotalFunction {
    /*
     * Returns the average value of the numeric values in the group.
     */
    Average = 1,
    /*
     * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
     */
    Count = 2,
    /*
     * Counts the number of cells that are not empty in a range.
     */
    CountA = 3,
    /*
     * Returns the maximum value in the group.
     */
    Max = 4,
    /*
     * Returns the minimum value in the group.
     */
    Min = 5,
    /*
     * Multiplies all the numbers given as arguments and returns the product.
     */
    Product = 6,
    /*
     *Returns the sample standard deviation of the numeric values in the group 
     * (uses the formula based on n-1).
     */
    Std = 7,
    /*
     *Returns the population standard deviation of the values in the group 
     * (uses the formula based on n).
     */
    StdPop = 8,
    /*
     * Returns the sum of the numeric values in the group.
     */
    Sum = 9,
    /*
     * Returns the sample variance of the numeric values in the group 
     * (uses the formula based on n-1).
     */
    Var = 10,
    /*
     * Returns the population variance of the values in the group 
     * (uses the formula based on n).
     */
    VarPop = 11,
    /*
     * Returns the average value of the numeric values in the group and ignores the hidden rows and columns.
     */
    AverageWithoutHidden = 101,
    /*
     * Counts the number of cells that contain numbers, and counts numbers within the list of arguments and ignores the hidden rows and columns.
     */
    CountWithoutHidden = 102,
    /*
     * Counts the number of cells that are not empty in a range and ignores the hidden rows and columns.
     */
    CountAWithoutHidden = 103,
    /*
     * Returns the maximum value in the group and ignores the hidden rows and columns.
     */
    MaxWithoutHidden = 104,
    /*
     * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
     */
    MinWithoutHidden = 105,
    /*
     * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
     */
    ProductWithoutHidden = 106,
    /*
     *Returns the sample standard deviation of the numeric values in the group 
     * (uses the formula based on n-1) and ignores the hidden rows and columns.
     */
    StdWithoutHidden = 107,
    /*
     *Returns the population standard deviation of the values in the group 
     * (uses the formula based on n) and ignores the hidden rows and columns.
     */
    StdPopWithoutHidden = 108,
    /*
     * Returns the sum of the numeric values in the group and ignores the hidden rows and columns.
     */
    SumWithoutHidden = 109,
    /*
     * Returns the sample variance of the numeric values in the group 
     * (uses the formula based on n-1) and ignores the hidden rows and columns.
     */
    VarWithoutHidden = 110,
    /*
     * Returns the population variance of the values in the group 
     * (uses the formula based on n) and ignores the hidden rows and columns.
     */
    VarPopWithoutHidden = 111
}

/*
 * Cell range definition.
 */
interface _ICellRange {
    /*
     * Cell range
     */
    cellRange: wijmo.grid.CellRange;
    /*
     * Indicates whether the row of the cell range is absolute or relative.
     */
    absRow: boolean;
    /*
     * Indicates whether the row2 of the cell range is absolute or relative.
     */
    absRow2?: boolean;
    /*
     * Indicates whether the col of the cell range is absolute or relative.
     */
    absCol: boolean;
    /*
     * Indicates whether the col2 of the cell range is absolute or relative.
     */
    absCol2?: boolean;
    /*
     * Indicates whether the Cell reference is whole row, whole column or specific cell range.
     * If isWholeRow is true means the cell reference is whole row.
     * If isWholeRow is false means the cell reference is whole column.
     * If isWholeRow is null means the cell reference is specific cell range.
     */
    isWholeRow?: boolean;
}

/*
 * Cell reference information
 */
interface _ICellReferrence {
    /*
     * Cell range definition.
     */
    cellRef: _ICellRange;
    /*
     * The sheet name of the sheet which the cells range refers.
     */
    sheetRef: string;
    /*
     * Indicates whether the Cell reference is whole row, whole column or specific cell range.
     * If isWholeRow is true means the cell reference is whole row.
     * If isWholeRow is false means the cell reference is whole column.
     * If isWholeRow is null means the cell reference is specific cell range.
     */
    isWholeRow?: boolean;
}

/*
 * Prensents the regex expression criteria.
 */
interface _IRegCriteria {
    /*
     * The match regex expression.
     */
    reg: RegExp;
    /*
     * Indicates whether the regex expression should match the text or not.
     */
    checkMathces: boolean;
}

/*
 * The Calculation list
 */
interface _ICalcutationItems {
    /*
     * Indicates whether the all the items are date instance.
     */
    isDate: boolean;
    /*
     * The items for calculation.
     */
    items: Array<any>;
    /*
     * The format of the items list.
     */
    format: string;
}

interface _ILookupHandler {
    base(cr: wijmo.grid.CellRange): number;
    span(cr: wijmo.grid.CellRange): number;
    iterStart(cr: wijmo.grid.CellRange): number;
    iterEnd(cr: wijmo.grid.CellRange): number;
    getValue(baseIdx: number, iterIdx: number): any;
}

// Checks if the character belongs to the "Letter" unicode category.
var rgLetter = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/;

    }
    


    module wijmo.grid.sheet {
    




'use strict';

/*
 * Defines the _FlexSheetCellFactory class.
 *
 * This class extends the CellFactory of FlexGrid control.
 * It updates the content of the row/column header for the FlexSheet control.
 */
export class _FlexSheetCellFactory extends wijmo.grid.CellFactory {

    /*
     * Overrides the updateCell function of the CellFactory class.  
     *
     * @param panel Part of the grid that owns this cell.
     * @param r Index of this cell's row.
     * @param c Index of this cell's column.
     * @param cell Element that represents the cell.
     * @param rng {@link CellRange} that contains the cell's merged range, or null if the cell is not merged.
     */
    public updateCell(panel: wijmo.grid.GridPanel, r: number, c: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {
        var g = <FlexSheet>panel.grid,
            borderRe = /^border/;

        // We shall reset the styles of current cell before updating current cell.
        if (panel.cellType === wijmo.grid.CellType.Cell) {
            this._resetCellStyle(cell);
        }

        let forcedMultiline: boolean | undefined,
            styleInfo: ICellStyle,
            editingDataCell: boolean;

        if (panel.cellType === wijmo.grid.CellType.Cell) {
            let idx = r * g.columns.length + c,
                sheet = g.selectedSheet;

            styleInfo = sheet && sheet._styledCells ? sheet._styledCells[idx] : null;

            // If the cell has multiline content imported from Excel (whiteSpace = 'pre-wrap') then force grid to
            // use textarea as the cell's editor by setting row.multiLine to True (WJM-20254)
            if (styleInfo && styleInfo.whiteSpace == 'pre-wrap' && (editingDataCell = _isEditingCell(g, r, c))) {
                forcedMultiline = panel.rows[r]._getFlag(wijmo.grid.RowColFlags.MultiLine);
                panel.rows[r]._setFlag(wijmo.grid.RowColFlags.MultiLine, true, true); // do it quietly to avoid invalidation
            }
        }

        super.updateCell(panel, r, c, cell, rng);

        // Restore row.multiLine
        if (forcedMultiline != null) {
            panel.rows[r]._setFlag(wijmo.grid.RowColFlags.MultiLine, forcedMultiline, true); // do it quietly to avoid invalidation
        }

        // adjust for merged ranges
        if (rng && !rng.isSingleCell) {
            r = rng.row;
            c = rng.col;
        }

        switch (panel.cellType) {
            case wijmo.grid.CellType.ColumnHeader:
                let content = panel.getCellData(r, c, true);

                if (cell.textContent) {
                    cell.innerHTML = cell.innerHTML.replace(wijmo.escapeHtml(cell.textContent), content).replace(cell.textContent, content);
                } else {
                    cell.innerHTML += content;
                }

                cell.style.textAlign = 'center';
                break;
            case wijmo.grid.CellType.Cell:
                let bcol = g._getBindingColumn(panel, r, panel.columns[c]);

                if (rng && !rng.isSingleCell) {
                    let firstVisibleCell = this._getFirstVisibleCell(g, rng);
                    r = firstVisibleCell.row;
                    c = firstVisibleCell.col;
                }

                //process the header row with binding
                if (panel.rows[r] instanceof HeaderRow) {
                    if (
                        (panel.columns[c].dataMapEditor === wijmo.grid.DataMapEditor.RadioButtons && cell.firstElementChild instanceof HTMLLabelElement) ||
                        (panel.columns[c].dataType === wijmo.DataType.Boolean && cell.childElementCount === 1 && cell.firstElementChild instanceof HTMLLabelElement && cell.firstElementChild.firstElementChild instanceof HTMLInputElement && cell.firstElementChild.firstElementChild.type === 'checkbox') ||
                        (panel.columns[c].dataType !== wijmo.DataType.Boolean && !cell.innerHTML)
                    ) {
                        cell.innerHTML = wijmo.escapeHtml(g.getCellValue(r, c));
                    }
                    wijmo.addClass(cell, 'wj-header-row');
                } else {
                    if (editingDataCell) {
                        let input = <HTMLInputElement>cell.querySelector('input');

                        if (input) {
                            // 467531
                            if (styleInfo && styleInfo.textAlign) {
                                input.style.textAlign = styleInfo.textAlign;
                            }

                            // don't apply format to the value being edited (467358)
                            //
                            //let val = g.getCellValue(r, c, false);
                            //if (isNumber(val) && !bcol.dataMap && !_isFormula(g.getCellData(r, c, false))) {
                            //    if (format) {
                            //        val = this._getFormattedValue(val, format);
                            //    }
                            //    input.value = val;
                            //}
                        }
                    } else {
                        let isGroupRow = panel.rows[r] instanceof wijmo.grid.GroupRow;

                        if (panel.columns[c].dataType === wijmo.DataType.Boolean) {
                            let checkBox = <HTMLInputElement>cell.querySelector('[type="checkbox"]');
                            if (checkBox) {
                                checkBox.checked = g.getCellValue(r, c);
                                checkBox.disabled = checkBox.disabled || !g.canEditCell(r, c);
                            }
                        } else if (bcol.dataMap && !isGroupRow) {
                            let val = g.getCellValue(r, c, true);
                            let fc = cell.firstChild;
                            if (fc && fc.nodeType === 3 && fc.nodeValue !== val) {
                                fc.nodeValue = val
                            }
                        } else {
                            // Only when the cell is not customized by itemFormatter or formatItem, flexsheet will handle the cell content itself.
                            // Otherwise the customized cell content will be lost.
                            if (cell.childElementCount === 0 && cell.textContent === g.getCellData(r, c, true)) {
                                let val = g.getCellValue(r, c, true),
                                    format = (styleInfo ? styleInfo.format : null) || (isGroupRow ? null : bcol.format);

                                if (val !== '' && wijmo.isNumber(+val) && !isNaN(+val) && /[hsmy\:]/i.test(format)) {
                                    let dateVal = FlexSheet._fromOADate(+val);
                                    if (!isNaN(dateVal.getTime())) {
                                        val = wijmo.Globalize.formatDate(dateVal, format);
                                    }
                                }
                                if (format || !isGroupRow) {
                                    val = wijmo.isString(val) ? val.replace(/^(\')(\s*[\w|=])/, '$2') : val;
                                    if (wijmo.isString(val)) {
                                        if (val && this._isURL(val)) {
                                            cell.innerHTML = '<a href="' + val + '" target="_blank">' + wijmo.escapeHtml(val) + '</a>';
                                        } else {
                                            cell.innerHTML = wijmo.escapeHtml(val);;
                                        }
                                    } else {
                                        cell.innerHTML = val;
                                    }
                                }
                            }
                        }
                    }

                    if (styleInfo) {
                        var st = cell.style,
                            styleInfoVal: ICellStyle;

                        for (var styleProp in styleInfo) {
                            if (styleProp === 'className') {
                                if (styleInfo.className) {
                                    wijmo.addClass(cell, styleInfo.className);
                                }
                            } else if (styleProp !== 'format' && (styleInfoVal = styleInfo[styleProp])) {
                                if ((wijmo.hasClass(cell, 'wj-state-selected') || wijmo.hasClass(cell, 'wj-state-multi-selected'))
                                    && (styleProp === 'color' || styleProp === 'backgroundColor')) {
                                    st[styleProp] = '';
                                } else if (styleProp === 'whiteSpace' && styleInfoVal === 'normal') {
                                    // Remove the whiteSpace style if the value of whiteSpace is normal. TFS 247165.
                                    // Because the whiteSpace style will cause the cell measure the width incorrectly.
                                    st[styleProp] = '';
                                } else {
                                    // the borders will be set just below
                                    if (borderRe.test(styleProp)) {
                                        continue;
                                    }

                                    st[styleProp] = styleInfoVal;
                                }
                            }
                        }
                    }

                    // Set borders
                    var brd = this._getCellBorders(g, g.selectedSheet, rng ? rng : new wijmo.grid.CellRange(r, c));
                    if (brd) {
                        for (let prop in brd) {
                            cell.style[prop] = brd[prop];
                        }
                    }
                }

                if (!!cell.style.backgroundColor || !!cell.style.color) {
                    if (!styleInfo) {
                        styleInfo = {};
                        // ???
                        //if (currentSheet) {
                        //    currentSheet._styledCells[cellIndex]
                        //}
                    }
                    if (!!cell.style.backgroundColor) {
                        styleInfo.backgroundColor = cell.style.backgroundColor;
                    }
                    if (!!cell.style.color) {
                        styleInfo.color = cell.style.color;
                    }
                }

                break;
        }

        if (panel.cellType === wijmo.grid.CellType.Cell) {
            if (r === (<FlexSheet>g)._lastVisibleFrozenRow && !wijmo.hasClass(cell, 'wj-frozen-row')) {
                wijmo.addClass(cell, 'wj-frozen-row');
            }

            if (c === (<FlexSheet>g)._lastVisibleFrozenColumn && !wijmo.hasClass(cell, 'wj-frozen-col')) {
                wijmo.addClass(cell, 'wj-frozen-col');
            }
        }
    }

    // Reset the styles of the cell.
    private _resetCellStyle(cell: HTMLElement) {
        var s = cell.style;
        s.fontFamily = '';
        s.fontSize = '';
        s.fontStyle = '';
        s.fontWeight = '';
        s.textDecoration = '';
        s.textAlign = '';
        s.verticalAlign = '';
        s.backgroundColor = '';
        s.color = '';
        s.whiteSpace = '';
        s.borderLeftStyle = '';
        s.borderLeftColor = '';
        s.borderLeftWidth = '';
        s.borderRightStyle = '';
        s.borderRightColor = '';
        s.borderRightWidth = '';
        s.borderTopStyle = '';
        s.borderTopColor = '';
        s.borderTopWidth = '';
        s.borderBottomStyle = '';
        s.borderBottomColor = '';
        s.borderBottomWidth = '';
    }

    //// Get the formatted value.
    //private _getFormattedValue(value: number, format: string): string {
    //    var val: string;
    //
    //    if (value !== Math.round(value)) {
    //        format = format.replace(/([a-z])(\d*)(.*)/ig, '$0112$3');
    //    }
    //    val = Globalize.formatNumber(value, format, true);
    //
    //    return val;
    //}

    // Get the first visible cell of the merged range.
    private _getFirstVisibleCell(g: FlexSheet, rng: wijmo.grid.CellRange): wijmo.grid.CellRange {
        var firstVisibleRow: number,
            firstVisibleColumn: number;

        for (firstVisibleRow = rng.topRow; firstVisibleRow <= rng.bottomRow; firstVisibleRow++) {
            if ((<wijmo.grid.Row>g.rows[firstVisibleRow]).isVisible) {
                break;
            }
        }

        for (firstVisibleColumn = rng.leftCol; firstVisibleColumn <= rng.rightCol; firstVisibleColumn++) {
            if ((<wijmo.grid.Column>g.columns[firstVisibleColumn]).isVisible) {
                break;
            }
        }

        return new wijmo.grid.CellRange(firstVisibleRow, firstVisibleColumn);
    }

    // Check whether the content of the cell is valid url
    private _isURL(strUrl): boolean {
        var strRegex = '^(https|http|ftp|rtsp|mms)://'
            + '(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp's user@ 
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP
            + '|'
            + '([0-9a-z_!~*\'()-]+.)*' // domain- www. 
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // second domain 
            + '[a-z]{2,6})' // first level domain- .com or .museum 
            + '(:[0-9]{1,4})?' // port - :80 
            + '(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*',
            re = new RegExp(strRegex);

        return re.test(strUrl);
    }

    // 1. The adjacement borders pairs must be taken into consideration (for example, when resolving the left border of a cell, both currentCellStyle.borderLeft and prevCellStyle.borderRight must be considered).
    // 2. A thicker border has priority if both adjacent borders are set.
    // 3. The left and top borders of the current cell has priority over the prev.right and above.bottom borders if having _equal_ or greater width.
    // 4. The borders, excluding 'double', are distributed between adjacent FlexSheet's cells as follows:
    //
    //   brd = resolved border width / 2;
    //   borderWidth = ceil(brd) if border is originated from the same cell's style.
    //   borderWidth = floor(brd) if border is originated from the adjacement cell's style
    //
    // 5. The double border applies to the only cell that declared it (taking borders priority into account).
    private _getCellBorders(g: FlexSheet, sheet: Sheet, rng: wijmo.grid.CellRange): ICellStyle {
        let styles = sheet && sheet._styledCells;

        if (!styles) {
            return null;
        }

        let r = rng.topRow,
            c = rng.leftCol,
            r2 = rng.bottomRow,
            c2 = rng.rightCol,
            colLen = g.columns.length;

        let cur = styles[r * colLen + c], // top-left
            curBR = styles[r2 * colLen + c2], // bottom-right
            prev = c > 0 ? styles[r * colLen + c - 1] : null,
            next = c2 + 1 < colLen ? styles[r * colLen + c2 + 1] : null,
            above = r > 0 ? styles[(r - 1) * colLen + c] : null,
            below = styles[(r2 + 1) * colLen + c];

        if (!cur && !curBR && !prev && !next && !above && !below) {
            return null;
        }

        let res: ICellStyle = {};

        // Note: to apply a border its style must be specified explicitly. The empty borderXXXStyle value is interpreted as 'none'.

        // cur.left + prev.right
        let cl = cur && (cur.borderLeftStyle && cur.borderLeftStyle !== 'none') && !!(cur.borderLeftColor || cur.borderLeftWidth),
            pr = prev && (prev.borderRightStyle && prev.borderRightStyle !== 'none') && !!(prev.borderRightColor || prev.borderRightWidth);

        if ((!cl && pr) || (cl && pr && parseInt(prev.borderRightWidth || 1 as any) > parseInt(cur.borderLeftWidth || 1 as any))) {
            if (prev.borderRightStyle !== 'double') {
                res.borderLeftColor = prev.borderRightColor;
                res.borderLeftStyle = prev.borderRightStyle;
                //res.borderLeftWidth = Math.ceil(parseInt(prev.borderRightWidth || 1 as any) / 2) + 'px';
                res.borderLeftWidth = Math.floor(parseInt(prev.borderRightWidth || 1 as any) / 2) + 'px';
            }
        } else if (cl) {
            res.borderLeftColor = cur.borderLeftColor;
            res.borderLeftStyle = cur.borderLeftStyle;
            res.borderLeftWidth = cur.borderLeftStyle !== 'double'
                ? Math.ceil(parseInt(cur.borderLeftWidth || 1 as any) / 2) + 'px'
                : res.borderLeftWidth = cur.borderLeftWidth;
        }

        // cur.top + above.bottom
        let ct = cur && (cur.borderTopStyle && cur.borderTopStyle !== 'none') && !!(cur.borderTopColor || cur.borderTopWidth),
            ab = above && (above.borderBottomStyle && above.borderBottomStyle !== 'none') && !!(above.borderBottomColor || above.borderBottomWidth);

        if ((!ct && ab) || (ct && ab && parseInt(above.borderBottomWidth || 1 as any) > parseInt(cur.borderTopWidth || 1 as any))) {
            if (above.borderBottomStyle !== 'double') {
                res.borderTopColor = above.borderBottomColor;
                res.borderTopStyle = above.borderBottomStyle;
                //res.borderTopWidth = Math.ceil(parseInt(above.borderBottomWidth || 1 as any) / 2) + 'px';
                res.borderTopWidth = Math.floor(parseInt(above.borderBottomWidth || 1 as any) / 2) + 'px';
            }
        } else if (ct) {
            res.borderTopColor = cur.borderTopColor;
            res.borderTopStyle = cur.borderTopStyle;
            res.borderTopWidth = cur.borderTopStyle !== 'double'
                ? Math.ceil(parseInt(cur.borderTopWidth || 1 as any) / 2) + 'px'
                : cur.borderTopStyle;
        }

        // cur.right + next.left
        let cr = curBR && (curBR.borderRightStyle && curBR.borderRightStyle !== 'none') && !!(curBR.borderRightColor || curBR.borderRightWidth),
            nl = next && (next.borderLeftStyle && next.borderLeftStyle !== 'none') && !!(next.borderLeftColor || next.borderLeftWidth);

        if ((!cr && nl) || (cr && nl && parseInt(next.borderLeftWidth || 1 as any) >= parseInt(curBR.borderRightWidth || 1 as any))) {
            if (next.borderLeftStyle !== 'double') {
                res.borderRightColor = next.borderLeftColor;
                res.borderRightStyle = next.borderLeftStyle;
                res.borderRightWidth = Math.floor(parseInt(next.borderLeftWidth || 1 as any) / 2) + 'px';
            }
        } else if (cr) {
            res.borderRightColor = curBR.borderRightColor;
            res.borderRightStyle = curBR.borderRightStyle;
            res.borderRightWidth = curBR.borderRightStyle !== 'double'
                //? Math.floor(parseInt(curBtmRght.borderRightWidth || 1 as any) / 2) + 'px'
                ? Math.ceil(parseInt(curBR.borderRightWidth || 1 as any) / 2) + 'px'
                : curBR.borderRightWidth;
        }

        // cur.bottom + below.top
        let cb = curBR && (curBR.borderBottomStyle && curBR.borderBottomStyle !== 'none') && !!(curBR.borderBottomColor || curBR.borderBottomWidth),
            bt = below && (below.borderTopStyle && below.borderTopStyle !== 'none') && !!(below.borderTopColor || below.borderTopWidth);

        if ((!cb && bt) || (cb && bt && parseInt(below.borderTopWidth || 1 as any) >= parseInt(curBR.borderBottomWidth || 1 as any))) {
            if (below.borderTopStyle !== 'double') {
                res.borderBottomColor = below.borderTopColor;
                res.borderBottomStyle = below.borderTopStyle;
                res.borderBottomWidth = Math.floor(parseInt(below.borderTopWidth || 1 as any) / 2) + 'px';
            }
        } else if (cb) {
            res.borderBottomColor = curBR.borderBottomColor;
            res.borderBottomStyle = curBR.borderBottomStyle;
            res.borderBottomWidth = curBR.borderBottomStyle !== 'double'
                //? Math.floor(parseInt(curBtmRght.borderBottomWidth || 1 as any) / 2) + 'px'
                ? Math.ceil(parseInt(curBR.borderBottomWidth || 1 as any) / 2) + 'px'
                : curBR.borderBottomWidth;
        }

        return res;
    }

    // // Simpler version, the borders are not distributed between adjacent cells.
    // private _getCellBorders2(g: FlexSheet, sheet: Sheet, rng: CellRange): ICellStyle {
    //     let styles = sheet && sheet._styledCells;

    //     if (!styles) {
    //         return null;
    //     }

    //     let r = rng.topRow,
    //         c = rng.leftCol,
    //         r2 = rng.bottomRow,
    //         c2 = rng.rightCol,
    //         colLen = g.columns.length;

    //     let cur = styles[r * colLen + c],
    //         curBtmRght = styles[r2 * colLen + c2],
    //         prev = c > 0 ? styles[r * colLen + c - 1] : null,
    //         next = c2 + 1 < colLen ? styles[r * colLen + c2 + 1] : null,
    //         above = r > 0 ? styles[(r - 1) * colLen + c] : null,
    //         below = styles[(r2 + 1) * colLen + c];

    //     if (!cur && !curBtmRght && !prev && !next && !above && !below) {
    //         return null;
    //     }

    //     var val = g.getCellData(rng.topRow, rng.leftCol, false);

    //     let res: ICellStyle = {};

    //     // 1. A thicker border have priority if the adjacent borders of the adjacent cells are set.
    //     // 2. The left and top borders of the current cell have priority over the prev.right and above.bottom borders if having _equal_ or greater width.

    //     // cur.left + prev.right
    //    let cl = cur && (cur.borderLeftStyle && cur.borderLeftStyle !== 'none') && !!(cur.borderLeftColor || cur.borderLeftWidth),
    //        pr = prev && (prev.borderRightStyle && prev.borderRightStyle !== 'none') && !!(prev.borderRightColor || prev.borderRightWidth);

    //     if ((cl && !pr) || (cl && pr && parseInt(cur.borderLeftWidth || 1 as any) > parseInt(prev.borderRightWidth || 1 as any))) {
    //         res.borderLeftColor = cur.borderLeftColor;
    //         res.borderLeftStyle = cur.borderLeftStyle;
    //         res.borderLeftWidth = cur.borderLeftWidth;
    //     }

    //     // cur.top + above.bottom
    //    let ct = cur && (cur.borderTopStyle && cur.borderTopStyle !== 'none') && !!(cur.borderTopColor || cur.borderTopWidth),
    //        ab = above && (above.borderBottomStyle && above.borderBottomStyle !== 'none') && !!(above.borderBottomColor || above.borderBottomWidth);

    //     if ((ct && !ab) || (ct && ab && parseInt(cur.borderTopWidth || 1 as any) > parseInt(above.borderBottomWidth || 1 as any))) {
    //         res.borderTopColor = cur.borderTopColor;
    //         res.borderTopStyle = cur.borderTopStyle;
    //         res.borderTopWidth = cur.borderTopWidth;
    //     }

    //     // cur.right + next.left
    //    let cr = curBtmRght && (curBtmRght.borderRightStyle && curBtmRght.borderRightStyle !== 'none') && !!(curBtmRght.borderRightColor || curBtmRght.borderRightWidth),
    //        nl = next && (next.borderLeftStyle && next.borderLeftStyle !== 'none') && !!(next.borderLeftColor || next.borderLeftWidth);

    //     if ((cr && !nl) || (cr && nl && parseInt(curBtmRght.borderRightWidth || 1 as any) >= parseInt(next.borderLeftWidth || 1 as any))) {
    //         res.borderRightColor = curBtmRght.borderRightColor;
    //         res.borderRightStyle = curBtmRght.borderRightStyle;
    //         res.borderRightWidth = curBtmRght.borderRightWidth;
    //     }

    //     // cur.bottom + below.top
    //    let cb = curBtmRght && (curBtmRght.borderBottomStyle && curBtmRght.borderBottomStyle !== 'none') && !!(curBtmRght.borderBottomColor || curBtmRght.borderBottomWidth),
    //        bt = below && (below.borderTopStyle && below.borderTopStyle !== 'none') && !!(below.borderTopColor || below.borderTopWidth);

    //     if ((cb && !bt) || (cb && bt && parseInt(curBtmRght.borderBottomWidth || 1 as any) >= parseInt(below.borderTopWidth || 1 as any))) {
    //         res.borderBottomColor = curBtmRght.borderBottomColor;
    //         res.borderBottomStyle = curBtmRght.borderBottomStyle;
    //         res.borderBottomWidth = curBtmRght.borderBottomWidth;
    //     }

    //     return res;
    // }
}
    }
    


    module wijmo.grid.sheet {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.sheet', wijmo.grid.sheet);





















    }
    