import*as Classes from"./common/classes";import{Utils}from"./common/utils";export var RegionCardinality;!function(n){n.CELLS="cells",n.FULL_ROWS="full-rows",n.FULL_COLUMNS="full-columns",n.FULL_TABLE="full-table"}(RegionCardinality||(RegionCardinality={}));export var SelectionModes={ALL:[RegionCardinality.FULL_TABLE,RegionCardinality.FULL_COLUMNS,RegionCardinality.FULL_ROWS,RegionCardinality.CELLS],COLUMNS_AND_CELLS:[RegionCardinality.FULL_COLUMNS,RegionCardinality.CELLS],COLUMNS_ONLY:[RegionCardinality.FULL_COLUMNS],NONE:[],ROWS_AND_CELLS:[RegionCardinality.FULL_ROWS,RegionCardinality.CELLS],ROWS_ONLY:[RegionCardinality.FULL_ROWS]};export var ColumnLoadingOption;!function(n){n.CELLS="cells",n.HEADER="column-header"}(ColumnLoadingOption||(ColumnLoadingOption={}));export var RowLoadingOption;!function(n){n.CELLS="cells",n.HEADER="row-header"}(RowLoadingOption||(RowLoadingOption={}));export var TableLoadingOption;!function(n){n.CELLS="cells",n.COLUMN_HEADERS="column-header",n.ROW_HEADERS="row-header"}(TableLoadingOption||(TableLoadingOption={}));var Regions=function(){function n(){}return n.getRegionCardinality=function(n){return null!=n.cols&&null!=n.rows?RegionCardinality.CELLS:null!=n.cols?RegionCardinality.FULL_COLUMNS:null!=n.rows?RegionCardinality.FULL_ROWS:RegionCardinality.FULL_TABLE},n.getFocusCellCoordinatesFromRegion=function(r){switch(n.getRegionCardinality(r)){case RegionCardinality.FULL_TABLE:return{col:0,row:0};case RegionCardinality.FULL_COLUMNS:return{col:r.cols[0],row:0};case RegionCardinality.FULL_ROWS:return{col:0,row:r.rows[0]};case RegionCardinality.CELLS:return{col:r.cols[0],row:r.rows[0]};default:return null}},n.copy=function(r){var i=n.getRegionCardinality(r);return i===RegionCardinality.CELLS?n.cell(r.rows[0],r.cols[0],r.rows[1],r.cols[1]):i===RegionCardinality.FULL_COLUMNS?n.column(r.cols[0],r.cols[1]):i===RegionCardinality.FULL_ROWS?n.row(r.rows[0],r.rows[1]):n.table()},n.cell=function(n,r,i,o){return{cols:this.normalizeInterval(r,o),rows:this.normalizeInterval(n,i)}},n.row=function(n,r){return{rows:this.normalizeInterval(n,r)}},n.column=function(n,r){return{cols:this.normalizeInterval(n,r)}},n.table=function(){return{}},n.add=function(n,r){var i=n.slice();return i.push(r),i},n.update=function(n,r,i){var o=n.slice();return null!=i?o.splice(i,1,r):(o.pop(),o.push(r)),o},n.clampRegion=function(r,i,o){var l=n.copy(r);return null!=r.rows&&(l.rows[0]=Utils.clamp(r.rows[0],0,i),l.rows[1]=Utils.clamp(r.rows[1],0,i)),null!=r.cols&&(l.cols[0]=Utils.clamp(r.cols[0],0,o),l.cols[1]=Utils.clamp(r.cols[1],0,o)),l},n.lastRegionIsEqual=function(r,i){if(null==r||0===r.length)return!1;var o=r[r.length-1];return n.regionsEqual(o,i)},n.findMatchingRegion=function(r,i){if(null==r)return-1;for(var o=0;o<r.length;o++)if(n.regionsEqual(r[o],i))return o;return-1},n.findContainingRegion=function(r,i){if(null==r)return-1;for(var o=0;o<r.length;o++)if(n.regionContains(r[o],i))return o;return-1},n.hasFullColumn=function(r,i){if(null==r)return!1;for(var o=0,l=r;o<l.length;o++){var e=l[o],a=n.getRegionCardinality(e);if(a===RegionCardinality.FULL_TABLE)return!0;if(a===RegionCardinality.FULL_COLUMNS&&n.intervalContainsIndex(e.cols,i))return!0}return!1},n.hasFullRow=function(r,i){if(null==r)return!1;for(var o=0,l=r;o<l.length;o++){var e=l[o],a=n.getRegionCardinality(e);if(a===RegionCardinality.FULL_TABLE)return!0;if(a===RegionCardinality.FULL_ROWS&&n.intervalContainsIndex(e.rows,i))return!0}return!1},n.hasFullTable=function(r){if(null==r)return!1;for(var i=0,o=r;i<o.length;i++){var l=o[i];if(n.getRegionCardinality(l)===RegionCardinality.FULL_TABLE)return!0}return!1},n.containsRegion=function(r,i){return n.overlapsRegion(r,i,!1)},n.overlapsRegion=function(r,i,o){void 0===o&&(o=!1);var l=o?n.intervalOverlaps:n.intervalContains;if(null==r||null==i)return!1;for(var e=0,a=r;e<a.length;e++){var t=a[e];switch(n.getRegionCardinality(t)){case RegionCardinality.FULL_TABLE:return!0;case RegionCardinality.FULL_COLUMNS:if(l(t.cols,i.cols))return!0;continue;case RegionCardinality.FULL_ROWS:if(l(t.rows,i.rows))return!0;continue;case RegionCardinality.CELLS:if(l(t.cols,i.cols)&&l(t.rows,i.rows))return!0;continue}}return!1},n.eachUniqueFullColumn=function(r,i){if(null!=r&&0!==r.length&&null!=i){var o={};r.forEach((function(r){if(n.getRegionCardinality(r)===RegionCardinality.FULL_COLUMNS)for(var l=r.cols,e=l[0],a=l[1],t=e;t<=a;t++)o[t]||(o[t]=!0,i(t))}))}},n.eachUniqueFullRow=function(r,i){if(null!=r&&0!==r.length&&null!=i){var o={};r.forEach((function(r){if(n.getRegionCardinality(r)===RegionCardinality.FULL_ROWS)for(var l=r.rows,e=l[0],a=l[1],t=e;t<=a;t++)o[t]||(o[t]=!0,i(t))}))}},n.enumerateUniqueCells=function(r,i,o){if(null==r||0===r.length)return[];for(var l={},e=[],a=0,t=r;a<t.length;a++){var u=t[a];n.eachCellInRegion(u,i,o,(function(n,r){var i=n+"-"+r;!0!==l[i]&&(l[i]=!0,e.push([n,r]))}))}return e.sort(n.rowFirstComparator),e},n.getCellRegionFromRegion=function(r,i,o){switch(n.getRegionCardinality(r)){case RegionCardinality.FULL_TABLE:return n.cell(0,0,i-1,o-1);case RegionCardinality.FULL_COLUMNS:return n.cell(0,r.cols[0],i-1,r.cols[1]);case RegionCardinality.FULL_ROWS:return n.cell(r.rows[0],0,r.rows[1],o-1);case RegionCardinality.CELLS:return n.cell(r.rows[0],r.cols[0],r.rows[1],r.cols[1]);default:return null}},n.sparseMapCells=function(r,i){var o=n.getBoundingRegion(r);if(null==o)return null;var l=o.rows[1]+1-o.rows[0],e=o.cols[1]+1-o.cols[0],a=Utils.times(l,(function(){return new Array(e)}));return r.forEach((function(n){var r=n[0],l=n[1];a[r-o.rows[0]][l-o.cols[0]]=i(r,l)})),a},n.getBoundingRegion=function(n){for(var r,i,o,l,e=0,a=n;e<a.length;e++){var t=a[e],u=t[0],s=t[1];r=null==r||u<r?u:r,i=null==i||u>i?u:i,o=null==o||s<o?s:o,l=null==l||s>l?s:l}return null==r?null:{cols:[o,l],rows:[r,i]}},n.isValid=function(n){return!(null==n||null!=n.rows&&(n.rows[0]<0||n.rows[1]<0)||null!=n.cols&&(n.cols[0]<0||n.cols[1]<0))},n.isRegionValidForTable=function(n,r,i){return!(0===r||0===i||null!=n.rows&&!intervalInRangeInclusive(n.rows,0,r-1)||null!=n.cols&&!intervalInRangeInclusive(n.cols,0,i-1))},n.joinStyledRegionGroups=function(r,i,o){var l=[];return null!=i&&(l=l.concat(i)),null!=r&&r.length>0&&l.push({className:Classes.TABLE_SELECTION_REGION,regions:r}),null!=o&&l.push({className:Classes.TABLE_FOCUS_REGION,regions:[n.cell(o.row,o.col)]}),l},n.regionsEqual=function(r,i){return n.intervalsEqual(r.rows,i.rows)&&n.intervalsEqual(r.cols,i.cols)},n.expandRegion=function(r,i){var o=n.getRegionCardinality(r),l=n.getRegionCardinality(i);if(l!==o)return i;switch(l){case RegionCardinality.FULL_ROWS:var e=Math.min(r.rows[0],i.rows[0]),a=Math.max(r.rows[1],i.rows[1]);return n.row(e,a);case RegionCardinality.FULL_COLUMNS:var t=Math.min(r.cols[0],i.cols[0]),u=Math.max(r.cols[1],i.cols[1]);return n.column(t,u);case RegionCardinality.CELLS:return e=Math.min(r.rows[0],i.rows[0]),t=Math.min(r.cols[0],i.cols[0]),a=Math.max(r.rows[1],i.rows[1]),u=Math.max(r.cols[1],i.cols[1]),n.cell(e,t,a,u);default:return n.table()}},n.eachCellInRegion=function(r,i,o,l){switch(n.getRegionCardinality(r)){case RegionCardinality.FULL_TABLE:for(var e=0;e<i;e++)for(var a=0;a<o;a++)l(e,a);break;case RegionCardinality.FULL_COLUMNS:for(e=0;e<i;e++)for(a=r.cols[0];a<=r.cols[1];a++)l(e,a);break;case RegionCardinality.FULL_ROWS:for(e=r.rows[0];e<=r.rows[1];e++)for(a=0;a<o;a++)l(e,a);break;case RegionCardinality.CELLS:for(e=r.rows[0];e<=r.rows[1];e++)for(a=r.cols[0];a<=r.cols[1];a++)l(e,a)}},n.regionContains=function(r,i){return n.overlapsRegion([r],i,!1)},n.intervalsEqual=function(n,r){return null==n?null==r:null!=r&&n[0]===r[0]&&n[1]===r[1]},n.intervalContainsIndex=function(n,r){return null!=n&&n[0]<=r&&n[1]>=r},n.intervalContains=function(n,r){return null!=n&&null!=r&&n[0]<=r[0]&&r[1]<=n[1]},n.intervalOverlaps=function(n,r){return null!=n&&null!=r&&!(n[1]<r[0]||n[0]>r[1])},n.rowFirstComparator=function(n,r){var i=n[0]-r[0];return 0===i?n[1]-r[1]:i},n.numericalComparator=function(n,r){return n-r},n.normalizeInterval=function(r,i){null==i&&(i=r);var o=[r,i];return o.sort(n.numericalComparator),o},n}();export{Regions};function intervalInRangeInclusive(n,r,i){return inRangeInclusive(n[0],r,i)&&inRangeInclusive(n[1],r,i)}function inRangeInclusive(n,r,i){return n>=r&&n<=i}