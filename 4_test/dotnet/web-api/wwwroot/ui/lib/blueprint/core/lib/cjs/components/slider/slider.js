"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Slider=void 0;var tslib_1=require("tslib"),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),common_1=require("../../common"),props_1=require("../../common/props"),multiSlider_1=require("./multiSlider"),Slider=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return tslib_1.__extends(t,e),t.prototype.render=function(){var e=this.props,t=e.initialValue,i=e.intent,l=e.value,r=e.onChange,n=e.onRelease,a=tslib_1.__rest(e,["initialValue","intent","value","onChange","onRelease"]);return React.createElement(multiSlider_1.MultiSlider,tslib_1.__assign({},a),React.createElement(multiSlider_1.MultiSlider.Handle,{value:l,intentAfter:l<t?i:void 0,intentBefore:l>=t?i:void 0,onChange:r,onRelease:n}),React.createElement(multiSlider_1.MultiSlider.Handle,{value:t,interactionKind:"none"}))},t.defaultProps=tslib_1.__assign(tslib_1.__assign({},multiSlider_1.MultiSlider.defaultSliderProps),{initialValue:0,intent:common_1.Intent.PRIMARY,value:0}),t.displayName=props_1.DISPLAYNAME_PREFIX+".Slider",tslib_1.__decorate([react_lifecycles_compat_1.polyfill],t)}(common_1.AbstractPureComponent2);exports.Slider=Slider;