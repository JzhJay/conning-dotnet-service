/*! For license information please see wijmo.touch.js.LICENSE.txt */
var wijmo;!function(t){!function(e){var i=function(){function e(){this._dropEffect="move",this._effectAllowed="all",this._data={}}return Object.defineProperty(e.prototype,"dropEffect",{get:function(){return this._dropEffect},set:function(e){this._dropEffect=t.asString(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"effectAllowed",{get:function(){return this._effectAllowed},set:function(e){this._effectAllowed=t.asString(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"types",{get:function(){return Object.keys(this._data)},enumerable:!0,configurable:!0}),e.prototype.clearData=function(t){null!=t?delete this._data[t]:this._data=null},e.prototype.getData=function(t){return this._data[t]||""},e.prototype.setData=function(t,e){this._data[t]=e},e.prototype.setDragImage=function(e,i,o){var s=n._instance;s._imgCustom=e,s._imgOffset=new t.Point(i,o)},e}();e.DataTransfer=i;var n=function(){function e(){this._lastClick=0,t.assert(!e._instance,"DragDropTouch instance already created.");var i=!1;document.addEventListener("test",(function(){}),{get passive(){return i=!0,!0}});var n=document,o=this._touchstart.bind(this),s=this._touchmove.bind(this),r=this._touchend.bind(this),a=!!i&&{passive:!1,capture:!1};n.addEventListener("touchstart",o,a),n.addEventListener("touchmove",s,a),n.addEventListener("touchend",r),n.addEventListener("touchcancel",r)}return e.getInstance=function(){return e._instance},e.prototype._touchstart=function(i){if(this._shouldHandle(i)){var n=i.target;if(Date.now()-this._lastClick<e._DBLCLICK&&this._dispatchEvent(i,"dblclick",n))return i.preventDefault(),void this._reset();if(this._reset(),this._lastTouch=i,!this._dispatchEvent(i,"mousemove",n)&&!this._dispatchEvent(i,"mousedown",n)){var o=t.closest(i.target,"[draggable]");o&&o.draggable&&(this._dragSource=o,this._ptDown=this._getPoint(i))}}},e.prototype._touchmove=function(t){if(this._shouldHandle(t)){this._lastTouch=t;var i=this._getTarget(t);if(this._dispatchEvent(t,"mousemove",i))return void t.preventDefault();this._dragSource&&!this._img&&this._getDelta(t)>e._THRESHOLD&&(this._dispatchEvent(t,"dragstart",this._dragSource),this._createImage(t),this._dispatchEvent(t,"dragenter",i)),this._img&&(t.preventDefault(),i!=this._lastTarget&&(this._dispatchEvent(t,"dragleave",this._lastTarget),this._dispatchEvent(t,"dragenter",i),this._lastTarget=i),this._moveImage(t),this._dispatchEvent(t,"dragover",i))}},e.prototype._touchend=function(t){if(this._shouldHandle(t)){var e=t.target,i=this._lastTouch;if(this._dispatchEvent(i,"mouseup",e))return void t.preventDefault();this._destroyImage(),this._dragSource&&(t.type.indexOf("cancel")<0&&this._dispatchEvent(i,"drop",this._lastTarget),this._dispatchEvent(i,"dragend",this._dragSource),this._reset())}},e.prototype._shouldHandle=function(t){return t&&!t.defaultPrevented&&t.touches&&t.touches.length<2},e.prototype._reset=function(){this._destroyImage(),this._dragSource=null,this._lastTouch=null,this._lastTarget=null,this._ptDown=null,this._dataTransfer=new i},e.prototype._getPoint=function(e,i){return e&&e.touches&&(e=e.touches[0]),t.assert(e&&"clientX"in e,"invalid event?"),1==i?new t.Point(e.pageX,e.pageY):new t.Point(e.clientX,e.clientY)},e.prototype._getDelta=function(t){var e=this._getPoint(t);return Math.abs(e.x-this._ptDown.x)+Math.abs(e.y-this._ptDown.y)},e.prototype._getTarget=function(t){for(var e=this._getPoint(t),i=document.elementFromPoint(e.x,e.y);i&&"none"==getComputedStyle(i).pointerEvents;)i=i.parentElement;return i},e.prototype._createImage=function(i){this._img&&this._destroyImage();var n=this._imgCustom||this._dragSource;if(this._img=n.cloneNode(!0),this._copyStyle(n,this._img),this._img.style.top=this._img.style.left="-9999px",!this._imgCustom){var o=n.getBoundingClientRect(),s=this._getPoint(i);this._imgOffset=new t.Point(s.x-o.left,s.y-o.top),this._img.style.opacity=e._OPACITY.toString()}this._moveImage(i),document.body.appendChild(this._img)},e.prototype._destroyImage=function(){this._img&&this._img.parentElement&&this._img.parentElement.removeChild(this._img),this._img=null,this._imgCustom=null},e.prototype._moveImage=function(e){var i=this;requestAnimationFrame((function(){if(i._img){var n=i._getPoint(e,!0);t.setCss(i._img,{position:"absolute",pointerEvents:"none",zIndex:999999,left:Math.round(n.x-i._imgOffset.x),top:Math.round(n.y-i._imgOffset.y)})}}))},e.prototype._copyProps=function(t,e,i){for(var n in e)i.test(n)&&(t[n]=e[n])},e.prototype._copyStyle=function(t,e){if(["id","class","style","draggable"].forEach((function(t){e.removeAttribute(t)})),t instanceof HTMLCanvasElement){var i=t,n=e;n.width=i.width,n.height=i.height,n.getContext("2d").drawImage(i,0,0)}for(var o=getComputedStyle(t),s=0;s<o.length;s++){var r=o[s];r.indexOf("transition")<0&&r.indexOf("transform")<0&&(e.style[r]=o[r])}for(e.style.pointerEvents="none",s=0;s<t.children.length;s++)this._copyStyle(t.children[s],e.children[s])},e.prototype._dispatchEvent=function(t,e,i){if(t&&i){var n=document.createEvent("Event"),o=t.touches?t.touches[0]:t;return n.initEvent(e,!0,!0),n.button=0,n.which=n.buttons=1,this._copyProps(n,t,/Key$/),this._copyProps(n,o,/(X|Y)$/),n.dataTransfer=this._dataTransfer,i.dispatchEvent(n),n.defaultPrevented}return!1},e._instance=new e,e._THRESHOLD=5,e._OPACITY=.5,e._DBLCLICK=500,e._CTXMENU=900,e}();e.DragDropTouch=n}(t.touch||(t.touch={}))}(wijmo||(wijmo={})),function(t){t.touch||(t.touch={}),t._registerModule("wijmo.touch",t.touch)}(wijmo||(wijmo={}));