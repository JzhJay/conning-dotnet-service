import{__assign,__rest}from"tslib";import classNames from"classnames";import*as React from"react";import{BLOCKQUOTE,CODE,CODE_BLOCK,HEADING,LABEL,LIST}from"../../common/classes";function htmlElement(e,t){return function(m){var l=m.className,r=m.elementRef,a=__rest(m,["className","elementRef"]);return React.createElement(e,__assign(__assign({},a),{className:classNames(t,l),ref:r}))}}export var H1=htmlElement("h1",HEADING);export var H2=htmlElement("h2",HEADING);export var H3=htmlElement("h3",HEADING);export var H4=htmlElement("h4",HEADING);export var H5=htmlElement("h5",HEADING);export var H6=htmlElement("h6",HEADING);export var Blockquote=htmlElement("blockquote",BLOCKQUOTE);export var Code=htmlElement("code",CODE);export var Pre=htmlElement("pre",CODE_BLOCK);export var Label=htmlElement("label",LABEL);export var OL=htmlElement("ol",LIST);export var UL=htmlElement("ul",LIST);