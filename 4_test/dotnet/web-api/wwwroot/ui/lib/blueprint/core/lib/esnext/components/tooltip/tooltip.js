import{__decorate}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";import{Popover,PopoverInteractionKind}from"../popover/popover";let Tooltip=class extends AbstractPureComponent2{constructor(){super(...arguments),this.popover=null}render(){const{children:o,intent:e,popoverClassName:r,...t}=this.props,s=classNames(Classes.TOOLTIP,{[Classes.MINIMAL]:this.props.minimal},Classes.intentClass(e),r);return React.createElement(Popover,Object.assign({interactionKind:PopoverInteractionKind.HOVER_TARGET_ONLY,modifiers:{arrow:{enabled:!this.props.minimal}}},t,{autoFocus:!1,canEscapeKeyClose:!1,enforceFocus:!1,lazy:!0,popoverClassName:s,portalContainer:this.props.portalContainer,ref:o=>this.popover=o}),o)}reposition(){null!=this.popover&&this.popover.reposition()}};Tooltip.displayName=`${DISPLAYNAME_PREFIX}.Tooltip`,Tooltip.defaultProps={hoverCloseDelay:0,hoverOpenDelay:100,minimal:!1,transitionDuration:100},Tooltip=__decorate([polyfill],Tooltip);export{Tooltip};