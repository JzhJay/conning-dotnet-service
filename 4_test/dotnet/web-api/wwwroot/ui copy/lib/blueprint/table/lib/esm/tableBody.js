import{__assign,__extends}from"tslib";import classNames from"classnames";import*as React from"react";import{AbstractComponent2,Utils as CoreUtils}from"@blueprintjs/core";import*as Classes from"./common/classes";import{ContextMenuTargetWrapper}from"./common/contextMenuTargetWrapper";import{RenderMode}from"./common/renderMode";import{MenuContext}from"./interactions/menus";import{DragSelectable}from"./interactions/selectable";import{Regions}from"./regions";import{cellClassNames,TableBodyCells}from"./tableBodyCells";var DEEP_COMPARE_KEYS=["selectedRegions"],TableBody=function(e){function o(){var o=null!==e&&e.apply(this,arguments)||this;return o.renderContextMenu=function(e){var t=o.props,n=t.grid,r=t.onFocusedCell,l=t.onSelection,s=t.bodyContextMenuRenderer,i=t.selectedRegions,a=n.numRows,c=n.numCols;if(null!=s){var p=o.locateClick(e.nativeEvent),d=i;Regions.findContainingRegion(i,p)<0&&(l(d=[p]),r(__assign(__assign({},Regions.getFocusCellCoordinatesFromRegion(p)),{focusSelectionIndex:0})));var u=s(new MenuContext(p,d,a,c));return null==u?void 0:u}},o.handleSelectionEnd=function(){o.activationCell=null},o.locateClick=function(e){return o.activationCell=o.props.locator.convertPointToCell(e.clientX,e.clientY),Regions.cell(o.activationCell.row,o.activationCell.col)},o.locateDrag=function(e,t,n){void 0===n&&(n=!1);var r=o.activationCell,l=o.props.locator.convertPointToCell(t.current[0],t.current[1]);return n?Regions.cell(l.row,l.col):Regions.cell(r.row,r.col,l.row,l.col)},o}return __extends(o,e),o.cellClassNames=function(e,o){return cellClassNames(e,o)},o.prototype.shouldComponentUpdate=function(e){return!CoreUtils.shallowCompareKeys(this.props,e,{exclude:DEEP_COMPARE_KEYS})||!CoreUtils.deepCompareKeys(this.props,e,DEEP_COMPARE_KEYS)},o.prototype.render=function(){var e=this.props,o=e.grid,t=e.numFrozenColumns,n=e.numFrozenRows,r=o.getRect().sizeStyle(),l={height:null!=n?o.getCumulativeHeightAt(n-1):r.height,width:null!=t?o.getCumulativeWidthAt(t-1):r.width};return React.createElement(DragSelectable,{enableMultipleSelection:this.props.enableMultipleSelection,focusedCell:this.props.focusedCell,locateClick:this.locateClick,locateDrag:this.locateDrag,onFocusedCell:this.props.onFocusedCell,onSelection:this.props.onSelection,onSelectionEnd:this.handleSelectionEnd,selectedRegions:this.props.selectedRegions,selectedRegionTransform:this.props.selectedRegionTransform},React.createElement(ContextMenuTargetWrapper,{className:classNames(Classes.TABLE_BODY_VIRTUAL_CLIENT,Classes.TABLE_CELL_CLIENT),renderContextMenu:this.renderContextMenu,style:l},React.createElement(TableBodyCells,{cellRenderer:this.props.cellRenderer,focusedCell:this.props.focusedCell,grid:o,loading:this.props.loading,onCompleteRender:this.props.onCompleteRender,renderMode:this.props.renderMode,columnIndexStart:this.props.columnIndexStart,columnIndexEnd:this.props.columnIndexEnd,rowIndexStart:this.props.rowIndexStart,rowIndexEnd:this.props.rowIndexEnd,viewportRect:this.props.viewportRect})))},o.defaultProps={loading:!1,renderMode:RenderMode.BATCH},o}(AbstractComponent2);export{TableBody};