import{__extends}from"tslib";import classNames from"classnames";import*as React from"react";import*as Classes from"../common/classes";import{Draggable}from"./draggable";export var Orientation;!function(e){e[e.HORIZONTAL=1]="HORIZONTAL",e[e.VERTICAL=0]="VERTICAL"}(Orientation||(Orientation={}));var ResizeHandle=function(e){function o(){var o=null!==e&&e.apply(this,arguments)||this;return o.state={isDragging:!1},o.handleActivate=function(e){return o.setState({isDragging:!0}),o.props.onLayoutLock(!0),e.stopPropagation(),e.stopImmediatePropagation(),!0},o.handleDragMove=function(e,n){var s=o.props.orientation;null!=o.props.onResizeMove&&o.props.onResizeMove(n.offset[s],n.delta[s])},o.handleDragEnd=function(e,n){var s=o.props.orientation;o.setState({isDragging:!1}),o.props.onLayoutLock(!1),null!=o.props.onResizeMove&&o.props.onResizeMove(n.offset[s],n.delta[s]),null!=o.props.onResizeEnd&&o.props.onResizeEnd(n.offset[s])},o.handleClick=function(e){o.setState({isDragging:!1}),o.props.onLayoutLock(!1)},o.handleDoubleClick=function(e){o.setState({isDragging:!1}),o.props.onLayoutLock(!1),null!=o.props.onDoubleClick&&o.props.onDoubleClick()},o}return __extends(o,e),o.prototype.render=function(){var e,o,n=this.props,s=n.onResizeMove,t=n.onResizeEnd,a=n.onDoubleClick,i=n.orientation;if(null!=s||null!=t||null!=a){var r=classNames(Classes.TABLE_RESIZE_HANDLE_TARGET,((e={})[Classes.TABLE_DRAGGING]=this.state.isDragging,e[Classes.TABLE_RESIZE_HORIZONTAL]=i===Orientation.HORIZONTAL,e[Classes.TABLE_RESIZE_VERTICAL]=i===Orientation.VERTICAL,e),this.props.className),l=classNames(Classes.TABLE_RESIZE_HANDLE,((o={})[Classes.TABLE_DRAGGING]=this.state.isDragging,o));return React.createElement(Draggable,{onActivate:this.handleActivate,onClick:this.handleClick,onDoubleClick:this.handleDoubleClick,onDragEnd:this.handleDragEnd,onDragMove:this.handleDragMove},React.createElement("div",{className:r},React.createElement("div",{className:l})))}},o}(React.PureComponent);export{ResizeHandle};