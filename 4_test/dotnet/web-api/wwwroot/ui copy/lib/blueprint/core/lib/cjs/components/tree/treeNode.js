"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TreeNode=void 0;var tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),Classes=tslib_1.__importStar(require("../../common/classes")),props_1=require("../../common/props"),collapse_1=require("../collapse/collapse"),icon_1=require("../icon/icon"),TreeNode=function(e){function s(){var s=null!==e&&e.apply(this,arguments)||this;return s.handleCaretClick=function(e){var a;e.stopPropagation();var n=s.props,l=n.isExpanded,t=n.onCollapse,o=n.onExpand;null===(a=l?t:o)||void 0===a||a(s,e)},s.handleClick=function(e){var a,n;null===(n=(a=s.props).onClick)||void 0===n||n.call(a,s,e)},s.handleContentRef=function(e){var a,n;null===(n=(a=s.props).contentRef)||void 0===n||n.call(a,s,e)},s.handleContextMenu=function(e){var a,n;null===(n=(a=s.props).onContextMenu)||void 0===n||n.call(a,s,e)},s.handleDoubleClick=function(e){var a,n;null===(n=(a=s.props).onDoubleClick)||void 0===n||n.call(a,s,e)},s.handleMouseEnter=function(e){var a,n;null===(n=(a=s.props).onMouseEnter)||void 0===n||n.call(a,s,e)},s.handleMouseLeave=function(e){var a,n;null===(n=(a=s.props).onMouseLeave)||void 0===n||n.call(a,s,e)},s}return tslib_1.__extends(s,e),s.ofType=function(){return s},s.prototype.render=function(){var e,s=this.props,a=s.children,n=s.className,l=s.disabled,t=s.icon,o=s.isExpanded,r=s.isSelected,i=s.label,c=classnames_1.default(Classes.TREE_NODE,((e={})[Classes.DISABLED]=l,e[Classes.TREE_NODE_SELECTED]=r,e[Classes.TREE_NODE_EXPANDED]=o,e),n),E=classnames_1.default(Classes.TREE_NODE_CONTENT,Classes.TREE_NODE_CONTENT+"-"+this.props.depth),p=!0===l?{}:{onClick:this.handleClick,onContextMenu:this.handleContextMenu,onDoubleClick:this.handleDoubleClick,onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave};return React.createElement("li",{className:c},React.createElement("div",tslib_1.__assign({className:E,ref:this.handleContentRef},p),this.maybeRenderCaret(),React.createElement(icon_1.Icon,{className:Classes.TREE_NODE_ICON,icon:t}),React.createElement("span",{className:Classes.TREE_NODE_LABEL},i),this.maybeRenderSecondaryLabel()),React.createElement(collapse_1.Collapse,{isOpen:o},a))},s.prototype.maybeRenderCaret=function(){var e=this.props,s=e.children,a=e.isExpanded,n=e.disabled,l=e.hasCaret;if(void 0===l?React.Children.count(s)>0:l){var t=classnames_1.default(Classes.TREE_NODE_CARET,a?Classes.TREE_NODE_CARET_OPEN:Classes.TREE_NODE_CARET_CLOSED),o=!0===n?void 0:this.handleCaretClick;return React.createElement(icon_1.Icon,{title:a?"Collapse group":"Expand group",className:t,onClick:o,icon:"chevron-right"})}return React.createElement("span",{className:Classes.TREE_NODE_CARET_NONE})},s.prototype.maybeRenderSecondaryLabel=function(){return null!=this.props.secondaryLabel?React.createElement("span",{className:Classes.TREE_NODE_SECONDARY_LABEL},this.props.secondaryLabel):void 0},s.displayName=props_1.DISPLAYNAME_PREFIX+".TreeNode",s}(React.Component);exports.TreeNode=TreeNode;