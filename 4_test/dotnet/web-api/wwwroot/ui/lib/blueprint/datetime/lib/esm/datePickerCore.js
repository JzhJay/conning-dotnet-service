import{Months}from"./common/months";export var DISABLED_MODIFIER="disabled";export var HOVERED_RANGE_MODIFIER="hovered-range";export var OUTSIDE_MODIFIER="outside";export var SELECTED_MODIFIER="selected";export var SELECTED_RANGE_MODIFIER="selected-range";export var DISALLOWED_MODIFIERS=[DISABLED_MODIFIER,HOVERED_RANGE_MODIFIER,OUTSIDE_MODIFIER,SELECTED_MODIFIER,SELECTED_RANGE_MODIFIER];export function getDefaultMaxDate(){var e=new Date;return e.setFullYear(e.getFullYear()),e.setMonth(Months.DECEMBER,31),e}export function getDefaultMinDate(){var e=new Date;return e.setFullYear(e.getFullYear()-20),e.setMonth(Months.JANUARY,1),e}export function combineModifiers(e,t){var E=e;if(null!=t){E={};for(var r=0,D=Object.keys(t);r<D.length;r++){var I=D[r];-1===DISALLOWED_MODIFIERS.indexOf(I)&&(E[I]=t[I])}for(var o=0,a=Object.keys(e);o<a.length;o++)E[I=a[o]]=e[I]}return E}