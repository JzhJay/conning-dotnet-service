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


    module wijmo.react {
    




export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}

export function softGridDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}

    }
    


    module wijmo.react {
    




//import * as wjcGridDetail from '@grapecity/wijmo.grid.detail';


// Mockup for CellFactory in global modules, to allow DirectiveCellFactory be loaded in case 
// of absent wijmo.grid module.
var __gridCFRef = wijmo.grid && wijmo.grid.CellFactory;
if (!__gridCFRef) {
    (<any>window['wijmo']).grid = {};
    (<any>window['wijmo'].grid).CellFactory = function () { };
}

export abstract class DirectiveCellFactoryBase extends wijmo.grid.CellFactory {
    // Array of string members of the GridCellTemplateType enum.
    private static _templateTypes: string[];
    private static _cellStampProp = '__wjCellStamp';
    private static _FOCUS_INTERVAL = wijmo.Control._FOCUS_INTERVAL + 20; // TFS 316133

    //public grid: WjFlexGrid;
    public grid: wijmo.grid.FlexGrid;

    private _baseCf: wijmo.grid.CellFactory;
    // private _gridCdRef: ChangeDetectorRef;
    // private _needsCdCheck = false;

    private _closingApplyTimeOut;
    private _lastApplyTimeStamp = 0;
    private _noApplyLag = false;
    private _editChar: string;
    private _startingEditing = false;
    private _evtInput: any;
    private _evtBlur: any;
    private _cellStampCounter = 0;
    private _cellEditorVars;
    private _composing = false;


    constructor(grid: wijmo.grid.FlexGrid/*, gridCdRef: ChangeDetectorRef*/) {
        super();
        this.grid = grid;
        //this._gridCdRef = gridCdRef;

        // init _templateTypes
        if (!DirectiveCellFactoryBase._templateTypes) {
            DirectiveCellFactoryBase._templateTypes = [];
            for (var templateType in GridCellTemplateType) {
                if (isNaN(<any>templateType)) {
                    DirectiveCellFactoryBase._templateTypes.push(templateType);
                }
            }
        }

        var self = this;
        this._baseCf = grid.cellFactory;
        grid.cellFactory = this;

        // initialize input event dispatcher
        this._evtInput = document.createEvent('HTMLEvents');
        this._evtInput.initEvent('input', true, false);
        // initialize blur event dispatcher
        this._evtBlur = document.createEvent('HTMLEvents');
        this._evtBlur.initEvent('blur', false, false);

        // no $apply() lag while editing
        grid.prepareCellForEdit.addHandler(function (s, e) {
            self._noApplyLag = true;
        });
        grid.cellEditEnded.addHandler(function (s, e: wijmo.grid.CellRangeEventArgs) {
            let rng = e.range,
                colIdx = rng.col;
            // If column has no cell edit template, clear _editChar buffer.
            if (colIdx < 0 || colIdx < grid.columns.length &&
                    //!grid.columns[e.range.col][DirectiveCellFactoryBase.getTemplContextProp(GridCellTemplateType.CellEdit)]) {
                    !grid._getBindingColumn(grid.cells, rng.row, grid.columns[colIdx])[DirectiveCellFactoryBase.getTemplContextProp(GridCellTemplateType.CellEdit)]) {
                self._editChar = null;
            }
            setTimeout(function () {
                self._noApplyLag = false;
            }, 300);
        });
        grid.beginningEdit.addHandler(function (s, e) {
            self._startingEditing = true;
        });

        grid.hostElement.addEventListener('keydown', function (e) {
            self._startingEditing = false;
        }, true);

        grid.hostElement.addEventListener('keypress', function (e) {
            var char = e.charCode > 32 ? String.fromCharCode(e.charCode) : null;
            // check also that it has been happened not in a nested grid
            if (char && wijmo.closest(e.target, '.wj-flexgrid') === grid.hostElement) {
                // Grid's _KeyboardHandler may receive 'keypress' before or after this handler (observed at least in IE,
                // not clear why this happens). So both grid.activeEditor and _startingEditing (the latter is initialized in
                // beginningEdit and cleared in 'keydown') participate in detecting whether this char has initialized a cell
                // editing.
                if (!grid.activeEditor || self._startingEditing) {
                    self._editChar = char;
                    setTimeout(() => {
                        // if grid didn't get into an edit mode after a while then clear the buffer -
                        // this was input not related to editing, e.g. input to a read-only cell
                        // or somewhere else.
                        if (!grid.activeEditor) {
                            self._editChar = null;
                        }
                    }, 0);
                } else if (self._editChar) {
                    self._editChar += char;
                }
            }
        }, true);

        grid.hostElement.addEventListener('compositionstart', function (e) {
            self._composing = true;
        }, true);

        grid.hostElement.addEventListener('compositionend', function (e) {
            self._composing = false;
        }, true);

        // // If host component uses OnPush change detection, we need to markForCheck; otherwise,
        // // cell template bindings will not be updated.
        // grid.updatedView.addHandler(() => {
        //     if (this._needsCdCheck) {
        //         this._needsCdCheck = false;
        //         this._gridCdRef.markForCheck();
        //     }
        // }, this);
    }

    public updateCell(panel: wijmo.grid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {

        this._cellStampCounter = (this._cellStampCounter + 1) % 10000000;
        let cellStamp = cell[DirectiveCellFactoryBase._cellStampProp] = this._cellStampCounter;
            


        // restore overflow for any cell
        if (cell.style.overflow) {
            cell.style.overflow = '';
        }

        let riOriginal = rowIndex,
            ciOriginal = colIndex;
        if (rng && !rng.isSingleCell) {
            rowIndex = rng.row;
            colIndex = rng.col;
        }

        let self = this,
            grid = <wijmo.grid.FlexGrid>panel.grid,
            editRange = grid.editRange,
            templateType: GridCellTemplateType,
            row = <wijmo.grid.Row>panel.rows[rowIndex],
            dataItem = row.dataItem,
            isGridCtx = false,
            needCellValue = false,
            isEdit = false,
            isCvGroup = false;
            

            // determine template type
            switch (panel.cellType) {
                case wijmo.grid.CellType.Cell:
                    if (editRange && editRange.row === rowIndex && editRange.col === colIndex) {
                        templateType = GridCellTemplateType.CellEdit;
                        needCellValue = isEdit = true;
                    } else if (row instanceof wijmo.grid.GroupRow) {
                        isCvGroup = dataItem instanceof wijmo.collections.CollectionViewGroup;
                        var isHierNonGroup = !(isCvGroup || (<wijmo.grid.GroupRow>row).hasChildren);
                        if (colIndex == panel.columns.firstVisibleIndex) {
                            // if (isHierNonGroup) {
                            //     templateType = GridCellTemplateType.Cell;
                            // } else if (rowIndex === 0) {
                            //     templateType = GridCellTemplateType.GroupHeader;
                            // }
                            templateType = isHierNonGroup ? GridCellTemplateType.Cell : GridCellTemplateType.GroupHeader;
                        } else {
                            templateType = isHierNonGroup ? GridCellTemplateType.Cell : GridCellTemplateType.Group;
                            needCellValue = true;
                        }
                    } else if (row instanceof wijmo.grid._NewRowTemplate) {
                        templateType = GridCellTemplateType.NewCellTemplate;
                    } else if (!(softGridDetail() && softGridDetail().DetailRow &&
                        (row instanceof softGridDetail().DetailRow))) {
                        templateType = GridCellTemplateType.Cell;
                    }
                    break;
                case wijmo.grid.CellType.ColumnHeader:
                    templateType = GridCellTemplateType.ColumnHeader;
                    break;
                case wijmo.grid.CellType.RowHeader:
                    templateType = grid.collectionView &&
                        (<wijmo.collections.IEditableCollectionView>grid.collectionView).currentEditItem === dataItem
                        ? GridCellTemplateType.RowHeaderEdit
                        : GridCellTemplateType.RowHeader;
                    isGridCtx = true;
                    break;
                case wijmo.grid.CellType.TopLeft:
                    templateType = GridCellTemplateType.TopLeft;
                    isGridCtx = true;
                    break;
                case wijmo.grid.CellType.ColumnFooter:
                    templateType = GridCellTemplateType.ColumnFooter;
                    needCellValue = true;
                    break;
                case wijmo.grid.CellType.BottomLeft:
                    templateType = GridCellTemplateType.BottomLeft;
                    isGridCtx = true;
                    break;
            }

        var isUpdated = false;

        if (templateType != null) {

            // var col = <wjcGrid.Column>(isCvGroup && templateType == GridCellTemplateType.GroupHeader ?
            //     grid.getColumn(dataItem.groupDescription['propertyName']) :
            //     (colIndex >= 0 && colIndex < panel.columns.length ? 
            //         grid._getBindingColumn(panel, rowIndex, panel.columns[colIndex]) : null)
            //     );
            let col: wijmo.grid.Column = null;
            if (isCvGroup && templateType == GridCellTemplateType.GroupHeader) {
                col = grid.getColumn(dataItem.groupDescription['propertyName']);
            } else if (colIndex >= 0 && colIndex < panel.columns.length) {
                if (panel.cellType === wijmo.grid.CellType.ColumnHeader && grid._hasColumnGroups()) {
                    col = grid._getColumnGroup(rowIndex, colIndex);
                } else {
                    col = grid._getBindingColumn(panel, rowIndex, panel.columns[colIndex]);
                }
            }

            if (col) {
                var getTemplContextProp = DirectiveCellFactoryBase.getTemplContextProp,
                    templContextProp = getTemplContextProp(templateType),
                    templContext = <ICellTemplateInfo>(isGridCtx ? <any>grid : <any>col)[templContextProp];

                // maintain template inheritance
                if (!templContext) {
                    if (templateType === GridCellTemplateType.RowHeaderEdit) {
                        templateType = GridCellTemplateType.RowHeader;
                        templContextProp = getTemplContextProp(templateType);
                        templContext = grid[templContextProp];
                    } else if (templateType === GridCellTemplateType.Group || templateType === GridCellTemplateType.GroupHeader) {
                        if (!isCvGroup) {
                            templateType = GridCellTemplateType.Cell;
                            templContextProp = getTemplContextProp(templateType);
                            templContext = col[templContextProp];
                        }
                    }
                }

                if (templContext) {
                    // apply directive template and style
                    var isTpl = true,
                        cellValue;
                    if (needCellValue) {
                        cellValue = panel.getCellData(rowIndex, colIndex, false);
                    }

                    // apply cell template
                    if (isTpl) {

                            isUpdated = true;
                            let measureAttr = cell.getAttribute(wijmo.grid.FlexGrid._WJS_MEASURE),
                                isMeasuring = measureAttr && measureAttr.toLowerCase() === 'true';

                            if (isEdit) {
                                //this._doDisposeCell(cell);
                                this.clearCell(cell);
                                this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng, true);
                        }

                        // if this is false then we can't reuse previously cached scope and linked tree.
                        let 
                            // Grid uses "ime editor" if grid.imeEnabled=true, even if not
                            // an IME input is currently happening. So we need to differentiate
                            // this two different modes, in the isImeInput and isTrueImeInput
                            // variables.
                            //isImeInput = isEdit && this._composing && grid.imeEnabled;
                            isImeInput = isEdit && grid.imeEnabled,
                            isTrueImeInput = isImeInput && this._composing,
                            //cellContext = <ICellTemplateCache>(cell[templContextProp] || {}),
                            cellContext = <ICellTemplateCache>(cell[templContextProp]), //can be a null
                            cellRenderInfo: ICellRenderingInfo = { 
                                cell: cell, 
                                column: col,
                                row: row,
                                panel: panel,
                                rng: rng,
                                isEdit: isEdit,
                                isImeInput: isImeInput,
                                isTrueImeInput: isTrueImeInput,
                                templateContext: templContext, 
                                templateCache: cellContext,
                                templateContextProperty: templContextProp,
                                cellStamp: cellStamp,
                                cellValue: cellValue
                            },
                            isForeignCell = this.shouldInstantiate(cellRenderInfo);
                        //console.log(`col=${colIndex} row = ${rowIndex} isForeignCell=${isForeignCell}`);

                        let cellInfo;
                        if (isForeignCell) {
                            if (isEdit) {
                                var rootEl = cell.firstElementChild;
                                if (rootEl) {
                                    // set focus to cell, because hiding a focused element may move focus to a page body
                                    // that will force Grid to finish editing.
                                    if (!isImeInput) {
                                        cell.focus();
                                    }
                                    (<HTMLElement>rootEl).style.display = 'none';
                                }
                            } else {
                                // cell.textContent = '';
                                // this._doDisposeCell(cell);
                                this.clearCell(cell);
                            }

                            // TBD: moved up; check if it's Ok for isEdit==true
                            this._doDisposeCell(cell);

                            // let vrContext = {};
                            // cellInfo = this._setViewRefContext(vrContext, row, col,
                            //     dataItem, cellValue, templContext.valuePaths);
                            // let templInstance = templContext._instantiateTemplate(cell, vrContext);
                            // cellContext.column = col;
                            // cellContext.viewRef = templInstance.viewRef;
                            // cellContext.rootElement = templInstance.rootElement;
                            // cellContext.templateContextProperty = templContextProp;
                            // cell[templContextProp] = cellContext;

                            this.renderTemplate(cellRenderInfo, true);
                            cellRenderInfo.templateCache = cellContext = 
                                cell[templContextProp];
                            cellInfo = cellRenderInfo.cellBindingsData;
                        } else {
                            // cellInfo = this._setViewRefContext(cellContext.viewRef.context, row, col,
                            //     dataItem, cellValue, templContext.valuePaths);

                            this.renderTemplate(cellRenderInfo, false);
                            cellInfo = cellRenderInfo.cellBindingsData;
                        }

                        if (templContext.cellOverflow) {
                            cell.style.overflow = templContext.cellOverflow;
                        }

                        if (isMeasuring) {
                            //force local template 'cell' var values to be applied immediately
                            //templContext.cdRef.detectChanges();
                            this.applyImmediately(cellRenderInfo);
                        } else if (templContext.autoSizeRows && !isImeInput) {
                            // Increase row height if cell doesn't fit in the current row height.
                            // Run it out of ngZone, to prevent unnecessary change detections.
                            //WjDirectiveBehavior.ngZone.runOutsideAngular(() => {
                                // setTimeout(() => {
                                //     // ignore the cell if it is already obsolete at this moment
                                //     if (cellStamp !== cell[DirectiveCellFactoryBase._cellStampProp]) {
                                //         return;
                                //     }
                                //     var cellHeight = cell.scrollHeight,
                                //         panelRows = panel.rows,
                                //         rowSpan = rng && rng.rowSpan || 1;
                                //     if (panelRows.maxSize != null) {
                                //         cellHeight = Math.min(cellHeight, panelRows.maxSize);
                                //     }
                                //     // TBD: it's not clear why we need (cellHeight - 1), but without it may get to an 
                                //     // infinite loop. It's not the issue in Ng2 Explorer.
                                //     if (rowIndex < panelRows.length &&
                                //         (panelRows[rowIndex].renderHeight * rowSpan) < (cellHeight - 1)) {
                                //         panelRows.defaultSize = cellHeight / rowSpan;
                                //         if (isEdit) {
                                //             let isFullEdit = self._isFullEdit();
                                //             grid.refresh();
                                //             grid.startEditing(isFullEdit);
                                //             return;
                                //         }
                                //     } else if (isEdit) {
                                //         this._initEditInput(cellContext, templContext, null);
                                //     };
                                // }, 0);
                            //});
                            this.checkHeight(cellRenderInfo);
                        } else if (isEdit) {
                            setTimeout(() => {
                                //AlexI
                                if (isImeInput) {
                                //if (isTrueImeInput) {
                                    this._initImeEditInput(cellContext, templContext);
                                } else {
                                    // if (isImeInput) {
                                    //     // AlexI: POC
                                    //     let imeEditor = <HTMLInputElement | HTMLTextAreaElement>wjcCore.getActiveElement();
                                    //     wjcCore.setCss(imeEditor, wjcGrid._ImeHandler._cssHidden);
                                    //     this.setEditorFocusFlag(true);
                                    // }
                                    this._initEditInput(cellContext, templContext, null);
                                }
                            }, 0);
                        }


                        if (isEdit) {
                            self._cellEditorVars = cellInfo.localVars;
                            var editEndingEH = function (s, e) {
                                grid.cellEditEnding.removeHandler(editEndingEH);
                                // Move focus out of the current input element, in order to let it to save
                                // its value (necessary for controls like InputDate that can't update value immediately
                                // as user typing).
                                // We do it via event emulation, instead of moving focus to another element,
                                // because in IE an element doesn't fit in time to receive the 'blur' event.
                                if (!e.stayInEditMode) {
                                    let activeElement = wijmo.getActiveElement();
                                    if (activeElement) {
                                        activeElement.dispatchEvent(self._evtBlur);
                                    }
                                    // We need to move focus nevertheless, because without this grid may lose focus at all in IE.
                                    if (wijmo.contains(cell, wijmo.getActiveElement())) {
                                        cell.focus();
                                    }
                                }
                                self._triggerEditorEvents(cell);
                                if (!(e.cancel || e.stayInEditMode)) {
                                    //e.cancel = true;
                                    let cellVar = cellInfo.localVars,
                                        //newVal = cellVar.value,
                                        bindNames = Object.getOwnPropertyNames(cellInfo.bindings);
                                    // set cell value
                                    //panel.grid.setCellData(rowIndex, colIndex, newVal);
                                    // set values for valuePaths
                                    for (let curName of bindNames) {
                                        (<wijmo.Binding>cellInfo.bindings[curName]).setValue(cellVar,
                                            cellInfo.localVars.values[curName]);
                                    }
                                }

                                // close all open dropdowns 
                                var dropDowns = cell.querySelectorAll('.wj-dropdown');
                                [].forEach.call(dropDowns, function (el) {
                                    var ctrl = wijmo.Control.getControl(el);
                                    if (ctrl && softInput() && ctrl instanceof softInput().DropDown) {
                                        (<wijmo.input.DropDown>ctrl).isDroppedDown = false;
                                    }
                                });
                            };

                            let editEndedEH = function (s, e) {
                                grid.cellEditEnded.removeHandler(editEndedEH);
                                self._cellEditorVars = null;
                            }

                            // subscribe the handler to the cellEditEnding event
                            grid.cellEditEnding.addHandler(editEndingEH);
                            grid.cellEditEnded.addHandler(editEndedEH);
                        } else {
                            this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng, false);
                        }

                    }
                }
            }
        }

        if (!isUpdated) {
            this._doDisposeCell(cell);
            this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng);
        }

    }

    public getEditorValue(g: wijmo.grid.FlexGrid): any {
        if (this._cellEditorVars) {
            // trigger all pending async events in the child Wijmo controls immediately
            let editRange = g.editRange;
            if (editRange && editRange.isValid) {
                this._triggerEditorEvents(g.cells.getCellElement(editRange.row, editRange.col));
            }
            return this._cellEditorVars.value;
        } else {
            return super.getEditorValue(g);
        }
    }
    disposeCell(cell: HTMLElement) {
        this._doDisposeCell(cell);
    }

    // ****** framework specific overrides
    /**
     * Indicates whether a new template instance must be created for the cell.
     * @param cell 
     * @param templContextProp 
     */
    protected abstract shouldInstantiate(cellInfo: ICellRenderingInfo): boolean;
    protected abstract renderTemplate(cellInfo: ICellRenderingInfo, initNew: boolean);
    protected disposeTemplate(cell: HTMLElement, templateCache: ICellTemplateCache, 
            templateContext: ICellTemplateInfo) {
        if (templateCache) {
            templateCache.rootElement = null;
            templateCache.column = null;
            cell[templateCache.templateContextProperty] = null;
            templateCache.templateContextProperty = null;
        }
    }
    /**
     * Forces template to apply all changes immediately (apply bindings, etc - whatever is relevant),
     * to make its size up to date. Usually used in cell size measurement scenarios.
     * @param cellInfo 
     */
    protected abstract applyImmediately(cellInfo: ICellRenderingInfo); 
    /**
     * Causes the control to immediately trigger pending framework events.
     * @param control 
     */  
    protected abstract flushPendingEvents(control: wijmo.Control);
    protected abstract getEditorFocusFlag(): boolean;
    protected abstract setEditorFocusFlag(value: boolean);
    //protected abstract instantiateTemplate(cellInfo: ICellRenderingInfo);
    protected setBindingsData(context: any, row: wijmo.grid.Row, col: wijmo.grid.Column,
        dataItem, cellValue, valuePaths: Object): CellBindingsData {
        //this._needsCdCheck = true;
        context.row = row;
        context.col = col;
        context.item = dataItem;
        let values = {},
            //cellCtx = { row: row, col: col, item: dataItem, value: cellValue, values: values },
            cellCtx = context.cell || {},
            bindings = {},
            ret = { localVars: cellCtx, bindings: bindings };
        cellCtx.row = row;
        cellCtx.col = col;
        cellCtx.item = dataItem;
        cellCtx.value = cellValue;
        cellCtx.values = values;

        if (valuePaths) {
            let pathNames = Object.getOwnPropertyNames(valuePaths);
            for (let pName of pathNames) {
                let binding = new wijmo.Binding(valuePaths[pName]);
                bindings[pName] = binding;
                values[pName] = binding.getValue(cellCtx);
            }
        }
        if (context.cell !== cellCtx) {
            context.cell = cellCtx;
        }
        return ret;
    }
    protected checkHeight(cellInfo: ICellRenderingInfo) {
        //console.log(`checkHeight`)
        setTimeout(() => {
            let cell = cellInfo.cell;
            // ignore the cell if it is already obsolete at this moment
            if (cellInfo.cellStamp !== cell[DirectiveCellFactoryBase._cellStampProp]) {
                return;
            }
            var cellHeight = cell.scrollHeight,
                panelRows = cellInfo.panel.rows,
                rowIndex = cellInfo.row.index,
                rng = cellInfo.rng,
                rowSpan = rng && rng.rowSpan || 1,
                isEdit = cellInfo.isEdit;
            if (panelRows.maxSize != null) {
                cellHeight = Math.min(cellHeight, panelRows.maxSize);
            }
            // TBD: it's not clear why we need (cellHeight - 1), but without it may get to an 
            // infinite loop. It's not the issue in Ng2 Explorer.
            if (rowIndex < panelRows.length &&
                    (panelRows[rowIndex].renderHeight * rowSpan) < (cellHeight - 1)) {
                panelRows.defaultSize = cellHeight / rowSpan;
                if (isEdit) {
                    let isFullEdit = this._isFullEdit(),
                        grid = this.grid;
                    grid.refresh();
                    //console.log(`checkHeight: startEditing`)
                    grid.startEditing(isFullEdit);
                    return;
                }
            } else if (isEdit) {
                if (cellInfo.isImeInput) {
                    this._initImeEditInput(cellInfo.templateCache, cellInfo.templateContext);    
                } else {
                    this._initEditInput(cellInfo.templateCache, cellInfo.templateContext, null);
                }
            };
        }, 0);
    }

    protected doDisposeCell(cell: HTMLElement) {
        var ttm = DirectiveCellFactoryBase._templateTypes;
        for (var i = 0; i < ttm.length; i++) {
            var templContextProp = DirectiveCellFactoryBase.getTemplContextProp(GridCellTemplateType[ttm[i]]),
                cellContext = <ICellTemplateCache>(cell[templContextProp]);
            if (cellContext) {
                let templateOwner = cellContext.column || this.grid,
                    templateContext = <ICellTemplateInfo>templateOwner[templContextProp];
                this.disposeTemplate(cell, cellContext, templateContext);
            }

            // if (cellContext && cellContext.viewRef) {
            //     let templateOwner = cellContext.column || this.grid,
            //         templateContext = <WjFlexGridCellTemplate>templateOwner[templContextProp];
            //     if (templateContext) {
            //         let viewIdx = templateContext.viewContainerRef.indexOf(cellContext.viewRef);
            //         if (viewIdx > -1) {
            //             templateContext.viewContainerRef.remove(viewIdx);
            //         }
            //     }
            //     cellContext.viewRef = null;
            //     cellContext.rootElement = null;
            //     cellContext.column = null;
            //     cellContext.templateContextProperty = null;
            //     cell[templContextProp] = null;
            // }
        }
    }

    protected abstract clearCell(cell: HTMLElement);

    // ****** End Of framework specific overrides

    static getTemplContextProp(templateType: GridCellTemplateType) {
        return '$__cellTempl' + GridCellTemplateType[templateType];
    }
    

    private _doDisposeCell(cell: HTMLElement) {
        this.doDisposeCell(cell);
    }

    // finds a first input element in the edit template and initializes it with a data typed by keyboard
    // private _initEditInput(cellContext: _ICellTemplateCache, templContext: WjFlexGridCellTemplate,
    private _initEditInput(cellContext: ICellTemplateCache, templContext: ICellTemplateInfo,
        initialValue: string) {

        // let setFocus = this.grid._edtFocus !== false;
        // this.grid._edtFocus = null;
        let setFocus = this.getEditorFocusFlag() !== false;
        this.setEditorFocusFlag(null);
        this._setFullEdit(templContext);
        if (setFocus) {
            let input = this._findInitialInput(cellContext);
            if (input) {
                var inpFocusEh = () => {
                    input.removeEventListener('focus', inpFocusEh);
                    setTimeout(() => {
                        setTimeout(() => {
                            let value = initialValue != null ? initialValue : this._editChar;
                            if (value) {
                                input.value = value;
                                this._editChar = null;
                                DirectiveCellFactoryBase._setSelectionRange(input, value.length, value.length);
                                //console.log(`_initEditInput, _setSelectionRange: value: [${value}] start/end = ${value.length};${input.selectionStart}-${input.selectionEnd}`)
                                input.dispatchEvent(this._evtInput);
                            }
                        }, 0);
                    }, DirectiveCellFactoryBase._FOCUS_INTERVAL);
                };

                input.addEventListener('focus', inpFocusEh);
                input.focus();
            }
        }
    }

    //private _initImeEditInput(cellContext: _ICellTemplateCache, templContext: WjFlexGridCellTemplate) {
    private _initImeEditInput(cellContext: ICellTemplateCache, templContext: ICellTemplateInfo) {
        //console.log(`_initImeEditInput, composing = ${this._composing}`)
        let imeEditor = <HTMLInputElement | HTMLTextAreaElement>wijmo.getActiveElement();
        if (imeEditor && 
                (imeEditor instanceof HTMLInputElement || 
                    imeEditor instanceof HTMLTextAreaElement) && 
                wijmo.hasClass(imeEditor, 'wj-grid-ime')) {
            let templateInput = this._findInitialInput(cellContext),
                templateInputColor = templateInput && templateInput.style.color,
                isComposing = this._composing;
            // if (input) {
            //     input.style.color = "transparent";
            // }
            let compEndEh = () => {
                imeEditor.removeEventListener('compositionend', compEndEh);
                wijmo.setCss(imeEditor, wijmo.grid._ImeHandler._cssHidden);
                //console.log(`_initImeEditInput: hid ime editor`)
                // ensure that template's editor must be focused; otherwise, 
                // the value typed in imeEditor will not be propagated there
                this.setEditorFocusFlag(true);
                // restore template editor's color, which we made transparent before.
                if (templateInput) {
                    templateInput.style.color = templateInputColor;
                }
                this._initEditInput(cellContext, templContext, 
                    //imeEditor.value);
                    isComposing ? imeEditor.value : null);
            };
            // If this is actually not an IME input (non-IME keyboard while grid.imeEnabled=true),
            // we emulate immediate 'compositionend'
            if (!isComposing) {
                //setTimeout(() => setTimeout(() => compEndEh(), 0), 0);
                setTimeout(() => compEndEh(), DirectiveCellFactoryBase._FOCUS_INTERVAL);
                //compEndEh();
            } else {
                imeEditor.addEventListener('compositionend', compEndEh);
                // position/size the editor
                //let templateInput = this._findInitialInput(cellContext);
                if (templateInput) {
                    let tRect = templateInput.getBoundingClientRect(),
                        imeRect = imeEditor.getBoundingClientRect(),
                        imeStyle = window.getComputedStyle(imeEditor),
                        imeStyleLeft = parseFloat(imeStyle.left),
                        imeStyleTop = parseFloat(imeStyle.top);
                    wijmo.setCss(imeEditor, {
                        left: (imeStyleLeft + tRect.left - imeRect.left) + 'px',
                        top: (imeStyleTop + tRect.top - imeRect.top) + 'px',
                        width: tRect.width + 'px',
                        height: tRect.height + 'px'
                    });

                    // make template's editor text invisible, so that it doesn't mix with
                    // text of imeEditor, which can have a transparent background
                    templateInput.style.color = "transparent";
                }
            }
        }
    }

    //private _findInitialInput(cellContext: _ICellTemplateCache): HTMLInputElement | HTMLTextAreaElement {
    private _findInitialInput(cellContext: ICellTemplateCache): HTMLInputElement | HTMLTextAreaElement {
        let inputs = cellContext && cellContext.rootElement
            && cellContext.rootElement.querySelectorAll('input,textarea');
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                var input = <HTMLInputElement | HTMLTextAreaElement>inputs[i],
                    inpSt = window.getComputedStyle(input);
                if (inpSt.display !== 'none' && inpSt.visibility === 'visible') {
                    return input;
                }
            }
        }

        return null;
    }

    private static _setSelectionRange(e: HTMLInputElement | HTMLTextAreaElement, start: number, end = start) {
        //e = asType(e, HTMLInputElement);
        if (wijmo.contains(document.body, e) && !e.disabled && e.style.display != 'none') {
            try {

                // use 'backward' to keep the start in view (but not in Edge! TFS 228053)
                (<HTMLInputElement>e).setSelectionRange(wijmo.asNumber(start), wijmo.asNumber(end), wijmo.isIE() ? null : 'backward');

                // focus needed in Chrome (TFS 124102, 142672) 
                // and after setRange (TFS 228053)
                e.focus();

            } catch (x) { }
        }
    }


    private _triggerEditorEvents(editCell: HTMLElement) {
        if (editCell) {
            let cellCtrlElements = editCell.querySelectorAll('.wj-control');
            for (let i = 0; i < cellCtrlElements.length; i++) {
                let curCtrlElement = cellCtrlElements[i],
                    ctrl = wijmo.Control.getControl(curCtrlElement);
                if (ctrl) {
                    // let behaviour = WjDirectiveBehavior.getBehavior(ctrl);
                    // if (behaviour) {
                    //     behaviour.flushPendingEvents();
                    // }
                    this.flushPendingEvents(ctrl);
                }
            }
        }
    }

    private _isFullEdit() {
        let grid = this.grid;
        return !grid.activeEditor || grid._edtHdl._fullEdit;
    }
    //private _setFullEdit(templContext: WjFlexGridCellTemplate) {
    private _setFullEdit(templContext: ICellTemplateInfo) {
        let grid = this.grid;
        if (templContext.forceFullEdit && grid.activeEditor) {
            grid._edtHdl._fullEdit = true;
        }
    }
}

