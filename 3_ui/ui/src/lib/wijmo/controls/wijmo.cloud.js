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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var wijmo;
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Provides a simple way to use Google's GAPI OAuth functionality.
         *
         * To use, create an instance of the {@link OAuth2} class and add a
         * handler to the {@link userChanged} event to monitor the
         * {@link @user} property, which is non-null if a user is currently
         * signed in.
         *
         * Use the {@link signIn} and {@link signOut} methods to sign in or
         * out of the Google account.
         *
         * For example, the code below creates an {@link OAuth2} object
         * and uses it to manage a button used to log users in and out
         * of the application:
         *
         * ```typescript
         * import { OAuth2 } from '@grapecity/wijmo.cloud';
         *
         * // create OAuth2 object
         * const API_KEY = 'XXXX';
         * const CLIENT_ID = 'YYYY.apps.googleusercontent.com';
         * const SCOPES = [ 'https://www.googleapis.com/auth/userinfo.email' ];
         * const auth = new OAuth2(API_KEY, CLIENT_ID, SCOPES);
         *
         * // click a button to log in/out
         * let oAuthBtn = document.getElementById('auth_btn');
         * oAuthBtn.addEventListener('click', () => {
         *     if (auth.user) {
         *         auth.signOut();
         *     } else {
         *         auth.signIn();
         *     }
         * });
         *
         * // update button caption and accessToken when user changes
         * auth.userChanged.addHandler(s => {
         *     let user = s.user;
         *     oAuthBtn.textContent = user ? 'Sign Out' : 'Sign In';
         *     gsNWind.accessToken = user ? s.accessToken : null;
         *     fsNWind.accessToken = user ? s.accessToken : null;
         * });
         * ```
         */
        var OAuth2 = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link OAuth2} class.
             *
             * For details on the apiKey, clientID, and scope parameters,
             * please refer to
             * https://developers.google.com/identity/sign-in/web/sign-in.
             *
             * To create or edit application credentials, please refer to
             * https://console.developers.google.com/apis/credentials.
             *
             * For a list of OAuth2 scopes for Google APIs, please refer to
             * https://developers.google.com/identity/protocols/oauth2/scopes
             *
             * @param apiKey An API key string created at Google's credentials page.
             * @param clientId A client ID string created at Google's credentials page.
             * @param scopes An array of strings representing OAuth2 scopes required by the application.
             * @param options JavaScript object containing initialization data for the object.
             */
            function OAuth2(apiKey, clientId, scopes, options) {
                var _this = this;
                /**
                 * Occurs when a user signs in or out.
                 */
                this.userChanged = new wijmo.Event();
                /**
                 * Occurs when an error happens.
                 */
                this.error = new wijmo.Event();
                // ensure gapi is loaded
                this._gapi = window['gapi'];
                if (!this._gapi) {
                    var script = document.createElement('script');
                    script.src = 'https://apis.google.com/js/api.js';
                    script.onload = function () { return _this._gapiLoaded(apiKey, clientId, scopes); };
                    document.head.appendChild(script);
                }
                else {
                    this._gapiLoaded(apiKey, clientId, scopes);
                }
                // apply options
                wijmo.copy(this, options);
            }
            Object.defineProperty(OAuth2.prototype, "user", {
                /**
                 * Gets an object with information about the current user
                 * (or null if the user is not signed-in).
                 */
                get: function () {
                    var auth = this._auth();
                    if (auth && auth.isSignedIn.get()) {
                        var user = auth.currentUser.get().getBasicProfile();
                        return {
                            id: user.getId(),
                            name: user.getName(),
                            firstName: user.getGivenName(),
                            lastName: user.getFamilyName(),
                            imageUrl: user.getImageUrl(),
                            eMail: user.getEmail()
                        };
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAuth2.prototype, "accessToken", {
                /**
                 * Gets an OAuth access token that can be used to perform authorized
                 * requests.
                 */
                get: function () {
                    var token = this._gapi.auth.getToken();
                    return token ? token.access_token : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OAuth2.prototype, "idToken", {
                /**
                 * Gets an OAuth id token that can be passed to the Firebase client
                 * libraries.
                 *
                 * See https://firebase.google.com/docs/auth/web/google-signin
                 * ```typescript
                 * let credential = firebase.auth.GoogleAuthProvider.credential(id_token);
                 * firebase.auth().signInWithCredential(credential);
                 * ```
                 */
                get: function () {
                    var token = this._gapi.auth.getToken();
                    return token ? token.id_token : null;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Signs a user in.
             */
            OAuth2.prototype.signIn = function () {
                var _this = this;
                this._auth().signIn().then(function (response) {
                    // signed in OK
                }, function (error) {
                    if (error != 'popup_closed_by_user') {
                        _this.onError(new OAuthError(error));
                    }
                });
            };
            /**
             * Signs a user out.
             */
            OAuth2.prototype.signOut = function () {
                this._auth().signOut();
            };
            /**
             * Raises the {@link userChanged} event.
             */
            OAuth2.prototype.onUserChanged = function (e) {
                this.userChanged.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             */
            OAuth2.prototype.onError = function (e) {
                this.error.raise(this, e);
            };
            // ** implementation
            // load oauth2, initialize API client, listen for changes
            OAuth2.prototype._gapiLoaded = function (apiKey, clientId, scopes) {
                var _this = this;
                // ensure gapi is loaded
                var gapi = this._gapi = window['gapi'];
                wijmo.assert(gapi, 'Failed to load google gapi.');
                // load auth2
                gapi.load('client:auth2', function () {
                    // convert scopes array into a space-separated string
                    var strScopes = scopes && scopes.length ? scopes.join(' ') : '';
                    // make sure we have at least the email scope
                    strScopes = strScopes || 'https://www.googleapis.com/auth/userinfo.email';
                    // initialize API client library
                    gapi.client.init({
                        apiKey: apiKey,
                        clientId: clientId,
                        scope: strScopes
                    }).then(function () {
                        //let grantedScopes = this._auth().getInitialScopes();
                        // listen for sign-in state changes
                        _this._auth().isSignedIn.listen(function () {
                            _this.onUserChanged();
                        });
                        // handle the initial sign-in state
                        _this.onUserChanged();
                    }, function (error) {
                        _this.onError(new OAuthError(error));
                    });
                });
            };
            // get auth
            OAuth2.prototype._auth = function () {
                return this._gapi && this._gapi.auth2
                    ? this._gapi.auth2.getAuthInstance()
                    : null;
            };
            return OAuth2;
        }());
        cloud.OAuth2 = OAuth2;
        /**
         * Represents an error that occurred in the authorization process.
         */
        var OAuthError = /** @class */ (function (_super) {
            __extends(OAuthError, _super);
            /**
             * Initializes a new instance of an {@link OAuthError} object.
             * @param error Object containing information about the error.
             */
            function OAuthError(error) {
                var _this = _super.call(this) || this;
                _this._error = error;
                return _this;
            }
            Object.defineProperty(OAuthError.prototype, "error", {
                /**
                 * Gets an object that contains information about the error.
                 */
                get: function () {
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            return OAuthError;
        }(wijmo.EventArgs));
        cloud.OAuthError = OAuthError;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Extends the {@link CollectionView} class to provide access to
         * Firestore collections.
         *
         * The {@link Snapshot} class provides functionality similar to that
         * provided by the {@link Collection} class, except it provides
         * real-time updates.
         *
         * If other applications make changes to the data, the {@link Snapshot}
         * will be updated automatically.
         *
         * This class requires the use of the Firestore client libraries.
         * For information on how to add the libraries to your projects,
         * please see https://firebase.google.com/docs/web/setup.
         *
         * You can use the {@link OAuth2} component to obtain a token and
         * authorize your application to use the Firestore client libraries.
         *
         * For example, assuming you have an {@link OAuth2} component
         * named "auth", you can listen to the userChanged event and apply
         * the token as follows:
         *
         * ```typescript
         * // update credentials when user changes
         * auth.userChanged.addHandler(s => {
         *     let user = auth.user;
         *     oAuthBtn.textContent = user ? 'Sign Out' : 'Sign In';
         *     let credential = firebase.auth.GoogleAuthProvider.credential(auth.idToken);
         *     firebase.auth().signInWithCredential(credential)
         *         .then(() => console.log('logged in ok'))
         *         .catch(error => console.log('log in failed:', error));
         * });
         *
         * For more information about Firebase authentication, please
         * refer to https://firebase.google.com/docs/auth/web/google-signin.
         */
        var Snapshot = /** @class */ (function (_super) {
            __extends(Snapshot, _super);
            /**
             * Initializes a new instance of the {@link Snapshot} class.
             *
             * @param collection Firestore client library **CollectionRef** object.
             * @param options JavaScript object containing initialization data (property values
             * and event handlers) for this {@link Snapshot}.
             *
             * For example:
             * ```typescript
             * // initialize Firestore client SDK
             * const firebaseConfig = {
             *     apiKey: "...",
             *     ...
             * };
             * firebase.initializeApp(firebaseConfig);
             * const db = firebase.firestore();
             *
             * // create a Snapshot for the 'restaurants' collection
             * // where type is 'Japanese' or 'Italian'.
             * const restaurants = db.collection('restaurants');
             * const view = new Snapshot(restaurants, {
             *     query: restaurants.where('type', 'in', ['Japanese', 'Italian' ])
             * });
             * ```
             */
            function Snapshot(collection, options) {
                var _this = _super.call(this) || this;
                _this._loading = false;
                _this._deferCommits = false;
                _this._hasPendingChanges = false;
                // ** events
                /**
                 * Occurs when the {@link Snapshot} starts loading data.
                 */
                _this.loading = new wijmo.Event();
                /**
                 * Occurs when the {@link Snapshot} finishes loading data.
                 */
                _this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                _this.error = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link hasPendingChanges} property changes.
                 *
                 * See also the {@link deferCommits} property.
                 */
                _this.hasPendingChangesChanged = new wijmo.Event();
                // save reference to collection object
                _this._checkType('CollectionReference', collection, 'firestore', 'doc', 'onSnapshot');
                _this._collection = collection;
                // apply options
                wijmo.copy(_this, options);
                // keep track of whether we have changes
                _this.itemsEdited.collectionChanged.addHandler(_this._updateHasChanges, _this);
                _this.itemsAdded.collectionChanged.addHandler(_this._updateHasChanges, _this);
                _this.itemsRemoved.collectionChanged.addHandler(_this._updateHasChanges, _this);
                // go get the data
                _this._getData();
                return _this;
            }
            Object.defineProperty(Snapshot.prototype, "query", {
                /**
                 * Gets or sets a Firestore client library **Query** object used to
                 * retrieve the data.
                 *
                 * If provided, the query should be based on the {@link collection}
                 * used to create this {@link Snapshot}.
                 *
                 * Use this property to define the data you want to retrieve from the
                 * source collection. You can apply filters, data limits, and sorting.
                 *
                 * For example, the code below causes the {@link Snapshot} to return
                 * restaurants of type "Japanese" or "German":
                 *
                 * ```typescript
                 * // create the Snapshot
                 * const db = firebase.firestore();
                 * const restaurants = db.collection('restaurants');
                 * const snapshot = new Snapshot(restaurants, {
                 *     query: restaurants.where('type', 'in', ['Japanese', 'German' ])
                 * });
                 * ```
                 */
                get: function () {
                    return this._query;
                },
                set: function (value) {
                    if (value != this._query) {
                        this._checkType('Query', value, 'firestore', 'onSnapshot');
                        this._query = value;
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Snapshot.prototype, "deferCommits", {
                /**
                 * Gets or sets a value that causes the {@link Snapshot} to defer
                 * commits back to the database.
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
                 */
                get: function () {
                    return this._deferCommits;
                },
                set: function (value) {
                    this._deferCommits = wijmo.asBoolean(value);
                    if (this.deferCommits) {
                        this.trackChanges = true;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Commits all pending changes to the server.
             *
             * Changes are contained in the {@link itemsEdited}, {@link itemsAdded},
             * and {@link itemsRemoved} collections, and are automatically cleared
             * after they are committed.
             *
             * See also the {@link deferCommits} property.
             */
            Snapshot.prototype.commitChanges = function () {
                var _this = this;
                // perform pending edits, additions, removals in a transaction:
                if (this.deferCommits) {
                    // send the operations to the server
                    if (this.hasPendingChanges) {
                        // create batch
                        var batch_1 = this._collection.firestore.batch();
                        // add batch operations
                        this.itemsEdited.forEach(function (item) {
                            var doc = _this._getItemDoc(item), data = _this._getItemData(item);
                            batch_1.update(doc, data);
                        });
                        this.itemsAdded.forEach(function (item) {
                            var doc = _this._getItemDoc(item), data = _this._getItemData(item);
                            batch_1.set(doc, data);
                        });
                        this.itemsRemoved.forEach(function (item) {
                            var doc = _this._getItemDoc(item);
                            batch_1.delete(doc);
                        });
                        // commit batch
                        batch_1.commit()
                            .then(function () {
                            _this.clearChanges();
                            _this._getData(true); // to get the updated data
                        })
                            .catch(function (err) { return _this._raiseError(err, true); });
                    }
                }
            };
            /**
             * Cancels all changes by removing all items in the {@link itemsAdded},
             * {@link itemsRemoved}, and {@link itemsEdited} collections,
             * without committing them to the server.
             *
             * This method is used with the {@link deferCommits} property.
             */
            Snapshot.prototype.cancelChanges = function () {
                if (this.deferCommits) {
                    this.clearChanges();
                    this._getData(true);
                }
            };
            Object.defineProperty(Snapshot.prototype, "hasPendingChanges", {
                /**
                 * Gets a value that determines whether the {@link Snapshot} has
                 * pending changes.
                 *
                 * See also the {@link deferCommits} property and the
                 * {@link commitChanges} and {@link cancelChanges} methods.
                 */
                get: function () {
                    if (this.deferCommits) {
                        return this.itemsAdded.length > 0 ||
                            this.itemsEdited.length > 0 ||
                            this.itemsRemoved.length > 0;
                    }
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Snapshot.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the {@link Snapshot} is currently loading data.
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
             * Loads or re-loads the collection data.
             * @param keepPosition Whether to keep or reset the cursor position.
             */
            Snapshot.prototype.load = function (keepPosition) {
                this._getData(keepPosition);
            };
            /**
             * Raises the {@link loading} event.
             */
            Snapshot.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link loaded} event.
             */
            Snapshot.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the {@link FirestoreErrorEventArgs.cancel}
             * parameter to true in the event handler.
             *
             * @param e {@link FirestoreErrorEventArgs} that contains information about the error.
             */
            Snapshot.prototype.onError = function (e) {
                if (this._loading) {
                    this._loading = false;
                    this.onLoaded();
                }
                this.error.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link hasPendingChangesChanged} event.
             */
            Snapshot.prototype.onHasPendingChangesChanged = function (e) {
                this.hasPendingChangesChanged.raise(this, e);
            };
            // ** overrides
            /**
             * Override {@link commitNew} to add the new item to the database.
             */
            Snapshot.prototype.commitNew = function () {
                var _this = this;
                if (!this.deferCommits) {
                    var item = this.currentAddItem;
                    if (item) {
                        this._collection.add(this._getItemData(item))
                            //.then(() => console.log('added OK'))
                            .catch(function (err) { return _this._raiseError(err, true); });
                    }
                }
                _super.prototype.commitNew.call(this);
            };
            /**
             * Override {@link commitEdit} to modify the item in the database.
             */
            Snapshot.prototype.commitEdit = function () {
                var _this = this;
                if (!this.deferCommits) {
                    var item = this.currentEditItem;
                    if (item && !this.currentAddItem && this._getChangedFields(item, this._edtClone)) {
                        var doc = this._getItemDoc(item), data = this._getItemData(item);
                        doc.update(data)
                            // not needed with snapshots
                            //.then(() => {
                            //    if (this._query) {
                            //        // refresh the data in case the item left the query                            
                            //        this._getData(true);
                            //    }
                            //})
                            .catch(function (err) { return _this._raiseError(err, true); });
                    }
                }
                _super.prototype.commitEdit.call(this);
            };
            /**
             * Override {@link remove} to remove the item from the database.
             *
             * @param item Item to be removed from the database.
             */
            Snapshot.prototype.remove = function (item) {
                var _this = this;
                if (!this.deferCommits) {
                    if (item && item != this.currentAddItem) {
                        var doc = this._getItemDoc(item);
                        doc.delete()
                            //.then(() => console.log('deleted OK'))
                            .catch(function (err) { return _this._raiseError(err, true); });
                    }
                }
                _super.prototype.remove.call(this, item);
            };
            // ** implementation
            // raise error event, optionally re-load the data
            Snapshot.prototype._raiseError = function (error, reload) {
                this.onError(new FirestoreErrorEventArgs(error));
                if (reload) {
                    this._getData(true);
                }
            };
            // keep track of whether we have pending changes
            Snapshot.prototype._updateHasChanges = function () {
                var hasPendingChanges = this.hasPendingChanges;
                if (hasPendingChanges != this._hasPendingChanges) {
                    this._hasPendingChanges = hasPendingChanges;
                    this.onHasPendingChangesChanged();
                }
            };
            // gets the document represented by a given item
            Snapshot.prototype._getItemDoc = function (item) {
                var id = item && item.$META
                    ? item.$META.id // existing item
                    : this._generateID(); // new item
                return this._collection.doc(id);
            };
            // creates an object with the item's data
            Snapshot.prototype._getItemData = function (item) {
                var data = {}, calcFields = this.calculatedFields;
                for (var k in item) {
                    if (!calcFields || !(k in calcFields)) {
                        if (k != '$META') {
                            data[k] = item[k];
                        }
                    }
                }
                return data;
            };
            // loads the data into this CollectionView
            Snapshot.prototype._getData = function (keepPosition) {
                var _this = this;
                if (this._toGetData) {
                    clearTimeout(this._toGetData);
                }
                this._toGetData = setTimeout(function () {
                    // prepare to load
                    _this._toGetData = null;
                    _this._loading = true;
                    if (_this.onLoading(new wijmo.CancelEventArgs())) {
                        // unsubscribe from previous snapshot
                        if (_this._unsubscribe) {
                            _this._unsubscribe();
                        }
                        // get the data from query or from collection
                        //this._getQuery()
                        //    .get().then(snapshot => {
                        _this._unsubscribe = _this._getQuery()
                            .onSnapshot(function (snapshot) {
                            var arr = [], position = (keepPosition || !_this._loading) ? _this.currentPosition : null;
                            // REVIEW: if only one item changed, we could update only that one and keep
                            // the same sourceCollection...
                            //snapshot.docChanges().forEach(function(change) {
                            //    if (change.type === "added") console.log("New item: ", change.doc.data());
                            //    if (change.type === "modified") console.log("Modified item: ", change.doc.data());
                            //    if (change.type === "removed") console.log("Removed item: ", change.doc.data());
                            //});                        
                            snapshot.forEach(function (doc) {
                                arr.push(__assign({ $META: {
                                        id: doc.id
                                    } }, doc.data()));
                            });
                            _this.sourceCollection = arr;
                            // done loading
                            if (position != null) {
                                _this.moveCurrentToPosition(position);
                            }
                            if (_this._loading) {
                                _this._loading = false;
                                _this.onLoaded();
                            }
                        }, function (err) { return _this._raiseError(err, true); });
                    }
                }, wijmo.Control._REFRESH_INTERVAL);
            };
            // generate a new random/unique id
            Snapshot.prototype._generateID = function () {
                var id = '';
                while (id.length < 20) {
                    id += Math.random().toString(36).substr(2, 5);
                }
                return id;
            };
            // checks whether an object contains the expected/required methods/properties
            Snapshot.prototype._checkType = function (name, value) {
                var props = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    props[_i - 2] = arguments[_i];
                }
                if (value != null) {
                    for (var i = 0; i < props.length; i++) {
                        var prop = props[i];
                        if (value[prop] == null) {
                            wijmo.assert(false, 'Expected "' + name + '" but the value does not have "' + prop + '".');
                        }
                    }
                }
            };
            // build query to get data
            Snapshot.prototype._getQuery = function () {
                // start with base query
                var q = this._query || this._collection;
                // filter on server
                // sort on server
                // page on server
                // done
                return q;
            };
            return Snapshot;
        }(wijmo.collections.CollectionView));
        cloud.Snapshot = Snapshot;
        /**
         * Represents an error raised by the Firestore client libraries.
         */
        var FirestoreErrorEventArgs = /** @class */ (function (_super) {
            __extends(FirestoreErrorEventArgs, _super);
            /**
             * Initializes a new instance of the {@link FirestoreErrorEventArgs} class.
             *
             * @param error Error raised by the Firestore client libraries.
             */
            function FirestoreErrorEventArgs(error) {
                var _this = _super.call(this) || this;
                _this._error = error;
                return _this;
            }
            Object.defineProperty(FirestoreErrorEventArgs.prototype, "error", {
                get: function () {
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FirestoreErrorEventArgs.prototype, "message", {
                get: function () {
                    return this._error.message;
                },
                enumerable: true,
                configurable: true
            });
            return FirestoreErrorEventArgs;
        }(wijmo.CancelEventArgs));
        cloud.FirestoreErrorEventArgs = FirestoreErrorEventArgs;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Extends the {@link CollectionView} class to provide access to an
         * individual sheet in a {@link GoogleSheet} object.
         *
         * {@link Sheet} objects may be created by setting the {@link sheets}
         * property when creating a {@link GoogleSheet} object or by invoking
         * the {@link Sheet} constructor directly. For example:
         *
         * ```typescript
         * import { GoogleSheet, Sheet } from '@grapecity/wijmo.cloud';
         *
         * // create a GoogleSheet with three Sheets
         * const SHEET_ID_NW = '1qnf-FCONZj_AmOlyNkpIA3mKvP8FQtVOr7K8Awpo360';
         * const API_KEY = 'AIzaSyCvuXEzP57I5CQ9ifZDG2_K8M3nDa1LOPE';
         * let gsNWind = new GoogleSheet(SHEET_ID_NW, API_KEY, {
         *     sheets: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         *
         * // create an additional Sheet by calling the constructor
         * let customers = new Sheet(gsNWind, 'Customers');
         * ```
         *
         * The {@link Sheet} class assumes that the data is stored in table
         * format, where each column has a title (unique string) on the
         * first cell, followed by data of any type (strings, numbers,
         * dates, or booleans).
         *
         * The {@link Sheet} data is read in one step when the {@link Sheet}
         * is created. Once loaded, the data can be filtered, paginated,
         * sorted, and grouped on the client.
         *
         * If the parent {@link GoogleSheet} has permissions (see the
         * {@link GoogleSheet.accessToken} property), the {@link Sheet}
         * can also perform CRUD operations using the {@link addNew},
         * {@link remove}, and {@link editItem} methods.
         *
         * In most applications, the {@link Sheet} objects are used as
         * data sources for grid controls such as the {@link FlexGrid}
         * or {@link MultiRow} grid. For example:
         *
         * ```typescript
         * import { GoogleSheet, Sheet } from '@grapecity/wijmo.cloud';
         * import { FlexGrid } from '@grapecity/wijmo.cloud';
         *
         * // create a GoogleSheet with three Sheets
         * const SHEET_ID_NW = '1qnf-FCONZj_AmOlyNkpIA3mKvP8FQtVOr7K8Awpo360';
         * const API_KEY = 'AIzaSyCvuXEzP57I5CQ9ifZDG2_K8M3nDa1LOPE';
         * let gsNWind = new GoogleSheet(SHEET_ID_NW, API_KEY, {
         *     sheets: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         *
         * // use a Sheet as an itemsSource for a FlexGrid control:
         * let theGrid = new FlexGrid('#theGrid', {
         *     allowAddNew: true,
         *     allowDelete: true,
         *     itemsSource: gsNWind.getSheet('Products'),
         * });
         * ```
         */
        var Sheet = /** @class */ (function (_super) {
            __extends(Sheet, _super);
            /**
             * Initializes a new instance of the {@link Sheet} class.
             *
             * @param googleSheet {@link GoogleSheet} that owns this {@link Sheet}.
             * @param title Title of the {@link Sheet} to load.
             * @param id ID of the {@link Sheet}.
             */
            function Sheet(googleSheet, title, id) {
                var _this = _super.call(this) || this;
                _this._loading = false;
                /**
                 * Occurs when the {@link Sheet} starts loading data.
                 */
                _this.loading = new wijmo.Event();
                /**
                 * Occurs when the {@link Sheet} finishes loading data.
                 */
                _this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                _this.error = new wijmo.Event();
                _this._gSheet = googleSheet;
                _this._title = title;
                _this._id = id;
                _this._getData();
                googleSheet.accessTokenChanged.addHandler(function () {
                    if (googleSheet.accessToken && !_this.items.length) {
                        _this._getData(true);
                    }
                });
                return _this;
            }
            Object.defineProperty(Sheet.prototype, "googleSheet", {
                /**
                 * Gets the {@link GoogleSheet} that contains this {@link Sheet}.
                 */
                get: function () {
                    return this._gSheet;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sheet.prototype, "title", {
                /**
                 * Gets the title of this {@link Sheet}.
                 */
                get: function () {
                    return this._title;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Loads or re-loads the sheet data.
             * @param keepPosition Whether to keep the cursor position.
             */
            Sheet.prototype.load = function (keepPosition) {
                this._getData(keepPosition);
            };
            Object.defineProperty(Sheet.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the {@link Sheet} is currently loading data.
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
             * Raises the {@link loading} event.
             * @param e {@link CancelEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Sheet.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link loaded} event.
             */
            Sheet.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the {@link RequestErrorEventArgs.cancel}
             * parameter to true in the event handler.
             *
             * @param e {@link RequestErrorEventArgs} that contains information about the error.
             */
            Sheet.prototype.onError = function (e) {
                if (this._loading) {
                    this._loading = false;
                    this.onLoaded();
                }
                this.error.raise(this, e);
                return !e.cancel;
            };
            // ** overrides
            /**
             * Override {@link commitNew} to add the new item to the database.
             */
            Sheet.prototype.commitNew = function () {
                var item = this.currentAddItem;
                if (item) {
                    this._saveItem(item);
                }
                _super.prototype.commitNew.call(this);
            };
            /**
             * Override {@link commitEdit} to modify the item in the database.
             */
            Sheet.prototype.commitEdit = function () {
                var item = this.currentEditItem;
                if (item && !this.currentAddItem && this._getChangedFields(item, this._edtClone)) {
                    this._saveItem(item);
                }
                _super.prototype.commitEdit.call(this);
            };
            /**
             * Override {@link remove} to remove the item from the database.
             *
             * @param item Item to be removed from the database.
             */
            Sheet.prototype.remove = function (item) {
                var _this = this;
                // remove from database
                if (item && item != this.currentAddItem) {
                    // get item index in the source collection
                    var index = this.sourceCollection.indexOf(item);
                    wijmo.assert(index > -1, 'Item not found.');
                    // convert item index to row index (zero-based + header)
                    var rowIndex = index + 1;
                    // we need an id to delete items
                    wijmo.assert(this._id != null, 'Sheet doesn\'t have an ID ? ');
                    // delete the item
                    var gs = this.googleSheet, url = gs._getUrl(':batchUpdate');
                    wijmo.httpRequest(url, {
                        method: 'POST',
                        requestHeaders: gs._getRequestHeaders(),
                        data: {
                            requests: [{
                                    deleteDimension: {
                                        range: {
                                            sheetId: this._id,
                                            dimension: 'ROWS',
                                            startIndex: rowIndex,
                                            endIndex: rowIndex + 1 // not included
                                        }
                                    }
                                }]
                        },
                        error: function (xhr) { return _this._handleError(xhr, false); }
                    });
                }
                // allow base class
                _super.prototype.remove.call(this, item);
            };
            // ** implementation
            // get the data on a timeOut, position cursor
            Sheet.prototype._getData = function (keepPosition) {
                var _this = this;
                // get the data on a timeout to avoid doing it too often
                if (this._toGetData) {
                    clearTimeout(this._toGetData);
                }
                this._toGetData = setTimeout(function () {
                    // start loading
                    _this._loading = true;
                    _this._itemKeys = null;
                    if (_this.onLoading(new wijmo.CancelEventArgs())) {
                        var position_1 = _this.currentPosition;
                        // read a range with *one* row of formatted *date/time* values
                        var gs_1 = _this.googleSheet, url = gs_1._getUrl('/values/' + _this.title + '!2:2');
                        wijmo.httpRequest(url, {
                            requestHeaders: gs_1._getRequestHeaders(),
                            data: {
                                valueRenderOption: 'UNFORMATTED_VALUE',
                                dateTimeRenderOption: 'FORMATTED_STRING'
                            },
                            success: function (xhr) {
                                // got the row with formatted date/time values
                                var data = JSON.parse(xhr.responseText), formatted = data.values[0];
                                // now that we have that, go read the unformatted values
                                var url = gs_1._getUrl('/values/' + _this.title);
                                wijmo.httpRequest(url, {
                                    requestHeaders: gs_1._getRequestHeaders(),
                                    data: {
                                        valueRenderOption: 'UNFORMATTED_VALUE',
                                        dateTimeRenderOption: 'SERIAL_NUMBER'
                                    },
                                    success: function (xhr) {
                                        // parse the data
                                        var data = JSON.parse(xhr.responseText), rows = data.values;
                                        _this.sourceCollection = _this._parseData(rows, formatted);
                                        // restore position
                                        if (keepPosition) {
                                            _this.moveCurrentToPosition(position_1);
                                        }
                                        // done loading
                                        _this._loading = false;
                                        _this.onLoaded();
                                    },
                                    error: function (xhr) { return _this._handleError(xhr, false); }
                                });
                            },
                            error: function (xhr) { return _this._handleError(xhr, false); }
                        });
                    }
                }, wijmo.Control._REFRESH_INTERVAL);
            };
            // parse the data received after a get request
            Sheet.prototype._parseData = function (rows, formatted) {
                var arr = [];
                // check whether the first row contains column names (unique strings)
                var names = rows[0], hasNames = true;
                for (var i = 0; i < names.length && hasNames; i++) {
                    var name_1 = names[i];
                    if (!name_1 || !wijmo.isString(name_1) || names.indexOf(name_1) != i) {
                        hasNames = false;
                    }
                }
                // save or create column names 
                if (!hasNames) {
                    var letters = [];
                    for (var i = 0; i < names.length; i++) {
                        letters.push(this._toSheetHeader(i)); // convert column index into A, B, C, ...
                    }
                    names = letters;
                }
                else {
                    rows.splice(0, 1); // remove column names from data array
                }
                this._itemKeys = names;
                // get column data types based on user-provided information
                var dataTypes = [], colTypes = this._gSheet.columnDataTypes, DT = wijmo.DataType;
                names.forEach(function (name) {
                    var dt = DT.Object;
                    if (colTypes) {
                        colTypes.forEach(function (cdt) {
                            if (cdt.pattern.test(name)) { // || cdt.pattern.test(this.title + '!' + name)) {
                                dt = cdt.dataType;
                                //console.log('column', name, 'has type', DataType[dt]);
                            }
                        });
                    }
                    dataTypes.push(dt);
                });
                // parse rows
                rows.forEach(function (row) {
                    var item = {};
                    names.forEach(function (name, index) {
                        // get raw value
                        var value = row[index], fValue = formatted[index], type = dataTypes[index];
                        // automatic date conversion
                        if (type == DT.Object && wijmo.isNumber(value) && wijmo.isString(fValue) && fValue.length) {
                            //console.log('column', name, 'seems to be a Date column');
                            type = DT.Date;
                        }
                        // convert data to the proper type
                        if (type != DT.Object) {
                            value = (type == DT.Date && wijmo.isNumber(value))
                                ? new Date((value - (25567 + 1)) * 86400 * 1000)
                                : wijmo.changeType(value, type);
                        }
                        // store the value
                        item[name] = value;
                    });
                    // store the item
                    arr.push(item);
                });
                // done
                return arr;
            };
            // convert index (0, 1, 2, ...) into column header string (A, B, C, ...)
            Sheet.prototype._toSheetHeader = function (i) {
                return i < 26
                    ? String.fromCharCode(65 + i)
                    : this._toSheetHeader(Math.floor(i / 26) - 1) + this._toSheetHeader(i % 26);
            };
            // saves a given item (new or modified) to the sheet
            Sheet.prototype._saveItem = function (item) {
                var _this = this;
                // get item index in the source collection
                var index = this.sourceCollection.indexOf(item);
                wijmo.assert(index > -1, 'Item not found?');
                // get the data for the row
                var rowData = [];
                this._itemKeys.forEach(function (key) {
                    var val = item[key];
                    rowData.push(val != null ? val.toString() : '');
                });
                // commit to database
                var gs = this.googleSheet, rowIndex = (index + 2).toString(), // one-based + header
                range = this.title + '!A' + rowIndex + ':Z' + rowIndex, url = gs._getUrl('/values/' + range);
                url += (url.indexOf('?key=') > -1 ? '&' : '?') + 'valueInputOption=USER_ENTERED';
                wijmo.httpRequest(url, {
                    method: 'PUT',
                    requestHeaders: gs._getRequestHeaders(),
                    data: {
                        range: range,
                        values: [rowData]
                    },
                    error: function (xhr) { return _this._handleError(xhr, true); }
                });
            };
            // handle request errors
            Sheet.prototype._handleError = function (xhr, reload) {
                this.onError(new wijmo.RequestErrorEventArgs(xhr));
                if (reload) {
                    this._getData(true);
                }
            };
            return Sheet;
        }(wijmo.collections.CollectionView));
        cloud.Sheet = Sheet;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Represents a Google Sheets spreadsheet with one or more sheets.
         *
         * Each sheet is represented by a {@link Sheet} object that exposes
         * the data on the sheet as a {@link CollectionView} object which
         * can be used as a data source for any Wijmo control.
         *
         * In addition to full CRUD support you get all the {@link CollectionView}
         * features including sorting, filtering, paging, and grouping.
         * The sorting, filtering, and paging functions are performed on the
         * on the client.
         *
         * The code below shows how you can instantiate a {@link GoogleSheet}
         * object that loads data from three sheets:
         *
         * ```typescript
         * import { GoogleSheet } from '@grapecity/wijmo.cloud';
         * const SHEET_ID_NW = '1qnf-FCONZj_AmOlyNkpIA3mKvP8FQtVOr7K8Awpo360';
         * const API_KEY = 'AIzaSyCvuXEzP57I5CQ9ifZDG2_K8M3nDa1LOPE';
         * let gsNWind = new GoogleSheet(SHEET_ID_NW, API_KEY, {
         *     sheets: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         * ```
         */
        var GoogleSheet = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link GoogleSheet} class.
             *
             * @param sheetId Parameter used to identify which GoogleSheet is to be accessed.
             * This ID is the value between the "/d/" and the "/edit" in the URL of your GoogleSheet.
             * @param apiKey Identifier used to authenticate requests associated with the app.
             * To generate API keys, please go to https://console.cloud.google.com/.
             * @param options JavaScript object containing initialization data (property values
             * and event handlers) for this {@link GoogleSheet}.
             */
            function GoogleSheet(sheetId, apiKey, options) {
                this._sheetId = '';
                this._accessToken = '';
                this._apiKey = '';
                this._loading = false;
                this._sheets = new wijmo.collections.ObservableArray();
                /**
                 * Occurs when the {@link GoogleSheet} starts loading data.
                 */
                this.loading = new wijmo.Event();
                /**
                 * Occurs when the {@link GoogleSheet} finishes loading data.
                 */
                this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                this.error = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link accessToken} property changes.
                 */
                this.accessTokenChanged = new wijmo.Event();
                this._sheetId = wijmo.asString(sheetId, false);
                this._apiKey = wijmo.asString(apiKey, false);
                wijmo.copy(this, options);
                this._getSheetInfo();
            }
            Object.defineProperty(GoogleSheet.prototype, "sheetId", {
                /**
                 * Gets the ID of this {@link GoogleSheet}.
                 */
                get: function () {
                    return this._sheetId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoogleSheet.prototype, "apiKey", {
                /**
                 * Gets the API key that this {@link GoogleSheet} is associated with.
                 */
                get: function () {
                    return this._apiKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoogleSheet.prototype, "accessToken", {
                /**
                 * Gets or sets the OAuth 2.0 access token used to gain write
                 * access to the sheet.
                 *
                 * You can use the {@link OAuth2} class to provide user authentication.
                 * The {@link OAuth2} class has methods that allow users to log in and
                 * provides {@link accessToken} strings that can be used to access
                 * the sheet.
                 */
                get: function () {
                    return this._accessToken;
                },
                set: function (value) {
                    if (value != this._accessToken) {
                        this._accessToken = wijmo.asString(value);
                        this.onAccessTokenChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoogleSheet.prototype, "columnDataTypes", {
                /**
                 * Gets or sets an array containing {@link IColumnDataType} objects
                 * that determine the data types for the sheet columns.
                 *
                 * Column data types are determined automatically based on the sheet
                 * data. In some cases, however, you may want to override that and set
                 * the column data types explicitly. This may be useful for sheets
                 * that contain empty cells or columns with cells of mixed types.
                 *
                 * The code below causes the {@link GoogleSheet} to parse columns
                 * named "PostalCode", "Phone", and "Fax" as strings and any columns
                 * with names ending in "Date" as dates:
                 *
                 * ```typescript
                 * import { DataType } from '@grapecity/wijmo';
                 * import { GoogleSheet } from '@grapecity/google';
                 * let ssNWind = new GoogleSheet(SHEET_ID_NW, {
                 *     apiKey: API_KEY,
                 *     columnDataTypes: [
                 *         { pattern: /^(PostalCode|Phone|Fax)$/, dataType: DataType.String },
                 *         { pattern: /Date$/, dataType: DataType.Date },
                 *     ]
                 * });
                 * ```
                 */
                get: function () {
                    return this._colTypes;
                },
                set: function (value) {
                    this._colTypes = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoogleSheet.prototype, "sheets", {
                /**
                 * Gets the list of {@link Sheet} objects in this {@link GoogleSheet}.
                 */
                get: function () {
                    return this._sheets;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a {@link Sheet} by its {@link Sheet.title}.
             *
             * @param title Sheet title to look for.
             */
            GoogleSheet.prototype.getSheet = function (title) {
                for (var i = 0; i < this._sheets.length; i++) {
                    var sheet = this._sheets[i];
                    if (sheet.title == title) {
                        return sheet;
                    }
                }
                return null;
            };
            Object.defineProperty(GoogleSheet.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the {@link GoogleSheet} is
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
             * Raises the {@link loading} event.
             */
            GoogleSheet.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
            };
            /**
             * Raises the {@link loaded} event.
             */
            GoogleSheet.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the {@link RequestErrorEventArgs.cancel}
             * parameter to true in the event handler.
             *
             * @param e {@link RequestErrorEventArgs} that contains information about the error.
             */
            GoogleSheet.prototype.onError = function (e) {
                if (this._loading) {
                    this._loading = false;
                    this.onLoaded();
                }
                this.error.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link accessTokenChanged} event.
             */
            GoogleSheet.prototype.onAccessTokenChanged = function (e) {
                this.accessTokenChanged.raise(this, e);
            };
            // ** implementation
            // used in initialization
            GoogleSheet.prototype._copy = function (key, value) {
                var _this = this;
                if (key == 'sheets' && wijmo.isArray(value)) {
                    value.forEach(function (title) {
                        var sheet = new cloud.Sheet(_this, title);
                        _this.sheets.push(sheet);
                    });
                    return true;
                }
                return false;
            };
            // gets GoogleSheets' REST API URL for this sheet
            GoogleSheet.prototype._getUrl = function (params) {
                var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + this.sheetId;
                if (params) {
                    url += params;
                }
                if (this.apiKey) {
                    url += '?key=' + this.apiKey;
                }
                return url;
            };
            // gets the request headers including the OAuth access token
            GoogleSheet.prototype._getRequestHeaders = function () {
                var rh = {
                    'Content-Type': 'application/json'
                };
                if (this.accessToken) {
                    rh.Authorization = 'Bearer ' + this.accessToken;
                }
                return rh;
            };
            // retrieves the information for the sheets contained in this GoogleSheet 
            GoogleSheet.prototype._getSheetInfo = function () {
                var _this = this;
                this._loading = true;
                this.onLoading();
                wijmo.httpRequest(this._getUrl(), {
                    requestHeaders: this._getRequestHeaders(),
                    data: {
                        fields: 'sheets.properties'
                    },
                    success: function (xhr) {
                        var info = JSON.parse(xhr.responseText), sheets = info.sheets;
                        if (_this.sheets.length) { // apply ids to existing sheets
                            _this.sheets.forEach(function (sheet) {
                                for (var i = 0; i < sheets.length; i++) {
                                    var props = sheets[i].properties;
                                    if (props.title == sheet.title) {
                                        sheet._id = props.sheetId;
                                        break;
                                    }
                                }
                                wijmo.assert(sheet._id != null, 'Could not find sheet "' + sheet.title + '".');
                            });
                        }
                        else { // add sheets automatically
                            info.sheets.forEach(function (sheetInfo) {
                                var props = sheetInfo.properties;
                                if (props.sheetType == 'GRID') {
                                    var sheet = new cloud.Sheet(_this, props.title, props.sheetId);
                                    _this.sheets.push(sheet);
                                }
                            });
                        }
                    },
                    error: function (xhr) {
                        _this.onError(new wijmo.RequestErrorEventArgs(xhr));
                    },
                    complete: function (xhr) {
                        _this._loading = false;
                        _this.onLoaded();
                    }
                });
            };
            return GoogleSheet;
        }());
        cloud.GoogleSheet = GoogleSheet;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Represents a Firestore database with one or more collections.
         *
         * Each collection is represented by a {@link Collection} object that
         * exposes the data on the collection as a {@link CollectionView} object
         * which can be used as a data source for any Wijmo control.
         *
         * In addition to full CRUD support you get all the {@link CollectionView}
         * features including sorting, filtering, paging, and grouping.
         *
         * The sorting, filtering, and paging functions may be performed on the
         * server or on the client, depending on the setting of the
         * {@link Collection.sortOnServer}, {@link Collection.filterOnServer},
         * and {@link Collection.pageOnServer} properties.
         *
         * The code below shows how you can instantiate a {@link Firestore}
         * object that loads data from three collections:
         *
         * ```typescript
         * import { Firestore } from '@grapecity/wijmo.cloud';
         * const PROJECT_ID = 'XXXX-YYYY';
         * const API_KEY = 'ZZZZ';
         * let fsNWind = new Firestore(PROJECT_ID, API_KEY, {
         *     collections: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         * ```
         * This class does not use or require the use of the Firestore
         * client libraries.
         */
        var Firestore = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link Firestore} class.
             *
             * @param projectId ID of the Firebase app that contains the database.
             * @param apiKey Unique identifier used to authenticate requests associated with the app.
             * To generate API keys, please go to https://console.cloud.google.com/.
             * @param options JavaScript object containing initialization data (property values
             * and event handlers) for this {@link Firestore}.
             */
            function Firestore(projectId, apiKey, options) {
                this._projectId = '';
                this._collections = new wijmo.collections.ObservableArray();
                this._accessToken = ''; // OAuth access token (use IAM instead of Firebase security)
                this._idToken = ''; // OAuth id token (used to get Firebase token)
                this._fbToken = ''; // Firebase id token
                this._apiKey = '';
                /**
                 * Occurs when the value of the {@link accessToken} property changes.
                 */
                this.accessTokenChanged = new wijmo.Event();
                this._projectId = wijmo.asString(projectId, false);
                this._apiKey = wijmo.asString(apiKey, false);
                wijmo.copy(this, options);
            }
            Object.defineProperty(Firestore.prototype, "projectId", {
                /**
                 * Gets the ID of the Firebase app that contains the database.
                 */
                get: function () {
                    return this._projectId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Firestore.prototype, "apiKey", {
                /**
                 * Gets the API key used to create this {@link Firestore}.
                 */
                get: function () {
                    return this._apiKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Firestore.prototype, "accessToken", {
                /**
                 * Gets or sets an OAuth 2.0 access token used to access the database.
                 *
                 * You can use the {@link OAuth2} class to allow users to log in and
                 * to obtain the {@link accessToken} string.
                 *
                 * If you choose this authentication method, Firestore Security Rules
                 * will not be applied. Firestore will use Cloud Identity and Access
                 * Management (IAM) instead.
                 *
                 * See also the {@link idToken} property, which does integrate with
                 * Firestore Security Rules.
                 */
                get: function () {
                    return this._accessToken;
                },
                set: function (value) {
                    if (value != this._accessToken) {
                        this._accessToken = wijmo.asString(value);
                        this.onAccessTokenChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Firestore.prototype, "idToken", {
                /**
                 * Gets or sets a OAuth 2.0 id token used to access the database.
                 *
                 * You can use the {@link OAuth2} class to allow users to log in and
                 * to obtain the {@link idToken} string.
                 *
                 * If you choose this authentication method, Firestore Security Rules
                 * will be applied as usual to determine which users can read and write
                 * to the database.
                 *
                 * See also the {@link accessToken} property, which bypasses Firestore
                 * Security Rules and uses Cloud Identity and Access Management (IAM)
                 * instead.
                 */
                get: function () {
                    return this._idToken;
                },
                set: function (value) {
                    var _this = this;
                    if (value != this._idToken) {
                        // save OAuth idToken
                        this._idToken = wijmo.asString(value);
                        // convert OAuth idToken into Firebase idToken
                        // https://cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/signInWithIdp
                        if (this._idToken) {
                            var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=' + this._apiKey;
                            wijmo.httpRequest(url, {
                                method: 'POST',
                                data: {
                                    requestUri: window.location.href,
                                    postBody: 'id_token=' + this._idToken + '&providerId=google.com',
                                    returnSecureToken: true,
                                    returnIdpCredential: true
                                },
                                success: function (xhr) {
                                    var result = JSON.parse(xhr.responseText);
                                    _this._fbToken = result.idToken;
                                    _this.onAccessTokenChanged();
                                },
                                error: function (xhr) {
                                    _this._fbToken = '';
                                    _this.onAccessTokenChanged();
                                }
                            });
                        }
                        else {
                            this._fbToken = '';
                            this.onAccessTokenChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Firestore.prototype, "collections", {
                /**
                 * Gets the list of {@link Collection} objects in this {@link Firestore}.
                 */
                get: function () {
                    return this._collections;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a {@link Collection} by its {@link Collection.name}.
             *
             * @param name Name of the {@link Collection} to look for.
             */
            Firestore.prototype.getCollection = function (name) {
                var arr = this._collections;
                for (var i = 0; i < arr.length; i++) {
                    var collection = arr[i];
                    if (collection.name == name) {
                        return collection;
                    }
                }
                return null;
            };
            /**
             * Raises the {@link accessTokenChanged} event.
             */
            Firestore.prototype.onAccessTokenChanged = function (e) {
                this.accessTokenChanged.raise(this, e);
            };
            // ** implementation
            // used in initialization
            Firestore.prototype._copy = function (key, value) {
                var _this = this;
                if (key == 'collections' && wijmo.isArray(value)) {
                    value.forEach(function (title) {
                        var collection = new cloud.Collection(_this, title);
                        _this.collections.push(collection);
                    });
                    return true;
                }
                return false;
            };
            return Firestore;
        }());
        cloud.Firestore = Firestore;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        function softGridFilter() {
            return wijmo._getModule('wijmo.grid.filter');
        }
        cloud.softGridFilter = softGridFilter;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        /**
         * Extends the {@link CollectionView} class to provide access to
         * document collections in a {@link Firestore} object.
         *
         * {@link Collection} objects may be created by setting the {@link collecions}
         * property when creating a {@link Firestore} object or by invoking
         * the {@link Collection} constructor directly. For example:
         *
         * ```typescript
         * import { Firestore, Collection } from '@grapecity/wijmo.cloud';
         *
         * // create a Firestore with three Collections
         * const PROJECT_ID = 'XXXX-YYYY';
         * const API_KEY = 'ZZZZ';
         * let fsNWind = new Firestore(PROJECT_ID, API_KEY, {
         *     collections: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         *
         * // create an additional Collection by calling the constructor
         * let customers = new Collection(fsNWind, 'Customers');
         * ```
         *
         * In most applications, the {@link Collection} objects are used as
         * data sources for grid controls such as the {@link FlexGrid}
         * or {@link MultiRow} grid. For example:
         *
         * ```typescript
         * import { FireStore, Collection } from '@grapecity/wijmo.cloud';
         * import { FlexGrid } from '@grapecity/wijmo.cloud';
         *
         * // create a Firestore with three Collections
         * const PROJECT_ID = 'XXXX-YYYY';
         * const API_KEY = 'ZZZZ';
         * let fsNWind = new Firestore(PROJECT_ID, API_KEY, {
         *     collections: [ 'Products', 'Categories', 'Suppliers' ]
         * });
         *
         * // use a Collection as an itemsSource for a FlexGrid control:
         * let theGrid = new FlexGrid('#theGrid', {
         *     allowAddNew: true,
         *     allowDelete: true,
         *     itemsSource: fsNWind.getCollection('Products'),
         * });
         * ```
         *
         * This class does not use or require the use of the Firestore
         * client libraries.
         */
        var Collection = /** @class */ (function (_super) {
            __extends(Collection, _super);
            /**
             * Initializes a new instance of the {@link Collection} class.
             *
             * @param store Reference to the {@link Firestore} that contains this {@link Collection}.
             * @param name Name of the {@link Collection}.
             * @param options JavaScript object containing initialization data (property values
             * and event handlers) for this {@link Collection}.
             */
            function Collection(store, name, options) {
                var _this = _super.call(this) || this;
                _this._loading = false;
                _this._sortOnServer = false;
                _this._pageOnServer = false;
                _this._filterOnServer = false;
                _this._deferCommits = false;
                _this._hasPendingChanges = false;
                _this._orderBy = [];
                _this._fieldFilters = [];
                _this._limit = 0;
                /**
                 * Occurs when the {@link Collection} starts loading data.
                 */
                _this.loading = new wijmo.Event();
                /**
                 * Occurs when the {@link Collection} finishes loading data.
                 */
                _this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                _this.error = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link hasPendingChanges} property changes.
                 *
                 * See also the {@link deferCommits} property.
                 */
                _this.hasPendingChangesChanged = new wijmo.Event();
                _this._store = store;
                _this._name = name;
                wijmo.copy(_this, options);
                // update sort when sortDescriptions change
                _this.sortDescriptions.collectionChanged.addHandler(function () {
                    if (_this.sortOnServer && !_this.hasPendingChanges) {
                        _this._getData(true);
                    }
                });
                // load data when access token changes
                store.accessTokenChanged.addHandler(function () {
                    if (store.accessToken && !_this.items.length) {
                        _this.load();
                    }
                });
                // keep track of whether we have changes
                _this.itemsEdited.collectionChanged.addHandler(_this._updateHasChanges, _this);
                _this.itemsAdded.collectionChanged.addHandler(_this._updateHasChanges, _this);
                _this.itemsRemoved.collectionChanged.addHandler(_this._updateHasChanges, _this);
                // ready to get data
                _this._getData();
                return _this;
            }
            Object.defineProperty(Collection.prototype, "store", {
                /**
                 * Gets the {@link Firestore} that contains this {@link Collection}.
                 */
                get: function () {
                    return this._store;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "name", {
                /**
                 * Gets the name of this {@link Collection}.
                 */
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "fields", {
                /**
                 * Gets or sets an array with the names of the fields to retrieve from the
                 * database.
                 *
                 * If not provided, all fields are included.
                 *
                 * Specifying the field names allows you to load only the data that your
                 * application needs, improving performance and reducing network traffic.
                 *
                 * For example, the code below loads the 'Customers' table and retrieves
                 * data for five fields only (the collection has 11 fields):
                 *
                 * ```typescript
                 * import { Firestore, Collection } from '@grapecity/wijmo.cloud';
                 *
                 * // get the store (provides credentials)
                 * const store = new Firestore(PROJECT_ID, API_KEY);
                 *
                 * // load the Customers collection
                 * const customers = new Collection(store, 'Customers', {
                 *     sortDescriptions: ['CustomerID'],
                 *     fields: [
                 *         'CustomerID',
                 *         'CompanyName',
                 *         'ContactName',
                 *         'City',
                 *         'Country'
                 *     ],
                 *     pageSize: 6 // server-side pagination
                 * });
                 * ```
                 */
                get: function () {
                    return this._fields;
                },
                set: function (value) {
                    if (value != this._fields) {
                        this._fields = wijmo.asArray(value);
                        this._getData(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "limit", {
                /**
                 * Gets or sets the number of maximum number of items to load
                 * from the database.
                 *
                 * The default value for this property is <b>zero</b>, which
                 * means no limit is set.
                 */
                get: function () {
                    return this._limit;
                },
                set: function (value) {
                    if (value != this._limit) {
                        this._limit = wijmo.asInt(value);
                        this._getData(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "sortOnServer", {
                /**
                 * Gets or sets a value that determines whether sort operations should be
                 * performed on the server as well as on the client.
                 *
                 * Use the {@link sortDescriptions} property to specify how the data should
                 * be sorted.
                 *
                 * The default value for this property is <b>false</b>.
                 */
                get: function () {
                    return this._sortOnServer;
                },
                set: function (value) {
                    if (value != this._sortOnServer) {
                        this._sortOnServer = wijmo.asBoolean(value);
                        this._getData(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "pageOnServer", {
                /**
                 * Gets or sets a value that determines whether paging should be
                 * performed on the server or on the client.
                 *
                 * Use the {@link pageSize} property to enable paging.
                 *
                 * The default value for this property is <b>false</b>.
                 */
                get: function () {
                    return this._pageOnServer;
                },
                set: function (value) {
                    if (value != this._pageOnServer) {
                        this._pageOnServer = wijmo.asBoolean(value);
                        this._getData(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "filterOnServer", {
                /**
                 * Gets or sets a value that determines whether filtering should be
                 * performed on the server when using the {@link Collection} class
                 * with the {@link FlexGridFilter} class.
                 *
                 * Server filtering tends to improve performance because less data has
                 * to be downloaded. However, server filtering in Firestore has some
                 * limitations:
                 *
                 * For example, you may combine multiple filter conditions using 'AND',
                 * but not 'OR'. That means you could not build a query to get the items
                 * where Country is set to "Brazil" OR have Sales greater than 1000.
                 *
                 * Also, if you combine equality (==) and range operators (>, >=, <, <=),
                 * you will need to create a composite index. You cannot use range
                 * operators on multiple fields. And there are no operators for inequality
                 * or full text search.
                 *
                 * These limitations apply only to server queries. If you download the data,
                 * then you can perform whatever filtering operations you want on the client.
                 *
                 * For more details on querying Firestore databases, please see
                 * https://firebase.google.com/docs/firestore/query-data/queries.
                 *
                 * The default value for this property is <b>false</b>.
                 */
                get: function () {
                    return this._filterOnServer;
                },
                set: function (value) {
                    if (value != this._filterOnServer) {
                        this._filterOnServer = wijmo.asBoolean(value);
                        // adjust filter operators (if the FlexGridFilter is loaded)
                        if (cloud.softGridFilter()) {
                            if (Collection._filterCulture == null) {
                                Collection._filterCulture = wijmo.culture.FlexGridFilter;
                            }
                            if (this._filterOnServer) {
                                var cf = wijmo.culture.FlexGridFilter;
                                cf.stringOperators = cf.numberOperators; // contains, beginsWith, etc not supported
                            }
                            else {
                                wijmo.culture.FlexGridFilter = Collection._filterCulture; // restore filter
                            }
                        }
                        // refresh data using the current filter mode
                        this._getData(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "deferCommits", {
                /**
                 * Gets or sets a value that causes the {@link Collection} to defer
                 * commits back to the database.
                 *
                 * The default value for this property is <b>false</b>, which causes
                 * any changes to the data to be immediately committed to the database.
                 *
                 * If you set this property to <b>true</b>, it will automatically set the
                 * {@link trackChanges} property to true. After this, any changes to the
                 * data (including edits, additions, and removals) will be tracked but
                 * not committed to the database until you call the {@link commitChanges}
                 * method to commit the changes, or the {@link cancelChanges} method
                 * to discard all pending changes.
                 *
                 * For example:
                 * ```typescript
                 * import { Firestore} from '@grapecity/wijmo.cloud';
                 *
                 * // create Firestore data source
                 * let fs = new Firestore(PROJECT_ID, API_KEY, {
                 *     collections: [ 'restaurants' ]
                 * });
                 * let collection = fs.getCollection('restaurants');
                 *
                 * // defer commits
                 * collection.deferCommits = true;
                 *
                 * // handle commit/cancel changes buttons
                 * let btnCommit = document.getElementById('btn-commit') as HTMLButtonElement,
                 *     btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
                 * btnCommit.addEventListener('click', () => collection.commitChanges());
                 * btnCancel.addEventListener('click', () => collection.cancelChanges());
                 * collection.hasPendingChangesChanged.addHandler((s, e) => {
                 *    btnCommit.disabled = btnCancel.disabled = !collection.hasPendingChanges;
                 * });
                 * ```
                 */
                get: function () {
                    return this._deferCommits;
                },
                set: function (value) {
                    this._deferCommits = wijmo.asBoolean(value);
                    if (this.deferCommits) {
                        this.trackChanges = true;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Commits all pending changes to the server.
             *
             * Changes are contained in the {@link itemsEdited}, {@link itemsAdded},
             * and {@link itemsRemoved} collections, and are automatically cleared
             * after they are successfully committed.
             *
             * The changes are committed in a transaction, so if there are any
             * errors during the operation, none of the changes are applied.
             * For more details on Firestore transactions, please see
             * [Firestore Transactions](https://firebase.google.com/docs/firestore/manage-data/transactions).
             *
             * See also the {@link deferCommits} property.
             *
             * @param committed Optional callback invoked when the commit operation
             * has been completed. The callback takes an <b>XMLHttpRequest</b>
             * parameter contains information about the request results, including
             * error information if any.
             */
            Collection.prototype.commitChanges = function (committed) {
                var _this = this;
                // perform pending edits, additions, removals in a transaction:
                // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/beginTransaction
                // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/commit
                if (this.deferCommits) {
                    // build list of operations to perform
                    var operations_1 = [];
                    this.itemsEdited.forEach(function (item) {
                        operations_1.push({
                            update: _this._itemToDoc(item)
                        });
                    });
                    this.itemsAdded.forEach(function (item) {
                        var doc = _this._itemToDoc(item);
                        doc.name = 'projects/' + _this.store.projectId +
                            '/databases/(default)/documents/' + _this.name + '/' + _this._generateID();
                        operations_1.push({
                            update: doc
                        });
                    });
                    this.itemsRemoved.forEach(function (item) {
                        operations_1.push({
                            delete: item.$META.name
                        });
                    });
                    // send the operations to the server
                    if (operations_1.length) {
                        wijmo.httpRequest(this._getUrl(':beginTransaction'), {
                            method: 'POST',
                            requestHeaders: this._getRequestHeaders(),
                            success: (function (xhr) {
                                var response = JSON.parse(xhr.responseText);
                                wijmo.httpRequest(_this._getUrl(':commit'), {
                                    method: 'POST',
                                    data: {
                                        writes: operations_1,
                                        transaction: response.transaction
                                    },
                                    requestHeaders: _this._getRequestHeaders(),
                                    success: function (xhr) {
                                        _this.clearChanges();
                                        _this.load(); // to get the updated data
                                    },
                                    complete: function (xhr) {
                                        if (wijmo.isFunction(committed)) {
                                            committed(xhr);
                                        }
                                    },
                                    error: function (xhr) { return _this._raiseError(xhr, true); }
                                });
                            }),
                            error: function (xhr) { return _this._raiseError(xhr, true); }
                        });
                    }
                }
            };
            /**
             * Cancels all changes by removing all items in the {@link itemsAdded},
             * {@link itemsRemoved}, and {@link itemsEdited} collections,
             * without committing them to the server.
             *
             * This method is used with the {@link deferCommits} property.
             */
            Collection.prototype.cancelChanges = function () {
                if (this.deferCommits) {
                    this.clearChanges();
                    this.load();
                }
            };
            Object.defineProperty(Collection.prototype, "hasPendingChanges", {
                /**
                 * Gets a value that determines whether the {@link Collection} has
                 * pending changes.
                 *
                 * See also the {@link deferCommits} property and the
                 * {@link commitChanges} and {@link cancelChanges} methods.
                 */
                get: function () {
                    if (this.deferCommits) {
                        return this.itemsAdded.length > 0 ||
                            this.itemsEdited.length > 0 ||
                            this.itemsRemoved.length > 0;
                    }
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the {@link Collection} is currently loading data.
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
             * Loads or re-loads the collection data.
             * @param keepPosition Whether to keep the cursor position.
             */
            Collection.prototype.load = function (keepPosition) {
                this._getData(keepPosition);
            };
            /**
             * Defines the fields that should be retrieved from the server.
             *
             * The {@link select} method is an alternative to the {@link fields}
             * property.
             *
             * @param fields Array containing the names of the fields to be retrieved.
             */
            Collection.prototype.select = function () {
                var fields = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    fields[_i] = arguments[_i];
                }
                this.fields = fields;
                return this;
            };
            /**
             * Specifies a field to sort by on the server.
             *
             * You can call the {@link orderBy} method several times to sort on
             * multiple fields.
             *
             * Sorts created with the {@link orderBy} operator are always applied on
             * the server, regardless of the setting of the {@link sortOnServer}
             * property.
             *
             * @param field Name of the field to sort by, or null to clear all sorts.
             * @param ascending Whether to sort the field in ascending or descending order.
             */
            Collection.prototype.orderBy = function (field, ascending) {
                if (ascending === void 0) { ascending = true; }
                if (!field) {
                    this._orderBy = [];
                }
                else {
                    this._orderBy.push(new wijmo.collections.SortDescription(wijmo.asString(field), wijmo.asBoolean(ascending)));
                }
                this._getData(false);
                return this;
            };
            /**
             * Specifies a filter to apply on the server.
             *
             * You may call the {@link where} method several times to create composite
             * filters.
             *
             * Filters created with the {@link where} operator are always applied on
             * the server, regardless of the setting of the {@link filterOnServer}
             * property.
             *
             * @param field Field to filter on, or null to clear all filters.
             * @param operator Filter operator (>, >=, ,!=, ==, <, <=, or IN)
             * @param value Value to filter by.
             */
            Collection.prototype.where = function (field, operator, value) {
                if (!field) {
                    this._fieldFilters = [];
                }
                else {
                    // build field filter
                    switch (operator.toUpperCase()) {
                        case '==':
                            operator = 'EQUAL';
                            break;
                        case '!=':
                            operator = 'NOT_EQUAL';
                            break;
                        case '>':
                            operator = 'GREATER_THAN';
                            break;
                        case '>=':
                            operator = 'GREATER_THAN_OR_EQUAL';
                            break;
                        case '<':
                            operator = 'LESS_THAN';
                            break;
                        case '<=':
                            operator = 'LESS_THAN_OR_EQUAL';
                            break;
                        case 'IN':
                            operator = 'IN';
                            wijmo.assert(wijmo.isArray(value), 'IN operator requires array values.');
                            break;
                        default:
                            wijmo.assert(false, 'Unknown operator (should be ==, !=, >, >=, <, <=, or IN).');
                    }
                    // remove other filters with the same field and operator
                    for (var i = 0; i < this._fieldFilters.length; i++) {
                        var ff = this._fieldFilters[i].fieldFilter;
                        if (ff.field.fieldPath == field && ff.op == operator) {
                            this._fieldFilters.splice(i, 1);
                            break;
                        }
                    }
                    // add to list
                    this._fieldFilters.push({
                        fieldFilter: {
                            field: { fieldPath: field },
                            op: operator,
                            value: this._getValueObject(value)
                        }
                    });
                }
                // go get the data
                this._getData(false);
                return this;
            };
            /**
             * Gets a sub-collection from a data item.
             *
             * Items in Firestore collections may contain sub-collections.
             *
             * Unlike arrays, sub-collections are not automatically loaded
             * when the data item (document) is loaded. They must be loaded
             * explicitly using the {@link getSubCollection} method.
             *
             * Sub-collections use the same {@link Firestore} and therefore
             * have the same security credentials as the parent collection.
             *
             * For example:
             *
             * ```typescript
             * import { Firestore, Collection } from '@grapecity/wijmo.cloud';
             *
             * // create the store object
             * const PROJECT_ID = 'XXXX-YYYY';
             * const API_KEY = 'ZZZZ';
             * const store = new Firestore(PROJECT_ID, API_KEY);
             *
             * // load top-level 'suggestions' collection
             * const suggestions = new Collection(store, 'suggestions', {
             *     loaded: s => {
             *         console.log(`loaded ${s.items.length} suggestions.`);
             *
             *         // load 'comments' sub-collection for the first suggestion
             *         let comments = new SubCollection(store, s.items[0], 'comments', {
             *             loaded: s => {
             *                 console.log(`first suggestion has ${s.items.length} comments.`);
             *             }
             *         });
             *      }
             * });
             * ```
             *
             * @param item Data item that contains the sub-collection.
             * @param name Name of the sub-collection.
             * @param options JavaScript object containing initialization data (property values
             * and event handlers) for the sub-collection.
             * @returns A {@link Collection} object containing the sub-collection.
             */
            Collection.prototype.getSubCollection = function (item, name, options) {
                wijmo.assert(wijmo.isObject(item) && item.$META != null, 'invalid parent item');
                var sub = new Collection(this.store, name, options);
                sub._parentItem = item;
                return sub;
            };
            /**
             * Raises the {@link loading} event.
             */
            Collection.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link loaded} event.
             */
            Collection.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Raises the {@link error} event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the {@link RequestErrorEventArgs.cancel}
             * parameter to true in the event handler.
             *
             * @param e {@link RequestErrorEventArgs} that contains information about the error.
             */
            Collection.prototype.onError = function (e) {
                if (this._loading) {
                    this._loading = false;
                    this.onLoaded();
                }
                this.error.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link hasPendingChangesChanged} event.
             */
            Collection.prototype.onHasPendingChangesChanged = function (e) {
                this.hasPendingChangesChanged.raise(this, e);
            };
            Object.defineProperty(Collection.prototype, "totalItemCount", {
                // ** overrides
                /**
                 * Gets the total number of items in the view before paging is applied.
                 *
                 * Firestore does not provide an efficient way of counting the items
                 * in the collection, so this property starts with a high default value.
                 * If the user tries to move to a page that is beyond the actual count,
                 * the cursor will move to the last page and the property value will be
                 * updated automatically.
                 */
                get: function () {
                    var totCnt = this._totalCount;
                    return this.pageOnServer
                        ? totCnt != null ? totCnt : 1e9 // overshoot, will adjust later
                        : this._view ? this._view.length : 0;
                },
                set: function (value) {
                    this._totalCount = wijmo.asInt(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "pageCount", {
                /**
                 * Gets the total number of pages.
                 */
                get: function () {
                    return this.pageSize
                        ? Math.ceil(this.totalItemCount / this.pageSize)
                        : 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Collection.prototype, "pageSize", {
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
                            this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1);
                            this._getData(true);
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
             * Raises the {@link pageChanging} event.
             *
             * @param e {@link PageChangingEventArgs} that contains the event data.
             */
            Collection.prototype.onPageChanging = function (e) {
                _super.prototype.onPageChanging.call(this, e);
                if (!e.cancel && this.pageOnServer) {
                    if (this.pageIndex == 0 && this.items.length == 0) {
                        e.cancel = true;
                    }
                    else {
                        this._getData(true);
                    }
                }
                return !e.cancel;
            };
            /**
             * Override {@link commitNew} to add the new item to the database.
             */
            Collection.prototype.commitNew = function () {
                var _this = this;
                if (!this.deferCommits) {
                    var item_1 = this.currentAddItem;
                    if (item_1) {
                        var doc = this._itemToDoc(item_1);
                        // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/createDocument
                        wijmo.httpRequest(this._getUrl(), {
                            method: 'POST',
                            data: { fields: doc.fields },
                            requestHeaders: this._getRequestHeaders(),
                            success: function (xhr) {
                                var doc = JSON.parse(xhr.responseText);
                                _this._saveDocName(doc, item_1); // keep new doc's name
                                if (wijmo.isNumber(_this._totalCount)) {
                                    _this._totalCount++;
                                }
                            },
                            error: function (xhr) { return _this._raiseError(xhr, true); }
                        });
                    }
                }
                _super.prototype.commitNew.call(this);
            };
            /**
             * Override {@link commitEdit} to modify the item in the database.
             */
            Collection.prototype.commitEdit = function () {
                var _this = this;
                if (!this.deferCommits) {
                    var item = this.currentEditItem;
                    if (item && !this.currentAddItem && this._getChangedFields(item, this._edtClone)) {
                        var doc = this._itemToDoc(item);
                        // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/patch
                        wijmo.httpRequest(this._getUrl(doc), {
                            method: 'PATCH',
                            data: { fields: doc.fields },
                            requestHeaders: this._getRequestHeaders(),
                            error: function (xhr) { return _this._raiseError(xhr, true); }
                        });
                    }
                }
                _super.prototype.commitEdit.call(this);
            };
            /**
             * Override {@link remove} to remove the item from the database.
             *
             * @param item Item to be removed from the database.
             */
            Collection.prototype.remove = function (item) {
                var _this = this;
                if (!this.deferCommits) {
                    if (item && item != this.currentAddItem) {
                        var doc = this._itemToDoc(item);
                        // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/delete            
                        wijmo.httpRequest(this._getUrl(doc), {
                            method: 'DELETE',
                            requestHeaders: this._getRequestHeaders(),
                            success: function (xhr) {
                                if (wijmo.isNumber(_this._totalCount)) {
                                    _this._totalCount--;
                                }
                            },
                            error: function (xhr) { return _this._raiseError(xhr, true); }
                        });
                    }
                }
                _super.prototype.remove.call(this, item);
            };
            /**
             * Updates the filter definition based on a known filter provider such as the
             * {@link FlexGridFilter}.
             *
             * @param filterProvider Known filter provider, typically an instance of a
             * {@link FlexGridFilter}.
             */
            Collection.prototype.updateFilterDefinition = function (filterProvider) {
                this._filterProvider = null;
                if (this.filterOnServer && cloud.softGridFilter() && filterProvider instanceof cloud.softGridFilter().FlexGridFilter) {
                    this._filterProvider = filterProvider;
                    this._totalCount = null;
                    this.moveCurrentToFirst();
                    this._getData(true);
                }
            };
            // gets the list that corresponds to the current page
            Collection.prototype._getPageView = function () {
                return this.pageOnServer
                    ? this._view
                    : _super.prototype._getPageView.call(this);
            };
            // ** implementation
            // generate a new random/unique id
            Collection.prototype._generateID = function () {
                var id = '';
                while (id.length < 20) {
                    id += Math.random().toString(36).substr(2, 5);
                }
                return id;
            };
            // keep track of whether we have pending changes
            Collection.prototype._updateHasChanges = function () {
                var hasPendingChanges = this.hasPendingChanges;
                if (hasPendingChanges != this._hasPendingChanges) {
                    this._hasPendingChanges = hasPendingChanges;
                    this.onHasPendingChangesChanged();
                }
            };
            // loads the data into this CollectionView
            // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/runQuery
            Collection.prototype._getData = function (keepPosition) {
                var _this = this;
                if (this._toGetData) {
                    clearTimeout(this._toGetData);
                }
                this._toGetData = setTimeout(function () {
                    // prepare to load
                    _this._toGetData = null;
                    _this._loading = true;
                    if (_this.onLoading(new wijmo.CancelEventArgs())) {
                        var position_2 = _this.currentPosition;
                        // request the data
                        wijmo.httpRequest(_this._getUrl(':runQuery'), {
                            method: 'POST',
                            data: _this._getQuery(),
                            requestHeaders: _this._getRequestHeaders(),
                            success: function (xhr) {
                                // read the data
                                var data = JSON.parse(xhr.responseText), arr = _this._parseData(data), pageSize = _this.pageSize;
                                // keep track of item count
                                if (_this.pageOnServer && pageSize) {
                                    if (arr.length < pageSize) {
                                        var skipped = data[0].skippedResults || 0;
                                        _this._totalCount = skipped + arr.length;
                                        if (arr.length == 0 && _this.pageIndex > 0) { // looks like we're past the last page
                                            _this.moveToLastPage();
                                            return;
                                        }
                                    }
                                }
                                // initialize or append to our source collection
                                _this.sourceCollection = arr;
                                // done loading
                                if (keepPosition) {
                                    _this.moveCurrentToPosition(position_2);
                                }
                                _this._loading = false;
                                _this.onLoaded();
                            },
                            error: function (xhr) { return _this._raiseError(xhr, false); }
                        });
                    }
                }, wijmo.Control._REFRESH_INTERVAL);
            };
            // gets the query string used to retrieve data from this collection
            // https://cloud.google.com/firestore/docs/reference/rest/v1/StructuredQuery
            Collection.prototype._getQuery = function () {
                // collection source
                var q = {
                    from: [{
                            collectionId: this.name
                        }]
                };
                // select fields to include
                if (this.fields && this.fields.length) {
                    q.select = {
                        fields: this.fields.map(function (field) {
                            return {
                                fieldPath: field
                            };
                        })
                    };
                }
                ;
                // honor where method and server-side filtering
                var filters = this._fieldFilters;
                if (!filters.length && this._filterProvider && this.filterOnServer) {
                    filters = this._getQueryFilters();
                }
                // build where clause
                if (filters && filters.length) {
                    q.where = filters.length == 1
                        ? filters[0]
                        : { compositeFilter: { filters: filters, op: 'AND' } };
                }
                // sorting
                var orderBy = [];
                if (filters && filters.length) { // order by range filters (must be first)
                    filters.forEach(function (filter) {
                        var ff = filter.fieldFilter;
                        if (ff.op != 'IN' && ff.op != 'EQUAL') { // no sortBy with IN/EQUAL operators
                            orderBy.push({
                                field: ff.field.fieldPath,
                                asc: true
                            });
                        }
                    });
                }
                this._orderBy.forEach(function (ob) {
                    orderBy.push({
                        field: ob.property,
                        asc: ob.ascending
                    });
                });
                if (!orderBy.length && this.sortOnServer) { // sort on server
                    this.sortDescriptions.forEach(function (sd) {
                        orderBy.push({
                            field: sd.property,
                            asc: sd.ascending
                        });
                    });
                }
                // apply orderBy array
                if (orderBy.length) {
                    q.orderBy = orderBy.map(function (ob) {
                        return {
                            field: { fieldPath: ob.field },
                            direction: ob.asc ? 'ASCENDING' : 'DESCENDING'
                        };
                    });
                }
                // paging
                var pageSize = this.pageSize;
                if (this.pageOnServer && pageSize) {
                    q.limit = pageSize;
                    q.offset = pageSize * this.pageIndex;
                }
                // limit
                if (!q.limit && this.limit > 0) {
                    q.limit = this.limit;
                }
                // done
                return { structuredQuery: q };
            };
            // parse the data received after a get request
            Collection.prototype._parseData = function (docs) {
                var _this = this;
                var arr = [];
                if (wijmo.isArray(docs)) {
                    docs.forEach(function (doc) {
                        var item = _this._docToItem(doc);
                        if (item) {
                            arr.push(item);
                        }
                    });
                }
                return arr;
            };
            // raise error event, optionally re-load the data
            Collection.prototype._raiseError = function (xhr, reload) {
                this.onError(new wijmo.RequestErrorEventArgs(xhr));
                if (reload) {
                    this._getData(true);
                }
            };
            // save Firestore document name (key) and collection into plain data items
            Collection.prototype._saveDocName = function (doc, item) {
                if (doc.name && !item.$META) {
                    item.$META = {
                        name: doc.name
                    };
                    return true;
                }
                return false;
            };
            // convert Firestore document into plain data item
            Collection.prototype._docToItem = function (doc) {
                // handle documents wrapped in other items (returned from runQuery)
                if (!doc.name) {
                    doc = doc.document;
                }
                // the first item returned by runQuery may not be a document
                // (e.g. { readTime: xx, skippedResults: yy })
                if (!doc || !doc.name) {
                    return null;
                }
                // save document name
                var item = {};
                this._saveDocName(doc, item);
                // save document fields
                for (var fld in doc.fields) {
                    item[fld] = this._getDocValue(doc.fields[fld]);
                }
                // done
                return item;
            };
            // convert Firestore value into plain data item
            Collection.prototype._getDocValue = function (obj) {
                var _this = this;
                var value = null;
                for (var valName in obj) {
                    value = obj[valName];
                    switch (valName) {
                        case 'integerValue': // document stores integers as strings
                            value = parseInt(value);
                            break;
                        case 'timestampValue':
                            value = new Date(value);
                            break;
                        case 'mapValue':
                            var obj_1 = {};
                            for (var k in value.fields) {
                                obj_1[k] = this._getDocValue(value.fields[k]);
                            }
                            value = obj_1;
                            break;
                        case 'arrayValue':
                            value = value.values
                                ? value.values.map(function (val) { return _this._getDocValue(val); })
                                : [];
                            break;
                    }
                }
                return value;
            };
            // convert plain data item into Firestore document
            Collection.prototype._itemToDoc = function (item) {
                var doc = {}, meta = item.$META, calcFields = this.calculatedFields;
                // save document name (key)
                if (meta && meta.name) {
                    doc.name = meta.name;
                }
                // save fields
                doc.fields = {};
                for (var fld in item) {
                    if (!calcFields || !(fld in calcFields)) {
                        if (fld != '$META') {
                            doc.fields[fld] = this._getValueObject(item[fld]);
                        }
                    }
                }
                // document is ready
                return doc;
            };
            // convert value into value object
            // https://cloud.google.com/firestore/docs/reference/rest/v1/Value
            Collection.prototype._getValueObject = function (value) {
                var _this = this;
                var valObj = {}, DT = wijmo.DataType;
                switch (wijmo.getType(value)) {
                    case DT.String:
                        valObj.stringValue = value;
                        break;
                    case DT.Boolean:
                        valObj.booleanValue = value;
                        break;
                    case DT.Date:
                        valObj.timestampValue = value.toJSON();
                        break;
                    case DT.Number:
                        if (value == Math.round(value)) {
                            valObj.integerValue = value.toString();
                        }
                        else {
                            valObj.doubleValue = value;
                        }
                        break;
                    case DT.Array:
                        valObj.arrayValue = {
                            values: value.map(function (v) { return _this._getValueObject(v); })
                        };
                        break;
                    case DT.Object:
                        var fields = {};
                        for (var k in value) {
                            fields[k] = this._getValueObject(value[k]);
                        }
                        valObj.mapValue = {
                            fields: fields
                        };
                        break;
                    default:
                        wijmo.assert(false, 'failed to create value object.');
                }
                return valObj;
            };
            // gets the request headers including the OAuth access token
            Collection.prototype._getRequestHeaders = function () {
                var rh = {}, token = this.store._fbToken || this.store.accessToken;
                if (token) {
                    rh.Authorization = 'Bearer ' + token;
                }
                return rh;
            };
            // gets a URL to the collection or to a document
            Collection.prototype._getUrl = function (doc) {
                var base = 'https://firestore.googleapis.com/v1/';
                // got object? use it
                if (wijmo.isObject(doc) && doc.name) {
                    return base + doc.name;
                }
                // doc not specified? use this collection's name
                if (!doc) {
                    doc = '/' + this.name;
                }
                // get parent address
                var parent = this._parentItem
                    ? this._parentItem.$META.name
                    : 'projects/' + this.store.projectId + '/databases/(default)/documents';
                // build and return the URL
                return base + parent + doc;
            };
            // gets the filter part of a query from a filterProvider (FlexGridFilter)
            // https://cloud.google.com/firestore/docs/reference/rest/v1/StructuredQuery#Filter
            Collection.prototype._getQueryFilters = function () {
                var filters = [], filter = this._filterProvider;
                if (cloud.softGridFilter() && filter instanceof cloud.softGridFilter().FlexGridFilter) {
                    for (var c = 0; c < filter.grid.columns.length; c++) {
                        var col = filter.grid.columns[c], cf = filter.getColumnFilter(col, false);
                        if (cf && cf.isActive) {
                            if (cf.conditionFilter && cf.conditionFilter.isActive) {
                                this._getQueryConditionFilter(filters, cf.conditionFilter);
                            }
                            else if (cf.valueFilter && cf.valueFilter.isActive) {
                                this._getQueryValueFilter(filters, cf.valueFilter);
                            }
                            break; // cannot have multiple inequality filters on different columns
                        }
                    }
                }
                return filters;
            };
            Collection.prototype._getQueryConditionFilter = function (filters, cf) {
                var path = cf.column.binding, sf1 = this._getQuerySimpleFilter(cf.condition1, path), sf2 = this._getQuerySimpleFilter(cf.condition2, path);
                if (sf1 && sf2 && cf.and) {
                    filters.push({
                        compositeFilter: {
                            op: cf.and ? 'AND' : 'OR',
                            filters: [sf1, sf2]
                        }
                    });
                }
                else if (sf1) {
                    filters.push(sf1);
                }
                else if (sf2) {
                    filters.push(sf2);
                }
            };
            Collection.prototype._getQuerySimpleFilter = function (fc, path) {
                if (fc.isActive) {
                    // beginsWith requires two conditions
                    var OP = cloud.softGridFilter().Operator;
                    if (fc.operator == OP.BW) {
                        return {
                            compositeFilter: {
                                op: 'AND',
                                filters: [
                                    { fieldFilter: {
                                            field: { fieldPath: path },
                                            op: 'GREATER_THAN_OR_EQUAL',
                                            value: this._getValueObject(fc.value)
                                        } },
                                    { fieldFilter: {
                                            field: { fieldPath: path },
                                            op: 'LESS_THAN',
                                            value: this._getValueObject(fc.value + '\uf8ff')
                                        } },
                                ]
                            }
                        };
                    }
                    return {
                        fieldFilter: {
                            field: { fieldPath: path },
                            op: this._getFilterOperator(fc.operator),
                            value: this._getValueObject(fc.value)
                        }
                    };
                }
                return null;
            };
            Collection.prototype._getFilterOperator = function (op) {
                var OP = cloud.softGridFilter().Operator;
                switch (op) {
                    case OP.EQ: // equals
                        return 'EQUAL';
                    case OP.NE: // not equal
                        return 'NOT_EQUAL';
                    case OP.GE: // greater/equal
                        return 'GREATER_THAN_OR_EQUAL';
                    case OP.GT: // greater
                        return 'GREATER_THAN';
                    case OP.LE: // less/equal
                        return 'LESS_THAN_OR_EQUAL';
                    case OP.LT: // less
                        return 'LESS_THAN';
                    // not supported:
                    //case OP.CT: // contains
                    //case OP.EW: // ends with
                    //case OP.NC: // does not contain
                }
                wijmo.assert(false, OP[op] + ' operator not supported (use EQ, NE, GT, GE, LT, or LE)');
            };
            Collection.prototype._getQueryValueFilter = function (filters, vf) {
                var col = vf.column, map = col.dataMap, values = [];
                // build list of values
                for (var key in vf.showValues) {
                    var value = wijmo.changeType(key, col.dataType, col.format);
                    if (map && wijmo.isString(value)) { // TFS 239356
                        value = map.getKeyValue(value);
                    }
                    values.push(value);
                    if (values.length >= 10) {
                        break;
                    }
                }
                // build condition
                if (values.length) {
                    filters.push({
                        fieldFilter: {
                            field: { fieldPath: col.binding },
                            op: 'IN',
                            value: this._getValueObject(values)
                        }
                    });
                }
            };
            Collection._filterCulture = null;
            return Collection;
        }(wijmo.collections.CollectionView));
        cloud.Collection = Collection;
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var cloud;
    (function (cloud) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.cloud', wijmo.cloud);
    })(cloud = wijmo.cloud || (wijmo.cloud = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.cloud.js.map