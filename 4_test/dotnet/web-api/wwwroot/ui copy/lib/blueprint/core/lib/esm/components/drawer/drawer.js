import{__assign,__decorate,__extends}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes}from"../../common";import*as Errors from"../../common/errors";import{getPositionIgnoreAngles,isPositionHorizontal}from"../../common/position";import{DISPLAYNAME_PREFIX}from"../../common/props";import{Button}from"../button/buttons";import{H4}from"../html/html";import{Icon,IconSize}from"../icon/icon";import{Overlay}from"../overlay/overlay";export var DrawerSize;!function(e){e.SMALL="360px",e.STANDARD="50%",e.LARGE="90%"}(DrawerSize||(DrawerSize={}));var Drawer=function(e){function o(){return null!==e&&e.apply(this,arguments)||this}return __extends(o,e),o.prototype.render=function(){var e,o,r,t=this.props,s=t.size,n=t.style,i=t.position,a=t.vertical,l=i?getPositionIgnoreAngles(i):void 0,c=classNames(Classes.DRAWER,((e={})[Classes.VERTICAL]=!l&&a,e[null!==(r=Classes.positionClass(l))&&void 0!==r?r:""]=!0,e),this.props.className),m=null==s?n:__assign(__assign({},n),((o={})[(l?isPositionHorizontal(l):a)?"height":"width"]=s,o));return React.createElement(Overlay,__assign({},this.props,{className:Classes.OVERLAY_CONTAINER}),React.createElement("div",{className:c,style:m},this.maybeRenderHeader(),this.props.children))},o.prototype.validateProps=function(e){null==e.title&&(null!=e.icon&&console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON),null!=e.isCloseButtonShown&&console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON)),null!=e.position&&(e.vertical&&console.warn(Errors.DRAWER_VERTICAL_IS_IGNORED),e.position!==getPositionIgnoreAngles(e.position)&&console.warn(Errors.DRAWER_ANGLE_POSITIONS_ARE_CASTED))},o.prototype.maybeRenderCloseButton=function(){return!1!==this.props.isCloseButtonShown?React.createElement(Button,{"aria-label":"Close",className:Classes.DIALOG_CLOSE_BUTTON,icon:React.createElement(Icon,{icon:"small-cross",size:IconSize.LARGE}),minimal:!0,onClick:this.props.onClose}):null},o.prototype.maybeRenderHeader=function(){var e=this.props,o=e.icon,r=e.title;return null==r?null:React.createElement("div",{className:Classes.DRAWER_HEADER},React.createElement(Icon,{icon:o,size:IconSize.LARGE}),React.createElement(H4,null,r),this.maybeRenderCloseButton())},o.displayName=DISPLAYNAME_PREFIX+".Drawer",o.defaultProps={canOutsideClickClose:!0,isOpen:!1,style:{},vertical:!1},o.SIZE_SMALL=DrawerSize.SMALL,o.SIZE_STANDARD=DrawerSize.STANDARD,o.SIZE_LARGE=DrawerSize.LARGE,__decorate([polyfill],o)}(AbstractPureComponent2);export{Drawer};