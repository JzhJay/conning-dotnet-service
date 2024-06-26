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


    module wijmo.odata {
    




export function softGrid(): typeof wijmo.grid {
    return wijmo._getModule('wijmo.grid');
}

export function softFilter(): typeof wijmo.grid.filter {
    return wijmo._getModule('wijmo.grid.filter');
}
    }
    


    module wijmo.odata {
    






'use strict';

// interface used to define batch request items (actions)
interface _IBatchRequestItem {
    method: string,
    url: string,
    data?: any,
}

/**
 * Extends the {@link CollectionView} class to support loading and
 * saving data from OData sources.
 *
 * You can use the {@link ODataCollectionView} class to load data from
 * OData services and use it as a data source for Wijmo controls.
 *
 * In addition to full CRUD support you get all the {@link CollectionView} 
 * features including sorting, filtering, paging, and grouping. 
 * The sorting, filtering, and paging functions may be performed on the 
 * server or on the client.
 *
 * The code below shows how you can instantiate an {@link ODataCollectionView} 
 * that selects some fields from the data source and provides sorting on the
 * client.
 * Notice how the 'options' parameter is used to pass in initialization 
 * data, which is the same approach used when initializing controls:
 *
 * ```typescript
 * import { ODataCollectionView } from '@grapecity/wijmo.odata';
 * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
 * const categories = new ODataCollectionView(url, 'Categories', {
 *   fields: ['CategoryID', 'CategoryName', 'Description'],
 *   sortOnServer: false
 * });
 * ```
 * 
 * The example below uses an {@link ODataCollectionView} to load data from
 * a NorthWind OData provider service, and shows the result in a 
 * {@link FlexGrid} control:
 * 
 * {@sample Grid/Data-binding/ODataAPI/purejs Example}
 */
export class ODataCollectionView extends wijmo.collections.CollectionView {
    _url: string;
    _tbl: string;
    _entityType: string;
    _count = 0;
    _fields: string[];
    _keys: string[];
    _expand: string;
    _dataTypes: any;
    _sortOnServer = true;
    _pageOnServer = true;
    _filterOnServer = true;
    _deferCommits = false;
    _hasPendingChanges = false;
    _showDatesAsGmt = false;
    _inferDataTypes = true;
    _dataTypesInferred: any;
    _reviverBnd = this._reviver.bind(this);
    _jsonReviver: Function;
    _filterDef: string;
    _toGetData: any;
    _loading: boolean;
    _requestHeaders: any;
    _odv: number; // OData version (e.g. 1, 2, 3, 4)

    static _odvCache = {}; // cache OData versions by service URL

    // regex for matching Javascript date strings
    // The ISO format is a simplification of the ISO 8601 extended format:
    // YYYY-MM-DDTHH:mm:ss.sssZ
    static _rxDate = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}|\/Date\([\d\-]*?\)/;

    /**
     * Initializes a new instance of the {@link ODataCollectionView} class.
     *
     * @param url Url of the OData service (for example
     * 'https://services.odata.org/Northwind/Northwind.svc/').
     * @param tableName Name of the table (entity) to retrieve from the service.
     * If not provided, a list of the tables (entities) available is retrieved.
     * @param options JavaScript object containing initialization data (property 
     * values and event handlers) for the {@link ODataCollectionView}.
     */
    constructor(url: string, tableName: string, options?: any) {
        super();
        this._url = wijmo.asString(url, false);
        this._tbl = wijmo.asString(tableName);
        wijmo.copy(this, options);

        // when sortDescriptions change, sort on server
        this.sortDescriptions.collectionChanged.addHandler(() => {
            if (this.sortOnServer && !this.hasPendingChanges) {
                this._getData();
            }
        });

        // keep track of whether we have changes
        this.itemsEdited.collectionChanged.addHandler(this._updateHasChanges, this);
        this.itemsAdded.collectionChanged.addHandler(this._updateHasChanges, this);
        this.itemsRemoved.collectionChanged.addHandler(this._updateHasChanges, this);

        // go get the data
        this._getData();
    }

    // ** object model

    /**
     * Gets the name of the table (entity) that this collection is bound to.
     */
    get tableName(): string {
        return this._tbl;
    }
    /**
     * Gets or sets a string that represents the entity's data type on the server.
     * 
     * This may be required to update data in some OData services. 
     * 
     * For more details, please see 
     * http://docs.oasis-open.org/odata/odata-json-format/v4.0/cs01/odata-json-format-v4.0-cs01.html#_Toc365464687.
     */
    get entityType(): string {
        return this._entityType;
    }
    set entityType(value: string) {
        this._entityType = wijmo.asString(value);
    }
    /**
     * Gets or sets an array containing the names of the fields to retrieve from 
     * the data source.
     *
     * If this property is set to null or to an empty array, all fields are 
     * retrieved.
     *
     * For example, the code below creates an {@link ODataCollectionView} that
     * gets only three fields from the 'Categories' table in the database:
     *
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
     * const categories = new ODataCollectionView(url, 'Categories', {
     *   fields: ['CategoryID', 'CategoryName', 'Description']
     * });
     * ```
     */
    get fields(): string[] {
        return this._fields;
    }
    set fields(value: string[]) {
        if (this._fields != value) {
            this._fields = wijmo.asArray(value);
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
     * Gets or sets an array containing the names of the key fields.
     *
     * Key fields are required for update operations (add/remove/delete).
     */
    get keys(): string[] {
        return this._keys;
    }
    set keys(value: string[]) {
        this._keys = wijmo.asArray(value);
    }
    /**
     * Gets or sets a string that specifies whether related entities should
     * be included in the return data.
     * 
     * This property maps directly to OData's $expand option.
     * 
     * For example, the code below retrieves all the customers and their
     * orders from the database. Each customer entity has an "Orders"
     * field that contains an array of order objects:
     * 
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
     * const customersOrders = new ODataCollectionView(url, 'Customers', {
     *   expand: 'Orders'
     * });
     * ```
     */
    get expand(): string {
        return this._expand;
    }
    set expand(value: string) {
        this._expand = wijmo.asString(value);
    }
    /**
     * Gets or sets a custom reviver function to use when parsing JSON 
     * values returned from the server.
     * 
     * If provided, the function must take two parameters (key and value),
     * and must return the parsed value (which can be the same as the 
     * original value).
     * 
     * For details about reviver functions, please refer to the documentation
     * for the
     * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" target="_blank">JSON.parse method</a>.
     */
    get jsonReviver(): Function {
        return this._jsonReviver;
    }
    set jsonReviver(value: Function) {
        this._jsonReviver = wijmo.asFunction(value);
    }
    /**
     * Gets or sets a JavaScript object to be used as a map for coercing data types
     * when loading the data.
     *
     * The object keys represent the field names and the values are {@link DataType} values
     * that indicate how the data should be coerced.
     *
     * For example, the code below creates an {@link ODataCollectionView} and specifies
     * that 'Freight' values, which are stored as strings in the database, should be
     * converted into numbers; and that three date fields should be converted into dates:
     *
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * import { DataType } from '@grapecity/wijmo';
     * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
     * const orders = new ODataCollectionView(url, 'Orders', {
     *   dataTypes: {
     *     Freight: DataType.Number 
     *     OrderDate: DataType.Date,
     *     RequiredDate: DataType.Date,
     *     ShippedDate: DataType.Date,
     *   }
     * });
     * ```
     *
     * This property is useful when the database contains data stored in 
     * formats that do not conform to common usage.
     *
     * In most cases you don't have to provide information about the 
     * data types, because the {@link inferDataTypes} property handles 
     * the conversion of Date values automatically.
     *
     * If you do provide explicit type information, the {@link inferDataTypes} 
     * property is not applied. Because of this, any data type information
     * that is provided should be complete, including all fields of type
     * Date.
     */
    get dataTypes(): any {
        return this._dataTypes;
    }
    set dataTypes(value: any) {
        this._dataTypes = value;
    }
    /**
     * Gets or sets a value that determines whether fields that contain 
     * strings that look like standard date representations should be
     * converted to dates automatically.
     *
     * This property is set to true by default, because the {@link ODataCollectionView} 
     * class uses JSON and that format does not support Date objects.
     *
     * This property has no effect if specific type information is provided using
     * the {@link dataTypes} property.
     */
    get inferDataTypes(): boolean {
        return this._inferDataTypes;
    }
    set inferDataTypes(value: boolean) {
        if (value != this.inferDataTypes) {
            this._inferDataTypes = wijmo.asBoolean(value);
            this._getData();
        }
    }
    /**
     * Gets or sets a value that determines whether dates should be adjusted
     * to look like GMT rather than local dates.
     */
    get showDatesAsGmt() {
        return this._showDatesAsGmt;
    }
    set showDatesAsGmt(value: boolean) {
        if (value != this.showDatesAsGmt) {
            this._showDatesAsGmt = wijmo.asBoolean(value);
            this._getData();
        }
    }
    /**
     * Gets or sets a value that determines whether sort operations 
     * should be performed on the server or on the client.
     *
     * Use the {@link sortDescriptions} property to specify how the
     * data should be sorted.
     *
     * The default value for this property is **true**.
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
     * Use the {@link pageSize} property to enable paging.
     * 
     * The default value for this property is **true**.
     */
    get pageOnServer(): boolean {
        return this._pageOnServer;
    }
    set pageOnServer(value: boolean) {
        if (value != this._pageOnServer) {
            this._pageOnServer = wijmo.asBoolean(value);
            if (this.pageSize) {
                this._getData();
            }
        }
    }
    /**
     * Gets or sets a value that determines whether filtering should be
     * performed on the server or on the client.
     *
     * Use the {@link filter} property to perform filtering on the client,
     * and use the  {@link filterDefinition} property to perform filtering
     * on the server.
     *
     * In some cases it may be desirable to apply independent filters 
     * on the client **and** on the server. 
     *
     * You can achieve this by setting (1) the {@link filterOnServer} property 
     * to false and the {@link filter} property to a filter function (to enable
     * client-side filtering) and (2) the {@link filterDefinition} property to 
     * a filter string (to enable server-side filtering).
     *
     * The default value for this property is **true**.
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
     * Gets or sets a string containing an OData filter specification to
     * be used for filtering the data on the server.
     *
     * The filter definition syntax is described in the 
     * <a href="https://www.odata.org/documentation/odata-version-2-0/uri-conventions/">OData documentation</a>.
     *
     * For example, the code below causes the server to return records 
     * where the 'CompanyName' field starts with 'A' and ends with 'S':
     *
     * ```typescript
     * view.filterDefinition = "startswith(CompanyName, 'A') and endswith(CompanyName, 'B')";
     * ```
     *
     * Filter definitions can be generated automatically. For example, the
     * {@link FlexGridFilter} component detects whether its data source is an
     * {@link ODataCollectionView} and automatically updates both the
     * {@link ODataCollectionView.filter} and {@link ODataCollectionView.filterDefinition}
     * properties.
     *
     * Note that the {@link ODataCollectionView.filterDefinition} property is applied 
     * even if the {@link ODataCollectionView.filterOnServer} property is set to false.
     * This allows you to apply server and client filters to the same collection, 
     * which can be useful in many scenarios.
     *
     * For example, the code below uses the {@link ODataCollectionView.filterDefinition} 
     * property to filter on the server and the {@link ODataCollectionView.filter} 
     * property to further filter on the client. The collection will show items with 
     * names that start with 'C' and have unit prices greater than 20:
     *
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * const url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
     * const data = new ODataCollectionView(url, 'Products', {
     *   oDataVersion: 4,
     *   filterDefinition: 'startswith(ProductName, \'C\')', // server filter
     *   filterOnServer: false, // client filter
     *   filter: function(product) { 
     *     return product.UnitPrice &gt; 20;
     *   },
     * });
     * ```
     */
    get filterDefinition(): string {
        return this._filterDef;
    }
    set filterDefinition(value: string) {
        if (value != this._filterDef) {
            this._filterDef = wijmo.asString(value);
            this._getData();
        }
    }
    /**
     * Updates the filter definition based on a known filter provider such as the 
     * {@link FlexGridFilter}.
     *
     * @param filterProvider Known filter provider, typically an instance of a
     * {@link FlexGridFilter}.
     */
    updateFilterDefinition(filterProvider: any) {
        if (this.filterOnServer && softGrid() && softFilter() && (filterProvider instanceof softFilter().FlexGridFilter)) {
            this.filterDefinition = this._asODataFilter(filterProvider);
        }
    }
    /**
     * Gets or sets the OData version used by the server.
     *
     * There are currently four versions of OData services, 1.0 through 4.0.
     * Version 4.0 is used by the latest services, but there are many legacy
     * services still in operation.
     *
     * If you know what version of OData your service implements, set the
     * {@link oDataVersion} property to the appropriate value (1 through 4) when 
     * creating the {@link ODataCollectionView} (see example below).
     *
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * let url = 'https://services.odata.org/Northwind/Northwind.svc/';
     * let categories = new ODataCollectionView(url, 'Categories', {
     *   oDataVersion: 1.0, // legacy OData source
     *   fields: ['CategoryID', 'CategoryName', 'Description'],
     *   sortOnServer: false
     * });
     * ```
     *
     * If you do not know what version of OData your service implements (perhaps 
     * you are writing an OData explorer application), then do not specify the
     * version. In this case, the {@link ODataCollectionView} will get this information
     * from the server. This operation requires an extra request, but only once
     * per service URL, so the overhead is small.
     */
    get oDataVersion(): number {
        return this._odv;
    }
    set oDataVersion(value: number) {
        this._odv = wijmo.asNumber(value);
    }
    /**
     * Gets a value that indicates the {@link ODataCollectionView} is 
     * currently loading data.
     * 
     * This property can be used to provide progress indicators.
     */
    get isLoading(): boolean {
        return this._loading;
    }
    /**
     * Gets or sets a value that causes the {@link ODataCollectionView} to
     * defer commits back to the database.
     * 
     * The default value for this property is **false**, which causes
     * any changes to the data to be immediately committed to the database.
     * 
     * If you set this property to **true**, it will automatically set the
     * {@link trackChanges} property to true. After this, any changes to the
     * data (including edits, additions, and removals) will be tracked but
     * not committed to the database until you call the {@link commitChanges} 
     * method to commit the changes, or the {@link cancelChanges} method
     * to discard all pending changes.
     * 
     * For example:
     * ```typescript
     * import { ODataCollectionView } from '@grapecity/wijmo.odata';
     * 
     * // create data source
     * let url = 'https://services.odata.org/...';
     * let view = new ODataCollectionView(url, 'Categories', {
     *     keys: [ 'ID' ]
     * });
     *
     * // defer commits
     * view.deferCommits = true;
     * 
     * // handle commit/cancel changes buttons
     * let btnCommit = document.getElementById('btn-commit') as HTMLButtonElement,
     *     btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
     * btnCommit.addEventListener('click', () => view.commitChanges());
     * btnCancel.addEventListener('click', () => view.cancelChanges());
     * view.hasPendingChangesChanged.addHandler((s, e) => {
     *    btnCommit.disabled = btnCancel.disabled = !view.hasPendingChanges;
     * });
     * ```
     */
    get deferCommits(): boolean {
        return this._deferCommits;
    }
    set deferCommits(value: boolean) {
        this._deferCommits = wijmo.asBoolean(value);
        if (this.deferCommits) {
            this.trackChanges = true;
        }
    }

    /**
     * Occurs when the {@link ODataCollectionView} starts loading data.
     */
    readonly loading = new wijmo.Event<ODataCollectionView, wijmo.EventArgs>();
    /**
     * Raises the {@link loading} event.
     */
    onLoading(e?: wijmo.EventArgs) {
        this.loading.raise(this, e);
    }
    /**
     * Occurs when the {@link ODataCollectionView} finishes loading data.
     */
    readonly loaded = new wijmo.Event<ODataCollectionView, wijmo.EventArgs>();
    /**
     * Raises the {@link loaded} event.
     */
    onLoaded(e?: wijmo.EventArgs) {
        this.loaded.raise(this, e);
    }
    /**
     * Loads or re-loads the data from the OData source.
     */
    load() {
        this._getData();
    }
    /**
     * Occurs when there is an error reading or writing data.
     */
    readonly error = new wijmo.Event<ODataCollectionView, wijmo.RequestErrorEventArgs>();
    /**
     * Raises the {@link error} event.
     *
     * By default, errors throw exceptions and trigger a data refresh. If you
     * want to prevent this behavior, set the {@link RequestErrorEventArgs.cancel}
     * parameter to true in the event handler.
     *
     * @param e {@link RequestErrorEventArgs} that contains information about the error.
     */
    onError(e: wijmo.RequestErrorEventArgs): boolean {
        this.error.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the value of the {@link hasPendingChanges} property changes.
     * 
     * See also the {@link deferCommits} property.
     */
    readonly hasPendingChangesChanged = new wijmo.Event<ODataCollectionView, wijmo.EventArgs>();
    /**
     * Raises the {@link hasPendingChangesChanged} event.
     */
    onHasPendingChangesChanged(e?: wijmo.EventArgs) {
        this.hasPendingChangesChanged.raise(this, e);
    }

    // ** overrides

    /**
     * Returns true if this object supports a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IEditableCollectionView'
            ? this.keys != null && this.keys.length > 0 // editing requires keys
            : super.implementsInterface(interfaceName);
    }

    /**
     * Override {@link commitNew} to add the new item to the database.
     */
    commitNew() {

        // commit now unless deferring
        if (!this.deferCommits) {

            // to get new item back as JSON
            let requestHeaders = {
                'Accept': 'application/json'
            };
            if (this.requestHeaders) {
                for (let k in this.requestHeaders) {
                    requestHeaders[k] = this.requestHeaders[k];
                }
            }

            // commit to database
            let item = this.currentAddItem;
            if (item) {
                let url = this._getWriteUrl();
                wijmo.httpRequest(url, {
                    method: 'POST',
                    requestHeaders: requestHeaders,
                    data: this._convertToDbFormat(item),
                    success: xhr => { // update keys in the new item, refresh the view
                        let newItem = JSON.parse(xhr.responseText, this._reviverBnd);
                        this.keys.forEach(key => {
                            item[key] = newItem[key];
                        });
                        this.refresh();
                    },
                    error: this._error.bind(this)
                });
            }
        }

        // allow base class
        super.commitNew();
    }
    /**
     * Override {@link commitEdit} to modify the item in the database.
     */
    commitEdit() {

        // commit now unless deferring
        if (!this.deferCommits) {

            // get the item being edited
            let item = this.currentEditItem;

            // check that the item is not being added and that it has changed
            if (item && !this.currentAddItem && this._getChangedFields(item, this._edtClone)) {

                // no need to check whether it's in the collection now (TFS 305323)
                //if (this.sourceCollection.indexOf(item) > -1) {
                //if (this.items.indexOf(item) > -1) {

                // commit to database
                let url = this._getWriteUrl(this._edtClone);
                wijmo.httpRequest(url, {
                    method: 'PATCH', //'PUT',
                    requestHeaders: this.requestHeaders,
                    data: this._convertToDbFormat(item),
                    error: this._error.bind(this)
                });
            }
        }

        // allow base class
        super.commitEdit();
    }
    /**
     * Override {@link remove} to remove the item from the database.
     *
     * @param item Item to be removed from the database.
     */
    remove(item: any) {

        // commit now unless deferring
        if (!this.deferCommits) {

            // remove from database
            if (item && item != this.currentAddItem) {
                if (this.items.indexOf(item) > -1) { // make sure we have this item...
                    let url = this._getWriteUrl(item);
                    wijmo.httpRequest(url, {
                        method: 'DELETE',
                        requestHeaders: this.requestHeaders,
                        error: this._error.bind(this)
                    });
                }
            }
        }

        // allow base class
        super.remove(item);
    }
    /**
     * Commits all pending changes to the server.
     * 
     * Changes are contained in the {@link itemsEdited}, {@link itemsAdded},
     * and {@link itemsRemoved} collections, and are automatically cleared
     * after they are committed.
     * 
     * See also the {@link deferCommits} property.
     * 
     * @param committed Optional callback invoked when the commit operation
     * has been completed. The callback takes an **XMLHttpRequest**
     * parameter contains information about the request results.
     */
    commitChanges(committed?: (xhr: XMLHttpRequest) => void) {

        // perform pending edits, additions, removals in a single batch request:
        // https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/make-batch-requests-with-the-rest-apis?redirectedfrom=MSDN#sectionSection1
        if (this.deferCommits) {

            // build list of operations to perform
            let operations: _IBatchRequestItem[] = [];
            this.itemsEdited.forEach(item => {
                operations.push({
                    method: 'PATCH', //'PUT',
                    url: this._getWriteUrl(item),
                    data: this._convertToDbFormat(item)
                });
            });
            this.itemsAdded.forEach(item => {
                operations.push({
                    method: 'POST',
                    url: this._getWriteUrl(),
                    data: this._convertToDbFormat(item)
                });
            });
            this.itemsRemoved.forEach(item => {
                operations.push({
                    method: 'DELETE',
                    url: this._getWriteUrl(item)
                });
            });

            // send the operations to the server
            if (operations.length) {

                // make the request
                let boundary = new Date().getTime().toString();
                wijmo.httpRequest(this._getServiceUrl() + '$batch', {
                    method: 'POST',
                    requestHeaders: {
                        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                    },
                    data: this._encodeBatch(operations, boundary),
                    success: xhr => {
                        this.clearChanges();
                        this.load(); // to get the updated data
                    },
                    error: xhr => {
                        if (this.onError(new wijmo.RequestErrorEventArgs(xhr))) {
                            throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
                        }
                    },
                    complete: xhr => {
                        if (wijmo.isFunction(committed)) {
                            committed(xhr);
                        }
                    }
                });
            }
        }
    }
    /**
     * Cancels all changes by removing all items in the {@link itemsAdded}, 
     * {@link itemsRemoved}, and {@link itemsEdited} collections, 
     * without committing them to the server.
     * 
     * This method is used with the {@link deferCommits} property.
     */
    cancelChanges() {
        if (this.deferCommits) {
            this.clearChanges();
            this.load();
        }
    }
    /**
     * Gets a value that determines whether the {@link ODataCollectionView} has
     * pending changes.
     * 
     * See also the {@link deferCommits} property and the 
     * {@link commitChanges} and {@link cancelChanges} methods.
     */
    get hasPendingChanges(): boolean {
        if (this.deferCommits) {
            return this.itemsAdded.length > 0 ||
                this.itemsEdited.length > 0 ||
                this.itemsRemoved.length > 0;
        }
        return false;
    }

    // ** overrides

    /**
     * Gets the total number of items in the view before paging is applied.
     */
    get totalItemCount(): number {
        return this._count;
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
     * Raises the {@link pageChanging} event.
     *
     * @param e {@link PageChangingEventArgs} that contains the event data.
     */
    onPageChanging(e: wijmo.collections.PageChangingEventArgs): boolean {
        super.onPageChanging(e);
        if (!e.cancel && this.pageOnServer) {
            this._getData();
        }
        return !e.cancel;
    }

    // gets the list that corresponds to the current page
    _getPageView() {
        return this.pageOnServer
            ? this._view
            : super._getPageView();
    }

    // disable sort and filter on client if we're doing it on the server
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

    // ** implementation

    // keep track of whether we have pending changes
    _updateHasChanges() {
        let hasPendingChanges = this.hasPendingChanges
        if (hasPendingChanges != this._hasPendingChanges) {
            this._hasPendingChanges = hasPendingChanges;
            this.onHasPendingChangesChanged();
        }
    }

    // store items in the source collection
    /*protected*/ _storeItems(items: any[], append: boolean) {
        if (append) {
            Array.prototype.push.apply(this.sourceCollection, items);
        } else {
            this.sourceCollection = items;
        }
    }

    // get url for OData read request
    /*protected*/ _getReadUrl(nextLink?: string) {
        let url = this._getServiceUrl();
        if (nextLink) { // continuation includes table
            url = nextLink.indexOf('http') == 0 ? nextLink : url + nextLink;
        } else if (this._tbl) { // add table if available
            url += this._tbl;
        }
        return url;
    }

    // get parameters for OData read request
    /*protected*/ _getReadParams(nextLink?: string): any {
        let settings: any = {};

        // we only do json
        if (!nextLink || (nextLink.indexOf('$format') < 0 && nextLink.indexOf('%24format') < 0)) {
            settings.$format = 'json';
        }

        // no parameters needed if they are already on the nextLink argument
        if (!nextLink) {

            // more setting if we have a table
            if (this._tbl) {

                // get page count (OData4 uses $count, earlier versions use $inlinecount)
                if (this._odv < 4) {
                    settings.$inlinecount = 'allpages';
                } else {
                    settings.$count = true;
                }

                // specify fields to retrieve
                if (this.fields) {
                    settings.$select = this.fields.join(',');
                }

                // specify related entities to include
                if (this.expand) {
                    settings.$expand = this.expand;
                }

                // server sort
                if (this.sortOnServer && this.sortDescriptions.length) {
                    let sort = '';
                    this.sortDescriptions.forEach(sd => {
                        if (sort) sort += ',';
                        sort += sd.property;
                        if (!sd.ascending) sort += ' desc';
                    });
                    settings.$orderby = sort;
                }

                // server paging
                if (this.pageOnServer && this.pageSize > 0) {
                    settings.$skip = this.pageIndex * this.pageSize;
                    settings.$top = this.pageSize;
                }

                // server filter 
                // NOTE: we apply filterDefinition regardless of 'filterOnServer'; 
                // this allows filtering on the server and on the client at the same time
                if (this.filterDefinition) {
                    //settings.$filter = this._encodeFilterDefinition(); // TFS 409351
                    settings.$filter = this.filterDefinition; // TFS 441284
                }
            }
        }
        return settings;
    }

    // get the data
    /*protected*/ _getData(nextLink?: string, xhrCallback?: Function) {

        // get the data on a timeout to avoid doing it too often
        if (this._toGetData) {
            clearTimeout(this._toGetData);
        }
        this._toGetData = setTimeout(() => {

            // ensure we know what version of OData we're talking to
            if (this._odv == null) {
                this._getSchema();
                return;
            }

            // start loading
            this._loading = true;
            this.onLoading();

            // go get the data
            let xhr = wijmo.httpRequest(this._getReadUrl(nextLink), {
                requestHeaders: this.requestHeaders,
                data: this._getReadParams(nextLink),
                success: xhr => {

                    // parse response
                    let resp = JSON.parse(xhr.responseText, this._reviverBnd),
                        arr = resp.d ? resp.d.results : resp.value,
                        count = resp.d ? resp.d.__count : (resp['odata.count'] || resp['@odata.count']);

                    // store total item count
                    if (count != null) {
                        this._count = parseInt(count);
                    }

                    // make sure the page index is valid (TFS 285202)
                    if (this.pageIndex > 0 && this.pageIndex >= this.pageCount) {
                        let pgIndex = this.pageIndex;
                        this.moveToLastPage();
                        if (this.pageIndex != pgIndex) {
                            return;
                        }
                    }

                    // get/infer/convert data types the first time
                    if (!nextLink) {
                        if (this.inferDataTypes && !this._dataTypesInferred) {
                            this._dataTypesInferred = this._getInferredDataTypes(arr);
                        }
                    }

                    // convert using user or inferred dataTypes
                    let types = this.dataTypes ? this.dataTypes : this._dataTypesInferred;
                    if (types) {
                        arr.forEach((item: any) => {
                            this._convertItem(types, item);
                        });
                    }

                    // add result to source collection
                    this._storeItems(arr, nextLink != null);
                    this.refresh();

                    // go get more if there is a next link, else finish
                    nextLink = resp.d ? resp.d.__next : (resp['odata.nextLink'] || resp['@odata.nextLink']);
                    if (nextLink) {
                        this._getData(nextLink);
                    } else {
                        this._loading = false;
                        this.onLoaded();
                    }
                },
                error: xhr => {
                    this._loading = false;
                    this.onLoaded();
                    if (this.onError(new wijmo.RequestErrorEventArgs(xhr))) {
                        throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
                    }
                }
            });

            // pass xhr object back to caller (so he can abort the operation if needed)
            if (wijmo.isFunction(xhrCallback)) {
                xhrCallback(xhr);
            }
        }, 100);
    }

    // convert objects before posting to OData services
    private _convertToDbFormat(item: any): any {
        let obj = {},
            calcFields = this.calculatedFields;
        for (let key in item) {
            if (!calcFields || !(key in calcFields)) { // can't write calculated fields
                let value = item[key];
                if (wijmo.isDate(value) && this._showDatesAsGmt) {

                    // if we converted GMT to local, convert local back to GMT
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);

                } else if (wijmo.isNumber(value) && this._odv < 4) {

                    // convert numbers to strings in versions prior to 4.0.
                    // failing to do this may cause the service to throw an error:
                    // 'Cannot convert a primitive value to the expected type'
                    // which can in turn causes an HTTP 400 (Bad Request) error
                    value = value.toString();

                }
                obj[key] = value;
            }
        }

        // append odata type to the object
        // http://docs.oasis-open.org/odata/odata-json-format/v4.0/cs01/odata-json-format-v4.0-cs01.html#_Toc365464687
        if (this.entityType) {
            obj['odata.type'] = this.entityType;
        }
        return obj;
    }

    // JSON date reviver function
    private _reviver(key: string, value: any): any {
        if (typeof value === 'string' && ODataCollectionView._rxDate.test(value)) {
            value = value.indexOf('/Date(') == 0 // verbosejson
                ? new Date(parseInt(value.substr(6)))
                : new Date(value);
            if (wijmo.isDate(value) && this._showDatesAsGmt) { // convert GMT to local
                value = new Date(value.getTime() + value.getTimezoneOffset() * 60000);
            }
        }
        return this._jsonReviver // also apply custom reviver if any
            ? this._jsonReviver(key, value)
            : value;
    }

    // convert item properties to the proper types (JSON doesn't do dates...)
    private _convertItem(dataTypes: any[], item: any) {
        for (let k in dataTypes) {
            let type = dataTypes[k],
                value = item[k];
            if (value != null) {
                value = type == wijmo.DataType.Date && wijmo.isString(value) && value.indexOf('/Date(') == 0 // verbosejson
                    ? new Date(parseInt(value.substr(6)))
                    : wijmo.changeType(value, type, null);
                if (wijmo.isDate(value) && this._showDatesAsGmt) { // convert GMT to local
                    value = new Date(value.getTime() + value.getTimezoneOffset() * 60000);
                }
                item[k] = value;
            }
        }
    }

    // infer data types to detect dates automatically
    private _getInferredDataTypes(arr: any[]): any {
        let types = null;
        if (arr.length > 0) {

            // get a combination of the first 10 items (in case there are nulls)
            let xItem = {};
            arr.forEach((item: any) => {
                this._extend(xItem, item);
            });

            // scan the combined item for dates
            for (let key in xItem) {
                let value = xItem[key];
                if (wijmo.isString(value) && ODataCollectionView._rxDate.test(value)) {
                    if (!types) types = {};
                    types[key] = wijmo.DataType.Date;
                }
            }
        }
        return types;
    }

    // get service url for OData write requests
    private _getServiceUrl() {
        let url = this._url;
        if (url[url.length - 1] != '/') {
            url += '/';
        }
        return url;
    }

    // get the schema/odata version
    private _getSchema() {
        let url = this._getServiceUrl() + '$metadata',
            cache = ODataCollectionView._odvCache;

        // check if we have the version in the cache
        this._odv = cache[url];

        // if we do, go get the data
        if (this._odv) {
            this._getData();
        } else { // if we don't, get the schema and then go get the data
            wijmo.httpRequest(url, {
                requestHeaders: this.requestHeaders,
                success: xhr => {
                    let m = xhr.responseText.match(/<.*Version\s*=\s*"([0-9.]+)"/), // no xhr.response in IE9...
                        odv = m ? parseFloat(m[1]) : 4;
                    cache[url] = this._odv = odv;
                },
                error: xhr => {
                    // error getting metadata, assume OData 4...
                    cache[url] = this._odv = 4;
                },
                complete: xhr => {
                    this._getData();
                }
            });
        }
    }

    // get url for OData write requests
    private _getWriteUrl(item?: any): string {

        // start with table
        let url = this._getServiceUrl() + this._tbl;

        // add item keys
        if (item) {
            wijmo.assert(this.keys && this.keys.length > 0, 'write operations require keys.');
            let keys = [];
            this.keys.forEach(key => {
                let itemKey = item[key];
                if (itemKey == null) {
                    itemKey = '';
                }
                if (wijmo.isString(itemKey)) { // enclose string keys in quotes
                    itemKey = '\'' + itemKey + '\'';
                }
                keys.push(this.keys.length == 1 // add key name only if we have multiple keys
                    ? itemKey
                    : key + '=' + itemKey);
            });
            if (keys.length) {
                url += '(' + keys.join(',') + ')';
            }
        }

        // done
        return url;
    }

    // gets the OData filter definition from a wijmo.grid.filter.FlexGridFilter object.
    // https://www.odata.org/documentation/odata-version-2-0/uri-conventions/
    private _asODataFilter(filter: wijmo.grid.filter.FlexGridFilter): string {
        let def = '';
        for (let c = 0; c < filter.grid.columns.length; c++) {
            let col = filter.grid.columns[c],
                cf = filter.getColumnFilter(col, false);
            if (cf && cf.isActive) {
                if (def) {
                    def += ' and ';
                }
                if (cf.conditionFilter && cf.conditionFilter.isActive) {
                    def += this._asODataConditionFilter(cf.conditionFilter);
                } else if (cf.valueFilter && cf.valueFilter.isActive) {
                    def += this._asODataValueFilter(cf.valueFilter);
                }
            }
        }
        return def;
    }
    private _asODataValueFilter(vf: wijmo.grid.filter.ValueFilter): string {
        let col = vf.column,
            fld = col.binding,
            map = col.dataMap,
            def = '';

        // build condition with 'eq/or'
        for (let key in vf.showValues) {
            let value = wijmo.changeType(key, col.dataType, col.format);
            if (map && wijmo.isString(value)) { // TFS 239356
                value = map.getKeyValue(value);
            }
            if (def) def += ' or ';
            def += this._asEquals(fld, value, col.dataType);
        }

        // enclose in parenthesis if not empty
        if (def.length) {
            def = '(' + def + ')';
        }

        // all done
        return def;
    }
    private _asEquals(fld: string, value: any, type: wijmo.DataType): string {
        let def = '',
            DT = wijmo.DataType;
        if (value === '' || value == null) { // null or empty (TFS 416210, 440897)
            def += fld + ' eq null';
            if (type == DT.String) { // empty OK for strings only (TFS 442166)
                def += ' or ' + fld + ' eq \'\'';
            }
        } else if (type == DT.Date) { // non-null/empty dates (TFS 458080)
            def += fld + ' ge ' + this._asODataValue(value, type) + ' and ' +
                 fld + ' lt ' + this._asODataValue(wijmo.DateTime.addDays(value, 1), type);
        } else { // other types
            def += fld + ' eq ' + this._asODataValue(value, type);
        }
        return '(' + def + ')';
    }
    private _asODataConditionFilter(cf: wijmo.grid.filter.ConditionFilter): string {
        let c1 = this._asODataCondition(cf, cf.condition1),
            c2 = this._asODataCondition(cf, cf.condition2);
        if (c1 && c2) return '(' + c1 + (cf.and ? ' and ' : ' or ') + c2 + ')';
        if (c1) return '(' + c1 + ')';
        if (c2) return '(' + c2 + ')';
        return null;
    }
    private _asODataCondition(cf: wijmo.grid.filter.ConditionFilter, cnd: wijmo.grid.filter.FilterCondition): string {
        let col = cf.column,
            fld = col.binding,
            map = col.dataMap,
            value = cnd.value;
        if (map && wijmo.isString(value)) { // TFS 440901
            value = map.getKeyValue(value);
        }
        value = this._asODataValue(value, cf.column.dataType);
        switch (cnd.operator) {
            case 0: // EQ = 0, 
                return fld + ' eq ' + value;
            case 1: // NE = 1,
                return fld + ' ne ' + value;
            case 2: // GT = 2, 
                return fld + ' gt ' + value;
            case 3: // GE = 3, 
                return fld + ' ge ' + value;
            case 4: // LT = 4, 
                return fld + ' lt ' + value;
            case 5: // LE = 5, 
                return fld + ' le ' + value;
            case 6: // BW = 6, 
                return 'startswith(' + fld + ',' + value + ')';
            case 7: // EW = 7, 
                return 'endswith(' + fld + ',' + value + ')';
            case 8: // CT = 8, 
                return this._odv >= 4
                    ? 'contains(' + fld + ',' + value + ')' // OData4 (TFS 144207)
                    : 'substringof(' + value.toLowerCase() + ', tolower(' + fld + '))'; // OData2
            case 9: // NC = 9 
                return this._odv >= 4
                    ? 'not contains(' + fld + ',' + value + ')' // OData4
                    : 'not substringof(' + value.toLowerCase() + ', tolower(' + fld + '))'; // OData2
        }
    }
    private _asODataValue(value: any, dataType: wijmo.DataType): string {
        if (wijmo.isDate(value)) {
            if (this._showDatesAsGmt) { // convert local to GMT
                value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
            }
            value = value.toJSON();
            if (this._odv < 4) { // TFS 323961
                value = "datetime'" + value.substr(0, 10) + "'";
            }
            return value;
        } else if (wijmo.isString(value)) {
            return "'" + value.replace(/'/g, "''") + "'";
        } else if (value != null) {
            return value.toString();
        }
        return dataType == wijmo.DataType.String ? "''" : null;
    }

    // handle errors...
    private _error(xhr: XMLHttpRequest) {
        if (this.onError(new wijmo.RequestErrorEventArgs(xhr))) {
            this._getData();
            throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
        }
    }

    //https://github.com/volpav/batchjs/blob/master/src/batch.js
    private _encodeBatch(items: _IBatchRequestItem[], boundary: string): string {
        let body = [];

        // batch contains changeset (required by OData3)
        let csBoundary = 'changeset-' + boundary;
        body.push('--' + boundary,
            'Content-Type: multipart/mixed; boundary=' + csBoundary,
            '');
 
        // changeset
        items.forEach((item, index) => {
            body.push('--' + csBoundary, // + '--', // ** important!
                'Content-Type: application/http', // ** important!
                'Content-Transfer-Encoding: binary', // ** important!
                'Content-ID: ' + index, // ** important!
                '',
                item.method.toUpperCase() + ' ' + item.url + ' HTTP/1.1',
                'Host: ' + location.host);
            if (item.data) {
                body.push('Content-Type: application/json',
                    '',
                    JSON.stringify(item.data));
            }
            body.push(''); // ** important!
        });
        body.push('--' + csBoundary + '--', ''); // close changeset
        
        body.push('--' + boundary + '--', ''); // close batch
        return body.join('\r\n');
    }
}
    }
    


    module wijmo.odata {
    


'use strict';

// minimum data window size (TFS 456509)
const _MIN_DATA_WINDOW = 100;

/**
 * Extends the {@link ODataCollectionView} class to support loading data on
 * demand, using the {@link setWindow} method.
 *
 * The example below shows how you can declare an {@link ODataCollectionView} 
 * and synchronize it with a {@link wijmo.grid.FlexGrid} control to load the
 * data that is within the grid's viewport:
 *
 * ```typescript
 * // declare virtual collection view
 * let view = new wijmo.odata.ODataVirtualCollectionView(url, 'Order_Details_Extendeds', {
 *     oDataVersion: 4
 * });
 * 
 * // use virtual collection as grid data source
 * flex.itemsSource = view;
 * 
 * // update data window when the grid scrolls
 * flex.scrollPositionChanged.addHandler(() => {
 *     let rng = flex.viewRange;
 *     view.setWindow(rng.topRow, rng.bottomRow);
 * });
 * ```
 *
 * The {@link ODataVirtualCollectionView} class implements a 'data window' so only
 * data that is actually being displayed is loaded from the server. Items that are
 * not being displayed are added to the collection as null values until a call
 * to the {@link setWindow} method causes them those items to be loaded.
 *
 * This 'on-demand' method of loading data has advantages when dealing with large
 * data sets, because it prevents the application from loading data until it is
 * required. But it does impose some limitation: sorting and filtering must be
 * done on the server; grouping and paging are not supported.
 * 
 * The example below uses an {@link ODataVirtualCollectionView} to load data from
 * a NorthWind OData provider service. The collection loads data on-demant, 
 * as the user scrolls the grid:
 *
 * {@sample Grid/Data-binding/VirtualOData/purejs Example}
 */
export class ODataVirtualCollectionView extends ODataCollectionView {
    _data: any[];           // source collection
    _start = 0;             // last data window requested
    _end = 100;
    _refresh = false;       // data has been refreshed, need to re-create sourceCollection
    _loadOffset: number;
    _toSetWindow: any;
    _pendingRequest: XMLHttpRequest;
    _requestCanceled: wijmo.Event<ODataVirtualCollectionView, wijmo.EventArgs>;
    _firstLoad: boolean;

    /**
     * Initializes a new instance of the {@link ODataVirtualCollectionView} class.
     *
     * @param url Url of the OData service (for example
     * 'https://services.odata.org/Northwind/Northwind.svc/').
     * @param tableName Name of the table (entity) to retrieve from the service.
     * If not provided, a list of the tables (entities) available is retrieved.
     * @param options JavaScript object containing initialization data (property 
     * values and event handlers) for the {@link ODataVirtualCollectionView}.
     */
    constructor(url: string, tableName: string, options?: any) {

        // always page and sort on server, no grouping
        super(url, tableName, {
            pageOnServer: true,
            sortOnServer: true,
            canGroup: false
        });
        wijmo.copy(this, options);

        // initialize sourceCollection
        this._data = [];
        this.sourceCollection = this._data;

        // initialize data window
        this._firstLoad = true;
        this.setWindow(0, _MIN_DATA_WINDOW);
    }

    // ** object model

    /**
     * Sets the data window to ensure a range of records are loaded into the view.
     *
     * @param start Index of the first item in the data window.
     * @param end Index of the last item in the data window.
     */
    setWindow(start: number, end: number) {
        if (this._toSetWindow) {
            clearTimeout(this._toSetWindow);
        }
        this._toSetWindow = setTimeout(() => {
            this._toSetWindow = null;
            this._performSetWindow(start, end);
        }, 50);
    }

    /**
     * Occurs when the {@link ODataVirtualCollectionView} cancels a pending data request.
     */
    get requestCanceled(): wijmo.Event<ODataVirtualCollectionView, wijmo.EventArgs> {
        if (!this._requestCanceled) {
            this._requestCanceled = new wijmo.Event<ODataVirtualCollectionView, wijmo.EventArgs>();
        }
        return this._requestCanceled;
    }
    /**
     * Raises the {@link requestCanceled} event.
     */
    onRequestCanceled(e?: wijmo.EventArgs) {
        this.requestCanceled.raise(this, e);
    }

    // ** overrides

    /**
     * {@link ODataVirtualCollectionView} requires {@link pageOnServer} to be set to true.
     */
    get pageOnServer(): boolean {
        return true;
    }
    set pageOnServer(value: boolean) {
        if (!value) {
            throw 'ODataVirtualCollectionView requires pageOnServer = true.';
        }
    }
    /**
     * {@link ODataVirtualCollectionView} requires {@link sortOnServer} to be set to true.
     */
    get sortOnServer(): boolean {
        return true;
    }
    set sortOnServer(value: boolean) {
        if (!wijmo.asBoolean(value)) {
            throw 'ODataVirtualCollectionView requires sortOnServer = true.';
        }
    }
    /**
     * {@link ODataVirtualCollectionView} requires {@link filterOnServer} to be set to true.
     */
    get filterOnServer(): boolean {
        return true;
    }
    set filterOnServer(value: boolean) {
        if (!wijmo.asBoolean(value)) {
            throw 'ODataVirtualCollectionView requires filterOnServer = true.';
        }
    }
    /**
     * {@link ODataVirtualCollectionView} requires {@link canGroup} to be set to false.
     */
    get canGroup(): boolean {
        return this._canGroup;
    }
    set canGroup(value: boolean) {
        if (wijmo.asBoolean(value)) {
            throw 'ODataVirtualCollectionView does not support grouping.';
        }
    }

    // override to refresh source collection when needed
    _performRefresh() {
        if (!this.isLoading) {
            this._refresh = true;
        }
        super._performRefresh();
    }

    // override to apply current _skip parameter
    /*protected*/ _getReadParams(nextLink?: string): any {
        let params = super._getReadParams(nextLink);
        if (!nextLink) { // TFS 321674
            params['$skip'] = this._start || 0;
            params['$top'] = Math.max(this._end - this._start + 1, this.pageSize, _MIN_DATA_WINDOW);
        }
        return params;
    }

    // override to add items at the proper place
    /*protected*/ _storeItems(items: any[], append: boolean) {

        // re-create data source array if refreshed or number of items has changed
        if (this._refresh || this._data.length != this.totalItemCount) {
            this._data.length = this.totalItemCount;
            for (let i = 0; i < this._data.length; i++) {
                this._data[i] = new _NullValue(i); // placeholder item (not null: TFS 436264)
            }
            this._refresh = false;
        }

        // prepare to load items starting at the _skip position
        if (!append) {
            //console.log('starting batch at ' + this._skip);
            this._loadOffset = 0;
        }

        // add items at the proper spot
        //console.log('adding ' + items.length + ' items at ' + this._skip + ' + ' + this._loadOffset);
        let offset = this._loadOffset + (this._start || 0);
        for (let i = 0; i < items.length; i++) {
            this._data[i + offset] = items[i];
        }

        // increment load starting point
        this._loadOffset += items.length;

        // initialize selection (TFS 440254)
        setTimeout(() => {
            if (this._firstLoad && this.currentPosition < 0 && items.length) {
                this.moveCurrentToFirst();
            }
            this._firstLoad = false;
        });
    }

    // ** implementation

    // load records for a given window
    _performSetWindow(start: number, end: number) {

        // cancel any pending requests
        if (this._pendingRequest) {
            this._pendingRequest.abort();
            this._pendingRequest = null;
            this.onRequestCanceled();
            //console.log('pending request aborted')
        }

        // save new window
        start = wijmo.asInt(start);
        end = wijmo.asInt(end);
        wijmo.assert(start <= end, 'start must be <= end.');

        // shrink window
        let items = this._data;
        this._start = this._end = start;
        for (let i = start; i <= end && i < items.length; i++) {
            if (items[i] instanceof _NullValue) {
                this._start = i;
                break;
            };
        }
        for (let i = end; i >= this._start && i < items.length; i--) {
            if (items[i] instanceof _NullValue) {
                this._end = i;
                break;
            };
        }

        // see if we need to refresh the data
        if (this._start == this._end) {
            if (!(items[this._start] instanceof _NullValue)) {
                //console.log('already got data for the window ' + start + ' -> ' + end + ', ignoring request.');
                return;
            }
        }

        // go get the data
        //console.log('getting data from ' + top + ' -> ' + (top + this.pageSize));
        this._getData(null, (xhr) => {
            this._pendingRequest = xhr;
        });
    }
}

// placeholder for actual data values (TFS 436264)
class _NullValue {
    _id: number;
    constructor(id: number) {
        this._id = id;
    }
}
    }
    


    module wijmo.odata {
    

wijmo._registerModule('wijmo.odata', wijmo.odata);



    }
    