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
    (function (grid) {
        var grouppanel;
        (function (grouppanel) {
            'use strict';
            function softGridFilter() {
                return wijmo._getModule('wijmo.grid.filter');
            }
            grouppanel.softGridFilter = softGridFilter;
        })(grouppanel = grid.grouppanel || (grid.grouppanel = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var grouppanel;
        (function (grouppanel) {
            'use strict';
            // initialize placeholder message
            wijmo._addCultureInfo('GroupPanel', {
                dragDrop: 'Drag and Drop columns here to create Groups.'
            });
            /**
             * The {@link GroupPanel} control provides a drag and drop UI for editing
             * groups in a bound {@link FlexGrid} control.
             *
             * It allows users to drag columns from the {@link FlexGrid} into the
             * panel and to move groups within the panel. Users may click the
             * group markers in the panel to sort based on the group column or to
             * remove groups.
             *
             * In order to use a {@link GroupPanel}, add it to a page that contains a
             * {@link FlexGrid} control and set the panel's {@link grid} property to the
             * {@link FlexGrid} control. For example:
             *
             * ```typescript
             * import { FlexGrid } from '@grapecity/wijmo.grid';
             * import { GroupPanel } from '@grapecity/wijmo.grid.grouppanel';
             *
             * // create a FlexGrid
             * let theGrid = new FlexGrid('#theGrid', {
             *     itemsSource: getData();
             * });
             *
             * // add a GroupPanel to edit data groups
             * let thePanel = new GroupPanel('#thePanel', {
             *     grid: theGrid,
             *     placeholder: 'Drag columns here to create Groups.'
             * });
             * ```
             *
             * The example below shows how you can use a {@link GroupPanel} control to
             * add Outlook-style grouping to a {@link FlexGrid} control:
             *
             * {@sample Grid/Grouping/GroupPanel/purejs Example}
             */
            var GroupPanel = /** @class */ (function (_super) {
                __extends(GroupPanel, _super);
                /**
                 * Initializes a new instance of the {@link GroupPanel} class.
                 *
                 * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
                 * @param options The JavaScript object containing initialization data for the control.
                 */
                function GroupPanel(element, options) {
                    var _this = _super.call(this, element) || this;
                    _this._hideGroupedCols = true; // hide columns dragged into the panel
                    _this._showDragGlyphs = true; // show drag glyphs in group markers
                    _this._maxGroups = 6; // maximum number of groups allowed
                    _this._hiddenCols = []; // columns hidden by this component
                    _this._placeholder = null; // placeholder string
                    _this._dragEndBnd = _this._dragEnd.bind(_this); // clear drag column info when dragend fires
                    // check dependencies
                    //let depErr = 'Missing dependency: GroupPanel requires ';
                    //assert(grid != null, depErr + 'wijmo.grid.');
                    // instantiate and apply template
                    var tpl = _this.getTemplate();
                    _this.applyTemplate('wj-grouppanel wj-control', tpl, {
                        _divMarkers: 'div-markers',
                        _divPH: 'div-ph'
                    });
                    // apply styles in code to keep CSP happy
                    wijmo.setCss(_this._divMarkers.parentElement, {
                        width: '100%',
                        height: '100%',
                        minHeight: '1em',
                        overflow: 'hidden',
                        cursor: 'default'
                    });
                    // drag-drop events
                    var host = _this.hostElement, listen = _this.addEventListener.bind(_this);
                    listen(host, 'dragstart', _this._dragStart.bind(_this));
                    listen(host, 'dragover', _this._dragOver.bind(_this));
                    listen(host, 'drop', _this._drop.bind(_this));
                    listen(host, 'dragend', _this._dragEndBnd);
                    // click markers to sort/delete/filter groups
                    listen(host, 'click', _this._click.bind(_this));
                    // apply options
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(GroupPanel.prototype, "hideGroupedColumns", {
                    /**
                     * Gets or sets a value indicating whether the panel hides grouped columns in the owner grid.
                     *
                     * The {@link FlexGrid} displays grouping information in row headers, so it is
                     * usually a good idea to hide grouped columns since they display redundant
                     * information.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._hideGroupedCols;
                    },
                    set: function (value) {
                        if (value != this._hideGroupedCols) {
                            this._hideGroupedCols = wijmo.asBoolean(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "showDragGlyphs", {
                    /**
                     * Gets or sets a value that determines whether the control should
                     * add drag glyphs to the group marker elements.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._showDragGlyphs;
                    },
                    set: function (value) {
                        if (value != this._showDragGlyphs) {
                            this._showDragGlyphs = wijmo.asBoolean(value);
                            this.refresh();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "maxGroups", {
                    /**
                     * Gets or sets the maximum number of groups allowed.
                     *
                     * Setting this property to -1 allows any number of groups to be created.
                     * Setting it to zero prevents any grouping.
                     *
                     * The default value for this property is **6**.
                     */
                    get: function () {
                        return this._maxGroups;
                    },
                    set: function (value) {
                        if (value != this._maxGroups) {
                            // apply the new value
                            this._maxGroups = wijmo.asNumber(value);
                            // trim group descriptions as needed (TFS 350568)
                            var gds = this._gds, max = this._maxGroups;
                            if (gds && max > -1 && max < gds.length) {
                                gds.splice(max, gds.length - max);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "placeholder", {
                    /**
                     * Gets or sets a string to display in the control when it contains no groups.
                     *
                     * The default value for this property is **null**, which causes the control
                     * to use a localized version of the string
                     * "Drag and Drop columns here to create Groups." as a placeholder.
                     *
                     * Set this property to a custom string if you want, or set it to an empty
                     * string to remove the placeholder message, or set it to null to restore
                     * the default message.
                     */
                    get: function () {
                        return this._placeholder;
                    },
                    set: function (value) {
                        if (value != this._placeholder) {
                            this._placeholder = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "grid", {
                    /**
                     * Gets or sets the {@link FlexGrid} that is connected to this {@link GroupPanel}.
                     *
                     * Once a grid is connected to the panel, the panel displays the groups
                     * defined in the grid's data source. Users can drag grid columns
                     * into the panel to create new groups, drag groups within the panel to
                     * re-arrange the groups, or delete items in the panel to remove the groups.
                     */
                    get: function () {
                        return this._g;
                    },
                    set: function (value) {
                        value = wijmo.asType(value, wijmo.grid.FlexGrid, true);
                        if (value != this._g) {
                            // unhook event handlers
                            var g = this._g;
                            if (g) {
                                g.draggingColumn.removeHandler(this._draggingColumn);
                                g.itemsSourceChanging.removeHandler(this._itemsSourceChanging);
                                g.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
                                g.columns.collectionChanged.removeHandler(this._itemsSourceChanged); // TFS 125386
                                g.removeEventListener(g.hostElement, 'dragend', this._dragEndBnd); // TFS 470141
                            }
                            // update grid property
                            g = this._g = value;
                            this._hiddenCols = [];
                            // attach event handlers
                            if (g) {
                                g.draggingColumn.addHandler(this._draggingColumn, this);
                                g.itemsSourceChanging.addHandler(this._itemsSourceChanging, this);
                                g.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
                                g.columns.collectionChanged.addHandler(this._itemsSourceChanged, this); // TFS 125386
                                g.addEventListener(g.hostElement, 'dragend', this._dragEndBnd); // TFS 470141
                            }
                            // hook up to groupDescriptions.collectionChanged
                            this._itemsSourceChanged(g, null);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "collectionView", {
                    /**
                     * Gets the {@link ICollectionView} whose groups are being managed by this
                     * {@link GroupPanel}.
                     */
                    get: function () {
                        return this._g ? this._g.collectionView : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "filter", {
                    /**
                     * Gets or sets the {@link wijmo.grid.filter.FlexGridFilter} to use for filtering
                     * the grid data.
                     *
                     * If you set this property to a valid filter, the group descriptors will
                     * display filter icons that can be used to see and edit the filer conditions
                     * associated with the groups.
                     */
                    get: function () {
                        return this._filter;
                    },
                    set: function (value) {
                        value = wijmo.asType(value, grouppanel.softGridFilter().FlexGridFilter, true);
                        if (value != this._filter) {
                            var filter_1 = this._filter;
                            if (filter_1) {
                                filter_1.filterApplied.removeHandler(this.refresh, this);
                                filter_1.filterChanged.removeHandler(this._filterChanged, this);
                            }
                            filter_1 = this._filter = value;
                            if (filter_1) {
                                filter_1.filterApplied.addHandler(this.refresh, this);
                                filter_1.filterChanged.addHandler(this._filterChanged, this);
                            }
                            this.refresh();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupPanel.prototype, "groupDescriptionCreator", {
                    /**
                     * Gets or sets a {@link GroupDescription} creator function used to create
                     * group descriptions when users drag columns into the group.
                     *
                     * For example, the code below defines a {@link groupDescriptionCreator}
                     * function that groups dates by year and values in ranges:
                     *
                     * ```typescript
                     * thePanel.groupDescriptionCreator = (prop: string) => {
                     *     switch (prop) {
                     *         case 'date':
                     *             return new PropertyGroupDescription(prop, (item, prop) => {
                     *                 return Globalize.formatDate(item[prop], 'yyyy');
                     *             });
                     *         case 'sales':
                     *             return new PropertyGroupDescription(prop, (item, prop) => {
                     *                 let value = item[prop];
                     *                 if (value > 50000) return 'High';
                     *                 if (value > 25000) return 'Medium';
                     *                 return 'Low';
                     *             });
                     *     }
                     *     return null; // default
                     * }
                     * ```
                     */
                    get: function () {
                        return this._gdc;
                    },
                    set: function (value) {
                        this._gdc = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                // ** overrides
                /**
                 * Updates the panel to show the current groups.
                 */
                GroupPanel.prototype.refresh = function () {
                    _super.prototype.refresh.call(this);
                    // clear div/state
                    this._divMarkers.innerHTML = '';
                    this._dragMarker = this._dragCol = null;
                    // add groups to div
                    if (this._gds) {
                        // add markers for each group
                        var g = this._g, panel = g.columnHeaders;
                        for (var i = 0; i < this._gds.length; i++) {
                            var gd = this._gds[i], row = -1, col = -1;
                            // find row and column indices to use when generating the markers (e.g. MultiRow)
                            // but start scanning from the last row to handle merged headers (TFS 251887)
                            if (gd instanceof wijmo.collections.PropertyGroupDescription) {
                                for (var rowIndex = panel.rows.length - 1; rowIndex >= 0 && col < 0; rowIndex--) {
                                    for (var colIndex = 0; colIndex < panel.columns.length && col < 0; colIndex++) {
                                        var bCol = g._getBindingColumn(panel, rowIndex, panel.columns[colIndex]);
                                        if (bCol && bCol.binding == gd.propertyName) {
                                            col = colIndex;
                                            row = rowIndex;
                                            break;
                                        }
                                    }
                                }
                            }
                            // generate marker
                            if (col > -1 && row > -1) {
                                // create the marker
                                var mk = document.createElement('div');
                                g.cellFactory.updateCell(this._g.columnHeaders, row, col, mk);
                                mk.setAttribute('class', 'wj-cell wj-header wj-groupmarker');
                                wijmo.setCss(mk, {
                                    position: 'static',
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    left: '',
                                    right: '',
                                    top: '',
                                    width: '',
                                    height: '',
                                    paddingLeft: '',
                                    paddingRight: ''
                                });
                                // remove 'filter' and column selector elements if present
                                wijmo.removeChild(mk.querySelector('.wj-elem-filter'));
                                wijmo.removeChild(mk.querySelector('.wj-column-selector'));
                                // add drag handle glyph
                                if (this.showDragGlyphs) {
                                    var dh = wijmo.createElement('<span class="wj-glyph-drag"></span>');
                                    mk.insertBefore(dh, mk.firstChild);
                                }
                                // add our own 'filter' glyph
                                var bCol = g._getBindingColumn(panel, row, panel.columns[col]), cf = this._getColumnFilter(bCol);
                                if (cf) {
                                    var filter_2 = wijmo.createElement('<span class="wj-filter wj-glyph-filter"></span>', mk);
                                    wijmo.toggleClass(filter_2, 'wj-filter-on', cf.isActive);
                                    wijmo.toggleClass(filter_2, 'wj-filter-off', !cf.isActive);
                                }
                                // add 'remove group' glyph
                                wijmo.createElement('<span class="wj-remove">&times;</span>', mk);
                                // add the marker
                                this._divMarkers.appendChild(mk);
                            }
                        }
                        // update placeholder content
                        this._divPH.textContent = this._placeholder != null
                            ? this._placeholder
                            : wijmo.culture.GroupPanel.dragDrop;
                        // update placeholder visibility
                        var hasGroups = this._divMarkers.children.length > 0;
                        this._divPH.style.display = hasGroups ? 'none' : '';
                        this._divMarkers.style.display = hasGroups ? '' : 'none';
                    }
                };
                /**
                 * Gets the {@link GroupDescription} at a given mouse position or
                 * represented by a given HTML element.
                 *
                 * @param e Element to test.
                 * @returns The {@link GroupDescription} represented by the element,
                 * or null if the element does not represent a {@link GroupDescription}.
                 */
                GroupPanel.prototype.hitTest = function (e) {
                    var target = (e instanceof HTMLElement) ? e
                        : (e instanceof MouseEvent) ? e.target
                            : null;
                    wijmo.assert(target != null, 'MouseEvent or Element expected');
                    // get marker the contains the target
                    var marker = wijmo.closest(target, '.wj-cell');
                    // if we got the marker, remove group or flip sort
                    if (wijmo.hasClass(marker, 'wj-cell')) {
                        var index = this._getElementIndex(marker);
                        return this._gds && index > -1 ? this._gds[index] : null;
                    }
                    // not a marker
                    return null;
                };
                // ** implementation
                // user closed the filter editor: clear _filterMarker (TFS 438726)
                GroupPanel.prototype._filterChanged = function () {
                    this._filterMarker = null;
                };
                // gets the column filter associated with a given column
                GroupPanel.prototype._getColumnFilter = function (col) {
                    var filter = this._filter, cf = null;
                    if (filter) {
                        cf = (filter.filterColumns && filter.filterColumns.indexOf(col.binding) < 0)
                            ? null
                            : filter.getColumnFilter(col);
                    }
                    return cf;
                };
                // edit the filter for a given group marker
                GroupPanel.prototype._editFilter = function (marker) {
                    // get the group
                    var groups = this._gds, index = this._getElementIndex(marker), group = groups && index > -1 ? groups[index] : null;
                    // and show the filter editor
                    var binding = group instanceof wijmo.collections.PropertyGroupDescription ? group.propertyName : null, col = binding ? this._g.getColumn(binding) : null;
                    if (col) {
                        this._filter.editColumnFilter(col, null, marker);
                    }
                };
                // add a group at a specific position
                GroupPanel.prototype._addGroup = function (col, e) {
                    // get index where the new group will be inserted
                    var index = this._getIndex(e), gds = this._gds, max = this._maxGroups;
                    // remove group in case it's already there
                    for (var i = 0; i < gds.length; i++) {
                        var pgd = gds[i];
                        if (pgd instanceof wijmo.collections.PropertyGroupDescription && pgd.propertyName == col.binding) {
                            gds.removeAt(i);
                            if (i < index) {
                                index--;
                            }
                            break;
                        }
                    }
                    // remove last group until we have room
                    if (max > -1) {
                        for (var i = max - 1; i < gds.length; i++) {
                            this._removeGroup(i, gds); // TFS 198128
                            if (i < index) {
                                index--;
                            }
                        }
                    }
                    // add new group
                    if (max < 0 || gds.length < max) {
                        // add new GroupDescription at the right place
                        var gd = this._gdc ? this._gdc(col.binding) : null;
                        if (!gd) {
                            gd = new wijmo.collections.PropertyGroupDescription(col.binding);
                        }
                        gds.insert(index, gd);
                        // hide the column
                        if (col && this.hideGroupedColumns) {
                            col.visible = false;
                            this._hiddenCols.push(col);
                        }
                    }
                };
                // move a group to a new position
                GroupPanel.prototype._moveGroup = function (marker, e) {
                    // get groups, indices
                    var gds = this._gds, oldIndex = this._getElementIndex(this._dragMarker), newIndex = this._getIndex(e);
                    // make the move
                    if (newIndex > oldIndex) {
                        newIndex--;
                    }
                    if (newIndex >= this._gds.length) {
                        newIndex = this._gds.length;
                    }
                    if (oldIndex != newIndex) {
                        gds.deferUpdate(function () {
                            var gd = gds[oldIndex];
                            gds.removeAt(oldIndex);
                            gds.insert(newIndex, gd);
                        });
                    }
                };
                // removes a given group
                GroupPanel.prototype._removeGroup = function (index, groups) {
                    if (groups === void 0) { groups = this._gds; }
                    var group = (groups && index > -1) ? groups[index] : null, binding = group instanceof wijmo.collections.PropertyGroupDescription ? group.propertyName : null, col = binding ? this._g.columns.getColumn(binding) : null;
                    // show the column
                    if (col) {
                        col.visible = true;
                        var cols = this._hiddenCols, idx = cols.indexOf(col);
                        if (idx > -1) {
                            cols.splice(idx, 1);
                        }
                    }
                    // remove the group (after showing the column: TFS 444134)
                    if (group) {
                        groups.removeAt(index);
                    }
                };
                // gets the index of the marker at a given mouse position
                GroupPanel.prototype._getIndex = function (e) {
                    var x = e.clientX, arr = this._divMarkers.children;
                    for (var i = 0; i < arr.length; i++) {
                        var rc = arr[i].getBoundingClientRect();
                        if ((x - rc.left) * (x - rc.right) < 0) { // to work with RTL
                            return i;
                        }
                    }
                    return arr.length;
                };
                // gets an element's index within its parent collection
                GroupPanel.prototype._getElementIndex = function (e) {
                    if (e && e.parentElement) {
                        var arr = e.parentElement.children;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == e) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };
                // ** event handlers
                // save reference to column when the user starts dragging it
                GroupPanel.prototype._draggingColumn = function (s, e) {
                    var g = this._g, col = g._getBindingColumn(e.panel, e.row, g.columns[e.col]);
                    this._dragCol = col.binding ? col : null;
                };
                // restore column visibility
                GroupPanel.prototype._itemsSourceChanging = function (s, e) {
                    this._hiddenCols.forEach(function (col) {
                        col.visible = true;
                    });
                    this._hiddenCols = [];
                };
                // refresh markers when user changes the data source
                GroupPanel.prototype._itemsSourceChanged = function (s, e) {
                    // remove old event handlers
                    if (this._view) {
                        this._view.collectionChanged.removeHandler(this._collectionChanged);
                    }
                    // update members
                    this._view = this._g ? this._g.collectionView : null;
                    this._gds = this._view ? this._view.groupDescriptions : null;
                    // add event handlers
                    if (this._view) {
                        this._view.collectionChanged.addHandler(this._collectionChanged, this);
                    }
                    // and update the panel now
                    this.invalidate();
                };
                // refresh markers when groupDescriptions change
                GroupPanel.prototype._collectionChanged = function (sender, e) {
                    if (e.action == wijmo.collections.NotifyCollectionChangedAction.Reset) {
                        this.invalidate();
                    }
                };
                // drag a group marker to a new position
                GroupPanel.prototype._dragStart = function (e) {
                    wijmo._startDrag(e.dataTransfer, 'move');
                    this._dragMarker = e.target;
                    this._dragCol = null;
                };
                // accept grid columns (add group) or group markers (move group)
                GroupPanel.prototype._dragOver = function (e) {
                    // check whether we are dragging a column or a marker
                    var valid = this._dragCol || this._dragMarker;
                    // if valid, prevent default to allow drop
                    if (valid) {
                        e.dataTransfer.dropEffect = 'move';
                        e.preventDefault();
                        e.stopPropagation(); // prevent scrolling on Android
                    }
                };
                // accept grid columns (add group) or group markers (move group)
                GroupPanel.prototype._drop = function (e) {
                    if (this._dragMarker) {
                        this._moveGroup(this._dragMarker, e);
                    }
                    else if (this._dragCol) {
                        this._addGroup(this._dragCol, e);
                    }
                };
                // finish dragging process
                GroupPanel.prototype._dragEnd = function (e) {
                    this._dragMarker = this._dragCol = null;
                };
                // click markers to sort/delete/filter groups
                GroupPanel.prototype._click = function (e) {
                    // get the element that was clicked
                    var target = e.target, marker = wijmo.closest(target, '.wj-cell');
                    // if we got the marker, remove group or flip sort
                    if (wijmo.hasClass(marker, 'wj-cell')) {
                        if (wijmo.hasClass(target, 'wj-filter')) {
                            if (marker != this._filterMarker) {
                                this._editFilter(marker);
                                this._filterMarker = marker;
                                return;
                            }
                        }
                        else if (wijmo.hasClass(target, 'wj-remove')) {
                            var index = this._getElementIndex(marker);
                            this._removeGroup(index);
                        }
                        else {
                            this._updateSort(e, marker);
                        }
                    }
                    // if we got here, we should have the focus (and no filter editor: TFS 433618)
                    this._filterMarker = null;
                    this.hostElement.focus();
                };
                // add/remove sorts 
                // (with support for multi-column sorts: TFS 415549 and sortMemberPath: TFS 431461)
                GroupPanel.prototype._updateSort = function (e, marker) {
                    var _this = this;
                    var g = this._g, cv = g.collectionView;
                    // check that the grid and collectionView support sorting
                    if (!cv || !cv.canSort || g.allowSorting == wijmo.grid.AllowSorting.None) {
                        return;
                    }
                    // get the group and the column
                    var index = this._getElementIndex(marker), pgd = this._gds[index], binding = pgd instanceof wijmo.collections.PropertyGroupDescription ? pgd.propertyName : null, col = binding ? g.getColumn(binding) : null;
                    // check that the column supports sorting
                    if (!col || !col.allowSorting) {
                        return;
                    }
                    // get the property being sorted
                    var sortProp = col.sortMemberPath || col.binding, sortIndex = -1, sds = cv.sortDescriptions;
                    // find current sort for this column
                    for (var i = 0; i < sds.length; i++) {
                        if (sds[i].property == sortProp) {
                            sortIndex = i;
                            break;
                        }
                    }
                    // raise sorting events on behalf of the grid (for OutSystems)
                    var args = new wijmo.grid.CellRangeEventArgs(g.columnHeaders, new wijmo.grid.CellRange(0, col.index), e);
                    if (g.onSortingColumn(args)) {
                        var ctrlKey_1 = e.ctrlKey || e.metaKey, shiftKey_1 = e.shiftKey;
                        // apply new sort
                        sds.deferUpdate(function () {
                            if (ctrlKey_1 && shiftKey_1) {
                                // shift-control+click clears all sorts
                                sds.clear();
                            }
                            else if (sortIndex < 0) {
                                // clear any existing sorts
                                if (_this._g.allowSorting != wijmo.grid.AllowSorting.MultiColumn) {
                                    sds.clear();
                                }
                                // add new sort
                                var sd = new wijmo.collections.SortDescription(sortProp, true);
                                sds.push(sd);
                            }
                            else {
                                // remove on ctrl or touch+desending (TFS 469716)
                                var asc = sds[sortIndex].ascending, remove = ctrlKey_1 || (_this.isTouching && !asc);
                                // remove or flip the sort
                                if (remove) {
                                    sds.splice(sortIndex, 1);
                                }
                                else {
                                    var sd = new wijmo.collections.SortDescription(sortProp, !asc);
                                    sds.splice(sortIndex, 1, sd);
                                }
                            }
                        });
                        // done sorting
                        g.onSortedColumn(args);
                    }
                };
                /**
                 * Gets or sets the template used to instantiate {@link GroupPanel} controls.
                 */
                GroupPanel.controlTemplate = '<div>' +
                    '<div wj-part="div-ph"></div>' +
                    '<div wj-part="div-markers"></div>' +
                    '</div>';
                return GroupPanel;
            }(wijmo.Control));
            grouppanel.GroupPanel = GroupPanel;
        })(grouppanel = grid.grouppanel || (grid.grouppanel = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var grouppanel;
        (function (grouppanel) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.grouppanel', wijmo.grid.grouppanel);
        })(grouppanel = grid.grouppanel || (grid.grouppanel = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.grouppanel.js.map