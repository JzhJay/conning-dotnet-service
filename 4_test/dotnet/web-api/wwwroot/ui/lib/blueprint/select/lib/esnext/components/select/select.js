import classNames from"classnames";import*as React from"react";import{AbstractPureComponent2,Button,DISPLAYNAME_PREFIX,InputGroup,Keys,Popover,Position,refHandler,setRef}from"@blueprintjs/core";import{Classes}from"../../common";import{QueryList}from"../query-list/queryList";export class Select extends AbstractPureComponent2{constructor(){super(...arguments),this.state={isOpen:!1},this.TypedQueryList=QueryList.ofType(),this.inputElement=null,this.queryList=null,this.handleInputRef=refHandler(this,"inputElement",this.props.inputProps?.inputRef),this.handleQueryListRef=e=>this.queryList=e,this.renderQueryList=e=>{const{fill:t,filterable:s=!0,disabled:i=!1,inputProps:n={},popoverProps:o={},matchTargetWidth:r}=this.props;t&&(o.fill=!0),r&&(null==o.modifiers&&(o.modifiers={}),o.modifiers.minWidth={enabled:!0,fn:e=>(e.styles.width=`${e.offsets.reference.width}px`,e),order:800},o.usePortal=!1,o.wrapperTagName="div");const p=React.createElement(InputGroup,Object.assign({leftIcon:"search",placeholder:"Filter...",rightElement:this.maybeRenderClearButton(e.query)},n,{inputRef:this.handleInputRef,onChange:e.handleQueryChange,value:e.query})),{handleKeyDown:a,handleKeyUp:l}=e;return React.createElement(Popover,Object.assign({autoFocus:!1,enforceFocus:!1,isOpen:this.state.isOpen,disabled:i,position:Position.BOTTOM_LEFT},o,{className:classNames(e.className,o.className),onInteraction:this.handlePopoverInteraction,popoverClassName:classNames(Classes.SELECT_POPOVER,o.popoverClassName,{[Classes.SELECT_MATCH_TARGET_WIDTH]:r}),onOpening:this.handlePopoverOpening,onOpened:this.handlePopoverOpened,onClosing:this.handlePopoverClosing}),React.createElement("div",{onKeyDown:this.state.isOpen?a:this.handleTargetKeyDown,onKeyUp:this.state.isOpen?l:void 0},this.props.children),React.createElement("div",{onKeyDown:a,onKeyUp:l},s?p:void 0,e.itemList))},this.handleTargetKeyDown=e=>{e.which!==Keys.ARROW_UP&&e.which!==Keys.ARROW_DOWN||(e.preventDefault(),this.setState({isOpen:!0}))},this.handleItemSelect=(e,t)=>{this.setState({isOpen:!1}),this.props.onItemSelect?.(e,t)},this.handlePopoverInteraction=(e,t)=>{this.setState({isOpen:e}),this.props.popoverProps?.onInteraction?.(e,t)},this.handlePopoverOpening=e=>{this.previousFocusedElement=document.activeElement,this.props.resetOnClose&&this.resetQuery(),this.props.popoverProps?.onOpening?.(e)},this.handlePopoverOpened=e=>{null!=this.queryList&&this.queryList.scrollActiveItemIntoView(),this.requestAnimationFrame((()=>{const{inputProps:e={}}=this.props;!1!==e.autoFocus&&this.inputElement?.focus()})),this.props.popoverProps?.onOpened?.(e)},this.handlePopoverClosing=e=>{this.requestAnimationFrame((()=>{void 0!==this.previousFocusedElement&&(this.previousFocusedElement.focus(),this.previousFocusedElement=void 0)})),this.props.popoverProps?.onClosing?.(e)},this.resetQuery=()=>this.queryList&&this.queryList.setQuery("",!0)}static ofType(){return Select}render(){const{filterable:e,inputProps:t,popoverProps:s,...i}=this.props;return React.createElement(this.TypedQueryList,Object.assign({},i,{onItemSelect:this.handleItemSelect,ref:this.handleQueryListRef,renderer:this.renderQueryList}))}componentDidUpdate(e,t){e.inputProps?.inputRef!==this.props.inputProps?.inputRef&&(setRef(e.inputProps?.inputRef,null),this.handleInputRef=refHandler(this,"inputElement",this.props.inputProps?.inputRef),setRef(this.props.inputProps?.inputRef,this.inputElement)),this.state.isOpen&&!t.isOpen&&null!=this.queryList&&this.queryList.scrollActiveItemIntoView()}maybeRenderClearButton(e){return e.length>0?React.createElement(Button,{icon:"cross",minimal:!0,onClick:this.resetQuery}):void 0}}Select.displayName=`${DISPLAYNAME_PREFIX}.Select`;