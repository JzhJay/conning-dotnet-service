import classNames from"classnames";import*as React from"react";import{Classes}from"../../common";import{Dialog}from"../dialog/dialog";import{Hotkey}from"./hotkey";import{Hotkeys}from"./hotkeys";export const HotkeysDialog2=({globalGroupName:e="Global",hotkeys:a,...o})=>React.createElement(Dialog,Object.assign({},o,{className:classNames(Classes.HOTKEY_DIALOG,o.className)}),React.createElement("div",{className:Classes.DIALOG_BODY},React.createElement(Hotkeys,null,a.map(((a,o)=>React.createElement(Hotkey,Object.assign({key:o},a,{group:!0===a.global&&null==a.group?e:a.group})))))));