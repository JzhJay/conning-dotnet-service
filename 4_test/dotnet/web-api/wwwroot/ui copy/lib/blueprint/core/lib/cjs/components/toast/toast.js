"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Toast=void 0;var tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),common_1=require("../../common"),props_1=require("../../common/props"),buttonGroup_1=require("../button/buttonGroup"),buttons_1=require("../button/buttons"),icon_1=require("../icon/icon"),Toast=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.handleActionClick=function(t){var o,s;null===(s=null===(o=e.props.action)||void 0===o?void 0:o.onClick)||void 0===s||s.call(o,t),e.triggerDismiss(!1)},e.handleCloseClick=function(){return e.triggerDismiss(!1)},e.startTimeout=function(){e.clearTimeouts(),e.props.timeout>0&&e.setTimeout((function(){return e.triggerDismiss(!0)}),e.props.timeout)},e}return tslib_1.__extends(e,t),e.prototype.render=function(){var t=this.props,e=t.className,o=t.icon,s=t.intent,i=t.message;return React.createElement("div",{className:classnames_1.default(common_1.Classes.TOAST,common_1.Classes.intentClass(s),e),onBlur:this.startTimeout,onFocus:this.clearTimeouts,onMouseEnter:this.clearTimeouts,onMouseLeave:this.startTimeout,tabIndex:0},React.createElement(icon_1.Icon,{icon:o}),React.createElement("span",{className:common_1.Classes.TOAST_MESSAGE},i),React.createElement(buttonGroup_1.ButtonGroup,{minimal:!0},this.maybeRenderActionButton(),React.createElement(buttons_1.Button,{"aria-label":"Close",icon:"cross",onClick:this.handleCloseClick})))},e.prototype.componentDidMount=function(){this.startTimeout()},e.prototype.componentDidUpdate=function(t){t.timeout!==this.props.timeout&&(this.props.timeout>0?this.startTimeout():this.clearTimeouts())},e.prototype.componentWillUnmount=function(){this.clearTimeouts()},e.prototype.maybeRenderActionButton=function(){var t=this.props.action;return null==t?void 0:React.createElement(buttons_1.AnchorButton,tslib_1.__assign({},t,{intent:void 0,onClick:this.handleActionClick}))},e.prototype.triggerDismiss=function(t){var e,o;this.clearTimeouts(),null===(o=(e=this.props).onDismiss)||void 0===o||o.call(e,t)},e.defaultProps={className:"",message:"",timeout:5e3},e.displayName=props_1.DISPLAYNAME_PREFIX+".Toast",tslib_1.__decorate([react_lifecycles_compat_1.polyfill],e)}(common_1.AbstractPureComponent2);exports.Toast=Toast;