/*! For license information please see wijmo.rest.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])},t(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}(),__awaiter=this&&this.__awaiter||function(t,e,r,n){return new(r||(r=Promise))((function(i,o){function s(t){try{u(n.next(t))}catch(t){o(t)}}function a(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){t.done?i(t.value):new r((function(e){e(t.value)})).then(s,a)}u((n=n.apply(t,e||[])).next())}))},__generator=this&&this.__generator||function(t,e){var r,n,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,n=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};!function(t){!function(e){var r=function(e){function r(r){var n=e.call(this)||this;return n._loading=!1,n._fields=null,n._keys=null,n._sortOnServer=!0,n._pageOnServer=!0,n._filterOnServer=!0,n._totalItemCount=0,n.loading=new t.Event,n.loaded=new t.Event,n.error=new t.Event,r&&t.copy(n,r),n.sortDescriptions.collectionChanged.addHandler((function(){n.sortOnServer&&n._getData()})),n._getData(),n}return __extends(r,e),Object.defineProperty(r.prototype,"fields",{get:function(){return this._fields},set:function(e){this._fields!=e&&(this._fields=t.asArray(e),this._getData())},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"sortOnServer",{get:function(){return this._sortOnServer},set:function(e){e!=this._sortOnServer&&(this._sortOnServer=t.asBoolean(e),this._getData())},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"pageOnServer",{get:function(){return this._pageOnServer},set:function(e){e!=this._pageOnServer&&(this._pageOnServer=t.asBoolean(e),this._getData())},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"filterOnServer",{get:function(){return this._filterOnServer},set:function(e){e!=this._filterOnServer&&(this._filterOnServer=t.asBoolean(e),this._getData())},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"requestHeaders",{get:function(){return this._requestHeaders},set:function(t){this._requestHeaders=t},enumerable:!0,configurable:!0}),r.prototype.updateFilterDefinition=function(t){this.filterOnServer&&(this._filterProvider=t,this._getData())},Object.defineProperty(r.prototype,"isLoading",{get:function(){return this._loading},enumerable:!0,configurable:!0}),r.prototype.onLoading=function(t){this.loading.raise(this,t)},r.prototype.onLoaded=function(t){this.loaded.raise(this,t)},r.prototype.load=function(){this._getData()},r.prototype.onError=function(t){return this.error.raise(this,t),!t.cancel},r.prototype._performRefresh=function(){var t=this._canFilter,r=this._canSort;this._canFilter=!this._filterOnServer,this._canSort=!this._sortOnServer,e.prototype._performRefresh.call(this),this._canFilter=t,this._canSort=r},Object.defineProperty(r.prototype,"totalItemCount",{get:function(){return this.pageOnServer?this._totalItemCount:this._view.length},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"pageCount",{get:function(){return this.pageSize?Math.ceil(this.totalItemCount/this.pageSize):1},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"pageSize",{get:function(){return this._pgSz},set:function(e){e!=this._pgSz&&(this._pgSz=t.asInt(e),this.pageOnServer?(this._pgIdx=t.clamp(this._pgIdx,0,this.pageCount-1),this._getData()):this.refresh())},enumerable:!0,configurable:!0}),r.prototype.onPageChanging=function(t){return e.prototype.onPageChanging.call(this,t),this.pageOnServer&&!t.cancel&&this._getData(),!t.cancel},r.prototype.commitNew=function(){var t=this,r=this.currentAddItem;if(r)try{var n=this.addItem(r);n&&n.then&&n.then((function(){return t.refresh()}))}catch(t){this._raiseError(t,!0)}e.prototype.commitNew.call(this)},r.prototype.commitEdit=function(){var t=this,r=this.currentEditItem;if(r&&!this.currentAddItem&&!this._sameContent(r,this._edtClone)&&this.items.indexOf(r)>-1)try{var n=this.patchItem(r);n&&n.then&&n.then((function(){return t.refresh()}))}catch(t){this._raiseError(t,!0)}e.prototype.commitEdit.call(this)},r.prototype.remove=function(t){var r=this;if(t&&t!=this.currentAddItem&&this.items.indexOf(t)>-1)try{var n=this.deleteItem(t);n&&n.then&&n.then((function(){return r.refresh()}))}catch(t){this._raiseError(t,!0)}e.prototype.remove.call(this,t)},r.prototype._getPageView=function(){return this.pageOnServer?this._view:e.prototype._getPageView.call(this)},r.prototype._getData=function(){var t=this;this._toGetData&&clearTimeout(this._toGetData),this._toGetData=setTimeout((function(){return __awaiter(t,void 0,void 0,(function(){var t,e,r,n;return __generator(this,(function(i){switch(i.label){case 0:this._toGetData=null,this._loading=!0,this.onLoading(),t=null,e=null,i.label=1;case 1:return i.trys.push([1,3,,4]),r=this.currentPosition,[4,this.getItems()];case 2:return t=i.sent(),this.sourceCollection=t,this.refresh(),r>-1&&this.moveCurrentToPosition(r),this.pageIndex>0&&this.pageIndex>=this.pageCount&&this.moveToLastPage(),[3,4];case 3:return n=i.sent(),e=n,[3,4];case 4:return this._loading=!1,this.onLoaded(),e&&this._raiseError(e,!1),[2]}}))}))}),100)},r.prototype._raiseError=function(t,e){if(this.onError(new n(t)))throw e&&this._getData(),"Server Error: "+t},r.prototype.getItems=function(){throw"This method is virtual: it should be overridden"},r.prototype.addItem=function(t){throw"This method is virtual: it should be overridden"},r.prototype.patchItem=function(t){throw"This method is virtual: it should be overridden"},r.prototype.deleteItem=function(t){throw"This method is virtual: it should be overridden"},r}(t.collections.CollectionView);e.RestCollectionView=r;var n=function(t){function e(e){var r=t.call(this)||this;return r._error=e,r}return __extends(e,t),Object.defineProperty(e.prototype,"error",{get:function(){return this._error},enumerable:!0,configurable:!0}),e}(t.CancelEventArgs);e.RESTErrorEventArgs=n}(t.rest||(t.rest={}))}(wijmo||(wijmo={})),function(t){t.rest||(t.rest={}),t._registerModule("wijmo.rest",t.rest)}(wijmo||(wijmo={}));