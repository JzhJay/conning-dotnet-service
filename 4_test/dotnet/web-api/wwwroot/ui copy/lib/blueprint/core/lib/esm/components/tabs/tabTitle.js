import{__assign,__decorate,__extends,__rest}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes}from"../../common";import{DISPLAYNAME_PREFIX,removeNonHTMLProps}from"../../common/props";var TabTitle=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.handleClick=function(e){return t.props.onClick(t.props.id,e)},t}return __extends(t,e),t.prototype.render=function(){var e=this.props,t=e.className,a=e.children,r=e.disabled,s=e.id,o=e.parentId,i=e.selected,n=e.title,l=__rest(e,["className","children","disabled","id","parentId","selected","title"]);return React.createElement("div",__assign({},removeNonHTMLProps(l),{"aria-controls":generateTabPanelId(o,s),"aria-disabled":r,"aria-expanded":i,"aria-selected":i,className:classNames(Classes.TAB,t),"data-tab-id":s,id:generateTabTitleId(o,s),onClick:r?void 0:this.handleClick,role:"tab",tabIndex:r?void 0:i?0:-1}),n,a)},t.displayName=DISPLAYNAME_PREFIX+".TabTitle",__decorate([polyfill],t)}(AbstractPureComponent2);export{TabTitle};export function generateTabPanelId(e,t){return Classes.TAB_PANEL+"_"+e+"_"+t}export function generateTabTitleId(e,t){return Classes.TAB+"-title_"+e+"_"+t}