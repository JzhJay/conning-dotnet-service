import classNames from"classnames";import*as React from"react";import*as ReactDOM from"react-dom";import{Classes}from"../../common";import{Dialog}from"../../components";import{Hotkey}from"./hotkey";import{Hotkeys}from"./hotkeys";const DELAY_IN_MS=10;class HotkeysDialog{constructor(){this.componentProps={globalHotkeysGroup:"Global hotkeys"},this.container=null,this.hotkeysQueue=[],this.isDialogShowing=!1,this.show=()=>{this.isDialogShowing=!0,this.render()},this.hide=()=>{this.isDialogShowing=!1,this.render()}}render(){null==this.container&&(this.container=this.getContainer()),ReactDOM.render(this.renderComponent(),this.container)}unmount(){null!=this.container&&(ReactDOM.unmountComponentAtNode(this.container),this.container.remove(),this.container=null)}enqueueHotkeysForDisplay(e){this.hotkeysQueue.push(e),window.clearTimeout(this.showTimeoutToken),this.showTimeoutToken=window.setTimeout(this.show,10)}hideAfterDelay(){window.clearTimeout(this.hideTimeoutToken),this.hideTimeoutToken=window.setTimeout(this.hide,10)}isShowing(){return this.isDialogShowing}getContainer(){return null==this.container&&(this.container=document.createElement("div"),this.container.classList.add(Classes.PORTAL),document.body.appendChild(this.container)),this.container}renderComponent(){return React.createElement(Dialog,Object.assign({},this.componentProps,{className:classNames(Classes.HOTKEY_DIALOG,this.componentProps.className),isOpen:this.isDialogShowing,onClose:this.hide}),React.createElement("div",{className:Classes.DIALOG_BODY},this.renderHotkeys()))}renderHotkeys(){const e=this.emptyHotkeyQueue().map(((e,t)=>{const o=!0===e.global&&null==e.group?this.componentProps.globalHotkeysGroup:e.group;return React.createElement(Hotkey,Object.assign({key:t},e,{group:o}))}));return React.createElement(Hotkeys,null,e)}emptyHotkeyQueue(){const e=this.hotkeysQueue.reduce(((e,t)=>e.concat(t)),[]);return this.hotkeysQueue.length=0,e}}const HOTKEYS_DIALOG=new HotkeysDialog;export function isHotkeysDialogShowing(){return HOTKEYS_DIALOG.isShowing()}export function setHotkeysDialogProps(e){for(const t in e)e.hasOwnProperty(t)&&(HOTKEYS_DIALOG.componentProps[t]=e[t])}export function showHotkeysDialog(e){HOTKEYS_DIALOG.enqueueHotkeysForDisplay(e)}export function hideHotkeysDialog(){HOTKEYS_DIALOG.hide()}export function hideHotkeysDialogAfterDelay(){HOTKEYS_DIALOG.hideAfterDelay()}