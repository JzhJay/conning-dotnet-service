"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderDefaultRowHeader=exports.RowHeader=void 0;var tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),Classes=tslib_1.__importStar(require("../common/classes")),resizeHandle_1=require("../interactions/resizeHandle"),regions_1=require("../regions"),header_1=require("./header"),rowHeaderCell_1=require("./rowHeaderCell"),RowHeader=function(e){function r(){var r=null!==e&&e.apply(this,arguments)||this;return r.wrapCells=function(e){var t=r.props,n=t.rowIndexStart,o=t.grid.getRect().height,s=r.props.grid.getCumulativeHeightBefore(n),i={height:o-s,transform:"translateY("+(s||0)+"px)"};return React.createElement("div",{style:{height:o}},React.createElement("div",{className:Classes.TABLE_ROW_HEADERS_CELLS_CONTAINER,style:i},e))},r.convertPointToRow=function(e,t){var n=r.props.locator;return null!=n?n.convertPointToRow(e,t):null},r.getCellExtremaClasses=function(e,t){return r.props.grid.getExtremaClasses(e,0,t,1)},r.getRowHeight=function(e){return r.props.grid.getRowRect(e).height},r.getDragCoordinate=function(e){return e[1]},r.getMouseCoordinate=function(e){return e.clientY},r.handleResizeEnd=function(e,t){r.props.onResizeGuide(null),r.props.onRowHeightChanged(e,t)},r.handleSizeChanged=function(e,t){var n=r.props.grid.getRowRect(e);r.props.onResizeGuide([n.top+t])},r.isCellSelected=function(e){return regions_1.Regions.hasFullRow(r.props.selectedRegions,e)},r.isGhostIndex=function(e){return r.props.grid.isGhostIndex(e,-1)},r.renderGhostCell=function(e,t){var n=r.props.grid.getGhostCellRect(e,0);return React.createElement(rowHeaderCell_1.RowHeaderCell,{className:classnames_1.default(t),index:e,key:Classes.rowIndexClass(e),loading:r.props.loading,style:{height:n.height+"px"}})},r.toRegion=function(e,r){return regions_1.Regions.row(e,r)},r}return tslib_1.__extends(r,e),r.prototype.render=function(){var e=this.props,r=(e.onRowHeightChanged,e.rowHeaderCellRenderer),t=e.minRowHeight,n=e.maxRowHeight,o=(e.defaultRowHeight,e.rowIndexStart),s=e.rowIndexEnd,i=tslib_1.__rest(e,["onRowHeightChanged","rowHeaderCellRenderer","minRowHeight","maxRowHeight","defaultRowHeight","rowIndexStart","rowIndexEnd"]);return React.createElement(header_1.Header,tslib_1.__assign({convertPointToIndex:this.convertPointToRow,fullRegionCardinality:regions_1.RegionCardinality.FULL_ROWS,getCellExtremaClasses:this.getCellExtremaClasses,getCellIndexClass:Classes.rowCellIndexClass,getCellSize:this.getRowHeight,getDragCoordinate:this.getDragCoordinate,getIndexClass:Classes.rowIndexClass,getMouseCoordinate:this.getMouseCoordinate,ghostCellRenderer:this.renderGhostCell,handleResizeEnd:this.handleResizeEnd,handleSizeChanged:this.handleSizeChanged,headerCellIsReorderablePropName:"enableRowReordering",headerCellIsSelectedPropName:"isRowSelected",headerCellRenderer:r,indexEnd:s,indexStart:o,isCellSelected:this.isCellSelected,isGhostIndex:this.isGhostIndex,maxSize:n,minSize:t,resizeOrientation:resizeHandle_1.Orientation.HORIZONTAL,selectedRegions:[],toRegion:this.toRegion,wrapCells:this.wrapCells},i))},r.defaultProps={rowHeaderCellRenderer:renderDefaultRowHeader},r}(React.Component);function renderDefaultRowHeader(e){return React.createElement(rowHeaderCell_1.RowHeaderCell,{index:e,name:""+(e+1)})}exports.RowHeader=RowHeader,exports.renderDefaultRowHeader=renderDefaultRowHeader;