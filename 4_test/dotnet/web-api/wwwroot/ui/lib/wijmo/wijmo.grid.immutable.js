/*! For license information please see wijmo.grid.immutable.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}();!function(t){var e;!function(e){var n,i=function(t){function e(e,n,i,r){var o=t.call(this)||this;return o.action=e,o.oldItem=n,o.newItem=i,o.itemIndex=r,o}return __extends(e,t),e}(t.EventArgs);e.DataChangeEventArgs=i,function(t){t[t.Add=0]="Add",t[t.Remove=1]="Remove",t[t.Change=2]="Change"}(n=e.DataChangeAction||(e.DataChangeAction={}));var r=function(t){function e(e){var n=t.call(this)||this;return n._originalItem=e,n}return __extends(e,t),Object.defineProperty(e.prototype,"originalItem",{get:function(){return this._originalItem},enumerable:!0,configurable:!0}),e}(t.EventArgs);e.CloningItemEventArgs=r;var o=function(){function e(e,n){this._isAddNew=!1,this._isPasting=!1,this.dataChanged=new t.Event,this.cloningItem=new t.Event,t.assert(e instanceof t.grid.FlexGrid,"FlexGrid component is not specified."),this._grid=e;var i=this._cv=new t.collections.CollectionView([]);e.itemsSource=i,e.rowAdded.addHandler(this._gridRowAdded,this),e.deletingRow.addHandler(this._gridDeletingRow,this),e.deletedRow.addHandler(this._gridDeletedRow,this),e.beginningEdit.addHandler(this._gridBeginningEdit,this),e.rowEditEnded.addHandler(this._gridRowEditEnded,this),e.pasting.addHandler(this._gridPasting,this),e.pasted.addHandler(this._gridPasted,this),t.copy(this,n)}return e.prototype._clearChg=function(){this._isAddNew=this._isPasting=!1,this._chg=this._iChg=null},Object.defineProperty(e.prototype,"grid",{get:function(){return this._grid},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"collectionView",{get:function(){return this._cv},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"itemsSource",{get:function(){return this._items},set:function(e){if(t.assert(null==e||t.isArray(e),"Not an array"),e!==this._items){this._items=e;var n=this._cv,i=n.sourceCollection,r=n.currentPosition,o=n.currentItem;if(this._replaceItems(i,e),n.refresh(),r===n.currentPosition&&o!==n.currentItem){var a=new t.CancelEventArgs;n.onCurrentChanging(a),n.onCurrentChanged(a)}}},enumerable:!0,configurable:!0}),e.prototype.onDataChanged=function(t){this.dataChanged.raise(this,t)},e.prototype.onCloningItem=function(t){this.cloningItem.raise(this,t)},e.prototype._gridRowAdded=function(t,e){this._isPasting||(this._isAddNew=!0)},e.prototype._gridDeletingRow=function(t,e){if(!this._isAddNew){var n=e.getRow(),i=n.dataItem,r=this._dataIndex(n);this._cv.sourceCollection.indexOf(i),r>-1&&(this._iChg={oldItem:i,index:r})}},e.prototype._gridDeletedRow=function(t,e){var r=this._iChg,o=this._isAddNew;r&&(this._clearChg(),o||this.onDataChanged(new i(n.Remove,r.oldItem,null,r.index)))},e.prototype._gridBeginningEdit=function(t,e){if(!this._isAddNew){var n=e.getRow(),i=n.dataItem,r=this._cv.sourceCollection.indexOf(i),o=this._chg;if(o){if(o.changedItems[r])return}else o=this._chg={changedItems:{}};this._addItemChange(n.index,r)}},e.prototype._gridRowEditEnded=function(t,e){this._isPasting||this._doRowEditEnded(t,e)},e.prototype._doRowEditEnded=function(t,e){var r=this._isAddNew,o=this._chg;if(this._clearChg(),r){if(!e.cancel){var a=this._cv.sourceCollection,s=a[a.length-1];this.onDataChanged(new i(n.Add,null,s,a.length-1))}}else if(o)if(e.cancel){var d=e.getRow();this._swapBatchedItems(d,o.changedItems)>1&&this._cv.refresh()}else{var c=o.changedItems;for(var h in c){var g=c[h];this.onDataChanged(new i(n.Change,g.oldItem,g.newItem,g.index))}}},e.prototype._gridPasting=function(e,n){this._isPasting=!0;var i=n.range.rowSpan;if(this._chg&&1!==i)n.cancel=!0;else{if(1===i)return this._isPasting=!1,void(n.getRow()instanceof t.grid._NewRowTemplate||this._gridBeginningEdit(e,n));var r=this._grid.rows,o=n.range.topRow,a=n.range.bottomRow,s=Math.min(r.length-1,a),d=this._cv.sourceCollection;this._chg={changedItems:{},cvLength:d.length};for(var c=o;c<=s;c++){var h=this._dataIndex(r[c]);h>-1&&this._addItemChange(c,h)}}},e.prototype._gridPasted=function(t,e){var r=this._chg;if(r&&1!==e.range.rowSpan){var o=this._cv.sourceCollection,a=r.cvLength,s=o.slice(a,o.length);this._doRowEditEnded(t,e);for(var d=0;d<s.length;d++)this.onDataChanged(new i(n.Add,null,s[d],a+d))}},e.prototype._swapItem=function(t,e,n,i){var r=t;r&&r.dataItem===i||this._grid.rows.some((function(t){return t.dataItem===i&&!!(r=t)}));var o=this._cv,a=o.sourceCollection.indexOf(i),s=o.items.indexOf(i);return e.dataItem=n,r&&(r.dataItem=n),o.sourceCollection[a]=n,o.items[s]=n,a},e.prototype._swapBatchedItems=function(t,e){var n=Object.keys(e),i=n.length;i>1&&(t=null);for(var r=0,o=n;r<o.length;r++){var a=e[o[r]];this._swapItem(t,a.row,a.oldItem,a.newItem)}return i},e.prototype._addItemChange=function(t,e){var n=this._grid.rows[t],i=n.dataItem,r=this._cloneItem(i);null==e&&(e=this._cv.sourceCollection.indexOf(i)),this._chg.changedItems[e]={row:n,oldItem:i,newItem:r,index:e},this._swapItem(n,n,r,i)},e.prototype._dataIndex=function(e){var n=e.dataItem;return n&&!(e instanceof t.grid.GroupRow||e instanceof t.grid._NewRowTemplate)?this._cv.sourceCollection.indexOf(n):-1},e.prototype._replaceItems=function(t,e){t.splice(0,t.length);for(var n=t.length=e.length,i=0;i<n;i++)t[i]=e[i];return t},e.prototype._cloneItem=function(t){var e=new r(t);this.onCloningItem(e);var n=e.clonedItem;return null==n&&(n=this._cloneBindings(t)),n},e.prototype._cloneBindings=function(t){for(var e=a({},t),n={},i=0,r=this.grid.columns;i<r.length;i++){var o=r[i]._binding,s=o&&o._parts;if(s&&s.length>1)for(var d=s.length-2,c=n,h=0;h<=d;h++){var g=s[h];c[g]||(c[g]={}),c=c[g]}}return this._cloneProps(e,n),e},e.prototype._cloneProps=function(e,n){for(var i in n){var r=e[i];if(null!=r)if(t.isArray(r)){var o=e[i]=[].concat(r);this._cloneProps(o,n[i])}else t.isObject(r)&&(o=e[i]=a({},r),this._cloneProps(o,n[i]))}},e}();function a(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return s.apply(void 0,[t].concat(e))}e.ImmutabilityProvider=o,e.copyObject=a;var s="function"==typeof Object.assign?Object.assign:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var i=0,r=e;i<r.length;i++){var o=r[i];if(null!=o)for(var a in o){var s=Object.getOwnPropertyDescriptor(t,a);s&&!s.writable||(t[a]=o[a])}}return t}}((e=t.grid||(t.grid={})).immutable||(e.immutable={}))}(wijmo||(wijmo={})),function(t){var e;(e=t.grid||(t.grid={})).immutable||(e.immutable={}),t._registerModule("wijmo.grid.immutable",t.grid.immutable)}(wijmo||(wijmo={}));