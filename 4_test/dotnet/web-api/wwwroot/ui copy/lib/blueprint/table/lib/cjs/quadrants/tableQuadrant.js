"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TableQuadrant=exports.QuadrantType=void 0;var QuadrantType,tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),core_1=require("@blueprintjs/core"),Classes=tslib_1.__importStar(require("../common/classes")),Errors=tslib_1.__importStar(require("../common/errors"));!function(e){e.MAIN="main",e.TOP="top",e.LEFT="left",e.TOP_LEFT="top-left"}(QuadrantType=exports.QuadrantType||(exports.QuadrantType={}));var TableQuadrant=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return tslib_1.__extends(r,e),r.prototype.render=function(){var e,r,t,a,s,l,n=this.props,o=n.grid,p=n.enableRowHeader,i=n.quadrantType,c=n.bodyRenderer,T=i===QuadrantType.TOP||i===QuadrantType.TOP_LEFT,u=i===QuadrantType.LEFT||i===QuadrantType.TOP_LEFT,_=classnames_1.default(Classes.TABLE_QUADRANT,this.getQuadrantCssClass(),this.props.className),d=p&&(null===(r=(e=this.props).menuRenderer)||void 0===r?void 0:r.call(e)),A=p&&(null===(a=(t=this.props).rowHeaderCellRenderer)||void 0===a?void 0:a.call(t,T)),E=null===(l=(s=this.props).columnHeaderCellRenderer)||void 0===l?void 0:l.call(s,u),y=null!=i?c(i,T,u):c(),N={height:o.getHeight(),width:o.getWidth()};return React.createElement("div",{className:_,style:this.props.style,ref:this.props.quadrantRef},React.createElement("div",{className:Classes.TABLE_QUADRANT_SCROLL_CONTAINER,ref:this.props.scrollContainerRef,onScroll:this.props.onScroll,onWheel:this.props.onWheel},React.createElement("div",{className:Classes.TABLE_TOP_CONTAINER},d,E),React.createElement("div",{className:Classes.TABLE_BOTTOM_CONTAINER,style:N},A,React.createElement("div",{className:Classes.TABLE_QUADRANT_BODY_CONTAINER,ref:this.props.bodyRef},y))))},r.prototype.validateProps=function(e){var r=e.quadrantType;null!=e.onScroll&&null!=r&&r!==QuadrantType.MAIN&&console.warn(Errors.QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED)},r.prototype.getQuadrantCssClass=function(){switch(this.props.quadrantType){case QuadrantType.MAIN:return Classes.TABLE_QUADRANT_MAIN;case QuadrantType.TOP:return Classes.TABLE_QUADRANT_TOP;case QuadrantType.LEFT:return Classes.TABLE_QUADRANT_LEFT;case QuadrantType.TOP_LEFT:return Classes.TABLE_QUADRANT_TOP_LEFT;default:return}},r.defaultProps={enableRowHeader:!0},tslib_1.__decorate([react_lifecycles_compat_1.polyfill],r)}(core_1.AbstractComponent2);exports.TableQuadrant=TableQuadrant;