// Remove wijmo.grid mockup after DirectiveCellFactory has been loaded.
if (!__gridCFRef) {
    (<any>window['wijmo']).grid = null;
}


/**
* Defines the type of cell on which a template is to be applied. This value is specified in the <b>cellType</b> attribute 
* of the frameworks' cell template components/directives.
*/
export enum GridCellTemplateType {
    /** Defines a regular (data) cell. */
    Cell,
    /** Defines a cell in edit mode. */
    CellEdit,
    /** Defines a column header cell. */
    ColumnHeader,
    /** Defines a row header cell. */
    RowHeader,
    /** Defines a row header cell in edit mode. */
    RowHeaderEdit,
    /** Defines a top left cell. */
    TopLeft,
    /** Defines a group header cell in a group row. */
    GroupHeader,
    /** Defines a regular cell in a group row. */
    Group,
    /** Defines a cell in a new row template. */
    NewCellTemplate,
    /** Defines a column footer cell. */
    ColumnFooter,
    /** Defines a bottom left cell (at the intersection of the row header and column footer cells). **/
    BottomLeft

}

// function getTemplContextProp(templateType: CellTemplateType) {
//     return '$__cellTempl' + CellTemplateType[templateType];
// }

export interface ICellTemplateInfo {
    //templateContextProperty: string;
    cellOverflow: string;
    autoSizeRows: boolean;
    forceFullEdit: boolean;
    valuePaths: Object;
}

export interface ICellTemplateCache {
    column?: wijmo.grid.Column;
    templateContextProperty: string;
    rootElement: Element;
    //[propName: string]: any;
}

export interface ICellRenderingInfo {
    cell: HTMLElement;
    column: wijmo.grid.Column;
    row: wijmo.grid.Row;
    cellValue: any;
    //grid: wjcGrid.FlexGrid,
    panel: wijmo.grid.GridPanel,
    rng: wijmo.grid.CellRange,
    isEdit: boolean,
    isImeInput: boolean,
    isTrueImeInput: boolean,
    templateContextProperty: string;
    templateContext: ICellTemplateInfo;
    templateCache: ICellTemplateCache;
    cellBindingsData?: CellBindingsData;
    cellStamp: number;
    //[propName: string]: any;
}

