/*! For license information please see wijmo.grid.search.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var t=function(e,i){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])},t(e,i)};return function(e,i){function n(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}();!function(t){var e;(function(e){"use strict";var i=function(e){function i(i,n){var r=e.call(this,i)||this;r._delay=t.Control._SEARCH_DELAY,r._cssMatch="wj-state-match",r._searchAllColumns=!1,r._rxSrch=null,r._rxHilite=null;var o=r.getTemplate();return r.applyTemplate("wj-control wj-content wj-flexgridsearch",o,{_tbx:"input",_btn:"btn"},"input"),r._filterBnd=r._filter.bind(r),r._tbx.addEventListener("input",(function(){r._toSearch&&clearTimeout(r._toSearch),r._toSearch=setTimeout((function(){r._toSearch=null,r._applySearch()}),r._delay)})),r._btn.addEventListener("click",(function(){r._toSearch&&clearTimeout(r._toSearch),r._toSearch=null,r._tbx.value="",r._applySearch(),r.containsFocus()&&r._tbx.focus()})),r.initialize(n),r}return __extends(i,e),Object.defineProperty(i.prototype,"grid",{get:function(){return this._g},set:function(e){if((e=t.asType(e,t.grid.FlexGrid,!0))!=this._g){var i=this._g;i&&(i.formatItem.removeHandler(this._formatItem),i.itemsSourceChanged.removeHandler(this._itemsSourceChanged)),i=this._g=e,this._itemsSourceChanged(),i&&(i.formatItem.addHandler(this._formatItem,this),i.itemsSourceChanged.addHandler(this._itemsSourceChanged,this))}},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"inputElement",{get:function(){return this._tbx},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"text",{get:function(){return this._tbx.value},set:function(e){e!=this.text&&(this._tbx.value=t.asString(e),this._applySearch())},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"delay",{get:function(){return this._delay},set:function(e){this._delay=t.asNumber(e,!1,!0)},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"placeholder",{get:function(){return this._tbx.placeholder},set:function(t){this._tbx.placeholder=t},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"cssMatch",{get:function(){return this._cssMatch},set:function(e){this._cssMatch=t.asString(e)},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"searchAllColumns",{get:function(){return this._searchAllColumns},set:function(e){this._searchAllColumns=t.asBoolean(e)},enumerable:!0,configurable:!0}),i.prototype._formatItem=function(e,i){if(this._rxHilite&&this._cssMatch&&i.panel==e.cells&&!i.getColumn()._getFlag(t.grid.RowColFlags.HasTemplate)&&!i.cell.querySelector("input")){var n=i.cell.innerHTML;this._rxHilite.test(n)&&(i.cell.innerHTML=n.replace(this._rxHilite,'<span class="'+this._cssMatch+'">$1</span>'))}},i.prototype._itemsSourceChanged=function(){this._cv&&this._cv.filters.remove(this._filterBnd);var e=this._g?this._g.collectionView:null;this._cv=e instanceof t.collections.CollectionView?e:null,this._cv&&this._cv.filters.push(this._filterBnd)},i.prototype._applySearch=function(){var e=this._g;this._rxSrch=this._rxHilite=null;var i=t.escapeRegExp(this.text).split(" ").filter((function(t){return t}));if(i.length){var r=e&&e.caseSensitiveSearch?"g":"gi";this._rxSrch=new RegExp("(?=.*"+i.join(")(?=.*")+")",r),i=i.map((function(e){return(i=e)&&t.isString(i)&&(i=i.replace(/[&<>]/g,(function(t){return n[t]}))),null!=i?i.toString():"";var i})),this._rxHilite=new RegExp("("+i.join("|")+")(?![^<]*>)",r)}var o=e?e.collectionView:null;o instanceof t.collections.CollectionView&&o.refresh()},i.prototype._filter=function(t){if(this._rxSrch&&this._g){var e=this._getItemText(t);return this._rxSrch.test(e)}return!0},i.prototype._getItemText=function(e){for(var i=[],n=this._g._getBindingColumns(),r=0;r<n.length;r++){var o=n[r],a=o._binding;if(a&&(o.visible||this.searchAllColumns)){var s=a.getValue(e);s=o.dataMap?o.dataMap.getDisplayValue(s):t.Globalize.format(s,o.format),o.isContentHtml&&(s=t.toPlainText(s)),s&&i.push(s)}}return i.join(" ")},i.controlTemplate='<div class="wj-template"><div class="wj-input"><div class="wj-input-group wj-input-btn-visible"><input wj-part="input" type="text" class="wj-form-control"/><span wj-part="btn" class="wj-input-group-btn"><button class="wj-btn wj-btn-default" tabindex="-1">&times</button></span></div></div></div>',i}(t.Control);e.FlexGridSearch=i;var n={"&":"&amp;","<":"&lt;",">":"&gt;"}})((e=t.grid||(t.grid={})).search||(e.search={}))}(wijmo||(wijmo={})),function(t){var e;(e=t.grid||(t.grid={})).search||(e.search={}),t._registerModule("wijmo.grid.search",t.grid.search)}(wijmo||(wijmo={}));