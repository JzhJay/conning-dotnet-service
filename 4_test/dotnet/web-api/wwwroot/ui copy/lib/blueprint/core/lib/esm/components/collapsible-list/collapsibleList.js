import{__assign,__extends}from"tslib";import classNames from"classnames";import*as React from"react";import{Boundary}from"../../common/boundary";import*as Classes from"../../common/classes";import*as Errors from"../../common/errors";import{Position}from"../../common/position";import{DISPLAYNAME_PREFIX}from"../../common/props";import{isElementOfType}from"../../common/utils";import{Menu}from"../menu/menu";import{MenuItem}from"../menu/menuItem";import{Popover}from"../popover/popover";var CollapsibleList=function(e){function o(){return null!==e&&e.apply(this,arguments)||this}return __extends(o,e),o.prototype.render=function(){var e,o=this,r=this.props.collapseFrom,t=React.Children.count(this.props.children),s=this.partitionChildren(),n=s[0],i=s[1],a=n.map((function(e,s){var n=r===Boundary.START?t-1-s:s;return React.createElement("li",{className:o.props.visibleItemClassName,key:n},o.props.visibleItemRenderer(e.props,n))}));if(r===Boundary.START&&a.reverse(),i.length>0){var m=r===Boundary.END?Position.BOTTOM_RIGHT:Position.BOTTOM_LEFT;e=React.createElement("li",{className:this.props.visibleItemClassName},React.createElement(Popover,__assign({content:React.createElement(Menu,null,i),position:m},this.props.dropdownProps),this.props.dropdownTarget))}return React.createElement("ul",{className:classNames(Classes.COLLAPSIBLE_LIST,this.props.className)},r===Boundary.START?e:null,a,r===Boundary.END?e:null)},o.prototype.partitionChildren=function(){var e=React.Children.map(this.props.children,(function(e,o){if(!isElementOfType(e,MenuItem))throw new Error(Errors.COLLAPSIBLE_LIST_INVALID_CHILD);return React.cloneElement(e,{key:"visible-"+o})}));if(null==e)return[[],[]];this.props.collapseFrom===Boundary.START&&e.reverse();var o=this.props.visibleItemCount;return[e.slice(0,o),e.slice(o)]},o.displayName=DISPLAYNAME_PREFIX+".CollapsibleList",o.defaultProps={collapseFrom:Boundary.START,visibleItemCount:3},o}(React.Component);export{CollapsibleList};