export interface CellBindingsData { 
    localVars: { 
        row: any, 
        col: any, 
        item: any, 
        value: any, 
        values: any 
    }, 
    bindings?: any 
}
    }
    


    module wijmo.react {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.interop.grid', wijmo.react);



    }
    

    module wijmo.react {
    








/**
 * Base class for all Wijmo components for React.
 */
export class ComponentBase extends React.Component<any, any> {
    static readonly _propsParent = '$parent';
    static readonly _typeSiblingIdProp = '_wjSiblingIdProp';
    static _siblingDirId = 0;

    //private _meta: _IReactComponentMeta;
    private _objPropHash: { [propName: string]: boolean } = {};
    private _isMounted = false;
    private _mountedCBs: (() => void)[] = [];
    private _siblingInsertedEH;

    controlType: any;
    props: any;
    control: any;
    parent: ComponentBase;
    protected _parentProp: string;
    protected _parentInCtor: boolean;
    protected _siblingId: string;

    // use ref callback for react15 cvompatability
    protected _hostRef = ref => this._hostRefValue = ref;
    protected _hostRefValue: HTMLElement;

    constructor(props: any, controlType: any, meta?: any) {
        super(props);
        this.props = props;
        this.controlType = controlType;

        for (let objProp of (meta && (<_IReactComponentMeta>meta).objectProps || [])) {
            this._objPropHash[objProp] = true;
        }
    }

    render(): any {
        this._onBeforeRender();
        const ret = this._renderImpl();
        this._onAfterRender();
        return ret;
    }

    //mounts a new control onto a component
    componentDidMount() {
        if (this._isChild()) {
            let parCmp = <ComponentBase>this.props[ComponentBase._propsParent];
            if (parCmp) {
                parCmp._mountedCB(() => {
                    this._setParent(parCmp);
                });
            }
        } else {
            this._prepareControl();
        } 
        return this.control;

        /*
        // instantiate the control
        var host = <HTMLElement>ReactDOM.findDOMNode(this),
            control = new this.controlType(host),
            cprops = this.props;

        // initialize the control with properties and event handlers,
        // and the host element with the regular HTML properties
        var props = {};
        for (var prop in cprops) {
            if (prop in control) {

                // save property to assign to control later
                props[prop] = cprops[prop];

            } else {

                // assign property to host element
                switch (prop) {
                    case 'className':
                        wijmo.addClass(host, cprops.className);
                        break;
                    case 'style':
                        wijmo.setCss(host, cprops.style);
                        break;
                    default: // id, title, name, etc...
                        if (host[prop] != null) {
                            host[prop] = cprops[prop];
                        }
                        break;
                }
            }
        }

        // apply saved props to control
        control.initialize(props);

        // fire initialize event
        if (wijmo.isFunction(cprops.initialized)) {
            cprops.initialized(control);
        }

        // done creating the control
        return control;
        */

    }

    // disposes of the control associated with a component
    componentWillUnmount() {
        this._onBeforeWillUnmount();
        if (this._siblingInsertedEH) {
            this._getElement().removeEventListener('DOMNodeInserted', this._siblingInsertedEH);
        }

        let control = this.control;
        if (control) {
            if (this._isChild()) {
                let parProp = this._getParentProp();
                if (parProp) {
                    let parControl = this.parent.control,
                        parValue = parControl[parProp];
                    if (wijmo.isArray(parValue)) {
                        let idx = parValue.indexOf(control);
                        if (idx > -1) {
                            parValue.splice(idx, 1);
                        }
                    }
                }
            } else if (control instanceof wijmo.Control) {
                setTimeout(() => {
                    if (control.hostElement) {
                        // don't restore original outerHTML, this may cause CSP violation due to inline styles
                        // (like display: 'none') on child elements 
                        control._orgOuter = null;
                        control.dispose();
                    }
                 });
            }
        }
        //this._getControl(this).dispose();
        this._onAfterWillUnmount();
    }

    ///// Updating controls in shouldComponentUpdate, right before 'render', may cause
    ///// problems under some specific conditions. E.g. if control sets focus to some element
    ///// after its properties change, it may cause the 
    ///// "unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.”
    ///// warning.
    ///// So we moved this logic to componentDidUpdate.

    // // updates the control properties to match its associated component
    // shouldComponentUpdate(nextProps) {
    //     this._onBeforeShouldUpdate();
    //     var ctl = this.control;
    //     this._copy(ctl, nextProps, this.props);
    //     //this._meetChildren(nextProps.children);
    //     this._onAfterShouldUpdate();
    //     return true;
    // }
    
    shouldComponentUpdate(nextProps) {
        return true;
    }

    // updates the control properties to match its associated component
    componentDidUpdate(prevProps) {
        this._onBeforeDidUpdate();
        var ctl = this.control;
        //this._copy(ctl, nextProps, this.props);
        this._copy(ctl, this.props, prevProps);
        //this._meetChildren(nextProps.children);
        this._onAfterDidUpdate();
        //return true;
    }

    _mountedCB(cb: () => void) {
        if (this._isMounted) {
            cb();
        } else {
            this._mountedCBs.push(cb);
        }
    }

    protected _renderImpl(): any {
        let childProps = {};
        childProps[ComponentBase._propsParent] = this;
        // let clonedChildren = React.Children.map(this.props.children, c => {
        //     return React.cloneElement(c as any, childProps);
        // });
        let clonedChildren = React.Children.map(this.props.children, c => {
            return c && React.cloneElement(c as any, childProps);
        });

        const props: any = {
            ref: this._hostRef,
        };
        if (this._isChild()) {
            props.style = { display: 'none' };
        }
        return React.createElement('div', props, clonedChildren);
    }

    readonly _beforeRender = new wijmo.Event();
    protected _onBeforeRender(e?: wijmo.EventArgs) {
        this._beforeRender.raise(this, e);
    }

    readonly _afterRender = new wijmo.Event();
    protected _onAfterRender(e?: wijmo.EventArgs) {
        this._afterRender.raise(this, e);
    }

    readonly _beforeWillUnmount = new wijmo.Event();
    protected _onBeforeWillUnmount(e?: wijmo.EventArgs) {
        this._beforeWillUnmount.raise(this, e);
    }

    readonly _afterWillUnmount = new wijmo.Event();
    protected _onAfterWillUnmount(e?: wijmo.EventArgs) {
        this._afterWillUnmount.raise(this, e);
    }

    readonly _beforeDidUpdate = new wijmo.Event();
    protected _onBeforeDidUpdate(e?: wijmo.EventArgs) {
        this._beforeDidUpdate.raise(this, e);
    }

    readonly _afterDidUpdate = new wijmo.Event();
    protected _onAfterDidUpdate(e?: wijmo.EventArgs) {
        this._afterDidUpdate.raise(this, e);
    }

    // Creates a control instance owned by the directive (analogue of Ng1 _initControl).
    protected _createControl(): any {
        //return this.directive._initControl(this._parentInCtor() ? this.parent.control : this.directiveTemplateElement[0]);
        let param = this._isChild() ? (this._isParentInCtor() ? this.parent.control : undefined)
            : <HTMLElement>this._getElement(),
            control = new this.controlType(param);
        return control;
    }

    //static _wjCmpId = 0;
    // Creates a control and initializes its properties.
    private _prepareControl() {
        // instantiate the control
        let host = <HTMLElement>this._getElement(),
            cprops = this.props;
        // For controls, apply attributes to the host element, so that the control
        // constructor can propagate them to the internal input element.
        if (host && !this._isChild()) {
            ComponentBase._copyAttrs(host, cprops, wijmo.Control._rxInputAtts);
        }
        let control = this.control = this._createControl(),
            isWjControl = control instanceof wijmo.Control,
            CB = ComponentBase;

        // define sibling id
        if (!this._siblingId) {
            if (this.constructor[CB._typeSiblingIdProp] == null) {
                this.constructor[CB._typeSiblingIdProp] = (++CB._siblingDirId) + ''
            }
            this._siblingId = this.constructor[CB._typeSiblingIdProp];
        }
        host.setAttribute(CB._typeSiblingIdProp, this._siblingId);
        //host.setAttribute('_wjCmpId', (++ComponentBase._wjCmpId) + '');


        // initialize the control with properties and event handlers,
        // and the host element with the regular HTML properties
        var props = {};
        // IMPORTANT: this way properties are initialized in the order as they specified on the component
        // element (tag).
        // TBD: rework it to priority based initialization?
        for (var prop in cprops) {
            let propVal = cprops[prop];
            if (this._ignoreProp(prop) || wijmo.isUndefined(propVal)) {
                continue;
            }
            if (prop in control) {

                // save property to assign to control later
                props[prop] = propVal;

            } else {
                this._setHostAttribute(host, prop, propVal);
            }
        }

        // apply saved props to control
        if (isWjControl) {
            control.initialize(props);
        } else {
            this._copy(control, props, null, true);
        }
        this._isMounted = true;

        // Call 'mounted' callbacks
        let cbs = this._mountedCBs;
        this._mountedCBs = [];
        for (let cb of cbs) {
            cb();
        }

        // fire initialize event
        if (wijmo.isFunction(cprops.initialized)) {
            cprops.initialized(control);
        }

        // notify children about the parent
        //this._meetChildren(this.props.children);
    }

    // For child component, initializes its parent after component's 'control' has been created.
    // Can be overridden in the derived class.
    protected _initParent() {
        let parProp = this._getParentProp();
        if (parProp) {
            let parControl = this.parent.control,
                parArr = <any[]>parControl[parProp];
            if (wijmo.isArray(parArr)) {
                //parValue.push(this.control);

                // insert child at correct index, which is the same as an index of the directive element amid sibling directives
                // of the same type
                let linkIdx = this._getSiblingIndex();
                if (linkIdx < 0 || linkIdx >= parArr.length) {
                    linkIdx = parArr.length;
                }
                parArr.splice(linkIdx, 0, this.control);
                this._siblingInsertedEH = this._siblingInserted.bind(this);
                this._getElement().addEventListener('DOMNodeInserted', this._siblingInsertedEH);

            } else {
                parControl[parProp] = this.control;
            }
        }
    }

    // Notifies all the children about their parent
    //private _meetChildren(children) {
    //    React.Children.forEach(children, c => {
    //        if (c instanceof ComponentBase) {
    //            c._setParent(this);
    //        }
    //    });
    //}

    // Called by a parent component to notify child component about its parent availability. 
    private _setParent(parent: ComponentBase) {
        if (parent !== this.parent) {
            if (this.parent) {
                throw 'Wijmo child component is already attached to a different parent.';
            }
            this.parent = parent;
            this._prepareControl();
            this._initParent();
        }
    }


    private _isChild(): boolean {
        return this._parentProp != null || this._parentInCtor != null;
    }
    private _isParentInCtor(): boolean {
        return this._parentInCtor === true;
    }
    private _getParentProp(): string {
        return this.props.wjProperty || this._parentProp;
    }

    // Gets an index of this directive host element among another host elements pertain to the same directive type.
    private _getSiblingIndex() {
        var thisEl = this._getElement(),
            parEl = thisEl.parentElement;
        // If parentElement is null, e.g. because this element is temporary in DocumentFragment, the index
        // of the element isn't relevant to the item's position in the array, so we return -1 and thus force
        // a calling code to not reposition the item in the array at all.  
        if (!parEl) {
            return -1;
        }
        var siblings = parEl.childNodes,
            idx = -1,
            dirId = this._siblingId;
        for (var i = 0; i < siblings.length; i++) {
            var curEl = <HTMLElement>siblings[i];
            if (curEl.nodeType == 1 && curEl.getAttribute(ComponentBase._typeSiblingIdProp) == dirId) {
                ++idx;
                if (curEl === thisEl) {
                    return idx;
                }
            }
        }

        return -1;
    }

    private _siblingInserted(e) {
        if (e.target === this._getElement()) {
            var lIdx = this._getSiblingIndex(),
                control = this.control,
                parArr = <any[]>this.parent.control[this._getParentProp()],
                arrIdx = parArr.indexOf(control);
            if (lIdx >= 0 && arrIdx >= 0 && lIdx !== arrIdx) {
                parArr.splice(arrIdx, 1);
                lIdx = Math.min(lIdx, parArr.length);
                parArr.splice(lIdx, 0, control);
            }
        }
    }

    //private _getControl(component): any {
    //    var host = ReactDOM.findDOMNode(component);
    //    return wijmo.Control.getControl(host);
    //}

    private _copy(dst, src, prevProps?: any, isInit: boolean = false) {
        if (!(dst && src)) {
            return;
        }
        let ctrl,
            dstIsSelf = dst === this.control;
        for (var p in src) {
            if (this._ignoreProp(p) && dstIsSelf) {
                continue;
            }
            var value = src[p];
                //isValid = p in dst || p == 'className' || p == 'style'; // TFS 277044
                //isValid = p in dst; // TFS 277044

            if (/*isValid*/ p in dst) {
                if (this._isEvent(dst, p)) {
                    if (isInit && wijmo.isFunction(value)) {
                        (<wijmo.Event>dst[p]).addHandler(value);
                    }
                } else 
                // If prevProps is used, we will update only if prev and new bound values are different.
                // We can't compare new and current control value during initialization, because 
                // for child components it may be inconsistent, because the child is not assigned 
                // to the parent at the moment. Example: Axis.axisLine
                if (!(prevProps && this._sameValue(prevProps[p], value) /*|| this._sameValue(dst[p], value)*/ )) {
                    if (value == null) { // copy null/undefined
                        dst[p] = value;
                    //} else if (p == 'className') { // copy className
                    //    if (dst.hostElement) {
                    //        wijmo.addClass(dst.hostElement, src[p]);
                    //    }
                    //} else if (p == 'style') { // copy style
                    //    if (dst.hostElement) {
                    //        wijmo.setCss(dst.hostElement, src[p]);
                    //    }
                    } else if (wijmo.isPrimitive(value) || // copy properties declared as PropertyType.Any in metadata
                        wijmo.isFunction(value) ||
                        this._objPropHash[p] && dst === (ctrl || (ctrl = this.control))) {
                        dst[p] = value;
                    } else if (wijmo.isArray(value) && wijmo.isArray(dst[p])) { // copy arrays (of equal size)
                        let dstArr = dst[p],
                            srcArr = value;
                        if (srcArr.length == dstArr.length) {
                            for (var i = 0; i < srcArr.length; i++) {
                                this._copy(dstArr[i], srcArr[i]);
                            }
                        }
                    } else if (wijmo.isObject(value)) { // copy object content
                        this._copy(dst[p], src[p]);
                    }
                }
            } else {
                this._setHostAttribute(dst.hostElement, p, src[p]);
            }
        }
    }

    private _setHostAttribute(host: HTMLElement, attrName: string, attrValue: any) {
        if (!host) {
            return;
        }
        switch (attrName) {
            case 'className':
                wijmo.addClass(host, attrValue);
                break;
            case 'style':
                wijmo.setCss(host, attrValue);
                break;
            default: // id, title, name, etc...
                if (host[attrName] != null) {
                    host[attrName] = attrValue;
                } else if ((typeof attrValue === 'string') && (attrName[0] !== '$')) {
                    host.setAttribute(attrName, attrValue);
                }
                break;
        }
    }

    // compares two objects by value
    private _sameValue(v1, v2): boolean {
        return v1 == v2 || wijmo.DateTime.equals(v1, v2);
    }

    private _isEvent(ctrl: any, propName: string): boolean {
        let propVal = ctrl && ctrl[propName];
        return propVal != null && propVal instanceof wijmo.Event;
    }

    protected _getElement() {
        // TBD: cache it?
        return this._hostRefValue;
    }

    private _ignoreProp(prop: string) {
        return prop === 'children';
    }

    // apply given attributes which match the pattern to an html element
    private static _copyAttrs(e: HTMLElement, atts: any, names: RegExp) {
        if (e) {
            for (let name in atts) {
                if (name.match(names)) {
                    e.setAttribute(name, atts[name]);
                }
            }
        }
    }

    static isInStrictMode(component): boolean {
        const internalReactProp = '_reactInternalFiber';
        return !!(component.hasOwnProperty(internalReactProp) && (component[internalReactProp].mode & 1));
    }
}

interface _IReactComponentMeta {
    // Names of properties declared in metadata with PropertyType.Any.
    objectProps: string[]
}

    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.analytics.TrendLine} class.
     * 
     * The <b>flex-chart-trend-line</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.TrendLine} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartTrendLine extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.TrendLine, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.MovingAverage} class.
     * 
     * The <b>flex-chart-moving-average</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.MovingAverage} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartMovingAverage extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.MovingAverage, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.YFunctionSeries} class.
     * 
     * The <b>flex-chart-y-function-series</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.YFunctionSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartYFunctionSeries extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.YFunctionSeries, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.ParametricFunctionSeries} class.
     * 
     * The <b>flex-chart-parametric-function-series</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.ParametricFunctionSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartParametricFunctionSeries extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.ParametricFunctionSeries, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.Waterfall} class.
     * 
     * The <b>flex-chart-waterfall</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.Waterfall} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartWaterfall extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.Waterfall, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'intermediateTotalPositions', 'intermediateTotalLabels', 'styles']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.BoxWhisker} class.
     * 
     * The <b>flex-chart-box-whisker</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.BoxWhisker} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartBoxWhisker extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.BoxWhisker, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'meanLineStyle', 'meanMarkerStyle']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.ErrorBar} class.
     * 
     * The <b>flex-chart-error-bar</b> component should be contained in
     * a {@link wijmo.react.chart.FlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.ErrorBar} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartErrorBar extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.ErrorBar, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'errorBarStyle', 'value']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.analytics.BreakEven} class.
     * 
     * The <b>flex-chart-break-even</b> component should be contained in
     * a {@link wijmo.react.chart.FlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.BreakEven} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartBreakEven extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.analytics.BreakEven, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'styles']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.animation.ChartAnimation} class.
     * 
     * The <b>flex-chart-animation</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     * , {@link wijmo.react.chart.FlexPie}
     * , {@link wijmo.react.chart.finance.FinancialChart}
     *  or {@link wijmo.react.chart.radar.FlexRadar}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.animation.ChartAnimation} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartAnimation extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.animation.ChartAnimation);
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.annotation.AnnotationLayer} class.
     * 
     * The <b>flex-chart-annotation-layer</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The <b>flex-chart-annotation-layer</b> component may contain
     * a {@link wijmo.react.chart.annotation.FlexChartAnnotation} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.AnnotationLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartAnnotationLayer extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.annotation.AnnotationLayer);
        } 
    }
 
 

    /**
 * React component that represents objects inherited from the 
 * {@link wijmo.chart.annotation.AnnotationBase} class.
     * 
     * The <b>flex-chart-annotation</b> component should be contained in
     * a {@link wijmo.react.chart.annotation.FlexChartAnnotationLayer} component.
     * 
     * The <b>flex-chart-annotation</b> component may contain
     * a {@link wijmo.react.chart.FlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link } class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartAnnotation extends ComponentBase {
	    
        _parentProp = 'items';
        constructor(props) {
            super(props, null, { objectProps: ['point', 'offset', 'style', 'start', 'end']});
        }

        protected _createControl(): any {
            return new wijmo.chart.annotation[this.props['type']]();
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.finance.analytics.Fibonacci} class.
     * 
     * The <b>flex-chart-fibonacci</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Fibonacci} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartFibonacci extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.Fibonacci, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'levels']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.FibonacciArcs} class.
     * 
     * The <b>flex-chart-fibonacci-arcs</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciArcs} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartFibonacciArcs extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.FibonacciArcs, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'start', 'end', 'levels']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.FibonacciFans} class.
     * 
     * The <b>flex-chart-fibonacci-fans</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciFans} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartFibonacciFans extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.FibonacciFans, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'start', 'end', 'levels']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.FibonacciTimeZones} class.
     * 
     * The <b>flex-chart-fibonacci-time-zones</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciTimeZones} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartFibonacciTimeZones extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.FibonacciTimeZones, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'startX', 'endX', 'levels']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.ATR} class.
     * 
     * The <b>flex-chart-atr</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.ATR} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartAtr extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.ATR, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.CCI} class.
     * 
     * The <b>flex-chart-cci</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.CCI} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartCci extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.CCI, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.RSI} class.
     * 
     * The <b>flex-chart-rsi</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.RSI} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartRsi extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.RSI, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.WilliamsR} class.
     * 
     * The <b>flex-chart-williams-r</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.WilliamsR} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartWilliamsR extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.WilliamsR, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.Macd} class.
     * 
     * The <b>flex-chart-macd</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Macd} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartMacd extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.Macd, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'styles']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.MacdHistogram} class.
     * 
     * The <b>flex-chart-macd-histogram</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.MacdHistogram} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartMacdHistogram extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.MacdHistogram, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.Stochastic} class.
     * 
     * The <b>flex-chart-stochastic</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Stochastic} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartStochastic extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.Stochastic, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent', 'styles']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.BollingerBands} class.
     * 
     * The <b>flex-chart-bollinger-bands</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.BollingerBands} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartBollingerBands extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.BollingerBands, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.analytics.Envelopes} class.
     * 
     * The <b>flex-chart-envelopes</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Envelopes} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartEnvelopes extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.analytics.Envelopes, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.finance.FinancialChart} control.
     * 
     * The <b>financial-chart</b> component may contain
     * the following child components: 
     * {@link wijmo.react.chart.analytics.FlexChartTrendLine}
     * , {@link wijmo.react.chart.analytics.FlexChartMovingAverage}
     * , {@link wijmo.react.chart.analytics.FlexChartYFunctionSeries}
     * , {@link wijmo.react.chart.analytics.FlexChartParametricFunctionSeries}
     * , {@link wijmo.react.chart.analytics.FlexChartWaterfall}
     * , {@link wijmo.react.chart.analytics.FlexChartBoxWhisker}
     * , {@link wijmo.react.chart.animation.FlexChartAnimation}
     * , {@link wijmo.react.chart.annotation.FlexChartAnnotationLayer}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartFibonacci}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartFibonacciArcs}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartFibonacciFans}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartFibonacciTimeZones}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartAtr}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartCci}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartRsi}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartWilliamsR}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartMacd}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartMacdHistogram}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartStochastic}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartBollingerBands}
     * , {@link wijmo.react.chart.finance.analytics.FlexChartEnvelopes}
     * , {@link wijmo.react.chart.finance.FinancialChartSeries}
     * , {@link wijmo.react.chart.interaction.FlexChartRangeSelector}
     * , {@link wijmo.react.chart.interaction.FlexChartGestures}
     * , {@link wijmo.react.chart.FlexChartAxis}
     * , {@link wijmo.react.chart.FlexChartLegend}
     * , {@link wijmo.react.chart.FlexChartLineMarker}
     * and {@link wijmo.react.chart.FlexChartPlotArea}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.FinancialChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FinancialChart extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.finance.FinancialChart, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'options', 'selection', 'renderEngine']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.finance.FinancialSeries} class.
     * 
     * The <b>financial-chart-series</b> component should be contained in
     * a {@link wijmo.react.chart.finance.FinancialChart} component.
     * 
     * The <b>financial-chart-series</b> component may contain
     * a {@link wijmo.react.chart.FlexChartAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.FinancialSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FinancialChartSeries extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.finance.FinancialSeries, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.hierarchical.Sunburst} control.
     * 
     * The <b>sunburst</b> component may contain
     * a {@link wijmo.react.chart.FlexChartLegend} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.hierarchical.Sunburst} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Sunburst extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.hierarchical.Sunburst, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'bindingName', 'childItemsPath']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.hierarchical.TreeMap} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.hierarchical.TreeMap} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TreeMap extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.hierarchical.TreeMap, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'bindingName', 'childItemsPath']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.interaction.RangeSelector} class.
     * 
     * The <b>flex-chart-range-selector</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.interaction.RangeSelector} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartRangeSelector extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.interaction.RangeSelector);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.interaction.ChartGestures} class.
     * 
     * The <b>flex-chart-gestures</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.interaction.ChartGestures} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartGestures extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.interaction.ChartGestures);
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.radar.FlexRadar} control.
     * 
     * The <b>flex-radar</b> component may contain
     * the following child components: 
     * {@link wijmo.react.chart.animation.FlexChartAnimation}
     * , {@link wijmo.react.chart.radar.FlexRadarAxis}
     * , {@link wijmo.react.chart.radar.FlexRadarSeries}
     * and {@link wijmo.react.chart.FlexChartLegend}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexRadar extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.radar.FlexRadar, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'options', 'selection', 'renderEngine']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.radar.FlexRadarAxis} class.
     * 
     * The <b>flex-radar-axis</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.radar.FlexRadar}
     *  or {@link wijmo.react.chart.radar.FlexRadarSeries}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadarAxis} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexRadarAxis extends ComponentBase {
        _parentProp = 'axes';
        constructor(props) {
            super(props, wijmo.chart.radar.FlexRadarAxis, { objectProps: ['plotArea', 'itemsSource']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.radar.FlexRadarSeries} class.
     * 
     * The <b>flex-radar-series</b> component should be contained in
     * a {@link wijmo.react.chart.radar.FlexRadar} component.
     * 
     * The <b>flex-radar-series</b> component may contain
     * a {@link wijmo.react.chart.radar.FlexRadarAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadarSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexRadarSeries extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.radar.FlexRadarSeries, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.FlexChart} control.
     * 
     * The <b>flex-chart</b> component may contain
     * the following child components: 
     * {@link wijmo.react.chart.analytics.FlexChartTrendLine}
     * , {@link wijmo.react.chart.analytics.FlexChartMovingAverage}
     * , {@link wijmo.react.chart.analytics.FlexChartYFunctionSeries}
     * , {@link wijmo.react.chart.analytics.FlexChartParametricFunctionSeries}
     * , {@link wijmo.react.chart.analytics.FlexChartWaterfall}
     * , {@link wijmo.react.chart.analytics.FlexChartBoxWhisker}
     * , {@link wijmo.react.chart.analytics.FlexChartErrorBar}
     * , {@link wijmo.react.chart.analytics.FlexChartBreakEven}
     * , {@link wijmo.react.chart.animation.FlexChartAnimation}
     * , {@link wijmo.react.chart.annotation.FlexChartAnnotationLayer}
     * , {@link wijmo.react.chart.interaction.FlexChartRangeSelector}
     * , {@link wijmo.react.chart.interaction.FlexChartGestures}
     * , {@link wijmo.react.chart.FlexChartAxis}
     * , {@link wijmo.react.chart.FlexChartLegend}
     * , {@link wijmo.react.chart.FlexChartDataLabel}
     * , {@link wijmo.react.chart.FlexChartSeries}
     * , {@link wijmo.react.chart.FlexChartLineMarker}
     * and {@link wijmo.react.chart.FlexChartPlotArea}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.FlexChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.chart.FlexChart} control in JSX:
     *
     * <pre>&lt;Wj.FlexChart
     *   itemsSource={ this.state.data }
     *   bindingX="name"
     *   header={ this.state.header }
     *   footer={ this.state.footer }
     *   axisX={&#8203;{ title: this.state.titleX }}
     *   axisY={&#8203;{ title: this.state.titleY }}
     *   legend={&#8203;{ position: this.state.legendPosition }}
     *   series={[
     *       { name: 'Sales', binding: 'sales' },
     *       { name: 'Expenses', binding: 'expenses' },
     *       { name: 'Downloads', binding: 'downloads', chartType: 'LineSymbols' }
     *   ]} /&gt;</pre>
     *

     * The code sets the <b>itemsSource</b> property to a collection that contains
     * the data to chart and the <b>bindingX</b> property to specify the name of the
     * data property to use for the chart's X values.
     *
     * It sets the <b>header</b> and <b>footer</b> properties to specify the
     * chart titles, and customizes the chart's axes and legend.
     *
     * Finally, it sets the <b>series</b> property to an array that specifies the
     * data items that the chart should display.
     */
    export class FlexChart extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.FlexChart, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'options', 'selection', 'renderEngine']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.FlexPie} control.
     * 
     * The <b>flex-pie</b> component may contain
     * the following child components: 
     * {@link wijmo.react.chart.animation.FlexChartAnimation}
     * , {@link wijmo.react.chart.FlexChartLegend}
     * and {@link wijmo.react.chart.FlexPieDataLabel}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.FlexPie} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexPie extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.FlexPie, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'titles']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
            if ('labelContent' in nextProps) {
                this.control.dataLabel.content = nextProps.labelContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.Axis} class.
     * 
     * The <b>flex-chart-axis</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     * , {@link wijmo.react.chart.FlexChartSeries}
     * , {@link wijmo.react.chart.finance.FinancialChart}
     *  or {@link wijmo.react.chart.finance.FinancialChartSeries}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Axis} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartAxis extends ComponentBase {
        _parentProp = 'axes';
        constructor(props) {
            super(props, wijmo.chart.Axis, { objectProps: ['plotArea', 'itemsSource']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.Legend} class.
     * 
     * The <b>flex-chart-legend</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     * , {@link wijmo.react.chart.FlexPie}
     * , {@link wijmo.react.chart.finance.FinancialChart}
     * , {@link wijmo.react.chart.radar.FlexRadar}
     * , {@link wijmo.react.chart.hierarchical.Sunburst}
     *  or {@link wijmo.react.chart.map.FlexMap}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Legend} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartLegend extends ComponentBase {
        _parentProp = 'legend';
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.Legend);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.DataLabel} class.
     * 
     * The <b>flex-chart-data-label</b> component should be contained in
     * a {@link wijmo.react.chart.FlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.DataLabel} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartDataLabel extends ComponentBase {
        _parentProp = 'dataLabel';
        constructor(props) {
            super(props, wijmo.chart.DataLabel, { objectProps: ['content']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.PieDataLabel} class.
     * 
     * The <b>flex-pie-data-label</b> component should be contained in
     * a {@link wijmo.react.chart.FlexPie} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.PieDataLabel} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexPieDataLabel extends ComponentBase {
        _parentProp = 'dataLabel';
        constructor(props) {
            super(props, wijmo.chart.PieDataLabel, { objectProps: ['content']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.Series} class.
     * 
     * The <b>flex-chart-series</b> component should be contained in
     * a {@link wijmo.react.chart.FlexChart} component.
     * 
     * The <b>flex-chart-series</b> component may contain
     * a {@link wijmo.react.chart.FlexChartAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Series} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartSeries extends ComponentBase {
        _parentProp = 'series';
        _siblingId = 'series';
        constructor(props) {
            super(props, wijmo.chart.Series, { objectProps: ['axisX', 'axisY', 'style', 'altStyle', 'symbolStyle', 'itemsSource', 'tooltipContent']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.LineMarker} class.
     * 
     * The <b>flex-chart-line-marker</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.LineMarker} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartLineMarker extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.chart.LineMarker);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.DataPoint} class.
     * 
     * The <b>flex-chart-data-point</b> component should be contained in
     * a {@link wijmo.react.chart.annotation.FlexChartAnnotation} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.DataPoint} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartDataPoint extends ComponentBase {
        _parentProp = '';
        constructor(props) {
            super(props, wijmo.chart.DataPoint);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.PlotArea} class.
     * 
     * The <b>flex-chart-plot-area</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.FlexChart}
     *  or {@link wijmo.react.chart.finance.FinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.PlotArea} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexChartPlotArea extends ComponentBase {
        _parentProp = 'plotAreas';
        constructor(props) {
            super(props, wijmo.chart.PlotArea, { objectProps: ['style']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.gauge.LinearGauge} control.
     * 
     * The <b>linear-gauge</b> component may contain
     * a {@link wijmo.react.gauge.Range} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.LinearGauge} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.gauge.LinearGauge} control in JSX:
     *
     * <pre>&lt;Wj.LinearGauge 
     *   min={ 0 } max={ 1000 } step={ 50 } isReadOnly={ false }
     *   value={ this.state.view.currentItem.sales }
     *   valueChanged={ this.salesChanged }
     *   format="c0" thumbSize={ 20 } showRanges={ false }
     *   face={&#8203;{ thickness:0.5 }}
     *   pointer={&#8203;{ thickness:0.5 }}
     *   ranges={[
     *       { min: 0, max: 333, color: 'red' },
     *       { min: 333, max: 666, color: 'gold' },
     *       { min: 666, max: 1000, color: 'green' }
     *   ]} /&gt;</pre>
     *
     * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
     * to define the range of the gauge and to allow users to edit its value.
     * Next, it sets the <b>value</b> and <b>valueChanged</b> properties to create
     * a two-way binding for the gauge's value.
     *
     * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
     * properties to define the appearance of the gauge. Finally, the markup sets
     * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
     * that will control the color of the <b>value</b> range depending on the gauge's
     * current value.
     */
    export class LinearGauge extends ComponentBase {
        constructor(props) {
            super(props, wijmo.gauge.LinearGauge);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.gauge.BulletGraph} control.
     * 
     * The <b>bullet-graph</b> component may contain
     * a {@link wijmo.react.gauge.Range} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.BulletGraph} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.gauge.BulletGraph} control in JSX:
     *
     * <pre>&lt;Wj.BulletGraph 
     *   min={ 0 } max={ 1000 } step={ 50 } isReadOnly={ false }
     *   value={ this.state.view.currentItem.sales }
     *   valueChanged={ this.salesChanged }
     *   format="c0" thumbSize={ 20 } showRanges={ false }
     *   face={&#8203;{ thickness:0.5 }}
     *   pointer={&#8203;{ thickness:0.5 }}
     *   ranges={[
     *       { min: 0, max: 333, color: 'red' },
     *       { min: 333, max: 666, color: 'gold' },
     *       { min: 666, max: 1000, color: 'green' }
     *   ]} /&gt;</pre>
     *
     * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
     * to define the range of the gauge and to allow users to edit its value.
     * Next, it sets the <b>value</b> and <b>valueChanged</b> properties to create
     * a two-way binding for the gauge's value.
     *
     * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
     * properties to define the appearance of the gauge. Finally, the markup sets
     * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
     * that will control the color of the <b>value</b> range depending on the gauge's
     * current value.
     */
    export class BulletGraph extends ComponentBase {
        constructor(props) {
            super(props, wijmo.gauge.BulletGraph);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.gauge.RadialGauge} control.
     * 
     * The <b>radial-gauge</b> component may contain
     * a {@link wijmo.react.gauge.Range} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.RadialGauge} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.gauge.RadialGauge} control in JSX:
     *
     * <pre>&lt;Wj.RadialGauge 
     *   min={ 0 } max={ 1000 } step={ 50 } isReadOnly={ false }
     *   value={ this.state.view.currentItem.sales }
     *   valueChanged={ this.salesChanged }
     *   format="c0" thumbSize={ 20 } showRanges={ false }
     *   face={&#8203;{ thickness:0.5 }}
     *   pointer={&#8203;{ thickness:0.5 }}
     *   ranges={[
     *       { min: 0, max: 333, color: 'red' },
     *       { min: 333, max: 666, color: 'gold' },
     *       { min: 666, max: 1000, color: 'green' }
     *   ]} /&gt;</pre>
     *
     * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
     * to define the range of the gauge and to allow users to edit its value.
     * Next, it sets the <b>value</b> and <b>valueChanged</b> properties to create
     * a two-way binding for the gauge's value.
     *
     * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
     * properties to define the appearance of the gauge. Finally, the markup sets
     * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
     * that will control the color of the <b>value</b> range depending on the gauge's
     * current value.
     */
    export class RadialGauge extends ComponentBase {
        constructor(props) {
            super(props, wijmo.gauge.RadialGauge, { objectProps: ['needleElement']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.gauge.Range} class.
     * 
     * The <b>range</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.gauge.LinearGauge}
     * , {@link wijmo.react.gauge.BulletGraph}
     *  or {@link wijmo.react.gauge.RadialGauge}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.Range} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Range extends ComponentBase {
        _parentProp = 'ranges';
        constructor(props) {
            super(props, wijmo.gauge.Range);
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    
















    /**
     * React component for the {@link wijmo.grid.detail.FlexGridDetailProvider} class.
     * 
     * The <b>flex-grid-detail</b> component should be contained in
     * a {@link wijmo.react.grid.FlexGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.detail.FlexGridDetailProvider} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     * 
     * The component includes a <b>template</b> property which is used to define template for detail row.
     * The template is a function with single argument. The argument is a plain object with keys of
     * <b>row</b> (the row to which detail row belongs),
     * <b>item</b> (item data related to the row) and
     * <b>provider</b> (FlexGrid control, owner of the row).
     */
    export class FlexGridDetail extends ComponentBase {
        _parentInCtor = true;
        private _renderedCells = [];   // cells rendered by current template
        private _template: (context: any) => React.ReactElement;   // current template

        constructor(props) {
            super(props, wijmo.grid.detail.FlexGridDetailProvider);
            this._destroyCell = this._destroyCell.bind(this);

        }
        protected _onBeforeWillUnmount(e?: wijmo.EventArgs) {
            super._onBeforeWillUnmount(e);
            this._unmountRenderedCells();
        }

        protected _initParent() {
            this._setTemplateRelatedProps(this.props);
            super._initParent();
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            if (this.props.template !== this._template) {
                this._setTemplateRelatedProps(this.props);
            }


            // rerender cells
            if (this._template) {
                this._renderedCells.forEach(cellData => {
                    const cell = cellData.cell;
                    const component = this._template(this._getTemplateContext(cellData.row));
                    ReactDOM.render(component, cell);
                });
            } else {
                this._unmountRenderedCells();
            }
        }

        private _setTemplateRelatedProps(props) {
            const control = this.control;
            const template = this._template = props.template;
            if (template) {
                control.createDetailCell = this._getCellCreator(template);
                control.disposeDetailCell = this._destroyCell;
            } else {
                control.createDetailCell = props.createDetailCell;
                control.disposeDetailCell = props.disposeDetailCell;
            }
        }

        private _getTemplateContext(row) {
            return {
                row,
                item: row.dataItem,
                provider: this.control,
            };
        }

        private _unmountRenderedCells() {
            this._renderedCells.forEach(cellData => {
                ReactDOM.unmountComponentAtNode(cellData.cell);
            });
            this._renderedCells = [];
        }

        private _getCellCreator(template) {
            return row => {
                const cell = document.createElement('div');
                const component = template(this._getTemplateContext(row));
                ReactDOM.render(component, cell);
                this._renderedCells.push({ row, cell });
                return cell;
            };
        }

        private _destroyCell(row) {
            const mainRow = this.control.grid.rows[row.index - 1];
            let mainRowCellIndex = -1;
            this._renderedCells.some((item, idx) => ((item.row === mainRow) && !!((mainRowCellIndex = idx) + 1)));
            wijmo.assert(mainRowCellIndex !== -1, 'Main row rendered cell is not found');
            ReactDOM.unmountComponentAtNode(this._renderedCells[mainRowCellIndex].cell);
            this._renderedCells.splice(mainRowCellIndex, 1);
            // unmountComponentAtNode is asynchronous, so we
            // prevent provider from executing its own disposal logic, which
            // will later cause exception in React.
            return true;
        }
 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.filter.FlexGridFilter} class.
     * 
     * The <b>flex-grid-filter</b> component should be contained in
     * a {@link wijmo.react.grid.FlexGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.filter.FlexGridFilter} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexGridFilter extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.grid.filter.FlexGridFilter, { objectProps: ['filterColumns']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.grouppanel.GroupPanel} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.grouppanel.GroupPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class GroupPanel extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.grouppanel.GroupPanel, { objectProps: ['filter', 'groupDescriptionCreator', 'grid']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.search.FlexGridSearch} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.search.FlexGridSearch} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexGridSearch extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.search.FlexGridSearch, { objectProps: ['grid']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    












/**
 * Represents a cell template types enumeration.
 */
export import CellTemplateType = GridCellTemplateType;








    /**
     * React component for the {@link wijmo.grid.FlexGrid} control.
     * 
     * The <b>flex-grid</b> component may contain
     * the following child components: 
     * {@link wijmo.react.grid.detail.FlexGridDetail}
     * , {@link wijmo.react.grid.filter.FlexGridFilter}
     * , {@link wijmo.react.grid.immutable.ImmutabilityProvider}
     * , {@link wijmo.react.grid.FlexGridColumn}
     * , {@link wijmo.react.grid.FlexGridColumnGroup}
     * and {@link wijmo.react.grid.FlexGridCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.FlexGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.grid.FlexGrid} control in JSX:
     *
     * <pre>&lt;Wj.FlexGrid
     *   autoGenerateColumns={ false }
     *   columns={[
     *     { binding: 'name', header: 'Name' },
     *     { binding: 'sales', header: 'Sales', format: 'c0' },
     *     { binding: 'expenses', header: 'Expenses', format: 'c0' },
     *     { binding: 'active', header: 'Active' },
     *     { binding: 'date', header: 'Date' }
     *   ]}
     *   itemsSource={ this.state.data } /&gt;</pre>
     *
     * The code sets the <b>autoGenerateColumns</b> property to false, then
     * sets the <b>columns</b> property, and finally sets the <b>itemsSource</b>
     * property. This order is important, it prevents the grid from automatically
     * generating the columns.
     */
    export class FlexGrid extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.FlexGrid, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups']});
        }
        
        protected _createControl(): any {
            let ret = <wijmo.grid.FlexGrid>super._createControl();
            new DirectiveCellFactory(this, ret);
            return ret;
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.Column} class.
     * 
     * The <b>flex-grid-column</b> component should be contained in
     * a {@link wijmo.react.grid.FlexGrid} component.
     * 
     * The <b>flex-grid-column</b> component may contain
     * a {@link wijmo.react.grid.FlexGridCellTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.Column} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexGridColumn extends ComponentBase {
	    
        _parentProp = 'columns';
        constructor(props) {
            super(props, wijmo.grid.Column, { objectProps: ['dataMap', 'cellTemplate', 'editor']});
        }

        protected _initParent(): void {
            var grid = <wijmo.grid.FlexGrid>this.parent.control;
            if (grid.autoGenerateColumns) {
                grid.autoGenerateColumns = false;
                grid.columns.clear();
            }

            super._initParent();
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.ColumnGroup} class.
     * 
     * The <b>flex-grid-column-group</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.grid.FlexGrid}
     *  or {@link wijmo.react.grid.FlexGridColumnGroup}.
     * 
     * The <b>flex-grid-column-group</b> component may contain
     * the following child components: 
     * {@link wijmo.react.grid.FlexGridColumnGroup}
     * and {@link wijmo.react.grid.FlexGridCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.ColumnGroup} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexGridColumnGroup extends ComponentBase {
        _parentProp = 'columnGroups';
        constructor(props) {
            super(props, wijmo.grid.ColumnGroup, { objectProps: ['dataMap', 'cellTemplate', 'editor']});
        } 
    }
 
 

    interface ICellTemplateInfoReact extends ICellTemplateInfo {
        template: CellTemplateRender;
    }

    interface ICellRenderingInfoReact extends ICellRenderingInfo {
        templateContext: ICellTemplateInfoReact; // type cast
    }

    export class DirectiveCellFactory extends DirectiveCellFactoryBase {
        private readonly _renderedCells: HTMLElement[] = [];
        private _isViewUpdated = false;

        constructor (gridComponent: ComponentBase, grid: wijmo.grid.FlexGrid) {
            super(grid);
            grid.updatedView.addHandler(this._gridViewUpdated, this);
            //gridComponent._afterRender.addHandler(this._gridCmpRendered, this);
            gridComponent._beforeDidUpdate.addHandler(this._gridCmpBeforeDidUpdate, this);
            gridComponent._afterDidUpdate.addHandler(this._gridCmpAfterDidUpdate, this);
        }

        // Overrides
        protected shouldInstantiate(cellInfo: ICellRenderingInfo): boolean {
            let templateCache = cellInfo.templateCache,
                isForeignCell = templateCache == null || templateCache.column !== cellInfo.column || 
                    templateCache.templateContextProperty !== cellInfo.templateContextProperty ||
                    cellInfo.cell.firstChild != templateCache.rootElement;
            return isForeignCell;
        }

        protected renderTemplate(cellInfo: ICellRenderingInfoReact, initNew: boolean) {
            let row = cellInfo.row,
                //dataContext = initNew ? {} : cellInfo.templateCache.viewRef.context,
                dataContext = {},
                templateContext = cellInfo.templateContext,
                cell = cellInfo.cell;
            cellInfo.cellBindingsData = this.setBindingsData(dataContext, row, cellInfo.column, row.dataItem, 
                cellInfo.cellValue, templateContext.valuePaths);

            // let renderCtx = cellInfo.cellBindingsData.localVars;
            // let templFn = cellInfo.templateContext.template;
            // ReactDOM.render(React.createElement('div', {}, templFn && templFn(renderCtx)), cellInfo.cell);
            this._renderCell(cell, cellInfo);
    
            if (initNew) {
                //let cell = cellInfo.cell;
                this._addRenderedCell(cell);
                let templateCache = cellInfo.templateCache = {
                    column: cellInfo.column,
                    rootElement: cell.firstElementChild,
                    templateContextProperty: cellInfo.templateContextProperty
                };
                cell[cellInfo.templateContextProperty] = templateCache;
            }

        }

        // protected doDisposeCell(cell: HTMLElement) {
        //     super.doDisposeCell(cell);
        //     ReactDOM.unmountComponentAtNode(cell);
        //     this._removeRenderedCell(cell);
        // }

        protected disposeTemplate(cell: HTMLElement, templateCache: ICellTemplateCache, 
                templateContext: ICellTemplateInfoReact) {
            if (templateCache) {
                ReactDOM.unmountComponentAtNode(cell);
                this._removeRenderedCell(cell);
                super.disposeTemplate(cell, templateCache, templateContext);
            }
        }

        protected clearCell(cell: HTMLElement) {
            ReactDOM.unmountComponentAtNode(cell);
        }

        protected applyImmediately(cellInfo: ICellRenderingInfoReact) {
            // do nothing
        }

        protected flushPendingEvents(control: wijmo.Control) {
            // do nothing
        }

        // TBD: patch
        protected getEditorFocusFlag(): boolean {
            //return this.grid._edtFocus;
            return true;
        }
        protected setEditorFocusFlag(value: boolean) {
            //this.grid._edtFocus = value;
        }

        // End of Overrides
        private _renderCell(cell: HTMLElement, cellInfo?: ICellRenderingInfoReact) {
            const lastRenderedInfoProp = '__wjCellLastRenderedProp';
            var lastCellInfo = cellInfo || <ICellRenderingInfoReact>cell[lastRenderedInfoProp];
            if (lastCellInfo) {
                let templFn = lastCellInfo && lastCellInfo.templateContext.template,
                    renderCtx = lastCellInfo.cellBindingsData.localVars;
                ReactDOM.render(React.createElement('div', {}, templFn && templFn(renderCtx)), cell);
                cell[lastRenderedInfoProp] = lastCellInfo;
            }
        }

        private _addRenderedCell(cell: HTMLElement) {
            let renderedCells = this._renderedCells;
            if (renderedCells.indexOf(cell) < 0) {
                renderedCells.push(cell);
            }
        }

        private _removeRenderedCell(cell: HTMLElement) {
            let renderedCells = this._renderedCells,
                idx = renderedCells.indexOf(cell);
            if (idx > -1) {
                renderedCells.splice(idx, 1);
            }
        }

        private _reRenderCells() {
            this._renderedCells.forEach(c => this._renderCell(c));
        }

        // The order in which these methods are (optionally) called:
        // _gridCmpBeforeDidUpdate (may cause sync or async _gridViewUpdated)
        // synchronous _gridViewUpdated
        // _gridCmpAfterDidUpdate -> _gridCmpRendered
        // asynchronous _gridViewUpdated
        // _gridCmpRendered's setTimeout
        private _gridCmpBeforeDidUpdate() {
            this._isViewUpdated = false;
        }
        private _gridCmpAfterDidUpdate() {
            this._gridCmpRendered();
        }
        private _gridCmpRendered() {
            // Grid updates its cells with a _REFRESH_INTERVAL delay, so we do the
            // check for _isViewUpdated with the same delay.
            setTimeout(() => {
                if (!this._isViewUpdated) {
                    //console.log(`Re-rendering`);
                    this._reRenderCells();
                } else {
                    //console.log(`No re-rendering`);
                    this._isViewUpdated = false;
                }
            }, wijmo.Control._REFRESH_INTERVAL);
        }
        private _gridViewUpdated() {
            //console.log(`updatedView`);
            this._isViewUpdated = true;
        }

    }
    
    export interface ICellTemplateContext {
        row: wijmo.grid.Row,
        col: wijmo.grid.Column,
        item: any,
        value: any,
        values: any
    }

    export type CellTemplateRender = (context: ICellTemplateContext) => any;

 /**
* React component for the {@link FlexGrid} cell templates.
*
* The <b>FlexGridCellTemplate</b> component defines a template for a certain
* cell type in {@link FlexGrid}. The template element must contain a <b>cellType</b> property that
* specifies the {@link wijmo.react.grid.CellTemplateType}. Depending on the template's cell type,
* the <b>FlexGridCellTemplate</b> element must be a child
* of either {@link wijmo.react.grid.FlexGrid}
* or {@link wijmo.react.grid.FlexGridColumn} components.
*
* Column-specific cell templates must be contained in <b>FlexGridColumn</b>
* components, and cells that are not column-specific (like row header or top left cells)
* must be contained in the <b>FlexGrid</b> component.
*
* The content of cells is defined using the <b>template</b> <i>render prop</i>, which receives
* a render function that should return a virtual element tree representing the cell content.
* The function has the <b>context</b> parameter where the data context of each certain cell is
* passed. This is an object with the <b>col</b>, <b>row</b>, and <b>item</b> properties, 
* which refer to the {@link Column}, {@link Row}, and <b>Row.dataItem</b> objects pertaining to the cell.
*
* For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>value</b> 
* context property containing an unformatted cell value is provided. 
* 
* For example, here is a 
* {@link FlexGrid} control with templates for row header cells and, regular
* and column header cells of the Country column:
*
* ```html
* <!-- component.html -->
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="RowHeader" 
*       template={ (context) => context.row.index + 1 } />
*   <wjGrid.FlexGridCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '...' } />
* 
*   <wjGrid.FlexGridColumn header="Country" binding="country">
*     <wjGrid.FlexGridCellTemplate 
*           cellType="ColumnHeader" 
*           template={ (context) => {
*               return <React.Fragment>
*                   <img src="resources/globe.png" /> 
*                   {context.col.header}
*               </React.Fragment>
*               } 
*           }
*      />
*     <wjGrid.FlexGridCellTemplate 
*           cellType="Cell" 
*           template={ (context) => {
*               return <React.Fragment>
*                  <img src={`resources/${context.item.country}.png`} />
*                  {context.item.country}
*               </React.Fragment>
*           } }
*       />
*   </wjGrid.FlexGridColumn>
*   <wjGrid.FlexGridColumn header="Sales" binding="sales"></wjGrid.FlexGridColumn>
* </wjGrid.FlexGrid>
* ```
*
* The <b>FlexGridCellTemplate</b> directive supports the following properties:
*
* <dl class="dl-horizontal">
*   <dt>cellType</dt>
*   <dd>
*     The <b>CellTemplateType</b> value defining the type of cell to which the template is applied. 
*   </dd>
*   <dt>autoSizeRows</dt>
*   <dd>
*     Indicates whether the cell template will increase grid's default row height
*     to accomodate cells content. Defaults to true.
*   </dd>
*   <dt>cellOverflow</dt>
*   <dd>
*     Defines the <b>style.overflow</b> property value for cells.
*   </dd>
*   <dt>forceFullEdit</dt>
*   <dd>
*     For cell edit templates, indicates whether cell editing forcibly starts in full edit mode,
*     regardless of how the editing was initiated. In full edit mode pressing cursor keys don't finish editing. 
*     Defaults to true. 
*   </dd>
* </dl>
*
* The <b>cellType</b> attribute takes any of the following enumerated values:
*
* <b>Cell</b>
*
* Defines a regular (data) cell template. Must be a child of the {@link wijmo.react.grid.FlexGridColumn} component.
* For example, this cell template shows flags in the cells of Country column:
*
* ```html
* <wjGrid.FlexGridColumn header="Country" binding="country">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="Cell" 
*       template={ (context) => {
*           return <React.Fragment>
*              <img src={`resources/${context.item.country}.png`} />
*              {context.item.country}
*           </React.Fragment>
*       } 
*    }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* If <b>Group</b> template is not provided for a hierarchical {@link FlexGrid} (that is, one with the <b>childItemsPath</b> property 
* specified), non-header cells in group rows of 
* this {@link Column} also use this template.
*
* <b>CellEdit</b>
*
* Defines a template for a cell in edit mode. Must be a child of the {@link wijmo.react.grid.FlexGridColumn} component.
* This cell type has an additional <b>context.value</b> property. It contains the
* original cell value before editing, and the updated value after editing.
*
* For example, here is a template that uses the Wijmo {@link InputNumber} control as an editor
* for the "Sales" column:
* ```html
* <wjGrid.FlexGridColumn header="Sales" binding="sales">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="CellEdit"
*       template={ (context) => {
*            return <wjInput.InputNumber
*                step={1}
*                value={context.value}
*                valueChanged={(inpNum: wjcInput.InputNumber) =>
*                    context.value = inpNum.value
*                } />
*            } 
*       }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* <b>ColumnHeader</b>
*
* Defines a template for a column header cell. Must be a child of the {@link wijmo.react.grid.FlexGridColumn} component.
* For example, this template adds an image to the header of the "Country" column:
*
* ```html
* <wjGrid.FlexGridColumn header="Country" binding="country">
*   <wjGrid.FlexGridCellTemplate 
*         cellType="ColumnHeader" 
*         template={ (context) => {
*             return <React.Fragment>
*                 <img src="resources/globe.png" /> 
*                 {context.col.header}
*             </React.Fragment>
*             } 
*         }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* <b>RowHeader</b>
*
* Defines a template for a row header cell. Must be a child of the {@link wijmo.react.grid.FlexGrid} component.
* For example, this template shows row indices in the row headers:
*
* ```html
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="RowHeader" 
*       template={ (context) => context.row.index + 1 } />
* </wjGrid.FlexGrid>
* ```
*
* Note that this template is applied to a row header cell, even if it is in a row that is 
* in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
* content, define the <b>RowHeaderEdit</b> template.
*
* <b>RowHeaderEdit</b>
*
* Defines a template for a row header cell in edit mode. Must be a child of the 
* {@link wijmo.react.grid.FlexGrid} component. For example, this template shows dots in the header
* of rows being edited:
*
* ```html
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '...' } />
* </wjGrid.FlexGrid>
* ```
*
* Use the following <b>RowHeaderEdit</b> template to add the standard edit-mode indicator to cells where 
* the <b>RowHeader</b> template applies:
*
* ```html
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '\u270e\ufe0e' } />
* </wjGrid.FlexGrid>
* ```
*
* <b>TopLeft</b>
*
* Defines a template for the top left cell. Must be a child of the {@link wijmo.react.grid.FlexGrid} component.
* For example, this template shows a down/right glyph in the top-left cell of the grid:
*
* ```html
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="TopLeft"
*       template={ (context) => {
*           return <span class="wj-glyph-down-right"></span>
*       } }
*   />
* </wjGrid.FlexGrid>
* ```
*
* <b>GroupHeader</b>
*
* Defines a template for a group header cell in a {@link GroupRow}. Must be a child of 
* the {@link wijmo.react.grid.FlexGridColumn} component.
*
* The <b>context.row</b> property contains an instance of the <b>GroupRow</b> class. If the grouping comes 
* from {@link CollectionView}, the <b>context.item</b> property references the {@link CollectionViewGroup} object.
*
* For example, this template uses a checkbox element as an expand/collapse toggle:
*
* ```html
* <wjGrid.FlexGridColumn header="Country" binding="country">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="GroupHeader" 
*       template={ (context) => {
*          return <React.Fragment>
*            <input type="checkbox"
*                checked={context.row.isCollapsed}
*                onChange={e =>
*                    context.row.isCollapsed = e.target.checked as boolean
*                } />
*            {context.item.name} ({context.item.items.length} items)
*          </React.Fragment>
*          }
*        }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* <b>Group</b>
*
* Defines a template for a regular cell (not a group header) in a {@link GroupRow}. Must be a child of the 
* {@link wijmo.react.grid.FlexGridColumn} component. This cell type has an additional <b>context.value</b>  
* property. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
* aggregate value.
*
* For example, this template shows aggregate's value and kind for group row cells in the "Sales"
* column:
*
* ```html
* <wjGrid.FlexGridColumn header="Sales" binding="sales" aggregate="Avg">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="Group" 
*       template={ (context) => {
*          return <React.Fragment>
*            Average: {wjcCore.Globalize.formatNumber(context.value, 'N0')}
*          </React.Fragment>
*          }
*        }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* <b>ColumnFooter</b>
*
* Defines a template for a regular cell in a <b>columnFooters</b> panel. Must be a child of the
* {@link wijmo.react.grid.FlexGridColumn} component. This cell type provides an additional <b>context.value</b>
* property available for binding that contains an aggregated cell value.
*
* For example, this template shows aggregate's value and kind for a footer cell in the "Sales"
* column:
*
* ```html
* <wjGrid.FlexGridColumn header="Sales" binding="sales" aggregate="Avg">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="ColumnFooter" 
*       template={ (context) => {
*          return <React.Fragment>
*            Average: {wjcCore.Globalize.formatNumber(context.value, 'N0')}
*          </React.Fragment>
*          }
*        }
*   />
* </wjGrid.FlexGridColumn>
* ```
*
* <b>BottomLeft</b>
*
* Defines a template for the bottom left cells (at the intersection of the row header and column footer cells).
* Must be a child of the {@link wijmo.react.grid.FlexGrid} component.
* For example, this template shows a sigma glyph in the bottom-left cell of the grid:
*
* ```html
* <wjGrid.FlexGrid itemsSource={this.state.data}>
*   <wjGrid.FlexGridCellTemplate 
*       cellType="BottomLeft"
*       template={(context) => <span>&#931;</span>} />
* </wjGrid.FlexGrid>
* ```
*
* <b>NewCellTemplate</b>
* 
* Defines a cell in a new row template. Must be a child of the {@link wijmo.react.grid.FlexGridColumn} component.
* Note that the <b>context.item</b> property is undefined for this type of a cell.
* For example, this cell template shows a placeholder in the Date column's cell in the "new row" item:
*
* ```html
* <wjGrid.FlexGridColumn header="Date" binding="date">
*   <wjGrid.FlexGridCellTemplate 
*       cellType="NewCellTemplate"
*       template={ (context) => 'Enter a date here' } />
* </wjGrid.FlexGridColumn>
* ```
*/
    export class FlexGridCellTemplate extends React.Component<any, any> {
        static readonly _CellRenderFuncProp = 'template';

        grid: wijmo.grid.FlexGrid;
        column: wijmo.grid.Column;
        // column or grid
        ownerControl: wijmo.grid.FlexGrid | wijmo.grid.Column;
        cellType: CellTemplateType;

        //// Exposed binding properties
        get cellOverflow(): string {
            return this.props.cellOverflow;
        }
        get autoSizeRows(): boolean {
            let val = this.props.autoSizeRows;
            return val != null ? val : true;
        }
        get forceFullEdit(): boolean {
            let val = this.props.forceFullEdit;
            return val != null ? val : true;
        }
        get valuePaths(): Object {
            return this.props.valuePaths;
        }
        get template(): CellTemplateRender {
            return this.props[FlexGridCellTemplate._CellRenderFuncProp];
        }
        //// End of exposed binding properties
    
    
        componentDidMount() {
            let parCmp = <ComponentBase>this.props[ComponentBase._propsParent];
            if (parCmp) {
                parCmp._mountedCB(() => {
                    let ownerControl = this.ownerControl = parCmp.control;
                    if (ownerControl instanceof wijmo.grid.FlexGrid) {
                        this.grid = ownerControl;
                    } else if (ownerControl instanceof wijmo.grid.Column) {
                        this.column = ownerControl;
                        let par2Cmp = parCmp,
                            grid;
                        do {
                            par2Cmp = <ComponentBase>par2Cmp.props[ComponentBase._propsParent];
                            grid = par2Cmp && par2Cmp.control;
                        } while (grid && !(grid instanceof wijmo.grid.FlexGrid));
                        this.grid = <wijmo.grid.FlexGrid>grid;
                    }
                    if (this.template) {
                        this._attachToControl();
                    }
                });
            }
        }

        componentWillUnmount() {
            this._detachFromControl();
        }

        componentDidUpdate(prevProps) {
            let curTempl = prevProps[FlexGridCellTemplate._CellRenderFuncProp],
                nextTempl =  this.template;
            if (curTempl != nextTempl) {
                if (curTempl == null) {
                    this._attachToControl();
                } else if (nextTempl == null) {
                    this._detachFromControl();
                } 
                // we don't call invalidate here, because changing of a template function is
                // accompanied by the React rendering, which causes cell templates to be redrawn
                // via the cell re-rendering mechanism (used to update cells with a new data context).
                // else {
                //     this.grid.invalidate();
                // }
            }
        }

        render() {
            return null;
        }

        // TBD: process cellType property change

        //renderCell

        private _attachToControl(): void {
            let cellType = this.cellType = <CellTemplateType>wijmo.asEnum(
                    this.props.cellType, CellTemplateType),
                ownerControl = this.ownerControl;
            ownerControl[DirectiveCellFactory.getTemplContextProp(cellType)] = 
                <ICellTemplateInfo>this;
            // TBD: remove flag on dispose if possible
            if (ownerControl instanceof wijmo.grid.Column && 
                    (cellType === CellTemplateType.Cell ||
                    cellType === CellTemplateType.ColumnHeader || 
                    cellType === CellTemplateType.ColumnFooter)) {
                ownerControl._setFlag(wijmo.grid.RowColFlags.HasTemplate, true);
            }
            this.grid.invalidate();
        }
    
        private _detachFromControl() {
            if (this.cellType != null) {
                this.ownerControl[DirectiveCellFactory.getTemplContextProp(this.cellType)] = null;
                this.grid.invalidate();
            }
        }
    }
  


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    

















    /**
     * React component for the {@link wijmo.grid.multirow.MultiRow} control.
     * 
     * The <b>multi-row</b> component may contain
     * the following child components: 
     * {@link wijmo.react.grid.multirow.MultiRowCellGroup}
     * and {@link wijmo.react.grid.multirow.MultiRowCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRow} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MultiRow extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.multirow.MultiRow, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups', 'layoutDefinition', 'headerLayoutDefinition']});
        }
        
        protected _createControl(): any {
            let ret = super._createControl();
            new DirectiveCellFactory(<any>this, ret);
            return ret;
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.multirow.MultiRowCell} class.
     * 
     * The <b>multi-row-cell</b> component should be contained in
     * a {@link wijmo.react.grid.multirow.MultiRowCellGroup} component.
     * 
     * The <b>multi-row-cell</b> component may contain
     * a {@link wijmo.react.grid.multirow.MultiRowCellTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRowCell} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MultiRowCell extends ComponentBase {
        _parentProp = 'cells';
        constructor(props) {
            super(props, wijmo.grid.multirow.MultiRowCell, { objectProps: ['dataMap', 'cellTemplate', 'editor']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.multirow.MultiRowCellGroup} class.
     * 
     * The <b>multi-row-cell-group</b> component should be contained in
     * a {@link wijmo.react.grid.multirow.MultiRow} component.
     * 
     * The <b>multi-row-cell-group</b> component may contain
     * a {@link wijmo.react.grid.multirow.MultiRowCell} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRowCellGroup} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MultiRowCellGroup extends ComponentBase {
        _parentProp = 'layoutDefinition';
        constructor(props) {
            super(props, wijmo.grid.multirow.MultiRowCellGroup, { objectProps: ['dataMap', 'cellTemplate', 'editor']});
        } 
    }
 
 


 /**
* React component for the {@link MultiRow} cell templates.
*
* The <b>MultiRowCellTemplate</b> component defines a template for a certain
* cell type in {@link MultiRow}. The template element must contain a <b>cellType</b> property that
* specifies the {@link wijmo.react.grid.CellTemplateType}. Depending on the template's cell type,
* the <b>MultiRowCellTemplate</b> element must be a child
* of either {@link wijmo.react.grid.multirow.MultiRow}
* or {@link wijmo.react.grid.multirow.MultiRowCell} components.
*
* Column-specific cell templates must be contained in <b>MultiRowCell</b>
* components, and cells that are not column-specific (like row header or top left cells)
* must be contained in the <b>MultiRow</b> component.
*
* The content of cells is defined using the <b>template</b> <i>render prop</i>, which receives
* a render function that should return a virtual element tree representing the cell content.
* The function has the <b>context</b> parameter where the data context of each certain cell is
* passed. This is an object with the <b>col</b>, <b>row</b>, and <b>item</b> properties, 
* which refer to the {@link MultiRowCell}, {@link Row}, and <b>Row.dataItem</b> objects pertaining to the cell.
*
* For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>value</b> 
* context property containing an unformatted cell value is provided. 
* 
* For example, here is a 
* {@link MultiRow} control with templates for row header cells and, regular
* and column header cells of the Country column:
*
* ```html
* <!-- component.html -->
* <MultiRow itemsSource={this.state.data}>
*   <MultiRowCellTemplate 
*       cellType="RowHeader" 
*       template={ (context) => context.row.index + 1 } />
*   <MultiRowCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '...' } />
* 
*   <MultiRowCellGroup header="Statistics">
*      <MultiRowCell header="Country" binding="country">
*         <MultiRowCellTemplate 
*               cellType="ColumnHeader" 
*               template={ (context) => {
*                   return <React.Fragment>
*                       <img src="resources/globe.png" /> 
*                       {context.col.header}
*                   </React.Fragment>
*                   } 
*              }
*         />
*         <MultiRowCellTemplate 
*               cellType="Cell" 
*               template={ (context) => {
*                   return <React.Fragment>
*                       <img src={`resources/${context.item.country}.png`} />
*                       {context.item.country}
*                   </React.Fragment>
*               } }
*       />
*      </MultiRowCell>
*      <MultiRowCell header="Sales" binding="sales"></MultiRowCell>
*   </MultiRowCellGroup>
* </MultiRow>
* ```
*
* The <b>MultiRowCellTemplate</b> directive supports the following properties:
*
* <dl class="dl-horizontal">
*   <dt>cellType</dt>
*   <dd>
*     The <b>CellTemplateType</b> value defining the type of cell to which the template is applied. 
*   </dd>
*   <dt>autoSizeRows</dt>
*   <dd>
*     Indicates whether the cell template will increase grid's default row height
*     to accomodate cells content. Defaults to true.
*   </dd>
*   <dt>cellOverflow</dt>
*   <dd>
*     Defines the <b>style.overflow</b> property value for cells.
*   </dd>
*   <dt>forceFullEdit</dt>
*   <dd>
*     For cell edit templates, indicates whether cell editing forcibly starts in full edit mode,
*     regardless of how the editing was initiated. In full edit mode pressing cursor keys don't finish editing. 
*     Defaults to true. 
*   </dd>
* </dl>
*
* The <b>cellType</b> attribute takes any of the following enumerated values:
*
* <b>Cell</b>
*
* Defines a regular (data) cell template. Must be a child of the {@link wijmo.react.grid.multirow.MultiRowCell} component.
* For example, this cell template shows flags in the cells of Country column:
*
* ```html
* <MultiRowCell header="Country" binding="country">
*   <MultiRowCellTemplate 
*       cellType="Cell" 
*       template={ (context) => {
*           return <React.Fragment>
*              <img src={`resources/${context.item.country}.png`} />
*              {context.item.country}
*           </React.Fragment>
*       } 
*    }
*   />
* </MultiRowCell>
* ```
*
* <b>CellEdit</b>
*
* Defines a template for a cell in edit mode. Must be a child of the {@link wijmo.react.grid.multirow.MultiRowCell} component.
* This cell type has an additional <b>context.value</b> property. It contains the
* original cell value before editing, and the updated value after editing.
*
* For example, here is a template that uses the Wijmo {@link InputNumber} control as an editor
* for the "Sales" column:
* ```html
* <MultiRowCell header="Sales" binding="sales">
*   <MultiRowCellTemplate 
*       cellType="CellEdit"
*       template={ (context) => {
*            return <wjInput.InputNumber
*                step={1}
*                value={context.value}
*                valueChanged={(inpNum: wjcInput.InputNumber) =>
*                    context.value = inpNum.value
*                } />
*            } 
*       }
*   />
* </MultiRowCell>
* ```
*
* <b>ColumnHeader</b>
*
* Defines a template for a column header cell. Must be a child of the {@link wijmo.react.grid.multirow.MultiRowCell} component.
* For example, this template adds an image to the header of the "Country" column:
*
* ```html
* <MultiRowCell header="Country" binding="country">
*   <MultiRowCellTemplate 
*         cellType="ColumnHeader" 
*         template={ (context) => {
*             return <React.Fragment>
*                 <img src="resources/globe.png" /> 
*                 {context.col.header}
*             </React.Fragment>
*             } 
*         }
*   />
* </MultiRowCell>
* ```
*
* <b>RowHeader</b>
*
* Defines a template for a row header cell. Must be a child of the {@link wijmo.react.grid.multirow.MultiRow} component.
* For example, this template shows row indices in the row headers:
*
* ```html
* <MultiRow itemsSource={this.state.data}>
*   <MultiRowCellTemplate 
*       cellType="RowHeader" 
*       template={ (context) => context.row.index / context.row.grid.rowsPerItem + 1 } />
* </MultiRow>
* ```
*
* Note that this template is applied to a row header cell, even if it is in a row that is 
* in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
* content, define the <b>RowHeaderEdit</b> template.
*
* <b>RowHeaderEdit</b>
*
* Defines a template for a row header cell in edit mode. Must be a child of the 
* {@link wijmo.react.grid.multirow.MultiRow} component. For example, this template shows dots in the header
* of rows being edited:
*
* ```html
* <MultiRow itemsSource={this.state.data}>
*   <MultiRowCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '...' } />
* </MultiRow>
* ```
*
* Use the following <b>RowHeaderEdit</b> template to add the standard edit-mode indicator to cells where 
* the <b>RowHeader</b> template applies:
*
* ```html
* <MultiRow itemsSource={this.state.data}>
*   <MultiRowCellTemplate 
*       cellType="RowHeaderEdit"
*       template={ (context) => '\u270e\ufe0e' } />
* </MultiRow>
* ```
*
* <b>TopLeft</b>
*
* Defines a template for the top left cell. Must be a child of the {@link wijmo.react.grid.multirow.MultiRow} component.
* For example, this template shows a down/right glyph in the top-left cell of the grid:
*
* ```html
* <MultiRow itemsSource={this.state.data}>
*   <MultiRowCellTemplate 
*       cellType="TopLeft"
*       template={ (context) => {
*           return <span class="wj-glyph-down-right"></span>
*       } }
*   />
* </MultiRow>
* ```
*
* <b>GroupHeader</b>
*
* Defines a template for a group header cell in a {@link GroupRow}. Must be a child of 
* the {@link wijmo.react.grid.multirow.MultiRowCell} component.
*
* The <b>context.row</b> property contains an instance of the <b>GroupRow</b> class. If the grouping comes 
* from {@link CollectionView}, the <b>context.item</b> property references the {@link CollectionViewGroup} object.
*
* For example, this template uses a checkbox element as an expand/collapse toggle:
*
* ```html
* <MultiRowCell header="Country" binding="country">
*   <MultiRowCellTemplate 
*       cellType="GroupHeader" 
*       template={ (context) => {
*          return <React.Fragment>
*            <input type="checkbox"
*                checked={context.row.isCollapsed}
*                onChange={e =>
*                    context.row.isCollapsed = e.target.checked as boolean
*                } />
*            {context.item.name} ({context.item.items.length} items)
*          </React.Fragment>
*          }
*        }
*   />
* </MultiRowCell>
* ```
*
* <b>Group</b>
*
* Defines a template for a regular cell (not a group header) in a {@link GroupRow}. Must be a child of the 
* {@link wijmo.react.grid.multirow.MultiRowCell} component. This cell type has an additional <b>context.value</b>  
* property. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
* aggregate value.
*
* For example, this template shows aggregate's value and kind for group row cells in the "Sales"
* column:
*
* ```html
* <MultiRowCell header="Sales" binding="sales" aggregate="Avg">
*   <MultiRowCellTemplate 
*       cellType="Group" 
*       template={ (context) => {
*          return <React.Fragment>
*            Average: {wjcCore.Globalize.formatNumber(context.value, 'N0')}
*          </React.Fragment>
*          }
*        }
*   />
* </MultiRowCell>
* ```
*
* <b>NewCellTemplate</b>
* 
* Defines a cell in a new row template. Must be a child of the {@link wijmo.react.grid.multirow.MultiRowCell} component.
* Note that the <b>context.item</b> property is undefined for this type of a cell.
* For example, this cell template shows a placeholder in the Date column's cell in the "new row" item:
*
* ```html
* <MultiRowCell header="Date" binding="date">
*   <MultiRowCellTemplate 
*       cellType="NewCellTemplate"
*       template={ (context) => 'Enter a date here' } />
* </MultiRowCell>
* ```
*/
    export class MultiRowCellTemplate extends FlexGridCellTemplate {
        get template(): MultiRowCellTemplateRender {
            return this.props[MultiRowCellTemplate._CellRenderFuncProp];
        }
    }

    export interface IMultiRowCellTemplateContext extends ICellTemplateContext {
        col: wijmo.grid.multirow.MultiRowCell;
    }

    export type MultiRowCellTemplateRender = (context: IMultiRowCellTemplateContext) => any;
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.sheet.FlexSheet} control.
     * 
     * The <b>flex-sheet</b> component may contain
     * a {@link wijmo.react.grid.sheet.Sheet} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.sheet.FlexSheet} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexSheet extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.sheet.FlexSheet, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.sheet.Sheet} class.
     * 
     * The <b>sheet</b> component should be contained in
     * a {@link wijmo.react.grid.sheet.FlexSheet} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.sheet.Sheet} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Sheet extends ComponentBase {
        _parentProp = 'sheets';
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.grid.sheet.Sheet, { objectProps: ['itemsSource']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.transposed.TransposedGrid} control.
     * 
     * The <b>transposed-grid</b> component may contain
     * a {@link wijmo.react.grid.transposed.TransposedGridRow} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposed.TransposedGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TransposedGrid extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.transposed.TransposedGrid, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups', 'rowGroups']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.grid.transposed.TransposedGridRow} class.
     * 
     * The <b>transposed-grid-row</b> component should be contained in
     * a {@link wijmo.react.grid.transposed.TransposedGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposed.TransposedGridRow} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TransposedGridRow extends ComponentBase {
	    
        _parentProp = '_rowInfo';
        constructor(props) {
            super(props, wijmo.grid.transposed.TransposedGridRow, { objectProps: ['dataMap', 'cellTemplate', 'editor']});
        }

        protected _initParent(): void {
            var grid = <wijmo.grid.transposed.TransposedGrid>this.parent.control;
            if (grid.autoGenerateRows) {
                grid.autoGenerateRows = false;
                grid._rowInfo.clear();
            }

            super._initParent();
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.grid.transposedmultirow.TransposedMultiRow} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposedmultirow.TransposedMultiRow} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TransposedMultiRow extends ComponentBase {
        constructor(props) {
            super(props, wijmo.grid.transposedmultirow.TransposedMultiRow, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups', 'layoutDefinition']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component that represents a {@link wijmo.grid.immutable.ImmutabilityProvider} in a {@link wijmo.react.grid.FlexGrid}. 
     * 
     * The {@link wijmo.react.grid.immutable.ImmutabilityProvider} component, 
     * being added to a {@link wijmo.react.grid.FlexGrid} component, 
     * allows the latter to perform data edits without mutating the underlying
     * data. Instead, this class provides a data change event, which can be used to dispatch
     * change actions to the global _Store_, such as a 
     * <a href="https://redux.js.org/" target="_blank">Redux</a> _Store_.
     * 
     * The controlled **FlexGrid** control should not specify its **itemsSource**. Instead, the
     * **itemsSource** property of this class instance should be assigned with the 
     * immutable array from the _Store_, which grid will display and edit.
     * 
     * When a user edits data via the grid, 
     * the {@link wijmo.grid.immutable.ImmutabilityProvider.dataChanged} event is triggered,
     * bringing all the necessary information to you about the change (which item is affected,
     * if item was changed or added or deleted, and so on). This event should be used to dispatch
     * corresponding data change actions to the _Store_.
     * 
     * Note that **FlexGrid** edits data on a row level basis, which means that you can change multiple
     * cell values in the same row, and only after you move focus out of the row, all the changes
     * to the row will be applied simultaneously. Or you can press the _Cancel_ key to cancel all 
     * the changes in the row. The same is true for adding a row into the datagrid.
     * 
     * Note also that some changes like pasting a text into the datagrid, or deleting rows,
     * can affect multiple rows. In this case **ImmutabilityProvider** will trigger 
     * the {@link wijmo.grid.immutable.ImmutabilityProvider.dataChanged} event
     * multiple times, separately for each affected row. This simplifies data change processing
     * in the _Store_ reducers.
     * 
     * This example demonstrates a fully editable **FlexGrid** component, with an associated  
     * **ImmutabilityProvider** component bound to an array from the _Redux Store_. The dataChanged
     * event handler dispatches corresponding data change actions to the _Store_.
     * The example assumes that _Redux Store_ data and action creator functions are bound 
     * to the presentation component as properties, using the _react-redux_ _connect_ method.
     * ```typescript
     * import { DataChangeEventArgs, DataChangeAction } from '@grapecity/wijmo.grid.immutable';
     * import { ImmutabilityProvider } from '@grapecity/wijmo.react.grid.immutable';
     * import { FlexGrid } from '@grapecity/wijmo.react.grid';
     * 
     * export class GridView extends React.Component<any, any> {
     *   render() {
     *     return <FlexGrid allowAddNew allowDelete>
     *        <ImmutabilityProvider 
     *           itemsSource={this.props.items}
     *           dataChanged={this.onGridDataChanged} />
     *     </FlexGrid>
     *   }
     *   onGridDataChanged(s: ImmutabilityProvider, e: DataChangeEventArgs) {
     *       switch (e.action) {
     *           case DataChangeAction.Add:
     *               this.props.addItemAction(e.newItem);
     *               break;
     *           case DataChangeAction.Remove:
     *               this.props.removeItemAction(e.newItem, e.itemIndex);
     *               break;
     *           case DataChangeAction.Change:
     *               this.props.changeItemAction(e.newItem, e.itemIndex);
     *               break;
     *       }
     *   }
     * }
     * ```
     */ 

    export class ImmutabilityProvider extends ComponentBase {
        _parentInCtor = true;
        constructor(props) {
            super(props, wijmo.grid.immutable.ImmutabilityProvider, { objectProps: ['itemsSource']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.input.ListBox} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ListBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     * 
     * The component includes a <b>wjItemTemplate</b> property which is used to define list item template.
     * The template is a function with single argument. The argument is a plain object with keys of
     * <b>control</b> (list control, owner of the list item),
     * <b>item</b> (item data for the list item) and
     * <b>itemIndex</b> (zero-based index of the list item).
     */
    export class ListBox extends ComponentBase {
        
        wjItemTemplate: ItemTemplateRender;
        constructor(props) {
            super(props, wijmo.input.ListBox, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'checkedItems', 'wjItemTemplate']});
        }
        
        componentDidMount() {
            const ctrl = super.componentDidMount()
            new ItemTemplate(this);
            return ctrl;
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.MultiSelectListBox} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiSelectListBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MultiSelectListBox extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.MultiSelectListBox, { objectProps: ['itemsSource', 'checkedItems']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.ComboBox} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ComboBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     * 
     * The component includes a <b>wjItemTemplate</b> property which is used to define list item template.
     * The template is a function with single argument. The argument is a plain object with keys of
     * <b>control</b> (list control, owner of the list item),
     * <b>item</b> (item data for the list item) and
     * <b>itemIndex</b> (zero-based index of the list item).
     */
    export class ComboBox extends ComponentBase {
        
        wjItemTemplate: ItemTemplateRender;
        constructor(props) {
            super(props, wijmo.input.ComboBox, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'wjItemTemplate']});
        }
        
        componentDidMount() {
            const ctrl = super.componentDidMount()
            new ItemTemplate(this);
            return ctrl;
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.AutoComplete} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.AutoComplete} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class AutoComplete extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.AutoComplete, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.Calendar} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Calendar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Calendar extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.Calendar);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.ColorPicker} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ColorPicker} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class ColorPicker extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.ColorPicker, { objectProps: ['palette']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputMask} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputMask} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputMask extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputMask);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputColor} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputColor} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputColor extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputColor);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.MultiSelect} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiSelect} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     * 
     * The component includes a <b>wjItemTemplate</b> property which is used to define list item template.
     * The template is a function with single argument. The argument is a plain object with keys of
     * <b>control</b> (list control, owner of the list item),
     * <b>item</b> (item data for the list item) and
     * <b>itemIndex</b> (zero-based index of the list item).
     */
    export class MultiSelect extends ComponentBase {
        
        wjItemTemplate: ItemTemplateRender;
        constructor(props) {
            super(props, wijmo.input.MultiSelect, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'checkedItems', 'wjItemTemplate']});
        }
        
        componentDidMount() {
            const ctrl = super.componentDidMount()
            new ItemTemplate(this);
            return ctrl;
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.MultiAutoComplete} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiAutoComplete} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MultiAutoComplete extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.MultiAutoComplete, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'selectedItems']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputNumber} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputNumber} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputNumber extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputNumber);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputDate} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDate} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputDate extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputDate, { objectProps: ['predefinedRanges']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputTime} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputTime} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputTime extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputTime, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputDateTime} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDateTime} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputDateTime extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputDateTime, { objectProps: ['predefinedRanges']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.InputDateRange} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDateRange} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class InputDateRange extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.InputDateRange, { objectProps: ['predefinedRanges']});
        } 
    }
 
 

    interface _IContextMenuTargets {
        elements?: HTMLElement[];
        listeners?: ((e: MouseEvent) => void)[];
    }
    /**
     * React component for the {@link wijmo.input.Menu} control.
     * 
     * The <b>menu</b> component may contain
     * the following child components: 
     * {@link wijmo.react.input.MenuItem}
     * and {@link wijmo.react.input.MenuSeparator}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Menu} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     * 
     * The component includes a <b>wjItemTemplate</b> property which is used to define list item template.
     * The template is a function with single argument. The argument is a plain object with keys of
     * <b>control</b> (list control, owner of the list item),
     * <b>item</b> (item data for the list item) and
     * <b>itemIndex</b> (zero-based index of the list item).
     * 
     * The component includes a <b>contextMenuOf</b> property which is used to assign context menu to elements or controls.
     * Value of the property can be id attribute of HTMLElement, reference or array of HTMLElement/ReactComponent.
     */
    export class Menu extends ComponentBase {
        
        
        wjItemTemplate: ItemTemplateRender;
        private _definedHeader: string;
        private _value: any;
        private _contextMenuData: _IContextMenuTargets = {};
        readonly contextMenuProp = 'contextMenuOf';
        constructor(props) {
            super(props, wijmo.input.Menu, { objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'wjItemTemplate']});
        }

        get value(): any {
            return this._value;
        }
        set value(value: any) {
            this._value = value;
            if (value != null) {
                this.control.selectedValue = value;
                this._updateHeader();
            }
        }
	    
        
        componentDidMount() {
            const ctrl = super.componentDidMount()
            this._definedHeader = this.props.header;
            this.value = this.props.value;
            
            new ItemTemplate(this);
            this._contextMenuBindListeners();
            return ctrl;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._definedHeader = this.props.header;
            this.value = this.props.value;
            const contextMenuChangedElements = this._contextMenuGetElementsIfChanged()
            if (contextMenuChangedElements) {
                // unbind/bind regardless of prop elements equality for simplicity
                this._contextMenuUnbindListeners();
                this._contextMenuBindListeners(contextMenuChangedElements);
            }
        }

        componentWillUnmount() {
            this._contextMenuUnbindListeners();
            super.componentWillUnmount();
        }

        protected _createControl(): any {
            const ctrl = super._createControl();

            ctrl.itemsSource = new wijmo.collections.ObservableArray();
            ctrl.selectedIndex = 0;
            ctrl.listBox.formatItem.addHandler(this._fmtItem, this);
            ctrl.invalidate();

            ctrl.itemClicked.addHandler((e?: wijmo.EventArgs) => {
                this.value = this.control.selectedValue;
            });

            return ctrl;
        }

        private _updateHeader() {
            this.control.header = this._definedHeader || '';
            const selItem = this.control.selectedItem;
            if (this.value != null && selItem && this.control.displayMemberPath) {
                let currentValue = null;
                if (selItem instanceof MenuItem) {
                    const contentRoot = (<MenuItem>selItem).contentRoot;
                    if (contentRoot) {
                        currentValue = contentRoot.innerHTML;
                    } else {
                        currentValue = selItem[this.control.displayMemberPath];
                    }
                }
                if (currentValue != null) {
                    this.control.header += ': <b>' + currentValue + '</b>';
                }
            }
        }

        private _fmtItem(s: wijmo.Control, e: wijmo.input.FormatItemEventArgs) {
            if (!(e.data instanceof MenuItem
                || e.data instanceof MenuSeparator)) {
            return;
        }
            e.item.textContent = '';
            e.item.appendChild(e.data.contentRoot);
            e.data.added(e.item);
        }

        private _contextMenuGetElementsIfChanged(): HTMLElement[] {
            const prevElements: HTMLElement[] = this._contextMenuData.elements || [];
            const currElements = this._contextMenuGetElements(this.props[this.contextMenuProp]);
            if (prevElements.length !== currElements.length) {
                return currElements;
            }
            for (let idx in prevElements) {
                if (prevElements[idx] !== currElements[idx]) {
                    return currElements;
                }
            }
            return null;
        }

        private _contextMenuGetElements(prop: any[]): HTMLElement[] {
            const standardized: HTMLElement[] = [];
            (wijmo.isArray(prop) ? prop : [prop]).forEach((val: any) => {
                if (val) {
                    let element: HTMLElement = null;
                    if (typeof val === 'string') {
                        element = document.getElementById(val);
                    } else if (typeof val === 'object') {
                        const valCurrent = val.current;
                        if (valCurrent) {
                            if (valCurrent instanceof HTMLElement) {
                                element = valCurrent;
                            } else if (valCurrent instanceof ComponentBase) {
                                element = valCurrent.control.hostElement;
                            } else {
                                if (ComponentBase.isInStrictMode(valCurrent)) {
                                    console.warn(`In React StrictMode reference in Menu ${this.contextMenuProp} prop should point to HTMLElement (not custom component)`)
                                }
                                element = ReactDOM.findDOMNode(valCurrent) as HTMLElement;
                            }
                        }
                    }
                    if (element) {
                        standardized.push(element);
                    }
                }
            });
            return standardized;
        }

        private _contextMenuBindListeners(contextMenuChangedElements: HTMLElement[] = null) {
            // hide contextMenu
            if (this.props.hasOwnProperty(this.contextMenuProp)) {
                this.control.hostElement.style.display = 'none';
            }

            const elements = contextMenuChangedElements
                || this._contextMenuGetElements(this.props[this.contextMenuProp]);
            const listeners: ((e: MouseEvent) => void)[] = [];
            elements.forEach((element: HTMLElement) => {
                let listener = null;
                if (element) {
                    listener = e => {
                        // don't show menu for disabled elements
                        if (wijmo.closest(e.target, '[disabled]')) {
                            return;
                        }

                        // show menu if possible
                        const menu: wijmo.input.Menu = this.control;
                        if (menu && menu.dropDown) {
                            e.preventDefault();
                            e.stopPropagation();
                            menu.owner = element;
                            menu.show(e);
                        }
                    };
                    element.addEventListener('contextmenu', listener);
                }
                listeners.push(listener);
            });
            this._contextMenuData = { elements, listeners };
        }

        private _contextMenuUnbindListeners() {
            const contextMenuData = this._contextMenuData;
            for (let idx in (contextMenuData.elements || [])) {
                const element: HTMLElement = contextMenuData.elements[idx];
                if (element) {
                    element.removeEventListener('contextmenu', contextMenuData.listeners[idx]);

                    // hide menu if visible
                    const menu: wijmo.input.Menu = this.control;
                    if ((menu.owner === element) && menu.isDroppedDown) {
                        menu.owner = undefined;
                        menu.hide();
                    }
                }
            }
            this._contextMenuData = {};
        } 
    }
 
 

    /**
     * React component that represents an item in a {@link wijmo.react.input.Menu} control.
     * 
     * The <b>menu-item</b> component should be contained in
     * a {@link wijmo.react.input.Menu} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link } class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MenuItem extends ComponentBase {
        
        _parentProp = 'itemsSource';
        _siblingId = 'menuItemDir';
        contentRoot: HTMLElement;
        value = null;
        cmd = null;
        cmdParam = null;
        constructor(props) {
            super(props, null, { objectProps: ['value', 'cmd', 'cmdParam']});
        }
	    
        protected _createControl(): any {
            const ownerMenu = this.parent.control;
            if (ownerMenu.itemsSource.length == 1 && ownerMenu.selectedIndex < 0) {
                ownerMenu.selectedIndex = 0;
            }
            if (!ownerMenu.displayMemberPath) {
                ownerMenu.displayMemberPath = 'header';
            }
            if (!ownerMenu.selectedValuePath) {
                ownerMenu.selectedValuePath = 'value';
            }
            if (!ownerMenu.commandPath) {
                ownerMenu.commandPath = 'cmd';
            }
            if (!ownerMenu.commandParameterPath) {
                ownerMenu.commandParameterPath = 'cmdParam';
            }

            return this;
        }

        _renderImpl(): any {
            return React.createElement('div', {
                style: {
                    display: 'none'
                },
                ref: this._hostRef,
            }, React.createElement('div', {
                ref: ref => this.contentRoot = ref
            }, this.props.children)); 
        }

        added(toItem: HTMLElement) {
        } 
    }
 
 

    /**
    * React component that represents an item separator in a {@link wijmo.react.input.Menu} control.
     * 
     * The <b>menu-separator</b> component should be contained in
     * a {@link wijmo.react.input.Menu} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link } class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class MenuSeparator extends ComponentBase {
        
        _parentProp = 'itemsSource';
        _siblingId = 'menuItemDir';
        contentRoot: HTMLElement;
        constructor(props) {
            super(props, null);
        }
	    
        protected _createControl(): any {
            return this;
        }

        _renderImpl(): any {
            return React.createElement('div', {
                style: {
                    display: 'none'
                },
                ref: this._hostRef,
            }, React.createElement('div', {
                ref: ref => this.contentRoot = ref,
                style: {
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'lightgray'
                }
            }, this.props.children)); 
        }

        added(toItem: HTMLElement) {
            // prevent item selection
            wijmo.addClass(toItem, 'wj-state-disabled');
        } 
    }
 
 
/**
 * TBD
 */
