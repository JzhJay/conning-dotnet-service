import{__decorate}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes,Keys,refHandler,setRef,Utils}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";import{Icon,IconSize}from"../icon/icon";import{Tag}from"../tag/tag";const NONE=-1;let TagInput=class extends AbstractPureComponent2{constructor(){super(...arguments),this.state={activeIndex:-1,inputValue:this.props.inputValue||"",isInputFocused:!1},this.inputElement=null,this.handleRef=refHandler(this,"inputElement",this.props.inputRef),this.addTags=(e,t="default")=>{const{inputValue:s,onAdd:a,onChange:n,values:i}=this.props,l=this.getValues(e);let o=!1!==a?.(l,t)&&void 0===s;Utils.isFunction(n)&&(o=!1!==n([...i,...l])&&o),o&&this.setState({inputValue:""})},this.maybeRenderTag=(e,t)=>{if(!e)return null;const{large:s,tagProps:a}=this.props,n=Utils.isFunction(a)?a(e,t):a;return React.createElement(Tag,Object.assign({active:t===this.state.activeIndex,"data-tag-index":t,key:e+"__"+t,large:s,onRemove:this.props.disabled?void 0:this.handleRemoveTag},n),e)},this.handleContainerClick=()=>{this.inputElement?.focus()},this.handleContainerBlur=({currentTarget:e})=>{this.requestAnimationFrame((()=>{e.contains(document.activeElement)||(this.props.addOnBlur&&void 0!==this.state.inputValue&&this.state.inputValue.length>0&&this.addTags(this.state.inputValue,"blur"),this.setState({activeIndex:-1,isInputFocused:!1}))}))},this.handleInputFocus=e=>{this.setState({isInputFocused:!0}),this.props.inputProps?.onFocus?.(e)},this.handleInputChange=e=>{this.setState({activeIndex:-1,inputValue:e.currentTarget.value}),this.props.onInputChange?.(e),this.props.inputProps?.onChange?.(e)},this.handleInputKeyDown=e=>{const{selectionEnd:t,value:s}=e.currentTarget,{activeIndex:a}=this.state;let n=a;if(e.which===Keys.ENTER&&s.length>0)this.addTags(s,"default");else if(0===t&&this.props.values.length>0)if(e.which===Keys.ARROW_LEFT||e.which===Keys.ARROW_RIGHT){const t=this.getNextActiveIndex(e.which===Keys.ARROW_RIGHT?1:-1);t!==a&&(e.stopPropagation(),n=t,this.setState({activeIndex:t}))}else e.which===Keys.BACKSPACE?this.handleBackspaceToRemove(e):e.which===Keys.DELETE&&this.handleDeleteToRemove(e);this.invokeKeyPressCallback("onKeyDown",e,n)},this.handleInputKeyUp=e=>{this.invokeKeyPressCallback("onKeyUp",e,this.state.activeIndex)},this.handleInputPaste=e=>{const{separator:t}=this.props,s=e.clipboardData.getData("text");this.props.addOnPaste&&0!==s.length&&!1!==t&&1!==s.split(t).length&&(e.preventDefault(),this.addTags(s,"paste"))},this.handleRemoveTag=e=>{const t=+e.currentTarget.parentElement.getAttribute("data-tag-index");this.removeIndexFromValues(t)}}static getDerivedStateFromProps(e,t){return e.inputValue!==t.prevInputValueProp?{inputValue:e.inputValue,prevInputValueProp:e.inputValue}:null}render(){const{className:e,disabled:t,fill:s,inputProps:a,intent:n,large:i,leftIcon:l,placeholder:o,values:p}=this.props,r=classNames(Classes.INPUT,Classes.TAG_INPUT,{[Classes.ACTIVE]:this.state.isInputFocused,[Classes.DISABLED]:t,[Classes.FILL]:s,[Classes.LARGE]:i},Classes.intentClass(n),e),h=r.indexOf(Classes.LARGE)>-1,u=p.some((e=>!!e)),c=null==o||u?a?.placeholder:o;return React.createElement("div",{className:r,onBlur:this.handleContainerBlur,onClick:this.handleContainerClick},React.createElement(Icon,{className:Classes.TAG_INPUT_ICON,icon:l,size:h?IconSize.LARGE:IconSize.STANDARD}),React.createElement("div",{className:Classes.TAG_INPUT_VALUES},p.map(this.maybeRenderTag),this.props.children,React.createElement("input",Object.assign({value:this.state.inputValue},a,{onFocus:this.handleInputFocus,onChange:this.handleInputChange,onKeyDown:this.handleInputKeyDown,onKeyUp:this.handleInputKeyUp,onPaste:this.handleInputPaste,placeholder:c,ref:this.handleRef,className:classNames(Classes.INPUT_GHOST,a?.className),disabled:t}))),this.props.rightElement)}componentDidUpdate(e){e.inputRef!==this.props.inputRef&&(setRef(e.inputRef,null),this.handleRef=refHandler(this,"inputElement",this.props.inputRef),setRef(this.props.inputRef,this.inputElement))}getNextActiveIndex(e){const{activeIndex:t}=this.state;return-1===t?e<0?this.findNextIndex(this.props.values.length,-1):-1:this.findNextIndex(t,e)}findNextIndex(e,t){const{values:s}=this.props;let a=e+t;for(;a>0&&a<s.length&&!s[a];)a+=t;return Utils.clamp(a,0,s.length)}getValues(e){const{separator:t}=this.props;return(!1===t?[e]:e.split(t)).map((e=>e.trim())).filter((e=>e.length>0))}handleBackspaceToRemove(e){const t=this.state.activeIndex;this.setState({activeIndex:this.getNextActiveIndex(-1)}),this.isValidIndex(t)&&(e.stopPropagation(),this.removeIndexFromValues(t))}handleDeleteToRemove(e){const{activeIndex:t}=this.state;this.isValidIndex(t)&&(e.stopPropagation(),this.removeIndexFromValues(t))}removeIndexFromValues(e){const{onChange:t,onRemove:s,values:a}=this.props;s?.(a[e],e),Utils.isFunction(t)&&t(a.filter(((t,s)=>s!==e)))}invokeKeyPressCallback(e,t,s){this.props[e]?.(t,-1===s?void 0:s),this.props.inputProps[e]?.(t)}isValidIndex(e){return-1!==e&&e<this.props.values.length}};TagInput.displayName=`${DISPLAYNAME_PREFIX}.TagInput`,TagInput.defaultProps={addOnBlur:!1,addOnPaste:!0,inputProps:{},separator:/[,\n\r]/,tagProps:{}},TagInput=__decorate([polyfill],TagInput);export{TagInput};