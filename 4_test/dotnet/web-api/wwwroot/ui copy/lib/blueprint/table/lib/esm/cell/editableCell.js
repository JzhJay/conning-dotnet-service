import{__assign,__decorate,__extends,__rest}from"tslib";import classNames from"classnames";import*as React from"react";import{DISPLAYNAME_PREFIX,EditableText,Hotkey,Hotkeys,HotkeysTarget,Utils as CoreUtils}from"@blueprintjs/core";import*as Classes from"../common/classes";import{Draggable}from"../interactions/draggable";import{Cell}from"./cell";var EditableCell=function(e){function t(t,a){var s=e.call(this,t,a)||this;return s.refHandlers={cell:function(e){s.cellRef=e}},s.handleKeyPress=function(){!s.state.isEditing&&s.props.isFocused&&s.setState({isEditing:!0,dirtyValue:"",savedValue:s.state.savedValue})},s.handleEdit=function(){s.setState({isEditing:!0,dirtyValue:s.state.savedValue})},s.handleCancel=function(e){s.setState({isEditing:!1,dirtyValue:void 0}),s.invokeCallback(s.props.onCancel,e)},s.handleChange=function(e){s.setState({dirtyValue:e}),s.invokeCallback(s.props.onChange,e)},s.handleConfirm=function(e){s.setState({isEditing:!1,savedValue:e,dirtyValue:void 0}),s.invokeCallback(s.props.onConfirm,e)},s.handleCellActivate=function(e){return!0},s.handleCellDoubleClick=function(e){s.handleEdit()},s.state={isEditing:!1,savedValue:t.value},s}return __extends(t,e),t.prototype.componentDidMount=function(){this.checkShouldFocus()},t.prototype.componentDidUpdate=function(e){var t=!CoreUtils.shallowCompareKeys(this.props,e,{exclude:["style"]})||!CoreUtils.deepCompareKeys(this.props,e,["style"]),a=this.props.value;t&&null!=a&&this.setState({savedValue:a,dirtyValue:a}),this.checkShouldFocus()},t.prototype.shouldComponentUpdate=function(e,t){return!CoreUtils.shallowCompareKeys(this.props,e,{exclude:["style"]})||!CoreUtils.shallowCompareKeys(this.state,t)||!CoreUtils.deepCompareKeys(this.props,e,["style"])},t.prototype.render=function(){var e,t=this.props,a=(t.onCancel,t.onChange,t.onConfirm,t.truncated),s=t.wrapText,l=t.editableTextProps,n=__rest(t,["onCancel","onChange","onConfirm","truncated","wrapText","editableTextProps"]),o=this.state,i=o.isEditing,r=o.dirtyValue,c=o.savedValue,d=n.interactive||i,p=null;if(i){var u=l?l.className:null;p=React.createElement(EditableText,__assign({},l,{isEditing:!0,className:classNames(Classes.TABLE_EDITABLE_TEXT,Classes.TABLE_EDITABLE_NAME,u),intent:n.intent,minWidth:null,onCancel:this.handleCancel,onChange:this.handleChange,onConfirm:this.handleConfirm,onEdit:this.handleEdit,placeholder:"",selectAllOnFocus:!1,value:r}))}else{var h=classNames(Classes.TABLE_EDITABLE_TEXT,((e={})[Classes.TABLE_TRUNCATED_TEXT]=a,e[Classes.TABLE_NO_WRAP_TEXT]=!s,e));p=React.createElement("div",{className:h},c)}return React.createElement(Cell,__assign({},n,{wrapText:s,truncated:!1,interactive:d,cellRef:this.refHandlers.cell,onKeyPress:this.handleKeyPress}),React.createElement(Draggable,{onActivate:this.handleCellActivate,onDoubleClick:this.handleCellDoubleClick,preventDefault:!1,stopPropagation:d},p))},t.prototype.renderHotkeys=function(){var e=this.props.tabIndex;return React.createElement(Hotkeys,{tabIndex:e},React.createElement(Hotkey,{key:"edit-cell",label:"Edit the currently focused cell",group:"Table",combo:"f2",onKeyDown:this.handleEdit}))},t.prototype.checkShouldFocus=function(){this.props.isFocused&&!this.state.isEditing&&this.cellRef.focus()},t.prototype.invokeCallback=function(e,t){var a=this.props,s=a.rowIndex,l=a.columnIndex;null==e||e(t,s,l)},t.displayName=DISPLAYNAME_PREFIX+".EditableCell",t.defaultProps={truncated:!0,wrapText:!1},__decorate([HotkeysTarget],t)}(React.Component);export{EditableCell};