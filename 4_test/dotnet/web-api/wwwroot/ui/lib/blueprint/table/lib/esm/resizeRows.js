import{Utils}from"./common/utils";import{Locator}from"./locator";var resizeRowsByApproximateHeightDefaults={getApproximateCharWidth:8,getApproximateLineHeight:18,getCellHorizontalPadding:2*Locator.CELL_HORIZONTAL_PADDING,getNumBufferLines:1};function resolveResizeRowsByApproximateHeightOptions(e,t,r){return Object.keys(resizeRowsByApproximateHeightDefaults).reduce((function(i,o){var l=null==e?void 0:e[o];return i[o]="function"==typeof l?l(t,r):null!=l?l:resizeRowsByApproximateHeightDefaults[o],i}),{})}export function resizeRowsByApproximateHeight(e,t,r,i){for(var o=t.length,l=[],a=0;a<e;a++){for(var n=0,s=0;s<o;s++){var p=resolveResizeRowsByApproximateHeightOptions(i,a,s),u=p.getApproximateCharWidth,m=p.getApproximateLineHeight,g=p.getCellHorizontalPadding,f=p.getNumBufferLines,h=r(a,s),x=Utils.getApproxCellHeight(h,t[s],u,m,g,f);x>n&&(n=x)}l.push(n)}return l}export function resizeRowsByTallestCell(e,t,r,i,o){var l=0;if(null==o)for(var a=e.getColumnIndicesInRect(t),n=a.columnIndexStart;n<=a.columnIndexEnd;n++)l=Math.max(l,r.getTallestVisibleCellInColumn(n));else{var s=(Array.isArray(o)?o:[o]).map((function(e){return r.getTallestVisibleCellInColumn(e)}));l=Math.max.apply(Math,s)}return Array(i).fill(l)}