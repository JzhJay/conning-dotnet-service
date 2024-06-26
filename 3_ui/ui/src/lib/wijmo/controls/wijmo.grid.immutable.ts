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


    module wijmo.grid.immutable {
    




/**
 * Provides data for the {@link ImmutabilityProvider.dataChanged} event.
 */
export class DataChangeEventArgs extends wijmo.EventArgs {
    /**
     * Initializes a new instance of the {@link DataChangeEventArgs} class.
     * @param action Type of action that caused the event to fire.
     * @param oldItem Original item that was removed or changed.
     * @param newItem New item that was added or changed.
     * @param itemIndex Index of the item.
     */
    constructor(
        action: DataChangeAction,
        oldItem: any,
        newItem: any,
        itemIndex: any
    ) {
        super();
        this.action = action;
        this.oldItem = oldItem;
        this.newItem = newItem;
        this.itemIndex = itemIndex;
    }

    /**
     * Gets the action that caused the event to fire.
     */
    public readonly action: DataChangeAction;
    /**
     * Gets an existing item affected by the change, depending on the 
     * {@link action}:
     * * Remove: the removed item from the {@link ImmutabilityProvider.itemsSource} array.
     * * Add: a null value.
     * * Change: the original item from the {@link ImmutabilityProvider.itemsSource} array
     *   (not modified, the cloned item with the modifications is in the 
     *   {@link newItem} property).
     */
    public readonly oldItem: any;
    /**
     * Gets an item with changes, depending on the 
     * {@link action}:
     * * Remove: a null value.
     * * Add: the new added item
     * * Change: the cloned item with modifications
     */
    public readonly newItem: any;
    /**
     * Gets an index of the item affected by the change in the 
     * {@link ImmutabilityProvider.itemsSource} array, depending on the 
     * {@link action}:
     * * Remove: the removed item index
     * * Add: the added item index
     * * Change: the changed item index
     */
    public readonly itemIndex: any;

}

/**
 * Describes the action that caused the {@link ImmutabilityProvider.dataChanged}
 * event to fire.
 */
export enum DataChangeAction {
    /** An item was added to the collection. */
    Add,
    /** An item was removed from the collection. */
    Remove,
    /** Item properties was changed. */
    Change
}

/**
 * Provides data for the {@link ImmutabilityProvider.cloningItem} event.
 */
export class CloningItemEventArgs extends wijmo.EventArgs {
    private readonly _originalItem: any;

    /**
     * This property should be assigned by an event handler with an object representing
     * a clone of the {@link originalItem}.
     * If not assigned then {@link ImmutabilityProvider} will clone item using its
     * default algorithm.
     */
    clonedItem: any;

    /**
     * Initializes a new instance of the {@link CloningItemEventArgs} class.
     * @param originalItem The original item which is about to be cloned by the grid.
     */
    constructor(originalItem: any) {
        super();
        this._originalItem = originalItem;
    }

    /**
     * The original item which is about to be cloned by the grid.
     */
    get originalItem(): any {
        return this._originalItem;
    }
}

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
export class ImmutabilityProvider { 
    private readonly _grid: wijmo.grid.FlexGrid;
    private _items: any;
    private readonly _cv: wijmo.collections.CollectionView;

    //change state
    private _isAddNew = false;
    private _isPasting = false;
    private _chg: _IChangeData;
    private _iChg: _IChangeDataItem;
    private _clearChg() {
        this._isAddNew = this._isPasting = false;
        this._chg = this._iChg = null;
    }
    //end of change state

    /**
     * Creates an instance of the ImmutabilityProvider attached to the specified FlexGrid
     * control.
     * @param grid {@link FlexGrid} control to attach to.
     * @param options Initialization options for the ImmutabilityProvider instance.
     */
    constructor(grid: wijmo.grid.FlexGrid, options?: any) {
        wijmo.assert(grid instanceof wijmo.grid.FlexGrid, 'FlexGrid component is not specified.');
        this._grid = grid;
        let cv = this._cv = new wijmo.collections.CollectionView([]);
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

    /**
     * Gets a {@link FlexGrid} instance controlled by the ImmutabilityProvider.
     */
    get grid(): wijmo.grid.FlexGrid {
        return this._grid;
    }

    /**
     * Gets a {@link CollectionView} object internally maintained by the ImmutabilityProvider.
     * You *can not* change data in this CollectionView, instead any data changes must be
     * dispatched to the _Store_.
     * But you can change its sort/group/filter settings, use currency 
     * and data change events.
     */
    get collectionView(): wijmo.collections.CollectionView {
        return this._cv;
    }

    /**
     * Gets or sets a source data array that should be displayed in the controlled
     * FlexGrid. The **FlexGrid.itemsSource** property **should not** be assigned.
     * Every time a new version of the source array appears in the _Store_, this
     * property must be re-assigned with this new array instance. This can be done, for example,
     * in the handler function for the _Store_ change event.
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        //TBD: consider to allow value to be a CollectionView too
        wijmo.assert(value == null || wijmo.isArray(value), 'Not an array');
        if (value !== this._items) {
            this._items = value;
            let cv = this._cv,
                itemsArr = <any[]>cv.sourceCollection,
                curIdx = cv.currentPosition,
                curItem = cv.currentItem;
            // To keep currency/sorting/grouping/etc, replace items in the existing cv.sourceCollection
            //replace items in the CV's source array
            this._replaceItems(itemsArr, <any[]>value);
            // and refresh CV
            cv.refresh();
            //TBD: patch
            if (curIdx === cv.currentPosition && curItem !== cv.currentItem) {
                let e = new wijmo.CancelEventArgs();
                cv.onCurrentChanging(e);
                cv.onCurrentChanged(e);
            }
        }
    }

    /**
     * Triggered after a user has added, removed or changed a data item in the
     * controlled FlexGrid instance. 
     * Can be used to dispatch a corresponding data change action to the _Store_.
     */
    readonly dataChanged = new wijmo.Event<wijmo.grid.FlexGrid, DataChangeEventArgs>();
    /**
     * Raises the {@link dataChanged} event.
     * @param e {@link DataChangeEventArgs} that contains the event data.
     */
    onDataChanged(e: DataChangeEventArgs): void {
        this.dataChanged.raise(this, e);
    }

    /**
     * Triggered when {@link FlexGrid} needs to create a clone of an item which is
     * about to be changed. 
     * 
     * This event allows you to provide a custom logic for cloning items. 
     * The cloned item should be assigned to the {@link CloningItemEventArgs.clonedItem}
     * property of the event arguments.
     */
    readonly cloningItem = new wijmo.Event<wijmo.grid.FlexGrid, CloningItemEventArgs>();
    /**
     * Raises the {@link cloningItem} event.
     * @param e {@link CloningItemEventArgs} that contains the event data.
     */
    onCloningItem(e: CloningItemEventArgs): void {
        this.cloningItem.raise(this, e);
    }

    private _gridRowAdded(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridRowAdded, cancel=${e.cancel}`);
        if (!this._isPasting) {
            this._isAddNew = true;
        }
    }

    private _gridDeletingRow(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridDeletingRow, cancel=${e.cancel}, range = ${e.range.toString()}`);
        if (this._isAddNew) {
            return;
        }
        let row = e.getRow(),
            oldItem = row.dataItem,
            index = this._dataIndex(row);
            this._cv.sourceCollection.indexOf(oldItem);
        if (index > -1) {
            this._iChg = {
                oldItem,
                index
            }
        }
    }
    private _gridDeletedRow(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridDeletedRow, cancel=${e.cancel}, range = ${e.range.toString()}`);
        let iChg = this._iChg,
            isAddNew = this._isAddNew;
        if (!iChg) {
            return;
        }
        this._clearChg();
        if (isAddNew) {
            return;
        }
        this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Remove, iChg.oldItem, 
            null, iChg.index));
    }

    private _gridBeginningEdit(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridBeginningEdit, cancel=${e.cancel}, range = ${e.range.toString()}`);
        if (this._isAddNew) {
            return;
        }
        let row = e.getRow(),
            oldItem = row.dataItem,
            index = this._cv.sourceCollection.indexOf(oldItem),
            chg = this._chg;
        // if item editing was already started before
        if (chg) {
            if (chg.changedItems[index]) {
                return;
            }
        } else {
            chg = this._chg = { changedItems: {} };
        }

        // clone and settle the item
        this._addItemChange(row.index, index);
    }

    private _gridRowEditEnded(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        if (!this._isPasting) {
            this._doRowEditEnded(s, e);
        }
    }
    private _doRowEditEnded(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridRowEditEnded, cancel=${e.cancel}, range = ${e.range.toString()}`);
        let isAddNew = this._isAddNew,
            chg = this._chg;
        this._clearChg();

        if (isAddNew) {
            if (!e.cancel) {
                let itemsArr = <any[]>this._cv.sourceCollection,
                    newItemIdx = itemsArr.length - 1,
                    newItem = itemsArr[newItemIdx];
                    // TBD: this doesn't work, when grid sorted or grouped,
                    // it returns a wrong row (row index is one less than should be).
                    //newItem = e.getRow().dataItem;
                this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Add, null, 
                    newItem, itemsArr.length - 1));
            }
        } else {
            if (chg) {
                if (e.cancel) {
                    // restore replaced items 
                    let row = e.getRow();
                    if (this._swapBatchedItems(row, chg.changedItems) > 1) {
                        this._cv.refresh();
                    }
                } else {
                    let batch = chg.changedItems;
                    for (let idx in batch) {
                        let iChg = batch[idx];
                        this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Change, 
                            iChg.oldItem, iChg.newItem, iChg.index));
                    }
                }
            }
        }
    }

    private _gridPasting(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridPasting, cancel=${e.cancel}, range = ${e.range.toString()}`);
        this._isPasting = true;
        let rowSpan = e.range.rowSpan;
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
            } else {
                // process as rowEdit
                this._gridBeginningEdit(s, e);
            }
            return;
        }
        let rows = this._grid.rows,
            top = e.range.topRow,
            bottom = e.range.bottomRow,
            bottomChanged = Math.min(rows.length - 1, bottom),
            itemArr = this._cv.sourceCollection;
        this._chg = {
            changedItems: {},
            cvLength: itemArr.length
        }
        // process changed existing items
        for (let i = top; i <= bottomChanged; i++) {
            let index = this._dataIndex(rows[i]);
            if (index > -1) {
                this._addItemChange(i, index);
            }
        }
    }

    private _gridPasted(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        //console.log(`_gridPasted, cancel=${e.cancel}, range = ${e.range.toString()}`);
        let chg = this._chg;
        if (!chg || e.range.rowSpan === 1) {
            return;
        }
        let itemsArr = <any[]>this._cv.sourceCollection,
            cvLength = chg.cvLength,
            addedItems = itemsArr.slice(cvLength, itemsArr.length);
        // this._gridRowEditEnded(s, e);
        this._doRowEditEnded(s, e);
        for (let i = 0; i < addedItems.length; i++) {
            this.onDataChanged(new DataChangeEventArgs(DataChangeAction.Add, null, 
                addedItems[i], cvLength + i));
        }
    }

    /**
     * Replaces item in the Row and CV arrays with the new item.
     * Returns an index of the item in the CV.sourceCollection array.
     */
    private _swapItem(newRow: wijmo.grid.Row, oldRow: wijmo.grid.Row, newItem: any, oldItem: any): number {
        let row = newRow;
        if (!row || row.dataItem !== oldItem) {
            // find row if it's unknown
            this._grid.rows.some((v) => (v.dataItem === oldItem) && !!(row = v));
        }
        let cv = this._cv,
            //oldItem = row.dataItem,
            index = cv.sourceCollection.indexOf(oldItem),
            cvIndex = cv.items.indexOf(oldItem);
        oldRow.dataItem = newItem;
        if (row) {
            row.dataItem = newItem;
        }
        cv.sourceCollection[index] = newItem;
        cv.items[cvIndex] = newItem;
        //console.log(`_swapItem, row = ${row.index}`)
        return index;
    }

    private _swapBatchedItems(masterRow: wijmo.grid.Row, batch: _IChangeBatch): number {
        let indices = Object.keys(batch),
            count = indices.length;
        if (count > 1) {
            masterRow = null;
        }
        for (let idx of indices) {
            let chg = batch[idx];
            this._swapItem(masterRow, chg.row, chg.oldItem, chg.newItem);
        }
        return count;
    }

    private _addItemChange(rowIdx: number, index: number | null) {
        // clone and settle the item
        let row = this._grid.rows[rowIdx],
            oldItem = row.dataItem,
            //newItem = copyObject({}, oldItem);
            newItem = this._cloneItem(oldItem);
        if (index == null) {
            index = this._cv.sourceCollection.indexOf(oldItem);
        }
        this._chg.changedItems[index] = {
            row,
            oldItem,
            newItem,
            index: index
        };
        this._swapItem(row, row, newItem, oldItem);
    }

    /**
     * Checks if the row is a data row, and returns its dataItem index in the
     * CV.sourceCollection. -1 if not a data row due to any reason.
     */ 

    private _dataIndex(row: wijmo.grid.Row): number {
        let dataItem = row.dataItem;
        if (dataItem && !(row instanceof wijmo.grid.GroupRow || 
                row instanceof wijmo.grid._NewRowTemplate)) {
            return this._cv.sourceCollection.indexOf(dataItem);
        }
        return -1;
    }

    /**
     * Removes all items from the target array, and adds items into it from the source array.
     * Returns the target array.
    */
    private _replaceItems(targArr: any[], srcArr: any[]): any[] {
        targArr.splice(0, targArr.length);
        // Use (t.length=s.lenfth; t[i]=s[i]) combination instead of push,
        // it's faster in average on big data.
        let length = targArr.length = srcArr.length;
        for (let i = 0; i < length; i++) {
            targArr[i] = srcArr[i];
        }
        return targArr;
    }

    // Clones the specified item to use by grid for editing. Takes into account all
    // settings like cloningItem event results, bindings to nested properties, etc.
    private _cloneItem(item: any): any {
        let args = new CloningItemEventArgs(item);
        this.onCloningItem(args);
        let clonedItem = args.clonedItem;
        if (clonedItem == null) {
            clonedItem = this._cloneBindings(item);
        }
        return clonedItem;
    }

    // Clones the specified items with a minimal depth necessary to provide data immutability
    // for the possible column bindings to the nested properties (like item.prop[0].nested).
    private _cloneBindings(item: any): any {
        let ret = copyObject({}, item),
            propsTree = {},
            columns = this.grid.columns;
        // create a minimal property tree for deep clone
        for (let col of columns) {
            let bnd = col._binding,
                parts = bnd && bnd._parts;
            if (parts && parts.length > 1) {
                let maxIdx = parts.length - 2,
                    curLevel = propsTree;
                for (let i = 0; i <= maxIdx; i++) {
                    let prop = parts[i];
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
    }

    // In the 'obj' object, replaces all props specified in the propHash object, with its
    // clones. If propHash[prop] contains subobject with props, then does it recursively.
    private _cloneProps(obj: any, propHash: any) {
        for (let prop in propHash) {
            let propVal = obj[prop];
            if (propVal != null) {
                if (wijmo.isArray(propVal)) {
                    let clonedProp = obj[prop] = [].concat(propVal);
                    this._cloneProps(clonedProp, propHash[prop]);
                } else if (wijmo.isObject(propVal)) {
                    let clonedProp = obj[prop] = copyObject({}, propVal);
                    this._cloneProps(clonedProp, propHash[prop]);
                }
            }
        }
    }
}

/**
 * Performs shallow copying of properties of one or more source objects into the target object.
 * Can be used to clone objects in the _Store_ reducers.
 * @param target The object to copy properties to.
 * @param src One or more source objects whose properties must be copied to the target object.
 */
export function copyObject(target: any, ...src: any[]): any {
    // TBD: should work in IE
    //return Object.assign(target, ...src);
    return _copyImpl(target, ...src);
}

const _copyImpl = typeof Object.assign === 'function' ? Object.assign :
    function (target: any, ...src: any[]): any {
        for (let curSrc of src) {
            if (curSrc != null) {
                for (let prop in curSrc) {
                    // TBD: should traverse up to prototypes
                    let pd = Object.getOwnPropertyDescriptor(target, prop);
                    if (!pd || pd.writable) {
                        target[prop] = curSrc[prop];
                    }
                }
            }
        }
        return target;
    }

interface _IChangeData {
    changedItems?: _IChangeBatch,
    cvLength?: number;
}

interface _IChangeDataItem {
    row?: wijmo.grid.Row;
    oldItem?: any;
    newItem?: any;
    index?: number;
}

interface _IChangeBatch {
    [index: string]: _IChangeDataItem;
}

    }
    


    module wijmo.grid.immutable {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.immutable', wijmo.grid.immutable);


    }
    