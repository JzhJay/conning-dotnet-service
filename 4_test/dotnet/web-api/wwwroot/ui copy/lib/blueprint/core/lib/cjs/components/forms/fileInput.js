"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.FileInput=void 0;var tslib_1=require("tslib"),classnames_1=tslib_1.__importDefault(require("classnames")),React=tslib_1.__importStar(require("react")),react_lifecycles_compat_1=require("react-lifecycles-compat"),common_1=require("../../common"),props_1=require("../../common/props"),FileInput=function(e){function s(){var s=null!==e&&e.apply(this,arguments)||this;return s.handleInputChange=function(e){var t,l,a,n;null===(l=(t=s.props).onInputChange)||void 0===l||l.call(t,e),null===(n=null===(a=s.props.inputProps)||void 0===a?void 0:a.onChange)||void 0===n||n.call(a,e)},s}return tslib_1.__extends(s,e),s.prototype.render=function(){var e,s,t,l=this.props,a=l.buttonText,n=l.className,o=l.disabled,i=l.fill,_=l.hasSelection,r=l.inputProps,c=l.large,p=(l.onInputChange,l.text),m=tslib_1.__rest(l,["buttonText","className","disabled","fill","hasSelection","inputProps","large","onInputChange","text"]),u=classnames_1.default(common_1.Classes.FILE_INPUT,((e={})[common_1.Classes.FILE_INPUT_HAS_SELECTION]=_,e[common_1.Classes.DISABLED]=o,e[common_1.Classes.FILL]=i,e[common_1.Classes.LARGE]=c,e),n),I=((s={})[common_1.Classes.getClassNamespace()+"-button-text"]=a,s.className=classnames_1.default(common_1.Classes.FILE_UPLOAD_INPUT,((t={})[common_1.Classes.FILE_UPLOAD_INPUT_CUSTOM_TEXT]=!!a,t)),s);return React.createElement("label",tslib_1.__assign({},m,{className:u}),React.createElement("input",tslib_1.__assign({},r,{onChange:this.handleInputChange,type:"file",disabled:o})),React.createElement("span",tslib_1.__assign({},I),p))},s.displayName=props_1.DISPLAYNAME_PREFIX+".FileInput",s.defaultProps={hasSelection:!1,inputProps:{},text:"Choose file..."},tslib_1.__decorate([react_lifecycles_compat_1.polyfill],s)}(common_1.AbstractPureComponent2);exports.FileInput=FileInput;