import{__decorate}from"tslib";import classNames from"classnames";import*as React from"react";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Classes,refHandler,setRef}from"../../common";import{DISPLAYNAME_PREFIX}from"../../common/props";const Control=({alignIndicator:e,children:t,className:s,indicatorChildren:a,inline:n,inputRef:i,label:l,labelElement:r,large:o,style:c,type:p,typeClassName:m,tagName:d="label",...h})=>{const C=classNames(Classes.CONTROL,m,{[Classes.DISABLED]:h.disabled,[Classes.INLINE]:n,[Classes.LARGE]:o},Classes.alignmentClass(e),s);return React.createElement(d,{className:C,style:c},React.createElement("input",Object.assign({},h,{ref:i,type:p})),React.createElement("span",{className:Classes.CONTROL_INDICATOR},a),l,r,t)};let Switch=class extends AbstractPureComponent2{render(){const{innerLabelChecked:e,innerLabel:t,...s}=this.props,a=t||e?[React.createElement("div",{key:"checked",className:Classes.CONTROL_INDICATOR_CHILD},React.createElement("div",{className:Classes.SWITCH_INNER_TEXT},e||t)),React.createElement("div",{key:"unchecked",className:Classes.CONTROL_INDICATOR_CHILD},React.createElement("div",{className:Classes.SWITCH_INNER_TEXT},t))]:null;return React.createElement(Control,Object.assign({},s,{type:"checkbox",typeClassName:Classes.SWITCH,indicatorChildren:a}))}};Switch.displayName=`${DISPLAYNAME_PREFIX}.Switch`,Switch=__decorate([polyfill],Switch);export{Switch};let Radio=class extends AbstractPureComponent2{render(){return React.createElement(Control,Object.assign({},this.props,{type:"radio",typeClassName:Classes.RADIO}))}};Radio.displayName=`${DISPLAYNAME_PREFIX}.Radio`,Radio=__decorate([polyfill],Radio);export{Radio};let Checkbox=class extends AbstractPureComponent2{constructor(){super(...arguments),this.state={indeterminate:this.props.indeterminate||this.props.defaultIndeterminate||!1},this.input=null,this.handleInputRef=refHandler(this,"input",this.props.inputRef),this.handleChange=e=>{const{indeterminate:t}=e.target;null==this.props.indeterminate&&this.setState({indeterminate:t}),this.props.onChange?.(e)}}static getDerivedStateFromProps({indeterminate:e}){return null!=e?{indeterminate:e}:null}render(){const{defaultIndeterminate:e,indeterminate:t,...s}=this.props;return React.createElement(Control,Object.assign({},s,{inputRef:this.handleInputRef,onChange:this.handleChange,type:"checkbox",typeClassName:Classes.CHECKBOX}))}componentDidMount(){this.updateIndeterminate()}componentDidUpdate(e){this.updateIndeterminate(),e.inputRef!==this.props.inputRef&&(setRef(e.inputRef,null),this.handleInputRef=refHandler(this,"input",this.props.inputRef),setRef(this.props.inputRef,this.input))}updateIndeterminate(){null!=this.input&&(this.input.indeterminate=this.state.indeterminate)}};Checkbox.displayName=`${DISPLAYNAME_PREFIX}.Checkbox`,Checkbox=__decorate([polyfill],Checkbox);export{Checkbox};