export interface ItemTemplateContext {
    control: wijmo.Control;
    item: any;
    itemIndex: number;
}

interface TemplateItem extends ItemTemplateContext {
    itemEl: HTMLElement;
}

/**
 * TBD
 */
export type ItemTemplateRender = (context: ItemTemplateContext) => any;

class ItemTemplate {
    private _templateItems: TemplateItem[] = [];

    component: any;
    ownerControl: wijmo.Control;
    listBox: wijmo.input.ListBox;
    wjItemTemplate: ItemTemplateRender;

    constructor(component: any) {
        this.component = component;
        this.ownerControl = component.control;
        this.wjItemTemplate = this.component.props.wjItemTemplate;
        this.listBox = this._getListBox(this.ownerControl);
        this._attachToComponent();
        this._attachToControl();
    }

    private _attachToComponent(): void {
        this.component._afterDidUpdate.addHandler(this._updateTemplateItems, this);
        this.component._beforeWillUnmount.addHandler(this._beforeWillUnmount, this);
    }

    private _beforeWillUnmount(): void {
        this.component._afterDidUpdate.removeHandler(this._updateTemplateItems, this);
        this.component._beforeWillUnmount.removeHandler(this._beforeWillUnmount, this);
        this._destroyTemplateItems();
    }

    private _updateTemplateItems(): void {
        if (this.component.props.wjItemTemplate == null &&
                wijmo.isFunction(this.wjItemTemplate)) {
            this.wjItemTemplate = null;
            this._templateItems.forEach((tplItem) => {
                ReactDOM.unmountComponentAtNode(tplItem.itemEl);
                // timeout prevent "Failed to execute 'removeChild' on 'Node'" error
                setTimeout(() => {
                    const cnt = wijmo.isString(tplItem.item) ?
                        tplItem.item : tplItem.item[this.listBox.displayMemberPath];
                    tplItem.itemEl.textContent = cnt;
                });
            });
        } else if (wijmo.isFunction(this.component.props.wjItemTemplate)) {
            this.wjItemTemplate = this.component.props.wjItemTemplate;
            this._templateItems.forEach((tplItem) => {
                ReactDOM.render(this._createItemElTpl(tplItem), tplItem.itemEl);
            });
        }
    }

