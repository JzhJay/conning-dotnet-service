import{__decorate}from"tslib";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Intent}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";import{MultiSlider}from"./multiSlider";let Slider=class extends AbstractPureComponent2{render(){const{initialValue:e,intent:t,value:l,onChange:r,onRelease:i,...n}=this.props;return React.createElement(MultiSlider,Object.assign({},n),React.createElement(MultiSlider.Handle,{value:l,intentAfter:l<e?t:void 0,intentBefore:l>=e?t:void 0,onChange:r,onRelease:i}),React.createElement(MultiSlider.Handle,{value:e,interactionKind:"none"}))}};Slider.defaultProps={...MultiSlider.defaultSliderProps,initialValue:0,intent:Intent.PRIMARY,value:0},Slider.displayName=`${DISPLAYNAME_PREFIX}.Slider`,Slider=__decorate([polyfill],Slider);export{Slider};