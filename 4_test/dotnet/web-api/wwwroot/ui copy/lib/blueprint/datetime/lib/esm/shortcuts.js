import{__extends,__spreadArrays}from"tslib";import*as React from"react";import{Classes,Menu,MenuItem}from"@blueprintjs/core";import{DATERANGEPICKER_SHORTCUTS}from"./common/classes";import{clone,isDayRangeInRange}from"./common/dateUtils";var Shortcuts=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.getShorcutClickHandler=function(t,r){return function(){(0,e.props.onShortcutClick)(t,r)}},e.isShortcutInRange=function(t){var r=e.props,n=r.minDate,a=r.maxDate;return isDayRangeInRange(t,[n,a])},e}return __extends(e,t),e.prototype.render=function(){var t=this,e=(!0===this.props.shortcuts?createDefaultShortcuts(this.props.allowSingleDayRange,void 0!==this.props.timePrecision,!0===this.props.useSingleDateShortcuts):this.props.shortcuts).map((function(e,r){return React.createElement(MenuItem,{active:t.props.selectedShortcutIndex===r,className:Classes.POPOVER_DISMISS_OVERRIDE,disabled:!t.isShortcutInRange(e.dateRange),key:r,onClick:t.getShorcutClickHandler(e,r),text:e.label})}));return React.createElement(Menu,{className:DATERANGEPICKER_SHORTCUTS,tabIndex:0},e)},e.defaultProps={selectedShortcutIndex:-1},e}(React.PureComponent);export{Shortcuts};function createShortcut(t,e){return{dateRange:e,label:t}}function createDefaultShortcuts(t,e,r){var n=new Date,a=function(t){var e=clone(n);return t(e),e.setDate(e.getDate()+1),e},o=a((function(){return null})),s=a((function(t){return t.setDate(t.getDate()-2)})),c=a((function(t){return t.setDate(t.getDate()-7)})),u=a((function(t){return t.setMonth(t.getMonth()-1)})),i=a((function(t){return t.setMonth(t.getMonth()-3)})),l=a((function(t){return t.setMonth(t.getMonth()-6)})),h=a((function(t){return t.setFullYear(t.getFullYear()-1)})),p=a((function(t){return t.setFullYear(t.getFullYear()-2)})),m=t||r?[createShortcut("Today",[n,e?o:n]),createShortcut("Yesterday",[s,e?n:s])]:[];return __spreadArrays(m,[createShortcut(r?"1 week ago":"Past week",[c,n]),createShortcut(r?"1 month ago":"Past month",[u,n]),createShortcut(r?"3 months ago":"Past 3 months",[i,n])],r?[]:[createShortcut("Past 6 months",[l,n])],[createShortcut(r?"1 year ago":"Past year",[h,n])],r?[]:[createShortcut("Past 2 years",[p,n])])}