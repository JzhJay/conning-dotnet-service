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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var wijmo;
(function (wijmo) {
    var rest;
    (function (rest) {
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
        var RestCollectionView = /** @class */ (function (_super) {
            __extends(RestCollectionView, _super);
            /**
             * Initializes a new instance of the @see:ServerCollectionViewBase class.
             *
             * @param options JavaScript object containing initialization data (property
             * values and event handlers) for the @see:ServerCollectionView.
             */
            function RestCollectionView(options) {
                var _this = _super.call(this) || this;
                _this._loading = false;
                _this._fields = null;
                _this._keys = null;
                _this._sortOnServer = true;
                _this._pageOnServer = true;
                _this._filterOnServer = true;
                _this._totalItemCount = 0;
                /**
                 * Occurs when the @see:ServerCollectionView starts loading data.
                 */
                _this.loading = new wijmo.Event();
                /**
                 * Occurs when the @see:ServerCollectionView finishes loading data.
                 */
                _this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                _this.error = new wijmo.Event();
                if (options) {
                    wijmo.copy(_this, options);
                }
                // when sortDescriptions change, sort on server
                _this.sortDescriptions.collectionChanged.addHandler(function () {
                    if (_this.sortOnServer) {
                        _this._getData();
                    }
                });
                // go get the data
                _this._getData();
                return _this;
            }
            Object.defineProperty(RestCollectionView.prototype, "fields", {
                // ** object model
                /**
                 * Gets or sets an array containing the names of the fields to retrieve from
                 * the data source.
                 *
                 * If this property is set to null or to an empty array, all fields are
                 * retrieved.
                 */
                get: function () {
                    return this._fields;
                },
                set: function (value) {
                    if (this._fields != value) {
                        this._fields = wijmo.asArray(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "sortOnServer", {
                /**
                 * Gets or sets a value that determines whether sort operations
                 * should be performed on the server or on the client.
                 *
                 * Use the @see:sortDescriptions property to specify how the
                 * data should be sorted.
                 */
                get: function () {
                    return this._sortOnServer;
                },
                set: function (value) {
                    if (value != this._sortOnServer) {
                        this._sortOnServer = wijmo.asBoolean(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "pageOnServer", {
                /**
                 * Gets or sets a value that determines whether paging should be
                 * performed on the server or on the client.
                 *
                 * Use the @see:pageSize property to enable paging.
                 */
                get: function () {
                    return this._pageOnServer;
                },
                set: function (value) {
                    if (value != this._pageOnServer) {
                        this._pageOnServer = wijmo.asBoolean(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "filterOnServer", {
                /**
                 * Gets or sets a value that determines whether filtering should be performed on
                 * the server or on the client.
                 */
                get: function () {
                    return this._filterOnServer;
                },
                set: function (value) {
                    if (value != this._filterOnServer) {
                        this._filterOnServer = wijmo.asBoolean(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "requestHeaders", {
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
                get: function () {
                    return this._requestHeaders;
                },
                set: function (value) {
                    this._requestHeaders = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the filter definition based on a known filter provider such as the
             * @see:FlexGridFilter.
             *
             * @param filterProvider Known filter provider, typically an instance of a
             * @see:FlexGridFilter.
             */
            RestCollectionView.prototype.updateFilterDefinition = function (filterProvider) {
                if (this.filterOnServer) {
                    this._filterProvider = filterProvider;
                    this._getData();
                }
            };
            Object.defineProperty(RestCollectionView.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the @see:ServerCollectionView is
                 * currently loading data.
                 *
                 * This property can be used to provide progress indicators.
                 */
                get: function () {
                    return this._loading;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:loading event.
             */
            RestCollectionView.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
            };
            /**
             * Raises the @see:loaded event.
             */
            RestCollectionView.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Loads or re-loads the data from the server.
             */
            RestCollectionView.prototype.load = function () {
                this._getData();
            };
            /**
             * Raises the @see:error event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the @see:RequestErrorEventArgs.cancel
             * parameter to true in the event handler.
             *
             * @param e @see:ErrorEventArgs that contains information about the error.
             */
            RestCollectionView.prototype.onError = function (e) {
                this.error.raise(this, e);
                return !e.cancel;
            };
            // ** overrides
            // disable sort and filter on client if we're doing it on the server (WJM-19413)
            RestCollectionView.prototype._performRefresh = function () {
                // save settings
                var canFilter = this._canFilter, canSort = this._canSort;
                // perform refresh
                this._canFilter = !this._filterOnServer;
                this._canSort = !this._sortOnServer;
                _super.prototype._performRefresh.call(this);
                // restore settings
                this._canFilter = canFilter;
                this._canSort = canSort;
            };
            Object.defineProperty(RestCollectionView.prototype, "totalItemCount", {
                /**
                 * Gets the total number of items in the view before paging is applied.
                 */
                get: function () {
                    return this.pageOnServer
                        ? this._totalItemCount
                        : this._view.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "pageCount", {
                /**
                 * Gets the total number of pages.
                 */
                get: function () {
                    return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestCollectionView.prototype, "pageSize", {
                /**
                 * Gets or sets the number of items to display on a page.
                 */
                get: function () {
                    return this._pgSz;
                },
                set: function (value) {
                    if (value != this._pgSz) {
                        this._pgSz = wijmo.asInt(value);
                        if (this.pageOnServer) {
                            this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1); // ensure page index is valid (TFS 121226)
                            this._getData();
                        }
                        else {
                            this.refresh();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:pageChanging event.
             *
             * @param e @see:PageChangingEventArgs that contains the event data.
             */
            RestCollectionView.prototype.onPageChanging = function (e) {
                _super.prototype.onPageChanging.call(this, e);
                if (this.pageOnServer && !e.cancel) {
                    this._getData();
                }
                return !e.cancel;
            };
            /**
             * Override @see:commitNew to add the new item to the database.
             */
            RestCollectionView.prototype.commitNew = function () {
                var _this = this;
                // get new item
                var item = this.currentAddItem;
                // add new
                if (item) {
                    try {
                        var p = this.addItem(item);
                        if (p && p.then) {
                            p.then(function () { return _this.refresh(); });
                        }
                    }
                    catch (x) {
                        this._raiseError(x, true);
                    }
                }
                // allow base class
                _super.prototype.commitNew.call(this);
            };
            /**
             * Override @see:commitEdit to modify the item in the database.
             */
            RestCollectionView.prototype.commitEdit = function () {
                var _this = this;
                // commit to database
                var item = this.currentEditItem;
                if (item && !this.currentAddItem && !this._sameContent(item, this._edtClone)) {
                    if (this.items.indexOf(item) > -1) { // make sure we have this item...
                        try {
                            var p = this.patchItem(item);
                            if (p && p.then) {
                                p.then(function () { return _this.refresh(); });
                            }
                        }
                        catch (x) {
                            this._raiseError(x, true);
                        }
                    }
                }
                // allow base class
                _super.prototype.commitEdit.call(this);
            };
            /**
             * Override @see:remove to remove the item from the database.
             *
             * @param item Item to be removed from the database.
             */
            RestCollectionView.prototype.remove = function (item) {
                var _this = this;
                // remove from database
                if (item && item != this.currentAddItem) {
                    if (this.items.indexOf(item) > -1) {
                        try {
                            var p = this.deleteItem(item);
                            if (p && p.then) {
                                p.then(function () { return _this.refresh(); });
                            }
                        }
                        catch (x) {
                            this._raiseError(x, true);
                        }
                    }
                }
                // allow base class
                _super.prototype.remove.call(this, item);
            };
            // if we're paging on the server, the pageView is the view
            RestCollectionView.prototype._getPageView = function () {
                return this.pageOnServer
                    ? this._view
                    : _super.prototype._getPageView.call(this);
            };
            // ** implementation
            // get the data
            RestCollectionView.prototype._getData = function () {
                var _this = this;
                // get the data on a timeout to avoid doing it too often
                if (this._toGetData) {
                    clearTimeout(this._toGetData);
                }
                this._toGetData = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var data, error, position, x_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                // start loading
                                this._toGetData = null;
                                this._loading = true;
                                this.onLoading();
                                data = null;
                                error = null;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                position = this.currentPosition;
                                return [4 /*yield*/, this.getItems()];
                            case 2:
                                // apply the new data
                                data = _a.sent();
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
                                return [3 /*break*/, 4];
                            case 3:
                                x_1 = _a.sent();
                                error = x_1;
                                return [3 /*break*/, 4];
                            case 4:
                                // done
                                this._loading = false;
                                this.onLoaded();
                                if (error) {
                                    this._raiseError(error, false);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, 100);
            };
            // handle errors...
            RestCollectionView.prototype._raiseError = function (error, reload) {
                if (this.onError(new RESTErrorEventArgs(error))) {
                    if (reload) {
                        this._getData();
                    }
                    throw 'Server Error: ' + error;
                }
            };
            // ** virtual methods
            /**
             * Gets a Promise that returns an array containing all the items,
             * possibly filtered/paged/and sorted on the server.
             */
            RestCollectionView.prototype.getItems = function () {
                throw 'This method is virtual: it should be overridden';
                //return new Promise<any[]>(resolve => {
                //    setTimeout(() => {
                //        // ... get filtered/sorted/paged data 
                //        resolve(data);
                //    }, 1000);
                //});
            };
            /**
             * Gets a Promise that adds a new item to the database.
             */
            RestCollectionView.prototype.addItem = function (item) {
                throw 'This method is virtual: it should be overridden';
            };
            /**
             * Gets a Promise that modifies an item in the database.
             */
            RestCollectionView.prototype.patchItem = function (item) {
                throw 'This method is virtual: it should be overridden';
            };
            /**
             * Gets a Promise that removes an item from the database.
             */
            RestCollectionView.prototype.deleteItem = function (item) {
                throw 'This method is virtual: it should be overridden';
            };
            return RestCollectionView;
        }(wijmo.collections.CollectionView));
        rest.RestCollectionView = RestCollectionView;
        /**
         * Class that provides information for REST errors.
         */
        var RESTErrorEventArgs = /** @class */ (function (_super) {
            __extends(RESTErrorEventArgs, _super);
            function RESTErrorEventArgs(error) {
                var _this = _super.call(this) || this;
                _this._error = error;
                return _this;
            }
            Object.defineProperty(RESTErrorEventArgs.prototype, "error", {
                get: function () {
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            return RESTErrorEventArgs;
        }(wijmo.CancelEventArgs));
        rest.RESTErrorEventArgs = RESTErrorEventArgs;
    })(rest = wijmo.rest || (wijmo.rest = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var rest;
    (function (rest) {
        wijmo._registerModule('wijmo.rest', wijmo.rest);
    })(rest = wijmo.rest || (wijmo.rest = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.rest.js.map