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


    module wijmo.grid.filter {
    







'use strict';

/**
 * Specifies types of column filter.
 */
export enum FilterType {
    /** No filter. */
    None = 0,
    /** A filter based on two conditions. */
    Condition = 1,
    /** A filter based on a set of values. */
    Value = 2,
    /** A filter that combines condition and value filters. */
    Both = 3
}

/**
 * Implements an Excel-style filter for {@link FlexGrid} controls.
 *
 * To enable filtering on a {@link FlexGrid} control, create an instance 
 * of the {@link FlexGridFilter} and pass the grid as a parameter to the 
 * constructor. For example:
 *
 * ```typescript
 * import { FlexGrid } from '@grapecity/wijmo.grid';
 * import { FlexGridFilter } from '@grapecity/wijmo.grid.filter';
 * let flex = new FlexGrid('#theGrid'); // create the grid
 * let filter = new FlexGridFilter(flex); // add a filter to the grid
 * ```
 *
 * Once this is done, a filter icon is added to the grid's column headers. 
 * Clicking the icon shows an editor where the user can edit the filter
 * conditions for that column.
 *
 * The {@link FlexGridFilter} class depends on the **wijmo.grid** and 
 * **wijmo.input** modules.
 * 
 * The example below shows how you can use a {@link FlexGridFilter} to add 
 * filtering to a {@link FlexGrid} control:
 * 
 * {@sample Grid/FilteringSearching/Excel-likeFilter/Overview/purejs Example}
 */
export class FlexGridFilter {
    static _WJC_FILTER = 'wj-elem-filter';

    // members
    private _g: wijmo.grid.FlexGrid;
    private _filters: ColumnFilter[];
    private _filterColumns: string[];
    private _divEdt: HTMLElement;
    private _edtCol: wijmo.grid.Column;
    private _edtColPrev: wijmo.grid.Column;
    private _showIcons = true;
    private _showSort = true;
    private _defFilterType = FilterType.Both;
    private _xValueSearch = true;
    
    static _skipColumn: wijmo.grid.Column; // column to skip when applying filter (TFS 467407, 467185)

    /**
     * Initializes a new instance of the {@link FlexGridFilter} class.
     *
     * @param grid The {@link FlexGrid} to filter.
     * @param options Initialization options for the {@link FlexGridFilter}.
     */
    constructor(grid: wijmo.grid.FlexGrid, options?: any) {

        // check dependencies
        //let depErr = 'Missing dependency: FlexGridFilter requires ';
        //assert(wijmo.grid != null, depErr + 'wijmo.grid.');
        //assert(wijmo.input != null, depErr + 'wijmo.input.');

        // initialize filter
        this._filters = [];
        this._g = wijmo.asType(grid, wijmo.grid.FlexGrid, false);
        this._g.formatItem.addHandler(this._formatItem.bind(this));
        this._g.itemsSourceChanged.addHandler(this.clear.bind(this));
        let host = this._g.hostElement;
        grid.addEventListener(host, 'mousedown', this._mousedown.bind(this), true);
        grid.addEventListener(host, 'click', this._click.bind(this), true);
        grid.addEventListener(host, 'keydown', this._keydown.bind(this), true);

        // initialize column filters
        this._g.invalidate();

        // apply options
        wijmo.copy(this, options);
    }
    /**
     * Gets a reference to the {@link FlexGrid} that owns this filter.
     */
    get grid(): wijmo.grid.FlexGrid {
        return this._g;
    }
    /**
     * Gets or sets an array containing the names or bindings of the columns
     * that have filters.
     *
     * Setting this property to null or to an empty array adds filters to 
     * all columns.
     */
    get filterColumns(): string[] {
        return this._filterColumns;
    }
    set filterColumns(value: string[]) {
        this._filterColumns = wijmo.asArray(value);
        this.clear();
    }
    /**
     * Gets or sets a value indicating whether the {@link FlexGridFilter} adds filter
     * editing buttons to the grid's column headers.
     *
     * If you set this property to false, then you are responsible for providing
     * a way for users to edit, clear, and apply the filters.
     * 
     * The default value for this property is **true**.
     */
    get showFilterIcons(): boolean {
        return this._showIcons;
    }
    set showFilterIcons(value: boolean) {
        if (value != this.showFilterIcons) {
            this._showIcons = wijmo.asBoolean(value);
            if (this._g) {
                this._g.invalidate();
            }
        }
    }
    /**
     * Gets or sets a value indicating whether the filter editor should include
     * sort buttons.
     *
     * By default, the editor shows sort buttons like Excel does. But since users
     * can sort columns by clicking their headers, sort buttons in the filter editor
     * may not be desirable in some circumstances.
     * 
     * The default value for this property is **true**.
     */
    get showSortButtons(): boolean {
        return this._showSort;
    }
    set showSortButtons(value: boolean) {
        this._showSort = wijmo.asBoolean(value);
    }
    /**
     * Gets the filter for the given column.
     *
     * @param col The {@link Column} that the filter applies to (or column name or index).
     * If the specified column does not exist, the method returns null.
     * @param create Whether to create the filter if it does not exist.
     */
    getColumnFilter(col: wijmo.grid.Column | string | number, create = true): ColumnFilter {

        // get the column by name or index, check type
        col = this._asColumn(col) as wijmo.grid.Column;
        if (col) { // TFS 418511

            // look for the filter
            for (let i = 0; i < this._filters.length; i++) {
                if (this._filters[i].column == col) {
                    return this._filters[i];
                }
            }

            // not found, create one now
            if (create && col.binding) {
                let cf = new ColumnFilter(this, col);
                this._filters.push(cf);
                return cf;
            }
        }

        // not found, not created
        return null;
    }
    /**
     * Gets or sets the default filter type to use.
     *
     * This value can be overridden in filters for specific columns.
     * For example, the code below creates a filter that filters by
     * conditions on all columns except the "ByValue" column:
     *
     * ```typescript
     * import { FlexGridFilter, FilterType } from '@grapecity/wijmo.grid.filter';
     * let filter = new FlexGridFilter(flex);
     * filter.defaultFilterType = FilterType.Condition;
     * let col = flex.getColumn('ByValue'),
     *     cf = filter.getColumnFilter(col);
     * cf.filterType = FilterType.Value;
     * ```
     * 
     * The default value for this property is **FilterType.Both**.
     */
    get defaultFilterType(): FilterType {
        return this._defFilterType;
    }
    set defaultFilterType(value: FilterType) {
        value = wijmo.asEnum(value, FilterType, false);
        if (value != this.defaultFilterType) {
            this._defFilterType = value;
            this._g.invalidate();
            this.clear();
        }
    }
    /**
     * Gets or sets a value that determines whether the filter should
     * include only values selected by the {@link ValueFilter.filterText} 
     * property.
     * 
     * The default value for this property is **true**, which matches
     * Excel's behavior.
     * 
     * Set it to false to disable this behavior, so searching only affects
     * which items are displayed on the list and not which items are
     * included in the filter.
     */
    get exclusiveValueSearch(): boolean {
        return this._xValueSearch;
    }
    set exclusiveValueSearch(value: boolean) {
        this._xValueSearch = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the current filter definition as a JSON string.
     * 
     * The {@link filterDefinition} includes information about all 
     * currently active column filters. It does not include data maps
     * because data maps are not serializable.
     */
    get filterDefinition(): string {
        let def = {
            defaultFilterType: this.defaultFilterType,
            filters: []
        }
        this._filters.forEach(cf => {
            let cfc = cf.conditionFilter,
                cfv = cf.valueFilter,
                hasUniqueValues = cfv.uniqueValues && cfv.uniqueValues.length;
            if (cf && cf.column && cf.column.binding) {

                // check whether we have to save this column filter
                if (cf.isActive || hasUniqueValues || cf.filterType != this.defaultFilterType) {
                    let cfDef: any = {
                        binding: cf.column.binding
                    };

                    // save condition/value filters
                    if (cfc.isActive) {
                        let c1 = cfc.condition1,
                            c2 = cfc.condition2;
                        cfDef = {
                            binding: cf.column.binding,
                            type: 'condition',
                            condition1: { operator: c1.operator, value: c1.value },
                            and: cfc.and,
                            condition2: { operator: c2.operator, value: c2.value }
                        };
                    } else if (cfv.isActive || hasUniqueValues) {
                        cfDef = {
                            binding: cf.column.binding,
                            type: 'value',
                            uniqueValues: cfv.uniqueValues,
                            sortValues: cfv.sortValues,
                            maxValues: cfv.maxValues,
                            exclusiveValueSearch: cfv.exclusiveValueSearch,
                            showValues: cfv.showValues
                        };
                    }

                    // save filter type (TFS 345363)
                    if (cf.filterType != this.defaultFilterType) {
                        cfDef.filterType = cf.filterType;
                    }

                    // add to list
                    def.filters.push(cfDef);
                }
            }
        });
        return JSON.stringify(def);
    }
    set filterDefinition(value: string) {

        // make sure the value is a string
        value = wijmo.asString(value);

        // empty/null clears filter
        this.clear();

        // if a value was provided, parse it
        if (value) {
            let def = JSON.parse(value);
            this.defaultFilterType = def.defaultFilterType;
            for (let i = 0; i < def.filters.length; i++) {

                // get the column for this filter
                let cfs = def.filters[i],
                    col = this._asColumn(cfs.binding);
                    
                // if not found, create a fake column (column may have been removed: TFS 469714)
                if (!col) {
                    col = new wijmo.grid.Column({ binding: cfs.binding });
                }
                 
                // get the column filter for this column
                let cf = this.getColumnFilter(col, true); 
                if (cf) {

                    // copy filterType (before applying filter definition) (TFS 345363)
                    if (cfs.filterType != null) {
                        cf.filterType = wijmo.asEnum(cfs.filterType, FilterType);
                    }

                    // copy condition/value filters
                    switch (cfs.type) {
                        case 'condition':
                            let cfc = cf.conditionFilter;
                            cfc.condition1.value = col.dataType == wijmo.DataType.Date // handle times/times: TFS 125144, 143453
                                ? wijmo.changeType(cfs.condition1.value, col.dataType, null)
                                : cfs.condition1.value;
                            cfc.condition1.operator = cfs.condition1.operator;
                            cfc.and = cfs.and;
                            cfc.condition2.value = col.dataType == wijmo.DataType.Date
                                ? wijmo.changeType(cfs.condition2.value, col.dataType, null)
                                : cfs.condition2.value;
                            cfc.condition2.operator = cfs.condition2.operator;
                            break;
                        case 'value':
                            let cfv = cf.valueFilter;
                            cfv.uniqueValues = cfs.uniqueValues;
                            ['sortValues', 'maxValues', 'exclusiveValueSearch'].forEach(prop => {
                                if (cfs[prop] != null) { // TFS 361036
                                    cfv[prop] = cfs[prop];
                                }
                            });
                            cfv.showValues = cfs.showValues;
                            break;
                    }
                }
            }
        }

        // done, apply new filter
        this.apply();
    }
    /**
     * Gets the active {@link ColumnFilterEditor}.
     * 
     * This property allows you to customize the filter editor when 
     * handling the {@link filterChanging} event.
     * It returns null when no filters are being edited.
     */
    get activeEditor(): ColumnFilterEditor {
        return wijmo.Control.getControl(this._divEdt) as ColumnFilterEditor;
    }
    /**
     * Shows the filter editor for the given grid column.
     *
     * @param col The {@link Column} that contains the filter to edit.
     * @param ht A {@link wijmo.grid.HitTestInfo} object containing the range of the cell
     * that triggered the filter display.
     * @param ref An HTMLElement to use as a reference for positioning the editor.
     */
    editColumnFilter(col: any, ht?: wijmo.grid.HitTestInfo, ref?: HTMLElement) {
        let g = this._g;

        // close current editor if any
        this.closeEditor();

        // resolve column (by name, index, or reference)
        col = this._asColumn(col);

        // raise onEditingFilter event (before creating the editor)
        let e = new wijmo.grid.CellRangeEventArgs(g.cells, new wijmo.grid.CellRange(-1, col.index));
        if (!this.onEditingFilter(e)) {
            return;
        }

        // get the filter and create the editor
        // (so users can get to it from the filterChanging event: TFS 389763)
        let div = wijmo.createElement('<div class="wj-dropdown-panel"></div>'),
            cf = this.getColumnFilter(col),
            edt = new ColumnFilterEditor(div, cf, this.showSortButtons);
        this._divEdt = div;
        this._edtCol = col;
        if (g.rightToLeft) {
            div.dir = 'rtl';
        }

        // raise filterChanging event (editor is already available: TFS 389763)
        if (!this.onFilterChanging(e)) {
            this._divEdt = this._edtCol = null;
            return;
        }
        e.cancel = true; // assume the changes will be canceled

        // apply filter when it changes
        edt.filterChanged.addHandler(() => {
            e.cancel = false; // the changes were not canceled
            setTimeout(() => { // apply after other handlers have been called
                if (!e.cancel) {
                    this.apply();
                }
            });
        });

        // close editor when editor button is clicked
        edt.buttonClicked.addHandler(() => {
            this.closeEditor();
            g.focus();
            this.onFilterChanged(e);
        });

        // close editor when it loses focus (changes are not applied)
        edt.lostFocus.addHandler(() => {
            setTimeout(() => {
                let ctl = wijmo.Control.getControl(this._divEdt);
                if (ctl && !ctl.containsFocus()) {
                    this.closeEditor();
                }
            }, 10); //200); // let others handle it first
        });

        // find the actual column index 
        // (may be different from the binding column index, TFS 336015, 404275, 466783)
        let colIndex = ht ? ht.col : col.index,
            colByIndex = g.columns[colIndex];
        if (!ht && (!colByIndex || colByIndex.binding != col.binding)) {
            colIndex = g.selection.leftCol;
        }

        // commit any pending row edits and scroll the column into view
        // use actual column here instead of binding column (TFS 334680)
        g._edtHdl._commitRowEdits(); // TFS 306203
        g.scrollIntoView(-1, colIndex, true);

        // get the header cell to position the editor
        let ch = g.columnHeaders,
            r = ht && ht.panel == ch ? ht.row : ch.rows.length - 1,
            c = colIndex,
            hdrCell = ref || ch.getCellElement(r, c),
            rc = hdrCell ? null : ch.getCellBoundingRect(r, c);

        // show the editor
        if (hdrCell) {
            wijmo.showPopup(div, hdrCell, false, false, false);
        } else {
            wijmo.showPopup(div, rc);
        }

        // update aria-expanded attribute on both buttons (visible and hidden)
        this._setAriaExpanded(hdrCell, true);
        this._setAriaExpanded(g.cells.getCellElement(-1, c), true);

        // give the focus to the editor's first visible input element
        let inputs = edt.hostElement.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            let el = inputs[i];
            if (el.offsetHeight > 0 && el.tabIndex > -1 && !el.disabled) {
                el.focus();
                break;
            }
        }
        if (!edt.containsFocus()) { // just in case...
            edt.focus();
        }
    }
    _setAriaExpanded(cell: HTMLElement, value: boolean) {
        if (cell) {
            var btn = cell.querySelector('.' + FlexGridFilter._WJC_FILTER);
            wijmo.setAttribute(btn, 'aria-expanded', value);
        }
    }
    /**
     * Closes the filter editor.
     */
    closeEditor() {
        let g = this._g,
            edt = wijmo.Control.getControl(this._divEdt),
            col = this._edtCol;
        if (edt) {
            wijmo.hidePopup(edt.hostElement, () => { // remove editor from DOM
                edt.dispose(); // dispose of editor to avoid memory leaks
            });
        }
        if (col) {
            let p = g.columnHeaders,
                cell = p.rows.length ? p.getCellElement(p.rows.length - 1, col.index) : null;
            this._setAriaExpanded(cell, false);
            cell = g.cells.getCellElement(-1, col.index);
            this._setAriaExpanded(cell, false);
        }
        this._divEdt = null;
        this._edtCol = null;
    }
    /**
     * Applies the current column filters to the grid.
     */
    apply() {
        let view = this._g.collectionView;
        if (view) {

            // commit any pending edits (TFS 271476)
            let ecv = this._g.editableCollectionView;
            if (ecv) {
                ecv.commitEdit();
                ecv.commitNew();
            }

            // apply the filter (TFS 313344)
            view.filter = this._filter.bind(this);
        }

        // apply filter definition if the collectionView supports that
        let updateFilterDefinition = view ? view['updateFilterDefinition'] : null;
        if (wijmo.isFunction(updateFilterDefinition)) {
            updateFilterDefinition.call(view, this);
        }

        // and fire the event
        this.onFilterApplied();
    }
    /**
     * Clears all column filters.
     */
    clear() {
        if (this._filters.length) {
            this._filters = [];
            this.apply();
        }
    }

    // ** events

    /**
     * Occurs after the filter is applied.
     */
    readonly filterApplied = new wijmo.Event<FlexGridFilter, wijmo.EventArgs>();
    /**
     * Raises the {@link filterApplied} event.
     */
    onFilterApplied(e?: wijmo.EventArgs) {
        this.filterApplied.raise(this, e);
    }
    /**
     * Occurs when a column filter is about to be edited by the user.
     * Use this event to customize the column filter if you want to 
     * override the default settings for the filter.
     * 
     * This event fires before the filter editor is created, so the
     * {@link activeEditor} property is null at this point. 
     * If you want to customize the editor, use the {@link filterChanging} 
     * event.
     *
     * For example, the code below customizes the list of country names
     * in the value filter editor so "Italy" is always the first value:
     * 
     * ```typescript
     * new FlexGridFilter(theGrid, {
     *     editingFilter: (s, e) => {
     *         if (e.getColumn().binding == 'country') {
     * 
     *             // start with Italy
     *             let vals = ["Italy"];
     * 
     *             // append other unique values (except Italy)
     *             let valueFilter = s.getColumnFilter("country", true).valueFilter;
     *             valueFilter.uniqueValues = null;
     *             valueFilter.getUniqueValues().forEach(item => {
     *                 if (item.text != "Italy") {
     *                     vals.push(item.text);
     *                 }
     *             });
     * 
     *             // assign custom unique value list to the valueFilter
     *             valueFilter.uniqueValues = vals;
     *             valueFilter.sortValues = false;
     *         }
     *     }
     * });
     * ```
     */
    readonly editingFilter = new wijmo.Event<FlexGridFilter, wijmo.EventArgs>();
    /**
     * Raises the {@link editingFilter} event.
     * 
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onEditingFilter(e: wijmo.grid.CellRangeEventArgs) {
        this.editingFilter.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when a column filter is about to be edited by the user.
     *
     * Use this event to customize the filter editor if you want to 
     * override its default settings.
     * You can use the {@link activeEditor} property to get a reference 
     * to the currently active filter editor.
     * 
     * For example, the code below applies a custom sort to the list of 
     * country names in the value filter editor so "Italy" is always the
     * first value:
     * 
     * ```typescript
     * new FlexGridFilter(theGrid, {
     *     filterChanging: (s, e) => {
     *         if (e.getColumn().binding == "country") {
     *             let edt = s.activeEditor,
     *                 lbHost = edt.hostElement.querySelector('[wj-part=div-values]'),
     *                 lb = Control.getControl(lbHost) as ListBox;
     *             (lb.collectionView as CollectionView).sortComparer = (a: any, b: any) => {
     *                 if (a != b) { // sort Italy first
     *                     if (a == 'Italy') return -1;
     *                     if (b == 'Italy') return +1;
     *                 }
     *                 return null; // use default sort order
     *             }
     *             lb.collectionView.refresh();
     *         }
     *     },
     * });
     * ```
     */
    readonly filterChanging = new wijmo.Event<FlexGridFilter, wijmo.grid.CellRangeEventArgs>();
    /**
     * Raises the {@link filterChanging} event.
     *
     * @param e {@link CellRangeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onFilterChanging(e: wijmo.grid.CellRangeEventArgs): boolean {
        this.filterChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a column filter has been edited by the user.
     *
     * Use the event parameters to determine the column that owns
     * the filter and whether changes were applied or canceled.
     */
    readonly filterChanged = new wijmo.Event<FlexGridFilter, wijmo.grid.CellRangeEventArgs>();
    /**
     * Raises the {@link filterChanged} event.
     */
    onFilterChanged(e: wijmo.grid.CellRangeEventArgs) {
        this.filterChanged.raise(this, e);
    }

    // ** implementation

    // get a column by name, index, or reference
    _asColumn(col: wijmo.grid.Column | string | number): wijmo.grid.Column {
        return wijmo.isString(col) ? this._g.getColumn(col as string, true) :
            wijmo.isNumber(col) ? this._g.columns[col as number] :
            wijmo.asType(col, wijmo.grid.Column, false);
    }

    // CollectionView filter function
    private _filter(item: any): boolean {
        let f = this._filters;
        for (let i = 0; i < f.length; i++) {
            let filter = f[i];

            // skip this column (ValueFilter uses this to build 
            // unique value lists: TFS 467407, 467185)
            if (filter.column == FlexGridFilter._skipColumn) {
                continue;
            }

            // apply 
            if (!filter.apply(item)) {
                return false;
            }
        }
        return true;
    }

    // handle the formatItem event to add filter icons to the column header cells
    private _formatItem(s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) {

        // format ColumnHeader cells elements
        if (e.panel == s.columnHeaders) {

            // get column, binding column
            let g = this._g,
                rng = g.getMergedRange(e.panel, e.row, e.col) || new wijmo.grid.CellRange(e.row, e.col),
                col = g.columns[rng.col] as wijmo.grid.Column,
                bCol = g._getBindingColumn(e.panel, e.row, col) as wijmo.grid.Column,
                cell = e.cell;

            // check that the row is valid for the filter icon
            if (rng.row2 == e.panel.rows.length - 1 || col != bCol) {

                // get the filter for this column
                let cf = this.getColumnFilter(bCol, this.defaultFilterType != FilterType.None);

                // honor filterColumns property
                let fCols = this._filterColumns;
                if (fCols && fCols.length && fCols.indexOf(bCol.binding) < 0 && fCols.indexOf(bCol.name) < 0) {
                    cf = null;
                }

                // update filter classes (used for styling)
                if (cf) {
                    wijmo.toggleClass(cell, 'wj-filter-on', cf.isActive);
                    wijmo.toggleClass(cell, 'wj-filter-off', !cf.isActive);
                } else {
                    wijmo.removeClass(cell, 'wj-filter-on');
                    wijmo.removeClass(cell, 'wj-filter-off');
                }

                // if we have a filter, add the filter button
                if (cf && cf.filterType != FilterType.None) {

                    // filter button in the visible column header
                    if (this._showIcons) {
                        this._addFilterButton(bCol, cf, cell);
                    }

                    // filter button in the hidden columnheader cell
                    if (e.row == 0) {
                        cell = g.cells.getCellElement(-1, e.col);
                        if (cell) {
                            this._addFilterButton(col, cf, cell);
                        }
                    }
                }
            }
        }
    }

    // add a filter icon to a cell
    _addFilterButton(col: wijmo.grid.Column, cf: ColumnFilter, cell: HTMLElement) {
        let cls = FlexGridFilter._WJC_FILTER,
            btn = wijmo.createElement(
                '<button class="wj-btn wj-btn-glyph wj-right ' + cls + '" type="button" tabindex="-1">' +
                '<span class="wj-glyph-filter"></span>' +
                '</button>');
        wijmo.setAriaLabel(btn, wijmo.culture.FlexGridFilter.ariaLabels.edit + ' ' + col.header);
        wijmo.setAttribute(btn, 'aria-haspopup', 'dialog'); // http://w3c.github.io/aria/#aria-haspopup
        wijmo.setAttribute(btn, 'aria-expanded', false);
        wijmo.setAttribute(btn, 'aria-describedby', col.describedById);
        wijmo.setAttribute(btn, 'aria-pressed', cf.isActive);

        // append to cell (TFS 323622, 323934, 325997)
        if (!cell.querySelector('.' + cls)) {
            if (cell.children.length == 1) { // treat single div as cell (e.g. v-center, MS request)
                cell = cell.querySelector('div') || cell;
            }
            cell.insertBefore(btn, cell.firstChild); // first child, float right
            //cell.appendChild(btn);
        }
    }

    // remember which filter is visible, don't show it again on click
    _mousedown(e: MouseEvent) {
        this._edtColPrev = this._edtCol;
    }

    // handle clicks to show/hide the filter editor
    _click(e: MouseEvent) {
        if (this._toggleEditor(e)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    // toggle filter editor on mousedown/click
    private _toggleEditor(e: MouseEvent): boolean {
        if (!e.defaultPrevented && e.button == 0) { // start actions on left button only: TFS 114623
            if (wijmo.closestClass(e.target, FlexGridFilter._WJC_FILTER)) {
                let g = this._g,
                    ht = g.hitTest(e.target as HTMLElement);
                if (!ht.panel) {
                    ht = g.hitTest(e);
                }
                if (ht.panel == g.columnHeaders || (ht.panel == g.cells && ht.row == -1)) {
                    let rng = g.getMergedRange(ht.panel, ht.row, ht.col) || new wijmo.grid.CellRange(ht.row, ht.col),
                        col = g.columns[rng.col], // TFS 455372
                        bCol = g._getBindingColumn(ht.panel, ht.row, col);
                    if (this._divEdt && this._edtCol == bCol) {
                        this.closeEditor();
                        g.focus(); // TFS 275275
                    } else if (bCol != this._edtColPrev) {
                        setTimeout(() => {
                            this.editColumnFilter(bCol, ht);
                        }, this._divEdt ? 100 : 0); // allow some time to close editors (TFS 117746)
                    }
                    return true;
                }
            } else {
                this.closeEditor(); // TFS 271847
            }
        }
        return false;
    }

    // show filter editor on alt+Down or alt+Up keys (like Excel)
    _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented && !e.ctrlKey && e.altKey) {
            if (e.keyCode == wijmo.Key.Down || e.keyCode == wijmo.Key.Up) { // TFS 298285
                let g = this.grid,
                    sel = g.selection,
                    col = sel.col > -1 ? g.columns[sel.col] : null,
                    bCol = col ? g._getBindingColumn(g.cells, sel.row, col) : null, // TFS 336015
                    hasDropdown = bCol && bCol.dataMap && bCol.dataMapEditor == wijmo.grid.DataMapEditor.DropDownList;
                
                // custom drop-down editor (TFS 442667)
                if (bCol && bCol.editor instanceof wijmo.input.DropDown) {
                    hasDropdown = true;
                }
                if (bCol && !hasDropdown) { // if we have a column without a drop-down (TFS 419671)
                    let cf = this.getColumnFilter(bCol, false); // and we have a filter
                    if (cf && cf.filterType != FilterType.None) { // with type != None
                        this.editColumnFilter(bCol); // then show it
                        e.preventDefault(); // and kill the event
                        e.stopPropagation();
                    }
                }
            }
        }
    }
}
    }
    


    module wijmo.grid.filter {
    

'use strict';

/**
 * Defines a filter for a column on a {@link FlexGrid} control.
 *
 * This class is used by the {@link FlexGridFilter} class; you 
 * rarely use it directly.
 */
export interface IColumnFilter {
    column: wijmo.grid.Column;
    isActive: boolean;
    apply(value): boolean;
    clear(): void;
}
    }
    


    module wijmo.grid.filter {
    




'use strict';

/**
 * Defines a condition filter for a column on a {@link FlexGrid} control.
 *
 * Condition filters contain two conditions that may be combined
 * using an 'and' or an 'or' operator.
 *
 * This class is used by the {@link FlexGridFilter} class; you will
 * rarely use it directly.
 */
export class ConditionFilter implements IColumnFilter {
    private _col: wijmo.grid.Column;
    private _c1 = new FilterCondition(this);
    private _c2 = new FilterCondition(this);
    private _and = true;
    private _map: wijmo.grid.DataMap;

    /**
     * Initializes a new instance of the {@link ConditionFilter} class.
     *
     * @param column The column to filter.
     */
    constructor(column: wijmo.grid.Column) {
        this._col = column;
    }
    /**
     * Gets the first condition in the filter.
     */
    get condition1(): FilterCondition {
        return this._c1;
    }
    /**
     * Gets the second condition in the filter.
     */
    get condition2(): FilterCondition {
        return this._c2;
    }
    /**
     * Gets a value that indicates whether to combine the two conditions 
     * with an AND or an OR operator.
     * 
     * The default value for this property is **true**.
     */
    get and(): boolean {
        return this._and;
    }
    set and(value: boolean) {
        this._and = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the {@link DataMap} used to convert raw values into display
     * values shown when editing this filter.
     */
    get dataMap(): wijmo.grid.DataMap {
        return this._map;
    }
    set dataMap(value: wijmo.grid.DataMap) {
        this._map = wijmo.asType(value, wijmo.grid.DataMap, true);
    }

    // ** IColumnFilter

    /**
     * Gets the {@link Column} to filter.
     */
    get column(): wijmo.grid.Column {
        return this._col;
    }
    /**
     * Gets a value that indicates whether the filter is active.
     *
     * The filter is active if at least one of the two conditions
     * has its operator and value set to a valid combination.
     */
    get isActive(): boolean {
        return this._c1.isActive || this._c2.isActive;
    }
    /**
     * Returns a value indicating whether a value passes this filter.
     *
     * @param value The value to test.
     */
    apply(value: any): boolean {
        let col = this._col,
            c1 = this._c1,
            c2 = this._c2,
            dateOnly = false,
            timeOnly = false;

        // no binding or not active? accept everything
        if (!col || !col._binding || !this.isActive) {
            return true;
        }

        // retrieve the value
        value = col._binding.getValue(value);
        let map = this.dataMap || col.dataMap;
        if (map) { // TFS 357112
            value = map.getDisplayValue(value);
        } else if (wijmo.isDate(value)) {
            dateOnly = !this._hasTimePart();
            timeOnly = !this._hasDatePart();

            // filter should have either date or time, UNLESS the user selected
            // an invalid format for a date field: TFS 395542
            //assert(!dateOnly || !timeOnly, 'Filter should have either date or time.');

            let refDt = FilterCondition._refDateTime;
            if (dateOnly) {
                value = wijmo.DateTime.fromDateTime(value, refDt);
            } else if (timeOnly) {
                value = wijmo.DateTime.fromDateTime(refDt, value);
            }
        } else if (wijmo.isNumber(value)) { // use same precision for numbers (TFS 124098)
            let g = wijmo.Globalize,
                fmt = col.format,
                strVal = g.formatNumber(value, fmt);
            value = g.parseFloat(strVal, fmt); // handle scaling: TFS 418348
        }

        // apply conditions
        let rv1 = c1.apply(value, dateOnly, timeOnly),
            rv2 = c2.apply(value, dateOnly, timeOnly);

        // combine results
        if (c1.isActive && c2.isActive) {
            return this._and ? (rv1 && rv2) : (rv1 || rv2);
        } else {
            return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
        }
    }
    /**
     * Clears the filter.
     */
    clear() {
        this._c1.clear();
        this._c2.clear();
        this.and = true;
    }

    // ** implementation

    // checks whether a format has a date part
    _hasDatePart(): boolean {
        let fmt = this._col.format;
        if (!fmt) return true; // default format is 'd'
        fmt = wijmo.culture.Globalize.calendar.patterns[fmt] || fmt;
        return /[yMd]+/.test(fmt); // TFS 109409
    }

    // checks whether a format has a time part
    _hasTimePart(): boolean {
        let fmt = this._col.format;
        if (!fmt) return false; // default format is 'd'
        fmt = wijmo.culture.Globalize.calendar.patterns[fmt] || fmt;
        return /[Hmst]+/.test(fmt); // TFS 109409
    }

   // ** IQueryInterface

    /**
     * Returns true if this object supports a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IColumnFilter';
    }
}
    }
    


    module wijmo.grid.filter {
    



'use strict';

/**
 * The editor used to inspect and modify {@link ConditionFilter} objects.
 *
 * This class is used by the {@link FlexGridFilter} class; you 
 * rarely use it directly.
 */
export class ConditionFilterEditor extends wijmo.Control {
    private _filter: ConditionFilter;
    private _cmb1: wijmo.input.ComboBox;
    private _val1: any;
    private _cmb2: wijmo.input.ComboBox;
    private _val2: any;
    private _canApply = false; // TFS 454775

    // child elements
    private _divHdr: HTMLElement;
    private _divCmb1: HTMLElement;
    private _divVal1: HTMLElement;
    private _divCmb2: HTMLElement;
    private _divVal2: HTMLElement;
    private _spAnd: HTMLSpanElement;
    private _spOr: HTMLSpanElement;
    private _btnAnd: HTMLInputElement;
    private _btnOr: HTMLInputElement;

    /**
     * Gets or sets the template used to instantiate {@link ConditionFilterEditor} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div wj-part="div-hdr"></div>' +
            '<div wj-part="div-cmb1"></div><br/>' +
            '<div wj-part="div-val1"></div><br/>' +
            '<div role="radiogroup" style="text-align:center">' +
                '<label><input wj-part="btn-and" type="radio" role="radio"> <span wj-part="sp-and"></span> </label>&nbsp;&nbsp;&nbsp;' +
                '<label><input wj-part="btn-or" type="radio" role="radio"> <span wj-part="sp-or"></span> </label>' +
            '</div>' +
            '<div wj-part="div-cmb2"></div><br/>' +
            '<div wj-part="div-val2"></div><br/>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link ConditionFilterEditor} class.
     *
     * @param element The DOM element that hosts the control, or a selector 
     * for the host element (e.g. '#theCtrl').
     * @param filter The {@link ConditionFilter} to edit.
     */
    constructor(element: any, filter: ConditionFilter) {
        super(element);

        // save reference to filter
        this._filter = wijmo.asType(filter, ConditionFilter, false);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-conditionfilter-editor', tpl, {
            _divHdr: 'div-hdr',
            _divCmb1: 'div-cmb1',
            _divVal1: 'div-val1',
            _btnAnd: 'btn-and',
            _btnOr: 'btn-or',
            _spAnd: 'sp-and',
            _spOr: 'sp-or',
            _divCmb2: 'div-cmb2',
            _divVal2: 'div-val2',
        });

        // aria labels
        let ci = wijmo.culture.FlexGridFilter,
            labels = ci.ariaLabels;
        wijmo.setAriaLabel(this._btnAnd, labels.and);
        wijmo.setAriaLabel(this._btnOr, labels.or);

        // localization
        wijmo.setText(this._divHdr, ci.header);
        wijmo.setText(this._spAnd, ci.and);
        wijmo.setText(this._spOr, ci.or);

        // create combos and value editors
        this._cmb1 = this._createOperatorCombo(this._divCmb1, labels.op1);
        this._cmb2 = this._createOperatorCombo(this._divCmb2, labels.op2);
        this._val1 = this._createValueInput(this._divVal1, labels.val1);
        this._val2 = this._createValueInput(this._divVal2, labels.val2);

        // disable value editors when no operators are selected
        this._val1.isDisabled = true;
        this._cmb1.selectedIndexChanged.addHandler((s, e) => {
            this._val1.isDisabled = s.selectedValue == null;
            this.canApply = !this._val1.isDisabled || !this._val2.isDisabled;
        });
        this._val2.isDisabled = true;
        this._cmb2.selectedIndexChanged.addHandler((s, e) => {
            this._val2.isDisabled = s.selectedValue == null;
            this.canApply = !this._val1.isDisabled || !this._val2.isDisabled;
        });
        
        // add event listeners for radio buttons
        let host = this.hostElement;
        this.addEventListener(host, 'change', this._btnAndOrChanged.bind(this));
        this.addEventListener(host, 'keydown', this._keydown.bind(this));

        // initialize editor (after filter is ready: TFS 415316)
        setTimeout(() => {
            this.updateEditor();
        });
    }

    /**
     * Gets a reference to the {@link ConditionFilter} being edited.
     */
    get filter(): ConditionFilter {
        return this._filter;
    }
    /**
     * Gets or sets a value that indicates whether the current edits
     * can be applied to make the filter active.
     */
    get canApply(): boolean {
        return this._canApply;
    }
    set canApply(value: boolean) {
        if (value != this._canApply) {
            this._canApply = value;
            this.onCanApplyChanged();
        }
    }
    /**
     * Updates editor with current filter settings.
     */
    updateEditor() {

        // initialize conditions
        let c1 = this._filter.condition1,
            c2 = this._filter.condition2;
        this._cmb1.selectedValue = c1.operator;
        this._cmb2.selectedValue = c2.operator;
        if (this._val1 instanceof wijmo.input.ComboBox && !(this._val1 instanceof wijmo.input.InputTime)) {
            this._val1.text = wijmo.changeType(c1.value, wijmo.DataType.String);
            this._val2.text = wijmo.changeType(c2.value, wijmo.DataType.String);
        } else {
            this._val1.value = c1.value;
            this._val2.value = c2.value;
        }

        // initialize and/or buttons
        let and = this._filter.and;
        this._checkRadio(this._btnAnd, and);
        this._checkRadio(this._btnOr, !and);
    }
    /**
     * Clears the editor without applying changes to the filter.
     */
    clearEditor() {
        this._cmb1.selectedValue = this._cmb2.selectedValue = null;
        this._val1.text = this._val2.text = null;
        this._checkRadio(this._btnAnd, true);
        this._checkRadio(this._btnOr, false);
    }
    /**
     * Gets a value that determines whether the editor has been cleared.
     */
    get isEditorClear(): boolean {
        return this._cmb1.selectedValue == null && !this._val1.text &&
            this._cmb2.selectedValue == null && !this._val2.text;
    }
    /**
     * Updates filter to reflect the current editor values.
     */
    updateFilter() {

        // update conditions
        let c1 = this._filter.condition1,
            c2 = this._filter.condition2;
        c1.operator = this._cmb1.selectedValue;
        c2.operator = this._cmb2.selectedValue;
        if ('value' in this._val1) { // TFS 372924
            c1.value = this._val1.value;
            c2.value = this._val2.value;
        } else {
            c1.value = this._getComboValue(this._val1); // TFS 372924, 392476
            c2.value = this._getComboValue(this._val2);
        }

        // update and/or operator
        this._filter.and = this._btnAnd.checked;
    }

    // ** events

    /**
     * Occurs when the value of the {@linj canApply} property changes.
     */
    readonly canApplyChanged = new wijmo.Event<ConditionFilterEditor, wijmo.EventArgs>();
    /**
     * Raises the {@link canApplyChanged} event.
     */
    onCanApplyChanged(e?: wijmo.EventArgs) {
        this.canApplyChanged.raise(this, e);
    }

    // ** implementation

    // get the current combo value or text (TFS 372924, 392476)
    private _getComboValue(cmb: wijmo.input.ComboBox): any {
        return cmb.selectedIndex > -1
            ? cmb.selectedValue
            : cmb.text;
    }

    // create operator combo
    private _createOperatorCombo(element: Element, label: string) {

        // get operator list based on column data type
        let col = this._filter.column,
            ci = wijmo.culture.FlexGridFilter,
            list = ci.stringOperators,
            DT = wijmo.DataType;
        if (!this._filter.dataMap && !col.dataMap) { // TFS 445187
            if (col.dataType == DT.Date) {
                list = ci.dateOperators;
            } else if (col.dataType == DT.Number) {
                list = ci.numberOperators;
            } else if (col.dataType == DT.Boolean) {
                list = ci.booleanOperators;
            }
        }

        // create and initialize the combo
        let cmb = new wijmo.input.ComboBox(element, {
            itemsSource: list,
            displayMemberPath: 'name',
            selectedValuePath: 'op'
        });

        // apply aria label to input element
        wijmo.setAriaLabel(cmb.inputElement, label);

        // return combo
        return cmb;
    }

    // create value input comntrol
    private _createValueInput(e: Element, label: string): wijmo.Control {
        let f = this._filter,
            col = f.column,
            map = f.dataMap || col.dataMap,
            ctl = null,
            dt = wijmo.DataType;
        if (col.dataType == dt.Date) {
            if (f._hasDatePart()) {
                ctl = f._hasTimePart()
                    ? new wijmo.input.InputDateTime(e) // date and time
                    : new wijmo.input.InputDate(e) // date only
            } else {
                ctl = new wijmo.input.InputTime(e) // time only
            }
            ctl.format = col.format;
        } else if (col.dataType == dt.Number && !map) {
            ctl = new wijmo.input.InputNumber(e);
            ctl.format = col.format;
        } else {
            ctl = new wijmo.input.ComboBox(e);
            if (map) {
                ctl.itemsSource = map.getDisplayValues();
                ctl.isEditable = true;
                ctl.caseSensitiveSearch = col.grid  // TFS 466659
                    ? col.grid.caseSensitiveSearch
                    : false;
            } else if (col.dataType == dt.Boolean) {
                ctl.itemsSource = [true, false];
            }
        }

        // never required
        ctl.isRequired = false;

        // apply aria label
        wijmo.setAriaLabel(ctl.inputElement, label);

        // done
        return ctl;
    }

    // update and/or radio buttons
    // https://www.w3.org/TR/wai-aria-practices/examples/radio/radio-1/radio-1.html
    private _btnAndOrChanged(e) {
        let and = e.target == this._btnAnd,
            or = e.target == this._btnOr;
        if (and || or) {
            this._checkRadio(this._btnAnd, and);
            this._checkRadio(this._btnOr, or);
        }
    }
    private _checkRadio(radio: HTMLInputElement, checked: boolean) {
        radio.checked = checked;
        wijmo.setAttribute(radio, 'aria-checked', checked.toString());
        wijmo.setAttribute(radio, 'tabindex', checked ? null : '-1'); // TFS 467337
    }

    // switch radio buttons with arrow keys (we have a 'roving tabindex')
    private _keydown(e) {
        let and = e.target == this._btnAnd,
            or = e.target == this._btnOr;
        if (and || or) {
            switch (e.keyCode) {
                case wijmo.Key.Left:
                case wijmo.Key.Right:
                case wijmo.Key.Up:
                case wijmo.Key.Down:
                    let btn = (and) ? this._btnOr : this._btnAnd;
                    btn.click();
                    btn.focus();
                    e.preventDefault();
                    break;
            }
        }
    }
}
    }
    


    module wijmo.grid.filter {
    



'use strict';

/**
 * Defines a filter condition.
 *
 * This class is used by the {@link FlexGridFilter} class; 
 * you will rarely have to use it directly.
 */
export class FilterCondition {
    private _op: Operator = null;
    private _val: any;
    private _strVal: string;
    private _filter: ConditionFilter;

    static _refDateTime = new Date(2000, 0, 1, 0, 0, 0);

    /**
     * Initializes a new instance of the {@link FilterCondition} class.
     *
     * @param filter The {@link ConditionFilter} that owns this {@link FilterCondition}.
     */
    constructor(filter?: ConditionFilter) {
        this._filter = filter;
    }

    /**
     * Gets or sets the operator used by this {@link FilterCondition}.
     */
    get operator(): Operator {
        return this._op;
    }
    set operator(value: Operator) {
        this._op = wijmo.asEnum(value, Operator, true);
    }
    /**
     * Gets or sets the value used by this {@link FilterCondition}.
     */
    get value(): any {
        return this._val;
    }
    set value(value: any) {
        this._val = value;
        this._strVal = wijmo.isString(value)
            ? this._getCaseString(value)
            : null;
    }
    /**
     * Gets a value that indicates whether the condition is active.
     */
    get isActive(): boolean {
        switch (this._op) {

            // no operator
            case null:
                return false;

            // equals/does not equal do not require a value (can compare to null)
            case Operator.EQ:
            case Operator.NE:
                return true;

            // other operators require a value
            default:
                return this._val != null || this._strVal != null;
        }
    }
    /**
     * Clears the condition.
     */
    clear() {
        this.operator = null;
        this.value = null;
    }
    /**
     * Returns a value that determines whether the given value passes this
     * {@link FilterCondition}.
     *
     * @param value The value to test.
     * @param dateOnly Whether to disregard the time part of **Date** values.
     * @param timeOnly Whether to disregard the date part of **Date** values.
     */
    apply(value: any, dateOnly?: boolean, timeOnly?: boolean): boolean {

        // condition value
        let thisVal = this._strVal || this._val;

        // use lower-case strings for all operations
        if (wijmo.isString(value)) {
            value = this._getCaseString(value)
        }

        // treat null values as empty strings (TFS 247101)
        if (wijmo.isString(thisVal) && value == null) {
            value = '';
        }

        // handle data/time only
        if (wijmo.isDate(thisVal)) {
            if (dateOnly) {
                thisVal = wijmo.DateTime.fromDateTime(thisVal, FilterCondition._refDateTime);
            } else if (timeOnly) {
                thisVal = wijmo.DateTime.fromDateTime(FilterCondition._refDateTime, thisVal);
            }
        }

        // apply operator
        let op = Operator;
        switch (this._op) {
            case null:
                return true;
            case op.EQ:
                return value != null && thisVal != null
                    ? value.valueOf() == thisVal.valueOf()
                    : value == thisVal;
            case op.NE: // TFS 340151
                return value != null && thisVal != null
                    ? value.valueOf() != thisVal.valueOf()
                    : value != thisVal;
            case op.GT:
                return value > thisVal;
            case op.GE:
                return value >= thisVal;
            case op.LT:
                return value < thisVal;
            case op.LE:
                return value <= thisVal;
            case op.BW:
                return this._strVal != null && wijmo.isString(value) // TFS 336790
                    ? value.indexOf(this._strVal) == 0 
                    : false;
            case op.EW:
                return this._strVal != null && wijmo.isString(value) && value.length >= this._strVal.length // TFS 336790
                    ? value.substr(value.length - this._strVal.length) == thisVal
                    : false;
            case op.CT:
                return this._strVal != null && wijmo.isString(value) // TFS 336790
                    ? value.indexOf(this._strVal) > -1
                    : false;
            case op.NC:
                return this._strVal != null && wijmo.isString(value) // TFS 336790
                    ? value.indexOf(this._strVal) < 0
                    : false;
        }
        throw 'Unknown operator';
    }

    // get a string taking into account the grid's caseSensitiveSearch property (TFS 466659)
    _getCaseString(value: string): string {
        let col = this._filter.column,
            g = col ? col.grid : null;
        return !g || !g.caseSensitiveSearch
            ? value.toLowerCase()
            : value;
    }
}
/**
 * Specifies filter condition operators.
 */
export enum Operator {
    /** Equals. */
    EQ = 0, 
    /** Does not equal. */
    NE = 1, 
    /** Greater than. */
    GT = 2, 
    /** Greater than or equal to. */
    GE = 3, 
    /** Less than. */
    LT = 4, 
    /** Less than or equal to. */
    LE = 5, 
    /** Begins with. */
    BW = 6, 
    /** Ends with. */
    EW = 7, 
    /** Contains. */
    CT = 8, 
    /** Does not contain. */
    NC = 9 
}
    }
    


    module wijmo.grid.filter {
    




'use strict';

/**
 * Defines a value filter for a column on a {@link FlexGrid} control.
 *
 * Value filters contain an explicit list of values that should be 
 * displayed by the grid.
 */
export class ValueFilter implements IColumnFilter {
    private _col: wijmo.grid.Column;
    private _values: any = null;
    private _filterText: string = null;
    private _xValueSearch = true;
    private _maxValues = 250;
    private _uniqueValues: any[] = null;
    private _sortValues = true;
    private _map: wijmo.grid.DataMap;

    /**
     * Initializes a new instance of the {@link ValueFilter} class.
     *
     * @param column The column to filter.
     */
    constructor(column: wijmo.grid.Column) {
        this._col = column;
    }
    /**
     * Gets or sets an object with the selected (checked) values on the
     * value list.
     * 
     * If the filter is not active, this property is set to null and all
     * values present in the data source are shown on the list.
     * 
     * If the filter is active (the user selected some values from the list
     * but not all), the {@link showValues} property is set to an object
     * whose property names are the display values of the selected values.
     * 
     * For example, if the value list contains country names and the user
     * selected "US" and "Japan", the {@link showValues} property returns:
     * 
     * ```javascript
     * { Japan: true, US: true }
     * ```
     */
    get showValues(): any {
        return this._values;
    }
    set showValues(value: any) {
        this._values = value;
    }
    /**
     * Gets or sets a string used to filter the list of display values.
     */
    get filterText(): string {
        return this._filterText;
    }
    set filterText(value: string) {
        this._filterText = wijmo.asString(value);
    }
    /**
     * Gets or sets a value that determines whether the filter should
     * include only values selected by the {@link filterText} property.
     *
     * The default value for this property is **true**, which matches
     * Excel's behavior.
     *
     * Set it to **false** to disable this behavior, so searching only 
     * affects which items are displayed on the list and not which items 
     * are included in the filter.
     */
    get exclusiveValueSearch(): boolean {
        return this._xValueSearch;
    }
    set exclusiveValueSearch(value: boolean) {
        this._xValueSearch = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the maximum number of elements on the list of display values.
     *
     * Adding too many items to the list makes searching difficult and hurts
     * performance. This property limits the number of items displayed at any time,
     * but users can still use the search box to filter the items they are 
     * interested in.
     * 
     * The default value for this property is **250**.
     *
     * This code changes the value to 1,000,000, effectively listing all unique
     * values for the field:
     * 
     * ```typescript
     * import { FlexGridFilter} from '@grapecity/wijmo.grid.filter';
     * 
     * // change the maxItems property for the 'id' column:
     * let f = new FlexGridFilter(theGrid);
     * f.getColumnFilter('id').valueFilter.maxValues = 1000000;
     * ```
     */
    get maxValues(): number {
        return this._maxValues;
    }
    set maxValues(value: number) {
        this._maxValues = wijmo.asNumber(value, false, true);
    }
    /**
     * Gets or sets an array containing the unique values to be displayed on the list.
     *
     * If this property is set to null, the list will be filled based on the grid data.
     *
     * Explicitly assigning the list of unique values is more efficient than building
     * the list from the data, and is required for value filters to work properly when 
     * the data is filtered on the server (because in this case some values might not 
     * be present on the client so the list will be incomplete).
     *
     * By default, the filter editor will sort the unique values when displaying them
     * to the user. If you want to prevent that and show the values in the order you
     * provided, set the {@link sortValues} property to false.
     *
     * For example, the code below provides a list of countries to be used in the
     * {@link ValueFilter} for the column bound to the 'country' field:
     *
     * ```typescript
     * import { FlexGridFilter} from '@grapecity/wijmo.grid.filter';
     * 
     * // create filter for a FlexGrid
     * let filter = new FlexGridFilter(grid);
     * 
     * // assign list of unique values to country filter
     * let cf = filter.getColumnFilter('country');
     * cf.valueFilter.uniqueValues = ['Austria', 'Belgium', 'Chile', 'Denmark'];
     * ```
     */
    get uniqueValues(): any[] | null {
        return this._uniqueValues;
    }
    set uniqueValues(value: any[] | null) {
        this._uniqueValues = wijmo.asArray(value);
    }
    /**
     * Gets or sets a value that determines whether the values should be sorted
     * when displayed in the editor.
     *
     * This property is especially useful when you are using the {@link uniqueValues}
     * to provide a custom list of values property and you would like to preserve
     * the order of the values.
     */
    get sortValues(): boolean {
        return this._sortValues;
    }
    set sortValues(value: boolean) {
        this._sortValues = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the {@link DataMap} used to convert raw values into display
     * values shown when editing this filter.
     */
    get dataMap(): wijmo.grid.DataMap {
        return this._map;
    }
    set dataMap(value: wijmo.grid.DataMap) {
        this._map = wijmo.asType(value, wijmo.grid.DataMap, true);
    }

    // ** IColumnFilter

    /**
     * Gets the {@link Column} to filter.
     */
    get column(): wijmo.grid.Column {
        return this._col;
    }
    /**
     * Gets a value that indicates whether the filter is active.
     *
     * The filter is active if some values are selected and some are not.
     * If all values are in the same state (either selected or un-selected), 
     * then the filter is not active.
     */
    get isActive(): boolean {
        return this._values != null && Object.keys(this._values).length > 0;
    }
    /**
     * Gets a value that indicates whether a value passes the filter.
     *
     * @param value The value to test.
     */
    apply(value): boolean {
        let col = this.column;

        // no binding or no values? accept everything
        if (!col || !col._binding || !this._values || !Object.keys(this._values).length) {
            return true;
        }

        // retrieve the formatted value
        value = col._binding.getValue(value);
        value =
            this.dataMap ? this.dataMap.getDisplayValue(value) || '': // TFS 440282
            col.dataMap ? col.dataMap.getDisplayValue(value)|| '' :
            wijmo.Globalize.format(value, col.format);

        // apply conditions
        return this._values[value] != undefined;
    }
    /**
     * Clears the filter.
     */
    clear() {
        this.showValues = null;
        this.filterText = null;
    }
    /**
     * Gets an array containing objects that represent all unique values 
     * for this {@link column}.
     * 
     * The objects in the array returned contain two properties:
     * *value* (the data value) and *text* (the formatted data value).
     * 
     * If the {@link uniqueValues} property is set to an array of values,
     * that array is used as a data source.
     * 
     * If {@link uniqueValues} is null, the method scans all items in the 
     * data source and returns an creates an array containing all unique
     * values.
     * 
     * This method is used by the {@link ValueFilterEditor} class to 
     * populate the list of values shown to users.
     * 
     * @param filtered Whether to apply all other filters when retrieving
     * the values from the data source.
     */
    getUniqueValues(filtered = true): any[] {
        let values = [],
            col = this.column,
            fmt = wijmo.Globalize.format;

        // explicit list provided
        if (this.uniqueValues) {
            this.uniqueValues.forEach(value => {
                values.push({ value: value, text: fmt(value, col.format) });
            });
            return values;
        }

        // list not provided, get from data
        let keys = {},
            view = col.collectionView,
            src: any[] = view ? view.sourceCollection : [];

        // apply all filters but this one (Excel-style filtering, TFS 133354)
        if (filtered && view && view.sourceCollection && view.filter) {

            try {

                // temporarily disable filtering for this column (TFS 467407, 467185)
                FlexGridFilter._skipColumn = this._col;

                // apply all other filters
                let nsrc = [];
                for (let i = 0; i < src.length; i++) {
                    if (view.filter(src[i])) {
                        nsrc.push(src[i]);
                    }
                }
                src = nsrc;

            } finally {

                // restore filtering for this column
                FlexGridFilter._skipColumn = null;

            }
        }

        // format and add unique values to the 'values' array
        for (let i = 0; i < src.length; i++) {
            let value = col._binding.getValue(src[i]),
                text =
                    this.dataMap ? this.dataMap.getDisplayValue(value) || '' : // TFS 440282, 458349
                    col.dataMap ? col.dataMap.getDisplayValue(value) || '' :
                    fmt(value, col.format);
            if (!keys[text]) {
                keys[text] = true;
                values.push({ value: value, text: text });
            }
        }

        // done 
        return values;
    }    

    // ** IQueryInterface

    /**
     * Returns true if this object supports a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IColumnFilter';
    }
}
    }
    


    module wijmo.grid.filter {
    



'use strict';

/**
 * The editor used to inspect and modify {@link ValueFilter} objects.
 *
 * This class is used by the {@link FlexGridFilter} class; you 
 * rarely use it directly.
 */
export class ValueFilterEditor extends wijmo.Control {
    private _filter: ValueFilter;
    private _toFilter: any;
    private _filterText: string;
    private _rxFilter: RegExp;
    private _view: wijmo.collections.CollectionView;
    private _initialItems: any[]; // TFS 454798
    private _canApply = false; // TFS 454775

    // child elements
    private _divFilter: HTMLElement;
    private _cmbFilter: wijmo.input.ComboBox;
    private _cbSelectAll: HTMLInputElement;
    private _spSelectAll: HTMLElement;
    private _divValues: HTMLElement;
    private _lbValues: wijmo.input.ListBox;

    /**
     * Gets or sets the template used to instantiate {@link ColumnFilterEditor} controls.
     */
    static controlTemplate = '<div>' +
        '<div wj-part="div-filter"></div>' +
        '<div class="wj-listbox-item">' +
            '<label>' +
                '<input wj-part="cb-select-all" type="checkbox"> ' +
                '<span wj-part="sp-select-all"></span>' +
            '</label>' +
        '</div>' +
        '<div wj-part="div-values"></div>' +
    '</div>';

    /**
     * Initializes a new instance of the {@link ValueFilterEditor} class.
     *
     * @param element The DOM element that hosts the control, or a selector 
     * for the host element (e.g. '#theCtrl').
     * @param filter The {@link ValueFilter} to edit.
     */
    constructor(element: any, filter: ValueFilter) {
        super(element);

        // save reference to filter
        this._filter = wijmo.asType(filter, ValueFilter, false);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-valuefilter-editor', tpl, {
            _divFilter: 'div-filter',
            _cbSelectAll: 'cb-select-all',
            _spSelectAll: 'sp-select-all',
            _divValues: 'div-values'
        });

        // include select all in tab order
        this._cbSelectAll.tabIndex = 0;

        // localization
        let ci = wijmo.culture.FlexGridFilter;
        wijmo.setText(this._spSelectAll, ci.selectAll);

        // create sorted/filtered collection view with the values
        let view = this._view = new wijmo.collections.CollectionView(null, {
            sortNulls: wijmo.collections.SortNulls.First, // show nulls above other values
            filter: this._filterValues.bind(this)
        });
        if (filter.sortValues) { // TFS 190560
            let sortBinding = filter.column.dataMap || filter.dataMap ? 'text' : 'value',
                asc = filter.column.dataType != wijmo.DataType.Boolean; // TFS 229224
            view.sortDescriptions.push(new wijmo.collections.SortDescription(sortBinding, asc));
        }
        view.collectionChanged.addHandler(this._updateSelectAllCheck, this);

        // create search combo and value list
        this._filterText = '';
        this._rxFilter = null;
        this._cmbFilter = new wijmo.input.ComboBox(this._divFilter, {
            isRequired: false,
            placeholder: ci.search
        });
        this._lbValues = new wijmo.input.ListBox(this._divValues, {
            displayMemberPath: 'text',
            checkedMemberPath: 'show',
            itemsSource: this._view,
            itemFormatter: (index, item) => item ? item : ci.null, // TFS 434114
            checkedItemsChanged: s => this._updateSelectAllCheck() // TFS 470645
        });

        // add aria labels
        wijmo.setAriaLabel(this._cmbFilter.inputElement, ci.ariaLabels.search);

        // add event listeners
        //this._cmbFilter.textChanged.addHandler(this._filterTextChanged, this); // this doesn't fire while composing
        this._cmbFilter.inputElement.addEventListener('input', this._filterTextChanged.bind(this)); // this does: TFS 414983
        this._cbSelectAll.addEventListener('click', this._cbSelectAllClicked.bind(this));

        // initialize editor (no timeout: TFS 433456)
        this.updateEditor();

        // save list of initially checked items (TFS 454798)
        this._initialItems = this._lbValues.checkedItems;
    }

    /**
     * Gets a reference to the {@link ValueFilter} being edited.
     */
    get filter(): ValueFilter {
        return this._filter;
    }
    /**
     * Gets or sets a value that indicates whether the current edits
     * can be applied to make the filter active.
     */
    get canApply(): boolean {
        return this._canApply;
    }
    set canApply(value: boolean) {
        if (value != this._canApply) {
            this._canApply = value;
            this.onCanApplyChanged();
        }
    }
    /**
     * Updates editor with current filter settings.
     */
    updateEditor() {
        let col = this._filter.column,
            values = this._filter.getUniqueValues(true);

        // honor isContentHtml property
        this._lbValues.isContentHtml = col.isContentHtml;

        // check the items that are currently selected
        let showValues = this._filter.showValues;
        if (!showValues || Object.keys(showValues).length == 0) {
            values.forEach(value => value.show = true);
        } else {
            for (let key in showValues) {
                for (let i = 0; i < values.length; i++) {
                    if (values[i].text == key) {
                        values[i].show = true;
                        break;
                    }
                }
            }
        }

        // update the filter
        let filterText = this._filter.filterText || '',
            caseSensitive = this._getCaseSensitive();
        this._cmbFilter.text = filterText;
        this._filterText = caseSensitive // TFS 466659
            ? filterText
            : filterText.toLowerCase(); 
        this._rxFilter = filterText // TFS 412735
            ? new RegExp(wijmo.escapeRegExp(filterText), caseSensitive ? '' : 'i')
            : null;

        // populate the list
        let view = this._view;
        view.pageSize = this._filter.maxValues; // WJM-19595
        view.sourceCollection = values;
    }
    /**
     * Clears the editor without applying changes to the filter.
     * 
     * @param checkAll Whether to check or uncheck all values 
     * (either way, the filter is not applied in this case).
     */
    clearEditor(checkAll = true) { // TFS 368709
        this._cmbFilter.text = '';
        this._filterText = '';
        this._rxFilter = null;

        let view = this._view;
        view.pageSize = 0; // TFS 288369
        view.items.forEach(value => { // TFS 213762
            value.show = checkAll
        });
        view.moveCurrentTo(-1); // avoid selecting one item if multiSel is false (TFS 420935)
        view.refresh();
        view.pageSize = this._filter.maxValues;
    }
    /**
     * Gets a value that determines whether the editor has been cleared.
     */
    get isEditorClear(): boolean {
        return !this._filterText && !this._cbSelectAll.indeterminate;
    }
    /**
     * Updates filter to reflect the current editor values.
     */
    updateFilter() {

        // build list of values to show
        // (clear filter if all values are selected)
        let showValues = null,
            items = this._getItems();
        if (this._filterText || this._cbSelectAll.indeterminate) {
            showValues = {};
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.show) {
                    showValues[item.text] = true;
                }
            }
        }

        // update filter
        let filter = this._filter;
        filter.showValues = showValues;
        filter.filterText = this._filterText; // preserve search text

        // REVIEW: keep original behavior TFS 406309
        //filter.filterText = ''; // clear search text (Excel behavior, TFS 128910, 309205) 
    }

    // ** events

    /**
     * Occurs when the value of the {@linj canApply} property changes.
     */
    readonly canApplyChanged = new wijmo.Event<ValueFilterEditor, wijmo.EventArgs>();
    /**
     * Raises the {@link canApplyChanged} event.
     */
    onCanApplyChanged(e?: wijmo.EventArgs) {
        this.canApplyChanged.raise(this, e);
    }

    // ** implementation

    // gets the value of the owner grid's caseSensitiveSearch property
    private _getCaseSensitive() {
        let col = this._filter.column,
            g = col ? col.grid : null;
        return g && g.caseSensitiveSearch;
    }

    // gets an array with the filtered items or with all the items
    private _getItems(): any[] {
        return this._filter.exclusiveValueSearch
            ? this._view.items
            : this._view.sourceCollection;
    }

    // filter items on the list
    private _filterTextChanged() {
        if (this._toFilter) {
            clearTimeout(this._toFilter);
        }
        this._toFilter = setTimeout(() => {

            // get the filter text
            let filterText = this._cmbFilter.text,
                caseSensitive = this._getCaseSensitive();
            if (!caseSensitive) {
                filterText = filterText.toLowerCase();
            }
            
            // if it changed, apply the new filter
            if (filterText != this._filterText) {
                this._filterText = filterText;
                this._rxFilter = filterText // TFS 412735
                    ? new RegExp(wijmo.escapeRegExp(filterText), caseSensitive ? '' : 'i')
                    : null;
                this._view.refresh();

                // if there's no filter, restore initial selection (TFS 454798)
                if (!filterText) {
                    let items = this._initialItems;
                    if (items.length && this._view.sourceCollection.indexOf(items[0]) > -1) { // TFS 470653
                        this._lbValues.checkedItems = this._initialItems;
                        this._updateSelectAllCheck();
                        return;
                    }
                }

                // there is a filter, select all items after filter changes (Excel behavior, TFS 128910, 309205)
                if (this._filter.exclusiveValueSearch) {
                    this._cbSelectAll.checked = true;
                    this._cbSelectAllClicked();
                } else {
                    this._updateSelectAllCheck();
                }
            }
        }, wijmo.Control._SEARCH_DELAY);
    }

    // filter values for display in the ListBox
    private _filterValues(value) {
        let rx = this._rxFilter;
        return rx != null && value != null
            ? rx.test(value.text)
            : true;
    }

    // handle clicks on 'Select All' checkbox
    private _cbSelectAllClicked() {
        let checked = this._cbSelectAll.checked,
            scrollTop = this._divValues.scrollTop,
            items = this._getItems();
        for (let i = 0; i < items.length; i++) {
            items[i].show = checked;
        }
        this._view.refresh();
        this._divValues.scrollTop = scrollTop; // TFS 335911
    }

    // update state of 'Select All' checkbox when values are checked/unchecked
    private _updateSelectAllCheck() {

        // count checked items
        let items = this._getItems(),
            checked = 0,
            unchecked = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].show) {
                checked++;
            } else {
                unchecked++;
            }
            if (checked && unchecked) {
                break;
            }
        }

        // update checkbox
        wijmo.setChecked(this._cbSelectAll, (checked && unchecked) ? null : checked > 0);

        // update canApply property
        this.canApply = checked > 0;
    }
}
    }
    


    module wijmo.grid.filter {
    






'use strict';

/**
 * Defines a filter for a column on a {@link FlexGrid} control.
 *
 * The {@link ColumnFilter} contains a {@link ConditionFilter} and a
 * {@link ValueFilter}; only one of them may be active at a time.
 *
 * This class is used by the {@link FlexGridFilter} class; you 
 * rarely use it directly.
 */
export class ColumnFilter implements IColumnFilter {
    private _owner: FlexGridFilter;
    private _col: wijmo.grid.Column;
    private _valueFilter: ValueFilter;
    private _conditionFilter: ConditionFilter;
    private _filterType: FilterType;

    /**
     * Initializes a new instance of the {@link ColumnFilter} class.
     *
     * @param owner The {@link FlexGridFilter} that owns this column filter.
     * @param column The {@link Column} to filter.
     */
    constructor(owner: FlexGridFilter, column: wijmo.grid.Column) {
        this._owner = owner;
        this._col = column;
        this._valueFilter = new ValueFilter(column);
        this._valueFilter.exclusiveValueSearch = owner.exclusiveValueSearch;
        this._conditionFilter = new ConditionFilter(column);
    }

    /**
     * Gets or sets the types of filtering provided by this filter.
     *
     * Setting this property to null causes the filter to use the value
     * defined by the owner filter's {@link FlexGridFilter.defaultFilterType}
     * property.
     */
    get filterType(): FilterType {
        return this._filterType != null ? this._filterType : this._owner.defaultFilterType;
    }
    set filterType(value: FilterType) {
        value = wijmo.asEnum(value, FilterType, true);
        if (value != this._filterType) {
            let wasActive = this.isActive;
            this.clear();
            this._filterType = value;
            if (wasActive) {
                this._owner.apply();
            } else if (this._col.grid) {
                this._col.grid.invalidate();
            }
        }
    }
    /**
     * Gets or sets the {@link DataMap} used to convert raw values into display
     * values shown when editing this filter.
     *
     * The example below assigns a {@link DataMap} to Boolean column filters
     * so the filter editor displays 'Yes' and 'No' instead of 'true' and 'false':
     *
     * ```typescript
     * import { FlexGridFilter } from '@grapecity/wijmo.grid.filter';
     * var filter = new FlexGridFilter(grid),
     *     map = new wijmo.grid.DataMap([
     *             { value: true, caption: 'Yes' },
     *             { value: false, caption: 'No' },
     *         ], 'value', 'caption');
     * for (var c = 0; c &lt; grid.columns.length; c++) {
     *     if (grid.columns[c].dataType == wijmo.DataType.Boolean) {
     *         filter.getColumnFilter(c).dataMap = map;
     *     }
     * }
     * ```
     */
    get dataMap(): wijmo.grid.DataMap {
        return this.conditionFilter.dataMap || this.valueFilter.dataMap;
    }
    set dataMap(value: wijmo.grid.DataMap) {
        this.conditionFilter.dataMap = value;
        this.valueFilter.dataMap = value;
    }
    /**
     * Gets the {@link ValueFilter} in this {@link ColumnFilter}.
     */
    get valueFilter(): ValueFilter {
        return this._valueFilter;
    }
    /**
     * Gets the {@link ConditionFilter} in this {@link ColumnFilter}.
     */
    get conditionFilter(): ConditionFilter {
        return this._conditionFilter;
    }

    // ** IColumnFilter

    /**
     * Gets the {@link Column} being filtered.
     */
    get column(): wijmo.grid.Column {
        return this._col;
    }
    /**
     * Gets a value that indicates whether the filter is active.
     */
    get isActive(): boolean {
        return this._conditionFilter.isActive || this._valueFilter.isActive;
    }
    /**
     * Gets a value that indicates whether a value passes the filter.
     *
     * @param value The value to test.
     */
    apply(value: any): boolean {
        return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
    }
    /**
     * Clears the filter.
     */
    clear() {
        this._valueFilter.clear();
        this._conditionFilter.clear();
    }

    // ** IQueryInterface

    /**
     * Returns true if this object supports a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IColumnFilter';
    }
}
    }
    


    module wijmo.grid.filter {
    






'use strict';

// globalization info
wijmo._addCultureInfo('FlexGridFilter', {

    // aria labels
    ariaLabels: {
        edit: 'Edit Filter for Column',
        dialog: 'Filter Editor for Column',
        asc: 'Sort Column in Ascending Order',
        dsc: 'Sort Column in Descending Order',
        search: 'Search Item List',
        op1: 'First Condition Operator',
        val1: 'First Condition Value',
        and: 'Require both Conditions',
        or: 'Require either Condition',
        op2: 'Second Condition Operator',
        val2: 'Second Condition Value'
    },

    // filter
    ascending: '\u2191 Ascending',
    descending: '\u2193 Descending',
    apply: 'Apply',
    cancel: 'Cancel',
    clear: 'Clear',
    conditions: 'Filter by Condition',
    values: 'Filter by Value',

    // value filter
    search: 'Search',
    selectAll: 'Select All',
    null: '(nothing)',

    // condition filter
    header: 'Show items where the value',
    and: 'And',
    or: 'Or',
    stringOperators: [
        { name: '(not set)', op: null },
        { name: 'Equals', op: Operator.EQ },
        { name: 'Does not equal', op: Operator.NE },
        { name: 'Begins with', op: Operator.BW },
        { name: 'Ends with', op: Operator.EW },
        { name: 'Contains', op: Operator.CT },
        { name: 'Does not contain', op: Operator.NC }
    ],
    numberOperators: [
        { name: '(not set)', op: null },
        { name: 'Equals', op: Operator.EQ },
        { name: 'Does not equal', op: Operator.NE },
        { name: 'Is Greater than', op: Operator.GT },
        { name: 'Is Greater than or equal to', op: Operator.GE },
        { name: 'Is Less than', op: Operator.LT },
        { name: 'Is Less than or equal to', op: Operator.LE }
    ],
    dateOperators: [
        { name: '(not set)', op: null },
        { name: 'Equals', op: Operator.EQ },
        { name: 'Is Before', op: Operator.LT },
        { name: 'Is After', op: Operator.GT }
    ],
    booleanOperators: [
        { name: '(not set)', op: null },
        { name: 'Equals', op: Operator.EQ },
        { name: 'Does not equal', op: Operator.NE }
    ]
});

/**
 * The editor used to inspect and modify column filters.
 *
 * This class is used by the {@link FlexGridFilter} class; you 
 * rarely use it directly.
 */
export class ColumnFilterEditor extends wijmo.Control {
    private _filter: ColumnFilter;
    private _edtVal: ValueFilterEditor;
    private _edtCnd: ConditionFilterEditor;
    private _wasTouching: boolean;

    private _divSort: HTMLElement;
    private _btnAsc: HTMLInputElement;
    private _btnDsc: HTMLInputElement;
    private _divType: HTMLInputElement;
    private _aCnd: HTMLLinkElement;
    private _aVal: HTMLLinkElement;
    private _divEdtVal: HTMLElement;
    private _divEdtCnd: HTMLElement;
    private _btnApply: HTMLButtonElement;
    private _btnCancel: HTMLButtonElement;
    private _btnClear: HTMLButtonElement;

    /**
     * Gets or sets the template used to instantiate {@link ColumnFilterEditor} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div wj-part="div-sort" class="wj-sort-buttons">' +
                '<button wj-part="btn-asc" class="wj-btn"></button>&nbsp;&nbsp;&nbsp;' +
                '<button wj-part="btn-dsc" class="wj-btn"></button>' +
            '</div>' +
            '<div wj-part="div-type" class="wj-filtertype">' +
                '<a wj-part="a-cnd" href="" draggable="false"></a>' +
                '&nbsp;|&nbsp;' +
                '<a wj-part="a-val" href="" draggable="false"></a>' +
            '</div>' +
            '<div wj-part="div-edt-val" tabindex="-1"></div>' +
            '<div wj-part="div-edt-cnd" tabindex="-1"></div>' +
            '<div style="text-align:right;margin-top:10px">' +
                '<button wj-part="btn-apply" class="wj-btn"></button>&nbsp;&nbsp;' +
                '<button wj-part="btn-cancel" class="wj-btn"></button>&nbsp;&nbsp;' +
                '<button wj-part="btn-clear" class="wj-btn"></button>' +
            '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link ColumnFilterEditor} class.
     *
     * @param element The DOM element that hosts the control, or a selector 
     * for the host element (e.g. '#theCtrl').
     * @param filter The {@link ColumnFilter} to edit.
     * @param sortButtons Whether to show sort buttons in the editor.
     */
    constructor(element: any, filter: ColumnFilter, sortButtons = true) {
        super(element, null, true);

        // save reference to filter being edited
        this._filter = wijmo.asType(filter, ColumnFilter);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-columnfiltereditor', tpl, {
            _divSort: 'div-sort',
            _btnAsc: 'btn-asc',
            _btnDsc: 'btn-dsc',
            _divType: 'div-type',
            _aVal: 'a-val',
            _aCnd: 'a-cnd',
            _divEdtVal: 'div-edt-val',
            _divEdtCnd: 'div-edt-cnd',
            _btnApply: 'btn-apply',
            _btnCancel: 'btn-cancel',
            _btnClear: 'btn-clear'
        });

        // aria labels
        let ci = wijmo.culture.FlexGridFilter,
            labels = ci.ariaLabels,
            host = this.hostElement,
            col = this.filter.column,
            view = col.grid.collectionView;
        wijmo.setAttribute(host, 'role', 'dialog');
        wijmo.setAriaLabel(host, labels.dialog + ' ' + col.header);
        wijmo.setAriaLabel(this._btnAsc, labels.asc);
        wijmo.setAriaLabel(this._btnDsc, labels.dsc);

        // localization
        wijmo.setText(this._btnAsc, ci.ascending);
        wijmo.setText(this._btnDsc, ci.descending);
        wijmo.setText(this._aVal, ci.values);
        wijmo.setText(this._aCnd, ci.conditions);
        wijmo.setText(this._btnApply, ci.apply);
        wijmo.setText(this._btnCancel, ci.cancel);
        wijmo.setText(this._btnClear, ci.clear);

        // show the filter that is active
        let ft = (this.filter.conditionFilter.isActive || (filter.filterType & FilterType.Value) == 0)
            ? FilterType.Condition
            : FilterType.Value;
        this._showFilter(ft);

        // update sort button state
        // hide sort buttons if the collection view is not sortable
        // or if the user doesn't want them
        if (!sortButtons || !view || !view.canSort) {
            this._divSort.style.display = 'none';
        }
        this._updateSortButtonState();

        // handle button clicks
        let bnd = this._btnClicked.bind(this),
            click = 'click';
        this._btnApply.addEventListener(click, bnd);
        this._btnCancel.addEventListener(click, bnd);
        this._btnClear.addEventListener(click, bnd);
        this._btnAsc.addEventListener(click, bnd);
        this._btnDsc.addEventListener(click, bnd);
        this._aVal.addEventListener(click, bnd);
        this._aCnd.addEventListener(click, bnd);

        // commit/dismiss on Enter/Esc, press buttons on Enter/Space
        this.addEventListener(host, 'keydown', (e) => {
            if (!e.defaultPrevented) {
                let isButton = (e.target as HTMLElement).tagName.match(/^(a|button)$/i);
                switch (e.keyCode) {
                    case wijmo.Key.Space:
                        if (isButton) {
                            this._btnClicked(e);
                            e.preventDefault();
                        }
                        break;
                    case wijmo.Key.Enter:
                        if (isButton) {
                            this._btnClicked(e); // TFS 123049
                        } else {
                            this.updateFilter();
                            this.onFilterChanged();
                            this.onButtonClicked();
                        }
                        e.preventDefault();
                        break;
                    case wijmo.Key.Escape:
                        this.onButtonClicked();
                        e.preventDefault();
                        break;
                    case wijmo.Key.Tab:
                        wijmo.moveFocus(this.hostElement, e.shiftKey ? -1 : +1);
                        e.preventDefault();
                        break;
                }
            }
        });

        // close editor when the browser is resized
        // (or it will be in the wrong position... TFS 374361)
        this.addEventListener(window, 'resize', () => {
            if (!this.isTouching && !this._wasTouching) { // TFS 281356
                this.onButtonClicked();
            }
        });
    }

    /**
     * Gets a reference to the {@link ColumnFilter} being edited.
     */
    get filter(): ColumnFilter {
        return this._filter;
    }
    /**
     * Updates editor with current filter settings.
     */
    updateEditor() {
        if (this._edtVal) {
            this._edtVal.updateEditor();
        }
        if (this._edtCnd) {
            this._edtCnd.updateEditor();
        }
    }
    /**
     * Updates filter with current editor settings.
     */
    updateFilter() {
        switch (this._getFilterType()) {
            case FilterType.Value:
                this._edtVal.updateFilter();
                this.filter.conditionFilter.clear();
                break;
            case FilterType.Condition:
                this._edtCnd.updateFilter();
                this.filter.valueFilter.clear();
                break;
        }
    }
    /**
     * Occurs after the filter is modified.
     */
    readonly filterChanged = new wijmo.Event<ColumnFilterEditor, wijmo.EventArgs>();
    /**
     * Raises the {@link filterChanged} event.
     */
    onFilterChanged(e?: wijmo.EventArgs) {
        this.filterChanged.raise(this, e);
    }
    /**
     * Occurs when one of the editor buttons is clicked.
     */
    readonly buttonClicked = new wijmo.Event<ColumnFilterEditor, wijmo.EventArgs>();
    /**
     * Raises the {@link buttonClicked} event.
     */
    onButtonClicked(e?: wijmo.EventArgs) {
        this.buttonClicked.raise(this, e);
    }

    // ** implementation

    // shows the value or condition filter editor
    _showFilter(filterType: FilterType) {

        // save isTouching value to keep the editor up
        this._wasTouching = this.isTouching;

        // create editor if we have to
        if (filterType == FilterType.Value && this._edtVal == null) {
            this._edtVal = new ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
            this._edtVal.canApplyChanged.addHandler(s => {
                wijmo.enable(this._btnApply, this._edtVal.canApply);
            })
        }
        if (filterType == FilterType.Condition && this._edtCnd == null) {
            this._edtCnd = new ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
            this._edtCnd.canApplyChanged.addHandler(s => {
                wijmo.enable(this._btnApply, this._edtCnd.canApply);
            })
        }

        // show selected editor
        if ((filterType & this.filter.filterType) != 0) {
            if (filterType == FilterType.Value) {
                this._divEdtVal.style.display = '';
                this._divEdtCnd.style.display = 'none';
                this._enableLink(this._aVal, false);
                this._enableLink(this._aCnd, true);
                this._edtVal.focus();
                wijmo.enable(this._btnApply, this._edtVal.canApply);
            } else {
                this._divEdtVal.style.display = 'none';
                this._divEdtCnd.style.display = '';
                this._enableLink(this._aVal, true);
                this._enableLink(this._aCnd, false);
                this._edtCnd.focus();
                wijmo.enable(this._btnApply, this._edtCnd.canApply);
            }
        }

        // hide switch button if only one filter type is supported
        let dtStyle = this._divType.style;
        switch (this.filter.filterType) {
            case FilterType.None:
            case FilterType.Condition:
            case FilterType.Value:
                dtStyle.display = 'none';
                break;
            default:
                dtStyle.display = '';
                break;
        }
    }

    // enable/disable filter switch links
    private _enableLink(a: HTMLLinkElement, enable: boolean) {
        wijmo.toggleClass(a, 'wj-state-disabled', !enable);
        wijmo.setAttribute(a, 'href', enable ? '' : null);
        wijmo.setAttribute(a, 'disabled', enable ? null : 'disabled');
    }

    // update the sort button state (TFS 454776)
    private _updateSortButtonState() {
        let col = this.filter.column,
            sort = col ? col.currentSort : '',
            cls = 'wj-state-active';
        wijmo.toggleClass(this._btnAsc, cls, sort == '+');
        wijmo.toggleClass(this._btnDsc, cls, sort == '-');
    }

    // gets the type of filter currently being edited
    private _getFilterType(): FilterType {
        let ft = FilterType;
        return this._divEdtVal.style.display != 'none' ? ft.Value : ft.Condition;
    }

    // handle buttons
    private _btnClicked(e) {
        let target = e.target;

        e.preventDefault();
        e.stopPropagation();

        // ignore disabled elements
        if (wijmo.hasClass(target, 'wj-state-disabled')) {
            return;
        }

        // switch filters
        if (target == this._aVal) {
            this._showFilter(FilterType.Value);
            wijmo.moveFocus(this._edtVal.hostElement, 0);
            return;
        }
        if (target == this._aCnd) {
            this._showFilter(FilterType.Condition);
            wijmo.moveFocus(this._edtCnd.hostElement, 0);
            return;
        }

        // apply sort
        if (target == this._btnAsc || target == this._btnDsc) {
            let col = this.filter.column,
                binding = col.sortMemberPath || col.binding,
                view = col.grid.collectionView,
                sds = view.sortDescriptions;
            sds.deferUpdate(() => {
                sds.clear();
                sds.push(new wijmo.collections.SortDescription(binding, e.target == this._btnAsc));
            });
            this._updateSortButtonState();
        }

        // apply/clear filter
        if (target == this._btnApply) {
            this.updateFilter();
            this.onFilterChanged();
        } else if (target == this._btnClear) {
            if (this.filter.isActive) {
                this.filter.clear();
                this.onFilterChanged();
            }
        } else {
            this.updateEditor(); // show current filter state
        }

        // raise event so caller can close the editor and apply the new filter
        this.onButtonClicked();
    }
}
    }
    


    module wijmo.grid.filter {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.filter', wijmo.grid.filter);











    }
    