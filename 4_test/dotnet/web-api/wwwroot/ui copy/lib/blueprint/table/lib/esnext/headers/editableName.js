import classNames from"classnames";import*as React from"react";import{EditableText}from"@blueprintjs/core";import*as Classes from"../common/classes";export class EditableName extends React.PureComponent{constructor(e,t){super(e,t),this.handleEdit=()=>{this.setState({isEditing:!0,dirtyName:this.state.savedName})},this.handleCancel=e=>{this.setState({isEditing:!1,dirtyName:void 0}),this.invokeCallback(this.props.onCancel,e)},this.handleChange=e=>{this.setState({dirtyName:e}),this.invokeCallback(this.props.onChange,e)},this.handleConfirm=e=>{this.setState({isEditing:!1,savedName:e,dirtyName:void 0}),this.invokeCallback(this.props.onConfirm,e)},this.state={dirtyName:e.name,isEditing:!1,savedName:e.name}}componentDidUpdate(e){const{name:t}=this.props;t!==e.name&&this.setState({savedName:t,dirtyName:t})}render(){const{className:e,intent:t,name:a}=this.props,{isEditing:s,dirtyName:i,savedName:n}=this.state;return React.createElement(EditableText,{className:classNames(e,Classes.TABLE_EDITABLE_NAME),defaultValue:a,intent:t,minWidth:null,onCancel:this.handleCancel,onChange:this.handleChange,onConfirm:this.handleConfirm,onEdit:this.handleEdit,placeholder:"",selectAllOnFocus:!0,value:s?i:n})}invokeCallback(e,t){const{index:a}=this.props;e?.(t,a)}}