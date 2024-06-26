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


    module wijmo.rest {
    



/**
 * Base class for REST-based CollectionView classes.
 *
 * To use it, create a class that extends {@link:RestCollectionView}
 * and add overrides for the following methods:
 *
 * <ul>
 *     <li><b>getItems</b>: Gets a list of items from the server. The list may be sorted, filtered, and paged.</li>
 *     <li><b>addItem</b>: Adds an item to the collection on the server.</li>
 *     <li><b>patchItem</b>: Edits an item in the collection on the server.</li>
 *     <li><b>deleteItem</b>: Deletes an item fom the collection on the server.</li>
 * </ul>
 * 
 * By default, the class should perform sorting, filtering, and paging on the server.
 * 
 * If the REST service does not support any of these operations, make sure the
 * **sortOnServer**, **pageOnServer**, or **filterOnServer** properties are set 
 * to **false**, and the corresponding operations will be performed on the client instead.
 */
export class RestCollectionView extends wijmo.collections.CollectionView {
    _toGetData: any;
    _loading = false;
    _fields: string[] | null = null;
    _keys: string[] | null = null;
    _sortOnServer = true;
    _pageOnServer = true;
    _filterOnServer = true;
    _filterProvider: any;
    _totalItemCount = 0;
    _requestHeaders: any;

    /**
     * Initializes a new instance of the @see:ServerCollectionViewBase class.
     *
     * @param options JavaScript object containing initialization data (property
     * values and event handlers) for the @see:ServerCollectionView.
     */
    constructor(options?: any) {
        super();
        if (options) {
            wijmo.copy(this, options);
        }

        // when sortDescriptions change, sort on server
        this.sortDescriptions.collectionChanged.addHandler(() => {
            if (this.sortOnServer) {
                this._getData();
            }
        });

        // go get the data
        this._getData();
    }

    // ** object model

    /**
     * Gets or sets an array containing the names of the fields to retrieve from 
     * the data source.
     *
     * If this property is set to null or to an empty array, all fields are 
     * retrieved.
     */
    get fields(): string[] | null {
        return this._fields;
    }
    set fields(value: string[] | null) {
        if (this._fields != value) {
            this._fields = wijmo.asArray(value);
            this._getData();
        }
    }
    /**
     * Gets or sets a value that determines whether sort operations 
     * should be performed on the server or on the client.
     *
     * Use the @see:sortDescriptions property to specify how the
     * data should be sorted.
     */
    get sortOnServer(): boolean {
        return this._sortOnServer;
    }
    set sortOnServer(value: boolean) {
        if (value != this._sortOnServer) {
            this._sortOnServer = wijmo.asBoolean(value);
            this._getData();
        }
    }
    /**
     * Gets or sets a value that determines whether paging should be 
     * performed on the server or on the client.
     *
     * Use the @see:pageSize property to enable paging.
     */
    get pageOnServer(): boolean {
        return this._pageOnServer;
    }
    set pageOnServer(value: boolean) {
        if (value != this._pageOnServer) {
            this._pageOnServer = wijmo.asBoolean(value);
            this._getData();
        }
    }
    /**
     * Gets or sets a value that determines whether filtering should be performed on 
     * the server or on the client.
     */
    get filterOnServer(): boolean {
        return this._filterOnServer;
    }
    set filterOnServer(value: boolean) {
        if (value != this._filterOnServer) {
            this._filterOnServer = wijmo.asBoolean(value);
            this._getData();
        }
    }
    /**
     * Gets or sets an object containing request headers to be used when sending 
     * or requesting data.
     *
     * The most typical use for this property is in scenarios where authentication
     * is required. For example:
     *
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
     * const categories = new ODataCollectionView(serviceUrl, 'Categories', {
     *   fields: ['Category_ID', 'Category_Name'],
     *   requestHeaders: { Authorization: db.token }
     * });
     * ```
     */
    get requestHeaders(): any {
        return this._requestHeaders;
    }
    set requestHeaders(value: any) {
        this._requestHeaders = value;
    }
    /**
     * Updates the filter definition based on a known filter provider such as the 
     * @see:FlexGridFilter.
     *
     * @param filterProvider Known filter provider, typically an instance of a
     * @see:FlexGridFilter.
     */
    updateFilterDefinition(filterProvider: any) {
        if (this.filterOnServer) {
            this._filterProvider = filterProvider;
            this._getData();
        }
    }
    /**
     * Gets a value that indicates the @see:ServerCollectionView is 
     * currently loading data.
     * 
     * This property can be used to provide progress indicators.
     */
    get isLoading(): boolean {
        return this._loading;
    }
    /**
     * Occurs when the @see:ServerCollectionView starts loading data.
     */
    loading = new wijmo.Event();
    /**
     * Raises the @see:loading event.
     */
    onLoading(e?: wijmo.EventArgs) {
        this.loading.raise(this, e);
    }
    /**
     * Occurs when the @see:ServerCollectionView finishes loading data.
     */
    loaded = new wijmo.Event();
    /**
     * Raises the @see:loaded event.
     */
    onLoaded(e?: wijmo.EventArgs) {
        this.loaded.raise(this, e);
    }
    /**
     * Loads or re-loads the data from the server.
     */
    load() {
        this._getData();
    }

    /**
     * Occurs when there is an error reading or writing data.
     */
    error = new wijmo.Event();
    /**
     * Raises the @see:error event.
     *
     * By default, errors throw exceptions and trigger a data refresh. If you
     * want to prevent this behavior, set the @see:RequestErrorEventArgs.cancel
     * parameter to true in the event handler.
     *
     * @param e @see:ErrorEventArgs that contains information about the error.
     */
    onError(e: RESTErrorEventArgs): boolean {
        this.error.raise(this, e);
        return !e.cancel;
    }

    // ** overrides

    // disable sort and filter on client if we're doing it on the server (WJM-19413)
    _performRefresh() {

        // save settings
        let canFilter = this._canFilter,
            canSort = this._canSort;

        // perform refresh
        this._canFilter = !this._filterOnServer;
        this._canSort = !this._sortOnServer;
        super._performRefresh();

        // restore settings
        this._canFilter = canFilter;
        this._canSort = canSort;
    }

    /**
     * Gets the total number of items in the view before paging is applied.
     */
    get totalItemCount(): number {
        return this.pageOnServer
            ? this._totalItemCount
            : this._view.length;
    }
    /**
     * Gets the total number of pages.
     */
    get pageCount(): number {
        return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
    }
    /**
     * Gets or sets the number of items to display on a page.
     */
    get pageSize(): number {
        return this._pgSz;
    }
    set pageSize(value: number) {
        if (value != this._pgSz) {
            this._pgSz = wijmo.asInt(value);
            if (this.pageOnServer) {
                this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1); // ensure page index is valid (TFS 121226)
                this._getData();
            } else {
                this.refresh();
            }
        }
    }
    /**
     * Raises the @see:pageChanging event.
     *
     * @param e @see:PageChangingEventArgs that contains the event data.
     */
    onPageChanging(e: wijmo.collections.PageChangingEventArgs): boolean {
        super.onPageChanging(e);
        if (this.pageOnServer && !e.cancel) {
            this._getData();
        }
        return !e.cancel;
    }

    /**
     * Override @see:commitNew to add the new item to the database.
     */
    commitNew() {

        // get new item
        let item = this.currentAddItem;

        // add new
        if (item) {
            try {
                let p = this.addItem(item);
                if (p && p.then) {
                    p.then(() => this.refresh());
                }
            } catch (x) {
                this._raiseError(x, true);
            }
        }

        // allow base class
        super.commitNew();
    }
    /**
     * Override @see:commitEdit to modify the item in the database.
     */
    commitEdit() {

        // commit to database
        let item = this.currentEditItem;
        if (item && !this.currentAddItem && !this._sameContent(item, this._edtClone)) {
            if (this.items.indexOf(item) > -1) { // make sure we have this item...
                try {
                    let p = this.patchItem(item);
                    if (p && p.then) {
                        p.then(() => this.refresh());
                    }
                } catch (x) {
                    this._raiseError(x, true);
                }
            }
        }

        // allow base class
        super.commitEdit();
    }
    /**
     * Override @see:remove to remove the item from the database.
     *
     * @param item Item to be removed from the database.
     */
    remove(item: any) {

        // remove from database
        if (item && item != this.currentAddItem) {
            if (this.items.indexOf(item) > -1) {
                try {
                    let p = this.deleteItem(item);
                    if (p && p.then) {
                        p.then(() => this.refresh());
                    }
                } catch (x) {
                    this._raiseError(x, true);
                }
            }
        }

        // allow base class
        super.remove(item);
    }

    // if we're paging on the server, the pageView is the view
    _getPageView() {
        return this.pageOnServer
            ? this._view
            : super._getPageView();
    }

    // ** implementation

    // get the data
    private _getData() {

        // get the data on a timeout to avoid doing it too often
        if (this._toGetData) {
            clearTimeout(this._toGetData);
        }
        this._toGetData = setTimeout(async () => {

            // start loading
            this._toGetData = null;
            this._loading = true;
            this.onLoading();

            // get the data
            let data: any[] = null;
            let error = null;
            try {

                // save current position
                let position = this.currentPosition;

                // apply the new data
                data = await this.getItems();
                this.sourceCollection = data;
                this.refresh();

                // restore position
                if (position > -1) {
                    this.moveCurrentToPosition(position);
                }

                // make sure the current page index is valid
                if (this.pageIndex > 0 && this.pageIndex >= this.pageCount) {
                    this.moveToLastPage();
                }

            } catch (x) {
                error = x;
            }

            // done
            this._loading = false;
            this.onLoaded();

            if (error) {
                this._raiseError(error, false);
            }
        }, 100);
    }

    // handle errors...
    protected _raiseError(error: any, reload: boolean) {
        if (this.onError(new RESTErrorEventArgs(error))) {
            if (reload) {
                this._getData();
            }
            throw 'Server Error: ' + error;
        }
    }

    // ** virtual methods

    /**
     * Gets a Promise that returns an array containing all the items,
     * possibly filtered/paged/and sorted on the server.
     */
    protected getItems(): Promise<any[]> {
        throw 'This method is virtual: it should be overridden';
        //return new Promise<any[]>(resolve => {
        //    setTimeout(() => {
        //        // ... get filtered/sorted/paged data 
        //        resolve(data);
        //    }, 1000);
        //});
    }
    /**
     * Gets a Promise that adds a new item to the database.
     */
    protected addItem(item: any): Promise<any> {
        throw 'This method is virtual: it should be overridden';
    }
    /**
     * Gets a Promise that modifies an item in the database.
     */
    protected patchItem(item: any): Promise<any> {
        throw 'This method is virtual: it should be overridden';
    }
    /**
     * Gets a Promise that removes an item from the database.
     */
    protected deleteItem(item: any): Promise<any> {
        throw 'This method is virtual: it should be overridden';
    }
}

/**
 * Class that provides information for REST errors.
 */
export class RESTErrorEventArgs extends wijmo.CancelEventArgs {
    _error: any;

    constructor(error: any) {
        super();
        this._error = error
    }

    get error(): any {
        return this._error;
    }
}
    }
    


    module wijmo.rest {
    

wijmo._registerModule('wijmo.rest', wijmo.rest);



    }
    