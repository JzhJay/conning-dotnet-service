var _a;import{__assign,__spreadArrays}from"tslib";import*as React from"react";import{shallowCompareKeys}from"../../common/utils";import{HotkeysDialog2}from"../../components/hotkeys/hotkeysDialog2";var initialHotkeysState={hotkeys:[],isDialogOpen:!1},noOpDispatch=function(){return null};export var HotkeysContext=null===(_a=React.createContext)||void 0===_a?void 0:_a.call(React,[initialHotkeysState,noOpDispatch]);var hotkeysReducer=function(e,t){switch(t.type){case"ADD_HOTKEYS":for(var a=[],o=0,s=t.payload;o<s.length;o++){for(var n=s[o],r=!0,i=0,l=e.hotkeys;i<l.length;i++){var _=l[i];r&&(r=!shallowCompareKeys(n,_,{exclude:["onKeyDown","onKeyUp"]}))}r&&a.push(n)}return __assign(__assign({},e),{hotkeys:__spreadArrays(e.hotkeys,a)});case"REMOVE_HOTKEYS":return __assign(__assign({},e),{hotkeys:e.hotkeys.filter((function(e){return-1===t.payload.indexOf(e)}))});case"OPEN_DIALOG":return __assign(__assign({},e),{isDialogOpen:!0});case"CLOSE_DIALOG":return __assign(__assign({},e),{isDialogOpen:!1});default:return e}};export var HotkeysProvider=function(e){var t,a=e.children,o=e.dialogProps,s=e.renderDialog,n=e.value,r=null!=n,i=null!=n?n:React.useReducer(hotkeysReducer,initialHotkeysState),l=i[0],_=i[1],c=React.useCallback((function(){return _({type:"CLOSE_DIALOG"})}),[]),u=null!==(t=null==s?void 0:s(l,{handleDialogClose:c}))&&void 0!==t?t:React.createElement(HotkeysDialog2,__assign({},o,{isOpen:l.isDialogOpen,hotkeys:l.hotkeys,onClose:c}));return React.createElement(HotkeysContext.Provider,{value:[l,_]},a,r?void 0:u)};