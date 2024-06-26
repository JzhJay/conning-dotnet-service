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


    module wijmo.vue2 {
    




export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}

export function softGridDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}

    }
    


    module wijmo.vue2 {
    




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
    


    module wijmo.vue2 {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.interop.grid', wijmo.vue2);



    }
    

    module wijmo.vue2 {
    

declare var Vue: any;



export var VueApi: any = (Vue.version && (Vue.version[0] === '3'))
    ? {
        isV3Plus: true,
        modelValueProp: 'modelValue',
        extend: x => x,
        h: Vue.h,
        render: Vue.render,
    }
    : Vue;


// Base Vue component for all Wijmo for Vue component. See WjComponentBehavior docs
// for the details.
var WjVueBaseDefinition = {
    beforeCreate: function () {
        let behClass = <typeof WjComponentBehavior>this.$options[WjComponentBehavior._behClassProp];
        if (behClass) {
            this[WjComponentBehavior._behProp] = behClass._attach(this);
        }
    },
    mounted: function () {
        this[WjComponentBehavior._behProp].lhMounted();
    },
};
WjVueBaseDefinition[VueApi.isV3Plus ? 'unmounted' : 'destroyed'] = function() {
    this[WjComponentBehavior._behProp].lhDestroyed();
};
var WjVueBase = VueApi.extend(WjVueBaseDefinition);

/*
* Implements a 'behavior' attached to a Vue instance to control its functionality.
* The 'behavior' pattern is used due to limitations in Vue component implementation
* related to component inheritance. We can't represent a component using a conventional
* TS/ES6 class and be able to override base class methods.
* So, the 'behavior' class instance creates a standard Vue component with the component
* specific 'options' object and lifecycle hook methods (like mounted etc). Behavior instance
* attaches itself to the Vue component, and component calls lifecycle hook methods of the
* behavior (these method names are prefixed with 'lh', e.g. lhMounted).
* This way, the behavior has an access to the component properties/methods via the
* 'component' property, and allows us to override basic behavior methods (both lifecycle
* like lhMounted() and custom like _initParent()).
* The Vue component instance maintained by the behavior extends (in terms of the Vue component
* extension) the base WjVueBase component, which implements the basic lifecycle method calls
* delegation to the behavior's 'lh' methods.
* 
* Every Wijmo Vue component is represented by a separate class derived from
* WjComponentBehavior.
* Component behavior class should define its metadata which drives the behavior functionality
* in the static properties,
* the list of possible properties is described in the 'METADATA properties' section
* in this class definition.
* Component behavior classes can override some base class methods like _initParent()
* to customize their functionality.
* IMPORTANT note for the implementer of this and derived classes. The metadata is
* provided using *static* inheritance, i.e. metadata related property values are statically
* overridden in the inherited classes (read constructor functions). Because of this, these static
* properties should be accessed in the class instance methods using the 'this.constructor'
* expression. E.g. it should be 'this.constructor.parentProp', but not
* 'WjComponentBehavior.parentProp'.
* 
* Component behavior class creates a Vue component instance using the static
* register() method, that internally calls the Vue.component(...) method
* to globally register the corresponding Vue component. The component export
* pattern looks as follows:
*
* class WjFlexGridBehavior extends WjComponentBehavior {
*    static tag = 'wj-flex-grid';
*    static template = '<div><slot/></div>';
*    static className = 'wijmo.grid.FlexGrid';
* }
* // DOCUMENTATION comment goes here
* export var WjFlexGrid = WjFlexGridBehavior.register();
* 
* So we export a variable containing the result of the WjFlexGridBehavior.register()
* call, which is in turn a result of the Vue.component(...) call.
* The behavior class itself is used internally and is not exported.
* 
*/
export class WjComponentBehavior {
    // ======= METADATA properties. Should/can be overridden in the derived classes. ======
    // Component tag name used in Vuew templates, like 'wj-flex-grid-column'.
    static tag: string;
    // For rendering Component HTML.
    static render: (createElement: () => any) => any = function (createElement: any) {
        const defaultSlot = this.$slots.default;
        return VueApi.isV3Plus
            ? VueApi.h('div', {}, [defaultSlot && defaultSlot()])
            : createElement('div', [defaultSlot]);
    };
    // The underlying control class name with a namespace, like 'wijmo.grid.Column'.
    // This property is used to determine a property list and will be eliminated in the 
    // nearest future in favor of explicit priority ordered property list.
    static className: string;
    // Function returning class reference, e.g.:
    // static classCtor = function() { return wijmo.grid.Column };
    // It must be a function to not fail in global modules when corresponding class' module
    // is not loaded.
    static classCtor: () => any;
    // For child components assigning an item or a complex object to a parent component's
    // property, the default name of this property. E.g. 'columns' for WjFlexGridColumnBehavior.
    // This property value (together with parentInCtor) is the cue for the behavior that the
    // component functions as a child component. Being set to a string value (including empty string)
    // makes it a child component.
    // InteropGenerator should retrieve this value using the ComponentMetadata.membersMeta.parentProperty
    // property.
    static parentProp: string;
    // Being set to true, indicates that this is a child component that should receive a reference 
    // to a parent control in its constructor parameter. The example is FlexGridFilter.
    // Any boolean value of this property indicates
    // that this is a child component, so for non-child components the property value should be
    // undefined.
    // InteropGenerator should retrieve this value from the 
    // ComponentMetadata.membersMeta.getParentReferenceProperty() method.
    static parentInCtor: boolean;
    // Child component's sibling id, should be retrieved from the metadata using the 
    // ComponentMetadata.membersMeta.siblingId property.
    static siblingId: string;
    static data: any;
    ///// prop/event meta
    static props: string[];
    static events: string[];
    static changeEvents: { [event: string]: string[] };
    static modelProp: string;
    // additional custom interop level properties
    //static extraProps: string[];
    // ========= End of METADATA properties =====================================================

    private static readonly _typeSiblingIdAttr = '_wjSiblingId';
    static readonly _behClassProp = '_wjBehCl';
    static readonly _behProp = '__wjBeh';
    // Name of property containing propertyName => property initialization index map.
    // This is a static property (ComponentBehaviourClass.constructor.__propInitIdx),
    // one map per component class.
    static readonly _propIdxMapProp = '__propInitIdx';
    //private static _controlType: ObjectConstructor = null;
    private static _siblingDirId = 0;
    private static _modelEvent: string;


    private _siblingId: string;
    private _isMounted = false;
    private _mountedCBs: (() => void)[] = [];
    private _siblingInsertedEH;

    // Contains a reference to the attached Vue component instance.
    readonly component: any;
    // References the underlying Wijmo object
    control: any;
    // For the child behaviors, contains a reference to the parent component behavior.
    parent: WjComponentBehavior;

    // Make "this.constructor" expression typed, for the convenient access to the overridden static members
    ['constructor']: typeof WjComponentBehavior;

    static _attach(component: any): WjComponentBehavior {
        return new this(component);
    }

    /*
    * Creates and globally registers a corresponding Vue component, and returns the
    * reference to it. This class is used to create Wijmo for Vue component to export
    * for users' consumption. E.g.:
    * export var WjFlexGrid = WjFlexGridBehavior.register();
    */
    static register(): any {
        let options = {
            data: this.data,
            extends: WjVueBase,
            render: this.render,
            //props: _getProps(this.className, this.extraProps),
            props: this._getProps(),
            model: this._getModel(),
            [WjComponentBehavior._behClassProp]: this
        };
        return VueApi.isV3Plus
            ? { ...options, emits: this._getEmits() }
            : VueApi.component(this.tag, options);
    }

    constructor(component: any) {
        this.component = component;
    }

    // ======== Vue lifecicle hooks. =================
    // Called by the attached Vue "component"'s lifecycle hooks.

    //lhCreated() {
    //}

    // Vue 'mounted' hook.
    lhMounted() {
        //console.log('Base behavior mounted');
        if (this._isChild()) {
            let parCmp = this.component.$parent;
            if (parCmp) {
                this.parent = parCmp[WjComponentBehavior._behProp];
                this.parent._mountedCB(() => {
                    //this._setParent(parCmp);
                    this._prepareControl();
                    this._initParent();
                });
            }
        } else {
            this._prepareControl();
        } 
    }

    lhDestroyed() {
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
                control.dispose();
            }
        }
    }
    // === End fo Vue lifecicle hooks

    private static _getProps() {
        let ret = [];
        if (this.props) {
            ret = this.props;
        }
        if (this.events) {
            ret = ret.concat(this.events);
        }
        if (this.changeEvents) {
            ret = ret.concat(Object.keys(this.changeEvents));
        }

        if (VueApi.isV3Plus && this.modelProp) {
            ret.push(VueApi.modelValueProp);
        }

        return ret;
    }

    private static _getModel() {
        let modelProp = this.modelProp;
        if (modelProp) {
            return {
                prop: modelProp,
                event: 'update:' + modelProp
            }
        }
        // if (modelProp) {
        //     let modelEvent = this._modelEvent;
        //     if (!modelEvent) {
        //         let changeEvents = this.changeEvents,
        //             eventNames = Object.keys(changeEvents);
        //         for (let evName of eventNames) {
        //             let props = changeEvents[evName];
        //             if (props) {
        //                 let idx = props.indexOf(modelProp);
        //                 if (idx > -1) {
        //                     modelEvent = this._modelEvent = evName;
        //                 }
        //             }
        //         }
        //     }
        //     if (modelEvent) {
        //         return {
        //             prop: modelProp,
        //             event: modelEvent
        //         }
        //     }
        // }
        return null;
    }

    private static _getEmits() {
        if (!this.changeEvents) {
            return [];
        }
        let changedProps = [];
        Object.keys(this.changeEvents).forEach(event => this.changeEvents[event].forEach(prop => {
            if (changedProps.indexOf(prop) < 0) {
                changedProps.push(prop);
            }
        }));
        if (this.modelProp) {
            changedProps.push(VueApi.modelValueProp);
        }
        return changedProps.map(item => `update:${item}`);
    }

    // Creates a control instance owned by the directive (analogue of Ng1 _initControl).
    // Can be overridden in the derived class.
    protected _createControl(): any {
        //return this.directive._initControl(this._parentInCtor() ? this.parent.control : this.directiveTemplateElement[0]);
        let param = this._isChild() ? (this._isParentInCtor() ? this.parent.control : undefined)
            : <HTMLElement>this._getElement(),
            control = new (this.constructor._getControlType())(param);
        return control;
    }

    // For child component, initializes its parent after component's 'control' has been created.
    // Can be overridden in the derived class with the mandatory 'super' call.
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

    // Called on every property update.
    // Can be overridden in the derived class with the 'super' call in case of unprocessed property.
    protected _updateControl(property: string, newValue: any) {
        this.control[property] = newValue;
    }


    // Creates a control and initializes its properties.
    private _prepareControl() {
        // instantiate the control
        let control = this.control = this._createControl(),
            host = <HTMLElement>this._getElement(),
            CB = this.constructor;

        // expose reference to the underlying control via the component's
        // 'control' property.
        this.component.control = control;

        // define sibling id
        if (!this._siblingId) {
            if (CB.siblingId == null) {
                CB.siblingId = (++CB._siblingDirId) + ''
            }
            this._siblingId = CB.siblingId;
        }
        host.setAttribute(CB._typeSiblingIdAttr, this._siblingId);

        this._isMounted = true;
        // Notify children before initializing own control's properties
        // Call 'mounted' callbacks
        let cbs = this._mountedCBs;
        this._mountedCBs = [];
        for (let cb of cbs) {
            cb();
        }

        // Init after children have been initialized and performed necessary actions on this parent.
        _initialize(this);
    }

    private _isChild(): boolean {
        let ctor = this.constructor;
        return ctor.parentProp != null || ctor.parentInCtor != null;
    }
    private _isParentInCtor(): boolean {
        return this.constructor.parentInCtor === true;
    }
    private _getParentProp(): string {
        return (VueApi.isV3Plus ? this.component.$props : this.component.$options.propsData).wjProperty || this.constructor.parentProp;
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
            if (curEl.nodeType == 1 && curEl.getAttribute(WjComponentBehavior._typeSiblingIdAttr) == dirId) {
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

    private _getElement() {
        return this.component.$el;
    }

    private static _getControlType(): ObjectConstructor {
        return this.classCtor();
        //if (!this._controlType) {
        //    let cls: any = window,
        //        ns = this.className.split('.');
        //    for (var i = 0; i < ns.length && cls != null; i++) {
        //        cls = cls[ns[i]];
        //    }
        //    this._controlType = cls;
        //}
        //return this._controlType;
    }

    _mountedCB(cb: () => void) {
        if (this._isMounted) {
            cb();
        } else {
            this._mountedCBs.push(cb);
        }
    }


}



// // get an array with a control's properties and events
// export function _getProps(ctlClass: string, extraProps?: string[]) {

//     // resolve control class (in case the module hasn't been loaded)
//     var cls: any = window,
//         ns = ctlClass.split('.');
//     for (var i = 0; i < ns.length && cls != null; i++) {
//         cls = cls[ns[i]];
//     }
//     if (!cls) return null;

//     // start with 'special' members
//     var p = ['control', 'initialized', 'wjProperty',
//         // PATCH: for ComboBox and derived classes, will be eliminated after 
//         // we switch to the metadata based implementation
//         'formatItem'
//     ];

//     // add properties and events on this class and all ancestors
//     for (var proto = cls.prototype; proto != Object.prototype; proto = Object.getPrototypeOf(proto)) {
//         var props = Object.getOwnPropertyNames(proto);
//         for (var i = 0; i < props.length; i++) {
//             var prop = props[i],
//                 pd = Object.getOwnPropertyDescriptor(proto, prop),
//                 eventRaiser = prop.match(/^on[A-Z]/);
//             if (pd.set || eventRaiser) {
//                 if (eventRaiser) {
//                     prop = prop[2].toLowerCase() + prop.substr(3);
//                 }
//                 if (p.indexOf(prop) < 0 && !prop.match(/disabled|required|style/)) {
//                     p.push(prop);
//                 }
//             }
//         }
//     }

//     // add extra properties
//     if (extraProps) {
//         Array.prototype.push.apply(p, extraProps);
//     }

//     // done
//     return p;
// }

// initialize control properties from component, add watchers to keep the control in sync
export function _initialize(behavior: WjComponentBehavior): any {
    let component = behavior.component,
        ctl = behavior.control,
        ctor = behavior.constructor,
        propIdxMap = ctor[WjComponentBehavior._propIdxMapProp];

    // build property initialization index map, once per component behavior class
    if (!propIdxMap) {
        propIdxMap = ctor[WjComponentBehavior._propIdxMapProp] = {};
        let propArr: string[] = ctor.props;
        if (propArr) {
            for (let i = 0; i < propArr.length; i++) {
                propIdxMap[propArr[i]] = i;
            }
        }
    }

    // build list of sorted property names
    var props: string[] = [],
        events: string[] = [],
        eventsChg: string[] = [],
        changeEvents = ctor.changeEvents || {};

    const componentPropsData = VueApi.isV3Plus
        ? component.$props
        : component.$options.propsData;
    const modelProp = ctor.modelProp;

    // for (var prop in component.$options.propsData) {
    for (var prop in componentPropsData) {
        if (propIdxMap[prop] != null) {
            props.push(prop);
        } else if (changeEvents[prop]) {
            eventsChg.push(prop);
        } else {
            events.push(prop);
        }
    }
    if (VueApi.isV3Plus && modelProp) {
        if (componentPropsData.hasOwnProperty(VueApi.modelValueProp) && !componentPropsData.hasOwnProperty(modelProp)) {
            props.push(modelProp);
        }
    }
    props.sort((a, b) => propIdxMap[a] - propIdxMap[b]);

    // initialize properties (before setting up event handlers)
    let cmpClass = component[WjComponentBehavior._behProp].constructor,
        extraProps = cmpClass.extraProps;
    // props.forEach((prop) => {
    //     if ((prop in ctl || extraProps && extraProps.indexOf(prop) > -1) &&
    //             !(ctl[prop] instanceof Event) && !isUndefined(component[prop])) {
    //         //ctl[prop] = component[prop];
    //         component[WjComponentBehavior._behProp]._updateControl(prop, component[prop]);
    //         //component.$watch(prop, _updateControl.bind({ ctl: ctl, prop: prop }));
    //         component.$watch(prop, _updateControl.bind({ cmp: component, prop: prop }));
    //     }
    // });

    function _subscribeEvents(evArr: string[]) {
        evArr.forEach((ev) => {
            // we don't support property change events yet, so no reason to subscribe to parent events
            if (ev !== 'initialized' && ev.indexOf('.') < 0) {
                if (wijmo.isFunction(component[ev])) {
                    ctl[ev].addHandler(component[ev], ctl);
                }
            }
        });
    }
    // hook up non-change event handlers (before assigning properties)
    _subscribeEvents(events);
    // events.forEach((ev) => {
    //     // we don't support property change events yet, so no reason to subscribe to parent events
    //     if (ev !== 'initialized' && ev.indexOf('.') < 0) {
    //         if (isFunction(component[ev])) {
    //             ctl[ev].addHandler(component[ev], ctl);
    //         }
    //     }
    // });

    props.forEach((prop) => {
        if (VueApi.isV3Plus) {
            const v3ModelValueProp = VueApi.modelValueProp;
            if (!wijmo.isUndefined(component[prop])) {
                component[WjComponentBehavior._behProp]._updateControl(prop, component[prop]);
            } else if ((prop === modelProp) && !wijmo.isUndefined(component[v3ModelValueProp])) {
                component[WjComponentBehavior._behProp]._updateControl(prop, component[v3ModelValueProp]);
                component.$watch(v3ModelValueProp, _updateControl.bind({cmp: component, prop: modelProp}));
            }
            component.$watch(prop, _updateControl.bind({cmp: component, prop: prop}));
        } else {
            if (!wijmo.isUndefined(component[prop])) {
                component[WjComponentBehavior._behProp]._updateControl(prop, component[prop]);
            }
            component.$watch(prop, _updateControl.bind({ cmp: component, prop: prop }));
        }
    });

    function _updateControl(newValue) {
        //this.ctl[this.prop] = newValue;
        this.cmp[WjComponentBehavior._behProp]._updateControl(this.prop, newValue);
    }

    // style prop handler
    _updateStyleProp();
    function _updateStyleProp() {
        var ele = component.$el,
            style = {};
        if ('style' in ctl && ele.style.cssText.length) {
            ele.style.cssText.split(';').forEach((prop) => {
                var kv = prop.split(':');
                if (kv.length == 2) {
                    style[kv[0].trim()] = kv[1].trim();
                }
            });

            ctl['style'] = style;
        }
    }

    // hook up event handlers (after assigning properties)
    _subscribeEvents(eventsChg);

    // // hook up event handlers
    // events.forEach((ev) => {
    //     // we don't support property change events yet, so no reason to subscribe to parent events
    //     if (ev !== 'initialized' && ev.indexOf('.') < 0) {
    //         if (isFunction(component[ev])) {
    //             ctl[ev].addHandler(component[ev], ctl);
    //         }
    //     }
    // });

    // Deprecate this. This was never publicly announced, and it doesn't work
    // correctly with child components (assigns control reference to the parent 
    // component's property (in terms of element tree) instead of a "host" component).
    // // set 'control' pseudo-property so it's accessible to parent component
    // if (component.control && component.$parent) {
    //     component.$parent[component.control] = ctl;
    // }

    // subscribe to update events to generate Vue update events
    if (changeEvents) {
        let eventNames = Object.keys(changeEvents);
        for (let evName of eventNames) {
            _subscribeChangeEvents(evName, changeEvents[evName], ctl, component);
        }
    }
    function _subscribeChangeEvents(eventName: string, changeProps: string[], ctl, component) {
        if (changeProps) {
            let ctlEv: wijmo.Event = ctl[eventName];
            if (ctlEv instanceof wijmo.Event) {
                ctlEv.addHandler((s, e) => {
                    for (let chgProp of changeProps) {
                        component.$emit('update:' + chgProp, s[chgProp]);
                        if (VueApi.isV3Plus && (chgProp === modelProp) && wijmo.isUndefined(component[chgProp])) {
                            const v3ModelValueProp = VueApi.modelValueProp;
                            if (!wijmo.isUndefined(component[v3ModelValueProp])) {
                                component.$emit(`update:${v3ModelValueProp}`, s[chgProp]);
                            }
                        }
                    }
                }, ctl);
            }
        }
    }



    // invoke 'initialized' event
    if (wijmo.isFunction(component.initialized)) {
        component.initialized(ctl);
    }

    // done, return a reference to the control
    return ctl;
}

    }
    


    module wijmo.vue2 {
    // Entry file. All real code files should be re-exported from here.
// import { _registerModule } from '@grapecity/wijmo';
// import * as selfModule from './index';
// _registerModule('wijmo.vue2.base', selfModule);



    }
    

    module wijmo.vue2 {
    













    class WjFlexChartTrendLineBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-trend-line';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'sampleCount', 
            'order', 
            'fitType'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.TrendLine; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.TrendLine} class.
     * 
     * The <b>wj-flex-chart-trend-line</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.TrendLine} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartTrendLine = WjFlexChartTrendLineBehavior.register();
    function registerV3WjFlexChartTrendLine(app: any) {
        app.component(WjFlexChartTrendLineBehavior.tag, WjFlexChartTrendLine);
    }


    class WjFlexChartMovingAverageBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-moving-average';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'sampleCount', 
            'period', 
            'type'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.MovingAverage; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.MovingAverage} class.
     * 
     * The <b>wj-flex-chart-moving-average</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.MovingAverage} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartMovingAverage = WjFlexChartMovingAverageBehavior.register();
    function registerV3WjFlexChartMovingAverage(app: any) {
        app.component(WjFlexChartMovingAverageBehavior.tag, WjFlexChartMovingAverage);
    }


    class WjFlexChartYFunctionSeriesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-y-function-series';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'sampleCount', 
            'min', 
            'max', 
            'func'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.YFunctionSeries; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.YFunctionSeries} class.
     * 
     * The <b>wj-flex-chart-y-function-series</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.YFunctionSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartYFunctionSeries = WjFlexChartYFunctionSeriesBehavior.register();
    function registerV3WjFlexChartYFunctionSeries(app: any) {
        app.component(WjFlexChartYFunctionSeriesBehavior.tag, WjFlexChartYFunctionSeries);
    }


    class WjFlexChartParametricFunctionSeriesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-parametric-function-series';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'sampleCount', 
            'min', 
            'max', 
            'func', 
            'xFunc', 
            'yFunc'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.ParametricFunctionSeries; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.ParametricFunctionSeries} class.
     * 
     * The <b>wj-flex-chart-parametric-function-series</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.ParametricFunctionSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartParametricFunctionSeries = WjFlexChartParametricFunctionSeriesBehavior.register();
    function registerV3WjFlexChartParametricFunctionSeries(app: any) {
        app.component(WjFlexChartParametricFunctionSeriesBehavior.tag, WjFlexChartParametricFunctionSeries);
    }


    class WjFlexChartWaterfallBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-waterfall';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'relativeData', 
            'start', 
            'startLabel', 
            'showTotal', 
            'totalLabel', 
            'showIntermediateTotal', 
            'intermediateTotalPositions', 
            'intermediateTotalLabels', 
            'connectorLines', 
            'styles'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.Waterfall; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.Waterfall} class.
     * 
     * The <b>wj-flex-chart-waterfall</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.Waterfall} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartWaterfall = WjFlexChartWaterfallBehavior.register();
    function registerV3WjFlexChartWaterfall(app: any) {
        app.component(WjFlexChartWaterfallBehavior.tag, WjFlexChartWaterfall);
    }


    class WjFlexChartBoxWhiskerBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-box-whisker';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'quartileCalculation', 
            'groupWidth', 
            'gapWidth', 
            'showMeanLine', 
            'meanLineStyle', 
            'showMeanMarker', 
            'meanMarkerStyle', 
            'showInnerPoints', 
            'showOutliers'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.BoxWhisker; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.BoxWhisker} class.
     * 
     * The <b>wj-flex-chart-box-whisker</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.BoxWhisker} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartBoxWhisker = WjFlexChartBoxWhiskerBehavior.register();
    function registerV3WjFlexChartBoxWhisker(app: any) {
        app.component(WjFlexChartBoxWhiskerBehavior.tag, WjFlexChartBoxWhisker);
    }


    class WjFlexChartErrorBarBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-error-bar';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'chartType', 
            'errorBarStyle', 
            'value', 
            'errorAmount', 
            'endStyle', 
            'direction'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.ErrorBar; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.ErrorBar} class.
     * 
     * The <b>wj-flex-chart-error-bar</b> component should be contained in
     * a {@link wijmo.vue2.chart.WjFlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.ErrorBar} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartErrorBar = WjFlexChartErrorBarBehavior.register();
    function registerV3WjFlexChartErrorBar(app: any) {
        app.component(WjFlexChartErrorBarBehavior.tag, WjFlexChartErrorBar);
    }


    class WjFlexChartBreakEvenBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-break-even';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'fixedCost', 
            'variableCost', 
            'salesPrice', 
            'styles'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.analytics.BreakEven; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.analytics.BreakEven} class.
     * 
     * The <b>wj-flex-chart-break-even</b> component should be contained in
     * a {@link wijmo.vue2.chart.WjFlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.analytics.BreakEven} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartBreakEven = WjFlexChartBreakEvenBehavior.register();
    function registerV3WjFlexChartBreakEven(app: any) {
        app.component(WjFlexChartBreakEvenBehavior.tag, WjFlexChartBreakEven);
    }


    export function registerChartAnalytics(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChartTrendLine(app);
            registerV3WjFlexChartMovingAverage(app);
            registerV3WjFlexChartYFunctionSeries(app);
            registerV3WjFlexChartParametricFunctionSeries(app);
            registerV3WjFlexChartWaterfall(app);
            registerV3WjFlexChartBoxWhisker(app);
            registerV3WjFlexChartErrorBar(app);
            registerV3WjFlexChartBreakEven(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexChartAnimationBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-animation';
        static parentInCtor = true;
        static props = [
            'animationMode', 
            'easing', 
            'duration', 
            'axisAnimation'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.animation.ChartAnimation; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.animation.ChartAnimation} class.
     * 
     * The <b>wj-flex-chart-animation</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     * , {@link wijmo.vue2.chart.WjFlexPie}
     * , {@link wijmo.vue2.chart.finance.WjFinancialChart}
     *  or {@link wijmo.vue2.chart.radar.WjFlexRadar}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.animation.ChartAnimation} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnimation = WjFlexChartAnimationBehavior.register();
    function registerV3WjFlexChartAnimation(app: any) {
        app.component(WjFlexChartAnimationBehavior.tag, WjFlexChartAnimation);
    }


    export function registerChartAnimation(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChartAnimation(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexChartAnnotationLayerBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-layer';
        static parentInCtor = true;
        static props = [
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.AnnotationLayer; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.AnnotationLayer} class.
     * 
     * The <b>wj-flex-chart-annotation-layer</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The <b>wj-flex-chart-annotation-layer</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationText}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationEllipse}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationRectangle}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLine}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationPolygon}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationCircle}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationSquare}
     * and {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationImage}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.AnnotationLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationLayer = WjFlexChartAnnotationLayerBehavior.register();
    function registerV3WjFlexChartAnnotationLayer(app: any) {
        app.component(WjFlexChartAnnotationLayerBehavior.tag, WjFlexChartAnnotationLayer);
    }


    class WjFlexChartAnnotationTextBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-text';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Text; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Text} class.
     * 
     * The <b>wj-flex-chart-annotation-text</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-text</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Text} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationText = WjFlexChartAnnotationTextBehavior.register();
    function registerV3WjFlexChartAnnotationText(app: any) {
        app.component(WjFlexChartAnnotationTextBehavior.tag, WjFlexChartAnnotationText);
    }


    class WjFlexChartAnnotationEllipseBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-ellipse';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Ellipse; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Ellipse} class.
     * 
     * The <b>wj-flex-chart-annotation-ellipse</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-ellipse</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Ellipse} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationEllipse = WjFlexChartAnnotationEllipseBehavior.register();
    function registerV3WjFlexChartAnnotationEllipse(app: any) {
        app.component(WjFlexChartAnnotationEllipseBehavior.tag, WjFlexChartAnnotationEllipse);
    }


    class WjFlexChartAnnotationRectangleBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-rectangle';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Rectangle; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Rectangle} class.
     * 
     * The <b>wj-flex-chart-annotation-rectangle</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-rectangle</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Rectangle} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationRectangle = WjFlexChartAnnotationRectangleBehavior.register();
    function registerV3WjFlexChartAnnotationRectangle(app: any) {
        app.component(WjFlexChartAnnotationRectangleBehavior.tag, WjFlexChartAnnotationRectangle);
    }


    class WjFlexChartAnnotationLineBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-line';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Line; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Line} class.
     * 
     * The <b>wj-flex-chart-annotation-line</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-line</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Line} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationLine = WjFlexChartAnnotationLineBehavior.register();
    function registerV3WjFlexChartAnnotationLine(app: any) {
        app.component(WjFlexChartAnnotationLineBehavior.tag, WjFlexChartAnnotationLine);
    }


    class WjFlexChartAnnotationPolygonBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-polygon';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Polygon; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Polygon} class.
     * 
     * The <b>wj-flex-chart-annotation-polygon</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-polygon</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Polygon} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationPolygon = WjFlexChartAnnotationPolygonBehavior.register();
    function registerV3WjFlexChartAnnotationPolygon(app: any) {
        app.component(WjFlexChartAnnotationPolygonBehavior.tag, WjFlexChartAnnotationPolygon);
    }


    class WjFlexChartAnnotationCircleBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-circle';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Circle; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Circle} class.
     * 
     * The <b>wj-flex-chart-annotation-circle</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-circle</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Circle} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationCircle = WjFlexChartAnnotationCircleBehavior.register();
    function registerV3WjFlexChartAnnotationCircle(app: any) {
        app.component(WjFlexChartAnnotationCircleBehavior.tag, WjFlexChartAnnotationCircle);
    }


    class WjFlexChartAnnotationSquareBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-square';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Square; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Square} class.
     * 
     * The <b>wj-flex-chart-annotation-square</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-square</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Square} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationSquare = WjFlexChartAnnotationSquareBehavior.register();
    function registerV3WjFlexChartAnnotationSquare(app: any) {
        app.component(WjFlexChartAnnotationSquareBehavior.tag, WjFlexChartAnnotationSquare);
    }


    class WjFlexChartAnnotationImageBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-annotation-image';
        static parentProp = 'items';
        static siblingId = 'annotation';
        static props = [
            'wjProperty',
            'type', 
            'attachment', 
            'position', 
            'point', 
            'seriesIndex', 
            'pointIndex', 
            'offset', 
            'isVisible', 
            'tooltip', 
            'text', 
            'content', 
            'name', 
            'width', 
            'height', 
            'start', 
            'end', 
            'radius', 
            'length', 
            'href'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.annotation.Image; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.annotation.Image} class.
     * 
     * The <b>wj-flex-chart-annotation-image</b> component should be contained in
     * a {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer} component.
     * 
     * The <b>wj-flex-chart-annotation-image</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartDataPoint} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.annotation.Image} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAnnotationImage = WjFlexChartAnnotationImageBehavior.register();
    function registerV3WjFlexChartAnnotationImage(app: any) {
        app.component(WjFlexChartAnnotationImageBehavior.tag, WjFlexChartAnnotationImage);
    }


    export function registerChartAnnotation(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChartAnnotationLayer(app);
            registerV3WjFlexChartAnnotationText(app);
            registerV3WjFlexChartAnnotationEllipse(app);
            registerV3WjFlexChartAnnotationRectangle(app);
            registerV3WjFlexChartAnnotationLine(app);
            registerV3WjFlexChartAnnotationPolygon(app);
            registerV3WjFlexChartAnnotationCircle(app);
            registerV3WjFlexChartAnnotationSquare(app);
            registerV3WjFlexChartAnnotationImage(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexChartFibonacciBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-fibonacci';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'high', 
            'low', 
            'labelPosition', 
            'levels', 
            'minX', 
            'maxX', 
            'uptrend'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.Fibonacci; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.Fibonacci} class.
     * 
     * The <b>wj-flex-chart-fibonacci</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Fibonacci} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartFibonacci = WjFlexChartFibonacciBehavior.register();
    function registerV3WjFlexChartFibonacci(app: any) {
        app.component(WjFlexChartFibonacciBehavior.tag, WjFlexChartFibonacci);
    }


    class WjFlexChartFibonacciArcsBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-fibonacci-arcs';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'start', 
            'end', 
            'labelPosition', 
            'levels'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.FibonacciArcs; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.FibonacciArcs} class.
     * 
     * The <b>wj-flex-chart-fibonacci-arcs</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciArcs} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartFibonacciArcs = WjFlexChartFibonacciArcsBehavior.register();
    function registerV3WjFlexChartFibonacciArcs(app: any) {
        app.component(WjFlexChartFibonacciArcsBehavior.tag, WjFlexChartFibonacciArcs);
    }


    class WjFlexChartFibonacciFansBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-fibonacci-fans';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'start', 
            'end', 
            'labelPosition', 
            'levels'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.FibonacciFans; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.FibonacciFans} class.
     * 
     * The <b>wj-flex-chart-fibonacci-fans</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciFans} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartFibonacciFans = WjFlexChartFibonacciFansBehavior.register();
    function registerV3WjFlexChartFibonacciFans(app: any) {
        app.component(WjFlexChartFibonacciFansBehavior.tag, WjFlexChartFibonacciFans);
    }


    class WjFlexChartFibonacciTimeZonesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-fibonacci-time-zones';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'startX', 
            'endX', 
            'labelPosition', 
            'levels'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.FibonacciTimeZones; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.FibonacciTimeZones} class.
     * 
     * The <b>wj-flex-chart-fibonacci-time-zones</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.FibonacciTimeZones} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartFibonacciTimeZones = WjFlexChartFibonacciTimeZonesBehavior.register();
    function registerV3WjFlexChartFibonacciTimeZones(app: any) {
        app.component(WjFlexChartFibonacciTimeZonesBehavior.tag, WjFlexChartFibonacciTimeZones);
    }


    class WjFlexChartAtrBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-atr';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.ATR; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.ATR} class.
     * 
     * The <b>wj-flex-chart-atr</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.ATR} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAtr = WjFlexChartAtrBehavior.register();
    function registerV3WjFlexChartAtr(app: any) {
        app.component(WjFlexChartAtrBehavior.tag, WjFlexChartAtr);
    }


    class WjFlexChartCciBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-cci';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period', 
            'constant'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.CCI; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.CCI} class.
     * 
     * The <b>wj-flex-chart-cci</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.CCI} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartCci = WjFlexChartCciBehavior.register();
    function registerV3WjFlexChartCci(app: any) {
        app.component(WjFlexChartCciBehavior.tag, WjFlexChartCci);
    }


    class WjFlexChartRsiBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-rsi';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.RSI; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.RSI} class.
     * 
     * The <b>wj-flex-chart-rsi</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.RSI} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartRsi = WjFlexChartRsiBehavior.register();
    function registerV3WjFlexChartRsi(app: any) {
        app.component(WjFlexChartRsiBehavior.tag, WjFlexChartRsi);
    }


    class WjFlexChartWilliamsRBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-williams-r';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.WilliamsR; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.WilliamsR} class.
     * 
     * The <b>wj-flex-chart-williams-r</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.WilliamsR} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartWilliamsR = WjFlexChartWilliamsRBehavior.register();
    function registerV3WjFlexChartWilliamsR(app: any) {
        app.component(WjFlexChartWilliamsRBehavior.tag, WjFlexChartWilliamsR);
    }


    class WjFlexChartMacdBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-macd';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'fastPeriod', 
            'slowPeriod', 
            'smoothingPeriod', 
            'styles'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.Macd; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.Macd} class.
     * 
     * The <b>wj-flex-chart-macd</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Macd} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartMacd = WjFlexChartMacdBehavior.register();
    function registerV3WjFlexChartMacd(app: any) {
        app.component(WjFlexChartMacdBehavior.tag, WjFlexChartMacd);
    }


    class WjFlexChartMacdHistogramBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-macd-histogram';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'fastPeriod', 
            'slowPeriod', 
            'smoothingPeriod'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.MacdHistogram; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.MacdHistogram} class.
     * 
     * The <b>wj-flex-chart-macd-histogram</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.MacdHistogram} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartMacdHistogram = WjFlexChartMacdHistogramBehavior.register();
    function registerV3WjFlexChartMacdHistogram(app: any) {
        app.component(WjFlexChartMacdHistogramBehavior.tag, WjFlexChartMacdHistogram);
    }


    class WjFlexChartStochasticBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-stochastic';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'dPeriod', 
            'kPeriod', 
            'smoothingPeriod', 
            'styles'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.Stochastic; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.Stochastic} class.
     * 
     * The <b>wj-flex-chart-stochastic</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Stochastic} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartStochastic = WjFlexChartStochasticBehavior.register();
    function registerV3WjFlexChartStochastic(app: any) {
        app.component(WjFlexChartStochasticBehavior.tag, WjFlexChartStochastic);
    }


    class WjFlexChartBollingerBandsBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-bollinger-bands';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period', 
            'multiplier'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.BollingerBands; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.BollingerBands} class.
     * 
     * The <b>wj-flex-chart-bollinger-bands</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.BollingerBands} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartBollingerBands = WjFlexChartBollingerBandsBehavior.register();
    function registerV3WjFlexChartBollingerBands(app: any) {
        app.component(WjFlexChartBollingerBandsBehavior.tag, WjFlexChartBollingerBands);
    }


    class WjFlexChartEnvelopesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-envelopes';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'period', 
            'size', 
            'type'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.analytics.Envelopes; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.analytics.Envelopes} class.
     * 
     * The <b>wj-flex-chart-envelopes</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.analytics.Envelopes} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartEnvelopes = WjFlexChartEnvelopesBehavior.register();
    function registerV3WjFlexChartEnvelopes(app: any) {
        app.component(WjFlexChartEnvelopesBehavior.tag, WjFlexChartEnvelopes);
    }


    export function registerChartFinanceAnalytics(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChartFibonacci(app);
            registerV3WjFlexChartFibonacciArcs(app);
            registerV3WjFlexChartFibonacciFans(app);
            registerV3WjFlexChartFibonacciTimeZones(app);
            registerV3WjFlexChartAtr(app);
            registerV3WjFlexChartCci(app);
            registerV3WjFlexChartRsi(app);
            registerV3WjFlexChartWilliamsR(app);
            registerV3WjFlexChartMacd(app);
            registerV3WjFlexChartMacdHistogram(app);
            registerV3WjFlexChartStochastic(app);
            registerV3WjFlexChartBollingerBands(app);
            registerV3WjFlexChartEnvelopes(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFinancialChartBehavior extends WjComponentBehavior {
        static tag = 'wj-financial-chart';
        static props = [
            'renderEngine', 
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingX', 
            'interpolateNulls', 
            'legendToggle', 
            'symbolSize', 
            'options', 
            'selection', 
            'itemFormatter', 
            'labelContent', 
            'chartType'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'seriesVisibilityChanged'
        ]
        static changeEvents = {
            'selectionChanged': ['selection'],
        }
        static classCtor = function () { return wijmo.chart.finance.FinancialChart; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.FinancialChart} control.
     * 
     * The <b>wj-financial-chart</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.analytics.WjFlexChartTrendLine}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartMovingAverage}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartYFunctionSeries}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartParametricFunctionSeries}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartWaterfall}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartBoxWhisker}
     * , {@link wijmo.vue2.chart.animation.WjFlexChartAnimation}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartFibonacci}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartFibonacciArcs}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartFibonacciFans}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartFibonacciTimeZones}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartAtr}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartCci}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartRsi}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartWilliamsR}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartMacd}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartMacdHistogram}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartStochastic}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartBollingerBands}
     * , {@link wijmo.vue2.chart.finance.analytics.WjFlexChartEnvelopes}
     * , {@link wijmo.vue2.chart.finance.WjFinancialChartSeries}
     * , {@link wijmo.vue2.chart.interaction.WjFlexChartRangeSelector}
     * , {@link wijmo.vue2.chart.interaction.WjFlexChartGestures}
     * , {@link wijmo.vue2.chart.WjFlexChartAxis}
     * , {@link wijmo.vue2.chart.WjFlexChartLegend}
     * , {@link wijmo.vue2.chart.WjFlexChartLineMarker}
     * and {@link wijmo.vue2.chart.WjFlexChartPlotArea}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.FinancialChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFinancialChart = WjFinancialChartBehavior.register();
    function registerV3WjFinancialChart(app: any) {
        app.component(WjFinancialChartBehavior.tag, WjFinancialChart);
    }


    class WjFinancialChartSeriesBehavior extends WjComponentBehavior {
        static tag = 'wj-financial-chart-series';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'chartType'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.finance.FinancialSeries; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.finance.FinancialSeries} class.
     * 
     * The <b>wj-financial-chart-series</b> component should be contained in
     * a {@link wijmo.vue2.chart.finance.WjFinancialChart} component.
     * 
     * The <b>wj-financial-chart-series</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.finance.FinancialSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFinancialChartSeries = WjFinancialChartSeriesBehavior.register();
    function registerV3WjFinancialChartSeries(app: any) {
        app.component(WjFinancialChartSeriesBehavior.tag, WjFinancialChartSeries);
    }


    export function registerChartFinance(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFinancialChart(app);
            registerV3WjFinancialChartSeries(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjSunburstBehavior extends WjComponentBehavior {
        static tag = 'wj-sunburst';
        static props = [
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingName', 
            'innerRadius', 
            'isAnimated', 
            'offset', 
            'reversed', 
            'startAngle', 
            'selectedIndex', 
            'selectedItemPosition', 
            'selectedItemOffset', 
            'itemFormatter', 
            'labelContent', 
            'childItemsPath'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'selectionChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged'
        ]
        static classCtor = function () { return wijmo.chart.hierarchical.Sunburst; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.hierarchical.Sunburst} control.
     * 
     * The <b>wj-sunburst</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartLegend} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.hierarchical.Sunburst} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjSunburst = WjSunburstBehavior.register();
    function registerV3WjSunburst(app: any) {
        app.component(WjSunburstBehavior.tag, WjSunburst);
    }


    class WjTreeMapBehavior extends WjComponentBehavior {
        static tag = 'wj-tree-map';
        static props = [
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingName', 
            'maxDepth', 
            'type', 
            'labelContent', 
            'childItemsPath'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'selectionChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged'
        ]
        static classCtor = function () { return wijmo.chart.hierarchical.TreeMap; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.hierarchical.TreeMap} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.hierarchical.TreeMap} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTreeMap = WjTreeMapBehavior.register();
    function registerV3WjTreeMap(app: any) {
        app.component(WjTreeMapBehavior.tag, WjTreeMap);
    }


    export function registerChartHierarchical(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjSunburst(app);
            registerV3WjTreeMap(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexChartRangeSelectorBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-range-selector';
        static parentInCtor = true;
        static props = [
            'isVisible', 
            'min', 
            'max', 
            'orientation', 
            'seamless', 
            'minScale', 
            'maxScale'
        ]
        static events = [
            'initialized', 
            'rangeChanged'
        ]
        static classCtor = function () { return wijmo.chart.interaction.RangeSelector; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.interaction.RangeSelector} class.
     * 
     * The <b>wj-flex-chart-range-selector</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.interaction.RangeSelector} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartRangeSelector = WjFlexChartRangeSelectorBehavior.register();
    function registerV3WjFlexChartRangeSelector(app: any) {
        app.component(WjFlexChartRangeSelectorBehavior.tag, WjFlexChartRangeSelector);
    }


    class WjFlexChartGesturesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-gestures';
        static parentInCtor = true;
        static props = [
            'mouseAction', 
            'interactiveAxes', 
            'enable', 
            'scaleX', 
            'scaleY', 
            'posX', 
            'posY'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.interaction.ChartGestures; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.interaction.ChartGestures} class.
     * 
     * The <b>wj-flex-chart-gestures</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.interaction.ChartGestures} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartGestures = WjFlexChartGesturesBehavior.register();
    function registerV3WjFlexChartGestures(app: any) {
        app.component(WjFlexChartGesturesBehavior.tag, WjFlexChartGestures);
    }


    export function registerChartInteraction(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChartRangeSelector(app);
            registerV3WjFlexChartGestures(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexRadarBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-radar';
        static props = [
            'renderEngine', 
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingX', 
            'interpolateNulls', 
            'legendToggle', 
            'symbolSize', 
            'options', 
            'selection', 
            'itemFormatter', 
            'labelContent', 
            'chartType', 
            'startAngle', 
            'totalAngle', 
            'reversed', 
            'stacking'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'seriesVisibilityChanged'
        ]
        static changeEvents = {
            'selectionChanged': ['selection'],
        }
        static classCtor = function () { return wijmo.chart.radar.FlexRadar; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.radar.FlexRadar} control.
     * 
     * The <b>wj-flex-radar</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.animation.WjFlexChartAnimation}
     * , {@link wijmo.vue2.chart.radar.WjFlexRadarAxis}
     * , {@link wijmo.vue2.chart.radar.WjFlexRadarSeries}
     * and {@link wijmo.vue2.chart.WjFlexChartLegend}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexRadar = WjFlexRadarBehavior.register();
    function registerV3WjFlexRadar(app: any) {
        app.component(WjFlexRadarBehavior.tag, WjFlexRadar);
    }


    class WjFlexRadarAxisBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-radar-axis';
        static parentProp = 'axes';
        static props = [
            'wjProperty',
            'axisLine', 
            'format', 
            'labels', 
            'majorGrid', 
            'majorTickMarks', 
            'majorUnit', 
            'max', 
            'min', 
            'position', 
            'reversed', 
            'title', 
            'labelAngle', 
            'minorGrid', 
            'minorTickMarks', 
            'minorUnit', 
            'origin', 
            'logBase', 
            'plotArea', 
            'labelAlign', 
            'name', 
            'overlappingLabels', 
            'labelPadding', 
            'itemFormatter', 
            'itemsSource', 
            'binding'
        ]
        static events = [
            'initialized', 
            'rangeChanged'
        ]
        static classCtor = function () { return wijmo.chart.radar.FlexRadarAxis; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.radar.FlexRadarAxis} class.
     * 
     * The <b>wj-flex-radar-axis</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.radar.WjFlexRadar}
     *  or {@link wijmo.vue2.chart.radar.WjFlexRadarSeries}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadarAxis} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexRadarAxis = WjFlexRadarAxisBehavior.register();
    function registerV3WjFlexRadarAxis(app: any) {
        app.component(WjFlexRadarAxisBehavior.tag, WjFlexRadarAxis);
    }


    class WjFlexRadarSeriesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-radar-series';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'chartType'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.radar.FlexRadarSeries; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.radar.FlexRadarSeries} class.
     * 
     * The <b>wj-flex-radar-series</b> component should be contained in
     * a {@link wijmo.vue2.chart.radar.WjFlexRadar} component.
     * 
     * The <b>wj-flex-radar-series</b> component may contain
     * a {@link wijmo.vue2.chart.radar.WjFlexRadarAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.radar.FlexRadarSeries} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexRadarSeries = WjFlexRadarSeriesBehavior.register();
    function registerV3WjFlexRadarSeries(app: any) {
        app.component(WjFlexRadarSeriesBehavior.tag, WjFlexRadarSeries);
    }


    export function registerChartRadar(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexRadar(app);
            registerV3WjFlexRadarAxis(app);
            registerV3WjFlexRadarSeries(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexChartBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart';
        static props = [
            'renderEngine', 
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingX', 
            'interpolateNulls', 
            'legendToggle', 
            'symbolSize', 
            'options', 
            'selection', 
            'itemFormatter', 
            'labelContent', 
            'chartType', 
            'rotated', 
            'stacking'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'seriesVisibilityChanged'
        ]
        static changeEvents = {
            'selectionChanged': ['selection'],
        }
        static classCtor = function () { return wijmo.chart.FlexChart; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.FlexChart} control.
     * 
     * The <b>wj-flex-chart</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.analytics.WjFlexChartTrendLine}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartMovingAverage}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartYFunctionSeries}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartParametricFunctionSeries}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartWaterfall}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartBoxWhisker}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartErrorBar}
     * , {@link wijmo.vue2.chart.analytics.WjFlexChartBreakEven}
     * , {@link wijmo.vue2.chart.animation.WjFlexChartAnimation}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLayer}
     * , {@link wijmo.vue2.chart.interaction.WjFlexChartRangeSelector}
     * , {@link wijmo.vue2.chart.interaction.WjFlexChartGestures}
     * , {@link wijmo.vue2.chart.WjFlexChartAxis}
     * , {@link wijmo.vue2.chart.WjFlexChartLegend}
     * , {@link wijmo.vue2.chart.WjFlexChartDataLabel}
     * , {@link wijmo.vue2.chart.WjFlexChartSeries}
     * , {@link wijmo.vue2.chart.WjFlexChartLineMarker}
     * and {@link wijmo.vue2.chart.WjFlexChartPlotArea}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.FlexChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.chart.FlexChart} control using Vue markup:
     *
     * <pre>&lt;wj-flex-chart
     *     :items-source="data"
     *     binding-x="country"
     *     :header="props.header"
     *     :footer="props.footer"&gt;
     *
     *     &lt;wj-flex-chart-legend :position="props.legendPosition"&gt;
     *     &lt;/wj-flex-chart-legend&gt;
     *     &lt;wj-flex-chart-axis wj-property="axisX" :title="props.titleX"&gt;
     *     &lt;/wj-flex-chart-axis&gt;
     *     &lt;wj-flex-chart-axis wj-property="axisY" :title="props.titleY"&gt;
     *     &lt;/wj-flex-chart-axis&gt;
     *
     *     &lt;wj-flex-chart-series name="Sales" binding="sales"&gt;
     *     &lt;/wj-flex-chart-series&gt;
     *     &lt;wj-flex-chart-series name="Expenses" binding="expenses"&gt;
     *     &lt;/wj-flex-chart-series&gt;
     *     &lt;wj-flex-chart-series name="Downloads" binding="downloads"&gt;
     *     &lt;/wj-flex-chart-series&gt;
     * &lt;/wj-flex-chart&gt;</pre>
     *
     * The code sets the <b>itemsSource</b> property to a collection that contains the chart
     * data and the <b>bindingX</b> property to the data property that contains the chart X values.
     * It also sets the chart's <b>header</b> and <b>footer</b> properties to define titles to
     * show above and below the chart.
     *
     * The <b>wj-flex-chart-legend</b> and <b>wj-flex-chart-axis</b> components are used to
     * customize the chart's legend and axes.
     *
     * Finally, three <b>wj-flex-chart-series</b> components are used to specify the data
     * properties to be shown on the chart.
     */
    export var WjFlexChart = WjFlexChartBehavior.register();
    function registerV3WjFlexChart(app: any) {
        app.component(WjFlexChartBehavior.tag, WjFlexChart);
    }


    class WjFlexPieBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-pie';
        static props = [
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'bindingName', 
            'innerRadius', 
            'isAnimated', 
            'offset', 
            'reversed', 
            'startAngle', 
            'selectedIndex', 
            'selectedItemPosition', 
            'selectedItemOffset', 
            'itemFormatter', 
            'labelContent', 
            'titles', 
            'chartsPerLine'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'selectionChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged'
        ]
        static classCtor = function () { return wijmo.chart.FlexPie; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                case 'labelContent':
                    this.control.dataLabel.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.FlexPie} control.
     * 
     * The <b>wj-flex-pie</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.animation.WjFlexChartAnimation}
     * , {@link wijmo.vue2.chart.WjFlexChartLegend}
     * and {@link wijmo.vue2.chart.WjFlexPieDataLabel}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.FlexPie} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexPie = WjFlexPieBehavior.register();
    function registerV3WjFlexPie(app: any) {
        app.component(WjFlexPieBehavior.tag, WjFlexPie);
    }


    class WjFlexChartAxisBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-axis';
        static parentProp = 'axes';
        static props = [
            'wjProperty',
            'axisLine', 
            'format', 
            'labels', 
            'majorGrid', 
            'majorTickMarks', 
            'majorUnit', 
            'max', 
            'min', 
            'position', 
            'reversed', 
            'title', 
            'labelAngle', 
            'minorGrid', 
            'minorTickMarks', 
            'minorUnit', 
            'origin', 
            'logBase', 
            'plotArea', 
            'labelAlign', 
            'name', 
            'overlappingLabels', 
            'labelPadding', 
            'itemFormatter', 
            'itemsSource', 
            'binding'
        ]
        static events = [
            'initialized', 
            'rangeChanged'
        ]
        static classCtor = function () { return wijmo.chart.Axis; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.Axis} class.
     * 
     * The <b>wj-flex-chart-axis</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     * , {@link wijmo.vue2.chart.WjFlexChartSeries}
     * , {@link wijmo.vue2.chart.finance.WjFinancialChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChartSeries}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Axis} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartAxis = WjFlexChartAxisBehavior.register();
    function registerV3WjFlexChartAxis(app: any) {
        app.component(WjFlexChartAxisBehavior.tag, WjFlexChartAxis);
    }


    class WjFlexChartLegendBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-legend';
        static parentProp = 'legend';
        static parentInCtor = true;
        static props = [
            'wjProperty',
            'orientation', 
            'position', 
            'title', 
            'titleAlign', 
            'maxSize'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.Legend; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.Legend} class.
     * 
     * The <b>wj-flex-chart-legend</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     * , {@link wijmo.vue2.chart.WjFlexPie}
     * , {@link wijmo.vue2.chart.finance.WjFinancialChart}
     * , {@link wijmo.vue2.chart.radar.WjFlexRadar}
     * , {@link wijmo.vue2.chart.hierarchical.WjSunburst}
     *  or {@link wijmo.vue2.chart.map.WjFlexMap}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Legend} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartLegend = WjFlexChartLegendBehavior.register();
    function registerV3WjFlexChartLegend(app: any) {
        app.component(WjFlexChartLegendBehavior.tag, WjFlexChartLegend);
    }


    class WjFlexChartDataLabelBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-data-label';
        static parentProp = 'dataLabel';
        static props = [
            'wjProperty',
            'content', 
            'border', 
            'offset', 
            'connectingLine', 
            'position'
        ]
        static events = [
            'initialized', 
            'rendering'
        ]
        static classCtor = function () { return wijmo.chart.DataLabel; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.DataLabel} class.
     * 
     * The <b>wj-flex-chart-data-label</b> component should be contained in
     * a {@link wijmo.vue2.chart.WjFlexChart} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.DataLabel} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartDataLabel = WjFlexChartDataLabelBehavior.register();
    function registerV3WjFlexChartDataLabel(app: any) {
        app.component(WjFlexChartDataLabelBehavior.tag, WjFlexChartDataLabel);
    }


    class WjFlexPieDataLabelBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-pie-data-label';
        static parentProp = 'dataLabel';
        static props = [
            'wjProperty',
            'content', 
            'border', 
            'offset', 
            'connectingLine', 
            'position'
        ]
        static events = [
            'initialized', 
            'rendering'
        ]
        static classCtor = function () { return wijmo.chart.PieDataLabel; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.PieDataLabel} class.
     * 
     * The <b>wj-flex-pie-data-label</b> component should be contained in
     * a {@link wijmo.vue2.chart.WjFlexPie} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.PieDataLabel} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexPieDataLabel = WjFlexPieDataLabelBehavior.register();
    function registerV3WjFlexPieDataLabel(app: any) {
        app.component(WjFlexPieDataLabelBehavior.tag, WjFlexPieDataLabel);
    }


    class WjFlexChartSeriesBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-series';
        static parentProp = 'series';
        static siblingId = 'series';
        static props = [
            'wjProperty',
            'axisX', 
            'axisY', 
            'binding', 
            'bindingX', 
            'cssClass', 
            'name', 
            'altStyle', 
            'symbolMarker', 
            'symbolSize', 
            'symbolStyle', 
            'visibility', 
            'itemsSource', 
            'interpolateNulls', 
            'tooltipContent', 
            'itemFormatter', 
            'chartType'
        ]
        static events = [
            'initialized', 
            'rendering', 
            'rendered'
        ]
        static changeEvents = {
            'chart.seriesVisibilityChanged': ['visibility'],
        }
        static classCtor = function () { return wijmo.chart.Series; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.Series} class.
     * 
     * The <b>wj-flex-chart-series</b> component should be contained in
     * a {@link wijmo.vue2.chart.WjFlexChart} component.
     * 
     * The <b>wj-flex-chart-series</b> component may contain
     * a {@link wijmo.vue2.chart.WjFlexChartAxis} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.Series} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartSeries = WjFlexChartSeriesBehavior.register();
    function registerV3WjFlexChartSeries(app: any) {
        app.component(WjFlexChartSeriesBehavior.tag, WjFlexChartSeries);
    }


    class WjFlexChartLineMarkerBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-line-marker';
        static parentInCtor = true;
        static props = [
            'isVisible', 
            'seriesIndex', 
            'horizontalPosition', 
            'content', 
            'verticalPosition', 
            'alignment', 
            'lines', 
            'interaction', 
            'dragLines', 
            'dragThreshold', 
            'dragContent'
        ]
        static events = [
            'initialized', 
            'positionChanged'
        ]
        static classCtor = function () { return wijmo.chart.LineMarker; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.LineMarker} class.
     * 
     * The <b>wj-flex-chart-line-marker</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.LineMarker} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartLineMarker = WjFlexChartLineMarkerBehavior.register();
    function registerV3WjFlexChartLineMarker(app: any) {
        app.component(WjFlexChartLineMarkerBehavior.tag, WjFlexChartLineMarker);
    }


    class WjFlexChartDataPointBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-data-point';
        static parentProp = '';
        static props = [
            'wjProperty',
            'x', 
            'y'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.DataPoint; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.DataPoint} class.
     * 
     * The <b>wj-flex-chart-data-point</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationText}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationEllipse}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationRectangle}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationLine}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationPolygon}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationCircle}
     * , {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationSquare}
     *  or {@link wijmo.vue2.chart.annotation.WjFlexChartAnnotationImage}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.DataPoint} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartDataPoint = WjFlexChartDataPointBehavior.register();
    function registerV3WjFlexChartDataPoint(app: any) {
        app.component(WjFlexChartDataPointBehavior.tag, WjFlexChartDataPoint);
    }


    class WjFlexChartPlotAreaBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-chart-plot-area';
        static parentProp = 'plotAreas';
        static props = [
            'wjProperty',
            'column', 
            'height', 
            'name', 
            'row', 
            'width'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.PlotArea; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.PlotArea} class.
     * 
     * The <b>wj-flex-chart-plot-area</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.WjFlexChart}
     *  or {@link wijmo.vue2.chart.finance.WjFinancialChart}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.PlotArea} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexChartPlotArea = WjFlexChartPlotAreaBehavior.register();
    function registerV3WjFlexChartPlotArea(app: any) {
        app.component(WjFlexChartPlotAreaBehavior.tag, WjFlexChartPlotArea);
    }


    export function registerChart(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexChart(app);
            registerV3WjFlexPie(app);
            registerV3WjFlexChartAxis(app);
            registerV3WjFlexChartLegend(app);
            registerV3WjFlexChartDataLabel(app);
            registerV3WjFlexPieDataLabel(app);
            registerV3WjFlexChartSeries(app);
            registerV3WjFlexChartLineMarker(app);
            registerV3WjFlexChartDataPoint(app);
            registerV3WjFlexChartPlotArea(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













     const WjIncludeDefinition = {
         render: function (createElement: any) {
             return VueApi.isV3Plus
                 ? VueApi.h('div')
                 : createElement('div');
         },
         props: ['src'],
         mounted: function () {
             wijmo.httpRequest(this.src, {
                 success: (xhr) => {
                     this.$el.innerHTML = xhr.response;
                 }
             });
         }
     };
     const WjIncludeTag = 'wj-include';
    /**
     * Vue component that includes a given HTML fragment into the document.
     *
     * The <b>wj-include</b> component takes a <b>src</b> attribute that
     * specifies a file to load and include into the document. For example:
     *
     * <pre>&lt;wj-popup control="modalDialog" :modal="true" :hide-trigger="None"&gt;
     *   &lt;wj-include src="includes/dialog.htm"&gt;&lt;/wj-include&gt;
     * &lt;/wj-popup&gt;</pre>
     */
     export var WjInclude = VueApi.isV3Plus
         ? WjIncludeDefinition
         : VueApi.component(WjIncludeTag, WjIncludeDefinition);
     function registerV3WjInclude(app: any) {
         app.component(WjIncludeTag, WjInclude);
     }

    export var wjFormat = (value, format) => wijmo.Globalize.format(value, format);
    /**
     * Vue filter that applies globalized formatting to dates and numbers.
     *
     * For example, the code below uses the <b>wj-format</b> filter to format
     * a number as a currency value and a date as a short date using the
     * current Wijmo culture:
     *
     * <pre>&lt;p&gt;value: {&#8203;{ theAmount | wj-format('c') }}&lt;/p&gt;
     * &lt;p&gt;date: {&#8203;{ theDate | wj-format('d') }}&lt;/p&gt;</pre>
     */
    export var WjFormat = VueApi.isV3Plus
        ? null
        : VueApi.filter('wj-format', function (value, format) {
            return wjFormat(value, format);
        });
    function registerV3WjFormat(app: any) {
        // nothing to register
    }


    let tooltip: wijmo.Tooltip;
    const tooltipDirectiveDefinition = (el, binding) => {
        if (!tooltip) {
            tooltip = new wijmo.Tooltip();
        }
        if (binding.oldValue !== binding.value) {
            const value = binding.value;
            if (wijmo.isObject(value)) {
                tooltip.setTooltip(el, value.tooltip, <wijmo.PopupPosition>wijmo.asEnum(value.position, wijmo.PopupPosition));
            } else {
                tooltip.setTooltip(el, value);
            }
        }
    };
    const WjTooltipTag = 'wjTooltip';
    /**
    * Vue directive for the {@link Tooltip} class.
    *
    * Use the **wjTooltip** directive to add tooltips to elements on the page. 
    * The wjTooltip directive supports HTML content, smart positioning, and touch.
    *
    * The wjTooltip directive is specified as a **v-wjTooltip** attribute added to the 
    * element that the tooltip applies to. The parameter value is the tooltip
    * text or the id of an element that contains the text.
    * 
    * You can also specify the tooltip with additional properties. In this case
    * the directive value is an object with property values. The possible properties
    * are:
    * - **tooltip** - tooltip text or element id.
    * - **position** - represents the {@link Tooltip.position} property.
    *
    * For example:
    * ```html
    * <p v-wjTooltip="'Just a string'">
    *     Paragraph with a string tooltip.
    * </p>
    * <p v-wjTooltip="{tooltip: '#fineprint', position: 'Left'}>
    *     Paragraph with a tooltip defined as an element.
    * </p>
    * ...
    * <div id="fineprint" style="display:none">
    *   <h3>Important Note</h3>
    *   <p>
    *     Data for the current quarter is estimated 
    *     by pro-rating etc.</p>
    * </div>
    * ```
    */
    export var WjTooltip = VueApi.isV3Plus
        ? tooltipDirectiveDefinition
        : VueApi.directive(WjTooltipTag, tooltipDirectiveDefinition);
    function registerV3WjTooltip(app: any) {
        app.directive(WjTooltipTag, WjTooltip);
    }

    export function registerCore(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjInclude(app);
            registerV3WjFormat(app);
            registerV3WjTooltip(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjLinearGaugeBehavior extends WjComponentBehavior {
        static tag = 'wj-linear-gauge';
        static props = [
            'isDisabled', 
            'value', 
            'min', 
            'max', 
            'origin', 
            'isReadOnly', 
            'handleWheel', 
            'step', 
            'format', 
            'thickness', 
            'hasShadow', 
            'isAnimated', 
            'showText', 
            'showTicks', 
            'showTickText', 
            'showRanges', 
            'stackRanges', 
            'thumbSize', 
            'tickSpacing', 
            'getText', 
            'direction'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.gauge.LinearGauge; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.gauge.LinearGauge} control.
     * 
     * The <b>wj-linear-gauge</b> component may contain
     * a {@link wijmo.vue2.gauge.WjRange} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.LinearGauge} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.gauge.LinearGauge} control using Vue markup:
     *
     * <pre>&lt;wj-linear-gauge
     *     :min="0" :max="1000" :step="50" :is-read-only="false"
     *     format="c0" :thumb-size="20"
     *     :show-ranges="false"
     *     :value="sales"
     *     :value-changed="salesChanged"&gt;
     *     &lt;wj-range wj-property="face" :thickness="0.5"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range wj-property="pointer" :thickness="0.5"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="0" :max="333" color="red"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="333" :max="666" color="gold"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="666" :max="1000" color="green"&gt;
     *     &lt;/wj-range&gt;
     * &lt;/wj-linear-gauge&gt;</pre>
     *
     * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
     * to define the range of the gauge and to allow users to edit its value.
     * Next, it binds the gauge's <b>value</b> property to a <b>sales</b> variable
     * in the controller.
     *
     * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
     * properties to define the appearance of the gauge. Finally, the markup sets
     * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
     * that will control the color of the <b>value</b> range depending on the gauge's
     * current value.
     */
    export var WjLinearGauge = WjLinearGaugeBehavior.register();
    function registerV3WjLinearGauge(app: any) {
        app.component(WjLinearGaugeBehavior.tag, WjLinearGauge);
    }


    class WjBulletGraphBehavior extends WjComponentBehavior {
        static tag = 'wj-bullet-graph';
        static props = [
            'isDisabled', 
            'value', 
            'min', 
            'max', 
            'origin', 
            'isReadOnly', 
            'handleWheel', 
            'step', 
            'format', 
            'thickness', 
            'hasShadow', 
            'isAnimated', 
            'showText', 
            'showTicks', 
            'showTickText', 
            'showRanges', 
            'stackRanges', 
            'thumbSize', 
            'tickSpacing', 
            'getText', 
            'direction', 
            'target', 
            'good', 
            'bad'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.gauge.BulletGraph; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.gauge.BulletGraph} control.
     * 
     * The <b>wj-bullet-graph</b> component may contain
     * a {@link wijmo.vue2.gauge.WjRange} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.BulletGraph} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBulletGraph = WjBulletGraphBehavior.register();
    function registerV3WjBulletGraph(app: any) {
        app.component(WjBulletGraphBehavior.tag, WjBulletGraph);
    }


    class WjRadialGaugeBehavior extends WjComponentBehavior {
        static tag = 'wj-radial-gauge';
        static props = [
            'isDisabled', 
            'value', 
            'min', 
            'max', 
            'origin', 
            'isReadOnly', 
            'handleWheel', 
            'step', 
            'format', 
            'thickness', 
            'hasShadow', 
            'isAnimated', 
            'showText', 
            'showTicks', 
            'showTickText', 
            'showRanges', 
            'stackRanges', 
            'thumbSize', 
            'tickSpacing', 
            'getText', 
            'autoScale', 
            'startAngle', 
            'sweepAngle', 
            'needleShape', 
            'needleLength', 
            'needleElement'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.gauge.RadialGauge; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.gauge.RadialGauge} control.
     * 
     * The <b>wj-radial-gauge</b> component may contain
     * a {@link wijmo.vue2.gauge.WjRange} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.RadialGauge} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.gauge.RadialGauge} control using Vue markup:
     *
     * <pre>&lt;wj-radial-gauge
     *     :min="0" :max="1000" :step="50" :is-read-only="false"
     *     format="c0" :thumb-size="12" :show-text="Value"
     *     :show-ranges="false"
     *     :value="sales"
     *     :value-changed="salesChanged"&gt;
     *     &lt;wj-range wj-property="face" :thickness="0.5"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range wj-property="pointer" :thickness="0.5"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="0" :max="333" color="red"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="333" :max="666" color="gold"&gt;
     *     &lt;/wj-range&gt;
     *     &lt;wj-range :min="666" :max="1000" color="green"&gt;
     *     &lt;/wj-range&gt;
     * &lt;/wj-radial-gauge&gt;</pre>
     *
     * The code <b>min</b>, <b>max</b>, <b>step</b>, and <b>isReadOnly</b> properties
     * to define the range of the gauge and to allow users to edit its value.
     * Next, it binds the gauge's <b>value</b> property to a <b>sales</b> variable
     * in the controller.
     *
     * Then it sets the <b>format</b>, <b>thumbSize</b>, and <b>showRanges</b>
     * properties to define the appearance of the gauge. Finally, the markup sets
     * the thickness of the <b>face</b> and <b>pointer</b> ranges, and extra ranges
     * that will control the color of the <b>value</b> range depending on the gauge's
     * current value.
     */
    export var WjRadialGauge = WjRadialGaugeBehavior.register();
    function registerV3WjRadialGauge(app: any) {
        app.component(WjRadialGaugeBehavior.tag, WjRadialGauge);
    }


    class WjRangeBehavior extends WjComponentBehavior {
        static tag = 'wj-range';
        static parentProp = 'ranges';
        static props = [
            'wjProperty',
            'color', 
            'min', 
            'max', 
            'name', 
            'thickness'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.gauge.Range; };                
    }
    /**
     * Vue component for the {@link wijmo.gauge.Range} class.
     * 
     * The <b>wj-range</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.gauge.WjLinearGauge}
     * , {@link wijmo.vue2.gauge.WjBulletGraph}
     *  or {@link wijmo.vue2.gauge.WjRadialGauge}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.gauge.Range} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjRange = WjRangeBehavior.register();
    function registerV3WjRange(app: any) {
        app.component(WjRangeBehavior.tag, WjRange);
    }


    export function registerGauge(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjLinearGauge(app);
            registerV3WjBulletGraph(app);
            registerV3WjRadialGauge(app);
            registerV3WjRange(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    














    class WjFlexGridDetailBehavior extends WjComponentBehavior {     
        
        static tag = 'wj-flex-grid-detail';
        static parentInCtor = true;
        static props = [
            'maxHeight', 
            'keyActionEnter', 
            'detailVisibilityMode', 
            'rowHasDetail', 
            'isAnimated'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.grid.detail.FlexGridDetailProvider; };     
        static render(createElement): any {
            return VueApi.isV3Plus
                ? VueApi.h('div')
                : createElement('div');
        }

        private readonly _openedComponents = [];
		

        protected _createControl(): any {
            let ctrl = <wijmo.grid.detail.FlexGridDetailProvider>super._createControl();

            ctrl.createDetailCell = (row: wijmo.grid.Row) => {
                if (VueApi.isV3Plus) {
                    const h = VueApi.h;
                    const slotFn = this.component.$slots.default;
                    const context = {
                        row: row,
                        item: row.dataItem,
                        provider: this.control,
                    };
                    const vnode = h({
                        parent: this.component,
                        render: function () {
                            return h('div', {}, slotFn && slotFn(context));
                        },
                    });
                    let container = document.createElement('div');
                    VueApi.render(vnode, container);
                    this._openedComponents.push({
                        '$destroy': () => { // emulate destroy for future use
                            VueApi.render(null, container);
                        }
                    });
                    return vnode.el;
                } else {
                    // We need a view component that operates as a template root, in order
                    // to get its HTMLElement which will be returned by createDetailCell.
                    // childVN will be assigned with a result of the slot render function,
                    // which will be a child of this template root component.
                    var TemplRootCmp = VueApi.extend({
                        data: function () {
                            return {
                                childVN: null
                            }
                        },
                        render: function (createElement) {
                            return createElement('div', [this.childVN]);
                        }
                    })
                    // create root component
                    let ret = new TemplRootCmp({parent: this.component});
                    // assign slot rendering with scope properties
                    ret.childVN = this.component.$scopedSlots.default({
                        row: row,
                        item: row.dataItem,
                        provider: this.control,
                    });
                    // Mount as detached component
                    ret.$mount();
                    // Store opened component to dispose it when it'll be closed
                    this._openedComponents.push(ret);
                    // return component's html element
                    return ret.$el;
                }
            }

            ctrl.disposeDetailCell = (row: wijmo.grid.detail.DetailRow) => {
                let detailEl = row.detail,
                    openedCmps = this._openedComponents;
                if (detailEl) {
                    // find and destroy the template root component
                    for (let i = 0; i < openedCmps.length; i++) {
                        if (detailEl === openedCmps[i].$el) {
                            openedCmps[i].$destroy();
                            openedCmps.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            return ctrl;
        }                
    }
    /**
     * Vue component for the {@link wijmo.grid.detail.FlexGridDetailProvider} class.
     * 
     * The <b>wj-flex-grid-detail</b> component should be contained in
     * a {@link wijmo.vue2.grid.WjFlexGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.detail.FlexGridDetailProvider} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexGridDetail = WjFlexGridDetailBehavior.register();
    function registerV3WjFlexGridDetail(app: any) {
        app.component(WjFlexGridDetailBehavior.tag, WjFlexGridDetail);
    }


    export function registerGridDetail(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexGridDetail(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexGridFilterBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-grid-filter';
        static parentInCtor = true;
        static props = [
            'showFilterIcons', 
            'showSortButtons', 
            'defaultFilterType', 
            'filterColumns'
        ]
        static events = [
            'initialized', 
            'editingFilter', 
            'filterChanging', 
            'filterChanged', 
            'filterApplied'
        ]
        static classCtor = function () { return wijmo.grid.filter.FlexGridFilter; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.filter.FlexGridFilter} class.
     * 
     * The <b>wj-flex-grid-filter</b> component should be contained in
     * a {@link wijmo.vue2.grid.WjFlexGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.filter.FlexGridFilter} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.grid.filter.FlexGridFilter} control with a filter using Vue markup:
     *
     * <pre>&lt;wj-flex-grid
     *   :items-source="data"&gt;
     *   &lt;wj-flex-grid-filter&gt;&lt;/wj-flex-grid-filter&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     */
    export var WjFlexGridFilter = WjFlexGridFilterBehavior.register();
    function registerV3WjFlexGridFilter(app: any) {
        app.component(WjFlexGridFilterBehavior.tag, WjFlexGridFilter);
    }


    export function registerGridFilter(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexGridFilter(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjGroupPanelBehavior extends WjComponentBehavior {
        static tag = 'wj-group-panel';
        static props = [
            'isDisabled', 
            'hideGroupedColumns', 
            'showDragGlyphs', 
            'maxGroups', 
            'placeholder', 
            'filter', 
            'groupDescriptionCreator', 
            'grid'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static classCtor = function () { return wijmo.grid.grouppanel.GroupPanel; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.grouppanel.GroupPanel} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.grouppanel.GroupPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and connect a
     * {@link wijmo.grid.grouppanel.GroupPanel} and a {@link wijmo.grid.FlexGrid}
     * in Vue:
     *
     * <pre>&lt;wj-group-panel
     *   id="thePanel"
     *   placeholder="Drag columns here to create Groups"&gt;
     * &lt;/wj-group-panel&gt;
     * &lt;wj-flex-grid
     *   id="theGrid"
     *   :items-source="data"&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * <pre>var app = new Vue({
     *   el: '#app',
     *   // connect group panel and grid
     *   mounted: function () {
     *     var panel = wijmo.Control.getControl(document.getElementById('thePanel'));
     *     var grid = wijmo.Control.getControl(document.getElementById('theGrid'));
     *     panel.grid = grid;
     *   }
     * });</pre>
     */
    export var WjGroupPanel = WjGroupPanelBehavior.register();
    function registerV3WjGroupPanel(app: any) {
        app.component(WjGroupPanelBehavior.tag, WjGroupPanel);
    }


    export function registerGridGrouppanel(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjGroupPanel(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexGridSearchBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-grid-search';
        static props = [
            'isDisabled', 
            'text', 
            'delay', 
            'searchAllColumns', 
            'placeholder', 
            'cssMatch', 
            'grid'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static classCtor = function () { return wijmo.grid.search.FlexGridSearch; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.search.FlexGridSearch} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.search.FlexGridSearch} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexGridSearch = WjFlexGridSearchBehavior.register();
    function registerV3WjFlexGridSearch(app: any) {
        app.component(WjFlexGridSearchBehavior.tag, WjFlexGridSearch);
    }


    export function registerGridSearch(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexGridSearch(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    








/**
 * Represents a cell template types enumeration.
 */
export import CellTemplateType = GridCellTemplateType;










    class WjFlexGridBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-grid';
        static props = [
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied'
        ]
        static classCtor = function () { return wijmo.grid.FlexGrid; };
		

        protected _createControl(): any {
            let ret = <wijmo.grid.FlexGrid>super._createControl();
            new DirectiveCellFactory(ret);
            return ret;
        }                
    }
    /**
     * Vue component for the {@link wijmo.grid.FlexGrid} control.
     * 
     * The <b>wj-flex-grid</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.grid.detail.WjFlexGridDetail}
     * , {@link wijmo.vue2.grid.filter.WjFlexGridFilter}
     * , {@link wijmo.vue2.grid.WjFlexGridColumn}
     * , {@link wijmo.vue2.grid.WjFlexGridColumnGroup}
     * and {@link wijmo.vue2.grid.WjFlexGridCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.FlexGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     *
     * The example below shows how to instantiate and initialize a
     * {@link wijmo.grid.FlexGrid} control using Vue markup:
     *
     * <pre>&lt;wj-flex-grid
     *   :items-source="data"&gt;
     *   &lt;wj-flex-grid-column binding="name" header="Name"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column binding="sales" header="Sales" format="c0"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column binding="expenses" header="Expenses" format="c0"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column binding="active" header="Active"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     *   &lt;wj-flex-grid-column binding="date" header="Date"&gt;
     *   &lt;/wj-flex-grid-column&gt;
     * &lt;/wj-flex-grid&gt;</pre>
     *
     * The code sets the <b>itemsSource</b> property to a collection that contains the grid
     * data, then specifies the columns to display using <b>wj-flex-grid-column</b>
     * components.
     */
    export var WjFlexGrid = WjFlexGridBehavior.register();
    function registerV3WjFlexGrid(app: any) {
        app.component(WjFlexGridBehavior.tag, WjFlexGrid);
    }


    class WjFlexGridColumnBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-grid-column';
        static parentProp = 'columns';
        static props = [
            'wjProperty',
            'name', 
            'dataMap', 
            'dataType', 
            'binding', 
            'sortMemberPath', 
            'format', 
            'cellTemplate', 
            'header', 
            'width', 
            'maxLength', 
            'minWidth', 
            'maxWidth', 
            'align', 
            'allowDragging', 
            'allowSorting', 
            'allowResizing', 
            'allowMerging', 
            'aggregate', 
            'isReadOnly', 
            'cssClass', 
            'cssClassAll', 
            'isContentHtml', 
            'isSelected', 
            'visible', 
            'wordWrap', 
            'multiLine', 
            'mask', 
            'inputType', 
            'isRequired', 
            'showDropDown', 
            'dataMapEditor', 
            'dropDownCssClass', 
            'quickAutoSize', 
            'editor'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'grid.selectionChanged': ['isSelected'],
        }
        static classCtor = function () { return wijmo.grid.Column; };
		

        protected _initParent() {
            var grid = <wijmo.grid.FlexGrid>this.parent.control;
            if (grid.autoGenerateColumns) {
                grid.autoGenerateColumns = false;
                grid.columns.clear();
            }

            super._initParent();
        }                
    }
    /**
     * Vue component for the {@link wijmo.grid.Column} class.
     * 
     * The <b>wj-flex-grid-column</b> component should be contained in
     * a {@link wijmo.vue2.grid.WjFlexGrid} component.
     * 
     * The <b>wj-flex-grid-column</b> component may contain
     * a {@link wijmo.vue2.grid.WjFlexGridCellTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.Column} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexGridColumn = WjFlexGridColumnBehavior.register();
    function registerV3WjFlexGridColumn(app: any) {
        app.component(WjFlexGridColumnBehavior.tag, WjFlexGridColumn);
    }


    class WjFlexGridColumnGroupBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-grid-column-group';
        static parentProp = 'columnGroups';
        static props = [
            'wjProperty',
            'name', 
            'dataMap', 
            'dataType', 
            'binding', 
            'sortMemberPath', 
            'format', 
            'cellTemplate', 
            'header', 
            'width', 
            'maxLength', 
            'minWidth', 
            'maxWidth', 
            'align', 
            'allowDragging', 
            'allowSorting', 
            'allowResizing', 
            'allowMerging', 
            'aggregate', 
            'isReadOnly', 
            'cssClass', 
            'cssClassAll', 
            'isContentHtml', 
            'isSelected', 
            'visible', 
            'wordWrap', 
            'multiLine', 
            'mask', 
            'inputType', 
            'isRequired', 
            'showDropDown', 
            'dataMapEditor', 
            'dropDownCssClass', 
            'quickAutoSize', 
            'editor', 
            'collapseTo', 
            'isCollapsed'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'grid.selectionChanged': ['isSelected'],
        }
        static classCtor = function () { return wijmo.grid.ColumnGroup; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.ColumnGroup} class.
     * 
     * The <b>wj-flex-grid-column-group</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.grid.WjFlexGrid}
     *  or {@link wijmo.vue2.grid.WjFlexGridColumnGroup}.
     * 
     * The <b>wj-flex-grid-column-group</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.grid.WjFlexGridColumnGroup}
     * and {@link wijmo.vue2.grid.WjFlexGridCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.ColumnGroup} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexGridColumnGroup = WjFlexGridColumnGroupBehavior.register();
    function registerV3WjFlexGridColumnGroup(app: any) {
        app.component(WjFlexGridColumnGroupBehavior.tag, WjFlexGridColumnGroup);
    }


    interface ICellTemplateInfoVue extends ICellTemplateInfo {
        //template: CellTemplateRender;
        _instantiateTemplate(parent: HTMLElement, dataContext: any): any;
    }

    interface ICellTemplateCacheVue extends ICellTemplateCache {
        //viewRef: EmbeddedViewRef<any>;
        // A component instance that draws the cell using its template.
        cellCmp: typeof CellTemplateCmp; 
    }
    

    interface ICellRenderingInfoVue extends ICellRenderingInfo {
        templateContext: ICellTemplateInfoVue; // type cast
        templateCache: ICellTemplateCacheVue; // type cast
    }

    export class DirectiveCellFactory extends DirectiveCellFactoryBase {

        // Overrides
        protected shouldInstantiate(cellInfo: ICellRenderingInfoVue): boolean {
            let templateCache = cellInfo.templateCache,
                isForeignCell = templateCache == null || templateCache.column !== cellInfo.column || 
                    !templateCache.cellCmp ||
                    templateCache.templateContextProperty !== cellInfo.templateContextProperty ||
                    cellInfo.cell.firstChild != templateCache.rootElement;
            return isForeignCell;
        }

        protected renderTemplate(cellInfo: ICellRenderingInfoVue, initNew: boolean) {
            let row = cellInfo.row,
                //dataContext = initNew ? {} : cellInfo.templateCache.viewRef.context,
                dataContext: any = {},
                templateContext = cellInfo.templateContext;
            cellInfo.cellBindingsData = this.setBindingsData(dataContext, 
                row, cellInfo.column, row.dataItem, 
                cellInfo.cellValue, templateContext.valuePaths);
            if (initNew) {
                let cell = cellInfo.cell;
                let templInstance = templateContext._instantiateTemplate(
                        cell, dataContext.cell);
                let templateCache = cellInfo.templateCache = {
                    column: cellInfo.column,
                    rootElement: templInstance.$el,
                    templateContextProperty: cellInfo.templateContextProperty,
                    cellCmp: templInstance
                };
                cell[cellInfo.templateContextProperty] = templateCache;
            } else {
                let cellCmp = cellInfo.templateCache.cellCmp;
                cellCmp.context = dataContext.cell;
                cellCmp.$forceUpdate();
            }

        }
        
        protected disposeTemplate(cell: HTMLElement, templateCache: ICellTemplateCacheVue, 
                templateContext: ICellTemplateInfoVue) {
            let cellCmp = templateCache && templateCache.cellCmp;
            if (cellCmp) {
                cellCmp.$destroy();
                templateCache.cellCmp = null;
                super.disposeTemplate(cell, templateCache, templateContext);
            }
        }

        protected clearCell(cell: HTMLElement) {
            cell.textContent = '';
        }

        protected applyImmediately(cellInfo: ICellRenderingInfoVue) {
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

    }


    export const WjFlexGridCellTemplateDefinition = {
        props: {
            cellOverflow: { default: undefined },
            cellType: { default: undefined },
            autoSizeRows: { default: true },
            forceFullEdit: { default: true }
        },

        render: function(createElement): any {
            return VueApi.isV3Plus
                ? VueApi.h('div')
                : createElement('div');
        },

        mounted: function() {
            let parCmp = this.$parent;
            if (parCmp) {
                let parentBeh = parCmp[WjComponentBehavior._behProp];
                parentBeh._mountedCB(() => {
                    let ownerControl = this.ownerControl = parentBeh.control;
                    if (ownerControl instanceof wijmo.grid.FlexGrid) {
                        this.grid = ownerControl;
                    } else if (ownerControl instanceof wijmo.grid.Column) {
                        this.column = ownerControl;
                        let par2Cmp = parCmp,
                            grid;
                        do {
                            par2Cmp = par2Cmp.$parent;
                            let par2Beh = par2Cmp && par2Cmp[WjComponentBehavior._behProp];
                            grid = par2Beh && par2Beh.control;
                        } while (!(grid instanceof wijmo.grid.FlexGrid));
                        this.grid = grid;
                    }
                    this._attachToControl();
                });
            }

        },

        methods: {
            _attachToControl: function() {
                let cellType = this.cellTypeEnum = <CellTemplateType>wijmo.asEnum(
                    this.cellType, CellTemplateType),
                    ownerControl = this.ownerControl;
                ownerControl[DirectiveCellFactory.getTemplContextProp(cellType)] =
                    <ICellTemplateInfoVue>this;
                // TBD: remove flag on dispose if possible
                if (ownerControl instanceof wijmo.grid.Column &&
                    (cellType === CellTemplateType.Cell ||
                        cellType === CellTemplateType.ColumnHeader ||
                        cellType === CellTemplateType.ColumnFooter)) {
                    ownerControl._setFlag(wijmo.grid.RowColFlags.HasTemplate, true);
                }
                this.grid.invalidate();
            },

            _detachFromControl: function() {
                if (this.cellTypeEnum != null) {
                    this.ownerControl[DirectiveCellFactory.getTemplContextProp(this.cellTypeEnum)] = null;
                    this.grid.invalidate();
                }
            },

            _instantiateTemplate: function(parent: HTMLElement, dataContext: any): any {
                let ret = VueApi.isV3Plus
                    ? (new V3CellTemplateCmp({parent: this}))
                    : (new CellTemplateCmp({parent: this}));
                ret.context = dataContext;
                ret.slotFn = VueApi.isV3Plus
                    ? this.$slots.default
                    : this.$scopedSlots.default;
                // Mount as detached component
                ret.$mount();
                if (parent) {
                    parent.appendChild(ret.$el);
                }
                return ret;
            }
        }
    };
    WjFlexGridCellTemplateDefinition[VueApi.isV3Plus ? 'unmounted' : 'destroyed'] = function() {
        this._detachFromControl();
    };
    const WjFlexGridCellTemplateTag = 'wj-flex-grid-cell-template';
/**
* Vue component for the {@link FlexGrid} cell templates.
*
* The <b>wj-flex-grid-cell-template</b> component defines a template for a certain
* cell type in {@link FlexGrid}. The template element must contain a <b>cellType</b> attribute that
* specifies the {@link wijmo.vue2.grid.CellTemplateType}. Depending on the template's cell type,
* the <b>wj-flex-grid-cell-template</b> element must be a child
* of either {@link wijmo.vue2.grid.WjFlexGrid}
* or {@link wijmo.vue2.grid.WjFlexGridColumn} components.
*
* Column-specific cell templates must be contained in <b>wj-flex-grid-column</b>
* components, and cells that are not column-specific (like row header or top left cells)
* must be contained in the <b>wj-flex-grid</b> component.
*
* The <b>wj-flex-grid-cell-template</b> element 
* may contain an arbitrary HTML fragment with Vue interpolation expressions and
* other components and directives.
*
* Bindings in HTML fragment can use scoped slot properties that store cell specific data.
* The properties are <b>col</b>, <b>row</b>, and <b>item</b>, which refer to the {@link Column},
* {@link Row}, and <b>Row.dataItem</b> objects pertaining to the cell.
*
* For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>value</b> 
* property containing an unformatted cell value is provided. 
* 
* To reference slot properties, you can use either a new v-slot directive right on the 
* <b>wj-flex-grid-cell-template</b> element (it's available in Vue 2.6.0 or higher), 
* or an old slot-scope directive on the <b>&lt;template&gt;</b> element nested in
* wj-flex-grid-cell-template. 
* 
* For example, here is a 
* {@link FlexGrid} control with templates for row header cells and, regular
* and column header cells of the Country column:
*
* ```html
* <!-- component.html -->
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="RowHeader" v-slot="cell">
*     {{cell.row.index}}
*   </wj-flex-grid-cell-template>
*   <wj-flex-grid-cell-template cellType="RowHeaderEdit">
*     ...
*   </wj-flex-grid-cell-template>
* 
*   <wj-flex-grid-column header="Country" binding="country">
*     <wj-flex-grid-cell-template cellType="ColumnHeader" v-slot="cell">
*       <img src="resources/globe.png" />
*         {{cell.col.header}}
*     </wj-flex-grid-cell-template>
*     <wj-flex-grid-cell-template cellType="Cell" v-slot="cell">
*       <img :src="'resources/' + cell.item.country + '.png'" />
*       {{cell.item.country}}
*     </wj-flex-grid-cell-template>
*   </wj-flex-grid-column>
*   <wj-flex-grid-column header="Sales" binding="sales"></wj-flex-grid-column>
* </wj-flex-grid>
* ```
*
* The <b>wj-flex-grid-cell-template</b> directive supports the following attributes:
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
* Defines a regular (data) cell template. Must be a child of the {@link wijmo.vue2.grid.WjFlexGridColumn} component.
* For example, this cell template shows flags in the cells of Country column:
*
* ```html
* <wj-flex-grid-column header="Country" binding="country">
*   <wj-flex-grid-cell-template cellType="Cell" v-slot="cell">
*     <img :src="'resources/' + cell.item.country + '.png'" />
*     {{cell.item.country}}
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* If <b>Group</b> template is not provided for a hierarchical {@link FlexGrid} (that is, one with the <b>childItemsPath</b> property 
* specified), non-header cells in group rows of 
* this {@link Column} also use this template.
*
* <b>CellEdit</b>
*
* Defines a template for a cell in edit mode. Must be a child of the {@link wijmo.vue2.grid.WjFlexGridColumn} component.
* This cell type has an additional <b>value</b> scoped slot property available for binding. It contains the
* original cell value before editing, and the updated value after editing.
*
* For example, here is a template that uses the Wijmo {@link InputNumber} control as an editor
* for the "Sales" column:
* ```html
* <wj-flex-grid-column header="Sales" binding="sales">
*   <wj-flex-grid-cell-template cellType="CellEdit">
*     <wj-input-number v-model="cell.value" :step="1"></wj-input-number>
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* Note that two-way binding can also be specified using the binding's <b>sync</b> modifier: 
* ```html
* <wj-flex-grid-column header="Sales" binding="sales">
*   <wj-flex-grid-cell-template cellType="CellEdit">
*     <wj-input-number value.sync="cell.value" :step="1"></wj-input-number>
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
* 
* <b>ColumnHeader</b>
*
* Defines a template for a column header cell. Must be a child of the {@link wijmo.vue2.grid.WjFlexGridColumn} component.
* For example, this template adds an image to the header of the "Country" column:
*
* ```html
* <wj-flex-grid-column header="Country" binding="country">
*   <wj-flex-grid-cell-template cellType="ColumnHeader" v-slot="cell">
*     <img src="resources/globe.png" />
*     {{cell.col.header}}
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* <b>RowHeader</b>
*
* Defines a template for a row header cell. Must be a child of the {@link wijmo.vue2.grid.WjFlexGrid} component.
* For example, this template shows row indices in the row headers:
*
* ```html
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="RowHeader" v-slot="cell">
*     {{cell.row.index + 1}}
*   </wj-flex-grid-cell-template>
* </wj-flex-grid>
* ```
*
* Note that this template is applied to a row header cell, even if it is in a row that is 
* in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
* content, define the <b>RowHeaderEdit</b> template.
*
* <b>RowHeaderEdit</b>
*
* Defines a template for a row header cell in edit mode. Must be a child of the 
* {@link wijmo.vue2.grid.WjFlexGrid} component. For example, this template shows dots in the header
* of rows being edited:
*
* ```html
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="RowHeaderEdit">
*     ...
*   </wj-flex-grid-cell-template>
* </wj-flex-grid>
* ```
*
* Use the following <b>RowHeaderEdit</b> template to add the standard edit-mode indicator to cells where the <b>RowHeader</b> template 
* applies:
*
* ```html
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="RowHeaderEdit">
*     &#x270e;&#xfe0e;
*   </wj-flex-grid-cell-template>
* </wj-flex-grid>
* ```
*
* <b>TopLeft</b>
*
* Defines a template for the top left cell. Must be a child of the {@link wijmo.vue2.grid.WjFlexGrid} component.
* For example, this template shows a down/right glyph in the top-left cell of the grid:
*
* ```html
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="TopLeft">
*     <span class="wj-glyph-down-right"></span>
*   </wj-flex-grid-cell-template>
* </wj-flex-grid>
* ```
*
* <b>GroupHeader</b>
*
* Defines a template for a group header cell in a {@link GroupRow}. Must be a child of the {@link wijmo.vue2.grid.WjFlexGridColumn} component.
*
* The <b>row</b> scoped slot property contains an instance of the <b>GroupRow</b> class. If the grouping comes 
* from {@link CollectionView}, the <b>item</b> scoped slot property references the {@link CollectionViewGroup} object.
*
* For example, this template uses a checkbox element as an expand/collapse toggle:
*
* ```html
* <wj-flex-grid-column header="Country" binding="country">
*   <wj-flex-grid-cell-template cellType="GroupHeader" v-slot="cell">
*     <input type="checkbox" v-model="cell.row.isCollapsed"/> 
*     {{cell.item.name}} ({{cell.item.items.length}} items)
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* <b>Group</b>
*
* Defines a template for a regular cell (not a group header) in a {@link GroupRow}. Must be a child of the 
* {@link wijmo.vue2.grid.WjFlexGridColumn} component. This cell type has an additional <b>value</b> scoped 
* slot property available for
* binding. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
* aggregate value.
*
* For example, this template shows aggregate's value and kind for group row cells in the "Sales"
* column:
*
* ```html
* <wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg">
*   <wj-flex-grid-cell-template cellType="Group" v-slot="cell">
*     Average: {{formatNumber(cell.value, 'N0')}}
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* <b>ColumnFooter</b>
*
* Defines a template for a regular cell in a <b>columnFooters</b> panel. Must be a child of the
* {@link wijmo.vue2.grid.WjFlexGridColumn} component. This cell type has an additional <b>value</b>
* scoped slot property available for binding that contains a cell value.
*
* For example, this template shows aggregate's value and kind for a footer cell in the "Sales"
* column:
*
* ```html
* <wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg">
*   <wj-flex-grid-cell-template cellType="ColumnFooter" v-slot="cell">
*     Average: {{formatNumber(cell.value, 'N0')}}
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*
* <b>BottomLeft</b>
*
* Defines a template for the bottom left cells (at the intersection of the row header and column footer cells).
* Must be a child of the {@link wijmo.vue2.grid.WjFlexGrid} component.
* For example, this template shows a sigma glyph in the bottom-left cell of the grid:
*
* ```html
* <wj-flex-grid :itemsSource="data">
*   <wj-flex-grid-cell-template cellType="BottomLeft">
*     &#931;
*   </wj-flex-grid-cell-template>
* </wj-flex-grid>
* ```
*
* <b>NewCellTemplate</b>
* 
* Defines a cell in a new row template. Must be a child of the {@link wijmo.vue2.grid.WjFlexGridColumn} component.
* Note that the <b>cell.item</b> property is undefined for this type of a cell.
* For example, this cell template shows a placeholder in the Date column's cell in the "new row" item:
*
* ```html
* <wj-flex-grid-column header="'Date'" binding="'date'">
*   <wj-flex-grid-cell-template cellType="NewCellTemplate">
*     Enter a date here
*   </wj-flex-grid-cell-template>
* </wj-flex-grid-column>
* ```
*/
    export var WjFlexGridCellTemplate = VueApi.isV3Plus
        ? WjFlexGridCellTemplateDefinition
        : VueApi.component(WjFlexGridCellTemplateTag, WjFlexGridCellTemplateDefinition);
    function registerV3WjFlexGridCellTemplate(app: any) {
        app.component(WjFlexGridCellTemplateTag, WjFlexGridCellTemplate);
    }

    var CellTemplateCmp = VueApi.extend({
        render: function (createElement) {
            const slotFn = this.slotFn;
            return createElement('div', slotFn && [slotFn(this.context)]);
        }
    })

    class V3CellTemplateCmp {
        context: any;
        slotFn: any;
        private _host: HTMLElement = document.createElement('div');

        constructor(public readonly props: any) {}

        $mount() {
            const h = VueApi.h;
            const { parent, ...props } = this.props;
            const render = () => h('div', props, this.slotFn && this.slotFn(this.context));
            VueApi.render(h({ parent, render }), this.$el);
        }

        get $el() {
            return this._host;
        }

        $destroy() {
            VueApi.render(null, this.$el);
            this._host = null;
        }

        $forceUpdate() {
            this._host && this.$mount();
        }
    }



    export function registerGrid(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexGrid(app);
            registerV3WjFlexGridColumn(app);
            registerV3WjFlexGridColumnGroup(app);
            registerV3WjFlexGridCellTemplate(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    















    class WjMultiRowBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-row';
        static props = [
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups', 
            'layoutDefinition', 
            'headerLayoutDefinition', 
            'centerHeadersVertically', 
            'collapsedHeaders', 
            'showHeaderCollapseButton', 
            'multiRowGroupHeaders'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied', 
            'collapsedHeadersChanging'
        ]
        static changeEvents = {
            'collapsedHeadersChanged': ['collapsedHeaders'],
        }
        static classCtor = function () { return wijmo.grid.multirow.MultiRow; };
		

        protected _createControl(): any {
            let ret = <wijmo.grid.FlexGrid>super._createControl();
            new DirectiveCellFactory(ret);
            return ret;
        }                
    }
    /**
     * Vue component for the {@link wijmo.grid.multirow.MultiRow} control.
     * 
     * The <b>wj-multi-row</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.grid.multirow.WjMultiRowCellGroup}
     * and {@link wijmo.vue2.grid.multirow.WjMultiRowCellTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRow} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiRow = WjMultiRowBehavior.register();
    function registerV3WjMultiRow(app: any) {
        app.component(WjMultiRowBehavior.tag, WjMultiRow);
    }


    class WjMultiRowCellBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-row-cell';
        static parentProp = 'cells';
        static props = [
            'wjProperty',
            'name', 
            'dataMap', 
            'dataType', 
            'binding', 
            'sortMemberPath', 
            'format', 
            'cellTemplate', 
            'header', 
            'width', 
            'maxLength', 
            'minWidth', 
            'maxWidth', 
            'align', 
            'allowDragging', 
            'allowSorting', 
            'allowResizing', 
            'allowMerging', 
            'aggregate', 
            'isReadOnly', 
            'cssClass', 
            'cssClassAll', 
            'isContentHtml', 
            'isSelected', 
            'visible', 
            'wordWrap', 
            'multiLine', 
            'mask', 
            'inputType', 
            'isRequired', 
            'showDropDown', 
            'dataMapEditor', 
            'dropDownCssClass', 
            'quickAutoSize', 
            'editor', 
            'colspan', 
            'rowspan'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'grid.selectionChanged': ['isSelected'],
        }
        static classCtor = function () { return wijmo.grid.multirow.MultiRowCell; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.multirow.MultiRowCell} class.
     * 
     * The <b>wj-multi-row-cell</b> component should be contained in
     * a {@link wijmo.vue2.grid.multirow.WjMultiRowCellGroup} component.
     * 
     * The <b>wj-multi-row-cell</b> component may contain
     * a {@link wijmo.vue2.grid.multirow.WjMultiRowCellTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRowCell} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiRowCell = WjMultiRowCellBehavior.register();
    function registerV3WjMultiRowCell(app: any) {
        app.component(WjMultiRowCellBehavior.tag, WjMultiRowCell);
    }


    class WjMultiRowCellGroupBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-row-cell-group';
        static parentProp = 'layoutDefinition';
        static props = [
            'wjProperty',
            'name', 
            'dataMap', 
            'dataType', 
            'binding', 
            'sortMemberPath', 
            'format', 
            'cellTemplate', 
            'header', 
            'width', 
            'maxLength', 
            'minWidth', 
            'maxWidth', 
            'align', 
            'allowDragging', 
            'allowSorting', 
            'allowResizing', 
            'allowMerging', 
            'aggregate', 
            'isReadOnly', 
            'cssClass', 
            'cssClassAll', 
            'isContentHtml', 
            'isSelected', 
            'visible', 
            'wordWrap', 
            'multiLine', 
            'mask', 
            'inputType', 
            'isRequired', 
            'showDropDown', 
            'dataMapEditor', 
            'dropDownCssClass', 
            'quickAutoSize', 
            'editor', 
            'colspan', 
            'rowspan'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'grid.selectionChanged': ['isSelected'],
        }
        static classCtor = function () { return wijmo.grid.multirow.MultiRowCellGroup; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.multirow.MultiRowCellGroup} class.
     * 
     * The <b>wj-multi-row-cell-group</b> component should be contained in
     * a {@link wijmo.vue2.grid.multirow.WjMultiRow} component.
     * 
     * The <b>wj-multi-row-cell-group</b> component may contain
     * a {@link wijmo.vue2.grid.multirow.WjMultiRowCell} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.multirow.MultiRowCellGroup} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiRowCellGroup = WjMultiRowCellGroupBehavior.register();
    function registerV3WjMultiRowCellGroup(app: any) {
        app.component(WjMultiRowCellGroupBehavior.tag, WjMultiRowCellGroup);
    }



    const WjMultiRowCellTemplateTag = 'wj-multi-row-cell-template';

/**
* Vue component for the {@link MultiRow} cell templates.
*
* The <b>wj-multi-row-cell-template</b> component defines a template for a certain
* cell type in {@link MultiRow}. The template element must contain a <b>cellType</b> attribute that
* specifies the {@link wijmo.vue2.grid.CellTemplateType}. Depending on the template's cell type,
* the <b>wj-multi-row-cell-template</b> element must be a child
* of either {@link wijmo.vue2.grid.multirow.WjMultiRow}
* or {@link wijmo.vue2.grid.multirow.WjMultiRowCell} components.
*
* Column-specific cell templates must be contained in <b>wj-multi-row-cell</b>
* components, and cells that are not column-specific (like row header or top left cells)
* must be contained in the <b>wj-multi-row</b> component.
*
* The <b>wj-multi-row-cell-template</b> element 
* may contain an arbitrary HTML fragment with Vue interpolation expressions and
* other components and directives.
*
* Bindings in HTML fragment can use scoped slot properties that store cell specific data.
* The properties are <b>col</b>, <b>row</b>, and <b>item</b>, which refer to the {@link MultiRowCell},
* {@link Row}, and <b>Row.dataItem</b> objects pertaining to the cell.
*
* For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>value</b> 
* property containing an unformatted cell value is provided. 
* 
* To reference slot properties, you can use either a new v-slot directive right on the 
* <b>wj-multi-row-cell-template</b> element (it's available in Vue 2.6.0 or higher), 
* or an old slot-scope directive on the <b>&lt;template&gt;</b> element nested in
* wj-multi-row-cell-template. 
* 
* For example, here is a 
* {@link MultiRow} control with templates for row header cells and, regular
* and column header cells of the Country column:
*
* ```html
* <!-- component.html -->
* <wj-multi-row :itemsSource="data">
*   <wj-multi-row-cell-template cellType="RowHeader" v-slot="cell">
*     {{cell.row.index}}
*   </wj-multi-row-cell-template>
*   <wj-multi-row-cell-template cellType="RowHeaderEdit">
*     ...
*   </wj-multi-row-cell-template>
* 
*   <wj-multi-row-cell-group header="Statistics">
*     <wj-multi-row-cell header="Country" binding="country">
*       <wj-multi-row-cell-template cellType="ColumnHeader" v-slot="cell">
*         <img src="resources/globe.png" />
*           {{cell.col.header}}
*       </wj-multi-row-cell-template>
*       <wj-multi-row-cell-template cellType="Cell" v-slot="cell">
*         <img :src="'resources/' + cell.item.country + '.png'" />
*         {{cell.item.country}}
*       </wj-multi-row-cell-template>
*     </wj-multi-row-cell>
*     <wj-multi-row-cell header="Sales" binding="sales"></wj-multi-row-cell>
*   </wj-multi-row-cell-group>
* </wj-multi-row>
* ```
*
* The <b>wj-multi-row-cell-template</b> directive supports the following attributes:
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
* Defines a regular (data) cell template. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component.
* For example, this cell template shows flags in the cells of Country column:
*
* ```html
* <wj-multi-row-cell header="Country" binding="country">
*   <wj-multi-row-cell-template cellType="Cell" v-slot="cell">
*     <img :src="'resources/' + cell.item.country + '.png'" />
*     {{cell.item.country}}
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*
* <b>CellEdit</b>
*
* Defines a template for a cell in edit mode. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component.
* This cell type has an additional <b>value</b> scoped slot property available for binding. It contains the
* original cell value before editing, and the updated value after editing.
*
* For example, here is a template that uses the Wijmo {@link InputNumber} control as an editor
* for the "Sales" column:
* ```html
* <wj-multi-row-cell header="Sales" binding="sales">
*   <wj-multi-row-cell-template cellType="CellEdit">
*     <wj-input-number v-model="cell.value" :step="1"></wj-input-number>
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*
* Note that two-way binding can also be specified using the binding's <b>sync</b> modifier: 
* ```html
* <wj-multi-row-cell header="Sales" binding="sales">
*   <wj-multi-row-cell-template cellType="CellEdit">
*     <wj-input-number value.sync="cell.value" :step="1"></wj-input-number>
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
* 
* <b>ColumnHeader</b>
*
* Defines a template for a column header cell. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component.
* For example, this template adds an image to the header of the "Country" column:
*
* ```html
* <wj-multi-row-cell header="Country" binding="country">
*   <wj-multi-row-cell-template cellType="ColumnHeader" v-slot="cell">
*     <img src="resources/globe.png" />
*     {{cell.col.header}}
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*
* <b>RowHeader</b>
*
* Defines a template for a row header cell. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRow} component.
* For example, this template shows row indices in the row headers:
*
* ```html
* <wj-multi-row :itemsSource="data">
*   <wj-multi-row-cell-template cellType="RowHeader" v-slot="cell">
*     {{cell.row.index / cell.row.grid.rowsPerItem + 1}}
*   </wj-multi-row-cell-template>
* </wj-multi-row>
* ```
*
* Note that this template is applied to a row header cell, even if it is in a row that is 
* in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
* content, define the <b>RowHeaderEdit</b> template.
*
* <b>RowHeaderEdit</b>
*
* Defines a template for a row header cell in edit mode. Must be a child of the 
* {@link wijmo.vue2.grid.multirow.WjMultiRow} component. For example, this template shows dots in the header
* of rows being edited:
*
* ```html
* <wj-multi-row :itemsSource="data">
*   <wj-multi-row-cell-template cellType="RowHeaderEdit">
*     ...
*   </wj-multi-row-cell-template>
* </wj-multi-row>
* ```
*
* Use the following <b>RowHeaderEdit</b> template to add the standard edit-mode indicator to cells where the <b>RowHeader</b> template 
* applies:
*
* ```html
* <wj-multi-row :itemsSource="data">
*   <wj-multi-row-cell-template cellType="RowHeaderEdit">
*     &#x270e;&#xfe0e;
*   </wj-multi-row-cell-template>
* </wj-multi-row>
* ```
*
* <b>TopLeft</b>
*
* Defines a template for the top left cell. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRow} component.
* For example, this template shows a down/right glyph in the top-left cell of the grid:
*
* ```html
* <wj-multi-row :itemsSource="data">
*   <wj-multi-row-cell-template cellType="TopLeft">
*     <span class="wj-glyph-down-right"></span>
*   </wj-multi-row-cell-template>
* </wj-multi-row>
* ```
*
* <b>GroupHeader</b>
*
* Defines a template for a group header cell in a {@link GroupRow}. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component.
*
* The <b>row</b> scoped slot property contains an instance of the <b>GroupRow</b> class. If the grouping comes 
* from {@link CollectionView}, the <b>item</b> scoped slot property references the {@link CollectionViewGroup} object.
*
* For example, this template uses a checkbox element as an expand/collapse toggle:
*
* ```html
* <wj-multi-row-cell header="Country" binding="country">
*   <wj-multi-row-cell-template cellType="GroupHeader" v-slot="cell">
*     <input type="checkbox" v-model="cell.row.isCollapsed"/> 
*     {{cell.item.name}} ({{cell.item.items.length}} items)
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*
* <b>Group</b>
*
* Defines a template for a regular cell (not a group header) in a {@link GroupRow}. Must be a child of the 
* {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component. This cell type has an additional <b>value</b> scoped 
* slot property available for
* binding. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
* aggregate value.
*
* For example, this template shows aggregate's value and kind for group row cells in the "Sales"
* column:
*
* ```html
* <wj-multi-row-cell header="Sales" binding="sales" aggregate="Avg">
*   <wj-multi-row-cell-template cellType="Group" v-slot="cell">
*     Average: {{formatNumber(cell.value, 'N0')}}
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*
* <b>NewCellTemplate</b>
* 
* Defines a cell in a new row template. Must be a child of the {@link wijmo.vue2.grid.multirow.WjMultiRowCell} component.
* Note that the <b>cell.item</b> property is undefined for this type of a cell.
* For example, this cell template shows a placeholder in the Date column's cell in the "new row" item:
*
* ```html
* <wj-multi-row-cell header="'Date'" binding="'date'">
*   <wj-multi-row-cell-template cellType="NewCellTemplate">
*     Enter a date here
*   </wj-multi-row-cell-template>
* </wj-multi-row-cell>
* ```
*/
    export var WjMultiRowCellTemplate = VueApi.isV3Plus
        ? WjFlexGridCellTemplateDefinition
        : VueApi.component(WjMultiRowCellTemplateTag, WjFlexGridCellTemplateDefinition);
    function registerV3WjMultiRowCellTemplate(app: any) {
        app.component(WjMultiRowCellTemplateTag, WjMultiRowCellTemplate);
    }


    export function registerGridMultirow(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjMultiRow(app);
            registerV3WjMultiRowCell(app);
            registerV3WjMultiRowCellGroup(app);
            registerV3WjMultiRowCellTemplate(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexSheetBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-sheet';
        static props = [
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups', 
            'allowAutoFill', 
            'isTabHolderVisible', 
            'showFilterIcons', 
            'enableDragDrop', 
            'enableFormulas', 
            'selectedSheetIndex'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied', 
            'draggingRowColumn', 
            'droppingRowColumn', 
            'beginDroppingRowColumn', 
            'endDroppingRowColumn', 
            'loaded', 
            'unknownFunction', 
            'sheetCleared', 
            'prepareChangingRow', 
            'prepareChangingColumn', 
            'rowChanged', 
            'columnChanged', 
            'autoFilling', 
            'autoFilled'
        ]
        static changeEvents = {
            'selectedSheetChanged': ['selectedSheetIndex'],
        }
        static classCtor = function () { return wijmo.grid.sheet.FlexSheet; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.sheet.FlexSheet} control.
     * 
     * The <b>wj-flex-sheet</b> component may contain
     * a {@link wijmo.vue2.grid.sheet.WjSheet} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.sheet.FlexSheet} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexSheet = WjFlexSheetBehavior.register();
    function registerV3WjFlexSheet(app: any) {
        app.component(WjFlexSheetBehavior.tag, WjFlexSheet);
    }


    class WjSheetBehavior extends WjComponentBehavior {
        static tag = 'wj-sheet';
        static parentProp = 'sheets';
        static parentInCtor = true;
        static props = [
            'wjProperty',
            'name', 
            'itemsSource', 
            'visible', 
            'rowCount', 
            'columnCount'
        ]
        static events = [
            'initialized', 
            'nameChanged'
        ]
        static classCtor = function () { return wijmo.grid.sheet.Sheet; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.sheet.Sheet} class.
     * 
     * The <b>wj-sheet</b> component should be contained in
     * a {@link wijmo.vue2.grid.sheet.WjFlexSheet} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.sheet.Sheet} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjSheet = WjSheetBehavior.register();
    function registerV3WjSheet(app: any) {
        app.component(WjSheetBehavior.tag, WjSheet);
    }


    export function registerGridSheet(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexSheet(app);
            registerV3WjSheet(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjTransposedGridBehavior extends WjComponentBehavior {
        static tag = 'wj-transposed-grid';
        static props = [
            'autoGenerateRows', 
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups', 
            'rowGroups'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied'
        ]
        static classCtor = function () { return wijmo.grid.transposed.TransposedGrid; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.transposed.TransposedGrid} control.
     * 
     * The <b>wj-transposed-grid</b> component may contain
     * a {@link wijmo.vue2.grid.transposed.WjTransposedGridRow} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposed.TransposedGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTransposedGrid = WjTransposedGridBehavior.register();
    function registerV3WjTransposedGrid(app: any) {
        app.component(WjTransposedGridBehavior.tag, WjTransposedGrid);
    }


    class WjTransposedGridRowBehavior extends WjComponentBehavior {
        static tag = 'wj-transposed-grid-row';
        static parentProp = '_rowInfo';
        static props = [
            'wjProperty',
            'name', 
            'dataMap', 
            'dataType', 
            'binding', 
            'sortMemberPath', 
            'format', 
            'cellTemplate', 
            'header', 
            'width', 
            'maxLength', 
            'minWidth', 
            'maxWidth', 
            'align', 
            'allowDragging', 
            'allowSorting', 
            'allowResizing', 
            'allowMerging', 
            'aggregate', 
            'isReadOnly', 
            'cssClass', 
            'cssClassAll', 
            'isContentHtml', 
            'isSelected', 
            'visible', 
            'wordWrap', 
            'multiLine', 
            'mask', 
            'inputType', 
            'isRequired', 
            'showDropDown', 
            'dataMapEditor', 
            'dropDownCssClass', 
            'quickAutoSize', 
            'editor'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'grid.selectionChanged': ['isSelected'],
        }
        static classCtor = function () { return wijmo.grid.transposed.TransposedGridRow; };
		

        protected _initParent() {
            var grid = <wijmo.grid.transposed.TransposedGrid>this.parent.control;
            if (grid.autoGenerateRows) {
                grid.autoGenerateRows = false;
                grid._rowInfo.clear();
            }

            super._initParent();
        }                
    }
    /**
     * Vue component for the {@link wijmo.grid.transposed.TransposedGridRow} class.
     * 
     * The <b>wj-transposed-grid-row</b> component should be contained in
     * a {@link wijmo.vue2.grid.transposed.WjTransposedGrid} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposed.TransposedGridRow} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTransposedGridRow = WjTransposedGridRowBehavior.register();
    function registerV3WjTransposedGridRow(app: any) {
        app.component(WjTransposedGridRowBehavior.tag, WjTransposedGridRow);
    }


    export function registerGridTransposed(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjTransposedGrid(app);
            registerV3WjTransposedGridRow(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjTransposedMultiRowBehavior extends WjComponentBehavior {
        static tag = 'wj-transposed-multi-row';
        static props = [
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups', 
            'layoutDefinition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied'
        ]
        static classCtor = function () { return wijmo.grid.transposedmultirow.TransposedMultiRow; };                
    }
    /**
     * Vue component for the {@link wijmo.grid.transposedmultirow.TransposedMultiRow} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.grid.transposedmultirow.TransposedMultiRow} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTransposedMultiRow = WjTransposedMultiRowBehavior.register();
    function registerV3WjTransposedMultiRow(app: any) {
        app.component(WjTransposedMultiRowBehavior.tag, WjTransposedMultiRow);
    }


    export function registerGridTransposedMultirow(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjTransposedMultiRow(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjListBoxBehavior extends WjComponentBehavior {
        static tag = 'wj-list-box';
        static props = [
            'isDisabled', 
            'isContentHtml', 
            'maxHeight', 
            'selectedValuePath', 
            'itemFormatter', 
            'displayMemberPath', 
            'checkedMemberPath', 
            'caseSensitiveSearch', 
            'itemsSource', 
            'virtualizationThreshold', 
            'showGroups', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue', 
            'checkedItems'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'formatItem', 
            'itemsChanged', 
            'itemChecked'
        ]
        static changeEvents = {
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
            'checkedItemsChanged': ['checkedItems'],
        }
        static classCtor = function () { return wijmo.input.ListBox; };
        static modelProp = 'selectedValue';                
    }
    /**
     * Vue component for the {@link wijmo.input.ListBox} control.
     * 
     * The <b>wj-list-box</b> component may contain
     * a {@link wijmo.vue2.input.WjItemTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ListBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjListBox = WjListBoxBehavior.register();
    function registerV3WjListBox(app: any) {
        app.component(WjListBoxBehavior.tag, WjListBox);
    }


    class WjMultiSelectListBoxBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-select-list-box';
        static props = [
            'isDisabled', 
            'itemsSource', 
            'displayMemberPath', 
            'selectedIndex', 
            'isContentHtml', 
            'showGroups', 
            'checkOnFilter', 
            'showFilterInput', 
            'filterInputPlaceholder', 
            'showSelectAllCheckbox', 
            'selectAllLabel', 
            'delay', 
            'caseSensitiveSearch', 
            'checkedMemberPath', 
            'virtualizationThreshold', 
            'checkedItems'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'selectedIndexChanged': ['selectedIndex'],
            'checkedItemsChanged': ['checkedItems'],
        }
        static classCtor = function () { return wijmo.input.MultiSelectListBox; };
        static modelProp = 'checkedItems';                
    }
    /**
     * Vue component for the {@link wijmo.input.MultiSelectListBox} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiSelectListBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiSelectListBox = WjMultiSelectListBoxBehavior.register();
    function registerV3WjMultiSelectListBox(app: any) {
        app.component(WjMultiSelectListBoxBehavior.tag, WjMultiSelectListBox);
    }


    class WjComboBoxBehavior extends WjComponentBehavior {
        static tag = 'wj-combo-box';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'itemsSource', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
        }
        static classCtor = function () { return wijmo.input.ComboBox; };
        static modelProp = 'selectedValue';                
    }
    /**
     * Vue component for the {@link wijmo.input.ComboBox} control.
     * 
     * The <b>wj-combo-box</b> component may contain
     * a {@link wijmo.vue2.input.WjItemTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ComboBox} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjComboBox = WjComboBoxBehavior.register();
    function registerV3WjComboBox(app: any) {
        app.component(WjComboBoxBehavior.tag, WjComboBox);
    }


    class WjAutoCompleteBehavior extends WjComponentBehavior {
        static tag = 'wj-auto-complete';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'delay', 
            'maxItems', 
            'minLength', 
            'cssMatch', 
            'itemsSourceFunction', 
            'searchMemberPath', 
            'beginsWithSearch', 
            'itemsSource', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
        }
        static classCtor = function () { return wijmo.input.AutoComplete; };
        static modelProp = 'selectedValue';                
    }
    /**
     * Vue component for the {@link wijmo.input.AutoComplete} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.AutoComplete} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjAutoComplete = WjAutoCompleteBehavior.register();
    function registerV3WjAutoComplete(app: any) {
        app.component(WjAutoCompleteBehavior.tag, WjAutoComplete);
    }


    class WjCalendarBehavior extends WjComponentBehavior {
        static tag = 'wj-calendar';
        static props = [
            'isDisabled', 
            'monthView', 
            'showHeader', 
            'itemFormatter', 
            'itemValidator', 
            'firstDayOfWeek', 
            'max', 
            'min', 
            'formatYearMonth', 
            'formatDayHeaders', 
            'formatDays', 
            'formatYear', 
            'formatMonths', 
            'selectionMode', 
            'isReadOnly', 
            'handleWheel', 
            'repeatButtons', 
            'showYearPicker', 
            'value', 
            'displayMonth', 
            'monthCount', 
            'showMonthPicker', 
            'weeksBefore', 
            'weeksAfter', 
            'rangeEnd', 
            'rangeMin', 
            'rangeMax'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rangeChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
            'displayMonthChanged': ['displayMonth'],
            'rangeEndChanged': ['rangeEnd'],
        }
        static classCtor = function () { return wijmo.input.Calendar; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.Calendar} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Calendar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjCalendar = WjCalendarBehavior.register();
    function registerV3WjCalendar(app: any) {
        app.component(WjCalendarBehavior.tag, WjCalendar);
    }


    class WjColorPickerBehavior extends WjComponentBehavior {
        static tag = 'wj-color-picker';
        static props = [
            'isDisabled', 
            'showAlphaChannel', 
            'showColorString', 
            'palette', 
            'value'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.input.ColorPicker; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.ColorPicker} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.ColorPicker} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjColorPicker = WjColorPickerBehavior.register();
    function registerV3WjColorPicker(app: any) {
        app.component(WjColorPickerBehavior.tag, WjColorPicker);
    }


    class WjInputMaskBehavior extends WjComponentBehavior {
        static tag = 'wj-input-mask';
        static props = [
            'isDisabled', 
            'mask', 
            'overwriteMode', 
            'isRequired', 
            'isReadOnly', 
            'promptChar', 
            'placeholder', 
            'inputType', 
            'rawValue', 
            'value'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['rawValue', 'value'],
        }
        static classCtor = function () { return wijmo.input.InputMask; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputMask} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputMask} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputMask = WjInputMaskBehavior.register();
    function registerV3WjInputMask(app: any) {
        app.component(WjInputMaskBehavior.tag, WjInputMask);
    }


    class WjInputColorBehavior extends WjComponentBehavior {
        static tag = 'wj-input-color';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'showAlphaChannel', 
            'showColorString', 
            'value', 
            'text'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.input.InputColor; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputColor} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputColor} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputColor = WjInputColorBehavior.register();
    function registerV3WjInputColor(app: any) {
        app.component(WjInputColorBehavior.tag, WjInputColor);
    }


    class WjMultiSelectBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-select';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'checkedMemberPath', 
            'maxHeaderItems', 
            'headerFormat', 
            'headerFormatter', 
            'showSelectAllCheckbox', 
            'selectAllLabel', 
            'showFilterInput', 
            'filterInputPlaceholder', 
            'checkOnFilter', 
            'delay', 
            'caseSensitiveSearch', 
            'itemsSource', 
            'checkedItems', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
            'checkedItemsChanged': ['checkedItems'],
        }
        static classCtor = function () { return wijmo.input.MultiSelect; };
        static modelProp = 'checkedItems';                
    }
    /**
     * Vue component for the {@link wijmo.input.MultiSelect} control.
     * 
     * The <b>wj-multi-select</b> component may contain
     * a {@link wijmo.vue2.input.WjItemTemplate} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiSelect} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiSelect = WjMultiSelectBehavior.register();
    function registerV3WjMultiSelect(app: any) {
        app.component(WjMultiSelectBehavior.tag, WjMultiSelect);
    }


    class WjMultiAutoCompleteBehavior extends WjComponentBehavior {
        static tag = 'wj-multi-auto-complete';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'delay', 
            'maxItems', 
            'minLength', 
            'cssMatch', 
            'itemsSourceFunction', 
            'searchMemberPath', 
            'beginsWithSearch', 
            'maxSelectedItems', 
            'selectedItems', 
            'itemsSource', 
            'selectedMemberPath', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
            'selectedItemsChanged': ['selectedItems'],
        }
        static classCtor = function () { return wijmo.input.MultiAutoComplete; };
        static modelProp = 'selectedItems';                
    }
    /**
     * Vue component for the {@link wijmo.input.MultiAutoComplete} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.MultiAutoComplete} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMultiAutoComplete = WjMultiAutoCompleteBehavior.register();
    function registerV3WjMultiAutoComplete(app: any) {
        app.component(WjMultiAutoCompleteBehavior.tag, WjMultiAutoComplete);
    }


    class WjInputNumberBehavior extends WjComponentBehavior {
        static tag = 'wj-input-number';
        static props = [
            'isDisabled', 
            'showSpinner', 
            'repeatButtons', 
            'max', 
            'min', 
            'step', 
            'isRequired', 
            'placeholder', 
            'inputType', 
            'format', 
            'isReadOnly', 
            'handleWheel', 
            'value', 
            'text'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'valueChanged': ['value'],
            'textChanged': ['text'],
        }
        static classCtor = function () { return wijmo.input.InputNumber; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputNumber} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputNumber} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputNumber = WjInputNumberBehavior.register();
    function registerV3WjInputNumber(app: any) {
        app.component(WjInputNumberBehavior.tag, WjInputNumber);
    }


    class WjInputDateBehavior extends WjComponentBehavior {
        static tag = 'wj-input-date';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'selectionMode', 
            'format', 
            'mask', 
            'max', 
            'min', 
            'inputType', 
            'repeatButtons', 
            'showYearPicker', 
            'itemValidator', 
            'itemFormatter', 
            'monthCount', 
            'handleWheel', 
            'showMonthPicker', 
            'showHeader', 
            'weeksBefore', 
            'weeksAfter', 
            'rangeMin', 
            'rangeMax', 
            'separator', 
            'alwaysShowCalendar', 
            'predefinedRanges', 
            'closeOnSelection', 
            'text', 
            'value', 
            'rangeEnd'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'rangeChanged'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'valueChanged': ['value'],
            'rangeEndChanged': ['rangeEnd'],
        }
        static classCtor = function () { return wijmo.input.InputDate; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputDate} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDate} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputDate = WjInputDateBehavior.register();
    function registerV3WjInputDate(app: any) {
        app.component(WjInputDateBehavior.tag, WjInputDate);
    }


    class WjInputTimeBehavior extends WjComponentBehavior {
        static tag = 'wj-input-time';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'max', 
            'min', 
            'step', 
            'format', 
            'mask', 
            'inputType', 
            'itemsSource', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue', 
            'value'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
            'valueChanged': ['value'],
        }
        static classCtor = function () { return wijmo.input.InputTime; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputTime} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputTime} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputTime = WjInputTimeBehavior.register();
    function registerV3WjInputTime(app: any) {
        app.component(WjInputTimeBehavior.tag, WjInputTime);
    }


    class WjInputDateTimeBehavior extends WjComponentBehavior {
        static tag = 'wj-input-date-time';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'selectionMode', 
            'format', 
            'mask', 
            'max', 
            'min', 
            'inputType', 
            'repeatButtons', 
            'showYearPicker', 
            'itemValidator', 
            'itemFormatter', 
            'monthCount', 
            'handleWheel', 
            'showMonthPicker', 
            'showHeader', 
            'weeksBefore', 
            'weeksAfter', 
            'rangeMin', 
            'rangeMax', 
            'separator', 
            'alwaysShowCalendar', 
            'predefinedRanges', 
            'closeOnSelection', 
            'timeMax', 
            'timeMin', 
            'timeStep', 
            'timeFormat', 
            'text', 
            'value', 
            'rangeEnd'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'rangeChanged'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'valueChanged': ['value'],
            'rangeEndChanged': ['rangeEnd'],
        }
        static classCtor = function () { return wijmo.input.InputDateTime; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputDateTime} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDateTime} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputDateTime = WjInputDateTimeBehavior.register();
    function registerV3WjInputDateTime(app: any) {
        app.component(WjInputDateTimeBehavior.tag, WjInputDateTime);
    }


    class WjInputDateRangeBehavior extends WjComponentBehavior {
        static tag = 'wj-input-date-range';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'selectionMode', 
            'format', 
            'mask', 
            'max', 
            'min', 
            'inputType', 
            'repeatButtons', 
            'showYearPicker', 
            'itemValidator', 
            'itemFormatter', 
            'monthCount', 
            'handleWheel', 
            'showMonthPicker', 
            'showHeader', 
            'weeksBefore', 
            'weeksAfter', 
            'rangeMin', 
            'rangeMax', 
            'separator', 
            'alwaysShowCalendar', 
            'predefinedRanges', 
            'closeOnSelection', 
            'text', 
            'value', 
            'rangeEnd'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'rangeChanged'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'valueChanged': ['value'],
            'rangeEndChanged': ['rangeEnd'],
        }
        static classCtor = function () { return wijmo.input.InputDateRange; };
        static modelProp = 'value';                
    }
    /**
     * Vue component for the {@link wijmo.input.InputDateRange} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.InputDateRange} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjInputDateRange = WjInputDateRangeBehavior.register();
    function registerV3WjInputDateRange(app: any) {
        app.component(WjInputDateRangeBehavior.tag, WjInputDateRange);
    }


    class WjMenuBehavior extends WjComponentBehavior {
		
        static tag = 'wj-menu';
        static props = [
            'isDisabled', 
            'isDroppedDown', 
            'showDropDownButton', 
            'autoExpandSelection', 
            'placeholder', 
            'dropDownCssClass', 
            'isAnimated', 
            'isReadOnly', 
            'isRequired', 
            'inputType', 
            'clickAction', 
            'displayMemberPath', 
            'selectedValuePath', 
            'headerPath', 
            'isContentHtml', 
            'isEditable', 
            'handleWheel', 
            'maxDropDownHeight', 
            'maxDropDownWidth', 
            'itemFormatter', 
            'showGroups', 
            'trimText', 
            'caseSensitiveSearch', 
            'virtualizationThreshold', 
            'header', 
            'commandParameterPath', 
            'commandPath', 
            'subItemsPath', 
            'openOnHover', 
            'closeOnLeave', 
            'isButton', 
            'itemsSource', 
            'text', 
            'selectedIndex', 
            'selectedItem', 
            'selectedValue', 
            'value'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isDroppedDownChanging', 
            'itemsSourceChanged', 
            'formatItem'
        ]
        static changeEvents = {
            'isDroppedDownChanged': ['isDroppedDown'],
            'textChanged': ['text'],
            'selectedIndexChanged': ['selectedIndex', 'selectedItem', 'selectedValue'],
            'itemClicked': ['value'],
        }
        static classCtor = function () { return wijmo.input.Menu; };
        static modelProp = 'selectedValue';

        private _definedHeader: string;
        private _value: any;
		

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

        protected _updateControl(property: string, newValue: any) {
            super._updateControl(property, newValue);
            if (property === 'header') {
                this._definedHeader = newValue;
                this._updateHeader();
            }
            if (property === 'value') {
                this.value = newValue;
            }
        }

        private _updateHeader() {
            this.control.header = this._definedHeader || '';
            const selItem = this.control.selectedItem;
            if (this.value != null && selItem && this.control.displayMemberPath) {
                let currentValue = null;
                if (selItem instanceof WjMenuItemBehavior) {
                    const contentRoot = (<WjMenuItemBehavior>selItem).contentRoot;
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
            if (!(e.data instanceof WjMenuItemBehavior
                    || e.data instanceof WjMenuSeparatorBehavior)) {
                return;
            }
            e.item.textContent = '';
            e.item.appendChild(e.data.contentRoot);
            e.data.added(e.item);
        }                
    }
    /**
     * Vue component for the {@link wijmo.input.Menu} control.
     * 
     * The <b>wj-menu</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.input.WjMenuItem}
     * , {@link wijmo.vue2.input.WjMenuSeparator}
     * and {@link wijmo.vue2.input.WjItemTemplate}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Menu} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMenu = WjMenuBehavior.register();
    function registerV3WjMenu(app: any) {
        app.component(WjMenuBehavior.tag, WjMenu);
    }


    class WjMenuItemBehavior extends WjComponentBehavior {
		
        static tag = 'wj-menu-item';
        static parentProp = 'itemsSource';
        static siblingId = 'menuItemDir';
        static props = [
            'wjProperty',
            'value', 
            'cmd', 
            'cmdParam'
        ]
        static events = [
            'initialized'
        ]     
        static render: (createElement: () => any) => any = function (createElement: any) {
            if (VueApi.isV3Plus) {
                const h = VueApi.h;
                const defaultSlot = this.$slots.default;
                return h('div', {}, [h('div', {}, defaultSlot && defaultSlot())]);
            }
            return createElement('div', [createElement('div', [this.$slots.default])]);
        };

        contentRoot: HTMLElement;
		

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

            this.contentRoot = this.component.$el.firstElementChild;
            this.component.$el.style.display = 'none';
            return this;
        }

        added(toItem: HTMLElement) {
        }                
    }
    /**
     * Vue component for {@link wijmo.vue2.input.WjMenu} items.
     * 
     * The <b>wj-menu-item</b> component should be contained in
     * a {@link wijmo.vue2.input.WjMenu} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link } class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMenuItem = WjMenuItemBehavior.register();
    function registerV3WjMenuItem(app: any) {
        app.component(WjMenuItemBehavior.tag, WjMenuItem);
    }


    class WjMenuSeparatorBehavior extends WjComponentBehavior {
		
        static tag = 'wj-menu-separator';
        static parentProp = 'itemsSource';
        static siblingId = 'menuItemDir';
        static props = [
            'wjProperty',
        ]
        static events = [
            'initialized'
        ]     
        static render: (createElement: () => any) => any = function (createElement: any) {
            const style = {
                width: '100%',
                height: '1px',
                'background-color': 'lightgray',
            }
            if (VueApi.isV3Plus) {
                const h = VueApi.h;
                return h('div', {}, [h('div', { style })]);
            }
            return createElement('div', [createElement('div', { style })]);
        };

        contentRoot: HTMLElement;
		

        protected _createControl(): any {
            this.contentRoot = this.component.$el.firstElementChild;
            this.component.$el.style.display = 'none';
            return this;
        }

        added(toItem: HTMLElement) {
            // prevent item selection
            wijmo.addClass(toItem, 'wj-state-disabled');
        }                
    }
    /**
     * Vue component for {@link wijmo.vue2.input.WjMenu} item separators.
     * 
     * The <b>wj-menu-separator</b> component should be contained in
     * a {@link wijmo.vue2.input.WjMenu} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link } class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjMenuSeparator = WjMenuSeparatorBehavior.register();
    function registerV3WjMenuSeparator(app: any) {
        app.component(WjMenuSeparatorBehavior.tag, WjMenuSeparator);
    }


    const WjItemTemplateDefinition = {
        render: function(createElement): any {
            return VueApi.isV3Plus
                ? VueApi.h('div')
                : createElement('div');
        },
        mounted: function() {
            const parentComponent = this.$parent;
            if (parentComponent) {
                let parentBeh = parentComponent[WjComponentBehavior._behProp];
                parentBeh._mountedCB(() => {
                    const parentControl = parentBeh.control;
                    this.ownerControl = parentControl instanceof wijmo.input.ListBox
                        ? parentControl
                        : (
                            parentControl.listBox instanceof wijmo.input.ListBox
                                ? parentControl.listBox
                                : undefined
                        );
                    this.itemComponents = [];
                    const itemTemplate = VueApi.isV3Plus
                        ? this.$slots.default
                        : this.$scopedSlots.default;
                    const ownerControl = this.ownerControl;
                    if (ownerControl && itemTemplate) {
                        this.formatItemHandler = (sender, e) => {
                            const itemIndex = e.index;
                            if (!this.itemComponents[itemIndex]) {
                                if (VueApi.isV3Plus) {
                                    const h = VueApi.h;
                                    const itemComponent = {
                                        parent: this.component,
                                        render() {
                                            return h('div', {}, itemTemplate && itemTemplate({
                                                itemIndex,
                                                item: e.data,
                                                control: ownerControl,
                                            }));
                                        }
                                    }
                                    const vnode = h(itemComponent);
                                    this.itemComponents[itemIndex] = e.item;
                                    e.item.textContent = '';
                                    VueApi.render(vnode, e.item);
                                } else {
                                    const itemComponent = ItemTemplateComponentFactory(itemTemplate, {
                                        itemIndex,
                                        item: e.data,
                                        control: ownerControl,
                                    }, this).$mount();
                                    this.itemComponents[itemIndex] = itemComponent;
                                    e.item.textContent = '';
                                    e.item.appendChild(itemComponent.$el);
                                }
                            }
                        };
                        ownerControl.formatItem.addHandler(this.formatItemHandler, this);
                        ownerControl.loadingItems.addHandler(sender => {
                            this._destroyItemComponents();
                        })
                    }
                });
            }
        },
        methods: {
            _destroyItemComponents() {
                (this.itemComponents || []).forEach(item => {
                    if (VueApi.isV3Plus) {
                        VueApi.render(null, item); // destroy
                    } else {
                        item.$destroy();
                    }
                });
                this.itemComponents = [];
            },
        },
    };
    WjItemTemplateDefinition[VueApi.isV3Plus ? 'unmounted' : 'destroyed'] = function() {
        if (this.formatItemHandler) {
            this.ownerControl.formatItem.removeHandler(this.formatItemHandler, this);
        }
        this._destroyItemComponents();
    };
    const ItemTemplateComponentFactory = (itemTemplate, propsData, parent) => {
        const component = new ItemTemplateComponent({ parent });
        component.itemTemplate = itemTemplate;
        component.itemData = propsData;
        return component;
    }
    const ItemTemplateComponent = VueApi.extend({
        render: function (createElement) {
            return createElement('div', {}, this.itemTemplate && this.itemTemplate(this.itemData));
        },
    });
    const WjItemTemplateTag = 'wj-item-template';
    /**
     * Vue component to define item templates for item
     * controls like {@link ListBox}, {@link ComboBox}, {@link MultiSelect} 
     * and  {@link Menu}.
     */
    export var WjItemTemplate = VueApi.isV3Plus
        ? WjItemTemplateDefinition
        : VueApi.component(WjItemTemplateTag, WjItemTemplateDefinition);
    function registerV3WjItemTemplate(app: any) {
        app.component(WjItemTemplateTag, WjItemTemplate);
    }



    class WjPopupBehavior extends WjComponentBehavior {
        static tag = 'wj-popup';
        static props = [
            'isDisabled', 
            'owner', 
            'showTrigger', 
            'hideTrigger', 
            'fadeIn', 
            'fadeOut', 
            'isDraggable', 
            'isResizable', 
            'dialogResultEnter', 
            'dialogResultSubmit', 
            'modal', 
            'removeOnHide'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'showing', 
            'shown', 
            'hiding', 
            'hidden', 
            'resizing', 
            'sizeChanging', 
            'sizeChanged', 
            'resized', 
            'dragging', 
            'positionChanging', 
            'positionChanged', 
            'dragged'
        ]
        static classCtor = function () { return wijmo.input.Popup; };                
    }
    /**
     * Vue component for the {@link wijmo.input.Popup} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.Popup} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjPopup = WjPopupBehavior.register();
    function registerV3WjPopup(app: any) {
        app.component(WjPopupBehavior.tag, WjPopup);
    }


    class _CtxMenuUtils {
        readonly key = '__wjCtxMenu';

        get definition() {
            return VueApi.isV3Plus
            ? {
                mounted: this._bind.bind(this),
                updated: this._update.bind(this),
                unmounted: this._unbind.bind(this),
            }
            : {
                bind: this._bind.bind(this),
                update: this._update.bind(this),
                unbind: this._unbind.bind(this),
            };
        }

        private _bind(el, binding, vnode) {
            const listener = e => {
                // don't show menu for disabled elements
                if (wijmo.closest(e.target, '[disabled]')) {
                    return;
                }

                // find appropriate menu dynamically
                const menu = this._getMenuControl(binding, vnode);

                // show menu if possible
                if (menu && menu.dropDown) {
                    e.preventDefault();
                    e.stopPropagation();
                    menu.owner = el;
                    menu.show(e);
                }
            };
            el.addEventListener('contextmenu', listener);
            el[this.key] = { binding, listener };
        }

        private _unbind(el) {
            const listener = el[this.key] && el[this.key].listener;
            listener && el.removeEventListener('contextmenu', listener);
            el[this.key] = null;
        }

        private _update(el, binding, vnode) {
            const prevBinding = el[this.key] && el[this.key].binding;
            if (!prevBinding || (prevBinding.value !== binding.value)) {
                this._unbind(el);
                this._bind(el, binding, vnode);
            }
        }

        private _getMenuControl(binding, vnode) {
            let menu = null,
                el = null,
                value = binding.value;

            // handle $refs in binding.expression
            if (value == null && binding.expression.indexOf('$refs.') === 0) {
                let bnd = new wijmo.Binding(binding.expression);
                value = bnd.getValue(vnode.context);
            }

            if (wijmo.isString(value)) {
                el = document.getElementById(value);
            } else if (value instanceof HTMLElement) {
                el = value;
            }

            if (el) {
                menu = wijmo.Control.getControl(el);
            } else {
                // menu = value instanceof Vue ? value.control : value;
                menu = (value && value.control) || value;
            }

            return wijmo.tryCast(menu, wijmo.input.Menu);
        }
    }
    const wjContextMenuDefinition = (new _CtxMenuUtils()).definition;
    const WjContextMenuTag = 'wjContextMenu';
    /**
     * Vue directive to define context menus for elements.
     * TBD: description goes here...
     **/
    export var WjContextMenu = VueApi.isV3Plus
        ? wjContextMenuDefinition
        : VueApi.directive(WjContextMenuTag, wjContextMenuDefinition);
    function registerV3WjContextMenu(app: any) {
        app.directive(WjContextMenuTag, WjContextMenu);;
    }

    class WjCollectionViewNavigatorBehavior extends WjComponentBehavior {
        static tag = 'wj-collection-view-navigator';
        static props = [
            'isDisabled', 
            'cv', 
            'byPage', 
            'headerFormat', 
            'repeatButtons'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static classCtor = function () { return wijmo.input.CollectionViewNavigator; };                
    }
    /**
     * Vue component for the {@link wijmo.input.CollectionViewNavigator} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.input.CollectionViewNavigator} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjCollectionViewNavigator = WjCollectionViewNavigatorBehavior.register();
    function registerV3WjCollectionViewNavigator(app: any) {
        app.component(WjCollectionViewNavigatorBehavior.tag, WjCollectionViewNavigator);
    }


    export function registerInput(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjListBox(app);
            registerV3WjMultiSelectListBox(app);
            registerV3WjComboBox(app);
            registerV3WjAutoComplete(app);
            registerV3WjCalendar(app);
            registerV3WjColorPicker(app);
            registerV3WjInputMask(app);
            registerV3WjInputColor(app);
            registerV3WjMultiSelect(app);
            registerV3WjMultiAutoComplete(app);
            registerV3WjInputNumber(app);
            registerV3WjInputDate(app);
            registerV3WjInputTime(app);
            registerV3WjInputDateTime(app);
            registerV3WjInputDateRange(app);
            registerV3WjMenu(app);
            registerV3WjMenuItem(app);
            registerV3WjMenuSeparator(app);
            registerV3WjItemTemplate(app);
            registerV3WjPopup(app);
            registerV3WjContextMenu(app);
            registerV3WjCollectionViewNavigator(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjPivotGridBehavior extends WjComponentBehavior {
        static tag = 'wj-pivot-grid';
        static props = [
            'isDisabled', 
            'newRowAtTop', 
            'allowAddNew', 
            'allowDelete', 
            'allowDragging', 
            'allowMerging', 
            'allowResizing', 
            'allowSorting', 
            'allowPinning', 
            'autoScroll', 
            'autoRowHeights', 
            'autoSizeMode', 
            'autoGenerateColumns', 
            'autoSearch', 
            'caseSensitiveSearch', 
            'quickAutoSize', 
            'bigCheckboxes', 
            'childItemsPath', 
            'groupHeaderFormat', 
            'headersVisibility', 
            'showSelectedHeaders', 
            'showMarquee', 
            'showPlaceholders', 
            'itemFormatter', 
            'isReadOnly', 
            'imeEnabled', 
            'mergeManager', 
            'selectionMode', 
            'showGroups', 
            'showSort', 
            'showDropDown', 
            'showAlternatingRows', 
            'showErrors', 
            'alternatingRowStep', 
            'itemValidator', 
            'validateEdits', 
            'treeIndent', 
            'itemsSource', 
            'autoClipboard', 
            'expandSelectionOnCopyPaste', 
            'frozenRows', 
            'frozenColumns', 
            'cloneFrozenCells', 
            'deferResizing', 
            'sortRowIndex', 
            'editColumnIndex', 
            'stickyHeaders', 
            'preserveSelectedState', 
            'preserveOutlineState', 
            'preserveWhiteSpace', 
            'keyActionTab', 
            'keyActionEnter', 
            'rowHeaderPath', 
            'virtualizationThreshold', 
            'anchorCursor', 
            'lazyRender', 
            'refreshOnEdit', 
            'copyHeaders', 
            'columnGroups', 
            'showDetailOnDoubleClick', 
            'customContextMenu', 
            'collapsibleSubtotals', 
            'centerHeadersVertically', 
            'showColumnFieldHeaders', 
            'showRowFieldHeaders', 
            'showValueFieldHeaders', 
            'outlineMode'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'beginningEdit', 
            'cellEditEnded', 
            'cellEditEnding', 
            'prepareCellForEdit', 
            'formatItem', 
            'resizingColumn', 
            'resizedColumn', 
            'autoSizingColumn', 
            'autoSizedColumn', 
            'draggingColumn', 
            'draggingColumnOver', 
            'draggedColumn', 
            'sortingColumn', 
            'sortedColumn', 
            'pinningColumn', 
            'pinnedColumn', 
            'resizingRow', 
            'resizedRow', 
            'autoSizingRow', 
            'autoSizedRow', 
            'draggingRow', 
            'draggingRowOver', 
            'draggedRow', 
            'deletingRow', 
            'deletedRow', 
            'loadingRows', 
            'loadedRows', 
            'rowEditStarting', 
            'rowEditStarted', 
            'rowEditEnding', 
            'rowEditEnded', 
            'rowAdded', 
            'groupCollapsedChanging', 
            'groupCollapsedChanged', 
            'columnGroupCollapsedChanging', 
            'columnGroupCollapsedChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged', 
            'selectionChanging', 
            'selectionChanged', 
            'scrollPositionChanged', 
            'updatingView', 
            'updatedView', 
            'updatingLayout', 
            'updatedLayout', 
            'pasting', 
            'pasted', 
            'pastingCell', 
            'pastedCell', 
            'copying', 
            'copied'
        ]
        static classCtor = function () { return wijmo.olap.PivotGrid; };                
    }
    /**
     * Vue component for the {@link wijmo.olap.PivotGrid} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotGrid} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjPivotGrid = WjPivotGridBehavior.register();
    function registerV3WjPivotGrid(app: any) {
        app.component(WjPivotGridBehavior.tag, WjPivotGrid);
    }


    class WjPivotChartBehavior extends WjComponentBehavior {
        static tag = 'wj-pivot-chart';
        static props = [
            'isDisabled', 
            'chartType', 
            'showHierarchicalAxes', 
            'showTotals', 
            'showTitle', 
            'showLegend', 
            'legendPosition', 
            'stacking', 
            'maxSeries', 
            'maxPoints', 
            'itemsSource', 
            'header', 
            'footer', 
            'headerStyle', 
            'footerStyle'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static classCtor = function () { return wijmo.olap.PivotChart; };                
    }
    /**
     * Vue component for the {@link wijmo.olap.PivotChart} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotChart} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjPivotChart = WjPivotChartBehavior.register();
    function registerV3WjPivotChart(app: any) {
        app.component(WjPivotChartBehavior.tag, WjPivotChart);
    }


    class WjPivotPanelBehavior extends WjComponentBehavior {
        static tag = 'wj-pivot-panel';
        static props = [
            'isDisabled', 
            'autoGenerateFields', 
            'viewDefinition', 
            'engine', 
            'itemsSource', 
            'showFieldIcons', 
            'restrictDragging'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'itemsSourceChanged', 
            'viewDefinitionChanged', 
            'updatingView', 
            'updatedView'
        ]
        static classCtor = function () { return wijmo.olap.PivotPanel; };                
    }
    /**
     * Vue component for the {@link wijmo.olap.PivotPanel} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.PivotPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjPivotPanel = WjPivotPanelBehavior.register();
    function registerV3WjPivotPanel(app: any) {
        app.component(WjPivotPanelBehavior.tag, WjPivotPanel);
    }


    class WjSlicerBehavior extends WjComponentBehavior {
        static tag = 'wj-slicer';
        static props = [
            'isDisabled', 
            'field', 
            'showHeader', 
            'header', 
            'showCheckboxes', 
            'multiSelect'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static classCtor = function () { return wijmo.olap.Slicer; };                
    }
    /**
     * Vue component for the {@link wijmo.olap.Slicer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.olap.Slicer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjSlicer = WjSlicerBehavior.register();
    function registerV3WjSlicer(app: any) {
        app.component(WjSlicerBehavior.tag, WjSlicer);
    }


    export function registerOlap(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjPivotGrid(app);
            registerV3WjPivotChart(app);
            registerV3WjPivotPanel(app);
            registerV3WjSlicer(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjReportViewerBehavior extends WjComponentBehavior {
        static tag = 'wj-report-viewer';
        static props = [
            'isDisabled', 
            'serviceUrl', 
            'filePath', 
            'fullScreen', 
            'zoomFactor', 
            'zoomMode', 
            'mouseMode', 
            'viewMode', 
            'requestHeaders', 
            'parameters', 
            'paginated', 
            'reportName'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'pageIndexChanged', 
            'queryLoadingData', 
            'beforeSendRequest'
        ]
        static changeEvents = {
            'fullScreenChanged': ['fullScreen'],
            'zoomFactorChanged': ['zoomFactor'],
            'zoomModeChanged': ['zoomMode'],
            'mouseModeChanged': ['mouseMode'],
            'viewModeChanged': ['viewMode'],
        }
        static classCtor = function () { return wijmo.viewer.ReportViewer; };                
    }
    /**
     * Vue component for the {@link wijmo.viewer.ReportViewer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.viewer.ReportViewer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjReportViewer = WjReportViewerBehavior.register();
    function registerV3WjReportViewer(app: any) {
        app.component(WjReportViewerBehavior.tag, WjReportViewer);
    }


    class WjPdfViewerBehavior extends WjComponentBehavior {
        static tag = 'wj-pdf-viewer';
        static props = [
            'isDisabled', 
            'serviceUrl', 
            'filePath', 
            'fullScreen', 
            'zoomFactor', 
            'zoomMode', 
            'mouseMode', 
            'viewMode', 
            'requestHeaders'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'pageIndexChanged', 
            'queryLoadingData', 
            'beforeSendRequest'
        ]
        static changeEvents = {
            'fullScreenChanged': ['fullScreen'],
            'zoomFactorChanged': ['zoomFactor'],
            'zoomModeChanged': ['zoomMode'],
            'mouseModeChanged': ['mouseMode'],
            'viewModeChanged': ['viewMode'],
        }
        static classCtor = function () { return wijmo.viewer.PdfViewer; };                
    }
    /**
     * Vue component for the {@link wijmo.viewer.PdfViewer} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.viewer.PdfViewer} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjPdfViewer = WjPdfViewerBehavior.register();
    function registerV3WjPdfViewer(app: any) {
        app.component(WjPdfViewerBehavior.tag, WjPdfViewer);
    }


    export function registerViewer(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjReportViewer(app);
            registerV3WjPdfViewer(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjTreeViewBehavior extends WjComponentBehavior {
        static tag = 'wj-tree-view';
        static props = [
            'isDisabled', 
            'childItemsPath', 
            'displayMemberPath', 
            'imageMemberPath', 
            'checkedMemberPath', 
            'isContentHtml', 
            'showCheckboxes', 
            'autoCollapse', 
            'isAnimated', 
            'isReadOnly', 
            'allowDragging', 
            'checkOnClick', 
            'expandOnClick', 
            'collapseOnClick', 
            'expandOnLoad', 
            'lazyLoadFunction', 
            'itemsSource', 
            'selectedItem', 
            'selectedNode', 
            'checkedItems'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'itemsSourceChanged', 
            'loadingItems', 
            'loadedItems', 
            'itemClicked', 
            'isCollapsedChanging', 
            'isCollapsedChanged', 
            'isCheckedChanging', 
            'isCheckedChanged', 
            'formatItem', 
            'dragStart', 
            'dragOver', 
            'drop', 
            'dragEnd', 
            'nodeEditStarting', 
            'nodeEditStarted', 
            'nodeEditEnding', 
            'nodeEditEnded'
        ]
        static changeEvents = {
            'selectedItemChanged': ['selectedItem', 'selectedNode'],
            'checkedItemsChanged': ['checkedItems'],
        }
        static classCtor = function () { return wijmo.nav.TreeView; };                
    }
    /**
     * Vue component for the {@link wijmo.nav.TreeView} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.TreeView} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTreeView = WjTreeViewBehavior.register();
    function registerV3WjTreeView(app: any) {
        app.component(WjTreeViewBehavior.tag, WjTreeView);
    }


    class WjTabPanelBehavior extends WjComponentBehavior {
        static tag = 'wj-tab-panel';
        static props = [
            'isDisabled', 
            'isAnimated', 
            'autoSwitch', 
            'selectedIndex', 
            'selectedTab'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'selectedIndexChanged': ['selectedIndex', 'selectedTab'],
        }
        static classCtor = function () { return wijmo.nav.TabPanel; };
		
        protected _createControl(): any {
            const control = new wijmo.nav.TabPanel(this.component.$el, null, true);
            control.beginUpdate();  // suppress updates handling during initialization
            return control;
        }

        lhMounted() {
            super.lhMounted();
            this.control.onSelectedIndexChanged();  // force initial selectedTab handling
            this.control.endUpdate();   // enable updates handling
        }                
    }
    /**
     * Vue component for the {@link wijmo.nav.TabPanel} control.
     * 
     * The <b>wj-tab-panel</b> component may contain
     * a {@link wijmo.vue2.nav.WjTab} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.TabPanel} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTabPanel = WjTabPanelBehavior.register();
    function registerV3WjTabPanel(app: any) {
        app.component(WjTabPanelBehavior.tag, WjTabPanel);
    }


    class WjTabBehavior extends WjComponentBehavior {
        static tag = 'wj-tab';
        static parentProp = 'tabs';
        static props = [
            'wjProperty',
            'isDisabled', 
            'isVisible'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.nav.Tab; };
		
        protected _createControl(): any {
            const child = this.component.$el;
            wijmo.assert(child.childElementCount == 2, 'TabPanel children should contain header and pane elements');
            return new wijmo.nav.Tab(child.children[0], child.children[1]);
        }                
    }
    /**
     * Vue component for the {@link wijmo.nav.Tab} class.
     * 
     * The <b>wj-tab</b> component should be contained in
     * a {@link wijmo.vue2.nav.WjTabPanel} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.Tab} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjTab = WjTabBehavior.register();
    function registerV3WjTab(app: any) {
        app.component(WjTabBehavior.tag, WjTab);
    }


    class WjAccordionBehavior extends WjComponentBehavior {
        static tag = 'wj-accordion';
        static props = [
            'isDisabled', 
            'isAnimated', 
            'autoSwitch', 
            'selectedIndex', 
            'selectedPane', 
            'showIcons', 
            'allowCollapseAll', 
            'allowExpandMany'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput'
        ]
        static changeEvents = {
            'selectedIndexChanged': ['selectedIndex'],
        }
        static classCtor = function () { return wijmo.nav.Accordion; };
		
        protected _createControl(): any {
            const control = new wijmo.nav.Accordion(this.component.$el, null, true);
            control.beginUpdate();  // suppress updates handling during initialization
            return control;
        }

        lhMounted() {
            super.lhMounted();
            const control = this.control;
            // set default selected pane
            if ((control.selectedIndex < 0) && control.panes.length) {
                control.selectedIndex = 0;
            }
            control.endUpdate();   // enable updates handling
        }                
    }
    /**
     * Vue component for the {@link wijmo.nav.Accordion} control.
     * 
     * The <b>wj-accordion</b> component may contain
     * a {@link wijmo.vue2.nav.WjAccordionPane} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.Accordion} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjAccordion = WjAccordionBehavior.register();
    function registerV3WjAccordion(app: any) {
        app.component(WjAccordionBehavior.tag, WjAccordion);
    }


    class WjAccordionPaneBehavior extends WjComponentBehavior {
        static tag = 'wj-accordion-pane';
        static parentProp = 'panes';
        static props = [
            'wjProperty',
            'isDisabled', 
            'isVisible'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.nav.AccordionPane; };
		
        protected _createControl(): any {
            const child = this.component.$el;
            wijmo.assert(child.childElementCount == 2, 'AccordionPane children should contain header and pane elements');
            return new wijmo.nav.AccordionPane(child.children[0], child.children[1]);
        }                
    }
    /**
     * Vue component for the {@link wijmo.nav.AccordionPane} class.
     * 
     * The <b>wj-accordion-pane</b> component should be contained in
     * a {@link wijmo.vue2.nav.WjAccordion} component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.nav.AccordionPane} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjAccordionPane = WjAccordionPaneBehavior.register();
    function registerV3WjAccordionPane(app: any) {
        app.component(WjAccordionPaneBehavior.tag, WjAccordionPane);
    }


    export function registerNav(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjTreeView(app);
            registerV3WjTabPanel(app);
            registerV3WjTab(app);
            registerV3WjAccordion(app);
            registerV3WjAccordionPane(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjBarcodeCodabarBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-codabar';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'checkDigit', 
            'labelPosition', 
            'nwRatio'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Codabar; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Codabar} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Codabar} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeCodabar = WjBarcodeCodabarBehavior.register();
    function registerV3WjBarcodeCodabar(app: any) {
        app.component(WjBarcodeCodabarBehavior.tag, WjBarcodeCodabar);
    }


    class WjBarcodeEan8Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-ean8';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Ean8; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Ean8} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Ean8} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeEan8 = WjBarcodeEan8Behavior.register();
    function registerV3WjBarcodeEan8(app: any) {
        app.component(WjBarcodeEan8Behavior.tag, WjBarcodeEan8);
    }


    class WjBarcodeEan13Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-ean13';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'addOn', 
            'addOnHeight', 
            'addOnLabelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Ean13; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Ean13} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Ean13} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeEan13 = WjBarcodeEan13Behavior.register();
    function registerV3WjBarcodeEan13(app: any) {
        app.component(WjBarcodeEan13Behavior.tag, WjBarcodeEan13);
    }


    class WjBarcodeCode39Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-code39';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'checkDigit', 
            'fullAscii', 
            'labelPosition', 
            'nwRatio', 
            'labelWithStartAndStopCharacter'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Code39; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Code39} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Code39} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeCode39 = WjBarcodeCode39Behavior.register();
    function registerV3WjBarcodeCode39(app: any) {
        app.component(WjBarcodeCode39Behavior.tag, WjBarcodeCode39);
    }


    class WjBarcodeCode128Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-code128';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'codeSet', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Code128; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Code128} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Code128} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeCode128 = WjBarcodeCode128Behavior.register();
    function registerV3WjBarcodeCode128(app: any) {
        app.component(WjBarcodeCode128Behavior.tag, WjBarcodeCode128);
    }


    class WjBarcodeGs1_128Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1_128';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.Gs1_128; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.Gs1_128} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.Gs1_128} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1_128 = WjBarcodeGs1_128Behavior.register();
    function registerV3WjBarcodeGs1_128(app: any) {
        app.component(WjBarcodeGs1_128Behavior.tag, WjBarcodeGs1_128);
    }


    class WjBarcodeUpcABehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-upc-a';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'addOn', 
            'labelPosition', 
            'addOnHeight', 
            'addOnLabelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.UpcA; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.UpcA} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcA} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeUpcA = WjBarcodeUpcABehavior.register();
    function registerV3WjBarcodeUpcA(app: any) {
        app.component(WjBarcodeUpcABehavior.tag, WjBarcodeUpcA);
    }


    class WjBarcodeUpcE0Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-upc-e0';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'addOn', 
            'labelPosition', 
            'addOnHeight', 
            'addOnLabelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.UpcE0; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.UpcE0} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcE0} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeUpcE0 = WjBarcodeUpcE0Behavior.register();
    function registerV3WjBarcodeUpcE0(app: any) {
        app.component(WjBarcodeUpcE0Behavior.tag, WjBarcodeUpcE0);
    }


    class WjBarcodeUpcE1Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-upc-e1';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'addOn', 
            'labelPosition', 
            'addOnHeight', 
            'addOnLabelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.UpcE1; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.UpcE1} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.UpcE1} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeUpcE1 = WjBarcodeUpcE1Behavior.register();
    function registerV3WjBarcodeUpcE1(app: any) {
        app.component(WjBarcodeUpcE1Behavior.tag, WjBarcodeUpcE1);
    }


    class WjBarcodeQrCodeBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-qr-code';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'charCode', 
            'charset', 
            'model', 
            'version', 
            'errorCorrectionLevel', 
            'mask', 
            'connection', 
            'connectionIndex'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.common.QrCode; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.common.QrCode} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.common.QrCode} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeQrCode = WjBarcodeQrCodeBehavior.register();
    function registerV3WjBarcodeQrCode(app: any) {
        app.component(WjBarcodeQrCodeBehavior.tag, WjBarcodeQrCode);
    }


    export function registerBarcodeCommon(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjBarcodeCodabar(app);
            registerV3WjBarcodeEan8(app);
            registerV3WjBarcodeEan13(app);
            registerV3WjBarcodeCode39(app);
            registerV3WjBarcodeCode128(app);
            registerV3WjBarcodeGs1_128(app);
            registerV3WjBarcodeUpcA(app);
            registerV3WjBarcodeUpcE0(app);
            registerV3WjBarcodeUpcE1(app);
            registerV3WjBarcodeQrCode(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjBarcodeGs1DataBarOmnidirectionalBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-omnidirectional';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarOmnidirectional; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarOmnidirectional} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarOmnidirectional} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarOmnidirectional = WjBarcodeGs1DataBarOmnidirectionalBehavior.register();
    function registerV3WjBarcodeGs1DataBarOmnidirectional(app: any) {
        app.component(WjBarcodeGs1DataBarOmnidirectionalBehavior.tag, WjBarcodeGs1DataBarOmnidirectional);
    }


    class WjBarcodeGs1DataBarTruncatedBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-truncated';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarTruncated; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarTruncated} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarTruncated} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarTruncated = WjBarcodeGs1DataBarTruncatedBehavior.register();
    function registerV3WjBarcodeGs1DataBarTruncated(app: any) {
        app.component(WjBarcodeGs1DataBarTruncatedBehavior.tag, WjBarcodeGs1DataBarTruncated);
    }


    class WjBarcodeGs1DataBarStackedBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-stacked';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText', 
            'ratio'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarStacked; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarStacked} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarStacked} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarStacked = WjBarcodeGs1DataBarStackedBehavior.register();
    function registerV3WjBarcodeGs1DataBarStacked(app: any) {
        app.component(WjBarcodeGs1DataBarStackedBehavior.tag, WjBarcodeGs1DataBarStacked);
    }


    class WjBarcodeGs1DataBarStackedOmnidirectionalBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-stacked-omnidirectional';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText', 
            'ratio'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarStackedOmnidirectional = WjBarcodeGs1DataBarStackedOmnidirectionalBehavior.register();
    function registerV3WjBarcodeGs1DataBarStackedOmnidirectional(app: any) {
        app.component(WjBarcodeGs1DataBarStackedOmnidirectionalBehavior.tag, WjBarcodeGs1DataBarStackedOmnidirectional);
    }


    class WjBarcodeGs1DataBarLimitedBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-limited';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarLimited; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarLimited} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarLimited} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarLimited = WjBarcodeGs1DataBarLimitedBehavior.register();
    function registerV3WjBarcodeGs1DataBarLimited(app: any) {
        app.component(WjBarcodeGs1DataBarLimitedBehavior.tag, WjBarcodeGs1DataBarLimited);
    }


    class WjBarcodeGs1DataBarExpandedBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-expanded';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText', 
            'autoWidth', 
            'autoWidthZoom'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarExpanded; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarExpanded} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarExpanded} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarExpanded = WjBarcodeGs1DataBarExpandedBehavior.register();
    function registerV3WjBarcodeGs1DataBarExpanded(app: any) {
        app.component(WjBarcodeGs1DataBarExpandedBehavior.tag, WjBarcodeGs1DataBarExpanded);
    }


    class WjBarcodeGs1DataBarExpandedStackedBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-gs1-data-bar-expanded-stacked';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition', 
            'linkage', 
            'linkageVersion', 
            'linkageHeight', 
            'hideLinkageText', 
            'hideAiText', 
            'autoWidth', 
            'autoWidthZoom', 
            'rowCount'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Gs1DataBarExpandedStacked; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Gs1DataBarExpandedStacked} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Gs1DataBarExpandedStacked} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeGs1DataBarExpandedStacked = WjBarcodeGs1DataBarExpandedStackedBehavior.register();
    function registerV3WjBarcodeGs1DataBarExpandedStacked(app: any) {
        app.component(WjBarcodeGs1DataBarExpandedStackedBehavior.tag, WjBarcodeGs1DataBarExpandedStacked);
    }


    class WjBarcodePdf417Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-pdf417';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'errorCorrectionLevel', 
            'columns', 
            'rows', 
            'compact'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.Pdf417; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.Pdf417} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.Pdf417} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodePdf417 = WjBarcodePdf417Behavior.register();
    function registerV3WjBarcodePdf417(app: any) {
        app.component(WjBarcodePdf417Behavior.tag, WjBarcodePdf417);
    }


    class WjBarcodeMicroPdf417Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-micro-pdf417';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'dimensions', 
            'compactionMode', 
            'structuredAppend', 
            'segmentIndex', 
            'fileId', 
            'optionalFields'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.composite.MicroPdf417; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.composite.MicroPdf417} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.composite.MicroPdf417} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeMicroPdf417 = WjBarcodeMicroPdf417Behavior.register();
    function registerV3WjBarcodeMicroPdf417(app: any) {
        app.component(WjBarcodeMicroPdf417Behavior.tag, WjBarcodeMicroPdf417);
    }


    export function registerBarcodeComposite(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjBarcodeGs1DataBarOmnidirectional(app);
            registerV3WjBarcodeGs1DataBarTruncated(app);
            registerV3WjBarcodeGs1DataBarStacked(app);
            registerV3WjBarcodeGs1DataBarStackedOmnidirectional(app);
            registerV3WjBarcodeGs1DataBarLimited(app);
            registerV3WjBarcodeGs1DataBarExpanded(app);
            registerV3WjBarcodeGs1DataBarExpandedStacked(app);
            registerV3WjBarcodePdf417(app);
            registerV3WjBarcodeMicroPdf417(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjBarcodeDataMatrixEcc000Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-data-matrix-ecc000';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'version', 
            'symbolSize'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.DataMatrixEcc000; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.DataMatrixEcc000} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.DataMatrixEcc000} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeDataMatrixEcc000 = WjBarcodeDataMatrixEcc000Behavior.register();
    function registerV3WjBarcodeDataMatrixEcc000(app: any) {
        app.component(WjBarcodeDataMatrixEcc000Behavior.tag, WjBarcodeDataMatrixEcc000);
    }


    class WjBarcodeDataMatrixEcc200Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-data-matrix-ecc200';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'symbolSize', 
            'encodingMode', 
            'structuredAppend', 
            'structureNumber', 
            'fileIdentifier'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.DataMatrixEcc200; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.DataMatrixEcc200} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.DataMatrixEcc200} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeDataMatrixEcc200 = WjBarcodeDataMatrixEcc200Behavior.register();
    function registerV3WjBarcodeDataMatrixEcc200(app: any) {
        app.component(WjBarcodeDataMatrixEcc200Behavior.tag, WjBarcodeDataMatrixEcc200);
    }


    class WjBarcodeCode49Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-code49';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'grouping', 
            'groupIndex', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.Code49; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.Code49} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Code49} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeCode49 = WjBarcodeCode49Behavior.register();
    function registerV3WjBarcodeCode49(app: any) {
        app.component(WjBarcodeCode49Behavior.tag, WjBarcodeCode49);
    }


    class WjBarcodeCode93Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-code93';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'checkDigit', 
            'fullAscii', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.Code93; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.Code93} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Code93} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeCode93 = WjBarcodeCode93Behavior.register();
    function registerV3WjBarcodeCode93(app: any) {
        app.component(WjBarcodeCode93Behavior.tag, WjBarcodeCode93);
    }


    class WjBarcodeItf14Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-itf14';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'nwRatio', 
            'bearerBar', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.Itf14; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.Itf14} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Itf14} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeItf14 = WjBarcodeItf14Behavior.register();
    function registerV3WjBarcodeItf14(app: any) {
        app.component(WjBarcodeItf14Behavior.tag, WjBarcodeItf14);
    }


    class WjBarcodeInterleaved2of5Behavior extends WjComponentBehavior {
        static tag = 'wj-barcode-interleaved2of5';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'autoWidth', 
            'autoWidthZoom', 
            'showLabel', 
            'nwRatio', 
            'bearerBar', 
            'labelPosition', 
            'checkCharacter'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.Interleaved2of5; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.Interleaved2of5} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.Interleaved2of5} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeInterleaved2of5 = WjBarcodeInterleaved2of5Behavior.register();
    function registerV3WjBarcodeInterleaved2of5(app: any) {
        app.component(WjBarcodeInterleaved2of5Behavior.tag, WjBarcodeInterleaved2of5);
    }


    class WjBarcodeJapanesePostalBehavior extends WjComponentBehavior {
        static tag = 'wj-barcode-japanese-postal';
        static props = [
            'isDisabled', 
            'value', 
            'quietZone', 
            'renderType', 
            'color', 
            'backgroundColor', 
            'hideExtraChecksum', 
            'font', 
            'showLabel', 
            'labelPosition'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'isValidChanged'
        ]
        static classCtor = function () { return wijmo.barcode.specialized.JapanesePostal; };                
    }
    /**
     * Vue component for the {@link wijmo.barcode.specialized.JapanesePostal} control.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.barcode.specialized.JapanesePostal} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjBarcodeJapanesePostal = WjBarcodeJapanesePostalBehavior.register();
    function registerV3WjBarcodeJapanesePostal(app: any) {
        app.component(WjBarcodeJapanesePostalBehavior.tag, WjBarcodeJapanesePostal);
    }


    export function registerBarcodeSpecialized(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjBarcodeDataMatrixEcc000(app);
            registerV3WjBarcodeDataMatrixEcc200(app);
            registerV3WjBarcodeCode49(app);
            registerV3WjBarcodeCode93(app);
            registerV3WjBarcodeItf14(app);
            registerV3WjBarcodeInterleaved2of5(app);
            registerV3WjBarcodeJapanesePostal(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    

    module wijmo.vue2 {
    













    class WjFlexMapBehavior extends WjComponentBehavior {
        static tag = 'wj-flex-map';
        static props = [
            'isDisabled', 
            'binding', 
            'footer', 
            'header', 
            'selectionMode', 
            'palette', 
            'plotMargin', 
            'footerStyle', 
            'headerStyle', 
            'tooltipContent', 
            'itemsSource', 
            'center', 
            'zoom'
        ]
        static events = [
            'initialized', 
            'gotFocus', 
            'lostFocus', 
            'refreshing', 
            'refreshed', 
            'invalidInput', 
            'rendering', 
            'rendered', 
            'selectionChanged', 
            'itemsSourceChanging', 
            'itemsSourceChanged'
        ]
        static classCtor = function () { return wijmo.chart.map.FlexMap; };
		

        protected _updateControl(property: string, newValue: any) {
            switch (property) {
                case 'tooltipContent':
                    this.control.tooltip.content = newValue;
                    break;
                default:
                    super._updateControl(property, newValue);
            }
        }
                
    }
    /**
     * Vue component for the {@link wijmo.chart.map.FlexMap} control.
     * 
     * The <b>wj-flex-map</b> component may contain
     * the following child components: 
     * {@link wijmo.vue2.chart.WjFlexChartLegend}
     * , {@link wijmo.vue2.chart.map.WjScatterMapLayer}
     * , {@link wijmo.vue2.chart.map.WjGeoMapLayer}
     * and {@link wijmo.vue2.chart.map.WjGeoGridLayer}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.FlexMap} control it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjFlexMap = WjFlexMapBehavior.register();
    function registerV3WjFlexMap(app: any) {
        app.component(WjFlexMapBehavior.tag, WjFlexMap);
    }


    class WjScatterMapLayerBehavior extends WjComponentBehavior {
        static tag = 'wj-scatter-map-layer';
        static parentProp = 'layers';
        static siblingId = 'layers';
        static props = [
            'wjProperty',
            'itemsSource', 
            'url', 
            'symbolSize', 
            'symbolMinSize', 
            'symbolMaxSize', 
            'binding'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'itemsSourceChanged': ['itemsSource'],
        }
        static classCtor = function () { return wijmo.chart.map.ScatterMapLayer; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.map.ScatterMapLayer} class.
     * 
     * The <b>wj-scatter-map-layer</b> component should be contained in
     * a {@link wijmo.vue2.chart.map.WjFlexMap} component.
     * 
     * The <b>wj-scatter-map-layer</b> component may contain
     * a {@link wijmo.vue2.chart.map.WjColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.ScatterMapLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjScatterMapLayer = WjScatterMapLayerBehavior.register();
    function registerV3WjScatterMapLayer(app: any) {
        app.component(WjScatterMapLayerBehavior.tag, WjScatterMapLayer);
    }


    class WjGeoMapLayerBehavior extends WjComponentBehavior {
        static tag = 'wj-geo-map-layer';
        static parentProp = 'layers';
        static siblingId = 'layers';
        static props = [
            'wjProperty',
            'itemsSource', 
            'url', 
            'itemFormatter'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'itemsSourceChanged': ['itemsSource'],
        }
        static classCtor = function () { return wijmo.chart.map.GeoMapLayer; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.map.GeoMapLayer} class.
     * 
     * The <b>wj-geo-map-layer</b> component should be contained in
     * a {@link wijmo.vue2.chart.map.WjFlexMap} component.
     * 
     * The <b>wj-geo-map-layer</b> component may contain
     * a {@link wijmo.vue2.chart.map.WjColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.GeoMapLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjGeoMapLayer = WjGeoMapLayerBehavior.register();
    function registerV3WjGeoMapLayer(app: any) {
        app.component(WjGeoMapLayerBehavior.tag, WjGeoMapLayer);
    }


    class WjGeoGridLayerBehavior extends WjComponentBehavior {
        static tag = 'wj-geo-grid-layer';
        static parentProp = 'layers';
        static siblingId = 'layers';
        static props = [
            'wjProperty',
            'itemsSource', 
            'url'
        ]
        static events = [
            'initialized'
        ]
        static changeEvents = {
            'itemsSourceChanged': ['itemsSource'],
        }
        static classCtor = function () { return wijmo.chart.map.GeoGridLayer; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.map.GeoGridLayer} class.
     * 
     * The <b>wj-geo-grid-layer</b> component should be contained in
     * a {@link wijmo.vue2.chart.map.WjFlexMap} component.
     * 
     * The <b>wj-geo-grid-layer</b> component may contain
     * a {@link wijmo.vue2.chart.map.WjColorScale} child component.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.GeoGridLayer} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjGeoGridLayer = WjGeoGridLayerBehavior.register();
    function registerV3WjGeoGridLayer(app: any) {
        app.component(WjGeoGridLayerBehavior.tag, WjGeoGridLayer);
    }


    class WjColorScaleBehavior extends WjComponentBehavior {
        static tag = 'wj-color-scale';
        static parentProp = 'colorScale';
        static props = [
            'wjProperty',
            'scale', 
            'binding', 
            'colorUnknown', 
            'colors', 
            'format'
        ]
        static events = [
            'initialized'
        ]
        static classCtor = function () { return wijmo.chart.map.ColorScale; };                
    }
    /**
     * Vue component for the {@link wijmo.chart.map.ColorScale} class.
     * 
     * The <b>wj-color-scale</b> component should be contained in
     * one of the following components: 
     * {@link wijmo.vue2.chart.map.WjScatterMapLayer}
     * , {@link wijmo.vue2.chart.map.WjGeoMapLayer}
     *  or {@link wijmo.vue2.chart.map.WjGeoGridLayer}.
     * 
     * The component supports all properties and events of the pure JavaScript {@link wijmo.chart.map.ColorScale} class it represents.
     * 
     * The component includes an <b>initialized</b> event that is raised when the control is initialized after it is added to the page.
     * You can use this event to perform further initialization in addition to setting properties in markup.
     * The signature of the handler function is the same as any other Wijmo event handlers.
     */
    export var WjColorScale = WjColorScaleBehavior.register();
    function registerV3WjColorScale(app: any) {
        app.component(WjColorScaleBehavior.tag, WjColorScale);
    }


    export function registerChartMap(app: any) {
        if (VueApi.isV3Plus) { 
            registerV3WjFlexMap(app);
            registerV3WjScatterMapLayer(app);
            registerV3WjGeoMapLayer(app);
            registerV3WjGeoGridLayer(app);
            registerV3WjColorScale(app);
         }
    }

    }
    


    module wijmo.vue2 {
    

    }
    