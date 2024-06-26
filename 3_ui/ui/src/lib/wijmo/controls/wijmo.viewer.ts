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


    module wijmo.viewer {
    


'use strict';

// Extends MultiSelect control with Select All function.
export class _MultiSelectEx {
    private _itemsSource: any[];
    private _selectAllItem: any;
    private _multiSelect: wijmo.input.MultiSelect;
    private _selectedAll = false;
    private _innerCheckedItemsChanged = false;
    private _lostFocus;

    readonly checkedItemsChanged = new wijmo.Event<_MultiSelectEx, wijmo.EventArgs>();

    constructor(element: HTMLElement) {
        var self = this, multiSelect = new wijmo.input.MultiSelect(element);
        self._multiSelect = multiSelect;
        multiSelect.checkedItemsChanged.addHandler(self.onCheckedItemsChanged, self);
        multiSelect.isDroppedDownChanged.addHandler(self.onIsDroppedDownChanged, self);
        multiSelect.headerFormatter = () => self._updateHeader();
        self._lostFocus = self._multiSelect.lostFocus;
    }

    _updateHeader(): string {
        var self = this,
            checkedItems = self.checkedItems || [],
            texts = [],
            displayMemberPath = self.displayMemberPath;
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
    }

    onIsDroppedDownChanged() {
        if (!this._multiSelect.isDroppedDown) {
            return;
        }

        this._updateSelectedAll();
    }

    onCheckedItemsChanged(sender, e) {
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
    }

    get isEditable(): boolean {
        return this._multiSelect.isEditable;
    }
    set isEditable(value: boolean) {
        this._multiSelect.isEditable = value;
    }

    get isDisabled(): boolean {
        return this._multiSelect.isDisabled;
    }
    set isDisabled(value: boolean) {
        this._multiSelect.isDisabled = value;
    }

    get displayMemberPath(): string {
        return this._multiSelect.displayMemberPath;
    }
    set displayMemberPath(value: string) {
        this._multiSelect.displayMemberPath = value;
    }

    get selectedValuePath(): string {
        return this._multiSelect.selectedValuePath;
    }
    set selectedValuePath(value: string) {
        this._multiSelect.selectedValuePath = value;
    }

    get itemsSource(): any[] {
        return this._itemsSource;
    }
    set itemsSource(value: any[]) {
        var self = this, displayMemberPath = self.displayMemberPath || 'name';
        self._itemsSource = value;
        var innerSources = [];
        if (value) {
            if (value.length > 1) {
                self._selectAllItem = {};
                self._selectAllItem[displayMemberPath] = wijmo.culture.Viewer.parameterSelectAllItemText;
                innerSources.push(self._selectAllItem);
            } else {
                self._selectAllItem = null;
            }

            innerSources = innerSources.concat(value);
        }

        self._multiSelect.itemsSource = innerSources;
    }

    get checkedItems(): any[] {
        var self = this, items = [];
        if (self._multiSelect.checkedItems) {
            items = self._multiSelect.checkedItems.slice();
        }

        var index = items.indexOf(self._selectAllItem);
        if (index > -1) {
            items.splice(index, 1);
        }

        return items;
    }
    set checkedItems(value: any[]) {
        var self = this;
        self._multiSelect.checkedItems = value;
        self._selectedAll = false;
        self._updateSelectedAll();
    }

    get lostFocus(): wijmo.Event<any, wijmo.EventArgs> {
        return this._lostFocus;
    }

    _updateSelectedAll() {
        var self = this;
        if (!self._selectAllItem) {
            return;
        }

        var checkedItems = self._multiSelect.checkedItems || [],
            selectedAllIndex = checkedItems.indexOf(self._selectAllItem),
            selectedAll = selectedAllIndex > -1,
            selectAllItemChanged = self._selectedAll !== selectedAll;

        if (selectAllItemChanged) {
            self._selectedAll = selectedAll;
            self._innerCheckedItemsChanged = true;
            if (self._selectedAll) {
                self._multiSelect.checkedItems = self._multiSelect.itemsSource.slice();
            } else {
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
        } else {
            checkedItems = checkedItems.slice();
            checkedItems.splice(selectedAllIndex, 1);
            self._multiSelect.checkedItems = checkedItems;
        }

        self._innerCheckedItemsChanged = false;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

export var parametersIcon = '<path d="M24,11.9v-2h-4V7h0V5h0h-1h-5V2h0V0h0h-1H1H0h0v2h0v11h0v1h0h1h5v4h0v1h0h1h3v4h0v1h0h1h2.1v-1H11V12h2.1v-2H11h-1h0v2h0v6H7V7h12v2.9h-1v2h5V23h-4.9v1H23h1h0v-1h0L24,11.9L24,11.9z M6,5L6,5l0,2h0v6H1V2h12v3H7H6z"/>' +
    '<path d="M20,20v-3v-1h-1h-1v-1v-1h-1h-3h-1v1v3v1h1h1v2h0h1h3h1h0L20,20L20,20z M14,18v-3h3v1h-1h-1v1v1H14z M17,17v1h-1v-1H17z M16,20v-1h1h1v-1v-1h1v3H16z"/>';
    }
    


    module wijmo.viewer {
    'use strict';

export var icons = {
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
    rubberbandTool: `
    <g>
        <polygon points="11.5,2 4,2 2,2 2,4 2,11.5 4,11.5 4,4 11.5,4 	"/>
        <path d="M16,10V8h-2h-4H8v2v4v2h2h4h2v-2V10z M14,14h-4v-4h4V14z"/>
        <polygon points="20,12 20,19 19,19 19,20 12,20 12,22 20,22 22,22 22,20 22,12"/>
        <rect x="16" y="16" class="st0" width="1" height="1"/>
        <rect x="17" y="17" class="st0" width="1" height="1"/>
        <rect x="18" y="18" class="st0" width="1" height="1"/>
    </g>`,
    magnifierTool: `
    <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="9.5" cy="9.5" r="7.5"/>
    <rect x="17" y="13.7" transform="matrix(0.7193 -0.6947 0.6947 0.7193 -7.4537 17.9238)" class="st1" width="3" height="9"/>
    <polygon points="14,8.5 10.5,8.5 10.5,5 8.5,5 8.5,8.5 5,8.5 5,10.5 8.5,10.5 8.5,14 10.5,14 10.5,10.5 14,10.5"/>
    `,
    rotateDocument: `
    <g>
        <path d="M18,0H5H3v4v18v2h2h13h2v-2V4V0H18z M18,22H5V4h13V22z"/>
        <polygon points="9,12 13,12 13,14 15,11.5 13,9 13,11 9,11 8,11 8,12 8,17 9,17"/>
    </g>`,
    rotatePage: `
    <g>
        <rect x="16" y="1" width="1" height="1"/>
        <rect x="17" y="2" width="1" height="1"/>
        <rect x="18" y="3" width="1" height="1"/>
        <path class="st0" d="M19,4v1h-0.6H18h-3V2V1.3V1h1V0h-1H5H4H3v24h2h13h1.1H20V5V4H19z M18,22.1H5V2h8v5h1h1h3V22.1z"/>
        <polygon points="13,11 9,11 8,11 8,12 8,17 9,17 9,12 13,12 13,14 15,11.5 13,9"/>
    </g>`
};
    }
    


    module wijmo.viewer {
    export interface _ViewerMenuItem {
    title: string;
    icon?: string;
    commandTag?: number;
}
    }
    


    module wijmo.viewer {
    export interface _IToolbarSvgButtonClickedEventArgs {
    commandTag: string;
}
    }
    


    module wijmo.viewer {
    

'use strict';

/**
 * Provides arguments for {@link wijmo.viewer.ViewerBase.pageLoaded} event.
 */
export class PageLoadedEventArgs extends wijmo.EventArgs {
    private _pageIndex: number;
    private _pageElement: HTMLDivElement;

    /**
     * Initializes a new instance of the {@link PageLoadedEventArgs} class.
     *
     * @param pageIndex Number containing the page index of loaded page.
     * @param pageElement HTMLDivElement containing wrapper for rendered SVG of loaded page.
     */
    constructor(pageIndex: number, pageElement: HTMLDivElement) {
        super();
        this._pageIndex = pageIndex;
        this._pageElement = pageElement;
    }

    /**
     * Gets or sets the page index of loaded page.
     */
    get pageIndex(): number {
        return this._pageIndex;
    }
    set pageIndex(value: number) {
        this._pageIndex = value;
    }

    /**
     * Gets or sets the HTMLDivElement containing wrapper for rendered SVG of loaded page.
     */
    get pageElement(): HTMLDivElement {
        return this._pageElement;
    }
    set pageElement(value: HTMLDivElement) {
        this._pageElement = value;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

export class _ActionQueue {
    private _actions: Function[] = [];
    private _isStarted = false;

    private _any(): boolean {
        return this._actions.length > 0;
    }

    queue(action: Function) {
        var any = this._any();
        this._actions.push(() => {
            action();
            this._continue();
        });

        if (!this.isStarted || any) return;

        this._continue();
    }

    _continue() {
        var first = this._actions.shift();
        if (first) first();
    }

    start() {
        if (this._isStarted) return;
        this._isStarted = true;
        this._continue();
    }

    get isStarted() {
        return this._isStarted;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

//Hack for 'instanceof' when the type is undefined
if (typeof window !== 'undefined') {
    window['TouchEvent'] = window['TouchEvent'] || <any>(() => { });
    window['PointerEvent'] = window['PointerEvent'] || <any>(() => { });
    window['Touch'] = window['Touch'] || <any>(() => { });
}

export interface _ITouchEventsMap {
    startName: string;
    moveName: string;
    endName: string;
}

const _eventSeparator = ',';

const _touchEventsMap: _ITouchEventsMap = {
    startName: 'touchstart',
    moveName: 'touchmove',
    endName: ['touchend', 'touchcancel', 'touchleave'].join(_eventSeparator)
};

const _pointerEventsMap: _ITouchEventsMap = {
    startName: ['pointerdown', 'pointerenter'].join(_eventSeparator),
    moveName: 'pointermove',
    endName: ['pointerup', 'pointercancel', 'pointerleave'].join(_eventSeparator)
};

export function _getTouchEventMap(): _ITouchEventsMap {
    return ('ontouchstart' in window) ? _touchEventsMap : _pointerEventsMap;
}
    }
    


    module wijmo.viewer {
    'use strict';

export enum _TouchDirection {
    None,
    Left,
    Up,
    Right,
    Down
}
    }
    


    module wijmo.viewer {
    



'use strict';

export class _TouchInfo {

    static getCenter(start: wijmo.Point, end: wijmo.Point): wijmo.Point {
        return new wijmo.Point(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2);
    }

    static getCenterClient(startInfo: _TouchInfo, endInfo: _TouchInfo): wijmo.Point {
        return _TouchInfo.getCenter(new wijmo.Point(startInfo.clientX, startInfo.clientY), new wijmo.Point(endInfo.clientX, endInfo.clientY));
    }

    static getCenterScreen(startInfo: _TouchInfo, endInfo: _TouchInfo): wijmo.Point {
        return _TouchInfo.getCenter(new wijmo.Point(startInfo.screenX, startInfo.screenY), new wijmo.Point(endInfo.screenX, endInfo.screenY));
    }

    static getDistance(startInfo: _TouchInfo, endInfo: _TouchInfo): number {
        var deltaX = Math.abs(startInfo.clientX - endInfo.clientX),
            deltaY = Math.abs(startInfo.clientY - endInfo.clientY);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    static _getDirection(start: _TouchInfo, end: _TouchInfo): _TouchDirection {
        var deltaX = end.clientX - start.clientX,
            deltaY = end.clientY - start.clientY,
            isHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
        if (isHorizontal) {
            if (deltaX > 0) return _TouchDirection.Right;
            if (deltaX < 0) return _TouchDirection.Left;
            return _TouchDirection.None;
        }

        if (deltaY > 0) return _TouchDirection.Down;
        if (deltaY < 0) return _TouchDirection.Up;
        return _TouchDirection.None;
    }

    private _id: number;
    private _target: EventTarget;
    private _screenX: number;
    private _screenY: number;
    private _clientX: number;
    private _clientY: number;
    private _systemTouchInfo: Touch | PointerEvent;

    constructor(source: Touch | PointerEvent) {
        this._systemTouchInfo = source;

        if (source instanceof Touch) {
            this._id = source.identifier;
        } else {
            this._id = source.pointerId;
        }

        this._target = source.target;
        this._screenX = source.screenX;
        this._screenY = source.screenY;
        this._clientX = source.clientX;
        this._clientY = source.clientY;
    }

    get id(): number {
        return this._id;
    }

    get systemTouchInfo(): Touch | PointerEvent {
        return this._systemTouchInfo;
    }

    get screenX() {
        return this._screenX;
    }

    get screenY() {
        return this._screenY;
    }

    get clientX() {
        return this._clientX;
    }

    get clientY() {
        return this._clientY;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

export class _SpeedReducer {
    private _timeInterval = 50;
    private _speedInterval = 5;
    private _timer;
    private _disposeEvents: Function;

    get timeInterval(): number {
        return this._timeInterval;
    }
    set timeInterval(value: number) {
        this._timeInterval = value;
    }

    get speedInterval(): number {
        return this._speedInterval;
    }
    set speedInterval(value: number) {
        this._speedInterval = value;
    }

    stop() {
        if (this._timer != null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    start(speedX: number, speedY: number, intervalAction: (x: number, y: number) => void) {
        this.stop();
        if (!intervalAction) return;
        var directionX = speedX >= 0 ? 1 : -1,
            directionY = speedY >= 0 ? 1 : -1,
            curSpeedX = Math.abs(speedX * this._timeInterval),
            curSpeedY = Math.abs(speedY * this._timeInterval);
        var largerSpeed = Math.max(curSpeedX, curSpeedY);
        var times = Math.floor(largerSpeed / this.speedInterval);
        var xInterval = Math.floor(curSpeedX / times),
            yInterval = Math.floor(curSpeedY / times);
        this._timer = setInterval(() => {
            curSpeedX -= xInterval;
            curSpeedY -= yInterval;
            curSpeedX = Math.max(0, curSpeedX);
            curSpeedY = Math.max(0, curSpeedY);
            if (!curSpeedX || !curSpeedY) {
                this.stop();
                return;
            }

            intervalAction(curSpeedX * directionX, curSpeedY * directionY);
        }, this._timeInterval);
    }
}
    }
    


    module wijmo.viewer {
    

'use strict';

// the virtual scroller
export class _Scroller extends wijmo.Control {
    private static _scrollbarWidth = null;

    static getScrollbarWidth(refresh?: boolean): number {
        var parent: HTMLDivElement, child: HTMLDivElement;

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
    }
}
    }
    


    module wijmo.viewer {
    
export interface _IEnumItem {
    text: string;
    value: number;
}

export function _enumToArray(enumType: any): _IEnumItem[] {
    var items = [];
    for (var i in enumType) {
        if (!i || !i.length || i[0] == "_" || isNaN(parseInt(i))) continue;
        items.push({ text: enumType[i], value: i });
    }

    return items;
}
    }
    


    module wijmo.viewer {
    

'use strict';

export class _RubberbandOnAppliedEventArgs extends wijmo.EventArgs {
    private _rect: wijmo.Rect;

    constructor(rect: wijmo.Rect) {
        super();
        this._rect = rect;
    }

    public get rect(): wijmo.Rect {
        return this._rect;
    }
}

    }
    


    module wijmo.viewer {
    

'use strict';

export class _LinkClickedEventArgs extends wijmo.EventArgs {
    private _a: SVGElement;

    constructor(a: SVGElement) {
        super();
        this._a = a;
    }

    get element() {
        return this._a;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

// Specifies the type of a value.
export enum _ParameterType {
    // Bool type.
    Boolean = 0,
    // Date time type.
    DateTime = 1,
    // Time type.
    Time = 2,
    // Date type
    Date = 3,
    // Int type.
    Integer = 4,
    // Float type.
    Float = 5,
    // String type
    String = 6
}

/**
* Specifies the type of a catalog item.
*/
export enum CatalogItemType {
    /**
    * A folder.
    */
    Folder = 0,
    /**
    * A FlexReport definition file.
    */
    File = 1,
    /**
    * An SSRS report or a FlexReport defined in the FlexReport definition file.
    */
    Report = 2
}
    }
    


    module wijmo.viewer {
    

'use strict';

/**
 * Provides arguments for {@link wijmo.viewer.ViewerBase.queryLoadingData} event.
 */
export class QueryLoadingDataEventArgs extends wijmo.EventArgs {
    private _data: any;

    /**
     * Initializes a new instance of the {@link QueryLoadingDataEventArgs} class.
     *
     * @param data The request data sent to the service on loading the document.
     */
    constructor(data?: any) {
        super();
        this._data = data || {};
    }

    /**
     * Gets the request data sent to the service on loading the document.
     */
    get data(): any {
        return this._data;
    }
}
    }
    


    module wijmo.viewer {
    'use strict';

// Describes the status of the execution.
export class _ExecutionStatus {
    // The report is Loaded.
    static loaded = 'Loaded';

    // The report is rendering.
    static rendering = 'Rendering';

    // The report has rendered.
    static completed = 'Completed';

    // The report rendering has stopped.
    static stopped = 'Stopped';

    // The report is cleared.
    static cleared = 'Cleared';

    // The execution is not found.
    static notFound = 'NotFound';
}
    }
    


    module wijmo.viewer {
    'use strict';

export enum _ActionKind {
    Bookmark,
    Custom
}

/**
 * Specifies the mouse modes, which defines the mouse behavior of viewer.
 */
export enum MouseMode {
    /** Select text. */
    SelectTool,
    /** Move page. */
    MoveTool,
    /** Rubberband to zoom. */
    RubberbandTool,
    /** Magnifier tool. */
    MagnifierTool
}

/**
* Specifies the view modes, which define how to show document pages in the view panel.
*/
export enum ViewMode {
    /** Only show one document page. */
    Single,
    /** Show document pages continuously. */
    Continuous
}

/**
 * Describes the supported zoom modes of FlexViewer.
 */
export enum ZoomMode {
    /** Custom zoom mode. The actual zoom factor is determined by the value of the {@link ViewerBase.zoomFactor} property. */
    Custom,
    /** Pages are zoomed in or out as necessary to fit the page width in the view panel. */
    PageWidth,
    /** Pages are zoomed in or out as necessary to fit the whole page in the view panel. */
    WholePage
}

export enum _ViewerActionType {
    TogglePaginated,
    Print,
    Portrait,
    Landscape,
    ShowPageSetupDialog,
    FirstPage,
    PrePage,
    NextPage,
    LastPage,
    PageNumber,
    PageCountLabel,
    Backward,
    Forward,
    SelectTool,
    MoveTool,
    Continuous,
    Single,
    ZoomOut,
    ZoomIn,
    ZoomValue,
    FitWholePage,
    FitPageWidth,
    ToggleFullScreen,
    ShowHamburgerMenu,
    ShowViewMenu,
    ShowSearchBar,
    ShowThumbnails,
    ShowOutlines,
    ShowExportsPanel,
    ShowPageSetupPanel,
    ShowZoomBar,
    ShowSearchOptions,
    SearchPrev,
    SearchNext,
    SearchMatchCase,
    SearchMatchWholeWord,
    RubberbandTool,
    MagnifierTool,
    RotateDocument,
    RotatePage
}
    }
    


    module wijmo.viewer {
    'use strict';

export enum _RotateAngle {
    NoRotate,
    Rotation90,
    Rotation180,
    Rotation270
}
    }
    


    module wijmo.viewer {
    'use strict';

// Specifies the standard paper sizes.
export enum _PaperKind {
    // The paper size is defined by the user.
    Custom = 0,
    // Letter paper (8.5 in. by 11 in.).
    Letter = 1,
    // Letter small paper (8.5 in. by 11 in.).
    LetterSmall = 2,
    // Tabloid paper (11 in. by 17 in.).
    Tabloid = 3,
    // Ledger paper (17 in. by 11 in.).
    Ledger = 4,
    // Legal paper (8.5 in. by 14 in.).
    Legal = 5,
    // Statement paper (5.5 in. by 8.5 in.).
    Statement = 6,
    // Executive paper (7.25 in. by 10.5 in.).
    Executive = 7,
    // A3 paper (297 mm by 420 mm).
    A3 = 8,
    // A4 paper (210 mm by 297 mm).
    A4 = 9,
    // A4 small paper (210 mm by 297 mm).
    A4Small = 10,
    // A5 paper (148 mm by 210 mm).
    A5 = 11,
    // B4 paper (250 mm by 353 mm).
    B4 = 12,
    // B5 paper (176 mm by 250 mm).
    B5 = 13,
    // Folio paper (8.5 in. by 13 in.).
    Folio = 14,
    //  Quarto paper (215 mm by 275 mm).
    Quarto = 15,
    // Standard paper (10 in. by 14 in.).
    Standard10x14 = 16,
    // Standard paper (11 in. by 17 in.).
    Standard11x17 = 17,
    // Note paper (8.5 in. by 11 in.).
    Note = 18,
    //  #9 envelope (3.875 in. by 8.875 in.).
    Number9Envelope = 19,
    // #10 envelope (4.125 in. by 9.5 in.).
    Number10Envelope = 20,
    // #11 envelope (4.5 in. by 10.375 in.).
    Number11Envelope = 21,
    // #12 envelope (4.75 in. by 11 in.).
    Number12Envelope = 22,
    // #14 envelope (5 in. by 11.5 in.).
    Number14Envelope = 23,
    // C paper (17 in. by 22 in.).
    CSheet = 24,
    // D paper (22 in. by 34 in.).
    DSheet = 25,
    // E paper (34 in. by 44 in.).
    ESheet = 26,
    // DL envelope (110 mm by 220 mm).
    DLEnvelope = 27,
    //  C5 envelope (162 mm by 229 mm).
    C5Envelope = 28,
    // C3 envelope (324 mm by 458 mm).
    C3Envelope = 29,
    // C4 envelope (229 mm by 324 mm).
    C4Envelope = 30,
    // C6 envelope (114 mm by 162 mm).
    C6Envelope = 31,
    // C65 envelope (114 mm by 229 mm).
    C65Envelope = 32,
    // B4 envelope (250 mm by 353 mm).
    B4Envelope = 33,
    // B5 envelope (176 mm by 250 mm).
    B5Envelope = 34,
    //  B6 envelope (176 mm by 125 mm).
    B6Envelope = 35,
    // Italy envelope (110 mm by 230 mm).
    ItalyEnvelope = 36,
    // Monarch envelope (3.875 in. by 7.5 in.).
    MonarchEnvelope = 37,
    // 6 3/4 envelope (3.625 in. by 6.5 in.).
    PersonalEnvelope = 38,
    // US standard fanfold (14.875 in. by 11 in.).
    USStandardFanfold = 39,
    // German standard fanfold (8.5 in. by 12 in.).
    GermanStandardFanfold = 40,
    // German legal fanfold (8.5 in. by 13 in.).
    GermanLegalFanfold = 41,
    // ISO B4 (250 mm by 353 mm).
    IsoB4 = 42,
    // Japanese postcard (100 mm by 148 mm).
    JapanesePostcard = 43,
    // Standard paper (9 in. by 11 in.).
    Standard9x11 = 44,
    // Standard paper (10 in. by 11 in.).
    Standard10x11 = 45,
    // Standard paper (15 in. by 11 in.).
    Standard15x11 = 46,
    // Invitation envelope (220 mm by 220 mm).
    InviteEnvelope = 47,
    // Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
    // driver and is used only by Linotronic printers in order to conserve paper.
    LetterExtra = 50,
    // Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
    // driver and is used only by Linotronic printers in order to conserve paper.
    LegalExtra = 51,
    // Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the
    // PostScript driver and is used only by Linotronic printers in order to conserve paper.
    TabloidExtra = 52,
    // A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript
    // driver and is used only by Linotronic printers to help save paper.
    A4Extra = 53,
    // Letter transverse paper (8.275 in. by 11 in.).
    LetterTransverse = 54,
    // A4 transverse paper (210 mm by 297 mm).
    A4Transverse = 55,
    // Letter extra transverse paper (9.275 in. by 12 in.).
    LetterExtraTransverse = 56,
    // SuperA/SuperA/A4 paper (227 mm by 356 mm).
    APlus = 57,
    // SuperB/SuperB/A3 paper (305 mm by 487 mm).
    BPlus = 58,
    // Letter plus paper (8.5 in. by 12.69 in.).
    LetterPlus = 59,
    // A4 plus paper (210 mm by 330 mm).
    A4Plus = 60,
    // A5 transverse paper (148 mm by 210 mm).
    A5Transverse = 61,
    // JIS B5 transverse paper (182 mm by 257 mm).
    B5Transverse = 62,
    // A3 extra paper (322 mm by 445 mm).
    A3Extra = 63,
    // A5 extra paper (174 mm by 235 mm).
    A5Extra = 64,
    // ISO B5 extra paper (201 mm by 276 mm).
    B5Extra = 65,
    // A2 paper (420 mm by 594 mm).
    A2 = 66,
    // A3 transverse paper (297 mm by 420 mm).
    A3Transverse = 67,
    // A3 extra transverse paper (322 mm by 445 mm).
    A3ExtraTransverse = 68,
    // Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
    JapaneseDoublePostcard = 69,
    // A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
    A6 = 70,
    // Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeKakuNumber2 = 71,
    // Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeKakuNumber3 = 72,
    // Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeChouNumber3 = 73,
    // Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeChouNumber4 = 74,
    // Letter rotated paper (11 in. by 8.5 in.).
    LetterRotated = 75,
    // A3 rotated paper (420 mm by 297 mm).
    A3Rotated = 76,
    //  A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0, or later.
    A4Rotated = 77,
    // A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
    A5Rotated = 78,
    // JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT 4.0, or later.
    B4JisRotated = 79,
    // JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
    B5JisRotated = 80,
    // Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows NT 4.0, or later.
    JapanesePostcardRotated = 81,
    // Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98, Windows NT 4.0, or later.
    JapaneseDoublePostcardRotated = 82,
    // A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0, or later.
    A6Rotated = 83,
    // Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeKakuNumber2Rotated = 84,
    // Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeKakuNumber3Rotated = 85,
    // Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeChouNumber3Rotated = 86,
    // Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeChouNumber4Rotated = 87,
    // JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
    B6Jis = 88,
    // JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT 4.0, or later.
    B6JisRotated = 89,
    // Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or later.
    Standard12x11 = 90,
    // Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeYouNumber4 = 91,
    // Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or later.
    JapaneseEnvelopeYouNumber4Rotated = 92,
    // People's Republic of China 16K paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc16K = 93,
    // People's Republic of China 32K paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc32K = 94,
    // People's Republic of China 32K big paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc32KBig = 95,
    // People's Republic of China #1 envelope (102 mm by 165 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber1 = 96,
    // People's Republic of China #2 envelope (102 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber2 = 97,
    // People's Republic of China #3 envelope (125 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber3 = 98,
    // People's Republic of China #4 envelope (110 mm by 208 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber4 = 99,
    // People's Republic of China #5 envelope (110 mm by 220 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber5 = 100,
    // People's Republic of China #6 envelope (120 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber6 = 101,
    // People's Republic of China #7 envelope (160 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber7 = 102,
    // People's Republic of China #8 envelope (120 mm by 309 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber8 = 103,
    // People's Republic of China #9 envelope (229 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber9 = 104,
    // People's Republic of China #10 envelope (324 mm by 458 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber10 = 105,
    // People's Republic of China 16K rotated paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc16KRotated = 106,
    // People's Republic of China 32K rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc32KRotated = 107,
    // People's Republic of China 32K big rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
    Prc32KBigRotated = 108,
    //  People's Republic of China #1 rotated envelope (165 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber1Rotated = 109,
    // People's Republic of China #2 rotated envelope (176 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber2Rotated = 110,
    // People's Republic of China #3 rotated envelope (176 mm by 125 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber3Rotated = 111,
    // People's Republic of China #4 rotated envelope (208 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber4Rotated = 112,
    // People's Republic of China Envelope #5 rotated envelope (220 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber5Rotated = 113,
    // People's Republic of China #6 rotated envelope (230 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber6Rotated = 114,
    // People's Republic of China #7 rotated envelope (230 mm by 160 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber7Rotated = 115,
    // People's Republic of China #8 rotated envelope (309 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber8Rotated = 116,
    // People's Republic of China #9 rotated envelope (324 mm by 229 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber9Rotated = 117,
    // People's Republic of China #10 rotated envelope (458 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
    PrcEnvelopeNumber10Rotated = 118
}
    }
    


    module wijmo.viewer {
    

'use strict';

/**
 * Provides arguments for {@link wijmo.viewer.ViewerBase.beforeSendRequest} event.
 */
export class RequestEventArgs extends wijmo.EventArgs {
    private _url: string;
    private _settings: any;

    /**
     * Initializes a new instance of the {@link RequestEventArgs} class.
     *
     * @param url String containing the URL to which the request is sent.
     * @param settings An object used to configure the request. It has the
     * same structure and semantics as the <b>settings</b> parameter of the
     * {@link wijmo.httpRequest} method.
     */
    constructor(url: string, settings: any) {
        super();
        this._url = url;
        this._settings = settings;
    }

    /**
     * Gets or sets the URL to which the request is sent.
     */
    get url() {
        return this._url;
    }
    set url(value: string) {
        this._url = value;
    }

    /**
     * Gets or sets the object used to configure the request. It has the
     * same structure and semantics as the <b>settings</b> parameter of the
     * {@link wijmo.httpRequest} method.
     */
    get settings() {
        return this._settings;
    }
    set settings(value: any) {
        this._settings = value;
    }
}
    }
    


    module wijmo.viewer {
    

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

    }
    


    module wijmo.viewer {
    

'use strict';

// Enumerates units of measurement.
export enum _UnitType {
    // Specifies the document unit (1/300 inch) as the unit of measure.
    Document,
    // Specifies the inch as the unit of measure.
    Inch = 1,
    // Specifies the millimeter as the unit of measure.
    Mm = 2,
    // Specifies the pica unit (1/6 inch) as the unit of measure.
    Pica = 3,
    // Specifies a printer's point (1/72 inch) as the unit of measure.
    Point = 4,
    // Specifies a twip (1/1440 inch) as the unit of measure.
    Twip = 5,
    // Specifies a hundredths of an inch as the unit of measure.
    InHs = 6,
    // Specifies 1/75 inch as the unit of measure.
    Display = 7,
    // Specifies centimetre's as the unit of measure.
    Cm = 8,
    // Specifies DIP's 1/96 inch as the unit of measure.
    Dip = 9
}

// A utility structure specifying some values related to units of measurement.
export class _Unit {
    // Millimeters per inch.
    static _MmPerInch = 25.4;
    // Document units per inch.
    static _DocumentUnitsPerInch = 300;
    // Points per inch.
    static _PointsPerInch = 72;
    // Twips per inch.
    static _TwipsPerInch = 1440;
    // Picas per inch.
    static _PicaPerInch = 6;
    // Centimeters per inch.
    static _CmPerInch = _Unit._MmPerInch / 10;
    // Display units per inch.
    static _DisplayPerInch = 75;
    // DIP units per inch.
    static _DipPerInch = 96;

    private static _unitTypes = {
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

    private static _unitTypeDic;
    private _value: number;
    private _units: _UnitType;
    private _valueInPixel: number;

    // Creates a _Unit instance.
    // @param value The value.
    // @param units The units of the value. If it is not passed, it is Dip for default.
    constructor(value: any, units: _UnitType = _UnitType.Dip) {
        _Unit._initUnitTypeDic();
        if (wijmo.isObject(value)) {
            var obj: _Unit = <_Unit>value;
            value = obj.value;
            units = obj.units;
        } else if (wijmo.isString(value)) {
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

    private static _initUnitTypeDic() {
        if (_Unit._unitTypeDic) {
            return;
        }

        _Unit._unitTypeDic = {};
        for (var k in _Unit._unitTypes) {
            _Unit._unitTypeDic[_Unit._unitTypeDic[k] = _Unit._unitTypes[k]] = k;
        }
    }

    // Gets the value of the current unit.
    get value(): number {
        return this._value;
    }

    // Gets the unit of measurement of the current unit.
    get units(): _UnitType {
        return this._units;
    }

    // Gets the value in pixel.
    get valueInPixel(): number {
        return this._valueInPixel;
    }

    // Convert to string.
    // @return The string of converting result.
    toString(): string {
        return _Unit.toString(this);
    }

    // Convert the unit to string.
    // @param unit The unit used to convert.
    // @return The string of converting result.
    static toString(unit: _Unit): string {
        if (unit.value == null) {
            return '';
        }
        return unit.value + _Unit._unitTypeDic[unit.units];
    }

    // Convert the value from one kind of unit to another.
    // @param value The value used to convert.
    // @param from The units of the value.
    // @param to The units which is converted to.
    // @return The number of converting result.
    static convertValue(value: number, from: _UnitType, to: _UnitType): number {
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
    }
}
    }
    


    module wijmo.viewer {
    

// Describing a set of four floating-point numbers that represent the location and size of a rectangle.
export interface _IRect {
    // The x-coordinate of the upper-left corner of this {@link _IRect}.
    x: number;
    // The y-coordinate of the upper-left corner of this {@link _IRect}.
    y: number;
    // The width of this {@link _IRect}.
    width: number;
    // The height of this {@link _IRect}.
    height: number;
}

export interface _ISize {
    width: _Unit;
    height: _Unit;
}
    }
    


    module wijmo.viewer {
    'use strict';

/**
 * Defines the interface of promise which is used for asynchronous calling.
 */
export interface IPromise {
    /**
     * Call the function after a promise is fulfilled or rejected.
     *
     * @param onFulfilled The function which will be executed when a promise is fulfilled.
     * This has a single parameter, the fulfillment value. If a value is returned, it will be 
     * passed to the next callback function. If no value is returned, the original value will be passed.
     * @param onRejected The function which will be executed when a promise is rejected.
     * This has a single parameter, the rejection reason. If a value is returned, it will be 
     * passed to the next callback function. If no value is returned, the original value will be passed.
     * @return An IPromise equivalent to the value you return from onFulfilled/onRejected after being passed.
     */
    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): IPromise;

    /**
     * Call the function after a promise is rejected.
     *
     * @param onRejected The function which will be executed when a promise is rejected.
     * This has a single parameter, the rejection reason. The return value will be 
     * passed to the next callback function.
     * @return An IPromise equivalent to the value returned by onFulfilled/onRejected after being passed.
     */
    catch(onRejected: (reason?: any) => any): IPromise;
}

interface _IPromiseCallback {
    onFulfilled?: (value?: any) => any;
    onRejected?: (reason?: any) => any;
}

export class _Promise implements IPromise {

    private _callbacks: _IPromiseCallback[] = [];
    private _finished = false;

    get isFinished() {
        return this._finished;
    }

    cancel() {
        this._finished = true;
    }

    then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) {
        this._callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });
        return this;
    }

    catch(onRejected: (reason?: any) => any): IPromise {
        return this.then(null, onRejected);
    }

    resolve(value?: any) {
        setTimeout(() => {
            try {
                this.onFulfilled(value);
            } catch (e) {
                this.onRejected(e);
            }
        }, 0);

        return this;
    }

    reject(reason?: any) {
        setTimeout(() => {
            this.onRejected(reason);
        }, 0);

        return this;
    }

    onFulfilled(value: any) {
        if (this._finished) {
            return;
        }
        this._finished = true;

        var callback: _IPromiseCallback;
        while (callback = this._callbacks.shift()) {
            if (callback.onFulfilled) {
                var newValue = callback.onFulfilled(value);
                if (newValue !== undefined) {
                    value = newValue;
                }
            }
        }
    }

    onRejected(reason: any) {
        if (this._finished) {
            return;
        }
        this._finished = true;

        var callback: _IPromiseCallback;
        while (callback = this._callbacks.shift()) {
            if (callback.onRejected) {
                var value = callback.onRejected(reason);
                this.onFulfilled(value);
                return;
            }
        }

        throw reason;
    }
}

export class _CompositedPromise extends _Promise {
    private _promises: IPromise[];

    constructor(promises: IPromise[]) {
        super();
        this._promises = promises;
        this._init();
    }

    _init() {
        if (!this._promises || !this._promises.length) {
            this.reject('No promises in current composited promise.');
            return;
        }

        var length = this._promises.length, i = 0, values: any[] = [], isRejected = false;
        this._promises.some(p => {
            p.then(v => {
                if (isRejected) {
                    return;
                }

                values.push(v);
                if (++i >= length) {
                    this.resolve(values);
                }
            }).catch(r => {
                isRejected = true;
                this.reject(r);
            });

            return isRejected;
        });
    }
}
    }
    


    module wijmo.viewer {
    




'use strict';

// Defines the document service.
export interface _IDocumentService {
    // The service url.
    serviceUrl: string;
    // The document path.
    filePath: string;
}

// Defines the document status.
export interface _IDocumentStatus {
    // The execution status.
    status: string;
    // The error list.
    errorList: string[];
    // The progress of the execution.
    progress: number;
    // The page count.
    pageCount: number;
    // The expired date time of the cache.
    expiredDateTime: Date;
    // A boolean value indicates if the document has outlines.
    hasOutlines: boolean;
    // The initial position to show after the rendering.
    initialPosition;
}

// Defines the features supported by the document.
export interface _IDocumentFeatures {
    // Supports paginated mode of the document rendering.
    paginated: boolean;
    // Supports non paginated mode of the document rendering.
    nonPaginated: boolean;
    // Supports text searching in paginated mode.
    textSearchInPaginatedMode: boolean;
    // Supports set page settings for document.
    pageSettings: boolean;
}

// Defines the document status.
export interface _IDocumentStatus {
    // The execution status.
    status: string;
    // The error list.
    errorList: string[];
    // The progress of the execution.
    progress: number;
    // The page count.
    pageCount: number;
    // The expired date time of the cache.
    expiredDateTime: Date;
    // A boolean value indicates if the document has outlines.
    hasOutlines: boolean;
    // The initial position to show after the rendering.
    initialPosition;
}

// Defines the features supported by the document.
export interface _IDocumentFeatures {
    // Supports paginated mode of the document rendering.
    paginated: boolean;
    // Supports non paginated mode of the document rendering.
    nonPaginated: boolean;
    // Supports text searching in paginated mode.
    textSearchInPaginatedMode: boolean;
    // Supports set page settings for document.
    pageSettings: boolean;
}

// Defines the execution info.
export interface _IExecutionInfo {
    // The path of document source.
    path: string;
    // The loaded date time of the document.
    loadedDateTime: Date;
    // The expired date time of the cache.
    expiredDateTime: Date;
    // The page settings of document source.
    pageSettings?: _IPageSettings;
    // The features supported by the document source.
    features?: _IDocumentFeatures;
    // The status of document source.
    status?: _IDocumentStatus;
    // the location to get outlines.
    outlinesLocation: string;
    // the location to get status.
    statusLocation: string;
    //the location to get page settings.
    pageSettingsLocation: string;
    // the location to get features.
    featuresLocation: string;
    // the location to get supported formates.
    supportedFormatsLocation: string;
}

// Defines the execution info.
export interface _IExecutionInfo {
    // The path of document source.
    path: string;
    // The loaded date time of the document.
    loadedDateTime: Date;
    // The expired date time of the cache.
    expiredDateTime: Date;
    // The page settings of document source.
    pageSettings?: _IPageSettings;
    // The features supported by the document source.
    features?: _IDocumentFeatures;
    // The status of document source.
    status?: _IDocumentStatus;
    // the location to get outlines.
    outlinesLocation: string;
    // the location to get status.
    statusLocation: string;
    //the location to get page settings.
    pageSettingsLocation: string;
    // the location to get features.
    featuresLocation: string;
    // the location to get supported formates.
    supportedFormatsLocation: string;
}

// Defines the settings of page.
export interface _IPageSettings {
    // Whether the content should be represented as set of fixed sized pages.
    paginated: boolean;

    // Height of page.
    height: _Unit;

    // Width of page.
    width: _Unit;

    // Gets or sets the bottom margin.
    bottomMargin: _Unit;

    // Gets or sets a value indicating whether to use landscape orientation.
    // Changing this property swaps height and width of the page.
    landscape: boolean;

    // Gets or sets the left margin.
    leftMargin: _Unit;

    // Gets or sets the paper kind.
    paperSize: _PaperKind;

    // Gets or sets the right margin.
    rightMargin: _Unit;

    // Gets or sets the top margin.
    topMargin: _Unit;
}

// Represens an item of the search result.
export interface _ISearchResultItem {
    // The adjacent text of this {@link _ISearchResultItem}.
    nearText: string;
    // The position of the search text in {@link nearText} of this {@link _ISearchResultItem}.
    positionInNearText: number;
    // The bounds list of this {@link _ISearchResultItem}.
    boundsList: _IRect[];
    // The page index of this {@link _ISearchResultItem}.
    pageIndex: number;
}

// Used during document rendering to build tree of outlines.
export interface _IOutlineNode {
    // The caption of this {@link _IOutlineNode}.
    caption: string;
    // The children array of {@link IOutline} of this {@link _IOutlineNode}.
    children: _IOutlineNode[] | (() => IPromise);
    // The level of this {@link IOutline}.
    level: number;
    // The string represents the linked target for this outline node.
    target: string;
    // The {@link _IDocumentPosition} of this {@link _IOutlineNode}.
    position?: _IDocumentPosition;
}

// Describing the information of position of page.
export interface _IDocumentPosition {
    // The bound of this {@link _IDocumentPosition}.
    pageBounds?: _IRect;
    // The page index of this {@link _IDocumentPosition}.
    pageIndex: number;
}

// Describing a supported export format.
export interface _IExportDescription {
    // Short description of the current export format.
    name: string;
    // Default filename extension for the current export format.
    format: string;
    // The array of {@link _IExportOptionDescription} for the current export format.
    optionDescriptions?: _IExportOptionDescription[];
}

// Describing option of export format.
export interface _IExportOptionDescription {
    // Name of the {@link _IExportOptionDescription}.
    name: string;
    // Data type of the {@link _IExportOptionDescription}.
    type: string;
    // Indicate whether option value can be null.
    nullable: boolean;
    // Default value of the {@link _IExportOptionDescription}.
    defaultValue: any;
    // Supported values of the {@link _IExportOptionDescription}.
    allowedValues?: string[];
    // Option group name.
    group: string;
}

// Defines the document options
export interface _IDocumentOptions extends _IDocumentService {
    // The layout mode.
    paginated?: boolean;
}

export interface _IRenderOptions {
    format: string;
    paged?: boolean,
    outputRange?: string | number; // 1, "1-5"
    resolution?: number;
}

export interface _ISearchOptions {
    text: string;
    matchCase?: boolean;
    wholeWord?: boolean;
}

    }
    


    module wijmo.viewer {
    


export interface _IReportService extends _IDocumentService {
    // The report name.
    reportName: string;
}

export interface _IReportOptions extends _IDocumentOptions, _IReportService {
}

// The report status.
export interface _IReportStatus extends _IDocumentStatus {
    // the initialized position should be navigated to after the report is rendered.
    initialPosition: _IDocumentPosition;
}

export interface _IReportExecutionInfo extends _IExecutionInfo {
    // The cache id.
    id: string;
    // a boolean value indicating whether the report has parameters.
    hasParameters: boolean;
    // the location to get parameters.
    parametersLocation: string;
}

// Describing a user-defined parameter.
export interface _IParameter {
    // Indicates whether a string parameter can be the empty. Ignored for non-string parameters. 
    allowBlank: boolean;
    // Supported values of the {@link _IParameter}.
    allowedValues: { key: string; value: any }[];
    // Data type of the {@link _IParameter}.
    dataType: _ParameterType;
    // The error which occurs after the parameter is set.
    error?: string;
    // Indicating the {@link _IParameter} should not be displayed to the user.
    hidden: boolean;
    // The maximum length of a string parameter. 0 means unlimited length. Ignored for non-string parameters. 
    maxLength: number;
    // Indicates if it is a multivalue {@link _IParameter}.
    multiValue: boolean;
    // Name of the {@link _IParameter}.
    name: string;
    // Indicating the value for this {@link _IParameter} can be Null.
    // Cannot be true if this is a multivalue parameter.
    nullable: boolean;
    // Prompt to display when asking for {@link _IParameter} values.
    prompt: string;
    // Value of the {@link _IParameter}. Value can be specifed as array if it is a multivalue {@link _IParameter}
    // In this case, all items should have same type. Item can not be an array.
    value: any;
}

/**
* Describes an item in the report server of a specific path.
*/
export interface ICatalogItem {
    /**
    * The short name of the item.
    */
    name: string;
    /**
    * The full path (starts with the report provider key) of the item.
    */
    path: string;
    /**
    * The type of the item.
    */
    type: CatalogItemType;
    /**
    * The array of child items.
    */
    items: ICatalogItem[];
}
    }
    


    module wijmo.viewer {
    







'use strict';

const _wjEventsName = '__wjEvents';

export const _abstractMethodExceptionText = 'It is an abstract method, please implement it.';
export const _hiddenCss = 'hidden';

export function _pointMove(positive: boolean, pos: wijmo.Point, detalPosOrX: wijmo.Point | number, y?: number): wijmo.Point {
    var x: number, factor = positive ? 1 : -1;
    if (detalPosOrX instanceof wijmo.Point) {
        x = detalPosOrX.x;
        y = detalPosOrX.y;
    } else {
        x = detalPosOrX;
        y = y || 0;
    }

    return new wijmo.Point(pos.x + factor * x, pos.y + factor * y);
}

export function _disableCache(url: string): string {
    return url + (url.indexOf('?') == -1 ? '?' : '&') + '_=' + new Date().getTime();
}

export function _removeChildren(node: HTMLElement, condition?: (ele: Element) => boolean): void {
    if (!node || !node.children) {
        return;
    }

    for (var ch = node.children, i = ch.length - 1; i > -1; i--) {
        var child = ch[i];
        if (condition == null || condition(child)) {
            var cc = child.querySelector('.wj-control');
            if (cc && (cc = <any>wijmo.Control.getControl(cc))) {
                (<wijmo.Control><any>cc).dispose();
            }

            node.removeChild(child);
        }
    }
}

export function _toDOMs(html: string): DocumentFragment {
    var node: Node, container = document.createElement("div"), f = document.createDocumentFragment();
    container.innerHTML = html;
    while (node = container.firstChild) f.appendChild(node);
    return f;
}

export function _addEvent(elm: any, evType: string, fn: Function, useCapture?: boolean): void {
    var types = evType.split(","), type;
    for (var i = 0; i < types.length; i++) {
        type = types[i].trim();
        if (elm.addEventListener) {
            elm.addEventListener(type, fn, useCapture);
        } else if (elm.attachEvent) {
            elm.attachEvent('on' + type, fn);
        } else {
            elm['on' + type] = fn;
        }
    }
}

export function _removeEvent(elm: any, evType: string, fn: Function): void {
    var types = evType.split(","), type;
    for (var i = 0; i < types.length; i++) {
        type = types[i].trim();
        if (elm.removeEventListener) {
            elm.removeEventListener(type, fn);
        } else if (elm.detachEvent) {
            elm.detachEvent('on' + type, fn);
        } else {
            elm['on' + type] = null;
        }
    }
}

export function _addWjHandler(key: string, event: wijmo.Event, func: wijmo.IEventHandler, self?: any) {
    if (key) {
        var handlersDic = event[_wjEventsName];
        if (!handlersDic) {
            handlersDic = event[_wjEventsName] = {};
        }

        var handlers = <wijmo.IEventHandler[]>handlersDic[key];
        if (!handlers) {
            handlers = handlersDic[key] = [];
        }

        handlers.push(func);
    }

    event.addHandler(func, self);
}

export function _removeAllWjHandlers(key: string, event: wijmo.Event) {
    if (!key) {
        return;
    }

    var handlersDic = event[_wjEventsName];
    if (!handlersDic) {
        return;
    }

    var handlers = <wijmo.IEventHandler[]>handlersDic[key];
    if (!handlers) {
        return;
    }

    handlers.forEach(h => event.removeHandler(h));
}

export function _getErrorMessage(reason): string {
    var errorText: string;

    if (_ArReportService.IsError(reason)) {
        errorText = reason.json.Error.Description;
    } else {
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

export function _twipToPixel(value: number): number {
    return _Unit.convertValue(value, _UnitType.Twip, _UnitType.Dip);
}

export function _pixelToTwip(value: number): number {
    return _Unit.convertValue(value, _UnitType.Dip, _UnitType.Twip);
}

export function _transformSvg(svg: SVGElement, width: number, height: number, zoomFactor?: number, rotateAngle?: _RotateAngle): SVGElement {
    zoomFactor = zoomFactor == null ? 1.0 : zoomFactor;
    var g = <SVGGElement>svg.querySelector('g');
    if (g) {
        var transformAttr = 'scale(' + zoomFactor + ')';
        if (rotateAngle != null) {
            switch (rotateAngle) {
                case _RotateAngle.Rotation90:
                    transformAttr += ' rotate(90)';
                    transformAttr += ' translate(0 ' + -height + ')';
                    break;
                case _RotateAngle.Rotation180:
                    transformAttr += ' rotate(180)';
                    transformAttr += ' translate(' + -width + ' ' + -height + ')';
                    break;
                case _RotateAngle.Rotation270:
                    transformAttr += ' rotate(270)';
                    transformAttr += ' translate(' + -width + ' 0)';
                    break;
            }
        }
        g.setAttribute('transform', transformAttr);
        // In IE, if we set the transform attribute of G element, the element in the G element maybe displayed incorrectly(144673), 
        // to fix it, we have to redraw the svg element: remove the G element and append it to svg again.
        if (wijmo.isIE) {
            svg = <SVGElement>g.parentNode;
            svg.removeChild(g);
            svg.appendChild(g);
        }
    }

    return svg;
}

export function _getTransformedPosition(bound: _IRect, size: _ISize, rotateAngle: _RotateAngle, zoomFactor: number): wijmo.Point {
    var boundsPx = {
        x: _twipToPixel(bound.x),
        y: _twipToPixel(bound.y),
        width: _twipToPixel(bound.width),
        height: _twipToPixel(bound.height)
    }, heightOffset: number, widthOffset: number;

    switch (rotateAngle) {
        case _RotateAngle.NoRotate:
            heightOffset = boundsPx.y;
            widthOffset = boundsPx.x;
            break;
        case _RotateAngle.Rotation90:
            heightOffset = boundsPx.x;
            widthOffset = size.height.valueInPixel - boundsPx.y - boundsPx.height;
            break;
        case _RotateAngle.Rotation180:
            heightOffset = size.height.valueInPixel - boundsPx.y - boundsPx.height;
            widthOffset = size.width.valueInPixel - boundsPx.x - boundsPx.width;
            break;
        case _RotateAngle.Rotation270:
            heightOffset = size.width.valueInPixel - boundsPx.x - boundsPx.width;
            widthOffset = boundsPx.y;
            break;
    }

    return new wijmo.Point(widthOffset * zoomFactor, heightOffset * zoomFactor);
}

export function _getRotatedSize(size: _ISize, rotateAngle: _RotateAngle): _ISize {
    if (rotateAngle === _RotateAngle.NoRotate || rotateAngle === _RotateAngle.Rotation180) {
        return size;
    }

    return {
        width: size.height,
        height: size.width
    };
}

export function _strEndsWith(str: string, value: string, ignoreCase = false) {
    return ignoreCase
        ? str.slice(-value.length).toLowerCase() === value.toLowerCase()
        : str.slice(-value.length) === value;
}

export function _isEqual(a: any, b: any) {
    if (a && b && wijmo.isFunction((<Object>a).valueOf) && wijmo.isFunction((<Object>b).valueOf)) {
        return (<Object>a).valueOf() === (<Object>b).valueOf();
    }

    return a === b;
}
    }
    


    module wijmo.viewer {
    








'use strict';

export class _ParametersEditor extends wijmo.Control {
    private _itemSources: _IParameter[];
    private _parameters: Object = {};
    private _errors: any[] = [];
    private static _paramIdAttr = 'param-id';
    private static _errorsHiddenCss = 'wj-parametererrors-hidden';
    private _errorsVisible = false;
    private _validateTimer: any;
    private _lastEditedParam: string;
    private static _dateTimeFormat = 'MM/dd/yyyy HH:mm';
    private _savingParam = false;

    readonly commit = new wijmo.Event<_ParametersEditor, wijmo.EventArgs>();
    readonly validate = new wijmo.Event<_ParametersEditor, wijmo.EventArgs>();

    constructor(element: any) {
        super(element);
        wijmo.addClass(this.hostElement, 'wj-parameterscontainer');
        this._updateErrorsVisible();
    }

    _setErrors(value: any[]) {
        this._errors = value;
        this._updateErrorDiv();
    }

    get parameters(): Object {
        return this._parameters;
    }

    get itemsSource(): _IParameter[] {
        return this._itemSources;
    }
    set itemsSource(value: _IParameter[]) {
        this._itemSources = value;
        this._parameters = {};
        this._render();
        var errors = [];
        (value || []).forEach(v => {
            if (v.error) {
                errors.push({ key: v.name, value: v.error });
            }
        });

        this._setErrors(errors);
    }

    set savingParam(value: boolean) {
        this._savingParam = value;
    }

    _reset() {
        this._lastEditedParam = null;
    }

    _setErrorsVisible(value: boolean) {
        this._errorsVisible = value;
        this._updateErrorsVisible();
    }

    _updateErrorsVisible() {
        if (this._errorsVisible) {
            wijmo.removeClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
        } else {
            wijmo.addClass(this.hostElement, _ParametersEditor._errorsHiddenCss);
        }
    }

    onCommit() {
        this.commit.raise(this);
    }

    onValidate() {
        this.validate.raise(this);
        this._setErrorsVisible(false);
    }

    _deferValidate(paramName: string, beforeValidate?: Function, afterValidate?: Function) {
        if (this._validateTimer != null) {
            clearTimeout(this._validateTimer);
            this._validateTimer = null;
        }

        this._savingParam = true;

        this._validateTimer = setTimeout(() => {
            if (beforeValidate != null) {
                beforeValidate();
            }

            this.onValidate();

            if (afterValidate != null) {
                afterValidate();
            }

            this._lastEditedParam = paramName;
            this._validateTimer = null;
        }, 500);
    }

    private _updateErrorDiv() {
        var errorList = this._errors || [], errorDivList = this.hostElement.querySelectorAll('.error');
        for (var i = 0; i < errorDivList.length; i++) {
            errorDivList[i].parentNode.removeChild(errorDivList[i]);
        }

        for (var i = 0; i < errorList.length; i++) {
            var errorMessageDiv: HTMLDivElement,
                element = <HTMLElement>this.hostElement.querySelector('*[' + _ParametersEditor._paramIdAttr + '="' + errorList[i].key + '"]'),
                message = errorList[i].value;
            if (element) {
                errorMessageDiv = document.createElement('div');
                errorMessageDiv.innerHTML = message;
                errorMessageDiv.className = 'error';
                element.appendChild(errorMessageDiv);
            }
        }
    }

    _render() {
        var lastEditor: Element;

        // remove all editors except the last edited one.
        _removeChildren(this.hostElement, e => {
            if (!this._lastEditedParam || (e.getAttribute(_ParametersEditor._paramIdAttr) !== this._lastEditedParam)) {
                return true;
            }

            lastEditor = e;
        });

        if (!this._itemSources) {
            return;
        }

        this._itemSources.forEach((p) => {
            if (this._lastEditedParam === p.name) {
                this._lastEditedParam = null;
                lastEditor = null;
                return; //continue;
            }

            if (!!p.hidden) {
                return; // continue;
            }

            var parameterContainer: HTMLDivElement = document.createElement('div'),
                parameterLabel: HTMLSpanElement = document.createElement('span'),
                parameterControl: HTMLElement = null;

            parameterContainer.className = 'wj-parametercontainer';
            parameterLabel.className = 'wj-parameterhead';
            parameterLabel.innerHTML = p.prompt || p.name;

            if (wijmo.isArray(p.allowedValues)) {
                parameterControl = this._generateComboEditor(p);
            } else {
                switch (p.dataType) {
                    case _ParameterType.Boolean:
                        parameterControl = this._generateBoolEditor(p);
                        break;
                    case _ParameterType.DateTime:
                    case _ParameterType.Time:
                    case _ParameterType.Date:
                        parameterControl = this._generateDateTimeEditor(p);
                        break;
                    case _ParameterType.Integer:
                    case _ParameterType.Float:
                        parameterControl = this._generateNumberEditor(p);
                        break;
                    case _ParameterType.String:
                        parameterControl = this._generateStringEditor(p);
                        break;
                }
            }
            if (parameterControl) {
                parameterControl.className += ' wj-parametercontrol';
                parameterContainer.setAttribute(_ParametersEditor._paramIdAttr, p.name)
                parameterContainer.appendChild(parameterLabel);
                parameterContainer.appendChild(parameterControl);

                if (lastEditor) {
                    this.hostElement.insertBefore(parameterContainer, lastEditor);
                } else {
                    this.hostElement.appendChild(parameterContainer);
                }
            }
        });

        var applyBtn = document.createElement('input');
        applyBtn.type = 'button';
        applyBtn.value = wijmo.culture.Viewer.apply;
        applyBtn.className = 'wj-applybutton';
        const clickHandler = () => {
            if (this._savingParam) {
                setTimeout(clickHandler, 100);
            } else {
                if (this._validateParameters()) {
                    this._errors = [];
                    this.onCommit();
                }

                this._setErrorsVisible(true);
            }
        };
        _addEvent(applyBtn, 'click', clickHandler);

        this.hostElement.appendChild(applyBtn);
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._reset();
            this._render();
        }
    }

    _validateParameters(): boolean {
        var textareas: NodeList = this.hostElement.querySelectorAll('textarea'),
            element: HTMLElement, errorList = [], parameters = this.itemsSource;

        for (var i = 0; i < parameters.length; i++) {
            var curParam = parameters[i];
            element = <HTMLElement>this.hostElement.querySelector('[' + _ParametersEditor._paramIdAttr + '="' + curParam.name + '"]');

            if ((curParam.value == null || curParam.value === "") &&
                !curParam.nullable && !(curParam.dataType === _ParameterType.String && curParam.allowBlank) &&
                !this.parameters.hasOwnProperty(curParam.name) && !this.parameters[curParam.name]) {
                if (element) {
                    errorList.push({ key: curParam.name, value: wijmo.culture.Viewer.nullParameterError });
                }
            }
        }

        //check input text's format.
        for (var i = 0; i < textareas.length; i++) {
            var textarea: HTMLTextAreaElement = <HTMLTextAreaElement>textareas.item(i), dataType: number,
                values: any[] = [], currentResult: boolean = true;
            dataType = parseInt(textarea.getAttribute('data-type'));

            switch (dataType) {
                case _ParameterType.Date:
                case _ParameterType.DateTime:
                case _ParameterType.Time:
                    currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isDate);
                    break;
                case _ParameterType.Float:
                    currentResult = _ParametersEditor._checkValueType(textarea.value, _ParametersEditor._isFloat);
                    break;
                case _ParameterType.Integer:
                    currentResult = _ParametersEditor._checkValueType(textarea.value, wijmo.isInt);
                    break;
            }

            if (!currentResult) {
                errorList.push({ key: textarea.parentElement.id, value: wijmo.culture.Viewer.invalidParameterError });
            }
        }

        this._setErrors(errorList);
        return errorList.length <= 0;
    }

    static _isFloat(value: string) {
        return !isNaN(parseFloat(value));
    }

    static _checkValueType(value: string, isSpecificType: Function): boolean {
        var values: string[] = value.split('\n');

        for (var i = 0; i < values.length; i++) {
            if (values[i].trim().length <= 0 || isSpecificType(values[i].trim())) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }

    private _generateComboEditor(parameter: _IParameter): HTMLElement {
        var combo, itemsSource: Object[] = [], element = document.createElement('div'),
            multiSelect: _MultiSelectEx, values, checkedItems = [],
            isParameterResolved = (parameter.allowedValues && parameter.allowedValues.length > 0),
            isAllowedValue = isParameterResolved && (parameter.allowedValues.filter(val => _isEqual(val.value, parameter.value)).length > 0);

        if (parameter.multiValue) {
            combo = new _MultiSelectEx(element);
        } else {
            combo = new wijmo.input.ComboBox(element);
            if (parameter.nullable) {
                itemsSource.push({ name: wijmo.culture.Viewer.parameterNoneItemsSelected, value: null });
            } else if (isParameterResolved && (parameter.value == null || !isAllowedValue)) {
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
            } else if (parameter.value) {
                for (var i = 0; i < parameter.value.length; i++) {
                    for (var j = 0; j < multiSelect.itemsSource.length; j++) {
                        if (_isEqual(multiSelect.itemsSource[j].value, parameter.value[i])) {
                            checkedItems.push(multiSelect.itemsSource[j]);
                            break;
                        }
                    }
                }
                multiSelect.checkedItems = checkedItems;
            }

            multiSelect.lostFocus.addHandler(() => {
                let sameItems = (multiSelect.checkedItems.length === (parameter.value || []).length);
                if (sameItems) {
                    for (let i = 0; i < multiSelect.checkedItems.length; i++) {
                        if (multiSelect.checkedItems[i].value !== parameter.value[i]) {
                            sameItems = false;
                        }
                    }
                }
                if (sameItems) {
                    return;
                }

                this._deferValidate(parameter.name, () => {
                    values = [];
                    for (var i = 0; i < multiSelect.checkedItems.length; i++) {
                        values.push(multiSelect.checkedItems[i]['value']);
                    }
                    this._updateParameters(parameter, values);
                }, () => {
                    if (values.length > 0 && !parameter.nullable) {
                        this._validateNullValueOfParameter(element);
                    }
                });
            });
        } else {
            if (!isParameterResolved || !isAllowedValue) {
                combo.selectedValue = null;
            } else {
                combo.selectedValue = parameter.value;
            }

            var updating = false;
            // combo.lostFocus.addHandler((sender) => {
            combo.selectedIndexChanged.addHandler((sender) => {
                if (parameter.value === sender.selectedValue) {
                    return;
                }
                this._deferValidate(parameter.name, () => {
                    if (updating) {
                        return;
                    }

                    this._updateParameters(parameter, sender.selectedValue);
                    if (sender.selectedValue && sender.itemsSource[0]['name'] === wijmo.culture.Viewer.selectParameterValue) {
                        setTimeout(() => {
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
                }, () => this._validateNullValueOfParameter(element));
            });
        }

        return element;
    }

    private _updateParameters(parameter: _IParameter, value: any): void {
        var spliteNewLine = (value: any, multiValues: boolean): any => {
            if (multiValues && wijmo.isString(value)) {
                return value.split(/[\r\n]+/);
            } else {
                return value;
            }
        }, item: _IParameter;
        this.itemsSource.some(v => {
            if (v.name === parameter.name) {
                item = v;
                return true;
            }
            return false;
        });
        this._parameters[parameter.name] = item.value = parameter.value = spliteNewLine(value, parameter.multiValue);
    }

    private _generateBoolEditor(parameter: _IParameter): HTMLElement {
        var checkEditor: any, itemsSource: Object[] = [], element: any;
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
            checkEditor.lostFocus.addHandler(sender => {
                if (parameter.value === sender.selectedValue) {
                    return;
                }
                this._deferValidate(parameter.name, () => this._updateParameters(parameter, sender.selectedValue));
            });
        } else {
            element = document.createElement('input');
            element.type = 'checkbox';
            element.checked = parameter.value;
            _addEvent(element, 'click', () => {
                this._deferValidate(parameter.name, () => this._updateParameters(parameter, element.checked));
            });
        }
        return element;
    }

    private _generateStringEditor(parameter: _IParameter): HTMLElement {
        var self = this,
            element: any;

        if (parameter.multiValue) {
            element = self._createTextarea(parameter.value, parameter.dataType);
            if (parameter.maxLength > 0) {
                (<HTMLTextAreaElement>element).maxLength = parameter.maxLength;
            }
        } else {
            element = document.createElement('input');
            element.type = 'text';
            if (parameter.value) {
                element.value = parameter.value;
            }
            if (parameter.maxLength > 0) {
                (<HTMLInputElement>element).maxLength = parameter.maxLength;
            }
        }

        self._bindTextChangedEvent(element, parameter, 'focusout');
        return element;
    }

    private _createTextarea(value: any[], dataType: _ParameterType): HTMLTextAreaElement {
        var textarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.createElement('textarea'), format: string, dates: string[] = [];

        if (dataType === _ParameterType.DateTime || dataType === _ParameterType.Time || dataType === _ParameterType.Date) {
            format = _ParametersEditor._dateTimeFormat;
        }

        if (value && value.length > 0) {
            if (format) {
                for (var i = 0; i < value.length; i++) {
                    dates.push(wijmo.Globalize.formatDate(new Date(value[i]), format));
                }
                textarea.value = dates.join('\n');
            } else {
                textarea.value = value.join('\n');
            }
        }
        textarea.wrap = 'off';
        textarea.setAttribute('data-type', dataType.toString());
        return textarea;
    }

    private _bindTextChangedEvent(element: any, parameter: _IParameter, evType: string = 'change,keyup,paste,input') {
        _addEvent(element, evType, (evnt) => {
            if (evnt.target && evnt.target.disabled) {
                return; // #321642
            }

            let sameValues = false;
            if (wijmo.isArray(parameter.value)) {
                const elementValues = element.value.split('\n');
                let diffStrings = 0;

                for (let i = 0; i < elementValues.length; i++) {
                    if (parameter.value[i] != elementValues[i]) {
                        diffStrings = diffStrings + 1;
                    }
                }

                sameValues = diffStrings === 0;
            }

            if (parameter.value === element.value || sameValues) {
                return;
            }

            this._deferValidate(parameter.name, () => this._updateParameters(parameter, element.value), () => {
                if (element.value && !parameter.nullable) {
                    this._validateNullValueOfParameter(element);
                }
            });
        });
    }

    private _generateNumberEditor(parameter: _IParameter) {
        var element: any, inputNumber: wijmo.input.InputNumber;
        if (parameter.multiValue) {
            element = this._createTextarea(parameter.value, parameter.dataType);
            this._bindTextChangedEvent(element, parameter, 'focusout');
        } else {
            element = document.createElement('div');
            inputNumber = new wijmo.input.InputNumber(element);
            inputNumber.format = parameter.dataType === _ParameterType.Integer ? 'n0' : 'n2';
            inputNumber.isRequired = !parameter.nullable;
            if (parameter.value) {
                inputNumber.value = parameter.dataType === _ParameterType.Integer ? parseInt(parameter.value) : parseFloat(parameter.value);
            }
            inputNumber.lostFocus.addHandler(() => {
                if (parameter.value === inputNumber.value) {
                    return;
                }
                this._deferValidate(parameter.name, () => this._updateParameters(parameter, inputNumber.value));
            });
        }
        return element;
    }

    private _generateDateTimeEditor(parameter: _IParameter) {
        var element: any,
            input: {
                isRequired: boolean;
                value: Date;
                valueChanged: wijmo.Event;
            };

        if (parameter.multiValue) {
            element = this._createTextarea(parameter.value, parameter.dataType);
            element.title = _ParametersEditor._dateTimeFormat;
            this._bindTextChangedEvent(element, parameter, 'focusout');
        } else {
            element = document.createElement('div');

            if (parameter.dataType == _ParameterType.Date) {
                input = new wijmo.input.InputDate(element);
            } else {
                if (parameter.dataType == _ParameterType.DateTime) {
                    input = new wijmo.input.InputDateTime(element);
                    (<wijmo.input.InputDateTime>input).timeStep = 60;
                } else {
                    input = new wijmo.input.InputTime(element);
                    (<wijmo.input.InputTime>input).step = 60;
                }
            }

            // #306344 To avoid the "Date expected" exception if parameter is not nullable and parameter.value is null.
            input.isRequired = false;

            if (parameter.value != null) {
                input.value = new Date(parameter.value);
            } else {
                input.value = null; // #299889 Display blank value instead of current date if parameter.value is null.
            }

            // #306344 Set input.isRequired only after input.value has been set.
            input.isRequired = !parameter.nullable;

            input.valueChanged.addHandler(() => {
                this._deferValidate(parameter.name, () => this._updateParameters(parameter, input.value)); // #353896 Conversion should be done in _DocumentService.setParameters.
                //this._deferValidate(parameter.name, () => this._updateParameters(parameter, input.value && input.value.toJSON()));
            });
        }
        return element;
    }

    private _validateNullValueOfParameter(element: HTMLElement) {
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
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export enum _TouchEventType {
    Start,
    Move,
    End
}

export class _TouchEventArgs extends wijmo.EventArgs {
    private _systemEvent: TouchEvent | PointerEvent;
    private _type: _TouchEventType;
    private _touchInfos: _TouchInfo[];

    constructor(systemEvent: TouchEvent | PointerEvent | _TouchEventArgs) {
        super();

        if (systemEvent instanceof _TouchEventArgs) {
            this._systemEvent = systemEvent.systemEvent;
            this._type = systemEvent.type;
            this._touchInfos = systemEvent.touchInfos;
            return;
        }

        this._systemEvent = systemEvent;
        _TouchManager._registerTouchInfo(systemEvent);
        this._type = _TouchManager._isTouchStart(systemEvent.type) ? _TouchEventType.Start
            : (_TouchManager._isTouchEnd(systemEvent.type) ? _TouchEventType.End : _TouchEventType.Move);
        this._touchInfos = _TouchManager._allTouchInfos ? _TouchManager._allTouchInfos.slice() : [];
    }

    get timeStamp(): number {
        return this.systemEvent.timeStamp;
    }

    get touchInfos(): _TouchInfo[] {
        return this._touchInfos;
    }

    get systemEvent(): TouchEvent | PointerEvent {
        return this._systemEvent;
    }

    get target(): EventTarget {
        return this.systemEvent.target;
    }

    get currentTarget(): EventTarget {
        return this.systemEvent.currentTarget;
    }

    get type(): _TouchEventType {
        return this._type;
    }

    get pointersCount(): number {
        return this.touchInfos.length;
    }

    get cancelBubble(): boolean {
        return this._systemEvent.cancelBubble;
    }
    set cancelBubble(value: boolean) {
        this._systemEvent.cancelBubble = value;
    }

    preventDefault() {
        this._systemEvent.preventDefault();
    }
}

export class _TouchEvent extends wijmo.Event {
    raise(sender, args: _TouchEventArgs) {
        super.raise(sender, args);
    }
}

export class _TouchTrigger {

    private _element: HTMLElement;
    private _disposeAction: () => void;
    private static _elementDataName = '__wjTouchTrigger';

    private static bindElement(element: HTMLElement, trigger: _TouchTrigger) {
        if (element[_TouchTrigger._elementDataName]) {
            throw 'Cannot bind multi _TouchTrigger on the same element.';
        }

        element[_TouchTrigger._elementDataName] = trigger;
    }

    private static unbindElement(element: HTMLElement) {
        element[_TouchTrigger._elementDataName] = null;
    }

    static getTrigger(element: HTMLElement): _TouchTrigger {
        return element[_TouchTrigger._elementDataName];
    }

    constructor(source: any) {
        var element = wijmo.getElement(source);
        this._element = element;
        var trigger = _TouchTrigger.getTrigger(element) as _TouchTrigger;
        if (trigger) {
            var touchHandler = this._onTouchEvent.bind(this);
            trigger.touchMove.addHandler(touchHandler);
            trigger.touchStart.addHandler(touchHandler);
            trigger.touchEnd.addHandler(touchHandler);
            this._disposeAction = () => {
                trigger.touchMove.removeHandler(touchHandler);
                trigger.touchStart.removeHandler(touchHandler);
                trigger.touchEnd.removeHandler(touchHandler);
                this._disposeAction = null;
            };
            return;
        }

        var touchEventsMap = _getTouchEventMap(),
            sysTouchHandler = this._onSystemTouchEvent.bind(this);
        _addEvent(element, touchEventsMap.startName, sysTouchHandler);
        _addEvent(element, touchEventsMap.moveName, sysTouchHandler);
        _addEvent(element, touchEventsMap.endName, sysTouchHandler);
        _TouchTrigger.bindElement(element, this);
        this._disposeAction = () => {
            _removeEvent(element, touchEventsMap.startName, sysTouchHandler);
            _removeEvent(element, touchEventsMap.moveName, sysTouchHandler);
            _removeEvent(element, touchEventsMap.endName, sysTouchHandler);
            _TouchTrigger.unbindElement(element);
            this._disposeAction = null;
        }
    }

    _onSystemTouchEvent(event) {
        var touchEventArgs = this._createTouchEventArgs(event);
        if (touchEventArgs) {
            this._onTouchEvent(this, touchEventArgs);
        }
    }

    _createTouchEventArgs(e): _TouchEventArgs {
        return _TouchManager._isTouchEvent(e) ? new _TouchEventArgs(e) : null;
    }

    dispose() {
        if (this._disposeAction) this._disposeAction();
    }

    get hostElement(): HTMLElement {
        return this._element;
    }

    _onTouchEvent(sender, e: _TouchEventArgs) {
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
    }

    touchMove = new _TouchEvent();

    touchStart = new _TouchEvent();

    touchEnd = new _TouchEvent();

    onTouchEnd(event: _TouchEventArgs) {
        this.touchEnd.raise(this, event);
    }

    onTouchStart(event: _TouchEventArgs) {
        this.touchStart.raise(this, event);
    }

    onTouchMove(event: _TouchEventArgs) {
        this.touchMove.raise(this, event);
    }
}
    }
    


    module wijmo.viewer {
    




'use strict';

export class _PinchEventArgs extends _TouchEventArgs {

    private _pinchType: _TouchEventType;
    private _pinchDistance: number;
    private _centerClient: wijmo.Point;
    private _centerClientDelta: wijmo.Point;
    private _centerScreen: wijmo.Point;
    private _centerScreenDelta: wijmo.Point;
    private _pre: _PinchEventArgs;
    private _zoom = 1;

    constructor(touchEventArgs: _TouchEventArgs, pinchType: _TouchEventType, pre?: _PinchEventArgs) {
        super(touchEventArgs);

        this._pinchType = pinchType;
        this._pre = pre || <_PinchEventArgs>{};

        if (this.type == _TouchEventType.End) return;

        this._pinchDistance = _TouchInfo.getDistance(this.touchInfos[0], this.touchInfos[1]);
        this._centerClient = _TouchInfo.getCenterClient(this.touchInfos[0], this.touchInfos[1]);
        this._centerScreen = _TouchInfo.getCenterScreen(this.touchInfos[0], this.touchInfos[1]);

        if (this.type == _TouchEventType.Start) return;

        this._zoom = this.pinchDistance / this.prePinchDistance;
        this._centerClientDelta = new wijmo.Point((this.centerClient.x - this.preCenterClient.x),
            (this.centerClient.y - this.preCenterClient.y));
        this._centerScreenDelta = new wijmo.Point((this.centerScreen.x - this.preCenterScreen.x),
            (this.centerScreen.y - this.preCenterScreen.y));
    }

    get zoom(): number {
        return this._zoom;
    }

    get pointersCount(): number {
        return this.type == _TouchEventType.End ? 0 : 2;
    }

    get prePinchDistance(): number {
        return this._pre.pinchDistance;
    }

    get pinchDistance(): number {
        return this._pinchDistance;
    }

    get centerScreenDelta(): wijmo.Point {
        return this._centerScreenDelta;
    }

    get centerClientDelta(): wijmo.Point {
        return this._centerClientDelta;
    }

    get centerClient(): wijmo.Point {
        return this._centerClient;
    }

    get preCenterClient(): wijmo.Point {
        return this._pre.centerClient;
    }

    get centerScreen(): wijmo.Point {
        return this._centerScreen;
    }

    get preCenterScreen(): wijmo.Point {
        return this._pre.centerScreen;
    }

    get type(): _TouchEventType {
        return this._pinchType;
    }
}

export class _PinchEvent extends _TouchEvent {
    raise(sender, args: _PinchEventArgs) {
        super.raise(sender, args);
    }
}

export class _PinchTrigger extends _TouchTrigger {
    private _preEventArgs: _PinchEventArgs;

    pinch = new _PinchEvent();

    onPinch(args: _PinchEventArgs) {
        this.pinch.raise(this, args);
    }

    onTouchStart(args: _TouchEventArgs) {
        this._process(args);
    }

    onTouchend(args: _TouchEventArgs) {
        this._process(args);
    }

    onTouchMove(args: _TouchEventArgs) {
        this._process(args);
    }

    private _onPinching(args: _TouchEventArgs) {
        var pinchArgs = new _PinchEventArgs(args, this._preEventArgs ? _TouchEventType.Move : _TouchEventType.Start, this._preEventArgs);
        this.onPinch(pinchArgs);
        this._preEventArgs = pinchArgs;
    }

    private _onPinchEnd(args: _TouchEventArgs) {
        if (this._preEventArgs) {
            var endArgs = new _PinchEventArgs(args, _TouchEventType.End, this._preEventArgs);
            this.onPinch(endArgs);
            this._preEventArgs = null;
        }
    }

    private _process(args: _TouchEventArgs) {
        if (args.pointersCount != 2) {
            this._onPinchEnd(args);
            return;
        }

        switch (args.type) {
            case _TouchEventType.Start:
            case _TouchEventType.Move:
                this._onPinching(args);
                return;
            case _TouchEventType.End:
                this._onPinchEnd(args);
                return;
        }
    }
}
    }
    


    module wijmo.viewer {
    





'use strict';

export class _PanEventArgs extends _TouchEventArgs {
    private _panType: _TouchEventType;
    private _client: wijmo.Point;
    private _screen: wijmo.Point;
    private _clientDelta: wijmo.Point;
    private _screenDelta: wijmo.Point;

    constructor(args: _TouchEventArgs, pre?: _PanEventArgs, type?: _TouchEventType) {
        super(args);
        this._panType = type == null ? args.type : type;
        this._client = new wijmo.Point(this.touchInfo.clientX, this.touchInfo.clientY);
        this._screen = new wijmo.Point(this.touchInfo.screenX, this.touchInfo.screenY);
        if (pre) {
            this._clientDelta = new wijmo.Point(this.client.x - pre.client.x, this.client.y - pre.client.y);
            this._screenDelta = new wijmo.Point(this.screen.x - pre.screen.x, this.screen.y - pre.screen.y);
        }
    }

    get type() {
        return this._panType;
    }

    get clientDelta(): wijmo.Point {
        return this._clientDelta;
    }

    get screenDelta(): wijmo.Point {
        return this._screenDelta;
    }

    get client(): wijmo.Point {
        return this._client;
    }

    get screen(): wijmo.Point {
        return this._screen;
    }

    get pointersCount(): number {
        return this.type == _TouchEventType.End ? 0 : 1;
    }

    get touchInfo(): _TouchInfo {
        return this.touchInfos[0] || <_TouchInfo>{};
    }
}

export class _PanEvent extends _TouchEvent {
    raise(sender: any, args: _PanEventArgs) {
        super.raise(sender, args);
    }
}

export class _PanTrigger extends _TouchTrigger {

    private _panEvents: _ActionQueue;
    private _panStartTimer: any;
    private static _threhold = 10;
    private _prePanEventArgs: _PanEventArgs;

    panMove = new _PanEvent();

    panStart = new _PanEvent();

    panEnd = new _PanEvent();

    onPanEnd(args: _PanEventArgs) {
        this.panEnd.raise(this, args);
    }

    onPanStart(args: _PanEventArgs) {
        this.panStart.raise(this, args);
    }

    onPanMove(args: _PanEventArgs) {
        this.panMove.raise(this, args);
    }

    private _prepareMove(args: _PanEventArgs) {
        this._prePanEventArgs = args;
        this._panEvents.queue(() => {
            this.onPanMove(args);
        });
    }

    private _prepareStart(args: _PanEventArgs) {
        this._prePanEventArgs = args;
        this._panEvents.queue(() => {
            this.onPanStart(args);
        });

        this._clearPanStartTimer();
        this._panStartTimer = setTimeout(() => {
            if (this._panEvents) this._panEvents.start();
            this._clearPanStartTimer();
        }, _PanTrigger._threhold);
    }

    private _prepareEnd(args: _TouchEventArgs | _PanEventArgs) {
        this._prePanEventArgs = null;
        this._panEvents.queue(() => {
            var endArgs = args instanceof _PanEventArgs ? args : new _PanEventArgs(args, null, _TouchEventType.End);
            this.onPanEnd(endArgs);
            this._stopPan();
        });
    }

    private _clearPanStartTimer() {
        if (this._panStartTimer != null) {
            clearTimeout(this._panStartTimer);
            this._panStartTimer = null;
        }
    }

    private _tryStopPan(args: _TouchEventArgs) {
        if (!this._panEvents || !this._panEvents.isStarted) {
            this._stopPan();
            return;
        }

        this._prepareEnd(args);
    }

    private _stopPan() {
        this._clearPanStartTimer();
        this._panEvents = null;
        this._prePanEventArgs = null;
    }

    private _processPan(args: _TouchEventArgs) {
        var panEventArgs = this._createPanEventArgs(args);
        if (!panEventArgs) {
            this._tryStopPan(args);
            return;
        }

        switch (panEventArgs.type) {
            case _TouchEventType.Start:
                this._prepareStart(panEventArgs);
                return;
            case _TouchEventType.Move:
                this._prepareMove(panEventArgs);
                return;
            case _TouchEventType.End:
                this._prepareEnd(panEventArgs);
                return;
        }
    }

    onTouchStart(args: _TouchEventArgs) {
        super.onTouchStart(args);
        this._processPan(args);
    }

    onTouchMove(args: _TouchEventArgs) {
        super.onTouchMove(args);
        this._processPan(args);
    }

    onTouchEnd(args: _TouchEventArgs) {
        super.onTouchEnd(args);
        var panEventArgs = this._createPanEventArgs(args);
        if (panEventArgs) {
            this._prepareEnd(panEventArgs);
            return;
        }

        this._tryStopPan(args);
    }

    private _createPanEventArgs(args: _TouchEventArgs): _PanEventArgs {
        if ((args.type == _TouchEventType.End && args.pointersCount != 0)
            || (args.type != _TouchEventType.End && args.pointersCount != 1)) {
            return null
        }

        var panEventArgs = new _PanEventArgs(args, this._prePanEventArgs);
        if (panEventArgs.type != _TouchEventType.Start) {
            if (!this._panEvents) return null;
        } else {
            this._panEvents = new _ActionQueue();
        }

        return panEventArgs;
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _SwipeEventArgs extends _PanEventArgs {
    private _duration: number;
    private _startTouchInfo: _TouchInfo
    private _endTouchInfo: _TouchInfo
    private _speed: wijmo.Point;
    private _direction: _TouchDirection;

    constructor(startInfo: _TouchInfo, endInfo: _TouchInfo, panEventArgs: _PanEventArgs, duration: number) {
        super(panEventArgs);
        this._duration = duration;
        this._startTouchInfo = startInfo;
        this._endTouchInfo = endInfo;
        var distance = _pointMove(false, new wijmo.Point(this.endTouchInfo.clientX, this.endTouchInfo.clientY), new wijmo.Point(this.startTouchInfo.clientX, this.startTouchInfo.clientY));
        this._speed = new wijmo.Point(_SwipeTrigger.getSpeed(distance.x, this.duration), _SwipeTrigger.getSpeed(distance.y, this.duration));
        this._direction = _TouchInfo._getDirection(this.startTouchInfo, this.endTouchInfo);
    }

    get duration(): number {
        return this._duration;
    }

    get startTouchInfo(): _TouchInfo {
        return this._startTouchInfo;
    }

    get endTouchInfo(): _TouchInfo {
        return this._endTouchInfo;
    }

    get speed(): wijmo.Point {
        return this._speed;
    }

    get pointersCount(): number {
        return 1;
    }

    get direction(): _TouchDirection {
        return this._direction;
    }
}

export class _SwipeEvent extends _PanEvent {
    raise(sender, args: _SwipeEventArgs) {
        super.raise(sender, args);
    }
}

export class _SwipeTrigger extends _PanTrigger {
    static minDistance = 50;
    static maxDuration = 300;

    private _panStartEventArgs: _PanEventArgs;
    private _prePanMoveEventArgs: _PanEventArgs;

    swipe = new _SwipeEvent();

    static getSpeed(distance: number, duration: number) {
        return distance / duration;
    }

    onPanStart(args: _PanEventArgs) {
        super.onPanStart(args);
        this._panStartEventArgs = args;
    }

    onPanMove(args: _PanEventArgs) {
        super.onPanMove(args);
        this._prePanMoveEventArgs = args;
    }

    onPanEnd(args: _PanEventArgs) {
        super.onPanEnd(args);
        var swipeEventArgs = this._createSwipeEventArgs(args);
        if (swipeEventArgs) {
            this.onSwipe(swipeEventArgs);
        }
        this._panStartEventArgs = null;
        this._prePanMoveEventArgs = null;
    }

    onSwipe(args: _SwipeEventArgs) {
        this.swipe.raise(this, args);
    }

    _createSwipeEventArgs(endArgs: _PanEventArgs): _SwipeEventArgs {
        // Pan event doesn't fire when multi touches. So these fields may be null.
        if (!this._panStartEventArgs || !this._prePanMoveEventArgs) {
            return null;
        }
        var duration = endArgs.timeStamp - this._panStartEventArgs.timeStamp;
        if (duration > _SwipeTrigger.maxDuration) {
            return null;
        }

        var distance = _TouchInfo.getDistance(this._panStartEventArgs.touchInfo, this._prePanMoveEventArgs.touchInfo);
        if (distance < _SwipeTrigger.minDistance) {
            return null;
        }

        return new _SwipeEventArgs(this._panStartEventArgs.touchInfo, this._prePanMoveEventArgs.touchInfo, endArgs, duration);
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _TouchManager {

    private static _touchPointerName = 'touch';

    static _allTouchInfos: _TouchInfo[] = [];

    static _isTouchEvent(event: PointerEvent | TouchEvent) {
        return event instanceof TouchEvent ||
            ((event as PointerEvent).pointerType as string || '').toLowerCase() === _TouchManager._touchPointerName;
    }

    static _isTouchStart(type: string): boolean {
        return _TouchManager._eventTypeContains(type, _getTouchEventMap().startName);
    }

    static _isTouchEnd(type: string): boolean {
        return _TouchManager._eventTypeContains(type, _getTouchEventMap().endName);
    }

    static _isTouchMove(type: string): boolean {
        return _TouchManager._eventTypeContains(type, _getTouchEventMap().moveName);
    }

    static _eventTypeContains(current: string, definitions: string): boolean {
        var defEvents = definitions.split(',');
        current = current.toLowerCase();
        for (var i = 0, length = defEvents.length; i < length; i++) {
            var event = defEvents[i].trim().toLowerCase();
            if (current.indexOf(event) > -1) return true;
        }

        return false;
    }

    static _registerTouchInfo(systemEvent: TouchEvent | PointerEvent) {
        if (!_TouchManager._isTouchEvent(systemEvent)) return;

        if (systemEvent instanceof TouchEvent) {
            _TouchManager._allTouchInfos = [];
            for (var i = 0, length = systemEvent.touches.length; i < length; i++) {
                _TouchManager._allTouchInfos.push(new _TouchInfo(systemEvent.touches.item(i)));
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
                    _TouchManager._allTouchInfos[index] = new _TouchInfo(systemEvent);
                    return;
                }
            }

            _TouchManager._allTouchInfos.push(new _TouchInfo(systemEvent));
        }
    }

    private _trigger: _SwipeTrigger;
    private _pinchTrigger: _PinchTrigger;
    private _removeDefaultTouch: boolean;
    private _defaultTouchAction: string;
    private _defaultMsTouchAction: string;
    constructor(element: any, removeDefaultTouch = true) {
        this._trigger = new _SwipeTrigger(element);
        this._trigger.touchStart.addHandler((s, e) => this.onTouchStart(e as _TouchEventArgs));
        this._trigger.touchMove.addHandler((s, e) => this.onTouchMove(e as _TouchEventArgs));
        this._trigger.touchEnd.addHandler((s, e) => this.onTouchEnd(e as _TouchEventArgs));
        this._trigger.panStart.addHandler((s, e) => this.onPanStart(e as _PanEventArgs));
        this._trigger.panMove.addHandler((s, e) => this.onPanMove(e as _PanEventArgs));
        this._trigger.panEnd.addHandler((s, e) => this.onPanEnd(e as _PanEventArgs));
        this._trigger.swipe.addHandler((s, e) => this.onSwipe(e as _SwipeEventArgs));

        this._pinchTrigger = new _PinchTrigger(element);
        this._pinchTrigger.pinch.addHandler((s, e) => this.onPinch(e as _PinchEventArgs));
        this.removeDefaultTouch = removeDefaultTouch;
    }

    touchMove = new _TouchEvent();

    touchStart = new _TouchEvent();

    touchEnd = new _TouchEvent();

    panMove = new _PanEvent();

    panStart = new _PanEvent();

    panEnd = new _PanEvent();

    swipe = new _SwipeEvent();

    pinch = new _PinchEvent();

    onPinch(event: _PinchEventArgs) {
        this.pinch.raise(this, event);
    }

    onSwipe(event: _SwipeEventArgs) {
        this.swipe.raise(this, event);
    }

    onTouchEnd(event: _TouchEventArgs) {
        this.touchEnd.raise(this, event);
    }

    onTouchStart(event: _TouchEventArgs) {
        this.touchStart.raise(this, event);
    }

    onTouchMove(event: _TouchEventArgs) {
        this.touchMove.raise(this, event);
    }

    onPanEnd(args: _PanEventArgs) {
        this.panEnd.raise(this, args);
    }

    onPanStart(args: _PanEventArgs) {
        this.panStart.raise(this, args);
    }

    onPanMove(args: _PanEventArgs) {
        this.panMove.raise(this, args);
    }

    get removeDefaultTouch(): boolean {
        return this._removeDefaultTouch;
    }
    set removeDefaultTouch(value: boolean) {
        this._removeDefaultTouch = value;
        var style = this.hostElement.style;
        if (value) {
            style.touchAction = 'none';
            (style as any).msTouchAction = 'none';
        } else {
            style.touchAction = this._defaultTouchAction;
            (style as any).msTouchAction = this._defaultMsTouchAction;
        }
    }

    get hostElement(): HTMLElement {
        return this._pinchTrigger.hostElement;
    }

    get contentElement(): Element {
        return this.hostElement.children.length ? this.hostElement.children[0] : null;
    }

    dispose() {
        if (this._pinchTrigger) {
            this._pinchTrigger.dispose();
        }

        if (this._trigger) {
            this._trigger.dispose();
        }

        if (this.removeDefaultTouch) {
            this.removeDefaultTouch = false;
        }
    }
}

    }
    


    module wijmo.viewer {
    






    }
    


    module wijmo.viewer {
    




'use strict';

// the virtual vertical scroller
export class _VScroller extends _Scroller {
    private _wrapper: HTMLElement;
    private _height: number = 100;
    private _max: number = 100;
    // preserve the desired scroll top after setting scrollTop.
    private _desiredValue: number = 0;

    static controlTemplate = '<div class="wj-vscroller-wrapper" wj-part="wrapper"></div>';

    constructor(element: any) {
        super(element);

        var tpl: string;
        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate(null, tpl, {
            _wrapper: 'wrapper'
        });

        // at least 1px client width, otherwise it works incorrectly in IE.
        this.hostElement.style.width = _Scroller.getScrollbarWidth() + 1 + 'px';

        _addEvent(this.hostElement, "scroll", () => {
            this.onValueChanged();
        });
    }

    readonly valueChanged = new wijmo.Event<_VScroller, wijmo.EventArgs>();

    public onValueChanged() {
        
        // bypass the scroll event if the it is caused by setting scrollTop
        if (this._desiredValue == this.value) {
            return;
        }

        this.valueChanged.raise(this);
    }

    // prevent the scroll event.
    preventScrollEvent() {
        this._desiredValue = this.hostElement.scrollTop;
    }

    // the height of the scroller, in px.
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        if (value === this._height) {
            return;
        }

        this._height = value;
        this.invalidate();
    }

    // the scroll position of the scroller
    get value(): number {
        return this.hostElement.scrollTop;
    }
    set value(value: number) {
        this.hostElement.scrollTop = value;
        this.preventScrollEvent();
    }

    // the max scroll position of the scroller.
    get max(): number {
        return this._max;
    }
    set max(value: number) {
        if (this._max === value) {
            return;
        }

        this._max = value;
        this.invalidate();
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);

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
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _ExportOptionEditor extends wijmo.Control {
    private _exportDescription: _IExportDescription;
    private _options: Object = {};
    private _previousEmbedFonts: boolean;
    private _previousShowNavigator: boolean;

    private static _optionIdAttr = 'option-id';
    private static _optionNameAttr = 'option-name';
    private static _skippedOptions = ['shapesWord2007Compatible', 'sheetName', 'navigatorPositions'];
    private static _generalGroupName = 'general';

    private _optionLabels = null;

    private _groupTitleField = null;

    constructor(element: any) {
        super(element);

        wijmo.addClass(element, 'wj-export-editor');
    }

    get options(): Object {
        return this._options;
    }

    get exportDescription(): _IExportDescription {
        return this._exportDescription;
    }
    set exportDescription(value: _IExportDescription) {
        this._exportDescription = value;
        this._options = {};
        if (!value) {
            return;
        }
        this._options['format'] = this.exportDescription.format;
        this._render();
    }

    private _skipOption(name: string): boolean {
        return _ExportOptionEditor._skippedOptions.indexOf(name) >= 0;
    }

    private _render() {
        _removeChildren(this.hostElement);
        if (!this.exportDescription) {
            return;
        }

        var table: HTMLTableElement = document.createElement('table'), optionDescs = this.exportDescription.optionDescriptions,
            groupOptions: Object = {};

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
    }

    private _generateEditor(desc: _IExportOptionDescription): HTMLElement {
        var editor: HTMLElement;
        if (wijmo.isArray(desc.allowedValues)) {
            editor = this._generateComboEditor(desc);
        } else {
            switch (desc.type) {
                case 'bool':
                    editor = this._generateBoolEditor(desc);
                    break;
                case 'int':
                case 'float':
                    editor = this._generateNumberEditor(desc);
                    break;
                case 'unit':
                    desc.defaultValue = new _Unit(desc.defaultValue);
                case 'string':
                default:
                    editor = this._generateStringEditor(desc);
                    break;
            }
        }

        editor.setAttribute(_ExportOptionEditor._optionIdAttr, desc.name);
        return editor;
    }

    private _generateComboEditor(desc: _IExportOptionDescription): HTMLElement {
        var combo, itemsSource: Object[] = [], element = document.createElement('div');

        for (var i = 0; i < desc.allowedValues.length; i++) {
            itemsSource.push(desc.allowedValues[i]);
        }

        combo = new wijmo.input.ComboBox(element);
        combo.isEditable = false;
        combo.itemsSource = itemsSource;
        combo.selectedValue = desc.defaultValue;

        combo.selectedIndexChanged.addHandler((sender) => {
            this._setOptionValue(desc.name, sender.selectedValue.toString());
        });

        return element;
    }

    private _generateBoolEditor(desc: _IExportOptionDescription): HTMLElement {
        var element: any;
        if (desc.nullable) {
            element = document.createElement('div');
            var checkEditor = new wijmo.input.ComboBox(element), itemsSource: Object[] = [];
            checkEditor.isEditable = false;
            checkEditor.displayMemberPath = 'name';
            checkEditor.selectedValuePath = 'value';
            itemsSource.push({ name: 'None', value: null });
            itemsSource.push({ name: 'True', value: true });
            itemsSource.push({ name: 'False', value: false });
            checkEditor.itemsSource = itemsSource;
            checkEditor.selectedValue = desc.defaultValue;
            const selectedHandler = sender => {
                this._setOptionValue(desc.name, sender.selectedValue);
                this._updateEditors(desc.name);
            };
            checkEditor.selectedIndexChanged.addHandler(selectedHandler);
            setTimeout(() => selectedHandler(checkEditor)); // update dependent controls
        } else {
            element = document.createElement('input');
            element.type = 'checkbox';
            var defaultValue = wijmo.changeType(desc.defaultValue, wijmo.DataType.Boolean, null);
            element.checked = defaultValue;
            const clickHandler = () => {
                this._setOptionValue(desc.name, element.checked);
                this._updateEditors(desc.name);
            }
            _addEvent(element, 'click', clickHandler);
            setTimeout(clickHandler); // update dependent controls
        }
        return element;
    }

    private _generateNumberEditor(desc: _IExportOptionDescription): HTMLElement {
        var element: HTMLElement, inputNumber: wijmo.input.InputNumber, isIntType = desc.type === 'int';

        element = document.createElement('div');
        inputNumber = new wijmo.input.InputNumber(element);
        inputNumber.format = isIntType ? 'n0' : 'n2';
        inputNumber.isRequired = !desc.nullable;
        inputNumber.value = desc.defaultValue;

        inputNumber.valueChanged.addHandler((sender) => {
            this._setOptionValue(desc.name, sender.value);
        });

        return element;
    }

    private _generateStringEditor(desc: _IExportOptionDescription): HTMLElement {
        var element: HTMLInputElement;

        element = document.createElement('input');
        if (desc.name.match(/password/i)) {
            element.type = 'password';
        } else {
            element.type = 'text';
        }
        element.value = desc.defaultValue;
        _addEvent(element, 'change,keyup,paste,input', () => {
            this._setOptionValue(desc.name, element.value);
        });

        return element;
    }

    private _generateGroup(optionDescs: _IExportOptionDescription[]): HTMLElement {
        var fieldSet: HTMLFieldSetElement = document.createElement('fieldset'), legend: HTMLLegendElement = document.createElement('legend'),
            groupName = optionDescs[0].group;

        wijmo.addClass(fieldSet, 'wj-exportformats-group');
        legend.innerHTML = this._groupTitle[groupName];
        legend.setAttribute(_ExportOptionEditor._optionNameAttr, groupName);
        fieldSet.appendChild(legend);
        var table: HTMLTableElement = document.createElement('table');
        for (var i = 0; i < optionDescs.length; i++) {
            var optionDesc = optionDescs[i];

            var tr: HTMLTableRowElement = document.createElement('tr'),
                tdTitle: HTMLTableDataCellElement = document.createElement('td'),
                tdEditor: HTMLTableDataCellElement = document.createElement('td');

            tdTitle.innerHTML = this._getOptionLabel(optionDesc.name);
            tdTitle.setAttribute(_ExportOptionEditor._optionNameAttr, optionDesc.name);
            tdEditor.appendChild(this._generateEditor(optionDesc));

            tr.appendChild(tdTitle);
            tr.appendChild(tdEditor);

            table.appendChild(tr);
        }
        fieldSet.appendChild(table);

        return fieldSet;
    }

    private _updateEditors(optionName?: string) {
        if (optionName === 'pdfACompatible' || !optionName) {
            var embedFonts = <HTMLInputElement>this.hostElement.querySelector('[' + _ExportOptionEditor._optionIdAttr + '="embedFonts"]');
            if (embedFonts) {
                var pdfACompatibleValue = wijmo.changeType(this._getOptionValue('pdfACompatible'), wijmo.DataType.Boolean, null);
                if (pdfACompatibleValue) {
                    this._previousEmbedFonts = embedFonts.checked;
                    embedFonts.checked = true;
                    this._setOptionValue('embedFonts', true);
                } else {
                    embedFonts.checked = this._previousEmbedFonts;
                    this._setOptionValue('embedFonts', this._previousEmbedFonts);
                }
                embedFonts.disabled = pdfACompatibleValue;
            }
            return;
        }

        if (optionName === 'paged' || !optionName) {
            var showNavigator = <HTMLInputElement>this.hostElement.querySelector('[' + _ExportOptionEditor._optionIdAttr + '="showNavigator"]');
            if (showNavigator) {
                var paged = wijmo.changeType(this._getOptionValue('paged'), wijmo.DataType.Boolean, null);
                if (!paged) {
                    this._previousShowNavigator = showNavigator.checked;
                    showNavigator.checked = false;
                    this._setOptionValue('showNavigator', false);
                } else {
                    showNavigator.checked = this._previousShowNavigator;
                    this._setOptionValue('showNavigator', this._previousShowNavigator);
                }
                showNavigator.disabled = !paged;
            }
        }
    }

    private _getOptionLabel(optionName: string): string {
        var label = this._optionLabelsText[optionName];
        if (label) {
            return label;
        }

        return optionName[0].toUpperCase() + optionName.substring(1);
    }

    private _getOptionDescByName(optionName: string): _IExportOptionDescription {
        var item: _IExportOptionDescription = null;
        this._exportDescription.optionDescriptions.some(v => {
            if (v.name === optionName) {
                item = v;
                return true;
            }
            return false;
        });

        return item;
    }

    private _getOptionValue(optionName: string): string {
        if (this._options[optionName] !== undefined) {
            return this._options[optionName];
        }

        return this._getOptionDescByName(optionName).defaultValue;
    }

    private _setOptionValue(optionName: string, value: any) {
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
    }

    private get _optionLabelsText(): Object {
        if (!this._optionLabels) {
            let ci = wijmo.culture.Viewer;
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
    }

    private get _groupTitle(): Object {
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
    }

    private _globalize() {
        var globalizeElements = this.hostElement.querySelectorAll('[' + _ExportOptionEditor._optionNameAttr + ']');
        for (var i = 0; i < globalizeElements.length; i++) {
            var element = globalizeElements[i];
            if (element instanceof HTMLLegendElement) {
                element.innerHTML = this._groupTitle[element.getAttribute(_ExportOptionEditor._optionNameAttr)];
                continue;
            }
            element.innerHTML = this._getOptionLabel(element.getAttribute(_ExportOptionEditor._optionNameAttr));
        }
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._optionLabels = null;
            this._groupTitleField = null;
            this._globalize();
        }
    }
}
    }
    


    module wijmo.viewer {
    



'use strict';

/**
 * Saves the Blob object as a file.
 * @param blob The Blob object to save.
 * @param fileName The name with which the file is saved.
*/
export function _saveBlob(blob: Blob, fileName: string): void {
    if (!blob || !(blob instanceof Blob) || !fileName) {
        return;
    }

    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = <HTMLAnchorElement>document.createElement('a'),
            click = function (element) {
                var evnt = <MouseEvent>document.createEvent('MouseEvents');
                evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(evnt);
            };

        if ("download" in link) {
            var url = window.URL || (<any>window).webkitURL || window,
                objUrl = url.createObjectURL(blob);

            link.href = objUrl;
            link.target = "_blank"; // #315860 
            link.download = fileName;
            click(link);
            link = null;

            window.setTimeout(() => { // FF requires a timeout
                url.revokeObjectURL(objUrl);
            }, 30000);
        } else {
            var fr = new FileReader();

            // Save a blob using data URI scheme
            fr.onloadend = (e) => {
                link.download = fileName;
                link.href = <any>fr.result;
                click(link);
                link = null;
            };

            fr.readAsDataURL(blob);
        }
    }
}


// define the reviver for JSON.parse to transform results.
export function _statusJsonReviver(k: string, v) {
    if (wijmo.isString(v)) {
        if (_strEndsWith(k, 'DateTime')) {
            return new Date(v);
        }

        if (k === 'width' || k === 'height' || _strEndsWith(k, 'Margin')) {
            return new _Unit(v);
        }
    }

    return v;
}

export function _pageSettingsJsonReviver(k: string, v) {
    if (wijmo.isString(v)) {
        if (k === 'width' || k === 'height' || _strEndsWith(k, 'Margin')) {
            return new _Unit(v);
        }
    }

    return v;
}

export function _appendQueryString(url: string, queries: Object): string {
    queries = queries || {};
    var queryList: string[] = [];
    for (var k in queries) {
        queryList.push(k + '=' + queries[k]);
    }
    if (queryList.length) {
        var sep = url.indexOf('?') < 0 ? '?' : '&';
        url += sep + queryList.join('&');
    }

    return url;
}

export function _joinUrl(...data: (string | string[])[]): string {
    var urlParts: string[] = [];
    for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i];
        if (item) {
            if (typeof item !== 'string') {
                urlParts = urlParts.concat(_joinStringUrl(item));
            } else {
                urlParts.push(_prepareStringUrl(item).join('/'));
            }
        }
    }
    return urlParts.join('/');
}

export function _joinStringUrl(data: string[]): string[] {
    if (data == null) {
        return null;
    }

    var urlParts: string[] = [];
    for (var i = 0, l = data.length; i < l; i++) {
        urlParts = urlParts.concat(_prepareStringUrl(data[i]));
    }
    return urlParts;
}

export function _prepareStringUrl(data: string): string[] {
    var paramParts = data.split('/');
    if (paramParts.length > 0 && !paramParts[paramParts.length - 1].length) {
        paramParts.splice(paramParts.length - 1);
    }
    return paramParts;
}
    }
    


    module wijmo.viewer {
    


'use strict';

export function _parseReportExecutionInfo(json: string): _IReportExecutionInfo {
    return JSON.parse(json, _statusJsonReviver);
}
    }
    


    module wijmo.viewer {
    




'use strict';

export interface _IHttpRequest {
    method?: string; // default is GET
    urlEncode?: boolean; // default is undefined/ true.
    data?: any;
    async?: boolean; // default id true
    cache?: boolean; // default is false
    success?: (xhr: XMLHttpRequest) => void;
    user?: string;
    password?: string;
    requestHeaders?: any;
    beforeSend?: (xhr: XMLHttpRequest) => void;
    error?: (xhr: XMLHttpRequest) => void;
    responseType?: string;
}

/**
* Represents a routine for processing HTTP requests.
*/
export interface IHttpRequestHandler {
    /**
    * Occurs before the request is sent to the server.
    * @param args Describes the current request.
    */
    beforeSend(args: RequestEventArgs): void;

    /**
    * Gets or sets an object containing request headers to be used when sending or requesting data.
    */
    requestHeaders: any;
}

export function _httpRequest(url: string, handler: IHttpRequestHandler, settings?: _IHttpRequest): XMLHttpRequest {
    if (!settings || !settings.cache) {
        url = _disableCache(url);
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
                } else if (!settings.requestHeaders['Content-Type']) {
                    settings.requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            }
        }
    }

    if (handler && handler.requestHeaders) {
        settings = settings || {};
        settings.requestHeaders = settings.requestHeaders || {};

        Object.keys(handler.requestHeaders).forEach(v => {
            settings.requestHeaders[v] = handler.requestHeaders[v];
        });
    }

    var args = new RequestEventArgs(url, settings);

    if (handler && handler.beforeSend) {
        handler.beforeSend(args);
    }

    return wijmo.httpRequest(args.url, args.settings);
}


function _objToParams(obj: Object): string {
    var paramList: string[] = [];
    obj = obj || {};
    for (var key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            if (wijmo.isArray(obj[key])) {
                if (obj[key].length > 0) {
                    for (var i = 0; i < obj[key].length; i++) {
                        paramList.push(key + '=' + encodeURIComponent(obj[key][i]));
                    }
                } else {
                    paramList.push(key + '=');
                }
            } else {
                paramList.push(key + '=' + encodeURIComponent(obj[key]));
            }
        }
    }

    return paramList.join('&');
}
    }
    


    module wijmo.viewer {
    

    }
    


    module wijmo.viewer {
    





export interface _IDocAction {
    kind: _ActionKind;
    data?: string;
}

export interface _IHistory {
    zoomMode?: ZoomMode;
    zoomFactor?: number;
    position?: _IDocumentPosition;
    viewMode?: ViewMode;
    pageAngles?: _RotateAngle[];
}

export interface _IViewerActionChangedEventArgs {
    action: _IViewerAction;
}

export interface _IViewerAction {
    actionType: _ViewerActionType;
    disabled: boolean;
    checked: boolean;
    shown: boolean;
}

export interface _IViewModeChangedEventArgs {
    oldValue: ViewMode;
    newValue: ViewMode;
}

    }
    


    module wijmo.viewer {
    



'use strict';

export class _HistoryManager {
    private _items: _IHistory[] = [{}];
    private _position: number = 0;

    readonly statusChanged = new wijmo.Event<_HistoryManager, wijmo.EventArgs>();

    private _onStatusChanged() {
        this.statusChanged.raise(this);
    }

    get current(): _IHistory {
        return this._items[this._position];
    }

    clear(): void {
        this._items = [{}];
        this._position = 0;
        this._onStatusChanged();
    }

    add() {
        this._items.splice(++this._position);
        this._items.push({});
        this._onStatusChanged();
    }

    forward(): _IHistory {
        if (!this.canForward()) {
            return null;
        }

        var item = this._items[++this._position];
        this._onStatusChanged();
        return item;
    }

    backward(): _IHistory {
        if (!this.canBackward()) {
            return null;
        }

        var item = this._items[--this._position];
        this._onStatusChanged();
        return item;
    }

    canForward(): boolean {
        return this._position < this._items.length - 1;
    }

    canBackward(): boolean {
        return this._position > 0;
    }
}
    }
    


    module wijmo.viewer {
    


'use strict';

export enum _ArActionKind {
    Hyperlink = 'hyperlink',
    Bookmark = 'bookmark',
    Drillthrough = 'drillthrough',
    Sort = 'sort',
    Toggle = 'toggle'
};

export interface _IArDocAction extends _IDocAction {
    arKind: _ArActionKind;
}

export interface IArClientParameter {
    Name: string;
    Value: any;
}


export enum _ArParameterType {
    String = 0,
    DateTime = 1,
    Boolean = 2,
    Integer = 3,
    Float = 4
}

export enum _ArParameterState {
    OK = 0,
    ExpectValue = 1,
    HasOutstandingDependencies = 2,
    ValuesValidationFailed = 3,
    DynamicValuesUnavailable = 4
}

export interface _IArParameterValue {
    Label: string;
    Value: any;
}

export interface _IArParameter {
    Name: string;
    ParameterType: _ArParameterType;
    Prompt: string;
    Nullable: boolean;
    MultiLine: boolean;
    MultiValue: boolean;
    AllowEmpty: boolean;
    DateOnly: boolean;
    Value: any;
    Values: _IArParameterValue[];
    AvailableValues: _IArParameterValue[];
    State: _ArParameterState;
    ExtendedErrorInfo: string;
    DependantParameters: _IArParameter[]; // Or array of names? Need to check...
}

export interface _IArExecutionInfo extends _IExecutionInfo {
    //parameters: _IArParameter[];
    //autoRun: boolean;
}

export interface _IArExportOptions extends _IRenderOptions {
    printing?: boolean;
}
    }
    


    module wijmo.viewer {
    








'use strict';

export class _DocumentService implements _IDocumentService {
    private _url = '';
    private _documentPath: string;
    private _httpHandler: IHttpRequestHandler;

    constructor(options: _IDocumentService, httpHandler: IHttpRequestHandler) {
        this._url = options.serviceUrl || '';
        this._documentPath = options.filePath;
        this._httpHandler = httpHandler;
    }

    get serviceUrl(): string {
        return this._url;
    }

    get filePath(): string {
        return this._documentPath;
    }

    getStatus(): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with IPageSettings.
    setPageSettings(pageSettings: _IPageSettings): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _IDocumentPosition.
    getBookmark(name: string): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _IDocumentPosition.
    executeCustomAction(action: _IDocAction): IPromise {
        throw _abstractMethodExceptionText;
    }

    load(data?): IPromise {
        throw _abstractMethodExceptionText;
    }

    dispose(): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _IOutlineNode[].
    getOutlines(): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with XMLHttpRequest.
    renderToFilter(options: _IRenderOptions): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _ISearchResultItem[].
    search(searchOptions: _ISearchOptions): IPromise {
        throw _abstractMethodExceptionText;
    }

    getRenderToFilterUrl(options: _IRenderOptions): IPromise {
        throw _abstractMethodExceptionText;
    }

    getExportedUrl(options: _IRenderOptions): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _IExportDescription[].
    getSupportedExportDescriptions(): IPromise {
        throw _abstractMethodExceptionText;
    }

    // Return an IPromise with _IDocumentFeatures.
    getFeatures(): IPromise {
        throw _abstractMethodExceptionText;
    }

    getPingTimeout() {
        return 100;
    }

    // Gets the document's file name without the extension.
    getFileName(): string {
        var fileName = /([^\\/]+)$/.exec(this.filePath)[1],
            dot = fileName.lastIndexOf('.');

        return dot >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName;
    }

    // Downloads the data and converts it to a data url.
    downloadDataUrl(url: string): IPromise {
        var promise = new _Promise();

        this.downloadBlob(url).then(blob => {
            var fr = new FileReader();

            fr.onloadend = (e) => {
                promise.resolve(fr.result);
            };

            fr.readAsDataURL(blob);
        });

        return promise;
    }

    downloadBlob(url: string): IPromise {
        var promise = new _Promise();

        this.httpRequest(url, {
            beforeSend: (xhr) => {
                xhr.responseType = 'blob';
            }
        }).then((xhr: XMLHttpRequest) => {
            promise.resolve(xhr.response);
        });

        return promise;
    }

    httpRequest(url: string, settings?: _IHttpRequest): IPromise {
        settings = settings || {};

        var promise = new _Promise(),
            error = settings.error,
            success = settings.success;

        settings.error = (xhr: XMLHttpRequest) => {
            if (wijmo.isFunction(error)) {
                error.call(this, xhr);
            }

            promise.reject(xhr);
        };

        settings.success = (xhr: XMLHttpRequest) => {
            if (wijmo.isFunction(success)) {
                success.call(this, xhr);
            }

            promise.resolve(xhr);
        }

        _httpRequest(url, this._httpHandler, settings);

        return promise;
    }
}
    }
    


    module wijmo.viewer {
    



'use strict';

export class _ReportServiceBase extends _DocumentService {
    render(): IPromise {
        throw _abstractMethodExceptionText;
    }
}
    }
    


    module wijmo.viewer {
    













'use strict';

export class _ReportService extends _ReportServiceBase implements _IReportService {
    private _reportName: string;
    private _instanceId: string;
    private _status: string;

    private _outlinesLocation: string;
    private _statusLocation: string;
    private _pageSettingsLocation: string;
    private _featuresLocation: string;
    private _parametersLocation: string;

    private static _reportCommand = '$report';
    private static _instancesCommand = '$instances';
    private static _customActionParam = 'actionString';
    private static _renderAction = 'render';
    private static _searchAction = 'search';
    private static _cancelAction = 'stop';
    private static _outlinesAction = 'outlines';
    private static _exportAction = 'export';
    private static _parametersAction = 'parameters';
    private static _bookmarkAction = 'bookmarks';
    private static _pageSettingsAction = 'pagesettings';
    private static _supportedFormatsAction = 'supportedformats';

    private static _invalidReportControllerError = 'Cannot call the service without service url, document path or report name.';
    private static _invalidReportCacheControllerError = 'Cannot call the service when service url is not set or the report is not loaded.';

    // Create a document service with options.
    constructor(options: _IReportService, httpHandler: IHttpRequestHandler) {
        super(options, httpHandler);
        this._reportName = options.reportName;
    }

    get isCleared(): boolean {
        return !this._instanceId && this._status == _ExecutionStatus.cleared;
    }

    // Gets the report names defined in the specified FlexReport definition file.
    // @param serviceUrl The root url of service.
    // @param reportUrl The report url of service.
    // @param httpHandler The HTTP request handler.
    // @return An {@link IPromise} object with a string array of report names.
    static getReportNames(serviceUrl: string, reportFilePath: string, httpHandler?: IHttpRequestHandler): IPromise {
        return _ReportService.getReports(serviceUrl, reportFilePath, null, httpHandler).then((item: ICatalogItem) => {
            if (!item) return null;
            var names = [];
            item.items.forEach((item) => {
                if (item.type === CatalogItemType.Report) {
                    names.push(item.name);
                }
            });
            return names;
        });
    }

    // Gets the catalog items in the specific folder path.
    // @param serviceUrl The root url of service.
    // @param path The folder path.
    // @param data The request data sent to the report service.
    // @param httpHandler The HTTP request handler.
    // @return An {@link IPromise} object with an array of {@link ICatalogItem}.
    static getReports(serviceUrl: string, path: string, data?: any, httpHandler?: IHttpRequestHandler): IPromise {
        var promise = new _Promise(),
            url = _joinUrl(serviceUrl, path);

        _httpRequest(url, httpHandler, {
            data: data,
            success: xhr => {
                promise.resolve(JSON.parse(xhr.responseText));
            },
            error: xhr => promise.reject(xhr)
        });

        return promise;
    }

    // Gets the report name.
    get reportName(): string {
        return this._reportName;
    }

    getBookmark(name: string): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._bookmarkAction, name)).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    executeCustomAction(action: _IDocAction): IPromise {
        var data = {};
        data[_ReportService._customActionParam] = action.data;
        return this.render(data);
    }

    getStatus(): IPromise {
        var promise = new _Promise();

        this.httpRequest(this._statusLocation).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText, _statusJsonReviver));
        });

        return promise;
    }

    getDocumentStatus(): IPromise {
        return this._getReportCache();
    }

    _getReportCache(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl()).then(xhr => {
            promise.resolve(_parseReportExecutionInfo(xhr.responseText));
        });

        return promise;
    }

    getParameters(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._parametersAction)).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    _getUrlMainPart(): string {
        return _joinUrl(this.serviceUrl, this.filePath, this.reportName);
    }

    _getReportUrl(...params: string[]): string {
        return _joinUrl(this._getUrlMainPart(), _ReportService._reportCommand, params);
    }

    _getReportInstancesUrl(...params: string[]): string {
        return _joinUrl(this._getUrlMainPart(), _ReportService._instancesCommand, this._instanceId, params);
    }

    _checkReportController(promise: _Promise): boolean {
        if (this.serviceUrl != null && this.filePath) {
            var isFlexReport = _strEndsWith(this.filePath, '.flxr', true) || _strEndsWith(this.filePath, '.xml', true);
            if (!isFlexReport || this.reportName) {
                return true;
            }
        }

        if (promise) {
            promise.reject(_ReportService._invalidReportControllerError);
        }

        return false;
    }

    _checkReportInstanceController(promise?: _Promise): boolean {
        if (this._checkReportController(promise) && this._instanceId) {
            return true;
        }

        if (promise) {
            promise.reject(_ReportService._invalidReportCacheControllerError);
        }

        return false;
    }

    _getError(xhr: XMLHttpRequest) {
        var reason = xhr.responseText;
        try {
            if (reason) {
                reason = JSON.parse(reason);
            }
        } finally {
            return reason;
        }
    }

    render(data?): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._renderAction), {
            method: 'POST',
            data: data
        }).then((xhr: XMLHttpRequest) => {
            var v = xhr.status === 202 ? { status: _ExecutionStatus.rendering } : _parseReportExecutionInfo(xhr.responseText);
            this._status = <string>v.status;
            promise.resolve(v);
        }, (xhr: XMLHttpRequest) => {
            promise.reject(this._getError(xhr));
        });

        return promise;
    }

    renderToFilter(options: _IRenderOptions): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.getRenderToFilterUrl(options).then((url: string) => {
            this.httpRequest(url, { cache: true }).then((xhr: XMLHttpRequest) => {
                promise.resolve(xhr);
            }, (xhr: XMLHttpRequest) => {
                promise.reject(this._getError(xhr));
            });
        });

        return promise;
    }

    load(data?): IPromise {
        var promise = new _Promise();

        if (!this._checkReportController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(), { method: 'POST', data: data }).then((xhr: XMLHttpRequest) => {
            var v = _parseReportExecutionInfo(xhr.responseText);

            this._instanceId = v.id;
            this._status = _ExecutionStatus.loaded;
            this._outlinesLocation = v.outlinesLocation;
            this._statusLocation = v.statusLocation;
            this._pageSettingsLocation = v.pageSettingsLocation;
            this._featuresLocation = v.featuresLocation;
            this._parametersLocation = v.parametersLocation;

            promise.resolve(v);
        }, (xhr: XMLHttpRequest) => {
            promise.reject(this._getError(xhr));
        });

        return promise;
    }

    cancel(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        if (this._status !== _ExecutionStatus.rendering) {
            promise.reject('Cannot execute cancel when the report is not rendering.');
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._cancelAction), { method: 'POST' }).then((xhr: XMLHttpRequest) => {
            var v = _parseReportExecutionInfo(xhr.responseText);
            this._status = v.status.status;
            promise.resolve(v);
        });

        return promise;
    }

    dispose(): IPromise {
        var promise = new _Promise();

        // The reason of not passing promise to _checkReportCacheController is:
        // do nothing When cacheId is not generated.
        if (!this._checkReportInstanceController()) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(), { method: 'DELETE' }).then((xhr: XMLHttpRequest) => {
            this._status = _ExecutionStatus.cleared;
            this._instanceId = '';
            promise.resolve();
        });

        return promise;
    }

    getOutlines(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._outlinesAction)).then((xhr: XMLHttpRequest) => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    getRenderToFilterUrl(options: _IRenderOptions): IPromise {
        var promise = new _Promise(),
            url = null;

        if (this._checkReportInstanceController()) {
            url = this._getReportInstancesUrl(_ReportService._exportAction);
            url = _disableCache(url);
            url = _appendQueryString(url, options);
            promise.resolve(url);
        }

        promise.resolve(url);
        return promise;
    }

    getExportedUrl(options: _IRenderOptions): IPromise {
        return this.getRenderToFilterUrl(options);
    }

    search(searchOptions: _ISearchOptions): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._searchAction), { data: searchOptions }).then((xhr: XMLHttpRequest) => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    setPageSettings(pageSettings: _IPageSettings): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        };

        var url = this._getReportInstancesUrl(_ReportService._pageSettingsAction);

        this.httpRequest(url, { method: 'PUT', data: pageSettings })
            .then((xhr: XMLHttpRequest) => {
                promise.resolve(JSON.parse(xhr.responseText, _pageSettingsJsonReviver));
            }, (xhr: XMLHttpRequest) => {
                promise.reject(this._getError(xhr));
            });

        return promise;
    }

    setParameters(parameters: Object): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        };

        Object.keys(parameters).forEach(key => {
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
            .then((xhr: XMLHttpRequest) => {
                promise.resolve(JSON.parse(xhr.responseText));
            }, (xhr: XMLHttpRequest) => {
                promise.reject(this._getError(xhr));
            });

        return promise;
    }

    // Return an IPromise with _IExportDescription[].
    getSupportedExportDescriptions(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._getReportInstancesUrl(_ReportService._supportedFormatsAction)).then((xhr: XMLHttpRequest) => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    // Return an IPromise with _IDocumentFeatures.
    getFeatures(): IPromise {
        var promise = new _Promise();

        if (!this._checkReportInstanceController(promise)) {
            return promise;
        }

        this.httpRequest(this._featuresLocation).then((xhr: XMLHttpRequest) => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }
}
    }
    


    module wijmo.viewer {
    














'use strict';

// Defines an abstract document source class.
export class _DocumentSource {
    static _abstractMethodException = 'It is an abstract method, please implement it.';

    private _features: _IDocumentFeatures;
    private _paginated: boolean;
    private _hasOutlines = false;
    private _pageCount = 0;
    private _service: _IDocumentService;
    private _supportedExportDescriptions: _IExportDescription[] = [];
    private _pageSettings: _IPageSettings;
    private _isLoadCompleted = false;
    private _isInstanceCreated = false;
    private _isDisposed = false;
    private _errors: string[] = [];
    private _expiredDateTime: Date;
    private _executionDateTime: Date;
    private _initialPosition: _IDocumentPosition;
    private _httpHandler: IHttpRequestHandler;

    // Occurs after the page count changes.
    readonly pageCountChanged = new wijmo.Event<_DocumentSource, wijmo.EventArgs>();

    // Occurs after the document is disposed.
    readonly disposed = new wijmo.Event<_DocumentSource, wijmo.EventArgs>();

    // Occurs when the pageSettings property value changes.
    readonly pageSettingsChanged = new wijmo.Event<_DocumentSource, wijmo.EventArgs>();

    // Occurs when the document is starting to load.
    readonly loading = new wijmo.Event<_DocumentSource, wijmo.EventArgs>();

    // Occurs when the document loading is completed.
    readonly loadCompleted = new wijmo.Event<_DocumentSource, wijmo.EventArgs>();

    // Queries the request data sent to the service before loading the document.
    readonly queryLoadingData = new wijmo.Event<_DocumentSource, QueryLoadingDataEventArgs>();

    // Raises the {@link queryLoadingData} event.
    // @param e {@link QueryLoadingDataEventArgs} that contains the event data.
    onQueryLoadingData(e: QueryLoadingDataEventArgs) {
        this.queryLoadingData.raise(this, e);
    }

    // Creates the document source.
    // @param options The document options and service information.
    constructor(options: _IDocumentOptions, httpHandler: IHttpRequestHandler) {
        this._httpHandler = httpHandler;
        this._service = this._createDocumentService(options);
        this._paginated = options.paginated;
    }

    _updateIsLoadCompleted(value: boolean) {
        if (this._isLoadCompleted === value) {
            return;
        }

        this._isLoadCompleted = value;
        if (value) {
            this.onLoadCompleted();
        }
    }

    _updateIsDisposed(value: boolean) {
        if (this._isDisposed === value) {
            return;
        }

        this._isDisposed = value;
        this.onDisposed();
    }

    _getIsDisposed() {
        return this._isDisposed;
    }

    _checkHasOutlines(data: _IDocumentStatus): boolean {
        return data.hasOutlines;
    }

    _checkIsLoadCompleted(data: _IDocumentStatus): boolean {
        return data.status === _ExecutionStatus.completed
            || data.status === _ExecutionStatus.stopped
            || data.status === _ExecutionStatus.loaded;
    }

    get encodeRequestParams(): boolean {
        return true;
    }

    // The execution date time of the loading document.
    get executionDateTime(): Date {
        return this._executionDateTime;
    }

    // The expired date time of the cache.
    get expiredDateTime(): Date {
        return this._expiredDateTime;
    }

    // Gets the errors of this document.
    get errors(): string[] {
        return this._errors;
    }

    // Gets a boolean value indicates if this document loading is completed.
    get isLoadCompleted(): boolean {
        return this._isLoadCompleted;
    }

    // Gets a boolean value indicates if this document instance is created at server successfully.
    get isInstanceCreated(): boolean {
        return this._isInstanceCreated;
    }

    // Gets a boolean value indicates if this document is disposed.
    get isDisposed(): boolean {
        return this._getIsDisposed();
    }

    // Gets the document features.
    get features(): _IDocumentFeatures {
        return this._features;
    }

    // Gets the page settings.
    get pageSettings(): _IPageSettings {
        return this._pageSettings;
    }

    // Raises the {@link pageSettingsChanged} event.
    // @param e The event arguments.
    onPageSettingsChanged(e?: wijmo.EventArgs): void {
        this.pageSettingsChanged.raise(this, e || new wijmo.EventArgs());
    }

    // Raises the {@link loadCompleted} event.
    // @param e The event arguments.
    onLoadCompleted(e?: wijmo.EventArgs) {
        this.loadCompleted.raise(this, e || new wijmo.EventArgs());
    }

    // Raises the {@link loading} event.
    // @param e The event arguments.
    onLoading(e?: wijmo.EventArgs) {
        this.loading.raise(this, e || new wijmo.EventArgs());
    }

    // Raises the {@link disposed} event.
    // @param e The event arguments.
    onDisposed(e?: wijmo.EventArgs) {
        this.disposed.raise(this, e || new wijmo.EventArgs());
    }

    // Set the page settings.
    // @param pageSettings page settings for the document.
    // @return An {@link IPromise} object with {@link _IExecutionInfo}.
    setPageSettings(pageSettings: _IPageSettings): IPromise {
        return this._innerService.setPageSettings(pageSettings).then((data: _IPageSettings) => this._updatePageSettings(data));
    }

    _updatePageSettings(newValue: _IPageSettings) {
        this._pageSettings = newValue;
        this.onPageSettingsChanged();
    }

    get _innerService(): _DocumentService {
        return <_DocumentService><_IDocumentService>this._service;
    }

    // Gets a value indicating whether the content should be represented as a set of fixed sized pages.
    get paginated(): boolean {
        return this.pageSettings ? this.pageSettings.paginated : this._paginated;
    }

    get hasThumbnails(): boolean {
        return true;
    }

    // Gets a boolean value indicates whether current document has outlines or not.
    get hasOutlines(): boolean {
        return this._hasOutlines;
    }

    // Gets the page count of the document.
    get pageCount(): number {
        return this._pageCount;
    }

    // Gets the initial position to be shown after rendering.
    get initialPosition(): _IDocumentPosition {
        return this._initialPosition;
    }
    set initialPosition(value: _IDocumentPosition) {
        this._initialPosition = value;
    }

    // Gets the service information of the document source.
    get service(): _IDocumentService {
        return this._service;
    }

    // Gets the array of {@link _IExportDescription} of current document source.
    // @return An {@link IPromise} object with an {@link _IExportDescription} array.
    getSupportedExportDescriptions(): IPromise {
        return this._innerService.getSupportedExportDescriptions();
    }

    // Gets the bookmark by bookmark's name.
    // @param name Name of the bookmark to look for.
    // @return An {@link IPromise} object with {@link _IDocumentPosition}.
    getBookmark(name: string): IPromise {
        return this._innerService.getBookmark(name);
    }

    // Executes the custom action.
    // @param actionString The string represents the custom action.
    // @return An {@link IPromise} object with {@link _IDocumentStatus}.
    executeCustomAction(action: _IDocAction): IPromise {
        return this._innerService.executeCustomAction(action);
    }

    // Gets an array of outline of current document source.
    // @return An {@link IPromise} object with an {@link _IOutlineNode} array.
    getOutlines(): IPromise {
        return this._innerService.getOutlines();
    }

    // Gets the features of current document source.
    // @return An {@link IPromise} object with an {@link _IDocumentFeatures} array.
    getFeatures(): IPromise {
        return this._innerService.getFeatures().then(v => { this._features = v });
    }

    // Disposes the current document source instance from service.
    // @return An {@link IPromise} object with information of document.
    dispose(): IPromise {
        return this._innerService.dispose().then(() => this._updateIsDisposed(true));
    }

    // Loads the current document source from service.
    // @return An {@link IPromise} object with information of document.
    load(): IPromise {
        this.onLoading();

        var data = {};
        if (this._paginated != null) {
            data["pageSettings.paginated"] = this.paginated;
        }

        var e = new QueryLoadingDataEventArgs(data);
        this.onQueryLoadingData(e);

        return this._innerService.load(e.data).then((v: _IExecutionInfo) => {
            this._updateExecutionInfo(v);
            // TODO: check!!! - it is not needed for AR at least...
            //this._updateIsLoadCompleted(true);
        });
    }

    _updateExecutionInfo(data: _IExecutionInfo) {
        if (data == null) {
            return;
        }

        this._executionDateTime = this._getExecutionDateTime(data);
        this._expiredDateTime = this._getExpiredDateTime(data);
        this._updatePageSettings(data.pageSettings);
        this._features = data.features;
        this._isInstanceCreated = (data.status != null) && (data.status.status !== _ExecutionStatus.notFound) && (data.status.status !== _ExecutionStatus.cleared);
        this._updateDocumentStatus(data.status);
    }

    _updateDocumentStatus(data: _IDocumentStatus) {
        if (!data /*|| (data.status == _ExecutionStatus.notFound)*/) {
            return;
        }
        this._errors = data.errorList;
        this._initialPosition = data.initialPosition;
        this._updatePageCount(this._getPageCount(data));
        this._expiredDateTime = this._getExpiredDateTime(data);
        this._hasOutlines = this._checkHasOutlines(data);
        this._updateIsLoadCompleted(this._checkIsLoadCompleted(data));
    }

    _getExecutionDateTime(data: _IExecutionInfo): Date {
        return data.loadedDateTime;
    }

    _getExpiredDateTime(data: _IDocumentStatus | _IExecutionInfo): Date {
        return data.expiredDateTime;
    }

    _getPageCount(data: _IDocumentStatus): number {
        return data.pageCount;
    }

    _updatePageCount(value: number) {
        if (this._pageCount === value) {
            return;
        }

        this._pageCount = value;
        this.onPageCountChanged();
    }

    // Gets the document status.
    getStatus(): IPromise {
        return this._innerService.getStatus().then(v => { this._updateDocumentStatus(v); });
    }

    _createDocumentService(options: _IDocumentService): _DocumentService {
        throw _DocumentSource._abstractMethodException;
    }

    // Raises the {@link pageCountChanged} event.
    // @param e {@link EventArgs} that contains the event data.
    onPageCountChanged(e?: wijmo.EventArgs): void {
        this.pageCountChanged.raise(this, e || new wijmo.EventArgs());
    }

    export(options: _IRenderOptions): void {
        this.getExportedUrl(options).then((url: string) => {
            this._innerService.downloadBlob(url).then((blob: Blob) => {
                let ext = options.format;

                if (ext.match('bmp|emf|gif|html|jpeg|jpg|png|tif|tiff') && blob.type === 'application/zip') {
                    ext = 'zip';
                }

                if (ext === 'zip' && blob.type === 'application/x-emf') { // compressed metafile, single page.
                    ext = 'emf';
                }

                _saveBlob(blob, `${this._innerService.getFileName()}.${ext}`);
            });
        });
    }

    // Prints the current document.
    // @param rotations Determines the rotation angle for every page in the document.
    print(rotations?: _RotateAngle[]) {
        // NB: _ArReportSource overrides this method.
        if (wijmo.isMobile()) {
            this.export({ format: 'pdf' });
            return;
        }

        var doc = new wijmo.PrintDocument({
            title: 'Document'
        });

        this.renderToFilter({ format: 'html' }).then(xhr => {
            doc.append(xhr.responseText);

            var udoc = doc._getDocument();
            udoc.close();

            window.setTimeout(() => { // Otherwise the document content will be empty in IE and FF.
                this._removeScript(doc);
                this._rotate(doc, rotations);
                doc.print();
            }, 100);
        });
    }

    protected get httpHandler(): IHttpRequestHandler {
        return this._httpHandler;
    }

    private _removeScript(doc: wijmo.PrintDocument) {
        //remove script node which sometimes cause issue with Edge.
        var scripts = doc._getDocument().querySelectorAll('script');
        for (var i = 0; i < scripts.length; i++) {
            var item = scripts.item(i);
            item.parentElement.removeChild(item);
        }
    }

    private _rotate(doc: wijmo.PrintDocument, rotations: _RotateAngle[]) {
        if (!rotations || !rotations.length) {
            return;
        }

        var svgs = doc._getDocument().querySelectorAll('svg');
        for (var i = 0; i < svgs.length; i++) {
            var r = rotations[i];

            if (!r) {
                continue;
            }

            var svg = svgs[i],
                g = <Element>document.createElementNS('http://www.w3.org/2000/svg', 'g'); // used for transformations

            while (svg.hasChildNodes()) {
                g.appendChild(svg.firstChild);
            }
            svg.appendChild(g);

            var sz: _ISize = { width: new _Unit(svg.width.baseVal.value), height: new _Unit(svg.height.baseVal.value) },
                szr = _getRotatedSize(sz, r),
                section = <HTMLElement>svg.parentNode;

            section.style.width = szr.width.valueInPixel + 'px';
            section.style.height = szr.height.valueInPixel + 'px';
            svg.setAttribute('width', szr.width.valueInPixel.toString() + 'px');
            svg.setAttribute('height', szr.height.valueInPixel.toString() + 'px');

            _transformSvg(svgs[i], sz.width.valueInPixel, sz.height.valueInPixel, 1, r);
        }
    }

    // Renders the document into an export filter object.
    // @param options Options of the export.
    // @return An {@link IPromise} object with XMLHttpRequest.
    renderToFilter(options: _IRenderOptions): IPromise {
        return this._innerService.renderToFilter(options);
    }

    // Gets the file url of rendering the document into an export filter object.
    // @param options Options of the export.
    // @return The file url of rendering the document into an export filter object.
    getRenderToFilterUrl(options: _IRenderOptions): IPromise {
        return this._innerService.getRenderToFilterUrl(options);
    }

    getExportedUrl(options: _IRenderOptions, raiseEvent = false): IPromise {
        var promise = new _Promise();

        this._innerService.getExportedUrl(options).then(url => {
            var args = new RequestEventArgs(url, null);
            if (raiseEvent) {
                // Allow user to handle the received URL (add a security token, for example).
                this.httpHandler.beforeSend(args);
            }
            promise.resolve(args.url);
        });

        return promise;
    }

    // Gets an array of Search by search options.
    // @param text The text to match.
    // @param matchCase Whether to ignore case during the match.
    // @param wholeWord Whether to match the whole word, or just match the text.
    // @return An {@link IPromise} object with an {@link _ISearchResultItem} array.
    search(searchOptions: _ISearchOptions): IPromise {
        return this._innerService.search(searchOptions);
    }
}
    }
    


    module wijmo.viewer {
    











'use strict';

export class _ReportSourceBase extends _DocumentSource {
    private _status = _ExecutionStatus.notFound;

    constructor(options: _IDocumentOptions, httpHandler: IHttpRequestHandler) {
        super(options, httpHandler);
    }

    // Occurs when the status property value changes.
    readonly statusChanged = new wijmo.Event<_ReportSourceBase, wijmo.EventArgs>();

    get autoRun(): boolean {
        return true;
    }

    get hasParameters(): boolean {
        throw _DocumentSource._abstractMethodException;
    }

    get status(): string {
        return this._status;
    }
    set status(value: string) {
        if (value !== this._status) {
            this._status = value;
            this.onStatusChanged();
        }
    }

    getParameters(): IPromise {
        throw _DocumentSource._abstractMethodException;
    }

    setParameters(parameters: Object): IPromise {
        throw _DocumentSource._abstractMethodException;
    }

    // Renders the report.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportStatus}.
    render(): IPromise {
        return this._innerService.render().then(v => this._updateDocumentStatus(v));
    }

    // Executes the custom action.
    // @param actionString The string represents the custom aciton.
    // @return An {@link IPromise} object with {@link _IReportStatus}.
    executeCustomAction(action: _IDocAction): IPromise {
        return this._innerService.executeCustomAction(action).then(v => this._updateDocumentStatus(v));
    }

    // Raises the {@link statusChanged} event.
    // @param e The event arguments.
    onStatusChanged(e?: wijmo.EventArgs): void {
        this.statusChanged.raise(this, e);
    }

    get _innerService(): _ReportServiceBase {
        return <_ReportServiceBase>this.service;
    }

    _updateDocumentStatus(data: _IReportStatus) {
        if (data) {
            this.status = data.status;
        }
        super._updateDocumentStatus(data);
    }
}
    }
    


    module wijmo.viewer {
    









'use strict';

// Defines a _Report class.
export class _Report extends _ReportSourceBase {
    private _hasParameters = false;
    private _parameters: _IParameter[];

    // Creates a _Report instance.
    // @param options The report service information.
    constructor(options: _IReportOptions, httpHandler: IHttpRequestHandler) {
        super(options, httpHandler);
    }

    // Gets the report names defined in the specified FlexReport definition file.
    // @param serviceUrl The root url of service.
    // @param reportFilePath The report file path.
    // @param httpHandler The HTTP request handler.
    // @return An {@link wijmo.viewer.IPromise} object with a string array which contains the report names.
    static getReportNames(serviceUrl: string, reportFilePath: string, httpHandler?: IHttpRequestHandler): IPromise {
        return _ReportService.getReportNames(serviceUrl, reportFilePath, httpHandler);
    }

    // Gets the catalog items in the specific folder path.
    // @param serviceUrl The root url of service.
    // @param path The folder path.
    // @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
    // @param httpHandler The HTTP request handler.
    // @return An {@link IPromise} object with an array of {@link ICatalogItem}.
    static getReports(serviceUrl: string, path: string, data?: any, httpHandler?: IHttpRequestHandler): IPromise {
        if (wijmo.isBoolean(data)) {
            data = { recursive: data };
        }
        return _ReportService.getReports(serviceUrl, path, data, httpHandler);
    }

    // Gets the report name.
    get reportName(): string {
        return this._innerService ? this._innerService.reportName : null;
    }

    // Gets a boolean value, indicates whether current report has parameters.
    get hasParameters(): boolean {
        return this._hasParameters;
    }

    // Loads the current document source from service.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
    load(): IPromise {
        return super.load();
    }

    // Stops rendering the current document source.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
    cancel(): IPromise {
        return this._innerService.cancel().then(v => this._updateDocumentStatus(v));
    }

    // Removes the current document source from service.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IReportExecutionInfo}.
    dispose(): IPromise {
        return super.dispose();
    }

    // Sets the parameters.
    // @param parameters Parameters for the report.
    // @return An {@link wijmo.viewer.IPromise} object with an {@link _IParameter} array.
    setParameters(parameters: Object): IPromise {
        return this._innerService.setParameters(parameters).then(v => void (this._parameters = v));
    }

    // Gets an array of parameter of current document source.
    // @return An {@link wijmo.viewer.IPromise} object with an {@link _IParameter} array.
    getParameters(): IPromise {
        return this._innerService.getParameters().then(v => void (this._parameters = v));
    }

    _getIsDisposed(): boolean {
        return super._getIsDisposed() || this._innerService.isCleared;
    }

    _updateExecutionInfo(data: _IReportExecutionInfo) {
        if (data == null || this.isDisposed) {
            return;
        }

        this._hasParameters = !!data.hasParameters;
        super._updateExecutionInfo(data);
    }


    _checkIsLoadCompleted(data: _IReportStatus): boolean {
        return data.status === _ExecutionStatus.completed
            || data.status === _ExecutionStatus.stopped;
    }

    _createDocumentService(options: _IReportService): _ReportService {
        return new _ReportService(options, this.httpHandler);
    }

    get _innerService(): _ReportService {
        return <_ReportService>this.service;
    }
}
    }
    


    module wijmo.viewer {
    









'use strict';

// Defines the _PdfDocumentSource class.
export class _PdfDocumentSource extends _DocumentSource {
    private _status = _ExecutionStatus.notFound;

    // Creates a _PdfDocumentSource instance.
    // @param options The pdf service information.
    constructor(options: _IDocumentService, httpHandler: IHttpRequestHandler) {
        super(options, httpHandler);
    }

    // Gets the status of current pdf.
    get status(): string {
        return this._status;
    }

    get _innerService(): _PdfDocumentService {
        return <_PdfDocumentService>this.service;
    }

    _createDocumentService(options: _IDocumentService): _PdfDocumentService {
        return new _PdfDocumentService(options, this.httpHandler);
    }

    // Loads the current pdf document source from service.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IDocumentStatus}.
    load(): IPromise {
        return super.load();
    }

    _updateStatus(newValue: string) {
        if (this._status === newValue) {
            return;
        }

        this._status = newValue;
    }

    // Gets the status of pdf in server.
    // @return An {@link wijmo.viewer.IPromise} object with {@link _IDocumentStatus}.
    getStatus(): IPromise {
        var e = new QueryLoadingDataEventArgs();
        this.onQueryLoadingData(e);
        return this._innerService.getStatus(e.data).then(v => this._updateDocumentStatus(v));
    }

    // Renders the pdf into an export filter object.
    // @param options Export options.
    // @return An {@link IPromise} object with XMLHttpRequest.
    renderToFilter(options: _IRenderOptions): IPromise {
        var e = new QueryLoadingDataEventArgs();
        this.onQueryLoadingData(e);
        return this._innerService.renderToFilter(options, e.data);
    }

    _updateDocumentStatus(data: _IDocumentStatus) {
        if (data == null) {
            return;
        }

        this._updateStatus(data.status);
        super._updateDocumentStatus(data);
    }
}

export class _PdfDocumentService extends _DocumentService {
    private static _pdfCommand = '$pdf';
    private static _exportAction = 'export';
    private static _supportedFormatsAction = 'supportedformats';
    private static _searchAction = 'search';

    private static _invalidPdfControllerError = 'Cannot call the service when service url is not set or the pdf is not loaded.';

    private _status: string;
    private _statusLocation: string;
    private _featuresLocation: string;

    _getPdfUrl(...params: string[]): string {
        return _joinUrl(this.serviceUrl, this.filePath,
            _PdfDocumentService._pdfCommand, params);
    }

    _getPdfStatus(data?): IPromise {
        var promise = new _Promise();

        if (!this._checkPdfController(promise)) {
            return promise;
        }

        this.httpRequest(this._getPdfUrl(), { data: data }).then((xhr: XMLHttpRequest) => {
            var v = _parseExecutionInfo(xhr.responseText);

            this._status = _ExecutionStatus.loaded;
            this._statusLocation = v.statusLocation;
            this._featuresLocation = v.featuresLocation;

            promise.resolve(v);
        }, (xhr: XMLHttpRequest) => {
            promise.reject(xhr.statusText);
        });

        return promise;
    }

    _checkPdfController(promise?: _Promise): boolean {
        if (this.serviceUrl != null && this.filePath) {
            return true;
        }

        if (promise) {
            promise.reject(_PdfDocumentService._invalidPdfControllerError);
        }

        return false;
    }

    //// Returns an IPromise object with _IExecutionInfo.
    dispose(): IPromise {
        var promise = new _Promise();
        promise.resolve();

        return promise;
    }

    // Returns an IPromise object with _IExecutionInfo.
    load(data?): IPromise {
        return this._getPdfStatus(data);
    }

    getStatus(data?): IPromise {
        var promise = new _Promise();

        this.httpRequest(this._statusLocation, { data: data }).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    renderToFilter(options: _IRenderOptions, data?): IPromise {
        var promise = new _Promise();
        if (!this._checkPdfController(promise)) {
            return promise;
        }

        this.getRenderToFilterUrl(options).then((url: string) => {
            this.httpRequest(url, { data: data, cache: true }).then(xhr => {
                promise.resolve(xhr);
            });
        });

        return promise;
    }


    getRenderToFilterUrl(options: _IRenderOptions): IPromise {
        var promise = new _Promise(),
            url: string = null;

        if (this._checkPdfController()) {
            url = this._getPdfUrl(_PdfDocumentService._exportAction);
            url = _disableCache(url);
            url = _appendQueryString(url, options);
        }

        promise.resolve(url);
        return promise;
    }

    getExportedUrl(options: _IRenderOptions): IPromise {
        return this.getRenderToFilterUrl(options);
    }

    // Returns an IPromise object with _IExportDescription[].
    getSupportedExportDescriptions(): IPromise {
        var promise = new _Promise();
        if (!this._checkPdfController(promise)) {
            return promise;
        }

        this.httpRequest(this._getPdfUrl(_PdfDocumentService._supportedFormatsAction)).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    // Return an IPromise with _IDocumentFeatures.
    getFeatures(): IPromise {
        var promise = new _Promise();

        if (!this._checkPdfController(promise)) {
            return promise;
        }

        this.httpRequest(this._featuresLocation).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }

    search(searchOptions: _ISearchOptions): IPromise {
        var promise = new _Promise();

        if (!this._checkPdfController(promise)) {
            return promise;
        }

        this.httpRequest(this._getPdfUrl(_PdfDocumentService._searchAction), { data: searchOptions }).then(xhr => {
            promise.resolve(JSON.parse(xhr.responseText));
        });

        return promise;
    }
}

export function _parseExecutionInfo(json: string): _IExecutionInfo {
    return JSON.parse(json, _statusJsonReviver);
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _SearchManager {
    private _documentSource: _DocumentSource;
    private _text: string;
    private _matchCase: boolean;
    private _wholeWord: boolean;
    private _searchResult: _ISearchResultItem[];
    private _currentIndex = -1;

    readonly currentChanged = new wijmo.Event<_SearchManager, wijmo.EventArgs>();
    readonly searchStarted = new wijmo.Event<_SearchManager, wijmo.EventArgs>();
    readonly searchCompleted = new wijmo.Event<_SearchManager, wijmo.EventArgs>();
    readonly resultsCleared = new wijmo.Event<_SearchManager, wijmo.EventArgs>();
    readonly textChanged = new wijmo.Event<_SearchManager, wijmo.EventArgs>();

    // current
    get current(): _ISearchResultItem {
        if (this._currentIndex < 0) {
            return null;
        }
        return this._searchResult[this._currentIndex];
    }

    // currentIndex
    get currentIndex(): number {
        return this._currentIndex;
    }
    set currentIndex(value: number) {
        if (value === this._currentIndex) {
            return;
        }

        this._getSearchResults().then(v => {
            this._currentIndex = value;
            this._onCurrentChanged();
        });
    }

    // documenSource
    get documentSource() {
        return this._documentSource;
    }
    set documentSource(value: _DocumentSource) {
        this._documentSource = value;
        this.clear();
    }

    // matchCase
    get matchCase(): boolean {
        return this._matchCase;
    }
    set matchCase(value: boolean) {
        if (this._matchCase === value) {
            return;
        }
        this._matchCase = value;
        this._clearResults();
    }

    // searchResult
    get searchResult(): _ISearchResultItem[] {
        return this._searchResult;
    }

    // text
    get text(): string {
        return this._text;
    }
    set text(value: string) {
        if (this._text === value) {
            return;
        }
        this._text = value;
        this._onTextChanged()
        this._clearResults();
    }

    // wholeWord
    get wholeWord(): boolean {
        return this._wholeWord;
    }
    set wholeWord(value: boolean) {
        if (this._wholeWord === value) {
            return;
        }
        this._wholeWord = value;
        this._clearResults();
    }

    public clear(): void {
        this._matchCase = false;
        this._wholeWord = false;
        this._currentIndex = -1;
        this.text = null; // instead of "this._text = null" to rise events (TFS 434156)
    }

    public search(pre?: boolean) {
        this._getSearchResults().then(v => {
            var length = this._searchResult.length;
            if (pre) {
                this._currentIndex--;
                if (this._currentIndex < 0) {
                    this._currentIndex = length - 1;
                }
            } else {
                this._currentIndex++;
                if (this._currentIndex >= length) {
                    this._currentIndex = 0;
                }
            }
            this._currentIndex = Math.max(Math.min(this._currentIndex, length - 1), 0);
            this._onCurrentChanged();
        });
    }

    private _clearResults() {
        this._currentIndex = -1;
        this._searchResult = null;
        this._onResultsCleared();
    }

    private _getSearchResults() {
        var p = new _Promise();
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
        }).then(v => {
            this._searchResult = v;
            this._onSearchCompleted();
        });
    }

    private _onCurrentChanged() {
        this.currentChanged.raise(this);
    }

    private _onSearchStarted() {
        this.searchStarted.raise(this);
    }

    private _onSearchCompleted() {
        this.searchCompleted.raise(this);
    }

    private _onResultsCleared() {
        this.resultsCleared.raise(this);
    }

    private _onTextChanged() {
        this.textChanged.raise(this);
    }
}
    }
    


    module wijmo.viewer {
    









'use strict';

export class _Page {
    private _documentSource: _DocumentSource;
    private _parent: _Page[];
    private _size?: _ISize;
    private _content: any = null;
    private _index: number;
    private _rotateAngle = _RotateAngle.NoRotate;
    private _contentPromise: _Promise;
    private _pendingContent = false;

    private static _bookmarkReg = /javascript\:navigate\(['|"](.*)['|"]\)/;
    static _bookmarkAttr = 'bookmark';
    private static _customActionReg = /^CA\:/;
    static _customActionAttr = 'customAction';
    private static _idReg = /(\<[^\>]+)(id=['|"])(\w+)(['|"])/g;
    private static _idReferReg = /(\<[^\>]+)(url\(#)(\w+)(\))/g;
    private static _invalidHref = 'javascript:void(0)';

    constructor(documentSource: _DocumentSource, index: number, size?: _ISize) {
        this._documentSource = documentSource;
        this._index = index;
        this._size = size;
    }

    readonly linkClicked = new wijmo.Event<_Page, wijmo.EventArgs>();

    get index(): number {
        return this._index;
    }

    get size(): _ISize {
        return this._size;
    }

    get rotateAngle(): _RotateAngle {
        return this._rotateAngle;
    }
    set rotateAngle(value: _RotateAngle) {
        this._rotateAngle = value;
    }

    get content(): any {
        return this._content;
    }
    
    get pendingContent(): boolean {
        return this._pendingContent;
    }

    getContent(): IPromise {
        let promise = this._contentPromise;
        if (promise && !promise.isFinished) {
            return promise;
        }
        this._contentPromise = promise = new _Promise();

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
        }).then((data: XMLHttpRequest) => {
            if (this._documentSource !== documentSource) {
                return;
            }

            var div = document.createElement('div');
            div.innerHTML = this._processSvgResponse(this._addGlobalUniqueId(data.responseText));

            var svg = div.querySelector('svg'),
                g = <Element>document.createElementNS('http://www.w3.org/2000/svg', 'g');

            while (svg.hasChildNodes()) {
                g.appendChild(svg.firstChild);
            }
            svg.appendChild(g);

            this._size = {
                width: new _Unit(svg.width.baseVal.value),
                height: new _Unit(svg.height.baseVal.value)
            };

            this._content = svg;
            this._processActionLinks(svg, (element: SVGElement) => {
                _addEvent(element, 'click', () => {
                    this._onLinkClicked(new _LinkClickedEventArgs(element));
                });
            });
            this._pendingContent = false;
            promise.resolve(this._content);
        }).catch(() => {
            this._pendingContent = false;
        });

        return promise;
    }

    protected _processSvgResponse(svg: string): string {
        return svg;
    }

    _extractSize(content: HTMLElement): _ISize {
        if (content) {
            var svg = content.querySelector('svg');
            if (svg) {
                return { width: new _Unit(svg.width.baseVal.value), height: new _Unit(svg.height.baseVal.value) };
            }
        }
        return null;
    }

    private _onLinkClicked(e: _LinkClickedEventArgs) {
        this.linkClicked.raise(this, e);
    }

    protected _processActionLinks(svg: SVGElement, actionElementFound: (element: SVGElement) => void) {
        var aList = <NodeListOf<any>>svg.querySelectorAll('a');
        for (var i = 0; i < aList.length; i++) {
            var a = <SVGAElement>aList.item(i);
            var url = a.href ? a.href.baseVal : '';
            if (url.indexOf('navigate') > 0) {
                var result = _Page._bookmarkReg.exec(url);
                if (result) {
                    if (result[1] && result[1].length > 0) {
                        a.href.baseVal = _Page._invalidHref;
                        a.setAttribute(_Page._bookmarkAttr, result[1]);
                        actionElementFound(a);
                    } else {
                        // The bookmark is empty which will take no affect on clicking on it.
                        // Remove the xlink: href attribute to avoid hand cursor on mouse moving on it.
                        a.removeAttribute("xlink:href");
                    }
                }
            } else if (_Page._customActionReg.test(url)) {
                a.href.baseVal = _Page._invalidHref;
                a.setAttribute(_Page._customActionAttr, url.substr(3));
                actionElementFound(a);
            }
        }
    }

    private _addGlobalUniqueId(svgHtml: string): string {
        var uniqueId = new Date().getTime().toString();
        svgHtml = svgHtml.replace(_Page._idReg, '$1$2' + uniqueId + '$3$4');
        svgHtml = svgHtml.replace(_Page._idReferReg, '$1$2' + uniqueId + '$3$4');

        return svgHtml;
    }
}
    }
    


    module wijmo.viewer {
    

'use strict';

export class _ArPage extends _Page {
    _processSvgResponse(svg: string): string {
        svg = super._processSvgResponse(svg);

        var doc = new DOMParser().parseFromString(svg, 'text/xml'); //  Evaluate DOCTYPE entities (css)
        svg = new XMLSerializer().serializeToString(doc);

        return svg;
    }

    protected _processActionLinks(svg: SVGElement, actionElementFound: (element: SVGElement) => void) {
        var elements = svg.querySelectorAll('rect[arsvg\\:data-action-type]');
        for (var i = 0; i < elements.length; i++) {
            actionElementFound(<SVGElement>elements[i]);
        }
    }
}
    }
    


    module wijmo.viewer {
    







'use strict';

export interface _IHitTestInfo {
    pageIndex: number;
    x: number;
    y: number;
    hitWorkingArea: boolean;
}

export interface _IPageHitTestInfo {
    pageIndex: number;
    x: number;
    y: number;
}

export interface _IPageView {
    pageIndex: number;
    pages: _Page[];
    scrollTop: number;
    scrollLeft: number;
    panMode: boolean;
    zoomFactor: number;
    zoomMode: ZoomMode;
    pageIndexChanged: wijmo.Event;
    zoomFactorChanged: wijmo.Event;
    zoomModeChanged: wijmo.Event;
    positionChanged: wijmo.Event;
    rotateAngleChanged: wijmo.Event;
    pageLoaded: wijmo.Event;
    moveToPage(pageIndex: number): IPromise;
    moveToPosition(position: _IDocumentPosition): IPromise;
    rotatePageTo(pageIndex: number, rotateAngle: _RotateAngle);
    hitTest(x: number, y: number): _IHitTestInfo;
    isPageContentLoaded(pageIndex: number): boolean;
    resetPages();
    invalidate();
    refresh();
}

export interface _IZoomModeChangedEventArgs {
    oldValue: ZoomMode;
    newValue: ZoomMode;
}

export interface _IZoomFactorChangedEventArgs {
    oldValue: number;
    newValue: number;
}

export interface IInnerDocumentPosition extends _IDocumentPosition {
    samePage?: boolean;
}
    }
    


    module wijmo.viewer {
    












'use strict';

export class _PageViewBase extends wijmo.Control implements _IPageView {
    private _autoHeightCalculated: boolean = false;
    private _startX: number = null;
    private _startY: number = null;
    private _panMode: boolean = false;
    private _pageIndex: number = -1;
    private _pages: _Page[];
    private _zoomFactor = 1.0;
    private _zoomMode = ZoomMode.Custom;
    private _touchManager: _TouchManager;
    private _zoomModeUpdating = false;
    protected _pagesWrapper: HTMLElement;
    private _fBorderBoxMode: boolean;
    private _movingPromise: IPromise = new _Promise();
    private _targetRenderPageIndex: number;

    static _pageMargin = 30;
    static _pageBorderWidth = 1;

    static controlTemplate = '<div class="wj-pages-wrapper" wj-part="pages-wrapper"></div>';

    constructor(element: any) {
        super(element);

        var tpl: string;
        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate('wj-pageview', tpl, this._getTemplateParts());

        this._fBorderBoxMode = getComputedStyle(element).boxSizing === 'border-box';

        this._init();
    }

    _getTemplateParts(): object {
        return {
            _pagesWrapper: 'pages-wrapper'
        };
    }

    _getPagesContainer(): HTMLElement {
        return this.hostElement;
    }

    readonly pageIndexChanged = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    readonly zoomFactorChanged = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    readonly zoomModeChanged = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    readonly positionChanged = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    readonly rotateAngleChanged = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    readonly pageLoaded = new wijmo.Event<_PageViewBase, wijmo.EventArgs>();

    _init(): void {
        this._bindEvents();
    }

    dispose() {
        if (this._touchManager) this._touchManager.dispose();
        super.dispose();
    }

    _bindTouchEvents(touchManager: _TouchManager) {
        touchManager.touchStart.addHandler(() => {
            this.hostElement.focus();
        });

        touchManager.panMove.addHandler((sender, args: _PanEventArgs) => {
            touchManager.hostElement.scrollTop -= args.clientDelta.y;
            touchManager.hostElement.scrollLeft -= args.clientDelta.x;
        });

        touchManager.pinch.addHandler(this._zoomByPinch, this);
    }

    _initTouchEvents() {
        var element = this._pagesWrapper.parentElement;
        var touchManager = new _TouchManager(element);
        this._touchManager = touchManager;
        this._bindTouchEvents(touchManager);
    }

    protected get _borderBoxMode() {
        return this._fBorderBoxMode;
    }

    private _zoomByPinch(touchManager: _TouchManager, args: _PinchEventArgs) {
        args.preventDefault();
        if (args.type != _TouchEventType.Move) return;

        var contentRect = wijmo.getElementRect(touchManager.contentElement),
            contentStyle = getComputedStyle(touchManager.contentElement),
            contentMarignTop = parseInt(contentStyle.marginTop),
            contentMarignLeft = parseInt(contentStyle.marginLeft),
            contentCenter = _pointMove(false, args.preCenterClient, contentRect.left - contentMarignLeft, contentRect.top - contentMarignTop);

        this._zoom(touchManager.hostElement, args.zoom, contentCenter, args.centerClientDelta);
    }

    private _getFixedPosition(position: wijmo.Point): wijmo.Point {
        return new wijmo.Point(_PageViewBase._pageMargin, _PageViewBase._pageMargin + this._getAbovePageCount(position.y) * _PageViewBase._pageMargin);
    }

    _getAbovePageCount(top: number) {
        return 0;
    }

    private _zoom(container: Element, value: number, center: wijmo.Point, delta: wijmo.Point) {
        //Pre hit postion on container
        var preContainerCenter = _pointMove(false, center, container.scrollLeft, container.scrollTop),
            fixedPos = this._getFixedPosition(center);

        var lastZoomFactor = this.zoomFactor;
        this.zoomFactor = this.zoomFactor * value;
        var zoom = this.zoomFactor / lastZoomFactor;

        // current hit position on content
        var newCenter = new wijmo.Point((center.x - fixedPos.x) * zoom + fixedPos.x, (center.y - fixedPos.y) * zoom + fixedPos.y),
            containerCenter = _pointMove(true, preContainerCenter, delta),
            position = _pointMove(false, newCenter, containerCenter);
        container.scrollTop = Math.round(position.y);
        container.scrollLeft = Math.round(position.x);
    }

    get pageIndex(): number {
        return this._pageIndex;
    }

    get pages(): _Page[] {
        return this._pages;
    }
    set pages(value: _Page[]) {
        this._pages = value;
        this._reserveViewPage();
    }

    get scrollTop(): number {
        return this.hostElement.scrollTop;
    }

    get scrollLeft(): number {
        return this.hostElement.scrollLeft;
    }

    private _zoomFactorChangeInitiated = false;
    private _zoomModeChangeInitiated = false;

    get zoomFactor(): number {
        return this._zoomFactor;
    }
    set zoomFactor(value: number) {
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
            if (this._zoomFactor === Math.round(this._calcZoomToViewFactor()*100)/100) {
                this.zoomMode = ZoomMode.WholePage;
            } else if (this._zoomFactor === Math.round(this._calcZoomToViewWidthFactor()*100)/100) {
                this.zoomMode = ZoomMode.PageWidth;
            } else {
                this.zoomMode = ZoomMode.Custom;
            }
        }
        if (this._zoomFactorChangeInitiated) {
            this._onZoomFactorChanged(oldValue, this.zoomFactor);
            if (oldValueMode !== this.zoomMode) {
                this._onZoomModeChanged(oldValueMode, this.zoomMode);
            }
            this._zoomFactorChangeInitiated = false;
        }
    }

    get zoomMode(): ZoomMode {
        return this._zoomMode;
    }
    set zoomMode(value: ZoomMode) {
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
    }

    get panMode(): boolean {
        return this._panMode;
    }
    set panMode(value: boolean) {
        if (this._panMode == value) {
            return;
        }
        this._panMode = value;
    }

    private _bindEvents(): void {
        _addEvent(document, 'mousemove', (e) => {
            var isPanning = this._startX !== null && this._startY !== null;
            if (isPanning) {
                this._panning(e);
            }
        });

        _addEvent(document, 'mouseup', (e) => {
            this._stopPanning();
        });

        this._initTouchEvents();
    }

    private _startPanning(e: MouseEvent) {
        this._startX = e.screenX;
        this._startY = e.screenY;
    }

    private _panning(e: MouseEvent) {
        var pagesContainer = this._getPagesContainer();
        pagesContainer.scrollLeft += this._startX - e.screenX;
        pagesContainer.scrollTop += this._startY - e.screenY;
        this._startX = e.screenX;
        this._startY = e.screenY;
    }

    private _stopPanning() {
        this._startX = null;
        this._startY = null;
    }

    _onPageIndexChanged() {
        this.pageIndexChanged.raise(this);
    }

    _onZoomFactorChanged(oldValue: number, newValue: number) {
        this.zoomFactorChanged.raise(this, { oldValue: oldValue, newValue: newValue });
    }

    _onZoomModeChanged(oldValue: ZoomMode, newValue: ZoomMode) {
        this.zoomModeChanged.raise(this, { oldValue: oldValue, newValue: newValue });
    }

    _onPositionChanged() {
        this.positionChanged.raise(this);
    }

    _onRotateAngleChanged() {
        this.rotateAngleChanged.raise(this);
    }

    _onPageLoaded(pageIndex: number, pageElement: HTMLDivElement) {
        this.pageLoaded.raise(this, new PageLoadedEventArgs(pageIndex, pageElement));
    }

    _renderViewPage(viewPage: HTMLDivElement, pageIndex: number, isContinuous: boolean): IPromise {
        var loadingDiv: HTMLDivElement, promise = new _Promise();
        pageIndex = pageIndex < 0 ? 0 : pageIndex;
        this._targetRenderPageIndex = pageIndex;

        if (!viewPage) {
            promise.reject(wijmo.culture.Viewer.cannotRenderPageNoViewPage);
            return promise;
        }

        _removeChildren(viewPage);

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
        } else {
            this._pages[pageIndex].getContent().then(content => {
                if (!this.pages) {
                    return;
                }

                // prevent overwriting of current page by loaded content (TFS 415797)
                if (isContinuous || (this._targetRenderPageIndex === pageIndex)) {
                    var svg = content;
                    _removeChildren(viewPage);
                    viewPage.appendChild(svg);
                    this._setPageTransform(viewPage, pageIndex);

                    this._onPageLoaded(pageIndex, viewPage);
                }
                promise.resolve(pageIndex);
            }).catch(reason => {
                loadingDiv.innerHTML = _getErrorMessage(reason);
            });
        }

        return promise;
    }

    //Reserve blank view page for render.
    _reserveViewPage() {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    _getViewPortHeight(): number {
        var style = this._pagesWrapper['currentStyle'] || window.getComputedStyle(this._pagesWrapper);
        return this.hostElement.offsetHeight - parseFloat(style.marginBottom) - parseFloat(style.marginTop);
    }

    _getViewPortWidth(): number {
        var style = this._pagesWrapper['currentStyle'] || window.getComputedStyle(this._pagesWrapper);
        return this.hostElement.offsetWidth - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
    }

    _setPageTransform(viewPage: HTMLDivElement, pageIndex: number): void {
        var g: SVGGElement, svg: SVGElement;
        if (!viewPage || pageIndex < 0) {
            return;
        }

        var size = this._getPageSize(pageIndex);
        var rotateAngle = this._pages[pageIndex].rotateAngle;
        viewPage.style.height = size.height.valueInPixel * this._zoomFactor + 'px';
        viewPage.style.width = size.width.valueInPixel * this._zoomFactor + 'px';
        g = <SVGGElement>viewPage.querySelector('g');
        if (g) {
            (<SVGElement>g.parentNode).setAttribute('height', size.height.valueInPixel * this._zoomFactor + 'px');
            (<SVGElement>g.parentNode).setAttribute('width', size.width.valueInPixel * this._zoomFactor + 'px');
            _transformSvg(<SVGElement>g.parentNode, this._pages[pageIndex].size.width.valueInPixel, this._pages[pageIndex].size.height.valueInPixel, this._zoomFactor, rotateAngle);
        }
    }

    _addViewPage(): HTMLDivElement {
        var viewPage = document.createElement('div');
        viewPage.className = 'wj-view-page';
        _addEvent(viewPage, 'mousedown', (e) => {
            if (!this._panMode) {
                return;
            }
            this._startPanning(e);
        });
        _addEvent(viewPage, 'dragstart', (e) => {
            if (!this._panMode) {
                return;
            }
            e.preventDefault();
        });
        this._pagesWrapper.appendChild(viewPage);

        return viewPage;
    }

    _getPageSize(pageIndex: number): _ISize {
        if (pageIndex < 0 || pageIndex >= this._pages.length) {
            return null;
        }

        var page = this._pages[pageIndex];
        return _getRotatedSize(page.size, page.rotateAngle);
    }

    _render(pageIndex: number): IPromise {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    _moveToPagePosition(position: _IDocumentPosition) {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    _updatePageViewTransform() {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    _updatePageIndex(index: number) {
        if (!this.pages) {
            return;
        }

        index = this.resolvePageIndex(index);
        if (this._pageIndex === index) {
            return;
        }

        this._pageIndex = index;
        this._onPageIndexChanged();
    }

    //Move to the top position of specified page.
    //If specified page is not rendered, this method will render page first.
    moveToPage(pageIndex: number): IPromise {
        return this.moveToPosition({
            pageIndex: pageIndex
        });
    }

    resolvePageIndex(pageIndex: number): number {
        return Math.min((this.pages || []).length - 1, Math.max(pageIndex, 0));
    }

    //Move to specified position {@link _IDocumentPosition}.
    //If specified page is not rendered, this method will render page first.
    moveToPosition(position: _IDocumentPosition): IPromise {
        if (!(<_Promise>this._movingPromise).isFinished) {
            (<_Promise>this._movingPromise).cancel();
        }
        this._movingPromise = new _Promise();

        var pageIndex = position.pageIndex || 0,
            curPageIndex = this.pageIndex;

        if (!this.pages || pageIndex < 0) {
            (<_Promise>this._movingPromise).resolve(pageIndex);
            return this._movingPromise;
        }

        pageIndex = this.resolvePageIndex(pageIndex);
        position.pageIndex = pageIndex;
        if (pageIndex !== curPageIndex) {
            this._updatePageIndex(pageIndex);
            this._movingPromise = this._render(pageIndex);
        } else {
            (<_Promise>this._movingPromise).resolve(pageIndex);
        }

        return this._movingPromise
            .then(() => {
                if (this.pages) {
                    (<IInnerDocumentPosition>position).samePage = pageIndex === curPageIndex;
                    this._moveToPagePosition(position);
                }
            })
            .then(_ => {
                // The promise value is page number in single view mode,
                // but may be array of page numbers in continuous view mode.
                return pageIndex;
            }).then(() => {
                this._calcZoomModeZoom();
                this._onPositionChanged();
            });
    }

    private _calcZoomModeZoom(zoomMode?: ZoomMode) {
        this._zoomModeUpdating = true;
        zoomMode = zoomMode == null ? this.zoomMode : zoomMode;
        switch (zoomMode) {
            case ZoomMode.PageWidth:
                this._zoomToViewWidth();
                break;
            case ZoomMode.WholePage:
                this._zoomToView();
                break;
        }
        this._zoomModeUpdating = false;
    }

    _zoomToView() {
        const pageSize = this._getPageSize(this.pageIndex);
        if (!pageSize) {
            return;
        }
        this.zoomFactor = this._calcZoomToViewFactor();
    }

    private _calcZoomToViewFactor(): number {
        const viewHeight = this._getViewPortHeight();
        const viewWidth = this._getViewPortWidth();
        const pageSize = this._getPageSize(this.pageIndex);
        return Math.min(viewHeight / pageSize.height.valueInPixel, viewWidth / pageSize.width.valueInPixel)
    }

    _zoomToViewWidth() {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    protected _calcZoomToViewWidthFactor(): number {
        throw wijmo.culture.Viewer.abstractMethodException;
    }


    _getTransformedPoint(pageIndex: number, top: number, left: number): wijmo.Point {
        top /= this.zoomFactor;
        left /= this.zoomFactor;

        var currentPage = this.pages[pageIndex],
            size = currentPage.size,
            rotateAngle = currentPage.rotateAngle;

        switch (rotateAngle) {
            case _RotateAngle.Rotation90:
                var tmpTop = top;
                top = size.height.valueInPixel - left;
                left = tmpTop;
                break;
            case _RotateAngle.Rotation180:
                top = size.height.valueInPixel - top;
                left = size.width.valueInPixel - left;
                break;
            case _RotateAngle.Rotation270:
                var tmpTop = top;
                top = left;
                left = size.width.valueInPixel - tmpTop;
                break;
        }

        return new wijmo.Point(left, top);
    }

    _hitTestPagePosition(pnt: _IPageHitTestInfo): _IHitTestInfo {
        if (!pnt || pnt.pageIndex < 0) {
            return null;
        }

        var top = pnt.y,
            left = pnt.x,
            pageIndex = pnt.pageIndex;

        top -= _PageViewBase._pageMargin + _PageViewBase._pageBorderWidth;
        left -= _PageViewBase._pageMargin + _PageViewBase._pageBorderWidth;

        var transformedPoint = this._getTransformedPoint(pnt.pageIndex, top, left);
        top = transformedPoint.y;
        left = transformedPoint.x;

        var pageY = _pixelToTwip(top),
            pageX = _pixelToTwip(left),
            size = this.pages[pageIndex].size,
            hitWorkingArea = top >= 0 && top <= size.height.valueInPixel &&
                left >= 0 && left <= size.width.valueInPixel;

        return {
            pageIndex: pageIndex,
            x: pageX,
            y: pageY,
            hitWorkingArea: hitWorkingArea // no margins
        };
    }

    rotatePageTo(pageIndex: number, rotateAngle: _RotateAngle) {
        var currentPage = this._pages[pageIndex];
        currentPage.rotateAngle = rotateAngle;
        this._updatePageViewTransform();
        this._onRotateAngleChanged();
    }

    hitTest(clientX: number, clientY: number): _IHitTestInfo {
        if (this._pointInViewPanelClientArea(clientX, clientY)) {
            var point = this._panelViewPntToPageView(clientX, clientY);
            return this._hitTestPagePosition(point);
        }

        return null;
    }

    resetPages() {
        this._pageIndex = -1;
        this._pages = null;
        _removeChildren(this._pagesWrapper);
        this._addViewPage();
        this.invalidate();
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);

        this._autoHeightCalculated = false;
        if (!this.pages || this.pages.length == 0 ||
            this.pageIndex < 0 || this.pageIndex >= this.pages.length) {
            return;
        }
        this._render(this.pageIndex);
        this._calcZoomModeZoom();
    }

    isPageContentLoaded(pageIndex: number): boolean {
        var p = this.pages;
        return (!!p && (pageIndex >= 0) && (pageIndex < p.length) && !!p[pageIndex].content);
    }

    protected _hitTestPageIndex(top: number): number {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    protected _pointInViewPanelClientArea(clientX: number, clientY: number): boolean {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    protected _panelViewPntToPageView(clientX: number, clientY: number): _IPageHitTestInfo {
        throw wijmo.culture.Viewer.abstractMethodException;
    }
}
    }
    


    module wijmo.viewer {
    











'use strict';

export class _ContinuousPageView extends _PageViewBase {
    private static _preFetchPageCount: number = 3;
    private _swipeSpeedReducer: _SpeedReducer;
    private _disposeBodyStopSwipe: Function;

    private _scrollingTimer: any;
    private _zoomFactorTimer: any;

    constructor(element: any) {
        super(element);
        wijmo.addClass(element, "wj-pageview-continuous");
    }

    _init(): void {
        super._init();

        _addEvent(this.hostElement, 'click', e => {
            this.hostElement.focus();
        });

        _addEvent(this.hostElement, 'scroll', () => {
            this._onPositionChanged();

            clearTimeout(this._scrollingTimer);
            this._scrollingTimer = setTimeout(() => {
                this._ensurePageIndexPosition();
            }, 200);
        });

        this.zoomFactorChanged.addHandler(() => {
            clearTimeout(this._zoomFactorTimer);
            this._zoomFactorTimer = setTimeout(() => {
                // The current page can change after zooming (#261618)
                this._ensurePageIndexPosition();
            }, 200);
        });
    }

    dispose() {
        clearTimeout(this._scrollingTimer);
        clearTimeout(this._zoomFactorTimer);

        if (this._disposeBodyStopSwipe) {
            this._disposeBodyStopSwipe();
        }

        super.dispose();
    }

    _stopSwip() {
        if (this._swipeSpeedReducer) {
            this._swipeSpeedReducer.stop();
        }
    }

    _bindTouchEvents(touchManager: _TouchManager) {
        super._bindTouchEvents(touchManager);

        touchManager.touchStart.addHandler(this._stopSwip, this);
        touchManager.swipe.addHandler((sender, args: _SwipeEventArgs) => {
            if (!this._swipeSpeedReducer) this._swipeSpeedReducer = new _SpeedReducer();
            this._swipeSpeedReducer.start(args.speed.x, args.speed.y, (x, y) => {
                var oldLeft = touchManager.hostElement.scrollLeft,
                    oldTop = touchManager.hostElement.scrollTop;
                touchManager.hostElement.scrollLeft -= x;
                touchManager.hostElement.scrollTop -= y;
                if (oldLeft == touchManager.hostElement.scrollLeft
                    && oldTop == touchManager.hostElement.scrollTop) {
                    this._stopSwip();
                }
            });
        });

        var bodyTouchManager = new _TouchManager(document.body, false),
            stopSwip = this._stopSwip.bind(this);
        _addEvent(document.body, 'mousedown', stopSwip, true);
        bodyTouchManager.touchStart.addHandler(stopSwip);
        this._disposeBodyStopSwipe = () => {
            this._stopSwip();
            _removeEvent(document.body, 'mousedown', stopSwip);
            bodyTouchManager.touchStart.removeHandler(stopSwip);
            bodyTouchManager.dispose();
            this._disposeBodyStopSwipe = null;
        };
    }

    _getAbovePageCount(top: number): number {
        return this._hitTestPageIndex(top);
    }

    refresh(fullUpdate?: boolean) {
        this._stopSwip();
        super.refresh(fullUpdate);
    }

    protected _hitTestPageIndex(top: number): number {
        if (!this.pages) {
            return this.pageIndex;
        }

        var index = 0, pageEndPosition = 0;
        for (; index < this.pages.length; index++) {
            pageEndPosition += this._getPageSize(index).height.valueInPixel * this.zoomFactor + _PageViewBase._pageMargin;

            if (top < pageEndPosition) {
                if (pageEndPosition - top < 1) { // Guess that scrollTop value is always an integer (#261618)
                    continue;
                }

                break;
            }
        }

        return Math.min(index, this.pages.length - 1);
    }

    _guessPageIndex(): number {
        var result: number;

        // If the maximum scrollTop value is reached
        if (this.pages && (this.hostElement.scrollHeight - this.hostElement.clientHeight <= this.hostElement.scrollTop)) {
            result = this.pages.length - 1;
        } else {
            result = this._hitTestPageIndex(this.hostElement.scrollTop);
        }

        return result;
    }

    _render(pageIndex: number): IPromise {
        var pageCount = this.pages.length,
            start = pageIndex - _ContinuousPageView._preFetchPageCount, end = pageIndex + _ContinuousPageView._preFetchPageCount,
            promises: IPromise[] = [];
        start = start < 0 ? 0 : start;
        end = end > pageCount - 1 ? pageCount - 1 : end;
        for (var i = start; i <= end; i++) {
            promises.push(this._renderViewPage(<HTMLDivElement>this._pagesWrapper.querySelectorAll('.wj-view-page').item(i), i, true));
        }

        return new _CompositedPromise(promises);
    }

    _moveToPagePosition(position: _IDocumentPosition) {
        this._stopSwip();
        var pageHeight, scrollTop = 0, scrollLeft = 0,
            moveToPage = !position.pageBounds,
            bound: _IRect = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 },
            margin = moveToPage ? 0 : _PageViewBase._pageMargin, // if navigate to page then should scroll to the top of page container
            currentPage = this.pages[this.pageIndex];

        for (var index = 0; index < position.pageIndex; index++) {
            pageHeight = this._getPageSize(index).height.valueInPixel * this.zoomFactor;
            scrollTop += pageHeight + _PageViewBase._pageMargin;

            if (!this._borderBoxMode) {
                scrollTop += _PageViewBase._pageBorderWidth * 2;
            }
        }

        var offsetPoint = _getTransformedPosition(bound, currentPage.size,
            moveToPage
                ? _RotateAngle.NoRotate // The physical beginning of the page
                : currentPage.rotateAngle, // Taking rotation into account will give us the logical beginning of the page.
            this.zoomFactor);

        scrollTop += offsetPoint.y + margin + 1; // +1 to fully hide previous page from viewport for correct current page defining
        scrollLeft += offsetPoint.x + margin;
        scrollLeft += this._getPageViewOffsetLeft(position.pageIndex); // The page view element can be shifted relative to _pagesWrapper if the pages have different orientations (widths).

        this.hostElement.scrollTop = scrollTop;
        this.hostElement.scrollLeft = scrollLeft;
    }

    protected _pointInViewPanelClientArea(clientX: number, clientY: number): boolean {
        return (clientX >= 0) &&
            (clientY >= 0) &&
            // ignore scroll bars
            (clientX < this.hostElement.clientWidth) &&
            (clientY < this.hostElement.clientHeight);
    }

    protected _panelViewPntToPageView(clientX: number, clientY: number): _IPageHitTestInfo {
        var top = this.hostElement.scrollTop + clientY,
            left = 0;

        if (this.hostElement.scrollLeft > 0) {
            left = this.hostElement.scrollLeft + clientX;
        } else {
            var containerRect = this.hostElement.getBoundingClientRect(),
                wrapperRect = this._pagesWrapper.getBoundingClientRect();
            left = clientX - (wrapperRect.left - containerRect.left) + _PageViewBase._pageMargin;
        }

        var hitPageIndex = this._hitTestPageIndex(top);
        if (hitPageIndex < 0) {
            return null;
        }

        left -= this._getPageViewOffsetLeft(hitPageIndex); // The page view element can be shifted relative to _pagesWrapper if the pages have different orientations (widths)

        for (var index = 0; index < hitPageIndex; index++) {
            top -= this._getPageSize(index).height.valueInPixel * this.zoomFactor
                + _PageViewBase._pageMargin;

            if (!this._borderBoxMode) {
                top -= _PageViewBase._pageBorderWidth * 2;
            }
        }

        return { x: left, y: top, pageIndex: hitPageIndex };
    }

    _reserveViewPage() {
        _removeChildren(this._pagesWrapper);

        for (var i = 0; i < (this.pages || []).length; i++) {
            var viewPage = this._addViewPage(), size = this._getPageSize(i);
            viewPage.style.height = size.height.valueInPixel * this.zoomFactor + 'px';
            viewPage.style.width = size.width.valueInPixel * this.zoomFactor + 'px';
        }
    }

    _updatePageViewTransform() {
        if (!this.pages || !this.pages.length) {
            return;
        }

        var viewPages: NodeList;
        viewPages = this._pagesWrapper.querySelectorAll('.wj-view-page');
        for (var i = 0; i < viewPages.length; i++) {
            this._setPageTransform(<HTMLDivElement>viewPages.item(i), i);
        }
    }

    _zoomToViewWidth() {
        if (!this.pages || this.pages.length == 0) {
            return;
        }
        this.zoomFactor = this._calcZoomToViewWidthFactor();
    }

    protected _calcZoomToViewWidthFactor(): number {
        let viewHeight = this._getViewPortHeight();
        let viewWidth = this._getViewPortWidth();
        let maxPageWidth = 0;
        let totalPageHeight = 0;
        for (let i = 0; i < this.pages.length; i++) {
            let size = this._getPageSize(i);
            if (size.width.valueInPixel > maxPageWidth) {
                maxPageWidth = size.width.valueInPixel;
            }
            totalPageHeight += size.height.valueInPixel;
        }
        if (viewWidth / maxPageWidth > viewHeight / totalPageHeight) {
            viewWidth -= _Scroller.getScrollbarWidth();
        }
        return viewWidth / maxPageWidth;
    }

    private _ensurePageIndexPosition(): void {
        var currentPageIndex = this._guessPageIndex();
        if (this.pageIndex !== currentPageIndex) {
            this._render(currentPageIndex);
            this._updatePageIndex(currentPageIndex);
        }
    }

    private _getPageViewOffsetLeft(pageIndex: number): number {
        var viewPage = <HTMLElement>this._pagesWrapper.querySelectorAll('.wj-view-page').item(pageIndex);
        if (viewPage) {
            // The page view element can be shifted relative to _pagesWrapper if the pages have different widths.
            return viewPage.offsetLeft - this._pagesWrapper.offsetLeft;
        }

        return 0;
    }
}
    }
    


    module wijmo.viewer {
    











'use strict';

export class _SinglePageView extends _PageViewBase {
    private _pagesContainer: HTMLElement;
    private _vscroller: HTMLElement;
    private _desiredPageScrollTop: number;
    private _innerNavigating: boolean = false;
    private _virtualScrollMode: boolean = true;

    static controlTemplate =
        '<div class="wj-pageview-pagescontainer" wj-part="pages-container" tabindex="0">' +
        '   <div class="wj-pages-wrapper" wj-part="pages-wrapper"></div>' +
        '</div>' +
        '<div class="wj-pageview-vscroller" wj-part="vscroller" tabindex="-1"></div> ';

    constructor(element: any) {
        super(element);
        wijmo.addClass(element, "wj-pageview-single");
    }

    // override
    _init() {
        super._init();
        this._initScroller();
        this._initEvents();
    }

    private _initScroller() {
        var scroller = new _VScroller(this._vscroller);
        scroller.valueChanged.addHandler(() => {
            // need handle the scroll on timeout, 
            // seems cannot get the correct scrollTop for the last scrolling.
            setTimeout(() => this._doScrollerValueChanged());
        });
    }

    private _initEvents() {
        _addEvent(this._pagesContainer, 'wheel', (e) => {
            this._doContainerWheel(e);
        });
        _addEvent(this._pagesContainer, 'scroll', (e) => {
            this._doContainerScroll();
        });
        _addEvent(this._pagesContainer, 'keydown', e => {
            this._doContainerKeyDown();
        });
        _addEvent(this._pagesContainer, 'click', e => {
            this._pagesContainer.focus();
        });
    }

    _bindTouchEvents(touchManager: _TouchManager) {
        super._bindTouchEvents(touchManager);

        touchManager.swipe.addHandler((sender, args: _SwipeEventArgs) => {
            switch (args.direction) {
                case _TouchDirection.Down:
                    var preIndex = this.resolvePageIndex(this.pageIndex - 1);
                    if (preIndex != this.pageIndex) {
                        this.moveToPage(preIndex);
                    }
                    break;
                case _TouchDirection.Up:
                    var nextIndex = this.resolvePageIndex(this.pageIndex + 1);
                    if (nextIndex != this.pageIndex) {
                        this.moveToPage(nextIndex);
                    }
                    break;
            }
        });
    }

    // override
    _getTemplateParts(): object {
        return {
            _pagesWrapper: 'pages-wrapper',
            _pagesContainer: 'pages-container',
            _vscroller: 'vscroller'
        };
    }

    applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
        var host = this.hostElement;
        wijmo.addClass(host, css);
        host.appendChild(_toDOMs(tpl));

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
    }

    // whether enable the virtual scroller.
    get virtualScrollMode(): boolean {
        return this._virtualScrollMode;
    }
    set virtualScrollMode(value: boolean) {
        if (this._virtualScrollMode === value) {
            return;
        }
        this._virtualScrollMode = value;
        this.invalidate();
    }

    // whether the virtual scroller is visible.
    get _isScrollerVisible(): boolean {
        return this._virtualScrollMode && this.pages && this.pages.length > 1;
    }

    // the vertical virtual scroller
    get _scroller(): _VScroller {
        return <_VScroller>wijmo.Control.getControl(this._vscroller);
    }

    get _hasPageVScrollBar(): boolean {
        return this._hasScrollbar(this._pagesContainer);
    }

    get _hasPageHScrollBar() {
        return this._hasScrollbar(this._pagesContainer, true);
    }

    // override 
    _getPagesContainer(): HTMLElement {
        return this._pagesContainer;
    }

    // get the height of the page, add margins, does not consider the zoom.
    _getPageHeightWithoutZoom(pageIndex: number): number {
        var minHeigth = this._pagesContainer.clientHeight;
        var pageHeight = this._getPageSize(pageIndex).height.valueInPixel + _PageViewBase._pageMargin * 2;
        return Math.max(pageHeight, minHeigth);
    }

    private _hasScrollbar(element: Element, isHorizontal?: boolean): boolean {
        if (isHorizontal) {
            return element.scrollWidth > element.clientWidth;
        } else {
            return element.scrollHeight > element.clientHeight;
        }
    }

    // update the scroller's height and value.
    // the max value is the sum of all page's height.
    private _updateScroller() {
        if (!this._isScrollerVisible) return;

        var scroller = this._scroller;
        scroller.height = this._pagesContainer.clientHeight;

        var maxValue = 0;
        // add the sum of all page's height.
        for (var index = 0; index < this.pages.length; index++) {
            maxValue += this._getPageHeightWithoutZoom(index);
        }
        scroller.max = maxValue;

        this._updateScrollerValue();
    }

    // update the scroller's value based on the current page index and the scrolling position of current page.
    _updateScrollerValue() {
        if (!this._isScrollerVisible) return;

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
    }

    _doScrollerValueChanged() {
        if (!this._isScrollerVisible) return;

        var scroller = this._scroller;
        var pageCount = this.pages.length;
        var value = scroller.value;

        var pageIndex = 0, pagePercent = 1;
        for (; pageIndex < pageCount; pageIndex++) {
            var pageHeight = this._getPageHeightWithoutZoom(pageIndex);
            if (value > pageHeight) {
                value -= pageHeight;
                continue;
            } else {
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
    }

    _doContainerWheel(e: WheelEvent) {
        if (!this._isScrollerVisible) return;

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
            } else {
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
        } else {
            this._innerMoveToNextPageAtTop(e);
        }
    }

    _doContainerScroll() {
        if (!this._isScrollerVisible) return;

        // bypass the scroll if it is caused by setting scrollTop
        if (this._pagesContainer.scrollTop == this._desiredPageScrollTop) {
            return;
        }

        // sync the scroll position from viewpage to scroller.
        this._updateScrollerValue();
        this._onPositionChanged();
    }

    _doContainerKeyDown() {
        if (!this._isScrollerVisible) return;

        var e = <KeyboardEvent>event;
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
        } else {
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
    }

    // prevent update the virtual scroller value.
    _preventContainerScroll() {
        this._desiredPageScrollTop = this._pagesContainer.scrollTop;
    }

    _innerMoveToPreviousPageAtBottom(e?: UIEvent) {
        if (this.pageIndex > 0) {
            if (e) {
                e.preventDefault();
            }
            this._innerMoveToPage(this.pageIndex - 1, 1);
            this._updateScrollerValue();
        }
    }

    _innerMoveToNextPageAtTop(e?: UIEvent) {
        if (this.pageIndex < this.pages.length - 1) {
            if (e) {
                e.preventDefault();
            }
            this._innerMoveToPage(this.pageIndex + 1, 0);
            this._updateScrollerValue();
        }
    }

    // move to the specified page and specified position.
    _innerMoveToPage(pageIndex: number, pagePercent: number) {
        this._innerNavigating = true;
        // set the pageBounds to null to prevent scroll to page top on page loaded.
        // the page scroll position is updated immediately after moving to the page.
        var position = { pageIndex: pageIndex };
        this.moveToPosition(position).then(_ => {
            this._innerMoveToPagePosition(pagePercent);
            this._innerNavigating = false;
        });
    }

    // move to the specified position in current page.
    _innerMoveToPagePosition(pagePercent: number) {
        if (!this._hasPageVScrollBar) {
            return;
        }

        var scrollTop = (this._pagesContainer.scrollHeight - this._pagesContainer.clientHeight) * pagePercent;
        this._pagesContainer.scrollTop = scrollTop;
        this._preventContainerScroll();
    }

    // override
    moveToPosition(position: _IDocumentPosition): IPromise {
        var promise = super.moveToPosition(position);

        // should update the scroller if the navigating is caused by outside (toolbar, outline, bookmark, etc).
        if (!this._innerNavigating) {
            this._updateScrollerValue();
        }

        return promise;
    }

    // implement abstract
    _moveToPagePosition(position: IInnerDocumentPosition) {
        var bound: _IRect = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 },
            //no pageBounds means navigate to page, should scroll to the top of page container.
            margin = position.pageBounds ? _PageViewBase._pageMargin : 0,
            currentPage = this.pages[this.pageIndex],
            offsetPoint = _getTransformedPosition(bound, currentPage.size, currentPage.rotateAngle, this.zoomFactor);

        if (!position.samePage) { // don't reset the scrollbars if being scrolling inside the same page (#349202, #351741).
            this._pagesContainer.scrollTop = offsetPoint.y + margin;
            this._pagesContainer.scrollLeft = offsetPoint.x + margin;
        }
    }

    protected _hitTestPageIndex(top: number): number {
        return this.pageIndex;
    }

    protected _pointInViewPanelClientArea(clientX: number, clientY: number): boolean {
        return (clientX >= 0) &&
            (clientY >= 0) &&
            // ignore scroll bars
            (clientX < this._pagesContainer.clientWidth) &&
            (clientY < this._pagesContainer.clientHeight);
    }

    protected _panelViewPntToPageView(clientX: number, clientY: number): _IPageHitTestInfo {
        if (this.pageIndex < 0) {
            return null;
        }

        var top = this._pagesContainer.scrollTop + clientY,
            left = 0;

        if (this._pagesContainer.scrollLeft > 0) {
            left = this._pagesContainer.scrollLeft + clientX;
        } else {
            var containerRect = this._pagesContainer.getBoundingClientRect(),
                wrapperRect = this._pagesWrapper.getBoundingClientRect();
            left = clientX - (wrapperRect.left - containerRect.left) + _PageViewBase._pageMargin;
        }

        return { x: left, y: top, pageIndex: this.pageIndex };
    }

    _render(pageIndex: number): IPromise {
        return this._renderViewPage(<HTMLDivElement>this._pagesWrapper.querySelector('.wj-view-page'), pageIndex, false);
    }

    _guessPageIndex(): number {
        return this.pageIndex;
    }

    _reserveViewPage() {
        _removeChildren(this._pagesWrapper);
        this._addViewPage();
        this.invalidate();
    }

    _updatePageViewTransform() {
        var viewPages: NodeList, viewPage: HTMLDivElement;

        viewPage = <HTMLDivElement>this._pagesWrapper.querySelector('.wj-view-page');
        this._setPageTransform(viewPage, this.pageIndex);
    }

    _onPageLoaded(pageIndex: number, pageElement: HTMLDivElement) {
        super._onPageLoaded(pageIndex, pageElement);
        this._updateScroller();
    }

    _onZoomFactorChanged(oldValue: number, newValue: number) {
        super._onZoomFactorChanged(oldValue, newValue);
        this._updateScroller();
    }

    _zoomToViewWidth() {
        const pageSize = this._getPageSize(this.pageIndex);
        if (!pageSize) {
            return;
        }
        this.zoomFactor = this._calcZoomToViewWidthFactor();
    }

    protected _calcZoomToViewWidthFactor(): number {
        let viewHeight = this._getViewPortHeight();
        let viewWidth = this._getViewPortWidth();
        const pageSize = this._getPageSize(this.pageIndex);
        const pageHeight = pageSize.height.valueInPixel;
        const pageWidth = pageSize.width.valueInPixel;
        if (viewWidth / pageWidth > viewHeight / pageHeight) {
            viewWidth -= _Scroller.getScrollbarWidth();
        }
        return viewWidth / pageWidth;
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);

        if (this._isScrollerVisible) {
            wijmo.addClass(this.hostElement, "virtual");
        } else {
            wijmo.removeClass(this.hostElement, "virtual");
        }

        this._updateScroller();
    }
}
    }
    


    module wijmo.viewer {
    













'use strict';

export class _CompositePageView extends wijmo.Control implements _IPageView {
    private _activePageView: _IPageView;
    private _singlePageView: HTMLElement;
    private _continuousPageView: HTMLElement;
    private _viewMode: ViewMode = ViewMode.Single;

    static controlTemplate =
        '<div class="wj-pageview" wj-part="single-pageview"></div>' +
        '<div class="wj-pageview" wj-part="continuous-pageview"></div>';

    constructor(element: any) {
        super(element);

        var tpl: string;
        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate('wj-viewpanel-container', tpl, {
            _singlePageView: 'single-pageview',
            _continuousPageView: 'continuous-pageview'
        });

        this._initPageView();
    }

    readonly pageIndexChanged = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    readonly zoomFactorChanged = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    readonly zoomModeChanged = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    readonly positionChanged = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    readonly rotateAngleChanged = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    readonly pageLoaded = new wijmo.Event<_CompositePageView, wijmo.EventArgs>();

    applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
        var host = this.hostElement;
        wijmo.addClass(host, css);
        host.appendChild(_toDOMs(tpl));

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
    }

    get pageIndex(): number {
        return this._activePageView.pageIndex;
    }

    get pages(): _Page[] {
        return this._activePageView.pages;
    }
    set pages(value: _Page[]) {
        this._activePageView.pages = value;
    }

    get zoomMode(): ZoomMode {
        return this._activePageView.zoomMode;
    }
    set zoomMode(value: ZoomMode) {
        this._activePageView.zoomMode = value;
    }

    get zoomFactor(): number {
        return this._activePageView.zoomFactor;
    }
    set zoomFactor(value: number) {
        this._activePageView.zoomFactor = value;
    }

    get panMode(): boolean {
        return this._activePageView.panMode;
    }
    set panMode(value: boolean) {
        this._activePageView.panMode = value;
    }

    get viewMode(): ViewMode {
        return this._viewMode;
    }
    set viewMode(value: ViewMode) {
        if (this._viewMode === value) {
            return;
        }
        this._viewMode = value;
        this._updateActivePageView();
    }

    get scrollTop(): number {
        return this._activePageView.scrollTop;
    }

    get scrollLeft(): number {
        return this._activePageView.scrollLeft;
    }

    get _activePageViewElement(): HTMLElement {
        return this.viewMode === ViewMode.Single ? this._singlePageView : this._continuousPageView;
    }

    onPageIndexChanged() {
        this.pageIndexChanged.raise(this);
    }

    onZoomFactorChanged(oldValue: number, newValue: number) {
        this.zoomFactorChanged.raise(this, { oldValue: oldValue, newValue: newValue });
    }

    onZoomModeChanged(oldValue: ZoomMode, newValue: ZoomMode) {
        this.zoomModeChanged.raise(this, { oldValue: oldValue, newValue: newValue });
    }

    onPositionChanged() {
        this.positionChanged.raise(this);
    }

    onRotateAngleChanged() {
        this.rotateAngleChanged.raise(this);
    }

    onPageLoaded(e: PageLoadedEventArgs) {
        this.pageLoaded.raise(this, e);
    }

    private _updateActivePageView() {
        var currentPageIndex = this._activePageView.pageIndex, pages = this._activePageView.pages,
            zoomFactor = this._activePageView.zoomFactor, zoomMode = this._activePageView.zoomMode,
            panMode = this._activePageView.panMode;
        this._removePageViewHandlers(this._activePageView);

        this._activePageView = <_PageViewBase>wijmo.Control.getControl(this._activePageViewElement);
        if (!this._activePageView.pages) {
            this._activePageView.pages = pages;
        }
        (<_PageViewBase>this._activePageView).invalidate();

        // firstly update page view ...
        this._updatePageViewsVisible();

        // ... then update view props to calculate zoom related data correctly
        this._activePageView.moveToPage(currentPageIndex);
        this._activePageView.zoomFactor = zoomFactor;
        this._activePageView.zoomMode = zoomMode;
        this._activePageView.panMode = panMode;

        // bind events after switching active page view to prevent unnecessary events during the switching
        this._addPageViewHandlers(this._activePageView);
    }

    private _initPageView(): void {
        this._activePageView = new _SinglePageView(this._singlePageView);
        this._addPageViewHandlers(this._activePageView);
        new _ContinuousPageView(this._continuousPageView);

        this._updatePageViewsVisible();
    }

    private _addPageViewHandlers(pageView: _IPageView) {
        this._activePageView.pageIndexChanged.addHandler(this._handlerPageIndexChanged);
        this._activePageView.zoomFactorChanged.addHandler(this._handlerZoomFactorChanged);
        this._activePageView.zoomModeChanged.addHandler(this._handlerZoomModeChanged);
        this._activePageView.positionChanged.addHandler(this._handlerPositionChanged);
        this._activePageView.rotateAngleChanged.addHandler(this._handlerRotateAngleChanged);
        this._activePageView.pageLoaded.addHandler(this._handlerPageLoaded);
    }

    // use arrow functions to correctly bind to this (binding with addHandler args is not working)
    private _handlerPageIndexChanged = () => this.onPageIndexChanged();
    private _handlerZoomFactorChanged = (sender, e: _IZoomFactorChangedEventArgs) => this.onZoomFactorChanged(e.oldValue, e.newValue);
    private _handlerZoomModeChanged = (sender, e: _IZoomModeChangedEventArgs) =>  this.onZoomModeChanged(e.oldValue, e.newValue);
    private _handlerPositionChanged = () => this.onPositionChanged();
    private _handlerRotateAngleChanged = () => this.onRotateAngleChanged();
    private _handlerPageLoaded = (sender, e: PageLoadedEventArgs) => this.onPageLoaded(e);

    private _removePageViewHandlers(pageView: _IPageView) {
        pageView.pageIndexChanged.removeHandler(this._handlerPageIndexChanged);
        pageView.zoomFactorChanged.removeHandler(this._handlerZoomFactorChanged);
        pageView.zoomModeChanged.removeHandler(this._handlerZoomModeChanged);
        pageView.positionChanged.removeHandler(this._handlerPositionChanged);
        pageView.rotateAngleChanged.removeHandler(this._handlerRotateAngleChanged);
        pageView.pageLoaded.removeHandler(this._handlerPageLoaded);
    }

    private _updatePageViewsVisible(): void {
        var showSingle = this.viewMode === ViewMode.Single;
        if (showSingle) {
            wijmo.removeClass(this._singlePageView, _hiddenCss);
            if (!wijmo.hasClass(this._continuousPageView, _hiddenCss)) {
                wijmo.addClass(this._continuousPageView, _hiddenCss);
            }
        } else {
            wijmo.removeClass(this._continuousPageView, _hiddenCss);
            if (!wijmo.hasClass(this._singlePageView, _hiddenCss)) {
                wijmo.addClass(this._singlePageView, _hiddenCss);
            }
        }
    }

    moveToPage(pageIndex: number): IPromise {
        return this._activePageView.moveToPage(pageIndex);
    }

    moveToPosition(position: _IDocumentPosition): IPromise {
        return this._activePageView.moveToPosition(position);
    }

    rotatePageTo(pageIndex: number, rotateAngle: _RotateAngle) {
        this._activePageView.rotatePageTo(pageIndex, rotateAngle);
    }

    hitTest(x: number, y: number): _IHitTestInfo {
        return this._activePageView.hitTest(x, y);
    }

    resetPages() {
        (<_PageViewBase>wijmo.Control.getControl(this._singlePageView)).resetPages();
        (<_PageViewBase>wijmo.Control.getControl(this._continuousPageView)).resetPages();
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);

        wijmo.Control.getControl(this._activePageViewElement).invalidate();
        this._activePageView.refresh();
    }

    isPageContentLoaded(pageIndex: number): boolean {
        return this._activePageView.isPageContentLoaded(pageIndex);
    }
}

    }
    


    module wijmo.viewer {
    





'use strict';

const _isIOS = typeof navigator !== 'undefined' && navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
const _svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve">';
const _svgEnd = '</svg>';
const _checkedCss = 'wj-state-active';
const _disabledCss = 'wj-state-disabled';

export const _commandTagAttr = 'command-tag';

export function isIOS(): boolean {
    return _isIOS;
}

export function _createSvgBtn(svgContent: string): HTMLElement {
    var svg = _toDOM(_svgStart + svgContent + _svgEnd);
    wijmo.addClass(svg, 'wj-svg-btn');
    var btn = document.createElement('a');
    btn.appendChild(svg);
    wijmo.addClass(btn, 'wj-btn');
    btn.tabIndex = 0;
    return btn;
}

export function _checkImageButton(button: HTMLElement, checked: boolean) {
    if (checked) {
        wijmo.addClass(button, _checkedCss);
        return;
    }

    wijmo.removeClass(button, _checkedCss);
}

export function _checkSeparatorShown(container: HTMLElement) {
    var groupEnd: boolean,
        hideSeparator = true,
        currentEle: HTMLElement,
        currentEleHidden: boolean,
        lastShowSeparator: HTMLElement;

    for (var i = 0; i < container.children.length; i++) {
        currentEle = <HTMLElement>container.children[i];
        groupEnd = wijmo.hasClass(currentEle, 'wj-separator');
        currentEleHidden = wijmo.hasClass(currentEle, _hiddenCss);

        if (!groupEnd && !currentEleHidden) {
            hideSeparator = false;
            continue;
        }

        if (groupEnd) {
            if (hideSeparator) {
                if (!currentEleHidden) {
                    wijmo.addClass(currentEle, _hiddenCss);
                }
            } else {
                if (currentEleHidden) {
                    wijmo.removeClass(currentEle, _hiddenCss);
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

export function _disableImageButton(button: HTMLElement, disabled: boolean) {
    if (disabled) {
        wijmo.addClass(button, _disabledCss);
        return;
    }

    wijmo.removeClass(button, _disabledCss);

    // remove disabled attr from input (TFS 467152)
    // disabled attr is set in Controll.isDisabled setter but is not reverted
    // as Viewer use the same css-class which checked in Controll.isDisabled setter
    if (button instanceof HTMLElement) {
        const disabledInputs = button.querySelectorAll('input[disabled]');
        for (let idx = 0; idx < disabledInputs.length; idx++) {
            (disabledInputs[idx] as HTMLInputElement).disabled = false;
        }

        // enable buttons (TFS 467374)
        const disabledButtons = button.querySelectorAll('button[disabled]');
        for (let idx = 0; idx < disabledButtons.length; idx++) {
            (disabledButtons[idx] as HTMLInputElement).disabled = false;
        }
    }
}

export function _getPositionByHitTestInfo(hitTestInfo: _IHitTestInfo): _IDocumentPosition {
    if (hitTestInfo) {
        return {
            pageIndex: hitTestInfo.pageIndex, pageBounds: { x: hitTestInfo.x, y: hitTestInfo.y, width: 0, height: 0 }
        };
    }

    return {
        pageIndex: 0, pageBounds: { x: 0, y: 0, width: 0, height: 0 }
    };
}

export function _setLandscape(pageSettings: _IPageSettings, landscape: boolean) {
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
    } else {
        pageSettings.leftMargin = pageSettings.topMargin;
        pageSettings.topMargin = pageSettings.rightMargin;
        pageSettings.rightMargin = pageSettings.bottomMargin;
        pageSettings.bottomMargin = left;
    }
}

export function _showImageButton(button: HTMLElement, visible: boolean) {
    if (visible) {
        wijmo.removeClass(button, _hiddenCss);
        return;
    }

    wijmo.addClass(button, _hiddenCss);
}

export function _isDisabledImageButton(button: HTMLElement): boolean {
    return wijmo.hasClass(button, _disabledCss);
}

export function _isCheckedImageButton(button: HTMLElement): boolean {
    return wijmo.hasClass(button, _checkedCss);
}

export function _toDOM(html: string): HTMLElement {
    return <HTMLElement>_toDOMs(html).firstChild;
}
    }
    


    module wijmo.viewer {
    





'use strict';

export class _Toolbar extends wijmo.Control {
    _toolbarWrapper: HTMLElement;
    private _toolbarContainer: HTMLElement;
    private _toolbarLeft: HTMLElement;
    private _toolbarRight: HTMLElement;
    private _toolbarMoveTimer: any;

    private static _moveStep = 4;
    private static _moveInterval = 5;
    private static _enabledCss = 'enabled';
    private _disposed = false;

    static controlTemplate = '<div class="wj-toolbar-move left" wj-part="toolbar-left">' +
        '<span class="wj-glyph-left"></span>' +
        '</div>' +
        '<div class="wj-toolbarcontainer" wj-part="toolbar-container">' +
        '<div class="wj-toolbarwrapper wj-btn-group" wj-part="toolbar-wrapper">' +
        '</div>' +
        '</div>' +
        '<div class="wj-toolbar-move right" wj-part="toolbar-right">' +
        '<span class="wj-glyph-right"></span>' +
        '</div>';

    constructor(element: any) {
        super(element);

        var tpl: string;
        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate('wj-toolbar', tpl, {
            _toolbarWrapper: 'toolbar-wrapper',
            _toolbarContainer: 'toolbar-container',
            _toolbarLeft: 'toolbar-left',
            _toolbarRight: 'toolbar-right'
        });

        _addEvent(this._toolbarLeft, 'mouseover', () => { this._scrollLeft(); });
        _addEvent(this._toolbarLeft, 'mouseout', () => { this._clearToolbarMoveTimer(); });

        _addEvent(this._toolbarRight, 'mouseover', () => { this._scrollRight(); });
        _addEvent(this._toolbarRight, 'mouseout', () => { this._clearToolbarMoveTimer(); });
    }

    applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
        var host = this.hostElement;
        wijmo.addClass(host, css);
        host.appendChild(_toDOMs(tpl));

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
    }

    dispose() {
        this._disposed = true;
        super.dispose();
    }

    private _clearToolbarMoveTimer() {
        if (this._toolbarMoveTimer != null) {
            clearTimeout(this._toolbarMoveTimer);
            this._toolbarMoveTimer = null;
        }
    }

    private _scrollRight() {
        var minLeft = this._toolbarContainer.offsetWidth - this._toolbarWrapper.offsetWidth,
            style = this._toolbarWrapper.style,
            oldLeft = style.left ? parseInt(style.left) : 0,
            newLeft = oldLeft - _Toolbar._moveStep;

        this._checkMoveButtonEnabled();
        if (newLeft < minLeft) {
            return;
        }

        style.left = newLeft + 'px';
        this._toolbarMoveTimer = setTimeout(() => this._scrollRight(), _Toolbar._moveInterval);
    }

    private _scrollLeft() {
        var style = this._toolbarWrapper.style,
            oldLeft = style.left ? parseInt(style.left) : 0,
            newLeft = oldLeft + _Toolbar._moveStep;

        this._checkMoveButtonEnabled();
        if (newLeft > 0) {
            return;
        }

        style.left = newLeft + 'px';
        this._toolbarMoveTimer = setTimeout(() => this._scrollLeft(), _Toolbar._moveInterval);
    }

    private _checkMoveButtonEnabled() {
        var leftBtnWidth = this._toolbarLeft.getBoundingClientRect().width,
            newLeft = this._toolbarWrapper.offsetLeft - leftBtnWidth + _Toolbar._moveStep,
            leftBtnEnabled = newLeft <= 0,
            leftBtnHasEnableClass = wijmo.hasClass(this._toolbarLeft, _Toolbar._enabledCss);
        if (leftBtnEnabled) {
            if (!leftBtnHasEnableClass) {
                wijmo.addClass(this._toolbarLeft, _Toolbar._enabledCss);
            }
        } else {
            if (leftBtnHasEnableClass) {
                wijmo.removeClass(this._toolbarLeft, _Toolbar._enabledCss);
            }
        }

        var rightBtnWidth = this._toolbarRight.getBoundingClientRect().width,
            minLeft = this._toolbarContainer.getBoundingClientRect().width - this._toolbarWrapper.getBoundingClientRect().width,
            newLeft = this._toolbarWrapper.offsetLeft - rightBtnWidth - _Toolbar._moveStep,
            rightBtnEnabled = newLeft >= minLeft,
            rightBtnHasEnabledClass = wijmo.hasClass(this._toolbarRight, _Toolbar._enabledCss);
        if (rightBtnEnabled) {
            if (!rightBtnHasEnabledClass) {
                wijmo.addClass(this._toolbarRight, _Toolbar._enabledCss);
            }
        } else if (rightBtnHasEnabledClass) {
            wijmo.removeClass(this._toolbarRight, _Toolbar._enabledCss);
        }
    }

    private _showToolbarMoveButton(show: boolean) {
        var visibility = show ? 'visible' : 'hidden';
        this._toolbarLeft.style.visibility = visibility;
        this._toolbarRight.style.visibility = visibility;
        this._checkMoveButtonEnabled();
    }

    _globalize() {
    }

    resetWidth() {
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
    }

    addSeparator(): HTMLElement {
        var element = document.createElement('span');
        element.className = 'wj-separator';
        this._toolbarWrapper.appendChild(element);
        return element;
    }

    svgButtonClicked = new wijmo.Event<_Toolbar, _IToolbarSvgButtonClickedEventArgs>();

    onSvgButtonClicked(e: _IToolbarSvgButtonClickedEventArgs) {
        this.svgButtonClicked.raise(this, e);
    }

    addCustomItem(element: any, commandTag?: any) {
        if (wijmo.isString(element)) {
            element = _toDOM(element);
        }

        if (commandTag != null) {
            element.setAttribute(_commandTagAttr, commandTag.toString());
        }

        this._toolbarWrapper.appendChild(element);
    }

    addSvgButton(title: string, svgContent: string, commandTag: any, isToggle?: boolean): HTMLElement {
        var button = _createSvgBtn(svgContent);
        button.title = title;
        button.setAttribute(_commandTagAttr, commandTag.toString());
        this._toolbarWrapper.appendChild(button);
        _addEvent(button, 'click,keydown', (event) => {
            var e = event || window.event,
                needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
            if (!needExe || _isDisabledImageButton(button) || (!isToggle && _isCheckedImageButton(button))) {
                return;
            }

            this.onSvgButtonClicked({ commandTag: commandTag });
        });

        return button;
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._globalize();
        }
    }
}
    }
    


    module wijmo.viewer {
    










'use strict';

export class _ViewerToolbarBase extends _Toolbar {
    private _viewer: ViewerBase;

    constructor(element: any, viewer: ViewerBase) {
        super(element);

        this._viewer = viewer;
        this._initToolbarItems();

        var update = () => this.isDisabled = !this._viewer._getDocumentSource();
        this._viewer._documentSourceChanged.addHandler(update);
        update();

        this._viewer._viewerActionStatusChanged.addHandler((sender, e: _IViewerActionChangedEventArgs) => {
            var action = e.action,
                actionElement = <HTMLElement>this.hostElement.querySelector('[command-tag="' + action.actionType.toString() + '"]');
            _checkImageButton(actionElement, action.checked);
            _disableImageButton(actionElement, action.disabled);
            _showImageButton(actionElement, action.shown);

            _checkSeparatorShown(this._toolbarWrapper);
        });
    }

    _initToolbarItems() {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    onSvgButtonClicked(e: _IToolbarSvgButtonClickedEventArgs) {
        super.onSvgButtonClicked(e);

        this._viewer._executeAction(parseInt(e.commandTag));
    }

    get viewer(): ViewerBase {
        return this._viewer;
    }

    static _initToolbarZoomValue(hostToolbar: HTMLElement, viewer: ViewerBase) {
        var toolbar = <_Toolbar>wijmo.Control.getControl(hostToolbar),
            zoomDiv = document.createElement('div'),
            zoomValueCombo: wijmo.input.ComboBox,
            temp: any, i: number, j: number,
            zoomValues = ViewerBase._defaultZoomValues;

        zoomDiv.className = 'wj-input-zoom';
        toolbar.addCustomItem(zoomDiv, _ViewerActionType.ZoomValue);
        zoomValueCombo = new wijmo.input.ComboBox(zoomDiv);
        zoomValueCombo.deferUpdate(() => {
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

        zoomValueCombo.selectedIndexChanged.addHandler(() => {
            if (zoomValueCombo.isDroppedDown) {
                var zoomFactor = zoomValueCombo.selectedValue;
                if (zoomFactor == null) {
                    var zoomFactorText = zoomValueCombo.text.replace(",", "");
                    zoomFactor = parseFloat(zoomFactorText);
                    if (isNaN(zoomFactor)) {
                        zoomFactor = 100;
                    }

                    zoomFactor = zoomFactor * 0.01
                }

                viewer.zoomFactor = zoomFactor;
            }
        });

        zoomValueCombo.textChanged.addHandler(() => {
            var zoomText = zoomValueCombo.text, zoomFactor: number;
            if (zoomText.length > 0) {
                zoomFactor = ViewerBase._zoomValuesParser(zoomText);
                if (!isNaN(zoomFactor)) {
                    viewer.zoomFactor = zoomFactor * 0.01;
                }
            }
        });

        // Fix keyboard and wheel zoomValue navigation when zoomValue is not in the zoomValueCombo items list.
        // (the zoomValueCombo navigation is not working properly due to ComboBox feature - see reopened C1WEB-26816)
        let prevZoomFactors = [viewer.zoomFactor];
        const selectZoomRange = (currentZoomFactor: number) => { // selects range from zoomValues.value where currentZoomFactor is in
            const zoomValuesLength = zoomValues.length;
            if (!zoomValuesLength) {
                return [currentZoomFactor, currentZoomFactor];
            }
            let minIdx = -1;
            for (let i = 0; i < zoomValuesLength; i++) {
                if (zoomValues[i].value > currentZoomFactor) {
                    minIdx = i - 1;
                    break;
                }
            }
            if (minIdx === -1) {
                const value = zoomValues[0].value;
                return [value, value];
            }
            if (minIdx === (zoomValuesLength - 1)) {
                const value = zoomValues[minIdx].value;
                return [value, value];
            }
            return [zoomValues[minIdx].value, zoomValues[minIdx + 1].value]
        }
        zoomValueCombo.hostElement.addEventListener('wheel', (e) => {
            // force zoomValueCombo navigation on wheel when current zoomValue is not in the zoomValueCombo items list
            if (zoomValueCombo.containsFocus() && (zoomValueCombo.selectedIndex < 0)) {
                const range = selectZoomRange(viewer.zoomFactor);
                viewer.zoomFactor = range[e.deltaY < 0 ? 0 : 1];
                e.preventDefault();
            }
        })
        zoomValueCombo.hostElement.addEventListener('keydown', (e) => {
            // force zoomValueCombo navigation on keyboard when current zoomValue is not in the zoomValueCombo items list
            if (zoomValueCombo.containsFocus()) {
                switch (e.keyCode) {
                    case wijmo.Key.Up:
                        if (zoomValues.map(x => x.value).indexOf(prevZoomFactors[1]) < 0) {
                            viewer.zoomFactor = selectZoomRange(prevZoomFactors[1])[0];
                        }
                        break;

                    case wijmo.Key.Down:
                        if (zoomValues.map(x => x.value).indexOf(prevZoomFactors[0]) < 0) {
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
        })

        const zoomInput = zoomDiv.querySelector('.wj-form-control');
        _addEvent(zoomInput, 'blur', (e) => {
            zoomValueCombo.text = ViewerBase._zoomValuesFormatter(viewer.zoomFactor);
        });
        _addEvent(zoomInput, 'keypress', (e) => {
            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) < 0) {
                e.preventDefault();
            }
        });

        viewer.zoomFactorChanged.addHandler((s, e: any) => {
            // remember only two previous zoomFactor values
            prevZoomFactors.push(viewer.zoomFactor);
            if (prevZoomFactors.length > 2) {
                prevZoomFactors.splice(0, 1);
            }

            // TFS 422501 - comment out condition
            // if (!zoomValueCombo.containsFocus()) {
            //     zoomValueCombo.text = Globalize.format(viewer.zoomFactor, 'p0');
            // }

            zoomValueCombo.text = ViewerBase._zoomValuesFormatter(viewer.zoomFactor);

            zoomValueCombo.isDroppedDown = false;
        });
    }

    static _initToolbarPageNumberInput(hostToolbar: HTMLElement, viewer: ViewerBase) {
        var toolbar = <_Toolbar>wijmo.Control.getControl(hostToolbar),
            pageNumberDiv = document.createElement('div'),
            pageCountSpan = document.createElement('span'),
            pageNumberInput: wijmo.input.InputNumber,
            updatePageNumber = () => {
                var documentSource = viewer._getDocumentSource();
                if (!documentSource || documentSource.pageCount == null) {
                    return;
                }
                pageNumberInput.value = viewer.pageIndex + 1;
            },
            updatePageCount = () => {
                var documentSource = viewer._getDocumentSource();
                if (!documentSource || documentSource.pageCount == null) {
                    return;
                }
                pageCountSpan.innerHTML = documentSource.pageCount.toString();
                pageNumberInput.max = documentSource.pageCount;
                pageNumberInput.min = Math.min(documentSource.pageCount, 1);

                updatePageNumber();
            },
            sourceChanged = () => {
                var documentSource = viewer._getDocumentSource();
                if (!documentSource) {
                    return;
                }
                updatePageCount();
                _addWjHandler(viewer._documentEventKey, documentSource.pageCountChanged, updatePageCount);
                _addWjHandler(viewer._documentEventKey, documentSource.loadCompleted, updatePageCount);
            };

        pageNumberDiv.className = 'wj-pagenumber';
        toolbar.addCustomItem(pageNumberDiv, _ViewerActionType.PageNumber);
        pageNumberInput = new wijmo.input.InputNumber(pageNumberDiv);
        pageNumberInput.format = 'n0';
        _addEvent(pageNumberDiv, 'keyup', (e) => {
            var event = e || window.event;
            if (event.keyCode === wijmo.Key.Enter) {
                viewer.moveToPage(pageNumberInput.value - 1);
            }
        });
        _addEvent(pageNumberInput.inputElement, 'blur', (e) => {
            viewer.moveToPage(pageNumberInput.value - 1);
        });

        toolbar.addCustomItem('<span class="slash">/</span>');
        pageCountSpan.className = 'wj-pagecount';
        toolbar.addCustomItem(pageCountSpan, _ViewerActionType.PageCountLabel);
        viewer.pageIndexChanged.addHandler(updatePageNumber);
        if (viewer._getDocumentSource()) {
            sourceChanged();
        }
        viewer._documentSourceChanged.addHandler(sourceChanged);
    }
}

    }
    


    module wijmo.viewer {
    





'use strict';

export class _SideTabs extends wijmo.Control {
    private _headersContainer: HTMLElement;
    private _contentsContainer: HTMLElement;
    private _idCounter = 0;
    private _tabPages: _TabPage[] = [];
    private _tabPageDic = {};

    readonly tabPageActived = new wijmo.Event<_SideTabs, wijmo.EventArgs>();
    readonly tabPageVisibilityChanged = new wijmo.Event<_SideTabs, wijmo.EventArgs>();
    readonly expanded = new wijmo.Event<_SideTabs, wijmo.EventArgs>();
    readonly collapsed = new wijmo.Event<_SideTabs, wijmo.EventArgs>();

    static _activedCss = 'active';
    static _collapsedCss = 'collapsed';

    static controlTemplate = '<ul class="wj-nav wj-btn-group" wj-part="wj-headers"></ul>' +
        '<div class="wj-tabcontent" wj-part="wj-contents"></div>';

    constructor(element: any) {
        super(element);
        var tpl = this.getTemplate();
        this.applyTemplate('wj-control', tpl, {
            _headersContainer: 'wj-headers',
            _contentsContainer: 'wj-contents'
        });
    }

    applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
        var host = this.hostElement;
        wijmo.addClass(host, css);
        host.appendChild(_toDOMs(tpl));

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
    }

    get tabPages(): _TabPage[] {
        return this._tabPages;
    }

    getTabPage(id: string): _TabPage {
        return this._tabPageDic[id];
    }

    getFirstShownTabPage(except?: _TabPage): _TabPage {
        var first: _TabPage;
        this._tabPages.some(i => {
            if (!i.isHidden && i !== except) {
                first = i;
                return true;
            }

            return false;
        });

        return first;
    }

    get visibleTabPagesCount(): number {
        var count = 0;
        this._tabPages.forEach((tabPage: _TabPage) => {
            if (!tabPage.isHidden) {
                count++;
            }
        });
        return count;
    }

    get activedTabPage(): _TabPage {
        var first: _TabPage;
        this._tabPages.some(i => {
            if (i.isActived) {
                first = i;
                return true;
            }

            return false;
        });

        return first;
    }

    removePage(page: string | _TabPage) {
        var tabPage: _TabPage;
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
            } else {
                this.collapse();
            }
        }

        this._headersContainer.removeChild(tabPage.header);
        this._contentsContainer.removeChild(tabPage.outContent);
    }

    addPage(title: string, svgIcon: string, index?: number): _TabPage {
        var id = this._getNewTabPageId(),
            header = document.createElement('li'),
            outContentHtml = '<div class="wj-tabpane">' +
                '<div class="wj-tabtitle-wrapper"><h3 class="wj-tabtitle">' + title + '</h3><span class="wj-close">×</span></div>' +
                '<div class="wj-tabcontent-wrapper"><div class="wj-tabcontent-inner"></div></div>' +
                '</div>',
            outContent = _toDOM(outContentHtml);

        var icon = _createSvgBtn(svgIcon);
        header.appendChild(icon);
        index = index == null ? this._tabPages.length : index;
        index = Math.min(Math.max(index, 0), this._tabPages.length);

        if (index >= this._tabPages.length) {
            this._headersContainer.appendChild(header);
            this._contentsContainer.appendChild(outContent);
        } else {
            this._headersContainer.insertBefore(header, this._tabPages[index].header);
            this._contentsContainer.insertBefore(outContent, this._tabPages[index].outContent);
        }

        _addEvent(outContent.querySelector('.wj-close'), 'click', () => {
            this.collapse();
        });

        _addEvent(header.querySelector('a'), 'click,keydown', e => {
            var currentTab = this.getTabPage(id);
            if (!currentTab) {
                return;
            }

            var needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
            if (!needExe) {
                return;
            }

            this.active(currentTab);
        })

        var tabPage = new _TabPage(outContent, header, id);
        if (index >= this._tabPages.length) {
            this._tabPages.push(tabPage);
        } else {
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
    }

    get isCollapsed(): boolean {
        return wijmo.hasClass(this.hostElement, _SideTabs._collapsedCss);
    }

    hide(page: string | _TabPage): void {
        var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
        if (!tabPage) {
            return;
        }

        if (wijmo.hasClass(tabPage.header, _hiddenCss)) {
            return;
        }

        wijmo.addClass(tabPage.header, _hiddenCss);
        this.onTabPageVisibilityChanged(tabPage);
        this.deactive(tabPage);
    }

    show(page: string | _TabPage): void {
        var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
        if (!tabPage) {
            return;
        }

        if (!wijmo.hasClass(tabPage.header, _hiddenCss)) {
            return;
        }

        wijmo.removeClass(tabPage.header, _hiddenCss);
        this.onTabPageVisibilityChanged(tabPage);

        if (!this.isCollapsed) {
            var actived = this.activedTabPage;
            if (!actived) {
                this.active(tabPage);
            }
        }
    }

    deactive(page: string | _TabPage): void {
        var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
        if (!tabPage || !tabPage.isActived) {
            return;
        }

        wijmo.removeClass(<HTMLElement>tabPage.outContent, _SideTabs._activedCss);
        _checkImageButton(<HTMLElement>tabPage.header.querySelector('a'), false);
        var shown = this.getFirstShownTabPage(tabPage);
        if (shown) {
            this.active(shown);
        } else {
            this.collapse();
        }
    }

    active(page: string | _TabPage): void {
        var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
        if (!tabPage) {
            return;
        }

        if (tabPage.isActived) {
            return;
        }

        this._clearActiveStyles();
        this.show(tabPage);
        wijmo.addClass(<HTMLElement>tabPage.outContent, _SideTabs._activedCss);
        _checkImageButton(<HTMLElement>tabPage.header.querySelector('a'), true);
        this.expand();
        this.onTabPageActived();
    }

    enable(page: string | _TabPage, value = true): void {
        var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
        if (tabPage) {
            tabPage.enable(value);
        }
    }

    enableAll(value = true): void {
        this._tabPages.forEach(page => {
            page.enable(value);
        });
    }

    onTabPageActived() {
        this.tabPageActived.raise(this);
    }

    onTabPageVisibilityChanged(tabPage: _TabPage) {
        this.tabPageVisibilityChanged.raise(this, { tabPage: tabPage });
    }

    onExpanded() {
        this.expanded.raise(this);
    }

    onCollapsed() {
        this.collapsed.raise(this);
    }

    collapse(): void {
        if (this.isCollapsed) {
            return;
        }

        this._clearActiveStyles();

        wijmo.addClass(this.hostElement, _SideTabs._collapsedCss);
        this.onCollapsed();
    }

    expand(): void {
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
    }

    toggle(): void {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    private _clearActiveStyles(): void {
        this._tabPages.forEach(i => {
            wijmo.removeClass(<HTMLElement>i.outContent, _SideTabs._activedCss);
            _checkImageButton(<HTMLElement>i.header.querySelector('a'), false);
        });
    }

    private _getNewTabPageId(): string {
        while (this._tabPageDic[(this._idCounter++).toString()]) {
        }

        return this._idCounter.toString();
    }
}

    }
    


    module wijmo.viewer {
    




'use strict';

export class _TabPage {
    private _header: HTMLElement;
    private _outContent: HTMLElement;
    private _content: HTMLElement;
    private _id: string;

    constructor(outContent: HTMLElement, header: HTMLElement, id: string) {
        this._header = header;
        this._outContent = outContent;
        this._content = <HTMLElement>outContent.querySelector('.wj-tabcontent-inner');
        this._id = id;
    }

    get isActived(): boolean {
        return wijmo.hasClass(this.outContent, _SideTabs._activedCss);
    }

    get isHidden(): boolean {
        return wijmo.hasClass(this.header, _hiddenCss);
    }

    get id(): string {
        return this._id;
    }

    get header(): HTMLElement {
        return this._header;
    }

    get content(): HTMLElement {
        return this._content;
    }

    get outContent(): HTMLElement {
        return this._outContent;
    }

    enable(value = true) {
        wijmo.enable(this._header, value);
        wijmo.enable(this._content, value);
    }

    format(customizer: (_TabPage: this) => void) {
        customizer(this);
    }
}
    }
    


    module wijmo.viewer {
    

export interface _ITabPageVisibilityChangedEventArgs {
    tabPage: _TabPage;
}
    }
    


    module wijmo.viewer {
    


    }
    


    module wijmo.viewer {
    








'use strict';

export class _PageSetupEditor extends wijmo.Control {
    private _divPaperKind: HTMLElement;
    private _divOrientation: HTMLElement;
    private _divMarginsLeft: HTMLElement;
    private _divMarginsTop: HTMLElement;
    private _divMarginsRight: HTMLElement;
    private _divMarginsBottom: HTMLElement;
    private _cmbPaperKind: wijmo.input.ComboBox;
    private _cmbOrientation: wijmo.input.ComboBox;
    private _numMarginsLeft: wijmo.input.InputNumber;
    private _numMarginsTop: wijmo.input.InputNumber;
    private _numMarginsRight: wijmo.input.InputNumber;
    private _numMarginsBottom: wijmo.input.InputNumber;
    private _uiUpdating = false;

    // globalizable elements
    private _gPaperKind: HTMLElement;
    private _gOrientation: HTMLElement;
    private _gMargins: HTMLElement;
    private _gLeft: HTMLElement;
    private _gRight: HTMLElement;
    private _gTop: HTMLElement;
    private _gBottom: HTMLElement;

    private _pageSettings: _IPageSettings;

    static controlTemplate = '<div>' +
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

    constructor(ele: any) {
        super(ele);

        // check dependencies
        var depErr = 'Missing dependency: _PageSetupEditor requires ';
        wijmo.assert(wijmo.input.ComboBox != null, depErr + 'wijmo.input.');

        var tpl: string;

        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate('wj-control', tpl, {
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

        let marginParms = {
            format: 'n2',
            min: 0,
            max: 4,
            step: .25,
            valueChanged: this._updateValue.bind(this)
        };

        this._numMarginsLeft = new wijmo.input.InputNumber(this._divMarginsLeft, marginParms);
        this._numMarginsRight = new wijmo.input.InputNumber(this._divMarginsRight, marginParms);
        this._numMarginsTop = new wijmo.input.InputNumber(this._divMarginsTop, marginParms);
        this._numMarginsBottom = new wijmo.input.InputNumber(this._divMarginsBottom, marginParms);

        this._cmbPaperKind = new wijmo.input.ComboBox(this._divPaperKind, {
            itemsSource: _enumToArray(_PaperKind),
            displayMemberPath: 'text',
            selectedValuePath: 'value',
            isEditable: false
        });
        this._cmbPaperKind.selectedIndexChanged.addHandler(this._updateValue, this);

        this._cmbOrientation = new wijmo.input.ComboBox(this._divOrientation, {
            itemsSource: [wijmo.culture.Viewer.portrait, wijmo.culture.Viewer.landscape],
            isEditable: false
        });
        this._cmbOrientation.selectedIndexChanged.addHandler(this._updateValue, this);

        this._globalize();
    }

    get pageSettings(): _IPageSettings {
        return this._pageSettings;
    }
    set pageSettings(pageSettings: _IPageSettings) {
        var value = this._clonePageSettings(pageSettings);
        this._pageSettings = value;
        this._updateUI();
        this._cmbPaperKind.focus();
    }

    private _globalize() {
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
    }

    private _updateValue() {
        if (this._uiUpdating) {
            return;
        }

        var pageSettings = this.pageSettings;
        if (pageSettings) {
            pageSettings.bottomMargin = new _Unit(this._numMarginsBottom.value, _UnitType.Inch);
            pageSettings.leftMargin = new _Unit(this._numMarginsLeft.value, _UnitType.Inch);
            pageSettings.rightMargin = new _Unit(this._numMarginsRight.value, _UnitType.Inch);
            pageSettings.topMargin = new _Unit(this._numMarginsTop.value, _UnitType.Inch);
            pageSettings.paperSize = this._cmbPaperKind.selectedValue;
            _setLandscape(pageSettings, this._cmbOrientation.text === wijmo.culture.Viewer.landscape);
            this._updateUI();
        }
    }

    private _clonePageSettings(src: _IPageSettings): _IPageSettings {
        if (!src) {
            return null;
        }

        var result = <_IPageSettings>{};
        result.height = src.height ? new _Unit(src.height) : null;
        result.width = src.width ? new _Unit(src.width) : null;
        result.bottomMargin = src.bottomMargin ? new _Unit(src.bottomMargin) : null;
        result.leftMargin = src.leftMargin ? new _Unit(src.leftMargin) : null;
        result.rightMargin = src.rightMargin ? new _Unit(src.rightMargin) : null;
        result.topMargin = src.topMargin ? new _Unit(src.topMargin) : null;
        result.landscape = src.landscape;
        result.paperSize = src.paperSize;
        return result;
    }



    _updateUI() {
        this._uiUpdating = true;
        var pageSettings = this.pageSettings,
            setMargin = (input: wijmo.input.InputNumber, unit: _Unit) => {
                input.value = _Unit.convertValue(unit.value, unit.units, _UnitType.Inch);
            };

        if (pageSettings) {
            this._cmbPaperKind.selectedIndex = this._findIndex(this._cmbPaperKind.itemsSource, item => item.value == pageSettings.paperSize);
            this._cmbOrientation.text = pageSettings.landscape ? wijmo.culture.Viewer.landscape : wijmo.culture.Viewer.portrait;
            setMargin(this._numMarginsLeft, pageSettings.leftMargin);
            setMargin(this._numMarginsRight, pageSettings.rightMargin);
            setMargin(this._numMarginsTop, pageSettings.topMargin);
            setMargin(this._numMarginsBottom, pageSettings.bottomMargin);
        }
        this._uiUpdating = false;
    }

    private _findIndex(list: any[], predicate: (any) => boolean) {
        let length = list.length >>> 0;
        let thisArg = arguments[1];
        let value;

        for (let i = 0; i < list.length; i++) {
            if (predicate(list[i])) {
                return i;
            }
        }
        return -1;
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._globalize();
        }
    }
}
    }
    


    module wijmo.viewer {
    

    }
    


    module wijmo.viewer {
    






'use strict';

export class _PageSetupDialog extends wijmo.input.Popup {

    private _pageSetupEditorElement: HTMLElement;
    private _btnClose: HTMLElement;
    private _btnCancel: HTMLElement;
    private _btnApply: HTMLElement;

    private _pageSetupEditor: _PageSetupEditor;

    // globalizable elements
    private _gHeader: HTMLElement;

    readonly applied = new wijmo.Event<_PageSetupDialog, wijmo.EventArgs>();

    static controlTemplate = '<div>' +
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

    constructor(ele: any) {
        super(ele);

        var tpl: string;
        this.modal = true;
        this.hideTrigger = wijmo.input.PopupTrigger.None;

        // instantiate and apply template
        tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content', tpl, {
            _gHeader: 'g-header',
            _pageSetupEditorElement: 'pagesetup-editor',
            _btnApply: 'btn-apply',
            _btnCancel: 'btn-cancel',
            _btnClose: 'a-close'
        });

        this._pageSetupEditor = new _PageSetupEditor(this._pageSetupEditorElement);

        this._globalize();

        this._addEvents();
    }

    get pageSettings(): _IPageSettings {
        return this._pageSetupEditor.pageSettings;
    }

    private _globalize() {
        var g = wijmo.culture.Viewer;
        this._gHeader.textContent = g.pageSetup;
        this._btnApply.textContent = g.ok;
        this._btnCancel.textContent = g.cancel;
    }

    private _addEvents(): void {
        var self = this;
        _addEvent(self._btnClose, 'click', () => {
            self.hide();
        });

        _addEvent(self._btnCancel, 'click', () => {
            self.hide();
        });

        _addEvent(self._btnApply, 'click', () => {
            self._apply();
            self.hide();
        });
    }

    private _apply(): void {
        this.onApplied();
    }

    private onApplied(): void {
        this.applied.raise(this);
    }

    showWithValue(pageSettings: _IPageSettings): void {
        this._pageSetupEditor.pageSettings = pageSettings;
        super.show();
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._globalize();
            this._pageSetupEditor.refresh();
        }
    }
}
    }
    


    module wijmo.viewer {
    


'use strict';

export class _MouseTool extends wijmo.Control {
    private _pageView: _IPageView;
    private _viewPanelContainer: HTMLElement;
    private _isActive: boolean;
    private _isStarted: boolean;
    private _startPnt: wijmo.Point;

    private _stopOnClientOut: boolean;

    private _css: string;
    private _activeCss: string;
    private _visibleCss: string;

    constructor(element: any, viewPanelContainer: HTMLElement, pageView: _IPageView, stopOnClientOut: boolean, css: string, activeCss: string, visibleCss: string) {
        super(element);

        this._stopOnClientOut = stopOnClientOut;

        this._css = css;
        this._activeCss = activeCss;
        this._visibleCss = visibleCss;

        this._pageView = pageView;
        this._viewPanelContainer = viewPanelContainer;

        this._initElement();
        this._bindEvents();
    }

    public activate() {
        if (!this._isActive) {
            this._isActive = true;
            wijmo.addClass(this._viewPanelContainer, this._activeCss);
        }
    }

    public deactivate() {
        if (this._isActive) {
            this._isActive = false;
            wijmo.removeClass(this._viewPanelContainer, this._activeCss);
        }
    }

    public reset() {
        this._innerStop(null); // cancel action
    }

    public get isActive() {
        return this._isActive;
    }

    public get startPnt() {
        return this._startPnt;
    }

    public get pageView() {
        return this._pageView;
    }

    public get viewPanelContainer() {
        return this._viewPanelContainer;
    }

    protected _initElement() {
        this.applyTemplate(this._css, this.getTemplate(), this._getTemplateParts());
        this._viewPanelContainer.appendChild(this.hostElement);
    }

    protected _innerStop(pnt?: wijmo.Point) {
        try {
            this._stop(pnt);
        } finally {
            this._isStarted = false;
            this._startPnt = null;
        }
    }

    protected _getTemplateParts(): Object {
        return null;
    }

    protected _onMouseDown(e: MouseEvent): void {
        var pnt = this._toClientPoint(e),
            ht = this._testPageWorkingAreaHit(pnt);

        if (ht && this.pageView.isPageContentLoaded(ht.pageIndex)) {
            if (typeof (window.getSelection) != 'undefined') {
                getSelection().removeAllRanges(); //#277972 case 2 (Chrome)
            }
            this._isStarted = true;
            this._startPnt = pnt;
            this._start(ht);
        }
    }

    protected _onMouseMove(e: MouseEvent): void {
        if (!this._isStarted) {
            return;
        }

        var pnt = this._toClientPoint(e),
            ht = this._testPageWorkingAreaHit(pnt);

        if (ht && this.pageView.isPageContentLoaded(ht.pageIndex)) {
            this._move(pnt, ht);
        } else {
            if (this._stopOnClientOut) {
                this._stop(pnt);
            }
        }
    }

    protected _onMouseUp(e: MouseEvent) {
        if (!this._isStarted) {
            return;
        }

        this._innerStop(this._toClientPoint(e));
    }

    protected _start(ht: _IHitTestInfo) {
        wijmo.addClass(this.hostElement, this._visibleCss);
    }

    protected _move(pnt: wijmo.Point, ht: _IHitTestInfo) {
    }

    protected _stop(pnt?: wijmo.Point) {
        wijmo.removeClass(this.hostElement, this._visibleCss);
    }

    protected _bindEvents() {
        this.addEventListener(this._viewPanelContainer, 'mousedown', (e) => {
            if (this._isActive) {
                this._onMouseDown(e);
            }
        });

        this.addEventListener(this._viewPanelContainer, 'mousemove', (e) => {
            if (this._isActive) {
                this._onMouseMove(e);
            }
        });

        this.addEventListener(document, 'mouseup', (e) => {
            if (this._isActive) {
                this._onMouseUp(e);
            }
        });
    }

    protected _toClientPoint(e: MouseEvent): wijmo.Point {
        var clientRect = this._viewPanelContainer.getBoundingClientRect();
        return new wijmo.Point(e.clientX - clientRect.left, e.clientY - clientRect.top);
    }

    protected _testPageWorkingAreaHit(pnt: wijmo.Point): _IHitTestInfo {
        var hitTest = this._pageView.hitTest(pnt.x, pnt.y);
        return hitTest && hitTest.hitWorkingArea ? hitTest : null;
    }
}
    }
    


    module wijmo.viewer {
    





'use strict';

export class _Rubberband extends _MouseTool {
    readonly applied = new wijmo.Event<_Rubberband, _RubberbandOnAppliedEventArgs>();

    constructor(element: any, viewPanelContainer: HTMLElement, pageView: _IPageView) {
        super(element, viewPanelContainer, pageView, false, 'wj-rubberband', 'rubberband-actived', 'show');
    }

    protected _start(ht: _IHitTestInfo) {
        super._start(ht);

        this.hostElement.style.left = this.startPnt.x + 'px';
        this.hostElement.style.top = this.startPnt.y + 'px';
    }

    protected _move(pnt: wijmo.Point, ht: _IHitTestInfo) {
        if (this.startPnt) {
            var clientRect = this.viewPanelContainer.getBoundingClientRect();
            this.hostElement.style.width = pnt.x - this.startPnt.x + 'px';
            this.hostElement.style.height = pnt.y - this.startPnt.y + 'px';
        }
    }

    protected _stop(pnt?: wijmo.Point) {
        if (pnt) { // if the action was not cancelled
            var bandRect = this.hostElement.getBoundingClientRect();

            // rubberband should have at least 5x5 area.
            if (bandRect.width > 5 && bandRect.height > 5) {
                this._onApplied(new _RubberbandOnAppliedEventArgs(new wijmo.Rect(this.startPnt.x, this.startPnt.y, bandRect.width, bandRect.height)));
            }
        }

        this.hostElement.style.width = '0px';
        this.hostElement.style.height = '0px';

        super._stop(pnt);
    }

    private _onApplied(e: _RubberbandOnAppliedEventArgs) {
        this.applied.raise(this, e);
    }
}
    }
    


    module wijmo.viewer {
    








'use strict';

export class _Magnifier extends _MouseTool {
    static controlTemplate = '<div wj-part="view-page-div" class="wj-view-page"></div>';

    private readonly _Magnification = 2;

    private _viewPageDiv: HTMLDivElement;
    private _currentPageIndex = -1;

    constructor(element: any, viewPanelContainer: HTMLElement, pageView: _IPageView) {
        super(element, viewPanelContainer, pageView, true, 'wj-magnifier', 'magnifier-actived', 'show');
    }

    public deactivate() {
        super.deactivate();
        this._currentPageIndex = -1;
    }

    public reset() {
        super.reset();
        this._currentPageIndex = -1;
    }

    protected _getTemplateParts() {
        return {
            _viewPageDiv: 'view-page-div'
        };
    }

    protected _bindEvents() {
        super._bindEvents();

        var updateViewPage = () => {
            if (this._currentPageIndex < 0) {
                return;
            }
            var currentPage = this.pageView.pages[this._currentPageIndex],
                rotatedSize = _getRotatedSize(currentPage.size, currentPage.rotateAngle), svg = <SVGElement>this._viewPageDiv.querySelector('svg');

            this._viewPageDiv.style.height = rotatedSize.height.valueInPixel * this.pageView.zoomFactor * this._Magnification + 'px';
            this._viewPageDiv.style.width = rotatedSize.width.valueInPixel * this.pageView.zoomFactor * this._Magnification + 'px';

            svg.setAttribute('width', this._viewPageDiv.style.width);
            svg.setAttribute('height', this._viewPageDiv.style.height);
            _transformSvg(svg, currentPage.size.width.valueInPixel, currentPage.size.height.valueInPixel, this._Magnification * this.pageView.zoomFactor, currentPage.rotateAngle);
        };

        this.pageView.zoomFactorChanged.addHandler(() => {
            updateViewPage();
        });

        this.pageView.rotateAngleChanged.addHandler(() => {
            updateViewPage();
        });
    }

    protected _start(ht: _IHitTestInfo) {
        super._start(ht);
        this._showMagnifer(this.startPnt, ht);
    }

    protected _move(pnt: wijmo.Point, ht: _IHitTestInfo) {
        this._showMagnifer(pnt, ht);
    }

    private _showMagnifer(pnt: wijmo.Point, ht: _IHitTestInfo) {
        var magnifierRect = this.hostElement.getBoundingClientRect(),
            position = _getPositionByHitTestInfo(ht);

        this.hostElement.style.left = (pnt.x - magnifierRect.width / 2) + 'px';
        this.hostElement.style.top = (pnt.y - magnifierRect.height / 2) + 'px';

        this._fillPage(position);
        this._showHitPosition(position);
    }

    private _fillPage(hitPosition: _IDocumentPosition) {
        if (hitPosition.pageIndex === this._currentPageIndex) {
            return;
        }

        this._currentPageIndex = hitPosition.pageIndex;

        this.pageView.pages[this._currentPageIndex].getContent().then(pageContent => {
            var clone = <SVGElement>pageContent.cloneNode(true);

            this._viewPageDiv.innerHTML = '';
            this._viewPageDiv.appendChild(clone);
            clone.setAttribute('width', new _Unit(clone.getAttribute('width')).valueInPixel * this._Magnification + 'px');
            clone.setAttribute('height', new _Unit(clone.getAttribute('height')).valueInPixel * this._Magnification + 'px');

            var size = this.pageView.pages[this._currentPageIndex].size;
            _transformSvg(clone, size.width.valueInPixel, size.height.valueInPixel, this._Magnification * this.pageView.zoomFactor, this.pageView.pages[this._currentPageIndex].rotateAngle);
            this._viewPageDiv.style.width = clone.getAttribute('width');
            this._viewPageDiv.style.height = clone.getAttribute('height');
        });
    }

    private _showHitPosition(hitPosition: _IDocumentPosition) {
        var magnifierRect = this.hostElement.getBoundingClientRect(),
            currentPage = this.pageView.pages[this._currentPageIndex],
            transformedBound = _getTransformedPosition(hitPosition.pageBounds, currentPage.size, currentPage.rotateAngle, this.pageView.zoomFactor);

        this._viewPageDiv.style.left = (-transformedBound.x * this._Magnification + magnifierRect.width / 2) + 'px';
        this._viewPageDiv.style.top = (-transformedBound.y * this._Magnification + magnifierRect.height / 2) + 'px';
    }
}
    }
    


    module wijmo.viewer {
    


    }
    


    module wijmo.viewer {
    

































'use strict';

/**
 * Base class for all the viewer controls.
 */
export class ViewerBase extends wijmo.Control implements IHttpRequestHandler {
    // TODO: Begin: need refactor, we can create a ViewPane control to handle the pages display.
    // NOTE: 
    //   if/when you do that, remember to add the _getProductInfo method to the ViewPane control;
    //   if should return 'QNI5,ReportViewer', the product code and control name for ReportViewer.
    private _leftPanel: HTMLElement;
    _viewpanelContainer: HTMLElement;
    private _initialPosition: _IDocumentPosition;
    private _viewerContainer: HTMLElement;
    private _pages: _Page[] = [];
    // End: need refactor

    _documentEventKey: string;
    private _requestHeaders: any;
    private _keepSerConnTimer: any;
    private _documentSource: _DocumentSource;
    private _pageIndex: number = 0;
    private _mouseMode = MouseMode.SelectTool;
    private _viewMode = ViewMode.Single;
    private _serviceUrl: string;
    private _filePath: string;
    private _paginated: boolean;
    private _needBind: boolean = false;
    private _historyManager: _HistoryManager = new _HistoryManager();
    private _fullScreen: boolean = false;
    private _miniToolbarPinnedTimer: any = null;
    private _autoHeightCalculated = false;
    private _exportFormats: _IExportDescription[];
    _searchManager: _SearchManager = new _SearchManager();
    private _rubberband: _Rubberband;
    private _magnifier: _Magnifier;
    private _thresholdWidth: number = 767;

    private _outlinesPageId: string;
    private _thumbnailsPageId: string;
    private _exportsPageId: string;
    private _pageSetupPageId: string;

    _sidePanel: HTMLElement;
    private _toolbar: HTMLElement;
    private _mobileToolbar: HTMLElement;
    private _miniToolbar: HTMLElement;
    private _splitter: HTMLElement;
    private _pageSetupDialog: _PageSetupDialog;
    private _expiredTime: number;

    private _hostOriginWidth: string;
    private _hostOriginHeight: string;
    private _bodyOriginScrollTop: number;
    private _bodyOriginScrollLeft: number;
    private _footer: HTMLElement;
    private _zoomBar: HTMLElement;
    private _searchBar: HTMLElement;
    private _searchOptionsMenu: _SearchOptionsMenu;
    _hamburgerMenu: _HamburgerMenu;
    private _viewMenu: _HamburgerMenu;

    private _historyMoving = false;
    private _historyTimer: any;

    //global elements
    private _gSearchTitle: HTMLElement;
    private _gMatchCase: HTMLElement;
    private _gWholeWord: HTMLElement;
    private _gSearchResults: HTMLElement;
    private _gThumbnailsTitle: HTMLElement;
    private _gOutlinesTitle: HTMLElement;
    private _gPageSetupTitle: HTMLElement;
    private _gPageSetupApplyBtn: HTMLElement;
    private _gExportsPageTitle: HTMLElement;
    private _gExportsPageApplyBtn: HTMLElement;
    private _gExportFormatTitle: HTMLElement;

    static _seperatorHtml = "<div class='wj-separator' style='width:100%;height: 1px;margin: 3px 0;background-color:rgba(0,0,0,.2)'></div>";
    private static _viewpanelContainerMinHeight: number = 300;
    private static _miniToolbarPinnedTime = 3000;
    private static _narrowCss = 'narrow';
    private static _narrowWidthThreshold = 400;
    private static _thumbnailWidth = 100;
    private static _historyTimeout = 300;

    private _prohibitAddHistory = false;    // for fix 435431
    private _initialScroll = false;     // for fix 441259
    private _pageMoving = false;        // for fix 457950


    static _zoomValuesFormatter = (value: number): string => `${Math.floor(value * 100 + 0.5)} %`;
    static _zoomValuesParser = (text: string): number => parseFloat(text.replace(' %', ''));
    static _defaultZoomValues = [0.05, 0.25, 0.5, 0.75, 1, 2, 3, 4, 8, 10]
        .map(value => ({ value, name: ViewerBase._zoomValuesFormatter(value) }));

    //IOS will not download files while exporting, but browser will open exported files to view.
    //Some format doesn't support to open on ios: docx, doc, rtf.
    private static _exportItems: Object;

    /**
     * Gets or sets the template used to instantiate the viewer controls.
     */
    static controlTemplate =
        '<div class="wj-viewer-outer wj-content with-footer">' +
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

    // Occurs after the document source is changed.
    readonly _documentSourceChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    /**
     * Occurs after the page index is changed.
     */
    readonly pageIndexChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    /**
     * Occurs after the view mode is changed.
     */
    readonly viewModeChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    /**
     * Occurs after the mouse mode is changed.
     */
    readonly mouseModeChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    /**
     * Occurs after the full screen mode is changed.
     */
    readonly fullScreenChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    /**
     * Occurs after the zoom factor is changed.
     */
    readonly zoomFactorChanged = new wijmo.Event<ViewerBase, _IZoomFactorChangedEventArgs>();

    /**
     * Occurs after the zoom mode is changed.
     */
    readonly zoomModeChanged = new wijmo.Event<ViewerBase, _IZoomModeChangedEventArgs>();

    /**
     * Occurs when querying the request data sent to the service before loading the document.
     */
    readonly queryLoadingData = new wijmo.Event<ViewerBase, QueryLoadingDataEventArgs>();

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
    readonly beforeSendRequest = new wijmo.Event<ViewerBase, RequestEventArgs>();

    /**
     * Occurs when the next page has been loaded from the server, and its SVG has been rendered.
     */
    readonly pageLoaded = new wijmo.Event<ViewerBase, PageLoadedEventArgs>();

    /**
     * Initializes a new instance of the {@link ViewerBase} class.
     *
     * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, options, true);
        this._documentEventKey = new Date().getTime().toString();
        this._init(options);
    }
    _getProductInfo(): string {
        return 'QNI5,ViewerBase';
    }

    /**
     * Gets or sets the address of C1 Web API service.
     *
     * For example, "http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/report".
     */
    get serviceUrl(): string {
        return this._serviceUrl;
    }
    set serviceUrl(value: string) {
        if (value != this._serviceUrl) {
            this._serviceUrl = value;
            this._needBindDocumentSource();
            this.invalidate();
        }
    }

    /**
     * Gets or sets the full path to the document on the server.
     *
     * The path starts with the key of a provider which is registered at server for locating specified document.
     */
    get filePath(): string {
        return this._filePath;
    }
    set filePath(value: string) {
        if (value != this._filePath) {
            this._filePath = value;
            this._needBindDocumentSource();
            this.invalidate();
        }
    }

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
    get requestHeaders(): any {
        return this._requestHeaders;
    }
    set requestHeaders(value: any) {
        this._requestHeaders = value;
    }

    /**
     * Gets or sets the threshold to switch between mobile and PC template.
     *
     * Default value is 767px.  If width of control is smaller than thresholdWidth, mobile template will
     * be applied.  If width of control is equal or greater than thresholdWidth, PC template
     * will be applied.
     * If thresholdWidth is set to 0, then only PC template is applied 
     * and if it's set to a large number e.g. 9999, then only mobile template is applied.
     */
    get thresholdWidth(): number {
        return this._thresholdWidth;
    }
    set thresholdWidth(value: number) {
        if (value != this._thresholdWidth) {
            this._thresholdWidth = value;
            this.invalidate();
        }
    }

    // Gets or sets a value indicating whether the content should be represented as a set of fixed sized pages.
    // The default value is null, means using the default value from document source.
    get _innerPaginated(): boolean {
        if (this._documentSource && !this._needBind) {
            return this._documentSource.paginated;
        } else {
            return this._paginated;
        }
    }
    set _innerPaginated(value: boolean) {
        if (this._documentSource && !this._needBind) {
            this._setPaginated(value);
        } else {
            this._paginated = value == null ? null : wijmo.asBoolean(value);
        }

        this._setViewerAction(_ViewerActionType.TogglePaginated, true);
    }

    // override to handle inner controls (TFS 424599)
    set isDisabled(value: boolean) {
        value = wijmo.asBoolean(value, true);
        if (value != this.isDisabled) {
            let host = this._e;
            if (host) {
                wijmo.enable(host, !value);

                // set tabIndex to -1 if the control is disabled
                // or if it contains input elements (so back-tab works properly: TFS 387283)
                host.tabIndex = this.isDisabled || host.querySelector('input')
                    ? -1
                    : this._orgTabIndex;

                // also handle inner elements
                let children = host.querySelectorAll('input, [tabindex], .wj-pageview');
                for (let i = 0; i < children.length; i++) {
                    (children[i] as HTMLElement).tabIndex = value ? -1 : this._orgTabIndex;
                }
            }
        }
    }

    invalidate(fullUpdate: boolean = true) {
        super.invalidate(fullUpdate);

        // update Export format descriptions in accordance to culture (TFS 467437)
        ViewerBase._exportItems = null;
        this._updateExportTab();
    }

    /**
     * Reloads the document.
     *
     * This is useful for force reloading and rerendering the document.
     */
    reload() {
        this._needBindDocumentSource();
        this.invalidate();
    }

    /**
     * Refreshes the control.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (this._needBind) {
            this._setDocumentSource(this._getSource())
            this._needBind = false;
        }

        if (fullUpdate) {
            var toolbar = <_ViewerToolbar>wijmo.Control.getControl(this._toolbar);
            if (toolbar) {
                toolbar.refresh();
            }
            var miniToolbar = <_ViewerMiniToolbar>wijmo.Control.getControl(this._miniToolbar);
            if (miniToolbar) {
                miniToolbar.refresh();
            }
            var mobileToolbar = <_ViewerMobileToolbar>wijmo.Control.getControl(this._mobileToolbar);
            if (mobileToolbar) {
                mobileToolbar.refresh();
            }
            var zoomBar = <_ViewerZoomBar>wijmo.Control.getControl(this._zoomBar);
            if (zoomBar) {
                zoomBar.refresh();
            }
            var searchBar = <_SearchBar>wijmo.Control.getControl(this._searchBar);
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
    }

    private _updateLayout() {
        this._switchTemplate(this._isMobileTemplate());
    }

    private _switchTemplate(mobile: boolean) {
        var outer = <HTMLElement>this.hostElement.querySelector('.wj-viewer-outer'),
            mobileCss = 'mobile',
            sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            pageSetupPage = sideTabs.getTabPage(this._pageSetupPageId);

        if (mobile) {
            wijmo.addClass(outer, mobileCss);
            sideTabs.show(pageSetupPage);
        } else {
            wijmo.removeClass(outer, mobileCss);
            sideTabs.hide(pageSetupPage);
        }
    }

    // Creates a _DocumentSource object and returns it.
    _getSource(): _DocumentSource {
        if (!this.filePath) {
            return null;
        }

        return new _DocumentSource({
            serviceUrl: this._serviceUrl,
            filePath: this._filePath
        }, this);
    }

    _needBindDocumentSource() {
        this._needBind = true;
    }

    _supportsPageSettingActions(): boolean {
        return false;
    }

    _isMobileTemplate(): boolean {
        return this.thresholdWidth > this.hostElement.getBoundingClientRect().width;
    }

    private _init(options?: any): void {
        this._createChildren();
        this._autoCalculateHeight();
        this._resetToolbarWidth();
        this._resetViewPanelContainerWidth();
        this._bindEvents();
        this._initTools();
        this.deferUpdate(() => {
            this.initialize(options);
        });
    }

    private _initTools() {
        this._rubberband = new _Rubberband(document.createElement('div'), this._viewpanelContainer, this._pageView);
        this._rubberband.applied.addHandler((sender, args: _RubberbandOnAppliedEventArgs) => {
            var bandRect = args.rect,
                hitTestInfo = this._pageView.hitTest(bandRect.left, bandRect.top),
                containerRect = this._viewpanelContainer.getBoundingClientRect();

            if (bandRect.width > bandRect.height) {
                this._pageView.zoomFactor *= containerRect.width / bandRect.width;
            } else {
                this._pageView.zoomFactor *= containerRect.height / bandRect.height;
            }

            this._pageView.moveToPosition(_getPositionByHitTestInfo(hitTestInfo));
        });

        this._magnifier = new _Magnifier(document.createElement('div'), this._viewpanelContainer, this._pageView);
    }

    _globalize() {
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
    }

    private _autoCalculateHeight() {
        if (!this._shouldAutoHeight()) {
            return;
        }
        var viewpanelContainerStyleHeight = this._viewpanelContainer.style.height;
        this._viewpanelContainer.style.height = '100%'; // #291181 'auto';
        this._viewerContainer.style.height =
            Math.max(this._viewpanelContainer.getBoundingClientRect().height, ViewerBase._viewpanelContainerMinHeight) + 'px';
        this._viewpanelContainer.style.height = viewpanelContainerStyleHeight;
    }

    private _bindEvents(): void {
        _addEvent(window, 'unload', () => {
            if (this._documentSource) {
                this._documentSource.dispose();
            }
        });

        _addEvent(document, 'mousemove', (e) => {
            if (this.fullScreen && this._miniToolbar) {
                var miniToolbarVisible = this._checkMiniToolbarVisible(e);
                if (this._miniToolbarPinnedTimer != null && miniToolbarVisible) {
                    clearTimeout(this._miniToolbarPinnedTimer);
                    this._miniToolbarPinnedTimer = null;
                    this._showMiniToolbar(miniToolbarVisible);
                } else if (this._miniToolbarPinnedTimer == null) {
                    this._showMiniToolbar(miniToolbarVisible);
                }
            }
        });

        _addEvent(document, 'keydown', (e) => {
            if (e.keyCode === wijmo.Key.Escape) {
                this.fullScreen = false;
            }
        });

        this._historyManager.statusChanged.addHandler(this._onHistoryManagerStatusUpdated, this);
        this._onHistoryManagerStatusUpdated();

        this._pageView.pageIndexChanged.addHandler(() => {
            if (this._initialScroll) {
                this._initialScroll = false;
            } else {
                this._addHistory(false, true);
            }
            this._updatePageIndex(this._pageView.pageIndex);
        });

        this._pageView.zoomFactorChanged.addHandler((sender, e: _IZoomFactorChangedEventArgs) => {
            if (this.zoomMode === ZoomMode.Custom) {
                this._addHistory(false, true, { zoomFactor: e.oldValue });
            }
            this.onZoomFactorChanged(e);
        });

        this._pageView.zoomModeChanged.addHandler((sender, e: _IZoomModeChangedEventArgs) => {
            this._addHistory(false, true, { zoomMode: e.oldValue });
            this.onZoomModeChanged(e);
        });

        this.viewModeChanged.addHandler((sender, e: _IViewModeChangedEventArgs) => {
            this._addHistory(false, true, {
                viewMode: e.oldValue,
                zoomMode: this.zoomMode,
                zoomFactor: this.zoomFactor,
            }, true);
        });

        let positionChangedTimeoutId = null;
        let initialPage = null;
        this._pageView.positionChanged.addHandler(() => {
            if (!this._pageMoving) {
                if (!positionChangedTimeoutId) {
                    initialPage = this._pageIndex;
                }
                clearTimeout(positionChangedTimeoutId);
                positionChangedTimeoutId = setTimeout(() => {
                    if (initialPage !== this._pageIndex) {  // page has been changed
                        this._addHistory(false, true)
                    } else {
                        this._updateHistoryCurrent(true);
                    }
                    positionChangedTimeoutId = null;
                }, ViewerBase._historyTimeout);
            }
        });

        this._pageView.pageLoaded.addHandler((sender, e: PageLoadedEventArgs) => {
            this.onPageLoaded(e);
        });
    }

    private _checkMiniToolbarVisible(e: MouseEvent): boolean {
        var x = e.clientX,
            y = e.clientY;
        var bound = this._miniToolbar.getBoundingClientRect(),
            visibleOffset = 60,
            visibleLeft = bound.left - visibleOffset,
            visibleRight = bound.right + visibleOffset,
            visibleTop = bound.top - visibleOffset,
            visibleBottom = bound.bottom + visibleOffset;

        return x >= visibleLeft && x <= visibleRight &&
            y >= visibleTop && y <= visibleBottom;
    }

    private _showMiniToolbar(visible: boolean) {
        var opacity = parseFloat(getComputedStyle(this._miniToolbar, '')['opacity']),
            step = 0.01,
            t: any,
            toolbar = this._miniToolbar;
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
    }

    _goToBookmark(action: _IDocAction) {
        if (!this._documentSource || !action.data) {
            return;
        }

        this._documentSource.getBookmark(action.data).then((bookmark: _IDocumentPosition) => {
            if (bookmark) {
                this._scrollToPosition(bookmark, true);
            }
        });
    }

    _executeCustomAction(action: _IDocAction) {
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
        this._documentSource.executeCustomAction(action).then(position => {
            // scroll to the new position after custom action is performed.
            this._initialPosition = position || this._initialPosition;
            // update the status to force updating view.
            this._getStatusUtilCompleted(documentSource);
        }).catch(reason => {
            this._showViewPanelErrorMessage(_getErrorMessage(reason));
        });
    }

    _getStatusUtilCompleted(documentSource: _DocumentSource) {
        if (!documentSource || documentSource.isLoadCompleted || documentSource.isDisposed) {
            return;
        }

        documentSource.getStatus().then(v => {
            if (this._documentSource !== documentSource) {
                return;
            }

            setTimeout(() => this._getStatusUtilCompleted(documentSource), documentSource._innerService.getPingTimeout());
        }).catch(error => {
            this._showViewPanelErrorMessage(error);
        });
    }

    private _initChildren() {
        this._initPageView();
        this._initToolbar();
        this._initSidePanel();
        this._initSplitter();
        this._initFooter();
        this._initSearchBar();
        this._initMiniToolbar();
    }

    private _initSearchBar() {
        new _SearchBar(this._searchBar, this);
        this._showSearchBar(false);
    }

    private _showSearchBar(show: boolean) {
        var outer = <HTMLElement>this.hostElement.querySelector('.wj-viewer-outer'),
            withSearchBarCss = 'with-searchbar';
        if (show) {
            wijmo.removeClass(this._searchBar, _hiddenCss);
            wijmo.addClass(outer, withSearchBarCss);
        } else {
            wijmo.addClass(this._searchBar, _hiddenCss);
            wijmo.removeClass(outer, withSearchBarCss);
        }
    }

    private _initFooter() {
        new _ViewerZoomBar(this._zoomBar, this);
        _addEvent(this._footer.querySelector('.wj-close'), 'click', () => {
            this._showFooter(false);
        });
    }

    private _showFooter(show: boolean) {
        var outer = <HTMLElement>this.hostElement.querySelector('.wj-viewer-outer'),
            withFooterCss = 'with-footer';
        if (show) {
            wijmo.removeClass(this._footer, _hiddenCss);
            wijmo.addClass(outer, withFooterCss);
        } else {
            wijmo.addClass(this._footer, _hiddenCss);
            wijmo.removeClass(outer, withFooterCss);
        }
        this._pageView.refresh();
    }

    private _createChildren() {
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
    }

    private _initPageView() {
        var pageView = new _CompositePageView(this._viewpanelContainer);
        pageView.viewMode = this.viewMode;
    }

    private get _pageView(): _IPageView {
        return <_CompositePageView>wijmo.Control.getControl(this._viewpanelContainer);
    }

    private _initSplitter() {
        _addEvent(this._splitter, 'click', () => this._toggleSplitter());
    }

    _toggleSplitter(collapsed?: boolean) {
        var leftCss = 'wj-glyph-left', rightCss = 'wj-glyph-right',
            arrow = <HTMLElement>this._splitter.querySelector('span'),
            tabs = (<_SideTabs>wijmo.Control.getControl(this._sidePanel));

        if (collapsed === true) {
            if (wijmo.hasClass(arrow, rightCss)) {
                return;
            }
        } else if (collapsed === false) {
            if (wijmo.hasClass(arrow, leftCss)) {
                return;
            }
        } else {
            collapsed = wijmo.hasClass(arrow, leftCss);
        }

        if (!collapsed) {
            if (tabs.visibleTabPagesCount === 0) {
                return;
            }
            arrow.className = leftCss;
            tabs.expand();
        } else {
            tabs.collapse();
            arrow.className = rightCss;
        }

        this._resetViewPanelContainerWidth();
    }

    private _resetMiniToolbarPosition() {
        if (!this._miniToolbar) {
            return;
        }
        var containerWidth = this.hostElement.getBoundingClientRect().width,
            selfWidth = this._miniToolbar.getBoundingClientRect().width;
        this._miniToolbar.style.left = (containerWidth - selfWidth) / 2 + 'px';
    }

    private _resetToolbarWidth() {
        var toolbar = <_Toolbar>wijmo.Control.getControl(this._toolbar);
        toolbar.resetWidth();
    }

    private _resetViewPanelContainerWidth() {
        if (!this._isMobileTemplate() && this.hostElement.getBoundingClientRect().width <= ViewerBase._narrowWidthThreshold) {
            wijmo.addClass(this.hostElement, ViewerBase._narrowCss);
        } else {
            wijmo.removeClass(this.hostElement, ViewerBase._narrowCss);
        }
        var splitterWidth = this._splitter ? this._splitter.getBoundingClientRect().width : 0,
            leftPanelWidth = this._leftPanel ? this._leftPanel.getBoundingClientRect().width : 0;
        this._viewpanelContainer.style.width = this._viewerContainer.getBoundingClientRect().width -
            splitterWidth - leftPanelWidth + 'px';
        this._pageView.invalidate();
    }

    _shouldAutoHeight(): boolean {
        return (this.hostElement.style.height === '100%' || this.hostElement.style.height === 'auto') && !this.fullScreen;
    }

    private _initSidePanel() {
        var sideTabs = new _SideTabs(this._sidePanel);
        sideTabs.collapse();
        sideTabs.collapsed.addHandler(() => {
            this._toggleSplitter(true);
        });
        sideTabs.expanded.addHandler(() => {
            this._toggleSplitter(false);

            var splitterWidth = this._splitter ? this._splitter.getBoundingClientRect().width : 0,
                sidePanelAndSplitterWidth = this._sidePanel.getBoundingClientRect().width + splitterWidth;
            if (sidePanelAndSplitterWidth > this._viewerContainer.getBoundingClientRect().width) {
                wijmo.addClass(this._sidePanel, "collapsed");
            }
        });
        sideTabs.tabPageVisibilityChanged.addHandler((sender, e: _ITabPageVisibilityChangedEventArgs) => {
            if ((!e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 1)
                || (e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 0)) {
                this._resetViewPanelContainerWidth();
            }
        });

        this._initSidePanelThumbnails();
        this._initSidePanelOutlines();
        this._initSidePanelSearch();
        this._initSidePanelExports();
        this._initSidePanelPageSetup();
    }

    private _clearPreHightLights() {
        this._pages.forEach(page => {
            var preHighlights: NodeList;
            if (page.content) {
                preHighlights = page.content.querySelectorAll('.highlight');
                for (var i = 0; i < preHighlights.length; i++) {
                    preHighlights.item(i).parentNode.removeChild(preHighlights.item(i));
                }
            }
        });
    }

    private _highlightPosition(pageIndex: number, boundsList: _IRect[]): void {
        var g: SVGGElement, oldPageIndex = this._pageIndex,
            oldScrollTop = this._pageView.scrollTop, oldScrollLeft = this._pageView.scrollLeft,
            position: _IDocumentPosition = { pageIndex: pageIndex, pageBounds: boundsList.length > 0 ? boundsList[0] : null };

        this._scrollToPosition(position, true).then(_ => {
            this._clearPreHightLights();
            this._pages[this.pageIndex].getContent().then(content => {
                g = <SVGGElement>content.querySelector('g');

                for (var i = 0; i < boundsList.length; i++) {
                    var rect = <SVGRectElement>document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttributeNS(null, 'x', _twipToPixel(boundsList[i].x).toString());
                    rect.setAttributeNS(null, 'y', _twipToPixel(boundsList[i].y).toString());
                    rect.setAttributeNS(null, 'height', _twipToPixel(boundsList[i].height).toString());
                    rect.setAttributeNS(null, 'width', _twipToPixel(boundsList[i].width).toString());
                    rect.setAttributeNS(null, 'class', 'highlight');
                    g.appendChild(rect);
                }
            });
        });
    }

    private _scrollToPosition(position: _IDocumentPosition, addHistory?: boolean): IPromise {
        if (addHistory === true) {
            this._addHistory(true, false);
        }
        position.pageIndex = position.pageIndex || 0;
        var promise = this._pageView.moveToPosition(position);

        return promise;
    }

    private _initSidePanelSearch() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            searchPage = sideTabs.addPage(wijmo.culture.Viewer.search, icons.search);
        this._gSearchTitle = <HTMLElement>searchPage.outContent.querySelector('.wj-tabtitle');

        const getTabCheckboxes = tab => <HTMLInputElement>tab.outContent.querySelectorAll('input[type="checkbox"]');
        const getTabTextInputs = tab => <HTMLInputElement>tab.outContent.querySelectorAll('input[type="text"]');

        // set serach options on search tab activation
        sideTabs.tabPageActived.addHandler(s => {
            if (s.activedTabPage === searchPage) {
                const checkboxes = getTabCheckboxes(searchPage);
                checkboxes[0].checked = this._searchManager.matchCase;
                checkboxes[1].checked = this._searchManager.wholeWord;
                (getTabTextInputs(searchPage)[0] as HTMLInputElement).value = this._searchManager.text;
            }
        })

        searchPage.format(t => {
            var settingsHtml =
                '<div class="wj-searchcontainer">' +
                '<input class="wj-searchbox" wj-part="search-box" type="text"/>' +
                '<div class="wj-btn-group">' +
                '<button class="wj-btn wj-btn-searchpre">' + _createSvgBtn(icons.searchPrevious).innerHTML + '</button>' +
                '<button class="wj-btn wj-btn-searchnext">' + _createSvgBtn(icons.searchNext).innerHTML + '</button>' +
                '</div>' +
                '</div>' +
                '<div class="wj-searchoption">' +
                '<label><span wj-part="g-matchCase">&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.matchCase + '</span><input type="checkbox" wj-part="match-case" /></label>' +
                '</div>' +
                '<div class="wj-searchoption">' +
                '<label><span wj-part="g-wholeWord">&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.wholeWord + '</span><input type="checkbox" wj-part="whole-word" /></label>' +
                '</div>' +
                '<h3 wj-part="g-searchResults" class="wj-searchresult">' + wijmo.culture.Viewer.searchResults + '</h3>',
                settingsElement = _toDOMs(settingsHtml);

            this._gMatchCase = <HTMLElement>settingsElement.querySelector('[wj-part="g-matchCase"]');
            this._gWholeWord = <HTMLElement>settingsElement.querySelector('[wj-part="g-wholeWord"]');
            this._gSearchResults = <HTMLElement>settingsElement.querySelector('[wj-part="g-searchResults"]');

            t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
            const checkboxes = getTabCheckboxes(t);
            var matchCaseCheckBox = checkboxes[0],
                wholeWordCheckBox = checkboxes[1],
                input = getTabTextInputs(t)[0],
                preBtn = t.outContent.querySelector('.wj-btn-searchpre'),
                nextBtn = t.outContent.querySelector('.wj-btn-searchnext');
            wijmo.addClass(t.content.parentElement, 'search-wrapper');
            wijmo.addClass(t.content, 'wj-searchresultlist');

            var list = new wijmo.input.ListBox(t.content), isSettingItemsSource = false, highlighting = false;
            list.formatItem.addHandler((sender, e: wijmo.input.FormatItemEventArgs) => {
                var searchItem = e.item, data = <_ISearchResultItem>e.data,
                    searchPageNumberDiv = document.createElement('div'),
                    searchTextDiv = document.createElement('div');
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

            list.selectedIndexChanged.addHandler(() => this._searchManager.currentIndex = list.selectedIndex);

            var enableInputs = (enable = true) => {
                var inputs = searchPage.outContent.querySelectorAll('input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs.item(i).disabled = !enable;
                }
            }

            const searchInput = searchPage.outContent.querySelectorAll('input[type=text]')[0] as HTMLInputElement;
            this._searchManager.searchStarted.addHandler(() => {
                // update input value if search is being initiated in other places
                if (searchInput && (searchInput.value !== this._searchManager.text)) {
                    searchInput.value = this._searchManager.text;
                }
                enableInputs(false);
            });

            this._searchManager.searchCompleted.addHandler(() => {
                isSettingItemsSource = true;
                this._clearPreHightLights();
                list.itemsSource = this._searchManager.searchResult;
                isSettingItemsSource = false;
                enableInputs(true);
                this._updateHistoryCurrent()    // prevent adding of unnecessary history item on search (WJM-20048)
            });

            this._searchManager.currentChanged.addHandler(() => {
                if (isSettingItemsSource || highlighting) {
                    return;
                }

                var result = this._searchManager.current;
                if (!result) {
                    return;
                }

                highlighting = true;
                list.selectedIndex = this._searchManager.currentIndex;
                this._highlightPosition(result.pageIndex, result.boundsList);
                highlighting = false;
            });

            this._searchManager.resultsCleared.addHandler(() => {
                list.itemsSource = null;
                this._clearPreHightLights();
            });

            var update = () => {
                this._searchManager.clear(); // #310845

                list.itemsSource = null;
                matchCaseCheckBox.checked = false;
                wholeWordCheckBox.checked = false;
                input.value = '';

                if (!this._documentSource || !this._documentSource.features
                    || (this._documentSource.paginated && !this._documentSource.features.textSearchInPaginatedMode)) {
                    sideTabs.hide(t);
                    return;
                }

                sideTabs.show(t);
            };

            this._documentSourceChanged.addHandler(() => {
                if (this._documentSource) {
                    _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                }
                update();
            });

            _addEvent(matchCaseCheckBox, 'click', () => { this._searchManager.matchCase = matchCaseCheckBox.checked; });
            _addEvent(wholeWordCheckBox, 'click', () => { this._searchManager.wholeWord = wholeWordCheckBox.checked; });
            _addEvent(input, 'input', () => { this._searchManager.text = input.value; });
            _addEvent(input, 'keyup', e => {
                var event = e || window.event;
                if (event.keyCode === wijmo.Key.Enter) {
                    this._searchManager.search(event.shiftKey);
                }
            });

            _addEvent(nextBtn, 'click', () => this._searchManager.search());
            _addEvent(preBtn, 'click', () => this._searchManager.search(true));
            _addEvent(t.header, 'keydown', e => {
                var next: Element, toolbar = this._toolbar;
                if (e.keyCode === wijmo.Key.Tab) {
                    next = toolbar.querySelector('[tabIndex=0]')
                        || toolbar.querySelector('input:not([type="hidden"])')
                        || toolbar;

                    if (next && next['focus']) {
                        (<HTMLElement>next).focus();
                        e.preventDefault();
                    }
                }
            });
        });
    }

    private _initSidePanelOutlines() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            outlinesPage = sideTabs.addPage(wijmo.culture.Viewer.outlines, icons.outlines);
        this._gOutlinesTitle = <HTMLElement>outlinesPage.outContent.querySelector('.wj-tabtitle');
        this._outlinesPageId = outlinesPage.id;
        outlinesPage.format(t => {
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

            tree.itemFormatter = function (panel, r, c, cell: HTMLDivElement) {
                var itemHeader: string;
                if (cell.firstElementChild) {
                    itemHeader = (<HTMLElement>cell.firstElementChild).outerHTML;
                } else {
                    itemHeader = '&nbsp;&nbsp;&nbsp;&nbsp;';
                }
                var dataItem = <_IOutlineNode>panel.rows[r].dataItem;
                cell.innerHTML = itemHeader + '<a>' + dataItem.caption + '</a>';
            };

            var updatingOutlineSource = true;
            tree.selectionChanged.addHandler((flexGrid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) => {
                if (updatingOutlineSource) {
                    return;
                }
                var row = e.getRow();
                if (row) {
                    var dataItem = <_IOutlineNode>row.dataItem;
                    if (dataItem.position) {
                        // this._scrollToPosition(dataItem.position, true);
                        this._scrollToPosition(dataItem.position, false);   // with preventing of  double history (TFS 441060)
                    } else if (dataItem.target) {
                        if (!this._documentSource) {
                            return;
                        }

                        // the target is normally a bookmark string.
                        this._documentSource.getBookmark(dataItem.target).then(pos => {
                            dataItem.position = pos;
                            // the selected node may be changed.
                            if (flexGrid.getSelectedState(e.row, e.col) != wijmo.grid.SelectedState.None) {
                                // this._scrollToPosition(pos, true);
                                this._scrollToPosition(pos, false);   // with preventing of  double history (TFS 441060)
                            }
                        }, reason => {
                            // todo, show non-fatal error in errors panel.
                        });
                    }
                    if (this._isMobileTemplate()) {
                        sideTabs.collapse();
                    }
                }
            });

            var isTreeRefreshed = false, refreshTree = () => {
                if (isTreeRefreshed) return;

                if (sideTabs.isCollapsed || !t.isActived || t.isHidden) {
                    return;
                }

                tree.refresh();
                isTreeRefreshed = true;
            }, toggleTab = () => {
                if (!this._documentSource) {
                    tree.itemsSource = null;
                    sideTabs.hide(t);
                    return;
                }

                var update = () => {
                    if (!this._documentSource.hasOutlines) {
                        tree.itemsSource = null;
                        sideTabs.hide(t);
                        return;
                    }

                    this._documentSource.getOutlines().then(items => {
                        updatingOutlineSource = true;
                        isTreeRefreshed = false;
                        tree.itemsSource = items;
                        sideTabs.show(t);
                        refreshTree();
                        updatingOutlineSource = false;
                    });
                };

                _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                //update();
            };

            this._documentSourceChanged.addHandler(toggleTab);
            sideTabs.tabPageActived.addHandler(refreshTree);
            toggleTab();
        });
    }

    private _initSidePanelThumbnails() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            thumbnailsPage = sideTabs.addPage(wijmo.culture.Viewer.thumbnails, icons.thumbnails);
        this._gThumbnailsTitle = <HTMLElement>thumbnailsPage.outContent.querySelector('.wj-tabtitle');
        this._thumbnailsPageId = thumbnailsPage.id;
        thumbnailsPage.format(t => {
            wijmo.addClass(t.content, 'wj-thumbnaillist');

            var list = new wijmo.input.ListBox(t.content),
                pngUrls: (() => IPromise)[] = null,
                isItemsSourceSetting = false,
                svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml: space = "preserve" >';

            list.formatItem.addHandler((sender, e: wijmo.input.FormatItemEventArgs) => {
                var item = e.item,
                    data: (() => IPromise) = e.data;

                item.innerHTML = '';

                if (!this._pageView.pages) {
                    return;
                }

                var svgContainer: HTMLDivElement = document.createElement('div'),
                    svg: HTMLElement = _toDOM(svgStart + '</svg>'),
                    g: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                    img: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image'),
                    indexDiv: HTMLDivElement = document.createElement('div'),
                    page = this._pageView.pages[e.index],
                    thumbHeight = page.size.height.valueInPixel * ViewerBase._thumbnailWidth / page.size.width.valueInPixel;

                wijmo.addClass(item, 'wj-thumbnail-item');

                data().then(url => { // convert image url to the data url.
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

                rotateThumb(<any>svg, page);

                indexDiv.className = 'page-index';
                indexDiv.innerHTML = (e.index + 1).toString();
                item.appendChild(indexDiv);
            });

            list.selectedIndexChanged.addHandler(() => {
                if (isItemsSourceSetting || list.selectedIndex < 0
                    // Does not move to selected page if it's already the current page.
                    // The current page may be set by history backward/forward.
                    || list.selectedIndex == this._pageIndex) {
                    return;
                }

                this.moveToPage(list.selectedIndex);
                if (this._isMobileTemplate()) {
                    sideTabs.collapse();
                }
            });

            this.pageIndexChanged.addHandler(() => list.selectedIndex = this._pageIndex);

            var rotateThumb = (svg: SVGElement, page: _Page) => {
                var thumbWidth = ViewerBase._thumbnailWidth,
                    thumbHeight = page.size.height.valueInPixel * thumbWidth / page.size.width.valueInPixel,
                    container = <HTMLElement>svg.parentNode;

                _transformSvg(svg, thumbWidth, thumbHeight, 1, page.rotateAngle);

                switch (page.rotateAngle) {
                    case _RotateAngle.Rotation90:
                    case _RotateAngle.Rotation270:
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

            var createThumbnails: () => (() => IPromise)[] = () => {
                if (!this._documentSource || !this._documentSource.isLoadCompleted || !this._documentSource.pageCount) {
                    return null;
                }

                var result: (() => IPromise)[] = [];

                for (var i = 0; i < this._documentSource.pageCount; i++) {
                    ((pageIndex: number) => { // closure for i
                        result.push(() => {
                            var promise = new _Promise();

                            this._documentSource.getExportedUrl({ format: 'png', resolution: 50, outputRange: pageIndex + 1 }).then(url => {
                                if (!this._documentSource || !this._documentSource._innerService || this._documentSource.isDisposed) {
                                    promise.resolve(null);
                                }

                                this._documentSource._innerService.downloadDataUrl(url).then((dataUrl: string) => {
                                    promise.resolve(dataUrl);
                                }, e => promise.resolve(null));
                            }, e => promise.resolve(null));

                            return promise;
                        });
                    })(i);
                }

                return result;
            }

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

            var updateItems = () => {
                var fn = () => {
                    if (t.isActived && list.itemsSource !== pngUrls) {
                        list.deferUpdate(() => {
                            isItemsSourceSetting = true;
                            list.itemsSource = pngUrls;
                            list.selectedIndex = this._pageIndex;
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

            var update = () => {
                if (!this._documentSource || !this._documentSource.hasThumbnails) {
                    sideTabs.hide(t);
                    list.itemsSource = null;
                    return;
                }

                sideTabs.show(t);
                pngUrls = null;
                updateItems()
            };

            var bindEvents = () => {
                if (!this._documentSource || !this._documentSource.hasThumbnails) {
                    sideTabs.hide(t);
                    list.itemsSource = null;
                    return;
                }

                _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                _addWjHandler(this._documentEventKey, this._documentSource.pageCountChanged, update);
                _addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, update);
                update();
            };

            this._documentSourceChanged.addHandler(bindEvents);
            bindEvents();

            sideTabs.tabPageActived.addHandler(() => {
                if (sideTabs.activedTabPage.id === this._thumbnailsPageId) {
                    updateItems();
                }
            });

            updateItems();

            this._pageView.rotateAngleChanged.addHandler(() => {
                var svgs = list.hostElement.querySelectorAll('svg');
                for (var i = 0; i < svgs.length; i++) {
                    rotateThumb(svgs.item(i), this._pageView.pages[i]);
                }
            });
        });
    }

    private _initSidePanelExports() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
        var exportsPage = sideTabs.addPage(wijmo.culture.Viewer.exports, icons.exports);

        this._gExportsPageTitle = <HTMLElement>exportsPage.outContent.querySelector('.wj-tabtitle');
        this._exportsPageId = exportsPage.id;

        exportsPage.format(t => {
            var settingsHtml =
                '<div class="wj-exportcontainer">' +
                '<label wj-part="g-wj-exportformat">' + wijmo.culture.Viewer.exportFormat + '</label>' +
                '<div class="wj-exportformats"></div>' +
                '</div>',
                settingsElement = _toDOMs(settingsHtml),
                searchResult: _ISearchResultItem[];

            t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
            this._gExportFormatTitle = <HTMLElement>t.outContent.querySelector('[wj-part="g-wj-exportformat"]');
            var exportFormatsDiv = t.outContent.querySelector('.wj-exportformats');
            new wijmo.input.ComboBox(exportFormatsDiv);
            wijmo.addClass(t.content.parentElement, 'wj-exportformats-wrapper');

            var editorElement = document.createElement('div');
            var editor = new _ExportOptionEditor(editorElement);
            t.content.appendChild(editorElement);

            var footerHtml = '<div class="wj-exportformats-footer">' +
                '<a wj-part="btn-apply" class="wj-btn wj-applybutton" tabindex="-1">' + wijmo.culture.Viewer.exportOk + '</a>' +
                '</div>';
            var footerElement = _toDOMs(footerHtml);
            t.content.appendChild(footerElement);
            var applyBtn = t.content.querySelector('[wj-part="btn-apply"]');
            this._gExportsPageApplyBtn = <HTMLElement>applyBtn;
            _addEvent(applyBtn, 'click', () => {
                this._documentSource.export(<any>editor.options);
                sideTabs.collapse();
            });
        });

        var updateExportTab = true;
        this._documentSourceChanged.addHandler(() => {
            updateExportTab = true;

            if (!this._documentSource) {
                return;
            }

            _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, () => {
                // Update active export tab if datasource has been changed
                if (updateExportTab) {
                    this._ensureExportFormatsLoaded().then(() => {
                        this._updateExportTab();
                        updateExportTab = (this._exportFormats == null);
                    });
                }
            });
        });

        sideTabs.tabPageActived.addHandler(() => {
            if (updateExportTab && (sideTabs.activedTabPage.id === this._exportsPageId)) {
                this._ensureExportFormatsLoaded().then(() => {
                    this._updateExportTab();
                    updateExportTab = (this._exportFormats == null);
                });
            }
        });
    }

    private _ensureExportFormatsLoaded(): IPromise {
        if (!this._exportFormats && this._documentSource && !this._documentSource.isDisposed && this._documentSource.isInstanceCreated) {
            return this._documentSource.getSupportedExportDescriptions().then((items: _IExportDescription[]) => {
                this._exportFormats = items;
                this._setViewerAction(_ViewerActionType.ShowExportsPanel);
            });
        }

        var promise = new _Promise();
        promise.resolve();
        return promise;
    }

    private _updateExportTab(refresh?: boolean) {
        if (!this._exportFormats) {
            return;
        }

        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            exportsPage = sideTabs.getTabPage(this._exportsPageId),
            comboExportFormats = <wijmo.input.ComboBox>wijmo.Control.getControl(exportsPage.outContent.querySelector('.wj-exportformats')),
            editor = <_ExportOptionEditor>wijmo.Control.getControl(exportsPage.content.firstElementChild);

        if (refresh) {
            editor.refresh();

            if (comboExportFormats.itemsSource) {
                comboExportFormats.itemsSource.forEach(item => {
                    item.name = this._exportItemDescriptions[item.format].name;
                });
            }

            comboExportFormats.refresh();
        } else {
            var bindingItems: _IExportDescription[] = [];

            this._exportFormats.forEach(item => {
                var itemDescription = this._exportItemDescriptions[item.format];
                //some export format can't be opened on ios.
                if (isIOS() && !itemDescription.supportIOS) {
                    return;
                }
                item.name = itemDescription.name;
                bindingItems.push(item);
            });

            comboExportFormats.selectedIndexChanged.addHandler(() => {
                editor.exportDescription = comboExportFormats.selectedItem;
            });

            comboExportFormats.itemsSource = bindingItems;
            comboExportFormats.displayMemberPath = 'name';
            comboExportFormats.selectedValuePath = 'format';
            comboExportFormats.selectedIndex = -1;
        }
    }


    private _initSidePanelPageSetup() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
        var pageSetupPage = sideTabs.addPage(wijmo.culture.Viewer.pageSetup, icons.pageSetup);
        this._gPageSetupTitle = <HTMLElement>pageSetupPage.outContent.querySelector('.wj-tabtitle');
        this._pageSetupPageId = pageSetupPage.id;
        pageSetupPage.format(t => {
            var editorElement = document.createElement('div');
            var editor = new _PageSetupEditor(editorElement);
            t.content.appendChild(editorElement);

            wijmo.addClass(editorElement, 'wj-pagesetupcontainer');
            var footerHtml = '<div class="wj-pagesetup-footer">' +
                '<a wj-part="btn-apply" class="wj-btn wj-applybutton" tabindex="-1">' + wijmo.culture.Viewer.ok + '</a>' +
                '</div>';
            var footerElement = _toDOMs(footerHtml);
            t.content.appendChild(footerElement);
            var applyBtn = t.content.querySelector('[wj-part="btn-apply"]');
            this._gPageSetupApplyBtn = <HTMLElement>applyBtn;
            _addEvent(applyBtn, 'click', () => {
                this._setPageSettings(editor.pageSettings);
                sideTabs.collapse();
            });

            var updatePageSettings = () => {
                editor.pageSettings = this._documentSource.pageSettings;
            }, update = () => {
                if (!this._documentSource) {
                    return;
                }

                _addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, updatePageSettings);
                updatePageSettings();
            };
            this._documentSourceChanged.addHandler(update);
            update();
        });
    }

    _executeAction(action: _ViewerActionType) {
        if (this._actionIsDisabled(action)) {
            return;
        }
        switch (action) {
            case _ViewerActionType.TogglePaginated:
                this._innerPaginated = !this._innerPaginated;
                break;
            case _ViewerActionType.Print:
                if (this._documentSource) {
                    this._documentSource.print(this._pages.map(page => page.rotateAngle));
                }
                break;
            case _ViewerActionType.ShowExportsPanel:
                (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).active(this._exportsPageId);
                break;
            case _ViewerActionType.Portrait:
                this._setPageLandscape(false);
                break;
            case _ViewerActionType.Landscape:
                this._setPageLandscape(true);
                break;
            case _ViewerActionType.ShowPageSetupDialog:
                this.showPageSetupDialog();
                break;
            case _ViewerActionType.FirstPage:
                this.moveToPage(0);
                break;
            case _ViewerActionType.LastPage:
                this._moveToLastPage();
                break;
            case _ViewerActionType.PrePage:
                this.moveToPage(this._pageIndex - 1);
                break;
            case _ViewerActionType.NextPage:
                this.moveToPage(this._pageIndex + 1);
                break;
            case _ViewerActionType.Backward:
                this._moveBackwardHistory();
                break;
            case _ViewerActionType.Forward:
                this._moveForwardHistory();
                break;
            case _ViewerActionType.SelectTool:
                this.mouseMode = MouseMode.SelectTool;
                break;
            case _ViewerActionType.MoveTool:
                this.mouseMode = MouseMode.MoveTool;
                break;
            case _ViewerActionType.Continuous:
                this.viewMode = ViewMode.Continuous;
                break;
            case _ViewerActionType.Single:
                this.viewMode = ViewMode.Single;
                break;
            case _ViewerActionType.FitPageWidth:
                this.zoomMode = ZoomMode.PageWidth;
                break;
            case _ViewerActionType.FitWholePage:
                this.zoomMode = ZoomMode.WholePage;
                break;
            case _ViewerActionType.ZoomOut:
                this._zoomBtnClicked(false, ViewerBase._defaultZoomValues);
                break;
            case _ViewerActionType.ZoomIn:
                this._zoomBtnClicked(true, ViewerBase._defaultZoomValues);
                break;
            case _ViewerActionType.ToggleFullScreen:
                this.fullScreen = !this.fullScreen;
                break;
            case _ViewerActionType.ShowHamburgerMenu:
                this._hamburgerMenu.showMenu();
                break;
            case _ViewerActionType.ShowViewMenu:
                this._viewMenu.showMenu();
                break;
            case _ViewerActionType.ShowSearchBar:
                this._showSearchBar(wijmo.hasClass(this._searchBar, _hiddenCss));
                this._setViewerAction(_ViewerActionType.ShowSearchBar);
                break;
            case _ViewerActionType.ShowThumbnails:
                (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).active(this._thumbnailsPageId);
                break;
            case _ViewerActionType.ShowOutlines:
                (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).active(this._outlinesPageId);
                break;
            case _ViewerActionType.ShowPageSetupPanel:
                (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).active(this._pageSetupPageId);
                break;
            case _ViewerActionType.ShowZoomBar:
                this._showFooter(true);
                break;
            case _ViewerActionType.SearchPrev:
                this._searchManager.search(true);
                break;
            case _ViewerActionType.SearchNext:
                this._searchManager.search();
                break;
            case _ViewerActionType.ShowSearchOptions:
                this._searchOptionsMenu.showMenu(true);
                break;
            case _ViewerActionType.SearchMatchCase:
                this._searchManager.matchCase = !this._searchManager.matchCase;
                break;
            case _ViewerActionType.SearchMatchWholeWord:
                this._searchManager.wholeWord = !this._searchManager.wholeWord;
                break;
            case _ViewerActionType.RubberbandTool:
                this.mouseMode = MouseMode.RubberbandTool;
                break;
            case _ViewerActionType.MagnifierTool:
                this.mouseMode = MouseMode.MagnifierTool;
                break;
            case _ViewerActionType.RotateDocument:
                this._rotateDocument();
                break;
            case _ViewerActionType.RotatePage:
                this._rotatePage();
                break;
        }
    }

    _initSearchOptionsMenu(owner: HTMLElement) {
        this._searchOptionsMenu = new _SearchOptionsMenu(this, owner);
    }

    _initHamburgerMenu(owner: HTMLElement) {
        this._hamburgerMenu = new _HamburgerMenu(this, owner);
    }

    _initViewMenu(owner: HTMLElement) {
        this._viewMenu = new _ViewMenu(this, owner);
    }

    private _initToolbar() {
        new _ViewerToolbar(this._toolbar, this);
        new _ViewerMobileToolbar(this._mobileToolbar, this);
    }

    private _clearExportFormats() {
        this._exportFormats = null;
    }
    private _supportedExportsDesc: _IExportDescription[];

    private get _exportItemDescriptions(): Object {
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
    }

    _actionIsChecked(action: _ViewerActionType): boolean {
        switch (action) {
            case _ViewerActionType.TogglePaginated:
                return this._innerPaginated === true;
            case _ViewerActionType.Landscape:
                if (this._documentSource && this._documentSource.pageSettings) {
                    return this._documentSource.pageSettings.landscape;
                }
                return false;
            case _ViewerActionType.Portrait:
                if (this._documentSource && this._documentSource.pageSettings) {
                    return !this._documentSource.pageSettings.landscape;
                }
                return false;
            case _ViewerActionType.SelectTool:
                return this.mouseMode === MouseMode.SelectTool;
            case _ViewerActionType.MoveTool:
                return this.mouseMode === MouseMode.MoveTool;
            case _ViewerActionType.RubberbandTool:
                return this.mouseMode === MouseMode.RubberbandTool;
            case _ViewerActionType.MagnifierTool:
                return this.mouseMode === MouseMode.MagnifierTool;
            case _ViewerActionType.Continuous:
                return this.viewMode == ViewMode.Continuous;
            case _ViewerActionType.Single:
                return this.viewMode == ViewMode.Single;
            case _ViewerActionType.ToggleFullScreen:
                return this.fullScreen;
            case _ViewerActionType.FitPageWidth:
                return this.zoomMode == ZoomMode.PageWidth;
            case _ViewerActionType.FitWholePage:
                return this.zoomMode == ZoomMode.WholePage;
            case _ViewerActionType.SearchMatchCase:
                return this._searchManager.matchCase;
            case _ViewerActionType.SearchMatchWholeWord:
                return this._searchManager.wholeWord;
            case _ViewerActionType.ShowSearchBar:
                return !wijmo.hasClass(this._searchBar, _hiddenCss);
        }
        return false;
    }

    _isDocumentSourceLoaded(): boolean {
        return this._documentSource && this._documentSource.isLoadCompleted;
    }

    _actionIsDisabled(action: _ViewerActionType): boolean {
        if (!this._isDocumentSourceLoaded() || !(this._documentSource.pageCount > 0)) { // no pages - no actions
            return true;
        }

        switch (action) {
            case _ViewerActionType.TogglePaginated:
                return this._innerPaginated == null;
            case _ViewerActionType.ShowExportsPanel:
                return !this._exportFormats || this._exportFormats.length === 0;
            case _ViewerActionType.Landscape:
            case _ViewerActionType.Portrait:
            case _ViewerActionType.ShowPageSetupDialog:
            case _ViewerActionType.ShowPageSetupPanel:
                if (this._documentSource && this._documentSource.pageSettings) {
                    return !this._documentSource.paginated;
                }
                return true;
            case _ViewerActionType.FirstPage:
            case _ViewerActionType.PrePage:
                return this._pageIndex <= 0;
            case _ViewerActionType.LastPage:
            case _ViewerActionType.NextPage:
                return this._pageIndex >= this._documentSource.pageCount - 1;
            case _ViewerActionType.Backward:
                return !this._historyManager.canBackward();
            case _ViewerActionType.Forward:
                return !this._historyManager.canForward();
            case _ViewerActionType.Continuous:
            case _ViewerActionType.Single:
                return !this._documentSource || !this._documentSource.paginated;
            case _ViewerActionType.ZoomOut:
                return this.zoomFactor <= ViewerBase._defaultZoomValues[0].value;
            case _ViewerActionType.ZoomIn:
                var zoomValues = ViewerBase._defaultZoomValues;
                return this.zoomFactor >= zoomValues[zoomValues.length - 1].value;
        }

        return false;
    }

    _actionIsShown(action: _ViewerActionType): boolean {
        var features: _IDocumentFeatures = this._documentSource ? (this._documentSource.features) : null;
        switch (action) {
            case _ViewerActionType.TogglePaginated:
                return features && features.paginated && features.nonPaginated;
            case _ViewerActionType.Landscape:
            case _ViewerActionType.Portrait:
            case _ViewerActionType.ShowPageSetupDialog:
            case _ViewerActionType.ShowPageSetupPanel:
                return features ? features.pageSettings : this._supportsPageSettingActions();
            case _ViewerActionType.SelectTool:
            case _ViewerActionType.MoveTool:
            case _ViewerActionType.MagnifierTool:
            case _ViewerActionType.RubberbandTool:
                return !wijmo.isMobile();
            case _ViewerActionType.ShowSearchBar:
                return features && (!this._documentSource.paginated || features.textSearchInPaginatedMode);
            case _ViewerActionType.ShowOutlines:
                return this._documentSource && this._documentSource.hasOutlines;
            case _ViewerActionType.ShowThumbnails:
                return this._documentSource && this._documentSource.hasThumbnails;
        }
        return true;
    }

    readonly _viewerActionStatusChanged = new wijmo.Event<ViewerBase, wijmo.EventArgs>();

    _onViewerActionStatusChanged(e: _IViewerActionChangedEventArgs) {
        this._viewerActionStatusChanged.raise(this, e);
    }

    private _setViewerAction(actionType: _ViewerActionType, disabled?: boolean, checked?: boolean, shown?: boolean) {
        var action = {
            actionType: actionType,
            disabled: disabled ? disabled : this._actionIsDisabled(actionType),
            checked: checked ? checked : this._actionIsChecked(actionType),
            shown: shown ? shown : this._actionIsShown(actionType)
        };
        this._onViewerActionStatusChanged({ action: action });
    }

    private _updateViewerActions() {
        this._updatePageSettingsActions();
        this._updateViewModeActions();
        this._updateMouseModeActions();
        this._setViewerAction(_ViewerActionType.ShowExportsPanel);
    }

    private _updateViewModeActions() {
        this._setViewerAction(_ViewerActionType.Continuous);
        this._setViewerAction(_ViewerActionType.Single);
    }

    private _updatePageSettingsActions() {
        this._setViewerAction(_ViewerActionType.TogglePaginated);
        this._setViewerAction(_ViewerActionType.Landscape);
        this._setViewerAction(_ViewerActionType.Portrait);
        this._setViewerAction(_ViewerActionType.ShowPageSetupDialog);
    }

    private _updateMouseModeActions() {
        this._setViewerAction(_ViewerActionType.SelectTool);
        this._setViewerAction(_ViewerActionType.MoveTool);
        this._setViewerAction(_ViewerActionType.MagnifierTool);
        this._setViewerAction(_ViewerActionType.RubberbandTool);
    }

    private _updateZoomModeActions() {
        this._setViewerAction(_ViewerActionType.FitPageWidth);
        this._setViewerAction(_ViewerActionType.FitWholePage);
    }

    private _updateZoomFactorActions() {
        this._setViewerAction(_ViewerActionType.ZoomOut);
        this._setViewerAction(_ViewerActionType.ZoomIn);
    }

    private _onPageSettingsUpdated() {
        this._updatePageSettingsActions();
        this._updateViewModeActions();

        this._resetToolbarWidth();
    }

    private _onPageCountUpdated() {
        this._updatePageNavActions();
        this._resetToolbarWidth();
    }

    private _updatePageNavActions() {
        this._setViewerAction(_ViewerActionType.FirstPage);
        this._setViewerAction(_ViewerActionType.LastPage);
        this._setViewerAction(_ViewerActionType.PrePage);
        this._setViewerAction(_ViewerActionType.NextPage);
    }

    private _onHistoryManagerStatusUpdated() {
        this._setViewerAction(_ViewerActionType.Backward);
        this._setViewerAction(_ViewerActionType.Forward);
    }

    _updateUI() {
        // update button actions
        Object.keys(_ViewerActionType).forEach((value) => {
            if (!isNaN(<any>value)) {
                this._setViewerAction(_ViewerActionType[<string>_ViewerActionType[value]]);
            }
        });

        // update tabs
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
        if (sideTabs) {
            sideTabs.enableAll(this._isDocumentSourceLoaded());
        }
    }

    private _updateViewContainerCursor() {
        var showMoveTool = this.mouseMode === MouseMode.MoveTool;
        if (showMoveTool) {
            if (!wijmo.hasClass(this._viewpanelContainer, 'move')) {
                wijmo.addClass(this._viewpanelContainer, 'move');
            }
        }
        else if (wijmo.hasClass(this._viewpanelContainer, 'move')) {
            wijmo.removeClass(this._viewpanelContainer, 'move');
        }
    }

    private _updateFullScreenStyle() {
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
        } else {
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
    }

    /**
     * Shows the page setup dialog.
     */
    showPageSetupDialog() {
        if (!this._pageSetupDialog) {
            this._createPageSetupDialog();
        }

        this._pageSetupDialog.showWithValue(this._documentSource.pageSettings);
    }

    private _createPageSetupDialog() {
        var self = this, ele = document.createElement("div");
        ele.style.display = 'none';
        self.hostElement.appendChild(ele);
        self._pageSetupDialog = new _PageSetupDialog(ele);
        self._pageSetupDialog.applied.addHandler(() => self._setPageSettings(self._pageSetupDialog.pageSettings));
    }

    /**
     * Scales the current page to show the whole page in view panel.
     */
    zoomToView() {
        wijmo._deprecated('zoomToView', 'zoomMode');
        var doc = this._documentSource;
        if (!doc) {
            return;
        }

        this.zoomMode = ZoomMode.WholePage;
    }

    /**
     * Scales the current page to fit the width of the view panel.
     */
    zoomToViewWidth() {
        wijmo._deprecated('zoomToViewWidth', 'zoomMode');
        var doc = this._documentSource;
        if (!doc) {
            return;
        }

        this.zoomMode = ZoomMode.PageWidth;
    }

    private _setPageLandscape(landscape: boolean) {
        var self = this, pageSettings = this._documentSource.pageSettings;
        _setLandscape(pageSettings, landscape);
        self._setPageSettings(pageSettings);
    }

    _setPaginated(paginated: boolean) {
        var features = this._documentSource.features,
            pageSettings = this._documentSource.pageSettings;

        if (!features || !pageSettings) return;

        if (paginated == pageSettings.paginated) return;

        if (paginated && features.paginated) {
            pageSettings.paginated = true;
            this._setPageSettings(pageSettings);
            this._showSearchBar(false); // TFS 419684
        } else if (!paginated && features.nonPaginated) {
            pageSettings.paginated = false;
            this._setPageSettings(pageSettings);
        }
    }

    private _setPageSettings(pageSettings: _IPageSettings): IPromise {
        this._showViewPanelMessage();
        this._setDocumentRendering(); // #268768
        return this._documentSource.setPageSettings(pageSettings).then((data: _IExecutionInfo) => {
            this._resetDocument();
            this._reRenderDocument();
        }).catch(reason => {
            this._showViewPanelErrorMessage(_getErrorMessage(reason));
        });
    }

    _showViewPanelErrorMessage(message: string) {
        this._showViewPanelMessage(message, 'errormessage');
    }

    _showViewPanelMessage(message?: string, className?: string) {
        var div = <HTMLDivElement>this._viewpanelContainer.querySelector('.wj-viewer-loading');
        if (!div) {
            div = <HTMLDivElement>document.createElement('div');
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
    }

    _removeViewPanelMessage() {
        var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
        if (div) {
            this._viewpanelContainer.removeChild(div);
        }
    }

    _reRenderDocument() {
        if (this._documentSource) {
            this._showViewPanelMessage();
            this._documentSource.load();
        }
    }

    private _zoomBtnClicked(zoomIn: boolean, zoomValues: any[]): void {
        var i, zoomIndex: number, isFixedValue: boolean;
        for (i = 0; i < zoomValues.length; i++) {
            if (zoomValues[i].value > this.zoomFactor) {
                zoomIndex = i - 0.5;
                break;
            } else if (zoomValues[i].value === this.zoomFactor) {
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
        } else {
            zoomIndex = Math.ceil(zoomIndex) - 1;
        }

        this.zoomFactor = zoomValues[zoomIndex].value;
    }

    // Gets the document source of the viewer.
    _getDocumentSource(): _DocumentSource {
        return this._documentSource;
    }

    // Sets the document source of the viewer.
    _setDocumentSource(value: _DocumentSource) {
        this._loadDocument(value).then(v => {
            if (this._documentSource != value) {
                return;
            }
            this._ensureExportFormatsLoaded();
        });
    }

    _loadDocument(value: _DocumentSource, force = false, disposeSource = true): IPromise {
        var promise = new _Promise();
        if ((this._documentSource === value) && !force) {
            return promise;
        }

        this._disposeDocument(disposeSource);
        this._documentSource = value;
        if (value) {
            _addWjHandler(this._documentEventKey, value.loading, () => {
                this._updateUI();
            }, this);

            _addWjHandler(this._documentEventKey, value.loadCompleted, this._onDocumentSourceLoadCompleted, this);
            _addWjHandler(this._documentEventKey, value.queryLoadingData, (s, e: QueryLoadingDataEventArgs) => {
                this.onQueryLoadingData(e);
            }, this);

            if (!value.isLoadCompleted) {
                this._showViewPanelMessage();
                value.load().then(v => {
                    this._keepServiceConnection();
                    promise.resolve(v);
                }).catch(reason => {
                    this._showViewPanelErrorMessage(_getErrorMessage(reason));
                });
            } else {
                this._onDocumentSourceLoadCompleted();
                this._keepServiceConnection();
                promise.resolve();
            }
        }

        this._onDocumentSourceChanged();
        return promise;
    }

    protected _actionElementClicked(element: SVGElement) {
        var action = this._getActionInfo(element);
        if (action) {
            if (action.kind === _ActionKind.Bookmark) {
                this._goToBookmark(action);
            } else {
                if (action.kind === _ActionKind.Custom) {
                    this._executeCustomAction(action);
                }
            }
        }
    }

    protected _getActionInfo(element: SVGElement): _IDocAction {
        var atr = element.getAttribute(_Page._bookmarkAttr);
        if (atr) {
            return { kind: _ActionKind.Bookmark, data: atr };
        }

        if (atr = element.getAttribute(_Page._customActionAttr)) {
            return { kind: _ActionKind.Custom, data: atr };
        }

        return null;
    }

    private _onDocumentSourceLoadCompleted(): void {
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
                page.linkClicked.addHandler((s, e: _LinkClickedEventArgs) => {
                    if (!(this._magnifier && this._magnifier.isActive || this._rubberband && this._rubberband.isActive)) {
                        this._actionElementClicked(e.element);
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
                this.viewMode = ViewMode.Single;
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
    }

    _createPage(index: number, defPageSize: _ISize): _Page {
        return new _Page(this._documentSource, index, defPageSize);
    }

    _clearKeepSerConnTimer() {
        if (this._keepSerConnTimer != null) {
            clearTimeout(this._keepSerConnTimer);
        }
    }

    _keepServiceConnection() {
        this._clearKeepSerConnTimer();
        var documentSource = this._documentSource;
        if (!documentSource) {
            return;
        }

        this._keepSerConnTimer = setTimeout(() => {
            if (this._documentSource !== documentSource) {
                return;
            }

            this._documentSource.getStatus().then(v => this._keepServiceConnection());
        }, this._getExpiredTime());
    }

    _getExpiredTime(): number {
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
    }

    _disposeDocument(disposeSource = true): void {
        if (this._documentSource) {
            _removeAllWjHandlers(this._documentEventKey, this._documentSource.disposed);
            _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageCountChanged);
            _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageSettingsChanged);
            _removeAllWjHandlers(this._documentEventKey, this._documentSource.loadCompleted);
            _removeAllWjHandlers(this._documentEventKey, this._documentSource.queryLoadingData);

            if (disposeSource) {
                this._documentSource.dispose();
            }
        }

        this._resetDocument();
    }

    _resetDocument(): void {
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
    }

    _setDocumentRendering(): void {
        this._documentSource._updateIsLoadCompleted(false);
    }

    /**
     * Moves to the page at the specified index.
     *
     * @param index Index (0-base) of the page to move to.
     * @return An {@link wijmo.viewer.IPromise} object with current page index.
     */
    moveToPage(index: number): IPromise {
        return this._innerMoveToPage(index);
    }

    private _getCurrentPosition(): _IDocumentPosition {
        return _getPositionByHitTestInfo(this._pageView.hitTest(0, 0));
    }

    private _resolvePageIndex(pageIndex: number): number {
        return Math.min(this._documentSource.pageCount - 1, Math.max(pageIndex, 0));
    }

    private _innerMoveToPage(pageIndex: number): IPromise {
        var resolvedIndex = this._resolvePageIndex(pageIndex);
        if (resolvedIndex != this.pageIndex) {
            this._pageMoving = true;
            this._addHistory(false, true);
        }
        this._updatePageIndex(pageIndex);
        return this._pageView.moveToPage(this.pageIndex).then(() => {
            this._pageMoving = false;
        });
    }

    private _moveToLastPage(): IPromise {
        var promise = new _Promise();
        if (!this._ensureDocumentLoadCompleted(promise)) {
            return promise;
        }

        return this._innerMoveToPage(this._documentSource.pageCount - 1);
    }

    private _moveBackwardHistory() {
        if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canBackward()) {
            return;
        }

        var history = this._historyManager.backward();
        this._moveToHistory(history);
    }

    private _moveForwardHistory() {
        if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canForward()) {
            return;
        }

        var history = this._historyManager.forward();
        this._moveToHistory(history);
    }

    private _moveToHistory(history: _IHistory) {
        if (!history) {
            return;
        }

        this._historyMoving = true;
        this.viewMode = history.viewMode;
        if (history.zoomMode === ZoomMode.Custom) {
            this.zoomFactor = history.zoomFactor;
        } else {
            this.zoomMode = history.zoomMode;
        }

        this._scrollToPosition(history.position).then(_ => {
            this._historyMoving = false;
        });

        for (var i = 0; i < history.pageAngles.length; i++) {
            this._pageView.rotatePageTo(i, history.pageAngles[i]);
        }
    }

    private _isPositionEquals(p1: _IDocumentPosition, p2: _IDocumentPosition, checkBounds: boolean): boolean {
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
    }

    private _isPageAnglesChanged(pageAngles: _RotateAngle[]) {
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
    }

    private _updateHistoryCurrent(positionOnly: boolean = false) {
        this._historyManager.current.position = this._getCurrentPosition();
        if (!positionOnly) {
            this._historyManager.current.zoomMode = this.zoomMode;
            this._historyManager.current.zoomFactor = this.zoomFactor;
            this._historyManager.current.viewMode = this.viewMode;
            this._updateCurrentPageAngles(this._historyManager.current);
        }
    }

    private _innerAddHistory(checkBounds: boolean) {
        var currentPosition = this._getCurrentPosition(),
            current = this._historyManager.current;

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
    }


    private _addHistory(checkBounds: boolean, delay: boolean, history?: _IHistory, prohibitOther = false) {
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
        this._historyTimer = setTimeout(() => {
            this._historyTimer = null;
            this._innerAddHistory(checkBounds);
            this._prohibitAddHistory = false;
        }, ViewerBase._historyTimeout);
    }

    private _updateCurrentPageAngles(current: _IHistory) {
        if (!current.pageAngles) {
            current.pageAngles = new Array<_RotateAngle>();
        }
        var pagesLength = this._pageView.pages.length;
        for (var i = 0; i < pagesLength; i++) {
            current.pageAngles[i] = this._pageView.pages[i].rotateAngle;
        }
    }

    private _mergeHistory(history?: _IHistory) {
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
            current.pageAngles = new Array<_RotateAngle>();
            var pagesLength = this._pageView.pages.length;
            for (var i = 0; i < pagesLength; i++) {
                current.pageAngles[i] = history.pageAngles[i];
            }
        }
    }

    private _ensureDocumentLoadCompleted(promise?: _Promise): boolean {
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
    }

    _updatePageIndex(index: number) {
        if (!this._documentSource) {
            return;
        }

        index = Math.min(this._documentSource.pageCount - 1, Math.max(index, 0));
        if (this._pageIndex === index) {
            return;
        }

        this._pageIndex = index;
        this.onPageIndexChanged();
    }

    private _getRotatedAngle(currentAngle: _RotateAngle): _RotateAngle {
        switch (currentAngle) {
            case _RotateAngle.NoRotate:
                return _RotateAngle.Rotation90;
            case _RotateAngle.Rotation90:
                return _RotateAngle.Rotation180;
            case _RotateAngle.Rotation180:
                return _RotateAngle.Rotation270;
            case _RotateAngle.Rotation270:
                return _RotateAngle.NoRotate;
        }
        return _RotateAngle.NoRotate;
    }

    private _rotateDocument() {
        this._addHistory(false, true);
        var pagesLength = this._pageView.pages.length;
        for (var i = 0; i < pagesLength; i++) {
            this._pageView.rotatePageTo(i, this._getRotatedAngle(this._pageView.pages[i].rotateAngle));
        }
    }

    private _rotatePage() {
        this._addHistory(false, true);
        var currentPage = this._pageView.pages[this._pageIndex];
        this._pageView.rotatePageTo(this._pageIndex, this._getRotatedAngle(currentPage.rotateAngle));
    }

    /**
     * Gets or sets a value indicating the current zoom mode to show the document pages.
     */
    get zoomMode(): ZoomMode {
        return this._pageView.zoomMode;
    }
    set zoomMode(value: ZoomMode) {
        this._pageView.zoomMode = wijmo.asEnum(value, ZoomMode);
    }

    /**
     * Gets or sets a value indicating the current zoom factor to show the document pages.
     */
    get zoomFactor(): number {
        return this._pageView.zoomFactor;
    }
    set zoomFactor(value: number) {
        this._pageView.zoomFactor = value;
    }

    /**
    * Gets or sets a value indicating how to show the document pages.
    */
    get viewMode(): ViewMode {
        return this._viewMode;
    }
    set viewMode(value: ViewMode) {
        value = wijmo.asEnum(value, ViewMode);

        if (this._viewMode !== value) {
            const oldValue = this._viewMode;
            this._viewMode = value;
            this.onViewModeChanged(oldValue, value);
        }
    }

    /**
    * Gets or sets a value indicating the mouse behavior.
    *
    * The default is SelectTool which means clicking and dragging the mouse will select the text.
    */
    get mouseMode(): MouseMode {
        return this._mouseMode;
    }
    set mouseMode(value: MouseMode) {
        if (this._mouseMode === (value = wijmo.asEnum(value, MouseMode))) {
            return;
        }

        this._mouseMode = value;
        switch (this._mouseMode) {
            case MouseMode.RubberbandTool:
                this._rubberband.activate();
                this._magnifier.deactivate();
                break;
            case MouseMode.MagnifierTool:
                this._magnifier.activate();
                this._rubberband.deactivate();
                break;
            default:
                this._magnifier.deactivate();
                this._rubberband.deactivate();
                break;
        }
        this.onMouseModeChanged();
    }

    /**
    * Gets or sets a value indicating whether the viewer is under full screen mode.
    */
    get fullScreen(): boolean {
        return this._fullScreen;
    }
    set fullScreen(value: boolean) {
        if (this._fullScreen === value) {
            return;
        }

        this._fullScreen = value;
        this.onFullScreenChanged();
    }

    /**
    * Gets the index of the page which is currently displayed in the view panel.
    */
    get pageIndex(): number {
        return this._pageIndex;
    }

    private _initMiniToolbar() {
        var miniToolbar = <_ViewerMiniToolbar>wijmo.Control.getControl(this._miniToolbar);
        if (!miniToolbar) {
            new _ViewerMiniToolbar(this._miniToolbar, this);
            wijmo.addClass(this._miniToolbar, "wj-mini-toolbar");
        }
    }

    private _pinMiniToolbar() {
        this._showMiniToolbar(true);
        this._miniToolbarPinnedTimer = setTimeout(() => {
            this._showMiniToolbar(false);
            this._miniToolbarPinnedTimer = null;
        }, ViewerBase._miniToolbarPinnedTime);
    }

    // Raises the {@link _documentSourceChanged} event.
    // @param e The event arguments.
    _onDocumentSourceChanged(e?: wijmo.EventArgs) {
        this._clearExportFormats();

        this._documentSourceChanged.raise(this);

        this._updateViewerActions();
        this._onPageSettingsUpdated();
        this._onPageCountUpdated();
        this._updateViewModeActions();
        this._searchManager.documentSource = this._documentSource;

        if (this._documentSource) {
            _addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, this._onPageSettingsUpdated, this);
            _addWjHandler(this._documentEventKey, this._documentSource.pageCountChanged, this._onPageCountUpdated, this);
            _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, this._onPageCountUpdated, this);
        }
    }

    /**
     * Raises the {@link pageIndexChanged} event.
     * 
     * @param e The {@link EventArgs} object.
     */
    onPageIndexChanged(e?: wijmo.EventArgs) {
        this.pageIndexChanged.raise(this);
        this._updatePageNavActions();
    }

    /**
     * Raises the {@link viewModeChanged} event.
     * 
     * @param e The {@link EventArgs} object.
     */
    onViewModeChanged(oldValue: ViewMode, newValue: ViewMode) {
        this.viewModeChanged.raise(this, { oldValue, newValue });
        this._updateViewModeActions();
        (<_CompositePageView>this._pageView).viewMode = this.viewMode;
    }

    /**
     * Raises the {@link mouseModeChanged} event.
     * 
     * @param e The {@link EventArgs} object.
     */
    onMouseModeChanged(e?: wijmo.EventArgs) {
        this.mouseModeChanged.raise(this);

        //if mouse mode is move or select, do nothing on mobile.
        if ((this.mouseMode === MouseMode.MoveTool || this.mouseMode === MouseMode.SelectTool) && wijmo.isMobile()) {
            return;
        }
        this._updateMouseModeActions();

        this._updateViewContainerCursor();
        this._pageView.panMode = this.mouseMode === MouseMode.MoveTool;
    }

    /**
     * Raises the {@link fullScreenChanged} event.
     * 
     * @param e The {@link EventArgs} object.
     */
    onFullScreenChanged(e?: wijmo.EventArgs) {
        this.fullScreenChanged.raise(this);
        this._setViewerAction(_ViewerActionType.ToggleFullScreen);
        this._updateFullScreenStyle();
        if (this.fullScreen) {
            this._pinMiniToolbar();
        }
    }

    /**
     * Raises the {@link zoomFactorChanged} event.
     * 
     * @param e The {@link EventArgs} object.
     */
    onZoomFactorChanged(e?: wijmo.EventArgs) {
        this.zoomFactorChanged.raise(this, e);

        this._updateZoomFactorActions();
        this._updateZoomModeActions();
    }

    /**
     * Raises the {@link zoomModeChanged} event.
     *
     * @param e The {@link EventArgs} object.
     */
    onZoomModeChanged(e?: wijmo.EventArgs) {
        this.zoomModeChanged.raise(this, e);

        this._updateZoomModeActions();
        this._updateZoomFactorActions();
    }

    /**
     * Raises the {@link queryLoadingData} event.
     * 
     * @param e The {@link QueryLoadingDataEventArgs} object that contains the loading data.
     */
    onQueryLoadingData(e: QueryLoadingDataEventArgs) {
        this.queryLoadingData.raise(this, e);
    }

    /**
     * Raises the {@link beforeSendRequest} event.
     * 
     * @param e The {@link RequestEventArgs} object.
     */
    onBeforeSendRequest(e: RequestEventArgs) {
        this.beforeSendRequest.raise(this, e);
    }

    /**
     * Raises the {@link pageLoaded} event.
     * 
     * @param e The {@link PageLoadedEventArgs} object.
     */
    onPageLoaded(e: PageLoadedEventArgs) {
        this.pageLoaded.raise(this, e);
    }

    // IHttpRequestHandler implementation
    beforeSend(e: RequestEventArgs) {
        this.onBeforeSendRequest(e);
    }
}

    }
    


    module wijmo.viewer {
    


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
export class PdfViewer extends ViewerBase {

    /**
     * Initializes a new instance of the {@link PdfViewer} class.
     *
     * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, options);
    }
    
    _getProductInfo(): string {
        return 'QNI5,PdfViewer';
    }

    get _innerDocumentSource(): _PdfDocumentSource {
        return <_PdfDocumentSource>this._getDocumentSource();
    }

    _getSource(): _PdfDocumentSource {
        if (!this.filePath) {
            return null;
        }

        return new _PdfDocumentSource({
            serviceUrl: this.serviceUrl,
            filePath: this.filePath
        }, this);
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _ViewerMiniToolbar extends _ViewerToolbarBase {
    // globalize element
    private _gPrint: HTMLElement;
    private _gPreviousPage: HTMLElement;
    private _gNextPage: HTMLElement;
    private _gZoomOut: HTMLElement;
    private _gZoomIn: HTMLElement;
    private _gExitFullScreen: HTMLElement;

    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);
    }

    _initToolbarItems() {
        let ci = wijmo.culture.Viewer;
        this._gPrint = this.addSvgButton(ci.print, icons.print, _ViewerActionType.Print);
        this.addSeparator();
        this._gPreviousPage = this.addSvgButton(ci.previousPage, icons.previousPage, _ViewerActionType.PrePage);
        this._gNextPage = this.addSvgButton(ci.nextPage, icons.nextPage, _ViewerActionType.NextPage);
        _ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
        this.addSeparator();
        this._gZoomOut = this.addSvgButton(ci.zoomOut, icons.zoomOut, _ViewerActionType.ZoomOut);
        this._gZoomIn = this.addSvgButton(ci.zoomIn, icons.zoomIn, _ViewerActionType.ZoomIn);
        this._gExitFullScreen = this.addSvgButton(ci.exitFullScreen, icons.exitFullScreen, _ViewerActionType.ToggleFullScreen, true);
    }

    _globalize() {
        var ci = wijmo.culture.Viewer;
        this._gPrint.title = ci.print;
        this._gPreviousPage.title = ci.previousPage;
        this._gNextPage.title = ci.nextPage;
        this._gZoomOut.title = ci.zoomOut;
        this._gZoomIn.title = ci.zoomIn;
        this._gExitFullScreen.title = ci.exitFullScreen;
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _ViewerToolbar extends _ViewerToolbarBase {
    //globalize elements
    private _gPaginated: HTMLElement;
    private _gPrint: HTMLElement;
    private _gExports: HTMLElement;
    private _gPortrait: HTMLElement;
    private _gLandscape: HTMLElement;
    private _gPageSetup: HTMLElement;
    private _gFirstPage: HTMLElement;
    private _gPreviousPage: HTMLElement;
    private _gNextPage: HTMLElement;
    private _gLastPage: HTMLElement;
    private _gBackwardHistory: HTMLElement;
    private _gForwardHistory: HTMLElement;
    private _gSelectTool: HTMLElement;
    private _gMoveTool: HTMLElement;
    private _gContinuousMode: HTMLElement;
    private _gSingleMode: HTMLElement;
    private _gWholePage: HTMLElement;
    private _gPageWidth: HTMLElement;
    private _gZoomOut: HTMLElement;
    private _gZoomIn: HTMLElement;
    private _gRubberbandTool: HTMLElement;
    private _gMagnifierTool: HTMLElement;
    private _gRotatePage: HTMLElement;
    private _gRotateDocument: HTMLElement;
    private _gFullScreen: HTMLElement;

    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);
    }

    _globalize() {
        let ci = wijmo.culture.Viewer;
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
    }

    _initToolbarItems() {
        let ci = wijmo.culture.Viewer;
        this._gPaginated = this.addSvgButton(ci.paginated, icons.paginated, _ViewerActionType.TogglePaginated, true);
        this._gPrint = this.addSvgButton(ci.print, icons.print, _ViewerActionType.Print);
        this._gExports = this.addSvgButton(ci.exports, icons.exports, _ViewerActionType.ShowExportsPanel);
        this.addSeparator();
        this._gPortrait = this.addSvgButton(ci.portrait, icons.portrait, _ViewerActionType.Portrait);
        this._gLandscape = this.addSvgButton(ci.landscape, icons.landscape, _ViewerActionType.Landscape);
        this._gPageSetup = this.addSvgButton(ci.pageSetup, icons.pageSetup, _ViewerActionType.ShowPageSetupDialog);
        this.addSeparator();
        this._gFirstPage = this.addSvgButton(ci.firstPage, icons.firstPage, _ViewerActionType.FirstPage);
        this._gPreviousPage = this.addSvgButton(ci.previousPage, icons.previousPage, _ViewerActionType.PrePage);
        this._gNextPage = this.addSvgButton(ci.nextPage, icons.nextPage, _ViewerActionType.NextPage);
        this._gLastPage = this.addSvgButton(ci.lastPage, icons.lastPage, _ViewerActionType.LastPage);
        _ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
        this.addSeparator();
        this._gBackwardHistory = this.addSvgButton(ci.backwardHistory, icons.backwardHistory, _ViewerActionType.Backward);
        this._gForwardHistory = this.addSvgButton(ci.forwardHistory, icons.forwardHistory, _ViewerActionType.Forward);
        this.addSeparator();
        this._gSelectTool = this.addSvgButton(ci.selectTool, icons.selectTool, _ViewerActionType.SelectTool);
        this._gMoveTool = this.addSvgButton(ci.moveTool, icons.moveTool, _ViewerActionType.MoveTool);
        this._gContinuousMode = this.addSvgButton(ci.continuousMode, icons.continuousView, _ViewerActionType.Continuous);
        this._gSingleMode = this.addSvgButton(ci.singleMode, icons.singleView, _ViewerActionType.Single);
        this.addSeparator();
        this._gWholePage = this.addSvgButton(ci.wholePage, icons.fitWholePage, _ViewerActionType.FitWholePage);
        this._gPageWidth = this.addSvgButton(ci.pageWidth, icons.fitPageWidth, _ViewerActionType.FitPageWidth);
        this._gZoomOut = this.addSvgButton(ci.zoomOut, icons.zoomOut, _ViewerActionType.ZoomOut);
        this._gZoomIn = this.addSvgButton(ci.zoomIn, icons.zoomIn, _ViewerActionType.ZoomIn);
        //todo change rubberband icon.
        this._gRubberbandTool = this.addSvgButton(ci.rubberbandTool, icons.rubberbandTool, _ViewerActionType.RubberbandTool);
        this._gMagnifierTool = this.addSvgButton(ci.magnifierTool, icons.magnifierTool, _ViewerActionType.MagnifierTool);
        this._gRotateDocument = this.addSvgButton(ci.rotateDocument, icons.rotateDocument, _ViewerActionType.RotateDocument);
        this._gRotatePage = this.addSvgButton(ci.rotatePage, icons.rotatePage, _ViewerActionType.RotatePage);
        _ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer);
        this._gFullScreen = this.addSvgButton(ci.fullScreen, icons.fullScreen, _ViewerActionType.ToggleFullScreen, true);
    }
}
    }
    


    module wijmo.viewer {
    




'use strict';

export class _ViewerMobileToolbarBase extends _ViewerToolbarBase {
    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);

        wijmo.addClass(this.hostElement, 'mobile');
    }
}
    }
    


    module wijmo.viewer {
    







'use strict';

export class _ViewerZoomBar extends _ViewerMobileToolbarBase {
    // globalize element
    private _gZoomOut: HTMLElement;
    private _gZoomIn: HTMLElement;

    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);

        wijmo.addClass(this.hostElement, 'wj-zoombar');
    }

    _initToolbarItems() {
        let ci = wijmo.culture.Viewer;
        this._gZoomOut = this.addSvgButton(ci.zoomOut, icons.zoomOut, _ViewerActionType.ZoomOut);
        _ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer);
        this._gZoomIn = this.addSvgButton(ci.zoomIn, icons.zoomIn, _ViewerActionType.ZoomIn);
    }

    _globalize() {
        let ci = wijmo.culture.Viewer;
        this._gZoomOut.title = ci.zoomOut;
        this._gZoomIn.title = ci.zoomIn;
    }
}
    }
    


    module wijmo.viewer {
    







'use strict';

export class _ViewerMobileToolbar extends _ViewerMobileToolbarBase {
    // globalize element
    private _gShowHamburgerMenu: HTMLElement;
    private _gPrevPage: HTMLElement;
    private _gNextPage: HTMLElement;
    private _gShowViewMenu: HTMLElement;
    private _gShowSearchBar: HTMLElement;
    private _gFullScreen: HTMLElement;

    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);
    }

    _initToolbarItems() {
        let ci = wijmo.culture.Viewer;
        this._gShowHamburgerMenu = this.addSvgButton(ci.hamburgerMenu, icons.hamburgerMenu, _ViewerActionType.ShowHamburgerMenu);
        this.viewer._initHamburgerMenu(this._gShowHamburgerMenu);
        this._gPrevPage = this.addSvgButton(ci.previousPage, icons.previousPage, _ViewerActionType.PrePage);
        this._gNextPage = this.addSvgButton(ci.nextPage, icons.nextPage, _ViewerActionType.NextPage);
        _ViewerToolbarBase._initToolbarPageNumberInput(this.hostElement, this.viewer);
        this._gShowViewMenu = this.addSvgButton(ci.viewMenu, icons.viewMenu, _ViewerActionType.ShowViewMenu);
        this.viewer._initViewMenu(this._gShowViewMenu);
        this._gShowSearchBar = this.addSvgButton(ci.showSearchBar, icons.search, _ViewerActionType.ShowSearchBar, true);
        this._gFullScreen = this.addSvgButton(ci.fullScreen, icons.fullScreen, _ViewerActionType.ToggleFullScreen, true);
    }

    _globalize() {
        let ci = wijmo.culture.Viewer;
        this._gShowHamburgerMenu.title = ci.hamburgerMenu;
        this._gPrevPage.title = ci.previousPage;
        this._gNextPage.title = ci.nextPage;
        this._gShowViewMenu.title = ci.viewMenu;
        this._gShowSearchBar.title = ci.showSearchBar;
        this._gFullScreen.title = ci.fullScreen;
    }
}
    }
    


    module wijmo.viewer {
    








'use strict';

export class _SearchBar extends _ViewerMobileToolbarBase {
    // globalize element
    private _gSearchOptions: HTMLElement;
    private _gSearchPrev: HTMLElement;
    private _gSearchNext: HTMLElement;

    constructor(element: any, viewer: ViewerBase) {
        super(element, viewer);
    }

    _initToolbarItems() {
        let ci = wijmo.culture.Viewer;
        this._gSearchOptions = this.addSvgButton(ci.searchOptions, icons.searchOptions, _ViewerActionType.ShowSearchOptions);
        this.viewer._initSearchOptionsMenu(this._gSearchOptions);
        this._initSearchInput();
        this._initSearchBtnGroups();
    }

    private _initSearchInput() {
        var searchContainerHtml =
            '<div class="wj-searchcontainer">' +
            '<input class="wj-searchbox" wj-part="search-box" type="text"/>' +
            '<div class="wj-btn-group">' +
            '<button class="wj-btn wj-btn-search">' + _createSvgBtn(icons.search).innerHTML + '</button>' +
            '</div>' +
            '</div>',
            searchContainer = _toDOM(searchContainerHtml),
            input = <HTMLInputElement>searchContainer.querySelector('input[type="text"]'),
            searchBtn = searchContainer.querySelector('.wj-btn-search');

        _addEvent(input, 'input', () => { this.viewer._searchManager.text = input.value; });
        _addEvent(searchBtn, 'click', () => { this.viewer._searchManager.search(); });

        this.viewer._searchManager.searchStarted.addHandler(() => {
            // update input value if search is being initiated in other places
            if (input.value !== this.viewer._searchManager.text) {
                input.value = this.viewer._searchManager.text;
            }
            input.disabled = true;
        });

        this.viewer._searchManager.searchCompleted.addHandler(() => {
            input.disabled = false;
        });

        this.viewer._searchManager.textChanged.addHandler(() => {
            // set input value in accordance with search text
            input.value = this.viewer._searchManager.text;
        });

        this.addCustomItem(searchContainer);
    }

    // put all buttons after search container input one div to implement search container auto width.
    private _initSearchBtnGroups() {
        var searchBtnGroupsHtml =
            '<div class="wj-searchbtn-groups wj-btn-group wj-toolbarwrapper">' +
            '</div>',
            searchBtnGroups = _toDOM(searchBtnGroupsHtml);

        let ci = wijmo.culture.Viewer;
        this._gSearchPrev = this.addSvgButton(ci.searchPrev, icons.searchLeft, _ViewerActionType.SearchPrev);
        this._gSearchNext = this.addSvgButton(ci.searchNext, icons.searchRight, _ViewerActionType.SearchNext);
        searchBtnGroups.appendChild(this._gSearchPrev);
        searchBtnGroups.appendChild(this._gSearchNext);

        this.addCustomItem(searchBtnGroups);
    }

    _globalize() {
        let ci = wijmo.culture.Viewer;
        this._gSearchOptions.title = ci.searchOptions;
        this._gSearchPrev.title = ci.searchPrev;
        this._gSearchNext.title = ci.searchNext;
    }
}
    }
    


    module wijmo.viewer {
    





    }
    


    module wijmo.viewer {
    









'use strict';

export class _ViewerMenuBase extends wijmo.input.Menu {
    private _viewer: ViewerBase;

    constructor(viewer: ViewerBase, owner: HTMLElement, options?) {
        super(document.createElement('div'), options);

        this.owner = owner;
        // Have to set hostElement(the empty div) with none display, and add it in document,
        // otherwise, the dropdown element will be shown in middle of the document in DropDown.refresh method.
        this.hostElement.style.display = 'none';
        this.owner.appendChild(this.hostElement);

        this.showDropDownButton = false;
        this.itemClicked.addHandler(this._onItemClicked, this);
        this.formatItem.addHandler(this._formatItem, this);
        this._viewer = viewer;
        this._bindMenuItems();
        this.displayMemberPath = 'title';
        this.selectedValuePath = 'commandTag';
        this._viewer._viewerActionStatusChanged.addHandler((s, e: _IViewerActionChangedEventArgs) => {
            var actionElement = <HTMLElement>this.dropDown.querySelector('[' + _commandTagAttr + '="' + e.action.actionType.toString() + '"]');
            this._updateActionStatusCore(actionElement, e.action);
        });
    }

    get viewer(): ViewerBase {
        return this._viewer;
    }

    private _bindMenuItems() {
        this.itemsSource = this._initItems();
    }

    _initItems(): any[] {
        throw wijmo.culture.Viewer.abstractMethodException;
    }

    _internalFormatItem(item: _ViewerMenuItem, itemElement: HTMLElement) {
        if (!item || item.commandTag === undefined) {
            return;
        }

        _removeChildren(itemElement);
        if (item.icon) {
            var iconSpan = document.createElement('span');
            iconSpan.appendChild(_createSvgBtn(item.icon));
            itemElement.insertBefore(iconSpan, itemElement.firstChild);
        }
        itemElement.setAttribute(_commandTagAttr, item.commandTag.toString());
        this._updateActionStatus(itemElement, item.commandTag);
    }

    private _formatItem(sender: any, e: wijmo.input.FormatItemEventArgs): void {
        this._internalFormatItem(<_ViewerMenuItem>this.itemsSource[e.index], e.item);
    }

    private _onItemClicked(menu: wijmo.input.Menu): void {
        this._viewer._executeAction(parseInt(menu.selectedItem.commandTag));
    }

    _updateActionStatus(actionElement: HTMLElement, actionType: _ViewerActionType) {
        this._updateActionStatusCore(actionElement, {
            actionType: actionType,
            checked: this._viewer._actionIsChecked(actionType),
            disabled: this._viewer._actionIsDisabled(actionType),
            shown: this._viewer._actionIsShown(actionType)
        });
    }

    private _updateActionStatusCore(actionElement: HTMLElement, action: _IViewerAction) {
        _checkImageButton(actionElement, action.checked);
        _disableImageButton(actionElement, action.disabled);
        _showImageButton(actionElement, action.shown);
    }

    _updateItemsStatus() {
        var elements = this.dropDown.querySelectorAll('[' + _commandTagAttr + ']');
        for (var i = 0; i < elements.length; i++) {
            var actionElement = <HTMLElement>elements[i],
                commandTagValue = actionElement.getAttribute(_commandTagAttr);
            if (commandTagValue == null) {
                continue;
            }

            this._updateActionStatus(actionElement, parseInt(commandTagValue));
        }
        _checkSeparatorShown(this.dropDown);
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._bindMenuItems();
        }

        if (this.isDroppedDown) {
            this.showMenu();
        }
    }

    showMenu(above?: boolean) {
        this.selectedIndex = -1;
        wijmo.showPopup(this.dropDown, this.owner, above, false, false);
        this.dropDown.style.color = this._viewer.hostElement.style.color;
        wijmo.addClass(this.dropDown, 'wj-btn-group-vertical');
        wijmo.addClass(this.dropDown, 'wj-viewer-menu');
        this._updateItemsStatus();
        this.dropDown.focus();
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _SearchOptionsMenu extends _ViewerMenuBase {
    constructor(viewer: ViewerBase, owner: HTMLElement, options?) {
        super(viewer, owner, options);
    }

    _initItems(): any[] {
        var items = [];

        items.push({ title: wijmo.culture.Viewer.matchCaseMenuItem, commandTag: _ViewerActionType.SearchMatchCase });
        items.push({ title: wijmo.culture.Viewer.wholeWordMenuItem, commandTag: _ViewerActionType.SearchMatchWholeWord });

        return items;
    }

    _internalFormatItem(item: _ViewerMenuItem, itemElement: HTMLElement) {
        super._internalFormatItem(item, itemElement);

        if (!item || item.commandTag === undefined) {
            return;
        }

        var checkSpan = document.createElement('span');
        checkSpan.innerHTML = wijmo.culture.Viewer.checkMark;
        wijmo.addClass(checkSpan, 'checkIcon');
        itemElement.insertBefore(checkSpan, itemElement.firstChild);
    }

    _updateActionStatus(actionElement: HTMLElement, actionType: _ViewerActionType) {
        super._updateActionStatus(actionElement, actionType);

        if (this.viewer._actionIsChecked(actionType)) {
            wijmo.addClass(actionElement, 'checked');
        } else {
            wijmo.removeClass(actionElement, 'checked');
        }
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _HamburgerMenu extends _ViewerMenuBase {
    constructor(viewer: ViewerBase, owner: HTMLElement, options?) {
        super(viewer, owner, options);
    }

    _initItems(): any[] {
        let items = [],
            ci = wijmo.culture.Viewer;

        items.push({ title: ci.thumbnails, icon: icons.thumbnails, commandTag: _ViewerActionType.ShowThumbnails });
        items.push({ title: ci.outlines, icon: icons.outlines, commandTag: _ViewerActionType.ShowOutlines });
        items.push({ title: ci.exports, icon: icons.exports, commandTag: _ViewerActionType.ShowExportsPanel });
        items.push({ title: ViewerBase._seperatorHtml });
        items.push({ title: ci.portrait, icon: icons.portrait, commandTag: _ViewerActionType.Portrait });
        items.push({ title: ci.landscape, icon: icons.landscape, commandTag: _ViewerActionType.Landscape });
        items.push({ title: ci.pageSetup, icon: icons.pageSetup, commandTag: _ViewerActionType.ShowPageSetupPanel });
        items.push({ title: ViewerBase._seperatorHtml });
        items.push({ title: ci.showZoomBar, icon: icons.showZoomBar, commandTag: _ViewerActionType.ShowZoomBar });
        items.push({ title: ViewerBase._seperatorHtml });
        items.push({ title: ci.paginated, icon: icons.paginated, commandTag: _ViewerActionType.TogglePaginated });
        items.push({ title: ci.print, icon: icons.print, commandTag: _ViewerActionType.Print });
        items.push({ title: ViewerBase._seperatorHtml });
        items.push({ title: ci.backwardHistory, icon: icons.backwardHistory, commandTag: _ViewerActionType.Backward });
        items.push({ title: ci.forwardHistory, icon: icons.forwardHistory, commandTag: _ViewerActionType.Forward });

        return items;
    }
}
    }
    


    module wijmo.viewer {
    






'use strict';

export class _ViewMenu extends _ViewerMenuBase {
    constructor(viewer: ViewerBase, owner: HTMLElement, options?) {
        super(viewer, owner, options);
    }

    _initItems(): any[] {
        var items = [];

        items.push({ title: wijmo.culture.Viewer.singleMode, icon: icons.singleView, commandTag: _ViewerActionType.Single });
        items.push({ title: wijmo.culture.Viewer.continuousMode, icon: icons.continuousView, commandTag: _ViewerActionType.Continuous });
        items.push({ title: ViewerBase._seperatorHtml });
        items.push({ title: wijmo.culture.Viewer.wholePage, icon: icons.fitWholePage, commandTag: _ViewerActionType.FitWholePage });
        items.push({ title: wijmo.culture.Viewer.pageWidth, icon: icons.fitPageWidth, commandTag: _ViewerActionType.FitPageWidth });

        return items;
    }
}
    }
    


    module wijmo.viewer {
    


    }
    


    module wijmo.viewer {
    






'use strict';

export class _ReportHamburgerMenu extends _HamburgerMenu {
    constructor(viewer: ViewerBase, owner: HTMLElement, options?) {
        super(viewer, owner, options);
    }

    _initItems(): any[] {
        var items = super._initItems();
        items.splice(2, 0, { title: wijmo.culture.Viewer.parameters, icon: parametersIcon, commandTag: ReportViewer._parameterCommandTag });
        return items;
    }
}
    }
    


    module wijmo.viewer {
    










'use strict';

enum _ArReportFormat {
    Rpx = 0,
    Rdf = 1,
    Rdlx = 2
}

export enum _ArDocumentFormat {
    Image = 3, // tiff
    Pdf = 4,
    Html = 5,
    Word = 6,
    Xls = 7,
    Xml = 8,
    Svg = 9
}

export enum _ArLoadState {
    NotStarted = 0,
    Rendering = 1,
    Rendered = 2,
    Cancelling = 3,
    Cancelled = 4,
    Error = 5
}

export enum _ArErrorCode {
    InvalidCulture = 0,
    InvalidVersion = 1,
    UnknownReportType = 2,
    NoSuchReport = 3,
    ParametersNotSet = 4,
    RuntimeIsBusy = 5,
    InternalError = 6,
    ParameterNotExists = 7,
    NoAcceptableFormats = 8,
    InvalidToken = 9,
    UnsupportedFormat = 10,
    InvalidSetOfParameters = 11,
    MethodNotSupported = 12,
    NoValidLicenseFound = 13
}

interface _IJsonHttpRequest extends _IHttpRequest {
    parseResponse?: boolean; // default is 'undefined', true.
}

export interface _IArError {
    Description: string;
    ErrorCode: _ArErrorCode;
}

export interface _IArMethodResponse {
    Error: _IArError
}

export interface _IArJsonResponse<T extends _IArMethodResponse> {
    xhr: XMLHttpRequest;
    json?: T;
}

interface _IArInstanceMethodResponse extends _IArMethodResponse {
    Token: string;
}

interface _IArOpenReportResult extends _IArInstanceMethodResponse {
    ParameterCollection: _IArParameter[];
    HasDelayedContent: boolean;
    AutoRun: boolean;
    ProductVersion: string;
    DocumentFormat: _ArReportFormat;
}

interface _IArRunReportResult extends _IArInstanceMethodResponse {
    ParameterCollection: _IArParameter[];
    HasDelayedContent: boolean;
    AutoRun: boolean;
}

interface _IArProcessOnClickResult extends _IArInstanceMethodResponse {
    ParameterCollection: _IArParameter[];
    HasDelayedContent: boolean;
    AutoRun: boolean;
}

interface _IArGetReportPropertyResult extends _IArInstanceMethodResponse {
    PropertyValue: boolean;
}

interface _IArSetParametersResult extends _IArInstanceMethodResponse {
    ParameterCollection: _IArParameter[];
}

interface _IArValidateParameterResult extends _IArInstanceMethodResponse {
    ParameterCollection: _IArParameter[];
}

interface _IArGetStatusResult extends _IArMethodResponse {
    LoadState: _ArLoadState;
    AvailablePages: number;
}

interface _IArGetRenderedReportLinkResult extends _IArInstanceMethodResponse {
    ReportLink: {
        Uri: string;
        Kind: _ArDocumentFormat;
    }
}

interface _IArGetExportedReportLinkResult extends _IArInstanceMethodResponse {
    ReportLink: {
        Uri: string;
        Kind: _ArDocumentFormat;
    }
}

interface _IArSearchItem {
    DisplayText: string;
    ItemIndex: number;
    ItemArea: {
        Left: number;
        Top: number;
        Width: number;
        Height: number;
    },
    PageIndex: number;
    TextStart: number;
    TextLen: number;
}

interface _IArSearchResult extends _IArInstanceMethodResponse {
    SearchResults: _IArSearchItem[];
}

interface _IArBoormark {
    ID: number;
    Name: string;
    Page: number;
    Location: {
        X: number;
        Y: number;
    };
    Size: {
        Width: number;
        Height: number;
    };
    ChildrenCount: number;
    //Parent: string;
    //Children: _IArBoormark[];
}

export interface _IADrillthroughReportData {
    Parameters: _IArParameter[],
    NumberOfParameters: number;
    ReportName: string;
}

interface _IArGetBookmarksResult extends _IArInstanceMethodResponse {
    FromChild: number;
    ChildrenCount: number;
    Bookmarks: _IArBoormark[];
}

var ticksOffsetFromUnixEpoch = 621355968000000000;
var ticksInMillisecond = 10000;
var millisecondsInMinute = 60000;

export class _ArReportService extends _DocumentService {
    static StateToStatus(state: _ArLoadState): _ExecutionStatus {
        switch (state) {
            case _ArLoadState.NotStarted:
                return _ExecutionStatus.notFound;
            case _ArLoadState.Rendered:
                return _ExecutionStatus.completed;
            case _ArLoadState.Rendering:
                return _ExecutionStatus.rendering;
            case _ArLoadState.Cancelled:
                return _ExecutionStatus.stopped;
            default:
                throw `Not supported state: ${state}`;
        }
    }

    static ConvertFormat(format: string): _ArDocumentFormat {
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
                throw `Not supported format: ${format}`;
        }
    }

    private _lifeTime = 600 * 1000; //  10 minutes - default life time
    private _drillthroughData: _IADrillthroughReportData = null;
    private _token: string;
    private _parameters: _IArParameter[];
    private _hasDelayedContent: boolean;
    private _canChangeRenderMode = false;
    private _documentFormat: _ArReportFormat;
    private _autoRun: boolean;
    private _uid = new Date().getTime().toString();
    private _isDisposed = false;
    private _hasOutlines: boolean = undefined;

    static IsError(data: _IArJsonResponse<_IArMethodResponse>): data is _IArJsonResponse<_IArMethodResponse> {
        return !!(data && data.json && data.json.Error);
    }

    get isDisposed() {
        return this._isDisposed;
    }

    get autoRun(): boolean {
        return this._autoRun;
    }

    get canChangeRenderMode(): boolean {
        return this._canChangeRenderMode;
    }

    get parameters(): _IArParameter[] {
        return this._parameters || [];
    }

    getStatus(): IPromise {
        var promise = new _Promise();

        if (this._isDisposed) { // stop "GetStatus" requests loop after closing report.
            return promise.resolve({ status: _ExecutionStatus.cleared });
        }

        if (!this._token) {
            return promise.resolve({ status: _ExecutionStatus.notFound });
        }

        this._ajax(this.serviceUrl + '/GetStatus', {
            method: 'POST',
            data: { token: this._token }
        }).then((r: _IArJsonResponse<_IArGetStatusResult>) => {
            let status = _ArReportService.StateToStatus(r.json.LoadState),
                res = <_IDocumentStatus>{
                    errorList: r.json.Error ? [r.json.Error.Description] : [],
                    pageCount: r.json.AvailablePages,
                    hasOutlines: !!this._hasOutlines,
                    progress: 0,
                    status: status
                };

            // Check whether the report has outlines or not (we can request bookmarks only when the report is loaded completely) and cache the result.
            if ((status === _ExecutionStatus.completed) && (this._hasOutlines == null)) {
                this.getOutlines(true).then((b: _IArBoormark[]) => {
                    res.hasOutlines = this._hasOutlines = ((b || []).length > 0);
                    promise.resolve(res);
                });
            } else {
                promise.resolve(res);
            }
        }, error => {
            promise.reject(this._getError(error));
        });

        return promise;
    }

    // Return an IPromise with IPageSettings.
    setPageSettings(pageSettings: _IPageSettings): IPromise {
        throw _DocumentSource._abstractMethodException;
    }

    // Return an IPromise with _IDocumentPosition.
    getBookmark(name: string): IPromise {
        let promise = new _Promise(),
            datas = name.split('|'); // pageNumber|[x y]

        return promise.resolve(<_IDocumentPosition>{
            pageIndex: parseInt(datas[0], 10) - 1,
            pageBounds: (v => {
                if (v) {
                    let vals = v.split(' ');
                    return {
                        x: _Unit.convertValue(parseFloat(vals[0]), _UnitType.Dip, _UnitType.Twip),
                        y: _Unit.convertValue(parseFloat(vals[1]), _UnitType.Dip, _UnitType.Twip)
                    };
                }
            })(datas[1])
        });
    }

    // Return an IPromise with _IDocumentPosition.
    executeCustomAction(action: _IArDocAction): IPromise {
        switch (action.arKind) {
            case _ArActionKind.Drillthrough:
                var data = JSON.parse(action.data);
                return new _Promise().resolve(data);

            case _ArActionKind.Toggle:
                return this.processOnClick(action.data);

            default:
                return new _Promise().reject(`Not implemented action: ${action.arKind}`);
        }
    }

    // The data argument comes from the queryLoadingData
    load(data?: any): IPromise {
        var clientParams: IArClientParameter[] = [];

        if (data) {
            // extract parameters
            let ptrn = 'parameters.';

            Object.keys(data).forEach(v => {
                if (v.indexOf(ptrn) === 0) {
                    clientParams.push({
                        Name: v.substring(ptrn.length),
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

        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/OpenReport', {
            method: 'POST',
            data: this._merge(data, {
                acceptedFormats: [_ArDocumentFormat.Svg],
                culture: 'en-US',
                lifeTime: this._lifeTime / 1000,
                reportPath: this.filePath,
                version: 4
            })
        }).then((r: _IArJsonResponse<_IArOpenReportResult>) => {
            this._hasDelayedContent = r.json.HasDelayedContent;
            this._autoRun = !!r.json.AutoRun;
            this._documentFormat = r.json.DocumentFormat;
            this._parameters = (r.json.ParameterCollection || []).map(v => this._convertFromServiceParameter(v));
            this._token = r.json.Token;
            this._isDisposed = false;

            let date = new Date(),
                expDate = new Date(date.getTime() + this._lifeTime);

            return <_IArExecutionInfo>{
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
                pageSettings: { // TODO: need a way to retrieve it from the server?
                    height: new _Unit(1056, _UnitType.Dip),
                    width: new _Unit(816, _UnitType.Dip),
                    leftMargin: new _Unit(48, _UnitType.Dip),
                    rightMargin: new _Unit(48, _UnitType.Dip),
                    topMargin: new _Unit(48, _UnitType.Dip),
                    bottomMargin: new _Unit(48, _UnitType.Dip),
                    paginated: true,
                },
                status: {
                    errorList: r.json.Error ? [r.json.Error.Description] : [],
                    expiredDateTime: expDate,
                    //hasOutlines: true, // force to call getOutlines()
                    pageCount: 0,
                    progress: 0,
                    status: _ExecutionStatus.loaded
                }
            };
        }).then((info: _IExecutionInfo) => {
            this.getReportProperty("ChangeRenderModeSupported").then(val => {
                this._canChangeRenderMode = !!val;

                // perform validation
                if (clientParams && clientParams.length) {
                    var params = this._mergeParameters(clientParams, this._parameters);
                    this.setParameters(params).then((value) => {
                        promise.resolve(info);
                    });
                } else {
                    promise.resolve(info);
                }
            });
        }).catch(xhr => {
            promise.reject(this._getError(xhr));
        });

        return promise;
    }

    loadDrillthroughReport(data: _IADrillthroughReportData): IPromise {
        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/OpenDrillthroughReport', {
            method: 'POST',
            data: {
                token: this._token,
                lifeTime: this._lifeTime / 1000,
                reportPath: data.ReportName
            }
        }).then((r: _IArJsonResponse<_IArOpenReportResult>) => {
            this.dispose(false).then(() => {
                this._hasDelayedContent = r.json.HasDelayedContent;
                this._autoRun = !!r.json.AutoRun;
                this._documentFormat = r.json.DocumentFormat;
                this._parameters = (r.json.ParameterCollection || []).map(v => this._convertFromServiceParameter(v));
                this._token = r.json.Token;
                this._isDisposed = false;

                let date = new Date(),
                    expDate = new Date(date.getTime() + this._lifeTime);

                var result = <_IArExecutionInfo>{
                    expiredDateTime: expDate,
                    loadedDateTime: date,
                    features: {
                        nonPaginated: false,
                        paginated: true,
                        pageSettings: false,
                        textSearchInPaginatedMode: true
                    },
                    pageSettings: { // TODO: need a way to retrieve it from the server?
                        height: new _Unit(1056, _UnitType.Dip),
                        width: new _Unit(816, _UnitType.Dip),
                        leftMargin: new _Unit(48, _UnitType.Dip),
                        rightMargin: new _Unit(48, _UnitType.Dip),
                        topMargin: new _Unit(48, _UnitType.Dip),
                        bottomMargin: new _Unit(48, _UnitType.Dip),
                        paginated: true,
                    },
                    status: {
                        errorList: r.json.Error ? [r.json.Error.Description] : [],
                        expiredDateTime: expDate,
                        //hasOutlines: true, // force to call getOutlines()
                        pageCount: 0,
                        progress: 0,
                        status: _ExecutionStatus.loaded
                    }
                };

                this.getReportProperty("ChangeRenderModeSupported").then(val => {
                    this._canChangeRenderMode = !!val;

                    if (wijmo.isArray(data.Parameters) && data.Parameters.length) {
                        this.setParameters(data.Parameters).then((value) => {
                            promise.resolve(result);
                        });
                    } else {
                        promise.resolve(result);
                    }
                });
            })
        }, error => {
            promise.reject(this._getError(error));
        });

        return promise;
    }

    processOnClick(actionData: string): IPromise {
        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/ProcessOnClick', {
            method: 'POST',
            data: {
                token: this._token,
                data: {
                    Action: 'toggle',
                    Data: actionData
                }
            }
        }).then((r: _IArJsonResponse<_IArProcessOnClickResult>) => {
            //this._autoRun = r.json.AutoRun;
            //this._hasDelayedContent = r.json.HasDelayedContent;
            //this._parameters = r.json.ParameterCollection;

            promise.resolve({ status: _ExecutionStatus.rendering });
        }, error => {
            promise.reject(this._getError(error));
        });

        return promise;
    }

    getReportProperty(name: string): IPromise {
        return this._ajax(this.serviceUrl + '/GetReportProperty', {
            method: 'POST',
            data: {
                token: this._token,
                propertyName: name
            }
        }).then((r: _IArJsonResponse<_IArGetReportPropertyResult>) => {
            return r.json.Error ? null : r.json.PropertyValue;
        }).catch(e => {
            return null;
        });
    }

    render(data?): IPromise {
        return this._ajax(this.serviceUrl + '/RunReport', {
            method: 'POST',
            data: { token: this._token }
        }).then((r: _IArJsonResponse<_IArRunReportResult>) => {
            this._isDisposed = false;

            return <_IDocumentStatus>{
                errorList: r.json.Error ? [r.json.Error.Description] : [],
                status: _ExecutionStatus.rendering
            };
        });
    }

    setDrillthroughData(value: _IADrillthroughReportData) {
        this._drillthroughData = value;
    }

    dispose(async = true): IPromise {
        if (!this._token) {
            return new _Promise();
        }

        return this._ajax(this.serviceUrl + '/CloseReport', {
            method: 'POST',
            async: async,
            data: { token: this._token }
        }).then(() => {
            this._isDisposed = true;
            this._token = null;
            this._hasOutlines = undefined;
            return <_IDocumentStatus>{
                status: _ExecutionStatus.cleared
            };
        });
    }

    // _IDocumentStatus.hasOutlines
    // Return an IPromise with _IOutlineNode[].
    getOutlines(test = false): IPromise {
        return this._getBookmarks(-1, 0, !test ? 100 : 1, !test);
    }

    _getError(data: _IArJsonResponse<any> | XMLHttpRequest) {
        var d: _IArJsonResponse<any> = <any>data;

        if (_ArReportService.IsError(d)) {
            return `ErrorCode: "${d.json.Error.ErrorCode}". Description: "${d.json.Error.Description}"`;
        }

        return (<XMLHttpRequest>data).responseText;
    }

    _getBookmarks(parentId: number, startFrom: number, count: number, getChildren = true): IPromise {
        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/GetBookmarks', {
            method: 'POST',
            data: {
                token: this._token,
                parentId: parentId,
                fromChild: startFrom,
                count: count
            }
        }).then((d: _IArJsonResponse<_IArGetBookmarksResult>) => {
            var bookmarks = (d.json.Bookmarks || []).map(bookmark => {
                return <_IOutlineNode>{
                    caption: bookmark.Name,
                    children: bookmark.ChildrenCount > 0
                        ? () => this._getBookmarks(bookmark.ID, 0, count)
                        : null,
                    position: {
                        pageBounds: {
                            height: _Unit.convertValue(bookmark.Size.Width || 0, _UnitType.Inch, _UnitType.Twip),
                            width: _Unit.convertValue(bookmark.Size.Height || 0, _UnitType.Inch, _UnitType.Twip),
                            x: _Unit.convertValue(bookmark.Location.X || 0, _UnitType.Inch, _UnitType.Twip),
                            y: _Unit.convertValue(bookmark.Location.Y || 0, _UnitType.Inch, _UnitType.Twip)
                        },
                        pageIndex: bookmark.Page
                    },
                    target: '' // ?? 
                };
            });

            var loadCount = startFrom + bookmarks.length;
            if (!getChildren || loadCount >= d.json.ChildrenCount || loadCount >= 100000) {
                promise.resolve(bookmarks);
            } else {
                this._getBookmarks(parentId, loadCount, count).then(next => {
                    promise.resolve(bookmarks.concat(next));
                });
            }
        });

        return promise;
    }

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
    renderToFilter(options: _IRenderOptions): IPromise {
        var promise = new _Promise();

        this.getRenderToFilterUrl(options).then((url: string) => {
            // TODO: delayed content ?
            this._ajax(url + `&WebViewerControlClientId=${this._uid}` + (options.outputRange ? `&Page=${options.outputRange}` : ''), {
                /*cache: true,*/
                method: 'GET',
                parseResponse: false
            }).then((r: _IArJsonResponse<any>) => {
                promise.resolve(r.xhr);
            }, e => {
                if (_ArReportService.IsError(e) && (e.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                    setTimeout(() => this.renderToFilter(options), this.getPingTimeout());
                } else {
                    promise.reject(e);
                }
            });
        });

        return promise;
    }

    // Return an IPromise with _ISearchResultItem[].
    search(options: _ISearchOptions): IPromise {
        var promise = new _Promise();

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
        }).then((r: _IArJsonResponse<_IArSearchResult>) => {
            var result = r.json.SearchResults.map<_ISearchResultItem>(value => {
                return {
                    nearText: value.DisplayText,
                    positionInNearText: value.TextStart,
                    pageIndex: value.PageIndex,
                    boundsList: [{
                        height: _Unit.convertValue(value.ItemArea.Height || 0, _UnitType.Inch, _UnitType.Twip),
                        width: _Unit.convertValue(value.ItemArea.Width || 0, _UnitType.Inch, _UnitType.Twip),
                        x: _Unit.convertValue(value.ItemArea.Left || 0, _UnitType.Inch, _UnitType.Twip),
                        y: _Unit.convertValue(value.ItemArea.Top || 0, _UnitType.Inch, _UnitType.Twip)
                    }]
                };
            });

            promise.resolve(result);
        }, r => promise.reject(r));

        return promise;
    }

    setParameters(value: _IArParameter[]): IPromise {
        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/SetParameters', {
            method: 'POST',
            data: {
                token: this._token,
                parametersSetAtClient: (value || []).map(v => this._convertToServiceParameter(v))
            }
        }).then((r: _IArJsonResponse<_IArSetParametersResult>) => {
            promise.resolve(this._parameters = (r.json.ParameterCollection || []).map(v => this._convertFromServiceParameter(v)));
        }).catch((r: _IArJsonResponse<_IArSetParametersResult>) => {
            if (_ArReportService.IsError(r) && (r.json.Error.ErrorCode == _ArErrorCode.ParametersNotSet)) {
                promise.resolve(this._parameters = (r.json.ParameterCollection || []).map(v => this._convertFromServiceParameter(v)));
            } else {
                promise.reject(r);
            }
        });

        return promise;
    }

    validateParameter(value: _IArParameter): IPromise {
        return this._ajax(this.serviceUrl + '/ValidateParameter', {
            method: 'POST',
            data: {
                token: this._token,
                parametersSetAtClient: this._convertToServiceParameter(value)
            }
        }).then((r: _IArJsonResponse<_IArValidateParameterResult>) => {
            return null;
        });
    }

    getRenderToFilterUrl(options: _IRenderOptions): IPromise {
        var promise = new _Promise();

        this._ajax(this.serviceUrl + '/GetRenderedReportLink', {
            method: 'POST',
            data: { token: this._token }
        }).then((r: _IArJsonResponse<_IArGetExportedReportLinkResult>) => {
            promise.resolve(r.json.ReportLink.Uri);
        }, r => {
            if (_ArReportService.IsError(r) && (r.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                setTimeout(() => this.getRenderToFilterUrl(options), this.getPingTimeout());
            } else {
                promise.reject(r);
            }
        });

        return promise;
    }

    getExportedUrl(options: _IArExportOptions): IPromise {
        var format = _ArReportService.ConvertFormat(options.format),

            exportingParameters = (() => {
                var result = {
                    'FileName': this.getFileName()
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
            })(),

            promise = new _Promise();

        this._ajax(this.serviceUrl + '/GetExportedReportLink', {
            method: 'POST',
            data: {
                token: this._token,
                format: format,
                exportingParameters: exportingParameters,
                pageRange: null //  doesn't work good for now
            }
        }).then((r: _IArJsonResponse<_IArGetExportedReportLinkResult>) => {
            promise.resolve(r.json.ReportLink.Uri
                + (wijmo.isNumber(options.outputRange) ? `&outputRange=${options.outputRange}` : '') // required to be able to sort thumbnails urls (ViwerBase.createThumbnails).;
                + (!options.printing ? '&Attachment=1' : ''));
        }, e => {
            if (_ArReportService.IsError(e) && (e.json.Error.ErrorCode == _ArErrorCode.RuntimeIsBusy)) {
                setTimeout(() => this.getExportedUrl(options), this.getPingTimeout());
            } else {
                promise.reject(e);
            }
        });

        return promise;
    }

    getPingTimeout() {
        return 1000; // 5000
    }

    // Return an IPromise with _IExportDescription[].
    getSupportedExportDescriptions(): IPromise {
        var promise = new _Promise();
        promise.resolve(<_IExportDescription[]>[
            { name: 'TIFF image', format: 'tiff' },
            { name: 'Adobe PDF', format: 'pdf' },
            { name: 'Web archive (MHTML)', format: 'mhtml' },
            { name: 'Microsoft Word', format: 'doc' },
            { name: 'Microsoft Excel', format: 'xls' },
            { name: 'XML document', format: 'xml' }
        ]);
        return promise;
    }

    // Return an IPromise with _IDocumentFeatures.
    getFeatures(): IPromise {
        throw _DocumentSource._abstractMethodException;
    }

    private _ajax(url: string, settings?: _IJsonHttpRequest): IPromise {
        let promise = new _Promise();

        settings = settings || {};
        settings.urlEncode = false;
        //settings.cache = true

        this.httpRequest(url, settings).then((xhr: XMLHttpRequest) => {
            let r: _IArJsonResponse<_IArMethodResponse> = {
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
            } catch (e) {
                promise.reject(r);
            }
        }, (xhr: XMLHttpRequest) => {
            promise.reject(xhr); // TODO: parse response.
        });

        return promise;
    }

    private _convertFromServiceParameter(p: _IArParameter): _IArParameter {
        var cnvrt = (v: any, t: _ArParameterType) => {
            if (v != null && t === _ArParameterType.DateTime) {
                //    var millis = (+v - ticksOffsetFromUnixEpoch) / ticksInMillisecond,
                //        millisUtc = millis + new Date(millis).getTimezoneOffset() * millisecondsInMinute;
                //    return new Date(millisUtc);
            }

            return v
        };

        p.Value = cnvrt(p.Value, p.ParameterType);
        p.AvailableValues = (p.AvailableValues || []).map(v => ({
            Label: v.Label,
            Value: cnvrt(v.Value, p.ParameterType)
        }));

        return p;
    }

    private _convertToServiceParameter(p: _IArParameter): _IArParameter {
        var cnvrt = (v: any, t: _ArParameterType) => {
            if (v != null && t === _ArParameterType.DateTime) {
                //    var millisLocal = v.getTime() - v.getTimezoneOffset() * millisecondsInMinute;
                //    return millisLocal * ticksInMillisecond + ticksOffsetFromUnixEpoch;
            }

            return v;
        };

        p.Value = cnvrt(p.Value, p.ParameterType);

        if (p.Values) {
            p.Values.forEach(v => {
                v.Value = cnvrt(v.Value, p.ParameterType);
            });
        }

        return p;
    }

    private _merge(src: any, dst: any): any {
        if (!src || !dst) {
            return;
        }

        for (let key in src) {
            dst[key] = src[key];
        }

        return dst;
    }

    //TODO: need further investigation
    private _mergeParameters(client: IArClientParameter[], server: _IArParameter[]): _IArParameter[] {
        var names = [];

        var result = server.map(sp => {
            var name = sp.Name.toLowerCase();

            names.push(name);

            var cp = client.filter(p => name === p.Name.toLowerCase());
            return !cp.length
                ? sp
                : (() => {
                    sp.Value = cp[0].Value;
                    return sp;
                })();
        });

        result.push.apply(result, client.filter(p => names.indexOf(p.Name.toLowerCase()) < 0));

        return result;
    }

    private _parseXml(data: string): Document {
        var dom = new DOMParser().parseFromString(data, "text/xml");
        return dom;
    }
}
    }
    


    module wijmo.viewer {
    













'use strict';

export interface _IArDocumentOptions extends _IDocumentOptions {
}

export class _ArReportSource extends _ReportSourceBase {
    constructor(options: _IArDocumentOptions, httpRequest: IHttpRequestHandler) {
        super(options, httpRequest);
    }

    get autoRun(): boolean {
        return this._innerService.autoRun;
    }

    get encodeRequestParams(): boolean {
        return false; // AR service doesn't supports values encoded by encodeURIComponent?
    }

    get hasParameters(): boolean {
        var params = this._innerService.parameters;
        return params && (params.length > 0);
    }

    get hasThumbnails(): boolean {
        return false; // https://hive.grapecity.com/default.asp?249933#1703755
    }

    get _innerService(): _ArReportService {
        return <_ArReportService>this.service;
    }

    getParameters(): IPromise {
        var promise = new _Promise(),
            params = this._convertParameters(this._innerService.parameters);

        return promise.resolve(params);
    }

    setParameters(value: Object): IPromise {
        var promise = new _Promise(),
            sp: _IArParameter[] = [],
            names: { [name: string]: _IArParameter } = {};

        this._innerService.parameters.forEach(p => {
            names[p.Name] = p;
        });

        // TODO: multiline (typeof(value) == array?)
        Object.keys(value).forEach(k => {
            var p: _IArParameter;

            sp.push(p = <_IArParameter>{
                AllowEmpty: names[k].AllowEmpty,
                DateOnly: names[k].DateOnly,
                MultiLine: names[k].MultiLine,
                MultiValue: names[k].MultiValue,
                Name: k,
                Nullable: names[k].Nullable,
                ParameterType: names[k].ParameterType
            });

            if (p.MultiValue && wijmo.isArray(value[k])) {
                p.Values = (<any[]>value[k]).map(v => {
                    return <_IArParameterValue>{
                        Value: v
                    };
                });
            } else {
                p.Value = value[k];
            }
        });

        this._innerService.setParameters(sp).then((v: _IArParameter[]) => {
            var failed = this._convertParameters(v.filter(v => v.State !== _ArParameterState.OK));
            promise.resolve(this._convertParameters(v));
        });

        return promise;
    }

    print(rotations?: _RotateAngle[]) {
        // AR is unable to render\ export multiple pages in SVG format, so we can't apply rotations and use PrintDocument (see: _DocumentSource.print).
        // For now we just export the report to PDF, asking web service to set the "content-disposition" header (to give browser a chance to display the Print dialog automatucally), and open it.
        this.getExportedUrl(<_IArExportOptions>{ format: 'pdf', printing: true }, true).then(url => {
            if (!url) {
                return;
            }

            try {
                var wnd = window.open(url, '_blank');
                if (wnd) {
                    wnd.focus();
                }
            }
            catch {
                window.location.assign(url + '&Attachment=1');
            }
        });
    }

    _createDocumentService(options: _IDocumentService): _DocumentService {
        return new _ArReportService(options, this.httpHandler);
    }

    _getIsDisposed() {
        return super._getIsDisposed() || this._innerService.isDisposed;
    }

    _updateExecutionInfo(data: _IArExecutionInfo) {
        super._updateExecutionInfo(data);
    }

    _checkIsLoadCompleted(data: _IReportStatus): boolean {
        return data.status === _ExecutionStatus.completed
            || data.status === _ExecutionStatus.stopped;
    }

    _convertParameters(params: _IArParameter[]): _IParameter[] {
        var result = params.map<_IParameter>(value => ({
            allowedValues: value.AvailableValues && value.AvailableValues.length
                ? value.AvailableValues.map(v => ({ key: v.Label, value: v.Value }))
                : undefined,
            allowBlank: value.AllowEmpty,
            dataType: (value.ParameterType === _ArParameterType.Boolean)
                ? _ParameterType.Boolean
                : value.ParameterType === _ArParameterType.DateTime
                    ? _ParameterType.DateTime // _ParameterType.Date, _ParameterType.Time?
                    : value.ParameterType === _ArParameterType.Float
                        ? _ParameterType.Float
                        : value.ParameterType === _ArParameterType.Integer
                            ? _ParameterType.Integer
                            : _ParameterType.String,
            error: value.ExtendedErrorInfo,
            hidden: false,
            name: value.Name,
            nullable: !!value.Nullable,
            maxLength: 0,
            multiValue: value.MultiValue,
            prompt: value.Prompt,
            value: value.MultiValue && value.Values && value.Values.length
                ? value.Values.map(v => v.Value)
                : value.Value,
        }));

        return result;
    }
}
    }
    


    module wijmo.viewer {
    





























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
export class ReportViewer extends ViewerBase {

    private _reportName: string;
    private _clientParameters: { [name: string]: any };
    private _paramsEditor: _ParametersEditor;
    //globalize elements
    private _gParameterTitle: HTMLElement;
    private _parametersPageId: string;

    static _parameterCommandTag = 99;

    /**
     * Initializes a new instance of the {@link ReportViewer} class.
     *
     * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, options);
        this._initSidePanelParameters();
    }
    _getProductInfo(): string {
        return 'QNI5,ReportViewer';
    }

    /**
    * Gets or sets the report name.
    *
    * For FlexReport, sets it with the report name defined in the FlexReport definition file.
    * For SSRS report, leave it as empty string. The SSRS report path is specified by the {@link filePath} property.
    */
    get reportName(): string {
        return this._reportName;
    }
    set reportName(value: string) {
        if (value != this._reportName) {
            this._reportName = value;
            this._needBindDocumentSource();
            this.invalidate();
        }
    }

    /**
    * Gets or sets a value indicating whether the content should be represented as a set of fixed sized pages.
    * 
    * The default value is null which means using paginated mode for a FlexReport and non-paginaged mode for an SSRS report.
    */
    get paginated(): boolean {
        return this._innerPaginated;
    }
    set paginated(value: boolean) {
        this._innerPaginated = value;
    }

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
    get parameters(): any {
        return this._clientParameters;
    }
    set parameters(value: any) {
        if (value != this._clientParameters) {
            this._clientParameters = value;
            this._needBindDocumentSource();
            this.invalidate();
        }
    }

    /**
     * Gets the report names defined in the specified FlexReport definition file.
     *
     * @param serviceUrl The address of C1 Web API service.
     * @param reportFilePath The full path to the FlexReport definition file.
     * @param httpHandler The HTTP request handler. This parameter is optional.
     * @return An {@link wijmo.viewer.IPromise} object with a string array which contains the report names.
     */
    static getReportNames(serviceUrl: string, reportFilePath: string, httpHandler?: IHttpRequestHandler): IPromise {
        return _Report.getReportNames(serviceUrl, reportFilePath, httpHandler);
    }

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
    static getReports(serviceUrl: string, path: string, data?: any, httpHandler?: IHttpRequestHandler): IPromise {
        return _Report.getReports(serviceUrl, path, data, httpHandler);
    }

    onQueryLoadingData(e: QueryLoadingDataEventArgs) {
        if (this.parameters) {
            Object.keys(this.parameters).forEach(
                v => e.data['parameters.' + v] = this.parameters[v]
            );
        }

        super.onQueryLoadingData(e);
    }

    _globalize() {
        super._globalize();

        var g = wijmo.culture.Viewer;
        this._gParameterTitle.textContent = g.parameters;
    }

    _executeAction(action: _ViewerActionType) {
        super._executeAction(action);

        if (this._actionIsDisabled(action)) {
            return;
        }
        switch (action) {
            case ReportViewer._parameterCommandTag:
                (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).active(this._parametersPageId);
                break;
        }
    }

    _executeCustomAction(action: _IDocAction) {
        if (this._isArReport() && (<_IArDocAction>action).arKind === _ArActionKind.Drillthrough) {
            var data = <_IADrillthroughReportData>JSON.parse(action.data);
            var source = <_ArReportSource>this._getDocumentSource();
            source._innerService.setDrillthroughData(data);
            source._updateIsLoadCompleted(false);
            this._loadDocument(source, true, false);
        } else {
            super._executeCustomAction(action);
        }
    }

    _actionIsDisabled(action: _ViewerActionType): boolean {
        switch (action) {
            case ReportViewer._parameterCommandTag:
                return !this._innerDocumentSource || !this._innerDocumentSource.hasParameters;
        }

        return super._actionIsDisabled(action);
    }

    _initHamburgerMenu(owner: HTMLElement) {
        this._hamburgerMenu = new _ReportHamburgerMenu(this, owner);
    }

    private _initSidePanelParameters() {
        var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel),
            page = sideTabs.addPage(wijmo.culture.Viewer.parameters, parametersIcon, 2);
        this._parametersPageId = page.id;
        this._gParameterTitle = <HTMLElement>page.outContent.querySelector('.wj-tabtitle');
        page.format(t => {
            this._paramsEditor = new _ParametersEditor(t.content);
            this._paramsEditor.commit.addHandler(() => {
                if (!this._innerDocumentSource || !this._innerDocumentSource.hasParameters) {
                    return;
                }

                this._showViewPanelMessage();
                this._innerDocumentSource.setParameters(this._paramsEditor.parameters).then(v => {
                    var newParams = <_IParameter[]>(v || []);
                    var hasError = newParams.some(p => !!p.error);
                    this._paramsEditor._reset();
                    if (hasError) {
                        this._paramsEditor.itemsSource = newParams;
                    } else {
                        this._resetDocument();
                        this._paramsEditor.isDisabled = true;
                        this._renderDocumentSource();
                    }
                }).catch(reason => {
                    this._showViewPanelErrorMessage(_getErrorMessage(reason));
                });

                if (this._isMobileTemplate()) {
                    sideTabs.collapse();
                }
            });

            this._paramsEditor.validate.addHandler(() => {
                if (!this._innerDocumentSource || !this._innerDocumentSource.hasParameters) {
                    return;
                }

                this._paramsEditor.isDisabled = true;
                this._innerDocumentSource.setParameters(this._paramsEditor.parameters).then(v => {
                    this._paramsEditor.itemsSource = v;
                    this._paramsEditor.isDisabled = false;
                    this._paramsEditor.savingParam = false;
                }, v => {
                    this._paramsEditor.isDisabled = false;
                    this._paramsEditor.savingParam = false;
                });
            });

            var updateParametersPanel = () => {
                var documentSource = this._innerDocumentSource;
                if (documentSource.status === _ExecutionStatus.cleared ||
                    documentSource.status === _ExecutionStatus.notFound) {
                    _removeChildren(t.content);
                } else if (documentSource.status === _ExecutionStatus.rendering) {
                    this._paramsEditor.isDisabled = true;
                } else if (documentSource.status === _ExecutionStatus.completed) {
                    this._paramsEditor.isDisabled = false;
                }

                const isLoaded = (documentSource.status === _ExecutionStatus.loaded);
                if ((documentSource.status !== _ExecutionStatus.completed) && !isLoaded) {
                    return;
                }

                if (!documentSource.hasParameters) {
                    sideTabs.hide(t);
                    return;
                }

                documentSource.getParameters().then((params: _IParameter[]) => {
                    if (!params.filter(p => !p.hidden).length) { // all parameters are hidden?
                        sideTabs.hide(t);
                    } else {
                        sideTabs.show(t);
                        sideTabs.active(t);
                    }

                    if (this._innerDocumentSource != documentSource || documentSource.isDisposed) {
                        return;
                    }

                    this._paramsEditor.itemsSource = params;
                    if (params.filter(p => p.value == null && !p.nullable && !p.hidden).length) { // has required parameters?
                        this._showViewPanelMessage(wijmo.culture.Viewer.requiringParameters);
                        this._updateUI();
                        (<_SideTabs>wijmo.Control.getControl(this._sidePanel)).enable(this._parametersPageId); // Make sure that Parameters page is enabled.
                    } else if (isLoaded) {
                        this._paramsEditor.isDisabled = true;
                        this._renderDocumentSource();
                    }
                });
            }, update = () => {
                if (!this._innerDocumentSource) {
                    return;
                }

                _addWjHandler(this._documentEventKey, this._innerDocumentSource.statusChanged, updateParametersPanel);
                updateParametersPanel();
            };

            this._documentSourceChanged.addHandler(update);
            update();
        });
    }

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

    get _innerDocumentSource(): _Report {
        return <_Report>this._getDocumentSource();
    }

    _loadDocument(value: _ReportSourceBase, force = false, disposeSource = true): IPromise {
        var isChanged = (this._innerDocumentSource !== value) && !force;
        var promise = super._loadDocument(value, force, disposeSource);

        if (value && isChanged) {
            _addWjHandler(this._documentEventKey, value.statusChanged, this._onDocumentStatusChanged, this);
        }

        return promise;
    }

    _reRenderDocument() {
        this._renderDocumentSource();
    }

    _onDocumentStatusChanged() {
        if (!this._innerDocumentSource
            || this._innerDocumentSource.status !== _ExecutionStatus.loaded
            || this._innerDocumentSource.hasParameters
            || !this._innerDocumentSource.autoRun) {
            return;
        }

        this._renderDocumentSource();
    }

    private _renderDocumentSource() {
        if (!this._innerDocumentSource) {
            return;
        }

        this._setDocumentRendering();
        var documentSource = this._innerDocumentSource;
        documentSource.render().then(v => this._getStatusUtilCompleted(documentSource));
    }

    _disposeDocument(disposeSource = true) {
        if (this._innerDocumentSource) {
            _removeAllWjHandlers(this._documentEventKey, this._innerDocumentSource.statusChanged);
        }

        super._disposeDocument(disposeSource);
    }

    _setDocumentRendering(): void {
        this._innerDocumentSource.status = _ExecutionStatus.rendering;
        super._setDocumentRendering();
    }

    _getSource(): _DocumentSource { //_Report {
        if (!this.filePath) {
            return null;
        }

        if (this._isArReport()) {
            return new _ArReportSource({
                serviceUrl: this.serviceUrl,
                filePath: this.filePath
            }, this);
        }

        return new _Report({
            serviceUrl: this.serviceUrl,
            filePath: this.filePath,
            reportName: this.reportName,
            paginated: this.paginated
        }, this);
    }

    _supportsPageSettingActions(): boolean {
        return true;
    }

    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            this._paramsEditor.refresh();
        }
    }

    protected _isArReport(): boolean {
        return !!this.filePath && _strEndsWith(this.filePath, '.rdlx', true);
    }

    _createPage(index: number, defPageSize: _ISize) {
        if (!this._isArReport()) {
            return super._createPage(index, defPageSize);
        }

        return new _ArPage(this._getDocumentSource(), index, defPageSize);
    }

    protected _actionElementClicked(element: SVGElement) {
        if (!this._isArReport()) {
            super._actionElementClicked(element);
            return;
        }

        var info = <_IArDocAction>this._getActionInfo(element);

        if (info && (info.arKind === _ArActionKind.Hyperlink)) {
            window.open(info.data, '_blank');
        } else {
            super._actionElementClicked(element);
        }
    }

    protected _getActionInfo(element: SVGElement): _IDocAction {
        if (!this._isArReport()) {
            return super._getActionInfo(element);
        }

        var typeVal = element.attributes['arsvg:data-action-type'].value,
            dataVal = element.attributes['arsvg:data-action-data'].value.replace(/&quot;/g, '"'),
            pageVal = element.attributes['arsvg:data-action-page'].value;

        if (typeVal) {
            switch (typeVal) {
                case _ArActionKind.Bookmark:
                    return <_IArDocAction>{ kind: _ActionKind.Bookmark, data: dataVal ? `${pageVal}|${dataVal}` : pageVal, arKind: typeVal };

                default:
                    return <_IArDocAction>{ kind: _ActionKind.Custom, data: dataVal, arKind: typeVal };
            }
        }

        return null;
    }
}
    }
    


    module wijmo.viewer {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.viewer', wijmo.viewer);



/* Export public members */










/* Additional WebComponents interop requirement: export all the remaining members that directly or indirectly inherited from wijmo.Control */



























    }
    