import{__decorate}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes,refHandler,setRef}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";let TextArea=class extends AbstractPureComponent2{constructor(){super(...arguments),this.state={},this.textareaElement=null,this.handleRef=refHandler(this,"textareaElement",this.props.inputRef),this.handleChange=e=>{this.props.growVertically&&this.setState({height:e.target.scrollHeight}),null!=this.props.onChange&&this.props.onChange(e)}}componentDidMount(){this.props.growVertically&&null!==this.textareaElement&&this.setState({height:this.textareaElement?.scrollHeight})}componentDidUpdate(e){e.inputRef!==this.props.inputRef&&(setRef(e.inputRef,null),this.handleRef=refHandler(this,"textareaElement",this.props.inputRef),setRef(this.props.inputRef,this.textareaElement))}render(){const{className:e,fill:t,inputRef:s,intent:a,large:r,small:l,growVertically:i,...n}=this.props,o=classNames(Classes.INPUT,Classes.intentClass(a),{[Classes.FILL]:t,[Classes.LARGE]:r,[Classes.SMALL]:l},e);let{style:h={}}=n;return i&&null!=this.state.height&&(h={...h,height:`${this.state.height}px`}),React.createElement("textarea",Object.assign({},n,{className:o,onChange:this.handleChange,ref:this.handleRef,style:h}))}};TextArea.displayName=`${DISPLAYNAME_PREFIX}.TextArea`,TextArea=__decorate([polyfill],TextArea);export{TextArea};