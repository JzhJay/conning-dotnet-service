/*! For license information please see wijmo.grid.xlsx.js.LICENSE.txt */
var wijmo,__extends=this&&this.__extends||function(){var e=function(t,o){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])},e(t,o)};return function(t,o){function l(){this.constructor=t}e(t,o),t.prototype=null===o?Object.create(o):(l.prototype=o.prototype,new l)}}();!function(e){var t,o;t=e.grid||(e.grid={}),(o=t.xlsx||(t.xlsx={})).softDetail=function(){return e._getModule("wijmo.grid.detail")},o.softMultiRow=function(){return e._getModule("wijmo.grid.multirow")},o.softTransposed=function(){return e._getModule("wijmo.grid.transposed")},o.softTransposedMultiRow=function(){return e._getModule("wijmo.grid.transposedmultirow")}}(wijmo||(wijmo={})),function(e){var t;!function(t){"use strict";var o=function(){function o(){}return o.save=function(t,o,l){var r=new e.xlsx.Workbook;return this._saveFlexGridToWorkbook(r,t,o,!1,null),l&&r.save(l),r},o.saveAsync=function(t,o,l,r,n,s,i){var a=this,u=new e.xlsx.Workbook;if(!i)return this._saveFlexGridToWorkbook(u,t,o,!1,null),l?u.saveAsync(l,(function(t){e.isFunction(r)&&r(t,u)}),n,null):e.isFunction(r)&&r(null,u),u;var d=null!=l;return this.cancelAsync((function(){var i,c=[t.collectionView&&t.collectionView.collectionChanged,t.columns&&t.columns.collectionChanged,t.rows&&t.rows.collectionChanged,t.resizedColumn,t.resizedRow],f=function(){return c.forEach((function(e){e&&e.removeHandler(h)}))},h=function(){a._cs&&a._cs.cancel(!1),clearTimeout(i),i=setTimeout((function(){f(),u=null,a.saveAsync(t,o,l,r,n,s)}),100)},p=function(){clearTimeout(i),a._cs=null,f()};a._cs=new e.xlsx._SyncPromise(null,p),c.forEach((function(e){e&&e.addHandler(h)})),a._saveFlexGridToWorkbook(u,t,o,!0,a._cs,(function(t){e.isFunction(s)&&s(d?Math.round(e.xlsx._map(t,0,100,0,50)):t)})).then((function(){l?(u._externalCancellation=function(){return a._cs},u.saveAsync(l,(function(t){p(),e.isFunction(r)&&r(t,u)}),(function(t){p(),e.isFunction(n)&&n(t)}),(function(t){e.isFunction(s)&&s(Math.round(e.xlsx._map(t,0,100,51,100)))}))):(p(),e.isFunction(s)&&s(100),e.isFunction(r)&&r(null,u))}),(function(e){throw p(),e}))})),null},o.cancelAsync=function(t){var o=this;this._cs?(this._cs.cancel(),setTimeout((function(){o._cs=null,e.isFunction(t)&&t()}),100)):e.isFunction(t)&&t()},o.load=function(t,o,l){var r=this;if(o instanceof Blob)s(o,(function(n){o=null;var s=new e.xlsx.Workbook;s.load(n),n=null,t.deferUpdate((function(){r._loadToFlexGrid(t,s,l),s=null}))}));else if(o instanceof e.xlsx.Workbook)t.deferUpdate((function(){r._loadToFlexGrid(t,o,l),o=null}));else{if(!(o instanceof ArrayBuffer||e.isString(o)))throw"Invalid workbook.";var n=new e.xlsx.Workbook;n.load(o),o=null,t.deferUpdate((function(){r._loadToFlexGrid(t,n,l),n=null}))}},o.loadAsync=function(t,o,l,r,n){var i=this;if(o instanceof Blob)s(o,(function(s){o=null;var a=new e.xlsx.Workbook;a.loadAsync(s,(function(){s=null,t.deferUpdate((function(){i._loadToFlexGrid(t,a,l),r&&r(a),a=null}))}),n)}));else if(o instanceof e.xlsx.Workbook)t.deferUpdate((function(){i._loadToFlexGrid(t,o,l),r&&r(o),o=null}));else{if(!(o instanceof ArrayBuffer||e.isString(o)))throw"Invalid workbook.";var a=new e.xlsx.Workbook;a.loadAsync(o,(function(){o=null,t.deferUpdate((function(){i._loadToFlexGrid(t,a,l),r&&r(a),a=null}))}),n)}},o._saveFlexGridToWorkbook=function(o,r,s,i,a,u){var d=new e.xlsx._SyncPromise(a),c=new e.xlsx.WorkSheet,f=!s||null==s.includeColumnHeaders||s.includeColumnHeaders,h=!(!s||null==s.includeRowHeaders)&&s.includeRowHeaders,p=l.Cache,g=s?s.includeColumns:null,x=s?s.formatItem:null,m=[];s&&(p=!1===e.asBoolean(s.includeCellStyles,!0)?l.None:!1===e.asBoolean(s.quickCellStyles,!0)?l.Regular:l.Cache);var w=p===l.Cache?new n(500):null;null==this.hasCssText&&(this.hasCssText="cssText"in document.body.style);var v,_=r.wj_sheetInfo;if(c.name=s?s.sheetName:"",c.visible=!s||!1!==s.sheetVisible,_&&_.tables&&_.tables.length>0)for(var y=0;y<_.tables.length;y++)c.tables.push(_.tables[y]);_||p===l.None&&!x||((v=document.createElement("div")).style.visibility="hidden",v.setAttribute(e.grid.FlexGrid._WJS_MEASURE,"true"),r.hostElement.appendChild(v));var b=h?r.rowHeaders.columns.length:0,C=this._getPerRowColumnsSettings(r,h?[r.topLeftCells,r.columnHeaders]:[r.columnHeaders]),T=C.cols,k=t.softMultiRow()&&r instanceof t.softMultiRow().MultiRow?this._getPerRowColumnsSettings(r,h?[r.rowHeaders,r.cells]:[r.cells],r.rowsPerItem).cols:null,S=T.length,R=[[r.topLeftCells,r.columnHeaders],[r.rowHeaders,r.cells],[r.bottomLeftCells,r.columnFooters]];f||R.shift();var W=R.map((function(e){return e[1].rows.length})).reduce((function(e,t){return e+t}));return T.length&&T[0].forEach((function(t,o){var l=C.bndCols[0][o];if(!(o>=b&&g)||g(l)){var r=new e.xlsx.WorkbookColumn;r._deserialize(t),c._addWorkbookColumn(r)}})),this._saveContentToWorksheet(a,i,Date.now(),0,{panels:R,panelIdx:0,globRowIdx:0,rowsOffset:0,totalRows:W},r,c,h,(function(t){return t==e.grid.CellType.Cell&&k?k:T}),p,v,m,w,g,x,(function(e){u(Math.round(e/W*100))}),(function(){var t=new e.xlsx.WorkbookFrozenPane;t.rows=f?r.frozenRows+S:r.frozenRows,t.columns=h?r.frozenColumns+b:r.frozenColumns,c.frozenPane=t,o._addWorkSheet(c),_||p===l.None&&!x||(r.hostElement.removeChild(v),m.forEach((function(e){return e.forEach((function(e){e&&e.parentElement&&e.parentElement.removeChild(e)}))}))),w&&w.clear(),o.activeWorksheet=s?s.activeWorksheet:null,d.resolve()})),d},o._saveContentToWorksheet=function(t,o,l,r,n,s,i,a,u,d,c,f,h,p,g,x,m){for(var w=this,v=d?20:200,_=function(_){if(t&&t.cancelled)return{value:void 0};if(o&&_-r>v&&Date.now()-l>100)return setTimeout((function(){t&&t.cancelled||(x(_),w._saveContentToWorksheet(t,o,Date.now(),_,n,s,i,a,u,d,c,f,h,p,g,x,m))}),0),{value:void 0};for(;_-n.rowsOffset>=n.panels[n.panelIdx][1].rows.length;)n.rowsOffset+=n.panels[n.panelIdx][1].rows.length,n.panelIdx++;var b=n.panels[n.panelIdx],C=b[0],T=b[1],k=_-n.rowsOffset,S=T.rows[k];if(T.cellType!==e.grid.CellType.Cell&&S.renderSize<=0||S instanceof e.grid._NewRowTemplate)return"continue";var R=0,W={},F=new e.xlsx.WorkbookRow,A=S instanceof e.grid.GroupRow,N=0;T.cellType===e.grid.CellType.Cell&&(A?N=S.level:s.rows.maxGroupLevel>-1&&(N=s.rows.maxGroupLevel+1));var B=u(T.cellType);a&&(R=y._parseFlexGridRowToSheetRow(C,W,k,0,B,d,c,f,h,A,N,p,g)),y._parseFlexGridRowToSheetRow(T,W,k,R,B,d,c,f,h,A,N,p,g),W.cells.length>0&&(F._deserialize(W),i._addWorkbookRow(F,n.globRowIdx)),n.globRowIdx++},y=this,b=r;b<n.totalRows;b++){var C=_(b);if("object"==typeof C)return C.value}e.isFunction(m)&&m()},o._loadToFlexGrid=function(o,l,r){if(t.softTransposedMultiRow()&&o instanceof t.softTransposedMultiRow().TransposedMultiRow)throw"Not supported.";r=r||{};var n,s=null!=o.wj_sheetInfo,i={},a=[],u=[],d={};o.itemsSource=null,o.columns.clear(),o.columnHeaders.rows.clear(),o.rows.clear(),o.frozenColumns=0,o.frozenRows=0;var c=null==r.sheetIndex||isNaN(r.sheetIndex)?0:r.sheetIndex;if(c<0||c>=l.sheets.length)throw"The sheet index option is out of the sheet range of current workbook.";if(null!=r.sheetName)for(var f=0;f<l.sheets.length;f++)if(r.sheetName===l.sheets[f].name){n=l.sheets[f];break}if(null!=(n=n||l.sheets[c]).rows){for(var h=this._getColumnCount(n.rows),p=this._getRowCount(n.rows,h),g=n.columns,x=0;x<h;x++)o.columns.push(new e.grid.Column),g[x]&&(isNaN(+g[x].width)||(o.columns[x].width=+g[x].width),g[x].visible||null==g[x].visible||(o.columns[x].visible=!!g[x].visible),g[x].style&&g[x].style.wordWrap&&(o.columns[x].wordWrap=g[x].style.wordWrap));var m,w=(null==r.includeColumnHeaders||r.includeColumnHeaders)&&n.rows.length>0,v=w?this._getColumnHeadersHeight(n):0,_=!1,y=[],b=n.frozenPane&&n.frozenPane.rows,C=n.frozenPane&&n.frozenPane.columns;b=e.isNumber(b)&&!isNaN(b)?b:null,C=e.isNumber(C)&&!isNaN(C)?C:null;for(var T=v;T<p;T++){var k=!1,S=null,R=n.rows[T];if(R)for(var W=T+1;W<n.rows.length;){var F=n.rows[W];if(F){(isNaN(R.groupLevel)&&!isNaN(F.groupLevel)||!isNaN(R.groupLevel)&&R.groupLevel<F.groupLevel)&&(k=!0);break}W++}if(k&&!n.summaryBelow)m&&(m.isCollapsed=_),(m=new e.grid.GroupRow).isReadOnly=!1,_=null!=R.collapsed&&R.collapsed,m.level=isNaN(R.groupLevel)?0:R.groupLevel,d[m.level]=_,this._checkParentCollapsed(d,m.level)&&m._setFlag(e.grid.RowColFlags.ParentCollapsed,!0),o.rows.push(m);else{var A=new e.grid.Row;R&&this._checkParentCollapsed(d,R.groupLevel)&&A._setFlag(e.grid.RowColFlags.ParentCollapsed,!0),o.rows.push(A)}for(R&&R.height&&!isNaN(R.height)&&(o.rows[T-v].height=R.height),x=0;x<h;x++)if(R){var N=R.cells[x],B=N?N.formula:null;B&&"="!==B[0]&&(B="="+B),N&&N.textRuns&&N.textRuns.length>0?(o.rows[T-v].isContentHtml=!0,o.setCellData(T-v,x,this._parseTextRunsToHTML(N.textRuns))):o.setCellData(T-v,x,B&&s?B:this._getItemValue(N)),k||this._setColumn(y,x,N);var D=T*h+x,M=N?N.style:null;if(M&&(S=(null==S||S)&&!!M.wordWrap,s)){var H=e.xlsx.Workbook._parseExcelFormat(N),I=void 0;if(M.hAlign)I=e.xlsx.Workbook._parseHAlignToString(e.asEnum(M.hAlign,e.xlsx.HAlign));else switch(this._getItemType(N)){case e.DataType.Number:I="right";break;case e.DataType.Boolean:I="center";break;default:I=H&&0===H.search(/[n,c,p]/i)?"right":"left"}if(i[D]={fontWeight:M.font&&M.font.bold?"bold":"none",fontStyle:M.font&&M.font.italic?"italic":"none",textDecoration:M.font&&M.font.underline?"underline":"none",textAlign:I,fontFamily:M.font&&M.font.family?M.font.family:"",fontSize:M.font&&M.font.size?M.font.size+"px":"",color:M.font&&M.font.color?M.font.color:"",backgroundColor:M.fill&&M.fill.color?M.fill.color:"",whiteSpace:M.wordWrap?"pre-wrap":"normal",format:H},M.borders&&(M.borders.left&&(this._parseBorderStyle(M.borders.left.style,"Left",i[D]),i[D].borderLeftColor=M.borders.left.color),M.borders.right&&(this._parseBorderStyle(M.borders.right.style,"Right",i[D]),i[D].borderRightColor=M.borders.right.color),M.borders.top&&(this._parseBorderStyle(M.borders.top.style,"Top",i[D]),i[D].borderTopColor=M.borders.top.color),M.borders.bottom&&(this._parseBorderStyle(M.borders.bottom.style,"Bottom",i[D]),i[D].borderBottomColor=M.borders.bottom.color)),M.fill&&M.fill.color){var E=i[D],z=M.borders,O=M.fill.color;z?(z.left&&z.left.color||(E.borderLeftColor=O),z.right&&z.right.color||x===C-1||(E.borderRightColor=O),z.top&&z.top.color||(E.borderTopColor=O),z.bottom&&z.bottom.color||T===b-1||(E.borderBottomColor=O)):(E.borderLeftColor=O,x!==C-1&&(E.borderRightColor=O),E.borderTopColor=O,T!==b-1&&(E.borderBottomColor=O))}M.font&&-1===u.indexOf(M.font.family)&&u.push(M.font.family)}s&&N&&e.isNumber(N.rowSpan)&&N.rowSpan>0&&e.isNumber(N.colSpan)&&N.colSpan>0&&(N.rowSpan>1||N.colSpan>1)&&a.push(new e.grid.CellRange(T,x,T+N.rowSpan-1,x+N.colSpan-1))}R&&(this._checkParentCollapsed(d,R.groupLevel)||R.visible||null==R.visible||(o.rows[T-v].visible=R.visible),o.rows[T-v].wordWrap=!!R.style&&!!R.style.wordWrap||!!S)}for(m&&(m.isCollapsed=_),null!=C&&(o.frozenColumns=C),null!=b&&(o.frozenRows=w&&b>0?b-1:b),x=0;x<o.columnHeaders.columns.length;x++){var j=y[x],L=o.columns[x];L.isRequired=!1,j&&(j.dataType===e.DataType.Boolean&&(L.dataType=j.dataType),L.format=j.format,L.align=j.hAlign,L.wordWrap=L.wordWrap||!!j.wordWrap)}for(f=0;f<Math.max(v,1);f++)o.columnHeaders.rows.push(new e.grid.Row);for(f=0;f<v;f++)for(var G=0;G<o.columnHeaders.columns.length;G++){var P=n.rows[f]?n.rows[f].cells[G]:null,V=P&&null!=P.value?P.value:"",U=o.columnHeaders.columns[G];if(V){var X=e.xlsx.Workbook._parseExcelFormat(P);V=e.Globalize.format(V,X)}U.header=U.header||V,o.columnHeaders.setCellData(f,G,V)}if(s){var q=null==r.sheetVisible||r.sheetVisible;o.wj_sheetInfo.name=n.name,o.wj_sheetInfo.visible=!0===q||!1!==n.visible,o.wj_sheetInfo.styledCells=i,o.wj_sheetInfo.mergedRanges=a,o.wj_sheetInfo.fonts=u,o.wj_sheetInfo.tables=n.tables}}},o._getColumnHeadersHeight=function(e){var t;if(!e||!(t=e.rows).length)return 0;if(!t[0])return 1;for(var o=0,l=1;o<t.length&&l>0;o++,l--){var r=t[o].cells.reduce((function(e,t){return Math.max(e,t.rowSpan||0)}),1);r>l&&(l=r)}return o},o._escapePlainText=function(e){return null==e?"":""===e?"'":e&&("'"===e[0]||e.length>1&&"="===e[0]&&"="===e[1])?"'"+e:e},o._parseFlexGridRowToSheetRow=function(o,n,s,i,a,u,d,c,f,h,p,g,x){var m=o.grid,w=m.wj_sheetInfo,v=o.rows[s],_=0,y=w&&w.evaluateFormula;null==v.recordIndex?o.cellType===e.grid.CellType.ColumnHeader&&o.rows.length>1&&(_=Math.min(s,a.length-1)):_=v.recordIndex,n.cells||(n.cells=[]),n.visible=v.isVisible,n.height=v.renderHeight||o.rows.defaultSize,n.groupLevel=p,h&&(n.collapsed=v.isCollapsed),v.wordWrap&&(n.style={wordWrap:v.wordWrap});for(var b,C=v.constructor===e.grid.Row||v.constructor===e.grid._NewRowTemplate||t.softTransposed()&&m instanceof t.softTransposed().TransposedGrid&&v instanceof e.grid.Row||t.softDetail()&&v.constructor===t.softDetail().DetailRow||t.softMultiRow()&&v.constructor===t.softMultiRow()._MultiRow||t.softTransposedMultiRow()&&v instanceof t.softTransposedMultiRow()._MultiRow,T=t.softDetail()&&v.constructor===t.softDetail().DetailRow,k=0;k<o.columns.length;k++){var S=void 0,R=void 0,W=void 0,F=1,A=1,N=!1,B=m._getBindingColumn(o,s,o.columns[k]),D=0;if(w&&o===m.cells){var M=s*o.columns.length+k;w.mergedRanges&&(S=this._getMergedRange(s,k,w.mergedRanges)),w.styledCells&&(R=w.styledCells[M])}else u!==l.None&&(W=this._getMeasureCell(o,k,d,c),R=(S=m.getMergedRange(o,s,k,!1))?this._getCellStyle(o,W,S.bottomRow,S.rightCol,f,!!x)||{}:this._getCellStyle(o,W,s,k,f,!!x)||{});if(S||(S=m.getMergedRange(o,s,k,!1)),S?s===S.topRow&&k===S.leftCol&&(A=S.bottomRow-S.topRow+1,F=this._getColSpan(o,S,g),N=!0):N=!0,!g||g(B)){var H=a[_]?a[_][k+i]:null,I=void 0,E=void 0,z=void 0,O=void 0,j=void 0,L=void 0,G=void 0;if(C||h){if(z=N?o.getCellData(s,k,!0):null,O=N?o.getCellData(s,k,!1):null,E=this._isFormula(z),I=null,j=e.isDate(O),R&&R.format?(L=R.format,/[hsmyt\:]/i.test(L)&&(j=!0),G=e.xlsx.Workbook._parseCellFormat(R.format,j)):H&&H.style&&H.style.format?(L=B.format,G=H.style.format):G=null,E&&null!=y&&e.isFunction(y)&&(I=y(z)),!G)if(j)G="m/d/yyyy";else if(e.isNumber(O)&&!B.dataMap)G=e.isInt(O)?"#,##0":"#,##0.00";else if(E){var P=z.toLowerCase();P.indexOf("now()")>-1?(G="m/d/yyyy h:mm",j=!0):P.indexOf("today()")>-1||P.indexOf("date(")>-1?(G="m/d/yyyy",j=!0):P.indexOf("time(")>-1&&(G="h:mm AM/PM",j=!0)}else G="General"}else z=N?m.columnHeaders.getCellData(0,k,!0):null,G="General";var V=void 0;e.isString(z)&&-1!==z.indexOf("<span")&&(V=this._parseToTextRuns(z),z=null);var U=this._parseCellStyle(R)||{};if(o===m.cells&&h&&v.hasChildren&&k===m.columns.firstVisibleIndex){var X=void 0;if(E&&null!=I?X=I:(z?X=z:N&&(X=v.getGroupHeader()),X&&(X=X.replace(/<\/?\w+>/g,"").replace(/&#39;/g,"'"))),null==X&&!R)continue;!(j=e.isDate(X))&&L&&"d"===L.toLowerCase()&&e.isInt(X)&&(G="0"),X=e.isString(X)?e.xlsx.Workbook._unescapeXML(X):X,k===m.columns.firstVisibleIndex&&m.treeIndent&&(D=p),b={value:X,isDate:j,formula:E?this._parseToExcelFormula(z,j):null,colSpan:F,rowSpan:A,style:this._extend(U,{format:G,font:{bold:!0},hAlign:e.xlsx.HAlign.Left,indent:D}),textRuns:V}}else{z=e.isString(z)?e.xlsx.Workbook._unescapeXML(z):z,O=e.isString(O)?e.xlsx.Workbook._unescapeXML(O):O,!j&&L&&"d"===L.toLowerCase()&&e.isInt(O)&&(G="0");var q;q=U&&U.hAlign?U.hAlign:H&&H.style&&null!=H.style.hAlign?e.asEnum(H.style.hAlign,e.xlsx.HAlign,!0):e.isDate(O)?e.xlsx.HAlign.Left:e.xlsx.HAlign.General,k!==m.columns.firstVisibleIndex||!m.treeIndent||q!==e.xlsx.HAlign.Left&&q!==e.xlsx.HAlign.General||(D=p),b={value:E?I:"General"!==G||""===z&&null==O?this._escapePlainText(O):this._escapePlainText(z),isDate:j,formula:E?this._parseToExcelFormula(z,j):null,colSpan:k<m.columns.firstVisibleIndex?1:F,rowSpan:A,style:this._extend(U,{format:G,hAlign:q,vAlign:A>1?o===m.cells||!1===m.centerHeadersVertically?e.xlsx.VAlign.Top:e.xlsx.VAlign.Center:null,indent:D}),textRuns:V}}if(x&&x(new r(o,new e.grid.CellRange(s,k),W,d,c,f,b)),T){var J=o.getCellElement(s,k);if(J){var K=v.detail;J.appendChild(K),e.Control.refreshAll(K)}}n.cells.push(b)}}return i+k},o._parseCellStyle=function(t,o){if(void 0===o&&(o=!1),null==t)return null;var l=t.fontSize;l=l?+l.substring(0,l.indexOf("px")):null,isNaN(l)&&(l=null);var r=t.whiteSpace;r=!!r&&r.indexOf("pre")>-1;var n=t.textAlign;return"start"===n&&(n="rtl"===t.direction?"right":"left"),"end"===n&&(n="rtl"===t.direction?"left":"right"),{font:{bold:"bold"===t.fontWeight||+t.fontWeight>=700,italic:"italic"===t.fontStyle,underline:"underline"===(t.textDecorationStyle||t.textDecoration),family:this._parseToExcelFontFamily(t.fontFamily),size:l,color:t.color},fill:{color:t.backgroundColor},borders:this._parseBorder(t,o),hAlign:e.xlsx.Workbook._parseStringToHAlign(n),wordWrap:r}},o._parseBorder=function(e,t){var o={left:this._parseEgdeBorder(e,"Left"),right:this._parseEgdeBorder(e,"Right"),top:this._parseEgdeBorder(e,"Top"),bottom:this._parseEgdeBorder(e,"Bottom")};return t&&(o.vertical=this._parseEgdeBorder(e,"Vertical"),o.horizontal=this._parseEgdeBorder(e,"Horizontal")),o},o._parseEgdeBorder=function(t,o){var l,r=t["border"+o+"Style"],n=t["border"+o+"Width"];if(n&&(n=parseFloat(n)),r&&"none"!==r&&"hidden"!==r&&0!==n){switch(l={},r=r.toLowerCase()){case"dotted":l.style=n>1?e.xlsx.BorderStyle.MediumDashDotted:e.xlsx.BorderStyle.Dotted;break;case"dashed":l.style=n>1?e.xlsx.BorderStyle.MediumDashed:e.xlsx.BorderStyle.Dashed;break;case"double":l.style=e.xlsx.BorderStyle.Double;break;default:l.style=n>2?e.xlsx.BorderStyle.Thick:n>1?e.xlsx.BorderStyle.Medium:e.xlsx.BorderStyle.Thin}l.color=t["border"+o+"Color"]}return l},o._parseBorderStyle=function(t,o,l){var r="border"+o+"Style",n="border"+o+"Width";switch(t){case e.xlsx.BorderStyle.Dotted:case e.xlsx.BorderStyle.Hair:l[r]="dotted",l[n]="1px";break;case e.xlsx.BorderStyle.Dashed:case e.xlsx.BorderStyle.ThinDashDotDotted:case e.xlsx.BorderStyle.ThinDashDotted:l[r]="dashed",l[n]="1px";break;case e.xlsx.BorderStyle.MediumDashed:case e.xlsx.BorderStyle.MediumDashDotDotted:case e.xlsx.BorderStyle.MediumDashDotted:case e.xlsx.BorderStyle.SlantedMediumDashDotted:l[r]="dashed",l[n]="2px";break;case e.xlsx.BorderStyle.Double:l[r]="double",l[n]="3px";break;case e.xlsx.BorderStyle.Medium:l[r]="solid",l[n]="2px";break;case e.xlsx.BorderStyle.Thick:l[r]="solid",l[n]="3px";break;default:l[r]="solid",l[n]="1px"}},o._parseToExcelFontFamily=function(e){var t;return e&&(t=e.split(","))&&t.length>0&&(e=t[0].replace(/\"|\'/g,"")),e},o._parseToExcelFormula=function(t,o){var l=t.match(/(floor|ceiling)\([+-]?\d+\.?\d*\)/gi);if(l)for(var r=0;r<l.length;r++){var n=(i=l[r]).substring(0,i.lastIndexOf(")"))+", 1)";t=t.replace(i,n)}if(l=null,l=t.match(/text\(\"?\w+\"?\s*\,\s*\"\w+\"\)/gi)){var s=/\"?\w+\"?\s*\,\s*\"(\w+)\"/i;for(r=0;r<l.length;r++){var i,a=(i=l[r]).match(s);if(a&&2===a.length){var u=a[1];if(!/^d{1,4}?$/.test(u)){var d=e.xlsx.Workbook._parseCellFormat(u,o);n=i.replace(u,d),t=t.replace(i,n)}}}}return t},o._parseToTextRuns=function(e){for(var t=e.split("<span "),o=[],l=0;l<t.length;l++){var r,n=t[l];r=-1!==n.indexOf("</span>")?{text:n.substring(n.indexOf(">")+1,n.indexOf("</span>")),font:this._parseToTextRunFont(n.substring(n.indexOf('style="')+7,n.indexOf(';"')))}:{text:n},o.push(r)}return o},o._parseToTextRunFont=function(e){var t,o=e.split(";");if(o.length>0){for(var l=void 0,r=void 0,n=void 0,s=void 0,i=void 0,a=void 0,u=0;u<o.length;u++){var d=o[u].split(":");if(2===d.length)switch(d[1]=d[1].trim(),d[0]){case"font-size":s=+d[1].substring(0,d[1].indexOf("px")),isNaN(s)&&(s=null);break;case"font-weight":l="bold"===d[1]||+d[1]>=700;break;case"font-style":r="italic"===d[1];break;case"text-decoration-style":case"text-decoration":n="underline"===d[1];break;case"font-family":i=this._parseToExcelFontFamily(d[1]);break;case"color":a=d[1]}}t={bold:l,italic:r,underline:n,family:i,size:s,color:a}}return t},o._getMeasureCell=function(e,t,o,l){var r=l[e.cellType],n=r&&r[t],s=null==n;return n?this.hasCssText&&(n.style.cssText="",n.style.visibility="hidden"):(r||(l[e.cellType]=r=[]),r[t]=n=o.cloneNode()),!s&&n.parentElement||(e.hostElement.children.length>0?e.hostElement.children[0].appendChild(n):e.hostElement.appendChild(n)),n},o._getColumnSetting=function(t,o,l){var r=t;return null!=t.colspan&&(r=this._getRenderColumn(o,l)),r?{autoWidth:!0,width:r.renderWidth||l.defaultSize,visible:r.visible&&0!==r.width&&!r._getFlag(e.grid.RowColFlags.ParentCollapsed),style:{format:t.format?e.xlsx.Workbook._parseCellFormat(t.format,t.dataType===e.DataType.Date):"",hAlign:e.xlsx.Workbook._parseStringToHAlign(this._toExcelHAlign(r.getAlignment())),wordWrap:r.wordWrap}}:null},o._getPerRowColumnsSettings=function(e,t,o){var l=this,r=[],n=[];return t.forEach((function(s,i){for(var a=0,u=i>0?t[0].columns.length:0,d=function(t){return null!=o&&t>=o?"break":s.rows[t].renderSize<=0?"continue":(r[a]=r[a]||[],n[a]=n[a]||[],s.columns.forEach((function(o,i){var d=e._getBindingColumn(s,t,o),c=l._getColumnSetting(d,i,s.columns);c&&(r[a][u+i]=c,n[a][u+i]=d)})),void a++)},c=0;c<s.rows.length&&"break"!==d(c);c++);})),{cols:r,bndCols:n}},o._toExcelHAlign=function(e){return(e=e?e.trim().toLowerCase():e)?e.indexOf("center")>-1?"center":e.indexOf("right")>-1||e.indexOf("end")>-1?"right":e.indexOf("justify")>-1?"justify":"left":e},o._getColumnCount=function(t){for(var o=0,l=0;l<t.length;l++){var r=t[l]&&t[l].cells?t[l].cells:[];if(r&&r.length>0){var n=r.length;e.isInt(r[n-1].colSpan)&&r[n-1].colSpan>1&&(n=n+r[n-1].colSpan-1),n>o&&(o=n)}}return o},o._getRowCount=function(t,o){for(var l=t.length,r=l-1,n=0;n<o;n++)e:for(;r>=0;r--){var s=t[r],i=(s&&s.cells?s.cells:[])[n];if(i&&(null!=i.value&&""!==i.value||e.isInt(i.rowSpan)&&i.rowSpan>1)){e.isInt(i.rowSpan)&&i.rowSpan>1&&r+i.rowSpan>l&&(l=r+i.rowSpan);break e}}return l},o._numAlpha=function(e){var t=Math.floor(e/26)-1;return(t>-1?this._numAlpha(t):"")+String.fromCharCode(65+e%26)},o._getItemType=function(t){return null==t||null==t.value||isNaN(t.value)?null:e.getType(t.value)},o._setColumn=function(t,o,l){var r=t[o];if(r){var n=this._getItemType(l);if(r.dataType!==n&&r.dataType===e.DataType.Boolean&&n!==e.DataType.Boolean&&(r.dataType=n),l&&null!=l.value&&(!e.isString(l.value)||!e.isNullOrWhiteSpace(l.value))){var s=e.xlsx.Workbook._parseExcelFormat(l);s&&r.format!==s&&"General"!==s&&(r.format=s)}var i=void 0;l&&l.style&&(l.style.hAlign&&(i=e.xlsx.Workbook._parseHAlignToString(e.asEnum(l.style.hAlign,e.xlsx.HAlign))),null==r.wordWrap?r.wordWrap=!!l.style.wordWrap:r.wordWrap=r.wordWrap&&!!l.style.wordWrap),i||n!==e.DataType.Number||(i="right"),r.hAlign=i}else t[o]={dataType:this._getItemType(l),format:e.xlsx.Workbook._parseExcelFormat(l),hAlign:"",wordWrap:null}},o._getItemValue=function(t){if(null==t||null==t.value)return null;var o=t.value;return e.isString(o)&&"'"===o[0]&&(o=o.substr(1)),e.isNumber(o)&&isNaN(o)||o instanceof Date&&isNaN(o.getTime())?"":o},o._getCellStyle=function(e,t,o,l,r,n){var s,i=e.grid;try{var a=!(r&&!i.formatItem.hasHandlers&&!i.itemFormatter&&!n);i.cellFactory.updateCell(e,o,l,t,null,a),t.className=t.className.replace("wj-state-selected",""),t.className=t.className.replace("wj-state-multi-selected","")}catch(e){return null}if(r){var u=e.hostElement,d=t,c=d.style.cssText.split(/;\s+/).filter((function(e){var t=e.substring(0,e.indexOf(":"));return/^(color|background|border|font|text|whitespace)/i.test(t)})).join(";");do{c=d.className+c}while(d!==u&&(d=d.parentElement));(s=r.getValue(c))||(s=window.getComputedStyle(t),r.add(c,s))}else s=window.getComputedStyle(t);return s},o._parseTextRunsToHTML=function(e){for(var t="",o=0;o<e.length;o++){var l=e[o],r=l.font;t+=r?'<span style="'+(r.bold?"font-weight: bold;":"")+(r.italic?"font-style: italic;":"")+(r.underline?"text-decoration: underline;":"")+(r.family?"font-family: "+r.family+";":"")+(null!=r.size?"font-size: "+r.size+"px;":"")+(r.color?"color: "+r.color+";":"")+'">'+l.text+"</span>":l.text}return t},o._extend=function(t,o){for(var l in o){var r=o[l];e.isObject(r)&&t[l]?e.copy(t[l],r):t[l]=r}return t},o._checkParentCollapsed=function(e,t){var o=!1;return Object.keys(e).forEach((function(l){!0===e[l]&&!1===o&&!isNaN(t)&&+l<t&&(o=!0)})),o},o._getColSpan=function(e,t,o){for(var l=0,r=t.leftCol;r<=t.rightCol;r++)o&&!o(e.columns[r])||l++;return l},o._getRenderColumn=function(e,t){return e>=t.length?null:t[e]},o._getMergedRange=function(e,t,o){for(var l=0;l<o.length;l++){var r=o[l];if(e>=r.topRow&&e<=r.bottomRow&&t>=r.leftCol&&t<=r.rightCol)return r}return null},o._isFormula=function(e){return e&&"string"==typeof e&&e.length>1&&"="===e[0]&&"="!==e[1]},o}();t.FlexGridXlsxConverter=o;var l,r=function(e){function t(t,o,l,r,n,s,i){var a=e.call(this,t,o)||this;return a._cell=l,a._patternCell=r,a._xlsxCell=i,a._cellsCache=n,a._styleCache=s,a}return __extends(t,e),Object.defineProperty(t.prototype,"cell",{get:function(){return this._cell},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"xlsxCell",{get:function(){return this._xlsxCell},set:function(e){this._xlsxCell=e},enumerable:!0,configurable:!0}),t.prototype.getFormattedCell=function(){return this._cell||(this._cell=o._getMeasureCell(this.panel,this.col,this._patternCell,this._cellsCache),o._getCellStyle(this.panel,this._cell,this.row,this.col,this._styleCache,!0)),this._cell},t}(e.grid.CellRangeEventArgs);t.XlsxFormatItemEventArgs=r,function(e){e[e.None=0]="None",e[e.Regular=1]="Regular",e[e.Cache=2]="Cache"}(l||(l={}));var n=function(){function e(e){this._cache={},this._size=0,this._max=e}return e.prototype.add=function(e,t){this._size>=this._max&&this.clear(),this._cache[e]=this._cloneStyle(t),this._size++},e.prototype.clear=function(){this._cache={},this._size=0},e.prototype.getValue=function(e){return this._cache[e]||null},e.prototype.hasKey=function(e){return!!this._cache[e]},e.prototype._cloneStyle=function(e){if(!e)return null;for(var t={},o=function(e){return e.replace(/\-([a-z])/g,(function(e,t,o){return o>0?t.toUpperCase():t}))},l=0,r=e.length;l<r;l++){var n=e[l];t[o(n)]=e.getPropertyValue(n)}return t},e}();function s(e,t){if(e&&t)if(e.arrayBuffer)e.arrayBuffer().then((function(e){return t(e)}));else{var o=new FileReader;o.onload=function(){t(o.result),o=null},o.readAsArrayBuffer(e)}}t._StyleCache=n,t._blobToBuffer=s}((t=e.grid||(e.grid={})).xlsx||(t.xlsx={}))}(wijmo||(wijmo={})),function(e){var t;(t=e.grid||(e.grid={})).xlsx||(t.xlsx={}),e._registerModule("wijmo.grid.xlsx",e.grid.xlsx)}(wijmo||(wijmo={}));