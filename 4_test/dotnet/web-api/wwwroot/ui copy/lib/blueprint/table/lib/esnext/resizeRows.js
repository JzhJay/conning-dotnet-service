import{Utils}from"./common/utils";import{Locator}from"./locator";const resizeRowsByApproximateHeightDefaults={getApproximateCharWidth:8,getApproximateLineHeight:18,getCellHorizontalPadding:2*Locator.CELL_HORIZONTAL_PADDING,getNumBufferLines:1};function resolveResizeRowsByApproximateHeightOptions(e,t,o){return Object.keys(resizeRowsByApproximateHeightDefaults).reduce(((i,r)=>{const l=e?.[r];return i[r]="function"==typeof l?l(t,o):null!=l?l:resizeRowsByApproximateHeightDefaults[r],i}),{})}export function resizeRowsByApproximateHeight(e,t,o,i){const r=t.length,l=[];for(let n=0;n<e;n++){let e=0;for(let l=0;l<r;l++){const{getApproximateCharWidth:r,getApproximateLineHeight:s,getCellHorizontalPadding:a,getNumBufferLines:p}=resolveResizeRowsByApproximateHeightOptions(i,n,l),m=o(n,l),u=Utils.getApproxCellHeight(m,t[l],r,s,a,p);u>e&&(e=u)}l.push(e)}return l}export function resizeRowsByTallestCell(e,t,o,i,r){let l=0;if(null==r){const i=e.getColumnIndicesInRect(t);for(let e=i.columnIndexStart;e<=i.columnIndexEnd;e++)l=Math.max(l,o.getTallestVisibleCellInColumn(e))}else{const e=(Array.isArray(r)?r:[r]).map((e=>o.getTallestVisibleCellInColumn(e)));l=Math.max(...e)}return Array(i).fill(l)}