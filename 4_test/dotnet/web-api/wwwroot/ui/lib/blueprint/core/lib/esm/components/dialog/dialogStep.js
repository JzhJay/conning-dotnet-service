import{__decorate,__extends}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";var DialogStep=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends(t,e),t.prototype.render=function(){var e=this.props.className;return React.createElement("div",{className:Classes.DIALOG_STEP_CONTAINER},React.createElement("div",{className:classNames(Classes.DIALOG_STEP,e),role:"dialogsteplist"}))},t.displayName=DISPLAYNAME_PREFIX+".DialogStep",__decorate([polyfill],t)}(AbstractPureComponent2);export{DialogStep};