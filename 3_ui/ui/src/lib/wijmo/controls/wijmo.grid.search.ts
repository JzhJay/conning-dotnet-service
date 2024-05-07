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


    module wijmo.grid.search {
    




'use strict';

/**
 * The {@link FlexGridSearch} control allows users to quickly search the
 * items displayed in a {@link FlexGrid}.
 *
 * The control filters the items and shows only the ones that contain
 * the text provided by the user. It also highlights the matches in
 * the target {@link FlexGrid} (except for templated cells, which do
 * not support highlighting).
 * 
 * The {@link FlexGridSearch} control may be used in conjunction with
 * the {@link FlexGridFilter} control, which provides column-specific
 * filtering.
 * 
 * The example below shows how you can create a {@link FlexGridSearch} 
 * control and connect it to a {@link FlexGrid}:
 * ```typescript
 * import { FlexGrid } from '@grapecity/wijmo.grid';
 * import { FlexGridSearch } from '@grapecity/wijmo.grid.search';
 * 
 * // create FlexGrid
 * let grid = new FlexGrid('#gridElement', {
 *     itemsSource: getData();
 * });
 * 
 * // create FlexGridSearch and connect it to the grid
 * let search = new FlexGridSearch('#searchElement', {
 *     grid: grid
 * });
 * ```
 */
export class FlexGridSearch extends wijmo.Control {

    // child elements
    _tbx: HTMLInputElement;
    _btn: HTMLElement;

    // property storage
    private _g: wijmo.grid.FlexGrid;
    private _cv: wijmo.collections.CollectionView;
    private _delay = wijmo.Control._SEARCH_DELAY;
    private _cssMatch = 'wj-state-match';
    private _searchAllColumns = false;

    // private stuff
    private _rxSrch: RegExp = null;
    private _rxHilite: RegExp = null;
    private _toSearch: any;
    private _filterBnd: wijmo.collections.IPredicate;

    /**
     * Gets or sets the template used to instantiate {@link FlexGridSearch} controls.
     */
    static controlTemplate = '<div class="wj-template">' +
        '<div class="wj-input">' +
          '<div class="wj-input-group wj-input-btn-visible">' +
            '<input wj-part="input" type="text" class="wj-form-control"/>' +
            '<span wj-part="btn" class="wj-input-group-btn">' +
              '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '&times' +
              '</button>' +
            '</span>' +
          '</div>' +
        '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link FlexGridSearch} class.
     *
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-flexgridsearch', tpl, {
            _tbx: 'input',
            _btn: 'btn'
        }, 'input');

        // bind our filter function
        this._filterBnd = this._filter.bind(this);

        // apply search when the search text changes
        this._tbx.addEventListener('input', () => {
            if (this._toSearch) {
                clearTimeout(this._toSearch);
            }
            this._toSearch = setTimeout(() => {
                this._toSearch = null;
                this._applySearch();
            }, this._delay);
        });

        // clear search on button click
        this._btn.addEventListener('click', () => {
            if (this._toSearch) {
                clearTimeout(this._toSearch);
            }
            this._toSearch = null;
            this._tbx.value = '';
            this._applySearch();
            if (this.containsFocus()) {
                this._tbx.focus();
            }
        });

        // initialize control options
        this.initialize(options);
    }

    //--------------------------------------------------------------------------
    //#region ** object model

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
                g.formatItem.removeHandler(this._formatItem);
                g.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
            }

            // update grid property
            g = this._g = value;
            this._itemsSourceChanged();

            // attach event handlers
            if (g) {
                g.formatItem.addHandler(this._formatItem, this);
                g.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
            }
        }
    }
    /**
     * Gets the HTML input element hosted by the control.
     *
     * Use this property in situations where you want to customize the
     * attributes of the input element.
     */
    get inputElement(): HTMLInputElement {
        return this._tbx;
    }
    /**
     * Gets or sets the text to search for.
     * 
     * The text may include multiple terms, separated by spaces.
     */
    get text(): string {
        return this._tbx.value;
    }
    set text(value: string) {
        if (value != this.text) {
            this._tbx.value = wijmo.asString(value);
            this._applySearch(); // TFS 403864
        }
    }
    /**
     * Gets or sets the delay, in milliseconds, between when a keystroke occurs
     * and when the search is performed.
     * 
     * The default value for this property is **500** milliseconds.
     */
    get delay(): number {
        return this._delay;
    }
    set delay(value: number) {
        this._delay = wijmo.asNumber(value, false, true);
    }
    /**
     * Gets or sets the string shown as a hint when the control is empty.
     * 
     * The default value for this property is an empty string **""**.
     */
    get placeholder(): string {
        return this._tbx.placeholder;
    }
    set placeholder(value: string) {
        this._tbx.placeholder = value;
    }
    /**
     * Gets or sets the name of the CSS class used to highlight any parts 
     * of the content that match the search terms.
     * 
     * The default value for this property is **"wj-state-match"**.
     * 
     * Highlighing is not supported in template cells.
     */
    get cssMatch(): string {
        return this._cssMatch;
    }
    set cssMatch(value: string) {
        this._cssMatch = wijmo.asString(value);
    }
    /**
     * Gets or sets a value that determines whether invisible columns should
     * be included in the search.
     * 
     * The default value for this property is **false**.
     */
    get searchAllColumns(): boolean {
        return this._searchAllColumns;
    }
    set searchAllColumns(value: boolean) {
        this._searchAllColumns = wijmo.asBoolean(value);
    }

    //#endregion ** object model

    //--------------------------------------------------------------------------
    //#region ** implementation

    // highlight matches on the grid
    private _formatItem(s: wijmo.grid.FlexGrid, e: wijmo.grid.FormatItemEventArgs) {
        if (this._rxHilite && this._cssMatch) {
            if (e.panel == s.cells) {
                if (!e.getColumn()._getFlag(wijmo.grid.RowColFlags.HasTemplate)) { // no templates
                    if (!e.cell.querySelector('input')) { // no editors (TFS 400501)
                        let html = e.cell.innerHTML;
                        if (this._rxHilite.test(html)) { // replace only if necessary (TFS 415140)
                            e.cell.innerHTML = html.replace(
                                this._rxHilite,
                                '<span class="' + this._cssMatch + '">$1</span>'
                            );
                        }
                    }
                }
            }
        }
    }

    // update collection view filters
    private _itemsSourceChanged() {

        // remove our filter from old view
        if (this._cv) {
            this._cv.filters.remove(this._filterBnd);
        }

        // update view
        let cv = this._g ? this._g.collectionView : null;
        this._cv = cv instanceof wijmo.collections.CollectionView ? cv : null;

        // add our filter to new view
        if (this._cv) {
            this._cv.filters.push(this._filterBnd);
        }
    }

    // apply current search string
    private _applySearch(): void {
        let g = this._g;

        // update highlight and search regexes
        this._rxSrch = this._rxHilite = null;

        // get space-separated search terms (e.g. "bob white japan")
        let text = wijmo.escapeRegExp(this.text),
            terms = text.split(' ').filter(x => x);
        if (terms.length) {

            // honor grid's caseSensitiveSearch property
            let flags = g && g.caseSensitiveSearch ? 'g' : 'gi';
            
            // search for items that contain all terms in any order
            this._rxSrch = new RegExp('(?=.*' + terms.join(')(?=.*') + ')', flags);

            // escape HTML when highlighting (TFS 470197, 470198, 472148)
            terms = terms.map(term => _escapeHtml(term));

            // highlight matches (outside of HTML tags: TFS 402104)
            this._rxHilite = new RegExp('(' + terms.join('|') + ')(?![^<]*>)', flags);
        }

        // update filter
        let cv = g ? g.collectionView : null;
        if (cv instanceof wijmo.collections.CollectionView) {
            cv.refresh();
        }
    }

    // filter function attached to grid's CollectionView
    private _filter(item: any): boolean {
        if (this._rxSrch && this._g) {
            let itemText = this._getItemText(item);
            return this._rxSrch.test(itemText);
        }
        return true;
    }

    // gets the text representation of an item
    private _getItemText(item: any) {
        let vals = [],
            cols = this._g._getBindingColumns();
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i],
                binding = col._binding;
            if (binding) {
                if (col.visible || this.searchAllColumns) { // TFS 469955
                    let val = binding.getValue(item);
                    if (col.dataMap) {
                        val = col.dataMap.getDisplayValue(val);
                    } else {
                        val = wijmo.Globalize.format(val, col.format);
                    }
                    if (col.isContentHtml) {
                        val = wijmo.toPlainText(val);
                    }
                    if (val) {
                        vals.push(val);
                    }
                }
            }
        }
        return vals.join(' ');
    }
    //#endregion ** implementation
}

const _ENTITYMAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};

function _escapeHtml(text: string): string {
    if (text && wijmo.isString(text)) {
        text = text.replace(/[&<>]/g, (s) => {
            return _ENTITYMAP[s];
        });
    }
    return text != null ? text.toString() : ''; // always return a string
}

    }
    


    module wijmo.grid.search {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.grid.search', wijmo.grid.search);


    }
    