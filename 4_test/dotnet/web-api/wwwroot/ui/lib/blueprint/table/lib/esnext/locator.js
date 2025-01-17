import*as Classes from"./common/classes";import{Rect}from"./common/rect";import{Utils}from"./common/utils";export class Locator{constructor(t,e,l){this.tableElement=t,this.scrollContainerElement=e,this.cellContainerElement=l,this.convertCellIndexToClientX=t=>this.grid.getCumulativeWidthAt(t),this.convertCellMidpointToClientX=t=>(this.grid.getCumulativeWidthBefore(t)+this.grid.getCumulativeWidthAt(t))/2,this.convertCellIndexToClientY=t=>this.grid.getCumulativeHeightAt(t),this.convertCellMidpointToClientY=t=>(this.grid.getCumulativeHeightBefore(t)+this.grid.getCumulativeHeightAt(t))/2,this.toGridX=t=>{const e=this.cellContainerElement.getBoundingClientRect().left,l=this.scrollContainerElement.scrollLeft,n=t-(e+l);return null!=this.numFrozenColumns&&this.numFrozenColumns>0&&n<=this.grid.getCumulativeWidthBefore(this.numFrozenColumns)?n:n+l},this.toGridY=t=>{const e=this.cellContainerElement.getBoundingClientRect().top,l=this.scrollContainerElement.scrollTop,n=t-(e+l);return null!=this.numFrozenRows&&this.numFrozenRows>0&&n<=this.grid.getCumulativeHeightBefore(this.numFrozenRows)?n:n+l},this.numFrozenRows=0,this.numFrozenColumns=0}setGrid(t){return this.grid=t,this}setNumFrozenRows(t){return this.numFrozenRows=t,this}setNumFrozenColumns(t){return this.numFrozenColumns=t,this}getViewportRect(){return new Rect(this.scrollContainerElement.scrollLeft||0,this.scrollContainerElement.scrollTop||0,this.scrollContainerElement.clientWidth,this.scrollContainerElement.clientHeight)}getWidestVisibleCellInColumn(t){const e=this.getColumnCellSelector(t),l=this.tableElement.querySelectorAll(e);let n=0;for(let t=0;t<l.length;t++){const e=Utils.measureElementTextContent(l.item(t)).width,i=Math.ceil(e)+2*Locator.CELL_HORIZONTAL_PADDING;i>n&&(n=i)}return n}getTallestVisibleCellInColumn(t){const e=this.getColumnCellSelector(t),l=this.tableElement.querySelectorAll(`${e}.${Classes.TABLE_CELL}`);let n=0;for(let t=0;t<l.length;t++){const e=l.item(t),i=e.querySelector(`.${Classes.TABLE_TRUNCATED_VALUE}`),o=e.querySelector(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`),s=e.querySelector(`.${Classes.TABLE_TRUNCATED_TEXT}`);let r=0;r=null!=i?i.scrollHeight:null!=o?o.scrollHeight:null!=s?s.scrollHeight:e.scrollHeight,r>n&&(n=r)}return n}convertPointToColumn(t,e){if(!this.getTableRect().containsX(t))return-1;const l=this.toGridX(t),n=e?this.grid.numCols:this.grid.numCols-1,i=e?this.convertCellMidpointToClientX:this.convertCellIndexToClientX;return Utils.binarySearch(l,n,i)}convertPointToRow(t,e){if(!this.getTableRect().containsY(t))return-1;const l=this.toGridY(t),n=e?this.grid.numRows:this.grid.numRows-1,i=e?this.convertCellMidpointToClientY:this.convertCellIndexToClientY;return Utils.binarySearch(l,n,i)}convertPointToCell(t,e){const l=this.toGridX(t),n=this.toGridY(e);return{col:Utils.binarySearch(l,this.grid.numCols-1,this.convertCellIndexToClientX),row:Utils.binarySearch(n,this.grid.numRows-1,this.convertCellIndexToClientY)}}getColumnCellSelector(t){return`.${t<this.numFrozenColumns?Classes.TABLE_QUADRANT_LEFT:Classes.TABLE_QUADRANT_MAIN} .${Classes.columnCellIndexClass(t)}`}getTableRect(){return Rect.wrap(this.tableElement.getBoundingClientRect())}}Locator.CELL_HORIZONTAL_PADDING=10;