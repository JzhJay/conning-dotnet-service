"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.RowHeaderCell=void 0;var tslib_1=require("tslib"),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),core_1=require("@blueprintjs/core"),Classes=tslib_1.__importStar(require("../common/classes")),loadableContent_1=require("../common/loadableContent"),headerCell_1=require("./headerCell"),RowHeaderCell=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return tslib_1.__extends(r,e),r.prototype.render=function(){var e=this.props,r=(e.enableRowReordering,e.isRowSelected,e.name),t=e.nameRenderer,l=tslib_1.__rest(e,["enableRowReordering","isRowSelected","name","nameRenderer"]),a=React.createElement("div",{className:Classes.TABLE_ROW_NAME_TEXT},r),o=React.createElement(loadableContent_1.LoadableContent,{loading:l.loading},null==t?a:t(r,l.index));return React.createElement(headerCell_1.HeaderCell,tslib_1.__assign({isReorderable:this.props.enableRowReordering,isSelected:this.props.isRowSelected},l),React.createElement("div",{className:Classes.TABLE_ROW_NAME},o),this.props.children,l.loading?void 0:l.resizeHandle)},tslib_1.__decorate([react_lifecycles_compat_1.polyfill],r)}(core_1.AbstractPureComponent2);exports.RowHeaderCell=RowHeaderCell;