    private _attachToControl(): void {
        this.listBox.formatItem.addHandler(this._fmtItem, this);
        this.listBox.loadingItems.addHandler(this._destroyTemplateItems, this);
        this.ownerControl.invalidate();
    }

    private _fmtItem(control: wijmo.Control, e: wijmo.input.FormatItemEventArgs): void {
        const itemEl = e.item;
        const context = {
            control,
            item: e.data,
            itemIndex: e.index
        };
        this._templateItems.push({
            ...context,
            itemEl
        });
        if (wijmo.isFunction(this.wjItemTemplate)) {
            itemEl.textContent = '';
            ReactDOM.render(this._createItemElTpl(context), itemEl);
        }
    }

    private _getListBox(ownerControl: any): wijmo.input.ListBox {
        return ownerControl instanceof wijmo.input.ListBox ? ownerControl : ownerControl.listBox;
    }

    private _destroyTemplateItems(): void {
        if (wijmo.isFunction(this.wjItemTemplate)) {
            this._templateItems.forEach((tplItem) => {
                ReactDOM.unmountComponentAtNode(tplItem.itemEl);
            });
        }
        this._templateItems = [];
    }

    private _createItemElTpl(context: ItemTemplateContext): React.ReactElement {
        return React.createElement('div', {}, this.wjItemTemplate({
            control: context.control,
            item: context.item,
            itemIndex: context.itemIndex
        }));
    }
}

    /**
     * React component for the {@link wijmo.input.Popup} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Popup} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Popup extends ComponentBase {
	    
        constructor(props) {
            super(props, wijmo.input.Popup);
        }

        _renderImpl(): any {
            return React.createElement('div', { ref: this._hostRef }, this.props.children);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.input.CollectionViewNavigator} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.CollectionViewNavigator} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class CollectionViewNavigator extends ComponentBase {
        constructor(props) {
            super(props, wijmo.input.CollectionViewNavigator, { objectProps: ['cv']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.olap.PivotGrid} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class PivotGrid extends ComponentBase {
        constructor(props) {
            super(props, wijmo.olap.PivotGrid, { objectProps: ['childItemsPath', 'mergeManager', 'itemsSource', 'virtualizationThreshold', 'columnGroups']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.olap.PivotChart} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class PivotChart extends ComponentBase {
        constructor(props) {
            super(props, wijmo.olap.PivotChart, { objectProps: ['itemsSource', 'headerStyle', 'footerStyle']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.olap.PivotPanel} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class PivotPanel extends ComponentBase {
        constructor(props) {
            super(props, wijmo.olap.PivotPanel, { objectProps: ['engine', 'itemsSource']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.olap.Slicer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.Slicer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Slicer extends ComponentBase {
        constructor(props) {
            super(props, wijmo.olap.Slicer, { objectProps: ['field']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.viewer.ReportViewer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.viewer.ReportViewer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class ReportViewer extends ComponentBase {
        constructor(props) {
            super(props, wijmo.viewer.ReportViewer, { objectProps: ['requestHeaders', 'parameters']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.viewer.PdfViewer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.viewer.PdfViewer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class PdfViewer extends ComponentBase {
        constructor(props) {
            super(props, wijmo.viewer.PdfViewer, { objectProps: ['requestHeaders']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.nav.TreeView} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.TreeView} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TreeView extends ComponentBase {
        constructor(props) {
            super(props, wijmo.nav.TreeView, { objectProps: ['childItemsPath', 'displayMemberPath', 'imageMemberPath', 'checkedMemberPath', 'itemsSource', 'selectedItem', 'selectedNode', 'checkedItems']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.nav.TabPanel} control.
     * 
     * The <b>tab-panel</b> component may contain
     * a {@link wijmo.react.nav.Tab} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.TabPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class TabPanel extends ComponentBase {
        constructor(props) {
            super(props, wijmo.nav.TabPanel, { objectProps: ['selectedTab']});
        }
		
        protected _createControl(): any {
            const control = new wijmo.nav.TabPanel(this._getElement(), null, true);
            control.tabs.beginUpdate();  // suppress updates handling during initialization
            return control;
        }

        componentDidMount() {
            super.componentDidMount();
            let control = this.control,
                selIdx = control.selectedIndex,
                tabs = control.tabs;
            if (selIdx > -1 && selIdx < tabs.length) {
                wijmo.addClass(tabs[selIdx].header, 'wj-state-active');
                control.onSelectedIndexChanged();
            }
            tabs.endUpdate(); // enable updates handling
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.nav.Tab} class.
     * 
     * The <b>tab</b> component should be contained in
     * a {@link wijmo.react.nav.TabPanel} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.Tab} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Tab extends ComponentBase {
        _parentProp = 'tabs';
        constructor(props) {
            super(props, wijmo.nav.Tab);
        }
		
        protected _createControl(): any {
            const host = this._getElement();
            const children = (host as HTMLElement).children;
            return new wijmo.nav.Tab(children[0], children[1]);
        }
        
        protected _renderImpl(): any {
            return React.createElement('div', { ref: this._hostRef }, this.props.children);
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.nav.Accordion} control.
     * 
     * The <b>accordion</b> component may contain
     * a {@link wijmo.react.nav.AccordionPane} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.Accordion} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class Accordion extends ComponentBase {
        constructor(props) {
            super(props, wijmo.nav.Accordion, { objectProps: ['selectedPane']});
        }
		
        protected _createControl(): any {
            const control = new wijmo.nav.Accordion(this._getElement(), null, true);
            control.panes.beginUpdate();  // suppress updates handling during initialization
            return control;
        }

        componentDidMount() {
            super.componentDidMount();
            const control = this.control;
            const panes = control.panes;
            // set default selected pane
            if ((control.selectedIndex < 0) && panes.length) {
                control.selectedIndex = 0;
            }
            panes.endUpdate(); // enable updates handling
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.nav.AccordionPane} class.
     * 
     * The <b>accordion-pane</b> component should be contained in
     * a {@link wijmo.react.nav.Accordion} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.AccordionPane} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class AccordionPane extends ComponentBase {
        _parentProp = 'panes';
        constructor(props) {
            super(props, wijmo.nav.AccordionPane);
        }
		
        protected _createControl(): any {
            const host = this._getElement();
            const children = (host as HTMLElement).children;
            return new wijmo.nav.AccordionPane(children[0], children[1]);
        }

        protected _renderImpl(): any {
            return React.createElement('div', { ref: this._hostRef }, this.props.children);
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.barcode.common.Codabar} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Codabar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeCodabar extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Codabar, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.Ean8} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Ean8} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeEan8 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Ean8, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.Ean13} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Ean13} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeEan13 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Ean13, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.Code39} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Code39} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeCode39 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Code39, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.Code128} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Code128} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeCode128 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Code128, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.Gs1_128} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Gs1_128} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1_128 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.Gs1_128, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.UpcA} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcA} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeUpcA extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.UpcA, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.UpcE0} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcE0} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeUpcE0 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.UpcE0, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.UpcE1} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcE1} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeUpcE1 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.UpcE1, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.common.QrCode} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.QrCode} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeQrCode extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.common.QrCode, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarOmnidirectional} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarOmnidirectional} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarOmnidirectional extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarOmnidirectional, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarTruncated} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarTruncated} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarTruncated extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarTruncated, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarStacked} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarStacked} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarStacked extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarStacked, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarStackedOmnidirectional extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarLimited} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarLimited} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarLimited extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarLimited, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarExpanded} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarExpanded} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarExpanded extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarExpanded, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Gs1DataBarExpandedStacked} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarExpandedStacked} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeGs1DataBarExpandedStacked extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Gs1DataBarExpandedStacked, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.Pdf417} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Pdf417} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodePdf417 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.Pdf417, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.composite.MicroPdf417} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.MicroPdf417} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeMicroPdf417 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.composite.MicroPdf417, { objectProps: ['quietZone', 'font', 'optionalFields']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.barcode.specialized.DataMatrixEcc000} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.DataMatrixEcc000} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeDataMatrixEcc000 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.DataMatrixEcc000, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.DataMatrixEcc200} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.DataMatrixEcc200} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeDataMatrixEcc200 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.DataMatrixEcc200, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.Code49} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Code49} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeCode49 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.Code49, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.Code93} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Code93} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeCode93 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.Code93, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.Itf14} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Itf14} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeItf14 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.Itf14, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.Interleaved2of5} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Interleaved2of5} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeInterleaved2of5 extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.Interleaved2of5, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.barcode.specialized.JapanesePostal} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.JapanesePostal} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class BarcodeJapanesePostal extends ComponentBase {
        constructor(props) {
            super(props, wijmo.barcode.specialized.JapanesePostal, { objectProps: ['quietZone', 'font']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

    module wijmo.react {
    















    /**
     * React component for the {@link wijmo.chart.map.FlexMap} control.
     * 
     * The <b>flex-map</b> component may contain
     * the following child components: 
     * {@link wijmo.react.chart.FlexChartLegend}
     * , {@link wijmo.react.chart.map.ScatterMapLayer}
     * , {@link wijmo.react.chart.map.GeoMapLayer}
     * and {@link wijmo.react.chart.map.GeoGridLayer}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.FlexMap} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class FlexMap extends ComponentBase {
        constructor(props) {
            super(props, wijmo.chart.map.FlexMap, { objectProps: ['palette', 'plotMargin', 'footerStyle', 'headerStyle', 'itemsSource', 'center']});
        }
		

        componentDidMount() {
            let ret = super.componentDidMount();
            this._setExtra(this.props);
            return ret;
        }

        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            this._setExtra(this.props);
        }

        private _setExtra(nextProps: any) {
            if ('tooltipContent' in nextProps) {
                this.control.tooltip.content = nextProps.tooltipContent;
            }
        }
 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.map.ScatterMapLayer} class.
     * 
     * The <b>scatter-map-layer</b> component should be contained in
     * a {@link wijmo.react.chart.map.FlexMap} component.
     * 
     * The <b>scatter-map-layer</b> component may contain
     * a {@link wijmo.react.chart.map.ColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.ScatterMapLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class ScatterMapLayer extends ComponentBase {
        _parentProp = 'layers';
        _siblingId = 'layers';
        constructor(props) {
            super(props, wijmo.chart.map.ScatterMapLayer, { objectProps: ['style', 'itemsSource']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.map.GeoMapLayer} class.
     * 
     * The <b>geo-map-layer</b> component should be contained in
     * a {@link wijmo.react.chart.map.FlexMap} component.
     * 
     * The <b>geo-map-layer</b> component may contain
     * a {@link wijmo.react.chart.map.ColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.GeoMapLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class GeoMapLayer extends ComponentBase {
        _parentProp = 'layers';
        _siblingId = 'layers';
        constructor(props) {
            super(props, wijmo.chart.map.GeoMapLayer, { objectProps: ['style', 'itemsSource', 'itemFormatter']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.map.GeoGridLayer} class.
     * 
     * The <b>geo-grid-layer</b> component should be contained in
     * a {@link wijmo.react.chart.map.FlexMap} component.
     * 
     * The <b>geo-grid-layer</b> component may contain
     * a {@link wijmo.react.chart.map.ColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.GeoGridLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class GeoGridLayer extends ComponentBase {
        _parentProp = 'layers';
        _siblingId = 'layers';
        constructor(props) {
            super(props, wijmo.chart.map.GeoGridLayer, { objectProps: ['style', 'itemsSource']});
        } 
    }
 
 

    /**
     * React component for the {@link wijmo.chart.map.ColorScale} class.
     * 
     * The <b>color-scale</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.react.chart.map.ScatterMapLayer}
     * , {@link wijmo.react.chart.map.GeoMapLayer}
     *  or {@link wijmo.react.chart.map.GeoGridLayer}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.ColorScale} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in JSX.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export class ColorScale extends ComponentBase {
        _parentProp = 'colorScale';
        constructor(props) {
            super(props, wijmo.chart.map.ColorScale, { objectProps: ['colors']});
        } 
    }
 
 


    }
    


    module wijmo.react {
    

    }
    

var Wj = wijmo.react;