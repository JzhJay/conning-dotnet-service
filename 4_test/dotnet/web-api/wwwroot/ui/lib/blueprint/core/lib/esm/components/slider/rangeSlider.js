import{__assign,__decorate,__extends,__rest}from"tslib";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Intent}from"../../common";import*as Errors from"../../common/errors";import{DISPLAYNAME_PREFIX}from"../../common/props";import{MultiSlider}from"./multiSlider";var RangeIndex;!function(e){e[e.START=0]="START",e[e.END=1]="END"}(RangeIndex||(RangeIndex={}));var RangeSlider=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return __extends(t,e),t.prototype.render=function(){var e=this.props,t=e.value,r=__rest(e,["value"]);return React.createElement(MultiSlider,__assign({},r),React.createElement(MultiSlider.Handle,{value:t[RangeIndex.START],type:"start",intentAfter:r.intent}),React.createElement(MultiSlider.Handle,{value:t[RangeIndex.END],type:"end"}))},t.prototype.validateProps=function(e){var t=e.value;if(null==t||null==t[RangeIndex.START]||null==t[RangeIndex.END])throw new Error(Errors.RANGESLIDER_NULL_VALUE)},t.defaultProps=__assign(__assign({},MultiSlider.defaultSliderProps),{intent:Intent.PRIMARY,value:[0,10]}),t.displayName=DISPLAYNAME_PREFIX+".RangeSlider",__decorate([polyfill],t)}(AbstractPureComponent2);export{RangeSlider};