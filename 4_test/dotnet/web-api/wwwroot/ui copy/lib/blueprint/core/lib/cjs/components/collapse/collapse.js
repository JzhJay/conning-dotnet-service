"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Collapse=exports.AnimationStates=void 0;var AnimationStates,tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),common_1=require("../../common"),props_1=require("../../common/props");!function(t){t[t.OPEN_START=0]="OPEN_START",t[t.OPENING=1]="OPENING",t[t.OPEN=2]="OPEN",t[t.CLOSING_START=3]="CLOSING_START",t[t.CLOSING=4]="CLOSING",t[t.CLOSED=5]="CLOSED"}(AnimationStates=exports.AnimationStates||(exports.AnimationStates={}));var Collapse=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.state={animationState:e.props.isOpen?AnimationStates.OPEN:AnimationStates.CLOSED,height:void 0,heightWhenOpen:void 0},e.contents=null,e.contentsRefHandler=function(t){if(e.contents=t,null!=e.contents){var n=e.contents.clientHeight;e.setState({animationState:e.props.isOpen?AnimationStates.OPEN:AnimationStates.CLOSED,height:0===n?void 0:n+"px",heightWhenOpen:0===n?void 0:n})}},e}return tslib_1.__extends(e,t),e.getDerivedStateFromProps=function(t,e){var n=t.isOpen,i=e.animationState;if(n)switch(i){case AnimationStates.OPEN:case AnimationStates.OPENING:break;default:return{animationState:AnimationStates.OPEN_START}}else switch(i){case AnimationStates.CLOSED:case AnimationStates.CLOSING:break;default:return{animationState:AnimationStates.CLOSING_START,height:e.heightWhenOpen+"px"}}return null},e.prototype.render=function(){var t=this.state.animationState!==AnimationStates.CLOSED,e=t||this.props.keepChildrenMounted,n=t&&this.state.animationState!==AnimationStates.CLOSING,i="auto"===this.state.height,a={height:t?this.state.height:void 0,overflowY:i?"visible":void 0,transition:i?"none":void 0},s={transform:n?"translateY(0)":"translateY(-"+this.state.heightWhenOpen+"px)",transition:i?"none":void 0};return React.createElement(this.props.component,{className:classnames_1.default(common_1.Classes.COLLAPSE,this.props.className),style:a},React.createElement("div",{className:common_1.Classes.COLLAPSE_BODY,ref:this.contentsRefHandler,style:s,"aria-hidden":!t&&this.props.keepChildrenMounted},e?this.props.children:null))},e.prototype.componentDidMount=function(){this.forceUpdate(),this.props.isOpen?this.setState({animationState:AnimationStates.OPEN,height:"auto"}):this.setState({animationState:AnimationStates.CLOSED,height:"0px"})},e.prototype.componentDidUpdate=function(){var t=this;if(null!=this.contents){var e=this.props.transitionDuration,n=this.state.animationState;if(n===AnimationStates.OPEN_START){var i=this.contents.clientHeight;this.setState({animationState:AnimationStates.OPENING,height:i+"px",heightWhenOpen:i}),this.setTimeout((function(){return t.onDelayedStateChange()}),e)}else if(n===AnimationStates.CLOSING_START){var a=this.contents.clientHeight;this.setTimeout((function(){return t.setState({animationState:AnimationStates.CLOSING,height:"0px",heightWhenOpen:a})})),this.setTimeout((function(){return t.onDelayedStateChange()}),e)}}},e.prototype.onDelayedStateChange=function(){switch(this.state.animationState){case AnimationStates.OPENING:this.setState({animationState:AnimationStates.OPEN,height:"auto"});break;case AnimationStates.CLOSING:this.setState({animationState:AnimationStates.CLOSED})}},e.displayName=props_1.DISPLAYNAME_PREFIX+".Collapse",e.defaultProps={component:"div",isOpen:!1,keepChildrenMounted:!1,transitionDuration:200},tslib_1.__decorate([react_lifecycles_compat_1.polyfill],e)}(common_1.AbstractPureComponent2);exports.Collapse=Collapse;