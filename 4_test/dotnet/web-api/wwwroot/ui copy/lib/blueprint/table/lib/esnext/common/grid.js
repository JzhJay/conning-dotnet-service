import{RegionCardinality,Regions}from"../regions";import*as Classes from"./classes";import{Rect}from"./rect";import{Utils}from"./utils";export class Grid{constructor(t,i,e=Grid.DEFAULT_BLEED,s=Grid.DEFAULT_GHOST_HEIGHT,n=Grid.DEFAULT_GHOST_WIDTH){this.getCumulativeWidthBefore=t=>0===t?0:this.getCumulativeWidthAt(t-1),this.getCumulativeWidthAt=t=>0===this.numCols?this.ghostWidth*t:t>=this.numCols?this.cumulativeColumnWidths[this.numCols-1]+this.ghostWidth*(t-this.numCols+1):this.cumulativeColumnWidths[t],this.getCumulativeHeightBefore=t=>0===t?0:this.getCumulativeHeightAt(t-1),this.getCumulativeHeightAt=t=>0===this.numRows?this.ghostHeight*t:t>=this.numRows?this.cumulativeRowHeights[this.numRows-1]+this.ghostHeight*(t-this.numRows+1):this.cumulativeRowHeights[t],this.columnWidths=i,this.rowHeights=t,this.cumulativeColumnWidths=Utils.accumulate(i),this.cumulativeRowHeights=Utils.accumulate(t),this.numCols=i.length,this.numRows=t.length,this.bleed=e,this.ghostHeight=s,this.ghostWidth=n}getCellRect(t,i){const e=this.rowHeights[t],s=this.cumulativeRowHeights[t]-e,n=this.columnWidths[i],h=this.cumulativeColumnWidths[i]-n;return new Rect(h,s,n,e)}getGhostCellRect(t,i){let e=0,s=0,n=0,h=0;return t>=this.rowHeights.length?(h=this.ghostHeight,s=this.getHeight()+this.ghostHeight*(t-this.numRows)):(h=this.rowHeights[t],s=this.cumulativeRowHeights[t]-h),i>=this.columnWidths.length?(n=this.ghostWidth,e=this.getWidth()+this.ghostWidth*(i-this.numCols)):(n=this.columnWidths[i],e=this.cumulativeColumnWidths[i]-n),new Rect(e,s,n,h)}getRowRect(t){const i=this.rowHeights[t],e=this.cumulativeRowHeights[t]-i;return new Rect(0,e,this.getWidth(),i)}getColumnRect(t){const i=this.columnWidths[t],e=this.cumulativeColumnWidths[t]-i;return new Rect(e,0,i,this.getHeight())}getWidth(){return 0===this.numCols?0:this.cumulativeColumnWidths[this.numCols-1]}getHeight(){return 0===this.numRows?0:this.cumulativeRowHeights[this.numRows-1]}getRect(){return new Rect(0,0,this.getWidth(),this.getHeight())}mapCellsInRect(t,i){const e=[];if(null==t)return e;const{rowIndexStart:s,rowIndexEnd:n}=this.getRowIndicesInRect(t),{columnIndexStart:h,columnIndexEnd:o}=this.getColumnIndicesInRect(t);for(let t=s;t<=n;t++)for(let s=h;s<=o;s++)e.push(i(t,s));return e}mapRowsInRect(t,i){const e=[];if(null==t)return e;const{rowIndexStart:s,rowIndexEnd:n}=this.getRowIndicesInRect(t);for(let t=s;t<=n;t++)e.push(i(t));return e}mapColumnsInRect(t,i){const e=[];if(null==t)return e;const{columnIndexStart:s,columnIndexEnd:n}=this.getColumnIndicesInRect(t);for(let t=s;t<=n;t++)e.push(i(t));return e}getRowIndicesInRect(t,i=!1,e=Grid.DEFAULT_MAX_ROWS){if(null==t)return{rowIndexEnd:0,rowIndexStart:0};const s=i?Math.max(this.numRows,Grid.DEFAULT_MAX_ROWS):this.numRows,{top:n=0,height:h}=t,{start:o,end:l}=this.getIndicesInInterval(n,n+h,s,!i,this.getCumulativeHeightAt);return{rowIndexEnd:e>0&&l-o>e?o+e:l,rowIndexStart:o}}getColumnIndicesInRect(t,i=!1,e=Grid.DEFAULT_MAX_COLUMNS){if(null==t)return{columnIndexEnd:0,columnIndexStart:0};const s=i?Math.max(this.numCols,Grid.DEFAULT_MAX_COLUMNS):this.numCols,{left:n=0,width:h}=t,{start:o,end:l}=this.getIndicesInInterval(n,n+h,s,!i,this.getCumulativeWidthAt);return{columnIndexEnd:e>0&&l-o>e?o+e:l,columnIndexStart:o}}isGhostIndex(t,i){return t>=this.numRows||i>=this.numCols}isGhostColumn(t){return t>=this.numCols}getExtremaClasses(t,i,e,s){return t===e&&i===s?[Classes.TABLE_LAST_IN_COLUMN,Classes.TABLE_LAST_IN_ROW]:t===e?[Classes.TABLE_LAST_IN_COLUMN]:i===s?[Classes.TABLE_LAST_IN_ROW]:[]}getRegionStyle(t){switch(Regions.getRegionCardinality(t)){case RegionCardinality.CELLS:{const[i,e]=t.rows,[s,n]=t.cols;if(this.isGhostIndex(i,s)||this.isGhostIndex(e,n))return{display:"none"};const h=this.getCellRect(i,s),o=this.getCellRect(e,n),l=0===s?0:1,u=0===i?0:1,r=h.union(o);return r.height+=u,r.left-=l,r.width+=l,r.top-=u,{...r.style(),display:"block"}}case RegionCardinality.FULL_COLUMNS:{const[i,e]=t.cols;if(this.isGhostIndex(0,i)||this.isGhostIndex(0,e))return{display:"none"};const s=this.getCellRect(0,i),n=this.getCellRect(0,e),h=s.union(n),o=0===i?0:1;return{bottom:0,display:"block",left:h.left-o,top:0,width:h.width+o}}case RegionCardinality.FULL_ROWS:{const[i,e]=t.rows;if(this.isGhostIndex(i,0)||this.isGhostIndex(e,0))return{display:"none"};const s=this.getCellRect(i,0),n=this.getCellRect(e,0),h=s.union(n),o=0===i?0:1;return{display:"block",height:h.height+o,left:0,right:0,top:h.top-o}}case RegionCardinality.FULL_TABLE:return{bottom:0,display:"block",left:0,right:0,top:0};default:return{display:"none"}}}getIndicesInInterval(t,i,e,s,n){let h=Utils.binarySearch(t,e-1,n),o=Utils.binarySearch(i,e-1,n);return h>=0&&t===n(h)&&(h+=1),h=Math.max(0,h-this.bleed),o=s?Math.min(e-1,o+this.bleed):Math.min(e-1,o),{start:h,end:o}}}Grid.DEFAULT_BLEED=3,Grid.DEFAULT_MAX_COLUMNS=50,Grid.DEFAULT_MAX_ROWS=200,Grid.DEFAULT_GHOST_HEIGHT=20,Grid.DEFAULT_GHOST_WIDTH=150;