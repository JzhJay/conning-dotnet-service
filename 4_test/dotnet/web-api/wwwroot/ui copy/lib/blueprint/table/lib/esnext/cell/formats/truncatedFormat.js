import classNames from"classnames";import*as React from"react";import{DISPLAYNAME_PREFIX,Icon,Popover,Position}from"@blueprintjs/core";import*as Classes from"../../common/classes";import{Utils}from"../../common/utils";import{Locator}from"../../locator";const CONTENT_DIV_WIDTH_DELTA=25;export var TruncatedPopoverMode;!function(e){e.ALWAYS="always",e.NEVER="never",e.WHEN_TRUNCATED="when-truncated",e.WHEN_TRUNCATED_APPROX="when-truncated-approx"}(TruncatedPopoverMode||(TruncatedPopoverMode={}));export class TruncatedFormat extends React.PureComponent{constructor(){super(...arguments),this.state={isPopoverOpen:!1,isTruncated:!1},this.handleContentDivRef=e=>this.contentDiv=e,this.handlePopoverOpen=()=>{this.setState({isPopoverOpen:!0})},this.handlePopoverClose=()=>{this.setState({isPopoverOpen:!1})}}componentDidMount(){this.setTruncationState()}componentDidUpdate(){this.setTruncationState()}render(){const{children:e,detectTruncation:t,truncateLength:o,truncationSuffix:s}=this.props,r=""+e;let n=r;if(!t&&o>0&&n.length>o&&(n=n.substring(0,o)+s),this.shouldShowPopover(r)){const e=classNames(this.props.className,Classes.TABLE_TRUNCATED_FORMAT);return React.createElement("div",{className:e},React.createElement("div",{className:Classes.TABLE_TRUNCATED_VALUE,ref:this.handleContentDivRef},n),this.renderPopover())}{const e=classNames(this.props.className,Classes.TABLE_TRUNCATED_FORMAT_TEXT);return React.createElement("div",{className:e,ref:this.handleContentDivRef},n)}}renderPopover(){const{children:e,preformatted:t}=this.props;if(this.state.isPopoverOpen){const o=classNames(Classes.TABLE_TRUNCATED_POPOVER,t?Classes.TABLE_POPOVER_WHITESPACE_PRE:Classes.TABLE_POPOVER_WHITESPACE_NORMAL),s=React.createElement("div",{className:o},e);return React.createElement(Popover,{className:Classes.TABLE_TRUNCATED_POPOVER_TARGET,modifiers:{preventOverflow:{boundariesElement:"window"}},content:s,position:Position.BOTTOM,isOpen:!0,onClose:this.handlePopoverClose},React.createElement(Icon,{icon:"more"}))}return React.createElement("span",{className:Classes.TABLE_TRUNCATED_POPOVER_TARGET,onClick:this.handlePopoverOpen},React.createElement(Icon,{icon:"more"}))}shouldShowPopover(e){const{detectTruncation:t,measureByApproxOptions:o,showPopover:s,truncateLength:r}=this.props;switch(s){case TruncatedPopoverMode.ALWAYS:return!0;case TruncatedPopoverMode.NEVER:return!1;case TruncatedPopoverMode.WHEN_TRUNCATED:return t?this.state.isTruncated:r>0&&e.length>r;case TruncatedPopoverMode.WHEN_TRUNCATED_APPROX:if(!t)return r>0&&e.length>r;if(null==this.props.parentCellHeight||null==this.props.parentCellWidth)return!1;const{approximateCharWidth:s,approximateLineHeight:n,cellHorizontalPadding:a,numBufferLines:i}=o,c=this.props.parentCellWidth;return Utils.getApproxCellHeight(e,c,s,n,a,i)>this.props.parentCellHeight;default:return!1}}setTruncationState(){if(!this.props.detectTruncation||this.props.showPopover!==TruncatedPopoverMode.WHEN_TRUNCATED)return;if(void 0===this.contentDiv)return void this.setState({isTruncated:!1});const{isTruncated:e}=this.state,{clientHeight:t,clientWidth:o,scrollHeight:s,scrollWidth:r}=this.contentDiv,n=e?r-25:r,a=e&&n===o||n>o||s>t;this.setState({isTruncated:a})}}TruncatedFormat.displayName=`${DISPLAYNAME_PREFIX}.TruncatedFormat`,TruncatedFormat.defaultProps={detectTruncation:!1,measureByApproxOptions:{approximateCharWidth:8,approximateLineHeight:18,cellHorizontalPadding:2*Locator.CELL_HORIZONTAL_PADDING,numBufferLines:0},preformatted:!1,showPopover:TruncatedPopoverMode.WHEN_TRUNCATED,truncateLength:2e3,truncationSuffix:"..."};