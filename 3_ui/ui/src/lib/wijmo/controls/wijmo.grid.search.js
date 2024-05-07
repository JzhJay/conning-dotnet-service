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
        var search;
        (function (search) {
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
            var FlexGridSearch = /** @class */ (function (_super) {
                __extends(FlexGridSearch, _super);
                /**
                 * Initializes a new instance of the {@link FlexGridSearch} class.
                 *
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param options The JavaScript object containing initialization data for the control.
                 */
                function FlexGridSearch(element, options) {
                    var _this = _super.call(this, element) || this;
                    _this._delay = wijmo.Control._SEARCH_DELAY;
                    _this._cssMatch = 'wj-state-match';
                    _this._searchAllColumns = false;
                    // private stuff
                    _this._rxSrch = null;
                    _this._rxHilite = null;
                    // instantiate and apply template
                    var tpl = _this.getTemplate();
                    _this.applyTemplate('wj-control wj-content wj-flexgridsearch', tpl, {
                        _tbx: 'input',
                        _btn: 'btn'
                    }, 'input');
                    // bind our filter function
                    _this._filterBnd = _this._filter.bind(_this);
                    // apply search when the search text changes
                    _this._tbx.addEventListener('input', function () {
                        if (_this._toSearch) {
                            clearTimeout(_this._toSearch);
                        }
                        _this._toSearch = setTimeout(function () {
                            _this._toSearch = null;
                            _this._applySearch();
                        }, _this._delay);
                    });
                    // clear search on button click
                    _this._btn.addEventListener('click', function () {
                        if (_this._toSearch) {
                            clearTimeout(_this._toSearch);
                        }
                        _this._toSearch = null;
                        _this._tbx.value = '';
                        _this._applySearch();
                        if (_this.containsFocus()) {
                            _this._tbx.focus();
                        }
                    });
                    // initialize control options
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(FlexGridSearch.prototype, "grid", {
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
                    get: function () {
                        return this._g;
                    },
                    set: function (value) {
                        value = wijmo.asType(value, wijmo.grid.FlexGrid, true);
                        if (value != this._g) {
                            // unhook event handlers
                            var g = this._g;
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
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "inputElement", {
                    /**
                     * Gets the HTML input element hosted by the control.
                     *
                     * Use this property in situations where you want to customize the
                     * attributes of the input element.
                     */
                    get: function () {
                        return this._tbx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "text", {
                    /**
                     * Gets or sets the text to search for.
                     *
                     * The text may include multiple terms, separated by spaces.
                     */
                    get: function () {
                        return this._tbx.value;
                    },
                    set: function (value) {
                        if (value != this.text) {
                            this._tbx.value = wijmo.asString(value);
                            this._applySearch(); // TFS 403864
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "delay", {
                    /**
                     * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                     * and when the search is performed.
                     *
                     * The default value for this property is **500** milliseconds.
                     */
                    get: function () {
                        return this._delay;
                    },
                    set: function (value) {
                        this._delay = wijmo.asNumber(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "placeholder", {
                    /**
                     * Gets or sets the string shown as a hint when the control is empty.
                     *
                     * The default value for this property is an empty string **""**.
                     */
                    get: function () {
                        return this._tbx.placeholder;
                    },
                    set: function (value) {
                        this._tbx.placeholder = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "cssMatch", {
                    /**
                     * Gets or sets the name of the CSS class used to highlight any parts
                     * of the content that match the search terms.
                     *
                     * The default value for this property is **"wj-state-match"**.
                     *
                     * Highlighing is not supported in template cells.
                     */
                    get: function () {
                        return this._cssMatch;
                    },
                    set: function (value) {
                        this._cssMatch = wijmo.asString(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridSearch.prototype, "searchAllColumns", {
                    /**
                     * Gets or sets a value that determines whether invisible columns should
                     * be included in the search.
                     *
                     * The default value for this property is **false**.
                     */
                    get: function () {
                        return this._searchAllColumns;
                    },
                    set: function (value) {
                        this._searchAllColumns = wijmo.asBoolean(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                //#endregion ** object model
                //--------------------------------------------------------------------------
                //#region ** implementation
                // highlight matches on the grid
                FlexGridSearch.prototype._formatItem = function (s, e) {
                    if (this._rxHilite && this._cssMatch) {
                        if (e.panel == s.cells) {
                            if (!e.getColumn()._getFlag(wijmo.grid.RowColFlags.HasTemplate)) { // no templates
                                if (!e.cell.querySelector('input')) { // no editors (TFS 400501)
                                    var html = e.cell.innerHTML;
                                    if (this._rxHilite.test(html)) { // replace only if necessary (TFS 415140)
                                        e.cell.innerHTML = html.replace(this._rxHilite, '<span class="' + this._cssMatch + '">$1</span>');
                                    }
                                }
                            }
                        }
                    }
                };
                // update collection view filters
                FlexGridSearch.prototype._itemsSourceChanged = function () {
                    // remove our filter from old view
                    if (this._cv) {
                        this._cv.filters.remove(this._filterBnd);
                    }
                    // update view
                    var cv = this._g ? this._g.collectionView : null;
                    this._cv = cv instanceof wijmo.collections.CollectionView ? cv : null;
                    // add our filter to new view
                    if (this._cv) {
                        this._cv.filters.push(this._filterBnd);
                    }
                };
                // apply current search string
                FlexGridSearch.prototype._applySearch = function () {
                    var g = this._g;
                    // update highlight and search regexes
                    this._rxSrch = this._rxHilite = null;
                    // get space-separated search terms (e.g. "bob white japan")
                    var text = wijmo.escapeRegExp(this.text), terms = text.split(' ').filter(function (x) { return x; });
                    if (terms.length) {
                        // honor grid's caseSensitiveSearch property
                        var flags = g && g.caseSensitiveSearch ? 'g' : 'gi';
                        // search for items that contain all terms in any order
                        this._rxSrch = new RegExp('(?=.*' + terms.join(')(?=.*') + ')', flags);
                        // escape HTML when highlighting (TFS 470197, 470198, 472148)
                        terms = terms.map(function (term) { return _escapeHtml(term); });
                        // highlight matches (outside of HTML tags: TFS 402104)
                        this._rxHilite = new RegExp('(' + terms.join('|') + ')(?![^<]*>)', flags);
                    }
                    // update filter
                    var cv = g ? g.collectionView : null;
                    if (cv instanceof wijmo.collections.CollectionView) {
                        cv.refresh();
                    }
                };
                // filter function attached to grid's CollectionView
                FlexGridSearch.prototype._filter = function (item) {
                    if (this._rxSrch && this._g) {
                        var itemText = this._getItemText(item);
                        return this._rxSrch.test(itemText);
                    }
                    return true;
                };
                // gets the text representation of an item
                FlexGridSearch.prototype._getItemText = function (item) {
                    var vals = [], cols = this._g._getBindingColumns();
                    for (var i = 0; i < cols.length; i++) {
                        var col = cols[i], binding = col._binding;
                        if (binding) {
                            if (col.visible || this.searchAllColumns) { // TFS 469955
                                var val = binding.getValue(item);
                                if (col.dataMap) {
                                    val = col.dataMap.getDisplayValue(val);
                                }
                                else {
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
                };
                /**
                 * Gets or sets the template used to instantiate {@link FlexGridSearch} controls.
                 */
                FlexGridSearch.controlTemplate = '<div class="wj-template">' +
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
                return FlexGridSearch;
            }(wijmo.Control));
            search.FlexGridSearch = FlexGridSearch;
            var _ENTITYMAP = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
            };
            function _escapeHtml(text) {
                if (text && wijmo.isString(text)) {
                    text = text.replace(/[&<>]/g, function (s) {
                        return _ENTITYMAP[s];
                    });
                }
                return text != null ? text.toString() : ''; // always return a string
            }
        })(search = grid.search || (grid.search = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var grid;
    (function (grid) {
        var search;
        (function (search) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.grid.search', wijmo.grid.search);
        })(search = grid.search || (grid.search = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.grid.search.js.map