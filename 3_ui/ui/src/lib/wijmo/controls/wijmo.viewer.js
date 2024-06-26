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
    var viewer;
    (function (viewer) {
        'use strict';
        // Extends MultiSelect control with Select All function.
        var _MultiSelectEx = /** @class */ (function () {
            function _MultiSelectEx(element) {
                this._selectedAll = false;
                this._innerCheckedItemsChanged = false;
                this.checkedItemsChanged = new wijmo.Event();
                var self = this, multiSelect = new wijmo.input.MultiSelect(element);
                self._multiSelect = multiSelect;
                multiSelect.checkedItemsChanged.addHandler(self.onCheckedItemsChanged, self);
                multiSelect.isDroppedDownChanged.addHandler(self.onIsDroppedDownChanged, self);
                multiSelect.headerFormatter = function () { return self._updateHeader(); };
                self._lostFocus = self._multiSelect.lostFocus;
            }
            _MultiSelectEx.prototype._updateHeader = function () {
                var self = this, checkedItems = self.checkedItems || [], texts = [], displayMemberPath = self.displayMemberPath;
                if (!checkedItems.length) {
                    return wijmo.culture.Viewer.parameterNoneItemsSelected;
                }
                if (self._selectedAll) {
                    return wijmo.culture.Viewer.parameterAllItemsSelected;
                }
                if (displayMemberPath) {
                    for (var i = 0; i < checkedItems.length; i++) {
                        texts[i] = checkedItems[i][displayMemberPath];
                    }
                    return texts.join(', ');
                }
                return checkedItems.join(', ');
            };
            _MultiSelectEx.prototype.onIsDroppedDownChanged = function () {
                if (!this._multiSelect.isDroppedDown) {
                    return;
                }
                this._updateSelectedAll();
            };
            _MultiSelectEx.prototype.onCheckedItemsChanged = function (sender, e) {
                var self = this;
                if (self._innerCheckedItemsChanged) {
                    return;
                }
                if (!self._selectAllItem) {
                    self.checkedItemsChanged.raise(self, e);
                    return;
                }
                self._updateSelectedAll();
                self.checkedItemsChanged.raise(self, e);
            };
            Object.defineProperty(_MultiSelectEx.prototype, "isEditable", {
                get: function () {
                    return this._multiSelect.isEditable;
                },
                set: function (value) {
                    this._multiSelect.isEditable = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "isDisabled", {
                get: function () {
                    return this._multiSelect.isDisabled;
                },
                set: function (value) {
                    this._multiSelect.isDisabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "displayMemberPath", {
                get: function () {
                    return this._multiSelect.displayMemberPath;
                },
                set: function (value) {
                    this._multiSelect.displayMemberPath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "selectedValuePath", {
                get: function () {
                    return this._multiSelect.selectedValuePath;
                },
                set: function (value) {
                    this._multiSelect.selectedValuePath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "itemsSource", {
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    var self = this, displayMemberPath = self.displayMemberPath || 'name';
                    self._itemsSource = value;
                    var innerSources = [];
                    if (value) {
                        if (value.length > 1) {
                            self._selectAllItem = {};
                            self._selectAllItem[displayMemberPath] = wijmo.culture.Viewer.parameterSelectAllItemText;
                            innerSources.push(self._selectAllItem);
                        }
                        else {
                            self._selectAllItem = null;
                        }
                        innerSources = innerSources.concat(value);
                    }
                    self._multiSelect.itemsSource = innerSources;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "checkedItems", {
                get: function () {
                    var self = this, items = [];
                    if (self._multiSelect.checkedItems) {
                        items = self._multiSelect.checkedItems.slice();
                    }
                    var index = items.indexOf(self._selectAllItem);
                    if (index > -1) {
                        items.splice(index, 1);
                    }
                    return items;
                },
                set: function (value) {
                    var self = this;
                    self._multiSelect.checkedItems = value;
                    self._selectedAll = false;
                    self._updateSelectedAll();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MultiSelectEx.prototype, "lostFocus", {
                get: function () {
                    return this._lostFocus;
                },
                enumerable: true,
                configurable: true
            });
            _MultiSelectEx.prototype._updateSelectedAll = function () {
                var self = this;
                if (!self._selectAllItem) {
                    return;
                }
                var checkedItems = self._multiSelect.checkedItems || [], selectedAllIndex = checkedItems.indexOf(self._selectAllItem), selectedAll = selectedAllIndex > -1, selectAllItemChanged = self._selectedAll !== selectedAll;
                if (selectAllItemChanged) {
                    self._selectedAll = selectedAll;
                    self._innerCheckedItemsChanged = true;
                    if (self._selectedAll) {
                        self._multiSelect.checkedItems = self._multiSelect.itemsSource.slice();
                    }
                    else {
                        self._multiSelect.checkedItems = [];
                    }
                    self._innerCheckedItemsChanged = false;
                    return;
                }
                self._selectedAll = checkedItems && self._itemsSource &&
                    (checkedItems.length - (selectedAll ? 1 : 0) === self._itemsSource.length);
                if (self._selectedAll === selectedAll) {
                    return;
                }
                self._innerCheckedItemsChanged = true;
                if (self._selectedAll) {
                    self._multiSelect.checkedItems = checkedItems.concat(self._selectAllItem);
                }
                else {
                    checkedItems = checkedItems.slice();
                    checkedItems.splice(selectedAllIndex, 1);
                    self._multiSelect.checkedItems = checkedItems;
                }
                self._innerCheckedItemsChanged = false;
            };
            return _MultiSelectEx;
        }());
        viewer._MultiSelectEx = _MultiSelectEx;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        viewer.parametersIcon = '<path d="M24,11.9v-2h-4V7h0V5h0h-1h-5V2h0V0h0h-1H1H0h0v2h0v11h0v1h0h1h5v4h0v1h0h1h3v4h0v1h0h1h2.1v-1H11V12h2.1v-2H11h-1h0v2h0v6H7V7h12v2.9h-1v2h5V23h-4.9v1H23h1h0v-1h0L24,11.9L24,11.9z M6,5L6,5l0,2h0v6H1V2h12v3H7H6z"/>' +
            '<path d="M20,20v-3v-1h-1h-1v-1v-1h-1h-3h-1v1v3v1h1h1v2h0h1h3h1h0L20,20L20,20z M14,18v-3h3v1h-1h-1v1v1H14z M17,17v1h-1v-1H17z M16,20v-1h1h1v-1v-1h1v3H16z"/>';
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        viewer.icons = {
            paginated: '<rect x="16" y= "1" width="1" height="1" />' +
                '<rect x="17" y= "2" width="1" height="1" />' +
                '<rect x="18" y= "3" width="1" height="1" />' +
                '<path d= "M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z" />' +
                '<rect x="6" y= "8" width="10" height="1" />' +
                '<rect x="6" y= "5" width="5" height="1" />' +
                '<rect x="6" y= "11" width="10" height="1" />' +
                '<rect x="6" y= "14" width="10" height="1" />' +
                '<rect x="6" y= "17" width="10" height="1" />' +
                '<rect x="6" y= "20" width="10" height="1" />',
            print: '<rect x="5" y= "1" width="14" height="4" />' +
                '<polygon points= "22,8 22,7 19,7 19,6 5,6 5,7 2,7 2,8 1,8 1,11 1,20 2,20 2,21 5,21 5,11 19,11 19,21 22,21 22,20 23,20 23, 11 23, 8 "/>' +
                '<path d="M6,12v11h12V12H6z M16,21H8v-1h8V21z M16,18H8v-1h8V18z M16,15H8v-1h8V15z" />',
            exports: '<path d="M19.6,23"/>' +
                '<polyline points="5,19 5,2 13,2 13,7 14.3,7 15,7 18,7 18,9 20,9 20,7 20,6.4 20,5 20,4 19,4 19,5 15,5 15,2 15,1 16,1 16,0 15,0 5,0 3,0 3,2 3,19 3,21 5,21 "/>' +
                '<rect x="18" y="3" width="1" height="1"/>' +
                '<rect x="17" y="2" width="1" height="1"/>' +
                '<rect x="16" y="1" width="1" height="1"/>' +
                '<polygon points="17,16.6 20,14.1 17,11.6 17,13.6 13,13.6 13,14.6 17,14.6 "/>' +
                '<rect x="3" y="20.9" width="2" height="3.1"/>' +
                '<rect x="4.5" y="22" width="15.6" height="2"/>' +
                '<rect x="18" y="8.4" width="2" height="1.6"/>' +
                '<rect x="18" y="18" width="2.1" height="6"/>',
            portrait: '<path d="M19,0L19,0L5,0v0H3v24h0.1H5h14h1.7H21V0H19z M12.5,23h-1v-1h1V23z M19,21H5V2h14V21z"/>',
            landscape: '<path d="M24,19L24,19l0-14h0V3H0v0.1V5v14v1.7V21h24V19z M1,12.5v-1h1v1H1z M3,19V5h19v14H3z"/>',
            pageSetup: '<rect x="18" y="1" width="1" height="1"/>' +
                '<rect x="19" y="2" width="1" height="1"/>' +
                '<rect x="20" y="3" width="1" height="1"/>' +
                '<polygon points="22,5 22,4 21,4 21,5 20.4,5 20,5 17,5 17,2 17,1.3 17,1 18,1 18,0 17,0 17,0 7,0 6,0 5,0 5,5 7,5 7,2 15,2 15,7 16,7 17,7 20,7 20,22.1 7,22.1 7,19 5,19 5,24 5.9,24 7,24 20,24 21.1,24 22,24 22,5 "/>' +
                '<rect x="5" y="7" width="2" height="2"/>' +
                '<rect x="5" y="11" width="2" height="2"/>' +
                '<rect x="5" y="15" width="2" height="2"/>' +
                '<rect x="9" y="11" width="2" height="2"/>' +
                '<rect x="1" y="11" width="2" height="2"/>' +
                '<polygon points="9,8 9,8 8,8 8,9 9,9 9,10 10,10 10,8 "/>' +
                '<polygon points="2,9 2,9 2,10 3,10 3,9 4,9 4,8 2,8 "/>' +
                '<polygon points="3,16 3,16 4,16 4,15 3,15 3,14 2,14 2,16 "/>' +
                '<polygon points="10,15 10,15 10,14 9,14 9,15 8,15 8,16 10,16 "/>',
            previousPage: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="5.6,10.7 12,4.4 18.4,10.7 18.4,15 13.5,10.1 13.5,19.6 10.4,19.6 10.4,10.1 5.6,15 " />',
            nextPage: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="18.4,13.3 12,19.6 5.6,13.3 5.6,9 10.5,13.9 10.5,4.4 13.6,4.4 13.6,13.9 18.4,9 " />',
            firstPage: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
                '<polygon points="6.5,13.1 12,7.8 17.5,13.1 17.5,17.5 13.5,13.5 13.5,19.6 10.4,19.6 10.4,13.5 6.5,17.5 " />' +
                '<rect x="6.5" y= "4.4" width="10.9" height="2.2" />',
            lastPage: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
                '<polygon points="17.5,10.9 12,16.2 6.5,10.9 6.5,6.5 10.5,10.5 10.5,4.4 13.6,4.4 13.6,10.5 17.5,6.5 " />' +
                '<rect x="6.5" y= "17.5" transform="matrix(-1 -8.987357e-011 8.987357e-011 -1 24 37.0909)" width="10.9" height="2.2" />',
            backwardHistory: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
                '<polygon points="10.7,18.4 4.4,12 10.7,5.6 15,5.6 10.1,10.5 19.6,10.5 19.6,13.6 10.1,13.6 15,18.4 " />',
            forwardHistory: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
                '<polygon points="13.3,5.6 19.6,12 13.3,18.4 9,18.4 13.9,13.5 4.4,13.5 4.4,10.4 13.9,10.4 9,5.6 " />',
            selectTool: '<polygon points="19.9,13.4 5.6,1.1 5.3,19.9 10.5,14.7 14.3,23.3 16.4,22.4 12.6,13.8 "/>',
            moveTool: '<polygon points="12.5,3 14.5,3 12,0 9.5,3 11.5,3 11.5,21 11.5,21 9.6,21 12,24 14.5,21 12.5,21 "/>' +
                '<polygon points="21,12.5 21,14.5 24,12 21,9.5 21,11.5 3,11.5 3,11.5 3,9.6 0,12 3,14.5 3,12.5 "/>',
            continuousView: '<polygon points="22,0 22,5 9,5 9,0 7,0 7,5 7,7 7,7 24,7 24,7 24,5 24,0 "/>' +
                '<polygon points="23,15 19,15 19,11 20,11 20,10 19,10 18,10 17,10 9,10 7.4,10 7,10 7,24 9,24 9,12 17,12 17,15 17,16.6 17,17 22,17 22,24 24,24 24,17 24,15.1 24,15 24,15 24,14 23,14 "/>' +
                '<rect x="22" y="13" width="1" height="1"/>' +
                '<polygon points="20.9,12 20.9,13 22,13 22,12 21,12 21,11 20,11 20,12 "/>' +
                '<polygon points="4.9,5.2 2.5,2.2 0,5.2 2,5.2 2,9.2 3,9.2 3,5.2 "/>' +
                '<polygon points="2.9,19.2 2.9,15.2 1.9,15.2 1.9,19.2 0,19.2 2.5,22.1 4.9,19.2 "/>',
            singleView: '<rect x="16" y="1" width="1" height="1"/>' +
                '<rect x="17" y="2" width="1" height="1"/>' +
                '<rect x="18" y="3" width="1" height="1"/>' +
                '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/>',
            fitWholePage: '<rect x="16" y="1" width="1" height="1"/>' +
                '<rect x="17" y="2" width="1" height="1"/>' +
                '<rect x="18" y="3" width="1" height="1"/>' +
                '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M18,22.1H5V2h8v5h1h1h3V22.1z"/>' +
                '<polygon points="17,13.5 15,11 15,13 13,13 13,14 15,14 15,16 "/>' +
                '<polygon points="6,13.5 8,16 8,14 10,14 10,13 8,13 8,11 "/>' +
                '<polygon points="11.5,7 9,9 11,9 11,11 12,11 12,9 14,9 "/>' +
                '<polygon points="11.5,20 14,18 12,18 12,16 11,16 11,18 9,18 "/>',
            fitPageWidth: '<rect x="16" y="1" width="1" height="1"/>' +
                '<rect x="17" y="2" width="1" height="1"/>' +
                '<rect x="18" y="3" width="1" height="1"/>' +
                '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/>' +
                '<polygon points="14,15.5 17,13 14,10.6 14,12.6 13,12.6 13,13.6 14,13.6 "/>' +
                '<polyline points="6,13.1 9,15.6 9,13.6 10,13.6 10,12.6 9,12.6 9,10.6 6,13.1 "/>',
            zoomOut: '<circle opacity=".25" cx="12" cy="12" r="12"/><rect opacity=".75" x="5" y="10" width="14" height="3"/>',
            zoomIn: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon opacity=".75" points="19,10 13.5,10 13.5,4.5 10.5,4.5 10.5,10 5,10 5,13 10.5,13 10.5,18.5 13.5,18.5 13.5,13 19,13 " />',
            fullScreen: '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" />' +
                '<polygon points="19.6,9.9 20,6 16.1,6.4 17.6,7.8 14.7,10.6 15.4,11.3 18.3,8.5"/>' +
                '<polygon points="4.4,16.2 4,20 7.9,19.7 6.5,18.3 9.3,15.5 8.6,14.8 5.8,17.6"/>',
            exitFullScreen: '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" />' +
                '<polygon points="9.2,18.6 9.6,14.7 5.7,15.1 7.2,16.5 4.3,19.3 5,20 7.9,17.2"/>' +
                '<polygon points="14.8,7.5 14.4,11.3 18.3,11 16.9,9.6 19.7,6.8 19,6.1 16.2,8.9"/>',
            thumbnails: '<path d="M20,2h-5h-2v2v5v2v0h2v0h5v0h2v0V9V4V2H20z M20,9h-5V4h5V9z"/>' +
                '<path d="M20,13h-5h-2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H20z M20,20h-5v-5h5V20z"/>' +
                '<path d="M9,13H4H2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H9z M9,20H4v-5h5V20z"/>' +
                '<rect x="2" y="2" width="9" height="9"/>',
            outlines: '<path d="M22,0H2H0v2v20v2h2h20h2v-2V2V0H22z M2,2h12v20H2V2z M22,22h-6V2h6V22z"/>' +
                '<rect x="17.5" y="5" width="3" height="1" />' +
                '<rect x="17.5" y="8" width="3" height="1"/>' +
                '<rect x="17.5" y="11" width="3" height="1"/>',
            search: '<circle stroke-width="2" fill="none" cx="9.5" cy="9.5" r="8.5"/>' +
                '<rect x="16.9" y="13.7" transform="matrix(-0.7193 0.6947 -0.6947 -0.7193 44.3315 18.4942)" width="3" height="9"/>',
            searchNext: '<polygon points="12,12.6 4,4.5 4,11.4 12,19.5 20,11.4 20,4.5 "/>',
            searchPrevious: '<polygon points="12,11.4 20,19.5 20,12.6 12,4.5 4,12.6 4,19.5 "/>',
            hamburgerMenu: '<rect x="2" y="4.875" width="20" height="1.5"/>' +
                '<rect x="2" y="11.25" width="20" height="1.5"/>' +
                '<rect x="2" y="17.625" width="20" height="1.5"/>',
            viewMenu: '<path transform="scale(1.5)" d="M8,2.9c-4.4,0-8,2.2-8,5s3.6,5,8,5s8-2.2,8-5S12.4,2.9,8,2.9z M8,11.8c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4, 1.8,4,4C12, 10,10.2,11.8,8,11.8z"/>' +
                '<circle class="st0" cx="12" cy="11.85" r="3.45"/>',
            searchOptions: '<polygon points="12,12.6 4,4.5 4,11.4 12,19.5 20,11.4 20,4.5 "/>',
            searchLeft: '<polygon points="11.4,12 19.5,20 12.6,20 4.5,12 12.6,4 19.5,4 "/>',
            searchRight: '<polygon points="12.6,12 4.5,4 11.4,4 19.5,12 11.4,20 4.5,20 "/>',
            showZoomBar: '<path d="M22.8,20.7l-4.4-4.4c1.1-1.6,1.8-3.5,1.8-5.6c0-5.2-4.3-9.5-9.5-9.5s-9.5,4.3-9.5,9.5s4.3,9.5,9.5,9.5 ' +
                'c2.1,0,4-0.7,5.6-1.8l4.4,4.4L22.8,20.7z M4.2,10.7c0-3.6,2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5s-2.9,6.5-6.5,6.5S4.2,14.3,4.2,10.7z"/>' +
                '<polygon points="7.2,9.2 7.2,7.2 9.2,7.2 9.2,6.2 6.2,6.2 6.2,9.2 "/>' +
                '<polygon points="12.2,7.2 14.2,7.2 14.2,9.2 15.2,9.2 15.2,6.2 12.2,6.2 "/>' +
                '<polygon points="9.2,14.2 7.2,14.2 7.2,12.2 6.2,12.2 6.2,15.2 9.2,15.2 "/>' +
                '<polygon points="14.2,12.2 14.2,14.2 12.2,14.2 12.2,15.2 15.2,15.2 15.2,12.2"/>',
            rubberbandTool: "\n    <g>\n        <polygon points=\"11.5,2 4,2 2,2 2,4 2,11.5 4,11.5 4,4 11.5,4 \t\"/>\n        <path d=\"M16,10V8h-2h-4H8v2v4v2h2h4h2v-2V10z M14,14h-4v-4h4V14z\"/>\n        <polygon points=\"20,12 20,19 19,19 19,20 12,20 12,22 20,22 22,22 22,20 22,12\"/>\n        <rect x=\"16\" y=\"16\" class=\"st0\" width=\"1\" height=\"1\"/>\n        <rect x=\"17\" y=\"17\" class=\"st0\" width=\"1\" height=\"1\"/>\n        <rect x=\"18\" y=\"18\" class=\"st0\" width=\"1\" height=\"1\"/>\n    </g>",
            magnifierTool: "\n    <circle fill=\"none\" stroke-width=\"2\" stroke-miterlimit=\"10\" cx=\"9.5\" cy=\"9.5\" r=\"7.5\"/>\n    <rect x=\"17\" y=\"13.7\" transform=\"matrix(0.7193 -0.6947 0.6947 0.7193 -7.4537 17.9238)\" class=\"st1\" width=\"3\" height=\"9\"/>\n    <polygon points=\"14,8.5 10.5,8.5 10.5,5 8.5,5 8.5,8.5 5,8.5 5,10.5 8.5,10.5 8.5,14 10.5,14 10.5,10.5 14,10.5\"/>\n    ",
            rotateDocument: "\n    <g>\n        <path d=\"M18,0H5H3v4v18v2h2h13h2v-2V4V0H18z M18,22H5V4h13V22z\"/>\n        <polygon points=\"9,12 13,12 13,14 15,11.5 13,9 13,11 9,11 8,11 8,12 8,17 9,17\"/>\n    </g>",
            rotatePage: "\n    <g>\n        <rect x=\"16\" y=\"1\" width=\"1\" height=\"1\"/>\n        <rect x=\"17\" y=\"2\" width=\"1\" height=\"1\"/>\n        <rect x=\"18\" y=\"3\" width=\"1\" height=\"1\"/>\n        <path class=\"st0\" d=\"M19,4v1h-0.6H18h-3V2V1.3V1h1V0h-1H5H4H3v24h2h13h1.1H20V5V4H19z M18,22.1H5V2h8v5h1h1h3V22.1z\"/>\n        <polygon points=\"13,11 9,11 8,11 8,12 8,17 9,17 9,12 13,12 13,14 15,11.5 13,9\"/>\n    </g>"
        };
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Provides arguments for {@link wijmo.viewer.ViewerBase.pageLoaded} event.
         */
        var PageLoadedEventArgs = /** @class */ (function (_super) {
            __extends(PageLoadedEventArgs, _super);
            /**
             * Initializes a new instance of the {@link PageLoadedEventArgs} class.
             *
             * @param pageIndex Number containing the page index of loaded page.
             * @param pageElement HTMLDivElement containing wrapper for rendered SVG of loaded page.
             */
            function PageLoadedEventArgs(pageIndex, pageElement) {
                var _this = _super.call(this) || this;
                _this._pageIndex = pageIndex;
                _this._pageElement = pageElement;
                return _this;
            }
            Object.defineProperty(PageLoadedEventArgs.prototype, "pageIndex", {
                /**
                 * Gets or sets the page index of loaded page.
                 */
                get: function () {
                    return this._pageIndex;
                },
                set: function (value) {
                    this._pageIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageLoadedEventArgs.prototype, "pageElement", {
                /**
                 * Gets or sets the HTMLDivElement containing wrapper for rendered SVG of loaded page.
                 */
                get: function () {
                    return this._pageElement;
                },
                set: function (value) {
                    this._pageElement = value;
                },
                enumerable: true,
                configurable: true
            });
            return PageLoadedEventArgs;
        }(wijmo.EventArgs));
        viewer.PageLoadedEventArgs = PageLoadedEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ActionQueue = /** @class */ (function () {
            function _ActionQueue() {
                this._actions = [];
                this._isStarted = false;
            }
            _ActionQueue.prototype._any = function () {
                return this._actions.length > 0;
            };
            _ActionQueue.prototype.queue = function (action) {
                var _this = this;
                var any = this._any();
                this._actions.push(function () {
                    action();
                    _this._continue();
                });
                if (!this.isStarted || any)
                    return;
                this._continue();
            };
            _ActionQueue.prototype._continue = function () {
                var first = this._actions.shift();
                if (first)
                    first();
            };
            _ActionQueue.prototype.start = function () {
                if (this._isStarted)
                    return;
                this._isStarted = true;
                this._continue();
            };
            Object.defineProperty(_ActionQueue.prototype, "isStarted", {
                get: function () {
                    return this._isStarted;
                },
                enumerable: true,
                configurable: true
            });
            return _ActionQueue;
        }());
        viewer._ActionQueue = _ActionQueue;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        //Hack for 'instanceof' when the type is undefined
        if (typeof window !== 'undefined') {
            window['TouchEvent'] = window['TouchEvent'] || (function () { });
            window['PointerEvent'] = window['PointerEvent'] || (function () { });
            window['Touch'] = window['Touch'] || (function () { });
        }
        var _eventSeparator = ',';
        var _touchEventsMap = {
            startName: 'touchstart',
            moveName: 'touchmove',
            endName: ['touchend', 'touchcancel', 'touchleave'].join(_eventSeparator)
        };
        var _pointerEventsMap = {
            startName: ['pointerdown', 'pointerenter'].join(_eventSeparator),
            moveName: 'pointermove',
            endName: ['pointerup', 'pointercancel', 'pointerleave'].join(_eventSeparator)
        };
        function _getTouchEventMap() {
            return ('ontouchstart' in window) ? _touchEventsMap : _pointerEventsMap;
        }
        viewer._getTouchEventMap = _getTouchEventMap;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _TouchDirection;
        (function (_TouchDirection) {
            _TouchDirection[_TouchDirection["None"] = 0] = "None";
            _TouchDirection[_TouchDirection["Left"] = 1] = "Left";
            _TouchDirection[_TouchDirection["Up"] = 2] = "Up";
            _TouchDirection[_TouchDirection["Right"] = 3] = "Right";
            _TouchDirection[_TouchDirection["Down"] = 4] = "Down";
        })(_TouchDirection = viewer._TouchDirection || (viewer._TouchDirection = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _TouchInfo = /** @class */ (function () {
            function _TouchInfo(source) {
                this._systemTouchInfo = source;
                if (source instanceof Touch) {
                    this._id = source.identifier;
                }
                else {
                    this._id = source.pointerId;
                }
                this._target = source.target;
                this._screenX = source.screenX;
                this._screenY = source.screenY;
                this._clientX = source.clientX;
                this._clientY = source.clientY;
            }
            _TouchInfo.getCenter = function (start, end) {
                return new wijmo.Point(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2);
            };
            _TouchInfo.getCenterClient = function (startInfo, endInfo) {
                return _TouchInfo.getCenter(new wijmo.Point(startInfo.clientX, startInfo.clientY), new wijmo.Point(endInfo.clientX, endInfo.clientY));
            };
            _TouchInfo.getCenterScreen = function (startInfo, endInfo) {
                return _TouchInfo.getCenter(new wijmo.Point(startInfo.screenX, startInfo.screenY), new wijmo.Point(endInfo.screenX, endInfo.screenY));
            };
            _TouchInfo.getDistance = function (startInfo, endInfo) {
                var deltaX = Math.abs(startInfo.clientX - endInfo.clientX), deltaY = Math.abs(startInfo.clientY - endInfo.clientY);
                return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            };
            _TouchInfo._getDirection = function (start, end) {
                var deltaX = end.clientX - start.clientX, deltaY = end.clientY - start.clientY, isHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
                if (isHorizontal) {
                    if (deltaX > 0)
                        return viewer._TouchDirection.Right;
                    if (deltaX < 0)
                        return viewer._TouchDirection.Left;
                    return viewer._TouchDirection.None;
                }
                if (deltaY > 0)
                    return viewer._TouchDirection.Down;
                if (deltaY < 0)
                    return viewer._TouchDirection.Up;
                return viewer._TouchDirection.None;
            };
            Object.defineProperty(_TouchInfo.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchInfo.prototype, "systemTouchInfo", {
                get: function () {
                    return this._systemTouchInfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchInfo.prototype, "screenX", {
                get: function () {
                    return this._screenX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchInfo.prototype, "screenY", {
                get: function () {
                    return this._screenY;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchInfo.prototype, "clientX", {
                get: function () {
                    return this._clientX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchInfo.prototype, "clientY", {
                get: function () {
                    return this._clientY;
                },
                enumerable: true,
                configurable: true
            });
            return _TouchInfo;
        }());
        viewer._TouchInfo = _TouchInfo;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _SpeedReducer = /** @class */ (function () {
            function _SpeedReducer() {
                this._timeInterval = 50;
                this._speedInterval = 5;
            }
            Object.defineProperty(_SpeedReducer.prototype, "timeInterval", {
                get: function () {
                    return this._timeInterval;
                },
                set: function (value) {
                    this._timeInterval = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SpeedReducer.prototype, "speedInterval", {
                get: function () {
                    return this._speedInterval;
                },
                set: function (value) {
                    this._speedInterval = value;
                },
                enumerable: true,
                configurable: true
            });
            _SpeedReducer.prototype.stop = function () {
                if (this._timer != null) {
                    clearInterval(this._timer);
                    this._timer = null;
                }
            };
            _SpeedReducer.prototype.start = function (speedX, speedY, intervalAction) {
                var _this = this;
                this.stop();
                if (!intervalAction)
                    return;
                var directionX = speedX >= 0 ? 1 : -1, directionY = speedY >= 0 ? 1 : -1, curSpeedX = Math.abs(speedX * this._timeInterval), curSpeedY = Math.abs(speedY * this._timeInterval);
                var largerSpeed = Math.max(curSpeedX, curSpeedY);
                var times = Math.floor(largerSpeed / this.speedInterval);
                var xInterval = Math.floor(curSpeedX / times), yInterval = Math.floor(curSpeedY / times);
                this._timer = setInterval(function () {
                    curSpeedX -= xInterval;
                    curSpeedY -= yInterval;
                    curSpeedX = Math.max(0, curSpeedX);
                    curSpeedY = Math.max(0, curSpeedY);
                    if (!curSpeedX || !curSpeedY) {
                        _this.stop();
                        return;
                    }
                    intervalAction(curSpeedX * directionX, curSpeedY * directionY);
                }, this._timeInterval);
            };
            return _SpeedReducer;
        }());
        viewer._SpeedReducer = _SpeedReducer;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // the virtual scroller
        var _Scroller = /** @class */ (function (_super) {
            __extends(_Scroller, _super);
            function _Scroller() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _Scroller.getScrollbarWidth = function (refresh) {
                var parent, child;
                if (!_Scroller._scrollbarWidth || refresh) {
                    parent = document.createElement('div');
                    parent.style.width = '50px';
                    parent.style.height = '50px';
                    parent.style.overflow = 'auto';
                    document.body.appendChild(parent);
                    child = document.createElement('div');
                    child.style.height = '60px';
                    parent.appendChild(child);
                    _Scroller._scrollbarWidth = parent.offsetWidth - parent.clientWidth;
                    document.body.removeChild(parent);
                }
                return _Scroller._scrollbarWidth;
            };
            _Scroller._scrollbarWidth = null;
            return _Scroller;
        }(wijmo.Control));
        viewer._Scroller = _Scroller;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        function _enumToArray(enumType) {
            var items = [];
            for (var i in enumType) {
                if (!i || !i.length || i[0] == "_" || isNaN(parseInt(i)))
                    continue;
                items.push({ text: enumType[i], value: i });
            }
            return items;
        }
        viewer._enumToArray = _enumToArray;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _RubberbandOnAppliedEventArgs = /** @class */ (function (_super) {
            __extends(_RubberbandOnAppliedEventArgs, _super);
            function _RubberbandOnAppliedEventArgs(rect) {
                var _this = _super.call(this) || this;
                _this._rect = rect;
                return _this;
            }
            Object.defineProperty(_RubberbandOnAppliedEventArgs.prototype, "rect", {
                get: function () {
                    return this._rect;
                },
                enumerable: true,
                configurable: true
            });
            return _RubberbandOnAppliedEventArgs;
        }(wijmo.EventArgs));
        viewer._RubberbandOnAppliedEventArgs = _RubberbandOnAppliedEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _LinkClickedEventArgs = /** @class */ (function (_super) {
            __extends(_LinkClickedEventArgs, _super);
            function _LinkClickedEventArgs(a) {
                var _this = _super.call(this) || this;
                _this._a = a;
                return _this;
            }
            Object.defineProperty(_LinkClickedEventArgs.prototype, "element", {
                get: function () {
                    return this._a;
                },
                enumerable: true,
                configurable: true
            });
            return _LinkClickedEventArgs;
        }(wijmo.EventArgs));
        viewer._LinkClickedEventArgs = _LinkClickedEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Specifies the type of a value.
        var _ParameterType;
        (function (_ParameterType) {
            // Bool type.
            _ParameterType[_ParameterType["Boolean"] = 0] = "Boolean";
            // Date time type.
            _ParameterType[_ParameterType["DateTime"] = 1] = "DateTime";
            // Time type.
            _ParameterType[_ParameterType["Time"] = 2] = "Time";
            // Date type
            _ParameterType[_ParameterType["Date"] = 3] = "Date";
            // Int type.
            _ParameterType[_ParameterType["Integer"] = 4] = "Integer";
            // Float type.
            _ParameterType[_ParameterType["Float"] = 5] = "Float";
            // String type
            _ParameterType[_ParameterType["String"] = 6] = "String";
        })(_ParameterType = viewer._ParameterType || (viewer._ParameterType = {}));
        /**
        * Specifies the type of a catalog item.
        */
        var CatalogItemType;
        (function (CatalogItemType) {
            /**
            * A folder.
            */
            CatalogItemType[CatalogItemType["Folder"] = 0] = "Folder";
            /**
            * A FlexReport definition file.
            */
            CatalogItemType[CatalogItemType["File"] = 1] = "File";
            /**
            * An SSRS report or a FlexReport defined in the FlexReport definition file.
            */
            CatalogItemType[CatalogItemType["Report"] = 2] = "Report";
        })(CatalogItemType = viewer.CatalogItemType || (viewer.CatalogItemType = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Provides arguments for {@link wijmo.viewer.ViewerBase.queryLoadingData} event.
         */
        var QueryLoadingDataEventArgs = /** @class */ (function (_super) {
            __extends(QueryLoadingDataEventArgs, _super);
            /**
             * Initializes a new instance of the {@link QueryLoadingDataEventArgs} class.
             *
             * @param data The request data sent to the service on loading the document.
             */
            function QueryLoadingDataEventArgs(data) {
                var _this = _super.call(this) || this;
                _this._data = data || {};
                return _this;
            }
            Object.defineProperty(QueryLoadingDataEventArgs.prototype, "data", {
                /**
                 * Gets the request data sent to the service on loading the document.
                 */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            return QueryLoadingDataEventArgs;
        }(wijmo.EventArgs));
        viewer.QueryLoadingDataEventArgs = QueryLoadingDataEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Describes the status of the execution.
        var _ExecutionStatus = /** @class */ (function () {
            function _ExecutionStatus() {
            }
            // The report is Loaded.
            _ExecutionStatus.loaded = 'Loaded';
            // The report is rendering.
            _ExecutionStatus.rendering = 'Rendering';
            // The report has rendered.
            _ExecutionStatus.completed = 'Completed';
            // The report rendering has stopped.
            _ExecutionStatus.stopped = 'Stopped';
            // The report is cleared.
            _ExecutionStatus.cleared = 'Cleared';
            // The execution is not found.
            _ExecutionStatus.notFound = 'NotFound';
            return _ExecutionStatus;
        }());
        viewer._ExecutionStatus = _ExecutionStatus;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ActionKind;
        (function (_ActionKind) {
            _ActionKind[_ActionKind["Bookmark"] = 0] = "Bookmark";
            _ActionKind[_ActionKind["Custom"] = 1] = "Custom";
        })(_ActionKind = viewer._ActionKind || (viewer._ActionKind = {}));
        /**
         * Specifies the mouse modes, which defines the mouse behavior of viewer.
         */
        var MouseMode;
        (function (MouseMode) {
            /** Select text. */
            MouseMode[MouseMode["SelectTool"] = 0] = "SelectTool";
            /** Move page. */
            MouseMode[MouseMode["MoveTool"] = 1] = "MoveTool";
            /** Rubberband to zoom. */
            MouseMode[MouseMode["RubberbandTool"] = 2] = "RubberbandTool";
            /** Magnifier tool. */
            MouseMode[MouseMode["MagnifierTool"] = 3] = "MagnifierTool";
        })(MouseMode = viewer.MouseMode || (viewer.MouseMode = {}));
        /**
        * Specifies the view modes, which define how to show document pages in the view panel.
        */
        var ViewMode;
        (function (ViewMode) {
            /** Only show one document page. */
            ViewMode[ViewMode["Single"] = 0] = "Single";
            /** Show document pages continuously. */
            ViewMode[ViewMode["Continuous"] = 1] = "Continuous";
        })(ViewMode = viewer.ViewMode || (viewer.ViewMode = {}));
        /**
         * Describes the supported zoom modes of FlexViewer.
         */
        var ZoomMode;
        (function (ZoomMode) {
            /** Custom zoom mode. The actual zoom factor is determined by the value of the {@link ViewerBase.zoomFactor} property. */
            ZoomMode[ZoomMode["Custom"] = 0] = "Custom";
            /** Pages are zoomed in or out as necessary to fit the page width in the view panel. */
            ZoomMode[ZoomMode["PageWidth"] = 1] = "PageWidth";
            /** Pages are zoomed in or out as necessary to fit the whole page in the view panel. */
            ZoomMode[ZoomMode["WholePage"] = 2] = "WholePage";
        })(ZoomMode = viewer.ZoomMode || (viewer.ZoomMode = {}));
        var _ViewerActionType;
        (function (_ViewerActionType) {
            _ViewerActionType[_ViewerActionType["TogglePaginated"] = 0] = "TogglePaginated";
            _ViewerActionType[_ViewerActionType["Print"] = 1] = "Print";
            _ViewerActionType[_ViewerActionType["Portrait"] = 2] = "Portrait";
            _ViewerActionType[_ViewerActionType["Landscape"] = 3] = "Landscape";
            _ViewerActionType[_ViewerActionType["ShowPageSetupDialog"] = 4] = "ShowPageSetupDialog";
            _ViewerActionType[_ViewerActionType["FirstPage"] = 5] = "FirstPage";
            _ViewerActionType[_ViewerActionType["PrePage"] = 6] = "PrePage";
            _ViewerActionType[_ViewerActionType["NextPage"] = 7] = "NextPage";
            _ViewerActionType[_ViewerActionType["LastPage"] = 8] = "LastPage";
            _ViewerActionType[_ViewerActionType["PageNumber"] = 9] = "PageNumber";
            _ViewerActionType[_ViewerActionType["PageCountLabel"] = 10] = "PageCountLabel";
            _ViewerActionType[_ViewerActionType["Backward"] = 11] = "Backward";
            _ViewerActionType[_ViewerActionType["Forward"] = 12] = "Forward";
            _ViewerActionType[_ViewerActionType["SelectTool"] = 13] = "SelectTool";
            _ViewerActionType[_ViewerActionType["MoveTool"] = 14] = "MoveTool";
            _ViewerActionType[_ViewerActionType["Continuous"] = 15] = "Continuous";
            _ViewerActionType[_ViewerActionType["Single"] = 16] = "Single";
            _ViewerActionType[_ViewerActionType["ZoomOut"] = 17] = "ZoomOut";
            _ViewerActionType[_ViewerActionType["ZoomIn"] = 18] = "ZoomIn";
            _ViewerActionType[_ViewerActionType["ZoomValue"] = 19] = "ZoomValue";
            _ViewerActionType[_ViewerActionType["FitWholePage"] = 20] = "FitWholePage";
            _ViewerActionType[_ViewerActionType["FitPageWidth"] = 21] = "FitPageWidth";
            _ViewerActionType[_ViewerActionType["ToggleFullScreen"] = 22] = "ToggleFullScreen";
            _ViewerActionType[_ViewerActionType["ShowHamburgerMenu"] = 23] = "ShowHamburgerMenu";
            _ViewerActionType[_ViewerActionType["ShowViewMenu"] = 24] = "ShowViewMenu";
            _ViewerActionType[_ViewerActionType["ShowSearchBar"] = 25] = "ShowSearchBar";
            _ViewerActionType[_ViewerActionType["ShowThumbnails"] = 26] = "ShowThumbnails";
            _ViewerActionType[_ViewerActionType["ShowOutlines"] = 27] = "ShowOutlines";
            _ViewerActionType[_ViewerActionType["ShowExportsPanel"] = 28] = "ShowExportsPanel";
            _ViewerActionType[_ViewerActionType["ShowPageSetupPanel"] = 29] = "ShowPageSetupPanel";
            _ViewerActionType[_ViewerActionType["ShowZoomBar"] = 30] = "ShowZoomBar";
            _ViewerActionType[_ViewerActionType["ShowSearchOptions"] = 31] = "ShowSearchOptions";
            _ViewerActionType[_ViewerActionType["SearchPrev"] = 32] = "SearchPrev";
            _ViewerActionType[_ViewerActionType["SearchNext"] = 33] = "SearchNext";
            _ViewerActionType[_ViewerActionType["SearchMatchCase"] = 34] = "SearchMatchCase";
            _ViewerActionType[_ViewerActionType["SearchMatchWholeWord"] = 35] = "SearchMatchWholeWord";
            _ViewerActionType[_ViewerActionType["RubberbandTool"] = 36] = "RubberbandTool";
            _ViewerActionType[_ViewerActionType["MagnifierTool"] = 37] = "MagnifierTool";
            _ViewerActionType[_ViewerActionType["RotateDocument"] = 38] = "RotateDocument";
            _ViewerActionType[_ViewerActionType["RotatePage"] = 39] = "RotatePage";
        })(_ViewerActionType = viewer._ViewerActionType || (viewer._ViewerActionType = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _RotateAngle;
        (function (_RotateAngle) {
            _RotateAngle[_RotateAngle["NoRotate"] = 0] = "NoRotate";
            _RotateAngle[_RotateAngle["Rotation90"] = 1] = "Rotation90";
            _RotateAngle[_RotateAngle["Rotation180"] = 2] = "Rotation180";
            _RotateAngle[_RotateAngle["Rotation270"] = 3] = "Rotation270";
        })(_RotateAngle = viewer._RotateAngle || (viewer._RotateAngle = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Specifies the standard paper sizes.
        var _PaperKind;
        (function (_PaperKind) {
            // The paper size is defined by the user.
            _PaperKind[_PaperKind["Custom"] = 0] = "Custom";
            // Letter paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["Letter"] = 1] = "Letter";
            // Letter small paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["LetterSmall"] = 2] = "LetterSmall";
            // Tabloid paper (11 in. by 17 in.).
            _PaperKind[_PaperKind["Tabloid"] = 3] = "Tabloid";
            // Ledger paper (17 in. by 11 in.).
            _PaperKind[_PaperKind["Ledger"] = 4] = "Ledger";
            // Legal paper (8.5 in. by 14 in.).
            _PaperKind[_PaperKind["Legal"] = 5] = "Legal";
            // Statement paper (5.5 in. by 8.5 in.).
            _PaperKind[_PaperKind["Statement"] = 6] = "Statement";
            // Executive paper (7.25 in. by 10.5 in.).
            _PaperKind[_PaperKind["Executive"] = 7] = "Executive";
            // A3 paper (297 mm by 420 mm).
            _PaperKind[_PaperKind["A3"] = 8] = "A3";
            // A4 paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4"] = 9] = "A4";
            // A4 small paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4Small"] = 10] = "A4Small";
            // A5 paper (148 mm by 210 mm).
            _PaperKind[_PaperKind["A5"] = 11] = "A5";
            // B4 paper (250 mm by 353 mm).
            _PaperKind[_PaperKind["B4"] = 12] = "B4";
            // B5 paper (176 mm by 250 mm).
            _PaperKind[_PaperKind["B5"] = 13] = "B5";
            // Folio paper (8.5 in. by 13 in.).
            _PaperKind[_PaperKind["Folio"] = 14] = "Folio";
            //  Quarto paper (215 mm by 275 mm).
            _PaperKind[_PaperKind["Quarto"] = 15] = "Quarto";
            // Standard paper (10 in. by 14 in.).
            _PaperKind[_PaperKind["Standard10x14"] = 16] = "Standard10x14";
            // Standard paper (11 in. by 17 in.).
            _PaperKind[_PaperKind["Standard11x17"] = 17] = "Standard11x17";
            // Note paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["Note"] = 18] = "Note";
            //  #9 envelope (3.875 in. by 8.875 in.).
            _PaperKind[_PaperKind["Number9Envelope"] = 19] = "Number9Envelope";
            // #10 envelope (4.125 in. by 9.5 in.).
            _PaperKind[_PaperKind["Number10Envelope"] = 20] = "Number10Envelope";
            // #11 envelope (4.5 in. by 10.375 in.).
            _PaperKind[_PaperKind["Number11Envelope"] = 21] = "Number11Envelope";
            // #12 envelope (4.75 in. by 11 in.).
            _PaperKind[_PaperKind["Number12Envelope"] = 22] = "Number12Envelope";
            // #14 envelope (5 in. by 11.5 in.).
            _PaperKind[_PaperKind["Number14Envelope"] = 23] = "Number14Envelope";
            // C paper (17 in. by 22 in.).
            _PaperKind[_PaperKind["CSheet"] = 24] = "CSheet";
            // D paper (22 in. by 34 in.).
            _PaperKind[_PaperKind["DSheet"] = 25] = "DSheet";
            // E paper (34 in. by 44 in.).
            _PaperKind[_PaperKind["ESheet"] = 26] = "ESheet";
            // DL envelope (110 mm by 220 mm).
            _PaperKind[_PaperKind["DLEnvelope"] = 27] = "DLEnvelope";
            //  C5 envelope (162 mm by 229 mm).
            _PaperKind[_PaperKind["C5Envelope"] = 28] = "C5Envelope";
            // C3 envelope (324 mm by 458 mm).
            _PaperKind[_PaperKind["C3Envelope"] = 29] = "C3Envelope";
            // C4 envelope (229 mm by 324 mm).
            _PaperKind[_PaperKind["C4Envelope"] = 30] = "C4Envelope";
            // C6 envelope (114 mm by 162 mm).
            _PaperKind[_PaperKind["C6Envelope"] = 31] = "C6Envelope";
            // C65 envelope (114 mm by 229 mm).
            _PaperKind[_PaperKind["C65Envelope"] = 32] = "C65Envelope";
            // B4 envelope (250 mm by 353 mm).
            _PaperKind[_PaperKind["B4Envelope"] = 33] = "B4Envelope";
            // B5 envelope (176 mm by 250 mm).
            _PaperKind[_PaperKind["B5Envelope"] = 34] = "B5Envelope";
            //  B6 envelope (176 mm by 125 mm).
            _PaperKind[_PaperKind["B6Envelope"] = 35] = "B6Envelope";
            // Italy envelope (110 mm by 230 mm).
            _PaperKind[_PaperKind["ItalyEnvelope"] = 36] = "ItalyEnvelope";
            // Monarch envelope (3.875 in. by 7.5 in.).
            _PaperKind[_PaperKind["MonarchEnvelope"] = 37] = "MonarchEnvelope";
            // 6 3/4 envelope (3.625 in. by 6.5 in.).
            _PaperKind[_PaperKind["PersonalEnvelope"] = 38] = "PersonalEnvelope";
            // US standard fanfold (14.875 in. by 11 in.).
            _PaperKind[_PaperKind["USStandardFanfold"] = 39] = "USStandardFanfold";
            // German standard fanfold (8.5 in. by 12 in.).
            _PaperKind[_PaperKind["GermanStandardFanfold"] = 40] = "GermanStandardFanfold";
            // German legal fanfold (8.5 in. by 13 in.).
            _PaperKind[_PaperKind["GermanLegalFanfold"] = 41] = "GermanLegalFanfold";
            // ISO B4 (250 mm by 353 mm).
            _PaperKind[_PaperKind["IsoB4"] = 42] = "IsoB4";
            // Japanese postcard (100 mm by 148 mm).
            _PaperKind[_PaperKind["JapanesePostcard"] = 43] = "JapanesePostcard";
            // Standard paper (9 in. by 11 in.).
            _PaperKind[_PaperKind["Standard9x11"] = 44] = "Standard9x11";
            // Standard paper (10 in. by 11 in.).
            _PaperKind[_PaperKind["Standard10x11"] = 45] = "Standard10x11";
            // Standard paper (15 in. by 11 in.).
            _PaperKind[_PaperKind["Standard15x11"] = 46] = "Standard15x11";
            // Invitation envelope (220 mm by 220 mm).
            _PaperKind[_PaperKind["InviteEnvelope"] = 47] = "InviteEnvelope";
            // Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
            // driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["LetterExtra"] = 50] = "LetterExtra";
            // Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
            // driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["LegalExtra"] = 51] = "LegalExtra";
            // Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the
            // PostScript driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["TabloidExtra"] = 52] = "TabloidExtra";
            // A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript
            // driver and is used only by Linotronic printers to help save paper.
            _PaperKind[_PaperKind["A4Extra"] = 53] = "A4Extra";
            // Letter transverse paper (8.275 in. by 11 in.).
            _PaperKind[_PaperKind["LetterTransverse"] = 54] = "LetterTransverse";
            // A4 transverse paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4Transverse"] = 55] = "A4Transverse";
            // Letter extra transverse paper (9.275 in. by 12 in.).
            _PaperKind[_PaperKind["LetterExtraTransverse"] = 56] = "LetterExtraTransverse";
            // SuperA/SuperA/A4 paper (227 mm by 356 mm).
            _PaperKind[_PaperKind["APlus"] = 57] = "APlus";
            // SuperB/SuperB/A3 paper (305 mm by 487 mm).
            _PaperKind[_PaperKind["BPlus"] = 58] = "BPlus";
            // Letter plus paper (8.5 in. by 12.69 in.).
            _PaperKind[_PaperKind["LetterPlus"] = 59] = "LetterPlus";
            // A4 plus paper (210 mm by 330 mm).
            _PaperKind[_PaperKind["A4Plus"] = 60] = "A4Plus";
            // A5 transverse paper (148 mm by 210 mm).
            _PaperKind[_PaperKind["A5Transverse"] = 61] = "A5Transverse";
            // JIS B5 transverse paper (182 mm by 257 mm).
            _PaperKind[_PaperKind["B5Transverse"] = 62] = "B5Transverse";
            // A3 extra paper (322 mm by 445 mm).
            _PaperKind[_PaperKind["A3Extra"] = 63] = "A3Extra";
            // A5 extra paper (174 mm by 235 mm).
            _PaperKind[_PaperKind["A5Extra"] = 64] = "A5Extra";
            // ISO B5 extra paper (201 mm by 276 mm).
            _PaperKind[_PaperKind["B5Extra"] = 65] = "B5Extra";
            // A2 paper (420 mm by 594 mm).
            _PaperKind[_PaperKind["A2"] = 66] = "A2";
            // A3 transverse paper (297 mm by 420 mm).
            _PaperKind[_PaperKind["A3Transverse"] = 67] = "A3Transverse";
            // A3 extra transverse paper (322 mm by 445 mm).
            _PaperKind[_PaperKind["A3ExtraTransverse"] = 68] = "A3ExtraTransverse";
            // Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseDoublePostcard"] = 69] = "JapaneseDoublePostcard";
            // A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A6"] = 70] = "A6";
            // Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber2"] = 71] = "JapaneseEnvelopeKakuNumber2";
            // Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber3"] = 72] = "JapaneseEnvelopeKakuNumber3";
            // Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber3"] = 73] = "JapaneseEnvelopeChouNumber3";
            // Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber4"] = 74] = "JapaneseEnvelopeChouNumber4";
            // Letter rotated paper (11 in. by 8.5 in.).
            _PaperKind[_PaperKind["LetterRotated"] = 75] = "LetterRotated";
            // A3 rotated paper (420 mm by 297 mm).
            _PaperKind[_PaperKind["A3Rotated"] = 76] = "A3Rotated";
            //  A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A4Rotated"] = 77] = "A4Rotated";
            // A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A5Rotated"] = 78] = "A5Rotated";
            // JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B4JisRotated"] = 79] = "B4JisRotated";
            // JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B5JisRotated"] = 80] = "B5JisRotated";
            // Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapanesePostcardRotated"] = 81] = "JapanesePostcardRotated";
            // Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseDoublePostcardRotated"] = 82] = "JapaneseDoublePostcardRotated";
            // A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A6Rotated"] = 83] = "A6Rotated";
            // Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber2Rotated"] = 84] = "JapaneseEnvelopeKakuNumber2Rotated";
            // Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber3Rotated"] = 85] = "JapaneseEnvelopeKakuNumber3Rotated";
            // Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber3Rotated"] = 86] = "JapaneseEnvelopeChouNumber3Rotated";
            // Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber4Rotated"] = 87] = "JapaneseEnvelopeChouNumber4Rotated";
            // JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B6Jis"] = 88] = "B6Jis";
            // JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B6JisRotated"] = 89] = "B6JisRotated";
            // Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Standard12x11"] = 90] = "Standard12x11";
            // Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeYouNumber4"] = 91] = "JapaneseEnvelopeYouNumber4";
            // Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeYouNumber4Rotated"] = 92] = "JapaneseEnvelopeYouNumber4Rotated";
            // People's Republic of China 16K paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc16K"] = 93] = "Prc16K";
            // People's Republic of China 32K paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32K"] = 94] = "Prc32K";
            // People's Republic of China 32K big paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KBig"] = 95] = "Prc32KBig";
            // People's Republic of China #1 envelope (102 mm by 165 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber1"] = 96] = "PrcEnvelopeNumber1";
            // People's Republic of China #2 envelope (102 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber2"] = 97] = "PrcEnvelopeNumber2";
            // People's Republic of China #3 envelope (125 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber3"] = 98] = "PrcEnvelopeNumber3";
            // People's Republic of China #4 envelope (110 mm by 208 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber4"] = 99] = "PrcEnvelopeNumber4";
            // People's Republic of China #5 envelope (110 mm by 220 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber5"] = 100] = "PrcEnvelopeNumber5";
            // People's Republic of China #6 envelope (120 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber6"] = 101] = "PrcEnvelopeNumber6";
            // People's Republic of China #7 envelope (160 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber7"] = 102] = "PrcEnvelopeNumber7";
            // People's Republic of China #8 envelope (120 mm by 309 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber8"] = 103] = "PrcEnvelopeNumber8";
            // People's Republic of China #9 envelope (229 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber9"] = 104] = "PrcEnvelopeNumber9";
            // People's Republic of China #10 envelope (324 mm by 458 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber10"] = 105] = "PrcEnvelopeNumber10";
            // People's Republic of China 16K rotated paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc16KRotated"] = 106] = "Prc16KRotated";
            // People's Republic of China 32K rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KRotated"] = 107] = "Prc32KRotated";
            // People's Republic of China 32K big rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KBigRotated"] = 108] = "Prc32KBigRotated";
            //  People's Republic of China #1 rotated envelope (165 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber1Rotated"] = 109] = "PrcEnvelopeNumber1Rotated";
            // People's Republic of China #2 rotated envelope (176 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber2Rotated"] = 110] = "PrcEnvelopeNumber2Rotated";
            // People's Republic of China #3 rotated envelope (176 mm by 125 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber3Rotated"] = 111] = "PrcEnvelopeNumber3Rotated";
            // People's Republic of China #4 rotated envelope (208 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber4Rotated"] = 112] = "PrcEnvelopeNumber4Rotated";
            // People's Republic of China Envelope #5 rotated envelope (220 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber5Rotated"] = 113] = "PrcEnvelopeNumber5Rotated";
            // People's Republic of China #6 rotated envelope (230 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber6Rotated"] = 114] = "PrcEnvelopeNumber6Rotated";
            // People's Republic of China #7 rotated envelope (230 mm by 160 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber7Rotated"] = 115] = "PrcEnvelopeNumber7Rotated";
            // People's Republic of China #8 rotated envelope (309 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber8Rotated"] = 116] = "PrcEnvelopeNumber8Rotated";
            // People's Republic of China #9 rotated envelope (324 mm by 229 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber9Rotated"] = 117] = "PrcEnvelopeNumber9Rotated";
            // People's Republic of China #10 rotated envelope (458 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber10Rotated"] = 118] = "PrcEnvelopeNumber10Rotated";
        })(_PaperKind = viewer._PaperKind || (viewer._PaperKind = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Provides arguments for {@link wijmo.viewer.ViewerBase.beforeSendRequest} event.
         */
        var RequestEventArgs = /** @class */ (function (_super) {
            __extends(RequestEventArgs, _super);
            /**
             * Initializes a new instance of the {@link RequestEventArgs} class.
             *
             * @param url String containing the URL to which the request is sent.
             * @param settings An object used to configure the request. It has the
             * same structure and semantics as the <b>settings</b> parameter of the
             * {@link wijmo.httpRequest} method.
             */
            function RequestEventArgs(url, settings) {
                var _this = _super.call(this) || this;
                _this._url = url;
                _this._settings = settings;
                return _this;
            }
            Object.defineProperty(RequestEventArgs.prototype, "url", {
                /**
                 * Gets or sets the URL to which the request is sent.
                 */
                get: function () {
                    return this._url;
                },
                set: function (value) {
                    this._url = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RequestEventArgs.prototype, "settings", {
                /**
                 * Gets or sets the object used to configure the request. It has the
                 * same structure and semantics as the <b>settings</b> parameter of the
                 * {@link wijmo.httpRequest} method.
                 */
                get: function () {
                    return this._settings;
                },
                set: function (value) {
                    this._settings = value;
                },
                enumerable: true,
                configurable: true
            });
            return RequestEventArgs;
        }(wijmo.EventArgs));
        viewer.RequestEventArgs = RequestEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // initialize viewer resources
        wijmo._addCultureInfo('Viewer', {
            // for ViewerBase
            cancel: 'Cancel',
            ok: 'OK',
            bottom: 'Bottom:',
            top: 'Top:',
            right: 'Right:',
            left: 'Left:',
            margins: 'Margins(inches)',
            orientation: 'Orientation:',
            paperKind: 'Paper Kind:',
            pageSetup: 'Page Setup',
            landscape: 'Landscape',
            portrait: 'Portrait',
            pageNumber: 'Page Number',
            zoomFactor: 'Zoom Factor',
            paginated: 'Paginated',
            print: 'Print',
            search: 'Search',
            matchCase: 'Match case',
            wholeWord: 'Match whole word only',
            searchResults: 'Search Results',
            previousPage: 'Previous Page',
            nextPage: 'Next Page',
            firstPage: 'First Page',
            lastPage: 'Last Page',
            backwardHistory: 'Backward',
            forwardHistory: 'Forward',
            pageCount: 'Page Count',
            selectTool: 'Select Tool',
            moveTool: 'Move Tool',
            continuousMode: 'Continuous Page View',
            singleMode: 'Single Page View',
            wholePage: 'Fit Whole Page',
            pageWidth: 'Fit Page Width',
            zoomOut: 'Zoom Out',
            zoomIn: 'Zoom In',
            rubberbandTool: 'Zoom by Selection',
            magnifierTool: 'Magnifier',
            rotatePage: 'Rotate Page',
            rotateDocument: 'Rotate Document',
            exports: 'Export',
            fullScreen: 'Full Screen',
            exitFullScreen: 'Exit Full Screen',
            hamburgerMenu: 'Tools',
            showSearchBar: 'Show Search Bar',
            viewMenu: 'Layout Options',
            searchOptions: 'Search Options',
            matchCaseMenuItem: 'Match Case',
            wholeWordMenuItem: 'Match Whole Word',
            thumbnails: 'Page Thumbnails',
            outlines: 'Document Map',
            loading: 'Loading...',
            pdfExportName: 'Adobe PDF',
            docxExportName: 'Open XML Word',
            xlsxExportName: 'Open XML Excel',
            docExportName: 'Microsoft Word',
            xlsExportName: 'Microsoft Excel',
            mhtmlExportName: 'Web archive (MHTML)',
            htmlExportName: 'HTML document',
            rtfExportName: 'RTF document',
            metafileExportName: 'Compressed metafiles',
            csvExportName: 'CSV',
            tiffExportName: 'Tiff images',
            bmpExportName: 'BMP images',
            emfExportName: 'Enhanced metafile',
            gifExportName: 'GIF images',
            jpgExportName: 'JPEG images',
            jpegExportName: 'JPEG images',
            pngExportName: 'PNG images',
            abstractMethodException: 'It is an abstract method, please implement it.',
            cannotRenderPageNoViewPage: 'Cannot render page without document source and view page.',
            cannotRenderPageNoDoc: 'Cannot render page without document source and view page.',
            exportFormat: 'Export format:',
            //export options
            exportOptionTitle: 'Export options',
            documentRestrictionsGroup: 'Document restrictions',
            passwordSecurityGroup: 'Password security',
            outputRangeGroup: 'Output range',
            documentInfoGroup: 'Document info',
            generalGroup: 'General',
            docInfoTitle: 'Title',
            docInfoAuthor: 'Author',
            docInfoManager: 'Manager',
            docInfoOperator: 'Operator',
            docInfoCompany: 'Company',
            docInfoSubject: 'Subject',
            docInfoComment: 'Comment',
            docInfoCreator: 'Creator',
            docInfoProducer: 'Producer',
            docInfoCreationTime: 'Creation time',
            docInfoRevisionTime: 'Revision time',
            docInfoKeywords: 'Keywords',
            embedFonts: 'Embed TrueType fonts',
            pdfACompatible: 'PDF/A compatible (level 2B)',
            useCompression: 'Use compression',
            useOutlines: 'Generate outlines',
            allowCopyContent: 'Allow content copying or extraction',
            allowEditAnnotations: 'Allow annotations editing',
            allowEditContent: 'Allow content editing',
            allowPrint: 'Allow printing',
            ownerPassword: 'Permissions (owner) password:',
            userPassword: 'Document open (user) password:',
            encryptionType: 'Encryption level:',
            paged: 'Paged',
            showNavigator: 'Show Navigator',
            navigatorPosition: 'Navigator Position',
            singleFile: 'Single File',
            tolerance: 'Tolerance when detecting text bounds (points):',
            pictureLayer: 'Use separate picture layer',
            metafileType: 'Metafile Type:',
            monochrome: 'Monochrome',
            resolution: 'Resolution:',
            outputRange: 'Page range:',
            outputRangeInverted: 'Inverted',
            showZoomBar: 'Zoom Bar',
            searchPrev: 'Search Previous',
            searchNext: 'Search Next',
            checkMark: '\u2713',
            exportOk: 'Export...',
            cannotSearch: 'Search requires a document source to be specified.',
            //for ReportViewer
            parameters: 'Parameters',
            requiringParameters: 'Please input parameters.',
            nullParameterError: 'Value cannot be null.',
            invalidParameterError: 'Invalid input.',
            parameterNoneItemsSelected: '(none)',
            parameterAllItemsSelected: '(all)',
            parameterSelectAllItemText: '(Select All)',
            selectParameterValue: '(select value)',
            apply: 'Apply',
            errorOccured: 'An error has occured.'
        });
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Enumerates units of measurement.
        var _UnitType;
        (function (_UnitType) {
            // Specifies the document unit (1/300 inch) as the unit of measure.
            _UnitType[_UnitType["Document"] = 0] = "Document";
            // Specifies the inch as the unit of measure.
            _UnitType[_UnitType["Inch"] = 1] = "Inch";
            // Specifies the millimeter as the unit of measure.
            _UnitType[_UnitType["Mm"] = 2] = "Mm";
            // Specifies the pica unit (1/6 inch) as the unit of measure.
            _UnitType[_UnitType["Pica"] = 3] = "Pica";
            // Specifies a printer's point (1/72 inch) as the unit of measure.
            _UnitType[_UnitType["Point"] = 4] = "Point";
            // Specifies a twip (1/1440 inch) as the unit of measure.
            _UnitType[_UnitType["Twip"] = 5] = "Twip";
            // Specifies a hundredths of an inch as the unit of measure.
            _UnitType[_UnitType["InHs"] = 6] = "InHs";
            // Specifies 1/75 inch as the unit of measure.
            _UnitType[_UnitType["Display"] = 7] = "Display";
            // Specifies centimetre's as the unit of measure.
            _UnitType[_UnitType["Cm"] = 8] = "Cm";
            // Specifies DIP's 1/96 inch as the unit of measure.
            _UnitType[_UnitType["Dip"] = 9] = "Dip";
        })(_UnitType = viewer._UnitType || (viewer._UnitType = {}));
        // A utility structure specifying some values related to units of measurement.
        var _Unit = /** @class */ (function () {
            // Creates a _Unit instance.
            // @param value The value.
            // @param units The units of the value. If it is not passed, it is Dip for default.
            function _Unit(value, units) {
                if (units === void 0) { units = _UnitType.Dip; }
                _Unit._initUnitTypeDic();
                if (wijmo.isObject(value)) {
                    var obj = value;
                    value = obj.value;
                    units = obj.units;
                }
                else if (wijmo.isString(value)) {
                    var numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        units = _Unit._unitTypeDic[value.substr(numValue.toString().length)];
                        value = numValue;
                    }
                }
                this._value = value;
                this._units = units;
                this._valueInPixel = _Unit.convertValue(value, units, _UnitType.Dip);
            }
            _Unit._initUnitTypeDic = function () {
                if (_Unit._unitTypeDic) {
                    return;
                }
                _Unit._unitTypeDic = {};
                for (var k in _Unit._unitTypes) {
                    _Unit._unitTypeDic[_Unit._unitTypeDic[k] = _Unit._unitTypes[k]] = k;
                }
            };
            Object.defineProperty(_Unit.prototype, "value", {
                // Gets the value of the current unit.
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Unit.prototype, "units", {
                // Gets the unit of measurement of the current unit.
                get: function () {
                    return this._units;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Unit.prototype, "valueInPixel", {
                // Gets the value in pixel.
                get: function () {
                    return this._valueInPixel;
                },
                enumerable: true,
                configurable: true
            });
            // Convert to string.
            // @return The string of converting result.
            _Unit.prototype.toString = function () {
                return _Unit.toString(this);
            };
            // Convert the unit to string.
            // @param unit The unit used to convert.
            // @return The string of converting result.
            _Unit.toString = function (unit) {
                if (unit.value == null) {
                    return '';
                }
                return unit.value + _Unit._unitTypeDic[unit.units];
            };
            // Convert the value from one kind of unit to another.
            // @param value The value used to convert.
            // @param from The units of the value.
            // @param to The units which is converted to.
            // @return The number of converting result.
            _Unit.convertValue = function (value, from, to) {
                if (from === to) {
                    return value;
                }
                var valueInInch;
                switch (from) {
                    case _UnitType.Document:
                        valueInInch = value / _Unit._DocumentUnitsPerInch;
                        break;
                    case _UnitType.Inch:
                        valueInInch = value;
                        break;
                    case _UnitType.Mm:
                        valueInInch = value / _Unit._MmPerInch;
                        break;
                    case _UnitType.Pica:
                        valueInInch = value / _Unit._PicaPerInch;
                        break;
                    case _UnitType.Point:
                        valueInInch = value / _Unit._PointsPerInch;
                        break;
                    case _UnitType.Twip:
                        valueInInch = value / _Unit._TwipsPerInch;
                        break;
                    case _UnitType.InHs:
                        valueInInch = value / 100;
                        break;
                    case _UnitType.Display:
                        valueInInch = value / _Unit._DisplayPerInch;
                        break;
                    case _UnitType.Cm:
                        valueInInch = value / _Unit._CmPerInch;
                        break;
                    case _UnitType.Dip:
                        valueInInch = value / _Unit._DipPerInch;
                        break;
                    default:
                        throw 'Invalid from _UnitType: ' + from;
                }
                switch (to) {
                    case _UnitType.Document:
                        return valueInInch * _Unit._DocumentUnitsPerInch;
                    case _UnitType.Inch:
                        return valueInInch;
                    case _UnitType.Mm:
                        return valueInInch * _Unit._MmPerInch;
                    case _UnitType.Pica:
                        return valueInInch * _Unit._PicaPerInch;
                    case _UnitType.Point:
                        return valueInInch * _Unit._PointsPerInch;
                    case _UnitType.Twip:
                        return valueInInch * _Unit._TwipsPerInch;
                    case _UnitType.InHs:
                        return valueInInch * 100;
                    case _UnitType.Display:
                        return valueInInch * _Unit._DisplayPerInch;
                    case _UnitType.Cm:
                        return valueInInch * _Unit._CmPerInch;
                    case _UnitType.Dip:
                        return valueInInch * _Unit._DipPerInch;
                    default:
                        throw 'Invalid to _UnitType: ' + to;
                }
            };
            // Millimeters per inch.
            _Unit._MmPerInch = 25.4;
            // Document units per inch.
            _Unit._DocumentUnitsPerInch = 300;
            // Points per inch.
            _Unit._PointsPerInch = 72;
            // Twips per inch.
            _Unit._TwipsPerInch = 1440;
            // Picas per inch.
            _Unit._PicaPerInch = 6;
            // Centimeters per inch.
            _Unit._CmPerInch = _Unit._MmPerInch / 10;
            // Display units per inch.
            _Unit._DisplayPerInch = 75;
            // DIP units per inch.
            _Unit._DipPerInch = 96;
            _Unit._unitTypes = {
                doc: _UnitType.Document,
                in: _UnitType.Inch,
                mm: _UnitType.Mm,
                pc: _UnitType.Pica,
                pt: _UnitType.Point,
                tw: _UnitType.Twip,
                inhs: _UnitType.InHs,
                dsp: _UnitType.Display,
                cm: _UnitType.Cm,
                dip: _UnitType.Dip,
                px: _UnitType.Dip
            };
            return _Unit;
        }());
        viewer._Unit = _Unit;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _Promise = /** @class */ (function () {
            function _Promise() {
                this._callbacks = [];
                this._finished = false;
            }
            Object.defineProperty(_Promise.prototype, "isFinished", {
                get: function () {
                    return this._finished;
                },
                enumerable: true,
                configurable: true
            });
            _Promise.prototype.cancel = function () {
                this._finished = true;
            };
            _Promise.prototype.then = function (onFulfilled, onRejected) {
                this._callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });
                return this;
            };
            _Promise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            _Promise.prototype.resolve = function (value) {
                var _this = this;
                setTimeout(function () {
                    try {
                        _this.onFulfilled(value);
                    }
                    catch (e) {
                        _this.onRejected(e);
                    }
                }, 0);
                return this;
            };
            _Promise.prototype.reject = function (reason) {
                var _this = this;
                setTimeout(function () {
                    _this.onRejected(reason);
                }, 0);
                return this;
            };
            _Promise.prototype.onFulfilled = function (value) {
                if (this._finished) {
                    return;
                }
                this._finished = true;
                var callback;
                while (callback = this._callbacks.shift()) {
                    if (callback.onFulfilled) {
                        var newValue = callback.onFulfilled(value);
                        if (newValue !== undefined) {
                            value = newValue;
                        }
                    }
                }
            };
            _Promise.prototype.onRejected = function (reason) {
                if (this._finished) {
                    return;
                }
                this._finished = true;
                var callback;
                while (callback = this._callbacks.shift()) {
                    if (callback.onRejected) {
                        var value = callback.onRejected(reason);
                        this.onFulfilled(value);
                        return;
                    }
                }
                throw reason;
            };
            return _Promise;
        }());
        viewer._Promise = _Promise;
        var _CompositedPromise = /** @class */ (function (_super) {
            __extends(_CompositedPromise, _super);
            function _CompositedPromise(promises) {
                var _this = _super.call(this) || this;
                _this._promises = promises;
                _this._init();
                return _this;
            }
            _CompositedPromise.prototype._init = function () {
                var _this = this;
                if (!this._promises || !this._promises.length) {
                    this.reject('No promises in current composited promise.');
                    return;
                }
                var length = this._promises.length, i = 0, values = [], isRejected = false;
                this._promises.some(function (p) {
                    p.then(function (v) {
                        if (isRejected) {
                            return;
                        }
                        values.push(v);
                        if (++i >= length) {
                            _this.resolve(values);
                        }
                    }).catch(function (r) {
                        isRejected = true;
                        _this.reject(r);
                    });
                    return isRejected;
                });
            };
            return _CompositedPromise;
        }(_Promise));
        viewer._CompositedPromise = _CompositedPromise;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _wjEventsName = '__wjEvents';
        viewer._abstractMethodExceptionText = 'It is an abstract method, please implement it.';
        viewer._hiddenCss = 'hidden';
        function _pointMove(positive, pos, detalPosOrX, y) {
            var x, factor = positive ? 1 : -1;
            if (detalPosOrX instanceof wijmo.Point) {
                x = detalPosOrX.x;
                y = detalPosOrX.y;
            }
            else {
                x = detalPosOrX;
                y = y || 0;
            }
            return new wijmo.Point(pos.x + factor * x, pos.y + factor * y);
        }
        viewer._pointMove = _pointMove;
        function _disableCache(url) {
            return url + (url.indexOf('?') == -1 ? '?' : '&') + '_=' + new Date().getTime();
        }
        viewer._disableCache = _disableCache;
        function _removeChildren(node, condition) {
            if (!node || !node.children) {
                return;
            }
            for (var ch = node.children, i = ch.length - 1; i > -1; i--) {
                var child = ch[i];
                if (condition == null || condition(child)) {
                    var cc = child.querySelector('.wj-control');
                    if (cc && (cc = wijmo.Control.getControl(cc))) {
                        cc.dispose();
                    }
                    node.removeChild(child);
                }
            }
        }
        viewer._removeChildren = _removeChildren;
        function _toDOMs(html) {
            var node, container = document.createElement("div"), f = document.createDocumentFragment();
            container.innerHTML = html;
            while (node = container.firstChild)
                f.appendChild(node);
            return f;
        }
        viewer._toDOMs = _toDOMs;
        function _addEvent(elm, evType, fn, useCapture) {
            var types = evType.split(","), type;
            for (var i = 0; i < types.length; i++) {
                type = types[i].trim();
                if (elm.addEventListener) {
                    elm.addEventListener(type, fn, useCapture);
                }
                else if (elm.attachEvent) {
                    elm.attachEvent('on' + type, fn);
                }
                else {
                    elm['on' + type] = fn;
                }
            }
        }
        viewer._addEvent = _addEvent;
        function _removeEvent(elm, evType, fn) {
            var types = evType.split(","), type;
            for (var i = 0; i < types.length; i++) {
                type = types[i].trim();
                if (elm.removeEventListener) {
                    elm.removeEventListener(type, fn);
                }
                else if (elm.detachEvent) {
                    elm.detachEvent('on' + type, fn);
                }
                else {
                    elm['on' + type] = null;
                }
            }
        }
        viewer._removeEvent = _removeEvent;
        function _addWjHandler(key, event, func, self) {
            if (key) {
                var handlersDic = event[_wjEventsName];
                if (!handlersDic) {
                    handlersDic = event[_wjEventsName] = {};
                }
                var handlers = handlersDic[key];
                if (!handlers) {
                    handlers = handlersDic[key] = [];
                }
                handlers.push(func);
            }
            event.addHandler(func, self);
        }
        viewer._addWjHandler = _addWjHandler;
        function _removeAllWjHandlers(key, event) {
            if (!key) {
                return;
            }
            var handlersDic = event[_wjEventsName];
            if (!handlersDic) {
                return;
            }
            var handlers = handlersDic[key];
            if (!handlers) {
                return;
            }
            handlers.forEach(function (h) { return event.removeHandler(h); });
        }
        viewer._removeAllWjHandlers = _removeAllWjHandlers;
        function _getErrorMessage(reason) {
            var errorText;
            if (viewer._ArReportService.IsError(reason)) {
                errorText = reason.json.Error.Description;
            }
            else {
                errorText = reason;
                if (reason.Message) {
                    errorText = reason.Message;
                    if (reason.ExceptionMessage) {
                        errorText += '<br/>' + reason.ExceptionMessage;
                    }
                }
            }
            return errorText || wijmo.culture.Viewer.errorOccured;
        }
        viewer._getErrorMessage = _getErrorMessage;
        function _twipToPixel(value) {
            return viewer._Unit.convertValue(value, viewer._UnitType.Twip, viewer._UnitType.Dip);
        }
        viewer._twipToPixel = _twipToPixel;
        function _pixelToTwip(value) {
            return viewer._Unit.convertValue(value, viewer._UnitType.Dip, viewer._UnitType.Twip);
        }
        viewer._pixelToTwip = _pixelToTwip;
        function _transformSvg(svg, width, height, zoomFactor, rotateAngle) {
            zoomFactor = zoomFactor == null ? 1.0 : zoomFactor;
            var g = svg.querySelector('g');
            if (g) {
                var transformAttr = 'scale(' + zoomFactor + ')';
                if (rotateAngle != null) {
                    switch (rotateAngle) {
                        case viewer._RotateAngle.Rotation90:
                            transformAttr += ' rotate(90)';
                            transformAttr += ' translate(0 ' + -height + ')';
                            break;
                        case viewer._RotateAngle.Rotation180:
                            transformAttr += ' rotate(180)';
                            transformAttr += ' translate(' + -width + ' ' + -height + ')';
                            break;
                        case viewer._RotateAngle.Rotation270:
                            transformAttr += ' rotate(270)';
                            transformAttr += ' translate(' + -width + ' 0)';
                            break;
                    }
                }
                g.setAttribute('transform', transformAttr);
                // In IE, if we set the transform attribute of G element, the element in the G element maybe displayed incorrectly(144673), 
                // to fix it, we have to redraw the svg element: remove the G element and append it to svg again.
                if (wijmo.isIE) {
                    svg = g.parentNode;
                    svg.removeChild(g);
                    svg.appendChild(g);
                }
            }
            return svg;
        }
        viewer._transformSvg = _transformSvg;
        function _getTransformedPosition(bound, size, rotateAngle, zoomFactor) {
            var boundsPx = {
                x: _twipToPixel(bound.x),
                y: _twipToPixel(bound.y),
                width: _twipToPixel(bound.width),
                height: _twipToPixel(bound.height)
            }, heightOffset, widthOffset;
            switch (rotateAngle) {
                case viewer._RotateAngle.NoRotate:
                    heightOffset = boundsPx.y;
                    widthOffset = boundsPx.x;
                    break;
                case viewer._RotateAngle.Rotation90:
                    heightOffset = boundsPx.x;
                    widthOffset = size.height.valueInPixel - boundsPx.y - boundsPx.height;
                    break;
                case viewer._RotateAngle.Rotation180:
                    heightOffset = size.height.valueInPixel - boundsPx.y - boundsPx.height;
                    widthOffset = size.width.valueInPixel - boundsPx.x - boundsPx.width;
                    break;
                case viewer._RotateAngle.Rotation270:
                    heightOffset = size.width.valueInPixel - boundsPx.x - boundsPx.width;
                    widthOffset = boundsPx.y;
                    break;
            }
            return new wijmo.Point(widthOffset * zoomFactor, heightOffset * zoomFactor);
        }
        viewer._getTransformedPosition = _getTransformedPosition;
        function _getRotatedSize(size, rotateAngle) {
            if (rotateAngle === viewer._RotateAngle.NoRotate || rotateAngle === viewer._RotateAngle.Rotation180) {
                return size;
            }
            return {
                width: size.height,
                height: size.width
            };
        }
        viewer._getRotatedSize = _getRotatedSize;
        function _strEndsWith(str, value, ignoreCase) {
            if (ignoreCase === void 0) { ignoreCase = false; }
            return ignoreCase
                ? str.slice(-value.length).toLowerCase() === value.toLowerCase()
                : str.slice(-value.length) === value;
        }
        viewer._strEndsWith = _strEndsWith;
        function _isEqual(a, b) {
            if (a && b && wijmo.isFunction(a.valueOf) && wijmo.isFunction(b.valueOf)) {
                return a.valueOf() === b.valueOf();
            }
            return a === b;
        }
        viewer._isEqual = _isEqual;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ParametersEditor = /** @class */ (function (_super) {
            __extends(_ParametersEditor, _super);
            function _ParametersEditor(element) {
                var _this = _super.call(this, element) || this;
                _this._parameters = {};
                _this._errors = [];
                _this._errorsVisible = false;
                _this._savingParam = false;
                _this.commit = new wijmo.Event();
                _this.validate = new wijmo.Event();
                wijmo.addClass(_this.hostElement, 'wj-parameterscontainer');
                _this._updateErrorsVisible();
                return _this;
            }
            _ParametersEditor.prototype._setErrors = function (value) {
                this._errors = value;
                this._updateErrorDiv();
            };
            Object.defineProperty(_ParametersEditor.prototype, "parameters", {
                get: function () {
                    return this._parameters;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ParametersEditor.prototype, "itemsSource", {
                get: function () {
                    return this._itemSources;
                },
                set: function (value) {
                    this._itemSources = value;
                    this._parameters = {};
                    this._render();
                    var errors = [];
                    (value || []).forEach(function (v) {
                        if (v.error) {
                            errors.push({ key: v.name, value: v.error });
                        }
                    });
                    this._setErrors(errors);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ParametersEditor.prototype, "savingParam", {
                set: function (value) {
                    this._savingParam = value;
                },
                enumerable: true,
                configurable: true
            });
            _ParametersEditor.prototype._reset = function () {
                this._lastEditedParam = null;
            };
            _ParametersEditor.prototype._setErrorsVisible = function (value) {
                this._errorsVisible = value;
                this._updateErrorsVisible();
            };
            _ParametersEditor.prototype._updateErrorsVisible = function () {
                if (this._errorsVisible) {
                    wijmo.removeClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
                }
                else {
                    wijmo.addClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
                }
            };
            _ParametersEditor.prototype.onCommit = function () {
                this.commit.raise(this);
            };
            _ParametersEditor.prototype.onValidate = function () {
                this.validate.raise(this);
                this._setErrorsVisible(false);
            };
            _ParametersEditor.prototype._deferValidate = function (paramName, beforeValidate, afterValidate) {
                var _this = this;
                if (this._validateTimer != null) {
                    clearTimeout(this._validateTimer);
                    this._validateTimer = null;
                }
                this._savingParam = true;
                this._validateTimer = setTimeout(function () {
                    if (beforeValidate != null) {
                        beforeValidate();
                    }
                    _this.onValidate();
                    if (afterValidate != null) {
                        afterValidate();
                    }
                    _this._lastEditedParam = paramName;
                    _this._validateTimer = null;
                }, 500);
            };
            _ParametersEditor.prototype._updateErrorDiv = function () {
                var errorList = this._errors || [], errorDivList = this.hostElement.querySelectorAll('.error');
                for (var i = 0; i < errorDivList.length; i++) {
                    errorDivList[i].parentNode.removeChild(errorDivList[i]);
                }
                for (var i = 0; i < errorList.length; i++) {
                    var errorMessageDiv, element = this.hostElement.querySelector('*[' + _ParametersEditor._paramIdAttr + '="' + errorList[i].key + '"]'), message = errorList[i].value;
                    if (element) {
                        errorMessageDiv = document.createElement('div');
                        errorMessageDiv.innerHTML = message;
                        errorMessageDiv.className = 'error';
                        element.appendChild(errorMessageDiv);
                    }
                }
            };
            _ParametersEditor.prototype._render = function () {
                var _this = this;
                var lastEditor;
                // remove all editors except the last edited one.
                viewer._removeChildren(this.hostElement, function (e) {
                    if (!_this._lastEditedParam || (e.getAttribute(_ParametersEditor._paramIdAttr) !== _this._lastEditedParam)) {
                        return true;
                    }
                    lastEditor = e;
                });
                if (!this._itemSources) {
                    return;
                }
                this._itemSources.forEach(function (p) {
                    if (_this._lastEditedParam === p.name) {
                        _this._lastEditedParam = null;
                        lastEditor = null;
                        return; //continue;
                    }
                    if (!!p.hidden) {
                        return; // continue;
                    }
                    var parameterContainer = document.createElement('div'), parameterLabel = document.createElement('span'), parameterControl = null;
                    parameterContainer.className = 'wj-parametercontainer';
                    parameterLabel.className = 'wj-parameterhead';
                    parameterLabel.innerHTML = p.prompt || p.name;
                    if (wijmo.isArray(p.allowedValues)) {
                        parameterControl = _this._generateComboEditor(p);
                    }
                    else {
                        switch (p.dataType) {
                            case viewer._ParameterType.Boolean:
                                parameterControl = _this._generateBoolEditor(p);
                                break;
                            case viewer._ParameterType.DateTime:
                            case viewer._ParameterType.Time:
                            case viewer._ParameterType.Date:
                                parameterControl = _this._generateDateTimeEditor(p);
                                break;
                            case viewer._ParameterType.Integer:
                            case viewer._ParameterType.Float:
                                parameterControl = _this._generateNumberEditor(p);
                                break;
                            case viewer._ParameterType.String:
                                parameterControl = _this._generateStringEditor(p);
                                break;
                        }
                    }
                    if (parameterControl) {
                        parameterControl.className += ' wj-parametercontrol';
                        parameterContainer.setAttribute(_ParametersEditor._paramIdAttr, p.name);
                        parameterContainer.appendChild(parameterLabel);
                        parameterContainer.appendChild(parameterControl);
                        if (lastEditor) {
                            _this.hostElement.insertBefore(parameterContainer, lastEditor);
                        }
                        else {
                            _this.hostElement.appendChild(parameterContainer);
                        }
                    }
                });
                var applyBtn = document.createElement('input');
                applyBtn.type = 'button';
                applyBtn.value = wijmo.culture.Viewer.apply;
                applyBtn.className = 'wj-applybutton';
                var clickHandler = function () {
                    if (_this._savingParam) {
                        setTimeout(clickHandler, 100);
                    }
                    else {
                        if (_this._validateParameters()) {
                            _this._errors = [];
                            _this.onCommit();
                        }
                        _this._setErrorsVisible(true);
                    }
                };
                viewer._addEvent(applyBtn, 'click', clickHandler);
                this.hostElement.appendChild(applyBtn);
            };
            _ParametersEditor.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._reset();
                    this._render();
                }
            };
            _ParametersEditor.prototype._validateParameters = function () {
                var textareas = this.hostElement.querySelectorAll('textarea'), element, errorList = [], parameters = this.itemsSource;
                for (var i = 0; i < parameters.length; i++) {
                    var curParam = parameters[i];
                    element = this.hostElement.querySelector('[' + _ParametersEditor._paramIdAttr + '="' + curParam.name + '"]');
                    if ((curParam.value == null || curParam.value === "") &&
                        !curParam.nullable && !(curParam.dataType === viewer._ParameterType.String && curParam.allowBlank) &&
                        !this.parameters.hasOwnProperty(curParam.name) && !this.parameters[curParam.name]) {
                        if (element) {
                            errorList.push({ key: curParam.name, value: wijmo.culture.Viewer.nullParameterError });
                        }
                    }
                }
                //check input text's format.
                for (var i = 0; i < textareas.length; i++) {
                    var textarea = textareas.item(i), dataType, values = [], currentResult = true;
                    dataType = parseInt(textarea.getAttribute('data-type'));
                    switch (dataType) {
                        case viewer._ParameterType.Date:
                        case viewer._ParameterType.DateTime:
                        case viewer._ParameterType.Time:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isDate);
                            break;
                        case viewer._ParameterType.Float:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, _ParametersEditor._isFloat);
                            break;
                        case viewer._ParameterType.Integer:
                            currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isInt);
                            break;
                    }
                    if (!currentResult) {
                        errorList.push({ key: textarea.parentElement.id, value: wijmo.culture.Viewer.invalidParameterError });
                    }
                }
                this._setErrors(errorList);
                return errorList.length <= 0;
            };
            _ParametersEditor._isFloat = function (value) {
                return !isNaN(parseFloat(value));
            };
            _ParametersEditor._checkValueType = function (value, isSpecificType) {
                var values = value.split('\n');
                for (var i = 0; i < values.length; i++) {
                    if (values[i].trim().length <= 0 || isSpecificType(values[i].trim())) {
                        continue;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            };
            _ParametersEditor.prototype._generateComboEditor = function (parameter) {
                var _this = this;
                var combo, itemsSource = [], element = document.createElement('div'), multiSelect, values, checkedItems = [], isParameterResolved = (parameter.allowedValues && parameter.allowedValues.length > 0), isAllowedValue = isParameterResolved && (parameter.allowedValues.filter(function (val) { return viewer._isEqual(val.value, parameter.value); }).length > 0);
                if (parameter.multiValue) {
                    combo = new viewer._MultiSelectEx(element);
                }
                else {
                    combo = new wijmo.input.ComboBox(element);
                    if (parameter.nullable) {
                        itemsSource.push({ name: wijmo.culture.Viewer.parameterNoneItemsSelected, value: null });
                    }
                    else if (isParameterResolved && (parameter.value == null || !isAllowedValue)) {
                        itemsSource.push({ name: wijmo.culture.Viewer.selectParameterValue, value: null });
                    }
                }
                combo.isEditable = false;
                combo.displayMemberPath = 'name';
                combo.selectedValuePath = 'value';
                combo.isDisabled = !isParameterResolved;
                for (var i = 0; i < parameter.allowedValues.length; i++) {
                    itemsSource.push({ name: parameter.allowedValues[i].key, value: parameter.allowedValues[i].value });
                }
                combo.itemsSource = itemsSource;
                if (parameter.multiValue) {
                    multiSelect = combo;
                    if (!isParameterResolved) {
                        multiSelect.checkedItems = [];
                    }
                    else if (parameter.value) {
                        for (var i = 0; i < parameter.value.length; i++) {
                            for (var j = 0; j < multiSelect.itemsSource.length; j++) {
                                if (viewer._isEqual(multiSelect.itemsSource[j].value, parameter.value[i])) {
                                    checkedItems.push(multiSelect.itemsSource[j]);
                                    break;
                                }
                            }
                        }
                        multiSelect.checkedItems = checkedItems;
                    }
                    multiSelect.lostFocus.addHandler(function () {
                        var sameItems = (multiSelect.checkedItems.length === (parameter.value || []).length);
                        if (sameItems) {
                            for (var i_1 = 0; i_1 < multiSelect.checkedItems.length; i_1++) {
                                if (multiSelect.checkedItems[i_1].value !== parameter.value[i_1]) {
                                    sameItems = false;
                                }
                            }
                        }
                        if (sameItems) {
                            return;
                        }
                        _this._deferValidate(parameter.name, function () {
                            values = [];
                            for (var i = 0; i < multiSelect.checkedItems.length; i++) {
                                values.push(multiSelect.checkedItems[i]['value']);
                            }
                            _this._updateParameters(parameter, values);
                        }, function () {
                            if (values.length > 0 && !parameter.nullable) {
                                _this._validateNullValueOfParameter(element);
                            }
                        });
                    });
                }
                else {
                    if (!isParameterResolved || !isAllowedValue) {
                        combo.selectedValue = null;
                    }
                    else {
                        combo.selectedValue = parameter.value;
                    }
                    var updating = false;
                    // combo.lostFocus.addHandler((sender) => {
                    combo.selectedIndexChanged.addHandler(function (sender) {
                        if (parameter.value === sender.selectedValue) {
                            return;
                        }
                        _this._deferValidate(parameter.name, function () {
                            if (updating) {
                                return;
                            }
                            _this._updateParameters(parameter, sender.selectedValue);
                            if (sender.selectedValue && sender.itemsSource[0]['name'] === wijmo.culture.Viewer.selectParameterValue) {
                                setTimeout(function () {
                                    updating = true;
                                    var value = sender.selectedValue;
                                    var index = sender.selectedIndex;
                                    sender.itemsSource.shift();
                                    sender.collectionView.refresh();
                                    sender.selectedValue = value;
                                    sender.selectedIndex = index - 1;
                                    updating = false;
                                });
                            }
                        }, function () { return _this._validateNullValueOfParameter(element); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._updateParameters = function (parameter, value) {
                var spliteNewLine = function (value, multiValues) {
                    if (multiValues && wijmo.isString(value)) {
                        return value.split(/[\r\n]+/);
                    }
                    else {
                        return value;
                    }
                }, item;
                this.itemsSource.some(function (v) {
                    if (v.name === parameter.name) {
                        item = v;
                        return true;
                    }
                    return false;
                });
                this._parameters[parameter.name] = item.value = parameter.value = spliteNewLine(value, parameter.multiValue);
            };
            _ParametersEditor.prototype._generateBoolEditor = function (parameter) {
                var _this = this;
                var checkEditor, itemsSource = [], element;
                if (parameter.nullable) {
                    element = document.createElement('div');
                    checkEditor = new wijmo.input.ComboBox(element);
                    checkEditor.isEditable = false;
                    checkEditor.displayMemberPath = 'name';
                    checkEditor.selectedValuePath = 'value';
                    itemsSource.push({ name: 'None', value: null });
                    itemsSource.push({ name: 'True', value: true });
                    itemsSource.push({ name: 'False', value: false });
                    checkEditor.itemsSource = itemsSource;
                    checkEditor.selectedValue = parameter.value;
                    checkEditor.lostFocus.addHandler(function (sender) {
                        if (parameter.value === sender.selectedValue) {
                            return;
                        }
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, sender.selectedValue); });
                    });
                }
                else {
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    element.checked = parameter.value;
                    viewer._addEvent(element, 'click', function () {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, element.checked); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._generateStringEditor = function (parameter) {
                var self = this, element;
                if (parameter.multiValue) {
                    element = self._createTextarea(parameter.value, parameter.dataType);
                    if (parameter.maxLength > 0) {
                        element.maxLength = parameter.maxLength;
                    }
                }
                else {
                    element = document.createElement('input');
                    element.type = 'text';
                    if (parameter.value) {
                        element.value = parameter.value;
                    }
                    if (parameter.maxLength > 0) {
                        element.maxLength = parameter.maxLength;
                    }
                }
                self._bindTextChangedEvent(element, parameter, 'focusout');
                return element;
            };
            _ParametersEditor.prototype._createTextarea = function (value, dataType) {
                var textarea = document.createElement('textarea'), format, dates = [];
                if (dataType === viewer._ParameterType.DateTime || dataType === viewer._ParameterType.Time || dataType === viewer._ParameterType.Date) {
                    format = _ParametersEditor._dateTimeFormat;
                }
                if (value && value.length > 0) {
                    if (format) {
                        for (var i = 0; i < value.length; i++) {
                            dates.push(wijmo.Globalize.formatDate(new Date(value[i]), format));
                        }
                        textarea.value = dates.join('\n');
                    }
                    else {
                        textarea.value = value.join('\n');
                    }
                }
                textarea.wrap = 'off';
                textarea.setAttribute('data-type', dataType.toString());
                return textarea;
            };
            _ParametersEditor.prototype._bindTextChangedEvent = function (element, parameter, evType) {
                var _this = this;
                if (evType === void 0) { evType = 'change,keyup,paste,input'; }
                viewer._addEvent(element, evType, function (evnt) {
                    if (evnt.target && evnt.target.disabled) {
                        return; // #321642
                    }
                    var sameValues = false;
                    if (wijmo.isArray(parameter.value)) {
                        var elementValues = element.value.split('\n');
                        var diffStrings = 0;
                        for (var i = 0; i < elementValues.length; i++) {
                            if (parameter.value[i] != elementValues[i]) {
                                diffStrings = diffStrings + 1;
                            }
                        }
                        sameValues = diffStrings === 0;
                    }
                    if (parameter.value === element.value || sameValues) {
                        return;
                    }
                    _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, element.value); }, function () {
                        if (element.value && !parameter.nullable) {
                            _this._validateNullValueOfParameter(element);
                        }
                    });
                });
            };
            _ParametersEditor.prototype._generateNumberEditor = function (parameter) {
                var _this = this;
                var element, inputNumber;
                if (parameter.multiValue) {
                    element = this._createTextarea(parameter.value, parameter.dataType);
                    this._bindTextChangedEvent(element, parameter, 'focusout');
                }
                else {
                    element = document.createElement('div');
                    inputNumber = new wijmo.input.InputNumber(element);
                    inputNumber.format = parameter.dataType === viewer._ParameterType.Integer ? 'n0' : 'n2';
                    inputNumber.isRequired = !parameter.nullable;
                    if (parameter.value) {
                        inputNumber.value = parameter.dataType === viewer._ParameterType.Integer ? parseInt(parameter.value) : parseFloat(parameter.value);
                    }
                    inputNumber.lostFocus.addHandler(function () {
                        if (parameter.value === inputNumber.value) {
                            return;
                        }
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, inputNumber.value); });
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._generateDateTimeEditor = function (parameter) {
                var _this = this;
                var element, input;
                if (parameter.multiValue) {
                    element = this._createTextarea(parameter.value, parameter.dataType);
                    element.title = _ParametersEditor._dateTimeFormat;
                    this._bindTextChangedEvent(element, parameter, 'focusout');
                }
                else {
                    element = document.createElement('div');
                    if (parameter.dataType == viewer._ParameterType.Date) {
                        input = new wijmo.input.InputDate(element);
                    }
                    else {
                        if (parameter.dataType == viewer._ParameterType.DateTime) {
                            input = new wijmo.input.InputDateTime(element);
                            input.timeStep = 60;
                        }
                        else {
                            input = new wijmo.input.InputTime(element);
                            input.step = 60;
                        }
                    }
                    // #306344 To avoid the "Date expected" exception if parameter is not nullable and parameter.value is null.
                    input.isRequired = false;
                    if (parameter.value != null) {
                        input.value = new Date(parameter.value);
                    }
                    else {
                        input.value = null; // #299889 Display blank value instead of current date if parameter.value is null.
                    }
                    // #306344 Set input.isRequired only after input.value has been set.
                    input.isRequired = !parameter.nullable;
                    input.valueChanged.addHandler(function () {
                        _this._deferValidate(parameter.name, function () { return _this._updateParameters(parameter, input.value); }); // #353896 Conversion should be done in _DocumentService.setParameters.
                        //this._deferValidate(parameter.name, () => this._updateParameters(parameter, input.value && input.value.toJSON()));
                    });
                }
                return element;
            };
            _ParametersEditor.prototype._validateNullValueOfParameter = function (element) {
                var errors = this._errors;
                if (!errors || !errors.length) {
                    return;
                }
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].key !== element.parentElement.getAttribute(_ParametersEditor._paramIdAttr)) {
                        continue;
                    }
                    var errorDiv = element.parentElement.querySelector('.error');
                    if (!errorDiv) {
                        continue;
                    }
                    element.parentElement.removeChild(errorDiv);
                    errors.splice(i, 1);
                    break;
                }
            };
            _ParametersEditor._paramIdAttr = 'param-id';
            _ParametersEditor._errorsHiddenCss = 'wj-parametererrors-hidden';
            _ParametersEditor._dateTimeFormat = 'MM/dd/yyyy HH:mm';
            return _ParametersEditor;
        }(wijmo.Control));
        viewer._ParametersEditor = _ParametersEditor;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _TouchEventType;
        (function (_TouchEventType) {
            _TouchEventType[_TouchEventType["Start"] = 0] = "Start";
            _TouchEventType[_TouchEventType["Move"] = 1] = "Move";
            _TouchEventType[_TouchEventType["End"] = 2] = "End";
        })(_TouchEventType = viewer._TouchEventType || (viewer._TouchEventType = {}));
        var _TouchEventArgs = /** @class */ (function (_super) {
            __extends(_TouchEventArgs, _super);
            function _TouchEventArgs(systemEvent) {
                var _this = _super.call(this) || this;
                if (systemEvent instanceof _TouchEventArgs) {
                    _this._systemEvent = systemEvent.systemEvent;
                    _this._type = systemEvent.type;
                    _this._touchInfos = systemEvent.touchInfos;
                    return _this;
                }
                _this._systemEvent = systemEvent;
                viewer._TouchManager._registerTouchInfo(systemEvent);
                _this._type = viewer._TouchManager._isTouchStart(systemEvent.type) ? _TouchEventType.Start
                    : (viewer._TouchManager._isTouchEnd(systemEvent.type) ? _TouchEventType.End : _TouchEventType.Move);
                _this._touchInfos = viewer._TouchManager._allTouchInfos ? viewer._TouchManager._allTouchInfos.slice() : [];
                return _this;
            }
            Object.defineProperty(_TouchEventArgs.prototype, "timeStamp", {
                get: function () {
                    return this.systemEvent.timeStamp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "touchInfos", {
                get: function () {
                    return this._touchInfos;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "systemEvent", {
                get: function () {
                    return this._systemEvent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "target", {
                get: function () {
                    return this.systemEvent.target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "currentTarget", {
                get: function () {
                    return this.systemEvent.currentTarget;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "pointersCount", {
                get: function () {
                    return this.touchInfos.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchEventArgs.prototype, "cancelBubble", {
                get: function () {
                    return this._systemEvent.cancelBubble;
                },
                set: function (value) {
                    this._systemEvent.cancelBubble = value;
                },
                enumerable: true,
                configurable: true
            });
            _TouchEventArgs.prototype.preventDefault = function () {
                this._systemEvent.preventDefault();
            };
            return _TouchEventArgs;
        }(wijmo.EventArgs));
        viewer._TouchEventArgs = _TouchEventArgs;
        var _TouchEvent = /** @class */ (function (_super) {
            __extends(_TouchEvent, _super);
            function _TouchEvent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _TouchEvent.prototype.raise = function (sender, args) {
                _super.prototype.raise.call(this, sender, args);
            };
            return _TouchEvent;
        }(wijmo.Event));
        viewer._TouchEvent = _TouchEvent;
        var _TouchTrigger = /** @class */ (function () {
            function _TouchTrigger(source) {
                var _this = this;
                this.touchMove = new _TouchEvent();
                this.touchStart = new _TouchEvent();
                this.touchEnd = new _TouchEvent();
                var element = wijmo.getElement(source);
                this._element = element;
                var trigger = _TouchTrigger.getTrigger(element);
                if (trigger) {
                    var touchHandler = this._onTouchEvent.bind(this);
                    trigger.touchMove.addHandler(touchHandler);
                    trigger.touchStart.addHandler(touchHandler);
                    trigger.touchEnd.addHandler(touchHandler);
                    this._disposeAction = function () {
                        trigger.touchMove.removeHandler(touchHandler);
                        trigger.touchStart.removeHandler(touchHandler);
                        trigger.touchEnd.removeHandler(touchHandler);
                        _this._disposeAction = null;
                    };
                    return;
                }
                var touchEventsMap = viewer._getTouchEventMap(), sysTouchHandler = this._onSystemTouchEvent.bind(this);
                viewer._addEvent(element, touchEventsMap.startName, sysTouchHandler);
                viewer._addEvent(element, touchEventsMap.moveName, sysTouchHandler);
                viewer._addEvent(element, touchEventsMap.endName, sysTouchHandler);
                _TouchTrigger.bindElement(element, this);
                this._disposeAction = function () {
                    viewer._removeEvent(element, touchEventsMap.startName, sysTouchHandler);
                    viewer._removeEvent(element, touchEventsMap.moveName, sysTouchHandler);
                    viewer._removeEvent(element, touchEventsMap.endName, sysTouchHandler);
                    _TouchTrigger.unbindElement(element);
                    _this._disposeAction = null;
                };
            }
            _TouchTrigger.bindElement = function (element, trigger) {
                if (element[_TouchTrigger._elementDataName]) {
                    throw 'Cannot bind multi _TouchTrigger on the same element.';
                }
                element[_TouchTrigger._elementDataName] = trigger;
            };
            _TouchTrigger.unbindElement = function (element) {
                element[_TouchTrigger._elementDataName] = null;
            };
            _TouchTrigger.getTrigger = function (element) {
                return element[_TouchTrigger._elementDataName];
            };
            _TouchTrigger.prototype._onSystemTouchEvent = function (event) {
                var touchEventArgs = this._createTouchEventArgs(event);
                if (touchEventArgs) {
                    this._onTouchEvent(this, touchEventArgs);
                }
            };
            _TouchTrigger.prototype._createTouchEventArgs = function (e) {
                return viewer._TouchManager._isTouchEvent(e) ? new _TouchEventArgs(e) : null;
            };
            _TouchTrigger.prototype.dispose = function () {
                if (this._disposeAction)
                    this._disposeAction();
            };
            Object.defineProperty(_TouchTrigger.prototype, "hostElement", {
                get: function () {
                    return this._element;
                },
                enumerable: true,
                configurable: true
            });
            _TouchTrigger.prototype._onTouchEvent = function (sender, e) {
                switch (e.type) {
                    case _TouchEventType.Start:
                        this.onTouchStart(e);
                        return;
                    case _TouchEventType.Move:
                        this.onTouchMove(e);
                        return;
                    case _TouchEventType.End:
                        this.onTouchEnd(e);
                }
            };
            _TouchTrigger.prototype.onTouchEnd = function (event) {
                this.touchEnd.raise(this, event);
            };
            _TouchTrigger.prototype.onTouchStart = function (event) {
                this.touchStart.raise(this, event);
            };
            _TouchTrigger.prototype.onTouchMove = function (event) {
                this.touchMove.raise(this, event);
            };
            _TouchTrigger._elementDataName = '__wjTouchTrigger';
            return _TouchTrigger;
        }());
        viewer._TouchTrigger = _TouchTrigger;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _PinchEventArgs = /** @class */ (function (_super) {
            __extends(_PinchEventArgs, _super);
            function _PinchEventArgs(touchEventArgs, pinchType, pre) {
                var _this = _super.call(this, touchEventArgs) || this;
                _this._zoom = 1;
                _this._pinchType = pinchType;
                _this._pre = pre || {};
                if (_this.type == viewer._TouchEventType.End)
                    return _this;
                _this._pinchDistance = viewer._TouchInfo.getDistance(_this.touchInfos[0], _this.touchInfos[1]);
                _this._centerClient = viewer._TouchInfo.getCenterClient(_this.touchInfos[0], _this.touchInfos[1]);
                _this._centerScreen = viewer._TouchInfo.getCenterScreen(_this.touchInfos[0], _this.touchInfos[1]);
                if (_this.type == viewer._TouchEventType.Start)
                    return _this;
                _this._zoom = _this.pinchDistance / _this.prePinchDistance;
                _this._centerClientDelta = new wijmo.Point((_this.centerClient.x - _this.preCenterClient.x), (_this.centerClient.y - _this.preCenterClient.y));
                _this._centerScreenDelta = new wijmo.Point((_this.centerScreen.x - _this.preCenterScreen.x), (_this.centerScreen.y - _this.preCenterScreen.y));
                return _this;
            }
            Object.defineProperty(_PinchEventArgs.prototype, "zoom", {
                get: function () {
                    return this._zoom;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "pointersCount", {
                get: function () {
                    return this.type == viewer._TouchEventType.End ? 0 : 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "prePinchDistance", {
                get: function () {
                    return this._pre.pinchDistance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "pinchDistance", {
                get: function () {
                    return this._pinchDistance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "centerScreenDelta", {
                get: function () {
                    return this._centerScreenDelta;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "centerClientDelta", {
                get: function () {
                    return this._centerClientDelta;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "centerClient", {
                get: function () {
                    return this._centerClient;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "preCenterClient", {
                get: function () {
                    return this._pre.centerClient;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "centerScreen", {
                get: function () {
                    return this._centerScreen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "preCenterScreen", {
                get: function () {
                    return this._pre.centerScreen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PinchEventArgs.prototype, "type", {
                get: function () {
                    return this._pinchType;
                },
                enumerable: true,
                configurable: true
            });
            return _PinchEventArgs;
        }(viewer._TouchEventArgs));
        viewer._PinchEventArgs = _PinchEventArgs;
        var _PinchEvent = /** @class */ (function (_super) {
            __extends(_PinchEvent, _super);
            function _PinchEvent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _PinchEvent.prototype.raise = function (sender, args) {
                _super.prototype.raise.call(this, sender, args);
            };
            return _PinchEvent;
        }(viewer._TouchEvent));
        viewer._PinchEvent = _PinchEvent;
        var _PinchTrigger = /** @class */ (function (_super) {
            __extends(_PinchTrigger, _super);
            function _PinchTrigger() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.pinch = new _PinchEvent();
                return _this;
            }
            _PinchTrigger.prototype.onPinch = function (args) {
                this.pinch.raise(this, args);
            };
            _PinchTrigger.prototype.onTouchStart = function (args) {
                this._process(args);
            };
            _PinchTrigger.prototype.onTouchend = function (args) {
                this._process(args);
            };
            _PinchTrigger.prototype.onTouchMove = function (args) {
                this._process(args);
            };
            _PinchTrigger.prototype._onPinching = function (args) {
                var pinchArgs = new _PinchEventArgs(args, this._preEventArgs ? viewer._TouchEventType.Move : viewer._TouchEventType.Start, this._preEventArgs);
                this.onPinch(pinchArgs);
                this._preEventArgs = pinchArgs;
            };
            _PinchTrigger.prototype._onPinchEnd = function (args) {
                if (this._preEventArgs) {
                    var endArgs = new _PinchEventArgs(args, viewer._TouchEventType.End, this._preEventArgs);
                    this.onPinch(endArgs);
                    this._preEventArgs = null;
                }
            };
            _PinchTrigger.prototype._process = function (args) {
                if (args.pointersCount != 2) {
                    this._onPinchEnd(args);
                    return;
                }
                switch (args.type) {
                    case viewer._TouchEventType.Start:
                    case viewer._TouchEventType.Move:
                        this._onPinching(args);
                        return;
                    case viewer._TouchEventType.End:
                        this._onPinchEnd(args);
                        return;
                }
            };
            return _PinchTrigger;
        }(viewer._TouchTrigger));
        viewer._PinchTrigger = _PinchTrigger;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _PanEventArgs = /** @class */ (function (_super) {
            __extends(_PanEventArgs, _super);
            function _PanEventArgs(args, pre, type) {
                var _this = _super.call(this, args) || this;
                _this._panType = type == null ? args.type : type;
                _this._client = new wijmo.Point(_this.touchInfo.clientX, _this.touchInfo.clientY);
                _this._screen = new wijmo.Point(_this.touchInfo.screenX, _this.touchInfo.screenY);
                if (pre) {
                    _this._clientDelta = new wijmo.Point(_this.client.x - pre.client.x, _this.client.y - pre.client.y);
                    _this._screenDelta = new wijmo.Point(_this.screen.x - pre.screen.x, _this.screen.y - pre.screen.y);
                }
                return _this;
            }
            Object.defineProperty(_PanEventArgs.prototype, "type", {
                get: function () {
                    return this._panType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "clientDelta", {
                get: function () {
                    return this._clientDelta;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "screenDelta", {
                get: function () {
                    return this._screenDelta;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "client", {
                get: function () {
                    return this._client;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "screen", {
                get: function () {
                    return this._screen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "pointersCount", {
                get: function () {
                    return this.type == viewer._TouchEventType.End ? 0 : 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PanEventArgs.prototype, "touchInfo", {
                get: function () {
                    return this.touchInfos[0] || {};
                },
                enumerable: true,
                configurable: true
            });
            return _PanEventArgs;
        }(viewer._TouchEventArgs));
        viewer._PanEventArgs = _PanEventArgs;
        var _PanEvent = /** @class */ (function (_super) {
            __extends(_PanEvent, _super);
            function _PanEvent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _PanEvent.prototype.raise = function (sender, args) {
                _super.prototype.raise.call(this, sender, args);
            };
            return _PanEvent;
        }(viewer._TouchEvent));
        viewer._PanEvent = _PanEvent;
        var _PanTrigger = /** @class */ (function (_super) {
            __extends(_PanTrigger, _super);
            function _PanTrigger() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.panMove = new _PanEvent();
                _this.panStart = new _PanEvent();
                _this.panEnd = new _PanEvent();
                return _this;
            }
            _PanTrigger.prototype.onPanEnd = function (args) {
                this.panEnd.raise(this, args);
            };
            _PanTrigger.prototype.onPanStart = function (args) {
                this.panStart.raise(this, args);
            };
            _PanTrigger.prototype.onPanMove = function (args) {
                this.panMove.raise(this, args);
            };
            _PanTrigger.prototype._prepareMove = function (args) {
                var _this = this;
                this._prePanEventArgs = args;
                this._panEvents.queue(function () {
                    _this.onPanMove(args);
                });
            };
            _PanTrigger.prototype._prepareStart = function (args) {
                var _this = this;
                this._prePanEventArgs = args;
                this._panEvents.queue(function () {
                    _this.onPanStart(args);
                });
                this._clearPanStartTimer();
                this._panStartTimer = setTimeout(function () {
                    if (_this._panEvents)
                        _this._panEvents.start();
                    _this._clearPanStartTimer();
                }, _PanTrigger._threhold);
            };
            _PanTrigger.prototype._prepareEnd = function (args) {
                var _this = this;
                this._prePanEventArgs = null;
                this._panEvents.queue(function () {
                    var endArgs = args instanceof _PanEventArgs ? args : new _PanEventArgs(args, null, viewer._TouchEventType.End);
                    _this.onPanEnd(endArgs);
                    _this._stopPan();
                });
            };
            _PanTrigger.prototype._clearPanStartTimer = function () {
                if (this._panStartTimer != null) {
                    clearTimeout(this._panStartTimer);
                    this._panStartTimer = null;
                }
            };
            _PanTrigger.prototype._tryStopPan = function (args) {
                if (!this._panEvents || !this._panEvents.isStarted) {
                    this._stopPan();
                    return;
                }
                this._prepareEnd(args);
            };
            _PanTrigger.prototype._stopPan = function () {
                this._clearPanStartTimer();
                this._panEvents = null;
                this._prePanEventArgs = null;
            };
            _PanTrigger.prototype._processPan = function (args) {
                var panEventArgs = this._createPanEventArgs(args);
                if (!panEventArgs) {
                    this._tryStopPan(args);
                    return;
                }
                switch (panEventArgs.type) {
                    case viewer._TouchEventType.Start:
                        this._prepareStart(panEventArgs);
                        return;
                    case viewer._TouchEventType.Move:
                        this._prepareMove(panEventArgs);
                        return;
                    case viewer._TouchEventType.End:
                        this._prepareEnd(panEventArgs);
                        return;
                }
            };
            _PanTrigger.prototype.onTouchStart = function (args) {
                _super.prototype.onTouchStart.call(this, args);
                this._processPan(args);
            };
            _PanTrigger.prototype.onTouchMove = function (args) {
                _super.prototype.onTouchMove.call(this, args);
                this._processPan(args);
            };
            _PanTrigger.prototype.onTouchEnd = function (args) {
                _super.prototype.onTouchEnd.call(this, args);
                var panEventArgs = this._createPanEventArgs(args);
                if (panEventArgs) {
                    this._prepareEnd(panEventArgs);
                    return;
                }
                this._tryStopPan(args);
            };
            _PanTrigger.prototype._createPanEventArgs = function (args) {
                if ((args.type == viewer._TouchEventType.End && args.pointersCount != 0)
                    || (args.type != viewer._TouchEventType.End && args.pointersCount != 1)) {
                    return null;
                }
                var panEventArgs = new _PanEventArgs(args, this._prePanEventArgs);
                if (panEventArgs.type != viewer._TouchEventType.Start) {
                    if (!this._panEvents)
                        return null;
                }
                else {
                    this._panEvents = new viewer._ActionQueue();
                }
                return panEventArgs;
            };
            _PanTrigger._threhold = 10;
            return _PanTrigger;
        }(viewer._TouchTrigger));
        viewer._PanTrigger = _PanTrigger;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _SwipeEventArgs = /** @class */ (function (_super) {
            __extends(_SwipeEventArgs, _super);
            function _SwipeEventArgs(startInfo, endInfo, panEventArgs, duration) {
                var _this = _super.call(this, panEventArgs) || this;
                _this._duration = duration;
                _this._startTouchInfo = startInfo;
                _this._endTouchInfo = endInfo;
                var distance = viewer._pointMove(false, new wijmo.Point(_this.endTouchInfo.clientX, _this.endTouchInfo.clientY), new wijmo.Point(_this.startTouchInfo.clientX, _this.startTouchInfo.clientY));
                _this._speed = new wijmo.Point(_SwipeTrigger.getSpeed(distance.x, _this.duration), _SwipeTrigger.getSpeed(distance.y, _this.duration));
                _this._direction = viewer._TouchInfo._getDirection(_this.startTouchInfo, _this.endTouchInfo);
                return _this;
            }
            Object.defineProperty(_SwipeEventArgs.prototype, "duration", {
                get: function () {
                    return this._duration;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SwipeEventArgs.prototype, "startTouchInfo", {
                get: function () {
                    return this._startTouchInfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SwipeEventArgs.prototype, "endTouchInfo", {
                get: function () {
                    return this._endTouchInfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SwipeEventArgs.prototype, "speed", {
                get: function () {
                    return this._speed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SwipeEventArgs.prototype, "pointersCount", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SwipeEventArgs.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                enumerable: true,
                configurable: true
            });
            return _SwipeEventArgs;
        }(viewer._PanEventArgs));
        viewer._SwipeEventArgs = _SwipeEventArgs;
        var _SwipeEvent = /** @class */ (function (_super) {
            __extends(_SwipeEvent, _super);
            function _SwipeEvent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _SwipeEvent.prototype.raise = function (sender, args) {
                _super.prototype.raise.call(this, sender, args);
            };
            return _SwipeEvent;
        }(viewer._PanEvent));
        viewer._SwipeEvent = _SwipeEvent;
        var _SwipeTrigger = /** @class */ (function (_super) {
            __extends(_SwipeTrigger, _super);
            function _SwipeTrigger() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.swipe = new _SwipeEvent();
                return _this;
            }
            _SwipeTrigger.getSpeed = function (distance, duration) {
                return distance / duration;
            };
            _SwipeTrigger.prototype.onPanStart = function (args) {
                _super.prototype.onPanStart.call(this, args);
                this._panStartEventArgs = args;
            };
            _SwipeTrigger.prototype.onPanMove = function (args) {
                _super.prototype.onPanMove.call(this, args);
                this._prePanMoveEventArgs = args;
            };
            _SwipeTrigger.prototype.onPanEnd = function (args) {
                _super.prototype.onPanEnd.call(this, args);
                var swipeEventArgs = this._createSwipeEventArgs(args);
                if (swipeEventArgs) {
                    this.onSwipe(swipeEventArgs);
                }
                this._panStartEventArgs = null;
                this._prePanMoveEventArgs = null;
            };
            _SwipeTrigger.prototype.onSwipe = function (args) {
                this.swipe.raise(this, args);
            };
            _SwipeTrigger.prototype._createSwipeEventArgs = function (endArgs) {
                // Pan event doesn't fire when multi touches. So these fields may be null.
                if (!this._panStartEventArgs || !this._prePanMoveEventArgs) {
                    return null;
                }
                var duration = endArgs.timeStamp - this._panStartEventArgs.timeStamp;
                if (duration > _SwipeTrigger.maxDuration) {
                    return null;
                }
                var distance = viewer._TouchInfo.getDistance(this._panStartEventArgs.touchInfo, this._prePanMoveEventArgs.touchInfo);
                if (distance < _SwipeTrigger.minDistance) {
                    return null;
                }
                return new _SwipeEventArgs(this._panStartEventArgs.touchInfo, this._prePanMoveEventArgs.touchInfo, endArgs, duration);
            };
            _SwipeTrigger.minDistance = 50;
            _SwipeTrigger.maxDuration = 300;
            return _SwipeTrigger;
        }(viewer._PanTrigger));
        viewer._SwipeTrigger = _SwipeTrigger;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _TouchManager = /** @class */ (function () {
            function _TouchManager(element, removeDefaultTouch) {
                if (removeDefaultTouch === void 0) { removeDefaultTouch = true; }
                var _this = this;
                this.touchMove = new viewer._TouchEvent();
                this.touchStart = new viewer._TouchEvent();
                this.touchEnd = new viewer._TouchEvent();
                this.panMove = new viewer._PanEvent();
                this.panStart = new viewer._PanEvent();
                this.panEnd = new viewer._PanEvent();
                this.swipe = new viewer._SwipeEvent();
                this.pinch = new viewer._PinchEvent();
                this._trigger = new viewer._SwipeTrigger(element);
                this._trigger.touchStart.addHandler(function (s, e) { return _this.onTouchStart(e); });
                this._trigger.touchMove.addHandler(function (s, e) { return _this.onTouchMove(e); });
                this._trigger.touchEnd.addHandler(function (s, e) { return _this.onTouchEnd(e); });
                this._trigger.panStart.addHandler(function (s, e) { return _this.onPanStart(e); });
                this._trigger.panMove.addHandler(function (s, e) { return _this.onPanMove(e); });
                this._trigger.panEnd.addHandler(function (s, e) { return _this.onPanEnd(e); });
                this._trigger.swipe.addHandler(function (s, e) { return _this.onSwipe(e); });
                this._pinchTrigger = new viewer._PinchTrigger(element);
                this._pinchTrigger.pinch.addHandler(function (s, e) { return _this.onPinch(e); });
                this.removeDefaultTouch = removeDefaultTouch;
            }
            _TouchManager._isTouchEvent = function (event) {
                return event instanceof TouchEvent ||
                    (event.pointerType || '').toLowerCase() === _TouchManager._touchPointerName;
            };
            _TouchManager._isTouchStart = function (type) {
                return _TouchManager._eventTypeContains(type, viewer._getTouchEventMap().startName);
            };
            _TouchManager._isTouchEnd = function (type) {
                return _TouchManager._eventTypeContains(type, viewer._getTouchEventMap().endName);
            };
            _TouchManager._isTouchMove = function (type) {
                return _TouchManager._eventTypeContains(type, viewer._getTouchEventMap().moveName);
            };
            _TouchManager._eventTypeContains = function (current, definitions) {
                var defEvents = definitions.split(',');
                current = current.toLowerCase();
                for (var i = 0, length = defEvents.length; i < length; i++) {
                    var event = defEvents[i].trim().toLowerCase();
                    if (current.indexOf(event) > -1)
                        return true;
                }
                return false;
            };
            _TouchManager._registerTouchInfo = function (systemEvent) {
                if (!_TouchManager._isTouchEvent(systemEvent))
                    return;
                if (systemEvent instanceof TouchEvent) {
                    _TouchManager._allTouchInfos = [];
                    for (var i = 0, length = systemEvent.touches.length; i < length; i++) {
                        _TouchManager._allTouchInfos.push(new viewer._TouchInfo(systemEvent.touches.item(i)));
                    }
                    return;
                }
                if (systemEvent instanceof PointerEvent) {
                    _TouchManager._allTouchInfos = _TouchManager._allTouchInfos || [];
                    if (_TouchManager._isTouchEnd(systemEvent.type)) {
                        for (var index = 0, length = _TouchManager._allTouchInfos.length; index < length; index++) {
                            if (_TouchManager._allTouchInfos[index].id == systemEvent.pointerId) {
                                _TouchManager._allTouchInfos.splice(index, 1);
                                return;
                            }
                        }
                        return;
                    }
                    for (var index = 0, length = _TouchManager._allTouchInfos.length; index < length; index++) {
                        if (_TouchManager._allTouchInfos[index].id == systemEvent.pointerId) {
                            _TouchManager._allTouchInfos[index] = new viewer._TouchInfo(systemEvent);
                            return;
                        }
                    }
                    _TouchManager._allTouchInfos.push(new viewer._TouchInfo(systemEvent));
                }
            };
            _TouchManager.prototype.onPinch = function (event) {
                this.pinch.raise(this, event);
            };
            _TouchManager.prototype.onSwipe = function (event) {
                this.swipe.raise(this, event);
            };
            _TouchManager.prototype.onTouchEnd = function (event) {
                this.touchEnd.raise(this, event);
            };
            _TouchManager.prototype.onTouchStart = function (event) {
                this.touchStart.raise(this, event);
            };
            _TouchManager.prototype.onTouchMove = function (event) {
                this.touchMove.raise(this, event);
            };
            _TouchManager.prototype.onPanEnd = function (args) {
                this.panEnd.raise(this, args);
            };
            _TouchManager.prototype.onPanStart = function (args) {
                this.panStart.raise(this, args);
            };
            _TouchManager.prototype.onPanMove = function (args) {
                this.panMove.raise(this, args);
            };
            Object.defineProperty(_TouchManager.prototype, "removeDefaultTouch", {
                get: function () {
                    return this._removeDefaultTouch;
                },
                set: function (value) {
                    this._removeDefaultTouch = value;
                    var style = this.hostElement.style;
                    if (value) {
                        style.touchAction = 'none';
                        style.msTouchAction = 'none';
                    }
                    else {
                        style.touchAction = this._defaultTouchAction;
                        style.msTouchAction = this._defaultMsTouchAction;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchManager.prototype, "hostElement", {
                get: function () {
                    return this._pinchTrigger.hostElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TouchManager.prototype, "contentElement", {
                get: function () {
                    return this.hostElement.children.length ? this.hostElement.children[0] : null;
                },
                enumerable: true,
                configurable: true
            });
            _TouchManager.prototype.dispose = function () {
                if (this._pinchTrigger) {
                    this._pinchTrigger.dispose();
                }
                if (this._trigger) {
                    this._trigger.dispose();
                }
                if (this.removeDefaultTouch) {
                    this.removeDefaultTouch = false;
                }
            };
            _TouchManager._touchPointerName = 'touch';
            _TouchManager._allTouchInfos = [];
            return _TouchManager;
        }());
        viewer._TouchManager = _TouchManager;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // the virtual vertical scroller
        var _VScroller = /** @class */ (function (_super) {
            __extends(_VScroller, _super);
            function _VScroller(element) {
                var _this = _super.call(this, element) || this;
                _this._height = 100;
                _this._max = 100;
                // preserve the desired scroll top after setting scrollTop.
                _this._desiredValue = 0;
                _this.valueChanged = new wijmo.Event();
                var tpl;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate(null, tpl, {
                    _wrapper: 'wrapper'
                });
                // at least 1px client width, otherwise it works incorrectly in IE.
                _this.hostElement.style.width = viewer._Scroller.getScrollbarWidth() + 1 + 'px';
                viewer._addEvent(_this.hostElement, "scroll", function () {
                    _this.onValueChanged();
                });
                return _this;
            }
            _VScroller.prototype.onValueChanged = function () {
                // bypass the scroll event if the it is caused by setting scrollTop
                if (this._desiredValue == this.value) {
                    return;
                }
                this.valueChanged.raise(this);
            };
            // prevent the scroll event.
            _VScroller.prototype.preventScrollEvent = function () {
                this._desiredValue = this.hostElement.scrollTop;
            };
            Object.defineProperty(_VScroller.prototype, "height", {
                // the height of the scroller, in px.
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    if (value === this._height) {
                        return;
                    }
                    this._height = value;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_VScroller.prototype, "value", {
                // the scroll position of the scroller
                get: function () {
                    return this.hostElement.scrollTop;
                },
                set: function (value) {
                    this.hostElement.scrollTop = value;
                    this.preventScrollEvent();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_VScroller.prototype, "max", {
                // the max scroll position of the scroller.
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (this._max === value) {
                        return;
                    }
                    this._max = value;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            _VScroller.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                var hostHeight = this._height + 'px';
                if (this.hostElement.style.height !== hostHeight) {
                    this.hostElement.style.height = hostHeight;
                }
                // add host's client height to make sure the max scroll top represents the max value.
                var contentHeight = (this._max + this.hostElement.clientHeight) + 'px';
                if (this._wrapper.style.height !== contentHeight) {
                    this._wrapper.style.height = contentHeight;
                }
                this.preventScrollEvent();
            };
            _VScroller.controlTemplate = '<div class="wj-vscroller-wrapper" wj-part="wrapper"></div>';
            return _VScroller;
        }(viewer._Scroller));
        viewer._VScroller = _VScroller;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ExportOptionEditor = /** @class */ (function (_super) {
            __extends(_ExportOptionEditor, _super);
            function _ExportOptionEditor(element) {
                var _this = _super.call(this, element) || this;
                _this._options = {};
                _this._optionLabels = null;
                _this._groupTitleField = null;
                wijmo.addClass(element, 'wj-export-editor');
                return _this;
            }
            Object.defineProperty(_ExportOptionEditor.prototype, "options", {
                get: function () {
                    return this._options;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ExportOptionEditor.prototype, "exportDescription", {
                get: function () {
                    return this._exportDescription;
                },
                set: function (value) {
                    this._exportDescription = value;
                    this._options = {};
                    if (!value) {
                        return;
                    }
                    this._options['format'] = this.exportDescription.format;
                    this._render();
                },
                enumerable: true,
                configurable: true
            });
            _ExportOptionEditor.prototype._skipOption = function (name) {
                return _ExportOptionEditor._skippedOptions.indexOf(name) >= 0;
            };
            _ExportOptionEditor.prototype._render = function () {
                viewer._removeChildren(this.hostElement);
                if (!this.exportDescription) {
                    return;
                }
                var table = document.createElement('table'), optionDescs = this.exportDescription.optionDescriptions, groupOptions = {};
                if (optionDescs) {
                    for (var i = 0; i < optionDescs.length; i++) {
                        var optionDesc = optionDescs[i];
                        if (this._skipOption(optionDesc.name)) {
                            continue;
                        }
                        if (optionDesc.group) {
                            if (!groupOptions[optionDesc.group]) {
                                groupOptions[optionDesc.group] = [];
                            }
                            groupOptions[optionDesc.group].push(optionDesc);
                            continue;
                        }
                        if (!groupOptions[_ExportOptionEditor._generalGroupName]) {
                            groupOptions[_ExportOptionEditor._generalGroupName] = [];
                        }
                        optionDesc.group = _ExportOptionEditor._generalGroupName;
                        groupOptions[_ExportOptionEditor._generalGroupName].push(optionDesc);
                    }
                }
                for (var p in groupOptions) {
                    this.hostElement.appendChild(this._generateGroup(groupOptions[p]));
                }
                this._updateEditors();
            };
            _ExportOptionEditor.prototype._generateEditor = function (desc) {
                var editor;
                if (wijmo.isArray(desc.allowedValues)) {
                    editor = this._generateComboEditor(desc);
                }
                else {
                    switch (desc.type) {
                        case 'bool':
                            editor = this._generateBoolEditor(desc);
                            break;
                        case 'int':
                        case 'float':
                            editor = this._generateNumberEditor(desc);
                            break;
                        case 'unit':
                            desc.defaultValue = new viewer._Unit(desc.defaultValue);
                        case 'string':
                        default:
                            editor = this._generateStringEditor(desc);
                            break;
                    }
                }
                editor.setAttribute(_ExportOptionEditor._optionIdAttr, desc.name);
                return editor;
            };
            _ExportOptionEditor.prototype._generateComboEditor = function (desc) {
                var _this = this;
                var combo, itemsSource = [], element = document.createElement('div');
                for (var i = 0; i < desc.allowedValues.length; i++) {
                    itemsSource.push(desc.allowedValues[i]);
                }
                combo = new wijmo.input.ComboBox(element);
                combo.isEditable = false;
                combo.itemsSource = itemsSource;
                combo.selectedValue = desc.defaultValue;
                combo.selectedIndexChanged.addHandler(function (sender) {
                    _this._setOptionValue(desc.name, sender.selectedValue.toString());
                });
                return element;
            };
            _ExportOptionEditor.prototype._generateBoolEditor = function (desc) {
                var _this = this;
                var element;
                if (desc.nullable) {
                    element = document.createElement('div');
                    var checkEditor = new wijmo.input.ComboBox(element), itemsSource = [];
                    checkEditor.isEditable = false;
                    checkEditor.displayMemberPath = 'name';
                    checkEditor.selectedValuePath = 'value';
                    itemsSource.push({ name: 'None', value: null });
                    itemsSource.push({ name: 'True', value: true });
                    itemsSource.push({ name: 'False', value: false });
                    checkEditor.itemsSource = itemsSource;
                    checkEditor.selectedValue = desc.defaultValue;
                    var selectedHandler_1 = function (sender) {
                        _this._setOptionValue(desc.name, sender.selectedValue);
                        _this._updateEditors(desc.name);
                    };
                    checkEditor.selectedIndexChanged.addHandler(selectedHandler_1);
                    setTimeout(function () { return selectedHandler_1(checkEditor); }); // update dependent controls
                }
                else {
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    var defaultValue = wijmo.changeType(desc.defaultValue, wijmo.DataType.Boolean, null);
                    element.checked = defaultValue;
                    var clickHandler = function () {
                        _this._setOptionValue(desc.name, element.checked);
                        _this._updateEditors(desc.name);
                    };
                    viewer._addEvent(element, 'click', clickHandler);
                    setTimeout(clickHandler); // update dependent controls
                }
                return element;
            };
            _ExportOptionEditor.prototype._generateNumberEditor = function (desc) {
                var _this = this;
                var element, inputNumber, isIntType = desc.type === 'int';
                element = document.createElement('div');
                inputNumber = new wijmo.input.InputNumber(element);
                inputNumber.format = isIntType ? 'n0' : 'n2';
                inputNumber.isRequired = !desc.nullable;
                inputNumber.value = desc.defaultValue;
                inputNumber.valueChanged.addHandler(function (sender) {
                    _this._setOptionValue(desc.name, sender.value);
                });
                return element;
            };
            _ExportOptionEditor.prototype._generateStringEditor = function (desc) {
                var _this = this;
                var element;
                element = document.createElement('input');
                if (desc.name.match(/password/i)) {
                    element.type = 'password';
                }
                else {
                    element.type = 'text';
                }
                element.value = desc.defaultValue;
                viewer._addEvent(element, 'change,keyup,paste,input', function () {
                    _this._setOptionValue(desc.name, element.value);
                });
                return element;
            };
            _ExportOptionEditor.prototype._generateGroup = function (optionDescs) {
                var fieldSet = document.createElement('fieldset'), legend = document.createElement('legend'), groupName = optionDescs[0].group;
                wijmo.addClass(fieldSet, 'wj-exportformats-group');
                legend.innerHTML = this._groupTitle[groupName];
                legend.setAttribute(_ExportOptionEditor._optionNameAttr, groupName);
                fieldSet.appendChild(legend);
                var table = document.createElement('table');
                for (var i = 0; i < optionDescs.length; i++) {
                    var optionDesc = optionDescs[i];
                    var tr = document.createElement('tr'), tdTitle = document.createElement('td'), tdEditor = document.createElement('td');
                    tdTitle.innerHTML = this._getOptionLabel(optionDesc.name);
                    tdTitle.setAttribute(_ExportOptionEditor._optionNameAttr, optionDesc.name);
                    tdEditor.appendChild(this._generateEditor(optionDesc));
                    tr.appendChild(tdTitle);
                    tr.appendChild(tdEditor);
                    table.appendChild(tr);
                }
                fieldSet.appendChild(table);
                return fieldSet;
            };
            _ExportOptionEditor.prototype._updateEditors = function (optionName) {
                if (optionName === 'pdfACompatible' || !optionName) {
                    var embedFonts = this.hostElement.querySelector('[' + _ExportOptionEditor._optionIdAttr + '="embedFonts"]');
                    if (embedFonts) {
                        var pdfACompatibleValue = wijmo.changeType(this._getOptionValue('pdfACompatible'), wijmo.DataType.Boolean, null);
                        if (pdfACompatibleValue) {
                            this._previousEmbedFonts = embedFonts.checked;
                            embedFonts.checked = true;
                            this._setOptionValue('embedFonts', true);
                        }
                        else {
                            embedFonts.checked = this._previousEmbedFonts;
                            this._setOptionValue('embedFonts', this._previousEmbedFonts);
                        }
                        embedFonts.disabled = pdfACompatibleValue;
                    }
                    return;
                }
                if (optionName === 'paged' || !optionName) {
                    var showNavigator = this.hostElement.querySelector('[' + _ExportOptionEditor._optionIdAttr + '="showNavigator"]');
                    if (showNavigator) {
                        var paged = wijmo.changeType(this._getOptionValue('paged'), wijmo.DataType.Boolean, null);
                        if (!paged) {
                            this._previousShowNavigator = showNavigator.checked;
                            showNavigator.checked = false;
                            this._setOptionValue('showNavigator', false);
                        }
                        else {
                            showNavigator.checked = this._previousShowNavigator;
                            this._setOptionValue('showNavigator', this._previousShowNavigator);
                        }
                        showNavigator.disabled = !paged;
                    }
                }
            };
            _ExportOptionEditor.prototype._getOptionLabel = function (optionName) {
                var label = this._optionLabelsText[optionName];
                if (label) {
                    return label;
                }
                return optionName[0].toUpperCase() + optionName.substring(1);
            };
            _ExportOptionEditor.prototype._getOptionDescByName = function (optionName) {
                var item = null;
                this._exportDescription.optionDescriptions.some(function (v) {
                    if (v.name === optionName) {
                        item = v;
                        return true;
                    }
                    return false;
                });
                return item;
            };
            _ExportOptionEditor.prototype._getOptionValue = function (optionName) {
                if (this._options[optionName] !== undefined) {
                    return this._options[optionName];
                }
                return this._getOptionDescByName(optionName).defaultValue;
            };
            _ExportOptionEditor.prototype._setOptionValue = function (optionName, value) {
                var optionDesc = this._getOptionDescByName(optionName);
                var defaultValue = optionDesc.defaultValue;
                if (optionDesc.type === 'unit') {
                    defaultValue = optionDesc.defaultValue.toString();
                }
                if (value === defaultValue) {
                    if (this._options[optionName] !== undefined) {
                        delete this._options[optionName];
                    }
                    return;
                }
                this._options[optionName] = value;
            };
            Object.defineProperty(_ExportOptionEditor.prototype, "_optionLabelsText", {
                get: function () {
                    if (!this._optionLabels) {
                        var ci = wijmo.culture.Viewer;
                        this._optionLabels = {
                            title: ci.docInfoTitle,
                            author: ci.docInfoAuthor,
                            manager: ci.docInfoManager,
                            operator: ci.docInfoOperator,
                            company: ci.docInfoCompany,
                            subject: ci.docInfoSubject,
                            comment: ci.docInfoComment,
                            creator: ci.docInfoCreator,
                            producer: ci.docInfoProducer,
                            creationTime: ci.docInfoCreationTime,
                            revisionTime: ci.docInfoRevisionTime,
                            keywords: ci.docInfoKeywords,
                            embedFonts: ci.embedFonts,
                            pdfACompatible: ci.pdfACompatible,
                            useCompression: ci.useCompression,
                            useOutlines: ci.useOutlines,
                            allowCopyContent: ci.allowCopyContent,
                            allowEditAnnotations: ci.allowEditAnnotations,
                            allowEditContent: ci.allowEditContent,
                            allowPrint: ci.allowPrint,
                            ownerPassword: ci.ownerPassword,
                            userPassword: ci.userPassword,
                            encryptionType: ci.encryptionType,
                            paged: ci.paged,
                            showNavigator: ci.showNavigator,
                            navigatorPosition: ci.navigatorPosition,
                            singleFile: ci.singleFile,
                            tolerance: ci.tolerance,
                            pictureLayer: ci.pictureLayer,
                            metafileType: ci.metafileType,
                            monochrome: ci.monochrome,
                            resolution: ci.resolution,
                            outputRange: ci.outputRange,
                            outputRangeInverted: ci.outputRangeInverted
                        };
                    }
                    return this._optionLabels;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ExportOptionEditor.prototype, "_groupTitle", {
                get: function () {
                    if (!this._groupTitleField) {
                        this._groupTitleField = {
                            documentRestrictions: wijmo.culture.Viewer.documentRestrictionsGroup,
                            passwordSecurity: wijmo.culture.Viewer.passwordSecurityGroup,
                            outputRange: wijmo.culture.Viewer.outputRangeGroup,
                            documentInfo: wijmo.culture.Viewer.documentInfoGroup,
                            general: wijmo.culture.Viewer.generalGroup
                        };
                    }
                    return this._groupTitleField;
                },
                enumerable: true,
                configurable: true
            });
            _ExportOptionEditor.prototype._globalize = function () {
                var globalizeElements = this.hostElement.querySelectorAll('[' + _ExportOptionEditor._optionNameAttr + ']');
                for (var i = 0; i < globalizeElements.length; i++) {
                    var element = globalizeElements[i];
                    if (element instanceof HTMLLegendElement) {
                        element.innerHTML = this._groupTitle[element.getAttribute(_ExportOptionEditor._optionNameAttr)];
                        continue;
                    }
                    element.innerHTML = this._getOptionLabel(element.getAttribute(_ExportOptionEditor._optionNameAttr));
                }
            };
            _ExportOptionEditor.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._optionLabels = null;
                    this._groupTitleField = null;
                    this._globalize();
                }
            };
            _ExportOptionEditor._optionIdAttr = 'option-id';
            _ExportOptionEditor._optionNameAttr = 'option-name';
            _ExportOptionEditor._skippedOptions = ['shapesWord2007Compatible', 'sheetName', 'navigatorPositions'];
            _ExportOptionEditor._generalGroupName = 'general';
            return _ExportOptionEditor;
        }(wijmo.Control));
        viewer._ExportOptionEditor = _ExportOptionEditor;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Saves the Blob object as a file.
         * @param blob The Blob object to save.
         * @param fileName The name with which the file is saved.
        */
        function _saveBlob(blob, fileName) {
            if (!blob || !(blob instanceof Blob) || !fileName) {
                return;
            }
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, fileName);
            }
            else {
                var link = document.createElement('a'), click = function (element) {
                    var evnt = document.createEvent('MouseEvents');
                    evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    element.dispatchEvent(evnt);
                };
                if ("download" in link) {
                    var url = window.URL || window.webkitURL || window, objUrl = url.createObjectURL(blob);
                    link.href = objUrl;
                    link.target = "_blank"; // #315860 
                    link.download = fileName;
                    click(link);
                    link = null;
                    window.setTimeout(function () {
                        url.revokeObjectURL(objUrl);
                    }, 30000);
                }
                else {
                    var fr = new FileReader();
                    // Save a blob using data URI scheme
                    fr.onloadend = function (e) {
                        link.download = fileName;
                        link.href = fr.result;
                        click(link);
                        link = null;
                    };
                    fr.readAsDataURL(blob);
                }
            }
        }
        viewer._saveBlob = _saveBlob;
        // define the reviver for JSON.parse to transform results.
        function _statusJsonReviver(k, v) {
            if (wijmo.isString(v)) {
                if (viewer._strEndsWith(k, 'DateTime')) {
                    return new Date(v);
                }
                if (k === 'width' || k === 'height' || viewer._strEndsWith(k, 'Margin')) {
                    return new viewer._Unit(v);
                }
            }
            return v;
        }
        viewer._statusJsonReviver = _statusJsonReviver;
        function _pageSettingsJsonReviver(k, v) {
            if (wijmo.isString(v)) {
                if (k === 'width' || k === 'height' || viewer._strEndsWith(k, 'Margin')) {
                    return new viewer._Unit(v);
                }
            }
            return v;
        }
        viewer._pageSettingsJsonReviver = _pageSettingsJsonReviver;
        function _appendQueryString(url, queries) {
            queries = queries || {};
            var queryList = [];
            for (var k in queries) {
                queryList.push(k + '=' + queries[k]);
            }
            if (queryList.length) {
                var sep = url.indexOf('?') < 0 ? '?' : '&';
                url += sep + queryList.join('&');
            }
            return url;
        }
        viewer._appendQueryString = _appendQueryString;
        function _joinUrl() {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            var urlParts = [];
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                if (item) {
                    if (typeof item !== 'string') {
                        urlParts = urlParts.concat(_joinStringUrl(item));
                    }
                    else {
                        urlParts.push(_prepareStringUrl(item).join('/'));
                    }
                }
            }
            return urlParts.join('/');
        }
        viewer._joinUrl = _joinUrl;
        function _joinStringUrl(data) {
            if (data == null) {
                return null;
            }
            var urlParts = [];
            for (var i = 0, l = data.length; i < l; i++) {
                urlParts = urlParts.concat(_prepareStringUrl(data[i]));
            }
            return urlParts;
        }
        viewer._joinStringUrl = _joinStringUrl;
        function _prepareStringUrl(data) {
            var paramParts = data.split('/');
            if (paramParts.length > 0 && !paramParts[paramParts.length - 1].length) {
                paramParts.splice(paramParts.length - 1);
            }
            return paramParts;
        }
        viewer._prepareStringUrl = _prepareStringUrl;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        function _parseReportExecutionInfo(json) {
            return JSON.parse(json, viewer._statusJsonReviver);
        }
        viewer._parseReportExecutionInfo = _parseReportExecutionInfo;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        function _httpRequest(url, handler, settings) {
            if (!settings || !settings.cache) {
                url = viewer._disableCache(url);
            }
            if (settings) {
                var method = (settings.method || 'GET').toUpperCase();
                if (method !== 'GET') {
                    if (settings.data && (settings.urlEncode !== false)) {
                        var dataStr = _objToParams(settings.data); // url encoding
                        if (dataStr != null) {
                            settings.data = dataStr;
                        }
                    }
                    if (settings.urlEncode !== false) {
                        if (!settings.requestHeaders) {
                            settings.requestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
                        }
                        else if (!settings.requestHeaders['Content-Type']) {
                            settings.requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
                        }
                    }
                }
            }
            if (handler && handler.requestHeaders) {
                settings = settings || {};
                settings.requestHeaders = settings.requestHeaders || {};
                Object.keys(handler.requestHeaders).forEach(function (v) {
                    settings.requestHeaders[v] = handler.requestHeaders[v];
                });
            }
            var args = new viewer.RequestEventArgs(url, settings);
            if (handler && handler.beforeSend) {
                handler.beforeSend(args);
            }
            return wijmo.httpRequest(args.url, args.settings);
        }
        viewer._httpRequest = _httpRequest;
        function _objToParams(obj) {
            var paramList = [];
            obj = obj || {};
            for (var key in obj) {
                if (obj[key] !== null && obj[key] !== undefined) {
                    if (wijmo.isArray(obj[key])) {
                        if (obj[key].length > 0) {
                            for (var i = 0; i < obj[key].length; i++) {
                                paramList.push(key + '=' + encodeURIComponent(obj[key][i]));
                            }
                        }
                        else {
                            paramList.push(key + '=');
                        }
                    }
                    else {
                        paramList.push(key + '=' + encodeURIComponent(obj[key]));
                    }
                }
            }
            return paramList.join('&');
        }
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _HistoryManager = /** @class */ (function () {
            function _HistoryManager() {
                this._items = [{}];
                this._position = 0;
                this.statusChanged = new wijmo.Event();
            }
            _HistoryManager.prototype._onStatusChanged = function () {
                this.statusChanged.raise(this);
            };
            Object.defineProperty(_HistoryManager.prototype, "current", {
                get: function () {
                    return this._items[this._position];
                },
                enumerable: true,
                configurable: true
            });
            _HistoryManager.prototype.clear = function () {
                this._items = [{}];
                this._position = 0;
                this._onStatusChanged();
            };
            _HistoryManager.prototype.add = function () {
                this._items.splice(++this._position);
                this._items.push({});
                this._onStatusChanged();
            };
            _HistoryManager.prototype.forward = function () {
                if (!this.canForward()) {
                    return null;
                }
                var item = this._items[++this._position];
                this._onStatusChanged();
                return item;
            };
            _HistoryManager.prototype.backward = function () {
                if (!this.canBackward()) {
                    return null;
                }
                var item = this._items[--this._position];
                this._onStatusChanged();
                return item;
            };
            _HistoryManager.prototype.canForward = function () {
                return this._position < this._items.length - 1;
            };
            _HistoryManager.prototype.canBackward = function () {
                return this._position > 0;
            };
            return _HistoryManager;
        }());
        viewer._HistoryManager = _HistoryManager;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ArActionKind;
        (function (_ArActionKind) {
            _ArActionKind["Hyperlink"] = "hyperlink";
            _ArActionKind["Bookmark"] = "bookmark";
            _ArActionKind["Drillthrough"] = "drillthrough";
            _ArActionKind["Sort"] = "sort";
            _ArActionKind["Toggle"] = "toggle";
        })(_ArActionKind = viewer._ArActionKind || (viewer._ArActionKind = {}));
        ;
        var _ArParameterType;
        (function (_ArParameterType) {
            _ArParameterType[_ArParameterType["String"] = 0] = "String";
            _ArParameterType[_ArParameterType["DateTime"] = 1] = "DateTime";
            _ArParameterType[_ArParameterType["Boolean"] = 2] = "Boolean";
            _ArParameterType[_ArParameterType["Integer"] = 3] = "Integer";
            _ArParameterType[_ArParameterType["Float"] = 4] = "Float";
        })(_ArParameterType = viewer._ArParameterType || (viewer._ArParameterType = {}));
        var _ArParameterState;
        (function (_ArParameterState) {
            _ArParameterState[_ArParameterState["OK"] = 0] = "OK";
            _ArParameterState[_ArParameterState["ExpectValue"] = 1] = "ExpectValue";
            _ArParameterState[_ArParameterState["HasOutstandingDependencies"] = 2] = "HasOutstandingDependencies";
            _ArParameterState[_ArParameterState["ValuesValidationFailed"] = 3] = "ValuesValidationFailed";
            _ArParameterState[_ArParameterState["DynamicValuesUnavailable"] = 4] = "DynamicValuesUnavailable";
        })(_ArParameterState = viewer._ArParameterState || (viewer._ArParameterState = {}));
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _DocumentService = /** @class */ (function () {
            function _DocumentService(options, httpHandler) {
                this._url = '';
                this._url = options.serviceUrl || '';
                this._documentPath = options.filePath;
                this._httpHandler = httpHandler;
            }
            Object.defineProperty(_DocumentService.prototype, "serviceUrl", {
                get: function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentService.prototype, "filePath", {
                get: function () {
                    return this._documentPath;
                },
                enumerable: true,
                configurable: true
            });
            _DocumentService.prototype.getStatus = function () {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with IPageSettings.
            _DocumentService.prototype.setPageSettings = function (pageSettings) {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _IDocumentPosition.
            _DocumentService.prototype.getBookmark = function (name) {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _IDocumentPosition.
            _DocumentService.prototype.executeCustomAction = function (action) {
                throw viewer._abstractMethodExceptionText;
            };
            _DocumentService.prototype.load = function (data) {
                throw viewer._abstractMethodExceptionText;
            };
            _DocumentService.prototype.dispose = function () {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _IOutlineNode[].
            _DocumentService.prototype.getOutlines = function () {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with XMLHttpRequest.
            _DocumentService.prototype.renderToFilter = function (options) {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _ISearchResultItem[].
            _DocumentService.prototype.search = function (searchOptions) {
                throw viewer._abstractMethodExceptionText;
            };
            _DocumentService.prototype.getRenderToFilterUrl = function (options) {
                throw viewer._abstractMethodExceptionText;
            };
            _DocumentService.prototype.getExportedUrl = function (options) {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _IExportDescription[].
            _DocumentService.prototype.getSupportedExportDescriptions = function () {
                throw viewer._abstractMethodExceptionText;
            };
            // Return an IPromise with _IDocumentFeatures.
            _DocumentService.prototype.getFeatures = function () {
                throw viewer._abstractMethodExceptionText;
            };
            _DocumentService.prototype.getPingTimeout = function () {
                return 100;
            };
            // Gets the document's file name without the extension.
            _DocumentService.prototype.getFileName = function () {
                var fileName = /([^\\/]+)$/.exec(this.filePath)[1], dot = fileName.lastIndexOf('.');
                return dot >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName;
            };
            // Downloads the data and converts it to a data url.
            _DocumentService.prototype.downloadDataUrl = function (url) {
                var promise = new viewer._Promise();
                this.downloadBlob(url).then(function (blob) {
                    var fr = new FileReader();
                    fr.onloadend = function (e) {
                        promise.resolve(fr.result);
                    };
                    fr.readAsDataURL(blob);
                });
                return promise;
            };
            _DocumentService.prototype.downloadBlob = function (url) {
                var promise = new viewer._Promise();
                this.httpRequest(url, {
                    beforeSend: function (xhr) {
                        xhr.responseType = 'blob';
                    }
                }).then(function (xhr) {
                    promise.resolve(xhr.response);
                });
                return promise;
            };
            _DocumentService.prototype.httpRequest = function (url, settings) {
                var _this = this;
                settings = settings || {};
                var promise = new viewer._Promise(), error = settings.error, success = settings.success;
                settings.error = function (xhr) {
                    if (wijmo.isFunction(error)) {
                        error.call(_this, xhr);
                    }
                    promise.reject(xhr);
                };
                settings.success = function (xhr) {
                    if (wijmo.isFunction(success)) {
                        success.call(_this, xhr);
                    }
                    promise.resolve(xhr);
                };
                viewer._httpRequest(url, this._httpHandler, settings);
                return promise;
            };
            return _DocumentService;
        }());
        viewer._DocumentService = _DocumentService;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ReportServiceBase = /** @class */ (function (_super) {
            __extends(_ReportServiceBase, _super);
            function _ReportServiceBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _ReportServiceBase.prototype.render = function () {
                throw viewer._abstractMethodExceptionText;
            };
            return _ReportServiceBase;
        }(viewer._DocumentService));
        viewer._ReportServiceBase = _ReportServiceBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ReportService = /** @class */ (function (_super) {
            __extends(_ReportService, _super);
            // Create a document service with options.
            function _ReportService(options, httpHandler) {
                var _this = _super.call(this, options, httpHandler) || this;
                _this._reportName = options.reportName;
                return _this;
            }
            Object.defineProperty(_ReportService.prototype, "isCleared", {
                get: function () {
                    return !this._instanceId && this._status == viewer._ExecutionStatus.cleared;
                },
                enumerable: true,
                configurable: true
            });
            // Gets the report names defined in the specified FlexReport definition file.
            // @param serviceUrl The root url of service.
            // @param reportUrl The report url of service.
            // @param httpHandler The HTTP request handler.
            // @return An {@link IPromise} object with a string array of report names.
            _ReportService.getReportNames = function (serviceUrl, reportFilePath, httpHandler) {
                return _ReportService.getReports(serviceUrl, reportFilePath, null, httpHandler).then(function (item) {
                    if (!item)
                        return null;
                    var names = [];
                    item.items.forEach(function (item) {
                        if (item.type === viewer.CatalogItemType.Report) {
                            names.push(item.name);
                        }
                    });
                    return names;
                });
            };
            // Gets the catalog items in the specific folder path.
            // @param serviceUrl The root url of service.
            // @param path The folder path.
            // @param data The request data sent to the report service.
            // @param httpHandler The HTTP request handler.
            // @return An {@link IPromise} object with an array of {@link ICatalogItem}.
            _ReportService.getReports = function (serviceUrl, path, data, httpHandler) {
                var promise = new viewer._Promise(), url = viewer._joinUrl(serviceUrl, path);
                viewer._httpRequest(url, httpHandler, {
                    data: data,
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    },
                    error: function (xhr) { return promise.reject(xhr); }
                });
                return promise;
            };
            Object.defineProperty(_ReportService.prototype, "reportName", {
                // Gets the report name.
                get: function () {
                    return this._reportName;
                },
                enumerable: true,
                configurable: true
            });
            _ReportService.prototype.getBookmark = function (name) {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._bookmarkAction, name)).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _ReportService.prototype.executeCustomAction = function (action) {
                var data = {};
                data[_ReportService._customActionParam] = action.data;
                return this.render(data);
            };
            _ReportService.prototype.getStatus = function () {
                var promise = new viewer._Promise();
                this.httpRequest(this._statusLocation).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText, viewer._statusJsonReviver));
                });
                return promise;
            };
            _ReportService.prototype.getDocumentStatus = function () {
                return this._getReportCache();
            };
            _ReportService.prototype._getReportCache = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl()).then(function (xhr) {
                    promise.resolve(viewer._parseReportExecutionInfo(xhr.responseText));
                });
                return promise;
            };
            _ReportService.prototype.getParameters = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._parametersAction)).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _ReportService.prototype._getUrlMainPart = function () {
                return viewer._joinUrl(this.serviceUrl, this.filePath, this.reportName);
            };
            _ReportService.prototype._getReportUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return viewer._joinUrl(this._getUrlMainPart(), _ReportService._reportCommand, params);
            };
            _ReportService.prototype._getReportInstancesUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return viewer._joinUrl(this._getUrlMainPart(), _ReportService._instancesCommand, this._instanceId, params);
            };
            _ReportService.prototype._checkReportController = function (promise) {
                if (this.serviceUrl != null && this.filePath) {
                    var isFlexReport = viewer._strEndsWith(this.filePath, '.flxr', true) || viewer._strEndsWith(this.filePath, '.xml', true);
                    if (!isFlexReport || this.reportName) {
                        return true;
                    }
                }
                if (promise) {
                    promise.reject(_ReportService._invalidReportControllerError);
                }
                return false;
            };
            _ReportService.prototype._checkReportInstanceController = function (promise) {
                if (this._checkReportController(promise) && this._instanceId) {
                    return true;
                }
                if (promise) {
                    promise.reject(_ReportService._invalidReportCacheControllerError);
                }
                return false;
            };
            _ReportService.prototype._getError = function (xhr) {
                var reason = xhr.responseText;
                try {
                    if (reason) {
                        reason = JSON.parse(reason);
                    }
                }
                finally {
                    return reason;
                }
            };
            _ReportService.prototype.render = function (data) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._renderAction), {
                    method: 'POST',
                    data: data
                }).then(function (xhr) {
                    var v = xhr.status === 202 ? { status: viewer._ExecutionStatus.rendering } : viewer._parseReportExecutionInfo(xhr.responseText);
                    _this._status = v.status;
                    promise.resolve(v);
                }, function (xhr) {
                    promise.reject(_this._getError(xhr));
                });
                return promise;
            };
            _ReportService.prototype.renderToFilter = function (options) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.getRenderToFilterUrl(options).then(function (url) {
                    _this.httpRequest(url, { cache: true }).then(function (xhr) {
                        promise.resolve(xhr);
                    }, function (xhr) {
                        promise.reject(_this._getError(xhr));
                    });
                });
                return promise;
            };
            _ReportService.prototype.load = function (data) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(), { method: 'POST', data: data }).then(function (xhr) {
                    var v = viewer._parseReportExecutionInfo(xhr.responseText);
                    _this._instanceId = v.id;
                    _this._status = viewer._ExecutionStatus.loaded;
                    _this._outlinesLocation = v.outlinesLocation;
                    _this._statusLocation = v.statusLocation;
                    _this._pageSettingsLocation = v.pageSettingsLocation;
                    _this._featuresLocation = v.featuresLocation;
                    _this._parametersLocation = v.parametersLocation;
                    promise.resolve(v);
                }, function (xhr) {
                    promise.reject(_this._getError(xhr));
                });
                return promise;
            };
            _ReportService.prototype.cancel = function () {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                if (this._status !== viewer._ExecutionStatus.rendering) {
                    promise.reject('Cannot execute cancel when the report is not rendering.');
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._cancelAction), { method: 'POST' }).then(function (xhr) {
                    var v = viewer._parseReportExecutionInfo(xhr.responseText);
                    _this._status = v.status.status;
                    promise.resolve(v);
                });
                return promise;
            };
            _ReportService.prototype.dispose = function () {
                var _this = this;
                var promise = new viewer._Promise();
                // The reason of not passing promise to _checkReportCacheController is:
                // do nothing When cacheId is not generated.
                if (!this._checkReportInstanceController()) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(), { method: 'DELETE' }).then(function (xhr) {
                    _this._status = viewer._ExecutionStatus.cleared;
                    _this._instanceId = '';
                    promise.resolve();
                });
                return promise;
            };
            _ReportService.prototype.getOutlines = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._outlinesAction)).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _ReportService.prototype.getRenderToFilterUrl = function (options) {
                var promise = new viewer._Promise(), url = null;
                if (this._checkReportInstanceController()) {
                    url = this._getReportInstancesUrl(_ReportService._exportAction);
                    url = viewer._disableCache(url);
                    url = viewer._appendQueryString(url, options);
                    promise.resolve(url);
                }
                promise.resolve(url);
                return promise;
            };
            _ReportService.prototype.getExportedUrl = function (options) {
                return this.getRenderToFilterUrl(options);
            };
            _ReportService.prototype.search = function (searchOptions) {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._searchAction), { data: searchOptions }).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _ReportService.prototype.setPageSettings = function (pageSettings) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                ;
                var url = this._getReportInstancesUrl(_ReportService._pageSettingsAction);
                this.httpRequest(url, { method: 'PUT', data: pageSettings })
                    .then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText, viewer._pageSettingsJsonReviver));
                }, function (xhr) {
                    promise.reject(_this._getError(xhr));
                });
                return promise;
            };
            _ReportService.prototype.setParameters = function (parameters) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                ;
                Object.keys(parameters).forEach(function (key) {
                    // #296927, convert null values to empty strings
                    if (parameters[key] === null) {
                        parameters[key] = "";
                    }
                    // #353896, convert date to a local date using server format (old version: parameters[key].toJSON())
                    if (parameters[key] instanceof Date) {
                        parameters[key] = wijmo.Globalize.formatDate(parameters[key], "yyyy/MM/dd HH:mm:ss");
                    }
                });
                var url = this._getReportInstancesUrl(_ReportService._parametersAction);
                this.httpRequest(url, { method: 'PATCH', data: parameters })
                    .then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                }, function (xhr) {
                    promise.reject(_this._getError(xhr));
                });
                return promise;
            };
            // Return an IPromise with _IExportDescription[].
            _ReportService.prototype.getSupportedExportDescriptions = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getReportInstancesUrl(_ReportService._supportedFormatsAction)).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            // Return an IPromise with _IDocumentFeatures.
            _ReportService.prototype.getFeatures = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportInstanceController(promise)) {
                    return promise;
                }
                this.httpRequest(this._featuresLocation).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _ReportService._reportCommand = '$report';
            _ReportService._instancesCommand = '$instances';
            _ReportService._customActionParam = 'actionString';
            _ReportService._renderAction = 'render';
            _ReportService._searchAction = 'search';
            _ReportService._cancelAction = 'stop';
            _ReportService._outlinesAction = 'outlines';
            _ReportService._exportAction = 'export';
            _ReportService._parametersAction = 'parameters';
            _ReportService._bookmarkAction = 'bookmarks';
            _ReportService._pageSettingsAction = 'pagesettings';
            _ReportService._supportedFormatsAction = 'supportedformats';
            _ReportService._invalidReportControllerError = 'Cannot call the service without service url, document path or report name.';
            _ReportService._invalidReportCacheControllerError = 'Cannot call the service when service url is not set or the report is not loaded.';
            return _ReportService;
        }(viewer._ReportServiceBase));
        viewer._ReportService = _ReportService;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Defines an abstract document source class.
        var _DocumentSource = /** @class */ (function () {
            // Creates the document source.
            // @param options The document options and service information.
            function _DocumentSource(options, httpHandler) {
                this._hasOutlines = false;
                this._pageCount = 0;
                this._supportedExportDescriptions = [];
                this._isLoadCompleted = false;
                this._isInstanceCreated = false;
                this._isDisposed = false;
                this._errors = [];
                // Occurs after the page count changes.
                this.pageCountChanged = new wijmo.Event();
                // Occurs after the document is disposed.
                this.disposed = new wijmo.Event();
                // Occurs when the pageSettings property value changes.
                this.pageSettingsChanged = new wijmo.Event();
                // Occurs when the document is starting to load.
                this.loading = new wijmo.Event();
                // Occurs when the document loading is completed.
                this.loadCompleted = new wijmo.Event();
                // Queries the request data sent to the service before loading the document.
                this.queryLoadingData = new wijmo.Event();
                this._httpHandler = httpHandler;
                this._service = this._createDocumentService(options);
                this._paginated = options.paginated;
            }
            // Raises the {@link queryLoadingData} event.
            // @param e {@link QueryLoadingDataEventArgs} that contains the event data.
            _DocumentSource.prototype.onQueryLoadingData = function (e) {
                this.queryLoadingData.raise(this, e);
            };
            _DocumentSource.prototype._updateIsLoadCompleted = function (value) {
                if (this._isLoadCompleted === value) {
                    return;
                }
                this._isLoadCompleted = value;
                if (value) {
                    this.onLoadCompleted();
                }
            };
            _DocumentSource.prototype._updateIsDisposed = function (value) {
                if (this._isDisposed === value) {
                    return;
                }
                this._isDisposed = value;
                this.onDisposed();
            };
            _DocumentSource.prototype._getIsDisposed = function () {
                return this._isDisposed;
            };
            _DocumentSource.prototype._checkHasOutlines = function (data) {
                return data.hasOutlines;
            };
            _DocumentSource.prototype._checkIsLoadCompleted = function (data) {
                return data.status === viewer._ExecutionStatus.completed
                    || data.status === viewer._ExecutionStatus.stopped
                    || data.status === viewer._ExecutionStatus.loaded;
            };
            Object.defineProperty(_DocumentSource.prototype, "encodeRequestParams", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "executionDateTime", {
                // The execution date time of the loading document.
                get: function () {
                    return this._executionDateTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "expiredDateTime", {
                // The expired date time of the cache.
                get: function () {
                    return this._expiredDateTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "errors", {
                // Gets the errors of this document.
                get: function () {
                    return this._errors;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "isLoadCompleted", {
                // Gets a boolean value indicates if this document loading is completed.
                get: function () {
                    return this._isLoadCompleted;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "isInstanceCreated", {
                // Gets a boolean value indicates if this document instance is created at server successfully.
                get: function () {
                    return this._isInstanceCreated;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "isDisposed", {
                // Gets a boolean value indicates if this document is disposed.
                get: function () {
                    return this._getIsDisposed();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "features", {
                // Gets the document features.
                get: function () {
                    return this._features;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "pageSettings", {
                // Gets the page settings.
                get: function () {
                    return this._pageSettings;
                },
                enumerable: true,
                configurable: true
            });
            // Raises the {@link pageSettingsChanged} event.
            // @param e The event arguments.
            _DocumentSource.prototype.onPageSettingsChanged = function (e) {
                this.pageSettingsChanged.raise(this, e || new wijmo.EventArgs());
            };
            // Raises the {@link loadCompleted} event.
            // @param e The event arguments.
            _DocumentSource.prototype.onLoadCompleted = function (e) {
                this.loadCompleted.raise(this, e || new wijmo.EventArgs());
            };
            // Raises the {@link loading} event.
            // @param e The event arguments.
            _DocumentSource.prototype.onLoading = function (e) {
                this.loading.raise(this, e || new wijmo.EventArgs());
            };
            // Raises the {@link disposed} event.
            // @param e The event arguments.
            _DocumentSource.prototype.onDisposed = function (e) {
                this.disposed.raise(this, e || new wijmo.EventArgs());
            };
            // Set the page settings.
            // @param pageSettings page settings for the document.
            // @return An {@link IPromise} object with {@link _IExecutionInfo}.
            _DocumentSource.prototype.setPageSettings = function (pageSettings) {
                var _this = this;
                return this._innerService.setPageSettings(pageSettings).then(function (data) { return _this._updatePageSettings(data); });
            };
            _DocumentSource.prototype._updatePageSettings = function (newValue) {
                this._pageSettings = newValue;
                this.onPageSettingsChanged();
            };
            Object.defineProperty(_DocumentSource.prototype, "_innerService", {
                get: function () {
                    return this._service;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "paginated", {
                // Gets a value indicating whether the content should be represented as a set of fixed sized pages.
                get: function () {
                    return this.pageSettings ? this.pageSettings.paginated : this._paginated;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "hasThumbnails", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "hasOutlines", {
                // Gets a boolean value indicates whether current document has outlines or not.
                get: function () {
                    return this._hasOutlines;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "pageCount", {
                // Gets the page count of the document.
                get: function () {
                    return this._pageCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "initialPosition", {
                // Gets the initial position to be shown after rendering.
                get: function () {
                    return this._initialPosition;
                },
                set: function (value) {
                    this._initialPosition = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "service", {
                // Gets the service information of the document source.
                get: function () {
                    return this._service;
                },
                enumerable: true,
                configurable: true
            });
            // Gets the array of {@link _IExportDescription} of current document source.
            // @return An {@link IPromise} object with an {@link _IExportDescription} array.
            _DocumentSource.prototype.getSupportedExportDescriptions = function () {
                return this._innerService.getSupportedExportDescriptions();
            };
            // Gets the bookmark by bookmark's name.
            // @param name Name of the bookmark to look for.
            // @return An {@link IPromise} object with {@link _IDocumentPosition}.
            _DocumentSource.prototype.getBookmark = function (name) {
                return this._innerService.getBookmark(name);
            };
            // Executes the custom action.
            // @param actionString The string represents the custom action.
            // @return An {@link IPromise} object with {@link _IDocumentStatus}.
            _DocumentSource.prototype.executeCustomAction = function (action) {
                return this._innerService.executeCustomAction(action);
            };
            // Gets an array of outline of current document source.
            // @return An {@link IPromise} object with an {@link _IOutlineNode} array.
            _DocumentSource.prototype.getOutlines = function () {
                return this._innerService.getOutlines();
            };
            // Gets the features of current document source.
            // @return An {@link IPromise} object with an {@link _IDocumentFeatures} array.
            _DocumentSource.prototype.getFeatures = function () {
                var _this = this;
                return this._innerService.getFeatures().then(function (v) { _this._features = v; });
            };
            // Disposes the current document source instance from service.
            // @return An {@link IPromise} object with information of document.
            _DocumentSource.prototype.dispose = function () {
                var _this = this;
                return this._innerService.dispose().then(function () { return _this._updateIsDisposed(true); });
            };
            // Loads the current document source from service.
            // @return An {@link IPromise} object with information of document.
            _DocumentSource.prototype.load = function () {
                var _this = this;
                this.onLoading();
                var data = {};
                if (this._paginated != null) {
                    data["pageSettings.paginated"] = this.paginated;
                }
                var e = new viewer.QueryLoadingDataEventArgs(data);
                this.onQueryLoadingData(e);
                return this._innerService.load(e.data).then(function (v) {
                    _this._updateExecutionInfo(v);
                    // TODO: check!!! - it is not needed for AR at least...
                    //this._updateIsLoadCompleted(true);
                });
            };
            _DocumentSource.prototype._updateExecutionInfo = function (data) {
                if (data == null) {
                    return;
                }
                this._executionDateTime = this._getExecutionDateTime(data);
                this._expiredDateTime = this._getExpiredDateTime(data);
                this._updatePageSettings(data.pageSettings);
                this._features = data.features;
                this._isInstanceCreated = (data.status != null) && (data.status.status !== viewer._ExecutionStatus.notFound) && (data.status.status !== viewer._ExecutionStatus.cleared);
                this._updateDocumentStatus(data.status);
            };
            _DocumentSource.prototype._updateDocumentStatus = function (data) {
                if (!data /*|| (data.status == _ExecutionStatus.notFound)*/) {
                    return;
                }
                this._errors = data.errorList;
                this._initialPosition = data.initialPosition;
                this._updatePageCount(this._getPageCount(data));
                this._expiredDateTime = this._getExpiredDateTime(data);
                this._hasOutlines = this._checkHasOutlines(data);
                this._updateIsLoadCompleted(this._checkIsLoadCompleted(data));
            };
            _DocumentSource.prototype._getExecutionDateTime = function (data) {
                return data.loadedDateTime;
            };
            _DocumentSource.prototype._getExpiredDateTime = function (data) {
                return data.expiredDateTime;
            };
            _DocumentSource.prototype._getPageCount = function (data) {
                return data.pageCount;
            };
            _DocumentSource.prototype._updatePageCount = function (value) {
                if (this._pageCount === value) {
                    return;
                }
                this._pageCount = value;
                this.onPageCountChanged();
            };
            // Gets the document status.
            _DocumentSource.prototype.getStatus = function () {
                var _this = this;
                return this._innerService.getStatus().then(function (v) { _this._updateDocumentStatus(v); });
            };
            _DocumentSource.prototype._createDocumentService = function (options) {
                throw _DocumentSource._abstractMethodException;
            };
            // Raises the {@link pageCountChanged} event.
            // @param e {@link EventArgs} that contains the event data.
            _DocumentSource.prototype.onPageCountChanged = function (e) {
                this.pageCountChanged.raise(this, e || new wijmo.EventArgs());
            };
            _DocumentSource.prototype.export = function (options) {
                var _this = this;
                this.getExportedUrl(options).then(function (url) {
                    _this._innerService.downloadBlob(url).then(function (blob) {
                        var ext = options.format;
                        if (ext.match('bmp|emf|gif|html|jpeg|jpg|png|tif|tiff') && blob.type === 'application/zip') {
                            ext = 'zip';
                        }
                        if (ext === 'zip' && blob.type === 'application/x-emf') { // compressed metafile, single page.
                            ext = 'emf';
                        }
                        viewer._saveBlob(blob, _this._innerService.getFileName() + "." + ext);
                    });
                });
            };
            // Prints the current document.
            // @param rotations Determines the rotation angle for every page in the document.
            _DocumentSource.prototype.print = function (rotations) {
                var _this = this;
                // NB: _ArReportSource overrides this method.
                if (wijmo.isMobile()) {
                    this.export({ format: 'pdf' });
                    return;
                }
                var doc = new wijmo.PrintDocument({
                    title: 'Document'
                });
                this.renderToFilter({ format: 'html' }).then(function (xhr) {
                    doc.append(xhr.responseText);
                    var udoc = doc._getDocument();
                    udoc.close();
                    window.setTimeout(function () {
                        _this._removeScript(doc);
                        _this._rotate(doc, rotations);
                        doc.print();
                    }, 100);
                });
            };
            Object.defineProperty(_DocumentSource.prototype, "httpHandler", {
                get: function () {
                    return this._httpHandler;
                },
                enumerable: true,
                configurable: true
            });
            _DocumentSource.prototype._removeScript = function (doc) {
                //remove script node which sometimes cause issue with Edge.
                var scripts = doc._getDocument().querySelectorAll('script');
                for (var i = 0; i < scripts.length; i++) {
                    var item = scripts.item(i);
                    item.parentElement.removeChild(item);
                }
            };
            _DocumentSource.prototype._rotate = function (doc, rotations) {
                if (!rotations || !rotations.length) {
                    return;
                }
                var svgs = doc._getDocument().querySelectorAll('svg');
                for (var i = 0; i < svgs.length; i++) {
                    var r = rotations[i];
                    if (!r) {
                        continue;
                    }
                    var svg = svgs[i], g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); // used for transformations
                    while (svg.hasChildNodes()) {
                        g.appendChild(svg.firstChild);
                    }
                    svg.appendChild(g);
                    var sz = { width: new viewer._Unit(svg.width.baseVal.value), height: new viewer._Unit(svg.height.baseVal.value) }, szr = viewer._getRotatedSize(sz, r), section = svg.parentNode;
                    section.style.width = szr.width.valueInPixel + 'px';
                    section.style.height = szr.height.valueInPixel + 'px';
                    svg.setAttribute('width', szr.width.valueInPixel.toString() + 'px');
                    svg.setAttribute('height', szr.height.valueInPixel.toString() + 'px');
                    viewer._transformSvg(svgs[i], sz.width.valueInPixel, sz.height.valueInPixel, 1, r);
                }
            };
            // Renders the document into an export filter object.
            // @param options Options of the export.
            // @return An {@link IPromise} object with XMLHttpRequest.
            _DocumentSource.prototype.renderToFilter = function (options) {
                return this._innerService.renderToFilter(options);
            };
            // Gets the file url of rendering the document into an export filter object.
            // @param options Options of the export.
            // @return The file url of rendering the document into an export filter object.
            _DocumentSource.prototype.getRenderToFilterUrl = function (options) {
                return this._innerService.getRenderToFilterUrl(options);
            };
            _DocumentSource.prototype.getExportedUrl = function (options, raiseEvent) {
                var _this = this;
                if (raiseEvent === void 0) { raiseEvent = false; }
                var promise = new viewer._Promise();
                this._innerService.getExportedUrl(options).then(function (url) {
                    var args = new viewer.RequestEventArgs(url, null);
                    if (raiseEvent) {
                        // Allow user to handle the received URL (add a security token, for example).
                        _this.httpHandler.beforeSend(args);
                    }
                    promise.resolve(args.url);
                });
                return promise;
            };
            // Gets an array of Search by search options.
            // @param text The text to match.
            // @param matchCase Whether to ignore case during the match.
            // @param wholeWord Whether to match the whole word, or just match the text.
            // @return An {@link IPromise} object with an {@link _ISearchResultItem} array.
            _DocumentSource.prototype.search = function (searchOptions) {
                return this._innerService.search(searchOptions);
            };
            _DocumentSource._abstractMethodException = 'It is an abstract method, please implement it.';
            return _DocumentSource;
        }());
        viewer._DocumentSource = _DocumentSource;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ReportSourceBase = /** @class */ (function (_super) {
            __extends(_ReportSourceBase, _super);
            function _ReportSourceBase(options, httpHandler) {
                var _this = _super.call(this, options, httpHandler) || this;
                _this._status = viewer._ExecutionStatus.notFound;
                // Occurs when the status property value changes.
                _this.statusChanged = new wijmo.Event();
                return _this;
            }
            Object.defineProperty(_ReportSourceBase.prototype, "autoRun", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ReportSourceBase.prototype, "hasParameters", {
                get: function () {
                    throw viewer._DocumentSource._abstractMethodException;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ReportSourceBase.prototype, "status", {
                get: function () {
                    return this._status;
                },
                set: function (value) {
                    if (value !== this._status) {
                        this._status = value;
                        this.onStatusChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            _ReportSourceBase.prototype.getParameters = function () {
                throw viewer._DocumentSource._abstractMethodException;
            };
            _ReportSourceBase.prototype.setParameters = function (parameters) {
                throw viewer._DocumentSource._abstractMethodException;
            };
            // Renders the report.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportStatus}.
            _ReportSourceBase.prototype.render = function () {
                var _this = this;
                return this._innerService.render().then(function (v) { return _this._updateDocumentStatus(v); });
            };
            // Executes the custom action.
            // @param actionString The string represents the custom aciton.
            // @return An {@link IPromise} object with {@link _IReportStatus}.
            _ReportSourceBase.prototype.executeCustomAction = function (action) {
                var _this = this;
                return this._innerService.executeCustomAction(action).then(function (v) { return _this._updateDocumentStatus(v); });
            };
            // Raises the {@link statusChanged} event.
            // @param e The event arguments.
            _ReportSourceBase.prototype.onStatusChanged = function (e) {
                this.statusChanged.raise(this, e);
            };
            Object.defineProperty(_ReportSourceBase.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            _ReportSourceBase.prototype._updateDocumentStatus = function (data) {
                if (data) {
                    this.status = data.status;
                }
                _super.prototype._updateDocumentStatus.call(this, data);
            };
            return _ReportSourceBase;
        }(viewer._DocumentSource));
        viewer._ReportSourceBase = _ReportSourceBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Defines a _Report class.
        var _Report = /** @class */ (function (_super) {
            __extends(_Report, _super);
            // Creates a _Report instance.
            // @param options The report service information.
            function _Report(options, httpHandler) {
                var _this = _super.call(this, options, httpHandler) || this;
                _this._hasParameters = false;
                return _this;
            }
            // Gets the report names defined in the specified FlexReport definition file.
            // @param serviceUrl The root url of service.
            // @param reportFilePath The report file path.
            // @param httpHandler The HTTP request handler.
            // @return An {@link wijmo.viewer.IPromise} object with a string array which contains the report names.
            _Report.getReportNames = function (serviceUrl, reportFilePath, httpHandler) {
                return viewer._ReportService.getReportNames(serviceUrl, reportFilePath, httpHandler);
            };
            // Gets the catalog items in the specific folder path.
            // @param serviceUrl The root url of service.
            // @param path The folder path.
            // @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
            // @param httpHandler The HTTP request handler.
            // @return An {@link IPromise} object with an array of {@link ICatalogItem}.
            _Report.getReports = function (serviceUrl, path, data, httpHandler) {
                if (wijmo.isBoolean(data)) {
                    data = { recursive: data };
                }
                return viewer._ReportService.getReports(serviceUrl, path, data, httpHandler);
            };
            Object.defineProperty(_Report.prototype, "reportName", {
                // Gets the report name.
                get: function () {
                    return this._innerService ? this._innerService.reportName : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Report.prototype, "hasParameters", {
                // Gets a boolean value, indicates whether current report has parameters.
                get: function () {
                    return this._hasParameters;
                },
                enumerable: true,
                configurable: true
            });
            // Loads the current document source from service.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
            _Report.prototype.load = function () {
                return _super.prototype.load.call(this);
            };
            // Stops rendering the current document source.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
            _Report.prototype.cancel = function () {
                var _this = this;
                return this._innerService.cancel().then(function (v) { return _this._updateDocumentStatus(v); });
            };
            // Removes the current document source from service.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
            _Report.prototype.dispose = function () {
                return _super.prototype.dispose.call(this);
            };
            // Sets the parameters.
            // @param parameters Parameters for the report.
            // @return An {@link wijmo.viewer.IPromise} object with an {@link _IParameter} array.
            _Report.prototype.setParameters = function (parameters) {
                var _this = this;
                return this._innerService.setParameters(parameters).then(function (v) { return void (_this._parameters = v); });
            };
            // Gets an array of parameter of current document source.
            // @return An {@link wijmo.viewer.IPromise} object with an {@link _IParameter} array.
            _Report.prototype.getParameters = function () {
                var _this = this;
                return this._innerService.getParameters().then(function (v) { return void (_this._parameters = v); });
            };
            _Report.prototype._getIsDisposed = function () {
                return _super.prototype._getIsDisposed.call(this) || this._innerService.isCleared;
            };
            _Report.prototype._updateExecutionInfo = function (data) {
                if (data == null || this.isDisposed) {
                    return;
                }
                this._hasParameters = !!data.hasParameters;
                _super.prototype._updateExecutionInfo.call(this, data);
            };
            _Report.prototype._checkIsLoadCompleted = function (data) {
                return data.status === viewer._ExecutionStatus.completed
                    || data.status === viewer._ExecutionStatus.stopped;
            };
            _Report.prototype._createDocumentService = function (options) {
                return new viewer._ReportService(options, this.httpHandler);
            };
            Object.defineProperty(_Report.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            return _Report;
        }(viewer._ReportSourceBase));
        viewer._Report = _Report;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Defines the _PdfDocumentSource class.
        var _PdfDocumentSource = /** @class */ (function (_super) {
            __extends(_PdfDocumentSource, _super);
            // Creates a _PdfDocumentSource instance.
            // @param options The pdf service information.
            function _PdfDocumentSource(options, httpHandler) {
                var _this = _super.call(this, options, httpHandler) || this;
                _this._status = viewer._ExecutionStatus.notFound;
                return _this;
            }
            Object.defineProperty(_PdfDocumentSource.prototype, "status", {
                // Gets the status of current pdf.
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PdfDocumentSource.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            _PdfDocumentSource.prototype._createDocumentService = function (options) {
                return new _PdfDocumentService(options, this.httpHandler);
            };
            // Loads the current pdf document source from service.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IDocumentStatus}.
            _PdfDocumentSource.prototype.load = function () {
                return _super.prototype.load.call(this);
            };
            _PdfDocumentSource.prototype._updateStatus = function (newValue) {
                if (this._status === newValue) {
                    return;
                }
                this._status = newValue;
            };
            // Gets the status of pdf in server.
            // @return An {@link wijmo.viewer.IPromise} object with {@link _IDocumentStatus}.
            _PdfDocumentSource.prototype.getStatus = function () {
                var _this = this;
                var e = new viewer.QueryLoadingDataEventArgs();
                this.onQueryLoadingData(e);
                return this._innerService.getStatus(e.data).then(function (v) { return _this._updateDocumentStatus(v); });
            };
            // Renders the pdf into an export filter object.
            // @param options Export options.
            // @return An {@link IPromise} object with XMLHttpRequest.
            _PdfDocumentSource.prototype.renderToFilter = function (options) {
                var e = new viewer.QueryLoadingDataEventArgs();
                this.onQueryLoadingData(e);
                return this._innerService.renderToFilter(options, e.data);
            };
            _PdfDocumentSource.prototype._updateDocumentStatus = function (data) {
                if (data == null) {
                    return;
                }
                this._updateStatus(data.status);
                _super.prototype._updateDocumentStatus.call(this, data);
            };
            return _PdfDocumentSource;
        }(viewer._DocumentSource));
        viewer._PdfDocumentSource = _PdfDocumentSource;
        var _PdfDocumentService = /** @class */ (function (_super) {
            __extends(_PdfDocumentService, _super);
            function _PdfDocumentService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _PdfDocumentService.prototype._getPdfUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return viewer._joinUrl(this.serviceUrl, this.filePath, _PdfDocumentService._pdfCommand, params);
            };
            _PdfDocumentService.prototype._getPdfStatus = function (data) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getPdfUrl(), { data: data }).then(function (xhr) {
                    var v = _parseExecutionInfo(xhr.responseText);
                    _this._status = viewer._ExecutionStatus.loaded;
                    _this._statusLocation = v.statusLocation;
                    _this._featuresLocation = v.featuresLocation;
                    promise.resolve(v);
                }, function (xhr) {
                    promise.reject(xhr.statusText);
                });
                return promise;
            };
            _PdfDocumentService.prototype._checkPdfController = function (promise) {
                if (this.serviceUrl != null && this.filePath) {
                    return true;
                }
                if (promise) {
                    promise.reject(_PdfDocumentService._invalidPdfControllerError);
                }
                return false;
            };
            //// Returns an IPromise object with _IExecutionInfo.
            _PdfDocumentService.prototype.dispose = function () {
                var promise = new viewer._Promise();
                promise.resolve();
                return promise;
            };
            // Returns an IPromise object with _IExecutionInfo.
            _PdfDocumentService.prototype.load = function (data) {
                return this._getPdfStatus(data);
            };
            _PdfDocumentService.prototype.getStatus = function (data) {
                var promise = new viewer._Promise();
                this.httpRequest(this._statusLocation, { data: data }).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _PdfDocumentService.prototype.renderToFilter = function (options, data) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                this.getRenderToFilterUrl(options).then(function (url) {
                    _this.httpRequest(url, { data: data, cache: true }).then(function (xhr) {
                        promise.resolve(xhr);
                    });
                });
                return promise;
            };
            _PdfDocumentService.prototype.getRenderToFilterUrl = function (options) {
                var promise = new viewer._Promise(), url = null;
                if (this._checkPdfController()) {
                    url = this._getPdfUrl(_PdfDocumentService._exportAction);
                    url = viewer._disableCache(url);
                    url = viewer._appendQueryString(url, options);
                }
                promise.resolve(url);
                return promise;
            };
            _PdfDocumentService.prototype.getExportedUrl = function (options) {
                return this.getRenderToFilterUrl(options);
            };
            // Returns an IPromise object with _IExportDescription[].
            _PdfDocumentService.prototype.getSupportedExportDescriptions = function () {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getPdfUrl(_PdfDocumentService._supportedFormatsAction)).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            // Return an IPromise with _IDocumentFeatures.
            _PdfDocumentService.prototype.getFeatures = function () {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                this.httpRequest(this._featuresLocation).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _PdfDocumentService.prototype.search = function (searchOptions) {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                this.httpRequest(this._getPdfUrl(_PdfDocumentService._searchAction), { data: searchOptions }).then(function (xhr) {
                    promise.resolve(JSON.parse(xhr.responseText));
                });
                return promise;
            };
            _PdfDocumentService._pdfCommand = '$pdf';
            _PdfDocumentService._exportAction = 'export';
            _PdfDocumentService._supportedFormatsAction = 'supportedformats';
            _PdfDocumentService._searchAction = 'search';
            _PdfDocumentService._invalidPdfControllerError = 'Cannot call the service when service url is not set or the pdf is not loaded.';
            return _PdfDocumentService;
        }(viewer._DocumentService));
        viewer._PdfDocumentService = _PdfDocumentService;
        function _parseExecutionInfo(json) {
            return JSON.parse(json, viewer._statusJsonReviver);
        }
        viewer._parseExecutionInfo = _parseExecutionInfo;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _SearchManager = /** @class */ (function () {
            function _SearchManager() {
                this._currentIndex = -1;
                this.currentChanged = new wijmo.Event();
                this.searchStarted = new wijmo.Event();
                this.searchCompleted = new wijmo.Event();
                this.resultsCleared = new wijmo.Event();
                this.textChanged = new wijmo.Event();
            }
            Object.defineProperty(_SearchManager.prototype, "current", {
                // current
                get: function () {
                    if (this._currentIndex < 0) {
                        return null;
                    }
                    return this._searchResult[this._currentIndex];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "currentIndex", {
                // currentIndex
                get: function () {
                    return this._currentIndex;
                },
                set: function (value) {
                    var _this = this;
                    if (value === this._currentIndex) {
                        return;
                    }
                    this._getSearchResults().then(function (v) {
                        _this._currentIndex = value;
                        _this._onCurrentChanged();
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "documentSource", {
                // documenSource
                get: function () {
                    return this._documentSource;
                },
                set: function (value) {
                    this._documentSource = value;
                    this.clear();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "matchCase", {
                // matchCase
                get: function () {
                    return this._matchCase;
                },
                set: function (value) {
                    if (this._matchCase === value) {
                        return;
                    }
                    this._matchCase = value;
                    this._clearResults();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "searchResult", {
                // searchResult
                get: function () {
                    return this._searchResult;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "text", {
                // text
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    if (this._text === value) {
                        return;
                    }
                    this._text = value;
                    this._onTextChanged();
                    this._clearResults();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SearchManager.prototype, "wholeWord", {
                // wholeWord
                get: function () {
                    return this._wholeWord;
                },
                set: function (value) {
                    if (this._wholeWord === value) {
                        return;
                    }
                    this._wholeWord = value;
                    this._clearResults();
                },
                enumerable: true,
                configurable: true
            });
            _SearchManager.prototype.clear = function () {
                this._matchCase = false;
                this._wholeWord = false;
                this._currentIndex = -1;
                this.text = null; // instead of "this._text = null" to rise events (TFS 434156)
            };
            _SearchManager.prototype.search = function (pre) {
                var _this = this;
                this._getSearchResults().then(function (v) {
                    var length = _this._searchResult.length;
                    if (pre) {
                        _this._currentIndex--;
                        if (_this._currentIndex < 0) {
                            _this._currentIndex = length - 1;
                        }
                    }
                    else {
                        _this._currentIndex++;
                        if (_this._currentIndex >= length) {
                            _this._currentIndex = 0;
                        }
                    }
                    _this._currentIndex = Math.max(Math.min(_this._currentIndex, length - 1), 0);
                    _this._onCurrentChanged();
                });
            };
            _SearchManager.prototype._clearResults = function () {
                this._currentIndex = -1;
                this._searchResult = null;
                this._onResultsCleared();
            };
            _SearchManager.prototype._getSearchResults = function () {
                var _this = this;
                var p = new viewer._Promise();
                if (this._searchResult) {
                    p.resolve(this._searchResult);
                    return p;
                }
                if (!this.documentSource) {
                    p.reject(wijmo.culture.Viewer.cannotSearch);
                    return p;
                }
                if (this._text == null || this._text.length === 0) {
                    return p;
                }
                this._onSearchStarted();
                return this.documentSource.search({
                    text: this.documentSource.encodeRequestParams
                        ? encodeURIComponent(this.text)
                        : this.text,
                    matchCase: this.matchCase,
                    wholeWord: this.wholeWord
                }).then(function (v) {
                    _this._searchResult = v;
                    _this._onSearchCompleted();
                });
            };
            _SearchManager.prototype._onCurrentChanged = function () {
                this.currentChanged.raise(this);
            };
            _SearchManager.prototype._onSearchStarted = function () {
                this.searchStarted.raise(this);
            };
            _SearchManager.prototype._onSearchCompleted = function () {
                this.searchCompleted.raise(this);
            };
            _SearchManager.prototype._onResultsCleared = function () {
                this.resultsCleared.raise(this);
            };
            _SearchManager.prototype._onTextChanged = function () {
                this.textChanged.raise(this);
            };
            return _SearchManager;
        }());
        viewer._SearchManager = _SearchManager;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _Page = /** @class */ (function () {
            function _Page(documentSource, index, size) {
                this._content = null;
                this._rotateAngle = viewer._RotateAngle.NoRotate;
                this._pendingContent = false;
                this.linkClicked = new wijmo.Event();
                this._documentSource = documentSource;
                this._index = index;
                this._size = size;
            }
            Object.defineProperty(_Page.prototype, "index", {
                get: function () {
                    return this._index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Page.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Page.prototype, "rotateAngle", {
                get: function () {
                    return this._rotateAngle;
                },
                set: function (value) {
                    this._rotateAngle = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Page.prototype, "content", {
                get: function () {
                    return this._content;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Page.prototype, "pendingContent", {
                get: function () {
                    return this._pendingContent;
                },
                enumerable: true,
                configurable: true
            });
            _Page.prototype.getContent = function () {
                var _this = this;
                var promise = this._contentPromise;
                if (promise && !promise.isFinished) {
                    return promise;
                }
                this._contentPromise = promise = new viewer._Promise();
                var documentSource = this._documentSource;
                if (!documentSource) {
                    promise.reject(wijmo.culture.Viewer.cannotRenderPageNoDoc);
                    return promise;
                }
                if (this._content) {
                    promise.resolve(this._content);
                    return promise;
                }
                this._pendingContent = true;
                documentSource.renderToFilter({
                    format: 'html',
                    paged: documentSource.paginated,
                    outputRange: (this.index + 1).toString()
                }).then(function (data) {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    var div = document.createElement('div');
                    div.innerHTML = _this._processSvgResponse(_this._addGlobalUniqueId(data.responseText));
                    var svg = div.querySelector('svg'), g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    while (svg.hasChildNodes()) {
                        g.appendChild(svg.firstChild);
                    }
                    svg.appendChild(g);
                    _this._size = {
                        width: new viewer._Unit(svg.width.baseVal.value),
                        height: new viewer._Unit(svg.height.baseVal.value)
                    };
                    _this._content = svg;
                    _this._processActionLinks(svg, function (element) {
                        viewer._addEvent(element, 'click', function () {
                            _this._onLinkClicked(new viewer._LinkClickedEventArgs(element));
                        });
                    });
                    _this._pendingContent = false;
                    promise.resolve(_this._content);
                }).catch(function () {
                    _this._pendingContent = false;
                });
                return promise;
            };
            _Page.prototype._processSvgResponse = function (svg) {
                return svg;
            };
            _Page.prototype._extractSize = function (content) {
                if (content) {
                    var svg = content.querySelector('svg');
                    if (svg) {
                        return { width: new viewer._Unit(svg.width.baseVal.value), height: new viewer._Unit(svg.height.baseVal.value) };
                    }
                }
                return null;
            };
            _Page.prototype._onLinkClicked = function (e) {
                this.linkClicked.raise(this, e);
            };
            _Page.prototype._processActionLinks = function (svg, actionElementFound) {
                var aList = svg.querySelectorAll('a');
                for (var i = 0; i < aList.length; i++) {
                    var a = aList.item(i);
                    var url = a.href ? a.href.baseVal : '';
                    if (url.indexOf('navigate') > 0) {
                        var result = _Page._bookmarkReg.exec(url);
                        if (result) {
                            if (result[1] && result[1].length > 0) {
                                a.href.baseVal = _Page._invalidHref;
                                a.setAttribute(_Page._bookmarkAttr, result[1]);
                                actionElementFound(a);
                            }
                            else {
                                // The bookmark is empty which will take no affect on clicking on it.
                                // Remove the xlink: href attribute to avoid hand cursor on mouse moving on it.
                                a.removeAttribute("xlink:href");
                            }
                        }
                    }
                    else if (_Page._customActionReg.test(url)) {
                        a.href.baseVal = _Page._invalidHref;
                        a.setAttribute(_Page._customActionAttr, url.substr(3));
                        actionElementFound(a);
                    }
                }
            };
            _Page.prototype._addGlobalUniqueId = function (svgHtml) {
                var uniqueId = new Date().getTime().toString();
                svgHtml = svgHtml.replace(_Page._idReg, '$1$2' + uniqueId + '$3$4');
                svgHtml = svgHtml.replace(_Page._idReferReg, '$1$2' + uniqueId + '$3$4');
                return svgHtml;
            };
            _Page._bookmarkReg = /javascript\:navigate\(['|"](.*)['|"]\)/;
            _Page._bookmarkAttr = 'bookmark';
            _Page._customActionReg = /^CA\:/;
            _Page._customActionAttr = 'customAction';
            _Page._idReg = /(\<[^\>]+)(id=['|"])(\w+)(['|"])/g;
            _Page._idReferReg = /(\<[^\>]+)(url\(#)(\w+)(\))/g;
            _Page._invalidHref = 'javascript:void(0)';
            return _Page;
        }());
        viewer._Page = _Page;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ArPage = /** @class */ (function (_super) {
            __extends(_ArPage, _super);
            function _ArPage() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            _ArPage.prototype._processSvgResponse = function (svg) {
                svg = _super.prototype._processSvgResponse.call(this, svg);
                var doc = new DOMParser().parseFromString(svg, 'text/xml'); //  Evaluate DOCTYPE entities (css)
                svg = new XMLSerializer().serializeToString(doc);
                return svg;
            };
            _ArPage.prototype._processActionLinks = function (svg, actionElementFound) {
                var elements = svg.querySelectorAll('rect[arsvg\\:data-action-type]');
                for (var i = 0; i < elements.length; i++) {
                    actionElementFound(elements[i]);
                }
            };
            return _ArPage;
        }(viewer._Page));
        viewer._ArPage = _ArPage;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _PageViewBase = /** @class */ (function (_super) {
            __extends(_PageViewBase, _super);
            function _PageViewBase(element) {
                var _this = _super.call(this, element) || this;
                _this._autoHeightCalculated = false;
                _this._startX = null;
                _this._startY = null;
                _this._panMode = false;
                _this._pageIndex = -1;
                _this._zoomFactor = 1.0;
                _this._zoomMode = viewer.ZoomMode.Custom;
                _this._zoomModeUpdating = false;
                _this._movingPromise = new viewer._Promise();
                _this.pageIndexChanged = new wijmo.Event();
                _this.zoomFactorChanged = new wijmo.Event();
                _this.zoomModeChanged = new wijmo.Event();
                _this.positionChanged = new wijmo.Event();
                _this.rotateAngleChanged = new wijmo.Event();
                _this.pageLoaded = new wijmo.Event();
                _this._zoomFactorChangeInitiated = false;
                _this._zoomModeChangeInitiated = false;
                var tpl;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate('wj-pageview', tpl, _this._getTemplateParts());
                _this._fBorderBoxMode = getComputedStyle(element).boxSizing === 'border-box';
                _this._init();
                return _this;
            }
            _PageViewBase.prototype._getTemplateParts = function () {
                return {
                    _pagesWrapper: 'pages-wrapper'
                };
            };
            _PageViewBase.prototype._getPagesContainer = function () {
                return this.hostElement;
            };
            _PageViewBase.prototype._init = function () {
                this._bindEvents();
            };
            _PageViewBase.prototype.dispose = function () {
                if (this._touchManager)
                    this._touchManager.dispose();
                _super.prototype.dispose.call(this);
            };
            _PageViewBase.prototype._bindTouchEvents = function (touchManager) {
                var _this = this;
                touchManager.touchStart.addHandler(function () {
                    _this.hostElement.focus();
                });
                touchManager.panMove.addHandler(function (sender, args) {
                    touchManager.hostElement.scrollTop -= args.clientDelta.y;
                    touchManager.hostElement.scrollLeft -= args.clientDelta.x;
                });
                touchManager.pinch.addHandler(this._zoomByPinch, this);
            };
            _PageViewBase.prototype._initTouchEvents = function () {
                var element = this._pagesWrapper.parentElement;
                var touchManager = new viewer._TouchManager(element);
                this._touchManager = touchManager;
                this._bindTouchEvents(touchManager);
            };
            Object.defineProperty(_PageViewBase.prototype, "_borderBoxMode", {
                get: function () {
                    return this._fBorderBoxMode;
                },
                enumerable: true,
                configurable: true
            });
            _PageViewBase.prototype._zoomByPinch = function (touchManager, args) {
                args.preventDefault();
                if (args.type != viewer._TouchEventType.Move)
                    return;
                var contentRect = wijmo.getElementRect(touchManager.contentElement), contentStyle = getComputedStyle(touchManager.contentElement), contentMarignTop = parseInt(contentStyle.marginTop), contentMarignLeft = parseInt(contentStyle.marginLeft), contentCenter = viewer._pointMove(false, args.preCenterClient, contentRect.left - contentMarignLeft, contentRect.top - contentMarignTop);
                this._zoom(touchManager.hostElement, args.zoom, contentCenter, args.centerClientDelta);
            };
            _PageViewBase.prototype._getFixedPosition = function (position) {
                return new wijmo.Point(_PageViewBase._pageMargin, _PageViewBase._pageMargin + this._getAbovePageCount(position.y) * _PageViewBase._pageMargin);
            };
            _PageViewBase.prototype._getAbovePageCount = function (top) {
                return 0;
            };
            _PageViewBase.prototype._zoom = function (container, value, center, delta) {
                //Pre hit postion on container
                var preContainerCenter = viewer._pointMove(false, center, container.scrollLeft, container.scrollTop), fixedPos = this._getFixedPosition(center);
                var lastZoomFactor = this.zoomFactor;
                this.zoomFactor = this.zoomFactor * value;
                var zoom = this.zoomFactor / lastZoomFactor;
                // current hit position on content
                var newCenter = new wijmo.Point((center.x - fixedPos.x) * zoom + fixedPos.x, (center.y - fixedPos.y) * zoom + fixedPos.y), containerCenter = viewer._pointMove(true, preContainerCenter, delta), position = viewer._pointMove(false, newCenter, containerCenter);
                container.scrollTop = Math.round(position.y);
                container.scrollLeft = Math.round(position.x);
            };
            Object.defineProperty(_PageViewBase.prototype, "pageIndex", {
                get: function () {
                    return this._pageIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "pages", {
                get: function () {
                    return this._pages;
                },
                set: function (value) {
                    this._pages = value;
                    this._reserveViewPage();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "scrollTop", {
                get: function () {
                    return this.hostElement.scrollTop;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "scrollLeft", {
                get: function () {
                    return this.hostElement.scrollLeft;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "zoomFactor", {
                get: function () {
                    return this._zoomFactor;
                },
                set: function (value) {
                    value = Math.round(Math.max(0.05, Math.min(10, value)) * 100) / 100; // prevent history doubling, TFS 416847
                    if (this._zoomFactor == value) {
                        return;
                    }
                    if (!this._zoomModeChangeInitiated) {
                        this._zoomFactorChangeInitiated = true;
                    }
                    var oldValue = this._zoomFactor;
                    var oldValueMode = this._zoomMode;
                    this._zoomFactor = value;
                    this._updatePageViewTransform();
                    if (!this._zoomModeUpdating) {
                        if (this._zoomFactor === Math.round(this._calcZoomToViewFactor() * 100) / 100) {
                            this.zoomMode = viewer.ZoomMode.WholePage;
                        }
                        else if (this._zoomFactor === Math.round(this._calcZoomToViewWidthFactor() * 100) / 100) {
                            this.zoomMode = viewer.ZoomMode.PageWidth;
                        }
                        else {
                            this.zoomMode = viewer.ZoomMode.Custom;
                        }
                    }
                    if (this._zoomFactorChangeInitiated) {
                        this._onZoomFactorChanged(oldValue, this.zoomFactor);
                        if (oldValueMode !== this.zoomMode) {
                            this._onZoomModeChanged(oldValueMode, this.zoomMode);
                        }
                        this._zoomFactorChangeInitiated = false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "zoomMode", {
                get: function () {
                    return this._zoomMode;
                },
                set: function (value) {
                    if (this._zoomMode == value) {
                        return;
                    }
                    this._zoomModeUpdating = true;
                    if (!this._zoomFactorChangeInitiated) {
                        this._zoomModeChangeInitiated = true;
                    }
                    var oldValue = this._zoomMode;
                    var oldValueFactor = this._zoomFactor;
                    this._zoomMode = value;
                    this._calcZoomModeZoom(value);
                    this._zoomModeUpdating = false;
                    if (this._zoomModeChangeInitiated) {
                        this._onZoomModeChanged(oldValue, this.zoomMode);
                        if (oldValueFactor !== this.zoomFactor) {
                            this._onZoomFactorChanged(oldValueFactor, this.zoomFactor);
                        }
                        this._zoomModeChangeInitiated = false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PageViewBase.prototype, "panMode", {
                get: function () {
                    return this._panMode;
                },
                set: function (value) {
                    if (this._panMode == value) {
                        return;
                    }
                    this._panMode = value;
                },
                enumerable: true,
                configurable: true
            });
            _PageViewBase.prototype._bindEvents = function () {
                var _this = this;
                viewer._addEvent(document, 'mousemove', function (e) {
                    var isPanning = _this._startX !== null && _this._startY !== null;
                    if (isPanning) {
                        _this._panning(e);
                    }
                });
                viewer._addEvent(document, 'mouseup', function (e) {
                    _this._stopPanning();
                });
                this._initTouchEvents();
            };
            _PageViewBase.prototype._startPanning = function (e) {
                this._startX = e.screenX;
                this._startY = e.screenY;
            };
            _PageViewBase.prototype._panning = function (e) {
                var pagesContainer = this._getPagesContainer();
                pagesContainer.scrollLeft += this._startX - e.screenX;
                pagesContainer.scrollTop += this._startY - e.screenY;
                this._startX = e.screenX;
                this._startY = e.screenY;
            };
            _PageViewBase.prototype._stopPanning = function () {
                this._startX = null;
                this._startY = null;
            };
            _PageViewBase.prototype._onPageIndexChanged = function () {
                this.pageIndexChanged.raise(this);
            };
            _PageViewBase.prototype._onZoomFactorChanged = function (oldValue, newValue) {
                this.zoomFactorChanged.raise(this, { oldValue: oldValue, newValue: newValue });
            };
            _PageViewBase.prototype._onZoomModeChanged = function (oldValue, newValue) {
                this.zoomModeChanged.raise(this, { oldValue: oldValue, newValue: newValue });
            };
            _PageViewBase.prototype._onPositionChanged = function () {
                this.positionChanged.raise(this);
            };
            _PageViewBase.prototype._onRotateAngleChanged = function () {
                this.rotateAngleChanged.raise(this);
            };
            _PageViewBase.prototype._onPageLoaded = function (pageIndex, pageElement) {
                this.pageLoaded.raise(this, new viewer.PageLoadedEventArgs(pageIndex, pageElement));
            };
            _PageViewBase.prototype._renderViewPage = function (viewPage, pageIndex, isContinuous) {
                var _this = this;
                var loadingDiv, promise = new viewer._Promise();
                pageIndex = pageIndex < 0 ? 0 : pageIndex;
                this._targetRenderPageIndex = pageIndex;
                if (!viewPage) {
                    promise.reject(wijmo.culture.Viewer.cannotRenderPageNoViewPage);
                    return promise;
                }
                viewer._removeChildren(viewPage);
                if (this._pages[pageIndex].content) {
                    var svg = this._pages[pageIndex].content;
                    viewPage.appendChild(svg);
                    this._setPageTransform(viewPage, pageIndex);
                    promise.resolve(pageIndex);
                    return promise;
                }
                loadingDiv = document.createElement('div');
                loadingDiv.className = 'wj-loading';
                loadingDiv.style.height = viewPage.style.height;
                loadingDiv.style.lineHeight = viewPage.style.height;
                loadingDiv.innerHTML = wijmo.culture.Viewer.loading;
                viewPage.appendChild(loadingDiv);
                if (this._pages[pageIndex].pendingContent) {
                    promise.resolve(pageIndex);
                }
                else {
                    this._pages[pageIndex].getContent().then(function (content) {
                        if (!_this.pages) {
                            return;
                        }
                        // prevent overwriting of current page by loaded content (TFS 415797)
                        if (isContinuous || (_this._targetRenderPageIndex === pageIndex)) {
                            var svg = content;
                            viewer._removeChildren(viewPage);
                            viewPage.appendChild(svg);
                            _this._setPageTransform(viewPage, pageIndex);
                            _this._onPageLoaded(pageIndex, viewPage);
                        }
                        promise.resolve(pageIndex);
                    }).catch(function (reason) {
                        loadingDiv.innerHTML = viewer._getErrorMessage(reason);
                    });
                }
                return promise;
            };
            //Reserve blank view page for render.
            _PageViewBase.prototype._reserveViewPage = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._getViewPortHeight = function () {
                var style = this._pagesWrapper['currentStyle'] || window.getComputedStyle(this._pagesWrapper);
                return this.hostElement.offsetHeight - parseFloat(style.marginBottom) - parseFloat(style.marginTop);
            };
            _PageViewBase.prototype._getViewPortWidth = function () {
                var style = this._pagesWrapper['currentStyle'] || window.getComputedStyle(this._pagesWrapper);
                return this.hostElement.offsetWidth - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
            };
            _PageViewBase.prototype._setPageTransform = function (viewPage, pageIndex) {
                var g, svg;
                if (!viewPage || pageIndex < 0) {
                    return;
                }
                var size = this._getPageSize(pageIndex);
                var rotateAngle = this._pages[pageIndex].rotateAngle;
                viewPage.style.height = size.height.valueInPixel * this._zoomFactor + 'px';
                viewPage.style.width = size.width.valueInPixel * this._zoomFactor + 'px';
                g = viewPage.querySelector('g');
                if (g) {
                    g.parentNode.setAttribute('height', size.height.valueInPixel * this._zoomFactor + 'px');
                    g.parentNode.setAttribute('width', size.width.valueInPixel * this._zoomFactor + 'px');
                    viewer._transformSvg(g.parentNode, this._pages[pageIndex].size.width.valueInPixel, this._pages[pageIndex].size.height.valueInPixel, this._zoomFactor, rotateAngle);
                }
            };
            _PageViewBase.prototype._addViewPage = function () {
                var _this = this;
                var viewPage = document.createElement('div');
                viewPage.className = 'wj-view-page';
                viewer._addEvent(viewPage, 'mousedown', function (e) {
                    if (!_this._panMode) {
                        return;
                    }
                    _this._startPanning(e);
                });
                viewer._addEvent(viewPage, 'dragstart', function (e) {
                    if (!_this._panMode) {
                        return;
                    }
                    e.preventDefault();
                });
                this._pagesWrapper.appendChild(viewPage);
                return viewPage;
            };
            _PageViewBase.prototype._getPageSize = function (pageIndex) {
                if (pageIndex < 0 || pageIndex >= this._pages.length) {
                    return null;
                }
                var page = this._pages[pageIndex];
                return viewer._getRotatedSize(page.size, page.rotateAngle);
            };
            _PageViewBase.prototype._render = function (pageIndex) {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._moveToPagePosition = function (position) {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._updatePageViewTransform = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._updatePageIndex = function (index) {
                if (!this.pages) {
                    return;
                }
                index = this.resolvePageIndex(index);
                if (this._pageIndex === index) {
                    return;
                }
                this._pageIndex = index;
                this._onPageIndexChanged();
            };
            //Move to the top position of specified page.
            //If specified page is not rendered, this method will render page first.
            _PageViewBase.prototype.moveToPage = function (pageIndex) {
                return this.moveToPosition({
                    pageIndex: pageIndex
                });
            };
            _PageViewBase.prototype.resolvePageIndex = function (pageIndex) {
                return Math.min((this.pages || []).length - 1, Math.max(pageIndex, 0));
            };
            //Move to specified position {@link _IDocumentPosition}.
            //If specified page is not rendered, this method will render page first.
            _PageViewBase.prototype.moveToPosition = function (position) {
                var _this = this;
                if (!this._movingPromise.isFinished) {
                    this._movingPromise.cancel();
                }
                this._movingPromise = new viewer._Promise();
                var pageIndex = position.pageIndex || 0, curPageIndex = this.pageIndex;
                if (!this.pages || pageIndex < 0) {
                    this._movingPromise.resolve(pageIndex);
                    return this._movingPromise;
                }
                pageIndex = this.resolvePageIndex(pageIndex);
                position.pageIndex = pageIndex;
                if (pageIndex !== curPageIndex) {
                    this._updatePageIndex(pageIndex);
                    this._movingPromise = this._render(pageIndex);
                }
                else {
                    this._movingPromise.resolve(pageIndex);
                }
                return this._movingPromise
                    .then(function () {
                    if (_this.pages) {
                        position.samePage = pageIndex === curPageIndex;
                        _this._moveToPagePosition(position);
                    }
                })
                    .then(function (_) {
                    // The promise value is page number in single view mode,
                    // but may be array of page numbers in continuous view mode.
                    return pageIndex;
                }).then(function () {
                    _this._calcZoomModeZoom();
                    _this._onPositionChanged();
                });
            };
            _PageViewBase.prototype._calcZoomModeZoom = function (zoomMode) {
                this._zoomModeUpdating = true;
                zoomMode = zoomMode == null ? this.zoomMode : zoomMode;
                switch (zoomMode) {
                    case viewer.ZoomMode.PageWidth:
                        this._zoomToViewWidth();
                        break;
                    case viewer.ZoomMode.WholePage:
                        this._zoomToView();
                        break;
                }
                this._zoomModeUpdating = false;
            };
            _PageViewBase.prototype._zoomToView = function () {
                var pageSize = this._getPageSize(this.pageIndex);
                if (!pageSize) {
                    return;
                }
                this.zoomFactor = this._calcZoomToViewFactor();
            };
            _PageViewBase.prototype._calcZoomToViewFactor = function () {
                var viewHeight = this._getViewPortHeight();
                var viewWidth = this._getViewPortWidth();
                var pageSize = this._getPageSize(this.pageIndex);
                return Math.min(viewHeight / pageSize.height.valueInPixel, viewWidth / pageSize.width.valueInPixel);
            };
            _PageViewBase.prototype._zoomToViewWidth = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._calcZoomToViewWidthFactor = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._getTransformedPoint = function (pageIndex, top, left) {
                top /= this.zoomFactor;
                left /= this.zoomFactor;
                var currentPage = this.pages[pageIndex], size = currentPage.size, rotateAngle = currentPage.rotateAngle;
                switch (rotateAngle) {
                    case viewer._RotateAngle.Rotation90:
                        var tmpTop = top;
                        top = size.height.valueInPixel - left;
                        left = tmpTop;
                        break;
                    case viewer._RotateAngle.Rotation180:
                        top = size.height.valueInPixel - top;
                        left = size.width.valueInPixel - left;
                        break;
                    case viewer._RotateAngle.Rotation270:
                        var tmpTop = top;
                        top = left;
                        left = size.width.valueInPixel - tmpTop;
                        break;
                }
                return new wijmo.Point(left, top);
            };
            _PageViewBase.prototype._hitTestPagePosition = function (pnt) {
                if (!pnt || pnt.pageIndex < 0) {
                    return null;
                }
                var top = pnt.y, left = pnt.x, pageIndex = pnt.pageIndex;
                top -= _PageViewBase._pageMargin + _PageViewBase._pageBorderWidth;
                left -= _PageViewBase._pageMargin + _PageViewBase._pageBorderWidth;
                var transformedPoint = this._getTransformedPoint(pnt.pageIndex, top, left);
                top = transformedPoint.y;
                left = transformedPoint.x;
                var pageY = viewer._pixelToTwip(top), pageX = viewer._pixelToTwip(left), size = this.pages[pageIndex].size, hitWorkingArea = top >= 0 && top <= size.height.valueInPixel &&
                    left >= 0 && left <= size.width.valueInPixel;
                return {
                    pageIndex: pageIndex,
                    x: pageX,
                    y: pageY,
                    hitWorkingArea: hitWorkingArea // no margins
                };
            };
            _PageViewBase.prototype.rotatePageTo = function (pageIndex, rotateAngle) {
                var currentPage = this._pages[pageIndex];
                currentPage.rotateAngle = rotateAngle;
                this._updatePageViewTransform();
                this._onRotateAngleChanged();
            };
            _PageViewBase.prototype.hitTest = function (clientX, clientY) {
                if (this._pointInViewPanelClientArea(clientX, clientY)) {
                    var point = this._panelViewPntToPageView(clientX, clientY);
                    return this._hitTestPagePosition(point);
                }
                return null;
            };
            _PageViewBase.prototype.resetPages = function () {
                this._pageIndex = -1;
                this._pages = null;
                viewer._removeChildren(this._pagesWrapper);
                this._addViewPage();
                this.invalidate();
            };
            _PageViewBase.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                this._autoHeightCalculated = false;
                if (!this.pages || this.pages.length == 0 ||
                    this.pageIndex < 0 || this.pageIndex >= this.pages.length) {
                    return;
                }
                this._render(this.pageIndex);
                this._calcZoomModeZoom();
            };
            _PageViewBase.prototype.isPageContentLoaded = function (pageIndex) {
                var p = this.pages;
                return (!!p && (pageIndex >= 0) && (pageIndex < p.length) && !!p[pageIndex].content);
            };
            _PageViewBase.prototype._hitTestPageIndex = function (top) {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._pointInViewPanelClientArea = function (clientX, clientY) {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase.prototype._panelViewPntToPageView = function (clientX, clientY) {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _PageViewBase._pageMargin = 30;
            _PageViewBase._pageBorderWidth = 1;
            _PageViewBase.controlTemplate = '<div class="wj-pages-wrapper" wj-part="pages-wrapper"></div>';
            return _PageViewBase;
        }(wijmo.Control));
        viewer._PageViewBase = _PageViewBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ContinuousPageView = /** @class */ (function (_super) {
            __extends(_ContinuousPageView, _super);
            function _ContinuousPageView(element) {
                var _this = _super.call(this, element) || this;
                wijmo.addClass(element, "wj-pageview-continuous");
                return _this;
            }
            _ContinuousPageView.prototype._init = function () {
                var _this = this;
                _super.prototype._init.call(this);
                viewer._addEvent(this.hostElement, 'click', function (e) {
                    _this.hostElement.focus();
                });
                viewer._addEvent(this.hostElement, 'scroll', function () {
                    _this._onPositionChanged();
                    clearTimeout(_this._scrollingTimer);
                    _this._scrollingTimer = setTimeout(function () {
                        _this._ensurePageIndexPosition();
                    }, 200);
                });
                this.zoomFactorChanged.addHandler(function () {
                    clearTimeout(_this._zoomFactorTimer);
                    _this._zoomFactorTimer = setTimeout(function () {
                        // The current page can change after zooming (#261618)
                        _this._ensurePageIndexPosition();
                    }, 200);
                });
            };
            _ContinuousPageView.prototype.dispose = function () {
                clearTimeout(this._scrollingTimer);
                clearTimeout(this._zoomFactorTimer);
                if (this._disposeBodyStopSwipe) {
                    this._disposeBodyStopSwipe();
                }
                _super.prototype.dispose.call(this);
            };
            _ContinuousPageView.prototype._stopSwip = function () {
                if (this._swipeSpeedReducer) {
                    this._swipeSpeedReducer.stop();
                }
            };
            _ContinuousPageView.prototype._bindTouchEvents = function (touchManager) {
                var _this = this;
                _super.prototype._bindTouchEvents.call(this, touchManager);
                touchManager.touchStart.addHandler(this._stopSwip, this);
                touchManager.swipe.addHandler(function (sender, args) {
                    if (!_this._swipeSpeedReducer)
                        _this._swipeSpeedReducer = new viewer._SpeedReducer();
                    _this._swipeSpeedReducer.start(args.speed.x, args.speed.y, function (x, y) {
                        var oldLeft = touchManager.hostElement.scrollLeft, oldTop = touchManager.hostElement.scrollTop;
                        touchManager.hostElement.scrollLeft -= x;
                        touchManager.hostElement.scrollTop -= y;
                        if (oldLeft == touchManager.hostElement.scrollLeft
                            && oldTop == touchManager.hostElement.scrollTop) {
                            _this._stopSwip();
                        }
                    });
                });
                var bodyTouchManager = new viewer._TouchManager(document.body, false), stopSwip = this._stopSwip.bind(this);
                viewer._addEvent(document.body, 'mousedown', stopSwip, true);
                bodyTouchManager.touchStart.addHandler(stopSwip);
                this._disposeBodyStopSwipe = function () {
                    _this._stopSwip();
                    viewer._removeEvent(document.body, 'mousedown', stopSwip);
                    bodyTouchManager.touchStart.removeHandler(stopSwip);
                    bodyTouchManager.dispose();
                    _this._disposeBodyStopSwipe = null;
                };
            };
            _ContinuousPageView.prototype._getAbovePageCount = function (top) {
                return this._hitTestPageIndex(top);
            };
            _ContinuousPageView.prototype.refresh = function (fullUpdate) {
                this._stopSwip();
                _super.prototype.refresh.call(this, fullUpdate);
            };
            _ContinuousPageView.prototype._hitTestPageIndex = function (top) {
                if (!this.pages) {
                    return this.pageIndex;
                }
                var index = 0, pageEndPosition = 0;
                for (; index < this.pages.length; index++) {
                    pageEndPosition += this._getPageSize(index).height.valueInPixel * this.zoomFactor + viewer._PageViewBase._pageMargin;
                    if (top < pageEndPosition) {
                        if (pageEndPosition - top < 1) { // Guess that scrollTop value is always an integer (#261618)
                            continue;
                        }
                        break;
                    }
                }
                return Math.min(index, this.pages.length - 1);
            };
            _ContinuousPageView.prototype._guessPageIndex = function () {
                var result;
                // If the maximum scrollTop value is reached
                if (this.pages && (this.hostElement.scrollHeight - this.hostElement.clientHeight <= this.hostElement.scrollTop)) {
                    result = this.pages.length - 1;
                }
                else {
                    result = this._hitTestPageIndex(this.hostElement.scrollTop);
                }
                return result;
            };
            _ContinuousPageView.prototype._render = function (pageIndex) {
                var pageCount = this.pages.length, start = pageIndex - _ContinuousPageView._preFetchPageCount, end = pageIndex + _ContinuousPageView._preFetchPageCount, promises = [];
                start = start < 0 ? 0 : start;
                end = end > pageCount - 1 ? pageCount - 1 : end;
                for (var i = start; i <= end; i++) {
                    promises.push(this._renderViewPage(this._pagesWrapper.querySelectorAll('.wj-view-page').item(i), i, true));
                }
                return new viewer._CompositedPromise(promises);
            };
            _ContinuousPageView.prototype._moveToPagePosition = function (position) {
                this._stopSwip();
                var pageHeight, scrollTop = 0, scrollLeft = 0, moveToPage = !position.pageBounds, bound = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 }, margin = moveToPage ? 0 : viewer._PageViewBase._pageMargin, // if navigate to page then should scroll to the top of page container
                currentPage = this.pages[this.pageIndex];
                for (var index = 0; index < position.pageIndex; index++) {
                    pageHeight = this._getPageSize(index).height.valueInPixel * this.zoomFactor;
                    scrollTop += pageHeight + viewer._PageViewBase._pageMargin;
                    if (!this._borderBoxMode) {
                        scrollTop += viewer._PageViewBase._pageBorderWidth * 2;
                    }
                }
                var offsetPoint = viewer._getTransformedPosition(bound, currentPage.size, moveToPage
                    ? viewer._RotateAngle.NoRotate // The physical beginning of the page
                    : currentPage.rotateAngle, // Taking rotation into account will give us the logical beginning of the page.
                this.zoomFactor);
                scrollTop += offsetPoint.y + margin + 1; // +1 to fully hide previous page from viewport for correct current page defining
                scrollLeft += offsetPoint.x + margin;
                scrollLeft += this._getPageViewOffsetLeft(position.pageIndex); // The page view element can be shifted relative to _pagesWrapper if the pages have different orientations (widths).
                this.hostElement.scrollTop = scrollTop;
                this.hostElement.scrollLeft = scrollLeft;
            };
            _ContinuousPageView.prototype._pointInViewPanelClientArea = function (clientX, clientY) {
                return (clientX >= 0) &&
                    (clientY >= 0) &&
                    // ignore scroll bars
                    (clientX < this.hostElement.clientWidth) &&
                    (clientY < this.hostElement.clientHeight);
            };
            _ContinuousPageView.prototype._panelViewPntToPageView = function (clientX, clientY) {
                var top = this.hostElement.scrollTop + clientY, left = 0;
                if (this.hostElement.scrollLeft > 0) {
                    left = this.hostElement.scrollLeft + clientX;
                }
                else {
                    var containerRect = this.hostElement.getBoundingClientRect(), wrapperRect = this._pagesWrapper.getBoundingClientRect();
                    left = clientX - (wrapperRect.left - containerRect.left) + viewer._PageViewBase._pageMargin;
                }
                var hitPageIndex = this._hitTestPageIndex(top);
                if (hitPageIndex < 0) {
                    return null;
                }
                left -= this._getPageViewOffsetLeft(hitPageIndex); // The page view element can be shifted relative to _pagesWrapper if the pages have different orientations (widths)
                for (var index = 0; index < hitPageIndex; index++) {
                    top -= this._getPageSize(index).height.valueInPixel * this.zoomFactor
                        + viewer._PageViewBase._pageMargin;
                    if (!this._borderBoxMode) {
                        top -= viewer._PageViewBase._pageBorderWidth * 2;
                    }
                }
                return { x: left, y: top, pageIndex: hitPageIndex };
            };
            _ContinuousPageView.prototype._reserveViewPage = function () {
                viewer._removeChildren(this._pagesWrapper);
                for (var i = 0; i < (this.pages || []).length; i++) {
                    var viewPage = this._addViewPage(), size = this._getPageSize(i);
                    viewPage.style.height = size.height.valueInPixel * this.zoomFactor + 'px';
                    viewPage.style.width = size.width.valueInPixel * this.zoomFactor + 'px';
                }
            };
            _ContinuousPageView.prototype._updatePageViewTransform = function () {
                if (!this.pages || !this.pages.length) {
                    return;
                }
                var viewPages;
                viewPages = this._pagesWrapper.querySelectorAll('.wj-view-page');
                for (var i = 0; i < viewPages.length; i++) {
                    this._setPageTransform(viewPages.item(i), i);
                }
            };
            _ContinuousPageView.prototype._zoomToViewWidth = function () {
                if (!this.pages || this.pages.length == 0) {
                    return;
                }
                this.zoomFactor = this._calcZoomToViewWidthFactor();
            };
            _ContinuousPageView.prototype._calcZoomToViewWidthFactor = function () {
                var viewHeight = this._getViewPortHeight();
                var viewWidth = this._getViewPortWidth();
                var maxPageWidth = 0;
                var totalPageHeight = 0;
                for (var i = 0; i < this.pages.length; i++) {
                    var size = this._getPageSize(i);
                    if (size.width.valueInPixel > maxPageWidth) {
                        maxPageWidth = size.width.valueInPixel;
                    }
                    totalPageHeight += size.height.valueInPixel;
                }
                if (viewWidth / maxPageWidth > viewHeight / totalPageHeight) {
                    viewWidth -= viewer._Scroller.getScrollbarWidth();
                }
                return viewWidth / maxPageWidth;
            };
            _ContinuousPageView.prototype._ensurePageIndexPosition = function () {
                var currentPageIndex = this._guessPageIndex();
                if (this.pageIndex !== currentPageIndex) {
                    this._render(currentPageIndex);
                    this._updatePageIndex(currentPageIndex);
                }
            };
            _ContinuousPageView.prototype._getPageViewOffsetLeft = function (pageIndex) {
                var viewPage = this._pagesWrapper.querySelectorAll('.wj-view-page').item(pageIndex);
                if (viewPage) {
                    // The page view element can be shifted relative to _pagesWrapper if the pages have different widths.
                    return viewPage.offsetLeft - this._pagesWrapper.offsetLeft;
                }
                return 0;
            };
            _ContinuousPageView._preFetchPageCount = 3;
            return _ContinuousPageView;
        }(viewer._PageViewBase));
        viewer._ContinuousPageView = _ContinuousPageView;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _SinglePageView = /** @class */ (function (_super) {
            __extends(_SinglePageView, _super);
            function _SinglePageView(element) {
                var _this = _super.call(this, element) || this;
                _this._innerNavigating = false;
                _this._virtualScrollMode = true;
                wijmo.addClass(element, "wj-pageview-single");
                return _this;
            }
            // override
            _SinglePageView.prototype._init = function () {
                _super.prototype._init.call(this);
                this._initScroller();
                this._initEvents();
            };
            _SinglePageView.prototype._initScroller = function () {
                var _this = this;
                var scroller = new viewer._VScroller(this._vscroller);
                scroller.valueChanged.addHandler(function () {
                    // need handle the scroll on timeout, 
                    // seems cannot get the correct scrollTop for the last scrolling.
                    setTimeout(function () { return _this._doScrollerValueChanged(); });
                });
            };
            _SinglePageView.prototype._initEvents = function () {
                var _this = this;
                viewer._addEvent(this._pagesContainer, 'wheel', function (e) {
                    _this._doContainerWheel(e);
                });
                viewer._addEvent(this._pagesContainer, 'scroll', function (e) {
                    _this._doContainerScroll();
                });
                viewer._addEvent(this._pagesContainer, 'keydown', function (e) {
                    _this._doContainerKeyDown();
                });
                viewer._addEvent(this._pagesContainer, 'click', function (e) {
                    _this._pagesContainer.focus();
                });
            };
            _SinglePageView.prototype._bindTouchEvents = function (touchManager) {
                var _this = this;
                _super.prototype._bindTouchEvents.call(this, touchManager);
                touchManager.swipe.addHandler(function (sender, args) {
                    switch (args.direction) {
                        case viewer._TouchDirection.Down:
                            var preIndex = _this.resolvePageIndex(_this.pageIndex - 1);
                            if (preIndex != _this.pageIndex) {
                                _this.moveToPage(preIndex);
                            }
                            break;
                        case viewer._TouchDirection.Up:
                            var nextIndex = _this.resolvePageIndex(_this.pageIndex + 1);
                            if (nextIndex != _this.pageIndex) {
                                _this.moveToPage(nextIndex);
                            }
                            break;
                    }
                });
            };
            // override
            _SinglePageView.prototype._getTemplateParts = function () {
                return {
                    _pagesWrapper: 'pages-wrapper',
                    _pagesContainer: 'pages-container',
                    _vscroller: 'vscroller'
                };
            };
            _SinglePageView.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
                host.appendChild(viewer._toDOMs(tpl));
                // bind control variables to template parts
                if (parts) {
                    for (var part in parts) {
                        var wjPart = parts[part];
                        this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                        // look in the root as well (querySelector doesn't...)
                        if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                            this[part] = tpl;
                        }
                        // make sure we found the part
                        if (this[part] == null) {
                            throw 'Missing template part: "' + wjPart + '"';
                        }
                    }
                }
                return host;
            };
            Object.defineProperty(_SinglePageView.prototype, "virtualScrollMode", {
                // whether enable the virtual scroller.
                get: function () {
                    return this._virtualScrollMode;
                },
                set: function (value) {
                    if (this._virtualScrollMode === value) {
                        return;
                    }
                    this._virtualScrollMode = value;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SinglePageView.prototype, "_isScrollerVisible", {
                // whether the virtual scroller is visible.
                get: function () {
                    return this._virtualScrollMode && this.pages && this.pages.length > 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SinglePageView.prototype, "_scroller", {
                // the vertical virtual scroller
                get: function () {
                    return wijmo.Control.getControl(this._vscroller);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SinglePageView.prototype, "_hasPageVScrollBar", {
                get: function () {
                    return this._hasScrollbar(this._pagesContainer);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SinglePageView.prototype, "_hasPageHScrollBar", {
                get: function () {
                    return this._hasScrollbar(this._pagesContainer, true);
                },
                enumerable: true,
                configurable: true
            });
            // override 
            _SinglePageView.prototype._getPagesContainer = function () {
                return this._pagesContainer;
            };
            // get the height of the page, add margins, does not consider the zoom.
            _SinglePageView.prototype._getPageHeightWithoutZoom = function (pageIndex) {
                var minHeigth = this._pagesContainer.clientHeight;
                var pageHeight = this._getPageSize(pageIndex).height.valueInPixel + viewer._PageViewBase._pageMargin * 2;
                return Math.max(pageHeight, minHeigth);
            };
            _SinglePageView.prototype._hasScrollbar = function (element, isHorizontal) {
                if (isHorizontal) {
                    return element.scrollWidth > element.clientWidth;
                }
                else {
                    return element.scrollHeight > element.clientHeight;
                }
            };
            // update the scroller's height and value.
            // the max value is the sum of all page's height.
            _SinglePageView.prototype._updateScroller = function () {
                if (!this._isScrollerVisible)
                    return;
                var scroller = this._scroller;
                scroller.height = this._pagesContainer.clientHeight;
                var maxValue = 0;
                // add the sum of all page's height.
                for (var index = 0; index < this.pages.length; index++) {
                    maxValue += this._getPageHeightWithoutZoom(index);
                }
                scroller.max = maxValue;
                this._updateScrollerValue();
            };
            // update the scroller's value based on the current page index and the scrolling position of current page.
            _SinglePageView.prototype._updateScrollerValue = function () {
                if (!this._isScrollerVisible)
                    return;
                // the current page index
                var pageIndex = this.pageIndex;
                if (pageIndex < 0) {
                    return;
                }
                // the scroll position (in percentage) of current page
                var pagePercent = 0;
                if (this._pagesContainer.scrollTop > 0) {
                    pagePercent = this._pagesContainer.scrollTop / (this._pagesContainer.scrollHeight - this._pagesContainer.clientHeight);
                }
                var scroller = this._scroller;
                var pageCount = this.pages.length;
                var value = 0;
                for (var index = 0; index < pageIndex; index++) {
                    value += this._getPageHeightWithoutZoom(index);
                }
                // the height of current page
                var pageHeight = this._getPageHeightWithoutZoom(pageIndex);
                value += pageHeight * pagePercent;
                // let virtual scroller scroll to the end if the last page and has no page scroller.
                if (pageIndex >= pageCount - 1 && !this._hasPageVScrollBar) {
                    value = scroller.max;
                }
                scroller.value = value;
            };
            _SinglePageView.prototype._doScrollerValueChanged = function () {
                if (!this._isScrollerVisible)
                    return;
                var scroller = this._scroller;
                var pageCount = this.pages.length;
                var value = scroller.value;
                var pageIndex = 0, pagePercent = 1;
                for (; pageIndex < pageCount; pageIndex++) {
                    var pageHeight = this._getPageHeightWithoutZoom(pageIndex);
                    if (value > pageHeight) {
                        value -= pageHeight;
                        continue;
                    }
                    else {
                        // hit the expected page, calculate the page scroll position (in percentage).
                        pagePercent = value / pageHeight;
                        break;
                    }
                }
                // ensure not exceed the last page.
                if (pageIndex >= pageCount) {
                    pageIndex = pageCount - 1;
                }
                this._innerMoveToPage(pageIndex, pagePercent);
            };
            _SinglePageView.prototype._doContainerWheel = function (e) {
                if (!this._isScrollerVisible)
                    return;
                if (e.deltaY == 0) {
                    return;
                }
                var isScrollUp = e.deltaY < 0;
                // has the page scroller for current page,
                // 1) first auto scroll.
                // 2) jump to other page if it's aready on the edge.
                if (this._hasPageVScrollBar) {
                    if (isScrollUp) {
                        if (this._pagesContainer.scrollTop > 0) {
                            return; // still can scroll up, do auto scroll
                        }
                    }
                    else {
                        if (this._pagesContainer.scrollTop < this._pagesContainer.scrollHeight - this._pagesContainer.clientHeight) {
                            return; // still can scroll down, do auto scroll
                        }
                    }
                }
                // shoud jump to other page, when
                // 1) there is no page scroller for current page.
                // 2) it's on the edge, cannot auto scroll anymore.
                if (isScrollUp) {
                    this._innerMoveToPreviousPageAtBottom(e);
                }
                else {
                    this._innerMoveToNextPageAtTop(e);
                }
            };
            _SinglePageView.prototype._doContainerScroll = function () {
                if (!this._isScrollerVisible)
                    return;
                // bypass the scroll if it is caused by setting scrollTop
                if (this._pagesContainer.scrollTop == this._desiredPageScrollTop) {
                    return;
                }
                // sync the scroll position from viewpage to scroller.
                this._updateScrollerValue();
                this._onPositionChanged();
            };
            _SinglePageView.prototype._doContainerKeyDown = function () {
                if (!this._isScrollerVisible)
                    return;
                var e = event;
                if (this._hasPageVScrollBar) {
                    switch (e.keyCode) {
                        case wijmo.Key.PageDown: {
                            // move to next page if already scroll to edge.
                            if (this._pagesContainer.scrollTop >= this._pagesContainer.scrollHeight - this._pagesContainer.clientHeight) {
                                this._innerMoveToNextPageAtTop(e);
                            }
                            // else, do auto scroll down
                            break;
                        }
                        case wijmo.Key.PageUp: {
                            // move to previous page if already scroll to edge.
                            if (this._pagesContainer.scrollTop == 0) {
                                this._innerMoveToPreviousPageAtBottom(e);
                            }
                            // else, do auto scroll up.
                            break;
                        }
                        // do auto scroll for up/down key.
                    }
                }
                else {
                    switch (e.keyCode) {
                        case wijmo.Key.Down:
                        case wijmo.Key.PageDown: {
                            this._innerMoveToNextPageAtTop(e);
                            break;
                        }
                        case wijmo.Key.Up:
                        case wijmo.Key.PageUp: {
                            this._innerMoveToPreviousPageAtBottom(e);
                            break;
                        }
                    }
                }
            };
            // prevent update the virtual scroller value.
            _SinglePageView.prototype._preventContainerScroll = function () {
                this._desiredPageScrollTop = this._pagesContainer.scrollTop;
            };
            _SinglePageView.prototype._innerMoveToPreviousPageAtBottom = function (e) {
                if (this.pageIndex > 0) {
                    if (e) {
                        e.preventDefault();
                    }
                    this._innerMoveToPage(this.pageIndex - 1, 1);
                    this._updateScrollerValue();
                }
            };
            _SinglePageView.prototype._innerMoveToNextPageAtTop = function (e) {
                if (this.pageIndex < this.pages.length - 1) {
                    if (e) {
                        e.preventDefault();
                    }
                    this._innerMoveToPage(this.pageIndex + 1, 0);
                    this._updateScrollerValue();
                }
            };
            // move to the specified page and specified position.
            _SinglePageView.prototype._innerMoveToPage = function (pageIndex, pagePercent) {
                var _this = this;
                this._innerNavigating = true;
                // set the pageBounds to null to prevent scroll to page top on page loaded.
                // the page scroll position is updated immediately after moving to the page.
                var position = { pageIndex: pageIndex };
                this.moveToPosition(position).then(function (_) {
                    _this._innerMoveToPagePosition(pagePercent);
                    _this._innerNavigating = false;
                });
            };
            // move to the specified position in current page.
            _SinglePageView.prototype._innerMoveToPagePosition = function (pagePercent) {
                if (!this._hasPageVScrollBar) {
                    return;
                }
                var scrollTop = (this._pagesContainer.scrollHeight - this._pagesContainer.clientHeight) * pagePercent;
                this._pagesContainer.scrollTop = scrollTop;
                this._preventContainerScroll();
            };
            // override
            _SinglePageView.prototype.moveToPosition = function (position) {
                var promise = _super.prototype.moveToPosition.call(this, position);
                // should update the scroller if the navigating is caused by outside (toolbar, outline, bookmark, etc).
                if (!this._innerNavigating) {
                    this._updateScrollerValue();
                }
                return promise;
            };
            // implement abstract
            _SinglePageView.prototype._moveToPagePosition = function (position) {
                var bound = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 }, 
                //no pageBounds means navigate to page, should scroll to the top of page container.
                margin = position.pageBounds ? viewer._PageViewBase._pageMargin : 0, currentPage = this.pages[this.pageIndex], offsetPoint = viewer._getTransformedPosition(bound, currentPage.size, currentPage.rotateAngle, this.zoomFactor);
                if (!position.samePage) { // don't reset the scrollbars if being scrolling inside the same page (#349202, #351741).
                    this._pagesContainer.scrollTop = offsetPoint.y + margin;
                    this._pagesContainer.scrollLeft = offsetPoint.x + margin;
                }
            };
            _SinglePageView.prototype._hitTestPageIndex = function (top) {
                return this.pageIndex;
            };
            _SinglePageView.prototype._pointInViewPanelClientArea = function (clientX, clientY) {
                return (clientX >= 0) &&
                    (clientY >= 0) &&
                    // ignore scroll bars
                    (clientX < this._pagesContainer.clientWidth) &&
                    (clientY < this._pagesContainer.clientHeight);
            };
            _SinglePageView.prototype._panelViewPntToPageView = function (clientX, clientY) {
                if (this.pageIndex < 0) {
                    return null;
                }
                var top = this._pagesContainer.scrollTop + clientY, left = 0;
                if (this._pagesContainer.scrollLeft > 0) {
                    left = this._pagesContainer.scrollLeft + clientX;
                }
                else {
                    var containerRect = this._pagesContainer.getBoundingClientRect(), wrapperRect = this._pagesWrapper.getBoundingClientRect();
                    left = clientX - (wrapperRect.left - containerRect.left) + viewer._PageViewBase._pageMargin;
                }
                return { x: left, y: top, pageIndex: this.pageIndex };
            };
            _SinglePageView.prototype._render = function (pageIndex) {
                return this._renderViewPage(this._pagesWrapper.querySelector('.wj-view-page'), pageIndex, false);
            };
            _SinglePageView.prototype._guessPageIndex = function () {
                return this.pageIndex;
            };
            _SinglePageView.prototype._reserveViewPage = function () {
                viewer._removeChildren(this._pagesWrapper);
                this._addViewPage();
                this.invalidate();
            };
            _SinglePageView.prototype._updatePageViewTransform = function () {
                var viewPages, viewPage;
                viewPage = this._pagesWrapper.querySelector('.wj-view-page');
                this._setPageTransform(viewPage, this.pageIndex);
            };
            _SinglePageView.prototype._onPageLoaded = function (pageIndex, pageElement) {
                _super.prototype._onPageLoaded.call(this, pageIndex, pageElement);
                this._updateScroller();
            };
            _SinglePageView.prototype._onZoomFactorChanged = function (oldValue, newValue) {
                _super.prototype._onZoomFactorChanged.call(this, oldValue, newValue);
                this._updateScroller();
            };
            _SinglePageView.prototype._zoomToViewWidth = function () {
                var pageSize = this._getPageSize(this.pageIndex);
                if (!pageSize) {
                    return;
                }
                this.zoomFactor = this._calcZoomToViewWidthFactor();
            };
            _SinglePageView.prototype._calcZoomToViewWidthFactor = function () {
                var viewHeight = this._getViewPortHeight();
                var viewWidth = this._getViewPortWidth();
                var pageSize = this._getPageSize(this.pageIndex);
                var pageHeight = pageSize.height.valueInPixel;
                var pageWidth = pageSize.width.valueInPixel;
                if (viewWidth / pageWidth > viewHeight / pageHeight) {
                    viewWidth -= viewer._Scroller.getScrollbarWidth();
                }
                return viewWidth / pageWidth;
            };
            _SinglePageView.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this._isScrollerVisible) {
                    wijmo.addClass(this.hostElement, "virtual");
                }
                else {
                    wijmo.removeClass(this.hostElement, "virtual");
                }
                this._updateScroller();
            };
            _SinglePageView.controlTemplate = '<div class="wj-pageview-pagescontainer" wj-part="pages-container" tabindex="0">' +
                '   <div class="wj-pages-wrapper" wj-part="pages-wrapper"></div>' +
                '</div>' +
                '<div class="wj-pageview-vscroller" wj-part="vscroller" tabindex="-1"></div> ';
            return _SinglePageView;
        }(viewer._PageViewBase));
        viewer._SinglePageView = _SinglePageView;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _CompositePageView = /** @class */ (function (_super) {
            __extends(_CompositePageView, _super);
            function _CompositePageView(element) {
                var _this = _super.call(this, element) || this;
                _this._viewMode = viewer.ViewMode.Single;
                _this.pageIndexChanged = new wijmo.Event();
                _this.zoomFactorChanged = new wijmo.Event();
                _this.zoomModeChanged = new wijmo.Event();
                _this.positionChanged = new wijmo.Event();
                _this.rotateAngleChanged = new wijmo.Event();
                _this.pageLoaded = new wijmo.Event();
                // use arrow functions to correctly bind to this (binding with addHandler args is not working)
                _this._handlerPageIndexChanged = function () { return _this.onPageIndexChanged(); };
                _this._handlerZoomFactorChanged = function (sender, e) { return _this.onZoomFactorChanged(e.oldValue, e.newValue); };
                _this._handlerZoomModeChanged = function (sender, e) { return _this.onZoomModeChanged(e.oldValue, e.newValue); };
                _this._handlerPositionChanged = function () { return _this.onPositionChanged(); };
                _this._handlerRotateAngleChanged = function () { return _this.onRotateAngleChanged(); };
                _this._handlerPageLoaded = function (sender, e) { return _this.onPageLoaded(e); };
                var tpl;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate('wj-viewpanel-container', tpl, {
                    _singlePageView: 'single-pageview',
                    _continuousPageView: 'continuous-pageview'
                });
                _this._initPageView();
                return _this;
            }
            _CompositePageView.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
                host.appendChild(viewer._toDOMs(tpl));
                // bind control variables to template parts
                if (parts) {
                    for (var part in parts) {
                        var wjPart = parts[part];
                        this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                        // look in the root as well (querySelector doesn't...)
                        if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                            this[part] = tpl;
                        }
                        // make sure we found the part
                        if (this[part] == null) {
                            throw 'Missing template part: "' + wjPart + '"';
                        }
                    }
                }
                return host;
            };
            Object.defineProperty(_CompositePageView.prototype, "pageIndex", {
                get: function () {
                    return this._activePageView.pageIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "pages", {
                get: function () {
                    return this._activePageView.pages;
                },
                set: function (value) {
                    this._activePageView.pages = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "zoomMode", {
                get: function () {
                    return this._activePageView.zoomMode;
                },
                set: function (value) {
                    this._activePageView.zoomMode = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "zoomFactor", {
                get: function () {
                    return this._activePageView.zoomFactor;
                },
                set: function (value) {
                    this._activePageView.zoomFactor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "panMode", {
                get: function () {
                    return this._activePageView.panMode;
                },
                set: function (value) {
                    this._activePageView.panMode = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "viewMode", {
                get: function () {
                    return this._viewMode;
                },
                set: function (value) {
                    if (this._viewMode === value) {
                        return;
                    }
                    this._viewMode = value;
                    this._updateActivePageView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "scrollTop", {
                get: function () {
                    return this._activePageView.scrollTop;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "scrollLeft", {
                get: function () {
                    return this._activePageView.scrollLeft;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_CompositePageView.prototype, "_activePageViewElement", {
                get: function () {
                    return this.viewMode === viewer.ViewMode.Single ? this._singlePageView : this._continuousPageView;
                },
                enumerable: true,
                configurable: true
            });
            _CompositePageView.prototype.onPageIndexChanged = function () {
                this.pageIndexChanged.raise(this);
            };
            _CompositePageView.prototype.onZoomFactorChanged = function (oldValue, newValue) {
                this.zoomFactorChanged.raise(this, { oldValue: oldValue, newValue: newValue });
            };
            _CompositePageView.prototype.onZoomModeChanged = function (oldValue, newValue) {
                this.zoomModeChanged.raise(this, { oldValue: oldValue, newValue: newValue });
            };
            _CompositePageView.prototype.onPositionChanged = function () {
                this.positionChanged.raise(this);
            };
            _CompositePageView.prototype.onRotateAngleChanged = function () {
                this.rotateAngleChanged.raise(this);
            };
            _CompositePageView.prototype.onPageLoaded = function (e) {
                this.pageLoaded.raise(this, e);
            };
            _CompositePageView.prototype._updateActivePageView = function () {
                var currentPageIndex = this._activePageView.pageIndex, pages = this._activePageView.pages, zoomFactor = this._activePageView.zoomFactor, zoomMode = this._activePageView.zoomMode, panMode = this._activePageView.panMode;
                this._removePageViewHandlers(this._activePageView);
                this._activePageView = wijmo.Control.getControl(this._activePageViewElement);
                if (!this._activePageView.pages) {
                    this._activePageView.pages = pages;
                }
                this._activePageView.invalidate();
                // firstly update page view ...
                this._updatePageViewsVisible();
                // ... then update view props to calculate zoom related data correctly
                this._activePageView.moveToPage(currentPageIndex);
                this._activePageView.zoomFactor = zoomFactor;
                this._activePageView.zoomMode = zoomMode;
                this._activePageView.panMode = panMode;
                // bind events after switching active page view to prevent unnecessary events during the switching
                this._addPageViewHandlers(this._activePageView);
            };
            _CompositePageView.prototype._initPageView = function () {
                this._activePageView = new viewer._SinglePageView(this._singlePageView);
                this._addPageViewHandlers(this._activePageView);
                new viewer._ContinuousPageView(this._continuousPageView);
                this._updatePageViewsVisible();
            };
            _CompositePageView.prototype._addPageViewHandlers = function (pageView) {
                this._activePageView.pageIndexChanged.addHandler(this._handlerPageIndexChanged);
                this._activePageView.zoomFactorChanged.addHandler(this._handlerZoomFactorChanged);
                this._activePageView.zoomModeChanged.addHandler(this._handlerZoomModeChanged);
                this._activePageView.positionChanged.addHandler(this._handlerPositionChanged);
                this._activePageView.rotateAngleChanged.addHandler(this._handlerRotateAngleChanged);
                this._activePageView.pageLoaded.addHandler(this._handlerPageLoaded);
            };
            _CompositePageView.prototype._removePageViewHandlers = function (pageView) {
                pageView.pageIndexChanged.removeHandler(this._handlerPageIndexChanged);
                pageView.zoomFactorChanged.removeHandler(this._handlerZoomFactorChanged);
                pageView.zoomModeChanged.removeHandler(this._handlerZoomModeChanged);
                pageView.positionChanged.removeHandler(this._handlerPositionChanged);
                pageView.rotateAngleChanged.removeHandler(this._handlerRotateAngleChanged);
                pageView.pageLoaded.removeHandler(this._handlerPageLoaded);
            };
            _CompositePageView.prototype._updatePageViewsVisible = function () {
                var showSingle = this.viewMode === viewer.ViewMode.Single;
                if (showSingle) {
                    wijmo.removeClass(this._singlePageView, viewer._hiddenCss);
                    if (!wijmo.hasClass(this._continuousPageView, viewer._hiddenCss)) {
                        wijmo.addClass(this._continuousPageView, viewer._hiddenCss);
                    }
                }
                else {
                    wijmo.removeClass(this._continuousPageView, viewer._hiddenCss);
                    if (!wijmo.hasClass(this._singlePageView, viewer._hiddenCss)) {
                        wijmo.addClass(this._singlePageView, viewer._hiddenCss);
                    }
                }
            };
            _CompositePageView.prototype.moveToPage = function (pageIndex) {
                return this._activePageView.moveToPage(pageIndex);
            };
            _CompositePageView.prototype.moveToPosition = function (position) {
                return this._activePageView.moveToPosition(position);
            };
            _CompositePageView.prototype.rotatePageTo = function (pageIndex, rotateAngle) {
                this._activePageView.rotatePageTo(pageIndex, rotateAngle);
            };
            _CompositePageView.prototype.hitTest = function (x, y) {
                return this._activePageView.hitTest(x, y);
            };
            _CompositePageView.prototype.resetPages = function () {
                wijmo.Control.getControl(this._singlePageView).resetPages();
                wijmo.Control.getControl(this._continuousPageView).resetPages();
            };
            _CompositePageView.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                wijmo.Control.getControl(this._activePageViewElement).invalidate();
                this._activePageView.refresh();
            };
            _CompositePageView.prototype.isPageContentLoaded = function (pageIndex) {
                return this._activePageView.isPageContentLoaded(pageIndex);
            };
            _CompositePageView.controlTemplate = '<div class="wj-pageview" wj-part="single-pageview"></div>' +
                '<div class="wj-pageview" wj-part="continuous-pageview"></div>';
            return _CompositePageView;
        }(wijmo.Control));
        viewer._CompositePageView = _CompositePageView;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _isIOS = typeof navigator !== 'undefined' && navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
        var _svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve">';
        var _svgEnd = '</svg>';
        var _checkedCss = 'wj-state-active';
        var _disabledCss = 'wj-state-disabled';
        viewer._commandTagAttr = 'command-tag';
        function isIOS() {
            return _isIOS;
        }
        viewer.isIOS = isIOS;
        function _createSvgBtn(svgContent) {
            var svg = _toDOM(_svgStart + svgContent + _svgEnd);
            wijmo.addClass(svg, 'wj-svg-btn');
            var btn = document.createElement('a');
            btn.appendChild(svg);
            wijmo.addClass(btn, 'wj-btn');
            btn.tabIndex = 0;
            return btn;
        }
        viewer._createSvgBtn = _createSvgBtn;
        function _checkImageButton(button, checked) {
            if (checked) {
                wijmo.addClass(button, _checkedCss);
                return;
            }
            wijmo.removeClass(button, _checkedCss);
        }
        viewer._checkImageButton = _checkImageButton;
        function _checkSeparatorShown(container) {
            var groupEnd, hideSeparator = true, currentEle, currentEleHidden, lastShowSeparator;
            for (var i = 0; i < container.children.length; i++) {
                currentEle = container.children[i];
                groupEnd = wijmo.hasClass(currentEle, 'wj-separator');
                currentEleHidden = wijmo.hasClass(currentEle, viewer._hiddenCss);
                if (!groupEnd && !currentEleHidden) {
                    hideSeparator = false;
                    continue;
                }
                if (groupEnd) {
                    if (hideSeparator) {
                        if (!currentEleHidden) {
                            wijmo.addClass(currentEle, viewer._hiddenCss);
                        }
                    }
                    else {
                        if (currentEleHidden) {
                            wijmo.removeClass(currentEle, viewer._hiddenCss);
                        }
                        lastShowSeparator = currentEle;
                    }
                    //reset
                    hideSeparator = true;
                }
            }
            //hide separator if all items after this separator are hidden.
            if (hideSeparator && lastShowSeparator) {
                wijmo.addClass(lastShowSeparator, 'hidden');
            }
        }
        viewer._checkSeparatorShown = _checkSeparatorShown;
        function _disableImageButton(button, disabled) {
            if (disabled) {
                wijmo.addClass(button, _disabledCss);
                return;
            }
            wijmo.removeClass(button, _disabledCss);
            // remove disabled attr from input (TFS 467152)
            // disabled attr is set in Controll.isDisabled setter but is not reverted
            // as Viewer use the same css-class which checked in Controll.isDisabled setter
            if (button instanceof HTMLElement) {
                var disabledInputs = button.querySelectorAll('input[disabled]');
                for (var idx = 0; idx < disabledInputs.length; idx++) {
                    disabledInputs[idx].disabled = false;
                }
                // enable buttons (TFS 467374)
                var disabledButtons = button.querySelectorAll('button[disabled]');
                for (var idx = 0; idx < disabledButtons.length; idx++) {
                    disabledButtons[idx].disabled = false;
                }
            }
        }
        viewer._disableImageButton = _disableImageButton;
        function _getPositionByHitTestInfo(hitTestInfo) {
            if (hitTestInfo) {
                return {
                    pageIndex: hitTestInfo.pageIndex, pageBounds: { x: hitTestInfo.x, y: hitTestInfo.y, width: 0, height: 0 }
                };
            }
            return {
                pageIndex: 0, pageBounds: { x: 0, y: 0, width: 0, height: 0 }
            };
        }
        viewer._getPositionByHitTestInfo = _getPositionByHitTestInfo;
        function _setLandscape(pageSettings, landscape) {
            if (pageSettings.landscape === landscape) {
                return;
            }
            pageSettings.landscape = landscape;
            var width = pageSettings.width;
            pageSettings.width = pageSettings.height;
            pageSettings.height = width;
            var left = pageSettings.leftMargin;
            if (landscape) {
                pageSettings.leftMargin = pageSettings.bottomMargin;
                pageSettings.bottomMargin = pageSettings.rightMargin;
                pageSettings.rightMargin = pageSettings.topMargin;
                pageSettings.topMargin = left;
            }
            else {
                pageSettings.leftMargin = pageSettings.topMargin;
                pageSettings.topMargin = pageSettings.rightMargin;
                pageSettings.rightMargin = pageSettings.bottomMargin;
                pageSettings.bottomMargin = left;
            }
        }
        viewer._setLandscape = _setLandscape;
        function _showImageButton(button, visible) {
            if (visible) {
                wijmo.removeClass(button, viewer._hiddenCss);
                return;
            }
            wijmo.addClass(button, viewer._hiddenCss);
        }
        viewer._showImageButton = _showImageButton;
        function _isDisabledImageButton(button) {
            return wijmo.hasClass(button, _disabledCss);
        }
        viewer._isDisabledImageButton = _isDisabledImageButton;
        function _isCheckedImageButton(button) {
            return wijmo.hasClass(button, _checkedCss);
        }
        viewer._isCheckedImageButton = _isCheckedImageButton;
        function _toDOM(html) {
            return viewer._toDOMs(html).firstChild;
        }
        viewer._toDOM = _toDOM;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _Toolbar = /** @class */ (function (_super) {
            __extends(_Toolbar, _super);
            function _Toolbar(element) {
                var _this = _super.call(this, element) || this;
                _this._disposed = false;
                _this.svgButtonClicked = new wijmo.Event();
                var tpl;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate('wj-toolbar', tpl, {
                    _toolbarWrapper: 'toolbar-wrapper',
                    _toolbarContainer: 'toolbar-container',
                    _toolbarLeft: 'toolbar-left',
                    _toolbarRight: 'toolbar-right'
                });
                viewer._addEvent(_this._toolbarLeft, 'mouseover', function () { _this._scrollLeft(); });
                viewer._addEvent(_this._toolbarLeft, 'mouseout', function () { _this._clearToolbarMoveTimer(); });
                viewer._addEvent(_this._toolbarRight, 'mouseover', function () { _this._scrollRight(); });
                viewer._addEvent(_this._toolbarRight, 'mouseout', function () { _this._clearToolbarMoveTimer(); });
                return _this;
            }
            _Toolbar.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
                host.appendChild(viewer._toDOMs(tpl));
                // bind control variables to template parts
                if (parts) {
                    for (var part in parts) {
                        var wjPart = parts[part];
                        this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                        // look in the root as well (querySelector doesn't...)
                        if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                            this[part] = tpl;
                        }
                        // make sure we found the part
                        if (this[part] == null) {
                            throw 'Missing template part: "' + wjPart + '"';
                        }
                    }
                }
                return host;
            };
            _Toolbar.prototype.dispose = function () {
                this._disposed = true;
                _super.prototype.dispose.call(this);
            };
            _Toolbar.prototype._clearToolbarMoveTimer = function () {
                if (this._toolbarMoveTimer != null) {
                    clearTimeout(this._toolbarMoveTimer);
                    this._toolbarMoveTimer = null;
                }
            };
            _Toolbar.prototype._scrollRight = function () {
                var _this = this;
                var minLeft = this._toolbarContainer.offsetWidth - this._toolbarWrapper.offsetWidth, style = this._toolbarWrapper.style, oldLeft = style.left ? parseInt(style.left) : 0, newLeft = oldLeft - _Toolbar._moveStep;
                this._checkMoveButtonEnabled();
                if (newLeft < minLeft) {
                    return;
                }
                style.left = newLeft + 'px';
                this._toolbarMoveTimer = setTimeout(function () { return _this._scrollRight(); }, _Toolbar._moveInterval);
            };
            _Toolbar.prototype._scrollLeft = function () {
                var _this = this;
                var style = this._toolbarWrapper.style, oldLeft = style.left ? parseInt(style.left) : 0, newLeft = oldLeft + _Toolbar._moveStep;
                this._checkMoveButtonEnabled();
                if (newLeft > 0) {
                    return;
                }
                style.left = newLeft + 'px';
                this._toolbarMoveTimer = setTimeout(function () { return _this._scrollLeft(); }, _Toolbar._moveInterval);
            };
            _Toolbar.prototype._checkMoveButtonEnabled = function () {
                var leftBtnWidth = this._toolbarLeft.getBoundingClientRect().width, newLeft = this._toolbarWrapper.offsetLeft - leftBtnWidth + _Toolbar._moveStep, leftBtnEnabled = newLeft <= 0, leftBtnHasEnableClass = wijmo.hasClass(this._toolbarLeft, _Toolbar._enabledCss);
                if (leftBtnEnabled) {
                    if (!leftBtnHasEnableClass) {
                        wijmo.addClass(this._toolbarLeft, _Toolbar._enabledCss);
                    }
                }
                else {
                    if (leftBtnHasEnableClass) {
                        wijmo.removeClass(this._toolbarLeft, _Toolbar._enabledCss);
                    }
                }
                var rightBtnWidth = this._toolbarRight.getBoundingClientRect().width, minLeft = this._toolbarContainer.getBoundingClientRect().width - this._toolbarWrapper.getBoundingClientRect().width, newLeft = this._toolbarWrapper.offsetLeft - rightBtnWidth - _Toolbar._moveStep, rightBtnEnabled = newLeft >= minLeft, rightBtnHasEnabledClass = wijmo.hasClass(this._toolbarRight, _Toolbar._enabledCss);
                if (rightBtnEnabled) {
                    if (!rightBtnHasEnabledClass) {
                        wijmo.addClass(this._toolbarRight, _Toolbar._enabledCss);
                    }
                }
                else if (rightBtnHasEnabledClass) {
                    wijmo.removeClass(this._toolbarRight, _Toolbar._enabledCss);
                }
            };
            _Toolbar.prototype._showToolbarMoveButton = function (show) {
                var visibility = show ? 'visible' : 'hidden';
                this._toolbarLeft.style.visibility = visibility;
                this._toolbarRight.style.visibility = visibility;
                this._checkMoveButtonEnabled();
            };
            _Toolbar.prototype._globalize = function () {
            };
            _Toolbar.prototype.resetWidth = function () {
                var toolbarLeftWidth = this._toolbarLeft.getBoundingClientRect().width;
                var toolbarRightWidth = this._toolbarRight.getBoundingClientRect().width;
                var toolbarWidth = this.hostElement.getBoundingClientRect().width;
                //Set a wider size for auto calculate.
                //The size should wider enough for put in all toolbar child node in one line.
                this._toolbarContainer.style.width = '1500px';
                this._toolbarWrapper.style.width = 'auto';
                //IE need 2 more pixel.
                var toolbarWrapperWidth = this._toolbarWrapper.getBoundingClientRect().width + 2;
                this._toolbarWrapper.style.width = toolbarWrapperWidth + 'px';
                this._toolbarContainer.style.width = toolbarWidth - toolbarLeftWidth - toolbarRightWidth + 'px';
                var showMoveButton = toolbarLeftWidth + toolbarRightWidth + toolbarWrapperWidth > toolbarWidth;
                this._showToolbarMoveButton(showMoveButton);
                if (!showMoveButton) {
                    //reset toolbar position to show all toolbar item.
                    this._toolbarWrapper.style.left = '0px';
                }
            };
            _Toolbar.prototype.addSeparator = function () {
                var element = document.createElement('span');
                element.className = 'wj-separator';
                this._toolbarWrapper.appendChild(element);
                return element;
            };
            _Toolbar.prototype.onSvgButtonClicked = function (e) {
                this.svgButtonClicked.raise(this, e);
            };
            _Toolbar.prototype.addCustomItem = function (element, commandTag) {
                if (wijmo.isString(element)) {
                    element = viewer._toDOM(element);
                }
                if (commandTag != null) {
                    element.setAttribute(viewer._commandTagAttr, commandTag.toString());
                }
                this._toolbarWrapper.appendChild(element);
            };
            _Toolbar.prototype.addSvgButton = function (title, svgContent, commandTag, isToggle) {
                var _this = this;
                var button = viewer._createSvgBtn(svgContent);
                button.title = title;
                button.setAttribute(viewer._commandTagAttr, commandTag.toString());
                this._toolbarWrapper.appendChild(button);
                viewer._addEvent(button, 'click,keydown', function (event) {
                    var e = event || window.event, needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
                    if (!needExe || viewer._isDisabledImageButton(button) || (!isToggle && viewer._isCheckedImageButton(button))) {
                        return;
                    }
                    _this.onSvgButtonClicked({ commandTag: commandTag });
                });
                return button;
            };
            _Toolbar.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._globalize();
                }
            };
            _Toolbar._moveStep = 4;
            _Toolbar._moveInterval = 5;
            _Toolbar._enabledCss = 'enabled';
            _Toolbar.controlTemplate = '<div class="wj-toolbar-move left" wj-part="toolbar-left">' +
                '<span class="wj-glyph-left"></span>' +
                '</div>' +
                '<div class="wj-toolbarcontainer" wj-part="toolbar-container">' +
                '<div class="wj-toolbarwrapper wj-btn-group" wj-part="toolbar-wrapper">' +
                '</div>' +
                '</div>' +
                '<div class="wj-toolbar-move right" wj-part="toolbar-right">' +
                '<span class="wj-glyph-right"></span>' +
                '</div>';
            return _Toolbar;
        }(wijmo.Control));
        viewer._Toolbar = _Toolbar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_1) {
        'use strict';
        var _ViewerToolbarBase = /** @class */ (function (_super) {
            __extends(_ViewerToolbarBase, _super);
            function _ViewerToolbarBase(element, viewer) {
                var _this = _super.call(this, element) || this;
                _this._viewer = viewer;
                _this._initToolbarItems();
                var update = function () { return _this.isDisabled = !_this._viewer._getDocumentSource(); };
                _this._viewer._documentSourceChanged.addHandler(update);
                update();
                _this._viewer._viewerActionStatusChanged.addHandler(function (sender, e) {
                    var action = e.action, actionElement = _this.hostElement.querySelector('[command-tag="' + action.actionType.toString() + '"]');
                    viewer_1._checkImageButton(actionElement, action.checked);
                    viewer_1._disableImageButton(actionElement, action.disabled);
                    viewer_1._showImageButton(actionElement, action.shown);
                    viewer_1._checkSeparatorShown(_this._toolbarWrapper);
                });
                return _this;
            }
            _ViewerToolbarBase.prototype._initToolbarItems = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _ViewerToolbarBase.prototype.onSvgButtonClicked = function (e) {
                _super.prototype.onSvgButtonClicked.call(this, e);
                this._viewer._executeAction(parseInt(e.commandTag));
            };
            Object.defineProperty(_ViewerToolbarBase.prototype, "viewer", {
                get: function () {
                    return this._viewer;
                },
                enumerable: true,
                configurable: true
            });
            _ViewerToolbarBase._initToolbarZoomValue = function (hostToolbar, viewer) {
                var toolbar = wijmo.Control.getControl(hostToolbar), zoomDiv = document.createElement('div'), zoomValueCombo, temp, i, j, zoomValues = viewer_1.ViewerBase._defaultZoomValues;
                zoomDiv.className = 'wj-input-zoom';
                toolbar.addCustomItem(zoomDiv, viewer_1._ViewerActionType.ZoomValue);
                zoomValueCombo = new wijmo.input.ComboBox(zoomDiv);
                zoomValueCombo.deferUpdate(function () {
                    for (i = 0; i < zoomValues.length; i++) {
                        for (j = i + 1; j < zoomValues.length; j++) {
                            if (zoomValues[i].value > zoomValues[j].value) {
                                temp = zoomValues[i];
                                zoomValues[i] = zoomValues[j];
                                zoomValues[j] = temp;
                            }
                        }
                    }
                    zoomValueCombo.itemsSource = zoomValues;
                    zoomValueCombo.isEditable = true;
                    zoomValueCombo.displayMemberPath = 'name';
                    zoomValueCombo.selectedValuePath = 'value';
                    zoomValueCombo.selectedValue = 1;
                });
                zoomValueCombo.selectedIndexChanged.addHandler(function () {
                    if (zoomValueCombo.isDroppedDown) {
                        var zoomFactor = zoomValueCombo.selectedValue;
                        if (zoomFactor == null) {
                            var zoomFactorText = zoomValueCombo.text.replace(",", "");
                            zoomFactor = parseFloat(zoomFactorText);
                            if (isNaN(zoomFactor)) {
                                zoomFactor = 100;
                            }
                            zoomFactor = zoomFactor * 0.01;
                        }
                        viewer.zoomFactor = zoomFactor;
                    }
                });
                zoomValueCombo.textChanged.addHandler(function () {
                    var zoomText = zoomValueCombo.text, zoomFactor;
                    if (zoomText.length > 0) {
                        zoomFactor = viewer_1.ViewerBase._zoomValuesParser(zoomText);
                        if (!isNaN(zoomFactor)) {
                            viewer.zoomFactor = zoomFactor * 0.01;
                        }
                    }
                });
                // Fix keyboard and wheel zoomValue navigation when zoomValue is not in the zoomValueCombo items list.
                // (the zoomValueCombo navigation is not working properly due to ComboBox feature - see reopened C1WEB-26816)
                var prevZoomFactors = [viewer.zoomFactor];
                var selectZoomRange = function (currentZoomFactor) {
                    var zoomValuesLength = zoomValues.length;
                    if (!zoomValuesLength) {
                        return [currentZoomFactor, currentZoomFactor];
                    }
                    var minIdx = -1;
                    for (var i_2 = 0; i_2 < zoomValuesLength; i_2++) {
                        if (zoomValues[i_2].value > currentZoomFactor) {
                            minIdx = i_2 - 1;
                            break;
                        }
                    }
                    if (minIdx === -1) {
                        var value = zoomValues[0].value;
                        return [value, value];
                    }
                    if (minIdx === (zoomValuesLength - 1)) {
                        var value = zoomValues[minIdx].value;
                        return [value, value];
                    }
                    return [zoomValues[minIdx].value, zoomValues[minIdx + 1].value];
                };
                zoomValueCombo.hostElement.addEventListener('wheel', function (e) {
                    // force zoomValueCombo navigation on wheel when current zoomValue is not in the zoomValueCombo items list
                    if (zoomValueCombo.containsFocus() && (zoomValueCombo.selectedIndex < 0)) {
                        var range = selectZoomRange(viewer.zoomFactor);
                        viewer.zoomFactor = range[e.deltaY < 0 ? 0 : 1];
                        e.preventDefault();
                    }
                });
                zoomValueCombo.hostElement.addEventListener('keydown', function (e) {
                    // force zoomValueCombo navigation on keyboard when current zoomValue is not in the zoomValueCombo items list
                    if (zoomValueCombo.containsFocus()) {
                        switch (e.keyCode) {
                            case wijmo.Key.Up:
                                if (zoomValues.map(function (x) { return x.value; }).indexOf(prevZoomFactors[1]) < 0) {
                                    viewer.zoomFactor = selectZoomRange(prevZoomFactors[1])[0];
                                }
                                break;
                            case wijmo.Key.Down:
                                if (zoomValues.map(function (x) { return x.value; }).indexOf(prevZoomFactors[0]) < 0) {
                                    viewer.zoomFactor = selectZoomRange(prevZoomFactors[0])[1];
                                }
                                break;
                            case wijmo.Key.PageUp:
                                viewer.zoomFactor = zoomValues[0].value;
                                break;
                            case wijmo.Key.PageDown:
                                viewer.zoomFactor = zoomValues[zoomValues.length - 1].value;
                                break;
                        }
                    }
                });
                var zoomInput = zoomDiv.querySelector('.wj-form-control');
                viewer_1._addEvent(zoomInput, 'blur', function (e) {
                    zoomValueCombo.text = viewer_1.ViewerBase._zoomValuesFormatter(viewer.zoomFactor);
                });
                viewer_1._addEvent(zoomInput, 'keypress', function (e) {
                    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) < 0) {
                        e.preventDefault();
                    }
                });
                viewer.zoomFactorChanged.addHandler(function (s, e) {
                    // remember only two previous zoomFactor values
                    prevZoomFactors.push(viewer.zoomFactor);
                    if (prevZoomFactors.length > 2) {
                        prevZoomFactors.splice(0, 1);
                    }
                    // TFS 422501 - comment out condition
                    // if (!zoomValueCombo.containsFocus()) {
                    //     zoomValueCombo.text = Globalize.format(viewer.zoomFactor, 'p0');
                    // }
                    zoomValueCombo.text = viewer_1.ViewerBase._zoomValuesFormatter(viewer.zoomFactor);
                    zoomValueCombo.isDroppedDown = false;
                });
            };
            _ViewerToolbarBase._initToolbarPageNumberInput = function (hostToolbar, viewer) {
                var toolbar = wijmo.Control.getControl(hostToolbar), pageNumberDiv = document.createElement('div'), pageCountSpan = document.createElement('span'), pageNumberInput, updatePageNumber = function () {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageNumberInput.value = viewer.pageIndex + 1;
                }, updatePageCount = function () {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageCountSpan.innerHTML = documentSource.pageCount.toString();
                    pageNumberInput.max = documentSource.pageCount;
                    pageNumberInput.min = Math.min(documentSource.pageCount, 1);
                    updatePageNumber();
                }, sourceChanged = function () {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource) {
                        return;
                    }
                    updatePageCount();
                    viewer_1._addWjHandler(viewer._documentEventKey, documentSource.pageCountChanged, updatePageCount);
                    viewer_1._addWjHandler(viewer._documentEventKey, documentSource.loadCompleted, updatePageCount);
                };
                pageNumberDiv.className = 'wj-pagenumber';
                toolbar.addCustomItem(pageNumberDiv, viewer_1._ViewerActionType.PageNumber);
                pageNumberInput = new wijmo.input.InputNumber(pageNumberDiv);
                pageNumberInput.format = 'n0';
                viewer_1._addEvent(pageNumberDiv, 'keyup', function (e) {
                    var event = e || window.event;
                    if (event.keyCode === wijmo.Key.Enter) {
                        viewer.moveToPage(pageNumberInput.value - 1);
                    }
                });
                viewer_1._addEvent(pageNumberInput.inputElement, 'blur', function (e) {
                    viewer.moveToPage(pageNumberInput.value - 1);
                });
                toolbar.addCustomItem('<span class="slash">/</span>');
                pageCountSpan.className = 'wj-pagecount';
                toolbar.addCustomItem(pageCountSpan, viewer_1._ViewerActionType.PageCountLabel);
                viewer.pageIndexChanged.addHandler(updatePageNumber);
                if (viewer._getDocumentSource()) {
                    sourceChanged();
                }
                viewer._documentSourceChanged.addHandler(sourceChanged);
            };
            return _ViewerToolbarBase;
        }(viewer_1._Toolbar));
        viewer_1._ViewerToolbarBase = _ViewerToolbarBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _SideTabs = /** @class */ (function (_super) {
            __extends(_SideTabs, _super);
            function _SideTabs(element) {
                var _this = _super.call(this, element) || this;
                _this._idCounter = 0;
                _this._tabPages = [];
                _this._tabPageDic = {};
                _this.tabPageActived = new wijmo.Event();
                _this.tabPageVisibilityChanged = new wijmo.Event();
                _this.expanded = new wijmo.Event();
                _this.collapsed = new wijmo.Event();
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control', tpl, {
                    _headersContainer: 'wj-headers',
                    _contentsContainer: 'wj-contents'
                });
                return _this;
            }
            _SideTabs.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
                host.appendChild(viewer._toDOMs(tpl));
                // bind control variables to template parts
                if (parts) {
                    for (var part in parts) {
                        var wjPart = parts[part];
                        this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                        // look in the root as well (querySelector doesn't...)
                        if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                            this[part] = tpl;
                        }
                        // make sure we found the part
                        if (this[part] == null) {
                            throw 'Missing template part: "' + wjPart + '"';
                        }
                    }
                }
                return host;
            };
            Object.defineProperty(_SideTabs.prototype, "tabPages", {
                get: function () {
                    return this._tabPages;
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.getTabPage = function (id) {
                return this._tabPageDic[id];
            };
            _SideTabs.prototype.getFirstShownTabPage = function (except) {
                var first;
                this._tabPages.some(function (i) {
                    if (!i.isHidden && i !== except) {
                        first = i;
                        return true;
                    }
                    return false;
                });
                return first;
            };
            Object.defineProperty(_SideTabs.prototype, "visibleTabPagesCount", {
                get: function () {
                    var count = 0;
                    this._tabPages.forEach(function (tabPage) {
                        if (!tabPage.isHidden) {
                            count++;
                        }
                    });
                    return count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SideTabs.prototype, "activedTabPage", {
                get: function () {
                    var first;
                    this._tabPages.some(function (i) {
                        if (i.isActived) {
                            first = i;
                            return true;
                        }
                        return false;
                    });
                    return first;
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.removePage = function (page) {
                var tabPage;
                tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                var id = tabPage.id;
                var index = this._tabPages.indexOf(tabPage);
                if (index < 0) {
                    return;
                }
                this._tabPages.splice(index, 1);
                this._tabPageDic[id] = void (0);
                if (!this.isCollapsed && tabPage.isActived) {
                    var first = this.getFirstShownTabPage();
                    if (first) {
                        this.active(first);
                    }
                    else {
                        this.collapse();
                    }
                }
                this._headersContainer.removeChild(tabPage.header);
                this._contentsContainer.removeChild(tabPage.outContent);
            };
            _SideTabs.prototype.addPage = function (title, svgIcon, index) {
                var _this = this;
                var id = this._getNewTabPageId(), header = document.createElement('li'), outContentHtml = '<div class="wj-tabpane">' +
                    '<div class="wj-tabtitle-wrapper"><h3 class="wj-tabtitle">' + title + '</h3><span class="wj-close">×</span></div>' +
                    '<div class="wj-tabcontent-wrapper"><div class="wj-tabcontent-inner"></div></div>' +
                    '</div>', outContent = viewer._toDOM(outContentHtml);
                var icon = viewer._createSvgBtn(svgIcon);
                header.appendChild(icon);
                index = index == null ? this._tabPages.length : index;
                index = Math.min(Math.max(index, 0), this._tabPages.length);
                if (index >= this._tabPages.length) {
                    this._headersContainer.appendChild(header);
                    this._contentsContainer.appendChild(outContent);
                }
                else {
                    this._headersContainer.insertBefore(header, this._tabPages[index].header);
                    this._contentsContainer.insertBefore(outContent, this._tabPages[index].outContent);
                }
                viewer._addEvent(outContent.querySelector('.wj-close'), 'click', function () {
                    _this.collapse();
                });
                viewer._addEvent(header.querySelector('a'), 'click,keydown', function (e) {
                    var currentTab = _this.getTabPage(id);
                    if (!currentTab) {
                        return;
                    }
                    var needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
                    if (!needExe) {
                        return;
                    }
                    _this.active(currentTab);
                });
                var tabPage = new viewer._TabPage(outContent, header, id);
                if (index >= this._tabPages.length) {
                    this._tabPages.push(tabPage);
                }
                else {
                    this._tabPages.splice(index, 0, tabPage);
                }
                this._tabPageDic[id] = tabPage;
                if (!this.isCollapsed) {
                    var actived = this.activedTabPage;
                    if (!actived) {
                        this.active(tabPage);
                    }
                }
                return tabPage;
            };
            Object.defineProperty(_SideTabs.prototype, "isCollapsed", {
                get: function () {
                    return wijmo.hasClass(this.hostElement, _SideTabs._collapsedCss);
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.hide = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                if (wijmo.hasClass(tabPage.header, viewer._hiddenCss)) {
                    return;
                }
                wijmo.addClass(tabPage.header, viewer._hiddenCss);
                this.onTabPageVisibilityChanged(tabPage);
                this.deactive(tabPage);
            };
            _SideTabs.prototype.show = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                if (!wijmo.hasClass(tabPage.header, viewer._hiddenCss)) {
                    return;
                }
                wijmo.removeClass(tabPage.header, viewer._hiddenCss);
                this.onTabPageVisibilityChanged(tabPage);
                if (!this.isCollapsed) {
                    var actived = this.activedTabPage;
                    if (!actived) {
                        this.active(tabPage);
                    }
                }
            };
            _SideTabs.prototype.deactive = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage || !tabPage.isActived) {
                    return;
                }
                wijmo.removeClass(tabPage.outContent, _SideTabs._activedCss);
                viewer._checkImageButton(tabPage.header.querySelector('a'), false);
                var shown = this.getFirstShownTabPage(tabPage);
                if (shown) {
                    this.active(shown);
                }
                else {
                    this.collapse();
                }
            };
            _SideTabs.prototype.active = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                if (tabPage.isActived) {
                    return;
                }
                this._clearActiveStyles();
                this.show(tabPage);
                wijmo.addClass(tabPage.outContent, _SideTabs._activedCss);
                viewer._checkImageButton(tabPage.header.querySelector('a'), true);
                this.expand();
                this.onTabPageActived();
            };
            _SideTabs.prototype.enable = function (page, value) {
                if (value === void 0) { value = true; }
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (tabPage) {
                    tabPage.enable(value);
                }
            };
            _SideTabs.prototype.enableAll = function (value) {
                if (value === void 0) { value = true; }
                this._tabPages.forEach(function (page) {
                    page.enable(value);
                });
            };
            _SideTabs.prototype.onTabPageActived = function () {
                this.tabPageActived.raise(this);
            };
            _SideTabs.prototype.onTabPageVisibilityChanged = function (tabPage) {
                this.tabPageVisibilityChanged.raise(this, { tabPage: tabPage });
            };
            _SideTabs.prototype.onExpanded = function () {
                this.expanded.raise(this);
            };
            _SideTabs.prototype.onCollapsed = function () {
                this.collapsed.raise(this);
            };
            _SideTabs.prototype.collapse = function () {
                if (this.isCollapsed) {
                    return;
                }
                this._clearActiveStyles();
                wijmo.addClass(this.hostElement, _SideTabs._collapsedCss);
                this.onCollapsed();
            };
            _SideTabs.prototype.expand = function () {
                if (!this.isCollapsed) {
                    return;
                }
                wijmo.removeClass(this.hostElement, _SideTabs._collapsedCss);
                if (!this.activedTabPage) {
                    var shown = this.getFirstShownTabPage();
                    if (shown) {
                        this.active(shown);
                    }
                }
                this.onExpanded();
            };
            _SideTabs.prototype.toggle = function () {
                if (this.isCollapsed) {
                    this.expand();
                }
                else {
                    this.collapse();
                }
            };
            _SideTabs.prototype._clearActiveStyles = function () {
                this._tabPages.forEach(function (i) {
                    wijmo.removeClass(i.outContent, _SideTabs._activedCss);
                    viewer._checkImageButton(i.header.querySelector('a'), false);
                });
            };
            _SideTabs.prototype._getNewTabPageId = function () {
                while (this._tabPageDic[(this._idCounter++).toString()]) {
                }
                return this._idCounter.toString();
            };
            _SideTabs._activedCss = 'active';
            _SideTabs._collapsedCss = 'collapsed';
            _SideTabs.controlTemplate = '<ul class="wj-nav wj-btn-group" wj-part="wj-headers"></ul>' +
                '<div class="wj-tabcontent" wj-part="wj-contents"></div>';
            return _SideTabs;
        }(wijmo.Control));
        viewer._SideTabs = _SideTabs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _TabPage = /** @class */ (function () {
            function _TabPage(outContent, header, id) {
                this._header = header;
                this._outContent = outContent;
                this._content = outContent.querySelector('.wj-tabcontent-inner');
                this._id = id;
            }
            Object.defineProperty(_TabPage.prototype, "isActived", {
                get: function () {
                    return wijmo.hasClass(this.outContent, viewer._SideTabs._activedCss);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "isHidden", {
                get: function () {
                    return wijmo.hasClass(this.header, viewer._hiddenCss);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "header", {
                get: function () {
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "content", {
                get: function () {
                    return this._content;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "outContent", {
                get: function () {
                    return this._outContent;
                },
                enumerable: true,
                configurable: true
            });
            _TabPage.prototype.enable = function (value) {
                if (value === void 0) { value = true; }
                wijmo.enable(this._header, value);
                wijmo.enable(this._content, value);
            };
            _TabPage.prototype.format = function (customizer) {
                customizer(this);
            };
            return _TabPage;
        }());
        viewer._TabPage = _TabPage;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _PageSetupEditor = /** @class */ (function (_super) {
            __extends(_PageSetupEditor, _super);
            function _PageSetupEditor(ele) {
                var _this = _super.call(this, ele) || this;
                _this._uiUpdating = false;
                // check dependencies
                var depErr = 'Missing dependency: _PageSetupEditor requires ';
                wijmo.assert(wijmo.input.ComboBox != null, depErr + 'wijmo.input.');
                var tpl;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate('wj-control', tpl, {
                    _divPaperKind: 'div-paper-kind',
                    _divOrientation: 'div-page-orientation',
                    _divMarginsLeft: 'div-margins-left',
                    _divMarginsRight: 'div-margins-right',
                    _divMarginsTop: 'div-margins-top',
                    _divMarginsBottom: 'div-margins-bottom',
                    _gPaperKind: 'g-paperkind',
                    _gOrientation: 'g-orientation',
                    _gMargins: 'g-margins',
                    _gLeft: 'g-left',
                    _gRight: 'g-right',
                    _gTop: 'g-top',
                    _gBottom: 'g-bottom'
                });
                var marginParms = {
                    format: 'n2',
                    min: 0,
                    max: 4,
                    step: .25,
                    valueChanged: _this._updateValue.bind(_this)
                };
                _this._numMarginsLeft = new wijmo.input.InputNumber(_this._divMarginsLeft, marginParms);
                _this._numMarginsRight = new wijmo.input.InputNumber(_this._divMarginsRight, marginParms);
                _this._numMarginsTop = new wijmo.input.InputNumber(_this._divMarginsTop, marginParms);
                _this._numMarginsBottom = new wijmo.input.InputNumber(_this._divMarginsBottom, marginParms);
                _this._cmbPaperKind = new wijmo.input.ComboBox(_this._divPaperKind, {
                    itemsSource: viewer._enumToArray(viewer._PaperKind),
                    displayMemberPath: 'text',
                    selectedValuePath: 'value',
                    isEditable: false
                });
                _this._cmbPaperKind.selectedIndexChanged.addHandler(_this._updateValue, _this);
                _this._cmbOrientation = new wijmo.input.ComboBox(_this._divOrientation, {
                    itemsSource: [wijmo.culture.Viewer.portrait, wijmo.culture.Viewer.landscape],
                    isEditable: false
                });
                _this._cmbOrientation.selectedIndexChanged.addHandler(_this._updateValue, _this);
                _this._globalize();
                return _this;
            }
            Object.defineProperty(_PageSetupEditor.prototype, "pageSettings", {
                get: function () {
                    return this._pageSettings;
                },
                set: function (pageSettings) {
                    var value = this._clonePageSettings(pageSettings);
                    this._pageSettings = value;
                    this._updateUI();
                    this._cmbPaperKind.focus();
                },
                enumerable: true,
                configurable: true
            });
            _PageSetupEditor.prototype._globalize = function () {
                var g = wijmo.culture.Viewer;
                this._gPaperKind.textContent = g.paperKind;
                this._gOrientation.textContent = g.orientation;
                this._gMargins.textContent = g.margins;
                this._gLeft.textContent = g.left;
                this._gRight.textContent = g.right;
                this._gTop.textContent = g.top;
                this._gBottom.textContent = g.bottom;
                var selectedIndex = this._cmbOrientation.selectedIndex;
                this._cmbOrientation.itemsSource = [wijmo.culture.Viewer.portrait, wijmo.culture.Viewer.landscape];
                this._cmbOrientation.selectedIndex = selectedIndex;
            };
            _PageSetupEditor.prototype._updateValue = function () {
                if (this._uiUpdating) {
                    return;
                }
                var pageSettings = this.pageSettings;
                if (pageSettings) {
                    pageSettings.bottomMargin = new viewer._Unit(this._numMarginsBottom.value, viewer._UnitType.Inch);
                    pageSettings.leftMargin = new viewer._Unit(this._numMarginsLeft.value, viewer._UnitType.Inch);
                    pageSettings.rightMargin = new viewer._Unit(this._numMarginsRight.value, viewer._UnitType.Inch);
                    pageSettings.topMargin = new viewer._Unit(this._numMarginsTop.value, viewer._UnitType.Inch);
                    pageSettings.paperSize = this._cmbPaperKind.selectedValue;
                    viewer._setLandscape(pageSettings, this._cmbOrientation.text === wijmo.culture.Viewer.landscape);
                    this._updateUI();
                }
            };
            _PageSetupEditor.prototype._clonePageSettings = function (src) {
                if (!src) {
                    return null;
                }
                var result = {};
                result.height = src.height ? new viewer._Unit(src.height) : null;
                result.width = src.width ? new viewer._Unit(src.width) : null;
                result.bottomMargin = src.bottomMargin ? new viewer._Unit(src.bottomMargin) : null;
                result.leftMargin = src.leftMargin ? new viewer._Unit(src.leftMargin) : null;
                result.rightMargin = src.rightMargin ? new viewer._Unit(src.rightMargin) : null;
                result.topMargin = src.topMargin ? new viewer._Unit(src.topMargin) : null;
                result.landscape = src.landscape;
                result.paperSize = src.paperSize;
                return result;
            };
            _PageSetupEditor.prototype._updateUI = function () {
                this._uiUpdating = true;
                var pageSettings = this.pageSettings, setMargin = function (input, unit) {
                    input.value = viewer._Unit.convertValue(unit.value, unit.units, viewer._UnitType.Inch);
                };
                if (pageSettings) {
                    this._cmbPaperKind.selectedIndex = this._findIndex(this._cmbPaperKind.itemsSource, function (item) { return item.value == pageSettings.paperSize; });
                    this._cmbOrientation.text = pageSettings.landscape ? wijmo.culture.Viewer.landscape : wijmo.culture.Viewer.portrait;
                    setMargin(this._numMarginsLeft, pageSettings.leftMargin);
                    setMargin(this._numMarginsRight, pageSettings.rightMargin);
                    setMargin(this._numMarginsTop, pageSettings.topMargin);
                    setMargin(this._numMarginsBottom, pageSettings.bottomMargin);
                }
                this._uiUpdating = false;
            };
            _PageSetupEditor.prototype._findIndex = function (list, predicate) {
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;
                for (var i = 0; i < list.length; i++) {
                    if (predicate(list[i])) {
                        return i;
                    }
                }
                return -1;
            };
            _PageSetupEditor.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._globalize();
                }
            };
            _PageSetupEditor.controlTemplate = '<div>' +
                '<div style="padding:12px;">' +
                '<table style="table-layout:fixed">' +
                '<tr>' +
                '<td wj-part="g-paperkind"></td>' +
                '<td><div wj-part="div-paper-kind"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-orientation"></td>' +
                '<td><div wj-part="div-page-orientation"></div></td>' +
                '</tr>' +
                '</table>' +
                '<fieldset style="margin-top: 12px">' +
                '<legend wj-part="g-margins"></legend>' +
                '<table style="table-layout:fixed">' +
                '<tr>' +
                '<td wj-part="g-left"></td>' +
                '<td><div wj-part="div-margins-left"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-right"></td>' +
                '<td><div wj-part="div-margins-right"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-top"></td>' +
                '<td><div wj-part="div-margins-top"></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td wj-part="g-bottom"></td>' +
                '<td><div wj-part="div-margins-bottom"></div></td>' +
                '</tr>' +
                '</table>' +
                '</fieldset>' +
                '</div>' +
                '</div>';
            return _PageSetupEditor;
        }(wijmo.Control));
        viewer._PageSetupEditor = _PageSetupEditor;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _PageSetupDialog = /** @class */ (function (_super) {
            __extends(_PageSetupDialog, _super);
            function _PageSetupDialog(ele) {
                var _this = _super.call(this, ele) || this;
                _this.applied = new wijmo.Event();
                var tpl;
                _this.modal = true;
                _this.hideTrigger = wijmo.input.PopupTrigger.None;
                // instantiate and apply template
                tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content', tpl, {
                    _gHeader: 'g-header',
                    _pageSetupEditorElement: 'pagesetup-editor',
                    _btnApply: 'btn-apply',
                    _btnCancel: 'btn-cancel',
                    _btnClose: 'a-close'
                });
                _this._pageSetupEditor = new viewer._PageSetupEditor(_this._pageSetupEditorElement);
                _this._globalize();
                _this._addEvents();
                return _this;
            }
            Object.defineProperty(_PageSetupDialog.prototype, "pageSettings", {
                get: function () {
                    return this._pageSetupEditor.pageSettings;
                },
                enumerable: true,
                configurable: true
            });
            _PageSetupDialog.prototype._globalize = function () {
                var g = wijmo.culture.Viewer;
                this._gHeader.textContent = g.pageSetup;
                this._btnApply.textContent = g.ok;
                this._btnCancel.textContent = g.cancel;
            };
            _PageSetupDialog.prototype._addEvents = function () {
                var self = this;
                viewer._addEvent(self._btnClose, 'click', function () {
                    self.hide();
                });
                viewer._addEvent(self._btnCancel, 'click', function () {
                    self.hide();
                });
                viewer._addEvent(self._btnApply, 'click', function () {
                    self._apply();
                    self.hide();
                });
            };
            _PageSetupDialog.prototype._apply = function () {
                this.onApplied();
            };
            _PageSetupDialog.prototype.onApplied = function () {
                this.applied.raise(this);
            };
            _PageSetupDialog.prototype.showWithValue = function (pageSettings) {
                this._pageSetupEditor.pageSettings = pageSettings;
                _super.prototype.show.call(this);
            };
            _PageSetupDialog.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._globalize();
                    this._pageSetupEditor.refresh();
                }
            };
            _PageSetupDialog.controlTemplate = '<div>' +
                // header
                '<div wj-part="g-header" class="wj-dialog-header">' +
                '<a class="wj-hide" wj-part="a-close" style="float:right;outline:none;text-decoration:none;padding:0px 6px" href="" tabindex="-1" draggable="false">&times;</a>' +
                '</div>' +
                // body
                '<div style="padding:12px;">' +
                '<div wj-part="pagesetup-editor"></div>' +
                '</div>' +
                // footer
                '<div class="wj-dialog-footer">' +
                '<a wj-part="btn-apply" class="wj-hide wj-btn" tabindex="-1"></a>' +
                '&nbsp;&nbsp;' +
                '<a wj-part="btn-cancel" class="wj-hide wj-btn" tabindex="-1"></a>' +
                '</div>' +
                '</div>';
            return _PageSetupDialog;
        }(wijmo.input.Popup));
        viewer._PageSetupDialog = _PageSetupDialog;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _MouseTool = /** @class */ (function (_super) {
            __extends(_MouseTool, _super);
            function _MouseTool(element, viewPanelContainer, pageView, stopOnClientOut, css, activeCss, visibleCss) {
                var _this = _super.call(this, element) || this;
                _this._stopOnClientOut = stopOnClientOut;
                _this._css = css;
                _this._activeCss = activeCss;
                _this._visibleCss = visibleCss;
                _this._pageView = pageView;
                _this._viewPanelContainer = viewPanelContainer;
                _this._initElement();
                _this._bindEvents();
                return _this;
            }
            _MouseTool.prototype.activate = function () {
                if (!this._isActive) {
                    this._isActive = true;
                    wijmo.addClass(this._viewPanelContainer, this._activeCss);
                }
            };
            _MouseTool.prototype.deactivate = function () {
                if (this._isActive) {
                    this._isActive = false;
                    wijmo.removeClass(this._viewPanelContainer, this._activeCss);
                }
            };
            _MouseTool.prototype.reset = function () {
                this._innerStop(null); // cancel action
            };
            Object.defineProperty(_MouseTool.prototype, "isActive", {
                get: function () {
                    return this._isActive;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MouseTool.prototype, "startPnt", {
                get: function () {
                    return this._startPnt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MouseTool.prototype, "pageView", {
                get: function () {
                    return this._pageView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_MouseTool.prototype, "viewPanelContainer", {
                get: function () {
                    return this._viewPanelContainer;
                },
                enumerable: true,
                configurable: true
            });
            _MouseTool.prototype._initElement = function () {
                this.applyTemplate(this._css, this.getTemplate(), this._getTemplateParts());
                this._viewPanelContainer.appendChild(this.hostElement);
            };
            _MouseTool.prototype._innerStop = function (pnt) {
                try {
                    this._stop(pnt);
                }
                finally {
                    this._isStarted = false;
                    this._startPnt = null;
                }
            };
            _MouseTool.prototype._getTemplateParts = function () {
                return null;
            };
            _MouseTool.prototype._onMouseDown = function (e) {
                var pnt = this._toClientPoint(e), ht = this._testPageWorkingAreaHit(pnt);
                if (ht && this.pageView.isPageContentLoaded(ht.pageIndex)) {
                    if (typeof (window.getSelection) != 'undefined') {
                        getSelection().removeAllRanges(); //#277972 case 2 (Chrome)
                    }
                    this._isStarted = true;
                    this._startPnt = pnt;
                    this._start(ht);
                }
            };
            _MouseTool.prototype._onMouseMove = function (e) {
                if (!this._isStarted) {
                    return;
                }
                var pnt = this._toClientPoint(e), ht = this._testPageWorkingAreaHit(pnt);
                if (ht && this.pageView.isPageContentLoaded(ht.pageIndex)) {
                    this._move(pnt, ht);
                }
                else {
                    if (this._stopOnClientOut) {
                        this._stop(pnt);
                    }
                }
            };
            _MouseTool.prototype._onMouseUp = function (e) {
                if (!this._isStarted) {
                    return;
                }
                this._innerStop(this._toClientPoint(e));
            };
            _MouseTool.prototype._start = function (ht) {
                wijmo.addClass(this.hostElement, this._visibleCss);
            };
            _MouseTool.prototype._move = function (pnt, ht) {
            };
            _MouseTool.prototype._stop = function (pnt) {
                wijmo.removeClass(this.hostElement, this._visibleCss);
            };
            _MouseTool.prototype._bindEvents = function () {
                var _this = this;
                this.addEventListener(this._viewPanelContainer, 'mousedown', function (e) {
                    if (_this._isActive) {
                        _this._onMouseDown(e);
                    }
                });
                this.addEventListener(this._viewPanelContainer, 'mousemove', function (e) {
                    if (_this._isActive) {
                        _this._onMouseMove(e);
                    }
                });
                this.addEventListener(document, 'mouseup', function (e) {
                    if (_this._isActive) {
                        _this._onMouseUp(e);
                    }
                });
            };
            _MouseTool.prototype._toClientPoint = function (e) {
                var clientRect = this._viewPanelContainer.getBoundingClientRect();
                return new wijmo.Point(e.clientX - clientRect.left, e.clientY - clientRect.top);
            };
            _MouseTool.prototype._testPageWorkingAreaHit = function (pnt) {
                var hitTest = this._pageView.hitTest(pnt.x, pnt.y);
                return hitTest && hitTest.hitWorkingArea ? hitTest : null;
            };
            return _MouseTool;
        }(wijmo.Control));
        viewer._MouseTool = _MouseTool;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _Rubberband = /** @class */ (function (_super) {
            __extends(_Rubberband, _super);
            function _Rubberband(element, viewPanelContainer, pageView) {
                var _this = _super.call(this, element, viewPanelContainer, pageView, false, 'wj-rubberband', 'rubberband-actived', 'show') || this;
                _this.applied = new wijmo.Event();
                return _this;
            }
            _Rubberband.prototype._start = function (ht) {
                _super.prototype._start.call(this, ht);
                this.hostElement.style.left = this.startPnt.x + 'px';
                this.hostElement.style.top = this.startPnt.y + 'px';
            };
            _Rubberband.prototype._move = function (pnt, ht) {
                if (this.startPnt) {
                    var clientRect = this.viewPanelContainer.getBoundingClientRect();
                    this.hostElement.style.width = pnt.x - this.startPnt.x + 'px';
                    this.hostElement.style.height = pnt.y - this.startPnt.y + 'px';
                }
            };
            _Rubberband.prototype._stop = function (pnt) {
                if (pnt) { // if the action was not cancelled
                    var bandRect = this.hostElement.getBoundingClientRect();
                    // rubberband should have at least 5x5 area.
                    if (bandRect.width > 5 && bandRect.height > 5) {
                        this._onApplied(new viewer._RubberbandOnAppliedEventArgs(new wijmo.Rect(this.startPnt.x, this.startPnt.y, bandRect.width, bandRect.height)));
                    }
                }
                this.hostElement.style.width = '0px';
                this.hostElement.style.height = '0px';
                _super.prototype._stop.call(this, pnt);
            };
            _Rubberband.prototype._onApplied = function (e) {
                this.applied.raise(this, e);
            };
            return _Rubberband;
        }(viewer._MouseTool));
        viewer._Rubberband = _Rubberband;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _Magnifier = /** @class */ (function (_super) {
            __extends(_Magnifier, _super);
            function _Magnifier(element, viewPanelContainer, pageView) {
                var _this = _super.call(this, element, viewPanelContainer, pageView, true, 'wj-magnifier', 'magnifier-actived', 'show') || this;
                _this._Magnification = 2;
                _this._currentPageIndex = -1;
                return _this;
            }
            _Magnifier.prototype.deactivate = function () {
                _super.prototype.deactivate.call(this);
                this._currentPageIndex = -1;
            };
            _Magnifier.prototype.reset = function () {
                _super.prototype.reset.call(this);
                this._currentPageIndex = -1;
            };
            _Magnifier.prototype._getTemplateParts = function () {
                return {
                    _viewPageDiv: 'view-page-div'
                };
            };
            _Magnifier.prototype._bindEvents = function () {
                var _this = this;
                _super.prototype._bindEvents.call(this);
                var updateViewPage = function () {
                    if (_this._currentPageIndex < 0) {
                        return;
                    }
                    var currentPage = _this.pageView.pages[_this._currentPageIndex], rotatedSize = viewer._getRotatedSize(currentPage.size, currentPage.rotateAngle), svg = _this._viewPageDiv.querySelector('svg');
                    _this._viewPageDiv.style.height = rotatedSize.height.valueInPixel * _this.pageView.zoomFactor * _this._Magnification + 'px';
                    _this._viewPageDiv.style.width = rotatedSize.width.valueInPixel * _this.pageView.zoomFactor * _this._Magnification + 'px';
                    svg.setAttribute('width', _this._viewPageDiv.style.width);
                    svg.setAttribute('height', _this._viewPageDiv.style.height);
                    viewer._transformSvg(svg, currentPage.size.width.valueInPixel, currentPage.size.height.valueInPixel, _this._Magnification * _this.pageView.zoomFactor, currentPage.rotateAngle);
                };
                this.pageView.zoomFactorChanged.addHandler(function () {
                    updateViewPage();
                });
                this.pageView.rotateAngleChanged.addHandler(function () {
                    updateViewPage();
                });
            };
            _Magnifier.prototype._start = function (ht) {
                _super.prototype._start.call(this, ht);
                this._showMagnifer(this.startPnt, ht);
            };
            _Magnifier.prototype._move = function (pnt, ht) {
                this._showMagnifer(pnt, ht);
            };
            _Magnifier.prototype._showMagnifer = function (pnt, ht) {
                var magnifierRect = this.hostElement.getBoundingClientRect(), position = viewer._getPositionByHitTestInfo(ht);
                this.hostElement.style.left = (pnt.x - magnifierRect.width / 2) + 'px';
                this.hostElement.style.top = (pnt.y - magnifierRect.height / 2) + 'px';
                this._fillPage(position);
                this._showHitPosition(position);
            };
            _Magnifier.prototype._fillPage = function (hitPosition) {
                var _this = this;
                if (hitPosition.pageIndex === this._currentPageIndex) {
                    return;
                }
                this._currentPageIndex = hitPosition.pageIndex;
                this.pageView.pages[this._currentPageIndex].getContent().then(function (pageContent) {
                    var clone = pageContent.cloneNode(true);
                    _this._viewPageDiv.innerHTML = '';
                    _this._viewPageDiv.appendChild(clone);
                    clone.setAttribute('width', new viewer._Unit(clone.getAttribute('width')).valueInPixel * _this._Magnification + 'px');
                    clone.setAttribute('height', new viewer._Unit(clone.getAttribute('height')).valueInPixel * _this._Magnification + 'px');
                    var size = _this.pageView.pages[_this._currentPageIndex].size;
                    viewer._transformSvg(clone, size.width.valueInPixel, size.height.valueInPixel, _this._Magnification * _this.pageView.zoomFactor, _this.pageView.pages[_this._currentPageIndex].rotateAngle);
                    _this._viewPageDiv.style.width = clone.getAttribute('width');
                    _this._viewPageDiv.style.height = clone.getAttribute('height');
                });
            };
            _Magnifier.prototype._showHitPosition = function (hitPosition) {
                var magnifierRect = this.hostElement.getBoundingClientRect(), currentPage = this.pageView.pages[this._currentPageIndex], transformedBound = viewer._getTransformedPosition(hitPosition.pageBounds, currentPage.size, currentPage.rotateAngle, this.pageView.zoomFactor);
                this._viewPageDiv.style.left = (-transformedBound.x * this._Magnification + magnifierRect.width / 2) + 'px';
                this._viewPageDiv.style.top = (-transformedBound.y * this._Magnification + magnifierRect.height / 2) + 'px';
            };
            _Magnifier.controlTemplate = '<div wj-part="view-page-div" class="wj-view-page"></div>';
            return _Magnifier;
        }(viewer._MouseTool));
        viewer._Magnifier = _Magnifier;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Base class for all the viewer controls.
         */
        var ViewerBase = /** @class */ (function (_super) {
            __extends(ViewerBase, _super);
            /**
             * Initializes a new instance of the {@link ViewerBase} class.
             *
             * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function ViewerBase(element, options) {
                var _this = _super.call(this, element, options, true) || this;
                _this._pages = [];
                _this._pageIndex = 0;
                _this._mouseMode = viewer.MouseMode.SelectTool;
                _this._viewMode = viewer.ViewMode.Single;
                _this._needBind = false;
                _this._historyManager = new viewer._HistoryManager();
                _this._fullScreen = false;
                _this._miniToolbarPinnedTimer = null;
                _this._autoHeightCalculated = false;
                _this._searchManager = new viewer._SearchManager();
                _this._thresholdWidth = 767;
                _this._historyMoving = false;
                _this._prohibitAddHistory = false; // for fix 435431
                _this._initialScroll = false; // for fix 441259
                _this._pageMoving = false; // for fix 457950
                // Occurs after the document source is changed.
                _this._documentSourceChanged = new wijmo.Event();
                /**
                 * Occurs after the page index is changed.
                 */
                _this.pageIndexChanged = new wijmo.Event();
                /**
                 * Occurs after the view mode is changed.
                 */
                _this.viewModeChanged = new wijmo.Event();
                /**
                 * Occurs after the mouse mode is changed.
                 */
                _this.mouseModeChanged = new wijmo.Event();
                /**
                 * Occurs after the full screen mode is changed.
                 */
                _this.fullScreenChanged = new wijmo.Event();
                /**
                 * Occurs after the zoom factor is changed.
                 */
                _this.zoomFactorChanged = new wijmo.Event();
                /**
                 * Occurs after the zoom mode is changed.
                 */
                _this.zoomModeChanged = new wijmo.Event();
                /**
                 * Occurs when querying the request data sent to the service before loading the document.
                 */
                _this.queryLoadingData = new wijmo.Event();
                /**
                 * Occurs before every request sent to the server.
                 *
                 * The event allows you to modify request options like URL, headers,
                 * data and even the request method, before sending them to the server.
                 * The event passes an argument of the {@link RequestEventArgs} type,
                 * whose properties have the same meaning and structure as the
                 * parameters of the {@link wijmo.httpRequest} method, and can be
                 * modified to update the request attributes.
                 *
                 * For example, you can put an authentication token to the 'Authorization'
                 * header:
                 *
                 * <pre>viewer.beforeSendRequest.addHandler((s, e) =&gt; {
                 *     e.settings.requestHeaders.Authorization = 'Bearer ' + appAuthService.getToken();
                 * });
                 * </pre>
                 *
                 * If the URL is used to induce an HTTP request that is executed by the browser
                 * automatically (for example, if the URL is used as a parameter to the
                 * window.open() function, or as a HTML link), then the e.settings argument
                 * will be null.
                 */
                _this.beforeSendRequest = new wijmo.Event();
                /**
                 * Occurs when the next page has been loaded from the server, and its SVG has been rendered.
                 */
                _this.pageLoaded = new wijmo.Event();
                _this._viewerActionStatusChanged = new wijmo.Event();
                _this._documentEventKey = new Date().getTime().toString();
                _this._init(options);
                return _this;
            }
            ViewerBase.prototype._getProductInfo = function () {
                return 'QNI5,ViewerBase';
            };
            Object.defineProperty(ViewerBase.prototype, "serviceUrl", {
                /**
                 * Gets or sets the address of C1 Web API service.
                 *
                 * For example, "http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/report".
                 */
                get: function () {
                    return this._serviceUrl;
                },
                set: function (value) {
                    if (value != this._serviceUrl) {
                        this._serviceUrl = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "filePath", {
                /**
                 * Gets or sets the full path to the document on the server.
                 *
                 * The path starts with the key of a provider which is registered at server for locating specified document.
                 */
                get: function () {
                    return this._filePath;
                },
                set: function (value) {
                    if (value != this._filePath) {
                        this._filePath = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "requestHeaders", {
                /**
                 * Gets or sets an object containing request headers to be used when sending
                 * or requesting data.
                 *
                 * The most typical use for this property is in scenarios where authentication
                 * is required. For example:
                 *
                 * <pre>viewer.requestHeaders = {
                 *     Authorization: 'Bearer ' + appAuthService.getToken();
                 * };</pre>
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
            Object.defineProperty(ViewerBase.prototype, "thresholdWidth", {
                /**
                 * Gets or sets the threshold to switch between mobile and PC template.
                 *
                 * Default value is 767px.  If width of control is smaller than thresholdWidth, mobile template will
                 * be applied.  If width of control is equal or greater than thresholdWidth, PC template
                 * will be applied.
                 * If thresholdWidth is set to 0, then only PC template is applied
                 * and if it's set to a large number e.g. 9999, then only mobile template is applied.
                 */
                get: function () {
                    return this._thresholdWidth;
                },
                set: function (value) {
                    if (value != this._thresholdWidth) {
                        this._thresholdWidth = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "_innerPaginated", {
                // Gets or sets a value indicating whether the content should be represented as a set of fixed sized pages.
                // The default value is null, means using the default value from document source.
                get: function () {
                    if (this._documentSource && !this._needBind) {
                        return this._documentSource.paginated;
                    }
                    else {
                        return this._paginated;
                    }
                },
                set: function (value) {
                    if (this._documentSource && !this._needBind) {
                        this._setPaginated(value);
                    }
                    else {
                        this._paginated = value == null ? null : wijmo.asBoolean(value);
                    }
                    this._setViewerAction(viewer._ViewerActionType.TogglePaginated, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "isDisabled", {
                // override to handle inner controls (TFS 424599)
                set: function (value) {
                    value = wijmo.asBoolean(value, true);
                    if (value != this.isDisabled) {
                        var host = this._e;
                        if (host) {
                            wijmo.enable(host, !value);
                            // set tabIndex to -1 if the control is disabled
                            // or if it contains input elements (so back-tab works properly: TFS 387283)
                            host.tabIndex = this.isDisabled || host.querySelector('input')
                                ? -1
                                : this._orgTabIndex;
                            // also handle inner elements
                            var children = host.querySelectorAll('input, [tabindex], .wj-pageview');
                            for (var i = 0; i < children.length; i++) {
                                children[i].tabIndex = value ? -1 : this._orgTabIndex;
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype.invalidate = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.invalidate.call(this, fullUpdate);
                // update Export format descriptions in accordance to culture (TFS 467437)
                ViewerBase._exportItems = null;
                this._updateExportTab();
            };
            /**
             * Reloads the document.
             *
             * This is useful for force reloading and rerendering the document.
             */
            ViewerBase.prototype.reload = function () {
                this._needBindDocumentSource();
                this.invalidate();
            };
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Whether to update the control layout as well as the content.
             */
            ViewerBase.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this._needBind) {
                    this._setDocumentSource(this._getSource());
                    this._needBind = false;
                }
                if (fullUpdate) {
                    var toolbar = wijmo.Control.getControl(this._toolbar);
                    if (toolbar) {
                        toolbar.refresh();
                    }
                    var miniToolbar = wijmo.Control.getControl(this._miniToolbar);
                    if (miniToolbar) {
                        miniToolbar.refresh();
                    }
                    var mobileToolbar = wijmo.Control.getControl(this._mobileToolbar);
                    if (mobileToolbar) {
                        mobileToolbar.refresh();
                    }
                    var zoomBar = wijmo.Control.getControl(this._zoomBar);
                    if (zoomBar) {
                        zoomBar.refresh();
                    }
                    var searchBar = wijmo.Control.getControl(this._searchBar);
                    if (searchBar) {
                        searchBar.refresh();
                    }
                    if (this._hamburgerMenu) {
                        this._hamburgerMenu.refresh();
                    }
                    if (this._viewMenu) {
                        this._viewMenu.refresh();
                    }
                    if (this._searchOptionsMenu) {
                        this._searchOptionsMenu.refresh();
                    }
                    ViewerBase._exportItems = null;
                    this._updateExportTab(true);
                    this._globalize();
                    this._updateLayout();
                }
                this._resetMiniToolbarPosition();
                this._resetToolbarWidth();
                this._resetViewPanelContainerWidth();
                this._autoHeightCalculated = false;
            };
            ViewerBase.prototype._updateLayout = function () {
                this._switchTemplate(this._isMobileTemplate());
            };
            ViewerBase.prototype._switchTemplate = function (mobile) {
                var outer = this.hostElement.querySelector('.wj-viewer-outer'), mobileCss = 'mobile', sideTabs = wijmo.Control.getControl(this._sidePanel), pageSetupPage = sideTabs.getTabPage(this._pageSetupPageId);
                if (mobile) {
                    wijmo.addClass(outer, mobileCss);
                    sideTabs.show(pageSetupPage);
                }
                else {
                    wijmo.removeClass(outer, mobileCss);
                    sideTabs.hide(pageSetupPage);
                }
            };
            // Creates a _DocumentSource object and returns it.
            ViewerBase.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                return new viewer._DocumentSource({
                    serviceUrl: this._serviceUrl,
                    filePath: this._filePath
                }, this);
            };
            ViewerBase.prototype._needBindDocumentSource = function () {
                this._needBind = true;
            };
            ViewerBase.prototype._supportsPageSettingActions = function () {
                return false;
            };
            ViewerBase.prototype._isMobileTemplate = function () {
                return this.thresholdWidth > this.hostElement.getBoundingClientRect().width;
            };
            ViewerBase.prototype._init = function (options) {
                var _this = this;
                this._createChildren();
                this._autoCalculateHeight();
                this._resetToolbarWidth();
                this._resetViewPanelContainerWidth();
                this._bindEvents();
                this._initTools();
                this.deferUpdate(function () {
                    _this.initialize(options);
                });
            };
            ViewerBase.prototype._initTools = function () {
                var _this = this;
                this._rubberband = new viewer._Rubberband(document.createElement('div'), this._viewpanelContainer, this._pageView);
                this._rubberband.applied.addHandler(function (sender, args) {
                    var bandRect = args.rect, hitTestInfo = _this._pageView.hitTest(bandRect.left, bandRect.top), containerRect = _this._viewpanelContainer.getBoundingClientRect();
                    if (bandRect.width > bandRect.height) {
                        _this._pageView.zoomFactor *= containerRect.width / bandRect.width;
                    }
                    else {
                        _this._pageView.zoomFactor *= containerRect.height / bandRect.height;
                    }
                    _this._pageView.moveToPosition(viewer._getPositionByHitTestInfo(hitTestInfo));
                });
                this._magnifier = new viewer._Magnifier(document.createElement('div'), this._viewpanelContainer, this._pageView);
            };
            ViewerBase.prototype._globalize = function () {
                var g = wijmo.culture.Viewer;
                this._gSearchTitle.textContent = g.search;
                this._gMatchCase.innerHTML = '&nbsp;&nbsp;&nbsp;' + g.matchCase;
                this._gWholeWord.innerHTML = '&nbsp;&nbsp;&nbsp;' + g.wholeWord;
                this._gSearchResults.textContent = g.searchResults;
                this._gThumbnailsTitle.textContent = g.thumbnails;
                this._gOutlinesTitle.textContent = g.outlines;
                this._gPageSetupTitle.textContent = g.pageSetup;
                this._gPageSetupApplyBtn.textContent = g.ok;
                this._gExportsPageTitle.textContent = g.exports;
                this._gExportsPageApplyBtn.textContent = g.exportOk;
                this._gExportFormatTitle.textContent = g.exportFormat;
            };
            ViewerBase.prototype._autoCalculateHeight = function () {
                if (!this._shouldAutoHeight()) {
                    return;
                }
                var viewpanelContainerStyleHeight = this._viewpanelContainer.style.height;
                this._viewpanelContainer.style.height = '100%'; // #291181 'auto';
                this._viewerContainer.style.height =
                    Math.max(this._viewpanelContainer.getBoundingClientRect().height, ViewerBase._viewpanelContainerMinHeight) + 'px';
                this._viewpanelContainer.style.height = viewpanelContainerStyleHeight;
            };
            ViewerBase.prototype._bindEvents = function () {
                var _this = this;
                viewer._addEvent(window, 'unload', function () {
                    if (_this._documentSource) {
                        _this._documentSource.dispose();
                    }
                });
                viewer._addEvent(document, 'mousemove', function (e) {
                    if (_this.fullScreen && _this._miniToolbar) {
                        var miniToolbarVisible = _this._checkMiniToolbarVisible(e);
                        if (_this._miniToolbarPinnedTimer != null && miniToolbarVisible) {
                            clearTimeout(_this._miniToolbarPinnedTimer);
                            _this._miniToolbarPinnedTimer = null;
                            _this._showMiniToolbar(miniToolbarVisible);
                        }
                        else if (_this._miniToolbarPinnedTimer == null) {
                            _this._showMiniToolbar(miniToolbarVisible);
                        }
                    }
                });
                viewer._addEvent(document, 'keydown', function (e) {
                    if (e.keyCode === wijmo.Key.Escape) {
                        _this.fullScreen = false;
                    }
                });
                this._historyManager.statusChanged.addHandler(this._onHistoryManagerStatusUpdated, this);
                this._onHistoryManagerStatusUpdated();
                this._pageView.pageIndexChanged.addHandler(function () {
                    if (_this._initialScroll) {
                        _this._initialScroll = false;
                    }
                    else {
                        _this._addHistory(false, true);
                    }
                    _this._updatePageIndex(_this._pageView.pageIndex);
                });
                this._pageView.zoomFactorChanged.addHandler(function (sender, e) {
                    if (_this.zoomMode === viewer.ZoomMode.Custom) {
                        _this._addHistory(false, true, { zoomFactor: e.oldValue });
                    }
                    _this.onZoomFactorChanged(e);
                });
                this._pageView.zoomModeChanged.addHandler(function (sender, e) {
                    _this._addHistory(false, true, { zoomMode: e.oldValue });
                    _this.onZoomModeChanged(e);
                });
                this.viewModeChanged.addHandler(function (sender, e) {
                    _this._addHistory(false, true, {
                        viewMode: e.oldValue,
                        zoomMode: _this.zoomMode,
                        zoomFactor: _this.zoomFactor,
                    }, true);
                });
                var positionChangedTimeoutId = null;
                var initialPage = null;
                this._pageView.positionChanged.addHandler(function () {
                    if (!_this._pageMoving) {
                        if (!positionChangedTimeoutId) {
                            initialPage = _this._pageIndex;
                        }
                        clearTimeout(positionChangedTimeoutId);
                        positionChangedTimeoutId = setTimeout(function () {
                            if (initialPage !== _this._pageIndex) { // page has been changed
                                _this._addHistory(false, true);
                            }
                            else {
                                _this._updateHistoryCurrent(true);
                            }
                            positionChangedTimeoutId = null;
                        }, ViewerBase._historyTimeout);
                    }
                });
                this._pageView.pageLoaded.addHandler(function (sender, e) {
                    _this.onPageLoaded(e);
                });
            };
            ViewerBase.prototype._checkMiniToolbarVisible = function (e) {
                var x = e.clientX, y = e.clientY;
                var bound = this._miniToolbar.getBoundingClientRect(), visibleOffset = 60, visibleLeft = bound.left - visibleOffset, visibleRight = bound.right + visibleOffset, visibleTop = bound.top - visibleOffset, visibleBottom = bound.bottom + visibleOffset;
                return x >= visibleLeft && x <= visibleRight &&
                    y >= visibleTop && y <= visibleBottom;
            };
            ViewerBase.prototype._showMiniToolbar = function (visible) {
                var opacity = parseFloat(getComputedStyle(this._miniToolbar, '')['opacity']), step = 0.01, t, toolbar = this._miniToolbar;
                if (visible) {
                    t = setInterval(function () {
                        if (opacity >= 0.8) {
                            window.clearInterval(t);
                            return;
                        }
                        opacity += step;
                        toolbar.style.opacity = opacity.toString();
                    }, 1);
                }
                else {
                    t = setInterval(function () {
                        if (opacity < 0) {
                            window.clearInterval(t);
                            return;
                        }
                        opacity -= step;
                        toolbar.style.opacity = opacity.toString();
                    }, 1);
                }
            };
            ViewerBase.prototype._goToBookmark = function (action) {
                var _this = this;
                if (!this._documentSource || !action.data) {
                    return;
                }
                this._documentSource.getBookmark(action.data).then(function (bookmark) {
                    if (bookmark) {
                        _this._scrollToPosition(bookmark, true);
                    }
                });
            };
            ViewerBase.prototype._executeCustomAction = function (action) {
                var _this = this;
                if (!this._documentSource || !action.data) {
                    return;
                }
                // remember the current position
                this._initialPosition = {
                    pageIndex: this._pageIndex,
                    pageBounds: { x: 0, y: 0, width: 0, height: 0 }
                };
                this._resetDocument();
                this._showViewPanelMessage();
                this._setDocumentRendering();
                var documentSource = this._documentSource;
                this._documentSource.executeCustomAction(action).then(function (position) {
                    // scroll to the new position after custom action is performed.
                    _this._initialPosition = position || _this._initialPosition;
                    // update the status to force updating view.
                    _this._getStatusUtilCompleted(documentSource);
                }).catch(function (reason) {
                    _this._showViewPanelErrorMessage(viewer._getErrorMessage(reason));
                });
            };
            ViewerBase.prototype._getStatusUtilCompleted = function (documentSource) {
                var _this = this;
                if (!documentSource || documentSource.isLoadCompleted || documentSource.isDisposed) {
                    return;
                }
                documentSource.getStatus().then(function (v) {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    setTimeout(function () { return _this._getStatusUtilCompleted(documentSource); }, documentSource._innerService.getPingTimeout());
                }).catch(function (error) {
                    _this._showViewPanelErrorMessage(error);
                });
            };
            ViewerBase.prototype._initChildren = function () {
                this._initPageView();
                this._initToolbar();
                this._initSidePanel();
                this._initSplitter();
                this._initFooter();
                this._initSearchBar();
                this._initMiniToolbar();
            };
            ViewerBase.prototype._initSearchBar = function () {
                new viewer._SearchBar(this._searchBar, this);
                this._showSearchBar(false);
            };
            ViewerBase.prototype._showSearchBar = function (show) {
                var outer = this.hostElement.querySelector('.wj-viewer-outer'), withSearchBarCss = 'with-searchbar';
                if (show) {
                    wijmo.removeClass(this._searchBar, viewer._hiddenCss);
                    wijmo.addClass(outer, withSearchBarCss);
                }
                else {
                    wijmo.addClass(this._searchBar, viewer._hiddenCss);
                    wijmo.removeClass(outer, withSearchBarCss);
                }
            };
            ViewerBase.prototype._initFooter = function () {
                var _this = this;
                new viewer._ViewerZoomBar(this._zoomBar, this);
                viewer._addEvent(this._footer.querySelector('.wj-close'), 'click', function () {
                    _this._showFooter(false);
                });
            };
            ViewerBase.prototype._showFooter = function (show) {
                var outer = this.hostElement.querySelector('.wj-viewer-outer'), withFooterCss = 'with-footer';
                if (show) {
                    wijmo.removeClass(this._footer, viewer._hiddenCss);
                    wijmo.addClass(outer, withFooterCss);
                }
                else {
                    wijmo.addClass(this._footer, viewer._hiddenCss);
                    wijmo.removeClass(outer, withFooterCss);
                }
                this._pageView.refresh();
            };
            ViewerBase.prototype._createChildren = function () {
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-viewer wj-control', tpl, {
                    _viewpanelContainer: 'viewpanel-container',
                    _toolbar: 'toolbar',
                    _mobileToolbar: 'mobile-toolbar',
                    _miniToolbar: 'mini-toolbar',
                    _leftPanel: 'viewer-left-panel',
                    _sidePanel: 'side-panel',
                    _viewerContainer: 'viewer-container',
                    _splitter: 'splitter',
                    _footer: 'viewer-footer',
                    _zoomBar: 'zoom-bar',
                    _searchBar: 'search-bar'
                });
                this._initChildren();
            };
            ViewerBase.prototype._initPageView = function () {
                var pageView = new viewer._CompositePageView(this._viewpanelContainer);
                pageView.viewMode = this.viewMode;
            };
            Object.defineProperty(ViewerBase.prototype, "_pageView", {
                get: function () {
                    return wijmo.Control.getControl(this._viewpanelContainer);
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype._initSplitter = function () {
                var _this = this;
                viewer._addEvent(this._splitter, 'click', function () { return _this._toggleSplitter(); });
            };
            ViewerBase.prototype._toggleSplitter = function (collapsed) {
                var leftCss = 'wj-glyph-left', rightCss = 'wj-glyph-right', arrow = this._splitter.querySelector('span'), tabs = wijmo.Control.getControl(this._sidePanel);
                if (collapsed === true) {
                    if (wijmo.hasClass(arrow, rightCss)) {
                        return;
                    }
                }
                else if (collapsed === false) {
                    if (wijmo.hasClass(arrow, leftCss)) {
                        return;
                    }
                }
                else {
                    collapsed = wijmo.hasClass(arrow, leftCss);
                }
                if (!collapsed) {
                    if (tabs.visibleTabPagesCount === 0) {
                        return;
                    }
                    arrow.className = leftCss;
                    tabs.expand();
                }
                else {
                    tabs.collapse();
                    arrow.className = rightCss;
                }
                this._resetViewPanelContainerWidth();
            };
            ViewerBase.prototype._resetMiniToolbarPosition = function () {
                if (!this._miniToolbar) {
                    return;
                }
                var containerWidth = this.hostElement.getBoundingClientRect().width, selfWidth = this._miniToolbar.getBoundingClientRect().width;
                this._miniToolbar.style.left = (containerWidth - selfWidth) / 2 + 'px';
            };
            ViewerBase.prototype._resetToolbarWidth = function () {
                var toolbar = wijmo.Control.getControl(this._toolbar);
                toolbar.resetWidth();
            };
            ViewerBase.prototype._resetViewPanelContainerWidth = function () {
                if (!this._isMobileTemplate() && this.hostElement.getBoundingClientRect().width <= ViewerBase._narrowWidthThreshold) {
                    wijmo.addClass(this.hostElement, ViewerBase._narrowCss);
                }
                else {
                    wijmo.removeClass(this.hostElement, ViewerBase._narrowCss);
                }
                var splitterWidth = this._splitter ? this._splitter.getBoundingClientRect().width : 0, leftPanelWidth = this._leftPanel ? this._leftPanel.getBoundingClientRect().width : 0;
                this._viewpanelContainer.style.width = this._viewerContainer.getBoundingClientRect().width -
                    splitterWidth - leftPanelWidth + 'px';
                this._pageView.invalidate();
            };
            ViewerBase.prototype._shouldAutoHeight = function () {
                return (this.hostElement.style.height === '100%' || this.hostElement.style.height === 'auto') && !this.fullScreen;
            };
            ViewerBase.prototype._initSidePanel = function () {
                var _this = this;
                var sideTabs = new viewer._SideTabs(this._sidePanel);
                sideTabs.collapse();
                sideTabs.collapsed.addHandler(function () {
                    _this._toggleSplitter(true);
                });
                sideTabs.expanded.addHandler(function () {
                    _this._toggleSplitter(false);
                    var splitterWidth = _this._splitter ? _this._splitter.getBoundingClientRect().width : 0, sidePanelAndSplitterWidth = _this._sidePanel.getBoundingClientRect().width + splitterWidth;
                    if (sidePanelAndSplitterWidth > _this._viewerContainer.getBoundingClientRect().width) {
                        wijmo.addClass(_this._sidePanel, "collapsed");
                    }
                });
                sideTabs.tabPageVisibilityChanged.addHandler(function (sender, e) {
                    if ((!e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 1)
                        || (e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 0)) {
                        _this._resetViewPanelContainerWidth();
                    }
                });
                this._initSidePanelThumbnails();
                this._initSidePanelOutlines();
                this._initSidePanelSearch();
                this._initSidePanelExports();
                this._initSidePanelPageSetup();
            };
            ViewerBase.prototype._clearPreHightLights = function () {
                this._pages.forEach(function (page) {
                    var preHighlights;
                    if (page.content) {
                        preHighlights = page.content.querySelectorAll('.highlight');
                        for (var i = 0; i < preHighlights.length; i++) {
                            preHighlights.item(i).parentNode.removeChild(preHighlights.item(i));
                        }
                    }
                });
            };
            ViewerBase.prototype._highlightPosition = function (pageIndex, boundsList) {
                var _this = this;
                var g, oldPageIndex = this._pageIndex, oldScrollTop = this._pageView.scrollTop, oldScrollLeft = this._pageView.scrollLeft, position = { pageIndex: pageIndex, pageBounds: boundsList.length > 0 ? boundsList[0] : null };
                this._scrollToPosition(position, true).then(function (_) {
                    _this._clearPreHightLights();
                    _this._pages[_this.pageIndex].getContent().then(function (content) {
                        g = content.querySelector('g');
                        for (var i = 0; i < boundsList.length; i++) {
                            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            rect.setAttributeNS(null, 'x', viewer._twipToPixel(boundsList[i].x).toString());
                            rect.setAttributeNS(null, 'y', viewer._twipToPixel(boundsList[i].y).toString());
                            rect.setAttributeNS(null, 'height', viewer._twipToPixel(boundsList[i].height).toString());
                            rect.setAttributeNS(null, 'width', viewer._twipToPixel(boundsList[i].width).toString());
                            rect.setAttributeNS(null, 'class', 'highlight');
                            g.appendChild(rect);
                        }
                    });
                });
            };
            ViewerBase.prototype._scrollToPosition = function (position, addHistory) {
                if (addHistory === true) {
                    this._addHistory(true, false);
                }
                position.pageIndex = position.pageIndex || 0;
                var promise = this._pageView.moveToPosition(position);
                return promise;
            };
            ViewerBase.prototype._initSidePanelSearch = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel), searchPage = sideTabs.addPage(wijmo.culture.Viewer.search, viewer.icons.search);
                this._gSearchTitle = searchPage.outContent.querySelector('.wj-tabtitle');
                var getTabCheckboxes = function (tab) { return tab.outContent.querySelectorAll('input[type="checkbox"]'); };
                var getTabTextInputs = function (tab) { return tab.outContent.querySelectorAll('input[type="text"]'); };
                // set serach options on search tab activation
                sideTabs.tabPageActived.addHandler(function (s) {
                    if (s.activedTabPage === searchPage) {
                        var checkboxes = getTabCheckboxes(searchPage);
                        checkboxes[0].checked = _this._searchManager.matchCase;
                        checkboxes[1].checked = _this._searchManager.wholeWord;
                        getTabTextInputs(searchPage)[0].value = _this._searchManager.text;
                    }
                });
                searchPage.format(function (t) {
                    var settingsHtml = '<div class="wj-searchcontainer">' +
                        '<input class="wj-searchbox" wj-part="search-box" type="text"/>' +
                        '<div class="wj-btn-group">' +
                        '<button class="wj-btn wj-btn-searchpre">' + viewer._createSvgBtn(viewer.icons.searchPrevious).innerHTML + '</button>' +
                        '<button class="wj-btn wj-btn-searchnext">' + viewer._createSvgBtn(viewer.icons.searchNext).innerHTML + '</button>' +
                        '</div>' +
                        '</div>' +
                        '<div class="wj-searchoption">' +
                        '<label><span wj-part="g-matchCase">&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.matchCase + '</span><input type="checkbox" wj-part="match-case" /></label>' +
                        '</div>' +
                        '<div class="wj-searchoption">' +
                        '<label><span wj-part="g-wholeWord">&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.wholeWord + '</span><input type="checkbox" wj-part="whole-word" /></label>' +
                        '</div>' +
                        '<h3 wj-part="g-searchResults" class="wj-searchresult">' + wijmo.culture.Viewer.searchResults + '</h3>', settingsElement = viewer._toDOMs(settingsHtml);
                    _this._gMatchCase = settingsElement.querySelector('[wj-part="g-matchCase"]');
                    _this._gWholeWord = settingsElement.querySelector('[wj-part="g-wholeWord"]');
                    _this._gSearchResults = settingsElement.querySelector('[wj-part="g-searchResults"]');
                    t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
                    var checkboxes = getTabCheckboxes(t);
                    var matchCaseCheckBox = checkboxes[0], wholeWordCheckBox = checkboxes[1], input = getTabTextInputs(t)[0], preBtn = t.outContent.querySelector('.wj-btn-searchpre'), nextBtn = t.outContent.querySelector('.wj-btn-searchnext');
                    wijmo.addClass(t.content.parentElement, 'search-wrapper');
                    wijmo.addClass(t.content, 'wj-searchresultlist');
                    var list = new wijmo.input.ListBox(t.content), isSettingItemsSource = false, highlighting = false;
                    list.formatItem.addHandler(function (sender, e) {
                        var searchItem = e.item, data = e.data, searchPageNumberDiv = document.createElement('div'), searchTextDiv = document.createElement('div');
                        searchItem.innerHTML = '';
                        searchTextDiv.innerHTML = data.nearText;
                        searchTextDiv.className = 'wj-search-text';
                        searchPageNumberDiv.innerHTML = 'Page ' + (data.pageIndex + 1);
                        searchPageNumberDiv.className = 'wj-search-page';
                        wijmo.addClass(searchItem, 'wj-search-item');
                        searchItem.setAttribute('tabIndex', '-1');
                        searchItem.appendChild(searchTextDiv);
                        searchItem.appendChild(searchPageNumberDiv);
                    });
                    list.selectedIndexChanged.addHandler(function () { return _this._searchManager.currentIndex = list.selectedIndex; });
                    var enableInputs = function (enable) {
                        if (enable === void 0) { enable = true; }
                        var inputs = searchPage.outContent.querySelectorAll('input');
                        for (var i = 0; i < inputs.length; i++) {
                            inputs.item(i).disabled = !enable;
                        }
                    };
                    var searchInput = searchPage.outContent.querySelectorAll('input[type=text]')[0];
                    _this._searchManager.searchStarted.addHandler(function () {
                        // update input value if search is being initiated in other places
                        if (searchInput && (searchInput.value !== _this._searchManager.text)) {
                            searchInput.value = _this._searchManager.text;
                        }
                        enableInputs(false);
                    });
                    _this._searchManager.searchCompleted.addHandler(function () {
                        isSettingItemsSource = true;
                        _this._clearPreHightLights();
                        list.itemsSource = _this._searchManager.searchResult;
                        isSettingItemsSource = false;
                        enableInputs(true);
                        _this._updateHistoryCurrent(); // prevent adding of unnecessary history item on search (WJM-20048)
                    });
                    _this._searchManager.currentChanged.addHandler(function () {
                        if (isSettingItemsSource || highlighting) {
                            return;
                        }
                        var result = _this._searchManager.current;
                        if (!result) {
                            return;
                        }
                        highlighting = true;
                        list.selectedIndex = _this._searchManager.currentIndex;
                        _this._highlightPosition(result.pageIndex, result.boundsList);
                        highlighting = false;
                    });
                    _this._searchManager.resultsCleared.addHandler(function () {
                        list.itemsSource = null;
                        _this._clearPreHightLights();
                    });
                    var update = function () {
                        _this._searchManager.clear(); // #310845
                        list.itemsSource = null;
                        matchCaseCheckBox.checked = false;
                        wholeWordCheckBox.checked = false;
                        input.value = '';
                        if (!_this._documentSource || !_this._documentSource.features
                            || (_this._documentSource.paginated && !_this._documentSource.features.textSearchInPaginatedMode)) {
                            sideTabs.hide(t);
                            return;
                        }
                        sideTabs.show(t);
                    };
                    _this._documentSourceChanged.addHandler(function () {
                        if (_this._documentSource) {
                            viewer._addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        }
                        update();
                    });
                    viewer._addEvent(matchCaseCheckBox, 'click', function () { _this._searchManager.matchCase = matchCaseCheckBox.checked; });
                    viewer._addEvent(wholeWordCheckBox, 'click', function () { _this._searchManager.wholeWord = wholeWordCheckBox.checked; });
                    viewer._addEvent(input, 'input', function () { _this._searchManager.text = input.value; });
                    viewer._addEvent(input, 'keyup', function (e) {
                        var event = e || window.event;
                        if (event.keyCode === wijmo.Key.Enter) {
                            _this._searchManager.search(event.shiftKey);
                        }
                    });
                    viewer._addEvent(nextBtn, 'click', function () { return _this._searchManager.search(); });
                    viewer._addEvent(preBtn, 'click', function () { return _this._searchManager.search(true); });
                    viewer._addEvent(t.header, 'keydown', function (e) {
                        var next, toolbar = _this._toolbar;
                        if (e.keyCode === wijmo.Key.Tab) {
                            next = toolbar.querySelector('[tabIndex=0]')
                                || toolbar.querySelector('input:not([type="hidden"])')
                                || toolbar;
                            if (next && next['focus']) {
                                next.focus();
                                e.preventDefault();
                            }
                        }
                    });
                });
            };
            ViewerBase.prototype._initSidePanelOutlines = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel), outlinesPage = sideTabs.addPage(wijmo.culture.Viewer.outlines, viewer.icons.outlines);
                this._gOutlinesTitle = outlinesPage.outContent.querySelector('.wj-tabtitle');
                this._outlinesPageId = outlinesPage.id;
                outlinesPage.format(function (t) {
                    wijmo.addClass(t.content, 'wj-outlines-tree');
                    var tree = new wijmo.grid.FlexGrid(t.content);
                    tree.initialize({
                        autoGenerateColumns: false,
                        columns: [
                            { binding: 'caption', width: '*' }
                        ],
                        isReadOnly: true,
                        childItemsPath: 'children',
                        allowResizing: wijmo.grid.AllowResizing.None,
                        headersVisibility: wijmo.grid.HeadersVisibility.None
                    });
                    tree.itemFormatter = function (panel, r, c, cell) {
                        var itemHeader;
                        if (cell.firstElementChild) {
                            itemHeader = cell.firstElementChild.outerHTML;
                        }
                        else {
                            itemHeader = '&nbsp;&nbsp;&nbsp;&nbsp;';
                        }
                        var dataItem = panel.rows[r].dataItem;
                        cell.innerHTML = itemHeader + '<a>' + dataItem.caption + '</a>';
                    };
                    var updatingOutlineSource = true;
                    tree.selectionChanged.addHandler(function (flexGrid, e) {
                        if (updatingOutlineSource) {
                            return;
                        }
                        var row = e.getRow();
                        if (row) {
                            var dataItem = row.dataItem;
                            if (dataItem.position) {
                                // this._scrollToPosition(dataItem.position, true);
                                _this._scrollToPosition(dataItem.position, false); // with preventing of  double history (TFS 441060)
                            }
                            else if (dataItem.target) {
                                if (!_this._documentSource) {
                                    return;
                                }
                                // the target is normally a bookmark string.
                                _this._documentSource.getBookmark(dataItem.target).then(function (pos) {
                                    dataItem.position = pos;
                                    // the selected node may be changed.
                                    if (flexGrid.getSelectedState(e.row, e.col) != wijmo.grid.SelectedState.None) {
                                        // this._scrollToPosition(pos, true);
                                        _this._scrollToPosition(pos, false); // with preventing of  double history (TFS 441060)
                                    }
                                }, function (reason) {
                                    // todo, show non-fatal error in errors panel.
                                });
                            }
                            if (_this._isMobileTemplate()) {
                                sideTabs.collapse();
                            }
                        }
                    });
                    var isTreeRefreshed = false, refreshTree = function () {
                        if (isTreeRefreshed)
                            return;
                        if (sideTabs.isCollapsed || !t.isActived || t.isHidden) {
                            return;
                        }
                        tree.refresh();
                        isTreeRefreshed = true;
                    }, toggleTab = function () {
                        if (!_this._documentSource) {
                            tree.itemsSource = null;
                            sideTabs.hide(t);
                            return;
                        }
                        var update = function () {
                            if (!_this._documentSource.hasOutlines) {
                                tree.itemsSource = null;
                                sideTabs.hide(t);
                                return;
                            }
                            _this._documentSource.getOutlines().then(function (items) {
                                updatingOutlineSource = true;
                                isTreeRefreshed = false;
                                tree.itemsSource = items;
                                sideTabs.show(t);
                                refreshTree();
                                updatingOutlineSource = false;
                            });
                        };
                        viewer._addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        //update();
                    };
                    _this._documentSourceChanged.addHandler(toggleTab);
                    sideTabs.tabPageActived.addHandler(refreshTree);
                    toggleTab();
                });
            };
            ViewerBase.prototype._initSidePanelThumbnails = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel), thumbnailsPage = sideTabs.addPage(wijmo.culture.Viewer.thumbnails, viewer.icons.thumbnails);
                this._gThumbnailsTitle = thumbnailsPage.outContent.querySelector('.wj-tabtitle');
                this._thumbnailsPageId = thumbnailsPage.id;
                thumbnailsPage.format(function (t) {
                    wijmo.addClass(t.content, 'wj-thumbnaillist');
                    var list = new wijmo.input.ListBox(t.content), pngUrls = null, isItemsSourceSetting = false, svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml: space = "preserve" >';
                    list.formatItem.addHandler(function (sender, e) {
                        var item = e.item, data = e.data;
                        item.innerHTML = '';
                        if (!_this._pageView.pages) {
                            return;
                        }
                        var svgContainer = document.createElement('div'), svg = viewer._toDOM(svgStart + '</svg>'), g = document.createElementNS('http://www.w3.org/2000/svg', 'g'), img = document.createElementNS('http://www.w3.org/2000/svg', 'image'), indexDiv = document.createElement('div'), page = _this._pageView.pages[e.index], thumbHeight = page.size.height.valueInPixel * ViewerBase._thumbnailWidth / page.size.width.valueInPixel;
                        wijmo.addClass(item, 'wj-thumbnail-item');
                        data().then(function (url) {
                            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
                        });
                        img.setAttribute('x', '0');
                        img.setAttribute('y', '0');
                        img.setAttribute('width', ViewerBase._thumbnailWidth.toString());
                        img.setAttribute('height', thumbHeight.toString());
                        wijmo.addClass(svgContainer, 'wj-pagethumbnail');
                        svgContainer.setAttribute('tabIndex', '-1');
                        g.appendChild(img);
                        svg.appendChild(g);
                        svgContainer.appendChild(svg);
                        item.appendChild(svgContainer);
                        rotateThumb(svg, page);
                        indexDiv.className = 'page-index';
                        indexDiv.innerHTML = (e.index + 1).toString();
                        item.appendChild(indexDiv);
                    });
                    list.selectedIndexChanged.addHandler(function () {
                        if (isItemsSourceSetting || list.selectedIndex < 0
                            // Does not move to selected page if it's already the current page.
                            // The current page may be set by history backward/forward.
                            || list.selectedIndex == _this._pageIndex) {
                            return;
                        }
                        _this.moveToPage(list.selectedIndex);
                        if (_this._isMobileTemplate()) {
                            sideTabs.collapse();
                        }
                    });
                    _this.pageIndexChanged.addHandler(function () { return list.selectedIndex = _this._pageIndex; });
                    var rotateThumb = function (svg, page) {
                        var thumbWidth = ViewerBase._thumbnailWidth, thumbHeight = page.size.height.valueInPixel * thumbWidth / page.size.width.valueInPixel, container = svg.parentNode;
                        viewer._transformSvg(svg, thumbWidth, thumbHeight, 1, page.rotateAngle);
                        switch (page.rotateAngle) {
                            case viewer._RotateAngle.Rotation90:
                            case viewer._RotateAngle.Rotation270:
                                var tmpHeight = thumbHeight;
                                thumbHeight = thumbWidth;
                                thumbWidth = tmpHeight;
                                break;
                        }
                        container.style.width = thumbWidth + 'px';
                        container.style.height = thumbHeight + 'px';
                        svg.setAttribute('width', thumbWidth.toString());
                        svg.setAttribute('height', thumbHeight.toString());
                    };
                    var createThumbnails = function () {
                        if (!_this._documentSource || !_this._documentSource.isLoadCompleted || !_this._documentSource.pageCount) {
                            return null;
                        }
                        var result = [];
                        for (var i = 0; i < _this._documentSource.pageCount; i++) {
                            (function (pageIndex) {
                                result.push(function () {
                                    var promise = new viewer._Promise();
                                    _this._documentSource.getExportedUrl({ format: 'png', resolution: 50, outputRange: pageIndex + 1 }).then(function (url) {
                                        if (!_this._documentSource || !_this._documentSource._innerService || _this._documentSource.isDisposed) {
                                            promise.resolve(null);
                                        }
                                        _this._documentSource._innerService.downloadDataUrl(url).then(function (dataUrl) {
                                            promise.resolve(dataUrl);
                                        }, function (e) { return promise.resolve(null); });
                                    }, function (e) { return promise.resolve(null); });
                                    return promise;
                                });
                            })(i);
                        }
                        return result;
                    };
                    //var createThumbnails: () => IPromise = () => {
                    //    if (!this._documentSource || !this._documentSource.isLoadCompleted || !this._documentSource.pageCount) {
                    //        return new _Promise().resolve(null);
                    //    }
                    //    var promises: IPromise[] = [];
                    //    // get urls
                    //    for (var i = 0; i < this._documentSource.pageCount; i++) {
                    //        let promise = new _Promise();
                    //        ((pageNumber: number) => { // closure for i.
                    //            this._documentSource.getExportedUrl({ format: 'png', resolution: 50, outputRange: pageNumber }).then(url => {
                    //                promise.resolve([url, pageNumber]);
                    //            });
                    //        })(i + 1);
                    //        promises.push(promise);
                    //    }
                    //    var promise = new _Promise();
                    //    // Compose all promises and wait until all the images urls will be received.
                    //    (new _CompositedPromise(promises)).then((urls: any[]) => {
                    //        // sort urls
                    //        urls.sort((a: any[], b: any[]) => {
                    //            return a[1] - b[1];
                    //        });
                    //        promise.resolve(urls.map(item => {
                    //            // A function that returns the promise that will download the image and convert it to a data url.
                    //            return () => {
                    //                var promise = new _Promise();
                    //                this._documentSource._innerService.downloadDataUrl(item[0]).then(url => {
                    //                    promise.resolve(url);
                    //                });
                    //                return promise;
                    //            }
                    //        }));
                    //    });
                    //    return promise;
                    //};
                    var updateItems = function () {
                        var fn = function () {
                            if (t.isActived && list.itemsSource !== pngUrls) {
                                list.deferUpdate(function () {
                                    isItemsSourceSetting = true;
                                    list.itemsSource = pngUrls;
                                    list.selectedIndex = _this._pageIndex;
                                    isItemsSourceSetting = false;
                                });
                            }
                        };
                        if (sideTabs.isCollapsed || !t.isActived) {
                            return;
                        }
                        pngUrls = pngUrls || createThumbnails();
                        fn();
                        //if (!pngUrls) {
                        //    createThumbnails().then((urls: (() => IPromise)[]) => {
                        //        pngUrls = urls;
                        //        fn();
                        //    });
                        //} else {
                        //    fn();
                        //}
                    };
                    var update = function () {
                        if (!_this._documentSource || !_this._documentSource.hasThumbnails) {
                            sideTabs.hide(t);
                            list.itemsSource = null;
                            return;
                        }
                        sideTabs.show(t);
                        pngUrls = null;
                        updateItems();
                    };
                    var bindEvents = function () {
                        if (!_this._documentSource || !_this._documentSource.hasThumbnails) {
                            sideTabs.hide(t);
                            list.itemsSource = null;
                            return;
                        }
                        viewer._addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        viewer._addWjHandler(_this._documentEventKey, _this._documentSource.pageCountChanged, update);
                        viewer._addWjHandler(_this._documentEventKey, _this._documentSource.pageSettingsChanged, update);
                        update();
                    };
                    _this._documentSourceChanged.addHandler(bindEvents);
                    bindEvents();
                    sideTabs.tabPageActived.addHandler(function () {
                        if (sideTabs.activedTabPage.id === _this._thumbnailsPageId) {
                            updateItems();
                        }
                    });
                    updateItems();
                    _this._pageView.rotateAngleChanged.addHandler(function () {
                        var svgs = list.hostElement.querySelectorAll('svg');
                        for (var i = 0; i < svgs.length; i++) {
                            rotateThumb(svgs.item(i), _this._pageView.pages[i]);
                        }
                    });
                });
            };
            ViewerBase.prototype._initSidePanelExports = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                var exportsPage = sideTabs.addPage(wijmo.culture.Viewer.exports, viewer.icons.exports);
                this._gExportsPageTitle = exportsPage.outContent.querySelector('.wj-tabtitle');
                this._exportsPageId = exportsPage.id;
                exportsPage.format(function (t) {
                    var settingsHtml = '<div class="wj-exportcontainer">' +
                        '<label wj-part="g-wj-exportformat">' + wijmo.culture.Viewer.exportFormat + '</label>' +
                        '<div class="wj-exportformats"></div>' +
                        '</div>', settingsElement = viewer._toDOMs(settingsHtml), searchResult;
                    t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
                    _this._gExportFormatTitle = t.outContent.querySelector('[wj-part="g-wj-exportformat"]');
                    var exportFormatsDiv = t.outContent.querySelector('.wj-exportformats');
                    new wijmo.input.ComboBox(exportFormatsDiv);
                    wijmo.addClass(t.content.parentElement, 'wj-exportformats-wrapper');
                    var editorElement = document.createElement('div');
                    var editor = new viewer._ExportOptionEditor(editorElement);
                    t.content.appendChild(editorElement);
                    var footerHtml = '<div class="wj-exportformats-footer">' +
                        '<a wj-part="btn-apply" class="wj-btn wj-applybutton" tabindex="-1">' + wijmo.culture.Viewer.exportOk + '</a>' +
                        '</div>';
                    var footerElement = viewer._toDOMs(footerHtml);
                    t.content.appendChild(footerElement);
                    var applyBtn = t.content.querySelector('[wj-part="btn-apply"]');
                    _this._gExportsPageApplyBtn = applyBtn;
                    viewer._addEvent(applyBtn, 'click', function () {
                        _this._documentSource.export(editor.options);
                        sideTabs.collapse();
                    });
                });
                var updateExportTab = true;
                this._documentSourceChanged.addHandler(function () {
                    updateExportTab = true;
                    if (!_this._documentSource) {
                        return;
                    }
                    viewer._addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, function () {
                        // Update active export tab if datasource has been changed
                        if (updateExportTab) {
                            _this._ensureExportFormatsLoaded().then(function () {
                                _this._updateExportTab();
                                updateExportTab = (_this._exportFormats == null);
                            });
                        }
                    });
                });
                sideTabs.tabPageActived.addHandler(function () {
                    if (updateExportTab && (sideTabs.activedTabPage.id === _this._exportsPageId)) {
                        _this._ensureExportFormatsLoaded().then(function () {
                            _this._updateExportTab();
                            updateExportTab = (_this._exportFormats == null);
                        });
                    }
                });
            };
            ViewerBase.prototype._ensureExportFormatsLoaded = function () {
                var _this = this;
                if (!this._exportFormats && this._documentSource && !this._documentSource.isDisposed && this._documentSource.isInstanceCreated) {
                    return this._documentSource.getSupportedExportDescriptions().then(function (items) {
                        _this._exportFormats = items;
                        _this._setViewerAction(viewer._ViewerActionType.ShowExportsPanel);
                    });
                }
                var promise = new viewer._Promise();
                promise.resolve();
                return promise;
            };
            ViewerBase.prototype._updateExportTab = function (refresh) {
                var _this = this;
                if (!this._exportFormats) {
                    return;
                }
                var sideTabs = wijmo.Control.getControl(this._sidePanel), exportsPage = sideTabs.getTabPage(this._exportsPageId), comboExportFormats = wijmo.Control.getControl(exportsPage.outContent.querySelector('.wj-exportformats')), editor = wijmo.Control.getControl(exportsPage.content.firstElementChild);
                if (refresh) {
                    editor.refresh();
                    if (comboExportFormats.itemsSource) {
                        comboExportFormats.itemsSource.forEach(function (item) {
                            item.name = _this._exportItemDescriptions[item.format].name;
                        });
                    }
                    comboExportFormats.refresh();
                }
                else {
                    var bindingItems = [];
                    this._exportFormats.forEach(function (item) {
                        var itemDescription = _this._exportItemDescriptions[item.format];
                        //some export format can't be opened on ios.
                        if (viewer.isIOS() && !itemDescription.supportIOS) {
                            return;
                        }
                        item.name = itemDescription.name;
                        bindingItems.push(item);
                    });
                    comboExportFormats.selectedIndexChanged.addHandler(function () {
                        editor.exportDescription = comboExportFormats.selectedItem;
                    });
                    comboExportFormats.itemsSource = bindingItems;
                    comboExportFormats.displayMemberPath = 'name';
                    comboExportFormats.selectedValuePath = 'format';
                    comboExportFormats.selectedIndex = -1;
                }
            };
            ViewerBase.prototype._initSidePanelPageSetup = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                var pageSetupPage = sideTabs.addPage(wijmo.culture.Viewer.pageSetup, viewer.icons.pageSetup);
                this._gPageSetupTitle = pageSetupPage.outContent.querySelector('.wj-tabtitle');
                this._pageSetupPageId = pageSetupPage.id;
                pageSetupPage.format(function (t) {
                    var editorElement = document.createElement('div');
                    var editor = new viewer._PageSetupEditor(editorElement);
                    t.content.appendChild(editorElement);
                    wijmo.addClass(editorElement, 'wj-pagesetupcontainer');
                    var footerHtml = '<div class="wj-pagesetup-footer">' +
                        '<a wj-part="btn-apply" class="wj-btn wj-applybutton" tabindex="-1">' + wijmo.culture.Viewer.ok + '</a>' +
                        '</div>';
                    var footerElement = viewer._toDOMs(footerHtml);
                    t.content.appendChild(footerElement);
                    var applyBtn = t.content.querySelector('[wj-part="btn-apply"]');
                    _this._gPageSetupApplyBtn = applyBtn;
                    viewer._addEvent(applyBtn, 'click', function () {
                        _this._setPageSettings(editor.pageSettings);
                        sideTabs.collapse();
                    });
                    var updatePageSettings = function () {
                        editor.pageSettings = _this._documentSource.pageSettings;
                    }, update = function () {
                        if (!_this._documentSource) {
                            return;
                        }
                        viewer._addWjHandler(_this._documentEventKey, _this._documentSource.pageSettingsChanged, updatePageSettings);
                        updatePageSettings();
                    };
                    _this._documentSourceChanged.addHandler(update);
                    update();
                });
            };
            ViewerBase.prototype._executeAction = function (action) {
                if (this._actionIsDisabled(action)) {
                    return;
                }
                switch (action) {
                    case viewer._ViewerActionType.TogglePaginated:
                        this._innerPaginated = !this._innerPaginated;
                        break;
                    case viewer._ViewerActionType.Print:
                        if (this._documentSource) {
                            this._documentSource.print(this._pages.map(function (page) { return page.rotateAngle; }));
                        }
                        break;
                    case viewer._ViewerActionType.ShowExportsPanel:
                        wijmo.Control.getControl(this._sidePanel).active(this._exportsPageId);
                        break;
                    case viewer._ViewerActionType.Portrait:
                        this._setPageLandscape(false);
                        break;
                    case viewer._ViewerActionType.Landscape:
                        this._setPageLandscape(true);
                        break;
                    case viewer._ViewerActionType.ShowPageSetupDialog:
                        this.showPageSetupDialog();
                        break;
                    case viewer._ViewerActionType.FirstPage:
                        this.moveToPage(0);
                        break;
                    case viewer._ViewerActionType.LastPage:
                        this._moveToLastPage();
                        break;
                    case viewer._ViewerActionType.PrePage:
                        this.moveToPage(this._pageIndex - 1);
                        break;
                    case viewer._ViewerActionType.NextPage:
                        this.moveToPage(this._pageIndex + 1);
                        break;
                    case viewer._ViewerActionType.Backward:
                        this._moveBackwardHistory();
                        break;
                    case viewer._ViewerActionType.Forward:
                        this._moveForwardHistory();
                        break;
                    case viewer._ViewerActionType.SelectTool:
                        this.mouseMode = viewer.MouseMode.SelectTool;
                        break;
                    case viewer._ViewerActionType.MoveTool:
                        this.mouseMode = viewer.MouseMode.MoveTool;
                        break;
                    case viewer._ViewerActionType.Continuous:
                        this.viewMode = viewer.ViewMode.Continuous;
                        break;
                    case viewer._ViewerActionType.Single:
                        this.viewMode = viewer.ViewMode.Single;
                        break;
                    case viewer._ViewerActionType.FitPageWidth:
                        this.zoomMode = viewer.ZoomMode.PageWidth;
                        break;
                    case viewer._ViewerActionType.FitWholePage:
                        this.zoomMode = viewer.ZoomMode.WholePage;
                        break;
                    case viewer._ViewerActionType.ZoomOut:
                        this._zoomBtnClicked(false, ViewerBase._defaultZoomValues);
                        break;
                    case viewer._ViewerActionType.ZoomIn:
                        this._zoomBtnClicked(true, ViewerBase._defaultZoomValues);
                        break;
                    case viewer._ViewerActionType.ToggleFullScreen:
                        this.fullScreen = !this.fullScreen;
                        break;
                    case viewer._ViewerActionType.ShowHamburgerMenu:
                        this._hamburgerMenu.showMenu();
                        break;
                    case viewer._ViewerActionType.ShowViewMenu:
                        this._viewMenu.showMenu();
                        break;
                    case viewer._ViewerActionType.ShowSearchBar:
                        this._showSearchBar(wijmo.hasClass(this._searchBar, viewer._hiddenCss));
                        this._setViewerAction(viewer._ViewerActionType.ShowSearchBar);
                        break;
                    case viewer._ViewerActionType.ShowThumbnails:
                        wijmo.Control.getControl(this._sidePanel).active(this._thumbnailsPageId);
                        break;
                    case viewer._ViewerActionType.ShowOutlines:
                        wijmo.Control.getControl(this._sidePanel).active(this._outlinesPageId);
                        break;
                    case viewer._ViewerActionType.ShowPageSetupPanel:
                        wijmo.Control.getControl(this._sidePanel).active(this._pageSetupPageId);
                        break;
                    case viewer._ViewerActionType.ShowZoomBar:
                        this._showFooter(true);
                        break;
                    case viewer._ViewerActionType.SearchPrev:
                        this._searchManager.search(true);
                        break;
                    case viewer._ViewerActionType.SearchNext:
                        this._searchManager.search();
                        break;
                    case viewer._ViewerActionType.ShowSearchOptions:
                        this._searchOptionsMenu.showMenu(true);
                        break;
                    case viewer._ViewerActionType.SearchMatchCase:
                        this._searchManager.matchCase = !this._searchManager.matchCase;
                        break;
                    case viewer._ViewerActionType.SearchMatchWholeWord:
                        this._searchManager.wholeWord = !this._searchManager.wholeWord;
                        break;
                    case viewer._ViewerActionType.RubberbandTool:
                        this.mouseMode = viewer.MouseMode.RubberbandTool;
                        break;
                    case viewer._ViewerActionType.MagnifierTool:
                        this.mouseMode = viewer.MouseMode.MagnifierTool;
                        break;
                    case viewer._ViewerActionType.RotateDocument:
                        this._rotateDocument();
                        break;
                    case viewer._ViewerActionType.RotatePage:
                        this._rotatePage();
                        break;
                }
            };
            ViewerBase.prototype._initSearchOptionsMenu = function (owner) {
                this._searchOptionsMenu = new viewer._SearchOptionsMenu(this, owner);
            };
            ViewerBase.prototype._initHamburgerMenu = function (owner) {
                this._hamburgerMenu = new viewer._HamburgerMenu(this, owner);
            };
            ViewerBase.prototype._initViewMenu = function (owner) {
                this._viewMenu = new viewer._ViewMenu(this, owner);
            };
            ViewerBase.prototype._initToolbar = function () {
                new viewer._ViewerToolbar(this._toolbar, this);
                new viewer._ViewerMobileToolbar(this._mobileToolbar, this);
            };
            ViewerBase.prototype._clearExportFormats = function () {
                this._exportFormats = null;
            };
            Object.defineProperty(ViewerBase.prototype, "_exportItemDescriptions", {
                get: function () {
                    if (!ViewerBase._exportItems) {
                        ViewerBase._exportItems = {
                            'pdf': { name: wijmo.culture.Viewer.pdfExportName, supportIOS: true },
                            //MS Word document(doc, docx) and rtf cannot be opened on ios, it will be a blank document.
                            'doc': { name: wijmo.culture.Viewer.docExportName, supportIOS: false },
                            'docx': { name: wijmo.culture.Viewer.docxExportName, supportIOS: false },
                            'rtf': { name: wijmo.culture.Viewer.rtfExportName, supportIOS: false },
                            'xlsx': { name: wijmo.culture.Viewer.xlsxExportName, supportIOS: true },
                            'xls': { name: wijmo.culture.Viewer.xlsExportName, supportIOS: true },
                            'mhtml': { name: wijmo.culture.Viewer.mhtmlExportName, supportIOS: true },
                            'html': { name: wijmo.culture.Viewer.htmlExportName, supportIOS: true },
                            'zip': { name: wijmo.culture.Viewer.metafileExportName, supportIOS: false },
                            'csv': { name: wijmo.culture.Viewer.csvExportName, supportIOS: true },
                            'tiff': { name: wijmo.culture.Viewer.tiffExportName, supportIOS: true },
                            //Images will be exported as zip which cannot be opened with browser.
                            'bmp': { name: wijmo.culture.Viewer.bmpExportName, supportIOS: false },
                            'emf': { name: wijmo.culture.Viewer.emfExportName, supportIOS: false },
                            'gif': { name: wijmo.culture.Viewer.gifExportName, supportIOS: false },
                            'jpeg': { name: wijmo.culture.Viewer.jpegExportName, suportIOS: false },
                            'jpg': { name: wijmo.culture.Viewer.jpegExportName, supportIOS: false },
                            'png': { name: wijmo.culture.Viewer.pngExportName, supportIOS: false },
                            // (AR) todo: localization
                            'xml': { name: 'XML document', supportIOS: false }
                        };
                    }
                    return ViewerBase._exportItems;
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype._actionIsChecked = function (action) {
                switch (action) {
                    case viewer._ViewerActionType.TogglePaginated:
                        return this._innerPaginated === true;
                    case viewer._ViewerActionType.Landscape:
                        if (this._documentSource && this._documentSource.pageSettings) {
                            return this._documentSource.pageSettings.landscape;
                        }
                        return false;
                    case viewer._ViewerActionType.Portrait:
                        if (this._documentSource && this._documentSource.pageSettings) {
                            return !this._documentSource.pageSettings.landscape;
                        }
                        return false;
                    case viewer._ViewerActionType.SelectTool:
                        return this.mouseMode === viewer.MouseMode.SelectTool;
                    case viewer._ViewerActionType.MoveTool:
                        return this.mouseMode === viewer.MouseMode.MoveTool;
                    case viewer._ViewerActionType.RubberbandTool:
                        return this.mouseMode === viewer.MouseMode.RubberbandTool;
                    case viewer._ViewerActionType.MagnifierTool:
                        return this.mouseMode === viewer.MouseMode.MagnifierTool;
                    case viewer._ViewerActionType.Continuous:
                        return this.viewMode == viewer.ViewMode.Continuous;
                    case viewer._ViewerActionType.Single:
                        return this.viewMode == viewer.ViewMode.Single;
                    case viewer._ViewerActionType.ToggleFullScreen:
                        return this.fullScreen;
                    case viewer._ViewerActionType.FitPageWidth:
                        return this.zoomMode == viewer.ZoomMode.PageWidth;
                    case viewer._ViewerActionType.FitWholePage:
                        return this.zoomMode == viewer.ZoomMode.WholePage;
                    case viewer._ViewerActionType.SearchMatchCase:
                        return this._searchManager.matchCase;
                    case viewer._ViewerActionType.SearchMatchWholeWord:
                        return this._searchManager.wholeWord;
                    case viewer._ViewerActionType.ShowSearchBar:
                        return !wijmo.hasClass(this._searchBar, viewer._hiddenCss);
                }
                return false;
            };
            ViewerBase.prototype._isDocumentSourceLoaded = function () {
                return this._documentSource && this._documentSource.isLoadCompleted;
            };
            ViewerBase.prototype._actionIsDisabled = function (action) {
                if (!this._isDocumentSourceLoaded() || !(this._documentSource.pageCount > 0)) { // no pages - no actions
                    return true;
                }
                switch (action) {
                    case viewer._ViewerActionType.TogglePaginated:
                        return this._innerPaginated == null;
                    case viewer._ViewerActionType.ShowExportsPanel:
                        return !this._exportFormats || this._exportFormats.length === 0;
                    case viewer._ViewerActionType.Landscape:
                    case viewer._ViewerActionType.Portrait:
                    case viewer._ViewerActionType.ShowPageSetupDialog:
                    case viewer._ViewerActionType.ShowPageSetupPanel:
                        if (this._documentSource && this._documentSource.pageSettings) {
                            return !this._documentSource.paginated;
                        }
                        return true;
                    case viewer._ViewerActionType.FirstPage:
                    case viewer._ViewerActionType.PrePage:
                        return this._pageIndex <= 0;
                    case viewer._ViewerActionType.LastPage:
                    case viewer._ViewerActionType.NextPage:
                        return this._pageIndex >= this._documentSource.pageCount - 1;
                    case viewer._ViewerActionType.Backward:
                        return !this._historyManager.canBackward();
                    case viewer._ViewerActionType.Forward:
                        return !this._historyManager.canForward();
                    case viewer._ViewerActionType.Continuous:
                    case viewer._ViewerActionType.Single:
                        return !this._documentSource || !this._documentSource.paginated;
                    case viewer._ViewerActionType.ZoomOut:
                        return this.zoomFactor <= ViewerBase._defaultZoomValues[0].value;
                    case viewer._ViewerActionType.ZoomIn:
                        var zoomValues = ViewerBase._defaultZoomValues;
                        return this.zoomFactor >= zoomValues[zoomValues.length - 1].value;
                }
                return false;
            };
            ViewerBase.prototype._actionIsShown = function (action) {
                var features = this._documentSource ? (this._documentSource.features) : null;
                switch (action) {
                    case viewer._ViewerActionType.TogglePaginated:
                        return features && features.paginated && features.nonPaginated;
                    case viewer._ViewerActionType.Landscape:
                    case viewer._ViewerActionType.Portrait:
                    case viewer._ViewerActionType.ShowPageSetupDialog:
                    case viewer._ViewerActionType.ShowPageSetupPanel:
                        return features ? features.pageSettings : this._supportsPageSettingActions();
                    case viewer._ViewerActionType.SelectTool:
                    case viewer._ViewerActionType.MoveTool:
                    case viewer._ViewerActionType.MagnifierTool:
                    case viewer._ViewerActionType.RubberbandTool:
                        return !wijmo.isMobile();
                    case viewer._ViewerActionType.ShowSearchBar:
                        return features && (!this._documentSource.paginated || features.textSearchInPaginatedMode);
                    case viewer._ViewerActionType.ShowOutlines:
                        return this._documentSource && this._documentSource.hasOutlines;
                    case viewer._ViewerActionType.ShowThumbnails:
                        return this._documentSource && this._documentSource.hasThumbnails;
                }
                return true;
            };
            ViewerBase.prototype._onViewerActionStatusChanged = function (e) {
                this._viewerActionStatusChanged.raise(this, e);
            };
            ViewerBase.prototype._setViewerAction = function (actionType, disabled, checked, shown) {
                var action = {
                    actionType: actionType,
                    disabled: disabled ? disabled : this._actionIsDisabled(actionType),
                    checked: checked ? checked : this._actionIsChecked(actionType),
                    shown: shown ? shown : this._actionIsShown(actionType)
                };
                this._onViewerActionStatusChanged({ action: action });
            };
            ViewerBase.prototype._updateViewerActions = function () {
                this._updatePageSettingsActions();
                this._updateViewModeActions();
                this._updateMouseModeActions();
                this._setViewerAction(viewer._ViewerActionType.ShowExportsPanel);
            };
            ViewerBase.prototype._updateViewModeActions = function () {
                this._setViewerAction(viewer._ViewerActionType.Continuous);
                this._setViewerAction(viewer._ViewerActionType.Single);
            };
            ViewerBase.prototype._updatePageSettingsActions = function () {
                this._setViewerAction(viewer._ViewerActionType.TogglePaginated);
                this._setViewerAction(viewer._ViewerActionType.Landscape);
                this._setViewerAction(viewer._ViewerActionType.Portrait);
                this._setViewerAction(viewer._ViewerActionType.ShowPageSetupDialog);
            };
            ViewerBase.prototype._updateMouseModeActions = function () {
                this._setViewerAction(viewer._ViewerActionType.SelectTool);
                this._setViewerAction(viewer._ViewerActionType.MoveTool);
                this._setViewerAction(viewer._ViewerActionType.MagnifierTool);
                this._setViewerAction(viewer._ViewerActionType.RubberbandTool);
            };
            ViewerBase.prototype._updateZoomModeActions = function () {
                this._setViewerAction(viewer._ViewerActionType.FitPageWidth);
                this._setViewerAction(viewer._ViewerActionType.FitWholePage);
            };
            ViewerBase.prototype._updateZoomFactorActions = function () {
                this._setViewerAction(viewer._ViewerActionType.ZoomOut);
                this._setViewerAction(viewer._ViewerActionType.ZoomIn);
            };
            ViewerBase.prototype._onPageSettingsUpdated = function () {
                this._updatePageSettingsActions();
                this._updateViewModeActions();
                this._resetToolbarWidth();
            };
            ViewerBase.prototype._onPageCountUpdated = function () {
                this._updatePageNavActions();
                this._resetToolbarWidth();
            };
            ViewerBase.prototype._updatePageNavActions = function () {
                this._setViewerAction(viewer._ViewerActionType.FirstPage);
                this._setViewerAction(viewer._ViewerActionType.LastPage);
                this._setViewerAction(viewer._ViewerActionType.PrePage);
                this._setViewerAction(viewer._ViewerActionType.NextPage);
            };
            ViewerBase.prototype._onHistoryManagerStatusUpdated = function () {
                this._setViewerAction(viewer._ViewerActionType.Backward);
                this._setViewerAction(viewer._ViewerActionType.Forward);
            };
            ViewerBase.prototype._updateUI = function () {
                var _this = this;
                // update button actions
                Object.keys(viewer._ViewerActionType).forEach(function (value) {
                    if (!isNaN(value)) {
                        _this._setViewerAction(viewer._ViewerActionType[viewer._ViewerActionType[value]]);
                    }
                });
                // update tabs
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                if (sideTabs) {
                    sideTabs.enableAll(this._isDocumentSourceLoaded());
                }
            };
            ViewerBase.prototype._updateViewContainerCursor = function () {
                var showMoveTool = this.mouseMode === viewer.MouseMode.MoveTool;
                if (showMoveTool) {
                    if (!wijmo.hasClass(this._viewpanelContainer, 'move')) {
                        wijmo.addClass(this._viewpanelContainer, 'move');
                    }
                }
                else if (wijmo.hasClass(this._viewpanelContainer, 'move')) {
                    wijmo.removeClass(this._viewpanelContainer, 'move');
                }
            };
            ViewerBase.prototype._updateFullScreenStyle = function () {
                var fullScreenClass = 'full-screen', body = document.body;
                if (this.fullScreen) {
                    // Gets the window scroll position from document.documentElement (IE) or body (Chrome).
                    this._bodyOriginScrollLeft = (document.documentElement && document.documentElement.scrollLeft) || body.scrollLeft;
                    this._bodyOriginScrollTop = (document.documentElement && document.documentElement.scrollTop) || body.scrollTop;
                    wijmo.addClass(this.hostElement, fullScreenClass);
                    wijmo.addClass(body, fullScreenClass);
                    this._hostOriginWidth = this.hostElement.style.width;
                    this._hostOriginHeight = this.hostElement.style.height;
                    this.hostElement.style.width = '100%';
                    this.hostElement.style.height = '100%';
                    window.scrollTo(0, 0);
                }
                else {
                    wijmo.removeClass(this.hostElement, fullScreenClass);
                    wijmo.removeClass(body, fullScreenClass);
                    this.hostElement.style.width = this._hostOriginWidth;
                    this.hostElement.style.height = this._hostOriginHeight;
                    if (wijmo.isNumber(this._bodyOriginScrollLeft)) {
                        if (document.documentElement) {
                            document.documentElement.scrollLeft = this._bodyOriginScrollLeft;
                        }
                        body.scrollLeft = this._bodyOriginScrollLeft;
                    }
                    if (wijmo.isNumber(this._bodyOriginScrollTop)) {
                        if (document.documentElement) {
                            document.documentElement.scrollTop = this._bodyOriginScrollTop;
                        }
                        body.scrollTop = this._bodyOriginScrollTop;
                    }
                }
                this.refresh();
            };
            /**
             * Shows the page setup dialog.
             */
            ViewerBase.prototype.showPageSetupDialog = function () {
                if (!this._pageSetupDialog) {
                    this._createPageSetupDialog();
                }
                this._pageSetupDialog.showWithValue(this._documentSource.pageSettings);
            };
            ViewerBase.prototype._createPageSetupDialog = function () {
                var self = this, ele = document.createElement("div");
                ele.style.display = 'none';
                self.hostElement.appendChild(ele);
                self._pageSetupDialog = new viewer._PageSetupDialog(ele);
                self._pageSetupDialog.applied.addHandler(function () { return self._setPageSettings(self._pageSetupDialog.pageSettings); });
            };
            /**
             * Scales the current page to show the whole page in view panel.
             */
            ViewerBase.prototype.zoomToView = function () {
                wijmo._deprecated('zoomToView', 'zoomMode');
                var doc = this._documentSource;
                if (!doc) {
                    return;
                }
                this.zoomMode = viewer.ZoomMode.WholePage;
            };
            /**
             * Scales the current page to fit the width of the view panel.
             */
            ViewerBase.prototype.zoomToViewWidth = function () {
                wijmo._deprecated('zoomToViewWidth', 'zoomMode');
                var doc = this._documentSource;
                if (!doc) {
                    return;
                }
                this.zoomMode = viewer.ZoomMode.PageWidth;
            };
            ViewerBase.prototype._setPageLandscape = function (landscape) {
                var self = this, pageSettings = this._documentSource.pageSettings;
                viewer._setLandscape(pageSettings, landscape);
                self._setPageSettings(pageSettings);
            };
            ViewerBase.prototype._setPaginated = function (paginated) {
                var features = this._documentSource.features, pageSettings = this._documentSource.pageSettings;
                if (!features || !pageSettings)
                    return;
                if (paginated == pageSettings.paginated)
                    return;
                if (paginated && features.paginated) {
                    pageSettings.paginated = true;
                    this._setPageSettings(pageSettings);
                    this._showSearchBar(false); // TFS 419684
                }
                else if (!paginated && features.nonPaginated) {
                    pageSettings.paginated = false;
                    this._setPageSettings(pageSettings);
                }
            };
            ViewerBase.prototype._setPageSettings = function (pageSettings) {
                var _this = this;
                this._showViewPanelMessage();
                this._setDocumentRendering(); // #268768
                return this._documentSource.setPageSettings(pageSettings).then(function (data) {
                    _this._resetDocument();
                    _this._reRenderDocument();
                }).catch(function (reason) {
                    _this._showViewPanelErrorMessage(viewer._getErrorMessage(reason));
                });
            };
            ViewerBase.prototype._showViewPanelErrorMessage = function (message) {
                this._showViewPanelMessage(message, 'errormessage');
            };
            ViewerBase.prototype._showViewPanelMessage = function (message, className) {
                var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
                if (!div) {
                    div = document.createElement('div');
                    div.innerHTML = '<span class="verticalalign"></span><span class="textspan"></span>';
                    this._viewpanelContainer.appendChild(div);
                }
                div.className = 'wj-viewer-loading';
                if (className) {
                    wijmo.addClass(div, className);
                }
                var textspan = div.querySelector('.textspan');
                if (textspan) {
                    textspan.innerHTML = message || wijmo.culture.Viewer.loading;
                }
            };
            ViewerBase.prototype._removeViewPanelMessage = function () {
                var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
                if (div) {
                    this._viewpanelContainer.removeChild(div);
                }
            };
            ViewerBase.prototype._reRenderDocument = function () {
                if (this._documentSource) {
                    this._showViewPanelMessage();
                    this._documentSource.load();
                }
            };
            ViewerBase.prototype._zoomBtnClicked = function (zoomIn, zoomValues) {
                var i, zoomIndex, isFixedValue;
                for (i = 0; i < zoomValues.length; i++) {
                    if (zoomValues[i].value > this.zoomFactor) {
                        zoomIndex = i - 0.5;
                        break;
                    }
                    else if (zoomValues[i].value === this.zoomFactor) {
                        zoomIndex = i;
                        break;
                    }
                }
                if (zoomIndex == null) {
                    zoomIndex = zoomValues.length - 0.5;
                }
                if (zoomIndex <= 0 && !zoomIn) {
                    return;
                }
                if (zoomIndex >= zoomValues.length - 1 && zoomIn) {
                    return;
                }
                if (zoomIn) {
                    zoomIndex = Math.floor(zoomIndex) + 1;
                }
                else {
                    zoomIndex = Math.ceil(zoomIndex) - 1;
                }
                this.zoomFactor = zoomValues[zoomIndex].value;
            };
            // Gets the document source of the viewer.
            ViewerBase.prototype._getDocumentSource = function () {
                return this._documentSource;
            };
            // Sets the document source of the viewer.
            ViewerBase.prototype._setDocumentSource = function (value) {
                var _this = this;
                this._loadDocument(value).then(function (v) {
                    if (_this._documentSource != value) {
                        return;
                    }
                    _this._ensureExportFormatsLoaded();
                });
            };
            ViewerBase.prototype._loadDocument = function (value, force, disposeSource) {
                var _this = this;
                if (force === void 0) { force = false; }
                if (disposeSource === void 0) { disposeSource = true; }
                var promise = new viewer._Promise();
                if ((this._documentSource === value) && !force) {
                    return promise;
                }
                this._disposeDocument(disposeSource);
                this._documentSource = value;
                if (value) {
                    viewer._addWjHandler(this._documentEventKey, value.loading, function () {
                        _this._updateUI();
                    }, this);
                    viewer._addWjHandler(this._documentEventKey, value.loadCompleted, this._onDocumentSourceLoadCompleted, this);
                    viewer._addWjHandler(this._documentEventKey, value.queryLoadingData, function (s, e) {
                        _this.onQueryLoadingData(e);
                    }, this);
                    if (!value.isLoadCompleted) {
                        this._showViewPanelMessage();
                        value.load().then(function (v) {
                            _this._keepServiceConnection();
                            promise.resolve(v);
                        }).catch(function (reason) {
                            _this._showViewPanelErrorMessage(viewer._getErrorMessage(reason));
                        });
                    }
                    else {
                        this._onDocumentSourceLoadCompleted();
                        this._keepServiceConnection();
                        promise.resolve();
                    }
                }
                this._onDocumentSourceChanged();
                return promise;
            };
            ViewerBase.prototype._actionElementClicked = function (element) {
                var action = this._getActionInfo(element);
                if (action) {
                    if (action.kind === viewer._ActionKind.Bookmark) {
                        this._goToBookmark(action);
                    }
                    else {
                        if (action.kind === viewer._ActionKind.Custom) {
                            this._executeCustomAction(action);
                        }
                    }
                }
            };
            ViewerBase.prototype._getActionInfo = function (element) {
                var atr = element.getAttribute(viewer._Page._bookmarkAttr);
                if (atr) {
                    return { kind: viewer._ActionKind.Bookmark, data: atr };
                }
                if (atr = element.getAttribute(viewer._Page._customActionAttr)) {
                    return { kind: viewer._ActionKind.Custom, data: atr };
                }
                return null;
            };
            ViewerBase.prototype._onDocumentSourceLoadCompleted = function () {
                var _this = this;
                var errorList = this._documentSource.errors;
                if (this._documentSource.isLoadCompleted) {
                    this._removeViewPanelMessage();
                    this._pages.length = 0;
                    if (this._documentSource.pageCount <= 0) {
                        this._updateUI();
                        return;
                    }
                    var defaultPageSize = {
                        width: this._documentSource.pageSettings.width,
                        height: this._documentSource.pageSettings.height
                    };
                    for (var i = 0; i < this._documentSource.pageCount; i++) {
                        var page = this._createPage(i, defaultPageSize);
                        page.linkClicked.addHandler(function (s, e) {
                            if (!(_this._magnifier && _this._magnifier.isActive || _this._rubberband && _this._rubberband.isActive)) {
                                _this._actionElementClicked(e.element);
                            }
                        });
                        this._pages.push(page);
                    }
                    this._pageView.pages = this._pages;
                    if (!this._autoHeightCalculated) {
                        this._autoCalculateHeight();
                        this._autoHeightCalculated = true;
                    }
                    // the _initialPosition is set before executing custom action,
                    // the document source's initialPosition is set after the custom action is executed,
                    // should reset it here, for it should only be used once.
                    var position = this._documentSource.initialPosition || this._initialPosition;
                    this._documentSource.initialPosition = null;
                    this._initialPosition = null;
                    if (!position || position.pageIndex == 0) {
                        // show the first page.
                        this._pageIndex = 0;
                        position = { pageIndex: 0 };
                    }
                    // update viewMode only after changing pageView's pageIndex (#305407)
                    // and bfore scroll to scroll valid active page (TFS 466674)
                    if (!this._documentSource.paginated) {
                        this.viewMode = viewer.ViewMode.Single;
                    }
                    this._initialScroll = true;
                    this._scrollToPosition(position);
                    this._updateHistoryCurrent();
                    if (errorList && errorList.length > 0) {
                        var errors = "";
                        for (var i = 0; i < errorList.length; i++) {
                            errors += errorList[i] + "\r\n";
                        }
                        //alert(errors);
                    }
                    //this._updatePageSettingsActions();
                    //this._setViewerAction(_ViewerActionType.ShowSearchBar);
                    this._updateUI();
                }
            };
            ViewerBase.prototype._createPage = function (index, defPageSize) {
                return new viewer._Page(this._documentSource, index, defPageSize);
            };
            ViewerBase.prototype._clearKeepSerConnTimer = function () {
                if (this._keepSerConnTimer != null) {
                    clearTimeout(this._keepSerConnTimer);
                }
            };
            ViewerBase.prototype._keepServiceConnection = function () {
                var _this = this;
                this._clearKeepSerConnTimer();
                var documentSource = this._documentSource;
                if (!documentSource) {
                    return;
                }
                this._keepSerConnTimer = setTimeout(function () {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    _this._documentSource.getStatus().then(function (v) { return _this._keepServiceConnection(); });
                }, this._getExpiredTime());
            };
            ViewerBase.prototype._getExpiredTime = function () {
                if (this._expiredTime) {
                    return this._expiredTime;
                }
                var documentSource = this._documentSource;
                if (!documentSource || !documentSource.expiredDateTime || !documentSource.executionDateTime) {
                    return 6000;
                }
                this._expiredTime = documentSource.expiredDateTime.getTime() - documentSource.executionDateTime.getTime();
                this._expiredTime = Math.max(this._expiredTime - 120000, 0);
                return this._expiredTime;
            };
            ViewerBase.prototype._disposeDocument = function (disposeSource) {
                if (disposeSource === void 0) { disposeSource = true; }
                if (this._documentSource) {
                    viewer._removeAllWjHandlers(this._documentEventKey, this._documentSource.disposed);
                    viewer._removeAllWjHandlers(this._documentEventKey, this._documentSource.pageCountChanged);
                    viewer._removeAllWjHandlers(this._documentEventKey, this._documentSource.pageSettingsChanged);
                    viewer._removeAllWjHandlers(this._documentEventKey, this._documentSource.loadCompleted);
                    viewer._removeAllWjHandlers(this._documentEventKey, this._documentSource.queryLoadingData);
                    if (disposeSource) {
                        this._documentSource.dispose();
                    }
                }
                this._resetDocument();
            };
            ViewerBase.prototype._resetDocument = function () {
                this._pages.length = 0;
                this._pageView.resetPages();
                this._pageIndex = 0;
                clearTimeout(this._historyTimer);
                this._historyManager.clear();
                // reset tools
                if (this._rubberband) {
                    this._rubberband.reset();
                }
                if (this._magnifier) {
                    this._magnifier.reset();
                }
            };
            ViewerBase.prototype._setDocumentRendering = function () {
                this._documentSource._updateIsLoadCompleted(false);
            };
            /**
             * Moves to the page at the specified index.
             *
             * @param index Index (0-base) of the page to move to.
             * @return An {@link wijmo.viewer.IPromise} object with current page index.
             */
            ViewerBase.prototype.moveToPage = function (index) {
                return this._innerMoveToPage(index);
            };
            ViewerBase.prototype._getCurrentPosition = function () {
                return viewer._getPositionByHitTestInfo(this._pageView.hitTest(0, 0));
            };
            ViewerBase.prototype._resolvePageIndex = function (pageIndex) {
                return Math.min(this._documentSource.pageCount - 1, Math.max(pageIndex, 0));
            };
            ViewerBase.prototype._innerMoveToPage = function (pageIndex) {
                var _this = this;
                var resolvedIndex = this._resolvePageIndex(pageIndex);
                if (resolvedIndex != this.pageIndex) {
                    this._pageMoving = true;
                    this._addHistory(false, true);
                }
                this._updatePageIndex(pageIndex);
                return this._pageView.moveToPage(this.pageIndex).then(function () {
                    _this._pageMoving = false;
                });
            };
            ViewerBase.prototype._moveToLastPage = function () {
                var promise = new viewer._Promise();
                if (!this._ensureDocumentLoadCompleted(promise)) {
                    return promise;
                }
                return this._innerMoveToPage(this._documentSource.pageCount - 1);
            };
            ViewerBase.prototype._moveBackwardHistory = function () {
                if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canBackward()) {
                    return;
                }
                var history = this._historyManager.backward();
                this._moveToHistory(history);
            };
            ViewerBase.prototype._moveForwardHistory = function () {
                if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canForward()) {
                    return;
                }
                var history = this._historyManager.forward();
                this._moveToHistory(history);
            };
            ViewerBase.prototype._moveToHistory = function (history) {
                var _this = this;
                if (!history) {
                    return;
                }
                this._historyMoving = true;
                this.viewMode = history.viewMode;
                if (history.zoomMode === viewer.ZoomMode.Custom) {
                    this.zoomFactor = history.zoomFactor;
                }
                else {
                    this.zoomMode = history.zoomMode;
                }
                this._scrollToPosition(history.position).then(function (_) {
                    _this._historyMoving = false;
                });
                for (var i = 0; i < history.pageAngles.length; i++) {
                    this._pageView.rotatePageTo(i, history.pageAngles[i]);
                }
            };
            ViewerBase.prototype._isPositionEquals = function (p1, p2, checkBounds) {
                if (this._pageMoving) {
                    return false;
                }
                if (p1.pageIndex !== p2.pageIndex) {
                    return false;
                }
                if (!checkBounds) {
                    return true;
                }
                if (p1.pageBounds == p2.pageBounds) {
                    return true;
                }
                if (p1.pageBounds == null || p2.pageBounds == null) {
                    return false;
                }
                return p1.pageBounds.x === p2.pageBounds.x && p1.pageBounds.y === p2.pageBounds.y;
            };
            ViewerBase.prototype._isPageAnglesChanged = function (pageAngles) {
                if (pageAngles.length != this._pageView.pages.length) {
                    return true;
                }
                var length = pageAngles.length;
                for (var i = 0; i < length; i++) {
                    if (pageAngles[i] !== this._pageView.pages[i].rotateAngle) {
                        return true;
                    }
                }
                return false;
            };
            ViewerBase.prototype._updateHistoryCurrent = function (positionOnly) {
                if (positionOnly === void 0) { positionOnly = false; }
                this._historyManager.current.position = this._getCurrentPosition();
                if (!positionOnly) {
                    this._historyManager.current.zoomMode = this.zoomMode;
                    this._historyManager.current.zoomFactor = this.zoomFactor;
                    this._historyManager.current.viewMode = this.viewMode;
                    this._updateCurrentPageAngles(this._historyManager.current);
                }
            };
            ViewerBase.prototype._innerAddHistory = function (checkBounds) {
                var currentPosition = this._getCurrentPosition(), current = this._historyManager.current;
                if (this._isPositionEquals(currentPosition, current.position, checkBounds)
                    && this.viewMode === current.viewMode
                    && this.zoomMode === current.zoomMode
                    && this.zoomFactor === current.zoomFactor
                    && !this._isPageAnglesChanged(current.pageAngles)) {
                    return;
                }
                current.position = current.position || this._getCurrentPosition();
                current.viewMode = current.viewMode == null ? this.viewMode : current.viewMode;
                current.zoomMode = current.zoomMode == null ? this.zoomMode : current.zoomMode;
                current.zoomFactor = current.zoomFactor == null ? this.zoomFactor : current.zoomFactor;
                if (!current.pageAngles) {
                    this._updateCurrentPageAngles(current);
                }
                this._historyManager.add();
                this._updateHistoryCurrent();
            };
            ViewerBase.prototype._addHistory = function (checkBounds, delay, history, prohibitOther) {
                var _this = this;
                if (prohibitOther === void 0) { prohibitOther = false; }
                if (this._prohibitAddHistory || this.isUpdating || this._historyMoving || !this._isDocumentSourceLoaded()) {
                    return;
                }
                if (prohibitOther) {
                    this._prohibitAddHistory = true;
                }
                if (!delay) {
                    this._innerAddHistory(checkBounds);
                    this._prohibitAddHistory = false;
                    return;
                }
                this._mergeHistory(history);
                if (this._historyTimer != null) {
                    clearTimeout(this._historyTimer);
                }
                this._historyTimer = setTimeout(function () {
                    _this._historyTimer = null;
                    _this._innerAddHistory(checkBounds);
                    _this._prohibitAddHistory = false;
                }, ViewerBase._historyTimeout);
            };
            ViewerBase.prototype._updateCurrentPageAngles = function (current) {
                if (!current.pageAngles) {
                    current.pageAngles = new Array();
                }
                var pagesLength = this._pageView.pages.length;
                for (var i = 0; i < pagesLength; i++) {
                    current.pageAngles[i] = this._pageView.pages[i].rotateAngle;
                }
            };
            ViewerBase.prototype._mergeHistory = function (history) {
                var current = this._historyManager.current;
                if (!history) {
                    current.viewMode = this.viewMode;
                    current.zoomMode = this.zoomMode;
                    current.zoomFactor = this.zoomFactor;
                    this._updateCurrentPageAngles(current);
                    return;
                }
                if (history.viewMode != null) {
                    current.viewMode = history.viewMode;
                }
                if (history.zoomMode != null) {
                    current.zoomMode = history.zoomMode;
                }
                if (history.zoomFactor != null) {
                    current.zoomFactor = history.zoomFactor;
                }
                if (history.pageAngles) {
                    current.pageAngles = new Array();
                    var pagesLength = this._pageView.pages.length;
                    for (var i = 0; i < pagesLength; i++) {
                        current.pageAngles[i] = history.pageAngles[i];
                    }
                }
            };
            ViewerBase.prototype._ensureDocumentLoadCompleted = function (promise) {
                if (!this._documentSource) {
                    if (promise) {
                        promise.reject('Cannot set page index without document source.');
                    }
                    return false;
                }
                if (!this._documentSource.isLoadCompleted) {
                    if (promise) {
                        promise.reject('Cannot set page index when document source is not loaded completely.');
                    }
                    return false;
                }
                return true;
            };
            ViewerBase.prototype._updatePageIndex = function (index) {
                if (!this._documentSource) {
                    return;
                }
                index = Math.min(this._documentSource.pageCount - 1, Math.max(index, 0));
                if (this._pageIndex === index) {
                    return;
                }
                this._pageIndex = index;
                this.onPageIndexChanged();
            };
            ViewerBase.prototype._getRotatedAngle = function (currentAngle) {
                switch (currentAngle) {
                    case viewer._RotateAngle.NoRotate:
                        return viewer._RotateAngle.Rotation90;
                    case viewer._RotateAngle.Rotation90:
                        return viewer._RotateAngle.Rotation180;
                    case viewer._RotateAngle.Rotation180:
                        return viewer._RotateAngle.Rotation270;
                    case viewer._RotateAngle.Rotation270:
                        return viewer._RotateAngle.NoRotate;
                }
                return viewer._RotateAngle.NoRotate;
            };
            ViewerBase.prototype._rotateDocument = function () {
                this._addHistory(false, true);
                var pagesLength = this._pageView.pages.length;
                for (var i = 0; i < pagesLength; i++) {
                    this._pageView.rotatePageTo(i, this._getRotatedAngle(this._pageView.pages[i].rotateAngle));
                }
            };
            ViewerBase.prototype._rotatePage = function () {
                this._addHistory(false, true);
                var currentPage = this._pageView.pages[this._pageIndex];
                this._pageView.rotatePageTo(this._pageIndex, this._getRotatedAngle(currentPage.rotateAngle));
            };
            Object.defineProperty(ViewerBase.prototype, "zoomMode", {
                /**
                 * Gets or sets a value indicating the current zoom mode to show the document pages.
                 */
                get: function () {
                    return this._pageView.zoomMode;
                },
                set: function (value) {
                    this._pageView.zoomMode = wijmo.asEnum(value, viewer.ZoomMode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "zoomFactor", {
                /**
                 * Gets or sets a value indicating the current zoom factor to show the document pages.
                 */
                get: function () {
                    return this._pageView.zoomFactor;
                },
                set: function (value) {
                    this._pageView.zoomFactor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "viewMode", {
                /**
                * Gets or sets a value indicating how to show the document pages.
                */
                get: function () {
                    return this._viewMode;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, viewer.ViewMode);
                    if (this._viewMode !== value) {
                        var oldValue = this._viewMode;
                        this._viewMode = value;
                        this.onViewModeChanged(oldValue, value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "mouseMode", {
                /**
                * Gets or sets a value indicating the mouse behavior.
                *
                * The default is SelectTool which means clicking and dragging the mouse will select the text.
                */
                get: function () {
                    return this._mouseMode;
                },
                set: function (value) {
                    if (this._mouseMode === (value = wijmo.asEnum(value, viewer.MouseMode))) {
                        return;
                    }
                    this._mouseMode = value;
                    switch (this._mouseMode) {
                        case viewer.MouseMode.RubberbandTool:
                            this._rubberband.activate();
                            this._magnifier.deactivate();
                            break;
                        case viewer.MouseMode.MagnifierTool:
                            this._magnifier.activate();
                            this._rubberband.deactivate();
                            break;
                        default:
                            this._magnifier.deactivate();
                            this._rubberband.deactivate();
                            break;
                    }
                    this.onMouseModeChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "fullScreen", {
                /**
                * Gets or sets a value indicating whether the viewer is under full screen mode.
                */
                get: function () {
                    return this._fullScreen;
                },
                set: function (value) {
                    if (this._fullScreen === value) {
                        return;
                    }
                    this._fullScreen = value;
                    this.onFullScreenChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "pageIndex", {
                /**
                * Gets the index of the page which is currently displayed in the view panel.
                */
                get: function () {
                    return this._pageIndex;
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype._initMiniToolbar = function () {
                var miniToolbar = wijmo.Control.getControl(this._miniToolbar);
                if (!miniToolbar) {
                    new viewer._ViewerMiniToolbar(this._miniToolbar, this);
                    wijmo.addClass(this._miniToolbar, "wj-mini-toolbar");
                }
            };
            ViewerBase.prototype._pinMiniToolbar = function () {
                var _this = this;
                this._showMiniToolbar(true);
                this._miniToolbarPinnedTimer = setTimeout(function () {
                    _this._showMiniToolbar(false);
                    _this._miniToolbarPinnedTimer = null;
                }, ViewerBase._miniToolbarPinnedTime);
            };
            // Raises the {@link _documentSourceChanged} event.
            // @param e The event arguments.
            ViewerBase.prototype._onDocumentSourceChanged = function (e) {
                this._clearExportFormats();
                this._documentSourceChanged.raise(this);
                this._updateViewerActions();
                this._onPageSettingsUpdated();
                this._onPageCountUpdated();
                this._updateViewModeActions();
                this._searchManager.documentSource = this._documentSource;
                if (this._documentSource) {
                    viewer._addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, this._onPageSettingsUpdated, this);
                    viewer._addWjHandler(this._documentEventKey, this._documentSource.pageCountChanged, this._onPageCountUpdated, this);
                    viewer._addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, this._onPageCountUpdated, this);
                }
            };
            /**
             * Raises the {@link pageIndexChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onPageIndexChanged = function (e) {
                this.pageIndexChanged.raise(this);
                this._updatePageNavActions();
            };
            /**
             * Raises the {@link viewModeChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onViewModeChanged = function (oldValue, newValue) {
                this.viewModeChanged.raise(this, { oldValue: oldValue, newValue: newValue });
                this._updateViewModeActions();
                this._pageView.viewMode = this.viewMode;
            };
            /**
             * Raises the {@link mouseModeChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onMouseModeChanged = function (e) {
                this.mouseModeChanged.raise(this);
                //if mouse mode is move or select, do nothing on mobile.
                if ((this.mouseMode === viewer.MouseMode.MoveTool || this.mouseMode === viewer.MouseMode.SelectTool) && wijmo.isMobile()) {
                    return;
                }
                this._updateMouseModeActions();
                this._updateViewContainerCursor();
                this._pageView.panMode = this.mouseMode === viewer.MouseMode.MoveTool;
            };
            /**
             * Raises the {@link fullScreenChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onFullScreenChanged = function (e) {
                this.fullScreenChanged.raise(this);
                this._setViewerAction(viewer._ViewerActionType.ToggleFullScreen);
                this._updateFullScreenStyle();
                if (this.fullScreen) {
                    this._pinMiniToolbar();
                }
            };
            /**
             * Raises the {@link zoomFactorChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onZoomFactorChanged = function (e) {
                this.zoomFactorChanged.raise(this, e);
                this._updateZoomFactorActions();
                this._updateZoomModeActions();
            };
            /**
             * Raises the {@link zoomModeChanged} event.
             *
             * @param e The {@link EventArgs} object.
             */
            ViewerBase.prototype.onZoomModeChanged = function (e) {
                this.zoomModeChanged.raise(this, e);
                this._updateZoomModeActions();
                this._updateZoomFactorActions();
            };
            /**
             * Raises the {@link queryLoadingData} event.
             *
             * @param e The {@link QueryLoadingDataEventArgs} object that contains the loading data.
             */
            ViewerBase.prototype.onQueryLoadingData = function (e) {
                this.queryLoadingData.raise(this, e);
            };
            /**
             * Raises the {@link beforeSendRequest} event.
             *
             * @param e The {@link RequestEventArgs} object.
             */
            ViewerBase.prototype.onBeforeSendRequest = function (e) {
                this.beforeSendRequest.raise(this, e);
            };
            /**
             * Raises the {@link pageLoaded} event.
             *
             * @param e The {@link PageLoadedEventArgs} object.
             */
            ViewerBase.prototype.onPageLoaded = function (e) {
                this.pageLoaded.raise(this, e);
            };
            // IHttpRequestHandler implementation
            ViewerBase.prototype.beforeSend = function (e) {
                this.onBeforeSendRequest(e);
            };
            ViewerBase._seperatorHtml = "<div class='wj-separator' style='width:100%;height: 1px;margin: 3px 0;background-color:rgba(0,0,0,.2)'></div>";
            ViewerBase._viewpanelContainerMinHeight = 300;
            ViewerBase._miniToolbarPinnedTime = 3000;
            ViewerBase._narrowCss = 'narrow';
            ViewerBase._narrowWidthThreshold = 400;
            ViewerBase._thumbnailWidth = 100;
            ViewerBase._historyTimeout = 300;
            ViewerBase._zoomValuesFormatter = function (value) { return Math.floor(value * 100 + 0.5) + " %"; };
            ViewerBase._zoomValuesParser = function (text) { return parseFloat(text.replace(' %', '')); };
            ViewerBase._defaultZoomValues = [0.05, 0.25, 0.5, 0.75, 1, 2, 3, 4, 8, 10]
                .map(function (value) { return ({ value: value, name: ViewerBase._zoomValuesFormatter(value) }); });
            /**
             * Gets or sets the template used to instantiate the viewer controls.
             */
            ViewerBase.controlTemplate = '<div class="wj-viewer-outer wj-content with-footer">' +
                '<div wj-part="toolbar"></div>' +
                '<div wj-part="mobile-toolbar"></div>' +
                '<div class="wj-viewer-container" wj-part="viewer-container">' +
                '<div class="wj-viewer-leftpanel" wj-part="viewer-left-panel">' +
                '<div class="wj-viewer-tabsleft" wj-part="side-panel">' +
                '</div>' +
                '</div>' +
                '<div class="wj-viewer-splitter" wj-part="splitter">' +
                '<button class="wj-btn wj-btn-default">' +
                '<span class="wj-glyph-right"></span>' +
                '</button>' +
                '</div>' +
                '<div class="wj-viewpanel-container" wj-part="viewpanel-container"></div>' +
                '</div>' +
                '<div wj-part="mini-toolbar"></div>' +
                '<div class="wj-searchbar mobile" wj-part="search-bar"></div>' +
                '<div class="wj-viewer-footer mobile" class="wj-viewer-footer" wj-part="viewer-footer">' +
                '<div wj-part="zoom-bar"></div>' +
                '<span class="wj-close">×</span>' +
                '</div>' +
                '</div>';
            return ViewerBase;
        }(wijmo.Control));
        viewer.ViewerBase = ViewerBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Defines the PDFViewer control for displaying the PDF document.
         *
         * The {@link serviceUrl} property indicates the url of C1 Web API which provides PDF services.
         * The PDF services use C1PdfDocumentSource to process PDF document.
         *
         * Here is the sample to show a PDF document:
         * ```typescript
         * import { PdfViewer } from '@grapecity/wijmo.viewer';
         * var pdfViewer = new PdfViewer('#pdfViewer');
         * pdfViewer.serviceUrl= 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/report';
         * pdfViewer.filePath= 'PdfRoot/DefaultDocument.pdf';
         * ```
         */
        var PdfViewer = /** @class */ (function (_super) {
            __extends(PdfViewer, _super);
            /**
             * Initializes a new instance of the {@link PdfViewer} class.
             *
             * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PdfViewer(element, options) {
                return _super.call(this, element, options) || this;
            }
            PdfViewer.prototype._getProductInfo = function () {
                return 'QNI5,PdfViewer';
            };
            Object.defineProperty(PdfViewer.prototype, "_innerDocumentSource", {
                get: function () {
                    return this._getDocumentSource();
                },
                enumerable: true,
                configurable: true
            });
            PdfViewer.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                return new viewer._PdfDocumentSource({
                    serviceUrl: this.serviceUrl,
                    filePath: this.filePath
                }, this);
            };
            return PdfViewer;
        }(viewer.ViewerBase));
        viewer.PdfViewer = PdfViewer;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_2) {
        'use strict';
        var _ViewerMiniToolbar = /** @class */ (function (_super) {
            __extends(_ViewerMiniToolbar, _super);
            function _ViewerMiniToolbar(element, viewer) {
                return _super.call(this, element, viewer) || this;
            }
            _ViewerMiniToolbar.prototype._initToolbarItems = function () {
                var ci = wijmo.culture.Viewer;
                this._gPrint = this.addSvgButton(ci.print, viewer_2.icons.print, viewer_2._ViewerActionType.Print);
                this.addSeparator();
                this._gPreviousPage = this.addSvgButton(ci.previousPage, viewer_2.icons.previousPage, viewer_2._ViewerActionType.PrePage);
                this._gNextPage = this.addSvgButton(ci.nextPage, viewer_2.icons.nextPage, viewer_2._ViewerActionType.NextPage);
                viewer_2._ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
                this.addSeparator();
                this._gZoomOut = this.addSvgButton(ci.zoomOut, viewer_2.icons.zoomOut, viewer_2._ViewerActionType.ZoomOut);
                this._gZoomIn = this.addSvgButton(ci.zoomIn, viewer_2.icons.zoomIn, viewer_2._ViewerActionType.ZoomIn);
                this._gExitFullScreen = this.addSvgButton(ci.exitFullScreen, viewer_2.icons.exitFullScreen, viewer_2._ViewerActionType.ToggleFullScreen, true);
            };
            _ViewerMiniToolbar.prototype._globalize = function () {
                var ci = wijmo.culture.Viewer;
                this._gPrint.title = ci.print;
                this._gPreviousPage.title = ci.previousPage;
                this._gNextPage.title = ci.nextPage;
                this._gZoomOut.title = ci.zoomOut;
                this._gZoomIn.title = ci.zoomIn;
                this._gExitFullScreen.title = ci.exitFullScreen;
            };
            return _ViewerMiniToolbar;
        }(viewer_2._ViewerToolbarBase));
        viewer_2._ViewerMiniToolbar = _ViewerMiniToolbar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_3) {
        'use strict';
        var _ViewerToolbar = /** @class */ (function (_super) {
            __extends(_ViewerToolbar, _super);
            function _ViewerToolbar(element, viewer) {
                return _super.call(this, element, viewer) || this;
            }
            _ViewerToolbar.prototype._globalize = function () {
                var ci = wijmo.culture.Viewer;
                this._gPaginated.title = ci.paginated;
                this._gPrint.title = ci.print;
                this._gExports.title = ci.exports;
                this._gPortrait.title = ci.portrait;
                this._gLandscape.title = ci.landscape;
                this._gPageSetup.title = ci.pageSetup;
                this._gFirstPage.title = ci.firstPage;
                this._gPreviousPage.title = ci.previousPage;
                this._gNextPage.title = ci.nextPage;
                this._gLastPage.title = ci.lastPage;
                this._gBackwardHistory.title = ci.backwardHistory;
                this._gForwardHistory.title = ci.forwardHistory;
                this._gSelectTool.title = ci.selectTool;
                this._gMoveTool.title = ci.moveTool;
                this._gContinuousMode.title = ci.continuousMode;
                this._gSingleMode.title = ci.singleMode;
                this._gWholePage.title = ci.wholePage;
                this._gPageWidth.title = ci.pageWidth;
                this._gZoomOut.title = ci.zoomOut;
                this._gZoomIn.title = ci.zoomIn;
                this._gRubberbandTool.title = ci.rubberbandTool;
                this._gMagnifierTool.title = ci.magnifierTool;
                this._gRotateDocument.title = ci.rotateDocument;
                this._gRotatePage.title = ci.rotatePage;
                this._gFullScreen.title = ci.fullScreen;
            };
            _ViewerToolbar.prototype._initToolbarItems = function () {
                var ci = wijmo.culture.Viewer;
                this._gPaginated = this.addSvgButton(ci.paginated, viewer_3.icons.paginated, viewer_3._ViewerActionType.TogglePaginated, true);
                this._gPrint = this.addSvgButton(ci.print, viewer_3.icons.print, viewer_3._ViewerActionType.Print);
                this._gExports = this.addSvgButton(ci.exports, viewer_3.icons.exports, viewer_3._ViewerActionType.ShowExportsPanel);
                this.addSeparator();
                this._gPortrait = this.addSvgButton(ci.portrait, viewer_3.icons.portrait, viewer_3._ViewerActionType.Portrait);
                this._gLandscape = this.addSvgButton(ci.landscape, viewer_3.icons.landscape, viewer_3._ViewerActionType.Landscape);
                this._gPageSetup = this.addSvgButton(ci.pageSetup, viewer_3.icons.pageSetup, viewer_3._ViewerActionType.ShowPageSetupDialog);
                this.addSeparator();
                this._gFirstPage = this.addSvgButton(ci.firstPage, viewer_3.icons.firstPage, viewer_3._ViewerActionType.FirstPage);
                this._gPreviousPage = this.addSvgButton(ci.previousPage, viewer_3.icons.previousPage, viewer_3._ViewerActionType.PrePage);
                this._gNextPage = this.addSvgButton(ci.nextPage, viewer_3.icons.nextPage, viewer_3._ViewerActionType.NextPage);
                this._gLastPage = this.addSvgButton(ci.lastPage, viewer_3.icons.lastPage, viewer_3._ViewerActionType.LastPage);
                viewer_3._ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
                this.addSeparator();
                this._gBackwardHistory = this.addSvgButton(ci.backwardHistory, viewer_3.icons.backwardHistory, viewer_3._ViewerActionType.Backward);
                this._gForwardHistory = this.addSvgButton(ci.forwardHistory, viewer_3.icons.forwardHistory, viewer_3._ViewerActionType.Forward);
                this.addSeparator();
                this._gSelectTool = this.addSvgButton(ci.selectTool, viewer_3.icons.selectTool, viewer_3._ViewerActionType.SelectTool);
                this._gMoveTool = this.addSvgButton(ci.moveTool, viewer_3.icons.moveTool, viewer_3._ViewerActionType.MoveTool);
                this._gContinuousMode = this.addSvgButton(ci.continuousMode, viewer_3.icons.continuousView, viewer_3._ViewerActionType.Continuous);
                this._gSingleMode = this.addSvgButton(ci.singleMode, viewer_3.icons.singleView, viewer_3._ViewerActionType.Single);
                this.addSeparator();
                this._gWholePage = this.addSvgButton(ci.wholePage, viewer_3.icons.fitWholePage, viewer_3._ViewerActionType.FitWholePage);
                this._gPageWidth = this.addSvgButton(ci.pageWidth, viewer_3.icons.fitPageWidth, viewer_3._ViewerActionType.FitPageWidth);
                this._gZoomOut = this.addSvgButton(ci.zoomOut, viewer_3.icons.zoomOut, viewer_3._ViewerActionType.ZoomOut);
                this._gZoomIn = this.addSvgButton(ci.zoomIn, viewer_3.icons.zoomIn, viewer_3._ViewerActionType.ZoomIn);
                //todo change rubberband icon.
                this._gRubberbandTool = this.addSvgButton(ci.rubberbandTool, viewer_3.icons.rubberbandTool, viewer_3._ViewerActionType.RubberbandTool);
                this._gMagnifierTool = this.addSvgButton(ci.magnifierTool, viewer_3.icons.magnifierTool, viewer_3._ViewerActionType.MagnifierTool);
                this._gRotateDocument = this.addSvgButton(ci.rotateDocument, viewer_3.icons.rotateDocument, viewer_3._ViewerActionType.RotateDocument);
                this._gRotatePage = this.addSvgButton(ci.rotatePage, viewer_3.icons.rotatePage, viewer_3._ViewerActionType.RotatePage);
                viewer_3._ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer);
                this._gFullScreen = this.addSvgButton(ci.fullScreen, viewer_3.icons.fullScreen, viewer_3._ViewerActionType.ToggleFullScreen, true);
            };
            return _ViewerToolbar;
        }(viewer_3._ViewerToolbarBase));
        viewer_3._ViewerToolbar = _ViewerToolbar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_4) {
        'use strict';
        var _ViewerMobileToolbarBase = /** @class */ (function (_super) {
            __extends(_ViewerMobileToolbarBase, _super);
            function _ViewerMobileToolbarBase(element, viewer) {
                var _this = _super.call(this, element, viewer) || this;
                wijmo.addClass(_this.hostElement, 'mobile');
                return _this;
            }
            return _ViewerMobileToolbarBase;
        }(viewer_4._ViewerToolbarBase));
        viewer_4._ViewerMobileToolbarBase = _ViewerMobileToolbarBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_5) {
        'use strict';
        var _ViewerZoomBar = /** @class */ (function (_super) {
            __extends(_ViewerZoomBar, _super);
            function _ViewerZoomBar(element, viewer) {
                var _this = _super.call(this, element, viewer) || this;
                wijmo.addClass(_this.hostElement, 'wj-zoombar');
                return _this;
            }
            _ViewerZoomBar.prototype._initToolbarItems = function () {
                var ci = wijmo.culture.Viewer;
                this._gZoomOut = this.addSvgButton(ci.zoomOut, viewer_5.icons.zoomOut, viewer_5._ViewerActionType.ZoomOut);
                viewer_5._ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer);
                this._gZoomIn = this.addSvgButton(ci.zoomIn, viewer_5.icons.zoomIn, viewer_5._ViewerActionType.ZoomIn);
            };
            _ViewerZoomBar.prototype._globalize = function () {
                var ci = wijmo.culture.Viewer;
                this._gZoomOut.title = ci.zoomOut;
                this._gZoomIn.title = ci.zoomIn;
            };
            return _ViewerZoomBar;
        }(viewer_5._ViewerMobileToolbarBase));
        viewer_5._ViewerZoomBar = _ViewerZoomBar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_6) {
        'use strict';
        var _ViewerMobileToolbar = /** @class */ (function (_super) {
            __extends(_ViewerMobileToolbar, _super);
            function _ViewerMobileToolbar(element, viewer) {
                return _super.call(this, element, viewer) || this;
            }
            _ViewerMobileToolbar.prototype._initToolbarItems = function () {
                var ci = wijmo.culture.Viewer;
                this._gShowHamburgerMenu = this.addSvgButton(ci.hamburgerMenu, viewer_6.icons.hamburgerMenu, viewer_6._ViewerActionType.ShowHamburgerMenu);
                this.viewer._initHamburgerMenu(this._gShowHamburgerMenu);
                this._gPrevPage = this.addSvgButton(ci.previousPage, viewer_6.icons.previousPage, viewer_6._ViewerActionType.PrePage);
                this._gNextPage = this.addSvgButton(ci.nextPage, viewer_6.icons.nextPage, viewer_6._ViewerActionType.NextPage);
                viewer_6._ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
                this._gShowViewMenu = this.addSvgButton(ci.viewMenu, viewer_6.icons.viewMenu, viewer_6._ViewerActionType.ShowViewMenu);
                this.viewer._initViewMenu(this._gShowViewMenu);
                this._gShowSearchBar = this.addSvgButton(ci.showSearchBar, viewer_6.icons.search, viewer_6._ViewerActionType.ShowSearchBar, true);
                this._gFullScreen = this.addSvgButton(ci.fullScreen, viewer_6.icons.fullScreen, viewer_6._ViewerActionType.ToggleFullScreen, true);
            };
            _ViewerMobileToolbar.prototype._globalize = function () {
                var ci = wijmo.culture.Viewer;
                this._gShowHamburgerMenu.title = ci.hamburgerMenu;
                this._gPrevPage.title = ci.previousPage;
                this._gNextPage.title = ci.nextPage;
                this._gShowViewMenu.title = ci.viewMenu;
                this._gShowSearchBar.title = ci.showSearchBar;
                this._gFullScreen.title = ci.fullScreen;
            };
            return _ViewerMobileToolbar;
        }(viewer_6._ViewerMobileToolbarBase));
        viewer_6._ViewerMobileToolbar = _ViewerMobileToolbar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_7) {
        'use strict';
        var _SearchBar = /** @class */ (function (_super) {
            __extends(_SearchBar, _super);
            function _SearchBar(element, viewer) {
                return _super.call(this, element, viewer) || this;
            }
            _SearchBar.prototype._initToolbarItems = function () {
                var ci = wijmo.culture.Viewer;
                this._gSearchOptions = this.addSvgButton(ci.searchOptions, viewer_7.icons.searchOptions, viewer_7._ViewerActionType.ShowSearchOptions);
                this.viewer._initSearchOptionsMenu(this._gSearchOptions);
                this._initSearchInput();
                this._initSearchBtnGroups();
            };
            _SearchBar.prototype._initSearchInput = function () {
                var _this = this;
                var searchContainerHtml = '<div class="wj-searchcontainer">' +
                    '<input class="wj-searchbox" wj-part="search-box" type="text"/>' +
                    '<div class="wj-btn-group">' +
                    '<button class="wj-btn wj-btn-search">' + viewer_7._createSvgBtn(viewer_7.icons.search).innerHTML + '</button>' +
                    '</div>' +
                    '</div>', searchContainer = viewer_7._toDOM(searchContainerHtml), input = searchContainer.querySelector('input[type="text"]'), searchBtn = searchContainer.querySelector('.wj-btn-search');
                viewer_7._addEvent(input, 'input', function () { _this.viewer._searchManager.text = input.value; });
                viewer_7._addEvent(searchBtn, 'click', function () { _this.viewer._searchManager.search(); });
                this.viewer._searchManager.searchStarted.addHandler(function () {
                    // update input value if search is being initiated in other places
                    if (input.value !== _this.viewer._searchManager.text) {
                        input.value = _this.viewer._searchManager.text;
                    }
                    input.disabled = true;
                });
                this.viewer._searchManager.searchCompleted.addHandler(function () {
                    input.disabled = false;
                });
                this.viewer._searchManager.textChanged.addHandler(function () {
                    // set input value in accordance with search text
                    input.value = _this.viewer._searchManager.text;
                });
                this.addCustomItem(searchContainer);
            };
            // put all buttons after search container input one div to implement search container auto width.
            _SearchBar.prototype._initSearchBtnGroups = function () {
                var searchBtnGroupsHtml = '<div class="wj-searchbtn-groups wj-btn-group wj-toolbarwrapper">' +
                    '</div>', searchBtnGroups = viewer_7._toDOM(searchBtnGroupsHtml);
                var ci = wijmo.culture.Viewer;
                this._gSearchPrev = this.addSvgButton(ci.searchPrev, viewer_7.icons.searchLeft, viewer_7._ViewerActionType.SearchPrev);
                this._gSearchNext = this.addSvgButton(ci.searchNext, viewer_7.icons.searchRight, viewer_7._ViewerActionType.SearchNext);
                searchBtnGroups.appendChild(this._gSearchPrev);
                searchBtnGroups.appendChild(this._gSearchNext);
                this.addCustomItem(searchBtnGroups);
            };
            _SearchBar.prototype._globalize = function () {
                var ci = wijmo.culture.Viewer;
                this._gSearchOptions.title = ci.searchOptions;
                this._gSearchPrev.title = ci.searchPrev;
                this._gSearchNext.title = ci.searchNext;
            };
            return _SearchBar;
        }(viewer_7._ViewerMobileToolbarBase));
        viewer_7._SearchBar = _SearchBar;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_8) {
        'use strict';
        var _ViewerMenuBase = /** @class */ (function (_super) {
            __extends(_ViewerMenuBase, _super);
            function _ViewerMenuBase(viewer, owner, options) {
                var _this = _super.call(this, document.createElement('div'), options) || this;
                _this.owner = owner;
                // Have to set hostElement(the empty div) with none display, and add it in document,
                // otherwise, the dropdown element will be shown in middle of the document in DropDown.refresh method.
                _this.hostElement.style.display = 'none';
                _this.owner.appendChild(_this.hostElement);
                _this.showDropDownButton = false;
                _this.itemClicked.addHandler(_this._onItemClicked, _this);
                _this.formatItem.addHandler(_this._formatItem, _this);
                _this._viewer = viewer;
                _this._bindMenuItems();
                _this.displayMemberPath = 'title';
                _this.selectedValuePath = 'commandTag';
                _this._viewer._viewerActionStatusChanged.addHandler(function (s, e) {
                    var actionElement = _this.dropDown.querySelector('[' + viewer_8._commandTagAttr + '="' + e.action.actionType.toString() + '"]');
                    _this._updateActionStatusCore(actionElement, e.action);
                });
                return _this;
            }
            Object.defineProperty(_ViewerMenuBase.prototype, "viewer", {
                get: function () {
                    return this._viewer;
                },
                enumerable: true,
                configurable: true
            });
            _ViewerMenuBase.prototype._bindMenuItems = function () {
                this.itemsSource = this._initItems();
            };
            _ViewerMenuBase.prototype._initItems = function () {
                throw wijmo.culture.Viewer.abstractMethodException;
            };
            _ViewerMenuBase.prototype._internalFormatItem = function (item, itemElement) {
                if (!item || item.commandTag === undefined) {
                    return;
                }
                viewer_8._removeChildren(itemElement);
                if (item.icon) {
                    var iconSpan = document.createElement('span');
                    iconSpan.appendChild(viewer_8._createSvgBtn(item.icon));
                    itemElement.insertBefore(iconSpan, itemElement.firstChild);
                }
                itemElement.setAttribute(viewer_8._commandTagAttr, item.commandTag.toString());
                this._updateActionStatus(itemElement, item.commandTag);
            };
            _ViewerMenuBase.prototype._formatItem = function (sender, e) {
                this._internalFormatItem(this.itemsSource[e.index], e.item);
            };
            _ViewerMenuBase.prototype._onItemClicked = function (menu) {
                this._viewer._executeAction(parseInt(menu.selectedItem.commandTag));
            };
            _ViewerMenuBase.prototype._updateActionStatus = function (actionElement, actionType) {
                this._updateActionStatusCore(actionElement, {
                    actionType: actionType,
                    checked: this._viewer._actionIsChecked(actionType),
                    disabled: this._viewer._actionIsDisabled(actionType),
                    shown: this._viewer._actionIsShown(actionType)
                });
            };
            _ViewerMenuBase.prototype._updateActionStatusCore = function (actionElement, action) {
                viewer_8._checkImageButton(actionElement, action.checked);
                viewer_8._disableImageButton(actionElement, action.disabled);
                viewer_8._showImageButton(actionElement, action.shown);
            };
            _ViewerMenuBase.prototype._updateItemsStatus = function () {
                var elements = this.dropDown.querySelectorAll('[' + viewer_8._commandTagAttr + ']');
                for (var i = 0; i < elements.length; i++) {
                    var actionElement = elements[i], commandTagValue = actionElement.getAttribute(viewer_8._commandTagAttr);
                    if (commandTagValue == null) {
                        continue;
                    }
                    this._updateActionStatus(actionElement, parseInt(commandTagValue));
                }
                viewer_8._checkSeparatorShown(this.dropDown);
            };
            _ViewerMenuBase.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._bindMenuItems();
                }
                if (this.isDroppedDown) {
                    this.showMenu();
                }
            };
            _ViewerMenuBase.prototype.showMenu = function (above) {
                this.selectedIndex = -1;
                wijmo.showPopup(this.dropDown, this.owner, above, false, false);
                this.dropDown.style.color = this._viewer.hostElement.style.color;
                wijmo.addClass(this.dropDown, 'wj-btn-group-vertical');
                wijmo.addClass(this.dropDown, 'wj-viewer-menu');
                this._updateItemsStatus();
                this.dropDown.focus();
            };
            return _ViewerMenuBase;
        }(wijmo.input.Menu));
        viewer_8._ViewerMenuBase = _ViewerMenuBase;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_9) {
        'use strict';
        var _SearchOptionsMenu = /** @class */ (function (_super) {
            __extends(_SearchOptionsMenu, _super);
            function _SearchOptionsMenu(viewer, owner, options) {
                return _super.call(this, viewer, owner, options) || this;
            }
            _SearchOptionsMenu.prototype._initItems = function () {
                var items = [];
                items.push({ title: wijmo.culture.Viewer.matchCaseMenuItem, commandTag: viewer_9._ViewerActionType.SearchMatchCase });
                items.push({ title: wijmo.culture.Viewer.wholeWordMenuItem, commandTag: viewer_9._ViewerActionType.SearchMatchWholeWord });
                return items;
            };
            _SearchOptionsMenu.prototype._internalFormatItem = function (item, itemElement) {
                _super.prototype._internalFormatItem.call(this, item, itemElement);
                if (!item || item.commandTag === undefined) {
                    return;
                }
                var checkSpan = document.createElement('span');
                checkSpan.innerHTML = wijmo.culture.Viewer.checkMark;
                wijmo.addClass(checkSpan, 'checkIcon');
                itemElement.insertBefore(checkSpan, itemElement.firstChild);
            };
            _SearchOptionsMenu.prototype._updateActionStatus = function (actionElement, actionType) {
                _super.prototype._updateActionStatus.call(this, actionElement, actionType);
                if (this.viewer._actionIsChecked(actionType)) {
                    wijmo.addClass(actionElement, 'checked');
                }
                else {
                    wijmo.removeClass(actionElement, 'checked');
                }
            };
            return _SearchOptionsMenu;
        }(viewer_9._ViewerMenuBase));
        viewer_9._SearchOptionsMenu = _SearchOptionsMenu;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_10) {
        'use strict';
        var _HamburgerMenu = /** @class */ (function (_super) {
            __extends(_HamburgerMenu, _super);
            function _HamburgerMenu(viewer, owner, options) {
                return _super.call(this, viewer, owner, options) || this;
            }
            _HamburgerMenu.prototype._initItems = function () {
                var items = [], ci = wijmo.culture.Viewer;
                items.push({ title: ci.thumbnails, icon: viewer_10.icons.thumbnails, commandTag: viewer_10._ViewerActionType.ShowThumbnails });
                items.push({ title: ci.outlines, icon: viewer_10.icons.outlines, commandTag: viewer_10._ViewerActionType.ShowOutlines });
                items.push({ title: ci.exports, icon: viewer_10.icons.exports, commandTag: viewer_10._ViewerActionType.ShowExportsPanel });
                items.push({ title: viewer_10.ViewerBase._seperatorHtml });
                items.push({ title: ci.portrait, icon: viewer_10.icons.portrait, commandTag: viewer_10._ViewerActionType.Portrait });
                items.push({ title: ci.landscape, icon: viewer_10.icons.landscape, commandTag: viewer_10._ViewerActionType.Landscape });
                items.push({ title: ci.pageSetup, icon: viewer_10.icons.pageSetup, commandTag: viewer_10._ViewerActionType.ShowPageSetupPanel });
                items.push({ title: viewer_10.ViewerBase._seperatorHtml });
                items.push({ title: ci.showZoomBar, icon: viewer_10.icons.showZoomBar, commandTag: viewer_10._ViewerActionType.ShowZoomBar });
                items.push({ title: viewer_10.ViewerBase._seperatorHtml });
                items.push({ title: ci.paginated, icon: viewer_10.icons.paginated, commandTag: viewer_10._ViewerActionType.TogglePaginated });
                items.push({ title: ci.print, icon: viewer_10.icons.print, commandTag: viewer_10._ViewerActionType.Print });
                items.push({ title: viewer_10.ViewerBase._seperatorHtml });
                items.push({ title: ci.backwardHistory, icon: viewer_10.icons.backwardHistory, commandTag: viewer_10._ViewerActionType.Backward });
                items.push({ title: ci.forwardHistory, icon: viewer_10.icons.forwardHistory, commandTag: viewer_10._ViewerActionType.Forward });
                return items;
            };
            return _HamburgerMenu;
        }(viewer_10._ViewerMenuBase));
        viewer_10._HamburgerMenu = _HamburgerMenu;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_11) {
        'use strict';
        var _ViewMenu = /** @class */ (function (_super) {
            __extends(_ViewMenu, _super);
            function _ViewMenu(viewer, owner, options) {
                return _super.call(this, viewer, owner, options) || this;
            }
            _ViewMenu.prototype._initItems = function () {
                var items = [];
                items.push({ title: wijmo.culture.Viewer.singleMode, icon: viewer_11.icons.singleView, commandTag: viewer_11._ViewerActionType.Single });
                items.push({ title: wijmo.culture.Viewer.continuousMode, icon: viewer_11.icons.continuousView, commandTag: viewer_11._ViewerActionType.Continuous });
                items.push({ title: viewer_11.ViewerBase._seperatorHtml });
                items.push({ title: wijmo.culture.Viewer.wholePage, icon: viewer_11.icons.fitWholePage, commandTag: viewer_11._ViewerActionType.FitWholePage });
                items.push({ title: wijmo.culture.Viewer.pageWidth, icon: viewer_11.icons.fitPageWidth, commandTag: viewer_11._ViewerActionType.FitPageWidth });
                return items;
            };
            return _ViewMenu;
        }(viewer_11._ViewerMenuBase));
        viewer_11._ViewMenu = _ViewMenu;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer_12) {
        'use strict';
        var _ReportHamburgerMenu = /** @class */ (function (_super) {
            __extends(_ReportHamburgerMenu, _super);
            function _ReportHamburgerMenu(viewer, owner, options) {
                return _super.call(this, viewer, owner, options) || this;
            }
            _ReportHamburgerMenu.prototype._initItems = function () {
                var items = _super.prototype._initItems.call(this);
                items.splice(2, 0, { title: wijmo.culture.Viewer.parameters, icon: viewer_12.parametersIcon, commandTag: viewer_12.ReportViewer._parameterCommandTag });
                return items;
            };
            return _ReportHamburgerMenu;
        }(viewer_12._HamburgerMenu));
        viewer_12._ReportHamburgerMenu = _ReportHamburgerMenu;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ArReportFormat;
        (function (_ArReportFormat) {
            _ArReportFormat[_ArReportFormat["Rpx"] = 0] = "Rpx";
            _ArReportFormat[_ArReportFormat["Rdf"] = 1] = "Rdf";
            _ArReportFormat[_ArReportFormat["Rdlx"] = 2] = "Rdlx";
        })(_ArReportFormat || (_ArReportFormat = {}));
        var _ArDocumentFormat;
        (function (_ArDocumentFormat) {
            _ArDocumentFormat[_ArDocumentFormat["Image"] = 3] = "Image";
            _ArDocumentFormat[_ArDocumentFormat["Pdf"] = 4] = "Pdf";
            _ArDocumentFormat[_ArDocumentFormat["Html"] = 5] = "Html";
            _ArDocumentFormat[_ArDocumentFormat["Word"] = 6] = "Word";
            _ArDocumentFormat[_ArDocumentFormat["Xls"] = 7] = "Xls";
            _ArDocumentFormat[_ArDocumentFormat["Xml"] = 8] = "Xml";
            _ArDocumentFormat[_ArDocumentFormat["Svg"] = 9] = "Svg";
        })(_ArDocumentFormat = viewer._ArDocumentFormat || (viewer._ArDocumentFormat = {}));
        var _ArLoadState;
        (function (_ArLoadState) {
            _ArLoadState[_ArLoadState["NotStarted"] = 0] = "NotStarted";
            _ArLoadState[_ArLoadState["Rendering"] = 1] = "Rendering";
            _ArLoadState[_ArLoadState["Rendered"] = 2] = "Rendered";
            _ArLoadState[_ArLoadState["Cancelling"] = 3] = "Cancelling";
            _ArLoadState[_ArLoadState["Cancelled"] = 4] = "Cancelled";
            _ArLoadState[_ArLoadState["Error"] = 5] = "Error";
        })(_ArLoadState = viewer._ArLoadState || (viewer._ArLoadState = {}));
        var _ArErrorCode;
        (function (_ArErrorCode) {
            _ArErrorCode[_ArErrorCode["InvalidCulture"] = 0] = "InvalidCulture";
            _ArErrorCode[_ArErrorCode["InvalidVersion"] = 1] = "InvalidVersion";
            _ArErrorCode[_ArErrorCode["UnknownReportType"] = 2] = "UnknownReportType";
            _ArErrorCode[_ArErrorCode["NoSuchReport"] = 3] = "NoSuchReport";
            _ArErrorCode[_ArErrorCode["ParametersNotSet"] = 4] = "ParametersNotSet";
            _ArErrorCode[_ArErrorCode["RuntimeIsBusy"] = 5] = "RuntimeIsBusy";
            _ArErrorCode[_ArErrorCode["InternalError"] = 6] = "InternalError";
            _ArErrorCode[_ArErrorCode["ParameterNotExists"] = 7] = "ParameterNotExists";
            _ArErrorCode[_ArErrorCode["NoAcceptableFormats"] = 8] = "NoAcceptableFormats";
            _ArErrorCode[_ArErrorCode["InvalidToken"] = 9] = "InvalidToken";
            _ArErrorCode[_ArErrorCode["UnsupportedFormat"] = 10] = "UnsupportedFormat";
            _ArErrorCode[_ArErrorCode["InvalidSetOfParameters"] = 11] = "InvalidSetOfParameters";
            _ArErrorCode[_ArErrorCode["MethodNotSupported"] = 12] = "MethodNotSupported";
            _ArErrorCode[_ArErrorCode["NoValidLicenseFound"] = 13] = "NoValidLicenseFound";
        })(_ArErrorCode = viewer._ArErrorCode || (viewer._ArErrorCode = {}));
        var ticksOffsetFromUnixEpoch = 621355968000000000;
        var ticksInMillisecond = 10000;
        var millisecondsInMinute = 60000;
        var _ArReportService = /** @class */ (function (_super) {
            __extends(_ArReportService, _super);
            function _ArReportService() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._lifeTime = 600 * 1000; //  10 minutes - default life time
                _this._drillthroughData = null;
                _this._canChangeRenderMode = false;
                _this._uid = new Date().getTime().toString();
                _this._isDisposed = false;
                _this._hasOutlines = undefined;
                return _this;
            }
            _ArReportService.StateToStatus = function (state) {
                switch (state) {
                    case _ArLoadState.NotStarted:
                        return viewer._ExecutionStatus.notFound;
                    case _ArLoadState.Rendered:
                        return viewer._ExecutionStatus.completed;
                    case _ArLoadState.Rendering:
                        return viewer._ExecutionStatus.rendering;
                    case _ArLoadState.Cancelled:
                        return viewer._ExecutionStatus.stopped;
                    default:
                        throw "Not supported state: " + state;
                }
            };
            _ArReportService.ConvertFormat = function (format) {
                switch (format) {
                    case 'doc':
                    case 'docx':
                        return _ArDocumentFormat.Word;
                    case "html":
                        return _ArDocumentFormat.Svg;
                    case "mhtml":
                        return _ArDocumentFormat.Html;
                    case "pdf":
                        return _ArDocumentFormat.Pdf;
                    case 'svg':
                        return _ArDocumentFormat.Svg;
                    case "tiff":
                    case "png": // TODO: Remove. Added to test thumbnails.
                        return _ArDocumentFormat.Image;
                    case 'xml':
                        return _ArDocumentFormat.Xml;
                    case 'xlsx':
                    case 'xls':
                        return _ArDocumentFormat.Xls;
                    default:
                        throw "Not supported format: " + format;
                }
            };
            _ArReportService.IsError = function (data) {
                return !!(data && data.json && data.json.Error);
            };
            Object.defineProperty(_ArReportService.prototype, "isDisposed", {
                get: function () {
                    return this._isDisposed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportService.prototype, "autoRun", {
                get: function () {
                    return this._autoRun;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportService.prototype, "canChangeRenderMode", {
                get: function () {
                    return this._canChangeRenderMode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportService.prototype, "parameters", {
                get: function () {
                    return this._parameters || [];
                },
                enumerable: true,
                configurable: true
            });
            _ArReportService.prototype.getStatus = function () {
                var _this = this;
                var promise = new viewer._Promise();
                if (this._isDisposed) { // stop "GetStatus" requests loop after closing report.
                    return promise.resolve({ status: viewer._ExecutionStatus.cleared });
                }
                if (!this._token) {
                    return promise.resolve({ status: viewer._ExecutionStatus.notFound });
                }
                this._ajax(this.serviceUrl + '/GetStatus', {
                    method: 'POST',
                    data: { token: this._token }
                }).then(function (r) {
                    var status = _ArReportService.StateToStatus(r.json.LoadState), res = {
                        errorList: r.json.Error ? [r.json.Error.Description] : [],
                        pageCount: r.json.AvailablePages,
                        hasOutlines: !!_this._hasOutlines,
                        progress: 0,
                        status: status
                    };
                    // Check whether the report has outlines or not (we can request bookmarks only when the report is loaded completely) and cache the result.
                    if ((status === viewer._ExecutionStatus.completed) && (_this._hasOutlines == null)) {
                        _this.getOutlines(true).then(function (b) {
                            res.hasOutlines = _this._hasOutlines = ((b || []).length > 0);
                            promise.resolve(res);
                        });
                    }
                    else {
                        promise.resolve(res);
                    }
                }, function (error) {
                    promise.reject(_this._getError(error));
                });
                return promise;
            };
            // Return an IPromise with IPageSettings.
            _ArReportService.prototype.setPageSettings = function (pageSettings) {
                throw viewer._DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _IDocumentPosition.
            _ArReportService.prototype.getBookmark = function (name) {
                var promise = new viewer._Promise(), datas = name.split('|'); // pageNumber|[x y]
                return promise.resolve({
                    pageIndex: parseInt(datas[0], 10) - 1,
                    pageBounds: (function (v) {
                        if (v) {
                            var vals = v.split(' ');
                            return {
                                x: viewer._Unit.convertValue(parseFloat(vals[0]), viewer._UnitType.Dip, viewer._UnitType.Twip),
                                y: viewer._Unit.convertValue(parseFloat(vals[1]), viewer._UnitType.Dip, viewer._UnitType.Twip)
                            };
                        }
                    })(datas[1])
                });
            };
            // Return an IPromise with _IDocumentPosition.
            _ArReportService.prototype.executeCustomAction = function (action) {
                switch (action.arKind) {
                    case viewer._ArActionKind.Drillthrough:
                        var data = JSON.parse(action.data);
                        return new viewer._Promise().resolve(data);
                    case viewer._ArActionKind.Toggle:
                        return this.processOnClick(action.data);
                    default:
                        return new viewer._Promise().reject("Not implemented action: " + action.arKind);
                }
            };
            // The data argument comes from the queryLoadingData
            _ArReportService.prototype.load = function (data) {
                var _this = this;
                var clientParams = [];
                if (data) {
                    // extract parameters
                    var ptrn_1 = 'parameters.';
                    Object.keys(data).forEach(function (v) {
                        if (v.indexOf(ptrn_1) === 0) {
                            clientParams.push({
                                Name: v.substring(ptrn_1.length),
                                Value: data[v]
                            });
                            delete data[v];
                        }
                    });
                }
                if (this._drillthroughData) {
                    if (clientParams.length) {
                        this._mergeParameters(clientParams, this._drillthroughData.Parameters || []);
                    }
                    return this.loadDrillthroughReport(this._drillthroughData);
                }
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/OpenReport', {
                    method: 'POST',
                    data: this._merge(data, {
                        acceptedFormats: [_ArDocumentFormat.Svg],
                        culture: 'en-US',
                        lifeTime: this._lifeTime / 1000,
                        reportPath: this.filePath,
                        version: 4
                    })
                }).then(function (r) {
                    _this._hasDelayedContent = r.json.HasDelayedContent;
                    _this._autoRun = !!r.json.AutoRun;
                    _this._documentFormat = r.json.DocumentFormat;
                    _this._parameters = (r.json.ParameterCollection || []).map(function (v) { return _this._convertFromServiceParameter(v); });
                    _this._token = r.json.Token;
                    _this._isDisposed = false;
                    var date = new Date(), expDate = new Date(date.getTime() + _this._lifeTime);
                    return {
                        //autoRun: this._autoRun, 
                        //parameters: this._parameters, 
                        expiredDateTime: expDate,
                        loadedDateTime: date,
                        features: {
                            nonPaginated: false,
                            paginated: true,
                            pageSettings: false,
                            textSearchInPaginatedMode: true
                        },
                        pageSettings: {
                            height: new viewer._Unit(1056, viewer._UnitType.Dip),
                            width: new viewer._Unit(816, viewer._UnitType.Dip),
                            leftMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                            rightMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                            topMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                            bottomMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                            paginated: true,
                        },
                        status: {
                            errorList: r.json.Error ? [r.json.Error.Description] : [],
                            expiredDateTime: expDate,
                            //hasOutlines: true, // force to call getOutlines()
                            pageCount: 0,
                            progress: 0,
                            status: viewer._ExecutionStatus.loaded
                        }
                    };
                }).then(function (info) {
                    _this.getReportProperty("ChangeRenderModeSupported").then(function (val) {
                        _this._canChangeRenderMode = !!val;
                        // perform validation
                        if (clientParams && clientParams.length) {
                            var params = _this._mergeParameters(clientParams, _this._parameters);
                            _this.setParameters(params).then(function (value) {
                                promise.resolve(info);
                            });
                        }
                        else {
                            promise.resolve(info);
                        }
                    });
                }).catch(function (xhr) {
                    promise.reject(_this._getError(xhr));
                });
                return promise;
            };
            _ArReportService.prototype.loadDrillthroughReport = function (data) {
                var _this = this;
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/OpenDrillthroughReport', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        lifeTime: this._lifeTime / 1000,
                        reportPath: data.ReportName
                    }
                }).then(function (r) {
                    _this.dispose(false).then(function () {
                        _this._hasDelayedContent = r.json.HasDelayedContent;
                        _this._autoRun = !!r.json.AutoRun;
                        _this._documentFormat = r.json.DocumentFormat;
                        _this._parameters = (r.json.ParameterCollection || []).map(function (v) { return _this._convertFromServiceParameter(v); });
                        _this._token = r.json.Token;
                        _this._isDisposed = false;
                        var date = new Date(), expDate = new Date(date.getTime() + _this._lifeTime);
                        var result = {
                            expiredDateTime: expDate,
                            loadedDateTime: date,
                            features: {
                                nonPaginated: false,
                                paginated: true,
                                pageSettings: false,
                                textSearchInPaginatedMode: true
                            },
                            pageSettings: {
                                height: new viewer._Unit(1056, viewer._UnitType.Dip),
                                width: new viewer._Unit(816, viewer._UnitType.Dip),
                                leftMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                                rightMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                                topMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                                bottomMargin: new viewer._Unit(48, viewer._UnitType.Dip),
                                paginated: true,
                            },
                            status: {
                                errorList: r.json.Error ? [r.json.Error.Description] : [],
                                expiredDateTime: expDate,
                                //hasOutlines: true, // force to call getOutlines()
                                pageCount: 0,
                                progress: 0,
                                status: viewer._ExecutionStatus.loaded
                            }
                        };
                        _this.getReportProperty("ChangeRenderModeSupported").then(function (val) {
                            _this._canChangeRenderMode = !!val;
                            if (wijmo.isArray(data.Parameters) && data.Parameters.length) {
                                _this.setParameters(data.Parameters).then(function (value) {
                                    promise.resolve(result);
                                });
                            }
                            else {
                                promise.resolve(result);
                            }
                        });
                    });
                }, function (error) {
                    promise.reject(_this._getError(error));
                });
                return promise;
            };
            _ArReportService.prototype.processOnClick = function (actionData) {
                var _this = this;
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/ProcessOnClick', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        data: {
                            Action: 'toggle',
                            Data: actionData
                        }
                    }
                }).then(function (r) {
                    //this._autoRun = r.json.AutoRun;
                    //this._hasDelayedContent = r.json.HasDelayedContent;
                    //this._parameters = r.json.ParameterCollection;
                    promise.resolve({ status: viewer._ExecutionStatus.rendering });
                }, function (error) {
                    promise.reject(_this._getError(error));
                });
                return promise;
            };
            _ArReportService.prototype.getReportProperty = function (name) {
                return this._ajax(this.serviceUrl + '/GetReportProperty', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        propertyName: name
                    }
                }).then(function (r) {
                    return r.json.Error ? null : r.json.PropertyValue;
                }).catch(function (e) {
                    return null;
                });
            };
            _ArReportService.prototype.render = function (data) {
                var _this = this;
                return this._ajax(this.serviceUrl + '/RunReport', {
                    method: 'POST',
                    data: { token: this._token }
                }).then(function (r) {
                    _this._isDisposed = false;
                    return {
                        errorList: r.json.Error ? [r.json.Error.Description] : [],
                        status: viewer._ExecutionStatus.rendering
                    };
                });
            };
            _ArReportService.prototype.setDrillthroughData = function (value) {
                this._drillthroughData = value;
            };
            _ArReportService.prototype.dispose = function (async) {
                var _this = this;
                if (async === void 0) { async = true; }
                if (!this._token) {
                    return new viewer._Promise();
                }
                return this._ajax(this.serviceUrl + '/CloseReport', {
                    method: 'POST',
                    async: async,
                    data: { token: this._token }
                }).then(function () {
                    _this._isDisposed = true;
                    _this._token = null;
                    _this._hasOutlines = undefined;
                    return {
                        status: viewer._ExecutionStatus.cleared
                    };
                });
            };
            // _IDocumentStatus.hasOutlines
            // Return an IPromise with _IOutlineNode[].
            _ArReportService.prototype.getOutlines = function (test) {
                if (test === void 0) { test = false; }
                return this._getBookmarks(-1, 0, !test ? 100 : 1, !test);
            };
            _ArReportService.prototype._getError = function (data) {
                var d = data;
                if (_ArReportService.IsError(d)) {
                    return "ErrorCode: \"" + d.json.Error.ErrorCode + "\". Description: \"" + d.json.Error.Description + "\"";
                }
                return data.responseText;
            };
            _ArReportService.prototype._getBookmarks = function (parentId, startFrom, count, getChildren) {
                var _this = this;
                if (getChildren === void 0) { getChildren = true; }
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/GetBookmarks', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        parentId: parentId,
                        fromChild: startFrom,
                        count: count
                    }
                }).then(function (d) {
                    var bookmarks = (d.json.Bookmarks || []).map(function (bookmark) {
                        return {
                            caption: bookmark.Name,
                            children: bookmark.ChildrenCount > 0
                                ? function () { return _this._getBookmarks(bookmark.ID, 0, count); }
                                : null,
                            position: {
                                pageBounds: {
                                    height: viewer._Unit.convertValue(bookmark.Size.Width || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    width: viewer._Unit.convertValue(bookmark.Size.Height || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    x: viewer._Unit.convertValue(bookmark.Location.X || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    y: viewer._Unit.convertValue(bookmark.Location.Y || 0, viewer._UnitType.Inch, viewer._UnitType.Twip)
                                },
                                pageIndex: bookmark.Page
                            },
                            target: '' // ?? 
                        };
                    });
                    var loadCount = startFrom + bookmarks.length;
                    if (!getChildren || loadCount >= d.json.ChildrenCount || loadCount >= 100000) {
                        promise.resolve(bookmarks);
                    }
                    else {
                        _this._getBookmarks(parentId, loadCount, count).then(function (next) {
                            promise.resolve(bookmarks.concat(next));
                        });
                    }
                });
                return promise;
            };
            //getOutlines(): IPromise {
            //    return this._getOutlines(-1, 0);
            //}
            //_getOutlines(parentId: number, fromChild: number): IPromise {
            //    var promise = new _Promise();
            //    this._getBookmarks(parentId, fromChild, 2).then(bookmarks => {
            //        var loadCount = fromChild + bookmarks.length;
            //        if (loadCount >= bookmarks.childCount || loadCount >= 100000) {
            //            promise.resolve(bookmarks);
            //        }
            //        else {
            //            this._getOutlines(parentId, loadCount).then(next => {
            //                promise.resolve(bookmarks.concat(next));
            //            });
            //        }
            //    });
            //    return promise;
            //}
            //_getBookmarks(parent, fromChild, count) {
            //    return this._ajax(this.serviceUrl + '/GetBookmarks',
            //        { method: 'POST' },
            //        {
            //            token: this._token,
            //            parentId: parent,
            //            fromChild: fromChild,
            //            count: count
            //        }
            //    ).then((d: _IArJsonResponse<_IArGetBookmarksResult>) => {
            //        var bookmarks = (d.json.Bookmarks || []).map(bookmark => {
            //            return <_IOutlineNode>{
            //                caption: bookmark.Name || '',
            //                children: bookmark.ChildrenCount > 0 ? () => this._getOutlines(bookmark.ID, 0) : null,
            //                position: {
            //                    pageBounds: {
            //                        height: _Unit.convertValue(bookmark.Size.Width || 0, _UnitType.Inch, _UnitType.Twip),
            //                        width: _Unit.convertValue(bookmark.Size.Height || 0, _UnitType.Inch, _UnitType.Twip),
            //                        x: _Unit.convertValue(bookmark.Location.X || 0, _UnitType.Inch, _UnitType.Twip),
            //                        y: _Unit.convertValue(bookmark.Location.Y || 0, _UnitType.Inch, _UnitType.Twip)
            //                    },
            //                    pageIndex: bookmark.Page
            //                },
            //                target: '' // ?? 
            //            };
            //        });
            //        (<any>bookmarks).childCount = d.json.ChildrenCount || 0;
            //        return bookmarks;
            //    });
            //}
            // Return an IPromise with XMLHttpRequest.
            _ArReportService.prototype.renderToFilter = function (options) {
                var _this = this;
                var promise = new viewer._Promise();
                this.getRenderToFilterUrl(options).then(function (url) {
                    // TODO: delayed content ?
                    _this._ajax(url + ("&WebViewerControlClientId=" + _this._uid) + (options.outputRange ? "&Page=" + options.outputRange : ''), {
                        /*cache: true,*/
                        method: 'GET',
                        parseResponse: false
                    }).then(function (r) {
                        promise.resolve(r.xhr);
                    }, function (e) {
                        if (_ArReportService.IsError(e) && (e.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                            setTimeout(function () { return _this.renderToFilter(options); }, _this.getPingTimeout());
                        }
                        else {
                            promise.reject(e);
                        }
                    });
                });
                return promise;
            };
            // Return an IPromise with _ISearchResultItem[].
            _ArReportService.prototype.search = function (options) {
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/Search', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        options: {
                            Text: options.text,
                            MatchCase: options.matchCase,
                            WholeWord: options.wholeWord
                        },
                        startFrom: {
                            PageIndex: -1
                        },
                        numberOfResults: 100
                    }
                }).then(function (r) {
                    var result = r.json.SearchResults.map(function (value) {
                        return {
                            nearText: value.DisplayText,
                            positionInNearText: value.TextStart,
                            pageIndex: value.PageIndex,
                            boundsList: [{
                                    height: viewer._Unit.convertValue(value.ItemArea.Height || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    width: viewer._Unit.convertValue(value.ItemArea.Width || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    x: viewer._Unit.convertValue(value.ItemArea.Left || 0, viewer._UnitType.Inch, viewer._UnitType.Twip),
                                    y: viewer._Unit.convertValue(value.ItemArea.Top || 0, viewer._UnitType.Inch, viewer._UnitType.Twip)
                                }]
                        };
                    });
                    promise.resolve(result);
                }, function (r) { return promise.reject(r); });
                return promise;
            };
            _ArReportService.prototype.setParameters = function (value) {
                var _this = this;
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/SetParameters', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        parametersSetAtClient: (value || []).map(function (v) { return _this._convertToServiceParameter(v); })
                    }
                }).then(function (r) {
                    promise.resolve(_this._parameters = (r.json.ParameterCollection || []).map(function (v) { return _this._convertFromServiceParameter(v); }));
                }).catch(function (r) {
                    if (_ArReportService.IsError(r) && (r.json.Error.ErrorCode == _ArErrorCode.ParametersNotSet)) {
                        promise.resolve(_this._parameters = (r.json.ParameterCollection || []).map(function (v) { return _this._convertFromServiceParameter(v); }));
                    }
                    else {
                        promise.reject(r);
                    }
                });
                return promise;
            };
            _ArReportService.prototype.validateParameter = function (value) {
                return this._ajax(this.serviceUrl + '/ValidateParameter', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        parametersSetAtClient: this._convertToServiceParameter(value)
                    }
                }).then(function (r) {
                    return null;
                });
            };
            _ArReportService.prototype.getRenderToFilterUrl = function (options) {
                var _this = this;
                var promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/GetRenderedReportLink', {
                    method: 'POST',
                    data: { token: this._token }
                }).then(function (r) {
                    promise.resolve(r.json.ReportLink.Uri);
                }, function (r) {
                    if (_ArReportService.IsError(r) && (r.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                        setTimeout(function () { return _this.getRenderToFilterUrl(options); }, _this.getPingTimeout());
                    }
                    else {
                        promise.reject(r);
                    }
                });
                return promise;
            };
            _ArReportService.prototype.getExportedUrl = function (options) {
                var _this = this;
                var format = _ArReportService.ConvertFormat(options.format), exportingParameters = (function () {
                    var result = {
                        'FileName': _this.getFileName()
                    };
                    if (format == _ArDocumentFormat.Pdf) {
                        result['EmbedFonts'] = 'All';
                    }
                    if (format == _ArDocumentFormat.Image) {
                        if (options.format === 'png') {
                            result['ImageType'] = 'PNG';
                        }
                        if (options.outputRange) { // TODO: handle "from-to" format?
                            result['StartPage'] = options.outputRange.toString();
                            result['EndPage'] = options.outputRange.toString();
                        }
                        if (options.resolution) {
                            result['DpiX'] = options.resolution.toString();
                            result['DpiY'] = options.resolution.toString();
                        }
                    }
                    if (options.printing && (format == _ArDocumentFormat.Pdf)) {
                        result['PrintOnOpen'] = true;
                    }
                    return result;
                })(), promise = new viewer._Promise();
                this._ajax(this.serviceUrl + '/GetExportedReportLink', {
                    method: 'POST',
                    data: {
                        token: this._token,
                        format: format,
                        exportingParameters: exportingParameters,
                        pageRange: null //  doesn't work good for now
                    }
                }).then(function (r) {
                    promise.resolve(r.json.ReportLink.Uri
                        + (wijmo.isNumber(options.outputRange) ? "&outputRange=" + options.outputRange : '') // required to be able to sort thumbnails urls (ViwerBase.createThumbnails).;
                        + (!options.printing ? '&Attachment=1' : ''));
                }, function (e) {
                    if (_ArReportService.IsError(e) && (e.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                        setTimeout(function () { return _this.getExportedUrl(options); }, _this.getPingTimeout());
                    }
                    else {
                        promise.reject(e);
                    }
                });
                return promise;
            };
            _ArReportService.prototype.getPingTimeout = function () {
                return 1000; // 5000
            };
            // Return an IPromise with _IExportDescription[].
            _ArReportService.prototype.getSupportedExportDescriptions = function () {
                var promise = new viewer._Promise();
                promise.resolve([
                    { name: 'TIFF image', format: 'tiff' },
                    { name: 'Adobe PDF', format: 'pdf' },
                    { name: 'Web archive (MHTML)', format: 'mhtml' },
                    { name: 'Microsoft Word', format: 'doc' },
                    { name: 'Microsoft Excel', format: 'xls' },
                    { name: 'XML document', format: 'xml' }
                ]);
                return promise;
            };
            // Return an IPromise with _IDocumentFeatures.
            _ArReportService.prototype.getFeatures = function () {
                throw viewer._DocumentSource._abstractMethodException;
            };
            _ArReportService.prototype._ajax = function (url, settings) {
                var promise = new viewer._Promise();
                settings = settings || {};
                settings.urlEncode = false;
                //settings.cache = true
                this.httpRequest(url, settings).then(function (xhr) {
                    var r = {
                        xhr: xhr
                    };
                    try {
                        if (xhr.responseText && (settings.parseResponse !== false)) {
                            r.json = JSON.parse(xhr.responseText).d;
                        }
                        if (r.json && r.json.Error) {
                            //promise.reject(r);
                            throw "";
                        }
                        promise.resolve(r);
                    }
                    catch (e) {
                        promise.reject(r);
                    }
                }, function (xhr) {
                    promise.reject(xhr); // TODO: parse response.
                });
                return promise;
            };
            _ArReportService.prototype._convertFromServiceParameter = function (p) {
                var cnvrt = function (v, t) {
                    if (v != null && t === viewer._ArParameterType.DateTime) {
                        //    var millis = (+v - ticksOffsetFromUnixEpoch) / ticksInMillisecond,
                        //        millisUtc = millis + new Date(millis).getTimezoneOffset() * millisecondsInMinute;
                        //    return new Date(millisUtc);
                    }
                    return v;
                };
                p.Value = cnvrt(p.Value, p.ParameterType);
                p.AvailableValues = (p.AvailableValues || []).map(function (v) { return ({
                    Label: v.Label,
                    Value: cnvrt(v.Value, p.ParameterType)
                }); });
                return p;
            };
            _ArReportService.prototype._convertToServiceParameter = function (p) {
                var cnvrt = function (v, t) {
                    if (v != null && t === viewer._ArParameterType.DateTime) {
                        //    var millisLocal = v.getTime() - v.getTimezoneOffset() * millisecondsInMinute;
                        //    return millisLocal * ticksInMillisecond + ticksOffsetFromUnixEpoch;
                    }
                    return v;
                };
                p.Value = cnvrt(p.Value, p.ParameterType);
                if (p.Values) {
                    p.Values.forEach(function (v) {
                        v.Value = cnvrt(v.Value, p.ParameterType);
                    });
                }
                return p;
            };
            _ArReportService.prototype._merge = function (src, dst) {
                if (!src || !dst) {
                    return;
                }
                for (var key in src) {
                    dst[key] = src[key];
                }
                return dst;
            };
            //TODO: need further investigation
            _ArReportService.prototype._mergeParameters = function (client, server) {
                var names = [];
                var result = server.map(function (sp) {
                    var name = sp.Name.toLowerCase();
                    names.push(name);
                    var cp = client.filter(function (p) { return name === p.Name.toLowerCase(); });
                    return !cp.length
                        ? sp
                        : (function () {
                            sp.Value = cp[0].Value;
                            return sp;
                        })();
                });
                result.push.apply(result, client.filter(function (p) { return names.indexOf(p.Name.toLowerCase()) < 0; }));
                return result;
            };
            _ArReportService.prototype._parseXml = function (data) {
                var dom = new DOMParser().parseFromString(data, "text/xml");
                return dom;
            };
            return _ArReportService;
        }(viewer._DocumentService));
        viewer._ArReportService = _ArReportService;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        var _ArReportSource = /** @class */ (function (_super) {
            __extends(_ArReportSource, _super);
            function _ArReportSource(options, httpRequest) {
                return _super.call(this, options, httpRequest) || this;
            }
            Object.defineProperty(_ArReportSource.prototype, "autoRun", {
                get: function () {
                    return this._innerService.autoRun;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportSource.prototype, "encodeRequestParams", {
                get: function () {
                    return false; // AR service doesn't supports values encoded by encodeURIComponent?
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportSource.prototype, "hasParameters", {
                get: function () {
                    var params = this._innerService.parameters;
                    return params && (params.length > 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportSource.prototype, "hasThumbnails", {
                get: function () {
                    return false; // https://hive.grapecity.com/default.asp?249933#1703755
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_ArReportSource.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            _ArReportSource.prototype.getParameters = function () {
                var promise = new viewer._Promise(), params = this._convertParameters(this._innerService.parameters);
                return promise.resolve(params);
            };
            _ArReportSource.prototype.setParameters = function (value) {
                var _this = this;
                var promise = new viewer._Promise(), sp = [], names = {};
                this._innerService.parameters.forEach(function (p) {
                    names[p.Name] = p;
                });
                // TODO: multiline (typeof(value) == array?)
                Object.keys(value).forEach(function (k) {
                    var p;
                    sp.push(p = {
                        AllowEmpty: names[k].AllowEmpty,
                        DateOnly: names[k].DateOnly,
                        MultiLine: names[k].MultiLine,
                        MultiValue: names[k].MultiValue,
                        Name: k,
                        Nullable: names[k].Nullable,
                        ParameterType: names[k].ParameterType
                    });
                    if (p.MultiValue && wijmo.isArray(value[k])) {
                        p.Values = value[k].map(function (v) {
                            return {
                                Value: v
                            };
                        });
                    }
                    else {
                        p.Value = value[k];
                    }
                });
                this._innerService.setParameters(sp).then(function (v) {
                    var failed = _this._convertParameters(v.filter(function (v) { return v.State !== viewer._ArParameterState.OK; }));
                    promise.resolve(_this._convertParameters(v));
                });
                return promise;
            };
            _ArReportSource.prototype.print = function (rotations) {
                // AR is unable to render\ export multiple pages in SVG format, so we can't apply rotations and use PrintDocument (see: _DocumentSource.print).
                // For now we just export the report to PDF, asking web service to set the "content-disposition" header (to give browser a chance to display the Print dialog automatucally), and open it.
                this.getExportedUrl({ format: 'pdf', printing: true }, true).then(function (url) {
                    if (!url) {
                        return;
                    }
                    try {
                        var wnd = window.open(url, '_blank');
                        if (wnd) {
                            wnd.focus();
                        }
                    }
                    catch (_b) {
                        window.location.assign(url + '&Attachment=1');
                    }
                });
            };
            _ArReportSource.prototype._createDocumentService = function (options) {
                return new viewer._ArReportService(options, this.httpHandler);
            };
            _ArReportSource.prototype._getIsDisposed = function () {
                return _super.prototype._getIsDisposed.call(this) || this._innerService.isDisposed;
            };
            _ArReportSource.prototype._updateExecutionInfo = function (data) {
                _super.prototype._updateExecutionInfo.call(this, data);
            };
            _ArReportSource.prototype._checkIsLoadCompleted = function (data) {
                return data.status === viewer._ExecutionStatus.completed
                    || data.status === viewer._ExecutionStatus.stopped;
            };
            _ArReportSource.prototype._convertParameters = function (params) {
                var result = params.map(function (value) { return ({
                    allowedValues: value.AvailableValues && value.AvailableValues.length
                        ? value.AvailableValues.map(function (v) { return ({ key: v.Label, value: v.Value }); })
                        : undefined,
                    allowBlank: value.AllowEmpty,
                    dataType: (value.ParameterType === viewer._ArParameterType.Boolean)
                        ? viewer._ParameterType.Boolean
                        : value.ParameterType === viewer._ArParameterType.DateTime
                            ? viewer._ParameterType.DateTime // _ParameterType.Date, _ParameterType.Time?
                            : value.ParameterType === viewer._ArParameterType.Float
                                ? viewer._ParameterType.Float
                                : value.ParameterType === viewer._ArParameterType.Integer
                                    ? viewer._ParameterType.Integer
                                    : viewer._ParameterType.String,
                    error: value.ExtendedErrorInfo,
                    hidden: false,
                    name: value.Name,
                    nullable: !!value.Nullable,
                    maxLength: 0,
                    multiValue: value.MultiValue,
                    prompt: value.Prompt,
                    value: value.MultiValue && value.Values && value.Values.length
                        ? value.Values.map(function (v) { return v.Value; })
                        : value.Value,
                }); });
                return result;
            };
            return _ArReportSource;
        }(viewer._ReportSourceBase));
        viewer._ArReportSource = _ArReportSource;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Defines the ReportViewer control for displaying the FlexReport or SSRS report.
         *
         * The {@link serviceUrl} property indicates the url of C1 Web API which provides report services.
         * The report services use C1FlexReport to process a FlexReport, and use C1SSRSDocumentSource and C1PdfDocumentSource to process an SSRS report.
         *
         * Here is a sample of how to show a FlexReport:
         * ```typescript
         * import { ReportViewer } from '@grapecity/wijmo.viewer';
         * var reportViewer = new ReportViewer('#reportViewer');
         * reportViewer.serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/report';
         * reportViewer.filePath = 'ReportsRoot/Formatting/AlternateBackground.flxr';
         * reportViewer.reportName = 'AlternateBackground';
         * ```
         *
         * Here is a sample of how to show an SSRS report:
         * ```typescript
         * import { ReportViewer } from '@grapecity/wijmo.viewer';
         * var reportViewer = new ReportViewer('#reportViewer');
         * reportViewer.serviceUrl = 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/report';
         * reportViewer.filePath = 'c1ssrs/AdventureWorks/Company Sales';
         * ```
         */
        var ReportViewer = /** @class */ (function (_super) {
            __extends(ReportViewer, _super);
            /**
             * Initializes a new instance of the {@link ReportViewer} class.
             *
             * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function ReportViewer(element, options) {
                var _this = _super.call(this, element, options) || this;
                _this._initSidePanelParameters();
                return _this;
            }
            ReportViewer.prototype._getProductInfo = function () {
                return 'QNI5,ReportViewer';
            };
            Object.defineProperty(ReportViewer.prototype, "reportName", {
                /**
                * Gets or sets the report name.
                *
                * For FlexReport, sets it with the report name defined in the FlexReport definition file.
                * For SSRS report, leave it as empty string. The SSRS report path is specified by the {@link filePath} property.
                */
                get: function () {
                    return this._reportName;
                },
                set: function (value) {
                    if (value != this._reportName) {
                        this._reportName = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReportViewer.prototype, "paginated", {
                /**
                * Gets or sets a value indicating whether the content should be represented as a set of fixed sized pages.
                *
                * The default value is null which means using paginated mode for a FlexReport and non-paginaged mode for an SSRS report.
                */
                get: function () {
                    return this._innerPaginated;
                },
                set: function (value) {
                    this._innerPaginated = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReportViewer.prototype, "parameters", {
                /**
                * Gets or sets a dictionary of {name: value} pairs that describe the parameters used to run the report.
                *
                * This property is useful if the report requires that certain parameters (for example, the hidden ones) to be passed during the initial stage.
                *
                * <pre>
                * reportViewer.parameters = {
                *    'CustomerID': 'ALFKI'
                * };</pre>
                */
                get: function () {
                    return this._clientParameters;
                },
                set: function (value) {
                    if (value != this._clientParameters) {
                        this._clientParameters = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the report names defined in the specified FlexReport definition file.
             *
             * @param serviceUrl The address of C1 Web API service.
             * @param reportFilePath The full path to the FlexReport definition file.
             * @param httpHandler The HTTP request handler. This parameter is optional.
             * @return An {@link wijmo.viewer.IPromise} object with a string array which contains the report names.
             */
            ReportViewer.getReportNames = function (serviceUrl, reportFilePath, httpHandler) {
                return viewer._Report.getReportNames(serviceUrl, reportFilePath, httpHandler);
            };
            /**
             * Gets the catalog items in the specified folder path.
             *
             * You can get all items under the folder path by passing the data parameter as:
             * 1) A true value.
             * 2) An object which has the "recursive" property with true value.
             *
             * @param serviceUrl The address of C1 Web API service.
             * @param path The folder path. The path to the FlexReport definition file will be treated as a folder path.
             * @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
             * @param httpHandler The HTTP request handler. This parameter is optional.
             * @return An {@link IPromise} object with an array of {@link wijmo.viewer.ICatalogItem}.
             */
            ReportViewer.getReports = function (serviceUrl, path, data, httpHandler) {
                return viewer._Report.getReports(serviceUrl, path, data, httpHandler);
            };
            ReportViewer.prototype.onQueryLoadingData = function (e) {
                var _this = this;
                if (this.parameters) {
                    Object.keys(this.parameters).forEach(function (v) { return e.data['parameters.' + v] = _this.parameters[v]; });
                }
                _super.prototype.onQueryLoadingData.call(this, e);
            };
            ReportViewer.prototype._globalize = function () {
                _super.prototype._globalize.call(this);
                var g = wijmo.culture.Viewer;
                this._gParameterTitle.textContent = g.parameters;
            };
            ReportViewer.prototype._executeAction = function (action) {
                _super.prototype._executeAction.call(this, action);
                if (this._actionIsDisabled(action)) {
                    return;
                }
                switch (action) {
                    case ReportViewer._parameterCommandTag:
                        wijmo.Control.getControl(this._sidePanel).active(this._parametersPageId);
                        break;
                }
            };
            ReportViewer.prototype._executeCustomAction = function (action) {
                if (this._isArReport() && action.arKind === viewer._ArActionKind.Drillthrough) {
                    var data = JSON.parse(action.data);
                    var source = this._getDocumentSource();
                    source._innerService.setDrillthroughData(data);
                    source._updateIsLoadCompleted(false);
                    this._loadDocument(source, true, false);
                }
                else {
                    _super.prototype._executeCustomAction.call(this, action);
                }
            };
            ReportViewer.prototype._actionIsDisabled = function (action) {
                switch (action) {
                    case ReportViewer._parameterCommandTag:
                        return !this._innerDocumentSource || !this._innerDocumentSource.hasParameters;
                }
                return _super.prototype._actionIsDisabled.call(this, action);
            };
            ReportViewer.prototype._initHamburgerMenu = function (owner) {
                this._hamburgerMenu = new viewer._ReportHamburgerMenu(this, owner);
            };
            ReportViewer.prototype._initSidePanelParameters = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel), page = sideTabs.addPage(wijmo.culture.Viewer.parameters, viewer.parametersIcon, 2);
                this._parametersPageId = page.id;
                this._gParameterTitle = page.outContent.querySelector('.wj-tabtitle');
                page.format(function (t) {
                    _this._paramsEditor = new viewer._ParametersEditor(t.content);
                    _this._paramsEditor.commit.addHandler(function () {
                        if (!_this._innerDocumentSource || !_this._innerDocumentSource.hasParameters) {
                            return;
                        }
                        _this._showViewPanelMessage();
                        _this._innerDocumentSource.setParameters(_this._paramsEditor.parameters).then(function (v) {
                            var newParams = (v || []);
                            var hasError = newParams.some(function (p) { return !!p.error; });
                            _this._paramsEditor._reset();
                            if (hasError) {
                                _this._paramsEditor.itemsSource = newParams;
                            }
                            else {
                                _this._resetDocument();
                                _this._paramsEditor.isDisabled = true;
                                _this._renderDocumentSource();
                            }
                        }).catch(function (reason) {
                            _this._showViewPanelErrorMessage(viewer._getErrorMessage(reason));
                        });
                        if (_this._isMobileTemplate()) {
                            sideTabs.collapse();
                        }
                    });
                    _this._paramsEditor.validate.addHandler(function () {
                        if (!_this._innerDocumentSource || !_this._innerDocumentSource.hasParameters) {
                            return;
                        }
                        _this._paramsEditor.isDisabled = true;
                        _this._innerDocumentSource.setParameters(_this._paramsEditor.parameters).then(function (v) {
                            _this._paramsEditor.itemsSource = v;
                            _this._paramsEditor.isDisabled = false;
                            _this._paramsEditor.savingParam = false;
                        }, function (v) {
                            _this._paramsEditor.isDisabled = false;
                            _this._paramsEditor.savingParam = false;
                        });
                    });
                    var updateParametersPanel = function () {
                        var documentSource = _this._innerDocumentSource;
                        if (documentSource.status === viewer._ExecutionStatus.cleared ||
                            documentSource.status === viewer._ExecutionStatus.notFound) {
                            viewer._removeChildren(t.content);
                        }
                        else if (documentSource.status === viewer._ExecutionStatus.rendering) {
                            _this._paramsEditor.isDisabled = true;
                        }
                        else if (documentSource.status === viewer._ExecutionStatus.completed) {
                            _this._paramsEditor.isDisabled = false;
                        }
                        var isLoaded = (documentSource.status === viewer._ExecutionStatus.loaded);
                        if ((documentSource.status !== viewer._ExecutionStatus.completed) && !isLoaded) {
                            return;
                        }
                        if (!documentSource.hasParameters) {
                            sideTabs.hide(t);
                            return;
                        }
                        documentSource.getParameters().then(function (params) {
                            if (!params.filter(function (p) { return !p.hidden; }).length) { // all parameters are hidden?
                                sideTabs.hide(t);
                            }
                            else {
                                sideTabs.show(t);
                                sideTabs.active(t);
                            }
                            if (_this._innerDocumentSource != documentSource || documentSource.isDisposed) {
                                return;
                            }
                            _this._paramsEditor.itemsSource = params;
                            if (params.filter(function (p) { return p.value == null && !p.nullable && !p.hidden; }).length) { // has required parameters?
                                _this._showViewPanelMessage(wijmo.culture.Viewer.requiringParameters);
                                _this._updateUI();
                                wijmo.Control.getControl(_this._sidePanel).enable(_this._parametersPageId); // Make sure that Parameters page is enabled.
                            }
                            else if (isLoaded) {
                                _this._paramsEditor.isDisabled = true;
                                _this._renderDocumentSource();
                            }
                        });
                    }, update = function () {
                        if (!_this._innerDocumentSource) {
                            return;
                        }
                        viewer._addWjHandler(_this._documentEventKey, _this._innerDocumentSource.statusChanged, updateParametersPanel);
                        updateParametersPanel();
                    };
                    _this._documentSourceChanged.addHandler(update);
                    update();
                });
            };
            Object.defineProperty(ReportViewer.prototype, "_innerDocumentSource", {
                /*private _updateLoadingDivContent(content: string) {
                    var self = this, viewPage: HTMLDivElement = <HTMLDivElement>this._viewpanelContainer.querySelector('.wj-view-page'),
                        loadingDiv, loadingDivList = this._viewpanelContainer.querySelectorAll('.wj-loading');
            
                    if (loadingDivList && loadingDivList.length > 0) {
                        for (var i = 0; i < loadingDivList.length; i++) {
                            (<HTMLElement>loadingDivList.item(i)).innerHTML = content;
                        }
                    } else {
                        loadingDiv = document.createElement('div');
                        loadingDiv.className = 'wj-loading';
                        loadingDiv.style.height = viewPage.offsetHeight + 'px';
                        loadingDiv.style.lineHeight = viewPage.offsetHeight + 'px';
                        loadingDiv.innerHTML = content;
                        viewPage.appendChild(loadingDiv);
                    }
                }*/
                get: function () {
                    return this._getDocumentSource();
                },
                enumerable: true,
                configurable: true
            });
            ReportViewer.prototype._loadDocument = function (value, force, disposeSource) {
                if (force === void 0) { force = false; }
                if (disposeSource === void 0) { disposeSource = true; }
                var isChanged = (this._innerDocumentSource !== value) && !force;
                var promise = _super.prototype._loadDocument.call(this, value, force, disposeSource);
                if (value && isChanged) {
                    viewer._addWjHandler(this._documentEventKey, value.statusChanged, this._onDocumentStatusChanged, this);
                }
                return promise;
            };
            ReportViewer.prototype._reRenderDocument = function () {
                this._renderDocumentSource();
            };
            ReportViewer.prototype._onDocumentStatusChanged = function () {
                if (!this._innerDocumentSource
                    || this._innerDocumentSource.status !== viewer._ExecutionStatus.loaded
                    || this._innerDocumentSource.hasParameters
                    || !this._innerDocumentSource.autoRun) {
                    return;
                }
                this._renderDocumentSource();
            };
            ReportViewer.prototype._renderDocumentSource = function () {
                var _this = this;
                if (!this._innerDocumentSource) {
                    return;
                }
                this._setDocumentRendering();
                var documentSource = this._innerDocumentSource;
                documentSource.render().then(function (v) { return _this._getStatusUtilCompleted(documentSource); });
            };
            ReportViewer.prototype._disposeDocument = function (disposeSource) {
                if (disposeSource === void 0) { disposeSource = true; }
                if (this._innerDocumentSource) {
                    viewer._removeAllWjHandlers(this._documentEventKey, this._innerDocumentSource.statusChanged);
                }
                _super.prototype._disposeDocument.call(this, disposeSource);
            };
            ReportViewer.prototype._setDocumentRendering = function () {
                this._innerDocumentSource.status = viewer._ExecutionStatus.rendering;
                _super.prototype._setDocumentRendering.call(this);
            };
            ReportViewer.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                if (this._isArReport()) {
                    return new viewer._ArReportSource({
                        serviceUrl: this.serviceUrl,
                        filePath: this.filePath
                    }, this);
                }
                return new viewer._Report({
                    serviceUrl: this.serviceUrl,
                    filePath: this.filePath,
                    reportName: this.reportName,
                    paginated: this.paginated
                }, this);
            };
            ReportViewer.prototype._supportsPageSettingActions = function () {
                return true;
            };
            ReportViewer.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    this._paramsEditor.refresh();
                }
            };
            ReportViewer.prototype._isArReport = function () {
                return !!this.filePath && viewer._strEndsWith(this.filePath, '.rdlx', true);
            };
            ReportViewer.prototype._createPage = function (index, defPageSize) {
                if (!this._isArReport()) {
                    return _super.prototype._createPage.call(this, index, defPageSize);
                }
                return new viewer._ArPage(this._getDocumentSource(), index, defPageSize);
            };
            ReportViewer.prototype._actionElementClicked = function (element) {
                if (!this._isArReport()) {
                    _super.prototype._actionElementClicked.call(this, element);
                    return;
                }
                var info = this._getActionInfo(element);
                if (info && (info.arKind === viewer._ArActionKind.Hyperlink)) {
                    window.open(info.data, '_blank');
                }
                else {
                    _super.prototype._actionElementClicked.call(this, element);
                }
            };
            ReportViewer.prototype._getActionInfo = function (element) {
                if (!this._isArReport()) {
                    return _super.prototype._getActionInfo.call(this, element);
                }
                var typeVal = element.attributes['arsvg:data-action-type'].value, dataVal = element.attributes['arsvg:data-action-data'].value.replace(/&quot;/g, '"'), pageVal = element.attributes['arsvg:data-action-page'].value;
                if (typeVal) {
                    switch (typeVal) {
                        case viewer._ArActionKind.Bookmark:
                            return { kind: viewer._ActionKind.Bookmark, data: dataVal ? pageVal + "|" + dataVal : pageVal, arKind: typeVal };
                        default:
                            return { kind: viewer._ActionKind.Custom, data: dataVal, arKind: typeVal };
                    }
                }
                return null;
            };
            ReportViewer._parameterCommandTag = 99;
            return ReportViewer;
        }(viewer.ViewerBase));
        viewer.ReportViewer = ReportViewer;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var viewer;
    (function (viewer) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.viewer', wijmo.viewer);
        /* Export public members */
        /* Additional WebComponents interop requirement: export all the remaining members that directly or indirectly inherited from wijmo.Control */
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.viewer.js.map