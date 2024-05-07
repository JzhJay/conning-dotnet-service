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


    module wijmo.grid.grouppanel {
    



'use strict';

export function softGridFilter(): typeof wijmo.grid.filter {
    return wijmo._getModule('wijmo.grid.filter');
}


    }
    


    module wijmo.grid.grouppanel {
    






'use strict';

// initialize placeholder message
wijmo._addCultureInfo('GroupPanel', {
    dragDrop: 'Drag and Drop columns here to create Groups.'
});

/**
 * Represents a method that takes a binding and returns a {@link:GroupDescription}.
 */
export interface IGroupDescriptionCreator {
    /**
     * @param: property Name of the property to group by.
     * @returns A {@link GroupDescription} object used to create the groups.
     */
    (property: string): wijmo.collections.GroupDescription;
}

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
export class GroupPanel extends wijmo.Control {
    _g: any;//FlexGrid;                         // grid driving the panel
    _view: wijmo.collections.ICollectionView;                     // ICollectionView being edited
    _gds: wijmo.collections.ObservableArray<wijmo.collections.GroupDescription>;    // groupDescriptions being edited
    _hideGroupedCols = true;                    // hide columns dragged into the panel
    _showDragGlyphs = true;                     // show drag glyphs in group markers
    _maxGroups = 6;                             // maximum number of groups allowed
    _dragCol: wijmo.grid.Column;                           // column being dragged from the grid
    _dragMarker: HTMLElement;                   // marker being dragged within the panel
    _divMarkers: HTMLElement;                   // element that contains the group markers
    _divPH: HTMLElement;                        // element that contains the placeholder
    _hiddenCols = [];                           // columns hidden by this component
    _filter: wijmo.grid.filter.FlexGridFilter;                    // filter attached to the grid
    _filterMarker: HTMLElement;                 // marker with filter editor open
    _gdc: IGroupDescriptionCreator;             // custom group description creator
    _placeholder: string | null = null;         // placeholder string
    _dragEndBnd = this._dragEnd.bind(this);     // clear drag column info when dragend fires

    /**
     * Gets or sets the template used to instantiate {@link GroupPanel} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div wj-part="div-ph"></div>' +
            '<div wj-part="div-markers"></div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link GroupPanel} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // check dependencies
        //let depErr = 'Missing dependency: GroupPanel requires ';
        //assert(grid != null, depErr + 'wijmo.grid.');

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-grouppanel wj-control', tpl, {
            _divMarkers: 'div-markers',
            _divPH: 'div-ph'
        });

        // apply styles in code to keep CSP happy
        wijmo.setCss(this._divMarkers.parentElement, {
            width: '100%',
            height: '100%',
            minHeight: '1em',
            overflow: 'hidden',
            cursor: 'default'
        });

        // drag-drop events
        let host = this.hostElement,
            listen = this.addEventListener.bind(this);
        listen(host, 'dragstart', this._dragStart.bind(this));
        listen(host, 'dragover', this._dragOver.bind(this));
        listen(host, 'drop', this._drop.bind(this));
        listen(host, 'dragend', this._dragEndBnd);

        // click markers to sort/delete/filter groups
        listen(host, 'click', this._click.bind(this));

        // apply options
        this.initialize(options);
    }
    /**
     * Gets or sets a value indicating whether the panel hides grouped columns in the owner grid.
     *
     * The {@link FlexGrid} displays grouping information in row headers, so it is
     * usually a good idea to hide grouped columns since they display redundant 
     * information.
     * 
     * The default value for this property is **true**.
     */
    get hideGroupedColumns(): boolean {
        return this._hideGroupedCols;
    }
    set hideGroupedColumns(value: boolean) {
        if (value != this._hideGroupedCols) {
            this._hideGroupedCols = wijmo.asBoolean(value);
        }
    }
    /**
     * Gets or sets a value that determines whether the control should
     * add drag glyphs to the group marker elements.
     * 
     * The default value for this property is **true**.
     */
    get showDragGlyphs(): boolean {
        return this._showDragGlyphs;
    }
    set showDragGlyphs(value: boolean) {
        if (value != this._showDragGlyphs) {
            this._showDragGlyphs = wijmo.asBoolean(value);
            this.refresh();
        }
    }
    /**
     * Gets or sets the maximum number of groups allowed.
     * 
     * Setting this property to -1 allows any number of groups to be created.
     * Setting it to zero prevents any grouping.
     * 
     * The default value for this property is **6**.
     */
    get maxGroups(): number {
        return this._maxGroups;
    }
    set maxGroups(value: number) {
        if (value != this._maxGroups) {

            // apply the new value
            this._maxGroups = wijmo.asNumber(value);

            // trim group descriptions as needed (TFS 350568)
            let gds = this._gds,
                max = this._maxGroups;
            if (gds && max > -1 && max < gds.length) {
                gds.splice(max, gds.length - max);
            }
        }
    }
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
    get placeholder(): string | null {
        return this._placeholder;
    }
    set placeholder(value: string | null) {
        if (value != this._placeholder) {
            this._placeholder = value;
            this.invalidate();
        }
    }
    /**
     * Gets or sets the {@link FlexGrid} that is connected to this {@link GroupPanel}.
     *
     * Once a grid is connected to the panel, the panel displays the groups
     * defined in the grid's data source. Users can drag grid columns
     * into the panel to create new groups, drag groups within the panel to 
     * re-arrange the groups, or delete items in the panel to remove the groups.
     */
    get grid(): wijmo.grid.FlexGrid {
        return this._g;
    }
    set grid(value: wijmo.grid.FlexGrid) {
        value = wijmo.asType(value, wijmo.grid.FlexGrid, true) as wijmo.grid.FlexGrid;
        if (value != this._g) {

            // unhook event handlers
            let g = this._g;
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
    }
    /**
     * Gets the {@link ICollectionView} whose groups are being managed by this
     * {@link GroupPanel}.
     */
    get collectionView() : wijmo.collections.ICollectionView {
        return this._g ? this._g.collectionView : null;
    }
    /**
     * Gets or sets the {@link wijmo.grid.filter.FlexGridFilter} to use for filtering
     * the grid data.
     * 
     * If you set this property to a valid filter, the group descriptors will
     * display filter icons that can be used to see and edit the filer conditions
     * associated with the groups.
     */
    get filter(): wijmo.grid.filter.FlexGridFilter {
        return this._filter;
    }
    set filter(value: wijmo.grid.filter.FlexGridFilter) {
        value = wijmo.asType(value, softGridFilter().FlexGridFilter, true);
        if (value != this._filter) {
            let filter = this._filter;
            if (filter) {
                filter.filterApplied.removeHandler(this.refresh, this);
                filter.filterChanged.removeHandler(this._filterChanged, this);
            }
            filter = this._filter = value;
            if (filter) {
                filter.filterApplied.addHandler(this.refresh, this);
                filter.filterChanged.addHandler(this._filterChanged, this);
            }
            this.refresh();
        }
    }
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
    get groupDescriptionCreator(): IGroupDescriptionCreator {
        return this._gdc;
    }
    set groupDescriptionCreator(value: IGroupDescriptionCreator) {
        this._gdc = value;
    }

    // ** overrides

    /**
     * Updates the panel to show the current groups.
     */
    refresh() {
        super.refresh();

        // clear div/state
        this._divMarkers.innerHTML = '';
        this._dragMarker = this._dragCol = null;

        // add groups to div
        if (this._gds) {

            // add markers for each group
            let g = this._g,
                panel = g.columnHeaders;
            for (let i = 0; i < this._gds.length; i++) {
                let gd = this._gds[i],
                    row = -1,
                    col = -1;

                // find row and column indices to use when generating the markers (e.g. MultiRow)
                // but start scanning from the last row to handle merged headers (TFS 251887)
                if (gd instanceof wijmo.collections.PropertyGroupDescription) {
                    for (let rowIndex = panel.rows.length - 1; rowIndex >= 0 && col < 0; rowIndex--) {
                        for (let colIndex = 0; colIndex < panel.columns.length && col < 0; colIndex++) {
                            let bCol = g._getBindingColumn(panel, rowIndex, panel.columns[colIndex]);
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
                    let mk = document.createElement('div');
                    g.cellFactory.updateCell(this._g.columnHeaders, row, col, mk);
                    mk.setAttribute('class', 'wj-cell wj-header wj-groupmarker');
                    wijmo.setCss(mk, {
                        position: 'static',
                        display: 'inline-block',
                        verticalAlign: 'top', // to remove extra space below the element
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
                    let bCol = g._getBindingColumn(panel, row, panel.columns[col]),
                        cf = this._getColumnFilter(bCol);
                    if (cf) {
                        let filter = wijmo.createElement('<span class="wj-filter wj-glyph-filter"></span>', mk);
                        wijmo.toggleClass(filter, 'wj-filter-on', cf.isActive);
                        wijmo.toggleClass(filter, 'wj-filter-off', !cf.isActive);
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
            let hasGroups = this._divMarkers.children.length > 0;
            this._divPH.style.display = hasGroups ? 'none' : '';
            this._divMarkers.style.display = hasGroups ? '' : 'none';
        }
    }

    /**
     * Gets the {@link GroupDescription} at a given mouse position or
     * represented by a given HTML element.
     * 
     * @param e Element to test.
     * @returns The {@link GroupDescription} represented by the element, 
     * or null if the element does not represent a {@link GroupDescription}.
     */
    hitTest(e: MouseEvent | Element): wijmo.collections.GroupDescription {
        let target = (e instanceof HTMLElement) ? e
            : (e instanceof MouseEvent) ? e.target as Element
            : null;
        wijmo.assert(target != null, 'MouseEvent or Element expected');

        // get marker the contains the target
        let marker = wijmo.closest(target, '.wj-cell') as HTMLElement;

        // if we got the marker, remove group or flip sort
        if (wijmo.hasClass(marker, 'wj-cell')) {
            let index = this._getElementIndex(marker);
            return this._gds && index > -1 ? this._gds[index] : null;
        }

        // not a marker
        return null;
    }

    // ** implementation

    // user closed the filter editor: clear _filterMarker (TFS 438726)
    _filterChanged() {
        this._filterMarker = null;
    }

    // gets the column filter associated with a given column
    _getColumnFilter(col: wijmo.grid.Column) {
        let filter = this._filter,
            cf = null;
        if (filter) {
            cf = (filter.filterColumns && filter.filterColumns.indexOf(col.binding) < 0)
                ? null
                : filter.getColumnFilter(col);
        }
        return cf;
    }

    // edit the filter for a given group marker
    _editFilter(marker: HTMLElement) {

        // get the group
        let groups = this._gds,
            index = this._getElementIndex(marker),
            group = groups && index > -1 ? groups[index] : null;

        // and show the filter editor
        let binding = group instanceof wijmo.collections.PropertyGroupDescription ? group.propertyName : null,
            col = binding ? this._g.getColumn(binding) : null;
        if (col) {
            this._filter.editColumnFilter(col, null, marker);
        }
    }

    // add a group at a specific position
    _addGroup(col: wijmo.grid.Column, e: MouseEvent) {

        // get index where the new group will be inserted
        let index = this._getIndex(e),
            gds = this._gds,
            max = this._maxGroups;

        // remove group in case it's already there
        for (let i = 0; i < gds.length; i++) {
            let pgd = gds[i] as wijmo.collections.PropertyGroupDescription;
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
            for (let i = max - 1; i < gds.length; i++) {
                this._removeGroup(i, gds); // TFS 198128
                if (i < index) {
                    index--;
                }
            }
        }

        // add new group
        if (max < 0 || gds.length < max) {

            // add new GroupDescription at the right place
            let gd = this._gdc ? this._gdc(col.binding) : null;
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
    }

    // move a group to a new position
    _moveGroup(marker: HTMLElement, e: MouseEvent) {

        // get groups, indices
        let gds = this._gds,
            oldIndex = this._getElementIndex(this._dragMarker),
            newIndex = this._getIndex(e);

        // make the move
        if (newIndex > oldIndex) {
            newIndex--;
        }
        if (newIndex >= this._gds.length) {
            newIndex = this._gds.length;
        }
        if (oldIndex != newIndex) {
            gds.deferUpdate(() => {
                let gd = gds[oldIndex];
                gds.removeAt(oldIndex);
                gds.insert(newIndex, gd);
            });
        }
    }

    // removes a given group
    _removeGroup(index: number, groups = this._gds) {
        let group = (groups && index > -1) ? groups[index] : null,
            binding = group instanceof wijmo.collections.PropertyGroupDescription ? group.propertyName : null,
            col = binding ? this._g.columns.getColumn(binding) : null;
        
        // show the column
        if (col) {
            col.visible = true;
            let cols = this._hiddenCols,
                idx = cols.indexOf(col);
            if (idx > -1) {
                cols.splice(idx, 1);
            }
        }

        // remove the group (after showing the column: TFS 444134)
        if (group) {
            groups.removeAt(index);
        }
    }

    // gets the index of the marker at a given mouse position
    _getIndex(e: MouseEvent): number {
        let x = e.clientX,
            arr = this._divMarkers.children;
        for (let i = 0; i < arr.length; i++) {
            let rc = arr[i].getBoundingClientRect();
            if ((x - rc.left) * (x - rc.right) < 0) { // to work with RTL
                return i;
            }
        }
        return arr.length;
    }

    // gets an element's index within its parent collection
    _getElementIndex(e: HTMLElement): number {
        if (e && e.parentElement) {
            let arr = e.parentElement.children;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == e) {
                    return i;
                }
            }
        }
        return -1;
    }

    // ** event handlers

    // save reference to column when the user starts dragging it
    _draggingColumn(s: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        let g = this._g,
            col = g._getBindingColumn(e.panel, e.row, g.columns[e.col]);
        this._dragCol = col.binding ? col : null;
    }

    // restore column visibility
    _itemsSourceChanging(s: wijmo.grid.FlexGrid, e: wijmo.EventArgs) {
        this._hiddenCols.forEach(col => {
            col.visible = true;
        });
        this._hiddenCols = [];
    }

    // refresh markers when user changes the data source
    _itemsSourceChanged(s: wijmo.grid.FlexGrid, e: wijmo.EventArgs) {

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
    }

    // refresh markers when groupDescriptions change
    _collectionChanged(sender, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (e.action == wijmo.collections.NotifyCollectionChangedAction.Reset) {
            this.invalidate();
        }
    }

    // drag a group marker to a new position
    _dragStart(e: DragEvent) {
        wijmo._startDrag(e.dataTransfer, 'move');
        this._dragMarker = e.target as HTMLElement;
        this._dragCol = null;
    }

    // accept grid columns (add group) or group markers (move group)
    _dragOver(e: DragEvent) {

        // check whether we are dragging a column or a marker
        let valid = this._dragCol || this._dragMarker;

        // if valid, prevent default to allow drop
        if (valid) {
            e.dataTransfer.dropEffect = 'move';
            e.preventDefault();
            e.stopPropagation(); // prevent scrolling on Android
        }
    }

    // accept grid columns (add group) or group markers (move group)
    _drop(e: DragEvent) {
        if (this._dragMarker) {
            this._moveGroup(this._dragMarker, e);
        } else if (this._dragCol) {
            this._addGroup(this._dragCol, e);
        }
    }

    // finish dragging process
    _dragEnd(e: DragEvent) {
        this._dragMarker = this._dragCol = null;
    }

    // click markers to sort/delete/filter groups
    _click(e: MouseEvent) {

        // get the element that was clicked
        let target = e.target as HTMLElement,
            marker = wijmo.closest(target, '.wj-cell') as HTMLElement;

        // if we got the marker, remove group or flip sort
        if (wijmo.hasClass(marker, 'wj-cell')) {
            if (wijmo.hasClass(target, 'wj-filter')) {
                if (marker != this._filterMarker) {
                    this._editFilter(marker);
                    this._filterMarker = marker;
                    return;
                }
            } else if (wijmo.hasClass(target, 'wj-remove')) {
                let index = this._getElementIndex(marker);
                this._removeGroup(index);
            } else {
                this._updateSort(e, marker);
            }
        }

        // if we got here, we should have the focus (and no filter editor: TFS 433618)
        this._filterMarker = null;
        this.hostElement.focus();
    }

    // add/remove sorts 
    // (with support for multi-column sorts: TFS 415549 and sortMemberPath: TFS 431461)
    _updateSort(e: MouseEvent, marker: HTMLElement) {
        let g = this._g,
            cv = g.collectionView;

        // check that the grid and collectionView support sorting
        if (!cv || !cv.canSort || g.allowSorting == wijmo.grid.AllowSorting.None) {
            return;
        }

        // get the group and the column
        let index = this._getElementIndex(marker),
            pgd = this._gds[index],
            binding = pgd instanceof wijmo.collections.PropertyGroupDescription ? pgd.propertyName : null,
            col = binding ? g.getColumn(binding) : null;

        // check that the column supports sorting
        if (!col || !col.allowSorting) {
            return;
        }

        // get the property being sorted
        let sortProp = col.sortMemberPath || col.binding,
            sortIndex = -1,
            sds = cv.sortDescriptions;

        // find current sort for this column
        for (let i = 0; i < sds.length; i++) {
            if (sds[i].property == sortProp) {
                sortIndex = i;
                break;
            }
        }

        // raise sorting events on behalf of the grid (for OutSystems)
        let args = new wijmo.grid.CellRangeEventArgs(g.columnHeaders, new wijmo.grid.CellRange(0, col.index), e);
        if (g.onSortingColumn(args)) {
            let ctrlKey = e.ctrlKey || e.metaKey,
                shiftKey = e.shiftKey;

            // apply new sort
            sds.deferUpdate(() => {
                if (ctrlKey && shiftKey) {

                    // shift-control+click clears all sorts
                    sds.clear();

                } else if (sortIndex < 0) {

                    // clear any existing sorts
                    if (this._g.allowSorting != wijmo.grid.AllowSorting.MultiColumn) {
                        sds.clear();
                    }

                    // add new sort
                    let sd = new wijmo.collections.SortDescription(sortProp, true);
                    sds.push(sd);

                } else {

                    // remove on ctrl or touch+desending (TFS 469716)
                    let asc = sds[sortIndex].ascending,
                        remove = ctrlKey || (this.isTouching && !asc);
                        
                    // remove or flip the sort
                    if (remove) {
                        sds.splice(sortIndex, 1);
                    } else {
                        let sd = new wijmo.collections.SortDescription(sortProp, !asc);
                        sds.splice(sortIndex, 1, sd);
                    }
                }
            });

            // done sorting
            g.onSortedColumn(args);
        }
    }
}
    }
    


    module wijmo.grid.grouppanel {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.grouppanel', wijmo.grid.grouppanel);


    }
    