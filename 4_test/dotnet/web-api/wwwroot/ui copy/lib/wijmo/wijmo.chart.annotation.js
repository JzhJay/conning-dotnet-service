/*! For license information please see wijmo.chart.annotation.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}();!function(t){var e;!function(e){"use strict";var n,i;!function(t){t[t.DataIndex=0]="DataIndex",t[t.DataCoordinate=1]="DataCoordinate",t[t.Relative=2]="Relative",t[t.Absolute=3]="Absolute"}(n=e.AnnotationAttachment||(e.AnnotationAttachment={})),function(t){t[t.Center=0]="Center",t[t.Top=1]="Top",t[t.Bottom=2]="Bottom",t[t.Left=4]="Left",t[t.Right=8]="Right"}(i=e.AnnotationPosition||(e.AnnotationPosition={}));var o=function(){function e(t){this._resetDefaultValue(),this._copy(this,t)}return Object.defineProperty(e.prototype,"attachment",{get:function(){return this._attachment},set:function(e){(e=t.asEnum(e,n))!=this._attachment&&(this._attachment=e,this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"point",{get:function(){return this._point},set:function(t){null!=t.x&&null!=t.y&&(t.x===this._point.x&&t.y===this._point.y||(this._point=t,this._repaint()))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"seriesIndex",{get:function(){return this._seriesIndex},set:function(e){(e=t.asNumber(e,!1,!0))!=this._seriesIndex&&(this._seriesIndex=e,this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"pointIndex",{get:function(){return this._pointIndex},set:function(e){e!==this._pointIndex&&(this._pointIndex=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"position",{get:function(){return this._position},set:function(t){t!=this._position&&(this._position=t,this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"offset",{get:function(){return this._offset},set:function(t){null!=t.x&&null!=t.y&&(t.x===this._offset.x&&t.y===this._offset.y||(this._offset=t,this._repaint()))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"style",{get:function(){return null==this._style&&(this._style={}),this._style},set:function(t){t!=this._style&&(this._style=t,this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isVisible",{get:function(){return this._isVisible},set:function(e){(e=t.asBoolean(e,!1))!=this._isVisible&&(this._isVisible=e,this._toggleVisibility(e))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"tooltip",{get:function(){return this._tooltip},set:function(t){this._tooltip=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"name",{get:function(){return this._name},set:function(t){this._name=t},enumerable:!0,configurable:!0}),e.prototype.render=function(i){var o,r=this;r._element=i.startGroup(r._getCSSClass()),i.fill="#88bde6",i.strokeWidth=1,i.stroke="#000000",r._render(i),i.endGroup(),r._element[e._DATA_KEY]=this,r._isVisible?r._attachment===n.DataIndex&&(!(o=r._layer._chart.series[r._seriesIndex])||o.visibility!==t.chart.SeriesVisibility.Legend&&o.visibility!==t.chart.SeriesVisibility.Hidden||r._toggleVisibility(!1)):r._toggleVisibility(!1)},e.prototype.destroy=function(){},e.prototype._copy=function(t,e){for(var n in e)n in t&&this._processOptions(n,t,e)},e.prototype._processOptions=function(t,e,n){e[t]=n[t]},e.prototype._resetDefaultValue=function(){var e=this;e._attachment=n.Absolute,e._point=new t.chart.DataPoint(0,0),e._seriesIndex=0,e._pointIndex=0,e._position=i.Center,e._offset=new t.Point(0,0),e._isVisible=!0,e._tooltip=""},e.prototype._toggleVisibility=function(t){var e=t?"visible":"hidden";this._element&&this._element.setAttribute("visibility",e)},e.prototype._getCSSClass=function(){return e._CSS_ANNOTATION},e.prototype._render=function(t){this._element=null},e.prototype._repaint=function(){this._layer&&this._layer._renderAnnotation(this._layer._chart.renderEngine,this)},e.prototype._convertPoint=function(e){var i,o,r,s,a,_,h,l=this,p=l._attachment,u=new t.Point;switch(l._layer&&l._layer._chart&&(o=(i=l._layer._chart)._plotRect),p){case n.DataIndex:if(!i.series||i.series.length<=l.seriesIndex)break;if(!(_=(a=i.series[l.seriesIndex])._getItem(l.pointIndex)))break;r=a.axisX||i.axisX,s=a.axisY||i.axisY,h=_[a.bindingX]||_.x;var c=_[a._getBinding(0)]||s.actualMin+.25;null!=a._getYOffset&&(c=a._getYOffset(this.pointIndex)),"string"==typeof h&&(h=l.pointIndex,null!=a._getXOffset&&(h+=a._getXOffset())),u.x=l._convertDataToLen(o.width,r,h),u.y=l._convertDataToLen(o.height,s,c,!0);break;case n.DataCoordinate:r=i.axisX,s=i.axisY,u.x=l._convertDataToLen(o.width,r,e.x),u.y=l._convertDataToLen(o.height,s,e.y,!0);break;case n.Relative:u.x=o.width*e.x,u.y=o.height*e.y;break;case n.Absolute:default:u.x=e.x,u.y=e.y}return u},e.prototype._convertDataToLen=function(t,e,n,i){void 0===i&&(i=!1);var o=null==e.min?e.actualMin:e.min,r=null==e.max?e.actualMax:e.max,s=e._getLogBase();if(e.reversed&&(i=!i),s){if(n<=0)return NaN;var a=Math.log(r/o);return i?t*(1-Math.log(n/o)/a):t*Math.log(n/o)/a}return i?t*(1-(n-o)/(r-o)):t*(n-o)/(r-o)},e.prototype._renderCenteredText=function(t,e,n,i,o,r){var s,a;this._isValidPoint(n)&&(o?e.drawStringRotated(t,n,n,o,i,r):e.drawString(t,n,i,r),(s=this._element.querySelector("text"))&&(a=s.getBBox(),s.setAttribute("x",(n.x-a.width/2).toFixed(1)),s.setAttribute("y",(n.y+a.height/6).toFixed(1))))},e.prototype._adjustOffset=function(t,e){t.x=t.x+e.x,t.y=t.y+e.y},e.prototype._getOffset=function(e){var n=this._getPositionOffset(e);return new t.Point(this._offset.x+n.x,this._offset.y+n.y)},e.prototype._getPositionOffset=function(e){var n=new t.Point(0,0),o=this.position,r=this._getSize(e);return(o&i.Top)===i.Top?n.y-=r.height/2:(o&i.Bottom)===i.Bottom&&(n.y+=r.height/2),(o&i.Left)===i.Left?n.x-=r.width/2:(o&i.Right)===i.Right&&(n.x+=r.width/2),n},e.prototype._getSize=function(e){return new t.Size},e.prototype._isValidPoint=function(t){return isFinite(t.x)&&isFinite(t.y)},e.prototype._measureString=function(t,e,n){var i,o=t;return o._textGroup&&null==o._textGroup.parentNode?(o._svg.appendChild(o._textGroup),i=o.measureString(e,n,null,this.style),o.endRender()):i=o.measureString(e,n,null,this.style),i},e._DATA_KEY="wj-chart-annotation",e._CSS_ANNOTATION="gcchart-annotation",e._CSS_ANNO_TEXT="anno-text",e._CSS_ANNO_SHAPE="anno-shape",e}();e.AnnotationBase=o;var r=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._text="",this.position=i.Top},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_TEXT},Object.defineProperty(n.prototype,"text",{get:function(){return this._text},set:function(t){var e=this;t!==e._text&&(e._text=t,e._repaint())},enumerable:!0,configurable:!0}),n.prototype._render=function(t){var e,n=this,i=n._convertPoint(n.point);e=n._getOffset(t),n._adjustOffset(i,e),n._renderCenteredText(n._text,t,i,o._CSS_ANNO_TEXT,null,n.style)},n.prototype._getSize=function(e){return e?this._measureString(e,this._text,o._CSS_ANNO_TEXT):new t.Size},n._CSS_TEXT="gcchart-anno-text",n}(o);e.Text=r;var s=function(t){function e(e){return t.call(this,e)||this}return __extends(e,t),e.prototype._resetDefaultValue=function(){t.prototype._resetDefaultValue.call(this),this._content=""},e.prototype._getCSSClass=function(){return t.prototype._getCSSClass.call(this)+" "+e._CSS_SHAPE},Object.defineProperty(e.prototype,"content",{get:function(){return this._content},set:function(t){var e=this;t!==e._content&&(e._content=t,e._repaint())},enumerable:!0,configurable:!0}),e.prototype._render=function(t){var e=this;e._shapeContainer=t.startGroup(),t.stroke="#000",e._renderShape(t),t.stroke=null,t.endGroup(),e._content&&e._renderText(t)},e.prototype._getContentCenter=function(){return this.point},e.prototype._renderShape=function(t){},e.prototype._renderText=function(t){var e,n,i=this;e=i._convertPoint(i._getContentCenter()),i._isValidPoint(e)&&(n=i._getOffset(),i._adjustOffset(e,n),i._renderCenteredText(i._content,t,e,o._CSS_ANNO_TEXT))},e._CSS_SHAPE="gcchart-anno-shape",e}(o);e.Shape=s;var a=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"width",{get:function(){return this._width},set:function(e){e!==this._width&&(this._width=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"height",{get:function(){return this._height},set:function(e){e!==this._height&&(this._height=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._width=100,this._height=80},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_ELLIPSE},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n=this,i=n._convertPoint(n.point),r=n._width,s=n._height,a=n._getOffset();n._adjustOffset(i,a),n._isValidPoint(i)&&t.drawEllipse(i.x,i.y,r/2,s/2,o._CSS_ANNO_SHAPE,n.style)},n.prototype._getSize=function(){return new t.Size(this.width,this.height)},n._CSS_ELLIPSE="gcchart-anno-ellipse",n}(s);e.Ellipse=a;var _=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"width",{get:function(){return this._width},set:function(e){e!==this._width&&(this._width=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"height",{get:function(){return this._height},set:function(e){e!==this._height&&(this._height=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._width=100,this._height=80},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_RECTANGLE},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n=this,i=n._convertPoint(n.point),r=n._width,s=n._height,a=n._getOffset();n._adjustOffset(i,a),n._isValidPoint(i)&&t.drawRect(i.x-r/2,i.y-s/2,n._width,n._height,o._CSS_ANNO_SHAPE,n.style)},n.prototype._getSize=function(){return new t.Size(this.width,this.height)},n._CSS_RECTANGLE="gcchart-anno-rectangle",n}(s);e.Rectangle=_;var h=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"start",{get:function(){return this._start},set:function(t){var e=this;null!=t.x&&null!=t.y&&(t.x===e._start.x&&t.y===e._start.y||(e._start=t,e._repaint()))},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"end",{get:function(){return this._end},set:function(t){var e=this;null!=t.x&&null!=t.y&&(t.x===e._end.x&&t.y===e._end.y||(e._end=t,e._repaint()))},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._start=new t.chart.DataPoint(0,0),this._end=new t.chart.DataPoint(0,0),this.position=i.Top},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_LINE},n.prototype._getContentCenter=function(){var e=this.start,n=this.end;return t.isDate(e.x)&&t.isDate(n.x)?new t.chart.DataPoint(new Date((e.x.getTime()+n.x.getTime())/2),(e.y+n.y)/2):new t.chart.DataPoint((e.x+n.x)/2,(e.y+n.y)/2)},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n,i=this,r=i._convertPoint(i._start),s=i._convertPoint(i._end);i._cS=r,i._cE=s,n=i._getOffset(),i._adjustOffset(r,n),i._adjustOffset(s,n),i._isValidPoint(r)&&i._isValidPoint(s)&&t.drawLine(r.x,r.y,s.x,s.y,o._CSS_ANNO_SHAPE,i.style)},n.prototype._getSize=function(){var e=this._cS,n=this._cE;return new t.Size(Math.abs(e.x-n.x),Math.abs(e.y-n.y))},n.prototype._renderText=function(t){var e,n,i,r=this,s=r._cS,a=r._cE;e=r._convertPoint(r._getContentCenter()),n=r._getOffset(),r._adjustOffset(e,n),r._isValidPoint(e)&&(i=(i=180*Math.atan2(a.y-s.y,a.x-s.x)/Math.PI)<-90?i+180:i>90?i-180:i,r._renderCenteredText(r.content,t,e,o._CSS_ANNO_TEXT,i))},n.prototype._renderCenteredText=function(t,n,i,o,r,s){var a,_,h,l;null!=r&&(h=this._measureString(n,t,o).height/2,l=r*Math.PI/180,a=h*Math.sin(l),_=h*Math.cos(l),i.x=i.x+a,i.y=i.y-_),e.prototype._renderCenteredText.call(this,t,n,i,o,r,s)},n._CSS_LINE="gcchart-anno-line",n}(s);e.Line=h;var l=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),n.prototype._processOptions=function(n,i,o){var r=this;if("points"===n){var s=o[n];t.isArray(s)&&s.forEach((function(t){r.points.push(t)}))}else e.prototype._processOptions.call(this,n,i,o)},Object.defineProperty(n.prototype,"points",{get:function(){return this._points},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){var n=this;e.prototype._resetDefaultValue.call(this),n._points=new t.collections.ObservableArray,n._points.collectionChanged.addHandler((function(){n._element&&n._repaint()}))},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_POLYGON},n.prototype._getContentCenter=function(){var e,n=this.points,i=n.length,o=0,r=0;for(e=0;e<i;e++)o+=t.isDate(n[e].x)?n[e].x.getTime():n[e].x,r+=t.isDate(n[e].y)?n[e].y.getTime():n[e].y;return new t.chart.DataPoint(o/i,r/i)},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n,i,r=this,s=[],a=[],_=r._points,h=_.length,l=r._getOffset();for(n=0;n<h;n++){if(i=r._convertPoint(_[n]),!r._isValidPoint(i))return;r._adjustOffset(i,l),s.push(i.x),a.push(i.y)}t.drawPolygon(s,a,o._CSS_ANNO_SHAPE,r.style)},n.prototype._getSize=function(){var e,n,i,o,r,s,a,_=this,h=_._points.length;for(a=[].map.call(_._points,(function(t){return _._convertPoint(t)})),r=0;r<h;r++)s=a[r],0!==r?(s.x<e?e=s.x:s.x>n&&(n=s.x),s.y<i?i=s.y:s.y>o&&(o=s.y)):(e=n=s.x,i=o=s.y);return new t.Size(n-e,o-i)},n._CSS_POLYGON="gcchart-anno-polygon",n}(s);e.Polygon=l;var p=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"radius",{get:function(){return this._radius},set:function(e){e!==this._radius&&(this._radius=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._radius=100},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_CIRCLE},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n=this,i=n._convertPoint(n.point),r=n._getOffset();n._adjustOffset(i,r),n._isValidPoint(i)&&t.drawPieSegment(i.x,i.y,n.radius,0,360,o._CSS_ANNO_SHAPE,n.style)},n.prototype._getSize=function(){var e=2*this.radius;return new t.Size(e,e)},n._CSS_CIRCLE="gcchart-anno-circle",n}(s);e.Circle=p;var u=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"length",{get:function(){return this._length},set:function(e){e!==this._length&&(this._length=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._length=100},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_SQUARE},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n=this,i=n._convertPoint(n.point),r=n.length,s=n._getOffset();n._adjustOffset(i,s),n._isValidPoint(i)&&t.drawRect(i.x-r/2,i.y-r/2,r,r,o._CSS_ANNO_SHAPE,n.style)},n.prototype._getSize=function(){return new t.Size(this.length,this.length)},n._CSS_SQUARE="gcchart-anno-square",n}(s);e.Square=u;var c=function(e){function n(t){return e.call(this,t)||this}return __extends(n,e),Object.defineProperty(n.prototype,"width",{get:function(){return this._width},set:function(e){e!==this._width&&(this._width=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"height",{get:function(){return this._height},set:function(e){e!==this._height&&(this._height=t.asNumber(e,!1,!0),this._repaint())},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"href",{get:function(){return this._href},set:function(t){t!==this._href&&(this._href=t,this._repaint())},enumerable:!0,configurable:!0}),n.prototype._resetDefaultValue=function(){e.prototype._resetDefaultValue.call(this),this._width=100,this._height=100,this._href=""},n.prototype._getCSSClass=function(){return e.prototype._getCSSClass.call(this)+" "+n._CSS_IMAGE},n.prototype._renderShape=function(t){e.prototype._renderShape.call(this,t);var n=this,i=n._convertPoint(n.point),o=n._href,r=n.width,s=n.height,a=n._getOffset();o.length>0&&n._isValidPoint(i)&&(n._adjustOffset(i,a),t.drawImage(o,i.x-r/2,i.y-s/2,r,s)),n._applyStyle(n._element,n.style)},n.prototype._getSize=function(){return new t.Size(this.width,this.height)},n.prototype._applyStyle=function(t,e){if(e)for(var n in e)t.setAttribute(this._deCase(n),e[n])},n.prototype._deCase=function(t){return t.replace(/[A-Z]/g,(function(t){return"-"+t.toLowerCase()}))},n._CSS_IMAGE="gcchart-anno-image",n}(s);e.Image=c}((e=t.chart||(t.chart={})).annotation||(e.annotation={}))}(wijmo||(wijmo={})),function(t){var e;!function(e){"use strict";var n=function(){function n(e,n){var i=this;i._init(e),i._renderGroup(),i._bindTooltip(),n&&t.isArray(n)&&n.forEach((function(e){var n,o=e.type||"Circle";t.chart.annotation[o]&&(n=new t.chart.annotation[o](e),i._items.push(n))}))}return n.prototype._init=function(e){var n=this;n._items=new t.collections.ObservableArray,n._items.collectionChanged.addHandler(n._itemsChanged,n),n._chart=e,n._forceTTShowing=!1,n._annoTTShowing=!1,e.rendered.addHandler(n._renderAnnotations,n),e.lostFocus.addHandler(n._lostFocus,n)},n.prototype._lostFocus=function(t){this._toggleTooltip(this._tooltip,t,this._chart.hostElement)},Object.defineProperty(n.prototype,"items",{get:function(){return this._items},enumerable:!0,configurable:!0}),n.prototype.getItem=function(t){var e=this.getItems(t);return e.length>0?e[0]:null},n.prototype.getItems=function(t){var e=[];if(0===this._items.length||!t||""===t)return e;for(var n=0;n<this._items.length;n++)t===this._items[n].name&&e.push(this._items[n]);return e},n.prototype._bindTooltip=function(){var e,n=this,i=n._chart.hostElement,o=n._tooltip;o||(o=n._tooltip=new t.chart.ChartTooltip,e=t.Tooltip.prototype.hide,t.Tooltip.prototype.hide=function(){n._forceTTShowing||e.call(o)}),i&&(i.addEventListener("click",(function(t){n._toggleTooltip(o,t,i)})),document.addEventListener("mousemove",(function(t){n._showTooltip()&&n._toggleTooltip(o,t,i)})))},n.prototype._showTooltip=function(){return!this._chart.isTouching},n.prototype._toggleTooltip=function(e,n,i){var o=this,r=o._getAnnotation(n.target,i);if(r&&r.tooltip)o._forceTTShowing=!0,o._annoTTShowing=!0,e.show(o._layerEle,r.tooltip,new t.Rect(n.clientX,n.clientY,5,5));else{if(!o._annoTTShowing)return;o._annoTTShowing=!1,o._forceTTShowing=!1,e.hide()}},n.prototype._getAnnotation=function(t,n){var i=this._getAnnotationElement(t,n);return null==i?null:i[e.AnnotationBase._DATA_KEY]},n.prototype._getAnnotationElement=function(n,i){if(!n||!i)return null;var o=n.parentNode;return t.hasClass(n,e.AnnotationBase._CSS_ANNOTATION)?n:null==o||o===document.body||o===document||o===i?null:this._getAnnotationElement(o,i)},n.prototype._itemsChanged=function(e,n){var i=n.action,o=n.item;switch(i){case t.collections.NotifyCollectionChangedAction.Add:case t.collections.NotifyCollectionChangedAction.Change:o._layer=this,this._renderAnnotation(this._chart.renderEngine,o);break;case t.collections.NotifyCollectionChangedAction.Remove:this._destroyAnnotation(o);break;default:this._destroyAnnotations(),this._renderAnnotations(this._chart,new t.chart.RenderEventArgs(this._chart.renderEngine))}},n.prototype._renderAnnotations=function(t,e){var n,i=this.items,o=i.length;for(this._renderGroup(),n=0;n<o;n++)this._renderAnnotation(e.engine,i[n])},n.prototype._renderGroup=function(){var e=this,i=e._chart._plotRect,o=this._chart.renderEngine;i&&o&&(e._layerEle&&null!=e._layerEle.parentNode||(e._plotrectId="plotRect"+(1e6*Math.random()).toFixed(),o.addClipRect(new t.Rect(0,0,i.width,i.height),e._plotrectId),e._layerEle=o.startGroup(n._CSS_Layer,e._plotrectId),e._layerEle.setAttribute("transform","translate("+i.left+", "+i.top+")"),o.endGroup()))},n.prototype._renderAnnotation=function(t,e){this._layerEle&&null!=this._layerEle.parentNode&&(e._element&&e._element.parentNode==this._layerEle&&this._layerEle.removeChild(e._element),t.useSvg=!0,e.render(t),t.useSvg=!1,this._layerEle.appendChild(e._element))},n.prototype._destroyAnnotations=function(){var t,e=this.items,n=e.length;for(t=0;t<n;t++)this._destroyAnnotation(e[t]);this._layerEle.innerHTML=""},n.prototype._destroyAnnotation=function(t){this._layerEle&&this._layerEle.removeChild(t._element),t.destroy()},n._CSS_Layer="wj-chart-annotationlayer",n}();e.AnnotationLayer=n}((e=t.chart||(t.chart={})).annotation||(e.annotation={}))}(wijmo||(wijmo={})),function(t){var e;(e=t.chart||(t.chart={})).annotation||(e.annotation={}),t._registerModule("wijmo.chart.annotation",t.chart.annotation)}(wijmo||(wijmo={}));