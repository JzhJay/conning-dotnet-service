/*! For license information please see wijmo.grid.multirow.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var e=function(t,o){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])},e(t,o)};return function(t,o){function r(){this.constructor=t}e(t,o),t.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}();!function(e){var t;!function(t){"use strict";var o=function(e){function t(t,o,r){var n=e.call(this,t)||this;return n._idxData=o,n._idxRecord=r,n}return __extends(t,e),Object.defineProperty(t.prototype,"recordIndex",{get:function(){return this._idxRecord},enumerable:!0,configurable:!0}),t}(e.grid.Row);t._MultiRow=o;var r=function(t){function o(e,o){var r=t.call(this,e)||this;return r._idxRecord=o,r}return __extends(o,t),Object.defineProperty(o.prototype,"recordIndex",{get:function(){return this._idxRecord},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"hasChildren",{get:function(){return!0},enumerable:!0,configurable:!0}),o.prototype.getCellRange=function(){var e=this._getLastRowInHeader();return e!=this?e.getCellRange():t.prototype.getCellRange.call(this)},Object.defineProperty(o.prototype,"isCollapsed",{get:function(){return this._getLastRowInHeader()._getFlag(e.grid.RowColFlags.Collapsed)},set:function(t){var o=this._getLastRowInHeader();t!=o.isCollapsed&&null!=o._list&&o._setCollapsed(e.asBoolean(t))},enumerable:!0,configurable:!0}),o.prototype._setCollapsed=function(t){var r=this,n=this.grid,i=n.rows,l=this.getCellRange(),a=new e.grid.CellRangeEventArgs(n.cells,new e.grid.CellRange(this.index,-1));n.onGroupCollapsedChanging(a)&&(n.deferUpdate((function(){i.deferUpdate((function(){r._setFlag(e.grid.RowColFlags.Collapsed,t,!0);for(var n=l.topRow+1;n<=l.bottomRow&&n>-1&&n<i.length;n++){i[n]._setFlag(e.grid.RowColFlags.ParentCollapsed,t,!0);var a=i[n];if(a instanceof o){var s=a._getLastRowInHeader();for(n+=1;n<=s.index;n++)(a=i[n])._setFlag(e.grid.RowColFlags.ParentCollapsed,t,!0);n--}a instanceof e.grid.GroupRow&&a.isCollapsed&&(n=a.getCellRange().bottomRow)}}))})),n.onGroupCollapsedChanged(a))},o.prototype._getLastRowInHeader=function(){var t=this.grid,r=this;if(t&&t.multiRowGroupHeaders)for(var n=t.rows,i=this.dataItem,l=this.index+1;l<n.length&&n[l].dataItem==i;l++)r=n[l];return e.assert(r instanceof o,"last row in header should be a _MultiRowGroup"),r},o}(e.grid.GroupRow);t._MultiGroupRow=r}((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;(function(t){"use strict";var o=function(t){function o(){return null!==t&&t.apply(this,arguments)||this}return __extends(o,t),o.prototype._setLayout=function(e){this._layout=e,this.forEach((function(t){return t._setLayout(e)}))},o.prototype.onCollectionChanged=function(o){void 0===o&&(o=e.collections.NotifyCollectionChangedEventArgs.reset);var r=this._layout;r&&r._onLayoutChanged(),t.prototype.onCollectionChanged.call(this,o)},o}(e.collections.ObservableArray);t.MultiRowCellCollection=o})((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;!function(t){"use strict";var o=function(){function o(e,t,o){this._initialized=!1,this._disposed=!1,this._rowsPerItem=1,this._groupsByColumn={},this._grid=e,this._changeCallback=o,this._bindingGroups=this._parseCellGroups(t),this._initialized=!0}return o.prototype._dispose=function(){if(!this._disposed){this._disposed=!0;var e=this._bindingGroups;e.forEach((function(e){e.cells._setLayout(null)})),e._setLayout(null),this._bindingGroups=null}},o.prototype._onLayoutChanged=function(){this._initialized&&!this._disposed&&this._changeCallback&&this._changeCallback()},o.prototype._parseCellGroups=function(o){var r=this,n=this._grid,i=null,l=1;if(o){if(o instanceof t.MultiRowCellCollection)o.forEach((function(o){e.assert(o instanceof t.MultiRowCellGroup,"groups contain items of invalid type")})),i=o;else{i=new t.MultiRowCellCollection;for(var a=0;a<o.length;a++){var s=null;s=o[a]instanceof t.MultiRowCellGroup?o[a]:new t.MultiRowCellGroup(o[a]),i.push(s)}}i.forEach((function(e){e.openGroup()})),a=0;for(var u=0;a<i.length;a++)(s=i[a])._colstart=u,u+=s._colspanEff,l=Math.max(l,s._rowspanEff);i.forEach((function(e){e.closeGroup(n,l)})),this._rowsPerItem=l}else i=new t.MultiRowCellCollection;return this._multiRowGroupHeaderRange=this._getMultiRowGroupHeaderRange(i),i.forEach((function(e){e.cells._setLayout(r)})),i._setLayout(this),i},o.prototype._getMultiRowGroupHeaderRange=function(t){for(var o=this._rowsPerItem,r=new e.grid.CellRange(0,0,o-1,0),n=0;n<t.length;n++){var i=t[n];if(i._hasAggregates)return 0===n&&this._expandMultiRowGroupHeaderToAggregate(r,i),r;r.col2=i._colstart+i._colspanEff-1}return r},o.prototype._expandMultiRowGroupHeaderToAggregate=function(e,t){var o=this._rowsPerItem,r=t._colspanEff,n=t.cells.filter((function(e){return e.col>0&&0!=e.aggregate})).map((function(e){return e.col})).reduce((function(e,t){return t<e?t:e}),r);e.col2=Math.max(t._colstart+n-1,e.col2);for(var i=n;i<r;i++){for(var l=!0,a=0;a<o;a++){var s=t._getCellRange(a,i);l=l&&s.col===i}if(l)return void(e.col2=Math.max(t._colstart+i-1,e.col2))}},o.prototype._getSingleRowGroupHeaderRange=function(t,o,r){var n=this._bindingGroups;if(0===n.length)return null;var i=this._getGroupByColumn(r);e.assert(null!=i,"Failed to get the group!");var l=i._getCellRange(0,r-i._colstart),a=new e.grid.CellRange(o,i._colstart+l.col,o,i._colstart+l.col2);if(0!=i.getBindingColumn(t,o,r).aggregate)return a;for(var s=n[0]._colstart,u=r-1;u>=s;u--){var c=this._getGroupByColumn(u);if(e.assert(null!=c,"Failed to get the group!"),0!=c.getBindingColumn(t,o,u).aggregate)break;l=c._getCellRange(0,u-c._colstart),a.col=c._colstart+l.col}var d=n[n.length-1],p=d._colstart+d._colspanEff;for(u=r+1;u<p;u++){var f=this._getGroupByColumn(u);if(e.assert(null!=f,"Failed to get the group!"),0!=f.getBindingColumn(t,o,u).aggregate)break;l=f._getCellRange(0,u-f._colstart),a.col2=f._colstart+l.col2}return a},o.prototype._getGroupHeaderMergedRange=function(o,r,n,i){if(i){var l=this._multiRowGroupHeaderRange;if(l.containsColumn(n)){var a=this._rowsPerItem,s=Math.floor(r/a)*a;return new e.grid.CellRange(s+l.row,l.col,s+l.row2,l.col2)}var u=this._getGroupByColumn(n);return e.assert(u instanceof t.MultiRowCellGroup,"Failed to get the group!"),u.getMergedRange(o,r,n)}return this._getSingleRowGroupHeaderRange(o,r,n)},o.prototype._getGroupByColumn=function(e){var t=this._groupsByColumn[e];if(!t)for(var o=this._bindingGroups,r=0;r<o.length;r++)if(e>=(t=o[r])._colstart&&e<=t._colstart+t._colspanEff-1){this._groupsByColumn[e]=t;break}return t},o.prototype._updateCellTypes=function(t){this._bindingGroups.forEach((function(o){o._cols.forEach((function(o){if(null==o.dataType&&o._binding&&(o.dataType=e.getType(o._binding.getValue(t))),!o.isReadOnly){var r=e.isIE()?null:Object.getOwnPropertyDescriptor(t,o.binding);o.isReadOnly=r&&!r.writable&&!r.set}}))}))},o}();t._MultiRowLayout=o}((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;(function(t){"use strict";var o=function(t){function o(o){var r=t.call(this)||this;return r._row=r._col=0,r._rowspan=r._colspan=1,e.copy(r,o),r}return __extends(o,t),Object.defineProperty(o.prototype,"row",{get:function(){return this._row},set:function(t){var o=e.asInt(t,!1,!0);this._row!=o&&(this._row=o,this._onLayoutPropertyChanged())},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"col",{get:function(){return this._col},set:function(t){var o=e.asInt(t,!1,!0);this._col!=o&&(this._col=o,this._onLayoutPropertyChanged())},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"colspan",{get:function(){return this._colspan},set:function(t){var o=e.asInt(t,!1,!0);e.assert(o>0,"colspan must be >= 1"),this._colspan!=o&&(this._colspan=o,this._onLayoutPropertyChanged())},enumerable:!0,configurable:!0}),Object.defineProperty(o.prototype,"rowspan",{get:function(){return this._rowspan},set:function(t){var o=e.asInt(t,!1,!0);e.assert(o>0,"rowspan must be >= 1"),this._rowspan!=o&&(this._rowspan=o,this._onLayoutPropertyChanged())},enumerable:!0,configurable:!0}),o.prototype._setLayout=function(e){this._layout=e},o.prototype._onLayoutPropertyChanged=function(){var e=this._layout;e&&e._onLayoutChanged()},o}(e.grid.Column);t.MultiRowCell=o})((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;(function(t){"use strict";var o=function(o){function r(r){var n=o.call(this)||this;return n._isRowHeader=!1,n._colstart=0,n._cells=new t.MultiRowCellCollection,e.copy(n,r),n}return __extends(r,o),r.prototype._copy=function(t,o){return"cells"==t&&(e.isArray(o)&&(this._cellsDef=o),!0)},Object.defineProperty(r.prototype,"cells",{get:function(){return this._cells},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"isRowHeader",{get:function(){return this._isRowHeader},set:function(t){var o=e.asBoolean(t);this._isRowHeader!=o&&(this._isRowHeader=o,this._onLayoutPropertyChanged())},enumerable:!0,configurable:!0}),r.prototype.openGroup=function(){this._isParsed||(this._cells=this._parseCells(this._cellsDef),this._isParsed=!0),this._calculate()},r.prototype.closeGroup=function(t,o){var r=this;if(o>this._rowspanEff&&(this._cells.forEach((function(e){e.row==r._rowspanEff-1&&(e._rowspanEff=o-e.row)})),this._rowspanEff=o),this._cells.forEach((function(e){for(;e.col+e._colspanEff<r._colspanEff&&!r._slotTaken(e.row,e.col+e._colspanEff);)e._colspanEff++})),this._cells.forEach((function(e){for(;e.row+e._rowspanEff<r._rowspanEff&&!r._slotTaken(e.row+e._rowspanEff,e.col);)e._rowspanEff++})),this._cells.length>0)for(var n=0;n<this._rowspanEff;n++)for(var i=0;i<this._colspanEff;i++)e.assert(this._slotTaken(n,i),"Invalid layout (empty cells).");this._cols=new e.grid.ColumnCollection(t,t.columns.defaultSize),this._rng=new Array(o*this._colspanEff),this._cells.forEach((function(t){for(var o=0;o<t._rowspanEff;o++)for(var n=0;n<t._colspanEff;n++){var i=(t.row+o)*r._colspanEff+t.col+n;r._cols.setAt(i,t);var l=new e.grid.CellRange(0-o,0-n,0-o+t._rowspanEff-1,0-n+t._colspanEff-1);l.isSingleCell||(r._rng[i]=l)}}));var l=this._colstart;this._rng[-1]=new e.grid.CellRange(0,l,0,l+this._colspanEff-1),this._hasAggregates=!1;for(var a=0;a<this._cells.length&&!this._hasAggregates;a++)this._hasAggregates=0!=this._cells[a].aggregate},r.prototype.getColumnWidth=function(e){for(var t=0;t<this._cells.length;t++){var o=this._cells[t];if(o.col==e&&1==o._colspanEff)return o.width}return null},r.prototype.getMergedRange=function(t,o,r){if(o<0)return this._rng[-1];var n=t.rows[o],i=null!=n.recordIndex?n.recordIndex:o%this._rowspanEff,l=r-this._colstart,a=this._rng[i*this._colspanEff+l];return t.cellType==e.grid.CellType.ColumnHeader&&o++,a?new e.grid.CellRange(o+a.row,r+a.col,o+a.row2,r+a.col2):null},r.prototype.getBindingColumn=function(e,t,o){if(t<0)return this;var r=e.rows[t],n=r&&null!=r.recordIndex?r.recordIndex:t%this._rowspanEff,i=o-this._colstart;return this._cols[n*this._colspanEff+i]},r.prototype.getColumn=function(e){return this._cols.getColumn(e)},r.prototype._getCellRange=function(t,o){var r=this._rng[t*this._colspanEff+o];return r?new e.grid.CellRange(t+r.row,o+r.col,t+r.row2,o+r.col2):new e.grid.CellRange(t,o)},r.prototype._parseCells=function(o){var r=this._cells;return o&&(o instanceof t.MultiRowCellCollection?(o.forEach((function(o){e.assert(o instanceof t.MultiRowCell,"cells contain items of invalid type")})),r=o):o.forEach((function(e){var o;o=e instanceof t.MultiRowCell?e:new t.MultiRowCell(e),r.push(o)})),r.forEach((function(t){t.binding&&!t.header&&(t.header=e.toHeaderCase(t.binding))}))),r},r.prototype._clearCalculations=function(){this._colstart=0,this._cols=null,this._hasAggregates=!1,this._rng=null,this.row=0,this.col=0,this._colspanEff=0,this._rowspanEff=0,this._cells.forEach((function(e){e.row=0,e.col=0,e._colspanEff=0,e._rowspanEff=0}))},r.prototype._calculate=function(){var e=this;this._clearCalculations(),this._colspanEff=this.colspan,this._rowspanEff=this.rowspan,this._cells.forEach((function(t){e._colspanEff=Math.max(e._colspanEff,t.colspan),t._colspanEff=t.colspan,t._rowspanEff=t.rowspan}));var t=0,o=0;this._cells.forEach((function(r,n){for(;!e._cellFits(r,n,t,o);)0==(o=(o+1)%e._colspanEff)&&t++;r.row=t,r.col=o}));var r=1,n=1;this._cells.forEach((function(e){r=Math.max(r,e.row+e._rowspanEff),n=Math.max(n,e.col+e._colspanEff)})),this._rowspanEff=r,this._colspanEff=n},r.prototype._cellFits=function(e,t,o,r){if(r>0&&r+e._colspanEff>this._colspanEff)return!1;for(var n=0;n<e._colspanEff;n++)if(this._slotTaken(o,r+n,t))return!1;return this._colspanEff=Math.max(this._colspanEff,r+e._colspanEff-1),!0},r.prototype._slotTaken=function(e,t,o){void 0===o&&(o=this._cells.length);for(var r=0;r<o;r++){var n=this._cells[r];if(e>=n.row&&e<=n.row+n._rowspanEff-1&&t>=n.col&&t<=n.col+n._colspanEff-1)return!0}return!1},r}(t.MultiRowCell);t.MultiRowCellGroup=o})((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;(function(t){"use strict";var o=function(o){function r(r,n){var i=o.call(this,r)||this;i._hdrLayoutDef=null,i._centerVert=!0,i._collapsedHeaders=!1,i._multiRowGroupHeaders=!1,i._rowHdrCnt=0,i.collapsedHeadersChanging=new e.Event,i.collapsedHeadersChanged=new e.Event,i._layoutDef=new t.MultiRowCellCollection,i._layout=new t._MultiRowLayout(i,i._layoutDef,(function(){return i._onLayoutChanged()})),e.addClass(i.hostElement,"wj-multirow");var l=i.columnHeaders.hostElement.parentElement,a=e.createElement('<div class="wj-hdr-collapse"><span></span></div>');a.style.display="none",l.appendChild(a),i._btnCollapse=a,i._updateButtonGlyph(),i.addEventListener(a,"mousedown",(function(e){switch(i.collapsedHeaders){case null:case!1:i._collapsedHeadersWasNull=null==i.collapsedHeaders,i.collapsedHeaders=!0;break;case!0:i.collapsedHeaders=!!i._collapsedHeadersWasNull&&null}e.preventDefault(),i.focus()}),!0);var s=i.hostElement;return i.addEventListener(s,"mousedown",(function(e){if(!i._mouseHdl._szRowCol){var t=i._layout?i._layout._bindingGroups:null,o=t&&t.length?t[0]:null;if(o&&o.isRowHeader){var r=i.hitTest(e);r.panel==i.columnHeaders&&r.col<i.frozenColumns&&(e.preventDefault(),i.selectAll())}}}),!0),["dragover","dragleave","dragdrop"].forEach((function(e){i.removeEventListener(s,e)})),i._addHdl=new t._MultiRowAddNewHandler(i),i.formatItem.addHandler(i._formatItem,i),i.autoGenerateColumns=!1,i.allowDragging=e.grid.AllowDragging.None,i.mergeManager=new t._MergeManager,i.initialize(n),i}return __extends(r,o),r.prototype._getProductInfo=function(){return"H87K,MultiRow"},Object.defineProperty(r.prototype,"layoutDefinition",{get:function(){return this._layoutDef},set:function(o){var r=this;if(this.finishEditing()||this.finishEditing(!0),this._layoutDef=e.asArray(o),this._layout&&(this._layout._dispose(),this._layout=null),this._layout=new t._MultiRowLayout(this,o,(function(){return r._onLayoutChanged()})),this._rowHdrCnt=0,this._layout)for(var n=this._layout._bindingGroups,i=0;i<n.length;i++){var l=n[i];if(!l.isRowHeader)break;this._rowHdrCnt=l._colstart+l._colspanEff,l.cells.forEach((function(e){var t="wj-header";e.isReadOnly=!0,!e.header||e.binding||e.cellTemplate||(e.cellTemplate=e.header),e.cssClass?e.cssClass.indexOf(t)<0&&(e.cssClass+=" wj-header"):e.cssClass=t}))}this._rowHdrCnt&&(this.frozenColumns=this._rowHdrCnt),this._bindGrid(!0),this._rowHdrCnt&&this.selectionMode&&this.select(this.selection.row,this._rowHdrCnt)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"headerLayoutDefinition",{get:function(){return this._hdrLayoutDef},set:function(o){var r=this;this._hdrLayoutDef=e.asArray(o),this._hdrLayout&&(this._hdrLayout._dispose(),this._hdrLayout=null);var n=null;o&&(n=new t._MultiRowLayout(this,o,(function(){return r._onHeaderLayoutChanged()}))),this._hdrLayout=n,this._bindGrid(!0)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"rowsPerItem",{get:function(){return this._layout._rowsPerItem},enumerable:!0,configurable:!0}),r.prototype.getBindingColumn=function(e,t,o){return this._getBindingColumn(e,t,e.columns[o])},r.prototype.getColumn=function(t,r){if(e.isString(t)){for(var n=r&&this._hdrLayout,i=(n?this._hdrLayout:this._layout)._bindingGroups,l=null,a=0;a<i.length&&!l;a++)l=i[a].getColumn(t);return!l&&n?this.getColumn(t,!1):l}return o.prototype.getColumn.call(this,t)},Object.defineProperty(r.prototype,"centerHeadersVertically",{get:function(){return this._centerVert},set:function(t){t!=this._centerVert&&(this._centerVert=e.asBoolean(t),this.invalidate())},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"collapsedHeaders",{get:function(){return this._collapsedHeaders},set:function(t){if(t!=this._collapsedHeaders){var o=new e.CancelEventArgs;this.onCollapsedHeadersChanging(o)&&(this._collapsedHeaders=e.asBoolean(t,!0),this._updateCollapsedHeaders(),this._updateButtonGlyph(),this.onCollapsedHeadersChanged(o))}},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"showHeaderCollapseButton",{get:function(){return""==this._btnCollapse.style.display},set:function(t){t!=this.showHeaderCollapseButton&&(this._btnCollapse.style.display=e.asBoolean(t)?"":"none")},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"multiRowGroupHeaders",{get:function(){return this._multiRowGroupHeaders},set:function(t){t!=this._multiRowGroupHeaders&&(this._multiRowGroupHeaders=e.asBoolean(t),this._bindGrid(!0))},enumerable:!0,configurable:!0}),r.prototype.onCollapsedHeadersChanging=function(e){return this.collapsedHeadersChanging.raise(this,e),!e.cancel},r.prototype.onCollapsedHeadersChanged=function(e){this.collapsedHeadersChanged.raise(this,e)},Object.defineProperty(r.prototype,"allowPinning",{get:function(){return!1},set:function(t){e.assert(!t,"MultiRow does not support pinning.")},enumerable:!0,configurable:!0}),r.prototype.onSelectionChanging=function(r){var n=r._rng;if(n&&n.isValid&&this.selectionMode){var i=this._mouseHdl._htDown,l=this.rows,a=this.columns,s=this._rowHdrCnt;if(s&&(n.col=Math.max(n.col,s),n.col2=Math.max(n.col2,s)),i&&(i.panel==this.rowHeaders||i.panel==this.cells&&i.col<s)){var u=l[n.topRow],c=l[n.bottomRow];if(u&&null!=u.recordIndex){var d=u.index-u.recordIndex,p=c instanceof t._MultiGroupRow&&!this._multiRowGroupHeaders?1:this.rowsPerItem,f=c.index-c.recordIndex+p-1,h=a.length-1,g=n.row!=n.topRow?new e.grid.CellRange(f,0,d,h):new e.grid.CellRange(d,0,f,h);switch(n.row=g.row,n.row2=g.row2,n.col2=h,this.selectionMode){case e.grid.SelectionMode.Cell:n.row2=g.row,n.col2=g.col;break;case e.grid.SelectionMode.Row:n.row2=g.row}}}}return o.prototype.onSelectionChanging.call(this,r)},r.prototype._getDeleteColumnIndex=function(){return this._rowHdrCnt},r.prototype._getQuickAutoSize=function(){return e.isBoolean(this.quickAutoSize)?this.quickAutoSize:this.formatItem.handlerCount<=1&&null==this.itemFormatter},r.prototype._addBoundRow=function(e,o){for(var r=e[o],n=0;n<this.rowsPerItem;n++)this.rows.push(new t._MultiRow(r,o,n))},r.prototype._addNode=function(e,t,o){this._addBoundRow(e,t)},r.prototype._addGroupRow=function(e){for(var o=this._multiRowGroupHeaders?this.rowsPerItem:1,r=0;r<o;r++)this.rows.push(new t._MultiGroupRow(e,r))},r.prototype._bindColumns=function(){for(var t=this,o=this.columnHeaders.rows,r=this._layout,n=this._hdrLayout,i=(n?n._rowsPerItem:this.rowsPerItem)+1;o.length>i;)o.removeAt(o.length-1);for(;o.length<i;)o.push(new e.grid.Row);if(this._updateCollapsedHeaders(),this.columns.clear(),r){var l="width,minWidth,maxWidth,binding,header,format,dataMap,name,aggregate,cellTemplate".split(",");r._bindingGroups.forEach((function(o){for(var r=function(r){if(0===o.cells.length)return"continue";for(var n=new e.grid.Column,i=function(e){var t=o.cells[e];t.col==r&&l.forEach((function(e){null!=t[e]&&t[e]!=n[e]&&(n[e]=t[e])}))},a=0;a<o.cells.length;a++)i(a);t.columns.push(n)},n=0;n<o._colspanEff;n++)r(n)}))}},r.prototype._updateCollapsedHeaders=function(){var e=this.columnHeaders.rows,t=this.collapsedHeaders;e[0].visible=0!=t;for(var o=1;o<e.length;o++)e[o].visible=1!=t},r.prototype._updateColumnTypes=function(){o.prototype._updateColumnTypes.call(this);var t=this.collectionView;if(e.hasItems(t)){var r=t.items[0];this._layout&&this._layout._updateCellTypes(r),this._hdrLayout&&this._hdrLayout._updateCellTypes(r)}},r.prototype._getBindingColumn=function(t,o,r){if(r&&(t==this.cells||t==this.columnHeaders)){var n=t.cellType==e.grid.CellType.ColumnHeader;n&&o--,r=this._getGroupByColumn(r.index,n).getBindingColumn(t,o,r.index)}return r},r.prototype._getBindingColumns=function(){var e=[];return this._layout._bindingGroups.forEach((function(t){t._cols.forEach((function(t){e.indexOf(t)<0&&e.push(t)}))})),e},r.prototype._getRowsPerItem=function(){return this.rowsPerItem},r.prototype._cvCollectionChanged=function(o,r){if(this.autoGenerateColumns&&0==this.columns.length)this._bindGrid(!0);else{var n=e.collections.NotifyCollectionChangedAction;switch(r.action){case n.Change:this.invalidate();break;case n.Add:if(r.index==this.collectionView.items.length-1){for(var i=this.rows.length;i>0&&this.rows[i-1]instanceof e.grid._NewRowTemplate;)i--;for(var l=0;l<this.rowsPerItem;l++)this.rows.insert(i+l,new t._MultiRow(r.item,r.index,l));return}e.assert(!1,"added item should be the last one.");break;default:this._bindGrid(!1)}}},r.prototype._getGroupByColumn=function(o,r){var n=null;return r&&this._hdrLayout&&!this.collapsedHeaders&&(n=this._hdrLayout._getGroupByColumn(o)),n||(n=this._layout._getGroupByColumn(o)),e.assert(n instanceof t.MultiRowCellGroup,"Failed to get the group!"),n},r.prototype._onLayoutChanged=function(){this.layoutDefinition=this._layoutDef},r.prototype._onHeaderLayoutChanged=function(){this.headerLayoutDefinition=this._hdrLayoutDef},r.prototype._formatItem=function(o,r){var n=this.rowsPerItem,i=r.panel,l=i.cellType,a=i.rows[r.range.row],s=i.rows[r.range.row2],u=r.cell,c=e.grid.CellType;if(l==c.ColumnHeader&&e.toggleClass(u,"wj-group-header",0==r.range.row),l==c.Cell||l==c.ColumnHeader){var d=this._getGroupByColumn(r.col,l==c.ColumnHeader);e.toggleClass(u,"wj-group-start",d._colstart==r.range.col),e.toggleClass(u,"wj-group-end",d._colstart+d._colspanEff-1==r.range.col2)}if(n>1&&(l==c.Cell||l==c.RowHeader)){var p=a instanceof t._MultiRow||a instanceof t._MultiRowNewRowTemplate,f=s instanceof t._MultiRow||s instanceof t._MultiRowNewRowTemplate;e.toggleClass(u,"wj-record-start",!!p&&0==a.recordIndex),e.toggleClass(u,"wj-record-end",!!f&&s.recordIndex==n-1)}var h=this.alternatingRowStep;if(h){var g=!1;a instanceof t._MultiRow&&(g=a.dataIndex%(h+1)==0,1==h&&(g=!g)),e.toggleClass(u,"wj-alt",g)}if(this._centerVert&&!u.getAttribute("wj-state-measuring")){var _=r.range.rowSpan>1;if(_&&r.updateContent)if(0==u.childElementCount)u.innerHTML="<div>"+u.innerHTML+"</div>";else{var w=document.createElement("div"),y=document.createRange();y.selectNodeContents(u),y.surroundContents(w)}e.toggleClass(u,"wj-center-vert",_)}},r.prototype._updateButtonGlyph=function(){var e=this._btnCollapse.querySelector("span");e instanceof HTMLElement&&(e.className=this.collapsedHeaders?"wj-glyph-left":"wj-glyph-down-left")},r.prototype._getError=function(t,r,n,i){if(e.isFunction(this.itemValidator)&&t==this.rowHeaders)for(var l=0;l<this.rowsPerItem;l++)for(n=0;n<this.columns.length;n++){var a=this.itemValidator(r+l,n,i);if(a)return a}return o.prototype._getError.call(this,t,r,n,i)},r}(e.grid.FlexGrid);t.MultiRow=o})((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;!function(t){"use strict";var o=function(o){function r(){return null!==o&&o.apply(this,arguments)||this}return __extends(r,o),r.prototype.getMergedRange=function(o,r,n,i){void 0===i&&(i=!0);var l=o.grid;if(r<0||r>=o.rows.length||n<0||n>=o.columns.length)return null;switch(o.cellType){case e.grid.CellType.Cell:case e.grid.CellType.RowHeader:if(o.rows[r]instanceof e.grid.GroupRow&&!l.multiRowGroupHeaders)return this._getGroupRowMergedRange(o,r,n,i,!1)}switch(o.cellType){case e.grid.CellType.Cell:if(o.rows[r]instanceof e.grid.GroupRow)return this._getGroupRowMergedRange(o,r,n,i,l.multiRowGroupHeaders);case e.grid.CellType.ColumnHeader:var a=o.cellType==e.grid.CellType.ColumnHeader,s=l._getGroupByColumn(n,a);e.assert(s instanceof t.MultiRowCellGroup,"Failed to get the group!");var u=a?s.getMergedRange(o,r-1,n):s.getMergedRange(o,r,n),c=o.columns.frozen;c&&u&&u.columnSpan>1&&u.col<c&&u.col2>=c&&(u=u.clone(),n<c?u.col2=c-1:u.col=c);var d=o.rows.frozen;return d&&u&&u.rowSpan>1&&o.cellType==e.grid.CellType.Cell&&u.row<d&&u.row2>=d&&(u=u.clone(),r<d?u.row2=d-1:u.row=d),e.assert(!u||u.contains(r,n),"Merged range must contain source cell"),u;case e.grid.CellType.RowHeader:var p=l.rowsPerItem,f=r-o.rows[r].recordIndex,h=Math.min(f+p-1,o.rows.length-1);return new e.grid.CellRange(f,0,h,o.columns.length-1);case e.grid.CellType.TopLeft:var g=l.collapsedHeaders,_=o.rows.length-1,w=_>0?1:0,y=0!=g?0:w,m=1!=g?_:w;return new e.grid.CellRange(y,0,m,o.columns.length-1)}return null},r.prototype._getGroupRowMergedRange=function(r,n,i,l,a){void 0===l&&(l=!0);var s=r.grid,u=r.cellType,c=r.rows[n];return s.showGroups&&!s.childItemsPath&&c instanceof t._MultiGroupRow&&c.dataItem instanceof e.collections.CollectionViewGroup&&u==e.grid.CellType.Cell?s._layout._getGroupHeaderMergedRange(r,n,i,a):o.prototype.getMergedRange.call(this,r,n,i,l)},r}(e.grid.MergeManager);t._MergeManager=o}((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;!function(t){"use strict";var o=function(t){function o(e){return e._addHdl._detach(),t.call(this,e)||this}return __extends(o,t),o.prototype.updateNewRowTemplate=function(){for(var e=this._g.editableCollectionView,t=this._g,o=t.rows,n=e&&e.canAddNew&&t.allowAddNew&&!t.isReadOnly,i=-1,l=0;l<o.length;l+=t.rowsPerItem)if(o[l]instanceof r){i=l;break}if(n&&i>-1&&(this._top&&i>0||!this._top&&0==i)&&(i=-1,this._removeNewRowTemplate()),n&&i<0)for(l=0;l<t.rowsPerItem;l++){var a=new r(l);this._top?o.insert(l,a):o.push(a)}!n&&i>-1&&this._removeNewRowTemplate()},o.prototype._keydown=function(o){t.prototype._keydown.call(this,o),o.defaultPrevented||o.keyCode!=e.Key.Escape||this._copyNewDataItem()},o.prototype._rowEditEnded=function(e,o){t.prototype._rowEditEnded.call(this,e,o),this._copyNewDataItem()},o.prototype._beginningEdit=function(e,o){t.prototype._beginningEdit.call(this,e,o),this._top&&!e.rows[0].dataItem&&this._copyNewDataItem()},o.prototype._copyNewDataItem=function(){if(this._top)for(var t=this._g,o=t.rows,r=0;r<t.rowsPerItem;r++)o[r]instanceof e.grid._NewRowTemplate&&(o[r].dataItem=this._nrt.dataItem)},o.prototype._removeNewRowTemplate=function(){for(var t=0,o=this._g.rows;t<o.length;t++)o[t]instanceof e.grid._NewRowTemplate&&(o.removeAt(t),t--)},o}(e.grid._AddNewHandler);t._MultiRowAddNewHandler=o;var r=function(e){function t(t){var o=e.call(this)||this;return o._idxRecord=t,o}return __extends(t,e),Object.defineProperty(t.prototype,"recordIndex",{get:function(){return this._idxRecord},enumerable:!0,configurable:!0}),t}(e.grid._NewRowTemplate);t._MultiRowNewRowTemplate=r}((t=e.grid||(e.grid={})).multirow||(t.multirow={}))}(wijmo||(wijmo={})),function(e){var t;(t=e.grid||(e.grid={})).multirow||(t.multirow={}),e._registerModule("wijmo.grid.multirow",e.grid.multirow)}(wijmo||(wijmo={}));