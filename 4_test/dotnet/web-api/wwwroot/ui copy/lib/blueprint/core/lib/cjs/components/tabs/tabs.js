"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Tabs=exports.Expander=void 0;var tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),common_1=require("../../common"),props_1=require("../../common/props"),Utils=tslib_1.__importStar(require("../../common/utils")),tab_1=require("./tab"),tabTitle_1=require("./tabTitle"),Expander=function(){return React.createElement("div",{className:common_1.Classes.FLEX_EXPANDER})};exports.Expander=Expander;var TAB_SELECTOR="."+common_1.Classes.TAB,Tabs=function(e){function t(t){var a=e.call(this,t)||this;a.tablistElement=null,a.refHandlers={tablist:function(e){return a.tablistElement=e}},a.handleKeyDown=function(e){var t,r=null===(t=document.activeElement)||void 0===t?void 0:t.closest(TAB_SELECTOR);if(null!=r){var s=a.getTabElements().filter((function(e){return"false"===e.getAttribute("aria-disabled")})),n=s.indexOf(r),i=a.getKeyCodeDirection(e);if(n>=0&&void 0!==i){e.preventDefault();var l=s.length;s[(n+i+l)%l].focus()}}},a.handleKeyPress=function(e){var t=e.target.closest(TAB_SELECTOR);null!=t&&common_1.Keys.isKeyboardClick(e.which)&&(e.preventDefault(),t.click())},a.handleTabClick=function(e,t){var r,s;null===(s=(r=a.props).onChange)||void 0===s||s.call(r,e,a.state.selectedTabId,t),void 0===a.props.selectedTabId&&a.setState({selectedTabId:e})},a.renderTabPanel=function(e){var t=e.props,r=t.className,s=t.panel,n=t.id,i=t.panelClassName;if(void 0!==s)return React.createElement("div",{"aria-labelledby":tabTitle_1.generateTabTitleId(a.props.id,n),"aria-hidden":n!==a.state.selectedTabId,className:classnames_1.default(common_1.Classes.TAB_PANEL,r,i),id:tabTitle_1.generateTabPanelId(a.props.id,n),key:n,role:"tabpanel"},s)},a.renderTabTitle=function(e){if(isTabElement(e)){var t=e.props.id;return React.createElement(tabTitle_1.TabTitle,tslib_1.__assign({},e.props,{parentId:a.props.id,onClick:a.handleTabClick,selected:t===a.state.selectedTabId}))}return e};var r=a.getInitialSelectedTabId();return a.state={selectedTabId:r},a}return tslib_1.__extends(t,e),t.getDerivedStateFromProps=function(e){var t=e.selectedTabId;return void 0!==t?{selectedTabId:t}:null},t.prototype.render=function(){var e,t,a=this.state,r=a.indicatorWrapperStyle,s=a.selectedTabId,n=React.Children.map(this.props.children,this.renderTabTitle),i=this.getTabChildren().filter(this.props.renderActiveTabPanelOnly?function(e){return e.props.id===s}:function(){return!0}).map(this.renderTabPanel),l=this.props.animate?React.createElement("div",{className:common_1.Classes.TAB_INDICATOR_WRAPPER,style:r},React.createElement("div",{className:common_1.Classes.TAB_INDICATOR})):null,o=classnames_1.default(common_1.Classes.TABS,((e={})[common_1.Classes.VERTICAL]=this.props.vertical,e),this.props.className),c=classnames_1.default(common_1.Classes.TAB_LIST,((t={})[common_1.Classes.LARGE]=this.props.large,t));return React.createElement("div",{className:o},React.createElement("div",{className:c,onKeyDown:this.handleKeyDown,onKeyPress:this.handleKeyPress,ref:this.refHandlers.tablist,role:"tablist"},l,n),i)},t.prototype.componentDidMount=function(){this.moveSelectionIndicator(!1)},t.prototype.componentDidUpdate=function(e,t){(this.state.selectedTabId!==t.selectedTabId||null!=t.selectedTabId&&!Utils.arraysEqual(this.getTabChildrenProps(e),this.getTabChildrenProps(),Utils.shallowCompareKeys))&&this.moveSelectionIndicator()},t.prototype.getInitialSelectedTabId=function(){var e=this.props,t=e.defaultSelectedTabId,a=e.selectedTabId;if(void 0!==a)return a;if(void 0!==t)return t;var r=this.getTabChildren();return 0===r.length?void 0:r[0].props.id},t.prototype.getKeyCodeDirection=function(e){return isEventKeyCode(e,common_1.Keys.ARROW_LEFT,common_1.Keys.ARROW_UP)?-1:isEventKeyCode(e,common_1.Keys.ARROW_RIGHT,common_1.Keys.ARROW_DOWN)?1:void 0},t.prototype.getTabChildrenProps=function(e){return void 0===e&&(e=this.props),this.getTabChildren(e).map((function(e){return e.props}))},t.prototype.getTabChildren=function(e){return void 0===e&&(e=this.props),React.Children.toArray(e.children).filter(isTabElement)},t.prototype.getTabElements=function(e){return void 0===e&&(e=""),null==this.tablistElement?[]:Array.from(this.tablistElement.querySelectorAll(TAB_SELECTOR+e))},t.prototype.moveSelectionIndicator=function(e){if(void 0===e&&(e=!0),null!=this.tablistElement&&this.props.animate){var t=TAB_SELECTOR+'[data-tab-id="'+this.state.selectedTabId+'"]',a=this.tablistElement.querySelector(t),r={display:"none"};if(null!=a){var s=a.clientHeight,n=a.clientWidth,i=a.offsetLeft,l=a.offsetTop;r={height:s,transform:"translateX("+Math.floor(i)+"px) translateY("+Math.floor(l)+"px)",width:n},e||(r.transition="none")}this.setState({indicatorWrapperStyle:r})}},t.Expander=exports.Expander,t.Tab=tab_1.Tab,t.defaultProps={animate:!0,large:!1,renderActiveTabPanelOnly:!1,vertical:!1},t.displayName=props_1.DISPLAYNAME_PREFIX+".Tabs",tslib_1.__decorate([react_lifecycles_compat_1.polyfill],t)}(common_1.AbstractPureComponent2);function isEventKeyCode(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];return t.indexOf(e.which)>=0}function isTabElement(e){return Utils.isElementOfType(e,tab_1.Tab)}exports.Tabs=Tabs;