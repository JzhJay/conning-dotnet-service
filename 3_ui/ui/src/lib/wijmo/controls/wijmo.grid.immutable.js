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
    (function (grid_1) {
        var immutable;
        (function (immutable) {
            /**
             * Provides data for the {@link ImmutabilityProvider.dataChanged} event.
             */
            var DataChangeEventArgs = /** @class */ (function (_super) {
                __extends(DataChangeEventArgs, _super);
                /**
                 * Initializes a new instance of the {@link DataChangeEventArgs} class.
                 * @param action Type of action that caused the event to fire.
                 * @param oldItem Original item that was removed or changed.
                 * @param newItem New item that was added or changed.
                 * @param itemIndex Index of the item.
                 */
                function DataChangeEventArgs(action, oldItem, newItem, itemIndex) {
                    var _this = _super.call(this) || this;
                    _this.action = action;
                    _this.oldItem = oldItem;
                    _this.newItem = newItem;
                    _this.itemIndex = itemIndex;
                    return _this;
                }
                return DataChangeEventArgs;
            }(wijmo.EventArgs));
            immutable.DataChangeEventArgs = DataChangeEventArgs;
            /**
             * Describes the action that caused the {@link ImmutabilityProvider.dataChanged}
             * event to fire.
             */
            var DataChangeAction;
            (function (DataChangeAction) {
                /** An item was added to the collection. */
                DataChangeAction[DataChangeAction["Add"] = 0] = "Add";
                /** An item was removed from the collection. */
                DataChangeAction[DataChangeAction["Remove"] = 1] = "Remove";
                /** Item properties was changed. */
                DataChangeAction[DataChangeAction["Change"] = 2] = "Change";
            })(DataChangeAction = immutable.DataChangeAction || (immutable.DataChangeAction = {}));
            /**
             * Provides data for the {@link ImmutabilityProvider.cloningItem} event.
             */
            var CloningItemEventArgs = /** @class */ (function (_super) {
                __extends(CloningItemEventArgs, _super);
                /**
                 * Initializes a new instance of the {@link CloningItemEventArgs} class.
                 * @param originalItem The original item which is about to be cloned by the grid.
                 */
                function CloningItemEventArgs(originalItem) {
                    var _this = _super.call(this) || this;
                    _this._originalItem = originalItem;
                    return _this;
                }
                Object.defineProperty(CloningItemEventArgs.prototype, "originalItem", {
                    /**
                     * The original item which is about to be cloned by the grid.
                     */
                    get: function () {
                        return this._originalItem;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CloningItemEventArgs;
            }(wijmo.EventArgs));
            immutable.CloningItemEventArgs = CloningItemEventArgs;
            /**
             * The **ImmutabilityProvider** object,
             * being attached to a {@link wijmo.grid.FlexGrid} control,
             * allows the latter to perform data edits without mutating the underlying
             * data. Instead, this class provides a data change event, which can be used to dispatch
             * change actions to the global _Store_, such as a
             * <a href="https://redux.js.org/" target="_blank">Redux</a> _Store_.
             *
             * In framework interops, this class is usually represented by a framework specific
             * component, like a {@link wijmo.react.grid.immutable.ImmutabilityProvider} component
             * for <a href="https://reactjs.org/" target="_blank">React</a>,
             * which is more convenient to use in the context of the framework.
             *
             * The controlled **FlexGrid** control should not specify its **itemsSource**. Instead, the
             * **itemsSource** property of this class instance should be assigned with the
             * immutable array from the _Store_, which grid will display and edit.
             *
             * When a user edits data via the datagrid,
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
             * the {@link ImmutabilityProvider.dataChanged} event
             * multiple times, separately for each affected row. This simplifies data change processing
             * in the _Store_ reducers.
             *
             * This example demonstrates a fully editable **FlexGrid** component, with an associated
             * **ImmutabilityProvider** component bound to an array from the _Redux Store_. The dataChanged
             * event handler dispatches corresponding data change actions to the _Store_.
             * ```typescript
             *   import { ImmutabilityProvider, DataChangeEventArgs, DataChangeAction } from '@grapecity/wijmo.grid.immutable';
             *   import { FlexGrid } from '@grapecity/wijmo.grid';
             *   import { store } from './store';
             *   import { addItemAction, removeItemAction, changeItemAction } from './actions';
             *
             *   const grid = new FlexGrid('#grid', {
             *       allowAddNew: true,
             *       allowDelete: true
             *   });
             *   const provider = new ImmutabilityProvider(grid, {
             *       itemsSource: store.getState().items,
             *       dataChanged: (s: ImmutabilityProvider, e: DataChangeEventArgs) => {
             *          switch (e.action) {
             *               case DataChangeAction.Add:
             *                   store.dispatch(addItemAction(e.newItem));
             *                 break;
             *               case DataChangeAction.Remove:
             *                   store.dispatch(removeItemAction(e.newItem, e.itemIndex));
             *                   break;
             *             case DataChangeAction.Change:
             *                   store.dispatch(changeItemAction(e.newItem, e.itemIndex));
             *                   break;
             *          }
             *       }
             *   });
             *   store.subscribe(() => {
             *       provider.itemsSource = store.getState().items;
             *   })
             * ```
             */
            var ImmutabilityProvider = /** @class */ (function () {
                //end of change state
                /**
                 * Creates an instance of the ImmutabilityProvider attached to the specified FlexGrid
                 * control.
                 * @param grid {@link FlexGrid} control to attach to.
                 * @param options Initialization options for the ImmutabilityProvider instance.
                 */
                function ImmutabilityProvider(grid, options) {
                    //change state
                    this._isAddNew = false;
                    this._isPasting = false;
                    /**
                     * Triggered after a user has added, removed or changed a data item in the
                     * controlled FlexGrid instance.
                     * Can be used to dispatch a corresponding data change action to the _Store_.
                     */
                    this.dataChanged = new wijmo.Event();
                    /**
                     * Triggered when {@link FlexGrid} needs to create a clone of an item which is
                     * about to be changed.
                     *
                     * This event allows you to provide a custom logic for cloning items.
                     * The cloned item should be assigned to the {@link CloningItemEventArgs.clonedItem}
                     * property of the event arguments.
                     */
                    this.cloningItem = new wijmo.Event();
                    wijmo.assert(grid instanceof wijmo.grid.FlexGrid, 'FlexGrid component is not specified.');
                    this._grid = grid;
                    var cv = this._cv = new wijmo.collections.CollectionView([]);
                    grid.itemsSource = cv;
                    grid.rowAdded.addHandler(this._gridRowAdded, this);
                    grid.deletingRow.addHandler(this._gridDeletingRow, this);
                    grid.deletedRow.addHandler(this._gridDeletedRow, this);
                    grid.beginningEdit.addHandler(this._gridBeginningEdit, this);
                    grid.rowEditEnded.addHandler(this._gridRowEditEnded, this);
                    grid.pasting.addHandler(this._gridPasting, this);
                    grid.pasted.addHandler(this._gridPasted, this);
                    // apply options
                    wijmo.copy(this, options);
                }
                ImmutabilityProvider.prototype._clearChg = function () {
                    this._isAddNew = this._isPasting = false;
                    this._chg = this._iChg = null;
                };
                Object.defineProperty(ImmutabilityProvider.prototype, "grid", {
                    /**
                     * Gets a {@link FlexGrid} instance controlled by the ImmutabilityProvider.
                     */
                    get: function () {
                        return this._grid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ImmutabilityProvider.prototype, "collectionView", {
                    /**
                     * Gets a {@link CollectionView} object internally maintained by the ImmutabilityProvider.
                     * You *can not* change data in this CollectionView, instead any data changes must be
                     * dispatched to the _Store_.
                     * But you can change its sort/group/filter settings, use currency
                     * and data change events.
                     */
                    get: function () {
                        return this._cv;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ImmutabilityProvider.prototype, "itemsSource", {
                    /**
                     * Gets or sets a source data array that should be displayed in the controlled
                     * FlexGrid. The **FlexGrid.itemsSource** property **should not** be assigned.
                     * Every time a new version of the source array appears in the _Store_, this
                     * property must be re-assigned with this new array instance. This can be done, for example,
                     * in the handler function for the _Store_ change event.
                     */
                    get: function () {
                        return this._items;
                    },
                    set: function (value) {
                        //TBD: consider to allow value to be a CollectionView too
                        wijmo.assert(value == null || wijmo.isArray(value), 'Not an array');
                        if (value !== this._items) {
                            this._items = value;
                            var cv = this._cv, itemsArr = cv.sourceCollection, curIdx = cv.currentPosition, curItem = cv.currentItem;
                            // To keep currency/sorting/grouping/etc, replace items in the existing cv.sourceCollection
                            //replace items in the CV's source array
                            this._replaceItems(itemsArr, value);
                            // and refresh CV
                            cv.refresh();
                            //TBD: patch
                            if (curIdx === cv.currentPosition && curItem !== cv.currentItem) {
                                var e = new wijmo.CancelEventArgs();
                                cv.onCurrentChanging(e);
                                cv.onCurrentChanged(e);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the {@link dataChanged} event.
                 * @param e {@link DataChangeEventArgs} that contains the event data.
                 */
                ImmutabilityProvider.prototype.onDataChanged = function (e) {
                    this.dataChanged.raise(this, e);
                };
                /**
                 * Raises the {@link cloningItem} event.
                 * @param e {@link CloningItemEventArgs} that contains the event data.
                 */
                ImmutabilityProvider.prototype.onCloningItem = function (e) {
                    this.cloningItem.raise(this, e);
                };
                ImmutabilityProvider.prototype._gridRowAdded = function (s, e) {
                    //console.log(`_gridRowAdded, cancel=${e.cancel}`);
                    if (!this._isPasting) {
                        this._isAddNew = true;
                    }
                };
                ImmutabilityProvider.prototype._gridDeletingRow = function (s, e) {
                    //console.log(`_gridDeletingRow, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    if (this._isAddNew) {
                        return;
                    }
                    var row = e.getRow(), oldItem = row.dataItem, index = this._dataIndex(row);
                    this._cv.sourceCollection.indexOf(oldItem);
                    if (index > -1) {
                        this._iChg = {
                            oldItem: oldItem,
                            index: index
                        };
                    }
                };
                ImmutabilityProvider.prototype._gridDeletedRow = function (s, e) {
                    //console.log(`_gridDeletedRow, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    var iChg = this._iChg, isAddNew = this._isAddNew;
                    if (!iChg) {
                        return;
                    }
                    this._clearChg();
                    if (isAddNew) {
                        return;
                    }
                    this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Remove, iChg.oldItem, null, iChg.index));
                };
                ImmutabilityProvider.prototype._gridBeginningEdit = function (s, e) {
                    //console.log(`_gridBeginningEdit, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    if (this._isAddNew) {
                        return;
                    }
                    var row = e.getRow(), oldItem = row.dataItem, index = this._cv.sourceCollection.indexOf(oldItem), chg = this._chg;
                    // if item editing was already started before
                    if (chg) {
                        if (chg.changedItems[index]) {
                            return;
                        }
                    }
                    else {
                        chg = this._chg = { changedItems: {} };
                    }
                    // clone and settle the item
                    this._addItemChange(row.index, index);
                };
                ImmutabilityProvider.prototype._gridRowEditEnded = function (s, e) {
                    if (!this._isPasting) {
                        this._doRowEditEnded(s, e);
                    }
                };
                ImmutabilityProvider.prototype._doRowEditEnded = function (s, e) {
                    //console.log(`_gridRowEditEnded, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    var isAddNew = this._isAddNew, chg = this._chg;
                    this._clearChg();
                    if (isAddNew) {
                        if (!e.cancel) {
                            var itemsArr = this._cv.sourceCollection, newItemIdx = itemsArr.length - 1, newItem = itemsArr[newItemIdx];
                            // TBD: this doesn't work, when grid sorted or grouped,
                            // it returns a wrong row (row index is one less than should be).
                            //newItem = e.getRow().dataItem;
                            this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Add, null, newItem, itemsArr.length - 1));
                        }
                    }
                    else {
                        if (chg) {
                            if (e.cancel) {
                                // restore replaced items 
                                var row = e.getRow();
                                if (this._swapBatchedItems(row, chg.changedItems) > 1) {
                                    this._cv.refresh();
                                }
                            }
                            else {
                                var batch = chg.changedItems;
                                for (var idx in batch) {
                                    var iChg = batch[idx];
                                    this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Change, iChg.oldItem, iChg.newItem, iChg.index));
                                }
                            }
                        }
                    }
                };
                ImmutabilityProvider.prototype._gridPasting = function (s, e) {
                    //console.log(`_gridPasting, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    this._isPasting = true;
                    var rowSpan = e.range.rowSpan;
                    if (this._chg && rowSpan !== 1) {
                        //TBD: smarter processing
                        e.cancel = true;
                        return;
                    }
                    if (rowSpan === 1) {
                        this._isPasting = false;
                        if (e.getRow() instanceof wijmo.grid._NewRowTemplate) {
                            //this._isPasting = false;
                            // process as rowAdded, which will be triggered after this pasting event
                        }
                        else {
                            // process as rowEdit
                            this._gridBeginningEdit(s, e);
                        }
                        return;
                    }
                    var rows = this._grid.rows, top = e.range.topRow, bottom = e.range.bottomRow, bottomChanged = Math.min(rows.length - 1, bottom), itemArr = this._cv.sourceCollection;
                    this._chg = {
                        changedItems: {},
                        cvLength: itemArr.length
                    };
                    // process changed existing items
                    for (var i = top; i <= bottomChanged; i++) {
                        var index = this._dataIndex(rows[i]);
                        if (index > -1) {
                            this._addItemChange(i, index);
                        }
                    }
                };
                ImmutabilityProvider.prototype._gridPasted = function (s, e) {
                    //console.log(`_gridPasted, cancel=${e.cancel}, range = ${e.range.toString()}`);
                    var chg = this._chg;
                    if (!chg || e.range.rowSpan === 1) {
                        return;
                    }
                    var itemsArr = this._cv.sourceCollection, cvLength = chg.cvLength, addedItems = itemsArr.slice(cvLength, itemsArr.length);
                    // this._gridRowEditEnded(s, e);
                    this._doRowEditEnded(s, e);
                    for (var i = 0; i < addedItems.length; i++) {
                        this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Add, null, addedItems[i], cvLength + i));
                    }
                };
                /**
                 * Replaces item in the Row and CV arrays with the new item.
                 * Returns an index of the item in the CV.sourceCollection array.
                 */
                ImmutabilityProvider.prototype._swapItem = function (newRow, oldRow, newItem, oldItem) {
                    var row = newRow;
                    if (!row || row.dataItem !== oldItem) {
                        // find row if it's unknown
                        this._grid.rows.some(function (v) { return (v.dataItem === oldItem) && !!(row = v); });
                    }
                    var cv = this._cv, 
                    //oldItem = row.dataItem,
                    index = cv.sourceCollection.indexOf(oldItem), cvIndex = cv.items.indexOf(oldItem);
                    oldRow.dataItem = newItem;
                    if (row) {
                        row.dataItem = newItem;
                    }
                    cv.sourceCollection[index] = newItem;
                    cv.items[cvIndex] = newItem;
                    //console.log(`_swapItem, row = ${row.index}`)
                    return index;
                };
                ImmutabilityProvider.prototype._swapBatchedItems = function (masterRow, batch) {
                    var indices = Object.keys(batch), count = indices.length;
                    if (count > 1) {
                        masterRow = null;
                    }
                    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                        var idx = indices_1[_i];
                        var chg = batch[idx];
                        this._swapItem(masterRow, chg.row, chg.oldItem, chg.newItem);
                    }
                    return count;
                };
                ImmutabilityProvider.prototype._addItemChange = function (rowIdx, index) {
                    // clone and settle the item
                    var row = this._grid.rows[rowIdx], oldItem = row.dataItem, 
                    //newItem = copyObject({}, oldItem);
                    newItem = this._cloneItem(oldItem);
                    if (index == null) {
                        index = this._cv.sourceCollection.indexOf(oldItem);
                    }
                    this._chg.changedItems[index] = {
                        row: row,
                        oldItem: oldItem,
                        newItem: newItem,
                        index: index
                    };
                    this._swapItem(row, row, newItem, oldItem);
                };
                /**
                 * Checks if the row is a data row, and returns its dataItem index in the
                 * CV.sourceCollection. -1 if not a data row due to any reason.
                 */
                ImmutabilityProvider.prototype._dataIndex = function (row) {
                    var dataItem = row.dataItem;
                    if (dataItem && !(row instanceof wijmo.grid.GroupRow ||
                        row instanceof wijmo.grid._NewRowTemplate)) {
                        return this._cv.sourceCollection.indexOf(dataItem);
                    }
                    return -1;
                };
                /**
                 * Removes all items from the target array, and adds items into it from the source array.
                 * Returns the target array.
                */
                ImmutabilityProvider.prototype._replaceItems = function (targArr, srcArr) {
                    targArr.splice(0, targArr.length);
                    // Use (t.length=s.lenfth; t[i]=s[i]) combination instead of push,
                    // it's faster in average on big data.
                    var length = targArr.length = srcArr.length;
                    for (var i = 0; i < length; i++) {
                        targArr[i] = srcArr[i];
                    }
                    return targArr;
                };
                // Clones the specified item to use by grid for editing. Takes into account all
                // settings like cloningItem event results, bindings to nested properties, etc.
                ImmutabilityProvider.prototype._cloneItem = function (item) {
                    var args = new CloningItemEventArgs(item);
                    this.onCloningItem(args);
                    var clonedItem = args.clonedItem;
                    if (clonedItem == null) {
                        clonedItem = this._cloneBindings(item);
                    }
                    return clonedItem;
                };
                // Clones the specified items with a minimal depth necessary to provide data immutability
                // for the possible column bindings to the nested properties (like item.prop[0].nested).
                ImmutabilityProvider.prototype._cloneBindings = function (item) {
                    var ret = copyObject({}, item), propsTree = {}, columns = this.grid.columns;
                    // create a minimal property tree for deep clone
                    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        var col = columns_1[_i];
                        var bnd = col._binding, parts = bnd && bnd._parts;
                        if (parts && parts.length > 1) {
                            var maxIdx = parts.length - 2, curLevel = propsTree;
                            for (var i = 0; i <= maxIdx; i++) {
                                var prop = parts[i];
                                if (!curLevel[prop]) {
                                    curLevel[prop] = {};
                                }
                                curLevel = curLevel[prop];
                            }
                        }
                    }
                    // deep clone property tree
                    this._cloneProps(ret, propsTree);
                    return ret;
                };
                // In the 'obj' object, replaces all props specified in the propHash object, with its
                // clones. If propHash[prop] contains subobject with props, then does it recursively.
                ImmutabilityProvider.prototype._cloneProps = function (obj, propHash) {
                    for (var prop in propHash) {
                        var propVal = obj[prop];
                        if (propVal != null) {
                            if (wijmo.isArray(propVal)) {
                                var clonedProp = obj[prop] = [].concat(propVal);
                                this._cloneProps(clonedProp, propHash[prop]);
                            }
                            else if (wijmo.isObject(propVal)) {
                                var clonedProp = obj[prop] = copyObject({}, propVal);
                                this._cloneProps(clonedProp, propHash[prop]);
                            }
                        }
                    }
                };
                return ImmutabilityProvider;
            }());
            immutable.ImmutabilityProvider = ImmutabilityProvider;
            /**
             * Performs shallow copying of properties of one or more source objects into the target object.
             * Can be used to clone objects in the _Store_ reducers.
             * @param target The object to copy properties to.
             * @param src One or more source objects whose properties must be copied to the target object.
             */
            function copyObject(target) {
                var src = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    src[_i - 1] = arguments[_i];
                }
                // TBD: should work in IE
                //return Object.assign(target, ...src);
                return _copyImpl.apply(void 0, [target].concat(src));
            }
            immutable.copyObject = copyObject;
            var _copyImpl = typeof Object.assign === 'function' ? Object.assign :
                function (target) {
                    var src = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        src[_i - 1] = arguments[_i];
                    }
                    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
                        var curSrc = src_1[_a];
                        if (curSrc != null) {
                            for (var prop in curSrc) {
                                // TBD: should traverse up to prototypes
                                var pd = Object.getOwnPropertyDescriptor(target, prop);
                                if (!pd || pd.writable) {
                                    target[prop] = curSrc[prop];
                                }
                            }
                        }
                    }
                    return target;
                };
        })(immutable = grid_1.immutable || (grid_1.immutable = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var immutable;
        (function (immutable) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.immutable', wijmo.grid.immutable);
        })(immutable = grid.immutable || (grid.immutable = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.immutable.js.map