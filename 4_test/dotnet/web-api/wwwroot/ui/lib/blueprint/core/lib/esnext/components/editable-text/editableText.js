import{__decorate}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes,Keys}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";import{clamp}from"../../common/utils";import{Browser}from"../../compatibility";const BUFFER_WIDTH_DEFAULT=5,BUFFER_WIDTH_IE=30;let EditableText=class extends AbstractPureComponent2{constructor(t,e){super(t,e),this.inputElement=null,this.valueElement=null,this.refHandlers={content:t=>{this.valueElement=t},input:t=>{if(null!=t&&(this.inputElement=t,this.props.alwaysRenderInput||this.inputElement.focus(),null!=this.state&&this.state.isEditing)){const e=inputSupportsSelection(t);if(e){const{length:e}=t.value;t.setSelectionRange(this.props.selectAllOnFocus?0:e,e)}e&&this.props.selectAllOnFocus||(t.scrollLeft=t.scrollWidth)}}},this.cancelEditing=()=>{const{lastValue:t,value:e}=this.state;this.setState({isEditing:!1,value:t}),e!==t&&this.props.onChange?.(t),this.props.onCancel?.(t)},this.toggleEditing=()=>{if(this.state.isEditing){const{value:t}=this.state;this.setState({isEditing:!1,lastValue:t}),this.props.onConfirm?.(t)}else this.props.disabled||this.setState({isEditing:!0})},this.handleFocus=()=>{const{alwaysRenderInput:t,disabled:e,selectAllOnFocus:i}=this.props;if(e||this.setState({isEditing:!0}),t&&i&&null!=this.inputElement){const{length:t}=this.inputElement.value;this.inputElement.setSelectionRange(0,t)}},this.handleTextChange=t=>{const e=t.target.value;null==this.props.value&&this.setState({value:e}),this.props.onChange?.(e)},this.handleKeyEvent=t=>{const{altKey:e,ctrlKey:i,metaKey:s,shiftKey:n,which:l}=t;if(l===Keys.ESCAPE)return void this.cancelEditing();const a=e||i||s||n;l===Keys.ENTER&&((e||n)&&t.preventDefault(),this.props.confirmOnEnterKey&&this.props.multiline?null!=t.target&&a?(insertAtCaret(t.target,"\n"),this.handleTextChange(t)):this.toggleEditing():this.props.multiline&&!a||this.toggleEditing())};const i=null==t.value?t.defaultValue:t.value;this.state={inputHeight:0,inputWidth:0,isEditing:!0===t.isEditing&&!1===t.disabled,lastValue:i,value:i}}render(){const{alwaysRenderInput:t,disabled:e,multiline:i,contentId:s}=this.props,n=this.props.value??this.state.value,l=null!=n&&""!==n,a=classNames(Classes.EDITABLE_TEXT,Classes.intentClass(this.props.intent),{[Classes.DISABLED]:e,[Classes.EDITABLE_TEXT_EDITING]:this.state.isEditing,[Classes.EDITABLE_TEXT_PLACEHOLDER]:!l,[Classes.MULTILINE]:i},this.props.className);let o;o=i?{height:this.state.isEditing?void 0:this.state.inputHeight}:{height:this.state.inputHeight,lineHeight:null!=this.state.inputHeight?`${this.state.inputHeight}px`:void 0,minWidth:this.props.minWidth};const h=t||this.state.isEditing||e?void 0:0,p=t&&!this.state.isEditing,r=null!=s?{id:s}:{};return React.createElement("div",{className:a,onFocus:this.handleFocus,tabIndex:h},t||this.state.isEditing?this.renderInput(n):void 0,p?void 0:React.createElement("span",Object.assign({},r,{className:Classes.EDITABLE_TEXT_CONTENT,ref:this.refHandlers.content,style:o}),l?n:this.props.placeholder))}componentDidMount(){this.updateInputDimensions()}componentDidUpdate(t,e){const i={};this.props.value===t.value||null==t.value&&null==this.props.value||(i.value=this.props.value),null!=this.props.isEditing&&this.props.isEditing!==t.isEditing&&(i.isEditing=this.props.isEditing),(this.props.disabled||null==this.props.disabled&&t.disabled)&&(i.isEditing=!1),this.setState(i),this.state.isEditing&&!e.isEditing&&this.props.onEdit?.(this.state.value),this.state.value===e.value&&this.props.alwaysRenderInput===t.alwaysRenderInput&&this.props.maxLines===t.maxLines&&this.props.minLines===t.minLines&&this.props.minWidth===t.minWidth&&this.props.multiline===t.multiline||this.updateInputDimensions()}renderInput(t){const{disabled:e,maxLength:i,multiline:s,type:n,placeholder:l}=this.props,a={className:Classes.EDITABLE_TEXT_INPUT,disabled:e,maxLength:i,onBlur:this.toggleEditing,onChange:this.handleTextChange,onKeyDown:this.handleKeyEvent,placeholder:l,value:t},{inputHeight:o,inputWidth:h}=this.state;return 0!==o&&0!==h&&(a.style={height:o,lineHeight:s||null==o?void 0:`${o}px`,width:s?"100%":h}),s?React.createElement("textarea",Object.assign({ref:this.refHandlers.input},a)):React.createElement("input",Object.assign({ref:this.refHandlers.input,type:n},a))}updateInputDimensions(){if(null!=this.valueElement){const{maxLines:t,minLines:e,minWidth:i,multiline:s}=this.props,{parentElement:n,textContent:l}=this.valueElement;let{scrollHeight:a,scrollWidth:o}=this.valueElement;const h=getLineHeight(this.valueElement);s&&this.state.isEditing&&/\n$/.test(l??"")&&(a+=h),h>0&&(a=clamp(a,e*h,t*h)),a=Math.max(a,getFontSize(this.valueElement)+1,getLineHeight(n)),o+=Browser.isInternetExplorer()?30:5,this.setState({inputHeight:a,inputWidth:Math.max(o,i)}),s&&this.state.isEditing&&this.setTimeout((()=>n.style.height=`${a}px`))}}};EditableText.displayName=`${DISPLAYNAME_PREFIX}.EditableText`,EditableText.defaultProps={alwaysRenderInput:!1,confirmOnEnterKey:!1,defaultValue:"",disabled:!1,maxLines:1/0,minLines:1,minWidth:80,multiline:!1,placeholder:"Click to Edit",type:"text"},EditableText=__decorate([polyfill],EditableText);export{EditableText};function getFontSize(t){const e=getComputedStyle(t).fontSize;return""===e?0:parseInt(e.slice(0,-2),10)}function getLineHeight(t){let e=parseInt(getComputedStyle(t).lineHeight.slice(0,-2),10);if(isNaN(e)){const i=document.createElement("span");i.innerHTML="<br>",t.appendChild(i);const s=t.offsetHeight;i.innerHTML="<br><br>";const n=t.offsetHeight;t.removeChild(i),e=n-s}return e}function insertAtCaret(t,e){const{selectionEnd:i,selectionStart:s,value:n}=t;if(s>=0){const l=n.substring(0,s),a=n.substring(i,n.length),o=e.length;t.value=`${l}${e}${a}`,t.selectionStart=s+o,t.selectionEnd=s+o}}function inputSupportsSelection(t){switch(t.type){case"textarea":case"text":case"search":case"tel":case"url":case"password":return!0;default:return!1}}